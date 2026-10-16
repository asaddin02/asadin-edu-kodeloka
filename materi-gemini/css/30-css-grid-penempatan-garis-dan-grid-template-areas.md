# Penempatan Eksplisit CSS Grid: Garis Bernama (`[utama-awal]`), `span`, dan `grid-template-areas`

- **Tingkat:** Menengah
- **Ringkasan:** Menempatkan elemen secara presisi di atas kanvas dua dimensi menggunakan nomor garis positif/negatif (`1 / -1`), garis bernama, serta peta visual `grid-template-areas` yang beradaptasi di berbagai layar.

## Mengapa Penempatan Eksplisit?

Pada Pelajaran 07 kita membiarkan item mengisi sel secara berurutan. Banyak tata letak, seperti halaman dasbor, artikel dengan margin lebar, atau spanduk yang melintasi seluruh lebar, memerlukan **kontrol penuh**: item tertentu harus berada di kolom tertentu, merentang beberapa baris, atau berpindah tempat pada layar lebar. CSS Grid menyediakan tiga cara menempatkan item secara eksplisit: **nomor garis**, **garis bernama**, dan **area bernama**.

## 1. Nomor Garis (*Grid Lines*)

Grid dengan *n* kolom memiliki *n + 1* garis vertikal, bernomor `1` dari tepi awal. Garis dapat dihitung dari belakang dengan angka negatif: `-1` adalah garis terakhir dari *explicit grid*.

```css
.halaman {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;     /* 3 kolom, 4 garis (1, 2, 3, 4 atau -4, -3, -2, -1) */
  gap: 1rem;
}

.spanduk   { grid-column: 1 / -1; }       /* dari garis pertama sampai garis terakhir */
.utama     { grid-column: 2 / 3; }        /* hanya kolom ke-2 */
.sisi      { grid-column: 3; grid-row: 1 / 3; }   /* kolom ke-3, merentang baris 1 dan 2 */
```

Cara menulis kata kunci `span` (merentang sebanyak sekian jalur):

```css
.kartu-besar   { grid-column: span 2; }      /* lebar 2 kolom dari posisi yang didapat */
.mulai-di-dua  { grid-column: 2 / span 2; }  /* mulai garis 2, merentang 2 kolom */
.tinggi        { grid-row: span 3; }
```

> **💡 Catatan:** `-1` selalu merujuk ke garis terakhir dari *explicit grid* (yang dibuat oleh `grid-template-*`), bukan garis terakhir dari jalur implisit yang dibuat otomatis. `grid-column: 1 / -1` tidak akan melintasi kolom tambahan yang dihasilkan `grid-auto-columns`.

## 2. Garis Bernama (*Named Lines*)

Alih-alih mengingat nomor, beri nama pada garis di dalam tanda kurung siku:

```css
.artikel {
  display: grid;
  grid-template-columns:
    [penuh-awal] minmax(1rem, 1fr)
    [utama-awal] minmax(0, 65ch)
    [utama-akhir] minmax(1rem, 1fr)
    [penuh-akhir];
}

.artikel > *           { grid-column: utama-awal / utama-akhir; }  /* teks di kolom utama */
.artikel > .lebar      { grid-column: penuh-awal / penuh-akhir; }  /* gambar melebar sampai tepi */
```

Satu garis boleh punya lebih dari satu nama (`[utama-akhir sisi-awal]`). Pola ini populer untuk tata letak artikel dengan elemen "pecah keluar" (*full-bleed*) tanpa perhitungan margin negatif.

## 3. `grid-template-areas`: Menggambar Peta Tata Letak

`grid-template-areas` memakai string, satu string per baris, dan nama area per sel:

```css
.dasbor {
  display: grid;
  min-block-size: 100dvh;
  grid-template-columns: 14rem minmax(0, 1fr);
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "menu  kepala"
    "menu  utama"
    "menu  kaki";
}

.dasbor > nav    { grid-area: menu; }
.dasbor > header { grid-area: kepala; }
.dasbor > main   { grid-area: utama; }
.dasbor > footer { grid-area: kaki; }
```

Aturan penting:
- Setiap baris harus memiliki **jumlah sel yang sama**.
- Area yang bernama sama harus membentuk **persegi panjang** (tidak boleh bentuk L atau terpisah).
- Tanda titik `.` menandai sel kosong.
- Setiap area otomatis membuat garis bernama `nama-start` dan `nama-end` (mis. `utama-start`, `utama-end`), yang juga bisa dipakai pada `grid-column`/`grid-row`.

### Beradaptasi di Layar yang Berbeda

Cukup tulis ulang peta pada titik perubahan. Elemen tidak perlu dipindah di HTML:

```css
.dasbor {
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    "kepala"
    "menu"
    "utama"
    "kaki";
}

@media (width >= 48rem) {
  .dasbor {
    grid-template-columns: 14rem minmax(0, 1fr);
    grid-template-areas:
      "menu kepala"
      "menu utama"
      "menu kaki";
  }
}
```

