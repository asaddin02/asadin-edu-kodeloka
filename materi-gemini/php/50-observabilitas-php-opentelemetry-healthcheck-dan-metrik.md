# Observabilitas Aplikasi PHP: Pelacakan Terdistribusi (`X-Request-Id` / W3C `traceparent`), Health Check, dan Profiling

- **Tingkat:** Lanjut
- **Ringkasan:** Menyematkan *Correlation ID* / header standar W3C **`traceparent`** di setiap log dan panggilan cURL keluar agar perjalanan sebuah permintaan dapat dilacak lintas layanan, merancang endpoint `/healthz` (*liveness*) dan `/readyz` (*readiness*), serta mendiagnosis leher botol CPU dengan profiler.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `$idKorelasi = $_SERVER['HTTP_X_REQUEST_ID'] ?? bin2hex(random_bytes(16));` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Mengecek koneksi database, Redis, dan API pihak ketiga di dalam endpoint *Liveness Probe* (`/healthz`) Kubernetes akan membuat Kubernetes me-restart container PHP Anda berulang kali ketika layanan pihak ketiga sedang mengalami gangguan sementara; pisahkan *Liveness* dari *Readiness* (`/readyz`).

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `$idKorelasi = $_SERVER['HTTP_X_REQUEST_ID'] ?? bin2hex(random_bytes(16));` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

function periksaKesiapanLayanan(PDO $pdo, Redis $redis): array
{
    $status = ['database' => false, 'cache' => false];
    try {
        $pdo->query('SELECT 1');
        $status['database'] = true;
    } catch (Throwable) {}

    try {
        $status['cache'] = ($redis->ping() !== false);
    } catch (Throwable) {}

    return $status;
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `$idKorelasi = $_SERVER['HTTP_X_REQUEST_ID'] ?? bin2hex(random_bytes(16));` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Mengecek koneksi database, Redis, dan API pihak ketiga di dalam endpoint *Liveness Probe* (`/healthz`) Kubernetes akan membuat Kubernetes me-restart container PHP Anda berulang kali ketika layanan pihak ketiga sedang mengalami gangguan sementara; pisahkan *Liveness* dari *Readiness* (`/readyz`).*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena gangguan sementara pada dependensi eksternal membuat probe liveness gagal sehingga Kubernetes me-restart container berulang kali tanpa memperbaiki masalah, yang justru memperburuk gangguan
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Mengecek koneksi database, Redis, dan API pihak ketiga di dalam endpoint *Liveness Probe* (`/healthz`) Kubernetes akan membuat Kubernetes me-restart container PHP Anda berulang kali ketika layanan pihak ketiga sedang mengalami gangguan sementara; pisahkan *Liveness* dari *Readiness* (`/readyz`).

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `$idKorelasi = $_SERVER['HTTP_X_REQUEST_ID'] ?? bin2hex(random_bytes(16));` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `$idKorelasi = $_SERVER['HTTP_X_REQUEST_ID'] ?? bin2hex(random_bytes(16));` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi `Observabilitas Aplikasi PHP` ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [Trace Context — W3C Recommendation](https://www.w3.org/TR/trace-context/)
- [Liveness, Readiness and Startup Probes — Kubernetes Documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
- [OpenTelemetry PHP — OpenTelemetry Documentation](https://opentelemetry.io/docs/languages/php/)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
