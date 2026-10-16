# Pola Markup Aksesibel: Jejak Halaman (*Breadcrumbs*), Paginasi, dan Komponen Tab

- **Tingkat:** Menengah
- **Ringkasan:** Menulis struktur HTML semantik dan atribut ARIA standar untuk tiga komponen navigasi paling umum di aplikasi web: *Breadcrumbs*, *Pagination*, dan *Tab Interface* (`role="tablist"`, `tab`, `tabpanel`).

## Mengapa Topik "Pola Markup Aksesibel: Jejak Halaman (*Breadcrumbs*), Paginasi, dan Komponen Tab" Penting di Lingkungan Produksi?

Dalam pengembangan web profesional, menguasai **Pola Markup Aksesibel: Jejak Halaman (*Breadcrumbs*), Paginasi, dan Komponen Tab** membedakan kode yang sekadar tampil di layar pengembang dari kode yang benar-benar tangguh, cepat, aman, dan dapat diakses oleh seluruh pengguna di berbagai perangkat.

Pada pelajaran ini kita membedah cara kerja **`breadcrumb`** dan **`tablist`** berdasarkan [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) dari W3C serta dokumentasi [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current).

## 1. Konsep Inti dan Aturan Standar

Peramban modern memproses `breadcrumb` dan `tablist` mengikuti aturan semantik dan keamanan yang ketat:

| Aspek | Praktik Buruk (Hindari) | Praktik Standar Modern (Gunakan) |
|---|---|---|
| **Pendekatan Markup** | Mengandalkan tebakan peramban atau skrip tambahan yang rapuh. | Mendeklarasikan `breadcrumb` dan `tablist` secara eksplisit sesuai spesifikasi resmi. |
| **Aksesibilitas (a11y)** | Mengabaikan pembaca layar dan navigasi tombol `Tab`. | Memastikan nama aksesibel, peran (*role*), dan status fokus terjaga. |
| **Keamanan & Kinerja** | Membiarkan sumber daya dimuat tanpa batasan. | Menerapkan prinsip hak akses minimal dan pemuatan terukur. |

## 2. Contoh Implementasi Lengkap dan Siap Pakai

Berikut adalah pola penulisan HTML modern yang menerapkan `breadcrumb` dan `tablist` secara benar:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pola Navigasi Aksesibel — Kodeloka</title>
  </head>
  <body>
    <main>
      <h1>Pola Navigasi Aksesibel</h1>

      <nav aria-label="Jejak halaman">
        <ol>
          <li><a href="/">Beranda</a></li>
          <li><a href="/html/">HTML</a></li>
          <li><a href="/html/materi/" aria-current="page">Materi</a></li>
        </ol>
      </nav>

      <nav aria-label="Paginasi">
        <ul>
          <li><a href="?hal=1" rel="prev">Sebelumnya</a></li>
          <li><a href="?hal=1">1</a></li>
          <li><a href="?hal=2" aria-current="page">2</a></li>
          <li><a href="?hal=3">3</a></li>
          <li><a href="?hal=3" rel="next">Berikutnya</a></li>
        </ul>
      </nav>

      <div role="tablist" aria-label="Contoh kode">
        <button type="button" role="tab" id="tab-html" aria-selected="true" aria-controls="panel-html">HTML</button>
        <button type="button" role="tab" id="tab-css" aria-selected="false" aria-controls="panel-css" tabindex="-1">CSS</button>
      </div>
      <div role="tabpanel" id="panel-html" aria-labelledby="tab-html" tabindex="0">
        <p>Isi panel HTML.</p>
      </div>
      <div role="tabpanel" id="panel-css" aria-labelledby="tab-css" tabindex="0" hidden>
        <p>Isi panel CSS.</p>
      </div>
    </main>

    <script>
      // Pola tab dari APG: panah kiri/kanan memindahkan pilihan, hanya tab aktif yang masuk urutan Tab
      const tabs = [...document.querySelectorAll('[role="tab"]')];

      function pilih(tab) {
        for (const t of tabs) {
          const aktif = t === tab;
          t.setAttribute("aria-selected", String(aktif));
          t.tabIndex = aktif ? 0 : -1;
          document.getElementById(t.getAttribute("aria-controls")).hidden = !aktif;
        }
        tab.focus();
      }

      for (const [i, tab] of tabs.entries()) {
        tab.addEventListener("click", () => pilih(tab));
        tab.addEventListener("keydown", (e) => {
          if (e.key === "ArrowRight") pilih(tabs[(i + 1) % tabs.length]);
          if (e.key === "ArrowLeft") pilih(tabs[(i - 1 + tabs.length) % tabs.length]);
        });
      }
    </script>
  </body>
