# Data Terstruktur Schema.org dengan JSON-LD (`Course`, `TechArticle`, `FAQPage`, `BreadcrumbList`)

- **Tingkat:** Lanjut
- **Ringkasan:** Menyusun skema JSON-LD yang valid di dalam `<script type="application/ld+json">` untuk kursus edukasi, artikel teknis, daftar pertanyaan umum (FAQ), dan jejak navigasi (*breadcrumbs*).

## Mengapa Mesin Pencari Membutuhkan Data Terstruktur JSON-LD?

Mesin pencari seperti Google dan Bing dapat membaca teks di dalam `<h1>` dan `<p>`, tetapi untuk memastikan arti eksplisit dari sebuah halaman—apakah halaman tersebut adalah **artikel teknis (`TechArticle`)**, **katalog kursus (`Course`)**, beserta **urutan jejak halamannya (`BreadcrumbList`)**—mesin pencari mengandalkan data terstruktur berbasis kosakata **[Schema.org](https://schema.org/)**.

Di antara tiga format data terstruktur yang ada (JSON-LD, Microdata, dan RDFa), **JSON-LD (*JavaScript Object Notation for Linked Data*)** di dalam elemen `<script type="application/ld+json">` adalah format yang paling direkomendasikan karena terpisah rapi dari markup tampilan HTML sehingga tidak mudah rusak saat desain CSS/HTML diubah.

## 1. Struktur Dasar JSON-LD: `@context`, `@type`, dan Penggabungan dengan `@graph`

Sebuah blok JSON-LD disematkan di dalam `<head>` (atau `<body>`) menggunakan `<script type="application/ld+json">`. Peramban tidak mengeksekusi isi skrip ini sebagai kode JavaScript, melainkan menyimpannya sebagai blok data JSON murni.

| Kunci JSON-LD | Arti & Aturan Penulisan |
|---|---|
| `"@context": "https://schema.org"` | Memberi tahu pengurai bahwa seluruh nama properti di dalam objek mengacu pada kamus kosakata Schema.org. |
| `"@type"` | Jenis entitas Schema.org, misalnya `"TechArticle"`, `"Course"`, `"BreadcrumbList"`, atau `"Organization"`. |
| `"@id"` | Pengenal URI unik kanonis untuk entitas tersebut agar dapat dirujuk silang oleh entitas lain di halaman yang sama. |
| `"@graph": [ ... ]` | Menggabungkan beberapa entitas sekaligus (misalnya informasi artikel **dan** jejak *breadcrumb*) di dalam satu tag `<script type="application/ld+json">`. |

Berikut adalah contoh penggunaan `@graph` untuk menggabungkan `TechArticle` dan `BreadcrumbList` dalam satu halaman materi:

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

Perhatikan bahwa pada item terakhir `BreadcrumbList` (`position: 3`, yaitu halaman yang sedang dibuka saat ini), properti `"item"` (URL) boleh dikosongkan karena secara otomatis mengacu ke URL halaman saat ini.

## 2. Skema `Course` dan Status Terbaru `FAQPage` di Mesin Pencari

Untuk halaman utama sebuah kelas pemrograman, Anda dapat menggunakan tipe **`Course`** beserta properti `provider`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Belajar HTML Modern Bahasa Indonesia",
  "description": "Kelas HTML lengkap dari cara web bekerja, semantik, formulir, aksesibilitas WCAG 2.2, hingga optimasi performa.",
  "inLanguage": "id",
  "isAccessibleForFree": true,
  "provider": {
    "@type": "Organization",
    "name": "Kodeloka — Asadin Edu",
    "sameAs": "https://kodeloka.asadinedu.com/"
  }
}
</script>
```

> **⚠️ Perhatian untuk `FAQPage`:** Sejak 2023 Google hanya menampilkan hasil kaya FAQ untuk situs pemerintah dan kesehatan yang terkenal, dan Google mengumumkan bahwa fitur hasil kaya FAQ tidak lagi tampil di Google Search mulai 7 Mei 2026. Markup `FAQPage` tetap valid sebagai kosakata Schema.org, tetapi jangan mengharapkannya menghasilkan tampilan khusus di Google. Sebaliknya, `BreadcrumbList` dan tipe lain yang masih didukung perlu dicek di dokumentasi Google Search Central sebelum diterapkan.

## 3. Keamanan Penyisipan JSON-LD Dinamis (Mencegah Pecahnya `</script>`)

Apabila Anda mencetak JSON-LD secara dinamis dari sisi server (misalnya menggunakan `JSON.stringify()` di Node.js atau `json_encode()` di PHP) yang memuat judul atau teks dari database, ada satu celah keamanan klasik: jika teks di dalam JSON mengandung urutan karakter **`</script>`**, parser HTML peramban akan langsung menutup blok `<script type="application/ld+json">` di tengah jalan dan mengeksekusi sisa teks setelahnya sebagai HTML/XSS!

Untuk mencegahnya, selalu ganti karakter `<` menjadi urutan escape Unicode `<` (atau gunakan flag `JSON_HEX_TAG` di PHP):

```javascript
// Cara aman mencetak objek menjadi string JSON-LD di dalam template HTML
function buatJsonLdAman(dataObjek) {
  return JSON.stringify(dataObjek).replace(/</g, "\u003c");
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menyisipkan koma gantung (*trailing comma*) atau komentar `//` di dalam JSON-LD:** Isi `<script type="application/ld+json">` wajib berupa JSON murni sesuai spesifikasi RFC 8259. Satu koma berlebih di akhir elemen array atau satu komentar `//` akan membuat seluruh blok JSON-LD gagal diurai.
2. **Menulis klaim di JSON-LD yang tidak terlihat oleh pengunjung halaman (*cloaking*):** Pedoman kualitas mesin pencari mewajibkan data di dalam JSON-LD mencerminkan konten yang benar-benar tampil dan dapat dibaca pengguna di halaman tersebut.
3. **Lupa meng-escape karakter `<` saat menghasilkan JSON-LD dari data dinamis:** Selalu ubah `<` menjadi `<` agar urutan `</script>` di dalam string JSON tidak memutus elemen `<script>` HTML.

## Latihan Praktik

Buatlah berkas `34-structured-data-json-ld-schema-org.html` untuk halaman kelas "Belajar CSS Grid":
1. Buat satu blok `<script type="application/ld+json">` yang menggunakan `"@graph"` untuk menggabungkan tiga entitas sekaligus: `Organization` (penerbit), `Course` (informasi kursus gratis berbahasa Indonesia), dan `BreadcrumbList` (3 tingkat navigasi).
2. Pastikan konten visual di dalam `<main>` (judul `<h1>`, deskripsi kursus, dan elemen `<nav aria-label="Jejak halaman">`) sesuai persis dengan data yang dideklarasikan di dalam JSON-LD.
3. Validasi sintaks JSON di dalamnya menggunakan `JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)` di konsol DevTools.

## Kuis Pemahaman

### Soal 1
Apa fungsi dari kunci `"@graph"` di dalam sebuah blok `<script type="application/ld+json">`?
- A. Menggambar grafik batang secara otomatis di dalam elemen `<canvas>`
- B. Menggabungkan beberapa objek entitas Schema.org (seperti `TechArticle`, `BreadcrumbList`, dan `Organization`) di dalam satu blok JSON-LD tunggal
- C. Mengubah format JSON-LD menjadi kueri GraphQL
- D. Menyembunyikan halaman dari indeks mesin pencari

**Jawaban Benar:** B
**Penjelasan:** Properti `@graph` di JSON-LD menerima array berisi beberapa node entitas yang saling terkait di halaman yang sama sehingga Anda cukup menulis satu blok `<script type="application/ld+json">` dengan satu deklarasi `"@context": "https://schema.org"`.

### Soal 2
Mengapa saat menghasilkan JSON-LD secara dinamis di server, setiap karakter `<` di dalam string JSON perlu diubah menjadi `<`?
- A. Karena JSON standar tidak mengizinkan huruf besar
- B. Agar apabila teks mengandung string `</script>`, parser HTML peramban tidak menganggapnya sebagai tag penutup elemen `<script type="application/ld+json">` yang dapat memicu celah Cross-Site Scripting (XSS)
- C. Untuk memperkecil ukuran berkas hingga 80%
- D. Karena Schema.org mengharuskan semua teks ditulis dalam kode ASCII heksadesimal

**Jawaban Benar:** B
**Penjelasan:** Parser HTML memindai kemunculan pertama `</script>` tanpa memedulikan tanda kutip string JSON. Mengubah `<` menjadi `<` tetap menghasilkan karakter `<` yang identik saat diurai oleh `JSON.parse()`, tetapi aman dari pemutusan tag `<script>` HTML.

### Soal 3
Manakah pernyataan yang **benar** mengenai penggunaan tipe `FAQPage` Schema.org untuk hasil pencarian Google per Mei 2026?
- A. Google menampilkan hasil kaya FAQ untuk semua situs blog pribadi tanpa terkecuali
- B. Google telah menghentikan tampilan hasil kaya (*rich result*) FAQ di Google Search sejak Mei 2026, meskipun `FAQPage` tetap merupakan kosakata Schema.org yang valid
- C. `FAQPage` menggantikan fungsi elemen `<title>` dan `<meta name="description">`
- D. `FAQPage` wajib ditulis di dalam berkas CSS eksternal

**Jawaban Benar:** B
**Penjelasan:** Sesuai pembaruan Google Search Central, fitur tampilan khusus FAQ di hasil pencarian telah dihentikan sejak 7 Mei 2026, sehingga pengembang tidak boleh lagi mengandalkannya sebagai strategi tampilan hasil kaya di Google Search.

## Sumber
- [JSON-LD 1.1 — W3C](https://www.w3.org/TR/json-ld11/)
- [TechArticle — Schema.org](https://schema.org/TechArticle)
- [BreadcrumbList — Schema.org](https://schema.org/BreadcrumbList)
- [Introduction to structured data — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Search Central updates (penghapusan hasil kaya FAQ) — Google](https://developers.google.com/search/updates)
