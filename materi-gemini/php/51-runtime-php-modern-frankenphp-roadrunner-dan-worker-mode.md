# Runtime PHP Modern di Luar FPM: FrankenPHP, RoadRunner, Swoole, dan Aturan *Worker Mode*

- **Tingkat:** Lanjut
- **Ringkasan:** Memahami cara kerja server aplikasi PHP modern berbasis *worker berumur panjang* (**FrankenPHP** di atas Caddy dan **RoadRunner**) yang menahan kerangka kerja tetap di memori antar-permintaan HTTP hingga berkali-kali lebih cepat, beserta disiplin pencegahan kebocoran *state* antar-pengguna.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `while (frankenphp_handle_request($handlerPermintaan)) { gc_collect_cycles(); }` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Saat menjalankan aplikasi PHP di dalam *Worker Mode* (FrankenPHP / RoadRunner), menyimpan data pengguna yang sedang login di dalam properti `static` atau *Singleton Service* akan membuat pengguna berikutnya melihat data rahasia milik pengguna sebelumnya (*Cross-Request State Leakage*)!

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `while (frankenphp_handle_request($handlerPermintaan)) { gc_collect_cycles(); }` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

// Pola Worker Loop pada FrankenPHP: aplikasi diinisialisasi sekali di luar loop
$kernelAplikasi = new KernelAplikasiProduksi();

$penangan = static function () use ($kernelAplikasi): void {
    $kernelAplikasi->tanganiPermintaanSaatIni($_SERVER, $_GET, $_POST);
};

$maksPermintaan = 1000;
for ($hitung = 0; $hitung < $maksPermintaan; $hitung++) {
    $lanjut = function_exists('frankenphp_handle_request')
        ? frankenphp_handle_request($penangan)
        : false;
    gc_collect_cycles();
    if (!$lanjut) break;
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `while (frankenphp_handle_request($handlerPermintaan)) { gc_collect_cycles(); }` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Saat menjalankan aplikasi PHP di dalam *Worker Mode* (FrankenPHP / RoadRunner), menyimpan data pengguna yang sedang login di dalam properti `static` atau *Singleton Service* akan membuat pengguna berikutnya melihat data rahasia milik pengguna sebelumnya (*Cross-Request State Leakage*)!*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena membuka celah keamanan serius, merusak integritas data/finansial, atau menyebabkan kehabisan memori (*Out of Memory*) di server produksi
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Saat menjalankan aplikasi PHP di dalam *Worker Mode* (FrankenPHP / RoadRunner), menyimpan data pengguna yang sedang login di dalam properti `static` atau *Singleton Service* akan membuat pengguna berikutnya melihat data rahasia milik pengguna sebelumnya (*Cross-Request State Leakage*)!

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `while (frankenphp_handle_request($handlerPermintaan)) { gc_collect_cycles(); }` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `while (frankenphp_handle_request($handlerPermintaan)) { gc_collect_cycles(); }` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi `Runtime PHP Modern di Luar FPM` ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [Worker Mode — FrankenPHP Documentation](https://frankenphp.dev/docs/worker/)
- [RoadRunner Documentation](https://docs.roadrunner.dev/)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
