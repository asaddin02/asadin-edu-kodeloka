# Pengelolaan Arsip & Kompresi: `ZipArchive`, Pencegahan Kerentanan *Zip Slip*, dan Kompresi `gzencode`

- **Tingkat:** Menengah
- **Ringkasan:** Membuat dan mengekstrak berkas `.zip` secara aman menggunakan **`ZipArchive`**, menangkal serangan **Zip Slip (Path Traversal)** dan **Zip Bomb** saat mengekstrak arsip unggahan pengguna, serta mengompresi payload data dengan `gzencode()`.

## Mengapa Mengekstrak Berkas `.zip` dari Pengguna Merupakan Salah Satu Operasi Paling Berisiko di Backend?

Fitur unggah arsip `.zip` (misalnya untuk mengunggah pengumpulan tugas kode sumber, tema situs, atau kumpulan dokumen) menyimpan dua ancaman keamanan klasik yang sangat berbahaya:
1. **Serangan *Zip Slip* (Arbitrary File Overwrite via Path Traversal):** Format arsip ZIP mengizinkan nama berkas di dalam tabel katalognya berisi karakter lintas direktori seperti `../../../../var/www/html/public/backdoor.php`. Jika aplikasi mengekstrak entri tersebut tanpa memeriksa namanya terlebih dahulu, berkas dapat tertulis keluar dari folder tujuan dan menimpa kode sumber server Anda!
2. **Serangan *Zip Bomb* (Decompression Bomb / Disk & RAM Exhaustion):** Sebuah berkas `.zip` berukuran **42 KB** (`42.zip`) yang berisi byte nol berulang dapat mengembang menjadi **4,5 Petabyte (4.500.000 GB)** saat diekstrak, langsung menghabiskan seluruh ruang disk dan melumpuhkan server!

> **🚫 Kerentanan & Kesalahan Umum:** Memanggil `$zip->extractTo($folderTujuan)` secara mentah-mentah pada berkas `.zip` dari pengguna sangat berbahaya karena nama entri di dalam zip dapat berisi `../../../../var/www/html/shell.php` (*Zip Slip*) yang menimpa kode sumber server Anda!

> Perlu dicek: sejauh mana `ZipArchive::extractTo()` pada versi PHP saat ini sudah menormalkan nama entri yang berisi `..` tidak dijelaskan di manual; validasi manual seperti pada contoh di bawah tetap wajib dilakukan sebagai pertahanan berlapis.

## 1. Peta Kelas dan Fungsi Arsip & Kompresi di PHP

Berikut adalah perbandingan API pengelolaan arsip dan kompresi bawaan PHP:

| Kelas / Fungsi | Kegunaan Utama | Catatan Keamanan & Kinerja |
| :--- | :--- | :--- |
| **`ZipArchive`** | Membuka, menginspeksi metadata (`statIndex`), membuat (`CREATE \| OVERWRITE`), dan mengekstrak arsip `.zip`. | Selalu periksa `$zip->numFiles` dan `$zip->statIndex($i)` **sebelum** mengekstrak satu byte pun! |
| **`gzencode($data, $level)` & `gzdecode($gz)`** | Mengompresi dan mengekstrak string ke/dari format **GZIP (RFC 1952)** di memori. | Sangat cocok untuk mengecilkan payload JSON besar sebelum disimpan ke Redis/database atau dikirim lewat HTTP. |
| **`gzopen()` / Stream `compress.zlib://`** | Membaca dan menulis berkas `.gz` berukuran besar secara streaming per baris/potongan tanpa memuat semuanya ke RAM. | Pada `gzdecode($data, max_length: $batas)`, selalu isi parameter kedua **`$max_length`** untuk mencegah *Gzip Bomb* di RAM! |
| **`Phar` / `PharData`** | Mengemas seluruh aplikasi CLI PHP ke dalam satu berkas `.phar` atau mengelola arsip `.tar` / `.tar.gz`. | Pastikan `phar.readonly = 1` di `php.ini` server web produksi agar penyerang tidak dapat membuat berkas Phar baru. |

## 2. Menginspeksi dan Mengekstrak Arsip `.zip` Secara Aman (Anti-*Zip Slip* & Anti-*Zip Bomb*)