</html>
```

> **💡 Tips Praktis Produksi:**
> Selalu periksa hasil perenderan elemen dan atribut `breadcrumb` menggunakan panel **Elements** dan **Accessibility Tree** di Browser DevTools (`F12`) untuk memastikan tidak ada atribut yang salah ketik atau konflik peran semantik.

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan atribut tanpa memahami dampaknya pada perangkat seluler dan pembaca layar:**
   Pastikan setiap penggunaan `breadcrumb` diuji baik menggunakan tetikus maupun hanya dengan papan ketik (`Tab`, `Shift+Tab`, `Enter`, `Space`, dan `Esc`).
2. **Mencampuradukkan tugas struktur HTML dengan presentasi CSS:**
   Biarkan HTML menangani makna semantik `tablist`, dan serahkan pengaturan visual sepenuhnya kepada stylesheet CSS.

## Latihan Praktik

Buatlah berkas `41-pola-navigasi-aksesibel-breadcrumb-pagination-tabs.html` di komputer Anda:
1. Terapkan struktur dokumen HTML5 lengkap dengan `<html lang="id">` dan `<main>`.
2. Implementasikan contoh penggunaan `breadcrumb` dan `tablist` sesuai skenario di atas.
3. Uji halaman tersebut menggunakan navigasi papan ketik dan periksa pohon aksesibilitasnya di DevTools.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penggunaan `breadcrumb` dalam konteks **Pola Markup Aksesibel: Jejak Halaman (*Breadcrumbs*), Paginasi, dan Komponen Tab** pada standar HTML modern?
- A. Hanya untuk mengubah warna teks tanpa memerlukan berkas CSS
- B. Memberikan instruksi deklaratif dan semantik yang presisi kepada peramban serta teknologi bantu terkait perilaku `breadcrumb`
- C. Menggantikan seluruh fungsi protokol HTTP di sisi server
- D. Mematikan fitur keamanan bawaan peramban

**Jawaban Benar:** B
**Penjelasan:** `breadcrumb` dirancang di dalam spesifikasi HTML agar peramban dan alat bantu (*assistive technologies*) dapat menangani fitur tersebut secara konsisten dan deklaratif.

### Soal 2
Mengapa penerapan `tablist` yang sesuai spesifikasi lebih disarankan dibandingkan membuat tiruannya dengan `<div>` dan JavaScript manual?
- A. Karena `<div>` sudah dihapus dari spesifikasi HTML5
- B. Karena fitur bawaan (`tablist`) ditangani langsung oleh mesin peramban dengan dukungan aksesibilitas papan ketik, kinerja tinggi, dan perilaku lintas perangkat yang terstandarisasi
- C. Karena JavaScript tidak dapat berjalan di peramban ponsel
- D. Agar ukuran gambar di halaman otomatis mengecil

**Jawaban Benar:** B
**Penjelasan:** Mengikuti prinsip *Rule of Least Power*, memanfaatkan fitur asli HTML mengurangi beban kode JavaScript sekaligus menjamin kompatibilitas dengan pembaca layar dan perangkat seluler.

### Soal 3
Bagaimana cara memverifikasi bahwa implementasi `breadcrumb` dan `tablist` pada halaman Anda sudah bekerja dengan benar bagi seluruh pengguna?
- A. Cukup melihat tampilannya sekilas di satu ukuran layar desktop
- B. Menginspeksi elemen di DevTools (termasuk panel Network/Accessibility Tree) serta menguji interaksinya menggunakan navigasi papan ketik
- C. Menghapus tag `<!DOCTYPE html>`
- D. Mengubah ekstensi berkas menjadi `.txt`

**Jawaban Benar:** B
**Penjelasan:** Pengujian menyeluruh mencakup pemeriksaan DOM/Accessibility Tree di DevTools serta pengujian navigasi papan ketik untuk memastikan aksesibilitas dan keandalan.

## Sumber
- [Breadcrumb Pattern — ARIA Authoring Practices Guide (W3C WAI)](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)
- [Tabs Pattern — ARIA Authoring Practices Guide (W3C WAI)](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [`aria-current` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current)
- [`<nav>` dan elemen lain — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/sections.html)
