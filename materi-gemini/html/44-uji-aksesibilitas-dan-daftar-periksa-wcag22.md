# Pengujian Aksesibilitas Praktis dan Daftar Periksa Kepatuhan WCAG 2.2 Level AA

- **Tingkat:** Lanjut
- **Ringkasan:** Melakukan pengujian aksesibilitas mandiri menggunakan papan ketik, pembaca layar, pemeriksa kontras DevTools, serta memverifikasi pemenuhan kriteria baru WCAG 2.2 (Focus Not Obscured, Target Size Minimum, Accessible Authentication).

## Mengapa Topik "Pengujian Aksesibilitas Praktis dan Daftar Periksa Kepatuhan WCAG 2.2 Level AA" Penting di Lingkungan Produksi?

Dalam pengembangan web profesional, menguasai **Pengujian Aksesibilitas Praktis dan Daftar Periksa Kepatuhan WCAG 2.2 Level AA** membedakan kode yang sekadar tampil di layar pengembang dari kode yang benar-benar tangguh, cepat, aman, dan dapat diakses oleh seluruh pengguna di berbagai perangkat.

Pada pelajaran ini kita membedah cara kerja **`WCAG 2.2`** dan **`Level AA`** berdasarkan [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) dari W3C serta panduan [Easy Checks dari W3C WAI](https://www.w3.org/WAI/test-evaluate/preliminary/).

## 1. Konsep Inti dan Aturan Standar

Peramban modern memproses `WCAG 2.2` dan `Level AA` mengikuti aturan semantik dan keamanan yang ketat:

| Aspek | Praktik Buruk (Hindari) | Praktik Standar Modern (Gunakan) |
|---|---|---|
| **Pendekatan Markup** | Mengandalkan tebakan peramban atau skrip tambahan yang rapuh. | Mendeklarasikan `WCAG 2.2` dan `Level AA` secara eksplisit sesuai spesifikasi resmi. |
| **Aksesibilitas (a11y)** | Mengabaikan pembaca layar dan navigasi tombol `Tab`. | Memastikan nama aksesibel, peran (*role*), dan status fokus terjaga. |
| **Keamanan & Kinerja** | Membiarkan sumber daya dimuat tanpa batasan. | Menerapkan prinsip hak akses minimal dan pemuatan terukur. |

## 2. Contoh Implementasi Lengkap dan Siap Pakai

Berikut adalah pola penulisan HTML modern yang menerapkan `WCAG 2.2` dan `Level AA` secara benar:

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

> **💡 Tips Praktis Produksi:**
> Selalu periksa hasil perenderan elemen dan atribut `WCAG 2.2` menggunakan panel **Elements** dan **Accessibility Tree** di Browser DevTools (`F12`) untuk memastikan tidak ada atribut yang salah ketik atau konflik peran semantik.

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan atribut tanpa memahami dampaknya pada perangkat seluler dan pembaca layar:**
   Pastikan setiap penggunaan `WCAG 2.2` diuji baik menggunakan tetikus maupun hanya dengan papan ketik (`Tab`, `Shift+Tab`, `Enter`, `Space`, dan `Esc`).
2. **Mencampuradukkan tugas struktur HTML dengan presentasi CSS:**
   Biarkan HTML menangani makna semantik `Level AA`, dan serahkan pengaturan visual sepenuhnya kepada stylesheet CSS.

## Latihan Praktik

Buatlah berkas `44-uji-aksesibilitas-dan-daftar-periksa-wcag22.html` di komputer Anda:
1. Terapkan struktur dokumen HTML5 lengkap dengan `<html lang="id">` dan `<main>`.
2. Implementasikan contoh penggunaan `WCAG 2.2` dan `Level AA` sesuai skenario di atas.
3. Uji halaman tersebut menggunakan navigasi papan ketik dan periksa pohon aksesibilitasnya di DevTools.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penggunaan `WCAG 2.2` dalam konteks **Pengujian Aksesibilitas Praktis dan Daftar Periksa Kepatuhan WCAG 2.2 Level AA** pada standar HTML modern?
- A. Hanya untuk mengubah warna teks tanpa memerlukan berkas CSS
- B. Memberikan instruksi deklaratif dan semantik yang presisi kepada peramban serta teknologi bantu terkait perilaku `WCAG 2.2`
- C. Menggantikan seluruh fungsi protokol HTTP di sisi server
- D. Mematikan fitur keamanan bawaan peramban

**Jawaban Benar:** B
**Penjelasan:** `WCAG 2.2` dirancang di dalam spesifikasi HTML agar peramban dan alat bantu (*assistive technologies*) dapat menangani fitur tersebut secara konsisten dan deklaratif.

### Soal 2
Mengapa penerapan `Level AA` yang sesuai spesifikasi lebih disarankan dibandingkan membuat tiruannya dengan `<div>` dan JavaScript manual?
- A. Karena `<div>` sudah dihapus dari spesifikasi HTML5
- B. Karena fitur bawaan (`Level AA`) ditangani langsung oleh mesin peramban dengan dukungan aksesibilitas papan ketik, kinerja tinggi, dan perilaku lintas perangkat yang terstandarisasi
- C. Karena JavaScript tidak dapat berjalan di peramban ponsel
- D. Agar ukuran gambar di halaman otomatis mengecil

**Jawaban Benar:** B
**Penjelasan:** Mengikuti prinsip *Rule of Least Power*, memanfaatkan fitur asli HTML mengurangi beban kode JavaScript sekaligus menjamin kompatibilitas dengan pembaca layar dan perangkat seluler.

### Soal 3
Bagaimana cara memverifikasi bahwa implementasi `WCAG 2.2` dan `Level AA` pada halaman Anda sudah bekerja dengan benar bagi seluruh pengguna?
- A. Cukup melihat tampilannya sekilas di satu ukuran layar desktop
- B. Menginspeksi elemen di DevTools (termasuk panel Network/Accessibility Tree) serta menguji interaksinya menggunakan navigasi papan ketik
- C. Menghapus tag `<!DOCTYPE html>`
- D. Mengubah ekstensi berkas menjadi `.txt`

**Jawaban Benar:** B
**Penjelasan:** Pengujian menyeluruh mencakup pemeriksaan DOM/Accessibility Tree di DevTools serta pengujian navigasi papan ketik untuk memastikan aksesibilitas dan keandalan.

## Sumber
- [Web Content Accessibility Guidelines (WCAG) 2.2 — W3C](https://www.w3.org/TR/WCAG22/)
- [What's New in WCAG 2.2 — W3C WAI](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [Easy Checks: A First Review of Web Accessibility — W3C WAI](https://www.w3.org/WAI/test-evaluate/preliminary/)
- [Learn Accessibility — web.dev](https://web.dev/learn/accessibility)
