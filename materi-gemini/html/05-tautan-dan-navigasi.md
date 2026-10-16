# Tautan, Struktur URL, dan Navigasi yang Aman

- **Tingkat:** Dasar
- **Ringkasan:** Menguasai elemen jangkar `<a>`, perbedaan jalur URL absolut dan relatif, navigasi fragmen halaman, skema khusus, serta atribut keamanan dan aksesibilitas pada tautan.

## Jantung dari Web: Hyperlink (`<a>`)

Huruf **H** dan **T** pada HTML adalah *HyperText*—teks yang saling terhubung melalui tautan (*links*). Elemen `<a>` (*anchor*) mengubah teks atau elemen di dalamnya menjadi jembatan menuju halaman lain, bagian lain di halaman yang sama, berkas unduhan, atau aplikasi eksternal.

```html
<a href="https://kodeloka.asadinedu.com/golang/">Pelajari Kelas Golang di Kodeloka</a>
```

## 1. Memahami Jalur URL: Absolut, Root-Relative, dan Document-Relative

Memilih jenis jalur (*path*) yang tepat pada atribut `href` menentukan apakah tautan Anda tetap berfungsi saat situs dipindahkan dari lingkungan pengembangan lokal (`http://localhost:8790`) ke domain produksi (`https://kodeloka.asadinedu.com`).

| Jenis Jalur | Contoh Nilai `href` | Kapan Digunakan? |
|---|---|---|
| **URL Absolut** | `https://developer.mozilla.org/en-US/` | Saat menautkan ke situs eksternal di domain yang berbeda. |
| **Root-Relative** (Relatif terhadap akar domain) | `/css/index.html` atau `/assets/style.css` | Dimulai dengan garis miring `/`. Selalu mengacu dari akar domain aktif, tidak peduli sedalam apa folder halaman saat ini berada. Sangat direkomendasikan untuk navigasi internal situs. |
| **Document-Relative** (Relatif terhadap berkas saat ini) | `02-struktur.html` atau `../assets/logo.svg` | Mengacu dari lokasi berkas HTML yang sedang dibuka. `../` berarti naik satu tingkat folder ke atas. Cocok untuk modul yang berada dalam satu folder yang sama. |

```
Struktur Folder:
/ (akar situs)
├── index.html
├── assets/
│   └── panduan.pdf
└── html/
    ├── index.html
    └── materi/
        └── 05-tautan.html   <-- Anda sedang berada di berkas ini
```

Jika Anda berada di `/html/materi/05-tautan.html`:
- Menuju `/index.html` (Beranda): gunakan `href="/"` (root-relative) atau `href="../../index.html"` (document-relative).
- Menuju `/html/index.html`: gunakan `href="/html/"` atau `href="../index.html"`.
- Menuju `/assets/panduan.pdf`: gunakan `href="/assets/panduan.pdf"` atau `href="../../assets/panduan.pdf"`.

## 2. Tautan Fragmen (*Same-Page Anchor*) dan Skip Link

Jika nilai `href` diawali tanda pagar (`#`) diikuti nilai `id` dari sebuah elemen di halaman, peramban akan menggulir layar langsung ke elemen tersebut dan memindahkan fokus navigasi ke sana:

```html
<!-- Navigasi daftar isi di bagian atas artikel -->
<nav aria-label="Daftar isi bab">
  <ul>
    <li><a href="#jalur-url">1. Memahami Jalur URL</a></li>
    <li><a href="#keamanan-tautan">2. Keamanan Tautan Eksternal</a></li>
  </ul>
</nav>

<!-- Target lompatan di dalam isi artikel -->
<section id="jalur-url">
  <h2>1. Memahami Jalur URL</h2>
  <p>Pembahasan mengenai URL absolut dan relatif...</p>
</section>

<section id="keamanan-tautan">
  <h2>2. Keamanan Tautan Eksternal</h2>
  <p>Pembahasan mengenai atribut target dan rel...</p>
</section>
```

> **💡 Tips Praktis: Mengatur Guliran Halus dan Jarak Header dengan CSS**
> Saat pengguna mengeklik tautan `#keamanan-tautan`, judul bagian sering kali tertutup oleh bilah navigasi atas yang bersifat `position: sticky`. Anda dapat memperbaikinya cukup dengan dua properti CSS:
> ```css
> html {
>   scroll-behavior: smooth;
> }
> section[id] {
>   scroll-margin-top: 5rem; /* Memberi jarak aman dari header sticky */
> }
> ```

