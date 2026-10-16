# Cara Web Bekerja: Dari Ketikan URL hingga Piksel di Layar

- **Tingkat:** Dasar
- **Ringkasan:** Memahami perjalanan sebuah permintaan web mulai dari resolusi DNS, koneksi TCP/TLS, protokol HTTP, hingga bagaimana peramban mengubah dokumen HTML menjadi tampilan visual melalui Critical Rendering Path.

## Mengapa Pengembang Web Perlu Memahami Cara Kerja Jaringan dan Peramban?

Menulis tag HTML tanpa memahami bagaimana dokumen tersebut dikirim dan diproses oleh peramban (*browser*) ibarat merancang denah gedung tanpa memahami sifat tanah tempat gedung itu berdiri. Ketika sebuah halaman web terasa lambat, gagal memuat gambar, atau tampak berkedip saat pertama kali dibuka, penyebabnya hampir selalu berkaitan dengan cara peramban meminta berkas melalui jaringan dan merangkainya di memori.

Setiap kali Anda mengetikkan alamat seperti `https://kodeloka.asadinedu.com` di bilah alamat peramban lalu menekan tombol Enter, serangkaian proses terjadi dalam hitungan milidetik:

```text
[Peramban Anda]
      │
      ├─ 1. Resolusi DNS: "Apa alamat IP untuk kodeloka.asadinedu.com?"
      │     └─> Dijawab oleh DNS Resolver (mis. 104.21.x.x)
      │
      ├─ 2. Jabat Tangan TCP & TLS (Handshake)
      │     └─> Membuka sambungan terenkripsi yang aman (HTTPS)
      │
      ├─ 3. Permintaan HTTP (HTTP Request)
      │     └─> GET / HTTP/2
      │
      ├─ 4. Respons Server (HTTP Response)
      │     └─> 200 OK + aliran byte dokumen HTML
      │
      └─ 5. Critical Rendering Path di Peramban
            └─> HTML -> DOM + CSS -> CSSOM -> Render Tree -> Layout -> Paint -> Composite
```

## 1. URL, DNS, dan Sambungan ke Server

Manusia mengingat nama domain seperti `kodeloka.asadinedu.com`, sedangkan jaringan komputer berkomunikasi menggunakan alamat IP (*Internet Protocol*) seperti `192.0.2.1` (IPv4) atau `2001:db8::1` (IPv6).

Sebuah **URL (*Uniform Resource Locator*)** memiliki struktur yang presisi:

```text
https://kodeloka.asadinedu.com:443/html/materi/?modul=1#pengantar
└──┬─┘  └──────────┬─────────┘ └┬┘ └─────┬─────┘ └───┬──┘ └───┬───┘
Skema           Host          Port     Path       Query    Fragmen
(Protokol)   (Nama Domain)              (Jalur)  (Parameter) (Anchor)
```

1. **Skema (`https://`):** Menentukan protokol komunikasi. `https` memberitahu peramban untuk mengenkripsi komunikasi menggunakan TLS (*Transport Layer Security*).
2. **Resolusi DNS (*Domain Name System*):** Peramban memeriksa tembolok (*cache*) lokalnya terlebih dahulu. Bila alamat IP belum diketahui, peramban bertanya ke DNS resolver milik sistem operasi atau penyedia internet Anda hingga menemukan alamat IP server tujuan.
3. **Koneksi TCP & TLS:** Setelah mendapatkan alamat IP, peramban melakukan jabat tangan TCP (*three-way handshake*: SYN, SYN-ACK, ACK) dan negosiasi kunci enkripsi TLS sebelum satu huruf pun dari permintaan web Anda dikirimkan.

## 2. Siklus Permintaan dan Respons HTTP

Begitu jalur aman terbentuk, peramban mengirimkan **HTTP Request** (permintaan HTTP). Contoh bentuk tekstual dari permintaan HTTP/1.1:

```http
GET / HTTP/1.1
Host: kodeloka.asadinedu.com
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: id,en-US;q=0.7,en;q=0.3
Accept-Encoding: br, gzip, deflate
```

Server web (seperti Nginx, Apache, atau Cloudflare) menerima permintaan tersebut, menyiapkan berkas yang diminta, lalu membalas dengan **HTTP Response**:

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Encoding: br
Cache-Control: public, max-age=3600

<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <title>Kodeloka — Belajar Pemrograman</title>
  </head>
  <body>
    <h1>Selamat Datang di Kodeloka</h1>
  </body>
