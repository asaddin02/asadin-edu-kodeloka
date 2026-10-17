# Internasionalisasi Skala Penuh dengan `MessageFormatter` (ICU MessageFormat) dan `Spoofchecker`

- **Tingkat:** Menengah
- **Ringkasan:** Menyusun pesan multibahasa yang mendukung aturan jamak (*pluralization*), gender, dan pemilihan format secara deklaratif menggunakan **`MessageFormatter` (ICU)** dari ekstensi `intl`, serta mendeteksi serangan pemalsuan domain/nama pengguna lintas aksara (*homograph attack*) menggunakan kelas **`Spoofchecker`**.

## Mengapa Menggabungkan Potongan String Terjemahan dengan Titik (`.`) Selalu Gagal di Banyak Bahasa?

Pengembang sering menulis kode pesan antarmuka seperti ini:
`$pesan = "Anda memiliki " . $jumlah . " " . ($jumlah === 1 ? "berkas" : "berkas-berkas") . " dari " . $nama;`

Begitu aplikasi harus diterjemahkan ke bahasa Inggris, Arab, Jepang, atau Rusia, pola penggabungan string tersebut langsung menemui jalan buntu:
1. **Urutan Kata Berbeda Antar-Bahasa:** Dalam bahasa Jepang atau Turki, nama pengirim (`$nama`) harus berada di awal kalimat sebelum jumlah berkas, tetapi urutan variabel di kode PHP Anda sudah terkunci mati!
2. **Aturan Jamak (*Plural Rules*) Lebih dari Sekadar `=== 1`:** Bahasa Inggris memiliki 2 bentuk (`1 file` vs `0/5 files`), bahasa Prancis mengelompokkan `0` dan `1` bersama-sama, sedangkan bahasa Arab dan Polandia memiliki hingga 4–6 bentuk kata benda berbeda untuk angka `0`, `1`, `2`, `3..10`, dan `11..99`!

Ekstensi **`intl`** bawaan PHP menyediakan kelas **`MessageFormatter`** berbasis standar industri **ICU MessageFormat** yang memisahkan seluruh logika jamak, urutan parameter bernama `{nama}`, serta pemformatan angka/tanggal langsung ke dalam satu string pola kamus terjemahan!

> **🚫 Kerentanan & Kesalahan Umum:** Menyusun kalimat terjemahan dengan menggabungkan potongan string `'Anda memiliki ' . $jumlah . ' pesan'` rusak ketika aplikasi diterjemahkan ke bahasa yang urutan kata atau bentuk kata bendanya berubah tergantung jumlah angka.

## 1. Perbandingan Sintaks Pola ICU `MessageFormatter` dan Keamanan `Spoofchecker`

Berikut adalah fitur utama yang disediakan oleh `MessageFormatter` dan `Spoofchecker` di dalam ekstensi `intl`:

| Fitur / Kelas `ext-intl` | Sintaks / Metode Utama | Masalah yang Diselesaikan |
| :--- | :--- | :--- |
| **Parameter Bernama** | `'Halo {nama}, selamat datang di {kota}!'` | Penerjemah bebas mengubah urutan `{kota}` dan `{nama}` di kamus bahasa tanpa mengubah satu baris kode PHP pun! |
| **Aturan Jamak (`plural`)** | `'{n, plural, =0{Kosong} =1{1 item} other{# item}}'` | Menangani bentuk jamak untuk bahasa apa pun sesuai standar Unicode CLDR (`#` otomatis diganti dengan angka `$n` terformat lokal). |
| **Pemilihan Konteks (`select`)** | `'{peran, select, admin{Administrator} penulis{Penulis} other{ Anggota}}'` | Memilih variasi kalimat berdasarkan kata kunci string (seperti peran atau kata ganti sapaan). |
| **Angka & Urutan (`number` / `selectordinal`)** | `'{harga, number, currency}'` / `'{peringkat, selectordinal, one{#st} two{#nd} few{#rd} other{#th}}'` | Memformat mata uang dan bilangan bertingkat (`1st`, `2nd`, `3rd`, `4th`) langsung di dalam pesan. |
| **`Spoofchecker`** | `$cek->areConfusable('paypal', 'pаypal')` / `$cek->isSuspicious($nama)` | Mendeteksi serangan **IDN Homograph / Pemalsuan Nama Pengguna** yang mencampur huruf Latin `'a'` (`U+0061`) dengan huruf Sirilik `'а'` (`U+0430`) yang terlihat kembar identik di layar! |

