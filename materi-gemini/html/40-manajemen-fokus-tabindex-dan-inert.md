# Manajemen Fokus Papan Ketik, Urutan `Tab`, `autofocus`, dan Penguncian Latar dengan `inert`

- **Tingkat:** Menengah
- **Ringkasan:** Merancang alur navigasi papan ketik yang logis, menggunakan `tabindex="-1"` untuk pemindahan fokus terprogram pada pesan galat/modal, serta menonaktifkan elemen latar belakang dengan atribut global `inert`.

## Mengapa Topik "Manajemen Fokus Papan Ketik, Urutan `Tab`, `autofocus`, dan Penguncian Latar dengan `inert`" Penting di Lingkungan Produksi?

Dalam pengembangan web profesional, menguasai **Manajemen Fokus Papan Ketik, Urutan `Tab`, `autofocus`, dan Penguncian Latar dengan `inert`** membedakan kode yang sekadar tampil di layar pengembang dari kode yang benar-benar tangguh, cepat, aman, dan dapat diakses oleh seluruh pengguna di berbagai perangkat.

Pada pelajaran ini kita membedah cara kerja **`inert`** dan **`tabindex`** berdasarkan spesifikasi [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/interaction.html) serta dokumentasi [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert).

## 1. Konsep Inti dan Aturan Standar

Peramban modern memproses `inert` dan `tabindex` mengikuti aturan semantik dan keamanan yang ketat:

| Aspek | Praktik Buruk (Hindari) | Praktik Standar Modern (Gunakan) |
|---|---|---|
| **Pendekatan Markup** | Mengandalkan tebakan peramban atau skrip tambahan yang rapuh. | Mendeklarasikan `inert` dan `tabindex` secara eksplisit sesuai spesifikasi resmi. |
| **Aksesibilitas (a11y)** | Mengabaikan pembaca layar dan navigasi tombol `Tab`. | Memastikan nama aksesibel, peran (*role*), dan status fokus terjaga. |
| **Keamanan & Kinerja** | Membiarkan sumber daya dimuat tanpa batasan. | Menerapkan prinsip hak akses minimal dan pemuatan terukur. |

## 2. Contoh Implementasi Lengkap dan Siap Pakai

Berikut adalah pola penulisan HTML modern yang menerapkan `inert` dan `tabindex` secara benar:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manajemen Fokus dan inert — Kodeloka</title>
  </head>
  <body>
    <!-- Seluruh halaman dibungkus agar dapat dikunci sekaligus -->
    <div id="halaman">
      <a href="#utama">Lompat ke konten utama</a>
      <header><p>Kodeloka</p></header>
      <main id="utama">
        <h1>Pengaturan</h1>
        <button type="button" id="buka-panel">Buka panel bantuan</button>
      </main>
    </div>

    <!-- Panel berada di luar #halaman sehingga tidak ikut dikunci -->
    <div id="panel" role="dialog" aria-modal="true" aria-labelledby="judul-panel" hidden>
      <h2 id="judul-panel">Bantuan</h2>
      <p>Latar belakang tidak dapat diklik atau difokuskan selama panel terbuka.</p>
      <button type="button" id="tutup-panel">Tutup</button>
    </div>

    <script>
      const halaman = document.getElementById("halaman");
      const panel = document.getElementById("panel");
      const buka = document.getElementById("buka-panel");
      const tutup = document.getElementById("tutup-panel");

      buka.addEventListener("click", () => {
        panel.hidden = false;
        halaman.inert = true;      // latar belakang tidak bisa difokuskan atau diklik
        tutup.focus();             // pindahkan fokus ke dalam panel
      });

      tutup.addEventListener("click", () => {
        halaman.inert = false;
        panel.hidden = true;
        buka.focus();              // kembalikan fokus ke pemicu
      });
    </script>
  </body>
