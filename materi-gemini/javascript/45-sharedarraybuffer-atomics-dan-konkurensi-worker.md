# Memori Bersama antar-Worker: `SharedArrayBuffer`, `Atomics`, dan Isolasi Lintas-Asal (`COOP`/`COEP`)

- **Tingkat:** Lanjut
- **Ringkasan:** Berbagi blok memori biner yang sama antara *Main Thread* dan *Web Workers* tanpa biaya penyalinan data menggunakan **`SharedArrayBuffer`**, mencegah kondisi balapan (*race condition*) dengan operasi atomik **`Atomics.add()` / `Atomics.wait()`**, serta syarat keamanan header `Cross-Origin-Opener-Policy` dan `Cross-Origin-Embedder-Policy`.

## Mengapa Berbagi Memori Antar-Worker Membutuhkan `Atomics` dan Isolasi Keamanan?

Saat Anda mengirim `ArrayBuffer` biasa ke *Web Worker* menggunakan `worker.postMessage(buffer)`, peramban harus menyalin seluruh isi memori tersebut (atau memindahkan kepemilikannya lewat *transferable objects* sehingga utas pengirim kehilangan akses ke buffer itu).

Namun untuk pemrosesan citra/audio waktu nyata, simulasi fisika, atau mesin WebAssembly multi-utas, *Main Thread* dan *Web Workers* perlu membaca serta menulis **blok memori RAM yang sama secara serentak** menggunakan **`SharedArrayBuffer`**. Begitu dua utas mengakses alamat memori yang sama secara paralel, muncul dua tantangan besar:
1. **Keamanan Perangkat Keras:** Penyerang dapat menyalahgunakan `SharedArrayBuffer` sebagai penghitung waktu beresolusi sub-nanodetik untuk melancarkan serangan kanal samping CPU (*Spectre*). Oleh sebab itu, peramban mewajibkan halaman berstatus **Cross-Origin Isolated** sebelum mengizinkan `SharedArrayBuffer`.
2. **Kondisi Balapan (*Race Condition*):** Operasi biasa seperti `arr[0] += 1` terdiri dari tiga langkah CPU terpisah (*baca -> tambah -> tulis*). Jika dua Worker menjalankannya bersamaan dari angka `0`, keduanya bisa membaca `0` dan menulis `1` (bukannya `2`)! Objek bawaan **`Atomics`** mengunci operasi tersebut menjadi satu instruksi perangkat keras yang tak terbelah.

> **⚠️ Jebakan Umum di Lapangan:** `SharedArrayBuffer` dinonaktifkan oleh seluruh peramban secara bawaan demi mencegah serangan kanal samping CPU (*Spectre*), dan hanya aktif apabila dokumen disajikan dengan header HTTP `Cross-Origin-Opener-Policy: same-origin` dan `Cross-Origin-Embedder-Policy: require-corp` (`window.crossOriginIsolated === true`).

## 1. Syarat Header HTTP `COOP` + `COEP` dan Operasi Utama `Atomics`

