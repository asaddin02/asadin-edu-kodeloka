# Kustomisasi Kontrol Formulir Lanjutan: `<select>` Modern (`appearance: base-select`), `<meter>`, dan Input Berkas (`::file-selector-button`)

- **Tingkat:** Lanjut
- **Ringkasan:** Menata tombol pemilih berkas dengan pseudo-element standar `::file-selector-button`, mewarnai `<progress>` dan `<meter>`, serta mengenal standar baru *Customizable Select* (`appearance: base-select`).

## Mengapa Kontrol Formulir Lanjutan?

Pelajaran 13 membahas `accent-color` dan `appearance: none` untuk kotak centang. Beberapa kontrol lain memiliki cara penataan sendiri: tombol pada **input berkas**, **`<progress>` dan `<meter>`**, serta **`<select>`**, yang selama bertahun-tahun daftar pilihannya tidak bisa diubah sama sekali. Pelajaran ini membahas ketiganya, dengan tekanan pada **dukungan peramban** dan **aksesibilitas**.

## 1. Input Berkas: `::file-selector-button`

Tombol "Pilih berkas" pada `<input type="file">` dapat ditata langsung dengan pseudo-element standar. Fitur ini berstatus **Baseline Widely Available** (sejak April 2021):

```css
input[type="file"] {
  font: inherit;
  color: oklch(35% 0.02 250);
}

input[type="file"]::file-selector-button {
  margin-inline-end: 0.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid oklch(80% 0.01 250);
  border-radius: 0.5rem;
  background-color: oklch(96% 0.01 250);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms ease;
}

input[type="file"]::file-selector-button:hover {
  background-color: oklch(92% 0.02 255);
}

input[type="file"]:focus-visible {
  outline: 3px solid oklch(55% 0.2 255);
  outline-offset: 3px;
}
```

Tetap gunakan `<label>` untuk input berkas, dan jangan menyembunyikan input aslinya dengan `display: none` karena kontrol itu akan hilang dari urutan fokus papan ketik.

## 2. `<progress>` dan `<meter>`

- **`<progress value="70" max="100">`** menunjukkan kemajuan tugas; **`<meter value="0.7">`** menunjukkan **ukuran dalam rentang** (mis. penggunaan disk, skor).
- Cara paling sederhana adalah `accent-color` (lihat Pelajaran 13). Untuk kontrol lebih, peramban masih memakai pseudo-element **berawalan vendor** yang berbeda-beda:

```css
progress {
  inline-size: 100%;
  block-size: 0.75rem;
  appearance: none;
  border: 0;
  border-radius: 999px;
  overflow: hidden;
  background-color: oklch(92% 0.01 250);       /* Firefox memakai elemen ini sebagai trek */
}
progress::-webkit-progress-bar   { background-color: oklch(92% 0.01 250); }   /* trek: Chrome, Safari */
progress::-webkit-progress-value { background-color: oklch(55% 0.2 255); }    /* isi: Chrome, Safari */
progress::-moz-progress-bar      { background-color: oklch(55% 0.2 255); }    /* isi: Firefox */
```

Catatan:
- Pseudo-element berawalan `-webkit-` dan `-moz-` tidak boleh digabung dalam satu daftar selektor; satu selektor yang tidak dikenali membuat seluruh aturan diabaikan. Tulis terpisah seperti di atas.
- `<meter>` memiliki pseudo-element serupa (`::-webkit-meter-bar`, `::-webkit-meter-optimum-value`, `::-moz-meter-bar`) tetapi tampilannya paling tidak konsisten antarperamban. Untuk desain yang rumit, gunakan `<progress>` atau elemen kustom dengan `role="meter"`, dan selalu sertakan nilai dalam bentuk teks.
- Berikan label: `<label for="berkas">Mengunggah berkas</label> <progress id="berkas" value="70" max="100">70%</progress>`.

## 3. `<select>` yang Dapat Dikustomisasi: `appearance: base-select`

Secara tradisional, daftar pilihan `<select>` digambar sistem operasi dan tidak bisa ditata. Standar baru **Customizable Select** memungkinkannya. Seluruh fitur diaktifkan dengan satu deklarasi: `appearance: base-select`.

