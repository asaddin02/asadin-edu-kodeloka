# Cara CSS Bekerja dan Selektor Modern

- **Tingkat:** Dasar
- **Ringkasan:** Memahami anatomi aturan CSS, bagaimana peramban mencocokkan selektor dari kanan ke kiri, serta menguasai selektor dasar, atribut, kombinator, pseudo-element, hingga pseudo-class modern (`:is()`, `:where()`, dan `:has()`).

## Bagaimana Peramban Membaca dan Menerapkan CSS?

Setelah peramban mengurai dokumen HTML menjadi pohon **DOM (*Document Object Model*)**, peramban membaca seluruh berkas CSS (`.css`) dan elemen `<style>` untuk membangun **CSSOM (*CSS Object Model*)**.

Setiap aturan CSS (*style rule*) terdiri dari dua bagian utama: **Selektor (*Selector*)** dan **Blok Deklarasi (*Declaration Block*)**:

```text
.kartu-kelas > h2 {
  color: #0f172a;
  font-size: 1.25rem;
}
└───────┬───────┘   └──────────┬──────────┘
     Selektor        Deklarasi (Properti: Nilai)
```

> **💡 Fakta Menarik Mesin Peramban: Pencocokan Selektor dari Kanan ke Kiri!**
> Banyak pengembang mengira peramban membaca `.kartu-kelas > h2` dari kiri ke kanan (mencari `.kartu-kelas` dulu, baru mencari `h2`). Sebenarnya, mesin CSS peramban mengevaluasi selektor **dari kanan ke kiri**: peramban mengumpulkan semua elemen `<h2>` terlebih dahulu, lalu memeriksa apakah elemen induk langsungnya memiliki kelas `.kartu-kelas`. Itulah sebabnya menulis selektor yang terlalu panjang dan berakhir dengan selektor universal seperti `.kontainer div ul li *` memboroskan kerja mesin peramban.

### Tiga Cara Menghubungkan CSS ke HTML
1. **External Stylesheet (`<link rel="stylesheet" href="style.css">`):** Cara terbaik dan paling direkomendasikan untuk produksi karena berkas CSS dapat disimpan di *cache* peramban lintas halaman.
2. **Internal Stylesheet (`<style>...</style>` di dalam `<head>`):** Berguna untuk halaman mandiri (*single-file*) atau pengujian singkat.
3. **Inline Styles (`style="color: red"` pada elemen HTML):** Hindari untuk penataan gaya umum karena tidak dapat disimpan terpisah di *cache*, tidak mendukung pseudo-class (`:hover`) maupun `@media`, dan memiliki spesifisitas sangat tinggi yang sulit ditimpa. (Pengecualian yang wajar: menyuplai nilai variabel CSS dinamis dari JavaScript, seperti `style="--progres: 75%"`).

## 1. Selektor Dasar dan Selektor Atribut

| Jenis Selektor | Contoh Sintaks | Elemen yang Dicocokkan |
|---|---|---|
| Selektor Tipe (*Type*) | `article`, `p`, `button` | Semua elemen dengan nama tag tersebut. |
| Selektor Kelas (*Class*) | `.tombol-utama` | Semua elemen yang atribut `class`-nya memuat kata `tombol-utama`. |
| Selektor ID | `#navigasi-atas` | Satu elemen yang memiliki `id="navigasi-atas"`. |
| Selektor Universal | `*` | Semua elemen (sering dipakai di aturan *reset* `*, *::before, *::after`). |
| Atribut Eksistensi / Nilai | `[disabled]`, `[type="email"]` | Elemen yang memiliki atribut tersebut / dengan nilai persis. |
| Atribut Awalan (`^=`) | `a[href^="https://"]` | Tautan yang atribut `href`-nya **diawali** dengan `https://`. |
| Atribut Akhiran (`$=`) | `a[href$=".pdf"]` | Tautan yang atribut `href`-nya **diakhiri** dengan `.pdf`. |
| Atribut Substring (`*=`) | `a[href*="kodeloka"]` | Tautan yang atribut `href`-nya **mengandung** kata `kodeloka` di mana saja. |

