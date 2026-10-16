# Proyek Akhir Kelas HTML: Halaman Portofolio dan Dokumentasi Teknis Insinyur Perangkat Lunak

- **Tingkat:** Lanjut
- **Ringkasan:** Mengintegrasikan seluruh materi kelas HTML—mulai dari struktur landmark semantik, metadata SEO & JSON-LD, gambar responsif, tabel perbandingan arsitektur, komponen interaktif `<details>` & `<dialog>`, hingga formulir kontak tervalidasi—ke dalam satu halaman utuh yang siap pakai.

## Gambaran Proyek

Selamat! Anda telah mempelajari fondasi cara kerja web, struktur dokumen, semantik teks dan tata letak, navigasi aman, media responsif, tabel data aksesibel, formulir beserta validasinya, aksesibilitas (a11y), SEO teknis, elemen interaktif modern, hingga optimasi performa pemuatan.

Dalam proyek penutup kelas HTML ini, Anda akan merakit satu dokumen HTML produksi yang utuh untuk **Halaman Portofolio & Studi Kasus Rekayasa Perangkat Lunak**. Halaman ini dirancang agar:
1. **100% Semantik & Aksesibel:** Memiliki *skip link*, landmark lengkap (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`), urutan heading yang rapi, serta atribut ARIA yang tepat.
2. **Cepat & Siap Mesin Pencari:** Dilengkapi metadata Open Graph, `<link rel="canonical">`, JSON-LD `ProfilePage`, prioritas gambar utama `fetchpriority="high"`, dan `loading="lazy"` untuk media di bagian bawah.
3. **Interaktif Tanpa Pustaka Eksternal:** Menggunakan akordeon eksklusif `<details name="...">`, pratinjau rincian proyek dengan `<dialog>`, dan formulir kolaborasi dengan validasi HTML5 bawaan.

## Kode Lengkap Proyek (`index.html`)

Simpan kode berikut sebagai `index.html` dan bukalah di peramban Anda untuk menguji seluruh fiturnya (navigasi papan ketik `Tab`, akordeon, dialog modal, dan validasi formulir):

```html
<!DOCTYPE html>
<html lang="id" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nadia Pratama — Insinyur Backend & Infrastruktur | Portofolio Kodeloka</title>
    <meta
      name="description"
      content="Portofolio teknis Nadia Pratama: studi kasus migrasi PostgreSQL tanpa downtime, arsitektur API Go & PHP, serta formulir kolaborasi teknis."
    >
    <link rel="canonical" href="https://kodeloka.asadinedu.com/contoh-portofolio/">

    <!-- Open Graph Metadata -->
    <meta property="og:type" content="profile">
    <meta property="og:site_name" content="Kodeloka">
    <meta property="og:locale" content="id_ID">
    <meta property="og:title" content="Nadia Pratama — Insinyur Backend & Infrastruktur">
    <meta property="og:description" content="Studi kasus arsitektur sistem terdistribusi, basis data PostgreSQL, dan pengembangan web modern.">
    <meta property="og:url" content="https://kodeloka.asadinedu.com/contoh-portofolio/">
    <meta property="og:image" content="https://kodeloka.asadinedu.com/assets/og-portofolio.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Ringkasan portofolio teknis Nadia Pratama">

    <!-- Favicon Standar -->
    <link rel="icon" href="/favicon.ico" sizes="32x32">
    <link rel="icon" href="/assets/brand/icon.svg" type="image/svg+xml">

    <!-- Structured Data JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "dateCreated": "2026-10-16T09:00:00+07:00",
      "mainEntity": {
        "@type": "Person",
        "name": "Nadia Pratama",
        "jobTitle": "Insinyur Backend & Infrastruktur",
        "knowsAbout": ["HTML5", "CSS", "JavaScript", "PHP", "Golang", "PostgreSQL", "Kubernetes"]
      }
    }
    </script>
  </head>
  <body>
    <!-- 1. Tautan Lompat ke Konten Utama untuk Pengguna Papan Ketik -->
    <a href="#konten-utama" class="skip-link">Lompat ke konten utama</a>

    <!-- 2. Landmark Header & Navigasi Utama -->
    <header>
      <div>
        <a href="/" aria-current="page"><strong>Nadia Pratama</strong></a>
        <span>Insinyur Backend &amp; Web</span>
      </div>

      <nav aria-label="Navigasi utama">
        <ul>
          <li><a href="#studi-kasus">Studi Kasus</a></li>
          <li><a href="#tolok-ukur">Tolok Ukur</a></li>
          <li><a href="#tanya-jawab">Tanya Jawab</a></li>
          <li><a href="#kontak">Hubungi Saya</a></li>
        </ul>
      </nav>

      <!-- Popover Bawaan untuk Ringkasan Kontak Cepat -->
      <button type="button" popovertarget="info-ketersediaan">
        Status Ketersediaan
      </button>
      <div id="info-ketersediaan" popover>
        <p><strong>Status Oktober 2026:</strong> Terbuka untuk konsultasi arsitektur web dan audit performa.</p>
        <button type="button" popovertarget="info-ketersediaan" popovertargetaction="hide">
          Tutup
        </button>
      </div>
    </header>

    <!-- 3. Landmark Main -->
    <main id="konten-utama">
      <!-- Bagian Pengantar (Hero) -->
      <section aria-labelledby="judul-hero">
        <h1 id="judul-hero">Merancang Sistem Web yang Cepat, Aksesibel, dan Tangguh</h1>
        <p>
          Halo! Saya merancang aplikasi web dari lapisan markup semantik di peramban
          hingga layanan backend dengan <strong>Go</strong>, <strong>PHP 8.5</strong>, dan <strong>PostgreSQL</strong>.
        </p>

        <figure>
          <picture>
            <source
              type="image/avif"
              srcset="/assets/arsitektur-sistem-800.avif 800w, /assets/arsitektur-sistem-1200.avif 1200w"
              sizes="(max-width: 768px) 100vw, 800px"
            >
            <img
              src="/assets/arsitektur-sistem-800.webp"
              width="800"
              height="420"
              fetchpriority="high"
              alt="Diagram arsitektur layanan web dari CDN dan Nginx menuju aplikasi PHP-FPM dan klaster PostgreSQL."
            >
          </picture>
          <figcaption>
            Arsitektur referensi yang saya gunakan untuk menangani 15.000 permintaan per detik.
          </figcaption>
        </figure>
      </section>

      <!-- Bagian Studi Kasus menggunakan <article> -->
      <section id="studi-kasus" aria-labelledby="judul-studi-kasus">
        <h2 id="judul-studi-kasus">Studi Kasus Pilihan</h2>

        <article aria-labelledby="proyek-1">
          <header>
            <h3 id="proyek-1">1. Migrasi Antarmuka Portal Edukasi ke HTML Semantik</h3>
            <p>
              Diterbitkan pada <time datetime="2026-08-12">12 Agustus 2026</time> ·
              Kategori: <b>Performa &amp; Aksesibilitas</b>
            </p>
          </header>
          <p>
            Menggantikan 42 KB pustaka modal dan akordeon pihak ketiga dengan elemen bawaan
            <code>&lt;dialog&gt;</code>, <code>&lt;details&gt;</code>, dan atribut <code>popover</code>.
          </p>
          <button type="button" id="buka-detail-proyek">
            Baca Catatan Teknis Migrasi
          </button>
        </article>
      </section>

      <!-- Dialog Modal untuk Catatan Teknis -->
      <dialog id="modal-catatan-teknis" aria-labelledby="judul-modal-teknis">
        <h2 id="judul-modal-teknis">Catatan Teknis: Menghapus Ketergantungan UI Berat</h2>
        <p>
          Dengan memindahkan logika dialog ke elemen <code>&lt;dialog&gt;</code> asli dan memanggil
          <code>showModal()</code>, waktu <em>Interaction to Next Paint (INP)</em> turun dari
          <samp>280 ms</samp> menjadi <samp>45 ms</samp>.
        </p>
        <pre><code>// Membuka dialog modal bawaan peramban
