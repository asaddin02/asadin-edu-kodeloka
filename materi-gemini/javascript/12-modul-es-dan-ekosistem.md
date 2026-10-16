# Modul ES (`import` / `export`), Dynamic `import()`, dan Import Maps

- **Tingkat:** Menengah
- **Ringkasan:** Memecah kode aplikasi besar menjadi berkas-berkas modular yang terisolasi menggunakan standar ES Modules (`export`, `import`), memuat fitur berat sesuai kebutuhan dengan `import()` dinamis, menggunakan `<script type="importmap">`, serta memahami ekosistem `package.json`.

## Mengapa Kita Membutuhkan Sistem Modul?

Pada era awal web, semua berkas JavaScript dimuat dengan deretan `<script src="...">` biasa yang **berbagi satu ruang lingkup global (`window`) yang sama**. Jika berkas `navigasi.js` mendeklarasikan variabel `let terbuka = false`, lalu berkas `modal.js` di bawahnya juga mendeklarasikan variabel bernama `terbuka`, keduanya akan saling bertabrakan!

Standar resmi **ES Modules (ESM)** menyelesaikan masalah ini secara permanen:
1. **Cakupan Terisolasi per Berkas (*Module Scope*):** Variabel, fungsi, atau class yang Anda tulis di dalam sebuah modul bersifat privat di berkas tersebut, kecuali Anda menandainya secara eksplisit dengan kata kunci **`export`**.
2. **Otomatis Berjalan dalam *Strict Mode* (`"use strict"`):** Mencegah pembuatan variabel global tak sengaja dan menangkap kesalahan diam-diam sejak dini.
3. **Otomatis Bersifat *Deferred* di Peramban:** Menulis `<script type="module" src="/app.js"></script>` di dalam `<head>` secara otomatis mengunduh modul beserta rantai impornya secara paralel tanpa memblokir pembacaan HTML!

## 1. Named Exports vs Default Export

Ada dua cara mengekspor dan mengimpor fungsionalitas antar-berkas:

### A. Named Exports (Diekspor dengan Nama Pasti — Sangat Direkomendasikan!)
Satu berkas modul dapat memiliki banyak *named export*. Keunggulan utamanya: nama fungsi konsisten di seluruh proyek, memudahkan pelengkapan otomatis (*autocomplete*) di editor kode, dan memudahkan *tree-shaking* (penghapusan kode tak terpakai).

```js
// Berkas: ./utilitas/format.js
export const MATA_UANG_BAWAAN = "IDR";

export function formatRupiah(nominal) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: MATA_UANG_BAWAAN,
    maximumFractionDigits: 0
  }).format(nominal);
}

export function formatTanggal(isoString) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(isoString));
}
```

Cara mengimpornya di berkas lain:

```js
// Berkas: ./app.js
// PENTING: Di peramban murni (tanpa bundler), jalur relatif WAJIB diawali './' atau '../'
// dan menyertakan ekstensi berkas '.js'!
import { formatRupiah, formatTanggal as ubahKeTanggalIndo } from "./utilitas/format.js";

console.log(formatRupiah(150000));                 // "Rp 150.000"
console.log(ubahKeTanggalIndo("2026-10-16"));      // "16 Oktober 2026"
```

### B. Default Export (Maksimal Satu per Berkas)
Biasanya digunakan jika satu berkas hanya mewakili satu class atau satu komponen utama:

```js
// Berkas: ./layanan/PenghitungKuis.js
export default class PenghitungKuis {
  // ...
}

// Berkas pemanggil:
import PenghitungKuis from "./layanan/PenghitungKuis.js";
```

## 2. Pemuatan Malas Sesuai Kebutuhan dengan Dynamic `import()`

Pernyataan `import ... from "..."` di bagian atas berkas bersifat **statis**: seluruh berkas yang diimpor akan diunduh saat halaman dibuka.

Namun, bagaimana jika halaman Anda memiliki fitur berat—seperti **Editor Kode Interaktif** atau **Pengekspor Laporan PDF**—yang hanya digunakan apabila pengguna menekan tombol *"Buka Simulator"*?

Gunakan fungsi **`import(jalurModul)` dinamis** yang mengembalikan sebuah **`Promise`**: berkas JavaScript tersebut baru akan diunduh dari jaringan pada detik pengguna benar-benar mengeklik tombolnya!

```js
const tombolSimulator = document.querySelector("#buka-simulator");

tombolSimulator.addEventListener("click", async () => {
  try {
    tombolSimulator.disabled = true;
    tombolSimulator.textContent = "Memuat mesin simulator...";

    // Berkas simulator.js baru diunduh saat tombol diklik!
    const modulSimulator = await import("./fitur/simulator.js");
    modulSimulator.jalankanSimulator("#wadah-editor");
  } catch (galat) {
    console.error("Gagal memuat modul simulator:", galat);
  } finally {
    tombolSimulator.disabled = false;
  }
});
```

## 3. Memetakan Nama Modul di Peramban dengan `<script type="importmap">`

Dulu, menulis `import { html } from "lit";` (*bare module specifier* tanpa `./` atau `https://`) hanya bisa dilakukan jika kita memakai *bundler* (seperti Vite, Webpack, atau Rollup) karena peramban tidak tahu di alamat URL mana kata `"lit"` berada.

