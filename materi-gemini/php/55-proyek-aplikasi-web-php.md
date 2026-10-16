# Proyek Akhir Kelas PHP: Aplikasi Manajemen Modul & Catatan Belajar Aman

- **Tingkat:** Lanjut
- **Ringkasan:** Membangun aplikasi web PHP 8.4/8.5 berarsitektur bersih dari nol yang memadukan PSR-4 Autoloading, Backed Enum, Readonly & Asymmetric Visibility, PDO Prepared Statements & Transaksi, autentikasi `password_hash()`, proteksi CSRF `hash_equals()`, serta keluaran HTML bebas XSS.

## Gambaran Proyek

Selamat! Anda telah menuntaskan seluruh perjalanan di Kelas PHP Kodeloka—mulai dari siklus versi dan model eksekusi PHP, sistem tipe ketat `declare(strict_types=1)`, ekspresi `match` dan operator pipe `|>`, pengolahan string multibyte `mb_*` dan fungsi array baru PHP 8.4/8.5, OOP modern dengan *Property Hooks* dan *Asymmetric Visibility*, Enum & Exception, Composer & PSR-4, penanganan request HTTP dan pencegahan XSS, manajemen sesi & cookie, unggah berkas dengan `finfo`, akses basis data PDO, keamanan kata sandi & CSRF, pengujian PHPUnit, hingga penyajian produksi dengan PHP-FPM.

Dalam proyek akhir ini, kita akan merakit **Aplikasi Pengelola Catatan Belajar Kodeloka** yang menerapkan seluruh standar keamanan dan arsitektur bersih tersebut:

```
proyek-catatan-kodeloka/
├── composer.json
├── public/
│   └── index.php                  <-- Front Controller (Routing, Session, CSRF, & View)
├── src/
│   ├── Domain/
│   │   ├── PrioritasCatatan.php   <-- Backed Enum (PHP 8.1+)
│   │   └── Catatan.php            <-- Entitas Readonly (PHP 8.2+)
│   ├── Keamanan/
│   │   └── PenjagaKeamanan.php    <-- Helper XSS e(), CSRF hash_equals(), & Sesi Aman
│   └── Repository/
│       └── CatatanRepository.php  <-- PDO Prepared Statements & Transaksi
└── tests/
    └── CatatanRepositoryTest.php  <-- Pengujian Otomatis PHPUnit 12
```

## Kode Lengkap Proyek

### 1. Backed Enum Prioritas (`src/Domain/PrioritasCatatan.php`)

```php
<?php

declare(strict_types=1);

namespace Kodeloka\Catatan\Domain;

enum PrioritasCatatan: string
{
    case Rendah  = 'rendah';
    case Normal  = 'normal';
    case Penting = 'penting';

    public function label(): string
    {
        return match ($this) {
            self::Rendah  => 'Rendah',
            self::Normal  => 'Normal',
            self::Penting => 'Penting ★',
        };
    }
}
```

### 2. Entitas Readonly (`src/Domain/Catatan.php`)

```php
<?php

declare(strict_types=1);

namespace Kodeloka\Catatan\Domain;

readonly class Catatan
{
    public function __construct(
        public int $id,
        public string $judul,
        public string $isi,
        public PrioritasCatatan $prioritas,
        public string $dibuatPada,
    ) {}

    public static function dariBarisDb(array $baris): self
    {
        return new self(
            id: (int) $baris['id'],
            judul: (string) $baris['judul'],
            isi: (string) $baris['isi'],
            prioritas: PrioritasCatatan::tryFrom((string) $baris['prioritas']) ?? PrioritasCatatan::Normal,
            dibuatPada: (string) $baris['dibuat_pada'],
        );
    }
}
```

### 3. Utilitas Keamanan Sesi, CSRF, dan Anti-XSS (`src/Keamanan/PenjagaKeamanan.php`)

