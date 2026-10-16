# Streaming HTTP di PHP: Server-Sent Events (SSE), `readfile()` tanpa Kehabisan RAM, dan `X-Accel-Redirect`

- **Tingkat:** Lanjut
- **Ringkasan:** Mengirim aliran pembaruan waktu nyata satu arah dari PHP ke peramban menggunakan **Server-Sent Events (`text/event-stream`)**, menyajikan unduhan berkas privat berukuran gigabyte tanpa membebani memori PHP dengan mematikan output buffering atau mendelegasikannya ke Nginx melalui header internal **`X-Accel-Redirect`**.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `header('X-Accel-Redirect: /_unduhan_privat/' . $namaBerkasAman);` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Melayani unduhan berkas video 2 GB dengan membaca isinya di PHP sementara *Output Buffering* (`ob_get_level() > 0`) masih aktif akan memaksa PHP menampung seluruh 2 GB tersebut di RAM hingga proses PHP mati!

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `header('X-Accel-Redirect: /_unduhan_privat/' . $namaBerkasAman);` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

// Delegasikan pengiriman berkas besar yang telah lolos otorisasi ke Nginx (Zero-PHP-Memory)
function kirimBerkasViaNginxInternal(string $namaBerkasTersanitasi, string $namaUnduhanAsli): never
{
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . rawurlencode($namaUnduhanAsli) . '"');
    header('X-Accel-Redirect: /_penyimpanan_internal/' . $namaBerkasTersanitasi);
    exit;
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `header('X-Accel-Redirect: /_unduhan_privat/' . $namaBerkasAman);` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Melayani unduhan berkas video 2 GB dengan membaca isinya di PHP sementara *Output Buffering* (`ob_get_level() > 0`) masih aktif akan memaksa PHP menampung seluruh 2 GB tersebut di RAM hingga proses PHP mati!*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena membuka celah keamanan serius, merusak integritas data/finansial, atau menyebabkan kehabisan memori (*Out of Memory*) di server produksi
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Melayani unduhan berkas video 2 GB dengan membaca isinya di PHP sementara *Output Buffering* (`ob_get_level() > 0`) masih aktif akan memaksa PHP menampung seluruh 2 GB tersebut di RAM hingga proses PHP mati!

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `header('X-Accel-Redirect: /_unduhan_privat/' . $namaBerkasAman);` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `header('X-Accel-Redirect: /_unduhan_privat/' . $namaBerkasAman);` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi `Streaming HTTP di PHP` ke dalam arsitektur aplikasi?
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
