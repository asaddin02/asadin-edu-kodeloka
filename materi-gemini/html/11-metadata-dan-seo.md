# Metadata Dokumen, SEO Teknis, Open Graph, dan JSON-LD

- **Tingkat:** Menengah
- **Ringkasan:** Mengoptimalkan keterbacaan halaman oleh mesin pencari dan platform media sosial menggunakan `<title>`, `<meta name="description">`, `<link rel="canonical">`, protokol Open Graph, ikon aplikasi modern, serta data terstruktur JSON-LD.

## Bagaimana Mesin Pencari dan Aplikasi Pesan Membaca Halaman Anda?

Ketika seseorang membagikan tautan kelas Kodeloka di WhatsApp, Telegram, Slack, atau LinkedIn, aplikasi tersebut tidak menyalakan peramban penuh untuk memotret layar. Sebaliknya, bot mereka melakukan permintaan HTTP singkat untuk membaca bagian `<head>` dari dokumen HTML Anda dan mencari **metadata**.

Begitu pula dengan mesin pencari seperti Google atau Bing: sebelum menganalisis isi `<main>`, mereka memeriksa `<title>`, `<meta name="robots">`, `<link rel="canonical">`, dan **Structured Data (JSON-LD)** untuk memahami topik halaman, mencegah duplikasi URL, dan menampilkan *Rich Results* (cuplikan kaya di halaman hasil pencarian).

## 1. Metadata Inti untuk Mesin Pencari (SEO Teknis)

### A. `<title>` dan `<meta name="description">`
Dua elemen ini menentukan bagaimana halaman Anda tampil di halaman hasil mesin pencari (*Search Engine Results Page* / SERP):

```html
<title>Belajar PostgreSQL Bahasa Indonesia: Indeks, MVCC, dan Replikasi — Kodeloka</title>
<meta
  name="description"
  content="Pelajari arsitektur PostgreSQL dari dasar hingga produksi: indeks B-Tree, EXPLAIN ANALYZE, transaksi MVCC, VACUUM, partisi tabel, dan replikasi tanpa downtime."
>
```

Prinsip penulisan yang baik:
- **Unik di setiap halaman:** Jangan pernah menggunakan `<title>` atau `description` yang sama persis untuk puluhan halaman berbeda.
- **Spesifik dan memuat konteks merek:** Letakkan topik spesifik halaman di depan, diikuti pemisah (`—` atau `|`) dan nama situs di belakang (sekitar 50–60 karakter untuk `<title>`, dan 120–155 karakter untuk `description`).
- **Ingat bahwa `<meta name="keywords">` sudah tidak digunakan:** Mesin pencari modern sepenuhnya mengabaikan `<meta name="keywords">` karena rentan disalahgunakan untuk spam kata kunci.

### B. Mengatasi Duplikasi URL dengan `<link rel="canonical">`
Sebuah halaman web sering kali bisa diakses melalui beberapa variasi URL sekaligus:
- `https://kodeloka.asadinedu.com/postgresql/`
- `https://kodeloka.asadinedu.com/postgresql/index.html`
- `https://kodeloka.asadinedu.com/postgresql/?utm_source=newsletter&ref=123`

Jika mesin pencari mengindeks ketiganya sebagai halaman terpisah, reputasi halaman Anda akan terpecah. Solusinya adalah menunjuk **satu alamat resmi (kanonik)** menggunakan `<link rel="canonical">`:

```html
<link rel="canonical" href="https://kodeloka.asadinedu.com/postgresql/">
```

### C. Mengatur Perilaku Pengindeksan dengan `<meta name="robots">`
Secara bawaan, mesin pencari akan mengindeks halaman dan mengikuti tautan di dalamnya (`index, follow`). Namun, untuk halaman yang **tidak boleh** muncul di hasil pencarian Google (seperti halaman hasil pencarian internal, halaman dasbor privat, atau halaman *staging*), tambahkan:

```html
<meta name="robots" content="noindex, nofollow">
```

> **Catatan keamanan:** `noindex` hanya meminta mesin pencari tidak menampilkan halaman. Itu bukan pengamanan akses. Halaman dasbor atau data privat tetap harus dilindungi autentikasi di sisi server.

## 2. Protokol Open Graph untuk Pratinjau Media Sosial dan Chat

Agar tautan yang dibagikan di aplikasi pesan dan media sosial menampilkan kartu pratinjau lengkap dengan gambar sampul, judul, dan deskripsi, gunakan atribut `property="og:..."` dari protokol **Open Graph**:

```html
<!-- Open Graph Metadata -->
<meta property="og:type" content="article">
<meta property="og:site_name" content="Kodeloka">
<meta property="og:locale" content="id_ID">
<meta property="og:title" content="Belajar PostgreSQL: Indeks, EXPLAIN ANALYZE, dan MVCC">
<meta property="og:description" content="Kurikulum PostgreSQL berbahasa Indonesia lengkap dengan latihan dan kuis interaktif.">
<meta property="og:url" content="https://kodeloka.asadinedu.com/postgresql/">
<meta property="og:image" content="https://kodeloka.asadinedu.com/assets/og-postgresql.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Kartu kelas PostgreSQL di Kodeloka">

<!-- Twitter / X Card Metadata -->
<meta name="twitter:card" content="summary_large_image">
```

> **⚠️ Kesalahan Umum: Menggunakan Jalur Relatif pada `og:image` dan `canonical`**
> Berbeda dengan `<img src="/assets/logo.png">` yang dibaca oleh peramban dalam konteks domain aktif, perayap bot media sosial sering mengekstrak tag `og:image` dan `<link rel="canonical">` secara mentah. Oleh karena itu, **selalu gunakan URL absolut lengkap dengan `https://...`** pada `og:image`, `og:url`, dan `rel="canonical"`!

