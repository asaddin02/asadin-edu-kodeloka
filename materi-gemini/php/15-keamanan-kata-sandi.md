# Keamanan Kata Sandi: `password_hash()` (Argon2id/Bcrypt), `password_verify()`, dan Reset Sandi Aman

- **Tingkat:** Lanjut
- **Ringkasan:** Mengamankan kredensial pengguna menggunakan fungsi *Key Derivation* bawaan PHP (`password_hash`, `password_verify`, `password_needs_rehash`), memahami parameter memori dan waktu pada Argon2id, serta merancang alur *Lupa Kata Sandi* yang aman.

## 1. Mengapa Penyimpanan Kata Sandi Membutuhkan Algoritma Khusus (Argon2id & Bcrypt)?

Jika basis data sebuah aplikasi bocor (*data breach*), kata sandi pengguna adalah aset paling berharga yang diincar penyerang—karena banyak pengguna memakai kata sandi yang sama di berbagai layanan lain.

Algoritma hash kriptografis umum seperti **MD5**, **SHA-1**, atau **SHA-256** dirancang untuk memverifikasi integritas berkas secara **sangat cepat**. Kecepatan itulah yang justru menjadi bencana bagi kata sandi: satu kartu grafis (GPU) konsumen dapat menguji **puluhan miliar tebakan SHA-256 per detik**!

Sebaliknya, algoritma penyimpanan kata sandi modern harus memenuhi tiga syarat:
1. **Memiliki *Cryptographic Salt* Acak yang Unik untuk Setiap Pengguna:** Agar dua pengguna yang kebetulan memiliki kata sandi yang sama menghasilkan string hash yang 100% berbeda, serta menggagalkan penggunaan tabel pra-komputasi (*Rainbow Tables*).
2. **Sengaja Dibuat Lambat secara Terukur (*Work Factor / Cost*):** Membutuhkan waktu sekitar `100–350 milidetik` untuk satu kali verifikasi—tidak terasa bagi pengguna jujur yang login satu kali, tetapi memperlambat upaya tebakan massal penyerang hingga jutaan kali lipat!
3. **Membutuhkan Memori RAM (*Memory-Hard* pada Argon2id):** Mencegah penyerang memparalelkan ribuan tebakan sekaligus di atas chip GPU/ASIC murah!

## 2. Menggunakan `password_hash()`, `password_verify()`, dan `password_needs_rehash()`

PHP memiliki API pengamanan kata sandi bawaan terbaik di kelasnya:

```php
<?php

declare(strict_types=1);

final class PengelolaKataSandi
{
    private const array OPSI_ARGON2ID = [
        'memory_cost' => 65536, // 64 MB RAM per perhitungan hash
        'time_cost'   => 4,     // 4 iterasi putaran
        'threads'     => 1,
    ];

    public function buatHash(string $kataSandiPolos): string
    {
        if (mb_strlen($kataSandiPolos) < 8) {
            throw new InvalidArgumentException('Kata sandi minimal harus terdiri dari 8 karakter.');
        }

        // Gunakan PASSWORD_ARGON2ID (rekomendasi utama OWASP),
        // dengan fallback otomatis ke PASSWORD_DEFAULT (Bcrypt) jika ekstensi belum tersedia
        if (defined('PASSWORD_ARGON2ID')) {
            return password_hash($kataSandiPolos, PASSWORD_ARGON2ID, self::OPSI_ARGON2ID);
        }

        return password_hash($kataSandiPolos, PASSWORD_DEFAULT, ['cost' => 12]);
    }

    public function verifikasi(string $kataSandiMasukan, string $hashDariDatabase): bool
    {
        // password_verify() secara otomatis membaca algoritma, parameter cost, dan salt
        // langsung dari dalam string $hashDariDatabase!
        return password_verify($kataSandiMasukan, $hashDariDatabase);
    }

    public function apakahPerluRehash(string $hashDariDatabase): bool
    {
        if (defined('PASSWORD_ARGON2ID')) {
            return password_needs_rehash($hashDariDatabase, PASSWORD_ARGON2ID, self::OPSI_ARGON2ID);
        }

        return password_needs_rehash($hashDariDatabase, PASSWORD_DEFAULT, ['cost' => 12]);
    }
}
```

