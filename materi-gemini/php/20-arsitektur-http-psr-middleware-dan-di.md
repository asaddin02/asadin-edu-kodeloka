# Arsitektur Aplikasi Modern: Routing, Middleware (PSR-15), dan Dependency Injection (PSR-11)

- **Tingkat:** Lanjut
- **Ringkasan:** Memahami arsitektur internal di balik kerangka kerja PHP modern melalui pola *Front Controller*, *Router*, pipa pemrosesan **Middleware (PSR-7 & PSR-15)**, serta **Dependency Injection (DI)** dan prinsip *Inversion of Control* agar aplikasi mudah diuji dan dirawat.

## Mengapa Memahami Arsitektur Ini Membuat Anda Siap Bekerja di Proyek Mana Pun?

Baik Anda bekerja menggunakan PHP murni, Slim, Symfony, maupun Laravel, seluruh aplikasi web PHP modern di industri dibangun di atas tiga pilar arsitektur yang distandarkan oleh **PHP-FIG**:
1. **Representasi Pesan HTTP (PSR-7) & Pipa Middleware (PSR-15):** Permintaan HTTP mengalir melewati lapisan-lapisan pemeriksaan (seperti autentikasi, proteksi CSRF, pembatasan laju, dan pencatatan log) sebelum tiba di *Controller*.
2. **Routing:** Memetakan pasangan metode HTTP + jalur URI (`GET /kelas/php`) ke penangan (*handler/controller*) yang tepat.
3. **Dependency Injection (DI) & Container (PSR-11):** Menyuntikkan objek yang dibutuhkan oleh sebuah kelas melalui konstruktornya, bukan membuat koneksi database atau layanan sendiri di dalam kelas tersebut!

## 1. Apa Itu Dependency Injection (DI) dan Mengapa `new` di Dalam Layanan Berbahaya?

Perhatikan perbedaan antara kelas yang **terikat kaku (*tightly coupled*)** dan kelas yang menggunakan **Dependency Injection**:

```php
<?php

declare(strict_types=1);

// 🚫 BURUK (Tightly Coupled):
// PendaftaranService membuat sendiri koneksi PDO dan pengirim email di dalamnya.
// Akibatnya: Anda TIDAK BISA menguji PendaftaranService tanpa database produksi dan server SMTP nyata!
class PendaftaranServiceBuruk
{
    public function daftar(string $surel): void
    {
        $pdo = new PDO('pgsql:host=db.prod;dbname=utama', 'admin', 'rahasia'); // Terkunci mati!
        // ...
    }
}

// ✅ BENAR (Dependency Injection melalui Constructor + Interface!):
interface PengirimSurelInterface
{
    public function kirim(string $tujuan, string $subjek, string $isi): void;
}

final readonly class PendaftaranService
{
    // Kelas ini TIDAK PEDULI apakah $pdo terhubung ke PostgreSQL produksi atau SQLite in-memory,
    // dan TIDAK PEDULI apakah $pengirimSurel benar-benar mengirim lewat SMTP atau hanya mock pengujian!
    public function __construct(
        private PDO $pdo,
        private PengirimSurelInterface $pengirimSurel,
    ) {}

    public function daftar(string $surel): void
    {
        $stmt = $this->pdo->prepare('INSERT INTO peserta (surel) VALUES (:surel)');
        $stmt->execute(['surel' => $surel]);

        $this->pengirimSurel->kirim($surel, 'Selamat Datang di Kodeloka', 'Pendaftaran berhasil!');
    }
}
```

### Keuntungan Besar *Dependency Injection*:
1. **Mudah Diuji (*Testable*):** Saat menjalankan PHPUnit, Anda cukup menyuntikkan `new PDO('sqlite::memory:')` dan sebuah kelas `PengirimSurelPalsu implements PengirimSurelInterface` yang mencatat surel ke dalam array memori tanpa mengirim surel sungguhan!
2. **Mudah Diganti (*Swappable*):** Jika bulan depan perusahaan berpindah penyedia layanan surel, Anda cukup membuat kelas baru yang mengimplementasikan `PengirimSurelInterface` tanpa mengubah satu huruf pun di dalam `PendaftaranService`!

