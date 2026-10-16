# Prototipe, Sintaks `class`, Field Privat (`#`), dan Pewarisan (`extends`)

- **Tingkat:** Menengah
- **Ringkasan:** Memahami bagaimana pewarisan prototipe (*prototypal inheritance*) bekerja di balik layar, merancang cetak biru objek dengan sintaks `class`, menyembunyikan data internal dengan *private fields* (`#`), serta menerapkan `static`, *getter/setter*, dan `extends` / `super`.

## 1. Bagaimana Objek di JavaScript Saling Mewarisi? (*Prototypal Inheritance*)

Berbeda dengan bahasa seperti Java atau C++ klasik di mana class adalah cetak biru terpisah dari objek, di JavaScript **setiap objek memiliki tautan internal tersembunyi (`[[Prototype]]`) yang menunjuk ke objek lain yang disebut prototipenya**.

Ketika Anda memanggil `teks.toUpperCase()` atau `daftar.map(...)`, dari mana metode `.toUpperCase()` dan `.map()` itu berasal?
1. Mesin JavaScript memeriksa apakah properti tersebut ada langsung di dalam objek `daftar` itu sendiri.
2. Jika tidak ada, mesin menelusuri rantai prototipe (**Prototype Chain**) ke atas menuju `Array.prototype`, lalu ke `Object.prototype`, hingga berakhir di `null`.

Sintaks **`class`** yang diperkenalkan sejak ES2015 adalah cara yang bersih, terstruktur, dan modern untuk mendefinisikan konstruktor beserta metode-metode di dalam `prototype`-nya!

## 2. Anatomi `class` Modern dan Enkapsulasi Sejati dengan `#` (*Private Fields*)

Sebelum ES2022, pengembang JavaScript terpaksa menandai properti internal dengan garis bawah semu seperti `this._saldo`, padahal properti tersebut tetap bisa diubah sembarangan dari luar objek.

Kini (status **Baseline Widely Available**), awalan tanda pagar **`#`** menciptakan **Private Fields dan Private Methods sejati** yang ditegakkan langsung oleh mesin JavaScript: upaya mengakses `#properti` dari luar blok `class` akan langsung ditolak sebagai **SyntaxError**!

```js
class AkunLayanan {
  // 1. Public field dengan nilai awal
  peran = "standar";

  // 2. Private field (wajib dideklarasikan di tingkat atas class dengan awalan #)
  #kunciApi;
  #kuotaTersisa;

  constructor(namaLayanan, kunciApi, kuotaAwal = 1000) {
    this.namaLayanan = namaLayanan;
    this.#kunciApi = kunciApi;
    this.#kuotaTersisa = kuotaAwal;
  }

  // 3. Getter untuk membaca nilai privat tanpa mengizinkan pengubahan sembarangan
  get kuota() {
    return this.#kuotaTersisa;
  }

  // 4. Private method (hanya bisa dipanggil dari dalam class ini)
  #formatHeaderOtorisasi() {
    return `Bearer ${this.#kunciApi}`;
  }

  pakaiKuota(jumlah = 1) {
    if (jumlah > this.#kuotaTersisa) {
      throw new Error(`Kuota layanan ${this.namaLayanan} habis.`);
    }
    this.#kuotaTersisa -= jumlah;
    return {
      header: this.#formatHeaderOtorisasi(),
      sisa: this.#kuotaTersisa
    };
  }

  // 5. Memeriksa apakah suatu objek merupakan instans yang memiliki field #kunciApi (ergonomic brand check)
  static adalahAkunSah(objek) {
    return #kunciApi in objek;
  }
}

const akun = new AkunLayanan("Worker-Email", "rahasia-xyz-99", 500);
console.log(akun.kuota); // 500 (Memanggil getter 'get kuota()')
// console.log(akun.#kunciApi); // SyntaxError: Private field '#kunciApi' must be declared in an enclosing class
```

## 3. Metode dan Properti `static`

Kata kunci **`static`** mendefinisikan properti atau metode yang menempel langsung pada **Class itu sendiri**, bukan pada masing-masing objek instans yang dibuat dengan `new`.

Metode `static` sangat cocok digunakan untuk:
- **Factory Methods:** Membuat instans objek dari berbagai format masukan (misalnya `Pengguna.dariJson(str)`).
- **Fungsi Utilitas atau Konstanta Kelas:** Misalnya `Number.isNaN()`, `Array.isArray()`, atau `Object.groupBy()`.

```js
class KonfigurasiDatabase {
  static PORT_BAWAAN = 5432;

  constructor(host, port = KonfigurasiDatabase.PORT_BAWAAN) {
    this.host = host;
    this.port = port;
  }

  // Static Factory Method
  static dariUrl(urlString) {
    const url = new URL(urlString);
    const port = url.port ? Number(url.port) : KonfigurasiDatabase.PORT_BAWAAN;
    return new KonfigurasiDatabase(url.hostname, port);
  }
}

const db = KonfigurasiDatabase.dariUrl("postgres://db.kodeloka.internal:6432/utama");
console.log(db.host, db.port); // "db.kodeloka.internal" 6432
```

## 4. Pewarisan Kelas dengan `extends` dan `super`

Gunakan kata kunci **`extends`** untuk membuat subkelas (*child class*) yang mewarisi perilaku kelas induk (*parent class*), dan gunakan **`super`** untuk memanggil konstruktor atau metode milik kelas induk:

```js
class PenyimpananDasar {
  constructor(awalanKunci) {
    this.awalanKunci = awalanKunci;
  }

