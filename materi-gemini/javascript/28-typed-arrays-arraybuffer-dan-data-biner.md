# Pengolahan Data Biner: `ArrayBuffer`, `Uint8Array`, `DataView`, `Blob`, dan `TextEncoder`

- **Tingkat:** Lanjut
- **Ringkasan:** Memanipulasi memori biner mentah secara langsung di JavaScript menggunakan `ArrayBuffer`, `Uint8Array`, dan `DataView` (pengaturan *endianness*), mengonversi teks UTF-8 ke byte dengan `TextEncoder`/`TextDecoder`, serta mengelola objek berkas `Blob` dan `File`.

## Mengapa JavaScript Membutuhkan `ArrayBuffer` dan `TypedArray`?

Ketika aplikasi web memproses gambar di `<canvas>`, mengenkripsi data dengan Web Crypto API, mengirim paket audio/video lewat WebSockets/WebRTC, atau memvalidasi *magic bytes* berkas yang diunggah pengguna, bekerja dengan array JavaScript biasa (`[255, 0, 128]`) sangat boros memori dan lambat.

Untuk menangani data biner berkinerja tinggi, ECMAScript menyediakan arsitektur dua lapis:
1. **`ArrayBuffer`:** Sebongkah blok memori biner mentah berukuran tetap (atau dapat diperbesar hingga `maxByteLength`) yang **tidak dapat dibaca atau ditulis secara langsung**.
2. **Views (`TypedArray` seperti `Uint8Array` dan `DataView`):** "Kacamata" penafsir yang ditempelkan di atas `ArrayBuffer` untuk membaca dan menulis byte-byte di dalamnya sebagai bilangan bulat 8-bit, 16-bit, 32-bit, atau pecahan float.

> **⚠️ Jebakan Umum di Lapangan:** Menggunakan `atob()` dan `btoa()` warisan secara langsung pada string UTF-8 yang mengandung karakter di luar Latin1 (seperti aksara non-ASCII atau emoji) akan melempar `InvalidCharacterError`; selalu konversi melalui `Uint8Array` atau `TextEncoder` terlebih dahulu.

## 1. Perbandingan Komponen Pengolahan Data Biner di JavaScript

Pahami peran masing-masing kelas biner standar berikut agar tidak tertukar saat menggunakannya:

| Kelas / API | Peran Utama | Karakteristik Kunci |
| :--- | :--- | :--- |
| **`ArrayBuffer`** | Alokasi memori biner mentah (`new ArrayBuffer(16)`). | Hanya memiliki `byteLength` dan `.slice()`; butuh *View* untuk diakses isinya. |
| **`Uint8Array`** (dan `TypedArray` lain) | Tampilan array bertipe seragam di atas `ArrayBuffer` (1 elemen = 1 byte `0..255`). | Cepat, mendukung metode array (`.subarray()`, `.set()`), mengikuti *endianness* CPU lokal. |
| **`DataView`** | Pembaca/penulis multi-tipe pada offset byte sembarang di atas `ArrayBuffer`. | Mengizinkan pengaturan **Big-Endian vs Little-Endian** secara eksplisit (`view.getUint32(0, false)`). |
| **`TextEncoder` / `TextDecoder`** | Jembatan konversi antara `string` JavaScript dan byte UTF-8 (`Uint8Array`). | `TextEncoder` selalu menghasilkan UTF-8; `TextDecoder("utf-8", { fatal: true })` melempar `TypeError` jika byte UTF-8 rusak. |
| **`Blob` & `File`** | Objek data biner tak-berubah (*immutable*) lengkap dengan metadata `type` MIME. | Dapat dibaca dengan `await blob.arrayBuffer()`, `await blob.text()`, atau dialirkan dengan `blob.stream()`. |

## 2. Konversi UTF-8 (`TextEncoder`), Pemeriksaan Header Biner (`DataView`), dan Base64 Modern

Berikut adalah cara mengonversi teks UTF-8 menjadi `Uint8Array` serta menggunakan `DataView` untuk memeriksa tanda tangan biner (*magic bytes*) berkas PNG (`89 50 4E 47`):

```javascript
// 1. Mengonversi string UTF-8 ke Uint8Array dan membacanya kembali
const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8", { fatal: true });

const bufferByte = encoder.encode("Kodeloka 🚀");
console.log(bufferByte instanceof Uint8Array); // true
console.log(bufferByte.byteLength);            // 13 byte (8 huruf ASCII + 1 spasi + 4 byte emoji)

const teksKembali = decoder.decode(bufferByte);
console.log(teksKembali);                      // "Kodeloka 🚀"

// 2. Memeriksa Magic Bytes Header Berkas PNG menggunakan DataView (Big-Endian)
export function apakahHeaderPngValid(arrayBuffer) {
  if (arrayBuffer.byteLength < 8) return false;
  const view = new DataView(arrayBuffer);
  // 4 byte pertama PNG selalu: 0x89, 0x50 ('P'), 0x4E ('N'), 0x47 ('G') -> 0x89504E47
  return view.getUint32(0, false) === 0x89504e47;
}
```

> **💡 Fitur Baru Base64 & Hex pada `Uint8Array` (Baseline Newly Available 2025):** Peramban modern dan Node.js kini menyediakan metode bawaan langsung pada `Uint8Array` untuk pengodean Base64 dan Heksadesimal tanpa peretasan `btoa()`:
> - `bufferByte.toBase64()` dan `Uint8Array.fromBase64(strBase64)`
> - `bufferByte.toHex()` dan `Uint8Array.fromHex(strHex)`

## 3. Perbedaan Penting `.subarray()` vs `.slice()` pada `Uint8Array`

