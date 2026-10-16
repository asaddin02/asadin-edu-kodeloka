# Koleksi Berbasis Kunci: `Map`, `Set` (Metode Himpunan Baru), `WeakMap`, dan `Symbol`

- **Tingkat:** Menengah
- **Ringkasan:** Memilih struktur data yang tepat antara `Map` vs `Object` dan `Set` vs `Array`, memanfaatkan metode operasi himpunan `Set` terbaru (`union`, `intersection`, `difference`), mencegah kebocoran memori dengan `WeakMap`, serta mengenal `Symbol`.

## Mengapa `Object` dan `Array` Saja Tidak Selalu Cukup?

Meskipun `Object` (`{}`) dan `Array` (`[]`) sangat fleksibel, keduanya memiliki keterbatasan struktural ketika menangani ribuan data dinamis:
1. Kunci properti pada `Object` biasa **selalu dipaksa menjadi `string` (atau `Symbol`)**. Anda tidak bisa menjadikan elemen DOM atau objek lain sebagai kunci di dalam `{}`.
2. Memeriksa apakah sebuah nilai ada di dalam `Array` berukuran `100.000` elemen menggunakan `array.includes(x)` membutuhkan pencarian satu per satu dari awal hingga akhir (**O(n)**), sedangkan pencarian pada `Set` berlangsung nyaris instan (**O(1)**)!

## 1. `Map`: Kamus Pasangan Kunci-Nilai Berkinerja Tinggi

**`Map`** menyimpan pasangan kunci-nilai (*key-value pairs*) dengan keunggulan utama dibandingkan `Object` biasa:

| Karakteristik | `Map` (`new Map()`) | `Object` Biasa (`{}`) |
|---|---|---|
| **Tipe Kunci yang Diizinkan** | **Apa saja!** (String, angka, boolean, fungsi, objek lain, bahkan elemen DOM). | Hanya `string` dan `Symbol` (angka `1` otomatis diubah menjadi string `"1"`). |
| **Menghitung Jumlah Item** | Instan melalui properti **`map.size`**. | Harus membuat array dulu lewat `Object.keys(obj).length`. |
| **Keamanan Kunci Masukan Pengguna** | Aman dari benturan dengan properti bawaan prototipe (seperti `"toString"` atau `"constructor"`). | Rawan bentrok dengan `Object.prototype` kecuali dibuat dengan `Object.create(null)`. |
| **Urutan Iterasi** | Dijamin selalu sesuai **urutan penyisipan (*insertion order*)**. | Kunci string angka diurutkan lebih dulu sebelum kunci huruf. |

```js
const sesiAktif = new Map();

// Menambahkan data dengan .set(kunci, nilai)
sesiAktif.set("usr_101", { nama: "Ayu", peran: "admin" });
sesiAktif.set("usr_102", { nama: "Raka", peran: "editor" });

console.log(sesiAktif.size);           // 2
console.log(sesiAktif.has("usr_101")); // true
console.log(sesiAktif.get("usr_101")); // { nama: "Ayu", peran: "admin" }

// Mengiterasi Map secara langsung dengan for...of
for (const [idPengguna, info] of sesiAktif) {
  console.log(`${idPengguna}: ${info.nama} (${info.peran})`);
}

// Menghapus satu item dengan .delete(kunci), atau mengosongkan semua dengan .clear()
sesiAktif.delete("usr_102");
```

> **⚠️ Kesalahan Umum pada `Map`:**
> Jangan mengakses atau mengisi `Map` menggunakan kurung siku seperti objek (`peta["kunci"] = 123`)! Menulis `peta["kunci"]` tidak menyimpan data ke dalam struktur internal `Map` (sehingga `peta.size` tetap `0`), melainkan hanya menempelkan properti objek biasa di luar `Map`. Selalu gunakan metode **`.set(kunci, nilai)`**, **`.get(kunci)`**, **`.has(kunci)`**, dan **`.delete(kunci)`**.

## 2. `Set` dan Metode Operasi Himpunan Matematika Terbaru

**`Set`** adalah koleksi nilai berurutan yang menjamin **setiap nilainya unik (tidak mungkin ada duplikat)**.

