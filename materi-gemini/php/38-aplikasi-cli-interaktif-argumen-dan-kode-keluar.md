# Membangun Aplikasi Baris Perintah (CLI) di PHP: `getopt()`, Stream `STDIN`/`STDOUT`/`STDERR`, dan Exit Codes

- **Tingkat:** Menengah
- **Ringkasan:** Merancang perkakas CLI administrasi dan skrip otomasi menggunakan konstanta `PHP_SAPI === 'cli'`, penguraian opsi argumen `getopt()`, pemisahan keluaran standar (`STDOUT`) dari pesan galat (`STDERR`), pewarnaan ANSI terminal, serta pengembalian kode status keluar POSIX (`0` untuk sukses, `1+` untuk gagal).

## Mengapa Skrip CLI yang Mencetak Galat ke `echo` dan Keluar dengan `exit(0)` Merusak Pipa CI/CD?

Saat Anda menjalankan perintah di terminal Linux, cronjob, atau pipa GitHub Actions / GitLab CI seperti:
`php bin/migrasi-db.php --env=prod && php bin/bersihkan-cache.php`

Operator `&&` di shell hanya memeriksa **satu hal** untuk memutuskan apakah langkah pertama berhasil dan langkah kedua boleh dijalankan: **Kode Status Keluar (*Exit Code*)** dari proses pertama!
- Kode keluar **`0`** berarti **Sukses**.
- Kode keluar **`1` hingga `255`** berarti **Gagal**.

Jika skrip `migrasi-db.php` gagal terhubung ke database, lalu Anda hanya mencetak `echo "Gagal migrasi!"; exit;` (di mana `exit` tanpa argumen sama dengan `exit(0)`!), maka pipa CI/CD akan menganggap migrasi berhasil 100% dan lanjut menjalankan langkah berikutnya di atas database yang rusak!

> **🚫 Kerentanan & Kesalahan Umum:** Mencetak pesan kesalahan ke `echo` (`STDOUT`) dan keluar dengan `exit(0)` saat skrip CLI gagal akan menipu pipa CI/CD atau cronjob sehingga menganggap pekerjaan berhasil dijalankan.

## 1. Tiga Aliran Standar POSIX (`STDIN`, `STDOUT`, `STDERR`) dan Sintaks `getopt()`

Setiap proses CLI di sistem operasi modern memiliki tiga aliran I/O standar yang sudah terbuka secara otomatis di PHP CLI:

| Konstanta Stream / Fungsi | File Descriptor POSIX | Kegunaan yang Benar di Skrip CLI |
| :--- | :--- | :--- |
| **`STDIN`** | `fd 0` (Masukan Standar) | Membaca data yang dialirkan melalui pipa (`cat data.csv \| php impor.php`) menggunakan `fgets(STDIN)` atau `stream_get_contents(STDIN)`. |
| **`STDOUT`** (atau `echo`) | `fd 1` (Keluaran Standar) | **Hanya untuk hasil data utama** (misalnya keluaran JSON, CSV, atau laporan hasil) agar tetap bersih saat diarahkan ke berkas dengan `> hasil.json`! |
| **`STDERR`** | `fd 2` (Galat Standar) | Untuk seluruh **pesan kesalahan, peringatan, dan log progres**, ditulis dengan `fwrite(STDERR, "...")` agar tidak mengotori pipa `STDOUT`. |
| **`getopt($pendek, $panjang)`** | Pengurai Argumen CLI | Mengurai opsi pendek (`-u nilai`) dan panjang (`--user=nilai`, `--dry-run`): tanpa titik dua = bendera boolean; `:` = wajib bernilai; `::` = nilai opsional. |

## 2. Penguraian Argumen `getopt()`, Pemisahan `STDOUT`/`STDERR`, dan Kode Keluar POSIX

Berikut adalah kerangka skrip CLI standar produksi yang menolak akses dari web server (`PHP_SAPI !== 'cli'`), mengurai opsi dengan `getopt()`, memisahkan `STDOUT` dari `STDERR`, dan mengembalikan kode keluar POSIX yang akurat:

```php
<?php
declare(strict_types=1);

// 1. Pastikan skrip hanya bisa dieksekusi dari CLI, bukan dari peramban web!
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('Skrip ini hanya boleh dijalankan melalui CLI.');
}

/**
 * Mengurai argumen baris perintah dan mengembalikan konfigurasi eksekusi.
 * Contoh: php sinkron.php -u rina --batas=50 --dry-run
 *
 * @param array<string, string|false|list<string>> $opsi
 * @return array{pengguna: string, batas: int, adalahSimulasi: bool}
 */
function uraiOpsiCli(array $opsi): array
{
    $pengguna = (string) ($opsi['u'] ?? $opsi['user'] ?? '');
    if ($pengguna === '') {
        throw new InvalidArgumentException('Opsi wajib -u atau --user=<nama> belum diisi.');
    }

    $batas = isset($opsi['batas']) ? (int) $opsi['batas'] : 100;
    if ($batas < 1 || $batas > 10000) {
        throw new InvalidArgumentException('Opsi --batas harus bernilai antara 1 hingga 10000.');
    }

    // Pada getopt(), bendera tanpa nilai (seperti --dry-run) bernilai boolean false saat hadir di array!
    $adalahSimulasi = array_key_exists('dry-run', $opsi);

    return [
        'pengguna'       => $pengguna,
        'batas'          => $batas,
        'adalahSimulasi' => $adalahSimulasi,
    ];
}

// Hanya jalankan blok utama jika berkas dieksekusi langsung dari CLI
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    try {
        $opsiMentah = getopt('u:', ['user:', 'batas::', 'dry-run']) ?: [];
        $konfig     = uraiOpsiCli($opsiMentah);

        fwrite(STDERR, "[INFO] Memulai sinkronisasi untuk {$konfig['pengguna']}..." . PHP_EOL);
        // Hasil data murni dicetak ke STDOUT agar aman di-pipe ke jq: php sinkron.php -u rina | jq .
        fwrite(STDOUT, json_encode(['status' => 'sukses', 'konfig' => $konfig], JSON_THROW_ON_ERROR) . PHP_EOL);
        exit(0);
    } catch (InvalidArgumentException $e) {
        fwrite(STDERR, "[GALAT ARGUMEN] {$e->getMessage()}" . PHP_EOL);
        exit(2); // Kode 2 lazim dipakai POSIX untuk kesalahan penggunaan argumen CLI
    } catch (Throwable $e) {
        fwrite(STDERR, "[GALAT KRITIS] {$e->getMessage()}" . PHP_EOL);
        exit(1); // Kode 1 untuk kegagalan runtime umum
    }
}
```

## 3. Memeriksa `stream_isatty(STDOUT)` Sebelum Mencetak Kode Warna ANSI

Saat mencetak teks berwarna ke terminal menggunakan kode escape ANSI (seperti `"\033[32mSukses\033[0m"`), apa yang terjadi jika pengguna mengarahkan keluaran skrip Anda ke berkas log (`php skrip.php > laporan.txt`) atau di dalam sistem CI tanpa warna? Berkas `laporan.txt` akan dipenuhi karakter sampah `^[[32m`!

