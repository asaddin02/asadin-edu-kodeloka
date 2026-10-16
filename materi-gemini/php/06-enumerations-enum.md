# Enumerations (`enum` — Sejak PHP 8.1): Pure Enum, Backed Enum, Metode, dan Interface

- **Tingkat:** Menengah
- **Ringkasan:** Menggantikan konstanta nilai ajaib (*magic strings/numbers*) dengan tipe `enum` yang aman di tingkat kompilasi, menguasai Pure Enum dan Backed Enum (`string`/`int`), konversi `from()` vs `tryFrom()`, serta menambahkan metode dan `interface` pada Enum.

## Mengapa Konstanta Biasa Tidak Cukup untuk Merepresentasikan Status?

Dalam aplikasi nyata, kita selalu berurusan dengan nilai-nilai yang pilihannya terbatas dan sudah pasti: status pesanan (`menunggu`, `dibayar`, `dikirim`, `batal`), peran pengguna (`admin`, `instruktur`, `peserta`), atau metode pembayaran.

Sebelum **PHP 8.1**, pengembang biasanya menggunakan konstanta kelas bertipe `string`:
```php
// Cara Lama (Sebelum PHP 8.1):
class StatusPesananLama {
    public const MENUNGGU = 'menunggu';
    public const DIBAYAR  = 'dibayar';
}
// Kelemahan: Parameter fungsi hanya bisa ditulis 'string $status',
// sehingga pemanggil tetap bisa mengirim 'ngawur' tanpa ditolak oleh tipe parameter!
```

Sejak **PHP 8.1**, **Enumerations (`enum`)** menyelesaikan masalah ini dengan menciptakan **tipe data tersendiri** yang anggotanya dibatasi secara ketat pada daftar `case` yang Anda tentukan!

## 1. Pure Enum (Enum Murni)

**Pure Enum** adalah Enum yang setiap anggotanya (`case`) berdiri sendiri sebagai instans objek singleton tanpa dikaitkan dengan nilai skalar string atau integer:

```php
<?php

declare(strict_types=1);

enum TingkatKesulitan
{
    case Dasar;
    case Menengah;
    case Lanjut;
}

function tampilkanLencana(TingkatKesulitan $tingkat): string
{
    // Karena TingkatKesulitan hanya punya 3 case, ekspresi match ini
    // sudah mencakup semua kemungkinan tanpa butuh cabang default!
    return match ($tingkat) {
        TingkatKesulitan::Dasar    => '🟢 Dasar (Pemula)',
        TingkatKesulitan::Menengah => '🟡 Menengah',
        TingkatKesulitan::Lanjut   => '🔴 Lanjut (Produksi)',
    };
}

$pilihan = TingkatKesulitan::Dasar;
echo $pilihan->name; // Setiap Enum memiliki properti readonly ->name ("Dasar")
echo tampilkanLencana($pilihan);
```

Perhatikan bahwa setiap kasus Enum (`TingkatKesulitan::Dasar`) adalah objek singleton di memori, sehingga Anda dapat membandingkannya secara langsung dengan operator identitas ketat **`===`** (`$pilihan === TingkatKesulitan::Dasar`)!

## 2. Backed Enum (`: string` atau `: int`) untuk Database dan JSON

Ketika sebuah nilai Enum perlu disimpan ke dalam kolom tabel basis data PostgreSQL/MySQL, dikirim lewat formulir HTML `<select>`, atau diserialisasi ke dalam payload JSON API, gunakan **Backed Enum** dengan mendeklarasikan tipe skalar **`: string`** atau **`: int`** (hanya boleh salah satu, tidak boleh union `int|string`!):

```php
<?php

declare(strict_types=1);

enum PeranPengguna: string
{
    case Admin      = 'admin';
    case Instruktur = 'instruktur';
    case Peserta    = 'peserta';
}

// 1. Membaca nilai skalar untuk disimpan ke database melalui properti readonly ->value:
$peran = PeranPengguna::Instruktur;
echo $peran->name;  // "Instruktur"
echo $peran->value; // "instruktur"

// 2. Mengambil seluruh daftar kasus yang tersedia dengan metode statis ::cases():
foreach (PeranPengguna::cases() as $kasus) {
    echo "{$kasus->name} => {$kasus->value}\n";
}
```

### Mengubah Nilai Database/Form Kembali Menjadi Enum: `from()` vs `tryFrom()`
Setiap *Backed Enum* secara otomatis dilengkapi dua metode pabrik statis bawaan:
1. **`PeranPengguna::from(string|int $nilai)`:** Mengembalikan kasus Enum yang cocok, atau **melempar `ValueError`** jika nilai tidak ditemukan. Gunakan untuk data dari sumber internal yang dijamin valid.
2. **`PeranPengguna::tryFrom(string|int $nilai)`:** Mengembalikan kasus Enum yang cocok, atau **mengembalikan `null`** jika nilai tidak ditemukan! **Selalu gunakan `tryFrom()` saat memproses input dari pengguna (`$_POST`, `$_GET`, JSON request)**!

```php
<?php

declare(strict_types=1);

$inputDariForm = $_POST['peran'] ?? '';

// Aman! Jika pengguna mengirim 'superhacker', tryFrom() mengembalikan null
// sehingga otomatis jatuh ke nilai bawaan PeranPengguna::Peserta.
$peranSah = PeranPengguna::tryFrom((string) $inputDariForm) ?? PeranPengguna::Peserta;
```

## 3. Menambahkan Metode, Konstanta, `interface`, dan `JsonSerializable` pada Enum

