# Tipografi Lanjutan: Variable Fonts (`font-variation-settings`), Fitur OpenType (`font-variant-numeric`), dan `font-size-adjust`

- **Tingkat:** Lanjut
- **Ringkasan:** Memanfaatkan satu berkas *Variable Font* WOFF2 untuk seluruh variasi ketebalan dan kemiringan, mengaktifkan angka pecahan/tabular OpenType, serta mencegah pergeseran tinggi huruf saat fallback font berganti dengan `font-size-adjust`.

## Mengapa Tipografi Lanjutan?

Pelajaran 09 membahas fon web dasar dengan `@font-face` dan `font-display: swap`. Dua topik berikut menaikkan kualitas dan performa: **variable font** (satu berkas untuk banyak gaya) dan **fitur OpenType** (angka tabular, pecahan, ligatur). Topik ketiga, `font-size-adjust`, mengatasi masalah umum saat fon cadangan memiliki tinggi huruf yang berbeda dari fon utama, yang memicu pergeseran tata letak ketika fon web selesai dimuat.

## 1. Variable Font: Satu Berkas, Banyak Gaya

Fon biasa memerlukan berkas terpisah untuk tiap bobot (Regular, Medium, Bold, ...). **Variable font** menyimpan satu berkas dengan **sumbu variasi** (*axes*) yang dapat diatur kontinu. Sumbu terdaftar yang umum:

| Tag | Nama | Properti CSS bertingkat tinggi |
|---|---|---|
| `wght` | Bobot (ketebalan) | `font-weight` |
| `wdth` | Lebar | `font-stretch` |
| `slnt` | Kemiringan (*slant*) | `font-style: oblique <sudut>` |
| `ital` | Miring (*italic*) | `font-style: italic` |
| `opsz` | Ukuran optis | `font-optical-sizing` |

Daftarkan rentang yang didukung berkas pada `@font-face`:

```css
@font-face {
  font-family: "Plus Jakarta Sans";
  src: url("/assets/fonts/plus-jakarta-sans-variable.woff2") format("woff2");
  font-weight: 200 800;       /* rentang bobot yang tersedia di berkas */
  font-style: normal;
  font-display: swap;
}

body   { font-family: "Plus Jakarta Sans", system-ui, sans-serif; font-weight: 400; }
.tebal { font-weight: 650; }  /* nilai antara 200 dan 800, tidak harus kelipatan 100 */
```

### Pakai Properti Tingkat Tinggi Lebih Dulu

Gunakan `font-weight`, `font-stretch`, dan `font-style` untuk sumbu terdaftar karena properti itu bekerja dengan pencocokan fon dan tetap berfungsi jika fon cadangan digunakan. Gunakan **`font-variation-settings`** hanya untuk **sumbu kustom** (tag huruf kapital, mis. `"GRAD"`, `"CASL"`) atau saat tidak ada properti tingkat tinggi:

```css
.judul-gradasi {
  font-variation-settings: "GRAD" 50, "CASL" 0.6;
}
```

> **⚠️ Jebakan:** `font-variation-settings` menetapkan **seluruh daftar sumbu sekaligus** dan tidak menggabungkan nilai dari aturan lain. Jika satu aturan menulis `"GRAD" 50` dan aturan lain `"CASL" 1`, yang menang menghapus yang lain. Gunakan variabel CSS untuk menyusun nilainya: `font-variation-settings: "GRAD" var(--grad, 0), "CASL" var(--casl, 0);`.

Keuntungan: satu berkas variabel sering lebih kecil dari beberapa berkas statis, mengurangi jumlah permintaan, dan memungkinkan animasi bobot yang halus (mis. teks menebal saat *hover*). `font-variation-settings` berstatus **Baseline Widely Available**.

## 2. Fitur OpenType: `font-variant-*`

Banyak fon mengandung fitur tipografi tambahan. Aktifkan lewat properti `font-variant-*` (lebih disarankan daripada `font-feature-settings` tingkat rendah):

| Properti dan nilai | Fungsi |
|---|---|
| `font-variant-numeric: tabular-nums` | Angka berlebar sama, sehingga kolom angka sejajar |
| `font-variant-numeric: proportional-nums` | Angka berlebar menyesuaikan bentuk |
| `font-variant-numeric: oldstyle-nums` / `lining-nums` | Angka gaya lama (naik-turun) / angka sejajar tinggi kapital |
| `font-variant-numeric: slashed-zero` | Nol bergaris, membedakan `0` dari huruf `O` |
| `font-variant-numeric: diagonal-fractions` | Pecahan seperti `1/2` ditata menjadi pecahan diagonal |
| `font-variant-numeric: ordinal` | Angka urutan (mis. `1st`) |
| `font-variant-caps: small-caps` | Huruf kapital kecil |
| `font-variant-ligatures: common-ligatures` | Ligatur umum (`fi`, `fl`) |

```css
.tabel-keuangan td:last-child {
  font-variant-numeric: tabular-nums slashed-zero;   /* beberapa nilai digabung dengan spasi */
  text-align: end;
}

.kode-produk {
  font-variant-numeric: slashed-zero;
}
```

Fitur hanya berfungsi bila **fon yang dipakai memuat fitur tersebut**. Fon sistem tidak selalu mendukung semuanya, dan fon web yang sudah di-*subset* mungkin telah membuang fitur itu. Untuk fitur tanpa properti khusus, gunakan `font-feature-settings: "ss01" 1`.

