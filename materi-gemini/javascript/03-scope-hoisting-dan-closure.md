# Lexical Scope, Temporal Dead Zone (TDZ), dan Closure

- **Tingkat:** Menengah
- **Ringkasan:** Memahami aturan visibilitas variabel melalui *lexical scoping*, mengapa `let` dan `const` memiliki *Temporal Dead Zone*, serta bagaimana fungsi mempertahankan akses ke lingkungannya melalui mekanisme **Closure** beserta penerapannya di dunia nyata.

## 1. Lexical Scope (Cakupan Leksikal)

Di JavaScript, visibilitas suatu variabel ditentukan oleh **lokasi fisik tempat variabel dan fungsi tersebut ditulis di dalam kode sumber**—ini disebut **Lexical Scoping** (atau *Static Scoping*).

Bayangkan *scope* seperti kaca satu arah dari dalam ruangan ke luar:
- **Kode di cakupan dalam (*inner scope*)** selalu dapat melihat dan mengakses variabel yang berada di cakupan luarnya (*outer/parent scope*).
- **Kode di cakupan luar (*outer scope*)** **tidak pernah** dapat mengintip variabel yang dideklarasikan di dalam cakupan anak!

```js
const namaAplikasi = "Kodeloka"; // 1. Global / Module Scope

function tampilkanKelas(namaKelas) {
  // 2. Function Scope: bisa mengakses 'namaAplikasi' dan 'namaKelas'
  const prefix = "[KELAS]";

  if (namaKelas === "JavaScript") {
    // 3. Block Scope: bisa mengakses 'prefix', 'namaKelas', dan 'namaAplikasi'
    const tingkat = "Menengah";
    console.log(`${prefix} ${namaAplikasi} - ${namaKelas} (${tingkat})`);
  }

  // ReferenceError! 'tingkat' hanya hidup di dalam blok kurung kurawal if { ... }
  // console.log(tingkat);
}
```

### Rantai Cakupan (*Scope Chain*)
Ketika Anda menggunakan sebuah variabel di dalam fungsi, mesin JavaScript mencarinya secara berjenjang ke atas:
`Cakupan Blok Saat Ini -> Cakupan Fungsi Induk -> Cakupan Fungsi Luar -> Cakupan Modul/Global`.
Begitu variabel ditemukan di salah satu lapis terdekat, pencarian berhenti. Jika sampai ke puncak global tetap tidak ditemukan, mesin melempar **`ReferenceError: x is not defined`**.

## 2. Hoisting dan *Temporal Dead Zone (TDZ)*

Istilah **Hoisting** merujuk pada cara mesin JavaScript mendaftarkan seluruh deklarasi variabel dan fungsi ke dalam memori cakupan sebelum mengeksekusi kode baris demi baris.

Namun, perilaku pendaftaran ini sangat berbeda antara `function`, `var`, dan `let`/`const`:

| Deklarasi | Apakah Terdaftar di Awal Scope? | Nilai Awal Sebelum Baris Deklarasinya Dieksekusi | Apa yang Terjadi Jika Diakses Sebelum Baris Deklarasinya? |
|---|---|---|---|
| `function nama() {}` | Ya | Fungsi utuh siap pakai | **Berhasil dijalankan** dengan normal. |
| `var x = 10;` | Ya (di tingkat fungsi) | Diinisialisasi sebagai `undefined` | Menghasilkan **`undefined`** secara diam-diam (sumber bug yang membingungkan!). |
| `let x = 10;` / `const y = 20;` | Ya (di tingkat blok) | **Belum diinisialisasi (*Uninitialized*)** | Langsung melempar **`ReferenceError: Cannot access 'x' before initialization`**! |

Rentang baris sejak awal blok `{` hingga baris tempat `let` atau `const` dideklarasikan disebut **Temporal Dead Zone (TDZ)**:

```js
{
  // --- Awal Temporal Dead Zone (TDZ) untuk variabel 'tarif' ---
  // console.log(tarif); // ReferenceError! Aman dari bug pemakaian variabel sebelum waktunya.

  const tarif = 15000;   // --- Akhir TDZ: 'tarif' resmi diinisialisasi ---
  console.log(tarif);    // 15000
}
```

