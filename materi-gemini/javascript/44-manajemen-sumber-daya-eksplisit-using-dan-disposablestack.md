# Manajemen Sumber Daya Eksplisit (ES2027): `using`, `await using`, dan `Symbol.dispose`

- **Tingkat:** Lanjut
- **Ringkasan:** Mengotomatiskan pelepasan sumber daya (koneksi berkas, transaksi database, kunci mutex, atau *event listener* sementara) secara deterministik begitu keluar dari cakupan blok `{ ... }` menggunakan deklarasi **`using`**, **`await using`**, **`Symbol.dispose`**, dan **`DisposableStack`**.

## Mengapa *Garbage Collector* Tidak Cukup untuk Menutup Koneksi atau Melepas Kunci?

*Garbage Collector* (GC) di JavaScript sangat pintar membersihkan memori objek yang sudah tidak dirujuk lagi. Namun, GC bekerja secara **non-deterministik**: Anda tidak pernah tahu kapan GC akan berjalan—bisa 10 milidetik lagi, bisa 5 menit lagi, atau tidak pernah berjalan jika memori RAM masih longgar!

Apabila objek Anda memegang sumber daya eksternal yang langka—seperti *file handle* di Node.js, kunci transaksi di IndexedDB/database, aliran `ReadableStreamDefaultReader` yang terkunci, atau langganan event—menunggu GC dapat menyebabkan kebocoran pegangan berkas (*file descriptor leak*) atau *deadlock*. Spesifikasi **Explicit Resource Management (ES2027)** menghadirkan deklarasi **`using`** dan **`await using`** agar pembersihan sumber daya selalu dipanggil secara deterministik tepat saat eksekusi keluar dari blok `{ ... }`.

> **⚠️ Jebakan Umum di Lapangan:** Bergantung pada *Garbage Collector* untuk menutup koneksi jaringan atau melepas kunci antrean tidak pernah menjamin kapan sumber daya tersebut benar-benar dibebaskan; protokol `Symbol.dispose` (atau blok `try...finally`) memastikan pelepasan terjadi seketika saat blok berakhir.

## 1. Protokol `Symbol.dispose`, `Symbol.asyncDispose`, dan `DisposableStack`

Sebuah objek disebut *disposable* (dapat dibersihkan secara otomatis oleh `using`) apabila mengimplementasikan metode dengan kunci simbol **`[Symbol.dispose]()`** (untuk pembersihan sinkron) atau **`[Symbol.asyncDispose]()`** (untuk pembersihan asinkron dengan `await using`):

| Deklarasi / Kelas | Metode yang Dipanggil Saat Keluar Blok `{ ... }` | Urutan Pelepasan & Penanganan Galat |
| :--- | :--- | :--- |
| **`using res = buatSumberDaya()`** | `res[Symbol.dispose]()` secara sinkron. | Dilepas dalam urutan **terbalik (LIFO — yang terakhir dibuat, pertama dibersihkan)** baik blok selesai normal maupun melempar `Error`. |
| **`await using res = ...`** | `await res[Symbol.asyncDispose]()` (atau jatuh kembali ke `[Symbol.dispose]()`). | Menunggu proses penutupan asinkron (seperti `await fileHandle.close()` atau rollback transaksi) selesai sebelum keluar dari blok. |
| **`DisposableStack` / `AsyncDisposableStack`** | `.use(res)`, `.adopt(nilai, fnBersih)`, `.defer(fnBersih)`. | Mengelompokkan beberapa sumber daya dinamis ke dalam satu tumpukan pembersih terpadu. |
| **`SuppressedError`** | `err.error` (galat baru saat dispose) & `err.suppressed` (galat awal di dalam blok). | Jika kode di dalam blok melempar galat **dan** metode `[Symbol.dispose]()` juga melempar galat, keduanya tidak hilang melainkan dibungkus dalam `SuppressedError`! |