```css
@supports (appearance: base-select) {
  select,
  ::picker(select) {
    appearance: base-select;          /* aktifkan untuk kotak dan daftar sembul */
  }

  select {
    padding: 0.5rem 0.75rem;
    border: 1px solid oklch(80% 0.01 250);
    border-radius: 0.5rem;
  }

  /* Ikon panah dapat ditata dan dianimasikan */
  select::picker-icon {
    transition: rotate 200ms ease;
  }
  select:open::picker-icon {
    rotate: 180deg;
  }

  /* Daftar sembul */
  ::picker(select) {
    padding: 0.25rem;
    border: 1px solid oklch(85% 0.01 250);
    border-radius: 0.75rem;
    box-shadow: 0 8px 24px rgb(15 23 42 / 0.15);
  }

  option {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
  }
  option:hover,
  option:focus-visible {
    background-color: oklch(95% 0.03 255);
  }
  option:checked {
    font-weight: 600;
  }
  option::checkmark {
    color: oklch(55% 0.2 255);        /* tanda centang bawaan pada opsi terpilih */
  }
}
```

HTML-nya dapat memuat konten kaya di dalam opsi, dan tombol kotak dapat menampilkan salinan opsi terpilih lewat `<selectedcontent>`:

```html
<select name="kelas">
  <button>
    <selectedcontent></selectedcontent>
  </button>
  <option value="html"><img src="html.svg" alt="" width="20" height="20"> HTML</option>
  <option value="css"><img src="css.svg" alt="" width="20" height="20"> CSS</option>
</select>
```

**Dukungan dan keselamatan:** `appearance: base-select`, `::picker(select)`, `::picker-icon`, `::checkmark`, dan `<selectedcontent>` didukung Chrome sejak versi 135 dan Safari 27; di Firefox masih di balik bendera percobaan. Di MDN statusnya **Limited availability**. Karena itu:
- Bungkus dalam `@supports (appearance: base-select)` agar peramban lain tetap memakai `<select>` biasa.
- Peramban lama umumnya mengabaikan tag `<button>`/`<selectedcontent>` di dalam `<select>`, sehingga `<select>` dengan `<option>` tetap berfungsi, tetapi uji hasilnya.

> Perlu dicek: perilaku penguraian tag `<button>` dan `<selectedcontent>` di dalam `<select>` pada peramban yang belum mendukung (termasuk tampilan teks di dalamnya) belum dikonfirmasi dari sumber resmi; uji di peramban sasaran sebelum rilis.

- Opsi harus tetap berisi teks yang bermakna; gambar dekoratif diberi `alt=""`. Jangan menaruh kontrol interaktif (tautan, tombol) di dalam `<option>`.
- Pertahankan kontras dan indikator fokus yang jelas pada opsi.

## Studi Kasus Produksi: Pemilih Status Tugas dengan Animasi Popover dan Peningkatan Progresif

Karena `::picker(select)` pada mode `appearance: base-select` berperilaku sebagai elemen *popover* di *top layer*, Anda dapat memadukannya dengan `@starting-style` dan `selectedcontent` untuk menyembunyikan deskripsi panjang saat menu tertutup:

```css
@supports (appearance: base-select) {
  .pilih-status,
  .pilih-status::picker(select) {
    appearance: base-select;
  }

  /* Sembunyikan teks keterangan tambahan di dalam tombol tertutup,
     tetapi tetap tampilkan di daftar pilihan saat dibuka */
  .pilih-status selectedcontent .keterangan-opsi {
    display: none;
  }

  .pilih-status::picker(select) {
    opacity: 0;
    transition: opacity 160ms ease, display 160ms allow-discrete, overlay 160ms allow-discrete;
  }

  .pilih-status:open::picker(select) {
    opacity: 1;
  }

  @starting-style {
    .pilih-status:open::picker(select) {
      opacity: 0;
    }
  }
}
```

