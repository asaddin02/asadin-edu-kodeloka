# Keamanan Backend Lanjutan: Pencegahan SSRF, OS Command Injection (`escapeshellarg`), dan Path Traversal

- **Tingkat:** Lanjut
- **Ringkasan:** Menangkal tiga kerentanan kritis di sisi server: **Server-Side Request Forgery (SSRF)** saat mengambil URL dari pengguna, **OS Command Injection** pada pemanggilan `proc_open`/`exec`, serta **Path Traversal (`../`)** menggunakan `realpath()` dan perbandingan direktori dasar.

## Bagaimana Tiga Kerentanan Ini Memungkinkan Penyerang Mengambil Alih Server Anda?

Di luar SQL Injection dan XSS, tiga kerentanan paling berbahaya pada aplikasi backend yang berinteraksi dengan jaringan luar dan sistem operasi adalah:
1. **Server-Side Request Forgery (SSRF):** Aplikasi menerima URL dari pengguna (misalnya fitur *"Impor foto profil dari URL"* atau *"Uji pengiriman Webhook"*), lalu penyerang memasukkan `http://127.0.0.1:6379/` atau alamat layanan metadata cloud internal `http://169.254.169.254/latest/meta-data/iam/security-credentials/` untuk mencuri kunci rahasia server cloud Anda!
2. **OS Command Injection:** Aplikasi memanggil perintah sistem seperti `exec("convert " . $namaBerkas . " out.webp")`, lalu penyerang mengirim nama berkas `"foto.png; rm -rf /; #"` sehingga shell `/bin/sh` mengeksekusi perintah jahat tersebut!
3. **Path Traversal (`../`):** Aplikasi membaca berkas `file_get_contents("/var/unduhan/" . $_GET['file'])`, lalu penyerang mengirim `file=../../../../etc/passwd` untuk mengunduh berkas sistem rahasia!

> **🚫 Kerentanan & Kesalahan Umum:** Memanggil fungsi cURL atau `file_get_contents($urlDariPengguna)` tanpa memblokir rentang IP privat/loopback (`127.0.0.1`, `10.0.0.0/8`, `169.254.169.254` metadata cloud AWS/GCP) memungkinkan penyerang memindai jaringan internal server Anda melalui celah **SSRF**.

## 1. Perbandingan Tiga Kerentanan Sistem dan Pertahanan Standarnya di PHP

Terapkan pertahanan berlapis berikut setiap kali kode PHP menyentuh jaringan eksternal, perintah OS, atau jalur berkas:

| Jenis Kerentanan | Fungsi yang Sering Disalahgunakan | Pertahanan Utama yang Wajib Diterapkan |
| :--- | :--- | :--- |
| **SSRF** (*Server-Side Request Forgery*) | `curl_exec()`, `file_get_contents($url)`, `getimagesize($url)`. | Batasi skema hanya `http`/`https`, resolusi DNS lalu tolak IP privat/cadangan (`FILTER_FLAG_NO_PRIV_RANGE \| FILTER_FLAG_NO_RES_RANGE`), matikan `CURLOPT_FOLLOWLOCATION`, dan kunci IP dengan `CURLOPT_RESOLVE`. |
| **OS Command Injection** | `exec()`, `shell_exec()`, `system()`, `passthru()`, operator backtick `` `...` ``. | Gunakan **`proc_open(['bin', $arg1, $arg2], ...)`** dengan **array argumen** (melewati shell sepenuhnya!), atau bungkus setiap argumen tunggal dengan **`escapeshellarg()`**. |
| **Path Traversal** (`../`) | `file_get_contents()`, `readfile()`, `unlink()`, `include`. | Ambil `basename($input)`, kanonisasi dengan **`realpath()`**, dan pastikan diawali **`str_starts_with($jalurNyata, $folderDasar . DIRECTORY_SEPARATOR)`**. |

## 2. Mencegah SSRF (Termasuk Mitigasi *DNS Rebinding*) dan *Path Traversal*

Perhatikan bagaimana fungsi `apakahUrlEksternalAman()` memeriksa seluruh alamat IPv4 dan IPv6 dari host tujuan terhadap rentang IP privat/loopback, serta bagaimana `ambilJalurBerkasDalamFolderAman()` menggunakan `realpath()` untuk memblokir pelarian direktori `../`:

```php
<?php
declare(strict_types=1);

function apakahUrlEksternalAman(string $url): bool
{
    $bagian = parse_url($url);
    $skema  = strtolower($bagian['scheme'] ?? '');
    $host   = $bagian['host'] ?? '';
    if (!in_array($skema, ['http', 'https'], strict: true) || $host === '') {
        return false;
    }
    // Catatan keamanan: pemeriksaan ini hanya menjamin IP hasil resolusi SAAT INI aman. Jika permintaan
    // sesungguhnya me-resolve ulang nama host, penyerang dapat memakai DNS rebinding. Untuk produksi,
    // sambungkan cURL ke IP yang sudah divalidasi (CURLOPT_RESOLVE), matikan CURLOPT_FOLLOWLOCATION
    // (atau validasi ulang setiap pengalihan), dan periksa juga alamat IPv6.
    $daftarIp = gethostbynamel($host);
    if ($daftarIp === false || $daftarIp === []) {
        return false;
    }

    foreach ($daftarIp as $ip) {
        // Tolak IP privat (10.x, 192.168.x, 172.16-31.x) dan reserved/loopback (127.x, 169.254.x)
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
            return false;
        }
    }
    return true;
}

function ambilJalurBerkasDalamFolderAman(string $direktoriDasar, string $namaBerkasMasukan): string
{
    $dasarNyata = realpath($direktoriDasar);
    if ($dasarNyata === false) {
        throw new RuntimeException('Direktori dasar tidak ditemukan.');
    }

    // basename() membuang seluruh komponen direktori di depan, dan realpath() menyelesaikan symlink/..
    $namaBersih  = basename(str_replace('\\', '/', $namaBerkasMasukan));
    $targetNyata = realpath($dasarNyata . DIRECTORY_SEPARATOR . $namaBersih);

    if ($targetNyata === false || !str_starts_with($targetNyata, $dasarNyata . DIRECTORY_SEPARATOR)) {
        throw new InvalidArgumentException('Akses berkas di luar direktori dasar ditolak.');
    }

    return $targetNyata;
}
```

## 3. Mencegah *OS Command Injection* dengan Array Argumen pada `proc_open()`

Banyak pengembang belum tahu bahwa sejak PHP 7.4+, fungsi **`proc_open()` menerima argumen pertama berupa `array` string** (`['git', 'log', '-n', '5', $jalurRepo]`). Ketika Anda meneruskan array ke `proc_open()`, PHP mengeksekusi biner program secara langsung di tingkat sistem operasi (`execve`) **tanpa membuka shell `/bin/sh` sama sekali**! Akibatnya, karakter seperti `;`, `|`, `&&`, atau `$(...)` di dalam argumen diperlakukan murni sebagai teks biasa dan tidak mungkin mengeksekusi perintah tambahan:

```php
<?php
declare(strict_types=1);

/**
 * Menjalankan perintah eksternal secara aman tanpa melalui shell (/bin/sh).
 *
 * @param non-empty-list<string> $perintahDanArgumen
 */
function jalankanProsesTanpaShell(array $perintahDanArgumen): string
{
    $pipa = [];
    // Passing array ke proc_open melewati shell interpreter sehingga bebas dari injeksi ';' atau '$(...)'!
    $proses = proc_open(
        $perintahDanArgumen,
        [
            1 => ['pipe', 'w'], // STDOUT
            2 => ['pipe', 'w'], // STDERR
        ],
        $pipa
    );

    if (!is_resource($proses)) {
        throw new RuntimeException('Gagal memulai proses eksternal.');
    }

    $keluaran = (string) stream_get_contents($pipa[1]);
    $galat    = (string) stream_get_contents($pipa[2]);
    fclose($pipa[1]);
    fclose($pipa[2]);

    $kodeKeluar = proc_close($proses);
    if ($kodeKeluar !== 0) {
        throw new RuntimeException("Proses gagal (kode {$kodeKeluar}): " . trim($galat));
    }

    return $keluaran;
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan `str_replace('../', '', $input)` untuk mencegah *Path Traversal*:** Penyerang cukup mengirimkan string **`....//`**! Setelah `../` di tengahnya dihapus satu kali oleh `str_replace()`, sisa karakter di kiri dan kanannya menyatu kembali menjadi **`../`**! Gunakan selalu `basename()` + `realpath()` + `str_starts_with()`.
2. **Memakai `escapeshellcmd()` pada argumen tunggal (bukannya `escapeshellarg()`):** `escapeshellcmd()` masih mengizinkan spasi untuk memecah satu string menjadi banyak argumen bendera tambahan (*argument injection*, misalnya menyuntikkan `--output=/var/www/shell.php`). Selalu gunakan `proc_open()` dengan array, atau `escapeshellarg()`.
3. **Membiarkan `CURLOPT_FOLLOWLOCATION => true` saat mengambil URL eksternal:** Penyerang dapat memberikan URL publik yang lolos pemeriksaan IP awal (`https://situs-penyerang.com/foto.jpg`), tetapi server penyerang membalas dengan pengalihan HTTP `302 Redirect` menuju `http://127.0.0.1:6379/`! Matikan `CURLOPT_FOLLOWLOCATION`.

## Latihan Praktik Mandiri

