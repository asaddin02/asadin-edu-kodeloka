# Kontrol `@keyframes` Lanjutan: `animation-fill-mode`, `steps()`, `animation-play-state`, dan `animation-composition`

- **Tingkat:** Menengah
- **Ringkasan:** Mengendalikan kondisi akhir animasi dengan `animation-fill-mode: both`, membuat animasi bingkai-demi-bingkai dengan `steps()`, menjeda animasi saat `:hover`, serta menggabungkan transformasi dengan `animation-composition`.

## Mengapa Perlu Kontrol Lanjutan?

Pelajaran 10 memperkenalkan `@keyframes` dan `animation` dasar. Animasi sungguhan hampir selalu memerlukan hal-hal tambahan: elemen harus **tetap di posisi akhir** setelah animasi selesai (bukan melompat kembali), animasi **bergerak patah-patah per bingkai** (seperti sprite atau mesin ketik), animasi perlu **dijeda**, dan animasi harus **digabung dengan gaya yang sudah ada** tanpa menimpanya. Keempat kebutuhan itu dijawab oleh properti di pelajaran ini.

## 1. `animation-fill-mode`: Apa yang Terjadi di Luar Waktu Animasi?

Secara bawaan, di luar rentang waktu animasi (sebelum mulai dan setelah selesai), elemen kembali ke gaya aslinya. `animation-fill-mode` mengubah itu:

| Nilai | Efek |
|---|---|
| `none` (bawaan) | Tidak ada gaya animasi di luar waktu animasi. |
| `forwards` | Setelah selesai, elemen **mempertahankan keyframe terakhir**. |
| `backwards` | Selama `animation-delay`, elemen **langsung memakai keyframe pertama**. |
| `both` | Gabungan `forwards` dan `backwards`. |

```css
@keyframes muncul {
  from { opacity: 0; translate: 0 1rem; }
  to   { opacity: 1; translate: 0 0; }
}

.kartu {
  animation: muncul 500ms ease-out 200ms both;   /* durasi, easing, jeda, fill-mode */
}
```

Tanpa `backwards`, kartu terlihat penuh selama jeda 200ms lalu tiba-tiba menghilang dan memudar masuk. Tanpa `forwards`, setelah animasi selesai kartu bisa kembali ke gaya aslinya. Memakai `both` mencegah keduanya. Dalam praktik, jika keyframe akhir sama dengan gaya asli elemen, `forwards` tidak diperlukan; `backwards` tetap penting bila ada jeda.

## 2. `steps()`: Animasi Bingkai demi Bingkai

Fungsi `steps(n, arah)` memotong interval menjadi `n` langkah **tanpa interpolasi mulus**. Nilai berpindah secara tiba-tiba dari satu langkah ke langkah berikutnya, cocok untuk animasi **sprite** dan efek mesin ketik.

Opsi arah (`jump-*`): `jump-end` (bawaan, sama dengan `end`), `jump-start` (sama dengan `start`), `jump-none`, dan `jump-both`. Pada `jump-end`, perubahan nilai terjadi di akhir tiap langkah sehingga bingkai pertama menampilkan nilai awal.

```css
/* Sprite: 8 bingkai dalam satu gambar selebar 8 x 64px */
.pelari {
  inline-size: 64px;
  block-size: 64px;
  background: url("pelari-sprite.png") 0 0 / 512px 64px no-repeat;
  animation: lari 800ms steps(8) infinite;
}
@keyframes lari {
  to { background-position: -512px 0; }       /* geser selebar seluruh sprite */
}

/* Mesin ketik: teks monospace muncul huruf demi huruf */
.ketik {
  inline-size: 0;
  overflow: hidden;
  white-space: nowrap;
  font-family: ui-monospace, monospace;
  border-inline-end: 2px solid currentColor;
  animation: mengetik 2s steps(24) forwards;
}
@keyframes mengetik {
  to { inline-size: 24ch; }                   /* 24 karakter */
}
```