### Anatomi String Hasil `password_hash()`
Ketika `password_hash('Rahasia!2026', PASSWORD_ARGON2ID)` dijalankan, string keluarannya terlihat seperti ini:
```text
$argon2id$v=19$m=65536,t=4,p=1$c2FsdHUnbmlrMTIzNDU2$9f8e7d6c5b4a...
└───┬───┘ └─┬┘ └──────┬──────┘ └─────────┬────────┘ └──────┬──────┘
Algoritma Versi  Parameter Cost     Salt Acak (Base64)  Hash Akhir
```
Karena seluruh parameter dan *salt* sudah menyatu di dalam string tersebut (panjangnya sekitar 95–100 karakter), **pastikan kolom `password_hash` di tabel basis data Anda bertipe `VARCHAR(255)` atau `TEXT`**, dan Anda tidak perlu membuat kolom `salt` terpisah!

## 3. Pertahanan Tambahan: Mencegah Serangan *Timing Enumeration* Saat Login

Perhatikan celah halus pada halaman login berikut:
- Jika pengguna memasukkan alamat surel yang **terdaftar**, server menjalankan `password_verify()` yang memakan waktu **`250 milidetik`** sebelum menjawab *"Surel atau kata sandi salah"*.
- Namun jika pengguna memasukkan alamat surel yang **tidak terdaftar**, server langsung menjawab *"Surel atau kata sandi salah"* dalam waktu **`2 milidetik`** (karena `password_verify()` tidak dijalankan)!

Penyerang dapat mengukur selisih `250 ms` vs `2 ms` tersebut untuk mendata alamat surel mana saja yang sudah terdaftar di situs Anda!
**Solusinya:** Jika surel tidak ditemukan di database, tetap jalankan `password_verify($sandiMasukan, $hashPalsuTetap)` terhadap sebuah konstanta hash tiruan (*dummy hash*) agar waktu respons server selalu seragam!

```php
<?php

declare(strict_types=1);

// Hash tiruan untuk menyamakan waktu eksekusi ketika surel tidak ditemukan.
// Catatan: pada produksi, buat hash tiruan ini dengan algoritma dan parameter yang SAMA
// dengan hash asli (misalnya hasil password_hash() Argon2id yang disimpan sebagai konstanta);
// contoh Bcrypt di bawah hanya ilustrasi format dan waktunya berbeda dari Argon2id.
const HASH_TIRUAN = '$2y$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW';

function autentikasiPengguna(PDO $pdo, string $surel, string $sandi): ?array
{
    $stmt = $pdo->prepare('SELECT id, surel, password_hash FROM pengguna WHERE surel = :surel LIMIT 1');
    $stmt->execute(['surel' => strtolower(trim($surel))]);
    $pengguna = $stmt->fetch();

    // Jika pengguna tidak ditemukan, tetap jalankan password_verify terhadap HASH_TIRUAN!
    $hashTarget = is_array($pengguna) ? (string) $pengguna['password_hash'] : HASH_TIRUAN;
    $sandiCocok = password_verify($sandi, $hashTarget);

    if (!is_array($pengguna) || !$sandiCocok) {
        return null;
    }

    return $pengguna;
}
```

## 4. Merancang Alur "Lupa Kata Sandi" (*Password Reset*) yang Aman

Jangan pernah mengirimkan kata sandi baru lewat surel! Ikuti standar keamanan berikut saat membuat fitur *Reset Kata Sandi*:
1. Buat token acak satu kali pakai menggunakan **`$tokenPolos = bin2hex(random_bytes(32));`**.
2. **Jangan menyimpan `$tokenPolos` mentah-mentah di tabel database!** Simpan hasil hash SHA-256-nya (`$tokenHash = hash('sha256', $tokenPolos);`) beserta waktu kedaluwarsa singkat (misalnya 30 menit: `time() + 1800`) di database. *(Mengapa? Agar jika tabel database bocor dibaca pihak luar, mereka tetap tidak mengetahui `$tokenPolos` yang aktif untuk mengambil alih akun!).*
3. Kirimkan tautan yang berisi `$tokenPolos` ke alamat surel pengguna.
4. Saat pengguna membuka tautan tersebut dan mengirim kata sandi baru, hitung `hash('sha256', $tokenDariUrl)`, cari di database yang belum kedaluwarsa, perbarui `password_hash` pengguna, **langsung hapus token reset tersebut dari database**, dan cabut sesi-sesi lama pengguna!

## Latihan Praktik: Layanan Pembuatan dan Verifikasi Token Reset Kata Sandi

Buatlah berkas `ResetSandiLayanan.php`:
1. Buat metode `buatTokenReset(): array` yang mengembalikan `['token_url' => $tokenPolos, 'token_db_hash' => hash('sha256', $tokenPolos), 'kedaluwarsa_pada' => time() + 1800]`.
2. Buat metode `verifikasiTokenReset(string $tokenDariUrl, string $hashDariDb, int $kedaluwarsaPada): bool` yang memeriksa waktu kedaluwarsa terlebih dahulu lalu membandingkan hash menggunakan `hash_equals()`.

