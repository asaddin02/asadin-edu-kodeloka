# Aksesibilitas Web (a11y) dan WAI-ARIA Dasar

- **Tingkat:** Menengah
- **Ringkasan:** Menerapkan prinsip WCAG (POUR), navigasi papan ketik dan manajemen fokus, lima aturan penggunaan WAI-ARIA, serta atribut penting seperti `aria-label`, `aria-labelledby`, `aria-describedby`, dan `aria-live`.

## Apa Itu Aksesibilitas Web (a11y) dan Mengapa Bukan Fitur Tambahan?

Istilah **a11y** adalah numeronim dari kata *accessibility* (huruf `a`, diikuti 11 huruf di tengah, dan diakhiri huruf `y`). Membangun web yang aksesibel berarti memastikan situs Anda dapat digunakan oleh semua orang—termasuk penyandang tunanetra yang menggunakan pembaca layar (*screen reader* seperti NVDA, VoiceOver, atau TalkBack), pengguna dengan keterbatasan motorik yang hanya menggunakan papan ketik atau tombol *switch*, pengguna dengan gangguan pendengaran, hingga pengguna di bawah terik matahari dengan kontras layar terbatas.

Standar internasional untuk aksesibilitas web adalah **WCAG (*Web Content Accessibility Guidelines*) 2.2** dari W3C, yang bertumpu pada empat prinsip utama yang disingkat **POUR**:

1. **Perceivable (Dapat Diamati):** Informasi tidak boleh bergantung pada satu indra saja (sediakan teks alternatif `alt` untuk gambar, takarir `<track>` untuk video, dan kontras warna minimal `4.5:1` untuk teks normal).
2. **Operable (Dapat Dioperasikan):** Seluruh fungsi antarmuka harus bisa dijalankan menggunakan **papan ketik saja** tanpa tetikus (*mouse*), memiliki indikator fokus yang jelas, dan memiliki target klik/sentuh yang memadai (minimal `24×24` piksel CSS di WCAG 2.2 AA).
3. **Understandable (Dapat Dipahami):** Bahasa dokumen dinyatakan dengan jelas (`<html lang="id">`), navigasi konsisten, dan formulir memberikan pesan kesalahan yang jelas beserta saran perbaikannya.
4. **Robust (Tangguh):** Kode HTML ditulis secara valid dan semantik sehingga dapat diterjemahkan secara akurat oleh berbagai peramban maupun teknologi bantu (*assistive technologies*) masa kini dan masa depan.

## 1. Navigasi Papan Ketik, Urutan Fokus, dan `tabindex`

Cobalah meletakkan tetikus Anda, lalu gunakan tombol **`Tab`** (maju), **`Shift + Tab`** (mundur), **`Enter`**, **`Space`**, dan tombol **Panah** di halaman web.

Secara bawaan, hanya elemen interaktif asli HTML (`<a href="...">`, `<button>`, `<input>`, `<select>`, `<textarea>`, `<summary>`) yang masuk ke dalam urutan fokus tombol `Tab` sesuai urutan kemunculannya di dokumen DOM.

Atribut `tabindex` mengendalikan perilaku fokus sebuah elemen:

| Nilai `tabindex` | Perilaku dan Aturan Penggunaan |
|---|---|
| `tabindex="0"` | Memasukkan elemen yang aslinya tidak fokusabel (seperti `<div class="pembungkus-tabel">` yang bisa digulir) ke dalam urutan `Tab` normal mengikuti urutan DOM. |
| `tabindex="-1"` | Elemen **tidak** dapat dicapai dengan menekan tombol `Tab`, tetapi **dapat menerima fokus secara terprogram** lewat JavaScript (`elemen.focus()`) atau ketika menjadi target tautan lompatan. Sangat berguna untuk mengelola fokus di dalam komponen kustom atau pesan galat. |
| `tabindex="1"` atau angka positif (`> 0`) | **JANGAN PERNAH DIGUNAKAN!** Nilai positif merampas urutan fokus alami halaman dan melompat-lompat mendahului semua elemen lain, sehingga membingungkan pengguna papan ketik. |

> **🚫 Jangan Pernah Menghapus `outline` Fokus Tanpa Pengganti!**
> Menulis `*:focus { outline: none; }` di CSS membuat pengguna papan ketik kehilangan jejak di mana posisi kursor mereka berada. Gunakan pseudo-class modern **`:focus-visible`** agar cincin fokus yang tegas selalu tampil saat pengguna memakai papan ketik:
> ```css
> :focus-visible {
>   outline: 3px solid #2563eb;
>   outline-offset: 2px;
> }
> ```

