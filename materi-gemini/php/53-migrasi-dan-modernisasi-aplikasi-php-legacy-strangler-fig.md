# Strategi Modernisasi Aplikasi PHP Legacy: Pola *Strangler Fig*, Penggantian `mysql_*`, dan Refactoring Bertahap

- **Tingkat:** Lanjut
- **Ringkasan:** Memodernisasi kode PHP warisan (skrip prosedural bercampur HTML tanpa pengujian) menuju PHP 8.4/8.5 secara bertahap tanpa menghentikan bisnis menggunakan pola **Strangler Fig**, pengenalan Composer & PSR-4, pembuatan *Characterization Tests*, serta otomasi pembaruan sintaks dengan **Rector**.

## Mengapa Proyek "Tulis Ulang Total dari Nol (*Big-Bang Rewrite*)" Hampir Selalu Berakhir Bencana?

Saat diwarisi aplikasi PHP berumur 10 tahun yang berisi ribuan baris SQL mentah bercampur HTML (`include 'header.php'`), godaan terbesar tim rekayasa adalah berkata: *"Mari kita bekukan aplikasi lama dan tulis ulang semuanya dari nol selama 6 bulan!"*

Dalam praktik industri, *Big-Bang Rewrite* hampir selalu gagal karena tiga alasan:
1. Aplikasi lama menyimpan ratusan aturan bisnis tepi (*edge cases*) tak terdokumentasi yang baru disadari ketika sistem baru sudah diluncurkan dan merugikan pelanggan;
2. Bisnis tidak mungkin berhenti menambah fitur selama 6–12 bulan, sehingga tim terpaksa mengejar sasaran yang terus bergerak (*moving target*);
3. Risiko peluncuran hari-H (*cutover*) sangat ekstrem.

Pendekatan rekayasa yang terbukti berhasil adalah pola **Strangler Fig** (dipopulerkan oleh Martin Fowler): pasang satu **Front Controller / Router Jembatan** di bagian depan, arahkan rute yang baru dimodernisasi (misalnya `/api/v2/*` atau `/masuk`) ke kode PHP 8.5 modern yang bersih, sementara rute sisanya tetap diteruskan ke aplikasi warisan sampai satu per satu seluruh modul lama selesai digantikan!

> **🚫 Kerentanan & Kesalahan Umum:** Menghentikan pengembangan fitur selama 6 bulan untuk menulis ulang (*big-bang rewrite*) seluruh aplikasi PHP warisan dari nol hampir selalu berakhir gagal atau meleset jauh dari jadwal; gunakan pola *Strangler Fig* untuk mengganti modul demi modul secara bertahap.

## 1. Lima Tahap Peta Jalan Modernisasi Aplikasi PHP Warisan

Ikuti urutan langkah aman berikut saat memodernisasi kode warisan menuju PHP 8.4/8.5:

| Tahap Modernisasi | Langkah Teknis Konkret | Risiko yang Dimigasi |
| :--- | :--- | :--- |
| **1. Pasang Jaring Pengaman (*Characterization Tests*)** | Tulis pengujian *Golden Master* / integrasi yang merekam keluaran kode lama apa adanya sebelum Anda mengubah 1 baris pun! | Mencegah perubahan perilaku bisnis tanpa sengaja saat kode dipecah. |
| **2. Perkenalkan Composer & PSR-4 (`src/`)** | Tambahkan `composer.json` dan muat `vendor/autoload.php` di titik masuk tunggal tanpa merusak `include` lama. | Memungkinkan kode baru ditulis sebagai class bersih ber-namespace dengan `declare(strict_types=1)`. |
| **3. Terapkan Front Controller (*Strangler Fig*)** | Tangkap semua permintaan di satu pintu; arahkan rute yang sudah dimigrasi ke modul modern, sisanya ke router lama. | Memungkinkan rilis ke produksi setiap minggu (iris demi iris) tanpa waktu henti. |
| **4. Bungkus Database & Sesi Warisan (*Adapter*)** | Ekstrak koneksi database lama ke dalam `PdoAdapter` ber-parameter dan samakan pembacaan sesi antara kode lama dan baru. | Menutup celah SQL Injection sambil menjaga pengguna tidak perlu login dua kali saat berpindah halaman lama/baru. |
| **5. Otomasi Pembaruan Sintaks dengan Rector** | Jalankan perkakas analisis AST **Rector (`vendor/bin/rector process`)** untuk menaikkan sintaks ke standar PHP 8.4/8.5 secara otomatis. | Menghemat ratusan jam kerja manual saat mengganti sintaks usang di ribuan berkas. |

