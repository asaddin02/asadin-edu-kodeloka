# Algoritma Penempatan Otomatis CSS Grid (`grid-auto-flow: row dense`) dan `grid-auto-rows`

- **Tingkat:** Lanjut
- **Ringkasan:** Mengendalikan bagaimana CSS Grid menempatkan item yang tidak memiliki koordinat eksplisit, mengisi celah kosong pada galeri bento menggunakan `grid-auto-flow: dense`, serta menjaga aksesibilitas urutan baca.

## Mengapa Perlu Memahami Penempatan Otomatis?

Sebagian besar item di sebuah grid tidak diberi koordinat; kita membiarkan peramban menaruhnya satu per satu ke sel kosong berikutnya. Algoritma yang menentukan "sel kosong berikutnya" itulah yang disebut **auto-placement**. Memahaminya menjelaskan mengapa muncul **celah kosong** pada galeri dengan ukuran item beragam, bagaimana `dense` menutupnya, dan mengapa baris atau kolom tak terduga (*implicit tracks*) tiba-tiba muncul.

## 1. Jalur Eksplisit dan Implisit

Jalur (*track*) yang dibuat oleh `grid-template-columns` dan `grid-template-rows` adalah **eksplisit**. Jika jumlah item melebihi sel yang tersedia, atau sebuah item ditaruh di luar jalur yang ada, peramban membuat jalur **implisit** secara otomatis. Ukuran jalur implisit diatur oleh `grid-auto-rows` dan `grid-auto-columns` (bawaannya `auto`).

```css
.galeri {
  display: grid;
  grid-template-columns: repeat(4, 1fr);   /* 4 kolom eksplisit */
  grid-auto-rows: 10rem;                   /* setiap baris (implisit) setinggi 10rem */
  gap: 0.75rem;
}
```

Untuk baris yang tingginya perlu mengikuti isi tetapi tidak boleh terlalu pendek, gunakan `grid-auto-rows: minmax(8rem, auto)`.

## 2. Arah Aliran: `grid-auto-flow`

`grid-auto-flow` menentukan arah dan cara penempatan otomatis:
- `row` (bawaan): isi baris demi baris dari kiri ke kanan, lalu baris berikutnya.
- `column`: isi kolom demi kolom (cocok bila jumlah baris didefinisikan dengan `grid-template-rows`).
- `dense`: ditambahkan di belakang `row` atau `column` (mis. `row dense`) untuk mengisi celah. Dibahas di bawah.

## 3. Algoritma Bawaan (*Sparse*) dan Celah Kosong

Pada mode bawaan, peramban memakai **kursor** yang selalu bergerak maju. Item ditaruh di sel kosong pertama setelah posisi kursor; **kursor tidak pernah mundur** untuk mengisi celah yang sudah dilewati.

**Contoh:** Grid 4 kolom dengan item berurutan `A` (`span 2`), `B` (`span 3`), `C` (`span 1`).
- `A` menempati baris 1 kolom 1-2.
- `B` memerlukan 3 kolom, sedangkan baris 1 hanya menyisakan 2 kolom. `B` pindah ke baris 2 kolom 1-3. Kolom 3-4 pada baris 1 **kosong** (celah).
- `C` menempati sel kosong pertama setelah kursor, yaitu baris 2 kolom 4. Celah di baris 1 tetap kosong.

## 4. `grid-auto-flow: row dense`: Menambal Celah

Dengan `dense`, peramban mencari sel kosong **dari awal grid** untuk setiap item, sehingga item kecil berikutnya mengisi celah yang tertinggal:

```css
.bento {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 10rem;
  grid-auto-flow: row dense;
  gap: 0.75rem;
}
.bento .lebar  { grid-column: span 2; }
.bento .tinggi { grid-row: span 2; }
.bento .besar  { grid-column: span 2; grid-row: span 2; }
```

Pada contoh sebelumnya, `C` kini menempati baris 1 kolom 3, mengisi celah, dan galeri tampak rapat.

> **⚠️ Peringatan Aksesibilitas:** `dense` dapat menaruh item **tidak sesuai urutan HTML**. Secara visual urutan menjadi lompat-lompat, sedangkan **fokus papan ketik dan pembaca layar tetap mengikuti urutan DOM**. Ini dapat melanggar WCAG SC 1.3.2 (urutan bermakna) dan SC 2.4.3 (urutan fokus). Gunakan `dense` hanya untuk konten yang urutannya tidak penting, seperti galeri foto atau kartu yang setara, dan hindari untuk daftar bernomor, langkah prosedur, atau formulir.

## 5. Mencampur Penempatan Eksplisit dan Otomatis

Item yang diberi koordinat eksplisit (`grid-column: 1 / -1`, `grid-row: 2`) ditempatkan lebih dahulu. Item lainnya mengisi sel yang tersisa. Karena itu, spanduk lebar yang diberi `grid-column: 1 / -1` mungkin muncul **lebih awal secara visual** daripada posisinya di HTML, dengan implikasi aksesibilitas yang sama seperti di atas.

