# Data Transfer Objects (DTO), Hydrator Berbasis Atribut, dan Bahaya `unserialize()`

- **Tingkat:** Lanjut
- **Ringkasan:** Memetakan array masukan mentah dari HTTP/JSON ke dalam objek **DTO (`readonly class`)** yang tervalidasi penuh, serta memahami mengapa memanggil `unserialize()` pada data dari pengguna dapat memicu **PHP Object Injection / Remote Code Execution (RCE)**.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `final readonly class BuatPesananDto { ... }` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Jangan pernah memanggil `unserialize()` pada string yang berasal dari cookie, input form, atau jaringan tanpa pembatasan `['allowed_classes' => false]`, karena penyerang dapat merangkai *Gadget Chain* (`__wakeup` / `__destruct`) pada class yang ada di proyek Anda untuk mengeksekusi perintah sistem!

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `final readonly class BuatPesananDto { ... }` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

final readonly class PendaftaranPenggunaDto
{
    public function __construct(
        public string $email,
        public string $namaLengkap,
    ) {}

    public static function dariArray(array $input): self
    {
        $email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $nama  = trim((string) ($input['nama_lengkap'] ?? ''));
        if ($email === false || mb_strlen($nama) < 2) {
            throw new InvalidArgumentException('Data pendaftaran tidak valid.');
        }
        return new self(mb_strtolower($email), $nama);
    }
}
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `final readonly class BuatPesananDto { ... }` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Jangan pernah memanggil `unserialize()` pada string yang berasal dari cookie, input form, atau jaringan tanpa pembatasan `['allowed_classes' => false]`, karena penyerang dapat merangkai *Gadget Chain* (`__wakeup` / `__destruct`) pada class yang ada di proyek Anda untuk mengeksekusi perintah sistem!*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena membuka celah keamanan serius, merusak integritas data/finansial, atau menyebabkan kehabisan memori (*Out of Memory*) di server produksi
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Jangan pernah memanggil `unserialize()` pada string yang berasal dari cookie, input form, atau jaringan tanpa pembatasan `['allowed_classes' => false]`, karena penyerang dapat merangkai *Gadget Chain* (`__wakeup` / `__destruct`) pada class yang ada di proyek Anda untuk mengeksekusi perintah sistem!

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `final readonly class BuatPesananDto { ... }` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `final readonly class BuatPesananDto { ... }` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi "Data Transfer Objects (DTO), Hydrator Berbasis Atribut, dan Bahaya unserialize()" ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [`unserialize` — PHP Manual](https://www.php.net/manual/en/function.unserialize.php)
- [Deserialization Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