Kegunaan paling populer dari `Set`:
1. **Menghapus duplikat dari sebuah Array dalam satu baris:**
   `const daftarUnik = [...new Set(daftarDenganDuplikat)];`
2. **Memeriksa keberadaan item dengan sangat cepat (`set.has(nilai)` — O(1)).**

### Operasi Himpunan `Set` Modern (Baseline Newly Available sejak 2024)
Kini Anda tidak perlu lagi menulis `.filter()` manual untuk mencari irisan atau gabungan dua himpunan. `Set.prototype` telah dilengkapi 7 metode himpunan matematika bawaan:

```js
const keahlianBackend  = new Set(["Go", "PHP", "PostgreSQL", "Docker"]);
const keahlianDevOps   = new Set(["Linux", "Docker", "Kubernetes", "PostgreSQL"]);

// 1. intersection(): Irisan — elemen yang ada di KEDUA himpunan
const irisan = keahlianBackend.intersection(keahlianDevOps);
console.log([...irisan]); // ["PostgreSQL", "Docker"]

// 2. union(): Gabungan seluruh elemen unik dari kedua himpunan
const gabungan = keahlianBackend.union(keahlianDevOps);
console.log([...gabungan]); // ["Go", "PHP", "PostgreSQL", "Docker", "Linux", "Kubernetes"]

// 3. difference(): Selisih — ada di Backend, tetapi TIDAK ada di DevOps
const khususBackend = keahlianBackend.difference(keahlianDevOps);
console.log([...khususBackend]); // ["Go", "PHP"]

// 4. Pemeriksaan hubungan himpunan (menghasilkan boolean):
console.log( new Set(["Go", "PHP"]).isSubsetOf(keahlianBackend) ); // true
```

## 3. Mencegah Kebocoran Memori dengan `WeakMap` dan `WeakSet`

Apa yang terjadi jika Anda menggunakan objek (misalnya simpul elemen DOM `<button>` yang dinamis) sebagai kunci di dalam `Map` biasa, lalu elemen `<button>` tersebut dihapus dari halaman HTML?
- Karena `Map` biasa memegang **referensi kuat (*strong reference*)** ke elemen `<button>` tersebut, *Garbage Collector* **tidak berani membebaskan memori elemen `<button>` itu** selama entri di `Map` belum dihapus secara manual! Inilah penyebab umum kebocoran memori (*memory leak*) pada aplikasi Single-Page Application (SPA).

Solusinya adalah **`WeakMap`** (dan **`WeakSet`**):
- Kunci pada `WeakMap` **wajib berupa Objek** (atau simbol non-registrasi).
- Referensi ke objek kuncinya bersifat **lemah (*weak reference*)**: begitu objek kunci tersebut tidak lagi dirujuk oleh variabel lain di program (misalnya elemen DOM-nya sudah dihapus dari layar), *Garbage Collector* otomatis menghapus entri tersebut dari `WeakMap` dan membebaskan memorinya!
- Karena isinya dapat dibersihkan sewaktu-waktu oleh *Garbage Collector*, `WeakMap` tidak dapat diiterasi (`for...of`) dan tidak memiliki properti `.size`.

```js
// Menyimpan metadata internal yang terikat pada objek tanpa mencegah Garbage Collection
const metadataKomponen = new WeakMap();

let tombolSementara = { id: "btn-1", teks: "Simpan" };
metadataKomponen.set(tombolSementara, { jumlahKlik: 5 });

console.log(metadataKomponen.get(tombolSementara)); // { jumlahKlik: 5 }

// Ketika referensi ke objek dihapus, entri di WeakMap ikut siap dibersihkan oleh GC!
tombolSementara = null;
```

## 4. `Symbol`: Kunci Properti Unik yang Bebas Benturan

`Symbol` adalah tipe primitif yang setiap pemanggilannya dijamin menghasilkan nilai unik yang tidak pernah sama (`Symbol("id") !== Symbol("id")`). Ia digunakan untuk:
1. Menambahkan properti tersembunyi/internal pada objek tanpa khawatir tertimpa oleh kode lain atau ikut tercetak di `JSON.stringify()`.
2. Mendefinisikan perilaku protokol bawaan bahasa melalui *Well-Known Symbols* seperti **`Symbol.iterator`** (yang membuat objek kustom Anda bisa diiterasi dengan `for...of`!).

