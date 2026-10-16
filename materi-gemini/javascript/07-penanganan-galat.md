# Penanganan Galat (*Error Handling*), Custom Error, dan Error `cause`

- **Tingkat:** Menengah
- **Ringkasan:** Membangun aplikasi yang tangguh menghadapi kegagalan menggunakan `try...catch...finally`, memahami jenis-jenis `Error` bawaan, merancang *Custom Error Class*, serta merangkai jejak penyebab galat dengan properti `{ cause }`.

## Mengapa Program Tidak Boleh "Menelan Galat Diam-Diam"?

Kesalahan jaringan, masukan JSON yang rusak, atau penyimpanan peramban yang penuh adalah kenyataan sehari-hari di lingkungan produksi. Dua kesalahan paling berbahaya dalam menangani galat adalah:
1. **Tidak menangani galat sama sekali** pada operasi berisiko (seperti `JSON.parse()`), sehingga satu data yang rusak menghentikan seluruh eksekusi skrip di halaman pengguna.
2. **Menelan galat secara diam-diam (*silent catch*)** dengan menulis `try { ... } catch (e) {}` kosong tanpa pencatatan atau pemulihan, sehingga ketika fitur gagal bekerja, tidak ada seorang pun yang tahu apa penyebabnya!

## 1. Mekanisme `try...catch...finally` dan `throw`

```js
function bacaKonfigurasiJson(teksMentah) {
  try {
    const data = JSON.parse(teksMentah);

    if (!data || typeof data.port !== "number") {
      // Melempar galat secara sengaja jika struktur data tidak memenuhi syarat
      throw new TypeError("Properti 'port' wajib berupa angka.");
    }

    return data;
  } catch (galat) {
    // Blok catch menangkap galat dari JSON.parse() maupun dari throw di atas
    console.error("Gagal memuat konfigurasi, menggunakan nilai bawaan:", galat.message);
    return { port: 8080, mode: "aman" };
  } finally {
    // Blok finally SELALU dijalankan di akhir (baik sukses maupun gagal,
    // bahkan jika di dalam try/catch terdapat perintah return!)
    console.log("Pemeriksaan konfigurasi selesai.");
  }
}
```

> **💡 Aturan Emas: Selalu Lempar Instans `Error`, Jangan Melempar String Mentah!**
> Di JavaScript, secara teknis Anda bisa menulis `throw "Gagal login";`. Namun **jangan pernah melakukan itu!** Jika Anda melempar string mentah, objek yang ditangkap di `catch (err)` tidak memiliki properti **`err.message`**, **`err.name`**, dan yang paling penting tidak memiliki jejak tumpukan pemanggilan (**`err.stack` / *stack trace***) untuk mencari di baris mana kesalahan terjadi. Selalu gunakan **`throw new Error("Pesan jelas")`** atau subkelasnya!

## 2. Mengenal Jenis-Jenis `Error` Bawaan JavaScript

Setiap objek galat standar memiliki properti `name` dan `message`:

| Kelas Galat Bawaan | Kapan Terjadi atau Digunakan? |
|---|---|
| `SyntaxError` | Kode tidak valid secara tata bahasa, atau ketika `JSON.parse()` menerima teks JSON yang rusak. |
| `ReferenceError` | Mencoba mengakses variabel yang belum dideklarasikan atau masih berada di *Temporal Dead Zone*. |
| `TypeError` | Nilai bukanlah tipe yang diharapkan (misalnya memanggil `null.toString()` atau mengubah variabel `const`). |
| `RangeError` | Nilai numerik berada di luar rentang yang diizinkan (misalnya `new Array(-5)` atau `(10).toFixed(200)`). |
| `URIError` | Fungsi pengodean URL seperti `decodeURIComponent("%")` menerima urutan persen yang cacat. |
| `AggregateError` | Membungkus beberapa galat sekaligus dalam satu objek (misalnya saat `Promise.any()` gagal seluruhnya). |

## 3. Membuat *Custom Error Class* dan Merangkai Penyebab dengan `{ cause }`

Dalam aplikasi yang terstruktur, bagian tampilan (*UI layer*) perlu membedakan apakah kegagalan terjadi karena **kesalahan input pengguna** (`GalatValidasi`), **kesalahan jaringan/server** (`GalatJaringan`), atau **bug pemrograman** (`TypeError`).

Kita dapat membuat kelas galat khusus dengan mewarisi `Error`, serta meneruskan galat asli tingkat bawah menggunakan opsi **`{ cause: galatAsli }`** (status **Baseline Widely Available** sejak ES2022):

```js
class GalatLayananData extends Error {
  constructor(pesan, { kodeStatus = 500, cause } = {}) {
    // Meneruskan pesan dan opsi { cause } ke konstruktor Error bawaan
    super(pesan, { cause });
    this.name = "GalatLayananData";
    this.kodeStatus = kodeStatus;
  }
}

class GalatValidasiInput extends Error {
  constructor(kolom, pesan) {
    super(`Kolom '${kolom}': ${pesan}`);
    this.name = "GalatValidasiInput";
    this.kolom = kolom;
  }
}

// Contoh menangkap galat tingkat rendah, membungkusnya dengan konteks bisnis yang jelas,
// namun tetap mempertahankan jejak galat aslinya lewat 'cause':
function ambilProfilDariCache(teksJson) {
  try {
    return JSON.parse(teksJson);
  } catch (galatAsli) {
    throw new GalatLayananData(
      "Data profil di penyimpanan lokal rusak dan tidak dapat diurai.",
      { kodeStatus: 422, cause: galatAsli }
    );
  }
}

// Menangani galat secara selektif dengan instanceof (dan melempar ulang galat yang tidak dikenal!)
try {
  ambilProfilDariCache("{ json_rusak ");
} catch (err) {
  if (err instanceof GalatLayananData) {
    console.warn(`[Status ${err.kodeStatus}] ${err.message}`);
    console.warn("Penyebab teknis asli:", err.cause.message);
  } else {
    // Jangan menelan bug tak terduga! Lempar ulang jika bukan galat yang kita antisipasi.
    throw err;
  }
}
```

