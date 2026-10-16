# Menata Formulir dan Tabel Modern (`accent-color`, `appearance`, `:focus-within`, Sticky Table)

- **Tingkat:** Menengah
- **Ringkasan:** Menata ulang kontrol formulir secara konsisten dan aksesibel menggunakan `accent-color`, `caret-color`, `appearance: none`, `:focus-within`, `:placeholder-shown`, `field-sizing: content`, serta merancang tabel data dengan kepala menempel (*sticky header*).

## Mengapa Kontrol Formulir Terkenal Sulit Ditata di Masa Lalu?

Elemen formulir seperti `<input type="checkbox">`, `<input type="radio">`, `<input type="range">`, `<progress>`, dan `<select>` dulunya digambar langsung menggunakan widget bawaan sistem operasi (*native OS controls*), sehingga pengembang kesulitan menyelaraskan warnanya dengan identitas warna merek situs.

Kini, CSS modern menyediakan properti khusus yang membuat penataan formulir menjadi jauh lebih bersih tanpa mengorbankan aksesibilitas papan ketik!

## 1. Mengubah Warna Kontrol Bawaan dalam Satu Baris dengan `accent-color`

Properti **`accent-color`** (di MDN berstatus *Limited availability*: Chrome untuk Android dan Safari sebelum 26.2 belum menjaga kontras minimum kontrol) memungkinkan Anda mengubah warna centang pada `<input type="checkbox">`, bulatan `<input type="radio">`, batang `<input type="range">`, dan `<progress>` cukup dengan **satu baris deklarasi**—dan peramban desktop umumnya otomatis memilih warna tanda centang (putih atau hitam) yang kontras dengan warna aksen pilihan Anda. Namun Chrome untuk Android dan Safari sebelum 26.2 tidak menjamin kontras minimum tersebut, jadi tetap pilih warna aksen yang cukup kontras!

```css
:root {
  /* Seluruh checkbox, radio, range slider, dan progress bar otomatis mengikuti warna merek! */
  accent-color: oklch(55% 0.2 255);
}

/* Mengubah warna kursor ketik (blinking caret) di dalam input dan textarea */
input,
textarea {
  caret-color: oklch(55% 0.2 255);
}

/* Membatasi agar textarea hanya boleh ditarik ukurannya secara vertikal (atas-bawah),
   sehingga tidak merusak lebar kolom formulir saat ditarik pengguna! */
textarea {
  resize: vertical;
  min-block-size: 6rem;
}
```

> **💡 Fitur Progresif Baru: `field-sizing: content` pada `<textarea>`!**
> Menambahkan `field-sizing: content;` pada `<textarea>` (didukung Chrome/Edge sejak versi 123, Safari 26.2, dan Firefox 152; Baseline Newly Available sejak Juni 2026, peramban lama mengabaikannya) membuat tinggi kotak teks **otomatis membesar dan menyusut mengikuti jumlah baris yang diketikkan pengguna** tanpa memerlukan satu baris JavaScript pun! Tetap pasangkan dengan `min-block-size: 4rem` dan `max-block-size: 20rem` sebagai batas aman.

## 2. Kustomisasi Penuh Checkbox/Radio dengan `appearance: none`

Jika Anda membutuhkan bentuk kotak centang atau saklar geser (*toggle switch*) yang benar-benar kustom, **jangan menyembunyikan `<input type="checkbox">` dengan `display: none`!** (Karena `display: none` membuat kotak centang tidak bisa lagi difokuskan dengan tombol `Tab` di papan ketik!).

Sebagai gantinya, gunakan **`appearance: none`** langsung pada elemen `<input type="checkbox">` sehingga perilaku asli, fokus papan ketik, dan pembacaannya di *screen reader* tetap utuh 100%, sementara Anda bebas menata kotak visualnya dengan CSS:

```css
input[type="checkbox"].kotak-kustom {
  appearance: none;
  margin: 0;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border: 2px solid #64748b;
  border-radius: 0.25rem;
  display: grid;
  place-content: center;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease;

  &::before {
    content: "";
    inline-size: 0.65rem;
    block-size: 0.65rem;
    scale: 0;
    transition: scale 120ms ease-in-out;
    background-color: #ffffff;
    /* Membentuk tanda centang tajam dengan clip-path */
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }

  &:checked {
    background-color: #2563eb;
    border-color: #2563eb;
  }

  &:checked::before {
    scale: 1;
  }

  &:focus-visible {
    outline: 3px solid #93c5fd;
    outline-offset: 2px;
  }
}
```

## 3. Pseudo-Class Formulir Interaktif: `:focus-within`, `:placeholder-shown`, dan `:disabled`

- **`:focus-within`:** Cocok pada sebuah elemen pembungkus (misalnya `.kotak-pencarian` atau `<form>`) apabila **salah satu elemen anak di dalamnya sedang menerima fokus**! Sangat berguna untuk menyorot seluruh bingkai grup input yang memiliki ikon di kiri dan tombol hapus di kanan.
- **`:placeholder-shown`:** Cocok ketika `<input>` masih kosong dan sedang menampilkan teks `placeholder`-nya (sering dipakai untuk membuat efek *floating label* murni CSS).
- **`:disabled` dan `:read-only`:** Menata tampilan input yang sedang dikunci.

```css
/* Menyorot pembungkus kotak pencarian saat input di dalamnya diklik/difokuskan */
.pembungkus-cari {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 0.5rem;

  &:focus-within {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgb(37 99 235 / 0.15);
  }
}
```

