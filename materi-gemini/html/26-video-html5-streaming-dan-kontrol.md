# Elemen `<video>` Mendalam: Poster, `playsinline`, Multi-Codec (AV1/WebM/MP4), dan Subtitel `<track>`

- **Tingkat:** Menengah
- **Ringkasan:** Menyajikan video di web dengan cepat, hemat pita lebar, dan aksesibel menggunakan elemen `<video>`, atribut `width`/`height` anti-CLS, gambar sampul `poster`, aturan `muted playsinline` untuk video latar/loop di perangkat seluler, serta lima jenis `<track>` (`subtitles`, `captions`, `descriptions`, `chapters`, `metadata`).

## Mengapa Konfigurasi `<video>` Sangat Memengaruhi Kecepatan dan Aksesibilitas Halaman?

Berkas video sering kali menjadi aset terberat di sebuah halaman web. Kesalahan kecil dalam menulis markup `<video>`—seperti melupakan atribut dimensi `width` dan `height`, membiarkan `preload="auto"` pada video di bawah layar, atau hanya menyediakan satu format MP4 lawas—dapat memicu lonjakan penggunaan kuota data pengguna dan merusak skor *Cumulative Layout Shift* (CLS).

Di sisi lain, elemen `<video>` modern mendukung negosiasi codec generasi baru (**AV1** dan **VP9**) yang mampu memangkas ukuran berkas hingga 30–50% dibandingkan H.264 pada kualitas visual setara, sekaligus menyediakan lima jenis jalur teks (`<track>`) untuk aksesibilitas penuh.

## 1. Anatomi Elemen `<video>` Kelas Produksi dan Urutan Multi-Codec

Sama seperti `<audio>`, elemen `<video>` mengevaluasi daftar `<source>` dari atas ke bawah. Urutan terbaik untuk produksi adalah menempatkan **AV1** di urutan pertama (paling hemat ukuran berkas untuk perangkat modern), diikuti **WebM VP9/Opus**, dan diakhiri **MP4 H.264/AAC** sebagai jaring pengaman universal untuk perangkat lama.

Perhatikan bahwa jika string parameter `codecs` mengandung tanda koma (seperti `vp9,opus`), seluruh nilai atribut `type` wajib dibungkus tanda kutip tunggal di luar dan tanda kutip ganda pada nilai `codecs`: `type='video/webm; codecs="vp9,opus"'`.

```html
<video
  controls
  preload="metadata"
  width="1280"
  height="720"
  poster="/media/sampul-demo-kodeloka.webp"
  crossorigin="anonymous"
>
  <source src="/media/demo-kodeloka.av1.mp4" type="video/mp4; codecs=av01.0.05M.08">
  <source src="/media/demo-kodeloka.webm" type='video/webm; codecs="vp9,opus"'>
  <source src="/media/demo-kodeloka.h264.mp4" type="video/mp4">
  <track kind="captions" src="/media/demo.id.vtt" srclang="id" label="Bahasa Indonesia (CC)" default>
  <track kind="subtitles" src="/media/demo.en.vtt" srclang="en" label="English">
  <track kind="chapters" src="/media/demo-bab.id.vtt" srclang="id" label="Daftar Bab">
  <p>Peramban Anda tidak mendukung video HTML5. <a href="/media/demo-kodeloka.h264.mp4">Unduh video MP4</a>.</p>
</video>
```

### Fungsi Atribut Penting pada `<video>`
- **`width` dan `height`:** Memberi tahu peramban rasio aspek intrinsik video (misalnya `1280` × `720` = `16:9`) sejak HTML pertama kali diurai. Dipadukan dengan `video { max-width: 100%; height: auto; }` di CSS, kotak video langsung memesan ruang proporsional di layar tanpa menyebabkan teks di bawahnya melompat (anti-CLS).
- **`poster`:** Menampilkan gambar sampul ringan (misalnya `.webp` atau `.avif`) sementara video belum diputar. Jangan gunakan bingkai pertama video sebagai pengganti `poster` jika Anda memakai `preload="none"`.
- **`crossorigin="anonymous"`:** Wajib disertakan apabila berkas subtitel `<track>` atau video dimuat dari domain CDN berbeda agar peramban mengizinkan pembacaan berkas `.vtt` melalui CORS.

