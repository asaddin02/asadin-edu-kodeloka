# Menangani Unggah Berkas (*File Upload*) Secara Aman

- **Tingkat:** Menengah
- **Ringkasan:** Memproses unggahan berkas melalui `$_FILES` dengan memeriksa kode status `UPLOAD_ERR_*`, memverifikasi tipe MIME sejati dari isi biner berkas menggunakan ekstensi `finfo`, mengganti nama berkas secara kriptografis, serta menyimpan berkas di luar direktori publik.

## Mengapa Fitur Unggah Berkas Adalah Salah Satu Titik Paling Berbahaya di Web?

Mengizinkan pengguna mengunggah berkas ke server Anda ibarat membuka pintu paket di gedung kantor: jika petugas keamanan hanya membaca tulisan di luar kardus (*"Isinya Foto Kucing.jpg"*) tanpa memindai isi sebenarnya di dalam kardus, penyerang dapat menyelundupkan berkas skrip berbahaya **`shell.php`** lalu membukanya lewat URL `https://situs-anda.id/uploads/shell.php` untuk mengambil alih seluruh server Anda (**Remote Code Execution / RCE**)!

Untuk membangun fitur unggah berkas yang benar-benar aman, Anda wajib menerapkan **6 Lapis Pertahanan Unggah Berkas**.

## 1. Struktur Formulir HTML dan Pemeriksaan Kode Galat `$_FILES`

Di sisi HTML, formulir wajib menggunakan `method="post"` dan **`enctype="multipart/form-data"`**:

```html
<form action="/unggah-bukti" method="post" enctype="multipart/form-data">
  <label for="berkas-bukti">Unggah Bukti Pembayaran (PNG, WebP, atau PDF maks. 2 MB)</label>
  <input
    type="file"
    id="berkas-bukti"
    name="bukti"
    accept="image/png,image/webp,application/pdf"
    required
  >
  <button type="submit">Unggah Berkas</button>
</form>
```

Di sisi PHP, berkas yang diunggah masuk ke superglobal **`$_FILES['bukti']`**. Langkah pertama adalah memeriksa **`$_FILES['bukti']['error']`** menggunakan konstanta `UPLOAD_ERR_*`:

```php
<?php

declare(strict_types=1);

if (!isset($_FILES['bukti']) || !is_int($_FILES['bukti']['error'])) {
    throw new RuntimeException('Permintaan unggah berkas tidak valid.');
}

switch ($_FILES['bukti']['error']) {
    case UPLOAD_ERR_OK:
        break; // Berkas berhasil tiba di folder sementara (tmp_name)
    case UPLOAD_ERR_NO_FILE:
        throw new RuntimeException('Tidak ada berkas yang dipilih.');
    case UPLOAD_ERR_INI_SIZE:
    case UPLOAD_ERR_FORM_SIZE:
        throw new RuntimeException('Ukuran berkas melebihi batas maksimal yang diizinkan.');
    default:
        throw new RuntimeException('Terjadi kegagalan saat menerima berkas.');
}
```

## 2. Dua Hal yang TIDAK BOLEH PERNAH Dipercayai pada `$_FILES`!

Perhatikan isi array `$_FILES['bukti']`:
- `$_FILES['bukti']['tmp_name']`: Jalur berkas sementara di server (diisi oleh PHP — **Tepercaya**).
- `$_FILES['bukti']['size']`: Ukuran byte berkas aktual (diisi oleh PHP — **Tepercaya**).
- **`$_FILES['bukti']['type']` (TIDAK TEPERCAYA!):** Nilai ini diambil mentah-mentah dari header `Content-Type` yang dikirim oleh peramban/klien! Penyerang dapat dengan mudah mengirim berkas `virus.php` sambil memalsukan header `Content-Type: image/png`.
- **`$_FILES['bukti']['name']` (TIDAK TEPERCAYA!):** Nama asli berkas dari komputer pengguna. Penyerang dapat memberi nama berkas `../../public/index.php` (*Path Traversal*), `shell.php.jpg`, atau menyisipkan karakter berbahaya.

## 3. Memeriksa Tipe Berkas Sejati dengan `finfo` dan Menamai Ulang Berkas

