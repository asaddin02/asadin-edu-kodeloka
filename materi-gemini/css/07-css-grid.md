# Tata Letak Dua Dimensi dengan CSS Grid dan `subgrid`

- **Tingkat:** Menengah
- **Ringkasan:** Merancang tata letak dua dimensi (baris dan kolom sekaligus) menggunakan CSS Grid, satuan fraksi (`fr`), `minmax()`, grid responsif otomatis (`auto-fit` vs `auto-fill`), `grid-template-areas`, hingga penyelarasan lintas kartu dengan `subgrid`.

## Perbedaan Filosofi CSS Grid vs Flexbox

Banyak pemula bertanya: *"Apakah CSS Grid menggantikan Flexbox?"* Jawabannya: **Tidak. Keduanya saling melengkapi.**

- **Flexbox bersifat *Content-First* (Satu Dimensi):** Anda membiarkan ukuran item menentukan bagaimana ruang dibagi dalam satu baris atau satu kolom.
- **CSS Grid bersifat *Layout-First* (Dua Dimensi):** Anda mendefinisikan cetak biru kolom dan baris secara bersamaan terlebih dahulu, lalu menempatkan elemen-elemen anak secara presisi ke dalam sel atau area kisi tersebut.

```text
Flexbox (Satu Dimensi - Tiap baris independen):
+---------------+ +---------------+ +---------------+
| Kartu 1       | | Kartu 2       | | Kartu 3       |
+---------------+ +---------------+ +---------------+
+-----------------------+ +-------------------------+
| Kartu 4 (Melebar)     | | Kartu 5 (Melebar)       |
+-----------------------+ +-------------------------+

CSS Grid (Dua Dimensi - Kolom dan baris terkunci rapi):
+---------------+ +---------------+ +---------------+
| Kartu 1       | | Kartu 2       | | Kartu 3       |
+---------------+ +---------------+ +---------------+
+---------------+ +---------------+ . . . . . . . . .
| Kartu 4       | | Kartu 5       | . (Kolom ke-3)  .
+---------------+ +---------------+ . . . . . . . . .
```

## 1. Mendefinisikan Jalur Grid: `fr`, `repeat()`, dan `minmax()`

Ketika Anda menetapkan `display: grid` pada wadah induk, Anda mendefinisikan kolom dengan `grid-template-columns` dan baris dengan `grid-template-rows`.

Satuan baru yang khusus hadir untuk CSS Grid adalah **`fr` (*fractional unit*)**, yang mewakili bagian dari **ruang kosong yang tersedia** di dalam kontainer grid (setelah dikurangi `gap` dan kolom berukuran tetap):

```css
.tata-letak-utama {
  display: grid;
  /* Kolom 1: lebar tetap 260px (sidebar)
     Kolom 2: mengambil 2 bagian ruang sisa (konten artikel)
     Kolom 3: mengambil 1 bagian ruang sisa (daftar isi kanan) */
  grid-template-columns: 260px 2fr 1fr;
  gap: 1.5rem;
}
```

### Mengapa `minmax(0, 1fr)` Penting?
Sama seperti Flexbox, nilai `1fr` sebenarnya adalah singkatan dari `minmax(auto, 1fr)`. Artinya, jika di dalam kolom `1fr` terdapat tabel lebar atau blok kode `<pre>`, kolom tersebut bisa membengkak melebihi proporsinya. Jika Anda ingin kolom tetap patuh pada ukurannya dan membiarkan `<pre>` di dalamnya yang memunculkan *scrollbar*, gunakan **`minmax(0, 1fr)`**!

## 2. Pola Paling Populer: Grid Kartu Responsif Tanpa `@media` (`auto-fit` vs `auto-fill`)

Dengan menggabungkan `repeat()`, `auto-fit` (atau `auto-fill`), dan `minmax()`, Anda dapat membuat kisi kartu katalog yang otomatis menambah atau mengurangi jumlah kolom sesuai lebar layar **tanpa menulis satu pun `@media` query**:

```css
.katalog-kelas {
  display: grid;
  /* Buat kolom sebanyak mungkin yang muat di layar;
     setiap kolom minimal selebar 280px (atau 100% jika layar < 280px),
     dan berbagi ruang sisa secara merata (1fr) */
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 1.5rem;
}
```