```css
/* Menambahkan penanda visual otomatis pada semua tautan unduhan PDF */
a[href$=".pdf"]::after {
  content: " (PDF)";
  font-size: 0.85em;
  color: #64748b;
}

/* Pencocokan atribut tanpa memedulikan huruf besar/kecil dengan flag 'i' */
a[href$=".pdf" i] {
  font-weight: 600;
}
```

## 2. Kombinator (*Combinators*): Mengatur Hubungan Antar-Elemen

Kombinator menghubungkan dua selektor berdasarkan posisi mereka di pohon DOM:

1. **Descendant Combinator (Spasi ` `):** `article p` memilih semua `<p>` yang berada di dalam `<article>`, baik anak langsung maupun cucu di tingkat sedalam apa pun.
2. **Child Combinator (`>`):** `ul > li` memilih `<li>` yang merupakan **anak langsung** dari `<ul>` (tidak memilih `<li>` di dalam sub-menu bersarang).
3. **Next-Sibling Combinator (`+`):** `h2 + p` memilih satu elemen `<p>` yang muncul **tepat setelah** `<h2>` pada induk yang sama.
4. **Subsequent-Sibling Combinator (`~`):** `h2 ~ p` memilih semua elemen `<p>` yang menjadi adik setelah `<h2>` pada induk yang sama.

```css
/* Pola "Lobotomized Owl" modern: memberi jarak atas pada semua elemen
   yang memiliki kakak tepat di atasnya di dalam aliran artikel */
.isi-artikel > * + * {
  margin-block-start: 1rem;
}
```

## 3. Pseudo-Class Modern: `:is()`, `:where()`, `:not()`, dan `:has()`

Selain pseudo-class interaksi dasar seperti `:hover`, `:focus-visible`, `:active`, dan struktural seperti `:first-child`, `:nth-child(even)`, CSS modern menghadirkan empat pseudo-class fungsional yang mengubah cara kita menulis stylesheet (semuanya berstatus **Baseline Widely Available**):

### A. `:is()` dan `:where()`: Mengelompokkan Selektor Tanpa Pengulangan
Sebelum ada `:is()`, memilih `h1`, `h2`, dan `h3` di dalam `article`, `section`, atau `aside` mengharuskan Anda menulis 9 baris selektor yang berulang. Kini cukup satu baris:

```css
/* Jauh lebih ringkas daripada menulis 9 kombinasi satu per satu */
:is(article, section, aside) :is(h1, h2, h3) {
  line-height: 1.25;
  color: #0f172a;
}
```

**Perbedaan Krusial antara `:is()` dan `:where()`:**
- **`:is(...)`** mengambil nilai **spesifisitas tertinggi** dari daftar argumen di dalamnya.
- **`:where(...)`** selalu memiliki **spesifisitas nol (`0, 0, 0`)**! Ini membuat `:where()` sangat ideal untuk menulis gaya dasar (*reset* atau *default library*) yang mudah ditimpa oleh kelas CSS biasa tanpa pertarungan spesifisitas.

### B. `:has()` — Selektor Relasional ("Parent Selector")
Selama lebih dari 20 tahun, CSS tidak bisa memilih elemen induk berdasarkan isi anaknya. Hadirnya **`:has()`** (status **Baseline Widely Available** sejak Desember 2023) memungkinkan kita menata elemen berdasarkan kondisi anak atau adiknya:

```css
/* 1. Beri tata letak dua kolom pada .kartu HANYA JIKA di dalamnya ada elemen <img> */
.kartu:has(> img) {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
}

/* 2. Ubah warna label dan bingkai pembungkus jika input di dalamnya sedang fokus */
.kelompok-input:has(input:focus-visible) {
  border-color: #2563eb;
  background-color: #eff6ff;
}

/* 3. Kurangi jarak bawah h2 jika tepat di bawahnya terdapat subjudul p.subjudul */
h2:has(+ p.subjudul) {
  margin-block-end: 0.25rem;
}
```

## 4. Pseudo-Element (`::before`, `::after`, `::selection`, `::marker`)

Perhatikan penggunaan **dua titik dua (`::`)** untuk membedakan *pseudo-element* (memilih bagian tertentu dari elemen atau menyisipkan kotak semu) dari *pseudo-class* (`:`):
- **`::first-line` & `::first-letter`:** Menata baris pertama atau huruf pertama paragraf (*drop cap*).
- **`::marker`:** Menata warna atau bentuk titik/angka pada daftar `<li>` dan panah pada `<summary>`.
- **`::before` & `::after`:** Menyisipkan elemen semu dekoratif di awal atau akhir isi elemen (wajib memiliki properti `content: ""`).

