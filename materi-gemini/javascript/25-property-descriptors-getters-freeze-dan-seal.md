# Deskriptor Properti Objek (`defineProperty`), `Object.freeze()`, dan `Object.seal()`

- **Tingkat:** Menengah
- **Ringkasan:** Mengendalikan perilaku internal properti objek menggunakan *Property Descriptors* (`value`, `writable`, `enumerable`, `configurable`), memahami *getter* dan *setter*, serta mengunci objek konfigurasi menggunakan `Object.preventExtensions()`, `Object.seal()`, dan `Object.freeze()`.

## Mengapa Properti Objek Memiliki Atribut Tersembunyi di Balik Layar?

Saat Anda membuat properti objek biasa seperti `const user = { peran: "siswa" }`, properti `peran` tampak seperti pasangan kunci-nilai sederhana. Namun di dalam mesin JavaScript, setiap properti objek sebenarnya dikendalikan oleh sebuah catatan metadata internal yang disebut **Property Descriptor** (*Deskriptor Properti*). Deskriptor inilah yang menentukan apakah sebuah properti boleh diubah nilainya (`writable`), apakah ia ikut muncul di perulangan `Object.keys()` / `JSON.stringify()` (`enumerable`), dan apakah ia boleh dihapus dengan `delete` (`configurable`).

Selain mengendalikan satu properti dengan `Object.defineProperty()`, JavaScript menyediakan tiga tingkat penguncian objek utuh—`Object.preventExtensions()`, `Object.seal()`, dan `Object.freeze()`—untuk melindungi objek konfigurasi aplikasi dari mutasi tak sengaja.

> **⚠️ Jebakan Umum di Lapangan:** Menganggap `Object.freeze(obj)` membekukan seluruh objek bersarang di dalamnya secara otomatis adalah keliru; `Object.freeze()` hanya bersifat *shallow* (dangkal), sehingga objek anak di dalamnya tetap bisa diubah kecuali Anda melakukan pembekuan rekursif (*deep freeze*).

## 1. Atribut *Data Descriptor* vs *Accessor Descriptor* (`defineProperty`)

Ketika Anda menambahkan properti melalui penetapan biasa (`obj.x = 1`), ketiga bendera deskriptornya (`writable`, `enumerable`, `configurable`) otomatis bernilai **`true`**. Sebaliknya, ketika Anda mendefinisikan properti baru menggunakan **`Object.defineProperty(obj, "x", { ... })`**, ketiga bendera tersebut secara bawaan bernilai **`false`** kecuali Anda menuliskannya sebagai `true`!

| Atribut Deskriptor | Jenis Deskriptor | Efek Jika Bernilai `false` |
| :--- | :--- | :--- |
| **`writable`** | Data Descriptor (`value`) | Nilai properti tidak dapat diubah (`obj.x = 99` akan melempar **`TypeError`** di *strict mode*). |
| **`enumerable`** | Data & Accessor Descriptor | Properti disembunyikan dari `Object.keys()`, `for...in`, spread `{ ...obj }`, dan `JSON.stringify()`. |
| **`configurable`** | Data & Accessor Descriptor | Properti tidak dapat dihapus dengan `delete obj.x` dan atribut deskriptornya (selain mengubah `writable: true -> false`) tidak dapat diubah lagi selamanya. |
| **`get` & `set`** | Accessor Descriptor | Mendefinisikan fungsi *getter* dan *setter* yang dipanggil saat properti dibaca atau ditulis (tidak boleh digabung dengan `value` atau `writable` pada deskriptor yang sama). |

```javascript
const sesiPengguna = { id: "usr_101", nama: "Budi" };

// Menyembunyikan token rahasia agar tidak ikut bocor saat objek di-JSON.stringify()
Object.defineProperty(sesiPengguna, "tokenInternal", {
  value: "rahasia-xyz-999",
  writable: false,
  enumerable: false,   // Tidak muncul di Object.keys() maupun JSON.stringify()
  configurable: false
});

console.log(JSON.stringify(sesiPengguna)); // '{"id":"usr_101","nama":"Budi"}'
console.log(sesiPengguna.tokenInternal);   // "rahasia-xyz-999"
```

## 2. Perbandingan Tiga Tingkat Penguncian Objek dan Pola `deepFreeze()`

JavaScript menyediakan tiga metode statis pada `Object` untuk mengunci struktur objek:

| Metode Penguncian | Tambah Properti Baru? | Hapus Properti (`delete`)? | Ubah Nilai Properti yang Ada? | Metode Pemeriksa |
| :--- | :--- | :--- | :--- | :--- |
| `Object.preventExtensions(obj)` | **Ditolak** | Masih Boleh | Masih Boleh | `!Object.isExtensible(obj)` |
| `Object.seal(obj)` | **Ditolak** | **Ditolak** (`configurable: false`) | Masih Boleh (`writable` tetap) | `Object.isSealed(obj)` |
| `Object.freeze(obj)` | **Ditolak** | **Ditolak** (`configurable: false`) | **Ditolak** (`writable: false`) | `Object.isFrozen(obj)` |

Karena `Object.freeze()` hanya membekukan tingkat pertama (*shallow*), gunakan fungsi rekursif **`deepFreeze()`** berikut untuk membekukan objek konfigurasi bersarang secara menyeluruh:

