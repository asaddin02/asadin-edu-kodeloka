# Sistem Berkas, PHP Streams, dan Pemrosesan Data Besar Hemat Memori dengan Generator (`yield`)

- **Tingkat:** Lanjut
- **Ringkasan:** Membaca dan menulis berkas secara aman dengan penguncian `LOCK_EX` (berbasis `flock()`), memanfaatkan aliran *PHP Streams* (`php://temp`, `php://output`), serta memproses jutaan baris data CSV atau kueri database hanya dengan beberapa megabyte RAM menggunakan **Generator (`yield`)**.

## 1. Operasi Sistem Berkas yang Aman (`file_get_contents`, `file_put_contents`, dan `flock`)

Untuk berkas konfigurasi atau templat berukuran kecil (di bawah beberapa ratus kilobyte), fungsi `file_get_contents()` dan `file_put_contents()` sangat praktis. Namun, ketika menulis ke berkas dari aplikasi web yang melayani banyak permintaan secara bersamaan, gunakan bendera **`LOCK_EX`** (*Exclusive Lock*) agar dua worker PHP-FPM tidak menulis ke berkas yang sama pada mikrodetik yang bersamaan hingga merusak isinya:

```php
<?php

declare(strict_types=1);

function catatBarisLog(string $jalurBerkas, string $pesan): void
{
    $baris = sprintf("[%s] %s\n", gmdate('Y-m-d\TH:i:s\Z'), $pesan);

    // FILE_APPEND menambahkan ke baris paling bawah,
    // LOCK_EX mengunci berkas secara eksklusif selama proses penulisan berlangsung!
    $berhasil = file_put_contents($jalurBerkas, $baris, FILE_APPEND | LOCK_EX);

    if ($berhasil === false) {
        throw new RuntimeException("Gagal menulis ke berkas log: {$jalurBerkas}");
    }
}
```

> **🚫 Keamanan Jalur Berkas: Cegah *Path Traversal* dengan `basename()` atau `realpath()`!**
> Jika pengguna mengirimkan parameter nama berkas yang ingin diunduh (misalnya `?berkas=laporan-q1.pdf`), **jangan pernah langsung menyambungnya ke `file_get_contents('/var/data/' . $_GET['berkas'])`**! Penyerang dapat mengirim `?berkas=../../../etc/passwd`!
> Selalu pangkas informasi direktori dengan **`basename($input)`**, atau pastikan hasil **`realpath($jalurLengkap)`** benar-benar diawali (`str_starts_with`) dengan jalur direktori penyimpanan yang diizinkan!

## 2. Masalah Memori Saat Membaca Berkas Besar dan Solusi **Generator (`yield`)**

Bayangkan Anda diminta membuat fitur untuk mengimpor atau mengekspor berkas laporan transaksi **`transaksi.csv` berukuran `500 MB` (berisi 2 juta baris)**, sementara batas memori tiap worker PHP (`memory_limit`) di server produksi adalah **`128 MB`**.

- **Cara Buruk (`file('transaksi.csv')` atau `$stmt->fetchAll()`):**
  PHP mencoba memuat seluruh 2 juta baris sekaligus ke dalam satu `array` raksasa di RAM. Dalam hitungan detik, memori menembus `128 MB` dan skrip langsung mati dengan **`Fatal error: Allowed memory size of 134217728 bytes exhausted`**!
- **Cara Profesional (Membaca Baris demi Baris dengan Generator `yield`):**
  Sebuah fungsi yang mengandung kata kunci **`yield`** otomatis menjadi **Generator** (mengembalikan objek `Generator` yang mengimplementasikan `Iterator`). Ia hanya menahan **SATU baris di memori pada satu waktu**, menyerahkannya ke perulangan `foreach`, lalu membebaskan memori baris tersebut saat melangkah ke baris berikutnya!

