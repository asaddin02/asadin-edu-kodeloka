# Manajemen Memori, Garbage Collection, Pencegahan Memory Leak, dan Profiling di DevTools

- **Tingkat:** Lanjut
- **Ringkasan:** Memahami bagaimana *Garbage Collector* JavaScript membebaskan memori berdasarkan keterjangkauan (*reachability*), mengenali dan memperbaiki 4 sumber kebocoran memori (*memory leaks*) paling umum di aplikasi web, serta mengukur kinerja dengan Performance API dan DevTools Memory Profiler.

## 1. Bagaimana *Garbage Collector (GC)* JavaScript Bekerja?

Di JavaScript, Anda tidak perlu memanggil `free()` secara manual untuk membebaskan RAM seperti di bahasa C. Mesin JavaScript memiliki **Garbage Collector (GC)** otomatis yang menggunakan algoritma **Mark-and-Sweep berbasis Keterjangkauan (*Reachability*)**:

```
                     [ AKAR (ROOTS) ]
   (Variabel Global window, Tumpukan Call Stack Aktif,
                Pohon DOM Dokumen Aktif)
                 │                   │
                 ▼                   ▼
         [ Objek A ]           [ Objek B ] ───> [ Objek C ]
         (Terjangkau:          (Terjangkau:     (Terjangkau:
          DIPERTAHANKAN)        DIPERTAHANKAN)   DIPERTAHANKAN)


   [ Objek D ] <───> [ Objek E ]
   (Tidak ada jalur rujukan dari ROOTS sama sekali!
    Meskipun D dan E saling menunjuk, keduanya TIDAK TERJANGKAU
    -> DIHAPUS / DIBERSIHKAN OLEH GARBAGE COLLECTOR!)
```

Prinsip utamanya sangat sederhana: **selama sebuah objek masih memiliki rantai referensi yang terhubung dari Akar (*Roots*), Garbage Collector TIDAK AKAN PERNAH menghapus objek tersebut dari memori RAM!**

## 2. Empat Sumber Kebocoran Memori (*Memory Leaks*) Paling Umum di Front-End

Kebocoran memori terjadi ketika sebuah objek atau elemen DOM sebenarnya **sudah tidak dipakai lagi oleh pengguna**, tetapi Anda tidak sengaja **masih meninggalkan tali referensi dari Akar (*Roots*) yang mengikatnya**, sehingga pemakaian RAM tab peramban membengkak terus-menerus hingga ratusan megabyte!

### A. Simpul DOM yang Terlepas namun Masih Disimpan di Variabel (*Detached DOM Nodes*)
```js
// 🚫 BOCOR MEMORI:
// Meskipun #panel-besar sudah dihapus dari layar dengan .remove(),
// objek elemen beserta seluruh anak di dalamnya TIDAK BISA dibersihkan oleh GC
// karena masih dipegang oleh array global riwayatPanel!
const riwayatPanel = [];
function hapusPanel() {
  const panel = document.querySelector("#panel-besar");
  riwayatPanel.push(panel); // Menyimpan referensi kuat ke elemen DOM yang sudah dihapus!
  panel.remove();
}
```
**Solusi:** Jangan menyimpan referensi elemen DOM yang sudah dihapus di dalam variabel berumur panjang, atau gunakan **`WeakMap` / `WeakRef`** jika Anda perlu mengaitkan metadata ke elemen DOM!

### B. Timer `setInterval` yang Lupa Dihentikan (`clearInterval`)
Selama sebuah `setInterval(() => { ... }, 1000)` belum dihentikan dengan `clearInterval(id)`, fungsi callback beserta **seluruh variabel dan objek besar yang berada di dalam *closure*-nya** akan tetap hidup abadi di memori!

