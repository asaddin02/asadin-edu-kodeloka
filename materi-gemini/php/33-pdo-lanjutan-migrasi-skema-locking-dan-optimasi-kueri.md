# PDO Lanjutan: Migrasi Skema Database, Pessimistic vs Optimistic Locking, dan Pencegahan N+1 Query

- **Tingkat:** Lanjut
- **Ringkasan:** Mengelola perubahan tabel basis data secara terukur menggunakan sistem migrasi berversi, mencegah kondisi balapan saldo ganda (*race condition*) dengan `SELECT ... FOR UPDATE` (*Pessimistic Locking*) atau kolom `versi` (*Optimistic Locking*), serta mendeteksi dan memperbaiki masalah **N+1 Query**.

## Bagaimana Penyerang Dapat Menarik SaldoRp 1.000.000 Berkali-kali Hanya dari Saldo Rp 100.000?

Bayangkan pengguna memiliki saldo dompet **Rp 100.000**. Jika kode PHP Anda menjalankan pola *Baca-Periksa-Tulis* biasa tanpa penguncian:
1. Baris 1: `SELECT saldo FROM dompet WHERE id = 1` (mendapat `100000`).
2. Baris 2: `if ($saldo >= 100000)` (lolos!).
3. Baris 3: `UPDATE dompet SET saldo = saldo - 100000 WHERE id = 1`.

Ketika penyerang mengirimkan **10 permintaan HTTP `POST /tarik-saldo` secara serentak di milidetik yang sama**, kesepuluh proses worker PHP akan mengeksekusi Baris 1 secara bersamaan sebelum satu pun sempat mencapai Baris 3! Akibatnya, kesepuluh worker sama-sama melihat saldo masih `100000`, kesepuluhnya meloloskan `if`, dan penyerang berhasil mencairkan uang 10 kali lipat (**Race Condition / Time-of-Check to Time-of-Use — TOCTOU**)!

> **🚫 Kerentanan & Kesalahan Umum:** Membaca saldo pengguna dengan `SELECT saldo FROM dompet`, mengeceknya di PHP (`if ($saldo >= $tarik)`), lalu melakukan `UPDATE dompet SET saldo = ...` tanpa mengunci baris di dalam transaksi memungkinkan penyerang mengirim 10 permintaan paralel untuk menarik uang berkali-kali melebihi saldonya!

## 1. Perbandingan Strategi Penguncian Konkurensi: Pessimistic vs Optimistic Locking

Untuk mencegah kondisi balapan pada modifikasi data konkuren di PDO, pilih strategi penguncian yang tepat:

| Strategi Penguncian | Mekanisme SQL & PDO | Keunggulan & Karakteristik | Kapan Harus Dipilih? |
| :--- | :--- | :--- | :--- |
| **Pessimistic Locking** (`SELECT ... FOR UPDATE`) | Di dalam `$pdo->beginTransaction()`, `SELECT ... FOR UPDATE` mengunci baris target hingga `commit()` atau `rollBack()`. | Transaksi paralel lain yang meminta baris yang sama dipaksa **mengantre tunggu** secara berurutan. | **Mutasi finansial kritis** dengan potensi tabrakan tinggi (penarikan saldo dompet, pemotongan kuota kursi/voucher kilat). |
| **Optimistic Locking** (Kolom `versi`) | Tanpa mengunci saat `SELECT`; saat `UPDATE` tambahkan syarat `WHERE id = :id AND versi = :versiLama` lalu periksa **`$stmt->rowCount() === 1`**. | Tidak menahan kunci transaksi selama pengguna berpikir/mengisi form; jika `$rowCount === 0`, berarti sudah diubah orang lain. | Penyuntingan dokumen kolaboratif, pembaruan stok katalog reguler, atau formulir pengaturan admin. |
| **Atomic Conditional Update** | Satu kueri langsung: `UPDATE dompet SET saldo = saldo - :tarik WHERE id = :id AND saldo >= :tarik`. | Paling cepat (hanya 1 perjalanan bolak-balik ke DB); database mengunci baris secara atomik selama `UPDATE`. | Pengurangan saldo/kuota sederhana yang tidak membutuhkan perhitungan bercabang di PHP sebelum `UPDATE`. |

## 2. Implementasi *Pessimistic Locking* (`FOR UPDATE`) dan *Optimistic Locking* (`versi`) di PDO

Berikut adalah implementasi kedua teknik penguncian tersebut menggunakan PDO dengan `declare(strict_types=1)`:

```php
<?php
declare(strict_types=1);

// 1. PESSIMISTIC LOCKING: Mengunci baris dengan SELECT ... FOR UPDATE di dalam transaksi
function tarikSaldoPessimistic(PDO $pdo, int $idDompet, int $nominalTarikan): void
{
    $pdo->beginTransaction();
    try {
        // Kunci baris dompet hingga transaksi selesai; proses lain pada idDompet ini wajib mengantre!
        $stmt = $pdo->prepare('SELECT saldo FROM dompet WHERE id = :id FOR UPDATE');
        $stmt->execute([':id' => $idDompet]);
        $baris = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$baris || (int) $baris['saldo'] < $nominalTarikan) {
            throw new RuntimeException('Saldo tidak mencukupi.');
        }

        $ubah = $pdo->prepare('UPDATE dompet SET saldo = saldo - :nominal WHERE id = :id');
        $ubah->execute([':nominal' => $nominalTarikan, ':id' => $idDompet]);
        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}

// 2. OPTIMISTIC LOCKING: Memeriksa nomor versi baris saat UPDATE tanpa menahan kunci
function perbaruiHargaProdukOptimistic(PDO $pdo, int $idProduk, int $hargaBaru, int $versiSaatDibaca): void
{
    $stmt = $pdo->prepare(
        'UPDATE produk
         SET harga = :harga, versi = versi + 1
         WHERE id = :id AND versi = :versi_lama'
    );
    $stmt->execute([
        ':harga'      => $hargaBaru,
        ':id'         => $idProduk,
        ':versi_lama' => $versiSaatDibaca,
    ]);

    if ($stmt->rowCount() === 0) {
        throw new RuntimeException('Konflik perubahan: produk ini baru saja diubah oleh pengguna lain. Silakan muat ulang.');
    }
}
```

## 3. Memahami dan Menyembuhkan Masalah *N+1 Query*

Masalah performa database paling umum di aplikasi backend adalah **N+1 Query**: Anda menjalankan **1 kueri** untuk mengambil 50 artikel terbaru (`SELECT * FROM artikel LIMIT 50`), lalu di dalam perulangan `foreach ($daftarArtikel as $artikel)`, Anda menjalankan **50 kueri tambahan** (`SELECT nama FROM penulis WHERE id = :id_penulis`) satu per satu! Totalnya menjadi **51 perjalanan jaringan bolak-balik** ke server database.

Solusinya adalah mengambil data relasi sekaligus hanya dalam **1 kueri tambahan (total 2 kueri)** menggunakan klausa `WHERE id IN (...)` atau menggabungkannya dengan `JOIN`:

```php
<?php
declare(strict_types=1);

/**
 * Memuat penulis untuk seluruh artikel hanya dengan 1 kueri tambahan (Mencegah N+1 Query).
 *
 * @param list<array{id: int, judul: string, penulis_id: int}> $daftarArtikel
 * @return list<array{id: int, judul: string, nama_penulis: string}>
 */
function lengkapiNamaPenulisTanpaNPlus1(PDO $pdo, array $daftarArtikel): array
{
    if ($daftarArtikel === []) {
        return [];
    }

    // 1. Kumpulkan seluruh ID penulis unik
    $idPenulisUnik = array_values(array_unique(array_column($daftarArtikel, 'penulis_id')));
    $placeholder   = implode(',', array_fill(0, count($idPenulisUnik), '?'));

    // 2. Ambil semua penulis yang dibutuhkan dalam 1 kueri tunggal!
    $stmt = $pdo->prepare("SELECT id, nama FROM penulis WHERE id IN ({$placeholder})");
    $stmt->execute($idPenulisUnik);
    $petaPenulis = $stmt->fetchAll(PDO::FETCH_KEY_PAIR); // Menghasilkan [id => nama]

    // 3. Pasangkan di memori PHP
    return array_map(
        static fn (array $art): array => [
            'id'           => $art['id'],
            'judul'        => $art['judul'],
            'nama_penulis' => (string) ($petaPenulis[$art['penulis_id']] ?? 'Anonim'),
        ],
        $daftarArtikel
    );
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menjalankan `SELECT ... FOR UPDATE` di luar `$pdo->beginTransaction()`:** Dalam mode *autocommit* bawaan, setiap pernyataan SQL adalah transaksinya sendiri yang langsung berakhir begitu baris `SELECT` selesai! Akibatnya, kunci `FOR UPDATE` langsung terlepas seketika sebelum baris kode `UPDATE` dijalankan. **`SELECT ... FOR UPDATE` wajib selalu berada di dalam blok `$pdo->beginTransaction()` ... `$pdo->commit()`**.
2. **Mengunci beberapa baris dengan urutan ID yang tidak konsisten (*Deadlock*):** Jika Transaksi A mengunci Dompet `2` lalu Dompet `1`, sementara Transaksi B pada saat yang sama mengunci Dompet `1` lalu Dompet `2`, keduanya akan saling menunggu selamanya (*Deadlock*). Saat mentransfer saldo antar dua dompet, **selalu urutkan ID dompet dari yang terkecil ke terbesar** sebelum melakukan `SELECT ... FOR UPDATE`!
3. **Menjalankan perintah DDL (`CREATE TABLE` / `ALTER TABLE`) di MySQL/MariaDB di dalam transaksi dan mengira bisa di-`rollBack()`:** Berbeda dengan PostgreSQL dan SQLite yang mendukung *Transactional DDL*, MySQL melakukan *implicit commit* setiap kali melihat `ALTER TABLE` atau `CREATE TABLE`.

## Latihan Praktik Mandiri

1. Buat skrip pengujian PHPUnit dengan database SQLite atau PostgreSQL yang menguji fungsi `perbaruiHargaProdukOptimistic()` dan `lengkapiNamaPenulisTanpaNPlus1()`.
2. Verifikasi bahwa pemanggilan kedua `perbaruiHargaProdukOptimistic()` yang masih membawa nomor `$versiSaatDibaca` lama langsung melempar `RuntimeException` karena `$stmt->rowCount() === 0`.

## Kuis Pemahaman

### Soal 1
Mengapa pola membaca saldo di PHP (`SELECT saldo FROM dompet WHERE id = :id`), memeriksanya dengan `if ($saldo >= $tarik)`, lalu menjalankan `UPDATE dompet SET saldo = ...` tanpa penguncian baris di dalam transaksi sangat berbahaya?
- A. Karena perintah `SELECT` tidak dapat membaca angka bulat
- B. Karena membuka celah kondisi balapan (*Race Condition / TOCTOU*): beberapa permintaan paralel yang masuk bersamaan akan sama-sama membaca nilai saldo awal yang belum terpotong dan meloloskan seluruh penarikan melebihi saldo sebenarnya
- C. Karena PDO hanya mengizinkan satu perintah `prepare()` per berkas PHP
- D. Karena `UPDATE` otomatis menghapus baris jika tidak ada `FOR UPDATE`

**Jawaban Benar:** B
**Penjelasan:** Tanpa penguncian baris (`SELECT ... FOR UPDATE` di dalam transaksi) atau pembaruan atomik bersyarat (`WHERE saldo >= :tarik`), pembacaan paralel akan melihat *snapshot* saldo lama sebelum salah satu transaksi sempat menulis saldo baru.

### Soal 2
Pada penerapan **Optimistic Locking** menggunakan kolom `versi` (`UPDATE produk SET harga = :harga, versi = versi + 1 WHERE id = :id AND versi = :versi_lama`), bagaimana kode PHP Anda mendeteksi bahwa baris tersebut baru saja diubah oleh pengguna lain di sela-sela waktu baca dan simpan?
- A. PDO akan otomatis menghapus tabel `produk`
- B. Memeriksa apakah **`$stmt->rowCount() === 0`**: jika 0 baris yang terpengaruh (padahal ID produk ada), berarti nilai `versi` di database sudah bertambah lebih dulu oleh transaksi lain sehingga perubahan harus ditolak
- C. Memeriksa nilai `$pdo->lastInsertId()`
- D. Menunggu selama 60 detik

**Jawaban Benar:** B
**Penjelasan:** Ketika transaksi lain sudah lebih dulu memperbarui baris tersebut dan menaikkan `versi` menjadi `versi + 1`, klausa `WHERE id = :id AND versi = :versi_lama` tidak lagi cocok dengan baris mana pun sehingga `$stmt->rowCount()` mengembalikan `0`.

### Soal 3
Apa yang dimaksud dengan masalah **N+1 Query** pada akses basis data dan bagaimana cara mengatasinya?
- A. Menambahkan angka `1` pada setiap hasil kueri matematika
- B. Menjalankan 1 kueri utama untuk mengambil $N$ baris induk (misalnya 50 artikel), lalu menjalankan $N$ kueri tambahan satu per satu di dalam perulangan `foreach` untuk mengambil data relasinya; diatasi dengan mengambil seluruh data relasi sekaligus dalam 1 kueri menggunakan `WHERE id IN (...)` atau `JOIN`
- C. Menggunakan lebih dari satu kolom *primary key* pada tabel
- D. Menjalankan kueri `INSERT` tanpa transaksi

**Jawaban Benar:** B
**Penjelasan:** Menjalankan kueri SQL di dalam perulangan `foreach` memicu ratusan *round-trip* jaringan ke database. Mengumpulkan daftar ID ke dalam satu kueri `WHERE id IN (...)` (atau `JOIN`) memangkas $N+1$ kueri menjadi hanya 1 atau 2 kueri.

## Sumber

- [Transactions and auto-commit — PHP Manual](https://www.php.net/manual/en/pdo.transactions.php)
- [PDO (PHP Data Objects) — PHP Manual](https://www.php.net/manual/en/book.pdo.php)
- [Explicit Locking — PostgreSQL Documentation](https://www.postgresql.org/docs/current/explicit-locking.html)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
