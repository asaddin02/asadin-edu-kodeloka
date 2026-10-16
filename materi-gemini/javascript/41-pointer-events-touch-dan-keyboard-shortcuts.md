# Penanganan Input Terpadu: Pointer Events API (`pointerdown`), Gestur Sentuh, dan Pintasan Papan Ketik

- **Tingkat:** Menengah
- **Ringkasan:** Menyatukan penanganan input tetikus (*mouse*), sentuhan jari (*touch*), dan pena stylus (*pen*) menggunakan **Pointer Events API (`pointerdown`, `pointermove`, `setPointerCapture`)**, serta merancang pintasan papan ketik (`e.key`, `e.ctrlKey`/`e.metaKey`) yang tidak bentrok dengan input formulir.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `elemen.setPointerCapture(event.pointerId);` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Memasang pintasan papan ketik global di `window.addEventListener('keydown', ...)` untuk huruf tunggal (seperti menekan `/` atau `k`) tanpa mengecek apakah fokus sedang berada di dalam `<input>`, `<textarea>`, atau elemen `contenteditable` akan membajak ketikan pengguna.

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `elemen.setPointerCapture(event.pointerId);` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
window.addEventListener("keydown", (e) => {
  const target = e.target;
  const sedangMengetik =
    target instanceof HTMLElement &&
    (target.matches("input, textarea, select") || target.isContentEditable);

  if (!sedangMengetik && e.key === "/") {
    e.preventDefault();
    document.querySelector("#input-cari")?.focus();
  }
});
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `elemen.setPointerCapture(event.pointerId);` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Memasang pintasan papan ketik global di `window.addEventListener('keydown', ...)` untuk huruf tunggal (seperti menekan `/` atau `k`) tanpa mengecek apakah fokus sedang berada di dalam `<input>`, `<textarea>`, atau elemen `contenteditable` akan membajak ketikan pengguna.*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Memasang pintasan papan ketik global di `window.addEventListener('keydown', ...)` untuk huruf tunggal (seperti menekan `/` atau `k`) tanpa mengecek apakah fokus sedang berada di dalam `<input>`, `<textarea>`, atau elemen `contenteditable` akan membajak ketikan pengguna.

### Soal 2
Manakah pernyataan yang paling tepat mengenai penggunaan `elemen.setPointerCapture(event.pointerId);` di JavaScript modern?
- A. Merupakan standar resmi ECMAScript / Web Platform API yang dirancang untuk menyelesaikan masalah secara aman, efisien, dan terukur tanpa peretasan manual
- B. Wajib dikompilasi menjadi kode PHP terlebih dahulu sebelum dijalankan di peramban
- C. Hanya dapat dipanggil dari dalam berkas stylesheet CSS
- D. Telah dihapus dari standar web modern

**Jawaban Benar:** A
**Penjelasan:** `elemen.setPointerCapture(event.pointerId);` adalah bagian dari spesifikasi resmi ECMAScript (TC39) atau Web Platform API (WHATWG/W3C) yang didukung oleh peramban modern.

### Soal 3
Saat mengintegrasikan fitur `Penanganan Input Terpadu` ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
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
