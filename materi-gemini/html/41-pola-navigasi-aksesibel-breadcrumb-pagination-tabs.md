# Pola Markup Aksesibel: Jejak Halaman (*Breadcrumbs*), Paginasi, dan Komponen Tab

- **Tingkat:** Menengah
- **Ringkasan:** Menulis struktur HTML semantik dan atribut ARIA standar untuk tiga komponen navigasi paling umum di aplikasi web: *Breadcrumbs*, *Pagination*, dan *Tab Interface* (`role="tablist"`, `tab`, `tabpanel`).

## Mengapa Tiga Pola Navigasi Ini Membutuhkan Struktur Semantik yang Spesifik?

Hampir setiap situs dokumentasi, toko daring, dan dasbor aplikasi memiliki tiga komponen navigasi utama: **Jejak Halaman (*Breadcrumbs*)**, **Paginasi (*Pagination*)**, dan **Antarmuka Tab (*Tabs*)**. Jika ketiganya hanya ditulis sebagai deretan `<div class="nav">` atau `<a href="#">`, pengguna pembaca layar tidak dapat membedakan mana navigasi utama situs, mana jejak hierarki halaman, halaman nomor berapa yang sedang aktif dibuka, dan bagaimana cara berpindah antar-tab dengan papan ketik.

Panduan resmi [W3C ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/) menetapkan struktur HTML dan atribut ARIA baku untuk ketiga pola ini.

## 1. Pola Markup *Breadcrumbs* dan *Pagination* dengan `<nav>` dan `aria-current="page"`

Ketika satu halaman memiliki lebih dari satu elemen `<nav>` (misalnya navigasi utama di header, jejak *breadcrumb* di atas judul, dan paginasi di bawah daftar artikel), **setiap elemen `<nav>` wajib diberi `aria-label` yang unik** agar pengguna pembaca layar dapat membedakannya di daftar *Landmarks*:

| Komponen | Struktur Elemen HTML | Atribut Aksesibilitas Kunci |
|---|---|---|
| **Breadcrumbs (Jejak Halaman)** | `<nav aria-label="Jejak halaman">` berisi daftar terurut **`<ol>`** (karena urutan hierarki dari beranda ke halaman saat ini bermakna). | Pasang **`aria-current="page"`** pada tautan item terakhir yang mewakili halaman saat ini. Simbol pemisah `/` atau `›` ditambahkan lewat CSS `::before` agar tidak ikut dibacakan pembaca layar. |
| **Pagination (Penomoran Halaman)** | `<nav aria-label="Paginasi">` berisi daftar `<ul>` atau `<ol>` tautan nomor halaman. | Pasang **`aria-current="page"`** pada nomor halaman yang sedang aktif, serta `rel="prev"` dan `rel="next"` pada tautan Sebelumnya/Berikutnya. |

## 2. Pola Antarmuka Tab (`role="tablist"`, `tab`, `tabpanel`, dan *Roving `tabindex`*)

Berbeda dengan *Breadcrumbs* dan *Pagination* yang berpindah antar-URL menggunakan `<a href>`, komponen **Tabs** menampilkan dan menyembunyikan panel konten di halaman yang sama. Menurut W3C APG, antarmuka Tab wajib mengikuti aturan struktur dan papan ketik berikut:
1. Wadah deretan tombol tab memiliki **`role="tablist"`** (dengan `aria-label` atau `aria-labelledby`).
2. Setiap tombol tab di dalamnya adalah **`<button type="button" role="tab">`** yang memiliki:
   - **`aria-selected="true"`** (untuk tab aktif) atau **`"false"`** (untuk tab tidak aktif);
   - **`aria-controls="id-panel"`** yang menunjuk `id` panel kontennya;
   - **Roving `tabindex`:** Hanya tab yang sedang aktif yang memiliki `tabindex="0"`, sedangkan seluruh tab lainnya diberi **`tabindex="-1"`**. Pengguna menekan `Tab` sekali untuk masuk ke tab aktif, lalu menggunakan tombol panah **`ArrowRight` / `ArrowLeft`** untuk berpindah antar-tab!
