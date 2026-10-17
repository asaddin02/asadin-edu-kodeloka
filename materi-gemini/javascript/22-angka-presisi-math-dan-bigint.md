# Angka Presisi IEEE 754, Objek `Math`, dan Bilangan Bulat Besar (`BigInt`)

- **Tingkat:** Dasar
- **Ringkasan:** Memahami representasi angka floating-point 64-bit IEEE 754 (`0.1 + 0.2 !== 0.3`), konstanta batas aman `Number.MAX_SAFE_INTEGER`, fungsi pembulatan & acak pada `Math`, serta penghitungan bilangan bulat ukuran tak terbatas dengan `BigInt` (`100n`).

## Mengapa `0.1 + 0.2` Menghasilkan `0.30000000000000004` di JavaScript?

Semua angka bertipe `Number` di JavaScript disimpan di memori sebagai bilangan pecahan biner 64-bit (*double-precision floating-point*) mengikuti standar internasional **IEEE 754**. Dari 64 bit tersebut, **1 bit** menyimpan tanda positif/negatif, **11 bit** menyimpan eksponen, dan **52 bit** menyimpan pecahan (*mantissa/significand*, efektif 53 bit presisi).

Sama seperti pecahan `1/3` tidak dapat ditulis secara tepat dalam desimal basis-10 (`0.3333...`), pecahan desimal `0.1` (`1/10`) dan `0.2` (`2/10`) merupakan pecahan berulang tak terhingga dalam biner basis-2. Ketika dijumlahkan dan dibulatkan pada bit ke-53, hasilnya memiliki sisa pembulatan kecil: `0.30000000000000004`.

> **⚠️ Jebakan Umum di Lapangan:** Menggunakan `Number` biasa untuk menyimpan ID Snowflake 64-bit (seperti ID pesan Twitter/Discord atau ID transaksi bank > `9007199254740991`) atau menghitung saldo uang dalam pecahan desimal `float` tanpa mengonversinya ke satuan terkecil (`sen`/`rupiah` bulat) menyebabkan pembulatan diam-diam yang merusak akurasi finansial.

## 1. Perbandingan `Number`, Satuan Bulat Terkecil, dan `BigInt`

Untuk memilih tipe numerik yang tepat di aplikasi produksi, perhatikan batasan dan karakteristik berikut:

| Karakteristik | `Number` (Float 64-bit IEEE 754) | `Number` Bulat (Satuan Terkecil: Rupiah / Sen) | `BigInt` (Bilangan Bulat Presisi Tak Terbatas) |
| :--- | :--- | :--- | :--- |
| **Sintaks Literal** | `150000`, `150_000`, `3.14` | `150_000` (tanpa desimal) | `1846295839201948573n` (diakhiri huruf `n`) |
| **Rentang Bilangan Bulat Aman** | `-(2^53 - 1)` s.d. `2^53 - 1` (`±9_007_199_254_740_991`) | Maksimal `Number.MAX_SAFE_INTEGER` | Tak terbatas (selama memori RAM mencukupi) |
| **Dukungan Pecahan Desimal** | Ya, namun rawan galat pembulatan biner (`0.1 + 0.2`) | Tidak (pecahan diwakili sebagai sen/basis poin bulat) | **Tidak** (`5n / 2n` memotong desimal menjadi `2n`) |
| **Serialisasi `JSON.stringify()`** | Didukung langsung | Didukung langsung | **Melempar `TypeError`** (wajib diubah ke `.toString()` dulu) |
| **Kasus Penggunaan Terbaik** | Koordinat grafik, animasi, statistik ilmiah umum | Harga barang, diskon, pajak, saldo dompet standar | ID database 64-bit (Snowflake), kriptografi, stempel waktu nanodetik |

## 2. Pemeriksaan `Number.isSafeInteger()`, Perhitungan Uang, dan `BigInt`