## Latihan Praktik: Mengelola Hak Akses Pengguna dengan `Map` dan `Set`

Buatlah berkas `hak-akses.js` dan jalankan dengan Node.js:
1. Buat `Map` bernama `peranPengguna` yang memetakan nama peran (`"admin"`, `"penulis"`, `"pembaca"`) ke sebuah objek `Set` berisi daftar izin (*permissions*, misalnya `"baca"`, `"tulis"`, `"terbitkan"`, `"hapus"`).
2. Buat fungsi `punyaIzin(peran, izinYangDicari)` yang memeriksa secara cepat dalam waktu `O(1)` apakah peran tersebut memiliki izin yang diminta.
3. Gunakan metode `.difference()` pada `Set` untuk mencetak izin apa saja yang dimiliki `"admin"` tetapi tidak dimiliki oleh `"penulis"`.

## Kuis Pemahaman

### Soal 1
Apa yang terjadi jika Anda menulis `const peta = new Map(); peta["id"] = 100;`?
- A. Entri `"id"` berhasil disimpan dengan benar ke dalam `Map` dan `peta.size` bernilai `1`.
- B. Penulisan `peta["id"] = 100` hanya menambahkan properti objek biasa pada instans `peta` tanpa memasukkannya ke dalam struktur data internal `Map`, sehingga `peta.get("id")` bernilai `undefined` dan `peta.size` tetap `0`.
- C. Mesin JavaScript melempar `SyntaxError`.
- D. Kunci `"id"` otomatis dihapus setelah 1 detik.

**Jawaban Benar:** B
**Penjelasan:** Untuk menyimpan dan membaca data di dalam struktur internal `Map`, Anda wajib menggunakan metode `.set(key, value)` dan `.get(key)`. Menggunakan kurung siku `peta["id"]` memperlakukannya sebagai properti objek umum biasa yang diabaikan oleh operasi `Map`.

### Soal 2
Mengapa kita memilih `WeakMap` dibandingkan `Map` biasa ketika ingin mengaitkan data tambahan pada objek elemen DOM yang sering dibuat dan dihapus secara dinamis?
- A. Karena `WeakMap` dapat menyimpan kunci berupa angka dan boolean dengan lebih cepat.
- B. Karena `WeakMap` memegang referensi lemah (*weak reference*) terhadap objek kuncinya, sehingga ketika elemen DOM tersebut dihapus dari dokumen dan tidak lagi memiliki referensi lain, *Garbage Collector* dapat langsung membebaskan memorinya tanpa menyebabkan kebocoran memori (*memory leak*).
- C. Karena `WeakMap` otomatis menyimpan datanya ke `localStorage`.
- D. Karena `WeakMap` memiliki metode `.map()` dan `.filter()`.

**Jawaban Benar:** B
**Penjelasan:** Pada `Map` biasa, referensi ke objek kunci bersifat kuat sehingga mencegah *Garbage Collector* membersihkan objek tersebut meskipun sudah tidak dipakai di bagian program lain. `WeakMap` mengizinkan pembersihan memori otomatis begitu objek kuncinya tidak lagi terjangkau.

### Soal 3
Diberikan dua himpunan: `const a = new Set([1, 2, 3]);` dan `const b = new Set([2, 3, 4]);`. Metode `Set` manakah yang menghasilkan himpunan baru berisi `Set { 1 }` (elemen yang ada di `a`, tetapi tidak ada di `b`)?
- A. `a.intersection(b)`
- B. `a.union(b)`
- C. `a.difference(b)`
- D. `a.symmetricDifference(b)`

**Jawaban Benar:** C
**Penjelasan:** Metode `a.difference(b)` mengembalikan objek `Set` baru yang berisi elemen-elemen yang terdapat di dalam himpunan `a` namun tidak terdapat di dalam himpunan `b` (yaitu `{ 1 }`). Adapun `symmetricDifference` akan mengembalikan elemen yang tidak beririsan dari kedua sisi (`{ 1, 4 }`).

## Sumber
- [Keyed collections (`Map`, `Set`, `WeakMap`, `WeakSet`) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections)
- [`Map` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [Standard built-in objects (`Set`) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)
