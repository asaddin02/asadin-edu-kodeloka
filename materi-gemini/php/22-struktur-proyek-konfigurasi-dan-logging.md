# Struktur Direktori Proyek Siap Produksi, Konfigurasi Lingkungan, dan Logging Terstruktur (PSR-3)

- **Tingkat:** Lanjut
- **Ringkasan:** Mengorganisasikan arsitektur direktori aplikasi PHP yang memisahkan `public/` dari kode sumber internal, mengelola konfigurasi via variabel lingkungan (`getenv`), serta menerapkan pencatatan log terstruktur (*structured JSON logging*) sesuai standar **PSR-3**.

## 1. Struktur Direktori Standar Industri: Memisahkan `public/` dan `src/`

Mari kita telaah anatomi lengkap proyek aplikasi PHP modern yang siap di-deploy ke server Linux maupun kontainer Docker:

```text
kodeloka-backend/
├── .env.example               <-- Contoh variabel lingkungan (Aman di-commit ke Git)
├── .gitignore                 <-- Mengabaikan /vendor/, /.env, dan /storage/*.log
├── composer.json              <-- Definisi dependensi & autoloading PSR-4
├── composer.lock              <-- Kunci versi eksak dependensi (WAJIB di-commit ke Git!)
├── phpunit.xml                <-- Konfigurasi pengujian otomatis
├── bin/
│   └── konsol                 <-- Skrip CLI untuk migrasi database atau tugas terjadwal (cron)
├── config/
│   └── aplikasi.php           <-- Membaca getenv() dan memvalidasi tipe konfigurasi
├── public/                    <-- DOCUMENT ROOT NGINX (Satu-satunya folder yang terekspos ke web!)
│   ├── index.php              <-- Front Controller (Pintu masuk tunggal HTTP)
│   └── assets/                <-- Berkas statis CSS, JS, dan gambar
├── src/                       <-- Kode sumber PSR-4 (Namespace: Kodeloka\)
│   ├── Controller/            <-- Menerima Request, memanggil Service, mengembalikan Response
│   ├── Domain/                <-- Entitas, Value Object Readonly, Enum, dan Domain Exception
│   ├── Service/               <-- Logika bisnis aplikasi
│   ├── Repository/            <-- Kueri database PDO Prepared Statements
│   └── Keamanan/              <-- CSRF, Sesi, dan Middleware
├── storage/                   <-- Penyimpanan lokal di luar web root (log, cache, unggahan privat)
├── templates/                 <-- Berkas tampilan HTML (Views)
└── tests/                     <-- Pengujian otomatis PHPUnit (Unit & Integration Tests)
```

### Mengapa Pemisahan Tanggung Jawab (*Separation of Concerns*) di `src/` Penting?
- **Controller Tetap Tipis (*Thin Controllers*):** Controller hanya bertugas membaca dan memvalidasi parameter HTTP, memanggil metode di `Service`, lalu memilih `template` atau mengembalikan JSON. Controller **tidak boleh** berisi kueri SQL `SELECT/INSERT` mentah!
- **Domain & Service Bebas dari HTTP:** Kelas di dalam `Domain/` dan `Service/` tidak boleh mengakses `$_POST` atau `$_SESSION` secara langsung; mereka menerima argumen bertipe jelas (seperti `string $surel` atau objek DTO) sehingga dapat dipanggil baik dari web (`public/index.php`), dari perintah terminal (`bin/konsol`), maupun dari pengujian unit (`tests/`)!

## 2. Membaca dan Memvalidasi Konfigurasi dengan Objek Konfigurasi `readonly`

Daripada memanggil `getenv('DB_DSN')` secara tersebar di puluhan berkas (yang berisiko salah ketik nama variabel), bungkus seluruh konfigurasi lingkungan ke dalam sebuah **`readonly class KonfigurasiAplikasi`** yang divalidasi satu kali saat aplikasi menyala (*fail-fast on startup*):

```php
<?php

declare(strict_types=1);

namespace Kodeloka\Konfigurasi;

use RuntimeException;

readonly class KonfigurasiAplikasi
{
    public function __construct(
        public string $namaAplikasi,
        public string $lingkungan,
        public bool $modeDebug,
        public string $dbDsn,
        public ?string $dbUser,
        public ?string $dbPass,
    ) {}

    public static function dariEnvironment(): self
    {
        $dsn = getenv('DB_DSN');
        if (!is_string($dsn) || trim($dsn) === '') {
            throw new RuntimeException('Variabel lingkungan wajib DB_DSN belum diatur.');
        }

        $lingkungan = getenv('APP_ENV') ?: 'production';

        return new self(
            namaAplikasi: getenv('APP_NAME') ?: 'Kodeloka',
            lingkungan: $lingkungan,
            // Pastikan mode debug TIDAK PERNAH aktif secara tak sengaja di production!
            modeDebug: $lingkungan !== 'production'
                && filter_var(getenv('APP_DEBUG') ?: 'false', FILTER_VALIDATE_BOOL),
            dbDsn: $dsn,
            dbUser: getenv('DB_USER') ?: null,
            dbPass: getenv('DB_PASS') ?: null,
        );
    }
}
```

