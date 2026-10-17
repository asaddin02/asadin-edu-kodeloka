# Web App Manifest (`manifest.webmanifest`), `theme-color`, dan Ikon Aplikasi Seluler

- **Tingkat:** Menengah
- **Ringkasan:** Menghubungkan halaman HTML dengan berkas `manifest.webmanifest`, mengatur warna bilah status peramban dengan `<meta name="theme-color">` (mendukung media gelap/terang), serta menyediakan ikon aplikasi yang tajam.

## Mengapa Halaman Web Modern Memerlukan Web App Manifest dan Set Ikon Terstruktur?

Ketika pengguna menyematkan situs Anda ke layar utama ponsel (*Add to Home Screen*), memasukkannya ke bilah markah (*bookmarks*), atau membuka tab di peramban seluler, sistem operasi mencari identitas aplikasi Anda di dalam elemen `<head>` dan berkas **`manifest.webmanifest`**.

Tanpa konfigurasi ini, ponsel hanya menampilkan tangkapan layar buram sebagai ikon, bilah alamat peramban tetap berwarna abu-abu standar yang kontras dengan desain situs, dan aplikasi terbuka di dalam tab peramban biasa alih-alih jendela mandiri (*standalone*).

## 1. Menghubungkan `<link rel="manifest">`, `<meta name="theme-color">`, dan Ikon Modern

Alih-alih memenuhi `<head>` dengan 20 baris tag favicon warisan tahun 2010-an, praktik pengembangan web modern cukup mengandalkan **empat baris tag** di `<head>` ditambah berkas `manifest.webmanifest`:

| Elemen di `<head>` | Fungsi & Dukungan Perangkat |
|---|---|
| `<link rel="manifest" href="/manifest.webmanifest">` | Menunjuk berkas JSON manifest untuk Android, Chrome, Edge, dan pemasangan PWA. (Tambahkan `crossorigin="use-credentials"` jika berkas manifest membutuhkan pengiriman cookie autentikasi). |
| `<meta name="theme-color" content="..." media="...">` | Mewarnai bilah alamat/status peramban seluler dan bilah judul PWA agar menyatu dengan tema terang atau gelap halaman. |
| `<link rel="icon" href="/icon.svg" type="image/svg+xml">` | Ikon tab vektor yang tajam di segala ukuran layar dan mendukung `@media (prefers-color-scheme: dark)` di dalam SVG-nya! |
| `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` | Ikon PNG `180×180` piksel tanpa transparansi khusus untuk layar utama iOS/iPadOS Safari. |

Berikut adalah contoh dokumen HTML yang menerapkan keempat elemen tersebut beserta dukungan `theme-color` adaptif untuk mode terang dan gelap:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aplikasi Web Kodeloka</title>

    <link rel="manifest" href="/manifest.webmanifest">
    <meta name="theme-color" content="#2563eb" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)">
    <link rel="icon" href="/assets/brand/icon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png">
  </head>
  <body>
    <main>
      <h1>Kodeloka</h1>
      <p>Halaman ini terhubung ke manifest aplikasi web dan mengatur warna bilah peramban.</p>
    </main>
  </body>
