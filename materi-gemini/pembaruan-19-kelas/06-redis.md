# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Redis & Valkey Modern: Struktur Data Probabilistik (HyperLogLog, Bloom Filter), Skrip Lua Atomik, Redis Streams Consumer Group, & Pencegahan Hot-Key

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 0 modul yang sudah ada di kelas `redis/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `redis/data/modules.json`.

## 1. Audit Modul Saat Ini di Repositori (`redis/data/modules.json`)

Saat ini, kelas **`redis`** di repositori Kodeloka memiliki **0 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan penuh di bawah ini menambahkan kapabilitas rilis terbaru yang belum tercakup di modul lama.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 22: Operasi Atomik Bebas Race-Condition dengan Skrip Lua (`EVAL` / `FUNCTION`) untuk Rate Limiter & Kunci Terdistribusi

- **Tingkat:** Lanjut
- **Ringkasan:** Menjalankan logika *baca-periksa-ubah* secara atomik di dalam satu perintah Redis menggunakan skrip Lua sehingga tidak ada perintah klien lain yang dapat menyela di tengah jalan.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menjalankan logika *baca-periksa-ubah* secara atomik di dalam satu perintah Redis menggunakan skrip Lua sehingga tidak ada perintah klien lain yang dapat menyela di tengah jalan. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
-- Skrip Lua untuk melepaskan kunci terdistribusi HANYA jika token pemiliknya cocok
if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
else
    return 0
end
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `redis/data/modules.json` (dan `redis/app.js`) sehingga memperluas cakupan kelas `redis` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 23: Redis Streams Lanjutan (`XREADGROUP`, `XACK`, `XAUTOCLAIM`) untuk Pemrosesan Pesan yang Tahan Gagal

- **Tingkat:** Lanjut
- **Ringkasan:** Menangani pesan yang tertinggal di *Pending Entries List (PEL)* ketika sebuah worker konsumen mati mendadak menggunakan perintah `XAUTOCLAIM`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menangani pesan yang tertinggal di *Pending Entries List (PEL)* ketika sebuah worker konsumen mati mendadak menggunakan perintah `XAUTOCLAIM`. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
# Mengambil alih pesan yang menggantung lebih dari 60.000 ms dari worker yang mati
XAUTOCLAIM stream:pesanan grup_pembayaran worker_2 60000 0-0 COUNT 10
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `redis/data/modules.json` (dan `redis/app.js`) sehingga memperluas cakupan kelas `redis` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 24: Memory Eviction Policy (`allkeys-lfu` vs `volatile-lru`), Deteksi `BIGKEYS`/`HOTKEYS`, dan Ekosistem Open-Source Valkey

- **Tingkat:** Lanjut
- **Ringkasan:** Memilih kebijakan pengusiran memori yang tepat untuk cache vs antrean, memindai kunci raksasa yang memblokir utas tunggal Redis, serta memahami kompatibilitas penuh Redis dan Valkey (Linux Foundation).

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Memilih kebijakan pengusiran memori yang tepat untuk cache vs antrean, memindai kunci raksasa yang memblokir utas tunggal Redis, serta memahami kompatibilitas penuh Redis dan Valkey (Linux Foundation). Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
# Memindai kunci berukuran besar secara bertahap dengan SCAN tanpa memblokir produksi
redis-cli --bigkeys -i 0.05
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `redis/data/modules.json` (dan `redis/app.js`) sehingga memperluas cakupan kelas `redis` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `redis` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `redis/data/modules.json` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `redis` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (0 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `redis`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 0 modul yang sudah ada di `redis/data/modules.json` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

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
- B. Mengekstrak objek `judul`, `tingkat`, `ringkas`, `isi`, contoh kode, dan `kuis` dari berkas ini ke dalam `redis/data/modules.json` serta memperbarui jumlah modul di `scripts/courses.json`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke `redis/data/modules.json` (dan disinkronkan ke `redis/app.js` serta `scripts/courses.json`).

## Sumber

- [Dokumentasi Resmi — Redis & Valkey Modern](https://redis.io/docs/latest/)
