# Transformasi Tiga Dimensi (3D): `perspective`, `rotateX`/`rotateY`, `transform-style: preserve-3d`, dan Kartu Balik

- **Tingkat:** Lanjut
- **Ringkasan:** Membangun ruang proyeksi 3D di CSS menggunakan `perspective`, menjaga posisi 3D elemen anak dengan `transform-style: preserve-3d`, serta menyembunyikan sisi belakang kartu saat dibalik dengan `backface-visibility: hidden`.

## Mengapa Transformasi 3D?

Pelajaran 10 membahas transformasi 2D (`translate`, `scale`, `rotate`). CSS juga mendukung ruang tiga dimensi: sumbu **X** (kiri-kanan), **Y** (atas-bawah), dan **Z** (menuju atau menjauhi penonton). Efek 3D seperti kartu yang berputar, kotak, dan kemiringan halus saat *hover* membuat antarmuka lebih hidup. Syaratnya Anda perlu memahami tiga konsep: **perspective**, **preserve-3d**, dan **backface-visibility**. Ketiganya berstatus **Baseline Widely Available**.

## 1. `perspective`: Memberi Kedalaman

Tanpa perspektif, rotasi pada sumbu X atau Y tampak datar, seperti elemen yang menyusut sepihak. `perspective` mensimulasikan jarak pandang dari penonton ke bidang layar: semakin kecil nilainya, semakin ekstrem efek kedalamannya.

Ada dua cara memakainya:

```css
/* 1. Properti pada PARENT: berlaku bagi semua anak langsungnya */
.panggung {
  perspective: 800px;
  perspective-origin: 50% 50%;   /* titik pandang (bawaan: tengah) */
}
.panggung > .kartu {
  transform: rotateY(35deg);
}

/* 2. Fungsi pada elemen itu sendiri */
.kartu-sendiri {
  transform: perspective(800px) rotateY(35deg);
}
```

Perbedaannya: `perspective` pada induk memberi **satu titik hilang** bersama bagi semua anaknya; fungsi `perspective()` pada elemen hanya berlaku untuk elemen itu. Nilai umum: `600px` sampai `1200px`.

## 2. Rotasi dan Translasi 3D

- `rotateX(sudut)`: berputar mengelilingi sumbu X (mengangguk maju-mundur).
- `rotateY(sudut)`: berputar mengelilingi sumbu Y (menoleh kiri-kanan).
- `rotateZ(sudut)`: sama dengan rotasi 2D.
- `translateZ(jarak)`: mendekat (positif) atau menjauh (negatif) dari penonton.
- Properti individual: `rotate: y 45deg;` atau `rotate: 1 0 0 45deg;`, `translate: 0 0 40px;`.

```css
.miring-halus {
  transition: transform 300ms ease;
}
.miring-halus:hover {
  transform: perspective(900px) rotateX(6deg) rotateY(-8deg) translateZ(10px);
}
```

## 3. `transform-style: preserve-3d`: Menjaga Posisi 3D Anak

Secara bawaan (`transform-style: flat`), anak dari elemen yang ditransformasi **diratakan** ke bidang elemen induknya. Agar anak tetap berada di ruang 3D (misalnya kubus yang terdiri dari beberapa sisi), induk harus memakai `transform-style: preserve-3d`.

> **⚠️ Jebakan:** Beberapa properti pada elemen yang sama **memaksa `flat`** dan membatalkan `preserve-3d`, misalnya `overflow` selain `visible`, `opacity` kurang dari 1, `filter`, `clip-path`, dan `mask`. Bila efek 3D Anda mendadak datar, periksa properti-properti ini pada elemen yang memiliki `preserve-3d` (dan pada leluhurnya yang ikut mengatur tumpukan).

## 4. `backface-visibility`: Menyembunyikan Sisi Belakang

Saat elemen diputar lebih dari 90 derajat, kita melihat **sisi belakangnya** (gambar cermin dari isinya). `backface-visibility: hidden` menyembunyikan elemen saat sisi belakangnya menghadap penonton. Properti ini penting untuk kartu dua sisi.

## 5. Kartu Balik (*Flip Card*)

```html
<div class="kartu-balik">
  <div class="dalam">
    <div class="sisi depan">
      <h3>Kodeloka</h3>
      <p>Arahkan atau fokus untuk membalik</p>
    </div>
    <div class="sisi belakang">
      <p>Belajar CSS langkah demi langkah.</p>
    </div>
  </div>
</div>
```

```css
.kartu-balik {
  inline-size: 16rem;
  aspect-ratio: 3 / 2;
  perspective: 1000px;
}

.dalam {
  position: relative;
  inline-size: 100%;
  block-size: 100%;
  transform-style: preserve-3d;
  transition: transform 600ms ease;
}

.kartu-balik:hover .dalam,
.kartu-balik:focus-within .dalam {
  transform: rotateY(180deg);
}

.sisi {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  padding: 1rem;
  border-radius: 0.75rem;
  backface-visibility: hidden;       /* sembunyikan saat sisi ini membelakangi */
}

.depan   { background-color: oklch(55% 0.2 255); color: white; }
.belakang {
  background-color: oklch(95% 0.03 255);
  transform: rotateY(180deg);        /* putar awal agar menghadap ke depan setelah kartu dibalik */
}

@media (prefers-reduced-motion: reduce) {
  .dalam { transition: none; }
}
```