```php
<?php

declare(strict_types=1);

/**
 * Membaca berkas CSV berukuran berapa pun (bahkan 10 GB!)
 * dengan pemakaian RAM tetap di bawah 1 MB menggunakan Generator (yield).
 *
 * @return Generator<int, array<string, string>>
 */
function bacaCsvHematMemori(string $jalurCsv): Generator
{
    $handle = fopen($jalurCsv, 'rb');
    if ($handle === false) {
        throw new RuntimeException("Tidak dapat membuka berkas CSV: {$jalurCsv}");
    }

    try {
        // 1. Baca baris pertama sebagai nama kolom header
        $header = fgetcsv($handle, escape: '');
        if (!is_array($header)) {
            return;
        }

        $nomorBaris = 1;
        // 2. Baca baris demi baris secara streaming
        while (($baris = fgetcsv($handle, escape: '')) !== false) {
            $nomorBaris++;
            if (count($baris) !== count($header)) {
                continue; // Lewati baris kosong/cacat
            }

            // Serahkan satu baris asosiatif ke pemanggil, lalu jeda fungsi ini!
            yield $nomorBaris => array_combine($header, $baris);
        }
    } finally {
        // Blok finally DIJAMIN menutup berkas meskipun pemanggil melakukan 'break' di tengah foreach!
        fclose($handle);
    }
}

// Cara memakainya sangat bersih seperti array biasa, namun 100% hemat RAM!
foreach (bacaCsvHematMemori('/tmp/data-besar.csv') as $barisKe => $data) {
    // Proses $data['id'], $data['nominal']...
    if ($barisKe >= 100) {
        break; // Saat break dipanggil, blok 'finally' di dalam generator otomatis menutup berkas!
    }
}
```