3. Setiap panel konten memiliki **`role="tabpanel"`**, **`aria-labelledby="id-tab"`**, dan **`tabindex="0"`** (agar isi panel mudah dijangkau dengan satu tekan tombol `Tab` bila di dalam panel tidak ada elemen interaktif pertama). Panel yang tidak aktif disembunyikan dengan atribut **`hidden`**.

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pola Navigasi Aksesibel — Kodeloka</title>
  </head>
  <body>
    <main>
      <h1>Pola Navigasi Aksesibel</h1>

      <nav aria-label="Jejak halaman">
        <ol>
          <li><a href="/">Beranda</a></li>
          <li><a href="/html/">HTML</a></li>
          <li><a href="/html/materi/" aria-current="page">Materi</a></li>
        </ol>
      </nav>

      <nav aria-label="Paginasi">
        <ul>
          <li><a href="?hal=1" rel="prev">Sebelumnya</a></li>
          <li><a href="?hal=1">1</a></li>
          <li><a href="?hal=2" aria-current="page">2</a></li>
          <li><a href="?hal=3">3</a></li>
          <li><a href="?hal=3" rel="next">Berikutnya</a></li>
        </ul>
      </nav>

      <div role="tablist" aria-label="Contoh kode">
        <button type="button" role="tab" id="tab-html" aria-selected="true" aria-controls="panel-html">HTML</button>
        <button type="button" role="tab" id="tab-css" aria-selected="false" aria-controls="panel-css" tabindex="-1">CSS</button>
      </div>
      <div role="tabpanel" id="panel-html" aria-labelledby="tab-html" tabindex="0">
        <p>Isi panel HTML.</p>
      </div>
      <div role="tabpanel" id="panel-css" aria-labelledby="tab-css" tabindex="0" hidden>
        <p>Isi panel CSS.</p>
      </div>
    </main>

    <script>
      // Pola tab dari APG: panah kiri/kanan memindahkan pilihan, hanya tab aktif yang masuk urutan Tab
      const tabs = [...document.querySelectorAll('[role="tab"]')];

      function pilih(tab) {
        for (const t of tabs) {
          const aktif = t === tab;
          t.setAttribute("aria-selected", String(aktif));
          t.tabIndex = aktif ? 0 : -1;
          document.getElementById(t.getAttribute("aria-controls")).hidden = !aktif;
        }
        tab.focus();
      }

      for (const [i, tab] of tabs.entries()) {
        tab.addEventListener("click", () => pilih(tab));
        tab.addEventListener("keydown", (e) => {
          if (e.key === "ArrowRight") pilih(tabs[(i + 1) % tabs.length]);
          if (e.key === "ArrowLeft") pilih(tabs[(i - 1 + tabs.length) % tabs.length]);
        });
      }
    </script>
  </body>
</html>
```

## 3. Menambahkan Pemisah Visual *Breadcrumb* via CSS Agar Tidak Mengganggu Pembaca Layar

Jika Anda menulis karakter garis miring `/` secara mentah di dalam HTML (`<li><a href="/">Beranda</a> / </li>`), pembaca layar akan membacakan *"Beranda, garis miring, HTML, garis miring..."*. Gunakan pseudo-element CSS `::before` pada `li + li` agar simbol pemisah hanya bersifat visual:

```css
nav[aria-label="Jejak halaman"] ol {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
}