### C. Event Listener pada Objek Global (`window` / `document`) yang Lupa Dilepas
Jika sebuah komponen sementara memasang `window.addEventListener("resize", handlerKomponen)`, maka meskipun komponen tersebut sudah dihancurkan dari layar, objek `window` (yang merupakan *Root* abadi!) masih memegang referensi ke `handlerKomponen`.

**Cara Modern & Paling Bersih Melepas Banyak Event Listener Sekaligus: Gunakan `AbortController`!**
Tahukah Anda bahwa `addEventListener` mendukung opsi **`{ signal: controller.signal }`**? Dengan satu panggilan `controller.abort()`, **seluruh event listener yang menggunakan sinyal tersebut langsung terlepas sekaligus**:

```js
class KomponenGrafik {
  #pengendaliListener = new AbortController();

  pasang() {
    const { signal } = this.#pengendaliListener;

    // Kita bisa memasang banyak listener pada window/document dengan satu signal yang sama!
    window.addEventListener("resize", () => this.hitungUlang(), { signal });
    window.addEventListener("storage", (e) => this.sinkronkan(e), { signal });
    document.addEventListener("keydown", (e) => this.tanganiTombol(e), { signal });
  }

  hancurkan() {
    // SATU baris ini otomatis melepas ketiga event listener di atas hingga bersih 100%!
    this.#pengendaliListener.abort();
  }
}
```

### D. Cache `Map` atau Array Global yang Tumbuh Tanpa Batas (*Unbounded Cache*)
Jika Anda menyimpan hasil perhitungan di dalam `const cache = new Map()` tanpa batas jumlah maksimal item, setiap masukan baru akan menambah isi `Map` selamanya. Batasi ukuran maksimum cache (misalnya hapus item paling tua dengan `cache.delete(cache.keys().next().value)` ketika `cache.size > 100`).

## 3. Mengukur Performa Kode (`performance.now()`) dan Debugging di DevTools

### A. Mengukur Durasi Eksekusi Presisi Tinggi dengan `performance.now()`
Berbeda dengan `Date.now()` yang hanya berpresisi milidetik bulat dan dapat melompat jika jam sistem operasi disinkronkan ulang, **`performance.now()`** memberikan waktu monotonik dengan presisi pecahan milidetik (mikrodetik):

```js
const waktuMulai = performance.now();

// Jalankan operasi yang ingin diukur
prosesRibuanData();

const durasiMs = performance.now() - waktuMulai;
console.log(`Waktu pemrosesan: ${durasiMs.toFixed(2)} ms`);
```

### B. Teknik Debugging JavaScript Profesional di DevTools
1. **`console.table(daftarObjek)`:** Menampilkan array berisi objek sebagai tabel interaktif yang rapi di konsol (jauh lebih mudah dibaca daripada `console.log` biasa!).
2. **Pernyataan `debugger;` dan Conditional Breakpoints:**
   Daripada menebar puluhan `console.log`, klik kanan nomor baris kode di tab **Sources / Debugger** DevTools → pilih **Add conditional breakpoint...** (misalnya berhenti hanya ketika `item.id === 42 && item.harga < 0`). Saat eksekusi terjeda, Anda dapat menginspeksi seluruh isi variabel lokal, *closure*, dan *Call Stack* secara langsung!
3. **Mendeteksi *Detached DOM Elements* di Tab Memory:**
   Buka tab **Memory** di DevTools → pilih **Heap snapshot** → klik **Take snapshot**, lalu ketik **`Detached`** pada kotak filter pencarian kelas untuk melihat apakah ada elemen HTML yang sudah dihapus dari layar tetapi masih tersangkut di memori JavaScript!

## Latihan Praktik: Mengelola Siklus Hidup Komponen Bebas Bocor Memori

