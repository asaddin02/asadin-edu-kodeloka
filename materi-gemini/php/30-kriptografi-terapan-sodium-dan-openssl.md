# Kriptografi Terapan di PHP: Ekstensi `Sodium` (`libsodium`), Enkripsi Autentik, dan Tanda Tangan Digital

- **Tingkat:** Lanjut
- **Ringkasan:** Menggunakan pustaka kriptografi modern **`ext-sodium`** (bawaan inti PHP) untuk mengenkripsi data rahasia dengan **Authenticated Encryption (`sodium_crypto_secretbox`, berbasis XSalsa20-Poly1305)**, menandatangani dokumen dengan Ed25519 (`sodium_crypto_sign`), serta menghapus kunci sensitif dari RAM dengan `sodium_memzero()`.

## Mengapa PHP Menyertakan `ext-sodium` (`libsodium`) Secara Bawaan Sejak PHP 7.2+?

Menggunakan fungsi kriptografi tingkat rendah seperti `openssl_encrypt()` menuntut pengembang memilih sendiri mode blok (ECB, CBC, CTR, atau GCM), mengelola *padding*, menghitung HMAC secara terpisah (*Encrypt-then-MAC*), dan memvalidasinya dalam waktu konstan. Satu kesalahan kecil—seperti memilih mode `AES-CBC` tanpa HMAC—langsung membuka celah **Padding Oracle Attack** yang memungkinkan penyerang mendekripsi seluruh data rahasia tanpa mengetahui kunci!

Untuk menghilangkan jebakan konfigurasi tersebut, PHP menyertakan ekstensi **`Sodium` (`libsodium`)** di inti bahasa. Setiap fungsi di dalam `Sodium` dirancang berprinsip *"aman secara bawaan"*: enkripsi simetrisnya selalu menggunakan **Authenticated Encryption** (menggabungkan penyandian dan kode autentikasi pesan Poly1305 dalam satu langkah tak terpisahkan).

> **🚫 Kerentanan & Kesalahan Umum:** Menggunakan mode enkripsi blok lawas seperti AES-ECB atau AES-CBC tanpa kode autentikasi pesan (MAC / HMAC) membuat ciphertext rentan terhadap serangan *Padding Oracle* dan manipulasi bit; gunakan enkripsi terautentikasi (*authenticated encryption*) seperti `sodium_crypto_secretbox`.

## 1. Peta Fungsi Utama Ekstensi `Sodium` di PHP Modern

Berikut adalah primitif kriptografi tingkat tinggi yang disediakan oleh `ext-sodium`:

| Fungsi `Sodium` | Algoritma di Balik Layar | Kegunaan Utama di Produksi |
| :--- | :--- | :--- |
| **`sodium_crypto_secretbox($pesan, $nonce, $kunci)`** | **XSalsa20** (enkripsi) + **Poly1305** (MAC 16-byte). | Enkripsi kunci simetris terautentikasi untuk menyimpan nomor NIK, token API pihak ketiga, atau data sensitif di database. |
| **`sodium_crypto_aead_xchacha20poly1305_ietf_encrypt(...)`** | **XChaCha20-Poly1305** dengan *Additional Data* (AEAD). | Mengenkripsi payload sambil mengikat metadata tidak terenkripsi (seperti `id_pengguna` atau `id_baris`) agar ciphertext tidak bisa dipindah ke akun pengguna lain! |
| **`sodium_crypto_sign_detached($pesan, $kunciPrivat)`** | Kurva Eliptik **Ed25519** (Tanda tangan digital 64-byte). | Menandatangani lisensi perangkat lunak, webhook keluar, atau dokumen resmi dengan kunci asimetris (diverifikasi dengan kunci publik). |
| **`sodium_memzero($variabelString)`** | Penghapusan byte memori langsung. | Menimpa isi string kunci rahasia atau plaintext sensitif di RAM dengan byte nol begitu selesai digunakan. |
| **`#[\SensitiveParameter]`** (Atribut PHP 8.2+) | Penyensoran parameter di *Stack Trace*. | Mengganti nilai argumen kunci/sandi dengan `Object(SensitiveParameterValue)` jika terjadi eksepsi agar kunci tidak bocor ke berkas log! |

## 2. Enkripsi dan Dekripsi Terautentikasi dengan `sodium_crypto_secretbox`

