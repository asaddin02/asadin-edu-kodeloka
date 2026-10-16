# Properti Logis Lengkap (`inset-inline`, `margin-block`, `border-start-start-radius`) dan `writing-mode`

- **Tingkat:** Menengah
- **Ringkasan:** Mengonversi seluruh properti fisik (`top/right/bottom/left`, `width/height`) ke properti aliran logis serta merancang teks vertikal atau multibahasa dengan `writing-mode: vertical-rl`.

## Mengapa Berpikir "Logis" daripada "Fisik"?

Properti fisik seperti `margin-left` dan `width` mengasumsikan teks mengalir mendatar dari kiri ke kanan. Asumsi itu patah ketika halaman Anda dibaca dalam bahasa Arab atau Ibrani (kanan ke kiri) atau ditata vertikal seperti pada banyak teks Jepang dan Tiongkok. **Properti logis** menggantikan arah layar (kiri, kanan, atas, bawah) dengan arah **aliran teks**: awal dan akhir pada sumbu *inline* dan sumbu *block*. Dengan begitu, satu stylesheet dapat melayani berbagai bahasa tanpa menulis ulang. Properti logis berstatus **Baseline Widely Available** (lintas peramban sejak 2021).

## 1. Dua Sumbu: *Inline* dan *Block*

- Sumbu **inline** adalah arah teks mengalir dalam satu baris. Pada Bahasa Indonesia (`horizontal-tb`, `ltr`) ia berjalan kiri ke kanan.
- Sumbu **block** adalah arah baris-baris ditumpuk. Pada `horizontal-tb` ia berjalan atas ke bawah.
- Setiap sumbu memiliki **start** (awal) dan **end** (akhir).

Pemetaan pada beberapa kondisi:

| Kondisi | `inline-start` | `inline-end` | `block-start` | `block-end` |
|---|---|---|---|---|
| `horizontal-tb`, `ltr` (Indonesia, Inggris) | kiri | kanan | atas | bawah |
| `horizontal-tb`, `rtl` (Arab, Ibrani) | kanan | kiri | atas | bawah |
| `vertical-rl`, `ltr` (teks vertikal Jepang/Tiongkok, kolom bergerak ke kiri) | atas | bawah | kanan | kiri |

Karena itu, `inline-size` berarti lebar pada mode horizontal, tetapi **tinggi** pada mode vertikal; `block-size` kebalikannya.

## 2. Daftar Konversi Fisik ke Logis

| Fisik | Logis |
|---|---|
| `width`, `min-width`, `max-width` | `inline-size`, `min-inline-size`, `max-inline-size` |
| `height`, `min-height`, `max-height` | `block-size`, `min-block-size`, `max-block-size` |
| `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` |
| `margin-top` / `margin-bottom` | `margin-block-start` / `margin-block-end` |
| `padding-left` + `padding-right` | `padding-inline` (satu atau dua nilai: awal akhir) |
| `padding-top` + `padding-bottom` | `padding-block` |
| `border-left` | `border-inline-start` |
| `top` / `bottom` | `inset-block-start` / `inset-block-end` |
| `left` / `right` | `inset-inline-start` / `inset-inline-end` |
| `top: 0; right: 0; bottom: 0; left: 0` | `inset: 0` |
| `border-top-left-radius` | `border-start-start-radius` |
| `border-top-right-radius` | `border-start-end-radius` |
| `border-bottom-left-radius` | `border-end-start-radius` |
| `border-bottom-right-radius` | `border-end-end-radius` |
| `text-align: left` / `right` | `text-align: start` / `end` |
| `float: left` / `right` | `float: inline-start` / `inline-end` |

Beberapa catatan:
- Pada properti sudut seperti `border-start-start-radius`, kata pertama adalah sisi **block** dan kata kedua adalah sisi **inline**. Pada `horizontal-tb` + `ltr`, `start-start` adalah sudut kiri atas; pada `rtl`, ia berpindah menjadi sudut kanan atas.
- Shorthand dua nilai mengikuti urutan *awal, akhir*: `margin-block: 1rem 3rem` berarti `margin-block-start: 1rem` dan `margin-block-end: 3rem`.
- Untuk menengahkan kotak: `margin-inline: auto`.

```css
.kartu {
  inline-size: min(100%, 36rem);
  margin-inline: auto;
  padding-block: 1.5rem;
  padding-inline: 1.25rem;
  border-inline-start: 4px solid oklch(55% 0.2 255);
  border-start-start-radius: 1rem;
  border-end-start-radius: 1rem;
  text-align: start;
}

.lencana {
  position: absolute;
  inset-block-start: 0.75rem;
  inset-inline-end: 0.75rem;   /* otomatis pindah ke kiri pada halaman RTL */
}
```

## 3. `writing-mode` dan Teks Vertikal

