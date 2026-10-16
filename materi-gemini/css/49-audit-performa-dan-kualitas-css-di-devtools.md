# Audit Performa CSS, Coverage Tab, Layout Shift Debugging, dan Daftar Periksa Produksi

- **Tingkat:** Lanjut
- **Ringkasan:** Menggunakan tab Coverage, Performance, Rendering, dan Layers di Browser DevTools untuk menemukan aturan CSS tak terpakai, melacak penyebab *Cumulative Layout Shift*, dan memverifikasi kontras warna.

## Mengapa Perlu Mengaudit CSS?

Menulis CSS yang benar belum cukup; CSS juga perlu **cepat dimuat**, **stabil saat dirender**, dan **aksesibel**. Seiring waktu, stylesheet cenderung membengkak (aturan lama yang tak terpakai), memicu *layout shift* (halaman melompat saat memuat), dan melanggar kontras. Pelajaran ini memakai DevTools (contoh memakai Chrome/Edge; Firefox dan Safari memiliki padanan di inspektur masing-masing) untuk mengukur ketiganya.

## 1. Tab Coverage: Menemukan CSS yang Tidak Terpakai

**Coverage** menunjukkan seberapa banyak byte CSS (dan JavaScript) yang **benar-benar dipakai** selama Anda berinteraksi dengan halaman.

Langkah-langkah:
1. Buka DevTools, tekan `Ctrl + Shift + P` (Command Menu), ketik `coverage`, lalu pilih **Show Coverage**. Panelnya muncul di *drawer*.
2. Klik **Reload** agar halaman dimuat ulang sambil direkam (atau mulai rekaman lalu lakukan interaksi).
3. Lakukan alur pengguna yang penting: menggulir, membuka menu, membuka dialog, mengubah ukuran jendela.
4. Hentikan rekaman. Setiap berkas CSS menampilkan **persentase byte tak terpakai** dengan bilah penggunaan. Klik berkas untuk melihat baris yang dipakai dan yang tidak.

> **⚠️ Hati-hati Menghapus:** Coverage hanya mencerminkan kode yang berjalan **selama rekaman**. Aturan untuk status yang belum Anda picu (halaman lain, `:hover`, kondisi galat, mode gelap, layar sempit, cetak) akan tampak "tak terpakai" padahal diperlukan. Jangan menghapus berdasarkan satu rekaman; uji berbagai alur dan ukuran layar, lalu verifikasi sebelum menghapus.

Strategi mengurangi CSS tak terpakai: pecah CSS per halaman atau per rute, hapus komponen yang sudah tidak ada, dan gunakan alat *build* yang membuang aturan yang tidak dirujuk (dengan konfigurasi *safelist* untuk kelas dinamis).

## 2. Tab Performance: Biaya Perenderan CSS

Rekam pemuatan halaman atau interaksi di tab **Performance**, lalu perhatikan:
- **Recalculate Style**: biaya menghitung gaya. Selektor yang sangat luas dan DOM yang sangat besar membuatnya lama.
- **Layout**: biaya menghitung ulang tata letak (*reflow*). Sering membengkak akibat perubahan dimensi di dalam perulangan atau animasi properti tata letak.
- **Paint** dan **Composite**: biaya menggambar dan menyusun lapisan.
- Periksa **Layout Shifts** pada garis waktu untuk melihat kapan halaman melompat.

Pelajaran 18 membahas `content-visibility` dan `contain` untuk mengurangi biaya ini.

## 3. Tab Rendering: Melihat Masalah Secara Visual

Buka **Command Menu**, ketik `rendering`, lalu pilih **Show Rendering**. Beberapa opsi yang berguna:
- **Paint flashing**: area yang digambar ulang disorot hijau. Animasi yang menggambar ulang area luas menandakan properti yang memicu *paint*.
- **Layout Shift Regions**: area yang bergeser disorot ungu sementara setelah halaman dimuat ulang.
- **Layer borders**: batas lapisan komposit.
- **Emulate CSS media feature**: simulasi `prefers-color-scheme`, `prefers-reduced-motion`, `prefers-contrast`, `forced-colors`, dan lain-lain (Pelajaran 47).
- **Emulate CSS media type**: beralih ke `print` untuk menguji gaya cetak (Pelajaran 17).

