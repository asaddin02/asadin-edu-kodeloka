# Pengolahan Data Biner: `ArrayBuffer`, `Uint8Array`, `DataView`, `Blob`, dan `TextEncoder`

- **Tingkat:** Lanjut
- **Ringkasan:** Memanipulasi memori biner mentah secara langsung di JavaScript menggunakan `ArrayBuffer`, `Uint8Array`, dan `DataView` (pengaturan *endianness*), mengonversi teks UTF-8 ke byte dengan `TextEncoder`/`TextDecoder`, serta mengelola objek berkas `Blob` dan `File`.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `const bytes = new TextEncoder().encode('Kodeloka');` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Menggunakan `atob()` dan `btoa()` warisan secara langsung pada string UTF-8 yang mengandung karakter di luar Latin1 (seperti aksara non-ASCII atau emoji) akan melempar `InvalidCharacterError`; selalu konversi melalui `Uint8Array` atau `TextEncoder` terlebih dahulu.

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `const bytes = new TextEncoder().encode('Kodeloka');` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
// Mengonversi string UTF-8 ke Uint8Array dan membacanya kembali
const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8", { fatal: true });

const bufferByte = encoder.encode("Kodeloka 🚀");
console.log(bufferByte instanceof Uint8Array); // true
console.log(bufferByte.byteLength);            // 13 byte

const teksKembali = decoder.decode(bufferByte);
console.log(teksKembali);                      // "Kodeloka 🚀" 
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `const bytes = new TextEncoder().encode('Kodeloka');` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Menggunakan `atob()` dan `btoa()` warisan secara langsung pada string UTF-8 yang mengandung karakter di luar Latin1 (seperti aksara non-ASCII atau emoji) akan melempar `InvalidCharacterError`; selalu konversi melalui `Uint8Array` atau `TextEncoder` terlebih dahulu.*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Menggunakan `atob()` dan `btoa()` warisan secara langsung pada string UTF-8 yang mengandung karakter di luar Latin1 (seperti aksara non-ASCII atau emoji) akan melempar `InvalidCharacterError`; selalu konversi melalui `Uint8Array` atau `TextEncoder` terlebih dahulu.

### Soal 2
Manakah pernyataan yang paling tepat mengenai penggunaan `const bytes = new TextEncoder().encode('Kodeloka');` di JavaScript modern?
- A. Merupakan standar resmi ECMAScript / Web Platform API yang dirancang untuk menyelesaikan masalah secara aman, efisien, dan terukur tanpa peretasan manual
- B. Wajib dikompilasi menjadi kode PHP terlebih dahulu sebelum dijalankan di peramban
- C. Hanya dapat dipanggil dari dalam berkas stylesheet CSS
- D. Telah dihapus dari standar web modern

**Jawaban Benar:** A
**Penjelasan:** `const bytes = new TextEncoder().encode('Kodeloka');` adalah bagian dari spesifikasi resmi ECMAScript (TC39) atau Web Platform API (WHATWG/W3C) yang didukung oleh peramban modern.

### Soal 3
Saat mengintegrasikan fitur `Pengolahan Data Biner` ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
- A. Mengabaikan semua potensi eksepsi agar kode terlihat lebih pendek
- B. Memeriksa dukungan fitur bila perlu (*feature detection*), menangani skenario kegagalan secara eksplisit, dan membersihkan sumber daya saat komponen dihancurkan
- C. Menyimpan seluruh data sensitif di variabel global `window`
- D. Mematikan mode ketat (*strict mode*) pada modul ES

**Jawaban Benar:** B
**Penjelasan:** Kode JavaScript kelas produksi wajib menerapkan *defensive programming*, deteksi kapabilitas platform bila menggunakan API perangkat, dan manajemen siklus hidup sumber daya yang rapi.

## Sumber

- [MDN Web Docs — JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [MDN Web Docs — JavaScript Built-in Objects Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)
- [TC39 ECMAScript® Language Specification](https://tc39.es/ecma262/)
