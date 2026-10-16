# Pengendalian Media (`HTMLMediaElement`) dan Pemrosesan Suara dengan Web Audio API

- **Tingkat:** Menengah
- **Ringkasan:** Mengendalikan pemutaran `<audio>` dan `<video>` secara programatis, memahami kebijakan pemblokiran *Autoplay* peramban, mengintegrasikan kontrol layar kunci dengan **Media Session API (`navigator.mediaSession`)**, serta menyusun grafik audio dengan **Web Audio API (`AudioContext`)**.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `const ctxAudio = new AudioContext();` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Membuat dan membunyikan `new AudioContext()` tepat saat halaman baru dimuat tanpa menunggu interaksi pengguna (`click`/`keydown`) akan diblokir oleh kebijakan Autoplay peramban dan membuat konteks audio tertahan dalam status `'suspended'`.

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `const ctxAudio = new AudioContext();` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
function bunyikanNadaNotifikasi(frekuensiHz = 880, durasiDetik = 0.15) {
  const ctx = new AudioContext();
  const osilator = ctx.createOscillator();
  const penguat = ctx.createGain();

  osilator.type = "sine";
  osilator.frequency.setValueAtTime(frekuensiHz, ctx.currentTime);
  penguat.gain.setValueAtTime(0.15, ctx.currentTime);
  penguat.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durasiDetik);

  osilator.connect(penguat).connect(ctx.destination);
  osilator.start();
  osilator.stop(ctx.currentTime + durasiDetik);
  // Tutup konteks setelah nada selesai agar sumber daya audio dilepas dan konteks tidak menumpuk
  osilator.onended = () => ctx.close();
}
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `const ctxAudio = new AudioContext();` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Membuat dan membunyikan `new AudioContext()` tepat saat halaman baru dimuat tanpa menunggu interaksi pengguna (`click`/`keydown`) akan diblokir oleh kebijakan Autoplay peramban dan membuat konteks audio tertahan dalam status `'suspended'`.*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Membuat dan membunyikan `new AudioContext()` tepat saat halaman baru dimuat tanpa menunggu interaksi pengguna (`click`/`keydown`) akan diblokir oleh kebijakan Autoplay peramban dan membuat konteks audio tertahan dalam status `'suspended'`.

### Soal 2
Manakah pernyataan yang paling tepat mengenai penggunaan `const ctxAudio = new AudioContext();` di JavaScript modern?
- A. Merupakan standar resmi ECMAScript / Web Platform API yang dirancang untuk menyelesaikan masalah secara aman, efisien, dan terukur tanpa peretasan manual
- B. Wajib dikompilasi menjadi kode PHP terlebih dahulu sebelum dijalankan di peramban
- C. Hanya dapat dipanggil dari dalam berkas stylesheet CSS
- D. Telah dihapus dari standar web modern

**Jawaban Benar:** A
**Penjelasan:** `const ctxAudio = new AudioContext();` adalah bagian dari spesifikasi resmi ECMAScript (TC39) atau Web Platform API (WHATWG/W3C) yang didukung oleh peramban modern.

### Soal 3
Saat mengintegrasikan fitur "Pengendalian Media (`HTMLMediaElement`) dan Pemrosesan Suara dengan Web Audio API" ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
- A. Mengabaikan semua potensi eksepsi agar kode terlihat lebih pendek
- B. Memeriksa dukungan fitur bila perlu (*feature detection*), menangani skenario kegagalan secara eksplisit, dan membersihkan sumber daya saat komponen dihancurkan
- C. Menyimpan seluruh data sensitif di variabel global `window`
- D. Mematikan mode ketat (*strict mode*) pada modul ES

**Jawaban Benar:** B
**Penjelasan:** Kode JavaScript kelas produksi wajib menerapkan *defensive programming*, deteksi kapabilitas platform bila menggunakan API perangkat, dan manajemen siklus hidup sumber daya yang rapi.

## Sumber

- [Web Audio API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [`HTMLMediaElement` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)
- [Autoplay guide for media and Web Audio APIs — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)
