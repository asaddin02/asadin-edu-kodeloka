# Strategi Caching Terdistribusi (PSR-16 SimpleCache & Redis), Invalidation, dan Pencegahan *Cache Stampede*

- **Tingkat:** Lanjut
- **Ringkasan:** Merancang lapisan cache berkinerja tinggi di atas Redis/Valkey atau APCu sesuai antarmuka **PSR-16 (`CacheInterface`)**, memilih TTL yang tepat, membatalkan cache berbasis tag/versi, serta mencegah **Cache Stampede (Dog-Piling)** saat kunci populer kedaluwarsa bersamaan.

## Bagaimana Kedaluwarsanya Satu Kunci Cache Dapat Menumbangkan Server Database Anda?

Bayangkan halaman beranda situs Anda menampilkan statistik katalog yang kueri SQL agregasinya membutuhkan waktu **800 milidetik** di PostgreSQL. Untuk mempercepatnya, Anda menyimpannya di Redis dengan kunci `"beranda:statistik"` selama `TTL = 300` detik (5 menit). Selama 5 menit tersebut, situs mampu melayani **2.000 pengunjung per detik** dengan santai karena dijawab langsung oleh Redis dalam 0,5 milidetik.

Namun, tepat pada detik ke-300,000 saat kunci `"beranda:statistik"` kedaluwarsa dan hilang dari Redis, **ada 1.600 permintaan pengguna yang masuk secara bersamaan dalam rentang 800 ms tersebut**! Karena semuanya melihat `redis->get()` bernilai `false` (*cache miss*), **seluruh 1.600 worker PHP menghantam PostgreSQL secara serentak untuk menjalankan kueri berat yang sama**! Lonjakan beban mendadak ini disebut **Cache Stampede (*Dog-Piling / Thundering Herd*)** dan sering menjadi penyebab utama tumbangnya sistem bertrafik tinggi.

> **🚫 Kerentanan & Kesalahan Umum:** Ketika sebuah kunci cache di beranda yang diakses 5.000 pengguna per detik kedaluwarsa tepat pada detik yang sama, seluruh 5.000 worker PHP akan menghantam database secara serentak (*Cache Stampede*) untuk menghitung ulang kueri yang sama dan menumbangkan server database.

## 1. Perbandingan Standar PSR-16 vs PSR-6 dan Tiga Teknik Anti-*Cache Stampede*

Berikut adalah ringkasan standar antarmuka caching PHP-FIG serta strategi mitigasi *Cache Stampede*:

| Konsep / Strategi | Cara Kerja Teknis | Kapan Harus Digunakan? |
| :--- | :--- | :--- |
| **PSR-16 (`SimpleCache`)** vs **PSR-6 (`Cache`)** | PSR-16 menyediakan metode langsung `get($key, $default)` & `set($key, $val, $ttl)`, sedangkan PSR-6 memakai objek pembungkus `CacheItemPoolInterface` & `CacheItemInterface`. | Gunakan **PSR-16** untuk hampir semua kebutuhan aplikasi sehari-hari karena jauh lebih ringkas dan ergonomis. |
| **1. Distributed Mutex Lock (`SET ... NX EX`)** | Saat *cache miss*, hanya **1 worker** yang berhasil mengunci `lock:{kunci}` (`NX`) yang boleh menghitung ulang ke DB; worker lain menunggu sejenak lalu membaca ulang dari cache! | **Pilihan utama** untuk kueri berat di beranda atau laporan agregasi publik. |
| **2. TTL Jitter (Acakan Waktu Kedaluwarsa)** | Menambahkan angka acak pada TTL saat menyimpan ribuan kunci bersamaan (`$ttl = 300 + random_int(0, 60)`). | Mencegah ratusan kunci katalog yang di-*warm up* bersamaan kedaluwarsa pada detik yang sama persis! |
| **3. Versioned Key Invalidation** | Menyertakan nomor versi di dalam nama kunci (`"katalog:v{$versi}:hal:1"`). Saat produk berubah, cukup naikkan angka `INCR katalog:versi` tanpa perlu menjalankan `KEYS *` yang memblokir Redis! | Membatalkan sekelompok cache terkait secara instan dalam waktu $O(1)$. |

