# Menangani Permintaan HTTP, Validasi `filter_input()`, dan Ekstensi `Uri` (PHP 8.5)

- **Tingkat:** Menengah
- **Ringkasan:** Membedah siklus permintaan HTTP di PHP melalui variabel superglobal (`$_SERVER`, `$_GET`, `$_POST`), membaca body JSON dari `php://input`, memvalidasi masukan pengguna dengan `filter_input()` dan `filter_var()`, serta mengurai URL secara presisi menggunakan ekstensi `Uri` bawaan PHP 8.5.

## 1. Bagaimana Permintaan HTTP Masuk ke Skrip PHP Anda?

Ketika peramban mengirimkan permintaan HTTP ke server web (Nginx) dan diteruskan ke PHP-FPM, PHP menyiapkan lingkungan khusus untuk permintaan tersebut dan mengisi sejumlah array **Superglobals** tentang permintaan yang baru saja tiba:

| Superglobal | Apa Isinya? | Catatan Keamanan Penting |
|---|---|---|
| **`$_SERVER`** | Metode HTTP (`REQUEST_METHOD`), jalur URI (`REQUEST_URI`), alamat IP (`REMOTE_ADDR`), dan header HTTP (`HTTP_*`). | Semua kunci yang diawali `HTTP_*` (seperti `HTTP_HOST`, `HTTP_USER_AGENT`, `HTTP_REFERER`, `HTTP_X_FORWARDED_FOR`) dikirim oleh klien dan **bisa dipalsukan oleh penyerang**! |
| **`$_GET`** | Parameter query string dari URL (`?halaman=2&kategori=php`). | Semua nilai di dalam `$_GET` bertipe `string` (atau `array` jika ditulis `?tag[]=a&tag[]=b`)! |
| **`$_POST`** | Data tubuh permintaan dari formulir `application/x-www-form-urlencoded` atau `multipart/form-data`. | Tidak terisi jika klien mengirim body berformat `application/json`. |
| **`$_COOKIE`** | Nilai cookie yang dikirimkan oleh peramban melalui header `Cookie`. | Dapat dimodifikasi oleh pengguna di peramban; selalu validasi! |
| **`$_FILES`** | Metadata berkas yang diunggah lewat `multipart/form-data`. | Wajib divalidasi dengan `finfo` dan `move_uploaded_file()`. |

> **⚠️ Jebakan Keamanan: Nilai di dalam `$_GET` atau `$_POST` Bisa Berupa `array`!**
> Banyak pengembang mengira `$_GET['pencarian']` selalu berupa `string` lalu langsung menulis `trim($_GET['pencarian'])`.
> Apa yang terjadi jika pengguna jahil memanggil URL **`/cari?pencarian[]=halo`** (dengan tanda kurung siku `[]`)?
> PHP akan mengubah `$_GET['pencarian']` menjadi sebuah **`array`**, sehingga `trim($_GET['pencarian'])` langsung melempar **`TypeError: trim(): Argument #1 ($string) must be of type string, array given`**!
> **Solusi:** Selalu periksa `is_string($nilai)` atau gunakan `filter_input()`!

```php
<?php

declare(strict_types=1);

// AMAN: Memastikan nilai parameter benar-benar bertipe string sebelum di-trim
function ambilQueryString(string $kunci, string $bawaan = ''): string
{
    $nilai = $_GET[$kunci] ?? null;
    return is_string($nilai) ? trim($nilai) : $bawaan;
}
```

## 2. Validasi Ketat dengan `filter_input()` dan `filter_var()`

Ekstensi bawaan `filter` menyediakan validator standar yang aman terhadap serangan tipe data:

```php
<?php

declare(strict_types=1);

// 1. Memvalidasi bilangan bulat dengan rentang minimum dan maksimum yang tegas
$idModul = filter_input(
    INPUT_GET,
    'id',
    FILTER_VALIDATE_INT,
    [
        'options' => [
            'min_range' => 1,
            'max_range' => 10_000,
        ],
    ],
);

// filter_input mengembalikan:
// - null  jika parameter 'id' tidak ada sama sekali di $_GET
// - false jika 'id' ada, tetapi bukan angka bulat antara 1..10000 (mis. "abc" atau "-5" atau array!)
if (!is_int($idModul)) {
    http_response_code(400);
    exit('Parameter ID modul harus berupa angka bulat positif.');
}

// 2. Memvalidasi alamat surel dan alamat IP
$surel = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$ipKlien = filter_var($_SERVER['REMOTE_ADDR'] ?? '', FILTER_VALIDATE_IP);
```

