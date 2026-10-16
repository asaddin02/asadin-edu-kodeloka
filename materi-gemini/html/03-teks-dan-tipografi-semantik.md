# Teks dan Tipografi Semantik: Memberi Makna pada Konten

- **Tingkat:** Dasar
- **Ringkasan:** Menggunakan elemen teks HTML berdasarkan makna semantiknya—mulai dari hierarki subjudul, paragraf, daftar, kutipan, hingga penanda kode dan waktu—bukan sekadar demi tampilan tebal atau miring.

## Mengapa Semantik Teks Penting?

Di masa lalu, banyak orang memilih tag HTML berdasarkan tampilannya di layar: memakai `<h3>` hanya karena ingin huruf yang tidak terlalu besar, atau memakai `<b>` dan `<i>` semata-mata agar teks terlihat tebal dan miring. Pendekatan ini keliru karena **tampilan adalah tugas CSS, sedangkan tugas HTML adalah menjelaskan arti (semantik) dari konten tersebut**.

Ketika Anda memilih elemen semantik yang tepat:
1. **Aksesibilitas (*Screen Reader*):** Pengguna tunanetra dapat melompat antar-bab menggunakan daftar *heading* (`h1` sampai `h6`), serta, pada pembaca layar yang dikonfigurasi untuk mengumumkannya, mengetahui kata yang ditekankan (`<em>`) atau peringatan penting (`<strong>`).
2. **Mesin Pencari & Pembaca Artikel (*Reader Mode*):** Mesin pencari dan mode baca di peramban memahami mana judul utama, mana subjudul, mana kutipan, dan mana rincian istilah.
3. **Kemudahan Pemeliharaan Kode:** Anda dapat mengubah ukuran huruf `<h2>` di seluruh situs cukup lewat satu baris CSS tanpa merusak struktur dokumen.

## 1. Hierarki Heading (`<h1>` hingga `<h6>`)

HTML menyediakan enam tingkat judul bagian, dari `<h1>` (paling utama) hingga `<h6>` (subbagian paling rinci). Bayangkan *heading* sebagai daftar isi sebuah buku teknis:

```html
<h1>Panduan Lengkap Penyimpanan Data di Linux</h1>

  <h2>1. Mengenal Sistem Berkas (Filesystem)</h2>
  <p>Sistem berkas mengatur bagaimana data disimpan dan diambil pada diska...</p>

    <h3>1.1 Struktur Direktori Standar (FHS)</h3>
    <p>Di Linux, seluruh berkas berawal dari direktori akar (<code>/</code>)...</p>

    <h3>1.2 Perbedaan ext4 dan XFS</h3>
    <p>Kedua sistem berkas jurnal ini memiliki keunggulan tersendiri...</p>

  <h2>2. Mengelola Partisi dan Mount Point</h2>
  <p>Sebelum partisi dapat dipakai, kita perlu mengaitkannya ke direktori...</p>
```

> **⚠️ Kesalahan Umum: Melompati Tingkat Heading demi Ukuran Font**
> Jangan melompat dari `<h1>` langsung ke `<h4>` hanya karena menurut Anda ukuran bawaan `<h2>` terlalu besar! Jika `<h2>` terlihat terlalu besar, tetap gunakan `<h2>` di HTML untuk menjaga urutan hierarki dokumen, lalu atur ukurannya di CSS dengan `h2 { font-size: 1.25rem; }`.

## 2. Paragraf dan Daftar (*Lists*)

Gunakan `<p>` untuk setiap paragraf teks. Untuk mengelompokkan butir-butir informasi, pilih dari tiga jenis daftar semantik berikut:

1. **`<ul>` (*Unordered List*):** Daftar yang urutan butirnya tidak mengubah makna (misalnya daftar fitur produk atau bahan masakan).
2. **`<ol>` (*Ordered List*):** Daftar berurutan yang langkah-langkah atau peringkatnya tidak boleh tertukar (misalnya prosedur instalasi server atau peringkat pemenang). Mendukung atribut `start`, `reversed`, dan `type`.
3. **`<dl>` (*Description List*):** Daftar pasangan istilah (`<dt>` — *description term*) dan penjelasannya (`<dd>` — *description details*). Sangat cocok untuk glosarium, kamus istilah, atau metadata spesifikasi produk.

```html
<h2>Glosarium Jaringan</h2>
<dl>
  <dt>Latensi (Latency)</dt>
  <dd>Waktu tempuh yang dibutuhkan paket data untuk bergerak dari pengirim ke penerima, biasanya diukur dalam milidetik (ms).</dd>

  <dt>Throughput</dt>
  <dd>Volume data aktual yang berhasil dikirimkan melalui jaringan dalam satu satuan waktu (misalnya Mbps).</dd>
</dl>
```

## 3. Penekanan dan Teks Inline Semantik

