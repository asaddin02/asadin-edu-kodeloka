# Pengiriman Email Transaksional yang Aman, Pencegahan Header Injection, dan Autentikasi SPF/DKIM/DMARC

- **Tingkat:** Menengah
- **Ringkasan:** Mengirim email verifikasi dan notifikasi melalui protokol SMTP dengan TLS, mencegah serangan **Email Header Injection** pada subjek dan alamat tujuan, merancang template email multipart (`text/plain` + `text/html`), serta memahami peran DNS **SPF, DKIM, dan DMARC**.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `str_replace(["\r", "\n"], '', $subjekEmail)` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Menyisipkan input pengguna langsung ke argumen `$additional_headers` pada fungsi `mail()` tanpa menyaring karakter baris baru (`\r\n` / CRLF) memungkinkan penyerang menyuntikkan header `Bcc:` ke ribuan alamat target spam (*Email Header Injection*).

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `str_replace(["\r", "\n"], '', $subjekEmail)` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

function sanitasiHeaderEmail(string $nilai): string
{
    // Hapus seluruh karakter kontrol CR, LF, dan byte NUL untuk mencegah Header Injection
    return preg_replace('/[\r\n\0]+/', '', trim($nilai)) ?? '';
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `str_replace(["\r", "\n"], '', $subjekEmail)` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Menyisipkan input pengguna langsung ke argumen `$additional_headers` pada fungsi `mail()` tanpa menyaring karakter baris baru (`\r\n` / CRLF) memungkinkan penyerang menyuntikkan header `Bcc:` ke ribuan alamat target spam (*Email Header Injection*).*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena membuka celah keamanan serius, merusak integritas data/finansial, atau menyebabkan kehabisan memori (*Out of Memory*) di server produksi
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Menyisipkan input pengguna langsung ke argumen `$additional_headers` pada fungsi `mail()` tanpa menyaring karakter baris baru (`\r\n` / CRLF) memungkinkan penyerang menyuntikkan header `Bcc:` ke ribuan alamat target spam (*Email Header Injection*).

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `str_replace(["\r", "\n"], '', $subjekEmail)` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `str_replace(["\r", "\n"], '', $subjekEmail)` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi `Pengiriman Email Transaksional yang Aman, Pencegahan Header Injection, dan Autentikasi SPF/DKIM/DMARC` ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [`mail` — PHP Manual](https://www.php.net/manual/en/function.mail.php)
- [RFC 7208: Sender Policy Framework (SPF) — IETF](https://www.rfc-editor.org/rfc/rfc7208)
- [RFC 6376: DomainKeys Identified Mail (DKIM) Signatures — IETF](https://www.rfc-editor.org/rfc/rfc6376)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
