# Internasionalisasi HTML (`lang`, `dir`, `<bdi>`, `<ruby>`) dan Notasi Matematika (`<math>`)

- **Tingkat:** Menengah
- **Ringkasan:** Menangani konten multibahasa dan teks dua arah (*bidirectional text*) secara akurat menggunakan `<bdi>`, `<bdo>`, `dir="auto"`, `translate="no"`, anotasi fonetik `<ruby>`, serta menulis rumus matematika standar web dengan **MathML (`<math>`)**.

## 1. Masalah Nyata Teks Dua Arah (*Bidirectional Text*) dan Solusi `<bdi>`

Dalam aplikasi web yang menampung nama pengguna, komentar, atau judul berkas dari seluruh dunia, sering kali teks berarah **Kiri-ke-Kanan (LTR — seperti Bahasa Indonesia/Inggris)** bercampur dengan teks berarah **Kanan-ke-Kiri (RTL — seperti bahasa Arab atau Ibrani)** di dalam satu kalimat yang sama.

Algoritma Unicode Bidirectional (*BiDi*) di peramban berusaha menebak arah baca tanda baca dan angka yang mengapit teks tersebut. Namun, tanpa petunjuk isolasi HTML, tanda titik dua, tanda kurung, atau angka peringkat di sebelah nama berbahasa Arab/Ibrani **akan melompat terbalik ke sisi yang salah**!

Solusinya adalah elemen **`<bdi>` (*Bidirectional Isolate*)**:
- Bungkus setiap teks dinamis yang berasal dari pengguna (seperti nama pengguna di daftar peringkat atau komentar) dengan `<bdi>...</bdi>`.
- `<bdi>` menginstruksikan peramban untuk: (1) mendeteksi arah baca isi di dalamnya secara otomatis, dan (2) **mengisolasinya** agar tidak memengaruhi posisi tanda baca atau angka di luar `<bdi>`!

```html
<h2>Peringkat Kontributor Minggu Ini</h2>
<ul>
  <!-- Tanpa <bdi>, jika nama pengguna menggunakan aksara Arab (RTL),
       tanda "- 150 poin" dapat melompat berantakan! Dengan <bdi>, posisi tetap rapi. -->
  <li>Peringkat 1: <bdi>Nadia Pratama</bdi> - 150 poin</li>
  <li>Peringkat 2: <bdi>إبراهيم</bdi> - 120 poin</li>
  <li>Peringkat 3: <bdi>Budi Santoso</bdi> - 95 poin</li>
</ul>
```

### Atribut `dir="auto"` pada Input dan Paragraf Komentar
Jika Anda menyediakan `<textarea>` atau menampilkan `<p>` komentar yang bahasanya ditentukan oleh pengguna, pasang atribut **`dir="auto"`**! Peramban akan memeriksa karakter huruf pertama yang diketikkan pengguna: jika diawali huruf Latin, kotak input otomatis rata kiri (`ltr`); jika diawali huruf Arab, kotak input otomatis beralih menjadi rata kanan (`rtl`)!

```html
<label for="komentar-diskusi">Tulis Komentar Anda</label>
<textarea id="komentar-diskusi" name="komentar" dir="auto" rows="3"></textarea>
```

## 2. Mencegah Penerjemahan Otomatis yang Merusak Kode (`translate="no"`)

Fitur penerjemah halaman otomatis di peramban (seperti Google Translate bawaan Chrome) sangat membantu pembaca internasional, tetapi sering kali **ikut menerjemahkan nama perintah terminal, kata kunci bahasa pemrograman, atau nama merek** (misalnya mengubah perintah `go run main.go` menjadi `pergi lari utama.pergi`!).

Gunakan atribut global standar HTML **`translate="no"`** pada blok kode, nama merek, atau istilah yang tidak boleh diterjemahkan oleh mesin penerjemah:

```html
<p>
  Untuk menjalankan server pengembangan di <span translate="no">Kodeloka</span>,
  ketik perintah berikut di terminal:
</p>
<pre translate="no"><code>npm run dev</code></pre>
```

## 3. Anotasi Pelafalan Aksara dengan `<ruby>`, `<rt>`, dan `<rp>`

Untuk situs edukasi bahasa atau istilah teknis yang membutuhkan panduan cara baca di atas huruf (seperti Furigana pada huruf Kanji Jepang, Pinyin pada Mandarin, atau transliterasi aksara), HTML menyediakan elemen semantik **`<ruby>`**, **`<rt>` (*ruby text*)**, dan **`<rp>` (*ruby fallback parenthesis*)**:

```html
<p>
  Istilah Jepang untuk perbaikan berkelanjutan adalah
  <ruby>
    改善 <rp>(</rp><rt>kaizen</rt><rp>)</rp>
  </ruby>.
</p>
```

## 4. Menulis Rumus Matematika Secara Semantik dengan `<math>` (MathML Core)

Dulu, menampilkan rumus matematika kompleks di web mengharuskan pengiriman gambar statis atau pustaka JavaScript besar. Kini, **MathML Core (`<math>`)** telah berstatus **Baseline Widely Available** (didukung secara asli di Chrome, Edge, Firefox, dan Safari tanpa plugin atau JavaScript)!