</html>
```

### Kode Status HTTP yang Wajib Anda Kenali

| Rentang | Kategori | Contoh Kode Penting | Arti Praktis bagi Pengembang Front-End |
|---|---|---|---|
| `2xx` | Berhasil | `200 OK`, `204 No Content` | Permintaan berhasil; peramban dapat memproses isi balasan. |
| `3xx` | Pengalihan (*Redirect*) | `301 Moved Permanently`, `304 Not Modified` | Halaman pindah alamat, atau berkas di *cache* peramban masih mutakhir (`304`). |
| `4xx` | Kesalahan Klien | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found` | URL salah ketik, tautan rusak (`404`), atau pengguna belum masuk (`401`). |
| `5xx` | Kesalahan Server | `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable` | Kode HTML/CSS Anda mungkin benar, tetapi aplikasi backend atau server sedang mengalami gangguan. |

## 3. Peran Tiga Pilar Front-End: HTML, CSS, dan JavaScript

Di peramban, tiga teknologi web memiliki pembagian tugas yang tegas:

- **HTML (*HyperText Markup Language*):** Menyediakan **struktur dan makna semantik** konten (judul, paragraf, tabel data, formulir, tombol).
- **CSS (*Cascading Style Sheets*):** Mengatur **presentasi dan tata letak** (warna, tipografi, posisi kolom, responsivitas layar).
- **JavaScript:** Mengendalikan **perilaku dan interaksi dinamis** (menanggapi klik, mengambil data baru dengan `fetch()`, memvalidasi logika kompleks).

> **💡 Tips Praktis: Prinsip *Rule of Least Power***
> Prinsip arsitektur web dari W3C menyatakan: gunakan bahasa paling sederhana yang mampu menyelesaikan masalah Anda. Jika sebuah interaksi bisa diselesaikan dengan HTML murni (misalnya akordeon dengan `<details>` atau dialog dengan `<dialog>`), pilih HTML. Jika butuh animasi visual, gunakan CSS sebelum menulis JavaScript. Kode yang lebih deklaratif lebih tahan terhadap galat dan lebih ramah aksesibilitas.

## 4. Critical Rendering Path: Bagaimana HTML Menjadi Piksel

Setelah byte pertama HTML tiba, peramban menjalankan lima tahapan yang disebut **Critical Rendering Path**:

1. **Parsing HTML menjadi DOM (*Document Object Model*):**
   Peramban membaca karakter mentah (`<`, `h`, `1`, `>`), mengubahnya menjadi token, lalu merangkai pohon objek di memori yang disebut **DOM**. Saat parser menemukan tag `<link rel="stylesheet">` atau `<img src="...">`, peramban mengirim permintaan jaringan tambahan di latar belakang.
2. **Parsing CSS menjadi CSSOM (*CSS Object Model*):**
   Peramban membaca seluruh aturan CSS dan membentuk pohon gaya (**CSSOM**). CSS bersifat *render-blocking*: peramban menahan penggambaran layar sampai CSSOM selesai agar halaman tidak tampil telanjang tanpa gaya (*Flash of Unstyled Content* / FOUC).
3. **Pembentukan Render Tree:**
   DOM dan CSSOM digabungkan menjadi **Render Tree**. Hanya elemen yang benar-benar tampil di layar yang masuk ke pohon ini. Elemen seperti `<head>` atau elemen dengan `display: none` tidak dimasukkan ke dalam Render Tree (berbeda dengan `visibility: hidden` yang tetap mengambil ruang di tata letak).
4. **Layout (atau Reflow):**
   Peramban menghitung ukuran pasti (lebar dan tinggi dalam piksel) serta koordinat `(x, y)` dari setiap kotak di dalam Render Tree berdasarkan ukuran layar (*viewport*).
5. **Paint dan Compositing:**
   Peramban menggambar teks, warna latar, batas kotak (*border*), dan bayangan ke dalam lapisan-lapisan gambar (*layers*), lalu GPU menyatukan lapisan tersebut ke layar Anda.

```html
<!-- Contoh bagaimana posisi script memengaruhi pemuatan halaman -->
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <title>Urutan Pemuatan yang Efisien</title>
    <!-- 1. CSS dimuat di <head> agar CSSOM siap secepat mungkin -->
    <link rel="stylesheet" href="/assets/style.css">
    <!-- 2. Gunakan atribut defer agar unduhan JS berjalan paralel
            tanpa menghentikan pembacaan HTML (Baseline Widely Available) -->
    <script src="/assets/app.js" defer></script>
  </head>
  <body>
    <main>
      <h1>Artikel Utama</h1>
      <p>Konten ini langsung diurai menjadi DOM tanpa tertahan oleh skrip.</p>
    </main>
  </body>
</html>
```

## Kesalahan Umum dan Cara Menghindarinya

1. **Meletakkan `<script src="...">` biasa di dalam `<head>` tanpa `defer` atau `async`:**
   - **Buruk:** `<script src="bundle-besar.js"></script>` di bagian atas dokumen akan menghentikan parser HTML (*parser-blocking*) sampai berkas selesai diunduh dan dijalankan. Pengguna melihat layar putih lebih lama.
   - **Lebih Baik:** Tambahkan atribut `defer` (`<script src="bundle-besar.js" defer></script>`) atau gunakan `<script type="module">` (yang secara bawaan bersifat *deferred*).
