# Fungsi, Named Arguments, Closure, Arrow Function (`fn`), dan `#[\NoDiscard]`

- **Tingkat:** Menengah
- **Ringkasan:** Menulis fungsi yang ekspresif dan aman dengan deklarasi tipe ketat, *named arguments* (PHP 8.0), *variadic parameters*, perbedaan *anonymous function* (`use`) dan *arrow function* (`fn`), sintaks *first-class callable* (`...`), serta atribut `#[\NoDiscard]` (PHP 8.5).

## 1. Deklarasi Fungsi Modern, Parameter Bawaan, dan Variadic (`...`)

Di PHP modern dengan `declare(strict_types=1);`, biasakan untuk **selalu mendeklarasikan tipe pada setiap parameter dan tipe nilai kembaliannya (*return type*)**:

```php
<?php

declare(strict_types=1);

function buatUrlhalaman(
    string $jalur,
    int $halaman = 1,
    bool $urutTerbaru = true,
): string {
    $arah = $urutTerbaru ? 'desc' : 'asc';
    return sprintf('%s?page=%d&sort=%s', $jalur, $halaman, $arah);
}
```

> **💡 Aturan Koma Terakhir (*Trailing Comma*):**
> Sejak PHP 8.0, Anda diizinkan menuliskan koma di akhir daftar parameter fungsi maupun daftar argumen pemanggilan multi-baris. Kebiasaan ini membuat riwayat perubahan Git (*git diff*) jauh lebih bersih saat Anda menambahkan parameter baru di kemudian hari!

### Argumen Bernama (*Named Arguments* — Sejak PHP 8.0)
Pernahkah Anda memanggil fungsi yang memiliki banyak parameter opsional seperti `setcookie()` atau `htmlspecialchars()`, lalu terpaksa menuliskan sederet nilai bawaan di tengahnya hanya demi mengubah parameter terakhir?

Dengan **Named Arguments**, Anda dapat menyebutkan nama parameternya secara langsung, melewati parameter opsional di tengah yang tidak perlu diubah, dan membuat kode pemanggil mendokumentasikan dirinya sendiri:

```php
<?php

declare(strict_types=1);

// Tanpa perlu menghafal urutan parameter ke-2, kita langsung menyebut 'urutTerbaru:'
$url = buatUrlhalaman(
    jalur: '/kelas/php',
    urutTerbaru: false,
);
// Menghasilkan: "/kelas/php?page=1&sort=asc"
```

### Parameter Variadic (`...$items`)
Sama seperti *rest parameters* di JavaScript, tanda titik tiga (`...`) mengumpulkan argumen dalam jumlah tak terbatas menjadi sebuah array bertipe ketat:

```php
<?php

declare(strict_types=1);

function jumlahkanBulat(int ...$angka): int
{
    return array_sum($angka);
}

echo jumlahkanBulat(10, 20, 30, 40); // 100
```

## 2. Anonymous Function (`function () use (...)`) vs Arrow Function (`fn() => ...`)

Di PHP, fungsi anonim (*closure*) adalah instans dari kelas bawaan **`Closure`**. Namun, ada satu aturan cakupan (*scope*) di PHP yang **sangat berbeda dari JavaScript**:

Di PHP, fungsi di dalam fungsi **TIDAK otomatis mewarisi variabel dari cakupan luarnya** kecuali Anda memilih salah satu dari dua sintaks berikut:

### A. Anonymous Function Multi-Baris (`function () use ($variabel)`)
Jika Anda menggunakan kata kunci `function`, Anda wajib menyebutkan variabel luar mana saja yang ingin dibawa masuk menggunakan klausa **`use (...)`**:

```php
<?php

declare(strict_types=1);

$batasMinimum = 75;
$daftarNilai = [60, 80, 95, 70, 88];

// Wajib mencantumkan 'use ($batasMinimum)' agar variabel luar dikenal di dalam fungsi!
$nilaiLulus = array_filter(
    $daftarNilai,
    static function (int $nilai) use ($batasMinimum): bool {
        return $nilai >= $batasMinimum;
    },
);
```

