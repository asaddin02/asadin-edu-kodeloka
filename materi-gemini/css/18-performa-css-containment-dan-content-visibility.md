# Optimasi Performa Rendering CSS: `content-visibility: auto`, `contain`, dan Pencegahan Layout Thrashing

- **Tingkat:** Lanjut
- **Ringkasan:** Mempercepat waktu pemuatan dan perenderan halaman panjang secara drastis menggunakan `content-visibility: auto` dan `contain-intrinsic-size`, memahami isolasi perhitungan peramban dengan properti `contain`, serta menghindari *Forced Synchronous Layout*.

## Mengapa Halaman dengan Ratusan Elemen Bisa Terasa Berat Saat Dimuat?

Pada Pelajaran 13 HTML, kita telah mempelajari `loading="lazy"` yang menunda pengunduhan gambar di bawah layar. Namun, bagaimana dengan **perhitungan gaya (*Recalculate Style*), perhitungan tata letak (*Layout*), dan penggambaran (*Paint*) untuk ratusan kartu, tabel, atau komentar panjang yang berada jauh di bawah layar**?

Secara bawaan, saat sebuah halaman panjang dibuka, peramban tetap wajib menghitung ukuran dan tata letak dari **seluruh elemen dari baris pertama hingga baris ke-5.000 di paling bawah halaman**, meskipun pengguna baru melihat bagian paling atas!

## 1. Melompati Rendering di Luar Layar dengan `content-visibility: auto`

Properti **`content-visibility: auto`** (status **Baseline Newly Available** sejak 2024 di semua peramban utama) bekerja layaknya *"lazy rendering untuk seluruh bagian DOM dan CSS"*:
- Ketika sebuah `<section>` atau `<article>` dengan `content-visibility: auto` masih berada jauh di luar area pandang layar (*off-screen*), peramban **melewati seluruh proses Layout dan Paint untuk isi di dalam elemen tersebut**!
- Begitu pengguna mulai menggulir mendekati elemen tersebut, peramban merendernya tepat waktu secara otomatis.
- Pada halaman dokumentasi panjang (seperti halaman yang memuat puluhan bab sekaligus), `content-visibility: auto` dapat mempercepat waktu perenderan awal secara signifikan (contoh kasus di web.dev melaporkan peningkatan **hingga 7 kali** pada pemuatan awal)!

### Pasangan Wajib: `contain-intrinsic-size`
Jika peramban melewati perhitungan tata letak untuk `<section>` yang ada di bawah layar, lalu dari mana peramban tahu berapa perkiraan tinggi `<section>` tersebut agar batang *scrollbar* di tepi kanan layar tidak melompat-lompat?

Jawabannya adalah memasangkan `content-visibility: auto` dengan **`contain-intrinsic-size: auto 500px;`**:

```css
/* Terapkan pada blok seksi atau kartu artikel yang berada di bawah layar pertama */
.seksi-artikel,
.kartu-katalog {
  content-visibility: auto;
  /* 'auto 400px' berarti:
     - Saat elemen belum pernah dirender, pesan ruang tinggi perkiraan 400px.
     - Kata kunci 'auto' memerintahkan peramban untuk MENGINGAT tinggi asli elemen tersebut
       setelah elemen itu sempat terlihat di layar, sehingga saat digulir naik-turun kembali,
       tingginya 100% akurat tanpa lompatan! */
  contain-intrinsic-size: auto 400px;
}
```

> **💡 Keunggulan `content-visibility: auto` dibandingkan `display: none`:**
> Berbeda dengan `display: none` yang menghilangkan teks dari pencarian `Ctrl + F` dan pembaca layar, konten di dalam elemen `content-visibility: auto` yang sedang berada di luar layar **tetap dapat ditemukan saat pengguna menekan `Ctrl + F` di peramban dan tetap dapat diakses oleh pembaca layar**!

## 2. Mengisolasi Perhitungan Peramban dengan Properti `contain`

Ketika Anda mengubah teks atau ukuran satu elemen kecil di dalam sebuah widget menggunakan JavaScript, peramban secara bawaan harus memeriksa apakah perubahan tersebut ikut menggeser posisi elemen-elemen lain di luar widget tersebut (di seluruh halaman).

Properti **`contain`** memungkinkan Anda memberi jaminan kepada mesin peramban bahwa apa yang terjadi di dalam komponen ini **tidak akan pernah memengaruhi tata letak di luar komponen ini**:

- **`contain: layout`:** Perubahan posisi/ukuran anak di dalam elemen ini tidak akan pernah menggeser elemen di luar kotak ini.
- **`contain: paint`:** Anak di dalam elemen ini tidak akan pernah digambar melewati batas kotak elemen ini (mirip `overflow: clip`).
- **`contain: content`:** Singkatan populer untuk `contain: layout paint style;` — sangat aman dipasang pada komponen kartu atau widget mandiri untuk mempercepat perhitungan ulang tata letak (*reflow*)!

## 3. Menghindari *Layout Thrashing* (*Forced Synchronous Layout*)

Selain di CSS, performa perenderan sering jatuh akibat cara JavaScript membaca dan menulis gaya CSS secara bergantian di dalam perulangan:

```js
// 🚫 BURUK (Memicu Layout Thrashing / Forced Synchronous Layout berulang-ulang!):
// Membaca offsetWidth tepat setelah mengubah style.width di dalam loop memaksa peramban
// menjalankan tahap Layout secara sinkron berkali-kali dalam satu frame!
for (const kotak of daftarKotak) {
  const lebarSaatIni = kotak.offsetWidth; // 1. BACA (Memaksa Layout!)
  kotak.style.width = `${lebarSaatIni + 10}px`; // 2. TULIS (Membatalkan Layout!)
}

// ✅ BENAR: Serahkan perhitungan ke CSS (mis. Flexbox/Grid/calc), atau pisahkan semua tahap BACA
//    terlebih dahulu, baru lakukan semua tahap TULIS sekaligus!
```

## Latihan Praktik: Mengoptimalkan Halaman Dokumentasi Panjang

Buatlah berkas `performa-render.html` dan `performa.css`:
1. Buat halaman yang memiliki 20 `<section class="bab-dokumentasi">` panjang.
2. Biarkan `<section>` pertama di layar teratas dirender secara normal, dan terapkan `.bab-dokumentasi:nth-child(n + 2) { content-visibility: auto; contain-intrinsic-size: auto 450px; }` pada seksi ke-2 dan seterusnya.
3. Buka tab **Performance** di DevTools, rekam pemuatan halaman (*Record & Reload*), dan amati betapa singkatnya waktu *Rendering* dan *Painting* pada utas utama!

## Kuis Pemahaman

### Soal 1
Apa yang dilakukan oleh peramban ketika sebuah elemen `<section>` di bagian bawah halaman diberi properti `content-visibility: auto; contain-intrinsic-size: auto 500px;`?
- A. Peramban menghapus elemen `<section>` tersebut dari DOM sampai pengguna mengeklik tombol.
- B. Peramban melewati pekerjaan *Layout* dan *Paint* untuk isi di dalam `<section>` tersebut selama elemen masih berada di luar layar (sambil menggunakan tinggi perkiraan `500px`), lalu merendernya secara otomatis sesaat sebelum masuk ke area pandang layar, sambil tetap membiarkan teks di dalamnya dapat dicari dengan `Ctrl + F`.
- C. Peramban mengunduh gambar di dalamnya dengan kualitas rendah.
- D. Peramban menyembunyikan teks dari pembaca layar.

**Jawaban Benar:** B
**Penjelasan:** `content-visibility: auto` menunda biaya perenderan (*layout & paint*) untuk sub-pohon elemen di luar layar tanpa mengorbankan aksesibilitas maupun fungsi pencarian halaman (`Ctrl + F`).

### Soal 2
Mengapa kita perlu menyertakan kata kunci `auto` di depan nilai ukuran pada `contain-intrinsic-size: auto 400px;`?
- A. Agar lebar elemen menjadi `auto`.
- B. Agar setelah elemen tersebut sempat masuk ke layar dan dihitung tinggi aslinya (misalnya ternyata `620px`), peramban menyimpan dan menggunakan ukuran asli `620px` tersebut saat elemen kembali keluar layar, sehingga batang *scrollbar* tidak bergeser-geser saat pengguna menggulir naik.
- C. Agar elemen otomatis berada di tengah halaman (`margin: auto`).
- D. Karena tanpa kata kunci `auto`, satuan `px` tidak diizinkan.

**Jawaban Benar:** B
**Penjelasan:** Angka `400px` hanyalah tebakan awal sebelum elemen pernah dirender. Dengan `auto 400px`, begitu elemen pernah dirender satu kali, peramban mengganti tebakan `400px` tadi dengan dimensi terakhir yang terukur secara akurat.

### Soal 3
Apa yang dimaksud dengan *Layout Thrashing* (*Forced Synchronous Layout*)?
- A. Penggunaan CSS Grid dan Flexbox di dalam satu halaman yang sama.
- B. Kondisi ketika kode JavaScript berulang kali mengubah properti gaya visual (*write*) lalu langsung membaca properti geometri seperti `offsetWidth` atau `getBoundingClientRect()` (*read*) di dalam perulangan, sehingga memaksa peramban menghitung ulang tata letak secara paksa berkali-kali sebelum satu bingkai layar selesai.
- C. Penggunaan lebih dari 10 variabel CSS pada `:root`.
- D. Perubahan warna latar belakang menggunakan `transition`.

**Jawaban Benar:** B
**Penjelasan:** Peramban normalnya mengumpulkan seluruh perubahan gaya dan menghitung *Layout* cukup satu kali di akhir bingkai. Namun jika JavaScript meminta nilai geometri (`offsetWidth`, `clientHeight`) tepat setelah mengubah gaya, peramban terpaksa langsung menjalankan *Layout* saat itu juga demi memberikan angka yang mutakhir.

## Sumber
- [`content-visibility` CSS property — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility)
- [content-visibility: the new CSS property that boosts your rendering performance — web.dev](https://web.dev/articles/content-visibility)
- [Critical rendering path — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path)
