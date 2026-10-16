# Bedah Matematis Flexbox: Bagaimana `flex-grow`, `flex-shrink`, dan `flex-basis` Dihitung Peramban

- **Tingkat:** Menengah
- **Ringkasan:** Memahami rumus distribusi ruang kosong dan penyusutan ruang sempit di dalam Flexbox, perbedaan `flex-basis: 0%` vs `auto`, serta cara mengatasi masalah `min-inline-size: auto` pada flex item.

## Mengapa Perlu Memahami Perhitungannya?

Pelajaran 06 memperkenalkan `flex: 1`, `flex: auto`, dan `flex: none`. Namun saat tata letak tidak berperilaku seperti dugaan, misalnya satu kolom menolak mengecil atau dua kolom `flex: 1` memiliki lebar berbeda, Anda perlu tahu **bagaimana peramban membagi ruang**. Ternyata rumusnya sederhana dan dapat dihitung dengan tangan.

## 1. Langkah Dasar: Ukuran Awal dan Ruang Bebas

Untuk setiap flex item pada sumbu utama, peramban melakukan hal berikut:
1. Menentukan **ukuran dasar** (*flex base size*) dari `flex-basis`. Jika `flex-basis: auto`, dipakai nilai `width` (atau `height` pada `column`); jika `width` juga `auto`, dipakai ukuran isi (`max-content`).
2. Menjumlahkan semua ukuran dasar (termasuk `gap`, margin, padding, dan border) lalu membandingkannya dengan ukuran kontainer.
3. **Ruang bebas** = ukuran kontainer dikurangi jumlah itu.
   - Jika ruang bebas **positif**, item boleh **tumbuh** (`flex-grow`).
   - Jika ruang bebas **negatif**, item harus **menyusut** (`flex-shrink`).

## 2. Menghitung `flex-grow`

Ruang bebas dibagi sesuai perbandingan faktor `flex-grow`:

`tambahan item = ruang bebas x (grow item / jumlah semua grow)`

**Contoh:** Kontainer `600px`, tiga item dengan `flex-basis: 100px` dan `flex-grow` berturut-turut `1`, `2`, `0`.
- Jumlah ukuran dasar = `300px`, ruang bebas = `600 - 300 = 300px`, jumlah grow = `3`.
- Item A: `100 + 300 x 1/3 = 200px`
- Item B: `100 + 300 x 2/3 = 300px`
- Item C: `100 + 0 = 100px`

Hasil: `200 + 300 + 100 = 600px`.

> **💡 Catatan:** Jika **jumlah** `flex-grow` kurang dari `1` (misalnya satu item dengan `flex-grow: 0.5`), hanya sebagian ruang bebas yang dibagikan (di sini 50%), bukan seluruhnya.

## 3. Menghitung `flex-shrink`

Peramban tidak menyusutkan item sama rata, melainkan **dibobot dengan ukuran dasar**. Bobot item = `flex-shrink x ukuran dasar`.

`penyusutan item = |ruang bebas| x (bobot item / jumlah semua bobot)`

**Contoh:** Kontainer `400px`; item A `flex-basis: 400px`, item B `flex-basis: 200px`, keduanya `flex-shrink: 1` dan tanpa isi (tidak ada batas minimum dari isi).
- Jumlah ukuran dasar = `600px`, ruang bebas = `400 - 600 = -200px`.
- Bobot A = `1 x 400 = 400`, bobot B = `1 x 200 = 200`, jumlah = `600`.
- A menyusut `200 x 400/600 = 133,3px`, menjadi `266,7px`.
- B menyusut `200 x 200/600 = 66,7px`, menjadi `133,3px`.

Item yang lebih besar menyusut lebih banyak (dalam piksel), tetapi persentase penyusutannya sama. Dengan `flex-shrink: 0`, item tidak ikut menyusut sama sekali, sehingga item lain menanggung seluruh penyusutan atau, bila tidak cukup, kontainer meluber.

```css
.kontainer { display: flex; inline-size: 400px; }
.a { flex: 0 1 400px; }   /* jadi 266,7px */
.b { flex: 0 1 200px; }   /* jadi 133,3px */
.ikon { flex: none; }     /* tidak menyusut maupun tumbuh */
```

## 4. `flex-basis: 0%` Berbeda dengan `auto`

Perbedaan `flex: 1` dan `flex: auto` hanya terletak pada ukuran dasarnya:

| Singkatan | Setara | Ukuran dasar | Akibat |
|---|---|---|---|
| `flex: 1` | `1 1 0%` | `0` | Seluruh ruang kontainer dibagi menurut grow, sehingga item **sama lebar** meski isinya berbeda. |
| `flex: auto` | `1 1 auto` | ukuran isi/`width` | Ruang **sisa** setelah isi dihitung yang dibagi, sehingga item dengan isi lebih panjang tetap lebih lebar. |

**Contoh:** Kontainer `600px`, tiga item dengan lebar isi `50px`, `100px`, dan `150px`.
- Dengan `flex: 1`: tiap item `200px`.
- Dengan `flex: auto`: ruang bebas `600 - 300 = 300px`, tiap item mendapat tambahan `100px`, hasilnya `150px`, `200px`, `250px`.

