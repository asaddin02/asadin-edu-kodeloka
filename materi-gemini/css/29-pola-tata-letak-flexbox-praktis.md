# 10 Pola Tata Letak Antarmuka Nyata dengan Flexbox (Navbar, Sidebar, Holy Grail, Sticky Footer, Media Object)

- **Tingkat:** Menengah
- **Ringkasan:** Menerapkan Flexbox untuk menyelesaikan sepuluh pola tata letak komponen yang paling sering ditemui dalam pekerjaan sehari-hari dengan kode minimal dan responsif.

## Mengapa Belajar Lewat Pola?

Setelah memahami sumbu dan perhitungan Flexbox (Pelajaran 06 dan 28), cara terbaik untuk mengasahnya adalah mengenali **pola yang berulang**. Sepuluh pola berikut muncul hampir di setiap proyek. Semua contoh memakai properti logis dan `gap`, sehingga tetap bekerja pada halaman kiri-ke-kanan maupun kanan-ke-kiri.

## Pola 1: Navbar (Logo di Kiri, Aksi di Kanan)

```css
.navbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-inline: 1.25rem;
  min-block-size: 3.5rem;
}
.navbar .aksi {
  margin-inline-start: auto;   /* menyerap seluruh ruang kosong di sisi awalnya */
}
```

## Pola 2: Menengahkan di Dua Arah

```css
.pusat {
  display: flex;
  justify-content: center;   /* poros utama */
  align-items: center;       /* poros silang */
  min-block-size: 100dvh;
}
/* Ringkasnya: display: grid; place-content: center; */
```

## Pola 3: Sidebar dengan Konten Fleksibel

```css
.tata-letak { display: flex; gap: 1.5rem; }
.sidebar    { flex: 0 0 16rem; }                  /* lebar tetap, tidak tumbuh maupun menyusut */
.konten     { flex: 1; min-inline-size: 0; }      /* mengisi sisa; min-inline-size: 0 mencegah meluber karena <pre> */
```

## Pola 4: Holy Grail (Header, Tiga Kolom, Footer)

```css
body {
  display: flex;
  flex-direction: column;
  min-block-size: 100dvh;
}
.tengah {
  display: flex;
  flex: 1;                   /* bagian tengah mengambil tinggi sisa */
  gap: 1.5rem;
}
.tengah > nav,
.tengah > aside { flex: 0 0 14rem; }
.tengah > main  { flex: 1; min-inline-size: 0; }
```

Urutan HTML sebaiknya `header`, `nav`, `main`, `aside`, `footer` (urutan baca yang logis). Hindari memakai `order` untuk memindahkan `main` ke depan (lihat bagian aksesibilitas di bawah).

## Pola 5: Sticky Footer

Footer berada di dasar layar walau konten pendek, dan terdorong turun bila konten panjang:

```css
body {
  display: flex;
  flex-direction: column;
  min-block-size: 100dvh;
}
main { flex: 1; }            /* menyerap ruang kosong sehingga footer terdorong ke bawah */
```

## Pola 6: Objek Media (Gambar + Teks)

```css
.media {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}
.media > img {
  flex: none;                /* gambar tidak menyusut meski teks panjang */
  inline-size: 4rem;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 50%;
}
.media > .isi { min-inline-size: 0; }
```

## Pola 7: Deretan Kartu Setara Tinggi dengan Tombol di Dasar

```css
.baris-kartu { display: flex; gap: 1rem; }       /* align-items: stretch (bawaan) membuat kartu setara tinggi */
.kartu {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.kartu .tombol { margin-block-start: auto; }     /* tombol selalu di dasar kartu */
```

## Pola 8: Daftar Tag yang Membungkus

```css
.tag-daftar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  list-style: none;
}
```

## Pola 9: Grup Input dan Tombol

```css
.cari { display: flex; gap: 0.5rem; }
.cari input  { flex: 1; min-inline-size: 0; }    /* input mengisi sisa ruang */
.cari button { flex: none; }
```

## Pola 10: Kolom Fleksibel yang Membungkus Otomatis

```css
.kolom-fleksibel {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.kolom-fleksibel > * {
  flex: 1 1 15rem;   /* tumbuh sama rata, basis 15rem, pindah baris bila tidak muat */
}
```

Perhatikan bahwa item pada baris terakhir tetap melebar mengisi baris tersebut. Bila Anda menginginkan lebar kolom yang seragam di setiap baris, gunakan CSS Grid dengan `repeat(auto-fill, minmax(15rem, 1fr))` (lihat Pelajaran 07).

## Catatan Aksesibilitas: Hati-hati dengan `order` dan `row-reverse`

Properti `order` dan nilai `row-reverse`/`column-reverse` hanya mengubah **urutan visual**. Urutan fokus papan ketik dan urutan baca pembaca layar tetap mengikuti **urutan DOM**. Akibatnya pengguna papan ketik bisa mengalami fokus yang melompat-lompat. WCAG menuntut urutan yang bermakna (SC 1.3.2) dan urutan fokus yang logis (SC 2.4.3). Ubah urutan di HTML bila urutannya memang penting; pakai `order` hanya untuk perubahan visual yang tidak mengubah makna.

