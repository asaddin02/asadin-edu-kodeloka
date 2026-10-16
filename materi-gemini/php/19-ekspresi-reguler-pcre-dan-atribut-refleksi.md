# Ekspresi Reguler (PCRE2 `preg_*`), Attributes (`#[...]`), dan Reflection API

- **Tingkat:** Lanjut
- **Ringkasan:** Mencocokkan dan mengekstrak pola teks menggunakan fungsi PCRE2 (`preg_match`, `preg_match_all`, `preg_replace_callback`), serta merancang metadata deklaratif menggunakan **PHP Attributes (`#[...]`)** yang dibaca saat runtime melalui **Reflection API**.

## 1. Ekspresi Reguler di PHP dengan Ekstensi PCRE2 (`preg_*`)

Di PHP, ekspresi reguler menggunakan mesin **PCRE2 (*Perl Compatible Regular Expressions*)** di mana pola selalu diapit oleh karakter pembatas (*delimiter*, biasanya garis miring `/pola/flags` atau tanda pagar `#pola#flags` jika pola mengandung banyak garis miring URL):

```php
<?php

declare(strict_types=1);

// 1. preg_match(): Mengembalikan 1 jika cocok, 0 jika tidak cocok, atau false jika terjadi galat
//    Gunakan Named Subpatterns (?<nama>...) dan flag 'u' (UTF-8 mode)!
$polaKodeKelas = '/^(?<bidang>[a-z]+)-(?<nomor>\d{3})$/u';

if (preg_match($polaKodeKelas, 'backend-104', $tangkapan) === 1) {
    echo "Bidang: {$tangkapan['bidang']}, Nomor: {$tangkapan['nomor']}\n";
    // Bidang: backend, Nomor: 104
}

// 2. preg_replace_callback(): Mengubah teks yang cocok menggunakan fungsi callback yang aman!
$teksMarkdown = 'Baca modul [[01-cara-web-bekerja]] dan [[02-struktur-dokumen-html]].';

$teksHtml = preg_replace_callback(
    '/\[\[(?<slug>[a-z0-9-]+)\]\]/u',
    static fn(array $m): string => sprintf(
        '<a href="/materi/%s">%s</a>',
        htmlspecialchars($m['slug'], ENT_QUOTES, 'UTF-8'),
        htmlspecialchars($m['slug'], ENT_QUOTES, 'UTF-8'),
    ),
    $teksMarkdown,
);

echo $teksHtml;
```

> **⚠️ Jebakan Keamanan Klasik pada Regex di PHP: `^` dan `$` vs `\A` dan `\z`!**
> Jika Anda menggunakan flag multiline (`m`), atau bahkan tanpa flag `m`, jangkar akhir **`$`** di PCRE secara bawaan masih mengizinkan satu karakter baris baru (`\n`) di paling ujung string!
> Untuk validasi keamanan ketat yang memastikan tidak ada baris baru yang menyelundup di akhir string, gunakan **`\A`** (awal mutlak string) dan **`\z`** (akhir mutlak string), atau tambahkan flag **`D` (`PCRE_DOLLAR_ENDONLY`)**!

## 2. Mengenal PHP Attributes (`#[...]` — Sejak PHP 8.0 hingga 8.5)

Di pelajaran sebelumnya, kita telah memakai atribut bawaan PHP seperti `#[\Override]` dan `#[\NoDiscard]`; atribut bawaan lain seperti `#[\Deprecated]` serta atribut PHPUnit seperti `#[Test]` dan `#[DataProvider]` akan ditemui pada pelajaran berikutnya.

Apa sebenarnya **Attributes (`#[...]`)** itu?
Sebelum PHP 8.0, pengembang terpaksa menulis konfigurasi metadata di dalam komentar teks `/** @Route("/kelas") */` (*docblock annotations*) lalu mengurainya dengan regex yang lambat dan rawan salah ketik.
Sejak **PHP 8.0**, **Attributes** menyediakan **metadata terstruktur kelas satu di tingkat sintaks bahasa PHP** yang dapat ditempelkan pada class, metode, fungsi, properti, parameter, maupun konstanta!

## 3. Membuat *Custom Attribute* Sendiri dan Membacanya dengan Reflection API

Mari kita lihat bagaimana framework modern (seperti Symfony atau Laravel) mendaftarkan rute URL atau izin akses secara otomatis menggunakan **Custom Attribute** dan **`ReflectionClass` / `ReflectionMethod`**:

```php
<?php

declare(strict_types=1);

namespace Kodeloka\Routing;

use Attribute;
use ReflectionClass;
use ReflectionMethod;

// 1. Mendefinisikan class Attribute kita sendiri:
//    Batasi agar atribut #[Rute] hanya boleh dipasang pada METODE (TARGET_METHOD)
#[Attribute(Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
readonly class Rute
{
    public function __construct(
        public string $jalur,
        public string $metodeHttp = 'GET',
    ) {}
}

// 2. Memasang atribut #[Rute] pada metode di dalam Controller:
final class KelasController
{
    #[Rute(jalur: '/kelas', metodeHttp: 'GET')]
    public function daftarKelas(): string
    {
        return 'Menampilkan daftar semua kelas Kodeloka';
    }

    #[Rute(jalur: '/kelas/daftar', metodeHttp: 'POST')]
    public function prosesPendaftaran(): string
    {
        return 'Memproses pendaftaran peserta baru';
    }
}

// 3. Membaca metadata Attribute saat runtime menggunakan Reflection API!
function ekstrakDaftarRute(string $namaClassController): array
{
    $refleksiKelas = new ReflectionClass($namaClassController);
    $petaRute = [];

    foreach ($refleksiKelas->getMethods(ReflectionMethod::IS_PUBLIC) as $metode) {
        // Mengambil seluruh atribut #[Rute] yang menempel pada metode ini
        $atributRute = $metode->getAttributes(Rute::class);

        foreach ($atributRute as $attr) {
            /** @var Rute $instansRute */
            $instansRute = $attr->newInstance(); // Menginstansiasi objek Rute!

            $petaRute[] = [
                'http'   => $instansRute->metodeHttp,
                'jalur'  => $instansRute->jalur,
                'target' => $namaClassController . '::' . $metode->getName(),
            ];
        }
    }

    return $petaRute;
}

print_r(ekstrakDaftarRute(KelasController::class));
```

