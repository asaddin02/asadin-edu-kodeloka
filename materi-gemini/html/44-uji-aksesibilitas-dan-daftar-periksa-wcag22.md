# Pengujian Aksesibilitas Praktis dan Daftar Periksa Kepatuhan WCAG 2.2 Level AA

- **Tingkat:** Lanjut
- **Ringkasan:** Melakukan pengujian aksesibilitas mandiri menggunakan papan ketik, pembaca layar, pemeriksa kontras DevTools, serta memverifikasi pemenuhan kriteria baru WCAG 2.2 (Focus Not Obscured, Target Size Minimum, Accessible Authentication).

## Mengapa Pemindai Otomatis Hanya Menemukan Sekitar 30–40% Masalah Aksesibilitas?

Alat audit otomatis seperti Lighthouse atau axe DevTools sangat berguna untuk mendeteksi kesalahan mekanis—misalnya elemen `<img>` yang lupa diberi `alt`, kontras teks di bawah `4.5:1`, atau `<input>` tanpa `<label>`. Namun, pemindai otomatis **tidak tahu** apakah teks `alt=" gambar123.jpg "` bermakna bagi manusia, apakah urutan fokus `Tab` melompat-lompat, atau apakah bilah navigasi `position: sticky` menutupi tombol yang sedang difokuskan!

