# Akses Basis Data Aman dengan PDO, Prepared Statements, dan Transaksi

- **Tingkat:** Menengah
- **Ringkasan:** Menghubungkan PHP ke basis data (PostgreSQL, MySQL, SQLite) menggunakan ekstensi PDO dan `PDO::connect()` (PHP 8.4), menangkal *SQL Injection* secara mutlak dengan *Prepared Statements*, serta menjaga konsistensi data dengan transaksi (`beginTransaction`, `commit`, `rollBack`).

## Mengapa Menggunakan PDO (*PHP Data Objects*)?

**PDO** adalah lapisan abstraksi akses basis data bawaan PHP yang menyediakan **antarmuka metode yang seragam** untuk berbagai mesin basis data—mulai dari **PostgreSQL**, **MySQL / MariaDB**, hingga **SQLite** dan **SQL Server**.

Sejak **PHP 8.4**, selain konstruktor `new PDO(...)`, hadir metode pabrik statis **`PDO::connect($dsn, $user, $password, $options)`** yang secara cerdas mengembalikan objek subkelas spesifik driver (seperti `Pdo\Pgsql`, `Pdo\Mysql`, atau `Pdo\Sqlite`) apabila Anda membutuhkan fitur khusus dari basis data tersebut!

## 1. Membuat Koneksi PDO dengan Opsi Produksi yang Tepat

Saat membuka koneksi PDO, biasakan mengatur tiga atribut konfigurasi penting ini:
1. **`PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION`:** Memastikan PDO selalu melempar `PDOException` saat terjadi kesalahan SQL *(sudah menjadi bawaan sejak PHP 8.0, namun baik ditulis eksplisit)*.
2. **`PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC`:** Mengembalikan baris hasil kueri sebagai array asosiatif bersih (`['id' => 1, 'judul' => '...']`) tanpa duplikasi indeks angka yang memboroskan memori.
3. **`PDO::ATTR_EMULATE_PREPARES => false`:** Memerintahkan PDO untuk menggunakan **Native Prepared Statements** asli milik server basis data (bukan emulasi penggantian string di sisi PHP!).

```php
<?php

declare(strict_types=1);

function buatKoneksiPdo(string $dsn, ?string $pengguna = null, ?string $sandi = null): PDO
{
    $opsi = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    // Sejak PHP 8.4, kita dapat menggunakan PDO::connect() (atau new PDO() di PHP 8.2+):
    return PDO::connect($dsn, $pengguna, $sandi, $opsi);
}

// Contoh DSN untuk PostgreSQL:
// $pdo = buatKoneksiPdo('pgsql:host=127.0.0.1;port=5432;dbname=kodeloka', 'app_user', 'rahasia');

// Contoh DSN untuk SQLite (sangat praktis untuk pengembangan dan pengujian!):
$pdo = buatKoneksiPdo('sqlite::memory:');
```

## 2. Mencegah SQL Injection secara Mutlak dengan *Prepared Statements*

**SQL Injection (SQLi)** terjadi ketika pengembang menyambungkan variabel masukan pengguna langsung ke dalam string kueri SQL:

```php
// 🚫 SANGAT BERBAHAYA (RENTAN SQL INJECTION!):
// Jika pengguna memasukkan $surel = "' OR '1'='1", maka seluruh isi tabel pengguna bocor!
// Lebih buruk lagi jika dikombinasikan dengan perintah perusak data.
$hasil = $pdo->query("SELECT * FROM pengguna WHERE surel = '{$surel}'");
```

### Bagaimana *Prepared Statements* Mematikan SQL Injection 100%?
Ketika Anda menggunakan **`$pdo->prepare(...)`** diikuti **`$stmt->execute(...)`** (dengan `ATTR_EMULATE_PREPARES => false`), komunikasi ke server basis data dibagi menjadi **dua paket terpisah**:
1. **Paket 1 (Struktur Perintah SQL):** PHP mengirim cetak biru kueri dengan tanda tanya `?` atau parameter bernama `:surel` (`SELECT id, nama, surel FROM pengguna WHERE surel = :surel`). Server basis data langsung mengompilasi dan mengunci pohon struktur perintah SQL tersebut!
2. **Paket 2 (Data Parameter Murni):** PHP mengirimkan isi variabel `$surel` secara terpisah. Karena pohon perintah SQL sudah selesai dikompilasi pada Paket 1, **isi parameter di Paket 2 tidak mungkin lagi mengubah struktur logika SQL**, seberapapun banyaknya tanda kutip `'` atau kata `OR 1=1` di dalamnya!