Agar `window.crossOriginIsolated` bernilai `true` dan konstruktor `SharedArrayBuffer` dapat dipanggil di peramban, server Anda wajib mengirim dua header HTTP berikut pada dokumen HTML utama:
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp` (atau `credentialless`)

Setelah memori bersama dibuat dan dibungkus dengan `Int32Array` (atau `BigInt64Array`), gunakan metode **`Atomics`** berikut:

| Metode `Atomics` | Fungsi & Jaminan Konkurensi | Catatan Penting |
| :--- | :--- | :--- |
| **`Atomics.load(ta, idx)` & `store(ta, idx, val)`** | Membaca dan menulis nilai pada `ta[idx]` dengan penghalang memori (*memory barrier*) yang menjamin urutan terlihat langsung oleh semua thread. | Hindari membaca `ta[idx]` secara langsung saat disinkronkan antar-thread. |
| **`Atomics.add(ta, idx, val)` & `sub(ta, idx, val)`** | Menambahkan/mengurangi nilai secara atomik dan **mengembalikan nilai LAMA sebelum ditambah**. | Dijamin bebas *race condition* meskipun dipanggil 8 Worker sekaligus. |
| **`Atomics.compareExchange(ta, idx, diharapkan, baru)`** | Mengganti nilai di `ta[idx]` menjadi `baru` **hanya jika** nilai saat ini sama dengan `diharapkan` (*Compare-And-Swap / CAS*). | Fondasi utama pembuatan *lock-free data structures* dan *mutex*. |
| **`Atomics.wait(ta, idx, val)` & `notify(ta, idx, count)`** | Menidurkan thread Worker hingga nilai berubah, dan membangunkannya dari thread lain. | `Atomics.wait()` (sinkron) **dilarang dipanggil di Main Thread** peramban! Di Main Thread, gunakan **`Atomics.waitAsync()`**. |

## 2. Contoh Penggunaan `SharedArrayBuffer` dan `Atomics`

Berikut adalah cara membuat blok memori bersama yang aman dan melakukan operasi penambahan serta *Compare-And-Swap* secara atomik:

```javascript
export function demoAtomicsBersama() {
  // Di peramban, pastikan memeriksa window.crossOriginIsolated terlebih dahulu
  if (typeof window !== "undefined" && !window.crossOriginIsolated) {
    console.warn("Halaman belum Cross-Origin Isolated; SharedArrayBuffer tidak aktif.");
    return null;
  }

  const memoriBersama = new SharedArrayBuffer(8); // 8 byte = 2 elemen Int32
  const tampilanInt32 = new Int32Array(memoriBersama);

  // 1. Operasi penambahan atomik: mengembalikan nilai LAMA (0), nilai baru menjadi 1
  const nilaiSebelum = Atomics.add(tampilanInt32, 0, 1);
  const nilaiSekarang = Atomics.load(tampilanInt32, 0);

  // 2. Compare-And-Swap (CAS): ubah indeks 1 dari 0 menjadi 99 hanya jika saat ini masih 0
  Atomics.compareExchange(tampilanInt32, 1, 0, 99);

  return {
    nilaiSebelum,
    nilaiSekarang,
    statusKunci: Atomics.load(tampilanInt32, 1)
  };
}
```

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Memanggil `Atomics.wait()` secara langsung di *Main Thread* peramban:** Karena `Atomics.wait()` menidurkan dan memblokir thread pemanggil secara sinkron, peramban **melarang pemanggilannya di Main Thread** dan akan langsung melempar `TypeError: Atomics.wait cannot be called in this context` demi mencegah pembekuan layar! Gunakan `Atomics.wait()` hanya di dalam *Web Worker*, atau gunakan **`Atomics.waitAsync()`** yang mengembalikan `Promise` di *Main Thread*.
2. **Mengira `Atomics.add(ta, 0, 5)` mengembalikan nilai setelah ditambah:** Berdasarkan spesifikasi ECMAScript, seluruh metode modifikasi `Atomics` (`add`, `sub`, `and`, `or`, `xor`, `exchange`, `compareExchange`) selalu **mengembalikan nilai LAMA sebelum operasi dilakukan**.
3. **Mencoba memakai `Float64Array` pada `Atomics`:** Metode `Atomics` hanya bekerja pada *TypedArray* bilangan bulat (`Int8Array`, `Uint8Array`, `Int16Array`, `Uint16Array`, `Int32Array`, `Uint32Array`, `BigInt64Array`, `BigUint64Array`), sedangkan `wait` dan `notify` khusus hanya menerima **`Int32Array`** atau **`BigInt64Array`**.

## Latihan Praktik Mandiri

1. Buat berkas `antrean-atomik.mjs` yang menggunakan `SharedArrayBuffer` dan `Int32Array` untuk mengimplementasikan fungsi `cobaAmbilKunci(int32View, indeks)` menggunakan `Atomics.compareExchange(int32View, indeks, 0, 1) === 0` dan `lepasKunci(int32View, indeks)` menggunakan `Atomics.store(int32View, indeks, 0)`.
2. Tulis pengujian otomatis menggunakan `node:test` (di Node.js, `SharedArrayBuffer` aktif secara langsung tanpa header HTTP) yang membuktikan bahwa percobaan mengambil kunci kedua kalinya saat kunci masih bernilai `1` akan mengembalikan `false`, dan baru berhasil kembali setelah `lepasKunci` dipanggil.

## Kuis Pemahaman

### Soal 1
Syarat keamanan apakah yang wajib dipenuhi oleh halaman web agar peramban mengizinkan penggunaan `SharedArrayBuffer` (`window.crossOriginIsolated === true`)?
- A. Halaman harus ditulis tanpa menggunakan berkas CSS eksternal
- B. Server harus menyajikan dokumen utama dengan pasangan header HTTP `Cross-Origin-Opener-Policy: same-origin` (COOP) dan `Cross-Origin-Embedder-Policy: require-corp` atau `credentialless` (COEP)
- C. Pengguna harus mengaktifkan mode pengembang di sistem operasi
- D. Halaman harus menggunakan protokol `http://` biasa

