# Alur Kontrol, Perulangan Modern, dan Fungsi Kelas Satu

- **Tingkat:** Dasar
- **Ringkasan:** Mengendalikan alur eksekusi dengan `if/else`, *guard clauses*, dan perulangan `for...of`, serta memahami fungsi sebagai warga kelas satu (*first-class citizens*), perbedaan deklarasi fungsi dan *arrow function* (`=>`), parameter bawaan, dan *rest parameters* (`...`).

## 1. Percabangan yang Bersih dengan Pola *Guard Clause* (Early Return)

Percabangan `if / else if / else` dan `switch` adalah fondasi logika program. Namun, pemula sering menulis `if` bersarang terlalu dalam (*nested arrow anti-pattern*) yang sulit dibaca:

```js
// BURUK: Bersarang terlalu dalam sehingga inti logika terkubur di paling tengah
function prosesPesananLama(pesanan) {
  if (pesanan !== null && pesanan !== undefined) {
    if (pesanan.barang.length > 0) {
      if (pesanan.sudahDibayar) {
        return `Pesanan #${pesanan.id} siap dikirim.`;
      } else {
        return "Menunggu pembayaran.";
      }
    } else {
      return "Keranjang pesanan kosong.";
    }
  } else {
    return "Data pesanan tidak ditemukan.";
  }
}

// LEBIH BAIK: Gunakan Guard Clauses (kembalikan kasus gagal di awal fungsi!)
function prosesPesanan(pesanan) {
  if (!pesanan) return "Data pesanan tidak ditemukan.";
  if (pesanan.barang.length === 0) return "Keranjang pesanan kosong.";
  if (!pesanan.sudahDibayar) return "Menunggu pembayaran.";

  return `Pesanan #${pesanan.id} siap dikirim.`;
}
```

Dengan pola **Guard Clause**, semua kondisi tidak valid ditangani dan dihentikan di bagian atas fungsi, sehingga jalur sukses utama (*happy path*) berada di tingkat indentasi paling luar yang bersih.

## 2. Perulangan Modern: `for...of` vs `for` Klasik vs `for...in`

JavaScript menyediakan beberapa cara melakukan perulangan, namun masing-masing memiliki peruntukan yang tegas:

| Jenis Perulangan | Sintaks | Gunakan Untuk Apa? |
|---|---|---|
| **`for...of`** | `for (const item of daftar)` | **Pilihan utama untuk mengiterasi nilai** di dalam `Array`, `String`, `Map`, `Set`, atau `NodeList` DOM. Mendukung `break`, `continue`, dan `await`! |
| **`for` klasik** | `for (let i = 0; i < n; i++)` | Saat Anda benar-benar membutuhkan hitungan indeks angka manual (misalnya melompat 2 indeks sekaligus `i += 2` atau berjalan mundur). |
| **`Object.entries()` + `for...of`** | `for (const [kunci, nilai] of Object.entries(obj))` | **Pilihan terbaik untuk mengiterasi pasangan kunci dan nilai dari sebuah Objek (`{}`).** |
| **`for...in`** | `for (const kunci in obj)` | **Hindari untuk Array!** `for...in` mengiterasi kunci properti string (termasuk properti yang diwarisi dari rantai prototipe). |

```js
const modulKelas = ["Cara Web Bekerja", "Struktur HTML", "Teks Semantik"];

// 1. Mengiterasi nilai Array dengan for...of
for (const judul of modulKelas) {
  console.log(judul);
}

// 2. Jika Anda butuh nomor indeks SEKALIGUS nilainya di for...of, gunakan .entries():
for (const [indeks, judul] of modulKelas.entries()) {
  console.log(`Modul ${indeks + 1}: ${judul}`);
}
```

## 3. Fungsi sebagai Warga Kelas Satu (*First-Class Functions*)

Di JavaScript, fungsi bukanlah struktur kaku yang terpisah dari data, melainkan **warga kelas satu (*first-class citizens*)**. Artinya, sebuah fungsi dapat:
1. Disimpan di dalam variabel atau properti objek (`const hitung = function() {}`).
2. Dikirimkan sebagai argumen ke fungsi lain (disebut **Callback Function**).
3. Dikembalikan (*returned*) sebagai nilai hasil dari fungsi lain (disebut **Higher-Order Function**).

### Tiga Cara Mendefinisikan Fungsi dan Perbedaannya

```js
// 1. Function Declaration (Mengalami hoisting penuh: bisa dipanggil sebelum baris deklarasinya)
function hitungTotal(harga, jumlah = 1) {
  return harga * jumlah;
}

// 2. Function Expression (Disimpan ke variabel const; tidak bisa dipanggil sebelum baris ini)
const formatRupiah = function (nominal) {
  return `Rp${nominal.toLocaleString("id-ID")}`;
};

// 3. Arrow Function (Ringkas; ekspresi satu baris otomatis mengembalikan nilai tanpa kata kunci return)
const hitungPajak = (nominal, tarif = 0.11) => nominal * tarif;

