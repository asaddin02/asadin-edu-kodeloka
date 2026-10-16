# Rekayasa Aksesibilitas di JavaScript: Fokus Terkelola, Roving `tabindex`, dan `aria-live`

- **Tingkat:** Lanjut
- **Ringkasan:** Mengimplementasikan pola interaksi papan ketik standar **WAI-ARIA Authoring Practices (APG)** menggunakan JavaScript: mengelola *Roving `tabindex`* pada kelompok tab/menu, mengembalikan fokus saat dialog ditutup, serta mengumumkan status asinkron ke pembaca layar via `aria-live`.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `itemAktif.tabIndex = 0; itemAktif.focus();` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Membiarkan pengguna menekan tombol `Tab` berkali-kali untuk melewati 20 tombol di dalam satu bilah alat (*toolbar*) atau daftar tab melanggar ergonomi aksesibilitas; gunakan pola *Roving `tabindex`* (satu `tabindex='0'` untuk masuk ke kelompok, lalu tombol panah `ArrowRight`/`ArrowLeft` untuk berpindah di dalamnya).

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `itemAktif.tabIndex = 0; itemAktif.focus();` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
function pasangRovingTabindex(daftarTombol) {
  daftarTombol.forEach((btn, idx) => {
    btn.tabIndex = idx === 0 ? 0 : -1;
    btn.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const arah = e.key === "ArrowRight" ? 1 : -1;
      const idxBaru = (idx + arah + daftarTombol.length) % daftarTombol.length;
      daftarTombol[idx].tabIndex = -1;
      daftarTombol[idxBaru].tabIndex = 0;
      daftarTombol[idxBaru].focus();
    });
  });
}
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `itemAktif.tabIndex = 0; itemAktif.focus();` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Membiarkan pengguna menekan tombol `Tab` berkali-kali untuk melewati 20 tombol di dalam satu bilah alat (*toolbar*) atau daftar tab melanggar ergonomi aksesibilitas; gunakan pola *Roving `tabindex`* (satu `tabindex='0'` untuk masuk ke kelompok, lalu tombol panah `ArrowRight`/`ArrowLeft` untuk berpindah di dalamnya).*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Membiarkan pengguna menekan tombol `Tab` berkali-kali untuk melewati 20 tombol di dalam satu bilah alat (*toolbar*) atau daftar tab melanggar ergonomi aksesibilitas; gunakan pola *Roving `tabindex`* (satu `tabindex='0'` untuk masuk ke kelompok, lalu tombol panah `ArrowRight`/`ArrowLeft` untuk berpindah di dalamnya).

### Soal 2
Manakah pernyataan yang paling tepat mengenai penggunaan `itemAktif.tabIndex = 0; itemAktif.focus();` di JavaScript modern?
- A. Merupakan standar resmi ECMAScript / Web Platform API yang dirancang untuk menyelesaikan masalah secara aman, efisien, dan terukur tanpa peretasan manual
- B. Wajib dikompilasi menjadi kode PHP terlebih dahulu sebelum dijalankan di peramban
- C. Hanya dapat dipanggil dari dalam berkas stylesheet CSS
- D. Telah dihapus dari standar web modern

**Jawaban Benar:** A
**Penjelasan:** `itemAktif.tabIndex = 0; itemAktif.focus();` adalah bagian dari spesifikasi resmi ECMAScript (TC39) atau Web Platform API (WHATWG/W3C) yang didukung oleh peramban modern.

### Soal 3
Saat mengintegrasikan fitur `Rekayasa Aksesibilitas di JavaScript` ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
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
