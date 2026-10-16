# Komponen Web Bawaan HTML: `<template>`, `<slot>`, dan Declarative Shadow DOM

- **Tingkat:** Lanjut
- **Ringkasan:** Membangun struktur komponen yang terenkapsulasi dan dapat digunakan ulang langsung di HTML menggunakan `<template>`, proyeksi konten `<slot name="...">`, serta *Declarative Shadow DOM* (`<template shadowrootmode="open">`) tanpa JavaScript.

## Mengapa HTML Memiliki Sistem Komponen Bawaan?

Saat Anda menggunakan elemen bawaan HTML seperti `<video controls>` atau `<input type="date">`, Anda hanya menulis satu tag di HTML, tetapi di layar muncul tombol putar, penggeser volume, dan penghitung waktu yang rapi. Mengapa aturan CSS yang Anda tulis di halaman Anda tidak pernah merusak tombol internal di dalam `<video controls>` tersebut?

Jawabannya adalah karena peramban menyembunyikan struktur internal elemen `<video>` di dalam pohon DOM terisolasi yang disebut **Shadow DOM**.

Kini, melalui standar **Web Components** (`<template>`, `<slot>`, dan **Declarative Shadow DOM**), Anda dapat membangun komponen terenkapsulasi dengan mekanisme yang sama persis!

## 1. Proyeksi Konten dengan `<slot>` dan *Named Slots*

Saat kita membuat sebuah komponen kartu pembungkus (misalnya `<kartu-peringatan>`), kita ingin struktur bingkai, ikon, dan gayanya terkunci rapi di dalam cetakan komponen, tetapi **judul dan isi pesannya dapat diisi secara fleksibel dari luar**.

Elemen **`<slot>`** berfungsi sebagai "lubang tempat pengisian konten" (*content placeholder*):
- **`<slot>` tanpa nama (*Default Slot*):** Menangkap seluruh elemen anak yang tidak memiliki atribut `slot`.
- **`<slot name="judul">` (*Named Slot*):** Menangkap elemen anak dari luar yang diberi atribut **`slot="judul"`**!
- **Konten Bawaan (*Fallback Content*):** Teks atau elemen yang Anda tulis di antara `<slot>...</slot>` akan otomatis tampil apabila pemanggil tidak mengirimkan konten untuk slot tersebut!

## 2. Declarative Shadow DOM (`<template shadowrootmode="open">`)

Dulu, membuat Shadow DOM mengharuskan eksekusi JavaScript (`element.attachShadow({ mode: "open" })`), sehingga komponen tidak bisa dirender langsung dari server (*Server-Side Rendering / SSR*) sebelum JavaScript selesai diunduh.

Sejak Februari 2024 (status **Baseline Newly Available** di seluruh peramban utama Chrome, Edge, Safari, dan Firefox), Anda dapat membuat Shadow DOM **murni dengan HTML tanpa satu baris JavaScript pun** cukup dengan menambahkan atribut **`shadowrootmode="open"`** pada elemen **`<template>`**!

```html
<!-- Komponen Kartu Peringatan dengan Declarative Shadow DOM Murni HTML -->
<div class="komponen-callout">
  <template shadowrootmode="open">
    <style>
      /* Gaya CSS di dalam Shadow DOM ini 100% TERISOLASI!
         Selektor 'h3' dan 'p' di sini TIDAK AKAN PERNAH bocor mempengaruhi
         <h3> atau <p> lain di halaman luar! */
      :host {
        display: block;
        padding: 1rem 1.25rem;
        border-inline-start: 4px solid #2563eb;
        background-color: #eff6ff;
        border-radius: 0.5rem;
        font-family: system-ui, sans-serif;
      }
      header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 700;
        color: #1e3a8a;
        margin-block-end: 0.5rem;
      }
      /* Menata elemen luar yang masuk melalui <slot> menggunakan ::slotted() */
      ::slotted(p) {
        margin: 0;
        color: #1e293b;
      }
    </style>

    <header>
      <span aria-hidden="true">💡</span>
      <!-- Slot bernama "judul" lengkap dengan teks fallback bawaan -->
      <slot name="judul">Catatan Penting</slot>
    </header>

    <div class="isi">
      <!-- Slot default untuk menampung isi utama -->
      <slot>Belum ada rincian catatan.</slot>
    </div>
  </template>

  <!-- Konten di bawah ini adalah "Light DOM" yang diproyeksikan masuk ke dalam <slot> di atas! -->
  <span slot="judul">Tips Keamanan Cookie</span>
  <p>Selalu aktifkan atribut <code>HttpOnly</code> dan <code>Secure</code> pada cookie sesi produksi.</p>
</div>
```

