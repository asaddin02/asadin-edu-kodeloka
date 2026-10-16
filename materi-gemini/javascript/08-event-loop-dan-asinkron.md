# Event Loop, Antrean Microtask, `Promise`, dan `async` / `await`

- **Tingkat:** Lanjut
- **Ringkasan:** Membedah bagaimana JavaScript yang *single-threaded* menangani ribuan operasi asinkron tanpa membeku melalui mekanisme Event Loop (Call Stack, Task Queue vs Microtask Queue), mengelola siklus hidup `Promise`, konkurensi `Promise.all` / `allSettled`, serta sintaks `async`/`await`.

## Mengapa JavaScript yang *Single-Threaded* Tidak Membeku Saat Mengambil Data Jaringan?

Mesin utama JavaScript menjalankan kode Anda pada **satu utas tunggal (*Single Thread / Satu Call Stack*)**: pada satu detik yang sama, ia hanya bisa mengeksekusi satu baris perintah JavaScript.

Lalu bagaimana peramban tetap bisa menggulir halaman dengan mulus dan merespons klik tombol sementara program sedang menunggu balasan API dari server yang memakan waktu 2 detik?

Jawabannya adalah kolaborasi antara **Call Stack**, **Host/Web APIs** milik peramban (atau libuv di Node.js), **Microtask Queue**, **Task (Macrotask) Queue**, dan sang pengatur lalu lintas yang disebut **Event Loop**:

```text
+------------------------+      +---------------------------------------+
|      CALL STACK        |      |       WEB APIs / RUNTIME HOST         |
| (Menjalankan fungsi JS | ---> | (Timer setTimeout, Jaringan fetch(),  |
|  satu per satu)        |      |  Pendengar DOM addEventListener)      |
+------------------------+      +---------------------------------------+
            ^                                       │
            │                              (Setelah selesai:)
    [ EVENT LOOP ]                                  ▼
            │                   +---------------------------------------+
            ├────── Prioritas 1 │ MICROTASK QUEUE                       |
            │       (Habiskan   | (Callback Promise .then/catch/finally,|
            │        semua!)    |  kelanjutan baris setelah await,      |
            │                   |  queueMicrotask)                      |
            │                   +---------------------------------------+
            │                   +---------------------------------------+
            └────── Prioritas 2 │ TASK / MACROTASK QUEUE                |
                    (Ambil satu | (Callback setTimeout, setInterval,    |
                     per satu)  |  Event klik/papan ketik DOM)          |
                                +---------------------------------------+
```

### Aturan Emas Urutan Eksekusi Event Loop:
1. Jalankan semua kode **sinkron** yang ada di dalam **Call Stack** sampai Call Stack benar-benar kosong.
2. Begitu Call Stack kosong, Event Loop memeriksa **Microtask Queue** terlebih dahulu dan **menjalankan seluruh microtask sampai antrean microtask benar-benar habis** (termasuk microtask baru yang ditambahkan oleh microtask tadi!).
3. Setelah Microtask Queue kosong, barulah Event Loop mengambil **satu tugas dari Task (Macrotask) Queue** (misalnya callback `setTimeout`), memasukkannya ke Call Stack, lalu kembali lagi ke langkah 2!

Mari kita buktikan dengan menebak urutan keluaran kode berikut:

```js
console.log("1. Sinkron Awal");

setTimeout(() => {
  console.log("4. Macrotask (setTimeout 0ms)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Microtask (Promise.then)");
});

console.log("2. Sinkron Akhir");

// Urutan yang tercetak di layar SELALU:
// 1. Sinkron Awal
// 2. Sinkron Akhir
// 3. Microtask (Promise.then)   <-- Dijalankan LEBIH DULU daripada setTimeout 0ms!
// 4. Macrotask (setTimeout 0ms)
```

## 2. Memahami `Promise` dan Tiga Status Siklus Hidupnya

Sebuah **`Promise`** adalah objek yang mewakili hasil akhir dari operasi asinkron yang sedang berlangsung. Setiap `Promise` selalu berada dalam salah satu dari tiga kondisi (*states*):
1. **`pending` (Menunggu):** Operasi masih berjalan.
2. **`fulfilled` (Berhasil):** Operasi tuntas dengan sebuah nilai hasil (`value`).
3. **`rejected` (Gagal):** Operasi gagal dengan sebuah alasan galat (`reason` / objek `Error`).

