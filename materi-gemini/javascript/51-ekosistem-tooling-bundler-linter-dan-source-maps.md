# Ekosistem Tooling Modern: Bundler (Vite/esbuild), Tree-Shaking, Code Splitting, dan Linter

- **Tingkat:** Menengah
- **Ringkasan:** Memahami cara kerja perkakas pengembangan JavaScript modern: bagaimana *bundler* (seperti Vite, Rollup, esbuild) memangkas kode mati melalui **Tree-Shaking** pada ES Modules, memecah bundel dengan **Code Splitting**, men-debug kode produksi melalui **Source Maps**, serta menjaga kualitas kode dengan Linter & Formatter.

## Mengapa Cara Anda Menulis `import` dan `export` Menentukan Ukuran Unduhan Pengguna?

Di lingkungan pengembangan, proyek Anda mungkin terdiri dari ratusan berkas modul kecil dan puluhan paket di `node_modules`. Saat disiapkan untuk produksi oleh *bundler* modern (seperti **Vite**, **Rollup**, **esbuild**, atau **webpack**), perkakas tersebut melakukan tiga optimasi utama:
1. **Tree-Shaking (*Dead-Code Elimination*):** Menganalisis struktur statis `import` dan `export` ES Modules untuk membuang fungsi-fungsi yang tidak pernah dipakai dari bundel akhir.
2. **Code Splitting:** Memecah kode fitur berat (seperti editor grafik atau halaman pengaturan admin) menjadi potongan berkas terpisah (*chunks*) yang baru diunduh saat dibutuhkan melalui **`await import("./fitur.js")`**.
3. **Minifikasi & Source Maps (`.js.map`):** Memampatkan nama variabel dan spasi menjadi berkas `.min.js` yang kecil, sambil menyediakan peta koordinat baris asli di berkas `.map` untuk pelacakan galat.

> **⚠️ Jebakan Umum di Lapangan:** Mengimpor seluruh isi objek pustaka besar secara utuh atau mengekspor semuanya di dalam satu objek tunggal (`export default { a, b, c }`) menghalangi *bundler* melakukan *tree-shaking* statis, sehingga kode yang tidak terpakai tetap ikut membebani unduhan pengguna.

## 1. Perbandingan Pola Penulisan Modul Terhadap Efektivitas *Tree-Shaking* & *Code Splitting*

Agar *bundler* dapat memangkas ukuran berkas secara maksimal, ikuti pola penulisan modul berikut:

| Aspek Penulisan | Pola yang Menghalangi Optimasi Bundler (Hindari) | Pola yang Ramah Tree-Shaking & Code Splitting (Gunakan) |
| :--- | :--- | :--- |
| **Gaya Ekspor Modul** | `export default { formatRupiah, hitungDiskon, baganBerat }` (satu objek raksasa). | **Named Exports**: `export function formatRupiah() ...`, `export function hitungDiskon() ...`. |
| **Efek Samping Tingkat Atas (*Top-Level Side Effects*)** | Menjalankan kode mutasi global langsung di luar fungsi saat modul diimpor + tidak ada `"sideEffects": false`. | Menjaga modul utilitas bebas efek samping tingkat atas dan mendeklarasikan **`"sideEffects": false`** di `package.json`. |
| **Pemuatan Fitur Berat** | Mengimpor pustaka grafik 500 KB di baris atas beranda dengan `import` statis padahal hanya dipakai di modal laporan. | Gunakan **Dynamic `import()`**: `const { gambarGrafik } = await import("./grafik-berat.js")` saat modal dibuka! |
| **Konfigurasi Source Map Produksi** | Mengunggah berkas `.js.map` lengkap dengan komentar `//# sourceMappingURL=...` ke CDN publik bila kode bersifat tertutup. | Gunakan mode **`hidden`** (*hidden source map*): unggah `.map` hanya ke server pelacak galat internal (seperti Sentry/Grafana Faro), bukan ke publik. |

## 2. Named Exports untuk *Tree-Shaking* dan Dynamic `import()` untuk *Code Splitting*

Mengapa `export default { formatRupiah, hitungDiskon }` sulit dipangkas oleh *bundler*? Karena objek JavaScript bersifat dinamis saat runtime (bisa diakses dengan `obj[namaFungsiDinamis]()`), sehingga *bundler* tidak berani menghapus properti di dalam objek `default` tersebut. Sebaliknya, **Named Exports (`export function ...`)** memiliki pengikatan statis yang sudah pasti diketahui pada waktu kompilasi (*build time*):

```javascript
// BAIK untuk Tree-Shaking: Gunakan Named Exports pada ES Module
export function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(angka);
}

export function hitungDiskon(harga, persen) {
  return harga - Math.round((harga * persen) / 100);
}

// BAIK untuk Code Splitting: Muat modul berat hanya saat pengguna mengeklik tombol
export async function bukaEditorDiagram(elemenWadah, dataDiagram) {
  // Bundler (Vite/Rollup/webpack) otomatis memisahkan './mesin-diagram.mjs' menjadi berkas chunk tersendiri!
  const { renderDiagramInteraktif } = await import("./mesin-diagram.mjs");
  return renderDiagramInteraktif(elemenWadah, dataDiagram);
}
```

## 3. Memahami Peran `"sideEffects": false` di `package.json` dan Source Maps

Ketika Anda mengimpor satu fungsi `import { formatRupiah } from "./util/index.js"`, dan berkas `index.js` tersebut mengimpor ulang (`export * from ...`) 20 berkas utilitas lain (*barrel file*), *bundler* harus berhati-hati: *"Bagaimana jika salah satu dari 19 berkas lain yang tidak dipakai itu mengandung kode tingkat atas yang memodifikasi `window` atau mendaftarkan polyfill saat diimpor?"*

