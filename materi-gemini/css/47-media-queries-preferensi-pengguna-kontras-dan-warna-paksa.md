# Media Queries Aksesibilitas: `prefers-contrast`, `forced-colors`, `prefers-reduced-transparency`, dan `inverted-colors`

- **Tingkat:** Lanjut
- **Ringkasan:** Memastikan antarmuka tetap terbaca tajam bagi pengguna mode Kontras Tinggi Windows (*Windows High Contrast Mode*) melalui `@media (forced-colors: active)`, kata kunci warna sistem `CanvasText`, dan `@media (prefers-contrast: more)`.

## Mengapa Preferensi Pengguna Perlu Dihormati?

Tidak semua orang melihat halaman Anda dengan cara yang sama. Pengguna dengan penglihatan rendah mungkin mengaktifkan **kontras tinggi** di sistem operasi; pengguna yang peka cahaya menyalakan mode gelap atau mengurangi transparansi; sebagian lagi memakai **tema kontras Windows** yang menimpa seluruh warna halaman. Sistem operasi meneruskan preferensi ini ke peramban, dan CSS menyediakan *media feature* untuk menangkapnya. Mereka melengkapi `prefers-color-scheme` dan `prefers-reduced-motion` yang sudah Anda kenal.

| Media feature | Status dukungan |
|---|---|
| `prefers-contrast` | **Baseline Widely Available** (sejak Mei 2022) |
| `forced-colors` | **Baseline Widely Available** (sejak September 2022) |
| `prefers-reduced-transparency` | Terbatas: Chrome 118+; Firefox di balik bendera; Safari belum |
| `inverted-colors` | Terbatas: hanya Safari |

Untuk fitur dengan dukungan terbatas, perlakukan sebagai **peningkatan progresif**: tampilan dasar Anda harus sudah baik tanpa mereka.

## 1. `prefers-contrast`: Meminta Kontras Lebih (atau Kurang)

Nilai: `more` (kontras lebih tinggi), `less` (lebih rendah), `custom` (pengguna memilih palet sendiri), dan `no-preference`. Teknik yang efektif adalah menyimpan warna dalam variabel CSS lalu menggantinya:

```css
:root {
  --warna-teks: oklch(35% 0.02 250);
  --warna-batas: oklch(88% 0.01 250);
  --lebar-batas: 1px;
}

@media (prefers-contrast: more) {
  :root {
    --warna-teks: oklch(15% 0.02 250);   /* teks lebih gelap */
    --warna-batas: oklch(40% 0.02 250);  /* batas lebih tegas */
    --lebar-batas: 2px;
  }

  .kartu {
    box-shadow: none;                    /* hilangkan efek halus yang mengaburkan tepi */
  }
}

.kartu {
  color: var(--warna-teks);
  border: var(--lebar-batas) solid var(--warna-batas);
}
```

Prinsipnya: naikkan kontras teks, tegaskan batas komponen, dan kurangi gradien atau transparansi yang membuat tepi sulit dikenali.

## 2. `forced-colors: active`: Mode Warna Paksa

Pada **mode warna paksa** (misalnya tema kontras Windows), peramban **menimpa warna** dengan palet sistem yang ditentukan pengguna. Perilaku utamanya (CSS Color Adjustment):
- Properti warna seperti `color`, `background-color`, `border-color`, dan `outline-color` dipaksa ke warna sistem.
- `box-shadow` dan `text-shadow` dihitung menjadi `none`.
- `background-image` menjadi `none` kecuali nilainya mengandung `url()`.
- Kata kunci warna sistem seperti `CanvasText` (teks), `Canvas` (latar), `LinkText`, `ButtonText`, `ButtonFace`, `Field`, `FieldText`, `Highlight`, `HighlightText`, dan `GrayText` dapat dipakai agar elemen kustom ikut serasi.

```css
@media (forced-colors: active) {
  /* Kartu kehilangan bayangan: batas transparan menjadi terlihat dalam warna sistem */
  .kartu {
    border: 1px solid CanvasText;
  }

  /* Tombol kustom */
  .tombol-ikon {
    border: 1px solid ButtonText;
    background-color: ButtonFace;
    color: ButtonText;
  }
  .tombol-ikon:hover {
    border-color: Highlight;
  }

  /* Ikon SVG mengikuti warna teks */
  .ikon {
    fill: currentColor;
  }

  /* Saklar kustom: status terpilih harus tetap dapat dibedakan tanpa warna latar */
  .saklar[aria-checked="true"] {
    background-color: Highlight;
    border-color: HighlightText;
  }
}
```

Beberapa praktik penting:
- **Beri border pada komponen yang batasnya hanya berupa bayangan atau latar** (tulis `border: 1px solid transparent`; pada mode paksa borders transparan dipaksa menjadi warna sistem sehingga komponen tetap terlihat).
- Indikator fokus memakai `outline` (misalnya `outline: 2px solid transparent` sebagai cadangan) dan bukan `box-shadow`, karena bayangan dihapus (lihat Pelajaran 38).
- Jangan bergantung pada **gambar latar gradien** atau **teks transparan** (`background-clip: text`) untuk informasi; sediakan cadangan dengan `CanvasText`.
- Properti **`forced-color-adjust: none`** memungkinkan sebuah elemen menolak penimpaan, tetapi gunakan **hemat** (mis. untuk contoh warna pada pemilih warna). Properti ini juga belum didukung Safari.

## 3. `prefers-reduced-transparency`

Sebagian pengguna meminta **transparansi dikurangi** karena efek kaca buram (*frosted glass*) dan latar semi-transparan menurunkan keterbacaan. Gunakan latar solid untuk mereka:

```css
.header-kaca {
  background-color: oklch(100% 0 0 / 0.7);
  backdrop-filter: blur(12px);
}

@media (prefers-reduced-transparency: reduce) {
  .header-kaca {
    background-color: oklch(100% 0 0);   /* solid */
    backdrop-filter: none;
  }
}
```

Dukungannya terbatas (Chrome 118+), jadi pastikan tampilan dasar sudah memiliki kontras teks yang baik walau media feature ini tidak berlaku.

## 4. `inverted-colors`

`@media (inverted-colors: inverted)` cocok bila pengguna mengaktifkan inversi warna (di Safari lewat *Smart Invert*). Sistem membalik warna seluruh halaman termasuk gambar; agar foto tidak tampak negatif, balik lagi gambarnya:

```css
@media (inverted-colors: inverted) {
  img, video {
    filter: invert(1);
  }
}
```

Fitur ini hanya relevan di Safari; peramban lain mengabaikannya.

## 5. Menguji

- Chrome/Edge DevTools: tab **Rendering** memiliki emulasi untuk `prefers-contrast`, `forced-colors`, `prefers-reduced-transparency`, `prefers-color-scheme`, dan `prefers-reduced-motion`.
- Windows: aktifkan **Contrast themes** (Pengaturan > Aksesibilitas > Contrast themes) dan periksa halaman Anda.
- Pastikan setiap komponen interaktif tetap dapat dikenali, dibedakan statusnya, dan fokusnya terlihat tanpa mengandalkan warna merek.

## Kesalahan Umum dan Cara Menghindarinya

1. **Mengandalkan `box-shadow` sebagai batas atau indikator fokus.** Hilang pada mode warna paksa; tambahkan `border` atau `outline`.
2. **Memakai `forced-color-adjust: none` secara luas.** Merusak tema kontras pilihan pengguna.
3. **Warna latar sebagai satu-satunya penanda status** (mis. saklar "aktif"). Tambahkan bentuk atau teks.
4. **Ikon SVG dengan `fill` tetap.** Gunakan `currentColor`.
5. **Menganggap media feature terbatas pasti didukung.** Pastikan desain dasar sudah aksesibel.

## Latihan Praktik: Komponen yang Tahan Kontras Tinggi

Buatlah berkas `preferensi-pengguna.html` dan `preferensi.css`:
1. Buat kartu dengan bayangan, tombol ikon SVG, dan saklar kustom. Tambahkan `@media (prefers-contrast: more)` yang menegaskan batas dan menggelapkan teks.
2. Tambahkan `@media (forced-colors: active)` dengan `CanvasText`, `ButtonText`, `Highlight`, dan `currentColor` agar semua komponen tetap terlihat.
3. Aktifkan emulasi `forced-colors: active` dan `prefers-contrast: more` di tab Rendering DevTools dan bandingkan hasilnya.
4. Ganti header kaca dengan versi solid memakai `prefers-reduced-transparency: reduce`.

## Kuis Pemahaman

### Soal 1
Sebuah kartu hanya dibatasi oleh `box-shadow` (tanpa border). Apa yang terjadi pada pengguna dengan `forced-colors: active`?
- A. Bayangan tampil lebih tebal.
- B. Bayangan dihitung menjadi `none`, sehingga kartu kehilangan batasnya kecuali diberi `border`.
- C. Bayangan berubah menjadi warna `Highlight`.
- D. Kartu disembunyikan.

**Jawaban Benar:** B
**Penjelasan:** Pada mode warna paksa, `box-shadow` dan `text-shadow` dihitung menjadi `none`. Karena itu batas komponen sebaiknya memakai `border` (bisa transparan, yang akan dipaksa menjadi warna sistem).

### Soal 2
Kata kunci warna sistem manakah yang tepat untuk teks dan latar halaman pada mode warna paksa?
- A. `Highlight` untuk teks, `GrayText` untuk latar.
- B. `ButtonText` untuk teks, `Highlight` untuk latar.
- C. `CanvasText` untuk teks dan `Canvas` untuk latar.
- D. `LinkText` untuk teks dan `FieldText` untuk latar.

**Jawaban Benar:** C
**Penjelasan:** `CanvasText` adalah warna teks standar pada area halaman dan `Canvas` adalah warna latar halaman. `ButtonText`, `LinkText`, dan lainnya ditujukan untuk jenis elemen tertentu.

### Soal 3
Bagaimana sebaiknya `@media (prefers-reduced-transparency: reduce)` dipakai mengingat dukungannya terbatas?
- A. Sebagai satu-satunya cara memastikan kontras teks.
- B. Hanya setelah semua peramban mendukungnya.
- C. Sebagai peningkatan progresif: desain dasar sudah terbaca baik, lalu preferensi ini menggantikan latar semi-transparan dan `backdrop-filter` dengan latar solid.
- D. Untuk mengganti `prefers-contrast`.

**Jawaban Benar:** C
**Penjelasan:** Fitur ini baru didukung Chrome 118+, jadi pengguna lain tidak akan terpengaruh. Tampilan dasar tetap harus memiliki kontras yang baik; media feature hanya menambah kenyamanan bagi yang memintanya.

## Sumber
- [`prefers-contrast` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-contrast)
- [`forced-colors` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors)
- [`prefers-reduced-transparency` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency)
- [`forced-color-adjust` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/forced-color-adjust)
- [CSS Color Adjustment Module Level 1 — W3C](https://www.w3.org/TR/css-color-adjust-1/)
