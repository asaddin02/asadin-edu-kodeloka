# Komputasi Finansial & Angka Presisi Tinggi dengan Ekstensi `BCMath` (`BcMath\Number` PHP 8.4) dan `GMP`

- **Tingkat:** Menengah
- **Ringkasan:** Menghindari kesalahan pembulatan pecahan biner `float` pada perhitungan uang, pajak, dan bunga perbankan menggunakan ekstensi **`BCMath`**—termasuk objek **`BcMath\Number`** berorientasi objek dengan operator overloading di PHP 8.4+.

## Mengapa Tipe `float` Tidak Boleh Dipakai untuk Menghitung Saldo Uang dan Pajak?

Sama seperti di bahasa pemrograman lain yang menggunakan standar pecahan biner 64-bit IEEE 754, tipe `float` di PHP tidak dapat merepresentasikan pecahan desimal basis-10 seperti `0.1` atau `0.01` secara eksak. Jika Anda mengevaluasi `(0.1 + 0.2 === 0.3)` di PHP, hasilnya adalah **`false`** karena nilai internalnya adalah `0.30000000000000004441`!

Dalam sistem pembayaran, akuntansi, atau dompet digital, selisih seperseribu sen yang terakumulasi pada jutaan transaksi akan menyebabkan ketidakcocokan buku besar (*ledger mismatch*). Untuk menjaga presisi desimal 100% eksak, PHP menyediakan ekstensi **`BCMath` (*Binary Calculator*)** yang di **PHP 8.4 dan PHP 8.5** telah diperkaya dengan objek *immutable* **`BcMath\Number`** yang mendukung operator matematika langsung (`+`, `-`, `*`, `/`, `**`, `<=>`) serta enum **`RoundingMode`**!

> **🚫 Kerentanan & Kesalahan Umum:** Menghitung saldo dompet digital, bagi hasil, atau tagihan pajak menggunakan tipe `float` biasa (`0.1 + 0.2`) di PHP akan menghasilkan selisih pecahan biner IEEE 754 yang menyebabkan ketidakcocokan buku besar akuntansi (*ledger mismatch*).

## 1. Perbandingan Pendekatan Komputasi Angka Presisi di PHP Modern

Pilihlah pendekatan numerik yang sesuai dengan kebutuhan domain aplikasi Anda:

| Pendekatan / Ekstensi | Representasi Internal | Keunggulan Utama | Kasus Penggunaan Terbaik |
| :--- | :--- | :--- | :--- |
| **`int` (Satuan Terkecil: Rupiah / Sen)** | Bilangan bulat 64-bit (`PHP_INT_MAX` $\approx 9,22 \times 10^{18}$). | Sangat cepat di tingkat CPU; bebas pecahan untuk penjumlahan/pengurangan. | Menyimpan harga barang dan saldo Rupiah bulat di database (`BIGINT`). |
| **`BcMath\Number` (PHP 8.4+)** | Objek desimal presisi sembarang yang *immutable* (`readonly`). | Mendukung operator `+`, `-`, `*`, `/` langsung dari string angka desimal dan metode `->round(skala, RoundingMode)`. | Perhitungan PPN `11%`, bunga harian `0.0325%`, kurs mata uang asing, dan pembagian tagihan. |
| **Fungsi `bc*` (`bcadd`, `bcmul`, `bcdiv`)** | String angka desimal (`'150000.50'`). | Kompatibel di seluruh versi PHP (termasuk PHP 8.2/8.3). | Kode pustaka yang masih harus mendukung PHP versi sebelum 8.4. |
| **Ekstensi `GMP` (`GMP` class)** | Bilangan bulat (*integer*) ukuran tak terbatas berbasis pustaka GNU MP. | Operasi aritmetika bilangan bulat raksasa, faktorisasi, dan uji bilangan prima sangat cepat. | Perhitungan matematika kriptografi RSA/Diffie-Hellman dan kombinatorika besar. |

## 2. Menghitung Pajak dan Pembagian Tagihan dengan `BcMath\Number` (PHP 8.4+) dan `RoundingMode`

