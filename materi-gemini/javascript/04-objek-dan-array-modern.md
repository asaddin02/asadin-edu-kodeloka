# Objek dan Array Modern: Destructuring, Immutability (ES2023+), dan `Object.groupBy`

- **Tingkat:** Menengah
- **Ringkasan:** Mengolah struktur data objek dan array secara bersih menggunakan *destructuring*, operator *spread*, penyalinan mendalam `structuredClone()`, transformasi deklaratif (`map`, `filter`, `reduce`), metode array tak-mutasi ES2023 (`toSorted`, `toSpliced`, `with`), serta pengelompokan `Object.groupBy()`.

## 1. Destructuring dan Spread Operator (`...`)

Dalam aplikasi modern, kita hampir setiap saat mengekstrak data dari respons JSON API atau merangkai objek konfigurasi baru tanpa merusak data aslinya.

### A. Object & Array Destructuring
*Destructuring* memungkinkan Anda membongkar properti objek atau elemen array langsung ke dalam variabel bernama, lengkap dengan **nilai bawaan (*default value*)** dan **penggantian nama (*aliasing*)**:

```js
const responsKelas = {
  id: 101,
  judul: "Dasar JavaScript Modern",
  penulis: { nama: "Tim Kodeloka" }
};

// Mengambil 'judul', mengganti nama 'id' menjadi 'idKelas',
// memberikan nilai bawaan 'tingkat = "Dasar"', dan membongkar objek bersarang 'penulis.nama'
const {
  id: idKelas,
  judul,
  tingkat = "Dasar",
  penulis: { nama: namaPenulis }
} = responsKelas;

console.log(idKelas, judul, tingkat, namaPenulis);
// 101 "Dasar JavaScript Modern" "Dasar" "Tim Kodeloka"
```

### B. Menyalin Objek: *Shallow Copy* (`...`) vs *Deep Copy* (`structuredClone`)
Operator *spread* (`{ ...objekLama }` atau `[ ...arrayLama ]`) membuat **salinan dangkal (*shallow copy*)**: ia menyalin properti tingkat pertama, tetapi objek yang bersarang di dalamnya masih menunjuk ke referensi memori yang sama!

Untuk membuat **salinan mendalam (*deep clone*)** dari objek atau array bersarang secara aman tanpa pustaka eksternal, gunakan fungsi standar web **`structuredClone()`** (status **Baseline Widely Available** sejak 2022):

```js
const negaraAsli = {
  nama: "Indonesia",
  ibuKota: { kota: "Jakarta", pulau: "Jawa" }
};

// Salinan mendalam dengan structuredClone()
const salinanMandiri = structuredClone(negaraAsli);
salinanMandiri.ibuKota.kota = "Nusantara";

console.log(negaraAsli.ibuKota.kota);     // Tetap "Jakarta" (Tidak ikut berubah!)
console.log(salinanMandiri.ibuKota.kota); // "Nusantara"
```

## 2. Transformasi Array Deklaratif: `map`, `filter`, `reduce`, `find`, `some`, `every`

Daripada menulis perulangan `for` panjang yang mencampuradukkan logika penyaringan, perubahan bentuk, dan penjumlahan di satu tempat, gunakan metode array deklaratif yang **tidak mengubah array aslinya**:

```js
const daftarModul = [
  { id: 1, judul: "Tipe Data", durasiMenit: 15, selesai: true },
  { id: 2, judul: "Closure",   durasiMenit: 25, selesai: true },
  { id: 3, judul: "Fetch API", durasiMenit: 20, selesai: false }
];

// 1. filter(): Menyaring elemen yang memenuhi syarat -> menghasilkan Array baru
const modulSelesai = daftarModul.filter((m) => m.selesai);

// 2. map(): Mengubah setiap elemen dengan rumus 1-ke-1 -> menghasilkan Array baru dengan panjang sama
const daftarJudul = daftarModul.map((m) => m.judul);

// 3. reduce(): Merangkum seluruh elemen menjadi satu nilai akhir (selalu berikan nilai awal di argumen ke-2!)
const totalMenit = daftarModul.reduce((akumulator, m) => akumulator + m.durasiMenit, 0);

// 4. find(): Mencari SATU elemen pertama yang cocok (atau undefined jika tidak ditemukan)
const modulBelumSelesai = daftarModul.find((m) => !m.selesai);

// 5. every() dan some(): Menghasilkan boolean (Apakah SEMUA selesai? Apakah ADA minimal satu yang selesai?)
const semuaLulus = daftarModul.every((m) => m.selesai); // false
const adaProgres = daftarModul.some((m) => m.selesai);  // true
```