## 2. Pola Pipa *Middleware* (Konsep PSR-15)

Bayangkan **Middleware** seperti lapisan-lapisan kulit bawang yang mengelilingi *Controller* inti Anda:

```
Permintaan HTTP Masuk
   │
   ▼
[ Middleware 1: Pencatat Log & Waktu Eksekusi ]
   │
   ▼
[ Middleware 2: Pemeriksa Sesi & CSRF ]  ──(Jika tidak sah)──> Langsung balas 403 Forbidden!
   │
   ▼
[ Controller Inti: Mengambil Data & Merender Respons ]
   │
   ▼
[ Kembali melewati Middleware 2 -> Middleware 1 (Menambahkan header X-Response-Time) ]
   │
   ▼
Respons HTTP Keluar ke Peramban
```

Mari kita lihat betapa sederhananya mengimplementasikan arsitektur **Request**, **Response**, dan **Middleware Pipeline** dalam PHP modern:

```php
<?php

declare(strict_types=1);

namespace Kodeloka\Http;

readonly class Request
{
    public function __construct(
        public string $metode,
        public string $jalur,
        public array $query = [],
        public array $body = [],
        public array $header = [],
    ) {}
}

readonly class Response
{
    public function __construct(
        public string $isi,
        public int $status = 200,
        public array $header = ['Content-Type' => 'text/html; charset=utf-8'],
    ) {}
}

interface MiddlewareInterface
{
    /**
     * @param callable(Request): Response $lanjut
     */
    public function proses(Request $request, callable $lanjut): Response;
}

// Contoh Middleware Pencatat Waktu Eksekusi:
final class WaktuEksekusiMiddleware implements MiddlewareInterface
{
    public function proses(Request $request, callable $lanjut): Response
    {
        $mulai = hrtime(true);

        // Teruskan request ke lapisan berikutnya di dalam pipa
        $respons = $lanjut($request);

        $durasiMs = round((hrtime(true) - $mulai) / 1_000_000, 2);
        $headerBaru = [...$respons->header, 'X-Waktu-Proses-Ms' => (string) $durasiMs];

        return clone($respons, ['header' => $headerBaru]);
    }
}
```

## 3. Merakit *Dependency Injection Container* (PSR-11) Sederhana

Agar Anda tidak perlu merangkai `new PendaftaranService(new PDO(...), new SmtpMailer(...))` berulang kali di setiap rute, kita menggunakan **Service Container** yang menyimpan resep pembuatan objek (*factories*) dan instans *shared/singleton*:

```php
<?php

declare(strict_types=1);

final class Container
{
    /** @var array<string, callable(self): object> */
    private array $resep = [];

    /** @var array<string, object> */
    private array $instansTunggal = [];

    public function daftarkan(string $id, callable $pembuat): void
    {
        $this->resep[$id] = $pembuat;
    }

    public function ambil(string $id): object
    {
        // Jika sudah pernah dibuat sebelumnya, kembalikan instans yang sama
        if (isset($this->instansTunggal[$id])) {
            return $this->instansTunggal[$id];
        }

        if (!isset($this->resep[$id])) {
            throw new RuntimeException("Layanan tidak terdaftar di Container: {$id}");
        }

        $this->instansTunggal[$id] = ($this->resep[$id])($this);
        return $this->instansTunggal[$id];
    }
}
```

## Latihan Praktik: Membangun Router & Pipa Middleware Mini