Konstanta **`Number.MAX_SAFE_INTEGER`** bernilai `9007199254740991` (`2^53 - 1`). Di atas angka ini, tipe `Number` kehilangan kemampuan membedakan bilangan bulat ganjil dan genap: `9007199254740992 === 9007199254740993` menghasilkan **`true`**! Gunakan **`Number.isSafeInteger(nilai)`** untuk memastikannya:

```javascript
// 1. Masalah presisi IEEE 754 pada pecahan desimal
console.log(0.1 + 0.2); // 0.30000000000000004
// Solusi Finansial: Simpan dalam satuan integer terkecil (Rupiah/Sen)
const hargaBarangRp = 150_000;
const ppnRp = Math.round(hargaBarangRp * 0.11); // 16500

// 2. Batas Aman Number vs BigInt untuk ID 64-bit
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991 (2^53 - 1)
console.log(Number.isSafeInteger(9007199254740991)); // true
console.log(Number.isSafeInteger(9007199254740992)); // false

const idSnowflake = 1846295839201948573n; // Literal BigInt diakhiri 'n'
console.log((idSnowflake + 1n).toString()); // "1846295839201948574" (Presisi terjaga 100%)
```

## 3. Metode Pembulatan Objek `Math` dan Aturan Operasi `BigInt`

Objek bawaan `Math` menyediakan empat fungsi pembulatan dengan perilaku berbeda pada angka negatif:
- **`Math.floor(x)`**: Membulatkan ke bawah menuju `-Infinity` (`Math.floor(-2.3)` menjadi `-3`).
- **`Math.ceil(x)`**: Membulatkan ke atas menuju `+Infinity` (`Math.ceil(-2.3)` menjadi `-2`).
- **`Math.trunc(x)`**: Memotong bagian desimal langsung menuju `0` (`Math.trunc(-2.3)` menjadi `-2`).
- **`Math.round(x)`**: Membulatkan ke bilangan bulat terdekat (`Math.round(2.5)` menjadi `3`).

Perhatikan bahwa metode objek `Math` (seperti `Math.max()`, `Math.round()`, `Math.sqrt()`) **hanya menerima tipe `Number`** dan akan melempar `TypeError: Cannot convert a BigInt value to a number` jika diberi argumen `BigInt`. Demikian pula, Anda tidak boleh mencampur `Number` dan `BigInt` dalam satu operasi aritmetika (`10n + 5` melempar `TypeError`); konversikan secara eksplisit dengan `BigInt(5)` terlebih dahulu:

```javascript
export function serialisasiDenganBigInt(data) {
  // JSON.stringify bawaan melempar TypeError jika bertemu BigInt;
  // gunakan fungsi replacer untuk mengubah BigInt menjadi string
  return JSON.stringify(data, (_kunci, nilai) =>
    typeof nilai === "bigint" ? nilai.toString() : nilai
  );
}

const transaksi = {
  idTransaksi: 9876543210987654321n,
  totalRupiah: 275_000
};
console.log(serialisasiDenganBigInt(transaksi));
// '{"idTransaksi":"9876543210987654321","totalRupiah":275000}'
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan `isNaN(nilai)` global warisan alih-alih `Number.isNaN(nilai)`:** Fungsi global `isNaN("halo")` memaksa konversi string ke angka terlebih dahulu sehingga mengembalikan `true`. Gunakan **`Number.isNaN(nilai)`** yang hanya mengembalikan `true` jika nilai tersebut benar-benar bertipe `number` dan bernilai `NaN`.
2. **Mengurai JSON yang berisi ID 64-bit bulat dengan `JSON.parse()` standar:** Jika backend mengirim `{"id": 1846295839201948573}` sebagai angka JSON, `JSON.parse()` akan membacanya sebagai `Number` dan langsung merusak 3 digit terakhirnya menjadi `1846295839201948700`. Kirim ID 64-bit dari backend sebagai string JSON (`"1846295839201948573"`) lalu ubah ke `BigInt(...)` di klien.
3. **Lupa bahwa pembagian `BigInt` membuang sisa desimal:** Ekspresi `7n / 2n` menghasilkan `3n` (bukan `3.5n`).

## Latihan Praktik Mandiri

1. Buat berkas `kasir.mjs` yang mengekspor fungsi `hitungRincianTagihan(daftarHargaRp, persenDiskon, persenPpn)` menggunakan bilangan bulat Rupiah dan `Math.round()` serta memvalidasi setiap masukan dengan `Number.isSafeInteger()`.
2. Tambahkan fungsi `urutkanIdSnowflake(daftarIdString)` yang mengonversi array string ID 64-bit menjadi `BigInt`, mengurutkannya dengan komparator `(a, b) => (a < b ? -1 : a > b ? 1 : 0)` (karena komparator `Array.prototype.sort` harus mengembalikan `Number`, bukan `BigInt`!), lalu mengembalikannya sebagai string.
3. Uji kedua fungsi tersebut menggunakan `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa menyimpan ID transaksi 64-bit (seperti `1846295839201948573`) ke dalam tipe `Number` biasa di JavaScript berbahaya di lingkungan produksi?
- A. Karena tipe `Number` hanya mendukung angka sampai `32.767`
- B. Karena nilai tersebut melampaui `Number.MAX_SAFE_INTEGER` (`9007199254740991`), sehingga digit terakhirnya akan mengalami pembulatan biner diam-diam dan merusak kecocokan ID transaksi
- C. Karena tipe `Number` otomatis berubah menjadi string jika lebih dari 10 digit
- D. Karena JavaScript menolak angka positif tanpa tanda `+`

