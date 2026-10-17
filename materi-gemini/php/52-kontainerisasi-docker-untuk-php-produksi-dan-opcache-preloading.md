# Kontainerisasi Docker Multi-Stage untuk PHP 8.4/8.5 dan OPcache Preloading (`opcache.preload`)

- **Tingkat:** Lanjut
- **Ringkasan:** Merancang `Dockerfile` *multi-stage* untuk aplikasi PHP produksi yang berjalan sebagai pengguna non-root, menginstal dependensi dengan `composer install --no-dev --classmap-authoritative`, serta memanaskan kelas inti di memori bersama saat startup menggunakan **OPcache Preloading**.

## Mengapa Kontainer PHP Produksi Tidak Boleh Dibangun dengan Satu Tahap dan Konfigurasi `php.ini` Bawaan?

Saat mengemas aplikasi PHP ke dalam image Docker untuk produksi, tiga kesalahan konfigurasi sering menguras CPU dan memperbesar risiko keamanan:
1. **Menyertakan Composer, Git, dan Paket Dev (`phpunit`, `phpstan`) ke Image Produksi:** Tanpa *Multi-Stage Build* dan bendera `--no-dev`, ukuran image membengkak ratusan megabyte dan menyisakan perkakas pengembangan yang memperluas permukaan serangan (*attack surface*).
2. **Membiarkan `opcache.validate_timestamps = 1` di Kontainer Produksi:** Secara bawaan, OPcache mengecek ke disk apakah berkas `.php` berubah setiap beberapa detik (`stat()` syscall). Padahal di dalam kontainer Docker produksi yang bersifat **Immutable** (kode tidak pernah diedit langsung di dalam kontainer!), pengecekan disk tersebut 100% sia-sia! Mematikannya (`opcache.validate_timestamps = 0`) menghilangkan ribuan panggilan `stat()` sistem berkas per detik.
3. **Menjalankan PHP sebagai `root`:** Jika terjadi celah keamanan di aplikasi, proses yang berjalan sebagai `root` memiliki hak penuh di dalam kontainer. Selalu beralih ke pengguna non-privilese (**`USER www-data`**).

> **🚫 Kerentanan & Kesalahan Umum:** Menjalankan `composer install` tanpa `--no-dev` memasang paket pengembangan ke image produksi (memperbesar ukuran image dan permukaan serangan), dan membiarkan `opcache.validate_timestamps=1` pada container Docker produksi yang *immutable* membuang waktu CPU untuk mengecek perubahan berkas di disk pada setiap permintaan.

## 1. Perbandingan Konfigurasi Composer & OPcache: Pengembangan vs Kontainer Produksi

Berikut adalah pengaturan yang wajib dibedakan antara lingkungan lokal dan image Docker produksi:

| Pengaturan / Perintah | Lingkungan Pengembangan Lokal | Kontainer Docker Produksi (*Immutable*) |
| :--- | :--- | :--- |
| **Perintah Composer** | `composer install` (memasang `require-dev`, peta autoload dinamis). | **`composer install --no-dev --prefer-dist --no-interaction --classmap-authoritative`**. |
| **`opcache.validate_timestamps`** | `1` (OPcache mendeteksi perubahan berkas saat Anda mengedit kode). | **`0`** (OPcache tidak pernah menyentuh disk lagi untuk mengecek timestamp berkas!). |
| **`opcache.preload` & `preload_user`** | Tidak diaktifkan (agar perubahan class langsung terlihat). | **`/app/preload.php`** dengan `opcache.preload_user=www-data` (memuat *opcode* class inti ke memori bersama sekali saat startup master!). |
| **Pengguna Proses (`USER`)** | Pengguna lokal / bawaan. | **`USER www-data`** (non-root) dengan kode sumber dimiliki oleh `root` (read-only bagi `www-data`!). |

