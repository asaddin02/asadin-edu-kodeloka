# JavaScript di Luar Peramban: Runtime Server (Node.js / Bun / Deno), `node:fs/promises`, dan `node:http`

- **Tingkat:** Menengah
- **Ringkasan:** Memahami kesamaan dan perbedaan antara lingkungan peramban dan runtime server modern (Node.js LTS, Deno, Bun), membaca/menulis berkas secara asinkron dengan `node:fs/promises`, mengelola variabel lingkungan `process.env`, serta membangun server HTTP standar.

## Bagaimana JavaScript yang Sama Bisa Berjalan di Peramban sekaligus di Server?

Bahasa inti JavaScript (sintaks, `Promise`, `Map`, `Array`, `Object`, `Async/Await`) distandarisasi oleh **ECMA-262 (TC39)**. Ketika kode JavaScript dijalankan di peramban, mesin JS (seperti V8 di Chrome, SpiderMonkey di Firefox, atau JavaScriptCore di Safari) dipasangkan dengan **API Peramban (`window`, `document`, DOM)**.

Sebaliknya, ketika dijalankan di **Runtime Server (Node.js, Deno, atau Bun)**, mesin JavaScript yang sama dipasangkan dengan **API Sistem Operasi**: akses sistem berkas (`node:fs/promises`), soket jaringan dan server HTTP (`node:http`), proses sistem (`process.env`), serta kesetaraan Web Platform API modern (`fetch`, `URL`, `Request`, `Response`, `Web Crypto`, dan `Web Streams`) yang kini hadir di kedua sisi!

> **⚠️ Jebakan Umum di Lapangan:** Menggunakan fungsi pembaca berkas sinkron seperti `fs.readFileSync()` di dalam handler permintaan HTTP server Node.js akan memblokir *Event Loop* utama sehingga seluruh pengguna lain terpaksa mengantre hingga pembacaan disk selesai.

## 1. Perbandingan Lingkungan Eksekusi Peramban vs Server (Node.js / Deno / Bun)

Memahami API mana yang tersedia di kedua lingkungan (*isomorphic*) dan mana yang khusus server sangat penting saat berbagi modul utilitas:

| Kategori API | Tersedia di Peramban? | Tersedia di Runtime Server (Node.js 20+ / Deno / Bun)? | Keterangan |
| :--- | :--- | :--- | :--- |
| **Standar Web Bersama** (`fetch`, `URL`, `TextEncoder`, `crypto.subtle`, `ReadableStream`) | **Ya** | **Ya** (Bawaan langsung di `globalThis`) | Tulis modul logika bisnis menggunakan API standar ini agar dapat dipakai ulang di frontend maupun backend! |
| **DOM & Jendela** (`window`, `document`, `localStorage`, `HTMLElement`) | **Ya** | **Tidak** | Hanya ada di peramban. Gunakan **`globalThis`** sebagai pengganti `window` untuk merujuk objek global lintas lingkungan. |
| **Sistem Berkas & Jaringan Server** (`node:fs/promises`, `node:http`, `node:path`) | **Tidak** | **Ya** (Selalu gunakan awalan skema **`node:`**) | Memberikan akses langsung ke disk, variabel lingkungan `process.env`, dan port TCP/HTTP server. |

## 2. Membaca Berkas Secara Asinkron (`node:fs/promises`) dan Membangun Server `node:http`

Mengapa kita harus selalu menulis awalan **`node:`** saat mengimpor modul inti (seperti `import { readFile } from "node:fs/promises"`)? Awalan `node:` memberi tahu runtime secara eksplisit bahwa kita meminta modul bawaan inti Node.js, mencegah pembajakan nama paket (*typosquatting*) di `node_modules`, dan didukung secara seragam oleh Node.js, Deno, maupun Bun.

Berikut adalah contoh server HTTP produksi ringan yang melayani rute pemeriksaan kesehatan (`/kesehatan`) dan membaca berkas JSON secara asinkron tanpa memblokir Event Loop:

```javascript
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

export function buatServerKatalog() {
  return createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    if (req.method === "GET" && url.pathname === "/kesehatan") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ status: "sehat", waktu: new Date().toISOString() }));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/paket") {
      try {
        const isi = await readFile(new URL("../package.json", import.meta.url), "utf8");
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(isi);
      } catch {
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ galat: "Gagal membaca berkas konfigurasi" }));
      }
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Tidak ditemukan");
  });
}

// Jalankan server jika berkas ini dieksekusi langsung
if (import.meta.main) {
  const port = Number(process.env.PORT || 3000);
  const server = buatServerKatalog();
  server.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
}
```

## 3. Menyelesaikan Jalur Berkas Relatif dengan `import.meta.url` dan `import.meta.dirname`

