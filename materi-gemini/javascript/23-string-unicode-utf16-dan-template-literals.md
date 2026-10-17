# String Mendalam, Unicode UTF-16, Surrogate Pairs, dan Tagged Template Literals

- **Tingkat:** Menengah
- **Ringkasan:** Membedah bagaimana JavaScript menyimpan string sebagai urutan unit kode UTF-16 (`'🚀'.length` bernilai 2), iterasi titik kode Unicode, normalisasi karakter (`normalize('NFC')`), metode manipulasi string modern, serta pembuatan *Tagged Template Literals* untuk sanitasi otomatis.

## Mengapa `'🚀'.length` Bernilai `2` dan Bagaimana Cara Memotong String Tanpa Merusak Emoji?

Ketika JavaScript diciptakan pada tahun 1995, mesin bahasa ini dirancang untuk menyimpan setiap string sebagai deretan **unit kode 16-bit (UTF-16 code units)**. Karakter dasar dalam *Basic Multilingual Plane* (BMP)—seperti huruf Latin (`A`–`Z`), angka, dan aksara umum (`U+0000` s.d. `U+FFFF`)—cukup disimpan dalam **1 unit kode 16-bit**.

Namun, karakter di bidang tambahan (*astral planes* di atas `U+FFFF`), seperti emoji (`🚀` = `U+1F680`), simbol matematika, dan aksara historis, membutuhkan **2 unit kode 16-bit berpasangan** yang disebut **Surrogate Pair** (satu *high surrogate* `0xD800`–`0xDBFF` dan satu *low surrogate* `0xDC00`–`0xDFFF`). Properti `.length`, pengindeksan `str[0]`, dan metode `.slice()` semuanya menghitung **unit kode UTF-16**, bukan karakter utuh!

> **⚠️ Jebakan Umum di Lapangan:** Memotong string yang mengandung emoji atau aksara non-Latin menggunakan `.slice(0, n)` atau `.substring()` biasa dapat membelah pasangan *surrogate pair* UTF-16 di tengah jalan dan menghasilkan karakter rusak (`\uFFFD` / tanda tanya berlian).

## 1. Perbandingan Operasi String Berbasis Unit UTF-16 vs Titik Kode Unicode

Perhatikan perbedaan perilaku API string JavaScript saat berhadapan dengan karakter di luar BMP:

| Operasi / Metode | Satuan yang Dihitung | Hasil pada `"Halo 🚀"` | Keterangan Teknis |
| :--- | :--- | :--- | :--- |
| `teks.length` | Unit kode UTF-16 (16-bit) | `7` | `H`, `a`, `l`, `o`, spasi (5 unit) + `🚀` (2 unit surrogate pair). |
| `teks[5]` / `teks.charCodeAt(5)` | Unit kode UTF-16 tunggal | `"\uD83D"` / `55357` | Membelah emoji menjadi *lone surrogate* yang tidak valid! |
| `[...teks].length` / `for..of` | **Titik kode Unicode (*Code Points*)** | `6` | Iterator `String.prototype[Symbol.iterator]` mengenali surrogate pair secara utuh. |
| `teks.codePointAt(5)` | Titik kode Unicode utuh | `128640` (`0x1F680`) | Mengembalikan nilai titik kode penuh dari emoji `🚀`. |
| `teks.isWellFormed()` / `toWellFormed()` | Validitas pasangan UTF-16 | `true` / string bersih | Memeriksa atau mengganti *lone surrogate* rusak dengan `\uFFFD` (Baseline Newly Available sejak Maret 2024). |

## 2. Iterasi Titik Kode, Normalisasi `normalize('NFC')`, dan *Tagged Template Literals*

Selain masalah *surrogate pair*, huruf beraksen seperti `é` dapat ditulis dalam dua representasi Unicode berbeda yang terlihat sama persis di layar: satu titik kode gabungan `U+00E9` (**NFC**) atau huruf `e` (`U+0065`) diikuti tanda aksen `U+0301` (**NFD**). Tanpa memanggil **`.normalize("NFC")`** sebelum membandingkan atau menyimpan nama pengguna, pencarian string bisa gagal (`"\u00e9" === "e\u0301"` bernilai `false`!).

Sementara itu, **Tagged Template Literals** memungkinkan Anda memanggil fungsi tepat di depan string ber-backtick (`` tagFn`Halo ${nama}` ``). Fungsi tag menerima array potongan string statis sebagai argumen pertama dan nilai-nilai ekspresi `${...}` sebagai argumen sisanya—sangat ampuh untuk meng-escape HTML atau menyusun parameter kueri secara otomatis:

```javascript
// 1. Perbedaan panjang UTF-16 code units vs Unicode code points
const teks = "Halo 🚀";
console.log(teks.length);         // 7 (karena emoji 🚀 memakan 2 unit UTF-16)
console.log([...teks].length);    // 6 (iterasi berdasarkan Unicode code point)

// 2. Normalisasi Unicode sebelum membandingkan teks
const namaDariMac = "Cafe\u0301"; // NFD (5 code points)
const namaDariWin = "Caf\u00e9";  // NFC (4 code points)
console.log(namaDariMac === namaDariWin); // false!
console.log(namaDariMac.normalize("NFC") === namaDariWin.normalize("NFC")); // true

// 3. Tagged Template Literal untuk menyaring sisipan variabel
function sqlLog(strings, ...values) {
  return strings.reduce((hasil, str, i) => {
    const val = i < values.length ? JSON.stringify(values[i]) : "";
    return hasil + str + val;
  }, "");
}
const email = "rina@example.com";
console.log(sqlLog`Mencari pengguna dengan email=${email}`);
```

