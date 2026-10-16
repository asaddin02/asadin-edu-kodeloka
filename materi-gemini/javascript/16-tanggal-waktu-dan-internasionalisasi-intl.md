# Penanganan Tanggal, Zona Waktu, `Intl` API, dan Pengantar `Temporal`

- **Tingkat:** Menengah
- **Ringkasan:** Mengelola waktu dengan aman menggunakan format ISO 8601 (UTC), memformat tanggal, mata uang Rupiah, selisih waktu relatif (*"3 hari yang lalu"*), dan daftar kalimat secara presisi menggunakan API bawaan **`Intl`**, serta mengenal objek modern **`Temporal`**.

## 1. Aturan Emas Menangani Tanggal dan Waktu (`Date`) di Aplikasi Web

Objek bawaan `Date` di JavaScript sebenarnya menyimpan satu angka sederhana di balik layar: **jumlah milidetik yang telah berlalu sejak 1 Januari 1970 00:00:00 UTC (*Unix Epoch*)**.

Namun, `new Date()` memiliki beberapa jebakan warisan tahun 1995 yang wajib Anda waspadai:
1. **Indeks Bulan Dimulai dari `0` (`0` = Januari, `11` = Desember), sedangkan Tanggal Hari Dimulai dari `1`!**
   Menulis `new Date(2026, 10, 16)` **bukanlah** 16 Oktober 2026, melainkan **16 November 2026**!
2. **Perbedaan Penguraian String Tanggal:**
   - Selalu gunakan format standar **ISO 8601 lengkap dengan zona waktu** saat bertukar data antara klien dan server: **`"2026-10-16T07:30:00.000Z"`** (akhiran `Z` berarti UTC) atau **`"2026-10-16T14:30:00+07:00"`** (WIB).
   - Gunakan `new Date().toISOString()` untuk menghasilkan string waktu UTC standar yang siap dikirim ke API/database.

```js
const sekarang = new Date("2026-10-16T07:30:00.000Z");

// Mendapatkan timestamp milidetik saat ini secara cepat:
const capWaktuMs = Date.now();
console.log(sekarang.toISOString()); // "2026-10-16T07:30:00.000Z"
```

## 2. Kekuatan API Internasionalisasi Bawaan (`Intl`) — Tanpa Pustaka Berat!

Di masa lalu, pengembang sering memasang pustaka tanggal dan pemformatan berukuran ratusan kilobyte hanya untuk menampilkan `"Jumat, 16 Oktober 2026"`, `"Rp 1.250.000"`, atau `"2 jam yang lalu"`.

Kini, mesin JavaScript di semua peramban dan Node.js sudah memiliki namespace bawaan **`Intl` (ECMA-402)** yang sangat cepat, akurat untuk Bahasa Indonesia (`"id-ID"`), dan berukuran `0 KB`!

### A. Memformat Tanggal dan Zona Waktu (`Intl.DateTimeFormat`)
Anda bahkan dapat menentukan **`timeZone: "Asia/Jakarta"`** (WIB), `"Asia/Makassar"` (WITA), atau `"Asia/Jayapura"` (WIT) secara eksplisit agar tampilan waktu selalu konsisten:

```js
const waktuServer = new Date("2026-10-16T07:30:00Z");

const pemformatTanggalWib = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "Asia/Jakarta"
});

console.log(pemformatTanggalWib.format(waktuServer));
// Keluaran: "Jumat, 16 Oktober 2026 pukul 14.30"
```

### B. Memformat Mata Uang Rupiah, Persentase, dan Angka Ringkas (`Intl.NumberFormat`)

```js
// 1. Format Mata Uang Rupiah
const formatRupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
});
console.log(formatRupiah.format(1250000)); // "Rp 1.250.000"

// 2. Format Angka Ringkas (mis. untuk jumlah tayangan "1,2 rb" atau "3,5 jt")
const formatRingkas = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  compactDisplay: "short"
});
console.log(formatRingkas.format(14500)); // "15 rb" (bawaannya dibulatkan ke dua digit signifikan; tambahkan maximumFractionDigits: 1 untuk "14,5 rb")
```

### C. Waktu Relatif (`Intl.RelativeTimeFormat`) dan Daftar Kalimat (`Intl.ListFormat`)

```js
// 1. Menampilkan "3 hari yang lalu" atau "dalam 2 bulan"
const formatRelatif = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });
console.log(formatRelatif.format(-1, "day"));   // "kemarin"
console.log(formatRelatif.format(-3, "day"));   // "3 hari yang lalu"
console.log(formatRelatif.format(2, "hour"));   // "dalam 2 jam"

// 2. Menggabungkan array menjadi kalimat alami dengan kata hubung "dan" / "atau"
const formatDaftar = new Intl.ListFormat("id-ID", {
  style: "long",
  type: "conjunction"
});
console.log(formatDaftar.format(["HTML", "CSS", "JavaScript", "PHP"]));
// Keluaran: "HTML, CSS, JavaScript, dan PHP"
```

> **💡 Tips Performa Penting untuk `Intl`:**
> Membuat instans `new Intl.DateTimeFormat(...)` atau `new Intl.NumberFormat(...)` membutuhkan pembacaan tabel bahasa di awal. Jika Anda memformat 1.000 baris di dalam tabel, **buat objek formatter-nya satu kali di luar perulangan**, lalu panggil metode `.format(...)` di dalam perulangan (jauh lebih cepat daripada memanggil `.toLocaleString()` berulang-ulang di setiap baris!).