## 3. Set Favicon Modern yang Ringkas

Di masa lalu, generator favicon menghasilkan belasan baris tag `<link>` untuk berbagai ukuran layar lama. Untuk peramban modern, Anda cukup menggunakan kombinasi **empat baris** berikut (mendukung vektor SVG yang tajam sekaligus tema gelap/terang!):

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/assets/brand/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
```

Di dalam berkas `icon.svg`, Anda bahkan dapat menyematkan `<style>` dengan `@media (prefers-color-scheme: dark)` agar warna favicon otomatis menyesuaikan tema gelap atau terang di tab peramban pengguna!

## 4. Data Terstruktur dengan JSON-LD (`application/ld+json`)

Selain membaca teks HTML, mesin pencari memahami entitas secara presisi (apakah halaman ini sebuah kursus/`Course`, artikel teknis/`TechArticle`, resep masakan, atau daftar tanya-jawab/`FAQPage`) melalui kosakata **Schema.org** yang ditulis dalam format **JSON-LD** di dalam `<script type="application/ld+json">`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Kelas Dasar HTML Modern",
  "description": "Pelajari fondasi HTML dari cara kerja web, struktur semantik, formulir, aksesibilitas, hingga SEO teknis.",
  "inLanguage": "id",
  "isAccessibleForFree": true,
  "provider": {
    "@type": "Organization",
    "name": "Kodeloka — Asadin Edu",
    "sameAs": "https://kodeloka.asadinedu.com"
  }
}
</script>
```

Perhatikan bahwa Kodeloka sendiri menggunakan teknik JSON-LD ini di `scripts/build.mjs` untuk setiap halaman kelas dan modulnya!

## Latihan Praktik: Menyusun `<head>` Siap Produksi

Buatlah berkas `seo-modul.html` untuk halaman artikel berjudul *"Panduan Keamanan Cookie dan Sesi di PHP"* yang berada di URL resmi `https://kodeloka.asadinedu.com/php/materi/09-session-dan-cookie/`:
1. Lengkapi `<title>`, `<meta name="description">`, dan `<link rel="canonical">` dengan URL absolut.
2. Tambahkan metadata Open Graph lengkap termasuk dimensi gambar `1200×630` dan teks alternatif `og:image:alt`.
3. Tambahkan blok `<script type="application/ld+json">` bertipe `"TechArticle"` yang mencantumkan `headline`, `datePublished` (`"2026-10-16"`), `inLanguage` (`"id"`), dan `author`.

## Kuis Pemahaman

### Soal 1
Mengapa halaman web produksi sebaiknya memiliki elemen `<link rel="canonical" href="https://...">` di dalam `<head>`?
- A. Agar peramban mengunduh seluruh gambar di halaman secara paralel.
- B. Untuk memberitahu mesin pencari alamat URL utama yang resmi dari halaman tersebut, sehingga mencegah terpecahnya reputasi indeks akibat variasi parameter query (seperti `?utm_source=...`).
- C. Untuk memblokir peramban versi lama agar tidak dapat membuka halaman.
- D. Untuk mengalihkan (*redirect*) pengguna secara otomatis ke situs eksternal.

**Jawaban Benar:** B
**Penjelasan:** Parameter pelacakan atau variasi jalur URL sering membuat satu konten yang sama dapat diakses lewat banyak URL. Tag `rel="canonical"` memberi tahu mesin pencari URL mana yang harus diindeks sebagai sumber utama.

### Soal 2
Bagaimana cara yang benar untuk menuliskan nilai atribut `content` pada `<meta property="og:image" content="...">` agar kartu pratinjau tampil di WhatsApp, Telegram, dan LinkedIn?
- A. Cukup menuliskan nama berkasnya saja, misalnya `content="sampul.png"`.
- B. Menggunakan jalur relatif dokumen seperti `content="../assets/sampul.png"`.
- C. Menggunakan URL absolut lengkap dengan protokol dan nama domain, misalnya `content="https://kodeloka.asadinedu.com/assets/sampul.png"`.
- D. Menyematkan kode SVG mentah langsung di dalam atribut `content`.

**Jawaban Benar:** C
**Penjelasan:** Platform pratinjau seperti Facebook, WhatsApp, dan LinkedIn mengharapkan nilai `og:image` dan `og:url` berupa URL absolut lengkap (`https://...`) agar perayap eksternal dapat mengunduh gambar tersebut secara langsung tanpa salah menebak domain.

### Soal 3
Format manakah yang direkomendasikan di dalam elemen `<head>` untuk menyajikan data terstruktur (*structured data* berbasis Schema.org) kepada mesin pencari modern tanpa mengotori markup elemen visual di `<body>`?
- A. `<script type="application/ld+json">`
- B. `<meta name="keywords">`
- C. `<style type="text/schema">`
- D. `<xml id="schema-data">`

**Jawaban Benar:** A
**Penjelasan:** JSON-LD (`<script type="application/ld+json">`) memisahkan metadata terstruktur Schema.org dalam format JSON murni yang mudah dibuat, divalidasi, dan dipelihara tanpa perlu menempelkan atribut microdata pada setiap tag HTML di dalam `<body>`.

## Sumber
- [Structuring documents — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents)
- [HTML Standard (`link` and `meta` elements) — WHATWG](https://html.spec.whatwg.org/multipage/)
- [Learn HTML — web.dev](https://web.dev/learn/html)
