# Konkurensi Kooperatif di PHP Modern dengan `Fiber` (`Fiber::suspend`, `start`, `resume`)

- **Tingkat:** Lanjut
- **Ringkasan:** Memahami cara kerja **`Fiber`** (sejak PHP 8.1) sebagai primitif *full-stack interruptible functions* yang memungkinkan kerangka kerja asinkron (seperti Revolt, Amp, ReactPHP, atau FrankenPHP worker) menjeda dan melanjutkan eksekusi fungsi tanpa mengotori tumpukan pemanggilan (*call stack*).

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `$fiber = new Fiber(function (): void { $data = Fiber::suspend('menunggu IO'); });` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Menganggap `Fiber` secara ajaib menjalankan kode PHP secara paralel di banyak inti CPU (*multi-threading*) adalah kesalahpahaman umum; `Fiber` berjalan pada satu thread melalui penjadwalan kooperatif (*cooperative multitasking*) untuk menumpuk waktu tunggu I/O.

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `$fiber = new Fiber(function (): void { $data = Fiber::suspend('menunggu IO'); });` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

$fiber = new Fiber(function (string $url): string {
    echo "1. Mengirim permintaan ke {$url}\n";
    // Menjeda eksekusi fiber dan menyerahkan kendali kembali ke pemanggil
    $responsSimulasi = Fiber::suspend($url);
    echo "3. Menerima respons: {$responsSimulasi}\n";
    return "Selesai memproses {$url}";
});

$urlYangDitangguhkan = $fiber->start('https://api.kodeloka.id/status');
echo "2. Pemanggil utama menangani I/O untuk: {$urlYangDitangguhkan}\n";
$fiber->resume('HTTP 200 OK'); // resume() mengembalikan nilai suspend berikutnya, atau null jika fiber sudah selesai
$hasilAkhir = $fiber->getReturn(); // nilai return fungsi fiber diambil dengan getReturn()
echo "4. Hasil: {$hasilAkhir}\n";
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `$fiber = new Fiber(function (): void { $data = Fiber::suspend('menunggu IO'); });` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Menganggap `Fiber` secara ajaib menjalankan kode PHP secara paralel di banyak inti CPU (*multi-threading*) adalah kesalahpahaman umum; `Fiber` berjalan pada satu thread melalui penjadwalan kooperatif (*cooperative multitasking*) untuk menumpuk waktu tunggu I/O.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena `Fiber` hanya berjalan pada satu thread dengan penjadwalan kooperatif, bukan paralelisme CPU, sehingga kode yang berat secara CPU tetap memblokir semuanya dan asumsi paralel yang keliru menimbulkan bug performa dan keandalan di produksi
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Menganggap `Fiber` secara ajaib menjalankan kode PHP secara paralel di banyak inti CPU (*multi-threading*) adalah kesalahpahaman umum; `Fiber` berjalan pada satu thread melalui penjadwalan kooperatif (*cooperative multitasking*) untuk menumpuk waktu tunggu I/O.

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `$fiber = new Fiber(function (): void { $data = Fiber::suspend('menunggu IO'); });` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `$fiber = new Fiber(function (): void { $data = Fiber::suspend('menunggu IO'); });` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi "Konkurensi Kooperatif di PHP Modern dengan Fiber (Fiber" ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [Fibers — PHP Manual](https://www.php.net/manual/en/language.fibers.php)
- [The Fiber class — PHP Manual](https://www.php.net/manual/en/class.fiber.php)
- [RFC: Fibers — PHP Wiki](https://wiki.php.net/rfc/fibers)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