## 2. Mengenal WAI-ARIA dan "Aturan Pertama Penggunaan ARIA"

**WAI-ARIA (*Accessible Rich Internet Applications*)** adalah sekumpulan atribut HTML (`role`, `aria-*`) yang menambahkan informasi peran, status, dan properti pada elemen DOM untuk diteruskan ke *Accessibility Tree* milik sistem operasi, tanpa mengubah tampilan visual maupun perilaku JavaScript secara otomatis.

Sebelum menulis atribut ARIA apa pun, hafalkan **Aturan Pertama Penggunaan ARIA** dari W3C:

> *"Jika Anda dapat menggunakan elemen atau atribut HTML asli (native) yang sudah memiliki semantik dan perilaku yang Anda butuhkan secara bawaan, **gunakanlah elemen HTML asli tersebut**, jangan menambal elemen generik dengan ARIA."*

```html
<!-- BURUK: Memaksakan <div> menjadi tombol dengan ARIA (tetap butuh JS tambahan untuk Enter/Space!) -->
<div role="button" tabindex="0" aria-pressed="false">Simpan Perubahan</div>

<!-- LEBIH BAIK: Gunakan <button> asli — sudah otomatis fokusabel, mendukung Enter & Space, dan dikenali semua pembaca layar -->
<button type="button" aria-pressed="false">Simpan Perubahan</button>
```

## 3. Atribut ARIA yang Paling Sering Digunakan dalam Praktik

Meskipun kita selalu mengutamakan HTML semantik, ada situasi di mana HTML murni tidak cukup untuk menyampaikan hubungan antar-elemen atau perubahan status dinamis:

### A. Memberi Nama dan Deskripsi: `aria-label`, `aria-labelledby`, dan `aria-describedby`

1. **`aria-label`:** Memberikan nama aksesibel berupa teks langsung ketika elemen tidak memiliki teks yang terlihat di layar (contoh paling umum: tombol yang hanya berisi ikon SVG).
2. **`aria-labelledby`:** Mengambil nama aksesibel dari `id` elemen teks lain yang **sudah tampil** di layar.
3. **`aria-describedby`:** Mengaitkan elemen dengan `id` elemen penjelasan tambahan (seperti syarat kata sandi atau pesan kesalahan di bawah input).

```html
<!-- 1. Tombol hanya berisi ikon SVG: gunakan aria-label, dan sembunyikan SVG dekoratif dengan aria-hidden="true" -->
<button type="button" aria-label="Tutup jendela pemberitahuan">
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
  </svg>
</button>

<!-- 2. Mengaitkan input dengan petunjuk dan pesan galat menggunakan aria-describedby -->
<div class="kelompok-input">
  <label for="nama-domain">Subdomain Aplikasi</label>
  <input
    type="text"
    id="nama-domain"
    name="subdomain"
    aria-invalid="true"
    aria-describedby="petunjuk-domain galat-domain"
  >
  <p id="petunjuk-domain">Hanya huruf kecil dan tanda hubung, maksimal 30 karakter.</p>
  <p id="galat-domain" role="alert">Subdomain "admin" sudah digunakan oleh pengguna lain.</p>
</div>
```

### B. Menyampaikan Status Komponen: `aria-expanded`, `aria-current`, dan `aria-hidden`
- **`aria-expanded="false"` / `"true"`:** Dipasang pada tombol pembuka menu tarik-turun (*dropdown*) atau navigasi ponsel untuk memberitahu apakah panel yang dikendalikannya sedang tertutup atau terbuka.
- **`aria-current="page"`:** Dipasang pada tautan navigasi yang menunjuk ke halaman yang sedang aktif saat ini.
- **`aria-hidden="true"`:** Menyembunyikan elemen dekoratif (seperti ikon SVG pendamping teks atau tanda panah hiasan `→`) dari pembaca layar agar tidak dibacakan secara berulang. **Jangan pernah memasang `aria-hidden="true"` pada elemen yang masih bisa menerima fokus tombol `Tab`!**

### C. Mengumumkan Perubahan Dinamis dengan `aria-live`
Ketika JavaScript memperbarui teks di sebagian layar tanpa memuat ulang halaman (misalnya menampilkan *"3 hasil ditemukan"* atau *"Berhasil disimpan ke draf"*), pengguna pembaca layar tidak akan mengetahuinya kecuali elemen pembungkusnya ditandai sebagai **Live Region**:
- **`aria-live="polite"` (atau `<output>` / `role="status"`):** Pembaca layar menunggu sampai kalimat yang sedang dibacakan selesai, baru mengumumkan perubahan teks tersebut dengan sopan.
- **`aria-live="assertive"` (atau `role="alert"`):** Langsung menyela pembacaan saat itu juga. Gunakan hanya untuk peringatan galat kritis atau batas waktu sesi yang mendesak.

