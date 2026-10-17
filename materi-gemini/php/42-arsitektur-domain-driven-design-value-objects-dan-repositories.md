# Arsitektur Bersih & Taktik Domain-Driven Design (DDD) di PHP: Value Objects, Entities, dan Repository Pattern

- **Tingkat:** Lanjut
- **Ringkasan:** Mengisolasi aturan bisnis inti dari detail database atau HTTP menggunakan **Value Objects** yang *immutable* (`readonly class` seperti `NominalUang`, `AlamatEmail`), **Domain Entities**, serta antarmuka **Repository** yang mudah diganti saat pengujian.

## Mengapa Meneruskan `string` dan `int` Telanjang untuk Konsep Bisnis Memicu Bug yang Mahal?

Bayangkan sebuah fungsi layanan pengiriman:
`function prosesPengiriman(string $idPesanan, string $kodePos, int $beratGram, int $biayaOngkir)`

Karena keempat parameternya hanyalah tipe primitif telanjang (`string` dan `int`), apa yang terjadi jika seorang pengembang tidak sengaja menukar urutan argumen menjadi `prosesPengiriman($kodePos, $idPesanan, $biayaOngkir, $beratGram)`? Deklarasi `strict_types=1` **tidak akan mendeteksi kesalahan tersebut** karena tipenya sama-sama `string` dan `int`! Selain itu, setiap fungsi di aplikasi harus memeriksa berulang-ulang apakah `$biayaOngkir >= 0` dan apakah `$kodePos` 5 digit.

Gejala penyakit kode ini disebut **Primitive Obsession** (*Obsesi Primitif*). Dalam **Domain-Driven Design (DDD)**, kita menyembuhkannya dengan membungkus konsep domain ke dalam **Value Object** (`readonly class`), memisahkannya dari **Entity** (objek beridentitas), dan mengisolasi kueri database di balik antarmuka **Repository**.

> **🚫 Kerentanan & Kesalahan Umum:** Obsesi primitif (*Primitive Obsession*)—yaitu meneruskan email, nomor telepon, kode mata uang, dan nominal harga semuanya sebagai `string` atau `int` telanjang ke puluhan fungsi—membuat urutan argumen mudah tertukar dan validasi harus ditulis berulang-ulang.

## 1. Perbandingan Tiga Blok Bangunan Taktis Domain-Driven Design (DDD)

Pahami perbedaan peran antara **Value Object**, **Entity**, dan **Repository**:

| Komponen Taktis DDD | Identitas & Kesetaraan | Sifat Perubahan (*Mutability*) | Contoh di Aplikasi E-Commerce / Edukasi |
| :--- | :--- | :--- | :--- |
| **Value Object** | **Tidak memiliki ID.** Dua Value Object dianggap sama jika seluruh nilainya sama (`Rp 50.000 === Rp 50.000`). | **Wajib *Immutable* (`final readonly class`)**: operasi matematika menghasilkan instans baru! | `NominalRupiah`, `AlamatEmail`, `RentangTanggal`, `KoordinatGps`. |
| **Domain Entity** | **Memiliki ID Unik** yang tetap sepanjang siklus hidupnya meskipun atribut lainnya berubah. | Memiliki metode perilaku bisnis (bukan sekadar *getter/setter* pasif) yang menjaga aturan invarian domain. | `Pesanan` (`tandaiLunas()`, `batalkan()`), `Siswa`, `Kursus`. |
| **Repository Interface** | Antarmuka koleksi domain (`PesananRepositoryInterface`) di lapisan Domain. | Menyembunyikan detail penyimpanan: implementasi produksi memakai `PDO`, implementasi uji memakai array memori! | `simpan(Pesanan $p): void`, `cariBerdasarkanId(IdPesanan $id): ?Pesanan`. |

## 2. Membangun *Value Object* (`NominalRupiah` & `AlamatEmail`) dan *Domain Entity*

