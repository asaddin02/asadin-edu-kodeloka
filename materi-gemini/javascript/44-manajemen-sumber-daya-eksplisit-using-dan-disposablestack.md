# Manajemen Sumber Daya Eksplisit (ES2025/ES2026): `using`, `await using`, dan `Symbol.dispose`

- **Tingkat:** Lanjut
- **Ringkasan:** Mengotomatiskan pelepasan sumber daya (koneksi berkas, transaksi database, kunci mutex, atau *event listener* sementara) secara deterministik begitu keluar dari cakupan blok `{ ... }` menggunakan deklarasi **`using`**, **`await using`**, **`Symbol.dispose`**, dan **`DisposableStack`**.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `using kunci = akuisisiKunci(); // otomatis memanggil [Symbol.dispose]() saat keluar blok` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Bergantung pada *Garbage Collector* untuk menutup koneksi jaringan atau melepas kunci antrean tidak pernah menjamin kapan sumber daya tersebut benar-benar dibebaskan; protokol `Symbol.dispose` (atau blok `try...finally`) memastikan pelepasan terjadi seketika saat blok berakhir.

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `using kunci = akuisisiKunci(); // otomatis memanggil [Symbol.dispose]() saat keluar blok` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
class PelacakWaktuEksekusi {
  constructor(namaOperasi) {
    this.namaOperasi = namaOperasi;
    this.mulai = performance.now();
  }
  [Symbol.dispose]() {
    const durasi = (performance.now() - this.mulai).toFixed(2);
    console.log(`[Selesai] ${this.namaOperasi}: ${durasi} ms`);
  }
}

// Apabila runtime telah mendukung 'using' (atau gunakan try...finally):
function jalankanTugas() {
  const pelacak = new PelacakWaktuEksekusi("Hitung Laporan");
  try {
    for (let i = 0; i < 1e5; i++);
  } finally {
    pelacak[Symbol.dispose]();
  }
}
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `using kunci = akuisisiKunci(); // otomatis memanggil [Symbol.dispose]() saat keluar blok` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Bergantung pada *Garbage Collector* untuk menutup koneksi jaringan atau melepas kunci antrean tidak pernah menjamin kapan sumber daya tersebut benar-benar dibebaskan; protokol `Symbol.dispose` (atau blok `try...finally`) memastikan pelepasan terjadi seketika saat blok berakhir.*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Bergantung pada *Garbage Collector* untuk menutup koneksi jaringan atau melepas kunci antrean tidak pernah menjamin kapan sumber daya tersebut benar-benar dibebaskan; protokol `Symbol.dispose` (atau blok `try...finally`) memastikan pelepasan terjadi seketika saat blok berakhir.

### Soal 2
Manakah pernyataan yang paling tepat mengenai penggunaan `using kunci = akuisisiKunci(); // otomatis memanggil [Symbol.dispose]() saat keluar blok` di JavaScript modern?
- A. Merupakan standar resmi ECMAScript / Web Platform API yang dirancang untuk menyelesaikan masalah secara aman, efisien, dan terukur tanpa peretasan manual
- B. Wajib dikompilasi menjadi kode PHP terlebih dahulu sebelum dijalankan di peramban
- C. Hanya dapat dipanggil dari dalam berkas stylesheet CSS
- D. Telah dihapus dari standar web modern

**Jawaban Benar:** A
**Penjelasan:** `using kunci = akuisisiKunci(); // otomatis memanggil [Symbol.dispose]() saat keluar blok` adalah bagian dari spesifikasi resmi ECMAScript (TC39) atau Web Platform API (WHATWG/W3C) yang didukung oleh peramban modern.

### Soal 3
Saat mengintegrasikan fitur `Manajemen Sumber Daya Eksplisit (ES2025/ES2026)` ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
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
