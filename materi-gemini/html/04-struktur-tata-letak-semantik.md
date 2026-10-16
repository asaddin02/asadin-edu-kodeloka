# Struktur Tata Letak Semantik dan Landmark Dokumen

- **Tingkat:** Dasar
- **Ringkasan:** Merancang arsitektur halaman web yang bermakna menggunakan elemen penanda wilayah (*landmark*) seperti `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<search>`, dan `<footer>` untuk menggantikan sindrom `<div>` berlebihan (*div soup*).

## Masalah pada "Div Soup"

Sebelum hadirnya elemen struktural HTML5, hampir seluruh bagian halaman web dibungkus menggunakan elemen generik `<div>`:

```html
<!-- Pola lama ("Div Soup") — tidak memberikan petunjuk makna bagi mesin maupun pembaca layar -->
<div class="atas">
  <div class="menu">...</div>
</div>
<div class="tengah">
  <div class="tulisan-utama">...</div>
  <div class="bilah-samping">...</div>
</div>
<div class="bawah">...</div>
```

Bagi manusia yang melihat layar setelah CSS dimuat, halaman tersebut tampak normal. Namun bagi pengguna pembaca layar (*screen reader*), perayap mesin pencari, atau ekstensi mode baca, kode di atas hanyalah tumpukan kotak tanpa identitas. Mereka tidak tahu kotak mana yang merupakan menu navigasi yang harus dilewati dan kotak mana yang berisi isi utama halaman.

## Peta Wilayah (*Landmarks*) Halaman HTML Modern

HTML menyediakan elemen struktural yang secara otomatis memetakan **ARIA Landmarks** (penanda wilayah aksesibilitas) tanpa perlu menulis atribut ARIA tambahan:

```
+-------------------------------------------------------------------+
| <header>  (Landmark: banner — jika berada langsung di <body>)     |
|   +-----------------------------------------------------------+   |
|   | <nav> (Landmark: navigation)   | <search> (Landmark: search)|  |
|   +-----------------------------------------------------------+   |
+-------------------------------------------------------------------+
| <main>    (Landmark: main — hanya satu yang aktif per halaman)    |
|   +---------------------------------------+ +-------------------+ |
|   | <article>                             | | <aside>           | |
|   |   <header>Judul & Tanggal</header>    | | (Landmark:        | |
|   |   <section>Bab 1...</section>         | |  complementary)   | |
|   |   <section>Bab 2...</section>         | |                   | |
|   +---------------------------------------+ +-------------------+ |
+-------------------------------------------------------------------+
| <footer>  (Landmark: contentinfo — jika berada langsung di <body>)|
+-------------------------------------------------------------------+
```

### 1. `<header>` dan `<footer>`
- **`<header>`:** Berisi konten pengantar atau alat bantu navigasi. Ketika diletakkan langsung sebagai anak dari `<body>`, ia berperan sebagai kepala situs global (*banner* yang memuat logo dan navigasi utama). Namun, `<header>` juga **boleh digunakan di dalam `<article>` atau `<section>`** untuk membungkus judul artikel, nama penulis, dan tanggal terbit.
- **`<footer>`:** Berisi informasi penutup dari bagian terdekatnya, seperti hak cipta, tautan kebijakan privasi, atau biodata penulis di akhir sebuah `<article>`.

### 2. `<nav>`: Hanya untuk Navigasi Utama
Gunakan `<nav>` untuk kelompok tautan navigasi penting seperti menu utama situs, daftar isi bab modul, atau jejak halaman (*breadcrumbs*).
- Anda tidak perlu membungkus setiap tautan di `<footer>` dengan `<nav>`; cukup tautan navigasi utama agar daftar *landmark* di pembaca layar tidak penuh sesak.
- Jika satu halaman memiliki lebih dari satu `<nav>` (misalnya menu utama di atas dan daftar isi bab di samping), berikan label yang jelas menggunakan `aria-label`:

```html
<nav aria-label="Menu utama">
  <ul>
    <li><a href="/">Beranda</a></li>
    <li><a href="/kelas" aria-current="page">Katalog Kelas</a></li>
  </ul>
</nav>

<nav aria-label="Daftar isi modul">
  <ol>
    <li><a href="#pengantar">Pengantar</a></li>
    <li><a href="#latihan">Latihan</a></li>
  </ol>
</nav>
```

