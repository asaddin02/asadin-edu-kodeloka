# Optimasi Elemen `<img>` untuk LCP & CLS: `fetchpriority`, `decoding="async"`, dan Ukuran Intrinsik

- **Tingkat:** Lanjut
- **Ringkasan:** Menganalisis dampak atribut `fetchpriority="high"`, `loading="lazy"`, `decoding="async"`, serta dimensi `width`/`height` terhadap metrik Core Web Vitals (LCP dan CLS) pada halaman produksi.

## Mengapa Markup `<img>` Berdampak Langsung pada Skor Core Web Vitals?

Pada lebih dari 70% halaman web di internet, elemen terbesar yang pertama kali terlihat oleh pengguna di layar atas (*above the fold*) adalah sebuah gambar—entah itu foto sampul artikel, spanduk produk unggulan, atau ilustrasi utama. Kecepatan tampilnya gambar utama ini menentukan metrik **Largest Contentful Paint (LCP)** (target baik: **≤ 2,5 detik**), sedangkan ketiadaan dimensi gambar menentukan metrik **Cumulative Layout Shift (CLS)** (target baik: **≤ 0,1**).

Melalui kombinasi atribut HTML `width`, `height`, `fetchpriority`, `loading`, dan `decoding`, Anda dapat menginstruksikan pemindai prapemuat (*preload scanner*) peramban untuk mengunduh gambar terpenting secepat mungkin tanpa menggeser tata letak halaman.

## 1. Mencegah Pergeseran Tata Letak (CLS) dengan Ukuran Intrinsik (`width` & `height`)

Sebelum berkas gambar selesai diunduh dari jaringan, peramban belum mengetahui berapa piksel lebar dan tinggi gambar tersebut. Jika tag `<img>` hanya memiliki `src` dan `alt`, peramban awalnya merender kotak setinggi `0px`. Begitu gambar selesai diunduh 500 milidetik kemudian, gambar mendadak mendorong seluruh paragraf di bawahnya turun ke bawah—menciptakan **Layout Shift** yang sangat mengganggu pembaca.

Dengan selalu menyertakan atribut **`width`** dan **`height`** berupa bilangan bulat piksel asli gambar (misalnya `width="1200" height="630"`), mesin peramban langsung menghitung rasio aspek internal (`aspect-ratio: auto 1200 / 630`) sejak milidetik pertama HTML diurai. Ketika dipadukan dengan aturan CSS responsif:

```css
img {
  max-width: 100%;
  height: auto;
}
```

Peramban akan langsung memesan ruang kosong dengan proporsi tinggi yang tepat di segala ukuran layar ponsel maupun desktop sebelum satu byte gambar pun tiba!

## 2. Mengatur Prioritas Unduhan dan Pemuatan: `fetchpriority`, `loading`, dan `decoding`

Secara bawaan, saat peramban mengurai HTML di awal pemuatan halaman, ia belum tahu apakah sebuah `<img>` berada di layar atas (terlihat langsung) atau jauh di bagian kaki halaman. Akibatnya, peramban sering memulai pengunduhan gambar utama dengan prioritas *Low* atau *Medium*, dan baru menaikkannya ke *High* setelah tata letak selesai dihitung.

| Atribut & Nilai | Efek pada Jaringan & Perenderan | Kapan Harus Digunakan? |
|---|---|---|
| `fetchpriority="high"` | Menaikkan prioritas unduhan jaringan gambar sejak ditemukan oleh *preload scanner* HTML. | **Hanya untuk 1 gambar LCP utama** yang langsung terlihat di layar pertama (*above the fold*). |
| `fetchpriority="low"` | Menurunkan prioritas unduhan agar tidak berebut pita lebar dengan aset kritis. | Gambar slide ke-2 dst. pada *carousel* di bagian atas halaman, atau gambar yang kurang penting. |
| `loading="lazy"` | Menunda pengunduhan gambar sampai posisi gulir pengguna mendekati gambar tersebut. | Seluruh gambar yang berada **di bawah lipatan layar pertama (*below the fold*)**. |
| `loading="eager"` (bawaan) | Mengunduh gambar seketika tanpa menunggu pengguliran layar. | Gambar yang berada di layar pertama (*above the fold*). |
| `decoding="async"` | Mengizinkan peramban mendekode bitmap gambar di luar alur kritis agar tidak menahan perenderan teks di sekitarnya. | Gambar konten, ilustrasi artikel, dan galeri. |

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Optimasi Gambar untuk LCP dan CLS — Kodeloka</title>
    <style>
      img { max-width: 100%; height: auto; }
    </style>
  </head>
  <body>
    <main>
      <h1>Optimasi Gambar untuk LCP dan CLS</h1>

      <!-- Gambar LCP di layar pertama: jangan lazy, beri prioritas tinggi -->
      <img
        src="/assets/sampul-1200.avif"
        alt="Ilustrasi arsitektur pengembangan web modern"
        width="1200"
        height="630"
        fetchpriority="high"
        decoding="async"
      >

      <p>Konten di bawah gambar tidak melompat karena rasio aspek sudah dipesan lewat width dan height.</p>

      <!-- Gambar di bawah layar: boleh ditunda -->
      <img
        src="/assets/diagram-dom.webp"
        alt="Diagram alur pembentukan pohon DOM dan CSSOM"
        width="800"
        height="450"
        loading="lazy"
        decoding="async"
      >
    </main>
  </body>
