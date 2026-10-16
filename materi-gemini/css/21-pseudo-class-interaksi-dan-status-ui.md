# Pseudo-Class Interaksi dan Status UI (`:focus-visible`, `:focus-within`, `:target`, `:open`, `:modal`)

- **Tingkat:** Menengah
- **Ringkasan:** Menata elemen berdasarkan status interaksinya secara presisi menggunakan `:focus-visible`, `:focus-within`, penyorotan tautan jangkar `:target`, serta status `:open` dan `:modal` pada `<details>` dan `<dialog>`.

## Mengapa Status Interaksi Perlu Ditata dengan Cermat?

Antarmuka yang baik selalu memberi tahu pengguna **di mana ia berada** dan **apa yang sedang aktif**: tombol yang sedang difokuskan dengan papan ketik, bagian halaman yang baru saja dituju lewat tautan, atau dialog yang sedang terbuka. Semua status itu bisa ditata langsung dengan pseudo-class CSS tanpa menambah atau menghapus kelas lewat JavaScript. Pelajaran ini membahas lima di antaranya.

## 1. `:focus-visible`: Cincin Fokus Hanya Saat Dibutuhkan

`:focus` cocok setiap kali elemen menerima fokus, termasuk ketika pengguna mengeklik tombol dengan tetikus. Itu sebabnya banyak situs lama menulis `outline: none` demi menghilangkan cincin fokus yang dianggap mengganggu, dan akibatnya pengguna papan ketik kehilangan petunjuk posisi.

`:focus-visible` cocok **hanya ketika peramban menilai cincin fokus memang perlu ditampilkan**. Aturan praktisnya: fokus lewat papan ketik (`Tab`) hampir selalu cocok, sedangkan klik tetikus pada tombol atau tautan biasanya tidak. Pada kolom teks (`<input type="text">`, `<textarea>`), fokus tetap cocok walau lewat klik, karena pengguna perlu melihat tempat mengetik.

```css
/* Cincin fokus yang jelas dan konsisten untuk semua kontrol interaktif */
:where(a, button, input, select, textarea, summary):focus-visible {
  outline: 3px solid oklch(55% 0.2 255);
  outline-offset: 3px;
  border-radius: 0.25rem;
}
```

> **⚠️ Aturan Aksesibilitas:** Jangan pernah menghapus cincin fokus (`outline: none`) tanpa menggantinya dengan indikator lain yang jelas. WCAG 2.2 mensyaratkan fokus papan ketik terlihat (SC 2.4.7 *Focus Visible*). Dengan `:focus-visible`, Anda tidak perlu lagi pola lama `:focus { outline: none } :focus-visible { ... }`; cukup beri gaya pada `:focus-visible` saja dan biarkan gaya bawaan peramban untuk kasus lainnya.

`:focus-visible` berstatus **Baseline Widely Available** (lintas peramban sejak Maret 2022).

## 2. `:focus-within`: Menata Pembungkus Saat Anaknya Terfokus

`:focus-within` cocok pada elemen **yang dirinya sendiri atau salah satu keturunannya** sedang menerima fokus. Ini berguna untuk menyorot seluruh bingkai grup input, atau menampilkan menu yang berisi tautan saat salah satu tautannya difokuskan dengan papan ketik.

```css
.kotak-pencarian:focus-within {
  border-color: oklch(55% 0.2 255);
  box-shadow: 0 0 0 3px oklch(55% 0.2 255 / 0.2);
}

/* Menu tarik-turun juga terbuka lewat papan ketik, bukan hanya hover */
.menu-item:hover > .submenu,
.menu-item:focus-within > .submenu {
  display: block;
}
```

Menu yang hanya terbuka lewat `:hover` tidak bisa dipakai pengguna papan ketik; menambahkan `:focus-within` memperbaikinya.

## 3. `:target`: Menyorot Bagian yang Dituju Lewat Tautan Jangkar

Ketika URL berakhiran `#bab-2`, elemen dengan `id="bab-2"` menjadi **target** dokumen dan cocok dengan `:target`. Ini cocok untuk menyorot bagian yang baru dituju dari daftar isi.

```css
:target {
  /* Sorot sebentar agar pembaca tahu bagian mana yang dituju */
  animation: sorot 1.5s ease-out;
  /* Beri jarak agar tidak tertutup header sticky saat peramban menggulir ke sini */
  scroll-margin-block-start: 5rem;
}

@keyframes sorot {
  from { background-color: oklch(92% 0.12 95); }
  to   { background-color: transparent; }
}

@media (prefers-reduced-motion: reduce) {
  :target { animation: none; background-color: oklch(95% 0.06 95); }
}
```

## 4. `:open` dan `:modal`: Status `<details>` dan `<dialog>`

**`:modal`** cocok dengan elemen yang sedang tampil dalam keadaan *modal*, yaitu `<dialog>` yang dibuka dengan `showModal()` atau elemen yang sedang fullscreen. Dialog yang dibuka dengan `show()` (non-modal) **tidak** cocok dengan `:modal`, begitu pula dialog yang tertutup. `:modal` berstatus **Baseline Widely Available** (sejak September 2022).

**`:open`** cocok dengan elemen yang memiliki keadaan "terbuka": `<details>` yang terbuka, `<dialog>` yang terbuka, serta `<select>` atau `<input>` yang sedang menampilkan pemilihnya. Statusnya **Baseline Newly Available** sejak Mei 2026 (Chrome 133, Firefox 136, Safari 26.5), jadi untuk peramban lama gunakan atribut `[open]` sebagai cadangan:

```css
/* Pola aman untuk semua peramban: atribut [open] */
details[open] > summary {
  font-weight: 700;
}

/* Sintaks baru :open (peramban lama akan mengabaikan seluruh aturan ini) */
details:open > summary::marker {
  color: oklch(55% 0.2 255);
}

/* Dialog modal diberi bingkai berbeda dari dialog non-modal */
dialog:modal {
  border: 2px solid oklch(55% 0.2 255);
}
dialog:modal::backdrop {
  background-color: oklch(20% 0.03 250 / 0.6);
}
```

> **💡 Catatan:** `:popover-open` adalah padanan untuk elemen `[popover]` yang sedang ditampilkan (Baseline Newly Available sejak April 2024). Jika satu aturan gabungan berisi selektor yang tidak dikenali peramban, **seluruh aturan diabaikan**; karena itu tuliskan `:open` dalam aturan terpisah dari `[open]`, seperti pada contoh di atas.

## Kesalahan Umum dan Cara Menghindarinya

1. **`:focus { outline: none; }` tanpa pengganti.** Pengguna papan ketik tidak bisa tahu posisi fokus. Ganti dengan gaya `:focus-visible` yang jelas.
2. **Mengandalkan `:hover` saja untuk membuka menu.** Tambahkan `:focus-within` agar bisa dioperasikan dengan papan ketik.
3. **Menggabungkan `:open` dengan selektor lain dalam satu daftar yang dipisah koma.** Peramban yang belum mendukung `:open` akan membuang seluruh daftar, termasuk selektor lama yang sebenarnya valid.
4. **Menyangka `dialog:modal` cocok untuk setiap dialog yang terbuka.** Dialog yang dibuka dengan `show()` hanya memiliki atribut `open`, bukan keadaan modal.

## Latihan Praktik: Komponen yang Ramah Papan Ketik

Buatlah berkas `status-ui.html` dan `status.css`:
1. Beri semua tautan, tombol, dan kolom formulir cincin fokus melalui `:focus-visible` dengan `outline-offset`. Uji dengan menekan `Tab`, lalu klik tombol dengan tetikus dan bandingkan hasilnya.
2. Buat grup pencarian (ikon, `<input>`, dan tombol) yang bingkainya berubah warna dengan `.grup:focus-within`.
3. Buat daftar isi yang tautannya mengarah ke `#bagian-1` dan seterusnya, lalu sorot bagian tujuan dengan `:target` dan hormati `prefers-reduced-motion`.
4. Buat satu `<details>` dengan `details[open] > summary`, dan satu `<dialog>` yang bingkainya berbeda ketika dibuka dengan `showModal()` (`dialog:modal`) dibanding `show()`.

## Kuis Pemahaman

### Soal 1
Pengguna mengeklik sebuah `<button>` dengan tetikus. Pernyataan manakah yang paling tepat?
- A. Tombol itu biasanya cocok dengan `:focus`, tetapi umumnya tidak cocok dengan `:focus-visible`; fokus lewat papan ketik akan cocok dengan keduanya.
- B. Tombol itu cocok dengan `:focus-visible` tetapi tidak cocok dengan `:focus`.
- C. Tombol itu tidak cocok dengan `:focus` maupun `:focus-visible`.
- D. Tombol itu selalu cocok dengan `:focus-visible`, apa pun cara fokusnya.

**Jawaban Benar:** A
**Penjelasan:** `:focus-visible` hanya cocok bila peramban menilai indikator fokus perlu ditampilkan. Klik tetikus pada tombol biasanya tidak memicunya, sedangkan fokus lewat `Tab` memicunya. Elemen yang terfokus selalu cocok dengan `:focus`, sehingga opsi B dan C salah.

### Soal 2
Sebuah `<dialog>` dibuka dengan `dialog.show()` (bukan `showModal()`). Apa yang terjadi pada aturan `dialog:modal { border: 3px solid red; }`?
- A. Aturan tetap berlaku karena dialog sudah memiliki atribut `open`.
- B. Aturan berlaku karena `:modal` cocok untuk semua dialog yang terlihat.
- C. Aturan hanya berlaku jika dialog juga diberi `popover`.
- D. Aturan tidak berlaku, karena `:modal` hanya cocok untuk dialog yang dibuka dengan `showModal()` (atau elemen fullscreen).

**Jawaban Benar:** D
**Penjelasan:** `show()` membuka dialog non-modal. Dialog itu memang punya atribut `open` (dan cocok dengan `dialog[open]`), tetapi tidak berada dalam keadaan modal, sehingga `:modal` tidak cocok.

### Soal 3
Halaman dibuka dengan URL `materi.html#bab-2`. Elemen mana yang cocok dengan `:target`?
- A. Semua elemen yang memiliki atribut `id`.
- B. Tautan `<a href="#bab-2">` yang diklik pengguna.
- C. Elemen yang memiliki `id="bab-2"`.
- D. Elemen pertama pada halaman.

**Jawaban Benar:** C
**Penjelasan:** `:target` mencocokkan elemen yang `id`-nya sama dengan fragmen (bagian setelah `#`) pada URL dokumen yang sedang aktif, bukan tautan yang menuju ke sana.

## Sumber
- [`:focus-visible` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible)
- [`:focus-within` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-within)
- [`:target` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:target)
- [`:open` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:open)
- [`:modal` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:modal)
- [Understanding Success Criterion 2.4.7: Focus Visible — W3C WAI](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)
