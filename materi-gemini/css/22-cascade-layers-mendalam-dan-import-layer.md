# Arsitektur `@layer` Lanjutan: Sub-Layer Bersarang, `@import layer()`, dan `revert-layer`

- **Tingkat:** Lanjut
- **Ringkasan:** Mengorganisasikan stylesheet pihak ketiga dan desain sistem menggunakan `@import url(...) layer(vendor)`, lapisan bersarang `komponen.tombol`, serta memutar balik nilai dengan `revert-layer`.

## Mengapa `@layer` Perlu Dipelajari Lebih Dalam?

Pelajaran 02 memperkenalkan `@layer` sebagai cara mengatur prioritas tanpa perang spesifisitas. Pada proyek nyata Anda akan menghadapi tiga pertanyaan lanjutan: bagaimana memasukkan CSS pihak ketiga (misalnya pustaka komponen) ke dalam lapisan tertentu, bagaimana mengelompokkan lapisan di dalam lapisan, dan apa yang terjadi pada deklarasi `!important`. Pelajaran ini menjawab ketiganya, lalu membahas kata kunci `revert-layer`.

Ingat dua aturan dasarnya: (1) dalam algoritma Cascade, **urutan lapisan dinilai sebelum spesifisitas**; (2) untuk deklarasi normal, **lapisan yang dideklarasikan belakangan menang**, dan gaya di luar `@layer` (*unlayered*) mengalahkan semua gaya berlapis. `@layer` berstatus **Baseline Widely Available** (lintas peramban sejak Maret 2022).

## 1. Menetapkan Urutan Lebih Dulu dengan Pernyataan `@layer`

Urutan lapisan ditentukan oleh **kemunculan pertama namanya**. Cara paling jelas adalah mendeklarasikan semua nama di baris pertama stylesheet:

```css
@layer reset, vendor, dasar, komponen, utilitas;

@layer komponen {
  .kartu a { color: oklch(50% 0.2 255); }
}

/* Nama yang sama dipakai lagi: isi ditambahkan ke lapisan "reset",
   posisinya tetap paling rendah karena sudah dideklarasikan di baris pertama */
@layer reset {
  a { color: inherit; }
}
```

Lapisan **anonim** dibuat dengan `@layer { ... }` tanpa nama. Isinya tidak bisa ditambah lagi di tempat lain, jadi cocok untuk satu kali pakai saja.

## 2. Lapisan Bersarang (*Nested Layers*)

Lapisan dapat berisi lapisan lain. Ada dua penulisan yang setara:

```css
@layer komponen {
  @layer dasar, varian;      /* urutan sub-lapisan: dasar < varian */

  @layer dasar {
    .tombol { padding: 0.5rem 1rem; }
  }
  @layer varian {
    .tombol.utama { background-color: oklch(55% 0.2 255); }
  }
}

/* Cara lain: tambahkan ke sub-lapisan dari luar memakai tanda titik */
@layer komponen.varian {
  .tombol.bahaya { background-color: oklch(55% 0.22 25); }
}
```

Aturan urutannya:
- Sub-lapisan hanya bersaing dengan saudaranya di dalam lapisan induk yang sama. Urutan antar-induk tetap menentukan hasil akhir: seluruh isi `komponen` (termasuk sub-lapisannya) dibandingkan dengan lapisan `utilitas` sebagai satu kesatuan.
- Gaya yang ditulis **langsung** di lapisan induk (di luar sub-lapisan) mengalahkan gaya dalam sub-lapisannya, mirip dengan "gaya tanpa lapisan mengalahkan gaya berlapis".

## 3. Memasukkan CSS Pihak Ketiga dengan `@import ... layer()`

Stylesheet eksternal dapat langsung ditempatkan ke dalam lapisan saat diimpor, tanpa mengedit berkasnya:

```css
@layer reset, vendor, dasar, komponen, utilitas;

/* @import harus berada di awal berkas, hanya boleh didahului pernyataan @layer dan @charset */
@import url("pustaka-komponen.css") layer(vendor);
@import url("reset-modern.css") layer(reset);
@import url("cetak.css") layer(utilitas) print;   /* bisa digabung dengan media query */
```

Dengan cara ini, seluruh aturan pustaka pihak ketiga (yang mungkin berselektor sangat spesifik) otomatis berada di lapisan `vendor` yang prioritasnya lebih rendah daripada `komponen` Anda, sehingga cukup selektor sederhana untuk menimpanya. Anda juga bisa memakai `layer` tanpa nama (`@import url("x.css") layer;`) untuk lapisan anonim.

> **⚠️ Catatan Performa:** Pada produksi, `@import` membuat berkas dimuat berantai (peramban baru mengetahui berkas kedua setelah berkas pertama diunduh dan diurai). Untuk performa terbaik, gabungkan berkas lewat *build tool*, atau muat dengan `<link rel="stylesheet">` lalu atur urutan lapisan lewat pernyataan `@layer` di awal CSS Anda.

## 4. `!important` Membalik Urutan Lapisan

Untuk deklarasi dengan `!important`, urutan prioritas lapisan **dibalik**:
- Untuk deklarasi **normal**: lapisan belakangan menang, dan gaya tanpa lapisan menang atas semua lapisan.
- Untuk deklarasi **`!important`**: lapisan yang **lebih awal** menang, dan `!important` di dalam lapisan mengalahkan `!important` tanpa lapisan.