Perhatikan bagaimana `NominalRupiah` menggunakan `final readonly class`, memvalidasi syarat bisnisnya sendiri (*self-validating*) di dalam konstruktor, dan mengembalikan objek baru pada metode `tambah()` serta `kurangi()`:

```php
<?php
declare(strict_types=1);

final readonly class NominalRupiah
{
    public function __construct(public int $jumlah)
    {
        if ($jumlah < 0) {
            throw new InvalidArgumentException('Nominal Rupiah tidak boleh negatif.');
        }
    }

    public function tambah(self $lain): self
    {
        return new self($this->jumlah + $lain->jumlah);
    }

    public function kurangi(self $lain): self
    {
        if ($lain->jumlah > $this->jumlah) {
            throw new DomainException('Pengurangan melebihi nominal yang tersedia.');
        }
        return new self($this->jumlah - $lain->jumlah);
    }

    public function samaDengan(self $lain): bool
    {
        return $this->jumlah === $lain->jumlah;
    }
}

final readonly class AlamatEmail
{
    public string $nilai;

    public function __construct(string $emailMentah)
    {
        $bersih = strtolower(trim($emailMentah));
        if (filter_var($bersih, FILTER_VALIDATE_EMAIL) === false) {
            throw new InvalidArgumentException("Alamat surel tidak valid: {$emailMentah}");
        }
        $this->nilai = $bersih;
    }
}
```

## 3. Mengisolasi Database dengan Pola *Repository Interface*

Dengan mendefinisikan `DompetRepositoryInterface` yang hanya berbicara dalam bahasa domain (`Dompet`, `NominalRupiah`), layanan bisnis Anda dapat diuji 1000 kali per detik menggunakan `InMemoryDompetRepository` tanpa menyentuh server database sama sekali:

```php
<?php
declare(strict_types=1);

final class Dompet
{
    public function __construct(
        public readonly int $idPengguna,
        private NominalRupiah $saldo,
    ) {}

    public function saldoSaatIni(): NominalRupiah
    {
        return $this->saldo;
    }

    public function setor(NominalRupiah $nominal): void
    {
        $this->saldo = $this->saldo->tambah($nominal);
    }

    public function tarik(NominalRupiah $nominal): void
    {
        $this->saldo = $this->saldo->kurangi($nominal);
    }
}

interface DompetRepositoryInterface
{
    public function ambilBerdasarkanPengguna(int $idPengguna): ?Dompet;
    public function simpan(Dompet $dompet): void;
}

final class InMemoryDompetRepository implements DompetRepositoryInterface
{
    /** @var array<int, Dompet> */
    private array $data = [];

    public function ambilBerdasarkanPengguna(int $idPengguna): ?Dompet
    {
        return isset($this->data[$idPengguna]) ? clone $this->data[$idPengguna] : null;
    }

    public function simpan(Dompet $dompet): void
    {
        $this->data[$dompet->idPengguna] = clone $dompet;
    }
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Membuat *Anemic Domain Model* (Entity yang hanya berisi properti publik atau *getter/setter* kosong tanpa aturan bisnis):** Jika seluruh aturan seperti *"pesanan yang sudah dikirim tidak boleh dibatalkan"* ditaruh di Controller sementara class `Pesanan` hanya memiliki `setStatus(string $s)`, maka aturan tersebut mudah terlewat saat status diubah dari CLI atau antrean. Letakkan metode `batalkan()` langsung di dalam Entity `Pesanan`!
2. **Mengizinkan Value Object dimutasi di tempat (`$uang->jumlah += 5000`):** Jika sebuah objek `NominalRupiah` dibagikan sebagai referensi antara `$pesanan->total` dan `$tagihan->total`, memutasi nilainya di satu tempat akan diam-diam mengubah nilai di tempat lain (*aliasing bug*). Value Object **wajib `readonly`**.
3. **Membocorkan objek `PDOStatement` keluar dari metode Repository:** Metode pada `RepositoryInterface` harus mengembalikan objek Domain (`Entity` / `Value Object` / koleksi DTO), bukan objek infrastruktur database.

## Latihan Praktik Mandiri

1. Buat berkas `DomainDompet.php` yang memuat `NominalRupiah`, `AlamatEmail`, `Dompet`, `DompetRepositoryInterface`, dan `InMemoryDompetRepository`.
2. Tulis pengujian PHPUnit untuk menguji:
   - ketidakberubahan (*immutability*) `NominalRupiah::tambah()`;
   - lemparan `DomainException` saat `Dompet::tarik()` melebihi saldo yang tersedia;
   - penyimpanan dan pengambilan `Dompet` melalui `InMemoryDompetRepository`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Obsesi primitif (*Primitive Obsession*)—yaitu meneruskan email, nomor telepon, kode mata uang, dan nominal harga semuanya sebagai `string` atau `int` telanjang ke puluhan fungsi—membuat urutan argumen mudah tertukar dan validasi harus ditulis berulang-ulang.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena nilai primitif telanjang mudah tertukar urutan argumennya dan aturan validasi tersebar serta terulang di banyak tempat, sehingga rawan bug yang sulit dilacak
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Obsesi primitif (*Primitive Obsession*)—yaitu meneruskan email, nomor telepon, kode mata uang, dan nominal harga semuanya sebagai `string` atau `int` telanjang ke puluhan fungsi—membuat urutan argumen mudah tertukar dan validasi harus ditulis berulang-ulang.

### Soal 2
Apa perbedaan mendasar antara **Value Object** dan **Entity** dalam taktik *Domain-Driven Design* (DDD)?
- A. Value Object wajib disimpan di tabel database tersendiri, sedangkan Entity tidak boleh disimpan di database
- B. **Value Object** diidentifikasi murni berdasarkan kesamaan nilai-nilai di dalamnya (tidak memiliki ID siklus hidup) dan selalu bersifat *immutable* (`readonly`), sedangkan **Entity** memiliki identitas unik (`id`) yang tetap sama sepanjang siklus hidupnya meskipun atribut atau status di dalamnya berubah
- C. Entity hanya boleh berisi konstanta statis, sedangkan Value Object berisi koneksi PDO
- D. Value Object hanya berlaku untuk tipe string, sedangkan Entity hanya untuk tipe integer

**Jawaban Benar:** B
**Penjelasan:** Dua lembar uang Rp 50.000 memiliki nilai yang identik dan dapat dipertukarkan (*Value Object*), sedangkan dua akun `Pengguna` yang kebetulan memiliki nama sama tetaplah dua entitas berbeda karena memiliki `id` identitas yang berbeda (*Entity*).

### Soal 3
Apa tujuan utama mendefinisikan **Repository Interface** (misalnya `PesananRepositoryInterface`) di lapisan Domain dan memisahkannya dari implementasi konkret `PdoPesananRepository`?
- A. Agar kueri SQL berjalan tanpa memerlukan indeks database
- B. Mengisolasi logika bisnis domain dari detail teknis penyimpanan database sehingga aturan bisnis tidak terikat pada SQL/PDO dan dapat diuji secara cepat menggunakan implementasi tiruan di memori (`InMemoryPesananRepository`)
- C. Menggantikan seluruh fungsi Composer autoloader
- D. Memaksa semua tabel database menggunakan satu kolom saja

**Jawaban Benar:** B
**Penjelasan:** Sesuai prinsip *Dependency Inversion*, lapisan bisnis bergantung pada abstraksi (`RepositoryInterface`), bukan pada detail infrastruktur database, sehingga pengujian unit berjalan instan dan mesin penyimpanan dapat diganti tanpa merombak logika domain.

## Sumber

- [Properties (readonly) — PHP Manual](https://www.php.net/manual/en/language.oop5.properties.php)
- [Classes and Objects — PHP Manual](https://www.php.net/manual/en/language.oop5.basic.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
