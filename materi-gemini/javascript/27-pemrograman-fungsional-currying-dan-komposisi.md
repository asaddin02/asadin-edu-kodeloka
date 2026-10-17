# Pemrograman Fungsional di JavaScript: Pure Functions, Immutability, Currying, dan Pipe

- **Tingkat:** Menengah
- **Ringkasan:** Menerapkan paradigma pemrograman fungsional dalam JavaScript modern melalui fungsi murni (*pure functions*) tanpa efek samping, ketidakberubahan data (*immutability*), aplikasi parsial (*currying*), memoization, serta komposisi fungsi (`pipe` dan `compose`).

## Mengapa Pola Pemrograman Fungsional Membuat Kode Lebih Mudah Diuji dan Dilacak?

Sebagian besar bug yang sulit direproduksi di aplikasi berskala besar berakar dari **mutasi status bersama (*shared mutable state*)**: sebuah fungsi diam-diam mengubah isi array atau objek argumen yang diterimanya, sehingga komponen lain yang masih memegang referensi ke objek tersebut ikut berubah tanpa disadari.

Pemrograman fungsional (*Functional Programming* / FP) mengatasi masalah ini dengan memperlakukan transformasi data sebagai rangkaian **fungsi murni (*pure functions*)** yang menerima data masukan dan mengembalikan data baru (*immutable*) tanpa mengubah data aslinya.

> **⚠️ Jebakan Umum di Lapangan:** Memodifikasi parameter objek/array yang diterima di dalam argumen fungsi secara langsung (*in-place mutation*) merusak kemurnian fungsi (*pure function*) dan memicu bug tersembunyi di bagian aplikasi lain yang masih memegang referensi ke objek yang sama.

## 1. Dua Syarat Mutlak Fungsi Murni (*Pure Function*) dan Ketidakberubahan (*Immutability*)

Sebuah fungsi disebut sebagai **fungsi murni (*pure function*)** apabila memenuhi dua syarat:
1. **Deterministik (*Referential Transparency*):** Untuk argumen masukan yang sama, fungsi tersebut **selalu** mengembalikan keluaran yang sama persis, tanpa bergantung pada variabel luar yang berubah-ubah, waktu saat ini (`Date.now()`), atau angka acak (`Math.random()`).
2. **Bebas Efek Samping (*No Side Effects*):** Fungsi tidak memutasi argumen objek/array yang diterimanya, tidak mengubah variabel di luar cakupannya, dan tidak melakukan operasi I/O (seperti `fetch()`, menulis DOM, atau mengubah `localStorage`).

Untuk menjaga sifat *immutability* saat mengolah array dan objek di JavaScript modern (ES2023+), gunakan metode tak-mutasi bawaan alih-alih metode lama yang merusak array asli:

| Operasi | Metode Lama (Memutasi Array Asli — Hindari di FP) | Metode Modern Tak-Mutasi (Mengembalikan Salinan Baru) |
| :--- | :--- | :--- |
| **Mengurutkan elemen** | `daftar.sort(fn)` | **`daftar.toSorted(fn)`** |
| **Membalik urutan** | `daftar.reverse()` | **`daftar.toReversed()`** |
| **Menyisipkan / menghapus di tengah** | `daftar.splice(idx, hapus, ...item)` | **`daftar.toSpliced(idx, hapus, ...item)`** |
| **Mengganti 1 elemen pada indeks** | `daftar[idx] = nilaiBaru` | **`daftar.with(idx, nilaiBaru)`** |
| **Mengubah properti objek** | `obj.status = "aktif"` | **`{ ...obj, status: "aktif" }`** (atau `structuredClone(obj)` untuk objek bersarang) |

## 2. *Currying*, *Memoization*, dan Komposisi Fungsi (`pipe` vs `compose`)

- **Currying:** Mengubah fungsi yang menerima banyak argumen `f(a, b)` menjadi rangkaian fungsi satu argumen `f(a)(b)` agar mudah dikhususkan (*partial application*).
- **Komposisi Fungsi (`pipe`):** Menggabungkan beberapa fungsi kecil satu-argumen menjadi satu pipa pemrosesan yang mengalir dari kiri ke kanan (`pipe(f, g, h)(x)` setara dengan `h(g(f(x)))`):

```javascript
export const pipe = (...fungsi) => (input) => fungsi.reduce((akum, fn) => fn(akum), input);
export const compose = (...fungsi) => (input) => fungsi.reduceRight((akum, fn) => fn(akum), input);

const bersihkanSpasi = (teks) => teks.trim();
const keHurufKecil = (teks) => teks.toLowerCase();
const gantiSpasiDenganStrip = (teks) => teks.replaceAll(/\s+/g, "-");

// Currying: fungsi pembatas panjang yang menghasilkan fungsi baru
const batasiPanjang = (maks) => (teks) => teks.slice(0, maks);

const buatSlug = pipe(
  bersihkanSpasi,
  keHurufKecil,
  gantiSpasiDenganStrip,
  batasiPanjang(35)
);

console.log(buatSlug("  Belajar JavaScript Modern 2026  "));
// "belajar-javascript-modern-2026"
```

