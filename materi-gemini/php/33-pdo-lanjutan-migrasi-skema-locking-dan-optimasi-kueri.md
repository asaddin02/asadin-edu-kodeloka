# PDO Lanjutan: Migrasi Skema Database, Pessimistic vs Optimistic Locking, dan Pencegahan N+1 Query

- **Tingkat:** Lanjut
- **Ringkasan:** Mengelola perubahan tabel basis data secara terukur menggunakan sistem migrasi berversi, mencegah kondisi balapan saldo ganda (*race condition*) dengan `SELECT ... FOR UPDATE` (*Pessimistic Locking*) atau kolom `versi` (*Optimistic Locking*), serta mendeteksi dan memperbaiki masalah **N+1 Query**.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `$pdo->prepare('UPDATE dompet SET saldo = saldo - :nominal, versi = versi + 1 WHERE id = :id AND versi = :versiLama');` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Membaca saldo pengguna dengan `SELECT saldo FROM dompet`, mengeceknya di PHP (`if ($saldo >= $tarik)`), lalu melakukan `UPDATE dompet SET saldo = ...` tanpa mengunci baris di dalam transaksi memungkinkan penyerang mengirim 10 permintaan paralel untuk menarik uang berkali-kali melebihi saldonya!

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `$pdo->prepare('UPDATE dompet SET saldo = saldo - :nominal, versi = versi + 1 WHERE id = :id AND versi = :versiLama');` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

function tarikSaldoAman(PDO $pdo, int $idDompet, int $nominalTarikan): void
{
    $pdo->beginTransaction();
    try {
        // Kunci baris dompet hingga transaksi selesai (Pessimistic Locking)
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
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $e;
    }
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `$pdo->prepare('UPDATE dompet SET saldo = saldo - :nominal, versi = versi + 1 WHERE id = :id AND versi = :versiLama');` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Membaca saldo pengguna dengan `SELECT saldo FROM dompet`, mengeceknya di PHP (`if ($saldo >= $tarik)`), lalu melakukan `UPDATE dompet SET saldo = ...` tanpa mengunci baris di dalam transaksi memungkinkan penyerang mengirim 10 permintaan paralel untuk menarik uang berkali-kali melebihi saldonya!*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena membuka celah keamanan serius, merusak integritas data/finansial, atau menyebabkan kehabisan memori (*Out of Memory*) di server produksi
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Membaca saldo pengguna dengan `SELECT saldo FROM dompet`, mengeceknya di PHP (`if ($saldo >= $tarik)`), lalu melakukan `UPDATE dompet SET saldo = ...` tanpa mengunci baris di dalam transaksi memungkinkan penyerang mengirim 10 permintaan paralel untuk menarik uang berkali-kali melebihi saldonya!

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `$pdo->prepare('UPDATE dompet SET saldo = saldo - :nominal, versi = versi + 1 WHERE id = :id AND versi = :versiLama');` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `$pdo->prepare('UPDATE dompet SET saldo = saldo - :nominal, versi = versi + 1 WHERE id = :id AND versi = :versiLama');` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi `PDO Lanjutan` ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [Transactions and auto-commit — PHP Manual](https://www.php.net/manual/en/pdo.transactions.php)
- [PDO (PHP Data Objects) — PHP Manual](https://www.php.net/manual/en/book.pdo.php)
- [Explicit Locking — PostgreSQL Documentation](https://www.postgresql.org/docs/current/explicit-locking.html)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
