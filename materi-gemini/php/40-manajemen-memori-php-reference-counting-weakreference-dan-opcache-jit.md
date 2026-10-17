# Manajemen Memori Internal PHP (`zval`, Reference Counting, GC), `WeakReference`, `WeakMap`, dan Objek Lazy PHP 8.4

- **Tingkat:** Lanjut
- **Ringkasan:** Membedah struktur internal `zval` dan penghitungan referensi (*reference counting*) di Zend Engine, mencegah kebocoran memori pada cache objek di RAM menggunakan **`WeakReference`** dan **`WeakMap`**, serta menunda inisialisasi objek berat dengan fitur **Native Lazy Objects (`ReflectionClass::newLazyGhost`)** di PHP 8.4.

## Bagaimana Zend Engine Mengelola Memori Variabel dan Mengapa Cache Array Statis Bisa Membocorkan RAM?

Di balik layar, setiap nilai variabel di PHP disimpan di dalam struktur C bernama **`zval` (*Zend Value*)** yang dilengkapi dengan penghitung referensi (**`refcount`**).
1. **Copy-on-Write (CoW):** Saat Anda menulis `$b = $a;` untuk sebuah array berisi 10.000 elemen, PHP **tidak menggandakan** array tersebut di RAM! PHP cukup menaikkan `refcount` dari `1` menjadi `2`. Duplikasi memori baru terjadi apabila salah satu variabel dimodifikasi (`$b[] = 'baru'`).
2. **Penghapusan Instan (`refcount === 0`):** Begitu sebuah fungsi selesai dan `refcount` dari `zval` turun menjadi `0`, memorinya langsung dibebaskan saat itu juga!
3. **Siklus Melingkar & Cache Objek:** Jika Anda menyimpan objek entitas sebagai kunci/nilai di dalam `private array $cache = []`, maka array `$cache` akan menahan `refcount >= 1` pada objek tersebut selamanya sehingga objek tidak pernah bisa dibebaskan dari RAM! Solusinya adalah **`WeakMap`** dan **`WeakReference`**.

Lebih jauh lagi, sejak **PHP 8.4**, Zend Engine memperkenalkan **Native Lazy Objects (`ReflectionClass::newLazyGhost` dan `newLazyProxy`)** untuk membuat objek cangkang yang baru menjalankan inisialisasi beratnya tepat pada saat propertinya pertama kali dibaca!

> **🚫 Kerentanan & Kesalahan Umum:** Menyimpan ribuan objek entitas di dalam array cache statis `private static array $cache = []` pada proses berumur panjang (seperti queue worker atau FrankenPHP/RoadRunner) tanpa `WeakMap` atau batas eviksi akan membocorkan memori hingga worker mati karena OOM.

## 1. Perbandingan Primitif Manajemen Memori dan Objek Malas (*Lazy Objects*) di PHP 8.4+

Berikut adalah mekanisme pengelolaan memori tingkat lanjut di PHP modern:

| Kelas / Fitur | Cara Kerja di Zend Engine | Kapan Harus Digunakan? |
| :--- | :--- | :--- |
| **`WeakReference::create($obj)`** | Memegang acuan ke `$obj` tanpa menaikkan `refcount`-nya. Jika tidak ada variabel lain yang memegang `$obj`, `$weakRef->get()` otomatis mengembalikan `null`. | Menyimpan acuan cache *Identity Map* di ORM tanpa menghalangi penghapusan memori objek. |
| **`WeakMap`** | Peta kunci-nilai di mana **kunci wajib berupa `object`** dan disimpan secara *weak*. Saat objek kunci dihapus dari memori, entri di dalam `WeakMap` ikut hilang otomatis! | Melampirkan metadata/cache perhitungan ke sebuah objek tanpa memodifikasi class objek tersebut dan tanpa *memory leak*. |
| **`ReflectionClass::newLazyGhost($init)`** (PHP 8.4+) | Membuat instans asli dari class target yang propertinya belum diinisialisasi; fungsi `$init($obj)` baru dipanggil otomatis **di tempat (*in-place*)** saat properti pertama kali diakses! | Menunda pemuatan relasi entitas ORM atau layanan yang tidak selalu dipakai dalam setiap permintaan HTTP. |
| **`ReflectionClass::newLazyProxy($factory)`** (PHP 8.4+) | Membuat objek proxy yang saat diakses akan memanggil `$factory($proxy): object` untuk menghasilkan instans nyata di belakangnya. | Ketika objek nyata harus dibuat oleh *factory* eksternal atau mengembalikan subclass yang berbeda. |

