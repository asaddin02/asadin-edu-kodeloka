# Tata Letak Multi-Kolom (`columns`) dan Stylesheet Cetak (`@media print`)

- **Tingkat:** Menengah
- **Ringkasan:** Membagi aliran teks panjang atau daftar menjadi kolom-kolom koran otomatis dengan CSS Multi-column Layout (`columns`, `break-inside: avoid`), serta merancang halaman web yang rapi saat dicetak ke kertas atau diekspor ke PDF menggunakan `@media print` dan `@page`.

## 1. Tata Letak Multi-Kolom (*CSS Multi-Column Layout*)

Ketika Anda memiliki daftar pendek yang jumlah butirnya banyak (misalnya daftar 30 istilah indeks, daftar kota layanan, atau kumpulan kartu catatan dengan tinggi bervariasi) dan ingin membaginya mengalir dari atas ke bawah lalu lanjut ke kolom sebelah kanan layaknya surat kabar, gunakan modul **Multi-Column Layout**:

```css
.daftar-indeks {
  /* Otomatis membuat kolom dengan lebar ideal minimal 220px,
     dan maksimal sebanyak 3 kolom jika layar sangat lebar! */
  columns: 220px 3;
  column-gap: 2rem;
  column-rule: 1px solid #e2e8f0; /* Garis pemisah tipis otomatis di antara kolom */
}

.daftar-indeks > li,
.kartu-catatan {
  /* SANGAT PENTING: Mencegah satu kartu atau satu butir terpotong terbelah dua
     antara bagian bawah Kolom 1 dan bagian atas Kolom 2! */
  break-inside: avoid;
}

.judul-bab-indeks {
  /* Memaksa subjudul merentang penuh melintasi seluruh kolom dari kiri ke kanan */
  column-span: all;
  margin-block: 1.5rem 0.75rem;
}
```

> **💡 Kapan Memilih `columns` vs CSS Grid?**
> - Gunakan **CSS Grid** jika urutan baca item harus mengalir dari **kiri ke kanan** per baris (`1 -> 2 -> 3` di baris atas, lalu `4 -> 5 -> 6` di baris kedua).
> - Gunakan **Multi-Column (`columns`)** jika konten adalah teks panjang atau daftar abjad yang urutan bacanya mengalir dari **atas ke bawah** di kolom pertama terlebih dahulu, baru berlanjut ke atas kolom kedua!

## 2. Mengapa Setiap Situs Dokumentasi dan Faktur Wajib Memiliki `@media print`?

Pernahkah Anda menekan **`Ctrl + P`** (*Print / Save as PDF*) pada sebuah halaman artikel teknis, tagihan (*invoice*), atau tiket pendaftaran, lalu hasilnya menghabiskan 6 lembar kertas yang penuh dengan bilah navigasi atas, tombol pencarian, iklan samping, dan teks abu-abu pucat yang tidak terbaca?

Dengan menambahkan blok **`@media print`** yang hanya terdiri dari 30 baris di akhir berkas CSS Anda, halaman web yang sama akan otomatis berubah menjadi dokumen cetak/PDF yang bersih dan profesional saat pengguna menekan `Ctrl + P`!

### Lima Aturan Emas Merancang `@media print`:
1. **Sembunyikan elemen antarmuka yang tidak berguna di atas kertas (`display: none !important`):** Bilah navigasi `<header>`/`<nav>`, kotak `<search>`, `<aside>` iklan, tombol aksi interaktif, dan pemutar `<video>`.
2. **Paksa warna latar menjadi putih dan teks menjadi hitam pekat (`#000000`):** Menghemat tinta printer dan memastikan keterbacaan maksimal, bahkan jika pengguna sedang membuka situs dalam *Dark Mode*!
3. **Rentangkan lebar konten utama menjadi `100%` dan matikan `overflow: auto/hidden`:** Jika sebuah pembungkus memiliki `overflow: auto`/`hidden` atau tinggi tetap, saat dicetak ke kertas isinya dapat terpotong hanya sebatas layar pertama (dan elemen `position: sticky`/`fixed` juga kerap berperilaku tidak terduga di kertas)!
4. **Cegah pemotongan elemen di pergantian halaman kertas (`break-inside: avoid` dan `break-after: avoid`):**
   - Jangan biarkan judul `<h2>` tertinggal sendirian di baris paling bawah halaman 1 sementara paragraf penjelasannya berada di halaman 2 (**`h2, h3 { break-after: avoid; }`**)!
   - Jangan biarkan blok kode `<pre>`, `<blockquote>`, `<figure>`, atau `<tr>` tabel terbelah dua di tengah pergantian lembar kertas (**`pre, blockquote, figure, tr { break-inside: avoid; }`**)!
5. **Tampilkan alamat URL asli di sebelah tautan eksternal:** Di atas kertas, tautan tidak bisa diklik; kita bisa mencetak URL-nya secara otomatis menggunakan `a[href^="https://"]::after { content: " (" attr(href) ")"; }`!

