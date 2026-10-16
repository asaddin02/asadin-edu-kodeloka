# Formulir Web dan Kontrol Masukan Modern

- **Tingkat:** Menengah
- **Ringkasan:** Membangun formulir HTML yang ergonomis dan aksesibel menggunakan `<form>`, `<label>`, `<fieldset>`, beragam tipe `<input>` modern, `<select>`, `<datalist>`, `<textarea>`, serta memahami cara kerja pengiriman data (`GET` vs `POST`).

## Bagaimana Formulir Mengirimkan Data ke Server?

Formulir (`<form>`) adalah jembatan utama bagi pengguna untuk mengirimkan data ke server—mulai dari kotak pencarian, halaman masuk (*login*), hingga pendaftaran akun dan transaksi pembayaran.

Tiga atribut paling mendasar pada `<form>` adalah:
1. **`action`:** Alamat URL tujuan tempat data formulir akan dikirimkan (misalnya `action="/api/pendaftaran"`).
2. **`method`:** Metode HTTP yang digunakan saat mengirim data:
   - **`GET`:** Data dirangkai ke dalam *query string* di URL (contoh: `/cari?q=golang&tingkat=dasar`). Gunakan `GET` **hanya** untuk aksi pengambilan/penyaringan data yang bersifat idempoten (tidak mengubah data di server) dan tidak mengandung informasi rahasia seperti kata sandi.
   - **`POST`:** Data dikirim di dalam tubuh permintaan (*request body*) HTTP, tidak terlihat di bilah alamat URL. Gunakan `POST` untuk semua aksi yang membuat, mengubah, menghapus data, mengirim berkas, atau memuat data sensitif.
   - **`dialog`:** Nilai khusus untuk `<form method="dialog">` yang berada di dalam elemen `<dialog>`; alih-alih mengirim data ke server, pengiriman formulir akan menutup kotak dialog tersebut.
3. **`enctype`:** Cara data dikodekan di dalam *body* saat menggunakan `method="POST"`:
   - `application/x-www-form-urlencoded` (bawaan): Pasangan `name=value` yang dikodekan URL.
   - `multipart/form-data`: **Wajib digunakan** apabila di dalam formulir terdapat `<input type="file">` untuk mengunggah berkas!

## 1. Aturan Wajib: Setiap Kontrol Harus Memiliki `<label>` dan `name`

Dua kesalahan paling fatal saat membuat formulir adalah melupakan `<label>` dan melupakan atribut `name`:

- **Tanpa `<label>` yang terhubung dengan `for="id-input"`:** Pengguna pembaca layar tidak tahu apa yang harus diketik di dalam kotak input tersebut. Selain itu, `<label>` memperluas area klik/sentuh: saat pengguna mengeklik teks label (sangat membantu untuk `<input type="checkbox">` atau `radio` yang berukuran kecil di ponsel), fokus otomatis masuk ke kontrol inputnya!
- **Tanpa atribut `name`:** Saat tombol *Submit* ditekan, peramban menyusun paket data berdasarkan pasangan `name=value`. **Input yang tidak memiliki atribut `name` tidak akan pernah dikirimkan ke server!**

```html
<!-- SALAH: Mengandalkan placeholder sebagai pengganti label, dan lupa atribut name -->
<input type="email" placeholder="Masukkan alamat surel Anda">

<!-- BENAR: Memiliki <label for="...">, id, name, dan autocomplete yang jelas -->
<div class="kelompok-input">
  <label for="surel-pengguna">Alamat Surel</label>
  <input
    type="email"
    id="surel-pengguna"
    name="email"
    autocomplete="email"
    placeholder="nama@contoh.id"
    required
  >
</div>
```

> **⚠️ Kesalahan Umum: Menjadikan `placeholder` sebagai Pengganti `<label>`**
> Teks `placeholder` hilang begitu pengguna mulai mengetik satu huruf, sehingga pengguna mudah lupa format atau tujuan kolom yang sedang diisi. Lebih buruk lagi, teks `placeholder` umumnya memiliki kontras warna abu-abu rendah yang sulit dibaca. Gunakan `<label>` untuk judul kolom, dan gunakan `placeholder` hanya untuk contoh singkat format isian.

## 2. Memilih Tipe `<input>` yang Tepat

Memilih atribut `type` yang spesifik pada `<input>` memberikan dua keuntungan besar secara gratis: **papan ketik virtual yang sesuai di ponsel** (misalnya papan ketik khusus angka atau tombol `@` untuk surel) dan **validasi format otomatis** oleh peramban.