Menurut dokumentasi MDN *Customizable select elements*, peramban yang belum mendukung fitur ini akan mengabaikan struktur `<button><selectedcontent></selectedcontent></button>` dan melucuti tag non-teks di dalam `<option>` sehingga menyisakan simpul teksnya saja, sementara nilai JavaScript `select.value` (bila atribut `value` tidak ditulis eksplisit) diambil dari `option.textContent.trim()`.

## Kesalahan Umum dan Cara Menghindarinya

1. **Menggabungkan `::-webkit-progress-value` dan `::-moz-progress-bar` dalam satu aturan.** Peramban yang tidak mengenali salah satunya membuang seluruh aturan; tulis terpisah.
2. **Mengaktifkan `base-select` tanpa `@supports`.** Di peramban yang belum mendukung, properti diabaikan tetapi struktur gaya pendamping bisa tidak sesuai.
3. **Menyembunyikan input berkas asli.** Gunakan `::file-selector-button` sebagai gantinya.
4. **Mengandalkan warna saja untuk menandai opsi terpilih.** Sertakan penanda lain (tanda centang, ketebalan huruf).
5. **Menaruh kontrol interaktif di dalam `<option>`.** Tidak didukung dan merusak aksesibilitas.

## Latihan Praktik: Formulir Unggah dan Pemilih Kelas

Buatlah berkas `kontrol-lanjut.html` dan `kontrol.css`:
1. Tata input berkas dengan `::file-selector-button`, termasuk keadaan `:hover` dan `:focus-visible`.
2. Buat bilah `<progress>` kustom yang bekerja di Chrome dan Firefox dengan aturan pseudo-element terpisah.
3. Buat `<select>` kustom dengan `appearance: base-select` di dalam `@supports`, lengkap dengan ikon panah yang berputar saat `:open`. Uji di peramban yang tidak mendukung dan pastikan `<select>` biasa tetap berfungsi.

## Kuis Pemahaman

### Soal 1
Pseudo-element manakah yang menata tombol "Pilih berkas" pada `<input type="file">`?
- A. `input::button`
- B. `input[type="file"]::file-selector-button`
- C. `input::-webkit-file`
- D. `input:file-button`

**Jawaban Benar:** B
**Penjelasan:** `::file-selector-button` adalah pseudo-element standar dan berstatus Baseline Widely Available sejak April 2021. Opsi lain bukan selektor yang valid.

### Soal 2
Bagaimana cara terbaik memakai `appearance: base-select` di produksi saat ini?
- A. Menulisnya langsung tanpa pengaman karena sudah didukung semua peramban.
- B. Menggunakannya hanya di Firefox.
- C. Menghapus semua gaya `<select>` lainnya.
- D. Membungkusnya dalam `@supports (appearance: base-select)` sehingga peramban yang belum mendukung tetap menampilkan `<select>` standar yang berfungsi penuh.

**Jawaban Benar:** D
**Penjelasan:** Dukungannya belum merata (Chrome 135, Safari 27, Firefox di balik bendera; MDN: Limited availability). Peningkatan progresif lewat `@supports` menjaga semua pengguna mendapat kontrol yang berfungsi.

### Soal 3
Mengapa aturan berikut bermasalah? `progress::-webkit-progress-value, progress::-moz-progress-bar { background: blue; }`
- A. Karena `background` tidak berlaku pada `<progress>`.
- B. Karena selektor yang tidak dikenali peramban membatalkan seluruh daftar, sehingga aturan tidak berlaku di peramban mana pun yang tidak mengenali salah satunya; keduanya harus ditulis dalam aturan terpisah.
- C. Karena `blue` bukan warna yang valid.
- D. Karena `<progress>` tidak dapat ditata sama sekali.

**Jawaban Benar:** B
**Penjelasan:** Dalam daftar selektor, satu selektor yang tidak valid di sebuah peramban membuat seluruh aturan diabaikan. Pseudo-element berawalan vendor harus ditulis dalam aturan terpisah.

## Sumber
- [`::file-selector-button` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::file-selector-button)
- [Customizable select — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select)
- [`appearance` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/appearance)
- [`<progress>` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress)
- [`<meter>` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter)
