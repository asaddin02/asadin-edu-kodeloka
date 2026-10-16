# Rekayasa REST API di PHP: Standar JSON (`JSON_THROW_ON_ERROR`), Cursor Pagination, dan Galat RFC 9457

- **Tingkat:** Menengah
- **Ringkasan:** Merancang endpoint API HTTP yang konsisten menggunakan kode status yang tepat, bendera wajib `JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE`, paginasi berbasis kursor (*Keyset/Cursor Pagination*) yang cepat untuk jutaan baris, serta format respons galat standar **RFC 9457 (`application/problem+json`)**.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Menggunakan `LIMIT 20 OFFSET 500000` untuk paginasi halaman ke-25.000 memaksa database membaca dan membuang 500.000 baris terlebih dahulu pada setiap permintaan; gunakan *Keyset/Cursor Pagination* (`WHERE id < :idTerakhir ORDER BY id DESC LIMIT 20`).

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `json_encode($payload, JSON_THROW_ON_ERROR \| JSON_UNESCAPED_UNICODE \| JSON_UNESCAPED_SLASHES);` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

function kirimProblemJson(int $status, string $judul, string $detail, string $tipe = 'about:blank'): never
{
    http_response_code($status);
    header('Content-Type: application/problem+json; charset=utf-8');
    echo json_encode([
        'type'   => $tipe,
        'title'  => $judul,
        'status' => $status,
        'detail' => $detail,
    ], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Menggunakan `LIMIT 20 OFFSET 500000` untuk paginasi halaman ke-25.000 memaksa database membaca dan membuang 500.000 baris terlebih dahulu pada setiap permintaan; gunakan *Keyset/Cursor Pagination* (`WHERE id < :idTerakhir ORDER BY id DESC LIMIT 20`).*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena database harus membaca lalu membuang 500.000 baris terlebih dahulu pada setiap permintaan, sehingga kueri makin lambat dan beban database makin berat seiring halaman yang makin dalam, sedangkan keyset pagination langsung melompat ke posisi terakhir melalui indeks
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Menggunakan `LIMIT 20 OFFSET 500000` untuk paginasi halaman ke-25.000 memaksa database membaca dan membuang 500.000 baris terlebih dahulu pada setiap permintaan; gunakan *Keyset/Cursor Pagination* (`WHERE id < :idTerakhir ORDER BY id DESC LIMIT 20`).

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi `Rekayasa REST API di PHP` ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [`json_encode` — PHP Manual](https://www.php.net/manual/en/function.json-encode.php)
- [JSON constants — PHP Manual](https://www.php.net/manual/en/json.constants.php)
- [RFC 9457: Problem Details for HTTP APIs — IETF](https://www.rfc-editor.org/rfc/rfc9457)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
