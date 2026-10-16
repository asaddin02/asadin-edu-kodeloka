# Desain Responsif, Sintaks `@media` Modern, dan Container Queries (`@container`)

- **Tingkat:** Menengah
- **Ringkasan:** Merancang halaman dan komponen yang beradaptasi secara mulus di segala ukuran layar maupun ukuran wadah induknya menggunakan strategi *Mobile-First*, sintaks rentang `@media (width >= ...)`, `aspect-ratio`, serta `@container` queries.

## Mengapa Halaman Web Harus Bersifat Cair Sejak Awal?

Sebelum Anda menulis satu baris `@media` query pun, ketahuilah bahwa dokumen HTML pada dasarnya **sudah responsif secara alami**. Jika Anda membuka berkas HTML murni tanpa CSS di layar jam tangan pintar maupun monitor 4K, teksnya otomatis mengalir menyesuaikan lebar layar tanpa memunculkan bilah gulir horizontal.

Tata letak justru menjadi rusak dan kaku ketika pengembang menuliskan ukuran tetap seperti `width: 960px` atau `height: 400px`. Oleh karena itu, prinsip pertama **Responsive Web Design (RWD)** adalah membiarkan tata letak mengalir dengan satuan fleksibel (`%`, `fr`, `rem`, `min()`, `clamp()`), lalu menambahkan titik perubahan (*breakpoints*) hanya saat konten mulai terlihat terlalu sempit atau terlalu renggang.

## 1. Pendekatan *Mobile-First* dan Sintaks Rentang `@media` Modern

Dalam pendekatan **Mobile-First**, Anda menulis CSS dasar untuk layar sempit (satu kolom vertikal yang sederhana dan ringan) terlebih dahulu, lalu menggunakan `@media` untuk menyusun ulang kolom ketika lebar layar semakin luas.

Sejak Media Queries Level 4 (status **Baseline Widely Available** sejak 2023), Anda tidak perlu lagi menulis `min-width` dan `max-width` yang sering tumpang tindih pada batas `768px` vs `767.98px`. Gunakan **sintaks perbandingan matematika (`>=`, `<=`, `<`, `>`)** yang jauh lebih jelas:

```css
/* 1. Gaya dasar (Mobile-first): satu kolom vertikal untuk layar ponsel */
.tata-letak-artikel {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/* 2. Layar tablet ke atas (lebar >= 48rem atau 768px) */
@media (width >= 48rem) {
  .tata-letak-artikel {
    grid-template-columns: 240px minmax(0, 1fr);
    gap: 2rem;
  }
}

/* 3. Rentang di antara dua ukuran (48rem <= lebar < 75rem) */
@media (48rem <= width < 75rem) {
  .panel-iklan {
    display: none;
  }
}
```

> **💡 Mengapa Menggunakan `rem` (atau `em`) pada `@media` alih-alih `px`?**
> Ketika seorang pengguna memperbesar ukuran huruf bawaan perambannya menjadi `24px` (atau melakukan *zoom* `200%` di monitor laptop), penggunaan `@media (width >= 48rem)` memastikan tata letak otomatis beralih kembali ke mode satu kolom yang lega sehingga teks besar tidak berdesakan di dalam kolom yang sempit!

### Media Queries Berbasis Kemampuan Perangkat dan Preferensi Pengguna
Selain ukuran layar, `@media` dapat mendeteksi perangkat penunjuk dan preferensi sistem operasi pengguna:
- **`@media (hover: hover) and (pointer: fine)`:** Hanya aktif pada perangkat dengan kursor presisi (tetikus/trackpad), sehingga efek `:hover` tidak "tersangkut" saat disentuh di layar ponsel.
- **`@media (prefers-color-scheme: dark)`:** Mendeteksi mode gelap sistem operasi.
- **`@media (prefers-reduced-motion: reduce)`:** Mendeteksi pengguna yang sensitif terhadap gerakan/animasi layar.