Tag dasar di dalam `<math>` (gunakan atribut `display="block"` untuk rumus yang berdiri di tengah baris baru, atau biarkan bawaan untuk rumus sebaris):
- **`<mi>` (*math identifier*):** Nama variabel atau konstanta (misalnya `x`, `n`, `π`; satu karakter otomatis dicetak miring).
- **`<mn>` (*math number*):** Angka (misalnya `2`, `10`).
- **`<mo>` (*math operator*):** Operator matematika (`+`, `=`, `−`, `∑`).
- **`<msup>` / `<msub>`:** Pangkat (*superscript*) dan indeks bawah (*subscript*).
- **`<mfrac>`:** Pecahan (anak pertama adalah pembilang di atas, anak kedua adalah penyebut di bawah).
- **`<msqrt>`:** Akar kuadrat.
- **`<mrow>`:** Pengelompokan ekspresi (seperti tanda kurung tak terlihat untuk menyatukan beberapa elemen menjadi satu bagian pembilang/penyebut).

```html
<p>
  Kompleksitas waktu pencarian biner (<em>Binary Search</em>) pada
  <math><mi>n</mi></math> elemen yang terurut adalah:
</p>

<math display="block">
  <mrow>
    <mi>T</mi>
    <mo>(</mo><mi>n</mi><mo>)</mo>
    <mo>=</mo>
    <mi>O</mi>
    <mo>(</mo>
    <msub><mi>log</mi><mn>2</mn></msub>
    <mi>n</mi>
    <mo>)</mo>
  </mrow>
</math>

<p>Rumus kuadrat (rumus ABC) yang dirender langsung oleh mesin peramban:</p>

<math display="block">
  <mrow>
    <mi>x</mi>
    <mo>=</mo>
    <mfrac>
      <mrow>
        <mo>−</mo><mi>b</mi>
        <mo>±</mo>
        <msqrt>
          <mrow>
            <msup><mi>b</mi><mn>2</mn></msup>
            <mo>−</mo>
            <mn>4</mn><mi>a</mi><mi>c</mi>
          </mrow>
        </msqrt>
      </mrow>
      <mrow>
        <mn>2</mn><mi>a</mi>
      </mrow>
    </mfrac>
  </mrow>
</math>
```

Keunggulan menggunakan `<math>` bawaan: rumus langsung tajam di semua tingkat perbesaran layar, mengikuti warna teks CSS (`color`) dan ukuran huruf (`font-size`), serta dapat dibacakan oleh pembaca layar yang mendukung MathML (tingkat dukungan masih bervariasi antar-peramban dan pembaca layar, jadi uji dengan teknologi bantu yang dipakai pembaca Anda).

## Latihan Praktik: Halaman Materi Algoritma Multibahasa dan Matematika

Buatlah berkas `mathml-dan-bidi.html`:
1. Buat daftar 3 kontributor dari berbagai negara menggunakan elemen `<bdi>` agar tanda baca di sekitarnya terlindungi.
2. Tambahkan blok kode perintah terminal yang dilindungi dengan `translate="no"`.
3. Tulis rumus Teorema Pythagoras (`a² + b² = c²`) dan rumus rata-rata pecahan menggunakan elemen `<math display="block">`, `<msup>`, `<mfrac>`, `<mi>`, `<mn>`, dan `<mo>`.

## Kuis Pemahaman

### Soal 1
Mengapa kita perlu membungkus nama pengguna dinamis dengan elemen `<bdi>` ketika menampilkannya di tengah kalimat berbahasa Indonesia (misalnya `<li>Pemenang: <bdi>...</bdi> (100 poin)</li>`)?
- A. Agar nama pengguna otomatis dicetak tebal oleh peramban.
- B. Untuk mengisolasi arah penulisan teks di dalam `<bdi>` (misalnya jika nama pengguna ditulis dalam aksara Arab yang berarah kanan-ke-kiri) supaya tidak membalikkan posisi tanda kurung dan angka `" (100 poin)"` yang berada di sebelahnya.
- C. Untuk mencegah mesin pencari mengindeks nama pengguna tersebut.
- D. Agar nama pengguna otomatis diterjemahkan ke Bahasa Indonesia.

**Jawaban Benar:** B
**Penjelasan:** Elemen `<bdi>` (*Bidirectional Isolate*) memisahkan perhitungan algoritma *Unicode Bidirectional* antara teks di dalamnya dan teks di sekitarnya, sehingga tanda baca dan angka di luar `<bdi>` tidak ikut tertarik terbalik.

### Soal 2
Atribut standar HTML apakah yang digunakan untuk memberi tahu fitur penerjemah otomatis peramban (seperti Google Translate) agar **tidak** menerjemahkan isi dari elemen `<code>` atau nama merek produk?
- A. `lang="none"`
- B. `translate="no"`
- C. `dir="ltr"`
- D. `spellcheck="false"`

**Jawaban Benar:** B
**Penjelasan:** Atribut global `translate="no"` merupakan standar spesifikasi WHATWG HTML yang dipatuhi oleh mesin penerjemah peramban dan layanan lokalisasi untuk melewati penerjemahan pada elemen tersebut.

### Soal 3
Di dalam elemen `<math>` (MathML), tag manakah yang digunakan untuk membuat pecahan matematika (pembilang di atas dan penyebut di bawah)?
- A. `<mdiv>`
- B. `<mfrac>`
- C. `<msup>`
- D. `<msqrt>`

**Jawaban Benar:** B
**Penjelasan:** Elemen `<mfrac>` (*math fraction*) menerima tepat dua elemen anak (atau dua grup `<mrow>`): anak pertama dirender sebagai pembilang di bagian atas, dan anak kedua dirender sebagai penyebut di bagian bawah.

## Sumber
- [Text-level semantics (`bdi`, `bdo`, `ruby`) — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/text-level-semantics.html)
- [HTML elements reference (`<math>`, `<bdi>`, `<ruby>`) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