```php
<?php

declare(strict_types=1);

function cariPenggunaBerdasarkanSurel(PDO $pdo, string $surel): ?array
{
    // 1. Siapkan cetak biru kueri dengan parameter bernama (:surel)
    $stmt = $pdo->prepare(
        'SELECT id, nama, surel, peran
         FROM pengguna
         WHERE surel = :surel
         LIMIT 1'
    );

    // 2. Jalankan kueri dengan mengirimkan array nilai parameternya secara terpisah
    $stmt->execute(['surel' => $surel]);

    // 3. Ambil satu baris hasil (fetch() mengembalikan false jika tidak ditemukan)
    $baris = $stmt->fetch();

    return $baris !== false ? $baris : null;
}
```

### Menyimpan Data Baru dan Mengambil ID Terakhir (`lastInsertId` / `RETURNING`)
```php
<?php

declare(strict_types=1);

function tambahModulBaru(PDO $pdo, string $slug, string $judul, int $durasiMenit): int
{
    $stmt = $pdo->prepare(
        'INSERT INTO modul (slug, judul, durasi_menit)
         VALUES (:slug, :judul, :durasi)'
    );

    $stmt->execute([
        'slug'   => $slug,
        'judul'  => $judul,
        'durasi' => $durasiMenit,
    ]);

    return (int) $pdo->lastInsertId();
}
```

> **⚠️ Bagaimana Jika Nama Kolom `ORDER BY` Berasal dari Pilihan Pengguna?**
> Parameter *Prepared Statement* (`:kolom`) hanya boleh digunakan untuk **nilai data**, tidak bisa digunakan untuk menggantikan nama tabel atau nama kolom pada `ORDER BY`. Jika pengguna memilih urutan kolom dari dropdown, **wajib validasi dengan daftar putih (*allowlist*) ketat menggunakan ekspresi `match`**:
> ```php
> $kolomUrut = match ($inputUrut) {
>     'judul'  => 'judul ASC',
>     'durasi' => 'durasi_menit DESC',
>     default  => 'id ASC',
> };
> // Aman karena $kolomUrut 100% berasal dari string literal di dalam match kita sendiri!
> $sql = "SELECT id, judul, durasi_menit FROM modul ORDER BY {$kolomUrut}";
> ```

## 3. Menjaga Konsistensi Data dengan Transaksi Database (`ACID`)

Bayangkan sebuah proses pemindahan poin atau pembuatan pesanan yang terdiri dari **dua langkah perubahan tabel**:
1. Mengurangi stok barang di tabel `produk`.
2. Mencatat baris pesanan baru di tabel `pesanan`.

Apa yang terjadi jika langkah 1 berhasil dijalankan, tetapi tepat pada langkah 2 listrik server mati atau terjadi galat? Stok barang sudah terlanjur berkurang, padahal pesanan tidak pernah tercatat!

Untuk menjamin kedua langkah tersebut bersifat **Atomik (berhasil semuanya atau batal semuanya)**, bungkus keduanya di dalam **Transaksi PDO** menggunakan `beginTransaction()`, `commit()`, dan `rollBack()` di dalam blok `try...catch`:

```php
<?php

declare(strict_types=1);

function prosesPesananBarang(PDO $pdo, int $idProduk, int $idPengguna, int $jumlah): int
{
    // 1. Mulai transaksi (mematikan mode auto-commit sementara)
    $pdo->beginTransaction();

    try {
        // Langkah A: Kurangi stok hanya jika stok mencukupi
        $stmtStok = $pdo->prepare(
            'UPDATE produk
             SET stok = stok - :jumlah
             WHERE id = :id_produk AND stok >= :jumlah'
        );
        $stmtStok->execute([
            'jumlah'    => $jumlah,
            'id_produk' => $idProduk,
        ]);

        if ($stmtStok->rowCount() === 0) {
            throw new DomainException('Stok produk tidak mencukupi atau produk tidak ditemukan.');
        }

        // Langkah B: Catat pesanan baru
        $stmtPesanan = $pdo->prepare(
            'INSERT INTO pesanan (produk_id, pengguna_id, jumlah, waktu_pesan)
             VALUES (:produk_id, :pengguna_id, :jumlah, :waktu)'
        );
        $stmtPesanan->execute([
            'produk_id'   => $idProduk,
            'pengguna_id' => $idPengguna,
            'jumlah'      => $jumlah,
            'waktu'       => gmdate('Y-m-d H:i:s'),
        ]);

        $idPesananBaru = (int) $pdo->lastInsertId();

        // 2. Jika semua langkah sukses tanpa galat, simpan permanen (COMMIT)!
        $pdo->commit();

        return $idPesananBaru;
    } catch (Throwable $e) {
        // 3. Jika terjadi galat apa pun, batalkan seluruh perubahan sejak beginTransaction()!
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}
```

