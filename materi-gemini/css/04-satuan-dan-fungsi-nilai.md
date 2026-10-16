# Satuan Ukuran Modern (`rem`, `ch`, `dvh`) dan Fungsi Matematika (`calc`, `clamp`)

- **Tingkat:** Dasar
- **Ringkasan:** Memilih satuan CSS yang tepat antara satuan absolut (`px`) dan relatif (`rem`, `em`, `ch`, `%`, `vw`, `dvh`, `svh`), serta merancang tipografi dan spasi yang luwes menggunakan fungsi `calc()`, `min()`, `max()`, dan `clamp()`.

## Mengapa Kita Tidak Memakai `px` untuk Semuanya?

Satuan piksel CSS (`px`) sangat presisi dan mudah dipahami, tetapi menggunakan `px` untuk semua properti—terutama untuk ukuran huruf (`font-size`) dan lebar kontainer—memiliki kelemahan serius:

1. **Mengabaikan Preferensi Ukuran Huruf Pengguna:** Banyak pengguna dengan gangguan penglihatan mengubah ukuran fon bawaan di pengaturan peramban mereka dari `16px` menjadi `20px` atau `24px`. Jika Anda mengunci ukuran teks dengan `font-size: 14px`, teks Anda akan tetap kecil dan mengabaikan pengaturan aksesibilitas pengguna tersebut!
2. **Tidak Luwes di Ribuan Ukuran Layar:** Lebar layar pengunjung berkisar dari `320px` (ponsel kecil) hingga `2560px` (monitor lebar).

Oleh karena itu, pengembang front-end profesional memilih satuan berdasarkan **konteks propertinya**.

## 1. Memilih Satuan: `px`, `rem`, `em`, dan `ch`

| Satuan | Mengacu Pada | Kapan Harus Digunakan? |
|---|---|---|
| **`rem`** (*Root EM*) | Ukuran `font-size` pada elemen akar `<html>` (bawaan peramban: `1rem = 16px`). | **Pilihan utama untuk `font-size`, `padding`, `margin` global, dan lebar komponen.** Menghormati pengaturan ukuran huruf peramban pengguna dan nilainya selalu konsisten di seluruh dokumen! |
| **`em`** | Ukuran `font-size` dari elemen itu sendiri (atau elemen induknya jika digunakan pada properti `font-size`). | Sangat cocok untuk **padding atau margin lokal yang harus proporsional dengan ukuran huruf elemen tersebut** (misalnya `padding: 0.5em 1em` pada tombol atau lencana/`badge`). |
| **`ch`** (*Character unit*) | Lebar glif angka `"0"` pada fon yang sedang digunakan. | **Pilihan terbaik untuk membatasi lebar baris paragraf bacaan** (`max-inline-size: 65ch`). Baris teks yang panjangnya antara `50ch` hingga `75ch` terbukti paling nyaman dibaca mata manusia. |
| **`px`** (*CSS Pixel*) | Satuan panjang absolut visual. | Gunakan untuk **ketebalan garis batas (`border: 1px solid`), sudut membulat kecil (`border-radius: 6px`), dan bayangan (`box-shadow`)** yang memang tidak perlu membesar saat ukuran teks diperbesar. |
| **`%`** (*Persentase*) | Ukuran properti yang bersangkutan pada elemen induk. | Mengatur lebar relatif terhadap wadah induk (misalnya `max-width: 100%` pada gambar). |

> **⚠️ Jebakan Efek Bola Salju pada `em` untuk `font-size`:**
> Jika Anda menulis `ul { font-size: 0.85em; }`, maka daftar `<ul>` tingkat pertama berukuran `85%`. Namun jika di dalamnya terdapat sub-daftar `<ul>` bersarang, ukurannya menjadi `0.85 × 0.85 = 72%`, dan tingkat ketiganya menyusut menjadi `61%`! Gunakan **`rem`** untuk `font-size` agar ukurannya selalu mengacu ke akar `<html>`.

> **🚫 Jangan Mengubah `html { font-size: 10px }`!**
> Hanya demi mempermudah hitungan matematika di kepala (`1.6rem = 16px`), sebagian tutorial lama menyarankan `html { font-size: 10px }` atau `62.5%`. Hindari pola `10px` karena nilai piksel tetap pada `<html>` menimpa preferensi ukuran huruf pengguna di peramban dan memaksa ukuran dasar menjadi terlalu kecil bagi halaman atau komponen yang belum terdefinisi, dan biasakan menghitung dengan kelipatan `1rem = 16px` (`0.75rem = 12px`, `0.875rem = 14px`, `1rem = 16px`, `1.25rem = 20px`, `1.5rem = 24px`, `2rem = 32px`) atau gunakan fungsi `calc(14 / 16 * 1rem)`.