```php
<?php

declare(strict_types=1);

namespace Kodeloka\Catatan\Keamanan;

final class PenjagaKeamanan
{
    public static function mulaiSesi(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        ini_set('session.use_strict_mode', '1');
        ini_set('session.use_only_cookies', '1');

        session_set_cookie_params([
            'lifetime' => 0,
            'path'     => '/',
            'secure'   => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
            'httponly' => true,
            'samesite' => 'Lax',
        ]);

        session_start();
    }

    public static function e(string|int|float|null $nilai): string
    {
        return htmlspecialchars(
            (string) $nilai,
            ENT_QUOTES | ENT_SUBSTITUTE,
            'UTF-8',
        );
    }

    public static function tokenCsrf(): string
    {
        self::mulaiSesi();
        if (empty($_SESSION['_csrf_token'])) {
            $_SESSION['_csrf_token'] = bin2hex(random_bytes(32));
        }
        return (string) $_SESSION['_csrf_token'];
    }

    public static function verifikasiCsrf(?string $tokenMasukan): bool
    {
        self::mulaiSesi();
        $tokenSesi = (string) ($_SESSION['_csrf_token'] ?? '');
        if ($tokenSesi === '' || $tokenMasukan === null || $tokenMasukan === '') {
            return false;
        }
        return hash_equals($tokenSesi, $tokenMasukan);
    }
}
```

### 4. Repositori Basis Data PDO (`src/Repository/CatatanRepository.php`)

```php
<?php

declare(strict_types=1);

namespace Kodeloka\Catatan\Repository;

use InvalidArgumentException;
use Kodeloka\Catatan\Domain\Catatan;
use Kodeloka\Catatan\Domain\PrioritasCatatan;
use PDO;

final class CatatanRepository
{
    public function __construct(
        private readonly PDO $pdo,
    ) {}

    public function inisialisasiSkema(): void
    {
        $this->pdo->exec(
            'CREATE TABLE IF NOT EXISTS catatan (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                judul TEXT NOT NULL,
                isi TEXT NOT NULL,
                prioritas TEXT NOT NULL DEFAULT \'normal\',
                dibuat_pada TEXT NOT NULL
            )'
        );
    }

    /**
     * @return list<Catatan>
     */
    public function ambilSemua(): array
    {
        $stmt = $this->pdo->query(
            'SELECT id, judul, isi, prioritas, dibuat_pada
             FROM catatan
             ORDER BY id DESC'
        );

        $daftarBaris = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map(Catatan::dariBarisDb(...), $daftarBaris);
    }

    public function tambah(string $judul, string $isi, PrioritasCatatan $prioritas): int
    {
        $judulBersih = trim($judul);
        $isiBersih   = trim($isi);

        if (mb_strlen($judulBersih) < 3 || mb_strlen($judulBersih) > 120) {
            throw new InvalidArgumentException('Judul catatan harus antara 3 hingga 120 karakter.');
        }
        if ($isiBersih === '') {
            throw new InvalidArgumentException('Isi catatan tidak boleh kosong.');
        }

        // Prepared Statement: 100% aman dari SQL Injection!
        $stmt = $this->pdo->prepare(
            'INSERT INTO catatan (judul, isi, prioritas, dibuat_pada)
             VALUES (:judul, :isi, :prioritas, :dibuat_pada)'
        );

        $stmt->execute([
            'judul'       => $judulBersih,
            'isi'         => $isiBersih,
            'prioritas'   => $prioritas->value,
            'dibuat_pada' => gmdate('Y-m-d\TH:i:s\Z'),
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    public function hapus(int $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM catatan WHERE id = :id');
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    }
}
```

### 5. Front Controller (`public/index.php`)