## 3. Apa Itu Closure dan Bagaimana Cara Kerjanya?

**Closure** adalah salah satu konsep paling kuat di JavaScript. Definisi resminya menurut [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures):

> **Closure** adalah gabungan dari sebuah fungsi beserta bundel referensi ke lingkungan leksikal (*lexical environment*) tempat fungsi tersebut diciptakan.

Secara sederhana: **ketika sebuah fungsi dalam (*inner function*) dikembalikan keluar dari fungsi induknya, fungsi dalam tersebut membawa "tas ransel" berisi variabel-variabel milik fungsi induk yang masih ia butuhkan**, sehingga variabel-variabel tersebut tidak dihapus oleh *Garbage Collector* meskipun fungsi induknya sudah selesai dijalankan!

```text
buatPenghitung(awal = 0) selesai dijalankan, TETAPI:
+-------------------------------------------------------+
| Fungsi yang dikembalikan (tambah)                     |
|   │                                                   |
|   └── [Tas Ransel / Closure Environment]              |
|         └── let nilai = 0  (Privat! Tidak bisa        |
|                             diakses langsung dari luar)|
+-------------------------------------------------------+
```

### Contoh Nyata 1: Mengemas State Privat (*Data Encapsulation*)

```js
function buatDompet(saldoAwal = 0) {
  // Variabel 'saldo' bersifat PRIVAT di dalam closure ini.
  // Kode di luar tidak bisa mengubah 'saldo = 999999999' secara langsung!
  let saldo = saldoAwal;

  return {
    lihatSaldo() {
      return saldo;
    },
    setor(jumlah) {
      if (jumlah <= 0) throw new Error("Jumlah setoran harus lebih dari 0.");
      saldo += jumlah;
      return saldo;
    },
    tarik(jumlah) {
      if (jumlah > saldo) throw new Error("Saldo tidak mencukupi.");
      saldo -= jumlah;
      return saldo;
    }
  };
}

const dompetBudi = buatDompet(100_000);
dompetBudi.setor(50_000);
console.log(dompetBudi.lihatSaldo()); // 150000
console.log(dompetBudi.saldo);        // undefined (Terlindungi!)
```

### Contoh Nyata 2: Fungsi Pabrik (*Function Factory*) dan Pembatas Frekuensi (*Debounce*)

Di antarmuka web, saat pengguna mengetik di kotak pencarian, kita tidak ingin menembakkan permintaan API `fetch()` pada setiap ketukan huruf. Fungsi **`debounce`** menggunakan *closure* untuk menyimpan ID pengatur waktu (`timerId`) di antara ketukan huruf:

```js
function buatDebounce(fungsiTarget, jedaMs = 300) {
  let timerId = null; // Disimpan di dalam closure!

  return function (...argumen) {
    // Batalkan jadwal sebelumnya jika pengguna masih terus mengetik
    clearTimeout(timerId);

    // Jadwalkan ulang eksekusi setelah pengguna berhenti mengetik selama jedaMs
    timerId = setTimeout(() => {
      fungsiTarget(...argumen);
    }, jedaMs);
  };
}
```

## 4. Jebakan Klasik Closure di Dalam Perulangan (`var` vs `let`)

Mengapa dulu `setTimeout` di dalam perulangan `for (var i = 0; ...)` selalu mencetak angka terakhir yang sama?
- Karena **`var` memiliki cakupan fungsi**, sehingga semua callback `setTimeout` berbagi **satu variabel `i` yang sama** di dalam closure mereka!
- Sebaliknya, **`let` memiliki cakupan blok**, dan JavaScript menciptakan **ikatan variabel `i` yang baru dan terpisah untuk setiap putaran iterasi**:

```js
// BENAR: Menggunakan 'let' menciptakan ikatan closure tersendiri di tiap iterasi (mencetak 1, 2, 3)
for (let i = 1; i <= 3; i++) {
  setTimeout(() => {
    console.log(`Iterasi ke-${i}`);
  }, i * 100);
}
```

## Latihan Praktik: Membangun Fungsi *Memoization* (Cache Hasil Perhitungan) dengan Closure

