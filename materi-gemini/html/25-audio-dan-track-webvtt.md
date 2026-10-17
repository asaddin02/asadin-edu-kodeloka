# Elemen `<audio>` dan Subtitel/Transkrip `<track>` (WebVTT) untuk Aksesibilitas Media

- **Tingkat:** Menengah
- **Ringkasan:** Menyematkan pemutar suara dan siniar (*podcast*) standar web menggunakan elemen `<audio>`, menyediakan format alternatif (`audio/ogg; codecs=opus`, `audio/mp4`, `audio/mpeg`) melalui `<source>`, mengatur strategi `preload`, serta melampirkan teks transkrip tersinkronisasi dengan `<track kind="captions">` berformat WebVTT (`.vtt`).

## Mengapa Pemutar Audio Bawaan HTML Lebih Unggul daripada Plugin Pihak Ketiga?

Menyajikan rekaman siniar (*podcast*), pelafalan kosakata, atau cuplikan musik di halaman web tidak memerlukan pustaka pemutar eksternal yang membebani unduhan JavaScript. Elemen `<audio>` bawaan HTML5 menyediakan kontrol pemutaran yang sudah dapat diakses dengan papan ketik, mendukung negosiasi codec berjenjang melalui elemen `<source>`, dan menghormati penghematan kuota data pengguna melalui atribut `preload`.

Tantangan utamanya terletak pada **kompatibilitas codec lintas peramban**, **kebijakan pemblokiran suara otomatis (*autoplay policy*)**, serta **aksesibilitas bagi pengguna Tuli atau kurang dengar** yang membutuhkan transkrip tertulis.

## 1. Anatomi Elemen `<audio>` Multi-Sumber dan Atribut Pengendalinya

Ketika Anda menyediakan lebih dari satu format berkas suara, letakkan elemen `<source>` di dalam `<audio>` mulai dari format yang paling efisien (seperti **Opus di dalam kontainer Ogg**) hingga format yang paling luas dukungannya (**AAC/MP4** dan **MP3**). Peramban akan membaca daftar `<source>` dari atas ke bawah dan mengunduh berkas pertama yang didukungnya.

| Atribut / Elemen | Nilai & Contoh | Fungsi Teknis di Peramban |
|---|---|---|
| `controls` | Atribut boolean (`controls`) | Menampilkan antarmuka pemutar bawaan peramban (tombol putar/jeda, bilah waktu, dan pengatur volume). |
| `preload` | `"none"`, `"metadata"`, `"auto"` | Mengatur seberapa banyak data audio yang diunduh sebelum pengguna menekan tombol Putar. Gunakan `"metadata"` sebagai standar. |
| `loop` | Atribut boolean (`loop`) | Mengulang pemutaran audio dari awal secara otomatis setiap kali mencapai akhir rekaman. |
| `muted` | Atribut boolean (`muted`) | Membisukan keluaran suara secara bawaan saat halaman dimuat. |
| `<source>` | `src="..." type="audio/ogg; codecs=opus"` | Mendeklarasikan jalur berkas audio alternatif beserta tipe MIME dan codec-nya agar peramban tidak mengunduh format yang tak didukung. |

Jangan pernah mengaktifkan atribut `autoplay` pada elemen `<audio>` tanpa persetujuan eksplisit pengguna. Suara yang berbunyi tiba-tiba akan menimpa suara pembaca layar (*screen reader*) yang sedang digunakan tunanetra dan langsung diblokir oleh kebijakan Autoplay peramban modern.

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

> **💡 Tips Performa (`preload="metadata"`):** Gunakan `preload="metadata"` agar peramban hanya mengunduh informasi durasi dan metadata berkas (beberapa kilobyte), bukan mengunduh seluruh berkas audio puluhan megabyte sebelum pengguna menekan tombol Putar. Jika satu halaman memuat puluhan pemutar audio sekaligus (misalnya daftar kamus pengucapan), gunakan `preload="none"` agar tidak memicu puluhan permintaan jaringan saat halaman dibuka.

## 2. Keterbatasan `<track>` pada `<audio>` dan Pola Transkrip Aksesibel

Banyak pengembang mengira bahwa menambahkan `<track kind="captions" src="...vtt">` di dalam `<audio>` akan otomatis memunculkan kotak teks takarir di layar seperti pada `<video>`. Padahal, spesifikasi HTML secara tegas menyatakan bahwa **elemen `<audio>` tidak memiliki area perenderan visual (*rendering area*)**, sehingga peramban tidak pernah menampilkan teks `<track>` secara visual pada pemutar `<audio>`.