## 3. Atribut Penting pada `<a>`: `target`, `rel`, dan `download`

### Membuka Tab Baru (`target="_blank"`) dan Keamanan `rel="noopener noreferrer"`
Secara bawaan, tautan terbuka di tab yang sama (`target="_self"`). Anda sebaiknya **tidak** memaksa semua tautan terbuka di tab baru (`target="_blank"`) karena hal itu mengambil alih kendali pengguna dan membingungkan tombol *Back* pada peramban ponsel. Gunakan `target="_blank"` hanya bila pengguna sedang mengisi formulir panjang atau memutar media yang akan terputus jika mereka meninggalkan halaman saat ini.

Ketika menggunakan `target="_blank"` menuju situs eksternal, biasakan menyertakan atribut `rel`:

```html
<a
  href="https://html.spec.whatwg.org/multipage/"
  target="_blank"
  rel="noopener noreferrer"
>
  Spesifikasi HTML WHATWG (buka di tab baru)
</a>
```

- **`noopener`:** Mencegah halaman baru yang dibuka mengakses objek `window.opener` milik halaman Anda melalui JavaScript (mencegah serangan *reverse tabnabbing*). *Catatan: Peramban modern kini menerapkan perilaku implisit `noopener` pada setiap `target="_blank"`, tetapi menuliskannya secara eksplisit tetap merupakan kebiasaan pengamanan yang baik.*
- **`noreferrer`:** Selain mencakup efek `noopener`, nilai ini mencegah peramban mengirimkan header HTTP `Referer` ke situs tujuan sehingga situs luar tidak mengetahui URL internal halaman tempat pengguna berasal.
- **`nofollow`, `ugc`, `sponsored`:** Digunakan pada tautan di kolom komentar pengguna (`rel="ugc nofollow"`) atau tautan iklan berbayar (`rel="sponsored"`) agar mesin pencari tidak menganggapnya sebagai rekomendasi organik dari situs Anda.

### Mengunduh Berkas (`download`) dan Skema Khusus (`mailto:`, `tel:`)
- **Atribut `download`:** Menginstruksikan peramban untuk mengunduh sumber daya alih-alih menampilkannya di tab peramban. Hanya berfungsi untuk berkas yang berasal dari *origin* (domain) yang sama atau skema `blob:` / `data:`.
- **Skema `mailto:` dan `tel:`:** Membuka aplikasi surat elektronik atau panggilan telepon di perangkat pengguna.

```html
<!-- Mengunduh berkas dengan nama berkas yang rapi -->
<a href="/assets/ringkasan-html.pdf" download="Ringkasan-HTML-Kodeloka.pdf">
  Unduh Ringkasan Materi (PDF, 420 KB)
</a>

<!-- Menghubungi lewat surel dan telepon -->
<a href="mailto:halo@asadinedu.com?subject=Pertanyaan%20Materi%20HTML">
  Kirim Surel ke Tim Pengajar
</a>
<a href="tel:+6281234567890">+62 812-3456-7890</a>
```

## 4. Kapan Menggunakan `<button>` vs `<a>`?

Ini adalah salah satu aturan paling fundamental dalam pengembangan front-end:

- **Gunakan `<a href="...">` jika aksinya adalah berpindah alamat (navigasi):** Menuju halaman lain, melompat ke bagian `#id` di halaman yang sama, atau mengunduh berkas. Pengguna dapat mengeklik kanan tautan untuk memilih *"Open Link in New Tab"*.
- **Gunakan `<button type="button">` (atau `type="submit"`) jika aksinya adalah melakukan tindakan di dalam halaman saat ini:** Membuka kotak dialog `<dialog>`, mengganti tema gelap/terang, menghapus baris data, atau mengirim formulir.

```html
<!-- SALAH: Tautan palsu tanpa tujuan navigasi -->
<a href="#" onclick="bukaModal()">Buka Pengaturan</a>
<div class="tombol" onclick="simpanData()">Simpan</div>

<!-- BENAR: Gunakan elemen yang sesuai dengan fungsinya -->
<button type="button" id="tombol-pengaturan">Buka Pengaturan</button>
<a href="/pengaturan/profil">Halaman Pengaturan Profil</a>
```

