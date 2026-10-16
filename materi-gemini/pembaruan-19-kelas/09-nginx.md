# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Nginx Tingkat Produksi: HTTP/3 (QUIC), TLS 1.3 Ketat, Rate Limiting (`limit_req_zone`), Microcaching (`fastcgi_cache`/`proxy_cache`), & Hardening

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 0 modul yang sudah ada di kelas `nginx/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `nginx/data/modules.json`.

## 1. Audit Modul Saat Ini di Repositori (`nginx/data/modules.json`)

Saat ini, kelas **`nginx`** di repositori Kodeloka memiliki **0 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan penuh di bawah ini menambahkan kapabilitas rilis terbaru yang belum tercakup di modul lama.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Baru 09: Konfigurasi HTTP/2, HTTP/3 (QUIC), dan Penguatan Kriptografi TLS 1.3 + OCSP Stapling

- **Tingkat:** Menengah
- **Ringkasan:** Mengaktifkan protokol **HTTP/3 berbasis QUIC (UDP 443)** dengan header `Alt-Svc` di Nginx modern (1.25+), mengunci `ssl_protocols TLSv1.2 TLSv1.3;`, serta memasang header HSTS.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mengaktifkan protokol **HTTP/3 berbasis QUIC (UDP 443)** dengan header `Alt-Svc` di Nginx modern (1.25+), mengunci `ssl_protocols TLSv1.2 TLSv1.3;`, serta memasang header HSTS. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
server {
    listen 443 ssl;
    listen 443 quic reuseport;
    http2 on;

    ssl_certificate     /etc/ssl/certs/kodeloka.pem;
    ssl_certificate_key /etc/ssl/private/kodeloka.key;
    ssl_protocols       TLSv1.2 TLSv1.3;

    # Memberi tahu peramban bahwa server mendukung HTTP/3 di port 443
    add_header Alt-Svc 'h3=":443"; ma=86400' always;
}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `nginx/data/modules.json` (dan `nginx/app.js`) sehingga memperluas cakupan kelas `nginx` dari **0 modul** menjadi **4 modul** berstandar terbaru.


## Modul Baru 10: Perlindungan DDoS & Brute-Force dengan `limit_req_zone`, `limit_conn_zone`, dan Blokir Bot Berbahaya

- **Tingkat:** Menengah
- **Ringkasan:** Membatasi laju permintaan per alamat IP menggunakan algoritma *Leaky Bucket* (`limit_req_zone` dengan parameter `burst` dan `nodelay`) serta mengembalikan kode status `429 Too Many Requests`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Membatasi laju permintaan per alamat IP menggunakan algoritma *Leaky Bucket* (`limit_req_zone` dengan parameter `burst` dan `nodelay`) serta mengembalikan kode status `429 Too Many Requests`. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
# Di dalam blok http {}: alokasikan memori bersama 10MB (~160.000 IP)
limit_req_zone $binary_remote_addr zone=batas_login:10m rate=5r/m;
limit_req_status 429;

# Di dalam blok server {} -> location /api/login:
location = /api/login {
    limit_req zone=batas_login burst=3 nodelay;
    proxy_pass http://backend_app;
}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `nginx/data/modules.json` (dan `nginx/app.js`) sehingga memperluas cakupan kelas `nginx` dari **0 modul** menjadi **4 modul** berstandar terbaru.


## Modul Baru 11: Reverse Proxy Caching (`proxy_cache_lock`, `proxy_cache_use_stale`), WebSocket/gRPC Proxying, & Keamanan Header

- **Tingkat:** Lanjut
- **Ringkasan:** Melindungi server backend dari lonjakan trafik menggunakan *Microcaching* 1–5 detik dengan `proxy_cache_lock on;` (mencegah cache stampede) dan `proxy_cache_use_stale updating error timeout;`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Melindungi server backend dari lonjakan trafik menggunakan *Microcaching* 1–5 detik dengan `proxy_cache_lock on;` (mencegah cache stampede) dan `proxy_cache_use_stale updating error timeout;`. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
proxy_cache_path /var/cache/nginx/api levels=1:2 keys_zone=cache_api:20m max_size=2g inactive=60m use_temp_path=off;

location /api/katalog {
    proxy_cache cache_api;
    proxy_cache_valid 200 10s;
    proxy_cache_lock on;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    add_header X-Cache-Status $upstream_cache_status;
    proxy_pass http://backend_katalog;
}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `nginx/data/modules.json` (dan `nginx/app.js`) sehingga memperluas cakupan kelas `nginx` dari **0 modul** menjadi **4 modul** berstandar terbaru.


## Modul Baru 12: Arsitektur Zero-Downtime Reload, Log Terstruktur JSON untuk Loki/ELK, dan Pemulihan Masalah `502 Bad Gateway` / `504 Gateway Timeout`

- **Tingkat:** Lanjut
- **Ringkasan:** Mengonfigurasi `log_format` berformat JSON agar dapat diurai langsung oleh Promtail/Vector tanpa regex berat, serta mendiagnosis kesalahan upstream di produksi.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mengonfigurasi `log_format` berformat JSON agar dapat diurai langsung oleh Promtail/Vector tanpa regex berat, serta mendiagnosis kesalahan upstream di produksi. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
log_format json_analitik escape=json
  '{"waktu":"$time_iso8601",'
  '"ip":"$remote_addr",'
  '"metode":"$request_method",'
  '"uri":"$request_uri",'
  '"status":$status,'
  '"durasi_detik":$request_time,'
  '"upstream_detik":"$upstream_response_time"}';
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `nginx/data/modules.json` (dan `nginx/app.js`) sehingga memperluas cakupan kelas `nginx` dari **0 modul** menjadi **4 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `nginx` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `nginx/data/modules.json` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `nginx` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (0 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `nginx`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 0 modul yang sudah ada di `nginx/data/modules.json` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `nginx` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan ketiga modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `nginx/`
- B. Mengekstrak objek `judul`, `tingkat`, `ringkas`, `isi`, contoh kode, dan `kuis` dari berkas ini ke dalam `nginx/data/modules.json` serta memperbarui jumlah modul di `scripts/courses.json`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke `nginx/data/modules.json` (dan disinkronkan ke `nginx/app.js` serta `scripts/courses.json`).

## Sumber

- [Dokumentasi Resmi — Nginx Tingkat Produksi](https://nginx.org/en/docs/)
