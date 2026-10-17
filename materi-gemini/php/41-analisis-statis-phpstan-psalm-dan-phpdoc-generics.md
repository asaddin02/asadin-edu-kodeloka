# Analisis Statis Tingkat Lanjut (PHPStan / Psalm) dan Anotasi PHPDoc Generics (`@template`, `array<string, int>`)

- **Tingkat:** Lanjut
- **Ringkasan:** Menemukan bug tipe data, potensi pemanggilan metode pada `null`, dan ketidakcocokan bentuk array tanpa perlu menjalankan satu baris kode pun menggunakan **PHPStan (Level 8–10)** serta anotasi tipe generik PHPDoc (`@template T`, `@param list<T>`, `array{id: positive-int, nama: non-empty-string}`).

## Mengapa Deklarasi Tipe Bawaan PHP Saja Belum Cukup Tanpa Analisis Statis?

Sejak PHP 8.0 hingga PHP 8.5, sistem tipe runtime PHP sudah sangat maju (mendukung *union types*, *intersection types*, `readonly`, dan `true`/`false`/`null` mandiri). Namun, demi menjaga kecepatan eksekusi runtime agar tidak melambat saat memeriksa array besar, deklarasi tipe bawaan PHP memiliki dua batasan yang disengaja:
1. **Tidak ada tipe isi Array di runtime:** Anda hanya bisa menulis `function proses(array $daftar): array`, tanpa bisa memberi tahu mesin PHP bahwa `$daftar` wajib berupa daftar objek `Produk` (`list<Produk>`) atau memiliki bentuk kunci spesifik `array{id: int, judul: string}`.
2. **Tidak ada Generics di runtime:** Anda tidak bisa menulis `Koleksi<Produk>` di sintaks runtime PHP.

Kedua celah tersebut ditutup dengan sempurna oleh penganalisis statis (**PHPStan** dan **Psalm**) yang membaca anotasi **PHPDoc Generics & Array Shapes** pada waktu *build* / CI, lalu melacak aliran tipe di seluruh kode Anda tanpa membebani kecepatan runtime sedikit pun!

> **🚫 Kerentanan & Kesalahan Umum:** Deklarasi tipe bawaan PHP `array` tidak memberi tahu isi elemen di dalamnya; tanpa anotasi `@param array<int, Produk>` dan analisis statis PHPStan, bug salah ketik kunci array baru akan meledak saat kode sudah berjalan di produksi.

## 1. Peta Tipe PHPDoc Lanjutan yang Dikenali oleh PHPStan & Psalm

Berikut adalah anotasi tipe PHPDoc paling kuat untuk mengunci kontrak kode PHP Anda:

| Sintaks Tipe PHPDoc | Arti & Jaminan Pemeriksaan Statis | Contoh Penggunaan |
| :--- | :--- | :--- |
| **`list<T>`** | Array berindeks bilangan bulat berurutan mulai dari `0` tanpa celah (`0, 1, 2, ...`). | `@return list<Artikel>` |
| **`array<TKunci, TNilai>`** | Peta/kamus array dengan tipe kunci dan nilai yang seragam. | `@param array<string, int> $skorPerMapel` |
| **Array Shape (`array{...}`)** | Array asosiatif dengan nama kunci tetap dan tipe spesifik per kunci (tanda `?` untuk kunci opsional). | `@return array{id: int, email: string, aktif?: bool}` |
| **`@template T`** (Generics) | Parameter tipe generik pada class, interface, atau fungsi. | `@template T of object` + `@param class-string<T> $kelas` + `@return T` |
| **`non-empty-string` & `positive-int`** | String yang dijamin `!== ''` dan bilangan bulat yang dijamin `>= 1`. | `@param non-empty-string $slug` |
| **`int<0, 100>`** | Rentang bilangan bulat (*integer range*) yang dibatasi antara nilai minimum dan maksimum. | `@param int<0, 100> $persenDiskon` |

## 2. Membangun Class Koleksi Generik (`@template`) dan Pabrik Objek (`class-string<T>`)

