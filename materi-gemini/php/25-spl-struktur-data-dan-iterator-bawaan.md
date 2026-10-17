# Standard PHP Library (SPL): Struktur Data (`SplDoublyLinkedList`, `SplHeap`) dan Iterator (`RecursiveDirectoryIterator`)

- **Tingkat:** Menengah
- **Ringkasan:** Memanfaatkan struktur data dan iterator berkinerja tinggi bawaan SPL seperti `SplPriorityQueue`, `SplFixedArray`, `SplObjectStorage`, serta menelusuri pohon direktori bersarang secara hemat memori dengan `RecursiveDirectoryIterator` dan `RecursiveIteratorIterator`.

## Mengapa Array PHP Biasa Tidak Selalu Menjadi Pilihan Terbaik untuk Semua Struktur Data?

Di PHP, tipe `array` sebenarnya adalah *ordered hash map* serbaguna yang dapat dipakai sebagai daftar, kamus, tumpukan (*stack*), maupun antrean (*queue*). Namun, fleksibilitas ini memiliki harga memori: ketika Anda menampung ratusan ribu jalur berkas hasil `scandir()` rekursif di dalam satu array, atau membutuhkan antrean berprioritas yang selalu mengambil item dengan bobot tertinggi dalam waktu logaritmik $O(\log n)$, penggunaan array biasa menjadi lambat dan boros RAM.

**Standard PHP Library (SPL)** merupakan kumpulan kelas struktur data dan iterator berbahasa C yang sudah tertanam langsung di inti PHP tanpa perlu memasang ekstensi tambahan.

> **🚫 Kerentanan & Kesalahan Umum:** Menggunakan fungsi `scandir()` secara rekursif yang mengumpulkan ratusan ribu jalur berkas ke dalam satu array PHP raksasa di RAM dapat memicu `Fatal error: Allowed memory size exhausted`; gunakan iterator SPL yang memproses satu berkas pada satu waktu.

## 1. Perbandingan Struktur Data dan Iterator Bawaan SPL

Berikut adalah kelas-kelas SPL paling berguna dalam pengembangan aplikasi backend:

| Kelas SPL | Karakteristik Teknis | Kapan Harus Digunakan Menggantikan `array`? |
| :--- | :--- | :--- |
| **`RecursiveDirectoryIterator` + `RecursiveIteratorIterator`** | Menelusuri pohon direktori sedalam apa pun secara malas (*lazy*, 1 berkas di memori pada satu waktu). | Memindai ribuan berkas log, gambar, atau dokumen `.md` tanpa membebani RAM. |
| **`CallbackFilterIterator`** | Membungkus `Iterator` lain dan menyaring elemen menggunakan fungsi callback. | Menyaring hasil telusuran direktori berdasarkan ekstensi, ukuran, atau tanggal modifikasi. |
| **`SplPriorityQueue` / `SplMaxHeap`** | Pohon *Heap* biner yang selalu mengekstrak elemen berprioritas tertinggi dalam waktu $O(\log n)$. | Penjadwal tugas latar belakang (*job scheduler*), pengiriman notifikasi VIP vs reguler, atau algoritma Dijkstra. |
| **`SplObjectStorage`** | Himpunan (*Set*) objek atau peta dari `object => data` (mirip `WeakMap`, tetapi menahan referensi kuat). | Melacak daftar objek pendengar (*observers*) atau entitas unik yang sedang dikelola oleh Unit of Work. |
| **`SplDoublyLinkedList` / `SplQueue`** | Daftar berantai ganda dengan penyisipan dan penghapusan ujung (`enqueue`/`dequeue`) konstan $O(1)$. | Antrean FIFO panjang (menggantikan `array_shift()` yang harus menggeser ulang seluruh indeks array $O(n)$!). |

## 2. Menelusuri Pohon Direktori Secara Hemat Memori dan Aman dari *Symlink*