</html>
```

> **Status dukungan (Oktober 2026):** `inert` berstatus *Baseline Widely Available* sejak Oktober 2025. Jika panel Anda berupa dialog modal, lebih sederhana memakai `<dialog>` dengan `showModal()` yang sudah membuat halaman di belakangnya inert.

> **💡 Tips Praktis Produksi:**
> Selalu periksa hasil perenderan elemen dan atribut `inert` menggunakan panel **Elements** dan **Accessibility Tree** di Browser DevTools (`F12`) untuk memastikan tidak ada atribut yang salah ketik atau konflik peran semantik.

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan atribut tanpa memahami dampaknya pada perangkat seluler dan pembaca layar:**
   Pastikan setiap penggunaan `inert` diuji baik menggunakan tetikus maupun hanya dengan papan ketik (`Tab`, `Shift+Tab`, `Enter`, `Space`, dan `Esc`).
2. **Mencampuradukkan tugas struktur HTML dengan presentasi CSS:**
   Biarkan HTML menangani makna semantik `tabindex`, dan serahkan pengaturan visual sepenuhnya kepada stylesheet CSS.

## Latihan Praktik

Buatlah berkas `40-manajemen-fokus-tabindex-dan-inert.html` di komputer Anda:
1. Terapkan struktur dokumen HTML5 lengkap dengan `<html lang="id">` dan `<main>`.
2. Implementasikan contoh penggunaan `inert` dan `tabindex` sesuai skenario di atas.
3. Uji halaman tersebut menggunakan navigasi papan ketik dan periksa pohon aksesibilitasnya di DevTools.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penggunaan `inert` dalam konteks **Manajemen Fokus Papan Ketik, Urutan `Tab`, `autofocus`, dan Penguncian Latar dengan `inert`** pada standar HTML modern?
- A. Hanya untuk mengubah warna teks tanpa memerlukan berkas CSS
- B. Memberikan instruksi deklaratif dan semantik yang presisi kepada peramban serta teknologi bantu terkait perilaku `inert`
- C. Menggantikan seluruh fungsi protokol HTTP di sisi server
- D. Mematikan fitur keamanan bawaan peramban

**Jawaban Benar:** B
**Penjelasan:** `inert` dirancang di dalam spesifikasi HTML agar peramban dan alat bantu (*assistive technologies*) dapat menangani fitur tersebut secara konsisten dan deklaratif.

### Soal 2
Mengapa penerapan `tabindex` yang sesuai spesifikasi lebih disarankan dibandingkan membuat tiruannya dengan `<div>` dan JavaScript manual?
- A. Karena `<div>` sudah dihapus dari spesifikasi HTML5
- B. Karena fitur bawaan (`tabindex`) ditangani langsung oleh mesin peramban dengan dukungan aksesibilitas papan ketik, kinerja tinggi, dan perilaku lintas perangkat yang terstandarisasi
- C. Karena JavaScript tidak dapat berjalan di peramban ponsel
- D. Agar ukuran gambar di halaman otomatis mengecil

**Jawaban Benar:** B
**Penjelasan:** Mengikuti prinsip *Rule of Least Power*, memanfaatkan fitur asli HTML mengurangi beban kode JavaScript sekaligus menjamin kompatibilitas dengan pembaca layar dan perangkat seluler.

### Soal 3
Bagaimana cara memverifikasi bahwa implementasi `inert` dan `tabindex` pada halaman Anda sudah bekerja dengan benar bagi seluruh pengguna?
- A. Cukup melihat tampilannya sekilas di satu ukuran layar desktop
- B. Menginspeksi elemen di DevTools (termasuk panel Network/Accessibility Tree) serta menguji interaksinya menggunakan navigasi papan ketik
- C. Menghapus tag `<!DOCTYPE html>`
- D. Mengubah ekstensi berkas menjadi `.txt`

**Jawaban Benar:** B
**Penjelasan:** Pengujian menyeluruh mencakup pemeriksaan DOM/Accessibility Tree di DevTools serta pengujian navigasi papan ketik untuk memastikan aksesibilitas dan keandalan.

## Sumber
- [`inert` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert)
- [`tabindex` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex)
- [`autofocus` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus)
- [User interaction — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/interaction.html)
