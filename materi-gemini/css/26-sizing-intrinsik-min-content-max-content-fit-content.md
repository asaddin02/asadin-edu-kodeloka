# Ukuran Intrinsik Kotak: `min-content`, `max-content`, dan `fit-content`

- **Tingkat:** Menengah
- **Ringkasan:** Mengatur lebar dan tinggi elemen berdasarkan ukuran alami konten di dalamnya menggunakan kata kunci `min-content`, `max-content`, dan `fit-content` pada komponen lencana, judul, maupun jalur CSS Grid.

## Mengapa Ukuran Intrinsik Penting?

Sampai sekarang kita menentukan ukuran dengan angka: `width: 20rem`, `inline-size: 50%`. Kadang yang kita inginkan justru ukuran yang **mengikuti isi**: lencana yang selebar teksnya, judul yang tidak lebih lebar dari kata terpanjangnya, atau kolom grid yang pas dengan isinya. CSS menyediakan tiga kata kunci untuk itu. Ketiganya tersedia lintas peramban dan berstatus **Baseline Widely Available** (`min-content` dan `max-content` sejak Januari 2020, `fit-content` sejak November 2021).

## 1. Tiga Ukuran Alami Sebuah Kotak

Bayangkan paragraf berisi kalimat "Belajar CSS modern bersama Kodeloka".

- **`min-content`**: ukuran **terkecil** yang masih memuat isi tanpa meluber. Untuk teks, ini sama dengan lebar **kata (atau potongan tak terputus) terpanjang**, karena peramban boleh memecah baris di setiap spasi. Paragraf di atas menjadi tumpukan kata satu per baris, selebar kata "Kodeloka" atau "bersama".
- **`max-content`**: ukuran **ideal** bila isi tidak boleh membungkus, yaitu lebar seluruh teks dalam satu baris. Jika wadahnya lebih sempit, kotak akan meluber keluar.
- **`fit-content`**: ukuran yang **pas dengan isi, tetapi tidak melebihi ruang yang tersedia**. Rumusnya: `min(max-content, max(min-content, ruang-tersedia))`.

```css
.contoh-min   { inline-size: min-content; }   /* selebar kata terpanjang */
.contoh-max   { inline-size: max-content; }   /* selebar seluruh teks dalam satu baris */
.contoh-fit   { inline-size: fit-content; }   /* menyusut sesuai isi, tapi tak melebihi wadah */
```

## 2. Pola Praktis dengan `fit-content`

### Lencana dan Judul yang "Membungkus" Isi

`<div>` adalah elemen blok yang secara bawaan melebar penuh. Dengan `width: fit-content`, ia menyusut mengikuti isi namun tetap berwujud blok sehingga bisa ditengahkan dengan `margin-inline: auto`:

```css
.lencana-tengah {
  inline-size: fit-content;
  margin-inline: auto;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background-color: oklch(92% 0.05 255);
}
```

### Judul Tidak Terlalu Lebar

```css
.judul-artikel {
  inline-size: fit-content;
  max-inline-size: 100%;   /* tidak melebihi wadah */
  text-wrap: balance;
}
```

### Kolom Grid yang Pas dengan Isi

Pada `grid-template-columns`, tiga kata kunci ini dapat dipakai langsung sebagai ukuran jalur, ditambah fungsi `fit-content(<panjang>)` yang membatasi jalur agar tidak melebihi panjang tertentu:

```css
.tata-letak {
  display: grid;
  gap: 1.5rem;
  /* Kolom 1: pas dengan isi tetapi tidak lebih lebar dari 16rem.
     Kolom 2: mengambil sisa ruang. */
  grid-template-columns: fit-content(16rem) minmax(0, 1fr);
}

.tabel-ringkas {
  display: grid;
  /* Kolom label selebar label terpanjang (max-content), kolom nilai sisanya */
  grid-template-columns: max-content 1fr;
  gap: 0.5rem 1rem;
}
```

> **💡 Catatan:** Fungsi `fit-content(<panjang>)` didukung untuk **jalur grid** (`grid-template-columns`, `grid-auto-columns`). Fungsi bentuk ini belum didukung untuk properti `width` di peramban utama; di sana gunakan kata kunci `fit-content` tanpa kurung.

## 3. Intrinsik pada Sumbu Block

