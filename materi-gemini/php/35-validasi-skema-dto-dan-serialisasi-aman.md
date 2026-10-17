# Data Transfer Objects (DTO), Hydrator Berbasis Atribut, dan Bahaya `unserialize()`

- **Tingkat:** Lanjut
- **Ringkasan:** Memetakan array masukan mentah dari HTTP/JSON ke dalam objek **DTO (`readonly class`)** yang tervalidasi penuh, serta memahami mengapa memanggil `unserialize()` pada data dari pengguna dapat memicu **PHP Object Injection / Remote Code Execution (RCE)**.

## Mengapa Meneruskan Array Asosiatif `$_POST` Mentah ke Lapisan Bisnis Sangat Rawan Bug?

Ketika fungsi layanan bisnis Anda menerima parameter `array $data` mentah (seperti `buatPesanan(array $input)`), tidak ada seorang pun yang tahu pasti kunci apa saja yang ada di dalam `$input`, apakah `$input['jumlah']` bertipe `int` atau `string`, atau apakah `$input['email']` sudah divalidasi. Akibatnya, setiap fungsi di lapisan bawah terpaksa mengulang pemeriksaan `isset()` dan `is_string()` berkali-kali.

Dengan memetakan (*hydration*) array masukan mentah ke dalam sebuah **Data Transfer Object (DTO)** bertipe **`final readonly class`** tepat di pintu masuk aplikasi (Controller), Anda menjamin bahwa begitu sebuah objek DTO berhasil dibuat, seluruh propertinya **pasti valid, memiliki tipe yang tegas, dan tidak dapat dimutasi di tengah jalan**.

Di sisi lain, saat menyimpan atau menerima data terstruktur dari luar, **jangan pernah menggunakan fungsi `serialize()` / `unserialize()` PHP pada data yang berasal dari pengguna**, karena dapat memicu celah **PHP Object Injection**!

> **🚫 Kerentanan & Kesalahan Umum:** Jangan pernah memanggil `unserialize()` pada string yang berasal dari cookie, input form, atau jaringan tanpa pembatasan `['allowed_classes' => false]`, karena penyerang dapat merangkai *Gadget Chain* (`__wakeup` / `__destruct`) pada class yang ada di proyek Anda untuk mengeksekusi perintah sistem!

## 1. Perbandingan Array Asosiatif, DTO `readonly class`, dan Format Serialisasi

Perhatikan perbedaan keamanan dan keandalan antara pendekatan lama dan standar PHP modern:

| Aspek | Praktik Berbahaya / Rapuh (Hindari) | Standar PHP Modern (PHP 8.2–8.5) |
| :--- | :--- | :--- |
| **Kontrak Data Antar-Lapisan** | Meneruskan `array $data` tanpa bentuk yang jelas ke Service/Repository. | **`final readonly class ...Dto`** dengan metode pabrik statis `dariArray(array $input): self`. |
| **Aturan Validasi Properti** | Tersebar di banyak fungsi dengan `if (empty(...))` yang tidak konsisten. | Validasi terpusat di konstruktor DTO atau melalui **Atribut PHP 8 (`#[...]`) + Refleksi**. |
| **Pertukaran Data Eksternal** | `unserialize($_COOKIE['keranjang'])` (Rentan **PHP Object Injection / RCE**!). | **`json_decode($json, true, 512, JSON_THROW_ON_ERROR)`** lalu dipetakan ke DTO. |
| **Jika Terpaksa `unserialize()` Data Skalar** | `unserialize($str)` tanpa argumen kedua. | Wajib mengunci **`unserialize($str, ['allowed_classes' => false])`**! |

## 2. Merancang DTO `readonly class` dan Hydrator Berbasis Atribut Refleksi

Berikut adalah pola DTO yang memvalidasi masukan secara ketat saat dikonstruksi, ditambah contoh bagaimana atribut kustom PHP 8 dapat dibaca dengan `ReflectionClass` untuk memvalidasi properti DTO secara deklaratif:

```php
<?php
declare(strict_types=1);

#[Attribute(Attribute::TARGET_PROPERTY)]
final readonly class PanjangString
{
    public function __construct(public int $min, public int $maks) {}
}

final readonly class PendaftaranPenggunaDto
{
    public function __construct(
        public string $email,
        #[PanjangString(min: 2, maks: 80)]
        public string $namaLengkap,
    ) {
        if (filter_var($this->email, FILTER_VALIDATE_EMAIL) === false) {
            throw new InvalidArgumentException('Format alamat surel tidak valid.');
        }
        self::validasiAtribut($this);
    }

    public static function dariArray(array $input): self
    {
        $email = strtolower(trim((string) ($input['email'] ?? '')));
        $nama  = trim((string) ($input['nama_lengkap'] ?? ''));
        return new self($email, $nama);
    }

    private static function validasiAtribut(object $dto): void
    {
        $ref = new ReflectionClass($dto);
        foreach ($ref->getProperties() as $prop) {
            foreach ($prop->getAttributes(PanjangString::class) as $attr) {
                /** @var PanjangString $aturan */
                $aturan  = $attr->newInstance();
                $panjang = mb_strlen((string) $prop->getValue($dto));
                if ($panjang < $aturan->min || $panjang > $aturan->maks) {
                    throw new InvalidArgumentException(
                        "Properti {$prop->getName()} wajib antara {$aturan->min} hingga {$aturan->maks} karakter."
                    );
                }
            }
        }
    }
}
```

## 3. Memahami Mekanisme Serangan *PHP Object Injection* pada `unserialize()`

Mengapa memanggil `unserialize($inputPengguna)` bisa berujung pada **Remote Code Execution (RCE)** padahal kode Anda hanya membaca data?
Ketika `unserialize()` membaca string seperti `'O:16:"PembersihSementara":1:{s:10:"berkasLog";s:15:"/var/www/index.php";}'`, PHP akan:
1. Menginstansiasi class `PembersihSementara` yang kebetulan sudah ter-autoload di proyek/vendor Composer Anda;
2. Mengisi properti `$berkasLog` dengan nilai pilihan penyerang (`"/var/www/index.php"`);
3. Secara otomatis memanggil metode ajaib (**magic methods**) seperti **`__unserialize()`**, **`__wakeup()`**, dan saat skrip berakhir, **`__destruct()`**! Jika di dalam `__destruct()` terdapat kode `unlink($this->berkasLog)` atau eksekusi perintah, penyerang berhasil membajak server Anda (**Property-Oriented Programming / POP Gadget Chain**)!

```php
<?php
declare(strict_types=1);

// AMAN: Gunakan JSON untuk seluruh pertukaran data eksternal!
// Jika harus membaca data warisan yang telanjur di-serialize, matikan instansiasi class sepenuhnya:
function unserializeHanyaArraySkalar(string $dataTerserialisasi): mixed
{
    // allowed_classes => false mengubah semua objek di dalam string menjadi __PHP_Incomplete_Class
    // sehingga __wakeup() dan __destruct() TIDAK PERNAH dieksekusi!
    return unserialize($dataTerserialisasi, ['allowed_classes' => false]);
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Mendaftarkan daftar putih `['allowed_classes' => [KelasA::class]]` pada `unserialize()` tanpa mengaudit metode ajaibnya:** Bahkan jika hanya 1 class yang diizinkan, apabila class tersebut memiliki `__wakeup()`, `__destruct()`, atau `__toString()` yang melakukan operasi berkas/jaringan, celah masih bisa dieksploitasi. Gunakan **`JSON`** (`json_encode`/`json_decode`) sebagai standar mutlak.
2. **Membuat properti DTO dapat diubah (`public string $email` tanpa `readonly`):** Jika nilai properti DTO dapat diubah setelah melewati validasi konstruktor, bagian kode lain dapat memasukkan nilai tidak valid ke dalam DTO tersebut. Selalu gunakan `final readonly class`.
3. **Menempatkan kueri database PDO di dalam class DTO:** DTO hanyalah kantong pembawa data lintas lapisan yang bebas ketergantungan layanan luar; kueri database adalah tugas lapisan Repository.

## Latihan Praktik Mandiri

1. Buat berkas `PendaftaranPenggunaDto.php` beserta atribut `#[PanjangString]` dan fungsi `unserializeHanyaArraySkalar()`.
2. Tulis pengujian PHPUnit untuk memverifikasi bahwa:
   - `PendaftaranPenggunaDto::dariArray()` melempar `InvalidArgumentException` jika nama kurang dari 2 huruf atau surel tidak valid;
   - `unserializeHanyaArraySkalar()` mengubah payload objek ter-serialize menjadi `__PHP_Incomplete_Class` tanpa menjalankan metode `__destruct()` milik class asli.