### Mengapa `--classmap-authoritative` Sangat Cepat?
Saat Anda menjalankan `composer install --classmap-authoritative`, Composer memindai seluruh class di proyek Anda dan membangun satu peta array statis lengkap. Saat runtime, autoloader Composer langsung mengambil lokasi berkas dari array tersebut dan **tidak pernah melakukan panggilan `file_exists()` / `is_file()` ke disk sama sekali** apabila suatu class tidak ada di peta!

## 2. Merancang Skrip `preload.php` yang Aman dan Terukur

Fitur **OPcache Preloading** (`opcache.preload`) dieksekusi **satu kali saja** ketika proses induk PHP-FPM baru menyala, lalu menyimpan seluruh fungsi dan class yang dikompilasinya (`opcache_compile_file()`) secara permanen di dalam memori bersama (*shared memory*) untuk dipakai oleh seluruh proses anak tanpa perlu di-autoload lagi!

```php
<?php
declare(strict_types=1);
// preload.php — Dikonfigurasi melalui opcache.preload=/app/preload.php di php.ini produksi

/**
 * Mengompilasi daftar berkas PHP inti ke dalam memori OPcache secara aman.
 *
 * @param list<string> $daftarBerkas
 * @return list<string> Daftar berkas yang berhasil dipanaskan
 */
function panaskanBerkasKeOpcache(array $daftarBerkas): array
{
    $berhasil = [];
    foreach ($daftarBerkas as $berkas) {
        if (!is_file($berkas) || pathinfo($berkas, PATHINFO_EXTENSION) !== 'php') {
            continue;
        }
        if (function_exists('opcache_compile_file')) {
            @opcache_compile_file($berkas);
        }
        $berhasil[] = $berkas;
    }
    return $berhasil;
}

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    $daftarFileInti = [
        __DIR__ . '/vendor/autoload.php',
        __DIR__ . '/src/KernelAplikasi.php',
        __DIR__ . '/src/Routing/Router.php',
    ];
    panaskanBerkasKeOpcache($daftarFileInti);
}
```

## 3. Contoh `Dockerfile` Multi-Stage untuk PHP 8.4/8.5 Produksi

Perhatikan bagaimana *stage* pertama (`vendor-builder`) menginstal paket Composer menggunakan `composer.lock`, lalu *stage* kedua (`runtime`) hanya menyalin hasil `vendor/` yang sudah bersih tanpa membawa biner `composer` maupun `git` ke image produksi:

