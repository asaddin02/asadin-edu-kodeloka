# Tanggal, Waktu (`DateTimeImmutable`), Zona Waktu UTC, dan Internasionalisasi (`intl`)

- **Tingkat:** Menengah
- **Ringkasan:** Mengelola waktu dengan aman menggunakan `DateTimeImmutable` (dan metode mikrodetik PHP 8.4), memisahkan penyimpanan waktu `UTC` di basis data dari tampilan zona waktu lokal (`Asia/Jakarta`), menghitung rentang waktu dengan `DateInterval`, serta memformat angka dan tanggal menggunakan ekstensi `intl`.

## 1. Mengapa Wajib Menggunakan `DateTimeImmutable` dan Bukan `DateTime`?

Di PHP, terdapat dua kelas tanggal utama yang mengimplementasikan `DateTimeInterface`:
1. **`DateTime` (Mutable / Berbahaya):** Ketika Anda memanggil `$tanggal->modify('+7 days')`, **objek `$tanggal` aslinya ikut berubah di tempat**! Jika objek `$tanggalMulai` tersebut sudah dikirimkan ke fungsi lain, seluruh bagian program yang memegang referensi ke `$tanggalMulai` tiba-tiba melihat tanggal yang sudah bergeser 7 hari tanpa sadar!
2. **`DateTimeImmutable` (Immutable / Standar Terbaik):** Setiap pemanggilan metode pengubah seperti `$tanggal->modify('+7 days')` atau `$tanggal->setTimezone(...)` **selalu mengembalikan instans objek baru** dan membiarkan objek aslinya utuh 100%!

```php
<?php

declare(strict_types=1);

$mulaiLangganan = new DateTimeImmutable('2026-10-16 08:00:00', new DateTimeZone('UTC'));

// modify() pada DateTimeImmutable menghasilkan objek baru tanpa mengubah $mulaiLangganan!
$akhirLangganan = $mulaiLangganan->modify('+30 days');

echo $mulaiLangganan->format('Y-m-d'); // Tetap "2026-10-16"
echo $akhirLangganan->format('Y-m-d'); // "2026-11-15"
```

> **💡 Fitur Baru di PHP 8.4 pada `DateTimeImmutable`:**
> Sejak **PHP 8.4**, tersedia metode statis langsung **`DateTimeImmutable::createFromTimestamp(int|float $timestamp)`** (yang mendukung angka bulat detik maupun float dengan pecahan mikrodetik!), serta metode **`getMicrosecond()`** dan **`setMicrosecond(int $microsecond)`**!

## 2. Arsitektur Zona Waktu: Simpan dalam `UTC`, Tampilkan Sesuai Zona Pengguna!

Pengguna situs Anda di Indonesia tersebar di tiga zona waktu (**WIB / `Asia/Jakarta` UTC+7**, **WITA / `Asia/Makassar` UTC+8**, dan **WIT / `Asia/Jayapura` UTC+9**), belum lagi pengguna di luar negeri.

Jika Anda menyimpan jam lokal mentah tanpa zona waktu di basis data, urutan kejadian antara pengguna di Jakarta dan Makassar akan menjadi kacau!
Aturan emas di sistem produksi:
1. **Di Server dan Basis Data:** Selalu simpan waktu dalam zona waktu universal **`UTC`** (atau gunakan tipe kolom `TIMESTAMPTZ` di PostgreSQL).
2. **Di Lapisan Tampilan (View / API):** Konversikan objek `DateTimeImmutable` dari `UTC` ke zona waktu pengguna menggunakan `->setTimezone(new DateTimeZone($zonaPengguna))` tepat saat hendak ditampilkan!