Di dalam ES Modules (`.mjs` atau `"type": "module"` di `package.json`), variabel lama CommonJS `__dirname` dan `__filename` tidak ada. Sebagai gantinya, gunakan:
- **`new URL("./data.json", import.meta.url)`**: Diterima langsung oleh `readFile()` dan `writeFile()` di `node:fs/promises` serta bekerja lintas platform!
- **`import.meta.dirname`** dan **`import.meta.filename`**: Tersedia sejak Node.js 20.11+ / 22+ dan Deno/Bun apabila Anda membutuhkan string jalur direktori.

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Memanggil `fs.readFileSync()` atau `crypto.pbkdf2Sync()` di dalam handler rute HTTP:** Karena Node.js melayani ribuan koneksi pengguna secara bersamaan di atas satu utas *Event Loop*, satu panggilan sinkron yang memakan waktu 50 ms akan membekukan seluruh permintaan pengguna lain selama 50 ms tersebut! Selalu gunakan API berbasis `Promise` (`node:fs/promises`).
2. **Menggunakan jalur relatif string `readFile("./data.json")` yang bergantung pada `process.cwd()`:** Jalur string relatif di `fs` diselesaikan terhadap direktori tempat perintah terminal dijalankan (`process.cwd()`), bukan lokasi berkas skrip berada. Gunakan `new URL("./data.json", import.meta.url)` agar selalu mengacu pada folder berkas skrip tersebut.
3. **Lupa bahwa semua nilai di dalam `process.env` bertipe `string` (atau `undefined`):** Menulis `if (process.env.DEBUG)` ketika di `.env` tertulis `DEBUG=false` akan bernilai **`true`** karena string `"false"` yang tidak kosong bersifat *truthy* di JavaScript! Selalu bandingkan secara eksplisit: `process.env.DEBUG === "true"`.

## Latihan Praktik Mandiri

1. Buat berkas `server-catatan.mjs` menggunakan `node:http` dan `node:fs/promises` yang menyimpan dan membaca daftar catatan dari berkas JSON sementara menggunakan `writeFile` dan `readFile`.
2. Tulis pengujian integrasi di `node:test` yang menyalakan server pada port acak (`server.listen(0)`), mengambil port yang dialokasikan lewat `server.address().port`, memanggil endpoint menggunakan `fetch()` bawaan, lalu menutup server dengan `server.close()`.

## Kuis Pemahaman

### Soal 1
Mengapa memanggil fungsi sinkron seperti `fs.readFileSync()` di dalam fungsi penangan permintaan HTTP (`createServer((req, res) => { ... })`) sangat berbahaya bagi performa server Node.js produksi?
- A. Karena `fs.readFileSync()` hanya dapat membaca berkas berukuran maksimal 1 KB
- B. Karena operasi I/O sinkron memblokir utas utama *Event Loop* Node.js sampai pembacaan disk selesai, sehingga ratusan permintaan HTTP dari pengguna lain terpaksa berhenti mengantre dan latensi server melonjak drastis
- C. Karena `fs.readFileSync()` menghapus berkas setelah dibaca
- D. Karena `fs.readFileSync()` membutuhkan koneksi internet

**Jawaban Benar:** B
**Penjelasan:** Arsitektur Node.js mengandalkan satu *Event Loop* non-blokir untuk menangani ribuan koneksi konkuren. Operasi sinkron menghentikan perputaran *Event Loop* sepenuhnya hingga operasi I/O selesai.

### Soal 2
Manakah pernyataan yang paling tepat mengenai `import { readFile, writeFile } from 'node:fs/promises';`?
- A. Modul bawaan Node.js untuk operasi berkas berbasis `Promise`; modul ini bukan bagian dari standar ECMAScript maupun Web Platform API sehingga tidak tersedia di peramban.
- B. Fungsi bawaan semua peramban yang dapat dipanggil langsung dari objek `window`.
- C. Bagian dari spesifikasi ECMAScript (TC39) yang wajib ada di setiap mesin JavaScript.
- D. Hanya dapat dipakai bersama `fs.readFileSync()` dan tidak mendukung `async`/`await`.

**Jawaban Benar:** A
**Penjelasan:** Awalan `node:` menandai modul inti Node.js (juga didukung Deno dan Bun lewat lapisan kompatibilitas). `node:fs/promises` menyediakan API berkas berbasis `Promise` yang bisa dipakai dengan `await`, tetapi ia adalah API runtime server, bukan standar ECMAScript atau API peramban.

### Soal 3
Apa yang terjadi jika variabel lingkungan dijalankan dengan ` FITUR_BARU=false node app.mjs `, lalu di dalam kode Anda menulis pemeriksaan `if (process.env.FITUR_BARU) { jalankanFitur(); }`?
- A. `jalankanFitur()` tidak dipanggil karena nilainya `false`
- B. `jalankanFitur()` **tetap terpanggil** karena seluruh nilai di dalam `process.env` disimpan sebagai **string**, dan string `"false"` yang tidak kosong bernilai *truthy* di JavaScript; seharusnya diperiksa dengan `process.env.FITUR_BARU === "true"`
- C. Node.js melempar `TypeError`
- D. Nilai `process.env.FITUR_BARU` otomatis berubah menjadi angka `0`

**Jawaban Benar:** B
**Penjelasan:** Properti pada `process.env` selalu bertipe `string` (atau `undefined` jika belum diatur). Dalam JavaScript, `Boolean("false") === true`, sehingga pemeriksaan boolean pada `process.env` harus dibandingkan secara eksplisit terhadap string `"true"` atau `"1"`.

## Sumber

- [File system — Node.js Documentation](https://nodejs.org/docs/latest/api/fs.html)
- [HTTP — Node.js Documentation](https://nodejs.org/docs/latest/api/http.html)
