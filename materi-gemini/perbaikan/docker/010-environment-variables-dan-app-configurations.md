# Perbaikan: Environment Variables & App Configurations

- **Kelas:** docker
- **Modul:** 10
- **Jenis:** tambahan

## Yang kurang
Materi saat ini hanya 108 kata. Belum menjelaskan perbedaan krusial antara variabel waktu pembangunan (**`ARG`** di `Dockerfile`) dan variabel waktu jalan (**`ENV`** / `--env-file`), bahaya menyimpan rahasia di dalam `ARG` atau `ENV` pada `Dockerfile` (karena nilainya terekam permanen di metadata `docker history` / `docker inspect`), serta pola penyuntikan rahasia melalui berkas *mount* (`_FILE` / Docker Compose `secrets`).

## Materi tambahan
Letakkan di akhir materi (setelah peringatan `.gitignore`).

### 3. Perbedaan `ARG` (Build-Time) vs `ENV` (Run-Time)

Saat menulis `Dockerfile` dan menjalankan kontainer, pahami kapan sebuah variabel tersedia dan apakah nilainya tertinggal di dalam citra (*image*):

| Mekanisme | Tersedia Saat `docker build`? | Tersedia Saat `docker run` (Aplikasi Berjalan)? | Terekam di Metadata Citra (`docker inspect`)? |
| :--- | :--- | :--- | :--- |
| `ARG` di `Dockerfile` | Ya | Tidak (kecuali disalin ke `ENV`) | Ya, terlihat di riwayat lapisan (`docker history`)! |
| `ENV` di `Dockerfile` | Ya | Ya (menjadi nilai bawaan yang dapat ditimpa `-e`) | Ya, terlihat jelas di `docker inspect`! |
| Flag `-e` / `--env-file` saat `docker run` | Tidak | Ya (hanya pada instans kontainer tersebut) | Tidak masuk ke citra, tetapi terlihat bila seseorang menjalankan `docker inspect <container>` |
| Docker Secrets / Mount Berkas (`/run/secrets/...`) | Tidak | Ya, dibaca dari sistem berkas memori sementara (`tmpfs`) | **Paling aman** — tidak bocor lewat variabel lingkungan maupun `docker inspect` |

### 4. Pola Konfigurasi Kata Sandi dengan Akhiran `_FILE` (Docker Secrets)

Citra resmi seperti `postgres`, `mysql`, dan `mariadb` mendukung pembacaan kata sandi dari berkas menggunakan akhiran `_FILE` (misalnya `POSTGRES_PASSWORD_FILE=/run/secrets/db_password`). Dengan cara ini, kata sandi basis data tidak pernah terpampang di daftar variabel lingkungan proses:

```yaml
# compose.yaml dengan Docker Secrets berbasis berkas lokal
services:
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: app_user
      POSTGRES_DB: kodeloka_prod
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

## Sumber
- [Docker Documentation — Environment variables in Docker Compose](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/)
- [Docker Documentation — How to use secrets in Docker Compose](https://docs.docker.com/compose/how-tos/use-secrets/)