Banyak pengembang bingung membedakan `<strong>` vs `<b>`, serta `<em>` vs `<i>`. Berikut perbedaan semantiknya menurut [spesifikasi WHATWG](https://html.spec.whatwg.org/multipage/text-level-semantics.html):

| Elemen | Makna Semantik | Contoh Penggunaan yang Tepat |
|---|---|---|
| `<strong>` | Kepentingan tinggi, keseriusan, atau urgensi | `<strong>Peringatan:</strong> Jangan bagikan kunci API rahasia Anda di repositori publik.` |
| `<b>` | Menarik perhatian visual tanpa menambah bobot urgensi | Kata kunci pembuka dalam ringkasan produk atau nama benda dalam ulasan. |
| `<em>` | Penekanan intonasi kalimat (*stress emphasis*) yang mengubah nuansa makna | `Anda <em>harus</em> memvalidasi data di sisi server, bukan hanya di peramban.` |
| `<i>` | Suara/suasana alternatif, istilah asing, nama ilmiah/taksonomi, atau pikiran tokoh | `Istilah <i>idempotent</i> atau spesies <i>Panthera tigris sondaica</i>.` |
| `<mark>` | Sorotan relevansi konteks (seperti stabilo pada hasil pencarian) | Menyoroti kata yang cocok dengan kueri pencarian pengguna. |
| `<small>` | Keterangan tambahan (*fine print*), hak cipta, atau klausul hukum | `<small>Harga belum termasuk PPN dan biaya layanan.</small>` |
| `<sub>` & `<sup>` | Subskrip dan superskrip yang memiliki arti matematis/kimiawi | Rumus kimia `H<sub>2</sub>O` atau perpangkatan `2<sup>10</sup> = 1024`. |

## 4. Kutipan, Kode Program, dan Waktu Terstruktur

### Kutipan (`<blockquote>`, `<q>`, dan `<cite>`)
- Gunakan `<blockquote>` untuk kutipan panjang yang berdiri sebagai blok tersendiri, dan `<q>` untuk kutipan pendek di tengah kalimat.
- Gunakan `<cite>` untuk menandai **judul karya** (judul buku, spesifikasi standar, artikel, atau film) yang dirujuk:

```html
<figure>
  <blockquote cite="https://www.w3.org/DesignIssues/Principles.html">
    <p>
      Semakin kurang berdaya sebuah bahasa, semakin banyak hal yang dapat dilakukan
      dengan data yang tersimpan dalam bahasa itu.
    </p>
  </blockquote>
  <figcaption>
    — Tim Berners-Lee dalam <cite>Design Issues: Principles of Design</cite> (bagian <i lang="en">Principle of Least Power</i>)
  </figcaption>
</figure>
```

### Elemen Teknis (`<code>`, `<pre>`, `<kbd>`, `<samp>`, `<var>`)
Untuk situs edukasi pemrograman seperti Kodeloka, kelima elemen ini sangat krusial:
- `<code>`: Cuplikan kode komputer inline.
- `<pre>`: Teks pra-format (*preformatted*) yang mempertahankan spasi dan baris baru apa adanya. Gabungkan `<pre><code>...</code></pre>` untuk blok kode multi-baris.
- `<kbd>`: Masukan dari pengguna (biasanya tombol papan ketik seperti `<kbd>Ctrl</kbd> + <kbd>C</kbd>`).
- `<samp>`: Keluaran contoh (*sample output*) dari program atau terminal komputer.
- `<var>`: Nama variabel matematika atau parameter dalam penjelasan.

```html
<p>
  Tekan <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd> untuk membuka konsol,
  lalu jalankan fungsi dengan parameter <var>batasWaktu</var>:
</p>

<pre><code>const hasil = await ambilData("/api/kelas", { timeout: 5000 });
console.log(hasil.status);</code></pre>

<p>Jika berhasil, terminal akan mencetak keluaran <samp>200 OK - Data dimuat</samp>.</p>
```

### Waktu yang Dapat Dibaca Mesin (`<time>`)
Manusia senang membaca `"16 Oktober 2026 pukul 14.30 WIB"`, tetapi program komputer, kalender, dan mesin pencari membutuhkan format standar ISO 8601. Elemen `<time>` menjembatani keduanya lewat atribut `datetime`:

```html
<p>
  Jadwal pemeliharaan server berikutnya adalah pada
  <time datetime="2026-10-16T14:30:00+07:00">16 Oktober 2026 pukul 14.30 WIB</time>.
</p>
```

## Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan `<br><br>` berulang kali untuk membuat jarak antar-paragraf:**
   - **Salah:** Menulis satu `<p>` raksasa lalu memisahkan paragraf dengan `<br><br>`. Elemen `<br>` hanya boleh dipakai untuk jeda baris yang memang menjadi bagian dari konten itu sendiri, seperti baris puisi atau penulisan alamat surat.
   - **Benar:** Bungkus setiap paragraf dalam tag `<p>...</p>` masing-masing, lalu atur jarak vertikalnya dengan properti CSS `margin-block-end`.
2. **Menaruh seluruh blok kode tanpa `<pre>`:**
   - **Salah:** Menaruh kode 10 baris hanya di dalam `<code>` tanpa `<pre>`. HTML secara bawaan menggabungkan spasi ganda dan baris baru menjadi satu spasi tunggal (*whitespace collapsing*), sehingga seluruh kode Anda akan menyatu dalam satu baris!
   - **Benar:** Bungkus `<code>` di dalam `<pre>` (`<pre><code>...</code></pre>`).

## Latihan Praktik: Menata Artikel Teknis Semantik

Buatlah berkas `artikel-semantik.html` yang mendokumentasikan perintah dasar terminal Linux:
1. Buat struktur judul `<h1>` dan minimal dua subjudul `<h2>` serta satu `<h3>` yang berurutan tanpa melompati level.
2. Buat daftar istilah (`<dl>`, `<dt>`, `<dd>`) untuk menjelaskan minimal tiga direktori Linux (`/etc`, `/var`, `/home`).
3. Tampilkan satu blok kode perintah bash menggunakan `<pre><code>`, pintasan papan ketik `<kbd>Ctrl</kbd> + <kbd>D</kbd>`, peringatan penting dengan `<strong>`, dan tanggal terbit artikel menggunakan `<time datetime="...">`.

## Kuis Pemahaman

### Soal 1
Kapan Anda sebaiknya memilih elemen `<dl>` (*Description List*) dibandingkan `<ul>` atau `<ol>`?
- A. Ketika Anda ingin menampilkan daftar langkah instalasi yang harus dikerjakan secara berurutan dari langkah 1 sampai 5.
- B. Ketika Anda menyusun daftar pasangan istilah/nama (`<dt>`) beserta penjelasan atau nilainya (`<dd>`), seperti glosarium atau daftar spesifikasi teknis.
- C. Ketika Anda ingin membuat menu navigasi horizontal di bagian atas halaman.
- D. Ketika Anda membutuhkan tabel dengan perhitungan angka di baris paling bawah.

**Jawaban Benar:** B
**Penjelasan:** Elemen `<dl>` dirancang secara semantik untuk memuat kelompok istilah (`<dt>`) dan deskripsinya (`<dd>`). Satu istilah `<dt>` bahkan dapat diikuti oleh beberapa `<dd>`, atau sebaliknya, sehingga sangat tepat untuk glosarium dan metadata pasangan kunci-nilai.

### Soal 2
Apa perbedaan semantik antara `<strong>` dan `<b>` dalam HTML modern?
- A. Tidak ada perbedaan sama sekali; `<b>` sudah dihapus dari spesifikasi HTML5.
- B. `<strong>` menandakan bahwa teks tersebut memiliki tingkat kepentingan, keseriusan, atau urgensi yang tinggi, sedangkan `<b>` hanya menarik perhatian secara visual tanpa menyiratkan bobot kepentingan ekstra.
- C. `<strong>` membuat huruf lebih besar 20%, sedangkan `<b>` hanya menebalkan huruf.
- D. `<b>` hanya boleh digunakan di dalam tabel, sedangkan `<strong>` hanya boleh digunakan di dalam paragraf.

**Jawaban Benar:** B
**Penjelasan:** Menurut spesifikasi WHATWG HTML, `<strong>` membawa makna semantik berupa tingkat kepentingan atau urgensi tinggi (misalnya kata `"Peringatan:"`), sementara `<b>` digunakan untuk membedakan kata secara stilistik (seperti kata kunci produk) tanpa menyatakan bahwa bagian itu lebih penting daripada kalimat di sekitarnya.

### Soal 3
Anda ingin menampilkan teks `"20 Agustus 2026"` kepada pembaca sekaligus memberikan representasi tanggal yang presisi bagi mesin pencari dan aplikasi kalender. Penulisan manakah yang paling tepat?
- A. `<date value="20-08-2026">20 Agustus 2026</date>`
- B. `<span data-tanggal="2026-08-20">20 Agustus 2026</span>`
- C. `<time datetime="2026-08-20">20 Agustus 2026</time>`
- D. `<meta name="date" content="2026-08-20">20 Agustus 2026`

**Jawaban Benar:** C
**Penjelasan:** Elemen `<time>` dengan atribut `datetime` berformat standar ISO 8601 (`YYYY-MM-DD`) adalah cara semantik standar di HTML untuk menyajikan waktu yang ramah manusia di dalam konten tag sekaligus ramah mesin di dalam nilai atributnya.

## Sumber
- [Text-level semantics — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/text-level-semantics.html)
- [Structuring content with HTML — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content)
- [HTML elements reference — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
