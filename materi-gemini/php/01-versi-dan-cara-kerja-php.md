# Pengantar PHP Modern: Siklus Versi, Cara Kerja di Server, dan `strict_types`

- **Tingkat:** Dasar
- **Ringkasan:** Memahami transformasi PHP modern (PHP 8.2 hingga 8.5), kebijakan siklus dukungan 4 tahun, model eksekusi *share-nothing* pada PHP-FPM dan CLI, serta penggunaan wajib `declare(strict_types=1)`.

## PHP Modern Bukanlah PHP Era 2010

Jika gambaran Anda tentang PHP masih berupa kode SQL mentah yang dicampuradukkan dengan tag `<html>` di dalam satu berkas tahun 2008, lupakan gambaran tersebut. Sejak seri PHP 8.0 hingga **PHP 8.4 dan PHP 8.5**, PHP telah bertransformasi menjadi bahasa pemrograman sisi server yang memiliki sistem tipe ketat (*strict typing*), fitur berorientasi objek kelas industri (Enum, Readonly Classes, Property Hooks, Asymmetric Visibility), kompilator *Just-In-Time (JIT)*, dan ekosistem paket standar melalui Composer serta spesifikasi PHP-FIG (PSR).

## 1. Siklus Rilis Resmi dan Versi PHP yang Didukung

