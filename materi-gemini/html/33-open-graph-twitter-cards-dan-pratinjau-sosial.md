# Metadata Pratinjau Sosial: Protokol Open Graph (`og:*`), Kartu Pratinjau, dan Debugging Bot

- **Tingkat:** Menengah
- **Ringkasan:** Merancang metadata Open Graph lengkap (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`, `og:locale`) agar tautan halaman tampil optimal saat dibagikan di WhatsApp, Telegram, Slack, LinkedIn, dan X.

## Mengapa Tautan yang Dibagikan di WhatsApp atau Slack Sering Tampil Tanpa Gambar?

Saat seseorang membagikan tautan halaman web Anda di grup WhatsApp, Telegram, Discord, Slack, LinkedIn, atau X, aplikasi pesan tersebut mengirim bot perayap (*crawler*) ringan untuk mengunduh HTML halaman Anda dan mencari tag `<meta>` di dalam `<head>`. Bot perayap ini **hanya membaca respons HTML mentah dari server** dan umumnya **tidak mengeksekusi JavaScript**.

Jika halaman Anda tidak menyertakan metadata **Open Graph (`og:*`)** di HTML awal, atau menulis jalur gambar relatif seperti `/assets/sampul.png` alih-alih URL absolut `https://...`, maka kartu pratinjau akan tampil kosong, terpotong, atau gagal memuat gambar.

## 1. Empat Properti Wajib dan Properti Pelengkap Protokol Open Graph

Berdasarkan spesifikasi resmi [The Open Graph protocol](https://ogp.me/), setiap halaman yang ingin tampil sebagai objek kaya di jejaring sosial dan aplikasi pesan harus menyertakan **empat properti dasar wajib** (`og:title`, `og:type`, `og:image`, dan `og:url`) menggunakan atribut **`property="..."`** dan **`content="..."`** pada elemen `<meta>`:

| Properti `<meta property="...">` | Status | Aturan & Rekomendasi Produksi |
|---|---|---|
| `og:title` | **Wajib** | Judul spesifik halaman tanpa embel-embel nama situs yang berulang (ideal 40–60 karakter). |
| `og:type` | **Wajib** | Gunakan `"website"` untuk beranda/halaman indeks, atau `"article"` untuk halaman artikel/materi. |
| `og:image` | **Wajib** | **Gunakan URL absolut (`https://...`)** menuju gambar berformat PNG, JPEG, atau WebP (ukuran standar **1200 × 630 piksel**, rasio `1.91:1`). |
| `og:url` | **Wajib** | URL kanonis absolut halaman tersebut (harus selaras dengan `<link rel="canonical">`). |
| `og:description` | Pelengkap penting | Ringkasan singkat 1–2 kalimat (sekitar 110–160 karakter) yang menjelaskan isi halaman. |
| `og:site_name` | Pelengkap | Nama merek atau platform induk (misalnya `"Kodeloka"`). |
| `og:locale` | Pelengkap | Bahasa dan wilayah halaman dalam format `bahasa_WILAYAH` (misalnya `"id_ID"`). |
| `og:image:width` & `og:image:height` | Pelengkap penting | Dimensi piksel gambar (`1200` dan `630`) agar aplikasi pesan dapat langsung merender pratinjau pada pembagian pertama tanpa menunggu unduhan gambar selesai. |
| `og:image:alt` | Pelengkap aksesibilitas | Deskripsi tekstual gambar pratinjau bagi pengguna pembaca layar di platform sosial. |

## 2. Menggabungkan Open Graph dengan Kartu Pratinjau X (`twitter:card`)

Platform X (Twitter) memiliki konvensi metadata `name="twitter:*"`, namun mesin perayap X secara resmi **menggunakan tag `og:title`, `og:description`, dan `og:image` sebagai cadangan otomatis**. Artinya, Anda tidak perlu menduplikasi seluruh tag judul dan gambar! Anda cukup menambahkan satu tag `<meta name="twitter:card" content="summary_large_image">` agar tautan ditampilkan dengan kartu gambar lebar:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Belajar PostgreSQL: Indeks, EXPLAIN ANALYZE, dan MVCC — Kodeloka</title>
    <meta name="description" content="Kurikulum PostgreSQL berbahasa Indonesia lengkap dengan latihan dan kuis.">
    <link rel="canonical" href="https://kodeloka.asadinedu.com/postgresql/">

    <!-- Open Graph: selalu gunakan URL absolut -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Kodeloka">
    <meta property="og:locale" content="id_ID">
    <meta property="og:title" content="Belajar PostgreSQL: Indeks, EXPLAIN ANALYZE, dan MVCC">
    <meta property="og:description" content="Kurikulum PostgreSQL berbahasa Indonesia lengkap dengan latihan dan kuis.">
    <meta property="og:url" content="https://kodeloka.asadinedu.com/postgresql/">
    <meta property="og:image" content="https://kodeloka.asadinedu.com/assets/og-postgresql.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Kartu kelas PostgreSQL di Kodeloka">

    <!-- Kartu untuk X (Twitter); tag lain akan memakai nilai og:* sebagai cadangan -->
    <meta name="twitter:card" content="summary_large_image">
  </head>
  <body>
    <main>
      <h1>Belajar PostgreSQL</h1>
      <p>Perayap hanya membaca bagian head di atas; isi halaman tidak memengaruhi kartu pratinjau.</p>
    </main>
  </body>
</html>
```

> **Catatan:** Open Graph dan `twitter:*` tidak memiliki status Baseline karena bukan fitur peramban. Perilaku tiap platform (ukuran gambar, panjang judul, cache pratinjau) ditentukan oleh platform itu sendiri dan dapat berubah, jadi uji tautan Anda dengan alat penelusuran masing-masing platform.

## 3. Cara Menguji dan Menyegarkan Cache Bot Perayap

Anda dapat memeriksa apakah server Anda sudah mengirimkan tag Open Graph di dalam HTML awal tanpa membuka peramban menggunakan perintah `curl` sederhana di terminal:

```bash
curl -sL https://kodeloka.asadinedu.com/postgresql/ | grep -E 'property="og:|name="twitter:'
```

Jika Anda baru saja mengganti gambar `og:image` di server tetapi pratinjau di Telegram atau LinkedIn masih menampilkan gambar lama, penyebabnya adalah **cache pratinjau di server platform sosial**. Cara mengatasinya:
1. Saat mengganti berkas gambar pratinjau, ubah juga nama berkas atau tambahkan parameter versi pada URL gambar (misalnya `og-postgresql-v2.png`) agar bot menganggapnya sebagai gambar baru.
2. Gunakan alat pembersih cache resmi masing-masing platform (seperti *Telegram Webpage Bot* `@WebpageBot` atau *LinkedIn Post Inspector*).

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menulis URL relatif pada `og:image` atau `og:url`:** Menulis `<meta property="og:image" content="/assets/og.png">` sering gagal diurai oleh perayap pihak ketiga yang mengharapkan URL lengkap beserta skema dan nama host (`https://domain.id/assets/og.png`).
2. **Menyuntikkan tag `og:*` lewat JavaScript di sisi klien (*Client-Side Rendering*):** Bot WhatsApp, Telegram, Discord, dan Slack tidak menjalankan bundel JavaScript SPA untuk menunggu `document.head` diperbarui. Tag `<meta property="og:*">` wajib sudah tercetak di dalam HTML statis atau hasil *Server-Side Rendering* (SSR).
3. **Menggunakan format `.svg` untuk `og:image`:** Hampir seluruh perayap platform sosial menolak merender gambar vektor `.svg` sebagai kartu pratinjau demi alasan keamanan dan performa. Gunakan format raster **PNG**, **JPEG**, atau **WebP** dengan ukuran berkas di bawah **300 KB** (khususnya agar pratinjau WhatsApp di jaringan seluler tetap muncul).

## Latihan Praktik

Buatlah berkas `33-open-graph-twitter-cards-dan-pratinjau-sosial.html` untuk halaman artikel tutorial:
1. Lengkapi `<head>` dengan `<title>`, `<meta name="description">`, dan `<link rel="canonical">`.
2. Tambahkan seluruh tag Open Graph (`og:type` bernilai `"article"`, `og:site_name`, `og:locale`, `og:title`, `og:description`, `og:url`, `og:image` dengan URL absolut `https://...`, `og:image:width`, `og:image:height`, dan `og:image:alt`).
3. Tambahkan `<meta name="twitter:card" content="summary_large_image">` dan pastikan seluruh nilai `og:url` serta `og:image` menggunakan URL absolut yang konsisten.

## Kuis Pemahaman

### Soal 1
Mengapa tag `<meta property="og:title">` dan `<meta property="og:image">` yang baru dibuat menggunakan `document.head.appendChild(...)` di JavaScript sisi klien sering tidak terbaca saat tautan dibagikan di WhatsApp, Telegram, atau Slack?
- A. Karena protokol Open Graph melarang penggunaan bahasa JavaScript di seluruh halaman
- B. Karena bot perayap pratinjau sosial umumnya hanya mengunduh dan membaca dokumen HTML mentah dari server tanpa mengeksekusi JavaScript
- C. Karena `document.head` bersifat *read-only* di HTML5
- D. Karena tag Open Graph wajib diletakkan di dalam elemen `<footer>`

**Jawaban Benar:** B
**Penjelasan:** Perayap pratinjau tautan milik aplikasi pesan instan dan jejaring sosial mengambil respons HTML awal melalui permintaan HTTP biasa dan tidak menjalankan mesin JavaScript peramban, sehingga metadata harus sudah ada di HTML dari server.

### Soal 2
Manakah empat properti dasar yang berstatus **wajib** (*required*) pada setiap halaman menurut spesifikasi resmi protokol Open Graph (`ogp.me`)?
- A. `og:title`, `og:type`, `og:image`, dan `og:url`
- B. `og:author`, `og:keywords`, `og:theme`, dan `og:Audio`
- C. `og:width`, `og:height`, `og:alt`, dan `og:card`
- D. `og:site_name`, `og:locale`, `og:updated_time`, dan `og:ttl`

**Jawaban Benar:** A
**Penjelasan:** Dokumentasi resmi Open Graph (`ogp.me`) menetapkan empat metadata dasar yang wajib ada di setiap halaman objek: `og:title`, `og:type`, `og:image`, dan `og:url`.

### Soal 3
Mengapa format gambar `.svg` tidak boleh digunakan sebagai nilai `<meta property="og:image">`, dan format serta URL apa yang sebaiknya digunakan?
- A. Karena `.svg` hanya bisa dibuka di sistem operasi Linux; gunakan `.bmp` dengan URL relatif
- B. Karena perayap platform sosial menolak merender `.svg` pada kartu pratinjau; gunakan gambar raster (PNG, JPEG, atau WebP) berukuran sekitar 1200×630 piksel dengan URL absolut (`https://...`)
- C. Karena `.svg` memiliki ukuran berkas minimal 50 MB; gunakan `.ico`
- D. Karena elemen `<meta>` hanya menerima data gambar dalam bentuk Base64 `data:image/svg+xml`

**Jawaban Benar:** B
**Penjelasan:** Bot pratinjau sosial tidak merender SVG sebagai gambar kartu dan mengharapkan URL absolut menuju gambar raster seperti PNG, JPEG, atau WebP.

## Sumber
- [The Open Graph protocol](https://ogp.me/)
- [`<meta>` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta)
- [Metadata — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/semantics.html)