```php
<?php

declare(strict_types=1);

use Kodeloka\Catatan\Domain\PrioritasCatatan;
use Kodeloka\Catatan\Keamanan\PenjagaKeamanan as Aman;
use Kodeloka\Catatan\Repository\CatatanRepository;

require dirname(__DIR__) . '/vendor/autoload.php';

Aman::mulaiSesi();

// Koneksi PDO SQLite dengan konfigurasi ketat
$jalurDb = dirname(__DIR__) . '/storage/catatan.sqlite';
$pdo = new PDO('sqlite:' . $jalurDb, null, null, [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
]);

$repo = new CatatanRepository($pdo);
$repo->inisialisasiSkema();

$pesanGalat = null;

// Menangani pengiriman formulir POST (dilindungi token CSRF!)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!Aman::verifikasiCsrf($_POST['csrf_token'] ?? null)) {
        http_response_code(403);
        exit('Token keamanan CSRF tidak valid.');
    }

    $aksi = (string) ($_POST['aksi'] ?? '');

    try {
        if ($aksi === 'tambah') {
            $prioritas = PrioritasCatatan::tryFrom((string) ($_POST['prioritas'] ?? ''))
                ?? PrioritasCatatan::Normal;

            $repo->tambah(
                judul: (string) ($_POST['judul'] ?? ''),
                isi: (string) ($_POST['isi'] ?? ''),
                prioritas: $prioritas,
            );
        } elseif ($aksi === 'hapus') {
            $idHapus = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
            if (is_int($idHapus) && $idHapus > 0) {
                $repo->hapus($idHapus);
            }
        }

        // Pola Post/Redirect/Get (PRG) agar menekan F5 di peramban tidak mengirim ulang form POST!
        header('Location: /', true, 303);
        exit;
    } catch (InvalidArgumentException $e) {
        http_response_code(422);
        $pesanGalat = $e->getMessage();
    }
}

$daftarCatatan = $repo->ambilSemua();
$tokenCsrf = Aman::tokenCsrf();
?>
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catatan Belajar Aman — Kodeloka PHP</title>
  </head>
  <body>
    <main>
      <h1>Catatan Belajar Kodeloka</h1>

      <?php if ($pesanGalat !== null): ?>
        <p role="alert"><strong>Galat:</strong> <?= Aman::e($pesanGalat) ?></p>
      <?php endif; ?>

      <section aria-labelledby="judul-form">
        <h2 id="judul-form">Tambah Catatan Baru</h2>
        <form action="/" method="post">
          <input type="hidden" name="csrf_token" value="<?= Aman::e($tokenCsrf) ?>">
          <input type="hidden" name="aksi" value="tambah">

          <div>
            <label for="input-judul">Judul Modul / Topik</label>
            <input type="text" id="input-judul" name="judul" required minlength="3" maxlength="120">
          </div>

          <div>
            <label for="pilih-prioritas">Prioritas</label>
            <select id="pilih-prioritas" name="prioritas">
              <?php foreach (PrioritasCatatan::cases() as $kasus): ?>
                <option value="<?= Aman::e($kasus->value) ?>">
                  <?= Aman::e($kasus->label()) ?>
                </option>
              <?php endforeach; ?>
            </select>
          </div>

          <div>
            <label for="input-isi">Ringkasan Catatan</label>
            <textarea id="input-isi" name="isi" rows="4" required></textarea>
          </div>

          <button type="submit">Simpan Catatan</button>
        </form>
      </section>

      <section aria-labelledby="judul-daftar">
        <h2 id="judul-daftar">Daftar Catatan Tersimpan (<?= count($daftarCatatan) ?>)</h2>
        <?php foreach ($daftarCatatan as $catatan): ?>
          <article>
            <header>
              <h3><?= Aman::e($catatan->judul) ?></h3>
              <span>Prioritas: <?= Aman::e($catatan->prioritas->label()) ?></span>
              <time datetime="<?= Aman::e($catatan->dibuatPada) ?>"><?= Aman::e($catatan->dibuatPada) ?></time>
            </header>
            <p><?= nl2br(Aman::e($catatan->isi)) ?></p>
            <form action="/" method="post">
              <input type="hidden" name="csrf_token" value="<?= Aman::e($tokenCsrf) ?>">
              <input type="hidden" name="aksi" value="hapus">
              <input type="hidden" name="id" value="<?= Aman::e($catatan->id) ?>">
              <button type="submit">Hapus Catatan</button>
            </form>
          </article>
        <?php endforeach; ?>
      </section>
    </main>
  </body>
</html>
```