## 2. Mencegah *Cache Stampede* dengan Kunci Muteks Redis (`SET ... NX EX`)

Perhatikan alur lengkap pada fungsi `ambilDenganKunciMuteks` di bawah ini: ketika sebuah worker mendapati cache kosong (*miss*) tetapi gagal mendapatkan kunci `lock:{kunci}` karena sudah dipegang oleh worker pertama, worker tersebut **tidur sejenak (`usleep`) lalu membaca kembali dari cache** sebelum jatuh ke cadangan terakhir:

```php
<?php
declare(strict_types=1);

function ambilDenganKunciMuteks(Redis $redis, string $kunci, int $ttlDetik, callable $pembangkitData): mixed
{
    $tercache = $redis->get($kunci);
    if ($tercache !== false) {
        return json_decode((string) $tercache, associative: true, flags: JSON_THROW_ON_ERROR);
    }

    $kunciLock = "lock:{$kunci}";
    // Hanya 1 proses yang berhasil memperoleh kunci NX selama 5 detik
    if ($redis->set($kunciLock, '1', ['NX', 'EX' => 5])) {
        try {
            $dataBaru = $pembangkitData();
            $redis->setex($kunci, $ttlDetik, json_encode($dataBaru, JSON_THROW_ON_ERROR));
            return $dataBaru;
        } finally {
            $redis->del($kunciLock);
        }
    }

    // Proses lain menunggu 100ms lalu mencoba membaca kembali hasil yang baru diisi oleh pemegang kunci
    usleep(100_000);
    $tercache = $redis->get($kunci);
    if ($tercache !== false) {
        return json_decode((string) $tercache, associative: true, flags: JSON_THROW_ON_ERROR);
    }

    return $pembangkitData(); // Cadangan terakhir jika proses pemegang kunci belum sempat mengisi cache
}
```

## 3. Menyimpan *Negative Cache* (Mencegah *Cache Penetration*) dan TTL Jitter

Bagaimana jika penyerang terus-menerus meminta `GET /produk/99999999` yang ID-nya **memang tidak ada di database**? Karena database mengembalikan `null` dan Anda tidak menyimpannya ke cache, maka setiap permintaan untuk ID palsu tersebut akan selalu tembus (*penetrate*) ke database!

Solusinya adalah menyimpan nilai penanda khusus (atau objek pembungkus `['ada' => false, 'data' => null]`) dengan **TTL pendek (misalnya 30–60 detik)** untuk hasil pencarian yang tidak ditemukan (*Negative Caching*), serta menambahkan **TTL Jitter** agar waktu kedaluwarsa menyebar:

```php
<?php
declare(strict_types=1);

function hitungTtlDenganJitter(int $ttlDasarDetik, int $rentangJitterDetik = 30): int
{
    return $ttlDasarDetik + random_int(0, max(1, $rentangJitterDetik));
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menjalankan perintah `KEYS kodeloka:*` di Redis produksi untuk menghapus sekelompok cache:** Perintah `KEYS` memindai seluruh jutaan kunci di dalam Redis secara sinkron pada satu utas utama dan akan **membekukan seluruh server Redis bagi semua pengguna lain**! Gunakan penomoran versi kunci (*versioned keys*) atau `SCAN` bila harus menelusuri kunci.
2. **Menyimpan objek PHP ke Redis menggunakan `serialize()` bawaan:** Selain berisiko *Object Injection* jika Redis diakses aplikasi lain dan rusak saat nama class diubah saat *deployment*, `serialize()` tidak dapat dibaca oleh layanan Go/Node.js/Python. Selalu gunakan **`json_encode()` / `json_decode()`**.
3. **Membuat kunci `SETNX` tanpa batas waktu kedaluwarsa (`EX`):** Jika proses PHP yang memegang kunci mati mendadak (*crash*/OOM) sebelum blok `finally` sempat memanggil `$redis->del($kunciLock)`, kunci tanpa `EX` akan terkunci selamanya (*deadlock* permanen)! Selalu gunakan perintah atomik tunggal `['NX', 'EX' => 5]`.

## Latihan Praktik Mandiri

1. Buat class `CacheAntiStampede` yang mengimplementasikan logika kunci muteks, *negative caching*, dan `hitungTtlDenganJitter()`.
2. Tulis pengujian PHPUnit menggunakan objek tiruan (*fake/stub* penyimpanan kunci-nilai di memori) untuk membuktikan bahwa ketika kunci `lock:beranda` sudah ada dan `beranda` telah terisi saat pengecekan ulang, callback `$pembangkitData` **tidak** dipanggil lagi!

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Ketika sebuah kunci cache di beranda yang diakses 5.000 pengguna per detik kedaluwarsa tepat pada detik yang sama, seluruh 5.000 worker PHP akan menghantam database secara serentak (*Cache Stampede*) untuk menghitung ulang kueri yang sama dan menumbangkan server database.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena ribuan worker secara serentak menjalankan kueri mahal yang sama ke database sehingga database kewalahan akibat lonjakan beban dan situs menjadi lambat atau tumbang
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Ketika sebuah kunci cache di beranda yang diakses 5.000 pengguna per detik kedaluwarsa tepat pada detik yang sama, seluruh 5.000 worker PHP akan menghantam database secara serentak (*Cache Stampede*) untuk menghitung ulang kueri yang sama dan menumbangkan server database.

### Soal 2
Dalam pola pencegahan *Cache Stampede* menggunakan perintah atomik Redis `$redis->set("lock:{$kunci}", '1', ['NX', 'EX' => 5])`, apakah arti dari opsi `'NX'` dan `'EX' => 5`, serta mengapa keduanya harus dijalankan dalam satu perintah tunggal?
- A. `'NX'` berarti simpan di disk, dan `'EX'` berarti enkripsi 5 lapis
- B. `'NX'` (*Not Exists*) memastikan kunci hanya berhasil dibuat jika belum ada proses lain yang memegangnya, sedangkan `'EX' => 5` memberi batas kedaluwarsa otomatis 5 detik; menggabungkannya secara atomik mencegah *deadlock* permanen apabila proses pemegang kunci mati mendadak sebelum sempat menghapus kunci
- C. `'NX'` menghapus seluruh database Redis setiap 5 detik
- D. `'EX' => 5` membatasi panjang nilai maksimal 5 karakter

**Jawaban Benar:** B
**Penjelasan:** Jika `SETNX` dan `EXPIRE` dipanggil dalam dua perintah terpisah dan proses PHP mati tepat di antara keduanya, kunci tidak akan pernah kedaluwarsa. Opsi gabungan `['NX', 'EX' => 5]` pada `SET` dijalankan secara atomik oleh Redis.

### Soal 3
Apa yang dimaksud dengan serangan/masalah **Cache Penetration** dan bagaimana teknik **Negative Caching** mengatasinya?
- A. Ketika memori Redis penuh; diatasi dengan membeli RAM baru
- B. Ketika klien terus-menerus meminta ID data yang memang tidak ada di database (mengembalikan `null`) sehingga setiap permintaan selalu gagal ditemukan di cache dan terus membebani database; diatasi dengan ikut menyimpan penanda "tidak ditemukan" di cache dengan TTL pendek (misalnya 30–60 detik)
- C. Ketika koneksi jaringan ke Redis menggunakan kabel serat optik
- D. Ketika kata sandi Redis terlalu pendek

**Jawaban Benar:** B
**Penjelasan:** Tanpa *negative caching*, kueri yang menghasilkan `null` tidak pernah disimpan di cache sehingga ribuan permintaan terhadap ID fiktif akan selalu tembus (*penetrate*) menghantam database utama.

## Sumber

- [PSR-16: Common Interface for Caching Libraries — PHP-FIG](https://www.php-fig.org/psr/psr-16/)
- [PSR-6: Caching Interface — PHP-FIG](https://www.php-fig.org/psr/psr-6/)
- [`SET` (opsi NX dan EX) — Redis Documentation](https://redis.io/docs/latest/commands/set/)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
