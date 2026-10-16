# Audit Kualitas HTML, Inspeksi Accessibility Tree, dan Daftar Periksa Produksi

- **Tingkat:** Lanjut
- **Ringkasan:** Menguji dan memvalidasi dokumen HTML sebelum naik ke produksi melalui pemeriksaan sintaks W3C/WHATWG, inspeksi *Accessibility Tree* di Browser DevTools, pengauditan struktur *heading* dan *landmark*, serta menghindari anti-pola HTML.

## Mengapa Peramban yang "Pemaaf" Justru Bisa Menyembunyikan Bug?

Spesifikasi parser HTML5 dirancang agar **tidak pernah gagal menampilkan halaman** meskipun pengembang melakukan kesalahan sintaks (misalnya lupa menutup tag `<div>`, menaruh `<div>` di dalam `<p>`, atau salah mengeja nama atribut). Peramban akan berusaha menebak dan "memperbaiki" pohon DOM secara diam-diam di latar belakang.

Namun, perbaikan diam-diam oleh parser HTML sering menimbulkan bug yang membingungkan!

### Contoh Nyata: Apa yang Terjadi Jika Anda Menaruh `<div>` di Dalam `<p>`?
Menurut spesifikasi HTML, elemen `<p>` hanya boleh berisi *phrasing content* (teks dan elemen inline seperti `<span>`, `<a>`, `<strong>`, `<code>`). **Elemen `<p>` tidak pernah boleh membungkus elemen blok seperti `<div>`, `<section>`, atau `<table>`!**

Perhatikan apa yang dilakukan parser HTML jika Anda menulis kode yang salah ini:

```html
<!-- KODE YANG DITULIS PENGEMBANG (SALAH): -->
<p class="kotak-berbingkai">
  Kalimat pembuka:
  <div class="isi-kotak">Rincian di dalam kotak</div>
</p>

<!-- APA YANG SEBENARNYA DIHASILKAN DI POHON DOM OLEH BROWSER: -->
<p class="kotak-berbingkai">
  Kalimat pembuka:
</p> <!-- Browser menutup paksa <p> tepat sebelum <div>! -->
<div class="isi-kotak">Rincian di dalam kotak</div>
<p></p> <!-- Tag </p> terakhir diabaikan atau diubah menjadi paragraf kosong! -->
```

Akibatnya, `.isi-kotak` terlempar keluar dari `<p class="kotak-berbingkai">` dan tata letak CSS Anda hancur!

## 1. Aturan Keturunan (*Content Model*) yang Paling Sering Dilanggar

Hafalkan 5 larangan bersarang (*nesting rules*) paling krusial di HTML5 ini:

| Larangan Bersarang | Mengapa Dilarang & Apa Solusinya? |
|---|---|
| **`<a>` di dalam `<a>`** atau **`<button>` di dalam `<a>`** (dan sebaliknya) | **Interactive Content tidak boleh bersarang di dalam Interactive Content!** Pengguna papan ketik dan pembaca layar tidak akan tahu aksi mana yang dipicu saat tombol `Enter` ditekan. |
| **Elemen blok (`<div>`, `<ul>`, `<table>`, `<h2>`) di dalam `<p>`** | Tag pembuka elemen blok akan langsung menutup tag `<p>` secara paksa. Gunakan `<div>` jika ingin membungkus beberapa blok. |
| **Elemen selain `<li>` (atau `<script>`/`<template>`) sebagai anak langsung `<ul>` / `<ol>`** | Jangan menaruh `<div>` atau `<p>` langsung sebagai anak `<ul>`; masukkan semuanya ke dalam `<li>` terlebih dahulu! |
| **`<header>` atau `<footer>` di dalam `<header>` atau `<footer>`** | Tidak diizinkan oleh spesifikasi WHATWG. |
| **Banyak elemen `<main>` yang aktif (tidak `hidden`) dalam satu halaman** | Hanya boleh ada satu `<main>` yang terlihat per dokumen. |

### Bagaimana Jika Seluruh Kartu Produk Harus Bisa Diklik, tetapi di Dalamnya Ada Tombol "Simpan Bookmark"?
Karena Anda **tidak boleh** membungkus seluruh `<article>` (yang berisi `<button>`) di dalam satu tag `<a href="...">` raksasa, gunakan teknik **Stretched Link (Tautan yang Direntangkan lewat CSS `::after`)**:

```html
<article class="kartu-produk">
  <h3>
    <!-- Tautan hanya membungkus teks judul, tetapi area kliknya direntangkan oleh CSS ::after -->
    <a href="/kelas/html/" class="tautan-utama">Kelas HTML Modern</a>
  </h3>
  <p>Pelajari fondasi web dari nol hingga siap produksi.</p>
  <button type="button" class="tombol-bookmark">Simpan Penanda</button>
</article>
```

```css
.kartu-produk {
  position: relative;
}
/* Merentangkan area klik tautan judul ke seluruh permukaan .kartu-produk */
.tautan-utama::after {
  content: "";
  position: absolute;
  inset: 0;
}
/* Mengangkat tombol bookmark agar berada di atas lapisan ::after */
.tombol-bookmark {
  position: relative;
  z-index: 1;
}
```
Hasilnya: struktur HTML 100% valid (tidak ada `<button>` di dalam `<a>`), urutan fokus tombol `Tab` sangat bersih, namun pengguna tetikus tetap bisa mengeklik bagian mana saja dari kartu tersebut!

## 2. Menginspeksi *Accessibility Tree* di Browser DevTools

Selain pohon DOM biasa, peramban membangun **Accessibility Tree (Pohon Aksesibilitas)** yang diserahkan kepada pembaca layar sistem operasi. Anda dapat memeriksanya secara langsung tanpa menginstal aplikasi tambahan:

1. Buka **Developer Tools (`F12`)** → tab **Elements / Inspector**.
2. Di panel sebelah kanan (tempat tab *Styles* dan *Computed* berada), buka sub-tab **Accessibility** (atau klik ikon orang kecil *"Switch to Accessibility Tree view"* di pojok kanan atas pohon DOM Chrome/Firefox).
3. Klik sebuah elemen (misalnya `<button>`, `<input>`, atau `<nav>`), lalu periksa tiga informasi kunci ini:
   - **Role (Peran):** Apakah perannya `button`, `link`, `navigation`, `dialog`, atau hanya `generic`?
   - **Computed Name (Nama Terhitung):** Apakah elemen tersebut memiliki nama yang jelas (misalnya `"Unduh Materi"`), atau justru kosong `""`?
   - **Focusable:** Apakah bernilai `true`?

## 3. Daftar Periksa Audit HTML Siap Produksi

Gunakan daftar periksa 10 poin ini sebelum menandai halaman HTML Anda selesai:

1. **Dokumen & Bahasa:** `<!DOCTYPE html>` di baris pertama, serta `<html lang="id">` telah terpasang.
2. **Kepala Dokumen:** `<meta charset="utf-8">` berada di awal `<head>`, diikuti `<meta name="viewport" content="width=device-width, initial-scale=1.0">` (tanpa `user-scalable=no`), `<title>` unik, `<meta name="description">`, dan `<link rel="canonical">`.
3. **Landmark Utama:** Memiliki `<header>`, `<nav>`, tepat satu `<main>`, dan `<footer>` beserta *skip link* menuju `#main`.
4. **Hierarki Heading:** Memiliki satu `<h1>` utama dan subjudul `<h2>`–`<h6>` yang berurutan tanpa melompati tingkat hanya demi ukuran huruf.
5. **Kejelasan Semantik Interaksi:** Semua navigasi URL menggunakan `<a href="...">`, dan semua aksi dalam halaman menggunakan `<button type="...">` (tidak ada `<div onclick>` atau `<a href="#">`).
6. **Gambar & Media:** Setiap `<img>` memiliki atribut `alt` (deskriptif untuk gambar informatif, `alt=""` untuk gambar dekoratif), memiliki `width` dan `height`, menggunakan `fetchpriority="high"` pada gambar LCP teratas, dan `loading="lazy"` pada gambar di bawah layar.
7. **Tabel Data:** Menggunakan `<caption>`, `<thead>`, `<tbody>`, dan `<th scope="col|row">`.
8. **Formulir:** Setiap kontrol memiliki `<label for="...">` yang terhubung dan atribut `name` serta `autocomplete` yang sesuai.
9. **Komponen Interaktif:** Modal menggunakan `<dialog>` (`showModal()`), akordeon menggunakan `<details>`/`<summary>`, dan panel sembul menggunakan `popover`.
10. **Pemuatan Skrip:** `<script>` menggunakan `type="module"` atau atribut `defer`.

