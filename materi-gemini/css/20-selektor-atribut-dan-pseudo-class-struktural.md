# Selektor Atribut Lanjutan (`^=`, `$=`, `*=`, `i`) dan Pseudo-Class Struktural (`:nth-child(An+B of S)`)

- **Tingkat:** Menengah
- **Ringkasan:** Menguasai pencocokan pola atribut tanpa peka huruf besar/kecil serta sintaks baru `:nth-child(2n+1 of .aktif)` untuk memfilter elemen sebelum dihitung urutannya.

## Mengapa Selektor Atribut dan Pseudo-Class Struktural Layak Dikuasai?

Banyak aturan CSS bisa ditulis tanpa menambahkan kelas ekstra di HTML, karena informasinya sudah ada di markup: tautan yang berakhiran `.pdf`, input bertipe `email`, atau baris tabel yang urutannya genap. **Selektor atribut** memilih elemen berdasarkan atribut dan nilainya, sedangkan **pseudo-class struktural** memilih elemen berdasarkan posisinya di antara saudara-saudaranya. Keduanya membuat CSS lebih dekat ke struktur dokumen, dan sintaks `:nth-child(An+B of S)` menambahkan kemampuan menyaring saudara sebelum urutan dihitung.

## 1. Selektor Atribut: Cara Mencocokkan Nilai

| Selektor | Arti | Contoh cocok untuk `href="https://kodeloka.asadinedu.com/css.pdf"` |
|---|---|---|
| `[href]` | Atribut ada, berapa pun nilainya | Ya |
| `[type="email"]` | Nilai sama persis | Tidak (nilainya bukan `email`) |
| `[class~="aktif"]` | Salah satu kata dalam daftar yang dipisah spasi sama dengan `aktif` | Berlaku untuk `class="kartu aktif"` |
| `[href^="https://"]` | Nilai **diawali** teks tersebut | Ya |
| `[href$=".pdf"]` | Nilai **diakhiri** teks tersebut | Ya |
| `[href*="asadinedu"]` | Nilai **mengandung** teks tersebut di mana saja | Ya |

Beberapa catatan penting:
- Ada pula `[lang|="id"]` (dibaca "dash-match"): cocok jika nilainya tepat `id` atau diawali `id-`, misalnya `lang="id"` dan `lang="id-ID"`.
- Jika nilai pembanding kosong (`[href^=""]`, `[href$=""]`, `[href*=""]`), selektor tersebut **tidak mencocokkan apa pun**.
- Nilai boleh ditulis tanpa tanda kutip hanya jika berupa *identifier* CSS yang valid. Kalau mengandung karakter seperti `/`, `:`, atau `.`, tulis dengan tanda kutip.
- Selektor atribut hanya menambah spesifisitas `(0, 1, 0)`, sama dengan satu kelas.

### Flag `i` dan `s`: Peka atau Tidak Peka Huruf Besar/Kecil

Tambahkan `i` sebelum tanda kurung penutup agar pencocokan **tidak peka huruf besar/kecil**:

```css
/* Cocok untuk .pdf, .PDF, maupun .Pdf */
a[href$=".pdf" i]::after {
  content: " (PDF)";
  font-size: 0.85em;
}

/* Penanda tautan keluar, mengabaikan beda besar-kecil pada skema URL */
a[href^="https://" i]:not([href*="asadinedu.com" i]) {
  text-decoration-style: dotted;
}
```

Flag `s` (peka huruf besar/kecil) adalah kebalikannya dan berguna untuk atribut yang secara bawaan tidak peka, misalnya `[type="email" s]`. Perlu diingat bahwa nilai beberapa atribut HTML (seperti `type`) memang sudah dibandingkan tanpa peka huruf besar/kecil di dokumen HTML, dan flag `s` belum didukung oleh Chrome, sehingga flag `i` jauh lebih umum dipakai.

> **💡 Pola Praktis:** `a[target="_blank"]` untuk menambahkan ikon tautan keluar, `input[type="checkbox"]:checked` untuk menata kotak centang, dan `[data-status="selesai"]` untuk menata komponen berdasarkan atribut `data-*` yang diatur JavaScript, tanpa perlu menambah atau menghapus kelas.

## 2. Pseudo-Class Struktural Klasik

Pseudo-class struktural memilih elemen berdasarkan posisi di antara saudaranya (anak dari induk yang sama):

