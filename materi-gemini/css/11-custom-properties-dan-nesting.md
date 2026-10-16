# Custom Properties (Variabel CSS), `@property`, `light-dark()`, dan CSS Nesting

- **Tingkat:** Lanjut
- **Ringkasan:** Membangun sistem token desain yang dinamis menggunakan variabel CSS (`--*` dan `var()`), mendefinisikan tipe variabel dengan `@property`, menerapkan tema terang dan gelap otomatis dengan `light-dark()`, serta menulis aturan bersarang dengan CSS Nesting bawaan.

## 1. Variabel CSS (*Custom Properties*): Lebih Cerdas daripada Variabel Preprocessor

Sebelum CSS memiliki variabel bawaan, pengembang menggunakan variabel Sass/LESS (`$warna-utama`). Namun, variabel Sass hanyalah teks yang diganti saat kompilasi (*compile-time*) dan hilang sepenuhnya ketika berkas CSS sampai di peramban.

Sebaliknya, **CSS Custom Properties (`--nama-variabel`)** hidup langsung di dalam pohon DOM peramban (*runtime*):
1. **Mengikuti Kaskade dan Pewarisan DOM:** Variabel yang didefinisikan pada `:root` tersedia di seluruh halaman, tetapi dapat ditimpa khusus untuk satu komponen (misalnya `.kartu-bahaya { --warna-aksen: red; }`) tanpa mengubah elemen lain!
2. **Dapat Diubah lewat `@media` maupun JavaScript:** Anda cukup mengubah nilai variabel di dalam `@media` atau lewat `elemen.style.setProperty("--progres", "80%")`, dan seluruh elemen yang memakainya langsung diperbarui secara reaktif.

```css
:root {
  --spasi-dasar: 1rem;
  --radius-kartu: 0.75rem;
  --warna-aksen: oklch(55% 0.2 255);
}

.kartu {
  /* Fungsi var() menerima parameter kedua sebagai nilai cadangan (fallback)
     jika variabel pertama belum didefinisikan */
  padding: var(--spasi-kartu, var(--spasi-dasar));
  border-radius: var(--radius-kartu);
  border: 2px solid var(--warna-aksen);
}

/* Cukup ubah nilai variabelnya saja untuk variasi komponen! */
.kartu-peringatan {
  --warna-aksen: oklch(65% 0.18 55);
  --spasi-kartu: 1.5rem;
}
```

## 2. Tema Terang dan Gelap Modern dengan `color-scheme` dan `light-dark()`

Membangun dukungan mode terang (*Light Mode*) dan mode gelap (*Dark Mode*) kini jauh lebih bersih berkat kombinasi properti **`color-scheme`** dan fungsi **`light-dark()`** (status **Baseline Newly Available** sejak Mei 2024):

1. **`color-scheme: light dark;`** pada `:root` memberi tahu peramban agar menyesuaikan tampilan bawaan bilah gulir (*scrollbar*), kotak kontrol formulir, dan latar belakang bawaan dengan tema sistem operasi pengguna.
2. **`light-dark(nilai-terang, nilai-gelap)`** secara otomatis mengembalikan argumen pertama saat tema aktif adalah terang, dan argumen kedua saat tema aktif adalah gelap—tanpa perlu menduplikasi seluruh variabel di dalam `@media (prefers-color-scheme: dark)`!

```css
:root {
  /* Aktifkan dukungan kedua skema warna */
  color-scheme: light dark;

  /* Definisikan token warna semantik dalam satu tempat yang rapi */
  --latar-halaman: light-dark(oklch(98% 0.005 250), oklch(16% 0.015 250));
  --latar-kartu:   light-dark(oklch(100% 0 0),      oklch(22% 0.02 250));
  --teks-utama:    light-dark(oklch(20% 0.02 250),  oklch(95% 0.01 250));
  --teks-redup:    light-dark(oklch(45% 0.02 250),  oklch(72% 0.015 250));
  --garis-batas:   light-dark(oklch(88% 0.01 250),  oklch(32% 0.02 250));
}

/* Jika pengguna memilih tema secara manual lewat tombol di situs,
   kita cukup mengubah color-scheme pada elemen <html>! */
html[data-tema="terang"] { color-scheme: light; }
html[data-tema="gelap"]  { color-scheme: dark; }

body {
  background-color: var(--latar-halaman);
  color: var(--teks-utama);
}
```

