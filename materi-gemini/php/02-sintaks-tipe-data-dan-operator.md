# Sintaks, Sistem Tipe Modern, Ekspresi `match`, dan Operator Pipe (`|>`)

- **Tingkat:** Dasar
- **Ringkasan:** Menguasai variabel, konstanta, deklarasi tipe skalar dan gabungan (*union/intersection types*), perbandingan ketat `===`, ekspresi `match` (sejak PHP 8.0), operator *nullsafe* `?->`, hingga operator *pipe* `|>` (sejak PHP 8.5).

## 1. Variabel, Konstanta, dan Sistem Tipe Data di PHP 8

Di PHP, seluruh nama variabel diawali dengan tanda dolar (**`$`**, misalnya `$namaPengguna`), bersifat peka huruf besar/kecil (*case-sensitive*), sedangkan konstanta didefinisikan dengan kata kunci **`const`** (tanpa tanda `$`):

```php
<?php

declare(strict_types=1);

const PAJAK_PPN = 0.11;
const STATUS_AKTIF = 'aktif';

$hargaDasar = 250_000;
$totalPajak = $hargaDasar * PAJAK_PPN;
```

### Daftar Tipe Data yang Didukung dalam Deklarasi Tipe PHP Modern

| Kategori | Tipe Data | Penjelasan dan Versi |
|---|---|---|
| **Tipe Skalar** | `int`, `float`, `string`, `bool` | Bilangan bulat 64-bit, desimal titik-ambang, teks, dan boolean (`true`/`false`). |
| **Tipe Majemuk** | `array`, `object`, `callable`, `iterable` | Daftar/peta array, instans objek, fungsi yang dapat dipanggil, dan koleksi yang bisa di-`foreach`. |
| **Tipe Khusus** | `void`, `null`, `false`, `true`, `never`, `mixed` | `void` (tidak mengembalikan nilai), `never` (selalu melempar exception atau keluar — sejak PHP 8.1), `mixed` (tipe apa saja — sejak PHP 8.0). |
| **Nullable Type (`?T`)** | `?string`, `?int`, `? Pengaturan` | Mengizinkan nilai bertipe `T` **atau** `null` (sama dengan `string\|null`). |
| **Union Types (`A\|B`)** | `int\|float`, `string\|Stringable` | Mengizinkan nilai dari salah satu tipe yang digabungkan dengan tanda `\|` (sejak PHP 8.0). |
| **Intersection Types (`A&B`)** | `Iterator&Countable` | Nilai wajib memenuhi **semua** interface/tipe yang digabungkan dengan `&` (sejak PHP 8.1). |

> **⚠️ Deprekasi Penting di PHP 8.5: Nama Cast Non-Kanonik!**
> Sejak **PHP 8.5**, penggunaan nama konversi tipe (*type casting*) versi panjang yaitu `(integer)`, `(boolean)`, `(double)`, dan `(binary)` **telah dideprekasi (usang)**. Selalu gunakan bentuk pendek kanonik: **`(int)`**, **`(bool)`**, **`(float)`**, dan **`(string)`**!

## 2. Perbandingan Ketat (`===`) dan Ekspresi `match` (Sejak PHP 8.0)

Sama seperti di JavaScript, hindari operator kesetaraan longgar `==` di PHP dan **selalu gunakan operator kesetaraan ketat `===` serta `!==`** yang memeriksa kesamaan nilai sekaligus tipe datanya.

Begitu pula untuk percabangan multi-kondisi: pernyataan `switch (...)` tradisional memiliki dua kelemahan besar:
1. Menggunakan perbandingan longgar (`==`) secara diam-diam.
2. Mengharuskan Anda menulis `break;` di setiap `case` (jika lupa, eksekusi akan bocor jatuh ke `case` berikutnya / *fallthrough*).

Sejak **PHP 8.0**, hadir ekspresi **`match`** yang jauh lebih aman, ringkas, dan dapat langsung mengembalikan nilai ke dalam sebuah variabel:

```php
<?php

declare(strict_types=1);

function deskripsiStatusHttp(int $kode): string
{
    return match ($kode) {
        200, 201, 204 => 'Permintaan berhasil diproses',
        301, 302, 307, 308 => 'Alamat sumber daya dialihkan',
        400 => 'Permintaan tidak valid (Bad Request)',
        401, 403 => 'Akses ditolak atau belum terautentikasi',
        404 => 'Sumber daya tidak ditemukan',
        default => 'Kesalahan server atau status tidak dikenal',
    };
}

echo deskripsiStatusHttp(404); // "Sumber daya tidak ditemukan"
```

### Keunggulan `match` dibandingkan `switch`:
1. **Perbandingan Ketat (`===`):** Angka `200` tidak akan pernah salah cocok dengan string `"200"`.
2. **Tidak Ada *Fallthrough* Tak Sengaja:** Setiap lengan otomatis berhenti setelah dievaluasi tanpa perlu kata kunci `break`, dan beberapa kondisi dapat digabungkan cukup dengan tanda koma (`200, 201, 204 => ...`).
3. **Menghasilkan Nilai Ekspresi:** Hasil `match` dapat langsung di-`return` atau disimpan ke dalam variabel `$pesan = match (...) { ... };`.
4. **Exhaustiveness Check:** Jika tidak ada nilai yang cocok dan Anda tidak menyediakan cabang `default`, PHP tidak diam saja melainkan langsung melempar **`UnhandledMatchError`**!

## 3. Operator Null Coalescing (`??`, `??=`) dan Nullsafe (`?->`)

Untuk menangani nilai yang mungkin bernilai `null` tanpa perlu menulis blok `if ($obj !== null)` berulang-ulang:

```php
<?php

declare(strict_types=1);

// 1. Null Coalescing Operator (??): Mengambil sisi kanan jika sisi kiri tidak ada atau bernilai null
//    (Aman digunakan pada kunci array yang belum tentu ada tanpa memicu Warning!)
$halaman = (int) ($_GET['page'] ?? 1);

// 2. Null Coalescing Assignment (??=): Isi variabel HANYA JIKA saat ini bernilai null
$konfigurasi['batas_waktu'] ??= 30;

// 3. Nullsafe Operator (?->) (Sejak PHP 8.0):
//    Jika $pesanan, getPelanggan(), atau getAlamat() bernilai null,
//    seluruh rantai langsung berhenti dan menghasilkan null tanpa galat!
$kodePos = $pesanan?->getPelanggan()?->getAlamat()?->kodePos ?? '00000';
```

## 4. Operator Pipe (`|>`) untuk Merangkai Fungsi (Baru Sejak PHP 8.5)

Ketika kita perlu menerapkan beberapa fungsi transformasi secara berurutan pada sebuah data, di versi PHP lama kita terpaksa menulis pemanggilan fungsi bersarang yang harus dibaca dari dalam ke luar (*inside-out*), atau membuat banyak variabel sementara.

Sejak **PHP 8.5**, hadir **Pipe Operator (`|>`)** yang mengalirkan hasil dari sisi kiri sebagai argumen ke callable di sisi kanan secara berurutan dari kiri ke kanan:

```php
<?php

declare(strict_types=1);

$judulMentah = '   Belajar PHP 8.5 di Kodeloka!   ';

// Cara Lama (PHP <= 8.4): Harus dibaca dari paling dalam (trim -> str_replace -> strtolower)
$slugLama = strtolower(
    str_replace(' ', '-', trim($judulMentah, " !"))
);

// Cara Baru (Sejak PHP 8.5): Mengalir rapi dari atas ke bawah dengan operator |>
$slugBaru = $judulMentah
    |> (fn(string $teks): string => trim($teks, ' !'))
    |> (fn(string $teks): string => str_replace([' ', '.'], ['-', ''], $teks))
    |> strtolower(...);

var_dump($slugBaru); // string(26) "belajar-php-85-di-kodeloka"
```