> **⚠️ Kesalahan Umum pada `.reduce()`:**
> Jangan pernah lupa menyertakan **nilai awal (*initial value*)** sebagai argumen kedua (misalnya angka `0` pada `.reduce((acc, item) => ..., 0)`). Jika Anda memanggil `.reduce()` tanpa nilai awal pada sebuah array yang kebetulan kosong `[]`, JavaScript akan langsung melempar **`TypeError: Reduce of empty array with no initial value`**!

## 3. Metode Array Tak-Mutasi (*Copying Array Methods* — Sejak ES2023)

Selama puluhan tahun, empat metode array klasik di JavaScript memiliki efek samping berbahaya karena **mengubah (*mutate*) array aslinya secara langsung di tempat**:
- `array.sort()` mengubah urutan array asli!
- `array.reverse()` membalik array asli!
- `array.splice()` memotong isi array asli!
- `array[i] = nilaiBaru` mengubah elemen di array asli!

Sejak **ECMAScript 2023** (status **Baseline Widely Available**), hadir pasangan metode baru yang **selalu mengembalikan salinan array baru dan membiarkan array aslinya tetap utuh**:

| Metode Lama (Merusak/Mutasi Array Asli) | Metode Baru ES2023 (Aman / Mengembalikan Array Baru) |
|---|---|
| `arr.sort(fn)` | **`arr.toSorted(fn)`** |
| `arr.reverse()` | **`arr.toReversed()`** |
| `arr.splice(mulai, hapus, ...item)` | **`arr.toSpliced(mulai, hapus, ...item)`** |
| `arr[indeks] = nilaiBaru` | **`arr.with(indeks, nilaiBaru)`** |

```js
const skorAsli = [85, 100, 70, 92];

// Mengurutkan dari terkecil ke terbesar TANPA mengubah skorAsli
const skorUrut = skorAsli.toSorted((a, b) => a - b);

// Mengganti elemen pada indeks ke-2 (70 -> 78) TANPA mengubah skorAsli
const skorKoreksi = skorAsli.with(2, 78);

console.log(skorAsli);    // [85, 100, 70, 92] (Utuh 100%!)
console.log(skorUrut);    // [70, 85, 92, 100]
console.log(skorKoreksi); // [85, 100, 78, 92]
```

> **💡 Jangan Lupa Pembanding Angka `(a, b) => a - b` pada `sort()` / `toSorted()`!**
> Jika Anda memanggil `[10, 2, 100].toSorted()` tanpa fungsi pembanding, JavaScript akan mengubah semua angka menjadi teks string lalu mengurutkannya berdasarkan abjad ASCII, sehingga menghasilkan `[10, 100, 2]`! Untuk mengurutkan angka, selalu berikan `(a, b) => a - b` (naik) atau `(a, b) => b - a` (turun).

### Mengambil Elemen dari Belakang dengan `.at(-1)`
Daripada menulis `daftar[daftar.length - 1]` yang panjang untuk mengambil elemen paling akhir dari sebuah array, gunakan metode **`daftar.at(-1)`** (Baseline Widely Available)!

## 4. Mengelompokkan Data dengan `Object.groupBy()` (Sejak ES2024)

Sebelumnya, mengelompokkan daftar objek berdasarkan kategori mengharuskan penulisan `.reduce()` yang bertele-tele. Sejak **ECMAScript 2024** (status **Baseline Newly Available**), Anda cukup memanggil **`Object.groupBy(iterable, callback)`**:

```js
const inventarisServer = [
  { nama: "db-utama",     wilayah: "jakarta" },
  { nama: "api-gateway",  wilayah: "singapura" },
  { nama: "worker-antre", wilayah: "jakarta" }
];

const perWilayah = Object.groupBy(inventarisServer, (srv) => srv.wilayah);
console.log(perWilayah.jakarta);
// [{ nama: "db-utama", wilayah: "jakarta" }, { nama: "worker-antre", wilayah: "jakarta" }]
```

## Latihan Praktik: Pipeline Analisis Data Nilai Peserta

Buatlah berkas `olah-data.js` dan jalankan dengan Node.js:
1. Sediakan array `peserta` berisi 5 objek `{ nama, kelas, nilai }`.
2. Gunakan `.toSorted((a, b) => b.nilai - a.nilai)` untuk membuat daftar peringkat nilai tertinggi ke terendah tanpa mengubah urutan array `peserta` asli.
3. Gunakan `Object.groupBy()` untuk mengelompokkan peserta menjadi kelompok `"Lulus"` (`nilai >= 75`) dan `"Remedial"` (`nilai < 75`).
4. Hitung rata-rata nilai keseluruhan menggunakan `.reduce(..., 0)`.

## Kuis Pemahaman

### Soal 1
Apa hasil dari pemanggilan `[20, 5, 100, 12].toSorted()` apabila dipanggil **tanpa** argumen fungsi pembanding?
- A. `[5, 12, 20, 100]`
- B. `[100, 12, 20, 5]` (diurutkan sebagai teks string berdasarkan kode karakter UTF-16).
- C. `[100, 20, 12, 5]`
- D. Melempar `TypeError` karena argumen pembanding wajib diisi.

**Jawaban Benar:** B
**Penjelasan:** Secara bawaan, baik `.sort()` maupun `.toSorted()` mengonversi elemen menjadi string lalu membandingkan urutan titik kode karakternya (`"100"` dan `"12"` dimulai dengan karakter `"1"` sehingga diletakkan sebelum `"20"` dan `"5"`). Untuk mengurutkan angka secara numerik, berikan fungsi `(a, b) => a - b`.

### Soal 2
Manakah perbedaan yang tepat antara operator spread `{ ...objek }` dan fungsi `structuredClone(objek)`?
- A. `{ ...objek }` membuat salinan mendalam (*deep copy*), sedangkan `structuredClone(objek)` hanya menyalin properti tingkat pertama.
- B. `{ ...objek }` hanya membuat salinan dangkal (*shallow copy*) sehingga objek yang bersarang di dalamnya masih berbagi referensi memori yang sama, sedangkan `structuredClone(objek)` membuat salinan mendalam (*deep copy*) yang sepenuhnya terpisah.
- C. `structuredClone()` hanya dapat menyalin array berisi angka.
- D. `{ ...objek }` menghapus properti yang bernilai `null`.

**Jawaban Benar:** B
**Penjelasan:** Spread `{ ...objek }` menyalin referensi properti tingkat atas saja. Jika salah satu propertinya berupa objek atau array bersarang, mengubah isi objek bersarang tersebut pada hasil spread akan ikut mengubah objek aslinya. `structuredClone()` menyalin seluruh pohon objek bersarang secara rekursif.

### Soal 3
Metode array ES2023 manakah yang menghasilkan salinan array baru dengan satu elemen pada indeks tertentu diganti nilainya, tanpa memodifikasi array aslinya?
- A. `daftar.splice(indeks, 1, nilaiBaru)`
- B. `daftar.with(indeks, nilaiBaru)`
- C. `daftar.at(indeks, nilaiBaru)`
- D. `daftar.fill(nilaiBaru)`

**Jawaban Benar:** B
**Penjelasan:** Metode `Array.prototype.with(index, value)` adalah versi tak-mutasi (*non-mutating*) dari penugasan `daftar[index] = value`. Ia mengembalikan array baru dengan elemen pada indeks tersebut telah diperbarui, sementara array aslinya tetap utuh.

## Sumber
- [`Array` reference — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [`Array.prototype.map()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [`Array.prototype.reduce()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [ECMAScript Language Specification — TC39](https://tc39.es/ecma262/)