## 3. Variabel Bertipe dengan `@property`

Secara bawaan, peramban menganggap isi variabel `--*` sebagai string teks bebas, sehingga peramban tidak tahu cara menganimasikan variabel yang berada di dalam `linear-gradient()` atau memeriksa apakah nilai variabel yang dimasukkan sudah benar.

Aturan **`@property`** (status **Baseline Newly Available** sejak Juli 2024) memungkinkan Anda mendaftarkan variabel CSS lengkap dengan **tipe data (`syntax`)**, **apakah diwariskan (`inherits`)**, dan **nilai awalnya (`initial-value`)**:

```css
@property --sudut-gradien {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

.bingkai-kilau {
  background: linear-gradient(var(--sudut-gradien), #2563eb, #06b6d4);
  transition: --sudut-gradien 400ms ease;
}

.bingkai-kilau:hover {
  /* Karena --sudut-gradien terdaftar sebagai <angle>, peramban dapat
     menganimasikan perputaran sudut gradien ini secara mulus! */
  --sudut-gradien: 180deg;
}
```

## 4. CSS Nesting Bawaan (*Native CSS Nesting*)

Dulu, menulis aturan CSS bersarang (*nesting*) mengharuskan penggunaan preprocessor seperti Sass. Kini, **CSS Nesting bawaan** sudah berstatus **Baseline Widely Available** (sejak Desember 2023) dan dapat langsung dijalankan oleh semua peramban modern tanpa langkah kompilasi!

Di dalam CSS Nesting bawaan, simbol **`&`** mewakili selektor induk tempat aturan tersebut bersarang:

```css
.kartu-modul {
  padding: 1.5rem;
  border: 1px solid var(--garis-batas);
  border-radius: 0.75rem;
  background-color: var(--latar-kartu);

  /* 1. Bersarang untuk elemen anak (setara dengan .kartu-modul h3) */
  & h3 {
    margin-block-end: 0.5rem;
    font-size: 1.25rem;
  }

  /* 2. Bersarang untuk pseudo-class pada elemen itu sendiri (.kartu-modul:hover) */
  &:hover,
  &:focus-within {
    border-color: oklch(55% 0.2 255);
  }

  /* 3. Bersarang untuk @media atau @container langsung di dalam komponen! */
  @media (width >= 48rem) {
    padding: 2rem;
  }
}
```

> **⚠️ Dua Aturan Bijak Menggunakan CSS Nesting:**
> 1. **Batasi kedalaman maksimal 2–3 tingkat:** Jangan menyarangkan selektor hingga 5–6 tingkat dalam karena akan menaikkan spesifisitas dan mengikat CSS terlalu kaku pada struktur tag HTML.
> 2. **Tidak mendukung penggabungan nama string seperti Sass (`&-judul`):** Di CSS Nesting asli, menulis `&-judul` **tidak** akan menghasilkan `.kartu-modul-judul`. Gunakan `&` untuk pseudo-class (`&:hover`), modifier kelas (`&.aktif`), atau selektor anak (`& > .judul`).

## Latihan Praktik: Komponen Kartu dengan Saklar Tema Terang/Gelap dan Nesting

Buatlah berkas `variabel-nesting.html` dan `nesting.css`:
1. Definisikan variabel warna semantik di `:root` menggunakan `color-scheme: light dark` dan fungsi `light-dark()`.
2. Tulis gaya `.kartu-interaktif` menggunakan **CSS Nesting bawaan** (mencakup `& header`, `&:hover`, dan `@media (width >= 40rem)`).
3. Tambahkan tiga tombol sederhana (`Sistem`, `Terang`, `Gelap`) yang mengubah atribut `data-tema` pada `<html>` untuk menguji perpindahan tema secara langsung!

