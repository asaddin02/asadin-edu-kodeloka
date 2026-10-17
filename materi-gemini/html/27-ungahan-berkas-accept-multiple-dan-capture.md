# Input Berkas (`type="file"`), Atribut `accept`, `multiple`, dan Kamera Seluler (`capture`)

- **Tingkat:** Menengah
- **Ringkasan:** Mengonfigurasi pemilihan berkas di formulir HTML menggunakan `<input type="file">`, membatasi ekstensi dan tipe MIME dengan `accept`, mengizinkan banyak berkas dengan `multiple`, serta mengakses kamera/mikrofon ponsel dengan `capture`.

## Mengapa Pengaturan `<input type="file">` Menentukan Keberhasilan Pengunggahan Berkas?

Mengunggah dokumen PDF, foto kartu identitas, atau lampiran tugas merupakan alur kritis di banyak aplikasi web. Namun, jika elemen `<input type="file">` tidak dikonfigurasi dengan benar—misalnya tag `<form>` lupa diberi `enctype="multipart/form-data"` atau atribut `accept` tidak dipasang—pengguna sering salah memilih format berkas, atau server hanya menerima nama berkas berupa teks tanpa isi binernya.

Melalui spesifikasi [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/input.html) dan dokumentasi [`<input type="file">` di MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file), HTML menyediakan atribut deklaratif `accept`, `multiple`, dan `capture` untuk menyempurnakan pengalaman pemilih berkas di desktop maupun ponsel.

## 1. Syarat Wajib Pengiriman Berkas dan Cara Kerja Atribut `accept`

Agar byte biner berkas benar-benar dikirimkan ke server saat tombol kirim ditekan, elemen `<form>` **wajib** memiliki dua atribut:
1. **`method="post"`**: Berkas tidak dapat dikirim melalui query string URL `GET`.
2. **`enctype="multipart/form-data"`**: Tanpa atribut ini, peramban menggunakan pengodean bawaan `application/x-www-form-urlencoded` yang hanya mengirim string nama berkasnya saja, bukan isi berkasnya.

Atribut **`accept`** memberi petunjuk kepada jendela pemilih berkas sistem operasi mengenai jenis berkas apa saja yang relevan. Anda dapat menggabungkan beberapa penentu (*unique file type specifiers*) yang dipisahkan dengan tanda koma:

| Bentuk Nilai `accept` | Contoh Penulisan | Perilaku pada Dialog Pemilih Berkas |
|---|---|---|
| **Ekstensi berkas** (diawali titik, tidak peka huruf besar/kecil) | `accept=".pdf,.docx,.csv"` | Menyaring berkas yang berakhiran `.pdf`, `.docx`, atau `.csv`. |
| **Tipe MIME spesifik** (tanpa parameter) | `accept="image/png,image/jpeg,image/webp"` | Hanya menampilkan format gambar PNG, JPEG, dan WebP (menolak GIF atau SVG). |
| **Kelompok media umum** | `accept="image/*"`, `accept="audio/*"`, `accept="video/*"` | Mengizinkan seluruh format gambar, suara, atau video yang dikenali perangkat. |
| **Gabungan ekstensi & MIME** | `accept=".pdf,image/png,image/jpeg"` | Mengizinkan dokumen PDF maupun gambar PNG/JPEG sekaligus. |

> **🚫 Peringatan Keamanan (`accept` Bukan Validasi Keamanan):** Atribut `accept` hanya menyaring tampilan awal jendela pemilih berkas demi kenyamanan pengguna. Pengguna masih bisa memilih opsi *"Semua Berkas (All Files)"* di jendela sistem operasi atau mengirim berkas `.php` berbahaya menggunakan `curl`. Oleh sebab itu, server backend **wajib** selalu memvalidasi ulang tipe MIME asli (melalui *magic bytes* berkas) dan batas ukuran berkas.

## 2. Mengizinkan Banyak Berkas (`multiple`) dan Mengakses Kamera Ponsel (`capture`)