## 2. Implementasi *Front Controller* Jembatan (*Strangler Fig Pattern*)

Berikut adalah arsitektur perute jembatan (*Strangler Fig*) yang dapat diuji secara terisolasi untuk memutuskan apakah suatu URI ditangani oleh kernel modern atau diteruskan ke skrip warisan:

```php
<?php
declare(strict_types=1);

final readonly class RouterStranglerFig
{
    /**
     * @param list<string> $awalanRuteModern
     * @param list<string> $jalurPersisModern
     */
    public function __construct(
        private array $awalanRuteModern = ['/api/v2/', '/pembayaran/'],
        private array $jalurPersisModern = ['/masuk', '/daftar', '/kesehatan'],
    ) {}

    public function tentukanTargetPenangan(string $requestUri): string
    {
        $jalurUri = parse_url($requestUri, PHP_URL_PATH);
        $jalur    = is_string($jalurUri) && $jalurUri !== '' ? $jalurUri : '/';

        // Normalisasi garis miring ganda (mis. //masuk -> /masuk) agar tidak melewati pencocokan rute!
        $jalurBersih = '/' . ltrim((string) preg_replace('#/+#', '/', $jalur), '/');

        if (in_array($jalurBersih, $this->jalurPersisModern, strict: true)) {
            return 'modern';
        }

        foreach ($this->awalanRuteModern as $awalan) {
            if (str_starts_with($jalurBersih, $awalan)) {
                return 'modern';
            }
        }

        return 'warisan';
    }
}
```

## 3. Menulis *Characterization Test* (*Golden Master*) Sebelum Menyentuh Kode Warisan

Ketika Anda menghadapi fungsi perhitungan komisi berumur 8 tahun sepanjang 300 baris `if/else` bersarang yang tidak seorang pun berani menyentuhnya, jangan langsung menulisnya ulang! Tulis terlebih dahulu **Characterization Test** yang menguji 20 kombinasi masukan dan mengunci hasil keluarannya saat ini sebagai patokan kebenaran (*Golden Master*). Setelah pengujian tersebut lulus 100%, barulah Anda merapikan (*refactor*) kode di dalamnya sambil memastikan pengujian tetap hijau:

```php
<?php
declare(strict_types=1);

// Fungsi baru yang bersih, terukur, dan diuji menghasilkan keluaran identik dengan fungsi warisan
function hitungKomisiMitraModern(int $nominalTransaksiRp, string $tingkatMitra, bool $adalah AkhirPekan): int
{
    if ($nominalTransaksiRp <= 0) {
        return 0;
    }
    $persenDasar = match (strtolower(trim($tingkatMitra))) {
        'emas'  => 10,
        'perak' => 7,
        default => 5,
    };
    if ($adalahAkhirPekan && $nominalTransaksiRp >= 500_000) {
        $persenDasar += 2;
    }
    return intdiv($nominalTransaksiRp * $persenDasar, 100);
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Lupa menormalkan garis miring ganda (`//api/v2/produk`) pada Router Jembatan:** Jika pemeriksaan Anda hanya menulis `str_starts_with($_SERVER['REQUEST_URI'], '/api/v2/')` tanpa menormalkan `//` menjadi `/`, permintaan ke `//api/v2/produk` dapat meleset ke router warisan atau dieksploitasi untuk melewati middleware baru!
2. **Menambahkan `declare(strict_types=1)` secara massal dengan *Find & Replace* ke ribuan berkas warisan tanpa pengujian dan PHPStan:** Di kode warisan yang sering mengirim `"123"` (string dari database/GET) ke parameter `int`, mengaktifkan `strict_types=1` secara buta tanpa memperbaiki pemanggilnya akan langsung memicu `TypeError` di produksi. Gunakan **Rector** + **PHPStan** untuk menambahkan tipe dan konversi secara bertahap per modul.
3. **Membuat database baru yang terpisah untuk kode modern sejak hari pertama tanpa mekanisme sinkronisasi:** Biarkan modul modern dan modul warisan berbagi skema database yang sama pada tahap awal transisi (melalui lapisan Repository yang bersih), dan baru pisahkan skema setelah kode warisan pada domain tersebut benar-benar dipensiunkan.

