# Pertahanan HTTP Mendalam: Algoritma Rate Limiting (Token Bucket / Sliding Window), CORS Ketat, dan HSTS

- **Tingkat:** Lanjut
- **Ringkasan:** Mengimplementasikan pembatas laju permintaan (*Rate Limiter*) yang atomik untuk melindungi endpoint login dan API publik dari serangan *Brute Force*, mengonfigurasi header **CORS (`Access-Control-Allow-Origin`)** berdasarkan daftar putih, serta memasang `Strict-Transport-Security` (HSTS).

## Mengapa Kesalahan Satu Baris Header CORS Dapat Membuka Seluruh Data Pengguna ke Situs Jahat?

Secara bawaan, peramban web melindungi pengguna dengan aturan **Same-Origin Policy (SOP)**: situs `https://jahat.com` yang dibuka di tab lain tidak diizinkan membaca respons `fetch("https://api.kodeloka.id/profil", { credentials: "include" })`.

Namun, sering kali pengembang merasa terganggu oleh pesan galat CORS saat pengembangan, lalu menulis kode jalan pintas berbahaya di PHP:
`header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);`
`header("Access-Control-Allow-Credentials: true");`

Memantulkan `$_SERVER['HTTP_ORIGIN']` apa pun secara buta sambil mengizinkan kredensial sama saja dengan **merobohkan Same-Origin Policy sepenuhnya**! Situs jahat mana pun kini dapat mengirim permintaan terautentikasi atas nama pengguna Anda dan membaca seluruh isi responsnya!

> **🚫 Kerentanan & Kesalahan Umum:** Memantulkan nilai `$_SERVER['HTTP_ORIGIN']` apa pun secara buta ke dalam header `Access-Control-Allow-Origin` sambil mengaktifkan `Access-Control-Allow-Credentials: true` sama saja dengan mematikan perlindungan Same-Origin Policy bagi seluruh situs berbahaya di internet!

## 1. Peta Header Pertahanan HTTP dan Algoritma *Rate Limiting*

Berikut adalah konfigurasi header keamanan HTTP standar berdasarkan panduan [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html):

| Header HTTP / Mekanisme | Contoh Nilai Produksi yang Benar | Fungsi Pertahanan |
| :--- | :--- | :--- |
| **`Strict-Transport-Security` (HSTS)** | `max-age=63072000; includeSubDomains; preload` | Memaksa peramban selalu terhubung melalui **HTTPS** selama 2 tahun (mencegah serangan *SSL Stripping* di Wi-Fi publik). |
| **`Access-Control-Allow-Origin` + `Vary`** | Origin spesifik dari daftar putih + **`Vary: Origin`** | Mengizinkan pembacaan respons lintas-origin hanya untuk domain mitra tepercaya dan mencegah keracunan cache CDN antar-origin. |
| **`X-Content-Type-Options`** | `nosniff` | Mencegah peramban menebak-nebak tipe MIME (*MIME sniffing*) yang dapat mengeksekusi berkas teks/gambar sebagai skrip. |
| **`X-Frame-Options` / CSP `frame-ancestors`** | `DENY` atau `Content-Security-Policy: frame-ancestors 'none'` | Mencegah halaman Anda disematkan di dalam `<iframe>` transparan oleh penyerang (**Anti-Clickjacking**). |
| **Rate Limiting (`429 Too Many Requests`)** | Header `Retry-After: 60` dan `X-RateLimit-Remaining: 0` | Membatasi jumlah percobaan login/API per IP atau per akun pengguna dalam jendela waktu tertentu. |

## 2. Menerapkan CORS Berbasis Daftar Putih (*Allowlist*) dan Header Keamanan

Ketika Anda memvalidasi `$_SERVER['HTTP_ORIGIN']` terhadap array daftar putih (`$originDiizinkan`), jangan pernah lupa menyertakan header **`Vary: Origin`**! Tanpa `Vary: Origin`, CDN atau reverse proxy dapat menyimpan respons untuk `https://app.kodeloka.id` lalu menyajikannya kepada `https://admin.kodeloka.id` sehingga memicu kegagalan CORS di klien kedua:

```php
<?php
declare(strict_types=1);

/**
 * Menerapkan header keamanan HTTP dasar dan CORS ketat berbasis daftar putih.
 *
 * @param list<string> $originDiizinkan
 */
function terapkanHeaderKeamananDanCors(array $originDiizinkan): void
{
    // 1. Header keamanan standar OWASP
    header('Strict-Transport-Security: max-age=63072000; includeSubDomains; preload');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: strict-origin-when-cross-origin');

    // 2. Validasi CORS ketat dengan perbandingan === (strict: true)
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '' && in_array($origin, $originDiizinkan, strict: true)) {
        header("Access-Control-Allow-Origin: {$origin}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
        header('Vary: Origin');
    }
}
```

## 3. Algoritma Pembatas Laju (*Rate Limiter*) untuk Melindungi Endpoint Login

Untuk menangkal serangan *Brute Force* kata sandi atau penyalahgunaan OTP, batasi laju permintaan berdasarkan kombinasi alamat IP dan identitas akun yang dituju. Berikut adalah implementasi *Fixed/Sliding Window Counter* bersih yang mengembalikan status izinkan/tolak beserta sisa kuota dan detik tunggu (`retry_after`):

```php
<?php
declare(strict_types=1);

final class PembatasLajuMemori
{
    /** @var array<string, array{hitung: int, resetPada: int}> */
    private array $penyimpanan = [];

    /**
     * @return array{diizinkan: bool, sisa: int, cobaLagiDetik: int}
     */
    public function periksa(string $kunciIdentitas, int $batasMaks, int $jendelaDetik, ?int $waktuSekarang = null): array
    {
        $sekarang = $waktuSekarang ?? time();
        $catatan  = $this->penyimpanan[$kunciIdentitas] ?? null;

        if ($catatan === null || $sekarang >= $catatan['resetPada']) {
            $catatan = ['hitung' => 0, 'resetPada' => $sekarang + $jendelaDetik];
        }

        $catatan['hitung']++;
        $this->penyimpanan[$kunciIdentitas] = $catatan;

        $diizinkan     = $catatan['hitung'] <= $batasMaks;
        $sisa          = max(0, $batasMaks - $catatan['hitung']);
        $cobaLagiDetik = max(0, $catatan['resetPada'] - $sekarang);

        return [
            'diizinkan'     => $diizinkan,
            'sisa'          => $sisa,
            'cobaLagiDetik' => $cobaLagiDetik,
        ];
    }
}
```

Di lingkungan produksi multi-server, jalankan penghitung tersebut secara atomik di **Redis** (menggunakan perintah `INCR` + `EXPIRE` di dalam skrip Lua) dan kirimkan kode status HTTP **`429 Too Many Requests`** beserta header `Retry-After` saat `$diizinkan === false`.

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Mengambil alamat IP klien dari `$_SERVER['HTTP_X_FORWARDED_FOR']` secara mentah untuk Rate Limiting:** Jika server PHP Anda tidak berada di balik reverse proxy tepercaya (atau proxy tidak menimpa header tersebut), penyerang dapat mengirimkan header palsu `X-Forwarded-For: <angka-acak>` yang berbeda pada setiap permintaan untuk melewati *Rate Limiter* sepenuhnya! Hanya baca `X-Forwarded-For` jika `$_SERVER['REMOTE_ADDR']` berasal dari IP reverse proxy internal Anda sendiri.
2. **Hanya membatasi laju login berdasarkan IP tanpa membatasi per akun `email`/`username`:** Penyerang yang menggunakan jaringan *botnet* (ribuan IP berbeda) dapat mencoba 2 kata sandi dari setiap IP terhadap akun `admin@kodeloka.id`. Terapkan dua lapis pembatas laju: batas per IP **dan** batas per akun tujuan!
3. **Menulis `Access-Control-Allow-Origin: *` bersamaan dengan `Access-Control-Allow-Credentials: true`:** Spesifikasi Fetch/CORS di seluruh peramban secara otomatis **menolak dan memblokir** kombinasi wildcard `*` dengan `Allow-Credentials: true`.

