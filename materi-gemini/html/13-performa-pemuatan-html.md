# Performa Pemuatan HTML, Resource Hints, dan Core Web Vitals

- **Tingkat:** Lanjut
- **Ringkasan:** Mengoptimalkan kecepatan pemuatan halaman dan metrik Core Web Vitals (LCP, INP, CLS) langsung dari markup HTML melalui strategi pemuatan skrip (`defer`, `async`, `type="module"`), `loading="lazy"`, `fetchpriority`, dan *Resource Hints* (`preconnect`, `preload`).

## Mengapa Performa Dimulai dari Markup HTML?

Banyak pengembang baru memikirkan performa saat aplikasi sudah lambat, lalu berusaha mengoptimalkan kode JavaScript yang rumit. Padahal, keputusan paling menentukan terhadap seberapa cepat layar pertama tampil justru terjadi pada **detik pertama peramban membaca berkas HTML Anda**.

Tiga metrik pengalaman pengguna utama yang diukur oleh standar industri (**Core Web Vitals** di [web.dev](https://web.dev/)) sangat dipengaruhi oleh cara Anda menulis HTML:

| Metrik Core Web Vitals | Apa yang Diukur? | Target Baik | Peran Langsung Markup HTML |
|---|---|---|---|
| **LCP (*Largest Contentful Paint*)** | Waktu hingga elemen konten terbesar di layar pertama (biasanya gambar *hero* atau judul utama) selesai ditampilkan. | **≤ 2,5 detik** | Urutan `<link>`, penggunaan `fetchpriority="high"` pada gambar utama, dan menghindari `loading="lazy"` pada gambar teratas. |
| **INP (*Interaction to Next Paint*)** | Ketanggapan halaman saat pengguna mengeklik atau mengetik hingga perubahan visual berikutnya muncul di layar. | **≤ 200 ms** | Memanfaatkan komponen HTML bawaan (`<dialog>`, `<details>`, `popover`) dan mencegah `<script>` besar memblokir utas utama (*main thread*). |
| **CLS (*Cumulative Layout Shift*)** | Kestabilan visual halaman (apakah elemen melompat-lompat secara tiba-tiba saat halaman dimuat). | **≤ 0,1** | Selalu mencantumkan atribut `width` dan `height` pada `<img>`, `<video>`, dan `<iframe>`. |

## 1. Mengendalikan Pemuatan `<script>`: Biasa vs `async` vs `defer` vs `type="module"`

Ketika parser HTML sedang membaca dokumen dari atas ke bawah lalu menemukan tag `<script src="...">` biasa tanpa atribut tambahan, parser **wajib berhenti sejenak**, mengunduh berkas skrip tersebut, dan menjalankannya sampai selesai sebelum berani melanjutkan membaca baris HTML berikutnya. Mengapa? Karena skrip kuno mungkin memanggil `document.write()` yang mengubah struktur HTML.

Di era modern, Anda memiliki opsi yang jauh lebih efisien:

```
1. <script src="app.js"> (Tanpa atribut — Buruk di dalam <head>)
HTML Parsing: ████████░░░░░░░░░░░░░░░░░████████████
Unduh JS:             ▓▓▓▓▓▓▓
Eksekusi JS:                 ▒▒▒▒▒▒▒▒▒▒

2. <script src="analytics.js" async>
HTML Parsing: ████████████████░░░░░████████████████
Unduh JS:         ▓▓▓▓▓▓▓▓
Eksekusi JS:              ▒▒▒▒▒ (Langsung jalan begitu selesai diunduh; urutan tidak dijamin)

3. <script src="app.js" defer> atau <script type="module" src="app.js">
HTML Parsing: █████████████████████████████████████ (Tidak terputus sama sekali!)
Unduh JS:         ▓▓▓▓▓▓▓▓▓
Eksekusi JS:                                       ▒▒▒▒▒▒ (Jalan berurutan setelah DOM siap)
```

### Aturan Praktis Memilih Atribut `<script>`
1. **Gunakan `<script type="module" src="...">` atau `<script src="..." defer>` untuk hampir semua skrip aplikasi Anda:**
   - Berkas diunduh secara paralel di latar belakang tanpa menghentikan pembentukan DOM.
   - Eksekusi baru dijalankan setelah seluruh dokumen HTML selesai diurai (tepat sebelum event `DOMContentLoaded`), dan **urutan eksekusinya dijamin sesuai urutan penulisan tag di HTML**.
2. **Gunakan `async` hanya untuk skrip pihak ketiga yang benar-benar mandiri:**
   - Contoh: skrip analitik ringan yang tidak bergantung pada skrip lain dan tidak perlu menunggu DOM selesai. Jika Anda memiliki `a.js` dan `b.js` dengan atribut `async`, berkas mana pun yang selesai diunduh lebih dulu akan langsung dijalankan lebih dulu!

## 2. Pemuatan Malas (`loading="lazy"`) dan Prioritas (`fetchpriority`)

### Aturan Emas `loading="lazy"` pada `<img>` dan `<iframe>`
Atribut `loading="lazy"` (status **Baseline Widely Available**) memerintahkan peramban untuk **menunda pengunduhan gambar atau iframe yang berada jauh di bawah layar (*below the fold*)** sampai pengguna mulai menggulir mendekati elemen tersebut.

Namun, perhatikan satu jebakan yang sangat sering merusak skor **LCP**:

> **🚫 Jangan Pernah Memasang `loading="lazy"` pada Gambar di Layar Pertama (*Above the Fold*)!**
> Jika gambar sampul utama (*hero image*) di bagian paling atas halaman diberi `loading="lazy"`, peramban akan menahan pengunduhannya sampai tata letak selesai dihitung. Akibatnya, gambar utama justru muncul terlambat!
>
> Sebaliknya, untuk **satu gambar utama terpenting di layar pertama (elemen LCP)**, biarkan pemuatannya *eager* (bawaan) dan tambahkan atribut **`fetchpriority="high"`**:

```html
<!-- 1. Gambar Utama di Layar Pertama (Hero / LCP):
        JANGAN pakai loading="lazy", dan beri fetchpriority="high" -->
<img
  src="/assets/sampul-kelas-utama.avif"
  alt="Ilustrasi arsitektur pengembangan web modern"
  width="1200"
  height="630"
  fetchpriority="high"
>

<!-- 2. Gambar-gambar di Bagian Bawah Artikel (Below the Fold):
        Gunakan loading="lazy" dan decoding="async" untuk menghemat kuota awal -->
<img
  src="/assets/diagram-bab-3.webp"
  alt="Diagram alur pembentukan pohon DOM dan CSSOM"
  width="800"
  height="450"
  loading="lazy"
  decoding="async"
>
```

## 3. Resource Hints: `preconnect`, `dns-prefetch`, `preload`, dan `modulepreload`

Terkadang peramban baru menyadari bahwa ia membutuhkan sebuah fon web (`@font-face`) atau gambar latar setelah selesai mengunduh dan membaca berkas CSS. Anda dapat memberi petunjuk lebih awal kepada peramban di dalam `<head>` menggunakan elemen `<link>`:

| Nilai `rel` | Fungsi | Kapan Digunakan? |
|---|---|---|
| `preconnect` | Melakukan resolusi DNS, jabat tangan TCP, dan negosiasi TLS lebih awal ke domain pihak ketiga. | Ketika halaman pasti akan mengambil aset penting (seperti fon atau API) dari domain lain dalam beberapa detik pertama. Batasi maksimal 2–4 domain agar tidak membebani CPU/jaringan. |
| `dns-prefetch` | Hanya melakukan resolusi DNS di latar belakang. | Cadangan ringan untuk domain pihak ketiga tambahan yang tidak terlalu kritis. |
| `preload` | Memaksa peramban segera mengunduh satu aset kritis yang dibutuhkan untuk perenderan layar pertama. | Untuk berkas fon utama (`.woff2`) atau gambar LCP yang tersembunyi di dalam CSS. **Wajib** menyertakan atribut `as="..."` (dan `crossorigin` untuk fon)! |
| `modulepreload` | Mengunduh dan mengurai modul ES (`type="module"`) lebih awal ke dalam *module map*. | Untuk mempercepat rantai impor modul JavaScript utama aplikasi. |

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Optimasi Pemuatan — Kodeloka</title>

  <!-- 1. Buka koneksi awal ke server CDN aset statis -->
  <link rel="preconnect" href="https://cdn.asadinedu.com" crossorigin>

  <!-- 2. Preload fon utama yang pasti dipakai di layar pertama (wajib ada as="font" dan crossorigin) -->
  <link
    rel="preload"
    href="/assets/fonts/plus-jakarta-sans-v8-latin.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  >

  <link rel="stylesheet" href="/assets/learning.css">
  <script type="module" src="/assets/learning.js"></script>
</head>
```

> **⚠️ Peringatan Penting tentang `preload`:**
> Jangan mem-`preload` semuanya! Jika Anda menandai 10 berkas sebagai `preload`, maka tidak ada lagi yang benar-benar menjadi prioritas dan jaringan pengguna justru macet. Selain itu, jika Anda mem-`preload` sebuah berkas tetapi berkas tersebut tidak digunakan dalam waktu beberapa detik setelah halaman dimuat, peramban akan mencetak peringatan di konsol karena Anda membuang kuota data pengguna.

## Latihan Praktik: Mengoptimalkan Halaman Artikel yang Lambat

Bayangkan sebuah halaman artikel yang saat ini memiliki masalah performa berikut:
- Memuat `<script src="app.js"></script>` di baris pertama `<head>` tanpa atribut.
- Memasang `loading="lazy"` pada semua gambar termasuk banner utama di bagian paling atas halaman.
- Tidak mencantumkan `width` dan `height` pada 5 gambar ilustrasi di dalam artikel.

Tulislah berkas `artikel-cepat.html` yang memperbaiki ketiga masalah di atas serta menambahkan `<link rel="preload">` yang benar untuk satu berkas fon `.woff2` lokal!

## Kuis Pemahaman

### Soal 1
Apa perbedaan utama antara `<script src="app.js" async>` dan `<script src="app.js" defer>`?
- A. `async` mengunduh skrip setelah halaman selesai dirender, sedangkan `defer` menghentikan pembacaan HTML.
- B. Keduanya mengunduh skrip secara paralel tanpa memblokir parser HTML, namun `async` langsung mengeksekusi skrip begitu unduhan selesai (tanpa menjamin urutan), sedangkan `defer` menunggu hingga penguraian HTML selesai dan mengeksekusi skrip secara berurutan.
- C. `defer` hanya boleh digunakan untuk skrip dari domain eksternal, sedangkan `async` untuk skrip lokal.
- D. `async` secara otomatis mengubah kode JavaScript biasa menjadi WebAssembly.

**Jawaban Benar:** B
**Penjelasan:** Baik `async` maupun `defer` mengunduh berkas di latar belakang. Namun, `async` mengeksekusi skrip secepat mungkin segera setelah unduhannya selesai (sehingga berisiko berjalan sebelum DOM siap atau mendahului skrip lain), sedangkan `defer` menjamin eksekusi dilakukan secara berurutan setelah dokumen HTML selesai diurai menjadi DOM.

### Soal 2
Manakah strategi yang paling tepat untuk menangani gambar sampul utama (*hero image*) yang tampil penuh di bagian paling atas layar pertama (*above the fold*) agar skor **Largest Contentful Paint (LCP)** optimal?
- A. Menambahkan `loading="lazy"` dan `fetchpriority="low"` pada gambar tersebut.
- B. Tidak menggunakan `loading="lazy"` pada gambar utama tersebut, mencantumkan `width` dan `height`, serta menambahkan `fetchpriority="high"`.
- C. Menyembunyikan gambar dengan `display: none` lalu menampilkannya lewat `setTimeout` setelah 2 detik.
- D. Mengubah gambar foto tersebut menjadi format BMP yang tidak terkompresi.

**Jawaban Benar:** B
**Penjelasan:** Gambar utama di layar pertama hampir selalu menjadi elemen LCP. Memberikan `loading="lazy"` justru menunda pemuatannya. Sebaliknya, membiarkan pemuatannya *eager* (bawaan) dan menambahkan `fetchpriority="high"` menginstruksikan peramban untuk memprioritaskan unduhan gambar tersebut sejak awal.

### Soal 3
Mengapa atribut `crossorigin` wajib disertakan saat Anda melakukan `<link rel="preload" href="/fonts/teks.woff2" as="font" type="font/woff2" crossorigin>`, bahkan ketika berkas fon tersebut berada di domain Anda sendiri?
- A. Karena berkas fon di dalam CSS (`@font-face`) selalu diambil menggunakan mode CORS anonim oleh peramban; tanpa atribut `crossorigin` pada `<link rel="preload">`, fon akan diunduh dua kali!
- B. Karena peramban hanya mengizinkan format `.woff2` dari server pihak ketiga.
- C. Untuk mengenkripsi berkas fon dengan kata sandi.
- D. Agar fon tersebut otomatis berubah menjadi huruf tebal.

**Jawaban Benar:** A
**Penjelasan:** Spesifikasi CSS Fonts mengharuskan pengambilan fon dilakukan dalam mode *anonymous CORS*. Jika tag `<link rel="preload" as="font">` ditulis tanpa atribut `crossorigin`, permintaan preload tidak akan cocok dengan permintaan `@font-face` di CSS, sehingga peramban membuang hasil preload dan mengunduh berkas fon yang sama untuk kedua kalinya.

## Sumber
- [Lazy loading — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading)
- [Largest Contentful Paint (LCP) — web.dev](https://web.dev/articles/lcp)
- [Interaction to Next Paint (INP) — web.dev](https://web.dev/articles/inp)
- [Cumulative Layout Shift (CLS) — web.dev](https://web.dev/articles/cls)