```javascript
export function deepFreeze(obj) {
  Object.freeze(obj);
  for (const key of Reflect.ownKeys(obj)) {
    const val = obj[key];
    if (val !== null && (typeof val === "object" || typeof val === "function") && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  }
  return obj;
}

const KONFIG = deepFreeze({
  api: { baseUrl: "https://api.kodeloka.id", timeoutMs: 5000 }
});
// KONFIG.api.timeoutMs = 1000; -> Melempar TypeError di strict mode!
```

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Mengira `const KONFIG = { ... }` membuat isi objek tidak bisa diubah:** Kata kunci `const` hanya mencegah variabel `KONFIG` diarahkan ulang ke referensi objek lain (`KONFIG = {}`), tetapi sama sekali tidak mencegah mutasi properti `KONFIG.timeout = 0`. Gunakan `Object.freeze()` atau `deepFreeze()` untuk mengunci isi objeknya.
2. **Mencampur `value`/`writable` dengan `get`/`set` di dalam satu `Object.defineProperty()`:** Sebuah deskriptor properti hanya boleh berupa *Data Descriptor* ATAU *Accessor Descriptor*, tidak pernah keduanya sekaligus. Mencampurnya langsung melempar `TypeError: Invalid property descriptor`.
3. **Lupa bahwa `enumerable` bernilai `false` secara bawaan pada `Object.defineProperty()`:** Jika Anda mendefinisikan properti dengan `Object.defineProperty(obj, "nama", { value: "Rina" })` tanpa menulis `enumerable: true`, maka `Object.keys(obj)` dan `JSON.stringify(obj)` tidak akan menyertakan `"nama"`.

## Latihan Praktik Mandiri

1. Buat berkas `konfig-aman.mjs` yang mengekspor fungsi `buatKonfigurasiTerkunci(objekMentah)` menggunakan `deepFreeze()` serta menambahkan satu properti metadata non-enumerable `_dibuatPada` menggunakan `Object.defineProperty()`.
2. Buktikan bahwa `JSON.stringify()` hanya menyertakan properti konfigurasi biasa tanpa `_dibuatPada`, namun nilai `_dibuatPada` tetap bisa dibaca langsung.
3. Tulis pengujian `node:test` dengan `assert.throws()` untuk memastikan percobaan mengubah properti anak bersarang pada konfigurasi tersebut melempar `TypeError`.

## Kuis Pemahaman

### Soal 1
Mengapa pada kode berikut ini nilai `KONFIG.db.port` masih berhasil berubah menjadi `9999` meskipun `Object.freeze(KONFIG)` sudah dipanggil?
```javascript
const KONFIG = Object.freeze({
  nama: "Kodeloka",
  db: { host: "localhost", port: 5432 }
});
KONFIG.db.port = 9999;
```
- A. Karena `Object.freeze()` tidak bekerja pada angka bertipe `Number`
- B. Karena `Object.freeze()` hanya melakukan pembekuan dangkal (*shallow freeze*) pada properti tingkat pertama `KONFIG`, sehingga objek bersarang `KONFIG.db` belum ikut dibekukan kecuali dilakukan pembekuan rekursif (*deep freeze*)
- C. Karena kata kunci `const` membatalkan efek `Object.freeze()`
- D. Karena `port` merupakan kata cadangan di JavaScript

**Jawaban Benar:** B
**Penjelasan:** `Object.freeze(obj)` hanya mengubah properti milik `obj` langsung menjadi `writable: false` dan `configurable: false`. Jika nilai salah satu properti adalah referensi ke objek lain (`db`), objek anak tersebut tetap dapat dimutasi kecuali ikut dibekukan.

### Soal 2
Apa perbedaan antara `Object.seal(obj)` dan `Object.freeze(obj)`?
- A. `Object.seal(obj)` mencegah penambahan dan penghapusan properti tetapi **masih mengizinkan perubahan nilai** pada properti yang sudah ada (selama `writable: true`), sedangkan `Object.freeze(obj)` juga mengunci nilai seluruh properti data menjadi tidak dapat diubah (`writable: false`)
- B. `Object.seal(obj)` menghapus semua properti objek, sedangkan `Object.freeze(obj)` menyalin objek ke `localStorage`
- C. `Object.seal(obj)` bersifat rekursif (*deep*), sedangkan `Object.freeze(obj)` bersifat dangkal (*shallow*)
- D. Keduanya tidak memiliki perbedaan sama sekali

**Jawaban Benar:** A
**Penjelasan:** `Object.seal()` mengatur `configurable: false` pada seluruh properti dan menutup ekstensi objek, namun membiarkan status `writable` tetap seperti semula. `Object.freeze()` melakukan hal yang sama ditambah memaksa `writable: false` pada semua properti data.

### Soal 3
Apa yang terjadi jika Anda mendefinisikan properti dengan `Object.defineProperty(produk, "kodeRahasia", { value: "X99" })` tanpa menyertakan `writable`, `enumerable`, maupun `configurable`?
- A. Ketiga atribut deskriptor tersebut otomatis bernilai `true`
- B. Ketiga atribut deskriptor tersebut (`writable`, `enumerable`, dan `configurable`) otomatis bernilai **`false`**, sehingga `kodeRahasia` tidak dapat diubah, tidak dapat dihapus, dan tidak muncul di `Object.keys(produk)` maupun `JSON.stringify(produk)`
- C. Mesin JavaScript melempar `SyntaxError`
- D. Properti `kodeRahasia` otomatis terhapus setelah 1 detik

**Jawaban Benar:** B
**Penjelasan:** Berbeda dengan penetapan biasa `produk.kodeRahasia = "X99"` yang menyetel ketiga atribut deskriptor ke `true`, pemanggilan `Object.defineProperty()` menggunakan nilai bawaan `false` untuk `writable`, `enumerable`, dan `configurable` yang tidak disebutkan.

## Sumber

- [`Object.defineProperty()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [`Object.freeze()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
- [`Object.seal()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)
- [TC39 ECMAScript® Language Specification](https://tc39.es/ecma262/)