## 3. Membaca Permintaan JSON (`php://input`) dan Mengenal `request_parse_body()` (PHP 8.4)

1. **Untuk Permintaan `application/json`:**
   Gunakan `file_get_contents('php://input')` dan `json_decode(..., associative: true, flags: JSON_THROW_ON_ERROR)`:
   ```php
   <?php

   declare(strict_types=1);

   function ambilPayloadJson(): array
   {
       $tipeKonten = $_SERVER['CONTENT_TYPE'] ?? '';
       if (!str_starts_with(strtolower($tipeKonten), 'application/json')) {
           throw new InvalidArgumentException('Header Content-Type harus application/json.');
       }

       $bodyMentah = (string) file_get_contents('php://input');
       $data = json_decode($bodyMentah, associative: true, depth: 32, flags: JSON_THROW_ON_ERROR);

       if (!is_array($data)) {
           throw new InvalidArgumentException('Payload JSON harus berupa objek atau array.');
       }

       return $data;
   }
   ```
2. **Untuk Permintaan `PUT` / `PATCH` Multipart (`request_parse_body()` — Sejak PHP 8.4):**
   Secara historis, PHP hanya mengurai `multipart/form-data` secara otomatis untuk metode `POST`. Sejak **PHP 8.4**, tersedia fungsi bawaan **`[$post, $files] = request_parse_body();`** untuk mengurai body `multipart/form-data` (dan `application/x-www-form-urlencoded`) pada metode HTTP selain `POST`, misalnya `PUT` atau `PATCH`. Body hanya dapat dibaca sekali: jika `php://input` sudah dibaca lebih dulu, `request_parse_body()` mengembalikan data kosong.

## 4. Mengurai dan Memodifikasi URL dengan Ekstensi `Uri` Baru (Sejak PHP 8.5)

Fungsi lama `parse_url()` di PHP memiliki perilaku yang tidak konsisten terhadap standar RFC modern. Sejak **PHP 8.5**, ekstensi bawaan **`Uri`** menyediakan dua kelas imutabel standar:
- **`Uri\Rfc3986\Uri`:** Untuk URI standar RFC 3986.
- **`Uri\WhatWg\Url`:** Untuk URL yang mematuhi spesifikasi peramban WHATWG URL.

```php
<?php

declare(strict_types=1);

use Uri\Rfc3986\Uri;

// Mengurai dan membangun URL pengalihan (redirect) yang aman di PHP 8.5:
$uriTujuan = new Uri('https://kodeloka.asadinedu.com/kelas/php');

// Objek Uri bersifat immutable; metode withQuery() menghasilkan instans Uri baru:
$uriDenganPesan = $uriTujuan->withQuery('status=berhasil&modul=10');

echo $uriDenganPesan->getHost();   // "kodeloka.asadinedu.com"
echo $uriDenganPesan->toString();  // "https://kodeloka.asadinedu.com/kelas/php?status=berhasil&modul=10"
```

## Latihan Praktik: Endpoint Pemroses Pendaftaran Kelas (Form & JSON)

Buatlah berkas `proses-request.php`:
1. Periksa `$_SERVER['REQUEST_METHOD'] === 'POST'` (jika bukan `POST`, kembalikan status `405 Method Not Allowed` beserta header `Allow: POST`).
2. Dukung penerimaan data baik dari formulir biasa (`$_POST`) maupun dari body JSON (`php://input`) berdasarkan pemeriksaan `$_SERVER['CONTENT_TYPE']`.
3. Validasi `nama` (string 2–80 karakter), `email` (`FILTER_VALIDATE_EMAIL`), dan `id_kelas` (`FILTER_VALIDATE_INT` minimal 1).

## Kuis Pemahaman