- `:first-child`, `:last-child`, `:only-child`: anak pertama, terakhir, atau satu-satunya.
- `:nth-child(An+B)`: anak ke-`An+B`, dengan `n` berjalan dari `0, 1, 2, ...`. Contoh: `:nth-child(3)` anak ke-3; `:nth-child(2n)` atau `even` semua anak genap; `:nth-child(2n+1)` atau `odd` semua anak ganjil; `:nth-child(n+4)` anak ke-4 dan sesudahnya; `:nth-child(-n+3)` tiga anak pertama.
- `:nth-last-child(An+B)`: sama, tetapi dihitung dari belakang.
- `:nth-of-type(An+B)`, `:first-of-type`, `:last-of-type`: dihitung hanya di antara saudara yang **bertipe tag yang sama**.
- `:empty`: elemen tanpa anak sama sekali (spasi atau baris baru di dalam elemen dianggap sebagai anak teks, sehingga `<p> </p>` tidak cocok dengan `:empty`).

```css
/* Garis pemisah di antara item daftar, kecuali yang terakhir */
.menu > li:not(:last-child) {
  border-block-end: 1px solid #e2e8f0;
}

/* Tiga kartu pertama ditandai sebagai "unggulan" */
.katalog > .kartu:nth-child(-n + 3) {
  border-color: #2563eb;
}
```

## 3. `:nth-child(An+B of S)`: Menghitung Hanya Saudara yang Cocok

Pada `:nth-child(2n+1)` biasa, **semua** saudara ikut dihitung. Itu menjadi masalah ketika sebagian baris disembunyikan oleh filter (misalnya dengan atribut `hidden` atau kelas `.tersembunyi`): belang zebra (*zebra striping*) menjadi tidak beraturan karena baris tersembunyi tetap dihitung.

Sintaks `of S` menyaring dulu saudara yang cocok dengan selektor `S`, lalu urutan `An+B` dihitung **hanya di antara saudara yang lolos saringan**:

```css
/* Zebra striping hanya untuk baris yang terlihat */
tbody tr:nth-child(even of :not([hidden])) {
  background-color: #f1f5f9;
}

/* Anak ke-1, ke-3, dst. di antara item yang berkelas .aktif saja */
.daftar > li:nth-child(odd of .aktif) {
  font-weight: 700;
}
```

Hal yang perlu diperhatikan:
- `of S` hanya memengaruhi **cara menghitung**. Elemen yang diseleksi tetap harus cocok juga dengan `S`. Contoh: pada `li:nth-child(2 of .aktif)`, hanya `li.aktif` kedua yang terpilih.
- `:nth-last-child(An+B of S)` bekerja sama, tetapi menghitung dari belakang.
- `:nth-of-type()` **tidak** mendukung `of S`, karena ia menghitung berdasarkan nama tag, bukan selektor bebas.
- Spesifisitas `:nth-child(An+B of S)` adalah satu pseudo-class `(0, 1, 0)` ditambah spesifisitas selektor `S` yang paling spesifik.
- Dukungan peramban: Chrome 111, Firefox 113, dan Safari 9 mendukung sintaks `of S`; statusnya **Baseline Widely Available** (tersedia lintas peramban sejak Mei 2023).

## Studi Kasus Produksi: Indikator Jenis Tautan dan Tabel Data Dinamis

Di halaman dokumentasi dan laporan perusahaan, menggabungkan selektor atribut case-insensitive (`i`) dengan `:nth-child(An+B of S)` memungkinkan Anda menata tautan unduhan dan tabel yang dapat disaring tanpa perlu menambahkan kelas utilitas secara manual di setiap baris HTML:

```css
/* Menandai tautan eksternal aman dan tautan unduhan berkas secara otomatis */
a[href^="https://" i]:not([href*="kodeloka.asadinedu.com" i])::after {
  content: " ↗";
  font-size: 0.85em;
}

a[href$=".pdf" i]::before {
  content: "[PDF] ";
  font-weight: 700;
  color: oklch(45% 0.18 25);
}

/* Zebra striping yang tetap konsisten meskipun baris disembunyikan dengan atribut hidden */
tbody tr:nth-child(even of :not([hidden])) {
  background-color: oklch(96% 0.01 250);
}
```

Pola ini menjaga markup HTML tetap bersih dan memastikan warna belang tabel tidak pernah rusak ketika pengguna menyaring baris data di sisi klien.

## Kesalahan Umum dan Cara Menghindarinya

