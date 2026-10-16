# Membandingkan Metodologi Arsitektur CSS: BEM, ITCSS, CUBE CSS, dan Kelas Utilitas

- **Tingkat:** Lanjut
- **Ringkasan:** Menganalisis kelebihan dan kekurangan berbagai pendekatan pengorganisasian CSS skala tim, serta bagaimana memadukan struktur semantik CUBE CSS dengan lapisan `@layer` modern.

## Mengapa Perlu Metodologi?

CSS bersifat global dan kaskade: aturan di satu tempat dapat memengaruhi tempat lain. Pada proyek kecil itu tidak terasa; pada proyek besar dengan banyak penulis, tanpa kesepakatan Anda akan menemui nama kelas yang berbenturan, selektor yang saling menimpa, dan ketakutan menghapus kode lama (lihat Pelajaran 12). **Metodologi** adalah kesepakatan tim tentang **bagaimana menamai, mengelompokkan, dan mengurutkan** CSS. Tidak ada satu pun yang "paling benar"; masing-masing memecahkan masalah yang berbeda. Pelajaran ini membandingkan empat pendekatan dan menunjukkan cara memadukannya dengan fitur CSS modern, terutama `@layer`.

## 1. BEM: Penamaan yang Menjaga Spesifisitas Rendah

**BEM** (*Block, Element, Modifier*) adalah konvensi **penamaan kelas**: `blok__elemen--modifier`.

```css
.kartu { }                  /* Block: komponen mandiri */
.kartu__judul { }           /* Element: bagian dari block */
.kartu--unggulan { }        /* Modifier: variasi block */
.kartu__judul--besar { }    /* Modifier pada element */
```

- **Kekuatan:** hubungan komponen terlihat dari namanya; spesifisitas tetap datar `(0, 1, 0)`; tidak butuh alat tambahan.
- **Kelemahan:** nama kelas panjang; tidak mengatur **urutan** atau **tata letak makro**; tidak mencegah gaya global bocor.
- **Cocok untuk:** tim yang menulis CSS biasa, tanpa framework komponen, dan butuh konvensi sederhana.

Dokumentasi resmi: BEM (bem.info) menjelaskan konvensi penamaannya.

## 2. ITCSS: Mengatur Urutan dari Umum ke Spesifik

**ITCSS** (*Inverted Triangle CSS*) adalah cara **mengurutkan** stylesheet dari yang paling umum dan jangkauan luas hingga yang paling spesifik dan jangkauan sempit. Lapisannya, dari atas ke bawah:

1. **Settings**: variabel dan token.
2. **Tools**: fungsi dan *mixin* (pada preprocessor).
3. **Generic**: reset, `box-sizing`.
4. **Elements**: gaya elemen HTML polos (`h1`, `a`).
5. **Objects**: pola tata letak tanpa tampilan (mis. wadah, tumpukan).
6. **Components**: komponen UI spesifik (kartu, tombol).
7. **Utilities (Trumps)**: kelas satu fungsi yang sengaja memiliki prioritas tertinggi.

Semakin ke bawah, **spesifisitas dan prioritas naik**, sedangkan jumlah elemen yang terkena **turun**. Dengan **`@layer`**, urutan ini dapat dipaksakan oleh peramban tanpa bergantung pada urutan berkas:

```css
@layer settings, generic, elements, objects, components, utilities;
```

- **Kekuatan:** mengurangi perang spesifisitas; memberi struktur berkas yang jelas; kompatibel dengan BEM.
- **Kelemahan:** butuh disiplin menempatkan kode; terasa berat untuk proyek kecil.
- **Cocok untuk:** basis kode besar yang berumur panjang.

## 3. CUBE CSS: Bekerja Bersama Kaskade

**CUBE CSS** (*Composition, Utility, Block, Exception*) memandang kaskade sebagai kawan, bukan musuh:

