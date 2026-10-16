# Anatomi URL, MIME Type (`Content-Type`), dan Content Negotiation

- **Tingkat:** Dasar
- **Ringkasan:** Memahami bagaimana peramban dan server menyepakati tipe dokumen melalui header MIME (`text/html`, `image/avif`, `application/json`), pengodean persen URL, serta bahaya MIME sniffing.

## Mengapa Peramban Tidak Mengandalkan Ekstensi Berkas `.html` atau `.png`?

Di sistem operasi desktop, komputer menebak jenis berkas dari akhiran namanya (`.html`, `.jpg`, `.pdf`). Namun di web, sebuah URL seperti `https://kodeloka.asadinedu.com/unduh?id=42` sama sekali tidak memiliki ekstensi berkas!

Lalu bagaimana peramban tahu apakah balasan dari URL tersebut harus ditampilkan sebagai halaman web HTML, diputar sebagai video, atau diunduh sebagai PDF? Jawabannya adalah **MIME Type (*Multipurpose Internet Mail Extensions*)** yang dikirim oleh server di dalam header HTTP **`Content-Type`**.

## 1. Daftar MIME Type Penting yang Wajib Dikenali Pengembang Web

| Kategori | Nilai Header `Content-Type` | Perilaku Peramban |
|---|---|---|
| **Dokumen Web** | `text/html; charset=utf-8` | Diurai oleh parser HTML5 menjadi pohon DOM. |
| **Gaya & Skrip** | `text/css; charset=utf-8`, `text/javascript; charset=utf-8` | Diurai oleh mesin CSSOM dan mesin JIT JavaScript (catatan: standar resmi skrip adalah `text/javascript`, bukan `application/javascript`). |
| **Data API** | `application/json; charset=utf-8` | Data teks terstruktur JSON. |
| **Gambar Modern** | `image/avif`, `image/webp`, `image/svg+xml`, `image/png`, `image/jpeg` | Dirender oleh dekoder citra; khusus SVG berbasis XML wajib dikirim sebagai `image/svg+xml` agar tampil di dalam `<img>`. |
| **Fon Web** | `font/woff2`, `font/woff` | Dimuat oleh aturan `@font-face`. |
| **Formulir** | `application/x-www-form-urlencoded`, `multipart/form-data` | Format pengiriman data dari elemen `<form>` ke server. |
| **Biner Umum** | `application/octet-stream`, `application/pdf` | Menginstruksikan peramban untuk mengunduh berkas biner atau membuka pembaca PDF. |

## 2. Mekanisme *Content Negotiation* (`Accept`, `Accept-Language`, `Accept-Encoding`)

Saat peramban meminta sebuah halaman atau gambar, peramban mengirimkan daftar format yang ia dukung melalui header permintaan (*request headers*):

```http
GET /assets/sampul-kelas HTTP/2
Host: kodeloka.asadinedu.com
Accept: image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5
Accept-Encoding: br, zstd, gzip, deflate
Accept-Language: id-ID,id;q=0.9,en-US;q=0.8
```

Parameter **`q=` (*quality factor*, bernilai `0.0` hingga `1.0`, bawaan `1.0`)** menyatakan urutan prioritas: peramban di atas lebih menyukai `image/avif` (`q=1.0`) dibandingkan format gambar umum `image/*` (`q=0.8`).

## 3. Pengodean Persen pada URL (*Percent-Encoding* — RFC 3986)

URL hanya boleh memuat karakter ASCII yang aman (huruf `A–Z`, `a–z`, angka `0–9`, dan simbol `- _ . ~`). Karakter lain seperti spasi, tanda `&` di dalam nilai parameter, atau karakter non-Latin harus dikodekan menjadi **`%` diikuti dua digit heksadesimal byte UTF-8-nya** (misalnya spasi menjadi `%20` atau `+` di dalam query string, dan `&` menjadi `%26`):

