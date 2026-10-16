# Atribut Global Interaktif: `contenteditable`, `spellcheck`, `autocapitalize`, `enterkeyhint`, dan `draggable`

- **Tingkat:** Menengah
- **Ringkasan:** Mengoptimalkan ergonomi papan ketik seluler dan penyuntingan langsung menggunakan atribut global `contenteditable="plaintext-only"`, `enterkeyhint`, `inputmode`, `autocapitalize`, `spellcheck`, dan `draggable`. 

## 1. Ergonomi Papan Ketik Layar Sentuh: `inputmode`, `enterkeyhint`, dan `autocapitalize`

Lebih dari separuh trafik web berasal dari ponsel pintar. Dengan menambahkan tiga atribut global ini pada elemen input atau editor Anda, pengalaman mengetik pengguna di Android dan iOS meningkat drastis:

### A. `enterkeyhint`: Mengubah Label Tombol Enter di Papan Ketik Ponsel
Tahukah Anda bahwa Anda bisa mengubah tulisan dan ikon tombol `Enter` di pojok kanan bawah papan ketik ponsel menjadi **"Cari" (🔍)**, **"Kirim"**, **"Berikutnya"**, atau **"Selesai"**?

| Nilai `enterkeyhint` | Tampilan Tombol Enter di Ponsel | Gunakan Pada |
|---|---|---|
| `search` | Ikon Kaca Pembesar / "Cari" | Kotak pencarian (`<input type="search">`). |
| `send` | "Kirim" / Ikon Pesawat Kertas | Kotak ketik pesan obrolan (*chat*) atau komentar cepat. |
| `next` | "Berikutnya" ($ightarrow$) | Kolom formulir yang masih memiliki kolom lanjutan di bawahnya. |
| `done` | "Selesai" ($\checkmark$) | Kolom terakhir pada formulir. |
| `go` | "Buka" / "Masuk" | Bilah alamat URL atau input kode akses langsung. |

### B. `autocapitalize` dan `spellcheck`
Pada ponsel pintar, papan ketik secara bawaan selalu mengubah huruf pertama yang diketik menjadi huruf kapital (`autocapitalize="sentences"`), serta menggarisbawahi kata yang tidak ada di kamus (`spellcheck="true"`).
Perilaku ini **sangat mengganggu** ketika pengguna sedang mengetik **nama pengguna (`username`), kode perintah terminal, alamat server, atau kode kupon**!

```html
<!-- Mematikan kapitalisasi otomatis dan pemeriksa ejaan kamus untuk input teknis -->
<label for="input-perintah">Ketik Perintah Shell Linux</label>
<input
  type="text"
  id="input-perintah"
  name="command"
  autocapitalize="none"
  autocomplete="off"
  spellcheck="false"
  enterkeyhint="send"
>
```

## 2. Penyuntingan Langsung di Tempat dengan `contenteditable`

Atribut global **`contenteditable`** mengubah elemen HTML biasa (seperti `<div>`, `<p>`, atau `<td>`) menjadi area yang teksnya dapat langsung disunting oleh pengguna:

- **`contenteditable="true"`:** Mengizinkan penyuntingan kaya (*rich text*). Namun, kelemahan besarnya adalah ketika pengguna menyalin-tempel (*paste*) teks dari situs lain atau Microsoft Word, peramban ikut menyisipkan puluhan tag `<span style="font-family: Comic Sans...">` yang mengotori DOM Anda!
- **`contenteditable="plaintext-only"` (Baseline Newly Available sejak Maret 2025 di semua peramban utama!):** Mengizinkan penyuntingan teks murni saja! Ketika pengguna melakukan *paste*, seluruh pemformatan HTML luar otomatis dibuang dan hanya teks bersih yang masuk!

```html
<div
  class="catatan-cepat"
  contenteditable="plaintext-only"
  role="textbox"
  aria-multiline="true"
  aria-label="Catatan pribadi modul ini"
  spellcheck="true"
>Ketik catatan belajar Anda langsung di sini...</div>
```

