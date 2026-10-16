# Pengantar JavaScript Modern, Tipe Data, dan Operator

- **Tingkat:** Dasar
- **Ringkasan:** Memahami peran mesin JavaScript (JIT), deklarasi variabel `const` dan `let`, tujuh tipe data primitif versus objek referensi, jebakan konversi tipe implisit, serta operator modern `===`, `??`, dan `?.`.

## Bagaimana JavaScript Bekerja di Peramban dan Server?

JavaScript adalah bahasa pemrograman berstandar **ECMAScript (ECMA-262)** yang menghidupkan halaman web di peramban sekaligus dapat berjalan di sisi server (melalui runtime seperti Node.js, Deno, atau Bun).

Meskipun sering disebut sebagai bahasa *interpreted*, mesin JavaScript modern (seperti **V8** di Chrome/Node.js, **SpiderMonkey** di Firefox, dan **JavaScriptCore** di Safari) menggunakan kompilasi **Just-In-Time (JIT)**: kode sumber Anda diurai menjadi *Abstract Syntax Tree (AST)*, diubah menjadi *bytecode* untuk dijalankan segera, dan bagian kode yang sering dipanggil (*hot functions*) dikompilasi langsung menjadi kode mesin asli yang sangat cepat!

## 1. Deklarasi Variabel: Utamakan `const`, Gunakan `let`, Tinggalkan `var`

Dalam JavaScript modern (sejak ES6/ES2015), kita mendeklarasikan pengikat nilai menggunakan **`const`** atau **`let`**:

| Kata Kunci | Cakupan (*Scope*) | Boleh Diisi Ulang (*Reassign*)? | Kapan Digunakan? |
|---|---|---|---|
| **`const`** | Blok (`{ ... }`) | **Tidak** (wajib langsung diberi nilai awal) | **Pilihan utama (90%+ kasus).** Menjamin variabel tidak tiba-tiba ditimpa nilainya di baris bawah. |
| **`let`** | Blok (`{ ... }`) | **Ya** | Hanya ketika nilainya memang harus berubah (misalnya penghitung di dalam perulangan `for` atau akumulator). |
| **`var`** | Fungsi | Ya | **Jangan digunakan di kode baru.** Tidak menghormati blok `if`/`for` dan rentan menimbulkan bug akibat *hoisting*. |

> **⚠️ Kesalahpahaman Umum tentang `const` pada Objek dan Array:**
> `const` mengunci **ikatannya (referensi variabelnya)**, bukan membekukan isi objek di dalamnya!
> ```js
> const konfigurasi = { port: 8080, mode: "produksi" };
>
> // VALID: Mengubah properti di dalam objek yang ditunjuk oleh const
> konfigurasi.port = 9000;
>
> // GALAT (TypeError: Assignment to constant variable): Menimpa variabel dengan objek baru
> // konfigurasi = { port: 3000 };
> ```
> Jika Anda ingin membekukan isi objek tingkat pertama agar tidak bisa diubah sama sekali, gunakan `Object.freeze(konfigurasi)`.

## 2. Tujuh Tipe Primitif vs Tipe Referensi (Objek)

Setiap nilai di JavaScript terbagi ke dalam dua kelompok besar:

### A. Tujuh Tipe Data Primitif (*Immutable / Disimpan berdasarkan Nilai*)
1. **`string`:** Teks karakter (`"Halo"`, `'Kodeloka'`, atau *template literal* `` `Baris ${nomor}` ``).
2. **`number`:** Bilangan IEEE 754 64-bit floating-point (mencakup bilangan bulat maupun desimal, serta nilai khusus `Infinity`, `-Infinity`, dan `NaN` / *Not-a-Number*).
3. **`bigint`:** Bilangan bulat dengan presisi tak terbatas untuk angka di atas batas aman `Number.MAX_SAFE_INTEGER` (`9007199254740991`), ditulis dengan akhiran `n` seperti `9007199254740993n`.
4. **`boolean`:** Nilai kebenaran logika `true` atau `false`.
5. **`undefined`:** Variabel yang sudah dideklarasikan atau properti yang belum diberi nilai.
6. **`null`:** Nilai kosong yang **disengaja** oleh pemrogram untuk menyatakan "tidak ada objek/nilai".
7. **`symbol`:** Pengenal unik yang tidak pernah bentrok (`Symbol("id")`).