*(Catatan: Sejak **PHP 8.5**, parameter di dalam atribut `#[...]` bahkan sudah dapat menerima **static closures** dan **first-class callables** secara langsung!)*

## Latihan Praktik: Validator Objek Otomatis Berbasis Atribut `#[WajibDiisi]` dan `#[PanjangTeks]`

Buatlah berkas `validator-atribut.php` dan jalankan dengan `php validator-atribut.php`:
1. Buat atribut `#[Attribute(Attribute::TARGET_PROPERTY)] readonly class PanjangTeks` dengan properti `public int $min` dan `public int $maks`.
2. Buat DTO `class InputKursus` yang propertinya dipasangi `#[PanjangTeks(min: 5, maks: 50)] public string $judul`.
3. Buat fungsi `validasiObjek(object $dto): array` yang menggunakan `new ReflectionClass($dto)` untuk memeriksa semua properti yang memiliki atribut `PanjangTeks` dan mengembalikan daftar pesan kesalahan jika panjangnya tidak sesuai!

## Kuis Pemahaman

### Soal 1
Mengapa selalu disarankan menyertakan bendera **`u`** (*UTF-8 mode*, misalnya `/^[\p{L}\s]+$/u`) saat menjalankan fungsi `preg_match()` pada teks Bahasa Indonesia atau nama pengguna internasional?
- A. Agar fungsi `preg_match()` mengubah semua huruf menjadi huruf kapital.
- B. Agar mesin PCRE2 memperlakukan string pola maupun string subjek sebagai rangkaian karakter UTF-8 yang utuh (bukan byte ASCII terpisah) serta mengaktifkan dukungan kelas properti karakter Unicode seperti `\p{L}` (huruf dari aksara mana pun).
- C. Agar hasil tangkapan otomatis diurutkan.
- D. Karena tanpa flag `u`, `preg_match()` tidak bisa memeriksa angka.

**Jawaban Benar:** B
**Penjelasan:** Tanpa modifier `u` (`PCRE_UTF8`), mesin PCRE memproses string byte demi byte sehingga karakter multibyte (seperti huruf beraksen atau aksara daerah) dapat terpotong di tengah byte dan merusak pencocokan pola.

### Soal 2
Apa fungsi dari metode `$attr->newInstance()` ketika kita membaca atribut PHP 8 melalui `$metode->getAttributes(Rute::class)` pada Reflection API?
- A. Membuat salinan baru dari class Controller.
- B. Menginstansiasi objek dari class Attribute tersebut (misalnya `new Rute(...)`) lengkap dengan argumen-argumen yang ditulis di dalam tanda `#[Rute(...)]` pada kode sumber.
- C. Menghapus atribut dari metode tersebut.
- D. Menjalankan metode Controller secara langsung.

**Jawaban Benar:** B
**Penjelasan:** Metode `getAttributes()` pada objek refleksi (misalnya `ReflectionMethod`) terlebih dahulu mengembalikan array objek `ReflectionAttribute`, yaitu representasi refleksi yang ringan. Ketika `$attr->newInstance()` dipanggil, PHP memanggil konstruktor class Attribute tersebut dengan argumen yang tertulis pada deklarasi atributnya dan mengembalikan objeknya.

### Soal 3
Bagaimana cara membatasi agar sebuah *Custom Attribute* yang kita buat hanya boleh ditempelkan pada **properti class** saja (dan ditolak oleh PHP saat `newInstance()` dipanggil jika tidak sengaja ditempelkan pada fungsi atau class)?
- A. Menambahkan `#[Attribute(Attribute::TARGET_PROPERTY)]` di atas deklarasi class Attribute tersebut.
- B. Menjadikan class Attribute tersebut sebagai `abstract class`.
- C. Menyimpan class Attribute di dalam folder `properties/`.
- D. Menambahkan kata kunci `private` di depan `class`.

**Jawaban Benar:** A
**Penjelasan:** Konstanta bitmask `Attribute::TARGET_PROPERTY` (serta `TARGET_CLASS`, `TARGET_METHOD`, `TARGET_PARAMETER`, `TARGET_CLASS_CONSTANT`) menentukan target sintaks mana saja yang sah untuk ditempeli atribut tersebut.

## Sumber
- [PCRE (Regular Expressions) — PHP Manual](https://www.php.net/manual/en/book.pcre.php)
- [Attributes overview — PHP Manual](https://www.php.net/manual/en/language.attributes.overview.php)
- [Reading attributes with the Reflection API — PHP Manual](https://www.php.net/manual/en/language.attributes.reflection.php)
- [PCRE pattern modifiers — PHP Manual](https://www.php.net/manual/en/reference.pcre.pattern.modifiers.php)
- [PHP 8.5 Release Announcement (Closures in Constant Expressions / Attributes) — PHP.net](https://www.php.net/releases/8.5/en.php)
