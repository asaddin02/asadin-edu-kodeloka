# Keamanan Markup HTML: Subresource Integrity (`integrity`), `crossorigin`, dan `referrerpolicy`

- **Tingkat:** Lanjut
- **Ringkasan:** Melindungi halaman dari modifikasi aset CDN pihak ketiga menggunakan *Subresource Integrity* (`integrity="sha384-..."`), mengelola atribut `crossorigin="anonymous"`, serta mengendalikan kebocoran URL lewat `referrerpolicy`.

## Mengapa Memuat Skrip atau Stylesheet Eksternal Tanpa Pengamanan Sangat Berbahaya?

Banyak situs memuat pustaka JavaScript atau CSS dari *Content Delivery Network* (CDN) pihak ketiga. Namun, apa yang terjadi apabila server CDN tersebut diretas atau akun penerbit pustaka diambil alih, lalu berkas `pustaka.js` di CDN disisipi skrip pencuri kata sandi? Tanpa verifikasi integritas, peramban pengunjung situs Anda akan langsung mengeksekusi skrip jahat tersebut dengan hak akses penuh di domain Anda!

Selain risiko modifikasi aset eksternal, setiap kali halaman Anda memuat gambar eksternal atau pengguna mengeklik tautan keluar, peramban mengirimkan header HTTP **`Referer`** yang dapat membocorkan jalur URL sensitif (seperti `/reset-sandi?token=rahasia123` atau `/dasbor/proyek-internal-42`) kepada server pihak ketiga. HTML menyediakan tiga atribut pertahanan utama untuk mengatasi masalah ini: **`integrity`**, **`crossorigin`**, dan **`referrerpolicy`**.

## 1. Memverifikasi Keaslian Berkas dengan Subresource Integrity (`integrity`)

