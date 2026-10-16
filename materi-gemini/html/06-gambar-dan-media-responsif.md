# Gambar, Media Responsif, Audio, dan Video

- **Tingkat:** Dasar
- **Ringkasan:** Menyajikan gambar, grafik vektor (SVG), audio, dan video secara cepat, responsif di berbagai ukuran layar menggunakan `srcset`, `sizes`, dan `<picture>`, serta ramah aksesibilitas dan mencegah pergeseran tata letak (CLS).

## Mengapa Penanganan Media Sangat Menentukan Kualitas Web?

Gambar dan video hampir selalu menyumbang porsi byte terbesar dari total ukuran sebuah halaman web. Jika Anda menyajikan satu gambar berukuran `4000×3000` piksel (`2,5 MB`) mentah-mentah ke pengguna ponsel dengan lebar layar `390px`, pengguna tersebut membuang kuota data dan waktu tunggu hanya untuk mengunduh jutaan piksel yang pada akhirnya diperkecil oleh layar ponsel.

Selain ukuran unduhan, dua kesalahan paling sering pada elemen media adalah:
1. Tidak mencantumkan `width` dan `height`, sehingga teks halaman melompat turun saat gambar selesai dimuat (**Cumulative Layout Shift / CLS**).
2. Mengosongkan atau salah menulis atribut `alt`, sehingga pengguna pembaca layar kehilangan konteks informasi.

## 1. Memilih Format Gambar yang Tepat

Sebelum menulis tag `<img>`, pastikan Anda memilih format berkas yang sesuai dengan jenis visualnya:

| Format | Karakteristik Utama | Penggunaan Terbaik |
|---|---|---|
| **SVG** (`.svg`) | Berbasis vektor XML; tajam di ukuran berapa pun dan berukuran sangat kecil untuk bentuk geometris. | Logo, ikon antarmuka, diagram arsitektur, ilustrasi garis. |
| **AVIF** (`.avif`) | Kompresi generasi terbaru (berbasis AV1); ukuran berkas 20–50% lebih kecil dari JPEG/WebP pada kualitas setara (Baseline Widely Available sejak 2024). | Foto utama (*hero image*), tangkapan layar produk, katalog fotografi. |
| **WebP** (`.webp`) | Mendukung kompresi *lossy*, *lossless*, transparansi, dan animasi dengan dukungan peramban yang sangat luas. | Foto artikel, gambar ilustrasi dengan latar transparan, pengganti GIF animasi. |
| **PNG / JPEG** | Format klasik dengan kompatibilitas universal. | Cadangan (*fallback*) atau aset unduhan yang harus dibuka di perangkat lunak lama. |

## 2. Elemen `<img>`: Atribut `alt`, `width`, dan `height`

```html
<img
  src="/assets/diagram-http.webp"
  alt="Diagram alur permintaan HTTP dari peramban melalui DNS menuju server web dan kembali sebagai respons HTML."
  width="800"
  height="450"
  loading="lazy"
  decoding="async"
>
```

### Aturan Menulis Teks Alternatif (`alt`)
1. **Gambar Informatif (Diagram, Foto Berita, Grafik):** Jelaskan informasi inti yang ingin disampaikan gambar tersebut secara ringkas dan jelas pada `alt="..."`. Anda tidak perlu mengawali dengan kata *"Gambar dari..."* atau *"Foto..."* karena pembaca layar sudah menyebutkan bahwa elemen tersebut adalah sebuah gambar.
2. **Gambar Murni Dekoratif (Garis Hiasan, Latar Abstrak):** Tetap wajib menulis atribut `alt`, tetapi biarkan nilainya kosong (`alt=""`). Jika Anda menghilangkan atribut `alt` sama sekali, pembaca layar justru akan membacakan nama berkas yang mengganggu seperti `"garis-bawah-biru-final-v2.webp"`!
3. **Gambar di Dalam Tautan atau Tombol:** Jika `<img>` adalah satu-satunya isi di dalam `<a href="/">` atau `<button>`, maka nilai `alt` harus menjelaskan **tujuan tautan atau fungsi tombolnya** (misalnya `alt="Beranda Kodeloka"` atau `alt="Cari materi"`), bukan mendeskripsikan bentuk ikon kaca pembesar.

### Mengapa `width` dan `height` Wajib Ditulis Meskipun Diatur oleh CSS?
Ketika Anda menulis `width="800" height="450"` pada `<img>`, peramban modern langsung menghitung rasio aspek gambar (`16:9`) **sebelum** gambar selesai diunduh dari jaringan. Dikombinasikan dengan aturan CSS standar:

```css
img {
  max-width: 100%;
  height: auto;
}
```

Peramban akan langsung menyiapkan ruang kosong dengan tinggi yang presisi sesuai lebar kontainer, sehingga halaman bebas dari masalah *layout shift* (CLS).