## Latihan Praktik Mandiri

1. Buat berkas `PembatasLajuMemori.php` seperti pada contoh di atas.
2. Tulis pengujian PHPUnit untuk memverifikasi bahwa:
   - dengan `$batasMaks = 3` dan `$jendelaDetik = 60`, panggilan ke-1, ke-2, dan ke-3 mengembalikan `'diizinkan' => true`;
   - panggilan ke-4 pada detik yang sama mengembalikan `'diizinkan' => false` dan `'sisa' => 0`;
   - panggilan ke-5 setelah waktu maju 61 detik (`$waktuSekarang + 61`) kembali mengembalikan `'diizinkan' => true`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Memantulkan nilai `$_SERVER['HTTP_ORIGIN']` apa pun secara buta ke dalam header `Access-Control-Allow-Origin` sambil mengaktifkan `Access-Control-Allow-Credentials: true` sama saja dengan mematikan perlindungan Same-Origin Policy bagi seluruh situs berbahaya di internet!*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena membuka celah keamanan serius di mana situs berbahaya mana pun dapat melakukan permintaan lintas-origin dengan membawa cookie sesi pengguna yang sedang login dan membaca seluruh isi respons rahasianya
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi `header()`
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Memantulkan nilai `$_SERVER['HTTP_ORIGIN']` apa pun secara buta ke dalam header `Access-Control-Allow-Origin` sambil mengaktifkan `Access-Control-Allow-Credentials: true` mengizinkan origin mana pun di internet membaca data terautentikasi pengguna.

### Soal 2
Mengapa saat server Anda mengembalikan header `Access-Control-Allow-Origin` secara dinamis berdasarkan daftar putih (misalnya mengizinkan `https://app.kodeloka.id` dan `https://studio.kodeloka.id`), Anda juga wajib mengirimkan header `Vary: Origin`?
- A. Agar peramban otomatis menghapus cookie setiap 5 menit
- B. Agar CDN atau cache perantara tidak menyajikan respons yang di-cache dengan header `Access-Control-Allow-Origin: https://app.kodeloka.id` kepada pengunjung yang datang dari `https://studio.kodeloka.id`
- C. Untuk menggantikan fungsi sertifikat TLS/SSL
- D. Karena tanpa `Vary: Origin`, metode `POST` berubah menjadi `GET`

**Jawaban Benar:** B
**Penjelasan:** Header `Vary: Origin` memberi tahu cache HTTP bahwa isi header respons bergantung pada nilai header `Origin` permintaan, sehingga respons untuk dua origin berbeda tidak saling tertukar di cache.

### Soal 3
Kode status HTTP dan header respons apakah yang menjadi standar resmi ketika permintaan seorang klien ditolak oleh **Rate Limiter** karena melampaui batas kuota permintaan?
- A. Status `200 OK` dengan header `X-Error: true`
- B. Status **`429 Too Many Requests`** disertai header **`Retry-After`** (berisi jumlah detik sebelum klien boleh mencoba lagi)
- C. Status `404 Not Found`
- D. Status `505 HTTP Version Not Supported`

**Jawaban Benar:** B
**Penjelasan:** Standar HTTP (RFC 6585 / RFC 9110) menetapkan kode status `429 Too Many Requests` untuk pembatasan laju permintaan, dilengkapi dengan header `Retry-After` agar klien yang patuh dapat menjadwalkan ulang permintaannya secara terukur.

## Sumber

- [Cross-Origin Resource Sharing (CORS) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [Strict-Transport-Security — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security)
- [RFC 6797: HTTP Strict Transport Security (HSTS) — IETF](https://www.rfc-editor.org/rfc/rfc6797)
- [HTTP Security Response Headers Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
