# Validasi Formulir Bawaan dan Constraint Validation API

- **Tingkat:** Menengah
- **Ringkasan:** Memanfaatkan validasi deklaratif HTML5 (`required`, `minlength`, `maxlength`, `min`, `max`, `step`, `pattern`), mengatur gaya visual status validasi dengan `:user-invalid`, serta menyesuaikan pesan galat menggunakan Constraint Validation API.

## Mengapa Validasi Sisi Klien (Client-Side) Penting, dan Apa Batasannya?

Validasi formulir di peramban memiliki satu tujuan utama: **memberikan umpan balik instan kepada pengguna yang jujur**. Daripada pengguna harus menunggu pengiriman formulir ke server hanya untuk diberi tahu bahwa format surel mereka kurang tanda `@`, peramban dapat langsung menandainya dalam hitungan milidetik.

Namun, ingat prinsip keamanan fundamental yang selalu ditekankan di Kodeloka:

> **🚫 Validasi Sisi Klien Bukanlah Pengaman Server!**
> Siapa pun dapat membuka Developer Tools untuk menghapus atribut `required`, memanggil `form.noValidate = true`, atau mengirim permintaan palsu langsung menggunakan `curl`. Oleh karena itu, **setiap aturan validasi yang Anda tulis di HTML/JavaScript wajib selalu divalidasi ulang di sisi server (misalnya dengan PHP atau Go)**. Gunakan validasi HTML untuk kenyamanan pengguna (UX), dan validasi server untuk keamanan data.

## 1. Atribut Validasi Deklaratif HTML5

Tanpa menulis satu baris JavaScript pun, HTML5 menyediakan atribut pembatas (*constraints*) yang langsung diperiksa oleh peramban saat tombol `type="submit"` ditekan:

| Atribut | Berlaku Pada | Fungsi Validasi |
|---|---|---|
| `required` | Hampir semua input, `select`, `textarea` | Kolom wajib diisi (atau wajib dicentang untuk kotak centang *Syarat & Ketentuan*). |
| `minlength` & `maxlength` | `text`, `email`, `password`, `search`, `tel`, `url`, `textarea` | Membatasi jumlah minimal dan maksimal karakter teks. |
| `min` & `max` | `number`, `range`, `date`, `time`, `datetime-local` | Membatasi nilai angka atau tanggal paling kecil dan paling besar. |
| `step` | `number`, `range`, `date`, `time` | Menentukan kelipatan nilai yang sah (mis. `step="1000"` untuk kelipatan Rp1.000, atau `step="0.01"` untuk desimal dua angka). |
| `pattern` | `text`, `search`, `tel`, `url`, `email`, `password` | Mencocokkan nilai dengan ekspresi reguler (*Regular Expression*) penuh. |

### Contoh Penggunaan `pattern` dan `title` yang Ramah Pengguna

Ketika Anda menggunakan atribut `pattern`, **selalu berikan petunjuk format yang jelas di dalam teks bantuan atau atribut `title`**, karena peramban akan menyertakan isi `title` di dalam gelembung pesan galat bawaannya:

```html
<div class="kolom-form">
  <label for="username-kodeloka">Nama Pengguna (Username)</label>
  <input
    type="text"
    id="username-kodeloka"
    name="username"
    required
    minlength="4"
    maxlength="20"
    pattern="[a-z0-9_]+"
    title="Gunakan 4–20 karakter berupa huruf kecil (a-z), angka (0-9), atau garis bawah (_)."
    aria-describedby="bantuan-username"
  >
  <small id="bantuan-username">
    Hanya huruf kecil, angka, dan garis bawah (4–20 karakter, tanpa spasi).
  </small>
</div>
```

> **💡 Catatan Teknis tentang `pattern`:**
> Ekspresi reguler pada atribut `pattern` secara otomatis bersifat *anchored* (seolah-olah dibungkus dengan `^(?:` di awal dan `)$` di akhir). Artinya, pola `pattern="[a-z0-9_]+"` akan memeriksa **seluruh** isi input dari huruf pertama sampai terakhir, sehingga Anda tidak perlu menulis `^` dan `$`.

## 2. Mengatur Gaya CSS: Mengapa `:user-invalid` Lebih Baik daripada `:invalid`?

Di CSS, terdapat pseudo-class `:valid` dan `:invalid` untuk memberi warna bingkai hijau atau merah pada input. Namun, ada satu masalah klasik yang sangat mengganggu pada `:invalid`:

Saat halaman baru saja dibuka dan pengguna **belum sempat mengetik apa pun**, setiap kolom yang memiliki atribut `required` sudah berstatus `:invalid`! Akibatnya, seluruh formulir langsung menyala merah seolah-olah pengguna baru saja melakukan kesalahan.

Solusi modern di CSS (tersedia di semua peramban utama sejak November 2023 dan berstatus **Baseline Widely Available** sejak Mei 2026) adalah menggunakan **`:user-invalid`** dan **`:user-valid`**:
- `:user-invalid` hanya aktif **setelah pengguna benar-benar berinteraksi** dengan kolom tersebut (misalnya mengetik lalu menghapusnya, atau mencoba menekan tombol Submit) dan nilainya masih salah!

```css
/* Bingkai standar saat belum disentuh pengguna */
input, select, textarea {
  border: 1.5px solid #94a3b8;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
}

/* Hanya tampil merah SETELAH pengguna berinteraksi dan isiannya tidak valid */
input:user-invalid,
select:user-invalid,
textarea:user-invalid {
  border-color: #dc2626;
  background-color: #fef2f2;
}

/* Tampil hijau setelah pengguna mengisi dengan benar */
input:user-valid {
  border-color: #16a34a;
}
```

## 3. Mengenal Constraint Validation API Dasar

Bagaimana jika pesan galat bawaan peramban (yang mengikuti bahasa sistem operasi pengguna) kurang jelas, atau Anda perlu memeriksa apakah kolom *"Konfirmasi Kata Sandi"* sama persis dengan kolom *"Kata Sandi Baru"*?

HTML menyediakan **Constraint Validation API** pada setiap elemen kontrol formulir:
- **`elemen.validity`:** Objek `ValidityState` yang berisi properti boolean spesifik penyebab kegagalan:
  - `valueMissing`: Gagal karena `required` kosong.
  - `typeMismatch`: Gagal karena format `type="email"` atau `type="url"` salah.
  - `patternMismatch`: Gagal karena tidak cocok dengan regex `pattern`.
  - `tooShort` / `tooLong`: Gagal karena `minlength` / `maxlength`.
  - `rangeUnderflow` / `rangeOverflow`: Gagal karena `min` / `max`.
  - `valid`: Bernilai `true` jika semua syarat terpenuhi.
- **`elemen.setCustomValidity(pesan)`:** Mengatur pesan galat kustom.
  - **Penting:** Jika Anda memanggil `setCustomValidity("Pesan galat")`, elemen tersebut akan dianggap **tidak valid** sampai Anda memanggil kembali `setCustomValidity("")` (dengan string kosong) saat pengguna memperbaiki isiannya!
- **`elemen.checkValidity()` dan `elemen.reportValidity()`:** Memeriksa status validasi (dan `reportValidity()` sekaligus menampilkan pesan galat ke layar).

```html
<form id="form-sandi">
  <div>
    <label for="sandi-utama">Kata Sandi Baru (min. 8 karakter)</label>
    <input type="password" id="sandi-utama" name="password" minlength="8" required>
  </div>

  <div>
    <label for="sandi-ulang">Ulangi Kata Sandi Baru</label>
    <input type="password" id="sandi-ulang" name="password_confirm" minlength="8" required>
  </div>

  <button type="submit">Simpan Kata Sandi</button>
</form>

<script>
  const sandiUtama = document.getElementById("sandi-utama");
  const sandiUlang = document.getElementById("sandi-ulang");

  function periksaKecocokanSandi() {
    if (sandiUlang.value !== sandiUtama.value) {
      sandiUlang.setCustomValidity("Konfirmasi kata sandi belum sama dengan kata sandi baru.");
    } else {
      // Wajib dikosongkan kembali agar status input kembali valid!
      sandiUlang.setCustomValidity("");
    }
  }

  sandiUtama.addEventListener("input", periksaKecocokanSandi);
  sandiUlang.addEventListener("input", periksaKecocokanSandi);
</script>
```

## Kesalahan Umum dan Cara Menghindarinya

1. **Lupa mereset `setCustomValidity("")` menjadi string kosong:**
   - **Salah:** Memanggil `input.setCustomValidity("Format salah")` saat gagal, tetapi tidak memanggil `input.setCustomValidity("")` saat pengguna sudah memperbaiki ketikannya. Akibatnya, formulir terkunci selamanya dan tidak pernah bisa dikirim!