// Catatan: Jika Arrow Function langsung mengembalikan objek literal {}, bungkus dengan tanda kurung ()!
const buatPengguna = (nama, peran) => ({ nama, peran, aktif: true });
```

### Perbedaan Teknis Penting: `function` Biasa vs Arrow Function (`=>`)
Arrow function **bukan** sekadar singkatan penulisan dari `function` biasa. Ada tiga perbedaan perilaku fundamental:
1. **Tidak memiliki ikatan `this` sendiri:** Arrow function mewarisi nilai `this` dari cakupan (*lexical scope*) di sekitarnya. Ini membuat arrow function **sangat ideal untuk callback** (di dalam `setTimeout`, `.map()`, atau `addEventListener` di dalam class), tetapi **tidak cocok untuk metode objek literal** yang perlu mengakses `this.properti` objek tersebut.
2. **Tidak dapat dipanggil dengan kata kunci `new`** (bukan *constructor*).
3. **Tidak memiliki objek implisit `arguments`** (sebagai gantinya, gunakan *rest parameters* `...args` yang jauh lebih modern).

## 4. Parameter Bawaan (*Default Parameters*) dan *Rest Parameters* (`...`)

### A. Parameter Bawaan yang Dievaluasi Saat Pemanggilan
Nilai bawaan parameter hanya digunakan jika argumen tidak dikirim atau bernilai **`undefined`** (jika Anda mengirim `null`, maka nilai `null` tetap dipakai):

```js
function buatKoneksi(host = "localhost", port = 5432) {
  return `postgres://${host}:${port}/kodeloka`;
}

console.log(buatKoneksi());                  // "postgres://localhost:5432/kodeloka"
console.log(buatKoneksi("db.internal"));     // "postgres://db.internal:5432/kodeloka"
console.log(buatKoneksi(undefined, 6432));   // "postgres://localhost:6432/kodeloka"
```

### B. Mengumpulkan Sisa Argumen dengan *Rest Parameters* (`...nama`)
Sintaks tiga titik (`...`) pada parameter terakhir sebuah fungsi mengumpulkan seluruh sisa argumen yang dikirimkan ke dalam sebuah **`Array` asli**:

```js
function catatLog(tingkat, ...pesan) {
  const gabungPesan = pesan.join(" | ");
  return `[${tingkat.toUpperCase()}] ${gabungPesan}`;
}

console.log(catatLog("info", "Server menyala", "Port 8080", "Mode produksi"));
// Keluaran: "[INFO] Server menyala | Port 8080 | Mode produksi"
```

## Latihan Praktik: Membuat Kalkulator Tagihan Fleksibel

Buatlah berkas `fungsi-tagihan.js` lalu jalankan dengan Node.js:
1. Buat fungsi `hitungTagihanAkhir(diskonPersen = 0, ...daftarHargaBarang)` yang menggunakan *guard clause* (mengembalikan `0` jika `daftarHargaBarang` kosong).
2. Gunakan perulangan `for...of` untuk menjumlahkan seluruh harga di dalam `daftarHargaBarang`.
3. Kurangi total dengan persentase diskon, tambahkan PPN 11%, dan kembalikan objek ringkasan `{ subtotal, diskonNominal, pajak, totalAkhir }`.

## Kuis Pemahaman

### Soal 1
Mengapa penulisan arrow function `const buatTitik = (x, y) => { x: x, y: y };` menghasilkan `undefined` (atau galat sintaks) alih-alih mengembalikan objek `{ x, y }`?
- A. Karena arrow function tidak diizinkan mengembalikan objek di JavaScript.
- B. Karena tanda kurung kurawal `{ ... }` tepat setelah tanda panah `=>` ditafsirkan oleh parser JavaScript sebagai pembuka blok tubuh fungsi (*function body*), bukan objek literal; untuk mengembalikan objek secara langsung, kurung kurawal harus dibungkus tanda kurung biasa: `({ x, y })`.
- C. Karena parameter `x` dan `y` belum diberi nilai bawaan.
- D. Karena arrow function wajib menggunakan kata kunci `function`.

**Jawaban Benar:** B
**Penjelasan:** Parser JavaScript menganggap `{` setelah `=>` sebagai awal blok kode multi-baris. Membungkusnya dengan tanda kurung lengkung `(x, y) => ({ x, y })` mengubahnya menjadi ekspresi objek literal yang langsung dikembalikan.

### Soal 2
Manakah cara yang paling tepat dan modern di JavaScript untuk melakukan perulangan terhadap nilai-nilai di dalam sebuah `Array` sambil tetap bisa menggunakan perintah `break` atau `await` di dalamnya?
- A. `for (const indeks in daftarArray)`
- B. `for (const item of daftarArray)`
- C. `daftarArray.forEach(...)`
- D. `Object.keys(daftarArray)`

**Jawaban Benar:** B
**Penjelasan:** Perulangan `for...of` mengiterasi nilai elemen secara langsung serta mendukung perintah `break`, `continue`, `return`, dan `await` (tidak seperti `.forEach()` yang tidak dapat dihentikan dengan `break` dan tidak menunggu `await`). Sementara itu, `for...in` mengiterasi kunci string dan tidak disarankan untuk `Array`.

### Soal 3
Perhatikan fungsi berikut:
```js
function sapa(nama = "Pengunjung") {
  return `Halo, ${nama}!`;
}
```
Apa nilai kembalian dari `sapa(undefined)` dan `sapa(null)`?
- A. Keduanya mengembalikan `"Halo, Pengunjung!"`.
- B. `sapa(undefined)` mengembalikan `"Halo, Pengunjung!"`, sedangkan `sapa(null)` mengembalikan `"Halo, null!"`.
- C. `sapa(undefined)` mengembalikan `"Halo, undefined!"`, sedangkan `sapa(null)` mengembalikan `"Halo, Pengunjung!"`.
- D. Keduanya memicu `TypeError`.

**Jawaban Benar:** B
**Penjelasan:** Parameter bawaan (*default parameters*) di JavaScript hanya diaktifkan apabila argumen tidak diberikan atau bernilai tepat `undefined`. Nilai `null` dianggap sebagai nilai eksplisit yang sah, sehingga tidak memicu parameter bawaan.

## Sumber
- [JavaScript Guide: Control flow and error handling — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [JavaScript Guide: Functions — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [ECMAScript Language Specification — TC39](https://tc39.es/ecma262/)