### 3. `<main>`: Inti Unik dari Halaman
Elemen `<main>` membungkus konten utama yang unik untuk halaman tersebut (bukan bagian yang berulang di setiap halaman seperti bilah navigasi atau logo situs).
- Hanya boleh ada **satu elemen `<main>` yang tampak (tidak berstatus `hidden`)** dalam satu halaman.
- Keberadaan `<main>` memungkinkan pengguna papan ketik dan pembaca layar langsung melompat ke isi utama tanpa harus menekan tombol `Tab` puluhan kali melewati menu atas.

### 4. `<article>` vs `<section>` vs `<div>`: Cara Memilih dengan Tepat

Banyak pengembang tertukar saat memilih antara `<article>`, `<section>`, dan `<div>`. Gunakan aturan praktis tiga langkah ini:

1. **Apakah blok konten ini tetap masuk akal dan utuh seandainya dicabut dari halaman ini lalu disebarkan secara mandiri (misalnya lewat RSS feed atau dibagikan sebagai kartu berita tersendiri)?**
   - Jika **Ya**, gunakan **`<article>`**. Contoh: satu tulisan blog, satu kartu produk di katalog, satu komentar pengguna, atau satu widget cuaca interaktif. `<article>` bahkan boleh bersarang di dalam `<article>` (misalnya daftar komentar pembaca di dalam sebuah artikel utama).
2. **Apakah blok konten ini merupakan pengelompokan tematik (seperti satu bab dalam dokumen) yang memiliki judul (`<h2>`–`<h6>`) sendiri?**
   - Jika **Ya**, gunakan **`<section>`**. Contoh: bagian "Fitur Unggulan", bagian "Ulasan Pelanggan", atau bab dalam satu artikel panjang.
3. **Apakah Anda hanya membutuhkan pembungkus semata-mata untuk mengatur tata letak CSS (seperti membuat *grid* atau *flexbox*) tanpa arti semantik khusus?**
   - Jika **Ya**, gunakan **`<div>`** (untuk blok) atau **`<span>`** (untuk teks sebaris). `<div>` bukanlah sesuatu yang terlarang; ia tetap tepat digunakan sebagai wadah murni untuk penataan gaya visual!

### 5. `<aside>` dan `<search>`
- **`<aside>`:** Mewakili konten yang berkaitan secara tidak langsung dengan konten utama di sekitarnya, seperti kotak info tambahan (*callout*), bilah samping daftar artikel populer, atau iklan.
- **`<search>`:** Elemen semantik baru (status **Baseline Widely Available** sejak akhir 2023) yang dirancang khusus untuk membungkus formulir atau fitur pencarian maupun penyaringan (*filtering*) data di halaman, menggantikan kebutuhan menulis `<div role="search">`.

## Contoh Kode Lengkap: Struktur Halaman Artikel Edukasi

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Memahami Struktur Semantik — Kodeloka</title>
  </head>
  <body>
    <a href="#konten-utama" class="lompat-ke-konten">Lompat ke konten utama</a>

    <header>
      <a href="/">Kodeloka</a>
      <nav aria-label="Navigasi utama">
        <ul>
          <li><a href="/html/">HTML</a></li>
          <li><a href="/css/">CSS</a></li>
          <li><a href="/javascript/">JavaScript</a></li>
          <li><a href="/php/">PHP</a></li>
        </ul>
      </nav>
      <search>
        <form action="/cari" method="get">
          <label for="input-cari">Cari materi</label>
          <input id="input-cari" name="q" type="search" placeholder="Mis. flexbox, PDO...">
          <button type="submit">Cari</button>
        </form>
      </search>
    </header>

    <main id="konten-utama">
      <article>
        <header>
          <h1>Arsitektur Halaman Web Semantik</h1>
          <p>Diterbitkan pada <time datetime="2026-10-16">16 Oktober 2026</time></p>
        </header>

        <section aria-labelledby="bab-landmark">
          <h2 id="bab-landmark">Mengenal Landmark Dokumen</h2>
          <p>Landmark membantu pengguna menavigasi bagian halaman dengan cepat...</p>
        </section>

        <aside aria-label="Tips cepat">
          <h2>Tips Praktis</h2>
          <p>Selalu berikan atribut <code>aria-label</code> jika terdapat dua elemen <code>&lt;nav&gt;</code> di halaman yang sama.</p>
        </aside>

        <footer>
          <p>Ditulis oleh Tim Kurikulum Kodeloka.</p>
        </footer>
      </article>
    </main>

    <footer>
      <p><small>&copy; 2026 Kodeloka — Bagian dari Asadin Edu.</small></p>
    </footer>
  </body>