Dengan menambahkan **`"sideEffects": false`** di dalam `package.json` (atau `"sideEffects": ["**/*.css"]` jika mengimpor berkas CSS), Anda memberi jaminan kepada *bundler* bahwa modul-modul di paket Anda tidak memiliki efek samping tersembunyi saat diimpor, sehingga seluruh berkas yang ekspornya tidak terpakai aman dilewati sepenuhnya!

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Membuat *Barrel File* (`index.js` yang mengekspor ulang ratusan modul) tanpa `"sideEffects": false`:** Ini memaksa *bundler* dan pengujian unit memuat ratusan berkas yang sebenarnya tidak dipakai oleh halaman tersebut.
2. **Menaruh ekspresi variabel bebas di dalam `await import(jalurBebas)`:** *Bundler* perlu mengetahui kandidat berkas apa saja yang mungkin diimpor pada waktu *build*. Jika perlu memuat secara dinamis berdasarkan nama, berikan pola direktori dan ekstensi yang jelas seperti `` await import(`./bahasa/${kode}.json`) ``.
3. **Menampilkan *Source Maps* lengkap di CDN produksi untuk aplikasi komersial tertutup:** Siapa pun yang membuka tab **Sources** di DevTools dapat melihat dan menyalin seluruh kode sumber asli beserta komentar internal Anda. Gunakan opsi `sourcemap: "hidden"` agar berkas `.map` hanya dikirim ke sistem pemantau galat tim Anda.

## Latihan Praktik Mandiri

1. Buat dua berkas modul: `matematika-ringan.mjs` (menggunakan *named exports* `tambah`, `kali`, dan `fungsiTakTerpakai`) serta `pemuat-dinamis.mjs` yang menggunakan `await import("./matematika-ringan.mjs")` untuk memuat modul secara malas (*lazy*).
2. Jalankan pengujian `node:test` pada `pemuat-dinamis.mjs` untuk memastikan modul dinamis berhasil dimuat dan dieksekusi saat dibutuhkan.

## Kuis Pemahaman

### Soal 1
Mengapa mengekspor fungsi-fungsi utilitas menggunakan **Named Exports** (`export function a() {}`, `export function b() {}`) jauh lebih efektif untuk proses **Tree-Shaking** oleh *bundler* dibandingkan membungkus semuanya ke dalam satu objek `export default { a, b }`?
- A. Karena kata kunci `default` tidak didukung oleh peramban modern
- B. Karena *named exports* diikat secara statis pada tingkat sintaks ES Module sehingga *bundler* dapat memastikan pada waktu *build* fungsi mana yang tidak pernah diimpor dan membuangnya dengan aman, sedangkan properti pada objek `export default` bersifat dinamis saat runtime
- C. Karena `export default` membuat ukuran berkas menjadi 10 kali lebih besar secara otomatis
- D. Karena Node.js melarang penggunaan `export default`

**Jawaban Benar:** B
**Penjelasan:** *Tree-shaking* mengandalkan analisis statis graf ketergantungan ES Modules. Dengan *named exports*, simbol yang tidak pernah diimpor di mana pun dapat langsung dieliminasi sebelum bundel ditulis.

### Soal 2
Apa fungsi properti `"sideEffects": false` pada `package.json` di proyek yang memakai *bundler* seperti Vite, Rollup, atau webpack?
- A. Memberi tahu *bundler* bahwa modul-modul di paket tersebut tidak memiliki efek samping ketika diimpor, sehingga impor yang tidak terpakai aman dibuang saat *tree-shaking*.
- B. Mencegah Node.js menjalankan skrip `postinstall` ketika paket dipasang.
- C. Mengenkripsi kode produksi agar tidak dapat dibaca pengguna.
- D. Menonaktifkan *source map* agar kode asli tidak bocor.

**Jawaban Benar:** A
**Penjelasan:** `sideEffects` adalah konvensi yang dikenali webpack, Rollup, dan Vite (bukan bagian dari ECMAScript). Dengan `false`, bundler boleh menghapus seluruh modul yang impornya tidak dipakai. *Tree-shaking* sendiri bergantung pada sintaks `import`/`export` statis milik ES Modules.

### Soal 3
Sintaks standar ECMAScript manakah yang digunakan untuk memicu **Code Splitting** agar sebuah modul fitur berat baru diunduh melalui jaringan ketika pengguna benar-benar membuka fitur tersebut?
- A. `import * as fitur from "./fitur-berat.js";` di baris paling atas berkas
- B. Pemanggilan fungsi asinkron **`await import("./fitur-berat.js")`** (*Dynamic Import*) di dalam *event handler* atau fungsi pembuka fitur
- C. `<link rel="stylesheet" href="./fitur-berat.js">`
- D. `window.eval("./fitur-berat.js")`

**Jawaban Benar:** B
**Penjelasan:** Ekspresi `import(specifier)` dinamis mengembalikan `Promise` yang me-*resolve* objek namespace modul tersebut. *Bundler* modern secara otomatis memisahkan target `import()` dinamis menjadi berkas *chunk* terpisah yang dimuat sesuai permintaan (*on-demand*).

## Sumber

- [Building for Production — Vite](https://vite.dev/guide/build)
- [Tree Shaking — webpack](https://webpack.js.org/guides/tree-shaking/)
- [Source maps — Chrome DevTools](https://developer.chrome.com/docs/devtools/javascript/source-maps)