Spesifikasi [W3C Subresource Integrity (SRI)](https://www.w3.org/TR/sri/) memungkinkan Anda mencantumkan nilai *cryptographic hash* (**`sha256-`**, **`sha384-`**, atau **`sha512-`** dalam pengodean Base64) dari isi berkas yang Anda harapkan pada elemen `<script>` atau `<link rel="stylesheet">`.

Saat peramban selesai mengunduh berkas dari CDN, peramban menghitung ulang hash SHA-384 dari byte berkas yang diterima lalu membandingkannya dengan nilai atribut `integrity`:
- Jika cocok persis, skrip atau stylesheet dijalankan.
- Jika berubah **walau hanya satu karakter spasi**, peramban langsung **menolak mengeksekusi berkas tersebut** dan mencatat galat keamanan di Console!

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subresource Integrity — Kodeloka</title>
  </head>
  <body>
    <main>
      <h1>Subresource Integrity</h1>
      <!-- Peramban menolak menjalankan skrip jika hash isi berkas tidak cocok -->
      <script
        src="https://cdn.asadinedu.com/halo.js"
        integrity="sha384-SofzUEmit+NqsjHwKor7buTsNR+Af94/XMW9op3H0BF3ciOJi2w94eqIO4/Nebsl"
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      ></script>
    </main>
  </body>
</html>
```

Hash pada atribut `integrity` dihitung dari isi berkas yang sebenarnya, misalnya dengan perintah berikut (nilai di atas adalah hash dari berkas yang hanya berisi `console.log("halo");` ditambah satu baris baru):

```bash
openssl dgst -sha384 -binary halo.js | openssl base64 -A
```

Untuk skrip lintas-origin, atribut `crossorigin="anonymous"` wajib ada dan server CDN harus mengirim header `Access-Control-Allow-Origin`; jika tidak, pemeriksaan integritas gagal dan skrip diblokir.

> **Status dukungan (Oktober 2026):** Subresource Integrity (`integrity`) dan `referrerpolicy` berstatus *Baseline Widely Available*.

## 2. Peran Atribut `crossorigin`: `"anonymous"` vs `"use-credentials"`

Atribut `crossorigin` pada `<script>`, `<link>`, `<img`, `<audio>`, dan `<video>` mengatur bagaimana peramban melakukan permintaan CORS (*Cross-Origin Resource Sharing*) ke domain lain:

| Nilai `crossorigin` | Pengiriman Kredensial (Cookie / TLS Client Cert) | Kegunaan Utama di Produksi |
|---|---|---|
| `crossorigin="anonymous"` (atau `crossorigin` kosong) | **Tidak mengirim** cookie atau kredensial pengguna ke domain lintas-asal. | Wajib disertakan saat memakai `integrity` (SRI) pada CDN publik, memuat fon `@font-face`, atau membaca piksel gambar CDN di `<canvas>`. |
| `crossorigin="use-credentials"` | **Mengirim** cookie/kredensial lintas-asal (server wajib merespons dengan `Access-Control-Allow-Credentials: true`). | Hanya untuk aset privat di subdomain internal perusahaan yang memerlukan verifikasi cookie sesi. |

Selain untuk SRI, menambahkan `crossorigin="anonymous"` pada `<script src="https://cdn...">` memungkinkan penangkap galat global `window.addEventListener("error")` melihat pesan galat lengkap dan nomor baris skrip, alih-alih hanya menerima pesan disensor `"Script error."`.

## 3. Mencegah Kebocoran URL Sensitif dengan `referrerpolicy`

Atribut **`referrerpolicy`** dapat dipasang per elemen (`<a>`, `<img>`, `<script>`, `<link>`, `<iframe>`) atau secara global untuk seluruh halaman melalui `<meta name="referrer" content="...">`:

| Nilai `referrerpolicy` | Apa yang Dikirim di Header HTTP `Referer`? | Kapan Digunakan? |
|---|---|---|
| `strict-origin-when-cross-origin` (Bawaan peramban modern) | Mengirim URL lengkap untuk navigasi *same-origin*, tetapi **hanya mengirim origin (`https://kodeloka.id/`)** saat menuju domain lain melalui HTTPS, dan tidak mengirim apa pun jika turun ke HTTP. | Kebijakan dasar yang seimbang untuk sebagian besar halaman umum. |
| `no-referrer` | **Sama sekali tidak mengirim** header `Referer` dalam kondisi apa pun. | Pada halaman yang memuat token rahasia di URL (seperti halaman reset kata sandi, tautan undangan privat, atau pemuatan skrip CDN pihak ketiga). |
| `same-origin` | Mengirim URL lengkap hanya ke domain yang sama; **kosong** untuk semua domain luar. | Aplikasi internal/dasbor administrasi agar tidak membocorkan keberadaan domain internal ke luar. |

```html
<!-- Mengunci kebijakan referrer seluruh halaman dari dalam <head> -->
<meta name="referrer" content="same-origin">

<!-- Atau mengunci khusus pada tautan keluar dan gambar eksternal -->
<a href="https://contoh-eksternal.com" referrerpolicy="no-referrer" rel="noopener">
  Buka Dokumentasi Eksternal
</a>
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Memasang `integrity="sha384-..."` pada URL CDN yang isinya berubah-ubah (seperti `/latest/app.js`):** SRI hanya boleh dipasang pada URL berkas yang **terkunci versinya** (misalnya `/v4.2.1/app.min.js`). Jika CDN memperbarui isi berkas `/latest/app.js`, hash-nya akan berubah dan peramban semua pengunjung Anda akan langsung memblokir skrip tersebut!
2. **Menulis `integrity` pada skrip lintas-origin tanpa `crossorigin="anonymous"`:** Tanpa mode CORS, peramban tidak diizinkan membaca isi respons lintas-origin untuk memverifikasi hash-nya sehingga skrip gagal dimuat.
3. **Menaruh token rahasia di URL tanpa `referrerpolicy="no-referrer"`:** Jika halaman `/reset?token=xyz` memuat satu gambar saja dari server pihak ketiga tanpa `no-referrer` (di peramban lama) atau pengguna mengeklik tautan eksternal, token dapat bocor melalui log `Referer`.

## Latihan Praktik

Buatlah berkas `37-keamanan-html-sri-referrerpolicy-dan-cors.html` dan berkas skrip lokal `sapa.js`:
1. Buat berkas `sapa.js` berisi `console.log("Skrip terverifikasi SRI!");` lalu hitung hash SHA-384-nya menggunakan perintah `openssl dgst -sha384 -binary sapa.js | openssl base64 -A`.
2. Muat `sapa.js` di dalam berkas HTML menggunakan `<script src="sapa.js" integrity="sha384-..." crossorigin="anonymous" referrerpolicy="no-referrer"></script>`.
3. Coba ubah satu huruf di dalam `sapa.js` tanpa memperbarui nilai `integrity` di HTML, muat ulang peramban, dan amati pesan pemblokiran keamanan di tab **Console** DevTools.

## Kuis Pemahaman

### Soal 1
Apa yang dilakukan peramban ketika berkas JavaScript dari CDN yang dimuat dengan `<script src="https://cdn.contoh.id/lib.js" integrity="sha384-..." crossorigin="anonymous">` telah dimodifikasi oleh pihak ketiga sehingga hash SHA-384-nya tidak lagi cocok?
- A. Peramban tetap menjalankan skrip tersebut sambil menampilkan ikon peringatan kecil di bilah alamat
- B. Peramban menolak mengeksekusi skrip tersebut sama sekali dan melaporkan galat integritas di Console
- C. Peramban otomatis mengunduh ulang versi lama dari Wayback Machine
- D. Peramban menghapus atribut `integrity` secara otomatis

**Jawaban Benar:** B
**Penjelasan:** Mekanisme Subresource Integrity (SRI) memverifikasi kecocokan hash kriptografis sebelum mengeksekusi berkas; jika tidak cocok, berkas langsung diblokir demi mencegah eksekusi kode yang telah dimanipulasi.

### Soal 2
Mengapa atribut `crossorigin="anonymous"` wajib disertakan ketika menggunakan atribut `integrity` pada elemen `<script>` atau `<link rel="stylesheet">` yang dimuat dari domain CDN berbeda?
- A. Agar peramban mengizinkan pembacaan byte respons lintas-origin melalui CORS untuk dihitung hash-nya tanpa mengirimkan cookie pengguna ke server CDN
- B. Agar skrip dijalankan di dalam Web Worker terpisah
- C. Untuk menyembunyikan alamat IP pengguna dari server CDN
- D. Karena atribut `integrity` hanya berlaku pada protokol HTTP tanpa TLS

**Jawaban Benar:** A
**Penjelasan:** Spesifikasi SRI mewajibkan sumber daya lintas-origin dimuat menggunakan CORS (`crossorigin="anonymous"`) agar isi berkas berhak diperiksa oleh peramban sebelum dieksekusi.

### Soal 3
Nilai `referrerpolicy` manakah yang memastikan peramban **sama sekali tidak mengirimkan** header HTTP `Referer` ketika pengguna mengeklik tautan keluar dari halaman sensitif (seperti halaman pemulihan kata sandi)?
- A. `referrerpolicy="unsafe-url"`
- B. `referrerpolicy="origin-when-cross-origin"`
- C. `referrerpolicy="no-referrer"`
- D. `referrerpolicy="all"`

**Jawaban Benar:** C
**Penjelasan:** Nilai `no-referrer` menginstruksikan peramban untuk menghilangkan header `Referer` sepenuhnya pada permintaan tersebut sehingga URL maupun nama domain asal tidak bocor ke server tujuan.

## Sumber
- [Subresource Integrity — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity)
- [Referrer-Policy — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy)
- [Cross-Origin Resource Sharing (CORS) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [Subresource Integrity — W3C](https://www.w3.org/TR/sri/)