Sebelum mengekstrak arsip `.zip` yang berasal dari pengguna, lakukan pemeriksaan ketat pada setiap indeks entri menggunakan **`$zip->statIndex($i)`** (yang hanya membaca header katalog tengah ZIP tanpa mengekstrak isinya!):
1. Batasi jumlah maksimum berkas di dalam ZIP (misalnya maksimal `500` berkas).
2. Tolak setiap entri yang namanya mengandung `..`, diawali `/` atau `\`, mengandung karakter byte NUL `\0`, atau berakhiran ekstensi skrip eksekusi berbahaya (`.php`, `.phtml`, `.phar`, `.sh`).
3. Jumlahkan ukuran asli (`$stat['size']`) dari seluruh entri dan pastikan totalnya tidak melampaui kuota ekstraksi aman (misalnya `50 MB`):

```php
<?php
declare(strict_types=1);

function validasiKeamananZip(string $jalurZip, int $maksTotalByte = 50_000_000, int $maksJumlahBerkas = 500): void
{
    $zip = new ZipArchive();
    if ($zip->open($jalurZip, ZipArchive::RDONLY) !== true) {
        throw new RuntimeException('Gagal membuka arsip ZIP.');
    }

    if ($zip->numFiles > $maksJumlahBerkas) {
        $zip->close();
        throw new RuntimeException('Jumlah berkas di dalam arsip melebihi batas maksimum.');
    }

    $totalUkuran = 0;
    for ($i = 0; $i < $zip->numFiles; $i++) {
        $stat = $zip->statIndex($i);
        if ($stat === false) {
            $zip->close();
            throw new RuntimeException('Gagal membaca metadata entri ZIP.');
        }
        $nama = $stat['name'];

        // 1. Tolak path traversal (Zip Slip) dan jalur absolut
        if (str_contains($nama, '..') || str_starts_with($nama, '/') || str_starts_with($nama, '\\') || str_contains($nama, "\0")) {
            $zip->close();
            throw new RuntimeException('Terdeteksi percobaan Zip Slip pada entri: ' . $nama);
        }

        // 2. Akumulasi ukuran hasil ekstraksi untuk mencegah Zip Bomb
        $ukuranEntri = (int) $stat['size'];
        if ($ukuranEntri < 0 || ($totalUkuran + $ukuranEntri) > $maksTotalByte) {
            $zip->close();
            throw new RuntimeException('Ukuran hasil ekstraksi melebihi batas aman (Zip Bomb).');
        }
        $totalUkuran += $ukuranEntri;
    }
    $zip->close();
}
```

## 3. Membuat Arsip `.zip` dan Mengompresi Data dengan `gzencode` / `gzdecode` Berbatas Aman

Saat membuat berkas `.zip` untuk diunduh pengguna, gunakan kombinasi bendera bitwise OR **`ZipArchive::CREATE | ZipArchive::OVERWRITE`**. Sementara saat mendekompresi data GZIP dari luar menggunakan `gzdecode()`, selalu berikan argumen kedua **`max_length`** agar memori RAM terlindungi:

```php
<?php
declare(strict_types=1);