## 2. Menggunakan *Native Lazy Objects* (`newLazyGhost`) di PHP 8.4+

Sebelum PHP 8.4, pustaka ORM (seperti Doctrine) dan Dependency Injection Container harus membangkitkan kode subclass palsu secara dinamis untuk menunda pemuatan objek (*lazy loading*). Kini di **PHP 8.4 dan PHP 8.5**, fitur ini didukung langsung di tingkat C oleh Zend Engine tanpa overhead kode tambahan:

```php
<?php
declare(strict_types=1);

// PHP 8.4+: Native Lazy Objects — konstruktor baru dijalankan saat properti pertama kali diakses!
final class KoneksiLaporanBerat
{
    public string $status;

    public function __construct(public string $dsn)
    {
        // Anggap inisialisasi ini membuka soket dan memakan waktu 200ms
        $this->status = "Terhubung ke {$dsn}";
    }
}

$refleksi = new ReflectionClass(KoneksiLaporanBerat::class);

/** @var KoneksiLaporanBerat $koneksiMalas */
$koneksiMalas = $refleksi->newLazyGhost(static function (KoneksiLaporanBerat $instans): void {
    $instans->__construct('pgsql:host=localhost;dbname=analitik');
});

// Pada baris ini, konstruktor BELUM dipanggil sama sekali:
var_dump($refleksi->isUninitializedLazyObject($koneksiMalas)); // bool(true)

// Begitu properti ->status dibaca pertama kali, fungsi inisialisasi otomatis dijalankan!
echo $koneksiMalas->status . PHP_EOL; // "Terhubung ke pgsql:host=localhost;dbname=analitik"
var_dump($refleksi->isUninitializedLazyObject($koneksiMalas)); // bool(false)
```

## 3. Mencegah Kebocoran Memori Cache Metadata dengan `WeakMap`

Ketika Anda perlu menyimpan hasil perhitungan mahal yang terkait dengan sebuah objek `Pengguna` atau `Request` selama objek tersebut masih hidup, gunakan **`WeakMap`** alih-alih array statis:

```php
<?php
declare(strict_types=1);

final class CacheIzinTerhitung
{
    /** @var WeakMap<object, array<string, bool>> */
    private WeakMap $petaCache;

    public function __construct()
    {
        $this->petaCache = new WeakMap();
    }

    /**
     * @param callable(): array<string, bool> $hitungIzin
     * @return array<string, bool>
     */
    public function ambilUntukObjek(object $entitas, callable $hitungIzin): array
    {
        if (!isset($this->petaCache[$entitas])) {
            $this->petaCache[$entitas] = $hitungIzin();
        }
        return $this->petaCache[$entitas];
    }
}
```

Begitu variabel `$entitas` di luar selesai dipakai dan keluar dari cakupan fungsi (`unset($entitas)`), entri miliknya di dalam `$this->petaCache` **langsung lenyap secara otomatis** tanpa meninggalkan sampah di RAM!

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan referensi `&` (`foreach ($arr as &$val)`) tanpa alasan jelas:** Menambahkan tanda `&` memaksa PHP memecah *Copy-on-Write* (menggandakan memori array jika ada variabel lain yang menunjuk ke array tersebut) dan meninggalkan variabel `$val` tetap terikat ke elemen terakhir array setelah loop berakhir! Hindari `&` kecuali benar-benar diperlukan.
2. **Menyimpan objek di dalam nilai `WeakMap` yang merujuk balik ke objek kuncinya tanpa memahami siklus GC:** Jika nilai di dalam `WeakMap[$kunci]` memiliki properti yang memegang referensi kuat kembali ke `$kunci`, siklus tersebut baru akan dibersihkan saat *Cycle Collector* (`gc_collect_cycles()`) berjalan.
3. **Memicu inisialisasi `LazyGhost` secara tidak sengaja saat melakukan serialisasi atau `var_dump()`:** Membaca properti publik dari objek *lazy* akan memicu inisialisasinya; gunakan `$refleksi->isUninitializedLazyObject($obj)` jika Anda hanya ingin memeriksa apakah objek tersebut sudah diinisialisasi atau belum tanpa memicunya!

## Latihan Praktik Mandiri