> **⚠️ Catatan Spesifikasi WHATWG:** Spesifikasi HTML menyebut bahwa elemen `<audio>` tidak memiliki area pemutaran untuk konten visual seperti takarir, sehingga peramban tidak menampilkan teks `<track>` pada pemutar audio; isinya hanya dapat diakses lewat JavaScript (`textTracks`). Agar siniar tetap aksesibel bagi pengguna Tuli sesuai **WCAG 1.2.1 (Audio-only and Video-only)**, sediakan juga transkrip teks lengkap di halaman, misalnya di dalam `<details>` di bawah pemutar, atau baca event `cuechange` dari `textTracks` untuk menampilkannya ke elemen HTML pendamping.

Berikut adalah pola lengkap yang menggabungkan pembacaan `<track>` secara sinkron melalui API DOM `textTracks` sekaligus menyediakan transkrip lengkap di dalam `<details>` bagi pengguna tanpa JavaScript maupun mesin pencari:

```html
<section aria-labelledby="judul-episode">
  <h2 id="judul-episode">Siniar Kodeloka #15: Mengamankan Cookie Sesi</h2>

  <audio id="audio-siniar" controls preload="metadata">
    <source src="/media/ep15-cookie.opus" type="audio/ogg; codecs=opus">
    <source src="/media/ep15-cookie.mp3" type="audio/mpeg">
    <track id="trek-siniar" kind="captions" src="/media/ep15-cookie.id.vtt" srclang="id" label="Bahasa Indonesia" default>
    <p><a href="/media/ep15-cookie.mp3" download>Unduh rekaman MP3</a></p>
  </audio>

  <!-- Kotak penampil cue aktif dari berkas WebVTT -->
  <p id="takarir-aktif" aria-live="polite" class="kotak-takarir">
    Tekan tombol Putar untuk melihat teks percakapan secara langsung.
  </p>

  <!-- Transkrip statis utuh untuk aksesibilitas WCAG 1.2.1 -->
  <details>
    <summary>Baca transkrip lengkap episode ini</summary>
    <div class="isi-transkrip">
      <p><strong>[00:00] Pembawa Acara:</strong> Selamat datang kembali di Siniar Kodeloka. Hari ini kita membahas atribut HttpOnly dan SameSite pada cookie.</p>
      <p><strong>[00:12] Narasumber:</strong> Tanpa atribut HttpOnly, skrip berbahaya yang masuk lewat celah XSS dapat mencuri cookie sesi melalui document.cookie.</p>
    </div>
  </details>
</section>

<script>
  const audio = document.getElementById("audio-siniar");
  const kotakTakarir = document.getElementById("takarir-aktif");
  const trek = audio.textTracks[0];

  if (trek) {
    trek.mode = "hidden"; // Aktifkan pemuatan cue tanpa area visual video
    trek.addEventListener("cuechange", () => {
      const cueSaatIni = trek.activeCues[0];
      if (cueSaatIni) {
        kotakTakarir.textContent = cueSaatIni.text;
      }
    });
  }
</script>
```

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Menulis atribut `src` langsung pada `<audio>` sekaligus menaruh `<source>` di dalamnya:** Jika Anda ingin menyediakan beberapa format codec, jangan tulis `src` pada tag `<audio>`, melainkan letakkan seluruh jalur berkas di dalam elemen anak `<source>`.
2. **Mengabaikan atribut `type` pada `<source>`:** Tanpa `type="audio/ogg; codecs=opus"`, peramban terpaksa mengunduh potongan awal berkas untuk menebak formatnya sebelum menyadari bahwa codec tersebut tidak didukung.
3. **Menyembunyikan kontrol bawaan (`controls`) tanpa membuat tombol pengganti yang aksesibel:** Jika Anda menghilangkan atribut `controls` demi membuat antarmuka pemutar kustom, Anda wajib menyediakan tombol `<button>` dengan label jelas dan penggeser waktu yang dapat dioperasikan sepenuhnya dengan papan ketik.
4. **Mengandalkan `<track>` saja pada `<audio>` tanpa elemen penampil atau transkrip HTML:** Karena `<audio>` tidak merender takarir ke layar, pengguna Tuli tetap tidak bisa membaca isi pembicaraan apabila Anda tidak menyediakan `<details>` transkrip atau membaca `textTracks` ke DOM.

## Latihan Praktik Mandiri

1. Buatlah berkas `siniar-kodeloka.html` yang menampilkan satu episode siniar menggunakan `<figure>`, `<figcaption>`, dan `<audio controls preload="metadata">`.
2. Sertakan tiga elemen `<source>` berurutan untuk format Opus (`.opus`), AAC (`.m4a`), dan MP3 (`.mp3`) lengkap dengan atribut `type` MIME yang akurat, serta satu paragraf tautan unduh *fallback* di bagian paling bawah di dalam `<audio>`.
3. Tambahkan elemen `<details>` tepat di bawah `<figure>` yang memuat transkrip tertulis lengkap dengan penanda waktu per pembicara.

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
- [WHATWG HTML Living Standard — Media Elements](https://html.spec.whatwg.org/multipage/media.html)
