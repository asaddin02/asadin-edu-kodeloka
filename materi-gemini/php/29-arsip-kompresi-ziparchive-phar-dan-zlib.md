# Pengelolaan Arsip & Kompresi: `ZipArchive`, Pencegahan Kerentanan *Zip Slip*, dan Kompresi `gzencode`

- **Tingkat:** Menengah
- **Ringkasan:** Membuat dan mengekstrak berkas `.zip` secara aman menggunakan **`ZipArchive`**, menangkal serangan **Zip Slip (Path Traversal)** dan **Zip Bomb** saat mengekstrak arsip unggahan pengguna, serta mengompresi payload data dengan `gzencode()`.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `$zip->open($jalurZip, ZipArchive::CREATE | ZipArchive::OVERWRITE);` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Memanggil `$zip->extractTo($folderTujuan)` secara mentah-mentah pada berkas `.zip` dari pengguna sangat berbahaya karena nama entri di dalam zip dapat berisi `../../../../var/www/html/shell.php` (*Zip Slip*) yang menimpa kode sumber server Anda!

> Perlu dicek: sejauh mana `ZipArchive::extractTo()` pada versi PHP saat ini sudah menormalkan nama entri yang berisi `..` tidak dijelaskan di manual; validasi manual seperti pada contoh di bawah tetap wajib dilakukan sebagai pertahanan berlapis.

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `$zip->open($jalurZip, ZipArchive::CREATE / ZipArchive::OVERWRITE);` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

function validasiKeamananZip(string $jalurZip, int $maksTotalByte = 50_000_000): void
{
    $zip = new ZipArchive();
    if ($zip->open($jalurZip) !== true) {
        throw new RuntimeException('Gagal membuka arsip ZIP.');
    }
    $totalUkuran = 0;
    for ($i = 0; $i < $zip->numFiles; $i++) {
        $stat = $zip->statIndex($i);
        $nama = $stat['name'] ?? '';
        // Tolak path traversal (Zip Slip)
        if (str_contains($nama, '..') || str_starts_with($nama, '/') || str_starts_with($nama, '\\')) {
            $zip->close();
            throw new RuntimeException('Terdeteksi percobaan Zip Slip pada entri: ' . $nama);
        }
        $totalUkuran += (int) ($stat['size'] ?? 0);
        if ($totalUkuran > $maksTotalByte) {
            $zip->close();
            throw new RuntimeException('Ukuran hasil ekstraksi melebihi batas aman (Zip Bomb).');
        }
    }
    $zip->close();
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `$zip->open($jalurZip, ZipArchive::CREATE / ZipArchive::OVERWRITE);` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Memanggil `$zip->extractTo($folderTujuan)` secara mentah-mentah pada berkas `.zip` dari pengguna sangat berbahaya karena nama entri di dalam zip dapat berisi `../../../../var/www/html/shell.php` (*Zip Slip*) yang menimpa kode sumber server Anda!*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena membuka celah keamanan serius, merusak integritas data/finansial, atau menyebabkan kehabisan memori (*Out of Memory*) di server produksi
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Memanggil `$zip->extractTo($folderTujuan)` secara mentah-mentah pada berkas `.zip` dari pengguna sangat berbahaya karena nama entri di dalam zip dapat berisi `../../../../var/www/html/shell.php` (*Zip Slip*) yang menimpa kode sumber server Anda!

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `$zip->open($jalurZip, ZipArchive::CREATE / ZipArchive::OVERWRITE);` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `$zip->open($jalurZip, ZipArchive::CREATE / ZipArchive::OVERWRITE);` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi `Pengelolaan Arsip & Kompresi` ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [The ZipArchive class — PHP Manual](https://www.php.net/manual/en/class.ziparchive.php)
- [Zlib Compression — PHP Manual](https://www.php.net/manual/en/book.zlib.php)
- [`gzencode` — PHP Manual](https://www.php.net/manual/en/function.gzencode.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