```php
<?php

declare(strict_types=1);

// 1. Waktu kejadian disimpan sebagai UTC di database
$waktuKejadianUtc = new DateTimeImmutable('2026-10-16 07:30:00', new DateTimeZone('UTC'));

// 2. Konversi ke WIB (Asia/Jakarta), WITA (Asia/Makassar), dan WIT (Asia/Jayapura) saat ditampilkan:
$wib  = $waktuKejadianUtc->setTimezone(new DateTimeZone('Asia/Jakarta'));
$wita = $waktuKejadianUtc->setTimezone(new DateTimeZone('Asia/Makassar'));
$wit  = $waktuKejadianUtc->setTimezone(new DateTimeZone('Asia/Jayapura'));

echo $wib->format('Y-m-d H:i T') . "\n";  // "2026-10-16 14:30 WIB"
echo $wita->format('Y-m-d H:i T') . "\n"; // "2026-10-16 15:30 WITA"
echo $wit->format('Y-m-d H:i T') . "\n";  // "2026-10-16 16:30 WIT"
```

### Menghitung Selisih Waktu dengan `diff()` dan `DateInterval`
```php
<?php

declare(strict_types=1);

$tenggat = new DateTimeImmutable('2026-12-31 23:59:59', new DateTimeZone('Asia/Jakarta'));
$sekarang = new DateTimeImmutable('2026-10-16 14:30:00', new DateTimeZone('Asia/Jakarta'));

$selisih = $sekarang->diff($tenggat);
// %a mencetak total jumlah hari penuh di antara kedua tanggal
echo $selisih->format('Tersisa %a hari (%m bulan, %d hari, %h jam)');
```

## 3. Memformat Mata Uang dan Tanggal Bahasa Indonesia dengan Ekstensi `intl`

Fungsi `DateTimeImmutable::format('l, d F Y')` selalu mencetak nama hari dan bulan dalam bahasa Inggris (`"Friday, 16 October 2026"`).
Untuk mencetak tanggal Bahasa Indonesia yang baku (`"Jumat, 16 Oktober 2026"`) dan mata uang Rupiah yang presisi, gunakan kelas **`IntlDateFormatter`** dan **`NumberFormatter`** dari ekstensi standar **`intl`**:

```php
<?php

declare(strict_types=1);

// 1. Memformat Mata Uang Rupiah dengan NumberFormatter (ext-intl)
$pemformatUang = new NumberFormatter('id_ID', NumberFormatter::CURRENCY);
$pemformatUang->setAttribute(NumberFormatter::FRACTION_DIGITS, 0);
echo $pemformatUang->formatCurrency(1_450_000, 'IDR') . "\n"; // "Rp1.450.000"

// 2. Memformat Tanggal Lengkap Bahasa Indonesia dengan IntlDateFormatter
$pemformatTanggal = new IntlDateFormatter(
    locale: 'id_ID',
    dateType: IntlDateFormatter::FULL,
    timeType: IntlDateFormatter::SHORT,
    timezone: 'Asia/Jakarta',
);

$waktu = new DateTimeImmutable('2026-10-16 07:30:00', new DateTimeZone('UTC'));
echo $pemformatTanggal->format($waktu) . "\n";
// Keluaran: "Jumat, 16 Oktober 2026 14.30"
```

> **⚠️ Hasil bisa berbeda:** Bentuk keluaran `IntlDateFormatter` (misalnya ada tidaknya kata "pukul" antara tanggal dan jam, dan spasi pada `Rp1.450.000`) bergantung pada versi ICU/CLDR yang terpasang di server; jalankan kodenya di lingkungan Anda untuk melihat hasil persisnya.

## Latihan Praktik: Konverter Jadwal Webinar Lintas Zona Waktu Nusantara

Buatlah berkas `jadwal-webinar.php`:
1. Buat fungsi `buatJadwalWebinar(string $waktuMulaiWib, int $durasiMenit): array` yang menerima string waktu WIB (mis. `'2026-11-10 19:00:00'`), membuat `DateTimeImmutable` dengan zona `'Asia/Jakarta'`, dan menghitung waktu selesainya dengan `->modify("+{$durasiMenit} minutes")`.
2. Kembalikan jadwal lengkap dalam format UTC (untuk disimpan ke database) serta tampilan waktu dalam WIB, WITA, dan WIT!

