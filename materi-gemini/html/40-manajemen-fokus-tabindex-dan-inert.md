# Manajemen Fokus Papan Ketik, Urutan `Tab`, `autofocus`, dan Penguncian Latar dengan `inert`

- **Tingkat:** Menengah
- **Ringkasan:** Merancang alur navigasi papan ketik yang logis, menggunakan `tabindex="-1"` untuk pemindahan fokus terprogram pada pesan galat/modal, serta menonaktifkan elemen latar belakang dengan atribut global `inert`.

## Mengapa Urutan Fokus Papan Ketik Adalah Jantung Aksesibilitas Interaktif?

Bagi pengguna yang mengalami gangguan motorik, pengguna pembaca layar, maupun pengembang yang bekerja cepat menggunakan papan ketik, tombol **`Tab`** dan **`Shift + Tab`** adalah satu-satunya cara untuk berpindah antar-elemen interaktif (`<a>`, `<button>`, `<input>`, `<select>`, `<textarea>`, `<summary>`).

Jika urutan elemen di dalam HTML berantakan, atau ketika sebuah panel samping (*drawer*) terbuka tetapi fokus papan ketik masih bisa "bocor" ke puluhan tautan di halaman belakangnya, pengguna papan ketik akan tersesat. Spesifikasi [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/interaction.html) menyediakan atribut **`tabindex`**, **`autofocus`**, dan **`inert`** untuk mengendalikan siklus fokus ini secara presisi.

## 1. Memahami Tiga Nilai Atribut `tabindex`: `0`, `-1`, dan Mengapa `> 0` Harus Dihindari

Atribut global `tabindex` menerima bilangan bulat yang menentukan apakah dan bagaimana sebuah elemen berpartisipasi dalam navigasi fokus berurutan (*sequential focus navigation*):

| Nilai `tabindex` | Dapat Difokuskan dengan Tombol `Tab`? | Dapat Difokuskan via JavaScript (`el.focus()`)? | Aturan Penggunaan di Produksi |
|---|---|---|---|
| **Tanpa `tabindex`** pada `<button>`, `<a href>`, `<input>` | **Ya**, mengikuti urutan alami pohon DOM. | **Ya** | **Standar terbaik:** biarkan elemen interaktif asli mengikuti urutan penulisan HTML. |
| **`tabindex="0"`** | **Ya**, masuk ke urutan `Tab` alami sesuai posisi elemen di DOM. | **Ya** | Gunakan hanya untuk komponen interaktif kustom (misalnya `<div role="tabpanel" tabindex="0">`) atau item aktif dalam pola *roving tabindex*. |
| **`tabindex="-1"`** | **Tidak**, dilewati saat pengguna menekan tombol `Tab`. | **Ya**, dapat menerima fokus lewat `elemen.focus()` atau klik. | Sangat berguna untuk **memindahkan fokus secara terprogram** ke judul modal, ringkasan galat formulir, atau target *skip link* (`<main id="utama" tabindex="-1">`). |
| **`tabindex="1"`, `"2"`, dst. (`> 0`)** | **Ya**, tetapi **melompati semua elemen lain** dan dieksekusi paling awal sebelum seluruh elemen `tabindex="0"`. | **Ya** | **🚫 Anti-pola (Jangan pernah digunakan):** Merusak urutan fokus alami halaman dan menyulitkan pemeliharaan. Susunlah urutan elemen langsung di HTML! |

## 2. Mengunci Elemen Latar Belakang dengan Atribut Global `inert`

Ketika Anda menampilkan panel samping (*off-canvas drawer*) atau penampung kustom yang menuntut perhatian pengguna, Anda harus memastikan pengguna tidak dapat mengeklik, memfokuskan dengan `Tab`, atau membaca elemen di belakangnya menggunakan pembaca layar.