Buatlah berkas `closure-cache.js` dan jalankan dengan Node.js:
1. Buat fungsi `denganCache(fungsiHitung)` yang menyimpan sebuah `const tembolok = new Map()` di dalam closure-nya.
2. Fungsi yang dikembalikan menerima satu argumen `input`. Jika `tembolok.has(input)` bernilai `true`, langsung kembalikan nilai dari `tembolok.get(input)` tanpa menjalankan ulang `fungsiHitung`.
3. Jika belum ada, jalankan `const hasil = fungsiHitung(input)`, simpan ke `tembolok.set(input, hasil)`, lalu kembalikan `hasil`.

## Kuis Pemahaman

### Soal 1
Apa yang dimaksud dengan *Temporal Dead Zone (TDZ)* pada variabel yang dideklarasikan dengan `let` atau `const`?
- A. Waktu jeda 5 detik sebelum memori variabel dibersihkan oleh *Garbage Collector*.
- B. Area kode sejak awal blok `{` hingga baris tempat variabel `let`/`const` dideklarasikan, di mana upaya mengakses variabel tersebut akan langsung melempar `ReferenceError`.
- C. Kondisi ketika peramban membeku akibat perulangan tanpa henti.
- D. Variabel global yang tidak pernah digunakan di dalam program.

**Jawaban Benar:** B
**Penjelasan:** Variabel `let` dan `const` sebenarnya sudah dikenali keberadaannya di awal blok oleh mesin JavaScript, tetapi tetap berstatus *uninitialized* sampai baris deklarasinya dieksekusi. Zona sebelum baris inisialisasi inilah yang disebut TDZ untuk mencegah penggunaan variabel sebelum waktunya.

### Soal 2
Perhatikan potongan kode berikut:
```js
function buatPengali(faktor) {
  return (angka) => angka * faktor;
}
const kaliTiga = buatPengali(3);
console.log(kaliTiga(7));
```
Mengapa pemanggilan `kaliTiga(7)` masih dapat mengetahui bahwa nilai `faktor` adalah `3`, padahal fungsi `buatPengali(3)` sudah selesai dijalankan sebelumnya?
- A. Karena JavaScript menyalin variabel `faktor` ke dalam `localStorage` peramban.
- B. Karena arrow function yang dikembalikan membentuk *closure* yang mempertahankan referensi ke lingkungan leksikal tempat ia dibuat (termasuk parameter `faktor = 3`).
- C. Karena semua parameter fungsi di JavaScript bersifat variabel global.
- D. Karena `kaliTiga` menjalankan ulang fungsi `buatPengali` dari awal.

**Jawaban Benar:** B
**Penjelasan:** Inilah inti dari *closure*: fungsi dalam `(angka) => angka * faktor` mempertahankan rujukan ke *lexical environment* milik pemanggilan `buatPengali(3)`, sehingga nilai `faktor` tetap hidup di memori selama fungsi `kaliTiga` masih ada.

### Soal 3
Apa perbedaan hasil antara menggunakan `for (var i = 0; i < 3; i++)` dan `for (let i = 0; i < 3; i++)` apabila di dalam blok perulangan tersebut terdapat callback asinkron `setTimeout(() => console.log(i), 50)`?
- A. `var` mencetak `0, 1, 2`, sedangkan `let` mencetak `3, 3, 3`.
- B. `var` mencetak `3, 3, 3` (karena hanya ada satu variabel `i` di tingkat fungsi yang nilainya sudah menjadi `3` saat callback berjalan), sedangkan `let` mencetak `0, 1, 2` (karena `let` membuat ikatan variabel `i` baru untuk setiap putaran iterasi blok).
- C. Keduanya selalu mencetak `0, 1, 2`.
- D. `let` tidak boleh digunakan bersama `setTimeout`.

**Jawaban Benar:** B
**Penjelasan:** Deklarasi `let` di kepala perulangan `for` memiliki perilaku khusus dalam spesifikasi ECMAScript: setiap kali iterasi berputar, ikatan (*binding*) leksikal baru untuk `i` diciptakan dengan nilai iterasi saat itu, sehingga tiap callback menutup (*close over*) nilai `i` miliknya masing-masing.

## Sumber
- [Closures — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- [JavaScript execution model — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
- [ECMAScript Language Specification — TC39](https://tc39.es/ecma262/)