1. **Menyangka `:nth-child(2)` memilih elemen kedua dari sebuah jenis tag.** `p:nth-child(2)` hanya cocok jika anak ke-2 dari induknya *kebetulan* berupa `<p>`. Untuk menghitung per tag, gunakan `p:nth-of-type(2)`.
2. **Menulis `[href*=""]` atau `[href$=""]` dan berharap cocok dengan semua.** Nilai kosong tidak pernah cocok.
3. **Memakai `*=` terlalu longgar.** `[class*="btn"]` ikut mencocokkan `.tombol-btn-besar` dan `.subtitle-btn`; gunakan `[class~="btn"]` jika maksudnya kelas bernama persis `btn`.
4. **Lupa bahwa baris tersembunyi tetap dihitung oleh `:nth-child()` biasa.** Gunakan `of :not([hidden])` bila belang harus selalu rapi.

## Latihan Praktik: Tabel Dapat Disaring dengan Belang yang Selalu Rapi

Buatlah berkas `selektor-struktural.html` dan `selektor.css`:
1. Buat tabel 10 baris data kelas dengan tombol filter yang menambahkan atribut `hidden` pada beberapa `<tr>` lewat JavaScript sederhana.
2. Beri warna belang menggunakan `tbody tr:nth-child(even of :not([hidden]))` dan bandingkan dengan `tbody tr:nth-child(even)` biasa saat sebagian baris disembunyikan.
3. Tambahkan penanda `(PDF)` otomatis pada semua tautan `a[href$=".pdf" i]` dan garis bawah putus-putus pada tautan yang diawali `https://` tetapi tidak mengandung nama domain Anda.

## Kuis Pemahaman

### Soal 1
Manakah selektor yang mencocokkan tautan `<a href="Laporan.PDF">` **dan** `<a href="laporan.pdf">`?
- A. `a[href$=".pdf"]`
- B. `a[href^=".pdf" i]`
- C. `a[href$=".pdf" i]`
- D. `a[href~=".pdf"]`

**Jawaban Benar:** C
**Penjelasan:** `$=` mencocokkan akhiran nilai dan flag `i` membuat perbandingan tidak peka huruf besar/kecil, sehingga `.PDF` dan `.pdf` sama-sama cocok. Opsi A peka huruf besar/kecil (untuk nilai `href`), opsi B memeriksa awalan, bukan akhiran, dan opsi D mencari kata terpisah spasi.

### Soal 2
Sebuah `<tbody>` berisi 6 baris dan baris ke-2 serta ke-3 sedang memakai atribut `hidden`. Apa yang dipilih oleh `tr:nth-child(even of :not([hidden]))`?
- A. Baris ke-2, ke-4, dan ke-6 dari seluruh baris, termasuk yang tersembunyi.
- B. Baris ke-4 dan ke-6 asli saja, karena baris ke-2 sudah tersembunyi.
- C. Baris yang tidak tersembunyi dan menempati urutan genap **di antara baris yang tidak tersembunyi**, yaitu baris asli ke-4 (kedua dari yang terlihat) dan baris asli ke-6 (keempat dari yang terlihat).
- D. Tidak ada, karena `of S` hanya berlaku untuk `:nth-of-type()`.

**Jawaban Benar:** C
**Penjelasan:** Baris yang terlihat adalah baris asli 1, 4, 5, 6. Dengan `of :not([hidden])`, hanya baris-baris itu yang dihitung: urutan genap adalah baris yang terlihat ke-2 dan ke-4, yaitu baris asli ke-4 dan ke-6. Sintaks `of S` berlaku untuk `:nth-child()` dan `:nth-last-child()`, bukan `:nth-of-type()`.

### Soal 3
Apa hasil dari `[href*=""]` ketika dipakai sebagai selektor?
- A. Mencocokkan semua elemen yang memiliki atribut `href`.
- B. Mencocokkan elemen yang atribut `href`-nya kosong.
- C. Mencocokkan elemen yang `href`-nya diawali garis miring.
- D. Tidak mencocokkan elemen apa pun.

**Jawaban Benar:** D
**Penjelasan:** Menurut spesifikasi Selectors, jika nilai pembanding pada `^=`, `$=`, atau `*=` berupa string kosong, selektor tersebut tidak mewakili elemen apa pun. Untuk memilih semua elemen yang punya atribut, gunakan `[href]`.

## Sumber
- [Attribute selectors — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Attribute_selectors)
- [`:nth-child()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:nth-child)
- [Selectors Level 4 — W3C](https://www.w3.org/TR/selectors-4/)
