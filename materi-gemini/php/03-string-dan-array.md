# Pengolahan String Multibyte (`mb_*`) dan Array Modern di PHP 8.4 & 8.5

- **Tingkat:** Dasar
- **Ringkasan:** Memanipulasi teks UTF-8 dengan aman menggunakan fungsi `mb_*` dan `str_contains()` / `str_starts_with()`, serta menguasai struktur data Array PHP, *destructuring/unpacking*, hingga fungsi baru `array_find()` (PHP 8.4) dan `array_first()` / `array_last()` (PHP 8.5).

## 1. String di PHP dan Mengapa Fungsi `mb_*` Sangat Penting untuk UTF-8

Di PHP, string yang diapit tanda kutip tunggal (`'...'`) dibaca apa adanya, sedangkan string yang diapit tanda kutip ganda (`"..."`) atau blok **Heredoc** (`<<<TEKS ... TEKS`) mendukung interpolasi variabel secara langsung (`"Halo, {$nama}!"`).

### Jebakan Klasik: `strlen()` Menghitung Byte, Bukan Karakter Huruf!
Fungsi string klasik di PHP seperti `strlen()`, `substr()`, dan `strtolower()` berasal dari era ASCII di mana 1 karakter selalu dianggap berukuran 1 byte.
Padahal, dalam pengodean **UTF-8** modern, huruf beraksen (seperti `é`), aksara daerah/Jepang/Arab, atau emoji (seperti `🚀`) berukuran **2 hingga 4 byte per karakter**!

```php
<?php

declare(strict_types=1);

$teks = 'Kodeloka 🚀'; // 8 huruf + 1 spasi + 1 emoji = 10 karakter

// SALAH untuk menghitung panjang karakter UTF-8:
echo strlen($teks);    // Mencetak 13 (karena emoji 🚀 memakan 4 byte!)

// BENAR: Gunakan fungsi Multibyte String (mb_*) untuk operasi panjang & potong karakter!
echo mb_strlen($teks); // Mencetak 10 (Tepat 10 karakter!)
echo mb_substr($teks, 0, 8); // "Kodeloka"
```

> **💡 Fitur Baru di PHP 8.4: `mb_trim()`, `mb_ucfirst()`, dan `mb_lcfirst()`**
> Sejak **PHP 8.4**, ekstensi `mbstring` kini menyediakan **`mb_trim()`**, **`mb_ltrim()`**, **`mb_rtrim()`**, **`mb_ucfirst()`**, dan **`mb_lcfirst()`** yang mampu memangkas spasi Unicode tak terlihat (seperti *non-breaking space*) dan mengubah huruf pertama karakter multibyte dengan akurat!

### Fungsi Pemeriksaan Substring Modern (Sejak PHP 8.0)
Jangan lagi menggunakan `strpos($teks, 'kata') !== false` yang rawan salah ketik! Sejak PHP 8.0, gunakan tiga fungsi boolean yang sangat jelas ini:

```php
<?php

declare(strict_types=1);

$jalurBerkas = '/materi/php/03-string-dan-array.md';

var_dump(str_starts_with($jalurBerkas, '/materi/')); // bool(true)
var_dump(str_ends_with($jalurBerkas, '.md'));        // bool(true)
var_dump(str_contains($jalurBerkas, 'php'));         // bool(true)
```

## 2. Anatomi Array di PHP: Satu Struktur untuk List dan Kamus (*Map*)

Di PHP, tipe data `array` adalah struktur peta terurut (*ordered map*) serbaguna yang dapat berperan sebagai:
1. **List (Array Terindeks Angka Berurutan `0, 1, 2, ...`):**
   `$modul = ['HTML', 'CSS', 'JavaScript', 'PHP'];`
   *(Anda dapat memeriksa apakah sebuah array merupakan list murni berindeks `0..n-1` menggunakan fungsi **`array_is_list($arr)`** sejak PHP 8.1!)*
2. **Associative Array (Pasangan Kunci-Nilai seperti Map/Dictionary):**
   ```php
   $kelas = [
       'slug' => 'php',
       'judul' => 'Pemrograman PHP Modern',
       'jumlah_modul' => 15,
   ];
   ```

