# Box Model, Margin Collapsing, dan Properti Logis (`inline` & `block`)

- **Tingkat:** Dasar
- **Ringkasan:** Memahami empat lapisan kotak CSS (konten, padding, border, margin), mengapa `box-sizing: border-box` wajib menjadi standar, cara kerja peleburan margin vertikal (*margin collapsing*), serta penggunaan properti logis modern.

## Semua Elemen di Halaman Web Adalah Kotak Persegi Panjang

Bahkan ketika Anda membuat lingkaran dengan `border-radius: 50%`, mesin tata letak peramban tetap memperlakukan setiap elemen HTML sebagai sebuah kotak persegi panjang yang mengikuti **CSS Box Model**.

Setiap kotak tersusun atas empat lapisan konsentris dari dalam ke luar:

```
+-------------------------------------------------------------------+
|                             MARGIN                                |
|   (Ruang transparan di luar batas kotak untuk menjauhkan tetangga)|
|   +-----------------------------------------------------------+   |
|   |                         BORDER                            |   |
|   |       (Garis bingkai yang mengelilingi padding & konten)  |   |
|   |   +---------------------------------------------------+   |   |
|   |   |                     PADDING                       |   |   |
|   |   |     (Bantalan ruang di dalam kotak; ikut terkena  |   |   |
|   |   |      warna background elemen)                     |   |   |
|   |   |   +-------------------------------------------+   |   |   |
|   |   |   |                                           |   |   |   |
|   |   |   |                  CONTENT                  |   |   |   |
|   |   |   |         (Teks, gambar, atau anak)         |   |   |   |
|   |   |   |                                           |   |   |   |
|   |   |   +-------------------------------------------+   |   |   |
|   |   +---------------------------------------------------+   |   |
|   +-----------------------------------------------------------+   |
+-------------------------------------------------------------------+
```

## 1. `content-box` vs `border-box`: Mengapa `border-box` Adalah Penyelamat?

Secara bawaan, CSS menggunakan model perhitungan kuno bernama **`box-sizing: content-box`**. Dalam mode `content-box`, ketika Anda menulis `width: 300px`, angka `300px` tersebut **hanya mengatur lebar area CONTENT di bagian paling dalam**.

Akibatnya, jika Anda menambahkan `padding: 20px` dan `border: 2px solid`, lebar total kotak yang sebenarnya di layar membengkak menjadi:
`300px (content) + 20px (padding kiri) + 20px (padding kanan) + 2px (border kiri) + 2px (border kanan) = 344px`!

Hal ini sangat menyulitkan ketika Anda ingin menaruh dua kotak `width: 50%` berdampingan namun tetap memiliki `padding` dan `border`.

Solusinya adalah mengubah perhitungan menjadi **`box-sizing: border-box`** di awal setiap berkas CSS Anda:

```css
/* Aturan wajib di baris paling atas setiap proyek CSS modern */
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

Dengan `box-sizing: border-box`, ketika Anda menulis `width: 300px`, maka **lebar total dari batas luar border kiri hingga batas luar border kanan dijamin tepat `300px`**. Jika Anda menambahkan `padding: 20px` dan `border: 2px`, peramban secara otomatis menyusutkan ruang konten di dalamnya menjadi `256px` tanpa merusak ukuran luar kotak!

## 2. Memahami Peleburan Margin Vertikal (*Margin Collapsing*)

Berbeda dengan `padding` yang selalu dijumlahkan apa adanya, **margin vertikal (atas dan bawah) pada elemen blok di dalam aliran normal (*normal flow*) tidak dijumlahkan, melainkan melebur menjadi satu nilai terbesar**.

### Kapan Margin Collapsing Terjadi?
1. **Dua elemen adik-kakak yang berurutan secara vertikal:**
   Jika paragraf pertama memiliki `margin-bottom: 24px` dan paragraf kedua di bawahnya memiliki `margin-top: 16px`, jarak di antara keduanya **bukanlah `40px` (`24 + 16`)**, melainkan **`24px`** (nilai terbesar dari keduanya).
2. **Elemen induk dan anak pertamanya (Jebakan Paling Umum!):**
   Jika Anda memiliki `<section class="hero">` tanpa `padding-top` dan tanpa `border-top`, lalu di dalamnya terdapat `<h1>` dengan `margin-top: 32px`, maka margin milik `<h1>` tersebut akan **menembus keluar elemen `<section>`** dan mendorong seluruh `<section>` turun sejauh `32px`!

```css
/* Masalah: margin-top milik h1 menembus keluar .hero sehingga muncul celah putih di atas .hero */
.hero {
  background-color: #1e293b;
  color: #ffffff;
}