1. Buat berkas `PertahananServer.php` yang memuat `apakahUrlEksternalAman()`, `ambilJalurBerkasDalamFolderAman()`, dan `jalankanProsesTanpaShell()`.
2. Tulis pengujian PHPUnit untuk memastikan:
   - `apakahUrlEksternalAman('http://127.0.0.1/admin')` dan `'file:///etc/passwd'` mengembalikan `false`;
   - `ambilJalurBerkasDalamFolderAman('/tmp', '../../etc/passwd')` melempar `InvalidArgumentException`;
   - `jalankanProsesTanpaShell([PHP_BINARY, '-r', 'echo "Aman";'])` mengembalikan `'Aman'`.

## Kuis Pemahaman

### Soal 1
Mengapa memanggil `str_replace('../', '', $jalurInput)` **tidak aman** untuk mencegah serangan *Path Traversal*, dan kombinasi fungsi apa yang harus digunakan sebagai gantinya?
- A. Karena `str_replace` hanya bekerja pada huruf besar
- B. Karena penyerang dapat mengirimkan pola bersarang seperti `....//` yang setelah dihapus satu kali oleh `str_replace` akan menyatu kembali menjadi `../`; gunakan `basename()`, kanonisasi jalur absolut sebenarnya dengan `realpath()`, lalu pastikan diawali dengan direktori dasar (`str_starts_with($targetNyata, $dasarNyata . DIRECTORY_SEPARATOR)`)
- C. Karena `str_replace` membutuhkan ekstensi `mbstring`
- D. Karena karakter `/` otomatis berubah menjadi `\` di Linux

**Jawaban Benar:** B
**Penjelasan:** Penyaringan daftar hitam string (`str_replace('../', '')`) mudah diakali dengan penyarangan karakter. Fungsi `realpath()` menyelesaikan seluruh `..`, `.`, dan *symlink* ke jalur kanonis sistem berkas yang sesungguhnya.

### Soal 2
Apa keuntungan keamanan terbesar dari meneruskan argumen pertama berupa **`array`** (misalnya `proc_open(['convert', $berkasMasuk, $berkasKeluar], ...)`) dibandingkan meneruskan satu string perintah ke `exec()` atau `shell_exec()`?
- A. Membuat proses berjalan tanpa menggunakan memori RAM
- B. Ketika diberi `array`, `proc_open()` mengeksekusi biner program secara langsung melalui sistem operasi tanpa memanggil penerjemah shell (`/bin/sh`), sehingga karakter meta-shell berbahaya seperti `;`, `|`, `&&`, atau `` `...` `` di dalam argumen tidak pernah dieksekusi sebagai perintah tambahan
- C. Mengubah hasil keluaran menjadi format JSON secara otomatis
- D. Mematikan firewall server sementara

**Jawaban Benar:** B
**Penjelasan:** Akar dari *OS Command Injection* adalah keterlibatan shell (`/bin/sh -c "..."`) yang menafsirkan spasi dan karakter pemisah perintah. Meneruskan array argumen ke `proc_open()` melompati shell sepenuhnya.

### Soal 3
Mengapa pada pencegahan **SSRF (*Server-Side Request Forgery*)**, memeriksa hasil `gethostbynamel($host)` terhadap IP privat saja masih belum cukup apabila cURL kemudian melakukan resolusi DNS ulang saat mengirim permintaan atau mengikuti `302 Redirect`?
- A. Karena cURL tidak mendukung protokol HTTPS
- B. Karena penyerang dapat melakukan serangan **DNS Rebinding** (mengembalikan IP publik yang valid pada resolusi DNS pertama saat validasi, lalu dengan TTL 0 detik mengembalikan `127.0.0.1` pada resolusi DNS kedua saat cURL terhubung) atau mengalihkan permintaan lewat HTTP Redirect ke IP internal; oleh karena itu, kunci IP hasil validasi dengan `CURLOPT_RESOLVE` dan matikan `CURLOPT_FOLLOWLOCATION`
- C. Karena `gethostbynamel()` hanya bekerja pada hari Minggu
- D. Karena alamat IP selalu terdiri dari 128 karakter

**Jawaban Benar:** B
**Penjelasan:** Memisahkan langkah resolusi DNS saat validasi dan resolusi DNS saat koneksi membuka celah *Time-of-Check to Time-of-Use* (DNS Rebinding). Mengikat IP yang telah divalidasi menggunakan `CURLOPT_RESOLVE` menutup celah tersebut.

## Sumber

- [Server-Side Request Forgery Prevention Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OS Command Injection Defense Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)
- [`escapeshellarg` — PHP Manual](https://www.php.net/manual/en/function.escapeshellarg.php)
- [`realpath` — PHP Manual](https://www.php.net/manual/en/function.realpath.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
