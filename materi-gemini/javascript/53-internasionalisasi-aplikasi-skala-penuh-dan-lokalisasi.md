# Arsitektur Lokalisasi (i18n & l10n) Aplikasi Web: PluralRules, Segmenter, dan Kamus Bahasa

- **Tingkat:** Lanjut
- **Ringkasan:** Membangun sistem penerjemahan dan lokalisasi aplikasi menggunakan API internasionalisasi bawaan peramban: memecah kata/kalimat lintas bahasa secara akurat dengan **`Intl.Segmenter`**, mengurutkan string sesuai abjad lokal dengan **`Intl.Collator`**, serta menangani aturan bentuk jamak dengan **`Intl.PluralRules`**.

## Mengapa `teks.split(' ')`, `[...teks]`, dan `.sort()` Biasa Gagal pada Aplikasi Multibahasa?

Banyak operasi teks yang tampak mudah dalam bahasa Inggris atau bahasa Indonesia langsung hancur ketika aplikasi Anda digunakan oleh pengguna global atau memuat emoji modern:
1. **Menghitung kata dengan `teks.split(" ")`:** Bahasa Jepang, Mandarin, dan Thailand **tidak menggunakan spasi di antara kata**! Sebuah kalimat sepanjang 20 kata dalam bahasa Jepang akan dihitung sebagai `1` kata oleh `.split(" ")`.
2. **Menghitung karakter tampak (*grapheme*) dengan `[...teks].length`:** Emoji gabungan seperti keluarga `👨‍👩‍👧‍👦` atau bendera `🇮🇩` terdiri dari beberapa titik kode Unicode yang diikat oleh *Zero-Width Joiner* (`\u200D`). `[..."👨‍👩‍👧‍👦"].length` menghasilkan **`7`**, padahal di layar pengguna itu hanya **1 karakter emoji**!
3. **Mengurutkan daftar judul dengan `.sort()`:** Pembanding bawaan `.sort()` mengurutkan berdasarkan kode UTF-16 sehingga `"Modul 10"` diletakkan **sebelum** `"Modul 2"`!

Standar internasionalisasi **ECMA-402 (`Intl`)** menyediakan tiga API khusus yang telah tertanam langsung di peramban dan Node.js untuk menyelesaikan ketiganya: **`Intl.Segmenter`**, **`Intl.Collator`**, dan **`Intl.PluralRules`**.

> **⚠️ Jebakan Umum di Lapangan:** Menghitung jumlah kata dengan `teks.split(' ').length` gagal pada tanda baca yang menempel dan sama sekali tidak berfungsi pada bahasa yang tidak menggunakan spasi antar-kata (seperti bahasa Jepang, Mandarin, atau Thailand); gunakan `Intl.Segmenter`.

## 1. Perbandingan Tiga API Pemrosesan Bahasa pada `Intl`

Berikut adalah kemampuan masing-masing kelas di dalam namespace `Intl` (ketiganya berstatus **Baseline Widely Available**):

| Kelas `Intl` | Opsi Konfigurasi Utama | Masalah yang Diselesaikan |
| :--- | :--- | :--- |
| **`Intl.Segmenter(locale, { granularity })`** | `granularity`: **`"grapheme"`** (bawaan), **`"word"`**, atau **`"sentence"`**. | Memecah teks menjadi karakter visual utuh (*grapheme clusters*), kata-kata (`segmen.isWordLike`), atau kalimat sesuai kamus tata bahasa lokal. |
| **`Intl.Collator(locale, options)`** | `numeric: true`, `sensitivity: "base"` (abaikan beda huruf besar/aksen). | Mengurutkan array string secara alami (`"Modul 2"` sebelum `"Modul 10"`) dan sesuai urutan abjad bahasa setempat. |
| **`Intl.PluralRules(locale, { type })`** | `type`: `"cardinal"` (jumlah barang) atau `"ordinal"` (urutan ke-1, ke-2: `1st`, `2nd`, `3rd`). | Mengembalikan kategori jamak CLDR (`"zero"`, `"one"`, `"two"`, `"few"`, `"many"`, `"other"`) untuk memilih kalimat terjemahan yang tepat. |

## 2. Menghitung Kata & Karakter Visual dengan `Intl.Segmenter` serta Mengurutkan Alami dengan `Intl.Collator`

