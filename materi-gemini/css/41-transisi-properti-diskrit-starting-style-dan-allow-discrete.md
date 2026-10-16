# Menganimasikan `display: none` dan Elemen Top Layer dengan `@starting-style` serta `transition-behavior: allow-discrete`

- **Tingkat:** Lanjut
- **Ringkasan:** Menganimasikan kemunculan DAN penutupan elemen `<dialog>` serta `[popover]` dari/menuju `display: none` secara mulus murni dengan CSS menggunakan `@starting-style`, `transition-behavior: allow-discrete`, dan `overlay`.

## Mengapa Elemen yang `display: none` Sulit Dianimasikan?

Transisi CSS memerlukan dua hal: **nilai awal** dan **nilai akhir** yang bisa diinterpolasi. Pada elemen yang baru muncul (dari `display: none` atau baru ditambahkan ke DOM), peramban **tidak memiliki gaya sebelumnya** sehingga tidak ada yang bisa dianimasikan. Pada penutupan, `display: none` diterapkan seketika sehingga elemen lenyap sebelum sempat memudar. Dan `display` sendiri adalah properti **diskrit** (hanya punya nilai-nilai terpisah seperti `block` dan `none`, tidak ada nilai di antaranya).

Tiga fitur CSS modern memecahkan ketiga masalah itu:
- **`@starting-style`** menentukan gaya awal untuk transisi **masuk**.
- **`transition-behavior: allow-discrete`** mengizinkan properti diskrit seperti `display` ikut bertransisi.
- **`overlay`** menjaga elemen di **top layer** selama transisi **keluar**.

## 1. Transisi Masuk dengan `@starting-style`

`@starting-style` mendefinisikan gaya yang dipakai sebagai "keadaan sebelumnya" pada pembaruan gaya pertama elemen:

```css
.kartu-baru {
  opacity: 1;
  translate: 0 0;
  transition: opacity 300ms ease-out, translate 300ms ease-out;

  @starting-style {
    opacity: 0;
    translate: 0 1rem;       /* mulai transparan dan sedikit di bawah */
  }
}
```

Hasilnya, saat `.kartu-baru` ditambahkan ke DOM (atau berubah dari `display: none` ke tampil), ia memudar masuk dan bergeser ke atas, tanpa JavaScript tambahan. `@starting-style` berstatus **Baseline Newly Available** sejak Agustus 2024 (Chrome 117, Safari 17.5, Firefox 129).

## 2. Transisi Keluar: `allow-discrete`

Agar `display: none` tidak langsung memotong animasi penutupan, tambahkan `display` ke daftar transisi dengan kata kunci **`allow-discrete`**:

```css
.panel {
  opacity: 1;
  transition:
    opacity 250ms ease,
    display 250ms allow-discrete;   /* display ikut bertransisi */
}

.panel.tertutup {
  opacity: 0;
  display: none;
}
```

Perilaku properti diskrit: perubahan nilainya terjadi di **tengah-tengah** durasi atau di salah satu ujungnya. Khusus untuk `display`, peramban mengatur agar nilai yang membuat elemen **terlihat** (`block`, `flex`, dst.) berlaku selama seluruh transisi. Jadi `display: none` baru diterapkan **di akhir** transisi keluar, dan elemen yang memudar tetap terlihat sampai selesai. Sebaliknya saat muncul, `display` berubah ke nilai terlihat di **awal** transisi.

Dukungan: `transition-behavior: allow-discrete` didukung Chrome 117 dan Safari 17.4. Firefox 129 mendukungnya secara parsial; **transisi `display` belum didukung Firefox**, sehingga di sana elemen tetap lenyap seketika (tanpa animasi keluar, tetapi tetap berfungsi).

## 3. Elemen Top Layer: `<dialog>` dan `[popover]`

`<dialog>` yang dibuka dengan `showModal()` dan elemen `[popover]` berada di **top layer**, yaitu lapisan di atas seluruh konten halaman. Saat ditutup, peramban langsung mengeluarkannya dari top layer, sehingga animasi keluar terjadi tanpa gaya top layer. Properti **`overlay`** (yang hanya bisa bertransisi bersama `allow-discrete`) menjaga elemen tetap di top layer sampai transisi selesai:

```css
dialog {
  /* Keadaan tertutup */
  opacity: 0;
  scale: 0.95;
  transition:
    opacity 200ms ease,
    scale 200ms ease,
    display 200ms allow-discrete,
    overlay 200ms allow-discrete;   /* tetap di top layer selama animasi keluar */
}

/* Keadaan terbuka */
dialog[open] {
  opacity: 1;
  scale: 1;
}

/* Keadaan awal saat baru dibuka */
@starting-style {
  dialog[open] {
    opacity: 0;
    scale: 0.95;
  }
}

/* Latar belakang (backdrop) diperlakukan sama */
dialog::backdrop {
  background-color: transparent;
  transition:
    background-color 200ms ease,
    display 200ms allow-discrete,
    overlay 200ms allow-discrete;
}
dialog[open]::backdrop {
  background-color: oklch(20% 0.03 250 / 0.55);
}
@starting-style {
  dialog[open]::backdrop {
    background-color: transparent;
  }
}
```