Pada `sodium_crypto_secretbox`, kunci rahasia wajib berukuran tepat **`SODIUM_CRYPTO_SECRETBOX_KEYBYTES` (32 byte / 256 bit)** yang dibuat satu kali dengan `sodium_crypto_secretbox_keygen()`, dan setiap kali Anda mengenkripsi pesan, Anda wajib membangkitkan `$nonce` baru berukuran **`SODIUM_CRYPTO_SECRETBOX_NONCEBYTES` (24 byte)** menggunakan `random_bytes()`. Karena `nonce` berukuran 24 byte (192 bit), kemungkinan tabrakan nonce acak hampir nol. Simpan `$nonce` bergandengan di depan `$cipher`:

```php
<?php
declare(strict_types=1);

function enkripsiRahasia(
    #[\SensitiveParameter] string $plaintext,
    #[\SensitiveParameter] string $kunci32Byte
): string {
    if (strlen($kunci32Byte) !== SODIUM_CRYPTO_SECRETBOX_KEYBYTES) {
        throw new InvalidArgumentException('Kunci wajib tepat 32 byte.');
    }
    $nonce  = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
    $cipher = sodium_crypto_secretbox($plaintext, $nonce, $kunci32Byte);
    return sodium_bin2base64($nonce . $cipher, SODIUM_BASE64_VARIANT_ORIGINAL);
}

function dekripsiRahasia(
    string $paketBase64,
    #[\SensitiveParameter] string $kunci32Byte
): string {
    $mentah = sodium_base642bin($paketBase64, SODIUM_BASE64_VARIANT_ORIGINAL);
    $panjangMin = SODIUM_CRYPTO_SECRETBOX_NONCEBYTES + SODIUM_CRYPTO_SECRETBOX_MACBYTES;
    if (strlen($mentah) < $panjangMin) {
        throw new RuntimeException('Payload terenkripsi terlalu pendek atau rusak.');
    }

    $nonce  = substr($mentah, 0, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
    $cipher = substr($mentah, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
    $plain  = sodium_crypto_secretbox_open($cipher, $nonce, $kunci32Byte);
    if ($plain === false) {
        throw new RuntimeException('Verifikasi integritas kriptografi gagal.');
    }
    return $plain;
}
```

## 3. Mengikat Konteks Baris Database dengan AEAD (`XChaCha20-Poly1305`) dan Tanda Tangan `Ed25519`

Bagaimana jika penyerang yang memiliki akses ke tabel database menyalin kolom `nomor_rekening_terenkripsi` milik Admin lalu menempelkannya ke baris miliknya sendiri? Karena keduanya dienkripsi dengan kunci aplikasi yang sama, `secretbox_open` biasa tetap berhasil mendekripsinya!

Untuk mencegah serangan pemindahan konteks (*ciphertext transplant*) tersebut, gunakan **AEAD (*Authenticated Encryption with Associated Data*)** `sodium_crypto_aead_xchacha20poly1305_ietf_encrypt()` dan masukkan `"user_id:{$idPengguna}"` sebagai argumen **`$additional_data`**. Data tambahan ini tidak ikut dienkripsi, tetapi ikut dihitung dalam segel autentikasi Poly1305 sehingga jika *ciphertext* dipindahkan ke `user_id` lain, dekripsi langsung ditolak!

```php
<?php
declare(strict_types=1);

// Tanda tangan digital asimetris Ed25519 (Kunci Privat menandatangani, Kunci Publik memverifikasi)
function contohTandaTanganEd25519(string $pesanDokumen): bool
{
    $pasanganKunci = sodium_crypto_sign_keypair();
    $kunciPrivat   = sodium_crypto_sign_secretkey($pasanganKunci);
    $kunciPublik   = sodium_crypto_sign_publickey($pasanganKunci);

    $signature = sodium_crypto_sign_detached($pesanDokumen, $kunciPrivat);
    // Hapus kunci privat dari RAM segera setelah selesai menandatangani
    sodium_memzero($kunciPrivat);

    return sodium_crypto_sign_verify_detached($signature, $pesanDokumen, $kunciPublik);
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan `strlen()` yang dipengaruhi `mbstring.func_overload` lama atau memotong string biner dengan `mb_substr()`:** Operasi kriptografi bekerja pada **byte biner mentah**, bukan karakter teks UTF-8! Gunakan selalu `substr()` dan `strlen()` (bukan `mb_substr()` yang dapat merusak byte biner ber-bit tinggi karena dikira karakter UTF-8!).
2. **Menyimpan kunci 32-byte mentah di berkas `.env` tanpa pengodean Hex/Base64:** Berkas `.env` adalah berkas teks; simpan kunci di `.env` dalam bentuk heksadesimal (`sodium_bin2hex($kunci)`) lalu dekode kembali saat dibaca di PHP menggunakan `sodium_hex2bin($envKey)`.
3. **Lupa memasang atribut `#[\SensitiveParameter]` pada fungsi yang menerima kunci kriptografi atau kata sandi:** Tanpa `#[\SensitiveParameter]`, jika terjadi *Uncaught Exception* di dalam fungsi tersebut, PHP dapat mencetak potongan string argumen kunci mentah ke dalam berkas *stack trace* log server Anda.