## Kuis Pemahaman

### Soal 1
Mengapa memanggil fungsi `unserialize()` secara langsung terhadap data yang berasal dari pengguna (seperti isi cookie atau parameter form) sangat berbahaya di PHP?
- A. Karena `unserialize()` membutuhkan memori minimal 1 GB
- B. Karena memicu kerentanan **PHP Object Injection**: penyerang dapat mengirimkan string objek ter-serialize yang menginstansiasi class apa pun yang tersedia di autoloader dan secara otomatis memicu eksekusi metode ajaib seperti `__wakeup()`, `__unserialize()`, atau `__destruct()` (*Gadget Chain* / RCE)
- C. Karena `unserialize()` menghapus seluruh isi variabel `$_SESSION`
- D. Karena `unserialize()` mengubah semua string menjadi huruf besar

**Jawaban Benar:** B
**Penjelasan:** Berbeda dengan `json_decode()` yang hanya menghasilkan array dan tipe skalar dasar, `unserialize()` menghidupkan kembali instans objek beserta siklus hidup *magic methods*-nya, yang dapat disalahgunakan melalui *POP Gadget Chains*.

### Soal 2
Opsi apakah yang **wajib** diteruskan pada argumen kedua `unserialize($data, $options)` apabila Anda terpaksa membaca data ter-serialize warisan dan ingin mencegah pembuatan objek class apa pun?
- A. `['strict' => true]`
- B. `['allowed_classes' => false]`
- C. `['max_depth' => 0]`
- D. `['safe_mode' => 1]`

**Jawaban Benar:** B
**Penjelasan:** Dengan menyetel `['allowed_classes' => false]`, PHP menolak menginstansiasi class apa pun dan membungkusnya sebagai objek pasif `__PHP_Incomplete_Class` yang tidak memiliki metode `__wakeup()` maupun `__destruct()`.

### Soal 3
Apa manfaat utama mendefinisikan **Data Transfer Object (DTO)** sebagai `final readonly class` yang memvalidasi datanya di dalam konstruktor?
- A. Membuat objek otomatis tersimpan ke database tanpa PDO
- B. Menjamin *immutability* dan prinsip *always-valid*: begitu instans DTO berhasil dibuat di pintu masuk aplikasi, setiap fungsi yang menerimanya dijamin mendapatkan tipe data yang pasti valid dan nilainya tidak dapat diubah secara diam-diam di tengah alur eksekusi
- C. Menghilangkan kebutuhan akan `declare(strict_types=1)`
- D. Mempercepat koneksi jaringan HTTP

**Jawaban Benar:** B
**Penjelasan:** Kombinasi validasi di konstruktor (*fail-fast*) dan penguncian properti `readonly` memastikan objek DTO tidak pernah berada dalam keadaan tidak valid sepanjang masa hidupnya.

## Sumber

- [`unserialize` — PHP Manual](https://www.php.net/manual/en/function.unserialize.php)
- [Deserialization Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
