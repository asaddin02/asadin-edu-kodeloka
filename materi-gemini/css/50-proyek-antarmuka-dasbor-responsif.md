# Proyek Akhir Kelas CSS: Antarmuka Dasbor Pemantauan Infrastruktur Responsif

- **Tingkat:** Lanjut
- **Ringkasan:** Membangun sistem desain dan halaman dasbor metrik server secara utuh dengan memadukan `@layer`, token warna `oklch()` & `light-dark()`, CSS Grid & `subgrid`, Flexbox, `@container` queries, tipografi `clamp()` & `tabular-nums`, serta transisi ramah GPU.

## Gambaran Proyek

Di proyek akhir kelas CSS ini, Anda akan merancang dan membangun **Antarmuka Dasbor Pemantauan Server Kodeloka Cloud** yang siap produksi. Proyek ini membuktikan bagaimana fitur-fitur CSS modern bekerja secara harmonis tanpa membutuhkan kerangka kerja CSS pihak ketiga:

1. **Arsitektur Berlapis (`@layer`):** Dipisahkan dengan rapi ke dalam `@layer reset, token, dasar, tata-letak, komponen, utilitas;`.
2. **Sistem Tema Terang & Gelap Otomatis:** Menggunakan `color-scheme: light dark`, `light-dark()`, dan ruang warna persepsi `oklch()` beserta `color-mix()`.
3. **Tata Letak Responsif Dua Tingkat:**
   - **Tingkat Halaman (`@media` + CSS Grid):** Bilah navigasi samping (*sidebar*) otomatis berpindah dari tumpukan atas di layar ponsel menjadi kolom kiri tetap yang `sticky` di layar lebar (`width >= 56rem`).
   - **Tingkat Komponen (`@container` + `subgrid`):** Kartu metrik server secara mandiri menyesuaikan tata letaknya berdasarkan lebar wadah tempat ia berada.
4. **Keterbacaan & Aksesibilitas Tinggi:** Angka metrik memakai `font-variant-numeric: tabular-nums`, cincin fokus `:focus-visible` terlihat tegas, dan animasi mematuhi `prefers-reduced-motion`.

## Kode Lengkap Proyek

### 1. Berkas Stylesheet (`dasbor.css`)