- **Composition**: tata letak makro yang dapat dipakai ulang (tumpukan, deretan, sidebar) yang mengatur *jarak dan arah*, bukan tampilan.
- **Utility**: kelas satu fungsi, sering dihasilkan dari token desain (warna, spasi).
- **Block**: komponen konkret yang memakai komposisi dan utilitas.
- **Exception**: variasi keadaan yang ditandai dengan **atribut data** (`[data-state="aktif"]`) alih-alih kelas modifier.

```css
@layer reset, tokens, compositions, utilities, blocks, exceptions;

@layer compositions {
  .tumpukan > * + * { margin-block-start: var(--jarak, 1rem); }
}

@layer utilities {
  .teks-tengah { text-align: center; }
}

@layer blocks {
  .kartu {
    padding: var(--spasi-lg, 1.5rem);
    border: 1px solid var(--garis, #e2e8f0);
    border-radius: 0.75rem;
  }
}

@layer exceptions {
  .kartu[data-variant="unggulan"] {
    border-color: var(--aksen, #2563eb);
  }
}
```

```html
<article class="kartu tumpukan" data-variant="unggulan">
  <h3>Arsitektur CSS</h3>
  <p class="teks-tengah">Memadukan komposisi, utilitas, dan blok.</p>
</article>
```

- **Kekuatan:** sedikit CSS kustom karena banyak hal ditangani kaskade, token, dan komposisi; mendorong HTML yang semantik; mudah dipadukan dengan `@layer`.
- **Kelemahan:** metodologi relatif baru dan kurang baku; butuh pemahaman kaskade yang baik.
- **Cocok untuk:** tim yang menyukai CSS modern dan sistem desain berbasis token.

## 4. Kelas Utilitas (*Utility-First*)

Pendekatan **utilitas** menyusun tampilan langsung di HTML dengan kelas kecil bersatu fungsi (`p-4`, `text-center`, `flex`). Pustaka seperti Tailwind CSS mempopulerkannya.

```html
<article class="p-6 border rounded-xl text-center">...</article>
```

- **Kekuatan:** tidak perlu menamai kelas; tampilan konsisten dengan skala desain; kode CSS yang dikirim biasanya kecil karena hanya kelas terpakai yang dibuat (dengan alat bantu *build*).
- **Kelemahan:** HTML menjadi panjang; membutuhkan alat atau pustaka; pemisahan struktur dan tampilan melemah; komponen perlu diabstraksi (templat atau komponen) agar tidak diulang.
- **Cocok untuk:** tim dengan framework komponen (React, Vue, templat server) dan alat *build* yang sudah ada.

## 5. Perbandingan Ringkas

| Aspek | BEM | ITCSS | CUBE CSS | Utilitas |
|---|---|---|---|---|
| Fokus | Penamaan | Urutan/lapisan | Filosofi + struktur | Kelas atomik di HTML |
| Menangani spesifisitas | Ya (datar) | Ya (berlapis) | Ya (lapisan + kaskade) | Ya (datar) |
| Butuh alat tambahan | Tidak | Tidak | Tidak | Biasanya ya |
| Kurva belajar | Rendah | Sedang | Sedang | Rendah-sedang |
| Dapat digabung dengan lainnya | Ya | Ya | Ya | Ya |

## 6. Memadukan dengan `@layer`

Metodologi di atas **tidak saling meniadakan**. Praktik yang umum: pakai **ITCSS/CUBE** sebagai kerangka urutan, **BEM** untuk menamai komponen, dan **utilitas** sebagai lapisan teratas. `@layer` membuat urutan ini tegas:

```css
@layer reset, tokens, elements, compositions, components, utilities;
```

Lapisan `utilities` yang paling akhir akan menang atas komponen tanpa `!important` (Pelajaran 02 dan 22).

> **💡 Memilih:** Mulailah dari kebutuhan. Proyek kecil sering cukup dengan BEM atau lapisan sederhana. Sistem desain besar diuntungkan oleh lapisan (ITCSS/CUBE) dan token. Pilih satu konvensi, dokumentasikan, dan tegakkan lewat tinjauan kode dan linter; konsistensi lebih penting daripada metodologi mana yang dipilih.

## Kesalahan Umum dan Cara Menghindarinya