Untuk popover, gunakan selektor `[popover]:popover-open` sebagai pengganti `dialog[open]`.

> **⚠️ Dukungan `overlay`:** Properti `overlay` saat ini hanya didukung peramban berbasis Chromium (Chrome 117+; di MDN statusnya **ketersediaan terbatas**). Di Firefox dan Safari, baris `overlay` diabaikan; transisi masuk tetap berjalan (Safari bahkan mendukung transisi `display`), tetapi animasi keluar bisa tidak tampil atau tampil di luar top layer. Perlakukan animasi keluar sebagai **peningkatan progresif**: dialog harus tetap berfungsi penuh tanpa animasi.

## 4. Hormati Preferensi Gerakan

```css
@media (prefers-reduced-motion: reduce) {
  dialog,
  dialog::backdrop {
    transition-duration: 1ms;
  }
}
```

## Kesalahan Umum dan Cara Menghindarinya

1. **Menulis `display: none` di akhir transisi tanpa `allow-discrete`.** Elemen langsung lenyap; animasi keluar tidak terlihat.
2. **Lupa `@starting-style` untuk animasi masuk.** Tanpa gaya awal, elemen yang baru tampil langsung berada di keadaan akhir.
3. **Mengandalkan `overlay` di semua peramban.** Properti ini baru ada di Chromium; rancang fallback.
4. **Menaruh `@starting-style` sebelum aturan keadaan akhir.** Aturan di dalam `@starting-style` ikut diproses oleh kaskade seperti aturan biasa (spesifisitas dan urutan), jadi tulis setelah aturan keadaan akhir dengan selektor yang sama spesifiknya agar tidak dikalahkan.
5. **Mengganggu pengguna yang peka gerakan.** Sediakan `prefers-reduced-motion`.

## Latihan Praktik: Dialog dengan Animasi Masuk dan Keluar

Buatlah berkas `dialog-animasi.html` dan `dialog.css`:
1. Buat `<dialog>` dengan tombol buka (`showModal()`) dan tutup (`close()`).
2. Animasikan kemunculan dengan `@starting-style` dan penutupan dengan `display ... allow-discrete` dan `overlay ... allow-discrete`.
3. Animasikan `::backdrop` dengan cara yang sama.
4. Uji di Chrome dan Firefox atau Safari. Catat perbedaan perilakunya, dan pastikan dialog tetap berfungsi tanpa animasi di peramban yang tidak mendukung.
5. Tambahkan pengaturan `prefers-reduced-motion`.

## Kuis Pemahaman

### Soal 1
Mengapa `@starting-style` diperlukan agar elemen yang baru muncul dapat bertransisi?
- A. Karena elemen yang baru tampil tidak memiliki gaya sebelumnya sehingga tidak ada nilai awal untuk transisi; `@starting-style` menyediakan nilai awal tersebut.
- B. Karena `transition` tidak bekerja pada `opacity`.
- C. Karena `@starting-style` mengunduh gaya dari server.
- D. Karena `display: block` selalu menimpa `transition`.

**Jawaban Benar:** A
**Penjelasan:** Transisi memerlukan nilai sebelum-perubahan. Pada elemen yang baru tampil atau baru ditambahkan, nilai itu tidak ada; `@starting-style` mendefinisikannya.

### Soal 2
Apa efek `display 250ms allow-discrete` pada elemen yang berubah dari `display: block` menjadi `display: none` dalam transisi bersama `opacity`?
- A. Elemen langsung lenyap sebelum `opacity` bertransisi.
- B. `display: none` baru diterapkan di akhir transisi, sehingga elemen tetap terlihat selama `opacity` memudar.
- C. Elemen menjadi `display: flex`.
- D. Transisi `opacity` dibatalkan.

**Jawaban Benar:** B
**Penjelasan:** Untuk `display`, nilai yang membuat elemen terlihat dipertahankan selama transisi; peralihan ke `none` ditunda hingga akhir. Dengan demikian animasi keluar sempat terlihat sebelum elemen disembunyikan.

### Soal 3
Mengapa animasi keluar `<dialog>` sebaiknya dianggap peningkatan progresif?
- A. Karena `<dialog>` tidak bisa ditutup dengan `close()`.
- B. Karena `overlay` (yang menjaga elemen di top layer selama transisi) baru didukung Chromium, dan transisi `display` belum didukung Firefox.
- C. Karena `@starting-style` dihapus dari spesifikasi.
- D. Karena animasi keluar membuat dialog tidak aksesibel di semua peramban.

**Jawaban Benar:** B
**Penjelasan:** Dukungan fitur-fitur ini belum merata: `overlay` hanya di Chromium dan transisi `display` belum ada di Firefox. Dialog tetap harus berfungsi tanpa animasi di peramban tersebut.

## Sumber
- [`@starting-style` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@starting-style)
- [`transition-behavior` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transition-behavior)
- [`overlay` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overlay)
- [CSS Transitions Level 2 — W3C](https://www.w3.org/TR/css-transitions-2/)