Untuk mengetahui tipe berkas yang sebenarnya, kita tidak membaca nama berkas atau header HTTP-nya, melainkan memeriksa **tanda tangan byte awal (*magic bytes*) di dalam isi berkas sementara (`tmp_name`)** menggunakan ekstensi bawaan **`finfo`** (*Fileinfo*):

```php
<?php

declare(strict_types=1);

function simpanUnggahanAman(
    array $infoBerkas,
    string $direktoriTujuan,
    int $batasByteMaks = 2 * 1024 * 1024, // 2 MB
): string {
    // 1. Pastikan berkas benar-benar diunggah tanpa galat
    if (($infoBerkas['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Unggahan berkas gagal atau kosong.');
    }

    // 2. Periksa batas ukuran berkas secara eksplisit di aplikasi
    if ($infoBerkas['size'] <= 0 || $infoBerkas['size'] > $batasByteMaks) {
        throw new RuntimeException('Ukuran berkas harus antara 1 byte hingga 2 MB.');
    }

    // 3. Periksa tipe MIME sejati dari isi byte berkas menggunakan ekstensi finfo!
    //    (JANGAN PERNAH menggunakan $infoBerkas['type']!)
    $pemeriksaFinfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeSejati = $pemeriksaFinfo->file($infoBerkas['tmp_name']);

    // Daftar putih (allowlist) MIME yang diizinkan beserta ekstensi resminya:
    $daftarPutihMime = [
        'image/png'       => 'png',
        'image/webp'      => 'webp',
        'image/jpeg'      => 'jpg',
        'application/pdf' => 'pdf',
    ];

    if ($mimeSejati === false || !isset($daftarPutihMime[$mimeSejati])) {
        throw new RuntimeException("Tipe berkas tidak diizinkan ({$mimeSejati}).");
    }

    $ekstensiAman = $daftarPutihMime[$mimeSejati];

    // 4. Hasilkan nama berkas baru yang acak secara kriptografis!
    //    (JANGAN PERNAH memakai $infoBerkas['name'] asli sebagai nama berkas di disk!)
    $namaBerkasBaru = sprintf(
        '%s.%s',
        bin2hex(random_bytes(16)), // 32 karakter heksadesimal acak (mis. 9f8a7b...)
        $ekstensiAman,
    );

    $jalurTujuan = rtrim($direktoriTujuan, '/') . '/' . $namaBerkasBaru;

    // 5. Pindahkan berkas menggunakan move_uploaded_file()
    //    (Fungsi ini memastikan berkas memang berasal dari mekanisme unggahan HTTP POST PHP)
    if (!move_uploaded_file($infoBerkas['tmp_name'], $jalurTujuan)) {
        throw new RuntimeException('Gagal memindahkan berkas ke penyimpanan server.');
    }

    return $namaBerkasBaru;
}
```

## 4. Menyimpan Berkas di Luar *Web Root* (`public/`)

Di mana sebaiknya `$direktoriTujuan` berada?
- **Paling Aman:** Simpan berkas unggahan di dalam folder **`storage/uploads/`** yang berada **di luar folder `public/`** (*document root* server web)!
  Dengan menaruhnya di luar `public/`, tidak ada satu pun URL langsung yang dapat mengeksekusi berkas tersebut sebagai skrip PHP. Jika pengguna yang berhak ingin mengunduh atau melihat berkas tersebut, skrip PHP pengontrol (*controller*) akan memeriksa izin pengguna terlebih dahulu, lalu mengirimkan isi berkas dengan header `Content-Type` dan `Content-Disposition: attachment; filename="..."` (atau `inline`).
- **Jika Terpaksa Berada di Dalam `public/uploads/`:** Pastikan konfigurasi Nginx di server produksi **memblokir keras eksekusi PHP (`location ~* ^/uploads/.*\.php$ { deny all; }`)** di dalam folder unggahan tersebut!

## Latihan Praktik: Layanan Validasi dan Penyimpanan Avatar Profil

Buatlah berkas `UnggahAvatar.php`:
1. Buat fungsi `prosesUnggahAvatar(array $berkas): array` yang hanya mengizinkan berkas gambar `image/png`, `image/jpeg`, dan `image/webp` dengan ukuran maksimal `1 MB` (`1_048_576` byte).
2. Gunakan `new finfo(FILEINFO_MIME_TYPE)` untuk memvalidasi tipe berkas sebenarnya.
3. Kembalikan nama berkas baru hasil `bin2hex(random_bytes(16))` beserta ekstensi amannya dan ukuran berkasnya.

