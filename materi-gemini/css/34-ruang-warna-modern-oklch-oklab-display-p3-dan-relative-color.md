# Manipulasi Warna Tingkat Lanjut: `oklch()`, `oklab()`, Relative Color Syntax (`oklch(from var(--warna) l c h)`), dan Kontras

- **Tingkat:** Lanjut
- **Ringkasan:** Membangun palet warna dinamis menggunakan *Relative Color Syntax* (`from`) untuk mencerahkan, menggelapkan, atau mengatur transparansi variabel warna apa pun langsung di CSS!

## Mengapa Perlu Manipulasi Warna di CSS?

Pelajaran 09 memperkenalkan `oklch()` dan `color-mix()`. Pada sistem desain nyata Anda sering memiliki **satu warna merek** dan membutuhkan turunannya: versi lebih gelap untuk *hover*, versi sangat terang untuk latar, versi transparan untuk bayangan. Dahulu itu memerlukan Sass atau variabel terpisah untuk setiap turunan. Dengan **Relative Color Syntax** (RCS), turunan itu dihitung langsung dari satu variabel. Fitur ini berstatus **Baseline Newly Available** sejak September 2024.

## 1. Ruang Warna `oklab()` dan `oklch()` Sekilas

- `oklab(L a b)`: ruang warna perseptual; sumbu `a` (hijau-merah) dan `b` (biru-kuning). Cocok untuk interpolasi dan pencampuran.
- `oklch(L C H)`: bentuk polar dari Oklab. `L` kecerahan (0-1 atau 0%-100%), `C` kroma (kepekatan, 0 hingga sekitar 0,4), `H` rona dalam derajat. Lebih intuitif untuk membuat variasi warna.

Keduanya berstatus **Baseline Widely Available** (sejak Mei 2023).

## 2. Relative Color Syntax: `from`

Anda mengambil warna asal, menguraikannya menjadi **kanal**, lalu menyusunnya kembali dengan perubahan. Di `oklch()`, kanalnya adalah `l`, `c`, `h`, dan `alpha` (semuanya berupa angka; `l` dan `alpha` berkisar 0-1):

```css
:root {
  --aksen: oklch(58% 0.2 255);
}

.tombol {
  background-color: var(--aksen);
}

.tombol:hover {
  /* Lebih gelap: kurangi L, pertahankan C dan H */
  background-color: oklch(from var(--aksen) calc(l - 0.08) c h);
}

.lencana-lembut {
  /* Latar pastel: L tinggi, kroma dikurangi, rona sama */
  background-color: oklch(from var(--aksen) 0.95 calc(c * 0.25) h);
  color: oklch(from var(--aksen) 0.35 c h);
}

.bayangan {
  /* Warna yang sama, 25% opak */
  box-shadow: 0 8px 24px oklch(from var(--aksen) l c h / 0.25);
}

.pelengkap {
  /* Warna komplementer: putar rona 180 derajat */
  color: oklch(from var(--aksen) l c calc(h + 180));
}
```

Hal yang perlu diperhatikan:
- Warna asal boleh dalam format apa pun (`#hex`, `rgb()`, nama warna); peramban mengonversinya ke ruang warna fungsi tujuan sebelum kanal dibaca. Anda bisa memulai dari `#2563eb` dan menghasilkan turunan `oklch()`.
- Di `oklch()`, `calc(l - 0.08)` memakai `l` sebagai angka 0-1. Jangan menulis `calc(l - 8%)`.
- Fungsi lain juga mendukung `from`: `rgb(from var(--c) r g b / 50%)`, `hsl(from var(--c) h s calc(l - 10))` (pada `hsl()`, `s` dan `l` berupa angka 0-100), `oklab(from ...)`, `color(from ...)`.
- RCS berbeda dengan `color-mix()`: `color-mix()` mencampur **dua warna**, sedangkan RCS **mengubah kanal satu warna**.

## 3. Gamut: `display-p3` dan Warna di Luar sRGB

Kroma tinggi pada `oklch()` dapat berada di luar gamut sRGB. Peramban **memetakan** warna itu ke gamut layar sehingga tetap tampil (dengan kepekatan berkurang pada layar sRGB). Untuk memanfaatkan layar yang lebih luas, gunakan `oklch()` atau `color(display-p3 ...)`:

```css
.hero {
  background-color: oklch(70% 0.15 250);                 /* aman di layar apa pun */
}

@media (color-gamut: p3) {
  .hero {
    background-color: oklch(70% 0.25 250);               /* hanya untuk layar gamut luas */
    /* atau: color(display-p3 0.2 0.55 1) */
  }
}
```

Media query `color-gamut` memeriksa kemampuan layar. Karena peramban sudah memetakan warna secara otomatis, `@media (color-gamut: p3)` hanya perlu dipakai ketika Anda ingin sengaja menyetel nilai berbeda untuk layar lebar.

## 4. Kontras Warna: Memastikan Teks Terbaca

