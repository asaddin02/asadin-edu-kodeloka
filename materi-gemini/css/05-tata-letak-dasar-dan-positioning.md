# Aliran Dokumen Normal, `display`, `position`, dan Stacking Context (`z-index`)

- **Tingkat:** Menengah
- **Ringkasan:** Menguasai perbedaan perilaku kotak `block`, `inline`, dan `inline-block`, lima mode `position` (`static`, `relative`, `absolute`, `fixed`, `sticky`), properti logis `inset`, serta cara kerja *stacking context* pada `z-index`.

## 1. Aliran Normal (*Normal Flow*) dan Properti `display`

Sebelum Anda menulis aturan tata letak apa pun, peramban menyusun elemen menggunakan **Normal Flow**:
- **Elemen `display: block`** (`<div>`, `<p>`, `<h1>`–`<h6>`, `<section>`, `<ul>`):
  - Selalu memulai baris baru (tersusun vertikal dari atas ke bawah).
  - Lebarnya secara bawaan merentang memenuhi ruang horizontal induknya (`100%`).
  - Menghormati properti `width`, `height`, `margin`, dan `padding` di keempat sisi.
- **Elemen `display: inline`** (`<span>`, `<a>`, `<strong>`, `<em>`, `<code>`):
  - Mengalir berdampingan di dalam satu baris kalimat dan hanya memakan lebar sesuai isi teksnya.
  - **TIDAK menghormati properti `width` dan `height`!**
  - Margin dan padding vertikal (`top` dan `bottom`) tidak akan mendorong baris teks di atas atau di bawahnya (hanya `margin-inline` dan `padding-inline` yang mendorong elemen tetangga di kiri/kanannya).
- **Elemen `display: inline-block`:**
  - Mengalir sebaris seperti elemen `inline`, tetapi **menghormati `width`, `height`, `padding`, dan `margin` vertikal** layaknya elemen `block`. Sangat cocok untuk lencana (*badge*) atau tombol di tengah kalimat.

## 2. Lima Mode `position` di CSS

Properti `position` memungkinkan Anda mengeluarkan elemen dari aliran normal untuk menaruhnya di lokasi tertentu, menempelkannya di pojok kartu, atau menguncinya di layar saat halaman digulir:

| Nilai `position` | Apakah Tetap Mengambil Ruang di Aliran Normal? | Titik Acuan Koordinat (`top`/`right`/`bottom`/`left` atau `inset`) |
|---|---|---|
| **`static`** (bawaan) | **Ya** | Mengabaikan `top`, `right`, `bottom`, `left`, `inset`, dan `z-index`. |
| **`relative`** | **Ya** (ruang aslinya tetap terjaga) | Mengacu pada **posisi aslinya sendiri**. Sering dipakai bukan untuk digeser, melainkan untuk menjadi **jangkar acuan (*containing block*)** bagi anak yang memiliki `position: absolute`! |
| **`absolute`** | **Tidak** (dicabut dari aliran normal) | Mengacu pada **leluhur terdekat yang memiliki `position` selain `static`** (mis. `relative`, `fixed`, `sticky`). Jika tidak ada leluhur yang diposisikan, ia mengacu ke seluruh dokumen (`<html>`)! |
| **`fixed`** | **Tidak** (dicabut dari aliran normal) | Mengacu langsung pada **jendela layar (*viewport*)** peramban (kecuali leluhurnya memiliki `transform`, `filter`, atau `perspective`). Tetap diam saat halaman digulir. |
| **`sticky`** | **Ya** (mengalir normal sampai menyentuh batas gulir) | Mengalir seperti `relative` hingga mencapai ambang batas (mis. `top: 0`), lalu menempel seperti `fixed` **di dalam batas wadah induknya**. |

### Pola Klasik: Induk `relative` + Anak `absolute`

```css
.kartu-kelas {
  /* Menjadi jangkar batas koordinat bagi .lencana-baru */
  position: relative;
  padding: 1.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
}

.lencana-baru {
  position: absolute;
  /* Menggunakan properti logis: 0.75rem dari atas dan 0.75rem dari kanan */
  inset-block-start: 0.75rem;
  inset-inline-end: 0.75rem;
  background-color: #dcfce7;
  color: #166534;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
}
```