> **💡 Catatan Penting PHP 8.4 pada `fgetcsv()` dan `fputcsv()`:**
> Sejak **PHP 8.4**, memanggil `fgetcsv()` atau `fputcsv()` tanpa menentukan parameter `$escape` secara eksplisit telah dideprekasi (karena perilaku escape `\` lama tidak standar RFC 4180). Selalu berikan argumen bernama **`escape: ''`** (string kosong) agar penguraian CSV mematuhi standar RFC 4180 sepenuhnya!

## 3. Memanfaatkan *PHP Streams* (`php://temp` & `php://output`) untuk Ekspor CSV Tanpa Berkas Sampah

Ketika pengguna mengeklik tombol *"Unduh Laporan CSV"*, Anda tidak perlu membuat berkas fisik sementara di folder `/tmp/` lalu pusing menghapusnya! Gunakan stream bawaan **`php://output`** (atau **`php://temp`** yang otomatis memakai RAM hingga 2 MB lalu beralih ke berkas sementara tersembunyi jika lebih besar):

```php
<?php

declare(strict_types=1);

function kirimUnduhanCsv(string $namaBerkas, iterable $barisData): void
{
    header('Content-Type: text/csv; charset=utf-8');
    header(sprintf('Content-Disposition: attachment; filename="%s"', basename($namaBerkas)));

    $keluaran = fopen('php://output', 'wb');
    if ($keluaran === false) {
        return;
    }

    // Tulis header kolom
    fputcsv($keluaran, ['ID Modul', 'Judul', 'Durasi (Menit)'], escape: '');

    foreach ($barisData as $baris) {
        fputcsv($keluaran, [$baris['id'], $baris['judul'], $baris['durasi']], escape: '');
    }

    fclose($keluaran);
}
```

## Latihan Praktik: Pipeline Pengolah Log Server dengan Generator `yield`

Buatlah berkas `analisis-log-generator.php`:
1. Buat fungsi `hasilkanSampelLog(int $jumlahBaris): Generator` yang menggunakan `yield` untuk menghasilkan 50.000 baris log simulasi tanpa membuat array di memori.
2. Buat fungsi generator penyaring `saringLogGalat(iterable $sumberLog): Generator` yang menerima iterable dari langkah 1 dan hanya melakukan `yield` untuk baris yang mengandung kata `'ERROR'`.
3. Hitung total baris `'ERROR'` dan cetak puncak pemakaian RAM menggunakan `memory_get_peak_usage(true)` untuk membuktikan betapa kecilnya RAM yang terpakai!

## Kuis Pemahaman

### Soal 1
Mengapa memproses 1 juta baris hasil kueri atau berkas CSV menggunakan fungsi Generator (`yield`) jauh lebih aman bagi server produksi dibandingkan mengembalikannya sebagai `array` biasa?
- A. Karena Generator otomatis menghapus berkas setelah dibaca.
- B. Karena `array` mengharuskan seluruh 1 juta baris dialokasikan sekaligus di dalam RAM (yang dapat melampaui `memory_limit` dan mematikan proses worker), sedangkan Generator hanya menahan satu item di memori pada satu giliran iterasi `foreach`.
- C. Karena Generator berjalan di dalam kartu grafis (GPU).
- D. Karena `array` hanya bisa menampung maksimal 1.000 elemen di PHP.

**Jawaban Benar:** B
**Penjelasan:** Generator menghasilkan nilai satu per satu sesuai permintaan (*lazy iteration*). Pemakaian memorinya bersifat konstan **O(1)** terlepas dari apakah data yang diiterasi berjumlah 100 baris atau 100 juta baris.

### Soal 2
Di dalam sebuah fungsi Generator yang membuka berkas dengan `$handle = fopen(...)`, mengapa pemanggilan `fclose($handle)` wajib diletakkan di dalam blok **`try ... finally`** yang membungkus perulangan `yield`?
- A. Karena `fclose()` tidak boleh dipanggil di luar `finally`.
- B. Agar apabila kode pemanggil menghentikan perulangan `foreach` lebih awal menggunakan perintah `break` atau `return`, blok `finally` di dalam generator tetap dipanggil secara otomatis oleh PHP untuk menutup pegangan berkas (*file descriptor*) dengan bersih.
- C. Agar isi berkas otomatis terenkripsi saat ditutup.
- D. Karena `yield` menghapus variabel `$handle`.

**Jawaban Benar:** B
**Penjelasan:** Jika pemanggil keluar dari `foreach` dengan `break` sebelum generator mencapai baris paling bawah, kode yang ditulis biasa setelah perulangan `while` tidak akan pernah tercapai. Namun, saat objek Generator dihancurkan di akhir `foreach`, PHP menjamin eksekusi blok `finally` di tempat generator tadi terjeda.

### Soal 3
Bagaimana cara mencegah serangan *Path Traversal* (seperti pengguna mengirim `$nama = "../../config/app.php"`) ketika skrip PHP perlu membaca berkas dari dalam direktori `/var/app/storage/dokumen/`?
- A. Mengganti `file_get_contents()` dengan `include()`.
- B. Mengekstrak hanya komponen nama berkas akhirnya saja dengan `basename($nama)` serta memverifikasi bahwa jalur absolut hasil `realpath($jalurLengkap)` tidak bernilai `false` dan benar-benar diawali (`str_starts_with`) dengan jalur `/var/app/storage/dokumen/`.
- C. Menambahkan `htmlspecialchars()` pada nama berkas.
- D. Mengubah ekstensi berkas menjadi `.txt`.

**Jawaban Benar:** B
**Penjelasan:** `basename("../../config/app.php")` memangkas seluruh navigasi direktori `../` dan hanya menyisakan `"app.php"`. Memadukannya dengan pemeriksaan awalan `realpath()` terhadap direktori dasar penyimpanan menjamin skrip tidak pernah bisa membaca berkas di luar folder yang diizinkan.

## Sumber
- [Generators overview — PHP Manual](https://www.php.net/manual/en/language.generators.overview.php)
- [`fgetcsv` — PHP Manual](https://www.php.net/manual/en/function.fgetcsv.php)
- [`flock` — PHP Manual](https://www.php.net/manual/en/function.flock.php)
- [Filesystem Security — PHP Manual](https://www.php.net/manual/en/security.filesystem.php)
