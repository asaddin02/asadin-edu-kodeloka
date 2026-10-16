# Komunikasi Antar-Layanan (cURL & Persistent Handles PHP 8.5), Caching, dan Rate Limiting

- **Tingkat:** Lanjut
- **Ringkasan:** Memanggil API eksternal dengan aman menggunakan ekstensi cURL dan fitur baru `curl_share_init_persistent()` di PHP 8.5, mempercepat aplikasi dengan pola *Cache-Aside* (APCu / Redis), serta melindungi endpoint dari penyalahgunaan dengan *Rate Limiting*.

## 1. Memanggil API Eksternal Secara Aman dengan cURL

Ketika aplikasi backend PHP Anda perlu menghubungi layanan eksternal—seperti gateway pembayaran (Midtrans/Xendit), API pengiriman pesan, atau layanan mikro internal lainnya—jangan gunakan `file_get_contents('https://...')` karena sulit mengatur batas waktu (*timeout*) koneksi secara presisi dan menangani kode status HTTP.

Gunakan ekstensi **`curl`** dengan selalu menetapkan **batas waktu koneksi (`CURLOPT_CONNECTTIMEOUT`)** dan **batas waktu total (`CURLOPT_TIMEOUT`)** agar ketika server pihak ketiga sedang lambat, worker PHP-FPM Anda tidak ikut menggantung!

```php
<?php

declare(strict_types=1);

function kirimRequestJsonApi(string $url, array $payload, int $timeoutDetik = 5): array
{
    $ch = curl_init($url);
    if ($ch === false) {
        throw new RuntimeException('Gagal menginisialisasi cURL.');
    }

    $bodyJson = json_encode($payload, JSON_THROW_ON_ERROR);

    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $bodyJson,
        CURLOPT_RETURNTRANSFER => true, // Kembalikan respons sebagai string, jangan langsung di-echo!
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Accept: application/json',
            'User-Agent: Kodeloka-Backend/1.0',
        ],
        // WAJIB: Batasi waktu jabat tangan koneksi (2 detik) dan total waktu tunggu (5 detik)!
        CURLOPT_CONNECTTIMEOUT => 2,
        CURLOPT_TIMEOUT        => $timeoutDetik,
        // WAJIB: Pastikan verifikasi sertifikat TLS/SSL selalu aktif!
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);

    $responsMentah = curl_exec($ch);
    $kodeHttp      = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $pesanGalat    = curl_error($ch);

    if ($responsMentah === false) {
        throw new RuntimeException("Kegagalan jaringan cURL: {$pesanGalat}");
    }

    if ($kodeHttp < 200 || $kodeHttp >= 300) {
        throw new RuntimeException("API eksternal mengembalikan status HTTP {$kodeHttp}");
    }

    $data = json_decode((string) $responsMentah, associative: true, flags: JSON_THROW_ON_ERROR);
    return is_array($data) ? $data : [];
}
```

### Fitur Baru di PHP 8.5: *Persistent cURL Share Handles* (`curl_share_init_persistent`)
Ingat bahwa dalam model *share-nothing* PHP-FPM, koneksi ke API pihak ketiga biasanya ditutup setiap kali satu permintaan PHP selesai, sehingga pada permintaan berikutnya PHP harus melakukan resolusi DNS dan jabat tangan TCP/TLS dari awal lagi.

Sejak **PHP 8.5**, hadir fungsi **`curl_share_init_persistent()`** yang memungkinkan worker PHP-FPM **menggunakan kembali cache DNS dan koneksi terbuka yang sudah ada dari permintaan SAPI sebelumnya**:

```php
<?php

declare(strict_types=1);

// Sejak PHP 8.5: Berbagi cache DNS dan koneksi lintas-permintaan di dalam worker PHP-FPM!
$shareHandle = curl_share_init_persistent([
    CURL_LOCK_DATA_DNS,
    CURL_LOCK_DATA_CONNECT,
]);

$ch = curl_init('https://api.asadinedu.com/v1/status');
curl_setopt($ch, CURLOPT_SHARE, $shareHandle);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$respons = curl_exec($ch);
```

## 2. Pola *Cache-Aside* untuk Menghemat Beban Database

Untuk data yang sering dibaca oleh ribuan pengunjung tetapi jarang berubah (seperti daftar katalog kelas di beranda atau konfigurasi situs), menjalankan kueri SQL ke database pada setiap permintaan adalah pemborosan besar.

Terapkan pola **Cache-Aside** menggunakan penyimpanan memori cepat seperti **Redis** atau **APCu** dilengkapi **TTL (*Time-To-Live*)**:

```php
<?php

declare(strict_types=1);

interface CacheInterface
{
    public function ambil(string $kunci): mixed;
    public function simpan(string $kunci, mixed $nilai, int $ttlDetik): void;
    public function hapus(string $kunci): void;
}

/**
 * Fungsi pembantu Cache-Aside ("remember"):
 * 1. Cek apakah data ada di cache. Jika ada (Cache Hit), langsung kembalikan!
 * 2. Jika belum ada (Cache Miss), jalankan $hitungData(), simpan ke cache selama $ttlDetik, lalu kembalikan.
 */
function ambilAtauSimpanCache(
    CacheInterface $cache,
    string $kunci,
    int $ttlDetik,
    callable $hitungData,
): mixed {
    $dariCache = $cache->ambil($kunci);
    if ($dariCache !== null) {
        return $dariCache; // Cache Hit!
    }

    $dataSegar = $hitungData(); // Cache Miss: ambil dari Database
    $cache->simpan($kunci, $dataSegar, $ttlDetik);

    return $dataSegar;
}
```

