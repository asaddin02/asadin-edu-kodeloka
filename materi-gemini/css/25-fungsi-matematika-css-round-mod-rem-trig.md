# Fungsi Matematika CSS Tingkat Lanjut: `round()`, `mod()`, `rem()`, `sin()`, `cos()`, dan `pow()`

- **Tingkat:** Lanjut
- **Ringkasan:** Menggunakan fungsi pembulatan bertingkat `round(nearest, nilai, langkah)` untuk tata letak yang terkunci pada grid piksel, serta fungsi trigonometri `sin()` dan `cos()` untuk tata letak melingkar.

## Mengapa CSS Punya Fungsi Matematika Lengkap?

Pelajaran 04 memperkenalkan `calc()`, `min()`, `max()`, dan `clamp()`. Modul *CSS Values and Units* juga menyediakan fungsi-fungsi matematika yang lebih lengkap: fungsi **bertahap** (`round()`, `mod()`, `rem()`), **trigonometri** (`sin()`, `cos()`, `tan()`, `asin()`, `acos()`, `atan()`, `atan2()`), **eksponensial** (`pow()`, `sqrt()`, `hypot()`, `log()`, `exp()`), dan **tanda** (`abs()`, `sign()`). Dengan fungsi-fungsi ini, perhitungan yang dahulu memerlukan JavaScript, seperti menata item melingkar atau membuat skala tipografi, dapat ditulis langsung di CSS.

Status dukungan (Baseline): `sin()`, `cos()`, dan fungsi trigonometri lain **Baseline Widely Available** (sejak Maret 2023); `pow()`, `sqrt()`, `hypot()`, `log()`, `exp()` **Widely Available** (sejak Desember 2023); `round()`, `mod()`, `rem()` **Newly Available** (sejak Mei 2024); `abs()` dan `sign()` **Newly Available** (sejak Juni 2025).

## 1. `round()`: Membulatkan ke Kelipatan Tertentu

Sintaks: `round(<strategi>?, nilai, interval)`. Strategi pembulatan:
- `nearest` (bawaan jika strategi dihilangkan): ke kelipatan interval terdekat.
- `up`: ke kelipatan interval ke arah nilai yang lebih besar.
- `down`: ke kelipatan interval ke arah nilai yang lebih kecil.
- `to-zero`: ke arah nol.

Contoh hitungan: `round(nearest, 47px, 20px)` = `40px`; `round(up, 41px, 20px)` = `60px`; `round(down, 59px, 20px)` = `40px`.

```css
/* Lebar kontainer "terkunci" ke kelipatan 20rem agar kartu selalu utuh tanpa sisa ruang aneh */
.galeri {
  inline-size: max(20rem, round(down, 100%, 20rem));
  margin-inline: auto;
}

/* Jarak baris dibulatkan ke kelipatan 4px agar tetap selaras dengan grid 4px */
.paragraf {
  margin-block-end: round(nearest, 1.3rem, 4px);
}
```

Catatan: nilai dan interval harus bertipe sama (misalnya sama-sama panjang). Hati-hati dengan `round(down, 100%, 20rem)` pada kontainer yang lebih sempit dari satu interval, karena hasilnya `0`; itu sebabnya contoh di atas dibungkus `max()`.

## 2. `mod()` dan `rem()`: Sisa Bagi

Keduanya menghitung sisa pembagian, tetapi tanda hasilnya berbeda:
- `mod(a, b)`: hasil bertanda **sama dengan pembagi `b`**. Contoh: `mod(18px, 5px)` = `3px`, `mod(-18px, 5px)` = `2px`.
- `rem(a, b)`: hasil bertanda **sama dengan yang dibagi `a`**. Contoh: `rem(18px, 5px)` = `3px`, `rem(-18px, 5px)` = `-3px`.

Untuk nilai positif keduanya sama. Perbedaannya penting ketika `a` bisa negatif, misalnya saat memutar sudut atau menghitung posisi relatif.

```css
/* Palet warna "sudut emas": setiap item berbeda rona, tetap dalam rentang 0-360 */
.chip {
  --rona: calc(mod(var(--i) * 137.5, 360));
  background-color: oklch(85% 0.1 var(--rona));
  color: oklch(30% 0.1 var(--rona));
}
```

Pada HTML, beri nomor lewat gaya inline: `<li class="chip" style="--i: 3">`.

## 3. Trigonometri: Tata Letak Melingkar dengan `sin()` dan `cos()`

`sin()`, `cos()`, dan `tan()` menerima **sudut** (misalnya `30deg`, `0.5turn`) atau **angka tanpa satuan yang dianggap radian**. Hasilnya berupa **angka tanpa satuan** (`sin(30deg)` = `0.5`), sehingga harus dikalikan dengan satuan panjang agar bisa dipakai pada `translate`, `width`, dan sebagainya. Kebalikannya, `asin()`, `acos()`, `atan()`, `atan2()` mengembalikan **sudut**.

```css
/* Menata 6 item di sepanjang lingkaran berjari-jari 7rem, searah jarum jam, mulai dari atas */
.orbit {
  --jari: 7rem;
  --jumlah: 6;
  position: relative;
  inline-size: calc(var(--jari) * 2 + 3rem);
  aspect-ratio: 1;
  list-style: none;
  padding: 0;
}

.orbit > li {
  --sudut: calc(360deg / var(--jumlah) * var(--i));
  position: absolute;
  inset: 50% auto auto 50%;
  translate:
    calc(-50% + var(--jari) * sin(var(--sudut)))
    calc(-50% - var(--jari) * cos(var(--sudut)));
}
```

