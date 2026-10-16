# Kaskade (Cascade), Spesifisitas, Pewarisan, dan `@layer`

- **Tingkat:** Dasar
- **Ringkasan:** Memahami bagaimana peramban menyelesaikan konflik aturan CSS melalui algoritma Cascade, menghitung bobot spesifisitas `(A, B, C)`, mengatur pewarisan properti, serta mengendalikan urutan prioritas arsitektur CSS menggunakan `@layer`.

## Mengapa Aturan CSS Saya Tidak Bekerja?

Pernahkah Anda menulis `color: blue;` pada sebuah kelas CSS, tetapi teks di layar tetap berwarna abu-abu meskipun berkas CSS sudah dimuat dengan benar?

Di CSS, satu elemen HTML bisa menjadi target dari lima atau sepuluh aturan CSS yang berbeda secara bersamaan. Karena sebuah elemen hanya bisa memiliki **satu** nilai akhir untuk setiap properti (misalnya satu `color` dan satu `font-size`), peramban menjalankan algoritma resolusi konflik yang disebut **The Cascade (Kaskade)**.

## 1. Urutan Prioritas Algoritma Cascade Modern

Ketika dua atau lebih deklarasi CSS memperebutkan properti yang sama pada satu elemen, peramban memutuskannya melalui tangga prioritas berikut (dari penentu tertinggi ke terendah):

```
1. Origin & Importance (!important)
   (Transisi aktif > !important User Agent > !important User > !important Author > Normal Author > User > User Agent)
          │
          ▼ (Jika sama-sama aturan Author normal:)
2. Konteks Enkapsulasi (mis. Shadow DOM vs dokumen luar)
          │
          ▼
3. Atribut style="" Inline pada Elemen HTML
          │
          ▼
4. Cascade Layers (@layer) — Lapisan yang dideklarasikan belakangan menang
   (Aturan di luar @layer mengalahkan semua aturan normal di dalam @layer!)
          │
          ▼ (Jika berada di dalam @layer yang sama:)
5. Spesifisitas Selektor (A, B, C) — ID > Class/Atribut/Pseudo-class > Elemen/Pseudo-element
          │
          ▼ (Jika nilai spesifisitasnya seri/sama persis:)
6. Urutan Kemunculan (Order of Appearance) — Yang ditulis paling bawah menang!
```

## 2. Menghitung Spesifisitas Selektor `(A, B, C)`

Setiap selektor CSS memiliki skor spesifisitas yang terdiri dari tiga kolom: **`(A, B, C)`**:

- **Kolom `A` (ID):** Jumlah selektor ID (seperti `#header`).
- **Kolom `B` (Kelas, Atribut, Pseudo-class):** Jumlah `.kelas`, `[atribut]`, dan `:pseudo-class` (seperti `:hover`, `:focus-visible`, `:nth-child()`).
- **Kolom `C` (Tipe Elemen & Pseudo-element):** Jumlah nama tag (`div`, `p`, `a`) dan `::pseudo-element` (`::before`, `::after`).

> **Aturan Penting Perhitungan:**
> - Kolom dibaca dari kiri ke kanan layaknya medali Olimpiade (Emas `A`, Perak `B`, Perunggu `C`). **Satu medali Emas `(1, 0, 0)` selalu mengalahkan seribu medali Perak `(0, 1000, 0)`!**
> - Selektor universal (`*`), kombinator (`>`, `+`, `~`, spasi), dan pseudo-class `:where(...)` menyumbang **`(0, 0, 0)`**.
> - Pseudo-class `:is()`, `:not()`, dan `:has()` tidak dihitung sebagai dirinya sendiri, melainkan menyumbang **spesifisitas tertinggi dari argumen di dalam kurungnya**.

### Tabel Contoh Perhitungan Spesifisitas

| Selektor | Skor `(A, B, C)` | Penjelasan Rincian |
|---|---|---|
| `*` atau `:where(#id.kelas)` | `(0, 0, 0)` | Selektor universal dan `:where()` selalu bernilai nol. |
| `article` | `(0, 0, 1)` | 1 elemen (`article`). |
| `article h2::before` | `(0, 0, 3)` | 2 elemen (`article`, `h2`) + 1 pseudo-element (`::before`). |
| `.kartu` | `(0, 1, 0)` | 1 kelas (`.kartu`) — mengalahkan `article h2::before`! |
| `ul.menu > li:first-child a[href]` | `(0, 3, 3)` | 3 di kolom B (`.menu`, `:first-child`, `[href]`) dan 3 di kolom C (`ul`, `li`, `a`). |
| `:is(#konten, .biasa) p` | `(1, 0, 1)` | `:is()` mengambil argumen tertinggi (`#konten` = `1,0,0`) + `p` (`0,0,1`). |
| `#navigasi` | `(1, 0, 0)` | 1 ID (`#navigasi`) — mengalahkan `(0, 3, 3)`! |

