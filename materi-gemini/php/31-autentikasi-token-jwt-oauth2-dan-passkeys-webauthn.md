# Autentikasi Modern: Sesi vs Token (JWT/PASETO), Alur OAuth 2.0 / OIDC (PKCE), dan Dasar Passkeys

- **Tingkat:** Lanjut
- **Ringkasan:** Membandingkan kapan harus menggunakan *Stateful Session Cookie* versus *Stateless Token (JWT)*, menerapkan validasi tanda tangan dan klaim JWT (`exp`, `iss`, `aud`) secara ketat, memahami alur **OAuth 2.0 Authorization Code + PKCE**, serta pengantar autentikasi tahan phishing dengan WebAuthn / Passkeys.

## Mengapa Mengganti Sesi Cookie dengan JWT untuk Aplikasi Web Biasa Sering Menjadi Langkah Mundur?

Banyak pengembang baru mengira bahwa menyimpan token **JWT (*JSON Web Token*)** di `localStorage` adalah cara "modern" yang selalu lebih baik daripada sesi PHP/Redis berbasis cookie. Padahal, menyimpan token autentikasi di `localStorage` membuat token tersebut **dapat dibaca secara bebas oleh skrip JavaScript mana pun** jika terjadi satu celah XSS saja! Selain itu, JWT yang murni *stateless* **tidak dapat langsung dicabut (*revoked*)** sebelum waktu kedaluwarsanya (`exp`) habis ketika akun pengguna diretas atau keluar (*logout*).

Untuk aplikasi web yang dilayani dari domain yang sama, **Session Cookie berbendera `HttpOnly`, `Secure`, dan `SameSite=Lax`** tetap menjadi pilihan paling aman dan mudah dicabut. Gunakan **Short-Lived JWT (5–15 menit)** ketika Anda membutuhkan verifikasi identitas lintas layanan mikro (*microservices*) atau klien aplikasi seluler native.

> **🚫 Kerentanan & Kesalahan Umum:** Mempercayai header `alg` di dalam token JWT yang dikirim klien tanpa mengunci algoritma yang diizinkan di sisi server membuka celah klasik `alg: none` atau kebingungan kunci RS256 vs HS256 yang memungkinkan penyerang memalsukan token admin.

## 1. Perbandingan Arsitektur Autentikasi: Session Cookie, JWT, OAuth 2.0 PKCE, dan Passkeys

Pahami kekuatan dan aturan keamanan masing-masing mekanisme identitas berikut:

| Mekanisme Identitas | Penyimpanan & Sifat | Keunggulan Utama | Aturan Keamanan Wajib (RFC 8725 / OWASP) |
| :--- | :--- | :--- | :--- |
| **Stateful Session Cookie** | ID acak di Cookie `HttpOnly; Secure; SameSite=Lax`, data di Redis/DB. | Dapat dicabut (*revoke*) seketika di server; kebal pembacaan `document.cookie` saat XSS. | Panggil `session_regenerate_id(true)` saat login untuk mencegah *Session Fixation*. |
| **JWT (*JSON Web Token*)** | `header.payload.signature` (Base64URL). | Verifikasi tanda tangan cepat tanpa kueri database di setiap layanan mikro. | Kunci algoritma di server (tolak `alg: none`), verifikasi `exp`, `nbf`, `iss`, `aud`, dan gunakan **`hash_equals()`**. |
| **OAuth 2.0 + PKCE (RFC 7636)** | Pertukaran `authorization_code` + `code_verifier` rahasia. | Mencegah pencurian kode otorisasi di tengah jalan (*authorization code interception*). | Gunakan metode transformasi **`S256`** (`BASE64URL(SHA256(verifier))`), jangan `plain`. |
| **WebAuthn / Passkeys** | Kunci privat disimpan di chip keamanan perangkat (TPM/Secure Enclave), kunci publik di server. | **100% tahan Phishing** karena kunci terikat secara kriptografis pada nama domain (`rpId`) situs! | Simpan `challenge` sekali pakai di sesi server dan periksa penghitung tanda tangan (`signCount`). |

## 2. Membuat Tantangan OAuth 2.0 PKCE (`S256`) dan Memverifikasi JWT Secara Aman

