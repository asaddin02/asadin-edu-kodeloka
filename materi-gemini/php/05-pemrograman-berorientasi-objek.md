# Pemrograman Berorientasi Objek (OOP) Modern: Readonly, Asymmetric Visibility, dan Property Hooks

- **Tingkat:** Menengah
- **Ringkasan:** Merancang class yang ringkas dan tangguh di PHP 8 menggunakan *Constructor Property Promotion*, *Readonly Classes* & `clone($this, [...])` (PHP 8.5), *Asymmetric Visibility* `public private(set)` (PHP 8.4), *Property Hooks* (PHP 8.4), serta `interface` dan `trait`.

## 1. Class Modern dan *Constructor Property Promotion* (Sejak PHP 8.0)

Di PHP versi lama, membuat sebuah class sederhana dengan 4 properti mengharuskan kita menulis nama properti yang sama sebanyak **empat kali** (deklarasi properti, parameter konstruktor, penugasan `$this->a = $a`, dan getter).

Sejak **PHP 8.0**, fitur **Constructor Property Promotion** memungkinkan Anda mendeklarasikan visibilitas (`public`, `protected`, `private`) langsung di dalam parameter `__construct()`, dan PHP otomatis membuatkan properti sekaligus mengisi nilainya!

```php
<?php

declare(strict_types=1);

class KursusKodeloka
{
    public function __construct(
        public string $slug,
        public string $judul,
        public int $jumlahModul,
        private string $kodeInternal = 'KDLK-00',
    ) {}

    public function infoRingkas(): string
    {
        return sprintf('%s (%d modul)', $this->judul, $this->jumlahModul);
    }
}

$kursus = new KursusKodeloka('php', 'Pemrograman PHP Modern', 15);
echo $kursus->infoRingkas(); // "Pemrograman PHP Modern (15 modul)"
```

> **💡 Fitur Ergonomis Baru (Sejak PHP 8.4): `new MyClass()->method()` Tanpa Kurung Tambahan!**
> Sebelum PHP 8.4, jika Anda ingin langsung memanggil metode saat membuat objek baru, Anda wajib membungkus `new` dengan tanda kurung ekstra: `(new KursusKodeloka(...))->infoRingkas()`.
> Sejak **PHP 8.4**, Anda dapat langsung menulisnya dengan bersih tanpa kurung pembungkus:
> `echo new KursusKodeloka('php', 'PHP Modern', 15)->infoRingkas();`

## 2. Immutability dengan `readonly` Class dan `clone()` Baru (PHP 8.2 & 8.5)

Objek yang nilainya tidak dapat diubah lagi setelah dibuat (**Immutable Value Object / Data Transfer Object**) sangat aman karena Anda dapat meneruskannya ke fungsi mana pun tanpa khawatir datanya diubah secara diam-diam.

- Sejak **PHP 8.1**, Anda dapat menandai properti individual dengan kata kunci **`readonly`**.
- Sejak **PHP 8.2**, menandai seluruh class sebagai **`readonly class`** otomatis menjadikan seluruh properti di dalamnya bersifat `readonly`!
- Dan sejak **PHP 8.5**, ketika Anda ingin membuat salinan dari objek `readonly` sambil memperbarui satu propertinya saja (pola *with-er*), fungsi **`clone($objek, ['properti' => $nilaiBaru])`** kini mendukung pembaruan properti secara langsung saat penyalinan!

```php
<?php

declare(strict_types=1);

readonly class KonfigurasiKoneksi
{
    public function __construct(
        public string $host,
        public int $port = 5432,
        public int $timeoutDetik = 5,
    ) {}

    // Pola "with-er" untuk objek immutable:
    // Sejak PHP 8.5, clone() menerima argumen ke-2 berupa array properti yang ingin diperbarui!
    public function denganTimeout(int $detikBaru): self
    {
        return clone($this, [
            'timeoutDetik' => $detikBaru,
        ]);
    }
}

$koneksiUtama = new KonfigurasiKoneksi('db.kodeloka.internal');
// $koneksiUtama->timeoutDetik = 10; // Error! Properti readonly tidak boleh diubah di tempat.

$koneksiLaporan = $koneksiUtama->denganTimeout(30);
echo $koneksiUtama->timeoutDetik;   // Tetap 5
echo $koneksiLaporan->timeoutDetik; // 30
```

