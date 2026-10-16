# Sistem Warna Modern (`oklch`, `color-mix`) dan Tipografi Web

- **Tingkat:** Menengah
- **Ringkasan:** Mengelola palet warna yang konsisten secara persepsi manusia dengan `oklch()` dan `color-mix()`, memastikan kontras aksesibilitas WCAG, memuat fon web secara efisien dengan `@font-face` (`font-display: swap`), serta menyempurnakan keterbacaan teks dengan `text-wrap: balance` dan `pretty`.

## 1. Evolusi Ruang Warna di CSS: Dari Hex dan HSL ke `oklch()`

Selama bertahun-tahun kita menulis warna menggunakan kode Heksadesimal (`#2563eb`), `rgb()`, atau `hsl(220 90% 50%)`.

Catatan pertama untuk sintaks modern: di CSS Color Module Level 4, fungsi `rgb()` dan `hsl()` kini menggunakan **sintaks pemisah spasi** dan tanda `/` untuk opasitas (*alpha*), sehingga Anda tidak perlu lagi menulis `rgba()` atau `hsla()`:

```css
/* Sintaks modern berbasis spasi (Baseline Widely Available) */
.kotak-bayangan {
  background-color: rgb(37 99 235 / 0.15);
  border-color: hsl(221 83% 53% / 0.4);
}
```

### Mengapa `oklch()` Lebih Unggul daripada `hsl()` untuk Sistem Desain?
Di atas kertas, `hsl(Hue Saturation Lightness)` tampak mudah untuk membuat variasi warna. Namun, `hsl()` memiliki kelemahan matematis: mata manusia melihat warna **kuning (`hue: 60`) jauh lebih terang** daripada warna **biru (`hue: 240`)** meskipun keduanya sama-sama diberi `Lightness: 50%`! Akibatnya, jika Anda mengganti warna tombol dari biru ke kuning dengan `L: 50%`, teks putih di atasnya tiba-tiba tidak terbaca sama sekali.

Untuk mengatasi hal ini, CSS modern menghadirkan fungsi warna **`oklch(L C H)`** (status **Baseline Widely Available** sejak Mei 2023):

```
oklch( 60%   0.18   250  /  1.0 )
       ─┬─   ──┬─   ─┬─     ─┬─
        │      │     │       └── Opasitas / Alpha (opsional, 0–1 atau 0%–100%)
        │      │     └────────── Hue (Sudut rona warna: 0°–360°)
        │      └──────────────── Chroma (Kepekatan/kemurnian warna: 0 = abu-abu hingga ~0.37)
        └─────────────────────── Perceptual Lightness (Kecerahan menurut mata manusia: 0%–100%)
```

Keunggulan utama **`oklch()`**:
1. **Kecerahan yang Konsisten secara Persepsi (*Perceptually Uniform*):** Dua warna dengan nilai `L` (`Lightness`) yang sama di `oklch()` (misalnya biru `oklch(65% 0.15 250)` dan hijau `oklch(65% 0.15 145)`) akan memiliki tingkat kecerahan dan rasio kontras teks yang **setara di mata manusia**!
2. **Akses ke Warna Layar Lebar (P3 Wide Gamut):** `oklch()` mampu menghasilkan warna yang lebih hidup pada layar modern yang mendukung ruang warna Display-P3.

```css
:root {
  /* Membuat skala warna biru yang konsisten cukup dengan mengubah nilai L (Lightness) */
  --biru-100: oklch(95% 0.03 255);
  --biru-500: oklch(60% 0.19 255);
  --biru-700: oklch(45% 0.17 255);
  --biru-900: oklch(25% 0.09 255);
}
```

### Mencampur Warna secara Dinamis dengan `color-mix()`
Fungsi **`color-mix()`** (status **Baseline Widely Available** sejak 2023) memungkinkan Anda membuat variasi warna *hover* atau warna transparan langsung dari satu variabel warna tanpa perlu mendefinisikan ulang kodenya:

```css
.tombol-utama {
  --warna-dasar: oklch(58% 0.2 255);
  background-color: var(--warna-dasar);
  color: #ffffff;
}

.tombol-utama:hover {
  /* Gelapkan warna dasar dengan mencampurkan 15% warna hitam di ruang oklch */
  background-color: color-mix(in oklch, var(--warna-dasar), black 15%);
}

.lencana-info {
  /* Buat warna latar lembut dengan mencampurkan 12% warna dasar dengan transparan */
  background-color: color-mix(in oklch, var(--warna-dasar) 12%, transparent);
}
```

## 2. Tipografi Web yang Cepat dan Mudah Dibaca

### A. Tumpukan Fon (*Font Stack*) dan `@font-face`
Selalu sertakan tumpukan fon cadangan (*fallback*) yang diakhiri dengan kategori generik (`sans-serif`, `serif`, atau `monospace`). Jika Anda ingin kecepatan pemuatan tertinggi dengan `0 KB` unduhan fon, gunakan **System Font Stack**:

```css
:root {
  --fon-antarmuka: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --fon-kode: ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, monospace;
}
```

Jika Anda memuat fon kustom sendiri menggunakan `@font-face`, gunakan format **`.woff2`** (kompresi terbaik yang didukung semua peramban modern) dan selalu tambahkan **`font-display: swap`**:

```css
@font-face {
  font-family: "Plus Jakarta Sans";
  src: url("/assets/fonts/plus-jakarta-sans-variable.woff2") format("woff2");
  font-weight: 400 800; /* Mendukung Variable Font dari bobot 400 hingga 800 dalam 1 berkas! */
  font-style: normal;
  font-display: swap;   /* Tampilkan teks dengan fon sistem dulu agar pembaca tidak melihat layar kosong (FOIT) */
}
```

### B. Aturan Emas Keterbacaan: `line-height`, `max-inline-size`, dan `text-wrap`

1. **Tinggi Baris (`line-height`) Tanpa Satuan:**
   Selalu tulis `line-height` menggunakan angka tanpa satuan (misalnya `line-height: 1.6` untuk paragraf isi, dan `line-height: 1.2` untuk judul besar). Mengapa tanpa satuan? Karena jika Anda menulis `line-height: 24px` pada `<body>`, elemen `<h1>` yang berukuran `40px` akan mewarisi tinggi baris tetap `24px` sehingga huruf-huruf judulnya saling bertabrakan!
2. **Perataan Baris Judul dan Paragraf dengan `text-wrap: balance` & `pretty`:**
   Pernahkah Anda melihat judul artikel yang baris pertamanya berisi 8 kata, lalu baris keduanya hanya menyisakan 1 kata pendek sendirian (*orphan word*)?
   CSS modern menyelesaikan masalah ini dengan properti **`text-wrap`**:
   - **`text-wrap: balance`** (Baseline Widely Available): Menyeimbangkan panjang setiap baris pada blok teks pendek (maksimal sekitar 6 baris) sehingga lebar baris pertama dan kedua pada judul terlihat seimbang dan estetis!
   - **`text-wrap: pretty`**: Mencegah satu kata tertinggal sendirian di baris paling akhir sebuah paragraf.

```css
h1, h2, h3, blockquote {
  text-wrap: balance;
  line-height: 1.2;
}

p {
  text-wrap: pretty;
  line-height: 1.65;
  max-inline-size: 65ch;
}

/* Memastikan angka di dalam kolom tabel atau penghitung waktu memiliki lebar digit yang sejajar */
.angka-tabel, time {
  font-variant-numeric: tabular-nums;
}
```

## Latihan Praktik: Membangun Sistem Tipografi dan Palet Warna `oklch()`

