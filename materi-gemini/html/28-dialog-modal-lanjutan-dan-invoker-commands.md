# Pola `<dialog>` Lanjutan: `returnValue`, Event `cancel`/`close`, `closedby`, dan Invoker Commands

- **Tingkat:** Menengah
- **Ringkasan:** Menguasai siklus hidup penuh elemen `<dialog>`, menangkap nilai kembalian tombol melalui `dialog.returnValue`, mengendalikan penutupan klik-luar dengan atribut `closedby`, serta membuka dialog tanpa JS dengan `commandfor` dan `command`.

## Mengapa Topik "Pola `<dialog>` Lanjutan: `returnValue`, Event `cancel`/`close`, `closedby`, dan Invoker Commands" Penting di Lingkungan Produksi?

Dalam pengembangan web profesional, menguasai **Pola `<dialog>` Lanjutan: `returnValue`, Event `cancel`/`close`, `closedby`, dan Invoker Commands** membedakan kode yang sekadar tampil di layar pengembang dari kode yang benar-benar tangguh, cepat, aman, dan dapat diakses oleh seluruh pengguna di berbagai perangkat.

Pada pelajaran ini kita membedah cara kerja **`closedby`** dan **`commandfor`** berdasarkan spesifikasi [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/interactive-elements.html) serta dokumentasi [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog).

## 1. Konsep Inti dan Aturan Standar

Peramban modern memproses `closedby` dan `commandfor` mengikuti aturan semantik dan keamanan yang ketat:

| Aspek | Praktik Buruk (Hindari) | Praktik Standar Modern (Gunakan) |
|---|---|---|
| **Pendekatan Markup** | Mengandalkan tebakan peramban atau skrip tambahan yang rapuh. | Mendeklarasikan `closedby` dan `commandfor` secara eksplisit sesuai spesifikasi resmi. |
| **Aksesibilitas (a11y)** | Mengabaikan pembaca layar dan navigasi tombol `Tab`. | Memastikan nama aksesibel, peran (*role*), dan status fokus terjaga. |
| **Keamanan & Kinerja** | Membiarkan sumber daya dimuat tanpa batasan. | Menerapkan prinsip hak akses minimal dan pemuatan terukur. |

## 2. Contoh Implementasi Lengkap dan Siap Pakai

Berikut adalah pola penulisan HTML modern yang menerapkan `closedby` dan `commandfor` secara benar:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dialog Konfirmasi Lanjutan — Kodeloka</title>
  </head>
  <body>
    <main>
      <h1>Dialog Konfirmasi Lanjutan</h1>

      <!-- Invoker Commands: membuka dialog modal tanpa JavaScript -->
      <button type="button" command="show-modal" commandfor="dialog-hapus">Hapus Proyek</button>

      <!-- closedby="any": Esc dan klik di luar dialog menutupnya (light dismiss) -->
      <dialog id="dialog-hapus" closedby="any" aria-labelledby="judul-dialog">
        <h2 id="judul-dialog">Hapus proyek ini?</h2>
        <p>Tindakan ini tidak dapat dibatalkan.</p>
        <form method="dialog">
          <button value="batal" autofocus>Batal</button>
          <button value="hapus">Ya, hapus</button>
        </form>
      </dialog>

      <output id="hasil"></output>
    </main>

    <script>
      const dialog = document.getElementById("dialog-hapus");
      const hasil = document.getElementById("hasil");

      // Dipicu sebelum dialog tertutup lewat Esc atau klik di luar dialog
      dialog.addEventListener("cancel", () => {
        hasil.textContent = "Penghapusan dibatalkan lewat Esc atau klik di luar.";
      });

      // Dipicu setelah dialog tertutup; returnValue berisi value tombol yang ditekan
      dialog.addEventListener("close", () => {
        if (dialog.returnValue === "hapus") {
          hasil.textContent = "Proyek dihapus.";
        }
      });
    </script>
  </body>