## 3. Visibilitas Asimetris (`public private(set)`) dan Property Hooks (Sejak PHP 8.4)

Bagaimana jika sebuah objek *bukan* objek immutable (nilai di dalamnya masih boleh berubah melalui metode bisnis internal class), tetapi Anda ingin pihak luar **bisa membaca nilainya secara langsung tanpa boleh mengubahnya dari luar**?

Dulu kita harus membuat properti `private` lalu menulis metode `getSaldo()` yang bertele-tele. Sejak **PHP 8.4**, hadir dua fitur revolusioner:

### A. Asymmetric Visibility (`public private(set)` — Sejak PHP 8.4)
Anda dapat mengatur hak baca (*read*) dan hak tulis (*write/set*) sebuah properti secara terpisah:

```php
<?php

declare(strict_types=1);

class DompetBelajar
{
    // Boleh DIBACA oleh siapa saja (public),
    // tetapi HANYA boleh DIUBAH dari dalam class ini sendiri (private(set))!
    public private(set) int $poin = 0;

    public function tambahPoinSelesaiModul(int $tambahan = 10): void
    {
        if ($tambahan <= 0) {
            throw new InvalidArgumentException('Poin harus positif.');
        }
        $this->poin += $tambahan;
    }
}

$dompet = new DompetBelajar();
$dompet->tambahPoinSelesaiModul(25);
echo $dompet->poin; // 25 (Bisa dibaca langsung tanpa getPoin()!)
// $dompet->poin = 9999; // Error! Tidak boleh diubah dari luar class DompetBelajar.
```

### B. Property Hooks (`get` dan `set` — Sejak PHP 8.4)
**Property Hooks** memungkinkan Anda menempelkan logika validasi/normalisasi saat properti diisi (`set`), atau membuat properti terhitung (*virtual property* dengan `get`), langsung pada deklarasi properti tanpa mengubah cara pemanggil mengakses `$objek->properti`:

```php
<?php

declare(strict_types=1);

class Pengguna
{
    // 1. Backed property dengan hook 'set' untuk menormalisasi dan memvalidasi surel
    public string $surel {
        set (string $nilai) {
            $bersih = strtolower(trim($nilai));
            if (!filter_var($bersih, FILTER_VALIDATE_EMAIL)) {
                throw new InvalidArgumentException("Format surel tidak sah: {$nilai}");
            }
            $this->surel = $bersih;
        }
    }

    // 2. Virtual property (hanya punya hook 'get', tidak memakan memori penyimpanan tersendiri)
    public string $namaLengkap {
        get => trim("{$this->namaDepan} {$this->namaBelakang}");
    }

    public function __construct(
        public string $namaDepan,
        public string $namaBelakang,
        string $surel,
    ) {
        $this->surel = $surel; // Otomatis melewati hook 'set' di atas!
    }
}

$user = new Pengguna('Nadia', 'Pratama', '  NADIA@AsadinEdu.com ');
echo $user->surel;       // "nadia@asadinedu.com"
echo $user->namaLengkap; // "Nadia Pratama"
```

## 4. Kontrak dengan `interface`, Pewarisan `abstract class` (`#[\Override]`), dan `trait`

- **`interface` (Kontrak Kemampuan):** Mendefinisikan tanda tangan metode publik yang wajib diimplementasikan oleh sebuah class (`class PengirimSmtp implements PengirimNotifikasi`). Satu class dapat mengimplementasikan banyak `interface`.
- **`abstract class` & `#[\Override]` (Sejak PHP 8.3):** Ketika subkelas menimpa metode milik kelas induk atau mengimplementasikan metode interface, tambahkan atribut **`#[\Override]`** di atas metode tersebut! Dengan `#[\Override]`, PHP akan segera memberi tahu Anda jika nama metode salah ketik atau jika kelas induk mengubah nama metodenya di masa depan.
- **`trait`:** Mekanisme penggunaan ulang kode secara horizontal (`use MencatatWaktu;`) ketika beberapa class yang tidak memiliki hubungan induk-anak membutuhkan metode pembantu yang sama.

