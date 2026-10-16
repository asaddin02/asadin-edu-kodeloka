# Arsitektur State Antarmuka Tanpa JavaScript Menggunakan Selektor Relasional `:has()`

- **Tingkat:** Lanjut
- **Ringkasan:** Membangun filter kategori kartu, pengunci guliran `body:has(dialog[open]) { overflow: hidden; }`, indikator formulir valid, dan perubahan tema dinamis murni menggunakan `:has()`.

## Mengapa `:has()` Mengubah Cara Kita Mengelola State?

Pelajaran 01 memperkenalkan `:has()` sebagai "selektor induk". Kekuatan sebenarnya adalah ia memungkinkan **state yang sudah ada di HTML** (kotak centang yang dicentang, dialog yang terbuka, input yang tidak valid) memengaruhi tampilan **leluhur atau saudara-saudaranya**. Dahulu pola semacam ini memerlukan JavaScript untuk menambah dan menghapus kelas pada pembungkus. `:has()` berstatus **Baseline Widely Available** (lintas peramban sejak Desember 2023).

Aturan dasar: `A:has(B)` memilih elemen `A` **jika** `B` cocok untuk setidaknya satu elemen relatif terhadap `A`. `B` boleh berupa keturunan (`:has(img)`), anak langsung (`:has(> img)`), atau saudara berikutnya (`:has(+ input)`, `:has(~ p)`). Spesifisitas `:has()` sama dengan argumen yang paling spesifik di dalamnya.

## 1. Filter Kategori Tanpa JavaScript

Gunakan tombol radio sebagai "saklar" dan biarkan pembungkus bereaksi terhadap yang terpilih:

```html
<section class="katalog">
  <fieldset class="filter">
    <legend>Kategori</legend>
    <label><input type="radio" name="kat" value="semua" checked> Semua</label>
    <label><input type="radio" name="kat" value="frontend"> Frontend</label>
    <label><input type="radio" name="kat" value="backend"> Backend</label>
  </fieldset>

  <ul class="daftar">
    <li class="kartu" data-kat="frontend">HTML dan CSS</li>
    <li class="kartu" data-kat="frontend">JavaScript</li>
    <li class="kartu" data-kat="backend">PHP</li>
  </ul>
</section>
```

```css
/* Jika "Frontend" dipilih, sembunyikan kartu yang bukan frontend */
.katalog:has(input[value="frontend"]:checked) .kartu:not([data-kat="frontend"]),
.katalog:has(input[value="backend"]:checked)  .kartu:not([data-kat="backend"]) {
  display: none;
}
```

Catatan aksesibilitas: tetap gunakan elemen formulir asli (radio) agar dapat dioperasikan dengan papan ketik dan dibaca pembaca layar. Jangan menyembunyikan radio dengan `display: none`; bila ingin tampilan tombol kustom, sembunyikan secara visual saja. Karena `display: none` juga menyembunyikan kartu dari pembaca layar, ini sesuai untuk filter, tetapi pertimbangkan pesan status ("3 hasil") bagi pengguna pembaca layar.

## 2. Mengunci Guliran Halaman Saat Dialog Terbuka

Saat `<dialog>` modal terbuka, halaman di belakangnya masih bisa digulir. Kunci dengan satu aturan:

```css
body:has(dialog[open]) {
  overflow: hidden;
  scrollbar-gutter: stable;   /* cegah halaman bergeser saat scrollbar hilang */
}
```

Aturan ini otomatis aktif ketika ada `<dialog open>` di mana pun di dalam `body`, dan dilepas begitu dialog ditutup, tanpa JavaScript tambahan untuk menambah atau menghapus kelas.

## 3. Umpan Balik Formulir

Pseudo-class `:user-invalid` dan `:user-valid` hanya cocok **setelah pengguna berinteraksi** dengan kolom tersebut (berbeda dengan `:invalid`, yang cocok sejak halaman dimuat sehingga formulir kosong langsung tampak penuh kesalahan):

```css
.bidang:has(input:user-invalid) {
  --warna-bingkai: oklch(55% 0.22 25);
}
.bidang:has(input:user-invalid) .pesan-error {
  display: block;
}
.bidang:has(input:user-valid) .ikon-centang {
  display: inline;
}

/* Tanda bintang pada label kolom wajib, tanpa kelas tambahan */
label:has(+ input:required)::after {
  content: " *";
  color: oklch(55% 0.22 25);
}
```

Perhatikan bahwa pseudo-element (`::after`) ditulis **di luar** `:has()` karena pseudo-element tidak boleh berada di dalam argumen `:has()`. `:user-valid` dan `:user-invalid` berstatus **Baseline Widely Available**.

> **⚠️ Aksesibilitas Formulir:** Warna saja tidak cukup untuk menandai kesalahan. Sertakan teks pesan, ikon, dan hubungkan lewat `aria-describedby`. Hindari menonaktifkan tombol kirim hanya karena formulir belum valid; biarkan pengguna mengirim dan tampilkan kesalahannya.

## 4. Tema dan Preferensi dari Saklar HTML

```html
<input type="checkbox" id="tema-gelap"> <label for="tema-gelap">Mode gelap</label>
```

```css
:root:has(#tema-gelap:checked) {
  color-scheme: dark;
}
```

