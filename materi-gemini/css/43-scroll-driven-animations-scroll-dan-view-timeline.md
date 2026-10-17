# Praktik Mendalam Scroll-Driven Animations: `scroll()`, `view()`, dan `animation-range`

- **Tingkat:** Lanjut
- **Ringkasan:** Menganimasikan kemunculan kartu dan grafik saat masuk ke jendela pandang menggunakan `animation-timeline: view()` dan mengatur rentang aktifnya dengan `animation-range: entry 0% cover 30%`.

## Mengapa Scroll-Driven Animations?

Efek seperti elemen yang memudar masuk saat digulir, bilah kemajuan baca, atau paralaks dahulu dibuat dengan JavaScript (`scroll` event atau `IntersectionObserver`). **Scroll-driven animations** memindahkan itu ke CSS: kemajuan animasi tidak lagi dihitung dari **waktu**, melainkan dari **posisi gulir** atau **posisi sebuah elemen di jendela pandang**. Karena dijalankan peramban, animasi `transform` dan `opacity` dapat berjalan di luar utas utama sehingga tetap mulus.

**Dukungan peramban:** `animation-timeline`, `view()`, `scroll()`, dan `animation-range` didukung Chrome/Edge sejak versi 115 dan Safari 26. Firefox baru mendukungnya mulai versi 159, yang saat ini masih beta. Karena belum merata, MDN menandainya **Limited availability**; gunakan sebagai **peningkatan progresif** (lihat bagian 4).

## 1. Dua Jenis Linimasa (*Timeline*)

- **`scroll()`**: kemajuan mengikuti **posisi gulir sebuah kontainer** (0% di awal, 100% di ujung). Cocok untuk bilah kemajuan baca dan paralaks.
- **`view()`**: kemajuan mengikuti **seberapa jauh sebuah elemen melintasi jendela pandang** kontainer gulirnya: 0% saat mulai masuk, 100% saat selesai keluar. Cocok untuk efek "muncul saat terlihat".

```css
/* Bilah kemajuan baca di atas halaman */
@keyframes isi-bilah {
  from { scale: 0 1; }
  to   { scale: 1 1; }
}

.bilah-baca {
  position: fixed;
  inset: 0 0 auto 0;
  block-size: 4px;
  background-color: oklch(55% 0.2 255);
  transform-origin: 0 50%;
  animation: isi-bilah linear both;
  animation-timeline: scroll(root block);   /* ikuti gulir halaman utama (sumbu block) */
}
```

Dua hal yang perlu diingat saat menulis animasi bertimeline gulir:
- Tulis **`animation-timeline` setelah** singkatan `animation`, karena singkatan itu mereset `animation-timeline`.
- Jangan menetapkan durasi dalam detik; durasi tidak berarti pada linimasa gulir (nilai bawaan `auto`). Gunakan fungsi easing `linear` bila ingin kemajuan sebanding dengan gulir.

## 2. `view()`: Kartu yang Memudar Masuk

```css
@keyframes muncul {
  from { opacity: 0; translate: 0 3rem; }
  to   { opacity: 1; translate: 0 0; }
}

.kartu {
  animation: muncul linear both;
  animation-timeline: view();               /* ikuti kemunculan elemen ini di jendela pandang */
  animation-range: entry 0% cover 30%;      /* aktif dari mulai masuk hingga 30% rentang cover */
}
```

## 3. `animation-range`: Rentang Aktif

Animasi tidak harus membentang dari awal hingga akhir seluruh perjalanan elemen. **`animation-range`** menentukan awal dan akhirnya dengan nama rentang plus persentase:

| Rentang | Arti |
|---|---|
| `cover` | Seluruh perjalanan: dari elemen mulai menyentuh jendela pandang hingga benar-benar meninggalkannya |
| `contain` | Selama elemen **sepenuhnya berada di dalam** jendela pandang (atau menutupinya, bila lebih besar) |
| `entry` | Fase elemen **masuk** (mulai terlihat hingga seluruhnya masuk) |
| `exit` | Fase elemen **keluar** |
| `entry-crossing`, `exit-crossing` | Varian yang mengukur saat tepi elemen melintasi tepi jendela pandang |

Sintaks: `animation-range: <awal> <akhir>`. Contoh `entry 0% cover 30%` berarti **mulai** saat fase masuk 0% (elemen baru muncul) dan **berakhir** pada 30% dari seluruh rentang `cover`. Contoh lain:
- `animation-range: entry` (fase masuk saja, dari 0% sampai 100% fase itu),
- `animation-range: entry 25% entry 75%`,
- `animation-range: exit 0% exit 100%` untuk efek keluar.

Anda dapat menggabungkan dua animasi pada satu elemen (masuk dan keluar) dengan dua `@keyframes` dan dua rentang berbeda.

## 4. Peningkatan Progresif dan Aksesibilitas

Keadaan awal animasi seperti `opacity: 0` **tidak boleh** berlaku bagi peramban yang tidak mendukung linimasa gulir atau bagi pengguna yang meminta pengurangan gerak; konten akan **tetap tersembunyi**. Tulis semua efek di dalam `@supports` dan `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .kartu {
      animation: muncul linear both;
      animation-timeline: view();
      animation-range: entry 0% cover 30%;
    }
  }
}
```