```dockerfile
# Stage 1: Instalasi dependensi produksi dengan peta classmap otoritatif
FROM composer:2 AS vendor-builder
WORKDIR /build
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --no-scripts \
    --classmap-authoritative

# Stage 2: Image Runtime Produksi yang Ramping & Aman
FROM php:8.4-fpm-alpine AS runtime
WORKDIR /app

# Konfigurasi OPcache produksi (Immutable Container)
RUN { \
      echo 'opcache.enable=1'; \
      echo 'opcache.memory_consumption=192'; \
      echo 'opcache.interned_strings_buffer=16'; \
      echo 'opcache.max_accelerated_files=20000'; \
      echo 'opcache.validate_timestamps=0'; \
      echo 'expose_php=Off'; \
      echo 'display_errors=Off'; \
    } > /usr/local/etc/php/conf.d/zz-produksi.ini

# Salin kode milik root (sehingga www-data hanya bisa membaca, tidak bisa memodifikasi kode!)
COPY --chown=root:root src/ ./src/
COPY --chown=root:root public/ ./public/
COPY --from=vendor-builder --chown=root:root /build/vendor/ ./vendor/

# Jalankan proses worker sebagai pengguna non-root
USER www-data
EXPOSE 9000
CMD ["php-fpm"]
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Melakukan `COPY . .` di baris atas `Dockerfile` sebelum `RUN composer install`:** Jika Anda menyalin seluruh kode sumber sebelum menjalankan `composer install`, maka setiap kali Anda mengubah 1 baris kode di `src/Controller.php`, cache layer Docker untuk `composer install` akan hangus dan Docker terpaksa mengunduh ulang paket Composer! Selalu salin `composer.json` dan `composer.lock` terlebih dahulu, jalankan `composer install`, baru salin `src/`!
2. **Memberikan kepemilikan berkas kode sumber `.php` kepada `www-data` (`COPY --chown=www-data:www-data src/ ./src/`):** Jika proses PHP berjalan sebagai `www-data` dan ia juga menjadi pemilik berkas `.php`, maka celah penulisan berkas di aplikasi akan mengizinkan penyerang memodifikasi `index.php`! Biarkan berkas kode dimiliki oleh `root:root` (dengan izin baca `0644`/`0755`) sehingga `www-data` hanya bisa **membaca dan mengeksekusi**, tetapi **tidak pernah bisa memodifikasi** berkas kode di dalam kontainer!
3. **Menjalankan `opcache.preload` sebagai `root`:** PHP melarang eksekusi preloading sebagai `root` demi keamanan; selalu atur `opcache.preload_user=www-data` di `php.ini`.

## Latihan Praktik Mandiri

1. Buat berkas `PreloadHelper.php` yang memuat fungsi `panaskanBerkasKeOpcache()` dan fungsi validator konfigurasi OPcache kontainer `auditKonfigurasiOpcacheKontainer(array $konfigIni): list<string>`.
2. Tulis pengujian PHPUnit untuk memverifikasi bahwa `panaskanBerkasKeOpcache()` hanya memilih berkas `.php` yang benar-benar ada di disk dan melewati berkas yang tidak ada atau berekstensi `.txt`.

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
Apa dampak dari menambahkan bendera `--classmap-authoritative` saat menjalankan `composer install --no-dev --prefer-dist --no-interaction --classmap-authoritative` di tahap pembangunan image produksi?
- A. Menghapus seluruh berkas di dalam folder `vendor/`
- B. Memerintahkan Composer memindai seluruh class menjadi satu peta array statis lengkap dan memberi tahu autoloader bahwa tidak ada class lain di luar peta tersebut, sehingga PHP tidak pernah melakukan pemeriksaan sistem berkas (`file_exists` / `stat`) ke disk saat memuat class
- C. Mengubah semua nama class menjadi huruf kecil
- D. Memaksa aplikasi berjalan tanpa OPcache

**Jawaban Benar:** B
**Penjelasan:** Dengan `--classmap-authoritative`, autoloader Composer sepenuhnya mengandalkan peta classmap di memori (yang juga di-cache di OPcache) dan menghilangkan panggilan I/O disk pencarian berkas PSR-4.

### Soal 3
Di dalam `Dockerfile` produksi di mana proses PHP-FPM dijalankan sebagai `USER www-data`, mengapa berkas kode sumber aplikasi (`src/`, `vendor/`, `public/`) justru sebaiknya disalin dengan kepemilikan `--chown=root:root` (izin baca saja bagi `www-data`), bukan `--chown=www-data:www-data`?
- A. Karena `www-data` tidak dapat membaca berkas milik `root`
- B. Agar sistem berkas kode aplikasi bersifat *read-only* bagi proses PHP yang berjalan; bahkan jika terdapat celah keamanan pada aplikasi, proses `www-data` tidak memiliki izin tulis untuk mengubah berkas `.php` atau menyisipkan *web shell* ke dalam folder `public/`
- C. Agar ukuran image berkurang 50%
- D. Karena Docker melarang penggunaan `--chown=www-data`

**Jawaban Benar:** B
**Penjelasan:** Memisahkan pemilik berkas (`root`) dari pengguna yang menjalankan proses (`www-data`) memastikan prinsip *Least Privilege*: proses aplikasi dapat membaca kode sumber, tetapi tidak dapat memodifikasinya saat runtime.

## Sumber

- [Preloading — PHP Manual](https://www.php.net/manual/en/opcache.preloading.php)
- [OPcache Runtime Configuration — PHP Manual](https://www.php.net/manual/en/opcache.configuration.php)
- [Multi-stage builds — Docker Documentation](https://docs.docker.com/build/building/multi-stage/)
- [Command-line interface (`install`) — Composer Documentation](https://getcomposer.org/doc/03-cli.md)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