- **Atribut boolean `multiple`:** Mengizinkan pengguna memilih lebih dari satu berkas sekaligus (dengan menekan `Ctrl`/`Cmd` + klik di desktop, atau mencentang beberapa foto di galeri ponsel). Jika Anda memproses formulir dengan PHP di sisi server, gunakan akhiran kurung siku pada nama input (misalnya `name="lampiran[]"`) agar PHP mengumpulkan seluruh berkas ke dalam array `$_FILES['lampiran']`.
- **Atribut `capture`:** Digunakan bersama `accept="image/*"`, `accept="video/*"`, atau `accept="audio/*"` pada perangkat seluler untuk meminta sistem operasi langsung membuka aplikasi kamera atau perekam suara, alih-alih membuka pemilih dokumen biasa:
  - `capture="user"`: Meminta kamera depan atau mikrofon yang menghadap ke pengguna (cocok untuk swafoto profil atau verifikasi wajah).
  - `capture="environment"`: Meminta kamera belakang yang menghadap ke luar (cocok untuk memotret kuitansi, kode QR, atau dokumen fisik).

Berikut adalah implementasi lengkap yang menggabungkan `accept`, `multiple`, dan `capture`:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unggah Berkas dan Foto — Kodeloka</title>
  </head>
  <body>
    <main>
      <h1>Unggah Berkas dan Foto</h1>
      <form action="/unggah" method="post" enctype="multipart/form-data">
        <p>
          <label for="dokumen">Dokumen pendukung (PDF, PNG, atau JPEG; boleh lebih dari satu)</label><br>
          <input type="file" id="dokumen" name="dokumen" accept=".pdf,image/png,image/jpeg" multiple>
        </p>
        <p>
          <label for="foto-langsung">Foto langsung dari kamera belakang (ponsel)</label><br>
          <input type="file" id="foto-langsung" name="foto" accept="image/*" capture="environment">
        </p>
        <button type="submit">Kirim</button>
      </form>
      <p>
        <code>accept</code> dan <code>multiple</code> didukung semua peramban utama. <code>capture</code>
        hanya berpengaruh di peramban seluler (di desktop diabaikan dan pemilih berkas biasa yang tampil)
        dan belum berstatus Baseline. <code>accept</code> hanya petunjuk bagi pemilih berkas, jadi server
        tetap wajib memeriksa tipe dan ukuran berkas.
      </p>
    </main>
  </body>
</html>
```

## 3. Memeriksa Ukuran dan Tipe Berkas di Sisi Klien dengan Properti `files`

Sebelum pengguna menekan tombol kirim dan menunggu unggahan berkas besar selesai, Anda dapat membaca daftar berkas yang dipilih melalui properti DOM `inputElement.files` (berupa objek `FileList`) untuk menampilkan nama dan ukurannya kepada pengguna:

```html
<label for="berkas-tugas">Pilih Arsip Tugas (.zip, maks. 5 MB)</label>
<input type="file" id="berkas-tugas" name="tugas" accept=".zip,application/zip">
<p id="info-berkas" role="status"></p>

<script>
  const inputTugas = document.getElementById("berkas-tugas");
  const infoBerkas = document.getElementById("info-berkas");
  const MAKS_BYTE = 5 * 1024 * 1024; // 5 MB

  inputTugas.addEventListener("change", () => {
    const berkas = inputTugas.files?.[0];
    if (!berkas) {
      infoBerkas.textContent = "";
      return;
    }
    const ukuranMb = (berkas.size / (1024 * 1024)).toFixed(2);
    if (berkas.size > MAKS_BYTE) {
      inputTugas.setCustomValidity("Ukuran berkas melebihi batas 5 MB.");
      infoBerkas.textContent = `Berkas ${berkas.name} (${ukuranMb} MB) terlalu besar.`;
    } else {
      inputTugas.setCustomValidity("");
      infoBerkas.textContent = `Siap diunggah: ${berkas.name} (${ukuranMb} MB).`;
    }
  });
</script>
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Lupa menambahkan `enctype="multipart/form-data"` pada `<form>`:** Ini kesalahan paling klasik; tanpanya, berkas tidak pernah terkirim ke server.
2. **Memasang `capture` pada input dokumen umum:** Jika Anda memasang `capture="environment"` pada kolom unggah kuitansi, sebagian peramban seluler langsung membuka kamera dan menyulitkan pengguna yang ingin memilih foto kuitansi yang *sudah* tersimpan di galeri ponsel. Gunakan `capture` hanya jika Anda memang menginginkan pengambilan foto langsung saat itu juga.
3. **Menyembunyikan `<input type="file">` dengan `display: none`:** Menyembunyikan input berkas dengan `display: none` atau `visibility: hidden` mengeluarkannya dari urutan fokus tombol `Tab`. Jika ingin menata tombol pemilih berkas, gunakan pseudo-element CSS standar `input[type="file"]::file-selector-button`.