Dengan susunan ini, peramban lama atau pengguna yang memilih gerakan berkurang melihat kartu langsung tampil dengan gaya normal. Hindari efek yang menyembunyikan konten penting sampai digulir.

## Studi Kasus Produksi: Bilah Kemajuan Baca Artikel dan Header Menyusut Tanpa JavaScript

Menggunakan `scroll(root block)` dengan rentang piksel tetap memungkinkan kita membuat bilah kemajuan baca sekaligus mengecilkan tinggi header saat halaman mulai digulir:

```css
@keyframes rentang-baca {
  from { scale: 0 1; }
  to   { scale: 1 1; }
}

@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .bilah-baca {
      transform-origin: 0% 50%;
      animation: rentang-baca linear both;
      animation-timeline: scroll(root block);
    }
  }
}
```

Karena kita menganimasikan properti `scale` (bukan `width`), peramban dapat menjalankan animasi ini di jalur kompositor tanpa memicu penghitungan ulang tata letak (*reflow*) di setiap piksel guliran.

## Kesalahan Umum dan Cara Menghindarinya

1. **Menyertakan `animation-timeline` sebelum singkatan `animation`.** Singkatan mereset nilainya.
2. **Menaruh `opacity: 0` sebagai gaya dasar.** Di peramban tanpa dukungan, konten tak pernah muncul; letakkan di dalam `@supports`.
3. **Mengira durasi `1s` menentukan kecepatan.** Pada linimasa gulir, kecepatan ditentukan jarak gulir.
4. **Tidak menghormati `prefers-reduced-motion`.** Gerakan terkait gulir termasuk pemicu gangguan vestibular.
5. **Menganimasikan properti yang memicu *layout*.** Pilih `transform` dan `opacity`.

## Latihan Praktik: Halaman Artikel dengan Efek Gulir

Buatlah berkas `scroll-timeline.html` dan `scroll-timeline.css`:
1. Buat bilah kemajuan baca dengan `animation-timeline: scroll(root block)`.
2. Buat 6 kartu yang memudar masuk dengan `view()` dan `animation-range: entry 0% cover 30%`. Ubah rentang menjadi `entry 0% entry 100%` dan bandingkan.
3. Bungkus semua efek dalam `@supports (animation-timeline: view())` dan `@media (prefers-reduced-motion: no-preference)`. Uji di peramban tanpa dukungan atau dengan emulasi gerakan berkurang, dan pastikan kartu tetap terlihat.

## Kuis Pemahaman

### Soal 1
Apa beda utama `scroll()` dan `view()` sebagai nilai `animation-timeline`?
- A. `scroll()` mengikuti posisi gulir sebuah kontainer, sedangkan `view()` mengikuti kemajuan sebuah elemen melintasi jendela pandang kontainer gulirnya.
- B. `scroll()` hanya untuk desktop, `view()` hanya untuk ponsel.
- C. `scroll()` menentukan durasi, `view()` menentukan warna.
- D. Tidak ada beda; keduanya sinonim.

**Jawaban Benar:** A
**Penjelasan:** `scroll()` memetakan 0%-100% ke rentang gulir sebuah kontainer (cocok untuk bilah kemajuan), sedangkan `view()` memetakan ke perjalanan sebuah elemen melewati jendela pandang (cocok untuk efek muncul saat terlihat).

### Soal 2
Apa arti `animation-range: entry 0% cover 30%`?
- A. Animasi berjalan selama 30 detik.
- B. Animasi mulai saat elemen baru mulai masuk jendela pandang dan berakhir ketika kemajuan mencapai 30% dari seluruh rentang `cover`.
- C. Animasi hanya berjalan setelah elemen sepenuhnya keluar.
- D. Animasi diulang 30 kali.

**Jawaban Benar:** B
**Penjelasan:** Nilai pertama menentukan titik awal (`entry 0%`, tepat saat elemen mulai masuk) dan nilai kedua titik akhir (`cover 30%`, 30% dari keseluruhan perjalanan elemen melewati jendela pandang).

### Soal 3
Mengapa efek kemunculan yang memakai `opacity: 0` sebaiknya ditulis di dalam `@supports (animation-timeline: view())`?
- A. Agar animasi berjalan lebih cepat.
- B. Karena `@supports` mempercepat gulir.
- C. Agar di peramban yang tidak mendukung linimasa gulir, kartu tidak terjebak dalam keadaan transparan dan tetap terlihat normal.
- D. Karena `opacity` tidak boleh dipakai di luar `@supports`.

**Jawaban Benar:** C
**Penjelasan:** Di peramban tanpa dukungan, `animation-timeline` diabaikan sehingga animasi tidak pernah maju. Jika `opacity: 0` berlaku sebagai gaya dasar, konten tidak akan pernah tampil. `@supports` menjaga efek hanya aktif bila didukung.

## Sumber
- [CSS scroll-driven animations — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- [`animation-timeline` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline)
- [`animation-range` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-range)
- [Scroll-driven Animations — W3C](https://www.w3.org/TR/scroll-animations-1/)