## Latihan Praktik: Mengaudit dan Memperbaiki Komponen Kartu & Formulir

Buatlah berkas `latihan-a11y.html` yang berisi:
1. Sebuah tombol penutup notifikasi yang hanya menampilkan ikon `×` secara visual, namun tetap memiliki nama yang jelas bagi pembaca layar dan menyembunyikan simbol `×` dari pembacaan literal.
2. Sebuah menu navigasi dengan lima tautan, di mana halaman aktif ditandai secara semantik dengan `aria-current="page"`.
3. Sebuah kotak input pencarian langsung (*live search*) yang terhubung dengan petunjuk pengisian (`aria-describedby`) dan memiliki wadah status hasil pencarian dengan `aria-live="polite"`.

## Kuis Pemahaman

### Soal 1
Apa bunyi prinsip utama dari "Aturan Pertama Penggunaan ARIA" (*First Rule of ARIA Use*)?
- A. Setiap elemen HTML wajib memiliki minimal satu atribut `role` dan satu atribut `aria-label`.
- B. Jika terdapat elemen atau atribut HTML asli (*native*) yang sudah memiliki semantik dan perilaku aksesibilitas yang dibutuhkan, gunakanlah elemen HTML asli tersebut daripada memodifikasi elemen generik dengan ARIA.
- C. Atribut ARIA hanya boleh ditambahkan melalui kode JavaScript setelah halaman selesai dimuat.
- D. Atribut `aria-hidden="true"` harus dipasang pada semua tombol agar halaman lebih cepat dimuat.

**Jawaban Benar:** B
**Penjelasan:** Elemen HTML asli seperti `<button>`, `<nav>`, `<dialog>`, dan `<details>` sudah menyediakan dukungan fokus papan ketik, event klik/ketukan, dan peran aksesibilitas bawaan di semua peramban. Menambahkan ARIA pada `<div>` mengharuskan Anda menulis ulang semua perilaku papan ketik tersebut secara manual di JavaScript dan rawan menghasilkan bug.

### Soal 2
Mengapa penggunaan `tabindex` dengan nilai positif (seperti `tabindex="1"` atau `tabindex="5"`) sangat tidak disarankan?
- A. Karena nilai positif hanya didukung oleh peramban Safari.
- B. Karena elemen dengan nilai `tabindex` positif akan melompati urutan fokus alami dokumen dan menerima fokus lebih dulu sebelum semua elemen lain di halaman, sehingga merusak alur navigasi pengguna papan ketik.
- C. Karena `tabindex` positif membuat elemen tidak dapat diklik dengan tetikus.
- D. Karena `tabindex` positif menghapus gaya CSS `:focus-visible`.

**Jawaban Benar:** B
**Penjelasan:** Urutan fokus papan ketik seharusnya mengalir secara logis mengikuti susunan visual dan DOM dokumen (`tabindex="0"` atau elemen interaktif bawaan). Nilai positif memaksa fokus melompat ke elemen tersebut terlebih dahulu di awal halaman, menciptakan pengalaman navigasi yang membingungkan.

### Soal 3
Anda memiliki tombol dengan teks dan ikon SVG di dalamnya: `<button type="button"><svg>...</svg> Unduh Materi</button>`. Atribut apa yang sebaiknya ditambahkan pada elemen `<svg>` tersebut?
- A. `aria-label="Ikon unduh"`
- B. `aria-hidden="true"`
- C. `role="button"`
- D. `tabindex="0"`

**Jawaban Benar:** B
**Penjelasan:** Karena tombol tersebut sudah memiliki teks yang jelas (`"Unduh Materi"`), ikon SVG di sebelahnya bersifat dekoratif/pelengkap. Menambahkan `aria-hidden="true"` pada `<svg>` mencegah pembaca layar mencoba membacakan elemen grafis internal yang tidak perlu.

## Sumber
- [WAI-ARIA basics — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/WAI-ARIA_basics)
- [ARIA states and properties (attributes) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes)
- [What's New in WCAG 2.2 — W3C Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [Accessibility for web developers — web.dev](https://web.dev/articles/a11y-tips-for-web-dev)