Ketika menelusuri folder dengan `RecursiveDirectoryIterator`, selalu sertakan bendera **`FilesystemIterator::SKIP_DOTS`** agar entri semu `.` dan `..` dilewati. Selain itu, **jangan** mengaktifkan `FilesystemIterator::FOLLOW_SYMLINKS` saat memindai direktori yang dapat diisi oleh pengguna, karena tautan simbolik (*symlink*) dapat menunjuk keluar dari direktori dasar menuju `/etc/` atau menciptakan perulangan tak berujung!

```php
<?php
declare(strict_types=1);

/**
 * Menelusuri direktori secara malas menggunakan Generator dan SPL Iterator.
 *
 * @return iterable<string>
 */
function cariBerkasMarkdown(string $direktoriDasar): iterable
{
    $dirIterator = new RecursiveDirectoryIterator(
        $direktoriDasar,
        FilesystemIterator::SKIP_DOTS
    );
    $iterator = new RecursiveIteratorIterator($dirIterator);

    /** @var SplFileInfo $infoBerkas */
    foreach ($iterator as $infoBerkas) {
        if ($infoBerkas->isFile() && $infoBerkas->getExtension() === 'md') {
            yield $infoBerkas->getRealPath();
        }
    }
}
```

## 3. Mengelola Antrean Tugas Berprioritas dengan `SplPriorityQueue`

Pada `array` biasa, jika Anda menggunakan `array_shift($antrean)` untuk mengambil elemen pertama dari antrean berisi 50.000 tugas, PHP harus menata ulang (*re-index*) 49.999 elemen sisanya pada setiap panggilan! Jika tugas-tugas tersebut memiliki tingkat kepentingan berbeda, gunakan **`SplPriorityQueue`**:

```php
<?php
declare(strict_types=1);

final class AntreanPengirimanSurel
{
    private SplPriorityQueue $antrean;

    public function __construct()
    {
        $this->antrean = new SplPriorityQueue();
        // Kembalikan hanya data nilai saat diekstrak
        $this->antrean->setExtractFlags(SplPriorityQueue::EXTR_DATA);
    }

    public function tambahTugas(string $tujuan, string $jenis, int $prioritas): void
    {
        // Angka prioritas lebih besar akan dieksekusi lebih dulu (mis. OTP = 100, Newsletter = 10)
        $this->antrean->insert(['tujuan' => $tujuan, 'jenis' => $jenis], $prioritas);
    }

    /** @return array{tujuan: string, jenis: string}|null */
    public function ambilTugasBerikutnya(): ?array
    {
        if ($this->antrean->isEmpty()) {
            return null;
        }
        /** @var array{tujuan: string, jenis: string} $tugas */
        $tugas = $this->antrean->extract();
        return $tugas;
    }
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Mengiterasi `SplPriorityQueue` atau `SplHeap` dengan `foreach` dua kali berturut-turut:** Berbeda dengan `array`, mengiterasi `SplPriorityQueue` atau `SplHeap` dengan `foreach` **sama dengan memanggil `.extract()` yang menghapus elemen dari heap seiring pembacaan**! Begitu `foreach` pertama selesai, antrean menjadi **kosong**. Jika ingin mengiterasi tanpa mengosongkan antrean asli, lakukan `foreach (clone $antrean as $item)`.
2. **Memakai `array_shift()` di dalam perulangan besar sebagai antrean FIFO:** `array_shift()` memiliki kompleksitas waktu $O(n)$ karena mereset seluruh kunci numerik. Gunakan `SplQueue` (`$q->enqueue($x)` dan `$q->dequeue()`) yang bekerja dalam waktu $O(1)$.
3. **Lupa memasang `FilesystemIterator::SKIP_DOTS` pada `RecursiveDirectoryIterator`:** Tanpa bendera tersebut, iterator akan memunculkan entri direktori `.` dan `..` yang dapat mengacaukan penghitungan jumlah berkas.

## Latihan Praktik Mandiri

1. Buat class `PemindaiDirektoriAman` yang menggunakan `RecursiveDirectoryIterator`, `RecursiveIteratorIterator`, dan `CallbackFilterIterator` untuk mencari berkas berdasarkan daftar ekstensi yang diizinkan dan ukuran minimum byte.
2. Buat pengujian PHPUnit yang membuat direktori sementara di `sys_get_temp_dir()`, mengisi 3 berkas uji, dan memastikan `PemindaiDirektoriAman` serta `AntreanPengirimanSurel` mengembalikan urutan yang tepat.

## Kuis Pemahaman

### Soal 1
Mengapa menelusuri pohon direktori yang berisi ratusan ribu berkas menggunakan kombinasi `RecursiveDirectoryIterator` dan `RecursiveIteratorIterator` (serta `yield`) jauh lebih aman bagi memori server dibandingkan membuat fungsi `scandir()` rekursif yang mengembalikan satu `array` besar?
- A. Karena `scandir()` tidak dapat membaca nama berkas yang mengandung angka
- B. Karena `scandir()` rekursif menumpuk seluruh ratusan ribu string jalur berkas di dalam RAM sekaligus hingga berisiko memicu *Allowed memory size exhausted*, sedangkan iterator SPL membaca dan memproses satu entri berkas pada satu waktu dengan penggunaan memori yang konstan ($O(1)$)
- C. Karena `RecursiveDirectoryIterator` otomatis mengompresi semua berkas menjadi ZIP
- D. Karena `array` di PHP maksimal hanya menampung 1.024 elemen

**Jawaban Benar:** B
**Penjelasan:** Iterator SPL bekerja secara malas (*lazy evaluation*): ia hanya meminta penunjuk entri berikutnya dari sistem berkas saat perulangan `foreach` bergerak maju, sehingga konsumsi RAM tetap rata berapapun jumlah berkasnya.

### Soal 2
Apa perilaku khusus yang wajib diwaspadai ketika Anda melakukan perulangan `foreach ($antreanPrioritas as $item)` pada sebuah instans `SplPriorityQueue` atau `SplHeap`?
- A. Urutan elemen yang keluar menjadi acak
- B. Iterasi pada `SplPriorityQueue` / `SplHeap` bersifat merusak (*destructive iteration*): setiap langkah maju pada `foreach` mengeluarkan (`extract`) elemen dari struktur heap sehingga setelah perulangan selesai, antrean menjadi kosong; gunakan `clone $antreanPrioritas` jika ingin mempertahankan isinya
- C. PHP akan melempar `LogicException` karena `SplPriorityQueue` tidak mengimplementasikan `Iterator`
- D. Seluruh prioritas elemen otomatis direset menjadi `0`

**Jawaban Benar:** B
**Penjelasan:** Struktur pohon *Heap* hanya menjamin elemen teratas yang berada di akar pohon. Untuk mengambil elemen terbesar berikutnya, elemen akar harus diekstrak terlebih dahulu, sehingga `next()` pada `SplPriorityQueue` menghapus elemen saat ditelusuri.

### Soal 3
Mengapa pada pemanggilan `new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS)` untuk memindai folder unggahan, Anda **tidak disarankan** menambahkan bendera `FilesystemIterator::FOLLOW_SYMLINKS`?
- A. Karena `FOLLOW_SYMLINKS` membuat nama berkas berubah menjadi huruf besar
- B. Karena mengikuti tautan simbolik (*symlink*) dapat membawa proses pemindaian keluar dari direktori dasar menuju berkas sensitif sistem operasi (*path traversal*) atau terjebak dalam siklus direktori melingkar tak berujung
- C. Karena `FOLLOW_SYMLINKS` telah dihapus di PHP 8.4
- D. Karena `SKIP_DOTS` dan `FOLLOW_SYMLINKS` memiliki nilai konstanta yang sama

**Jawaban Benar:** B
**Penjelasan:** Mengabaikan *symlink* menjaga pemindaian tetap terkurung di dalam pohon direktori fisik yang ditentukan dan mencegah kebocoran berkas lintas direktori.

## Sumber

- [SPL Data structures — PHP Manual](https://www.php.net/manual/en/spl.datastructures.php)
- [SPL Iterators — PHP Manual](https://www.php.net/manual/en/spl.iterators.php)
- [The RecursiveDirectoryIterator class — PHP Manual](https://www.php.net/manual/en/class.recursivedirectoryiterator.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