Ketika sebuah Promise sudah berubah menjadi `fulfilled` atau `rejected`, ia disebut **`settled` (Tuntas)** dan statusnya terkunci selamanya (tidak dapat berubah lagi).

```js
// Membungkus API berbasis callback lama (seperti setTimeout) menjadi Promise
function tunggu(milidetik) {
  return new Promise((resolve, reject) => {
    if (milidetik < 0) {
      reject(new RangeError("Durasi waktu tunggu tidak boleh negatif."));
      return;
    }
    setTimeout(() => {
      resolve(`Selesai menunggu selama ${milidetik} ms`);
    }, milidetik);
  });
}
```

> **💡 Fitur Modern (Sejak ES2024): `Promise.withResolvers()`**
> Jika Anda perlu mengekstrak fungsi `resolve` dan `reject` agar bisa dipanggil dari luar lingkup callback `new Promise(...)` (misalnya pada komponen pembatalan atau antrean event), kini Anda dapat menggunakan **`const { promise, resolve, reject } = Promise.withResolvers();`** (status **Baseline Widely Available**; didukung semua peramban utama sejak Maret 2024)!

## 3. Menulis Kode Asinkron yang Bersih dengan `async` dan `await`

Sintaks **`async` / `await`** dibangun di atas `Promise` untuk membuat kode asinkron tampak dan mengalir selayaknya kode sinkron biasa:
- Menambahkan kata kunci **`async`** di depan fungsi menjamin fungsi tersebut **selalu mengembalikan sebuah `Promise`**.
- Kata kunci **`await`** menjeda eksekusi fungsi `async` tersebut (tanpa memblokir utas utama / Call Stack!) hingga `Promise` di sebelah kanannya selesai (*settled*). Jika `Promise` tersebut *rejected*, `await` akan melempar galatnya sehingga dapat ditangkap dengan blok `try...catch` standar!

```js
async function muatRingkasanPengguna(idPengguna) {
  try {
    const pesan = await tunggu(200);
    return { idPengguna, status: pesan };
  } catch (galat) {
    console.error("Gagal memuat ringkasan:", galat.message);
    throw galat;
  }
}
```

## 4. Konkurensi `Promise`: Jangan Menjalankan `await` Berurutan Jika Bisa Paralel!

Perhatikan jebakan performa paling sering saat menggunakan `async`/`await`:

```js
// LAMBAT (Berurutan / Sequential): Total waktu = 300ms + 300ms + 300ms = 900ms!
// Karena mengambil daftar kelas sama sekali tidak bergantung pada hasil profil,
// menunggu satu per satu membuang waktu pengguna secara percuma.
async function muatDasborLambat() {
  const profil    = await ambilData("/api/profil");     // 300ms
  const kelas     = await ambilData("/api/kelas");      // 300ms
  const notifikasi = await ambilData("/api/notifikasi"); // 300ms
  return { profil, kelas, notifikasi };
}

// CEPAT (Paralel / Concurrent dengan Promise.all): Total waktu hanya ~300ms!
async function muatDasborCepat() {
  const [profil, kelas, notifikasi] = await Promise.all([
    ambilData("/api/profil"),
    ambilData("/api/kelas"),
    ambilData("/api/notifikasi")
  ]);
  return { profil, kelas, notifikasi };
}
```

### Memilih Metode Kombinator `Promise` yang Tepat

| Metode | Kapan Selesai? | Apa yang Terjadi Jika Ada Satu saja yang Gagal (*Rejected*)? | Kasus Penggunaan Terbaik |
|---|---|---|---|
| **`Promise.all([...])`** | Saat **semua** berhasil. | **Langsung gagal seketika (*fail-fast*)** dan membuang hasil lainnya. | Mengambil beberapa data yang **semuanya wajib ada** agar halaman bisa tampil. |
| **`Promise.allSettled([...])`** | Saat **semua** tuntas (baik berhasil maupun gagal). | **Tidak pernah gagal!** Mengembalikan array objek `{ status: "fulfilled", value }` atau `{ status: "rejected", reason }`. | Mengambil widget dasbor independen (jika widget cuaca gagal, widget berita tetap tampil!). |
| **`Promise.race([...])`** | Saat Promise **pertama** tuntas (berhasil ataupun gagal). | Mengikuti hasil Promise tercepat pertama. | Membatasi waktu tunggu (*timeout*) sebuah operasi. |
| **`Promise.any([...])`** | Saat Promise **pertama berhasil (*fulfilled*)**. | Mengabaikan yang gagal; hanya melempar `AggregateError` jika **semuanya gagal**. | Mengambil aset dari beberapa server cermin (*mirror CDN*) tercepat. |

