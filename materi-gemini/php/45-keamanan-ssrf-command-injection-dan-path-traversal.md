# Keamanan Backend Lanjutan: Pencegahan SSRF, OS Command Injection (`escapeshellarg`), dan Path Traversal

- **Tingkat:** Lanjut
- **Ringkasan:** Menangkal tiga kerentanan kritis di sisi server: **Server-Side Request Forgery (SSRF)** saat mengambil URL dari pengguna, **OS Command Injection** pada pemanggilan `proc_open`/`exec`, serta **Path Traversal (`../`)** menggunakan `realpath()` dan perbandingan direktori dasar.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `$jalurNyata = realpath($direktoriDasar . '/' . basename($namaBerkas));` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Memanggil fungsi cURL atau `file_get_contents($urlDariPengguna)` tanpa memblokir rentang IP privat/loopback (`127.0.0.1`, `10.0.0.0/8`, `169.254.169.254` metadata cloud AWS/GCP) memungkinkan penyerang memindai jaringan internal server Anda melalui celah **SSRF**.

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `$jalurNyata = realpath($direktoriDasar . '/' . basename($namaBerkas));` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

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
    if ($daftarIp === false) return false;

    foreach ($daftarIp as $ip) {
        // Tolak IP privat (10.x, 192.168.x, 172.16-31.x) dan reserved/loopback (127.x, 169.254.x)
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) === false) {
            return false;
        }
    }
    return true;
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `$jalurNyata = realpath($direktoriDasar . '/' . basename($namaBerkas));` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Memanggil fungsi cURL atau `file_get_contents($urlDariPengguna)` tanpa memblokir rentang IP privat/loopback (`127.0.0.1`, `10.0.0.0/8`, `169.254.169.254` metadata cloud AWS/GCP) memungkinkan penyerang memindai jaringan internal server Anda melalui celah **SSRF**.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena membuka celah keamanan serius, merusak integritas data/finansial, atau menyebabkan kehabisan memori (*Out of Memory*) di server produksi
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Memanggil fungsi cURL atau `file_get_contents($urlDariPengguna)` tanpa memblokir rentang IP privat/loopback (`127.0.0.1`, `10.0.0.0/8`, `169.254.169.254` metadata cloud AWS/GCP) memungkinkan penyerang memindai jaringan internal server Anda melalui celah **SSRF**.

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `$jalurNyata = realpath($direktoriDasar . '/' . basename($namaBerkas));` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `$jalurNyata = realpath($direktoriDasar . '/' . basename($namaBerkas));` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi `Keamanan Backend Lanjutan` ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [Server-Side Request Forgery Prevention Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OS Command Injection Defense Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)
- [`escapeshellarg` — PHP Manual](https://www.php.net/manual/en/function.escapeshellarg.php)
- [`realpath` — PHP Manual](https://www.php.net/manual/en/function.realpath.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
