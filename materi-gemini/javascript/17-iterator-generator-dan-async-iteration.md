# Protokol Iterator, Fungsi Generator (`function*` / `yield`), dan `for await...of`

- **Tingkat:** Lanjut
- **Ringkasan:** Memahami bagaimana perulangan `for...of` bekerja di balik layar melalui protokol *Iterable/Iterator*, menghasilkan deret data malas (*lazy evaluation*) yang hemat memori menggunakan fungsi Generator (`function*` dan `yield`), memanfaatkan *Iterator Helpers* baru, serta memproses aliran data asinkron dengan `for await...of`.

## 1. Mengapa `Array`, `String`, `Map`, dan `Set` Semuanya Bisa Di-`for...of`?

Pernahkah Anda bertanya bagaimana satu sintaks `for (const x of koleksi)` dan operator spread `[...koleksi]` dapat bekerja pada struktur data yang berbeda-beda seperti `Array`, `Map`, `Set`, hingga `NodeList`?

Jawabannya adalah karena semuanya mengimplementasikan **Iterable Protocol**:
- Sebuah objek disebut **Iterable** jika ia memiliki metode dengan kunci simbol khusus **`[Symbol.iterator]()`**.
- Ketika `for...of` dijalankan, JavaScript memanggil `[Symbol.iterator]()` tersebut untuk mendapatkan objek **Iterator**, yaitu objek yang memiliki metode **`.next()`** yang pada setiap langkahnya mengembalikan `{ value: ..., done: false }` hingga berakhir di `{ value: undefined, done: true }`!

## 2. Fungsi Generator (`function*` dan `yield`): Evaluasi Malas (*Lazy Evaluation*)

Membuat objek iterator secara manual dengan menulis metode `.next()` cukup bertele-tele. Sebagai gantinya, JavaScript menyediakan **Generator Function (`function*`)**!

Berbeda dengan fungsi biasa yang sekali dipanggil langsung berjalan sampai tuntas (`return`), fungsi generator (`function*`):
1. Saat dipanggil, ia **tidak langsung menjalankan kodenya**, melainkan mengembalikan sebuah objek **Generator (yang sekaligus merupakan Iterable dan Iterator)**.
2. Setiap kali nilai berikutnya diminta (misalnya oleh putaran `for...of` atau `.next()`), fungsi berjalan sampai menemui kata kunci **`yield`**, menyerahkan nilai tersebut, lalu **membekukan posisinya (*pause*) tanpa memakan CPU** sampai nilai berikutnya diminta lagi!

```js
// Menghasilkan urutan ID atau rentang angka secara malas (Lazy) —
// meskipun batasAkhir = 1_000_000_000, memori RAM yang terpakai hanya beberapa byte
// karena angka dibuat satu per satu saat dibutuhkan, BUKAN membuat Array 1 miliar elemen!
function* buatRentang(mulai, akhir, langkah = 1) {
  for (let angka = mulai; angka <= akhir; angka += langkah) {
    yield angka;
  }
}

for (const n of buatRentang(10, 30, 10)) {
  console.log(n); // Mencetak 10, lalu 20, lalu 30
}
```

### *Iterator Helpers* Modern (Baseline Newly Available)
Dulu, untuk melakukan `.map()`, `.filter()`, atau mengambil 5 elemen pertama (`.take(5)`) pada hasil generator, kita terpaksa mengubahnya menjadi `Array` dulu dengan `[...gen]` (yang menghilangkan keunggulan hemat memorinya!).

Kini, `Iterator.prototype` telah dilengkapi metode **Iterator Helpers** yang bekerja secara malas (*lazy*):
- **`iterator.map(fn)`**
- **`iterator.filter(fn)`**
- **`iterator.take(jumlahMaks)`** dan **`iterator.drop(jumlahLewati)`**
- **`iterator.toArray()`** (mengubah hasil akhirnya saja menjadi Array).

```js
function* bilanganAsliMulaiDari(awal = 1) {
  let n = awal;
  while (true) {
    yield n++; // Perulangan tak terbatas yang 100% aman karena bersifat lazy!
  }
}

// Mengambil 4 bilangan kuadrat genap pertama dari deret tak terbatas:
const empatKuadratGenap = bilanganAsliMulaiDari(1)
  .filter((n) => n % 2 === 0)
  .map((n) => n * n)
  .take(4)
  .toArray();

console.log(empatKuadratGenap); // [4, 16, 36, 64]
```

## 3. Async Generators (`async function*`) dan `for await...of`

Bagaimana jika setiap langkah di dalam deret data membutuhkan operasi asinkron—seperti **mengambil halaman API yang dipaginasi (`?page=1`, `?page=2`, `?page=3`) satu per satu** atau membaca aliran respons (*ReadableStream*)?

Gabungkan `async` dengan `function*` menjadi **Async Generator (`async function*`)**, dan konsumsilah hasilnya dengan sangat bersih menggunakan **`for await (const item of ...)`**:

```js
// Mengambil data API berhalaman (paginated API) secara bertahap sesuai kebutuhan:
async function* ambilSemuaHalamanModul(urlDasar) {
  let halaman = 1;

  while (true) {
    const res = await fetch(`${urlDasar}?page=${halaman}`);
    if (!res.ok) throw new Error(`Gagal memuat halaman ${halaman}`);

    const body = await res.json();
    if (!body.data || body.data.length === 0) {
      break; // Berhenti jika data sudah habis
    }

    // Serahkan potongan data halaman ini ke pemanggil
    yield body.data;

    if (!body.adaHalamanBerikutnya) break;
    halaman++;
  }
}

// Pemanggil cukup menggunakan 'for await...of' (dan bisa langsung 'break' kapan saja
// tanpa membuang kuota jaringan untuk halaman-halaman sisanya!):
async function cariModulPertamaYangCocok(kata) {
  for await (const daftarModulHalamanIni of ambilSemuaHalamanModul("/api/modul")) {
    const ketemu = daftarModulHalamanIni.find((m) => m.judul.includes(kata));
    if (ketemu) {
      return ketemu; // Begitu return/break, halaman API berikutnya tidak akan di-fetch!
    }
  }
  return null;
}
```

## Latihan Praktik: Membagi Pemrosesan Data Besar dengan Generator *Chunking*

Buatlah berkas `generator-chunk.js` dan jalankan dengan Node.js:
1. Buat fungsi generator `function* bagiMenjadiPotongan(daftar, ukuranPotongan)` yang menggunakan `yield daftar.slice(i, i + ukuranPotongan)` untuk memecah array besar menjadi kelompok-kelompok kecil tanpa menduplikasi seluruh array sekaligus.
2. Buat *async generator* `async function* prosesBatch(daftar, ukuran)` yang memberi jeda simulasi `50ms` per potongan, lalu konsumsi dengan `for await...of`.

## Kuis Pemahaman

### Soal 1
Apa yang terjadi pada saat sebuah fungsi generator `function* hitung() { console.log("Mulai"); yield 1; }` pertama kali dipanggil dengan `const gen = hitung();` (sebelum `gen.next()` atau `for...of` dijalankan)?
- A. Teks `"Mulai"` langsung tercetak di konsol dan `gen` bernilai angka `1`.
- B. Tidak ada satu baris pun isi di dalam tubuh fungsi `hitung()` yang dieksekusi; pemanggilan `hitung()` hanya mengembalikan sebuah objek *Generator* dalam keadaan terjeda (*suspended*) yang siap dijalankan saat `.next()` atau `for...of` dipanggil.
- C. Fungsi berjalan dalam utas latar belakang secara otomatis.
- D. Mesin JavaScript melempar galat karena tidak ada pernyataan `return`.

**Jawaban Benar:** B
**Penjelasan:** Memanggil fungsi generator tidak langsung mengeksekusi tubuh fungsinya, melainkan mengembalikan objek *Generator* (iterator). Eksekusi baru dimulai ketika konsumen meminta nilai pertama melalui `.next()` atau `for...of`.

### Soal 2
Mengapa menulis `while (true) { yield n++; }` di dalam sebuah `function*` tidak menyebabkan peramban membeku (*infinite loop*), asalkan dikonsumsi dengan `.take(5)` atau dihentikan dengan `break` di dalam `for...of`?
- A. Karena JavaScript otomatis menghentikan semua `while (true)` setelah 100 putaran.
- B. Karena setiap kali eksekusi mencapai pernyataan `yield`, fungsi generator langsung dijeda (*paused*) dan mengembalikan kendali ke pemanggil; putaran berikutnya hanya berjalan jika pemanggil meminta nilai selanjutnya.
- C. Karena `yield` menghapus variabel `n` dari memori.
- D. Karena `function*` hanya berjalan di sisi server.

**Jawaban Benar:** B
**Penjelasan:** Evaluasi pada generator bersifat malas (*lazy / on-demand*). Berbeda dengan perulangan `while (true)` biasa yang memonopoli Call Stack tanpa henti, `yield` menangguhkan bingkai eksekusi generator hingga nilai berikutnya benar-benar diminta.

### Soal 3
Sintaks manakah yang digunakan untuk melakukan perulangan terhadap nilai-nilai yang dihasilkan oleh sebuah **Async Generator (`async function*`)**?
- A. `for (const item of asyncGen())`
- B. `for await (const item of asyncGen())`
- C. `asyncGen().forEach(await item => ...)`
- D. `await Promise.all(asyncGen())`

**Jawaban Benar:** B
**Penjelasan:** Sebuah `async function*` mengembalikan *AsyncGenerator* yang metode `.next()`-nya menghasilkan `Promise<{ value, done }>`. Pernyataan `for await (const item of ...)` menunggu penyelesaian setiap Promise secara berurutan di tiap putaran iterasi.

## Sumber
- [Iterators and generators — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators)
- [Control abstraction objects (`Generator`, `AsyncGenerator`) — TC39 ECMAScript Specification](https://tc39.es/ecma262/multipage/control-abstraction-objects.html)
