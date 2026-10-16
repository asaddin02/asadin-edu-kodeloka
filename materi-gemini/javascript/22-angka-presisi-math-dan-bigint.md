# Angka Presisi IEEE 754, Objek `Math`, dan Bilangan Bulat Besar (`BigInt`)

- **Tingkat:** Dasar
- **Ringkasan:** Memahami representasi angka floating-point 64-bit IEEE 754 (`0.1 + 0.2 !== 0.3`), konstanta batas aman `Number.MAX_SAFE_INTEGER`, fungsi pembulatan & acak pada `Math`, serta penghitungan bilangan bulat ukuran tak terbatas dengan `BigInt` (`100n`).

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `Number.isSafeInteger(nilai) && typeof idTransaksi === 'bigint'` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Menggunakan `Number` biasa untuk menyimpan ID Snowflake 64-bit (seperti ID pesan Twitter/Discord atau ID transaksi bank > `9007199254740991`) atau menghitung saldo uang dalam pecahan desimal `float` tanpa mengonversinya ke satuan terkecil (`sen`/`rupiah` bulat) menyebabkan pembulatan diam-diam yang merusak akurasi finansial.

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `Number.isSafeInteger(nilai) && typeof idTransaksi === 'bigint'` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
// 1. Masalah presisi IEEE 754 pada pecahan desimal
console.log(0.1 + 0.2); // 0.30000000000000004
// Solusi Finansial: Simpan dalam satuan integer terkecil (Rupiah/Sen)
const hargaBarangRp = 150_000;
const ppnRp = Math.round(hargaBarangRp * 0.11); // 16500

// 2. Batas Aman Number vs BigInt untuk ID 64-bit
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991 (2^53 - 1)
const idSnowflake = 1846295839201948573n; // Literal BigInt diakhiri 'n'
console.log((idSnowflake + 1n).toString()); // Presisi terjaga 100%
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `Number.isSafeInteger(nilai) && typeof idTransaksi === 'bigint'` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Menggunakan `Number` biasa untuk menyimpan ID Snowflake 64-bit (seperti ID pesan Twitter/Discord atau ID transaksi bank > `9007199254740991`) atau menghitung saldo uang dalam pecahan desimal `float` tanpa mengonversinya ke satuan terkecil (`sen`/`rupiah` bulat) menyebabkan pembulatan diam-diam yang merusak akurasi finansial.*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Menggunakan `Number` biasa untuk menyimpan ID Snowflake 64-bit (seperti ID pesan Twitter/Discord atau ID transaksi bank > `9007199254740991`) atau menghitung saldo uang dalam pecahan desimal `float` tanpa mengonversinya ke satuan terkecil (`sen`/`rupiah` bulat) menyebabkan pembulatan diam-diam yang merusak akurasi finansial.

### Soal 2
Manakah pernyataan yang paling tepat mengenai penggunaan `Number.isSafeInteger(nilai) && typeof idTransaksi === 'bigint'` di JavaScript modern?
- A. Merupakan standar resmi ECMAScript / Web Platform API yang dirancang untuk menyelesaikan masalah secara aman, efisien, dan terukur tanpa peretasan manual
- B. Wajib dikompilasi menjadi kode PHP terlebih dahulu sebelum dijalankan di peramban
- C. Hanya dapat dipanggil dari dalam berkas stylesheet CSS
- D. Telah dihapus dari standar web modern

**Jawaban Benar:** A
**Penjelasan:** `Number.isSafeInteger(nilai) && typeof idTransaksi === 'bigint'` adalah bagian dari spesifikasi resmi ECMAScript (TC39) atau Web Platform API (WHATWG/W3C) yang didukung oleh peramban modern.

### Soal 3
Saat mengintegrasikan fitur `Angka Presisi IEEE 754, Objek `Math`, dan Bilangan Bulat Besar (`BigInt`)` ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
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