Ketika memotong sebagian `Uint8Array`, perhatikan perbedaan besar antara dua metode ini:
- **`uint8.subarray(awal, akhir)`:** **Tidak menyalin memori (*Zero-Copy*)!** Metode ini hanya membuat tampilan (*view*) baru yang masih menunjuk ke `ArrayBuffer` yang sama. Mengubah byte di dalam hasil `subarray` akan ikut mengubah `uint8` asli!
- **`uint8.slice(awal, akhir)`:** Mengalokasikan `ArrayBuffer` baru dan **menyalin byte-nya** secara terpisah.

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menganggap `teks.length` sama dengan jumlah byte UTF-8 (`encoder.encode(teks).byteLength`):** Karakter ASCII memakan 1 byte di UTF-8, tetapi huruf beraksen memakan 2 byte, aksara Asia memakan 3 byte, dan emoji `🚀` memakan **4 byte** di UTF-8! Saat menghitung ukuran byte payload jaringan, selalu gunakan `new TextEncoder().encode(teks).byteLength` atau `new Blob([teks]).size`.
2. **Lupa parameter `littleEndian` pada `DataView`:** Metode `view.getUint16(offset, littleEndian)` dan `view.getUint32(offset, littleEndian)` secara bawaan menggunakan **Big-Endian (`false`)** jika parameter kedua tidak diisi. Jika Anda mengurai format berkas biner Little-Endian (seperti header ZIP atau WAV), wajib teruskan `true` sebagai argumen kedua.
3. **Memanggil `btoa("Halo 🚀")` secara langsung:** `btoa()` hanya menerima karakter Latin1 (`0x00`–`0xFF`) dan akan melempar `InvalidCharacterError` untuk emoji. Gunakan `new TextEncoder().encode("Halo 🚀").toBase64()`.

## Latihan Praktik Mandiri

1. Buat berkas `biner-util.mjs` yang mengekspor fungsi `deteksiFormatBerkas(uint8Array)` untuk mengenali apakah byte awal berkas adalah **PNG** (`89 50 4E 47`), **PDF** (`25 50 44 46` / `%PDF`), atau **ZIP** (`50 4B 03 04`) menggunakan `DataView`.
2. Buat fungsi `utf8KeHex(teks)` dan `hexKeUtf8(hex)` menggunakan `TextEncoder` dan `TextDecoder("utf-8", { fatal: true })`.
3. Uji seluruh skenario (termasuk lemparan `TypeError` saat `hexKeUtf8` diberi urutan byte UTF-8 tidak valid seperti `"fffe"`) dengan `node:test`.

## Kuis Pemahaman

### Soal 1
Mengapa pemanggilan `btoa("Belajar 🚀")` melempar galat `InvalidCharacterError` di peramban, dan bagaimana cara yang benar untuk mengubah teks UTF-8 menjadi byte biner?
- A. Karena `btoa()` hanya menerima angka; gunakan `parseInt()`
- B. Karena `btoa()` warisan memperlakukan setiap unit karakter string sebagai satu byte Latin1 (`0..255`) sehingga gagal pada karakter Unicode di atas `0xFF`; gunakan `new TextEncoder().encode("Belajar 🚀")` untuk menghasilkan `Uint8Array` UTF-8 terlebih dahulu
- C. Karena `btoa()` hanya berjalan di dalam Service Worker
- D. Karena string mengandung karakter spasi

**Jawaban Benar:** B
**Penjelasan:** `btoa()` dirancang sebelum era UTF-8 modern dan menolak karakter dengan titik kode `> 255`. `TextEncoder` mengubah string Unicode apa pun menjadi deretan byte UTF-8 di dalam `Uint8Array`.

### Soal 2
Apa perbedaan antara `uint8.subarray(0, 4)` dan `uint8.slice(0, 4)` pada sebuah instans `Uint8Array`?
- A. `subarray()` membuat tampilan (*view*) baru di atas `ArrayBuffer` memori yang sama tanpa menyalin byte (*zero-copy*), sedangkan `slice()` mengalokasikan `ArrayBuffer` baru dan menyalin byte-nya secara terpisah
- B. `subarray()` menghapus 4 byte pertama dari array asli, sedangkan `slice()` tidak
- C. `slice()` mengembalikan string, sedangkan `subarray()` mengembalikan `Blob`
- D. Keduanya selalu menyalin seluruh isi memori

**Jawaban Benar:** A
**Penjelasan:** `TypedArray.prototype.subarray()` hanya membuat jendela *view* baru dengan offset byte di atas `ArrayBuffer` yang sama (sangat cepat dan hemat RAM), sementara `.slice()` menyalin byte ke `ArrayBuffer` baru yang independen.

### Soal 3
Pada metode `dataView.getUint32(byteOffset, littleEndian)`, urutan byte (*endianness*) apakah yang digunakan secara bawaan apabila argumen kedua (`littleEndian`) tidak diisi atau bernilai `false`?
- A. *Little-Endian* (byte terkecil di alamat memori pertama)
- B. *Big-Endian / Network Byte Order* (byte paling signifikan berada di alamat memori pertama)
- C. Urutan acak tergantung sistem operasi pengguna
- D. Mengembalikan nilai dalam bentuk bilangan biner string

**Jawaban Benar:** B
**Penjelasan:** Berbeda dengan `TypedArray` yang mengikuti arsitektur CPU perangkat (umumnya *little-endian*), metode pada `DataView` secara bawaan menggunakan **Big-Endian** (`littleEndian = false`) kecuali argumen kedua disetel ke `true`.

## Sumber

- [`ArrayBuffer` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- [`Uint8Array` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- [`TextEncoder` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
- [TC39 ECMAScript® Language Specification](https://tc39.es/ecma262/)
