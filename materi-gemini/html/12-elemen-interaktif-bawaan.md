# Elemen Interaktif Bawaan: `<details>`, `<dialog>`, Popover API, dan `<template>`

- **Tingkat:** Menengah
- **Ringkasan:** Membangun komponen antarmuka interaktif seperti akordeon, jendela dialog modal, dan panel sembul (*popover*) menggunakan kemampuan bawaan HTML modern tanpa ketergantungan pustaka JavaScript yang berat.

## Revolusi Komponen Interaktif Bawaan HTML

Selama bertahun-tahun, membuat akordeon tanya-jawab, jendela modal (*modal dialog*), atau menu sembul (*tooltip/popover*) mengharuskan pengembang memasang pustaka JavaScript pihak ketiga yang rumit. Masalahnya, membuat komponen tersebut dari tumpukan `<div>` sangat sulit dilakukan dengan benar: Anda harus mengunci fokus tombol `Tab` di dalam modal (*focus trapping*), menangani tombol `Esc`, menonaktifkan latar belakang, mengatur tumpukan `z-index`, dan memasang belasan atribut ARIA.

Kini, spesifikasi HTML modern menyediakan elemen dan atribut bawaan yang menyelesaikan seluruh kerumitan tersebut langsung di tingkat mesin peramban!

## 1. Akordeon Murni HTML dengan `<details>` dan `<summary>`

Elemen `<details>` dan `<summary>` (status **Baseline Widely Available**) menciptakan komponen buka-tutup (*disclosure widget*) tanpa memerlukan satu baris JavaScript pun:

```html
<details>
  <summary>Bagaimana cara menjalankan kueri SQL dengan aman di PHP?</summary>
  <p>
    Gunakan <strong>Prepared Statements</strong> melalui ekstensi PDO (<code>$pdo-&gt;prepare()</code>)
    agar parameter masukan pengguna tidak pernah ditafsirkan sebagai perintah SQL.
  </p>
</details>
```

### Akordeon Eksklusif dengan Atribut `name`
Sejak September 2024 (status **Baseline Newly Available**; Chrome sudah mendukungnya sejak Desember 2023), Anda dapat memberikan nilai atribut `name` yang sama pada beberapa elemen `<details>`. Ketika pengguna membuka salah satu `<details>`, elemen `<details>` lain yang memiliki `name` yang sama akan **otomatis tertutup**—menciptakan perilaku akordeon eksklusif murni dengan HTML:

```html
<section aria-labelledby="judul-faq">
  <h2 id="judul-faq">Pertanyaan yang Sering Diajukan</h2>

  <details name="faq-kodeloka" open>
    <summary>Apakah semua kelas di Kodeloka gratis?</summary>
    <p>Ya, seluruh kelas, latihan, dan kuis dapat diakses gratis tanpa perlu membuat akun.</p>
  </details>

  <details name="faq-kodeloka">
    <summary>Di mana progres belajar saya disimpan?</summary>
    <p>Progres, penanda modul, dan catatan Anda disimpan secara lokal di <code>localStorage</code> peramban Anda.</p>
  </details>

  <details name="faq-kodeloka">
    <summary>Urutan kelas apa yang disarankan untuk pemula?</summary>
    <p>Mulailah dari HTML, dilanjutkan dengan CSS, JavaScript, lalu PHP dan PostgreSQL.</p>
  </details>
</section>
```

## 2. Jendela Modal yang Aksesibel dengan `<dialog>`

Elemen `<dialog>` (tersedia lintas peramban sejak Maret 2022 dan berstatus **Baseline Widely Available** sejak September 2024) adalah cara standar untuk membuat jendela dialog, baik **modal** (memblokir interaksi dengan halaman di belakangnya) maupun **non-modal**.