Dahulu, pengembang harus memasang `tabindex="-1"` dan `aria-hidden="true"` pada ratusan elemen latar satu per satu. Kini, cukup tambahkan satu atribut boolean **`inert`** pada elemen pembungkus latar belakang (`halaman.inert = true`):
1. Seluruh tautan, tombol, dan input di dalam pohon elemen yang `inert` **dikeluarkan dari urutan fokus `Tab`**.
2. Klik tetikus maupun ketukan sentuh di dalam area `inert` **diabaikan sepenuhnya** (seperti `pointer-events: none`).
3. Seluruh isi elemen `inert` **disembunyikan dari Accessibility Tree** pembaca layar dan pencarian teks di halaman.

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manajemen Fokus dan inert — Kodeloka</title>
  </head>
  <body>
    <!-- Seluruh halaman dibungkus agar dapat dikunci sekaligus -->
    <div id="halaman">
      <a href="#utama">Lompat ke konten utama</a>
      <header><p>Kodeloka</p></header>
      <main id="utama">
        <h1>Pengaturan</h1>
        <button type="button" id="buka-panel">Buka panel bantuan</button>
      </main>
    </div>

    <!-- Panel berada di luar #halaman sehingga tidak ikut dikunci -->
    <div id="panel" role="dialog" aria-modal="true" aria-labelledby="judul-panel" hidden>
      <h2 id="judul-panel">Bantuan</h2>
      <p>Latar belakang tidak dapat diklik atau difokuskan selama panel terbuka.</p>
      <button type="button" id="tutup-panel">Tutup</button>
    </div>

    <script>
      const halaman = document.getElementById("halaman");
      const panel = document.getElementById("panel");
      const buka = document.getElementById("buka-panel");
      const tutup = document.getElementById("tutup-panel");

      buka.addEventListener("click", () => {
        panel.hidden = false;
        halaman.inert = true;      // latar belakang tidak bisa difokuskan atau diklik
        tutup.focus();             // pindahkan fokus ke dalam panel
      });

      tutup.addEventListener("click", () => {
        halaman.inert = false;
        panel.hidden = true;
        buka.focus();              // kembalikan fokus ke pemicu
      });
    </script>
  </body>
</html>
```

> **Status dukungan (Oktober 2026):** `inert` berstatus *Baseline Widely Available* sejak Oktober 2025. Jika panel Anda berupa dialog modal, lebih sederhana memakai `<dialog>` dengan `showModal()` yang sudah membuat halaman di belakangnya inert.

## 3. Memindahkan Fokus ke Ringkasan Galat Formulir dengan `tabindex="-1"`

Saat pengguna mengirim formulir yang panjang lalu terdapat 3 kolom yang salah diisi, menampilkan kotak ringkasan galat di bagian atas formulir dan memanggil `ringkasanGalat.focus()` membantu pengguna langsung mengetahui letak kesalahannya. Agar elemen `<div id="ringkasan-galat">` dapat menerima `.focus()` tanpa ikut masuk ke urutan `Tab` biasa, beri atribut **`tabindex="-1"`**:

```html
<div id="ringkasan-galat" role="alert" tabindex="-1" hidden>
  <h2>Terdapat 2 kesalahan pada isian Anda:</h2>
  <ul>
    <li><a href="#input-surel">Alamat surel wajib diisi.</a></li>
    <li><a href="#input-sandi">Kata sandi minimal 12 karakter.</a></li>
  </ul>
</div>
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menempatkan panel modal di *dalam* `<div id="halaman" inert>`:** Sifat `inert` diwariskan secara mutlak ke seluruh elemen turunannya dan **tidak dapat dibatalkan** oleh elemen anak. Oleh karena itu, panel yang tetap harus aktif wajib diletakkan sebagai saudara (*sibling*) di luar elemen yang diberi `inert` (atau gunakan `<dialog>` dengan `showModal()`).
2. **Menambahkan `tabindex="0"` pada paragraf `<p>` atau judul `<h2>` biasa:** Pembaca layar sudah memiliki pintasan sendiri untuk membaca judul dan paragraf. Menambahkan `tabindex="0"` pada teks non-interaktif membuat pengguna papan ketik harus menekan `Tab` puluhan kali untuk melewati paragraf teks yang tidak bisa diklik!
3. **Lupa mengembalikan fokus ke tombol pemicu setelah panel ditutup:** Jika panel ditutup (`panel.hidden = true`) sementara fokus masih berada di dalam panel tersebut, fokus akan terlempar kembali ke awal `<body>` sehingga pengguna harus menekan `Tab` dari awal halaman lagi.

