# Input Berkas (`type="file"`), Atribut `accept`, `multiple`, dan Kamera Seluler (`capture`)

- **Tingkat:** Menengah
- **Ringkasan:** Mengonfigurasi pemilihan berkas di formulir HTML menggunakan `<input type="file">`, membatasi ekstensi dan tipe MIME dengan `accept`, mengizinkan banyak berkas dengan `multiple`, serta mengakses kamera/mikrofon ponsel dengan `capture`.

## Mengapa Topik "Input Berkas (`type="file"`), Atribut `accept`, `multiple`, dan Kamera Seluler (`capture`)" Penting di Lingkungan Produksi?

Dalam pengembangan web profesional, menguasai **Input Berkas (`type="file"`), Atribut `accept`, `multiple`, dan Kamera Seluler (`capture`)** membedakan kode yang sekadar tampil di layar pengembang dari kode yang benar-benar tangguh, cepat, aman, dan dapat diakses oleh seluruh pengguna di berbagai perangkat.

Pada pelajaran ini kita membedah cara kerja **`accept`** dan **`capture`** berdasarkan spesifikasi [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/input.html) serta dokumentasi [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file).

## 1. Konsep Inti dan Aturan Standar

Peramban modern memproses `accept` dan `capture` mengikuti aturan semantik dan keamanan yang ketat:

| Aspek | Praktik Buruk (Hindari) | Praktik Standar Modern (Gunakan) |
|---|---|---|
| **Pendekatan Markup** | Mengandalkan tebakan peramban atau skrip tambahan yang rapuh. | Mendeklarasikan `accept` dan `capture` secara eksplisit sesuai spesifikasi resmi. |
| **Aksesibilitas (a11y)** | Mengabaikan pembaca layar dan navigasi tombol `Tab`. | Memastikan nama aksesibel, peran (*role*), dan status fokus terjaga. |
| **Keamanan & Kinerja** | Membiarkan sumber daya dimuat tanpa batasan. | Menerapkan prinsip hak akses minimal dan pemuatan terukur. |

## 2. Contoh Implementasi Lengkap dan Siap Pakai

Berikut adalah pola penulisan HTML modern yang menerapkan `accept` dan `capture` secara benar:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unggah Berkas dan Foto — Kodeloka</title>
  </head>
  <body>
    <main>
      <h1>Unggah Berkas dan Foto</h1>
      <form action="/unggah" method="post" enctype="multipart/form-data">
        <p>
          <label for="dokumen">Dokumen pendukung (PDF, PNG, atau JPEG; boleh lebih dari satu)</label><br>
          <input type="file" id="dokumen" name="dokumen" accept=".pdf,image/png,image/jpeg" multiple>
        </p>
        <p>
          <label for="foto-langsung">Foto langsung dari kamera belakang (ponsel)</label><br>
          <input type="file" id="foto-langsung" name="foto" accept="image/*" capture="environment">
        </p>
        <button type="submit">Kirim</button>
      </form>
      <p>
        <code>accept</code> dan <code>multiple</code> didukung semua peramban utama. <code>capture</code>
        hanya berpengaruh di peramban seluler (di desktop diabaikan dan pemilih berkas biasa yang tampil)
        dan belum berstatus Baseline. <code>accept</code> hanya petunjuk bagi pemilih berkas, jadi server
        tetap wajib memeriksa tipe dan ukuran berkas.
      </p>
    </main>
  </body>
</html>
```

> **💡 Tips Praktis Produksi:**
> Selalu periksa hasil perenderan elemen dan atribut `accept` menggunakan panel **Elements** dan **Accessibility Tree** di Browser DevTools (`F12`) untuk memastikan tidak ada atribut yang salah ketik atau konflik peran semantik.

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan atribut tanpa memahami dampaknya pada perangkat seluler dan pembaca layar:**
   Pastikan setiap penggunaan `accept` diuji baik menggunakan tetikus maupun hanya dengan papan ketik (`Tab`, `Shift+Tab`, `Enter`, `Space`, dan `Esc`).
2. **Mencampuradukkan tugas struktur HTML dengan presentasi CSS:**
   Biarkan HTML menangani makna semantik `capture`, dan serahkan pengaturan visual sepenuhnya kepada stylesheet CSS.

## Latihan Praktik

Buatlah berkas `27-ungahan-berkas-accept-multiple-dan-capture.html` di komputer Anda:
1. Terapkan struktur dokumen HTML5 lengkap dengan `<html lang="id">` dan `<main>`.
2. Implementasikan contoh penggunaan `accept` dan `capture` sesuai skenario di atas.
3. Uji halaman tersebut menggunakan navigasi papan ketik dan periksa pohon aksesibilitasnya di DevTools.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penggunaan `accept` dalam konteks **Input Berkas (`type="file"`), Atribut `accept`, `multiple`, dan Kamera Seluler (`capture`)** pada standar HTML modern?
- A. Hanya untuk mengubah warna teks tanpa memerlukan berkas CSS
- B. Memberikan instruksi deklaratif dan semantik yang presisi kepada peramban serta teknologi bantu terkait perilaku `accept`
- C. Menggantikan seluruh fungsi protokol HTTP di sisi server
- D. Mematikan fitur keamanan bawaan peramban

**Jawaban Benar:** B
**Penjelasan:** `accept` dirancang di dalam spesifikasi HTML agar peramban dan alat bantu (*assistive technologies*) dapat menangani fitur tersebut secara konsisten dan deklaratif.

### Soal 2
Mengapa penerapan `capture` yang sesuai spesifikasi lebih disarankan dibandingkan membuat tiruannya dengan `<div>` dan JavaScript manual?
- A. Karena `<div>` sudah dihapus dari spesifikasi HTML5
- B. Karena fitur bawaan (`capture`) ditangani langsung oleh mesin peramban dengan dukungan aksesibilitas papan ketik, kinerja tinggi, dan perilaku lintas perangkat yang terstandarisasi
- C. Karena JavaScript tidak dapat berjalan di peramban ponsel
- D. Agar ukuran gambar di halaman otomatis mengecil

**Jawaban Benar:** B
**Penjelasan:** Mengikuti prinsip *Rule of Least Power*, memanfaatkan fitur asli HTML mengurangi beban kode JavaScript sekaligus menjamin kompatibilitas dengan pembaca layar dan perangkat seluler.

### Soal 3
Bagaimana cara memverifikasi bahwa implementasi `accept` dan `capture` pada halaman Anda sudah bekerja dengan benar bagi seluruh pengguna?
- A. Cukup melihat tampilannya sekilas di satu ukuran layar desktop
- B. Menginspeksi elemen di DevTools (termasuk panel Network/Accessibility Tree) serta menguji interaksinya menggunakan navigasi papan ketik
- C. Menghapus tag `<!DOCTYPE html>`
- D. Mengubah ekstensi berkas menjadi `.txt`

**Jawaban Benar:** B
**Penjelasan:** Pengujian menyeluruh mencakup pemeriksaan DOM/Accessibility Tree di DevTools serta pengujian navigasi papan ketik untuk memastikan aksesibilitas dan keandalan.

## Sumber
- [`<input type="file">` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file)
- [`accept` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept)
- [`capture` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture)
- [Input element — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/input.html)