Perhatikan bagaimana `Intl.Segmenter` membedakan antara segmen kata (`isWordLike === true`) dan tanda baca/spasi (`isWordLike === false`), serta menghitung emoji gabungan secara akurat menggunakan `granularity: "grapheme"`:

```javascript
// 1. Menghitung jumlah kata secara akurat lintas bahasa (mengabaikan tanda baca & spasi)
export function hitungJumlahKata(teks, kodeBahasa = "id-ID") {
  const segmenter = new Intl.Segmenter(kodeBahasa, { granularity: "word" });
  let jumlahKata = 0;
  for (const segmen of segmenter.segment(teks)) {
    if (segmen.isWordLike) jumlahKata += 1;
  }
  return jumlahKata;
}

console.log(hitungJumlahKata("Halo, selamat pagi! Mari belajar JavaScript.")); // 6

// 2. Menghitung karakter tampak (Grapheme Cluster) termasuk emoji keluarga gabungan
export function hitungKarakterVisual(teks, kodeBahasa = "id-ID") {
  const segmenterGrafem = new Intl.Segmenter(kodeBahasa, { granularity: "grapheme" });
  return [...segmenterGrafem.segment(teks)].length;
}

console.log("👨‍👩‍👧‍👦".length);                     // 11 (UTF-16 code units)
console.log([..."👨‍👩‍👧‍👦"].length);                // 7  (Unicode code points)
console.log(hitungKarakterVisual("👨‍👩‍👧‍👦"));       // 1  (Grapheme cluster utuh!)

// 3. Mengurutkan daftar bab secara alami (Natural Sort) dengan Intl.Collator
const pengurutAlami = new Intl.Collator("id-ID", { numeric: true, sensitivity: "base" });
const daftarBab = ["Modul 10", "modul 2", "Modul 1", "Modul 20"];
console.log(daftarBab.toSorted(pengurutAlami.compare));
// ["Modul 1", "modul 2", "Modul 10", "Modul 20"]
```

## 3. Menangani Bentuk Jamak Multibahasa dengan `Intl.PluralRules`

Dalam bahasa Indonesia, `"1 berkas"` dan `"5 berkas"` memiliki bentuk kata yang sama (selalu kategori `"other"`). Dalam bahasa Inggris terdapat 2 bentuk (`"one"` untuk `1 file`, `"other"` untuk `0 files` / `5 files`), sedangkan bahasa Arab atau Polandia memiliki hingga 4–6 bentuk jamak berbeda! Dengan **`Intl.PluralRules`**, Anda cukup memetakan kategori yang dikembalikan oleh `.select(jumlah)`:

```javascript
const kamusPesan = {
  "id-ID": {
    other: (n) => `${n} modul telah diselesaikan`
  },
  "en-US": {
    one: (n) => `${n} module completed`,
    other: (n) => `${n} modules completed`
  }
};

export function formatPesanJamak(jumlah, kodeBahasa = "id-ID") {
  const aturanJamak = new Intl.PluralRules(kodeBahasa);
  const kategori = aturanJamak.select(jumlah); // "one", "other", dst.
  const tabelBahasa = kamusPesan[kodeBahasa] ?? kamusPesan["id-ID"];
  const pembentuk = tabelBahasa[kategori] ?? tabelBahasa.other;
  return pembentuk(jumlah);
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Membuat instans `new Intl.Segmenter()` atau `new Intl.Collator()` baru di dalam setiap iterasi perulangan ribuan kali:** Inisialisasi objek `Intl` memuat tabel data bahasa CLDR yang cukup berat. Buat instans `Intl.Collator` atau `Intl.Segmenter` **satu kali di luar perulangan** (atau simpan di dalam `Map` cache per kode bahasa), lalu gunakan ulang metodenya!
2. **Menghitung semua elemen dari `segmenter.segment(teks)` pada `granularity: "word"` tanpa memeriksa `segmen.isWordLike`:** Pada `granularity: "word"`, `segment()` menghasilkan potongan untuk **setiap spasi, koma, dan tanda seru** juga! Hanya potongan kata/angka yang memiliki properti `segmen.isWordLike === true`.
3. **Menulis logika `if (n === 1) ... else ...` yang dikodekan mati (*hardcoded*) untuk terjemahan jamak:** Logika `n === 1` salah untuk bahasa Prancis (di mana `0` dan `1` sama-sama memakai bentuk `"one"`) maupun bahasa Slavia/Arab. Selalu gunakan `new Intl.PluralRules(locale).select(n)`.

## Latihan Praktik Mandiri

1. Buat berkas `lokalisasi.mjs` yang mengekspor `hitungJumlahKata`, `hitungKarakterVisual`, `urutkanJudulModul(daftarJudul)`, dan `formatPesanJamak(jumlah, kodeBahasa)`.
2. Tulis pengujian otomatis di `node:test` yang memverifikasi bahwa:
   - `hitungKarakterVisual("Halo 🇮🇩 👨‍👩‍👧‍👦")` mengembalikan `8` (bukan `21`);
   - `urutkanJudulModul(["Bab 12", "Bab 2", "Bab 1"])` menghasilkan `["Bab 1", "Bab 2", "Bab 12"]`;
   - `formatPesanJamak(1, "en-US")` menghasilkan `"1 module completed"` dan untuk `5` menghasilkan `"5 modules completed"`.

## Kuis Pemahaman

### Soal 1
Mengapa saat menghitung jumlah kata dari hasil `new Intl.Segmenter("id-ID", { granularity: "word" }).segment(teks)`, kita wajib memeriksa properti `if (segmen.isWordLike)` pada setiap segmen?
- A. Karena `Intl.Segmenter` hanya bekerja pada teks huruf besar
- B. Karena pada mode `granularity: "word"`, iterator `segment()` menghasilkan segmen untuk seluruh isi string termasuk spasi, tanda koma, titik, dan simbol; properti boolean `isWordLike` bernilai `true` hanya untuk segmen yang benar-benar berupa kata atau angka
- C. Karena `isWordLike` menghapus kata yang salah eja
- D. Karena `segment()` mengembalikan objek `Promise`

**Jawaban Benar:** B
**Penjelasan:** `Intl.Segmenter` mempartisi string tanpa menghilangkan karakter satu pun, sehingga spasi dan tanda baca juga keluar sebagai segmen dengan `isWordLike: false`.

### Soal 2
Nilai `granularity` manakah pada `new Intl.Segmenter("id-ID", { granularity })` yang harus digunakan untuk menghitung atau memotong jumlah **karakter visual utuh** sebagaimana dilihat manusia di layar (sehingga emoji gabungan keluarga `👨‍👩‍👧‍👦` atau bendera `🇮🇩` dihitung sebagai `1` karakter)?
- A. `granularity: "word"`
- B. `granularity: "sentence"`
- C. `granularity: "grapheme"`
- D. `granularity: "byte"`

**Jawaban Benar:** C
**Penjelasan:** Kluster grafem (*grapheme cluster*, `granularity: "grapheme"`) merepresentasikan satu karakter tampak utuh menurut standar Unicode Annex #29, menggabungkan urutan emoji multi-titik-kode maupun huruf beraksen menjadi satu unit visual.

### Soal 3
Bagaimana cara mengurutkan array `["Modul 10", "Modul 2", "Modul 1"]` di JavaScript agar terurut secara alami menjadi `["Modul 1", "Modul 2", "Modul 10"]`?
- A. Memanggil `daftar.toSorted()` tanpa argumen
- B. Menggunakan `new Intl.Collator("id-ID", { numeric: true }).compare` sebagai fungsi pembanding di dalam `daftar.toSorted(...)`
- C. Memanggil `daftar.reverse()`
- D. Menggunakan `Intl.PluralRules`

**Jawaban Benar:** B
**Penjelasan:** Opsi `{ numeric: true }` pada `Intl.Collator` mengaktifkan pengurutan numerik alami (*natural sort*) di mana deretan digit angka di dalam string dibandingkan berdasarkan nilai bilangannya (`2 < 10`), bukan kode karakter per digit (`"1" < "2"`).

## Sumber

- [`Intl.Segmenter` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)
- [`Intl.PluralRules` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules)
- [`Intl.Collator` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)
- [ECMAScript Internationalization API Specification (ECMA-402) — TC39](https://tc39.es/ecma402/)
