# Audit Keamanan OWASP Top 10 & Daftar Periksa Kesiapan Produksi (*Production Readiness*) PHP

- **Tingkat:** Lanjut
- **Ringkasan:** Melakukan audit menyeluruh terhadap aplikasi PHP sebelum rilis ke produksi berdasarkan standar **OWASP Top 10** dan **OWASP ASVS**: pemeriksaan injeksi parameter PDO, konfigurasi `php.ini` (`expose_php=Off`, `display_errors=Off`, `session.use_strict_mode=1`), pemindaian `composer audit`, hingga uji pemulihan bencana.

## Mengapa Satu Pengaturan `display_errors = On` yang Terlupa Dapat Membocorkan Seluruh Rahasia Server?

Bayangkan aplikasi Anda sudah menggunakan PDO Prepared Statements dan Argon2id, tetapi saat dipasang di server produksi, berkas `php.ini` masih membiarkan nilai bawaan pengembangan **`display_errors = On`**. Suatu malam, server database mengalami beban penuh dan menolak koneksi baru.

Alih-alih menampilkan halaman maaf yang sopan kepada pengunjung, PHP mencetak pesan *Uncaught PDOException* beserta **jejak panggilan lengkap (*stack trace*)** langsung ke layar peramban pengunjung—lengkap dengan jalur direktori internal `/var/www/kodeloka/src/...`, nama host database internal, dan nama pengguna database!

Sebelum aplikasi dinyatakan siap melayani trafik publik (*Production Ready*), lakukan audit sistematis berdasarkan **OWASP Top 10** dan **OWASP Application Security Verification Standard (ASVS)**.

> **🚫 Kerentanan & Kesalahan Umum:** Meluncurkan aplikasi ke produksi dengan `display_errors = On` atau berkas `.env` / `.git` yang dapat diakses langsung melalui URL publik akan membocorkan kredensial database dan jejak panggilan internal (*stack trace*) kepada penyerang.

## 1. Daftar Periksa Konfigurasi `php.ini` Wajib untuk Lingkungan Produksi

Pastikan berkas konfigurasi runtime PHP produksi Anda menerapkan pengaturan pengerasan (*hardening*) berikut:

| Direktif `php.ini` | Nilai Wajib di Produksi | Mengapa Sangat Penting? |
| :--- | :--- | :--- |
| **`display_errors`** & **`display_startup_errors`** | **`Off`** (`0`) | Mencegah pesan galat internal, jalur berkas, dan *stack trace* tercetak ke layar pengunjung publik. |
| **`log_errors`** | **`On`** (`1`) | Mencatat seluruh galat secara aman ke aliran `stderr` kontainer atau berkas log internal server. |
| **`expose_php`** | **`Off`** (`0`) | Menghilangkan header `X-Powered-By: PHP/8.5.x` agar versi minor PHP tidak diumumkan secara cuma-cuma ke pemindai otomatis. |
| **`session.use_strict_mode`** | **`1`** | **Wajib!** Memerintahkan PHP menolak ID sesi yang belum pernah diinisialisasi oleh server (**mencegah *Session Fixation***). |
| **`session.cookie_httponly`** & **`cookie_secure`** | **`1`** & **`1`** | Melindungi cookie sesi dari pembacaan `document.cookie` (XSS) dan memastikan hanya dikirim lewat HTTPS. |
| **`session.cookie_samesite`** | **`Lax`** (atau `Strict`) | Melindungi sesi dari pengiriman cookie otomatis pada permintaan lintas situs (**pertahanan lapis pertama CSRF**). |
| **`zend.assertions`** | **`-1`** | Menonaktifkan kompilasi kode `assert()` sama sekali di produksi sehingga nol biaya CPU. |

## 2. Skrip Audit Otomatis Konfigurasi Runtime PHP (`ini_get` dengan `FILTER_VALIDATE_BOOL`)

Perhatikan detail teknis penting saat membaca nilai direktif boolean dari `ini_get()` di PHP: direktif yang dimatikan dengan `Off` di `php.ini` dikembalikan oleh `ini_get()` sebagai **string kosong `""`** atau **`"0"`**, sedangkan yang aktif dikembalikan sebagai **`"1"`** atau **`"On"`**. Oleh sebab itu, gunakan **`filter_var(ini_get('...'), FILTER_VALIDATE_BOOL)`** untuk memeriksa status boolean direktif `php.ini` secara akurat!