## Kuis Pemahaman

### Soal 1
Mengapa algoritma **Argon2id** (`PASSWORD_ARGON2ID`) lebih unggul dibandingkan algoritma hash cepat seperti SHA-256 atau bahkan Bcrypt untuk menyimpan kata sandi?
- A. Karena Argon2id menghasilkan string hash yang hanya terdiri dari 8 karakter.
- B. Karena selain sengaja membutuhkan waktu komputasi CPU (*time cost*), Argon2id juga bersifat *memory-hard* (mewajibkan alokasi blok memori RAM seperti 64 MB per perhitungan), sehingga sangat tahan terhadap serangan penebakan paralel menggunakan perangkat keras GPU/ASIC khusus.
- C. Karena Argon2id memungkinkan kita mendekripsi hash kembali menjadi kata sandi asli jika pengguna lupa.
- D. Karena Argon2id tidak membutuhkan *salt*.

**Jawaban Benar:** B
**Penjelasan:** Keunggulan utama Argon2id (pemenang *Password Hashing Competition* dan rekomendasi utama OWASP) adalah parameter `memory_cost` yang memaksa penyerang menyediakan memori RAM besar untuk setiap tebakan paralel, melumpuhkan keunggulan ribuan core kecil pada GPU.

### Soal 2
Mengapa pada kolom tabel basis data yang menyimpan hasil `password_hash()` kita wajib menggunakan tipe `VARCHAR(255)` atau `TEXT`, dan tidak boleh membatasinya menjadi `CHAR(32)` atau `VARCHAR(50)`?
- A. Karena kata sandi pengguna biasanya sepanjang 255 huruf.
- B. Karena string keluaran `password_hash()` (yang mencakup identifier algoritma, parameter *cost*, *salt*, dan hash) memiliki panjang 60 karakter untuk Bcrypt dan sekitar 95–100+ karakter untuk Argon2id; jika kolom terlalu pendek dan memotong ujung string hash, `password_verify()` akan selalu gagal (`false`) untuk semua pengguna!
- C. Karena MySQL dan PostgreSQL tidak mendukung `VARCHAR(60)`.
- D. Agar kolom tersebut dapat menyimpan gambar profil sekaligus.

**Jawaban Benar:** B
**Penjelasan:** Dokumentasi resmi PHP Manual secara tegas merekomendasikan `VARCHAR(255)` agar hasil `password_hash()` dari algoritma `PASSWORD_ARGON2ID` maupun algoritma baru di masa depan tidak pernah terpotong (*truncated*) oleh basis data.

### Soal 3
Saat menyimpan token *Reset Kata Sandi* (yang dihasilkan dengan `bin2hex(random_bytes(32))`) ke dalam basis data sambil menunggu pengguna mengeklik tautan di surelnya, mengapa kita cukup menyimpan `hash('sha256', $token)` di database alih-alih menyimpan `$token` polosnya?
- A. Karena `hash('sha256', $token)` lebih pendek dari 10 karakter.
- B. Karena jika penyerang berhasil membaca isi tabel database (misalnya lewat celah baca SQL atau cadangan database yang bocor), penyerang tetap tidak dapat menggunakan nilai hash tersebut untuk menyusun URL reset kata sandi yang sah. (Dan karena `$token` berasal dari `random_bytes(32)` yang memiliki entropi 256-bit, SHA-256 tidak mungkin ditebak dengan *brute-force*).
- C. Karena database tidak bisa menyimpan karakter heksadesimal.
- D. Agar token berlaku selamanya tanpa kedaluwarsa.

**Jawaban Benar:** B
**Penjelasan:** Berbeda dengan kata sandi pilihan manusia yang entropinya rendah (sehingga wajib memakai Argon2id/Bcrypt), token acak dari `random_bytes(32)` memiliki 256 bit entropi acak murni yang mustahil ditebak secara *brute-force*. Menyimpan hash SHA-256-nya di database melindungi token aktif dari kebocoran pembacaan tabel.

## Sumber
- [`password_hash` — PHP Manual](https://www.php.net/manual/en/function.password-hash.php)
- [`password_verify` — PHP Manual](https://www.php.net/manual/en/function.password-verify.php)
- [`password_needs_rehash` — PHP Manual](https://www.php.net/manual/en/function.password-needs-rehash.php)
- [Password Hashing FAQ — PHP Manual](https://www.php.net/manual/en/faq.passwords.php)
