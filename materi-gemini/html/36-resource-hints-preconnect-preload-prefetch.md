# Strategi Resource Hints Mendalam: `dns-prefetch`, `preconnect`, `preload`, dan `modulepreload`

- **Tingkat:** Lanjut
- **Ringkasan:** Memilih petunjuk pemuatan jaringan yang tepat pada elemen `<link>` tanpa membanjiri bandwidth pengguna, memahami kapan `crossorigin` wajib disertakan, dan mengukur dampaknya di waterfall jaringan.

## Mengapa Peramban Membutuhkan Petunjuk Awal (*Resource Hints*) di `<head>`?

Saat peramban mengunduh dokumen HTML, ia baru mengetahui keberadaan berkas fon web (`@font-face`), gambar latar CSS (`background-image`), atau sub-modul JavaScript yang diimpor di lapisan dalam **setelah** berkas CSS atau JavaScript induknya selesai diunduh dan diurai. Keterlambatan penemuan aset (*late discovery*) ini menciptakan rantai permintaan berurutan (*network waterfall*) yang memperlambat *First Contentful Paint* (FCP) dan *Largest Contentful Paint* (LCP).

Melalui **Resource Hints** pada elemen `<link>`, Anda dapat memberi tahu peramban di dalam `<head>` tentang koneksi domain atau berkas kritis apa saja yang harus segera disiapkan sejak detik pertama.

## 1. Perbandingan Lima Jenis Resource Hints (`dns-prefetch` hingga `prefetch`)

Setiap nilai `rel` pada `<link>` memiliki biaya jaringan dan tujuan yang sangat berbeda:

| Nilai `rel` | Apa yang Dilakukan Peramban? | Kapan Harus Digunakan? |
|---|---|---|
| `dns-prefetch` | Hanya melakukan resolusi nama domain (DNS lookup) di latar belakang. Biaya CPU/jaringan sangat kecil. | Untuk domain pihak ketiga sekunder (misalnya layanan analitik atau peta) yang akan diakses nanti. |
| `preconnect` | Melakukan **DNS lookup + TCP handshake + negosiasi TLS** sekaligus ke domain tujuan. | Hanya untuk **1–2 domain lintas-asal kritis** yang pasti akan segera diminta dalam waktu kurang dari 10 detik (misalnya CDN aset utama atau API autentikasi). |
| `preload` | Memaksa peramban **segera mengunduh berkas spesifik** dengan prioritas tinggi untuk digunakan di **halaman saat ini**. Wajib menyertakan atribut `as="..."`. | Untuk fon utama judul (`as="font"`), gambar LCP yang dimuat dari CSS (`as="image"`), atau stylesheet kritis. |
| `modulepreload` | Mengunduh, mengurai, dan mengompilasi modul ES (`.js`) ke dalam *module map* peramban sejak awal. | Untuk memangkas rantai ketergantungan `import` bertingkat pada aplikasi berbasis ES Modules. |
| `prefetch` | Mengunduh berkas dengan prioritas **paling rendah** saat jaringan sedang menganggur (*idle*) untuk **navigasi halaman berikutnya**. | Untuk berkas halaman atau bundel rute berikutnya yang kemungkinan besar akan diklik pengguna (misalnya halaman "Modul 2"). |

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resource Hints — Kodeloka</title>

    <!-- Buka koneksi lebih awal ke domain yang pasti dipakai segera -->
    <link rel="preconnect" href="https://cdn.asadinedu.com" crossorigin>
    <!-- Cadangan ringan untuk domain yang kurang kritis -->
    <link rel="dns-prefetch" href="https://analitik.contoh.id">

    <!-- Unduh aset kritis untuk layar pertama; as wajib, crossorigin wajib untuk fon -->
    <link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/assets/sampul-1200.avif" as="image" fetchpriority="high">

    <link rel="stylesheet" href="/assets/learning.css">
    <link rel="modulepreload" href="/assets/app.js">
    <script type="module" src="/assets/app.js"></script>

    <!-- Tebakan navigasi berikutnya, diunduh saat peramban sedang senggang -->
    <link rel="prefetch" href="/html/materi/02-struktur-dokumen-html/">
  </head>
  <body>
    <main>
      <h1>Resource Hints</h1>
      <p>Hint hanyalah petunjuk; peramban boleh mengabaikannya dan terlalu banyak preload justru memperlambat halaman.</p>
    </main>
  </body>