## 2. Menggunakan `MessageFormatter::formatMessage()` untuk Jamak dan Pilihan Konteks

Perhatikan bagaimana satu fungsi `formatPesanProgres()` di bawah ini dapat melayani bahasa Indonesia dan bahasa Inggris dengan tata bahasa yang 100% alami hanya dengan mengganti string pola kamusnya:

```php
<?php
declare(strict_types=1);

$polaIndonesia = '{jumlah, plural, =0{Tidak ada modul selesai} =1{1 modul selesai} other{# modul selesai}} untuk {nama}.';
echo MessageFormatter::formatMessage('id_ID', $polaIndonesia, [
    'jumlah' => 12,
    'nama'   => 'Rina',
]) . PHP_EOL; // "12 modul selesai untuk Rina."

$polaInggris = '{nama} has completed {jumlah, plural, =0{no modules} one{# module} other{# modules}}.';
echo MessageFormatter::formatMessage('en_US', $polaInggris, [
    'jumlah' => 1,
    'nama'   => 'Rina',
]) . PHP_EOL; // "Rina has completed 1 module."
```

## 3. Menangkal Serangan Pemalsuan Identitas Lintas Aksara (*Homograph Attack*) dengan `Spoofchecker`

Bayangkan seorang penyerang mendaftarkan nama pengguna **`"аdmin"`** di forum Anda, di mana huruf pertama **`"а"`** bukanlah huruf Latin `a` (`U+0061`), melainkan huruf kecil Sirilik `а` (`U+0430`)! Di mata pengguna lain, nama tersebut tampak **100% identik dengan `"admin"` asli**, tetapi di database dianggap berbeda karena kode byte UTF-8-nya berbeda!

Gunakan kelas **`Spoofchecker`** dari ekstensi `intl` pada validasi pendaftaran *username* dan domain untuk mendeteksi pencampuran aksara mencurigakan atau kemiripan visual (*confusables*):

