# Transisi, Transformasi, Animasi `@keyframes`, dan Performa 60fps

- **Tingkat:** Menengah
- **Ringkasan:** Menghidupkan antarmuka secara halus menggunakan properti `transform` individual (`translate`, `scale`, `rotate`), `transition`, dan `@keyframes`, memahami mengapa hanya `transform` dan `opacity` yang ramah GPU, serta menghormati preferensi aksesibilitas `prefers-reduced-motion`.

## Mengapa Gerakan di Antarmuka Harus Memiliki Tujuan?

Transisi dan animasi yang baik bukanlah hiasan yang memperlambat pengguna, melainkan umpan balik visual yang menjelaskan **apa yang baru saja terjadi**: tombol yang sedikit terangkat saat disorot, panel samping yang bergeser masuk dari tepi layar, atau indikator pemuatan (*spinner*) yang memberitahu bahwa permintaan jaringan sedang diproses.

## 1. Transformasi Ruang dengan `transform` dan Properti Individual Modern

Properti `transform` memungkinkan Anda menggeser, memperbesar/memperkecil, atau memutar sebuah elemen **tanpa memengaruhi posisi elemen-elemen tetangga di sekitarnya** (tidak memicu perhitungan ulang tata letak!).

Sejak peramban modern mendukung properti transformasi individual (status **Baseline Widely Available**), Anda kini dapat menulis **`translate`**, **`scale`**, dan **`rotate`** secara terpisah ataupun menggunakan fungsi `transform` klasik:

```css
.kartu-interaktif {
  /* Properti individual memudahkan kita mengubah satu aspek tanpa menimpa yang lain */
  translate: 0 0;
  scale: 1;
  transition: translate 200ms cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 200ms ease;
}

.kartu-interaktif:hover {
  /* Geser ke atas sejauh 4px saat disorot */
  translate: 0 -4px;
  box-shadow: 0 12px 24px -6px rgb(15 23 42 / 0.12);
}

.ikon-putar {
  /* Putar 45 derajat dengan titik poros di tengah (transform-origin: center) */
  rotate: 45deg;
}
```

## 2. Transisi Halus Antar-Status dengan `transition`

`transition` membuat perubahan nilai properti dari satu kondisi ke kondisi lain (misalnya dari keadaan normal ke `:hover` atau `:focus-visible`) berlangsung secara bertahap selama durasi tertentu.

Empat sub-properti dari `transition`:
1. **`transition-property`:** Properti mana yang ingin dianimasikan (misalnya `transform`, `opacity`, `background-color`).
2. **`transition-duration`:** Durasi waktu (misalnya `150ms` atau `0.2s` — untuk antarmuka pengguna, durasi `150ms` hingga `250ms` terasa paling sigap!).
3. **`transition-timing-function`:** Kurva percepatan gerak (misalnya `ease`, `ease-out`, `linear`, atau kurva kustom `cubic-bezier(...)`).
4. **`transition-delay`:** Waktu tunda sebelum transisi dimulai.

> **🚫 Larangan Performa: Jangan Pernah Menulis `transition: all 0.3s`!**
> Menulis `transition: all` adalah kebiasaan buruk karena:
> 1. Memaksa peramban memeriksa dan menganimasikan **setiap properti** yang berubah (termasuk `width`, `padding`, `margin` saat ukuran jendela layar diubah pengguna), sehingga membuat peramban terasa berat dan patah-patah.
> 2. Sebutkan secara eksplisit hanya properti yang memang ingin Anda transisikan:
>    `transition: transform 200ms ease-out, opacity 200ms ease-out, background-color 150ms ease;`

## 3. Rahasia Animasi 60fps: Mengapa Hanya `transform` dan `opacity` yang Murah?

Ingat kembali tahapan **Critical Rendering Path** dari Pelajaran 01 HTML:
`DOM + CSSOM -> Render Tree -> Layout (Reflow) -> Paint (Repaint) -> Composite (GPU)`

1. **Menganimasikan `width`, `height`, `top`, `left`, atau `margin` (SANGAT BERAT):**
   Pada setiap bingkai gambar (*60 kali per detik* atau setiap `16,6 ms`), peramban terpaksa menghitung ulang ukuran dan posisi seluruh elemen tetangga di halaman (**Layout / Reflow**), menggambar ulang pikselnya (**Paint**), lalu mengirimkannya ke GPU. Pada perangkat ponsel kelas menengah ke bawah, animasi ini akan terlihat tersendat (*janky*).
2. **Menganimasikan `transform` (`translate`, `scale`, `rotate`) dan `opacity` (SANGAT CEPAT):**
   Kedua properti ini **melewati tahap Layout dan Paint sepenuhnya**! Peramban cukup menyerahkan lapisan tekstur elemen ke **GPU (Compositor Thread)** untuk digeser, diubah skalanya, atau diatur ketembusannya dengan mulus pada 60fps–120fps, bahkan ketika utas utama JavaScript sedang sibuk!

```css
/* BURUK: Menggeser elemen dengan menganimasikan 'left' или 'margin-left' (memicu Layout tiap frame!) */
.geser-lambat {
  position: relative;
  left: 0;
  transition: left 250ms ease;
}
.geser-lambat:hover {
  left: 12px;
}

/* LEBIH BAIK: Menggeser elemen dengan 'translate' / 'transform' (ditangani langsung oleh GPU Compositor) */
.geser-cepat {
  translate: 0 0;
  transition: translate 250ms ease-out;
}
.geser-cepat:hover {
  translate: 12px 0;
}
```

## 4. Animasi Multi-Tahap dengan `@keyframes` dan Menghormati `prefers-reduced-motion`