Keterbatasan: CSS saja **tidak dapat menyimpan** pilihan itu antar-kunjungan. Bila perlu persisten, simpan di `localStorage` (JavaScript) dan atur ulang kotak centangnya saat memuat halaman.

## 5. Pola Berguna Lain

```css
/* Kartu yang memiliki gambar mendapat tata letak dua kolom */
.kartu:has(> img) { display: grid; grid-template-columns: 8rem 1fr; }

/* Kueri jumlah: daftar dengan 5 butir atau lebih dibuat dua kolom */
ul:has(> li:nth-child(5)) { columns: 2; }

/* Beri jarak bawah judul hanya jika diikuti subjudul */
h2:has(+ .subjudul) { margin-block-end: 0.25rem; }
```

## 6. Batasan dan Performa

- `:has()` tidak boleh **bersarang** di dalam `:has()` lain, dan pseudo-element tidak boleh berada di argumennya.
- `:has()` memaksa peramban memeriksa keturunan atau saudara, sehingga selektor yang sangat luas (mis. `:has(*)` atau `*:has(...)` pada seluruh dokumen) pada halaman besar dapat memperlambat penghitungan gaya. Persempit subjeknya dengan kelas atau elemen tertentu dan pakai kombinator anak (`>`) bila memungkinkan.
- Pada peramban lama yang belum mendukung, seluruh aturan yang memuat `:has()` diabaikan; sediakan gaya dasar yang tetap berfungsi.

## Kesalahan Umum dan Cara Menghindarinya

1. **Memakai `:invalid` untuk umpan balik.** Formulir kosong langsung tampak salah; gunakan `:user-invalid`.
2. **Menaruh `::after` di dalam `:has()`.** Tidak valid; tulis pseudo-element di luar.
3. **Menyembunyikan radio dengan `display: none`.** Pengguna papan ketik tidak bisa memfokuskannya.
4. **Menganggap `:has()` dapat menyimpan state.** State tetap berasal dari HTML dan hilang saat dimuat ulang.
5. **Selektor `:has()` yang terlalu luas.** Persempit subjek untuk menjaga performa.

## Latihan Praktik: Katalog yang Bisa Difilter, Dialog, dan Formulir

Buatlah berkas `has-state.html` dan `has.css`:
1. Buat katalog 6 kartu dengan filter radio (Semua, Frontend, Backend) memakai `:has()`, tanpa JavaScript.
2. Tambahkan `<dialog>` yang dibuka dengan tombol (`showModal()`), dan kunci guliran halaman dengan `body:has(dialog[open])`.
3. Buat formulir dengan pesan kesalahan yang hanya tampil setelah interaksi memakai `.bidang:has(input:user-invalid)`, plus tanda bintang pada label wajib.
4. Buat saklar "Mode gelap" dengan `:root:has(#tema-gelap:checked)`; catat apa yang terjadi ketika halaman dimuat ulang.

## Kuis Pemahaman

### Soal 1
Mengapa umpan balik formulir sebaiknya memakai `:user-invalid`, bukan `:invalid`?
- A. Karena `:invalid` sudah dihapus dari standar.
- B. Karena `:user-invalid` hanya cocok setelah pengguna berinteraksi dengan kolom, sehingga formulir yang masih kosong tidak langsung tampak penuh kesalahan.
- C. Karena `:user-invalid` bekerja tanpa atribut `required`.
- D. Karena `:invalid` hanya berlaku untuk `<textarea>`.

**Jawaban Benar:** B
**Penjelasan:** `:invalid` cocok sejak halaman dimuat jika kolom belum memenuhi batasan, misalnya kolom `required` yang masih kosong. `:user-invalid` baru cocok setelah pengguna berinteraksi, sehingga lebih ramah.

### Soal 2
Manakah yang valid dan memberi tanda bintang pada label yang diikuti input wajib?
- A. `label:has(::after + input:required) { content: " *"; }`
- B. `label:has(+ input:required)::after { content: " *"; }`
- C. `label::after:has(+ input:required) { content: " *"; }`
- D. `label:has(input:required::after) { content: " *"; }`

**Jawaban Benar:** B
**Penjelasan:** Pseudo-element harus berada di luar `:has()` dan ditulis di akhir selektor. `label:has(+ input:required)` memilih label yang langsung diikuti input wajib, lalu `::after` menambahkan tanda bintang.

### Soal 3
Apa fungsi `body:has(dialog[open]) { overflow: hidden; }`?
- A. Menutup semua dialog yang terbuka.
- B. Menyembunyikan dialog dari pembaca layar.
- C. Mengunci guliran halaman selama ada dialog yang terbuka, dan melepasnya otomatis saat semua dialog tertutup.
- D. Membuat dialog selalu berada di tengah layar.

**Jawaban Benar:** C
**Penjelasan:** Aturan ini hanya cocok ketika `body` memiliki keturunan `dialog[open]`. Begitu dialog ditutup, atribut `open` hilang dan aturan berhenti berlaku, sehingga guliran kembali normal.

## Sumber
- [`:has()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has)
- [`:user-invalid` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:user-invalid)
- [`:checked` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:checked)
- [Selectors Level 4 — W3C](https://www.w3.org/TR/selectors-4/)