## 2. Mengunci Proporsi Kotak dengan `aspect-ratio`

Di masa lalu, menjaga agar pembungkus video YouTube (`<iframe>`) atau kartu foto tetap berproporsi `16:9` mengharuskan kita menggunakan trik aneh `padding-top: 56.25%`. Kini cukup gunakan properti **`aspect-ratio`** (status **Baseline Widely Available**):

```css
.pembungkus-video {
  inline-size: 100%;
  aspect-ratio: 16 / 9;
}

.avatar-pengguna {
  inline-size: 3.5rem;
  aspect-ratio: 1 / 1; /* Selalu persegi sempurna */
  object-fit: cover;   /* Memotong gambar dengan rapi tanpa membuat wajah gepeng */
  border-radius: 50%;
}
```

## 3. Revolusi Komponen Mandiri dengan Container Queries (`@container`)

Bayangkan Anda membuat satu komponen `.kartu-berita`. Di halaman yang sama, komponen `.kartu-berita` tersebut dipakai di **dua tempat berbeda**:
1. Di dalam area konten utama yang lebar (`800px`) — Anda ingin kartu tampil horizontal (gambar di kiri, teks di kanan).
2. Di dalam bilah samping (`<aside>`) yang sempit (`280px`) — Anda ingin kartu tampil vertikal (gambar di atas, teks di bawah).

Jika Anda menggunakan `@media (width >= 600px)`, **keduanya akan terpaksa tampil horizontal** karena `@media` hanya melihat lebar jendela layar peramban secara keseluruhan (`1440px`), bukan lebar wadah `<aside>` tempat kartu itu berada!

Solusinya adalah **CSS Container Queries (`@container`)** (status **Baseline Widely Available** sejak Februari 2023):

```
Jendela Layar (Viewport = 1280px)
+-------------------------------------------+ +---------------------+
| Area Utama (.kolom-utama = 860px)         | | Sidebar (280px)     |
| +---------------------------------------+ | | +-----------------+ |
| | .kartu-berita                         | | | | .kartu-berita   | |
| | [Gambar]  Judul & Ringkasan Berita    | | | | [Gambar]        | |
| |           (Tampil 2 kolom karena      | | | | Judul Berita    | |
| |            wadahnya >= 420px)         | | | | (Tampil 1 kolom)| |
| +---------------------------------------+ | | +-----------------+ |
+-------------------------------------------+ +---------------------+
```

### Dua Langkah Menggunakan `@container`:
1. **Daftarkan wadah induk sebagai *containment context*** menggunakan `container-type: inline-size` (dan opsional beri nama dengan `container-name`):
2. **Tulis aturan `@container`** yang memeriksa ukuran wadah induk tersebut!

```css
/* Langkah 1: Tandai pembungkus kartu sebagai container */
.pembungkus-kartu {
  container-type: inline-size;
  container-name: wadah-kartu;
}

/* Gaya bawaan kartu (saat wadahnya sempit < 420px): tumpuk vertikal */
.kartu-berita {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Langkah 2: Jika lebar .pembungkus-kartu mencapai >= 420px, ubah menjadi 2 kolom! */
@container wadah-kartu (width >= 420px) {
  .kartu-berita {
    grid-template-columns: 180px minmax(0, 1fr);
    align-items: center;
  }
}
```

> **⚠️ Aturan Penting `@container`:**
> Sebuah elemen yang diberi `container-type: inline-size` tidak dapat mengubah gayanya sendiri di dalam blok `@container` miliknya; yang diubah di dalam `@container` adalah **elemen anak/keturunan di dalamnya** (itulah sebabnya kita memasang `container-type: inline-size` pada `.pembungkus-kartu` atau kolom grid, lalu mengubah gaya `.kartu-berita` di dalamnya).