## Studi Kasus Produksi: Dinding Galeri Dokumentasi Visual yang Responsif

Untuk membuat galeri foto kegiatan yang responsif di segala ukuran layar sekaligus meminimalkan celah kosong, kombinasikan `repeat(auto-fill, minmax(...))` dengan `grid-auto-flow: row dense`:

```css
.dinding-foto {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 12rem), 1fr));
  grid-auto-rows: 11rem;
  grid-auto-flow: row dense;
  gap: 0.75rem;
}

@media (min-width: 40rem) {
  .dinding-foto .panorama { grid-column: span 2; }
  .dinding-foto .potret   { grid-row: span 2; }
}
```

Membatasi `span 2` hanya di dalam `@media (min-width: 40rem)` mencegah item `.panorama` memaksa munculnya kolom implisit kedua ketika layar ponsel hanya muat satu kolom.

## Kesalahan Umum dan Cara Menghindarinya

1. **Menyangka celah kosong adalah bug.** Itu perilaku algoritma bawaan yang tidak memundurkan kursor; gunakan `dense` bila urutan tidak penting.
2. **Memakai `dense` pada konten berurutan.** Pembaca layar dan pengguna papan ketik akan mengalami urutan yang membingungkan.
3. **Tidak mengatur `grid-auto-rows`.** Baris implisit setinggi isi saja (`auto`), sehingga kartu dalam satu baris bisa memiliki tinggi tak seragam.
4. **Mengira `grid-column: 1 / -1` mencakup kolom implisit.** `-1` hanya merujuk garis terakhir dari explicit grid.

## Latihan Praktik: Galeri Bento Padat

Buatlah berkas `grid-auto.html` dan `grid-auto.css`:
1. Buat grid 4 kolom berisi 10 kartu dengan beberapa kartu `.lebar`, `.tinggi`, dan `.besar`; atur `grid-auto-rows: 10rem`.
2. Amati celah kosong pada mode bawaan, lalu tambahkan `grid-auto-flow: row dense` dan bandingkan hasilnya.
3. Tekan `Tab` pada tautan di dalam kartu dan catat apakah urutan fokus mengikuti urutan visual. Tulis satu kalimat ringkas tentang risiko aksesibilitasnya.

## Kuis Pemahaman

### Soal 1
Pada grid 4 kolom, item `A` (`span 2`), `B` (`span 3`), dan `C` (`span 1`) ditempatkan otomatis berurutan **tanpa** `dense`. Di mana `C` berada?
- A. Baris 1 kolom 3.
- B. Baris 2 kolom 4.
- C. Baris 1 kolom 4.
- D. Baris 3 kolom 1.

**Jawaban Benar:** B
**Penjelasan:** `A` mengisi baris 1 kolom 1-2. `B` tidak muat di sisa dua kolom, sehingga pindah ke baris 2 kolom 1-3. Pada algoritma bawaan kursor tidak mundur, jadi `C` menempati sel kosong berikutnya setelah `B`, yaitu baris 2 kolom 4. Dengan `dense`, `C` akan mengisi baris 1 kolom 3.

### Soal 2
Apa risiko utama penggunaan `grid-auto-flow: dense` pada daftar langkah-langkah instalasi (Langkah 1, 2, 3, dst.)?
- A. Tampilan tidak dapat dicetak.
- B. Peramban menolak deklarasinya.
- C. Urutan visual dapat berbeda dari urutan DOM, sedangkan fokus papan ketik dan pembaca layar mengikuti DOM, sehingga langkah dapat tampak tidak berurutan.
- D. Grid kehilangan semua baris eksplisitnya.

**Jawaban Benar:** C
**Penjelasan:** `dense` menaruh item kecil ke celah yang tertinggal, sehingga posisi visualnya dapat mendahului item sebelumnya di HTML. Karena itu `dense` tidak cocok untuk konten yang urutannya bermakna.

### Soal 3
Apa fungsi `grid-auto-rows: 10rem` pada grid yang hanya mendefinisikan `grid-template-columns`?
- A. Memberi tinggi `10rem` pada semua baris implisit yang dibuat otomatis.
- B. Membatasi grid hanya pada satu baris setinggi `10rem`.
- C. Mengubah jumlah kolom menjadi `10`.
- D. Mengatur jarak antar-baris (`gap`) sebesar `10rem`.

**Jawaban Benar:** A
**Penjelasan:** Baris yang tidak didefinisikan lewat `grid-template-rows` adalah baris implisit, dan ukurannya diatur oleh `grid-auto-rows`. Dengan `10rem`, setiap baris yang dibuat otomatis setinggi `10rem`.

## Sumber
- [Auto-placement in grid layout — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Auto-placement)
- [`grid-auto-flow` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-auto-flow)
- [`grid-auto-rows` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-auto-rows)
- [Understanding Success Criterion 1.3.2: Meaningful Sequence — W3C WAI](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html)