## Latihan Praktik Mandiri

1. Buat berkas `RouterStranglerFig.php` yang memuat class `RouterStranglerFig` dan fungsi `hitungKomisiMitraModern()`.
2. Tulis pengujian PHPUnit untuk memverifikasi bahwa:
   - `tentukanTargetPenangan('/api/v2/kursus?hal=1')`, `'/masuk'`, dan `'//masuk'` semuanya diarahkan ke `'modern'`;
   - `tentukanTargetPenangan('/laporan_lama.php')` diarahkan ke `'warisan'`;
   - `hitungKomisiMitraModern()` menghitung komisi untuk tingkat `'emas'`, `'perak'`, dan bonus akhir pekan secara akurat.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Menghentikan pengembangan fitur selama 6 bulan untuk menulis ulang (*big-bang rewrite*) seluruh aplikasi PHP warisan dari nol hampir selalu berakhir gagal atau meleset jauh dari jadwal; gunakan pola *Strangler Fig* untuk mengganti modul demi modul secara bertahap.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena penulisan ulang total (*big-bang*) jarang selesai tepat waktu dan menghentikan pengiriman fitur serta nilai bisnis, sedangkan pola Strangler Fig mengganti modul demi modul sambil sistem lama tetap berjalan
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Menghentikan pengembangan fitur selama 6 bulan untuk menulis ulang (*big-bang rewrite*) seluruh aplikasi PHP warisan dari nol hampir selalu berakhir gagal atau meleset jauh dari jadwal; gunakan pola *Strangler Fig* untuk mengganti modul demi modul secara bertahap.

### Soal 2
Apa tujuan dari menulis **Characterization Test (*Golden Master Test*)** sebelum Anda mulai melakukan *refactoring* pada fungsi PHP warisan yang rumit dan tidak memiliki dokumentasi?
- A. Untuk menghapus seluruh tabel database lama
- B. Untuk merekam dan mengunci perilaku keluaran aktual dari kode warisan saat ini terhadap berbagai kombinasi masukan sebagai jaring pengaman, sehingga apabila proses *refactoring* tidak sengaja mengubah hasil perhitungan tepi (*edge case*), pengujian langsung mendeteksinya
- C. Untuk mengubah kode PHP menjadi JavaScript secara otomatis
- D. Untuk mematikan pelaporan galat di server

**Jawaban Benar:** B
**Penjelasan:** *Characterization Test* mendokumentasikan perilaku sistem yang sedang berjalan saat ini secara otomatis, memastikan bahwa kode hasil modernisasi tetap 100% kompatibel dengan aturan bisnis yang sudah berjalan.

### Soal 3
Perkakas ekosistem PHP manakah yang bekerja dengan cara memproses *Abstract Syntax Tree* (AST) kode sumber Anda untuk mengotomatiskan pembaruan sintaks dan tipe dari PHP versi lama menuju standar PHP 8.4 / 8.5?
- A. `phpinfo()`
- B. **Rector** (`rector/rector`)
- C. `mysqldump`
- D. `ZipArchive`

**Jawaban Benar:** B
**Penjelasan:** Rector adalah perkakas rekonstruksi dan pembaruan kode otomatis berbasis AST untuk PHP yang dapat menerapkan ratusan aturan modernisasi sintaks (seperti `readonly` properties, `match` expression, dan deklarasi tipe) secara konsisten dan aman.

## Sumber

- [Migrating from PHP 8.3.x to PHP 8.4.x — PHP Manual](https://www.php.net/manual/en/migration84.php)
- [Migrating from PHP 8.4.x to PHP 8.5.x — PHP Manual](https://www.php.net/manual/en/migration85.php)
- [Rector Documentation](https://getrector.com/documentation)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