### Keunggulan Besar *Declarative Shadow DOM*:
1. **Langsung Tampil Instan (Bebas FOUC):** Karena parser HTML langsung mengenali `<template shadowrootmode="open">`, gaya dan slot dirender sejak byte HTML pertama tiba, bahkan jika pengguna mematikan JavaScript!
2. **Isolasi Gaya CSS Mutlak:** Aturan `header { ... }` di dalam `<template shadowrootmode="open">` dijamin tidak akan pernah merusak `<header>` situs utama Anda, dan CSS kasar dari luar tidak akan merusak struktur internal komponen (kecuali variabel CSS `--*` dan properti yang diwariskan seperti `font-family` dan `color` yang tetap bisa mengalir masuk!).

## 3. Memahami `:host` dan `::slotted()`

Saat menulis `<style>` di dalam Shadow DOM:
- **`:host`:** Memilih elemen pembungkus tempat Shadow Root tersebut menempel (pada contoh di atas adalah `<div class="komponen-callout">`). Anda juga bisa menulis `:host(.bahaya)` untuk mengubah warna bingkai jika elemen pembungkus diberi kelas `.bahaya`!
- **`::slotted(selektor)`:** Memilih elemen tingkat atas yang dikirimkan dari luar (*Light DOM*) ke dalam `<slot>`.

## Latihan Praktik: Merancang Komponen Tab / Kartu Kode dengan Declarative Shadow DOM

Buatlah berkas `komponen-slot.html`:
1. Buat komponen pembungkus cuplikan kode yang memiliki `<template shadowrootmode="open">`.
2. Sediakan `<slot name="nama-berkas">index.html</slot>` di bagian kepala kotak kode, dan `<slot name="kode"></slot>` di bagian isi.
3. Uji komponen tersebut dua kali: satu kali dengan mengisi atribut `slot="nama-berkas"`, dan satu kali lagi tanpa mengirim `slot="nama-berkas"` untuk membuktikan bahwa teks bawaan (`index.html`) otomatis muncul!

## Kuis Pemahaman

### Soal 1
Apa perbedaan antara `<template>` biasa dan `<template shadowrootmode="open">` ketika dokumen HTML sedang diurai oleh peramban?
- A. Keduanya sama-sama disembunyikan dan wajib dipanggil dengan JavaScript `cloneNode()`.
- B. `<template>` biasa bersifat *inert* (disimpan tetapi tidak dirender sampai digandakan lewat JS), sedangkan `<template shadowrootmode="open">` langsung diubah oleh parser HTML menjadi *Shadow Root* pada elemen induknya dan dirender seketika beserta proyeksi `<slot>`-nya tanpa membutuhkan JavaScript.
- C. `shadowrootmode="open"` menghapus seluruh CSS di halaman utama.
- D. `<template>` biasa hanya boleh berisi teks tanpa tag HTML.

**Jawaban Benar:** B
**Penjelasan:** *Declarative Shadow DOM* (`<template shadowrootmode="open">`) memungkinkan pembuatan Shadow Root secara deklaratif langsung pada tahap *HTML parsing*, sehingga komponen Web dapat dirender di sisi server (SSR) dan langsung tampil tanpa menunggu eksekusi JavaScript.

### Soal 2
Bagaimana cara elemen anak di luar (*Light DOM*) menentukan bahwa dirinya harus masuk ke dalam `<slot name="kaki-kartu"></slot>` di dalam sebuah Shadow DOM?
- A. Dengan menambahkan atribut `id="kaki-kartu"` pada elemen anak tersebut.
- B. Dengan menambahkan atribut `slot="kaki-kartu"` pada elemen anak tersebut.
- C. Dengan menambahkan kelas `class="slot-kaki-kartu"`.
- D. Dengan membungkusnya di dalam tag `<footer-slot>`.

**Jawaban Benar:** B
**Penjelasan:** Atribut global HTML `slot="nama-slot"` memasangkan elemen anak dari *Light DOM* langsung ke elemen `<slot name="nama-slot">` yang sesuai di dalam *Shadow DOM* induknya.

### Soal 3
Apa yang ditampilkan oleh elemen `<slot name="status">Aktif</slot>` apabila pemanggil komponen **tidak** menyertakan elemen anak dengan atribut `slot="status"`?
- A. Ruang kosong (tidak menampilkan apa pun).
- B. Menampilkan konten bawaan (*fallback content*) yang tertulis di dalam tag `<slot>`, yaitu teks `"Aktif"`.
- C. Menampilkan pesan galat di konsol peramban.
- D. Menyembunyikan seluruh komponen kartu.

**Jawaban Benar:** B
**Penjelasan:** Konten apa pun yang diletakkan di antara tag pembuka `<slot>` dan tag penutup `</slot>` berfungsi sebagai nilai bawaan (*default/fallback content*) yang otomatis dirender apabila slot tersebut tidak diisi oleh pemanggil.

## Sumber
- [Using templates and slots — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)
- [Web Components — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- [HTML Standard (`template` and `slot` elements) — WHATWG](https://html.spec.whatwg.org/multipage/)
