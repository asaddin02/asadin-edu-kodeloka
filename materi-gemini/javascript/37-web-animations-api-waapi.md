# Web Animations API (WAAPI): Mengendalikan Animasi CSS langsung dari JavaScript (`element.animate`)

- **Tingkat:** Menengah
- **Ringkasan:** Membuat, menjeda, membalik arah, mengubah kecepatan, dan menunggu penyelesaian animasi secara programatis dengan Promise menggunakan **Web Animations API (`element.animate()`, objek `Animation`, dan `animation.finished`)**.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `const anim = elemen.animate(keyframes, opsi); await anim.finished;` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Menunggu animasi selesai menggunakan `setTimeout()` dengan durasi yang dikira-kira sama dengan CSS sering meleset ketika pengguna mengaktifkan penghemat baterai atau `prefers-reduced-motion`; gunakan properti Promise `await animasi.finished` dari WAAPI.

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `const anim = elemen.animate(keyframes, opsi); await anim.finished;` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
async function hapusKartuDenganAnimasi(elemenKartu) {
  const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!kurangiGerak) {
    const animasi = elemenKartu.animate(
      [
        { opacity: 1, transform: "scale(1)" },
        { opacity: 0, transform: "scale(0.92)" }
      ],
      { duration: 200, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
    );
    await animasi.finished;
  }
  elemenKartu.remove();
}
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `const anim = elemen.animate(keyframes, opsi); await anim.finished;` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Menunggu animasi selesai menggunakan `setTimeout()` dengan durasi yang dikira-kira sama dengan CSS sering meleset ketika pengguna mengaktifkan penghemat baterai atau `prefers-reduced-motion`; gunakan properti Promise `await animasi.finished` dari WAAPI.*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Menunggu animasi selesai menggunakan `setTimeout()` dengan durasi yang dikira-kira sama dengan CSS sering meleset ketika pengguna mengaktifkan penghemat baterai atau `prefers-reduced-motion`; gunakan properti Promise `await animasi.finished` dari WAAPI.

### Soal 2
Manakah pernyataan yang paling tepat mengenai penggunaan `const anim = elemen.animate(keyframes, opsi); await anim.finished;` di JavaScript modern?
- A. Merupakan standar resmi ECMAScript / Web Platform API yang dirancang untuk menyelesaikan masalah secara aman, efisien, dan terukur tanpa peretasan manual
- B. Wajib dikompilasi menjadi kode PHP terlebih dahulu sebelum dijalankan di peramban
- C. Hanya dapat dipanggil dari dalam berkas stylesheet CSS
- D. Telah dihapus dari standar web modern

**Jawaban Benar:** A
**Penjelasan:** `const anim = elemen.animate(keyframes, opsi); await anim.finished;` adalah bagian dari spesifikasi resmi ECMAScript (TC39) atau Web Platform API (WHATWG/W3C) yang didukung oleh peramban modern.

### Soal 3
Saat mengintegrasikan fitur `Web Animations API (WAAPI)` ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
- A. Mengabaikan semua potensi eksepsi agar kode terlihat lebih pendek
- B. Memeriksa dukungan fitur bila perlu (*feature detection*), menangani skenario kegagalan secara eksplisit, dan membersihkan sumber daya saat komponen dihancurkan
- C. Menyimpan seluruh data sensitif di variabel global `window`
- D. Mematikan mode ketat (*strict mode*) pada modul ES

**Jawaban Benar:** B
**Penjelasan:** Kode JavaScript kelas produksi wajib menerapkan *defensive programming*, deteksi kapabilitas platform bila menggunakan API perangkat, dan manajemen siklus hidup sumber daya yang rapi.

## Sumber

- [Web Animations API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [`Element.animate()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate)
