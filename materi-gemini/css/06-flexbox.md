# Tata Letak Satu Dimensi dengan Flexbox

- **Tingkat:** Menengah
- **Ringkasan:** Menguasai model Flexible Box Layout (Flexbox) melalui konsep dua poros (*Main Axis* dan *Cross Axis*), perataan dan distribusi ruang, properti `gap`, perhitungan `flex-grow`, `flex-shrink`, dan `flex-basis`, serta pola antarmuka nyata.

## Kapan Menggunakan Flexbox?

**Flexbox (*Flexible Box Layout*)** dirancang untuk mengatur tata letak dalam **satu dimensi pada satu waktu**—baik sebagai satu baris horizontal (`row`) maupun satu kolom vertikal (`column`).

Gunakan Flexbox ketika Anda ingin:
- Menyusun bilah navigasi (logo di kiri, deretan menu di kanan).
- Menyejajarkan ikon dengan teks di dalam tombol atau lencana.
- Membagi ruang sisa di antara sekumpulan komponen yang ukurannya dinamis.
- Memaksa kaki kartu (*card footer*) selalu menempel rata di bagian paling bawah kartu meskipun panjang teks tiap kartu berbeda.

Begitu Anda menulis **`display: flex`** pada sebuah elemen:
1. Elemen tersebut menjadi **Flex Container** (wadah flex).
2. Seluruh **anak langsung (*direct children*)** di dalamnya otomatis menjadi **Flex Items**. (Cucu di dalam anak tidak ikut menjadi flex item kecuali anaknya juga diberi `display: flex`).

## 1. Memahami Dua Poros Flexbox: *Main Axis* dan *Cross Axis*

Kunci utama agar Anda tidak pernah bingung antara `justify-content` dan `align-items` adalah memahami bahwa Flexbox bekerja berdasarkan **dua poros yang saling tegak lurus**:

```
A. Saat flex-direction: row (Bawaan):
   Main Axis (Poros Utama)  ===> Horizontal (Kiri ke Kanan)
   Cross Axis (Poros Silang) ===> Vertikal (Atas ke Bawah)

   +-------------------------------------------------------+
   |  [ Item 1 ]     [ Item 2 ]     [ Item 3 ]             |  <-- justify-content mengatur
   |                                                       |      sepanjang Main Axis (Horizontal)
   +-------------------------------------------------------+
         ^
         |-- align-items mengatur sepanjang Cross Axis (Vertikal)


B. Saat flex-direction: column:
   Main Axis (Poros Utama)  ===> Vertikal (Atas ke Bawah)
   Cross Axis (Poros Silang) ===> Horizontal (Kiri ke Kanan)
```

### Aturan Menghafal Perataan di Flexbox:
- **`justify-content`** SELALU mengatur distribusi di sepanjang **Main Axis (Poros Utama)**:
  - `flex-start` (awal poros), `center` (tengah), `flex-end` (ujung poros)
  - `space-between` (item pertama dan terakhir menempel di ujung, ruang kosong dibagi rata di tengah)
  - `space-around` / `space-evenly`
- **`align-items`** SELALU mengatur perataan di sepanjang **Cross Axis (Poros Silang)**:
  - `stretch` (bawaan: merentangkan tinggi item agar sama tinggi dengan kontainer)
  - `center` (rata tengah secara tegak lurus — sangat sering dipakai untuk menyejajarkan ikon dan teks!)
  - `flex-start`, `flex-end`, `baseline` (sejajar garis dasar huruf teks).

## 2. Membungkus Baris (`flex-wrap`) dan Mengatur Jarak (`gap`)

Secara bawaan, Flexbox berusaha memaksakan semua anak masuk ke dalam satu baris tunggal (`flex-wrap: nowrap`), bahkan jika harus menyempitkan item-item tersebut. Jika Anda ingin item turun ke baris baru saat ruang tidak lagi cukup, tambahkan **`flex-wrap: wrap`**.

Untuk memberi jarak antar-item di dalam Flexbox, **jangan lagi menggunakan trik margin negatif lama**; gunakan properti **`gap`** (serta `row-gap` dan `column-gap`, berstatus **Baseline Widely Available**):

