# Keamanan Tipe Tanpa Langkah Build Menggunakan Komentar JSDoc (`// @ts-check`)

- **Tingkat:** Menengah
- **Ringkasan:** Mendapatkan pemeriksaan tipe statis dan pelengkapan otomatis (*autocomplete*) setingkat TypeScript langsung di berkas `.js` murni tanpa langkah kompilasi menggunakan direktif **`// @ts-check`** dan anotasi **JSDoc** (`@param`, `@returns`, `@typedef`, `@template`).

## Mengapa Banyak Proyek Modern Memilih `.js` Murni dengan `// @ts-check`?

TypeScript memberikan jaminan keamanan tipe yang luar biasa untuk mencegah bug seperti salah ketik nama properti atau lupa menangani nilai `null`/`undefined`. Namun, menulis berkas `.ts` mengharuskan adanya langkah kompilasi (*transpilation/build step*) sebelum kode dapat dijalankan oleh peramban.

Bagaimana jika Anda membangun situs web statis cepat (seperti Kodeloka!), perkakas skrip CLI, atau pustaka ringan yang ingin langsung dijalankan oleh peramban dan Node.js **tanpa langkah kompilasi sama sekali**, tetapi tetap menginginkan **pemeriksaan tipe statis 100% seketat TypeScript**? Jawabannya adalah meletakkan komentar **`// @ts-check`** di baris pertama berkas `.js`/`.mjs` Anda dan mendokumentasikan tipe datanya dengan **JSDoc**!

> **⚠️ Jebakan Umum di Lapangan:** Menulis fungsi utilitas kompleks di JavaScript tanpa mendokumentasikan bentuk objek masukannya membuat pengembang lain harus menebak-nebak properti apa saja yang tersedia dan rawan mengirim tipe data yang salah.

## 1. Peta Tag JSDoc Utama yang Dikenali oleh Pemeriksa Tipe TypeScript

Saat `// @ts-check` aktif di bagian atas berkas (atau `"checkJs": true` di dalam `jsconfig.json`), mesin bahasa TypeScript di editor (VS Code, Cursor, Neovim, WebStorm) dan perintah `tsc --noEmit` memahami tag JSDoc berikut:

| Tag Anotasi JSDoc | Sintaks Contoh | Fungsi dalam Pemeriksaan Tipe Statis |
| :--- | :--- | :--- |
| **`// @ts-check`** | Di baris ke-1 berkas `.js` / `.mjs` | Mengaktifkan analisis tipe statis penuh pada berkas JavaScript tersebut. |
| **`@typedef` & `@property`** | `@typedef {Object} Pengguna` + `@property {string} id` | Mendefinisikan tipe bentuk objek kustom (setara dengan `interface` atau `type` di TypeScript). |
| **`@param`** | `@param {string} nama` / `@param {number} [batas=10]` | Menentukan tipe parameter fungsi (kurung siku `[batas=10]` menandakan parameter opsional dengan nilai bawaan). |
| **`@returns`** | `@returns {Promise<Pengguna[]>}` | Menentukan tipe nilai kembalian fungsi (termasuk tipe generik di dalam `Promise`). |
| **`@template`** | `@template T` lalu `@param {T[]} daftar` | Mendefinisikan parameter tipe generik (*Generics*) agar tipe kembalian mengikuti tipe argumen masukan. |
| **`@type`** & **`@satisfies`** | `/** @type {Map<string, number>} */` | Memberikan tipe eksplisit pada variabel atau memvalidasi bentuk objek konstanta. |

## 2. Mendefinisikan Tipe Objek (`@typedef`), Array `readonly`, dan Fungsi Generik (`@template`)

Perhatikan bagaimana kode JavaScript murni di bawah ini langsung dapat dieksekusi oleh peramban maupun Node.js tanpa kompilasi, namun memiliki keamanan tipe penuh:

```javascript
// @ts-check

/**
 * @typedef {Object} ItemKeranjang
 * @property {string} idProduk
 * @property {number} hargaSatuan
 * @property {number} jumlah
 * @property {boolean} [kenaPajak] - Properti opsional
 */

/**
 * Menghitung total harga seluruh item di keranjang.
 * @param {readonly ItemKeranjang[]} daftarItem
 * @returns {number}
 */
export function hitungTotalKeranjang(daftarItem) {
  return daftarItem.reduce((total, item) => total + item.hargaSatuan * item.jumlah, 0);
}

/**
 * Fungsi generik untuk mengambil elemen terakhir dari array apa pun.
 * @template TItem
 * @param {readonly TItem[]} daftar
 * @returns {TItem | undefined}
 */
export function ambilElemenTerakhir(daftar) {
  return daftar.at(-1);
}
```

## 3. Mengimpor Tipe Lintas Berkas (`import("./berkas.js").NamaTipe`) dan Konfigurasi `jsconfig.json`

Bagaimana jika tipe `@typedef {Object} ItemKeranjang` didefinisikan di dalam `keranjang.mjs`, lalu Anda ingin menggunakannya sebagai tipe parameter di berkas `pembayaran.mjs`? Anda tidak perlu menyalin ulang `@typedef` tersebut! Gunakan sintaks **`import("./keranjang.mjs").ItemKeranjang`** di dalam komentar JSDoc:

```javascript
// @ts-check

/**
 * Memformat ringkasan pembayaran dari daftar item keranjang.
 * @param {readonly import("./keranjang.mjs").ItemKeranjang[]} daftarItem
 * @param {"transfer" | "qris" | "kartu"} metodeBayar - Union type literal string
 * @returns {string}
 */
export function buatRingkasanBayar(daftarItem, metodeBayar) {
  const total = daftarItem.reduce((sum, x) => sum + x.hargaSatuan * x.jumlah, 0);
  return `Metode ${metodeBayar.toUpperCase()}: Rp ${total.toLocaleString("id-ID")}`;
}
```