### B. Arrow Function Satu Ekspresi (`fn() => ...` — Sejak PHP 7.4)
Untuk fungsi singkat yang hanya berisi **satu ekspresi pengembalian**, gunakan **Arrow Function (`fn(...) => ...`)**.
Keunggulan utamanya: **`fn()` secara otomatis menangkap variabel dari cakupan luar berdasarkan nilai (*by-value*) tanpa perlu menulis `use (...)`!**

```php
<?php

declare(strict_types=1);

$batasMinimum = 75;
$daftarNilai = [60, 80, 95, 70, 88];

// Jauh lebih ringkas: $batasMinimum otomatis tertangkap (by-value) tanpa 'use'!
$nilaiLulus = array_values(array_filter(
    $daftarNilai,
    static fn(int $nilai): bool => $nilai >= $batasMinimum,
));
```

> **💡 Mengapa Menambahkan `static` di Depan `fn()` atau `function ()`?**
> Ketika sebuah closure dibuat di dalam metode sebuah class, PHP secara bawaan mengikat objek `$this` ke dalam closure tersebut. Jika closure tersebut tidak membutuhkan akses ke `$this`, menambahkan kata kunci **`static fn(...)`** mencegah pengikatan `$this` yang tidak perlu sehingga lebih hemat memori dan lebih jelas maksudnya.

## 3. Sintaks *First-Class Callable* (`namaFungsi(...)` — Sejak PHP 8.1)

Dulu, ketika ingin meneruskan fungsi bawaan seperti `trim` atau metode objek sebagai callback ke `array_map()`, kita terpaksa menulisnya sebagai teks string `'trim'` atau array `[$objek, 'metode']` yang sulit diperiksa oleh IDE dan alat analisis statis.

Sejak **PHP 8.1**, gunakan sintaks tiga titik di dalam kurung **`namaFungsi(...)`** untuk membuat objek `Closure` dari fungsi atau metode apa pun dengan aman:

```php
<?php

declare(strict_types=1);

$inputKotor = ['  html ', ' css  ', '  javascript '];

// Membuat Closure dari fungsi bawaan trim dengan sintaks First-Class Callable:
$inputBersih = array_map(trim(...), $inputKotor);
// Menghasilkan: ['html', 'css', 'javascript']
```

*(Catatan: Sejak **PHP 8.5**, static closures dan first-class callables bahkan sudah dapat digunakan di dalam ekspresi konstanta seperti parameter atribut dan nilai bawaan properti!)*

## 4. Mencegah Nilai Kembalian Terabaikan dengan `#[\NoDiscard]` (Baru di PHP 8.5)

Banyak fungsi di PHP tidak mengubah argumen aslinya, melainkan **mengembalikan nilai baru** (misalnya `DateTimeImmutable::modify()` atau fungsi perhitungan keamanan). Jika seorang pemrogram memanggil fungsi tersebut tetapi lupa menyimpan nilai kembaliannya ke dalam variabel, baris kode tersebut menjadi sia-sia.

Sejak **PHP 8.5**, Anda dapat menandai fungsi penting tersebut dengan atribut **`#[\NoDiscard]`**. Jika pemanggil mengabaikan nilai kembaliannya, PHP 8.5 akan langsung mengeluarkan peringatan (*Warning*)!

```php
<?php

declare(strict_types=1);

#[\NoDiscard("Hasil perhitungan tanda tangan HMAC wajib disimpan atau diverifikasi.")]
function buatSignatureHmac(string $pesan, string $kunciRahasia): string
{
    return hash_hmac('sha256', $pesan, $kunciRahasia);
}

// BENAR: Nilai kembalian disimpan dan digunakan
$sig = buatSignatureHmac('order_101', 'kunci-rahasia');

// Memanggil buatSignatureHmac('order_101', 'kunci-rahasia'); begitu saja tanpa disimpan
// akan memicu Warning di PHP 8.5! (Kecuali sengaja diabaikan dengan cast '(void) buatSignatureHmac(...)')
```

## Latihan Praktik: Pipeline Pemformatan Data dengan Arrow Function dan First-Class Callable

