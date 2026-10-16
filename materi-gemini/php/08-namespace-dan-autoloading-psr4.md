# Namespace, Resolusi Nama, dan Cara Kerja Autoloading PSR-4 di Balik Layar

- **Tingkat:** Menengah
- **Ringkasan:** Menguasai pengorganisasian ruang nama (`namespace`, `use`, `use function`, `use const`), memahami aturan resolusi nama (*unqualified*, *qualified*, *fully qualified*), menulis autoloader PSR-4 sendiri dengan `spl_autoload_register()`, serta mematuhi standar PSR-1 dan PSR-4.

## 1. Mengapa Namespace Penting dan Bagaimana Cara Kerjanya?

Tanpa `namespace`, seluruh class, interface, enum, fungsi, dan konstanta yang Anda buat berada di dalam satu **Global Namespace** raksasa.

Dengan mendeklarasikan `namespace Kodeloka\Autentikasi;` di bagian atas berkas (tepat setelah `declare(strict_types=1);`), semua class yang didefinisikan di dalam berkas tersebut otomatis memiliki awalan ruang nama `Kodeloka\Autentikasi\`:

```php
<?php

declare(strict_types=1);

namespace Kodeloka\Autentikasi;

// Mengimpor class dari namespace lain (dan memberikan alias 'as' jika namanya sama)
use DateTimeImmutable;
use Kodeloka\Database\Koneksi;
use VendorLain\Keamanan\Token as TokenEksternal;

// Mengimpor fungsi dan konstanta dari namespace lain:
use function Kodeloka\Utilitas\formatWaktu;
use const Kodeloka\Konfigurasi\MASA_AKTIF_SESI;

// Mengelompokkan beberapa impor dari namespace induk yang sama (Group Use Declarations):
use Kodeloka\Autentikasi\Entitas\{Pengguna, SesiLogin, Peran};

final class LayananLogin
{
    // ...
}
```

## 2. Tiga Aturan Resolusi Nama di Dalam Namespace

Ketika PHP membaca sebuah nama class di dalam berkas yang memiliki `namespace Kodeloka\Akademik;`, PHP menerjemahkan namanya menggunakan tiga aturan mirip jalur berkas di Linux:

| Jenis Penulisan Nama | Contoh di Dalam Kode | Bagaimana PHP Menerjemahkannya? |
|---|---|---|
| **1. Unqualified Name** (Tanpa garis miring `\`) | `new Kursus()` | Pertama memeriksa apakah ada pernyataan `use ...\Kursus;` di atas. Jika tidak ada, PHP menempelkan namespace aktif saat ini: **`Kodeloka\Akademik\Kursus`**. |
| **2. Qualified Name** (Diawali sub-nama, bukan `\`) | `new Entitas\Kursus()` | Jika tidak ada alias `use ... as Entitas;`, PHP menempelkannya sebagai sub-namespace dari namespace aktif: **`Kodeloka\Akademik\Entitas\Kursus`**. |
| **3. Fully Qualified Name (FQCN)** (Diawali garis miring terbalik `\`) | `new \PDO(...)` atau `new \Kodeloka\Inti\App()` | Layaknya jalur absolut `/etc/hosts` di Linux: selalu mengacu langsung dari **akar Global Namespace** tanpa peduli Anda sedang berada di namespace mana! |

> **💡 Perbedaan Resolusi Class vs Fungsi/Konstanta di Dalam Namespace:**
> - Untuk **Class / Interface / Enum**: Jika Anda menulis `new DateTimeImmutable()` di dalam `namespace Kodeloka;` **tanpa** `use DateTimeImmutable;` dan tanpa awalan `\`, PHP **TIDAK** akan mundur mencari ke global namespace, melainkan langsung gagal mencari `Kodeloka\DateTimeImmutable`!
> - Untuk **Fungsi dan Konstanta** (seperti `strlen($teks)` atau `PHP_EOL`): Jika tidak ditemukan di dalam `namespace Kodeloka;`, PHP **otomatis mundur (*fallback*) ke fungsi/konstanta bawaan Global Namespace**!

## 3. Bagaimana Autoloading PSR-4 Bekerja di Balik Layar (`spl_autoload_register`)

Pernahkah Anda penasaran apa yang sebenarnya dilakukan oleh baris `require 'vendor/autoload.php';` milik Composer ketika Anda memanggil `new Kodeloka\Akademik\Kursus()`?

Di balik layar, PHP menyediakan fungsi bawaan **`spl_autoload_register(callable $callback)`**. Setiap kali kode Anda memanggil sebuah class yang belum pernah dimuat ke memori, mesin PHP tidak langsung menyerah, melainkan memanggil fungsi yang terdaftar di `spl_autoload_register()` sambil mengirimkan string nama lengkap class tersebut (`"Kodeloka\Akademik\Kursus"`)!

Mari kita tulis sebuah **Autoloader PSR-4 murni dalam 20 baris PHP** agar Anda memahami mekanismenya 100%:

```php
<?php

declare(strict_types=1);

/**
 * Mendaftarkan autoloader PSR-4 untuk awalan namespace "Kodeloka\" -> folder "/src/"
 */