Ketika Anda membuka `<dialog>` menggunakan metode **`dialog.showModal()`**, peramban secara otomatis melakukan lima hal penting untuk Anda:
1. Merender dialog di dalam **Top Layer** (lapisan khusus paling atas di atas seluruh dokumen, sehingga tidak akan pernah tertutup oleh elemen lain meskipun ada `z-index: 999999` atau `overflow: hidden` pada elemen induk!).
2. Membuat seluruh halaman di luar `<dialog>` menjadi **inert** (tidak bisa diklik dan fokus tombol `Tab` terkunci hanya berputar di dalam dialog).
3. Memindahkan fokus papan ketik langsung ke elemen fokusabel pertama di dalam `<dialog>` (atau elemen yang diberi atribut `autofocus`).
4. Menyediakan pseudo-element CSS **`::backdrop`** untuk menggelapkan atau memburamkan latar belakang halaman.
5. Menutup dialog secara otomatis ketika pengguna menekan tombol **`Esc`** di papan ketik, atau ketika `<form method="dialog">` di dalamnya dikirimkan.

```html
<button type="button" id="buka-konfirmasi">Hapus Proyek</button>

<dialog id="dialog-hapus" aria-labelledby="judul-dialog">
  <h2 id="judul-dialog">Konfirmasi Penghapusan Proyek</h2>
  <p>Apakah Anda yakin ingin menghapus proyek <strong>kodeloka-api</strong>? Tindakan ini tidak dapat dibatalkan.</p>

  <!-- Formulir dengan method="dialog" otomatis menutup <dialog> saat tombol ditekan -->
  <form method="dialog">
    <button value="batal" autofocus>Batal</button>
    <button value="hapus" class="tombol-bahaya">Ya, Hapus Permanen</button>
  </form>
</dialog>

<output id="status-aksi"></output>

<script>
  const tombolBuka = document.getElementById("buka-konfirmasi");
  const dialogHapus = document.getElementById("dialog-hapus");
  const statusAksi = document.getElementById("status-aksi");

  tombolBuka.addEventListener("click", () => {
    dialogHapus.showModal();
  });

  dialogHapus.addEventListener("close", () => {
    if (dialogHapus.returnValue === "hapus") {
      statusAksi.textContent = "Proyek berhasil dihapus.";
    } else {
      statusAksi.textContent = "Penghapusan dibatalkan.";
    }
  });
</script>
```

```css
/* Menata tampilan latar belakang modal <dialog> */
dialog::backdrop {
  background-color: rgb(15 23 42 / 0.6);
  backdrop-filter: blur(3px);
}
```

> **💡 Fitur Terbaru pada `<dialog>` (Progresif):**
> Peramban terbaru mulai mendukung atribut deklaratif **Invoker Commands API** (`<button command="show-modal" commandfor="dialog-hapus">`) serta atribut **`closedby="any"`** pada `<dialog>` (untuk mengaktifkan penutupan saat mengeklik area luar / *light dismiss*; didukung di Chrome 134+ dan Firefox 141+, namun belum tersedia di Safari iOS sehingga gunakan sebagai *progressive enhancement*).

## 3. Panel Sembul Deklaratif dengan Popover API (`popover`)

Bagaimana jika Anda ingin membuat panel notifikasi, menu profil, atau petunjuk singkat yang **tidak** memblokir halaman (*non-modal*), tampil di *Top Layer*, dan otomatis tertutup saat pengguna mengeklik di luar panel (*light dismiss*) tanpa menulis JavaScript?

Gunakan **Popover API** (status **Baseline Newly Available** sejak Januari 2025 di Chrome, Edge, Firefox, dan Safari):
1. Tambahkan atribut global **`popover`** (bawaannya bernilai `popover="auto"`) beserta `id` pada elemen panel yang ingin ditampilkan.
2. Tambahkan atribut **`popovertarget="id-panel"`** pada elemen `<button>` pemicunya!

