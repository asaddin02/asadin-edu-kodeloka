# Melacak Perubahan Teks (`<ins>`, `<del>`, `<s>`) dan Semantik Editorial

- **Tingkat:** Dasar
- **Ringkasan:** Menandai riwayat penyuntingan dokumen secara semantik menggunakan `<ins>` dan `<del>` (beserta atribut `cite` dan `datetime`), membedakan `<del>` dari `<s>`, serta menggunakan `<abbr>`, `<dfn>`, dan `<address>`.

## Membedakan Teks yang Dihapus (`<del>`) dan Teks yang Tidak Lagi Relevan (`<s>`)

Di HTML, ada dua elemen yang secara visual sama-sama menampilkan garis coret di tengah teks (*strikethrough*), tetapi memiliki makna semantik yang berbeda:

1. **`<del>` (*Deleted Text*) dan `<ins>` (*Inserted Text*):**
   Digunakan untuk menunjukkan **riwayat revisi atau perubahan naskah** (seperti *diff* pada dokumen hukum, daftar perubahan rilis perangkat lunak/*changelog*, atau revisi daftar tugas). Keduanya mendukung atribut **`datetime`** (kapan perubahan dilakukan) dan **`cite`** (URL penjelasan alasan perubahan)!
2. **`<s>` (*Strikethrough / Inaccurate Text*):**
   Digunakan untuk menandai hal yang **sudah tidak akurat atau tidak lagi berlaku**, tanpa menyiratkan bahwa kata tersebut disunting keluar dari dokumen—contoh paling klasiknya adalah **harga asli sebelum diskon** atau **tiket acara yang sudah habis terjual**!

```html
<!-- 1. Kasus Harga Diskon: Gunakan <s>, ditambah teks bantu untuk pembaca layar -->
<p class="harga-produk">
  <span class="sembunyi-visual">Harga normal:</span>
  <s>Rp 450.000</s>
  <span class="sembunyi-visual">Harga promo sekarang:</span>
  <strong>Rp 299.000</strong>
</p>

<!-- 2. Kasus Revisi Dokumen / Changelog: Gunakan <del> dan <ins> dengan datetime -->
<article>
  <h2>Catatan Perubahan Kebijakan API v2</h2>
  <p>
    Batas permintaan (<em>rate limit</em>) untuk akun gratis adalah
    <del datetime="2026-09-01">60 permintaan per menit</del>
    <ins datetime="2026-10-01" cite="/pengumuman/kenaikan-kuota">120 permintaan per menit</ins>.
  </p>
</article>
```

## 2. Mendefinisikan Istilah (`<dfn>`), Singkatan (`<abbr>`), dan Kontak (`<address>`)

### A. `<dfn>` (*Defining Instance*) dan `<abbr>` (*Abbreviation*)
- Gunakan **`<dfn>`** tepat pada kalimat tempat sebuah istilah teknis **pertama kali didefinisikan** di dalam artikel Anda.
- Gunakan **`<abbr title="Kepanjangan">`** untuk singkatan atau akronim:

```html
<p>
  <dfn id="def-idempoten">Idempoten</dfn> (<em>Idempotent</em>) adalah sifat operasi
  dalam matematika dan ilmu komputer di mana menjalankan operasi yang sama berkali-kali
  akan memberikan dampak status server yang sama persis seperti menjalankannya satu kali,
  contohnya metode <abbr title="Hypertext Transfer Protocol">HTTP</abbr> <code>GET</code>,
  <code>PUT</code>, dan <code>DELETE</code>.
</p>
```

### B. Aturan Semantik Elemen `<address>`
Banyak pemula mengira `<address>` dipakai untuk membungkus sembarang alamat jalan fisik (seperti alamat gedung kantor cabang di dalam daftar tabel).
Menurut spesifikasi [WHATWG HTML](https://html.spec.whatwg.org/multipage/), elemen **`<address>` hanya boleh digunakan untuk menyediakan informasi kontak dari penulis artikel (`<article>`) atau pemilik dokumen halaman (`<body>`)**—yang bisa berupa tautan surel, akun media sosial penulis, maupun alamat korespondensi resmi!

```html
<article>
  <h1>Panduan Keamanan Jaringan Linux</h1>
  <p>Isi pembahasan artikel...</p>
  <footer>
    <address>
      Ada koreksi teknis pada artikel ini? Hubungi penulis di
      <a href="mailto:tim-linux@asadinedu.com">tim-linux@asadinedu.com</a>.
    </address>
  </footer>
</article>
```

## Latihan Praktik: Menyusun Halaman Catatan Rilis (*Release Notes*) dan Glosarium

Buatlah berkas `editorial-semantik.html`:
1. Buat pengumuman perubahan harga paket server yang menggunakan `<s>` untuk harga lama dan `<strong>` untuk harga baru.
2. Buat daftar perubahan kebijakan layanan menggunakan pasangan `<del datetime="...">` dan `<ins datetime="...">`.
3. Buat paragraf penjelasan istilah menggunakan `<dfn>` dan `<abbr>`, lalu tutup artikel dengan informasi kontak penulis di dalam `<address>`.

## Kuis Pemahaman

### Soal 1
Elemen HTML manakah yang paling tepat secara semantik untuk mencoret harga normal sebelum diskon (misalnya mencoret `Rp 200.000` di sebelah harga promo `Rp 120.000`)?
- A. `<del>`
- B. `<s>`
- C. `<strike>`
- D. `<ins>`

**Jawaban Benar:** B
**Penjelasan:** Menurut spesifikasi HTML, `<s>` merepresentasikan informasi yang sudah tidak lagi akurat atau tidak lagi relevan (seperti harga normal sebelum diskon), sedangkan `<del>` merepresentasikan penghapusan teks dalam riwayat penyuntingan dokumen. Adapun `<strike>` sudah usang (*obsolete*).

### Soal 2
Kapan penggunaan elemen `<address>` tepat menurut spesifikasi HTML?
- A. Untuk membungkus setiap alamat pengiriman pelanggan di dalam tabel daftar pesanan
- B. Untuk menyediakan informasi kontak (surel, tautan profil, atau alamat korespondensi) yang berkaitan dengan penulis `<article>` terdekat atau pemilik dokumen `<body>` secara keseluruhan
- C. Untuk menuliskan alamat IP server seperti `192.168.1.1`
- D. Untuk menggantikan fungsi tag `<a href="mailto:...">`

**Jawaban Benar:** B
**Penjelasan:** Elemen `<address>` secara khusus memiliki semantik informasi kontak untuk leluhur `<article>` atau `<body>` terdekat, bukan penanda alamat pos sembarangan.

### Soal 3
Atribut apa sajakah yang didukung secara khusus oleh elemen `<ins>` dan `<del>` untuk mendokumentasikan riwayat revisi?
- A. `src` dan `alt`
- B. `cite` (URL dokumen yang menjelaskan alasan perubahan) dan `datetime` (waktu terjadinya perubahan)
- C. `action` dan `method`
- D. `scope` dan `headers`

**Jawaban Benar:** B
**Penjelasan:** Kedua elemen penyuntingan `<ins>` dan `<del>` memiliki atribut spesifik `cite` dan `datetime` untuk merekam metadata audit perubahan.

## Sumber
- [Text-level semantics — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/text-level-semantics.html)
- [HTML elements reference (<del>, <ins>, <s>, <address>) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