## 3. `font-size-adjust`: Menjaga Tinggi Huruf Tetap Konsisten

Dua fon yang diatur ke `16px` bisa tampak berbeda ukuran karena **tinggi huruf kecil (x-height)** mereka berbeda. Ketika fon web belum termuat dan fon cadangan dipakai, lalu fon web masuk menggantikan, teks bisa "melompat". `font-size-adjust` menyesuaikan ukuran fon sehingga tinggi hurufnya konsisten.

```css
body {
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-size-adjust: from-font;    /* pakai rasio tinggi-x dari fon pertama yang tersedia */
}

/* Atau tetapkan rasio secara eksplisit: x-height = 0,5 x ukuran fon */
.teks-kartu { font-size-adjust: 0.5; }
```

- `font-size-adjust: <angka>` menetapkan perbandingan x-height terhadap ukuran fon yang diinginkan; `from-font` mengambil nilai itu dari fon pertama yang tersedia.
- Status dukungan: **Baseline Newly Available** sejak Juli 2024 (Chrome 127, Firefox, dan Safari 16.4+); peramban lama mengabaikannya tanpa kerusakan.

Untuk mengurangi lompatan akibat perbedaan metrik fon cadangan, Anda juga bisa mendefinisikan fon cadangan "palsu" dengan deskriptor `@font-face` `size-adjust`, `ascent-override`, `descent-override`, dan `line-gap-override` agar dimensinya menyerupai fon web.

## Kesalahan Umum dan Cara Menghindarinya

1. **Memuat tiga atau empat berkas bobot statis padahal tersedia variable font.** Gunakan satu berkas variabel dan rentang `font-weight: 200 800`.
2. **Memakai `font-variation-settings` untuk bobot.** Gunakan `font-weight`; pengaturan rendah akan melewati pencocokan fon dan mengabaikan fon cadangan.
3. **Mengira `tabular-nums` bekerja pada semua fon.** Fon harus memiliki fitur tersebut; periksa tampilan di fon yang benar-benar dipakai.
4. **Mengaktifkan ligatur atau fitur dekoratif pada kode atau data.** Matikan bila mengganggu keterbacaan (`font-variant-ligatures: none`).

## Latihan Praktik: Tabel Keuangan dan Judul Variabel

Buatlah berkas `tipografi-lanjut.html` dan `tipografi.css`:
1. Pasang satu variable font WOFF2 dengan `font-weight: 200 800` dan buat tiga kelas bobot (`300`, `550`, `750`) tanpa menambah berkas.
2. Buat tabel nominal uang dengan `font-variant-numeric: tabular-nums` dan bandingkan sejajar tidaknya angka dengan `proportional-nums`.
3. Aktifkan `font-size-adjust: from-font` dan bandingkan lompatan teks saat fon web dimuat dengan jaringan yang diperlambat di DevTools.

## Kuis Pemahaman

### Soal 1
Berkas variable font mendukung bobot 200-800. Cara mana yang paling tepat mengatur bobot 650 pada teks?
- A. `font-variation-settings: "weight" 650`
- B. `font-weight: 650`
- C. `font-style: 650`
- D. `font-stretch: 650`

**Jawaban Benar:** B
**Penjelasan:** Sumbu bobot terdaftar (`wght`) diatur dengan properti tingkat tinggi `font-weight`, yang menerima nilai antara dalam rentang yang dideklarasikan di `@font-face`. Opsi A memakai tag yang salah (`wght`, bukan `weight`), sedangkan C dan D adalah properti yang berbeda.

### Soal 2
Apa fungsi `font-variant-numeric: tabular-nums` pada kolom angka di tabel?
- A. Mengubah angka menjadi huruf.
- B. Menjadikan semua digit berlebar sama sehingga angka antarbaris sejajar secara vertikal.
- C. Menghitung jumlah angka dalam kolom.
- D. Mengubah angka menjadi pecahan.

**Jawaban Benar:** B
**Penjelasan:** `tabular-nums` memakai bentuk angka berlebar tetap (jika fon menyediakannya), sehingga angka yang ditumpuk dalam kolom sejajar dan mudah dibandingkan.

### Soal 3
Mengapa `font-size-adjust: from-font` berguna saat fon web dan fon cadangan berganti?
- A. Menyembunyikan teks sampai fon web siap.
- B. Menyesuaikan ukuran fon agar tinggi huruf kecil (x-height) konsisten, sehingga teks tidak tampak berubah ukuran ketika fon berganti.
- C. Mengunduh fon web lebih cepat.
- D. Mengganti fon web dengan fon sistem secara permanen.

**Jawaban Benar:** B
**Penjelasan:** `font-size-adjust` menjaga perbandingan x-height terhadap ukuran fon. Dengan begitu, perbedaan tinggi huruf antara fon cadangan dan fon web berkurang, sehingga pergeseran tata letak saat pertukaran fon lebih kecil.

## Sumber
- [Variable fonts guide — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Fonts/Variable_fonts)
- [`font-variant-numeric` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variant-numeric)
- [`font-size-adjust` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-size-adjust)
- [`font-variation-settings` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variation-settings)
- [CSS Fonts Module Level 4 — W3C](https://www.w3.org/TR/css-fonts-4/)