## Latihan Praktik: Konverter Tarif Pengiriman dengan `match` dan Tipe Ketat

Buatlah berkas `tarif-kirim.php` dan jalankan dengan `php tarif-kirim.php`:
1. Buat fungsi `hitungOngkir(string $zona, int|float $beratKg): int` dengan `declare(strict_types=1);`.
2. Gunakan ekspresi `match ($zona)` untuk menentukan tarif per kilogram (`'jawa' => 10_000`, `'sumatera', 'bali' => 18_000`, `'kalimantan', 'sulawesi' => 25_000`, `'papua', 'maluku' => 40_000`). Jika zona tidak dikenal, biarkan `match` atau lempar `InvalidArgumentException`.
3. Kalikan tarif dengan `ceil($beratKg)` dan kembalikan hasilnya sebagai `(int)`.

## Kuis Pemahaman

### Soal 1
Apa perbedaan mendasar antara pernyataan `switch ($nilai)` dan ekspresi `match ($nilai)` (sejak PHP 8.0)?
- A. `switch` menggunakan perbandingan ketat (`===`), sedangkan `match` menggunakan perbandingan longgar (`==`).
- B. `match` menggunakan perbandingan identitas ketat (`===`), mengembalikan nilai sebagai ekspresi, tidak mengalami kebocoran antar-cabang (*fallthrough*) tanpa `break`, serta melempar `UnhandledMatchError` jika tidak ada cabang yang cocok.
- C. `match` hanya dapat digunakan untuk memeriksa nilai bertipe boolean.
- D. `switch` sudah dihapus dari PHP 8.4.

**Jawaban Benar:** B
**Penjelasan:** Ekspresi `match` memperbaiki seluruh kelemahan klasik `switch`: ia mengevaluasi kondisi dengan `===`, langsung mengembalikan hasil ekspresi lengan yang cocok, tidak butuh `break`, dan mencegah kondisi tak tertangani lewat `UnhandledMatchError`.

### Soal 2
Perhatikan deklarasi parameter fungsi berikut: `function proses(int|float|null $nilai): void`. Apa arti dari deklarasi tipe parameter tersebut?
- A. Parameter `$nilai` wajib berupa array yang berisi integer, float, dan null sekaligus.
- B. Parameter `$nilai` menggunakan *Union Type* yang mengizinkan argumen bertipe `int`, bertipe `float`, atau bernilai `null`.
- C. Parameter `$nilai` otomatis diubah menjadi string.
- D. Fungsi akan membagi `$nilai` dengan `null`.

**Jawaban Benar:** B
**Penjelasan:** Tanda pipa tunggal (`|`) pada deklarasi tipe (sejak PHP 8.0) menyatakan *Union Type*, yaitu parameter atau nilai kembalian dapat bernilai salah satu dari tipe-tipe yang disebutkan.

### Soal 3
Apa fungsi dari operator *pipe* (`|>`) yang diperkenalkan sejak **PHP 8.5**?
- A. Melakukan operasi bitwise OR pada dua bilangan bulat.
- B. Meneruskan nilai hasil evaluasi di sebelah kiri sebagai argumen ke fungsi/*callable* di sebelah kanan, sehingga rantai pemrosesan data dapat ditulis mengalir dari kiri ke kanan tanpa fungsi bersarang yang berlapis-lapis.
- C. Menggabungkan dua tabel basis data secara otomatis.
- D. Menggantikan operator penugasan `=`.

**Jawaban Benar:** B
**Penjelasan:** Operator `|>` di PHP 8.5 memungkinkan komposisi fungsi yang bersih dan mudah dibaca secara berurutan dari kiri ke kanan (atau atas ke bawah), misalnya `$teks |> trim(...) |> strtolower(...)`.

## Sumber
- [Types — PHP Manual](https://www.php.net/manual/en/language.types.php)
- [PHP 8.5 Release Announcement (Pipe Operator) — PHP.net](https://www.php.net/releases/8.5/en.php)
- [Language Reference — PHP Manual](https://www.php.net/manual/en/langref.php)