/* Solusi 1 (Paling Direkomendasikan): Gunakan padding pada wadah induk, bukan margin pada anak pertama */
.hero {
  background-color: #1e293b;
  color: #ffffff;
  padding-block: 2rem;
}

/* Solusi 2: Buat Block Formatting Context (BFC) baru dengan display: flow-root */
.hero-bfc {
  display: flow-root;
}
```

> **💡 Catatan Penting:**
> *Margin collapsing* **tidak pernah terjadi** pada arah horizontal (kiri-kanan), dan **tidak pernah terjadi** pada elemen yang berada di dalam kontainer **Flexbox** (`display: flex`) maupun **CSS Grid** (`display: grid`). Di dalam Flexbox dan Grid, gunakan properti **`gap`** untuk mengatur jarak antar-elemen dengan bersih!

## 3. Properti Logis (`inline` dan `block`) vs Properti Fisik

Secara tradisional, kita menulis properti berbasis arah fisik layar: `top`, `right`, `bottom`, `left`, serta `width` dan `height`.

Namun, CSS modern memperkenalkan **Logical Properties** (status **Baseline Widely Available**) yang mengikuti arah aliran teks dokumen (*writing mode*):
- **Dimensi `inline` (Sejajar baris kalimat):** Dalam Bahasa Indonesia/Inggris (`ltr`), sumbu `inline` adalah **kiri ke kanan** (`inline-start` = kiri, `inline-end` = kanan, `inline-size` = lebar/`width`). Dalam bahasa Arab (`rtl`), `inline-start` otomatis berbalik menjadi kanan!
- **Dimensi `block` (Sejajar tumpukan paragraf):** Sumbu `block` adalah **atas ke bawah** (`block-start` = atas, `block-end` = bawah, `block-size` = tinggi/`height`).

| Properti Fisik Lama | Properti Logis Modern | Keuntungan Praktis |
|---|---|---|
| `width` / `max-width` | `inline-size` / `max-inline-size` | Menyesuaikan mode penulisan secara otomatis. |
| `height` / `min-height` | `block-size` / `min-block-size` | Konsisten dengan sistem dimensi blok. |
| `margin-left: auto; margin-right: auto;` | `margin-inline: auto;` | Menengahkan kotak blok cukup dengan **satu baris**! |
| `padding-top: 1rem; padding-bottom: 1rem;` | `padding-block: 1rem;` | Mengatur bantalan atas dan bawah sekaligus tanpa mengubah kiri-kanan. |
| `padding-left: 1.5rem; padding-right: 1.5rem;` | `padding-inline: 1.5rem;` | Mengatur bantalan kiri dan kanan sekaligus. |
| `border-left: 4px solid blue;` | `border-inline-start: 4px solid blue;` | Garis aksen otomatis pindah ke kanan pada bahasa RTL. |

```css
/* Menata wadah artikel yang terpusat dan rapi menggunakan properti logis */
.wadah-artikel {
  max-inline-size: 68ch;
  margin-inline: auto;
  padding-inline: 1.25rem;
  padding-block: 2rem;
}

