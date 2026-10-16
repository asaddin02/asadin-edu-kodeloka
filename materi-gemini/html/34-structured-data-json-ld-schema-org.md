# Data Terstruktur Schema.org dengan JSON-LD (`Course`, `TechArticle`, `FAQPage`, `BreadcrumbList`)

- **Tingkat:** Lanjut
- **Ringkasan:** Menyusun skema JSON-LD yang valid di dalam `<script type="application/ld+json">` untuk kursus edukasi, artikel teknis, daftar pertanyaan umum (FAQ), dan jejak navigasi (*breadcrumbs*).

## Mengapa Topik "Data Terstruktur Schema.org dengan JSON-LD (`Course`, `TechArticle`, `FAQPage`, `BreadcrumbList`)" Penting di Lingkungan Produksi?

Dalam pengembangan web profesional, menguasai **Data Terstruktur Schema.org dengan JSON-LD (`Course`, `TechArticle`, `FAQPage`, `BreadcrumbList`)** membedakan kode yang sekadar tampil di layar pengembang dari kode yang benar-benar tangguh, cepat, aman, dan dapat diakses oleh seluruh pengguna di berbagai perangkat.

Pada pelajaran ini kita membedah cara kerja **`application/ld+json`** dan **`Schema.org`** berdasarkan kosakata [Schema.org](https://schema.org/) dan spesifikasi [JSON-LD 1.1](https://www.w3.org/TR/json-ld11/) dari W3C, serta dokumentasi [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) untuk fitur hasil pencarian.

## 1. Konsep Inti dan Aturan Standar

Peramban modern memproses `application/ld+json` dan `Schema.org` mengikuti aturan semantik dan keamanan yang ketat:

| Aspek | Praktik Buruk (Hindari) | Praktik Standar Modern (Gunakan) |
|---|---|---|
| **Pendekatan Markup** | Mengandalkan tebakan peramban atau skrip tambahan yang rapuh. | Mendeklarasikan `application/ld+json` dan `Schema.org` secara eksplisit sesuai spesifikasi resmi. |
| **Aksesibilitas (a11y)** | Mengabaikan pembaca layar dan navigasi tombol `Tab`. | Memastikan nama aksesibel, peran (*role*), dan status fokus terjaga. |
| **Keamanan & Kinerja** | Membiarkan sumber daya dimuat tanpa batasan. | Menerapkan prinsip hak akses minimal dan pemuatan terukur. |

## 2. Contoh Implementasi Lengkap dan Siap Pakai

Berikut adalah pola penulisan HTML modern yang menerapkan `application/ld+json` dan `Schema.org` secara benar:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Struktur Dokumen HTML Modern — Kodeloka</title>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "TechArticle",
          "headline": "Struktur Dokumen HTML Modern",
          "inLanguage": "id",
          "datePublished": "2026-10-16",
          "author": { "@type": "Organization", "name": "Kodeloka" },
          "mainEntityOfPage": "https://kodeloka.asadinedu.com/html/materi/02-struktur-dokumen-html/"
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Beranda", "item": "https://kodeloka.asadinedu.com/" },
            { "@type": "ListItem", "position": 2, "name": "HTML", "item": "https://kodeloka.asadinedu.com/html/" },
            { "@type": "ListItem", "position": 3, "name": "Struktur Dokumen HTML Modern" }
          ]
        }
      ]
    }
    </script>
  </head>
  <body>
    <main>
      <h1>Struktur Dokumen HTML Modern</h1>
      <p>Data terstruktur harus mencerminkan konten yang benar-benar tampil di halaman ini.</p>
    </main>
  </body>
