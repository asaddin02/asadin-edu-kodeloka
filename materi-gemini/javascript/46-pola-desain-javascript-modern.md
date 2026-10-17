# Pola Desain (*Design Patterns*) di JavaScript Modern: Factory, Strategy, Observer, dan Command

- **Tingkat:** Lanjut
- **Ringkasan:** Menerapkan pola desain perangkat lunak yang idiomatis di JavaScript modern—mulai dari *Module & Factory Function*, *Strategy Pattern* berbasis peta fungsi, *Observer / Pub-Sub* menggunakan `EventTarget` bawaan, hingga *Command Pattern* untuk fitur *Undo/Redo*.

## Mengapa Pola Desain di JavaScript Berbeda dari Bahasa Berorientasi Objek Klasik?

Buku klasik *Design Patterns* (Gang of Four, 1994) ditulis untuk C++ dan Smalltalk di mana fungsi bukanlah warga kelas satu (*first-class citizens*) dan setiap perilaku harus dibungkus di dalam hierarki `class` dan `interface`.

Di JavaScript modern, **fungsi adalah nilai yang dapat disimpan di dalam objek/`Map`**, dan **ES Modules (`import`/`export`) sudah bersifat *singleton* secara alami**. Menyalin mentah-mentah boilerplate *AbstractFactorySingletonBean* bergaya Java ke dalam JavaScript justru menghasilkan kode yang berbelit-belit. Sebaliknya, JavaScript memanfaatkan primitif bawaan platform seperti **Map fungsi** untuk *Strategy Pattern* dan **`EventTarget` + `CustomEvent`** untuk *Observer Pattern*.

> **⚠️ Jebakan Umum di Lapangan:** Menyalin pola *Singleton Class* yang kaku dari bahasa berorientasi objek klasik ke JavaScript sering kali berlebihan karena modul ES (`export const layanan = ...`) sudah dievaluasi satu kali sebagai *singleton* di tingkat modul.

## 1. Empat Pola Desain Idiomatis di JavaScript Modern

Berikut adalah perbandingan antara pendekatan OOP klasik yang kaku dan pendekatan idiomatis JavaScript modern:

| Pola Desain (*Pattern*) | Tujuan Rekayasa | Implementasi Idiomatis di JavaScript Modern |
| :--- | :--- | :--- |
| **Module / Factory** | Membuat instans dengan enkapsulasi state privat tanpa ketergantungan pada `this`. | Ekspor fungsi pembuat (*factory*) yang mengembalikan objek berisi penutup (*closure*) atau `class` dengan `#privateField`. |
| **Strategy Pattern** | Mengganti algoritma perhitungan (misalnya rumus ongkos kirim atau diskon) saat runtime tanpa `if/else` atau `switch` panjang. | Menyimpan fungsi murni di dalam objek beku (`Object.freeze({...})`) atau `Map`, lalu memanggilnya berdasarkan kunci strategi. |
| **Observer / Pub-Sub** | Memberi tahu banyak komponen ketika suatu peristiwa terjadi tanpa mengikat pengirim ke penerima (*decoupling*). | Mewarisi atau membuat instans **`EventTarget`** standar web dan memancarkan **`new CustomEvent(nama, { detail })`**. |
| **Command Pattern** | Membungkus aksi perubahan beserta kebalikannya ke dalam objek `{ jalankan(), batalkan() }`. | Menyimpan riwayat perintah di dalam array tumpukan `riwayatUndo` dan `riwayatRedo` pada editor interaktif. |

## 2. *Observer Pattern* dengan `EventTarget` Bawaan dan *Strategy Pattern*

Anda tidak perlu menulis pustaka `EventEmitter` buatan sendiri di peramban maupun di Node.js modern, karena **`EventTarget`** dan **`CustomEvent`** sudah menjadi bagian standar Web Platform API di kedua lingkungan tersebut:

```javascript
// 1. Menggunakan EventTarget standar web sebagai Pub/Sub (Observer Pattern)
export class PenyimpananKeranjang extends EventTarget {
  #item = [];

  tambah(produk) {
    this.#item.push(produk);
    this.dispatchEvent(new CustomEvent("keranjang:berubah", {
      detail: { totalItem: this.#item.length, itemTerbaru: produk }
    }));
  }

  ambilSemua() {
    return [...this.#item];
  }
}

// 2. Strategy Pattern idiomatis menggunakan objek peta fungsi murni
const STRATEGI_DISKON = Object.freeze({
  reguler: (subtotal) => subtotal,
  pelajar: (subtotal) => Math.round(subtotal * 0.8),
  kilat: (subtotal) => Math.max(0, subtotal - 50_000)
});

export function hitungHargaAkhir(subtotal, jenisPromo = "reguler") {
  const strategi = STRATEGI_DISKON[jenisPromo];
  if (!strategi) throw new Error(`Strategi promo tidak dikenal: ${jenisPromo}`);
  return strategi(subtotal);
}
```

## 3. *Command Pattern* untuk Fitur *Undo* dan *Redo*

Ketika membangun editor teks, pengolah diagram, atau papan kanban, **Command Pattern** memisahkan pemanggil aksi dari logika eksekusi dan pembatalannya:

```javascript
export class PengelolaRiwayatPerintah {
  #undoStack = [];
  #redoStack = [];

  eksekusi(perintah) {
    perintah.jalankan();
    this.#undoStack.push(perintah);
    this.#redoStack.length = 0; // Kosongkan tumpukan redo saat ada aksi baru
  }

  undo() {
    const perintah = this.#undoStack.pop();
    if (!perintah) return false;
    perintah.batalkan();
    this.#redoStack.push(perintah);
    return true;
  }

  redo() {
    const perintah = this.#redoStack.pop();
    if (!perintah) return false;
    perintah.jalankan();
    this.#undoStack.push(perintah);
    return true;
  }
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Mengirim data kustom pada `CustomEvent` menggunakan properti sembarang selain `detail`:** Konstruktor `new CustomEvent("nama", { dataSaya: 123 })` akan **mengabaikan** properti `dataSaya`! Spesifikasi DOM menetapkan bahwa muatan data kustom wajib diletakkan di dalam kunci **`detail`**: `new CustomEvent("nama", { detail: { dataSaya: 123 } })` dan dibaca melalui `event.detail`.
2. **Lupa mengosongkan tumpukan `redoStack` ketika pengguna mengeksekusi perintah baru setelah melakukan `undo`:** Jika pengguna melakukan *Undo* lalu mengetik aksi baru, percabangan masa depan lama di `redoStack` sudah tidak valid dan wajib dikosongkan (`this.#redoStack.length = 0`).
3. **Mengembalikan referensi array internal secara mentah dari dalam class (`return this.#item`):** Meskipun `#item` bersifat privat, mengembalikan referensinya secara langsung memungkinkan kode luar memanggil `.push()` dan merusak enkapsulasi tanpa memicu `CustomEvent`. Kembalikan salinannya (`return [...this.#item]`).

## Latihan Praktik Mandiri

1. Buat berkas `pola-desain.mjs` yang mengimplementasikan `PenyimpananKeranjang` (berbasis `EventTarget`), `hitungHargaAkhir` (*Strategy Pattern*), dan `PengelolaRiwayatPerintah` (*Command Pattern*).
2. Buat satu objek perintah `buatPerintahTambahTeks(dokumenObj, teksTambahan)` yang memiliki metode `jalankan()` dan `batalkan()`.
3. Uji dengan `node:test` bahwa pemanggilan `eksekusi()`, `undo()`, dan `redo()` memulihkan state dokumen secara akurat serta pendengar `addEventListener("keranjang:berubah")` menerima `event.detail` yang tepat.

## Kuis Pemahaman

### Soal 1
Saat memancarkan peristiwa kustom menggunakan standar Web Platform API `target.dispatchEvent(new CustomEvent("keranjang:berubah", opsi))`, di dalam properti manakah pada objek `opsi` Anda harus meletakkan data muatan (*payload*) agar dapat dibaca oleh pendengar `addEventListener`?
- A. Di dalam properti `payload` (`event.payload`)
- B. Di dalam properti **`detail`** (`new CustomEvent("keranjang:berubah", { detail: { ... } })`, dibaca melalui `event.detail`)
- C. Di dalam properti `body` (`event.body`)
- D. Di dalam properti `args` (`event.args`)

**Jawaban Benar:** B
**Penjelasan:** Konstruktor `CustomEvent(type, options)` secara spesifik membaca kunci `detail` dari objek opsi kedua dan menyimpannya ke dalam properti *read-only* `event.detail`.

### Soal 2
Mengapa di dalam proyek JavaScript modern berbasis ES Modules, kita jarang sekali perlu menulis class dengan metode statis `getInstance()` (*Classical Singleton Pattern*)?
- A. Karena kata kunci `static` tidak ada di JavaScript
- B. Karena modul ES dievaluasi hanya satu kali (*singleton by default*) dan hasilnya di-cache oleh pemuat modul, sehingga mengekspor objek atau instans dari sebuah modul sudah menjamin satu instans yang sama dibagikan ke seluruh pengimpor
- C. Karena `new` hanya bisa dipanggil satu kali per halaman web
- D. Karena *Singleton* memperlambat kecepatan jaringan

**Jawaban Benar:** B
**Penjelasan:** Spesifikasi ES Modules menjamin bahwa sebuah modul hanya dieksekusi sekali saat pertama kali diimpor; seluruh pernyataan `import` berikutnya di berkas lain menerima pengikatan (*binding*) ke instans yang sama.

### Soal 3
Dalam implementasi **Command Pattern** yang mendukung fitur *Undo* dan *Redo*, apa yang wajib dilakukan terhadap tumpukan `redoStack` ketika pengguna mengeksekusi sebuah perintah **baru** setelah sebelumnya melakukan beberapa kali `undo()`?
- A. Memindahkan seluruh isi `redoStack` ke `localStorage`
- B. Mengosongkan `redoStack` (`redoStack.length = 0`) karena aksi baru telah menciptakan cabang state baru sehingga riwayat *redo* sebelumnya tidak lagi selaras
- C. Menjalankan seluruh perintah di dalam `redoStack` secara otomatis
- D. Membalik urutan `undoStack`

**Jawaban Benar:** B
**Penjelasan:** Ketika pengguna membatalkan beberapa langkah (*undo*) lalu melakukan tindakan baru, garis waktu lama di `redoStack` menjadi gugur karena kondisi dasar state telah berubah.

## Sumber

- [`EventTarget` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)
- [`CustomEvent` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
