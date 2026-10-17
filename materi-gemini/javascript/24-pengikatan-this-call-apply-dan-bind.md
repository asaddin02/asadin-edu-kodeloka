# Mekanisme Konteks `this`, `call()`, `apply()`, `bind()`, dan Lexical `this`

- **Tingkat:** Menengah
- **Ringkasan:** Memahami empat aturan penentuan nilai `this` saat fungsi dipanggil (pemanggilan biasa di *strict mode*, pemanggilan metode objek, konstruktor `new`, dan pengikatan eksplisit `call`/`apply`/`bind`), serta mengapa *arrow function* mewarisi `this` secara leksikal.

## Mengapa Nilai `this` di JavaScript Bisa Berubah-Ubah pada Fungsi yang Sama?

Berbeda dengan bahasa seperti Java atau C# di mana kata kunci `this` selalu mengacu pada instans class tempat metode tersebut ditulis, pada fungsi reguler (`function`) di JavaScript, nilai **`this` tidak ditentukan oleh di mana fungsi itu ditulis, melainkan oleh BAGAIMANA fungsi itu dipanggil (*call-site*)** saat runtime!

Ketidaktahuan akan aturan ini memicu salah satu bug paling sering di aplikasi web: metode objek berjalan lancar saat dipanggil dengan `objek.metode()`, tetapi mendadak melempar `TypeError: Cannot read properties of undefined` begitu diteruskan sebagai callback ke `addEventListener` atau `setTimeout`.

> **⚠️ Jebakan Umum di Lapangan:** Meneruskan metode objek secara langsung sebagai callback ke `addEventListener` atau `setTimeout(user.sapa, 1000)` tanpa `.bind()` atau pembungkus *arrow function* membuat konteks `this` di dalam metode tersebut tidak lagi menunjuk ke objek asalnya: menjadi `undefined` pada pemanggilan biasa di strict mode, elemen DOM pemicu pada `addEventListener`, atau objek global (`window`) pada `setTimeout` di peramban.

## 1. Empat Aturan Pengikatan `this` pada Fungsi Reguler vs *Arrow Function*

Urutan penentuan nilai `this` ketika sebuah fungsi dipanggil dirangkum dalam tabel berikut:

| Cara Pemanggilan | Contoh Sintaks | Nilai `this` di Dalam Fungsi Reguler |
| :--- | :--- | :--- |
| **1. Pemanggilan Biasa (*Default Binding*)** | `fungsiBiasa()` | **`undefined`** di dalam *strict mode* (dan di seluruh ES Modules / `class`), atau objek global (`window`/`globalThis`) di mode non-ketat. |
| **2. Pemanggilan Metode (*Implicit Binding*)** | `pengguna.sapa()` | Objek yang berada tepat di sebelah kiri titik saat pemanggilan, yaitu **`pengguna`**. |
| **3. Pengikatan Eksplisit (`call`, `apply`, `bind`)** | `sapa.call(pengguna, "Pagi")` | Objek pertama yang diteruskan ke dalam argumen `call`, `apply`, atau `bind`, yaitu **`pengguna`**. |
| **4. Pemanggilan Konstruktor (`new`)** | `new Pengguna("Rina")` | Objek instans baru yang baru saja dibuat oleh operator `new`. |
| **Pengecualian: *Arrow Function* (`=>`)** | `() => { console.log(this); }` | **Tidak memiliki `this` sendiri!** *Arrow function* mewarisi nilai `this` dari cakupan fungsi/modul induk tempat ia didefinisikan (*lexical `this`*), dan tidak bisa diubah oleh `call`, `apply`, maupun `bind`. |

## 2. Membedakan `call()`, `apply()`, `bind()`, dan *Lexical `this`*

Ketika Anda ingin mengunci nilai `this` dari sebuah metode objek agar tetap aman saat diteruskan sebagai callback ke `setInterval`, `setTimeout`, atau `addEventListener`, Anda memiliki dua solusi utama:

1. **Menggunakan *Arrow Function* di dalam metode:** Karena *arrow function* mengambil `this` secara leksikal dari metode pembungkusnya:

```javascript
class PenghitungWaktu {
  constructor(label) {
    this.label = label;
    this.detik = 0;
  }

  mulai() {
    // Arrow function mewarisi 'this' dari metode mulai() (instans PenghitungWaktu)
    setInterval(() => {
      this.detik += 1;
      console.log(`${this.label}: ${this.detik} dtk`);
    }, 1000);
  }
}
```

2. **Menggunakan `Function.prototype.bind(thisArg)`:** Metode `.bind()` **tidak langsung menjalankan fungsi**, melainkan mengembalikan **fungsi baru** yang nilai `this`-nya sudah dikunci secara permanen ke `thisArg`. Sebaliknya, `.call(thisArg, a, b)` dan `.apply(thisArg, [a, b])` langsung mengeksekusi fungsi saat itu juga:

```javascript
const pengelolaUnduhan = {
  awalan: "[Unduhan Kodeloka]",
  catatProgres(namaBerkas, persen) {
    return `${this.awalan} ${namaBerkas}: ${persen}%`;
  }
};

// 1. call() vs apply(): langsung mengeksekusi fungsi dengan 'this' yang ditentukan
console.log(pengelolaUnduhan.catatProgres.call({ awalan: "[Cepat]" }, "modul.zip", 50));
console.log(pengelolaUnduhan.catatProgres.apply({ awalan: "[Arsip]" }, ["video.mp4", 100]));

// 2. bind(): menghasilkan fungsi baru dengan 'this' terkunci (dan argumen parsial opsional)
const handlerTerikat = pengelolaUnduhan.catatProgres.bind(pengelolaUnduhan);
console.log(handlerTerikat("materi.pdf", 80)); // "[Unduhan Kodeloka] materi.pdf: 80%"
```

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Menulis `elemen.addEventListener("click", this.tanganiKlik.bind(this))` lalu mencoba menghapusnya dengan `removeEventListener("click", this.tanganiKlik.bind(this))`:** Setiap pemanggilan `.bind()` menghasilkan **referensi fungsi baru yang berbeda**, sehingga `removeEventListener` gagal menemukan listener aslinya! Simpan hasil `this.tanganiKlik = this.tanganiKlik.bind(this)` di dalam `constructor`, atau gunakan `AbortController` (`{ signal }`) saat mendaftarkan listener.
2. **Menggunakan *arrow function* sebagai metode objek literal:** Menulis `const obj = { nama: "Adi", sapa: () => console.log(this.nama) }` membuat `this` di dalam `sapa` menunjuk ke cakupan luar (di luar `obj`), bukan ke `obj`! Untuk metode objek literal, selalu gunakan sintaks metode ringkas `sapa() { console.log(this.nama); }`.
3. **Menyangka `.bind()` dapat mengubah `this` pada *arrow function*:** Memanggil `(() => this).bind(objekBaru)()` tidak berpengaruh sama sekali karena *arrow function* mengabaikan pengikatan `this` dinamis.

## Latihan Praktik Mandiri

1. Buat berkas `keranjang-ui.mjs` berisi class `PengendaliKeranjang` dengan properti `namaToko` dan metode `tambahItem(namaProduk)`.
2. Buktikan perbedaan antara mengekstrak metode `const fn = instans.tambahItem; fn("Buku");` (yang melempar `TypeError` karena `this` bernilai `undefined`) versus mengikatnya dengan `const fnTerikat = instans.tambahItem.bind(instans);`.
3. Tulis pengujian unit dengan `node:test` yang memverifikasi perilaku `call()`, `apply()`, dan `bind()` pada metode tersebut.

## Kuis Pemahaman

### Soal 1
Apa yang terjadi ketika metode sebuah class diekstrak ke dalam variabel lalu dipanggil secara langsung di dalam modul ES:
```javascript
class Layanan {
  constructor() { this.url = "https://api.kodeloka.id"; }
  ambilUrl() { return this.url; }
}
const fn = new Layanan().ambilUrl;
fn();
```
- A. Mengembalikan `"https://api.kodeloka.id"` dengan normal
- B. Melempar `TypeError` karena di dalam modul ES (yang otomatis berjalan dalam *strict mode*), pemanggilan `fn()` tanpa objek pemilik membuat `this` bernilai `undefined`
- C. Mengembalikan `window.url`
- D. Mengubah `fn` menjadi *arrow function* secara otomatis

**Jawaban Benar:** B
**Penjelasan:** Saat referensi metode dipisahkan dari objeknya (`const fn = ...`) lalu dipanggil sebagai fungsi biasa `fn()`, aturan *default binding* berlaku. Di dalam *strict mode* (termasuk seluruh isi `class` dan ES Module), nilai `this` pada pemanggilan biasa adalah `undefined`.

### Soal 2
Apa perbedaan utama antara `fn.call(obj, "a", "b")`, `fn.apply(obj, ["a", "b"])`, dan `fn.bind(obj)`?
- A. `call` dan `apply` langsung mengeksekusi fungsi `fn` saat itu juga dengan konteks `this` bernilai `obj` (bedanya `call` menerima argumen satu per satu sedangkan `apply` menerima array argumen), sementara `bind` **tidak** langsung mengeksekusi fungsi melainkan mengembalikan fungsi baru yang `this`-nya terkunci ke `obj`
- B. `bind` langsung menjalankan fungsi, sedangkan `call` dan `apply` hanya menunda eksekusi
- C. `apply` hanya bekerja pada *arrow function*, sedangkan `call` hanya pada fungsi generator
- D. Ketiganya telah dihapus dari standar ECMAScript modern

**Jawaban Benar:** A
**Penjelasan:** `call()` dan `apply()` memanggil fungsi secara langsung dengan `this` yang ditentukan, sedangkan `bind()` menciptakan fungsi pembungkus baru dengan konteks `this` yang telah diikat secara permanen.

### Soal 3
Mengapa kode berikut ini gagal menghapus *event listener* dari tombol?
```javascript
tombol.addEventListener("click", this.simpan.bind(this));
tombol.removeEventListener("click", this.simpan.bind(this));
```
- A. Karena `removeEventListener` membutuhkan tiga argumen wajib
- B. Karena setiap pemanggilan `.bind(this)` menciptakan objek fungsi baru dengan alamat referensi memori yang berbeda, sehingga `removeEventListener` tidak mengenali fungsi kedua sebagai listener yang didaftarkan sebelumnya
- C. Karena event `"click"` tidak dapat dihapus setelah didaftarkan
- D. Karena `this.simpan` adalah metode privat

**Jawaban Benar:** B
**Penjelasan:** `this.simpan.bind(this) !== this.simpan.bind(this)`. Agar dapat dihapus dengan `removeEventListener`, simpan referensi fungsi hasil `.bind(this)` ke dalam properti (misalnya di `constructor`) atau gunakan opsi `{ signal: abortController.signal }` pada `addEventListener`.

## Sumber

- [`this` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [`Function.prototype.bind()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [TC39 ECMAScript® Language Specification](https://tc39.es/ecma262/)