</html>
```

> **Status dukungan (Oktober 2026):** `loading="lazy"` berstatus *Baseline Widely Available*, sedangkan `fetchpriority` berstatus *Baseline Newly Available* sejak Oktober 2024 (Chrome/Edge 103+, Safari 17.2+, Firefox 132+). Peramban yang belum mendukung `fetchpriority` cukup mengabaikannya.

## 3. Memadukan `fetchpriority="high"` dengan Gambar Responsif `srcset`

Apabila gambar LCP Anda menggunakan `srcset` dan `sizes`, Anda tetap cukup menambahkan `fetchpriority="high"` langsung pada elemen `<img>` tersebut tanpa perlu membuat `<link rel="preload">` terpisah di `<head>`, selama tag `<img>` sudah tertulis langsung di dalam HTML awal dari server:

```html
<img
  src="/assets/hero-800.avif"
  srcset="
    /assets/hero-400.avif 400w,
    /assets/hero-800.avif 800w,
    /assets/hero-1200.avif 1200w
  "
  sizes="(max-width: 768px) 100vw, 800px"
  width="1200"
  height="675"
  fetchpriority="high"
  alt="Tampilan ruang belajar interaktif Kodeloka"
>
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Memasang `loading="lazy"` pada gambar LCP di layar pertama (*anti-pattern* paling fatal):** Menambahkan `loading="lazy"` pada gambar sampul utama membuat peramban menunda pengunduhan gambar tersebut sampai tata letak selesai dihitung dan *IntersectionObserver* internal memastikan gambar masuk ke viewport—memperlambat skor LCP ratusan milidetik!
2. **Memberikan `fetchpriority="high"` ke 10 gambar sekaligus:** Jika semua gambar diberi prioritas tinggi, maka tidak ada lagi yang benar-benar menjadi prioritas; seluruh gambar akan kembali berebut pita lebar jaringan. Gunakan `fetchpriority="high"` hanya untuk **satu** elemen LCP.
3. **Menulis satuan `px` atau `%` di dalam atribut HTML `width` dan `height`:** Pada HTML5, atribut `width="800"` dan `height="450"` hanya boleh berisi bilangan bulat non-negatif (tanpa akhiran `px` atau `%`). Pengaturan lebar persentase (`max-width: 100%`) dilakukan di CSS.

## Latihan Praktik

Buatlah berkas `31-gambar-lcp-decoding-dan-sizing-intrinsik.html` yang menyimulasikan halaman artikel teknis:
1. Buat satu gambar sampul utama di bagian atas `<main>` dengan `width="1200"`, `height="630"`, `fetchpriority="high"`, tanpa `loading="lazy"`.
2. Buat tiga gambar diagram teknis di bawah beberapa paragraf teks dengan `width="800"`, `height="450"`, `loading="lazy"`, dan `decoding="async"`.
3. Buka panel **Network** di Browser DevTools (centang kolom **Priority**), muat ulang halaman, dan amati perbedaan nilai kolom *Priority* antara gambar sampul utama dan gambar diagram di bawahnya.

## Kuis Pemahaman

### Soal 1
Mengapa memasang atribut `loading="lazy"` pada gambar spanduk utama (*hero image*) yang berada di bagian paling atas halaman merupakan praktik yang buruk bagi performa?
- A. Karena `loading="lazy"` membuat gambar berubah menjadi hitam-putih
- B. Karena peramban akan menunda pengunduhan gambar utama tersebut hingga perhitungan tata letak selesai, sehingga memperburuk metrik *Largest Contentful Paint* (LCP)
- C. Karena `loading="lazy"` tidak dapat digunakan bersama atribut `alt`
- D. Karena `loading="lazy"` menghapus rasio aspek dari atribut `width` dan `height`

**Jawaban Benar:** B
**Penjelasan:** Gambar yang langsung terlihat di layar pertama (*above the fold*) harus diunduh secepat mungkin. Memasang `loading="lazy"` pada elemen LCP menghalangi *preload scanner* mengunduhnya lebih awal dan memperburuk waktu LCP.

### Soal 2
Kombinasi atribut manakah yang paling tepat untuk diterapkan pada **satu gambar utama (LCP)** di layar atas halaman agar diunduh dengan prioritas tinggi dan tidak memicu pergeseran tata letak (CLS)?
- A. `width="1200" height="630" fetchpriority="high"` (tanpa `loading="lazy"`, disertai `max-width: 100%; height: auto` di CSS)
- B. `loading="lazy" fetchpriority="low" width="100%"`
- C. `decoding="sync" loading="lazy"` tanpa `width` dan `height`
- D. `fetchpriority="high"` pada seluruh 20 gambar di halaman

**Jawaban Benar:** A
**Penjelasan:** `width` dan `height` menjaga rasio aspek untuk mencegah CLS, sedangkan `fetchpriority="high"` tanpa `loading="lazy"` memastikan gambar LCP segera diunduh dengan prioritas tertinggi.

### Soal 3
Bagaimana cara menulis nilai atribut `width` dan `height` yang valid menurut spesifikasi HTML5 pada elemen `<img>`?
- A. `width="800px" height="450px"`
- B. `width="100%" height="auto"`
- C. `width="800" height="450"` (bilangan bulat tanpa satuan)
- D. `width="50rem" height="28rem"`

**Jawaban Benar:** C
**Penjelasan:** Dalam spesifikasi HTML, atribut dimensi `width` dan `height` pada `<img>` hanya menerima bilangan bulat non-negatif yang merepresentasikan piksel CSS intrinsik tanpa satuan `px`, `%`, atau `rem`.

## Sumber
- [Optimize Largest Contentful Paint — web.dev](https://web.dev/articles/optimize-lcp)
- [Optimize resource loading with the Fetch Priority API — web.dev](https://web.dev/articles/fetch-priority)
- [`<img>` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img)
- [Cumulative Layout Shift (CLS) — web.dev](https://web.dev/articles/cls)