```html
<!-- Tombol pemicu: tanpa satu baris pun kode JavaScript! -->
<button type="button" popovertarget="panel-pintasan">
  Pintasan Papan Ketik (?)
</button>

<!-- Elemen Popover: otomatis tersembunyi sampai tombol ditekan,
     muncul di Top Layer, dan tertutup saat klik di luar atau tekan Esc -->
<div id="panel-pintasan" popover>
  <h3>Pintasan Kelas Kodeloka</h3>
  <ul>
    <li><kbd>/</kbd> — Fokus ke kotak pencarian</li>
    <li><kbd>Alt</kbd> + <kbd>←</kbd> / <kbd>→</kbd> — Pindah modul</li>
    <li><kbd>Esc</kbd> — Tutup panel ini</li>
  </ul>
  <button type="button" popovertarget="panel-pintasan" popovertargetaction="hide">
    Tutup
  </button>
</div>
```

### Kapan Memilih `<dialog>` vs `popover`?
- Gunakan **`<dialog>` dengan `showModal()`** jika pengguna **wajib mengambil keputusan** sebelum melanjutkan interaksi dengan halaman (misalnya konfirmasi hapus data, formulir masuk, atau peringatan kritis) karena halaman belakang harus dibuat *inert*.
- Gunakan **`popover`** untuk panel tambahan yang bersifat **non-modal** (misalnya menu tarik-turun navigasi, daftar notifikasi, pemilih warna, atau kotak bantuan) di mana halaman di sekitarnya tetap boleh berinteraksi.

## 4. Cetakan DOM Inert dengan `<template>`

Elemen `<template>` digunakan untuk menyimpan fragmen markup HTML yang **tidak dirender** oleh peramban saat halaman dimuat (gambar di dalamnya tidak diunduh dan skrip tidak dijalankan), tetapi siap digandakan (*clone*) kapan saja menggunakan JavaScript:

```html
<ul id="daftar-modul"></ul>

<template id="cetakan-baris-modul">
  <li class="item-modul">
    <span class="judul-modul"></span>
    <span class="lencana-tingkat"></span>
  </li>
</template>

<script>
  const daftar = document.getElementById("daftar-modul");
  const cetakan = document.getElementById("cetakan-baris-modul");

  const data = [
    { judul: "01. Cara Web Bekerja", tingkat: "Dasar" },
    { judul: "12. Elemen Interaktif Bawaan", tingkat: "Menengah" }
  ];

  for (const item of data) {
    const salinan = cetakan.content.cloneNode(true);
    salinan.querySelector(".judul-modul").textContent = item.judul;
    salinan.querySelector(".lencana-tingkat").textContent = item.tingkat;
    daftar.appendChild(salinan);
  }
</script>
```

## Kesalahan Umum dan Cara Menghindarinya

1. **Membuka `<dialog>` modal hanya dengan menambahkan atribut `open` di HTML:**
   - **Salah:** Menulis `<dialog open>` atau `dialog.setAttribute("open", "")` untuk dialog yang seharusnya modal. Cara ini hanya membuka dialog secara *non-modal*: latar belakang tidak terkunci (*inert*), `::backdrop` tidak muncul, dan tombol `Esc` tidak berfungsi!
   - **Benar:** Selalu panggil metode JavaScript `dialog.showModal()` untuk membuka dialog modal.
2. **Menambahkan `tabindex="0"` pada elemen `<dialog>`:**
   - **Salah:** Dokumentasi MDN secara tegas memperingatkan agar **tidak** memasang atribut `tabindex` pada elemen `<dialog>` itu sendiri; yang menerima fokus adalah tombol atau input interaktif di dalam `<dialog>` tersebut (gunakan atribut `autofocus` pada tombol batal/tutup atau input pertama).

## Latihan Praktik: Membangun Pusat Bantuan Interaktif