### B. Tipe Referensi (`Object`, termasuk `Array`, `Function`, `Date`, `Map`, `Set`)
Berbeda dengan tipe primitif yang disalin nilainya secara independen, variabel bertipe objek menyimpan **alamat referensi memori**:

```js
// 1. Primitif: disalin nilainya
let a = 10;
let b = a;
b = 20;
console.log(a); // Tetap 10

// 2. Objek/Array: menyalin alamat referensi ke objek yang sama di memori!
const daftarAsli = ["HTML", "CSS"];
const rujukanSama = daftarAsli;
rujukanSama.push("JavaScript");

console.log(daftarAsli); // ["HTML", "CSS", "JavaScript"] — ikut berubah!
```

### Keunikan Operator `typeof` yang Wajib Anda Ketahui
```js
console.log(typeof "Kodeloka"); // "string"
console.log(typeof 42);         // "number"
console.log(typeof true);       // "boolean"
console.log(typeof undefined);  // "undefined"
console.log(typeof 100n);       // "bigint"

// JEBAKAN KLASIK SEJARAH JAVASCRIPT:
console.log(typeof null);       // "object" (Bug warisan sejak JS tahun 1995!)
// Untuk memeriksa null secara akurat, selalu gunakan: nilai === null
```

## 3. Konversi Tipe, Nilai *Falsy*, dan Mengapa Wajib Memakai `===`

JavaScript memiliki konsep **Truthy** dan **Falsy** ketika sebuah nilai dievaluasi di dalam kondisi boolean (seperti `if (nilai)`).

Hafalkan **8 nilai Falsy** ini (karena **semua nilai lain di luar 8 ini—termasuk array kosong `[]` dan objek kosong `{}`—adalah Truthy!**):
1. `false`
2. `0` (serta `-0` dan `0n`)
3. `""` (string kosong tanpa spasi)
4. `null`
5. `undefined`
6. `NaN`

### Selalu Gunakan Kesetaraan Ketat (`===` dan `!==`), Jangan `==`!
Operator kesetaraan longgar (`==`) melakukan pemaksaan tipe otomatis (*implicit type coercion*) dengan aturan yang membingungkan:

```js
// KEANEHAN OPERATOR LONGGAR (==):
console.log(0 == "");          // true! (karena "" diubah menjadi 0)
console.log(false == "0");     // true!
console.log(null == undefined);// true!

// STANDAR YANG BENAR: Gunakan === (memeriksa tipe data SEKALIGUS nilainya)
console.log(0 === "");         // false
console.log(false === "0");    // false
console.log(Number.isNaN(NaN));// true (Cara paling aman memeriksa NaN, karena NaN === NaN adalah false!)
```

Jika Anda perlu mengubah string menjadi angka secara eksplisit, gunakan **`Number(teks)`** atau **`Number.parseInt(teks, 10)`**, bukan mengandalkan konversi otomatis dari operator `+` yang sering menyambung string secara tidak sengaja (`"10" + 5` menghasilkan `"105"`!).

## 4. Operator Modern: Nullish Coalescing (`??`) dan Optional Chaining (`?.`)

### A. Mengapa `??` Lebih Aman daripada `||` untuk Nilai Bawaan?
Dulu, pengembang sering menggunakan operator OR (`||`) untuk memberi nilai bawaan: `const batas = inputPengguna || 10;`.
Masalahnya: operator `||` menganggap **semua nilai falsy** (termasuk angka `0` dan string kosong `""`) sebagai nilai yang harus diganti! Jadi jika pengguna sengaja memasukkan `inputPengguna = 0`, kode `0 || 10` justru mengubahnya menjadi `10`!

Operator **Nullish Coalescing (`??`)** (Baseline Widely Available) memperbaiki masalah ini karena **hanya mengganti nilai jika sisi kirinya bernilai `null` atau `undefined`**:

```js
const kuotaTersisa = 0;

console.log(kuotaTersisa || 100); // 100 (SALAH! Angka 0 yang sah malah tertimpa)
console.log(kuotaTersisa ?? 100); // 0   (BENAR! Karena 0 bukan null dan bukan undefined)
```