```css
@layer reset, token, dasar, tata-letak, komponen, utilitas;

@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body, h1, h2, h3, p, ul, figure {
    margin: 0;
  }
  ul {
    padding: 0;
    list-style: none;
  }
  button, select, input {
    font: inherit;
    color: inherit;
  }
}

@layer token {
  :root {
    color-scheme: light dark;

    /* Palet Warna Semantik berbasis oklch() dan light-dark() */
    --latar-utama:     light-dark(oklch(97.5% 0.005 250), oklch(15% 0.015 250));
    --latar-panel:     light-dark(oklch(100% 0 0),        oklch(20% 0.02 250));
    --latar-sorot:     light-dark(oklch(94% 0.015 250),   oklch(26% 0.025 250));
    --teks-utama:      light-dark(oklch(20% 0.02 250),    oklch(95% 0.01 250));
    --teks-sekunder:   light-dark(oklch(48% 0.02 250),    oklch(72% 0.015 250));
    --garis-batas:     light-dark(oklch(89% 0.01 250),    oklch(30% 0.02 250));

    --aksen-biru:      oklch(58% 0.20 255);
    --status-sehat:    oklch(62% 0.17 150);
    --status-waspada:  oklch(72% 0.17 75);
    --status-kritis:   oklch(60% 0.21 25);

    /* Skala Spasi & Sudut */
    --spasi-xs: 0.375rem;
    --spasi-sm: 0.75rem;
    --spasi-md: 1.25rem;
    --spasi-lg: 2rem;
    --radius-md: 0.625rem;
    --radius-lg: 0.875rem;
  }

  html[data-tema="terang"] { color-scheme: light; }
  html[data-tema="gelap"]  { color-scheme: dark; }
}

@layer dasar {
  body {
    min-block-size: 100dvh;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    line-height: 1.5;
    background-color: var(--latar-utama);
    color: var(--teks-utama);
  }

  h1, h2, h3 {
    text-wrap: balance;
    line-height: 1.2;
  }

  :focus-visible {
    outline: 3px solid var(--aksen-biru);
    outline-offset: 2px;
  }
}

@layer tata-letak {
  .kerangka-dasbor {
    display: grid;
    grid-template-columns: 1fr;
    min-block-size: 100dvh;

    @media (width >= 56rem) {
      grid-template-columns: 250px minmax(0, 1fr);
    }
  }

  .bilah-samping {
    background-color: var(--latar-panel);
    border-block-end: 1px solid var(--garis-batas);
    padding: var(--spasi-md);

    @media (width >= 56rem) {
      position: sticky;
      inset-block-start: 0;
      block-size: 100dvh;
      border-block-end: 0;
      border-inline-end: 1px solid var(--garis-batas);
      display: flex;
      flex-direction: column;
    }
  }

  .area-utama {
    padding: clamp(1rem, 2.5vw, 2.25rem);
    display: flex;
    flex-direction: column;
    gap: var(--spasi-lg);
  }

  .kepala-dasbor {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: var(--spasi-md);
  }

  /* Grid Kartu Metrik dengan Subgrid dan Container Query */
  .kisi-metrik {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
    gap: var(--spasi-md);
  }

  .wadah-panel-bawah {
    container-type: inline-size;
    container-name: panel-insiden;
  }
}

@layer komponen {
  .menu-navigasi {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spasi-xs);
    margin-block-start: var(--spasi-md);

    @media (width >= 56rem) {
      flex-direction: column;
    }

    & a {
      display: flex;
      align-items: center;
      gap: var(--spasi-sm);
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-md);
      text-decoration: none;
      color: var(--teks-sekunder);
      font-weight: 500;
      transition: background-color 150ms ease, color 150ms ease;

      &:hover,
      &[aria-current="page"] {
        background-color: var(--latar-sorot);
        color: var(--teks-utama);
      }
    }
  }

  /* Kartu Metrik menggunakan Subgrid agar baris judul, angka, dan footer sejajar */
  .kartu-metrik {
    --warna-indikator: var(--status-sehat);
    display: grid;
    grid-row: span 3;
    grid-template-rows: subgrid;
    gap: var(--spasi-sm);
    padding: var(--spasi-md);
    background-color: var(--latar-panel);
    border: 1px solid var(--garis-batas);
    border-inline-start: 4px solid var(--warna-indikator);
    border-radius: var(--radius-lg);
    translate: 0 0;
    transition: translate 180ms ease-out, border-color 180ms ease;

    &:hover {
      translate: 0 -3px;
    }

    &.kartu-metrik--waspada { --warna-indikator: var(--status-waspada); }
    &.kartu-metrik--kritis  { --warna-indikator: var(--status-kritis); }
  }

  .kartu-metrik__nilai {
    font-size: clamp(1.75rem, 1.4rem + 1vw, 2.25rem);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }

  .lencana-status {
    display: inline-flex;
    align-items: center;
    padding: 0.2em 0.65em;
    border-radius: 999px;
    font-size: 0.8125rem;
    font-weight: 600;
    background-color: color-mix(in oklch, var(--warna-indikator) 15%, transparent);
    /* Teks dicampur dengan warna teks utama agar kontras terhadap latar lencana minimal 4,5:1 di mode terang maupun gelap */
    color: color-mix(in oklch, var(--warna-indikator) 50%, var(--teks-utama));
  }

  /* Komponen Kartu Insiden yang Merespons Container Query */
  .kartu-insiden {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spasi-md);
    padding: var(--spasi-md);
    background-color: var(--latar-panel);
    border: 1px solid var(--garis-batas);
    border-radius: var(--radius-lg);

    @container panel-insiden (width >= 640px) {
      grid-template-columns: 1fr auto;
      align-items: center;
    }
  }

  .tombol {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--garis-batas);
    background-color: var(--latar-panel);
    cursor: pointer;
    font-weight: 600;
    transition: background-color 150ms ease;

    &:hover {
      background-color: var(--latar-sorot);
    }
  }
}

@layer utilitas {
  .angka-tabular { font-variant-numeric: tabular-nums; }
  .teks-redup    { color: var(--teks-sekunder); font-size: 0.875rem; }
  .sembunyi-visual {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 2. Berkas Markup HTML (`index.html`)

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dasbor Infrastruktur — Kodeloka Cloud</title>
    <link rel="stylesheet" href="dasbor.css">
  </head>
  <body>
    <div class="kerangka-dasbor">
      <aside class="bilah-samping" aria-label="Menu dasbor">
        <strong>Kodeloka Cloud</strong>
        <nav aria-label="Navigasi utama">
          <ul class="menu-navigasi">
            <li><a href="#ringkasan" aria-current="page">Ringkasan Klaster</a></li>
            <li><a href="#basis-data">Node PostgreSQL</a></li>
            <li><a href="#antrean">Antrean Kafka</a></li>
          </ul>
        </nav>
      </aside>

      <main class="area-utama" id="ringkasan">
        <header class="kepala-dasbor">
          <div>
            <h1>Kesehatan Klaster Produksi (ID-JKT-01)</h1>
            <p class="teks-redup">
              Pembaruan terakhir: <time datetime="2026-10-16T14:30:00+07:00" class="angka-tabular">14:30:00 WIB</time>
            </p>
          </div>
          <button type="button" class="tombol" id="saklar-tema">
            Ganti Tema Terang / Gelap
          </button>
        </header>

        <section aria-labelledby="judul-metrik" class="kisi-metrik">
          <h2 id="judul-metrik" class="sembunyi-visual">Metrik Utama</h2>

          <article class="kartu-metrik">
            <h3>Latensi API Gateway (P95)</h3>
            <p class="kartu-metrik__nilai">18,4 ms</p>
            <div>
              <span class="lencana-status">Sehat (&lt; 50 ms)</span>
            </div>
          </article>

          <article class="kartu-metrik kartu-metrik--waspada">
            <h3>Penggunaan Koneksi PostgreSQL Utama</h3>
            <p class="kartu-metrik__nilai">78 / 100</p>
            <div>
              <span class="lencana-status">Waspada (78% terpakai)</span>
            </div>
          </article>

          <article class="kartu-metrik kartu-metrik--kritis">
            <h3>Antrean Pesan Worker Pembayaran (Consumer Lag)</h3>
            <p class="kartu-metrik__nilai">1.420</p>
            <div>
              <span class="lencana-status">Tinggi (Perlu penskalaan)</span>
            </div>
          </article>
        </section>

        <section aria-labelledby="judul-insiden" class="wadah-panel-bawah">
          <div class="kartu-insiden">
            <div>
              <h2 id="judul-insiden">Rekomendasi Penskalaan Otomatis</h2>
              <p class="teks-redup">
                Worker pembayaran mengalami lonjakan trafik. Tambahkan 2 replika Pod untuk mengembalikan lag di bawah 100 pesan.
              </p>
            </div>
            <button type="button" class="tombol">Tambah 2 Replika</button>
          </div>
        </section>
      </main>
    </div>

    <script>
      const tombolTema = document.getElementById("saklar-tema");
      tombolTema.addEventListener("click", () => {
        const akar = document.documentElement;
        const gelapSistem = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const saatIni = akar.getAttribute("data-tema") ?? (gelapSistem ? "gelap" : "terang");
        akar.setAttribute("data-tema", saatIni === "gelap" ? "terang" : "gelap");
      });
    </script>
  </body>
</html>
```