1. **Mencampur banyak konvensi tanpa aturan.** Tentukan peran masing-masing (mis. BEM untuk komponen, utilitas untuk penyesuaian kecil).
2. **Menyalin metodologi mentah-mentah tanpa menyesuaikan konteks tim.**
3. **Menaruh gaya dalam urutan yang salah.** Lapisan atau urutan berkas harus mengikuti umum ke spesifik.
4. **Memakai utilitas untuk semuanya tanpa abstraksi komponen.** HTML menjadi berulang dan sulit dirawat.
5. **Mengira metodologi menjamin aksesibilitas.** Struktur CSS tidak menggantikan HTML semantik, kontras, dan fokus yang baik.

## Latihan Praktik: Menyusun Ulang Satu Komponen

Buatlah berkas `metodologi.html` dan `metodologi.css`:
1. Ambil satu kartu yang gayanya acak, lalu beri nama ulang dengan BEM (`.kartu`, `.kartu__judul`, `.kartu--unggulan`).
2. Susun CSS-nya dalam `@layer settings, elements, components, utilities` (urutan ITCSS).
3. Buat versi CUBE: satu komposisi `.tumpukan`, satu blok `.kartu`, satu utilitas `.teks-tengah`, dan satu eksepsi `[data-variant="unggulan"]`.
4. Tulis satu paragraf pendek yang membandingkan ketiga hasil dari sisi keterbacaan HTML, jumlah CSS, dan kemudahan perawatan.

## Kuis Pemahaman

### Soal 1
Apa yang menjadi inti dari ITCSS?
- A. Konvensi penamaan `blok__elemen--modifier`.
- B. Menulis semua gaya di dalam atribut `style`.
- C. Mengurutkan CSS dari yang paling umum dan berjangkauan luas ke yang paling spesifik dan berjangkauan sempit, sehingga spesifisitas meningkat secara terkendali.
- D. Menggunakan satu kelas utilitas untuk setiap properti.

**Jawaban Benar:** C
**Penjelasan:** ITCSS menyusun lapisan dari Settings hingga Utilities. Semakin ke bawah, spesifisitas naik dan jangkauan menyempit. Opsi A adalah BEM dan opsi D adalah pendekatan utilitas.

### Soal 2
Dalam CUBE CSS, apa fungsi bagian *Exception*?
- A. Menyembunyikan elemen dari pembaca layar.
- B. Menangani variasi keadaan atau pengecualian suatu blok, biasanya ditandai dengan atribut data seperti `[data-state="aktif"]`.
- C. Menghapus semua komposisi.
- D. Menggantikan `@layer`.

**Jawaban Benar:** B
**Penjelasan:** *Exception* adalah penyimpangan dari gaya dasar blok, misalnya keadaan atau variasi, dan biasanya ditulis dengan selektor atribut data sehingga tidak menambah kelas modifier.

### Soal 3
Mengapa `@layer` membantu memadukan beberapa metodologi?
- A. Karena `@layer` mengganti semua kelas dengan atribut.
- B. Karena `@layer` hanya bekerja bersama BEM.
- C. Karena `@layer` mengompresi berkas CSS.
- D. Karena urutan lapisan menentukan prioritas sebelum spesifisitas, sehingga urutan umum-ke-spesifik (reset, token, komponen, utilitas) dapat ditegakkan peramban tanpa bergantung pada urutan berkas atau `!important`.

**Jawaban Benar:** D
**Penjelasan:** Dalam algoritma Cascade, lapisan dinilai sebelum spesifisitas. Dengan mendeklarasikan urutan lapisan, struktur ala ITCSS atau CUBE menjadi tegas dan lapisan utilitas dapat selalu mengalahkan komponen.

## Sumber
- [BEM naming convention — bem.info](https://bem.info/en/methodology/naming-convention/)
- [ITCSS — itcss.io](https://itcss.io/)
- [CUBE CSS — cube.fyi](https://cube.fyi/)
- [`@layer` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer)
- [Organizing your CSS — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Organizing)