> **⚠️ Catatan Aksesibilitas untuk `contenteditable`:**
> Jika Anda benar-benar hanya membutuhkan kotak masukan teks multi-baris, **selalu utamakan `<textarea>` asli** (karena sudah mendukung pengiriman `<form>`, atribut `name`, dan dikenali semua pembaca layar). Gunakan `contenteditable="plaintext-only"` hanya untuk komponen khusus yang membutuhkan penyuntingan langsung di dalam struktur kartu/tabel, dan selalu tambahkan `role="textbox"` serta `aria-label`!

## 3. Atribut `draggable="true"` untuk *Drag and Drop*

Secara bawaan di HTML, hanya gambar (`<img>`) dan tautan (`<a href="...">`) yang dapat diseret dengan tetikus. Untuk membuat kartu papan tugas (*Kanban board*) dapat diseret menggunakan HTML Drag and Drop API, tambahkan atribut **`draggable="true"`** (dan jangan lupa sediakan tombol alternatif atas/bawah bagi pengguna papan ketik!).

## Latihan Praktik: Antarmuka Chat Teknis & Editor Catatan Bersih

Buatlah berkas `interaksi-global.html`:
1. Buat kotak input perintah terminal dengan `autocapitalize="none"`, `spellcheck="false"`, dan `enterkeyhint="send"`.
2. Buat kotak catatan cepat dengan `contenteditable="plaintext-only"`, `role="textbox"`, dan `aria-label`. Uji dengan menyalin teks berwarna/tebal dari halaman web lain ke dalamnya untuk membuktikan bahwa hanya teks murni yang tertempel!

## Kuis Pemahaman

### Soal 1
Apa keunggulan utama menggunakan `contenteditable="plaintext-only"` dibandingkan `contenteditable="true"`?
- A. `plaintext-only` hanya mengizinkan angka
- B. `plaintext-only` mencegah masuknya tag HTML dan gaya inline yang tidak diinginkan ketika pengguna menempelkan (*paste*) teks dari sumber lain, sehingga hanya teks murni yang disisipkan
- C. `plaintext-only` otomatis menyimpan teks ke server
- D. `contenteditable="true"` sudah tidak didukung lagi oleh peramban

**Jawaban Benar:** B
**Penjelasan:** Nilai `plaintext-only` (kini didukung lintas peramban utama) menyederhanakan pembuatan editor teks di tempat dengan menolak penyisipan markup HTML kaya saat pengguna melakukan *copy-paste* atau menekan pintasan tebal/miring.

### Soal 2
Mengapa pada kolom input *Username* atau *Hostname Server* kita sangat disarankan memasang `autocapitalize="none"` dan `spellcheck="false"`?
- A. Agar input tersebut tidak bisa dikosongkan
- B. Untuk mencegah papan ketik layar sentuh ponsel mengubah huruf pertama menjadi huruf besar secara otomatis dan mencegah kamus ejaan mengubah/menggarisbawahi nama teknis pengguna
- C. Untuk menyembunyikan karakter seperti kolom kata sandi
- D. Agar papan ketik hanya menampilkan angka

**Jawaban Benar:** B
**Penjelasan:** Papan ketik perangkat seluler secara bawaan mengaktifkan kapitalisasi huruf pertama kalimat dan koreksi ejaan kamus, yang sangat mengganggu saat pengguna mengetik identifier teknis berhuruf kecil seperti `server-prod-01`.

### Soal 3
Atribut global apakah yang mengubah label atau ikon tombol `Enter` pada papan ketik virtual ponsel menjadi tombol **"Cari"** atau **"Kirim"**?
- A. `inputmode`
- B. `enterkeyhint`
- C. `accesskey`
- D. `tabindex`

**Jawaban Benar:** B
**Penjelasan:** Atribut global `enterkeyhint` (dengan nilai `search`, `send`, `next`, `done`, `go`, `previous`, `enter`) menyesuaikan tampilan visual tombol aksi pada papan ketik virtual perangkat layar sentuh.

## Sumber
- [Global attributes (contenteditable, enterkeyhint, autocapitalize, spellcheck) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [User interaction — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/)