> **Status dukungan:** Deklarasi `using` dan `DisposableStack` sudah berjalan di Chrome/Edge 134+, Firefox 141+, Deno, dan Node.js 24 (diuji pada v24.18), tetapi Safari baru berstatus pratinjau sehingga fitur ini belum berstatus Baseline. Gunakan `try...finally` bila Anda harus mendukung Safari.

## 2. Mengimplementasikan `[Symbol.dispose]()` dan Pola Kompatibilitas `try...finally`

Berikut adalah contoh class pelacak waktu dan pengunci sumber daya yang mengimplementasikan `[Symbol.dispose]()`, sehingga dapat digunakan dengan `using` pada runtime yang mendukungnya maupun dengan `try...finally` untuk kompatibilitas penuh lintas peramban:

```javascript
export class PelacakWaktuEksekusi {
  constructor(namaOperasi) {
    this.namaOperasi = namaOperasi;
    this.mulai = performance.now();
  }
  [Symbol.dispose]() {
    const durasi = (performance.now() - this.mulai).toFixed(2);
    console.log(`[Selesai] ${this.namaOperasi}: ${durasi} ms`);
  }
}

// 1. Pola kompatibel di semua peramban (termasuk Safari):
export function jalankanTugasKompatibel() {
  const pelacak = new PelacakWaktuEksekusi("Hitung Laporan");
  try {
    for (let i = 0; i < 1e5; i++);
  } finally {
    pelacak[Symbol.dispose]();
  }
}
```

Pada lingkungan yang telah mendukung deklarasi `using` dan `DisposableStack` (seperti Node.js 24+, Chrome 134+, Firefox 141+), Anda juga dapat menggunakan `DisposableStack` dengan metode `.defer()` untuk mendaftarkan fungsi pembersih tanpa perlu membuat class khusus:

```javascript
export function gunakanDisposableStack() {
  if (typeof DisposableStack === "undefined") return;
  const tumpukan = new DisposableStack();
  try {
    tumpukan.defer(() => console.log("2. Pembersihan pertama yang didaftarkan (dieksekusi terakhir)"));
    tumpukan.defer(() => console.log("1. Pembersihan kedua yang didaftarkan (dieksekusi pertama - LIFO)"));
  } finally {
    tumpukan.dispose();
  }
}
```

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Mengasumsikan urutan pelepasan beberapa `using` adalah dari atas ke bawah (FIFO):** Jika Anda mendeklarasikan `using koneksi = bukaDb();` diikuti `using transaksi = mulaiTransaksi(koneksi);`, maka saat keluar blok, **`transaksi` wajib ditutup terlebih dahulu baru kemudian `koneksi` ditutup**! Oleh karena itu, spesifikasi menerapkan urutan **LIFO (*Last-In, First-Out*)**.
2. **Memakai `using` biasa untuk sumber daya yang pembersihannya mengembalikan `Promise`:** Jika metode pembersih bersifat asinkron (`[Symbol.asyncDispose]`), menggunakan `using` (tanpa `await`) tidak akan menunggu `Promise` pembersihan tersebut selesai dan malah melempar `TypeError` jika `[Symbol.dispose]` tidak ada. Gunakan **`await using`**.
3. **Menelan galat awal saat blok `finally` manual melempar galat baru:** Pada blok `try { lemparA(); } finally { lemparB(); }` tradisional, `lemparB()` akan menimpa dan menghilangkan jejak `lemparA()`. Sebaliknya, `using` dan `DisposableStack` membungkus keduanya ke dalam **`SuppressedError`** sehingga galat asli (`err.suppressed`) tetap terlacak.

## Latihan Praktik Mandiri