Nomor `--i` (0 sampai 5) diberikan lewat `style="--i: 0"` pada tiap `<li>`. Pada peramban yang sudah mendukung `sibling-index()` (Baseline Newly Available sejak Agustus 2026), Anda dapat memakainya sebagai pengganti variabel `--i`; untuk jangkauan yang lebih luas, tetap gunakan variabel manual.

Penjelasan rumus: pada sudut θ, posisi di lingkaran adalah `x = jari × sin(θ)` dan `y = -jari × cos(θ)` (tanda minus karena sumbu Y layar mengarah ke bawah). Pada `θ = 0`, `sin` bernilai `0` dan `cos` bernilai `1`, sehingga item berada tepat di atas.

## 4. `pow()`, `sqrt()`, `hypot()`: Skala Tipografi

`pow(basis, eksponen)` menerima angka tanpa satuan dan mengembalikan angka. Ini cocok untuk membuat skala modular tipografi:

```css
:root {
  --rasio: 1.25;   /* skala "major third" */
}

h1 { font-size: calc(1rem * pow(var(--rasio), 4)); }  /* 1.25^4 = 2.44rem */
h2 { font-size: calc(1rem * pow(var(--rasio), 3)); }  /* 1.25^3 = 1.95rem */
h3 { font-size: calc(1rem * pow(var(--rasio), 2)); }  /* 1.25^2 = 1.56rem */
```

Fungsi lain: `sqrt(16)` = `4`, `hypot(3px, 4px)` = `5px` (panjang sisi miring), `log()` dan `exp()` untuk logaritma dan eksponensial alami.

## Kesalahan Umum dan Cara Menghindarinya

1. **Menyampur satuan yang tidak sepadan di `mod()`/`rem()`/`round()`.** `mod(10px, 3deg)` tidak valid; kedua argumen harus bertipe sama.
2. **Menggunakan hasil `sin()` sebagai panjang.** `translate: sin(30deg)` tidak berarti `0.5px`; hasilnya angka, sehingga harus dikalikan dengan satuan panjang (`calc(sin(30deg) * 5rem)`).
3. **Menggunakan sudut dengan satuan pada `pow()`.** `pow()` hanya menerima angka tanpa satuan.
4. **Lupa menyediakan cadangan.** `round()`, `mod()`, dan `rem()` baru lintas peramban sejak Mei 2024; bungkus dengan `@supports (width: round(up, 1px, 1px))` jika perlu mendukung peramban lama.

## Latihan Praktik: Orbit Menu dan Skala Tipografi

Buatlah berkas `matematika-css.html` dan `matematika.css`:
1. Tata 8 ikon di sepanjang lingkaran dengan `sin()` dan `cos()`; ganti `--jumlah` menjadi 5 dan pastikan jarak antar-ikon tetap rata.
2. Buat skala tipografi `h1` sampai `h4` dengan `pow()` dan satu variabel `--rasio`; coba ubah rasio dari `1.2` ke `1.333`.
3. Beri warna 10 lencana dengan `mod()` agar rona tetap dalam rentang 0-360.

## Kuis Pemahaman

### Soal 1
Berapa hasil `mod(-18px, 5px)` dan `rem(-18px, 5px)`?
- A. `mod` = `-3px`, `rem` = `2px`
- B. `mod` = `2px`, `rem` = `-3px`
- C. Keduanya `3px`
- D. Keduanya `-3px`

**Jawaban Benar:** B
**Penjelasan:** `mod()` mengikuti tanda pembagi (`5px`, positif), sehingga hasilnya `2px` (karena `-18 = -4 × 5 + 2`). `rem()` mengikuti tanda yang dibagi (`-18px`, negatif), sehingga hasilnya `-3px` (karena `-18 = -3 × 5 - 3`).

### Soal 2
Berapa hasil `round(up, 41px, 20px)`?
- A. `40px`
- B. `41px`
- C. `60px`
- D. `20px`

**Jawaban Benar:** C
**Penjelasan:** Strategi `up` membulatkan ke kelipatan interval berikutnya yang lebih besar atau sama dengan nilai. Kelipatan `20px` di atas `41px` adalah `60px`.

### Soal 3
Apa jenis nilai yang dikembalikan oleh `sin(30deg)`, dan bagaimana cara memakainya sebagai jarak pada `translate`?
- A. Sudut `30deg`; langsung dipakai sebagai panjang.
- B. Panjang `0.5px`; tidak perlu diubah.
- C. Angka tanpa satuan `0.5`; dikalikan satuan panjang, misalnya `calc(sin(30deg) * 5rem)`.
- D. Persentase `50%`; dipakai langsung pada `translate`.

**Jawaban Benar:** C
**Penjelasan:** Fungsi `sin()`, `cos()`, dan `tan()` menghasilkan angka tanpa satuan. Agar bisa menjadi jarak, angka itu harus dikalikan dengan nilai berdimensi di dalam `calc()`.

## Sumber
- [CSS value functions (math functions) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Values_and_units/Using_math_functions)
- [`round()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/round)
- [`mod()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/mod)
- [`sin()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/sin)
- [CSS Values and Units Module Level 4 — W3C](https://www.w3.org/TR/css-values-4/)