```php
<?php
declare(strict_types=1);

function apakahUsernameMencurigakanAtauMiripAdmin(string $usernameInput): bool
{
    $pemeriksa = new Spoofchecker();
    // 1. Cek apakah string mencampur aksara berbeda yang membingungkan (mis. Latin + Sirilik)
    if ($pemeriksa->isSuspicious($usernameInput)) {
        return true;
    }
    // 2. Cek apakah secara visual tampak mirip dengan kata penting seperti "admin" atau "kodeloka"
    if ($pemeriksa->areConfusable($usernameInput, 'admin') || $pemeriksa->areConfusable($usernameInput, 'kodeloka')) {
        return true;
    }
    return false;
}

// Huruf pertama menggunakan Sirilik "\u{0430}" (tampak persis seperti 'admin'):
var_dump(apakahUsernameMencurigakanAtauMiripAdmin("\u{0430}dmin")); // bool(true) -> DITOLAK!
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menyisipkan variabel pengguna langsung ke dalam string `$pattern` pada `MessageFormatter::formatMessage($locale, $pattern, $args)`:** String `$pattern` (argumen kedua) wajib berasal dari **kamus terjemahan statis tepercaya**, sedangkan data dinamis dari pengguna wajib dimasukkan melalui array `$args` (argumen ketiga). Jika input pengguna содержащий karakter `{` atau `'` disisipkan ke `$pattern`, sintaks ICU akan rusak!
2. **Lupa menyediakan cabang wajib `other{...}` di dalam blok `plural` atau `select`:** Spesifikasi ICU MessageFormat **mewajibkan** keberadaan klausul cadangan `other{...}` pada setiap aturan `plural`, `select`, dan `selectordinal`. Tanpa `other{...}`, `MessageFormatter::formatMessage()` akan gagal dan mengembalikan `false`!
3. **Menulis tanda kutip tunggal `'` di dalam pola ICU tanpa menggandakannya (`''`):** Di dalam sintaks ICU MessageFormat, tanda kutip tunggal `'` adalah karakter escape untuk mengapit kurung kurawal literal (`'{'`). Jika teks bahasa Inggris Anda menggunakan apostrof seperti `Don't`, tulis sebagai `Don''t` atau gunakan karakter apostrof tipografi `’` (`U+2019`).

## Latihan Praktik Mandiri

1. Buat berkas `LokalisasiIcu.php` yang menyediakan fungsi `formatNotifikasiKuis(string $locale, string $nama, int $skor)` menggunakan `MessageFormatter::formatMessage()` serta fungsi `apakahUsernameMencurigakanAtauMiripAdmin()` menggunakan `Spoofchecker`.
2. Tulis pengujian PHPUnit untuk memverifikasi keluaran pesan pada jumlah `0`, `1`, dan `15` di bahasa `'id_ID'` dan `'en_US'`, serta memastikan `"\u{0430}dmin"` terdeteksi sebagai mencurigakan oleh `Spoofchecker`.

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
Dalam pola ICU `MessageFormatter` seperti `'{jumlah, plural, =0{Kosong} =1{Satu berkas} other{# berkas}}'`, apakah yang terjadi jika Anda menghapus cabang `other{# berkas}` dari pola tersebut?
- A. `MessageFormatter` otomatis menerjemahkannya ke bahasa Spanyol
- B. Pemformatan akan gagal (`formatMessage` mengembalikan `false`) karena spesifikasi ICU MessageFormat mewajibkan setiap blok `plural`, `select`, dan `selectordinal` selalu menyertakan cabang cadangan `other{...}`
- C. Angka selain 0 dan 1 akan dicetak sebagai angka negatif
- D. PHP akan menghapus ekstensi `intl`

**Jawaban Benar:** B
**Penjelasan:** Cabang `other` adalah kasus *fallback* wajib dalam tata bahasa ICU MessageFormat (terutama karena banyak bahasa seperti bahasa Indonesia hanya menggunakan kategori `other` untuk seluruh bilangan jamak umum).

### Soal 3
Ancaman keamanan apakah yang ditangani oleh kelas **`Spoofchecker`** dari ekstensi `intl` ketika memvalidasi pendaftaran nama pengguna (*username*) atau nama domain?
- A. Serangan SQL Injection pada tabel pengguna
- B. Serangan pemalsuan visual lintas aksara (*Unicode Homograph / Confusable Attack*), di mana penyerang mengganti huruf Latin biasa dengan karakter dari aksara lain yang bentuknya tampak kembar identik di layar (seperti huruf Sirilik `а` `U+0430` untuk meniru `"admin"`)
- C. Serangan kompresi Zip Bomb
- D. Serangan Cross-Site Request Forgery (CSRF)

**Jawaban Benar:** B
**Penjelasan:** `Spoofchecker` menggunakan data *Unicode Security Mechanisms (UTS #39)* untuk mendeteksi pencampuran sistem aksara yang mencurigakan (`isSuspicious`) maupun string yang tampak serupa secara visual (`areConfusable`).

## Sumber

- [The MessageFormatter class — PHP Manual](https://www.php.net/manual/en/class.messageformatter.php)
- [The Spoofchecker class — PHP Manual](https://www.php.net/manual/en/class.spoofchecker.php)
- [ICU MessageFormat — ICU User Guide](https://unicode-org.github.io/icu/userguide/format_parse/messages/)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
