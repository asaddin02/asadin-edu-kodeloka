# Pekerja Latar Belakang (*Background Workers*), Antrean Tugas (*Job Queue*), dan Penanganan Sinyal POSIX (`pcntl`)

- **Tingkat:** Lanjut
- **Ringkasan:** Memindahkan tugas berat (pengiriman email massal, pembuatan laporan PDF, pemrosesan video) dari siklus permintaan HTTP ke **Worker CLI** di latar belakang, menerapkan penghentian anggun (*graceful shutdown*) saat menerima sinyal `SIGTERM`/`SIGINT` dengan `pcntl_async_signals()`, serta mencegah kebocoran memori worker berumur panjang.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `pcntl_async_signals(true); pcntl_signal(SIGTERM, function () use (&$berhenti) { $berhenti = true; });` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Menghentikan paksa proses worker antrean dengan `kill -9` (`SIGKILL`) saat worker sedang berada di tengah transaksi pembayaran akan meninggalkan data dalam keadaan menggantung; tangkap sinyal `SIGTERM` agar worker menyelesaikan 1 tugas terakhirnya lalu keluar dengan bersih.

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `pcntl_async_signals(true); pcntl_signal(SIGTERM, function () use (&$berhenti) { $berhenti = true; });` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

$harusBerhenti = false;
if (function_exists('pcntl_async_signals')) {
    pcntl_async_signals(true);
    $penanganSinyal = static function () use (&$harusBerhenti): void {
        $harusBerhenti = true;
    };
    pcntl_signal(SIGTERM, $penanganSinyal);
    pcntl_signal(SIGINT, $penanganSinyal);
}

while (!$harusBerhenti) {
    $tugas = ambilTugasBerikutnyaDariAntrean();
    if ($tugas === null) {
        sleep(1);
        continue;
    }
    prosesTugas($tugas);
    gc_collect_cycles();
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `pcntl_async_signals(true); pcntl_signal(SIGTERM, function () use (&$berhenti) { $berhenti = true; });` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Menghentikan paksa proses worker antrean dengan `kill -9` (`SIGKILL`) saat worker sedang berada di tengah transaksi pembayaran akan meninggalkan data dalam keadaan menggantung; tangkap sinyal `SIGTERM` agar worker menyelesaikan 1 tugas terakhirnya lalu keluar dengan bersih.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena membuka celah keamanan serius, merusak integritas data/finansial, atau menyebabkan kehabisan memori (*Out of Memory*) di server produksi
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Menghentikan paksa proses worker antrean dengan `kill -9` (`SIGKILL`) saat worker sedang berada di tengah transaksi pembayaran akan meninggalkan data dalam keadaan menggantung; tangkap sinyal `SIGTERM` agar worker menyelesaikan 1 tugas terakhirnya lalu keluar dengan bersih.

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `pcntl_async_signals(true); pcntl_signal(SIGTERM, function () use (&$berhenti) { $berhenti = true; });` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `pcntl_async_signals(true); pcntl_signal(SIGTERM, function () use (&$berhenti) { $berhenti = true; });` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi "Pekerja Latar Belakang (*Background Workers*), Antrean Tugas (*Job Queue*), dan Penanganan Sinyal POSIX (pcntl)" ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [`pcntl_async_signals` — PHP Manual](https://www.php.net/manual/en/function.pcntl-async-signals.php)
- [`pcntl_signal` — PHP Manual](https://www.php.net/manual/en/function.pcntl-signal.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