Di PHP, `enum` memiliki banyak kemampuan layaknya `class` (meskipun tidak boleh memiliki properti/state dinamis dan tidak boleh diwariskan dengan `extends`):
- Enum **boleh memiliki metode publik/privat** dan metode `static`.
- Enum **boleh memiliki konstanta (`public const`)** dan memakai `trait` (selama trait tidak berisi properti).
- Enum **boleh mengimplementasikan `interface`** (termasuk interface bawaan `JsonSerializable`). Catatan: Backed Enum sudah otomatis di-`json_encode()` menjadi nilai skalarnya tanpa interface ini, sedangkan Pure Enum akan menimbulkan galat; `JsonSerializable` hanya dipakai untuk mengubah perilaku bawaan tersebut (contoh di bawah menampilkannya secara eksplisit).

```php
<?php

declare(strict_types=1);

interface MemilikiHakAkses
{
    public function bolehMenulisMateri(): bool;
}

enum StatusPublikasi: string implements MemilikiHakAkses, JsonSerializable
{
    case Draf      = 'draf';
    case Tinjauan  = 'tinjauan';
    case Terbit    = 'terbit';
    case Diarsipkan = 'arsip';

    public const STATUS_BAWAAN = self::Draf;

    public function bolehMenulisMateri(): bool
    {
        return match ($this) {
            self::Draf, self::Tinjauan => true,
            self::Terbit, self::Diarsipkan => false,
        };
    }

    public function warnaLencana(): string
    {
        return match ($this) {
            self::Draf       => 'abu-abu',
            self::Tinjauan   => 'kuning',
            self::Terbit     => 'hijau',
            self::Diarsipkan => 'merah',
        };
    }

    public function jsonSerialize(): string
    {
        return $this->value;
    }
}

echo json_encode(['status' => StatusPublikasi::Terbit]);
// Keluaran: {"status":"terbit"}
```

## Latihan Praktik: Merancang Enum Metode Pembayaran Lengkap dengan Perhitungan Biaya

Buatlah berkas `enum-pembayaran.php` dan jalankan dengan `php enum-pembayaran.php`:
1. Buat `enum MetodePembayaran: string` dengan kasus `Qris = 'qris'`, `VirtualAccount = 'va'`, dan `KartuKredit = 'kartu'`.
2. Tambahkan metode `hitungBiayaLayanan(int $nominalBelanja): int` pada Enum tersebut menggunakan ekspresi `match ($this)` (`Qris` = `0.7%` dari nominal, `VirtualAccount` = tetap `Rp4.000`, `KartuKredit` = `2.5%` + `Rp2.000`).
3. Uji konversi input pengguna menggunakan `MetodePembayaran::tryFrom()`.

## Kuis Pemahaman

### Soal 1
Mengapa deklarasi `enum KodeRespon: float` atau `enum KodeRespon: int|string` akan ditolak oleh PHP dengan galat kompilasi?
- A. Karena nama Enum tidak boleh mengandung dua kata.
- B. Karena *Backed Enum* di PHP hanya mengizinkan satu tipe skalar tunggal berupa `int` atau `string` saja (tidak mengizinkan `float`, `bool`, maupun *union* `int|string`).
- C. Karena Enum hanya boleh dideklarasikan di dalam sebuah `class`.
- D. Karena `float` sudah dihapus dari PHP 8.

**Jawaban Benar:** B
**Penjelasan:** Spesifikasi Backed Enum di PHP secara ketat membatasi tipe pendamping skalar hanya pada `int` atau `string`, dan tidak mengizinkan penggabungan keduanya.

### Soal 2
Mengapa sebuah `enum` di PHP **dilarang** mendeklarasikan properti biasa (seperti `public int $hitung = 0;`) di dalamnya?
- A. Karena setiap kasus Enum (`Enum::Kasus`) adalah objek *singleton* di memori yang dipakai bersama di seluruh aplikasi; jika Enum diizinkan menyimpan properti yang bisa berubah (*mutable state*), mengubah properti pada satu variabel akan mengubah nilai kasus Enum tersebut di seluruh bagian program lainnya.
- B. Karena kata kunci `public` tidak dikenal di dalam `enum`.
- C. Karena `enum` tidak disimpan di dalam RAM.
- D. Karena `enum` hanya boleh memiliki maksimal 2 fungsi.

**Jawaban Benar:** A
**Penjelasan:** Kasus Enum dirancang sebagai konstanta bertipe (*typed constants*) yang *stateless* dan *immutable*. Mengizinkan properti pada instans singleton Enum akan merusak jaminan keutuhan nilai konstanta tersebut.

### Soal 3
Metode statis bawaan apakah pada sebuah Enum yang mengembalikan array berisi seluruh daftar kasus (`case`) yang didefinisikan di dalam Enum tersebut (misalnya untuk mengisi pilihan `<select>` di HTML)?
- A. `NamaEnum::values()`
- B. `NamaEnum::cases()`
- C. `NamaEnum::all()`
- D. `NamaEnum::toArray()`

**Jawaban Benar:** B
**Penjelasan:** Seluruh Enum di PHP (baik Pure Enum maupun Backed Enum) mengimplementasikan interface internal `UnitEnum` yang menyediakan metode statis `::cases()`, yang mengembalikan array terindeks berisi setiap instans `case` sesuai urutan deklarasinya.

## Sumber
- [Enumerations — PHP Manual](https://www.php.net/manual/en/language.types.enumerations.php)
- [Basic enumerations — PHP Manual](https://www.php.net/manual/en/language.enumerations.basics.php)
- [Backed enumerations — PHP Manual](https://www.php.net/manual/en/language.enumerations.backed.php)
- [Enumeration serialization — PHP Manual](https://www.php.net/manual/en/language.enumerations.serialization.php)