## Kuis Pemahaman

### Soal 1
Mengapa penggunaan `DateTimeImmutable` sangat diutamakan dibandingkan kelas `DateTime` biasa saat meneruskan objek tanggal sebagai parameter ke berbagai fungsi atau layanan?
- A. Karena `DateTime` tidak mendukung zona waktu `UTC`.
- B. Karena pada `DateTime` biasa, pemanggilan metode seperti `$tgl->modify('+1 day')` atau `$tgl->setTimezone(...)` mengubah nilai objek aslinya secara langsung di memori (*mutable side-effect*), sedangkan `DateTimeImmutable` selalu mengembalikan instans objek baru sehingga objek tanggal aslinya dijamin tidak pernah berubah secara tak sengaja.
- C. Karena `DateTime` sudah dihapus dari PHP 8.2.
- D. Karena `DateTimeImmutable` tidak memerlukan ekstensi tanggal.

**Jawaban Benar:** B
**Penjelasan:** Mutasi tak sengaja pada objek `DateTime` yang dibagikan antar-objek adalah salah satu sumber bug perhitungan tanggal yang paling sulit dilacak. `DateTimeImmutable` menjamin setiap operasi modifikasi menghasilkan salinan baru yang independen.

### Soal 2
Dalam aplikasi web yang melayani pengguna dari berbagai zona waktu (WIB, WITA, WIT, maupun internasional), bagaimana praktik terbaik menyimpan waktu transaksi di dalam basis data?
- A. Menyimpan waktu sebagai teks Bahasa Indonesia seperti `"Jumat, 16 Oktober 2026"`.
- B. Menyimpan seluruh waktu transaksi secara konsisten dalam zona waktu **`UTC`** (atau `TIMESTAMPTZ`), lalu mengonversinya ke zona waktu lokal masing-masing pengguna hanya pada saat ditampilkan di antarmuka.
- C. Menyimpan tiga kolom terpisah untuk WIB, WITA, dan WIT di setiap tabel.
- D. Mengabaikan zona waktu sama sekali.

**Jawaban Benar:** B
**Penjelasan:** Menyimpan waktu dalam `UTC` memberikan garis waktu tunggal yang bebas ambiguitas untuk pengurutan data, pencatatan log, dan perhitungan selisih waktu lintas wilayah.

### Soal 3
Pada metode `$selisih = $tanggalAwal->diff($tanggalAkhir)`, kode format manakah pada `$selisih->format(...)` yang menghasilkan **total keseluruhan jumlah hari** di antara kedua tanggal tersebut (misalnya `45` hari), bukan sekadar sisa hari setelah dikurangi bulan (`15` hari)?
- A. `%d`
- B. `%a`
- C. `%m`
- D. `%Y`

**Jawaban Benar:** B
**Penjelasan:** Pada `DateInterval::format()`, `%d` hanya menampilkan komponen sisa hari (`0–31`) setelah tahun dan bulan dihitung. Untuk mendapatkan jumlah total hari penuh di antara dua tanggal, gunakan penanda **`%a`** (`$selisih->days`).

## Sumber
- [`DateTimeImmutable` — PHP Manual](https://www.php.net/manual/en/class.datetimeimmutable.php)
- [Internationalization Functions (`intl`) — PHP Manual](https://www.php.net/manual/en/book.intl.php)
- [`DateTimeImmutable::createFromTimestamp` — PHP Manual](https://www.php.net/manual/en/datetimeimmutable.createfromtimestamp.php)
- [`DateTimeInterface::getMicrosecond` — PHP Manual](https://www.php.net/manual/en/datetimeinterface.getmicrosecond.php)
- [PHP 8.4 Release Announcement — PHP.net](https://www.php.net/releases/8.4/en.php)
