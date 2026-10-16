# Audit Keamanan OWASP Top 10 & Daftar Periksa Kesiapan Produksi (*Production Readiness*) PHP

- **Tingkat:** Lanjut
- **Ringkasan:** Melakukan audit menyeluruh terhadap aplikasi PHP sebelum rilis ke produksi berdasarkan standar **OWASP Top 10** dan **OWASP ASVS**: pemeriksaan injeksi parameter PDO, konfigurasi `php.ini` (`expose_php=Off`, `display_errors=Off`, `session.use_strict_mode=1`), pemindaian `composer audit`, hingga uji pemulihan bencana.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `!filter_var(ini_get('display_errors'), FILTER_VALIDATE_BOOL) && ini_get('session.use_strict_mode') === '1'` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Meluncurkan aplikasi ke produksi dengan `display_errors = On` atau berkas `.env` / `.git` yang dapat diakses langsung melalui URL publik akan membocorkan kredensial database dan jejak panggilan internal (*stack trace*) kepada penyerang.

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `!filter_var(ini_get('display_errors'), FILTER_VALIDATE_BOOL) && ini_get('session.use_strict_mode') === '1'` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

function auditKonfigurasiRuntimeProduksi(): array
{
    $temuan = [];
    if (in_array(strtolower((string) ini_get('display_errors')), ['1', 'on'], true)) {
        $temuan[] = 'BAHAYA: display_errors masih aktif di lingkungan produksi.';
    }
    if ((string) ini_get('session.use_strict_mode') !== '1') {
        $temuan[] = 'PERINGATAN: session.use_strict_mode wajib bernilai 1 untuk menolak ID sesi tak dikenal.';
    }
    if ((string) ini_get('session.cookie_httponly') !== '1') {
        $temuan[] = 'PERINGATAN: session.cookie_httponly wajib diaktifkan.';
    }
    return $temuan;
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `!filter_var(ini_get('display_errors'), FILTER_VALIDATE_BOOL) && ini_get('session.use_strict_mode') === '1'` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Meluncurkan aplikasi ke produksi dengan `display_errors = On` atau berkas `.env` / `.git` yang dapat diakses langsung melalui URL publik akan membocorkan kredensial database dan jejak panggilan internal (*stack trace*) kepada penyerang.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena membuka celah keamanan serius, merusak integritas data/finansial, atau menyebabkan kehabisan memori (*Out of Memory*) di server produksi
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Meluncurkan aplikasi ke produksi dengan `display_errors = On` atau berkas `.env` / `.git` yang dapat diakses langsung melalui URL publik akan membocorkan kredensial database dan jejak panggilan internal (*stack trace*) kepada penyerang.

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `!filter_var(ini_get('display_errors'), FILTER_VALIDATE_BOOL) && ini_get('session.use_strict_mode') === '1'` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `!filter_var(ini_get('display_errors'), FILTER_VALIDATE_BOOL) && ini_get('session.use_strict_mode') === '1'` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi `Audit Keamanan OWASP Top 10 & Daftar Periksa Kesiapan Produksi (*Production Readiness*) PHP` ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/)
- [Session Management Basics — PHP Manual](https://www.php.net/manual/en/features.session.security.management.php)
- [`ini_get` — PHP Manual](https://www.php.net/manual/en/function.ini-get.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