Berbeda dengan `transition` yang membutuhkan pemicu perubahan status (seperti `:hover`), **`@keyframes`** dan properti **`animation`** memungkinkan Anda membuat urutan gerakan multi-tahap atau berulang (seperti indikator pemuatan data atau efek denyut halus):

```css
@keyframes putar-penuh {
  from {
    rotate: 0deg;
  }
  to {
    rotate: 360deg;
  }
}

.indikator-memuat {
  inline-size: 1.5rem;
  block-size: 1.5rem;
  border: 3px solid #e2e8f0;
  border-block-start-color: #2563eb;
  border-radius: 50%;
  animation: putar-penuh 0.8s linear infinite;
}
```

### Kewajiban Aksesibilitas: `@media (prefers-reduced-motion: reduce)`
Bagi sebagian pengguna yang memiliki gangguan vestibular (vertigo, migrain, atau mabuk gerak visual), animasi geser, perbesaran skala, dan efek paralaks dapat memicu pusing atau mual fisik yang nyata. Mereka mengaktifkan opsi *"Reduce Motion"* di pengaturan sistem operasi mereka.

Sebagai pengembang yang bertanggung jawab, selalu tambahkan aturan perlindungan ini di berkas CSS Anda:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

> **💡 Mengapa `0.01ms` dan Bukan `0s` atau `none`?**
> Sebagian kode JavaScript mungkin menunggu event `transitionend` atau `animationend` untuk menjalankan langkah berikutnya. Dengan mengatur durasi menjadi `0.01ms` (nyaris instan dan tidak terlihat bergerak oleh mata), gerakan visual dihentikan tetapi event JavaScript `transitionend` tetap terpanggil dengan aman!

## Latihan Praktik: Membuat Tombol Interaktif dan Skeleton Loader yang Ramah Aksesibilitas

Buatlah berkas `animasi-gpu.html` dan `animasi.css` yang berisi:
1. Sebuah tombol `.tombol-aksi` yang bergeser naik `2px` saat `:hover` dan kembali turun saat `:active` menggunakan properti `translate` dengan durasi `150ms`.
2. Sebuah indikator *skeleton loading* yang menganimasikan `opacity` dari `1` ke `0.4` secara bolak-balik (`alternate infinite`) menggunakan `@keyframes`.
3. Blok `@media (prefers-reduced-motion: reduce)` yang mematikan gerakan bagi pengguna yang mengaktifkan pengurangan gerak.

## Kuis Pemahaman

### Soal 1
Mengapa menganimasikan properti `transform` (atau `translate`/`scale`) dan `opacity` jauh lebih hemat performa dibandingkan menganimasikan properti `width`, `height`, atau `top`?
- A. Karena `transform` dan `opacity` hanya bekerja pada gambar berformat SVG.
- B. Karena perubahan pada `transform` dan `opacity` tidak mengubah geometri ruang elemen lain di halaman, sehingga peramban dapat melewati tahap *Layout* dan *Paint* lalu menyerahkan perenderannya langsung ke *Compositor Thread* (GPU).
- C. Karena `width` dan `height` tidak dapat ditulis di dalam berkas CSS eksternal.
- D. Karena `transform` otomatis memperkecil ukuran berkas HTML.

**Jawaban Benar:** B
**Penjelasan:** Mengubah `width`, `height`, atau `top` memaksa peramban menghitung ulang posisi elemen tetangga (*Layout/Reflow*) dan menggambar ulang piksel (*Paint*) di setiap frame. Sebaliknya, `transform` dan `opacity` diproses langsung pada lapisan *compositor* GPU tanpa mengganggu tata letak dokumen.

### Soal 2
Mengapa penulisan `transition: all 0.3s ease;` dianggap sebagai anti-pola (*anti-pattern*) dalam pengembangan CSS?
- A. Karena kata kunci `all` sudah dihapus dari spesifikasi CSS.
- B. Karena `all` memaksa peramban memantau dan menganimasikan setiap perubahan properti yang tidak disengaja (termasuk perubahan ukuran kotak saat jendela layar diubah), yang membebani performa dan menimbulkan efek visual yang tidak diinginkan.
- C. Karena `transition: all` membuat tombol tidak dapat diklik dengan papan ketik.
- D. Karena durasi `0.3s` terlalu cepat untuk dilihat mata manusia.

**Jawaban Benar:** B
**Penjelasan:** Dengan menyebutkan nama properti secara spesifik (misalnya `transition: translate 150ms ease, background-color 150ms ease`), Anda mencegah transisi yang tidak disengaja pada properti tata letak sekaligus menjaga efisiensi perenderan peramban.

### Soal 3
Apa tujuan penggunaan `@media (prefers-reduced-motion: reduce)` di dalam stylesheet aplikasi web?
- A. Mengurangi pemakaian baterai ketika kapasitas baterai perangkat di bawah 10%.
- B. Menghormati pengaturan aksesibilitas sistem operasi pengguna yang sensitif terhadap gerakan layar (seperti penderita gangguan vestibular/vertigo) dengan meminimalkan atau menonaktifkan animasi dan guliran otomatis.
- C. Memperlambat kecepatan animasi menjadi dua kali lebih lama agar mudah diamati.
- D. Mematikan pemutaran suara pada elemen `<audio>`.

**Jawaban Benar:** B
**Penjelasan:** Fitur media `prefers-reduced-motion: reduce` mendeteksi apakah pengguna telah meminta pengurangan gerakan animasi di tingkat sistem operasi demi kenyamanan dan kesehatan visual mereka.

## Sumber
- [CSS animations — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Animations)
- [CSS transitions — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transitions)
- [Interaction to Next Paint (INP) — web.dev](https://web.dev/articles/inp)