## Latihan Praktik: Repositori Modul dengan SQLite In-Memory dan Transaksi

Buatlah berkas `latihan-pdo.php` dan jalankan dengan `php latihan-pdo.php`:
1. Buka koneksi `PDO::connect('sqlite::memory:')` dengan opsi standar produksi.
2. Buat tabel `kelas (id INTEGER PRIMARY KEY, slug TEXT UNIQUE, judul TEXT)` dan `modul (id INTEGER PRIMARY KEY, kelas_id INTEGER, judul TEXT)`.
3. Buat fungsi `simpanKelasBesertaModul(PDO $pdo, string $slug, string $judulKelas, array $daftarJudulModul): void` yang menggunakan transaksi `beginTransaction()` / `commit()` / `rollBack()` untuk menyimpan satu kelas beserta seluruh modulnya secara atomik.

## Kuis Pemahaman

### Soal 1
Mengapa mengatur opsi `PDO::ATTR_EMULATE_PREPARES => false` sangat disarankan saat membuat koneksi PDO?
- A. Agar PDO tidak memerlukan kata sandi basis data.
- B. Agar PDO mengirimkan cetak biru kueri SQL dan data parameter secara terpisah menggunakan fitur *Native Prepared Statements* asli milik server basis data, alih-alih sekadar merangkai string kueri tiruan di dalam memori PHP.
- C. Agar hasil kueri otomatis diubah menjadi objek JSON.
- D. Agar seluruh tabel otomatis dihapus setelah skrip selesai.

**Jawaban Benar:** B
**Penjelasan:** Saat emulasi dimatikan (`false`), server basis data mengompilasi struktur kueri SQL terlebih dahulu secara terpisah dari pengiriman nilai parameter, memberikan perlindungan paling kokoh terhadap SQL Injection sekaligus memastikan tipe data asli dari kolom basis data tetap terjaga.

### Soal 2
Dalam sebuah blok transaksi PDO (`$pdo->beginTransaction()`), apa yang terjadi apabila salah satu kueri di tengah proses melempar exception dan kita menangkapnya di blok `catch (Throwable $e)` lalu memanggil `$pdo->rollBack()`?
- A. Hanya kueri terakhir yang gagal yang dibatalkan, sementara kueri `UPDATE` atau `INSERT` sebelumnya di dalam transaksi tersebut tetap tersimpan di basis data.
- B. Seluruh perubahan data (`INSERT`, `UPDATE`, `DELETE`) yang dilakukan sejak pemanggilan `$pdo->beginTransaction()` dibatalkan sepenuhnya sehingga basis data kembali ke keadaan semula yang konsisten.
- C. Koneksi basis data terputus secara permanen.
- D. Tabel yang sedang diakses akan terkunci selamanya.

**Jawaban Benar:** B
**Penjelasan:** Prinsip *Atomicity* pada transaksi basis data menjamin bahwa seluruh operasi di antara `beginTransaction()` dan `commit()` diperlakukan sebagai satu kesatuan utuh: jika `rollBack()` dipanggil, semua perubahan yang sudah sempat dijalankan di dalam transaksi tersebut ditarik kembali.

### Soal 3
Apa nilai kembalian dari `$stmt->fetch()` ketika kueri `SELECT` tidak menemukan satu pun baris yang cocok di basis data?
- A. Array kosong `[]`
- B. `null`
- C. `false`
- D. Melempar `PDOException`

**Jawaban Benar:** C
**Penjelasan:** Metode `PDOStatement::fetch()` mengembalikan nilai boolean `false` apabila tidak ada lagi baris data yang dapat diambil (berbeda dengan `fetchAll()` yang mengembalikan array kosong `[]` jika tidak ada hasil).

## Sumber
- [PDO (PHP Data Objects) — PHP Manual](https://www.php.net/manual/en/book.pdo.php)
- [`PDO::prepare` — PHP Manual](https://www.php.net/manual/en/pdo.prepare.php)
- [Transactions and auto-commit — PHP Manual](https://www.php.net/manual/en/pdo.transactions.php)
- [SQL Injection Prevention Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