```php
<?php
declare(strict_types=1);

/**
 * Mengaudit konfigurasi runtime PHP terhadap daftar periksa keamanan produksi.
 * Dapat menerima array konfigurasi simulasi untuk keperluan pengujian unit.
 *
 * @param array<string, string>|null $konfigUji
 * @return list<string> Daftar temuan masalah keamanan (kosong jika 100% aman)
 */
function auditKonfigurasiRuntimeProduksi(?array $konfigUji = null): array
{
    $ambil = static fn (string $kunci): string => $konfigUji !== null
        ? (string) ($konfigUji[$kunci] ?? '')
        : (string) ini_get($kunci);

    $temuan = [];

    if (filter_var($ambil('display_errors'), FILTER_VALIDATE_BOOL)) {
        $temuan[] = 'BAHAYA: display_errors masih aktif di lingkungan produksi.';
    }
    if (filter_var($ambil('expose_php'), FILTER_VALIDATE_BOOL)) {
        $temuan[] = 'PERINGATAN: expose_php masih aktif; matikan agar header X-Powered-By tidak bocor.';
    }
    if (!filter_var($ambil('session.use_strict_mode'), FILTER_VALIDATE_BOOL)) {
        $temuan[] = 'BAHAYA: session.use_strict_mode wajib bernilai 1 untuk menolak ID sesi tak dikenal.';
    }
    if (!filter_var($ambil('session.cookie_httponly'), FILTER_VALIDATE_BOOL)) {
        $temuan[] = 'BAHAYA: session.cookie_httponly wajib diaktifkan.';
    }
    if (!filter_var($ambil('session.cookie_secure'), FILTER_VALIDATE_BOOL)) {
        $temuan[] = 'PERINGATAN: session.cookie_secure wajib diaktifkan pada situs HTTPS.';
    }

    return $temuan;
}
```

## 3. Pemetaan Pertahanan Aplikasi PHP Terhadap OWASP Top 10

Sebelum menayangkan rilis baru, pastikan sepuluh kategori risiko **OWASP Top 10** telah tertutup di seluruh kode Anda:
1. **A01 Broken Access Control:** Terapkan *Policy Object* dan klausa `WHERE pemilik_id = :uid` di setiap operasi baca/ubah/hapus (cegah IDOR), serta pasang token CSRF + `SameSite=Lax`.
2. **A02 Cryptographic Failures:** Gunakan `password_hash($sandi, PASSWORD_ARGON2ID)` untuk kata sandi, `sodium_crypto_secretbox` untuk data sensitif, dan `random_bytes()` untuk semua token keamanan.
3. **A03 Injection (SQL, XSS, Command):** Gunakan **PDO Prepared Statements** (`ATTR_EMULATE_PREPARES => false`), *Contextual Output Escaping* (`htmlspecialchars(..., ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')`), dan `proc_open()` dengan array argumen.
4. **A05 Security Misconfiguration:** Pastikan *document root* web server (Nginx/Caddy) menunjuk ke sub-folder **`/public`** (sehingga `/src`, `/vendor`, `composer.json`, `.env`, dan `.git` berada **di luar** folder publik dan mustahil diunduh langsung lewat URL!).
5. **A06 Vulnerable and Outdated Components:** Jalankan **`composer audit`** pada setiap pipa CI untuk menggagalkan *build* secara otomatis apabila ada paket di `composer.lock` yang terkena CVE keamanan.
6. **A07 Identification and Authentication Failures:** Panggil `session_regenerate_id(true)` setiap kali login atau perubahan hak akses, dan pasang *Rate Limiter* pada endpoint autentikasi.
7. **A08 Software and Data Integrity Failures:** Jangan pernah memanggil `unserialize()` pada input pengguna, dan gunakan `JSON_THROW_ON_ERROR`.
8. **A10 Server-Side Request Forgery (SSRF):** Validasi host/IP tujuan dengan `FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE` dan kunci dengan `CURLOPT_RESOLVE`.

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Memeriksa `ini_get('display_errors') === '0'` untuk memastikan `display_errors` mati:** Ketika di `php.ini` tertulis `display_errors = Off`, fungsi `ini_get('display_errors')` sering mengembalikan **string kosong `""`** (atau `"Off"`), bukan `"0"`! Akibatnya, perbandingan `=== '0'` menjadi `false` dan salah mengira `display_errors` masih menyala! Gunakan selalu **`!filter_var(ini_get('display_errors'), FILTER_VALIDATE_BOOL)`**.
2. **Meletakkan seluruh kode aplikasi di akar *document root* lalu mengandalkan `.htaccess` untuk memblokir `.env`:** Jika aplikasi dipindahkan dari Apache ke Nginx atau FrankenPHP (yang tidak membaca berkas `.htaccess`!), berkas `.env` dan `.git/config` Anda langsung terbuka lebar ke seluruh dunia! Satu-satunya cara yang 100% aman adalah mengatur `root /app/public;` di web server sehingga hanya `public/index.php` dan aset statis yang berada di dalam *document root*.
3. **Menjalankan `composer audit` hanya satu kali saat rilis awal:** Kerentanan CVE baru ditemukan setiap minggu pada pustaka pihak ketiga; jadwalkan `composer audit` berjalan otomatis setiap hari di CI/CD.

