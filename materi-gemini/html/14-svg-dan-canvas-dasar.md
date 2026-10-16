# Grafik Vektor (`<svg>`) Inline dan Pengantar `<canvas>`

- **Tingkat:** Menengah
- **Ringkasan:** Menyematkan grafik vektor tajam dengan `<svg>` inline, menguasai koordinat `viewBox`, mewarisi warna teks melalui `currentColor`, memastikan aksesibilitas ikon SVG, serta memahami kapan memilih `<svg>` versus `<canvas>`.

## Mengapa Pengembang Front-End Wajib Memahami `<svg>` di Dalam HTML?

Pada pelajaran media sebelumnya, kita mengenal `.svg` sebagai format berkas gambar. Namun, berbeda dengan `.webp` atau `.png` yang terdiri dari kotak-kotak piksel (*raster*), **SVG (*Scalable Vector Graphics*) adalah bahasa markup berbasis XML yang merupakan warga kelas satu di dalam spesifikasi HTML5**.

Artinya, Anda dapat menuliskan tag `<svg>`, `<path>`, `<circle>`, dan `<rect>` **secara langsung (inline) di dalam dokumen HTML** dan mengendalikannya menggunakan CSS maupun JavaScript!

## 1. Menyematkan `<svg>` Inline vs `<img src="ikon.svg">`

| Cara Penyematan | Keunggulan Utama | Keterbatasan |
|---|---|---|
| **`<img src="logo.svg" alt="...">`** | Dapat disimpan terpisah di *cache* peramban; paling sederhana untuk ilustrasi statis. | Anda **tidak** bisa mengubah warna garis/isian di dalamnya lewat CSS `:hover` halaman. |
| **`<svg>...</svg>` Inline di HTML** | **0 permintaan jaringan tambahan**; warna garis/isian dapat mengikuti warna teks tombol secara otomatis lewat `currentColor` dan berubah saat `:hover`! | Menambah jumlah baris DOM jika disalin berulang-ulang (solusinya: gunakan `<symbol>` dan `<use>`). |

### Rahasia `viewBox` dan `currentColor` pada Ikon Antarmuka

Perhatikan anatomi ikon `<svg>` inline yang bersih dan responsif berikut:

```html
<button type="button" class="tombol-unduh">
  <svg
    aria-hidden="true"
     focusable="false"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
  <span>Unduh Modul (PDF)</span>
</button>
```

Mari kita bedah tiga atribut terpenting di atas:
1. **`viewBox="0 0 24 24"` (`min-x min-y width height`):** Mendefinisikan sistem koordinat internal kanvas gambar (`24×24` unit). Berkat `viewBox`, meskipun Anda mengubah atribut ukuran luarnya menjadi `width="16" height="16"` atau `width="64" height="64"`, seluruh garis di dalamnya otomatis diskalakan dengan tajam tanpa terpotong!
2. **`stroke="currentColor"` (atau `fill="currentColor"`):** Kata kunci ajaib `currentColor` memerintahkan SVG untuk **mewarisi warna properti CSS `color` dari elemen induknya**! Jika `.tombol-unduh` memiliki `color: #ffffff` dan saat `:hover` berubah menjadi `color: #38bdf8`, ikon SVG ikut berubah warna secara otomatis tanpa aturan CSS tambahan.
3. **`width` dan `height` eksplisit pada `<svg>`:** Selalu cantumkan atribut `width="20" height="20"` langsung pada tag `<svg>`! Mengapa? Jika suatu saat berkas CSS gagal dimuat, `<svg>` yang tidak memiliki `width` dan `height` di HTML akan membengkak memenuhi seluruh lebar kontainernya!

## 2. Menggunakan Ulang Ikon dengan `<symbol>` dan `<use>` (SVG Sprite)

Jika satu ikon yang sama (misalnya ikon centang `✓` atau tanda bintang) muncul 30 kali di satu halaman tabel, menyalin-tempel `<path>` panjang sebanyak 30 kali akan memperbesar ukuran dokumen HTML.