## 3. Mengendalikan Kaskade Tanpa Perang Spesifisitas dengan `@layer`

Dalam proyek besar yang menggabungkan CSS *reset*, pustaka komponen pihak ketiga, gaya dasar, dan kelas utilitas, pengembang sering terjebak dalam "perang spesifisitas"—menambahkan `#id .bungkus .kartu .tombol` atau menebar `!important` hanya demi menimpa gaya komponen bawaan.

Sejak Maret 2022 (status **Baseline Widely Available**), CSS menyediakan **Cascade Layers (`@layer`)** yang memungkinkan Anda menentukan urutan prioritas kelompok CSS secara eksplisit **tanpa memedulikan spesifisitas selektor di antar-lapisan**:

```css
/* 1. Deklarasikan urutan lapisan di baris paling atas berkas CSS Anda
      (dari prioritas TERENDAH di kiri ke TERTINGGI di kanan) */
@layer reset, dasar, komponen, utilitas;

@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
  }
}

@layer komponen {
  /* Meskipun selektor ini sangat spesifik (0, 2, 1), ia berada di layer 'komponen' */
  .kartu-produk a.tombol-beli {
    background-color: #2563eb;
    color: #ffffff;
    padding: 0.5rem 1rem;
  }
}

@layer utilitas {
  /* Selektor sederhana (0, 1, 0) ini MENANG melawan .kartu-produk a.tombol-beli
     karena layer 'utilitas' berada setelah layer 'komponen'! */
  .latar-merah {
    background-color: #dc2626;
  }
}
```

> **💡 Aturan Emas `@layer`:**
> Aturan CSS normal yang ditulis **tanpa `@layer` (unlayered styles)** memiliki prioritas lebih tinggi daripada semua lapisan `@layer`. Oleh karena itu, jika Anda menggunakan `@layer`, masukkan seluruh aturan CSS proyek Anda ke dalam lapisan yang sesuai, atau gunakan lapisan untuk menampung kode *reset* dan pustaka pihak ketiga agar kode Anda selalu mudah menimpanya.

## 4. Pewarisan (*Inheritance*) dan Kata Kunci Pengendali Nilai

Tidak semua properti CSS diwariskan dari elemen induk ke elemen anak. Secara logis:
- **Properti yang otomatis diwariskan (*Inherited*):** Properti yang berkaitan dengan teks dan tipografi, seperti `color`, `font-family`, `font-size`, `font-weight`, `line-height`, `text-align`, `list-style`, dan variabel CSS (`--*`). Jika Anda mengatur `font-family` pada `<body>`, seluruh paragraf dan judul di dalamnya otomatis mewarisi fon tersebut.
- **Properti yang TIDAK diwariskan (*Non-inherited*):** Properti yang berkaitan dengan kotak tata letak, seperti `width`, `height`, `margin`, `padding`, `border`, `background-color`, dan `display`. (Bayangkan betapa kacaunya jika Anda memberi `border: 2px solid black` pada `<body>` lalu setiap `<p>`, `<span>`, dan `<strong>` di dalamnya ikut memiliki bingkai hitam sendiri!).

Namun, elemen formulir (`<button>`, `<input>`, `<select>`, `<textarea>`) secara bawaan **tidak** mewarisi `font-family` dan `font-size` dari `<body>` karena mengikuti gaya sistem operasi. Kita dapat memaksanya mewarisi fon induk menggunakan kata kunci **`inherit`**:

```css
/* Memaksa elemen formulir mewarisi tipografi dari dokumen */
input, button, textarea, select {
  font: inherit;
  color: inherit;
}
```

### Empat Kata Kunci Reset Nilai di CSS
- **`inherit`:** Mengambil nilai komputasi dari elemen induk langsungnya.
- **`initial`:** Mengembalikan properti ke nilai awal menurut spesifikasi resmi CSS (hati-hati: `initial` dari `display` pada `<div>` bukanlah `block`, melainkan `inline`!).
- **`revert`:** Mengembalikan properti ke gaya bawaan peramban (*user-agent stylesheet*), sehingga `display: revert` pada `<div>` kembali menjadi `block`.
- **`revert-layer`:** Mengembalikan nilai properti ke nilai yang ditetapkan pada `@layer` sebelumnya!

## Kesalahan Umum dan Cara Menghindarinya

1. **Menyalahgunakan `!important` untuk jalan pintas:**
   - **Bahaya:** Begitu Anda menulis `color: red !important;` pada komponen dasar, satu-satunya cara menimpanya di kemudian hari adalah dengan menulis `!important` lagi dengan spesifisitas lebih tinggi. Simpan `!important` hanya untuk kelas utilitas aksesibilitas seperti `.sembunyikan[hidden] { display: none !important; }`.
