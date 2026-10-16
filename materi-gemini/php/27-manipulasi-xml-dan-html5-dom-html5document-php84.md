# Pemrosesan HTML5 & XML Modern dengan `Dom\HTMLDocument` (PHP 8.4) dan `XMLReader`

- **Tingkat:** Menengah
- **Ringkasan:** Mengurai, memodifikasi, dan mengekstrak dokumen HTML5 secara akurat sesuai spesifikasi WHATWG menggunakan kelas baru **`Dom\HTMLDocument`** di PHP 8.4 (sebagai pelengkap `DOMDocument` warisan yang berbasis libxml2 dan tetap tersedia), serta membaca berkas XML raksasa secara streaming dengan `XMLReader`.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.4 hingga PHP 8.5, penguasaan `Dom\HTMLDocument::createFromString($html, LIBXML_NOERROR)` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Menggunakan `DOMDocument::loadHTML()` lama pada markup HTML5 modern sering gagal mengenali tag semantik baru, merusak pengodean UTF-8 jika tidak diberi deklarasi meta khusus, dan tidak mendukung selektor CSS sebaik `Dom\HTMLDocument` di PHP 8.4.

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.4–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `Dom\HTMLDocument::createFromString($html, LIBXML_NOERROR)` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

// PHP 8.4+: Parser HTML5 standar WHATWG dengan dukungan querySelectorAll bawaan
$html = '<main><article class="kartu"><h2>Belajar PHP 8.5</h2></article></main>';
$dokumen = Dom\HTMLDocument::createFromString($html, LIBXML_NOERROR);

$judul = $dokumen->querySelector('article.kartu > h2')?->textContent;
echo $judul; // "Belajar PHP 8.5" 
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `Dom\HTMLDocument::createFromString($html, LIBXML_NOERROR)` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Menggunakan `DOMDocument::loadHTML()` lama pada markup HTML5 modern sering gagal mengenali tag semantik baru, merusak pengodean UTF-8 jika tidak diberi deklarasi meta khusus, dan tidak mendukung selektor CSS sebaik `Dom\HTMLDocument` di PHP 8.4.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena parser HTML 4 lama dapat salah mengurai markup HTML5 modern dan merusak pengodean UTF-8, sehingga data yang diekstrak menjadi salah atau rusak
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Menggunakan `DOMDocument::loadHTML()` lama pada markup HTML5 modern sering gagal mengenali tag semantik baru, merusak pengodean UTF-8 jika tidak diberi deklarasi meta khusus, dan tidak mendukung selektor CSS sebaik `Dom\HTMLDocument` di PHP 8.4.

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `Dom\HTMLDocument::createFromString($html, LIBXML_NOERROR)` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `Dom\HTMLDocument::createFromString($html, LIBXML_NOERROR)` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi "Pemrosesan HTML5 & XML Modern dengan Dom\HTMLDocument (PHP 8.4) dan XMLReader" ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [DOM — PHP Manual](https://www.php.net/manual/en/book.dom.php)
- [The Dom\HTMLDocument class — PHP Manual](https://www.php.net/manual/en/class.dom-htmldocument.php)
- [XMLReader — PHP Manual](https://www.php.net/manual/en/book.xmlreader.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
