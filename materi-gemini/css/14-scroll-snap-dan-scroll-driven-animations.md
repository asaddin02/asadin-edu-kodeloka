# Pengalaman Gulir Modern: `scroll-snap`, `overscroll-behavior`, dan Scroll-Driven Animations

- **Tingkat:** Lanjut
- **Ringkasan:** Membangun galeri geser (*carousel*) yang mulus tanpa JavaScript menggunakan CSS Scroll Snap (`scroll-snap-type`, `scroll-snap-align`), mencegah kebocoran guliran modal dengan `overscroll-behavior`, serta mengenal animasi berbasis posisi gulir (`animation-timeline`).

## 1. Membuat Karusel & Galeri Geser Murni CSS dengan `scroll-snap`

Dulu, membuat deretan kartu horizontal yang ketika digeser dengan jari di layar ponsel otomatis berhenti tepat di tengah atau di tepi kartu (*carousel / slider*) mengharuskan kita memuat pustaka JavaScript berat yang menyadap event `touchmove` dan `scroll`.

Kini, **CSS Scroll Snap** (status **Baseline Widely Available**) menangani seluruh fisika kelembaman dan penguncian posisi gulir tersebut langsung di tingkat *compositor thread* peramban dengan sangat mulus!

Hanya butuh dua langkah:
1. **Pada Wadah Pembungkus yang Bisa Digulir (*Scroll Container*):** Pasang `overflow-x: auto` dan **`scroll-snap-type: x mandatory`** (atau `y proximity` untuk arah vertikal).
2. **Pada Setiap Anak Kartu di Dalamnya:** Pasang **`scroll-snap-align: start`** (atau `center` / `end`).

```css
/* 1. Wadah Galeri Horizontal */
.rel-kartu {
  display: grid;
  grid-auto-flow: column;
  /* Setiap kartu memiliki lebar 85% layar di ponsel, atau maksimal 320px di layar lebar */
  grid-auto-columns: min(85%, 320px);
  gap: 1rem;
  overflow-x: auto;
  padding-block-end: 1rem;

  /* Mengaktifkan penguncian gulir horizontal secara wajib (mandatory) */
  scroll-snap-type: x mandatory;
  /* Memberi jarak aman di kiri agar kartu pertama tidak terlalu mepet ke tepi layar */
  scroll-padding-inline-start: 1rem;
}

/* 2. Setiap Item Kartu di Dalam Rel */
.rel-kartu > article {
  scroll-snap-align: start;
  /* Mencegah pengguna melompati banyak kartu sekaligus saat menggeser terlalu cepat di ponsel */
  scroll-snap-stop: always;
}
```

### Perbedaan `mandatory` vs `proximity` pada `scroll-snap-type`
- **`mandatory`:** Peramban **wajib selalu mengunci** posisi berhenti tepat pada salah satu titik kartu begitu pengguna selesai menggulir. Sangat cocok untuk galeri foto atau deretan kartu horizontal (`overflow-x: auto`).
- **`proximity`:** Peramban hanya mengunci posisi jika guliran pengguna kebetulan berhenti **di dekat** titik *snap* (jika berhenti di tengah-tengah paragraf panjang, pengguna tidak dipaksa melompat). Jauh lebih aman untuk pengguliran halaman utama secara vertikal (`y`)!

## 2. Mengatur Jarak Tautan Jangkar (`scroll-margin`) dan Mengunci Bocoran Gulir (`overscroll-behavior`)

### A. `scroll-margin-top` (atau `scroll-margin-block-start`)
Saat pengguna mengeklik tautan daftar isi `<a href="#bab-3">`, peramban menggulir `#bab-3` hingga menempel persis di bibir atas layar (`0px`). Jika situs Anda memiliki `<header>` yang `position: sticky` setinggi `4rem`, maka judul `#bab-3` akan tertutup oleh header tersebut!

Solusinya: berikan **`scroll-margin-block-start: 5rem;`** pada semua elemen yang memiliki atribut `id`:

```css
[id] {
  scroll-margin-block-start: 5rem;
}
```

### B. `overscroll-behavior: contain`
Pernahkah Anda menggulir daftar panjang di dalam sebuah kotak `<dialog>` atau panel menu samping (*sidebar*), lalu ketika gulirannya sudah mencapai ujung paling bawah daftar, tiba-tiba **halaman utama di belakangnya ikut bergerak tergulir (*scroll chaining*)**?

Satu baris properti **`overscroll-behavior: contain`** (nilai `contain` didukung semua peramban utama: Chrome 63, Firefox 59, Safari 16; halaman MDN menandai properti ini *Limited availability* hanya karena nilai `chain` yang baru) menghentikan rantai guliran tersebut agar tetap terkurung di dalam panel/dialog tanpa membocorkannya ke halaman belakang!

```css
.panel-notifikasi,
dialog {
  overflow-y: auto;
  overscroll-behavior: contain;
}
```

## 3. Animasi yang Dikendalikan oleh Posisi Gulir (*Scroll-Driven Animations*)

Di masa lalu, membuat **Bilah Kemajuan Baca (*Reading Progress Bar*)** di bagian paling atas artikel yang memanjang dari `0%` ke `100%` seiring pengguna menggulir halaman ke bawah mengharuskan kita menjalankan `window.addEventListener("scroll", ...)` di utas utama JavaScript pada setiap piksel guliran.