Untuk mengaktifkan pemeriksaan di seluruh proyek tanpa harus menulis `// @ts-check` di tiap berkas, buatlah berkas **`jsconfig.json`** di akar repositori dan jalankan `npx tsc -p jsconfig.json` di pipa CI Anda:

```json
{
  "compilerOptions": {
    "checkJs": true,
    "strict": true,
    "noEmit": true,
    "target": "ES2024",
    "module": "ESNext",
    "moduleResolution": "Bundler"
  },
  "include": ["src/**/*.js", "src/**/*.mjs"]
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan `// @ts-ignore` untuk membungkam galat tipe:** `// @ts-ignore` mematikan pemeriksaan pada baris di bawahnya secara permanen bahkan setelah masalah tipenya sudah diperbaiki. Jika benar-benar terpaksa melewati satu baris (misalnya saat menguji input tidak valid), gunakan **`// @ts-expect-error`** yang akan memberi peringatan jika baris tersebut di kemudian hari tidak lagi menghasilkan galat tipe.
2. **Menyangka anotasi JSDoc otomatis memvalidasi data JSON dari jaringan saat runtime:** Sama seperti TypeScript, komentar JSDoc hanya diperiksa secara **statis** sebelum kode dijalankan dan diabaikan sepenuhnya oleh mesin JavaScript saat runtime! Untuk data yang baru diterima dari `await res.json()` atau input formulir pengguna, Anda tetap wajib melakukan validasi nilai saat runtime.
3. **Menulis `@param {Array}` atau `@param {Object}` telanjang tanpa merinci isinya:** Menulis `@param {Array}` sama saja dengan `any[]` yang tidak memberi perlindungan apa pun. Selalu tulis tipe elemennya, misalnya `@param {string[]}` atau `@param {ItemKeranjang[]}`.

## Latihan Praktik Mandiri

1. Buat berkas `validasi-pesanan.mjs` yang diawali `// @ts-check`, definisikan `@typedef {Object} Pesanan` dengan properti `id` (`string`), `status` (`"pending" | "lunas" | "batal"`), dan `nominalRp` (`number`).
2. Buat fungsi `apakahBolehDikirim(pesanan)` lengkap dengan anotasi `@param {Pesanan} pesanan` dan `@returns {boolean}`.
3. Uji fungsi tersebut menggunakan `node:test`.

## Kuis Pemahaman

### Soal 1
Apa keuntungan utama menggunakan kombinasi `// @ts-check` dan anotasi JSDoc pada berkas `.js` / `.mjs` dibandingkan menulis JavaScript tanpa anotasi?
- A. Membuat kode JavaScript berjalan 10 kali lebih cepat di mesin V8
- B. Memberikan pemeriksaan tipe statis (mendeteksi salah ketik properti, argumen yang keliru, atau potensi nilai `undefined`) serta pelengkapan otomatis (*autocomplete*) di editor dan CI **tanpa memerlukan langkah kompilasi/build** karena berkas tetap berupa JavaScript standar yang valid
- C. Mengenkripsi berkas `.js` secara otomatis
- D. Memblokir serangan DDoS di tingkat jaringan

**Jawaban Benar:** B
**Penjelasan:** Karena anotasi ditulis di dalam blok komentar standar `/** ... */`, mesin JavaScript di peramban dan Node.js dapat langsung mengeksekusi berkas `.js` tersebut apa adanya, sementara pemeriksa tipe (`tsc --noEmit` dan editor) menganalisis keamanan tipenya secara mendalam.

### Soal 2
Apa fungsi direktif komentar `// @ts-check` di baris pertama sebuah berkas `.js`?
- A. Meminta editor atau TypeScript memeriksa tipe berkas JavaScript tersebut berdasarkan anotasi JSDoc dan inferensi tipe, tanpa langkah kompilasi dan tanpa mengubah perilaku kode saat dijalankan.
- B. Mengubah berkas `.js` menjadi `.ts` secara otomatis ketika dijalankan di peramban.
- C. Membuat peramban menolak menjalankan skrip yang mengandung galat tipe.
- D. Mengaktifkan fitur bahasa ECMAScript yang masih eksperimental.

**Jawaban Benar:** A
**Penjelasan:** `// @ts-check` adalah fitur TypeScript (bukan bagian dari ECMAScript). Bagi mesin JavaScript ia hanya komentar biasa, sehingga pemeriksaan tipenya terjadi di editor, lewat `tsc --noEmit`, atau di CI, bukan saat kode dijalankan.

### Soal 3
Tag JSDoc manakah yang digunakan untuk mendeklarasikan parameter tipe generik (*Generics*) agar fungsi pembantu dapat mempertahankan tipe elemen array yang diterimanya?
- A. `@generic {T}`
- B. `@template T` (diikuti misalnya `@param {T[]} items` dan `@returns {T | undefined}`)
- C. `@typedef {any} T`
- D. `@dynamic T`

**Jawaban Benar:** B
**Penjelasan:** Tag `@template NamaTipe` di JSDoc mendefinisikan parameter tipe generik (setara dengan `<NamaTipe>` di TypeScript) sehingga tipe nilai kembalian fungsi otomatis menyesuaikan diri dengan tipe argumen saat dipanggil.

## Sumber

- [JSDoc Reference — TypeScript](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [Type Checking JavaScript Files — TypeScript](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html)