### B. Optional Chaining (`?.`)
Mengakses properti bersarang yang mungkin belum ada biasanya memicu galat fatal `TypeError: Cannot read properties of undefined`. Dengan **`?.`**, evaluasi langsung berhenti dengan aman dan mengembalikan `undefined` jika bagian di depannya bernilai `null` atau `undefined`:

```js
const responsServer = {
  pengguna: {
    profil: { nama: "Budi" }
  }
};

// Aman meskipun properti 'alamat' tidak ada: menghasilkan "Kota belum diisi"
const kota = responsServer.pengguna?.alamat?.kota ?? "Kota belum diisi";
console.log(kota);
```

## Latihan Praktik: Mengolah Konfigurasi Server dengan Aman

Buatlah berkas `tipe-dan-operator.js` lalu jalankan dengan `node tipe-dan-operator.js`:
1. Buat objek `konfigurasiMasukan` yang memiliki `{ host: "127.0.0.1", batasCobaUlang: 0, tls: null }`.
2. Gunakan operator `??` dan `?.` untuk menyusun objek `konfigurasiAktif` di mana `batasCobaUlang` tetap bernilai `0` (tidak tertimpa menjadi nilai bawaan `3`), `port` bernilai bawaan `8080` karena tidak ada di masukan, dan `sertifikatTls` membaca `konfigurasiMasukan.tls?.jalurBerkas ?? "/etc/ssl/default.pem"`.
3. Cetak hasilnya dengan `console.log(konfigurasiAktif)`.

## Kuis Pemahaman

### Soal 1
Perhatikan kode berikut:
```js
const diskonPersen = 0;
const hasilA = diskonPersen || 15;
const hasilB = diskonPersen ?? 15;
```
Berapakah nilai dari `hasilA` dan `hasilB`?
- A. `hasilA` adalah `0`, dan `hasilB` adalah `0`.
- B. `hasilA` adalah `15`, dan `hasilB` adalah `0`.
- C. `hasilA` adalah `0`, dan `hasilB` adalah `15`.
- D. `hasilA` adalah `15`, dan `hasilB` adalah `15`.

**Jawaban Benar:** B
**Penjelasan:** Operator logika `||` mengembalikan operan kanan jika operan kiri bersifat *falsy* (dan angka `0` termasuk *falsy*), sehingga `hasilA` menjadi `15`. Sebaliknya, operator *nullish coalescing* `??` hanya mengembalikan operan kanan jika operan kiri bernilai `null` atau `undefined`, sehingga angka `0` dipertahankan pada `hasilB`.

### Soal 2
Apa hasil dari evaluasi ekspresi `Boolean([])` dan `typeof null` di dalam JavaScript?
- A. `false` dan `"null"`
- B. `true` dan `"object"`
- C. `false` dan `"object"`
- D. `true` dan `"undefined"`

**Jawaban Benar:** B
**Penjelasan:** Di JavaScript, array kosong `[]` dan objek kosong `{}` adalah objek yang valid sehingga selalu bernilai *truthy* (`Boolean([]) === true`). Adapun `typeof null` mengembalikan `"object"` karena perilaku historis mesin JavaScript sejak versi pertamanya.

### Soal 3
Mengapa cara yang benar untuk memeriksa apakah sebuah nilai adalah `NaN` (*Not-a-Number*) adalah menggunakan `Number.isNaN(nilai)`, bukan `nilai === NaN`?
- A. Karena kata kunci `NaN` tidak boleh ditulis di sebelah kanan operator `===`.
- B. Karena menurut spesifikasi IEEE 754, `NaN` adalah satu-satunya nilai di JavaScript yang tidak sama dengan dirinya sendiri (`NaN === NaN` selalu menghasilkan `false`).
- C. Karena `nilai === NaN` selalu menghasilkan `true` untuk semua angka negatif.
- D. Karena `Number.isNaN()` mengubah nilai tersebut menjadi angka `0`.

**Jawaban Benar:** B
**Penjelasan:** Dalam standar bilangan titik-ambang IEEE 754 yang diadopsi ECMAScript, perbandingan `NaN === NaN` selalu bernilai `false`. Fungsi `Number.isNaN(nilai)` memeriksa secara presisi apakah nilai tersebut bertipe `number` dan bernilai `NaN`.

## Sumber
- [JavaScript Guide: Grammar and types — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Standard built-in objects — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)
- [ECMAScript Language Specification — TC39](https://tc39.es/ecma262/)
