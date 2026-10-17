# Latar Belakang Multi-Lapis (*Multiple Backgrounds*), Pola Geometris Gradien, dan `background-clip: text`

- **Tingkat:** Menengah
- **Ringkasan:** Menumpuk beberapa lapisan gambar dan gradien pada satu properti `background`, membuat pola kisi titik/garis murni dengan `repeating-linear-gradient`, serta mewarnai teks dengan gradien menggunakan `background-clip: text`.

## Mengapa Latar Belakang Berlapis?

Gradien CSS adalah **gambar** yang dibuat peramban, sehingga ia bisa dipakai di mana pun gambar diterima, termasuk sebagai `background-image`. Dan satu elemen dapat memiliki **banyak** lapisan latar sekaligus. Kombinasi keduanya memungkinkan pola titik, garis, kotak-kotak, dan kilau lembut tanpa berkas gambar tambahan (nol permintaan jaringan), yang cocok untuk latar hero, kartu, dan ilustrasi dekoratif.

## 1. Lapisan Ganda dalam Satu Properti

Pisahkan lapisan dengan koma. **Lapisan pertama berada paling atas**, lapisan terakhir paling bawah:

```css
.hero {
  background:
    linear-gradient(to bottom, transparent 60%, oklch(98% 0.01 250)),   /* lapisan atas: pudar ke bawah */
    radial-gradient(circle at 20% 20%, oklch(85% 0.12 255 / 0.6), transparent 50%),
    url("pola.svg") center / 24rem repeat,                              /* gambar berulang */
    oklch(98% 0.01 250);                                                /* warna dasar: hanya boleh di lapisan TERAKHIR */
}
```

Aturan penting:
- Pada singkatan `background`, **warna latar hanya boleh ditulis pada lapisan terakhir**.
- Bila memakai properti terpisah (`background-image`, `background-size`, `background-position`, `background-repeat`), tulis daftar yang dipisahkan koma dengan urutan lapisan yang sama. Jika daftar nilai lebih pendek daripada daftar gambar, nilai diulang.
- Pada singkatan, ukuran ditulis setelah posisi dengan garis miring: `center / 24rem`.

## 2. Pola Geometris dengan Gradien

### Kisi Titik

```css
.kisi-titik {
  background-color: oklch(98% 0.005 250);
  background-image: radial-gradient(circle, oklch(75% 0.02 250) 1px, transparent 1.5px);
  background-size: 16px 16px;        /* satu titik setiap 16px */
}
```

### Kisi Garis

```css
.kisi-garis {
  background-image:
    linear-gradient(to right,  oklch(90% 0.01 250) 1px, transparent 1px),
    linear-gradient(to bottom, oklch(90% 0.01 250) 1px, transparent 1px);
  background-size: 24px 24px;        /* garis vertikal dan horizontal setiap 24px */
}
```

### Garis Diagonal dengan `repeating-linear-gradient`

Titik henti dengan **dua posisi** (`warna awal akhir`) memudahkan pola bergaris:

```css
.garis-diagonal {
  background: repeating-linear-gradient(
    45deg,
    oklch(94% 0.01 250) 0 10px,       /* 0 sampai 10px: warna terang */
    oklch(98% 0.005 250) 10px 20px    /* 10px sampai 20px: warna lebih terang */
  );
}
```

Pola dengan `background-size` yang kecil dan berulang sangat ringan bagi peramban; hindari gradien raksasa yang dianimasikan terus-menerus karena memicu *repaint* penuh pada setiap bingkai.

> **💡 Catatan Aksesibilitas:** Pola latar yang padat di bawah teks dapat menurunkan keterbacaan. Gunakan pola dengan kontras rendah di belakang teks, atau beri lapisan warna solid semi-transparan di antara pola dan teks. Tetap pastikan rasio kontras teks minimal 4,5:1.

## 3. Teks Bergradien dengan `background-clip: text`

`background-clip: text` memotong latar belakang menurut **bentuk huruf**. Dengan membuat warna teks transparan, gradien tampak "mewarnai" huruf:

```css
.judul-gradien {
  color: oklch(50% 0.2 255);                       /* warna cadangan yang selalu terbaca */
}

@supports ((-webkit-background-clip: text) or (background-clip: text)) {
  .judul-gradien {
    background-image: linear-gradient(90deg, oklch(55% 0.22 255), oklch(65% 0.2 330));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;           /* membuat isi huruf transparan */
    color: transparent;
  }
}
```

Hal yang perlu diperhatikan:
- Versi berawalan `-webkit-background-clip: text` didukung luas; versi tanpa awalan tersedia di Chrome sejak versi 120 dan di Safari, tetapi di MDN statusnya masih belum merata di semua peramban, sehingga tulis **keduanya**.
- Tanpa warna cadangan, teks akan **tidak terlihat** di peramban yang tidak mendukungnya. Karena itu, definisikan `color` biasa lebih dulu dan override di dalam `@supports`.
- Periksa **kontras di seluruh gradien**, bukan hanya di ujungnya.
- Pada mode **warna paksa** (*forced colors*, mis. Windows High Contrast) peramban menghitung `background-image` menjadi `none` kecuali nilainya mengandung `url()`, sehingga gradien tidak tampil dan teks dengan `color: transparent` bisa menghilang. Pulihkan warnanya:

```css
@media (forced-colors: active) {
  .judul-gradien {
    background: none;
    -webkit-text-fill-color: CanvasText;
    color: CanvasText;
  }
}
```

## Studi Kasus Produksi: Kartu Sorotan dengan Bingkai Gradien Halus (*Gradient Border*)

Membuat bingkai bergradien dengan sudut melengkung (`border-radius`) sering sulit dilakukan dengan `border-image`. Anda dapat menyelesaikannya menggunakan dua lapisan `background` dengan `background-clip` yang berbeda (`padding-box` dan `border-box`):

```css
.kartu-sorotan {
  border: 2px solid transparent;
  border-radius: 1rem;
  background:
    linear-gradient(oklch(99% 0.005 250), oklch(99% 0.005 250)) padding-box,
    linear-gradient(135deg, oklch(60% 0.22 255), oklch(65% 0.2 320)) border-box;
}
```

Lapisan pertama mengisi area dalam kartu (`padding-box`) dengan warna latar solid, sedangkan lapisan kedua mengisi hingga ke area bingkai (`border-box`) sehingga hanya tampak pada ketebalan `border: 2px solid transparent` dengan sudut melengkung yang rapi.

## Kesalahan Umum dan Cara Menghindarinya

1. **Menaruh warna latar di lapisan pertama singkatan `background`.** Warna hanya sah pada lapisan terakhir; deklarasi menjadi tidak valid.
2. **Mengira lapisan pertama berada di bawah.** Lapisan pertama justru paling atas.
3. **Menulis gradien tanpa `background-size` untuk pola berulang.** Tanpa ukuran, gradien meregang memenuhi seluruh elemen dan tidak membentuk pola.
4. **Teks bergradien tanpa cadangan.** Di peramban atau mode yang tidak mendukungnya, teks hilang.
5. **Pola terlalu kontras di bawah teks bacaan.** Turunkan kontras pola atau beri lapisan penyangga.

## Latihan Praktik: Hero dengan Pola dan Judul Bergradien

Buatlah berkas `latar-berlapis.html` dan `latar.css`:
1. Buat hero dengan tiga lapisan: gradien pudar di atas, cahaya radial lembut di tengah, dan kisi titik di bawah, ditambah warna dasar pada lapisan terakhir.
2. Buat kartu dengan latar kisi garis `24px` dan garis diagonal pada satu kartu lain.
3. Buat judul bergradien dengan `background-clip: text`, dilengkapi warna cadangan, `@supports`, dan penyesuaian `forced-colors`. Uji tampilannya dengan mengemulasikan `forced-colors: active` di tab Rendering DevTools.

## Kuis Pemahaman

### Soal 1
Pada `background: A, B, C;` (tiga lapisan gambar), lapisan manakah yang berada **paling atas**?
- A. `C`
- B. `A`
- C. `B`
- D. Ketiganya sejajar.

**Jawaban Benar:** B
**Penjelasan:** Pada beberapa latar belakang, lapisan pertama dalam daftar digambar paling atas dan lapisan terakhir paling bawah.

### Soal 2
Manakah deklarasi yang menghasilkan titik kecil berulang setiap `16px`?
- A. `background-image: radial-gradient(circle, #94a3b8 1px, transparent 1.5px); background-size: 16px 16px;`
- B. `background-image: radial-gradient(circle, #94a3b8 1px, transparent 1.5px);` (tanpa `background-size`)
- C. `background-color: radial-gradient(circle, #94a3b8 1px, transparent 1.5px);`
- D. `background-repeat: dots 16px;`

**Jawaban Benar:** A
**Penjelasan:** Gradien radial menggambar satu titik, dan `background-size: 16px 16px` mengecilkan gambar menjadi petak 16px yang kemudian berulang. Tanpa ukuran, gradien meregang memenuhi elemen (B). Gradien adalah gambar sehingga tidak valid sebagai `background-color` (C), dan `dots` bukan nilai `background-repeat` (D).

### Soal 3
Agar teks tampak diwarnai gradien, kombinasi apa yang diperlukan?
- A. `color: red` dan `text-shadow: none`.
- B. `background-image` berupa gradien, `background-clip: text` (dengan awalan `-webkit-` untuk jangkauan lebih luas), dan warna isi huruf yang transparan.
- C. `filter: gradient()` pada elemen teks.
- D. `text-decoration: gradient`.

**Jawaban Benar:** B
**Penjelasan:** Latar gradien dipotong sesuai bentuk huruf oleh `background-clip: text`, dan warna isi huruf dibuat transparan agar gradien terlihat. Sediakan warna cadangan dan penanganan `forced-colors` agar teks tidak hilang.

## Sumber
- [Using multiple backgrounds — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Backgrounds_and_borders/Using_multiple_backgrounds)
- [`repeating-linear-gradient()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/repeating-linear-gradient)
- [`radial-gradient()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/gradient/radial-gradient)
- [`background-clip` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/background-clip)