Tujuannya agar lapisan dasar (misalnya `reset` atau `vendor`) dapat memaksakan aturan penting yang tidak bisa ditimpa oleh lapisan di atasnya. Karena itu, jangan memakai `!important` sembarangan di dalam arsitektur berlapis; ia justru membuat urutannya berbalik dan sulit ditebak.

## 5. `revert-layer`: Membatalkan Nilai pada Lapisan Saat Ini

Kata kunci `revert-layer` "menggulung balik" properti ke nilai yang akan berlaku **seandainya lapisan saat ini tidak menetapkan properti itu**, yaitu nilai dari lapisan yang lebih rendah. Jika tidak ada lapisan sebelumnya dalam origin yang sama yang menetapkannya, nilai kembali ke origin berikutnya (gaya pengguna/bawaan peramban), seperti `revert`.

```css
@layer satu, dua;

@layer satu {
  div { height: 100px; }
}

@layer dua {
  div { height: 200px; }
  div.reset { height: revert-layer; }   /* kembali ke nilai di lapisan "satu" */
}
```

Elemen `<div class="reset">` bertinggi `100px`: `revert-layer` membuang seluruh deklarasi `height` di lapisan `dua` untuk elemen itu, sehingga nilai dari lapisan `satu` yang tampil. Kata kunci ini berguna, misalnya, untuk varian komponen yang ingin "mencabut" penyesuaian lapisan tema tanpa harus mengulang nilai aslinya.

## Kesalahan Umum dan Cara Menghindarinya

1. **Menaruh `@import` setelah aturan lain.** `@import` yang muncul setelah aturan CSS biasa akan diabaikan. Letakkan di paling atas (hanya `@charset` dan pernyataan `@layer` yang boleh mendahuluinya).
2. **Mengira spesifisitas bisa menyelamatkan gaya di lapisan yang lebih rendah.** Antar-lapisan, spesifisitas tidak berperan sama sekali; hanya urutan lapisan.
3. **Meninggalkan sebagian gaya komponen tanpa lapisan.** Gaya tanpa lapisan mengalahkan semua gaya berlapis, termasuk `utilitas`. Masukkan semua gaya ke lapisan.
4. **Memakai `!important` dan lupa urutannya terbalik.** `!important` di lapisan `reset` justru mengalahkan `!important` di lapisan `utilitas`.

## Latihan Praktik: Menjinakkan CSS Pihak Ketiga

Buatlah berkas `layer-lanjut.html`, `app.css`, dan `pustaka.css`:
1. Di `pustaka.css`, tulis aturan berselektor sangat spesifik, misalnya `body .wadah .kartu a.tombol { background: red; }`.
2. Di `app.css`, deklarasikan `@layer vendor, komponen, utilitas;`, impor `pustaka.css` dengan `layer(vendor)`, lalu timpa tombol tersebut dengan `.tombol { background: blue; }` di lapisan `komponen` (tanpa `!important`).
3. Buat sub-lapisan `komponen.varian` dan pastikan gaya di dalamnya mengalahkan `komponen.dasar`.
4. Tambahkan satu aturan yang memakai `revert-layer` untuk membatalkan nilai `padding` dari lapisan `utilitas` pada elemen tertentu, lalu amati hasilnya di panel Styles DevTools.

## Kuis Pemahaman

### Soal 1
Diberikan `@layer dasar, tema;`. Di lapisan `dasar` ada `#judul.judul { color: red; }` dan di lapisan `tema` ada `.judul { color: green; }`. Elemen `<h1 id="judul" class="judul">` berwarna apa?
- A. Merah, karena selektor ID lebih spesifik.
- B. Merah, karena `dasar` ditulis lebih dulu di berkas.
- C. Hitam, karena kedua aturan saling membatalkan.
- D. Hijau, karena `tema` dideklarasikan setelah `dasar` dan urutan lapisan dinilai sebelum spesifisitas.

**Jawaban Benar:** D
**Penjelasan:** Untuk deklarasi normal, lapisan yang dideklarasikan belakangan menang tanpa memandang spesifisitas. Pernyataan `@layer dasar, tema;` menetapkan `tema` di atas `dasar`.

### Soal 2
Manakah baris yang benar untuk mengimpor `vendor.css` ke dalam lapisan bernama `vendor`?
- A. `@import url("vendor.css") layer(vendor);`
- B. `@layer vendor url("vendor.css");`
- C. `@import layer(vendor) "vendor.css";`
- D. `@import url("vendor.css") @layer vendor;`

**Jawaban Benar:** A
**Penjelasan:** Sintaks yang benar adalah `@import url(...) layer(nama)`. Fungsi `layer()` ditulis setelah URL, dan dapat diikuti kondisi seperti `supports()` atau media query.

### Soal 3
Diberikan `@layer satu { div { height: 100px; } }` dan `@layer dua { div { height: 200px; } div.reset { height: revert-layer; } }`. Berapa tinggi `<div class="reset">`?
- A. `200px`
- B. `100px`
- C. `auto`, karena `revert-layer` selalu mengembalikan nilai awal properti.
- D. `0`, karena `revert-layer` menghapus properti.

**Jawaban Benar:** B
**Penjelasan:** `revert-layer` menghitung nilai seolah-olah tidak ada deklarasi `height` di lapisan saat ini (`dua`), sehingga nilai dari lapisan sebelumnya (`satu`), yaitu `100px`, yang berlaku.

## Sumber
- [`@layer` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer)
- [`@import` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@import)
- [`revert-layer` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/revert-layer)
- [CSS Cascading and Inheritance Level 5 — W3C](https://www.w3.org/TR/css-cascade-5/)