CSS modern memperkenalkan **Scroll-Driven Animations** melalui properti **`animation-timeline`** (didukung di Chrome/Edge sejak versi 115 dan Safari 26; di Firefox baru tersedia mulai versi 159, yang saat ini masih beta, sehingga gunakan secara progresif dengan `@supports`):
- **`scroll()`:** Mengikat kemajuan `@keyframes` (`0%` hingga `100%`) langsung ke posisi gulir sebuah *scroll container* (seperti halaman `root`), bukan ke waktu detik!
- **`view()`:** Mengikat kemajuan `@keyframes` ke posisi sebuah elemen saat elemen tersebut mulai masuk hingga keluar dari jendela pandang (*viewport*, mirip `IntersectionObserver` tetapi untuk animasi CSS murni!).

```css
@keyframes rentangkan-progres {
  from { scale: 0 1; }
  to   { scale: 1 1; }
}

/* Bilah kemajuan baca artikel di bagian paling atas layar — 0 baris JavaScript! */
@supports (animation-timeline: scroll()) {
  .bilah-kemajuan-baca {
    position: fixed;
    inset-block-start: 0;
    inset-inline: 0;
    block-size: 4px;
    background-color: #2563eb;
    transform-origin: 0% 50%;
    animation: rentangkan-progres linear;
    /* Mengikat timeline animasi ke guliran vertikal dokumen root! */
    animation-timeline: scroll(root block);
  }
}
```

## Latihan Praktik: Membangun Rel Katalog Geser dan Bilah Kemajuan Baca

Buatlah berkas `scroll-modern.html` dan `scroll.css`:
1. Buat komponen `.rel-katalog` horizontal yang berisi 6 kartu kelas menggunakan `scroll-snap-type: x mandatory` dan `scroll-snap-align: start`.
2. Pasang `scroll-margin-block-start: 5rem` pada setiap `<section id="...">` di artikel.
3. Tambahkan `.bilah-kemajuan-baca` dengan `@supports (animation-timeline: scroll())` dan pastikan tetap menghormati `@media (prefers-reduced-motion: reduce)`.

## Kuis Pemahaman

### Soal 1
Kombinasi properti CSS manakah yang diperlukan untuk membuat wadah horizontal `.galeri` dan elemen anak `.item` di dalamnya mengunci posisi berhenti tepat di awal setiap kartu saat digeser oleh pengguna?
- A. `scroll-snap-align: start` pada `.galeri`, dan `scroll-snap-type: x mandatory` pada `.item`.
- B. `overflow-x: auto; scroll-snap-type: x mandatory;` pada wadah induk `.galeri`, dan `scroll-snap-align: start;` pada elemen anak `.item`.
- C. `position: sticky` pada `.galeri`, dan `float: left` pada `.item`.
- D. `overscroll-behavior: none` pada `.item`.

**Jawaban Benar:** B
**Penjelasan:** Properti `scroll-snap-type` selalu dipasang pada wadah pengguliran (*scroll container* yang memiliki `overflow: auto/scroll`), sedangkan `scroll-snap-align` dipasang pada elemen-elemen anak di dalamnya untuk menentukan titik penjajaran masing-masing item.

### Soal 2
Masalah antarmuka apa yang diselesaikan oleh deklarasi `overscroll-behavior: contain;` pada sebuah panel menu samping yang dapat digulir (`overflow-y: auto`)?
- A. Menyembunyikan batang *scrollbar* sepenuhnya dari layar.
- B. Mencegah fenomena *scroll chaining*, yaitu ikut tergulirnya halaman utama di latar belakang ketika pengguna sudah mencapai batas paling atas atau paling bawah dari guliran di dalam panel samping tersebut.
- C. Memaksa panel samping hanya bisa digulir menggunakan tombol panah papan ketik.
- D. Mengembalikan posisi gulir ke paling atas setiap 5 detik.

**Jawaban Benar:** B
**Penjelasan:** Secara bawaan, ketika sebuah kotak bersarang mencapai ujung gulirannya, sisa momentum guliran diteruskan ke elemen induk atau halaman utama (*scroll chaining*). `overscroll-behavior: contain` mengisolasi momentum gulir agar berhenti di batas kotak tersebut.

### Soal 3
Mengapa kita memasang `scroll-margin-block-start: 5rem;` pada elemen judul `<h2 id="bab-1">` ketika halaman memiliki bilah navigasi atas yang bersifat `position: sticky`?
- A. Untuk menambah jarak putih permanen sebesar `5rem` di antara semua paragraf.
- B. Untuk memberi jarak aman (*offset*) di bagian atas target ketika peramban menggulir menuju tautan `#bab-1`, sehingga judul `<h2>` tidak berhenti tersembunyi di balik bilah navigasi `sticky`.
- C. Untuk mempercepat animasi `scroll-behavior: smooth`.
- D. Agar elemen `<h2>` ikut menjadi `position: sticky`.

**Jawaban Benar:** B
**Penjelasan:** Berbeda dengan `margin-top` biasa yang mengubah tata letak aliran halaman, `scroll-margin-top` (atau logis `scroll-margin-block-start`) hanya memberi bantalan jarak tambahan terhadap titik henti kotak pandang saat peramban menggulir ke elemen target `#id` atau *scroll snap*.

## Sumber
- [CSS scroll snap — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap)
- [Basic concepts of scroll snap — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap/Basic_concepts)
- [CSS: Cascading Style Sheets — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS)