## Latihan Praktik Mandiri

1. Buat berkas `AuditorProduksi.php` yang memuat fungsi `auditKonfigurasiRuntimeProduksi()` seperti pada contoh di atas.
2. Tulis pengujian PHPUnit yang menguji `auditKonfigurasiRuntimeProduksi()` dengan dua skenario konfigurasi simulasi:
   - konfigurasi produksi yang aman (`display_errors => 'Off'`, `expose_php => ''`, `session.use_strict_mode => '1'`, `session.cookie_httponly => 'On'`, `session.cookie_secure => '1'`) -> mengembalikan array kosong `[]`;
   - konfigurasi tidak aman (`display_errors => 'On'`, `session.use_strict_mode => '0'`) -> mengembalikan daftar temuan peringatan yang tepat.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Meluncurkan aplikasi ke produksi dengan `display_errors = On` atau berkas `.env` / `.git` yang dapat diakses langsung melalui URL publik akan membocorkan kredensial database dan jejak panggilan internal (*stack trace*) kepada penyerang.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena membuka celah keamanan serius, merusak integritas data/finansial, atau menyebabkan kebocoran kredensial rahasia dan struktur internal server kepada penyerang
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Meluncurkan aplikasi ke produksi dengan `display_errors = On` atau berkas `.env` / `.git` yang dapat diakses langsung melalui URL publik akan membocorkan kredensial database dan jejak panggilan internal (*stack trace*) kepada penyerang.

### Soal 2
Mengapa memeriksa status mati dari direktif `display_errors` menggunakan ekspresi `!filter_var(ini_get('display_errors'), FILTER_VALIDATE_BOOL)` jauh lebih akurat daripada menulis `ini_get('display_errors') === '0'`?
- A. Karena `ini_get()` selalu mengembalikan objek `stdClass`
- B. Karena menurut manual resmi PHP, direktif boolean yang bernilai `Off` di `php.ini` dapat dikembalikan oleh `ini_get()` sebagai string kosong `""`, `"0"`, atau `"Off"`; `filter_var(..., FILTER_VALIDATE_BOOL)` mengenali `"1"`, `"true"`, `"on"`, dan `"yes"` sebagai `true` serta `"0"`, `"false"`, `"off"`, `"no"`, dan `""` sebagai `false` secara konsisten
- C. Karena `FILTER_VALIDATE_BOOL` otomatis mengubah isi berkas `php.ini` di disk
- D. Karena operator `===` tidak berlaku untuk string

**Jawaban Benar:** B
**Penjelasan:** Nilai kembalian `ini_get()` untuk direktif boolean yang mati sering berupa string kosong `""` sehingga perbandingan kaku `=== '0'` meleset. `filter_var($val, FILTER_VALIDATE_BOOL)` menangani seluruh variasi nilai boolean `php.ini` dengan tepat.

### Soal 3
Bagaimana cara arsitektur direktori paling aman untuk memastikan berkas sensitif seperti `.env`, `composer.json`, `vendor/`, dan `src/` **mustahil** diunduh langsung melalui URL peramban oleh pengunjung, apa pun jenis web server (Nginx, Caddy, Apache) yang digunakan?
- A. Mengganti nama berkas `.env` menjadi `rahasia.env` di dalam folder utama
- B. Menempatkan hanya `index.php` dan aset statis (CSS/JS/gambar) di dalam sub-direktori **`public/`** lalu mengarahkan konfigurasi *document root* web server ke folder `/app/public`, sehingga `.env`, `src/`, dan `vendor/` berada satu tingkat **di luar** *document root*
- C. Menambahkan komentar `// rahasia` di baris pertama `.env`
- D. Menyembunyikan tautan `.env` menggunakan CSS `display: none`

**Jawaban Benar:** B
**Penjelasan:** Menempatkan berkas konfigurasi dan kode sumber di luar *document root* (`public/`) menjamin secara struktural di tingkat sistem berkas bahwa web server tidak pernah menyajikan berkas-berkas tersebut sebagai URL statis.

## Sumber

- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/)
- [Session Management Basics — PHP Manual](https://www.php.net/manual/en/features.session.security.management.php)
- [`ini_get` — PHP Manual](https://www.php.net/manual/en/function.ini-get.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