## Studi Kasus Produksi: Komponen Kartu Harga (*Pricing Tier*) Setara Tinggi

Pada halaman perbandingan paket langganan, setiap kartu memiliki jumlah poin fitur yang berbeda, tetapi tombol "Pilih Paket" harus selalu rata di bagian paling bawah kartu:

```css
.daftar-paket {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: stretch; /* Semua kartu dalam satu baris sama tinggi */
}

.kartu-paket {
  flex: 1 1 18rem;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border: 1px solid oklch(85% 0.02 250);
  border-radius: 1rem;
}

.kartu-paket .daftar-fitur {
  margin-block: 1rem 1.5rem;
}

.kartu-paket .tombol-beli {
  margin-block-start: auto; /* Mendorong tombol ke dasar kartu */
}
```

Deklarasi `margin-block-start: auto` menyerap seluruh ruang kosong vertikal yang tersisa di dalam `.kartu-paket` berarah kolom, sehingga tombol aksi pada semua kartu tampak sejajar rapi.

## Kesalahan Umum dan Cara Menghindarinya

1. **Lupa `min-inline-size: 0` pada kolom isi.** Blok `<pre>` atau URL panjang membuat kolom meluber.
2. **Menengahkan dengan `margin` manual padahal cukup `justify-content` dan `align-items`.**
3. **Memakai `height: 100vh` untuk tata letak penuh layar di ponsel.** Gunakan `min-block-size: 100dvh` (lihat Pelajaran 04).
4. **Memakai `order` untuk menukar konten yang penting.** Fokus papan ketik tetap mengikuti DOM.
5. **Menyangka `flex-wrap` menyeragamkan lebar kolom antarbaris.** Item pada baris terakhir tetap tumbuh; gunakan Grid untuk kolom seragam.

## Latihan Praktik: Halaman Dokumentasi dengan Flexbox

Buatlah berkas `pola-flexbox.html` dan `pola.css` yang memuat:
1. Navbar dengan logo, tautan, dan tombol masuk di ujung (`margin-inline-start: auto`).
2. Tata letak Holy Grail dengan footer yang menempel di dasar (sticky footer).
3. Satu baris tiga kartu setara tinggi dengan tombol di dasar kartu.
4. Satu objek media (avatar dan komentar) dengan avatar yang tidak menyusut.
5. Satu daftar tag yang membungkus ke baris baru.

## Kuis Pemahaman

### Soal 1
Manakah kombinasi yang membuat footer tetap berada di dasar layar walau konten halaman pendek?
- A. `footer { position: absolute; }` dan `body { height: 100%; }`
- B. `body { display: flex; flex-direction: column; min-block-size: 100dvh; }` dan `main { flex: 1; }`
- C. `body { display: flex; justify-content: center; }` dan `footer { flex: none; }`
- D. `footer { float: bottom; }`

**Jawaban Benar:** B
**Penjelasan:** `body` menjadi kolom flex setinggi minimal layar, dan `main { flex: 1 }` menyerap ruang yang tersisa sehingga footer terdorong ke dasar. Opsi A dapat menutupi konten, opsi C tidak mengatur tinggi, dan `float: bottom` bukan nilai yang valid.

### Soal 2
Apa efek `margin-inline-start: auto` pada sebuah flex item di dalam kontainer baris pada halaman kiri-ke-kanan?
- A. Item pindah ke ujung kanan karena margin otomatis menyerap seluruh ruang kosong di sisi kirinya.
- B. Item tetap di kiri dan margin kanan menjadi otomatis.
- C. Item berada di tengah vertikal.
- D. Tidak berpengaruh, karena margin otomatis hanya bekerja pada blok biasa.

**Jawaban Benar:** A
**Penjelasan:** Pada flex item, margin `auto` menyerap ruang bebas pada sumbu itu. Margin awal inline yang otomatis mendorong item (dan item sesudahnya) ke sisi akhir kontainer.

### Soal 3
Apa dampak penggunaan `order` untuk memindahkan elemen `<aside>` ke posisi pertama secara visual?
- A. Urutan Tab dan pembacaan pembaca layar ikut berubah mengikuti tampilan.
- B. Hanya urutan visual yang berubah; urutan fokus papan ketik dan urutan baca pembaca layar tetap mengikuti urutan DOM.
- C. HTML otomatis ditulis ulang oleh peramban.
- D. `order` tidak dapat memengaruhi tampilan.

**Jawaban Benar:** B
**Penjelasan:** `order` hanya mengatur susunan visual. Karena fokus dan pembacaan mengikuti DOM, perubahan visual yang besar dapat membingungkan pengguna papan ketik dan pembaca layar.

## Sumber
- [Typical use cases of flexbox — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Use_cases)
- [Basic concepts of flexbox — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts)
- [`order` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/order)
- [Understanding Success Criterion 2.4.3: Focus Order — W3C WAI](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html)
