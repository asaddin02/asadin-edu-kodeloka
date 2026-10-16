# Pemrosesan Gambar di Server: Ekstensi `GD` & `Imagick`, Pembuatan Thumbnail, dan Konversi WebP/AVIF

- **Tingkat:** Menengah
- **Ringkasan:** Memvalidasi dimensi gambar, menghapus metadata lokasi EXIF demi privasi pengguna, mengubah ukuran gambar (*resize/crop*) secara proporsional dengan `imagescale()`, serta mengonversi unggahan JPEG/PNG menjadi format modern **WebP (`imagewebp`)** dan **AVIF (`imageavif`)**.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `imagewebp($kanvasBaru, $jalurTujuan, quality: 82);` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Memuat gambar unggahan pengguna yang beresolusi 12.000 x 12.000 piksel (*decompression bomb / image bomb*) langsung ke `imagecreatefromjpeg()` tanpa memeriksa lebar dan tinggi piksel terlebih dahulu dengan `getimagesize()` akan menghabiskan ratusan megabyte RAM seketika.

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `imagewebp($kanvasBaru, $jalurTujuan, quality: 82);` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

function buatThumbnailWebp(string $jalurSumber, string $jalurTujuan, int $lebarMaks = 600): bool
{
    $info = @getimagesize($jalurSumber);
    if ($info === false || $info[0] > 6000 || $info[1] > 6000) {
        throw new InvalidArgumentException('Dimensi gambar tidak valid atau terlalu besar.');
    }
    $sumber = imagecreatefromstring((string) file_get_contents($jalurSumber));
    if ($sumber === false) return false;

    $kecil = imagescale($sumber, $lebarMaks);
    return $kecil !== false && imagewebp($kecil, $jalurTujuan, 82);
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `imagewebp($kanvasBaru, $jalurTujuan, quality: 82);` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Memuat gambar unggahan pengguna yang beresolusi 12.000 x 12.000 piksel (*decompression bomb / image bomb*) langsung ke `imagecreatefromjpeg()` tanpa memeriksa lebar dan tinggi piksel terlebih dahulu dengan `getimagesize()` akan menghabiskan ratusan megabyte RAM seketika.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena membuka celah keamanan serius, merusak integritas data/finansial, atau menyebabkan kehabisan memori (*Out of Memory*) di server produksi
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Memuat gambar unggahan pengguna yang beresolusi 12.000 x 12.000 piksel (*decompression bomb / image bomb*) langsung ke `imagecreatefromjpeg()` tanpa memeriksa lebar dan tinggi piksel terlebih dahulu dengan `getimagesize()` akan menghabiskan ratusan megabyte RAM seketika.

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `imagewebp($kanvasBaru, $jalurTujuan, quality: 82);` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `imagewebp($kanvasBaru, $jalurTujuan, quality: 82);` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi `Pemrosesan Gambar di Server` ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [Image Processing and Generation (GD) — PHP Manual](https://www.php.net/manual/en/book.image.php)
- [`imagewebp` — PHP Manual](https://www.php.net/manual/en/function.imagewebp.php)
- [`imageavif` — PHP Manual](https://www.php.net/manual/en/function.imageavif.php)
- [`getimagesize` — PHP Manual](https://www.php.net/manual/en/function.getimagesize.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
