# Kontainerisasi Docker Multi-Stage untuk PHP 8.4/8.5 dan OPcache Preloading (`opcache.preload`)

- **Tingkat:** Lanjut
- **Ringkasan:** Merancang `Dockerfile` *multi-stage* untuk aplikasi PHP produksi yang berjalan sebagai pengguna non-root, menginstal dependensi dengan `composer install --no-dev --classmap-authoritative`, serta memanaskan kelas inti di memori bersama saat startup menggunakan **OPcache Preloading**.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `composer install --no-dev --prefer-dist --no-interaction --classmap-authoritative` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Menjalankan `composer install` tanpa `--no-dev` memasang paket pengembangan ke image produksi (memperbesar ukuran image dan permukaan serangan), dan membiarkan `opcache.validate_timestamps=1` pada container Docker produksi yang *immutable* membuang waktu CPU untuk mengecek perubahan berkas di disk pada setiap permintaan.

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `composer install --no-dev --prefer-dist --no-interaction --classmap-authoritative` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);
// preload.php — Dikonfigurasi melalui opcache.preload=/app/preload.php di php.ini produksi

$daftarFileInti = [
    __DIR__ . '/vendor/autoload.php',
    __DIR__ . '/src/KernelAplikasi.php',
    __DIR__ . '/src/Routing/Router.php',
];

foreach ($daftarFileInti as $berkas) {
    if (is_file($berkas)) {
        opcache_compile_file($berkas);
    }
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `composer install --no-dev --prefer-dist --no-interaction --classmap-authoritative` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Menjalankan `composer install` tanpa `--no-dev` memasang paket pengembangan ke image produksi (memperbesar ukuran image dan permukaan serangan), dan membiarkan `opcache.validate_timestamps=1` pada container Docker produksi yang *immutable* membuang waktu CPU untuk mengecek perubahan berkas di disk pada setiap permintaan.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena paket pengembangan memperbesar ukuran image dan permukaan serangan, serta pengecekan timestamp berkas pada container yang tidak berubah membuang waktu CPU pada setiap permintaan
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Menjalankan `composer install` tanpa `--no-dev` memasang paket pengembangan ke image produksi (memperbesar ukuran image dan permukaan serangan), dan membiarkan `opcache.validate_timestamps=1` pada container Docker produksi yang *immutable* membuang waktu CPU untuk mengecek perubahan berkas di disk pada setiap permintaan.

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `composer install --no-dev --prefer-dist --no-interaction --classmap-authoritative` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `composer install --no-dev --prefer-dist --no-interaction --classmap-authoritative` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi "Kontainerisasi Docker Multi-Stage untuk PHP 8.4/8.5 dan OPcache Preloading (opcache.preload)" ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [Preloading — PHP Manual](https://www.php.net/manual/en/opcache.preloading.php)
- [OPcache Runtime Configuration — PHP Manual](https://www.php.net/manual/en/opcache.configuration.php)
- [Multi-stage builds — Docker Documentation](https://docs.docker.com/build/building/multi-stage/)
- [Command-line interface (`install`) — Composer Documentation](https://getcomposer.org/doc/03-cli.md)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