Buatlah berkas `kelola-memori.js` dan jalankan pengujiannya:
1. Buat `class PemantauJaringan` yang di dalam metode `mulai()` menyalakan `setInterval` dan memasang pendengar event menggunakan `AbortController` (`{ signal }`).
2. Buat metode `hentikan()` yang memanggil `clearInterval` dan `this.#controller.abort()`.
3. Buat struktur *Bounded Cache* (cache terbatas maksimal 3 entri) menggunakan `Map` yang otomatis mengeluarkan kunci paling awal (`map.keys().next().value`) ketika entri ke-4 dimasukkan!

## Kuis Pemahaman

### Soal 1
Berdasarkan algoritma *Mark-and-Sweep* pada Garbage Collector JavaScript, apa yang terjadi pada dua buah objek (`objekA` dan `objekB`) yang saling merujuk satu sama lain (`objekA.rekan = objekB` dan `objekB.rekan = objekA`), apabila **tidak ada lagi variabel atau referensi apa pun dari Akar (*Roots*) yang menunjuk ke `objekA` maupun `objekB`**?
- A. Kedua objek tersebut tidak akan pernah bisa dihapus dari memori karena terjadi *circular reference*.
- B. Kedua objek tersebut **tetap berhasil dihapus dan dibebaskan memorinya** oleh Garbage Collector, karena algoritma *Mark-and-Sweep* memeriksa keterjangkauan (*reachability*) dari *Roots*, bukan sekadar menghitung jumlah rujukan.
- C. Mesin JavaScript akan melempar `RangeError: Maximum call stack size exceeded`.
- D. Hanya `objekA` yang dihapus.

**Jawaban Benar:** B
**Penjelasan:** Berbeda dengan algoritma *reference counting* kuno yang gagal menangani rujukan melingkar (*circular reference*), Garbage Collector modern di JavaScript menelusuri objek mulai dari *Roots*. Karena pulau `objekA <-> objekB` sudah tidak terjangkau dari *Roots* mana pun, keduanya ditandai tidak terjangkau dan langsung dibersihkan.

### Soal 2
Bagaimana cara paling ringkas dan modern untuk melepas beberapa `addEventListener` sekaligus ketika sebuah komponen antarmuka dihancurkan?
- A. Memanggil `window.removeAllListeners()`.
- B. Meneruskan opsi `{ signal: controller.signal }` dari sebuah instans `AbortController` ke setiap `addEventListener`, lalu cukup memanggil `controller.abort()` satu kali saat komponen dihancurkan.
- C. Mengubah nilai variabel komponen menjadi `undefined`.
- D. Memanggil `event.stopPropagation()`.

**Jawaban Benar:** B
**Penjelasan:** Metode `EventTarget.addEventListener()` mendukung properti `signal` (`AbortSignal`). Ketika `controller.abort()` dipanggil, seluruh listener yang terdaftar dengan sinyal tersebut otomatis dilepas dari targetnya tanpa perlu menyimpan referensi fungsi handler satu per satu untuk `removeEventListener`.

### Soal 3
Apa yang dimaksud dengan **Detached DOM Node** di dalam profil memori peramban?
- A. Elemen HTML yang menggunakan `position: absolute`.
- B. Elemen DOM yang sudah dihapus dari pohon dokumen halaman (`elemen.remove()`), tetapi memorinya tidak dapat dibebaskan oleh *Garbage Collector* karena masih ada variabel, array, atau *closure* JavaScript yang menyimpan referensi ke elemen tersebut.
- C. Elemen yang berada di dalam Shadow DOM.
- D. Elemen `<img>` yang gagal memuat gambar.

**Jawaban Benar:** B
**Penjelasan:** Ketika sebuah simpul DOM dilepas dari dokumen tetapi masih dirujuk oleh variabel JavaScript yang aktif, simpul tersebut (beserta seluruh induk/anak di pohon sub-DOM terkaitnya) bertahan di memori sebagai *Detached DOM tree* dan menjadi salah satu penyebab kebocoran memori terbesar di aplikasi web.

## Sumber
- [`EventTarget: addEventListener()` method (`signal` option) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [JavaScript execution model — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
- [Document Object Model (DOM) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