</html>
```

## 2. Membedah Isi Berkas `manifest.webmanifest` dan Ikon `maskable`

Berkas `/manifest.webmanifest` yang dirujuk oleh `<link rel="manifest">` berisi objek JSON sesuai spesifikasi [W3C Web Application Manifest](https://www.w3.org/TR/appmanifest/) dan sebaiknya dilayani oleh server dengan header HTTP `Content-Type: application/manifest+json`:

```json
{
  "name": "Kodeloka — Belajar Pemrograman Bahasa Indonesia",
  "short_name": "Kodeloka",
  "lang": "id",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#2563eb",
  "icons": [
    { "src": "/assets/brand/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/assets/brand/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/assets/brand/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### Makna Properti Utama di dalam `manifest.webmanifest`:
- **`name` vs `short_name`:** `name` ditampilkan saat dialog instalasi dan layar pembuka (*splash screen*), sedangkan `short_name` (maksimal sekitar 12 karakter) digunakan di bawah ikon layar utama ponsel agar tidak terpotong elipsis.
- **`display`:** Mengatur tampilan jendela saat dibuka dari ikon layar utama:
  - `"standalone"`: Tampil seperti aplikasi asli (tanpa bilah URL peramban, tetapi bilah status baterai/jam sistem tetap terlihat).
  - `"minimal-ui"`: Menyisakan tombol navigasi mundur/muat ulang minimal.
  - `"fullscreen"`: Memenuhi seluruh layar termasuk menyembunyikan bilah status sistem (cocok untuk gim).
  - `"browser"`: Membuka di tab peramban biasa.
- **`purpose: "maskable"` pada `icons`:** Sistem operasi Android memotong ikon aplikasi menjadi berbagai bentuk (lingkaran, persegi membulat, *squircle*). Ikon dengan `"purpose": "maskable"` dirancang memiliki **zona aman (*safe zone*) di lingkaran tengah berdiameter 80%** sehingga logo tidak terpotong oleh topeng sistem operasi, dan tidak dikecilkan ke dalam lingkaran putih yang canggung.

> **Status dukungan (Oktober 2026):** Web App Manifest dan `<meta name="theme-color">` belum berstatus Baseline karena dukungannya berbeda antar-peramban dan platform (misalnya Firefox desktop tidak memasang aplikasi web dan tidak memakai `theme-color`). Perlakukan keduanya sebagai peningkatan progresif.

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Menggabungkan `"purpose": "any maskable"` pada satu gambar ikon yang tidak memiliki *padding* zona aman:** Jika satu berkas ikon yang logonya memenuhi sampai ke tepi gambar diberi `"purpose": "any maskable"`, maka di Android ujung logonya akan terpotong habis! Sediakan berkas terpisah untuk `"purpose": "any"` (bawaan) dan `"purpose": "maskable"`.
2. **Hanya memasang satu `<meta name="theme-color">` statis pada situs yang memiliki Mode Gelap:** Tanpa atribut `media="(prefers-color-scheme: dark)"`, pengguna mode gelap akan silau melihat bilah atas peramban yang tetap berwarna putih terang.
3. **Memberikan latar belakang transparan pada `apple-touch-icon.png`:** iOS mengubah area transparan pada `apple-touch-icon` menjadi warna **hitam pekat**, yang sering merusak keterbacaan logo berwarna gelap. Selalu beri warna latar solid pada `apple-touch-icon.png`.

## Latihan Praktik

Buatlah berkas `35-pwa-manifest-dan-meta-aplikasi-seluler.html` dan `manifest.webmanifest`:
1. Di dalam berkas HTML, pasang `<link rel="manifest">`, dua `<meta name="theme-color">` untuk mode terang (`#f8fafc`) dan gelap (`#0f172a`), serta tautan ikon SVG dan `apple-touch-icon`.
2. Buat berkas `manifest.webmanifest` yang mendefinisikan `name`, `short_name`, `start_url`, `display: "standalone"`, dan 3 entri `icons` (`192x192`, `512x512`, dan `512x512` maskable).
3. Buka panel **Application -> Manifest** di Chrome/Edge DevTools untuk memeriksa apakah manifest terdeteksi tanpa peringatan ikon.

## Kuis Pemahaman

### Soal 1
Bagaimana cara mengatur `<meta name="theme-color">` agar bilah status peramban seluler otomatis menyesuaikan warnanya ketika pengguna mengaktifkan mode terang maupun mode gelap di perangkatnya?
- A. Menulis `<meta name="theme-color" content="light-dark(#2563eb, #0f172a)">`
- B. Menyediakan dua elemen `<meta name="theme-color">` terpisah yang masing-masing dilengkapi atribut `media="(prefers-color-scheme: light)"` dan `media="(prefers-color-scheme: dark)"`
- C. Menempatkan `<meta name="theme-color">` di dalam berkas CSS eksternal
- D. Menggunakan atribut `theme="auto"` pada tag `<html>`

**Jawaban Benar:** B
**Penjelasan:** Elemen `<meta name="theme-color">` mendukung atribut `media` berisi kueri media CSS seperti `(prefers-color-scheme: dark)`, sehingga kita dapat menyediakan dua tag `<meta>` dengan warna yang sesuai untuk masing-masing skema warna.

### Soal 2
Apa fungsi dari properti `"purpose": "maskable"` pada entri objek di dalam array `"icons"` pada `manifest.webmanifest`?
- A. Menyembunyikan ikon aplikasi dari layar utama pengguna
- B. Menandakan bahwa ikon dirancang dengan zona aman di bagian tengah sehingga sistem operasi (seperti Android) dapat memotong bentuk pinggiran ikon secara penuh (lingkaran, *squircle*) tanpa memotong logo utama atau mengecilkannya ke dalam bingkai putih
- C. Mengenkripsi berkas gambar PNG agar tidak dapat diunduh
- D. Mengubah gambar PNG menjadi animasi video secara otomatis

**Jawaban Benar:** B
**Penjelasan:** Ikon *maskable* menjamin seluruh konten penting berada di dalam area aman (lingkaran tengah 80%) sehingga tampil penuh dan proporsional saat dipotong oleh berbagai bentuk mask sistem operasi.

### Soal 3
Nilai `"display"` manakah di dalam `manifest.webmanifest` yang membuat aplikasi web terbuka di jendela tersendiri seperti aplikasi asli (tanpa bilah alamat URL peramban), tetapi tetap menampilkan bilah status sistem operasi (jam, sinyal, dan baterai)?
- A. `"browser"`
- B. `"standalone"`
- C. `"fullscreen"`
- D. `"hidden"`

**Jawaban Benar:** B
**Penjelasan:** Mode `"standalone"` menghilangkan UI navigasi peramban (seperti bilah URL) sehingga aplikasi terasa seperti aplikasi native, namun tetap mempertahankan bilah status sistem operasi, berbeda dengan `"fullscreen"` yang menyembunyikan seluruh antarmuka sistem.

## Sumber
- [Web app manifests — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)
- [`<meta name="theme-color">` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color)
- [Web Application Manifest — W3C](https://www.w3.org/TR/appmanifest/)