## Latihan Praktik: Merancang Entitas Produk dengan Asymmetric Visibility dan Property Hooks

Buatlah berkas `entitas-produk.php`:
1. Buat `class Produk` yang menggunakan *constructor property promotion* untuk `public readonly string $kodeSku`.
2. Tambahkan properti `public private(set) int $stok = 0` dan metode `tambahStok(int $jumlah)` serta `kurangiStok(int $jumlah)`.
3. Tambahkan properti `$hargaRupiah` dengan *property hook* `set` yang menolak nilai negatif (`InvalidArgumentException`), serta *virtual property* `$hargaTerformat` dengan hook `get` yang mengembalikan `'Rp' . number_format($this->hargaRupiah, 0, ',', '.')`.

## Kuis Pemahaman

### Soal 1
Apa arti dari deklarasi properti `public private(set) string $status = 'menunggu';` yang diperkenalkan sejak **PHP 8.4**?
- A. Properti `$status` bersifat privat untuk dibaca, tetapi boleh diubah secara bebas dari luar class.
- B. Properti `$status` menggunakan *Asymmetric Visibility*: nilainya dapat dibaca secara publik (`public`) dari mana saja, tetapi hanya boleh diubah (`set`) dari dalam metode milik class itu sendiri (`private`).
- C. Properti `$status` hanya boleh diisi satu kali di dalam konstruktor.
- D. Properti `$status` otomatis dihapus ketika objek di-clone.

**Jawaban Benar:** B
**Penjelasan:** *Asymmetric Visibility* di PHP 8.4 memisahkan cakupan izin baca (*read visibility* di depan) dan izin tulis (*set visibility* di dalam `...(set)`). Dengan `public private(set)`, Anda tidak perlu lagi menulis metode boilerplate `getStatus()` hanya demi melindungi properti agar tidak ditimpa dari luar.

### Soal 2
Bagaimana cara yang paling bersih di **PHP 8.5** untuk membuat salinan baru dari sebuah `readonly class` sambil mengubah nilai satu propertinya saja?
- A. Mengubah properti tersebut secara langsung lalu memanggil `clone $this`.
- B. Menggunakan sintaks *Clone With* baru di PHP 8.5: `return clone($this, ['namaProperti' => $nilaiBaru]);`.
- C. Mengubah objek menjadi JSON lalu mengurainya kembali.
- D. Objek dari `readonly class` tidak diizinkan untuk di-clone sama sekali.

**Jawaban Benar:** B
**Penjelasan:** Sebelum PHP 8.5, memperbarui properti saat meng-clone `readonly class` mengharuskan pembuatan ulang instans `new self(...)` dengan membongkar seluruh propertinya. Sejak PHP 8.5, fungsi `clone($objek, $arrayPropertiBaru)` memungkinkan pembaruan properti `readonly` secara resmi tepat pada saat proses kloning berlangsung.

### Soal 3
Apa manfaat menambahkan atribut `#[\Override]` (sejak PHP 8.3) di atas sebuah metode pada subkelas (*child class*)?
- A. Membuat metode tersebut berjalan dua kali lebih cepat di OPcache.
- B. Meminta mesin PHP memverifikasi pada saat kompilasi bahwa metode dengan nama tersebut memang benar-benar ada di kelas induk atau di `interface` yang diimplementasikan, sehingga langsung mendeteksi kesalahan ketik nama metode.
- C. Mengizinkan metode `private` milik kelas induk diakses dari luar.
- D. Menonaktifkan metode milik kelas induk secara permanen di semua kelas lain.

**Jawaban Benar:** B
**Penjelasan:** Tanpa `#[\Override]`, jika Anda tidak sengaja salah mengetik nama metode saat hendak menimpa metode kelas induk, PHP akan menganggapnya sebagai metode baru yang terpisah tanpa memberikan pesan galat. Dengan `#[\Override]`, mesin PHP menjamin metode tersebut benar-benar menimpa metode leluhur/interface.

## Sumber
- [Classes and Objects: The Basics — PHP Manual](https://www.php.net/manual/en/language.oop5.basic.php)
- [PHP 8.4 Release Announcement (Property Hooks, Asymmetric Visibility) — PHP.net](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement (Clone With) — PHP.net](https://www.php.net/releases/8.5/en.php)