Panel **Layers** (More tools > Layers) menampilkan lapisan komposit sebagai tampilan 3D, berguna untuk mencari elemen yang memakan memori GPU karena terlalu banyak lapisan.

## 4. Melacak *Cumulative Layout Shift* (CLS)

**CLS** mengukur seberapa sering konten bergeser tak terduga saat halaman dimuat. Ambang batasnya (diukur pada persentil ke-75 pemuatan halaman, terpisah untuk seluler dan desktop): **baik** `0,1` atau kurang, **perlu perbaikan** di antara `0,1` dan `0,25`, dan **buruk** di atas `0,25`.

Penyebab umum dan perbaikan CSS-nya:

| Penyebab | Perbaikan |
|---|---|
| Gambar atau video tanpa dimensi | Beri atribut `width` dan `height` atau `aspect-ratio` (Pelajaran 27) |
| Fon web yang berbeda ukuran dari fon cadangan | `font-display`, `size-adjust`, `font-size-adjust` (Pelajaran 35) |
| Iklan atau *widget* yang mengubah ukuran setelah dimuat | Pesan ruang dengan `min-block-size` atau `aspect-ratio` |
| Elemen disisipkan di atas konten yang sudah ada | Pesan ruangnya, atau sisipkan di bawah layar pertama |
| Konten di luar layar yang dirender mendadak | `contain-intrinsic-size: auto <perkiraan>` (Pelajaran 18) |
| Animasi memakai `top`, `left`, `width` | Gunakan `transform` dan `opacity` |

Cara menyelidiki: aktifkan **Layout Shift Regions**, muat ulang, dan lihat blok ungu; lalu di tab **Performance** klik peristiwa **Layout Shift** untuk melihat elemen mana yang bergeser dan seberapa jauh.

## 5. Memeriksa Kontras Warna

Di panel **Elements > Styles**, klik kotak warna di samping properti `color` untuk membuka *color picker*; DevTools menampilkan **rasio kontras** terhadap latar dan menandai apakah memenuhi WCAG AA (4,5:1 untuk teks biasa, 3:1 untuk teks besar). Panel **Accessibility** juga menampilkan informasi aksesibilitas elemen. Untuk audit otomatis lebih luas, jalankan **Lighthouse**.

## 6. Daftar Periksa Produksi

**Performa**
- Minifikasi dan kompresi (gzip atau Brotli) CSS; hindari rantai `@import` (muat dengan `<link>` atau gabungkan lewat alat *build*).
- Muat fon dengan `font-display` dan *subset*; pertimbangkan `preload` untuk fon kritis.
- Terapkan `content-visibility: auto` pada bagian panjang di luar layar pertama.
- Animasikan hanya `transform` dan `opacity`.

**Stabilitas**
- Semua gambar dan video memiliki dimensi atau `aspect-ratio`.
- Ruang untuk konten dinamis sudah dipesan.

**Aksesibilitas**
- Indikator fokus terlihat (`:focus-visible`), kontras sesuai WCAG, `prefers-reduced-motion` dihormati.
- Diuji dengan `forced-colors` dan `prefers-contrast` (Pelajaran 47).
- Ukuran teks memakai `rem` dan tata letak tetap rapi pada pembesaran 200%.

**Kualitas**
- Arsitektur lapisan (`@layer`) dan konvensi penamaan konsisten (Pelajaran 48).
- Tidak ada `!important` yang tidak perlu dan tidak ada aturan yang saling menimpa tanpa alasan.
- Gaya cetak diuji.

## Kesalahan Umum dan Cara Menghindarinya