## 2. Satuan Viewport: Mengapa `100dvh` Menggantikan `100vh` di Perangkat Seluler?

Satuan *viewport* mengukur persentase dari jendela layar peramban yang sedang terbuka (`100vw` = 100% lebar layar, `100vh` = 100% tinggi layar).

Namun, pada peramban ponsel (Safari iOS dan Chrome Android), bilah alamat (*address bar*) di bagian atas/bawah layar dapat **menyusut dan membesar secara dinamis** saat pengguna menggulir halaman.
- Satuan lama **`100vh`** selalu dihitung seolah-olah bilah alamat peramban sedang tersembunyi (ukuran paling besar). Akibatnya, saat halaman pertama kali dibuka (ketika bilah alamat masih muncul), bagian bawah elemen `height: 100vh` (seperti tombol aksi di bawah layar) **terpotong dan tertutup oleh bilah alamat peramban**!

CSS modern (status **Baseline Widely Available** sejak Desember 2022) menyelesaikan masalah ini dengan tiga satuan viewport baru:

1. **`svh` (*Small Viewport Height*):** Tinggi layar saat bilah alamat peramban sedang terbuka penuh (ukuran teraman agar konten dijamin tidak pernah tertutup bilah peramban).
2. **`lvh` (*Large Viewport Height*):** Tinggi layar saat bilah alamat peramban menyusut/tersembunyi.
3. **`dvh` (*Dynamic Viewport Height*):** Menyesuaikan tinggi secara dinamis mengikuti muncul atau sembunyinya bilah alamat peramban!

```css
/* Menjamin tinggi minimal halaman penuh tanpa terpotong bilah alamat di ponsel */
body {
  min-block-size: 100vh;  /* Fallback untuk peramban lama */
  min-block-size: 100dvh; /* Standar modern */
}
```

## 3. Fungsi Matematika CSS: `calc()`, `min()`, `max()`, dan `clamp()`

CSS memungkinkan Anda melakukan perhitungan dinamis yang mencampurkan satuan berbeda secara langsung di peramban:

### A. `calc()`: Menggabungkan Satuan yang Berbeda
Perhatikan bahwa operator `+` dan `-` di dalam `calc()` **wajib diapit oleh spasi** (misalnya `calc(100% - 2rem)`, bukan `calc(100%-2rem)`):

```css
.panel-utama {
  /* Lebar 100% dikurangi lebar bilah samping tetap 260px */
  inline-size: calc(100% - 260px);
}
```

### B. `min()` dan `max()`: Pembatas Dinamis Satu Baris
- `min(A, B)` memilih nilai mana pun yang **paling kecil** saat itu.
- `max(A, B)` memilih nilai mana pun yang **paling besar** saat itu.

```css
/* Menggantikan gabungan width: 92% dan max-width: 1120px cukup dengan satu baris! */
.kontainer {
  inline-size: min(92%, 1120px);
  margin-inline: auto;
}
```

### C. `clamp(MIN, IDEAL, MAX)`: Tipografi dan Spasi Cair (*Fluid Typography*)
Fungsi `clamp()` mengunci sebuah nilai di antara **batas bawah (`MIN`)**, **nilai ideal yang elastis (`IDEAL`)**, dan **batas atas (`MAX`)** tanpa memerlukan satupun `@media` query!

```css
h1 {
  /* - Minimal 1.75rem (28px) di layar ponsel kecil
     - Tumbuh secara mulus mengikuti 1.2rem + 2.5vw
     - Maksimal berhenti di 3rem (48px) pada monitor besar */
  font-size: clamp(1.75rem, 1.2rem + 2.5vw, 3rem);
  line-height: 1.15;
}
```

> **💡 Tips Aksesibilitas untuk `clamp()`:**
> Pada argumen tengah (*ideal value*) di `clamp()`, **selalu gabungkan `rem` dengan `vw`** (seperti `1.2rem + 2.5vw`), jangan menulis `4vw` sendirian! Jika Anda hanya menulis `font-size: clamp(1.75rem, 4vw, 3rem)`, maka saat pengguna memperbesar ukuran huruf peramban (*browser zoom*), nilai `4vw` tidak ikut membesar karena lebar layar tidak berubah. Menggabungkan `1.2rem + 2.5vw` memastikan teks tetap merespons fitur *zoom* pengguna.

