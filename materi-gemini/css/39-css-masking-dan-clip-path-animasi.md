# CSS Masking (`mask-image`) dan Animasi Pemotongan Bentuk dengan `clip-path`

- **Tingkat:** Lanjut
- **Ringkasan:** Membuat efek pudar bertahap pada tepi gambar atau daftar gulir menggunakan `mask-image: linear-gradient(...)`, serta menganimasikan perubahan poligon `clip-path` dengan jumlah titik yang sama.

## Mengapa Masking dan Clipping?

Dua teknik ini sama-sama "memotong" tampilan elemen, tetapi dengan cara berbeda:
- **`clip-path`** memotong dengan **bentuk** bertepi tegas (lingkaran, persegi, poligon). Bagian di luar bentuk hilang sepenuhnya.
- **`mask-image`** memotong dengan **gambar atau gradien**: bagian yang opak pada masker tampak, bagian yang transparan tersembunyi, dan nilai di tengahnya **memudar** secara bertahap.

Pelajaran 16 sudah memperkenalkan `clip-path` statis. Di sini kita membahas masker dan menganimasikan keduanya.

## 1. `mask-image`: Pudar Bertahap

Pada gambar atau gradien, masker bekerja berdasarkan **kanal alfa**: piksel masker yang opak membuat elemen terlihat, yang transparan menyembunyikannya.

```css
/* Foto memudar menuju transparan di tepi bawah */
.sampul {
  -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent);
  mask-image: linear-gradient(to bottom, black 70%, transparent);
}

/* Daftar yang dapat digulir dengan tepi atas dan bawah memudar */
.daftar-gulir {
  max-block-size: 18rem;
  overflow-y: auto;
  -webkit-mask-image: linear-gradient(
    to bottom, transparent, black 1.5rem, black calc(100% - 1.5rem), transparent
  );
  mask-image: linear-gradient(
    to bottom, transparent, black 1.5rem, black calc(100% - 1.5rem), transparent
  );
}
```

Catatan:
- Warna pada gradien masker tidak berpengaruh; yang dipakai adalah **opasitasnya**. `black` hanyalah contoh warna opak.
- `mask-image` unprefixed berstatus **Baseline Widely Available** sejak Desember 2023. Menulis versi `-webkit-` di atasnya masih berguna untuk peramban yang lebih lama.
- Properti pendamping: `mask-size`, `mask-position`, `mask-repeat`, dan `mask-composite` (menggabungkan beberapa lapisan masker dengan `add`, `subtract`, `intersect`, `exclude`). Singkatannya `mask`.
- Masker dapat berupa gambar SVG (`mask-image: url(bentuk.svg)`), sehingga elemen dapat berbentuk logo atau ikon tertentu.

### Masker Tidak Memengaruhi Interaksi

Spesifikasi menyatakan bahwa `mask-image` **tidak memengaruhi geometri maupun *hit-testing*** kotak elemen. Bagian yang tampak tersembunyi oleh masker **tetap menerima klik atau hover**. Berbeda dengan itu, area di luar `clip-path` **tidak menerima** peristiwa pointer. Jangan menyembunyikan tombol atau tautan hanya dengan masker.

## 2. Menganimasikan `clip-path`

`clip-path` dapat ditransisikan, dengan syarat **bentuk di awal dan akhir sejenis** sehingga nilai antara dapat dihitung:

- `circle()` ke `circle()`: ubah jari-jari atau titik pusat.
- `inset()` ke `inset()`: geser tepi pemotongan.
- `polygon()` ke `polygon()`: **jumlah titik harus sama**; peramban menginterpolasi koordinat titik yang berpasangan.

```css
/* Efek "tirai": gambar tersingkap dari kiri ke kanan */
.penyingkap {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 600ms ease-out;
}
.penyingkap.tampak {
  clip-path: inset(0 0 0 0);
}

/* Lingkaran yang membesar dari pusat */
.dialog-lingkaran {
  clip-path: circle(0% at 50% 50%);
  transition: clip-path 500ms ease-out;
}
.dialog-lingkaran.terbuka {
  clip-path: circle(75% at 50% 50%);
}

/* Poligon dengan jumlah titik sama (4 titik): spanduk miring menjadi persegi */
.spanduk {
  clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);
  transition: clip-path 400ms ease;
}
.spanduk:hover {
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
```

Jika jumlah titik poligon berbeda, atau jika bentuk berbeda jenis (`circle()` ke `polygon()`), peramban tidak dapat menginterpolasi dan perubahan terjadi **seketika** tanpa animasi. Bila perlu, tambahkan titik duplikat agar jumlahnya sama.

Untuk menyingkap elemen secara dinamis, kombinasikan dengan `animation` dan `@keyframes`, atau ketika memakai transisi masuk `@starting-style` (Pelajaran 41).

## 3. Aksesibilitas dan Performa