Catatan: pada efek mesin ketik, lebar harus sesuai jumlah karakter dan fon harus monospace agar tiap langkah sama dengan satu huruf. Teks tetap berada di DOM sehingga pembaca layar membacanya utuh.

## 3. `animation-play-state`: Menjeda dan Melanjutkan

`animation-play-state` bernilai `running` (bawaan) atau `paused`. Posisi animasi dipertahankan saat dijeda:

```css
.marquee-isi {
  animation: geser 20s linear infinite;
}
.marquee:hover .marquee-isi,
.marquee:focus-within .marquee-isi {
  animation-play-state: paused;
}
```

> **⚠️ Aksesibilitas (WCAG 2.2.2 *Pause, Stop, Hide*):** Konten yang bergerak otomatis lebih dari 5 detik dan tampil berdampingan dengan konten lain harus dapat dijeda, dihentikan, atau disembunyikan oleh pengguna. Menjeda saat `:hover` saja **tidak cukup**, karena pengguna papan ketik dan layar sentuh tidak bisa menghover. Tambahkan `:focus-within` dan, lebih baik lagi, tombol "Jeda animasi" yang mengatur `animation-play-state`. Matikan animasi sepenuhnya di bawah `prefers-reduced-motion: reduce`.

## 4. `animation-composition`: Menggabungkan Animasi dengan Gaya yang Ada

Secara bawaan, nilai dalam keyframe **menggantikan** (`replace`) nilai properti pada elemen. Jika elemen sudah memiliki `transform: translateX(100px)` dan animasi memutar dengan `transform: rotate(...)`, translasinya **hilang** selama animasi. `animation-composition` mengubah cara penggabungan:

- `replace` (bawaan): nilai keyframe menimpa nilai dasar.
- `add`: nilai keyframe **ditambahkan** setelah nilai dasar (untuk daftar `transform`, hasilnya `translateX(100px) rotate(...)`).
- `accumulate`: nilai digabung dengan menjumlahkan komponen sejenis (misalnya `blur(2px)` + `blur(3px)` menjadi `blur(5px)`, sedangkan `add` menghasilkan dua filter berantai).

```css
.ikon {
  transform: translateX(100px);          /* posisi dasar */
  animation: putar 2s linear infinite;
  animation-composition: add;            /* putaran ditambahkan di atas translasi */
}
@keyframes putar {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
```

Dengan `add`, ikon tetap berada `100px` ke kanan sambil berputar. Dengan `replace`, translasinya hilang selama animasi. `animation-composition` berstatus **Baseline Widely Available** (sejak Juli 2023).

> **💡 Alternatif:** Properti individual (`translate`, `rotate`, `scale`) juga menghindari masalah menimpa: animasikan `rotate` sambil `translate` tetap berlaku, karena keduanya properti terpisah.

## Studi Kasus Produksi: Skeleton Loader dan Tombol Berdenyut yang Menggabungkan Transformasi

Dengan `animation-composition: add`, Anda dapat menambahkan animasi denyut halus pada elemen yang sudah memiliki transformasi posisi tanpa menimpa koordinat `transform` dasarnya:

```css
@keyframes denyut-lembut {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.06); }
}

.pin-lokasi {
  /* Transformasi dasar untuk memusatkan pin di atas peta */
  transform: translate(-50%, -100%);
  animation: denyut-lembut 1.8s ease-in-out infinite;
  animation-composition: add;
}

.pin-lokasi:hover,
.pin-lokasi:focus-visible {
  animation-play-state: paused;
}
```

Tanpa `animation-composition: add`, aturan `@keyframes` yang mengubah `transform: scale(...)` akan menghapus `translate(-50%, -100%)` dan membuat pin bergeser dari titik koordinatnya.

## Kesalahan Umum dan Cara Menghindarinya

