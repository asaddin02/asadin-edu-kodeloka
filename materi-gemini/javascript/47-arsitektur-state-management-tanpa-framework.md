# Arsitektur State Management & Komponen Reaktif Tanpa Framework (Vanilla JS)

- **Tingkat:** Lanjut
- **Ringkasan:** Merancang arsitektur aplikasi sisi klien yang terukur menggunakan aliran data satu arah (*Unidirectional Data Flow*: `State -> View -> Action`), pola *Store* terpusat yang mudah diuji, *Signal/Observable* ringan, serta pembaruan DOM yang terfokus.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `store.subscribe((stateBaru) => render(stateBaru));` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Menyimpan kebenaran data (*state*) secara tersebar di dalam atribut DOM atau variabel global yang dimodifikasi dari puluhan *event listener* berbeda membuat alur aplikasi mustahil dilacak saat terjadi bug.

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `store.subscribe((stateBaru) => render(stateBaru));` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
export function buatStore(reducer, stateAwal) {
  let state = stateAwal;
  const pendengar = new Set();

  return {
    ambilState: () => state,
    kirimAksi(aksi) {
      state = reducer(state, aksi);
      for (const fn of pendengar) fn(state);
    },
    langganan(fn) {
      pendengar.add(fn);
      return () => pendengar.delete(fn); // Fungsi berhenti langganan (unsubscribe)
    }
  };
}
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `store.subscribe((stateBaru) => render(stateBaru));` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Menyimpan kebenaran data (*state*) secara tersebar di dalam atribut DOM atau variabel global yang dimodifikasi dari puluhan *event listener* berbeda membuat alur aplikasi mustahil dilacak saat terjadi bug.*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Menyimpan kebenaran data (*state*) secara tersebar di dalam atribut DOM atau variabel global yang dimodifikasi dari puluhan *event listener* berbeda membuat alur aplikasi mustahil dilacak saat terjadi bug.

### Soal 2
Pada arsitektur aliran data satu arah (*Unidirectional Data Flow*) dengan pola *Store* seperti `buatStore(reducer, stateAwal)`, bagaimana urutan alur pembaruan yang benar?
- A. Peristiwa dari pengguna memicu `kirimAksi(aksi)`; *reducer* menghitung state baru dari state lama dan aksi tersebut; seluruh pelanggan dipanggil dengan state baru lalu merender ulang tampilan.
- B. Peristiwa dari pengguna langsung mengubah elemen DOM, lalu DOM dibaca ulang sebagai sumber kebenaran state.
- C. *Reducer* mengubah objek state lama secara langsung, lalu memanggil `location.reload()` agar tampilan menyegarkan diri.
- D. Tampilan dan state saling memperbarui satu sama lain secara dua arah tanpa perantara aksi.

**Jawaban Benar:** A
**Penjelasan:** Aliran data satu arah berarti state hanya berubah lewat aksi yang diproses *reducer*, kemudian tampilan dirender ulang dari state baru. Inilah yang dilakukan `kirimAksi()` pada contoh: `state = reducer(state, aksi)` lalu setiap fungsi di `pendengar` dipanggil.

### Soal 3
Saat mengintegrasikan fitur `Arsitektur State Management & Komponen Reaktif Tanpa Framework (Vanilla JS)` ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
- A. Mengabaikan semua potensi eksepsi agar kode terlihat lebih pendek
- B. Memeriksa dukungan fitur bila perlu (*feature detection*), menangani skenario kegagalan secara eksplisit, dan membersihkan sumber daya saat komponen dihancurkan
- C. Menyimpan seluruh data sensitif di variabel global `window`
- D. Mematikan mode ketat (*strict mode*) pada modul ES

**Jawaban Benar:** B
**Penjelasan:** Kode JavaScript kelas produksi wajib menerapkan *defensive programming*, deteksi kapabilitas platform bila menggunakan API perangkat, dan manajemen siklus hidup sumber daya yang rapi.

## Sumber

- [`EventTarget` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)
- [`Set` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