## 2. Mengganti GIF Bengkak dengan Video Loop (`autoplay muted loop playsinline`)

Format gambar animasi `.gif` sangat tidak efisien karena berasal dari era 1980-an: animasi GIF berdurasi 5 detik bisa berukuran **8 MB**, sedangkan video MP4/WebM dengan kualitas jauh lebih tajam hanya berukuran **250 KB**.

> **⚠️ Syarat Mutlak Autoplay di Peramban Seluler (`muted playsinline`):** Jika Anda menampilkan video animasi produk pendek tanpa suara yang berputar otomatis menggantikan berkas GIF yang bengkak, Anda **wajib** menyertakan kombinasi atribut `autoplay muted loop playsinline`. Tanpa `muted` dan `playsinline`, iOS Safari dan Chrome Android akan memblokir pemutaran otomatis atau memaksanya terbuka dalam mode layar penuh.

```html
<!-- Pengganti GIF yang hemat pita lebar dan ramah perangkat seluler -->
<video
  autoplay
  muted
  loop
  playsinline
  width="800"
  height="450"
  poster="/media/pratinjau-terminal.webp"
  aria-label="Animasi demonstrasi menjalankan perintah git rebase di terminal"
>
  <source src="/media/demo-terminal.webm" type="video/webm">
  <source src="/media/demo-terminal.mp4" type="video/mp4">
</video>
```

## 3. Membedakan Lima Nilai `kind` pada Elemen `<track>`

Video yang memenuhi standar aksesibilitas **WCAG 1.2** wajib menyertakan takarir tertutup (`<track kind="captions">`) bagi pengguna Tuli atau pengguna di ruang publik yang mematikan pengeras suara. Spesifikasi HTML menyediakan lima nilai atribut `kind` dengan tujuan berbeda:

| Nilai `kind` | Sasaran Pengguna & Perilaku Peramban | Isi di Dalam Berkas `.vtt` |
|---|---|---|
| `captions` | Pengguna Tuli atau kurang dengar (tampil di menu CC pemutar video) | Transkripsi dialog lisan **ditambah** keterangan efek suara penting seperti `[musik tegang]`, `[suara bel pintu]`, dan identitas pembicara. |
| `subtitles` | Penonton yang dapat mendengar audio tetapi tidak memahami bahasa pembicara | Terjemahan dialog lisan ke bahasa lain tanpa deskripsi efek suara non-verbal. |
| `descriptions` | Pengguna tunanetra atau berpenglihatan rendah | Deskripsi tekstual atas adegan visual penting di layar yang terjadi di sela-sela jeda dialog, untuk dibacakan oleh pembaca layar/sintesis suara. |
| `chapters` | Seluruh pengguna untuk navigasi cepat | Judul bab per rentang waktu agar pengguna dapat melompat langsung ke bagian materi tertentu di bilah waktu video. |
| `metadata` | Skrip aplikasi JavaScript (tidak ditampilkan oleh antarmuka bawaan peramban) | Data terstruktur (misalnya JSON koordinat peta atau slide presentasi) yang disinkronkan dengan waktu video melalui event `cuechange`. |

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Memasang lebih dari satu atribut `default` pada elemen `<track>`:** Hanya boleh ada maksimal satu `<track>` yang memiliki atribut `default` per elemen `<video>` (atau satu per kategori `kind` yang tidak saling menggantikan).
2. **Menulis koma tanpa tanda kutip pada parameter `codecs`:** Menulis `type="video/webm; codecs=vp9,opus"` melanggar aturan sintaks parameter MIME RFC; selalu kutip nilai yang mengandung koma menjadi `type='video/webm; codecs="vp9,opus"'`.
3. **Memutar video latar belakang tanpa mekanisme jeda:** Berdasarkan **WCAG 2.2.2 (Pause, Stop, Hide)**, video tanpa suara yang berputar otomatis lebih dari 5 detik tetap harus dapat dijeda oleh pengguna (misalnya dengan tetap menampilkan `controls` atau tombol Jeda serta menghormati `@media (prefers-reduced-motion: reduce)`).