## Latihan Praktik

Buatlah berkas `40-manajemen-fokus-tabindex-dan-inert.html`:
1. Buat struktur halaman dengan tautan *skip link* `<a href="#utama">Lompat ke konten utama</a>` di paling atas, `<header>` berisi 3 tautan navigasi, dan `<main id="utama" tabindex="-1">`.
2. Buat sebuah tombol "Buka Keranjang" di dalam `<main>` yang ketika diklik membuka panel samping `<aside>` (di luar pembungkus halaman), mengaktifkan `halaman.inert = true`, dan memindahkan fokus ke tombol "Tutup Keranjang" di dalam panel.
3. Pastikan saat tombol "Tutup Keranjang" atau tombol `Esc` ditekan, `halaman.inert` dikembalikan menjadi `false`, panel disembunyikan, dan fokus kembali tepat ke tombol "Buka Keranjang".

## Kuis Pemahaman

### Soal 1
Nilai `tabindex` manakah yang memungkinkan sebuah elemen `<div>` atau `<h2>` menerima fokus melalui pemanggilan JavaScript `elemen.focus()`, tetapi **tidak** dimasukkan ke dalam urutan tekan tombol `Tab` normal?
- A. `tabindex="0"`
- B. `tabindex="1"`
- C. `tabindex="-1"`
- D. `tabindex="auto"`

**Jawaban Benar:** C
**Penjelasan:** `tabindex="-1"` mengeluarkan elemen dari urutan navigasi `Tab` berurutan, namun mengizinkan elemen tersebut difokuskan secara terprogram dengan metode `.focus()` (misalnya untuk memindahkan fokus ke ringkasan galat atau judul dialog).

### Soal 2
Apa saja dampak dari penambahan atribut boolean `inert` pada sebuah elemen kontainer `<div id="latar" inert>`?
- A. Hanya mengubah warna teks di dalam `#latar` menjadi abu-abu
- B. Menonaktifkan seluruh interaksi di dalam sub-pohon `#latar`: elemen di dalamnya tidak dapat difokuskan dengan `Tab`, tidak merespons klik/sentuhan, dan disembunyikan dari pohon aksesibilitas pembaca layar
- C. Menghapus elemen `#latar` secara permanen dari pohon DOM
- D. Memindahkan `#latar` ke dalam `<iframe>` terpisah

**Jawaban Benar:** B
**Penjelasan:** Atribut global `inert` membuat seluruh elemen dan turunannya menjadi tidak interaktif bagi papan ketik, penunjuk tetikus/sentuh, maupun teknologi bantu pembaca layar.

### Soal 3
Mengapa penggunaan nilai `tabindex` positif (seperti `tabindex="1"`, `tabindex="2"`, `tabindex="3"`) dianggap sebagai anti-pola yang harus dihindari?
- A. Karena peramban modern menolak merender halaman yang memiliki `tabindex="1"`
- B. Karena elemen dengan `tabindex > 0` akan melompati seluruh elemen interaktif standar di halaman dan menciptakan urutan fokus yang tidak selaras dengan urutan visual DOM
- C. Karena `tabindex` positif mematikan fungsi tombol `Enter`
- D. Karena `tabindex` positif hanya berlaku pada elemen `<table>`

**Jawaban Benar:** B
**Penjelasan:** Spesifikasi HTML memproses seluruh elemen dengan `tabindex > 0` terlebih dahulu sebelum elemen dengan `tabindex="0"` atau kontrol bawaan, sehingga merusak urutan navigasi alami halaman dan membingungkan pengguna papan ketik.

## Sumber
- [`inert` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert)
- [`tabindex` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex)
- [`autofocus` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus)
- [User interaction — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/interaction.html)