| Nilai `type` | Fungsi & Keuntungan di Perangkat Seluler | Atribut Pendukung Utama |
|---|---|---|
| `text` | Teks satu baris umum | `minlength`, `maxlength`, `pattern`, `spellcheck` |
| `email` | Alamat surel (menampilkan tombol `@` di papan ketik ponsel) | `multiple`, `autocomplete="email"` |
| `password` | Kata sandi (menyembunyikan karakter ketikan) | `autocomplete="current-password"` atau `"new-password"` |
| `search` | Kotak pencarian (menyediakan tombol `×` untuk menghapus isi) | `inputmode="search"` |
| `tel` | Nomor telepon (memunculkan papan ketik telepon numerik) | `inputmode="tel"`, `pattern`, `autocomplete="tel"` |
| `url` | Alamat URL lengkap dengan skema (`https://...`) | `inputmode="url"` |
| `number` | Angka matematis dengan batasan rentang (mis. jumlah barang) | `min`, `max`, `step` |
| `range` | Penggeser nilai (*slider*) | `min`, `max`, `step` |
| `date` / `datetime-local` / `time` | Pemilih tanggal dan waktu bawaan sistem operasi | `min`, `max`, `step` |
| `checkbox` | Pilihan centang (boleh memilih nol, satu, atau banyak) | `checked`, `value` |
| `radio` | Pilihan tunggal dari satu kelompok yang memiliki `name` sama | `checked`, `value`, `required` |
| `file` | Pemilihan berkas dari perangkat atau kamera ponsel | `accept="image/png,image/webp"`, `multiple`, `capture` |
| `hidden` | Data tersembunyi (seperti token CSRF atau ID item) | `name`, `value` |

> **💡 Tips Praktis: Kode OTP dan Nomor Kartu Bukanlah `type="number"`!**
> Kode OTP (`"048291"`), kode pos (`"01234"`), atau nomor kartu identitas bukanlah angka untuk dijumlahkan, melainkan deretan digit yang bisa diawali angka nol (`0`). Jika Anda memakai `type="number"`, angka `0` di depan bisa hilang, muncul tombol panah atas/bawah yang tidak relevan, dan guliran roda tetikus (*scroll wheel*) dapat mengubah angkanya secara tidak sengaja!
> Solusi terbaiknya adalah menggunakan **`type="text"` yang dipadukan dengan `inputmode="numeric"` dan `pattern="[0-9]*"`**:
> ```html
> <label for="kode-otp">Kode Verifikasi 6 Digit</label>
> <input
>   type="text"
>   id="kode-otp"
>   name="otp"
>   inputmode="numeric"
>   pattern="[0-9]{6}"
>   maxlength="6"
>   autocomplete="one-time-code"
>   required
> >
> ```

## 3. Mengelompokkan Pilihan dengan `<fieldset>`, `<legend>`, `<select>`, dan `<datalist>`

### `<fieldset>` dan `<legend>` untuk Radio & Checkbox
Ketika Anda membuat serangkaian tombol radio (`type="radio"`) atau kotak centang (`type="checkbox"`), setiap pilihan memiliki `<label>`-nya sendiri (misalnya *"Dasar"*, *"Menengah"*, *"Lanjut"*). Namun, bagaimana pembaca layar mengetahui **pertanyaan utama** dari kelompok pilihan tersebut? Jawabannya adalah membungkusnya dengan `<fieldset>` dan menulis pertanyaannya di dalam `<legend>`:

```html
<fieldset>
  <legend>Pilih Tingkat Kesulitan Kelas</legend>

  <div>
    <input type="radio" id="tingkat-dasar" name="tingkat" value="dasar" checked>
    <label for="tingkat-dasar">Dasar (Pemula murni)</label>
  </div>

  <div>
    <input type="radio" id="tingkat-menengah" name="tingkat" value="menengah">
    <label for="tingkat-menengah">Menengah (Sudah paham dasar web)</label>
  </div>

  <div>
    <input type="radio" id="tingkat-lanjut" name="tingkat" value="lanjut">
    <label for="tingkat-lanjut">Lanjut (Siap produksi)</label>
  </div>
</fieldset>
```

### `<select>` vs `<datalist>`
- Gunakan **`<select>`** (bersama `<option>` dan `<optgroup>`) ketika pengguna **wajib memilih salah satu opsi yang sudah ditentukan** (misalnya memilih provinsi atau metode pembayaran).
- Gunakan **`<datalist>`** yang dikaitkan ke `<input list="...">` ketika Anda ingin memberikan **saran pelengkapan otomatis (*autocomplete suggestions*)**, tetapi tetap membebaskan pengguna mengetikkan nilai baru yang tidak ada di daftar:

```html
<label for="pilihan-distro">Distribusi Linux yang Anda Gunakan</label>
<input id="pilihan-distro" name="distro" list="daftar-distro" placeholder="Ketik atau pilih...">
<datalist id="daftar-distro">
  <option value="Ubuntu Server 24.04 LTS"></option>
  <option value="Debian 13 (Trixie)"></option>
  <option value="Rocky Linux 9"></option>
  <option value="Arch Linux"></option>
</datalist>
```

### `<textarea>` dan `<output>`
- **`<textarea>`:** Untuk masukan teks multi-baris seperti komentar atau alamat lengkap. Berbeda dengan `<input>`, nilai awal `<textarea>` ditulis di antara tag pembuka dan penutup (`<textarea name="pesan" rows="4">Isi awal</textarea>`).
- **`<output>`:** Elemen semantik untuk menampilkan hasil perhitungan dari masukan pengguna (dan secara otomatis memiliki perilaku *live region* untuk pembaca layar).

## Latihan Praktik: Merancang Formulir Pendaftaran Workshop Kodeloka

Buatlah berkas `formulir-workshop.html` yang mengirimkan data ke `/daftar-workshop` dengan metode `POST` dan mengizinkan pengunggahan berkas:
1. Kolom Nama Lengkap (`text`, `autocomplete="name"`) dan Alamat Surel (`email`, `autocomplete="email"`).
2. Kolom Kode Voucher 5 digit angka menggunakan kombinasi `type="text"`, `inputmode="numeric"`, dan `pattern`.
3. Kelompok pilihan sesi waktu (*Pagi* atau *Malam*) menggunakan `<fieldset>`, `<legend>`, dan `<input type="radio">`.
4. Kolom unggah bukti pendaftaran menggunakan `<input type="file" accept="image/png,image/jpeg,application/pdf">`.
5. Tombol `<button type="submit">Daftar Sekarang</button>` dan `<button type="reset">Kosongkan</button>`.

## Kuis Pemahaman

### Soal 1
Apa yang terjadi apabila sebuah elemen `<input type="text" id="nama-lengkap" required>` di dalam `<form>` tidak memiliki atribut `name` ketika formulir dikirimkan ke server?
- A. Peramban otomatis menggunakan nilai atribut `id` sebagai pengganti `name`.
- B. Nilai yang diketikkan pengguna di dalam input tersebut sama sekali tidak disertakan dalam data permintaan yang dikirim ke server.
- C. Formulir gagal dikirim dan peramban menampilkan pesan galat *"Missing name attribute"*.
- D. Nilai input tetap dikirim dengan nama kunci bawaan `"input_0"`.

**Jawaban Benar:** B
**Penjelasan:** Spesifikasi formulir HTML menetapkan bahwa hanya kontrol formulir yang memiliki atribut `name` (dan tidak berstatus `disabled`) yang nilainya dikumpulkan menjadi *form data set* saat pengiriman.

### Soal 2
Untuk membuat kolom input **6 digit kode OTP** (yang bisa diawali angka `0`, seperti `049120`) agar tetap memunculkan papan ketik angka di layar ponsel tanpa memotong angka nol di depan, kombinasi atribut manakah yang paling tepat?
- A. `<input type="number" max="999999">`
- B. `<input type="text" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code">`
- C. `<input type="tel" step="1">`
- D. `<input type="range" min="000000" max="999999">`

**Jawaban Benar:** B
**Penjelasan:** `type="text"` menjaga nilai sebagai string karakter sehingga angka `0` di awal tidak dibuang, `inputmode="numeric"` menampilkan papan ketik khusus angka di perangkat seluler, `pattern="[0-9]{6}"` memvalidasi tepat 6 digit angka, dan `autocomplete="one-time-code"` membantu sistem operasi menawarkan pengisian otomatis dari SMS/aplikasi autentikator.

### Soal 3
Atribut apakah yang **wajib** ditambahkan pada tag `<form method="post">` jika di dalamnya terdapat elemen `<input type="file">`?
- A. `enctype="application/json"`
- B. `enctype="multipart/form-data"`
- C. `accept="file/*"`
- D. `target="_blank"`

**Jawaban Benar:** B
**Penjelasan:** Pengodean bawaan `application/x-www-form-urlencoded` hanya mampu mengirim teks pasangan kunci-nilai. Untuk mengirimkan byte biner berkas melalui `<input type="file">`, formulir wajib menggunakan `enctype="multipart/form-data"`.

## Sumber
- [`<input>`: The HTML Input element — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input)
- [Forms — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/forms.html)
- [Images, media, and form elements — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Images_media_forms)
