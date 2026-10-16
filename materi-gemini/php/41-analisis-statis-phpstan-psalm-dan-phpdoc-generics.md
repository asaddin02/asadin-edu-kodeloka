# Analisis Statis Tingkat Lanjut (PHPStan / Psalm) dan Anotasi PHPDoc Generics (`@template`, `array<string, int>`)

- **Tingkat:** Lanjut
- **Ringkasan:** Menemukan bug tipe data, potensi pemanggilan metode pada `null`, dan ketidakcocokan bentuk array tanpa perlu menjalankan satu baris kode pun menggunakan **PHPStan (Level 8–10)** serta anotasi tipe generik PHPDoc (`@template T`, `@param list<T>`, `array{id: positive-int, nama: non-empty-string}`).

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `/** @template T of object \n @param class-string<T> $namaKelas \n @return T */` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Deklarasi tipe bawaan PHP `array` tidak memberi tahu isi elemen di dalamnya; tanpa anotasi `@param array<int, Produk>` dan analisis statis PHPStan, bug salah ketik kunci array baru akan meledak saat kode sudah berjalan di produksi.

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `/** @template T of object \n @param class-string<T> $namaKelas \n @return T */` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

/**
 * @template TItem
 */
final class KoleksiTerukur
{
    /** @var list<TItem> */
    private array $item = [];

    /** @param TItem $elemen */
    public function tambah(mixed $elemen): void
    {
        $this->item[] = $elemen;
    }

    /** @return list<TItem> */
    public function semua(): array
    {
        return $this->item;
    }
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `/** @template T of object \n @param class-string<T> $namaKelas \n @return T */` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Deklarasi tipe bawaan PHP `array` tidak memberi tahu isi elemen di dalamnya; tanpa anotasi `@param array<int, Produk>` dan analisis statis PHPStan, bug salah ketik kunci array baru akan meledak saat kode sudah berjalan di produksi.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena kesalahan tipe isi array (misalnya salah ketik kunci) baru ketahuan ketika kode sudah berjalan di produksi dan menimbulkan galat, padahal analisis statis dapat menangkapnya lebih awal tanpa menjalankan kode
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Deklarasi tipe bawaan PHP `array` tidak memberi tahu isi elemen di dalamnya; tanpa anotasi `@param array<int, Produk>` dan analisis statis PHPStan, bug salah ketik kunci array baru akan meledak saat kode sudah berjalan di produksi.

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `/** @template T of object \n @param class-string<T> $namaKelas \n @return T */` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `/** @template T of object \n @param class-string<T> $namaKelas \n @return T */` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi "Analisis Statis Tingkat Lanjut (PHPStan / Psalm) dan Anotasi PHPDoc Generics (@template, array<string, int>)" ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [Getting Started — PHPStan](https://phpstan.org/user-guide/getting-started)
- [PHPDocs Basics and PHPDoc Types — PHPStan](https://phpstan.org/writing-php-code/phpdoc-types)
- [Psalm Documentation](https://psalm.dev/docs/)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
