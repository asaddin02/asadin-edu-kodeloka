# Kriptografi Terapan di PHP: Ekstensi `Sodium` (`libsodium`), Enkripsi Autentik, dan Tanda Tangan Digital

- **Tingkat:** Lanjut
- **Ringkasan:** Menggunakan pustaka kriptografi modern **`ext-sodium`** (bawaan inti PHP) untuk mengenkripsi data rahasia dengan **Authenticated Encryption (`sodium_crypto_secretbox` / AES-256-GCM)**, menandatangani dokumen dengan Ed25519 (`sodium_crypto_sign`), serta menghapus kunci sensitif dari RAM dengan `sodium_memzero()`.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `sodium_crypto_secretbox($pesan, $nonce, $kunciRahasia);` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Menggunakan mode enkripsi blok lawas seperti AES-ECB atau AES-CBC tanpa kode autentikasi pesan (MAC / HMAC) membuat ciphertext rentan terhadap serangan *Padding Oracle* dan manipulasi bit; gunakan enkripsi terautentikasi (AEAD) seperti `sodium_crypto_secretbox`.

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `sodium_crypto_secretbox($pesan, $nonce, $kunciRahasia);` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

function enkripsiRahasia(#[\SensitiveParameter] string $plaintext, #[\SensitiveParameter] string $kunci32Byte): string
{
    $nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
    $cipher = sodium_crypto_secretbox($plaintext, $nonce, $kunci32Byte);
    return base64_encode($nonce . $cipher);
}

function dekripsiRahasia(string $paketBase64, #[\SensitiveParameter] string $kunci32Byte): string
{
    $mentah = base64_decode($paketBase64, strict: true);
    if ($mentah === false || strlen($mentah) < SODIUM_CRYPTO_SECRETBOX_NONCEBYTES + SODIUM_CRYPTO_SECRETBOX_MACBYTES) {
        throw new RuntimeException('Payload terenkripsi tidak valid.');
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

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `sodium_crypto_secretbox($pesan, $nonce, $kunciRahasia);` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Menggunakan mode enkripsi blok lawas seperti AES-ECB atau AES-CBC tanpa kode autentikasi pesan (MAC / HMAC) membuat ciphertext rentan terhadap serangan *Padding Oracle* dan manipulasi bit; gunakan enkripsi terautentikasi (AEAD) seperti `sodium_crypto_secretbox`.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena membuka celah keamanan serius, merusak integritas data/finansial, atau menyebabkan kehabisan memori (*Out of Memory*) di server produksi
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Menggunakan mode enkripsi blok lawas seperti AES-ECB atau AES-CBC tanpa kode autentikasi pesan (MAC / HMAC) membuat ciphertext rentan terhadap serangan *Padding Oracle* dan manipulasi bit; gunakan enkripsi terautentikasi (AEAD) seperti `sodium_crypto_secretbox`.

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `sodium_crypto_secretbox($pesan, $nonce, $kunciRahasia);` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `sodium_crypto_secretbox($pesan, $nonce, $kunciRahasia);` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi `Kriptografi Terapan di PHP` ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [PHP Manual — Language Reference & Extensions](https://www.php.net/manual/en/langref.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