  formatKunci(kunci) {
    return `${this.awalanKunci}:${kunci}`;
  }
}

class PenyimpananMemori extends PenyimpananDasar {
  #data = new Map();

  constructor(awalanKunci, kapasitasMaks = 100) {
    // WAJIB memanggil super(...) terlebih dahulu sebelum mengakses 'this' di dalam constructor anak!
    super(awalanKunci);
    this.kapasitasMaks = kapasitasMaks;
  }

  simpan(kunci, nilai) {
    if (this.#data.size >= this.kapasitasMaks) {
      throw new Error("Kapasitas penyimpanan penuh.");
    }
    // Memanggil metode milik kelas induk dengan super.formatKunci()
    const kunciLengkap = super.formatKunci(kunci);
    this.#data.set(kunciLengkap, nilai);
  }

  ambil(kunci) {
    return this.#data.get(super.formatKunci(kunci));
  }
}
```

> **⚠️ Aturan Wajib `super()` di dalam Constructor Subkelas:**
> Jika sebuah kelas menggunakan `extends` dan mendefinisikan `constructor()` miliknya sendiri, ia **wajib memanggil `super(...)` sebelum menggunakan kata kunci `this`**. Jika Anda mencoba menulis `this.kapasitasMaks = 100` sebelum baris `super()`, JavaScript akan melempar `ReferenceError: Must call super constructor in derived class before accessing 'this'`.

## Latihan Praktik: Merancang Sistem Antrean Tugas Berorientasi Objek

Buatlah berkas `antrean-tugas.js` dan jalankan dengan Node.js:
1. Buat class `Tugas` dengan field privat `#status = "menunggu"`, properti publik `id` dan `judul`, getter `status`, serta metode `selesaikan()` yang mengubah `#status` menjadi `"selesai"`.
2. Buat subkelas `TugasBerjadwal extends Tugas` yang menambahkan properti `tenggatWaktu` di dalam `constructor(id, judul, tenggatWaktu)` menggunakan `super(id, judul)`.
3. Uji pembuatan instans dengan `new TugasBerjadwal(...)` dan pastikan `#status` tidak dapat diubah secara paksa dari luar class.

## Kuis Pemahaman

### Soal 1
Apa perbedaan antara menulis properti `_sandi` (diawali garis bawah) dan `#sandi` (diawali tanda pagar) di dalam sebuah `class` JavaScript?
- A. `_sandi` dan `#sandi` sama-sama menghasilkan galat sintaks jika diakses dari luar class.
- B. `_sandi` hanyalah konvensi penamaan tidak resmi yang tetap bisa dibaca dan diubah bebas dari luar objek, sedangkan `#sandi` adalah *private field* resmi yang ditegakkan oleh mesin JavaScript sehingga tidak dapat diakses dari luar blok deklarasi class.
- C. `#sandi` hanya bisa menyimpan tipe angka, sedangkan `_sandi` bisa menyimpan string.
- D. `_sandi` otomatis mengenkripsi nilainya dengan SHA-256.

**Jawaban Benar:** B
**Penjelasan:** Awalan garis bawah (`_`) hanyalah kesepakatan gaya penulisan antar-pemrogram dan tetap merupakan properti publik biasa. Sebaliknya, awalan `#` merupakan fitur bahasa ECMAScript resmi yang mengisolasi field tersebut secara ketat di dalam lingkup `class`.

### Soal 2
Di dalam sebuah `class PembayaranKartu extends Pembayaran`, apa yang terjadi jika di dalam `constructor()` milik `PembayaranKartu` Anda langsung menulis `this.biayaAdmin = 2500;` pada baris pertama tanpa memanggil `super()` terlebih dahulu?
- A. Nilai `this.biayaAdmin` berhasil disimpan dan `super()` dipanggil otomatis di akhir konstruktor.
- B. Mesin JavaScript melempar `ReferenceError` karena di dalam subkelas (*derived class*), `super()` wajib dipanggil terlebih dahulu untuk menginisialisasi `this` sebelum `this` dapat diakses.
- C. Kelas induk `Pembayaran` otomatis dihapus dari rantai prototipe.
- D. Nilai `this.biayaAdmin` berubah menjadi `undefined`.

**Jawaban Benar:** B
**Penjelasan:** Pada kelas turunan yang menggunakan `extends`, alokasi dan inisialisasi objek `this` dilakukan oleh konstruktor kelas induk. Oleh karena itu, mengakses `this` sebelum memanggil `super()` merupakan galat `ReferenceError`.

### Soal 3
Bagaimana cara memanggil metode `static dariJson(str)` yang didefinisikan di dalam `class Artikel`?
- A. Membuat instans dulu dengan `const a = new Artikel();` lalu memanggil `a.dariJson(str)`.
- B. Memanggilnya langsung pada nama kelasnya: `Artikel.dariJson(str)`.
- C. Memanggilnya melalui `Object.prototype.dariJson(str)`.
- D. Metode `static` hanya bisa dipanggil dari dalam metode `#privat`.

**Jawaban Benar:** B
**Penjelasan:** Metode yang diberi kata kunci `static` ditempelkan pada konstruktor class itu sendiri (`Artikel.dariJson()`), bukan pada `Artikel.prototype` milik instans objek.

## Sumber
- [Using classes — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_classes)
- [Private elements — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements)
- [ECMAScript Language Specification — TC39](https://tc39.es/ecma262/)
