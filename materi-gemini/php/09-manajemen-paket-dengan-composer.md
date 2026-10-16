# Manajemen Dependensi dengan Composer, SemVer, `composer.lock`, dan Standar PER/PSR-12

- **Tingkat:** Menengah
- **Ringkasan:** Mengelola siklus hidup pustaka pihak ketiga menggunakan Composer, memahami aturan *Semantic Versioning* (`^` vs `~`), mengunci rilis dengan `composer.lock`, memindai kerentanan keamanan dengan `composer audit`, serta menerapkan standar gaya kode PER / PSR-12.

## 1. Memahami Ekosistem Composer dan Packagist

**Composer** adalah manajer dependensi tingkat proyek untuk PHP, sedangkan **[Packagist](https://packagist.org/)** adalah repositori pusat tempat ribuan pustaka open-source PHP (seperti `monolog/monolog`, `phpunit/phpunit`, `psr/log`, atau `guzzlehttp/guzzle`) didaftarkan.

Dua berkas utama yang selalu berdampingan di akar proyek PHP adalah:
1. **`composer.json`:** Daftar keinginan (*manifest*) yang menyatakan paket apa saja yang dibutuhkan proyek beserta **rentang versi yang diizinkan**, persyaratan versi PHP/ekstensi (`php`, `ext-pdo`, `ext-mbstring`), serta aturan autoloading PSR-4.
2. **`composer.lock`:** Catatan versi **eksak** (misalnya `v3.7.0` beserta referensi commit sumbernya dan `content-hash` dari `composer.json`) yang benar-benar terpasang saat ini.

## 2. Membaca Aturan *Semantic Versioning (SemVer)*: `^` (Caret) vs `~` (Tilde)

Paket PHP modern mengikuti format versi **`MAJOR.MINOR.PATCH`** (misalnya **`3.4.2`**):
- **`MAJOR` (`3`):** Naik jika ada perubahan yang tidak kompatibel ke belakang (*breaking changes*).
- **`MINOR` (`4`):** Naik jika ada penambahan fitur baru yang **masih kompatibel ke belakang**.
- **`PATCH` (`2`):** Naik jika hanya berisi perbaikan bug atau tambalan keamanan yang kompatibel.

Ketika Anda menulis batasan versi di dalam `composer.json`, pahami perbedaan operator berikut:

| Penulisan di `composer.json` | Arti Rentang Versi yang Diizinkan | Kapan Digunakan? |
|---|---|---|
| **`^3.4.2`** (*Caret* — Standar Utama) | **`>= 3.4.2` dan `< 4.0.0`** (Mengizinkan pembaruan *Patch* maupun *Minor*, tetapi **menolak** kenaikan *Major* `4.0.0` yang berisiko merusak kode!). | **Pilihan terbaik untuk hampir semua paket** yang mematuhi SemVer. |
| **`^0.3.1`** (*Caret* pada versi `0.x`) | **`>= 0.3.1` dan `< 0.4.0`** (Karena pada versi pra-1.0, kenaikan `0.4.0` dianggap bisa membawa *breaking changes*). | Otomatis diterapkan Composer untuk paket yang masih di tahap `0.x`. |
| **`~3.4.2`** (*Tilde*) | **`>= 3.4.2` dan `< 3.5.0`** (Hanya mengizinkan pembaruan *Patch* `3.4.x`, menolak kenaikan *Minor* `3.5.0`). | Ketika Anda ingin membatasi pembaruan hanya pada perbaikan bug tingkat *patch*. |
| **`>=8.4`** | Versi `8.4.0` atau yang lebih tinggi tanpa batas atas. | Digunakan untuk menyatakan persyaratan versi mesin `"php": ">=8.4"`. |

## 3. Perintah Penting Composer untuk Pengembangan, Audit Keamanan, dan Produksi

```bash
# 1. Menambahkan paket produksi (masuk ke bagian "require")
composer require monolog/monolog

# 2. Menambahkan paket khusus pengembangan/pengujian (masuk ke bagian "require-dev")
composer require --dev phpunit/phpunit

# 3. Memeriksa apakah ada paket di composer.lock yang memiliki celah keamanan (CVE)!
#    (Wajib dipasang di dalam pipeline CI/CD GitHub Actions!)
composer audit

# 4. Memvalidasi apakah composer.json dan composer.lock sinkron dan valid
composer validate --strict

# 5. Perintah instalasi di SERVER PRODUKSI / DOCKER IMAGE:
composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader --classmap-authoritative
```

### Mengapa `--classmap-authoritative` Sangat Mempercepat Produksi?
Secara bawaan, saat autoloader PSR-4 mencari class `Kodeloka\Domain\Kursus`, PHP harus memanggil fungsi sistem berkas `is_file('src/Domain/Kursus.php')` ke diska.
Ketika Anda menjalankan `--optimize-autoloader --classmap-authoritative` saat membangun image produksi, Composer memindai seluruh folder `src/` dan `vendor/` satu kali, lalu menghasilkan **peta array asosiatif statis raksasa** (`'Kodeloka\\Domain\\Kursus' => '/app/src/Domain/Kursus.php'`). Saat aplikasi berjalan di produksi, autoloader langsung memuat berkas dari array memori tersebut (dan yang sudah di-cache di OPcache) **tanpa melakukan pemeriksaan `is_file()` ke diska sama sekali**!

## 4. Standar Gaya Penulisan Kode: PSR-12 dan PER Coding Style

Agar kode yang ditulis oleh ratusan pengembang PHP di berbagai perusahaan tampak seragam dan bersih, **PHP-FIG** menerbitkan standar gaya kode **[PSR-12](https://www.php-fig.org/psr/psr-12/)** yang kini diperbarui secara berkelanjutan melalui **[PER Coding Style](https://www.php-fig.org/per/coding-style/)** (untuk mengakomodasi fitur-fitur baru seperti Enum, Property Hooks PHP 8.4, dan Asymmetric Visibility).

Aturan inti PSR-12 / PER Coding Style yang wajib Anda terapkan:
1. **Indentasi:** Wajib menggunakan **4 spasi** (tidak boleh menggunakan karakter Tab).
2. **Tag PHP & Baris Pertama:** Gunakan `<?php` diikuti baris kosong, `declare(strict_types=1);`, baris kosong, `namespace ...;`, baris kosong, blok `use ...;`, dan jangan pernah menulis tag penutup `?>` di akhir berkas PHP murni.
3. **Posisi Kurung Kurawal `{`:**
   - Untuk deklarasi **`class`, `enum`, `interface`, `trait`, dan `function`/metode satu baris**: tanda kurung kurawal buka `{` diletakkan di **baris baru di bawahnya**.
   - Untuk struktur kontrol (**`if`, `elseif`, `else`, `foreach`, `while`, `try`, `catch`, `match`**): tanda kurung kurawal buka `{` diletakkan di **baris yang sama** setelah spasi!
4. **Visibilitas Eksplisit:** Selalu tuliskan `public`, `protected`, atau `private` pada setiap properti, metode, dan **konstanta kelas** (`public const BATAS = 10;`).

```php
<?php

declare(strict_types=1);

namespace Kodeloka\Standar;

final class ContohGayaPsr12
{
    public const int VERSI_API = 2;

    public function periksaKelulusan(int $skor): string
    {
        if ($skor >= 75) {
            return 'Lulus';
        } else {
            return 'Belum Lulus';
        }
    }
}
```

## Latihan Praktik: Menyusun `composer.json` Lengkap dengan Skrip Otomatis

Buatlah berkas `composer.json` yang bersih dan siap produksi:
1. Tetapkan persyaratan `"php": ">=8.4"`, `"ext-pdo": "*"`, dan `"ext-mbstring": "*"`.
2. Konfigurasikan `"autoload"` PSR-4 untuk `"Kodeloka\\": "src/"` dan `"autoload-dev"` untuk `"Kodeloka\\Tests\\": "tests/"`.
3. Tambahkan bagian `"scripts"` di dalam `composer.json` sehingga menjalankan `composer test` otomatis mengeksekusi `phpunit --testdox`, dan `composer cek-keamanan` mengeksekusi `composer validate --strict` serta `composer audit`!

## Kuis Pemahaman

### Soal 1
Jika di dalam `composer.json` tertulis `"monolog/monolog": "^3.2.0"`, versi manakah dari pilihan berikut yang **diizinkan** dan versi manakah yang **ditolak** oleh operator caret (`^`)?
- A. Mengizinkan `3.2.5` dan `3.7.0`, tetapi menolak `4.0.0`.
- B. Hanya mengizinkan `3.2.0` saja dan menolak semua versi lainnya.
- C. Mengizinkan `4.0.0` dan `5.0.0`, tetapi menolak `3.2.1`.
- D. Mengizinkan `3.2.5`, tetapi menolak `3.3.0`.

**Jawaban Benar:** A
**Penjelasan:** Operator caret (`^3.2.0`) berarti `>= 3.2.0 < 4.0.0`: mengizinkan pembaruan tingkat *Patch* (`3.2.5`) maupun *Minor* (`3.7.0`) yang kompatibel ke belakang, namun menahan kenaikan versi *Major* (`4.0.0`) yang berpotensi memiliki *breaking changes*.

### Soal 2
Perintah Composer manakah yang digunakan di dalam pipeline CI/CD untuk memindai apakah ada paket di dalam `composer.lock` yang tercatat memiliki kerentanan keamanan publik (*CVE / Security Advisories*)?
- A. `composer update --dry-run`
- B. `composer audit`
- C. `composer dump-autoload`
- D. `composer init`

**Jawaban Benar:** B
**Penjelasan:** Perintah bawaan `composer audit` memeriksa daftar versi paket yang terkunci di `composer.lock` terhadap basis data *security advisories* Packagist dan mengembalikan kode keluar non-nol jika ditemukan celah keamanan.

### Soal 3
Menurut standar gaya kode PSR-12 / PER Coding Style, di manakah tanda kurung kurawal pembuka `{` harus diletakkan pada deklarasi `class` dan `function`/metode dibandingkan pada pernyataan `if` atau `foreach`?
- A. Semuanya diletakkan di baris baru.
- B. Pada deklarasi `class` dan `function`/metode (yang header-nya satu baris), kurung kurawal `{` diletakkan di **baris baru** di bawahnya; sedangkan pada struktur kontrol (`if`, `foreach`, `try`, `match`), kurung kurawal `{` diletakkan di **baris yang sama** setelah satu spasi.
- C. Semuanya diletakkan di baris yang sama.
- D. PSR-12 tidak mengatur posisi kurung kurawal.

**Jawaban Benar:** B
**Penjelasan:** PSR-12 membedakan posisi `{` antara deklarasi struktural (`class`, metode/fungsi pada baris baru) dan blok alur kontrol (`if (...) {`, `foreach (...) {` pada baris yang sama).

## Sumber
- [Basic usage — Composer Documentation](https://getcomposer.org/doc/01-basic-usage.md)
- [Versions and constraints — Composer Documentation](https://getcomposer.org/doc/articles/versions.md)
- [Command-line interface (`audit`, `install`, `validate`) — Composer Documentation](https://getcomposer.org/doc/03-cli.md)
- [The composer.json schema — Composer Documentation](https://getcomposer.org/doc/04-schema.md)
- [PSR-12: Extended Coding Style — PHP-FIG](https://www.php-fig.org/psr/psr-12/)
- [PER Coding Style — PHP-FIG](https://www.php-fig.org/per/coding-style/)