### Properti Singkatan `inset`
Daripada menulis empat baris `top: 0; right: 0; bottom: 0; left: 0;` untuk membuat lapisan penutup (*overlay*) penuh, gunakan properti **`inset`** (status **Baseline Widely Available**):

```css
.lapisan-penutup {
  position: fixed;
  inset: 0; /* Setara dengan top: 0; right: 0; bottom: 0; left: 0; */
  background-color: rgb(0 0 0 / 0.5);
}
```

## 3. Mengapa `position: sticky` Saya Tidak Mau Menempel?

Ini adalah salah satu masalah debugging CSS yang paling sering ditanyakan. Agar `position: sticky` bekerja, **tiga syarat mutlak** ini harus terpenuhi:

1. **Wajib menentukan minimal satu nilai ambang batas:** Misalnya `top: 0` (atau `inset-block-start: 0`). Tanpa `top`/`bottom`/`left`/`right`, elemen tidak tahu di titik mana ia harus mulai menempel!
2. **Wadah induknya harus memiliki ruang untuk digulir:** Elemen `sticky` tidak pernah bisa keluar dari batas kotak elemen induknya. Jika elemen `sticky` adalah satu-satunya anak di dalam `<div>` yang tingginya sama persis dengan elemen `sticky` tersebut, maka tidak ada ruang baginya untuk menempel.
3. **Tidak boleh ada leluhur yang memasang `overflow: hidden`, `overflow: auto`, atau `overflow: scroll`:** Jika salah satu pembungkus di atasnya memiliki `overflow: hidden`, elemen `sticky` akan kehilangan acuan gulir jendela utama! *(Tips: Jika Anda terpaksa memotong luapan horizontal pada wadah induk, gunakan **`overflow-x: clip`** alih-alih `overflow-x: hidden` karena `clip` tidak merusak `position: sticky`!)*.

## 4. `z-index` dan Misteri *Stacking Context*

Banyak pengembang kebingungan ketika mereka memberi `z-index: 99999` pada sebuah elemen, tetapi elemen tersebut tetap tertutup oleh elemen lain yang hanya memiliki `z-index: 2`. Mengapa demikian?

Jawabannya adalah **Stacking Context (Konteks Tumpukan)**:
- Nilai `z-index` **hanya dibandingkan di antara elemen-elemen yang berada di dalam *Stacking Context* yang sama**.
- Bayangkan *Stacking Context* seperti nomor lantai gedung (`Lantai 1`, `Lantai 2`), dan `z-index` anak di dalamnya seperti tinggi meja di dalam lantai tersebut (`Meja 99999`). Setiggi apa pun meja Anda di **Lantai 1** (`z-index: 99999`), meja itu tidak akan pernah bisa berada di atas karpet tipis yang berada di **Lantai 2** (`z-index: 2`)!

```text
Gedung Halaman Web (Root Stacking Context)
├── Header Navigasi (position: sticky; z-index: 10)  --> "Lantai 10"
└── Kontainer Artikel (position: relative; z-index: 1) --> "Lantai 1"
    └── Tooltip di dalam Artikel (position: absolute; z-index: 99999)
        (Tetap berada di dalam Lantai 1! Akan selalu tertutup oleh Header di Lantai 10!)
```

### Hal-Hal yang Menciptakan *Stacking Context* Baru:
Sebuah elemen otomatis membentuk "lantai" (*stacking context*) baru yang mengurung seluruh `z-index` anak-anaknya apabila elemen tersebut memiliki salah satu dari:
1. `position: relative` atau `absolute` yang disertai `z-index` selain `auto`; sedangkan `position: fixed` dan `position: sticky` selalu membentuk *stacking context* baru, bahkan ketika `z-index`-nya `auto`.
2. Anak dari Flexbox atau CSS Grid yang diberi `z-index` selain `auto`.
3. Nilai `opacity` kurang dari `1` (mis. `opacity: 0.99`).
4. Properti `transform`, `filter`, `backdrop-filter`, atau `perspective` selain `none`.
5. Properti **`isolation: isolate`** — cara paling bersih dan disengaja untuk mengurung `z-index` internal sebuah komponen tanpa efek samping visual!

