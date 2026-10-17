# Pengujian Tingkat Lanjut: Pengujian Integrasi HTTP (PSR-7), Transaksi Rollback Otomatis, dan Coverage

- **Tingkat:** Lanjut
- **Ringkasan:** Menguji alur aplikasi secara menyeluruh mulai dari permintaan PSR-7 `ServerRequestInterface` melewati Middleware, Controller, Service, hingga kueri database PDO sungguhan yang dibungkus dalam transaksi `rollBack()` otomatis setiap akhir metode uji.

## Mengapa Pengujian yang 100% Menggunakan Mock Object Masih Bisa Kebobolan Bug SQL di Produksi?

*Unit Test* menggunakan *Stub* atau *Mock Object* sangat bagus untuk menguji rumus bisnis murni di dalam class Domain/Service secara terisolasi. Namun, apa yang terjadi apabila Anda menguji class `PdoPesananRepository` dengan cara me-*mock* objek `PDO` dan `PDOStatement`?

Pengujian Anda hanya memeriksa apakah kode memanggil `$pdo->prepare()` dengan string tertentu lalu mengembalikan array palsu. Jika ternyata di dalam kueri SQL Anda terdapat **salah ketik nama kolom (`SELECT totl_harga FROM pesanan`)**, pelanggaran *foreign key constraint*, atau ketidakcocokan tipe tanggal SQL, **Unit Test berbasis Mock akan tetap berwarna HIJAU (Lulus), tetapi aplikasi langsung meledak di produksi!**

Oleh karena itu, class Repository dan endpoint HTTP wajib diuji menggunakan **Integration Test** terhadap mesin database sungguhan yang diisolasi dengan pola **Transaksi Rollback Otomatis (`beginTransaction` di `setUp` dan `rollBack` di `tearDown`)**!

> **🚫 Kerentanan & Kesalahan Umum:** Mengandalkan 100% *Mock Object* untuk menguji class Repository yang berisi kueri SQL hanya membuktikan bahwa kode Anda memanggil metode mock sesuai skenario palsu, tetapi sama sekali tidak mendeteksi jika ada salah ketik nama kolom atau sintaks SQL yang tidak valid!

## 1. Piramida Pengujian Backend PHP: Unit vs Database Integration vs HTTP Contract Test

Berikut adalah pembagian tanggung jawab di antara ketiga tingkat pengujian otomatis di PHPUnit 12:

| Tingkat Pengujian | Target yang Diuji | Ketergantungan yang Dipakai | Kecepatan & Tujuan Utama |
| :--- | :--- | :--- | :--- |
| **1. Unit Test** | Value Objects, Entities, Kalkulator, Policy Class, Reducer/Validator murni. | Tidak ada I/O (atau memakai *In-Memory Fake* / *Stub*). | **< 1 ms / uji.** Memastikan seluruh cabang logika bisnis dan batas nilai (*edge cases*) akurat. |
| **2. Database Integration Test** | Class `Pdo*Repository`, Migrasi Skema, Kueri Laporan & Locking. | **Koneksi PDO sungguhan** (SQLite `:memory:` atau container uji PostgreSQL/MySQL) dengan `rollBack()` per uji. | **2–10 ms / uji.** Membuktikan sintaks SQL, nama kolom, indeks unik, dan pemetaan baris benar-benar bekerja. |
| **3. HTTP / API Contract Test** | Alur penuh: `PSR-7 Request -> Middleware -> Controller -> Service -> Response`. | Objek `ServerRequest` disuntikkan ke Kernel HTTP lalu status, header, dan skema JSON `Response` diperiksa. | **5–20 ms / uji.** Menjamin kontrak endpoint REST API (termasuk format galat RFC 9457) tidak berubah/rusak. |

## 2. Pola `DatabaseIntegrationTestCase` dengan Transaksi `rollBack()` Otomatis

Agar setiap metode pengujian (`test*`) selalu mulai dari keadaan database yang bersih tanpa harus menjalankan `DROP TABLE` dan `CREATE TABLE` yang lambat di setiap pengujian, gunakan siklus hidup fixture PHPUnit (`setUp()` dan `tearDown()`):
1. Buat skema tabel satu kali;
2. Di dalam **`setUp()`** (dijalankan sebelum tiap metode uji), buka transaksi **`$this->pdo->beginTransaction()`**;
3. Di dalam **`tearDown()`** (dijalankan setelah tiap metode uji selesai, baik lulus maupun gagal), panggil **`$this->pdo->rollBack()`** sehingga seluruh baris `INSERT`/`UPDATE`/`DELETE` yang dilakukan oleh pengujian tadi langsung menguap bersih dalam waktu 0,1 milidetik!

```php
<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

abstract class DatabaseIntegrationTestCase extends TestCase
{
    protected PDO $pdo;

    protected function setUp(): void
    {
        $this->pdo = new PDO('sqlite::memory:', options: [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $this->pdo->exec(
            'CREATE TABLE modul (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT UNIQUE NOT NULL,
                judul TEXT NOT NULL
            )'
        );
        $this->pdo->beginTransaction();
    }

    protected function tearDown(): void
    {
        if ($this->pdo->inTransaction()) {
            $this->pdo->rollBack();
        }
    }
}
```

## 3. Menguji Repositori dan Kontrak Endpoint HTTP Secara Utuh

Berikut adalah contoh bagaimana class turunan pengujian menguji penyimpanan dan pelanggaran batas `UNIQUE` pada Repository sungguhan, sekaligus memverifikasi kontrak respons JSON API:

```php
<?php
declare(strict_types=1);

final class ModulRepository
{
    public function __construct(private readonly PDO $pdo) {}

    public function tambah(string $slug, string $judul): int
    {
        $stmt = $this->pdo->prepare('INSERT INTO modul (slug, judul) VALUES (:slug, :judul)');
        $stmt->execute([':slug' => $slug, ':judul' => $judul]);
        return (int) $this->pdo->lastInsertId();
    }

    /** @return array{id: int, slug: string, judul: string}|null */
    public function cariDenganSlug(string $slug): ?array
    {
        $stmt = $this->pdo->prepare('SELECT id, slug, judul FROM modul WHERE slug = :slug');
        $stmt->execute([':slug' => $slug]);
        $baris = $stmt->fetch();
        return is_array($baris) ? [
            'id'    => (int) $baris['id'],
            'slug'  => (string) $baris['slug'],
            'judul' => (string) $baris['judul'],
        ] : null;
    }
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Mengandalkan dialek spesifik SQLite `:memory:` padahal produksi memakai fitur khusus PostgreSQL (seperti `JSONB`, `ILIKE`, atau `RETURNING` khusus):** SQLite `:memory:` sangat cepat untuk SQL standar, tetapi untuk menguji fitur spesifik PostgreSQL/MySQL di pipa CI (seperti GitHub Actions), jalankan *service container* PostgreSQL sungguhan dan gunakan pola `beginTransaction()` / `rollBack()` yang sama!
2. **Membiarkan metode pengujian bergantung pada urutan eksekusi (`testKedua` mengharapkan data sisa dari `testPertama`):** Setiap metode pengujian wajib **100% terisolasi dan independen** sehingga tetap lulus meskipun dijalankan secara acak (`--order-by=random`).
3. **Mengejar angka *Code Coverage* 100% tanpa menulis *assertion* yang bermakna:** Pengujian yang hanya memanggil fungsi tanpa memeriksa hasilnya (`assertSame`, `assertThrows`) akan menaikkan persentase baris *coverage*, tetapi tidak mendeteksi bug sama sekali (*assertion-free test*).

## Latihan Praktik Mandiri

1. Buat berkas `ModulRepositoryTest.php` yang mewarisi `DatabaseIntegrationTestCase` dan menguji `ModulRepository::tambah()` serta `cariDenganSlug()`.
2. Tambahkan pengujian kedua yang memastikan penyisipan dua baris dengan `$slug` yang sama persis melempar `PDOException` akibat pelanggaran `UNIQUE constraint`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Mengandalkan 100% *Mock Object* untuk menguji class Repository yang berisi kueri SQL hanya membuktikan bahwa kode Anda memanggil metode mock sesuai skenario palsu, tetapi sama sekali tidak mendeteksi jika ada salah ketik nama kolom atau sintaks SQL yang tidak valid!*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena objek mock hanya memverifikasi pemanggilan metode palsu, sehingga salah ketik nama kolom atau sintaks SQL yang tidak valid tidak terdeteksi sampai kode berjalan di produksi
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Mengandalkan 100% *Mock Object* untuk menguji class Repository yang berisi kueri SQL hanya membuktikan bahwa kode Anda memanggil metode mock sesuai skenario palsu, tetapi sama sekali tidak mendeteksi jika ada salah ketik nama kolom atau sintaks SQL yang tidak valid!

### Soal 2
Dalam pola pengujian integrasi database pada PHPUnit, apakah tujuan memanggil `$this->pdo->beginTransaction()` di dalam `setUp()` dan `$this->pdo->rollBack()` di dalam `tearDown()`?
- A. Mengenkripsi tabel database selama pengujian berlangsung
- B. Memastikan seluruh perubahan data (`INSERT`, `UPDATE`, `DELETE`) yang dilakukan oleh sebuah metode pengujian dibatalkan secara instan di akhir pengujian tersebut, sehingga pengujian berikutnya selalu berjalan di atas database yang bersih dan terisolasi tanpa biaya lambat membuat ulang tabel
- C. Mematikan pemeriksaan *foreign key* di database
- D. Menyimpan hasil pengujian ke dalam tabel database produksi

**Jawaban Benar:** B
**Penjelasan:** Membungkus setiap metode uji di dalam transaksi yang di-`rollBack()` pada `tearDown()` menjaga isolasi penuh antar-pengujian dengan kecepatan memori tanpa mengotori status tabel bagi pengujian berikutnya.

### Soal 3
Apa yang diuji oleh **HTTP / API Contract Integration Test** berbasis PSR-7?
- A. Hanya menguji kecepatan kartu grafis monitor pengguna
- B. Menguji rakitan alur permintaan dari hulu ke hilir: menyuntikkan objek permintaan HTTP (`ServerRequestInterface`) melewati barisan Middleware (autentikasi, CORS, CSRF) dan Controller, lalu memverifikasi bahwa kode status HTTP, header, serta struktur skema JSON pada `ResponseInterface` sesuai dengan kontrak API yang dijanjikan
- C. Hanya menguji apakah berkas CSS memiliki warna yang kontras
- D. Menggantikan fungsi analisis statis PHPStan

**Jawaban Benar:** B
**Penjelasan:** Pengujian integrasi HTTP memastikan bahwa seluruh komponen aplikasi (Router, Middleware, Dependency Injection, Controller, dan Serializer) terhubung dengan benar dan menghasilkan respons HTTP yang mematuhi kontrak API.

## Sumber

- [Fixtures (`setUp`/`tearDown`) — PHPUnit 12.5 Manual](https://docs.phpunit.de/en/12.5/fixtures.html)
- [PSR-7: HTTP Message Interface — PHP-FIG](https://www.php-fig.org/psr/psr-7/)
- [Transactions and auto-commit — PHP Manual](https://www.php.net/manual/en/pdo.transactions.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
