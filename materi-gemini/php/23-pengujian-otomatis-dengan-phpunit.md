# Pengujian Otomatis (Unit & Integration Testing) dengan PHPUnit 12

- **Tingkat:** Lanjut
- **Ringkasan:** Membangun suite pengujian otomatis kelas industri menggunakan **PHPUnit 12**, menguasai atribut `#[Test]` dan `#[DataProvider]`, menggunakan *Test Doubles* (`createStub` vs `createMock`), serta menguji repositori basis data secara terisolasi dengan SQLite *in-memory*.

## Mengapa Pengujian Otomatis Adalah Syarat Mutlak Kode Siap Kerja?

Bayangkan Anda mengubah satu baris rumus perhitungan pajak atau memperbarui kueri SQL di proyek yang memiliki 50 fitur. Tanpa pengujian otomatis, Anda tidak akan pernah yakin apakah perubahan tersebut diam-diam merusak fitur lain (*regression bug*).

Dengan **PHPUnit 12**, seluruh logika domain, layanan, dan kueri repositori dapat diverifikasi secara otomatis dalam hitungan milidetik setiap kali Anda menjalankan `vendor/bin/phpunit` atau setiap kali kode di-*push* ke GitHub Actions!

> Catatan versi: per Oktober 2026 PHPUnit 13 (membutuhkan PHP 8.4+) sudah dirilis. PHPUnit 12 (membutuhkan PHP 8.3+) masih mendapat perbaikan bug sampai 5 Februari 2027, dan contoh di pelajaran ini juga berlaku untuk PHPUnit 13.

## 1. Anatomi Test Case Modern di PHPUnit 12 (`#[Test]` & `#[DataProvider]`)

Di PHPUnit modern (versi 10, 11, dan **PHPUnit 12**), kita menggunakan atribut asli PHP 8 dari namespace `PHPUnit\Framework\Attributes\`:

```php
<?php

declare(strict_types=1);

namespace Kodeloka\Tests\Domain;

use InvalidArgumentException;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

final class KalkulatorDiskon
{
    public function hitungHargaAkhir(int $hargaAsli, int $persenDiskon): int
    {
        if ($hargaAsli < 0) {
            throw new InvalidArgumentException('Harga asli tidak boleh negatif.');
        }
        if ($persenDiskon < 0 || $persenDiskon > 100) {
            throw new InvalidArgumentException('Persentase diskon harus antara 0 hingga 100.');
        }

        $potongan = (int) round($hargaAsli * ($persenDiskon / 100));
        return $hargaAsli - $potongan;
    }
}

#[CoversClass(KalkulatorDiskon::class)]
final class KalkulatorDiskonTest extends TestCase
{
    /**
     * Metode DataProvider wajib bersifat public static dan mengembalikan array/iterable
     * berisi kumpulan skenario uji [argumen1, argumen2, ..., ekspektasi].
     */
    public static function skenarioDiskonValid(): array
    {
        return [
            'tanpa diskon (0%)'      => [100_000, 0, 100_000],
            'diskon normal (20%)'    => [100_000, 20, 80_000],
            'diskon penuh (100%)'    => [100_000, 100, 0],
            'harga nol tetap nol'    => [0, 50, 0],
        ];
    }

    #[Test]
    #[DataProvider('skenarioDiskonValid')]
    public function menghitungHargaAkhirDenganAkurat(
        int $hargaAsli,
        int $persenDiskon,
        int $ekspektasiAkhir,
    ): void {
        // 1. Arrange
        $kalkulator = new KalkulatorDiskon();

        // 2. Act
        $hasil = $kalkulator->hitungHargaAkhir($hargaAsli, $persenDiskon);

        // 3. Assert (Selalu gunakan assertSame untuk pemeriksaan tipe & nilai ketat ===)
        $this->assertSame($ekspektasiAkhir, $hasil);
    }