### Apa Bedanya `auto-fit` dan `auto-fill`?
Perbedaannya terlihat ketika jumlah kartu sedikit (misalnya hanya ada 2 kartu di layar monitor lebar yang sebenarnya muat 4 kolom):
- **`auto-fill`:** Tetap mempertahankan 4 slot kolom (2 kolom terisi kartu, dan 2 kolom di sebelah kanannya dibiarkan kosong berukuran `1fr`). Sangat cocok untuk katalog kartu agar lebar satu kartu tidak melar terlalu lebar saat hasil pencarian hanya 1 atau 2 item!
- **`auto-fit`:** Melipat (*collapse*) kolom kosong yang tidak terisi menjadi `0px`, sehingga 2 kartu yang ada akan melar membagi seluruh lebar kontainer menjadi masing-masing 50%.

## 3. Menempatkan Elemen dengan Nomor Garis dan `grid-template-areas`

### A. Penempatan Berdasarkan Garis Grid (*Grid Lines*)
Sebuah grid dengan **3 kolom** memiliki **4 garis vertikal** (bernomor `1`, `2`, `3`, `4` dari kiri ke kanan, atau `-1` untuk garis paling ujung kanan):

```text
Garis 1         Garis 2         Garis 3         Garis 4 (atau -1)
  |   Kolom 1     |   Kolom 2     |   Kolom 3     |
  +---------------+---------------+---------------+
```

```css
.kartu-unggulan {
  /* Merentang sebanyak 2 kolom dari posisi tempat ia berada */
  grid-column: span 2;
}

.spanduk-penuh {
  /* Merentang dari garis paling kiri (1) sampai garis paling ujung kanan (-1) */
  grid-column: 1 / -1;
}
```

### B. Penempatan Visual dengan `grid-template-areas`
Untuk merancang struktur halaman secara keseluruhan, `grid-template-areas` memungkinkan Anda "menggambar" denah tata letak langsung dengan teks di dalam CSS:

```css
.halaman-dasbor {
  display: grid;
  min-block-size: 100dvh;
  grid-template-columns: 240px minmax(0, 1fr);
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "navigasi kepala"
    "navigasi utama"
    "navigasi kaki";
}

.halaman-dasbor > header { grid-area: kepala; }
.halaman-dasbor > nav    { grid-area: navigasi; }
.halaman-dasbor > main   { grid-area: utama; }
.halaman-dasbor > footer { grid-area: kaki; }
```

## 4. Menyelaraskan Isi Antar-Kartu dengan `subgrid`

Pernahkah Anda membuat deretan kartu produk di mana setiap kartu memiliki: (1) Judul, (2) Deskripsi, dan (3) Harga + Tombol, tetapi karena judul Kartu A terdiri dari 3 baris sedangkan judul Kartu B hanya 1 baris, posisi kotak Harga dan Deskripsi antar-kartu menjadi tidak sejajar?

Sejak September 2023, **`subgrid`** berstatus **Baseline Widely Available** di semua peramban utama! Dengan `grid-template-rows: subgrid`, anak di dalam kartu dapat langsung menginduk dan mengunci barisnya ke jalur grid utama milik kontainer katalog:

```css
.katalog-produk {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.kartu-produk {
  display: grid;
  /* Setiap kartu meminjam 3 jalur baris (Judul, Isi, Kaki) dari grid induk */
  grid-row: span 3;
  grid-template-rows: subgrid;
  gap: 0.75rem;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
}
```

Hasilnya: semua judul kartu, semua paragraf deskripsi, dan semua kaki kartu yang berada di baris yang sama dijamin sejajar sempurna secara horizontal!

## Latihan Praktik: Membangun Katalog Kelas Kodeloka dengan `subgrid`