## Latihan Praktik: Merancang Halaman Artikel dengan Tipografi Cair

Buatlah berkas `satuan-fluid.html` dan `fluid.css` yang menerapkan:
1. Wadah artikel dengan lebar `inline-size: min(100% - 2rem, 65ch)` dan `margin-inline: auto`.
2. Ukuran `<h1>` menggunakan `clamp(1.8rem, 1.3rem + 2vw, 2.75rem)` dan jarak `padding-block` seksi menggunakan `clamp(2rem, 1rem + 4vw, 5rem)`.
3. Sebuah lencana status (`.lencana`) yang menggunakan `padding: 0.25em 0.75em` dan `border-radius: 999px` sehingga bantalannya otomatis menyesuaikan ukuran huruf lencana tersebut.

## Kuis Pemahaman

### Soal 1
Mengapa satuan `rem` lebih direkomendasikan daripada `px` untuk menentukan ukuran huruf (`font-size`) pada halaman web?
- A. Karena satuan `px` tidak didukung pada layar Retina/AMOLED.
- B. Karena `rem` mengacu pada ukuran fon elemen akar (`<html>`), sehingga otomatis menyesuaikan diri apabila pengguna mengubah preferensi ukuran huruf bawaan di pengaturan peramban demi kenyamanan baca.
- C. Karena `rem` selalu menghasilkan ukuran huruf dua kali lebih besar daripada `px`.
- D. Karena `px` tidak dapat digunakan di dalam fungsi `calc()`.

**Jawaban Benar:** B
**Penjelasan:** Menetapkan `font-size` dalam `px` mengabaikan preferensi ukuran fon dasar yang diatur pengguna di peramban. Dengan `rem`, seluruh skala tipografi situs akan membesar atau mengecil secara proporsional mengikuti pengaturan aksesibilitas pengguna.

### Soal 2
Apa masalah utama penggunaan `height: 100vh` pada peramban ponsel modern yang dapat diatasi dengan menggunakan `100dvh` atau `100svh`?
- A. `100vh` membuat halaman ponsel berputar menjadi mode lanskap secara paksa.
- B. `100vh` selalu menghitung tinggi layar seolah-olah bilah alamat (*address bar*) peramban sedang tersembunyi, sehingga bagian bawah elemen sering terpotong saat bilah alamat peramban sedang tampil.
- C. `100vh` hanya menghitung lebar layar, bukan tinggi layar.
- D. `100vh` memblokir pengguliran halaman di desktop.

**Jawaban Benar:** B
**Penjelasan:** Pada peramban perangkat seluler, tinggi ruang pandang berubah saat bilah navigasi/alamat menyusut atau muncul. `100vh` dipatok pada ukuran terbesar (*large viewport*), sedangkan `100dvh` (*dynamic viewport height*) dan `100svh` (*small viewport height*) memperhitungkan keberadaan bilah antarmuka peramban tersebut.

### Soal 3
Perhatikan aturan CSS berikut:
```css
.kontainer {
  inline-size: min(90%, 1000px);
}
```
Berapakah lebar `.kontainer` ketika halaman dibuka pada layar ponsel selebar `400px`, dan ketika dibuka pada monitor desktop selebar `1600px`?
- A. `400px` di ponsel, dan `1440px` di desktop.
- B. `360px` (`90%` dari `400px`) di ponsel, dan `1000px` di desktop.
- C. `1000px` di ponsel, dan `90%` di desktop.
- D. `360px` di kedua layar tersebut.

**Jawaban Benar:** B
**Penjelasan:** Fungsi `min()` selalu memilih nilai terkecil dari daftar argumennya:
- Pada layar `400px`: `90%` adalah `360px`. Karena `360px < 1000px`, maka dipilih `360px`.
- Pada layar `1600px`: `90%` adalah `1440px`. Karena `1000px < 1440px`, maka lebarnya dibatasi pada `1000px`.

## Sumber
- [CSS values and units — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units)
- [CSS values and units guide — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Values_and_units)
- [Learn CSS — web.dev](https://web.dev/learn/css)