2. **Menggunakan selektor `#id` untuk penataan gaya komponen:**
   - **Lebih Baik:** Gunakan atribut `id` di HTML untuk jangkar URL (`#bagian`), `<label for="...">`, atau JavaScript, tetapi gunakan `.kelas` di CSS agar spesifisitas tetap rendah dan mudah dikelola.

## Latihan Praktik: Menata Arsitektur CSS dengan `@layer`

Buatlah berkas `kaskade-layer.html` dan `layer.css` yang mendemonstrasikan:
1. Tiga lapisan `@layer reset, komponen, utilitas;`.
2. Di dalam `@layer reset`, pastikan semua elemen `input` dan `button` mewarisi `font: inherit`.
3. Di dalam `@layer komponen`, buat aturan `#kartu-utama .judul-kartu` berwarna biru tua.
4. Di dalam `@layer utilitas`, buat kelas `.teks-hijau` yang berhasil mengubah warna `#kartu-utama .judul-kartu` menjadi hijau **tanpa** memakai `!important` dan tanpa menulis `#kartu-utama`.

## Kuis Pemahaman

### Soal 1
Manakah dari empat selektor berikut yang memiliki bobot spesifisitas paling tinggi?
- A. `main article.pos-utama section p::first-line`
- B. `.kontainer .kartu .tombol:hover`
- C. `#panel-samping p`
- D. `:where(#panel-samping) .kartu .tombol`

**Jawaban Benar:** C
**Penjelasan:** Mari kita hitung skor `(A, B, C)` masing-masing:
- A memiliki 0 ID, 1 kelas, 5 elemen/pseudo-element = `(0, 1, 5)`.
- B memiliki 0 ID, 4 kelas/pseudo-class, 0 elemen = `(0, 4, 0)`.
- C memiliki 1 ID (`#panel-samping`) dan 1 elemen (`p`) = `(1, 0, 1)`.
- D memiliki `:where(#panel-samping)` yang bernilai `0`, ditambah 2 kelas = `(0, 2, 0)`.
Karena kolom `A` (ID) selalu mengalahkan kolom `B` dan `C` berapapun jumlahnya, maka `#panel-samping p` `(1, 0, 1)` menang.

### Soal 2
Perhatikan potongan kode CSS berikut:
```css
@layer dasar, tema;

@layer tema {
  .judul { color: green; }
}

@layer dasar {
  #judul-utama.judul { color: red; }
}
```
Jika sebuah elemen ditulis `<h1 id="judul-utama" class="judul">Halo</h1>`, warna apakah yang akan tampil?
- A. Merah (`red`), karena `#judul-utama.judul` memiliki spesifisitas ID yang jauh lebih tinggi.
- B. Hijau (`green`), karena di dalam algoritma Cascade, urutan `@layer` dievaluasi lebih dulu sebelum spesifisitas selektor, dan layer `tema` dideklarasikan setelah layer `dasar`.
- C. Hitam bawaan peramban, karena terjadi konflik antara `@layer` dan ID.
- D. Merah (`red`), karena blok `@layer dasar` ditulis paling bawah di berkas CSS.

**Jawaban Benar:** B
**Penjelasan:** Dalam algoritma Cascade, prioritas `@layer` dievaluasi **sebelum** spesifisitas selektor. Karena baris pertama menetapkan `@layer dasar, tema;`, maka aturan normal di dalam layer `tema` selalu mengalahkan aturan normal di dalam layer `dasar`, meskipun aturan di `dasar` menggunakan selektor `#id`.

### Soal 3
Apa perbedaan antara `display: initial` dan `display: revert` ketika diterapkan pada sebuah elemen `<div>`?
- A. Tidak ada perbedaan; keduanya mengembalikan `<div>` menjadi `display: block`.
- B. `display: initial` mengembalikan properti ke nilai awal spesifikasi CSS (`inline`), sedangkan `display: revert` mengembalikannya ke aturan bawaan peramban untuk elemen `<div>` (`block`).
- C. `display: revert` menghapus elemen dari DOM, sedangkan `display: initial` menyembunyikannya.
- D. `display: initial` hanya bekerja di dalam `@layer`.

**Jawaban Benar:** B
**Penjelasan:** Nilai awal (*initial value*) dari properti `display` pada spesifikasi CSS untuk semua elemen sebenarnya adalah `inline`. Elemen `<div>` tampil sebagai kotak blok karena stylesheet bawaan peramban (*user-agent stylesheet*) memberinya `div { display: block; }`. Kata kunci `revert` memutar balik aturan ke stylesheet bawaan peramban (`block`), sedangkan `initial` memutar balik ke nilai spesifikasi murni (`inline`).

## Sumber
- [CSS cascading and inheritance — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade)
- [Inheritance — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Inheritance)
- [CSS: Cascading Style Sheets — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS)