Perhatikan bagaimana anotasi `@template TItem` dan `@template TObject of object` di bawah ini memungkinkan PHPStan dan IDE mengetahui tipe kembalian metode secara otomatis tanpa perlu melakukan *type casting* manual:

```php
<?php
declare(strict_types=1);

/**
 * @template TItem
 */
final class KoleksiTerukur
{
    /** @var list<TItem> */
    private array $item = [];

    /** @param TItem $elemen */
    public function tambah(mixed $elemen): void
    {
        $this->item[] = $elemen;
    }

    /** @return list<TItem> */
    public function semua(): array
    {
        return $this->item;
    }

    /**
     * @template THasil
     * @param callable(TItem): THasil $pemeta
     * @return list<THasil>
     */
    public function petakan(callable $pemeta): array
    {
        return array_map($pemeta, $this->item);
    }
}

/**
 * Menginstansiasi class berdasarkan nama class-nya dan mempertahankan tipenya.
 *
 * @template TObject of object
 * @param class-string<TObject> $namaKelas
 * @return TObject
 */
function buatInstans(string $namaKelas): object
{
    return new $namaKelas();
}
```

## 3. Memahami Tingkat Ketelitian PHPStan (Level 0 hingga Level 10)

PHPStan memiliki tingkat pemeriksaan bertahap dari **Level 0** (paling longgar, cocok untuk mulai dipasang di proyek warisan) hingga **Level 10** (paling ketat di PHPStan 2.x):
- **Level 0–4:** Memeriksa fungsi/metode yang tidak ada, variabel yang belum didefinisikan, jumlah argumen yang salah, dan kode mati (*dead code*).
- **Level 5–6:** Memeriksa tipe argumen yang diteruskan ke fungsi dan mewajibkan penulisan tipe elemen pada setiap `array` (melarang `@param array` telanjang tanpa `array<...>`!).
- **Level 8:** **Mewajibkan pemeriksaan `null` (*null-safety*)**: jika sebuah metode mengembalikan `Pengguna|null`, memanggil `$pengguna->nama` tanpa memeriksa `if ($pengguna !== null)` atau `?->` akan langsung ditolak oleh PHPStan!
- **Level 9–10:** Mengawasi penggunaan tipe `mixed` secara ketat: Anda tidak diizinkan meneruskan nilai bertipe `mixed` (misalnya hasil `json_decode`) ke parameter bertipe `string` atau mengakses `$mixed['kunci']` sebelum mempersempit tipenya dengan `is_array()` / `is_string()` (*type narrowing*)!