Kini, semua peramban modern mendukung **`<script type="importmap">`** (status **Baseline Widely Available** sejak Maret 2023) yang memetakan nama singkat modul ke jalur berkas sesungguhnya langsung di HTML:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <title>Aplikasi dengan Import Map</title>

    <!-- Import Map harus diletakkan sebelum <script type="module"> pertama -->
    <script type="importmap">
    {
      "imports": {
        "@utilitas/": "/assets/js/utilitas/",
        "penyimpanan": "/assets/js/layanan/penyimpanan.js"
      }
    }
    </script>

    <script type="module">
      // Kini kita bisa mengimpor dengan nama bersih tanpa jalur '../../../' yang rumit!
      import { formatRupiah } from "@utilitas/format.js";
      import { penyimpananLokal } from "penyimpanan";

      console.log(formatRupiah(250000));
    </script>
  </head>
  <body></body>
</html>
```

## 4. Mengenal `package.json` dan Ekosistem Proyek Modern

Dalam repositori proyek JavaScript (termasuk repositori Kodeloka ini!), berkas **`package.json`** di akar proyek berfungsi sebagai manifes utama:
- **`"type": "module"`:** Memberitahu Node.js agar memperlakukan semua berkas `.js` di proyek sebagai **ES Modules** (sehingga mendukung `import` / `export` dan *Top-Level `await`*).
- **`"scripts"`:** Pintasan perintah terminal yang dijalankan lewat `npm run <nama>` (seperti `npm run dev`, `npm run build`, `npm test`).
- **`"dependencies"` vs `"devDependencies"`:** Daftar paket pustaka yang dibutuhkan saat aplikasi berjalan di produksi vs alat bantu pengembangan/pengujian (seperti Playwright untuk tes browser).
- **`package-lock.json`:** Mengunci versi persis beserta *hash* integritas dari setiap paket dan sub-paket agar instalasi via `npm ci` di komputer seluruh anggota tim dan server CI/CD dijamin 100% identik!

## Latihan Praktik: Memecah Aplikasi Menjadi Tiga Modul Terpisah

Buatlah folder latihan berisi tiga berkas:
1. `konstanta.js` yang mengekspor tarif pajak dan daftar diskon.
2. `kalkulator.js` yang mengimpor `konstanta.js` dan mengekspor fungsi `hitungHargaBersih(harga, kodeDiskon)`.
3. `index.html` yang memuat `<script type="importmap">` dan `<script type="module">` untuk menjalankan perhitungan serta memuat modul `cetak-struk.js` secara dinamis dengan `await import("./cetak-struk.js")` saat tombol ditekan.

## Kuis Pemahaman

### Soal 1
Apa perilaku bawaan dari elemen `<script type="module" src="app.js"></script>` ketika diletakkan di dalam `<head>` dokumen HTML?
- A. Menghentikan parser HTML (*render-blocking*) sama seperti `<script>` biasa tanpa atribut.
- B. Secara otomatis berperilaku seperti memiliki atribut `defer` (diunduh secara paralel dan baru dieksekusi setelah dokumen HTML selesai diurai menjadi DOM), berjalan di dalam *strict mode*, serta memiliki cakupan variabel tingkat modul yang tidak mengotori `window`.
- C. Hanya dapat dijalankan jika pengguna menyalakan pengaturan khusus di peramban.
- D. Mengizinkan penggunaan variabel tanpa perlu dideklarasikan dengan `let` atau `const`.

**Jawaban Benar:** B
**Penjelasan:** Spesifikasi HTML menetapkan bahwa `<script type="module">` secara bawaan bersifat *deferred*, selalu dieksekusi dalam *strict mode*, dan mengisolasi seluruh deklarasi tingkat atasnya di dalam *module scope*.

### Soal 2
Kapan Anda sebaiknya menggunakan pemuatan modul dinamis `const modul = await import("./grafik-berat.js")` dibandingkan pernyataan `import` statis di baris paling atas berkas?
- A. Untuk semua fungsi kecil yang pasti langsung dipakai saat halaman pertama kali dibuka.
- B. Ketika modul tersebut berukuran besar dan hanya dibutuhkan pada kondisi tertentu atau setelah interaksi pengguna (seperti membuka tab analitik atau menekan tombol ekspor), sehingga mempercepat pemuatan awal halaman.
- C. Ketika Anda ingin menjalankan kode secara sinkron tanpa `Promise`.
- D. Karena `import` statis sudah tidak didukung di ES2024.

**Jawaban Benar:** B
**Penjelasan:** Dynamic `import()` memungkinkan pemecahan kode (*code splitting* / *lazy loading*) di mana modul yang jarang dipakai atau berukuran berat ditunda pengunduhannya hingga benar-benar diperlukan oleh pengguna.

### Soal 3
Apa fungsi dari berkas `package-lock.json` di dalam proyek JavaScript/Node.js?
- A. Menyimpan kata sandi basis data produksi agar tidak terbaca publik.
- B. Mengunci pohon dependensi pada versi persis dan *checksum* integritas yang tepat, sehingga perintah `npm ci` di mesin pengembang lain maupun server CI/CD menginstal versi paket yang 100% identik.
- C. Menggantikan fungsi berkas `index.html`.
- D. Mencegah pengembang menambahkan berkas `.js` baru ke dalam folder proyek.

**Jawaban Benar:** B
**Penjelasan:** Berkas `package.json` sering mencantumkan rentang versi (seperti `^1.2.0`), sedangkan `package-lock.json` mencatat versi eksak beserta URL dan *hash* kriptografis dari setiap paket di dalam pohon dependensi.

## Sumber
- [JavaScript modules — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [ECMAScript Language Specification (Modules) — TC39](https://tc39.es/ecma262/)