## Latihan Praktik: Mengaudit dan Memperbaiki Halaman dengan 5 Kesalahan Struktural

Perhatikan cuplikan markup bermasalah berikut:
```html
<!-- KODE BERMASALAH UNTUK DIAUDIT: -->
<a href="/kelas/css" class="kartu">
  <p>
    <h4>Kelas CSS Modern</h4>
    <div class="ringkasan">Belajar Grid dan Container Queries.</div>
  </p>
  <button onclick="daftar()">Daftar Sekarang</button>
</a>
```
Buatlah berkas `hasil-audit.html` yang memperbaiki seluruh kesalahan model konten pada cuplikan di atas (mengeluarkan `<button>` dari dalam `<a>` menggunakan pola *stretched link*, memperbaiki hierarki heading, dan mengganti `<p>` yang membungkus elemen blok).

## Kuis Pemahaman

### Soal 1
Apa yang dilakukan oleh parser HTML5 di peramban ketika menemukan kode `<p>Pembuka <div>Isi kotak</div> Penutup</p>`?
- A. Mengubah elemen `<div>` menjadi `<span>` secara otomatis.
- B. Menutup paksa elemen `<p>` tepat sebelum tag pembuka `<div>`, sehingga elemen `<div>` berada di luar `<p>` pertama, dan tag penutup `</p>` di akhir berubah menjadi elemen `<p></p>` kosong yang terpisah.
- C. Mengabaikan teks `"Isi kotak"` sepenuhnya.
- D. Menampilkan pesan galat merah di layar utama.

**Jawaban Benar:** B
**Penjelasan:** Spesifikasi penguraian HTML menetapkan bahwa elemen `<p>` secara otomatis ditutup begitu parser menjumpai tag pembuka elemen blok seperti `<div>`, `<section>`, `<ul>`, atau `<table>`.

### Soal 2
Mengapa spesifikasi HTML melarang penempatan elemen `<button>` di dalam elemen `<a href="...">` (atau sebaliknya)?
- A. Karena warna tombol akan berubah menjadi biru mengikuti warna tautan.
- B. Karena keduanya merupakan *Interactive Content*; menyarangkan kontrol interaktif di dalam kontrol interaktif lain menciptakan ambiguitas fokus papan ketik (`Tab`), membingungkan pembaca layar, dan membuat klik/ketukan pengguna memicu dua aksi sekaligus.
- C. Karena `<button>` hanya boleh berada di dalam `<form>`.
- D. Karena `<a>` hanya boleh berisi maksimal 3 kata.

**Jawaban Benar:** B
**Penjelasan:** Aturan model konten untuk `<a>` dan `<button>` secara tegas menyatakan: *transparent/phrasing content, but there must be no interactive content descendant*. Gunakan teknik CSS *stretched link* (`::after`) jika ingin membuat seluruh kartu dapat diklik sambil tetap memiliki tombol terpisah di dalamnya.

### Soal 3
Saat Anda memeriksa sebuah tombol ikon `<button><svg>...</svg></button>` di panel **Accessibility Tree** pada Browser DevTools dan melihat bahwa **Computed Name** bernilai `""` (kosong), apa artinya dan bagaimana cara memperbaikinya?
- A. Artinya tombol sudah sempurna; tidak perlu diperbaiki.
- B. Artinya pembaca layar hanya akan mengumumkan kata `"button"` tanpa memberi tahu pengguna apa fungsi tombol tersebut; perbaiki dengan menambahkan teks tersembunyi visual atau atribut `aria-label="Deskripsi aksi tombol"` pada `<button>` serta `aria-hidden="true"` pada `<svg>`.
- C. Artinya tombol belum memiliki kelas CSS.
- D. Artinya tombol tersebut tidak memiliki atribut `id`.

**Jawaban Benar:** B
**Penjelasan:** Setiap elemen interaktif wajib memiliki *Accessible Name* (Computed Name yang tidak kosong di Accessibility Tree) agar pengguna pembaca layar maupun pengguna perintah suara (*voice control*) dapat mengenali dan mengoperasikan tombol tersebut.

## Sumber
- [HTML Standard (Content models & Parsing HTML documents) — WHATWG](https://html.spec.whatwg.org/multipage/dom.html)
- [HTML: A good basis for accessibility — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML)
- [Accessibility for web developers — web.dev](https://web.dev/articles/a11y-tips-for-web-dev)