2. **Menambahkan `novalidate` pada `<form>` tanpa menyediakan pengganti yang aksesibel:**
   - Atribut `<form novalidate>` mematikan gelembung pesan bawaan peramban. Hanya gunakan `novalidate` jika Anda benar-benar menulis skrip pengganti yang menampilkan pesan galat tekstual di layar dan mengaitkannya ke input dengan `aria-invalid="true"` serta `aria-describedby`.

## Latihan Praktik: Formulir Pemesanan Server Cloud dengan Validasi Lengkap

Buatlah berkas `validasi-server.html` untuk pemesanan instans VPS:
1. Kolom *Hostname Server* (`required`, panjang 3–15 karakter, hanya boleh huruf kecil, angka, dan tanda hubung `-`, serta tidak boleh diawali atau diakhiri tanda hubung: `pattern="[a-z0-9]+(-[a-z0-9]+)*"`).
2. Kolom *Jumlah vCPU* (`type="number"`, minimal `2`, maksimal `64`, dan harus kelipatan genap `step="2"`).
3. Aturan CSS menggunakan `:user-invalid` dan `:user-valid` agar warna batas kotak berubah hanya setelah pengguna berinteraksi.

## Kuis Pemahaman

### Soal 1
Apa keunggulan utama pseudo-class CSS `:user-invalid` dibandingkan `:invalid` saat menata gaya visual formulir?
- A. `:user-invalid` dapat memvalidasi data langsung ke basis data di server tanpa JavaScript.
- B. `:user-invalid` baru menerapkan gaya visual salah setelah pengguna berinteraksi dengan kolom input (atau mencoba mengirim formulir), sehingga kolom `required` tidak langsung menyala merah saat halaman pertama kali dibuka.
- C. `:user-invalid` secara otomatis memperbaiki kesalahan ketik pada alamat surel.
- D. `:user-invalid` hanya berlaku untuk elemen `<textarea>`, sedangkan `:invalid` berlaku untuk `<input>`.

**Jawaban Benar:** B
**Penjelasan:** Pseudo-class `:invalid` langsung cocok pada setiap elemen `<input required>` yang masih kosong sejak detik pertama halaman dimuat. `:user-invalid` menunggu hingga pengguna berinteraksi secara nyata dengan input tersebut, sehingga pengalaman visual menjadi jauh lebih ramah dan tidak mengejutkan pengguna.

### Soal 2
Dalam Constraint Validation API, apa yang terjadi jika Anda memanggil `inputElemen.setCustomValidity("Kode kupon sudah kedaluwarsa")` lalu pengguna mengubah isi input tersebut, tetapi kode JavaScript Anda tidak pernah memanggil `inputElemen.setCustomValidity("")`?
- A. Pesan galat otomatis terhapus begitu pengguna mengetik satu huruf baru.
- B. Elemen input tersebut akan terus dianggap tidak valid (`validity.customError === true`) dan menghalangi pengiriman formulir sampai `setCustomValidity("")` dipanggil dengan string kosong.
- C. Peramban akan mengabaikan pesan tersebut setelah 5 detik.
- D. Formulir tetap terkirim tetapi dengan status peringatan.

**Jawaban Benar:** B
**Penjelasan:** Selama `setCustomValidity()` berisi string yang tidak kosong, properti `validity.customError` bernilai `true` dan elemen dianggap tidak valid. Pengembang wajib memanggil `setCustomValidity("")` (string kosong) pada event `input` ketika kondisi galat sudah teratasi.

### Soal 3
Anda ingin membuat input harga barang yang hanya menerima nilai minimal `10000`, maksimal `1000000`, dan wajib berkelipatan `5000`. Kombinasi atribut manakah yang tepat?
- A. `<input type="number" min="10000" max="1000000" step="5000">`
- B. `<input type="text" minlength="10000" maxlength="1000000" pattern="5000">`
- C. `<input type="number" start="10000" end="1000000" interval="5000">`
- D. `<input type="range" value="10000-1000000">`

**Jawaban Benar:** A
**Penjelasan:** Untuk batasan nilai numerik dan kelipatannya pada `type="number"` atau `type="range"`, HTML menggunakan atribut `min`, `max`, dan `step`.

## Sumber
- [Client-side form validation — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation)
- [`<input>`: The HTML Input element — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input)
- [Forms — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/forms.html)