## Latihan Praktik Mandiri

1. Buat class `BrankasDataSodium` yang menerima kunci 32-byte (dengan `#[\SensitiveParameter]`) dan menyediakan metode `segelData(string $plain, string $konteksId)` serta `bukaData(string $paket, string $konteksId)` menggunakan `sodium_crypto_aead_xchacha20poly1305_ietf_encrypt` dan `decrypt`.
2. Tulis pengujian PHPUnit untuk memastikan:
   - data berhasil didekripsi jika `$konteksId` sama;
   - eksepsi dilempar jika 1 karakter pada `$paket` diubah atau jika `$konteksId` diganti dari `"user:1"` menjadi `"user:2"`.

## Kuis Pemahaman

### Soal 1
Mengapa penggunaan `sodium_crypto_secretbox()` (XSalsa20-Poly1305) jauh lebih aman dibandingkan menggunakan mode enkripsi blok `AES-CBC` biasa tanpa HMAC?
- A. Karena `sodium_crypto_secretbox()` tidak membutuhkan kunci rahasia
- B. Karena `sodium_crypto_secretbox()` menerapkan **Authenticated Encryption** yang menyertakan kode autentikasi pesan (MAC Poly1305 16-byte) secara otomatis; jika *ciphertext* dimodifikasi 1 bit saja oleh penyerang, `sodium_crypto_secretbox_open()` langsung mengembalikan `false` dan menangkal serangan *Padding Oracle*
- C. Karena `AES-CBC` hanya bisa mengenkripsi angka bulat
- D. Karena `sodium_crypto_secretbox()` menyimpan kunci di dalam *ciphertext*

**Jawaban Benar:** B
**Penjelasan:** Enkripsi tanpa autentikasi integritas (seperti AES-CBC mentah) memungkinkan penyerang memodifikasi bit *ciphertext* dan mengamati pesan galat padding server untuk menebak *plaintext* byte demi byte.

### Soal 2
Apa fungsi dari atribut `#[\SensitiveParameter]` (tersedia sejak PHP 8.2) ketika dipasang di depan parameter `$kunciRahasia` atau `$kataSandi` pada sebuah fungsi?
- A. Mengenkripsi nilai parameter secara otomatis menggunakan algoritma SHA-256
- B. Menyensor nilai argumen parameter tersebut menjadi `Object(SensitiveParameterValue)` di dalam jejak tumpukan panggilan (*stack trace*) dan laporan log apabila terjadi eksepsi atau galat di dalam fungsi
- C. Membuat parameter hanya bisa diisi dari baris perintah CLI
- D. Menghapus variabel dari database secara otomatis

**Jawaban Benar:** B
**Penjelasan:** Secara bawaan, *stack trace* eksepsi PHP dapat mencantumkan nilai argumen yang dikirim ke fungsi. `#[\SensitiveParameter]` membungkus nilai sensitif tersebut agar tidak pernah tercetak ke dalam log galat maupun tampilan debug.

### Soal 3
Dalam penggunaan fungsi AEAD `sodium_crypto_aead_xchacha20poly1305_ietf_encrypt($pesan, $additionalData, $nonce, $kunci)`, apakah peran dari parameter `$additionalData` (misalnya diisi `"user_id:42"`)?
- A. Mengganti kata sandi pengguna menjadi `"user_id:42"`
- B. Mengikat data konteks tambahan yang tidak ikut dienkripsi ke dalam perhitungan tag autentikasi Poly1305, sehingga *ciphertext* hanya dapat didekripsi kembali apabila pemanggil menyertakan `$additionalData` (`"user_id:42"`) yang sama persis
- C. Menentukan panjang kunci enkripsi
- D. Menyimpan catatan komentar yang diabaikan saat dekripsi

**Jawaban Benar:** B
**Penjelasan:** *Additional Authenticated Data* (AAD) pada skema AEAD mengikat *ciphertext* ke konteks tertentu (seperti ID baris atau ID pemilik data) sehingga penyerang tidak dapat menukar *ciphertext* antar-baris di dalam tabel database.

## Sumber

- [Sodium — PHP Manual](https://www.php.net/manual/en/book.sodium.php)
- [`sodium_crypto_secretbox` — PHP Manual](https://www.php.net/manual/en/function.sodium-crypto-secretbox.php)
- [OpenSSL — PHP Manual](https://www.php.net/manual/en/book.openssl.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