Oleh karena itu, memastikan kepatuhan terhadap standar internasional **[Web Content Accessibility Guidelines (WCAG) 2.2 Level AA](https://www.w3.org/TR/WCAG22/)** menuntut kombinasi pemeriksaan otomatis dan pengujian manual yang terstruktur.

## 1. Empat Kriteria Baru Terpenting di WCAG 2.2 Level A & AA

Rekomendasi W3C WCAG 2.2 menambahkan sembilan kriteria sukses baru di atas WCAG 2.1. Berikut adalah kriteria baru Level A dan AA yang paling berdampak langsung pada penulisan HTML dan CSS sehari-hari:

| Kriteria Sukses WCAG 2.2 | Tingkat | Masalah yang Dicegah & Solusi Teknis di HTML/CSS |
|---|---|---|
| **2.4.11 Focus Not Obscured (Minimum)** | **AA** | Ketika pengguna menekan `Tab`, elemen yang sedang menerima fokus **tidak boleh tertutup seluruhnya** oleh header/footer `position: sticky`, spanduk cookie, atau panel mengambang. **Solusi:** Tambahkan `scroll-padding-top` dan `scroll-padding-bottom` pada `html` sebesar tinggi bilah sticky! |
| **2.5.8 Target Size (Minimum)** | **AA** | Ukuran area klik/sentuh target interaktif (tombol, ikon tautan) wajib minimal **24 × 24 piksel CSS** (kecuali ada jarak ruang kosong yang setara di sekelilingnya, atau tautan berada di dalam kalimat paragraf). |
| **3.3.8 Accessible Authentication (Minimum)** | **AA** | Halaman masuk (*login*) tidak boleh memaksa pengguna melakukan tes fungsi kognitif (seperti menghafal kata sandi atau menyalin ulang karakter secara manual). **Solusi:** Jangan pernah memblokir aksi tempel (*paste* `Ctrl+V`) pada kolom kata sandi/OTP, dan selalu pasang `autocomplete="username"` serta `autocomplete="current-password"` agar pengelola kata sandi (*password manager*) bekerja! |
| **2.5.7 Dragging Movements** | **AA** | Setiap aksi yang mengandalkan gerakan menyeret (*drag-and-drop* atau penggeser khusus) wajib menyediakan alternatif klik/ketuk tunggal (misalnya tombol "Pindah ke Atas/Bawah" atau input angka pendamping). |
| **3.2.6 Consistent Help** & **3.3.7 Redundant Entry** | **A** | Tautan bantuan harus berada di urutan lokasi yang konsisten antar-halaman, dan formulir multi-langkah tidak boleh meminta pengguna mengetik ulang data yang sudah mereka masukkan di langkah sebelumnya. |

## 2. Implementasi Halaman Masuk yang Memenuhi Standar WCAG 2.2 Level AA

Berikut adalah contoh halaman yang menerapkan pencegahan fokus tertutup header sticky (**2.4.11**), indikator fokus jelas (**2.4.7**), ukuran target minimum 24×24 piksel (**2.5.8**), dan autentikasi aksesibel (**3.3.8**):

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contoh Halaman Siap Uji WCAG 2.2 — Kodeloka</title>
    <style>
      /* 2.4.11 Focus Not Obscured (Minimum): header sticky tidak boleh menutupi elemen yang difokuskan */
      html { scroll-padding-top: 5rem; }
      header { position: sticky; top: 0; block-size: 4rem; background: #ffffff; }

      /* 2.4.7 Focus Visible: indikator fokus yang jelas */
      :focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }

      /* 2.5.8 Target Size (Minimum): target interaktif minimal 24x24 piksel CSS */
      button, input, select, .tombol { min-block-size: 24px; min-inline-size: 24px; }
    </style>
  </head>
  <body>
    <a href="#utama">Lompat ke konten utama</a>
    <header><p>Kodeloka</p></header>

    <main id="utama">
      <h1>Masuk</h1>
      <form action="/masuk" method="post">
        <p>
          <label for="surel">Surel</label><br>
          <input type="email" id="surel" name="surel" autocomplete="username" required>
        </p>
        <p>
          <!-- 3.3.8 Accessible Authentication (Minimum): izinkan password manager dan tempel (paste) -->
          <label for="sandi">Kata sandi</label><br>
          <input type="password" id="sandi" name="sandi" autocomplete="current-password" required>
        </p>
        <button type="submit">Masuk</button>
      </form>
    </main>
  </body>
</html>
```

## 3. Daftar Periksa Audit Aksesibilitas Mandiri 5 Menit Sebelum Rilis

Sebelum menayangkan halaman apa pun ke lingkungan produksi, jalankan lima langkah pemeriksaan praktis berdasarkan panduan [W3C Easy Checks](https://www.w3.org/WAI/test-evaluate/preliminary/) berikut:
1. **Uji Tanpa Tetikus (*Keyboard-Only Test*):** Lepaskan tangan dari tetikus. Tekan `Tab` dari awal hingga akhir halaman:
   - Apakah tautan *"Lompat ke konten utama"* muncul pada tekanan `Tab` pertama?
   - Apakah cincin fokus (`:focus-visible`) selalu terlihat jelas dan tidak pernah tertutup oleh header `sticky` saat halaman digulir mundur dengan `Shift + Tab`?
   - Apakah semua dialog/popover dapat dibuka dengan `Enter`/`Space` dan ditutup dengan `Esc`?
2. **Uji Perbesaran Layar 200% & 400% (*WCAG 1.4.4 & 1.4.10 Reflow*):** Tekan `Ctrl` + `+` hingga tingkat zoom mencapai **200%** dan **400%** pada lebar layar `1280px` (setara lebar `320px`). Pastikan tidak ada teks yang terpotong (`overflow: hidden`) dan tidak muncul pengguliran dua arah (vertikal dan horizontal sekaligus).
3. **Inspeksi *Heading* dan *Landmark*:** Pastikan hanya ada satu `<h1>` utama, tingkat heading tidak melompat dari `<h2>` langsung ke `<h4>`, serta seluruh konten berada di dalam *landmark* (`<header>`, `<nav>`, `<main>`, `<footer>`).
4. **Inspeksi Kontras Warna & Mode Warna Paksa:** Gunakan pemilih elemen di DevTools untuk memastikan kontras teks normal **≥ 4.5:1**, teks besar **≥ 3:1**, dan komponen antarmuka/ikon **≥ 3:1**.

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Memasang `onpaste="return false"` pada kolom Kata Sandi atau Konfirmasi Surel:** Mematikan fitur tempel (*paste*) sangat menyulitkan pengguna yang memakai aplikasi pengelola kata sandi (*password manager*) dan **melanggar langsung WCAG 2.2 Kriteria 3.3.8 (Accessible Authentication)**.
2. **Membuat header `position: sticky` tanpa `scroll-padding-top` pada `html`:** Saat pengguna menekan `Shift + Tab` untuk kembali ke tombol di bagian atas, elemen yang baru difokuskan akan bergulir tepat ke koordinat `top: 0`—bersembunyi persis di belakang header `sticky` Anda dan melanggar **WCAG 2.4.11**!
3. **Menghapus `outline: none` tanpa pengganti `:focus-visible`:** Menghilangkan garis fokus bawaan peramban membuat pengguna papan ketik buta terhadap posisi kursor mereka di layar (melanggar **WCAG 2.4.7 Focus Visible**).

## Latihan Praktik

Buatlah berkas `44-uji-aksesibilitas-dan-daftar-periksa-wcag22.html` dan lakukan audit perbaikan:
1. Buat sebuah halaman dengan `<header>` yang memiliki `position: sticky; top: 0; height: 4rem;`, lalu tambahkan `scroll-padding-top: 5rem` pada elemen `html` agar fokus tidak pernah tertutup header.
2. Buat deretan tombol paginasi dan tombol ikon yang masing-masing dijamin memiliki ukuran minimal `24px × 24px` (atau lebih nyaman `44px × 44px`).
3. Buat formulir autentikasi yang mematuhi WCAG 3.3.8 (`autocomplete="username"` dan `autocomplete="current-password"`), lalu uji seluruh halaman hanya dengan tombol `Tab`, `Shift+Tab`, dan `Enter`.

## Kuis Pemahaman

### Soal 1
Masalah aksesibilitas apakah yang dicegah oleh kriteria sukses baru **WCAG 2.2 — 2.4.11 Focus Not Obscured (Minimum)**, dan properti CSS apa yang membantu mengatasinya pada halaman dengan navigasi atas `position: sticky`?
- A. Mencegah gambar tampak buram di layar Retina menggunakan `image-rendering`
- B. Memastikan elemen yang sedang menerima fokus papan ketik tidak tertutup seluruhnya oleh elemen mengambang seperti header `sticky`; dapat diatasi dengan menetapkan `scroll-padding-top` pada `html` sebesar tinggi header `sticky`
- C. Mencegah pengguna membuka konsol DevTools menggunakan `user-select: none`
- D. Memastikan semua paragraf menggunakan perataan tengah `text-align: center`

**Jawaban Benar:** B
**Penjelasan:** Kriteria 2.4.11 menetapkan bahwa saat sebuah komponen antarmuka menerima fokus papan ketik, komponen tersebut tidak boleh tertutup seluruhnya oleh konten yang dibuat penulis (seperti bilah `sticky` atau spanduk cookie).

### Soal 2
Mengapa memblokir aksi tempel (`e.preventDefault()` pada event `paste`) di kolom `<input type="password">` melanggar standar **WCAG 2.2 Level AA (Kriteria 3.3.8 Accessible Authentication)**?
- A. Karena event `paste` sudah dihapus dari spesifikasi DOM
- B. Karena memblokir fitur tempel menghalangi penggunaan pengelola kata sandi (*password manager*) dan memaksa pengguna melakukan tes fungsi kognitif (menghafal atau menyalin karakter rumit satu per satu)
- C. Karena kata sandi yang ditempel tidak dapat dikirim melalui metode `POST`
- D. Karena aksi tempel mengubah tipe input menjadi `type="text"`

**Jawaban Benar:** B
**Penjelasan:** WCAG 3.3.8 melarang tes fungsi kognitif dalam proses autentikasi kecuali tersedia mekanisme pembantu; mengizinkan fitur *paste* dan pengisian otomatis (`autocomplete="current-password"`) adalah syarat utama agar pengguna dapat memakai pengelola kata sandi.

### Soal 3
Berapakah ukuran minimum area target klik/sentuh untuk komponen interaktif menurut kriteria **WCAG 2.2 Level AA — 2.5.8 Target Size (Minimum)** (di luar pengecualian jarak spasi atau tautan di dalam kalimat)?
- A. `8 × 8` piksel CSS
- B. `12 × 12` piksel CSS
- C. `24 × 24` piksel CSS (sedangkan `44 × 44` piksel CSS adalah tingkat AAA pada 2.5.5)
- D. `100 × 100` piksel CSS

**Jawaban Benar:** C
**Penjelasan:** Kriteria 2.5.8 Target Size (Minimum) pada WCAG 2.2 Level AA menetapkan ukuran target minimal 24×24 piksel CSS agar pengguna dengan keterbatasan motorik tidak salah menekan tombol yang berdekatan.

## Sumber
- [Web Content Accessibility Guidelines (WCAG) 2.2 — W3C](https://www.w3.org/TR/WCAG22/)
- [What's New in WCAG 2.2 — W3C WAI](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [Easy Checks: A First Review of Web Accessibility — W3C WAI](https://www.w3.org/WAI/test-evaluate/preliminary/)
- [Learn Accessibility — web.dev](https://web.dev/learn/accessibility)
