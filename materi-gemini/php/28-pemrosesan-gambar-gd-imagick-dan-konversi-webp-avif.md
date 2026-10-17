# Pemrosesan Gambar di Server: Ekstensi `GD` & `Imagick`, Pembuatan Thumbnail, dan Konversi WebP/AVIF

- **Tingkat:** Menengah
- **Ringkasan:** Memvalidasi dimensi gambar, menghapus metadata lokasi EXIF demi privasi pengguna, mengubah ukuran gambar (*resize/crop*) secara proporsional dengan `imagescale()`, serta mengonversi unggahan JPEG/PNG menjadi format modern **WebP (`imagewebp`)** dan **AVIF (`imageavif`)**.

## Mengapa Gambar Unggahan Pengguna Tidak Boleh Langsung Disajikan Apa Adanya?

Ketika pengguna mengunggah foto dari kamera ponsel modern ke aplikasi Anda, ada tiga masalah besar jika berkas asli tersebut langsung disimpan dan disajikan ke pengunjung lain:
1. **Ancaman *Image Decompression Bomb* (OOM):** Berkas gambar PNG/JPEG berukuran hanya **200 KB** di disk dapat dimanipulasi memiliki dimensi piksel **20.000 × 20.000 piksel**. Begitu kode PHP Anda memanggil `imagecreatefrompng()` tanpa memeriksa dimensinya lebih dulu, GD akan mengalokasikan bitmap mentah di RAM sebesar $20.000 \times 20.000 \times 4\text{ byte} \approx \mathbf{1,6\text{ GB RAM}}$ dan langsung mematikan proses PHP!
2. **Kebocoran Privasi Metadata EXIF:** Foto dari ponsel menyimpan koordinat GPS rumah pengguna, jenis perangkat, dan waktu pengambilan di dalam header EXIF.
3. **Pemborosan Bandwidth:** Foto JPEG 4000px berukuran 5 MB akan memperlambat LCP halaman; mengubah ukurannya menjadi *thumbnail* proporsional dan menyimpannya ke format **WebP (`imagewebp`)** atau **AVIF (`imageavif`)** memangkas ukuran berkas hingga 70–85%!

> **🚫 Kerentanan & Kesalahan Umum:** Memuat gambar unggahan pengguna yang beresolusi 12.000 x 12.000 piksel (*decompression bomb / image bomb*) langsung ke `imagecreatefromjpeg()` tanpa memeriksa lebar dan tinggi piksel terlebih dahulu dengan `getimagesize()` akan menghabiskan ratusan megabyte RAM seketika.

## 1. Perbandingan Ekstensi `GD` vs `Imagick` dan Format WebP vs AVIF

Berikut adalah perbandingan perkakas dan fungsi pengolahan gambar di PHP 8.2–8.5:

| Aspek / Fungsi | Ekstensi `GD` (Bawaan Umum PHP) | Ekstensi `Imagick` (ImageMagick) |
| :--- | :--- | :--- |
| **Representasi Objek** | Objek **`GdImage`** (menggantikan `resource` lama sejak PHP 8.0). | Objek **`Imagick`**. |
| **Pemeriksaan Dimensi Awal** | **`getimagesize($jalur)`** (membaca header dimensi tanpa mendekode seluruh piksel ke RAM!). | `$img->pingImage($jalur)` (membaca metadata tanpa memuat piksel). |
| **Pembersihan EXIF & Profil** | Otomatis bersih saat digambar ulang ke kanvas `GdImage` baru! | Wajib memanggil **`$img->stripImage()`** secara eksplisit. |
| **Konversi ke WebP & AVIF** | **`imagewebp($gd, $tujuan, 82)`** dan **`imageavif($gd, $tujuan, 65)`** (PHP 8.1+). | `$img->setImageFormat('webp')` / `'avif'`. |

## 2. Alur Aman Pembuatan Thumbnail WebP & AVIF dengan `GD`

Selalu ikuti urutan pertahanan berlapis berikut sebelum memuat piksel gambar ke memori:
1. Periksa tipe MIME asli berkas menggunakan **`finfo`** (`FILEINFO_MIME_TYPE`).
2. Baca header dimensi gambar menggunakan **`getimagesize($jalurSumber)`** dan tolak apabila lebar (`$info[0]`) atau tinggi (`$info[1]`) melampaui batas wajar (misalnya `4096` atau `6000` piksel).
3. Muat ke `GdImage`, ubah ukuran secara proporsional dengan **`imagescale()`**, jaga transparansi alfa untuk PNG/WebP, lalu simpan dengan **`imagewebp()`** atau **`imageavif()`**:

```php
<?php
declare(strict_types=1);

function buatThumbnailWebp(string $jalurSumber, string $jalurTujuan, int $lebarMaks = 600): bool
{
    // 1. Baca dimensi dari header berkas TANPA memuat bitmap penuh ke RAM (Cegah Image Bomb!)
    $info = @getimagesize($jalurSumber);
    if ($info === false || $info[0] < 1 || $info[1] < 1 || $info[0] > 6000 || $info[1] > 6000) {
        throw new InvalidArgumentException('Dimensi gambar tidak valid atau melebihi batas aman 6000px.');
    }

    $mimeDiizinkan = ['image/jpeg', 'image/png', 'image/webp'];
    if (!in_array($info['mime'], $mimeDiizinkan, strict: true)) {
        throw new InvalidArgumentException('Format gambar tidak didukung.');
    }

    // 2. Dekode gambar ke objek GdImage (sekaligus membuang metadata GPS EXIF lama)
    $sumber = imagecreatefromstring((string) file_get_contents($jalurSumber));
    if ($sumber === false) {
        return false;
    }

    // 3. Kecilkan secara proporsional jika lebar asli melebihi $lebarMaks
    $kanvasHasil = $info[0] > $lebarMaks ? imagescale($sumber, $lebarMaks) : $sumber;
    if ($kanvasHasil === false) {
        return false;
    }

    // Pertahankan kanal transparansi (alpha channel) untuk PNG/WebP
    imagepalettetotruecolor($kanvasHasil);
    imagealphablending($kanvasHasil, true);
    imagesavealpha($kanvasHasil, true);

    return imagewebp($kanvasHasil, $jalurTujuan, quality: 82);
}
```

## 3. Memotong Gambar Persegi Tengah (*Center Square Crop*) untuk Avatar Profil

Untuk foto avatar pengguna yang harus berbentuk persegi `1:1` (misalnya `256 × 256` piksel) tanpa membuat wajah tampak gepeng, potong area persegi di bagian tengah gambar menggunakan **`imagecrop()`** lalu perkecil dengan **`imagescale()`**:

```php
<?php
declare(strict_types=1);

function buatAvatarPersegiWebp(GdImage $sumber, string $jalurTujuan, int $ukuranPx = 256): bool
{
    $lebar  = imagesx($sumber);
    $tinggi = imagesy($sumber);
    $sisi   = min($lebar, $tinggi);

    $potongan = imagecrop($sumber, [
        'x'      => intdiv($lebar - $sisi, 2),
        'y'      => intdiv($tinggi - $sisi, 2),
        'width'  => $sisi,
        'height' => $sisi,
    ]);
    if ($potongan === false) {
        return false;
    }

    $avatar = imagescale($potongan, $ukuranPx, $ukuranPx, IMG_BILINEAR_FIXED);
    return $avatar !== false && imagewebp($avatar, $jalurTujuan, quality: 85);
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Mempercayai ukuran byte berkas (`filesize($file) < 2_000_000`) sebagai jaminan bahwa gambar aman didekode ke RAM:** Ukuran berkas terkompresi di disk tidak menentukan ukuran bitmap di RAM! Gambar hitam polos berukuran 10.000 × 10.000 piksel hanya berukuran ~50 KB sebagai berkas PNG karena kompresi *deflate*, tetapi begitu dibuka dengan `imagecreatefrompng()` langsung memakan **400 MB RAM**! Selalu periksa `$info[0]` dan `$info[1]` dari `getimagesize()` terlebih dahulu.
2. **Menggunakan `getimagesize()` sebagai satu-satunya validator keamanan unggahan berkas:** Penyerang dapat menyisipkan kode PHP di dalam komentar metadata berkas GIF/JPEG yang valid (*polyglot file*). Selalu gabungkan validasi `finfo`, `getimagesize()`, pengubahan nama berkas menjadi UUID acak dengan ekstensi `.webp`, dan **gambar ulang (*re-encode*)** dengan `imagewebp()` agar seluruh metadata/komentar asing terbuang bersih!
3. **Lupa memanggil `imagepalettetotruecolor()` sebelum `imagewebp()` pada PNG berbasis palet (8-bit):** Fungsi `imagewebp()` di GD menolak gambar palet 8-bit dan akan gagal kecuali diubah ke *truecolor* terlebih dahulu dengan `imagepalettetotruecolor($gd)`.

## Latihan Praktik Mandiri

1. Buat class `LayananGambarAman` yang memvalidasi batas dimensi maksimum (`$maksPiksel = 4096`), menolak gambar yang melebihi batas tersebut dengan `InvalidArgumentException`, dan menghasilkan berkas `.webp` menggunakan `buatThumbnailWebp`.
2. Tulis pengujian PHPUnit yang membuat gambar uji di memori menggunakan `imagecreatetruecolor(800, 400)`, menyimpannya ke berkas PNG sementara, mengonversinya dengan `buatThumbnailWebp(..., lebarMaks: 400)`, dan memverifikasi bahwa berkas `.webp` hasil akhirnya memiliki lebar tepat `400` dan tinggi `200`.

## Kuis Pemahaman

### Soal 1
Mengapa kode PHP wajib memeriksa lebar dan tinggi piksel menggunakan `getimagesize()` **sebelum** memanggil `imagecreatefromjpeg()` / `imagecreatefrompng()` pada berkas gambar dari pengguna?
- A. Karena `imagecreatefrompng()` tidak dapat membaca berkas yang namanya huruf kecil
- B. Untuk menangkal serangan *Image Decompression Bomb*: berkas gambar yang ukuran byte-nya sangat kecil di disk dapat memiliki resolusi puluhan ribu piksel yang ketika didekode menjadi bitmap mentah di memori akan langsung menghabiskan ratusan megabyte hingga gigabyte RAM server
- C. Karena `getimagesize()` otomatis mengubah gambar menjadi hitam-putih
- D. Karena PHP 8.5 mewajibkan pemanggilan `getimagesize()` sebelum semua fungsi berkas

**Jawaban Benar:** B
**Penjelasan:** `getimagesize()` hanya membaca beberapa byte header berkas untuk mengetahui dimensi lebar dan tinggi piksel tanpa mendekode seluruh bitmap ke RAM, sehingga Anda dapat langsung menolak gambar berdimensi ekstrem sebelum mengalokasikan memori.

### Soal 2
Keuntungan keamanan dan privasi apakah yang didapat secara otomatis ketika server mendekode foto unggahan pengguna ke dalam objek `GdImage` lalu menyimpannya kembali sebagai berkas baru menggunakan `imagewebp($kanvas, $jalurTujuan, 82)`?
- A. Gambar otomatis diunggah ke akun media sosial pengguna
- B. Seluruh metadata EXIF tersembunyi (seperti koordinat lokasi GPS rumah pengguna) maupun potensi sisipan payload komentar berbahaya di dalam header berkas asli terbuang bersih karena `imagewebp()` menulis berkas baru murni dari matriks piksel gambar
- C. Resolusi gambar meningkat menjadi 8K secara otomatis
- D. Berkas `.webp` dapat dijalankan sebagai skrip PHP

**Jawaban Benar:** B
**Penjelasan:** Proses *re-encoding* melalui GD hanya menyalin nilai warna piksel visual ke berkas keluaran baru, sehingga secara efektif membersihkan metadata EXIF/GPS sekaligus menghancurkan struktur *polyglot payload* yang mungkin disisipkan di bagian komentar berkas asli.

### Soal 3
Fungsi GD manakah yang harus dipanggil terlebih dahulu pada objek `GdImage` yang berasal dari berkas PNG berbasis palet warna (8-bit indexed color) agar penyimpanan ke format WebP dengan `imagewebp()` tidak gagal?
- A. `imagedestroy($gd)`
- B. `imagepalettetotruecolor($gd)` (diikuti `imagesavealpha($gd, true)` bila memiliki transparansi)
- C. `imagefilter($gd, IMG_FILTER_NEGATE)`
- D. `imagerotate($gd, 180, 0)`

**Jawaban Benar:** B
**Penjelasan:** Encoder WebP pada ekstensi GD mengharapkan gambar berformat *truecolor*; memanggil `imagepalettetotruecolor($gd)` mengonversi gambar palet 8-bit menjadi *truecolor* sehingga `imagewebp()` dapat menyimpannya dengan mulus.

## Sumber

- [Image Processing and Generation (GD) — PHP Manual](https://www.php.net/manual/en/book.image.php)
- [`imagewebp` — PHP Manual](https://www.php.net/manual/en/function.imagewebp.php)
- [`imageavif` — PHP Manual](https://www.php.net/manual/en/function.imageavif.php)
- [`getimagesize` — PHP Manual](https://www.php.net/manual/en/function.getimagesize.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