    #[Test]
    public function menolakPersentaseDiskonDiAtasSeratusPersen(): void
    {
        $kalkulator = new KalkulatorDiskon();

        // Pasang ekspektasi exception SEBELUM memanggil metode yang diuji!
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('antara 0 hingga 100');

        $kalkulator->hitungHargaAkhir(100_000, 150);
    }
}
```

## 2. Memahami *Test Doubles*: Kapan Memakai `createStub()` vs `createMock()`?

Saat menguji sebuah kelas layanan (misalnya `PendaftaranService` yang membutuhkan `PengirimSurelInterface`), kita tidak ingin pengujian unit benar-benar mengirim surel lewat jaringan internet. PHPUnit menyediakan dua alat pemalsu objek (*Test Doubles*) yang memiliki perbedaan peran sangat jelas:

1. **`$this->createStub(Interface::class)` (Stub — Mengatur Nilai Kembalian):**
   Gunakan **Stub** ketika Anda hanya ingin menyuplai objek tiruan yang mengembalikan nilai tertentu (misalnya nilai kurs mata uang atau data konfigurasi), tanpa peduli berapa kali metode tersebut dipanggil.
2. **`$this->createMock(Interface::class)` (Mock — Memverifikasi Interaksi/Perilaku):**
   Gunakan **Mock** ketika Anda ingin **memastikan bahwa suatu metode benar-benar dipanggil** dengan argumen tertentu (misalnya memastikan `$pengirimSurel->kirim(...)` benar-benar dipanggil tepat **satu kali** (`$this->once()`) dengan alamat surel peserta yang tepat!).

```php
<?php

declare(strict_types=1);

namespace Kodeloka\Tests\Service;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

interface GerbangPembayaranInterface
{
    public function tagih(int $nominal): bool;
}

interface PengirimNotifikasiInterface
{
    public function kirimKonfirmasi(string $surel, int $nominal): void;
}

final readonly class PembayaranService
{
    public function __construct(
        private GerbangPembayaranInterface $gerbang,
        private PengirimNotifikasiInterface $notifikasi,
    ) {}

    public function proses(string $surel, int $nominal): bool
    {
        if (!$this->gerbang->tagih($nominal)) {
            return false;
        }

        $this->notifikasi->kirimKonfirmasi($surel, $nominal);
        return true;
    }
}

final class PembayaranServiceTest extends TestCase
{
    #[Test]
    public function mengirimNotifikasiKetikaPenagihanBerhasil(): void
    {
        // 1. Stub: Kita hanya mengatur agar tagih() mengembalikan true
        $gerbangStub = $this->createStub(GerbangPembayaranInterface::class);
        $gerbangStub->method('tagih')->willReturn(true);

        // 2. Mock: Kita memverifikasi bahwa kirimKonfirmasi() WAJIB dipanggil tepat 1 kali
        //    dengan argumen ('nadia@asadinedu.com', 150000)!
        $notifikasiMock = $this->createMock(PengirimNotifikasiInterface::class);
        $notifikasiMock->expects($this->once())
            ->method('kirimKonfirmasi')
            ->with(
                $this->identicalTo('nadia@asadinedu.com'),
                $this->identicalTo(150_000),
            );

        $layanan = new PembayaranService($gerbangStub, $notifikasiMock);
        $berhasil = $layanan->proses('nadia@asadinedu.com', 150_000);

        $this->assertTrue($berhasil);
    }
}
```

## 3. Pengujian Integrasi Repositori Database dengan SQLite *In-Memory* (`setUp`)

Untuk menguji kelas `Repository` yang berisi kueri SQL PDO, memalsukan PDO dengan *Mock* adalah ide yang buruk karena tidak menguji apakah sintaks SQL Anda benar!

Cara terbaik dan tercepat adalah menggunakan basis data **SQLite In-Memory (`sqlite::memory:`)** yang dibuat baru di dalam metode siklus hidup **`protected function setUp(): void`**. Karena database dibuat baru di RAM sebelum setiap satu metode tes berjalan dan langsung hilang saat metode tes selesai, setiap pengujian **100% terisolasi, tidak meninggalkan data kotor, dan selesai dalam waktu kurang dari 5 milidetik**!

```php
<?php

declare(strict_types=1);

namespace Kodeloka\Tests\Repository;

use PDO;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

final class ModulRepositoryTest extends TestCase
{
    private PDO $pdo;