> **🚫 Bahaya Aksesibilitas: `<a href="#">` dan `<div onclick="...">`**
> Tautan `<a href="#">` akan membuat layar melompat kembali ke bagian paling atas halaman jika `event.preventDefault()` gagal dijalankan. Lebih buruk lagi, `<div onclick="...">` tidak dapat difokuskan dengan tombol `Tab` di papan ketik dan tidak dapat ditekan menggunakan tombol `Enter` atau `Space`!

## Latihan Praktik: Membangun Navigasi Multi-Halaman dan Daftar Isi

Buatlah berkas `navigasi-latihan.html` yang memiliki:
1. Tautan *Skip to main content* (`<a href="#utama">Lompat ke konten utama</a>`) sebagai elemen pertama di dalam `<body>`.
2. Elemen `<nav>` berisi tautan root-relative menuju `/html/`, `/css/`, `/javascript/`, dan `/php/`, di mana tautan `/html/` ditandai dengan `aria-current="page"`.
3. Tiga bagian (`<section>`) yang masing-masing memiliki `id` unik dan dapat dilompati dari daftar isi di bagian atas artikel.
4. Satu tautan referensi eksternal menuju dokumentasi MDN yang aman dan menjelaskan bahwa tautan terbuka di tab baru.

## Kuis Pemahaman

### Soal 1
Anda sedang menulis kode di dalam berkas `/kelas/html/materi/05-tautan.html` dan ingin menautkan ke berkas `/assets/panduan.pdf`. Nilai `href` manakah yang merupakan jalur **root-relative** yang benar?
- A. `href="assets/panduan.pdf"`
- B. `href="../assets/panduan.pdf"`
- C. `href="/assets/panduan.pdf"`
- D. `href="file:///assets/panduan.pdf"`

**Jawaban Benar:** C
**Penjelasan:** Jalur *root-relative* selalu diawali dengan satu garis miring (`/`) yang memerintahkan peramban untuk memulai pencarian dari direktori paling atas (akar domain situs), terlepas dari lokasi folder berkas HTML yang sedang dibuka.

### Soal 2
Kapan Anda harus memilih elemen `<button>` alih-alih elemen `<a>`?
- A. Ketika pengguna ingin berpindah ke halaman katalog kelas yang berada di alamat URL berbeda.
- B. Ketika interaksi pengguna bertujuan menjalankan aksi di dalam halaman yang sama (seperti membuka menu *popup*, menghapus item, atau mengirim formulir) tanpa berpindah URL.
- C. Ketika Anda ingin membuat tombol yang tampilannya memiliki warna latar belakang dan sudut membulat di CSS.
- D. Ketika Anda ingin mengarahkan pengguna ke bagian `#kesimpulan` di bawah halaman.

**Jawaban Benar:** B
**Penjelasan:** Pilihan antara `<a>` dan `<button>` ditentukan oleh fungsi semantiknya, bukan tampilan visualnya (karena keduanya dapat diberi gaya CSS yang identik). `<a>` digunakan untuk navigasi URL/fragmen, sedangkan `<button>` digunakan untuk memicu aksi di dalam halaman atau mengirim formulir.

### Soal 3
Apa fungsi atribut `rel="noopener noreferrer"` pada elemen `<a href="https://contoh.com" target="_blank">`?
- A. Memaksa tautan diunduh sebagai berkas PDF alih-alih dibuka di tab baru.
- B. Mencegah tab baru mengakses objek `window.opener` halaman asal sekaligus menyembunyikan informasi URL halaman asal (header HTTP `Referer`) dari situs tujuan.
- C. Memberitahu peramban agar memuat halaman tujuan terlebih dahulu di latar belakang sebelum diklik.
- D. Mematikan JavaScript sepenuhnya di situs tujuan yang dibuka.

**Jawaban Benar:** B
**Penjelasan:** `noopener` memutus akses `window.opener` antara tab baru dan tab asal demi mencegah manipulasi halaman asal (*tabnabbing*), sedangkan `noreferrer` mencegah pengiriman header HTTP `Referer` ke server tujuan demi menjaga privasi URL asal pengunjung.

## Sumber
- [`<a>`: The Anchor element — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a)
- [Text-level semantics (`a` element) — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/text-level-semantics.html)
- [HTML: A good basis for accessibility — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML)