const dialog = document.getElementById("modal-catatan-teknis");
dialog.showModal();</code></pre>
        <form method="dialog">
          <button type="submit" autofocus>Tutup Catatan</button>
        </form>
      </dialog>

      <!-- Bagian Tabel Data Tolok Ukur -->
      <section id="tolok-ukur" aria-labelledby="judul-tolok-ukur">
        <h2 id="judul-tolok-ukur">Hasil Tolok Ukur Sebelum dan Sesudah Optimasi</h2>

        <div role="region" aria-labelledby="caption-tolok-ukur" tabindex="0">
          <table>
            <caption id="caption-tolok-ukur">
              Perbandingan Metrik Performa dan Aksesibilitas Portal ( Median Uji Lapangan 2026 )
            </caption>
            <thead>
              <tr>
                <th scope="col">Metrik Pengukuran</th>
                <th scope="col">Sebelum Refactoring</th>
                <th scope="col">Sesudah Refactoring</th>
                <th scope="col">Target Standar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Largest Contentful Paint (LCP)</th>
                <td>3,8 detik</td>
                <td>1,4 detik</td>
                <td>&le; 2,5 detik</td>
              </tr>
              <tr>
                <th scope="row">Interaction to Next Paint (INP)</th>
                <td>280 ms</td>
                <td>45 ms</td>
                <td>&le; 200 ms</td>
              </tr>
              <tr>
                <th scope="row">Cumulative Layout Shift (CLS)</th>
                <td>0,24</td>
                <td>0,01</td>
                <td>&le; 0,10</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colspan="2">Total Penghematan Bundel JavaScript</th>
                <td colspan="2">42 KB (terkompresi Brotli)</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <!-- Bagian Akordeon Eksklusif Tanya Jawab -->
      <section id="tanya-jawab" aria-labelledby="judul-faq">
        <h2 id="judul-faq">Pertanyaan Umum Seputar Kolaborasi</h2>

        <details name="faq-portofolio" open>
          <summary>Teknologi apa saja yang biasa Anda tangani?</summary>
          <p>
            Di sisi front-end saya mengutamakan HTML semantik, CSS modern (Grid, Container Queries),
            dan Vanilla JavaScript/TypeScript. Di sisi server saya menggunakan PHP 8.4/8.5, Go, dan PostgreSQL.
          </p>
        </details>

        <details name="faq-portofolio">
          <summary>Apakah Anda menerima audit aksesibilitas (WCAG 2.2)?</summary>
          <p>
            Ya. Saya melakukan pengujian menyeluruh menggunakan navigasi papan ketik, pembaca layar,
            serta perbaikan langsung pada kode sumber HTML dan CSS.
          </p>
        </details>
      </section>

      <!-- Bagian Formulir Kontak Tervalidasi -->
      <section id="kontak" aria-labelledby="judul-kontak">
        <h2 id="judul-kontak">Formulir Diskusi Proyek</h2>
        <p>Kolom yang ditandai wajib diisi sebelum pesan dikirimkan.</p>

        <form action="/kirim-pesan" method="post">
          <div>
            <label for="nama-pengirim">Nama Lengkap (Wajib)</label>
            <input
              type="text"
              id="nama-pengirim"
              name="nama"
              autocomplete="name"
              required
              minlength="2"
              maxlength="80"
            >
          </div>

          <div>
            <label for="surel-pengirim">Alamat Surel Kerja (Wajib)</label>
            <input
              type="email"
              id="surel-pengirim"
              name="surel"
              autocomplete="email"
              required
            >
          </div>

          <fieldset>
            <legend>Jenis Kebutuhan Proyek</legend>
            <div>
              <input type="radio" id="jenis-audit" name="jenis_proyek" value="audit" checked>
              <label for="jenis-audit">Audit Performa &amp; Aksesibilitas Web</label>
            </div>
            <div>
              <input type="radio" id="jenis-pengembangan" name="jenis_proyek" value="pengembangan">
              <label for="jenis-pengembangan">Pengembangan Aplikasi Web Baru</label>
            </div>
          </fieldset>

          <div>
            <label for="kode-proyek">Kode Referensi Proyek (Opsional, 4–10 huruf kapital/angka)</label>
            <input
              type="text"
              id="kode-proyek"
              name="kode_referensi"
              pattern="[A-Z0-9]{4,10}"
              title="Gunakan 4 hingga 10 karakter huruf kapital (A-Z) atau angka (0-9), misalnya KDLK2026."
              aria-describedby="bantuan-kode"
            >
            <small id="bantuan-kode">Contoh: <code>KDLK2026</code></small>
          </div>

          <div>
            <label for="rincian-pesan">Rincian Kebutuhan (Wajib, minimal 20 karakter)</label>
            <textarea
              id="rincian-pesan"
              name="pesan"
              rows="5"
              required
              minlength="20"
            ></textarea>
          </div>

          <button type="submit">Kirim Pesan Diskusi</button>
        </form>
      </section>
    </main>

    <!-- 4. Landmark Aside & Footer -->
    <aside aria-label="Tautan profil eksternal">
      <h2>Temukan Saya di Platform Lain</h2>
      <ul>
        <li>
          <a href="https://github.com/asaddin02/asadin-edu-kodeloka" target="_blank" rel="noopener noreferrer">
            Repositori GitHub Kodeloka
          </a>
        </li>
      </ul>
    </aside>

    <footer>
      <p><small>&copy; 2026 Nadia Pratama — Proyek latihan Kelas HTML Kodeloka.</small></p>
    </footer>

    <script>
      const tombolDetail = document.getElementById("buka-detail-proyek");
      const modalTeknis = document.getElementById("modal-catatan-teknis");

      tombolDetail.addEventListener("click", () => {
        modalTeknis.showModal();
      });
    </script>
  </body>