2. **Mengabaikan tab Network di DevTools:**
   Banyak pemula menebak-nebak mengapa CSS atau gambar tidak muncul, padahal cukup membuka **Developer Tools (`F12`) → tab Network**, memuat ulang halaman, dan memeriksa apakah baris berkas tersebut berwarna merah dengan status `404 Not Found`.

## Latihan Praktik: Mengamati Perjalanan Permintaan Web

1. Buka peramban Anda (Firefox, Chrome, atau Edge), lalu tekan `F12` atau klik kanan → **Inspect** untuk membuka Developer Tools.
2. Pilih tab **Network** (Jaringan), lalu centang kotak **Disable cache** agar peramban tidak mengambil berkas dari penyimpanan lokal.
3. Kunjungi sebuah halaman web sederhana, lalu klik baris paling atas (biasanya bertipe `document` atau `html`).
4. Perhatikan bagian **Headers** (lihat `Status Code`, `Content-Type`, dan `Request Headers`) serta bagian **Timing** (amati waktu yang dihabiskan untuk *DNS Lookup*, *Connecting/TLS*, dan *Waiting for server response / TTFB*).

## Kuis Pemahaman

### Soal 1
Apa yang terjadi ketika peramban menemukan elemen `<div style="display: none">` saat menggabungkan DOM dan CSSOM menjadi Render Tree?
- A. Elemen tersebut dihapus secara permanen dari pohon DOM di memori.
- B. Elemen tetap berada di dalam DOM, tetapi dikecualikan dari Render Tree sehingga tidak ikut dihitung pada tahap Layout maupun Paint.
- C. Elemen tetap masuk ke Render Tree dan mengambil ruang kosong di layar, namun warnanya dibuat transparan.
- D. Peramban menghentikan pembacaan HTML sampai atribut `display: none` dihapus oleh JavaScript.

**Jawaban Benar:** B
**Penjelasan:** DOM menyimpan seluruh representasi elemen dari dokumen HTML, termasuk elemen yang disembunyikan. Namun, Render Tree hanya memuat simpul visual yang perlu digambar di layar. Berbeda dengan `visibility: hidden` yang tetap menyisakan ruang kotak kosong di Render Tree, `display: none` mengecualikan elemen beserta turunannya dari Render Tree sepenuhnya.

### Soal 2
Mengapa CSS secara bawaan diperlakukan sebagai sumber daya yang bersifat *render-blocking* oleh peramban?
- A. Karena berkas CSS selalu berukuran lebih besar daripada berkas HTML dan JavaScript.
- B. Karena peramban tidak dapat membangun pohon DOM sebelum seluruh aturan CSS selesai diunduh.
- C. Untuk mencegah halaman ditampilkan tanpa gaya visual (*Flash of Unstyled Content*) yang akan melompat berubah bentuk sesaat setelah CSS selesai dimuat.
- D. Karena protokol HTTP melarang pengunduhan HTML dan CSS secara bersamaan.

**Jawaban Benar:** C
**Penjelasan:** Peramban tetap dapat mengurai HTML menjadi DOM sambil mengunduh CSS di latar belakang, tetapi peramban menahan tahap pembuatan Render Tree dan penggambaran ke layar sampai CSSOM siap. Tanpa mekanisme ini, pengguna akan melihat teks mentah yang berantakan terlebih dahulu sebelum tiba-tiba bergeser ke tata letak aslinya.

### Soal 3
Saat Anda memeriksa tab Network di DevTools, sebuah berkas `utama.css` menampilkan kode status `304 Not Modified`. Apa artinya?
- A. Berkas CSS tersebut rusak di sisi server dan gagal diterapkan ke halaman.
- B. Server memberitahu peramban bahwa versi berkas yang tersimpan di *cache* peramban masih sama dengan versi terbaru di server, sehingga isi berkas tidak perlu dikirim ulang.
- C. Alamat berkas CSS telah dipindahkan secara permanen ke domain lain.
- D. Peramban menolak memuat berkas CSS karena tidak menggunakan protokol HTTPS.

**Jawaban Benar:** B
**Penjelasan:** Kode status `304 Not Modified` merupakan mekanisme efisiensi HTTP caching. Peramban mengirim permintaan bersyarat (misalnya dengan header `If-None-Match` atau `If-Modified-Since`), dan server mengonfirmasi bahwa salinan lokal di peramban masih valid sehingga menghemat bandwidth.

## Sumber
- [How the web works — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works)
- [Critical rendering path — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path)
- [Populating the page: how browsers work — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work)
- [HTML Living Standard — WHATWG](https://html.spec.whatwg.org/multipage/)