### Soal 1
Apa yang terjadi jika kode Anda memanggil `trim($_GET['nama'])` secara langsung pada mode `declare(strict_types=1);`, lalu pengunjung memanggil URL `?nama[]=Budi`?
- A. Fungsi `trim()` otomatis mengambil elemen pertama dari array tersebut (`"Budi"`).
- B. PHP melempar `TypeError` karena notasi `?nama[]=Budi` membuat `$_GET['nama']` bertipe `array`, sedangkan `trim()` hanya menerima argumen bertipe `string`.
- C. `$_GET['nama']` otomatis bernilai `null`.
- D. Peramban memblokir URL yang mengandung karakter `[]`.

**Jawaban Benar:** B
**Penjelasan:** Di PHP, parameter query atau input form yang memiliki akhiran `[]` otomatis diurai menjadi `array` di dalam `$_GET` atau `$_POST`. Selalu pastikan tipe variabel dengan `is_string()` atau gunakan `filter_input()` sebelum memasukkannya ke fungsi string.

### Soal 2
Mengapa nilai `$_SERVER['HTTP_X_FORWARDED_FOR']` atau `$_SERVER['HTTP_USER_AGENT']` tidak boleh langsung dipercaya begitu saja untuk keputusan keamanan?
- A. Karena variabel `$_SERVER` hanya tersedia di Windows.
- B. Karena seluruh entri di dalam `$_SERVER` yang diawali dengan `HTTP_` disalin langsung dari header permintaan HTTP yang dikirim oleh klien, sehingga dapat diubah atau dipalsukan sesuka hati oleh pengirim menggunakan `curl -H "..."` (kecuali `X-Forwarded-For` ditimpa secara ketat oleh *reverse proxy* tepercaya milik Anda sendiri seperti Nginx/Cloudflare).
- C. Karena `$_SERVER` otomatis terhapus setelah dibaca satu kali.
- D. Karena nilainya selalu terenkripsi.

**Jawaban Benar:** B
**Penjelasan:** Hanya variabel seperti `$_SERVER['REMOTE_ADDR']` dan `$_SERVER['REQUEST_METHOD']` yang berasal dari koneksi TCP/HTTP aktual di tingkat server web, sedangkan `$_SERVER['HTTP_*']` berasal dari header HTTP masukan klien.

### Soal 3
Apa keunggulan ekstensi bawaan `Uri` (`Uri\Rfc3986\Uri` dan `Uri\WhatWg\Url`) yang diperkenalkan di **PHP 8.5** dibandingkan fungsi lama `parse_url()`?
- A. `parse_url()` hanya dapat membaca URL yang dimulai dengan `ftp://`.
- B. Ekstensi `Uri` di PHP 8.5 mematuhi spesifikasi standar RFC 3986 dan WHATWG URL secara ketat (menutup celah perbedaan penguraian URL antar-layanan) serta menyediakan antarmuka berorientasi objek yang *immutable*.
- C. Ekstensi `Uri` otomatis mengunduh halaman HTML dari URL tersebut.
- D. `parse_url()` sudah dihapus dari PHP 8.2.

**Jawaban Benar:** B
**Penjelasan:** `parse_url()` memiliki perilaku non-standar pada sejumlah URL tepi (*edge cases*) yang berisiko memicu celah *SSRF / Open Redirect bypass*. Ekstensi `Uri` di PHP 8.5 dibangun di atas pustaka standar RFC 3986 (`uriparser`) dan WHATWG (`Lexbor`).

## Sumber
- [`filter_input` — PHP Manual](https://www.php.net/manual/en/function.filter-input.php)
- [Superglobals — PHP Manual](https://www.php.net/manual/en/language.variables.superglobals.php)
- [`request_parse_body` — PHP Manual](https://www.php.net/manual/en/function.request-parse-body.php)
- [URI extension — PHP Manual](https://www.php.net/manual/en/book.uri.php)
- [PHP 8.5 Release Announcement (URI Extension) — PHP.net](https://www.php.net/releases/8.5/en.php)
- [PHP 8.4 Release Announcement (`request_parse_body`) — PHP.net](https://www.php.net/releases/8.4/en.php)