## 4. Singkatan `grid-area` dan Hati-hati dengan Urutannya

`grid-area` punya dua fungsi. Dengan satu nama, ia menempatkan item di area bernama (`grid-area: utama`). Dengan empat nilai, urutannya adalah:

`grid-area: baris-awal / kolom-awal / baris-akhir / kolom-akhir`

Urutan ini **berbeda** dari `margin` (atas, kanan, bawah, kiri) dan mudah tertukar. Contoh: `grid-area: 1 / 2 / 3 / 4` berarti mulai dari baris 1 dan kolom 2, berakhir di garis baris 3 dan garis kolom 4, yaitu menempati baris 1 sampai 2 dan kolom 2 sampai 3.

## 5. Tumpang Tindih dan Aksesibilitas

Beberapa item boleh ditempatkan di sel yang sama; urutan tumpukan mengikuti DOM atau diatur dengan `z-index`. Seperti pada Flexbox, penempatan hanya mengubah **tampilan**. Urutan fokus papan ketik dan pembacaan pembaca layar tetap mengikuti urutan DOM, jadi susun HTML dalam urutan baca yang logis dan gunakan Grid untuk penataannya.

## Kesalahan Umum dan Cara Menghindarinya

1. **Menulis `grid-template-areas` dengan jumlah sel berbeda per baris.** Seluruh deklarasi menjadi tidak valid.
2. **Membuat area berbentuk L.** Area harus persegi panjang.
3. **Mengira `-1` mencakup kolom implisit.** `-1` hanya merujuk ke garis terakhir dari explicit grid.
4. **Menukar urutan nilai pada `grid-area`.** Urutannya baris-awal, kolom-awal, baris-akhir, kolom-akhir.
5. **Menggunakan penempatan untuk mengubah urutan baca konten.** Perubahan visual tidak mengubah urutan fokus.

## Latihan Praktik: Tata Letak Artikel dan Dasbor

Buatlah berkas `grid-penempatan.html` dan `grid-penempatan.css`:
1. Buat tata letak artikel dengan garis bernama `utama-awal` dan `utama-akhir`; teks berada di kolom utama dan satu gambar melebar penuh dengan `penuh-awal / penuh-akhir`.
2. Buat dasbor dengan `grid-template-areas` untuk `menu`, `kepala`, `utama`, dan `kaki`.
3. Ubah peta area untuk layar sempit (satu kolom) dan layar lebar (menu di kiri) dengan `@media (width >= 48rem)`.
4. Tempatkan sebuah lencana di pojok kanan atas kartu dengan menumpuknya pada sel yang sama.

## Kuis Pemahaman

### Soal 1
Sebuah item diberi `grid-area: 1 / 2 / 3 / 4`. Wilayah mana yang ditempati?
- A. Baris 1 dan kolom 2 saja.
- B. Baris 1 sampai 2 dan kolom 2 sampai 3.
- C. Baris 1 sampai 3 dan kolom 2 sampai 4.
- D. Kolom 1 sampai 2 dan baris 2 sampai 3.

**Jawaban Benar:** B
**Penjelasan:** Urutan `grid-area` adalah baris-awal / kolom-awal / baris-akhir / kolom-akhir. Berakhir di garis baris 3 berarti item menempati baris 1 dan 2, dan berakhir di garis kolom 4 berarti item menempati kolom 2 dan 3.

### Soal 2
Manakah deklarasi `grid-template-areas` yang **tidak valid**?
- A. `"kepala kepala" "menu utama"`
- B. `"kepala kepala" "menu menu"`
- C. `"a a" "a b"`
- D. `"kepala ." "menu utama"`

**Jawaban Benar:** C
**Penjelasan:** Pada opsi C, area `a` menempati sel (1,1), (1,2), dan (2,1) sehingga berbentuk L, bukan persegi panjang, dan deklarasi dianggap tidak valid. Opsi A, B, dan D memuat area berbentuk persegi panjang; titik pada opsi D hanya menandai sel kosong.

### Soal 3
Jika `grid-template-areas` memuat area bernama `utama`, garis bernama apa yang otomatis tersedia untuk `grid-column` dan `grid-row`?
- A. `utama-awal` dan `utama-akhir`
- B. `utama-start` dan `utama-end`
- C. `utama-1` dan `utama-2`
- D. Tidak ada; garis harus ditulis manual.

**Jawaban Benar:** B
**Penjelasan:** Setiap area bernama secara implisit membuat garis dengan akhiran `-start` dan `-end` (misalnya `utama-start` dan `utama-end`), tanpa perlu dituliskan di `grid-template-columns` atau `grid-template-rows`.

## Sumber
- [Line-based placement with CSS grid — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Line-based_placement)
- [Grid template areas — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Grid_template_areas)
- [Named grid lines — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Named_grid_lines)
- [`grid-area` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-area)