Cara kerja: kartu `.dalam` diputar 180 derajat saat `hover` atau fokus. Sisi `.belakang` sudah diputar 180 derajat di awal sehingga **menghadap ke depan** setelah putaran kartu. Dengan `backface-visibility: hidden`, sisi `.depan` menghilang saat membelakangi penonton, dan sisi `.belakang` hanya terlihat setelah dibalik.

## 6. Aksesibilitas Kartu Balik

- **Jangan hanya memakai `:hover`.** Pengguna papan ketik dan layar sentuh tidak bisa menghover. Tambahkan `:focus-within` dan sediakan tombol yang mengatur kelas atau atribut (mis. `aria-pressed`) untuk membalik kartu.
- **Kedua sisi tetap berada di DOM**, sehingga pembaca layar membacanya berurutan walau salah satu sisi tidak terlihat. Bila sisi tersembunyi tidak boleh terbaca, tandai sisi yang tidak aktif dengan atribut `inert` atau `aria-hidden` lewat JavaScript yang menukar status.
- **Hormati `prefers-reduced-motion`**: ganti putaran dengan pergantian seketika atau pudar sederhana.
- **Uji pada konten panjang.** Sisi belakang yang berisi banyak teks tidak boleh terpotong; atur tinggi kartu mengikuti isi terpanjang.

## Kesalahan Umum dan Cara Menghindarinya

1. **Lupa `perspective`.** Rotasi 3D tampak datar; tambahkan `perspective` pada induk atau fungsi `perspective()`.
2. **Lupa `transform-style: preserve-3d` pada pembungkus sisi.** Kedua sisi diratakan sehingga efek balik gagal.
3. **Lupa `backface-visibility: hidden` pada kedua sisi.** Sisi depan tampak sebagai gambar cermin saat dibalik.
4. **Menambah `overflow: hidden`, `opacity`, atau `filter` pada elemen `preserve-3d`.** Efek 3D menjadi datar.
5. **Kartu balik yang hanya bisa dioperasikan dengan hover.** Tidak aksesibel.

## Latihan Praktik: Kartu Balik yang Aksesibel

Buatlah berkas `kartu-3d.html` dan `kartu-3d.css`:
1. Buat kartu balik seperti contoh dengan `perspective: 1000px` pada pembungkus.
2. Tambahkan tombol "Balik kartu" yang mengatur kelas `.terbalik`, lengkap dengan `aria-pressed`, dan pastikan kartu juga membalik lewat `:focus-within`.
3. Uji dengan menghapus `backface-visibility: hidden` dan perhatikan apa yang terjadi pada sisi depan. Lalu coba tambah `overflow: hidden` pada `.dalam` dan catat apa yang berubah.
4. Aktifkan `prefers-reduced-motion` di tab Rendering DevTools dan pastikan animasi tidak berjalan.

## Kuis Pemahaman

### Soal 1
Rotasi `rotateY(60deg)` pada sebuah kartu tampak datar tanpa efek kedalaman. Apa yang paling mungkin hilang?
- A. `perspective` pada elemen induk atau fungsi `perspective()` pada transformasi.
- B. `overflow: hidden` pada kartu.
- C. `backface-visibility: visible`.
- D. `display: block`.

**Jawaban Benar:** A
**Penjelasan:** Tanpa `perspective`, rotasi pada sumbu Y hanya terlihat sebagai penyusutan lebar sepihak tanpa efek kedalaman. Perspektif memberi titik hilang sehingga sisi yang dekat tampak lebih besar daripada sisi yang jauh.

### Soal 2
Apa fungsi `transform-style: preserve-3d` pada pembungkus `.dalam` di kartu balik?
- A. Menyembunyikan sisi belakang kartu.
- B. Membuat kartu berputar tanpa batas.
- C. Menambah bayangan 3D otomatis.
- D. Menjaga kedua sisi (anak) tetap berada di ruang 3D alih-alih diratakan ke bidang pembungkus, sehingga rotasi bersama dan sisi belakang benar-benar berada di belakang.

**Jawaban Benar:** D
**Penjelasan:** Secara bawaan anak diratakan (`flat`). Dengan `preserve-3d`, anak mempertahankan posisi 3D masing-masing sehingga kedua sisi tampak berada di depan dan belakang pembungkus.

### Soal 3
Pada kartu balik yang benar, mengapa sisi `.belakang` diberi `transform: rotateY(180deg)` sejak awal?
- A. Agar sisi belakang tampil mendahului sisi depan.
- B. Agar setelah pembungkus `.dalam` diputar 180 derajat, sisi belakang berputar kembali menghadap penonton dengan isi yang tidak terbalik.
- C. Agar `backface-visibility` tidak diperlukan.
- D. Agar kartu menjadi lebih ringan dirender.

**Jawaban Benar:** B
**Penjelasan:** Sisi belakang pada awalnya menghadap menjauh (diputar 180 derajat). Ketika pembungkus diputar 180 derajat, rotasi totalnya kembali ke 360 derajat sehingga sisi itu menghadap penonton dengan isi yang terbaca normal.

## Sumber
- [Using CSS transforms — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transforms/Using)
- [`perspective` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/perspective)
- [`transform-style` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform-style)
- [`backface-visibility` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backface-visibility)
- [CSS Transforms Module Level 2 — W3C](https://www.w3.org/TR/css-transforms-2/)