Solusinya adalah mendefinisikan ikon tersebut cukup **satu kali** di dalam `<svg width="0" height="0" style="position:absolute"><symbol id="...">` (atribut `hidden` tidak berfungsi pada `<svg>` karena `<svg>` bukan elemen HTML, sehingga kotak bawaannya `300×150` piksel tetap memakan ruang), lalu memanggilnya berkali-kali dengan `<use href="#...">`:

```html
<!-- 1. Definisikan kumpulan ikon satu kali saja di awal/akhir body -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="ikon-centang" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <polyline points="20 6 9 17 4 12" />
  </symbol>
</svg>

<!-- 2. Gunakan kembali di mana saja cukup dengan 1 baris <use>! -->
<ul class="daftar-fitur">
  <li>
    <svg aria-hidden="true" width="18" height="18"><use href="#ikon-centang" /></svg>
    Gratis selamanya tanpa akun
  </li>
  <li>
    <svg aria-hidden="true" width="18" height="18"><use href="#ikon-centang" /></svg>
    Dilengkapi latihan dan kuis interaktif
  </li>
</ul>
```

## 3. Aksesibilitas pada `<svg>`

1. **Jika SVG hanya mendampingi teks yang sudah jelas (Dekoratif):** Tambahkan **`aria-hidden="true"`** pada `<svg>` agar pembaca layar tidak berhenti di elemen grafis tersebut.
2. **Jika `<svg>` berdiri sendiri sebagai gambar informatif (misalnya diagram arsitektur tanpa `<img>`):** Tambahkan **`role="img"`** dan **`aria-labelledby="id-judul-svg"`**, lalu letakkan elemen `<title id="id-judul-svg">` sebagai anak pertama di dalam `<svg>`:

```html
<svg role="img" aria-labelledby="judul-grafik-cpu" width="400" height="120" viewBox="0 0 400 120">
  <title id="judul-grafik-cpu">Grafik penggunaan CPU server rata-rata 35% selama 24 jam terakhir</title>
  <rect x="0" y="0" width="400" height="120" rx="8" fill="#0f172a" />
  <polyline fill="none" stroke="#38bdf8" stroke-width="3" points="10,90 100,70 200,80 300,30 390,50" />
</svg>
```

## 4. Pengantar `<canvas>` dan Kapan Memilih `<svg>` vs `<canvas>`

Selain `<svg>`, HTML menyediakan elemen **`<canvas>`** sebagai bidang gambar berbasis bitmap (piksel) yang digambar menggunakan JavaScript (**Canvas 2D API** atau **WebGL / WebGPU**):

```html
<canvas id="kanvas-simulasi" width="600" height="300">
  <!-- Teks fallback di dalam <canvas> wajib disediakan untuk aksesibilitas! -->
  Simulasi pergerakan paket jaringan antara klien dan server.
</canvas>

<script>
  const kanvas = document.getElementById("kanvas-simulasi");
  const ctx = kanvas.getContext("2d");

  // Menggambar persegi panjang biru dan teks di atas kanvas piksel
  ctx.fillStyle = "#2563eb";
  ctx.fillRect(20, 20, 160, 80);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("Node Server 01", 40, 65);
</script>
```

### Tabel Keputusan: `<svg>` vs `<canvas>`

| Kriteria | Gunakan `<svg>` | Gunakan `<canvas>` |
|---|---|---|
| **Bentuk Penyimpanan** | Setiap garis/bentuk adalah elemen DOM (`<rect>`, `<path>`) yang bisa diklik dan diberi CSS. | Hanya satu elemen `<canvas>`; begitu digambar, pikselnya "kering" (tidak ada objek DOM per bentuk). |
| **Ketajaman Saat Diperbesar** | Selalu tajam 100% di semua resolusi layar. | Berbasis piksel; bisa pecah jika diperbesar tanpa menyesuaikan `devicePixelRatio`. |
| **Jumlah Objek** | Terbaik untuk **ratusan** elemen (ikon, logo, peta interaktif, diagram arsitektur). | Terbaik untuk **ribuan hingga ratusan ribu** objek bergerak cepat (gim 2D/3D, partikel, pengolahan citra/video real-time). |
| **Aksesibilitas** | Sangat mudah diakses karena teks dan `<title>` ada di DOM. | Pembaca layar tidak bisa membaca piksel gambar; wajib menyediakan konten fallback atau atribut ARIA. |

