# Komunikasi Lintas Tab dan Iframe: `BroadcastChannel`, `MessageChannel`, dan `postMessage`

- **Tingkat:** Menengah
- **Ringkasan:** Menyinkronkan status login, tema gelap/terang, atau keranjang belanja secara instan di seluruh tab peramban yang terbuka menggunakan **`BroadcastChannel`**, berkomunikasi langsung antar-konteks dengan **`MessageChannel`**, serta mengamankan validasi `event.origin` pada `window.postMessage()`.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `const saluran = new BroadcastChannel('sinkronisasi_auth');` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Menerima pesan dari `window.addEventListener('message', ...)` tanpa memeriksa `event.origin === 'https://domain-tepercaya.id'` membuka celah keamanan serius di mana situs berbahaya dapat menyuntikkan perintah palsu ke jendela aplikasi Anda.

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `const saluran = new BroadcastChannel('sinkronisasi_auth');` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
// Menyinkronkan aksi Logout di seluruh tab peramban yang sedang terbuka
const saluranAuth = new BroadcastChannel("kodeloka_auth_channel");

export function siarkanLogout() {
  saluranAuth.postMessage({ aksi: "LOGOUT", waktu: Date.now() });
}

saluranAuth.addEventListener("message", (event) => {
  if (event.data?.aksi === "LOGOUT") {
    window.location.assign("/login?alasan=sesi_berakhir");
  }
});
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `const saluran = new BroadcastChannel('sinkronisasi_auth');` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Menerima pesan dari `window.addEventListener('message', ...)` tanpa memeriksa `event.origin === 'https://domain-tepercaya.id'` membuka celah keamanan serius di mana situs berbahaya dapat menyuntikkan perintah palsu ke jendela aplikasi Anda.*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Menerima pesan dari `window.addEventListener('message', ...)` tanpa memeriksa `event.origin === 'https://domain-tepercaya.id'` membuka celah keamanan serius di mana situs berbahaya dapat menyuntikkan perintah palsu ke jendela aplikasi Anda.

### Soal 2
Manakah pernyataan yang paling tepat mengenai penggunaan `const saluran = new BroadcastChannel('sinkronisasi_auth');` di JavaScript modern?
- A. Merupakan standar resmi ECMAScript / Web Platform API yang dirancang untuk menyelesaikan masalah secara aman, efisien, dan terukur tanpa peretasan manual
- B. Wajib dikompilasi menjadi kode PHP terlebih dahulu sebelum dijalankan di peramban
- C. Hanya dapat dipanggil dari dalam berkas stylesheet CSS
- D. Telah dihapus dari standar web modern

**Jawaban Benar:** A
**Penjelasan:** `const saluran = new BroadcastChannel('sinkronisasi_auth');` adalah bagian dari spesifikasi resmi ECMAScript (TC39) atau Web Platform API (WHATWG/W3C) yang didukung oleh peramban modern.

### Soal 3
Saat mengintegrasikan fitur `Komunikasi Lintas Tab dan Iframe` ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
- A. Mengabaikan semua potensi eksepsi agar kode terlihat lebih pendek
- B. Memeriksa dukungan fitur bila perlu (*feature detection*), menangani skenario kegagalan secara eksplisit, dan membersihkan sumber daya saat komponen dihancurkan
- C. Menyimpan seluruh data sensitif di variabel global `window`
- D. Mematikan mode ketat (*strict mode*) pada modul ES

**Jawaban Benar:** B
**Penjelasan:** Kode JavaScript kelas produksi wajib menerapkan *defensive programming*, deteksi kapabilitas platform bila menggunakan API perangkat, dan manajemen siklus hidup sumber daya yang rapi.

## Sumber

- [Broadcast Channel API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
- [`MessageChannel` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel)
- [`Window.postMessage()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