</html>
```

## Kesalahan Umum dan Cara Menghindarinya

1. **Mengganti semua `<div>` dengan `<section>` secara membabi buta:**
   - **Salah:** Membungkus deretan tombol atau pembungkus kolom *flexbox* dengan `<section>` tanpa judul. `<section>` tanpa heading membuat struktur dokumen menjadi rancu.
   - **Benar:** Gunakan `<section>` hanya untuk bagian bermakna yang memiliki judul (`<h2>`–`<h6>`), dan tetap gunakan `<div>` untuk wadah tata letak visual murni.
2. **Menaruh `<header>` atau `<footer>` di dalam `<header>` atau `<footer>` lain:**
   - **Salah:** Spesifikasi HTML melarang elemen `<header>` atau `<footer>` memiliki keturunan berupa `<header>` atau `<footer>` lainnya.

## Latihan Praktik: Mengubah "Div Soup" Menjadi Semantik

Perhatikan struktur kerangka situs berita berikut yang masih memakai `<div>` untuk semuanya:
1. Terdapat kepala situs berisi nama portal, menu kategori berita, dan kotak pencarian artikel.
2. Terdapat area utama berisi satu berita utama lengkap (dengan judul, waktu tayang, 2 subbagian pembahasan, dan kotak "Berita Terkait" di sampingnya).
3. Terdapat kaki situs berisi informasi redaksi dan hak cipta.

Tulislah berkas `berita-semantik.html` yang menerjemahkan kerangka tersebut ke dalam elemen `<header>`, `<nav>`, `<search>`, `<main>`, `<article>`, `<section>`, `<aside>`, dan `<footer>` secara tepat!

## Kuis Pemahaman

### Soal 1
Manakah kasus penggunaan yang paling tepat untuk elemen `<article>` dibandingkan `<section>`?
- A. Membungkus tiga tombol aksi di bagian bawah formulir pendaftaran.
- B. Membungkus satu kartu kiriman forum atau komentar pengguna yang memiliki penulis, waktu kirim, dan isi yang utuh bila ditampilkan secara mandiri.
- C. Membuat wadah pembungkus semata-mata agar CSS Grid dapat mengatur jarak antar-kolom.
- D. Membungkus bilah pencarian di bagian pojok kanan atas halaman.

**Jawaban Benar:** B
**Penjelasan:** `<article>` diperuntukkan bagi komposisi konten mandiri (*self-contained*) yang tetap bermakna utuh apabila didistribusikan ulang secara terpisah dari halaman aslinya, seperti artikel berita, kartu produk, atau kiriman komentar pengguna.

### Soal 2
Mengapa kita perlu menambahkan `aria-label` ketika sebuah halaman memiliki dua elemen `<nav>` (misalnya navigasi utama di bagian atas dan navigasi daftar isi di bagian samping)?
- A. Karena peramban akan menolak menerapkan aturan CSS pada elemen `<nav>` kedua jika tidak memiliki atribut `aria-label`.
- B. Agar pengguna pembaca layar dapat membedakan fungsi kedua wilayah navigasi tersebut saat membuka daftar *landmark* halaman.
- C. Karena atribut `aria-label` otomatis membuat menu kedua menempel (*sticky*) saat halaman digulir.
- D. Agar tautan di dalam `<nav>` kedua terbuka di tab baru secara otomatis.

**Jawaban Benar:** B
**Penjelasan:** Pembaca layar menampilkan daftar semua *landmark* di halaman. Jika terdapat dua `<nav>` tanpa nama, pembaca layar hanya menyebut `"navigation"` dan `"navigation"`. Dengan `aria-label="Menu utama"` dan `aria-label="Daftar isi modul"`, pengguna langsung memahami tujuan masing-masing navigasi.

### Soal 3
Elemen HTML manakah yang secara khusus diperkenalkan untuk menandai wilayah fungsi pencarian atau penyaringan (*filtering*) tanpa perlu menambahkan `role="search"` secara manual?
- A. `<find>`
- B. `<filter>`
- C. `<search>`
- D. `<query>`

**Jawaban Benar:** C
**Penjelasan:** Elemen `<search>` adalah elemen semantik HTML (Baseline Widely Available) yang secara bawaan memetakan wilayahnya ke ARIA landmark `role="search"`, sehingga membungkus `<form>` atau kontrol penyaringan data dengan makna aksesibilitas yang tepat.

## Sumber
- [Structuring documents — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents)
- [HTML: A good basis for accessibility — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML)
- [HTML elements reference — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
- [Learn Accessibility — web.dev](https://web.dev/learn/accessibility)
