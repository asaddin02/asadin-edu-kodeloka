# Pola `subgrid` Tingkat Lanjut: Menyelaraskan Kartu, Formulir Grid, dan Tata Letak Makro

- **Tingkat:** Lanjut
- **Ringkasan:** Memanfaatkan `grid-template-columns: subgrid` dan `grid-template-rows: subgrid` agar elemen cucu di dalam komponen kartu maupun formulir tetap terkunci sejajar dengan kisi utama halaman.

## Mengapa Masih Perlu Subgrid?

Grid hanya mengatur **anak langsung** dari kontainernya. Cucu (anak dari item grid) berada di luar kisi, sehingga mereka tidak dapat sejajar dengan cucu lain di item tetangga. Akibatnya: judul kartu A tiga baris sedangkan kartu B satu baris, dan bagian-bagian di bawahnya tidak sejajar. **`subgrid`** memecahkan masalah ini dengan membuat sebuah item grid **meminjam jalur (baris atau kolom) dari grid induknya** alih-alih mendefinisikan jalurnya sendiri. Fitur ini berstatus **Baseline Widely Available** (lintas peramban sejak September 2023).

## 1. Aturan Dasar

```css
.induk {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem 1.5rem;
}

.anak {
  display: grid;                        /* wajib: anak juga harus kontainer grid */
  grid-column: span 1;
  grid-row: span 3;                     /* menempati 3 baris induk */
  grid-template-rows: subgrid;          /* meminjam ketiga baris itu */
}
```

Ketentuan penting:
- Elemen subgrid harus **item grid** dari induknya **dan** memiliki `display: grid` (atau `inline-grid`).
- Jumlah jalur yang dipinjam sama dengan jumlah jalur yang **direntangi** item (`grid-row: span 3` meminjam 3 baris).
- Anak-anak subgrid ikut menentukan ukuran jalur induk. Karena itu tinggi sebuah baris adalah tinggi terbesar di antara semua cucu pada baris itu, di semua kartu.
- Anda boleh memakai `subgrid` pada satu sumbu saja (`grid-template-rows: subgrid`) dan mendefinisikan sumbu lain sendiri.

## 2. Jarak (*Gap*), Padding, dan Nama Garis

- `gap` pada subgrid secara bawaan **mewarisi** gap induk. Bila Anda menulis `gap` sendiri, nilai itu menggantikannya untuk subgrid tersebut. Tulis `row-gap: 0` bila kartu tidak perlu jarak internal, tetapi ingat bahwa jarak antar-kartu tetap berasal dari induk.
- `padding`, `border`, dan `margin` pada elemen subgrid menambah ruang di tepi-tepi jalurnya sehingga ikut memengaruhi ukuran jalur induk.
- Garis bernama di induk tersedia pada subgrid, dan subgrid boleh menambah nama sendiri: `grid-template-columns: subgrid [awal-isi] [akhir-isi];`.

## 3. Pola 1: Kartu dengan Bagian yang Sejajar

```css
.katalog {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 1.5rem;
}

.kartu {
  display: grid;
  grid-row: span 3;                   /* judul, isi, kaki */
  grid-template-rows: subgrid;
  gap: 0.75rem;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
}
```

Baris pertama di setiap barisan kartu setinggi judul terpanjang pada barisan itu, baris kedua setinggi deskripsi terpanjang, dan seterusnya, sehingga semua kartu tampak sejajar.

## 4. Pola 2: Formulir dengan Label dan Input yang Sejajar

Setiap baris formulir adalah elemen terpisah (`.bidang`), tetapi kolom label harus selebar label terpanjang di seluruh formulir:

```css
.formulir {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);   /* kolom label dan kolom input */
  gap: 1rem 1.5rem;
}

.bidang {
  display: grid;
  grid-column: 1 / -1;                    /* membentang di kedua kolom induk */
  grid-template-columns: subgrid;         /* label di kolom 1, input di kolom 2 */
  align-items: center;
}
```

Tanpa subgrid, setiap `.bidang` akan memiliki lebar kolom label sendiri sehingga input tidak sejajar secara vertikal.

## 5. Pola 3: Tata Letak Makro dengan Komponen Bersarang

Komponen di dalam halaman dapat menyelaraskan isinya dengan kisi utama halaman, misalnya hero atau seksi lebar penuh:

```css
.halaman {
  display: grid;
  grid-template-columns:
    [penuh-awal] minmax(1rem, 1fr)
    [utama-awal] minmax(0, 70rem)
    [utama-akhir] minmax(1rem, 1fr)
    [penuh-akhir];
}

.seksi {
  display: grid;
  grid-column: penuh-awal / penuh-akhir;
  grid-template-columns: subgrid;        /* mewarisi tiga kolom + nama garisnya */
}
.seksi > * { grid-column: utama-awal / utama-akhir; }
.seksi > .pecah-keluar { grid-column: penuh-awal / penuh-akhir; }
```

Dengan cara ini, seksi dapat memiliki latar belakang selebar layar sementara teksnya tetap sejajar dengan kolom utama di seluruh halaman.

## Kesalahan Umum dan Cara Menghindarinya

1. **Lupa menambahkan `display: grid` pada elemen subgrid.** Tanpa itu, `subgrid` tidak berlaku.
2. **Tidak memberi `grid-row: span N` pada kartu.** Subgrid hanya meminjam jalur yang direntanginya; tanpa span, kartu hanya memiliki satu baris.
3. **Menaruh jumlah anak lebih banyak daripada jalur yang dipinjam.** Item ekstra membentuk baris implisit di dalam subgrid yang tidak memengaruhi induk; pastikan jumlah span sama dengan jumlah bagian.
4. **Menimpa `gap` tanpa sadar.** Menulis `gap: 0` pada subgrid menghilangkan jarak internal, sedangkan jarak antar-kartu tetap berasal dari induk.

## Latihan Praktik: Katalog Kelas dan Formulir Pendaftaran

Buatlah berkas `subgrid.html` dan `subgrid.css`:
1. Buat katalog 6 kartu (judul, deskripsi, kaki) dengan judul yang panjangnya berbeda-beda. Pakai `grid-row: span 3` dan `grid-template-rows: subgrid` sehingga semua bagian sejajar.
2. Buat formulir pendaftaran dengan `.bidang` yang memakai `grid-template-columns: subgrid`, lalu perpanjang satu label dan amati kolom label pada seluruh baris ikut melebar.
3. Buat seksi hero yang berlatar penuh tetapi teksnya sejajar dengan kolom utama memakai subgrid dan garis bernama.

## Kuis Pemahaman

### Soal 1
Syarat apakah yang harus dipenuhi sebuah elemen agar `grid-template-rows: subgrid` berlaku?
- A. Elemen harus memiliki `position: relative`.
- B. Elemen harus berupa item grid dari kontainer induknya dan sekaligus memiliki `display: grid`.
- C. Induknya harus memakai `display: flex`.
- D. Elemen harus memiliki tinggi tetap.

**Jawaban Benar:** B
**Penjelasan:** Subgrid meminjam jalur dari grid induk, sehingga elemennya harus menjadi item grid dari induk tersebut, dan juga harus menjadi kontainer grid sendiri (`display: grid` atau `inline-grid`).

### Soal 2
Kartu memiliki `grid-row: span 3; grid-template-rows: subgrid;`. Apa dampaknya pada tinggi baris-baris induk?
- A. Setiap baris induk setinggi isi terbesar di antara semua cucu pada baris tersebut di seluruh kartu, sehingga bagian kartu sejajar.
- B. Setiap kartu memiliki tinggi barisnya sendiri yang tidak memengaruhi kartu lain.
- C. Semua baris induk menjadi `0`.
- D. Baris-baris induk berubah menjadi kolom.

**Jawaban Benar:** A
**Penjelasan:** Cucu di dalam subgrid ikut menentukan ukuran jalur induk. Karena banyak kartu berbagi jalur baris yang sama, tinggi tiap baris menjadi tinggi terbesar dari seluruh cucu pada baris itu, dan bagian-bagian kartu menjadi sejajar.

### Soal 3
Pada `.bidang { display: grid; grid-column: 1 / -1; grid-template-columns: subgrid; }`, apa manfaat utamanya untuk formulir?
- A. Label otomatis menjadi tebal.
- B. Setiap `.bidang` mengatur kolom labelnya sendiri-sendiri.
- C. Lebar kolom label ditentukan oleh label terpanjang di seluruh formulir, sehingga semua input sejajar secara vertikal.
- D. Input berpindah ke atas label pada layar sempit.

**Jawaban Benar:** C
**Penjelasan:** Karena seluruh `.bidang` meminjam dua kolom yang sama dari formulir, ukuran kolom label ditentukan oleh isi terlebar di seluruh baris, dan input berada di kolom yang sama pada setiap baris.

## Sumber
- [Subgrid — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Subgrid)
- [`grid-template-columns` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-columns)
- [CSS Grid Layout Module Level 2 (Subgrids) — W3C](https://www.w3.org/TR/css-grid-2/#subgrids)
