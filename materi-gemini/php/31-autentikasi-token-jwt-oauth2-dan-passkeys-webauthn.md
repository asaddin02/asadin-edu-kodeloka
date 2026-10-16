# Autentikasi Modern: Sesi vs Token (JWT/PASETO), Alur OAuth 2.0 / OIDC (PKCE), dan Dasar Passkeys

- **Tingkat:** Lanjut
- **Ringkasan:** Membandingkan kapan harus menggunakan *Stateful Session Cookie* versus *Stateless Token (JWT)*, menerapkan validasi tanda tangan dan klaim JWT (`exp`, `iss`, `aud`) secara ketat, memahami alur **OAuth 2.0 Authorization Code + PKCE**, serta pengantar autentikasi tahan phishing dengan WebAuthn / Passkeys.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `hash_equals($signatureDiharapkan, $signatureDiterima)` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Mempercayai header `alg` di dalam payload JWT yang dikirim klien tanpa mengunci algoritma yang diizinkan di sisi server membuka celah klasik `alg: none` atau kebingungan kunci RS256 vs HS256 yang memungkinkan penyerang memalsukan token admin.

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `hash_equals($signatureDiharapkan, $signatureDiterima)` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

// Membuat pasangan Code Verifier & Code Challenge (S256) untuk OAuth 2.0 PKCE
function buatPasanganPkce(): array
{
    $verifier = rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
    $hash     = hash('sha256', $verifier, binary: true);
    $challenge = rtrim(strtr(base64_encode($hash), '+/', '-_'), '=');

    return ['verifier' => $verifier, 'challenge' => $challenge, 'method' => 'S256'];
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `hash_equals($signatureDiharapkan, $signatureDiterima)` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Mempercayai header `alg` di dalam payload JWT yang dikirim klien tanpa mengunci algoritma yang diizinkan di sisi server membuka celah klasik `alg: none` atau kebingungan kunci RS256 vs HS256 yang memungkinkan penyerang memalsukan token admin.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena membuka celah keamanan serius, merusak integritas data/finansial, atau menyebabkan kehabisan memori (*Out of Memory*) di server produksi
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Mempercayai header `alg` di dalam payload JWT yang dikirim klien tanpa mengunci algoritma yang diizinkan di sisi server membuka celah klasik `alg: none` atau kebingungan kunci RS256 vs HS256 yang memungkinkan penyerang memalsukan token admin.

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `hash_equals($signatureDiharapkan, $signatureDiterima)` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `hash_equals($signatureDiharapkan, $signatureDiterima)` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi `Autentikasi Modern` ke dalam arsitektur aplikasi?
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