</html>
```

> **Perhatian untuk `FAQPage`:** Sejak 2023 Google hanya menampilkan hasil kaya FAQ untuk situs pemerintah dan kesehatan yang terkenal, dan Google mengumumkan bahwa fitur hasil kaya FAQ tidak lagi tampil di Google Search mulai 7 Mei 2026. Markup `FAQPage` tetap valid sebagai kosakata Schema.org, tetapi jangan mengharapkannya menghasilkan tampilan khusus di Google. Sebaliknya, `BreadcrumbList` dan tipe lain yang masih didukung perlu dicek di dokumentasi Google Search Central sebelum diterapkan.

> **💡 Tips Praktis Produksi:**
> Selalu periksa hasil perenderan elemen dan atribut `application/ld+json` menggunakan panel **Elements** dan **Accessibility Tree** di Browser DevTools (`F12`) untuk memastikan tidak ada atribut yang salah ketik atau konflik peran semantik.

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan atribut tanpa memahami dampaknya pada perangkat seluler dan pembaca layar:**
   Pastikan setiap penggunaan `application/ld+json` diuji baik menggunakan tetikus maupun hanya dengan papan ketik (`Tab`, `Shift+Tab`, `Enter`, `Space`, dan `Esc`).
2. **Mencampuradukkan tugas struktur HTML dengan presentasi CSS:**
   Biarkan HTML menangani makna semantik `Schema.org`, dan serahkan pengaturan visual sepenuhnya kepada stylesheet CSS.

## Latihan Praktik

Buatlah berkas `34-structured-data-json-ld-schema-org.html` di komputer Anda:
1. Terapkan struktur dokumen HTML5 lengkap dengan `<html lang="id">` dan `<main>`.
2. Implementasikan contoh penggunaan `application/ld+json` dan `Schema.org` sesuai skenario di atas.
3. Uji halaman tersebut menggunakan navigasi papan ketik dan periksa pohon aksesibilitasnya di DevTools.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penggunaan `application/ld+json` dalam konteks **Data Terstruktur Schema.org dengan JSON-LD (`Course`, `TechArticle`, `FAQPage`, `BreadcrumbList`)** pada standar HTML modern?
- A. Hanya untuk mengubah warna teks tanpa memerlukan berkas CSS
- B. Memberikan instruksi deklaratif dan semantik yang presisi kepada peramban serta teknologi bantu terkait perilaku `application/ld+json`
- C. Menggantikan seluruh fungsi protokol HTTP di sisi server
- D. Mematikan fitur keamanan bawaan peramban

**Jawaban Benar:** B
**Penjelasan:** `application/ld+json` dirancang di dalam spesifikasi HTML agar peramban dan alat bantu (*assistive technologies*) dapat menangani fitur tersebut secara konsisten dan deklaratif.

### Soal 2
Mengapa penerapan `Schema.org` yang sesuai spesifikasi lebih disarankan dibandingkan membuat tiruannya dengan `<div>` dan JavaScript manual?
- A. Karena `<div>` sudah dihapus dari spesifikasi HTML5
- B. Karena fitur bawaan (`Schema.org`) ditangani langsung oleh mesin peramban dengan dukungan aksesibilitas papan ketik, kinerja tinggi, dan perilaku lintas perangkat yang terstandarisasi
- C. Karena JavaScript tidak dapat berjalan di peramban ponsel
- D. Agar ukuran gambar di halaman otomatis mengecil

**Jawaban Benar:** B
**Penjelasan:** Mengikuti prinsip *Rule of Least Power*, memanfaatkan fitur asli HTML mengurangi beban kode JavaScript sekaligus menjamin kompatibilitas dengan pembaca layar dan perangkat seluler.

### Soal 3
Bagaimana cara memverifikasi bahwa implementasi `application/ld+json` dan `Schema.org` pada halaman Anda sudah bekerja dengan benar bagi seluruh pengguna?
- A. Cukup melihat tampilannya sekilas di satu ukuran layar desktop
- B. Menginspeksi elemen di DevTools (termasuk panel Network/Accessibility Tree) serta menguji interaksinya menggunakan navigasi papan ketik
- C. Menghapus tag `<!DOCTYPE html>`
- D. Mengubah ekstensi berkas menjadi `.txt`

**Jawaban Benar:** B
**Penjelasan:** Pengujian menyeluruh mencakup pemeriksaan DOM/Accessibility Tree di DevTools serta pengujian navigasi papan ketik untuk memastikan aksesibilitas dan keandalan.

## Sumber
- [JSON-LD 1.1 — W3C](https://www.w3.org/TR/json-ld11/)
- [TechArticle — Schema.org](https://schema.org/TechArticle)
- [BreadcrumbList — Schema.org](https://schema.org/BreadcrumbList)
- [Introduction to structured data — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Search Central updates (penghapusan hasil kaya FAQ) — Google](https://developers.google.com/search/updates)
