# Pola Formulir Lanjutan: Atribut `form`, Token `autocomplete`, `<meter>`, dan `<progress>`

- **Tingkat:** Menengah
- **Ringkasan:** Merancang pengalaman formulir tingkat lanjut dengan memanfaatkan token `autocomplete` spesifik, mengaitkan kontrol di luar elemen `<form>` menggunakan atribut `form="id"`, membedakan `<progress>` vs `<meter>`, serta menggunakan beberapa tombol submit dengan `formaction`.

## 1. Mempercepat Pengisian Formulir 10x Lipat dengan Token `autocomplete` Spesifik

Sebagian besar pengembang hanya tahu `autocomplete="on"` atau `autocomplete="off"`. Padahal, spesifikasi HTML menyediakan **puluhan token `autocomplete` standar** yang memberitahu peramban dan pengelola kata sandi (*password manager*) secara persis data apa yang diminta oleh sebuah kolom input!

Ketika Anda menuliskan token `autocomplete` yang tepat, pengguna ponsel cukup menyentuh satu kali untuk mengisi nama, alamat, kode pos, atau kata sandi baru secara akurat:

| Token `autocomplete` | Gunakan Pada Kolom Input |
|---|---|
| `name` | Nama lengkap pengguna (atau gunakan `given-name` dan `family-name` jika dipisah). |
| `username` | Nama pengguna atau surel yang dipakai untuk masuk (*login*). |
| `email` | Alamat surat elektronik. |
| **`current-password`** | Kata sandi saat ini pada **halaman Masuk (Login)** atau konfirmasi ubah sandi. |
| **`new-password`** | Kata sandi baru pada **halaman Daftar Akun Baru** atau **Ganti Kata Sandi** (memicu peramban menawarkan pembuatan kata sandi acak yang kuat!). |
| **`one-time-code`** | Kode verifikasi OTP 6 digit yang dikirim lewat SMS/autentikator. |
| `tel` | Nomor telepon lengkap dengan kode negara. |
| `organization` | Nama perusahaan, kampus, atau instansi. |
| `street-address` / `postal-code` / `country` | Alamat jalan, kode pos, dan kode negara. |
| `cc-name` / `cc-number` / `cc-exp` / `cc-csc` | Informasi kartu pembayaran. |

```html
<!-- Contoh Formulir Ganti Kata Sandi yang Ramah Password Manager -->
<form action="/akun/ubah-sandi" method="post">
  <!-- Menyertakan username tersembunyi membantu Password Manager mengenali akun mana yang sedang diubah sandinya -->
  <input type="text" name="username" value="nadia@asadinedu.com" autocomplete="username" hidden>

  <div>
    <label for="sandi-lama">Kata Sandi Saat Ini</label>
    <input type="password" id="sandi-lama" name="old_password" autocomplete="current-password" required>
  </div>

  <div>
    <label for="sandi-baru">Kata Sandi Baru</label>
    <input type="password" id="sandi-baru" name="new_password" autocomplete="new-password" minlength="12" required>
  </div>

  <button type="submit">Perbarui Kata Sandi</button>
</form>
```

## 2. Mengaitkan Input atau Tombol di Luar `<form>` dengan Atribut `form="..."`

Terkadang tuntutan tata letak antarmuka (misalnya tombol *"Simpan Perubahan"* berada di pojok kanan atas bilah `<header>` atau di kaki modal `<dialog>`, sedangkan elemen `<form>` berada di tengah halaman) membuat Anda tidak bisa meletakkan `<button type="submit">` sebagai anak langsung di dalam `<form>`.

Jangan menulis kode JavaScript rumit hanya untuk memanggil `form.submit()`! Gunakan atribut HTML **`form="id-formulir"`** pada `<input>`, `<select>`, `<textarea>`, atau `<button>`:

```html
<header>
  <h1>Edit Artikel Modul</h1>
  <!-- Tombol ini berada di luar <form>, tetapi tetap mengirim #form-artikel dengan validasi penuh! -->
  <button type="submit" form="form-artikel">Simpan dan Terbitkan</button>
</header>

<main>
  <form id="form-artikel" action="/artikel/simpan" method="post">
    <label for="judul-artikel">Judul Artikel</label>
    <input type="text" id="judul-artikel" name="judul" required>
  </form>
</main>
```

## 3. Satu Formulir dengan Dua Tujuan Berbeda (`formaction` & `formnovalidate`)

Bagaimana jika sebuah formulir penulisan artikel memiliki dua tombol:
1. **"Terbitkan Artikel"**: Mengirim ke `/artikel/terbitkan` dan **wajib** lulus seluruh validasi (`required`, `minlength`).
2. **"Simpan sebagai Draf"**: Mengirim ke `/artikel/simpan-draf` dan **boleh** disimpan meskipun artikel belum selesai ditulis (melewati validasi `required`)!

Anda dapat menempelkan atribut **`formaction`** dan **`formnovalidate`** langsung pada tombol kedua:

```html
<form action="/artikel/terbitkan" method="post">
  <label for="isi-artikel">Isi Materi (Minimal 500 karakter untuk diterbitkan)</label>
  <textarea id="isi-artikel" name="isi" minlength="500" required></textarea>

  <div class="aksi-form">
    <!-- Tombol 1: Melewati validasi required/minlength dan mengirim ke endpoint draf -->
    <button
      type="submit"
      formaction="/artikel/simpan-draf"
      formnovalidate
    >
      Simpan sebagai Draf Sementara
    </button>

    <!-- Tombol 2: Menjalankan validasi penuh dan mengirim ke /artikel/terbitkan -->
    <button type="submit">Terbitkan Sekarang</button>
  </div>
</form>
```