## 3. Gambar Responsif dengan `srcset`, `sizes`, dan `<picture>`

### Kasus A: Resolusi Berbeda untuk Gambar yang Sama (`srcset` & `sizes`)
Gunakan atribut `srcset` dan `sizes` pada `<img>` ketika isi gambarnya sama persis, namun Anda ingin peramban mengunduh ukuran lebar piksel (`w`) yang paling pas dengan layar pengguna:

```html
<img
  src="/assets/dasbor-800w.webp"
  srcset="
    /assets/dasbor-400w.webp 400w,
    /assets/dasbor-800w.webp 800w,
    /assets/dasbor-1200w.webp 1200w,
    /assets/dasbor-1600w.webp 1600w
  "
  sizes="(max-width: 768px) 100vw, 800px"
  width="800"
  height="500"
  alt="Tampilan dasbor pemantauan metrik server di Grafana"
>
```

Cara membaca kode di atas:
- **`srcset`** memberi tahu peramban daftar berkas yang tersedia beserta lebar aslinya (`400w` berarti lebar asli gambar adalah 400 piksel).
- **`sizes`** memberi tahu peramban: *"Jika lebar layar maksimal `768px`, gambar ini akan tampil selebar `100vw` (penuh satu layar). Di layar yang lebih besar dari itu, gambar ini hanya ditampilkan selebar `800px`."*
- Peramban kemudian mengalikan ukuran dari `sizes` dengan kepadatan piksel layar perangkat (*Device Pixel Ratio*, misalnya `2x` pada layar Retina/AMOLED) lalu memilih berkas paling efisien dari daftar `srcset`.

### Kasus B: Arah Visual Berbeda (*Art Direction*) atau Seleksi Format dengan `<picture>`
Gunakan elemen `<picture>` ketika Anda ingin:
1. Menyajikan format modern (`image/avif`, `image/webp`) dengan cadangan otomatis ke format `.jpg` atau `.png`.
2. Mengganti potongan gambar (*cropping*) antara layar ponsel yang sempit dan layar desktop yang lebar (*art direction*).

```html
<figure>
  <picture>
    <!-- 1. Prioritaskan format AVIF jika didukung peramban -->
    <source
      type="image/avif"
      srcset="/assets/arsitektur-k8s-800.avif 800w, /assets/arsitektur-k8s-1400.avif 1400w"
      sizes="(max-width: 900px) 100vw, 850px"
    >
    <!-- 2. Cadangan format WebP -->
    <source
      type="image/webp"
      srcset="/assets/arsitektur-k8s-800.webp 800w, /assets/arsitektur-k8s-1400.webp 1400w"
      sizes="(max-width: 900px) 100vw, 850px"
    >
    <!-- 3. Elemen <img> wajib selalu ada di urutan terakhir sebagai perender sesungguhnya -->
    <img
      src="/assets/arsitektur-k8s-800.png"
      width="850"
      height="480"
      alt="Arsitektur klaster Kubernetes: Control Plane berkomunikasi dengan tiga Worker Node melalui kubelet."
    >
  </picture>
  <figcaption>
    Gambar 1.1: Komponen Control Plane dan Worker Node pada klaster Kubernetes.
  </figcaption>
</figure>
```

> **⚠️ Kesalahan Umum: Menganggap `<picture>` yang Menampilkan Gambar**
> Elemen `<picture>` dan `<source>` hanyalah pembungkus logika pemilihan sumber gambar. Yang benar-benar dirender di layar tetaplah elemen `<img>` di dalamnya. Oleh karena itu, atribut `alt`, `width`, `height`, `loading`, dan kelas CSS untuk gaya gambar tetap harus ditempelkan pada elemen `<img>`, bukan pada `<picture>`.

## 4. Menyematkan Audio (`<audio>`) dan Video (`<video>`) beserta Takarir (`<track>`)

HTML menyediakan pemutar media bawaan tanpa memerlukan plugin tambahan. Agar media video ramah aksesibilitas (bagi pengguna tuli/kurang dengar maupun pengguna yang menonton di tempat umum tanpa suara), selalu sertakan takarir (*captions/subtitles*) berformat **WebVTT (`.vtt`)** menggunakan elemen `<track>`:

```html
<video
  controls
  preload="metadata"
  poster="/assets/poster-instalasi-linux.webp"
  width="1280"
  height="720"
>
  <source src="/media/instalasi-linux.webm" type="video/webm">
  <source src="/media/instalasi-linux.mp4" type="video/mp4">
  <track
    kind="captions"
    src="/media/instalasi-linux.id.vtt"
    srclang="id"
    label="Bahasa Indonesia"
    default
  >
  <p>
    Peramban Anda tidak mendukung pemutaran video HTML5. Anda dapat
    <a href="/media/instalasi-linux.mp4" download>mengunduh video ini (MP4)</a>.
  </p>
</video>
```