```css
.daftar-tag {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem; /* 0.5rem jarak antar-baris, 0.75rem jarak antar-kolom */
  align-items: center;
}
```

Keunggulan `gap` dibandingkan `margin`: jarak `gap` **hanya disisipkan di antara item yang bertetangga**, tidak pernah bocor menambahkan jarak ekstra di tepi luar kontainer!

## 3. Mengendalikan Ukuran Flex Item: `flex-grow`, `flex-shrink`, dan `flex-basis`

Ketiga properti ini dipasang pada **anak (Flex Item)**, bukan pada wadah induknya, dan hampir selalu ditulis menggunakan singkatan **`flex: <grow> <shrink> <basis>`**:

1. **`flex-basis` (Ukuran Awal Ideal):** Ukuran awal item di sepanjang *Main Axis* sebelum ruang kosong dibagi atau ruang sempit dipangkas (bawaannya `auto`, yaitu mengikuti `width`/`height` atau isi kontennya).
2. **`flex-grow` (Faktor Tumbuh):** Menentukan apakah item boleh membesar menyerap ruang kosong yang tersisa di dalam kontainer (bawaannya `0` = tidak ikut membesar).
3. **`flex-shrink` (Faktor Susut):** Menentukan apakah item boleh menyusut ketika ruang kontainer lebih sempit dari jumlah ukuran item (bawaannya `1` = boleh menyusut).

### Tiga Nilai Singkatan `flex` yang Wajib Anda Hafal

| Deklarasi Singkatan | Ekivalen Lengkap | Perilaku Praktis |
|---|---|---|
| `flex: initial` (bawaan) | `flex: 0 1 auto` | Ukuran mengikuti kontennya; tidak tumbuh jika ada ruang sisa, tetapi mau menyusut jika layar sempit. |
| **`flex: 1`** | `flex: 1 1 0%` | Semua item dengan `flex: 1` berbagi ruang secara **sama rata** dari titik dasar `0%` tanpa peduli panjang pendek teks awalnya. |
| **`flex: auto`** | `flex: 1 1 auto` | Item ikut tumbuh menyerap ruang sisa, namun ukuran dasarnya tetap mempertimbangkan panjang konten masing-masing. |
| **`flex: none`** | `flex: 0 0 auto` | Kaku: ukuran mengikuti konten/width, **dilarang tumbuh dan dilarang menyusut** (wajib dipasang pada ikon atau avatar agar tidak gepeng tertekan teks panjang!). |

## 4. Tiga Pola Komponen Dunia Nyata dengan Flexbox

```css
/* Pola 1: Bilah Navigasi (Logo di kiri, Menu di tengah, Tombol Masuk mendorong ke ujung kanan) */
.navbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.navbar .tombol-masuk {
  /* margin-inline-start: auto pada flex item akan menyerap seluruh ruang kosong di kirinya! */
  margin-inline-start: auto;
}

/* Pola 2: Kartu dengan Tinggi Seragam dan Tombol Selalu Rata di Dasar Bawah */
.kartu {
  display: flex;
  flex-direction: column;
}
.kartu .kaki-kartu {
  margin-block-start: auto; /* Mendorong kaki kartu ke ujung paling bawah */
  padding-block-start: 1rem;
}

/* Pola 3: Mencegah Ikon SVG Gepeng di Samping Teks Panjang */
.item-fitur {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}
.item-fitur svg {
  flex-shrink: 0; /* Ikon tidak akan pernah menyusut meskipun teks di sebelahnya panjang */
}
```

> **⚠️ Jebakan Klasik Flexbox: Teks Panjang atau `<pre>` yang Merusak Lebar Flex Item**
> Secara bawaan, setiap flex item memiliki nilai `min-width: auto` (tidak mau menyusut lebih kecil dari kata terpanjang atau blok `<pre>` di dalamnya). Akibatnya, jika di dalam kolom `flex: 1` terdapat `<pre><code>` yang lebar atau teks dengan `text-overflow: ellipsis`, kolom tersebut justru membengkak menembus layar!
> **Solusinya:** Tambahkan **`min-width: 0`** (atau `min-inline-size: 0`) pada flex item tersebut agar ia diizinkan menyusut mengikuti batas kontainernya.

