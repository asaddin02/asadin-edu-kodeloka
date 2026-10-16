# Penjadwalan Tugas Antarmuka: `requestIdleCallback`, `queueMicrotask`, dan `scheduler.yield()`

- **Tingkat:** Lanjut
- **Ringkasan:** Memecah pekerjaan JavaScript yang panjang (*Long Tasks* > 50ms) agar tidak membekukan interaksi pengguna menggunakan **Prioritized Task Scheduling API (`scheduler.yield()`, `scheduler.postTask()`)**, `requestIdleCallback()`, dan `queueMicrotask()`.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `if ('scheduler' in globalThis && 'yield' in scheduler) await scheduler.yield();` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Menjalankan pemrosesan ribuan item array di dalam satu fungsi sinkron tanpa memberikan kesempatan kepada *main thread* untuk menggambar ulang layar (*yield to main thread*) akan membuat skor INP (*Interaction to Next Paint*) memburuk drastis.

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `if ('scheduler' in globalThis && 'yield' in scheduler) await scheduler.yield();` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
async function berikanWaktuKeMainThread() {
  if ("scheduler" in globalThis && "yield" in globalThis.scheduler) {
    return globalThis.scheduler.yield();
  }
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export async function prosesRibuanData(daftarItem, prosesSatuItem) {
  for (let i = 0; i < daftarItem.length; i++) {
    prosesSatuItem(daftarItem[i]);
    // Setiap 50 item, serahkan kendali sejenak agar peramban merespons klik/ketikan
    if (i % 50 === 0) await berikanWaktuKeMainThread();
  }
}
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `if ('scheduler' in globalThis && 'yield' in scheduler) await scheduler.yield();` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Menjalankan pemrosesan ribuan item array di dalam satu fungsi sinkron tanpa memberikan kesempatan kepada *main thread* untuk menggambar ulang layar (*yield to main thread*) akan membuat skor INP (*Interaction to Next Paint*) memburuk drastis.*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Menjalankan pemrosesan ribuan item array di dalam satu fungsi sinkron tanpa memberikan kesempatan kepada *main thread* untuk menggambar ulang layar (*yield to main thread*) akan membuat skor INP (*Interaction to Next Paint*) memburuk drastis.

### Soal 2
Manakah pernyataan yang paling tepat mengenai penggunaan `if ('scheduler' in globalThis && 'yield' in scheduler) await scheduler.yield();` di JavaScript modern?
- A. Merupakan standar resmi ECMAScript / Web Platform API yang dirancang untuk menyelesaikan masalah secara aman, efisien, dan terukur tanpa peretasan manual
- B. Wajib dikompilasi menjadi kode PHP terlebih dahulu sebelum dijalankan di peramban
- C. Hanya dapat dipanggil dari dalam berkas stylesheet CSS
- D. Telah dihapus dari standar web modern

**Jawaban Benar:** A
**Penjelasan:** `if ('scheduler' in globalThis && 'yield' in scheduler) await scheduler.yield();` adalah bagian dari spesifikasi resmi ECMAScript (TC39) atau Web Platform API (WHATWG/W3C) yang didukung oleh peramban modern.

### Soal 3
Saat mengintegrasikan fitur `Penjadwalan Tugas Antarmuka` ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
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
