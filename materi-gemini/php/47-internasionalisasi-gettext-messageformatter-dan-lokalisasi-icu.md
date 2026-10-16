# Internasionalisasi Skala Penuh dengan `MessageFormatter` (ICU MessageFormat) dan `Spoofchecker`

- **Tingkat:** Menengah
- **Ringkasan:** Menyusun pesan multibahasa yang mendukung aturan jamak (*pluralization*), gender, dan pemilihan format secara deklaratif menggunakan **`MessageFormatter` (ICU)** dari ekstensi `intl`, serta mendeteksi serangan pemalsuan domain/nama pengguna lintas aksara (*homograph attack*) menggunakan kelas **`Spoofchecker`**.

## Mengapa Topik Ini Penting di Produksi?

Dalam pengembangan backend modern dengan PHP 8.2 hingga PHP 8.5, penguasaan `MessageFormatter::formatMessage('id_ID', '{jumlah, plural, =0{Kosong} other{# barang}}', ['jumlah' => 5]);` sangat krusial untuk menjamin keamanan data, keakuratan perhitungan, ketahanan terhadap lonjakan trafik, dan kemudahan pemeliharaan jangka panjang.

> **🚫 Kerentanan & Kesalahan Umum:** Menyusun kalimat terjemahan dengan menggabungkan potongan string `'Anda memiliki ' . $jumlah . ' pesan'` rusak ketika aplikasi diterjemahkan ke bahasa yang urutan kata atau bentuk kata bendanya berubah tergantung jumlah angka.

## Konsep Inti dan Perbandingan Praktik Terbaik

| Aspek Rekayasa | Standar PHP Modern (PHP 8.2–8.5) | Praktik Warisan yang Berbahaya |
| :--- | :--- | :--- |
| **API / Pola Utama** | `MessageFormatter::formatMessage('id_ID', '{jumlah, plural, =0{Kosong} other{# barang}}', ['jumlah' => 5]);` | Mengandalkan fungsi usang tanpa validasi tipe/batas |
| **Keamanan & Memori** | `declare(strict_types=1)`, batas memori ketat, dan pemeriksaan eksplisit | Mengabaikan kode kembalian galat atau menumpuk seluruh data di RAM |
| **Kesiapan Produksi** | Teruji otomatis dengan PHPUnit dan analisis statis | Menguji secara manual di server produksi |

## Implementasi Kode PHP Modern (`strict_types=1`)

```php
<?php
declare(strict_types=1);

$polaPesan = '{jumlah, plural, =0{Tidak ada modul selesai} =1{1 modul selesai} other{# modul selesai}} untuk {nama}.';
echo MessageFormatter::formatMessage('id_ID', $polaPesan, [
    'jumlah' => 12,
    'nama'   => 'Rina',
]); // "12 modul selesai untuk Rina." 
```

> **💡 Tips Produksi:** Pastikan seluruh berkas PHP di proyek Anda selalu diawali dengan `declare(strict_types=1);` dan diverifikasi secara otomatis pada pipa CI menggunakan `composer audit`, analisis statis, serta pengujian PHPUnit.

## Latihan Praktik Mandiri

1. Buat sebuah class atau fungsi layanan terisolasi yang menerapkan pola `MessageFormatter::formatMessage('id_ID', '{jumlah, plural, =0{Kosong} other{# barang}}', ['jumlah' => 5]);` seperti pada contoh di atas.
2. Tulis minimal 2 pengujian otomatis di PHPUnit: satu untuk jalur sukses (*happy path*) dan satu untuk memastikan eksepsi dilempar ketika diberikan masukan tidak valid atau berbahaya.
3. Periksa penggunaan memori (`memory_get_peak_usage(true)`) dan pastikan tidak ada sumber daya yang bocor.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Menyusun kalimat terjemahan dengan menggabungkan potongan string `'Anda memiliki ' . $jumlah . ' pesan'` rusak ketika aplikasi diterjemahkan ke bahasa yang urutan kata atau bentuk kata bendanya berubah tergantung jumlah angka.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena urutan kata dan bentuk jamak berbeda antarbahasa, sehingga kalimat hasil penggabungan string menjadi salah atau tidak bisa diterjemahkan, sedangkan pola ICU MessageFormat memisahkan teks terjemahan dari logika jamak
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Menyusun kalimat terjemahan dengan menggabungkan potongan string `'Anda memiliki ' . $jumlah . ' pesan'` rusak ketika aplikasi diterjemahkan ke bahasa yang urutan kata atau bentuk kata bendanya berubah tergantung jumlah angka.

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `MessageFormatter::formatMessage('id_ID', '{jumlah, plural, =0{Kosong} other{# barang}}', ['jumlah' => 5]);` di PHP modern?
- A. Merupakan pola dan API standar di PHP modern untuk menangani operasi secara aman, presisi, dan terukur
- B. Hanya dapat dijalankan di dalam peramban web tanpa server PHP
- C. Membutuhkan ekstensi `mysql_*` warisan dari PHP 4
- D. Menghapus kebutuhan akan `declare(strict_types=1)`

**Jawaban Benar:** A
**Penjelasan:** Pola `MessageFormatter::formatMessage('id_ID', '{jumlah, plural, =0{Kosong} other{# barang}}', ['jumlah' => 5]);` memanfaatkan kapabilitas standar PHP 8 modern yang dirancang untuk keamanan dan performa tingkat produksi.

### Soal 3
Langkah manakah yang paling tepat saat mengintegrasikan materi "Internasionalisasi Skala Penuh dengan MessageFormatter (ICU MessageFormat) dan Spoofchecker" ke dalam arsitektur aplikasi?
- A. Menyembunyikan seluruh galat dengan operator `@` tanpa pemeriksaan lebih lanjut
- B. Menerapkan `declare(strict_types=1)`, memvalidasi prasyarat masukan, menangani kegagalan dengan Exception yang jelas, dan mengujinya dengan PHPUnit
- C. Menyimpan kredensial rahasia secara langsung di dalam kode sumber yang di-*commit* ke Git
- D. Mengaktifkan `display_errors = On` bagi seluruh pengunjung publik

**Jawaban Benar:** B
**Penjelasan:** Disiplin `strict_types=1`, validasi ketat, penanganan `Throwable` yang terukur, dan pengujian otomatis adalah fondasi utama rekayasa backend PHP modern.

## Sumber

- [The MessageFormatter class — PHP Manual](https://www.php.net/manual/en/class.messageformatter.php)
- [The Spoofchecker class — PHP Manual](https://www.php.net/manual/en/class.spoofchecker.php)
- [ICU MessageFormat — ICU User Guide](https://unicode-org.github.io/icu/userguide/format_parse/messages/)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