Karena fungsi murni selalu menghasilkan keluaran yang sama untuk argumen yang sama, hasil perhitungannya yang berat dapat disimpan di cache menggunakan teknik **Memoization**:

```javascript
export function memoizeSatuArgumen(fnMurni) {
  const cache = new Map();
  return (arg) => {
    if (cache.has(arg)) return cache.get(arg);
    const hasil = fnMurni(arg);
    cache.set(arg, hasil);
    return hasil;
  };
}
```

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Memanggil `.sort()` langsung pada parameter array di dalam fungsi pemformat:** `function ambil TigaTeratas(skor) { return skor.sort((a, b) => b - a).slice(0, 3); }` terlihat bersih, tetapi `.sort()` telah mengacak-acak urutan array `skor` milik pemanggil! Gunakan **`skor.toSorted((a, b) => b - a).slice(0, 3)`**.
2. **Menerapkan `memoize` pada fungsi yang tidak murni atau menerima objek baru setiap kali dipanggil:** Jangan pernah me-memoize fungsi yang melakukan `fetch()` atau bergantung pada waktu, dan ingat bahwa `cache.has(obj)` menggunakan kesamaan referensi objek.
3. **Menyangka spread `{ ...obj }` menyalin objek bersarang secara mendalam (*deep copy*):** Spread satu tingkat hanya melakukan *shallow copy*. Jika Anda mengubah `salinan.alamat.kota = "Bandung"`, objek asli tetap ikut berubah! Salin juga tingkat di dalamnya (`{ ...obj, alamat: { ...obj.alamat, kota: "Bandung" } }`) atau gunakan `structuredClone()`.

## Latihan Praktik Mandiri

1. Buat berkas `fp-katalog.mjs` yang mengekspor fungsi `olahKatalogProduk(daftarProduk, minHarga, persenDiskon)` tanpa memutasi `daftarProduk` asli sama sekali (gunakan `.filter()`, `.map()` dengan objek baru, dan `.toSorted()`).
2. Buat utilitas `pipe()` dan rangkai 3 fungsi transformasi teks murni untuk menormalkan masukan pencarian pengguna.
3. Tulis pengujian `node:test` yang memastikan array `daftarProduk` asli sebelum dan sesudah pemanggilan `olahKatalogProduk` tetap identik (`assert.deepStrictEqual`).

## Kuis Pemahaman

### Soal 1
Mengapa memanggil `daftar.sort()` atau `daftar.splice()` secara langsung terhadap parameter array di dalam sebuah fungsi melanggar prinsip fungsi murni (*pure function*)?
- A. Karena `.sort()` dan `.splice()` hanya bekerja pada array angka
- B. Karena kedua metode tersebut memutasi (mengubah) array asli di tempat (*in-place*), sehingga menimbulkan efek samping terhadap kode lain di luar fungsi yang masih memegang referensi ke array tersebut
- C. Karena `.sort()` membutuhkan koneksi jaringan
- D. Karena `.splice()` mengembalikan objek `Promise`

**Jawaban Benar:** B
**Penjelasan:** Metode `.sort()`, `.reverse()`, dan `.splice()` mengubah array asal secara langsung. Di JavaScript modern (ES2023+), gunakan versi tak-mutasinya: `.toSorted()`, `.toReversed()`, dan `.toSpliced()`.

### Soal 2
Manakah di antara fungsi berikut yang merupakan **fungsi murni** (*pure function*)?
- A. `const tambah = (a, b) => a + b;`
- B. `const acak = (batas) => Math.random() * batas;`
- C. `const catat = (nilai) => { console.log(nilai); return nilai; };`
- D. `const tambahItem = (daftar, item) => { daftar.push(item); return daftar; };`

**Jawaban Benar:** A
**Penjelasan:** Fungsi murni selalu mengembalikan hasil yang sama untuk argumen yang sama dan tidak menimbulkan efek samping. `tambah` memenuhi keduanya. `acak` menghasilkan nilai yang berubah-ubah, `catat` menulis ke konsol (efek samping), dan `tambahItem` memutasi array masukan.

### Soal 3
Apa perbedaan urutan eksekusi antara `pipe(f, g, h)(x)` dan `compose(f, g, h)(x)` dalam pola komposisi fungsi?
- A. `pipe` mengeksekusi fungsi dari kiri ke kanan (`h(g(f(x)))` menggunakan `reduce`), sedangkan `compose` mengeksekusi fungsi dari kanan ke kiri (`f(g(h(x)))` menggunakan `reduceRight`)
- B. `pipe` berjalan secara asinkron, sedangkan `compose` berjalan secara sinkron
- C. `pipe` hanya menerima maksimal 2 fungsi, sedangkan `compose` tak terbatas
- D. Keduanya mengeksekusi fungsi dalam urutan acak

**Jawaban Benar:** A
**Penjelasan:** `pipe` mengalirkan nilai dari fungsi pertama di kiri menuju fungsi terakhir di kanan (`reduce`), sedangkan `compose` mengikuti notasi komposisi matematika `f ∘ g ∘ h` dari kanan ke kiri (`reduceRight`).

## Sumber

- [`Array.prototype.reduce()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [Functions — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions)