</html>
```

> **Status dukungan (Oktober 2026):** `preconnect`, `preload`, dan `modulepreload` berstatus *Baseline Widely Available*. `dns-prefetch` baru *Baseline Newly Available* sejak September 2025, sedangkan `prefetch` belum berstatus Baseline (Safari belum mendukungnya), jadi anggap keduanya sebagai optimasi opsional.

## 2. Jebakan Klasik Atribut `crossorigin` pada `preload` Fon Web dan `preconnect`

Salah satu kesalahan performa paling sering di produksi terjadi ketika melakukan `preload` pada berkas fon (`.woff2`):

> **⚠️ Wajib Menyertakan `crossorigin` pada `<link rel="preload" as="font">`:** Menurut spesifikasi CSS Fonts, seluruh permintaan fon web (`@font-face`) selalu diambil oleh peramban menggunakan **mode CORS anonim**, bahkan ketika berkas fon tersebut berada di domain yang sama (*same-origin*) dengan halaman HTML!
> Jika Anda menulis `<link rel="preload" href="/fon.woff2" as="font">` **tanpa** atribut `crossorigin`, maka berkas fon akan diunduh ke dalam *cache non-CORS*. Ketika CSS `@font-face` dieksekusi, peramban menolak memakai hasil `preload` tersebut dan **mengunduh ulang berkas fon yang sama untuk kedua kalinya**!

Hal serupa berlaku pada `<link rel="preconnect">`:
- Jika domain tujuan hanya melayani gambar biasa (`<img>`) atau skrip biasa tanpa CORS, tulis `<link rel="preconnect" href="https://cdn.contoh.id">` (tanpa `crossorigin`).
- Jika domain tujuan melayani **fon web (`@font-face`)**, **`fetch()` CORS**, atau **`<script type="module">`** lintas-asal, Anda **wajib** menambahkan `crossorigin` pada `<link rel="preconnect" href="https://cdn.contoh.id" crossorigin>` agar soket koneksi yang dibuka berada di kolam koneksi (*connection pool*) CORS yang tepat.

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Melakukan `preload` pada berkas yang tidak dipakai dalam 3 detik pertama:** Jika Anda mem-`preload` berkas yang ternyata tidak segera dipakai oleh halaman saat ini, Chrome dan Firefox akan memunculkan peringatan di Console: *"The resource ... was preloaded using link preload but not used within a few seconds from the window's load event"*, dan Anda telah membuang kuota data pengguna secara percuma.
2. **Membuka `preconnect` ke 8 domain sekaligus:** Setiap koneksi TCP/TLS memakan memori dan siklus CPU di perangkat pengguna maupun di server. Jika koneksi `preconnect` tidak terpakai dalam ~10 detik, peramban akan menutupnya kembali. Batasi `preconnect` hanya untuk 1–2 domain paling kritis.
3. **Lupa menulis atribut `as` pada `<link rel="preload">`:** Tanpa atribut `as` yang valid (`as="font"`, `as="image"`, `as="style"`, `as="script"`), peramban tidak dapat menentukan prioritas unduhan dan kebijakan *Content Security Policy* (CSP) yang tepat sehingga petunjuk `preload` diabaikan.

## Latihan Praktik

Buatlah berkas `36-resource-hints-preconnect-preload-prefetch.html`:
1. Pasang `<link rel="preconnect" href="https://cdn.asadinedu.com" crossorigin>` untuk menyiapkan koneksi CDN fon.
2. Pasang `<link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>` dan pastikan aturan `@font-face` di dalam `<style>` merujuk ke URL `/assets/fonts/inter-latin.woff2` yang sama persis.
3. Pasang `<link rel="modulepreload">` untuk modul JavaScript utama dan `<link rel="prefetch">` untuk halaman materi berikutnya, lalu amati urutan pemuatannya di tab **Network** DevTools.

## Kuis Pemahaman

### Soal 1
Mengapa elemen `<link rel="preload" href="/fonts/utama.woff2" as="font" type="font/woff2" crossorigin>` **wajib** menyertakan atribut `crossorigin` meskipun berkas fon `.woff2` tersebut berada di domain yang sama (*same-origin*) dengan dokumen HTML?
- A. Karena berkas `.woff2` selalu dienkripsi dengan sertifikat TLS terpisah
- B. Karena spesifikasi CSS Fonts menetapkan bahwa pengambilan fon oleh `@font-face` selalu menggunakan mode CORS anonim; tanpa atribut `crossorigin` pada `preload`, peramban akan mengunduh berkas fon tersebut dua kali
- C. Karena atribut `as="font"` hanya berfungsi di peramban seluler jika disertai `crossorigin`
- D. Untuk mengubah format fon `.woff2` menjadi `.ttf` secara otomatis

**Jawaban Benar:** B
**Penjelasan:** Permintaan fon dari `@font-face` menggunakan kredensial mode CORS anonim. Agar cache hasil `preload` cocok dengan permintaan `@font-face`, elemen `<link rel="preload" as="font">` wajib menyertakan atribut `crossorigin` meskipun *same-origin*.

### Soal 2
Apa perbedaan mendasar antara `<link rel="preload">` dan `<link rel="prefetch">`?
- A. `preload` memaksa pengunduhan aset berprioritas tinggi yang dibutuhkan untuk **halaman saat ini**, sedangkan `prefetch` mengunduh aset dengan prioritas rendah saat peramban senggang untuk **navigasi halaman berikutnya**
- B. `preload` hanya untuk gambar, sedangkan `prefetch` hanya untuk berkas CSS
- C. `prefetch` memblokir perenderan HTML, sedangkan `preload` berjalan setelah halaman ditutup
- D. Keduanya memiliki perilaku dan prioritas jaringan yang sama persis

**Jawaban Benar:** A
**Penjelasan:** `preload` adalah instruksi deklaratif berprioritas tinggi untuk aset kritis pada halaman yang sedang dibuka sekarang, sementara `prefetch` adalah petunjuk spekulatif berprioritas rendah untuk mempercepat perpindahan ke halaman berikutnya.

### Soal 3
Tahapan jaringan apa saja yang dituntaskan lebih awal oleh `<link rel="preconnect" href="https://api.kodeloka.id">` dibandingkan `<link rel="dns-prefetch" href="https://api.kodeloka.id">`?
- A. `preconnect` otomatis mengunduh seluruh isi database dari `api.kodeloka.id`
- B. Sementara `dns-prefetch` hanya menyelesaikan pencarian alamat IP (DNS lookup), `preconnect` menyelesaikan **DNS lookup ditambah jabat tangan TCP (*TCP handshake*) dan negosiasi TLS** sekaligus
- C. `preconnect` mematikan pemeriksaan sertifikat HTTPS agar koneksi lebih cepat
- D. `dns-prefetch` lebih lengkap karena langsung mengunduh berkas `index.html`

**Jawaban Benar:** B
**Penjelasan:** `preconnect` menghemat hingga tiga putaran waktu bolak-balik jaringan (*round-trip time*) karena menuntaskan resolusi DNS, koneksi TCP, dan jabat tangan TLS sebelum permintaan HTTP pertama dikirim.

## Sumber
- [`rel="preload"` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload)
- [`rel="preconnect"` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preconnect)
- [`rel="modulepreload"` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/modulepreload)
- [Establish network connections early — web.dev](https://web.dev/articles/preconnect-and-dns-prefetch)
- [Preload critical assets — web.dev](https://web.dev/articles/preload-critical-assets)
