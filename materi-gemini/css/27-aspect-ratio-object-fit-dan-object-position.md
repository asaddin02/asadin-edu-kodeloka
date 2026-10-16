# Mengendalikan Proporsi Media dengan `aspect-ratio`, `object-fit`, dan `object-position`

- **Tingkat:** Dasar
- **Ringkasan:** Menjaga kestabilan rasio bingkai foto, kartu video, dan avatar menggunakan `aspect-ratio`, mencegah distorsi gambar dengan `object-fit: cover/contain`, serta mengatur titik fokus potongan dengan `object-position`.

## Mengapa Proporsi Media Perlu Dikendalikan?

Gambar dan video sering memiliki rasio yang berbeda-beda: foto potret, tangkapan layar lebar, ikon persegi. Jika semuanya dipaksa masuk ke kotak kartu dengan ukuran yang sama, hasilnya bisa gepeng, terpotong sembarangan, atau membuat tata letak melompat saat gambar selesai dimuat. Tiga properti berikut menyelesaikan masalah itu, dan semuanya berstatus **Baseline Widely Available**: `object-fit` dan `object-position` (sejak Januari 2020) serta `aspect-ratio` (sejak September 2021).

## 1. `aspect-ratio`: Mengunci Perbandingan Lebar dan Tinggi

`aspect-ratio` menetapkan perbandingan antara lebar dan tinggi kotak. Selama salah satu dimensi bernilai `auto`, dimensi lainnya dihitung otomatis.

```css
.sampul-kartu {
  inline-size: 100%;
  aspect-ratio: 16 / 9;      /* tinggi otomatis = lebar x 9/16 */
}

.avatar {
  inline-size: 3.5rem;
  aspect-ratio: 1;           /* sama dengan 1 / 1: persegi sempurna */
  border-radius: 50%;
}

.gambar-fleksibel {
  aspect-ratio: auto 3 / 2;  /* pakai rasio asli gambar jika sudah diketahui; cadangan 3/2 */
}
```

Hal yang perlu diperhatikan:
- Rasio ditulis `lebar / tinggi`, misalnya `16 / 9` atau satu angka seperti `1.777`.
- Jika isi kotak lebih tinggi daripada tinggi hasil rasio, kotak **tetap membesar** mengikuti isi (karena `min-block-size` bawaannya `auto`). Untuk memaksa rasio tetap, beri `min-block-size: 0` dan `overflow: hidden`.
- Jika **kedua** dimensi diberi nilai, `aspect-ratio` diabaikan karena ukuran sudah ditentukan.
- Pada `<iframe>` video, gunakan `inline-size: 100%; aspect-ratio: 16 / 9; block-size: auto;` untuk menggantikan trik lama `padding-top: 56.25%`.

### Mencegah Pergeseran Tata Letak (CLS) pada Gambar

Atribut `width` dan `height` pada `<img>` kini dipakai peramban untuk menghitung rasio bawaan (`aspect-ratio: auto lebar / tinggi`) sebelum gambar diunduh:

```html
<img src="kelas-css.webp" alt="Tampilan kelas CSS" width="800" height="450">
```

```css
img {
  max-inline-size: 100%;
  block-size: auto;   /* pertahankan rasio dari atribut width/height */
}
```

Dengan pola ini, peramban mencadangkan ruang yang tepat sebelum gambar tiba, sehingga teks di bawahnya tidak melompat (mengurangi *Cumulative Layout Shift*).

## 2. `object-fit`: Cara Isi Gambar Menyesuaikan Kotaknya

`object-fit` mengatur bagaimana konten *replaced element* (seperti `<img>`, `<video>`, dan `<canvas>`) disesuaikan dengan kotaknya. Properti ini **tidak** berlaku untuk `background-image`.

| Nilai | Perilaku |
|---|---|
| `fill` (bawaan) | Gambar direntangkan memenuhi kotak, **rasio asli diabaikan** sehingga bisa gepeng. |
| `contain` | Seluruh gambar tampak utuh dengan rasio asli; sisa ruang dibiarkan kosong (*letterbox*). |
| `cover` | Kotak terisi penuh dengan rasio asli; bagian gambar yang berlebih dipotong. |
| `none` | Gambar tidak diubah ukurannya; dapat terpotong jika lebih besar dari kotak. |
| `scale-down` | Seperti `none` atau `contain`, mana pun yang hasilnya lebih kecil. |

```css
.foto-kartu {
  inline-size: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;        /* kotak penuh tanpa distorsi, tepi gambar dipotong */
}

.logo-mitra {
  inline-size: 8rem;
  aspect-ratio: 2 / 1;
  object-fit: contain;      /* logo tidak boleh terpotong */
}
```

## 3. `object-position`: Menentukan Bagian yang Dipertahankan