## 5. Batas Minimum Otomatis dan Jebakan `min-width: auto`

Setelah rumus di atas, peramban memeriksa batas `min-width`/`max-width`. Pada flex item, nilai bawaan `min-width` adalah **`auto`**, yang berarti item **tidak boleh menyusut lebih kecil daripada ukuran isi minimumnya** (`min-content`). Itu sebabnya kata panjang, URL, atau blok `<pre>` bisa membuat kolom menolak mengecil dan meluber dari kontainer. Solusinya:

```css
.kolom-isi {
  flex: 1;
  min-inline-size: 0;   /* izinkan menyusut di bawah ukuran isi minimum */
}

.kolom-isi pre {
  overflow-x: auto;     /* blok kode digulir di dalam kolomnya sendiri */
}
```

Alternatif: `overflow: hidden` (atau nilai `overflow` selain `visible`) pada flex item membuat batas minimum otomatisnya menjadi `0`.

## Kesalahan Umum dan Cara Menghindarinya

1. **Menyangka `flex-shrink` menyusutkan item sama rata.** Penyusutan dibobot dengan ukuran dasar, jadi item yang besar menyusut lebih banyak piksel.
2. **Mengira `flex: 1` dan `flex: auto` sama.** Ukuran dasar `0%` dan `auto` menghasilkan lebar yang berbeda ketika isinya tidak sama panjang.
3. **Memakai `width` dan `flex-basis` bersamaan.** Pada sumbu utama, `flex-basis` selain `auto` mengalahkan `width`; tulis ukuran awal di satu tempat saja.
4. **Melupakan padding dan border saat menghitung.** Dengan `box-sizing: content-box`, `flex-basis` hanya mengukur isi, sedangkan padding dan border tetap dihitung dalam ruang bebas. Gunakan `box-sizing: border-box` agar hitungan lebih mudah diprediksi.
5. **Lupa `min-width: 0`.** Kolom yang berisi `<pre>` atau URL panjang akan menolak menyusut.

## Latihan Praktik: Menghitung dan Membuktikan

Buatlah berkas `flex-hitung.html` dan `flex-hitung.css`:
1. Buat kontainer `600px` dengan tiga kotak kosong berukuran dasar `100px` dan `flex-grow` `1`, `2`, `0`. Ukur lebar masing-masing dengan DevTools dan cocokkan dengan hitungan tangan (`200px`, `300px`, `100px`).
2. Buat kontainer `400px` dengan dua kotak `flex-basis: 400px` dan `200px`; bandingkan `flex-shrink: 1` dengan `flex-shrink: 0` pada kotak kedua.
3. Bandingkan `flex: 1` dan `flex: auto` pada tiga item berisi teks pendek, sedang, dan panjang.
4. Tempatkan blok `<pre>` berisi satu baris sangat panjang di dalam kolom `flex: 1`, amati meluber, lalu perbaiki dengan `min-inline-size: 0`.

## Kuis Pemahaman

### Soal 1
Kontainer `600px` berisi tiga item `flex-basis: 100px` dengan `flex-grow` `1`, `2`, dan `0`. Berapa lebar item kedua?
- A. `200px`
- B. `100px`
- C. `400px`
- D. `300px`

**Jawaban Benar:** D
**Penjelasan:** Ruang bebas = `600 - 300 = 300px`. Item kedua mendapat `300 x 2/3 = 200px` tambahan, sehingga lebarnya `100 + 200 = 300px`.

### Soal 2
Kontainer `400px` berisi item A (`flex-basis: 400px`) dan B (`flex-basis: 200px`), keduanya `flex-shrink: 1` dan tanpa isi. Berapa lebar akhir A dan B?
- A. `200px` dan `200px`
- B. `300px` dan `100px`
- C. `266,7px` dan `133,3px`
- D. `250px` dan `150px`

**Jawaban Benar:** C
**Penjelasan:** Ruang bebas `-200px`. Penyusutan dibobot dengan ukuran dasar: A menyusut `200 x 400/600 = 133,3px` menjadi `266,7px`, B menyusut `200 x 200/600 = 66,7px` menjadi `133,3px`.

### Soal 3
Tiga item di kontainer `600px` memiliki lebar isi `50px`, `100px`, dan `150px`. Dengan `flex: auto`, berapa lebar akhir masing-masing?
- A. `200px` untuk ketiganya.
- B. `150px`, `200px`, `250px`
- C. `50px`, `100px`, `150px` (tidak tumbuh)
- D. `100px`, `200px`, `300px`

**Jawaban Benar:** B
**Penjelasan:** `flex: auto` setara `1 1 auto`, sehingga ukuran dasar mengikuti isi. Ruang bebas `600 - 300 = 300px` dibagi rata tiga (masing-masing `100px`) lalu ditambahkan pada ukuran dasar: `150`, `200`, `250px`. Dengan `flex: 1` (basis `0%`), ketiganya akan `200px`.

## Sumber
- [Controlling ratios of flex items along the main axis — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Controlling_flex_item_ratios)
- [`flex` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex)
- [CSS Flexible Box Layout Module Level 1 — W3C](https://www.w3.org/TR/css-flexbox-1/)
