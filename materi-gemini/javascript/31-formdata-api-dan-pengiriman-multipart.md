# Mengelola Data Formulir & Unggahan Berkas dengan `FormData` API

- **Tingkat:** Menengah
- **Ringkasan:** Mengekstrak seluruh nilai masukan formulir HTML dalam satu baris menggunakan konstruktor `new FormData(formElement)`, mengirim berkas (`multipart/form-data`) via `fetch()`, mengonversi `FormData` ke objek/URLSearchParams, serta memantau event `formdata`.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `const dataFormulir = new FormData(elemenForm, tombolSubmit);` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Saat mengirim objek `FormData` sebagai `body` di dalam `fetch()`, jangan pernah mengatur header `'Content-Type': 'multipart/form-data'` secara manual! Jika Anda menulisnya manual, peramban tidak dapat menyisipkan string pembatas (`boundary=...`) yang wajib ada sehingga server gagal mengurai isi formulir.

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `const dataFormulir = new FormData(elemenForm, tombolSubmit);` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
const form = document.querySelector("#form-profil");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Parameter kedua meneruskan tombol submit yang diklik
  const formData = new FormData(form, e.submitter);

  // JANGAN set header Content-Type secara manual untuk FormData!
  const res = await fetch("/api/profil", {
    method: "POST",
    body: formData
  });
  if (res.ok) console.log("Berhasil disimpan!");
});
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `const dataFormulir = new FormData(elemenForm, tombolSubmit);` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Saat mengirim objek `FormData` sebagai `body` di dalam `fetch()`, jangan pernah mengatur header `'Content-Type': 'multipart/form-data'` secara manual! Jika Anda menulisnya manual, peramban tidak dapat menyisipkan string pembatas (`boundary=...`) yang wajib ada sehingga server gagal mengurai isi formulir.*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Saat mengirim objek `FormData` sebagai `body` di dalam `fetch()`, jangan pernah mengatur header `'Content-Type': 'multipart/form-data'` secara manual! Jika Anda menulisnya manual, peramban tidak dapat menyisipkan string pembatas (`boundary=...`) yang wajib ada sehingga server gagal mengurai isi formulir.

### Soal 2
Manakah pernyataan yang paling tepat mengenai penggunaan `const dataFormulir = new FormData(elemenForm, tombolSubmit);` di JavaScript modern?
- A. Merupakan standar resmi ECMAScript / Web Platform API yang dirancang untuk menyelesaikan masalah secara aman, efisien, dan terukur tanpa peretasan manual
- B. Wajib dikompilasi menjadi kode PHP terlebih dahulu sebelum dijalankan di peramban
- C. Hanya dapat dipanggil dari dalam berkas stylesheet CSS
- D. Telah dihapus dari standar web modern

**Jawaban Benar:** A
**Penjelasan:** `const dataFormulir = new FormData(elemenForm, tombolSubmit);` adalah bagian dari spesifikasi resmi ECMAScript (TC39) atau Web Platform API (WHATWG/W3C) yang didukung oleh peramban modern.

### Soal 3
Saat mengintegrasikan fitur `Mengelola Data Formulir & Unggahan Berkas dengan `FormData` API` ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
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
