# Kodeloka

Kelas pemrograman, backend, dan DevOps berbahasa Indonesia: 23 kelas dan 637 modul, gratis dan tanpa akun.
Kodeloka bagian dari [Asadin Edu](https://asadinedu.com/), bersama Biotaloka, Kimialoka, Fisikaloka, dan Mitoloka.

Situs: <https://kodeloka.asadinedu.com/>

| Bidang | Kelas |
|---|---|
| Bahasa & Framework | HTML, CSS, JavaScript, PHP, Golang (267 bab), FastAPI, Next.js 16, Microservices |
| Data & Pesan | PostgreSQL, Redis, Apache Kafka, RabbitMQ |
| Infrastruktur | Nginx, Docker, Kubernetes, Kong API Gateway, Git & CI/CD |
| Keamanan & Sistem | Linux & Shell, Keamanan Aplikasi |
| Observabilitas & Uji | OpenTelemetry, Prometheus, Grafana, k6 |

Setiap kelas berisi materi tertulis, contoh perintah atau kode, latihan atau simulator, dan kuis. Progres, penanda, dan
catatan disimpan di `localStorage` peramban. Editor Golang menjalankan kode lewat Go Playground resmi.

## Struktur

- `index.html`: beranda dan katalog kelas.
- `<kelas>/`: satu folder per kelas (`index.html`, `style.css`, `app.js`). Kelas memakai lima mesin berbeda; data modul
  ada di `app.js` masing-masing.
- `assets/learning.css`, `assets/learning.js`: tema dan navigasi bersama (menu ponsel, tab, tautan `#modul-N`).
- `assets/videos.js`: tab Video bersama. Setiap ID video sudah dicek ke YouTube, dan modul tanpa video yang membahas
  topiknya menampilkan keterangan, bukan video lain.
- `scripts/courses.json`: nama, judul SEO, dan deskripsi tiap kelas.
- `scripts/extract-modules.mjs`: membaca setiap modul lewat browser dan menulis `data/modules.json` serta
  `data/catalog.json`.
- `scripts/build.mjs`: menulis `dist/` (metadata, JSON-LD, katalog beranda dalam HTML, halaman artikel per modul di
  `/<kelas>/materi/`, `sitemap.xml`, `robots.txt`, `404.html`, `_headers`, manifest).

## Perintah

```bash
npm install
npx playwright install chromium   # sekali, untuk ekstraksi dan tes browser
npm run dev                       # sumber apa adanya di http://127.0.0.1:8790/
npm run extract                   # wajib setelah mengubah materi kelas
npm run build                     # dist/
npm run preview                   # build lalu sajikan dist/
npm test                          # build + tes tautan/metadata + tes browser
```

`SITE_URL` (bawaan `https://kodeloka.asadinedu.com`) dan `GOOGLE_SITE_VERIFICATION` dibaca saat build.

## Deploy

CI (`checks.yml`) menjalankan build, tes, dan memastikan `data/` sesuai dengan isi kelas. `deploy.yml` menerbitkan
`dist/` ke Cloudflare Pages setelah CI lulus di `main`, begitu repo punya variabel `CLOUDFLARE_PAGES_PROJECT` dan
secret `CLOUDFLARE_API_TOKEN` serta `CLOUDFLARE_ACCOUNT_ID`. Sebelum itu, situs diterbitkan dengan mode `kodeloka`
pada workflow `asadinedu-domains.yml` di repo `asadin-edu-mitoloka`.

## Video pendamping

Video berasal dari kanal pemiliknya: freeCodeCamp.org, Corey Schafer, JavaScript Mastery, Programming with Mosh,
TechWorld with Nana, Programmer Zaman Now, dan Kong. Kodeloka tidak berafiliasi dengan kanal tersebut.

## Lisensi

Kode: MIT (lihat `LICENSE`).