### Destructuring dan Array Unpacking (`...`)
Sejak PHP 7.4 dan PHP 8.1, Anda dapat membongkar isi array (baik list maupun asosiatif) dan menggabungkan array menggunakan operator `...` (termasuk array dengan kunci string sejak PHP 8.1):

```php
<?php

declare(strict_types=1);

$konfigurasiDasar = ['host' => 'localhost', 'port' => 5432, 'timeout' => 5];
$konfigurasiProduksi = ['host' => 'db.kodeloka.internal', ' sslmode' => 'require'];

// Menggabungkan dua array asosiatif dengan spread '...'; kunci yang sama di kanan akan menimpa yang kiri!
$konfigurasiAkhir = [...$konfigurasiDasar, ...$konfigurasiProduksi];

// Destructuring array asosiatif berdasarkan nama kuncinya:
['host' => $hostDb, 'port' => $portDb] = $konfigurasiAkhir;
echo "{$hostDb}:{$portDb}"; // "db.kodeloka.internal:5432"
```

## 3. Transformasi Array dan Fungsi Baru di PHP 8.4 & PHP 8.5

### A. `array_map()`, `array_filter()`, dan `array_reduce()`
Perhatikan satu perbedaan urutan parameter di PHP:
- Pada `array_map($callback, $array)`: **fungsi callback ditulis di argumen pertama**, baru diikuti `$array` di argumen kedua.
- Pada `array_filter($array, $callback)`: **`$array` ditulis di argumen pertama**, diikuti `$callback`!
  - **Penting tentang `array_filter()`:** Secara bawaan, `array_filter()` **mempertahankan kunci indeks aslinya** (sehingga setelah menyaring indeks `0, 1, 2`, hasilnya bisa berindeks bolong `0, 2` yang ketika diubah ke JSON berubah menjadi objek `{"0": ..., "2": ...}`!). Jika Anda membutuhkan array list berindeks ulang `0, 1, ...`, bungkus hasilnya dengan **`array_values(array_filter(...))`**!

### B. Pencarian Deklaratif dengan `array_find()`, `array_any()`, dan `array_all()` (Sejak PHP 8.4)
Sebelum PHP 8.4, mencari satu elemen pertama di dalam array berdasarkan kondisi callback mengharuskan kita menulis perulangan `foreach` manual. Sejak **PHP 8.4**, tersedia empat fungsi bawaan baru:

```php
<?php

declare(strict_types=1);

$daftarServer = [
    ['nama' => 'web-01', 'beban_cpu' => 42, 'aktif' => true],
    ['nama' => 'web-02', 'beban_cpu' => 88, 'aktif' => true],
    ['nama' => 'db-01',  'beban_cpu' => 91, 'aktif' => true],
];

// 1. array_find() (Sejak PHP 8.4): Mengembalikan NILAI elemen pertama yang cocok (atau null jika tidak ada)
$serverSibukPertama = array_find(
    $daftarServer,
    static fn(array $srv): bool => $srv['beban_cpu'] > 80,
);
// Menghasilkan: ['nama' => 'web-02', 'beban_cpu' => 88, 'aktif' => true]

// 2. array_any() (Sejak PHP 8.4): Apakah ADA minimal satu elemen yang memenuhi syarat?
$adaYangKritis = array_any(
    $daftarServer,
    static fn(array $srv): bool => $srv['beban_cpu'] >= 90,
); // true

// 3. array_all() (Sejak PHP 8.4): Apakah SEMUA elemen memenuhi syarat?
$semuaAktif = array_all(
    $daftarServer,
    static fn(array $srv): bool => $srv['aktif'] === true,
); // true
```

### C. Mengambil Elemen Pertama dan Terakhir dengan `array_first()` & `array_last()` (Sejak PHP 8.5)
Di versi PHP lama, mengambil nilai elemen terakhir tanpa mengubah pointer internal array mengharuskan penulisan `$arr === [] ? null : $arr[array_key_last($arr)]`.
Sejak **PHP 8.5**, hadir fungsi **`array_first($array)`** dan **`array_last($array)`** yang langsung mengembalikan nilai pertama atau terakhir (atau `null` jika array kosong):

```php
<?php

declare(strict_types=1);

$riwayatVersi = ['8.2', '8.3', '8.4', '8.5'];

// Sejak PHP 8.5:
$versiTerbaru = array_last($riwayatVersi); // "8.5"
$versiAwal    = array_first($riwayatVersi); // "8.2"
$kosong       = array_last([]);             // null (Aman digabungkan dengan ?? 'bawaan')
```