## 3. Masa Depan Tanggal di JavaScript: Mengenal Objek `Temporal`

Karena objek `Date` klasik bersifat *mutable* (memanggil `tanggal.setMonth(5)` mengubah objek aslinya di tempat!) dan tidak memisahkan konsep "Tanggal Kalender Murni tanpa Jam" dari "Titik Waktu Zona Tertentu", TC39 menghadirkan API global baru bernama **`Temporal`** (sudah didukung Chrome/Edge 144+ dan Firefox 139+, tetapi belum Baseline karena Safari belum merilisnya; Node.js 24 juga belum mengaktifkannya secara bawaan):
- Semua objek `Temporal` bersifat **100% Immutable** (seperti `DateTimeImmutable` di PHP).
- Indeks bulan dimulai secara wajar dari **`1` (Januari) hingga `12` (Desember)**!
- Memisahkan tipe dengan tegas:
  - `Temporal.Now.instant()` (titik waktu eksak UTC)
  - `Temporal.PlainDate.from("2026-10-16")` (tanggal kalender murni, misalnya tanggal lahir atau hari libur)
  - `Temporal.ZonedDateTime` (waktu lengkap dengan zona waktu IANA seperti `[Asia/Jakarta]`).

```js
// Penggunaan progresif Temporal jika sudah tersedia di lingkungan runtime:
if ("Temporal" in globalThis) {
  const hariIni = Temporal.PlainDate.from("2026-10-16");
  const mingguDepan = hariIni.add({ days: 7 });
  console.log(mingguDepan.toString()); // "2026-10-23" (hariIni tetap utuh "2026-10-16"!)
}
```

## Latihan Praktik: Modul Utilitas Pemformatan Lokal Indonesia

Buatlah berkas `lokalisasi-id.js` dan jalankan dengan Node.js:
1. Buat satu instans `Intl.NumberFormat` untuk Rupiah, satu `Intl.DateTimeFormat` untuk zona waktu `"Asia/Jakarta"`, dan satu `Intl.ListFormat`.
2. Buat fungsi `formatKartuKursus({ judul, harga, diperbaruiPada, prasyarat })` yang mengembalikan objek dengan harga berformat Rupiah, tanggal pembaruan berformat WIB, dan daftar prasyarat yang dirangkai menjadi kalimat Bahasa Indonesia yang rapi.

## Kuis Pemahaman

### Soal 1
Tanggal berapakah yang direpresentasikan oleh pemanggilan konstruktor `new Date(2026, 0, 15)` di JavaScript?
- A. 15 Oktober 2026
- B. 15 Januari 2026
- C. 1 Januari 2026
- D. Melempar `RangeError` karena bulan tidak boleh bernilai `0`.

**Jawaban Benar:** B
**Penjelasan:** Pada konstruktor `new Date(year, monthIndex, day)` klasik di JavaScript, parameter kedua (`monthIndex`) berbasis nol (`0` = Januari, `1` = Februari, ..., `11` = Desember), sedangkan parameter tanggal hari (`day`) dimulai dari `1`.

### Soal 2
Mengapa saat memformat 500 angka harga barang di dalam perulangan kita disarankan membuat `const fmt = new Intl.NumberFormat("id-ID", ...)` satu kali di luar perulangan lalu memanggil `fmt.format(harga)`, daripada memanggil `harga.toLocaleString("id-ID", ...)` di setiap iterasi?
- A. Karena `toLocaleString()` tidak mendukung mata uang `IDR`.
- B. Karena `harga.toLocaleString()` harus menginisialisasi konfigurasi lokalisasi berulang kali pada setiap putaran perulangan, sedangkan membuat instans `Intl.NumberFormat` satu kali memungkinkan penggunaan ulang mesin pemformat yang sama dengan sangat cepat.
- C. Karena `toLocaleString()` selalu membulatkan angka ke ribuan terdekat.
- D. Karena `Intl.NumberFormat` berjalan di sisi server.

**Jawaban Benar:** B
**Penjelasan:** Inisialisasi objek `Intl.*Format` memuat aturan lokal dan simbol mata uang ke memori. Menyimpan instansnya di sebuah konstanta dan memanggil `.format()` berulang kali menghindari biaya inisialisasi berulang.

### Soal 3
Kelas bawaan manakah dari namespace `Intl` yang dirancang khusus untuk mengubah array `["HTML", "CSS", "JavaScript"]` menjadi string `"HTML, CSS, dan JavaScript"` sesuai kaidah tanda baca bahasa tujuan?
- A. `Intl.PluralRules`
- B. `Intl.ListFormat`
- C. `Intl.Segmenter`
- D. `Intl.Collator`

**Jawaban Benar:** B
**Penjelasan:** `Intl.ListFormat` memformat daftar item dengan kata hubung yang tepat sesuai bahasa dan tipe yang dipilih (`type: "conjunction"` untuk *"dan"*, atau `type: "disjunction"` untuk *"atau"*).

## Sumber
- [`Intl` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [`Date` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [`Temporal` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)
- [Numbers and Dates — TC39 ECMAScript Specification](https://tc39.es/ecma262/multipage/numbers-and-dates.html)
