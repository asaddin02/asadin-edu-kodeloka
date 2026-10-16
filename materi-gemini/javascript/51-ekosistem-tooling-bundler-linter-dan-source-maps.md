# Ekosistem Tooling Modern: Bundler (Vite/esbuild), Tree-Shaking, Code Splitting, dan Linter

- **Tingkat:** Menengah
- **Ringkasan:** Memahami cara kerja perkakas pengembangan JavaScript modern: bagaimana *bundler* (seperti Vite, Rollup, esbuild) memangkas kode mati melalui **Tree-Shaking** pada ES Modules, memecah bundel dengan **Code Splitting**, men-debug kode produksi melalui **Source Maps**, serta menjaga kualitas kode dengan Linter & Formatter.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `// package.json: "sideEffects": false membantu bundler melakukan tree-shaking` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Mengimpor seluruh isi objek pustaka besar secara utuh atau mengekspor semuanya di dalam satu objek tunggal (`export default { a, b, c }`) menghalangi *bundler* melakukan *tree-shaking* statis, sehingga kode yang tidak terpakai tetap ikut membebani unduhan pengguna.

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `// package.json: "sideEffects": false membantu bundler melakukan tree-shaking` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
// BAIK untuk Tree-Shaking: Gunakan Named Exports pada ES Module
export function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(angka);
}

export function hitungDiskon(harga, persen) {
  return harga - Math.round((harga * persen) / 100);
}
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `// package.json: "sideEffects": false membantu bundler melakukan tree-shaking` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Mengimpor seluruh isi objek pustaka besar secara utuh atau mengekspor semuanya di dalam satu objek tunggal (`export default { a, b, c }`) menghalangi *bundler* melakukan *tree-shaking* statis, sehingga kode yang tidak terpakai tetap ikut membebani unduhan pengguna.*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Mengimpor seluruh isi objek pustaka besar secara utuh atau mengekspor semuanya di dalam satu objek tunggal (`export default { a, b, c }`) menghalangi *bundler* melakukan *tree-shaking* statis, sehingga kode yang tidak terpakai tetap ikut membebani unduhan pengguna.

### Soal 2
Apa fungsi properti `"sideEffects": false` pada `package.json` di proyek yang memakai *bundler* seperti Vite, Rollup, atau webpack?
- A. Memberi tahu *bundler* bahwa modul-modul di paket tersebut tidak memiliki efek samping ketika diimpor, sehingga impor yang tidak terpakai aman dibuang saat *tree-shaking*.
- B. Mencegah Node.js menjalankan skrip `postinstall` ketika paket dipasang.
- C. Mengenkripsi kode produksi agar tidak dapat dibaca pengguna.
- D. Menonaktifkan *source map* agar kode asli tidak bocor.

**Jawaban Benar:** A
**Penjelasan:** `sideEffects` adalah konvensi yang dikenali webpack, Rollup, dan Vite (bukan bagian dari ECMAScript). Dengan `false`, bundler boleh menghapus seluruh modul yang impornya tidak dipakai. *Tree-shaking* sendiri bergantung pada sintaks `import`/`export` statis milik ES Modules.

### Soal 3
Saat mengintegrasikan fitur `Ekosistem Tooling Modern` ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
- A. Mengabaikan semua potensi eksepsi agar kode terlihat lebih pendek
- B. Memeriksa dukungan fitur bila perlu (*feature detection*), menangani skenario kegagalan secara eksplisit, dan membersihkan sumber daya saat komponen dihancurkan
- C. Menyimpan seluruh data sensitif di variabel global `window`
- D. Mematikan mode ketat (*strict mode*) pada modul ES

**Jawaban Benar:** B
**Penjelasan:** Kode JavaScript kelas produksi wajib menerapkan *defensive programming*, deteksi kapabilitas platform bila menggunakan API perangkat, dan manajemen siklus hidup sumber daya yang rapi.

## Sumber

- [Building for Production — Vite](https://vite.dev/guide/build)
- [Tree Shaking — webpack](https://webpack.js.org/guides/tree-shaking/)
- [Source maps — Chrome DevTools](https://developer.chrome.com/docs/devtools/javascript/source-maps)