</html>
```

## Daftar Periksa Evaluasi Mandiri (*Self-Review Checklist*)

Sebelum melanjutkan ke **Kelas CSS**, periksa kode yang Anda tulis menggunakan daftar periksa kualitas berikut:
- [ ] **Validitas Struktur:** Apakah `<!DOCTYPE html>`, `<html lang="id">`, `<meta charset="utf-8">`, dan `<meta name="viewport">` sudah berada di tempat yang benar?
- [ ] **Hierarki Heading:** Apakah halaman memiliki tepat satu `<h1>`, diikuti `<h2>` dan `<h3>` secara berurutan tanpa melompati level?
- [ ] **Navigasi Papan Ketik:** Tekan tombol `Tab` dari awal hingga akhir halaman. Apakah tautan *Lompat ke konten utama*, tombol Popover, tombol pembuka `<dialog>`, akordeon `<details>`, dan seluruh kolom `<form>` dapat dioperasikan tanpa tetikus?
- [ ] **Keamanan & Performa Media:** Apakah gambar utama menggunakan `fetchpriority="high"` beserta atribut `width` dan `height` eksplisit?

## Kuis Pemahaman

### Soal 1
Dalam proyek halaman portofolio di atas, mengapa gambar diagram arsitektur di bagian atas (*hero section*) diberi atribut `fetchpriority="high"` dan **tidak** diberi `loading="lazy"`?
- A. Karena elemen `<picture>` tidak mengizinkan penggunaan atribut `loading="lazy"`.
- B. Karena gambar tersebut berada di layar pertama (*above the fold*) dan menjadi kandidat utama *Largest Contentful Paint (LCP)*, sehingga harus diunduh sedini mungkin tanpa penundaan.
- C. Karena format AVIF hanya dapat dimuat jika menggunakan `fetchpriority="high"`.
- D. Agar gambar tersebut tidak bisa disimpan oleh pengunjung.

**Jawaban Benar:** B
**Penjelasan:** Menambahkan `loading="lazy"` pada gambar di layar pertama akan menunda pemuatannya hingga tata letak selesai dihitung, yang justru memperburuk waktu LCP. Menggunakan pemuatan *eager* (bawaan) dengan `fetchpriority="high"` memastikan peramban segera mengunduh gambar utama tersebut.

### Soal 2
Pada bagian tabel tolok ukur di atas, mengapa elemen `<table>` dibungkus dengan `<div role="region" aria-labelledby="caption-tolok-ukur" tabindex="0">`?
- A. Agar tabel otomatis diurutkan berdasarkan abjad oleh peramban.
- B. Agar ketika tabel memiliki `overflow-x: auto` di layar sempit, pengguna papan ketik tetap dapat memfokuskan wadah tabel tersebut dengan tombol `Tab` dan menggulirnya ke kiri/kanan menggunakan tombol panah.
- C. Karena elemen `<table>` tidak boleh diletakkan langsung di dalam `<section>`.
- D. Untuk menyembunyikan tabel dari pembaca layar.

**Jawaban Benar:** B
**Penjelasan:** Wadah dengan `overflow-x: auto` yang tidak memiliki elemen interaktif di dalamnya sering kali tidak bisa digulir secara horizontal menggunakan papan ketik di beberapa peramban kecuali diberi `tabindex="0"`. Menambahkan `role="region"` dan `aria-labelledby` memastikan wilayah fokus tersebut memiliki nama yang jelas bagi pembaca layar.

### Soal 3
Mengapa tombol penutup di dalam `<dialog id="modal-catatan-teknis">` dibungkus dengan `<form method="dialog">`?
- A. Agar saat tombol ditekan, isi catatan otomatis dikirimkan ke server melalui permintaan HTTP POST.
- B. Agar dialog dapat ditutup secara deklaratif menggunakan mekanisme bawaan HTML ketika tombol submit di dalam formulir tersebut ditekan, bahkan jika skrip penutup tambahan tidak ditulis.
- C. Karena elemen `<button>` tidak valid jika diletakkan langsung di dalam `<dialog>`.
- D. Untuk menghapus elemen `<dialog>` dari pohon DOM setelah ditutup.

**Jawaban Benar:** B
**Penjelasan:** Formulir dengan `method="dialog"` di dalam elemen `<dialog>` adalah fitur standar HTML yang menutup kotak dialog dan menyimpan nilai `value` tombol yang ditekan ke dalam properti `dialog.returnValue` tanpa memuat ulang halaman atau mengirim permintaan jaringan.

## Sumber
- [HTML: HyperText Markup Language — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [HTML Living Standard — WHATWG](https://html.spec.whatwg.org/multipage/)
- [Learn HTML — web.dev](https://web.dev/learn/html)
- [Learn Accessibility — web.dev](https://web.dev/learn/accessibility)