Secara bawaan, gambar diposisikan di tengah (`object-position: 50% 50%`). Saat memakai `cover`, bagian yang terpotong adalah tepi di sekeliling titik tengah itu. Jika subjek penting berada di atas (misalnya wajah pada foto potret), geser titik fokusnya:

```css
.foto-wajah {
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center 20%;   /* pertahankan bagian atas gambar, potong lebih banyak dari bawah */
}

.foto-pemandangan {
  object-position: left bottom;  /* pertahankan pojok kiri bawah */
}
```

> **⚠️ Catatan Aksesibilitas dan Konten:** `object-fit: cover` memotong gambar, jadi jangan pakai pada gambar yang seluruh isinya penting, seperti diagram, grafik, tangkapan layar berisi teks, atau logo. Gunakan `contain` untuk gambar semacam itu. Semua gambar bermakna tetap memerlukan atribut `alt`; CSS tidak menggantikannya.

## Kesalahan Umum dan Cara Menghindarinya

1. **Menetapkan `width` dan `height` tetap sekaligus pada gambar tanpa `object-fit`.** Gambar menjadi gepeng karena nilai bawaan `fill`. Tambahkan `object-fit: cover` atau `contain`.
2. **Mengharapkan `aspect-ratio` memotong isi.** Rasio hanya mengatur ukuran kotak; isi yang lebih tinggi membuat kotak membesar kecuali `min-block-size: 0` dan `overflow: hidden` diberikan.
3. **Menggunakan `object-fit` pada `background-image`.** Untuk latar belakang, gunakan `background-size: cover` dan `background-position`.
4. **Memakai `cover` untuk logo atau grafik.** Bagian pentingnya bisa terpotong; pakai `contain`.

## Latihan Praktik: Galeri Kartu Foto yang Konsisten

Buatlah berkas `proporsi-media.html` dan `proporsi.css`:
1. Buat 6 kartu dengan foto yang rasio aslinya berbeda-beda (potret, lanskap, persegi). Beri semua foto `aspect-ratio: 4 / 3` dan `object-fit: cover`.
2. Pada satu foto potret berisi wajah, atur `object-position: center 20%` agar wajah tidak terpotong.
3. Buat bingkai video `<iframe>` yang responsif dengan `aspect-ratio: 16 / 9`.
4. Tambahkan atribut `width` dan `height` pada semua `<img>`, lalu bandingkan skor *layout shift* di tab Performance DevTools sebelum dan sesudahnya.

## Kuis Pemahaman

### Soal 1
Sebuah kotak memiliki `inline-size: 320px; aspect-ratio: 16 / 9;` dan tidak ada tinggi eksplisit. Berapa tingginya?
- A. `180px`
- B. `320px`
- C. `142px`
- D. `569px`

**Jawaban Benar:** A
**Penjelasan:** Tinggi dihitung dari lebar dikalikan `9 / 16`: `320 x 9 / 16 = 180px`.

### Soal 2
Logo mitra harus tampil utuh tanpa terpotong dan tanpa gepeng di dalam kotak berukuran tetap. Nilai `object-fit` yang paling tepat?
- A. `fill`
- B. `cover`
- C. `contain`
- D. `none`

**Jawaban Benar:** C
**Penjelasan:** `contain` menampilkan seluruh gambar dengan rasio aslinya dan menyisakan ruang kosong bila rasionya berbeda. `fill` menggepengkan, `cover` memotong tepi, dan `none` tidak menyesuaikan ukuran sama sekali.

### Soal 3
Sebuah `<img width="800" height="450">` diberi CSS `img { max-inline-size: 100%; block-size: auto; }`. Apa manfaat atribut `width` dan `height` itu?
- A. Gambar selalu ditampilkan tepat `800 x 450` piksel pada semua layar.
- B. Peramban menghitung rasio `16:9` sebelum gambar diunduh dan mencadangkan ruang yang tepat, sehingga konten di bawahnya tidak melompat saat gambar selesai dimuat.
- C. Gambar otomatis dipotong dengan `object-fit: cover`.
- D. Atribut itu hanya dipakai oleh mesin pencari dan tidak memengaruhi tata letak.

**Jawaban Benar:** B
**Penjelasan:** Peramban memakai atribut `width` dan `height` untuk membentuk rasio bawaan (`aspect-ratio: auto 800 / 450`). Dengan `block-size: auto`, tinggi mengikuti rasio itu sehingga ruang sudah tersedia sebelum gambar tiba, dan *layout shift* berkurang.

## Sumber
- [`aspect-ratio` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/aspect-ratio)
- [`object-fit` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-fit)
- [`object-position` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-position)
- [Optimize Cumulative Layout Shift — web.dev](https://web.dev/articles/optimize-cls)