Buatlah berkas `grid-katalog.html` dan `grid.css` yang menampilkan 4 kartu kelas (HTML, CSS, JavaScript, PHP):
1. Kontainer `.katalog` menggunakan `repeat(auto-fill, minmax(min(100%, 260px), 1fr))`.
2. Setiap `.kartu` berisi tiga elemen anak (`<h3>` judul dengan panjang teks yang sengaja dibuat berbeda-beda, `<p>` deskripsi, dan `<footer>` jumlah modul).
3. Gunakan `grid-row: span 3` dan `grid-template-rows: subgrid` pada `.kartu` agar ketiga bagian di dalam seluruh kartu tampak sejajar rapi.

## Kuis Pemahaman

### Soal 1
Sebuah grid memiliki 4 kolom (`grid-template-columns: repeat(4, 1fr)`). Deklarasi manakah yang membuat sebuah elemen anak merentang penuh dari kolom pertama hingga kolom keempat (ujung paling kanan), bahkan jika suatu saat jumlah kolom di kontainer induk ditambah menjadi 6 kolom?
- A. `grid-column: 1 / 4;`
- B. `grid-column: 1 / -1;`
- C. `grid-column: span 3;`
- D. `grid-row: 1 / -1;`

**Jawaban Benar:** B
**Penjelasan:** Garis `1` adalah garis batas paling awal (kiri), sedangkan garis `-1` selalu merujuk pada garis batas terakhir dari *explicit grid* (Garis 5 pada 4 kolom, atau Garis 7 pada 6 kolom). Sementara itu, `grid-column: 1 / 4` hanya merentang dari Garis 1 sampai Garis 4 (yaitu baru mencakup 3 kolom).

### Soal 2
Apa perbedaan perilaku antara `repeat(auto-fill, minmax(250px, 1fr))` dan `repeat(auto-fit, minmax(250px, 1fr))` ketika sebuah wadah selebar `1200px` hanya berisi **satu** buah kartu?
- A. Pada `auto-fill`, kartu tersebut tetap berukuran sekitar `250px–300px` (karena 3 kolom kosong lainnya tetap dipertahankan); sedangkan pada `auto-fit`, kolom-kolom kosong dilipat menjadi `0px` sehingga satu kartu tersebut melar memenuhi seluruh lebar `1200px`.
- B. `auto-fill` membuat kartu menjadi dua baris, sedangkan `auto-fit` menyembunyikan kartu.
- C. `auto-fit` hanya bekerja di layar ponsel, sedangkan `auto-fill` hanya di desktop.
- D. Tidak ada perbedaan; keduanya selalu membuat satu kartu melar selebar `1200px`.

**Jawaban Benar:** A
**Penjelasan:** Keduanya sama-sama menyiapkan 4 slot kolom pada lebar `1200px`. Namun saat hanya ada 1 item, `auto-fill` membiarkan 3 slot kolom kosong tetap mengambil ruang `1fr`, sementara `auto-fit` melipat (*collapse*) kolom kosong menjadi `0px` dan membagi seluruh ruang `1fr` kepada item yang ada.

### Soal 3
Masalah tata letak apa yang diselesaikan oleh `grid-template-rows: subgrid` pada komponen kartu di dalam sebuah kisi katalog?
- A. Mengubah gambar di dalam kartu menjadi hitam-putih secara otomatis.
- B. Memungkinkan elemen-elemen di dalam masing-masing kartu (seperti judul, deskripsi, dan tombol) berbagi jalur baris yang sama dengan kartu-kartu tetangganya, sehingga tinggi bagian judul dan deskripsi antar-kartu sejajar rapi.
- C. Memindahkan kartu ke halaman baru secara otomatis jika lebih dari 10 item.
- D. Menggantikan fungsi atribut `alt` pada gambar.

**Jawaban Benar:** B
**Penjelasan:** Tanpa `subgrid`, grid di dalam sebuah kartu tidak mengetahui berapa tinggi judul pada kartu di sebelahnya. Dengan `grid-row: span 3` dan `grid-template-rows: subgrid`, anak-anak di dalam setiap kartu ikut menggunakan jalur baris milik grid induk sehingga posisinya sejajar sempurna dari kiri ke kanan.

## Sumber
- [Basic concepts of grid layout — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts)
- [Relationship of grid layout to other layout methods — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Relationship_with_other_layout_methods)
- [Auto-placement in grid layout — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Auto-placement)
- [Realizing common layouts using grids — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Common_grid_layouts)