</html>
```

> **Status dukungan (Oktober 2026):** `command` dan `commandfor` berstatus *Baseline Newly Available* sejak Desember 2025. Atribut `closedby` belum berstatus Baseline: didukung Chrome/Edge 134+ dan Firefox 141+, tetapi belum di Safari. Sediakan tombol "Batal" yang jelas di dalam dialog agar pengguna Safari tetap dapat menutupnya.

> **💡 Tips Praktis Produksi:**
> Selalu periksa hasil perenderan elemen dan atribut `closedby` menggunakan panel **Elements** dan **Accessibility Tree** di Browser DevTools (`F12`) untuk memastikan tidak ada atribut yang salah ketik atau konflik peran semantik.

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan atribut tanpa memahami dampaknya pada perangkat seluler dan pembaca layar:**
   Pastikan setiap penggunaan `closedby` diuji baik menggunakan tetikus maupun hanya dengan papan ketik (`Tab`, `Shift+Tab`, `Enter`, `Space`, dan `Esc`).
2. **Mencampuradukkan tugas struktur HTML dengan presentasi CSS:**
   Biarkan HTML menangani makna semantik `commandfor`, dan serahkan pengaturan visual sepenuhnya kepada stylesheet CSS.

## Latihan Praktik

Buatlah berkas `28-dialog-modal-lanjutan-dan-invoker-commands.html` di komputer Anda:
1. Terapkan struktur dokumen HTML5 lengkap dengan `<html lang="id">` dan `<main>`.
2. Implementasikan contoh penggunaan `closedby` dan `commandfor` sesuai skenario di atas.
3. Uji halaman tersebut menggunakan navigasi papan ketik dan periksa pohon aksesibilitasnya di DevTools.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penggunaan `closedby` dalam konteks **Pola `<dialog>` Lanjutan: `returnValue`, Event `cancel`/`close`, `closedby`, dan Invoker Commands** pada standar HTML modern?
- A. Hanya untuk mengubah warna teks tanpa memerlukan berkas CSS
- B. Memberikan instruksi deklaratif dan semantik yang presisi kepada peramban serta teknologi bantu terkait perilaku `closedby`
- C. Menggantikan seluruh fungsi protokol HTTP di sisi server
- D. Mematikan fitur keamanan bawaan peramban

**Jawaban Benar:** B
**Penjelasan:** `closedby` dirancang di dalam spesifikasi HTML agar peramban dan alat bantu (*assistive technologies*) dapat menangani fitur tersebut secara konsisten dan deklaratif.

### Soal 2
Mengapa penerapan `commandfor` yang sesuai spesifikasi lebih disarankan dibandingkan membuat tiruannya dengan `<div>` dan JavaScript manual?
- A. Karena `<div>` sudah dihapus dari spesifikasi HTML5
- B. Karena fitur bawaan (`commandfor`) ditangani langsung oleh mesin peramban dengan dukungan aksesibilitas papan ketik, kinerja tinggi, dan perilaku lintas perangkat yang terstandarisasi
- C. Karena JavaScript tidak dapat berjalan di peramban ponsel
- D. Agar ukuran gambar di halaman otomatis mengecil

**Jawaban Benar:** B
**Penjelasan:** Mengikuti prinsip *Rule of Least Power*, memanfaatkan fitur asli HTML mengurangi beban kode JavaScript sekaligus menjamin kompatibilitas dengan pembaca layar dan perangkat seluler.

### Soal 3
Bagaimana cara memverifikasi bahwa implementasi `closedby` dan `commandfor` pada halaman Anda sudah bekerja dengan benar bagi seluruh pengguna?
- A. Cukup melihat tampilannya sekilas di satu ukuran layar desktop
- B. Menginspeksi elemen di DevTools (termasuk panel Network/Accessibility Tree) serta menguji interaksinya menggunakan navigasi papan ketik
- C. Menghapus tag `<!DOCTYPE html>`
- D. Mengubah ekstensi berkas menjadi `.txt`

**Jawaban Benar:** B
**Penjelasan:** Pengujian menyeluruh mencakup pemeriksaan DOM/Accessibility Tree di DevTools serta pengujian navigasi papan ketik untuk memastikan aksesibilitas dan keandalan.

## Sumber
- [`<dialog>` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
- [`HTMLDialogElement.returnValue` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/returnValue)
- [Invoker Commands API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API)
- [Interactive elements — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/interactive-elements.html)