## Kuis Pemahaman

### Soal 1
Dalam Front Controller `public/index.php` di atas, mengapa setelah berhasil memproses permintaan `POST` (menambah atau menghapus catatan), server mengirimkan `header('Location: /', true, 303); exit;`?
- A. Karena PHP tidak mampu merender HTML pada permintaan `POST`.
- B. Untuk menerapkan pola **Post/Redirect/Get (PRG)** dengan status HTTP `303 See Other`, sehingga jika pengguna memuat ulang halaman (*refresh* / menekan tombol `F5`) setelah menyimpan catatan, peramban hanya akan melakukan permintaan `GET /` yang aman tanpa mengirim ulang formulir `POST` (mencegah duplikasi data!).
- C. Untuk menghapus seluruh cookie pengguna.
- D. Agar basis data SQLite otomatis ditutup.

**Jawaban Benar:** B
**Penjelasan:** Jika permintaan `POST` langsung dibalas dengan halaman HTML `200 OK`, maka menekan tombol *Refresh* di peramban akan memunculkan peringatan *"Confirm Form Resubmission"* dan mengirim ulang data `POST` yang sama untuk kedua kalinya. Pola *Post/Redirect/Get (PRG)* dengan status `303 See Other` mengalihkan peramban ke permintaan `GET` yang bersih.

### Soal 2
Perhatikan baris `<?= nl2br(Aman::e($catatan->isi)) ?>` saat menampilkan isi catatan multi-baris di atas. Mengapa `Aman::e()` (`htmlspecialchars`) **wajib dipanggil di bagian dalam terlebih dahulu** sebelum `nl2br()`, dan bukan sebaliknya (`Aman::e(nl2br($catatan->isi))`)?
- A. Karena `nl2br()` hanya menerima string yang sudah di-escape.
- B. Karena jika `nl2br()` dipanggil lebih dulu baru kemudian dibungkus `htmlspecialchars()`, maka tag `<br />` yang dihasilkan oleh `nl2br()` akan ikut diubah menjadi teks `&lt;br /&gt;` yang tercetak mentah di layar; sebaliknya, memanggil `Aman::e()` lebih dulu mengamankan seluruh input pengguna dari XSS, baru kemudian `nl2br()` mengubah baris baru menjadi `<br />` yang aman.
- C. Karena `nl2br()` sudah otomatis mencegah XSS.
- D. Urutan pemanggilan keduanya tidak berpengaruh sama sekali.

**Jawaban Benar:** B
**Penjelasan:** Urutan ini sangat penting: kita harus membersihkan seluruh karakter HTML berbahaya dari masukan pengguna terlebih dahulu dengan `htmlspecialchars()`, barulah kita mengubah karakter baris baru (`\n`) menjadi tag `<br />` melalui `nl2br()`.

### Soal 3
Bagaimana metode `ambilSemua()` di dalam `CatatanRepository` mengubah array baris mentah dari PDO menjadi array objek `Catatan` dengan sintaks PHP 8.1+ yang ringkas?
- A. Menggunakan `array_map(Catatan::dariBarisDb(...), $daftarBaris)` dengan sintaks *First-Class Callable*.
- B. Menggunakan `json_decode(json_encode($daftarBaris))`.
- C. Menggunakan `eval()` untuk setiap baris.
- D. Menggunakan `extract($daftarBaris)`.

**Jawaban Benar:** A
**Penjelasan:** `Catatan::dariBarisDb(...)` adalah sintaks *First-Class Callable* (PHP 8.1+) yang membuat referensi `Closure` langsung ke metode pabrik statis `Catatan::dariBarisDb`, sehingga dapat diteruskan dengan sangat bersih ke `array_map()`.

## Sumber
- [PHP Manual — Language Reference](https://www.php.net/manual/en/langref.php)
- [PDO — PHP Manual](https://www.php.net/manual/en/book.pdo.php)
- [Cross-Site Request Forgery Prevention Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Cross Site Scripting Prevention Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
