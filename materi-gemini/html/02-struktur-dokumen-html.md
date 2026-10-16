# Struktur Dokumen HTML Modern dan Atribut Global

- **Tingkat:** Dasar
- **Ringkasan:** Membedah anatomi dokumen HTML5 yang valid mulai dari deklarasi DOCTYPE, elemen akar, pengaturan karakter UTF-8, viewport responsif, hingga aturan sintaks dan atribut global.

## Anatomi Kerangka Dokumen HTML

Setiap halaman web yang baik dimulai dari kerangka dokumen yang bersih dan mengikuti standar [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/). Berikut adalah kerangka dasar minimal yang siap dipakai untuk proyek modern:

```html
<!DOCTYPE html>
<html lang="id" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panduan Struktur HTML — Kodeloka</title>
    <meta name="description" content="Pelajari anatomi dokumen HTML modern yang valid dan aksesibel.">
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <main>
      <h1>Halo, Dunia Web!</h1>
      <p>Dokumen ini menggunakan struktur standar HTML modern.</p>
    </main>
  </body>
</html>
```

Mari kita bedah fungsi setiap baris agar Anda tidak sekadar menyalin tempel (*copy-paste*) tanpa memahami alasannya.

### 1. `<!DOCTYPE html>`: Penjaga Mode Standar (*Standards Mode*)

Pada era awal web (sekitar akhir 1990-an), halaman web sering ditulis khusus untuk perilaku unik Netscape Navigator atau Internet Explorer 5. Ketika standar W3C/WHATWG diperkenalkan, peramban tidak bisa begitu saja mengubah cara mereka merender halaman lama karena jutaan situs lama akan hancur tampilannya.

Solusinya adalah dua mode perenderan di dalam peramban:
- **Standards Mode (Mode Standar):** Peramban mematuhi spesifikasi HTML dan CSS modern secara ketat.
- **Quirks Mode (Mode Lawas):** Peramban meniru bug dan perilaku peramban tahun 1990-an (misalnya perhitungan tabel dan kotak yang tidak konsisten).

Baris `<!DOCTYPE html>` di baris paling pertama adalah saklar yang memaksa peramban masuk ke **Standards Mode**. Tanpa baris ini, peramban akan jatuh ke *Quirks Mode* dan tata letak CSS Anda dapat berperilaku aneh tanpa pesan galat yang jelas.

### 2. Elemen Akar `<html>` dan Pentingnya `lang`

Elemen `<html>` membungkus seluruh isi dokumen. Dua atribut yang sangat penting pada elemen ini adalah:

- **`lang="id"`:** Memberitahu perangkat pembaca layar (*screen reader*), mesin pencari, dan fitur penerjemah otomatis bahwa bahasa utama halaman adalah Bahasa Indonesia (`id`). Tanpa atribut ini, pembaca layar berbahasa Inggris akan mencoba membacakan kata Bahasa Indonesia dengan pelafalan bahasa Inggris yang membingungkan pengguna tunanetra.
- **`dir="ltr"` atau `dir="rtl"`:** Menentukan arah baca teks (*left-to-right* untuk aksara Latin, atau *right-to-left* untuk bahasa Arab/Ibrani). Jika bagian tertentu di dalam halaman berbahasa Indonesia mengutip kalimat bahasa Arab atau Inggris, Anda dapat menempelkan atribut `lang` dan `dir` langsung pada elemen kutipan tersebut:

```html
<p>
  Istilah <span lang="en">critical rendering path</span> merujuk pada tahapan
  peramban saat mengubah kode menjadi tampilan visual.
</p>
```

### 3. Bagian `<head>`: Informasi untuk Mesin dan Peramban

Isi di dalam `<head>` tidak ditampilkan sebagai konten halaman di dalam jendela utama, melainkan berisi metadata untuk peramban dan mesin pencari:

1. **`<meta charset="utf-8">`:** Wajib diletakkan di bagian paling atas `<head>` (dalam 1024 byte pertama dokumen) sebelum `<title>`. Pengodean karakter **UTF-8** mampu merepresentasikan hampir seluruh aksara di dunia (Latin, Arab, Jepang, aksara Nusantara, hingga simbol matematika dan emoji). Jika `<title>` diletakkan sebelum `<meta charset="utf-8">`, karakter khusus pada judul tab bisa tampil rusak (*mojibake* seperti `Ã©`) atau membuka celah keamanan lama berbasis UTF-7.
2. **`<meta name="viewport" content="width=device-width, initial-scale=1.0">`:** Tanpa baris ini, peramban di ponsel pintar akan berpura-pura memiliki layar selebar desktop (biasanya `980px`) lalu memperkecil seluruh halaman sehingga teks terlihat sangat kecil. Atribut `width=device-width` menyamakan lebar kanvas tata letak dengan lebar layar perangkat yang sebenarnya.
3. **`<title>`:** Menentukan judul yang muncul di tab peramban, daftar markah (*bookmark*), riwayat penelusuran, serta judul utama pada hasil pencarian Google. Selain itu, `<title>` adalah elemen pertama yang dibacakan oleh *screen reader* saat halaman selesai dimuat.

> **⚠️ Kesalahan Umum: Menaruh `<h1>` atau `<p>` di dalam `<head>`**
> Jika Anda tidak sengaja menaruh elemen konten seperti `<p>` atau `<div>` di dalam `<head>`, parser HTML secara otomatis akan menutup tag `<head>` secara paksa dan memindahkan sisanya ke dalam `<body>`. Akibatnya, tag `<meta>` atau `<link>` yang tertulis setelahnya justru tercecer di dalam `<body>` dan gagal bekerja sebagaimana mestinya!

## Elemen, Tag, dan Void Elements

Di HTML, penting untuk membedakan antara **tag** dan **elemen**:

```
<a href="https://kodeloka.asadinedu.com" class="tautan">Belajar di Kodeloka</a>
├──────────────────────────────────────────────────────┤├──────────────────┤├──┤
                     Tag Pembuka                            Isi Konten       Tag Penutup
└──────────────────────────────────────────────────────────────────────────────┘
                              Satu Elemen HTML Utuh
```

Sebagian elemen di HTML tidak mungkin memiliki isi teks atau elemen anak di dalamnya. Elemen-elemen ini disebut **Void Elements** (elemen hampa) dan **tidak memiliki tag penutup**:

- `<meta>`, `<link>`, `<base>` (di dalam `<head>`)
- `<img>`, `<br>`, `<hr>`, `<input>`, `<source>`, `<track>`, `<wbr>`, `<area>`, `<col>`, `<embed>`

```html
<!-- Benar di HTML5: bersih dan tanpa garis miring penutup -->
<img src="/logo.svg" alt="Logo Kodeloka">
<input type="email" name="surel" required>
<hr>

<!-- Tidak diperlukan di HTML5 (warisan XHTML), meskipun tidak menyebabkan galat -->
<img src="/logo.svg" alt="Logo Kodeloka" />
```

## Atribut Global yang Wajib Dikuasai

**Atribut global** adalah atribut yang boleh dipasang pada semua elemen HTML:

| Atribut | Fungsi Utama | Catatan Praktik Terbaik |
|---|---|---|
| `id` | Pengenal unik satu elemen di seluruh halaman | Nilai `id` **wajib unik** dalam satu dokumen dan tidak boleh mengandung spasi. Gunakan untuk target tautan `#fragmen`, asosiasi `<label for="...">`, atau ARIA. |
| `class` | Pengelompokan elemen untuk CSS dan JavaScript | Satu elemen boleh memiliki banyak kelas yang dipisahkan spasi (`class="kartu kartu-utama"`). |
| `hidden` | Menyembunyikan elemen yang belum relevan | Menginstruksikan peramban dan pembaca layar untuk tidak merender elemen tersebut. |
| `inert` | Menonaktifkan seluruh interaksi pada elemen dan turunannya | Status **Baseline Widely Available** (sejak 2023). Sangat berguna untuk mematikan klik, fokus papan ketik (`Tab`), dan pembacaan layar pada area latar belakang saat sebuah panel terbuka. |
| `data-*` | Menyimpan data kustom milik aplikasi di elemen HTML | Contoh: `data-modul-id="12"` dapat dibaca dengan mudah di JavaScript melalui `elemen.dataset.modulId`. |
| `title` | Informasi tambahan (biasanya muncul sebagai *tooltip* tetikus) | Jangan mengandalkan `title` untuk informasi penting karena tidak dapat diakses oleh pengguna layar sentuh (ponsel) maupun sebagian pengguna papan ketik. |

### Contoh Penggunaan `data-*` dan `hidden`

```html
<article class="kartu-kelas" data-kategori="web-dasar" data-tingkat="dasar">
  <h2> Dasar-Dasar HTML </h2>
  <p>Pelajari cara membangun fondasi halaman web yang kokoh.</p>
  <div class="detail-tambahan" hidden>
    <p>Prasyarat: Tidak ada. Cocok untuk pemula murni.</p>
  </div>
</article>
```

## Karakter Entitas HTML (*Character Entities*)

Karena karakter `<`, `>`, `"`, `'`, dan `&` memiliki arti khusus bagi parser HTML, Anda harus menulisnya menggunakan **entitas HTML** jika ingin menampilkannya sebagai teks biasa (terutama saat menampilkan cuplikan kode di halaman web):

| Karakter | Nama Entitas | Keterangan |
|---|---|---|
| `<` | `&lt;` | *Less than* (kurang dari / kurung siku buka) |
| `>` | `&gt;` | *Greater than* (lebih dari / kurung siku tutup) |
| `&` | `&amp;` | *Ampersand* (dan) |
| `"` | `&quot;` | Tanda kutip ganda (di dalam nilai atribut) |
| `'` | `&apos;` | Tanda kutip tunggal / apostrof |
| ` ` (spasi tak terputus) | `&nbsp;` | *Non-breaking space* (mencegah dua kata terpisah ke baris baru) |

```html
<p>Untuk membuat paragraf di HTML, gunakan elemen <code>&lt;p&gt;</code>.</p>
<p>Ukuran layar minimal yang disarankan adalah 320&nbsp;px.</p>
```

## Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan nilai `id` yang sama pada beberapa elemen:**
   - **Salah:** Memiliki lima tombol dengan `id="tombol-hapus"` di dalam daftar tabel. Saat Anda memanggil `document.getElementById("tombol-hapus")` atau menghubungkan `<label>`, hanya elemen pertama yang ditemukan dan sisanya menjadi cacat fungsi.
   - **Benar:** Gunakan `class="tombol-hapus"` untuk pengelompokan, dan gunakan `id` unik seperti `id="hapus-item-42"` atau atribut `data-item-id="42"`.
2. **Menghapus `initial-scale=1.0` atau menambahkan `user-scalable=no` pada `<meta name="viewport">`:**
   - **Bahaya Aksesibilitas:** Menulis `user-scalable=no` atau `maximum-scale=1.0` mematikan fitur cubit-untuk-memperbesar (*pinch-to-zoom*) di ponsel. Pengguna dengan gangguan penglihatan ringan yang perlu memperbesar teks menjadi tidak bisa membaca situs Anda, dan ini melanggar standar aksesibilitas WCAG.

## Latihan Praktik: Membuat Kerangka Dokumen Standar

