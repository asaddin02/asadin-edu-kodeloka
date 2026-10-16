# Keamanan Lanjutan: Pencegahan Prototype Pollution, Sanitasi HTML, dan Trusted Types API

- **Tingkat:** Lanjut
- **Ringkasan:** Membedah celah keamanan **Prototype Pollution** saat menggabungkan objek JSON dari pengguna (`__proto__`, `constructor.prototype`), mempertahankan aplikasi menggunakan `Object.create(null)` dan `Object.hasOwn()`, serta mengunci DOM sink berbahaya dengan **Trusted Types API**.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `const kamusAman = Object.create(null); if (Object.hasOwn(input, kunci)) ...` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Fungsi penggabung objek rekursif (*deep merge*) yang tidak memfilter kunci `__proto__`, `prototype`, dan `constructor` memungkinkan penyerang menyuntikkan properti ke `Object.prototype` sehingga meracuni seluruh objek di aplikasi Anda!

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `const kamusAman = Object.create(null); if (Object.hasOwn(input, kunci)) ...` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
const KUNCI_TERLARANG = new Set(["__proto__", "prototype", "constructor"]);

export function gabungObjekAman(target, sumber) {
  for (const kunci of Object.keys(sumber)) {
    if (KUNCI_TERLARANG.has(kunci)) continue;
    const nilai = sumber[kunci];
    if (nilai && typeof nilai === "object" && !Array.isArray(nilai)) {
      target[kunci] = gabungObjekAman(target[kunci] ?? Object.create(null), nilai);
    } else {
      target[kunci] = nilai;
    }
  }
  return target;
}
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `const kamusAman = Object.create(null); if (Object.hasOwn(input, kunci)) ...` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Fungsi penggabung objek rekursif (*deep merge*) yang tidak memfilter kunci `__proto__`, `prototype`, dan `constructor` memungkinkan penyerang menyuntikkan properti ke `Object.prototype` sehingga meracuni seluruh objek di aplikasi Anda!*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Fungsi penggabung objek rekursif (*deep merge*) yang tidak memfilter kunci `__proto__`, `prototype`, dan `constructor` memungkinkan penyerang menyuntikkan properti ke `Object.prototype` sehingga meracuni seluruh objek di aplikasi Anda!

### Soal 2
Manakah pernyataan yang paling tepat mengenai penggunaan `const kamusAman = Object.create(null); if (Object.hasOwn(input, kunci)) ...` di JavaScript modern?
- A. Merupakan standar resmi ECMAScript / Web Platform API yang dirancang untuk menyelesaikan masalah secara aman, efisien, dan terukur tanpa peretasan manual
- B. Wajib dikompilasi menjadi kode PHP terlebih dahulu sebelum dijalankan di peramban
- C. Hanya dapat dipanggil dari dalam berkas stylesheet CSS
- D. Telah dihapus dari standar web modern

**Jawaban Benar:** A
**Penjelasan:** `const kamusAman = Object.create(null); if (Object.hasOwn(input, kunci)) ...` adalah bagian dari spesifikasi resmi ECMAScript (TC39) atau Web Platform API (WHATWG/W3C) yang didukung oleh peramban modern.

### Soal 3
Saat mengintegrasikan fitur `Keamanan Lanjutan` ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
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