> **⚠️ Aturan Aksesibilitas `::before` dan `::after`:**
> Jangan menyisipkan informasi tekstual yang penting hanya melalui `content: "..."` pada `::before`/`::after`, karena teks di dalam properti CSS `content` tidak dapat dipilih (*copy-paste*) oleh pengguna dan perlakuannya tidak selalu seragam di semua alat bantu. Gunakan untuk hiasan visual, ikon pendamping, atau bentuk geometris.

## Latihan Praktik: Menata Komponen Kartu dan Daftar Tanpa Kelas Berlebihan

Buatlah berkas `selektor-modern.html` dan `style.css` yang menerapkan aturan berikut:
1. Gunakan `:where(ul, ol)` untuk mereset padding daftar dengan spesifisitas nol.
2. Gunakan `:nth-child(odd)` untuk memberi warna latar belang (*zebra striping*) pada baris tabel `tbody tr`.
3. Gunakan `.kartu:has(input[type="checkbox"]:checked)` agar seluruh kartu otomatis berubah warna bingkai dan latarnya saat kotak centang di dalamnya dicentang—murni dengan CSS tanpa JavaScript!

## Kuis Pemahaman

### Soal 1
Apa perbedaan utama antara pseudo-class `:is(.utama, #khusus)` dan `:where(.utama, #khusus)`?
- A. `:is()` hanya bekerja pada elemen `<div>`, sedangkan `:where()` bekerja pada semua elemen.
- B. `:is()` mengambil bobot spesifisitas tertinggi dari argumen di dalamnya (yaitu spesifisitas ID `#khusus`), sedangkan `:where()` selalu menghasilkan bobot spesifisitas nol (`0, 0, 0`).
- C. `:where()` sudah dihapus dari standar CSS, sedangkan `:is()` masih didukung.
- D. `:is()` memilih elemen anak, sedangkan `:where()` memilih elemen induk.

**Jawaban Benar:** B
**Penjelasan:** Baik `:is()` maupun `:where()` memilih himpunan elemen yang sama persis. Perbedaannya terletak pada perhitungan spesifisitas: `:is()` mengadopsi spesifisitas argumen paling spesifik di dalam kurungnya, sementara `:where()` selalu bernilai spesifisitas nol sehingga sangat mudah ditimpa oleh aturan CSS berikutnya.

### Soal 2
Manakah selektor CSS yang tepat untuk memilih elemen `<figure>` **hanya jika** di dalamnya terdapat elemen `<figcaption>`?
- A. `figure > figcaption`
- B. `figure:is(figcaption)`
- C. `figure:has(figcaption)`
- D. `figcaption < figure`

**Jawaban Benar:** C
**Penjelasan:** Selektor `figure > figcaption` akan memilih elemen `<figcaption>`-nya, bukan elemen induk `<figure>`. Untuk memilih elemen `<figure>` berdasarkan keberadaan `<figcaption>` di dalamnya, kita menggunakan pseudo-class relasional `figure:has(figcaption)`.

### Soal 3
Elemen manakah yang akan dipilih oleh selektor atribut `a[href^="https://"][href$=".zip"]`?
- A. Semua tautan yang menggunakan protokol HTTPS **atau** berakhiran `.zip`.
- B. Hanya tautan `<a>` yang atribut `href`-nya diawali dengan `https://` **sekaligus** diakhiri dengan `.zip`.
- C. Semua tautan yang berada di dalam berkas ZIP.
- D. Tautan yang tidak memiliki protokol HTTPS.

**Jawaban Benar:** B
**Penjelasan:** Ketika beberapa selektor atribut digandengkan tanpa spasi (`[attr1][attr2]`), keduanya bekerja sebagai kondisi logika DAN (*AND*): elemen harus memenuhi awalan `https://` (`^=`) sekaligus akhiran `.zip` (`$=`).

## Sumber
- [CSS selectors — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Selectors)
- [CSS selectors and combinators — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Selectors/Selectors_and_combinators)
- [Basic CSS selectors — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Basic_selectors)