## Latihan Praktik Mandiri

1. Buat sebuah elemen `<video>` di dalam berkas `video-aksesibel.html` dengan atribut `width="1280"`, `height="720"`, `preload="metadata"`, `crossorigin="anonymous"`, dan `poster`.
2. Tambahkan tiga `<source>` berurutan (AV1, WebM VP9/Opus dengan pengutipan `codecs` yang valid, dan MP4 H.264).
3. Hubungkan tiga elemen `<track>`: satu `kind="captions"` berbahasa Indonesia (`srclang="id" default`), satu `kind="subtitles"` berbahasa Inggris (`srclang="en"`), dan satu `kind="chapters"` untuk daftar bab materi.

## Kuis Pemahaman

### Soal 1
Kombinasi atribut manakah yang wajib diberikan pada elemen `<video>` agar video animasi pendek tanpa suara dapat berputar otomatis di tempat (*inline*) pada peramban seluler (iOS Safari & Android Chrome)?
- A. `autoplay="force" fullscreen="no"`
- B. `autoplay muted playsinline`
- C. `controls="false" sound="off"`
- D. `preload="auto" poster="none"`

**Jawaban Benar:** B
**Penjelasan:** Peramban modern hanya mengizinkan `autoplay` tanpa interaksi pengguna apabila video dibisukan (`muted`) dan diberi atribut `playsinline` agar tidak membajak layar penuh ponsel.

### Soal 2
Apa perbedaan semantik antara `<track kind="subtitles">` dan `<track kind="captions">` pada elemen `<video>`?
- A. `subtitles` menerjemahkan dialog lisan bagi penonton yang dapat mendengar suara tetapi tidak memahami bahasanya, sedangkan `captions` menyertakan dialog sekaligus deskripsi efek suara non-dialog (seperti `[suara petir]`, `[musik tegang]`) bagi pengguna Tuli/kurang dengar
- B. `subtitles` hanya untuk bahasa Inggris, sedangkan `captions` untuk bahasa Indonesia
- C. `captions` terletak di luar video, sedangkan `subtitles` di dalam video
- D. Keduanya tidak memiliki perbedaan sama sekali dalam spesifikasi HTML

**Jawaban Benar:** A
**Penjelasan:** Sesuai spesifikasi WHATWG dan WCAG, `captions` ditujukan bagi pengguna Tuli/Hard-of-Hearing sehingga mencakup transkripsi dialog dan isyarat audio penting, sedangkan `subtitles` berfokus pada terjemahan dialog.

### Soal 3
Mengapa atribut `width` dan `height` tetap penting ditulis pada elemen `<video>` meskipun ukurannya diatur menjadi `width: 100%; height: auto;` di CSS?
- A. Agar peramban dapat langsung menghitung rasio aspek ruang video sebelum metadata video selesai diunduh sehingga mencegah pergeseran tata letak (*Cumulative Layout Shift / CLS*)
- B. Untuk membatasi durasi video maksimal 720 detik
- C. Karena CSS tidak berlaku pada elemen `<video>`
- D. Untuk kompresi otomatis di sisi peramban

**Jawaban Benar:** A
**Penjelasan:** Atribut `width` dan `height` memberi tahu peramban rasio aspek intrinsik kotak video sejak awal penguraian HTML sehingga halaman tidak melompat saat video termuat.

## Sumber

- [MDN Web Docs — `<video>`: The Video Embed element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video)
- [MDN Web Docs — `<track>`: The Embed Text Track element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track)