**Jawaban Benar:** B
**Penjelasan:** `Number` IEEE 754 hanya memiliki presisi mantissa 53 bit (`Number.MAX_SAFE_INTEGER = 9007199254740991`). Bilangan bulat di atas batas tersebut kehilangan presisi satuan dan wajib ditangani sebagai `BigInt` atau string.

### Soal 2
Apa hasil dari evaluasi ekspresi `11n / 4n` dan `JSON.stringify({ id: 10n })` di JavaScript?
- A. `11n / 4n` menghasilkan `2.75n`, dan `JSON.stringify` menghasilkan `'{"id":10n}'`
- B. `11n / 4n` menghasilkan `2n` (bagian pecahan dipotong menuju nol), sedangkan `JSON.stringify({ id: 10n })` melempar `TypeError` kecuali diberikan fungsi *replacer*
- C. Keduanya menghasilkan `NaN`
- D. `11n / 4n` menghasilkan `3n`, dan `JSON.stringify` menghasilkan `'{"id":10}'`

**Jawaban Benar:** B
**Penjelasan:** `BigInt` hanya merepresentasikan bilangan bulat sehingga pembagian `11n / 4n` membuang sisa pecahan menjadi `2n`. Selain itu, spesifikasi `JSON.stringify()` tidak menyerialisasi `BigInt` secara bawaan dan melempar `TypeError`.

### Soal 3
Manakah pernyataan yang paling tepat mengenai fungsi `Number.isSafeInteger(nilai)`?
- A. Merupakan metode standar ECMAScript yang mengembalikan `true` hanya jika `nilai` bertipe `number`, merupakan bilangan bulat, dan berada di dalam rentang `-(2^53 - 1)` hingga `2^53 - 1` tanpa melakukan konversi tipe paksa
- B. Mengubah string `"123"` menjadi `BigInt` secara otomatis
- C. Mengembalikan `true` untuk nilai `BigInt` sebesar `999999999999999999999n`
- D. Hanya tersedia di Node.js dan tidak berjalan di peramban web

**Jawaban Benar:** A
**Penjelasan:** `Number.isSafeInteger(nilai)` memeriksa apakah argumen bertipe `number` dan merupakan integer dalam batas presisi aman IEEE 754 (`±9007199254740991`).

## Sumber

- [`Number` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
- [`BigInt` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
- [`Math` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)
- [TC39 ECMAScript® Language Specification](https://tc39.es/ecma262/)