1. Buat berkas `DemoMemoriLazy.php` yang menguji `ReflectionClass::newLazyGhost()` pada sebuah class layanan serta `CacheIzinTerhitung` berbasis `WeakMap`.
2. Tulis pengujian PHPUnit yang membuktikan bahwa:
   - sebelum properti diakses, `$ref->isUninitializedLazyObject($obj)` bernilai `true` dan penghitung pemanggilan konstruktor masih `0`;
   - setelah properti dibaca, penghitung konstruktor menjadi `1`;
   - pada `WeakMap`, setelah objek kunci di-`unset()`, `count($weakMap)` langsung berkurang menjadi `0`!

## Kuis Pemahaman

### Soal 1
Apa yang terjadi di dalam mesin PHP (*Copy-on-Write*) ketika Anda mengeksekusi baris `$salinan = $arrayBesar;` di mana `$arrayBesar` berisi 100.000 elemen, tetapi Anda belum mengubah isi `$salinan` sama sekali?
- A. PHP langsung menyalin seluruh 100.000 elemen ke alamat memori RAM baru sehingga pemakaian RAM naik dua kali lipat
- B. PHP **tidak menyalin** isi array di memori, melainkan hanya mengarahkan `$salinan` ke struktur `zval` array yang sama dan menaikkan penghitung referensi (`refcount`) menjadi `2`; penyalinan memori baru terjadi jika salah satu variabel dimodifikasi
- C. PHP memindahkan `$arrayBesar` ke berkas swap di hard disk
- D. `$arrayBesar` otomatis dikosongkan

**Jawaban Benar:** B
**Penjelasan:** Mekanisme *Copy-on-Write* (CoW) di Zend Engine memastikan penerusan array atau string besar ke dalam fungsi maupun variabel baru berlangsung sangat cepat dan hemat memori selama nilainya hanya dibaca.

### Soal 2
Bagaimana cara kerja `ReflectionClass::newLazyGhost(callable $initializer)` yang diperkenalkan di PHP 8.4?
- A. Menjalankan `$initializer` di dalam thread latar belakang secara paralel
- B. Menciptakan instans objek yang belum diinisialisasi (tanpa memanggil konstruktornya saat itu juga), dan baru memanggil fungsi `$initializer($obj)` secara otomatis tepat ketika salah satu properti objek tersebut pertama kali dibaca atau ditulis
- C. Menghapus seluruh properti objek setelah dibaca satu kali
- D. Mengubah objek menjadi array JSON

**Jawaban Benar:** B
**Penjelasan:** *Native Lazy Objects* di PHP 8.4 memungkinkan pembuatan objek *ghost* yang terlihat dan bertipe sama persis dengan class aslinya (`$obj instanceof KelasAsli === true`), namun menunda eksekusi konstruktor/inisialisasinya sampai propertinya benar-benar disentuh.

### Soal 3
Mengapa menyimpan metadata tambahan untuk objek menggunakan **`WeakMap`** jauh lebih aman dari kebocoran memori dibandingkan menggunakan `SplObjectStorage` atau array statis pada worker berumur panjang?
- A. Karena `WeakMap` menyimpan datanya di dalam Redis
- B. Karena kunci objek di dalam `WeakMap` dipegang sebagai referensi lemah (*weak reference*) yang tidak menambah `refcount` objek tersebut; begitu objek kunci tidak lagi dirujuk di bagian kode lain, objek tersebut langsung dihapus dari RAM dan entrinya di `WeakMap` otomatis hilang
- C. Karena `WeakMap` hanya mengizinkan maksimal 10 entri
- D. Karena `SplObjectStorage` telah dihapus di PHP 8.4

**Jawaban Benar:** B
**Penjelasan:** `SplObjectStorage` menahan referensi kuat (*strong reference*) terhadap objek kuncinya sehingga objek tidak akan pernah di-GC selama belum dilepas secara manual (`detach`). Sebaliknya, `WeakMap` otomatis membuang entri begitu objek kuncinya habis masa hidupnya.

## Sumber

- [Lazy Objects — PHP Manual](https://www.php.net/manual/en/language.oop5.lazy-objects.php)
- [`ReflectionClass::newLazyGhost` — PHP Manual](https://www.php.net/manual/en/reflectionclass.newlazyghost.php)
- [The WeakMap class — PHP Manual](https://www.php.net/manual/en/class.weakmap.php)
- [Reference counting basics — PHP Manual](https://www.php.net/manual/en/features.gc.refcounting-basics.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