## Kuis Pemahaman

### Soal 1
Dalam kode proyek dasbor di atas, bagaimana `.kartu-metrik--waspada` dan `.kartu-metrik--kritis` mengubah warna garis batas samping kiri (`border-inline-start`) sekaligus warna latar dan teks pada `.lencana-status` di dalamnya?
- A. Dengan menulis ulang 10 baris properti `border`, `background-color`, dan `color` untuk setiap kelas modifier.
- B. Dengan cukup mengubah nilai satu variabel CSS lokal (`--warna-indikator`), yang kemudian dipakai bersama oleh `border-inline-start` pada kartu serta fungsi `color-mix()` pada `.lencana-status` di dalamnya.
- C. Dengan memanggil fungsi JavaScript setiap kali kursor diarahkan ke kartu.
- D. Dengan menduplikasi elemen HTML untuk setiap warna.

**Jawaban Benar:** B
**Penjelasan:** Karena variabel CSS (`--warna-indikator`) diwariskan dari elemen `.kartu-metrik` ke seluruh anak di dalamnya (termasuk `.lencana-status`), modifier `.kartu-metrik--waspada` cukup mengubah nilai `--warna-indikator` saja, dan baik bingkai kartu maupun warna lencana di dalamnya otomatis ikut berubah!

### Soal 2
Mengapa properti `grid-template-columns` pada `.kerangka-dasbor` menggunakan `250px minmax(0, 1fr)` alih-alih `250px 1fr`?
- A. Karena `1fr` tidak valid jika disandingkan dengan satuan `px`.
- B. Untuk mencegah kolom utama (`1fr`) membengkak melampaui lebar layar apabila di dalamnya terdapat elemen yang lebar intrinsiknya besar, karena `minmax(0, 1fr)` mengizinkan kolom menyusut di bawah ukuran konten minimumnya.
- C. Agar lebar bilah samping menjadi 0px di layar desktop.
- D. Untuk mematikan jarak `gap` pada grid.

**Jawaban Benar:** B
**Penjelasan:** `1fr` secara bawaan setara dengan `minmax(auto, 1fr)`. Menuliskannya secara eksplisit sebagai `minmax(0, 1fr)` memastikan kolom utama tetap patuh pada ruang layar yang tersedia dan tidak terdorong melebar oleh anak yang panjang.

### Soal 3
Apa peran `font-variant-numeric: tabular-nums;` yang diterapkan pada `.kartu-metrik__nilai` dan elemen `<time>` di dasbor tersebut?
- A. Mengubah angka Arab menjadi angka Romawi secara otomatis.
- B. Memastikan setiap karakter digit angka (`0` sampai `9`) menempati lebar horizontal yang sama persis layaknya fon *monospace*, sehingga saat angka metrik atau detik waktu berubah, posisi teks tidak bergeser-geser.
- C. Membulatkan angka desimal menjadi bilangan bulat.
- D. Memperbesar ukuran angka dua kali lipat dari huruf biasa.

**Jawaban Benar:** B
**Penjelasan:** Pada fon proporsional biasa, angka `1` jauh lebih sempit daripada angka `8`. Dengan `font-variant-numeric: tabular-nums`, seluruh digit angka diberi kotak lebar yang seragam sehingga deretan angka di tabel maupun dasbor waktu nyata terlihat stabil dan sejajar.

## Sumber
- [CSS grid layout — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout)
- [CSS container queries — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
- [CSS custom properties for cascading variables — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables)
- [`oklch()` CSS function — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch)