## 3. Pencatatan Log Terstruktur (*Structured Logging*) Sesuai Standar PSR-3

Ketika terjadi masalah di server produksi pada pukul 02.00 dini hari, log adalah mata dan telinga Anda.
Jangan menulis log sebagai kalimat bebas yang sulit dicari mesin seperti `"User 42 gagal bayar pesanan 99 karena saldo kurang"`.

Menurut standar **PSR-3 (`Psr\Log\LoggerInterface`)** (yang diimplementasikan oleh pustaka populer **Monolog**), setiap catatan log terdiri dari tingkat keparahan, pesan, dan array konteks. PSR-3 tidak mengatur format keluaran; format JSON pada poin 3 dan kelas `PencatatLogJson` di bawah adalah praktik tambahan yang disederhanakan (kelas tersebut tidak mengimplementasikan `Psr\Log\LoggerInterface`):
1. **Tingkat Keparahan (*Log Level* — RFC 5424):** `debug`, `info`, `notice`, `warning`, `error`, `critical`, `alert`, `emergency`.
2. **Pesan Statis yang Jelas** disertai **Array Konteks Terstruktur (`$context`)**!
3. **Format JSON Satu Baris (*JSON Lines*) ke `stderr` atau Berkas Log:** Memudahkan sistem observabilitas (seperti Grafana Loki, OpenTelemetry, atau Elasticsearch) memfilter berdasarkan `context.user_id` atau `context.order_id`!

```php
<?php

declare(strict_types=1);

namespace Kodeloka\Observabilitas;

final class PencatatLogJson
{
    public function __construct(
        private readonly string $saluran = 'kodeloka-app',
        private readonly string $targetAliran = 'php://stderr',
    ) {}

    public function info(string $pesan, array $konteks = []): void
    {
        $this->tulis('INFO', $pesan, $konteks);
    }

    public function warning(string $pesan, array $konteks = []): void
    {
        $this->tulis('WARNING', $pesan, $konteks);
    }

    public function error(string $pesan, array $konteks = []): void
    {
        $this->tulis('ERROR', $pesan, $konteks);
    }

    private function tulis(string $tingkat, string $pesan, array $konteks): void
    {
        $rekaman = [
            'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
            'level'     => $tingkat,
            'channel'   => $this->saluran,
            'message'   => $pesan,
            'context'   => $this->saringDataSensitif($konteks),
        ];

        $barisJson = json_encode($rekaman, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n";
        file_put_contents($this->targetAliran, $barisJson, FILE_APPEND);
    }

    /**
     * WAJIB: Jangan pernah mencatat kata sandi, token sesi, atau kunci API ke dalam berkas log!
     */
    private function saringDataSensitif(array $konteks): array
    {
        $kunciTerlarang = ['password', 'sandi', 'kata_sandi', 'token', 'csrf_token', 'authorization'];
        foreach ($konteks as $kunci => $nilai) {
            if (in_array(strtolower((string) $kunci), $kunciTerlarang, true)) {
                $konteks[$kunci] = '[DISEMBUNYIKAN]';
            } elseif (is_array($nilai)) {
                $konteks[$kunci] = $this->saringDataSensitif($nilai);
            }
        }
        return $konteks;
    }
}
```

> **🚫 Aturan Keamanan Log: Sensor Data Rahasia (*Redaction*) & `#[SensitiveParameter]`!**
> 1. Jangan pernah mencatat kata sandi, nomor kartu kredit, atau token sesi ke dalam log!
> 2. Sejak **PHP 8.2+**, pasang atribut bawaan **`#[\SensitiveParameter]`** pada parameter fungsi yang menerima kata sandi atau kunci rahasia:
>    ```php
>    public function hubungkanDb(string $user, #[\SensitiveParameter] string $password): void
>    ```
>    Dengan `#[\SensitiveParameter]`, seandainya fungsi tersebut gagal dan mencetak *stack trace* ke log server, nilai `$password` di dalam *stack trace* otomatis diganti menjadi `Object(SensitiveParameterValue)` sehingga kata sandi tidak pernah bocor ke berkas log!