WCAG 2.2 menetapkan rasio kontras minimum: **4,5:1** untuk teks biasa dan **3:1** untuk teks besar serta komponen antarmuka (SC 1.4.3 dan SC 1.4.11). Kecerahan `L` pada `oklch()` berkorelasi dengan kecerahan yang dirasakan, jadi memberi `L` yang berjauhan antara teks dan latar umumnya menghasilkan kontras yang baik, tetapi **tetap ukur rasio kontras sebenarnya** dengan alat bantu (DevTools menampilkan rasio kontras di *color picker*).

CSS juga memiliki fungsi `contrast-color()` yang memilih `black` atau `white` mana pun yang kontrasnya lebih besar terhadap warna masukan. Fungsi ini **Baseline Newly Available** sejak April 2026:

```css
.tombol-dinamis {
  --latar: var(--aksen);
  background-color: var(--latar);
  color: contrast-color(var(--latar));   /* hitam atau putih, mana yang lebih kontras */
}
```

Catatan: untuk warna bernada menengah, baik hitam maupun putih bisa gagal mencapai kontras yang nyaman, sehingga hasil `contrast-color()` perlu tetap diperiksa. Bila perlu mendukung peramban lama, tulis `color` biasa sebelum baris yang memakai `contrast-color()` sebagai cadangan.

## Kesalahan Umum dan Cara Menghindarinya

1. **Menulis `calc(l - 10%)` di `oklch()` relatif.** Kanal `l` adalah angka 0-1; gunakan `calc(l - 0.1)`.
2. **Mengira RCS bekerja tanpa dukungan.** Peramban lama akan mengabaikan seluruh deklarasi; sediakan warna cadangan sebelumnya.
3. **Menaikkan kroma terlalu tinggi.** Warna di luar gamut sRGB akan dipetakan dan tampak berbeda antar-layar; uji pada layar sRGB dan P3.
4. **Memercayai `L` sebagai pengganti rasio kontras WCAG.** Selalu verifikasi rasio kontras aktual.
5. **Mengandalkan `contrast-color()` untuk warna menengah tanpa memeriksa hasilnya.**

## Latihan Praktik: Satu Warna, Banyak Turunan

Buatlah berkas `warna-relatif.html` dan `warna.css`:
1. Definisikan `--aksen: oklch(58% 0.2 255)` di `:root`.
2. Turunkan warna hover (lebih gelap), latar lembut, teks gelap, dan bayangan transparan hanya dari `--aksen` menggunakan `oklch(from var(--aksen) ...)`. Ganti `--aksen` menjadi hijau dan amati semua turunan ikut berubah.
3. Periksa kontras teks di atas latar lembut menggunakan color picker DevTools dan sesuaikan `L` hingga rasio minimal 4,5:1.
4. Tambahkan tombol yang warna tulisannya dipilih oleh `contrast-color()` dengan cadangan `color: #fff` sebelumnya.

## Kuis Pemahaman

### Soal 1
Apa hasil `oklch(from var(--aksen) calc(l - 0.1) c h)`?
- A. Warna yang sama persis dengan `--aksen`.
- B. Warna yang lebih terang dengan kroma lebih rendah.
- C. Warna dengan rona yang berputar sebesar 0,1 derajat.
- D. Warna yang lebih gelap dengan kroma dan rona sama seperti `--aksen`.

**Jawaban Benar:** D
**Penjelasan:** Kanal `l` dikurangi 0,1 sehingga kecerahan turun (lebih gelap), sedangkan `c` dan `h` dipakai apa adanya.

### Soal 2
Manakah yang menghasilkan warna `--aksen` dengan opasitas 20%?
- A. `oklch(from var(--aksen) l c h / 0.2)`
- B. `oklch(from var(--aksen) 0.2 c h)`
- C. `oklch(from var(--aksen) l c h * 0.2)`
- D. `oklch(from var(--aksen) alpha 0.2)`

**Jawaban Benar:** A
**Penjelasan:** Opasitas ditulis setelah garis miring. Opsi B justru mengubah kecerahan menjadi 0,2, sedangkan C dan D bukan sintaks yang valid.

### Soal 3
Apa yang dikembalikan `contrast-color()` dan apa batasannya?
- A. Warna komplementer dari masukan; selalu mencapai kontras 7:1.
- B. `white` atau `black`, mana pun yang kontrasnya lebih besar terhadap warna masukan; pada warna bernada menengah hasilnya bisa tetap kurang kontras sehingga perlu diperiksa.
- C. Warna paling mirip dengan masukan; tidak memiliki batasan.
- D. Sebuah angka rasio kontras yang dapat dipakai pada `calc()`.

**Jawaban Benar:** B
**Penjelasan:** `contrast-color()` memilih `white` atau `black` yang lebih kontras. Untuk warna bernada menengah, kedua opsi itu bisa sama-sama kurang kontras, jadi hasilnya tetap harus diverifikasi.

## Sumber
- [Using relative colors — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Colors/Using_relative_colors)
- [`oklch()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch)
- [`contrast-color()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/contrast-color)
- [CSS Color Module Level 5 — W3C](https://www.w3.org/TR/css-color-5/)
- [Understanding Success Criterion 1.4.3: Contrast (Minimum) — W3C WAI](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
