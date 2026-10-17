# Manajemen Rahasia Tanpa Kebocoran Lapisan: *BuildKit Secret Mounts* dan *Docker Compose Secrets*

- **Letak:** sesudah modul 20
- **Tingkat:** Lanjut
- **Ringkasan:** Menyuntikkan token privat pada waktu pembangunan citra menggunakan `RUN --mount=type=secret` tanpa meninggalkan jejak di `docker history`, serta mengelola kredensial waktu jalan dengan blok `secrets:` di Docker Compose.

## Mengapa `ARG` dan `ENV` Tidak Boleh Dipakai untuk Kunci Rahasia?

Saat membangun citra Docker yang perlu mengunduh paket privat (misalnya dari GitHub Packages, GitLab Privat, atau repositori npm internal), banyak pengembang meneruskan token akses melalui `ARG NPM_TOKEN` atau menyalin berkas `.npmrc` lalu menghapusnya pada baris `RUN rm .npmrc` berikutnya. Kedua cara tersebut **membocorkan token secara permanen**:
- Nilai `ARG` tersimpan dalam bentuk teks biasa di dalam metadata konfigurasi citra dan dapat dibaca siapa saja yang menjalankan `docker image history --no-trunc <image>`.
- Berkas yang disalin dengan `COPY` lalu dihapus pada instruksi `RUN` berikutnya tetap abadi di dalam *tarball* lapisan bawah.

## 1. Rahasia Waktu *Build*: `RUN --mount=type=secret` (BuildKit)

Dengan BuildKit, instruksi `RUN --mount=type=secret,id=nama_rahasia` memasang rahasia sebagai berkas sementara di sistem berkas memori (`tmpfs`, bawaannya di `/run/secrets/<id>`) **hanya selama satu instruksi `RUN` tersebut berjalan**, dan tidak pernah terekam ke lapisan citra maupun riwayat *build*:

```dockerfile
# syntax=docker/dockerfile:1
FROM golang:1.27-alpine AS builder
WORKDIR /src

RUN apk add --no-cache git ca-certificates

COPY go.mod go.sum ./

# Memasang token Git privat dari host hanya selama 'go mod download' berjalan.
# Berkas /run/secrets/git_token otomatis lenyap begitu baris RUN ini selesai!
RUN --mount=type=secret,id=git_token \
    git config --global url."https://x-access-token:$(cat /run/secrets/git_token)@github.com/".insteadOf "https://github.com/" \
    && go mod download \
    && rm -f ~/.gitconfig

COPY . .
RUN CGO_ENABLED=0 go build -o /out/app ./cmd/server

FROM alpine:3.21
COPY --from=builder /out/app /usr/local/bin/app
USER 10001:10001
ENTRYPOINT ["/usr/local/bin/app"]
```

Untuk membangun citra dengan menyertakan rahasia dari variabel lingkungan atau berkas lokal:

```bash
# Meneruskan rahasia dari berkas lokal saat docker build:
docker build --secret id=git_token,src=./rahasia_git_token.txt -t kodeloka/api:1.0 .
```

## 2. Rahasia Waktu Jalan (*Run-Time*): Blok `secrets:` pada Docker Compose

Untuk kredensial yang dibutuhkan saat aplikasi berjalan (seperti kata sandi PostgreSQL atau kunci privat JWT), gunakan blok tingkat atas `secrets:` di dalam `compose.yaml`. Docker Compose akan memasang berkas tersebut secara *read-only* di `/run/secrets/<nama_secret>` di dalam kontainer yang diberi izin:

```yaml
services:
  api:
    image: kodeloka/api:1.0
    environment:
      DB_HOST: db
      DB_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - source: db_password
        target: db_password
        uid: "10001"
        gid: "10001"
        mode: 0400

  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: kodeloka
      POSTGRES_DB: kodeloka_db
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

## 3. Perbandingan Mekanisme Penyuntikan Konfigurasi & Rahasia di Docker

| Mekanisme | Tahap Aktif | Terlihat di `docker history` / `inspect`? | Rekomendasi Penggunaan |
| :--- | :--- | :--- | :--- |
| `ARG` / `ENV` di `Dockerfile` | *Build* / *Run* | **Ya (Terbuka)** | Hanya untuk konfigurasi non-rahasia (versi aplikasi, zona waktu, port) |
| `RUN --mount=type=secret` | Hanya saat `docker build` | **Tidak** | Token repositori privat (`npm`, `pip`, `go mod`, `apt`) saat kompilasi |
| Compose `secrets:` (`/run/secrets/*`) | Hanya saat kontainer berjalan | **Tidak** | Kata sandi basis data, kunci penandatanganan JWT, sertifikat TLS privat |

## Kuis Pemahaman

### Soal 1
Mengapa meneruskan token privat menggunakan `docker build --build-arg NPM_TOKEN=rahasia` berbahaya jika citra tersebut didorong ke registri kontainer?
- A. Karena `--build-arg` memperlambat kecepatan unduh jaringan.
- B. Karena nilai `ARG` terekam dalam metadata riwayat pembuatan citra dan dapat dilihat oleh siapa pun yang mengunduh citra tersebut dengan perintah `docker history`.
- C. Karena Docker otomatis memublikasikan nilai `ARG` ke Docker Hub.
- D. Karena `ARG` hanya dapat berisi angka bulat.

**Jawaban Benar:** B
**Penjelasan:** Instruksi `ARG` bukan mekanisme penyimpanan rahasia; nilainya dicatat di dalam riwayat lapisan citra. Gunakan `RUN --mount=type=secret` untuk rahasia waktu pembangunan.

### Soal 2
Di lokasi direktori manakah secara bawaan berkas rahasia dipasang di dalam kontainer ketika Anda menggunakan `RUN --mount=type=secret,id=my_key` atau Docker Compose `secrets`?
- A. `/etc/docker/my_key`
- B. `/var/lib/secrets/my_key`
- C. `/run/secrets/my_key`
- D. `/tmp/public/my_key`

**Jawaban Benar:** C
**Penjelasan:** Baik BuildKit secret mounts maupun Docker Compose secrets memasang rahasia secara bawaan di jalur `/run/secrets/<id>` di atas sistem berkas memori sementara (`tmpfs`).

### Soal 3
Apa fungsi pengaturan `mode: 0400` dan `uid: "10001"` pada pemasangan `secrets:` di berkas `compose.yaml`?
- A. Mengizinkan semua pengguna di dalam kontainer mengubah isi berkas rahasia.
- B. Membatasi agar berkas rahasia hanya dapat dibaca (*read-only*) oleh pengguna kontainer dengan UID `10001` dan tidak dapat dibaca oleh pengguna lain.
- C. Menghapus berkas rahasia setelah 400 detik.
- D. Membuka port TCP 10001 ke jaringan publik.

**Jawaban Benar:** B
**Penjelasan:** Mode izin oktal `0400` berarti hanya pemilik berkas (`uid: "10001"`) yang memiliki hak baca (`r--------`), sesuai prinsip hak akses minimum.

## Sumber
- [Docker Build Documentation — Build secrets (`--mount=type=secret`)](https://docs.docker.com/build/building/secrets/)
- [Docker Compose Documentation — How to use secrets in Docker Compose](https://docs.docker.com/compose/how-tos/use-secrets/)