## 4. Membedakan `<progress>` vs `<meter>`

HTML memiliki dua elemen batang visual yang sering tertukar fungsinya:

1. **`<progress>` (Batang Kemajuan Tugas):**
   Digunakan untuk menunjukkan **seberapa jauh suatu proses sedang berjalan menuju 100% selesai** (misalnya progres mengunggah berkas atau progres menyelesaikan 8 dari 20 modul kelas). Jika atribut `value` tidak ditulis (`<progress>Memuat...</progress>`), ia tampil dalam mode *indeterminate* (bergerak bolak-balik menandakan proses sedang berlangsung namun persentasenya belum diketahui).
2. **`<meter>` (Alat Ukur Skalar / Gauge):**
   Digunakan untuk menampilkan **ukuran nilai di dalam rentang yang diketahui dan memiliki ambang batas baik/waspada/kritis**—seperti kapasitas pemakaian diska server, kekuatan kata sandi, atau suhu CPU! `<meter>` mendukung atribut `min`, `max`, `low`, `high`, dan `optimum` sehingga peramban otomatis mengubah warnanya menjadi hijau, kuning, atau merah!

```html
<!-- 1. <progress>: Kemajuan menyelesaikan bab kelas -->
<div>
  <label for="progres-belajar">Kemajuan Kelas HTML:</label>
  <progress id="progres-belajar" value="18" max="20">90% (18 dari 20 modul)</progress>
</div>

<!-- 2. <meter>: Penggunaan diska server dengan ambang batas aman (optimum < low < high) -->
<div>
  <label for="pemakaian-diska">Ruang Penyimpanan Server (/dev/sda1):</label>
  <meter
    id="pemakaian-diska"
    min="0"
    max="100"
    low="70"
    high="90"
    optimum="20"
    value="92"
  >
    92% terpakai (Kritis)
  </meter>
</div>
```

## Latihan Praktik: Antarmuka Editor Modul dengan Simpan Draf dan Indikator Kuota

Buatlah berkas `form-lanjutan.html`:
1. Buat `<form id="editor-modul" action="/modul/terbitkan" method="post">` dengan input judul dan isi.
2. Letakkan tombol *"Terbitkan"* dan tombol *"Simpan Draf"* (`formaction="/modul/draf" formnovalidate`) di luar tag `<form>` (di dalam `<header>`) dengan mengaitkannya menggunakan atribut `form="editor-modul"`.
3. Tampilkan indikator kelengkapan belajar dengan `<progress>` dan indikator pemakaian kuota penyimpanan dengan `<meter>`.

## Kuis Pemahaman

### Soal 1
Nilai atribut `autocomplete` manakah yang harus dipasang pada kolom input kata sandi di halaman **Pendaftaran Akun Baru** agar peramban tidak salah mengisinya dengan kata sandi lama dan justru menawarkan pembuatan kata sandi acak yang kuat?
- A. `autocomplete="off"`
- B. `autocomplete="current-password"`
- C. `autocomplete="new-password"`
- D. `autocomplete="one-time-code"`

**Jawaban Benar:** C
**Penjelasan:** Token `autocomplete="new-password"` secara spesifik memberi tahu pengelola kata sandi peramban bahwa pengguna sedang membuat kata sandi baru (baik saat registrasi maupun saat mereset kata sandi), bukan sedang login (`current-password`).

### Soal 2
Bagaimana cara membuat sebuah `<button type="submit">` yang berada di dalam `<header>` (di luar elemen `<form id="form-utama">`) tetap dapat mengirimkan formulir tersebut beserta seluruh validasi bawaannya tanpa menggunakan JavaScript?
- A. Menambahkan atribut `target="form-utama"` pada tombol tersebut.
- B. Menambahkan atribut `form="form-utama"` pada tombol tersebut.
- C. Menambahkan atribut `for="form-utama"` pada tombol tersebut.
- D. Tidak mungkin dilakukan tanpa `document.getElementById('form-utama').submit()`.

**Jawaban Benar:** B
**Penjelasan:** Atribut `form="id_form"` pada elemen kontrol formulir (`<button>`, `<input>`, `<select>`, `<textarea>`) mengaitkan kontrol tersebut secara resmi ke elemen `<form>` yang memiliki `id` yang sesuai meskipun posisinya berada di luar pohon DOM `<form>`.

### Soal 3
Kapan Anda harus memilih elemen `<meter>` dibandingkan elemen `<progress>`?
- A. Ketika menampilkan persentase unduhan berkas yang sedang berjalan dari 0% menuju 100%.
- B. Ketika menampilkan nilai pengukuran dalam suatu rentang terukur yang memiliki batas rendah/tinggi/optimal (seperti persentase pemakaian RAM server, sisa kapasitas baterai, atau tingkat kekuatan kata sandi), bukan kemajuan penyelesaian suatu tugas.
- C. Ketika waktu selesainya proses belum diketahui (*indeterminate*).
- D. Ketika ingin membuat tombol penggeser (*slider*) yang bisa digeser oleh pengguna.

**Jawaban Benar:** B
**Penjelasan:** `<progress>` mewakili kemajuan penyelesaian suatu tugas (*task completion*), sedangkan `<meter>` mewakili pengukuran skalar dalam rentang yang diketahui (*gauge*) lengkap dengan dukungan nilai `low`, `high`, dan `optimum`.

## Sumber
- [Forms — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/forms.html)
- [`<input>`: The HTML Input element (`autocomplete`) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input)
- [HTML elements reference (`<meter>`, `<progress>`) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
