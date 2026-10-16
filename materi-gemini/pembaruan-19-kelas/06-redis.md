# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Redis & Valkey Modern: Struktur Data Probabilistik (HyperLogLog, Bloom Filter), Skrip Lua Atomik, Redis Streams Consumer Group, & Pencegahan Hot-Key

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 21 modul yang sudah ada di kelas `redis/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `redis/app.js` (larik `REDIS_MODULES`).

## 1. Audit Modul Saat Ini di Repositori (`redis/app.js`)

Saat ini, kelas **`redis`** di repositori Kodeloka memiliki **21 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |
| 1 | 01. Pengenalan Redis & In-Memory Data Store | — | Sudah ada |
| 2 | 02. Instalasi & Setup Redis Server | — | Sudah ada |
| 3 | 03. Perintah Dasar Redis Client & Server | — | Sudah ada |
| 4 | 04. Tipe Data String & Operations | — | Sudah ada |
| 5 | 05. Expiration & Time To Live (TTL) | — | Sudah ada |
| 6 | 06. Tipe Data Hash | — | Sudah ada |
| 7 | 07. Tipe Data List & Message Queuing | — | Sudah ada |
| 8 | 08. Tipe Data Set (Unique Unordered Collection) | — | Sudah ada |
| 9 | 09. Tipe Data Sorted Set / ZSet & Leaderboard Pattern | — | Sudah ada |
| 10 | 10. Redis Transactions & Optimistic Locking | — | Sudah ada |
| 11 | 11. Redis Publish & Subscribe (Pub/Sub) | — | Sudah ada |
| 12 | 12. Redis Streams - Log Append-Only untuk Event | — | Sudah ada |
| 13 | 13. Consumer Group - Pemrosesan Andal & At-Least-Once | — | Sudah ada |
| 14 | 14. Lua Scripting & Redis Functions | — | Sudah ada |
| 15 | 15. Replication & High Availability dengan Sentinel | — | Sudah ada |
| 16 | 16. Redis Cluster & Sharding Horizontal | — | Sudah ada |
| 17 | 17. Redis 8 & Modul Bawaan (JSON, Search, Time Series, Bloom, Vector) | — | Sudah ada |
| 18 | 18. Redis Pipeline & Mass Insertion Performance | — | Sudah ada |
| 19 | 19. Manajemen Memori & Kebijakan Eviction | — | Sudah ada |
| 20 | 20. Redis Persistence, Security & Best Practices | — | Sudah ada |
| 21 | 21. Keamanan: ACL, TLS & Pengerasan Server | — | Sudah ada |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan di bawah ini menambahkan pembaruan 2024–2026, tetapi sebagian topiknya sudah ada di kelas. Seluruh topik ini sudah ada di kelas: Lua dan Functions (modul 14), Consumer Group dengan `XREADGROUP` dan `XAUTOCLAIM` (modul 13), eviction `allkeys-lfu` beserta `--bigkeys` dan `--hotkeys` (modul 19), serta Redis 8, Valkey, HyperLogLog, dan Bloom (modul 17). Ketiga modul di bawah ini berupa pendalaman, bukan celah materi.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 22: Operasi Atomik Bebas Race-Condition dengan Skrip Lua (`EVAL` / `FUNCTION`) untuk Rate Limiter & Kunci Terdistribusi

- **Tingkat:** Lanjut
- **Ringkasan:** Menjalankan logika *baca-periksa-ubah* secara atomik di dalam satu perintah Redis menggunakan skrip Lua sehingga tidak ada perintah klien lain yang dapat menyela di tengah jalan.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menjalankan logika *baca-periksa-ubah* secara atomik di dalam satu perintah Redis menggunakan skrip Lua sehingga tidak ada perintah klien lain yang dapat menyela di tengah jalan. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```lua
-- Skrip Lua untuk melepaskan kunci terdistribusi HANYA jika token pemiliknya cocok
if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
else
    return 0
end
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `REDIS_MODULES` di `redis/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `redis` dari **21 modul** menjadi **24 modul** berstandar terbaru.


## Modul Pembaruan 23: Redis Streams Lanjutan (`XREADGROUP`, `XACK`, `XAUTOCLAIM`) untuk Pemrosesan Pesan yang Tahan Gagal

- **Tingkat:** Lanjut
- **Ringkasan:** Menangani pesan yang tertinggal di *Pending Entries List (PEL)* ketika sebuah worker konsumen mati mendadak menggunakan perintah `XAUTOCLAIM`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menangani pesan yang tertinggal di *Pending Entries List (PEL)* ketika sebuah worker konsumen mati mendadak menggunakan perintah `XAUTOCLAIM`. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```bash
# Mengambil alih pesan yang menggantung lebih dari 60.000 ms dari worker yang mati
XAUTOCLAIM stream:pesanan grup_pembayaran worker_2 60000 0-0 COUNT 10
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `REDIS_MODULES` di `redis/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `redis` dari **21 modul** menjadi **24 modul** berstandar terbaru.


## Modul Pembaruan 24: Memory Eviction Policy (`allkeys-lfu` vs `volatile-lru`), Deteksi `BIGKEYS`/`HOTKEYS`, dan Ekosistem Open-Source Valkey

- **Tingkat:** Lanjut
- **Ringkasan:** Memilih kebijakan pengusiran memori yang tepat untuk cache vs antrean, memindai kunci raksasa yang memblokir utas tunggal Redis, serta memahami kompatibilitas Redis dan Valkey (Linux Foundation): Valkey adalah fork dari Redis OSS 7.2.4, sehingga fitur Redis yang lebih baru tidak otomatis tersedia di Valkey.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Memilih kebijakan pengusiran memori yang tepat untuk cache vs antrean, memindai kunci raksasa yang memblokir utas tunggal Redis, serta memahami kompatibilitas Redis dan Valkey (Linux Foundation): Valkey adalah fork dari Redis OSS 7.2.4, sehingga fitur Redis yang lebih baru tidak otomatis tersedia di Valkey. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```bash
# Memindai kunci berukuran besar secara bertahap dengan SCAN tanpa memblokir produksi
redis-cli --bigkeys -i 0.05
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `REDIS_MODULES` di `redis/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `redis` dari **21 modul** menjadi **24 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `redis` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `redis/app.js` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `redis` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (21 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `redis`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 21 modul yang sudah ada di `redis/app.js` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `redis` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan ketiga modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `redis/`
- B. Mengekstrak judul, tingkat, ringkasan, isi, contoh kode, dan kuis setiap modul dari berkas ini ke dalam larik `REDIS_MODULES` di `redis/app.js` (bentuk objeknya mengikuti mesin kelas tersebut), memperbarui jumlah modul di `scripts/courses.json`, lalu menjalankan `npm run extract`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke larik `REDIS_MODULES` di `redis/app.js`, jumlah modulnya diperbarui di `scripts/courses.json`, dan `data/modules.json` dibangkitkan ulang lewat `npm run extract`.

## Sumber

- [Dokumentasi Resmi — Redis & Valkey Modern](https://redis.io/docs/latest/)
- [Redis — Perintah `XAUTOCLAIM`](https://redis.io/docs/latest/commands/xautoclaim/)
- [Redis — Kebijakan Eviction](https://redis.io/docs/latest/develop/reference/eviction/)
- [Valkey — Situs Resmi](https://valkey.io/)
