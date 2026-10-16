# CSS Anchor Positioning Lanjutan: Kisi `position-area` dan Penanganan Tabrakan Layar (`position-try-fallbacks`)

- **Tingkat:** Lanjut
- **Ringkasan:** Menempatkan menu sembul dan *tooltip* di sekitar elemen jangkar dengan sintaks kisi `position-area: block-end span-inline-end` serta mengatur urutan cadangan otomatis saat ruang layar sempit.

## Mengapa Perlu Mendalami Anchor Positioning?

Pelajaran 15 memperkenalkan `anchor-name`, `position-anchor`, dan fungsi `anchor()`. Fungsi `anchor()` memerlukan perhitungan sisi demi sisi. Untuk kasus umum (menu di bawah tombol, tooltip di atas), sintaks yang jauh lebih ringkas adalah **`position-area`**, dan untuk menangani layar yang sempit ada **`position-try-fallbacks`**. Seluruh modul ini berstatus **Baseline Newly Available** sejak Januari 2026 (Chrome/Edge 125, Firefox 147, Safari 26).

## 1. Prasyarat: Jangkar dan Elemen Terjangkar

```css
.tombol-menu {
  anchor-name: --jangkar-menu;             /* tandai elemen ini sebagai jangkar */
}

.panel-menu {
  position: absolute;                       /* wajib: absolute atau fixed */
  position-anchor: --jangkar-menu;          /* tautkan ke jangkar */
  /* ... position-area di sini */
}
```

`position-area` hanya bekerja pada elemen berposisi `absolute` atau `fixed` yang memiliki jangkar (lewat `position-anchor` atau hubungan jangkar implisit). Pada elemen popover (`[popover]`), gaya bawaan peramban memasang `margin` dan `inset` yang mengganggu; reset dengan `margin: 0; inset: auto;`.

## 2. `position-area`: Kisi 3 x 3 di Sekitar Jangkar

Bayangkan sebuah kisi 3 x 3. **Petak tengah adalah jangkar itu sendiri**, dan delapan petak lain mengelilinginya. `position-area` memilih petak (atau beberapa petak) tempat elemen ditempatkan:

```text
┌───────────┬───────────┬───────────┐
│ top left  │ top       │ top right │
├───────────┼───────────┼───────────┤
│ left      │ [JANGKAR] │ right     │
├───────────┼───────────┼───────────┤
│bottom left│ bottom    │bottom right│
└───────────┴───────────┴───────────┘
```

Nilainya berupa satu atau dua kata kunci. Tersedia tiga keluarga yang setara:
- Fisik: `top`, `bottom`, `left`, `right`, `center`.
- Logis (mengikuti arah penulisan): `block-start`, `block-end`, `inline-start`, `inline-end`.
- Koordinat: `y-start`, `y-end`, `x-start`, `x-end`.

Kata kunci `span-*` membuat elemen **merentang beberapa petak**:
- `span-all`: seluruh baris atau kolom.
- `span-inline-end`: petak tengah dan petak `inline-end` pada baris atau kolom itu (dua dari tiga petak).
- `span-left`, `span-top`, `span-block-start`, dan seterusnya, dengan prinsip yang sama.

| Nilai | Hasil |
|---|---|
| `bottom` | Di bawah jangkar, selebar seluruh baris bawah |
| `bottom center` | Tepat di petak bawah-tengah |
| `block-end span-inline-end` | Di bawah jangkar, mencakup petak tengah dan petak kanan (pada `ltr`), sehingga tepi kiri panel sejajar tepi kiri jangkar dan panel melebar ke kanan |
| `top span-left` | Di atas jangkar, mencakup petak tengah dan kiri |
| `right` | Di sisi kanan jangkar |

```css
.panel-menu {
  position: absolute;
  position-anchor: --jangkar-menu;
  position-area: block-end span-inline-end;   /* di bawah tombol, mulai dari tepi awalnya */
  margin-block-start: 0.5rem;                 /* jarak dari jangkar */
  inline-size: max-content;
  max-inline-size: min(24rem, 90vw);
}
```

Penyelarasan bawaan di dalam area mengikuti kebalikan sisi yang dipilih (elemen ditempel ke jangkar). Untuk menengahkan terhadap jangkar, pakai `justify-self: anchor-center`.

## 3. `position-try-fallbacks`: Menghindari Terpotong Tepi Layar

Bila posisi utama membuat elemen **meluber dari blok penampungnya** (misalnya menu di bawah tombol yang berada di dasar layar), peramban dapat mencoba posisi cadangan secara berurutan dan memakai yang pertama muat:

```css
.panel-menu {
  position-area: block-end span-inline-end;
  position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;
}
```

Opsi yang umum:
- `flip-block`: balik pada sumbu block (bawah menjadi atas).
- `flip-inline`: balik pada sumbu inline (kanan menjadi kiri).
- Nilai `position-area` langsung, misalnya `position-try-fallbacks: top, right, bottom`.
- Nama `@position-try` buatan sendiri.

Beberapa opsi dapat digabung dalam satu cadangan dengan spasi (`flip-block flip-inline`). Daftarnya dipisahkan koma dan dicoba dari kiri ke kanan.