### Satuan Container Query (`cqi`)
Selain `vw` yang mengacu pada lebar layar, Anda kini dapat menggunakan **`1cqi`** (*1% of a query container's inline size*) untuk membuat ukuran huruf judul kartu yang membesar atau mengecil mengikuti lebar kotaknya sendiri:

```css
.kartu-berita h3 {
  font-size: clamp(1rem, 0.75rem + 2cqi, 1.5rem);
}
```

## Latihan Praktik: Komponen Kartu Adaptif di Dua Kolom Berbeda

Buatlah berkas `container-query.html` dan `cq.css`:
1. Buat tata letak utama dua kolom menggunakan `@media (width >= 56rem)` yang membagi layar menjadi kolom utama (`2fr`) dan bilah samping (`1fr`).
2. Berikan `container-type: inline-size` pada kolom utama maupun bilah samping.
3. Masukkan kode HTML `.kartu-modul` yang **identik persis** ke dalam kolom utama dan bilah samping, lalu gunakan `@container (width >= 450px)` sehingga kartu di kolom utama otomatis tampil menyamping 2 kolom lengkap dengan gambar rasio `16 / 9`, sementara kartu di bilah samping tampil bertumpuk vertikal!

## Kuis Pemahaman

### Soal 1
Mengapa penggunaan `@container` lebih tepat dibandingkan `@media` untuk mengatur tata letak internal sebuah komponen kartu yang dapat diletakkan di area utama, di bilah samping, maupun di dalam kotak dialog?
- A. Karena `@media` sudah tidak didukung lagi di peramban modern.
- B. Karena `@media` hanya mengukur dimensi jendela layar (*viewport*) secara keseluruhan, sedangkan `@container` mengukur dimensi aktual dari wadah induk tempat komponen tersebut diletakkan.
- C. Karena `@container` otomatis mengunduh gambar yang lebih kecil dari server.
- D. Karena `@container` tidak memerlukan tag HTML pembungkus.

**Jawaban Benar:** B
**Penjelasan:** Layar desktop yang lebar (`1440px`) bisa saja memiliki bilah samping yang sempit (`260px`). Dengan `@container`, komponen beradaptasi terhadap lebar ruang wadah yang benar-benar tersedia untuknya, bukan lebar layar monitor secara keseluruhan.

### Soal 2
Properti apakah yang wajib dipasang pada elemen pembungkus induk sebelum elemen anak di dalamnya dapat merespons kueri ukuran lebar `@container (width >= 400px)`?
- A. `display: container;`
- B. `container-type: inline-size;`
- C. `position: relative;`
- D. `contain: none;`

**Jawaban Benar:** B
**Penjelasan:** Agar peramban melacak lebar *inline* sebuah elemen pembungkus dan mengizinkan kueri `@container` berbasis lebar di dalamnya, elemen pembungkus tersebut harus ditetapkan sebagai *query container* dengan `container-type: inline-size`.

### Soal 3
Kombinasi properti CSS manakah yang memastikan sebuah foto profil (`<img>`) selalu tampil sebagai kotak persegi `1:1` tanpa membuat wajah di dalam foto tampak gepeng atau tertarik meskipun foto aslinya berbentuk persegi panjang?
- A. `aspect-ratio: 1 / 1;` dan `object-fit: cover;`
- B. `width: 100%;` dan `height: 100%;`
- C. `aspect-ratio: 16 / 9;` dan `overflow: scroll;`
- D. `display: flex;` dan `align-items: stretch;`

**Jawaban Benar:** A
**Penjelasan:** `aspect-ratio: 1 / 1` mengunci proporsi dimensi elemen menjadi persegi sama sisi, sementara `object-fit: cover` memerintahkan peramban untuk mempertahankan rasio asli foto dan memotong (*crop*) tepi sisanya dengan rapi alih-alih mendistorsi gambar.

## Sumber
- [CSS container queries — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
- [Using media queries — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using)
- [Media query fundamentals — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Media_queries)
