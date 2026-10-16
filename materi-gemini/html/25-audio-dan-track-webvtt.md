# Elemen `<audio>` dan Subtitel/Transkrip `<track>` (WebVTT) untuk Aksesibilitas Media

- **Tingkat:** Menengah
- **Ringkasan:** Menyematkan pemutar suara dan siniar (*podcast*) standar web menggunakan elemen `<audio>`, menyediakan format alternatif (`audio/ogg; codecs=opus`, `audio/mp4`, `audio/mpeg`) melalui `<source>`, mengatur strategi `preload`, serta melampirkan teks transkrip tersinkronisasi dengan `<track kind="captions">` berformat WebVTT (`.vtt`).

## 1. Struktur Elemen `<audio>` Multi-Sumber dengan Fallback

Jangan pernah mengaktifkan atribut `autoplay` pada elemen `<audio>` tanpa persetujuan eksplisit pengguna, karena suara mendadak mengganggu pembaca layar (*screen reader*) dan langsung diblokir oleh kebijakan Autoplay peramban modern.

```html
<figure class="pemutar-audio">
  <figcaption id="judul-siniar">Episode 14: Arsitektur HTTP/3 &amp; QUIC</figcaption>
  <audio controls preload="metadata" aria-labelledby="judul-siniar">
    <source src="/media/ep14-http3.opus" type="audio/ogg; codecs=opus">
    <source src="/media/ep14-http3.m4a" type="audio/mp4">
    <source src="/media/ep14-http3.mp3" type="audio/mpeg">
    <track kind="captions" src="/media/ep14-http3.id.vtt" srclang="id" label="Bahasa Indonesia" default>
    <p>Peramban Anda tidak mendukung pemutar audio HTML5. <a href="/media/ep14-http3.mp3" download>Unduh rekaman MP3 (12 MB)</a>.</p>
  </audio>
</figure>
```

> **💡 Tips Performa (`preload="metadata"`):** Gunakan `preload="metadata"` agar peramban hanya mengunduh informasi durasi dan dimensi berkas (beberapa kilobyte), bukan mengunduh seluruh berkas audio puluhan megabyte sebelum pengguna menekan tombol Putar.

## Latihan Praktik Mandiri

1. Buat sebuah halaman daftar episode siniar menggunakan `<figure>`, `<figcaption>`, dan `<audio controls preload="metadata">`.
2. Sertakan minimal dua `<source>` dengan atribut `type` MIME yang akurat dan satu tautan unduh fallback di dalam tag `<audio>`.

## Kuis Pemahaman

### Soal 1
Nilai atribut `preload` manakah pada elemen `<audio>` yang paling hemat kuota data pengguna namun tetap menampilkan total durasi rekaman saat halaman dimuat?
- A. `preload="auto"`
- B. `preload="metadata"`
- C. `preload="full"`
- D. `preload="all"`

**Jawaban Benar:** B
**Penjelasan:** `preload="metadata"` menginstruksikan peramban untuk hanya mengambil header metadata berkas (seperti durasi audio) tanpa mengunduh seluruh aliran suara sebelum diputar.

### Soal 2
Apa fungsi dari teks atau tautan yang diletakkan di antara tag pembuka `<audio>` dan penutup `</audio>` di bawah elemen `<source>`?
- A. Ditampilkan sebagai judul lagu di atas pemutar audio pada semua peramban
- B. Ditampilkan sebagai konten cadangan (*fallback*) hanya apabila peramban pengguna tidak mendukung elemen `<audio>`
- C. Mengubah kecepatan pemutaran audio menjadi 2x lipat
- D. Mengirimkan statistik pendengar ke server secara otomatis

**Jawaban Benar:** B
**Penjelasan:** Konten di dalam elemen `<audio>` (selain `<source>` dan `<track>`) hanya dirender sebagai *fallback* bagi klien yang tidak mendukung pemutaran audio HTML5.

### Soal 3
Mengapa atribut `type` pada elemen `<source>` (misalnya `type="audio/ogg; codecs=opus"`) sangat disarankan untuk selalu ditulis?
- A. Agar peramban dapat langsung melewati format yang tidak didukungnya tanpa harus mengunduh potongan berkas tersebut terlebih dahulu
- B. Karena tanpa atribut `type`, berkas `.mp3` akan berubah menjadi gambar
- C. Untuk mengenkripsi berkas audio dengan kata sandi
- D. Hanya sebagai komentar yang diabaikan oleh peramban

**Jawaban Benar:** A
**Penjelasan:** Dengan memeriksa atribut `type`, peramban segera mengetahui apakah codec tersebut didukung secara lokal tanpa membuang permintaan jaringan percuma.

## Sumber

- [MDN Web Docs — `<audio>`: The Embed Audio element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/audio)
- [WHATWG HTML Living Standard — Media Elements](https://html.spec.whatwg.org/multipage/)