## Latihan Praktik: Pengolah Katalog Modul dengan Fungsi Array PHP 8.4/8.5

Buatlah berkas `katalog-array.php`:
1. Buat array `$modul` berisi 4 item asosiatif `['id' => ..., 'judul' => ..., 'menit' => ...]`.
2. Gunakan `str_contains()` di dalam `array_filter()` (diikuti `array_values()`) untuk menyaring modul yang judulnya mengandung kata tertentu.
3. Gunakan `array_find()` (PHP 8.4) untuk mencari modul pertama yang durasinya di atas 20 menit, dan gunakan `array_last()` (PHP 8.5) atau `array_key_last()` untuk mengambil modul penutup.

## Kuis Pemahaman

### Soal 1
Mengapa penggunaan `strlen($nama)` bisa menghasilkan angka yang lebih besar dari jumlah huruf sebenarnya ketika pengguna memasukkan nama yang mengandung karakter non-ASCII atau emoji?
- A. Karena `strlen()` selalu menambahkan angka 1 untuk karakter akhir string.
- B. Karena `strlen()` menghitung jumlah **byte** di dalam memori, bukan jumlah karakter Unicode; dalam pengodean UTF-8, satu karakter non-ASCII atau emoji terdiri dari 2 hingga 4 byte, sehingga kita harus menggunakan `mb_strlen()` untuk menghitung jumlah karakter.
- C. Karena `strlen()` menghitung jumlah kata, bukan huruf.
- D. Karena tanda kutip tunggal menggandakan ukuran string.

**Jawaban Benar:** B
**Penjelasan:** `strlen()` bekerja pada tingkat byte mentah. Untuk teks UTF-8 multibyte, gunakan `mb_strlen($teks, 'UTF-8')` dari ekstensi `mbstring` agar setiap karakter dihitung secara akurat sebagai 1 karakter.

### Soal 2
Apa masalah yang sering muncul ketika Anda langsung mengubah hasil `array_filter($daftar)` menjadi JSON menggunakan `json_encode()`, dan bagaimana cara mengatasinya?
- A. `array_filter()` menghapus semua nilai di dalam array.
- B. `array_filter()` mempertahankan kunci indeks asli elemen yang lolos saringan; jika elemen indeks ke-0 terbuang sehingga kunci dimulai dari indeks `1`, `json_encode()` akan mengubahnya menjadi objek JSON `{"1": ...}` alih-alih array JSON `[...]`. Solusinya adalah membungkusnya dengan `array_values(array_filter($daftar, ...))`.
- C. `json_encode()` tidak menerima array di PHP 8.
- D. `array_filter()` membalik urutan elemen secara otomatis.

**Jawaban Benar:** B
**Penjelasan:** `json_encode()` hanya menghasilkan array JSON `[...]` jika array PHP merupakan *list* dengan kunci bilangan bulat berurutan mulai dari `0` (`array_is_list()`). Memanggil `array_values()` akan mengatur ulang indeks hasil saringan kembali menjadi `0, 1, 2, ...`.

### Soal 3
Fungsi bawaan manakah yang diperkenalkan di **PHP 8.4** untuk mengembalikan nilai elemen pertama di dalam array yang memenuhi kondisi fungsi *callback* (atau mengembalikan `null` jika tidak ditemukan)?
- A. `in_array()`
- B. `array_search()`
- C. `array_find()`
- D. `array_slice()`

**Jawaban Benar:** C
**Penjelasan:** Sejak PHP 8.4, `array_find(array $array, callable $callback)` (beserta `array_find_key()`, `array_any()`, dan `array_all()`) tersedia secara bawaan untuk mencari elemen berdasarkan kondisi fungsi *callback*.

## Sumber
- [Strings — PHP Manual](https://www.php.net/manual/en/language.types.php)
- [Human Language and Character Encoding Support (`mbstring`) — PHP Manual](https://www.php.net/manual/en/refs.international.php)
- [PHP 8.4 Release Announcement (`array_find`, `mb_trim`) — PHP.net](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement (`array_first`, `array_last`) — PHP.net](https://www.php.net/releases/8.5/en.php)