1. Buat berkas `sumber-daya.mjs` yang mengekspor fungsi `buatKunciMuteks()` dengan metode `[Symbol.dispose]()` yang otomatis melepas status kunci `terkunci = false` saat keluar dari cakupan.
2. Buat pengujian otomatis di `node:test` yang memverifikasi bahwa meskipun fungsi di dalam blok melempar `new Error("Gagal di tengah jalan")`, status kunci tetap kembali menjadi `terkunci === false` setelah blok berakhir.

## Kuis Pemahaman

### Soal 1
Mengapa aplikasi produksi tidak boleh bergantung pada *Garbage Collector* (GC) untuk menutup *file handle*, melepas kunci *mutex*, atau menutup koneksi jaringan?
- A. Karena *Garbage Collector* hanya berjalan pada variabel bertipe `string`
- B. Karena waktu eksekusi *Garbage Collector* bersifat non-deterministik (tidak dapat dipastikan kapan berjalan), sehingga sumber daya eksternal yang langka dapat tetap terkunci dan bocor meskipun variabelnya sudah keluar dari fungsi; protokol `Symbol.dispose` / `try...finally` menjamin pelepasan terjadi seketika saat blok berakhir
- C. Karena *Garbage Collector* dinonaktifkan di dalam modul ES
- D. Karena koneksi jaringan kebal terhadap penghapusan memori

**Jawaban Benar:** B
**Penjelasan:** GC hanya melacak tekanan memori RAM, bukan ketersediaan *file descriptor* atau kunci transaksi database. Pembersihan eksplisit deterministik memastikan sumber daya langsung dilepas begitu keluar dari blok `{ ... }`.

### Soal 2
Apabila di dalam sebuah blok dideklarasikan dua sumber daya berurutan:
```javascript
{
  using sumberA = buatA();
  using sumberB = buatB();
}
```
Dalam urutan manakah metode `[Symbol.dispose]()` dipanggil ketika eksekusi keluar dari blok tersebut?
- A. `sumberA[Symbol.dispose]()` dipanggil terlebih dahulu, lalu `sumberB[Symbol.dispose]()`
- B. Dalam urutan terbalik **LIFO (*Last-In, First-Out*)**: `sumberB[Symbol.dispose]()` dipanggil terlebih dahulu, kemudian baru `sumberA[Symbol.dispose]()`
- C. Keduanya dipanggil secara acak
- D. Hanya `sumberA` yang dibersihkan, sedangkan `sumberB` diabaikan

**Jawaban Benar:** B
**Penjelasan:** Sumber daya yang dibuat belakangan (`sumberB`) sering kali bergantung pada sumber daya yang dibuat lebih dulu (`sumberA`), sehingga spesifikasi Explicit Resource Management selalu menjalankan pembersihan dalam urutan terbalik (LIFO).

### Soal 3
Apa yang terjadi pada mekanisme `using` / `DisposableStack` apabila kode di dalam blok `{ ... }` melempar `Error("Galat Utama")`, dan saat pembersihan dijalankan, metode `[Symbol.dispose]()` ternyata ikut melempar `Error("Gagal Menutup")`?
- A. Kedua galat diabaikan agar aplikasi tidak berhenti
- B. Mesin JavaScript melempar objek **`SuppressedError`** yang menyimpan galat pembersihan di properti `.error` sekaligus mempertahankan galat asli dari dalam blok di properti `.suppressed` agar akar masalah tidak hilang
- C. Hanya `"Galat Utama"` yang disimpan, sedangkan `"Gagal Menutup"` dihapus
- D. Peramban otomatis mengulang blok dari awal

**Jawaban Benar:** B
**Penjelasan:** Berbeda dengan `try...finally` biasa di mana eksepsi baru di dalam `finally` menimpa eksepsi dari blok `try`, Explicit Resource Management memperkenalkan `SuppressedError` agar kedua eksepsi tetap tercatat untuk diagnosis.

## Sumber

- [`using` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/using)
- [`DisposableStack` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DisposableStack)
- [Explicit Resource Management — TC39 proposal](https://github.com/tc39/proposal-explicit-resource-management)
