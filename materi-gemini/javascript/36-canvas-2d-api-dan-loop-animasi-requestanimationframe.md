# Grafik 2D `<canvas>` Mendalam, Siklus `requestAnimationFrame`, dan Koreksi `devicePixelRatio`

- **Tingkat:** Menengah
- **Ringkasan:** Menggambar bentuk vektor, teks, gambar, dan visualisasi data interaktif di atas `<canvas>` 2D, mempertajam resolusi pada layar Retina/HiDPI menggunakan `window.devicePixelRatio`, serta menjalankan loop animasi mulus yang memperhitungkan *delta time* dengan `requestAnimationFrame()`.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `ctx.scale(dpr, dpr); requestAnimationFrame(loopAnimasi);` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Menjalankan loop animasi visual menggunakan `setInterval(fn, 16)` alih-alih `requestAnimationFrame(fn)` menyebabkan gerakan tersendat karena frame terlewat (*jank*), boros baterai saat tab tidak aktif, dan kecepatan gerakan yang berubah-ubah antara monitor 60Hz dan 120Hz.

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `ctx.scale(dpr, dpr); requestAnimationFrame(loopAnimasi);` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
function siapkanCanvasTajam(canvas, lebarCss, tinggiCss) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(lebarCss * dpr);
  canvas.height = Math.floor(tinggiCss * dpr);
  canvas.style.width = `${lebarCss}px`;
  canvas.style.height = `${tinggiCss}px`;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  return ctx;
}
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `ctx.scale(dpr, dpr); requestAnimationFrame(loopAnimasi);` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Menjalankan loop animasi visual menggunakan `setInterval(fn, 16)` alih-alih `requestAnimationFrame(fn)` menyebabkan gerakan tersendat karena frame terlewat (*jank*), boros baterai saat tab tidak aktif, dan kecepatan gerakan yang berubah-ubah antara monitor 60Hz dan 120Hz.*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Menjalankan loop animasi visual menggunakan `setInterval(fn, 16)` alih-alih `requestAnimationFrame(fn)` menyebabkan gerakan tersendat karena frame terlewat (*jank*), boros baterai saat tab tidak aktif, dan kecepatan gerakan yang berubah-ubah antara monitor 60Hz dan 120Hz.

### Soal 2
Manakah pernyataan yang paling tepat mengenai penggunaan `ctx.scale(dpr, dpr); requestAnimationFrame(loopAnimasi);` di JavaScript modern?
- A. Merupakan standar resmi ECMAScript / Web Platform API yang dirancang untuk menyelesaikan masalah secara aman, efisien, dan terukur tanpa peretasan manual
- B. Wajib dikompilasi menjadi kode PHP terlebih dahulu sebelum dijalankan di peramban
- C. Hanya dapat dipanggil dari dalam berkas stylesheet CSS
- D. Telah dihapus dari standar web modern

**Jawaban Benar:** A
**Penjelasan:** `ctx.scale(dpr, dpr); requestAnimationFrame(loopAnimasi);` adalah bagian dari spesifikasi resmi ECMAScript (TC39) atau Web Platform API (WHATWG/W3C) yang didukung oleh peramban modern.

### Soal 3
Saat mengintegrasikan fitur "Grafik 2D `<canvas>` Mendalam, Siklus `requestAnimationFrame`, dan Koreksi `devicePixelRatio`" ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
- A. Mengabaikan semua potensi eksepsi agar kode terlihat lebih pendek
- B. Memeriksa dukungan fitur bila perlu (*feature detection*), menangani skenario kegagalan secara eksplisit, dan membersihkan sumber daya saat komponen dihancurkan
- C. Menyimpan seluruh data sensitif di variabel global `window`
- D. Mematikan mode ketat (*strict mode*) pada modul ES

**Jawaban Benar:** B
**Penjelasan:** Kode JavaScript kelas produksi wajib menerapkan *defensive programming*, deteksi kapabilitas platform bila menggunakan API perangkat, dan manajemen siklus hidup sumber daya yang rapi.

## Sumber

- [Canvas API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [`Window.requestAnimationFrame()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [`Window.devicePixelRatio` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)