Berdasarkan kebijakan resmi [PHP Supported Versions](https://www.php.net/supported-versions.php), setiap cabang rilis utama (*minor release branch*, seperti `8.4` atau `8.5`) mendapatkan **total 4 tahun masa dukungan** yang selalu berakhir pada tanggal **31 Desember**:
1. **2 Tahun Dukungan Aktif (*Active Support*):** Perbaikan bug umum dan perbaikan celah keamanan dirilis secara berkala.
2. **2 Tahun Dukungan Keamanan (*Security Fixes Only*):** Hanya celah keamanan kritis yang ditambal.
3. **End of Life (EOL):** Cabang versi yang berusia lebih dari 4 tahun tidak lagi menerima pembaruan keamanan apa pun dan **tidak boleh digunakan di server produksi**.

### Tabel Status Dukungan Cabang Versi PHP (Per Oktober 2026)

| Cabang Versi | Tanggal Rilis Awal | Akhir Dukungan Aktif | Akhir Dukungan Keamanan (EOL) | Status Rekomendasi Proyek |
|---|---|---|---|---|
| **PHP 8.1** | 25 November 2021 | 25 November 2023 | 31 Desember 2025 | **EOL (Tidak didukung lagi)** — Segera tingkatkan! |
| **PHP 8.2** | 8 Desember 2022 | 31 Desember 2024 | **31 Desember 2026** | Hanya perbaikan keamanan (segera rencanakan migrasi ke 8.4/8.5). |
| **PHP 8.3** | 23 November 2023 | 31 Desember 2025 | **31 Desember 2027** | Hanya perbaikan keamanan. |
| **PHP 8.4** | 21 November 2024 | **31 Desember 2026** | **31 Desember 2028** | **Didukung Aktif** (Stabil & matang untuk produksi). |
| **PHP 8.5** | 20 November 2025 | **31 Desember 2027** | **31 Desember 2029** | **Didukung Aktif (Versi Stabil Terbaru)** — Pilihan utama proyek baru! |

## 2. Bagaimana PHP Bekerja di Server? (Model *Share-Nothing*)

Berbeda dengan server Node.js atau Go di mana satu proses aplikasi terus hidup di memori melayani ribuan pengguna sekaligus, cara kerja klasik dan paling populer di PHP (melalui **PHP-FPM / FastCGI Process Manager** di belakang **Nginx**) menganut arsitektur **Share-Nothing (Tidak Berbagi Memori Antar-Permintaan)**:

```text
[Peramban Pengguna]
        │  1. Permintaan HTTP (GET /kelas/php)
        ▼
[Server Web Nginx]
        │  2. Meneruskan ke PHP-FPM lewat Unix Socket / TCP FastCGI
        ▼
[Worker PHP-FPM] (OPcache mengambil bytecode dari RAM tanpa kompilasi ulang!)
        │  3. Menginisialisasi lingkungan bersih khusus untuk 1 request ini
        │  4. Menjalankan public/index.php -> Controller -> Database -> Respons
        │  5. Membebaskan SELURUH memori variabel request ini hingga bersih 100%!
        ▼
[Peramban Pengguna] menerima balasan HTML / JSON
```

### Keuntungan dan Konsekuensi Arsitektur *Share-Nothing*
- **Keuntungan Besar:** Jika terjadi kebocoran memori kecil atau galat fatal pada permintaan Pengguna A, hal itu **tidak akan pernah merusak atau membocorkan data ke permintaan Pengguna B**, karena setiap permintaan HTTP dimulai dari lembar memori yang bersih!
- **Peran OPcache:** Agar PHP tidak perlu membaca dan mengurai ulang berkas `.php` dari diska pada setiap permintaan, ekstensi bawaan **OPcache** menyimpan *bytecode* hasil kompilasi di dalam memori RAM bersama (*shared memory*).

## 3. Aturan Pertama Setiap Berkas PHP Modern: `declare(strict_types=1);`

Secara bawaan (tanpa pengaturan khusus), PHP berjalan dalam mode *coercive* (longgar): jika sebuah fungsi meminta parameter `int $jumlah`, tetapi Anda mengirim string `"42"`, PHP diam-diam mengubahnya menjadi angka `42`. Lebih parah lagi, di versi lama, ketidakcocokan tipe sering kali meloloskan konversi yang tidak disengaja.

Dalam pengembangan PHP modern, **selalu awali setiap berkas `.php` Anda dengan deklarasi `declare(strict_types=1);` tepat di baris pertama setelah `<?php`**:

```php
<?php

declare(strict_types=1);

function hitungDiskon(int $harga, float $persen): float
{
    return $harga * ($persen / 100);
}

// Berhasil karena tipe argumen cocok (int dan float):
echo hitungDiskon(100_000, 15.0); // 15000

// Dalam mode strict_types=1, baris di bawah ini langsung melempar TypeError!
// (Mencegah bug tersembunyi akibat mengirim string "100000" ke parameter int)
// echo hitungDiskon("100000", 15.0);
```

> **💡 Tiga Aturan Penting Penulisan Berkas PHP:**
> 1. **`declare(strict_types=1);` berlaku per berkas (file-level directive):** Ia harus menjadi pernyataan paling pertama di dalam berkas, bahkan sebelum `namespace`!
> 2. **Jangan menulis tag penutup `?>` pada berkas yang murni berisi kode PHP!** Menurut standar PSR-12, menghilangkan tag penutup `?>` di akhir berkas mencegah karakter spasi atau baris baru tak terlihat di bawah `?>` ikut terkirim secara tidak sengaja dan merusak pengiriman header HTTP (`Cannot modify header information - headers already sent`).
> 3. **Gunakan pemisah ribuan garis bawah (`100_000`):** Sejak PHP 7.4+, Anda dapat menulis angka besar sebagai `1_000_000` agar jauh lebih mudah dibaca manusia.

## 4. Menjalankan PHP lewat CLI dan Server Pengembangan Bawaan

Anda tidak perlu menginstal Apache atau Nginx yang rumit saat sedang belajar di komputer lokal. PHP sudah menyediakan **Built-in Web Server** untuk pengembangan:

```bash
# 1. Memeriksa versi PHP yang terpasang di terminal
php -v

# 2. Menjalankan satu berkas skrip PHP langsung di terminal (CLI SAPI)
php latihan.php

# 3. Menjalankan server web pengembangan di http://127.0.0.1:8000
#    dengan menjadikan folder 'public/' sebagai akar dokumen web
php -S 127.0.0.1:8000 -t public
```

## Latihan Praktik: Menjalankan Skrip Pertama dengan `strict_types`

Buatlah berkas `info-lingkungan.php`:
1. Aktifkan `declare(strict_types=1);` di baris pertama dan jangan gunakan tag penutup `?>` di akhir berkas.
2. Buat fungsi `ringkasanServer(string $namaAplikasi, int $tahun): string` yang mengembalikan informasi nama aplikasi, tahun, dan konstanta bawaan `PHP_VERSION` serta `PHP_SAPI`.
3. Jalankan berkas tersebut melalui terminal dengan `php info-lingkungan.php`.

## Kuis Pemahaman

### Soal 1
Berdasarkan kebijakan siklus rilis resmi PHP, berapa lama satu cabang rilis PHP (misalnya PHP 8.4 atau PHP 8.5) mendapatkan dukungan sejak rilis stabil pertamanya?
- A. 1 tahun dukungan penuh tanpa perpanjangan keamanan.
- B. Total 4 tahun: terdiri dari 2 tahun dukungan aktif (*Active Support*) ditambah 2 tahun perbaikan celah keamanan kritis (*Security Support*), yang berakhir pada tanggal 31 Desember.
- C. 10 tahun dukungan jangka panjang untuk semua versi.
- D. Hanya didukung sampai versi berikutnya dirilis.

**Jawaban Benar:** B
**Penjelasan:** Setiap cabang rilis PHP mendapatkan 2 tahun dukungan aktif (perbaikan bug dan keamanan rutin) yang diikuti oleh 2 tahun dukungan keamanan kritis, dengan tanggal akhir siklus diselaraskan pada 31 Desember.

### Soal 2
Mengapa standar kode PHP modern (PSR-12) melarang penulisan tag penutup `?>` pada berkas yang hanya berisi kode PHP murni?
- A. Karena tag `?>` menyebabkan galat sintaks sejak PHP 8.0.
- B. Untuk mencegah spasi kosong atau baris baru (*whitespace*) yang tidak sengaja tertulis setelah tag `?>` terkirim lebih awal sebagai tubuh respons HTTP, yang akan menggagalkan fungsi pengaturan header seperti `header()`, `setcookie()`, atau `session_start()`.
- C. Karena tanpa `?>`, berkas PHP berjalan dua kali lebih cepat.
- D. Agar berkas PHP dapat dibaca langsung oleh peramban tanpa server.

**Jawaban Benar:** B
**Penjelasan:** Di PHP, karakter apa pun di luar pasangan tag `<?php ... ?>` (termasuk satu spasi atau baris kosong setelah `?>` di akhir berkas yang di-`require`) langsung dikirim ke buffer keluaran HTTP. Hal ini memicu galat klasik *Headers already sent* saat aplikasi hendak mengatur cookie atau sesi.

### Soal 3
Di manakah deklarasi `declare(strict_types=1);` harus diletakkan, dan sejauh mana cakupan pengaruhnya?
- A. Diletakkan di dalam fungsi `main()`, dan otomatis mengubah seluruh berkas di dalam folder `vendor/`.
- B. Diletakkan sebagai pernyataan pertama di bagian paling atas berkas `.php` (sebelum pernyataan `namespace` atau kode lainnya), dan hanya berlaku untuk pemanggilan fungsi yang dilakukan di dalam berkas itu sendiri.
- C. Diletakkan di baris paling bawah berkas PHP.
- D. Ditulis di dalam berkas `composer.json`.

**Jawaban Benar:** B
**Penjelasan:** `declare(strict_types=1);` wajib menjadi pernyataan pertama di dalam skrip PHP dan bekerja pada cakupan per berkas (*per-file directive*) supaya kode Anda dapat menerapkan pemeriksaan tipe ketat tanpa merusak pustaka pihak ketiga yang mungkin belum mengaktifkannya.

## Sumber
- [Supported Versions — PHP.net](https://www.php.net/supported-versions.php)
- [Basic syntax — PHP Manual](https://www.php.net/manual/en/language.basic-syntax.php)
- [Type declarations (`strict_types`) — PHP Manual](https://www.php.net/manual/en/language.types.declarations.php)
- [PSR-12: Extended Coding Style — PHP-FIG](https://www.php-fig.org/psr/psr-12/)
