# Peta Gambar (`<map>` & `<area>`) dan Elemen Penyematan (`<object>`, `<embed>`)

- **Tingkat:** Menengah
- **Ringkasan:** Membuat wilayah klik interaktif di atas gambar menggunakan `<map>` dan `<area>`, alternatif modern berbasis SVG interaktif, serta kapan menggunakan `<object>` untuk menyematkan dokumen PDF dengan konten cadangan.

## 1. Peta Gambar Klasik (`<map>` dan `<area>`) vs Alternatif SVG Modern

HTML menyediakan elemen **`<map>`** dan **`<area>`** untuk mendefinisikan beberapa wilayah klik (*clickable hotspots*) berbentuk persegi panjang (`shape="rect"`), lingkaran (`shape="circle"`), atau poligon (`shape="poly"`) di atas satu elemen `<img usemap="#nama-peta">`:

```html
<img
  src="/assets/topologi-jaringan.png"
  alt="Topologi jaringan dengan Router di kiri dan Server Database di kanan"
  width="600"
  height="300"
  usemap="#peta-topologi"
>

<map name="peta-topologi">
  <!-- Wilayah klik persegi panjang: x1, y1, x2, y2 -->
  <area
    shape="rect"
    coords="20,50,180,250"
    href="/materi/jaringan-router"
    alt="Pelajari konfigurasi Router Gateway"
  >
  <!-- Wilayah klik lingkaran: pusat-x, pusat-y, jari-jari -->
  <area
    shape="circle"
    coords="450,150,80"
    href="/materi/database-server"
    alt="Pelajari replikasi Server Database"
  >
</map>
```

> **⚠️ Kelemahan `<map>` / `<area>` pada Desain Responsif Modern:**
> Koordinat piksel di dalam atribut `coords="20,50,180,250"` **bersifat statis (tidak otomatis ikut menyusut saat gambar `<img>` mengecil di layar ponsel)**!
> **Solusi Modern Terbaik:** Untuk diagram interaktif atau peta wilayah yang harus 100% responsif di semua ukuran layar, gunakan **`<svg viewBox="...">` inline yang membungkus `<a href="...">` di sekitar elemen `<rect>` atau `<path>`**, karena koordinat di dalam `viewBox` SVG otomatis berskala secara proporsional!

```html
<!-- Alternatif Modern yang 100% Responsif dengan SVG Inline -->
<svg viewBox="0 0 600 300" role="group" aria-label="Diagram Topologi Interaktif">
  <a href="/materi/jaringan-router" aria-label="Pelajari konfigurasi Router Gateway">
    <rect x="20" y="50" width="160" height="200" rx="12" fill="#dbeafe" stroke="#2563eb" />
    <text x="100" y="155" text-anchor="middle" fill="#1e3a8a">Router Gateway</text>
  </a>
</svg>
```

## 2. Menyematkan Dokumen PDF dengan `<object>` dan Konten Fallback

Jika Anda ingin menampilkan pratinjau dokumen PDF langsung di dalam halaman, elemen **`<object>`** memiliki satu keunggulan besar dibandingkan `<iframe>`:
- Di dalam `<object data="panduan.pdf" type="application/pdf"> ... </object>`, Anda dapat menuliskan **konten HTML cadangan (*fallback*)** di antara tag pembuka dan penutupnya! Jika peramban pengguna (misalnya di beberapa perangkat seluler) tidak memiliki pembaca PDF tersemat, peramban otomatis menampilkan tautan unduhan di dalamnya:

```html
<object
  data="/assets/cheatsheet-linux.pdf"
  type="application/pdf"
  width="800"
  height="600"
  style="width: 100%;"
  aria-label="Pratinjau Lembar Contekan Perintah Linux"
>
  <p>
    Peramban Anda tidak mendukung tampilan PDF langsung di halaman ini.
    Silakan <a href="/assets/cheatsheet-linux.pdf" download>unduh berkas PDF (350 KB)</a>
    untuk membacanya.
  </p>
</object>
```

## Latihan Praktik: Diagram Arsitektur Interaktif dan Penyematan Dokumen

Buatlah berkas `peta-dan-objek.html`:
1. Buat satu gambar dengan `<map>` dan `<area>` lengkap dengan atribut `alt` pada setiap `<area>`.
2. Buat versi modernnya menggunakan `<svg viewBox="0 0 500 200">` yang memiliki dua area tautan `<a>` interaktif.
3. Tambahkan elemen `<object type="application/pdf">` lengkap dengan paragraf fallback unduhan.

## Kuis Pemahaman

### Soal 1
Mengapa setiap elemen `<area href="...">` di dalam `<map>` wajib memiliki atribut `alt`?
- A. Agar wilayah klik berwarna merah secara otomatis
- B. Karena setiap `<area href="...">` berfungsi sebagai tautan navigasi, sehingga atribut `alt` menjadi *accessible name* yang dibacakan oleh pembaca layar saat pengguna menavigasi titik-titik peta gambar dengan tombol `Tab`
- C. Karena tanpa `alt`, koordinat `coords` tidak dihitung
- D. Agar gambar utama dapat diunduh

**Jawaban Benar:** B
**Penjelasan:** Bagi pengguna pembaca layar dan papan ketik, setiap `<area>` adalah tautan interaktif. Atribut `alt` pada `<area>` menjelaskan tujuan dari wilayah tautan tersebut.

### Soal 2
Apa keunggulan menggunakan `<svg viewBox="...">` dengan elemen `<a>` di dalamnya dibandingkan `<map>` dan `<area coords="...">` untuk diagram interaktif di web modern?
- A. `<map>` tidak bisa digunakan pada gambar PNG
- B. Koordinat di dalam `viewBox` SVG otomatis membesar dan menyusut secara proporsional mengikuti lebar layar responsif, sedangkan angka piksel pada atribut `coords` di `<area>` bersifat tetap dan bergeser meleset ketika ukuran `<img>` menyusut di layar ponsel
- C. SVG tidak membutuhkan tag penutup
- D. `<area>` hanya mendukung maksimal 2 tautan

**Jawaban Benar:** B
**Penjelasan:** Nilai `coords` pada `<area>` dihitung berdasarkan piksel tetap dan tidak ikut diskalakan ketika `<img>` diubah ukurannya oleh CSS `max-width: 100%`, sedangkan sistem koordinat `viewBox` pada SVG selalu responsif.

### Soal 3
Apa manfaat menempatkan elemen `<p><a href="file.pdf" download>Unduh PDF</a></p>` di antara tag pembuka `<object data="file.pdf" type="application/pdf">` dan tag penutup `</object>`?
- A. Teks tersebut selalu tampil di atas PDF sebagai judul
- B. Teks tersebut berfungsi sebagai konten cadangan (*fallback*) yang otomatis ditampilkan oleh peramban apabila perangkat pengguna tidak mendukung penayangan PDF secara tersemat
- C. Teks tersebut menghapus PDF setelah dibaca
- D. Teks tersebut mempercepat pemuatan PDF

**Jawaban Benar:** B
**Penjelasan:** Elemen `<object>` merender konten anak di dalamnya hanya apabila sumber daya utama pada atribut `data` gagal dimuat atau tipe MIME-nya tidak didukung secara tersemat oleh peramban perangkat tersebut.

## Sumber
- [HTML elements reference (<map>, <area>, <object>) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
- [Using responsive images in HTML — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
