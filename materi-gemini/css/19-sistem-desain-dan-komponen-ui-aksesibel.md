# Merancang Sistem Desain (Design System) dan Komponen UI Aksesibel Tanpa Framework

- **Tingkat:** Lanjut
- **Ringkasan:** Menyusun fondasi *Design System* yang terukur menggunakan skala token tiga tingkat (primitif, semantik, komponen), tipografi dan spasi harmonis, serta pola CSS produksi untuk komponen Tombol, Lencana (*Badge*), Kartu, dan Jendela Modal.

## Apa Itu Design System di Dalam CSS?

Ketika Anda membangun lebih dari satu halaman web (seperti 23 kelas berbeda di Kodeloka yang semuanya berbagi `assets/learning.css` dan `assets/article.css`), Anda membutuhkan bahasa visual yang konsisten. **Design System** di tingkat CSS bukan berarti membuat ribuan kelas utilitas acak, melainkan mendefinisikan **Token Desain yang Terstruktur** dan **Komponen Dasar yang Dapat Dipakai Ulang**.

## 1. Arsitektur Token Tiga Lapis (*Three-Tier Token Architecture*)

Jangan langsung menempelkan nilai warna mentah pada komponen! Bagi variabel CSS Anda ke dalam tiga lapisan yang saling merujuk:

```css
:root {
  color-scheme: light dark;

  /* === LAPIS 1: TOKEN PRIMITIF (Palet Mentah & Skala Angka) === */
  --palet-biru-500:   oklch(58% 0.20 255);
  --palet-biru-600:   oklch(50% 0.20 255);
  --palet-netral-50:  oklch(98% 0.005 250);
  --palet-netral-100: oklch(94% 0.010 250);
  --palet-netral-800: oklch(24% 0.020 250);
  --palet-netral-900: oklch(16% 0.015 250);

  /* === LAPIS 2: TOKEN SEMANTIK (Berdasarkan Peran/Maksud di Antarmuka) === */
  --permukaan-halaman: light-dark(var(--palet-netral-50),  var(--palet-netral-900));
  --permukaan-kartu:   light-dark(#ffffff,                 var(--palet-netral-800));
  --teks-utama:        light-dark(var(--palet-netral-900), var(--palet-netral-50));
  --aksen-interaktif:  var(--palet-biru-500);
  --aksen-sorot:       var(--palet-biru-600);

  /* Skala Spasi Proporsional (Kelipatan 4px / 0.25rem) */
  --ruang-1: 0.25rem; /* 4px */
  --ruang-2: 0.5rem;  /* 8px */
  --ruang-3: 0.75rem; /* 12px */
  --ruang-4: 1rem;    /* 16px */
  --ruang-6: 1.5rem;  /* 24px */
  --ruang-8: 2rem;    /* 32px */
}
```

Mengapa memisahkan Lapis 1 (Primitif) dan Lapis 2 (Semantik)?
Karena di dalam kode komponen, Anda hanya menulis `background-color: var(--permukaan-kartu);`. Jika suatu saat tim desain ingin mengubah nuansa mode gelap atau mengganti warna merek utama dari biru menjadi ungu zamrud, Anda cukup mengubah nilai di Lapis 2 tanpa menyentuh ratusan baris komponen!

## 2. Pola Komponen Tombol Multi-Varian yang Tangguh (`.tombol`)

Sebuah komponen tombol produksi harus:
1. Bekerja konsisten baik saat dipasang pada `<button>` maupun `<a class="tombol">`.
2. Memiliki ukuran target sentuh minimal **`2.5rem` (`40px`)** agar ramah jari di layar ponsel (memenuhi syarat WCAG 2.2 Target Size).
3. Mendukung ikon SVG di kiri atau kanan teks dengan sejajar sempurna (`inline-flex`).
4. Memiliki varian warna dan ukuran cukup lewat pengubahan variabel lokal (**Lapis 3: Token Komponen**)!

```css
.tombol {
  /* Token Komponen Lokal (Bawaan: Varian Sekunder/Netral) */
  --btn-latar: var(--permukaan-kartu);
  --btn-teks: var(--teks-utama);
  --btn-batas: oklch(80% 0.01 250);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ruang-2);
  min-block-size: 2.5rem;
  padding-block: var(--ruang-2);
  padding-inline: var(--ruang-4);
  border: 1px solid var(--btn-batas);
  border-radius: 0.5rem;
  background-color: var(--btn-latar);
  color: var(--btn-teks);
  font-weight: 600;
  font-size: 0.9375rem;
  line-height: 1.2;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  transition: background-color 150ms ease, translate 120ms ease;

  &:hover:not(:disabled) {
    background-color: color-mix(in oklch, var(--btn-latar), var(--teks-utama) 8%);
  }

  &:active:not(:disabled) {
    translate: 0 1px;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  /* Varian Tombol Utama cukup mengubah 3 variabel lokalnya! */
  &.tombol--utama {
    --btn-latar: var(--aksen-interaktif);
    --btn-teks: #ffffff;
    --btn-batas: transparent;

    &:hover:not(:disabled) {
      background-color: var(--aksen-sorot);
    }
  }
}
```

## 3. Menata Jendela Modal `<dialog>` dan Transisi `@starting-style`