1. **Menghapus CSS "merah" di Coverage tanpa memeriksa status lain.** Aturan untuk `:hover`, mode gelap, atau halaman lain bisa saja diperlukan.
2. **Mengukur performa hanya di komputer cepat.** Uji dengan pembatasan CPU dan jaringan di DevTools.
3. **Menyelesaikan CLS dengan menyembunyikan konten.** Pesan ruangnya, jangan menyembunyikannya.
4. **Mengandalkan rasio kontras DevTools sebagai satu-satunya uji aksesibilitas.** Tetap uji dengan papan ketik dan pembaca layar.
5. **Mengabaikan data lapangan.** Data laboratorium (DevTools, Lighthouse) melengkapi, bukan menggantikan, data pengguna nyata.

## Latihan Praktik: Audit Satu Halaman

Pilih satu halaman dari proyek Anda dan lakukan:
1. Rekam **Coverage**, lakukan lima interaksi umum, lalu catat tiga berkas CSS dengan persentase tak terpakai tertinggi dan apa penyebabnya.
2. Aktifkan **Paint flashing** dan **Layout Shift Regions**, lalu temukan satu elemen yang memicu repaint luas atau pergeseran.
3. Periksa kontras tiga warna teks di color picker; perbaiki yang di bawah 4,5:1.
4. Tulis ringkasan satu halaman: temuan, perbaikan, dan hasil pengukuran ulang.

## Kuis Pemahaman

### Soal 1
Sebuah berkas CSS menunjukkan 60% tak terpakai di Coverage setelah Anda hanya membuka halaman beranda. Apa langkah yang paling bijak?
- A. Hapus seluruh 60% tersebut.
- B. Abaikan hasilnya sepenuhnya.
- C. Tambahkan `!important` ke seluruh aturan.
- D. Periksa berbagai alur dan keadaan (halaman lain, `:hover`, mode gelap, layar sempit, cetak) sebelum menghapus, karena Coverage hanya melaporkan kode yang berjalan selama rekaman.

**Jawaban Benar:** D
**Penjelasan:** Coverage hanya mencerminkan apa yang dieksekusi selama rekaman. Aturan untuk keadaan yang belum dipicu akan tampak tak terpakai padahal diperlukan.

### Soal 2
Gambar tanpa atribut `width` dan `height` menyebabkan teks di bawahnya melompat saat gambar selesai dimuat. Metrik apa yang terpengaruh dan perbaikan CSS/HTML-nya?
- A. LCP; tambahkan `loading="lazy"`.
- B. INP; tambahkan `overflow: hidden`.
- C. CLS (*Cumulative Layout Shift*); beri atribut `width` dan `height` (atau `aspect-ratio`) agar ruang dipesan sebelum gambar dimuat.
- D. TTFB; ganti format gambar.

**Jawaban Benar:** C
**Penjelasan:** Pergeseran tata letak tak terduga diukur oleh CLS. Menyediakan dimensi atau `aspect-ratio` memungkinkan peramban memesan ruang sebelum gambar dimuat.

### Soal 3
Berapa ambang CLS yang dianggap **baik**, dan pada persentil berapa pengukurannya dilakukan?
- A. `0,1` atau kurang, pada persentil ke-75.
- B. `0,5` atau kurang, pada persentil ke-50.
- C. `1` atau kurang, pada persentil ke-95.
- D. `0,25` atau kurang, pada persentil ke-25.

**Jawaban Benar:** A
**Penjelasan:** Menurut web.dev, CLS dianggap baik bila `0,1` atau kurang, dengan pengukuran pada persentil ke-75 pemuatan halaman (terpisah untuk seluler dan desktop). Di atas `0,25` dianggap buruk.

## Sumber
- [Inspect and run code coverage — Chrome DevTools](https://developer.chrome.com/docs/devtools/coverage)
- [Rendering tools — Chrome DevTools](https://developer.chrome.com/docs/devtools/rendering)
- [Debug rendering performance — Chrome DevTools](https://developer.chrome.com/docs/devtools/rendering/performance)
- [Cumulative Layout Shift (CLS) — web.dev](https://web.dev/articles/cls)
- [Debug layout shifts — web.dev](https://web.dev/articles/debug-layout-shifts)
- [Color contrast — Chrome DevTools](https://developer.chrome.com/docs/devtools/accessibility/contrast)