## Kuis Pemahaman

### Soal 1
Mengapa memeriksa tipe berkas yang diunggah menggunakan `$_FILES['berkas']['type'] === 'image/png'` sangat berbahaya dan tidak dapat diandalkan?
- A. Karena kunci `'type'` tidak tersedia pada PHP 8.
- B. Karena nilai `$_FILES['berkas']['type']` diambil langsung dari header HTTP `Content-Type` bagian multipart yang dikirim oleh klien tanpa diverifikasi oleh PHP, sehingga penyerang dapat dengan mudah mengunggah berkas `.php` sambil mengirim header `Content-Type: image/png`.
- C. Karena `image/png` hanya berlaku untuk berkas berukuran di bawah 10 KB.
- D. Karena `$_FILES['berkas']['type']` selalu bernilai kosong.

**Jawaban Benar:** B
**Penjelasan:** Header `Content-Type` pada permintaan unggahan sepenuhnya dikendalikan oleh pengirim permintaan. Untuk memeriksa tipe berkas secara akurat di server, gunakan `new finfo(FILEINFO_MIME_TYPE)` yang menginspeksi *magic bytes* dari berkas sementara `$_FILES['berkas']['tmp_name']`.

### Soal 2
Mengapa kita harus membuat nama berkas baru yang acak (misalnya dengan `bin2hex(random_bytes(16)) . '.' . $ekstensiAman`) alih-alih menyimpan berkas menggunakan nama asli dari `$_FILES['berkas']['name']`?
- A. Karena nama berkas asli selalu lebih panjang dari 255 karakter.
- B. Untuk mencegah serangan *Path Traversal* (seperti `../../index.php`), mencegah penimpaan berkas milik pengguna lain yang kebetulan bernama sama, serta mencegah penyelundupan ekstensi ganda atau karakter berbahaya pada sistem berkas server.
- C. Karena fungsi `move_uploaded_file()` menolak huruf kapital.
- D. Agar ukuran berkas menjadi lebih kecil di diska.

**Jawaban Benar:** B
**Penjelasan:** Nama berkas asli dari klien adalah masukan yang tidak tepercaya. Jika Anda masih perlu menampilkan nama berkas asli kepada pengguna di halaman antarmuka, simpan nama asli tersebut sebagai teks di kolom tabel basis data (dan cetak dengan `htmlspecialchars()`), sedangkan berkas fisiknya di diska wajib diberi nama acak yang aman.

### Soal 3
Mengapa kita wajib menggunakan fungsi `move_uploaded_file($tmpName, $tujuan)` dan bukan fungsi `rename()` atau `copy()` biasa saat memindahkan berkas dari `$_FILES['berkas']['tmp_name']`?
- A. Karena `copy()` otomatis menghapus berkas tujuan.
- B. Karena `move_uploaded_file()` melakukan pemeriksaan keamanan internal untuk memastikan bahwa berkas yang ditunjuk oleh `$tmpName` memang benar-benar berkas sah yang baru saja diunggah melalui mekanisme HTTP POST PHP, bukan berkas sistem lokal server (seperti `/etc/passwd`) yang dipalsukan jalurnya.
- C. Karena `rename()` hanya bekerja di sistem operasi Windows.
- D. Karena `move_uploaded_file()` otomatis mengompresi gambar menjadi WebP.

**Jawaban Benar:** B
**Penjelasan:** `move_uploaded_file()` memverifikasi bahwa berkas sumber benar-benar merupakan *uploaded file* dari permintaan HTTP saat ini sebelum memindahkannya, sehingga memberikan perlindungan tambahan terhadap manipulasi jalur berkas lokal.

## Sumber
- [Handling file uploads — PHP Manual](https://www.php.net/manual/en/features.file-upload.php)
- [Filesystem Security — PHP Manual](https://www.php.net/manual/en/security.filesystem.php)
- [`move_uploaded_file` — PHP Manual](https://www.php.net/manual/en/function.move-uploaded-file.php)
- [The finfo class — PHP Manual](https://www.php.net/manual/en/class.finfo.php)
- [File Upload Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