Buatlah berkas `fungsi-pipeline.php`:
1. Buat fungsi `#[\NoDiscard] function bersihkanDaftarTag(string ...$tagMentah): array`.
2. Di dalamnya, gunakan `array_map(mb_strtolower(...), $tagMentah)` dan `array_map(trim(...), ...)` untuk merapikan setiap tag, lalu saring tag yang panjangnya minimal 2 karakter menggunakan `array_filter()` dengan *arrow function* `static fn(string $t): bool => mb_strlen($t) >= 2`.
3. Kembalikan daftar tag unik yang sudah diindeks ulang dengan `array_values(array_unique(...))`.

## Kuis Pemahaman

### Soal 1
Apa perbedaan utama antara fungsi anonim biasa (`function ($x) { ... }`) dan *arrow function* (`fn($x) => ...`) di PHP dalam hal mengakses variabel dari lingkup luar?
- A. Arrow function dapat berisi puluhan baris pernyataan `if` dan `foreach`, sedangkan fungsi anonim biasa hanya satu baris.
- B. Fungsi anonim biasa tidak dapat mengakses variabel dari lingkup luar kecuali disebutkan secara eksplisit melalui klausa `use ($variabel)`, sedangkan *arrow function* (`fn() => ...`) secara otomatis menangkap variabel dari lingkup luar berdasarkan nilai (*by-value*).
- C. Arrow function otomatis mengubah nilai variabel di lingkup luar secara permanen (*by-reference*).
- D. Fungsi anonim biasa tidak dapat mengembalikan nilai.

**Jawaban Benar:** B
**Penjelasan:** Di PHP, lingkup fungsi terisolasi secara ketat. Pada `function ()`, Anda wajib menulis `use ($var)` untuk mengimpor variabel luar. Sebaliknya, `fn() => ...` secara otomatis mengimpor variabel luar *by-value* untuk ekspresi tunggalnya.

### Soal 2
Apa arti dari penulisan `strlen(...)` (dengan tiga titik di dalam tanda kurung) yang diperkenalkan sejak PHP 8.1?
- A. Memanggil fungsi `strlen` dengan argumen kosong.
- B. Sintaks *First-Class Callable* yang menghasilkan objek `Closure` yang merujuk langsung ke fungsi `strlen`, sehingga aman diteruskan sebagai callback (misalnya ke `array_map(strlen(...), $daftar)`).
- C. Menghapus fungsi `strlen` dari memori.
- D. Mengirimkan seluruh isi array ke dalam `strlen`.

**Jawaban Benar:** B
**Penjelasan:** Sintaks `callable(...)` adalah *First-Class Callable Syntax* di PHP 8.1+ yang membuat objek `Closure` dari fungsi, metode objek (`$this->proses(...)`), atau metode statis (`Kelas::metode(...)`) dengan dukungan penuh analisis statis dan IDE.

### Soal 3
Apa fungsi dari atribut `#[\NoDiscard]` yang ditambahkan pada sebuah deklarasi fungsi sejak **PHP 8.5**?
- A. Mencegah fungsi tersebut dihapus oleh *Garbage Collector*.
- B. Memerintahkan mesin PHP untuk mengeluarkan peringatan (*Warning*) apabila fungsi tersebut dipanggil tanpa menggunakan atau menyimpan nilai kembaliannya (*return value*).
- C. Menyimpan hasil fungsi ke dalam *cache* secara permanen.
- D. Melarang fungsi tersebut melempar `Exception`.

**Jawaban Benar:** B
**Penjelasan:** Atribut `#[\NoDiscard]` di PHP 8.5 meningkatkan keamanan API dengan memberi peringatan jika pengembang lupa menangkap nilai kembalian dari fungsi yang hasilnya penting (seperti objek *immutable* atau status verifikasi).

## Sumber
- [Functions (User-defined functions, Anonymous functions, Arrow Functions, First-class callable syntax) — PHP Manual](https://www.php.net/manual/en/language.functions.php)
- [PHP 8.5 Release Announcement (`#[\NoDiscard]`) — PHP.net](https://www.php.net/releases/8.5/en.php)
