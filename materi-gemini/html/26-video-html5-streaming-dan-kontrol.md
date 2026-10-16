# Elemen `<video>` Mendalam: Poster, `playsinline`, Multi-Codec (AV1/WebM/MP4), dan Subtitel `<track>`

- **Tingkat:** Menengah
- **Ringkasan:** Menyajikan video di web dengan cepat, hemat pita lebar, dan aksesibel menggunakan elemen `<video>`, atribut `width`/`height` anti-CLS, gambar sampul `poster`, aturan `muted playsinline` untuk video latar/loop di perangkat seluler, serta lima jenis `<track>` (`subtitles`, `captions`, `descriptions`, `chapters`, `metadata`).

## 1. Anatomi Elemen `<video>` Kelas Produksi

Video yang memenuhi standar aksesibilitas **WCAG 1.2** wajib menyertakan takarir tertutup (`<track kind="captions">`) bagi pengguna Tuli atau pengguna di ruang publik yang mematikan pengeras suara.

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

> **⚠️ Syarat Mutlak Autoplay di Peramban Seluler (`muted playsinline`):** Jika Anda menampilkan video animasi produk pendek tanpa suara yang berputar otomatis menggantikan berkas GIF yang bengkak, Anda **wajib** menyertakan kombinasi atribut `autoplay muted loop playsinline`. Tanpa `muted` dan `playsinline`, iOS Safari dan Chrome Android akan memblokir pemutaran otomatis atau memaksanya terbuka dalam mode layar penuh.

## Latihan Praktik Mandiri

1. Buat sebuah elemen `<video>` dengan atribut `width="1280"`, `height="720"`, `preload="metadata"`, dan `poster`.
2. Buat sebuah berkas teks `subtitel.vtt` berformat `WEBVTT` dan hubungkan menggunakan `<track kind="captions" srclang="id" default>`.

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