Gunakan fungsi bawaan **`stream_isatty(STDOUT)`** (dan periksa variabel lingkungan standar [`NO_COLOR`](https://no-color.org/)) untuk memastikan kode warna ANSI hanya dicetak jika keluaran benar-benar terhubung ke layar terminal interaktif:

```php
<?php
declare(strict_types=1);

function formatHijauTerminal(string $teks, $stream = STDOUT): string
{
    $tanpaWarna = getenv('NO_COLOR') !== false && getenv('NO_COLOR') !== '';
    if (!$tanpaWarna && is_resource($stream) && stream_isatty($stream)) {
        return "\033[32m{$teks}\033[0m";
    }
    return $teks;
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Memeriksa keberadaan bendera `--dry-run` dari `getopt()` menggunakan `if (!empty($opsi['dry-run']))`:** Ini jebakan paling terkenal di PHP CLI! Karena alasan historis, untuk opsi tanpa nilai (seperti `--dry-run`), `getopt()` menyetel `$opsi['dry-run'] = false` ketika opsi tersebut **diberikan** oleh pengguna! Akibatnya, `!empty($opsi['dry-run'])` selalu bernilai `false`! **Selalu gunakan `array_key_exists('dry-run', $opsi)` atau `isset($opsi['dry-run'])`**.
2. **Mencampur log progres (`"Memproses baris 1..."`) dengan keluaran JSON di `STDOUT`:** Jika pengguna menjalankan `php ekspor.php > data.json`, pesan `"Memproses baris 1..."` yang dicetak ke `echo`/`STDOUT` akan ikut masuk ke dalam `data.json` dan merusak sintaks JSON-nya. Cetak log progres ke **`STDERR`** dan cetak hasil JSON murni ke **`STDOUT`**.
3. **Menaruh skrip CLI di dalam folder `public/` yang dapat diakses lewat HTTP:** Tempatkan skrip CLI di folder `bin/` di luar *document root* web server, dan selalu tambahkan penjaga `if (PHP_SAPI !== 'cli')` di bagian atas.

## Latihan Praktik Mandiri

1. Buat berkas `CliParser.php` yang memuat fungsi `uraiOpsiCli(array $opsi)` dan `formatHijauTerminal()`.
2. Tulis pengujian PHPUnit untuk memverifikasi bahwa:
   - `uraiOpsiCli(['user' => 'budi', 'dry-run' => false])` mengembalikan `'adalahSimulasi' => true`;
   - `uraiOpsiCli([])` tanpa `user` melempar `InvalidArgumentException`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Mencetak pesan kesalahan ke `echo` (`STDOUT`) dan keluar dengan `exit(0)` saat skrip CLI gagal akan menipu pipa CI/CD atau cronjob sehingga menganggap pekerjaan berhasil dijalankan.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena pipa CI/CD atau cronjob hanya membaca kode keluar proses, sehingga kegagalan dianggap berhasil, masalah tidak terdeteksi, dan langkah berikutnya tetap dijalankan di atas hasil yang rusak
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Mencetak pesan kesalahan ke `echo` (`STDOUT`) dan keluar dengan `exit(0)` saat skrip CLI gagal akan menipu pipa CI/CD atau cronjob sehingga menganggap pekerjaan berhasil dijalankan.

### Soal 2
Pada fungsi `getopt('u:', ['user:', 'dry-run'])`, ketika pengguna menjalankan skrip dengan bendera `--dry-run`, apakah nilai dari `$opsi['dry-run']` di dalam array yang dikembalikan oleh `getopt()`, dan bagaimana cara yang benar untuk memeriksa apakah bendera tersebut diaktifkan?
- A. Bernilai `true`; diperiksa dengan `if ($opsi['dry-run'] === true)`
- B. Bernilai boolean **`false`**; oleh karena itu keberadaannya wajib diperiksa menggunakan **`array_key_exists('dry-run', $opsi)`** atau **`isset($opsi['dry-run'])`** (bukan `if ($opsi['dry-run'])` atau `!empty()`)
- C. Bernilai angka `1`
- D. Bernilai `null`

**Jawaban Benar:** B
**Penjelasan:** Dalam dokumentasi resmi PHP `getopt()`, opsi yang tidak menerima nilai argumen tetap dimasukkan ke dalam array hasil tetapi diberi nilai boolean `false`. Menggunakan `isset($opsi['dry-run'])` atau `array_key_exists('dry-run', $opsi)` adalah cara yang benar untuk mendeteksinya.

### Soal 3
Mengapa pesan log progres dan pesan kesalahan pada perkakas CLI harus ditulis ke **`STDERR`** (`fwrite(STDERR, ...)`) sementara hasil data utama (seperti JSON atau CSV) ditulis ke **`STDOUT`**?
- A. Karena `STDOUT` hanya menerima angka bulat
- B. Agar ketika pengguna mengalirkan keluaran skrip ke perkakas lain atau berkas (seperti `php ekspor.php > hasil.json` atau `php ekspor.php | jq .`), berkas `hasil.json` hanya berisi data JSON murni dari `STDOUT` tanpa tercemar oleh teks log progres atau pesan kesalahan dari `STDERR`
- C. Karena `STDERR` otomatis mengirim email ke administrator
- D. Karena `STDOUT` tidak tampil di layar terminal

**Jawaban Benar:** B
**Penjelasan:** Operator pengalihan standar `>` dan pipa `|` di shell secara bawaan hanya menangkap aliran `STDOUT` (`fd 1`), sedangkan `STDERR` (`fd 2`) tetap tampil di layar atau dapat diarahkan ke berkas log terpisah (`2> error.log`).

## Sumber

- [`getopt` — PHP Manual](https://www.php.net/manual/en/function.getopt.php)
- [Using PHP from the command line — PHP Manual](https://www.php.net/manual/en/features.commandline.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