```css
/* Aturan ukuran margin lembar kertas cetak */
@page {
  size: A4 portrait;
  margin: 2cm;
}

@media print {
  /* 1. Sembunyikan elemen navigasi dan kontrol interaktif */
  header,
  nav,
  search,
  aside,
  footer,
  button,
  .sembunyi-cetak {
    display: none !important;
  }

  /* 2. Pastikan teks hitam di atas kertas putih meskipun pengguna sedang di Mode Gelap */
  body {
    background: #ffffff !important;
    color: #000000 !important;
    font-size: 11pt;
    line-height: 1.5;
  }

  main,
  article,
  .kontainer {
    inline-size: 100% !important;
    max-inline-size: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* 3. Jaga agar judul tidak terpisah dari paragraf di bawahnya */
  h1, h2, h3, h4 {
    break-after: avoid;
    page-break-after: avoid;
  }

  /* 4. Jaga agar blok kode, gambar, dan baris tabel tidak terpotong di tengah kertas */
  pre, blockquote, figure, table, tr, img {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  pre {
    white-space: pre-wrap; /* Agar baris kode panjang tidak terpotong di tepi kanan kertas */
    border: 1px solid #94a3b8;
  }

  /* 5. Cetak alamat URL untuk tautan referensi eksternal */
  article a[href^="https://"]::after {
    content: " (" attr(href) ")";
    font-size: 0.85em;
    font-weight: normal;
    word-break: break-all;
  }
}
```

> **💡 Cara Menguji `@media print` Tanpa Menghabiskan Kertas atau Membuka Dialog Print:**
> Buka **Developer Tools (`F12`)** → buka panel **Rendering** → pada bagian *Emulate CSS media type*, ubah pilihan dari *No emulation* menjadi **`print`**. Tampilan halaman Anda di peramban akan langsung berubah ke mode cetak sehingga Anda bisa menginspeksi elemennya secara langsung!

## Latihan Praktik: Menyiapkan Halaman Sertifikat / Modul Siap Cetak ke PDF

Buatlah berkas `modul-siap-cetak.html` dan `cetak.css`:
1. Buat halaman modul yang memiliki `<nav>`, `<aside>`, daftar glosarium 2 kolom dengan `columns: 240px 2` dan `break-inside: avoid`, serta artikel utama dengan blok `<pre><code>` dan tautan referensi `https://...`.
2. Tambahkan blok `@page` dan `@media print` lengkap.
3. Aktifkan emulasi media `print` di DevTools dan pastikan navigasi hilang, blok kode membungkus barisnya dengan rapi (`white-space: pre-wrap`), serta URL referensi tercetak otomatis di samping teks tautan!

## Kuis Pemahaman

### Soal 1
Deklarasi CSS apakah yang harus dipasang pada elemen anak di dalam tata letak Multi-Column (`columns: 3`) atau di dalam `@media print` agar elemen tersebut (misalnya kartu atau blok `<pre>`) tidak terpotong terbelah dua saat berpindah kolom atau berpindah halaman kertas?
- A. `overflow: hidden;`
- B. `break-inside: avoid;`
- C. `column-span: all;`
- D. `white-space: nowrap;`

**Jawaban Benar:** B
**Penjelasan:** Properti `break-inside: avoid` menginstruksikan mesin fragmentasi CSS (baik pada kolom multi-kolom maupun halaman cetak) untuk memindahkan seluruh kotak elemen tersebut secara utuh ke kolom atau lembar halaman berikutnya apabila ruang yang tersisa di bagian bawah tidak mencukupi.

### Soal 2
Dalam aturan `@media print`, mengapa kita perlu menambahkan `h2, h3 { break-after: avoid; }`?
- A. Agar setiap judul `<h2>` selalu dicetak dengan huruf kapital.
- B. Untuk mencegah judul bab tercetak sendirian di baris paling bawah sebuah halaman kertas sementara paragraf pertama bab tersebut baru muncul di halaman kertas berikutnya.
- C. Untuk menghapus jarak margin di bawah `<h2>`.
- D. Agar setiap `<h2>` disembunyikan saat dicetak.

**Jawaban Benar:** B
**Penjelasan:** `break-after: avoid` mengikat elemen judul dengan blok konten tepat setelahnya, sehingga jika ruang di bagian bawah halaman kertas tidak cukup untuk memuat judul beserta minimal baris awal paragrafnya, judul tersebut otomatis ikut dibawa pindah ke awal halaman berikutnya.

### Soal 3
Bagaimana cara menampilkan isi atribut `href` dari sebuah tautan `<a href="https://kodeloka.asadinedu.com">Kodeloka</a>` secara otomatis di dalam tanda kurung saat halaman dicetak ke kertas menggunakan CSS?
- A. `a::after { content: href; }`
- B. `a::after { content: " (" attr(href) ")"; }`
- C. `a { display: url; }`
- D. Tidak mungkin dilakukan dengan CSS; wajib menggunakan JavaScript.

**Jawaban Benar:** B
**Penjelasan:** Fungsi CSS `attr(nama-atribut)` di dalam properti `content` pada pseudo-element `::before` atau `::after` dapat mengambil nilai string dari atribut HTML mana pun pada elemen tersebut dan menggabungkannya dengan string teks lainnya.

## Sumber
- [Printing — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing)
- [Multiple-column layout — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Multicol_layout)
- [`@page` CSS at-rule — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@page)