Saat Anda membuka `<dialog>` dengan `showModal()`, bagaimana cara menganimasikan kemunculannya dari transparan/kecil menjadi penuh secara mulus dengan CSS?

Gunakan at-rule modern **`@starting-style`** (status **Baseline Newly Available** sejak 2024) yang mendefinisikan nilai awal sebuah elemen tepat pada bingkai pertama saat ia berubah dari `display: none` menjadi tampil di layar:

```css
dialog {
  border: 1px solid oklch(80% 0.01 250 / 0.4);
  border-radius: 0.875rem;
  padding: var(--ruang-6);
  max-inline-size: min(92vw, 32rem);
  background-color: var(--permukaan-kartu);
  color: var(--teks-utama);
  box-shadow: 0 20px 40px -15px rgb(0 0 0 / 0.25);

  opacity: 1;
  scale: 1;
  transition: opacity 200ms ease-out, scale 200ms ease-out;

  /* Kondisi awal tepat saat dialog.showModal() baru saja dipanggil */
  @starting-style {
    opacity: 0;
    scale: 0.95;
  }

  &::backdrop {
    background-color: rgb(15 23 42 / 0.55);
    backdrop-filter: blur(3px);
  }
}
```

## Latihan Praktik: Membangun Pustaka Komponen Mini (UI Kit)

Buatlah berkas `ui-kit.html` dan `ui-kit.css` yang menampilkan halaman dokumentasi komponen berisi:
1. Lapis 1 & Lapis 2 token desain di `:root`.
2. Tiga variasi `.tombol` (Standar, `.tombol--utama`, `.tombol--bahaya`, serta keadaan `:disabled`) yang menyertakan ikon `<svg>` di dalamnya.
3. Komponen `<dialog>` yang dianimasikan kemunculannya dengan `@starting-style`.

## Kuis Pemahaman

### Soal 1
Mengapa dalam arsitektur sistem desain kita memisahkan **Token Primitif** (seperti `--biru-500: oklch(58% 0.2 255)`) dari **Token Semantik** (seperti `--warna-aksen-utama: var(--biru-500)` dan `--permukaan-kartu`)?
- A. Karena CSS tidak mengizinkan fungsi `oklch()` dipakai langsung pada kelas komponen.
- B. Agar komponen hanya bergantung pada makna peran visualnya (`--permukaan-kartu`, `--teks-utama`), sehingga penerapan tema gelap/terang atau perubahan identitas warna merek di masa depan cukup dilakukan dengan memperbarui pemetaan di tingkat Token Semantik tanpa harus mencari dan mengubah ratusan selektor komponen satu per satu.
- C. Karena variabel yang merujuk variabel lain (`var(--a)`) berjalan dua kali lebih cepat.
- D. Agar nama variabel tidak bisa dibaca di DevTools.

**Jawaban Benar:** B
**Penjelasan:** Pemisahan token primitif (*nilai apa*) dan token semantik (*dipakai untuk peran apa*) adalah kunci skalabilitas sistem desain: komponen tetap bersih dan agnostik terhadap tema, sementara logika warna terpusat di lapisan token semantik.

### Soal 2
Masalah klasik apa yang diselesaikan oleh at-rule `@starting-style` di CSS modern?
- A. Mengatur gaya huruf pertama pada paragraf pembuka artikel.
- B. Memungkinkan peramban menjalankan transisi CSS (`transition`) saat sebuah elemen baru saja ditambahkan ke DOM atau baru saja berubah dari `display: none` menjadi tampil (seperti saat `<dialog>` atau `[popover]` dibuka), dengan mendefinisikan nilai awal transisi tersebut.
- C. Memuat berkas CSS sebelum berkas HTML diunduh.
- D. Mereset seluruh margin bawaan peramban.

**Jawaban Benar:** B
**Penjelasan:** Dulu, elemen yang baru muncul dari `display: none` tidak memiliki "nilai bingkai sebelumnya" (*before-change style*) sehingga `transition` tidak dapat berjalan. `@starting-style` menetapkan gaya awal tempat transisi dimulai ketika elemen pertama kali ditampilkan.

### Soal 3
Mengapa pada komponen `.tombol` kita menambahkan `:hover:not(:disabled)` alih-alih hanya `:hover`?
- A. Agar tombol berubah warna menjadi merah saat dinonaktifkan.
- B. Agar efek perubahan warna sorotan (*hover*) tidak aktif ketika tombol sedang dalam keadaan mati (`disabled`), sehingga tidak memberi kesan keliru kepada pengguna bahwa tombol yang mati tersebut masih bisa diklik.
- C. Karena pseudo-class `:hover` tidak valid pada elemen `<button>`.
- D. Agar tombol otomatis hilang saat dinonaktifkan.

**Jawaban Benar:** B
**Penjelasan:** Tombol yang memiliki atribut `disabled` tidak boleh merespons sorotan tetikus dengan efek perubahan warna atau gerakan naik-turun seolah-olah aktif. Menggabungkan `:hover:not(:disabled)` memastikan umpan balik visual hanya muncul pada tombol yang benar-benar siap diklik.

## Sumber
- [CSS custom properties for cascading variables — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables)
- [Organizing your CSS — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Organizing)
- [What's New in WCAG 2.2 (Target Size) — W3C WAI](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