1. **Elemen "melompat" setelah animasi selesai.** Tambahkan `animation-fill-mode: forwards` (atau `both`), atau pastikan gaya dasar sama dengan keyframe akhir.
2. **Elemen berkedip sebelum animasi dimulai karena ada `animation-delay`.** Gunakan `backwards` atau `both`.
3. **Memakai `steps()` untuk teks tanpa monospace.** Lebar langkah tidak sama dengan lebar huruf.
4. **Menjeda animasi hanya saat `:hover`.** Tambahkan fokus dan kontrol eksplisit.
5. **Menganimasikan `transform` yang sudah dipakai untuk posisi.** Gunakan `animation-composition: add` atau properti individual `translate`/`rotate`/`scale`.

## Latihan Praktik: Animasi Masuk, Sprite, dan Marquee yang Bisa Dijeda

Buatlah berkas `keyframes-lanjut.html` dan `keyframes.css`:
1. Buat tiga kartu yang muncul berurutan dengan `animation-delay` bertingkat dan `animation-fill-mode: both`. Hapus `both` untuk melihat kedipan sebelum animasi dimulai.
2. Buat sprite 8 bingkai dengan `steps(8)` dan bandingkan dengan `ease` (mulus) agar perbedaannya jelas.
3. Buat marquee teks yang berhenti saat `:hover` dan `:focus-within`, ditambah tombol "Jeda" yang mengatur `animation-play-state` melalui kelas.
4. Beri elemen `transform: translateX(100px)` dan animasi putaran; bandingkan `animation-composition: replace` dan `add`.

## Kuis Pemahaman

### Soal 1
Kartu memakai `animation: muncul 500ms ease-out 200ms;` tanpa `animation-fill-mode`. Apa yang terjadi selama jeda 200ms awal?
- A. Kartu sudah memakai keyframe pertama (transparan).
- B. Kartu terlihat dengan gaya aslinya (penuh), lalu tiba-tiba menjadi transparan saat animasi dimulai dan memudar masuk.
- C. Animasi dibatalkan.
- D. Kartu bergerak mundur.

**Jawaban Benar:** B
**Penjelasan:** Tanpa `backwards`, selama `animation-delay` elemen belum memakai keyframe pertama sehingga tampil dengan gaya aslinya. Setelah jeda, keyframe pertama diterapkan sehingga terjadi kedipan. Gunakan `backwards` atau `both` untuk mencegahnya.

### Soal 2
Apa yang membedakan `animation: lari 800ms steps(8) infinite` dari `animation: lari 800ms linear infinite` pada animasi `background-position` sprite?
- A. `steps(8)` membuat animasi berjalan delapan kali lebih cepat.
- B. `steps(8)` mengulang animasi delapan kali.
- C. `steps(8)` membagi gerakan menjadi delapan langkah diskrit tanpa interpolasi, sehingga tiap bingkai sprite tampil utuh; `linear` bergeser mulus sehingga bingkai tampak tercampur.
- D. Tidak ada perbedaan visual.

**Jawaban Benar:** C
**Penjelasan:** `steps()` menghasilkan perubahan nilai yang melompat per langkah, sesuai kebutuhan animasi sprite. Fungsi `linear` menginterpolasi mulus sehingga sprite tampak bergeser alih-alih berganti bingkai.

### Soal 3
Elemen memiliki `transform: translateX(100px)` dan animasi `@keyframes` yang mengubah `transform: rotate(0deg)` menjadi `rotate(360deg)`. Apa efek `animation-composition: add`?
- A. Translasi `100px` hilang selama animasi.
- B. Putaran diabaikan.
- C. Seluruh transformasi diganti `none`.
- D. Putaran ditambahkan setelah nilai dasar, sehingga elemen tetap bergeser `100px` sambil berputar.

**Jawaban Benar:** D
**Penjelasan:** Dengan `replace` (bawaan), keyframe menimpa nilai dasar sehingga translasi hilang. Dengan `add`, nilai keyframe disusun setelah nilai dasar, jadi hasilnya `translateX(100px) rotate(...)`.

## Sumber
- [Using CSS animations — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Animations/Using)
- [`animation-fill-mode` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-fill-mode)
- [`animation-composition` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-composition)
- [Understanding Success Criterion 2.2.2: Pause, Stop, Hide — W3C WAI](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