```css
/* Mengisolasi tumpukan z-index di dalam komponen kartu agar tidak bocor keluar */
.komponen-kartu {
  isolation: isolate;
}
```

## Latihan Praktik: Membuat Bilah Navigasi Sticky dan Kartu Berlabel

Buatlah berkas `posisi-tumpukan.html` dan `posisi.css` yang berisi:
1. Sebuah `<header>` dengan `position: sticky; inset-block-start: 0; z-index: 20;` yang tetap menempel di bagian atas saat halaman digulir.
2. Beberapa komponen `.kartu` dengan `position: relative` dan `isolation: isolate` yang di pojok kanan atasnya memiliki lencana status `position: absolute`.
3. Pastikan ketika halaman digulir, lencana `position: absolute` milik kartu berjalan masuk di **bawah** `<header>` sticky, bukan menembus di atasnya!

## Kuis Pemahaman

### Soal 1
Apa yang terjadi jika Anda memberikan `position: absolute; top: 10px; right: 10px;` pada sebuah elemen `.lencana`, tetapi **tidak ada satu pun** elemen induk atau leluhurnya yang memiliki properti `position` (semua induknya masih `position: static`)?
- A. Properti `position: absolute` diabaikan oleh peramban.
- B. Elemen `.lencana` akan memosisikan dirinya mengacu pada *initial containing block* (pojok kanan atas halaman dokumen `<html>` secara keseluruhan), bukan di pojok kartu induknya.
- C. Elemen `.lencana` otomatis berubah menjadi `position: fixed`.
- D. Elemen induk terdekatnya otomatis diubah menjadi `position: relative` oleh peramban.

**Jawaban Benar:** B
**Penjelasan:** Elemen dengan `position: absolute` mencari leluhur terdekat yang memiliki nilai `position` selain `static` sebagai acuan koordinatnya. Jika tidak ditemukan hingga ke puncak pohon DOM, ia akan mengacu pada *initial containing block* (area dokumen `<html>`).

### Soal 2
Sebuah elemen `<aside>` diberi `position: sticky; top: 1rem;`, tetapi saat halaman digulir, elemen tersebut ikut tergulir hilang ke atas dan tidak menempel. Manakah penyebab yang paling mungkin?
- A. Elemen `<aside>` tidak diberi `z-index: 9999`.
- B. Salah satu elemen pembungkus (induk/leluhur) dari `<aside>` memiliki properti `overflow: hidden` atau `overflow: auto`, atau tinggi elemen `<aside>` sudah sama dengan tinggi kontainer induknya.
- C. `position: sticky` hanya bekerja pada elemen `<header>`.
- D. Nilai `top` pada `position: sticky` wajib ditulis dalam satuan `px`, tidak boleh `rem`.

**Jawaban Benar:** B
**Penjelasan:** Properti `overflow: hidden` atau `overflow: auto` pada elemen leluhur mengubah konteks gulir (*scroll container*), sehingga elemen `sticky` tidak lagi dapat mengacu pada guliran jendela utama. Selain itu, elemen `sticky` hanya dapat bergerak menempel di sepanjang ruang sisa di dalam kotak induknya.

### Soal 3
Properti CSS manakah yang secara khusus dirancang untuk menciptakan *Stacking Context* baru pada sebuah komponen tanpa perlu menambahkan `position`, `z-index`, atau `transform`?
- A. `display: inline-block`
- B. `isolation: isolate`
- C. `overflow: visible`
- D. `box-sizing: border-box`

**Jawaban Benar:** B
**Penjelasan:** Deklarasi `isolation: isolate` memiliki satu tugas tunggal yang bersih: membentuk *stacking context* baru pada elemen tersebut sehingga semua nilai `z-index` pada elemen anak di dalamnya terkurung rapi dan tidak berbenturan dengan elemen di luar komponen.

## Sumber
- [CSS layout — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout)
- [CSS: Cascading Style Sheets — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [Learn CSS — web.dev](https://web.dev/learn/css)