Buatlah berkas `pipa-middleware.php` dan jalankan dengan `php pipa-middleware.php`:
1. Buat `OtorisasiMiddleware implements MiddlewareInterface` yang memeriksa apakah `$request->header['X-Api-Key'] === 'rahasia-kodeloka'` (jika salah, langsung kembalikan `new Response('Akses Ditolak', 401)` tanpa memanggil `$lanjut($request)`!).
2. Rangkai `WaktuEksekusiMiddleware` -> `OtorisasiMiddleware` -> `Controller` dan uji dengan request yang memiliki kunci API benar maupun salah.

## Kuis Pemahaman

### Soal 1
Apa masalah utama apabila sebuah kelas `LaporanPesananService` memanggil `new PDO('pgsql:host=...', ...)` secara langsung di dalam metodenya alih-alih menerima objek `PDO` (atau interface repositori) melalui parameter `__construct()`?
- A. Karena kata kunci `new` hanya boleh digunakan di dalam `public/index.php`.
- B. Kelas tersebut menjadi terikat kaku (*tightly coupled*) pada instans database tertentu, sehingga sulit diuji secara terisolasi dalam pengujian unit dan memaksa pembuatan koneksi database baru yang boros setiap kali metode dipanggil.
- C. Karena `PDO` tidak dapat disimpan di dalam properti `private readonly`.
- D. Karena `new PDO` mematikan autoloader PSR-4.

**Jawaban Benar:** B
**Penjelasan:** *Dependency Injection* memindahkan tanggung jawab pembuatan dependensi ke luar kelas (*Inversion of Control*). Dengan menerima `PDO` lewat konstruktor, satu koneksi database yang sama dapat dipakai bersama, dan saat pengujian kita dapat menyuntikkan SQLite in-memory dengan mudah.

### Soal 2
Dalam arsitektur *Middleware Pipeline* (seperti standar PSR-15), bagaimana sebuah middleware keamanan (misalnya pemeriksa autentikasi atau pemeriksa CSRF) menghentikan permintaan yang tidak sah agar tidak pernah mencapai *Controller*?
- A. Dengan memanggil `$lanjut($request)` sebanyak dua kali.
- B. Dengan **tidak memanggil** fungsi/handler berikutnya (`$lanjut($request)`) dan langsung mengembalikan objek `Response` penolakan (seperti status `401 Unauthorized` atau `403 Forbidden`).
- C. Dengan menghapus berkas Controller dari diska.
- D. Dengan mengubah metode request menjadi `GET`.

**Jawaban Benar:** B
**Penjelasan:** Setiap middleware memegang kendali apakah ia akan meneruskan permintaan ke lapisan dalam (`return $lanjut($request)`) atau melakukan *short-circuit* (memutus alur lebih awal dengan langsung mengembalikan `Response`).

### Soal 3
Mengapa fungsi bawaan `hrtime(true)` (yang mengembalikan waktu monotonik dalam nanodetik) lebih tepat digunakan untuk mengukur durasi waktu eksekusi di dalam middleware dibandingkan fungsi `time()` atau `microtime(true)`?
- A. Karena `time()` hanya berjalan di Windows.
- B. Karena `hrtime(true)` menggunakan jam monotonik beresolusi tinggi milik sistem operasi yang tidak pernah melompat maju atau mundur apabila layanan NTP menyinkronkan ulang jam dinding server di tengah permintaan.
- C. Karena `hrtime(true)` otomatis mencetak hasilnya ke header HTTP.
- D. Karena `microtime(true)` sudah dihapus dari PHP 8.

**Jawaban Benar:** B
**Penjelasan:** Sama seperti `performance.now()` di JavaScript, `hrtime(true)` di PHP dirancang khusus untuk pengukuran selisih waktu (*benchmarking/profiling*) karena berpresisi nanodetik dan kebal terhadap perubahan jam kalender sistem.

## Sumber
- [PHP Standards Recommendations (PSR-7, PSR-11, PSR-15) — PHP-FIG](https://www.php-fig.org/psr/)
- [Classes and Objects — PHP Manual](https://www.php.net/manual/en/language.oop5.basic.php)