## Latihan Praktik: Mengamankan Parameter Sensitif dan Mencatat Log JSON

Buatlah berkas `latihan-logging.php` dan jalankan dengan `php latihan-logging.php`:
1. Buat fungsi `prosesAutentikasi(string $surel, #[\SensitiveParameter] string $sandi)` yang sengaja melempar `RuntimeException` dan amati bahwa di dalam `$e->getTraceAsString()`, isi `$sandi` disembunyikan oleh `#[\SensitiveParameter]`.
2. Gunakan `PencatatLogJson` untuk mencatat kejadian login gagal lengkap dengan konteks `['surel' => $surel, 'sandi' => $sandi, 'ip' => '127.0.0.1']` dan pastikan nilai `'sandi'` otomatis tersensor menjadi `'[DISEMBUNYIKAN]'`!

## Kuis Pemahaman

### Soal 1
Apa fungsi dari atribut bawaan `#[\SensitiveParameter]` (sejak PHP 8.2) ketika dipasang di depan parameter fungsi seperti `function login(string $user, #[\SensitiveParameter] string $password)`?
- A. Mengenkripsi variabel `$password` dengan algoritma AES-256 secara otomatis.
- B. Menyembunyikan nilai aktual argumen `$password` (menggantinya dengan `Object(SensitiveParameterValue)`) di dalam *stack trace* dan laporan exception apabila terjadi galat di dalam fungsi tersebut, sehingga kata sandi tidak bocor ke berkas log atau layanan pemantau galat.
- C. Menghapus variabel `$password` begitu fungsi dimulai.
- D. Memaksa pengguna memasukkan kata sandi minimal 16 karakter.

**Jawaban Benar:** B
**Penjelasan:** Secara bawaan, *stack trace* PHP dapat mencantumkan nilai argumen yang dikirimkan ke setiap fungsi dalam rantai pemanggilan. Atribut `#[\SensitiveParameter]` menyensor nilai argumen tersebut di dalam *backtrace* demi mencegah kebocoran rahasia ke sistem log.

### Soal 2
Mengapa dalam standar pencatatan log modern (PSR-3), kita dianjurkan menulis `$logger->error('Gagal memproses pembayaran', ['order_id' => 105, 'user_id' => 42])` (memisahkan pesan statis dan array konteks) daripada menggabungkan semuanya ke dalam satu string kalimat?
- A. Karena fungsi `error()` tidak mengizinkan tanda kutip ganda.
- B. Agar sistem pengumpul log (seperti Loki, Elasticsearch, atau Datadog) dapat mengindeks setiap pasangan kunci-nilai di dalam `context` sebagai kolom JSON terstruktur yang mudah dicari dan difilter, sementara pesan utamanya tetap seragam untuk dikelompokkan.
- C. Karena menggabungkan string di PHP membutuhkan ekstensi tambahan.
- D. Agar ukuran berkas log menjadi 0 byte.

**Jawaban Benar:** B
**Penjelasan:** *Structured logging* memisahkan template peristiwa (`message`) dari atribut datanya (`context`), memungkinkan kueri analitik instan seperti mencari seluruh log dengan `context.order_id == 105` di antara jutaan baris log.

### Soal 3
Mengapa kelas-kelas di dalam lapisan `src/Domain/` dan `src/Service/` sebaiknya tidak membaca variabel superglobal `$_POST` atau `$_GET` secara langsung?
- A. Karena variabel `$_POST` dan `$_GET` tidak tersedia di dalam namespace.
- B. Agar logika bisnis inti tidak terikat pada konteks permintaan web HTTP, sehingga kelas yang sama dapat digunakan kembali dengan mudah dari skrip terminal CLI (`bin/konsol`), pekerja antrean latar belakang, maupun diuji langsung di dalam PHPUnit tanpa perlu memalsukan variabel global.
- C. Karena mengakses `$_POST` di dalam class memperlambat OPcache.
- D. Karena `$_POST` hanya bisa dibaca satu kali.

**Jawaban Benar:** B
**Penjelasan:** Membiarkan hanya lapisan terluar (*Controller*) yang membaca HTTP Request lalu meneruskan nilai/DTO bersih ke lapisan *Service/Domain* menjaga arsitektur aplikasi tetap modular, bersih, dan sangat mudah diuji.

## Sumber
- [PSR-3: Logger Interface — PHP-FIG](https://www.php-fig.org/psr/psr-3/)
- [The SensitiveParameter attribute — PHP Manual](https://www.php.net/manual/en/class.sensitiveparameter.php)
- [Error Reporting (Security) — PHP Manual](https://www.php.net/manual/en/security.errors.php)