```css
@position-try --kiri-atas {
  position-area: top span-inline-start;
  margin: 0 0 0.5rem 0;
}

.panel-menu {
  position-try-fallbacks: flip-block, --kiri-atas;
}
```

Properti tambahan yang berguna:
- `position-try-order: most-height` memilih opsi dengan ruang paling besar pada sumbu tertentu.
- `position-visibility: anchors-visible` menyembunyikan elemen terjangkar ketika jangkarnya tergulir keluar dari tampilan.

## 4. Menyatukan dengan Popover dan Aksesibilitas

```html
<button id="btn" popovertarget="menu" aria-haspopup="true">Menu</button>
<div id="menu" popover>
  <a href="/profil">Profil</a>
  <a href="/keluar">Keluar</a>
</div>
```

```css
#btn  { anchor-name: --btn; }
#menu {
  margin: 0;
  inset: auto;
  position-anchor: --btn;
  position-area: block-end span-inline-end;
  position-try-fallbacks: flip-block;
}
```

Anchor positioning hanya mengatur **posisi visual**. Hubungan semantik tetap dikerjakan HTML: `popovertarget` menghubungkan tombol dan popover, tooltip memerlukan `aria-describedby`, dan DOM tidak berubah urutannya. Bila memakai peramban yang belum mendukung, siapkan cadangan dengan:

```css
@supports (position-area: bottom) {
  /* aturan anchor positioning di sini */
}
```

## Kesalahan Umum dan Cara Menghindarinya

1. **`position-area` tidak berpengaruh.** Biasanya elemen tidak `absolute`/`fixed`, atau `position-anchor` belum diatur.
2. **Popover selalu di tengah layar.** `margin` dan `inset` bawaan popover menimpa penempatan; reset `margin: 0; inset: auto;`.
3. **Menyangka `span-inline-end` mencakup seluruh baris.** Itu hanya petak tengah dan akhir; gunakan `span-all` untuk seluruh baris.
4. **Cadangan tidak pernah dipakai.** Pastikan blok penampung (biasanya viewport untuk `fixed`) memang mungkin terlampaui, dan daftar opsi dipisahkan koma.
5. **Mengandalkan posisi tanpa hubungan semantik.** Tambahkan `popovertarget`, `aria-expanded`, atau `aria-describedby` sesuai komponen.

## Latihan Praktik: Menu Profil dan Tooltip Adaptif

Buatlah berkas `anchor-lanjut.html` dan `anchor.css`:
1. Buat tombol dan popover menu yang ditambatkan dengan `position-area: block-end span-inline-end` dan `margin-block-start`.
2. Letakkan tombol dekat dasar layar dan tambahkan `position-try-fallbacks: flip-block`; gulir halaman dan amati menu berpindah ke atas bila tidak muat.
3. Buat tooltip di atas elemen (`position-area: top`) dengan cadangan `bottom`, dan hubungkan dengan `aria-describedby`.
4. Bungkus seluruhnya dalam `@supports (position-area: bottom)`.

## Kuis Pemahaman

### Soal 1
Apa arti `position-area: block-end span-inline-end` pada halaman `ltr`?
- A. Elemen ditaruh di dalam jangkar.
- B. Elemen di atas jangkar, merentang ke kiri.
- C. Elemen di bawah jangkar, mencakup petak tengah dan petak kanan sehingga tepi kirinya sejajar dengan jangkar dan melebar ke kanan.
- D. Elemen menutupi seluruh layar.

**Jawaban Benar:** C
**Penjelasan:** `block-end` memilih baris di bawah jangkar, dan `span-inline-end` membuat elemen mencakup petak tengah serta petak `inline-end` pada baris itu (kanan pada `ltr`).

### Soal 2
`position-area` tidak berpengaruh pada sebuah panel. Penyebab paling mungkin?
- A. Panel tidak berposisi `absolute`/`fixed` atau belum memiliki jangkar lewat `position-anchor`.
- B. `position-area` hanya bekerja pada elemen `<span>`.
- C. Nilai `top` wajib ditulis dalam `px`.
- D. `position-area` hanya bekerja di dalam `@layer`.

**Jawaban Benar:** A
**Penjelasan:** Properti ini memerlukan elemen berposisi `absolute` atau `fixed` dan jangkar bawaan; tanpa salah satunya tidak ada efek.

### Soal 3
Bagaimana peramban memperlakukan `position-try-fallbacks: flip-block, flip-inline`?
- A. Mengaplikasikan keduanya sekaligus pada semua keadaan.
- B. Menghapus elemen dari DOM jika tidak muat.
- C. Mencoba posisi utama, lalu mencoba opsi cadangan berurutan, dan memakai yang pertama yang muat di blok penampung.
- D. Hanya memakai opsi terakhir.

**Jawaban Benar:** C
**Penjelasan:** Posisi utama dicoba lebih dulu. Jika meluber, opsi dalam daftar dicoba dari kiri ke kanan dan opsi pertama yang tidak meluber dipakai.

## Sumber
- [CSS anchor positioning — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning)
- [`position-area` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-area)
- [`position-try-fallbacks` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-try-fallbacks)
- [CSS Anchor Positioning — W3C](https://www.w3.org/TR/css-anchor-position-1/)
