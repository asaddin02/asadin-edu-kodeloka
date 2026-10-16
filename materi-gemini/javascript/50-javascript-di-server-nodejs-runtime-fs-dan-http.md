# JavaScript di Luar Peramban: Runtime Server (Node.js / Bun / Deno), `node:fs/promises`, dan `node:http`

- **Tingkat:** Menengah
- **Ringkasan:** Memahami kesamaan dan perbedaan antara lingkungan peramban dan runtime server modern (Node.js LTS, Deno, Bun), membaca/menulis berkas secara asinkron dengan `node:fs/promises`, mengelola variabel lingkungan `process.env`, serta membangun server HTTP standar.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `import { readFile, writeFile } from 'node:fs/promises';` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Menggunakan fungsi pembaca berkas sinkron seperti `fs.readFileSync()` di dalam handler permintaan HTTP server Node.js akan memblokir *Event Loop* utama sehingga seluruh pengguna lain terpaksa mengantre hingga pembacaan disk selesai.

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `import { readFile, writeFile } from 'node:fs/promises';` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const server = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/kesehatan") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ status: "sehat", waktu: new Date().toISOString() }));
    return;
  }
  res.writeHead(404).end("Tidak ditemukan");
});

server.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `import { readFile, writeFile } from 'node:fs/promises';` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Menggunakan fungsi pembaca berkas sinkron seperti `fs.readFileSync()` di dalam handler permintaan HTTP server Node.js akan memblokir *Event Loop* utama sehingga seluruh pengguna lain terpaksa mengantre hingga pembacaan disk selesai.*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Menggunakan fungsi pembaca berkas sinkron seperti `fs.readFileSync()` di dalam handler permintaan HTTP server Node.js akan memblokir *Event Loop* utama sehingga seluruh pengguna lain terpaksa mengantre hingga pembacaan disk selesai.

### Soal 2
Manakah pernyataan yang paling tepat mengenai `import { readFile, writeFile } from 'node:fs/promises';`?
- A. Modul bawaan Node.js untuk operasi berkas berbasis `Promise`; modul ini bukan bagian dari standar ECMAScript maupun Web Platform API sehingga tidak tersedia di peramban.
- B. Fungsi bawaan semua peramban yang dapat dipanggil langsung dari objek `window`.
- C. Bagian dari spesifikasi ECMAScript (TC39) yang wajib ada di setiap mesin JavaScript.
- D. Hanya dapat dipakai bersama `fs.readFileSync()` dan tidak mendukung `async`/`await`.

**Jawaban Benar:** A
**Penjelasan:** Awalan `node:` menandai modul inti Node.js (juga didukung Deno dan Bun lewat lapisan kompatibilitas). `node:fs/promises` menyediakan API berkas berbasis `Promise` yang bisa dipakai dengan `await`, tetapi ia adalah API runtime server, bukan standar ECMAScript atau API peramban.

### Soal 3
Saat mengintegrasikan fitur `JavaScript di Luar Peramban` ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
- A. Mengabaikan semua potensi eksepsi agar kode terlihat lebih pendek
- B. Memeriksa dukungan fitur bila perlu (*feature detection*), menangani skenario kegagalan secara eksplisit, dan membersihkan sumber daya saat komponen dihancurkan
- C. Menyimpan seluruh data sensitif di variabel global `window`
- D. Mematikan mode ketat (*strict mode*) pada modul ES

**Jawaban Benar:** B
**Penjelasan:** Kode JavaScript kelas produksi wajib menerapkan *defensive programming*, deteksi kapabilitas platform bila menggunakan API perangkat, dan manajemen siklus hidup sumber daya yang rapi.

## Sumber

- [File system — Node.js Documentation](https://nodejs.org/docs/latest/api/fs.html)
- [HTTP — Node.js Documentation](https://nodejs.org/docs/latest/api/http.html)