## Latihan Praktik: Membuat Sistem Ikon SVG Sprite dan Grafik Bar Sederhana

Buatlah berkas `svg-dan-canvas.html`:
1. Buat definisi `<svg width="0" height="0" style="position:absolute">` berisi dua `<symbol>` (`#ikon-server` dan `#ikon-database`) dengan `viewBox="0 0 24 24"` dan `stroke="currentColor"`.
2. Tampilkan kedua ikon tersebut di dalam tombol menggunakan `<use href="#...">`.
3. Buat satu diagram batang sederhana menggunakan `<svg role="img" aria-labelledby="...">` yang menampilkan `<rect>` dan `<text>` untuk perbandingan waktu muat 3 server.

## Kuis Pemahaman

### Soal 1
Apa fungsi dari nilai `stroke="currentColor"` atau `fill="currentColor"` pada elemen `<svg>` inline yang diletakkan di dalam sebuah `<button>`?
- A. Mengubah warna ikon secara acak setiap kali halaman dimuat ulang.
- B. Memerintahkan garis atau isian SVG untuk otomatis menggunakan nilai warna teks (`color`) yang sedang aktif pada elemen induk `<button>`, termasuk saat warna teks tombol berubah ketika `:hover` atau `:focus-visible`.
- C. Memaksa ikon selalu berwarna hitam pekat.
- D. Menyembunyikan ikon pada mode gelap (*dark mode*).

**Jawaban Benar:** B
**Penjelasan:** Kata kunci CSS `currentColor` merepresentasikan nilai komputasi dari properti `color` pada elemen tersebut. Dengan memasang `stroke="currentColor"` pada SVG di dalam tombol, warna ikon selalu selaras dengan warna teks tombol di segala keadaan.

### Soal 2
Mengapa sebuah elemen `<svg>` inline sebaiknya selalu memiliki atribut `width` dan `height` eksplisit (misalnya `width="24" height="24"`) selain `viewBox="0 0 24 24"`?
- A. Karena atribut `viewBox` tidak berfungsi jika tidak ada atribut `width`.
- B. Sebagai pengaman tampilan (*defensive rendering*) agar apabila berkas CSS eksternal gagal dimuat atau terlambat tiba, ikon SVG tidak membengkak memenuhi lebar layar penuh (`100%` lebar kontainer).
- C. Agar berkas HTML dapat disimpan sebagai gambar PNG.
- D. Untuk mematikan animasi di dalam SVG.

**Jawaban Benar:** B
**Penjelasan:** Tanpa atribut `width` dan `height` pada tag `<svg>`, ukuran bawaan SVG dengan `viewBox` akan merentang selebar `100%` dari wadahnya jika CSS belum/gagal dimuat (fenomena *giant runaway icons*). Menulis `width="24" height="24"` di HTML tetap dapat ditimpa dengan mudah oleh CSS kapan saja, namun menjaga tata letak tetap aman.

### Soal 3
Kapan Anda sebaiknya memilih elemen `<canvas>` dibandingkan `<svg>`?
- A. Saat membuat logo perusahaan dan ikon tombol navigasi.
- B. Saat merender simulasi visual dengan puluhan ribu partikel yang bergerak 60 bingkai per detik atau melakukan manipulasi piksel gambar secara langsung, di mana membuat ribuan simpul DOM `<svg>` akan membebani memori.
- C. Saat membuat diagram alur statis yang teks di dalamnya perlu bisa dicari (`Ctrl+F`) dan dibaca oleh pembaca layar.
- D. Saat ingin membuat gambar yang otomatis tajam saat dicetak pada ukuran spanduk raksasa.

**Jawaban Benar:** B
**Penjelasan:** `<canvas>` bekerja dalam mode *immediate-mode pixel rendering* tanpa membebani pohon DOM dengan ribuan simpul objek, sehingga sangat cepat untuk gim, visualisasi data skala masif, dan pengolahan piksel. Untuk ikon, logo, dan diagram antarmuka, `<svg>` jauh lebih unggul.

## Sumber
- [HTML elements reference (`<svg>`, `<canvas>`) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
- [Canvas API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Basic usage of canvas — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage)