Buatlah berkas `komponen-interaktif.html` yang menggabungkan ketiga komponen modern ini:
1. Daftar 3 pertanyaan FAQ menggunakan `<details name="bantuan-faq">` dan `<summary>` sehingga hanya satu jawaban yang terbuka pada satu waktu.
2. Sebuah tombol *"Lihat Tips Cepat"* yang membuka panel informasi menggunakan atribut `popovertarget` dan `popover` murni tanpa JavaScript.
3. Sebuah tombol *"Kirim Masukan"* yang memanggil `.showModal()` pada elemen `<dialog>` berisi formulir singkat dengan tombol Batal (`formmethod="dialog"`) dan Kirim.

## Kuis Pemahaman

### Soal 1
Apa perbedaan perilaku antara membuka elemen `<dialog>` menggunakan metode `dialog.showModal()` dibandingkan hanya menambahkan atribut `open` (`<dialog open>`)?
- A. `showModal()` hanya berfungsi di peramban ponsel, sedangkan atribut `open` berfungsi di desktop.
- B. `showModal()` menempatkan dialog di *Top Layer*, menampilkan `::backdrop`, mengunci interaksi di luar dialog (*inert*), dan mengaktifkan penutupan dengan tombol `Esc`; sedangkan atribut `open` hanya menampilkannya sebagai kotak non-modal biasa.
- C. Atribut `open` otomatis mengirim data formulir ke server, sedangkan `showModal()` tidak.
- D. Tidak ada perbedaan; keduanya menghasilkan tampilan dan perilaku yang identik.

**Jawaban Benar:** B
**Penjelasan:** Dialog yang dibuka lewat atribut `open` atau metode `.show()` bersifat non-modal. Seluruh kemampuan modalitas bawaan peramban (Top Layer, `::backdrop`, halaman latar belakang menjadi `inert`, penguncian fokus `Tab`, dan penutupan lewat tombol `Esc`) hanya aktif ketika dialog dibuka dengan `showModal()`.

### Soal 2
Bagaimana cara membuat beberapa elemen `<details>` bekerja sebagai akordeon eksklusif (ketika satu dibuka, yang lain otomatis tertutup) tanpa menggunakan JavaScript?
- A. Memberikan atribut `id` yang sama pada semua elemen `<details>`.
- B. Memberikan atribut `name` dengan nilai yang sama pada semua elemen `<details>` dalam kelompok tersebut.
- C. Membungkus semua elemen `<details>` di dalam elemen `<select>`.
- D. Menambahkan atribut `popover="auto"` pada elemen `<summary>`.

**Jawaban Benar:** B
**Penjelasan:** Sejak spesifikasi HTML memperbarui elemen `<details>`, memberikan atribut `name` yang sama pada beberapa elemen `<details>` akan mengelompokkannya layaknya tombol radio: hanya satu elemen `<details>` dalam kelompok nama tersebut yang dapat berstatus `open` pada satu waktu.

### Soal 3
Apa yang terjadi pada isi di dalam elemen `<template>` ketika halaman HTML pertama kali dimuat oleh peramban?
- A. Isi di dalamnya langsung dirender di bagian paling bawah halaman dengan opasitas 50%.
- B. Parser HTML memeriksa validitas sintaksnya, tetapi isinya bersifat *inert* (tidak dirender ke layar, gambar di dalamnya tidak diunduh, dan skrip di dalamnya tidak dijalankan) sampai digandakan lewat JavaScript.
- C. Isi di dalamnya otomatis dihapus dari memori setelah 3 detik.
- D. Peramban mengabaikan aturan CSS pada seluruh halaman jika terdapat elemen `<template>`.

**Jawaban Benar:** B
**Penjelasan:** Konten di dalam `<template>` disimpan di dalam sebuah `DocumentFragment` terpisah (`template.content`) yang tidak aktif. Elemen tersebut baru aktif dan dirender setelah Anda menyalinnya (`template.content.cloneNode(true)`) dan memasukkannya ke dalam pohon DOM dokumen utama.

## Sumber
- [`<dialog>`: The Dialog element — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
- [`popover` HTML global attribute — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover)
- [HTML elements reference (`details`, `summary`, `template`) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