## Latihan Praktik: Mengambil Data Multi-Layanan secara Tangguh dengan `Promise.allSettled`

Buatlah berkas `asinkron-paralel.js` dan jalankan dengan Node.js:
1. Buat fungsi `simulasiRequest(namaLayanan, waktuMs, harusGagal = false)` yang mengembalikan `Promise`.
2. Jalankan 3 permintaan sekaligus menggunakan `await Promise.allSettled([...])`: Layanan Profil (`100ms`, sukses), Layanan Rekomendasi (`150ms`, **gagal**), dan Layanan Progres (`80ms`, sukses).
3. Pisahkan hasil yang `status === "fulfilled"` dan `status === "rejected"` agar aplikasi tetap menampilkan data profil dan progres sambil mencatat peringatan untuk layanan rekomendasi!

## Kuis Pemahaman

### Soal 1
Mengapa callback di dalam `Promise.resolve().then(...)` selalu dieksekusi **lebih dulu** daripada callback di dalam `setTimeout(..., 0)` meskipun keduanya dijadwalkan pada waktu yang sama?
- A. Karena `setTimeout(..., 0)` secara otomatis diubah menjadi `1000ms` oleh peramban.
- B. Karena callback `Promise` masuk ke dalam **Microtask Queue**, sedangkan callback `setTimeout` masuk ke dalam **Task (Macrotask) Queue**; Event Loop selalu menguras habis seluruh antrean Microtask terlebih dahulu sebelum mengambil satu tugas dari Macrotask Queue.
- C. Karena `Promise` berjalan di utas CPU yang berbeda dari JavaScript.
- D. Karena `setTimeout` hanya dieksekusi ketika pengguna menggerakkan tetikus.

**Jawaban Benar:** B
**Penjelasan:** Dalam spesifikasi Event Loop, setiap kali Call Stack kosong, antrean *Microtask* (yang menampung penyelesaian `Promise` dan `queueMicrotask`) memiliki prioritas mutlak dan dikerjakan sampai habis sebelum Event Loop mengambil giliran *Macrotask* (`setTimeout`, `setInterval`, I/O).

### Soal 2
Anda ingin memuat 3 panel informasi pada halaman beranda secara paralel. Jika salah satu panel gagal dimuat karena servernya sedang lambat, Anda tetap ingin menampilkan 2 panel lainnya yang berhasil. Kombinator `Promise` manakah yang paling tepat?
- A. `Promise.all()`
- B. `Promise.allSettled()`
- C. `Promise.race()`
- D. `Promise.any()`

**Jawaban Benar:** B
**Penjelasan:** `Promise.all()` bersifat *fail-fast*: jika satu saja Promise gagal, seluruh `Promise.all()` langsung melempar galat dan hasil dari 2 Promise lain yang berhasil tidak dikembalikan. Sebaliknya, `Promise.allSettled()` menunggu semua Promise selesai dan mengembalikan status serta nilai/alasan dari masing-masing Promise secara utuh.

### Soal 3
Apa yang dikembalikan oleh fungsi `async function ambilAngka() { return 42; }` ketika fungsi tersebut dipanggil dengan `const hasil = ambilAngka();` (tanpa `await`)?
- A. Angka primitif `42` secara langsung.
- B. Sebuah objek `Promise` yang berstatus *fulfilled* dengan nilai `42` (`Promise {<fulfilled>: 42}`).
- C. Nilai `undefined`.
- D. Sebuah fungsi generator.

**Jawaban Benar:** B
**Penjelasan:** Fungsi yang dideklarasikan dengan kata kunci `async` **selalu** membungkus nilai kembaliannya ke dalam sebuah objek `Promise`. Untuk membuka nilai `42` di dalamnya, pemanggil harus menggunakan `await ambilAngka()` atau `ambilAngka().then(...)`.

## Sumber
- [Using promises — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [JavaScript execution model (Event loop) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
- [Control abstraction objects (`Promise`) — TC39 ECMAScript Specification](https://tc39.es/ecma262/multipage/control-abstraction-objects.html)