Berikut adalah contoh fungsi *Tagged Template Literal* `htmlAman` yang meng-escape seluruh variabel dinamis agar aman dari injeksi XSS tanpa meng-escape tag HTML statis di dalam template:

```javascript
const PETA_ESCAPE = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (ch) => PETA_ESCAPE[ch]);

export function htmlAman(potonganStatis, ...nilaiDinamis) {
  return potonganStatis.reduce((akum, str, i) => {
    const sisipan = i < nilaiDinamis.length ? escapeHtml(nilaiDinamis[i]) : "";
    return akum + str + sisipan;
  }, "");
}

const komentarPengguna = `<script>alert("xss")</script>`;
console.log(htmlAman`<p class="komentar">${komentarPengguna}</p>`);
// '<p class="komentar">&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</p>'
```

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Memotong teks pratinjau dengan `teks.slice(0, 10)` tanpa memedulikan titik kode:** Jika indeks ke-10 jatuh tepat di tengah *surrogate pair* emoji, hasil potongannya akan berakhiran *lone surrogate* rusak. Gunakan `[...teks].slice(0, 10).join("")` (atau `Intl.Segmenter` untuk kluster grafem gabungan seperti emoji keluarga `👨‍👩‍👧‍👦`, lihat pelajaran 53).
2. **Membandingkan nama berkas atau nama pengguna tanpa `.normalize("NFC")`:** Sistem operasi macOS (APFS/HFS+) sering memakai normalisasi bentuk terurai (NFD), sedangkan Windows dan Linux memakai bentuk terkomposisi (NFC). Selalu panggil `.normalize("NFC")` saat menerima input teks di backend maupun frontend.
3. **Menggunakan `.replace("lama", "baru")` dan mengira semua kemunculan terganti:** `.replace()` dengan argumen pertama berupa string hanya mengganti kemunculan **pertama**. Gunakan **`.replaceAll("lama", "baru")`** untuk mengganti seluruh kemunculan.

## Latihan Praktik Mandiri

1. Buat berkas `teks-util.mjs` yang mengekspor fungsi `potongAman(teks, maksTitikKode)` menggunakan `[...teks.normalize("NFC")]` dan menambahkan `"…"` bila dipotong, serta memastikan hasilnya valid dengan `.toWellFormed()`.
2. Buat fungsi *Tagged Template* `buatUrlAman` yang secara otomatis menerapkan `encodeURIComponent()` pada setiap ekspresi `${...}` yang disisipkan ke dalam query string URL.
3. Tulis pengujian otomatis menggunakan `node:test` untuk memverifikasi kedua fungsi tersebut dengan masukan berisi emoji `🚀`, karakter beraksen `é`, dan karakter spesial `&`/`=`.

## Kuis Pemahaman

### Soal 1
Mengapa evaluasi ekspresi `"🚀".length` menghasilkan `2` sedangkan `[..."🚀"].length` menghasilkan `1`?
- A. Karena operator spread `[...]` menghapus karakter spasi tersembunyi di belakang emoji
- B. Karena properti `.length` pada string menghitung jumlah unit kode UTF-16 16-bit (di mana emoji `🚀` disimpan sebagai pasangan *surrogate pair* 2 unit), sedangkan iterator string `[...teks]` mengiterasi berdasarkan titik kode Unicode (*code points*) utuh
- C. Karena `"🚀"` merupakan tipe data `BigInt`
- D. Karena array di JavaScript dimulai dari indeks `1`

**Jawaban Benar:** B
**Penjelasan:** String JavaScript menggunakan pengodean UTF-16 sehingga karakter di luar *Basic Multilingual Plane* (`> U+FFFF`) menempati 2 unit kode UTF-16 (`length === 2`). Sebaliknya, protokol iterasi string (`for...of` dan `[...teks]`) berjalan per titik kode Unicode.

### Soal 2
Dalam sebuah fungsi *Tagged Template Literal* `function formatPesan(strings, ...values)` yang dipanggil dengan sintaks `` formatPesan`Halo ${nama}, skor Anda ${skor}!` ``, apa isi dari parameter `strings` dan `values`?
- A. `strings` berisi `["Halo ", ", skor Anda ", "!"]`, sedangkan `values` berisi `[nama, skor]`
- B. `strings` berisi string gabungan utuh, sedangkan `values` bernilai `undefined`
- C. `strings` berisi `[nama, skor]`, sedangkan `values` berisi `["Halo ", ", skor Anda ", "!"]`
- D. Keduanya berupa objek `RegExp`

**Jawaban Benar:** A
**Penjelasan:** Pada *Tagged Template Literal*, argumen pertama (`strings`) adalah array berisi potongan teks literal statis di antara ekspresi (selalu berjumlah `values.length + 1`), sedangkan `...values` menampung hasil evaluasi setiap `${...}`.

### Soal 3
Metode string standar manakah yang digunakan untuk menyamakan representasi biner Unicode antara karakter beraksen gabungan (`"e\u0301"`) dan karakter beraksen tunggal (`"\u00e9"`) agar perbandingan `===` menghasilkan `true`?
- A. `teks.toLocaleUpperCase()`
- B. `teks.normalize("NFC")`
- C. `teks.padStart(2, "0")`
- D. `teks.charCodeAt(0)`

**Jawaban Benar:** B
**Penjelasan:** `String.prototype.normalize("NFC")` mengubah urutan karakter yang ekuivalen secara kanonis ke bentuk *Normalization Form Canonical Composition* yang seragam.

## Sumber

- [`String` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- [Template literals — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
- [TC39 ECMAScript® Language Specification](https://tc39.es/ecma262/)