.kotak-catatan {
  border-inline-start: 4px solid #2563eb;
  padding-inline-start: 1rem;
  margin-block: 1.5rem;
}
```

## 4. Mengendalikan Konten yang Meluber dengan `overflow`

Ketika sebuah kotak diberi ukuran tetap (yang sebaiknya dihindari kecuali diperlukan) atau memiliki kode panjang yang tak terputus, konten dapat meluber keluar batas kotak. Anda dapat mengendalikannya dengan `overflow` (`overflow-x` / `overflow-y` atau logis `overflow-inline` / `overflow-block`):

- **`visible` (bawaan):** Konten dibiarkan tampil melewati batas kotak.
- **`hidden`:** Konten yang lewat dipotong dan tidak bisa digulir sama sekali.
- **`clip`:** Memotong konten seperti `hidden`, tetapi sama sekali melarang pengguliran terprogram pun dan tidak membuat *scroll container* baru (sangat berguna bila Anda punya elemen `position: sticky` di dalamnya).
- **`auto`:** Menampilkan bilah gulir (*scrollbar*) **hanya jika** konten benar-benar melebihi ukuran kotak (jauh lebih rapi daripada `scroll` yang selalu memunculkan rel *scrollbar* kosong).

## Latihan Praktik: Membangun Komponen Callout dan Wadah Artikel

Buatlah berkas `box-model.html` dan `box.css` yang menerapkan:
1. Reset global `box-sizing: border-box`.
2. Sebuah `.wadah-utama` yang terpusat di tengah layar dengan lebar maksimal `720px` menggunakan `max-inline-size` dan `margin-inline: auto`, serta bantalan kiri-kanan `padding-inline: 1rem`.
3. Dua komponen `.callout` berurutan yang memiliki `border-inline-start: 4px solid #0284c7`, `padding-block: 1rem`, `padding-inline: 1.25rem`, dan amati bagaimana `margin-block: 1.5rem` pada keduanya melebur dengan rapi.

## Kuis Pemahaman

### Soal 1
Sebuah elemen `<div>` memiliki aturan CSS berikut:
```css
div {
  box-sizing: border-box;
  width: 400px;
  padding: 20px;
  border: 5px solid black;
  margin: 15px;
}
```
Berapakah lebar ruang konten dalam (*content width*) dari elemen `<div>` tersebut?
- A. `400px`
- B. `450px`
- C. `350px`
- D. `320px`

**Jawaban Benar:** C
**Penjelasan:** Karena menggunakan `box-sizing: border-box`, angka `width: 400px` mencakup konten + padding kiri & kanan + border kiri & kanan (margin tidak termasuk di dalam `border-box`). Maka lebar ruang kontennya adalah `400px - (20px * 2) - (5px * 2) = 400px - 40px - 10px = 350px`.

### Soal 2
Dalam aliran dokumen normal (*normal flow*), elemen `<p class="pertama">` memiliki `margin-bottom: 30px`, dan tepat di bawahnya terdapat `<p class="kedua">` dengan `margin-top: 20px`. Berapakah jarak vertikal aktual di antara kedua paragraf tersebut?
- A. `50px`
- B. `30px`
- C. `20px`
- D. `10px`

**Jawaban Benar:** B
**Penjelasan:** Akibat perilaku *margin collapsing* pada margin vertikal yang bersinggungan dalam aliran blok normal, kedua margin tidak dijumlahkan (`30 + 20`), melainkan melebur menjadi satu nilai terbesar di antara keduanya, yaitu `30px`.

### Soal 3
Properti CSS logis manakah yang setara dengan menulis `margin-left: auto; margin-right: auto;` pada dokumen berbahasa Indonesia (arah teks horizontal kiri-ke-kanan)?
- A. `margin-block: auto;`
- B. `margin-inline: auto;`
- C. `padding-inline: auto;`
- D. `inset-block: auto;`

**Jawaban Benar:** B
**Penjelasan:** Pada mode penulisan horizontal, sumbu `inline` merentang secara horizontal (sejajar baris teks: kiri dan kanan), sedangkan sumbu `block` merentang secara vertikal (atas dan bawah). Oleh karena itu, `margin-inline: auto` mengatur margin kiri dan kanan sekaligus menjadi `auto`.

## Sumber
- [Introduction to the CSS box model — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_model/Introduction)
- [The box model — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model)
- [CSS box model — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_model)