Sebelum PHP 8.4, menggunakan `BCMath` mengharuskan kita memanggil fungsi beruntun seperti `bcadd(bcmul($a, $b, 4), $c, 2)` yang sulit dibaca dan tidak memiliki fungsi pembulatan bawaan. Sejak **PHP 8.4**, kelas `BcMath\Number` menerima `string` atau `int` (tidak menerima `float` demi mencegah masuknya galat presisi sejak awal!) dan mendukung delapan mode pembulatan melalui enum **`RoundingMode`**:

```php
<?php
declare(strict_types=1);

use BcMath\Number;

// Di PHP 8.4+, objek BcMath\Number mendukung operator matematika langsung secara presisi
function hitungTagihanDenganPpn(string $subtotal, string $tarifPpn = '0.11'): string
{
    $angkaSubtotal = new Number($subtotal);
    $angkaPpn      = ($angkaSubtotal * new Number($tarifPpn))->round(2, RoundingMode::HalfAwayFromZero);
    return (string) ($angkaSubtotal + $angkaPpn);
}

echo hitungTagihanDenganPpn('150000.50', '0.11'); // "166500.56"
```

### Memilih `RoundingMode` yang Tepat untuk Keuangan:
- **`RoundingMode::HalfAwayFromZero`:** Pembulatan aritmetika standar yang biasa diajarkan di sekolah (`2.5` dibulatkan menjadi `3`, `-2.5` menjadi `-3`).
- **`RoundingMode::HalfEven` (*Banker's Rounding*):** Membulatkan nilai tengah tepat `.5` menuju **angka genap terdekat** (`2.5` menjadi `2`, `3.5` menjadi `4`). Mode ini menjadi standar di dunia perbankan dan akuntansi karena menghilangkan bias pembulatan ke atas saat menjumlahkan ribuan transaksi!
- **`RoundingMode::TowardsZero` / `Floor` / `Ceiling`:** Memotong desimal atau membulatkan ke bawah/atas secara mutlak.

## 3. Menyelesaikan Masalah Sisa Sen Saat Membagi Tagihan (*Penny Allocation*)

Bayangkan tagihan sebesar **Rp 100.000** harus dibagi rata ke dalam **3 cicilan**. Jika Anda hanya membagi `100000 / 3 = 33333`, maka `33333 * 3 = 99999`—ada **Rp 1 yang hilang**! Gunakan `divmod()` pada `BcMath\Number` untuk mendapatkan hasil bagi bulat sekaligus sisanya agar sisa Rp 1 ditambahkan ke cicilan pertama:

```php
<?php
declare(strict_types=1);

use BcMath\Number;

/**
 * Membagi total tagihan bulat ke N bagian tanpa kehilangan 1 Rupiah pun.
 *
 * @return list<string>
 */
function bagiTagihanRata(string $totalRupiahBulat, int $jumlahBagian): array
{
    if ($jumlahBagian < 1) {
        throw new InvalidArgumentException('Jumlah bagian minimal 1.');
    }
    $total = new Number($totalRupiahBulat);
    [$pokok, $sisa] = $total->divmod($jumlahBagian);

    $hasil = [];
    $sisaInt = (int) $sisa->value;
    for ($i = 0; $i < $jumlahBagian; $i++) {
        // Distribusikan sisa 1 Rupiah ke bagian-bagian awal
        $tambahan = $i < $sisaInt ? 1 : 0;
        $hasil[] = (string) ($pokok + $tambahan);
    }
    return $hasil;
}

// bagiTagihanRata('100000', 3) -> ['33334', '33333', '33333'] (Jumlah tepat 100000!)
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Mengubah angka ke `float` terlebih dahulu sebelum dimasukkan ke `BCMath`:** Menulis `new Number((string) (0.1 + 0.2))` sudah telanjur merusak presisi sebelum `BCMath` bekerja! Selalu teruskan nilai uang sebagai **string numerik (`'150000.50'`)** atau **`int`** sejak dari pembacaan JSON/database hingga ke konstruktor `new Number($str)`.
2. **Lupa mengatur parameter `$scale` saat menggunakan fungsi `bcdiv()` klasik:** Pada fungsi prosedural `bcdiv('10', '3')`, jika argumen ketiga (`$scale`) tidak diisi dan `bcscale()` belum diatur, nilai bawaannya adalah **`0`** sehingga bagian desimalnya langsung terpotong habis menjadi `'3'`!
3. **Menggunakan operator `==` biasa untuk membandingkan string angka di PHP 8.2/8.3 tanpa `bccomp()`:** Pada objek `BcMath\Number` di PHP 8.4+, operator `<=>`, `==`, `<`, dan `>` sudah di-*overload* secara matematis (`new Number('10.00') == new Number('10')` bernilai `true`). Namun jika Anda membandingkan string dengan `===`, `'10.00' === '10'` bernilai `false`; gunakan `bccomp($a, $b, $scale) === 0` atau objek `BcMath\Number`.

## Latihan Praktik Mandiri

1. Buat class `KalkulatorFaktur` yang menggunakan `BcMath\Number` dan `RoundingMode::HalfEven` untuk menghitung subtotal, diskon persentase, PPN 11%, dan pembagian cicilan dengan `divmod()`.
2. Tulis pengujian PHPUnit untuk memverifikasi bahwa pembagian `Rp 100.000` menjadi 3 cicilan bila dijumlahkan kembali tetap menghasilkan tepat `'100000'`.

## Kuis Pemahaman

### Soal 1
Mengapa tipe data `float` bawaan PHP tidak boleh digunakan secara langsung untuk menghitung saldo akuntansi, pajak, atau transaksi keuangan?
- A. Karena tipe `float` di PHP hanya mendukung maksimal 2 angka di belakang koma
- B. Karena `float` disimpan menggunakan representasi pecahan biner IEEE 754 yang tidak dapat merepresentasikan banyak pecahan desimal basis-10 (seperti `0.1` atau `0.01`) secara eksak, sehingga menimbulkan selisih pembulatan pada perhitungan keuangan
- C. Karena `float` tidak dapat disimpan ke dalam database relasional
- D. Karena operasi perkalian `float` membutuhkan ekstensi OpenSSL

**Jawaban Benar:** B
**Penjelasan:** Dalam biner IEEE 754, angka seperti `0.1` dan `0.2` adalah pecahan berulang tak hingga yang mengalami galat pembulatan kecil saat dijumlahkan. Komputasi finansial wajib menggunakan bilangan bulat satuan terkecil atau aritmetika desimal eksak seperti `BCMath`.

### Soal 2
Apa keunggulan utama kelas `BcMath\Number` yang diperkenalkan sejak PHP 8.4 dibandingkan fungsi `bcadd()` / `bcmul()` tradisional?
- A. Hanya dapat berjalan di peramban web
- B. Merupakan objek *immutable* (`readonly`) yang mendukung *operator overloading* matematika langsung (`+`, `-`, `*`, `/`, `<=>`) serta metode pembulatan eksplisit `->round($presisi, RoundingMode::...)` tanpa risiko lupa parameter skala
- C. Menerima tipe `float` yang tidak akurat dan menebak nilai aslinya
- D. Menggantikan fungsi `PDO` untuk koneksi database

**Jawaban Benar:** B
**Penjelasan:** `BcMath\Number` menghadirkan API berorientasi objek yang bersih dengan dukungan operator aritmetika dan perbandingan langsung, serta integrasi penuh dengan enum `RoundingMode` (seperti `HalfEven` dan `HalfAwayFromZero`).

### Soal 3
Mode pembulatan (`RoundingMode`) manakah yang lazim digunakan dalam standar akuntansi dan perbankan (*Banker's Rounding*) untuk meminimalkan bias kumulatif dengan cara membulatkan nilai tengah tepat `.5` menuju angka genap terdekat?
- A. `RoundingMode::HalfAwayFromZero`
- B. `RoundingMode::HalfEven`
- C. `RoundingMode::Ceiling`
- D. `RoundingMode::TowardsZero`

**Jawaban Benar:** B
**Penjelasan:** `RoundingMode::HalfEven` membulatkan nilai `.5` tepat di tengah ke bilangan genap terdekat (misalnya `2.5` menjadi `2`, dan `3.5` menjadi `4`), sehingga dalam ribuan transaksi rata-rata pembulatan ke atas dan ke bawah saling menyeimbangkan.

## Sumber

- [BC Math — PHP Manual](https://www.php.net/manual/en/book.bc.php)
- [The BcMath\Number class — PHP Manual](https://www.php.net/manual/en/class.bcmath-number.php)
- [GMP — PHP Manual](https://www.php.net/manual/en/book.gmp.php)
- [Floating point numbers — PHP Manual](https://www.php.net/manual/en/language.types.float.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
