# Penanganan Teks Panjang: `text-overflow: ellipsis`, Multi-Baris `-webkit-line-clamp`, `overflow-wrap`, dan `hyphens`

- **Tingkat:** Menengah
- **Ringkasan:** Memotong judul panjang dengan elipsis satu baris maupun multi-baris (`line-clamp`), mencegah URL panjang merusak lebar kartu dengan `overflow-wrap: anywhere`, serta mengaktifkan pemenggalan suku kata otomatis `hyphens: auto`.

## Mengapa Teks Panjang Perlu Ditangani?

Isi web sering datang dari pengguna atau basis data: judul 80 karakter, nama berkas tanpa spasi, URL sepanjang satu baris. Tanpa penanganan, teks seperti itu meluber keluar kartu, melebarkan kolom, atau memunculkan bilah gulir horizontal. CSS menyediakan empat alat dengan tujuan berbeda: **memotong** (*truncate*) dengan tanda elipsis, **membatasi jumlah baris**, **memecah kata panjang** agar muat, dan **memenggal suku kata** agar paragraf lebih rapi.

## 1. Elipsis Satu Baris: `text-overflow: ellipsis`

Tiga properti harus dipakai bersama pada elemen blok yang lebarnya terbatas:

```css
.judul-ringkas {
  white-space: nowrap;          /* tidak boleh membungkus */
  overflow: hidden;             /* sembunyikan sisa yang meluber */
  text-overflow: ellipsis;      /* tampilkan "..." di ujung */
}
```

Jika salah satu hilang, elipsis tidak muncul: tanpa `overflow` selain `visible`, tidak ada yang dipotong; tanpa `white-space: nowrap`, teks membungkus ke baris berikut. Pada flex item atau grid item, tambahkan `min-inline-size: 0` agar item boleh menyusut (lihat Pelajaran 28).

## 2. Elipsis Multi-Baris: `-webkit-line-clamp`

Untuk membatasi teks pada jumlah baris tertentu (mis. 3 baris ringkasan kartu), gunakan pola berikut. Walaupun berawalan `-webkit-`, pola ini **didukung semua peramban utama** (Chrome, Edge, Firefox, dan Safari):

```css
.ringkasan {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;        /* maksimal 3 baris */
  overflow: hidden;
}
```

Hal yang perlu diketahui:
- Versi standar tanpa awalan, `line-clamp`, adalah bagian dari spesifikasi CSS Overflow Module Level 4, tetapi di MDN statusnya masih **ketersediaan terbatas** (belum aktif tanpa bendera di peramban utama). Karena itu, gunakan versi `-webkit-` untuk produksi.
- Teks asli tetap berada di DOM dan tetap terbaca oleh pembaca layar; pemotongan hanya bersifat visual. Berikan cara untuk membaca seluruh teks (tautan "Selengkapnya" atau halaman detail) karena pengguna yang memperbesar teks akan kehilangan lebih banyak bagian.
- Jangan memotong informasi penting seperti harga, tanggal, atau peringatan.

## 3. Memecah Kata Panjang: `overflow-wrap`

Kata yang tak punya spasi (URL, nama berkas, token) bisa meluber. `overflow-wrap` memungkinkan peramban memecahnya:

```css
.komentar {
  overflow-wrap: anywhere;      /* boleh memecah di titik mana pun bila tidak muat */
}
```

Dua nilai yang sering tertukar:
- `overflow-wrap: break-word`: kata dipecah hanya bila **tidak muat**, tetapi pada penghitungan ukuran intrinsik (`min-content`) kata tetap dianggap utuh. Pada flex item atau sel tabel, kolom masih bisa menolak mengecil.
- `overflow-wrap: anywhere`: sama, tetapi titik pemecahan **ikut dihitung** untuk `min-content`, sehingga kolom bisa menyusut sampai selebar satu huruf. Karena itu, `anywhere` lebih andal di flex dan grid.

`word-break: break-all` memecah kata di titik mana pun **tanpa menunggu** tidak muat; hindari untuk teks bacaan biasa, karena kata pendek pun terpotong sembarangan.

## 4. Pemenggalan Suku Kata: `hyphens`

```css
:lang(id) p {
  hyphens: auto;                /* peramban menyisipkan tanda hubung di titik pemenggalan yang wajar */
  overflow-wrap: break-word;    /* cadangan jika kata tak dapat dipenggal */
}
```

- Agar `auto` bekerja, dokumen harus memiliki **atribut `lang` yang benar** (mis. `<html lang="id">`), dan peramban harus memiliki kamus pemenggalan untuk bahasa itu. Dukungan kamus bergantung bahasa dan peramban, sehingga hasil untuk bahasa Indonesia perlu diuji pada peramban sasaran.
- `hyphens: manual` (bawaan) hanya memenggal di tempat yang Anda tandai sendiri dengan `&shy;` (*soft hyphen*) atau `&#173;`. Ini paling dapat diprediksi untuk kata-kata teknis tertentu.
- `hyphens: none` menonaktifkan pemenggalan, termasuk `&shy;`.
- Properti `hyphens` berstatus **Baseline Widely Available** (sejak September 2023), sedangkan `text-overflow` dan `overflow-wrap` sudah **Widely Available** lebih lama.