## 3. Melindungi Endpoint Sensitif dengan *Rate Limiting* (Pembatasan Laju)

Endpoint seperti `/login`, `/lupa-sandi`, atau `/kirim-otp` wajib dilindungi dengan **Rate Limiting** agar penyerang tidak dapat mengirim ribuan tebakan kata sandi per menit dari satu alamat IP atau terhadap satu akun:

```php
<?php

declare(strict_types=1);

final class PembatasLajuSederhana
{
    /**
     * Memeriksa apakah identitas (mis. IP atau surel) sudah melampaui batas maksimal
     * percobaan dalam jendela waktu tertentu.
     */
    public function izinkanAksi(
        CacheInterface $cache,
        string $identitas,
        int $batasMaksimal = 5,
        int $jendelaDetik = 60,
    ): bool {
        $emberWaktu = (int) floor(time() / $jendelaDetik);
        $kunci = sprintf('ratelimit:%s:%d', hash('sha256', $identitas), $emberWaktu);

        $jumlahSaatIni = (int) ($cache->ambil($kunci) ?? 0);
        if ($jumlahSaatIni >= $batasMaksimal) {
            return false; // Tolak dengan HTTP 429 Too Many Requests!
        }

        $cache->simpan($kunci, $jumlahSaatIni + 1, $jendelaDetik);
        return true;
    }
}
```
Jika `izinkanAksi()` mengembalikan `false`, balas dengan kode status **`429 Too Many Requests`** dan sertakan header **`Retry-After: 60`**.

## Latihan Praktik: Implementasi Cache Memori dan Pembatas Laju Login

Buatlah berkas `latihan-cache-ratelimit.php`:
1. Buat `class CacheMemori implements CacheInterface` yang menyimpan data beserta waktu kedaluwarsanya (`time() + $ttlDetik`) di dalam array privat.
2. Uji fungsi `ambilAtauSimpanCache()` untuk membuktikan bahwa kueri mahal hanya dijalankan satu kali pada pemanggilan pertama.
3. Uji `PembatasLajuSederhana` dengan melakukan 6 percobaan berturut-turut (batas maksimal 5) dan pastikan percobaan ke-6 ditolak!

## Kuis Pemahaman

### Soal 1
Mengapa saat memanggil API pihak ketiga menggunakan cURL dari dalam aplikasi web PHP, Anda **wajib** mengatur `CURLOPT_CONNECTTIMEOUT` dan `CURLOPT_TIMEOUT` ke nilai yang wajar (misalnya 2 hingga 5 detik)?
- A. Agar cURL otomatis mengompresi data JSON.
- B. Agar apabila server pihak ketiga mengalami gangguan dan tidak merespons, proses worker PHP-FPM Anda tidak ikut menggantung terlalu lama hingga seluruh slot `pm.max_children` habis terpakai dan menyebabkan situs Anda sendiri ikut lumpuh (*cascading failure*).
- C. Karena tanpa `CURLOPT_TIMEOUT`, fungsi `curl_exec()` tidak dapat dijalankan.
- D. Agar sertifikat SSL tidak diperiksa.

**Jawaban Benar:** B
**Penjelasan:** Jumlah worker PHP-FPM terbatas. Jika setiap permintaan pengguna menunggu API pihak ketiga yang macet selama 60 detik, seluruh worker akan terkunci hanya dalam beberapa detik. Menetapkan batas waktu pendek memastikan aplikasi gagal secara cepat (*fail-fast*) dan tetap responsif.

### Soal 2
Apa manfaat fungsi baru `curl_share_init_persistent()` yang diperkenalkan di **PHP 8.5**?
- A. Menyimpan hasil respons JSON ke dalam berkas `.txt` secara permanen.
- B. Memungkinkan handle berbagi cURL (seperti cache DNS `CURL_LOCK_DATA_DNS` dan pool koneksi `CURL_LOCK_DATA_CONNECT`) bertahan melintasi beberapa permintaan PHP di dalam proses worker yang sama, sehingga menghemat biaya jabat tangan TCP/TLS berulang ke host API yang sama.
- C. Mengizinkan cURL berjalan tanpa ekstensi `curl`.
- D. Membagikan koneksi cURL ke peramban pengguna.

**Jawaban Benar:** B
**Penjelasan:** Berbeda dengan `curl_share_init()` biasa yang dihancurkan di akhir setiap request PHP, `curl_share_init_persistent()` di PHP 8.5 mempertahankan koneksi dan cache DNS di antara request pada proses SAPI worker yang sama.

### Soal 3
Kode status HTTP standar berapakah yang harus dikirimkan oleh server ketika seorang klien melampaui batas frekuensi permintaan (*Rate Limit*) yang diizinkan?
- A. `400 Bad Request`
- B. `403 Forbidden`
- C. `429 Too Many Requests` (disertai header `Retry-After`)
- D. `503 Service Unavailable`

**Jawaban Benar:** C
**Penjelasan:** Kode status HTTP `429 Too Many Requests` (RFC 6585) secara spesifik menunjukkan bahwa pengguna telah mengirimkan terlalu banyak permintaan dalam rentang waktu tertentu (*rate limiting*).

## Sumber
- [PHP 8.5 Release Announcement (Persistent cURL Share Handles) — PHP.net](https://www.php.net/releases/8.5/en.php)
- [Function Reference (cURL) — PHP Manual](https://www.php.net/manual/en/index.php)