Kata kunci `min-content`, `max-content`, dan `fit-content` terutama bermakna pada sumbu *inline* (lebar). Pada sumbu *block* (tinggi), tinggi kotak sudah mengikuti isi, sehingga ketiganya pada `block-size` berperilaku seperti `auto`. Untuk menentukan tinggi, ukuran intrinsik jarang diperlukan.

## 4. Kapan Memakai Mana?

| Kebutuhan | Pilihan |
|---|---|
| Kotak selebar teksnya, tetapi boleh membungkus bila wadah sempit | `fit-content` |
| Kotak dipaksa satu baris (lencana, tombol, label) | `max-content` |
| Kolom paling sempit yang masih menampilkan semua kata utuh | `min-content` |
| Lebar kolom grid pas isi dengan batas maksimum | `fit-content(16rem)` |

Perhatikan bahwa `max-content` bisa membuat kotak meluber di layar kecil. Kombinasikan dengan `max-inline-size: 100%` bila perlu: `inline-size: max-content; max-inline-size: 100%;`.

## Kesalahan Umum dan Cara Menghindarinya

1. **Memakai `max-content` untuk teks panjang tanpa batas.** Paragraf akan menolak membungkus dan meluber keluar layar ponsel.
2. **Mengira `min-content` bergantung pada lebar wadah.** Nilainya hanya ditentukan isi, bukan wadah.
3. **Menulis `width: fit-content(20rem)` dan berharap bekerja di semua peramban.** Bentuk fungsi hanya andal untuk jalur grid.
4. **Lupa bahwa `fit-content` pada elemen blok tidak menengahkan sendiri.** Tambahkan `margin-inline: auto`.

## Latihan Praktik: Komponen yang Mengikuti Isi

Buatlah berkas `intrinsik.html` dan `intrinsik.css`:
1. Buat lencana status dengan `inline-size: fit-content` yang berada di tengah halaman.
2. Buat daftar spesifikasi dengan dua kolom grid: `grid-template-columns: max-content 1fr`. Coba perpanjang salah satu label dan amati kolom pertama ikut melebar.
3. Buat tata letak dua kolom `fit-content(16rem) minmax(0, 1fr)` dan isi kolom pertama dengan teks yang sangat panjang untuk memastikan lebarnya berhenti di `16rem`.

## Kuis Pemahaman

### Soal 1
Sebuah `<div>` ditulis dengan `inline-size: fit-content; margin-inline: auto;`. Apa efeknya?
- A. Lebarnya selalu `100%` dari wadah.
- B. Lebarnya menyusut mengikuti isi (tidak melebihi wadah) dan kotaknya berada di tengah wadah.
- C. Lebarnya sama dengan kata terpanjang di dalam div.
- D. Div menjadi elemen `inline` sehingga margin otomatis diabaikan.

**Jawaban Benar:** B
**Penjelasan:** `fit-content` membuat lebar pas dengan isi namun dibatasi ruang yang tersedia, dan elemen tetap berupa blok sehingga `margin-inline: auto` dapat menengahkannya.

### Soal 2
Sebuah teks memiliki `min-content` = `80px` dan `max-content` = `500px`. Pada wadah selebar `300px`, berapa lebar `fit-content`?
- A. `80px`
- B. `500px`
- C. `300px`
- D. `580px`

**Jawaban Benar:** C
**Penjelasan:** `fit-content` = `min(max-content, max(min-content, ruang tersedia))` = `min(500, max(80, 300))` = `min(500, 300)` = `300px`.

### Soal 3
Pada ukuran `min-content` untuk sebuah paragraf teks biasa, lebar kotak ditentukan oleh apa?
- A. Jumlah seluruh karakter dalam paragraf.
- B. Lebar wadah induk.
- C. Tinggi baris paragraf.
- D. Potongan teks tak terputus yang terpanjang, misalnya kata terpanjang.

**Jawaban Benar:** D
**Penjelasan:** `min-content` adalah ukuran terkecil yang membuat isi tidak meluber. Teks dapat dipecah di setiap spasi, sehingga batas bawahnya adalah kata atau potongan tak terputus yang paling lebar.

## Sumber
- [`fit-content` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/fit-content)
- [`min-content` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/min-content)
- [`max-content` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/max-content)
- [CSS Box Sizing Module Level 3 — W3C](https://www.w3.org/TR/css-sizing-3/)