## 4. Menata Tabel Data Profesional dengan *Sticky Header* dan *Zebra Striping*

Untuk tabel data yang memiliki puluhan baris dan kolom angka:

```css
.wadah-tabel {
  max-block-size: 28rem;
  overflow: auto;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.tabel-data {
  inline-size: 100%;
  border-collapse: collapse;
  text-align: start;
  font-size: 0.9375rem;

  & th,
  & td {
    padding: 0.75rem 1rem;
    border-block-end: 1px solid #e2e8f0;
  }

  /* Membuat baris judul kolom tetap menempel di bagian atas saat tabel digulir! */
  & thead th {
    position: sticky;
    inset-block-start: 0;
    z-index: 2;
    background-color: #f8fafc;
    font-weight: 600;
    box-shadow: inset 0 -1px 0 #cbd5e1;
  }

  /* Zebra striping: memberi warna latar selang-seling pada baris genap di tbody */
  & tbody tr:nth-child(even) {
    background-color: #f8fafc;
  }

  /* Perataan kanan dan angka tabular khusus untuk kolom numerik */
  & .kolom-angka {
    text-align: end;
    font-variant-numeric: tabular-nums;
  }
}
```

> **⚠️ Catatan Teknis `position: sticky` pada Tabel:**
> Sebaiknya jangan memasang `position: sticky` pada elemen `<thead>` atau `<tr>` (dukungannya secara historis tidak konsisten antar-peramban), melainkan pasang langsung pada elemen **`<th>` di dalam `<thead>`** (`thead th { position: sticky; top: 0; }`) dan berikan `background-color` yang solid agar teks baris di bawahnya tidak tembus membayang saat digulir!

## Latihan Praktik: Formulir Pengaturan Akun dan Tabel Riwayat Transaksi

Buatlah berkas `form-dan-tabel.html` serta `form-tabel.css`:
1. Buat grup kotak pencarian dengan ikon SVG yang menggunakan `:focus-within` pada pembungkusnya.
2. Buat daftar pengaturan notifikasi dengan `<input type="checkbox" class="kotak-kustom">` berbasis `appearance: none`.
3. Buat tabel riwayat pembayaran dengan `thead th` yang `sticky`, baris belang `:nth-child(even)`, dan kolom nominal uang yang rata kanan dengan `tabular-nums`.

## Kuis Pemahaman

### Soal 1
Mengapa saat membuat tampilan kotak centang (*checkbox*) kustom di CSS, penggunaan `appearance: none` pada `<input type="checkbox">` jauh lebih baik dibandingkan menyembunyikan `<input>` tersebut dengan `display: none`?
- A. Karena `display: none` tidak berfungsi pada elemen `<input>`.
- B. Karena `display: none` mengeluarkan `<input>` dari urutan fokus papan ketik (`Tab`) dan *Accessibility Tree* pembaca layar; sedangkan `appearance: none` hanya menghapus tampilan visual bawaan sistem operasi sambil mempertahankan seluruh interaksi papan ketik (`Tab` dan `Space`), validasi form, dan aksesibilitas bawaan.
- C. Karena `appearance: none` otomatis mengirim data tanpa tombol submit.
- D. Karena `display: none` mengubah tipe input menjadi `text`.

**Jawaban Benar:** B
**Penjelasan:** Dengan `appearance: none`, elemen `<input type="checkbox">` tetap merupakan kotak centang HTML asli yang dapat difokuskan, ditekan dengan tombol Spasi, dan dikenali oleh pembaca layar, namun kanvas visualnya siap ditata sepenuhnya dengan CSS dan `::before`.

### Soal 2
Pada elemen manakah properti `position: sticky; inset-block-start: 0;` sebaiknya dipasang agar kepala tabel tetap menempel di bagian atas ketika wadah tabel digulir?
- A. Pada elemen `<table>`.
- B. Langsung pada elemen sel kepala `thead th` (disertai `background-color` yang tidak transparan).
- C. Pada elemen `<caption>`.
- D. Pada elemen `<tfoot>`.

**Jawaban Benar:** B
**Penjelasan:** Dalam spesifikasi perenderan tabel di peramban, menerapkan `position: sticky; top: 0;` langsung pada sel `thead th` adalah cara yang paling konsisten lintas peramban untuk menjaga judul kolom tetap menempel saat isi `<tbody>` digulir.

### Soal 3
Apa fungsi dari pseudo-class `:focus-within` ketika dipasang pada elemen `<div class="grup-input">`?
- A. Memfokuskan semua input di dalam `<div>` secara bersamaan saat halaman dibuka.
- B. Menerapkan gaya pada `.grup-input` ketika elemen `.grup-input` itu sendiri **atau salah satu elemen anak/keturunan di dalamnya** (seperti `<input>` atau `<button>`) sedang menerima fokus.
- C. Mengunci fokus agar pengguna tidak bisa keluar dari `.grup-input`.
- D. Menghapus cincin fokus pada elemen anak.

**Jawaban Benar:** B
**Penjelasan:** `:focus-within` sangat berguna untuk menata kontainer pembungkus komponen (seperti bilah pencarian terpadu atau kartu formulir) ketika pengguna sedang mengetik atau memfokuskan salah satu kontrol di dalamnya.

## Sumber
- [Images, media, and form elements — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Images_media_forms)
- [CSS selectors — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Selectors)
- [HTML table basics — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_table_basics)
