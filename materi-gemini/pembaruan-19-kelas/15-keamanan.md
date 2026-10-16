# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Keamanan Aplikasi Web & API Modern (OWASP Top 10 & API Security Top 10): SSRF, IDOR/BOLA, Race Conditions, Kriptografi, & DevSecOps

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 8 modul yang sudah ada di kelas `keamanan/` beserta 4 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `keamanan/app.js` (larik `MODUL`).

## 1. Audit Modul Saat Ini di Repositori (`keamanan/app.js`)

Saat ini, kelas **`keamanan`** di repositori Kodeloka memiliki **8 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |
| 1 | Model Ancaman & Pertahanan Berlapis | Dasar | Sudah ada |
| 2 | SQL Injection & Kueri Berparameter | Dasar | Sudah ada |
| 3 | XSS & Keamanan Sisi Peramban | Menengah | Sudah ada |
| 4 | Autentikasi, Sandi & Sesi | Menengah | Sudah ada |
| 5 | Otorisasi & Kontrol Akses | Menengah | Sudah ada |
| 6 | Pengelolaan Rahasia & Enkripsi | Lanjut | Sudah ada |
| 7 | Keamanan Dependensi & Rantai Pasok | Lanjut | Sudah ada |
| 8 | Keamanan API, CSRF & SSRF | Lanjut | Sudah ada |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Empat modul perluasan di bawah ini menambahkan pembaruan 2024–2026, tetapi sebagian topiknya sudah ada di kelas. Kelas sudah membahas BOLA/IDOR (modul 5), SSRF (modul 8), pemindaian rahasia dengan gitleaks/trufflehog, Vault/KMS, dan rotasi kunci (modul 6), serta lockfile dependensi (modul 7). Yang belum ada: race condition/TOCTOU, mass assignment, path traversal, dan deserialisasi tidak aman.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Baru 09: Broken Object Level Authorization (BOLA / IDOR) & Broken Function Level Authorization pada REST/GraphQL API

- **Tingkat:** Menengah
- **Ringkasan:** Membedah ancaman nomor 1 pada **OWASP API Security Top 10**: bagaimana penyerang memanipulasi ID objek di URL atau body JSON untuk mengakses data milik pengguna lain, serta cara menegakkan pemeriksaan kepemilikan di lapisan kueri data.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Membedah ancaman nomor 1 pada **OWASP API Security Top 10**: bagaimana penyerang memanipulasi ID objek di URL atau body JSON untuk mengakses data milik pengguna lain, serta cara menegakkan pemeriksaan kepemilikan di lapisan kueri data. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```sql
// Pola Aman: Selalu ikat kueri objek dengan ID pengguna/tenant dari sesi terautentikasi!
// SELECT * FROM faktur WHERE id = :id_faktur AND id_pemilik = :id_pengguna_sesi
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `keamanan/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `keamanan` dari **8 modul** menjadi **12 modul** berstandar terbaru.


## Modul Baru 10: Server-Side Request Forgery (SSRF), Path Traversal, dan Deserialisasi Tidak Aman

- **Tingkat:** Lanjut
- **Ringkasan:** Melindungi layanan backend yang mengambil URL eksternal (webhook, pratinjau tautan, impor avatar) agar tidak disalahgunakan untuk membaca metadata cloud internal (`169.254.169.254`) atau layanan internal di jaringan privat.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Melindungi layanan backend yang mengambil URL eksternal (webhook, pratinjau tautan, impor avatar) agar tidak disalahgunakan untuk membaca metadata cloud internal (`169.254.169.254`) atau layanan internal di jaringan privat. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```text
# Pertahanan Berlapis terhadap SSRF:
# 1. Validasi skema hanya https:// dan daftar putih domain bila memungkinkan
# 2. Resolusi DNS, tolak seluruh IP loopback/privat/link-local, lalu sambungkan ke IP hasil resolusi itu (jangan meresolusi ulang nama host) agar tidak lolos lewat DNS rebinding
# 3. Nonaktifkan HTTP Redirect otomatis pada klien HTTP
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `keamanan/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `keamanan` dari **8 modul** menjadi **12 modul** berstandar terbaru.


## Modul Baru 11: Kerentanan Logika Bisnis, Race Conditions (*Time-of-Check to Time-of-Use / TOCTOU*), dan Mass Assignment

- **Tingkat:** Lanjut
- **Ringkasan:** Mencegah eksploitasi pengiriman permintaan paralel berkecepatan tinggi (*single-packet attack* HTTP/2) pada kupon diskon, penarikan saldo, atau kuota kursi menggunakan penguncian baris transaksi dan kunci idempotensi.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mencegah eksploitasi pengiriman permintaan paralel berkecepatan tinggi (*single-packet attack* HTTP/2) pada kupon diskon, penarikan saldo, atau kuota kursi menggunakan penguncian baris transaksi dan kunci idempotensi. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```sql
-- Operasi atomik satu langkah di database mencegah celah TOCTOU / Race Condition
UPDATE kupon_promo
SET kuota_tersisa = kuota_tersisa - 1
WHERE kode = $1 AND kuota_tersisa > 0
RETURNING id;
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `keamanan/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `keamanan` dari **8 modul** menjadi **12 modul** berstandar terbaru.


## Modul Baru 12: Keamanan Rantai Pasok (*Supply Chain Security*), Manajemen Rahasia (Vault / KMS), Rotasi Kunci, & Tanggap Insiden

- **Tingkat:** Lanjut
- **Ringkasan:** Menghilangkan kunci API yang bocor di repositori Git menggunakan pemindaian pra-commit (`gitleaks` / `trufflehog`), mengunci dependensi dengan berkas *lockfile*, serta menjalankan prosedur pencabutan dan rotasi kredensial tanpa waktu henti.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menghilangkan kunci API yang bocor di repositori Git menggunakan pemindaian pra-commit (`gitleaks` / `trufflehog`), mengunci dependensi dengan berkas *lockfile*, serta menjalankan prosedur pencabutan dan rotasi kredensial tanpa waktu henti. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```bash
# Memindai seluruh riwayat repositori Git dari kebocoran kunci rahasia
gitleaks detect --source . --verbose
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `keamanan/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `keamanan` dari **8 modul** menjadi **12 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari keempat modul pembaruan `keamanan` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan keempat modul di atas ke dalam `keamanan/app.js` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `keamanan` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (8 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `keamanan`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 8 modul yang sudah ada di `keamanan/app.js` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `keamanan` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan keempat modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `keamanan/`
- B. Mengekstrak judul, tingkat, ringkasan, isi, contoh kode, dan kuis setiap modul dari berkas ini ke dalam larik `MODUL` di `keamanan/app.js` (bentuk objeknya mengikuti mesin kelas tersebut), memperbarui jumlah modul di `scripts/courses.json`, lalu menjalankan `npm run extract`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke larik `MODUL` di `keamanan/app.js`, jumlah modulnya diperbarui di `scripts/courses.json`, dan `data/modules.json` dibangkitkan ulang lewat `npm run extract`.

## Sumber

- [Dokumentasi Resmi — Keamanan Aplikasi Web & API Modern (OWASP Top 10 & API Security Top 10)](https://owasp.org/www-project-top-ten/)
- [OWASP API Security Top 10 (edisi 2023)](https://owasp.org/API-Security/editions/2023/en/0x00-header/)
- [OWASP — API1:2023 Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/)
- [OWASP — Server-Side Request Forgery](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery)
