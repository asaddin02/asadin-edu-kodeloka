# Strategi Caching Terdistribusi (PSR-16 SimpleCache & Redis), Invalidation, dan Pencegahan *Cache Stampede*

- **Tingkat:** Lanjut
- **Ringkasan:** Merancang lapisan cache berkinerja tinggi di atas Redis/Valkey atau APCu sesuai antarmuka **PSR-16 (`CacheInterface`)**, memilih TTL yang tepat, membatalkan cache berbasis tag/versi, serta mencegah **Cache Stampede (Dog-Piling)** saat kunci populer kedaluwarsa bersamaan.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `if (!$redis->set($kunciLock, '1', ['NX', 'EX' => 5])) { /* tunggu atau sajikan data basi */ }` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Ketika sebuah kunci cache di beranda yang diakses 5.000 pengguna per detik kedaluwarsa tepat pada detik yang sama, seluruh 5.000 worker PHP akan menghantam database secara serentak (*Cache Stampede*) untuk menghitung ulang kueri yang sama dan menumbangkan server database.

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `if (!$redis->set($kunciLock, '1', ['NX', 'EX' => 5])) { /* tunggu atau sajikan data basi */ }` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

function ambilDenganKunciMuteks(Redis $redis, string $kunci, int $ttlDetik, callable $pembangkitData): mixed
{
    $tercache = $redis->get($kunci);
    if ($tercache !== false) {
        return json_decode((string) $tercache, associative: true, flags: JSON_THROW_ON_ERROR);
    }
    $kunciLock = "lock:{$kunci}";
    // Hanya 1 proses yang berhasil memperoleh kunci NX selama 5 detik
    if ($redis->set($kunciLock, '1', ['NX', 'EX' => 5])) {
        try {
            $dataBaru = $pembangkitData();
            $redis->setex($kunci, $ttlDetik, json_encode($dataBaru, JSON_THROW_ON_ERROR));
            return $dataBaru;
        } finally {
            $redis->del($kunciLock);
        }
    }
    usleep(100_000); // Tunggu 100ms lalu coba baca kembali dari cache
    $tercache = $redis->get($kunci);
    if ($tercache !== false) {
        return json_decode((string) $tercache, associative: true, flags: JSON_THROW_ON_ERROR);
    }
    return $pembangkitData(); // Cadangan terakhir jika proses pemegang kunci belum sempat mengisi cache
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `if (!$redis->set($kunciLock, '1', ['NX', 'EX' => 5])) { /* tunggu atau sajikan data basi */ }` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Ketika sebuah kunci cache di beranda yang diakses 5.000 pengguna per detik kedaluwarsa tepat pada detik yang sama, seluruh 5.000 worker PHP akan menghantam database secara serentak (*Cache Stampede*) untuk menghitung ulang kueri yang sama dan menumbangkan server database.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena ribuan worker secara serentak menjalankan kueri mahal yang sama ke database sehingga database kewalahan akibat lonjakan beban dan situs menjadi lambat atau tumbang
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Ketika sebuah kunci cache di beranda yang diakses 5.000 pengguna per detik kedaluwarsa tepat pada detik yang sama, seluruh 5.000 worker PHP akan menghantam database secara serentak (*Cache Stampede*) untuk menghitung ulang kueri yang sama dan menumbangkan server database.

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `if (!$redis->set($kunciLock, '1', ['NX', 'EX' => 5])) { /* tunggu atau sajikan data basi */ }` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `if (!$redis->set($kunciLock, '1', ['NX', 'EX' => 5])) { /* tunggu atau sajikan data basi */ }` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi `Strategi Caching Terdistribusi (PSR-16 SimpleCache & Redis), Invalidation, dan Pencegahan *Cache Stampede*` ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [PSR-16: Common Interface for Caching Libraries — PHP-FIG](https://www.php-fig.org/psr/psr-16/)
- [PSR-6: Caching Interface — PHP-FIG](https://www.php-fig.org/psr/psr-6/)
- [`SET` (opsi NX dan EX) — Redis Documentation](https://redis.io/docs/latest/commands/set/)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