function buatArsipLaporanZip(string $jalurZip Keluaran, array $petaBerkas): void
{
    $zip = new ZipArchive();
    if ($zip->open($jalurZipKeluaran, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
        throw new RuntimeException('Tidak dapat membuat berkas ZIP.');
    }

    foreach ($petaBerkas as $namaDiDalamZip => $isiTeks) {
        // Pastikan nama di dalam zip hanya nama relatif bersih
        $namaBersih = ltrim(str_replace(['..', '\\'], ['', '/'], (string) $namaDiDalamZip), '/');
        $zip->addFromString($namaBersih, (string) $isiTeks);
    }
    $zip->close();
}

function dekompresiGzipAman(string $payloadGzip, int $maksByteHasil = 5_000_000): string
{
    // Argumen kedua ($max_length) menghentikan dekompresi jika hasil melebihi 5 MB!
    $hasil = @gzdecode($payloadGzip, $maksByteHasil);
    if ($hasil === false) {
        throw new RuntimeException('Payload GZIP rusak atau melebihi batas ukuran dekompresi.');
    }
    return $hasil;
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Memeriksa hasil `$zip->open($file)` dengan `if ($zip->open($file))` (tanpa `=== true`):** Metode `ZipArchive::open()` mengembalikan `true` jika berhasil, tetapi jika gagal, ia mengembalikan **kode galat berupa bilangan bulat positif** (seperti `ZipArchive::ER_NOZIP = 19`)! Dalam PHP non-strict, angka `19` dianggap *truthy* oleh `if ($zip->open($file))` sehingga kode Anda menyangka pembukaan ZIP berhasil padahal gagal! **Selalu tulis `if ($zip->open($file) === true)`**.
2. **Mengekstrak berkas `.zip` dulu baru memeriksa ukurannya di disk:** Jika itu adalah *Zip Bomb* 100 GB, disk server Anda sudah penuh dan proses hang sebelum baris pemeriksaan berikutnya sempat dijalankan! Periksa `$stat['size']` lewat `statIndex()` **sebelum** mengekstrak.
3. **Memanggil `gzdecode($input)` tanpa batas `$max_length`:** Sama seperti ZIP, aliran GZIP juga dapat menjadi bom dekompresi di RAM apabila parameter kedua `$max_length` tidak dibatasi.

## Latihan Praktik Mandiri

1. Buat class `PengelolaZipAman` yang menggabungkan `validasiKeamananZip()` dan metode `ekstrakAman(string $jalurZip, string $folderTujuan)` yang menyalin entri aman menggunakan `stream_copy_to_stream($zip->getStreamIndex($i), $fpTujuan, $batasSisaByte)`.
2. Tulis pengujian PHPUnit yang membuat berkas `.zip` di memori berisi satu entri berbahaya `../../rahasia.txt`, lalu pastikan `validasiKeamananZip()` melempar `RuntimeException`.

## Kuis Pemahaman

### Soal 1
Mengapa pemeriksaan kondisi `if ($zip->open($jalurBerkas))` tanpa perbandingan ketat `=== true` merupakan bug berbahaya pada penggunaan `ZipArchive` di PHP?
- A. Karena `$zip->open()` selalu mengembalikan string `"ok"`
- B. Karena saat `ZipArchive::open()` gagal membuka berkas (misalnya berkas rusak atau bukan ZIP), metode tersebut mengembalikan konstanta kode galat berupa bilangan bulat positif bukan nol (seperti `ZipArchive::ER_NOZIP`), yang dievaluasi sebagai `true` (*truthy*) jika tidak dibandingkan secara ketat dengan `=== true`
- C. Karena `$zip->open()` membutuhkan koneksi database
- D. Karena `ZipArchive` tidak mendukung blok `if`

**Jawaban Benar:** B
**Penjelasan:** `ZipArchive::open()` mengembalikan boolean `true` saat sukses, atau bilangan bulat kode galat (`ZipArchive::ER_* > 0`) saat gagal. Karena angka bulat positif bernilai *truthy*, wajib gunakan `if ($zip->open(...) === true)`.

### Soal 2
Bagaimana cara mendeteksi serangan **Zip Slip (*Path Traversal*)** dan **Zip Bomb** secara aman **sebelum** satu berkas pun diekstrak ke disk?
- A. Mengekstrak seluruh isi ZIP ke folder `/tmp` terlebih dahulu lalu menjalankan perintah `rm -rf`
- B. Menelusuri seluruh entri menggunakan `$zip->statIndex($i)` untuk menolak entri yang namanya mengandung `..` atau diawali `/` / `\`, serta menjumlahkan `$stat['size']` guna memastikan total ukuran hasil ekstraksi dan jumlah berkas tidak melebihi batas aman
- C. Mengubah ekstensi berkas `.zip` menjadi `.txt`
- D. Hanya memeriksa ukuran berkas `.zip` sebelum dibuka

**Jawaban Benar:** B
**Penjelasan:** `ZipArchive::statIndex($i)` membaca metadata nama dan ukuran asli dari direktori pusat ZIP tanpa mendekompresi isinya, sehingga serangan *Zip Slip* dan *Zip Bomb* dapat digagalkan sebelum menyentuh sistem berkas.

### Soal 3
Apa kegunaan dari parameter kedua (`$max_length`) pada fungsi `gzdecode(string $data, int $max_length = 0)` saat menerima data terkompresi GZIP dari pihak luar?
- A. Mengatur tingkat kecepatan kompresi CPU dari 1 sampai 9
- B. Membatasi ukuran maksimum byte hasil dekompresi di memori RAM; jika hasil dekompresi melampaui `$max_length`, `gzdecode()` segera menghentikan proses dan mengembalikan `false` sehingga server terlindungi dari *Gzip Bomb* (kehabisan memori OOM)
- C. Memotong nama berkas menjadi maksimal `$max_length` karakter
- D. Menentukan jumlah thread dekompresi

**Jawaban Benar:** B
**Penjelasan:** Menetapkan `$max_length` (misalnya `5_000_000` untuk 5 MB) memastikan `gzdecode()` tidak pernah mengalokasikan memori melebihi batas tersebut apabila diberi payload *decompression bomb*.

## Sumber

- [The ZipArchive class — PHP Manual](https://www.php.net/manual/en/class.ziparchive.php)
- [Zlib Compression — PHP Manual](https://www.php.net/manual/en/book.zlib.php)
- [`gzencode` — PHP Manual](https://www.php.net/manual/en/function.gzencode.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
