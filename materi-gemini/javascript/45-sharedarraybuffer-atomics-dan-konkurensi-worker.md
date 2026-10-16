# Memori Bersama antar-Worker: `SharedArrayBuffer`, `Atomics`, dan Isolasi Lintas-Asal (`COOP`/`COEP`)

- **Tingkat:** Lanjut
- **Ringkasan:** Berbagi blok memori biner yang sama antara *Main Thread* dan *Web Workers* tanpa biaya penyalinan data menggunakan **`SharedArrayBuffer`**, mencegah kondisi balapan (*race condition*) dengan operasi atomik **`Atomics.add()` / `Atomics.wait()`**, serta syarat keamanan header `Cross-Origin-Opener-Policy` dan `Cross-Origin-Embedder-Policy`.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `Atomics.add(tampilanInt32Bersama, indeks, 1);` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** `SharedArrayBuffer` dinonaktifkan oleh seluruh peramban secara bawaan demi mencegah serangan kanal samping CPU (*Spectre*), dan hanya aktif apabila dokumen disajikan dengan header HTTP `Cross-Origin-Opener-Policy: same-origin` dan `Cross-Origin-Embedder-Policy: require-corp` (`window.crossOriginIsolated === true`).

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `Atomics.add(tampilanInt32Bersama, indeks, 1);` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
if (window.crossOriginIsolated) {
  const memoriBersama = new SharedArrayBuffer(4); // 4 byte (1 buah Int32)
  const penghitung = new Int32Array(memoriBersama);

  // Operasi penambahan yang dijamin aman dari race condition antar-thread
  Atomics.add(penghitung, 0, 1);
  console.log("Nilai saat ini:", Atomics.load(penghitung, 0));
}
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `Atomics.add(tampilanInt32Bersama, indeks, 1);` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *`SharedArrayBuffer` dinonaktifkan oleh seluruh peramban secara bawaan demi mencegah serangan kanal samping CPU (*Spectre*), dan hanya aktif apabila dokumen disajikan dengan header HTTP `Cross-Origin-Opener-Policy: same-origin` dan `Cross-Origin-Embedder-Policy: require-corp` (`window.crossOriginIsolated === true`).*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** `SharedArrayBuffer` dinonaktifkan oleh seluruh peramban secara bawaan demi mencegah serangan kanal samping CPU (*Spectre*), dan hanya aktif apabila dokumen disajikan dengan header HTTP `Cross-Origin-Opener-Policy: same-origin` dan `Cross-Origin-Embedder-Policy: require-corp` (`window.crossOriginIsolated === true`).

### Soal 2
Manakah pernyataan yang paling tepat mengenai penggunaan `Atomics.add(tampilanInt32Bersama, indeks, 1);` di JavaScript modern?
- A. Merupakan standar resmi ECMAScript / Web Platform API yang dirancang untuk menyelesaikan masalah secara aman, efisien, dan terukur tanpa peretasan manual
- B. Wajib dikompilasi menjadi kode PHP terlebih dahulu sebelum dijalankan di peramban
- C. Hanya dapat dipanggil dari dalam berkas stylesheet CSS
- D. Telah dihapus dari standar web modern

**Jawaban Benar:** A
**Penjelasan:** `Atomics.add(tampilanInt32Bersama, indeks, 1);` adalah bagian dari spesifikasi resmi ECMAScript (TC39) atau Web Platform API (WHATWG/W3C) yang didukung oleh peramban modern.

### Soal 3
Saat mengintegrasikan fitur `Memori Bersama antar-Worker` ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
- A. Mengabaikan semua potensi eksepsi agar kode terlihat lebih pendek
- B. Memeriksa dukungan fitur bila perlu (*feature detection*), menangani skenario kegagalan secara eksplisit, dan membersihkan sumber daya saat komponen dihancurkan
- C. Menyimpan seluruh data sensitif di variabel global `window`
- D. Mematikan mode ketat (*strict mode*) pada modul ES

**Jawaban Benar:** B
**Penjelasan:** Kode JavaScript kelas produksi wajib menerapkan *defensive programming*, deteksi kapabilitas platform bila menggunakan API perangkat, dan manajemen siklus hidup sumber daya yang rapi.

## Sumber

- [`SharedArrayBuffer` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
- [`Atomics` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics)
- [`crossOriginIsolated` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/crossOriginIsolated)
- [TC39 ECMAScript® Language Specification](https://tc39.es/ecma262/)
