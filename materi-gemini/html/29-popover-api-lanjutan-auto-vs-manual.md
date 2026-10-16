# Popover API Mendalam: `popover="auto"` vs `popover="manual"`, Event `toggle`, dan Pemicu Deklaratif

- **Tingkat:** Menengah
- **Ringkasan:** Membedakan perilaku *light dismiss* dan penutupan otomatis antar-popover pada `popover="auto"` dengan popover independen `popover="manual"` (seperti *toast notification*), serta mendengarkan event `beforetoggle` dan `toggle`.

## Mengapa Topik "Popover API Mendalam: `popover="auto"` vs `popover="manual"`, Event `toggle`, dan Pemicu Deklaratif" Penting di Lingkungan Produksi?

Dalam pengembangan web profesional, menguasai **Popover API Mendalam: `popover="auto"` vs `popover="manual"`, Event `toggle`, dan Pemicu Deklaratif** membedakan kode yang sekadar tampil di layar pengembang dari kode yang benar-benar tangguh, cepat, aman, dan dapat diakses oleh seluruh pengguna di berbagai perangkat.

Pada pelajaran ini kita membedah cara kerja **`auto`** dan **`manual`** berdasarkan spesifikasi [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/popover.html) serta dokumentasi [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API).

## 1. Konsep Inti dan Aturan Standar

Peramban modern memproses `auto` dan `manual` mengikuti aturan semantik dan keamanan yang ketat:

| Aspek | Praktik Buruk (Hindari) | Praktik Standar Modern (Gunakan) |
|---|---|---|
| **Pendekatan Markup** | Mengandalkan tebakan peramban atau skrip tambahan yang rapuh. | Mendeklarasikan `auto` dan `manual` secara eksplisit sesuai spesifikasi resmi. |
| **Aksesibilitas (a11y)** | Mengabaikan pembaca layar dan navigasi tombol `Tab`. | Memastikan nama aksesibel, peran (*role*), dan status fokus terjaga. |
| **Keamanan & Kinerja** | Membiarkan sumber daya dimuat tanpa batasan. | Menerapkan prinsip hak akses minimal dan pemuatan terukur. |

## 2. Contoh Implementasi Lengkap dan Siap Pakai

Berikut adalah pola penulisan HTML modern yang menerapkan `auto` dan `manual` secara benar:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Popover Auto dan Manual — Kodeloka</title>
  </head>
  <body>
    <main>
      <h1>Popover Auto dan Manual</h1>

      <!-- popover="auto": tertutup saat Esc atau klik di luar panel -->
      <button type="button" popovertarget="menu-profil">Menu Profil</button>
      <div id="menu-profil" popover="auto">
        <p>Panel ini tertutup otomatis saat Anda menekan Esc atau mengeklik di luar panel.</p>
      </div>

      <!-- popover="manual": hanya tertutup lewat tombol atau kode Anda -->
      <button type="button" popovertarget="info-simpan" popovertargetaction="show">Simpan</button>
      <div id="info-simpan" popover="manual" role="status">
        Perubahan tersimpan.
        <button type="button" popovertarget="info-simpan" popovertargetaction="hide">Tutup</button>
      </div>
    </main>

    <script>
      document.getElementById("menu-profil").addEventListener("toggle", (e) => {
        console.log("Status baru:", e.newState); // "open" atau "closed"
      });
    </script>
  </body>
</html>
```

> **Status dukungan (Oktober 2026):** Popover API berstatus *Baseline Newly Available* sejak Januari 2025, yaitu tersedia di Chrome, Edge, Firefox, dan Safari (desktop maupun iOS).

> **💡 Tips Praktis Produksi:**
> Selalu periksa hasil perenderan elemen dan atribut `auto` menggunakan panel **Elements** dan **Accessibility Tree** di Browser DevTools (`F12`) untuk memastikan tidak ada atribut yang salah ketik atau konflik peran semantik.

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan atribut tanpa memahami dampaknya pada perangkat seluler dan pembaca layar:**
   Pastikan setiap penggunaan `auto` diuji baik menggunakan tetikus maupun hanya dengan papan ketik (`Tab`, `Shift+Tab`, `Enter`, `Space`, dan `Esc`).
2. **Mencampuradukkan tugas struktur HTML dengan presentasi CSS:**
   Biarkan HTML menangani makna semantik `manual`, dan serahkan pengaturan visual sepenuhnya kepada stylesheet CSS.

## Latihan Praktik

Buatlah berkas `29-popover-api-lanjutan-auto-vs-manual.html` di komputer Anda:
1. Terapkan struktur dokumen HTML5 lengkap dengan `<html lang="id">` dan `<main>`.
2. Implementasikan contoh penggunaan `auto` dan `manual` sesuai skenario di atas.
3. Uji halaman tersebut menggunakan navigasi papan ketik dan periksa pohon aksesibilitasnya di DevTools.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penggunaan `auto` dalam konteks **Popover API Mendalam: `popover="auto"` vs `popover="manual"`, Event `toggle`, dan Pemicu Deklaratif** pada standar HTML modern?
- A. Hanya untuk mengubah warna teks tanpa memerlukan berkas CSS
- B. Memberikan instruksi deklaratif dan semantik yang presisi kepada peramban serta teknologi bantu terkait perilaku `auto`
- C. Menggantikan seluruh fungsi protokol HTTP di sisi server
- D. Mematikan fitur keamanan bawaan peramban

**Jawaban Benar:** B
**Penjelasan:** `auto` dirancang di dalam spesifikasi HTML agar peramban dan alat bantu (*assistive technologies*) dapat menangani fitur tersebut secara konsisten dan deklaratif.

### Soal 2
Mengapa penerapan `manual` yang sesuai spesifikasi lebih disarankan dibandingkan membuat tiruannya dengan `<div>` dan JavaScript manual?
- A. Karena `<div>` sudah dihapus dari spesifikasi HTML5
- B. Karena fitur bawaan (`manual`) ditangani langsung oleh mesin peramban dengan dukungan aksesibilitas papan ketik, kinerja tinggi, dan perilaku lintas perangkat yang terstandarisasi
- C. Karena JavaScript tidak dapat berjalan di peramban ponsel
- D. Agar ukuran gambar di halaman otomatis mengecil

**Jawaban Benar:** B
**Penjelasan:** Mengikuti prinsip *Rule of Least Power*, memanfaatkan fitur asli HTML mengurangi beban kode JavaScript sekaligus menjamin kompatibilitas dengan pembaca layar dan perangkat seluler.

### Soal 3
Bagaimana cara memverifikasi bahwa implementasi `auto` dan `manual` pada halaman Anda sudah bekerja dengan benar bagi seluruh pengguna?
- A. Cukup melihat tampilannya sekilas di satu ukuran layar desktop
- B. Menginspeksi elemen di DevTools (termasuk panel Network/Accessibility Tree) serta menguji interaksinya menggunakan navigasi papan ketik
- C. Menghapus tag `<!DOCTYPE html>`
- D. Mengubah ekstensi berkas menjadi `.txt`

**Jawaban Benar:** B
**Penjelasan:** Pengujian menyeluruh mencakup pemeriksaan DOM/Accessibility Tree di DevTools serta pengujian navigasi papan ketik untuk memastikan aksesibilitas dan keandalan.

## Sumber
- [Popover API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- [`popover` HTML global attribute — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover)
- [Popover API — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/popover.html)