**Jawaban Benar:** B
**Penjelasan:** Untuk memitigasi risiko serangan kanal samping *Spectre* lintas-origin, peramban mengisolasi proses halaman yang mengirimkan header COOP (`same-origin`) dan COEP (`require-corp`/`credentialless`), lalu menandainya dengan `window.crossOriginIsolated === true`.

### Soal 2
Jika `const view = new Int32Array(new SharedArrayBuffer(4))` awalnya berisi nilai `10` pada indeks `0`, apakah nilai kembalian dari ekspresi `Atomics.add(view, 0, 5)` dan berapakah nilai di `Atomics.load(view, 0)` setelahnya?
- A. `Atomics.add` mengembalikan `15`, dan `Atomics.load` mengembalikan `15`
- B. `Atomics.add` mengembalikan nilai **lama** sebelum penjumlahan yaitu `10`, sedangkan `Atomics.load(view, 0)` setelahnya mengembalikan nilai **baru** yaitu `15`
- C. `Atomics.add` mengembalikan `true`, dan `Atomics.load` mengembalikan `5`
- D. Keduanya mengembalikan `0`

**Jawaban Benar:** B
**Penjelasan:** Sesuai spesifikasi ECMAScript, `Atomics.add(typedArray, index, value)` menambahkan `value` secara atomik ke posisi `index` dan mengembalikan nilai **lama** yang tersimpan di indeks tersebut tepat sebelum penjumlahan.

### Soal 3
Mengapa memanggil `Atomics.wait(int32View, 0, 0)` secara langsung di *Main Thread* peramban melempar `TypeError`, dan API apa yang harus digunakan sebagai gantinya di *Main Thread*?
- A. Karena `Atomics.wait()` hanya bekerja pada `Float32Array`; gunakan `Math.round()`
- B. Karena `Atomics.wait()` memblokir utas pemanggil secara sinkron hingga dibangunkan oleh `Atomics.notify()`, yang akan membekukan seluruh antarmuka peramban jika dilakukan di *Main Thread*; gunakan `Atomics.waitAsync()` di *Main Thread* (atau panggil `Atomics.wait()` hanya di dalam *Web Worker*)
- C. Karena `Atomics.wait()` membutuhkan koneksi internet aktif
- D. Karena indeks `0` dicadangkan oleh sistem operasi

**Jawaban Benar:** B
**Penjelasan:** Peramban melarang pemblokiran sinkron di *Main Thread*. Di *Main Thread*, gunakan `Atomics.waitAsync()` yang bersifat non-blokir berbasis `Promise`, sementara `Atomics.wait()` sinkron diperuntukkan bagi utas *Web Worker*.

## Sumber

- [`SharedArrayBuffer` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
- [`Atomics` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics)
- [`crossOriginIsolated` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/crossOriginIsolated)
- [TC39 ECMAScript® Language Specification](https://tc39.es/ecma262/)