## Kuis Pemahaman

### Soal 1
Apa keuntungan utama dari *CSS Custom Properties* (`--warna-utama`) dibandingkan variabel preprocessor seperti Sass (`$warna-utama`)?
- A. Variabel CSS tidak memerlukan tanda titik koma di akhir baris.
- B. Variabel CSS hidup di dalam DOM peramban saat runtime, mengikuti aturan kaskade/pewarisan elemen, dan nilainya dapat diubah secara dinamis melalui `@media` query maupun JavaScript tanpa perlu mengompilasi ulang berkas CSS.
- C. Variabel CSS otomatis mengenkripsi kode warna agar tidak bisa dilihat di DevTools.
- D. Variabel CSS memiliki spesifisitas yang lebih tinggi daripada `!important`.

**Jawaban Benar:** B
**Penjelasan:** Variabel preprocessor habis diterjemahkan menjadi nilai statis sebelum dikirim ke peramban. Sebaliknya, variabel CSS (`--*`) dievaluasi secara langsung oleh peramban, mewarisi nilai dari induk ke anak di pohon DOM, dan dapat diperbarui kapan saja saat halaman sedang berjalan.

### Soal 2
Bagaimana cara kerja fungsi warna `light-dark(oklch(98% 0 0), oklch(15% 0 0))` di CSS modern?
- A. Mencampurkan kedua warna tersebut menjadi warna abu-abu rata-rata 50%.
- B. Memilih warna pertama ketika `color-scheme` efektif pada elemen tersebut adalah `light` (terang), dan memilih warna kedua ketika `color-scheme` efektifnya adalah `dark` (gelap).
- C. Mengubah warna latar dari terang di bagian atas menjadi gelap di bagian bawah seperti gradien.
- D. Hanya bekerja jika pengguna mengaktifkan mode kontras tinggi.

**Jawaban Benar:** B
**Penjelasan:** Fungsi `light-dark()` mengevaluasi skema warna aktif elemen (yang ditentukan oleh deklarasi `color-scheme: light dark` serta preferensi tema sistem operasi atau nilai `color-scheme` pada elemen induk) dan mengembalikan warna yang sesuai tanpa memerlukan blok `@media (prefers-color-scheme: dark)` terpisah.

### Soal 3
Mengapa aturan `@property` dibutuhkan apabila kita ingin menganimasikan sebuah variabel CSS (misalnya `--sudut`) yang dipakai di dalam `linear-gradient(var(--sudut), blue, cyan)`?
- A. Karena variabel biasa tidak boleh diawali dengan tanda `--`.
- B. Karena secara bawaan peramban memperlakukan variabel CSS sebagai token teks tanpa tipe, sehingga dengan mendaftarkan `syntax: "<angle>"` lewat `@property`, peramban memahami bahwa nilainya adalah sudut angka yang dapat diinterpolasi (dianimasikan) dari `0deg` ke `180deg`.
- C. Karena `linear-gradient` hanya menerima warna heksadesimal.
- D. Karena `@property` memindahkan eksekusi CSS ke sisi server.

**Jawaban Benar:** B
**Penjelasan:** Tanpa `@property`, peramban tidak mengetahui tipe matematis dari variabel `--sudut` sehingga perubahan nilainya dilakukan secara lompatan patah (diskrit) di tengah durasi transisi. Mendaftarkan `syntax: "<angle>"` memberi tahu mesin CSS cara menghitung nilai antaranya di setiap bingkai animasi.

## Sumber
- [CSS custom properties for cascading variables — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables)
- [Using CSS nesting — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting/Using)
- [`prefers-color-scheme` CSS media feature — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme)