## Kesalahan Umum dan Cara Menghindarinya

1. **Menangkap semua galat di `catch` dan menganggap semuanya adalah satu masalah yang sama:**
   - **Buruk:** Menulis blok `try` sepanjang 50 baris lalu di dalam `catch` langsung menampilkan *"Koneksi internet Anda terputus"*, padahal yang terjadi di dalam `try` adalah `TypeError` akibat salah ketik nama variabel!
   - **Lebih Baik:** Jaga agar blok `try` sekecil dan sespesifik mungkin hanya di sekitar operasi yang memang berisiko gagal, dan periksa tipe galat menggunakan `instanceof` di dalam `catch`.
2. **Menggunakan `return` di dalam blok `finally`:**
   - **Bahaya:** Jika Anda menulis pernyataan `return nilaiLain` di dalam blok `finally`, pernyataan tersebut akan **menimpa nilai `return` dari blok `try` dan bahkan membatalkan `throw` galat dari blok `catch`**! Gunakan `finally` murni hanya untuk pembersihan sumber daya (seperti mematikan indikator *loading* atau menutup koneksi).

## Latihan Praktik: Validator Data Transaksi dengan Custom Error

Buatlah berkas `validasi-transaksi.js` dan jalankan dengan Node.js:
1. Buat `class GalatTransaksi extends Error` yang menerima `(pesan, { kode, cause } = {})`.
2. Buat fungsi `prosesPembayaran(jsonInput)` yang mengurai `jsonInput` dengan `JSON.parse()` (jika gagal, lempar `GalatTransaksi` dengan `kode: "JSON_RUSAK"` dan `cause` berisi galat `SyntaxError` asli).
3. Jika `nominal <= 0`, lempar `GalatTransaksi` dengan `kode: "NOMINAL_TIDAK_SAH"`.
4. Tangkap galat di pemanggil utama dan cetak `err.kode`, `err.message`, serta `err.cause?.message`.

## Kuis Pemahaman

### Soal 1
Mengapa melempar galat dengan `throw new Error("Koneksi terputus")` jauh lebih baik daripada melempar string mentah `throw "Koneksi terputus"`?
- A. Karena `throw "string"` tidak dapat ditangkap oleh blok `catch`.
- B. Karena objek `Error` secara otomatis merekam jejak tumpukan pemanggilan fungsi (*stack trace* pada properti `.stack`) serta menyediakan properti standar `.name`, `.message`, dan `.cause` yang dibutuhkan saat debugging.
- C. Karena `new Error()` otomatis mengirim laporan ke server.
- D. Karena string tidak dapat ditampilkan di `console.error()`.

**Jawaban Benar:** B
**Penjelasan:** Ketika Anda melempar nilai primitif seperti string, Anda kehilangan informasi paling berharga saat melacak bug, yaitu *stack trace* (daftar urutan fungsi dan nomor baris kode tempat galat dilempar). Selain itu, kode pemanggil yang mengharapkan `err.message` akan memperoleh `undefined`.

### Soal 2
Apa kegunaan opsi `{ cause: galatAsli }` saat membuat objek `new Error("Gagal menyimpan pesanan", { cause: galatAsli })`?
- A. Menghentikan eksekusi blok `finally`.
- B. Menyimpan referensi ke objek galat tingkat rendah yang menjadi pemicu awal di dalam properti `err.cause`, sehingga pesan galat tingkat tinggi tetap mudah dipahami tanpa menghilangkan rincian teknis aslinya untuk keperluan log/debugging.
- C. Mengulang eksekusi blok `try` secara otomatis sebanyak tiga kali.
- D. Mengubah tipe galat menjadi `SyntaxError`.

**Jawaban Benar:** B
**Penjelasan:** Dalam arsitektur berlapis, kita sering menangkap galat teknis (seperti kegagalan kueri atau penguraian JSON) dan melempar galat domain yang lebih bermakna. Properti standar `cause` (sejak ES2022) merangkai kedua galat tersebut sehingga jejak akar masalahnya tidak hilang.

### Soal 3
Kapan kode di dalam blok `finally` pada struktur `try...catch...finally` akan dijalankan?
- A. Hanya ketika tidak ada galat yang terjadi di dalam blok `try`.
- B. Hanya ketika galat berhasil ditangkap oleh blok `catch`.
- C. Selalu dijalankan baik ketika blok `try` berhasil hingga selesai, maupun ketika terjadi galat yang ditangkap di `catch`, bahkan sesaat sebelum fungsi keluar akibat perintah `return`.
- D. Hanya ketika pengguna menutup tab peramban.

**Jawaban Benar:** C
**Penjelasan:** Blok `finally` dijamin selalu dieksekusi sebelum alur kontrol meninggalkan struktur `try...catch`, sehingga menjadikannya tempat paling tepat untuk tugas pembersihan seperti menyembunyikan *loading spinner* atau melepas kunci sumber daya.

## Sumber
- [Control flow and error handling — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Standard built-in objects (`Error`) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)
- [ECMAScript Language Specification — TC39](https://tc39.es/ecma262/)