spl_autoload_register(static function (string $namaLengkapClass): void {
    $awalanNamespace = 'Kodeloka\\';
    $direktoriDasar  = __DIR__ . '/src/';

    // 1. Jika class yang diminta bukan dimulai dengan "Kodeloka\", abaikan
    //    (biarkan autoloader lain yang menanganinya)
    if (!str_starts_with($namaLengkapClass, $awalanNamespace)) {
        return;
    }

    // 2. Ambil bagian nama class relatif setelah "Kodeloka\"
    //    Contoh: "Kodeloka\Akademik\Entitas\Kursus" -> "Akademik\Entitas\Kursus"
    $classRelatif = substr($namaLengkapClass, strlen($awalanNamespace));

    // 3. Ubah pemisah namespace '\' menjadi pemisah folder '/' dan tambahkan '.php'
    //    Hasil: "/jalur/proyek/src/Akademik/Entitas/Kursus.php"
    $jalurBerkas = $direktoriDasar . str_replace('\\', '/', $classRelatif) . '.php';

    // 4. Jika berkasnya ada di diska, muat sekarang!
    if (is_file($jalurBerkas)) {
        require $jalurBerkas;
    }
});
```

### Aturan Wajib Standar PSR-1 & PSR-4 agar Autoloading Selalu Berhasil:
1. **Satu Berkas = Satu Class/Interface/Trait/Enum:** Jangan menumpuk tiga class berbeda di dalam satu berkas `.php` yang sama! Jika `ClassB` ditaruh di dalam berkas `ClassA.php`, autoloader tidak akan pernah bisa menemukan `ClassB` saat `ClassB` dipanggil lebih dulu.
2. **Nama Berkas = Nama Class (`StudlyCaps` / `PascalCase`):** `class PengelolaSesi` wajib disimpan dalam berkas `PengelolaSesi.php`.
3. **Bebas Efek Samping Saat Dimuat:** Berkas yang mendefinisikan class tidak boleh sekaligus menjalankan kode yang mencetak keluaran (`echo`) atau mengubah variabel global pada saat berkas tersebut di-`require` oleh autoloader.

## Latihan Praktik: Menguji Autoloader PSR-4 Buatan Sendiri

Buatlah berkas `uji-autoload.php`:
1. Tulis fungsi `spl_autoload_register()` PSR-4 seperti di atas yang memetakan `Kodeloka\Latihan\` ke sub-folder `./latihan-src/`.
2. Buat berkas `./latihan-src/ Matematika/Deret.php` yang berisi `namespace Kodeloka\Latihan\Matematika;` dan `final class Deret`.
3. Di dalam `uji-autoload.php`, langsung panggil `new \Kodeloka\Latihan\Matematika\Deret()` tanpa menulis `require` manual untuk berkas `Deret.php`, dan buktikan bahwa PHP memuatnya secara otomatis!

## Kuis Pemahaman

### Soal 1
Di dalam sebuah berkas yang mendeklarasikan `namespace Kodeloka\Layanan;`, Anda menulis baris `$pdo = new PDO($dsn);` **tanpa** menulis `use PDO;` di bagian atas berkas dan **tanpa** menulis awalan `\` (`new \PDO`). Apa yang akan terjadi?
- A. PHP otomatis menemukan class `PDO` bawaan di global namespace.
- B. PHP akan mencari class bernama `Kodeloka\Layanan\PDO` dan gagal dengan pesan `Error: Class "Kodeloka\Layanan\PDO" not found`, karena untuk nama class tanpa garis miring (*unqualified class name*), PHP tidak melakukan *fallback* ke global namespace.
- C. PHP otomatis menambahkan `use PDO;` ke dalam berkas.
- D. Koneksi database tetap berhasil dibuat.

**Jawaban Benar:** B
**Penjelasan:** Berbeda dengan fungsi dan konstanta yang memiliki *fallback* ke global namespace, resolusi nama untuk class/interface/enum di dalam sebuah namespace selalu menempelkan namespace aktif saat ini kecuali class tersebut telah diimpor dengan `use PDO;` atau dipanggil dengan FQCN `new \PDO(...)`.

### Soal 2
Fungsi bawaan PHP apakah yang digunakan oleh Composer (dan kode kita sendiri) untuk mendaftarkan fungsi *callback* yang otomatis dipanggil setiap kali program mencoba menggunakan class/interface/enum yang belum dimuat ke memori?
- A. `class_alias()`
- B. `spl_autoload_register()`
- C. `register_shutdown_function()`
- D. `include_once()`

**Jawaban Benar:** B
**Penjelasan:** `spl_autoload_register()` mendaftarkan fungsi pemuat otomatis ke dalam antrean autoloader SPL milik mesin PHP, menggantikan mekanisme tunggal kuno dan memungkinkan beberapa autoloader bekerja berdampingan.

### Soal 3
Mengapa standar PSR-4 mengharuskan setiap satu class ditempatkan di dalam satu berkas `.php` tersendiri yang namanya sama persis dengan nama class tersebut?
- A. Karena PHP membatasi ukuran satu berkas `.php` maksimal 100 baris.
- B. Agar ketika sebuah class belum ada di memori (misalnya `Kodeloka\Auth\Token`), autoloader dapat langsung menghitung jalur berkas fisiknya secara deterministik (`src/Auth/Token.php`) hanya dari nama lengkap class tersebut tanpa perlu membuka dan memindai isi seluruh berkas di proyek.
- C. Agar berkas tersebut tidak bisa dibuka di teks editor biasa.
- D. Karena `namespace` hanya berlaku untuk 50 baris pertama.

**Jawaban Benar:** B
**Penjelasan:** Petunjuk satu-satunya yang diterima oleh callback `spl_autoload_register(fn(string $class))` hanyalah string nama lengkap class yang diminta. Dengan aturan 1 class = 1 berkas bernama identik, autoloader dapat langsung memetakan string nama class tersebut ke jalur berkas di diska dengan instan.

## Sumber
- [Namespaces — PHP Manual](https://www.php.net/manual/en/langref.php)
- [PSR-1: Basic Coding Standard — PHP-FIG](https://www.php-fig.org/psr/psr-1/)
- [PHP Standards Recommendations (PSR-4 Autoloader) — PHP-FIG](https://www.php-fig.org/psr/)
