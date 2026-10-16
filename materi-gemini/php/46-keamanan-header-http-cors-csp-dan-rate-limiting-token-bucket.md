# Pertahanan HTTP Mendalam: Algoritma Rate Limiting (Token Bucket / Sliding Window), CORS Ketat, dan HSTS

- **Tingkat:** Lanjut
- **Ringkasan:** Mengimplementasikan pembatas laju permintaan (*Rate Limiter*) yang atomik untuk melindungi endpoint login dan API publik dari serangan *Brute Force*, mengonfigurasi header **CORS (`Access-Control-Allow-Origin`)** berdasarkan daftar putih, serta memasang `Strict-Transport-Security` (HSTS).

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `header('Strict-Transport-Security: max-age=63072000; includeSubDomains; preload');` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Memantulkan nilai `$_SERVER['HTTP_ORIGIN']` apa pun secara buta ke dalam header `Access-Control-Allow-Origin` sambil mengaktifkan `Access-Control-Allow-Credentials: true` sama saja dengan mematikan perlindungan Same-Origin Policy bagi seluruh situs berbahaya di internet!

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `header('Strict-Transport-Security: max-age=63072000; includeSubDomains; preload');` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

function terapkanCorsTerbatas(array $originDiizinkan): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '' && in_array($origin, $originDiizinkan, strict: true)) {
        header("Access-Control-Allow-Origin: {$origin}");
        header('Access-Control-Allow-Credentials: true');
        header('Vary: Origin');
    }
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `header('Strict-Transport-Security: max-age=63072000; includeSubDomains; preload');` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Memantulkan nilai `$_SERVER['HTTP_ORIGIN']` apa pun secara buta ke dalam header `Access-Control-Allow-Origin` sambil mengaktifkan `Access-Control-Allow-Credentials: true` sama saja dengan mematikan perlindungan Same-Origin Policy bagi seluruh situs berbahaya di internet!*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena membuka celah keamanan serius, merusak integritas data/finansial, atau menyebabkan kehabisan memori (*Out of Memory*) di server produksi
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Memantulkan nilai `$_SERVER['HTTP_ORIGIN']` apa pun secara buta ke dalam header `Access-Control-Allow-Origin` sambil mengaktifkan `Access-Control-Allow-Credentials: true` sama saja dengan mematikan perlindungan Same-Origin Policy bagi seluruh situs berbahaya di internet!

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `header('Strict-Transport-Security: max-age=63072000; includeSubDomains; preload');` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `header('Strict-Transport-Security: max-age=63072000; includeSubDomains; preload');` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi `Pertahanan HTTP Mendalam` ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [PHP Manual — Language Reference & Extensions](https://www.php.net/manual/en/langref.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