Buatlah berkas `tipografi-warna.html` dan `tema.css`:
1. Definisikan skala warna utama dan warna permukaan menggunakan `oklch()`, serta gunakan `color-mix()` untuk menghasilkan warna bingkai dan efek `:hover`.
2. Terapkan `text-wrap: balance` pada judul artikel yang panjang dan `text-wrap: pretty` beserta `max-inline-size: 65ch` pada paragraf.
3. Buat sebuah tabel angka keuangan yang menerapkan `font-variant-numeric: tabular-nums` dan perataan kanan (`text-align: right`) agar satuan ribuan sejajar lurus dari atas ke bawah.

## Kuis Pemahaman

### Soal 1
Apa keunggulan utama mendefinisikan palet warna menggunakan fungsi `oklch()` dibandingkan `hsl()`?
- A. `oklch()` adalah satu-satunya format warna yang dapat digunakan pada properti `border-color`.
- B. Nilai *Lightness* (`L`) pada `oklch()` bersifat *perceptually uniform* (seragam menurut persepsi mata manusia), sehingga mengubah sudut rona warna (*Hue*) tanpa mengubah nilai `L` akan menghasilkan tingkat kecerahan dan kontras baca yang konsisten.
- C. `oklch()` secara otomatis mengubah gambar JPEG menjadi SVG.
- D. `hsl()` tidak mendukung tingkat transparansi (*alpha*).

**Jawaban Benar:** B
**Penjelasan:** Pada `hsl()`, warna kuning dan biru dengan `Lightness: 50%` terlihat memiliki kecerahan yang sangat timpang bagi mata manusia. Ruang warna `oklch()` dirancang secara ilmiah agar nilai kecerahan (`L`) mencerminkan persepsi kecerahan visual manusia secara akurat.

### Soal 2
Mengapa nilai properti `line-height` sangat disarankan ditulis sebagai angka tanpa satuan (seperti `line-height: 1.5`) alih-alih menggunakan satuan panjang tetap (seperti `line-height: 24px`)?
- A. Karena peramban modern menolak satuan `px` pada properti `line-height`.
- B. Karena nilai tanpa satuan diwariskan sebagai faktor pengali terhadap `font-size` masing-masing elemen anak; sedangkan nilai `24px` diwariskan sebagai angka mati yang akan membuat teks berukuran besar (seperti `<h1>`) saling bertumpukan.
- C. Karena angka tanpa satuan membuat halaman dimuat tanpa perlu membangun CSSOM.
- D. Agar spasi antar-huruf secara otomatis melebar dua kali lipat.

**Jawaban Benar:** B
**Penjelasan:** Jika `body` memiliki `line-height: 24px`, maka nilai komputasi `24px` itulah yang diwariskan ke seluruh elemen anak, termasuk `<h1>` yang mungkin berukuran `36px`. Sebaliknya, dengan `line-height: 1.5`, elemen anak mewarisi faktor pengali `1.5` dan menghitung tinggi barisnya sesuai `font-size` miliknya sendiri.

### Soal 3
Apa fungsi dari deklarasi `font-display: swap;` di dalam aturan `@font-face`?
- A. Mengganti bahasa halaman secara otomatis sesuai lokasi pengguna.
- B. Menginstruksikan peramban untuk segera merender teks menggunakan fon cadangan (*fallback font*) sementara berkas fon kustom sedang diunduh, lalu menukarnya begitu fon kustom siap, sehingga mencegah teks tak terlihat (*Flash of Invisible Text*).
- C. Menukar warna teks dengan warna latar belakang saat kursor diarahkan.
- D. Menghapus berkas fon setelah halaman ditutup.

**Jawaban Benar:** B
**Penjelasan:** Tanpa `font-display: swap`, peramban dapat menahan penggambaran teks hingga beberapa detik sambil menunggu berkas `.woff2` selesai diunduh dari jaringan lambat. Dengan `swap`, pengguna dapat langsung membaca konten sejak detik pertama.

## Sumber
- [`oklch()` CSS function — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch)
- [`font-family` CSS property — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-family)
- [What's New in WCAG 2.2 (Contrast) — W3C WAI](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
