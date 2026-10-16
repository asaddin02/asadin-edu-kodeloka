# Arsitektur CSS Skala Aplikasi, Konvensi BEM, dan Debugging di DevTools

- **Tingkat:** Lanjut
- **Ringkasan:** Mengelola kode CSS pada proyek besar agar tetap rapi dan bebas benturan nama menggunakan konvensi penamaan BEM, struktur lapisan `@layer`, desain token, serta teknik sistematis mendiagnosis masalah tata letak menggunakan Browser DevTools.

## Mengapa Proyek CSS yang Membesar Sering Menjadi "Append-Only Stylesheet"?

Pada proyek kecil dengan 100 baris CSS, menamai kelas secara acak seperti `.biru`, `.kotak-kiri`, atau `.header ul li a` terasa cepat. Namun, ketika tim bertambah besar dan kode mencapai ribuan baris, muncul ketakutan klasik: **pengembang takut menghapus atau mengubah aturan CSS yang sudah ada karena khawatir merusak halaman lain yang tidak terduga**. Akibatnya, orang hanya berani menambahkan aturan baru di baris paling bawah berkas CSS (*append-only stylesheet*).

Untuk mencegah kekacauan tersebut, kita membutuhkan **arsitektur penamaan dan pelapisan yang terprediksi**.

## 1. Konvensi Penamaan BEM (*Block, Element, Modifier*)

**BEM** adalah metodologi penamaan kelas yang membuat hubungan struktur komponen terlihat jelas langsung dari nama kelasnya, sekaligus menjaga **spesifisitas tetap datar di `(0, 1, 0)`** (satu kelas tunggal):

1. **Block (`nama-blok`):** Komponen mandiri yang bermakna utuh dan dapat dipindahkan ke mana saja. Contoh: `.kartu-modul`, `.navigasi-utama`, `.form-masuk`.
2. **Element (`nama-blok__nama-elemen` — dipisahkan dua garis bawah `__`):** Bagian internal dari suatu *Block* yang tidak memiliki arti mandiri di luar blok tersebut. Contoh: `.kartu-modul__judul`, `.kartu-modul__ringkasan`, `.kartu-modul__kaki`.
3. **Modifier (`nama-blok--variasi` atau `nama-blok__elemen--variasi` — dipisahkan dua tanda hubung `--`):** Penanda variasi tampilan, ukuran, atau status dari *Block* maupun *Element*. Contoh: `.kartu-modul--unggulan`, `.tombol--bahaya`, `.tombol--besar`.

```html
<!-- Contoh Penerapan BEM yang Bersih dan Terbaca -->
<article class="kartu-modul kartu-modul--unggulan">
  <header class="kartu-modul__kepala">
    <span class="kartu-modul__lencana">Baru</span>
    <h3 class="kartu-modul__judul">Arsitektur CSS Modern</h3>
  </header>
  <p class="kartu-modul__ringkasan">
    Pelajari cara menyusun stylesheet yang mudah dirawat untuk jangka panjang.
  </p>
  <footer class="kartu-modul__kaki">
    <a href="/css/materi/12/" class="tombol tombol--utama">Mulai Belajar</a>
  </footer>
</article>
```

> **⚠️ Kesalahan Umum BEM: Menulis `blok__elemen1__elemen2`!**
> Jangan pernah mencerminkan kedalaman sarang HTML di dalam nama kelas BEM seperti `.kartu-modul__kepala__judul`! Jika suatu saat `<h3 class="kartu-modul__judul">` dipindahkan keluar dari `<header class="kartu-modul__kepala">`, nama kelas `.kartu-modul__judul` tetap valid dan Anda tidak perlu mengubah CSS sedikit pun. Selalu gunakan maksimal satu pasang `__` (`blok__elemen`).

## 2. Menggabungkan Arsitektur Lapisan (`@layer`) dengan Design Tokens

Dalam proyek modern, kita dapat memadukan kejelasan nama komponen dengan ketegasan urutan **`@layer`**:

```css
/* Urutan arsitektur dari paling dasar ke paling spesifik */
@layer reset, token, dasar, tata-letak, komponen, utilitas;

/* 1. Reset perbedaan bawaan antar-peramban */
@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
  body, h1, h2, h3, p, figure { margin: 0; }
  img, picture, video, svg { display: block; max-inline-size: 100%; }
  input, button, textarea, select { font: inherit; }
}

/* 2. Design Tokens (Sumber kebenaran tunggal untuk warna, ukuran, dan spasi) */
@layer token {
  :root {
    color-scheme: light dark;
    --warna-permukaan: light-dark(oklch(99% 0.002 250), oklch(17% 0.015 250));
    --warna-teks:      light-dark(oklch(20% 0.02 250),  oklch(94% 0.01 250));
    --warna-aksen:     oklch(58% 0.2 255);
    --spasi-sm: 0.5rem;
    --spasi-md: 1rem;
    --spasi-lg: 1.5rem;
    --radius-md: 0.5rem;
  }
}

/* 3. Gaya Dasar Elemen HTML Tanpa Kelas */
@layer dasar {
  body {
    font-family: system-ui, sans-serif;
    line-height: 1.6;
    background-color: var(--warna-permukaan);
    color: var(--warna-teks);
  }
}

/* 4. Kerangka Tata Letak Makro */
@layer tata-letak {
  .kontainer {
    inline-size: min(100% - 2rem, 1140px);
    margin-inline: auto;
  }
}

/* 5. Komponen Mandiri */
@layer komponen {
  .kartu-modul {
    padding: var(--spasi-lg);
    border-radius: var(--radius-md);
  }
}

/* 6. Kelas Utilitas Satu Fungsi (Selalu menang atas komponen tanpa !important) */
@layer utilitas {
  .rata-tengah { text-align: center; }
  .sembunyi-visual {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}
```

Perhatikan kelas `.sembunyi-visual` (*visually-hidden / sr-only*) di atas: pola standar ini menyembunyikan teks secara visual dari layar, tetapi **tetap membiarkannya dibaca oleh pembaca layar** (berbeda dengan `display: none` atau `visibility: hidden` yang membungkam pembaca layar).

## 3. Debugging CSS Secara Sistematis di Browser DevTools

Jangan pernah memperbaiki masalah CSS dengan cara menebak-nebak dan menambahkan properti secara acak! Gunakan alat inspeksi bawaan peramban (**Developer Tools — `F12`**) secara sistematis:

### Langkah 1: Periksa Tab *Styles* dan *Computed*
1. Klik kanan elemen yang bermasalah → **Inspect**.
2. Di panel **Styles**, perhatikan aturan mana yang **dicoret (*strikethrough*)**. Aturan yang dicoret berarti kalah dalam algoritma Cascade/spesifisitas, atau memiliki nilai sintaks yang tidak valid (ditandai ikon peringatan kuning ⚠️).
3. Buka tab **Computed** di sebelah tab *Styles*. Tab ini menampilkan **nilai akhir sesungguhnya dalam piksel** setelah seluruh perhitungan `rem`, `calc()`, dan kaskade selesai. Klik panah kecil di samping properti (misalnya `color` atau `width`) untuk langsung melompat ke baris CSS pemenang yang menetapkan nilai tersebut!

### Langkah 2: Aktifkan Lencana Visual `grid` dan `flex` di Pohon DOM
Di dalam panel **Elements / Inspector**, perhatikan adanya lencana kecil bertuliskan **`grid`**, **`subgrid`**, **`flex`**, atau **`container`** di samping tag HTML.
- Klik lencana **`grid`** atau **`flex`** tersebut! Peramban akan langsung menggambar garis bantu nomor kolom, area `gap` yang diarsir, dan batas jalur tepat di atas halaman web Anda.

### Langkah 3: Memaksa Status Interaksi (`:hover`, `:focus-visible`, `:active`)
Ingin memeriksa tampilan menu yang hanya muncul saat `:hover` atau `:focus-visible` tanpa harus menahan tetikus?
- Di panel **Styles**, klik tombol **`:hov`** (*Toggle Element State*), lalu centang kotak `:hover`, `:focus`, `:focus-visible`, atau `:active`. Anda juga dapat mengemulasikan tema gelap (`prefers-color-scheme: dark`) dan `prefers-reduced-motion` langsung lewat tab **Rendering** di DevTools Chrome/Edge, atau lewat tombol simulasi skema warna di panel **Rules** pada Firefox!

### Langkah 4: Mencari Penyebab Munculnya Scrollbar Horizontal Misterius
Jika halaman ponsel Anda tiba-tiba bisa digeser ke kanan (ada elemen yang meluber keluar layar), jalankan skrip singkat ini di **Console DevTools** untuk mencetak elemen mana pun yang tepi kanannya melewati lebar layar:

```js
// Jalankan di Console DevTools untuk menemukan elemen yang bocor melewati lebar viewport
const lebarLayar = document.documentElement.clientWidth;
document.querySelectorAll("*").forEach((el) => {
  const kanan = el.getBoundingClientRect().right;
  if (kanan > lebarLayar) {
    console.warn("Elemen meluber:", el, Math.round(kanan));
  }
});
```

## Latihan Praktik: Merapikan Stylesheet yang Berantakan ke Arsitektur BEM & `@layer`

Buatlah berkas `arsitektur-bem.html` dan `arsitektur.css`:
1. Susun `@layer reset, token, dasar, komponen, utilitas;` di awal berkas CSS.
2. Buat komponen `.panel-peringatan` dengan elemen `.panel-peringatan__ikon`, `.panel-peringatan__isi`, serta dua variasi modifier `.panel-peringatan--info` dan `.panel-peringatan--bahaya` yang hanya mengubah nilai variabel `--warna-panel` di dalamnya.
3. Sertakan kelas utilitas `.sembunyi-visual` untuk memberikan keterangan tambahan khusus pembaca layar.

## Kuis Pemahaman

### Soal 1
Dalam metodologi penamaan kelas **BEM (*Block, Element, Modifier*)**, bagaimana cara penulisan nama kelas yang tepat untuk elemen **judul** yang berada di dalam komponen **kartu berita**, serta variasi kartu berita yang berstatus **utama**?
- A. `.kartu-berita-judul` dan `.kartu-berita.utama`
- B. `.kartu-berita__judul` dan `.kartu-berita--utama`
- C. `.kartuBerita__judul` dan `.kartuBerita_utama`
- D. `#kartu-berita .judul` dan `#kartu-berita.utama`

**Jawaban Benar:** B
**Penjelasan:** Dalam konvensi BEM standar, *Element* (bagian internal dari blok) dipisahkan dengan dua garis bawah (`__` → `.kartu-berita__judul`), sedangkan *Modifier* (variasi tampilan atau status) dipisahkan dengan dua tanda hubung (`--` → `.kartu-berita--utama`).

### Soal 2
Mengapa kita membutuhkan kelas utilitas `.sembunyi-visual` (*visually-hidden*) yang menggunakan `width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);` alih-alih cukup menulis `display: none;`?
- A. Karena `display: none` tidak didukung di dalam Flexbox.
- B. Karena `display: none` menyembunyikan elemen secara visual sekaligus menghapusnya dari *Accessibility Tree* sehingga tidak dibacakan oleh pembaca layar, sedangkan `.sembunyi-visual` menyembunyikan teks dari layar namun tetap membiarkannya dibaca oleh pembaca layar.
- C. Karena `display: none` memperlambat pemuatan halaman.
- D. Karena `.sembunyi-visual` membuat teks otomatis diterjemahkan ke bahasa lain.

**Jawaban Benar:** B
**Penjelasan:** Sering kali suatu komponen sudah jelas secara visual bagi pengguna awas (misalnya tabel dengan kolom tombol aksi tanpa judul teks), tetapi tetap membutuhkan label teks bagi pengguna pembaca layar. Pola `.sembunyi-visual` menyembunyikan teks secara visual tanpa menghilangkannya dari pembaca layar.

### Soal 3
Ketika Anda melihat sebuah deklarasi CSS dicoret (*strikethrough*) tanpa tanda peringatan kuning di panel **Styles** pada Browser DevTools, apa arti dari coretan tersebut?
- A. Properti CSS tersebut salah ketik atau tidak dikenali oleh peramban.
- B. Deklarasi tersebut valid secara sintaks, tetapi kalah prioritas (ditimpa) oleh aturan CSS lain yang berada di `@layer` lebih tinggi, memiliki spesifisitas lebih tinggi, atau ditulis lebih bawah.
- C. Berkas CSS gagal diunduh dari server dengan status 404.
- D. Elemen HTML tersebut sedang disembunyikan dengan atribut `hidden`.

**Jawaban Benar:** B
**Penjelasan:** Di DevTools, sintaks yang tidak valid ditandai dengan ikon peringatan kuning. Deklarasi yang dicoret bersih tanpa ikon peringatan menandakan bahwa aturan tersebut cocok dengan elemen, namun nilainya dikalahkan oleh deklarasi pemenang lain di dalam algoritma Cascade.

## Sumber
- [Organizing your CSS — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Organizing)
- [Debugging CSS — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Debugging_CSS)
- [CSS cascading and inheritance — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade)