Berikut adalah implementasi pembuatan pasangan **PKCE (`code_verifier` dan `code_challenge` S256)** sesuai standar [RFC 7636](https://www.rfc-editor.org/rfc/rfc7636) beserta verifikasi tanda tangan dan klaim waktu JWT HS256 yang tahan serangan waktu (*timing attack*) menggunakan **`hash_equals()`**:

```php
<?php
declare(strict_types=1);

function base64UrlEncode(string $biner): string
{
    return rtrim(strtr(base64_encode($biner), '+/', '-_'), '=');
}

function base64UrlDecode(string $teks): string
{
    $sisa = strlen($teks) % 4;
    if ($sisa > 0) {
        $teks .= str_repeat('=', 4 - $sisa);
    }
    $hasil = base64_decode(strtr($teks, '-_', '+/'), strict: true);
    if ($hasil === false) {
        throw new InvalidArgumentException('Pengodean Base64URL tidak valid.');
    }
    return $hasil;
}

// 1. Membuat pasangan Code Verifier & Code Challenge (S256) untuk OAuth 2.0 PKCE
function buatPasanganPkce(): array
{
    $verifier  = base64UrlEncode(random_bytes(32));
    $hash      = hash('sha256', $verifier, binary: true);
    $challenge = base64UrlEncode($hash);

    return ['verifier' => $verifier, 'challenge' => $challenge, 'method' => 'S256'];
}

// 2. Memverifikasi JWT HS256 secara ketat sesuai RFC 8725 (Best Current Practices)
function verifikasiJwtHs256(
    string $jwt,
    #[\SensitiveParameter] string $kunciRahasia,
    string $issuerDiharapkan,
    string $audienceDiharapkan,
    ?int $waktuSekarang = null
): array {
    $bagian = explode('.', $jwt);
    if (count($bagian) !== 3) {
        throw new RuntimeException('Format struktur JWT harus memiliki 3 bagian.');
    }
    [$headerB64, $payloadB64, $sigB64] = $bagian;

    $header = json_decode(base64UrlDecode($headerB64), associative: true, flags: JSON_THROW_ON_ERROR);
    // WAJIB mengunci algoritma yang diizinkan (tolak alg: "none" atau algoritma lain!)
    if (($header['alg'] ?? '') !== 'HS256') {
        throw new RuntimeException('Algoritma JWT tidak diizinkan.');
    }

    $sigDiharapkan = hash_hmac('sha256', "{$headerB64}.{$payloadB64}", $kunciRahasia, binary: true);
    $sigDiterima   = base64UrlDecode($sigB64);

    if (!hash_equals($sigDiharapkan, $sigDiterima)) {
        throw new RuntimeException('Tanda tangan JWT tidak valid.');
    }

    $payload  = json_decode(base64UrlDecode($payloadB64), associative: true, flags: JSON_THROW_ON_ERROR);
    $sekarang = $waktuSekarang ?? time();

    if (!isset($payload['exp']) || !is_int($payload['exp']) || $sekarang >= $payload['exp']) {
        throw new RuntimeException('Token JWT telah kedaluwarsa (exp).');
    }
    if (isset($payload['nbf']) && is_int($payload['nbf']) && $sekarang < $payload['nbf']) {
        throw new RuntimeException('Token JWT belum berlaku (nbf).');
    }
    if (($payload['iss'] ?? '') !== $issuerDiharapkan || ($payload['aud'] ?? '') !== $audienceDiharapkan) {
        throw new RuntimeException('Klaim iss atau aud pada JWT tidak cocok.');
    }

    return $payload;
}
```

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Hanya memvalidasi tanda tangan JWT tanpa memeriksa klaim `exp` (Expiration), `iss` (Issuer), dan `aud` (Audience):** Jika layanan Pembayaran dan layanan Forum berbagi penyedia SSO yang sama, tetapi layanan Pembayaran tidak memeriksa apakah `aud === "layanan-pembayaran"`, maka token yang diterbitkan hanya untuk membaca Forum dapat dipakai penyerang untuk mengakses API Pembayaran!
2. **Membandingkan tanda tangan HMAC menggunakan `===` biasa alih-alih `hash_equals()`:** Operator `===` berhenti pada byte pertama yang tidak cocok sehingga membocorkan informasi waktu perbandingan (*timing side-channel*). Selalu gunakan **`hash_equals($diharapkan, $diterima)`**.
3. **Menaruh data sensitif (seperti nomor telepon, alamat rumah, atau hash kata sandi) di dalam payload JWT:** Ingat, JWT standar (JWS) hanya **ditandatangani**, **BUKAN dienkripsi**! Siapa pun yang memegang JWT dapat langsung membaca seluruh isi payload-nya hanya dengan `base64_decode()`.

## Latihan Praktik Mandiri

1. Buat class `LayananTokenJwt` yang menyediakan metode `terbitkanHs256(array $klaim, string $kunciRahasia): string` dan `verifikasiHs256(...)`.
2. Tulis pengujian PHPUnit untuk membuktikan bahwa:
   - token yang sah lolos verifikasi;
   - token yang dimodifikasi header-nya menjadi `{"alg":"none","typ":"JWT"}` ditolak dengan `RuntimeException`;
   - token yang waktu `exp`-nya sudah lewat ditolak dengan `RuntimeException`.

## Kuis Pemahaman

### Soal 1
Mengapa server penerima token JWT **wajib** mengunci daftar algoritma yang diizinkan di sisi server (misalnya memastikan `$header['alg'] === 'HS256'` atau `'RS256'` sesuai jenis kuncinya) dan tidak boleh mempercayai nilai `alg` di dalam header JWT begitu saja?
- A. Karena header JWT selalu dienkripsi dengan AES
- B. Karena jika server mengikuti nilai `alg` dari klien secara buta, penyerang dapat mengirim `alg: "none"` untuk melewati pemeriksaan tanda tangan sama sekali, atau mengubah `RS256` menjadi `HS256` lalu menandatangani token palsu menggunakan kunci publik RSA server sebagai kunci simetris HMAC (*key confusion attack*)
- C. Karena `alg` hanya digunakan oleh peramban Safari
- D. Karena nilai `alg` menentukan waktu kedaluwarsa token

**Jawaban Benar:** B
**Penjelasan:** Sesuai RFC 8725 (JWT Best Current Practices), verifikator tidak boleh membiarkan header token mendikte algoritma atau jenis kunci yang digunakan. Kunci simetris dan asimetris harus dipisahkan secara tegas berdasarkan algoritma yang ditentukan server.

### Soal 2
Dalam alur **OAuth 2.0 Authorization Code dengan PKCE (RFC 7636)** menggunakan metode `S256`, bagaimana cara klien membentuk nilai `code_challenge` dari string acak `code_verifier`?
- A. Membalik urutan huruf `code_verifier` dari belakang ke depan
- B. Menghitung hash biner SHA-256 dari `code_verifier`, lalu mengodekannya dengan **Base64URL tanpa karakter padding `=`** (`rtrim(strtr(base64_encode(hash('sha256', $verifier, true)), '+/', '-_'), '=')`)
- C. Mengenkripsi `code_verifier` menggunakan `md5()`
- D. Mengirim `code_verifier` dalam bentuk teks telanjang di URL

**Jawaban Benar:** B
**Penjelasan:** Spesifikasi RFC 7636 mendefinisikan transformasi `S256` sebagai `BASE64URL-ENCODE(SHA256(ASCII(code_verifier)))` tanpa karakter padding `=`.

### Soal 3
Mengapa autentikasi berbasis **WebAuthn / Passkeys** disebut tahan terhadap serangan situs palsu (*Phishing-Resistant*), berbeda dengan kata sandi atau kode OTP 6 digit?
- A. Karena Passkeys mengharuskan pengguna mengetik 50 karakter setiap kali masuk
- B. Karena peramban dan sistem operasi mengikat pasangan kunci kriptografi Passkey secara ketat ke domain asli situs (**Relying Party ID / `rpId`**); jika pengguna tertipu membuka situs phishing dengan nama domain berbeda, perangkat secara otomatis menolak memberikan tanda tangan kunci tersebut
- C. Karena Passkeys dikirim melalui SMS terenkripsi
- D. Karena Passkeys tidak menggunakan protokol HTTPS

**Jawaban Benar:** B
**Penjelasan:** Pada kata sandi atau OTP SMS, pengguna yang tertipu halaman login palsu (`kodel0ka-login.com`) dapat mengetikkan sandi/OTP-nya kepada penyerang. Pada Passkeys/WebAuthn, pemeriksaan domain (`rpId`) dilakukan oleh peramban/OS secara kriptografis sehingga tidak dapat dikelabui oleh tampilan visual situs palsu.

## Sumber

- [`hash_equals` — PHP Manual](https://www.php.net/manual/en/function.hash-equals.php)
- [RFC 7636: Proof Key for Code Exchange (PKCE) — IETF](https://www.rfc-editor.org/rfc/rfc7636)
- [RFC 8725: JSON Web Token Best Current Practices — IETF](https://www.rfc-editor.org/rfc/rfc8725)
- [Web Authentication (WebAuthn) Level 3 — W3C](https://www.w3.org/TR/webauthn-3/)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