## Latihan Praktik

Buatlah berkas `27-ungahan-berkas-accept-multiple-dan-capture.html` untuk formulir pelaporan masalah teknis:
1. Buat `<form action="/lapor" method="post" enctype="multipart/form-data">`.
2. Sediakan satu `<input type="file">` pertama untuk tangkapan layar galat yang mengizinkan banyak berkas (`multiple`) dan membatasi format hanya pada `.png`, `.jpg`, `.jpeg`, dan `.webp` melalui atribut `accept`.
3. Sediakan satu `<input type="file">` kedua khusus foto perangkat secara langsung menggunakan `accept="image/*"` dan `capture="environment"`.
4. Tambahkan skrip singkat pada event `change` yang menghitung jumlah berkas terpilih (`input.files.length`) dan menampilkannya di dalam elemen `<output>`.

## Kuis Pemahaman

### Soal 1
Manakah penulisan atribut `accept` yang valid pada `<input type="file">` untuk membatasi pemilih berkas agar hanya menawarkan dokumen PDF serta gambar berformat PNG atau JPEG?
- A. `accept="pdf | png | jpeg"`
- B. `accept=".pdf,image/png,image/jpeg"`
- C. `accept="application/pdf; image/png; image/jpeg"`
- D. `accept="*.pdf, *.png, *.jpeg"`

**Jawaban Benar:** B
**Penjelasan:** Menurut spesifikasi HTML, nilai `accept` berupa satu atau lebih penentu tipe berkas unik (ekstensi yang diawali titik seperti `.pdf` atau tipe MIME tanpa parameter seperti `image/png`) yang dipisahkan dengan tanda koma.

### Soal 2
Apa perbedaan perilaku antara `capture="user"` dan `capture="environment"` ketika dipadukan dengan `<input type="file" accept="image/*">` pada peramban perangkat seluler yang mendukungnya?
- A. `capture="user"` mengarahkan ke kamera depan (menghadap pengguna), sedangkan `capture="environment"` mengarahkan ke kamera belakang (menghadap ke luar)
- B. `capture="user"` hanya mengizinkan foto berukuran kecil, sedangkan `capture="environment"` mengizinkan resolusi 4K
- C. `capture="user"` menyimpan foto di memori lokal, sedangkan `capture="environment"` langsung mengirimkannya ke CDN
- D. Keduanya membuka pemilih berkas dokumen PDF di komputer desktop

**Jawaban Benar:** A
**Penjelasan:** Nilai `user` memberi tahu perangkat seluler untuk menggunakan kamera/mikrofon yang menghadap ke pengguna (kamera depan), sedangkan `environment` memilih kamera yang menghadap ke lingkungan luar (kamera belakang). Di komputer desktop, atribut `capture` diabaikan.

### Soal 3
Mengapa server backend tetap wajib memvalidasi tipe MIME dan ukuran berkas yang diunggah meskipun elemen `<input type="file">` di HTML sudah memiliki atribut `accept=".pdf"`?
- A. Karena atribut `accept` hanya berfungsi di peramban Safari
- B. Karena `accept` hanyalah petunjuk antarmuka pada jendela pemilih berkas yang dapat dilewati dengan mudah oleh pengguna atau penyerang melalui permintaan HTTP langsung
- C. Karena atribut `accept` otomatis terhapus saat formulir menggunakan `enctype="multipart/form-data"`
- D. Karena HTML5 tidak mengizinkan atribut `accept` pada metode `POST`

**Jawaban Benar:** B
**Penjelasan:** `accept` membantu pengguna menemukan berkas yang tepat di pemilih berkas, tetapi bukan pengaman keamanan. Pengguna dapat mengubah filter di dialog sistem operasi menjadi *"All Files"* atau mengirim berkas apa pun langsung ke endpoint server.

## Sumber
- [`<input type="file">` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file)
- [`accept` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept)
- [`capture` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/capture)
- [Input element — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/input.html)
