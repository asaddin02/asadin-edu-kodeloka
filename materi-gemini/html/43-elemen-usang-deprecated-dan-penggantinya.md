# Elemen dan Atribut HTML Usang (*Deprecated/Obsolete*) beserta Pengganti Modernnya

- **Tingkat:** Dasar
- **Ringkasan:** Mengenali tag dan atribut warisan HTML4 (`<center>`, `<font>`, `<marquee>`, `<strike>`, `<frame>`, `align`, `bgcolor`, `border`) yang telah dihapus dari standar HTML5 agar tidak pernah terbawa ke kode produksi.

## Mengapa Elemen Warisan HTML4 Dihapus dari Standar HTML5?

Pada awal sejarah web di tahun 1990-an sebelum CSS didukung secara matang, pembuat halaman web mengatur tampilan visual langsung menggunakan tag dan atribut HTML seperti `<center>`, `<font color="red" size="4">`, `<bgcolor>`, dan `<marquee>`. Pendekatan ini mencampuradukkan **struktur makna dokumen** dengan **presentasi visual**, menyulitkan pembaca layar, membengkakkan ukuran dokumen HTML, dan membuat perubahan desain situs harus dilakukan di ribuan baris HTML satu per satu.

Dalam spesifikasi [WHATWG HTML Living Standard — Obsolete features](https://html.spec.whatwg.org/multipage/obsolete.html), seluruh elemen dan atribut presentasi warisan tersebut dinyatakan **usang (*obsolete / non-conforming*)** dan **dilarang ditulis** oleh pengembang. Meskipun peramban masih merendernya demi kompatibilitas mundur terhadap situs-situs tua, menggunakannya di kode baru akan gagal lulus validator W3C/WHATWG dan menurunkan kualitas aksesibilitas.

## 1. Peta Lengkap Elemen HTML Usang dan Pengganti Modernnya

Apabila Anda sedang meremajakan kode proyek lama (*legacy*) atau menyalin cuplikan kode dari forum lawas, gunakan tabel pemetaan berikut untuk menggantinya dengan elemen semantik HTML5 atau properti CSS yang tepat:

| Elemen Usang (Jangan Gunakan) | Mengapa Dihapus? | Pengganti Standar Modern (HTML5 / CSS) |
|---|---|---|
| `<center>` | Murni presentasi visual tanpa makna semantik. | Gunakan CSS `text-align: center` (untuk teks sebaris) atau `margin-inline: auto` / Flexbox / Grid (untuk kotak blok). |
| `<font color="..." face="..." size="...">` | Mengikat warna dan ukuran huruf langsung di markup. | Gunakan elemen semantik yang sesuai (`<p>`, `<strong>`, `<span>`) dan atur `color`, `font-family`, `font-size` di CSS. |
| `<strike>` | Ambigu antara teks yang tidak lagi akurat dan teks yang dihapus dari revisi dokumen. | Gunakan **`<s>`** untuk informasi yang tidak lagi berlaku (misalnya harga coret diskon), atau **`<del>`** untuk teks yang dihapus dalam riwayat suntingan. |
| `<tt>` (*Teletype text*) | Hanya mengubah huruf menjadi *monospace* tanpa menjelaskan jenis teksnya. | Gunakan **`<code>`** (kode program), **`<kbd>`** (masukan papan ketik), **`<samp>`** (keluaran program), atau CSS `font-family: monospace`. |
| `<big>` | Hanya memperbesar ukuran huruf secara visual (sedangkan `<small>` dipertahankan untuk catatan hukum/hak cipta). | Gunakan heading (`<h2>`–`<h6>`), `<strong>`, atau properti CSS `font-size`. |
| `<acronym>` | Tumpang tindih dan membingungkan dengan singkatan umum. | Gunakan **`<abbr title="...">`** baik untuk singkatan maupun akronim. |
| `<marquee>` dan `<blink>` | Mengganggu konsentrasi pengguna, melanggar kriteria aksesibilitas WCAG 2.2.2, dan tidak standar. | Hindari teks berkedip; jika animasi geser memang diperlukan, gunakan CSS `@keyframes` dan matikan saat `@media (prefers-reduced-motion: reduce)`. |
| `<frame>`, `<frameset>`, `<noframes>` | Merusak navigasi tombol Mundur, penandaan URL (*bookmark*), dan pembaca layar. | Gunakan tata letak CSS Grid/Flexbox, atau **`<iframe>`** jika memang harus menyematkan dokumen eksternal. |

## 2. Atribut Presentasi yang Usang dan Contoh Kode Modernisasi

Selain tag elemen, banyak atribut presentasi warisan pada `<body>`, `<table>`, `<tr>`, `<td>`, `<hr>`, dan `<img>` yang juga telah dinyatakan usang di HTML5 (seperti `align`, `valign`, `bgcolor`, `border`, `cellpadding`, `cellspacing`, serta `width`/`height` pada `<td>`):

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mengganti Elemen Usang — Kodeloka</title>
    <style>
      .tengah { text-align: center; }
      .peringatan { color: #b91c1c; font-size: 1.25rem; }
      .kotak { background-color: #f1f5f9; border: 1px solid #94a3b8; border-collapse: collapse; }
      .kotak th, .kotak td { border: 1px solid #94a3b8; padding: 0.5rem; }
    </style>
  </head>
  <body>
    <main>
      <!-- Pengganti <center> dan <font color size>: kelas CSS -->
      <p class="tengah"><span class="peringatan">Peringatan</span></p>

      <!-- Pengganti <strike>: <s> untuk info tak berlaku, <del> untuk revisi -->
      <p><s>Rp 450.000</s> <strong>Rp 299.000</strong></p>

      <!-- Pengganti <tt>: <code> (atau <kbd>/<samp> sesuai makna) -->
      <p>Jalankan <code>npm run dev</code> di terminal.</p>

      <!-- Pengganti atribut border dan bgcolor pada tabel: CSS -->
      <table class="kotak">
        <caption>Contoh tabel</caption>
        <tr><th scope="col">Nama</th><th scope="col">Nilai</th></tr>
        <tr><td>A</td><td>10</td></tr>
      </table>
    </main>
  </body>
</html>
```

Bandingkan dengan markup usang yang **tidak boleh** Anda tulis (contoh ini hanya untuk dikenali):

```html
<center><font color="red" size="4">Peringatan</font></center>
<strike>Rp 450.000</strike>
<tt>npm run dev</tt>
<table border="1" bgcolor="#f1f5f9">...</table>
<marquee>Teks berjalan</marquee>
```

Elemen `<marquee>` tidak memiliki pengganti HTML langsung; bila animasi memang diperlukan, gunakan CSS (`@keyframes`) dan hormati `prefers-reduced-motion`.

## 3. Pengecualian Penting: Atribut `width` dan `height` yang Tetap Valid!

Jangan sampai salah kaprah: meskipun atribut `width` dan `height` telah dinyatakan usang pada elemen **`<td>`**, **`<th>`**, dan **`<table>`**, atribut **`width` dan `height` TETAP VALID dan SANGAT DIANJURKAN** pada elemen media visual seperti **`<img>`**, **`<video>`**, **`<svg>`**, **`<canvas>`**, dan **`<iframe>`**! Pada elemen-elemen media tersebut, `width` dan `height` mendefinisikan ukuran intrinsik aset guna mencegah pergeseran tata letak (CLS).

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Masih menulis `<table border="1" cellpadding="8" width="100%">` pada halaman web modern:** Gunakan properti CSS `border-collapse: collapse`, `border`, `padding`, dan `width: 100%` di stylesheet Anda.
2. **Mengganti `<center>` dengan `<div align="center">`:** Atribut `align="center"` pada `<div>`, `<p>`, atau `<h1>` sama-sama sudah usang di HTML5! Gunakan `text-align: center` atau Flexbox/Grid di CSS.
3. **Bingung memilih antara `<s>` dan `<del>` saat mengganti `<strike>`:** Gunakan **`<s>`** untuk menyatakan sesuatu yang sudah tidak lagi akurat atau tidak lagi relevan (seperti harga sebelum diskon), dan gunakan **`<del>`** apabila Anda ingin mencatat penghapusan teks editorial di dalam revisi dokumen.

## Latihan Praktik

Buatlah berkas `43-elemen-usang-deprecated-dan-penggantinya.html` dengan memodernisasi cuplikan HTML4 warisan berikut menjadi HTML5 dan CSS yang 100% valid:
1. Ubah `<center><font face="Arial" size="5" color="blue"><b>Promo Kelas <acronym title="HyperText Markup Language">HTML</acronym></b></font></center>` menjadi `<h1>` dengan `<abbr>` dan kelas CSS.
2. Ubah `<p>Harga normal: <strike>Rp 300.000</strike>, ketik <tt>BELAJAR26</tt> saat pendaftaran.</p>` menjadi elemen semantik HTML5 (`<s>` dan `<code>`/`<kbd>`).
3. Ubah `<table border="1" cellpadding="10" bgcolor="#ffffff">` menjadi tabel semantik dengan `<caption>`, `<th scope="col">`, dan penataan CSS `border-collapse: collapse`.

## Kuis Pemahaman

### Soal 1
Ketika Anda memodernisasi halaman katalog toko daring yang sebelumnya menggunakan tag usang `<strike>Rp 500.000</strike>` untuk menampilkan harga lama yang sudah didiskon, elemen HTML5 manakah yang paling tepat sebagai penggantinya?
- A. `<s>Rp 500.000</s>`
- B. `<tt>Rp 500.000</tt>`
- C. `<acronym>Rp 500.000</acronym>`
- D. `<blink>Rp 500.000</blink>`

**Jawaban Benar:** A
**Penjelasan:** Elemen `<s>` digunakan di HTML5 untuk menandai teks yang sudah tidak lagi akurat atau tidak lagi relevan (seperti harga lama sebelum diskon), sedangkan `<del>` digunakan untuk menandai penghapusan teks dalam revisi dokumen.

### Soal 2
Manakah pengganti semantik yang tepat di HTML5 untuk elemen usang `<tt>` (*teletype/monospace*) dan `<acronym>`?
- A. `<tt>` diganti dengan `<font>`, dan `<acronym>` diganti dengan `<big>`
- B. `<tt>` diganti dengan `<code>`, `<kbd>`, atau `<samp>` sesuai makna teksnya (atau CSS `font-family: monospace`), sedangkan `<acronym>` diganti dengan `<abbr>`
- C. `<tt>` diganti dengan `<marquee>`, dan `<acronym>` diganti dengan `<center>`
- D. Keduanya diganti dengan `<frame>`

**Jawaban Benar:** B
**Penjelasan:** HTML5 mengganti `<tt>` yang murni visual dengan elemen semantik spesifik (`<code>` untuk kode, `<kbd>` untuk tombol papan ketik, `<samp>` untuk output komputer) dan menyatukan `<acronym>` ke dalam `<abbr>`.

### Soal 3
Pada elemen manakah atribut HTML `width` dan `height` **masih valid dan sangat dianjurkan** dalam standar HTML5 (berbeda dengan pada `<td>` atau `<table>` yang sudah usang)?
- A. Pada elemen `<p>` dan `<span>`
- B. Pada elemen `<img>`, `<video>`, `<svg>`, `<canvas>`, dan `<iframe>` untuk mendefinisikan dimensi intrinsik dan mencegah *Cumulative Layout Shift* (CLS)
- C. Pada elemen `<ul>` dan `<ol>`
- D. Pada elemen `<center>` dan `<font>`

**Jawaban Benar:** B
**Penjelasan:** Pada elemen media tersemat seperti `<img>` dan `<video>`, atribut `width` dan `height` bukanlah atribut presentasi usang, melainkan spesifikasi dimensi intrinsik yang vital untuk menjaga kestabilan tata letak halaman.

## Sumber
- [Obsolete features — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/obsolete.html)
- [HTML elements reference — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
- [`<table>` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table)
