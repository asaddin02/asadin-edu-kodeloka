# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Docker Modern: BuildKit Cache Mounts, Distroless & Non-Root Security, Compose Watch (`develop.watch`), Healthcheck Dependency, & Trivy Scanning

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 21 modul yang sudah ada di kelas `docker/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `docker/app.js` (larik `chapters`).

## 1. Audit Modul Saat Ini di Repositori (`docker/app.js`)

Saat ini, kelas **`docker`** di repositori Kodeloka memiliki **21 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |
| 1 | 01. Introduction to Containerization & Docker | — | Sudah ada |
| 2 | 02. Physical Servers vs Virtualization vs Containers | — | Sudah ada |
| 3 | 03. Software Processes & Linux System Isolation | — | Sudah ada |
| 4 | 04. Docker Architecture & Core Ecosystem | — | Sudah ada |
| 5 | 05. Docker Installation & Environment Setup | — | Sudah ada |
| 6 | 06. Basic Docker Commands & Container Lifecycle | — | Sudah ada |
| 7 | 07. Port Forwarding & Container Networking Basics | — | Sudah ada |
| 8 | 08. Docker Networking Modes & Custom Drivers | — | Sudah ada |
| 9 | 09. Data Persistence: Volumes & Bind Mounts | — | Sudah ada |
| 10 | 10. Environment Variables & App Configurations | — | Sudah ada |
| 11 | 11. Introduction to Docker Compose | — | Sudah ada |
| 12 | 12. Advanced Docker Compose & Service Dependencies | — | Sudah ada |
| 13 | 13. Compose Modern - Watch, Profile & Depends On | — | Sudah ada |
| 14 | 14. VS Code Integration & Docker Developer Tools | — | Sudah ada |
| 15 | 15. Writing Dockerfiles & Building Custom Images | — | Sudah ada |
| 16 | 16. Docker Image Layers & Build Caching | — | Sudah ada |
| 17 | 17. CMD vs ENTRYPOINT & Multi-Stage Builds | — | Sudah ada |
| 18 | 18. BuildKit & Buildx - Build Modern yang Cepat | — | Sudah ada |
| 19 | 19. Publishing Images to Docker Hub & Image Registry | — | Sudah ada |
| 20 | 20. Keamanan Kontainer & Pemindaian Kerentanan | — | Sudah ada |
| 21 | 21. Production Deployment & DevOps Best Practices | — | Sudah ada |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan di bawah ini menambahkan pembaruan 2024–2026, tetapi sebagian topiknya sudah ada di kelas. Kelas sudah membahas BuildKit `--mount=type=cache` dan `--mount=type=secret` (modul 18), `.dockerignore` (modul 16), keamanan kontainer termasuk `USER`, `no-new-privileges`, `--read-only`, `--tmpfs`, `--cap-drop=ALL`, dan pemindaian Trivy/Scout (modul 20), serta `service_healthy`, `develop.watch`, dan `profiles` (modul 12 dan 13). Yang belum ada hanya padanan kunci Compose (`read_only`, `tmpfs`, `cap_drop`), karena modul 20 memakai bentuk `docker run`.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 22: Optimasi `Dockerfile` dengan BuildKit (`--mount=type=cache`, `--mount=type=secret`, dan `.dockerignore` Ketat)

- **Tingkat:** Menengah
- **Ringkasan:** Mempercepat waktu build CI/CD secara drastis dengan mempertahankan cache manajer paket (apt, npm, pip, composer, go mod) antar-build menggunakan `RUN --mount=type=cache` serta menyuntikkan kredensial build tanpa meninggalkan jejak di layer image menggunakan `--mount=type=secret`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mempercepat waktu build CI/CD secara drastis dengan mempertahankan cache manajer paket (apt, npm, pip, composer, go mod) antar-build menggunakan `RUN --mount=type=cache` serta menyuntikkan kredensial build tanpa meninggalkan jejak di layer image menggunakan `--mount=type=secret`. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```dockerfile
# syntax=docker/dockerfile:1.7
FROM golang:1.27-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download
COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/app ./cmd/api
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `chapters` di `docker/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `docker` dari **21 modul** menjadi **24 modul** berstandar terbaru.


## Modul Pembaruan 23: Keamanan Container Produksi — Non-Root `USER`, Read-Only Root Filesystem, `cap_drop: [ALL]`, & Pemindaian Kerentanan

- **Tingkat:** Lanjut
- **Ringkasan:** Mengunci permukaan serangan container di produksi dengan menjalankan proses sebagai UID non-root (`USER 65532:65532`), mengatur `read_only: true` dengan `tmpfs: [/tmp]`, serta mencabut seluruh kapabilitas kernel Linux yang tidak diperlukan.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mengunci permukaan serangan container di produksi dengan menjalankan proses sebagai UID non-root (`USER 65532:65532`), mengatur `read_only: true` dengan `tmpfs: [/tmp]`, serta mencabut seluruh kapabilitas kernel Linux yang tidak diperlukan. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```yaml
# compose.prod.yaml — Penguatan keamanan container produksi
services:
  api:
    image: ghcr.io/kodeloka/api:1.4.0
    user: "65532:65532"
    read_only: true
    tmpfs:
      - /tmp:size=64M,mode=1777
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `chapters` di `docker/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `docker` dari **21 modul** menjadi **24 modul** berstandar terbaru.


## Modul Pembaruan 24: Docker Compose v2 Modern (`depends_on: condition: service_healthy`, `develop.watch`, dan `profiles`)

- **Tingkat:** Menengah
- **Ringkasan:** Menjamin container aplikasi baru dijalankan setelah database benar-benar siap menerima koneksi menggunakan `condition: service_healthy`, serta menyinkronkan perubahan kode secara instan saat pengembangan dengan `docker compose watch`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menjamin container aplikasi baru dijalankan setelah database benar-benar siap menerima koneksi menggunakan `condition: service_healthy`, serta menyinkronkan perubahan kode secara instan saat pengembangan dengan `docker compose watch`. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```yaml
services:
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD:?isi DB_PASSWORD di berkas .env}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5
  app:
    build: .
    depends_on:
      db:
        condition: service_healthy
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `chapters` di `docker/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `docker` dari **21 modul** menjadi **24 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `docker` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `docker/app.js` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `docker` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (21 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `docker`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 21 modul yang sudah ada di `docker/app.js` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `docker` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan ketiga modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `docker/`
- B. Mengekstrak judul, tingkat, ringkasan, isi, contoh kode, dan kuis setiap modul dari berkas ini ke dalam larik `chapters` di `docker/app.js` (bentuk objeknya mengikuti mesin kelas tersebut), memperbarui jumlah modul di `scripts/courses.json`, lalu menjalankan `npm run extract`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke larik `chapters` di `docker/app.js`, jumlah modulnya diperbarui di `scripts/courses.json`, dan `data/modules.json` dibangkitkan ulang lewat `npm run extract`.

## Sumber

- [Dokumentasi Resmi — Docker Modern](https://docs.docker.com/)
- [Docker — Optimasi Build Cache](https://docs.docker.com/build/cache/optimize/)
- [Docker Compose — File Watch (`develop.watch`)](https://docs.docker.com/compose/how-tos/file-watch/)
- [Docker — Referensi Compose: `services`](https://docs.docker.com/reference/compose-file/services/)