Gabungkan dengan `text-align: start` (bukan `justify`) bila ragu: perataan kiri-kanan pada kolom sempit menghasilkan celah antar-kata yang besar.

## Studi Kasus Produksi: Kartu Artikel dan Komentar Pengguna dengan URL Panjang

Komponen kartu berita di halaman beranda harus tahan terhadap judul panjang, cuplikan paragraf yang bervariasi, serta nama penulis atau tautan panjang tanpa spasi:

```css
.kartu-berita {
  display: flex;
  flex-direction: column;
  min-inline-size: 0;
}

.kartu-berita .judul {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  overflow-wrap: anywhere;
}

.kartu-berita .isi-komentar {
  overflow-wrap: anywhere;
  hyphens: auto;
}
```

Kombinasi `-webkit-line-clamp: 2` dan `overflow-wrap: anywhere` menjamin bahwa kata tunggal atau URL yang sangat panjang di baris pertama tetap terpecah dengan aman dan tidak merusak lebar kartu.

## Kesalahan Umum dan Cara Menghindarinya

1. **Elipsis tidak muncul.** Biasanya karena salah satu dari `overflow: hidden`, `white-space: nowrap`, atau lebar yang terbatas hilang; pada flex item juga karena `min-inline-size: 0` belum diberikan.
2. **Memakai `-webkit-line-clamp` tanpa `display: -webkit-box`.** Tanpa itu, properti tidak berpengaruh.
3. **Memakai `word-break: break-all` untuk paragraf.** Kata pendek pun terpotong; gunakan `overflow-wrap: anywhere` atau `break-word`.
4. **Mengandalkan `hyphens: auto` tanpa atribut `lang`.** Peramban tidak tahu kamus bahasa yang harus dipakai.
5. **Memotong teks penting.** Informasi kunci tidak boleh tersembunyi di balik elipsis.

## Latihan Praktik: Kartu Berita yang Tahan Teks Panjang

Buatlah berkas `teks-panjang.html` dan `teks.css`:
1. Buat kartu dengan judul sepanjang 100 karakter. Tampilkan satu baris dengan elipsis, lalu ubah menjadi dua baris dengan `-webkit-line-clamp: 2`.
2. Tambahkan komentar berisi URL panjang tanpa spasi di dalam flex item. Bandingkan `overflow-wrap: break-word` dengan `anywhere` serta pengaruh `min-inline-size: 0`.
3. Aktifkan `hyphens: auto` dengan `lang="id"` pada paragraf sempit dan amati apakah peramban Anda memenggal kata; tambahkan `&shy;` manual pada satu kata panjang sebagai pembanding.

## Kuis Pemahaman

### Soal 1
Kombinasi manakah yang diperlukan agar teks satu baris berakhir dengan tanda elipsis `...`?
- A. `overflow: hidden`, `text-overflow: ellipsis`, dan `white-space: nowrap`
- B. `overflow: visible`, `text-overflow: ellipsis`, dan `white-space: normal`
- C. `text-overflow: ellipsis` saja
- D. `word-break: break-all` dan `hyphens: auto`

**Jawaban Benar:** A
**Penjelasan:** `white-space: nowrap` mencegah teks membungkus, `overflow: hidden` memotong bagian yang meluber, dan `text-overflow: ellipsis` mengganti bagian yang dipotong dengan `...`. Tanpa dua properti lainnya, `text-overflow` tidak berpengaruh.

### Soal 2
Apa yang harus ada selain `-webkit-line-clamp: 3` agar teks dibatasi tiga baris di semua peramban utama?
- A. `display: flex` dan `flex-wrap: wrap`
- B. `text-overflow: clip`
- C. `display: -webkit-box`, `-webkit-box-orient: vertical`, dan `overflow: hidden`
- D. `position: relative`

**Jawaban Benar:** C
**Penjelasan:** Pola `-webkit-line-clamp` yang didukung luas memerlukan `display: -webkit-box`, `-webkit-box-orient: vertical`, dan `overflow: hidden`. Tanpa `display: -webkit-box`, properti tidak berpengaruh.

### Soal 3
Mengapa `overflow-wrap: anywhere` lebih andal daripada `break-word` untuk URL panjang di dalam flex item tanpa `min-width: 0`?
- A. Karena `anywhere` mengubah URL menjadi tautan yang dapat diklik.
- B. Karena `anywhere` menyembunyikan teks yang meluber.
- C. Karena `anywhere` menambahkan tanda hubung di tengah URL.
- D. Karena titik pemecahan pada `anywhere` ikut dihitung dalam ukuran `min-content`, sehingga item boleh menyusut; pada `break-word` kata tetap dianggap utuh sehingga item menolak mengecil.

**Jawaban Benar:** D
**Penjelasan:** Perbedaan kedua nilai terletak pada perhitungan ukuran intrinsik. `anywhere` memperhitungkan kemungkinan pemecahan saat menghitung `min-content`, sedangkan `break-word` tidak.

## Sumber
- [`text-overflow` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-overflow)
- [`line-clamp` dan `-webkit-line-clamp` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/line-clamp)
- [`overflow-wrap` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-wrap)
- [`hyphens` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/hyphens)