- **Gerakan:** Efek tirai atau lingkaran yang besar termasuk gerakan; hormati `prefers-reduced-motion` dengan mematikan transisi atau memakai perubahan seketika.
- **Konten tetap ada di pohon aksesibilitas.** `clip-path` dan `mask-image` hanya mengubah tampilan. Teks yang "disembunyikan" lewat klip masih dibaca pembaca layar. Gunakan `display: none` atau atribut `hidden` untuk menyembunyikan konten dari semua pengguna.
- **Gunakan masker pada konten yang tidak kritis.** Teks yang memudar di tepi tetap terbaca, tetapi jangan memudarkan informasi penting.
- **Performa:** Animasi `clip-path` memicu penggambaran ulang; uji pada perangkat sasaran dan hindari pada elemen sangat besar yang dianimasikan terus-menerus.

```css
@media (prefers-reduced-motion: reduce) {
  .penyingkap,
  .dialog-lingkaran,
  .spanduk {
    transition: none;
  }
}
```

## Studi Kasus Produksi: Bilah Tab Geser Horizontal dengan Petunjuk Pudar di Tepi

Ketika daftar tab navigasi melebihi lebar layar ponsel, memudarkan tepi kanan dengan `mask-image` memberi isyarat visual kepada pengguna bahwa daftar tersebut masih dapat digulir ke samping:

```css
.wadah-tab-geser {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-inline: 1rem;
  /* Pudar halus 1.5rem di tepi kiri dan kanan */
  mask-image: linear-gradient(
    to right,
    transparent,
    black 1.5rem,
    black calc(100% - 1.5rem),
    transparent
  );
}
```

Karena `mask-image` menggunakan saluran alfa dari gradien tanpa bergantung pada warna latar halaman, bilah tab ini dapat ditaruh di atas latar terang, gelap, maupun gambar tanpa perlu menyesuaikan warna pudar.

## Kesalahan Umum dan Cara Menghindarinya

1. **Menganimasikan poligon dengan jumlah titik berbeda.** Tidak ada interpolasi; perubahan terjadi seketika.
2. **Menyembunyikan tombol dengan masker.** Area tersembunyi tetap bisa diklik; gunakan `clip-path` atau `display: none` sesuai kebutuhan.
3. **Mengira warna gradien masker penting.** Hanya opasitasnya yang dipakai.
4. **Memakai masker untuk membuat teks "tidak terbaca" bagi pembaca layar.** Masker hanya visual.
5. **Lupa menyediakan kondisi `prefers-reduced-motion`.**

## Latihan Praktik: Galeri dengan Efek Pudar dan Penyingkapan

Buatlah berkas `masker-clip.html` dan `masker.css`:
1. Buat daftar gulir berisi 15 butir dengan tepi atas dan bawah memudar menggunakan `mask-image`.
2. Buat gambar yang tersingkap dari kiri ke kanan dengan transisi `clip-path: inset()` saat kelas `.tampak` ditambahkan.
3. Buat spanduk poligon empat titik yang berubah bentuk saat `:hover`, lalu coba menambah satu titik pada keadaan akhir dan amati animasinya berhenti berjalan.
4. Tambahkan blok `prefers-reduced-motion` yang mematikan semua transisi.

## Kuis Pemahaman

### Soal 1
Apa efek `mask-image: linear-gradient(to bottom, black 70%, transparent);` pada sebuah gambar?
- A. Bagian bawah gambar memudar menjadi transparan, dimulai dari sekitar 70% tinggi gambar.
- B. Gambar diwarnai hitam di bagian atas.
- C. Gambar dipotong menjadi poligon.
- D. Gambar diputar 70 derajat.

**Jawaban Benar:** A
**Penjelasan:** Masker bekerja dengan opasitas gradien: bagian yang opak (`black` hingga 70%) terlihat penuh, lalu perlahan menuju transparan di bagian bawah sehingga gambar memudar.

### Soal 2
Manakah transisi `clip-path` yang **dapat** dianimasikan secara halus?
- A. Dari `circle(0%)` ke `polygon(0 0, 100% 0, 100% 100%, 0 100%)`.
- B. Dari `polygon(0 0, 100% 0, 100% 100%)` (3 titik) ke `polygon(0 0, 100% 0, 100% 100%, 0 100%)` (4 titik).
- C. Dari `inset(0 100% 0 0)` ke `inset(0)`.
- D. Dari `none` ke `url(#bentuk)`.

**Jawaban Benar:** C
**Penjelasan:** Kedua nilai berjenis `inset()` sehingga dapat diinterpolasi. Opsi A dan D berbeda jenis bentuk, dan opsi B memiliki jumlah titik poligon yang berbeda; perubahannya terjadi seketika.

### Soal 3
Sebuah tombol ditutupi masker sehingga tampak transparan di sudutnya. Apa yang terjadi bila pengguna mengeklik area sudut yang tampak tersembunyi?
- A. Klik diabaikan, karena area tersebut tidak terlihat.
- B. Peramban menampilkan pesan kesalahan.
- C. Klik tetap diterima tombol, karena masker tidak memengaruhi hit-testing.
- D. Tombol dihapus dari DOM.

**Jawaban Benar:** C
**Penjelasan:** `mask-image` tidak memengaruhi geometri maupun hit-testing kotak elemen. Berbeda dengan `clip-path`, bagian yang tersembunyi karena masker tetap menerima peristiwa pointer.

## Sumber
- [CSS Masking — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Masking)
- [`mask-image` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-image)
- [`clip-path` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/clip-path)
- [CSS Masking Module Level 1 — W3C](https://www.w3.org/TR/css-masking-1/)