```html
<!-- SALAH: Spasi dan tanda '&' mentah di dalam nilai parameter query merusak pemisahan parameter! -->
<a href="/cari?topik=HTML & CSS&tingkat=dasar">Cari HTML &amp; CSS</a>

<!-- BENAR: Karakter spasi (%20) dan '&' (%26) di dalam nilai parameter dikodekan dengan benar -->
<a href="/cari?topik=HTML%20%26%20CSS&amp;tingkat=dasar">Cari HTML &amp; CSS</a>
```

> **🚫 Bahaya Keamanan *MIME Sniffing* dan Solusi `X-Content-Type-Options: nosniff`**
> Jika server mengirim berkas unggahan pengguna sebagai `Content-Type: text/plain`, peramban kuno terkadang mengintip isi byte pertamanya. Jika ditemukan tulisan `<html><script>...`, peramban nekat mengeksekusinya sebagai halaman HTML! Selalu pastikan server mengirim header **`X-Content-Type-Options: nosniff`** agar peramban patuh 100% pada `Content-Type` yang dideklarasikan server.

## Latihan Praktik: Memeriksa Negosiasi Konten di DevTools

1. Buka tab **Network** di Browser DevTools pada halaman web yang menggunakan gambar `<picture>` atau kompresi Brotli (`br`).
2. Bandingkan header **Request (`Accept`, `Accept-Encoding`)** dengan header **Response (`Content-Type`, `Content-Encoding`, `Vary`)**.
3. Buat berkas `tautan-query.html` yang berisi 3 tautan pencarian dengan parameter yang mengandung karakter spasi, tanda tanya `?`, dan simbol `&` yang dikodekan persen secara benar.

## Kuis Pemahaman

### Soal 1
Mengapa berkas gambar berformat `.svg` terkadang gagal tampil ketika dimuat melalui `<img src="ikon.svg">` dari server yang belum dikonfigurasi dengan benar?
- A. Karena elemen `<img>` hanya mendukung format `.jpg` dan `.png`
- B. Karena server mengirimkan header `Content-Type: text/plain` alih-alih MIME type resmi `image/svg+xml`, sehingga peramban menolak merendernya sebagai gambar
- C. Karena berkas SVG wajib berukuran lebih dari 10 KB
- D. Karena tag `<img>` memerlukan atribut `type="svg"`

**Jawaban Benar:** B
**Penjelasan:** Peramban menentukan cara memproses sumber daya berdasarkan header HTTP `Content-Type`, bukan semata-mata ekstensi URL. Untuk SVG, spesifikasi mengharuskan MIME type `image/svg+xml`.

### Soal 2
Pada header HTTP `Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`, apa arti dari parameter `;q=0.8`?
- A. Ukuran maksimal berkas yang diizinkan adalah 0,8 MB
- B. Faktor bobot prioritas (*quality value*) dari `0` sampai `1` yang menunjukkan tingkat preferensi peramban terhadap tipe media tersebut apabila pilihan utama (`q=1.0`) tidak tersedia
- C. Versi protokol HTTP yang digunakan adalah versi 0.8
- D. Batas waktu tunggu permintaan adalah 0,8 detik

**Jawaban Benar:** B
**Penjelasan:** Parameter `q` (*quality factor*) dalam *content negotiation* HTTP memberi bobot preferensi dari `0.000` hingga `1.000` (nilai bawaan tanpa `q` adalah `1.0`).

### Soal 3
Bagaimana cara penulisan yang benar untuk mengirimkan nilai parameter `q` berisi teks `Go & Rust` di dalam atribut `href` HTML?
- A. `href="/cari?q=Go & Rust"`
- B. `href="/cari?q=Go%20%26%20Rust"`
- C. `href="/cari?q=Go&amp;Rust"`
- D. `href="/cari?q=[Go & Rust]"`

**Jawaban Benar:** B
**Penjelasan:** Karakter `&` memiliki arti khusus sebagai pemisah antar-parameter di dalam query string URL. Agar `&` dianggap sebagai bagian dari nilai teks `Go & Rust`, ia wajib dikodekan persen menjadi `%26` (dan spasi menjadi `%20` atau `+`).

## Sumber
- [How the web works — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)
- [<a>: The Anchor element — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a)
