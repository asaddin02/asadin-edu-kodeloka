# Elemen dan Atribut HTML Usang (*Deprecated/Obsolete*) beserta Pengganti Modernnya

- **Tingkat:** Dasar
- **Ringkasan:** Mengenali tag dan atribut warisan HTML4 (`<center>`, `<font>`, `<marquee>`, `<strike>`, `<frame>`, `align`, `bgcolor`, `border`) yang telah dihapus dari standar HTML5 agar tidak pernah terbawa ke kode produksi.

## Mengapa Topik "Elemen dan Atribut HTML Usang (*Deprecated/Obsolete*) beserta Pengganti Modernnya" Penting di Lingkungan Produksi?

Dalam pengembangan web profesional, menguasai **Elemen dan Atribut HTML Usang (*Deprecated/Obsolete*) beserta Pengganti Modernnya** membedakan kode yang sekadar tampil di layar pengembang dari kode yang benar-benar tangguh, cepat, aman, dan dapat diakses oleh seluruh pengguna di berbagai perangkat.

Pada pelajaran ini kita membedah cara kerja **`obsolete`** dan **`html5`** berdasarkan bagian [Obsolete features](https://html.spec.whatwg.org/multipage/obsolete.html) pada WHATWG HTML Living Standard serta dokumentasi [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements).

## 1. Konsep Inti dan Aturan Standar

Peramban modern memproses `obsolete` dan `html5` mengikuti aturan semantik dan keamanan yang ketat:

| Aspek | Praktik Buruk (Hindari) | Praktik Standar Modern (Gunakan) |
|---|---|---|
| **Pendekatan Markup** | Mengandalkan tebakan peramban atau skrip tambahan yang rapuh. | Mendeklarasikan `obsolete` dan `html5` secara eksplisit sesuai spesifikasi resmi. |
| **Aksesibilitas (a11y)** | Mengabaikan pembaca layar dan navigasi tombol `Tab`. | Memastikan nama aksesibel, peran (*role*), dan status fokus terjaga. |
| **Keamanan & Kinerja** | Membiarkan sumber daya dimuat tanpa batasan. | Menerapkan prinsip hak akses minimal dan pemuatan terukur. |

## 2. Contoh Implementasi Lengkap dan Siap Pakai

Berikut adalah pola penulisan HTML modern yang menerapkan `obsolete` dan `html5` secara benar:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mengganti Elemen Usang — Kodeloka</title>
    <style>
      .tengah { text-align: center; }
      .peringatan { color: #b91c1c; font-size: 1.25rem; }
      .kotak { background-color: #f1f5f9; border: 1px solid #94a3b8; border-collapse: collapse; }
      .kotak th, .kotak td { border: 1px solid #94a3b8; padding: 0.5rem; }
    </style>
  </head>
  <body>
    <main>
      <!-- Pengganti <center> dan <font color size>: kelas CSS -->
      <p class="tengah"><span class="peringatan">Peringatan</span></p>

      <!-- Pengganti <strike>: <s> untuk info tak berlaku, <del> untuk revisi -->
      <p><s>Rp 450.000</s> <strong>Rp 299.000</strong></p>

      <!-- Pengganti <tt>: <code> (atau <kbd>/<samp> sesuai makna) -->
      <p>Jalankan <code>npm run dev</code> di terminal.</p>

      <!-- Pengganti atribut border dan bgcolor pada tabel: CSS -->
      <table class="kotak">
        <caption>Contoh tabel</caption>
        <tr><th scope="col">Nama</th><th scope="col">Nilai</th></tr>
        <tr><td>A</td><td>10</td></tr>
      </table>
    </main>
  </body>
</html>
```

Bandingkan dengan markup usang yang **tidak boleh** Anda tulis (contoh ini hanya untuk dikenali):

```html
<center><font color="red" size="4">Peringatan</font></center>
<strike>Rp 450.000</strike>
<tt>npm run dev</tt>
<table border="1" bgcolor="#f1f5f9">...</table>
<marquee>Teks berjalan</marquee>
```

Elemen `<marquee>` tidak memiliki pengganti HTML langsung; bila animasi memang diperlukan, gunakan CSS (`@keyframes`) dan hormati `prefers-reduced-motion`.

> **💡 Tips Praktis Produksi:**
> Selalu periksa hasil perenderan elemen dan atribut `obsolete` menggunakan panel **Elements** dan **Accessibility Tree** di Browser DevTools (`F12`) untuk memastikan tidak ada atribut yang salah ketik atau konflik peran semantik.

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan atribut tanpa memahami dampaknya pada perangkat seluler dan pembaca layar:**
   Pastikan setiap penggunaan `obsolete` diuji baik menggunakan tetikus maupun hanya dengan papan ketik (`Tab`, `Shift+Tab`, `Enter`, `Space`, dan `Esc`).
2. **Mencampuradukkan tugas struktur HTML dengan presentasi CSS:**
   Biarkan HTML menangani makna semantik `html5`, dan serahkan pengaturan visual sepenuhnya kepada stylesheet CSS.

## Latihan Praktik

Buatlah berkas `43-elemen-usang-deprecated-dan-penggantinya.html` di komputer Anda:
1. Terapkan struktur dokumen HTML5 lengkap dengan `<html lang="id">` dan `<main>`.
2. Implementasikan contoh penggunaan `obsolete` dan `html5` sesuai skenario di atas.
3. Uji halaman tersebut menggunakan navigasi papan ketik dan periksa pohon aksesibilitasnya di DevTools.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penggunaan `obsolete` dalam konteks **Elemen dan Atribut HTML Usang (*Deprecated/Obsolete*) beserta Pengganti Modernnya** pada standar HTML modern?
- A. Hanya untuk mengubah warna teks tanpa memerlukan berkas CSS
- B. Memberikan instruksi deklaratif dan semantik yang presisi kepada peramban serta teknologi bantu terkait perilaku `obsolete`
- C. Menggantikan seluruh fungsi protokol HTTP di sisi server
- D. Mematikan fitur keamanan bawaan peramban

**Jawaban Benar:** B
**Penjelasan:** `obsolete` dirancang di dalam spesifikasi HTML agar peramban dan alat bantu (*assistive technologies*) dapat menangani fitur tersebut secara konsisten dan deklaratif.

### Soal 2
Mengapa penerapan `html5` yang sesuai spesifikasi lebih disarankan dibandingkan membuat tiruannya dengan `<div>` dan JavaScript manual?
- A. Karena `<div>` sudah dihapus dari spesifikasi HTML5
- B. Karena fitur bawaan (`html5`) ditangani langsung oleh mesin peramban dengan dukungan aksesibilitas papan ketik, kinerja tinggi, dan perilaku lintas perangkat yang terstandarisasi
- C. Karena JavaScript tidak dapat berjalan di peramban ponsel
- D. Agar ukuran gambar di halaman otomatis mengecil

**Jawaban Benar:** B
**Penjelasan:** Mengikuti prinsip *Rule of Least Power*, memanfaatkan fitur asli HTML mengurangi beban kode JavaScript sekaligus menjamin kompatibilitas dengan pembaca layar dan perangkat seluler.

### Soal 3
Bagaimana cara memverifikasi bahwa implementasi `obsolete` dan `html5` pada halaman Anda sudah bekerja dengan benar bagi seluruh pengguna?
- A. Cukup melihat tampilannya sekilas di satu ukuran layar desktop
- B. Menginspeksi elemen di DevTools (termasuk panel Network/Accessibility Tree) serta menguji interaksinya menggunakan navigasi papan ketik
- C. Menghapus tag `<!DOCTYPE html>`
- D. Mengubah ekstensi berkas menjadi `.txt`

**Jawaban Benar:** B
**Penjelasan:** Pengujian menyeluruh mencakup pemeriksaan DOM/Accessibility Tree di DevTools serta pengujian navigasi papan ketik untuk memastikan aksesibilitas dan keandalan.

## Sumber
- [Obsolete features — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/obsolete.html)
- [HTML elements reference — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
- [`<table>` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table)
