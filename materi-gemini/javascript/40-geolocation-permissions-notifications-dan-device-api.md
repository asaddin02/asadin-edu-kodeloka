# API Perangkat & Perizinan: `Geolocation`, `Permissions`, `Notification`, dan `Screen Wake Lock`

- **Tingkat:** Menengah
- **Ringkasan:** Memeriksa status izin secara sopan dengan `navigator.permissions.query()`, mengambil koordinat lokasi pengguna dengan `navigator.geolocation`, menampilkan notifikasi sistem dengan `Notification`, serta mencegah layar redup saat membaca materi dengan **Screen Wake Lock API (`navigator.wakeLock`)**.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `const wakeLock = await navigator.wakeLock.request('screen');` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Memunculkan permintaan izin `Notification.requestPermission()` atau `geolocation.getCurrentPosition()` seketika saat pengguna baru saja membuka beranda situs (tanpa konteks aksi klik tombol) hampir selalu ditolak oleh pengguna dan diblokir otomatis oleh peramban modern.

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `const wakeLock = await navigator.wakeLock.request('screen');` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
async function tahanLayarTetapMenyala() {
  if (!("wakeLock" in navigator)) return null;
  try {
    const kunciLayar = await navigator.wakeLock.request("screen");
    return kunciLayar;
  } catch (err) {
    console.warn("Wake Lock tidak dapat diaktifkan:", err.message);
    return null;
  }
}
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `const wakeLock = await navigator.wakeLock.request('screen');` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Memunculkan permintaan izin `Notification.requestPermission()` atau `geolocation.getCurrentPosition()` seketika saat pengguna baru saja membuka beranda situs (tanpa konteks aksi klik tombol) hampir selalu ditolak oleh pengguna dan diblokir otomatis oleh peramban modern.*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Memunculkan permintaan izin `Notification.requestPermission()` atau `geolocation.getCurrentPosition()` seketika saat pengguna baru saja membuka beranda situs (tanpa konteks aksi klik tombol) hampir selalu ditolak oleh pengguna dan diblokir otomatis oleh peramban modern.

### Soal 2
Manakah pernyataan yang paling tepat mengenai penggunaan `const wakeLock = await navigator.wakeLock.request('screen');` di JavaScript modern?
- A. Merupakan standar resmi ECMAScript / Web Platform API yang dirancang untuk menyelesaikan masalah secara aman, efisien, dan terukur tanpa peretasan manual
- B. Wajib dikompilasi menjadi kode PHP terlebih dahulu sebelum dijalankan di peramban
- C. Hanya dapat dipanggil dari dalam berkas stylesheet CSS
- D. Telah dihapus dari standar web modern

**Jawaban Benar:** A
**Penjelasan:** `const wakeLock = await navigator.wakeLock.request('screen');` adalah bagian dari spesifikasi resmi ECMAScript (TC39) atau Web Platform API (WHATWG/W3C) yang didukung oleh peramban modern.

### Soal 3
Saat mengintegrasikan fitur `API Perangkat & Perizinan` ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
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