Properti `writing-mode` menentukan arah aliran baris:
- `horizontal-tb` (bawaan): baris mendatar, ditumpuk dari atas ke bawah.
- `vertical-rl`: baris tegak, ditumpuk dari **kanan ke kiri** (gaya bahasa Jepang/Tiongkok tradisional).
- `vertical-lr`: baris tegak, ditumpuk dari **kiri ke kanan** (misalnya aksara Mongolia).

`text-orientation` mengatur arah huruf pada mode vertikal: `mixed` (bawaan; aksara Latin diputar menyamping, aksara Asia Timur tetap tegak), `upright` (semua huruf ditegakkan), dan `sideways`.

```css
/* Label vertikal pada sisi tab */
.tab-samping {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding-inline: 0.5rem;     /* pada mode vertikal, padding-inline berarti atas-bawah fisik */
  padding-block: 1rem;        /* dan padding-block berarti kanan-kiri fisik */
}

/* Judul vertikal bergaya Jepang di samping artikel */
.judul-vertikal {
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 0.1em;
}
```

> **💡 Arah Dokumen RTL:** Atur arah bahasa lewat HTML (`<html lang="ar" dir="rtl">`), bukan dengan CSS `direction`, karena `dir` memiliki makna semantik yang dipahami peramban dan teknologi bantu. Dengan properti logis, tata letak Anda otomatis berbalik tanpa aturan tambahan.

## Kesalahan Umum dan Cara Menghindarinya

1. **Mencampur properti fisik dan logis pada elemen yang sama.** Misalnya `margin-left: 1rem` bersama `margin-inline-start: 2rem`; keduanya memetakan ke properti yang sama pada `ltr` dan hasil akhirnya ditentukan urutan penulisan. Pilih satu gaya penulisan.
2. **Menganggap `inline-size` selalu berarti lebar.** Pada `writing-mode: vertical-rl`, `inline-size` adalah tinggi.
3. **Salah membaca urutan kata pada `border-start-end-radius`.** Kata pertama adalah sisi *block*, kata kedua sisi *inline*: `start-end` adalah sudut di awal block dan akhir inline (kanan atas pada `ltr` mendatar).
4. **Memakai `text-align: left` untuk teks isi.** Pada halaman RTL, teks akan terlihat rata di sisi yang salah. Gunakan `text-align: start`.

## Latihan Praktik: Komponen Dua Arah

Buatlah berkas `logis.html` dan `logis.css`:
1. Ubah komponen kartu yang memakai `margin-left`, `padding-right`, `border-left`, dan `width` menjadi versi logis seluruhnya.
2. Tambahkan atribut `dir="rtl"` pada `<html>` dan amati bahwa garis aksen serta lencana otomatis pindah sisi.
3. Buat label tab vertikal dengan `writing-mode: vertical-rl` dan bandingkan `text-orientation: mixed` dengan `upright`.

## Kuis Pemahaman

### Soal 1
Sebuah elemen memakai `writing-mode: vertical-rl`. Dimensi fisik manakah yang dikendalikan oleh `inline-size`?
- A. Lebar.
- B. Padding horizontal.
- C. Tinggi.
- D. Ketebalan border.

**Jawaban Benar:** C
**Penjelasan:** Pada mode vertikal, sumbu inline berjalan tegak (atas ke bawah), sehingga `inline-size` mengatur tinggi fisik elemen, sedangkan `block-size` mengatur lebarnya.

### Soal 2
Pada halaman `dir="ltr"` mendatar, `border-start-start-radius: 1rem` membulatkan sudut mana? Dan pada `dir="rtl"`?
- A. Kiri atas pada `ltr`; kanan atas pada `rtl`.
- B. Kiri bawah pada `ltr`; kanan bawah pada `rtl`.
- C. Kanan atas pada `ltr`; kiri atas pada `rtl`.
- D. Kiri atas pada keduanya, karena properti logis tidak memedulikan arah.

**Jawaban Benar:** A
**Penjelasan:** `start-start` berarti awal sumbu block (atas pada mode mendatar) dan awal sumbu inline (kiri pada `ltr`, kanan pada `rtl`). Karena itu sudutnya berpindah mengikuti arah penulisan.

### Soal 3
Apa arti `margin-block: 1rem 3rem;`?
- A. Margin kiri `1rem` dan margin kanan `3rem`.
- B. Margin atas dan bawah sama-sama `1rem`, sedangkan `3rem` diabaikan.
- C. Margin atas `3rem` dan margin bawah `1rem`.
- D. `margin-block-start: 1rem` dan `margin-block-end: 3rem`.

**Jawaban Benar:** D
**Penjelasan:** Shorthand dua nilai pada properti logis mengikuti urutan awal lalu akhir sumbu tersebut. Pada mode mendatar, sumbu block adalah vertikal, jadi awal adalah atas dan akhir adalah bawah.

## Sumber
- [CSS logical properties and values — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values)
- [`writing-mode` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/writing-mode)
- [`border-start-start-radius` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border-start-start-radius)
- [CSS Logical Properties and Values Level 1 — W3C](https://www.w3.org/TR/css-logical-1/)