Buatlah sebuah berkas bernama `profil.html` di komputer Anda dengan ketentuan berikut:
1. Menggunakan deklarasi mode standar HTML5 dan menandai bahasa dokumen sebagai Bahasa Indonesia (`id`).
2. Memuat pengodean karakter UTF-8 di urutan pertama dalam `<head>`, diikuti pengaturan viewport yang ramah perangkat seluler tanpa mematikan fitur *zoom*.
3. Menampilkan paragraf yang menjelaskan fungsi tag `<head>` dan `<body>` di layar dengan memanfaatkan entitas `&lt;` dan `&gt;` agar nama tag tampak di layar peramban.
4. Menyertakan satu elemen `<section>` yang memiliki atribut kustom `data-topik="html-dasar"`.

## Kuis Pemahaman

### Soal 1
Apa akibatnya jika sebuah dokumen HTML ditulis tanpa baris `<!DOCTYPE html>` di bagian paling atas?
- A. Peramban akan menolak menampilkan halaman dan memunculkan pesan galat sintaks.
- B. Peramban akan masuk ke *Quirks Mode* yang meniru perilaku tidak standar dari peramban era 1990-an, sehingga perhitungan CSS bisa menjadi tidak konsisten.
- C. Seluruh elemen HTML5 seperti `<main>` dan `<article>` otomatis dihapus dari DOM.
- D. Halaman tidak dapat dimuat melalui koneksi HTTPS.

**Jawaban Benar:** B
**Penjelasan:** Deklarasi `<!DOCTYPE html>` berfungsi mengaktifkan *Standards Mode* pada peramban. Tanpanya, peramban beralih ke *Quirks Mode* demi menjaga kompatibilitas dengan halaman web kuno, yang menyebabkan banyak aturan tata letak CSS modern bekerja secara menyimpang.

### Soal 2
Mengapa tag `<meta charset="utf-8">` disarankan diletakkan tepat di awal elemen `<head>`, bahkan sebelum elemen `<title>`?
- A. Agar mesin pencari membaca pengodean karakter sebelum membaca kata kunci judul.
- B. Agar peramban segera mengetahui cara menerjemahkan byte karakter menjadi huruf (termasuk karakter di dalam `<title>`) sejak awal dokumen dalam 1024 byte pertama.
- C. Karena menurut spesifikasi HTML, `<title>` wajib menjadi anak terakhir di dalam `<head>`.
- D. Agar berkas CSS eksternal dapat diunduh dua kali lebih cepat.

**Jawaban Benar:** B
**Penjelasan:** Spesifikasi HTML mengharuskan deklarasi pengodean karakter berada di awal dokumen (dalam 1024 byte pertama) dan sebelum elemen apa pun yang mengandung teks yang dapat dibaca pengguna seperti `<title>`, sehingga peramban tidak salah menafsirkan karakter non-ASCII pada judul halaman.

### Soal 3
Manakah dari pernyataan berikut yang **benar** mengenai atribut global `id` dan `data-*`?
- A. Nilai atribut `id` boleh digunakan berulang kali pada elemen yang berbeda selama berada di dalam `<div>` yang berbeda.
- B. Atribut `data-harga-diskon="15000"` pada sebuah elemen dapat dibaca di JavaScript melalui properti `elemen.dataset.hargaDiskon`.
- C. Atribut `data-*` hanya boleh dipasang pada elemen `<input>` dan `<form>`.
- D. Menambahkan atribut `inert` pada sebuah elemen hanya mengubah warna teksnya menjadi abu-abu tetapi tetap mengizinkan klik tombol di dalamnya.

**Jawaban Benar:** B
**Penjelasan:** Atribut `data-*` merupakan atribut global yang berlaku di semua elemen HTML. Saat diakses melalui API `HTMLElement.dataset` di JavaScript, nama atribut berformat *kebab-case* (`data-harga-diskon`) otomatis dikonversi menjadi *camelCase* (`dataset.hargaDiskon`).

## Sumber
- [Structuring documents — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents)
- [HTML elements reference — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
- [Semantics, structure, and APIs of HTML documents — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/dom.html)
- [Learn HTML — web.dev](https://web.dev/learn/html)