nav[aria-label="Jejak halaman"] li + li::before {
  content: "/";
  margin-inline-end: 0.5rem;
  color: #64748b;
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan `role="tablist"` dan `role="tab"` untuk menu navigasi utama situs:** Jika mengeklik item menu membawa pengguna berpindah ke URL halaman baru, itu adalah **navigasi tautan (`<nav>` dengan `<a href>`)**, bukan komponen Tab ARIA! Jangan pasang `role="tab"` pada tautan navigasi halaman.
2. **Menulis kata `"Navigasi"` di dalam `aria-label` pada elemen `<nav>`:** Pembaca layar sudah otomatis mengumumkan peran `<nav>` sebagai *"navigation"*. Jika Anda menulis `<nav aria-label="Navigasi paginasi">`, pembaca layar akan membacakannya dua kali: *"Navigasi paginasi navigation"*. Cukup tulis `aria-label="Paginasi"` atau `aria-label="Jejak halaman"`.
3. **Membiarkan semua tombol `role="tab"` memiliki `tabindex="0"`:** Sesuai pola APG, hanya satu tab yang sedang terpilih (`aria-selected="true"`) yang boleh berada di urutan `Tab` (`tabindex="0"`), sementara tab lainnya harus `tabindex="-1"` dan dinavigasi dengan tombol panah.

## Latihan Praktik

Buatlah berkas `41-pola-navigasi-aksesibel-breadcrumb-pagination-tabs.html`:
1. Buat komponen *Breadcrumb* 4 tingkat menggunakan `<nav aria-label="Jejak halaman">` dan `<ol>`, lengkap dengan pemisah CSS `li + li::before` serta `aria-current="page"` pada item terakhir.
2. Buat komponen *Tabs* dengan 3 tab ("Ringkasan", "Contoh Kode", "Kuis") beserta 3 `role="tabpanel"` yang mendukung navigasi tombol panah `ArrowRight`, `ArrowLeft`, `Home` (ke tab pertama), dan `End` (ke tab terakhir).
3. Buat komponen *Pagination* 5 halaman di bagian bawah halaman dan beri gaya visual khusus pada tautan yang memiliki selektor `[aria-current="page"]`.

## Kuis Pemahaman

### Soal 1
Atribut dan nilai apakah yang tepat untuk dipasang pada tautan halaman yang sedang aktif di dalam komponen *Breadcrumbs* maupun *Pagination* agar pembaca layar mengumumkannya sebagai halaman saat ini?
- A. `aria-selected="true"`
- B. `aria-current="page"`
- C. `aria-active="1"`
- D. `role="current"`

**Jawaban Benar:** B
**Penjelasan:** Atribut `aria-current="page"` memberi tahu teknologi bantu bahwa tautan tersebut menunjuk ke halaman yang sedang dibuka saat ini di dalam serangkaian tautan navigasi.

### Soal 2
Dalam pola komponen **Tabs** standar W3C ARIA Authoring Practices Guide (APG), bagaimana cara kerja navigasi papan ketik yang benar di antara tombol-tombol `role="tab"`?
- A. Hanya tab yang sedang aktif (`aria-selected="true"`) yang memiliki `tabindex="0"`, sedangkan tab lain diberi `tabindex="-1"` dan dipilih menggunakan tombol panah (`ArrowRight` / `ArrowLeft`)
- B. Semua tab diberi `tabindex="1"` dan dipilih dengan menekan `Alt + F4`
- C. Tombol `Tab` tidak boleh digunakan sama sekali di seluruh halaman yang memiliki `role="tablist"`
- D. Semua panel `role="tabpanel"` ditampilkan sekaligus tanpa atribut `hidden`

**Jawaban Benar:** A
**Penjelasan:** Pola *roving tabindex* pada `tablist` memastikan pengguna cukup menekan `Tab` satu kali untuk masuk ke tab aktif lalu berpindah langsung ke isi `tabpanel` aktif pada tekanan `Tab` berikutnya, sementara perpindahan antar-tab dilakukan dengan tombol panah.

### Soal 3
Mengapa elemen daftar di dalam `<nav aria-label="Jejak halaman">` (*Breadcrumbs*) sebaiknya menggunakan `<ol>` (*ordered list*) alih-alih `<ul>`?
- A. Karena CSS Flexbox hanya bisa diterapkan pada elemen `<ol>`
- B. Karena jejak halaman merepresentasikan urutan hierarki langkah/tingkatan yang berurutan dari beranda hingga halaman saat ini
- C. Karena `<ul>` tidak boleh memiliki anak elemen `<li>`
- D. Karena atribut `aria-current` hanya valid di dalam `<ol>`

**Jawaban Benar:** B
**Penjelasan:** *Breadcrumb* menunjukkan jalur hierarki berurutan dari halaman paling atas menuju halaman saat ini, sehingga secara semantik tepat direpresentasikan sebagai daftar terurut (`<ol>`).

## Sumber
- [Breadcrumb Pattern — ARIA Authoring Practices Guide (W3C WAI)](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/)
- [Tabs Pattern — ARIA Authoring Practices Guide (W3C WAI)](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [`aria-current` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current)
- [`<nav>` dan elemen lain — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/sections.html)
