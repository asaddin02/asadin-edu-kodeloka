# Optimasi Elemen `<img>` untuk LCP & CLS: `fetchpriority`, `decoding="async"`, dan Ukuran Intrinsik

- **Tingkat:** Lanjut
- **Ringkasan:** Menganalisis dampak atribut `fetchpriority="high"`, `loading="lazy"`, `decoding="async"`, serta dimensi `width`/`height` terhadap metrik Core Web Vitals (LCP dan CLS) pada halaman produksi.

## Mengapa Topik "Optimasi Elemen `<img>` untuk LCP & CLS: `fetchpriority`, `decoding="async"`, dan Ukuran Intrinsik" Penting di Lingkungan Produksi?

Dalam pengembangan web profesional, menguasai **Optimasi Elemen `<img>` untuk LCP & CLS: `fetchpriority`, `decoding="async"`, dan Ukuran Intrinsik** membedakan kode yang sekadar tampil di layar pengembang dari kode yang benar-benar tangguh, cepat, aman, dan dapat diakses oleh seluruh pengguna di berbagai perangkat.

Pada pelajaran ini kita membedah cara kerja **`fetchpriority`** dan **`decoding`** berdasarkan spesifikasi [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/embedded-content.html) serta dokumentasi [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img).

## 1. Konsep Inti dan Aturan Standar

Peramban modern memproses `fetchpriority` dan `decoding` mengikuti aturan semantik dan keamanan yang ketat:

| Aspek | Praktik Buruk (Hindari) | Praktik Standar Modern (Gunakan) |
|---|---|---|
| **Pendekatan Markup** | Mengandalkan tebakan peramban atau skrip tambahan yang rapuh. | Mendeklarasikan `fetchpriority` dan `decoding` secara eksplisit sesuai spesifikasi resmi. |
| **Aksesibilitas (a11y)** | Mengabaikan pembaca layar dan navigasi tombol `Tab`. | Memastikan nama aksesibel, peran (*role*), dan status fokus terjaga. |
| **Keamanan & Kinerja** | Membiarkan sumber daya dimuat tanpa batasan. | Menerapkan prinsip hak akses minimal dan pemuatan terukur. |

## 2. Contoh Implementasi Lengkap dan Siap Pakai

Berikut adalah pola penulisan HTML modern yang menerapkan `fetchpriority` dan `decoding` secara benar:

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

> **💡 Tips Praktis Produksi:**
> Selalu periksa hasil perenderan elemen dan atribut `fetchpriority` menggunakan panel **Elements** dan **Accessibility Tree** di Browser DevTools (`F12`) untuk memastikan tidak ada atribut yang salah ketik atau konflik peran semantik.

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan atribut tanpa memahami dampaknya pada perangkat seluler dan pembaca layar:**
   Pastikan setiap penggunaan `fetchpriority` diuji baik menggunakan tetikus maupun hanya dengan papan ketik (`Tab`, `Shift+Tab`, `Enter`, `Space`, dan `Esc`).
2. **Mencampuradukkan tugas struktur HTML dengan presentasi CSS:**
   Biarkan HTML menangani makna semantik `decoding`, dan serahkan pengaturan visual sepenuhnya kepada stylesheet CSS.

## Latihan Praktik

Buatlah berkas `31-gambar-lcp-decoding-dan-sizing-intrinsik.html` di komputer Anda:
1. Terapkan struktur dokumen HTML5 lengkap dengan `<html lang="id">` dan `<main>`.
2. Implementasikan contoh penggunaan `fetchpriority` dan `decoding` sesuai skenario di atas.
3. Uji halaman tersebut menggunakan navigasi papan ketik dan periksa pohon aksesibilitasnya di DevTools.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penggunaan `fetchpriority` dalam konteks **Optimasi Elemen `<img>` untuk LCP & CLS: `fetchpriority`, `decoding="async"`, dan Ukuran Intrinsik** pada standar HTML modern?
- A. Hanya untuk mengubah warna teks tanpa memerlukan berkas CSS
- B. Memberikan instruksi deklaratif dan semantik yang presisi kepada peramban serta teknologi bantu terkait perilaku `fetchpriority`
- C. Menggantikan seluruh fungsi protokol HTTP di sisi server
- D. Mematikan fitur keamanan bawaan peramban

**Jawaban Benar:** B
**Penjelasan:** `fetchpriority` dirancang di dalam spesifikasi HTML agar peramban dan alat bantu (*assistive technologies*) dapat menangani fitur tersebut secara konsisten dan deklaratif.

### Soal 2
Mengapa penerapan `decoding` yang sesuai spesifikasi lebih disarankan dibandingkan membuat tiruannya dengan `<div>` dan JavaScript manual?
- A. Karena `<div>` sudah dihapus dari spesifikasi HTML5
- B. Karena fitur bawaan (`decoding`) ditangani langsung oleh mesin peramban dengan dukungan aksesibilitas papan ketik, kinerja tinggi, dan perilaku lintas perangkat yang terstandarisasi
- C. Karena JavaScript tidak dapat berjalan di peramban ponsel
- D. Agar ukuran gambar di halaman otomatis mengecil

**Jawaban Benar:** B
**Penjelasan:** Mengikuti prinsip *Rule of Least Power*, memanfaatkan fitur asli HTML mengurangi beban kode JavaScript sekaligus menjamin kompatibilitas dengan pembaca layar dan perangkat seluler.

### Soal 3
Bagaimana cara memverifikasi bahwa implementasi `fetchpriority` dan `decoding` pada halaman Anda sudah bekerja dengan benar bagi seluruh pengguna?
- A. Cukup melihat tampilannya sekilas di satu ukuran layar desktop
- B. Menginspeksi elemen di DevTools (termasuk panel Network/Accessibility Tree) serta menguji interaksinya menggunakan navigasi papan ketik
- C. Menghapus tag `<!DOCTYPE html>`
- D. Mengubah ekstensi berkas menjadi `.txt`

**Jawaban Benar:** B
**Penjelasan:** Pengujian menyeluruh mencakup pemeriksaan DOM/Accessibility Tree di DevTools serta pengujian navigasi papan ketik untuk memastikan aksesibilitas dan keandalan.

## Sumber
- [Optimize Largest Contentful Paint — web.dev](https://web.dev/articles/optimize-lcp)
- [Optimize resource loading with the Fetch Priority API — web.dev](https://web.dev/articles/fetch-priority)
- [`<img>` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img)
- [Cumulative Layout Shift (CLS) — web.dev](https://web.dev/articles/cls)