## Latihan Praktik: Membangun Bilah Navigasi dan Deretan Kartu Fitur

Buatlah berkas `flexbox-komponen.html` dan `flexbox.css` yang berisi:
1. Sebuah `<header class="navbar">` yang menyejajarkan logo di kiri, tautan navigasi di tengah, dan tombol aksi di ujung kanan menggunakan `display: flex`, `align-items: center`, `gap`, dan `margin-inline-start: auto`.
2. Tiga kartu fitur berdampingan di mana salah satu kartu memiliki 4 baris paragraf sementara dua kartu lainnya hanya 1 baris paragraf, namun tombol *"Pelajari Modul"* di bagian bawah ketiga kartu tetap sejajar rata di garis dasar yang sama menggunakan `flex-direction: column` dan `margin-block-start: auto`.

## Kuis Pemahaman

### Soal 1
Ketika sebuah kontainer memiliki aturan `display: flex; flex-direction: column;`, properti manakah yang digunakan untuk meratakan item-item di dalamnya ke tengah secara **horizontal**?
- A. `justify-content: center`
- B. `align-items: center`
- C. `text-align: center`
- D. `vertical-align: middle`

**Jawaban Benar:** B
**Penjelasan:** Ketika `flex-direction` diubah menjadi `column`, poros utama (*Main Axis*) menjadi vertikal (atas ke bawah) dan poros silang (*Cross Axis*) menjadi horizontal (kiri ke kanan). Karena `align-items` selalu bekerja pada *Cross Axis*, maka `align-items: center` yang akan meratakan item secara horizontal.

### Soal 2
Di dalam sebuah komponen notifikasi `display: flex`, terdapat sebuah ikon `<svg>` berukuran `24×24` piksel di sebelah kiri dan paragraf pesan panjang di sebelah kanan. Di layar ponsel yang sempit, ikon `<svg>` tersebut tampak tergencet menjadi elips sempit. Deklarasi CSS apakah yang harus ditambahkan pada `<svg>` tersebut?
- A. `flex-grow: 1`
- B. `flex-shrink: 0` (atau `flex: none`)
- C. `align-self: stretch`
- D. `flex-wrap: wrap`

**Jawaban Benar:** B
**Penjelasan:** Nilai bawaan `flex-shrink` pada setiap flex item adalah `1`, yang berarti peramban diizinkan menyusutkan semua anak (termasuk ikon) saat ruang horizontal kurang. Memberikan `flex-shrink: 0` atau `flex: none` pada ikon melarang peramban menyusutkan lebar ikon tersebut.

### Soal 3
Apa penyebab sebuah flex item dengan `flex: 1` menolak menyusut dan justru meluber menembus batas kontainernya ketika di dalamnya terdapat elemen `<pre>` atau kata URL yang sangat panjang?
- A. Karena Flexbox tidak mengizinkan elemen `<pre>` sebagai anak.
- B. Karena nilai bawaan `min-width` pada flex item adalah `auto` (mengikuti lebar minimum intrinsik kontennya), sehingga perlu diberi `min-width: 0` (atau `min-inline-size: 0`) agar diizinkan menyusut.
- C. Karena properti `gap` terlalu besar.
- D. Karena kontainer induk belum diberi `position: relative`.

**Jawaban Benar:** B
**Penjelasan:** Spesifikasi Flexbox menetapkan `min-width: auto` pada flex item demi mencegah teks terpotong secara tidak sengaja. Namun, jika di dalam item terdapat elemen dengan `overflow-x: auto` (seperti `<pre>`) atau `text-overflow: ellipsis`, Anda harus menetapkan `min-width: 0` pada flex item agar batas lebarnya dipatuhi.

## Sumber
- [Basic concepts of flexbox — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts)
- [Typical use cases of flexbox — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Use_cases)
- [CSS flexible box layout — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout)