    protected function setUp(): void
    {
        // Dijalankan otomatis sebelum SETIAP satu metode #[Test] dimulai!
        $this->pdo = new PDO('sqlite::memory:', null, null, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);

        $this->pdo->exec(
            'CREATE TABLE modul (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT NOT NULL UNIQUE,
                judul TEXT NOT NULL
            )'
        );
    }

    #[Test]
    public function menyimpanDanMengambilModulBerdasarkanSlug(): void
    {
        $stmt = $this->pdo->prepare('INSERT INTO modul (slug, judul) VALUES (:slug, :judul)');
        $stmt->execute(['slug' => '01-pengantar', 'judul' => 'Pengantar PHP']);

        $cari = $this->pdo->prepare('SELECT slug, judul FROM modul WHERE slug = :slug');
        $cari->execute(['slug' => '01-pengantar']);
        $hasil = $cari->fetch();

        $this->assertSame([
            'slug'  => '01-pengantar',
            'judul' => 'Pengantar PHP',
        ], $hasil);
    }
}
```

## Latihan Praktik: Menulis Suite Pengujian Lengkap untuk `CatatanRepository`

Buatlah berkas `CatatanRepositoryTest.php`:
1. Siapkan koneksi `sqlite::memory:` di dalam `setUp()`.
2. Tulis 3 metode `#[Test]`: menguji penambahan catatan yang valid, menguji penghapusan catatan berdasarkan ID, dan menguji bahwa upaya menyisipkan judul yang kurang dari 3 karakter melempar `InvalidArgumentException` tanpa menambah baris ke tabel database.

## Kuis Pemahaman

### Soal 1
Apa perbedaan penggunaan antara `$this->createStub(Kelas::class)` dan `$this->createMock(Kelas::class)` di dalam PHPUnit 12?
- A. `createStub()` hanya bisa digunakan untuk class abstrak, sedangkan `createMock()` untuk interface.
- B. `createStub()` digunakan untuk membuat objek pengganti yang hanya mengonfigurasi nilai kembalian metode (*indirect inputs*), sedangkan `createMock()` digunakan ketika pengujian perlu memverifikasi ekspektasi perilaku (*behavior verification* seperti `$this->once()` dan `->with(...)`) bahwa suatu metode benar-benar dipanggil.
- C. `createMock()` terhubung ke database asli, sedangkan `createStub()` tidak.
- D. Keduanya tidak memiliki perbedaan sama sekali.

**Jawaban Benar:** B
**Penjelasan:** Dokumentasi resmi PHPUnit 12 menekankan pemisahan tegas antara *Stubs* (menggantikan dependensi untuk menyuplai nilai kembalian tanpa `expects()`) dan *Mocks* (memasang ekspektasi bahwa metode pada dependensi dipanggil dengan cara tertentu).

### Soal 2
Kapan metode siklus hidup `protected function setUp(): void` di dalam kelas turunan `PHPUnit\Framework\TestCase` dijalankan oleh PHPUnit?
- A. Hanya satu kali saja di awal sebelum seluruh berkas pengujian dimulai.
- B. Dijalankan berulang kali **tepat sebelum setiap satu metode pengujian (`#[Test]`) dieksekusi**, sehingga setiap metode pengujian mendapatkan instans objek dan kondisi awal yang segar serta terisolasi dari metode pengujian lainnya.
- C. Hanya ketika ada metode pengujian yang gagal.
- D. Di akhir setelah seluruh pengujian selesai.

**Jawaban Benar:** B
**Penjelasan:** `setUp()` dijalankan sebelum setiap satu metode tes individual, memastikan tidak ada perubahan state dari tes A yang membocori atau memengaruhi hasil tes B (*test isolation*).

### Soal 3
Mengapa metode penyedia data untuk atribut `#[DataProvider('namaMetode')]` di PHPUnit modern wajib dideklarasikan sebagai **`public static function`**?
- A. Agar metode tersebut tidak bisa menerima parameter.
- B. Karena PHPUnit memanggil metode *DataProvider* pada tahap pengumpulan dan pembangunan daftar skenario pengujian (*test suite discovery phase*), yaitu **sebelum** instans objek kelas tes dibuat untuk menjalankan masing-masing skenario.
- C. Karena PHP 8 melarang metode non-statis mengembalikan array.
- D. Agar hasil kembaliannya otomatis disimpan ke `localStorage`.

**Jawaban Benar:** B
**Penjelasan:** Sejak PHPUnit 10+, seluruh metode *DataProvider* wajib bersifat `public static` karena dievaluasi saat pembangunan pohon pengujian sebelum instans `TestCase` individual diciptakan.

## Sumber
- [Writing Tests for PHPUnit — PHPUnit 12.5 Manual](https://docs.phpunit.de/en/12.5/writing-tests-for-phpunit.html)
- [Organizing Tests — PHPUnit 12.5 Manual](https://docs.phpunit.de/en/12.5/organizing-tests.html)
- [Test Doubles — PHPUnit 12.5 Manual](https://docs.phpunit.de/en/12.5/test-doubles.html)
- [Supported Versions of PHPUnit](https://phpunit.de/supported-versions.html)