- **`preload="metadata"`:** Menghemat kuota pengunjung dengan hanya mengunduh informasi durasi dan dimensi video saat halaman dibuka, bukan mengunduh seluruh isi video sebelum tombol *Play* ditekan.
- **Aturan Autoplay di Peramban Modern:** Peramban akan memblokir video yang memiliki atribut `autoplay` kecuali video tersebut juga memiliki atribut **`muted`** (tanpa suara) atau pengguna sudah berinteraksi langsung dengan halaman. Untuk video latar pendek pengganti GIF, gunakan kombinasi `<video autoplay loop muted playsinline>`.

## Latihan Praktik: Menyusun Galeri Diagram Teknis

Buatlah sebuah berkas `media-responsif.html` yang menampilkan:
1. Sebuah gambar ilustrasi di dalam `<figure>` dan `<figcaption>`, lengkap dengan `<picture>` yang menyediakan sumber `image/avif`, `image/webp`, dan fallback `<img>` dengan `width`, `height`, dan `alt` yang deskriptif.
2. Satu ikon hiasan dekoratif yang berdampingan dengan teks subjudul (pastikan atribut `alt` diatur agar diabaikan oleh pembaca layar).
3. Satu pemutar `<video>` dengan `preload="metadata"`, gambar `poster`, dua opsi `<source>` (`webm` dan `mp4`), serta elemen `<track>` untuk takarir Bahasa Indonesia.

## Kuis Pemahaman

### Soal 1
Mengapa Anda tetap disarankan menulis atribut `width` dan `height` pada elemen `<img>` meskipun lebar gambar sudah diatur secara fleksibel menggunakan `max-width: 100%; height: auto;` di CSS?
- A. Karena tanpa atribut `width` dan `height`, gambar berformat WebP dan AVIF tidak dapat ditampilkan oleh peramban.
- B. Agar peramban dapat langsung menghitung rasio aspek gambar dan memesan ruang tinggi yang tepat sebelum berkas gambar selesai diunduh, sehingga mencegah pergeseran tata letak (*Cumulative Layout Shift*).
- C. Agar ukuran berkas gambar otomatis dikompresi menjadi setengahnya oleh server.
- D. Karena properti CSS `max-width` hanya berfungsi jika elemen memiliki atribut `width` di HTML.

**Jawaban Benar:** B
**Penjelasan:** Peramban modern menggunakan nilai `width` dan `height` pada HTML untuk menetapkan rasio aspek internal (`aspect-ratio`) dari elemen `<img>`. Dengan begitu, saat `max-width: 100%; height: auto;` diterapkan, peramban tahu persis berapa piksel tinggi kotak yang harus disiapkan bahkan sebelum byte gambar selesai diunduh.

### Soal 2
Bagaimana cara yang benar untuk menulis atribut `alt` pada sebuah elemen `<img>` yang murni berfungsi sebagai hiasan visual (tidak membawa informasi tambahan apa pun)?
- A. Menghapus atribut `alt` dari tag `<img>`.
- B. Menulis `alt="gambar dekoratif tidak penting"`.
- C. Menulis atribut `alt` dengan nilai string kosong: `alt=""`.
- D. Menulis nama berkas gambar di dalam `alt`.

**Jawaban Benar:** C
**Penjelasan:** Menulis `alt=""` (string kosong) secara eksplisit memberi tahu teknologi bantu seperti pembaca layar bahwa gambar tersebut bersifat dekoratif sehingga dapat dilewati dengan tenang. Sebaliknya, menghapus atribut `alt` sama sekali membuat pembaca layar menganggap pengembang lupa memberi deskripsi lalu membacakan nama berkas gambarnya.

### Soal 3
Apa fungsi atribut `preload="metadata"` pada elemen `<video>`?
- A. Mengunduh seluruh isi video secara penuh di latar belakang begitu halaman dibuka.
- B. Meminta peramban untuk hanya mengunduh informasi dasar video (seperti durasi, dimensi, dan bingkai awal) sampai pengguna menekan tombol putar.
- C. Memutar video secara otomatis tanpa suara ketika video masuk ke area pandang layar.
- D. Mengambil daftar takarir (`.vtt`) dari server pihak ketiga.

**Jawaban Benar:** B
**Penjelasan:** Nilai `preload="metadata"` menjaga keseimbangan terbaik antara pengalaman pengguna dan penghematan kuota jaringan: pengguna dapat langsung melihat durasi video di antarmuka pemutar, sementara berkas video berukuran besar baru diunduh saat pengguna benar-benar ingin menontonnya.

## Sumber
- [Using responsive images in HTML — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)
- [`<video>`: The Video Embed element — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video)
- [Cumulative Layout Shift (CLS) — web.dev](https://web.dev/articles/cls)