```php
<?php
declare(strict_types=1);

/**
 * Menggunakan Array Shape dan penyempitan tipe (Type Narrowing) yang lulus PHPStan Level 10.
 *
 * @return array{id: positive-int, judul: non-empty-string}
 */
function validasiDataModul(mixed $inputMentah): array
{
    if (!is_array($inputMentah)) {
        throw new InvalidArgumentException('Data masukan wajib berupa array.');
    }
    $id    = $inputMentah['id'] ?? null;
    $judul = $inputMentah['judul'] ?? null;

    if (!is_int($id) || $id < 1) {
        throw new InvalidArgumentException('ID wajib bilangan bulat positif.');
    }
    if (!is_string($judul) || $judul === '') {
        throw new InvalidArgumentException('Judul tidak boleh kosong.');
    }

    return ['id' => $id, 'judul' => $judul];
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menulis `@return array` tanpa bentuk atau tipe elemen:** Pada PHPStan Level 6+, `@return array` akan ditolak dengan pesan *missing value type specified in iterable type array*. Selalu rinci apakah itu `list<string>`, `array<string, mixed>`, atau `array{status: string, kode: int}`.
2. **Menyalahgunakan `@var` sebaris untuk membungkam peringatan PHPStan tanpa validasi runtime:** Menulis `/** @var string $nama */ $nama = $_POST['nama'];` membohongi PHPStan seolah-olah `$nama` pasti string, padahal pengguna bisa mengirim array `$_POST['nama'][] = 1` yang meledakkan runtime! Gunakan pemeriksaan `if (!is_string($nama))` atau `@phpstan-assert` agar pemeriksaan statis dan runtime selaras.
3. **Menunda pemasangan PHPStan karena takut ribuan galat pada kode lama:** Gunakan fitur **Baseline (`vendor/bin/phpstan analyse --generate-baseline`)** untuk membekukan utang galat lama ke berkas `phpstan-baseline.neon`, sehingga seluruh kode baru yang ditulis mulai hari ini wajib lulus Level 8 tanpa harus memperbaiki seluruh kode warisan sekaligus!

## Latihan Praktik Mandiri

1. Buat berkas `KoleksiTerukur.php` lengkap dengan anotasi `@template TItem`, metode `tambah()`, `semua()`, `petakan()`, dan fungsi `validasiDataModul()`.
2. Tulis pengujian PHPUnit untuk memverifikasi perilaku `KoleksiTerukur` dan validasi batas `validasiDataModul()`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Deklarasi tipe bawaan PHP `array` tidak memberi tahu isi elemen di dalamnya; tanpa anotasi `@param array<int, Produk>` dan analisis statis PHPStan, bug salah ketik kunci array baru akan meledak saat kode sudah berjalan di produksi.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena kesalahan tipe isi array (misalnya salah ketik kunci) baru ketahuan ketika kode sudah berjalan di produksi dan menimbulkan galat, padahal analisis statis dapat menangkapnya lebih awal tanpa menjalankan kode
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Deklarasi tipe bawaan PHP `array` tidak memberi tahu isi elemen di dalamnya; tanpa anotasi `@param array<int, Produk>` dan analisis statis PHPStan, bug salah ketik kunci array baru akan meledak saat kode sudah berjalan di produksi.

### Soal 2
Dalam anotasi PHPDoc untuk PHPStan dan Psalm, apakah arti dari tanda tangan berikut?
```php
/**
 * @template T of object
 * @param class-string<T> $namaKelas
 * @return T
 */
function ambilLayanan(string $namaKelas): object
```
- A. Fungsi hanya boleh menerima string `"T"` dan selalu mengembalikan array
- B. Mendefinisikan fungsi generik di mana parameter `$namaKelas` wajib berupa nama class valid (misalnya `KoneksiDb::class`), dan penganalisis statis secara otomatis mengetahui bahwa nilai kembalian fungsi tersebut adalah instans dari class `KoneksiDb` tersebut
- C. Mengubah string menjadi tabel database secara otomatis
- D. Mematikan pemeriksaan `strict_types=1`

**Jawaban Benar:** B
**Penjelasan:** Anotasi `@template T of object` yang dipadukan dengan `@param class-string<T>` dan `@return T` mengikat tipe instans kembalian dengan konstanta `::class` yang dikirimkan sebagai argumen (sangat berguna untuk *Dependency Injection Container* dan *Repository Factory*).

### Soal 3
Apa perbedaan antara tipe PHPDoc `list<string>` dan `array<int, string>` di PHPStan?
- A. `list<string>` hanya boleh berisi maksimal 3 elemen
- B. `list<string>` mewajibkan array memiliki indeks bilangan bulat berurutan tanpa celah mulai dari `0` (`0, 1, 2, ...` sesuai `array_is_list()`), sedangkan `array<int, string>` mengizinkan indeks bilangan bulat berapapun termasuk yang memiliki celah atau negatif (seperti `[10 => 'a', 25 => 'b']`)
- C. `array<int, string>` hanya berlaku untuk objek `SplFixedArray`
- D. Keduanya tidak memiliki perbedaan sama sekali

**Jawaban Benar:** B
**Penjelasan:** Tipe `list<T>` di PHPStan/Psalm merepresentasikan daftar berurutan dengan kunci `0..count-1` (bebas celah indeks), sedangkan `array<int, T>` adalah peta umum yang kuncinya bertipe integer.

## Sumber

- [Getting Started — PHPStan](https://phpstan.org/user-guide/getting-started)
- [PHPDocs Basics and PHPDoc Types — PHPStan](https://phpstan.org/writing-php-code/phpdoc-types)
- [Psalm Documentation](https://psalm.dev/docs/)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
