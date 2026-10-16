/* ==========================================================================
   CSS — Platform Pembelajaran Interaktif
   Materi: riset Gemini (materi-gemini/css/), dikoreksi dan disusun oleh Claude Code.
   Dihasilkan oleh scripts/import-materi-gemini.mjs; ubah Markdown-nya, bukan berkas ini.
   ========================================================================== */

const TOPIK_SLUG = "css";
const TOPIK_SUB  = "tampilan dan tata letak";

const MODUL = [
{
    id: 1,
    kategori: "1 · Fondasi",
    judul: "Cara CSS Bekerja dan Selektor Modern",
    tingkat: "Dasar", durasi: "11 mnt",
    tag: [":is()",":where()","::before"],
    ringkas: "Memahami anatomi aturan CSS, bagaimana peramban mencocokkan selektor dari kanan ke kiri, serta menguasai selektor dasar, atribut, kombinator, pseudo-element, hingga pseudo-class modern (:is(), :where(), dan :has()).",
    isi: `
<h2>Bagaimana Peramban Membaca dan Menerapkan CSS?</h2>
<p>Setelah peramban mengurai dokumen HTML menjadi pohon **DOM (<em>Document Object Model</em>)<strong>, peramban membaca seluruh berkas CSS (<code>.css</code>) dan elemen <code>&lt;style&gt;</code> untuk membangun </strong>CSSOM (<em>CSS Object Model</em>)**.</p>
<p>Setiap aturan CSS (<em>style rule</em>) terdiri dari dua bagian utama: **Selektor (<em>Selector</em>)<strong> dan </strong>Blok Deklarasi (<em>Declaration Block</em>)**:</p>
<pre>.kartu-kelas &gt; h2 {
  color: #0f172a;
  font-size: 1.25rem;
}
└───────┬───────┘   └──────────┬──────────┘
     Selektor        Deklarasi (Properti: Nilai)</pre>
<div class="callout info"><div class="callout-judul">💡 Fakta Menarik Mesin Peramban: Pencocokan Selektor dari Kanan ke Kiri!</div><p>Banyak pengembang mengira peramban membaca <code>.kartu-kelas &gt; h2</code> dari kiri ke kanan (mencari <code>.kartu-kelas</code> dulu, baru mencari <code>h2</code>). Sebenarnya, mesin CSS peramban mengevaluasi selektor <strong>dari kanan ke kiri</strong>: peramban mengumpulkan semua elemen <code>&lt;h2&gt;</code> terlebih dahulu, lalu memeriksa apakah elemen induk langsungnya memiliki kelas <code>.kartu-kelas</code>. Itulah sebabnya menulis selektor yang terlalu panjang dan berakhir dengan selektor universal seperti <code>.kontainer div ul li *</code> memboroskan kerja mesin peramban.</p></div>
<h3>Tiga Cara Menghubungkan CSS ke HTML</h3>
<ol><li><strong>External Stylesheet (<code>&lt;link rel=&quot;stylesheet&quot; href=&quot;style.css&quot;&gt;</code>):</strong> Cara terbaik dan paling direkomendasikan untuk produksi karena berkas CSS dapat disimpan di <em>cache</em> peramban lintas halaman.</li><li><strong>Internal Stylesheet (<code>&lt;style&gt;...&lt;/style&gt;</code> di dalam <code>&lt;head&gt;</code>):</strong> Berguna untuk halaman mandiri (<em>single-file</em>) atau pengujian singkat.</li><li><strong>Inline Styles (<code>style=&quot;color: red&quot;</code> pada elemen HTML):</strong> Hindari untuk penataan gaya umum karena tidak dapat disimpan terpisah di <em>cache</em>, tidak mendukung pseudo-class (<code>:hover</code>) maupun <code>@media</code>, dan memiliki spesifisitas sangat tinggi yang sulit ditimpa. (Pengecualian yang wajar: menyuplai nilai variabel CSS dinamis dari JavaScript, seperti <code>style=&quot;--progres: 75%&quot;</code>).</li></ol>
<h2>1. Selektor Dasar dan Selektor Atribut</h2>
<table><thead><tr><th>Jenis Selektor</th><th>Contoh Sintaks</th><th>Elemen yang Dicocokkan</th></tr></thead><tbody><tr><td>Selektor Tipe (<em>Type</em>)</td><td><code>article</code>, <code>p</code>, <code>button</code></td><td>Semua elemen dengan nama tag tersebut.</td></tr><tr><td>Selektor Kelas (<em>Class</em>)</td><td><code>.tombol-utama</code></td><td>Semua elemen yang atribut <code>class</code>-nya memuat kata <code>tombol-utama</code>.</td></tr><tr><td>Selektor ID</td><td><code>#navigasi-atas</code></td><td>Satu elemen yang memiliki <code>id=&quot;navigasi-atas&quot;</code>.</td></tr><tr><td>Selektor Universal</td><td><code>*</code></td><td>Semua elemen (sering dipakai di aturan <em>reset</em> <code>*, *::before, *::after</code>).</td></tr><tr><td>Atribut Eksistensi / Nilai</td><td><code>[disabled]</code>, <code>[type=&quot;email&quot;]</code></td><td>Elemen yang memiliki atribut tersebut / dengan nilai persis.</td></tr><tr><td>Atribut Awalan (<code>^=</code>)</td><td><code>a[href^=&quot;https://&quot;]</code></td><td>Tautan yang atribut <code>href</code>-nya <strong>diawali</strong> dengan <code>https://</code>.</td></tr><tr><td>Atribut Akhiran (<code>$=</code>)</td><td><code>a[href$=&quot;.pdf&quot;]</code></td><td>Tautan yang atribut <code>href</code>-nya <strong>diakhiri</strong> dengan <code>.pdf</code>.</td></tr><tr><td>Atribut Substring (<code>*=</code>)</td><td><code>a[href*=&quot;kodeloka&quot;]</code></td><td>Tautan yang atribut <code>href</code>-nya <strong>mengandung</strong> kata <code>kodeloka</code> di mana saja.</td></tr></tbody></table>
<pre>/* Menambahkan penanda visual otomatis pada semua tautan unduhan PDF */
a[href$=&quot;.pdf&quot;]::after {
  content: &quot; (PDF)&quot;;
  font-size: 0.85em;
  color: #64748b;
}

/* Pencocokan atribut tanpa memedulikan huruf besar/kecil dengan flag 'i' */
a[href$=&quot;.pdf&quot; i] {
  font-weight: 600;
}</pre>
<h2>2. Kombinator (<em>Combinators</em>): Mengatur Hubungan Antar-Elemen</h2>
<p>Kombinator menghubungkan dua selektor berdasarkan posisi mereka di pohon DOM:</p>
<ol><li><strong>Descendant Combinator (Spasi <code> </code>):</strong> <code>article p</code> memilih semua <code>&lt;p&gt;</code> yang berada di dalam <code>&lt;article&gt;</code>, baik anak langsung maupun cucu di tingkat sedalam apa pun.</li><li><strong>Child Combinator (<code>&gt;</code>):</strong> <code>ul &gt; li</code> memilih <code>&lt;li&gt;</code> yang merupakan <strong>anak langsung</strong> dari <code>&lt;ul&gt;</code> (tidak memilih <code>&lt;li&gt;</code> di dalam sub-menu bersarang).</li><li><strong>Next-Sibling Combinator (<code>+</code>):</strong> <code>h2 + p</code> memilih satu elemen <code>&lt;p&gt;</code> yang muncul <strong>tepat setelah</strong> <code>&lt;h2&gt;</code> pada induk yang sama.</li><li><strong>Subsequent-Sibling Combinator (<code>~</code>):</strong> <code>h2 ~ p</code> memilih semua elemen <code>&lt;p&gt;</code> yang menjadi adik setelah <code>&lt;h2&gt;</code> pada induk yang sama.</li></ol>
<pre>/* Pola &quot;Lobotomized Owl&quot; modern: memberi jarak atas pada semua elemen
   yang memiliki kakak tepat di atasnya di dalam aliran artikel */
.isi-artikel &gt; * + * {
  margin-block-start: 1rem;
}</pre>
<h2>3. Pseudo-Class Modern: <code>:is()</code>, <code>:where()</code>, <code>:not()</code>, dan <code>:has()</code></h2>
<p>Selain pseudo-class interaksi dasar seperti <code>:hover</code>, <code>:focus-visible</code>, <code>:active</code>, dan struktural seperti <code>:first-child</code>, <code>:nth-child(even)</code>, CSS modern menghadirkan empat pseudo-class fungsional yang mengubah cara kita menulis stylesheet (semuanya berstatus <strong>Baseline Widely Available</strong>):</p>
<h3>A. <code>:is()</code> dan <code>:where()</code>: Mengelompokkan Selektor Tanpa Pengulangan</h3>
<p>Sebelum ada <code>:is()</code>, memilih <code>h1</code>, <code>h2</code>, dan <code>h3</code> di dalam <code>article</code>, <code>section</code>, atau <code>aside</code> mengharuskan Anda menulis 9 baris selektor yang berulang. Kini cukup satu baris:</p>
<pre>/* Jauh lebih ringkas daripada menulis 9 kombinasi satu per satu */
:is(article, section, aside) :is(h1, h2, h3) {
  line-height: 1.25;
  color: #0f172a;
}</pre>
<p><strong>Perbedaan Krusial antara <code>:is()</code> dan <code>:where()</code>:</strong></p>
<ul><li><strong><code>:is(...)</code></strong> mengambil nilai <strong>spesifisitas tertinggi</strong> dari daftar argumen di dalamnya.</li><li><strong><code>:where(...)</code></strong> selalu memiliki <strong>spesifisitas nol (<code>0, 0, 0</code>)</strong>! Ini membuat <code>:where()</code> sangat ideal untuk menulis gaya dasar (<em>reset</em> atau <em>default library</em>) yang mudah ditimpa oleh kelas CSS biasa tanpa pertarungan spesifisitas.</li></ul>
<h3>B. <code>:has()</code> — Selektor Relasional (&quot;Parent Selector&quot;)</h3>
<p>Selama lebih dari 20 tahun, CSS tidak bisa memilih elemen induk berdasarkan isi anaknya. Hadirnya <strong><code>:has()</code></strong> (status <strong>Baseline Widely Available</strong> sejak Desember 2023) memungkinkan kita menata elemen berdasarkan kondisi anak atau adiknya:</p>
<pre>/* 1. Beri tata letak dua kolom pada .kartu HANYA JIKA di dalamnya ada elemen &lt;img&gt; */
.kartu:has(&gt; img) {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
}

/* 2. Ubah warna label dan bingkai pembungkus jika input di dalamnya sedang fokus */
.kelompok-input:has(input:focus-visible) {
  border-color: #2563eb;
  background-color: #eff6ff;
}

/* 3. Kurangi jarak bawah h2 jika tepat di bawahnya terdapat subjudul p.subjudul */
h2:has(+ p.subjudul) {
  margin-block-end: 0.25rem;
}</pre>
<h2>4. Pseudo-Element (<code>::before</code>, <code>::after</code>, <code>::selection</code>, <code>::marker</code>)</h2>
<p>Perhatikan penggunaan <strong>dua titik dua (<code>::</code>)</strong> untuk membedakan <em>pseudo-element</em> (memilih bagian tertentu dari elemen atau menyisipkan kotak semu) dari <em>pseudo-class</em> (<code>:</code>):</p>
<ul><li><strong><code>::first-line</code> &amp; <code>::first-letter</code>:</strong> Menata baris pertama atau huruf pertama paragraf (<em>drop cap</em>).</li><li><strong><code>::marker</code>:</strong> Menata warna atau bentuk titik/angka pada daftar <code>&lt;li&gt;</code> dan panah pada <code>&lt;summary&gt;</code>.</li><li><strong><code>::before</code> &amp; <code>::after</code>:</strong> Menyisipkan elemen semu dekoratif di awal atau akhir isi elemen (wajib memiliki properti <code>content: &quot;&quot;</code>).</li></ul>
<div class="callout waspada"><div class="callout-judul">⚠️ Aturan Aksesibilitas <code>::before</code> dan <code>::after</code></div><p>Jangan menyisipkan informasi tekstual yang penting hanya melalui <code>content: &quot;...&quot;</code> pada <code>::before</code>/<code>::after</code>, karena teks di dalam properti CSS <code>content</code> tidak dapat dipilih (<em>copy-paste</em>) oleh pengguna dan perlakuannya tidak selalu seragam di semua alat bantu. Gunakan untuk hiasan visual, ikon pendamping, atau bentuk geometris.</p></div>
<h2>Latihan Praktik: Menata Komponen Kartu dan Daftar Tanpa Kelas Berlebihan</h2>
<p>Buatlah berkas <code>selektor-modern.html</code> dan <code>style.css</code> yang menerapkan aturan berikut:</p>
<ol><li>Gunakan <code>:where(ul, ol)</code> untuk mereset padding daftar dengan spesifisitas nol.</li><li>Gunakan <code>:nth-child(odd)</code> untuk memberi warna latar belang (<em>zebra striping</em>) pada baris tabel <code>tbody tr</code>.</li><li>Gunakan <code>.kartu:has(input[type=&quot;checkbox&quot;]:checked)</code> agar seluruh kartu otomatis berubah warna bingkai dan latarnya saat kotak centang di dalamnya dicentang—murni dengan CSS tanpa JavaScript!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Selectors" rel="noopener">CSS selectors — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Selectors/Selectors_and_combinators" rel="noopener">CSS selectors and combinators — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Basic_selectors" rel="noopener">Basic CSS selectors — MDN Web Docs</a></li></ul></div>
`,
    perintah: [":is()",":where()","::before","::after","<h2>","href"],
    kuis: [
        {"tanya":"Apa perbedaan utama antara pseudo-class :is(.utama, #khusus) dan :where(.utama, #khusus)?","opsi":[":is() hanya bekerja pada elemen <div>, sedangkan :where() bekerja pada semua elemen.",":is() mengambil bobot spesifisitas tertinggi dari argumen di dalamnya (yaitu spesifisitas ID #khusus), sedangkan :where() selalu menghasilkan bobot spesifisitas nol (0, 0, 0).",":where() sudah dihapus dari standar CSS, sedangkan :is() masih didukung.",":is() memilih elemen anak, sedangkan :where() memilih elemen induk."],"benar":1,"penjelasan":"Baik :is() maupun :where() memilih himpunan elemen yang sama persis. Perbedaannya terletak pada perhitungan spesifisitas: :is() mengadopsi spesifisitas argumen paling spesifik di dalam kurungnya, sementara :where() selalu bernilai spesifisitas nol sehingga sangat mudah ditimpa oleh aturan CSS berikutnya."},
        {"tanya":"Manakah selektor CSS yang tepat untuk memilih elemen <figure> hanya jika di dalamnya terdapat elemen <figcaption>?","opsi":["figure > figcaption","figure:is(figcaption)","figure:has(figcaption)","figcaption < figure"],"benar":2,"penjelasan":"Selektor figure > figcaption akan memilih elemen <figcaption>-nya, bukan elemen induk <figure>. Untuk memilih elemen <figure> berdasarkan keberadaan <figcaption> di dalamnya, kita menggunakan pseudo-class relasional figure:has(figcaption)."},
        {"tanya":"Elemen manakah yang akan dipilih oleh selektor atribut a[href^=\"https://\"][href$=\".zip\"]?","opsi":["Semua tautan yang menggunakan protokol HTTPS atau berakhiran .zip.","Hanya tautan <a> yang atribut href-nya diawali dengan https:// sekaligus diakhiri dengan .zip.","Semua tautan yang berada di dalam berkas ZIP.","Tautan yang tidak memiliki protokol HTTPS."],"benar":1,"penjelasan":"Ketika beberapa selektor atribut digandengkan tanpa spasi ([attr1][attr2]), keduanya bekerja sebagai kondisi logika DAN (AND): elemen harus memenuhi awalan https:// (^=) sekaligus akhiran .zip ($=)."}
    ]
},
{
    id: 2,
    kategori: "1 · Fondasi",
    judul: "Kaskade (Cascade), Spesifisitas, Pewarisan, dan @layer",
    tingkat: "Dasar", durasi: "11 mnt",
    tag: ["@layer","!important","font-size"],
    ringkas: "Memahami bagaimana peramban menyelesaikan konflik aturan CSS melalui algoritma Cascade, menghitung bobot spesifisitas (A, B, C), mengatur pewarisan properti, serta mengendalikan urutan prioritas arsitektur CSS menggunakan @layer.",
    isi: `
<h2>Mengapa Aturan CSS Saya Tidak Bekerja?</h2>
<p>Pernahkah Anda menulis <code>color: blue;</code> pada sebuah kelas CSS, tetapi teks di layar tetap berwarna abu-abu meskipun berkas CSS sudah dimuat dengan benar?</p>
<p>Di CSS, satu elemen HTML bisa menjadi target dari lima atau sepuluh aturan CSS yang berbeda secara bersamaan. Karena sebuah elemen hanya bisa memiliki <strong>satu</strong> nilai akhir untuk setiap properti (misalnya satu <code>color</code> dan satu <code>font-size</code>), peramban menjalankan algoritma resolusi konflik yang disebut <strong>The Cascade (Kaskade)</strong>.</p>
<h2>1. Urutan Prioritas Algoritma Cascade Modern</h2>
<p>Ketika dua atau lebih deklarasi CSS memperebutkan properti yang sama pada satu elemen, peramban memutuskannya melalui tangga prioritas berikut (dari penentu tertinggi ke terendah):</p>
<pre>1. Origin &amp; Importance (!important)
   (Transisi aktif &gt; !important User Agent &gt; !important User &gt; !important Author &gt; Normal Author &gt; User &gt; User Agent)
          │
          ▼ (Jika sama-sama aturan Author normal:)
2. Konteks Enkapsulasi (mis. Shadow DOM vs dokumen luar)
          │
          ▼
3. Atribut style=&quot;&quot; Inline pada Elemen HTML
          │
          ▼
4. Cascade Layers (@layer) — Lapisan yang dideklarasikan belakangan menang
   (Aturan di luar @layer mengalahkan semua aturan normal di dalam @layer!)
          │
          ▼ (Jika berada di dalam @layer yang sama:)
5. Spesifisitas Selektor (A, B, C) — ID &gt; Class/Atribut/Pseudo-class &gt; Elemen/Pseudo-element
          │
          ▼ (Jika nilai spesifisitasnya seri/sama persis:)
6. Urutan Kemunculan (Order of Appearance) — Yang ditulis paling bawah menang!</pre>
<h2>2. Menghitung Spesifisitas Selektor <code>(A, B, C)</code></h2>
<p>Setiap selektor CSS memiliki skor spesifisitas yang terdiri dari tiga kolom: <strong><code>(A, B, C)</code></strong>:</p>
<ul><li><strong>Kolom <code>A</code> (ID):</strong> Jumlah selektor ID (seperti <code>#header</code>).</li><li><strong>Kolom <code>B</code> (Kelas, Atribut, Pseudo-class):</strong> Jumlah <code>.kelas</code>, <code>[atribut]</code>, dan <code>:pseudo-class</code> (seperti <code>:hover</code>, <code>:focus-visible</code>, <code>:nth-child()</code>).</li><li><strong>Kolom <code>C</code> (Tipe Elemen &amp; Pseudo-element):</strong> Jumlah nama tag (<code>div</code>, <code>p</code>, <code>a</code>) dan <code>::pseudo-element</code> (<code>::before</code>, <code>::after</code>).</li></ul>
<div class="callout info"><p><strong>Aturan Penting Perhitungan:</strong></p>
<ul><li>Kolom dibaca dari kiri ke kanan layaknya medali Olimpiade (Emas <code>A</code>, Perak <code>B</code>, Perunggu <code>C</code>). <strong>Satu medali Emas <code>(1, 0, 0)</code> selalu mengalahkan seribu medali Perak <code>(0, 1000, 0)</code>!</strong></li><li>Selektor universal (<code>*</code>), kombinator (<code>&gt;</code>, <code>+</code>, <code>~</code>, spasi), dan pseudo-class <code>:where(...)</code> menyumbang <strong><code>(0, 0, 0)</code></strong>.</li><li>Pseudo-class <code>:is()</code>, <code>:not()</code>, dan <code>:has()</code> tidak dihitung sebagai dirinya sendiri, melainkan menyumbang <strong>spesifisitas tertinggi dari argumen di dalam kurungnya</strong>.</li></ul></div>
<h3>Tabel Contoh Perhitungan Spesifisitas</h3>
<table><thead><tr><th>Selektor</th><th>Skor <code>(A, B, C)</code></th><th>Penjelasan Rincian</th></tr></thead><tbody><tr><td><code>*</code> atau <code>:where(#id.kelas)</code></td><td><code>(0, 0, 0)</code></td><td>Selektor universal dan <code>:where()</code> selalu bernilai nol.</td></tr><tr><td><code>article</code></td><td><code>(0, 0, 1)</code></td><td>1 elemen (<code>article</code>).</td></tr><tr><td><code>article h2::before</code></td><td><code>(0, 0, 3)</code></td><td>2 elemen (<code>article</code>, <code>h2</code>) + 1 pseudo-element (<code>::before</code>).</td></tr><tr><td><code>.kartu</code></td><td><code>(0, 1, 0)</code></td><td>1 kelas (<code>.kartu</code>) — mengalahkan <code>article h2::before</code>!</td></tr><tr><td><code>ul.menu &gt; li:first-child a[href]</code></td><td><code>(0, 3, 3)</code></td><td>3 di kolom B (<code>.menu</code>, <code>:first-child</code>, <code>[href]</code>) dan 3 di kolom C (<code>ul</code>, <code>li</code>, <code>a</code>).</td></tr><tr><td><code>:is(#konten, .biasa) p</code></td><td><code>(1, 0, 1)</code></td><td><code>:is()</code> mengambil argumen tertinggi (<code>#konten</code> = <code>1,0,0</code>) + <code>p</code> (<code>0,0,1</code>).</td></tr><tr><td><code>#navigasi</code></td><td><code>(1, 0, 0)</code></td><td>1 ID (<code>#navigasi</code>) — mengalahkan <code>(0, 3, 3)</code>!</td></tr></tbody></table>
<h2>3. Mengendalikan Kaskade Tanpa Perang Spesifisitas dengan <code>@layer</code></h2>
<p>Dalam proyek besar yang menggabungkan CSS <em>reset</em>, pustaka komponen pihak ketiga, gaya dasar, dan kelas utilitas, pengembang sering terjebak dalam &quot;perang spesifisitas&quot;—menambahkan <code>#id .bungkus .kartu .tombol</code> atau menebar <code>!important</code> hanya demi menimpa gaya komponen bawaan.</p>
<p>Sejak Maret 2022 (status <strong>Baseline Widely Available</strong>), CSS menyediakan <strong>Cascade Layers (<code>@layer</code>)</strong> yang memungkinkan Anda menentukan urutan prioritas kelompok CSS secara eksplisit <strong>tanpa memedulikan spesifisitas selektor di antar-lapisan</strong>:</p>
<pre>/* 1. Deklarasikan urutan lapisan di baris paling atas berkas CSS Anda
      (dari prioritas TERENDAH di kiri ke TERTINGGI di kanan) */
@layer reset, dasar, komponen, utilitas;

@layer reset {
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
  }
}

@layer komponen {
  /* Meskipun selektor ini sangat spesifik (0, 2, 1), ia berada di layer 'komponen' */
  .kartu-produk a.tombol-beli {
    background-color: #2563eb;
    color: #ffffff;
    padding: 0.5rem 1rem;
  }
}

@layer utilitas {
  /* Selektor sederhana (0, 1, 0) ini MENANG melawan .kartu-produk a.tombol-beli
     karena layer 'utilitas' berada setelah layer 'komponen'! */
  .latar-merah {
    background-color: #dc2626;
  }
}</pre>
<div class="callout info"><div class="callout-judul">💡 Aturan Emas <code>@layer</code></div><p>Aturan CSS normal yang ditulis <strong>tanpa <code>@layer</code> (unlayered styles)</strong> memiliki prioritas lebih tinggi daripada semua lapisan <code>@layer</code>. Oleh karena itu, jika Anda menggunakan <code>@layer</code>, masukkan seluruh aturan CSS proyek Anda ke dalam lapisan yang sesuai, atau gunakan lapisan untuk menampung kode <em>reset</em> dan pustaka pihak ketiga agar kode Anda selalu mudah menimpanya.</p></div>
<h2>4. Pewarisan (<em>Inheritance</em>) dan Kata Kunci Pengendali Nilai</h2>
<p>Tidak semua properti CSS diwariskan dari elemen induk ke elemen anak. Secara logis:</p>
<ul><li>**Properti yang otomatis diwariskan (<em>Inherited</em>):** Properti yang berkaitan dengan teks dan tipografi, seperti <code>color</code>, <code>font-family</code>, <code>font-size</code>, <code>font-weight</code>, <code>line-height</code>, <code>text-align</code>, <code>list-style</code>, dan variabel CSS (<code>--*</code>). Jika Anda mengatur <code>font-family</code> pada <code>&lt;body&gt;</code>, seluruh paragraf dan judul di dalamnya otomatis mewarisi fon tersebut.</li><li>**Properti yang TIDAK diwariskan (<em>Non-inherited</em>):** Properti yang berkaitan dengan kotak tata letak, seperti <code>width</code>, <code>height</code>, <code>margin</code>, <code>padding</code>, <code>border</code>, <code>background-color</code>, dan <code>display</code>. (Bayangkan betapa kacaunya jika Anda memberi <code>border: 2px solid black</code> pada <code>&lt;body&gt;</code> lalu setiap <code>&lt;p&gt;</code>, <code>&lt;span&gt;</code>, dan <code>&lt;strong&gt;</code> di dalamnya ikut memiliki bingkai hitam sendiri!).</li></ul>
<p>Namun, elemen formulir (<code>&lt;button&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;select&gt;</code>, <code>&lt;textarea&gt;</code>) secara bawaan <strong>tidak</strong> mewarisi <code>font-family</code> dan <code>font-size</code> dari <code>&lt;body&gt;</code> karena mengikuti gaya sistem operasi. Kita dapat memaksanya mewarisi fon induk menggunakan kata kunci <strong><code>inherit</code></strong>:</p>
<pre>/* Memaksa elemen formulir mewarisi tipografi dari dokumen */
input, button, textarea, select {
  font: inherit;
  color: inherit;
}</pre>
<h3>Empat Kata Kunci Reset Nilai di CSS</h3>
<ul><li><strong><code>inherit</code>:</strong> Mengambil nilai komputasi dari elemen induk langsungnya.</li><li><strong><code>initial</code>:</strong> Mengembalikan properti ke nilai awal menurut spesifikasi resmi CSS (hati-hati: <code>initial</code> dari <code>display</code> pada <code>&lt;div&gt;</code> bukanlah <code>block</code>, melainkan <code>inline</code>!).</li><li><strong><code>revert</code>:</strong> Mengembalikan properti ke gaya bawaan peramban (<em>user-agent stylesheet</em>), sehingga <code>display: revert</code> pada <code>&lt;div&gt;</code> kembali menjadi <code>block</code>.</li><li><strong><code>revert-layer</code>:</strong> Mengembalikan nilai properti ke nilai yang ditetapkan pada <code>@layer</code> sebelumnya!</li></ul>
<h2>Kesalahan Umum dan Cara Menghindarinya</h2>
<ol><li><strong>Menyalahgunakan <code>!important</code> untuk jalan pintas:</strong><ul><li><strong>Bahaya:</strong> Begitu Anda menulis <code>color: red !important;</code> pada komponen dasar, satu-satunya cara menimpanya di kemudian hari adalah dengan menulis <code>!important</code> lagi dengan spesifisitas lebih tinggi. Simpan <code>!important</code> hanya untuk kelas utilitas aksesibilitas seperti <code>.sembunyikan[hidden] { display: none !important; }</code>.</li></ul></li><li><strong>Menggunakan selektor <code>#id</code> untuk penataan gaya komponen:</strong><ul><li><strong>Lebih Baik:</strong> Gunakan atribut <code>id</code> di HTML untuk jangkar URL (<code>#bagian</code>), <code>&lt;label for=&quot;...&quot;&gt;</code>, atau JavaScript, tetapi gunakan <code>.kelas</code> di CSS agar spesifisitas tetap rendah dan mudah dikelola.</li></ul></li></ol>
<h2>Latihan Praktik: Menata Arsitektur CSS dengan <code>@layer</code></h2>
<p>Buatlah berkas <code>kaskade-layer.html</code> dan <code>layer.css</code> yang mendemonstrasikan:</p>
<ol><li>Tiga lapisan <code>@layer reset, komponen, utilitas;</code>.</li><li>Di dalam <code>@layer reset</code>, pastikan semua elemen <code>input</code> dan <code>button</code> mewarisi <code>font: inherit</code>.</li><li>Di dalam <code>@layer komponen</code>, buat aturan <code>#kartu-utama .judul-kartu</code> berwarna biru tua.</li><li>Di dalam <code>@layer utilitas</code>, buat kelas <code>.teks-hijau</code> yang berhasil mengubah warna <code>#kartu-utama .judul-kartu</code> menjadi hijau <strong>tanpa</strong> memakai <code>!important</code> dan tanpa menulis <code>#kartu-utama</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade" rel="noopener">CSS cascading and inheritance — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Inheritance" rel="noopener">Inheritance — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS" rel="noopener">CSS: Cascading Style Sheets — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["@layer","!important","font-size","(A, B, C)","article","font-family"],
    kuis: [
        {"tanya":"Manakah dari empat selektor berikut yang memiliki bobot spesifisitas paling tinggi?","opsi":["main article.pos-utama section p::first-line",".kontainer .kartu .tombol:hover","#panel-samping p",":where(#panel-samping) .kartu .tombol"],"benar":2,"penjelasan":"Mari kita hitung skor (A, B, C) masing-masing: - A memiliki 0 ID, 1 kelas, 5 elemen/pseudo-element = (0, 1, 5). - B memiliki 0 ID, 4 kelas/pseudo-class, 0 elemen = (0, 4, 0). - C memiliki 1 ID (#panel-samping) dan 1 elemen (p) = (1, 0, 1). - D memiliki :where(#panel-samping) yang bernilai 0, ditambah 2 kelas = (0, 2, 0). Karena kolom A (ID) selalu mengalahkan kolom B dan C berapapun jumlahnya, maka #panel-samping p (1, 0, 1) menang."},
        {"tanya":"Perhatikan potongan kode CSS berikut: ```css @layer dasar, tema; @layer tema { .judul { color: green; } } @layer dasar { #judul-utama.judul { color: red; } } ``` Jika sebuah elemen ditulis <h1 id=\"judul-utama\" class=\"judul\">Halo</h1>, warna apakah yang akan tampil?","opsi":["Merah (red), karena #judul-utama.judul memiliki spesifisitas ID yang jauh lebih tinggi.","Hijau (green), karena di dalam algoritma Cascade, urutan @layer dievaluasi lebih dulu sebelum spesifisitas selektor, dan layer tema dideklarasikan setelah layer dasar.","Hitam bawaan peramban, karena terjadi konflik antara @layer dan ID.","Merah (red), karena blok @layer dasar ditulis paling bawah di berkas CSS."],"benar":1,"penjelasan":"Dalam algoritma Cascade, prioritas @layer dievaluasi sebelum spesifisitas selektor. Karena baris pertama menetapkan @layer dasar, tema;, maka aturan normal di dalam layer tema selalu mengalahkan aturan normal di dalam layer dasar, meskipun aturan di dasar menggunakan selektor #id."},
        {"tanya":"Apa perbedaan antara display: initial dan display: revert ketika diterapkan pada sebuah elemen <div>?","opsi":["Tidak ada perbedaan; keduanya mengembalikan <div> menjadi display: block.","display: initial mengembalikan properti ke nilai awal spesifikasi CSS (inline), sedangkan display: revert mengembalikannya ke aturan bawaan peramban untuk elemen <div> (block).","display: revert menghapus elemen dari DOM, sedangkan display: initial menyembunyikannya.","display: initial hanya bekerja di dalam @layer."],"benar":1,"penjelasan":"Nilai awal (initial value) dari properti display pada spesifikasi CSS untuk semua elemen sebenarnya adalah inline. Elemen <div> tampil sebagai kotak blok karena stylesheet bawaan peramban (user-agent stylesheet) memberinya div { display: block; }. Kata kunci revert memutar balik aturan ke stylesheet bawaan peramban (block), sedangkan initial memutar balik ke nilai spesifikasi murni (inline)."}
    ]
},
{
    id: 3,
    kategori: "1 · Fondasi",
    judul: "Box Model, Margin Collapsing, dan Properti Logis (inline & block)",
    tingkat: "Dasar", durasi: "10 mnt",
    tag: ["inline","block","box-sizing: border-box"],
    ringkas: "Memahami empat lapisan kotak CSS (konten, padding, border, margin), mengapa box-sizing: border-box wajib menjadi standar, cara kerja peleburan margin vertikal (margin collapsing), serta penggunaan properti logis modern.",
    isi: `
<h2>Semua Elemen di Halaman Web Adalah Kotak Persegi Panjang</h2>
<p>Bahkan ketika Anda membuat lingkaran dengan <code>border-radius: 50%</code>, mesin tata letak peramban tetap memperlakukan setiap elemen HTML sebagai sebuah kotak persegi panjang yang mengikuti <strong>CSS Box Model</strong>.</p>
<p>Setiap kotak tersusun atas empat lapisan konsentris dari dalam ke luar:</p>
<pre>+-------------------------------------------------------------------+
|                             MARGIN                                |
|   (Ruang transparan di luar batas kotak untuk menjauhkan tetangga)|
|   +-----------------------------------------------------------+   |
|   |                         BORDER                            |   |
|   |       (Garis bingkai yang mengelilingi padding &amp; konten)  |   |
|   |   +---------------------------------------------------+   |   |
|   |   |                     PADDING                       |   |   |
|   |   |     (Bantalan ruang di dalam kotak; ikut terkena  |   |   |
|   |   |      warna background elemen)                     |   |   |
|   |   |   +-------------------------------------------+   |   |   |
|   |   |   |                                           |   |   |   |
|   |   |   |                  CONTENT                  |   |   |   |
|   |   |   |         (Teks, gambar, atau anak)         |   |   |   |
|   |   |   |                                           |   |   |   |
|   |   |   +-------------------------------------------+   |   |   |
|   |   +---------------------------------------------------+   |   |
|   +-----------------------------------------------------------+   |
+-------------------------------------------------------------------+</pre>
<h2>1. <code>content-box</code> vs <code>border-box</code>: Mengapa <code>border-box</code> Adalah Penyelamat?</h2>
<p>Secara bawaan, CSS menggunakan model perhitungan kuno bernama <strong><code>box-sizing: content-box</code></strong>. Dalam mode <code>content-box</code>, ketika Anda menulis <code>width: 300px</code>, angka <code>300px</code> tersebut <strong>hanya mengatur lebar area CONTENT di bagian paling dalam</strong>.</p>
<p>Akibatnya, jika Anda menambahkan <code>padding: 20px</code> dan <code>border: 2px solid</code>, lebar total kotak yang sebenarnya di layar membengkak menjadi: <code>300px (content) + 20px (padding kiri) + 20px (padding kanan) + 2px (border kiri) + 2px (border kanan) = 344px</code>!</p>
<p>Hal ini sangat menyulitkan ketika Anda ingin menaruh dua kotak <code>width: 50%</code> berdampingan namun tetap memiliki <code>padding</code> dan <code>border</code>.</p>
<p>Solusinya adalah mengubah perhitungan menjadi <strong><code>box-sizing: border-box</code></strong> di awal setiap berkas CSS Anda:</p>
<pre>/* Aturan wajib di baris paling atas setiap proyek CSS modern */
*,
*::before,
*::after {
  box-sizing: border-box;
}</pre>
<p>Dengan <code>box-sizing: border-box</code>, ketika Anda menulis <code>width: 300px</code>, maka <strong>lebar total dari batas luar border kiri hingga batas luar border kanan dijamin tepat <code>300px</code></strong>. Jika Anda menambahkan <code>padding: 20px</code> dan <code>border: 2px</code>, peramban secara otomatis menyusutkan ruang konten di dalamnya menjadi <code>256px</code> tanpa merusak ukuran luar kotak!</p>
<h2>2. Memahami Peleburan Margin Vertikal (<em>Margin Collapsing</em>)</h2>
<p>Berbeda dengan <code>padding</code> yang selalu dijumlahkan apa adanya, **margin vertikal (atas dan bawah) pada elemen blok di dalam aliran normal (<em>normal flow</em>) tidak dijumlahkan, melainkan melebur menjadi satu nilai terbesar**.</p>
<h3>Kapan Margin Collapsing Terjadi?</h3>
<ol><li><strong>Dua elemen adik-kakak yang berurutan secara vertikal:</strong> Jika paragraf pertama memiliki <code>margin-bottom: 24px</code> dan paragraf kedua di bawahnya memiliki <code>margin-top: 16px</code>, jarak di antara keduanya <strong>bukanlah <code>40px</code> (<code>24 + 16</code>)</strong>, melainkan <strong><code>24px</code></strong> (nilai terbesar dari keduanya).</li><li><strong>Elemen induk dan anak pertamanya (Jebakan Paling Umum!):</strong> Jika Anda memiliki <code>&lt;section class=&quot;hero&quot;&gt;</code> tanpa <code>padding-top</code> dan tanpa <code>border-top</code>, lalu di dalamnya terdapat <code>&lt;h1&gt;</code> dengan <code>margin-top: 32px</code>, maka margin milik <code>&lt;h1&gt;</code> tersebut akan <strong>menembus keluar elemen <code>&lt;section&gt;</code></strong> dan mendorong seluruh <code>&lt;section&gt;</code> turun sejauh <code>32px</code>!</li></ol>
<pre>/* Masalah: margin-top milik h1 menembus keluar .hero sehingga muncul celah putih di atas .hero */
.hero {
  background-color: #1e293b;
  color: #ffffff;
}

/* Solusi 1 (Paling Direkomendasikan): Gunakan padding pada wadah induk, bukan margin pada anak pertama */
.hero {
  background-color: #1e293b;
  color: #ffffff;
  padding-block: 2rem;
}

/* Solusi 2: Buat Block Formatting Context (BFC) baru dengan display: flow-root */
.hero-bfc {
  display: flow-root;
}</pre>
<div class="callout info"><div class="callout-judul">💡 Catatan Penting</div><p><em>Margin collapsing</em> <strong>tidak pernah terjadi</strong> pada arah horizontal (kiri-kanan), dan <strong>tidak pernah terjadi</strong> pada elemen yang berada di dalam kontainer <strong>Flexbox</strong> (<code>display: flex</code>) maupun <strong>CSS Grid</strong> (<code>display: grid</code>). Di dalam Flexbox dan Grid, gunakan properti <strong><code>gap</code></strong> untuk mengatur jarak antar-elemen dengan bersih!</p></div>
<h2>3. Properti Logis (<code>inline</code> dan <code>block</code>) vs Properti Fisik</h2>
<p>Secara tradisional, kita menulis properti berbasis arah fisik layar: <code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code>, serta <code>width</code> dan <code>height</code>.</p>
<p>Namun, CSS modern memperkenalkan <strong>Logical Properties</strong> (status <strong>Baseline Widely Available</strong>) yang mengikuti arah aliran teks dokumen (<em>writing mode</em>):</p>
<ul><li><strong>Dimensi <code>inline</code> (Sejajar baris kalimat):</strong> Dalam Bahasa Indonesia/Inggris (<code>ltr</code>), sumbu <code>inline</code> adalah <strong>kiri ke kanan</strong> (<code>inline-start</code> = kiri, <code>inline-end</code> = kanan, <code>inline-size</code> = lebar/<code>width</code>). Dalam bahasa Arab (<code>rtl</code>), <code>inline-start</code> otomatis berbalik menjadi kanan!</li><li><strong>Dimensi <code>block</code> (Sejajar tumpukan paragraf):</strong> Sumbu <code>block</code> adalah <strong>atas ke bawah</strong> (<code>block-start</code> = atas, <code>block-end</code> = bawah, <code>block-size</code> = tinggi/<code>height</code>).</li></ul>
<table><thead><tr><th>Properti Fisik Lama</th><th>Properti Logis Modern</th><th>Keuntungan Praktis</th></tr></thead><tbody><tr><td><code>width</code> / <code>max-width</code></td><td><code>inline-size</code> / <code>max-inline-size</code></td><td>Menyesuaikan mode penulisan secara otomatis.</td></tr><tr><td><code>height</code> / <code>min-height</code></td><td><code>block-size</code> / <code>min-block-size</code></td><td>Konsisten dengan sistem dimensi blok.</td></tr><tr><td><code>margin-left: auto; margin-right: auto;</code></td><td><code>margin-inline: auto;</code></td><td>Menengahkan kotak blok cukup dengan <strong>satu baris</strong>!</td></tr><tr><td><code>padding-top: 1rem; padding-bottom: 1rem;</code></td><td><code>padding-block: 1rem;</code></td><td>Mengatur bantalan atas dan bawah sekaligus tanpa mengubah kiri-kanan.</td></tr><tr><td><code>padding-left: 1.5rem; padding-right: 1.5rem;</code></td><td><code>padding-inline: 1.5rem;</code></td><td>Mengatur bantalan kiri dan kanan sekaligus.</td></tr><tr><td><code>border-left: 4px solid blue;</code></td><td><code>border-inline-start: 4px solid blue;</code></td><td>Garis aksen otomatis pindah ke kanan pada bahasa RTL.</td></tr></tbody></table>
<pre>/* Menata wadah artikel yang terpusat dan rapi menggunakan properti logis */
.wadah-artikel {
  max-inline-size: 68ch;
  margin-inline: auto;
  padding-inline: 1.25rem;
  padding-block: 2rem;
}

.kotak-catatan {
  border-inline-start: 4px solid #2563eb;
  padding-inline-start: 1rem;
  margin-block: 1.5rem;
}</pre>
<h2>4. Mengendalikan Konten yang Meluber dengan <code>overflow</code></h2>
<p>Ketika sebuah kotak diberi ukuran tetap (yang sebaiknya dihindari kecuali diperlukan) atau memiliki kode panjang yang tak terputus, konten dapat meluber keluar batas kotak. Anda dapat mengendalikannya dengan <code>overflow</code> (<code>overflow-x</code> / <code>overflow-y</code> atau logis <code>overflow-inline</code> / <code>overflow-block</code>):</p>
<ul><li><strong><code>visible</code> (bawaan):</strong> Konten dibiarkan tampil melewati batas kotak.</li><li><strong><code>hidden</code>:</strong> Konten yang lewat dipotong dan tidak bisa digulir oleh pengguna (tetapi masih bisa digulir secara terprogram, misalnya lewat <code>scrollTo()</code> atau fokus elemen), karena kotaknya tetap menjadi <em>scroll container</em>.</li><li><strong><code>clip</code>:</strong> Memotong konten seperti <code>hidden</code>, tetapi sama sekali melarang pengguliran terprogram pun dan tidak membuat <em>scroll container</em> baru (sangat berguna bila Anda punya elemen <code>position: sticky</code> di dalamnya).</li><li><strong><code>auto</code>:</strong> Menampilkan bilah gulir (<em>scrollbar</em>) <strong>hanya jika</strong> konten benar-benar melebihi ukuran kotak (jauh lebih rapi daripada <code>scroll</code> yang selalu memunculkan rel <em>scrollbar</em> kosong).</li></ul>
<h2>Latihan Praktik: Membangun Komponen Callout dan Wadah Artikel</h2>
<p>Buatlah berkas <code>box-model.html</code> dan <code>box.css</code> yang menerapkan:</p>
<ol><li>Reset global <code>box-sizing: border-box</code>.</li><li>Sebuah <code>.wadah-utama</code> yang terpusat di tengah layar dengan lebar maksimal <code>720px</code> menggunakan <code>max-inline-size</code> dan <code>margin-inline: auto</code>, serta bantalan kiri-kanan <code>padding-inline: 1rem</code>.</li><li>Dua komponen <code>.callout</code> berurutan yang memiliki <code>border-inline-start: 4px solid #0284c7</code>, <code>padding-block: 1rem</code>, <code>padding-inline: 1.25rem</code>, dan amati bagaimana <code>margin-block: 1.5rem</code> pada keduanya melebur dengan rapi.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_model/Introduction" rel="noopener">Introduction to the CSS box model — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model" rel="noopener">The box model — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_model" rel="noopener">CSS box model — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["box-sizing: border-box","inline","block","width","height","content-box"],
    kuis: [
        {"tanya":"Sebuah elemen <div> memiliki aturan CSS berikut: ```css div { box-sizing: border-box; width: 400px; padding: 20px; border: 5px solid black; margin: 15px; } ``` Berapakah lebar ruang konten dalam (content width) dari elemen <div> tersebut?","opsi":["400px","450px","350px","320px"],"benar":2,"penjelasan":"Karena menggunakan box-sizing: border-box, angka width: 400px mencakup konten + padding kiri & kanan + border kiri & kanan (margin tidak termasuk di dalam border-box). Maka lebar ruang kontennya adalah 400px - (20px * 2) - (5px * 2) = 400px - 40px - 10px = 350px."},
        {"tanya":"Dalam aliran dokumen normal (normal flow), elemen <p class=\"pertama\"> memiliki margin-bottom: 30px, dan tepat di bawahnya terdapat <p class=\"kedua\"> dengan margin-top: 20px. Berapakah jarak vertikal aktual di antara kedua paragraf tersebut?","opsi":["50px","30px","20px","10px"],"benar":1,"penjelasan":"Akibat perilaku margin collapsing pada margin vertikal yang bersinggungan dalam aliran blok normal, kedua margin tidak dijumlahkan (30 + 20), melainkan melebur menjadi satu nilai terbesar di antara keduanya, yaitu 30px."},
        {"tanya":"Properti CSS logis manakah yang setara dengan menulis margin-left: auto; margin-right: auto; pada dokumen berbahasa Indonesia (arah teks horizontal kiri-ke-kanan)?","opsi":["margin-block: auto;","margin-inline: auto;","padding-inline: auto;","inset-block: auto;"],"benar":1,"penjelasan":"Pada mode penulisan horizontal, sumbu inline merentang secara horizontal (sejajar baris teks: kiri dan kanan), sedangkan sumbu block merentang secara vertikal (atas dan bawah). Oleh karena itu, margin-inline: auto mengatur margin kiri dan kanan sekaligus menjadi auto."}
    ]
},
{
    id: 4,
    kategori: "1 · Fondasi",
    judul: "Satuan Ukuran Modern (rem, ch, dvh) dan Fungsi Matematika (calc, clamp)",
    tingkat: "Dasar", durasi: "10 mnt",
    tag: ["rem","ch","dvh"],
    ringkas: "Memilih satuan CSS yang tepat antara satuan absolut (px) dan relatif (rem, em, ch, %, vw, dvh, svh), serta merancang tipografi dan spasi yang luwes menggunakan fungsi calc(), min(), max(), dan clamp().",
    isi: `
<h2>Mengapa Kita Tidak Memakai <code>px</code> untuk Semuanya?</h2>
<p>Satuan piksel CSS (<code>px</code>) sangat presisi dan mudah dipahami, tetapi menggunakan <code>px</code> untuk semua properti—terutama untuk ukuran huruf (<code>font-size</code>) dan lebar kontainer—memiliki kelemahan serius:</p>
<ol><li><strong>Mengabaikan Preferensi Ukuran Huruf Pengguna:</strong> Banyak pengguna dengan gangguan penglihatan mengubah ukuran fon bawaan di pengaturan peramban mereka dari <code>16px</code> menjadi <code>20px</code> atau <code>24px</code>. Jika Anda mengunci ukuran teks dengan <code>font-size: 14px</code>, teks Anda akan tetap kecil dan mengabaikan pengaturan aksesibilitas pengguna tersebut!</li><li><strong>Tidak Luwes di Ribuan Ukuran Layar:</strong> Lebar layar pengunjung berkisar dari <code>320px</code> (ponsel kecil) hingga <code>2560px</code> (monitor lebar).</li></ol>
<p>Oleh karena itu, pengembang front-end profesional memilih satuan berdasarkan <strong>konteks propertinya</strong>.</p>
<h2>1. Memilih Satuan: <code>px</code>, <code>rem</code>, <code>em</code>, dan <code>ch</code></h2>
<table><thead><tr><th>Satuan</th><th>Mengacu Pada</th><th>Kapan Harus Digunakan?</th></tr></thead><tbody><tr><td><strong><code>rem</code></strong> (<em>Root EM</em>)</td><td>Ukuran <code>font-size</code> pada elemen akar <code>&lt;html&gt;</code> (bawaan peramban: <code>1rem = 16px</code>).</td><td><strong>Pilihan utama untuk <code>font-size</code>, <code>padding</code>, <code>margin</code> global, dan lebar komponen.</strong> Menghormati pengaturan ukuran huruf peramban pengguna dan nilainya selalu konsisten di seluruh dokumen!</td></tr><tr><td><strong><code>em</code></strong></td><td>Ukuran <code>font-size</code> dari elemen itu sendiri (atau elemen induknya jika digunakan pada properti <code>font-size</code>).</td><td>Sangat cocok untuk <strong>padding atau margin lokal yang harus proporsional dengan ukuran huruf elemen tersebut</strong> (misalnya <code>padding: 0.5em 1em</code> pada tombol atau lencana/<code>badge</code>).</td></tr><tr><td><strong><code>ch</code></strong> (<em>Character unit</em>)</td><td>Lebar glif angka <code>&quot;0&quot;</code> pada fon yang sedang digunakan.</td><td><strong>Pilihan terbaik untuk membatasi lebar baris paragraf bacaan</strong> (<code>max-inline-size: 65ch</code>). Baris teks yang panjangnya antara <code>50ch</code> hingga <code>75ch</code> terbukti paling nyaman dibaca mata manusia.</td></tr><tr><td><strong><code>px</code></strong> (<em>CSS Pixel</em>)</td><td>Satuan panjang absolut visual.</td><td>Gunakan untuk <strong>ketebalan garis batas (<code>border: 1px solid</code>), sudut membulat kecil (<code>border-radius: 6px</code>), dan bayangan (<code>box-shadow</code>)</strong> yang memang tidak perlu membesar saat ukuran teks diperbesar.</td></tr><tr><td><strong><code>%</code></strong> (<em>Persentase</em>)</td><td>Ukuran properti yang bersangkutan pada elemen induk.</td><td>Mengatur lebar relatif terhadap wadah induk (misalnya <code>max-width: 100%</code> pada gambar).</td></tr></tbody></table>
<div class="callout waspada"><div class="callout-judul">⚠️ Jebakan Efek Bola Salju pada <code>em</code> untuk <code>font-size</code></div><p>Jika Anda menulis <code>ul { font-size: 0.85em; }</code>, maka daftar <code>&lt;ul&gt;</code> tingkat pertama berukuran <code>85%</code>. Namun jika di dalamnya terdapat sub-daftar <code>&lt;ul&gt;</code> bersarang, ukurannya menjadi <code>0.85 × 0.85 = 72%</code>, dan tingkat ketiganya menyusut menjadi <code>61%</code>! Gunakan <strong><code>rem</code></strong> untuk <code>font-size</code> agar ukurannya selalu mengacu ke akar <code>&lt;html&gt;</code>.</p></div>
<div class="callout bahaya"><div class="callout-judul">🚫 Jangan Mengubah <code>html { font-size: 10px }</code>!</div><p>Hanya demi mempermudah hitungan matematika di kepala (<code>1.6rem = 16px</code>), sebagian tutorial lama menyarankan <code>html { font-size: 10px }</code> atau <code>62.5%</code>. Hindari pola <code>10px</code> karena nilai piksel tetap pada <code>&lt;html&gt;</code> menimpa preferensi ukuran huruf pengguna di peramban dan memaksa ukuran dasar menjadi terlalu kecil bagi halaman atau komponen yang belum terdefinisi, dan biasakan menghitung dengan kelipatan <code>1rem = 16px</code> (<code>0.75rem = 12px</code>, <code>0.875rem = 14px</code>, <code>1rem = 16px</code>, <code>1.25rem = 20px</code>, <code>1.5rem = 24px</code>, <code>2rem = 32px</code>) atau gunakan fungsi <code>calc(14 / 16 * 1rem)</code>.</p></div>
<h2>2. Satuan Viewport: Mengapa <code>100dvh</code> Menggantikan <code>100vh</code> di Perangkat Seluler?</h2>
<p>Satuan <em>viewport</em> mengukur persentase dari jendela layar peramban yang sedang terbuka (<code>100vw</code> = 100% lebar layar, <code>100vh</code> = 100% tinggi layar).</p>
<p>Namun, pada peramban ponsel (Safari iOS dan Chrome Android), bilah alamat (<em>address bar</em>) di bagian atas/bawah layar dapat <strong>menyusut dan membesar secara dinamis</strong> saat pengguna menggulir halaman.</p>
<ul><li>Satuan lama <strong><code>100vh</code></strong> selalu dihitung seolah-olah bilah alamat peramban sedang tersembunyi (ukuran paling besar). Akibatnya, saat halaman pertama kali dibuka (ketika bilah alamat masih muncul), bagian bawah elemen <code>height: 100vh</code> (seperti tombol aksi di bawah layar) <strong>terpotong dan tertutup oleh bilah alamat peramban</strong>!</li></ul>
<p>CSS modern (status <strong>Baseline Widely Available</strong> sejak Desember 2022) menyelesaikan masalah ini dengan tiga satuan viewport baru:</p>
<ol><li>**<code>svh</code> (<em>Small Viewport Height</em>):** Tinggi layar saat bilah alamat peramban sedang terbuka penuh (ukuran teraman agar konten dijamin tidak pernah tertutup bilah peramban).</li><li>**<code>lvh</code> (<em>Large Viewport Height</em>):** Tinggi layar saat bilah alamat peramban menyusut/tersembunyi.</li><li>**<code>dvh</code> (<em>Dynamic Viewport Height</em>):** Menyesuaikan tinggi secara dinamis mengikuti muncul atau sembunyinya bilah alamat peramban!</li></ol>
<pre>/* Menjamin tinggi minimal halaman penuh tanpa terpotong bilah alamat di ponsel */
body {
  min-block-size: 100vh;  /* Fallback untuk peramban lama */
  min-block-size: 100dvh; /* Standar modern */
}</pre>
<h2>3. Fungsi Matematika CSS: <code>calc()</code>, <code>min()</code>, <code>max()</code>, dan <code>clamp()</code></h2>
<p>CSS memungkinkan Anda melakukan perhitungan dinamis yang mencampurkan satuan berbeda secara langsung di peramban:</p>
<h3>A. <code>calc()</code>: Menggabungkan Satuan yang Berbeda</h3>
<p>Perhatikan bahwa operator <code>+</code> dan <code>-</code> di dalam <code>calc()</code> <strong>wajib diapit oleh spasi</strong> (misalnya <code>calc(100% - 2rem)</code>, bukan <code>calc(100%-2rem)</code>):</p>
<pre>.panel-utama {
  /* Lebar 100% dikurangi lebar bilah samping tetap 260px */
  inline-size: calc(100% - 260px);
}</pre>
<h3>B. <code>min()</code> dan <code>max()</code>: Pembatas Dinamis Satu Baris</h3>
<ul><li><code>min(A, B)</code> memilih nilai mana pun yang <strong>paling kecil</strong> saat itu.</li><li><code>max(A, B)</code> memilih nilai mana pun yang <strong>paling besar</strong> saat itu.</li></ul>
<pre>/* Menggantikan gabungan width: 92% dan max-width: 1120px cukup dengan satu baris! */
.kontainer {
  inline-size: min(92%, 1120px);
  margin-inline: auto;
}</pre>
<h3>C. <code>clamp(MIN, IDEAL, MAX)</code>: Tipografi dan Spasi Cair (<em>Fluid Typography</em>)</h3>
<p>Fungsi <code>clamp()</code> mengunci sebuah nilai di antara <strong>batas bawah (<code>MIN</code>)</strong>, <strong>nilai ideal yang elastis (<code>IDEAL</code>)</strong>, dan <strong>batas atas (<code>MAX</code>)</strong> tanpa memerlukan satupun <code>@media</code> query!</p>
<pre>h1 {
  /* - Minimal 1.75rem (28px) di layar ponsel kecil
     - Tumbuh secara mulus mengikuti 1.2rem + 2.5vw
     - Maksimal berhenti di 3rem (48px) pada monitor besar */
  font-size: clamp(1.75rem, 1.2rem + 2.5vw, 3rem);
  line-height: 1.15;
}</pre>
<div class="callout info"><div class="callout-judul">💡 Tips Aksesibilitas untuk <code>clamp()</code></div><p>Pada argumen tengah (<em>ideal value</em>) di <code>clamp()</code>, <strong>selalu gabungkan <code>rem</code> dengan <code>vw</code></strong> (seperti <code>1.2rem + 2.5vw</code>), jangan menulis <code>4vw</code> sendirian! Jika Anda hanya menulis <code>font-size: clamp(1.75rem, 4vw, 3rem)</code>, maka saat pengguna memperbesar ukuran huruf peramban (<em>browser zoom</em>), nilai <code>4vw</code> tidak ikut membesar karena lebar layar tidak berubah. Menggabungkan <code>1.2rem + 2.5vw</code> memastikan teks tetap merespons fitur <em>zoom</em> pengguna.</p></div>
<h2>Latihan Praktik: Merancang Halaman Artikel dengan Tipografi Cair</h2>
<p>Buatlah berkas <code>satuan-fluid.html</code> dan <code>fluid.css</code> yang menerapkan:</p>
<ol><li>Wadah artikel dengan lebar <code>inline-size: min(100% - 2rem, 65ch)</code> dan <code>margin-inline: auto</code>.</li><li>Ukuran <code>&lt;h1&gt;</code> menggunakan <code>clamp(1.8rem, 1.3rem + 2vw, 2.75rem)</code> dan jarak <code>padding-block</code> seksi menggunakan <code>clamp(2rem, 1rem + 4vw, 5rem)</code>.</li><li>Sebuah lencana status (<code>.lencana</code>) yang menggunakan <code>padding: 0.25em 0.75em</code> dan <code>border-radius: 999px</code> sehingga bantalannya otomatis menyesuaikan ukuran huruf lencana tersebut.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units" rel="noopener">CSS values and units — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Values_and_units" rel="noopener">CSS values and units guide — MDN Web Docs</a></li><li><a href="https://web.dev/learn/css" rel="noopener">Learn CSS — web.dev</a></li></ul></div>
`,
    perintah: ["font-size","px","rem","clamp()","em","<html>"],
    kuis: [
        {"tanya":"Mengapa satuan rem lebih direkomendasikan daripada px untuk menentukan ukuran huruf (font-size) pada halaman web?","opsi":["Karena satuan px tidak didukung pada layar Retina/AMOLED.","Karena rem mengacu pada ukuran fon elemen akar (<html>), sehingga otomatis menyesuaikan diri apabila pengguna mengubah preferensi ukuran huruf bawaan di pengaturan peramban demi kenyamanan baca.","Karena rem selalu menghasilkan ukuran huruf dua kali lebih besar daripada px.","Karena px tidak dapat digunakan di dalam fungsi calc()."],"benar":1,"penjelasan":"Menetapkan font-size dalam px mengabaikan preferensi ukuran fon dasar yang diatur pengguna di peramban. Dengan rem, seluruh skala tipografi situs akan membesar atau mengecil secara proporsional mengikuti pengaturan aksesibilitas pengguna."},
        {"tanya":"Apa masalah utama penggunaan height: 100vh pada peramban ponsel modern yang dapat diatasi dengan menggunakan 100dvh atau 100svh?","opsi":["100vh membuat halaman ponsel berputar menjadi mode lanskap secara paksa.","100vh selalu menghitung tinggi layar seolah-olah bilah alamat (address bar) peramban sedang tersembunyi, sehingga bagian bawah elemen sering terpotong saat bilah alamat peramban sedang tampil.","100vh hanya menghitung lebar layar, bukan tinggi layar.","100vh memblokir pengguliran halaman di desktop."],"benar":1,"penjelasan":"Pada peramban perangkat seluler, tinggi ruang pandang berubah saat bilah navigasi/alamat menyusut atau muncul. 100vh dipatok pada ukuran terbesar (large viewport), sedangkan 100dvh (dynamic viewport height) dan 100svh (small viewport height) memperhitungkan keberadaan bilah antarmuka peramban tersebut."},
        {"tanya":"Perhatikan aturan CSS berikut: ```css .kontainer { inline-size: min(90%, 1000px); } ``` Berapakah lebar .kontainer ketika halaman dibuka pada layar ponsel selebar 400px, dan ketika dibuka pada monitor desktop selebar 1600px?","opsi":["400px di ponsel, dan 1440px di desktop.","360px (90% dari 400px) di ponsel, dan 1000px di desktop.","1000px di ponsel, dan 90% di desktop.","360px di kedua layar tersebut."],"benar":1,"penjelasan":"Fungsi min() selalu memilih nilai terkecil dari daftar argumennya: - Pada layar 400px: 90% adalah 360px. Karena 360px < 1000px, maka dipilih 360px. - Pada layar 1600px: 90% adalah 1440px. Karena 1000px < 1440px, maka lebarnya dibatasi pada 1000px."}
    ]
},
{
    id: 5,
    kategori: "2 · Tata Letak",
    judul: "Aliran Dokumen Normal, display, position, dan Stacking Context (z-index)",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["display","position","z-index"],
    ringkas: "Menguasai perbedaan perilaku kotak block, inline, dan inline-block, lima mode position (static, relative, absolute, fixed, sticky), properti logis inset, serta cara kerja stacking context pada z-index.",
    isi: `
<h2>1. Aliran Normal (<em>Normal Flow</em>) dan Properti <code>display</code></h2>
<p>Sebelum Anda menulis aturan tata letak apa pun, peramban menyusun elemen menggunakan <strong>Normal Flow</strong>:</p>
<ul><li><strong>Elemen <code>display: block</code></strong> (<code>&lt;div&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;h1&gt;</code>–<code>&lt;h6&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;ul&gt;</code>):<ul><li>Selalu memulai baris baru (tersusun vertikal dari atas ke bawah).</li><li>Lebarnya secara bawaan merentang memenuhi ruang horizontal induknya (<code>100%</code>).</li><li>Menghormati properti <code>width</code>, <code>height</code>, <code>margin</code>, dan <code>padding</code> di keempat sisi.</li></ul></li><li><strong>Elemen <code>display: inline</code></strong> (<code>&lt;span&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;em&gt;</code>, <code>&lt;code&gt;</code>):<ul><li>Mengalir berdampingan di dalam satu baris kalimat dan hanya memakan lebar sesuai isi teksnya.</li><li><strong>TIDAK menghormati properti <code>width</code> dan <code>height</code>!</strong></li><li>Margin dan padding vertikal (<code>top</code> dan <code>bottom</code>) tidak akan mendorong baris teks di atas atau di bawahnya (hanya <code>margin-inline</code> dan <code>padding-inline</code> yang mendorong elemen tetangga di kiri/kanannya).</li></ul></li><li><strong>Elemen <code>display: inline-block</code>:</strong><ul><li>Mengalir sebaris seperti elemen <code>inline</code>, tetapi <strong>menghormati <code>width</code>, <code>height</code>, <code>padding</code>, dan <code>margin</code> vertikal</strong> layaknya elemen <code>block</code>. Sangat cocok untuk lencana (<em>badge</em>) atau tombol di tengah kalimat.</li></ul></li></ul>
<h2>2. Lima Mode <code>position</code> di CSS</h2>
<p>Properti <code>position</code> memungkinkan Anda mengeluarkan elemen dari aliran normal untuk menaruhnya di lokasi tertentu, menempelkannya di pojok kartu, atau menguncinya di layar saat halaman digulir:</p>
<table><thead><tr><th>Nilai <code>position</code></th><th>Apakah Tetap Mengambil Ruang di Aliran Normal?</th><th>Titik Acuan Koordinat (<code>top</code>/<code>right</code>/<code>bottom</code>/<code>left</code> atau <code>inset</code>)</th></tr></thead><tbody><tr><td><strong><code>static</code></strong> (bawaan)</td><td><strong>Ya</strong></td><td>Mengabaikan <code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code>, <code>inset</code>, dan <code>z-index</code>.</td></tr><tr><td><strong><code>relative</code></strong></td><td><strong>Ya</strong> (ruang aslinya tetap terjaga)</td><td>Mengacu pada <strong>posisi aslinya sendiri</strong>. Sering dipakai bukan untuk digeser, melainkan untuk menjadi **jangkar acuan (<em>containing block</em>)** bagi anak yang memiliki <code>position: absolute</code>!</td></tr><tr><td><strong><code>absolute</code></strong></td><td><strong>Tidak</strong> (dicabut dari aliran normal)</td><td>Mengacu pada <strong>leluhur terdekat yang memiliki <code>position</code> selain <code>static</code></strong> (mis. <code>relative</code>, <code>fixed</code>, <code>sticky</code>). Jika tidak ada leluhur yang diposisikan, ia mengacu ke seluruh dokumen (<code>&lt;html&gt;</code>)!</td></tr><tr><td><strong><code>fixed</code></strong></td><td><strong>Tidak</strong> (dicabut dari aliran normal)</td><td>Mengacu langsung pada **jendela layar (<em>viewport</em>)** peramban (kecuali leluhurnya memiliki <code>transform</code>, <code>filter</code>, atau <code>perspective</code>). Tetap diam saat halaman digulir.</td></tr><tr><td><strong><code>sticky</code></strong></td><td><strong>Ya</strong> (mengalir normal sampai menyentuh batas gulir)</td><td>Mengalir seperti <code>relative</code> hingga mencapai ambang batas (mis. <code>top: 0</code>), lalu menempel seperti <code>fixed</code> <strong>di dalam batas wadah induknya</strong>.</td></tr></tbody></table>
<h3>Pola Klasik: Induk <code>relative</code> + Anak <code>absolute</code></h3>
<pre>.kartu-kelas {
  /* Menjadi jangkar batas koordinat bagi .lencana-baru */
  position: relative;
  padding: 1.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
}

.lencana-baru {
  position: absolute;
  /* Menggunakan properti logis: 0.75rem dari atas dan 0.75rem dari kanan */
  inset-block-start: 0.75rem;
  inset-inline-end: 0.75rem;
  background-color: #dcfce7;
  color: #166534;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
}</pre>
<h3>Properti Singkatan <code>inset</code></h3>
<p>Daripada menulis empat baris <code>top: 0; right: 0; bottom: 0; left: 0;</code> untuk membuat lapisan penutup (<em>overlay</em>) penuh, gunakan properti <strong><code>inset</code></strong> (status <strong>Baseline Widely Available</strong>):</p>
<pre>.lapisan-penutup {
  position: fixed;
  inset: 0; /* Setara dengan top: 0; right: 0; bottom: 0; left: 0; */
  background-color: rgb(0 0 0 / 0.5);
}</pre>
<h2>3. Mengapa <code>position: sticky</code> Saya Tidak Mau Menempel?</h2>
<p>Ini adalah salah satu masalah debugging CSS yang paling sering ditanyakan. Agar <code>position: sticky</code> bekerja, <strong>tiga syarat mutlak</strong> ini harus terpenuhi:</p>
<ol><li><strong>Wajib menentukan minimal satu nilai ambang batas:</strong> Misalnya <code>top: 0</code> (atau <code>inset-block-start: 0</code>). Tanpa <code>top</code>/<code>bottom</code>/<code>left</code>/<code>right</code>, elemen tidak tahu di titik mana ia harus mulai menempel!</li><li><strong>Wadah induknya harus memiliki ruang untuk digulir:</strong> Elemen <code>sticky</code> tidak pernah bisa keluar dari batas kotak elemen induknya. Jika elemen <code>sticky</code> adalah satu-satunya anak di dalam <code>&lt;div&gt;</code> yang tingginya sama persis dengan elemen <code>sticky</code> tersebut, maka tidak ada ruang baginya untuk menempel.</li><li><strong>Tidak boleh ada leluhur yang memasang <code>overflow: hidden</code>, <code>overflow: auto</code>, atau <code>overflow: scroll</code>:</strong> Jika salah satu pembungkus di atasnya memiliki <code>overflow: hidden</code>, elemen <code>sticky</code> akan kehilangan acuan gulir jendela utama! <em>(Tips: Jika Anda terpaksa memotong luapan horizontal pada wadah induk, gunakan <strong><code>overflow-x: clip</code></strong> alih-alih <code>overflow-x: hidden</code> karena <code>clip</code> tidak merusak <code>position: sticky</code>!)</em>.</li></ol>
<h2>4. <code>z-index</code> dan Misteri <em>Stacking Context</em></h2>
<p>Banyak pengembang kebingungan ketika mereka memberi <code>z-index: 99999</code> pada sebuah elemen, tetapi elemen tersebut tetap tertutup oleh elemen lain yang hanya memiliki <code>z-index: 2</code>. Mengapa demikian?</p>
<p>Jawabannya adalah <strong>Stacking Context (Konteks Tumpukan)</strong>:</p>
<ul><li>Nilai <code>z-index</code> **hanya dibandingkan di antara elemen-elemen yang berada di dalam <em>Stacking Context</em> yang sama**.</li><li>Bayangkan <em>Stacking Context</em> seperti nomor lantai gedung (<code>Lantai 1</code>, <code>Lantai 2</code>), dan <code>z-index</code> anak di dalamnya seperti tinggi meja di dalam lantai tersebut (<code>Meja 99999</code>). Setiggi apa pun meja Anda di <strong>Lantai 1</strong> (<code>z-index: 99999</code>), meja itu tidak akan pernah bisa berada di atas karpet tipis yang berada di <strong>Lantai 2</strong> (<code>z-index: 2</code>)!</li></ul>
<pre>Gedung Halaman Web (Root Stacking Context)
├── Header Navigasi (position: sticky; z-index: 10)  --&gt; &quot;Lantai 10&quot;
└── Kontainer Artikel (position: relative; z-index: 1) --&gt; &quot;Lantai 1&quot;
    └── Tooltip di dalam Artikel (position: absolute; z-index: 99999)
        (Tetap berada di dalam Lantai 1! Akan selalu tertutup oleh Header di Lantai 10!)</pre>
<h3>Hal-Hal yang Menciptakan <em>Stacking Context</em> Baru:</h3>
<p>Sebuah elemen otomatis membentuk &quot;lantai&quot; (<em>stacking context</em>) baru yang mengurung seluruh <code>z-index</code> anak-anaknya apabila elemen tersebut memiliki salah satu dari:</p>
<ol><li><code>position: relative</code> atau <code>absolute</code> yang disertai <code>z-index</code> selain <code>auto</code>; sedangkan <code>position: fixed</code> dan <code>position: sticky</code> selalu membentuk <em>stacking context</em> baru, bahkan ketika <code>z-index</code>-nya <code>auto</code>.</li><li>Anak dari Flexbox atau CSS Grid yang diberi <code>z-index</code> selain <code>auto</code>.</li><li>Nilai <code>opacity</code> kurang dari <code>1</code> (mis. <code>opacity: 0.99</code>).</li><li>Properti <code>transform</code>, <code>filter</code>, <code>backdrop-filter</code>, atau <code>perspective</code> selain <code>none</code>.</li><li>Properti <strong><code>isolation: isolate</code></strong> — cara paling bersih dan disengaja untuk mengurung <code>z-index</code> internal sebuah komponen tanpa efek samping visual!</li></ol>
<pre>/* Mengisolasi tumpukan z-index di dalam komponen kartu agar tidak bocor keluar */
.komponen-kartu {
  isolation: isolate;
}</pre>
<h2>Latihan Praktik: Membuat Bilah Navigasi Sticky dan Kartu Berlabel</h2>
<p>Buatlah berkas <code>posisi-tumpukan.html</code> dan <code>posisi.css</code> yang berisi:</p>
<ol><li>Sebuah <code>&lt;header&gt;</code> dengan <code>position: sticky; inset-block-start: 0; z-index: 20;</code> yang tetap menempel di bagian atas saat halaman digulir.</li><li>Beberapa komponen <code>.kartu</code> dengan <code>position: relative</code> dan <code>isolation: isolate</code> yang di pojok kanan atasnya memiliki lencana status <code>position: absolute</code>.</li><li>Pastikan ketika halaman digulir, lencana <code>position: absolute</code> milik kartu berjalan masuk di <strong>bawah</strong> <code>&lt;header&gt;</code> sticky, bukan menembus di atasnya!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout" rel="noopener">CSS layout — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS" rel="noopener">CSS: Cascading Style Sheets — MDN Web Docs</a></li><li><a href="https://web.dev/learn/css" rel="noopener">Learn CSS — web.dev</a></li></ul></div>
`,
    perintah: ["z-index","sticky","top","bottom","position","inset"],
    kuis: [
        {"tanya":"Apa yang terjadi jika Anda memberikan position: absolute; top: 10px; right: 10px; pada sebuah elemen .lencana, tetapi tidak ada satu pun elemen induk atau leluhurnya yang memiliki properti position (semua induknya masih position: static)?","opsi":["Properti position: absolute diabaikan oleh peramban.","Elemen .lencana akan memosisikan dirinya mengacu pada initial containing block (pojok kanan atas halaman dokumen <html> secara keseluruhan), bukan di pojok kartu induknya.","Elemen .lencana otomatis berubah menjadi position: fixed.","Elemen induk terdekatnya otomatis diubah menjadi position: relative oleh peramban."],"benar":1,"penjelasan":"Elemen dengan position: absolute mencari leluhur terdekat yang memiliki nilai position selain static sebagai acuan koordinatnya. Jika tidak ditemukan hingga ke puncak pohon DOM, ia akan mengacu pada initial containing block (area dokumen <html>)."},
        {"tanya":"Sebuah elemen <aside> diberi position: sticky; top: 1rem;, tetapi saat halaman digulir, elemen tersebut ikut tergulir hilang ke atas dan tidak menempel. Manakah penyebab yang paling mungkin?","opsi":["Elemen <aside> tidak diberi z-index: 9999.","Salah satu elemen pembungkus (induk/leluhur) dari <aside> memiliki properti overflow: hidden atau overflow: auto, atau tinggi elemen <aside> sudah sama dengan tinggi kontainer induknya.","position: sticky hanya bekerja pada elemen <header>.","Nilai top pada position: sticky wajib ditulis dalam satuan px, tidak boleh rem."],"benar":1,"penjelasan":"Properti overflow: hidden atau overflow: auto pada elemen leluhur mengubah konteks gulir (scroll container), sehingga elemen sticky tidak lagi dapat mengacu pada guliran jendela utama. Selain itu, elemen sticky hanya dapat bergerak menempel di sepanjang ruang sisa di dalam kotak induknya."},
        {"tanya":"Properti CSS manakah yang secara khusus dirancang untuk menciptakan Stacking Context baru pada sebuah komponen tanpa perlu menambahkan position, z-index, atau transform?","opsi":["display: inline-block","isolation: isolate","overflow: visible","box-sizing: border-box"],"benar":1,"penjelasan":"Deklarasi isolation: isolate memiliki satu tugas tunggal yang bersih: membentuk stacking context baru pada elemen tersebut sehingga semua nilai z-index pada elemen anak di dalamnya terkurung rapi dan tidak berbenturan dengan elemen di luar komponen."}
    ]
},
{
    id: 6,
    kategori: "2 · Tata Letak",
    judul: "Tata Letak Satu Dimensi dengan Flexbox",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["gap","display: flex","flex: 1"],
    ringkas: "Menguasai model Flexible Box Layout (Flexbox) melalui konsep dua poros (Main Axis dan Cross Axis), perataan dan distribusi ruang, properti gap, perhitungan flex-grow, flex-shrink, dan flex-basis, serta pola antarmuka nyata.",
    isi: `
<h2>Kapan Menggunakan Flexbox?</h2>
<p>**Flexbox (<em>Flexible Box Layout</em>)<strong> dirancang untuk mengatur tata letak dalam </strong>satu dimensi pada satu waktu**—baik sebagai satu baris horizontal (<code>row</code>) maupun satu kolom vertikal (<code>column</code>).</p>
<p>Gunakan Flexbox ketika Anda ingin:</p>
<ul><li>Menyusun bilah navigasi (logo di kiri, deretan menu di kanan).</li><li>Menyejajarkan ikon dengan teks di dalam tombol atau lencana.</li><li>Membagi ruang sisa di antara sekumpulan komponen yang ukurannya dinamis.</li><li>Memaksa kaki kartu (<em>card footer</em>) selalu menempel rata di bagian paling bawah kartu meskipun panjang teks tiap kartu berbeda.</li></ul>
<p>Begitu Anda menulis <strong><code>display: flex</code></strong> pada sebuah elemen:</p>
<ol><li>Elemen tersebut menjadi <strong>Flex Container</strong> (wadah flex).</li><li>Seluruh **anak langsung (<em>direct children</em>)<strong> di dalamnya otomatis menjadi </strong>Flex Items**. (Cucu di dalam anak tidak ikut menjadi flex item kecuali anaknya juga diberi <code>display: flex</code>).</li></ol>
<h2>1. Memahami Dua Poros Flexbox: <em>Main Axis</em> dan <em>Cross Axis</em></h2>
<p>Kunci utama agar Anda tidak pernah bingung antara <code>justify-content</code> dan <code>align-items</code> adalah memahami bahwa Flexbox bekerja berdasarkan <strong>dua poros yang saling tegak lurus</strong>:</p>
<pre>A. Saat flex-direction: row (Bawaan):
   Main Axis (Poros Utama)  ===&gt; Horizontal (Kiri ke Kanan)
   Cross Axis (Poros Silang) ===&gt; Vertikal (Atas ke Bawah)

   +-------------------------------------------------------+
   |  [ Item 1 ]     [ Item 2 ]     [ Item 3 ]             |  &lt;-- justify-content mengatur
   |                                                       |      sepanjang Main Axis (Horizontal)
   +-------------------------------------------------------+
         ^
         |-- align-items mengatur sepanjang Cross Axis (Vertikal)


B. Saat flex-direction: column:
   Main Axis (Poros Utama)  ===&gt; Vertikal (Atas ke Bawah)
   Cross Axis (Poros Silang) ===&gt; Horizontal (Kiri ke Kanan)</pre>
<h3>Aturan Menghafal Perataan di Flexbox:</h3>
<ul><li><strong><code>justify-content</code></strong> SELALU mengatur distribusi di sepanjang <strong>Main Axis (Poros Utama)</strong>:<ul><li><code>flex-start</code> (awal poros), <code>center</code> (tengah), <code>flex-end</code> (ujung poros)</li><li><code>space-between</code> (item pertama dan terakhir menempel di ujung, ruang kosong dibagi rata di tengah)</li><li><code>space-around</code> / <code>space-evenly</code></li></ul></li><li><strong><code>align-items</code></strong> SELALU mengatur perataan di sepanjang <strong>Cross Axis (Poros Silang)</strong>:<ul><li><code>stretch</code> (bawaan: merentangkan tinggi item agar sama tinggi dengan kontainer)</li><li><code>center</code> (rata tengah secara tegak lurus — sangat sering dipakai untuk menyejajarkan ikon dan teks!)</li><li><code>flex-start</code>, <code>flex-end</code>, <code>baseline</code> (sejajar garis dasar huruf teks).</li></ul></li></ul>
<h2>2. Membungkus Baris (<code>flex-wrap</code>) dan Mengatur Jarak (<code>gap</code>)</h2>
<p>Secara bawaan, Flexbox berusaha memaksakan semua anak masuk ke dalam satu baris tunggal (<code>flex-wrap: nowrap</code>), bahkan jika harus menyempitkan item-item tersebut. Jika Anda ingin item turun ke baris baru saat ruang tidak lagi cukup, tambahkan <strong><code>flex-wrap: wrap</code></strong>.</p>
<p>Untuk memberi jarak antar-item di dalam Flexbox, <strong>jangan lagi menggunakan trik margin negatif lama</strong>; gunakan properti <strong><code>gap</code></strong> (serta <code>row-gap</code> dan <code>column-gap</code>, berstatus <strong>Baseline Widely Available</strong>):</p>
<pre>.daftar-tag {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem; /* 0.5rem jarak antar-baris, 0.75rem jarak antar-kolom */
  align-items: center;
}</pre>
<p>Keunggulan <code>gap</code> dibandingkan <code>margin</code>: jarak <code>gap</code> <strong>hanya disisipkan di antara item yang bertetangga</strong>, tidak pernah bocor menambahkan jarak ekstra di tepi luar kontainer!</p>
<h2>3. Mengendalikan Ukuran Flex Item: <code>flex-grow</code>, <code>flex-shrink</code>, dan <code>flex-basis</code></h2>
<p>Ketiga properti ini dipasang pada <strong>anak (Flex Item)</strong>, bukan pada wadah induknya, dan hampir selalu ditulis menggunakan singkatan <strong><code>flex: &lt;grow&gt; &lt;shrink&gt; &lt;basis&gt;</code></strong>:</p>
<ol><li><strong><code>flex-basis</code> (Ukuran Awal Ideal):</strong> Ukuran awal item di sepanjang <em>Main Axis</em> sebelum ruang kosong dibagi atau ruang sempit dipangkas (bawaannya <code>auto</code>, yaitu mengikuti <code>width</code>/<code>height</code> atau isi kontennya).</li><li><strong><code>flex-grow</code> (Faktor Tumbuh):</strong> Menentukan apakah item boleh membesar menyerap ruang kosong yang tersisa di dalam kontainer (bawaannya <code>0</code> = tidak ikut membesar).</li><li><strong><code>flex-shrink</code> (Faktor Susut):</strong> Menentukan apakah item boleh menyusut ketika ruang kontainer lebih sempit dari jumlah ukuran item (bawaannya <code>1</code> = boleh menyusut).</li></ol>
<h3>Empat Nilai Singkatan <code>flex</code> yang Wajib Anda Hafal</h3>
<table><thead><tr><th>Deklarasi Singkatan</th><th>Ekivalen Lengkap</th><th>Perilaku Praktis</th></tr></thead><tbody><tr><td><code>flex: initial</code> (bawaan)</td><td><code>flex: 0 1 auto</code></td><td>Ukuran mengikuti kontennya; tidak tumbuh jika ada ruang sisa, tetapi mau menyusut jika layar sempit.</td></tr><tr><td><strong><code>flex: 1</code></strong></td><td><code>flex: 1 1 0%</code></td><td>Semua item dengan <code>flex: 1</code> berbagi ruang secara <strong>sama rata</strong> dari titik dasar <code>0%</code> tanpa peduli panjang pendek teks awalnya.</td></tr><tr><td><strong><code>flex: auto</code></strong></td><td><code>flex: 1 1 auto</code></td><td>Item ikut tumbuh menyerap ruang sisa, namun ukuran dasarnya tetap mempertimbangkan panjang konten masing-masing.</td></tr><tr><td><strong><code>flex: none</code></strong></td><td><code>flex: 0 0 auto</code></td><td>Kaku: ukuran mengikuti konten/width, <strong>dilarang tumbuh dan dilarang menyusut</strong> (wajib dipasang pada ikon atau avatar agar tidak gepeng tertekan teks panjang!).</td></tr></tbody></table>
<h2>4. Tiga Pola Komponen Dunia Nyata dengan Flexbox</h2>
<pre>/* Pola 1: Bilah Navigasi (Logo dan Menu di kiri, Tombol Masuk mendorong ke ujung kanan) */
.navbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.navbar .tombol-masuk {
  /* margin-inline-start: auto pada flex item akan menyerap seluruh ruang kosong di kirinya! */
  margin-inline-start: auto;
}

/* Pola 2: Kartu dengan Tinggi Seragam dan Tombol Selalu Rata di Dasar Bawah */
.kartu {
  display: flex;
  flex-direction: column;
}
.kartu .kaki-kartu {
  margin-block-start: auto; /* Mendorong kaki kartu ke ujung paling bawah */
  padding-block-start: 1rem;
}

/* Pola 3: Mencegah Ikon SVG Gepeng di Samping Teks Panjang */
.item-fitur {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}
.item-fitur svg {
  flex-shrink: 0; /* Ikon tidak akan pernah menyusut meskipun teks di sebelahnya panjang */
}</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Jebakan Klasik Flexbox: Teks Panjang atau <code>&lt;pre&gt;</code> yang Merusak Lebar Flex Item</div><p>Secara bawaan, setiap flex item memiliki nilai <code>min-width: auto</code> (tidak mau menyusut lebih kecil dari kata terpanjang atau blok <code>&lt;pre&gt;</code> di dalamnya). Akibatnya, jika di dalam kolom <code>flex: 1</code> terdapat <code>&lt;pre&gt;&lt;code&gt;</code> yang lebar atau teks dengan <code>text-overflow: ellipsis</code>, kolom tersebut justru membengkak menembus layar! <strong>Solusinya:</strong> Tambahkan <strong><code>min-width: 0</code></strong> (atau <code>min-inline-size: 0</code>) pada flex item tersebut agar ia diizinkan menyusut mengikuti batas kontainernya.</p></div>
<h2>Latihan Praktik: Membangun Bilah Navigasi dan Deretan Kartu Fitur</h2>
<p>Buatlah berkas <code>flexbox-komponen.html</code> dan <code>flexbox.css</code> yang berisi:</p>
<ol><li>Sebuah <code>&lt;header class=&quot;navbar&quot;&gt;</code> yang menyejajarkan logo di kiri, tautan navigasi di tengah, dan tombol aksi di ujung kanan menggunakan <code>display: flex</code>, <code>align-items: center</code>, <code>gap</code>, dan <code>margin-inline-start: auto</code>.</li><li>Tiga kartu fitur berdampingan di mana salah satu kartu memiliki 4 baris paragraf sementara dua kartu lainnya hanya 1 baris paragraf, namun tombol <em>&quot;Pelajari Modul&quot;</em> di bagian bawah ketiga kartu tetap sejajar rata di garis dasar yang sama menggunakan <code>flex-direction: column</code> dan <code>margin-block-start: auto</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Basic_concepts" rel="noopener">Basic concepts of flexbox — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout/Use_cases" rel="noopener">Typical use cases of flexbox — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Flexible_box_layout" rel="noopener">CSS flexible box layout — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["gap","display: flex","flex: 1","justify-content","align-items","flex-start"],
    kuis: [
        {"tanya":"Ketika sebuah kontainer memiliki aturan display: flex; flex-direction: column;, properti manakah yang digunakan untuk meratakan item-item di dalamnya ke tengah secara horizontal?","opsi":["justify-content: center","align-items: center","text-align: center","vertical-align: middle"],"benar":1,"penjelasan":"Ketika flex-direction diubah menjadi column, poros utama (Main Axis) menjadi vertikal (atas ke bawah) dan poros silang (Cross Axis) menjadi horizontal (kiri ke kanan). Karena align-items selalu bekerja pada Cross Axis, maka align-items: center yang akan meratakan item secara horizontal."},
        {"tanya":"Di dalam sebuah komponen notifikasi display: flex, terdapat sebuah ikon <svg> berukuran 24×24 piksel di sebelah kiri dan paragraf pesan panjang di sebelah kanan. Di layar ponsel yang sempit, ikon <svg> tersebut tampak tergencet menjadi elips sempit. Deklarasi CSS apakah yang harus ditambahkan pada <svg> tersebut?","opsi":["flex-grow: 1","flex-shrink: 0 (atau flex: none)","align-self: stretch","flex-wrap: wrap"],"benar":1,"penjelasan":"Nilai bawaan flex-shrink pada setiap flex item adalah 1, yang berarti peramban diizinkan menyusutkan semua anak (termasuk ikon) saat ruang horizontal kurang. Memberikan flex-shrink: 0 atau flex: none pada ikon melarang peramban menyusutkan lebar ikon tersebut."},
        {"tanya":"Apa penyebab sebuah flex item dengan flex: 1 menolak menyusut dan justru meluber menembus batas kontainernya ketika di dalamnya terdapat elemen <pre> atau kata URL yang sangat panjang?","opsi":["Karena Flexbox tidak mengizinkan elemen <pre> sebagai anak.","Karena nilai bawaan min-width pada flex item adalah auto (mengikuti lebar minimum intrinsik kontennya), sehingga perlu diberi min-width: 0 (atau min-inline-size: 0) agar diizinkan menyusut.","Karena properti gap terlalu besar.","Karena kontainer induk belum diberi position: relative."],"benar":1,"penjelasan":"Spesifikasi Flexbox menetapkan min-width: auto pada flex item demi mencegah teks terpotong secara tidak sengaja. Namun, jika di dalam item terdapat elemen dengan overflow-x: auto (seperti <pre>) atau text-overflow: ellipsis, Anda harus menetapkan min-width: 0 pada flex item agar batas lebarnya dipatuhi."}
    ]
},
{
    id: 7,
    kategori: "2 · Tata Letak",
    judul: "Tata Letak Dua Dimensi dengan CSS Grid dan subgrid",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["subgrid","auto-fit","auto-fill"],
    ringkas: "Merancang tata letak dua dimensi (baris dan kolom sekaligus) menggunakan CSS Grid, satuan fraksi (fr), minmax(), grid responsif otomatis (auto-fit vs auto-fill), grid-template-areas, hingga penyelarasan lintas kartu dengan subgrid.",
    isi: `
<h2>Perbedaan Filosofi CSS Grid vs Flexbox</h2>
<p>Banyak pemula bertanya: <em>&quot;Apakah CSS Grid menggantikan Flexbox?&quot;</em> Jawabannya: <strong>Tidak. Keduanya saling melengkapi.</strong></p>
<ul><li>**Flexbox bersifat <em>Content-First</em> (Satu Dimensi):** Anda membiarkan ukuran item menentukan bagaimana ruang dibagi dalam satu baris atau satu kolom.</li><li>**CSS Grid bersifat <em>Layout-First</em> (Dua Dimensi):** Anda mendefinisikan cetak biru kolom dan baris secara bersamaan terlebih dahulu, lalu menempatkan elemen-elemen anak secara presisi ke dalam sel atau area kisi tersebut.</li></ul>
<pre>Flexbox (Satu Dimensi - Tiap baris independen):
+---------------+ +---------------+ +---------------+
| Kartu 1       | | Kartu 2       | | Kartu 3       |
+---------------+ +---------------+ +---------------+
+-----------------------+ +-------------------------+
| Kartu 4 (Melebar)     | | Kartu 5 (Melebar)       |
+-----------------------+ +-------------------------+

CSS Grid (Dua Dimensi - Kolom dan baris terkunci rapi):
+---------------+ +---------------+ +---------------+
| Kartu 1       | | Kartu 2       | | Kartu 3       |
+---------------+ +---------------+ +---------------+
+---------------+ +---------------+ . . . . . . . . .
| Kartu 4       | | Kartu 5       | . (Kolom ke-3)  .
+---------------+ +---------------+ . . . . . . . . .</pre>
<h2>1. Mendefinisikan Jalur Grid: <code>fr</code>, <code>repeat()</code>, dan <code>minmax()</code></h2>
<p>Ketika Anda menetapkan <code>display: grid</code> pada wadah induk, Anda mendefinisikan kolom dengan <code>grid-template-columns</code> dan baris dengan <code>grid-template-rows</code>.</p>
<p>Satuan baru yang khusus hadir untuk CSS Grid adalah **<code>fr</code> (<em>fractional unit</em>)<strong>, yang mewakili bagian dari </strong>ruang kosong yang tersedia** di dalam kontainer grid (setelah dikurangi <code>gap</code> dan kolom berukuran tetap):</p>
<pre>.tata-letak-utama {
  display: grid;
  /* Kolom 1: lebar tetap 260px (sidebar)
     Kolom 2: mengambil 2 bagian ruang sisa (konten artikel)
     Kolom 3: mengambil 1 bagian ruang sisa (daftar isi kanan) */
  grid-template-columns: 260px 2fr 1fr;
  gap: 1.5rem;
}</pre>
<h3>Mengapa <code>minmax(0, 1fr)</code> Penting?</h3>
<p>Sama seperti Flexbox, nilai <code>1fr</code> sebenarnya adalah singkatan dari <code>minmax(auto, 1fr)</code>. Artinya, jika di dalam kolom <code>1fr</code> terdapat tabel lebar atau blok kode <code>&lt;pre&gt;</code>, kolom tersebut bisa membengkak melebihi proporsinya. Jika Anda ingin kolom tetap patuh pada ukurannya dan membiarkan <code>&lt;pre&gt;</code> di dalamnya yang memunculkan <em>scrollbar</em>, gunakan <strong><code>minmax(0, 1fr)</code></strong>!</p>
<h2>2. Pola Paling Populer: Grid Kartu Responsif Tanpa <code>@media</code> (<code>auto-fit</code> vs <code>auto-fill</code>)</h2>
<p>Dengan menggabungkan <code>repeat()</code>, <code>auto-fit</code> (atau <code>auto-fill</code>), dan <code>minmax()</code>, Anda dapat membuat kisi kartu katalog yang otomatis menambah atau mengurangi jumlah kolom sesuai lebar layar <strong>tanpa menulis satu pun <code>@media</code> query</strong>:</p>
<pre>.katalog-kelas {
  display: grid;
  /* Buat kolom sebanyak mungkin yang muat di layar;
     setiap kolom minimal selebar 280px (atau 100% jika layar &lt; 280px),
     dan berbagi ruang sisa secara merata (1fr) */
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 1.5rem;
}</pre>
<h3>Apa Bedanya <code>auto-fit</code> dan <code>auto-fill</code>?</h3>
<p>Perbedaannya terlihat ketika jumlah kartu sedikit (misalnya hanya ada 2 kartu di layar monitor lebar yang sebenarnya muat 4 kolom):</p>
<ul><li><strong><code>auto-fill</code>:</strong> Tetap mempertahankan 4 slot kolom (2 kolom terisi kartu, dan 2 kolom di sebelah kanannya dibiarkan kosong berukuran <code>1fr</code>). Sangat cocok untuk katalog kartu agar lebar satu kartu tidak melar terlalu lebar saat hasil pencarian hanya 1 atau 2 item!</li><li><strong><code>auto-fit</code>:</strong> Melipat (<em>collapse</em>) kolom kosong yang tidak terisi menjadi <code>0px</code>, sehingga 2 kartu yang ada akan melar membagi seluruh lebar kontainer menjadi masing-masing 50%.</li></ul>
<h2>3. Menempatkan Elemen dengan Nomor Garis dan <code>grid-template-areas</code></h2>
<h3>A. Penempatan Berdasarkan Garis Grid (<em>Grid Lines</em>)</h3>
<p>Sebuah grid dengan <strong>3 kolom</strong> memiliki <strong>4 garis vertikal</strong> (bernomor <code>1</code>, <code>2</code>, <code>3</code>, <code>4</code> dari kiri ke kanan, atau <code>-1</code> untuk garis paling ujung kanan):</p>
<pre>Garis 1         Garis 2         Garis 3         Garis 4 (atau -1)
  |   Kolom 1     |   Kolom 2     |   Kolom 3     |
  +---------------+---------------+---------------+</pre>
<pre>.kartu-unggulan {
  /* Merentang sebanyak 2 kolom dari posisi tempat ia berada */
  grid-column: span 2;
}

.spanduk-penuh {
  /* Merentang dari garis paling kiri (1) sampai garis paling ujung kanan (-1) */
  grid-column: 1 / -1;
}</pre>
<h3>B. Penempatan Visual dengan <code>grid-template-areas</code></h3>
<p>Untuk merancang struktur halaman secara keseluruhan, <code>grid-template-areas</code> memungkinkan Anda &quot;menggambar&quot; denah tata letak langsung dengan teks di dalam CSS:</p>
<pre>.halaman-dasbor {
  display: grid;
  min-block-size: 100dvh;
  grid-template-columns: 240px minmax(0, 1fr);
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    &quot;navigasi kepala&quot;
    &quot;navigasi utama&quot;
    &quot;navigasi kaki&quot;;
}

.halaman-dasbor &gt; header { grid-area: kepala; }
.halaman-dasbor &gt; nav    { grid-area: navigasi; }
.halaman-dasbor &gt; main   { grid-area: utama; }
.halaman-dasbor &gt; footer { grid-area: kaki; }</pre>
<h2>4. Menyelaraskan Isi Antar-Kartu dengan <code>subgrid</code></h2>
<p>Pernahkah Anda membuat deretan kartu produk di mana setiap kartu memiliki: (1) Judul, (2) Deskripsi, dan (3) Harga + Tombol, tetapi karena judul Kartu A terdiri dari 3 baris sedangkan judul Kartu B hanya 1 baris, posisi kotak Harga dan Deskripsi antar-kartu menjadi tidak sejajar?</p>
<p>Sejak September 2023, <strong><code>subgrid</code></strong> berstatus <strong>Baseline Widely Available</strong> di semua peramban utama! Dengan <code>grid-template-rows: subgrid</code>, anak di dalam kartu dapat langsung menginduk dan mengunci barisnya ke jalur grid utama milik kontainer katalog:</p>
<pre>.katalog-produk {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.kartu-produk {
  display: grid;
  /* Setiap kartu meminjam 3 jalur baris (Judul, Isi, Kaki) dari grid induk */
  grid-row: span 3;
  grid-template-rows: subgrid;
  gap: 0.75rem;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
}</pre>
<p>Hasilnya: semua judul kartu, semua paragraf deskripsi, dan semua kaki kartu yang berada di baris yang sama dijamin sejajar sempurna secara horizontal!</p>
<h2>Latihan Praktik: Membangun Katalog Kelas Kodeloka dengan <code>subgrid</code></h2>
<p>Buatlah berkas <code>grid-katalog.html</code> dan <code>grid.css</code> yang menampilkan 4 kartu kelas (HTML, CSS, JavaScript, PHP):</p>
<ol><li>Kontainer <code>.katalog</code> menggunakan <code>repeat(auto-fill, minmax(min(100%, 260px), 1fr))</code>.</li><li>Setiap <code>.kartu</code> berisi tiga elemen anak (<code>&lt;h3&gt;</code> judul dengan panjang teks yang sengaja dibuat berbeda-beda, <code>&lt;p&gt;</code> deskripsi, dan <code>&lt;footer&gt;</code> jumlah modul).</li><li>Gunakan <code>grid-row: span 3</code> dan <code>grid-template-rows: subgrid</code> pada <code>.kartu</code> agar ketiga bagian di dalam seluruh kartu tampak sejajar rapi.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts" rel="noopener">Basic concepts of grid layout — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Relationship_with_other_layout_methods" rel="noopener">Relationship of grid layout to other layout methods — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Auto-placement" rel="noopener">Auto-placement in grid layout — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Common_grid_layouts" rel="noopener">Realizing common layouts using grids — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["auto-fit","auto-fill","1fr","grid-template-areas","subgrid","fr"],
    kuis: [
        {"tanya":"Sebuah grid memiliki 4 kolom (grid-template-columns: repeat(4, 1fr)). Deklarasi manakah yang membuat sebuah elemen anak merentang penuh dari kolom pertama hingga kolom keempat (ujung paling kanan), bahkan jika suatu saat jumlah kolom di kontainer induk ditambah menjadi 6 kolom?","opsi":["grid-column: 1 / 4;","grid-column: 1 / -1;","grid-column: span 3;","grid-row: 1 / -1;"],"benar":1,"penjelasan":"Garis 1 adalah garis batas paling awal (kiri), sedangkan garis -1 selalu merujuk pada garis batas terakhir dari explicit grid (Garis 5 pada 4 kolom, atau Garis 7 pada 6 kolom). Sementara itu, grid-column: 1 / 4 hanya merentang dari Garis 1 sampai Garis 4 (yaitu baru mencakup 3 kolom)."},
        {"tanya":"Apa perbedaan perilaku antara repeat(auto-fill, minmax(250px, 1fr)) dan repeat(auto-fit, minmax(250px, 1fr)) ketika sebuah wadah selebar 1200px hanya berisi satu buah kartu?","opsi":["Pada auto-fill, kartu tersebut tetap berukuran sekitar 250px–300px (karena 3 kolom kosong lainnya tetap dipertahankan); sedangkan pada auto-fit, kolom-kolom kosong dilipat menjadi 0px sehingga satu kartu tersebut melar memenuhi seluruh lebar 1200px.","auto-fill membuat kartu menjadi dua baris, sedangkan auto-fit menyembunyikan kartu.","auto-fit hanya bekerja di layar ponsel, sedangkan auto-fill hanya di desktop.","Tidak ada perbedaan; keduanya selalu membuat satu kartu melar selebar 1200px."],"benar":0,"penjelasan":"Keduanya sama-sama menyiapkan 4 slot kolom pada lebar 1200px. Namun saat hanya ada 1 item, auto-fill membiarkan 3 slot kolom kosong tetap mengambil ruang 1fr, sementara auto-fit melipat (collapse) kolom kosong menjadi 0px dan membagi seluruh ruang 1fr kepada item yang ada."},
        {"tanya":"Masalah tata letak apa yang diselesaikan oleh grid-template-rows: subgrid pada komponen kartu di dalam sebuah kisi katalog?","opsi":["Mengubah gambar di dalam kartu menjadi hitam-putih secara otomatis.","Memungkinkan elemen-elemen di dalam masing-masing kartu (seperti judul, deskripsi, dan tombol) berbagi jalur baris yang sama dengan kartu-kartu tetangganya, sehingga tinggi bagian judul dan deskripsi antar-kartu sejajar rapi.","Memindahkan kartu ke halaman baru secara otomatis jika lebih dari 10 item.","Menggantikan fungsi atribut alt pada gambar."],"benar":1,"penjelasan":"Tanpa subgrid, grid di dalam sebuah kartu tidak mengetahui berapa tinggi judul pada kartu di sebelahnya. Dengan grid-row: span 3 dan grid-template-rows: subgrid, anak-anak di dalam setiap kartu ikut menggunakan jalur baris milik grid induk sehingga posisinya sejajar sempurna dari kiri ke kanan."}
    ]
},
{
    id: 8,
    kategori: "2 · Tata Letak",
    judul: "Desain Responsif, Sintaks @media Modern, dan Container Queries (@container)",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["@media","@container","container-type: inline-size"],
    ringkas: "Merancang halaman dan komponen yang beradaptasi secara mulus di segala ukuran layar maupun ukuran wadah induknya menggunakan strategi Mobile-First, sintaks rentang @media (width >= ...), aspect-ratio, serta @container queries.",
    isi: `
<h2>Mengapa Halaman Web Harus Bersifat Cair Sejak Awal?</h2>
<p>Sebelum Anda menulis satu baris <code>@media</code> query pun, ketahuilah bahwa dokumen HTML pada dasarnya <strong>sudah responsif secara alami</strong>. Jika Anda membuka berkas HTML murni tanpa CSS di layar jam tangan pintar maupun monitor 4K, teksnya otomatis mengalir menyesuaikan lebar layar tanpa memunculkan bilah gulir horizontal.</p>
<p>Tata letak justru menjadi rusak dan kaku ketika pengembang menuliskan ukuran tetap seperti <code>width: 960px</code> atau <code>height: 400px</code>. Oleh karena itu, prinsip pertama <strong>Responsive Web Design (RWD)</strong> adalah membiarkan tata letak mengalir dengan satuan fleksibel (<code>%</code>, <code>fr</code>, <code>rem</code>, <code>min()</code>, <code>clamp()</code>), lalu menambahkan titik perubahan (<em>breakpoints</em>) hanya saat konten mulai terlihat terlalu sempit atau terlalu renggang.</p>
<h2>1. Pendekatan <em>Mobile-First</em> dan Sintaks Rentang <code>@media</code> Modern</h2>
<p>Dalam pendekatan <strong>Mobile-First</strong>, Anda menulis CSS dasar untuk layar sempit (satu kolom vertikal yang sederhana dan ringan) terlebih dahulu, lalu menggunakan <code>@media</code> untuk menyusun ulang kolom ketika lebar layar semakin luas.</p>
<p>Sejak Media Queries Level 4 (status <strong>Baseline Widely Available</strong> sejak 2023), Anda tidak perlu lagi menulis <code>min-width</code> dan <code>max-width</code> yang sering tumpang tindih pada batas <code>768px</code> vs <code>767.98px</code>. Gunakan <strong>sintaks perbandingan matematika (<code>&gt;=</code>, <code>&lt;=</code>, <code>&lt;</code>, <code>&gt;</code>)</strong> yang jauh lebih jelas:</p>
<pre>/* 1. Gaya dasar (Mobile-first): satu kolom vertikal untuk layar ponsel */
.tata-letak-artikel {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

/* 2. Layar tablet ke atas (lebar &gt;= 48rem atau 768px) */
@media (width &gt;= 48rem) {
  .tata-letak-artikel {
    grid-template-columns: 240px minmax(0, 1fr);
    gap: 2rem;
  }
}

/* 3. Rentang di antara dua ukuran (48rem &lt;= lebar &lt; 75rem) */
@media (48rem &lt;= width &lt; 75rem) {
  .panel-iklan {
    display: none;
  }
}</pre>
<div class="callout info"><div class="callout-judul">💡 Mengapa Menggunakan <code>rem</code> (atau <code>em</code>) pada <code>@media</code> alih-alih <code>px</code>?</div><p>Ketika seorang pengguna memperbesar ukuran huruf bawaan perambannya menjadi <code>24px</code>, penggunaan <code>@media (width &gt;= 48rem)</code> memastikan tata letak otomatis beralih kembali ke mode satu kolom yang lega (di dalam <em>media query</em>, <code>rem</code>/<code>em</code> mengacu pada ukuran huruf bawaan peramban, bukan nilai <code>html { font-size }</code> buatan Anda) sehingga teks besar tidak berdesakan di dalam kolom yang sempit!</p></div>
<h3>Media Queries Berbasis Kemampuan Perangkat dan Preferensi Pengguna</h3>
<p>Selain ukuran layar, <code>@media</code> dapat mendeteksi perangkat penunjuk dan preferensi sistem operasi pengguna:</p>
<ul><li><strong><code>@media (hover: hover) and (pointer: fine)</code>:</strong> Hanya aktif pada perangkat dengan kursor presisi (tetikus/trackpad), sehingga efek <code>:hover</code> tidak &quot;tersangkut&quot; saat disentuh di layar ponsel.</li><li><strong><code>@media (prefers-color-scheme: dark)</code>:</strong> Mendeteksi mode gelap sistem operasi.</li><li><strong><code>@media (prefers-reduced-motion: reduce)</code>:</strong> Mendeteksi pengguna yang sensitif terhadap gerakan/animasi layar.</li></ul>
<h2>2. Mengunci Proporsi Kotak dengan <code>aspect-ratio</code></h2>
<p>Di masa lalu, menjaga agar pembungkus video YouTube (<code>&lt;iframe&gt;</code>) atau kartu foto tetap berproporsi <code>16:9</code> mengharuskan kita menggunakan trik aneh <code>padding-top: 56.25%</code>. Kini cukup gunakan properti <strong><code>aspect-ratio</code></strong> (status <strong>Baseline Widely Available</strong>):</p>
<pre>.pembungkus-video {
  inline-size: 100%;
  aspect-ratio: 16 / 9;
}

.avatar-pengguna {
  inline-size: 3.5rem;
  aspect-ratio: 1 / 1; /* Selalu persegi sempurna */
  object-fit: cover;   /* Memotong gambar dengan rapi tanpa membuat wajah gepeng */
  border-radius: 50%;
}</pre>
<h2>3. Revolusi Komponen Mandiri dengan Container Queries (<code>@container</code>)</h2>
<p>Bayangkan Anda membuat satu komponen <code>.kartu-berita</code>. Di halaman yang sama, komponen <code>.kartu-berita</code> tersebut dipakai di <strong>dua tempat berbeda</strong>:</p>
<ol><li>Di dalam area konten utama yang lebar (<code>800px</code>) — Anda ingin kartu tampil horizontal (gambar di kiri, teks di kanan).</li><li>Di dalam bilah samping (<code>&lt;aside&gt;</code>) yang sempit (<code>280px</code>) — Anda ingin kartu tampil vertikal (gambar di atas, teks di bawah).</li></ol>
<p>Jika Anda menggunakan <code>@media (width &gt;= 600px)</code>, <strong>keduanya akan terpaksa tampil horizontal</strong> karena <code>@media</code> hanya melihat lebar jendela layar peramban secara keseluruhan (<code>1440px</code>), bukan lebar wadah <code>&lt;aside&gt;</code> tempat kartu itu berada!</p>
<p>Solusinya adalah <strong>CSS Container Queries (<code>@container</code>)</strong> (status <strong>Baseline Widely Available</strong> sejak Februari 2023):</p>
<pre>Jendela Layar (Viewport = 1280px)
+-------------------------------------------+ +---------------------+
| Area Utama (.kolom-utama = 860px)         | | Sidebar (280px)     |
| +---------------------------------------+ | | +-----------------+ |
| | .kartu-berita                         | | | | .kartu-berita   | |
| | [Gambar]  Judul &amp; Ringkasan Berita    | | | | [Gambar]        | |
| |           (Tampil 2 kolom karena      | | | | Judul Berita    | |
| |            wadahnya &gt;= 420px)         | | | | (Tampil 1 kolom)| |
| +---------------------------------------+ | | +-----------------+ |
+-------------------------------------------+ +---------------------+</pre>
<h3>Dua Langkah Menggunakan <code>@container</code>:</h3>
<ol><li>**Daftarkan wadah induk sebagai <em>containment context</em>** menggunakan <code>container-type: inline-size</code> (dan opsional beri nama dengan <code>container-name</code>):</li><li><strong>Tulis aturan <code>@container</code></strong> yang memeriksa ukuran wadah induk tersebut!</li></ol>
<pre>/* Langkah 1: Tandai pembungkus kartu sebagai container */
.pembungkus-kartu {
  container-type: inline-size;
  container-name: wadah-kartu;
}

/* Gaya bawaan kartu (saat wadahnya sempit &lt; 420px): tumpuk vertikal */
.kartu-berita {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Langkah 2: Jika lebar .pembungkus-kartu mencapai &gt;= 420px, ubah menjadi 2 kolom! */
@container wadah-kartu (width &gt;= 420px) {
  .kartu-berita {
    grid-template-columns: 180px minmax(0, 1fr);
    align-items: center;
  }
}</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Aturan Penting <code>@container</code></div><p>Sebuah elemen yang diberi <code>container-type: inline-size</code> tidak dapat mengubah gayanya sendiri di dalam blok <code>@container</code> miliknya; yang diubah di dalam <code>@container</code> adalah <strong>elemen anak/keturunan di dalamnya</strong> (itulah sebabnya kita memasang <code>container-type: inline-size</code> pada <code>.pembungkus-kartu</code> atau kolom grid, lalu mengubah gaya <code>.kartu-berita</code> di dalamnya).</p></div>
<h3>Satuan Container Query (<code>cqi</code>)</h3>
<p>Selain <code>vw</code> yang mengacu pada lebar layar, Anda kini dapat menggunakan <strong><code>1cqi</code></strong> (<em>1% of a query container's inline size</em>) untuk membuat ukuran huruf judul kartu yang membesar atau mengecil mengikuti lebar kotaknya sendiri:</p>
<pre>.kartu-berita h3 {
  font-size: clamp(1rem, 0.75rem + 2cqi, 1.5rem);
}</pre>
<h2>Latihan Praktik: Komponen Kartu Adaptif di Dua Kolom Berbeda</h2>
<p>Buatlah berkas <code>container-query.html</code> dan <code>cq.css</code>:</p>
<ol><li>Buat tata letak utama dua kolom menggunakan <code>@media (width &gt;= 56rem)</code> yang membagi layar menjadi kolom utama (<code>2fr</code>) dan bilah samping (<code>1fr</code>).</li><li>Berikan <code>container-type: inline-size</code> pada kolom utama maupun bilah samping.</li><li>Masukkan kode HTML <code>.kartu-modul</code> yang <strong>identik persis</strong> ke dalam kolom utama dan bilah samping, lalu gunakan <code>@container (width &gt;= 450px)</code> sehingga kartu di kolom utama otomatis tampil menyamping 2 kolom lengkap dengan gambar rasio <code>16 / 9</code>, sementara kartu di bilah samping tampil bertumpuk vertikal!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries" rel="noopener">CSS container queries — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using" rel="noopener">Using media queries — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Media_queries" rel="noopener">Media query fundamentals — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["@container","@media","container-type: inline-size","rem",".kartu-berita","em"],
    kuis: [
        {"tanya":"Mengapa penggunaan @container lebih tepat dibandingkan @media untuk mengatur tata letak internal sebuah komponen kartu yang dapat diletakkan di area utama, di bilah samping, maupun di dalam kotak dialog?","opsi":["Karena @media sudah tidak didukung lagi di peramban modern.","Karena @media hanya mengukur dimensi jendela layar (viewport) secara keseluruhan, sedangkan @container mengukur dimensi aktual dari wadah induk tempat komponen tersebut diletakkan.","Karena @container otomatis mengunduh gambar yang lebih kecil dari server.","Karena @container tidak memerlukan tag HTML pembungkus."],"benar":1,"penjelasan":"Layar desktop yang lebar (1440px) bisa saja memiliki bilah samping yang sempit (260px). Dengan @container, komponen beradaptasi terhadap lebar ruang wadah yang benar-benar tersedia untuknya, bukan lebar layar monitor secara keseluruhan."},
        {"tanya":"Properti apakah yang wajib dipasang pada elemen pembungkus induk sebelum elemen anak di dalamnya dapat merespons kueri ukuran lebar @container (width >= 400px)?","opsi":["display: container;","container-type: inline-size;","position: relative;","contain: none;"],"benar":1,"penjelasan":"Agar peramban melacak lebar inline sebuah elemen pembungkus dan mengizinkan kueri @container berbasis lebar di dalamnya, elemen pembungkus tersebut harus ditetapkan sebagai query container dengan container-type: inline-size."},
        {"tanya":"Kombinasi properti CSS manakah yang memastikan sebuah foto profil (<img>) selalu tampil sebagai kotak persegi 1:1 tanpa membuat wajah di dalam foto tampak gepeng atau tertarik meskipun foto aslinya berbentuk persegi panjang?","opsi":["aspect-ratio: 1 / 1; dan object-fit: cover;","width: 100%; dan height: 100%;","aspect-ratio: 16 / 9; dan overflow: scroll;","display: flex; dan align-items: stretch;"],"benar":0,"penjelasan":"aspect-ratio: 1 / 1 mengunci proporsi dimensi elemen menjadi persegi sama sisi, sementara object-fit: cover memerintahkan peramban untuk mempertahankan rasio asli foto dan memotong (crop) tepi sisanya dengan rapi alih-alih mendistorsi gambar."}
    ]
},
{
    id: 9,
    kategori: "2 · Tata Letak",
    judul: "Tata Letak Multi-Kolom (columns) dan Stylesheet Cetak (@media print)",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["columns","@media print","Ctrl + P"],
    ringkas: "Membagi aliran teks panjang atau daftar menjadi kolom-kolom koran otomatis dengan CSS Multi-column Layout (columns, break-inside: avoid), serta merancang halaman web yang rapi saat dicetak ke kertas atau diekspor ke PDF menggunakan @media print dan @page.",
    isi: `
<h2>1. Tata Letak Multi-Kolom (<em>CSS Multi-Column Layout</em>)</h2>
<p>Ketika Anda memiliki daftar pendek yang jumlah butirnya banyak (misalnya daftar 30 istilah indeks, daftar kota layanan, atau kumpulan kartu catatan dengan tinggi bervariasi) dan ingin membaginya mengalir dari atas ke bawah lalu lanjut ke kolom sebelah kanan layaknya surat kabar, gunakan modul <strong>Multi-Column Layout</strong>:</p>
<pre>.daftar-indeks {
  /* Otomatis membuat kolom dengan lebar ideal minimal 220px,
     dan maksimal sebanyak 3 kolom jika layar sangat lebar! */
  columns: 220px 3;
  column-gap: 2rem;
  column-rule: 1px solid #e2e8f0; /* Garis pemisah tipis otomatis di antara kolom */
}

.daftar-indeks &gt; li,
.kartu-catatan {
  /* SANGAT PENTING: Mencegah satu kartu atau satu butir terpotong terbelah dua
     antara bagian bawah Kolom 1 dan bagian atas Kolom 2! */
  break-inside: avoid;
}

.judul-bab-indeks {
  /* Memaksa subjudul merentang penuh melintasi seluruh kolom dari kiri ke kanan */
  column-span: all;
  margin-block: 1.5rem 0.75rem;
}</pre>
<div class="callout info"><div class="callout-judul">💡 Kapan Memilih <code>columns</code> vs CSS Grid?</div><ul><li>Gunakan <strong>CSS Grid</strong> jika urutan baca item harus mengalir dari <strong>kiri ke kanan</strong> per baris (<code>1 -&gt; 2 -&gt; 3</code> di baris atas, lalu <code>4 -&gt; 5 -&gt; 6</code> di baris kedua).</li><li>Gunakan <strong>Multi-Column (<code>columns</code>)</strong> jika konten adalah teks panjang atau daftar abjad yang urutan bacanya mengalir dari <strong>atas ke bawah</strong> di kolom pertama terlebih dahulu, baru berlanjut ke atas kolom kedua!</li></ul></div>
<h2>2. Mengapa Setiap Situs Dokumentasi dan Faktur Wajib Memiliki <code>@media print</code>?</h2>
<p>Pernahkah Anda menekan <strong><code>Ctrl + P</code></strong> (<em>Print / Save as PDF</em>) pada sebuah halaman artikel teknis, tagihan (<em>invoice</em>), atau tiket pendaftaran, lalu hasilnya menghabiskan 6 lembar kertas yang penuh dengan bilah navigasi atas, tombol pencarian, iklan samping, dan teks abu-abu pucat yang tidak terbaca?</p>
<p>Dengan menambahkan blok <strong><code>@media print</code></strong> yang hanya terdiri dari 30 baris di akhir berkas CSS Anda, halaman web yang sama akan otomatis berubah menjadi dokumen cetak/PDF yang bersih dan profesional saat pengguna menekan <code>Ctrl + P</code>!</p>
<h3>Lima Aturan Emas Merancang <code>@media print</code>:</h3>
<ol><li><strong>Sembunyikan elemen antarmuka yang tidak berguna di atas kertas (<code>display: none !important</code>):</strong> Bilah navigasi <code>&lt;header&gt;</code>/<code>&lt;nav&gt;</code>, kotak <code>&lt;search&gt;</code>, <code>&lt;aside&gt;</code> iklan, tombol aksi interaktif, dan pemutar <code>&lt;video&gt;</code>.</li><li><strong>Paksa warna latar menjadi putih dan teks menjadi hitam pekat (<code>#000000</code>):</strong> Menghemat tinta printer dan memastikan keterbacaan maksimal, bahkan jika pengguna sedang membuka situs dalam <em>Dark Mode</em>!</li><li><strong>Rentangkan lebar konten utama menjadi <code>100%</code> dan matikan <code>overflow: auto/hidden</code>:</strong> Jika sebuah pembungkus memiliki <code>overflow: auto</code>/<code>hidden</code> atau tinggi tetap, saat dicetak ke kertas isinya dapat terpotong hanya sebatas layar pertama (dan elemen <code>position: sticky</code>/<code>fixed</code> juga kerap berperilaku tidak terduga di kertas)!</li><li><strong>Cegah pemotongan elemen di pergantian halaman kertas (<code>break-inside: avoid</code> dan <code>break-after: avoid</code>):</strong><ul><li>Jangan biarkan judul <code>&lt;h2&gt;</code> tertinggal sendirian di baris paling bawah halaman 1 sementara paragraf penjelasannya berada di halaman 2 (<strong><code>h2, h3 { break-after: avoid; }</code></strong>)!</li><li>Jangan biarkan blok kode <code>&lt;pre&gt;</code>, <code>&lt;blockquote&gt;</code>, <code>&lt;figure&gt;</code>, atau <code>&lt;tr&gt;</code> tabel terbelah dua di tengah pergantian lembar kertas (<strong><code>pre, blockquote, figure, tr { break-inside: avoid; }</code></strong>)!</li></ul></li><li><strong>Tampilkan alamat URL asli di sebelah tautan eksternal:</strong> Di atas kertas, tautan tidak bisa diklik; kita bisa mencetak URL-nya secara otomatis menggunakan <code>a[href^=&quot;https://&quot;]::after { content: &quot; (&quot; attr(href) &quot;)&quot;; }</code>!</li></ol>
<pre>/* Aturan ukuran margin lembar kertas cetak */
@page {
  size: A4 portrait;
  margin: 2cm;
}

@media print {
  /* 1. Sembunyikan elemen navigasi dan kontrol interaktif */
  header,
  nav,
  search,
  aside,
  footer,
  button,
  .sembunyi-cetak {
    display: none !important;
  }

  /* 2. Pastikan teks hitam di atas kertas putih meskipun pengguna sedang di Mode Gelap */
  body {
    background: #ffffff !important;
    color: #000000 !important;
    font-size: 11pt;
    line-height: 1.5;
  }

  main,
  article,
  .kontainer {
    inline-size: 100% !important;
    max-inline-size: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* 3. Jaga agar judul tidak terpisah dari paragraf di bawahnya */
  h1, h2, h3, h4 {
    break-after: avoid;
    page-break-after: avoid;
  }

  /* 4. Jaga agar blok kode, gambar, dan baris tabel tidak terpotong di tengah kertas */
  pre, blockquote, figure, table, tr, img {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  pre {
    white-space: pre-wrap; /* Agar baris kode panjang tidak terpotong di tepi kanan kertas */
    border: 1px solid #94a3b8;
  }

  /* 5. Cetak alamat URL untuk tautan referensi eksternal */
  article a[href^=&quot;https://&quot;]::after {
    content: &quot; (&quot; attr(href) &quot;)&quot;;
    font-size: 0.85em;
    font-weight: normal;
    word-break: break-all;
  }
}</pre>
<div class="callout info"><div class="callout-judul">💡 Cara Menguji <code>@media print</code> Tanpa Menghabiskan Kertas atau Membuka Dialog Print</div><p>Buka <strong>Developer Tools (<code>F12</code>)</strong> → buka panel <strong>Rendering</strong> → pada bagian <em>Emulate CSS media type</em>, ubah pilihan dari <em>No emulation</em> menjadi <strong><code>print</code></strong>. Tampilan halaman Anda di peramban akan langsung berubah ke mode cetak sehingga Anda bisa menginspeksi elemennya secara langsung!</p></div>
<h2>Latihan Praktik: Menyiapkan Halaman Sertifikat / Modul Siap Cetak ke PDF</h2>
<p>Buatlah berkas <code>modul-siap-cetak.html</code> dan <code>cetak.css</code>:</p>
<ol><li>Buat halaman modul yang memiliki <code>&lt;nav&gt;</code>, <code>&lt;aside&gt;</code>, daftar glosarium 2 kolom dengan <code>columns: 240px 2</code> dan <code>break-inside: avoid</code>, serta artikel utama dengan blok <code>&lt;pre&gt;&lt;code&gt;</code> dan tautan referensi <code>https://...</code>.</li><li>Tambahkan blok <code>@page</code> dan <code>@media print</code> lengkap.</li><li>Aktifkan emulasi media <code>print</code> di DevTools dan pastikan navigasi hilang, blok kode membungkus barisnya dengan rapi (<code>white-space: pre-wrap</code>), serta URL referensi tercetak otomatis di samping teks tautan!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing" rel="noopener">Printing — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Multicol_layout" rel="noopener">Multiple-column layout — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@page" rel="noopener"><code>@page</code> CSS at-rule — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["@media print","columns","Ctrl + P","<nav>","<aside>","break-inside: avoid"],
    kuis: [
        {"tanya":"Deklarasi CSS apakah yang harus dipasang pada elemen anak di dalam tata letak Multi-Column (columns: 3) atau di dalam @media print agar elemen tersebut (misalnya kartu atau blok <pre>) tidak terpotong terbelah dua saat berpindah kolom atau berpindah halaman kertas?","opsi":["overflow: hidden;","break-inside: avoid;","column-span: all;","white-space: nowrap;"],"benar":1,"penjelasan":"Properti break-inside: avoid menginstruksikan mesin fragmentasi CSS (baik pada kolom multi-kolom maupun halaman cetak) untuk memindahkan seluruh kotak elemen tersebut secara utuh ke kolom atau lembar halaman berikutnya apabila ruang yang tersisa di bagian bawah tidak mencukupi."},
        {"tanya":"Dalam aturan @media print, mengapa kita perlu menambahkan h2, h3 { break-after: avoid; }?","opsi":["Agar setiap judul <h2> selalu dicetak dengan huruf kapital.","Untuk mencegah judul bab tercetak sendirian di baris paling bawah sebuah halaman kertas sementara paragraf pertama bab tersebut baru muncul di halaman kertas berikutnya.","Untuk menghapus jarak margin di bawah <h2>.","Agar setiap <h2> disembunyikan saat dicetak."],"benar":1,"penjelasan":"break-after: avoid mengikat elemen judul dengan blok konten tepat setelahnya, sehingga jika ruang di bagian bawah halaman kertas tidak cukup untuk memuat judul beserta minimal baris awal paragrafnya, judul tersebut otomatis ikut dibawa pindah ke awal halaman berikutnya."},
        {"tanya":"Bagaimana cara menampilkan isi atribut href dari sebuah tautan <a href=\"https://kodeloka.asadinedu.com\">Kodeloka</a> secara otomatis di dalam tanda kurung saat halaman dicetak ke kertas menggunakan CSS?","opsi":["a::after { content: href; }","a::after { content: \" (\" attr(href) \")\"; }","a { display: url; }","Tidak mungkin dilakukan dengan CSS; wajib menggunakan JavaScript."],"benar":1,"penjelasan":"Fungsi CSS attr(nama-atribut) di dalam properti content pada pseudo-element ::before atau ::after dapat mengambil nilai string dari atribut HTML mana pun pada elemen tersebut dan menggabungkannya dengan string teks lainnya."}
    ]
},
{
    id: 10,
    kategori: "3 · Warna, Teks & Visual",
    judul: "Sistem Warna Modern (oklch, color-mix) dan Tipografi Web",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["oklch","color-mix","oklch()"],
    ringkas: "Mengelola palet warna yang konsisten secara persepsi manusia dengan oklch() dan color-mix(), memastikan kontras aksesibilitas WCAG, memuat fon web secara efisien dengan @font-face (font-display: swap), serta menyempurnakan keterbacaan teks dengan text-wrap: balance dan pretty.",
    isi: `
<h2>1. Evolusi Ruang Warna di CSS: Dari Hex dan HSL ke <code>oklch()</code></h2>
<p>Selama bertahun-tahun kita menulis warna menggunakan kode Heksadesimal (<code>#2563eb</code>), <code>rgb()</code>, atau <code>hsl(220 90% 50%)</code>.</p>
<p>Catatan pertama untuk sintaks modern: di CSS Color Module Level 4, fungsi <code>rgb()</code> dan <code>hsl()</code> kini menggunakan <strong>sintaks pemisah spasi</strong> dan tanda <code>/</code> untuk opasitas (<em>alpha</em>), sehingga Anda tidak perlu lagi menulis <code>rgba()</code> atau <code>hsla()</code>:</p>
<pre>/* Sintaks modern berbasis spasi (Baseline Widely Available) */
.kotak-bayangan {
  background-color: rgb(37 99 235 / 0.15);
  border-color: hsl(221 83% 53% / 0.4);
}</pre>
<h3>Mengapa <code>oklch()</code> Lebih Unggul daripada <code>hsl()</code> untuk Sistem Desain?</h3>
<p>Di atas kertas, <code>hsl(Hue Saturation Lightness)</code> tampak mudah untuk membuat variasi warna. Namun, <code>hsl()</code> memiliki kelemahan matematis: mata manusia melihat warna <strong>kuning (<code>hue: 60</code>) jauh lebih terang</strong> daripada warna <strong>biru (<code>hue: 240</code>)</strong> meskipun keduanya sama-sama diberi <code>Lightness: 50%</code>! Akibatnya, jika Anda mengganti warna tombol dari biru ke kuning dengan <code>L: 50%</code>, teks putih di atasnya tiba-tiba tidak terbaca sama sekali.</p>
<p>Untuk mengatasi hal ini, CSS modern menghadirkan fungsi warna <strong><code>oklch(L C H)</code></strong> (status <strong>Baseline Widely Available</strong> sejak Mei 2023):</p>
<pre>oklch( 60%   0.18   250  /  1.0 )
       ─┬─   ──┬─   ─┬─     ─┬─
        │      │     │       └── Opasitas / Alpha (opsional, 0–1 atau 0%–100%)
        │      │     └────────── Hue (Sudut rona warna: 0°–360°)
        │      └──────────────── Chroma (Kepekatan/kemurnian warna: 0 = abu-abu hingga ~0.37)
        └─────────────────────── Perceptual Lightness (Kecerahan menurut mata manusia: 0%–100%)</pre>
<p>Keunggulan utama <strong><code>oklch()</code></strong>:</p>
<ol><li>**Kecerahan yang Konsisten secara Persepsi (<em>Perceptually Uniform</em>):<strong> Dua warna dengan nilai <code>L</code> (<code>Lightness</code>) yang sama di <code>oklch()</code> (misalnya biru <code>oklch(65% 0.15 250)</code> dan hijau <code>oklch(65% 0.15 145)</code>) akan memiliki tingkat kecerahan yang </strong>hampir setara di mata manusia** (rasio kontras teks akan mendekati sama, tetapi tetap ukur dengan rasio kontras WCAG)!</li><li><strong>Akses ke Warna Layar Lebar (P3 Wide Gamut):</strong> <code>oklch()</code> mampu menghasilkan warna yang lebih hidup pada layar modern yang mendukung ruang warna Display-P3.</li></ol>
<pre>:root {
  /* Membuat skala warna biru yang konsisten cukup dengan mengubah nilai L (Lightness) */
  --biru-100: oklch(95% 0.03 255);
  --biru-500: oklch(60% 0.19 255);
  --biru-700: oklch(45% 0.17 255);
  --biru-900: oklch(25% 0.09 255);
}</pre>
<h3>Mencampur Warna secara Dinamis dengan <code>color-mix()</code></h3>
<p>Fungsi <strong><code>color-mix()</code></strong> (status <strong>Baseline Widely Available</strong> sejak 2023) memungkinkan Anda membuat variasi warna <em>hover</em> atau warna transparan langsung dari satu variabel warna tanpa perlu mendefinisikan ulang kodenya:</p>
<pre>.tombol-utama {
  --warna-dasar: oklch(58% 0.2 255);
  background-color: var(--warna-dasar);
  color: #ffffff;
}

.tombol-utama:hover {
  /* Gelapkan warna dasar dengan mencampurkan 15% warna hitam di ruang oklch */
  background-color: color-mix(in oklch, var(--warna-dasar), black 15%);
}

.lencana-info {
  /* Buat warna latar lembut dengan mencampurkan 12% warna dasar dengan transparan */
  background-color: color-mix(in oklch, var(--warna-dasar) 12%, transparent);
}</pre>
<h2>2. Tipografi Web yang Cepat dan Mudah Dibaca</h2>
<h3>A. Tumpukan Fon (<em>Font Stack</em>) dan <code>@font-face</code></h3>
<p>Selalu sertakan tumpukan fon cadangan (<em>fallback</em>) yang diakhiri dengan kategori generik (<code>sans-serif</code>, <code>serif</code>, atau <code>monospace</code>). Jika Anda ingin kecepatan pemuatan tertinggi dengan <code>0 KB</code> unduhan fon, gunakan <strong>System Font Stack</strong>:</p>
<pre>:root {
  --fon-antarmuka: system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, sans-serif;
  --fon-kode: ui-monospace, &quot;Cascadia Code&quot;, &quot;Source Code Pro&quot;, Menlo, Consolas, monospace;
}</pre>
<p>Jika Anda memuat fon kustom sendiri menggunakan <code>@font-face</code>, gunakan format <strong><code>.woff2</code></strong> (kompresi terbaik yang didukung semua peramban modern) dan selalu tambahkan <strong><code>font-display: swap</code></strong>:</p>
<pre>@font-face {
  font-family: &quot;Plus Jakarta Sans&quot;;
  src: url(&quot;/assets/fonts/plus-jakarta-sans-variable.woff2&quot;) format(&quot;woff2&quot;);
  font-weight: 400 800; /* Mendukung Variable Font dari bobot 400 hingga 800 dalam 1 berkas! */
  font-style: normal;
  font-display: swap;   /* Tampilkan teks dengan fon sistem dulu agar pembaca tidak melihat layar kosong (FOIT) */
}</pre>
<h3>B. Aturan Emas Keterbacaan: <code>line-height</code>, <code>max-inline-size</code>, dan <code>text-wrap</code></h3>
<ol><li><strong>Tinggi Baris (<code>line-height</code>) Tanpa Satuan:</strong> Selalu tulis <code>line-height</code> menggunakan angka tanpa satuan (misalnya <code>line-height: 1.6</code> untuk paragraf isi, dan <code>line-height: 1.2</code> untuk judul besar). Mengapa tanpa satuan? Karena jika Anda menulis <code>line-height: 24px</code> pada <code>&lt;body&gt;</code>, elemen <code>&lt;h1&gt;</code> yang berukuran <code>40px</code> akan mewarisi tinggi baris tetap <code>24px</code> sehingga huruf-huruf judulnya saling bertabrakan!</li><li><strong>Perataan Baris Judul dan Paragraf dengan <code>text-wrap: balance</code> &amp; <code>pretty</code>:</strong><ul><li>   Pernahkah Anda melihat judul artikel yang baris pertamanya berisi 8 kata, lalu baris keduanya hanya menyisakan 1 kata pendek sendirian (<em>orphan word</em>)?</li><li>   CSS modern menyelesaikan masalah ini dengan properti <strong><code>text-wrap</code></strong>:</li><li><strong><code>text-wrap: balance</code></strong> (Baseline Newly Available sejak Mei 2024): Menyeimbangkan panjang setiap baris pada blok teks pendek (maksimal sekitar 6 baris) sehingga lebar baris pertama dan kedua pada judul terlihat seimbang dan estetis!</li><li><strong><code>text-wrap: pretty</code></strong> (ketersediaan terbatas: belum didukung Firefox, sehingga diperlakukan sebagai peningkatan progresif; peramban yang tidak mendukung mengabaikannya tanpa merusak tata letak): Mencegah satu kata tertinggal sendirian di baris paling akhir sebuah paragraf.</li></ul></li></ol>
<pre>h1, h2, h3, blockquote {
  text-wrap: balance;
  line-height: 1.2;
}

p {
  text-wrap: pretty;
  line-height: 1.65;
  max-inline-size: 65ch;
}

/* Memastikan angka di dalam kolom tabel atau penghitung waktu memiliki lebar digit yang sejajar */
.angka-tabel, time {
  font-variant-numeric: tabular-nums;
}</pre>
<h2>Latihan Praktik: Membangun Sistem Tipografi dan Palet Warna <code>oklch()</code></h2>
<p>Buatlah berkas <code>tipografi-warna.html</code> dan <code>tema.css</code>:</p>
<ol><li>Definisikan skala warna utama dan warna permukaan menggunakan <code>oklch()</code>, serta gunakan <code>color-mix()</code> untuk menghasilkan warna bingkai dan efek <code>:hover</code>.</li><li>Terapkan <code>text-wrap: balance</code> pada judul artikel yang panjang dan <code>text-wrap: pretty</code> beserta <code>max-inline-size: 65ch</code> pada paragraf.</li><li>Buat sebuah tabel angka keuangan yang menerapkan <code>font-variant-numeric: tabular-nums</code> dan perataan kanan (<code>text-align: right</code>) agar satuan ribuan sejajar lurus dari atas ke bawah.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch" rel="noopener"><code>oklch()</code> CSS function — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-family" rel="noopener"><code>font-family</code> CSS property — MDN Web Docs</a></li><li><a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" rel="noopener">Understanding Success Criterion 1.4.3: Contrast (Minimum) — W3C WAI</a></li></ul></div>
`,
    perintah: ["oklch()","hsl()","color-mix()","line-height","text-wrap: balance","rgb()"],
    kuis: [
        {"tanya":"Apa keunggulan utama mendefinisikan palet warna menggunakan fungsi oklch() dibandingkan hsl()?","opsi":["oklch() adalah satu-satunya format warna yang dapat digunakan pada properti border-color.","Nilai Lightness (L) pada oklch() bersifat perceptually uniform (seragam menurut persepsi mata manusia), sehingga mengubah sudut rona warna (Hue) tanpa mengubah nilai L akan menghasilkan tingkat kecerahan dan kontras baca yang konsisten.","oklch() secara otomatis mengubah gambar JPEG menjadi SVG.","hsl() tidak mendukung tingkat transparansi (alpha)."],"benar":1,"penjelasan":"Pada hsl(), warna kuning dan biru dengan Lightness: 50% terlihat memiliki kecerahan yang sangat timpang bagi mata manusia. Ruang warna oklch() dirancang secara ilmiah agar nilai kecerahan (L) mencerminkan persepsi kecerahan visual manusia secara akurat."},
        {"tanya":"Mengapa nilai properti line-height sangat disarankan ditulis sebagai angka tanpa satuan (seperti line-height: 1.5) alih-alih menggunakan satuan panjang tetap (seperti line-height: 24px)?","opsi":["Karena peramban modern menolak satuan px pada properti line-height.","Karena nilai tanpa satuan diwariskan sebagai faktor pengali terhadap font-size masing-masing elemen anak; sedangkan nilai 24px diwariskan sebagai angka mati yang akan membuat teks berukuran besar (seperti <h1>) saling bertumpukan.","Karena angka tanpa satuan membuat halaman dimuat tanpa perlu membangun CSSOM.","Agar spasi antar-huruf secara otomatis melebar dua kali lipat."],"benar":1,"penjelasan":"Jika body memiliki line-height: 24px, maka nilai komputasi 24px itulah yang diwariskan ke seluruh elemen anak, termasuk <h1> yang mungkin berukuran 36px. Sebaliknya, dengan line-height: 1.5, elemen anak mewarisi faktor pengali 1.5 dan menghitung tinggi barisnya sesuai font-size miliknya sendiri."},
        {"tanya":"Apa fungsi dari deklarasi font-display: swap; di dalam aturan @font-face?","opsi":["Mengganti bahasa halaman secara otomatis sesuai lokasi pengguna.","Menginstruksikan peramban untuk segera merender teks menggunakan fon cadangan (fallback font) sementara berkas fon kustom sedang diunduh, lalu menukarnya begitu fon kustom siap, sehingga mencegah teks tak terlihat (Flash of Invisible Text).","Menukar warna teks dengan warna latar belakang saat kursor diarahkan.","Menghapus berkas fon setelah halaman ditutup."],"benar":1,"penjelasan":"Tanpa font-display: swap, peramban dapat menahan penggambaran teks hingga beberapa detik sambil menunggu berkas .woff2 selesai diunduh dari jaringan lambat. Dengan swap, pengguna dapat langsung membaca konten sejak detik pertama."}
    ]
},
{
    id: 11,
    kategori: "3 · Warna, Teks & Visual",
    judul: "Efek Visual Lanjutan: filter, backdrop-filter, Gradien Kompleks, dan clip-path",
    tingkat: "Menengah", durasi: "8 mnt",
    tag: ["filter","backdrop-filter","clip-path"],
    ringkas: "Menciptakan efek visual modern seperti kaca buram (glassmorphism) dengan backdrop-filter, bayangan mengikuti bentuk transparan dengan filter: drop-shadow(), diagram lingkaran murni CSS dengan conic-gradient(), serta pemotongan bentuk geometris dengan clip-path.",
    isi: `
<h2>1. <code>filter</code> vs <code>backdrop-filter</code>: Kapan Menggunakan Masing-Masing?</h2>
<p>CSS menyediakan fungsi pengolah piksel grafis langsung di peramban (<code>filter</code> berstatus <strong>Baseline Widely Available</strong>, sedangkan <code>backdrop-filter</code> <strong>Baseline Newly Available</strong> sejak September 2024):</p>
<ul><li><strong><code>filter</code>:</strong> Menerapkan efek grafis (seperti <code>blur()</code>, <code>brightness()</code>, <code>contrast()</code>, <code>grayscale()</code>, <code>drop-shadow()</code>) pada <strong>elemen itu sendiri beserta seluruh anak di dalamnya</strong>.</li><li><strong><code>backdrop-filter</code>:</strong> Menerapkan efek grafis hanya pada <strong>area latar belakang yang berada di balik elemen transparan tersebut</strong>, sementara teks di dalam elemen tetap tajam 100%! Inilah kunci untuk membuat bilah navigasi kaca buram (<em>frosted glass / glassmorphism</em>).</li></ul>
<pre>/* Bilah navigasi atas dengan efek kaca buram yang tetap terbaca jelas */
.header-kaca {
  position: sticky;
  inset-block-start: 0;
  z-index: 30;
  /* Wajib menggunakan warna latar semi-transparan (mis. opasitas 0.75)
     agar area di belakangnya tampak menembus dan diburamkan oleh backdrop-filter! */
  background-color: oklch(100% 0 0 / 0.75);
  backdrop-filter: blur(12px) saturate(150%);
  border-block-end: 1px solid oklch(85% 0.01 250 / 0.6);
}</pre>
<h3>Perbedaan Kritis: <code>box-shadow</code> vs <code>filter: drop-shadow()</code></h3>
<ul><li><strong><code>box-shadow</code></strong> selalu memberi bayangan pada <strong>kotak persegi panjang</strong> elemen, meskipun gambar di dalamnya adalah logo PNG/SVG dengan latar transparan!</li><li><strong><code>filter: drop-shadow(0 8px 16px rgb(0 0 0 / 0.2))</code></strong> memeriksa saluran transparansi (<em>alpha channel</em>) gambar dan memberi bayangan yang <strong>mengikuti lekuk bentuk asli gambar PNG/SVG transparan tersebut</strong>!</li></ul>
<pre>/* Bayangan mengikuti lekuk bentuk ikon SVG atau gambar PNG transparan */
.ikon-ilustrasi {
  filter: drop-shadow(0 6px 12px rgb(15 23 42 / 0.18));
}</pre>
<h2>2. Tiga Jenis Gradien CSS dan Diagram Lingkaran dengan <code>conic-gradient()</code></h2>
<p>Di CSS, gradien (<code>linear-gradient</code>, <code>radial-gradient</code>, dan <code>conic-gradient</code>) diperlakukan sebagai gambar (<code>background-image</code>) yang dibuat secara matematis oleh peramban dengan ukuran <code>0 byte</code> jaringan:</p>
<ol><li><strong><code>linear-gradient(arah, warna1, warna2)</code>:</strong> Transisi warna sepanjang garis lurus (tips: gunakan <strong><code>in oklch</code></strong> seperti <code>linear-gradient(in oklch to right, #2563eb, #10b981)</code> agar gradasi warna di tengahnya tampak cerah dan tidak berubah kusam keabu-abuan!).</li><li><strong><code>radial-gradient(...)</code>:</strong> Pancaran warna melingkar/elips dari titik pusat (sangat bagus untuk efek cahaya latar lembut di bagian <em>hero</em>).</li><li><strong><code>conic-gradient(...)</code>:</strong> Putaran warna mengelilingi titik pusat layaknya jarum jam! Dengan menetapkan titik henti warna secara tajam, Anda dapat membuat **diagram lingkaran (<em>pie/donut chart</em>) murni dengan CSS**:</li></ol>
<pre>/* Membuat diagram cincin (Donut Chart) progres 75% murni dengan CSS! */
.diagram-cincin {
  --persen: 75%;
  inline-size: 8rem;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: conic-gradient(
    oklch(58% 0.2 255) var(--persen),
    oklch(90% 0.01 250) 0
  );
  display: grid;
  place-items: center;

  /* Membuat lubang di tengah cincin */
  &amp;::before {
    content: attr(data-label);
    inline-size: 68%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background-color: #ffffff;
    display: grid;
    place-items: center;
    font-weight: 700;
  }
}</pre>
<h2>3. Memotong Bentuk Geometris dengan <code>clip-path</code></h2>
<p>Properti <strong><code>clip-path</code></strong> bekerja seperti pisau pemotong kue: bagian elemen yang berada di dalam jalur bentuk akan ditampilkan, sementara bagian di luarnya disembunyikan secara tajam:</p>
<ul><li><code>clip-path: circle(50%)</code></li><li><code>clip-path: inset(10px 20px round 12px)</code></li><li><code>clip-path: polygon(x1 y1, x2 y2, x3 y3, ...)</code></li></ul>
<pre>/* Memotong bagian bawah spanduk hero secara miring dinamis */
.spanduk-miring {
  clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
  padding-block: 4rem 6rem;
}</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Peringatan Performa pada <code>backdrop-filter: blur()</code> dan <code>filter: blur()</code></div><p>Efek pemburaman (<code>blur</code>) dengan radius sangat besar (misalnya <code>blur(60px)</code>) pada area layar yang luas memakan daya GPU yang signifikan, terutama saat halaman digulir pada laptop hemat daya atau ponsel. Gunakan radius moderat (<code>8px</code>–<code>16px</code>) dan jangan menganimasikan nilai <code>blur()</code> secara terus-menerus!</p></div>
<h2>Latihan Praktik: Membuat Kartu Metrik dengan Diagram Cincin <code>conic-gradient</code></h2>
<p>Buatlah berkas <code>efek-visual.html</code> dan <code>visual.css</code>:</p>
<ol><li>Buat <code>&lt;header&gt;</code> dengan efek kaca buram <code>backdrop-filter: blur(10px)</code> di atas latar gradien <code>linear-gradient(in oklch ...)</code>.</li><li>Buat 3 komponen <code>.diagram-cincin</code> yang menampilkan penggunaan CPU (<code>45%</code>), RAM (<code>72%</code>), dan Diska (<code>90%</code>) cukup dengan mengubah variabel <code>--persen</code> pada gaya inline masing-masing elemen.</li><li>Gunakan <code>filter: drop-shadow(...)</code> pada sebuah ikon <code>&lt;svg&gt;</code> transparan.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/filter" rel="noopener"><code>filter</code> CSS property — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter" rel="noopener"><code>backdrop-filter</code> CSS property — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/clip-path" rel="noopener"><code>clip-path</code> CSS property — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch" rel="noopener"><code>oklch()</code> CSS function — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["filter","backdrop-filter","blur()","box-shadow","conic-gradient","clip-path"],
    kuis: [
        {"tanya":"Mengapa untuk memberi efek bayangan yang mengikuti lekuk garis sebuah logo transparan berformat SVG atau PNG kita harus menggunakan filter: drop-shadow(...) dan bukan box-shadow?","opsi":["Karena box-shadow tidak mendukung warna transparan rgb(0 0 0 / 0.2).","Karena box-shadow selalu menggambar bayangan mengikuti bentuk kotak persegi panjang (border box) elemen tersebut, sedangkan filter: drop-shadow() memeriksa saluran alpha (transparansi) piksel sehingga bayangannya mengikuti kontur bentuk objek yang tidak transparan.","Karena box-shadow hanya bekerja pada teks.","Karena filter: drop-shadow() mengubah gambar PNG menjadi vektor."],"benar":1,"penjelasan":"box-shadow bekerja pada model kotak CSS, sehingga area transparan di dalam kotak gambar tetap dianggap bagian dari persegi panjang. Sebaliknya, filter: drop-shadow() memproses bentuk alfa dari konten elemen."},
        {"tanya":"Syarat apakah yang harus dipenuhi pada warna latar (background-color) sebuah elemen agar properti backdrop-filter: blur(12px) pada elemen tersebut dapat terlihat efeknya oleh pengguna?","opsi":["background-color harus bernilai hitam pekat (#000000 dengan opasitas 1).","background-color elemen tersebut harus bersifat transparan atau semi-transparan (misalnya memiliki saluran alpha seperti oklch(100% 0 0 / 0.7)), karena backdrop-filter bekerja pada piksel yang berada di belakang elemen tersebut.","Elemen tersebut harus memiliki opacity: 0.","Elemen tersebut wajib berupa <img>."],"benar":1,"penjelasan":"Jika latar belakang elemen berwarna solid 100% (alpha = 1), maka piksel di belakang elemen yang sudah diburamkan oleh backdrop-filter akan tertutup sepenuhnya oleh warna latar elemen itu sendiri."},
        {"tanya":"Fungsi gradien CSS manakah yang memutar transisi warna mengelilingi satu titik pusat (dari 0deg hingga 360deg), sehingga sangat cocok digunakan untuk menggambar diagram lingkaran (pie/donut chart) murni dengan CSS?","opsi":["linear-gradient()","radial-gradient()","conic-gradient()","repeating-linear-gradient()"],"benar":2,"penjelasan":"conic-gradient() menempatkan titik henti warna berdasarkan sudut putaran mengelilingi titik pusat (dalam derajat atau persentase putaran), menjadikannya alat yang sangat tepat untuk diagram lingkaran dan roda warna."}
    ]
},
{
    id: 12,
    kategori: "4 · Gerak & Interaksi",
    judul: "Transisi, Transformasi, Animasi @keyframes, dan Performa 60fps",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["@keyframes","transform","transition"],
    ringkas: "Menghidupkan antarmuka secara halus menggunakan properti transform individual (translate, scale, rotate), transition, dan @keyframes, memahami mengapa hanya transform dan opacity yang ramah GPU, serta menghormati preferensi aksesibilitas prefers-reduced-motion.",
    isi: `
<h2>Mengapa Gerakan di Antarmuka Harus Memiliki Tujuan?</h2>
<p>Transisi dan animasi yang baik bukanlah hiasan yang memperlambat pengguna, melainkan umpan balik visual yang menjelaskan <strong>apa yang baru saja terjadi</strong>: tombol yang sedikit terangkat saat disorot, panel samping yang bergeser masuk dari tepi layar, atau indikator pemuatan (<em>spinner</em>) yang memberitahu bahwa permintaan jaringan sedang diproses.</p>
<h2>1. Transformasi Ruang dengan <code>transform</code> dan Properti Individual Modern</h2>
<p>Properti <code>transform</code> memungkinkan Anda menggeser, memperbesar/memperkecil, atau memutar sebuah elemen <strong>tanpa memengaruhi posisi elemen-elemen tetangga di sekitarnya</strong> (tidak memicu perhitungan ulang tata letak!).</p>
<p>Sejak peramban modern mendukung properti transformasi individual (status <strong>Baseline Widely Available</strong>), Anda kini dapat menulis <strong><code>translate</code></strong>, <strong><code>scale</code></strong>, dan <strong><code>rotate</code></strong> secara terpisah ataupun menggunakan fungsi <code>transform</code> klasik:</p>
<pre>.kartu-interaktif {
  /* Properti individual memudahkan kita mengubah satu aspek tanpa menimpa yang lain */
  translate: 0 0;
  scale: 1;
  transition: translate 200ms cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 200ms ease;
}

.kartu-interaktif:hover {
  /* Geser ke atas sejauh 4px saat disorot */
  translate: 0 -4px;
  box-shadow: 0 12px 24px -6px rgb(15 23 42 / 0.12);
}

.ikon-putar {
  /* Putar 45 derajat dengan titik poros di tengah (transform-origin: center) */
  rotate: 45deg;
}</pre>
<h2>2. Transisi Halus Antar-Status dengan <code>transition</code></h2>
<p><code>transition</code> membuat perubahan nilai properti dari satu kondisi ke kondisi lain (misalnya dari keadaan normal ke <code>:hover</code> atau <code>:focus-visible</code>) berlangsung secara bertahap selama durasi tertentu.</p>
<p>Empat sub-properti dari <code>transition</code>:</p>
<ol><li><strong><code>transition-property</code>:</strong> Properti mana yang ingin dianimasikan (misalnya <code>transform</code>, <code>opacity</code>, <code>background-color</code>).</li><li><strong><code>transition-duration</code>:</strong> Durasi waktu (misalnya <code>150ms</code> atau <code>0.2s</code> — untuk antarmuka pengguna, durasi <code>150ms</code> hingga <code>250ms</code> terasa paling sigap!).</li><li><strong><code>transition-timing-function</code>:</strong> Kurva percepatan gerak (misalnya <code>ease</code>, <code>ease-out</code>, <code>linear</code>, atau kurva kustom <code>cubic-bezier(...)</code>).</li><li><strong><code>transition-delay</code>:</strong> Waktu tunda sebelum transisi dimulai.</li></ol>
<div class="callout bahaya"><div class="callout-judul">🚫 Larangan Performa: Jangan Pernah Menulis <code>transition: all 0.3s</code>!</div><p>Menulis <code>transition: all</code> adalah kebiasaan buruk karena:</p>
<ol><li>Memaksa peramban memeriksa dan menganimasikan <strong>setiap properti</strong> yang berubah (termasuk <code>width</code>, <code>padding</code>, <code>margin</code> saat ukuran jendela layar diubah pengguna), sehingga membuat peramban terasa berat dan patah-patah.</li><li>Sebutkan secara eksplisit hanya properti yang memang ingin Anda transisikan: <code>transition: transform 200ms ease-out, opacity 200ms ease-out, background-color 150ms ease;</code></li></ol></div>
<h2>3. Rahasia Animasi 60fps: Mengapa Hanya <code>transform</code> dan <code>opacity</code> yang Murah?</h2>
<p>Ingat kembali tahapan <strong>Critical Rendering Path</strong> dari Pelajaran 01 HTML: <code>DOM + CSSOM -&gt; Render Tree -&gt; Layout (Reflow) -&gt; Paint (Repaint) -&gt; Composite (GPU)</code></p>
<ol><li><strong>Menganimasikan <code>width</code>, <code>height</code>, <code>top</code>, <code>left</code>, atau <code>margin</code> (SANGAT BERAT):</strong> Pada setiap bingkai gambar (<em>60 kali per detik</em> atau setiap <code>16,6 ms</code>), peramban terpaksa menghitung ulang ukuran dan posisi seluruh elemen tetangga di halaman (<strong>Layout / Reflow</strong>), menggambar ulang pikselnya (<strong>Paint</strong>), lalu mengirimkannya ke GPU. Pada perangkat ponsel kelas menengah ke bawah, animasi ini akan terlihat tersendat (<em>janky</em>).</li><li><strong>Menganimasikan <code>transform</code> (<code>translate</code>, <code>scale</code>, <code>rotate</code>) dan <code>opacity</code> (SANGAT CEPAT):</strong> Kedua properti ini <strong>melewati tahap Layout dan Paint sepenuhnya</strong>! Peramban cukup menyerahkan lapisan tekstur elemen ke <strong>GPU (Compositor Thread)</strong> untuk digeser, diubah skalanya, atau diatur ketembusannya dengan mulus pada 60fps–120fps, bahkan ketika utas utama JavaScript sedang sibuk!</li></ol>
<pre>/* BURUK: Menggeser elemen dengan menganimasikan 'left' atau 'margin-left' (memicu Layout tiap frame!) */
.geser-lambat {
  position: relative;
  left: 0;
  transition: left 250ms ease;
}
.geser-lambat:hover {
  left: 12px;
}

/* LEBIH BAIK: Menggeser elemen dengan 'translate' / 'transform' (ditangani langsung oleh GPU Compositor) */
.geser-cepat {
  translate: 0 0;
  transition: translate 250ms ease-out;
}
.geser-cepat:hover {
  translate: 12px 0;
}</pre>
<h2>4. Animasi Multi-Tahap dengan <code>@keyframes</code> dan Menghormati <code>prefers-reduced-motion</code></h2>
<p>Berbeda dengan <code>transition</code> yang membutuhkan pemicu perubahan status (seperti <code>:hover</code>), <strong><code>@keyframes</code></strong> dan properti <strong><code>animation</code></strong> memungkinkan Anda membuat urutan gerakan multi-tahap atau berulang (seperti indikator pemuatan data atau efek denyut halus):</p>
<pre>@keyframes putar-penuh {
  from {
    rotate: 0deg;
  }
  to {
    rotate: 360deg;
  }
}

.indikator-memuat {
  inline-size: 1.5rem;
  block-size: 1.5rem;
  border: 3px solid #e2e8f0;
  border-block-start-color: #2563eb;
  border-radius: 50%;
  animation: putar-penuh 0.8s linear infinite;
}</pre>
<h3>Kewajiban Aksesibilitas: <code>@media (prefers-reduced-motion: reduce)</code></h3>
<p>Bagi sebagian pengguna yang memiliki gangguan vestibular (vertigo, migrain, atau mabuk gerak visual), animasi geser, perbesaran skala, dan efek paralaks dapat memicu pusing atau mual fisik yang nyata. Mereka mengaktifkan opsi <em>&quot;Reduce Motion&quot;</em> di pengaturan sistem operasi mereka.</p>
<p>Sebagai pengembang yang bertanggung jawab, selalu tambahkan aturan perlindungan ini di berkas CSS Anda:</p>
<pre>@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}</pre>
<div class="callout info"><div class="callout-judul">💡 Mengapa <code>0.01ms</code> dan Bukan <code>0s</code> atau <code>none</code>?</div><p>Sebagian kode JavaScript mungkin menunggu event <code>transitionend</code> atau <code>animationend</code> untuk menjalankan langkah berikutnya. Dengan mengatur durasi menjadi <code>0.01ms</code> (nyaris instan dan tidak terlihat bergerak oleh mata), gerakan visual dihentikan tetapi event JavaScript <code>transitionend</code> tetap terpanggil dengan aman!</p></div>
<h2>Latihan Praktik: Membuat Tombol Interaktif dan Skeleton Loader yang Ramah Aksesibilitas</h2>
<p>Buatlah berkas <code>animasi-gpu.html</code> dan <code>animasi.css</code> yang berisi:</p>
<ol><li>Sebuah tombol <code>.tombol-aksi</code> yang bergeser naik <code>2px</code> saat <code>:hover</code> dan kembali turun saat <code>:active</code> menggunakan properti <code>translate</code> dengan durasi <code>150ms</code>.</li><li>Sebuah indikator <em>skeleton loading</em> yang menganimasikan <code>opacity</code> dari <code>1</code> ke <code>0.4</code> secara bolak-balik (<code>alternate infinite</code>) menggunakan <code>@keyframes</code>.</li><li>Blok <code>@media (prefers-reduced-motion: reduce)</code> yang mematikan gerakan bagi pengguna yang mengaktifkan pengurangan gerak.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Animations" rel="noopener">CSS animations — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Transitions" rel="noopener">CSS transitions — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance" rel="noopener">CSS and JavaScript animation performance — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["transform","transition","opacity","translate",":hover","150ms"],
    kuis: [
        {"tanya":"Mengapa menganimasikan properti transform (atau translate/scale) dan opacity jauh lebih hemat performa dibandingkan menganimasikan properti width, height, atau top?","opsi":["Karena transform dan opacity hanya bekerja pada gambar berformat SVG.","Karena perubahan pada transform dan opacity tidak mengubah geometri ruang elemen lain di halaman, sehingga peramban dapat melewati tahap Layout dan Paint lalu menyerahkan perenderannya langsung ke Compositor Thread (GPU).","Karena width dan height tidak dapat ditulis di dalam berkas CSS eksternal.","Karena transform otomatis memperkecil ukuran berkas HTML."],"benar":1,"penjelasan":"Mengubah width, height, atau top memaksa peramban menghitung ulang posisi elemen tetangga (Layout/Reflow) dan menggambar ulang piksel (Paint) di setiap frame. Sebaliknya, transform dan opacity diproses langsung pada lapisan compositor GPU tanpa mengganggu tata letak dokumen."},
        {"tanya":"Mengapa penulisan transition: all 0.3s ease; dianggap sebagai anti-pola (anti-pattern) dalam pengembangan CSS?","opsi":["Karena kata kunci all sudah dihapus dari spesifikasi CSS.","Karena all memaksa peramban memantau dan menganimasikan setiap perubahan properti yang tidak disengaja (termasuk perubahan ukuran kotak saat jendela layar diubah), yang membebani performa dan menimbulkan efek visual yang tidak diinginkan.","Karena transition: all membuat tombol tidak dapat diklik dengan papan ketik.","Karena durasi 0.3s terlalu cepat untuk dilihat mata manusia."],"benar":1,"penjelasan":"Dengan menyebutkan nama properti secara spesifik (misalnya transition: translate 150ms ease, background-color 150ms ease), Anda mencegah transisi yang tidak disengaja pada properti tata letak sekaligus menjaga efisiensi perenderan peramban."},
        {"tanya":"Apa tujuan penggunaan @media (prefers-reduced-motion: reduce) di dalam stylesheet aplikasi web?","opsi":["Mengurangi pemakaian baterai ketika kapasitas baterai perangkat di bawah 10%.","Menghormati pengaturan aksesibilitas sistem operasi pengguna yang sensitif terhadap gerakan layar (seperti penderita gangguan vestibular/vertigo) dengan meminimalkan atau menonaktifkan animasi dan guliran otomatis.","Memperlambat kecepatan animasi menjadi dua kali lebih lama agar mudah diamati.","Mematikan pemutaran suara pada elemen <audio>."],"benar":1,"penjelasan":"Fitur media prefers-reduced-motion: reduce mendeteksi apakah pengguna telah meminta pengurangan gerakan animasi di tingkat sistem operasi demi kenyamanan dan kesehatan visual mereka."}
    ]
},
{
    id: 13,
    kategori: "4 · Gerak & Interaksi",
    judul: "Pengalaman Gulir Modern: scroll-snap, overscroll-behavior, dan Scroll-Driven Animations",
    tingkat: "Lanjut", durasi: "9 mnt",
    tag: ["scroll-snap","overscroll-behavior","overflow-x: auto"],
    ringkas: "Membangun galeri geser (carousel) yang mulus tanpa JavaScript menggunakan CSS Scroll Snap (scroll-snap-type, scroll-snap-align), mencegah kebocoran guliran modal dengan overscroll-behavior, serta mengenal animasi berbasis posisi gulir (animation-timeline).",
    isi: `
<h2>1. Membuat Karusel &amp; Galeri Geser Murni CSS dengan <code>scroll-snap</code></h2>
<p>Dulu, membuat deretan kartu horizontal yang ketika digeser dengan jari di layar ponsel otomatis berhenti tepat di tengah atau di tepi kartu (<em>carousel / slider</em>) mengharuskan kita memuat pustaka JavaScript berat yang menyadap event <code>touchmove</code> dan <code>scroll</code>.</p>
<p>Kini, <strong>CSS Scroll Snap</strong> (status <strong>Baseline Widely Available</strong>) menangani seluruh fisika kelembaman dan penguncian posisi gulir tersebut langsung di tingkat <em>compositor thread</em> peramban dengan sangat mulus!</p>
<p>Hanya butuh dua langkah:</p>
<ol><li>**Pada Wadah Pembungkus yang Bisa Digulir (<em>Scroll Container</em>):<strong> Pasang <code>overflow-x: auto</code> dan </strong><code>scroll-snap-type: x mandatory</code>** (atau <code>y proximity</code> untuk arah vertikal).</li><li><strong>Pada Setiap Anak Kartu di Dalamnya:</strong> Pasang <strong><code>scroll-snap-align: start</code></strong> (atau <code>center</code> / <code>end</code>).</li></ol>
<pre>/* 1. Wadah Galeri Horizontal */
.rel-kartu {
  display: grid;
  grid-auto-flow: column;
  /* Setiap kartu memiliki lebar 85% layar di ponsel, atau maksimal 320px di layar lebar */
  grid-auto-columns: min(85%, 320px);
  gap: 1rem;
  overflow-x: auto;
  padding-block-end: 1rem;

  /* Mengaktifkan penguncian gulir horizontal secara wajib (mandatory) */
  scroll-snap-type: x mandatory;
  /* Memberi jarak aman di kiri agar kartu pertama tidak terlalu mepet ke tepi layar */
  scroll-padding-inline-start: 1rem;
}

/* 2. Setiap Item Kartu di Dalam Rel */
.rel-kartu &gt; article {
  scroll-snap-align: start;
  /* Mencegah pengguna melompati banyak kartu sekaligus saat menggeser terlalu cepat di ponsel */
  scroll-snap-stop: always;
}</pre>
<h3>Perbedaan <code>mandatory</code> vs <code>proximity</code> pada <code>scroll-snap-type</code></h3>
<ul><li><strong><code>mandatory</code>:</strong> Peramban <strong>wajib selalu mengunci</strong> posisi berhenti tepat pada salah satu titik kartu begitu pengguna selesai menggulir. Sangat cocok untuk galeri foto atau deretan kartu horizontal (<code>overflow-x: auto</code>).</li><li><strong><code>proximity</code>:</strong> Peramban hanya mengunci posisi jika guliran pengguna kebetulan berhenti <strong>di dekat</strong> titik <em>snap</em> (jika berhenti di tengah-tengah paragraf panjang, pengguna tidak dipaksa melompat). Jauh lebih aman untuk pengguliran halaman utama secara vertikal (<code>y</code>)!</li></ul>
<h2>2. Mengatur Jarak Tautan Jangkar (<code>scroll-margin</code>) dan Mengunci Bocoran Gulir (<code>overscroll-behavior</code>)</h2>
<h3>A. <code>scroll-margin-top</code> (atau <code>scroll-margin-block-start</code>)</h3>
<p>Saat pengguna mengeklik tautan daftar isi <code>&lt;a href=&quot;#bab-3&quot;&gt;</code>, peramban menggulir <code>#bab-3</code> hingga menempel persis di bibir atas layar (<code>0px</code>). Jika situs Anda memiliki <code>&lt;header&gt;</code> yang <code>position: sticky</code> setinggi <code>4rem</code>, maka judul <code>#bab-3</code> akan tertutup oleh header tersebut!</p>
<p>Solusinya: berikan <strong><code>scroll-margin-block-start: 5rem;</code></strong> pada semua elemen yang memiliki atribut <code>id</code>:</p>
<pre>[id] {
  scroll-margin-block-start: 5rem;
}</pre>
<h3>B. <code>overscroll-behavior: contain</code></h3>
<p>Pernahkah Anda menggulir daftar panjang di dalam sebuah kotak <code>&lt;dialog&gt;</code> atau panel menu samping (<em>sidebar</em>), lalu ketika gulirannya sudah mencapai ujung paling bawah daftar, tiba-tiba **halaman utama di belakangnya ikut bergerak tergulir (<em>scroll chaining</em>)**?</p>
<p>Satu baris properti <strong><code>overscroll-behavior: contain</code></strong> (nilai <code>contain</code> didukung semua peramban utama: Chrome 63, Firefox 59, Safari 16; halaman MDN menandai properti ini <em>Limited availability</em> hanya karena nilai <code>chain</code> yang baru) menghentikan rantai guliran tersebut agar tetap terkurung di dalam panel/dialog tanpa membocorkannya ke halaman belakang!</p>
<pre>.panel-notifikasi,
dialog {
  overflow-y: auto;
  overscroll-behavior: contain;
}</pre>
<h2>3. Animasi yang Dikendalikan oleh Posisi Gulir (<em>Scroll-Driven Animations</em>)</h2>
<p>Di masa lalu, membuat **Bilah Kemajuan Baca (<em>Reading Progress Bar</em>)** di bagian paling atas artikel yang memanjang dari <code>0%</code> ke <code>100%</code> seiring pengguna menggulir halaman ke bawah mengharuskan kita menjalankan <code>window.addEventListener(&quot;scroll&quot;, ...)</code> di utas utama JavaScript pada setiap piksel guliran.</p>
<p>CSS modern memperkenalkan <strong>Scroll-Driven Animations</strong> melalui properti <strong><code>animation-timeline</code></strong> (didukung di Chrome/Edge sejak versi 115 dan Safari 26; di Firefox baru tersedia mulai versi 159, yang saat ini masih beta, sehingga gunakan secara progresif dengan <code>@supports</code>):</p>
<ul><li><strong><code>scroll()</code>:</strong> Mengikat kemajuan <code>@keyframes</code> (<code>0%</code> hingga <code>100%</code>) langsung ke posisi gulir sebuah <em>scroll container</em> (seperti halaman <code>root</code>), bukan ke waktu detik!</li><li><strong><code>view()</code>:</strong> Mengikat kemajuan <code>@keyframes</code> ke posisi sebuah elemen saat elemen tersebut mulai masuk hingga keluar dari jendela pandang (<em>viewport</em>, mirip <code>IntersectionObserver</code> tetapi untuk animasi CSS murni!).</li></ul>
<pre>@keyframes rentangkan-progres {
  from { scale: 0 1; }
  to   { scale: 1 1; }
}

/* Bilah kemajuan baca artikel di bagian paling atas layar — 0 baris JavaScript! */
@supports (animation-timeline: scroll()) {
  .bilah-kemajuan-baca {
    position: fixed;
    inset-block-start: 0;
    inset-inline: 0;
    block-size: 4px;
    background-color: #2563eb;
    transform-origin: 0% 50%;
    animation: rentangkan-progres linear;
    /* Mengikat timeline animasi ke guliran vertikal dokumen root! */
    animation-timeline: scroll(root block);
  }
}</pre>
<h2>Latihan Praktik: Membangun Rel Katalog Geser dan Bilah Kemajuan Baca</h2>
<p>Buatlah berkas <code>scroll-modern.html</code> dan <code>scroll.css</code>:</p>
<ol><li>Buat komponen <code>.rel-katalog</code> horizontal yang berisi 6 kartu kelas menggunakan <code>scroll-snap-type: x mandatory</code> dan <code>scroll-snap-align: start</code>.</li><li>Pasang <code>scroll-margin-block-start: 5rem</code> pada setiap <code>&lt;section id=&quot;...&quot;&gt;</code> di artikel.</li><li>Tambahkan <code>.bilah-kemajuan-baca</code> dengan <code>@supports (animation-timeline: scroll())</code> dan pastikan tetap menghormati <code>@media (prefers-reduced-motion: reduce)</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap" rel="noopener">CSS scroll snap — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll_snap/Basic_concepts" rel="noopener">Basic concepts of scroll snap — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS" rel="noopener">CSS: Cascading Style Sheets — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["overflow-x: auto","scroll-snap-type: x mandatory","scroll-snap-align: start","mandatory","proximity","#bab-3"],
    kuis: [
        {"tanya":"Kombinasi properti CSS manakah yang diperlukan untuk membuat wadah horizontal .galeri dan elemen anak .item di dalamnya mengunci posisi berhenti tepat di awal setiap kartu saat digeser oleh pengguna?","opsi":["scroll-snap-align: start pada .galeri, dan scroll-snap-type: x mandatory pada .item.","overflow-x: auto; scroll-snap-type: x mandatory; pada wadah induk .galeri, dan scroll-snap-align: start; pada elemen anak .item.","position: sticky pada .galeri, dan float: left pada .item.","overscroll-behavior: none pada .item."],"benar":1,"penjelasan":"Properti scroll-snap-type selalu dipasang pada wadah pengguliran (scroll container yang memiliki overflow: auto/scroll), sedangkan scroll-snap-align dipasang pada elemen-elemen anak di dalamnya untuk menentukan titik penjajaran masing-masing item."},
        {"tanya":"Masalah antarmuka apa yang diselesaikan oleh deklarasi overscroll-behavior: contain; pada sebuah panel menu samping yang dapat digulir (overflow-y: auto)?","opsi":["Menyembunyikan batang scrollbar sepenuhnya dari layar.","Mencegah fenomena scroll chaining, yaitu ikut tergulirnya halaman utama di latar belakang ketika pengguna sudah mencapai batas paling atas atau paling bawah dari guliran di dalam panel samping tersebut.","Memaksa panel samping hanya bisa digulir menggunakan tombol panah papan ketik.","Mengembalikan posisi gulir ke paling atas setiap 5 detik."],"benar":1,"penjelasan":"Secara bawaan, ketika sebuah kotak bersarang mencapai ujung gulirannya, sisa momentum guliran diteruskan ke elemen induk atau halaman utama (scroll chaining). overscroll-behavior: contain mengisolasi momentum gulir agar berhenti di batas kotak tersebut."},
        {"tanya":"Mengapa kita memasang scroll-margin-block-start: 5rem; pada elemen judul <h2 id=\"bab-1\"> ketika halaman memiliki bilah navigasi atas yang bersifat position: sticky?","opsi":["Untuk menambah jarak putih permanen sebesar 5rem di antara semua paragraf.","Untuk memberi jarak aman (offset) di bagian atas target ketika peramban menggulir menuju tautan #bab-1, sehingga judul <h2> tidak berhenti tersembunyi di balik bilah navigasi sticky.","Untuk mempercepat animasi scroll-behavior: smooth.","Agar elemen <h2> ikut menjadi position: sticky."],"benar":1,"penjelasan":"Berbeda dengan margin-top biasa yang mengubah tata letak aliran halaman, scroll-margin-top (atau logis scroll-margin-block-start) hanya memberi bantalan jarak tambahan terhadap titik henti kotak pandang saat peramban menggulir ke elemen target #id atau scroll snap."}
    ]
},
{
    id: 14,
    kategori: "4 · Gerak & Interaksi",
    judul: "Transisi Antar-Tampilan (View Transition API) dan CSS Anchor Positioning",
    tingkat: "Lanjut", durasi: "9 mnt",
    tag: ["view-transition-name","@view-transition","<div popover>"],
    ringkas: "Menghaluskan perpindahan antarmuka saat DOM berubah atau saat berpindah halaman menggunakan View Transition API (document.startViewTransition dan @view-transition), serta menambatkan posisi popover/tooltip ke elemen pemicu menggunakan CSS Anchor Positioning (anchor-name, position-anchor).",
    isi: `
<h2>1. Mengenal View Transition API: Animasi Perubahan State Tanpa Rumit</h2>
<p>Pernahkah Anda ingin menganimasikan perubahan tata letak—misalnya saat daftar kartu disaring berdasarkan kategori, saat pengguna berpindah tab di dalam halaman, atau saat gambar kecil di katalog membesar menjadi gambar sampul di halaman rincian?</p>
<p>Dulu, menganimasikan perubahan struktur DOM sangatlah sulit karena Anda harus menyimpan koordinat lama, mengubah DOM, lalu menghitung balik selisih posisinya (teknik <em>FLIP</em>).</p>
<p>Kini, <strong>View Transition API</strong> menyelesaikan semuanya secara otomatis:</p>
<ol><li>Peramban memotret tampilan lama (<em>old state snapshot</em>).</li><li>Kode Anda memperbarui DOM (atau berpindah halaman).</li><li>Peramban memotret tampilan baru (<em>new state snapshot</em>), lalu **secara otomatis menganimasikan transisi pudar (<em>cross-fade</em>) sekaligus pergeseran posisi dan ukuran (<em>morphing</em>)** di antara keduanya!</li></ol>
<h3>A. Transisi di Dalam Halaman Tunggal (SPA / Manipulasi DOM)</h3>
<p>Cukup bungkus fungsi pembaruan DOM Anda di dalam <strong><code>document.startViewTransition(() =&gt; { ... })</code></strong> (dengan pemeriksaan progresif agar tetap berjalan lancar di semua peramban):</p>
<pre>function perbaruiTampilanKatalog(kategoriBaru) {
  // Fallback aman jika peramban belum mendukung startViewTransition
  if (!document.startViewTransition) {
    renderKartu(kategoriBaru);
    return;
  }

  // Peramban otomatis menganimasikan perpindahan dari tampilan lama ke tampilan baru!
  document.startViewTransition(() =&gt; {
    renderKartu(kategoriBaru);
  });
}</pre>
<h3>B. Transisi Lintas Halaman Murni CSS (<code>@view-transition</code>)</h3>
<p>Bahkan untuk situs multi-halaman klasik (<em>Multi-Page Application / MPA</em> seperti halaman artikel statis di Kodeloka!), Anda kini dapat mengaktifkan transisi mulus saat pengguna berpindah halaman dalam satu <em>origin</em> yang sama cukup dengan menambahkan aturan <strong><code>@view-transition</code></strong> di berkas CSS kedua halaman (didukung Chrome/Edge 126 dan Safari 18.2; Firefox belum mendukungnya, sehingga di sana halaman tetap berpindah seperti biasa tanpa animasi):</p>
<pre>@view-transition {
  navigation: auto;
}

/* Jika Anda memberi view-transition-name yang unik pada elemen yang sama
   di halaman katalog dan halaman detail, peramban otomatis menganimasikan
   perpindahan posisi dan ukuran elemen tersebut! */
.kartu-php__ikon {
  view-transition-name: ikon-kelas-php;
}

/* Tetap hormati pengguna yang sensitif terhadap gerakan! */
@media (prefers-reduced-motion: reduce) {
  @view-transition {
    navigation: none;
  }
}</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Aturan Penting <code>view-transition-name</code></div><p>Nilai <code>view-transition-name</code> <strong>wajib unik</strong> di antara seluruh elemen yang sedang terlihat di halaman pada saat transisi berlangsung! Jika ada dua elemen yang tampak secara bersamaan memiliki <code>view-transition-name</code> yang sama persis, transisi akan dibatalkan oleh peramban.</p></div>
<h2>2. CSS Anchor Positioning: Menambatkan Popover &amp; Tooltip Tanpa Pustaka JS</h2>
<p>Ketika Anda membuka sebuah <code>&lt;div popover&gt;</code> (dari Pelajaran 12 HTML), secara bawaan elemen popover muncul di tengah layar karena berada di <em>Top Layer</em>. Jika Anda ingin membuat menu tarik-turun (<em>dropdown</em>) atau <em>tooltip</em> yang <strong>menempel tepat di bawah tombol pemicunya</strong>, dulu Anda harus menghitung koordinat <code>getBoundingClientRect()</code> lewat JavaScript dan menangani bagaimana jika menu tersebut mentok di tepi bawah layar!</p>
<p>Spesifikasi baru <strong>CSS Anchor Positioning</strong> mengizinkan Anda menambatkan posisi sebuah elemen langsung ke elemen jangkar (<em>anchor</em>) menggunakan CSS murni:</p>
<ol><li><strong>Pada Tombol Pemicu (Jangkar):</strong> Beri nama jangkar dengan <strong><code>anchor-name: --tombol-profil;</code></strong>.</li><li><strong>Pada Elemen Popover / Tooltip:</strong> Kaitkan ke jangkar tersebut dengan <strong><code>position-anchor: --tombol-profil;</code></strong>, lalu posisikan menggunakan fungsi <strong><code>anchor()</code></strong> atau properti <strong><code>position-area</code></strong>!</li></ol>
<pre>/* 1. Tandai tombol sebagai titik jangkar bernama --jangkar-menu */
#tombol-menu-profil {
  anchor-name: --jangkar-menu;
}

/* 2. Kaitkan panel popover ke jangkar tersebut */
#panel-menu-profil[popover] {
  margin: 0;
  position: fixed;
  position-anchor: --jangkar-menu;

  /* Tempatkan bagian atas panel tepat di bawah bagian bawah tombol (+ jarak 0.5rem),
     dan sejajarkan tepi kirinya dengan tepi kiri tombol! */
  inset-block-start: calc(anchor(bottom) + 0.5rem);
  inset-inline-start: anchor(left);

  /* Otomatis balikkan posisi ke atas tombol jika ruang di bawah layar tidak cukup! */
  position-try-fallbacks: flip-block;
}</pre>
<p>Perhatikan betapa hebatnya <strong><code>position-try-fallbacks: flip-block;</code></strong>: jika tombol berada di bagian paling bawah layar sehingga menu tidak muat ditampilkan ke bawah, peramban <strong>secara otomatis membalikkan posisi menu ke atas tombol</strong> tanpa satu baris JavaScript pun!</p>
<p><em>(Catatan Dukungan Peramban: CSS Anchor Positioning berstatus Baseline Newly Available sejak Januari 2026, didukung di Chrome/Edge 125+, Firefox 147+, dan Safari 26+; peramban yang lebih lama belum mendukungnya, jadi gunakan bersama <code>@supports (anchor-name: --a)</code> sebagai peningkatan progresif di atas posisi popover bawaan).</em></p>
<h2>Latihan Praktik: Penyaringan Katalog dengan View Transition dan Menu Terjangkar</h2>
<p>Buatlah berkas <code>view-transition.html</code> dan <code>vt.css</code>:</p>
<ol><li>Buat daftar 4 kartu dengan tombol filter kategori (<em>Semua</em>, <em>Frontend</em>, <em>Backend</em>) yang memanggil <code>document.startViewTransition()</code> saat menyembunyikan/menampilkan kartu.</li><li>Berikan <code>view-transition-name</code> yang unik pada masing-masing kartu (<code>kartu-1</code>, <code>kartu-2</code>, dst.) sehingga kartu yang tersisa tampak bergeser merapat secara mulus.</li><li>Buat sebuah tombol dan <code>&lt;div popover&gt;</code> yang menggunakan <code>@supports (anchor-name: --menu)</code> untuk menempel tepat di bawah tombolnya.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API" rel="noopener">View Transition API — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition" rel="noopener"><code>@view-transition</code> CSS at-rule — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning" rel="noopener">CSS anchor positioning — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using" rel="noopener">Using CSS anchor positioning — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["view-transition-name","@view-transition","<div popover>","getBoundingClientRect()","anchor-name: --tombol-profil;","position-anchor: --tombol-profil;"],
    kuis: [
        {"tanya":"Apa yang terjadi apabila terdapat dua elemen yang sama-sama sedang terlihat di layar memiliki nilai properti view-transition-name: kartu-utama; yang identik ketika document.startViewTransition() dipanggil?","opsi":["Kedua elemen tersebut menyatu menjadi satu elemen.","Peramban membatalkan (skip) animasi transisi karena setiap view-transition-name yang aktif pada saat yang sama wajib bersifat unik agar peramban tahu pasangan elemen mana yang harus dihubungkan dari tampilan lama ke tampilan baru.","Hanya elemen pertama yang dianimasikan.","Halaman akan dimuat ulang secara otomatis."],"benar":1,"penjelasan":"Mesin View Transition memasangkan satu elemen di snapshot lama dengan satu elemen di snapshot baru berdasarkan view-transition-name-nya. Jika nama tersebut ganda pada elemen yang sama-sama terlihat, pemetaan menjadi ambigu sehingga animasi transisi dilewati."},
        {"tanya":"Aturan CSS apakah yang perlu ditambahkan untuk mengaktifkan View Transition otomatis saat pengguna berpindah antar-halaman (cross-document navigation) dalam satu domain yang sama?","opsi":["@media (transition: page) { body { animate: auto; } }","@view-transition { navigation: auto; }","html { page-transition: smooth; }","@keyframes page-load { from { opacity: 0; } }"],"benar":1,"penjelasan":"At-rule @view-transition { navigation: auto; } pada kedua halaman (halaman asal dan halaman tujuan dalam satu origin) mengaktifkan transisi lintas dokumen secara deklaratif tanpa memerlukan router SPA JavaScript."},
        {"tanya":"Dalam modul CSS Anchor Positioning, apa fungsi dari deklarasi position-try-fallbacks: flip-block; pada sebuah menu popover yang ditambatkan di bawah sebuah tombol?","opsi":["Memutar teks di dalam menu menjadi terbalik 180 derajat.","Menginstruksikan peramban untuk secara otomatis memindahkan posisi menu ke sisi sebaliknya pada sumbu blok (yaitu ke atas tombol) apabila ruang di bawah tombol terlalu sempit dan akan membuat menu terpotong tepi layar.","Mengubah elemen blok menjadi elemen inline.","Menutup popover secara otomatis setelah 3 detik."],"benar":1,"penjelasan":"position-try-fallbacks: flip-block menyediakan strategi deteksi tabrakan tepi layar (collision detection) bawaan CSS: jika posisi utama di bawah jangkar meluber keluar viewport, peramban otomatis mencerminkannya ke atas jangkar."}
    ]
},
{
    id: 15,
    kategori: "5 · Komponen & Arsitektur",
    judul: "Custom Properties (Variabel CSS), @property, light-dark(), dan CSS Nesting",
    tingkat: "Lanjut", durasi: "9 mnt",
    tag: ["@property","light-dark()",":root"],
    ringkas: "Membangun sistem token desain yang dinamis menggunakan variabel CSS (--* dan var()), mendefinisikan tipe variabel dengan @property, menerapkan tema terang dan gelap otomatis dengan light-dark(), serta menulis aturan bersarang dengan CSS Nesting bawaan.",
    isi: `
<h2>1. Variabel CSS (<em>Custom Properties</em>): Lebih Cerdas daripada Variabel Preprocessor</h2>
<p>Sebelum CSS memiliki variabel bawaan, pengembang menggunakan variabel Sass/LESS (<code>$warna-utama</code>). Namun, variabel Sass hanyalah teks yang diganti saat kompilasi (<em>compile-time</em>) dan hilang sepenuhnya ketika berkas CSS sampai di peramban.</p>
<p>Sebaliknya, <strong>CSS Custom Properties (<code>--nama-variabel</code>)</strong> hidup langsung di dalam pohon DOM peramban (<em>runtime</em>):</p>
<ol><li><strong>Mengikuti Kaskade dan Pewarisan DOM:</strong> Variabel yang didefinisikan pada <code>:root</code> tersedia di seluruh halaman, tetapi dapat ditimpa khusus untuk satu komponen (misalnya <code>.kartu-bahaya { --warna-aksen: red; }</code>) tanpa mengubah elemen lain!</li><li><strong>Dapat Diubah lewat <code>@media</code> maupun JavaScript:</strong> Anda cukup mengubah nilai variabel di dalam <code>@media</code> atau lewat <code>elemen.style.setProperty(&quot;--progres&quot;, &quot;80%&quot;)</code>, dan seluruh elemen yang memakainya langsung diperbarui secara reaktif.</li></ol>
<pre>:root {
  --spasi-dasar: 1rem;
  --radius-kartu: 0.75rem;
  --warna-aksen: oklch(55% 0.2 255);
}

.kartu {
  /* Fungsi var() menerima parameter kedua sebagai nilai cadangan (fallback)
     jika variabel pertama belum didefinisikan */
  padding: var(--spasi-kartu, var(--spasi-dasar));
  border-radius: var(--radius-kartu);
  border: 2px solid var(--warna-aksen);
}

/* Cukup ubah nilai variabelnya saja untuk variasi komponen! */
.kartu-peringatan {
  --warna-aksen: oklch(65% 0.18 55);
  --spasi-kartu: 1.5rem;
}</pre>
<h2>2. Tema Terang dan Gelap Modern dengan <code>color-scheme</code> dan <code>light-dark()</code></h2>
<p>Membangun dukungan mode terang (<em>Light Mode</em>) dan mode gelap (<em>Dark Mode</em>) kini jauh lebih bersih berkat kombinasi properti <strong><code>color-scheme</code></strong> dan fungsi <strong><code>light-dark()</code></strong> (status <strong>Baseline Newly Available</strong> sejak Mei 2024):</p>
<ol><li><strong><code>color-scheme: light dark;</code></strong> pada <code>:root</code> memberi tahu peramban agar menyesuaikan tampilan bawaan bilah gulir (<em>scrollbar</em>), kotak kontrol formulir, dan latar belakang bawaan dengan tema sistem operasi pengguna.</li><li><strong><code>light-dark(nilai-terang, nilai-gelap)</code></strong> secara otomatis mengembalikan argumen pertama saat tema aktif adalah terang, dan argumen kedua saat tema aktif adalah gelap—tanpa perlu menduplikasi seluruh variabel di dalam <code>@media (prefers-color-scheme: dark)</code>!</li></ol>
<pre>:root {
  /* Aktifkan dukungan kedua skema warna */
  color-scheme: light dark;

  /* Definisikan token warna semantik dalam satu tempat yang rapi */
  --latar-halaman: light-dark(oklch(98% 0.005 250), oklch(16% 0.015 250));
  --latar-kartu:   light-dark(oklch(100% 0 0),      oklch(22% 0.02 250));
  --teks-utama:    light-dark(oklch(20% 0.02 250),  oklch(95% 0.01 250));
  --teks-redup:    light-dark(oklch(45% 0.02 250),  oklch(72% 0.015 250));
  --garis-batas:   light-dark(oklch(88% 0.01 250),  oklch(32% 0.02 250));
}

/* Jika pengguna memilih tema secara manual lewat tombol di situs,
   kita cukup mengubah color-scheme pada elemen &lt;html&gt;! */
html[data-tema=&quot;terang&quot;] { color-scheme: light; }
html[data-tema=&quot;gelap&quot;]  { color-scheme: dark; }

body {
  background-color: var(--latar-halaman);
  color: var(--teks-utama);
}</pre>
<h2>3. Variabel Bertipe dengan <code>@property</code></h2>
<p>Secara bawaan, peramban menganggap isi variabel <code>--*</code> sebagai string teks bebas, sehingga peramban tidak tahu cara menganimasikan variabel yang berada di dalam <code>linear-gradient()</code> atau memeriksa apakah nilai variabel yang dimasukkan sudah benar.</p>
<p>Aturan <strong><code>@property</code></strong> (status <strong>Baseline Newly Available</strong> sejak Juli 2024) memungkinkan Anda mendaftarkan variabel CSS lengkap dengan <strong>tipe data (<code>syntax</code>)</strong>, <strong>apakah diwariskan (<code>inherits</code>)</strong>, dan <strong>nilai awalnya (<code>initial-value</code>)</strong>:</p>
<pre>@property --sudut-gradien {
  syntax: &quot;&lt;angle&gt;&quot;;
  inherits: false;
  initial-value: 0deg;
}

.bingkai-kilau {
  background: linear-gradient(var(--sudut-gradien), #2563eb, #06b6d4);
  transition: --sudut-gradien 400ms ease;
}

.bingkai-kilau:hover {
  /* Karena --sudut-gradien terdaftar sebagai &lt;angle&gt;, peramban dapat
     menganimasikan perputaran sudut gradien ini secara mulus! */
  --sudut-gradien: 180deg;
}</pre>
<h2>4. CSS Nesting Bawaan (<em>Native CSS Nesting</em>)</h2>
<p>Dulu, menulis aturan CSS bersarang (<em>nesting</em>) mengharuskan penggunaan preprocessor seperti Sass. Kini, <strong>CSS Nesting bawaan</strong> sudah berstatus <strong>Baseline Widely Available</strong> (sejak Desember 2023) dan dapat langsung dijalankan oleh semua peramban modern tanpa langkah kompilasi!</p>
<p>Di dalam CSS Nesting bawaan, simbol <strong><code>&amp;</code></strong> mewakili selektor induk tempat aturan tersebut bersarang:</p>
<pre>.kartu-modul {
  padding: 1.5rem;
  border: 1px solid var(--garis-batas);
  border-radius: 0.75rem;
  background-color: var(--latar-kartu);

  /* 1. Bersarang untuk elemen anak (setara dengan .kartu-modul h3) */
  &amp; h3 {
    margin-block-end: 0.5rem;
    font-size: 1.25rem;
  }

  /* 2. Bersarang untuk pseudo-class pada elemen itu sendiri (.kartu-modul:hover) */
  &amp;:hover,
  &amp;:focus-within {
    border-color: oklch(55% 0.2 255);
  }

  /* 3. Bersarang untuk @media atau @container langsung di dalam komponen! */
  @media (width &gt;= 48rem) {
    padding: 2rem;
  }
}</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Dua Aturan Bijak Menggunakan CSS Nesting</div><ol><li><strong>Batasi kedalaman maksimal 2–3 tingkat:</strong> Jangan menyarangkan selektor hingga 5–6 tingkat dalam karena akan menaikkan spesifisitas dan mengikat CSS terlalu kaku pada struktur tag HTML.</li><li><strong>Tidak mendukung penggabungan nama string seperti Sass (<code>&amp;-judul</code>):</strong> Di CSS Nesting asli, menulis <code>&amp;-judul</code> <strong>tidak</strong> akan menghasilkan <code>.kartu-modul-judul</code>. Gunakan <code>&amp;</code> untuk pseudo-class (<code>&amp;:hover</code>), modifier kelas (<code>&amp;.aktif</code>), atau selektor anak (<code>&amp; &gt; .judul</code>).</li></ol></div>
<h2>Latihan Praktik: Komponen Kartu dengan Saklar Tema Terang/Gelap dan Nesting</h2>
<p>Buatlah berkas <code>variabel-nesting.html</code> dan <code>nesting.css</code>:</p>
<ol><li>Definisikan variabel warna semantik di <code>:root</code> menggunakan <code>color-scheme: light dark</code> dan fungsi <code>light-dark()</code>.</li><li>Tulis gaya <code>.kartu-interaktif</code> menggunakan <strong>CSS Nesting bawaan</strong> (mencakup <code>&amp; header</code>, <code>&amp;:hover</code>, dan <code>@media (width &gt;= 40rem)</code>).</li><li>Tambahkan tiga tombol sederhana (<code>Sistem</code>, <code>Terang</code>, <code>Gelap</code>) yang mengubah atribut <code>data-tema</code> pada <code>&lt;html&gt;</code> untuk menguji perpindahan tema secara langsung!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables" rel="noopener">CSS custom properties for cascading variables — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting/Using" rel="noopener">Using CSS nesting — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme" rel="noopener"><code>prefers-color-scheme</code> CSS media feature — MDN Web Docs</a></li></ul></div>
`,
    perintah: [":root","light-dark()","@media","color-scheme","@property","&"],
    kuis: [
        {"tanya":"Apa keuntungan utama dari CSS Custom Properties (--warna-utama) dibandingkan variabel preprocessor seperti Sass ($warna-utama)?","opsi":["Variabel CSS tidak memerlukan tanda titik koma di akhir baris.","Variabel CSS hidup di dalam DOM peramban saat runtime, mengikuti aturan kaskade/pewarisan elemen, dan nilainya dapat diubah secara dinamis melalui @media query maupun JavaScript tanpa perlu mengompilasi ulang berkas CSS.","Variabel CSS otomatis mengenkripsi kode warna agar tidak bisa dilihat di DevTools.","Variabel CSS memiliki spesifisitas yang lebih tinggi daripada !important."],"benar":1,"penjelasan":"Variabel preprocessor habis diterjemahkan menjadi nilai statis sebelum dikirim ke peramban. Sebaliknya, variabel CSS (--*) dievaluasi secara langsung oleh peramban, mewarisi nilai dari induk ke anak di pohon DOM, dan dapat diperbarui kapan saja saat halaman sedang berjalan."},
        {"tanya":"Bagaimana cara kerja fungsi warna light-dark(oklch(98% 0 0), oklch(15% 0 0)) di CSS modern?","opsi":["Mencampurkan kedua warna tersebut menjadi warna abu-abu rata-rata 50%.","Memilih warna pertama ketika color-scheme efektif pada elemen tersebut adalah light (terang), dan memilih warna kedua ketika color-scheme efektifnya adalah dark (gelap).","Mengubah warna latar dari terang di bagian atas menjadi gelap di bagian bawah seperti gradien.","Hanya bekerja jika pengguna mengaktifkan mode kontras tinggi."],"benar":1,"penjelasan":"Fungsi light-dark() mengevaluasi skema warna aktif elemen (yang ditentukan oleh deklarasi color-scheme: light dark serta preferensi tema sistem operasi atau nilai color-scheme pada elemen induk) dan mengembalikan warna yang sesuai tanpa memerlukan blok @media (prefers-color-scheme: dark) terpisah."},
        {"tanya":"Mengapa aturan @property dibutuhkan apabila kita ingin menganimasikan sebuah variabel CSS (misalnya --sudut) yang dipakai di dalam linear-gradient(var(--sudut), blue, cyan)?","opsi":["Karena variabel biasa tidak boleh diawali dengan tanda --.","Karena secara bawaan peramban memperlakukan variabel CSS sebagai token teks tanpa tipe, sehingga dengan mendaftarkan syntax: \"<angle>\" lewat @property, peramban memahami bahwa nilainya adalah sudut angka yang dapat diinterpolasi (dianimasikan) dari 0deg ke 180deg.","Karena linear-gradient hanya menerima warna heksadesimal.","Karena @property memindahkan eksekusi CSS ke sisi server."],"benar":1,"penjelasan":"Tanpa @property, peramban tidak mengetahui tipe matematis dari variabel --sudut sehingga perubahan nilainya dilakukan secara lompatan patah (diskrit) di tengah durasi transisi. Mendaftarkan syntax: \"<angle>\" memberi tahu mesin CSS cara menghitung nilai antaranya di setiap bingkai animasi."}
    ]
},
{
    id: 16,
    kategori: "5 · Komponen & Arsitektur",
    judul: "Menata Formulir dan Tabel Modern (accent-color, appearance, :focus-within, Sticky Table)",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["accent-color","appearance",":focus-within"],
    ringkas: "Menata ulang kontrol formulir secara konsisten dan aksesibel menggunakan accent-color, caret-color, appearance: none, :focus-within, :placeholder-shown, field-sizing: content, serta merancang tabel data dengan kepala menempel (sticky header).",
    isi: `
<h2>Mengapa Kontrol Formulir Terkenal Sulit Ditata di Masa Lalu?</h2>
<p>Elemen formulir seperti <code>&lt;input type=&quot;checkbox&quot;&gt;</code>, <code>&lt;input type=&quot;radio&quot;&gt;</code>, <code>&lt;input type=&quot;range&quot;&gt;</code>, <code>&lt;progress&gt;</code>, dan <code>&lt;select&gt;</code> dulunya digambar langsung menggunakan widget bawaan sistem operasi (<em>native OS controls</em>), sehingga pengembang kesulitan menyelaraskan warnanya dengan identitas warna merek situs.</p>
<p>Kini, CSS modern menyediakan properti khusus yang membuat penataan formulir menjadi jauh lebih bersih tanpa mengorbankan aksesibilitas papan ketik!</p>
<h2>1. Mengubah Warna Kontrol Bawaan dalam Satu Baris dengan <code>accent-color</code></h2>
<p>Properti <strong><code>accent-color</code></strong> (di MDN berstatus <em>Limited availability</em>: Chrome untuk Android dan Safari sebelum 26.2 belum menjaga kontras minimum kontrol) memungkinkan Anda mengubah warna centang pada <code>&lt;input type=&quot;checkbox&quot;&gt;</code>, bulatan <code>&lt;input type=&quot;radio&quot;&gt;</code>, batang <code>&lt;input type=&quot;range&quot;&gt;</code>, dan <code>&lt;progress&gt;</code> cukup dengan <strong>satu baris deklarasi</strong>—dan peramban desktop umumnya otomatis memilih warna tanda centang (putih atau hitam) yang kontras dengan warna aksen pilihan Anda. Namun Chrome untuk Android dan Safari sebelum 26.2 tidak menjamin kontras minimum tersebut, jadi tetap pilih warna aksen yang cukup kontras!</p>
<pre>:root {
  /* Seluruh checkbox, radio, range slider, dan progress bar otomatis mengikuti warna merek! */
  accent-color: oklch(55% 0.2 255);
}

/* Mengubah warna kursor ketik (blinking caret) di dalam input dan textarea */
input,
textarea {
  caret-color: oklch(55% 0.2 255);
}

/* Membatasi agar textarea hanya boleh ditarik ukurannya secara vertikal (atas-bawah),
   sehingga tidak merusak lebar kolom formulir saat ditarik pengguna! */
textarea {
  resize: vertical;
  min-block-size: 6rem;
}</pre>
<div class="callout info"><div class="callout-judul">💡 Fitur Progresif Baru: <code>field-sizing: content</code> pada <code>&lt;textarea&gt;</code>!</div><p>Menambahkan <code>field-sizing: content;</code> pada <code>&lt;textarea&gt;</code> (didukung Chrome/Edge sejak versi 123, Safari 26.2, dan Firefox 152; Baseline Newly Available sejak Juni 2026, peramban lama mengabaikannya) membuat tinggi kotak teks <strong>otomatis membesar dan menyusut mengikuti jumlah baris yang diketikkan pengguna</strong> tanpa memerlukan satu baris JavaScript pun! Tetap pasangkan dengan <code>min-block-size: 4rem</code> dan <code>max-block-size: 20rem</code> sebagai batas aman.</p></div>
<h2>2. Kustomisasi Penuh Checkbox/Radio dengan <code>appearance: none</code></h2>
<p>Jika Anda membutuhkan bentuk kotak centang atau saklar geser (<em>toggle switch</em>) yang benar-benar kustom, <strong>jangan menyembunyikan <code>&lt;input type=&quot;checkbox&quot;&gt;</code> dengan <code>display: none</code>!</strong> (Karena <code>display: none</code> membuat kotak centang tidak bisa lagi difokuskan dengan tombol <code>Tab</code> di papan ketik!).</p>
<p>Sebagai gantinya, gunakan <strong><code>appearance: none</code></strong> langsung pada elemen <code>&lt;input type=&quot;checkbox&quot;&gt;</code> sehingga perilaku asli, fokus papan ketik, dan pembacaannya di <em>screen reader</em> tetap utuh 100%, sementara Anda bebas menata kotak visualnya dengan CSS:</p>
<pre>input[type=&quot;checkbox&quot;].kotak-kustom {
  appearance: none;
  margin: 0;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border: 2px solid #64748b;
  border-radius: 0.25rem;
  display: grid;
  place-content: center;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease;

  &amp;::before {
    content: &quot;&quot;;
    inline-size: 0.65rem;
    block-size: 0.65rem;
    scale: 0;
    transition: scale 120ms ease-in-out;
    background-color: #ffffff;
    /* Membentuk tanda centang tajam dengan clip-path */
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }

  &amp;:checked {
    background-color: #2563eb;
    border-color: #2563eb;
  }

  &amp;:checked::before {
    scale: 1;
  }

  &amp;:focus-visible {
    outline: 3px solid #93c5fd;
    outline-offset: 2px;
  }
}</pre>
<h2>3. Pseudo-Class Formulir Interaktif: <code>:focus-within</code>, <code>:placeholder-shown</code>, dan <code>:disabled</code></h2>
<ul><li><strong><code>:focus-within</code>:</strong> Cocok pada sebuah elemen pembungkus (misalnya <code>.kotak-pencarian</code> atau <code>&lt;form&gt;</code>) apabila <strong>salah satu elemen anak di dalamnya sedang menerima fokus</strong>! Sangat berguna untuk menyorot seluruh bingkai grup input yang memiliki ikon di kiri dan tombol hapus di kanan.</li><li><strong><code>:placeholder-shown</code>:</strong> Cocok ketika <code>&lt;input&gt;</code> masih kosong dan sedang menampilkan teks <code>placeholder</code>-nya (sering dipakai untuk membuat efek <em>floating label</em> murni CSS).</li><li><strong><code>:disabled</code> dan <code>:read-only</code>:</strong> Menata tampilan input yang sedang dikunci.</li></ul>
<pre>/* Menyorot pembungkus kotak pencarian saat input di dalamnya diklik/difokuskan */
.pembungkus-cari {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 0.5rem;

  &amp;:focus-within {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgb(37 99 235 / 0.15);
  }
}</pre>
<h2>4. Menata Tabel Data Profesional dengan <em>Sticky Header</em> dan <em>Zebra Striping</em></h2>
<p>Untuk tabel data yang memiliki puluhan baris dan kolom angka:</p>
<pre>.wadah-tabel {
  max-block-size: 28rem;
  overflow: auto;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}

.tabel-data {
  inline-size: 100%;
  border-collapse: collapse;
  text-align: start;
  font-size: 0.9375rem;

  &amp; th,
  &amp; td {
    padding: 0.75rem 1rem;
    border-block-end: 1px solid #e2e8f0;
  }

  /* Membuat baris judul kolom tetap menempel di bagian atas saat tabel digulir! */
  &amp; thead th {
    position: sticky;
    inset-block-start: 0;
    z-index: 2;
    background-color: #f8fafc;
    font-weight: 600;
    box-shadow: inset 0 -1px 0 #cbd5e1;
  }

  /* Zebra striping: memberi warna latar selang-seling pada baris genap di tbody */
  &amp; tbody tr:nth-child(even) {
    background-color: #f8fafc;
  }

  /* Perataan kanan dan angka tabular khusus untuk kolom numerik */
  &amp; .kolom-angka {
    text-align: end;
    font-variant-numeric: tabular-nums;
  }
}</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Catatan Teknis <code>position: sticky</code> pada Tabel</div><p>Sebaiknya jangan memasang <code>position: sticky</code> pada elemen <code>&lt;thead&gt;</code> atau <code>&lt;tr&gt;</code> (dukungannya secara historis tidak konsisten antar-peramban), melainkan pasang langsung pada elemen <strong><code>&lt;th&gt;</code> di dalam <code>&lt;thead&gt;</code></strong> (<code>thead th { position: sticky; top: 0; }</code>) dan berikan <code>background-color</code> yang solid agar teks baris di bawahnya tidak tembus membayang saat digulir!</p></div>
<h2>Latihan Praktik: Formulir Pengaturan Akun dan Tabel Riwayat Transaksi</h2>
<p>Buatlah berkas <code>form-dan-tabel.html</code> serta <code>form-tabel.css</code>:</p>
<ol><li>Buat grup kotak pencarian dengan ikon SVG yang menggunakan <code>:focus-within</code> pada pembungkusnya.</li><li>Buat daftar pengaturan notifikasi dengan <code>&lt;input type=&quot;checkbox&quot; class=&quot;kotak-kustom&quot;&gt;</code> berbasis <code>appearance: none</code>.</li><li>Buat tabel riwayat pembayaran dengan <code>thead th</code> yang <code>sticky</code>, baris belang <code>:nth-child(even)</code>, dan kolom nominal uang yang rata kanan dengan <code>tabular-nums</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Images_media_forms" rel="noopener">Images, media, and form elements — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Selectors" rel="noopener">CSS selectors — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_table_basics" rel="noopener">HTML table basics — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["<input type=\"checkbox\">",":focus-within","<input type=\"radio\">","<input type=\"range\">","<progress>","accent-color"],
    kuis: [
        {"tanya":"Mengapa saat membuat tampilan kotak centang (checkbox) kustom di CSS, penggunaan appearance: none pada <input type=\"checkbox\"> jauh lebih baik dibandingkan menyembunyikan <input> tersebut dengan display: none?","opsi":["Karena display: none tidak berfungsi pada elemen <input>.","Karena display: none mengeluarkan <input> dari urutan fokus papan ketik (Tab) dan Accessibility Tree pembaca layar; sedangkan appearance: none hanya menghapus tampilan visual bawaan sistem operasi sambil mempertahankan seluruh interaksi papan ketik (Tab dan Space), validasi form, dan aksesibilitas bawaan.","Karena appearance: none otomatis mengirim data tanpa tombol submit.","Karena display: none mengubah tipe input menjadi text."],"benar":1,"penjelasan":"Dengan appearance: none, elemen <input type=\"checkbox\"> tetap merupakan kotak centang HTML asli yang dapat difokuskan, ditekan dengan tombol Spasi, dan dikenali oleh pembaca layar, namun kanvas visualnya siap ditata sepenuhnya dengan CSS dan ::before."},
        {"tanya":"Pada elemen manakah properti position: sticky; inset-block-start: 0; sebaiknya dipasang agar kepala tabel tetap menempel di bagian atas ketika wadah tabel digulir?","opsi":["Pada elemen <table>.","Langsung pada elemen sel kepala thead th (disertai background-color yang tidak transparan).","Pada elemen <caption>.","Pada elemen <tfoot>."],"benar":1,"penjelasan":"Dalam spesifikasi perenderan tabel di peramban, menerapkan position: sticky; top: 0; langsung pada sel thead th adalah cara yang paling konsisten lintas peramban untuk menjaga judul kolom tetap menempel saat isi <tbody> digulir."},
        {"tanya":"Apa fungsi dari pseudo-class :focus-within ketika dipasang pada elemen <div class=\"grup-input\">?","opsi":["Memfokuskan semua input di dalam <div> secara bersamaan saat halaman dibuka.","Menerapkan gaya pada .grup-input ketika elemen .grup-input itu sendiri atau salah satu elemen anak/keturunan di dalamnya (seperti <input> atau <button>) sedang menerima fokus.","Mengunci fokus agar pengguna tidak bisa keluar dari .grup-input.","Menghapus cincin fokus pada elemen anak."],"benar":1,"penjelasan":":focus-within sangat berguna untuk menata kontainer pembungkus komponen (seperti bilah pencarian terpadu atau kartu formulir) ketika pengguna sedang mengetik atau memfokuskan salah satu kontrol di dalamnya."}
    ]
},
{
    id: 17,
    kategori: "5 · Komponen & Arsitektur",
    judul: "Arsitektur CSS Skala Aplikasi, Konvensi BEM, dan Debugging di DevTools",
    tingkat: "Lanjut", durasi: "11 mnt",
    tag: ["@layer","grid","flex"],
    ringkas: "Mengelola kode CSS pada proyek besar agar tetap rapi dan bebas benturan nama menggunakan konvensi penamaan BEM, struktur lapisan @layer, desain token, serta teknik sistematis mendiagnosis masalah tata letak menggunakan Browser DevTools.",
    isi: `
<h2>Mengapa Proyek CSS yang Membesar Sering Menjadi &quot;Append-Only Stylesheet&quot;?</h2>
<p>Pada proyek kecil dengan 100 baris CSS, menamai kelas secara acak seperti <code>.biru</code>, <code>.kotak-kiri</code>, atau <code>.header ul li a</code> terasa cepat. Namun, ketika tim bertambah besar dan kode mencapai ribuan baris, muncul ketakutan klasik: <strong>pengembang takut menghapus atau mengubah aturan CSS yang sudah ada karena khawatir merusak halaman lain yang tidak terduga</strong>. Akibatnya, orang hanya berani menambahkan aturan baru di baris paling bawah berkas CSS (<em>append-only stylesheet</em>).</p>
<p>Untuk mencegah kekacauan tersebut, kita membutuhkan <strong>arsitektur penamaan dan pelapisan yang terprediksi</strong>.</p>
<h2>1. Konvensi Penamaan BEM (<em>Block, Element, Modifier</em>)</h2>
<p><strong>BEM</strong> adalah metodologi penamaan kelas yang membuat hubungan struktur komponen terlihat jelas langsung dari nama kelasnya, sekaligus menjaga <strong>spesifisitas tetap datar di <code>(0, 1, 0)</code></strong> (satu kelas tunggal):</p>
<ol><li><strong>Block (<code>nama-blok</code>):</strong> Komponen mandiri yang bermakna utuh dan dapat dipindahkan ke mana saja. Contoh: <code>.kartu-modul</code>, <code>.navigasi-utama</code>, <code>.form-masuk</code>.</li><li><strong>Element (<code>nama-blok__nama-elemen</code> — dipisahkan dua garis bawah <code>__</code>):</strong> Bagian internal dari suatu <em>Block</em> yang tidak memiliki arti mandiri di luar blok tersebut. Contoh: <code>.kartu-modul__judul</code>, <code>.kartu-modul__ringkasan</code>, <code>.kartu-modul__kaki</code>.</li><li><strong>Modifier (<code>nama-blok--variasi</code> atau <code>nama-blok__elemen--variasi</code> — dipisahkan dua tanda hubung <code>--</code>):</strong> Penanda variasi tampilan, ukuran, atau status dari <em>Block</em> maupun <em>Element</em>. Contoh: <code>.kartu-modul--unggulan</code>, <code>.tombol--bahaya</code>, <code>.tombol--besar</code>.</li></ol>
<pre>&lt;!-- Contoh Penerapan BEM yang Bersih dan Terbaca --&gt;
&lt;article class=&quot;kartu-modul kartu-modul--unggulan&quot;&gt;
  &lt;header class=&quot;kartu-modul__kepala&quot;&gt;
    &lt;span class=&quot;kartu-modul__lencana&quot;&gt;Baru&lt;/span&gt;
    &lt;h3 class=&quot;kartu-modul__judul&quot;&gt;Arsitektur CSS Modern&lt;/h3&gt;
  &lt;/header&gt;
  &lt;p class=&quot;kartu-modul__ringkasan&quot;&gt;
    Pelajari cara menyusun stylesheet yang mudah dirawat untuk jangka panjang.
  &lt;/p&gt;
  &lt;footer class=&quot;kartu-modul__kaki&quot;&gt;
    &lt;a href=&quot;/css/materi/12/&quot; class=&quot;tombol tombol--utama&quot;&gt;Mulai Belajar&lt;/a&gt;
  &lt;/footer&gt;
&lt;/article&gt;</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Kesalahan Umum BEM: Menulis <code>blok__elemen1__elemen2</code>!</div><p>Jangan pernah mencerminkan kedalaman sarang HTML di dalam nama kelas BEM seperti <code>.kartu-modul__kepala__judul</code>! Jika suatu saat <code>&lt;h3 class=&quot;kartu-modul__judul&quot;&gt;</code> dipindahkan keluar dari <code>&lt;header class=&quot;kartu-modul__kepala&quot;&gt;</code>, nama kelas <code>.kartu-modul__judul</code> tetap valid dan Anda tidak perlu mengubah CSS sedikit pun. Selalu gunakan maksimal satu pasang <code>__</code> (<code>blok__elemen</code>).</p></div>
<h2>2. Menggabungkan Arsitektur Lapisan (<code>@layer</code>) dengan Design Tokens</h2>
<p>Dalam proyek modern, kita dapat memadukan kejelasan nama komponen dengan ketegasan urutan <strong><code>@layer</code></strong>:</p>
<pre>/* Urutan arsitektur dari paling dasar ke paling spesifik */
@layer reset, token, dasar, tata-letak, komponen, utilitas;

/* 1. Reset perbedaan bawaan antar-peramban */
@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
  body, h1, h2, h3, p, figure { margin: 0; }
  img, picture, video, svg { display: block; max-inline-size: 100%; }
  input, button, textarea, select { font: inherit; }
}

/* 2. Design Tokens (Sumber kebenaran tunggal untuk warna, ukuran, dan spasi) */
@layer token {
  :root {
    color-scheme: light dark;
    --warna-permukaan: light-dark(oklch(99% 0.002 250), oklch(17% 0.015 250));
    --warna-teks:      light-dark(oklch(20% 0.02 250),  oklch(94% 0.01 250));
    --warna-aksen:     oklch(58% 0.2 255);
    --spasi-sm: 0.5rem;
    --spasi-md: 1rem;
    --spasi-lg: 1.5rem;
    --radius-md: 0.5rem;
  }
}

/* 3. Gaya Dasar Elemen HTML Tanpa Kelas */
@layer dasar {
  body {
    font-family: system-ui, sans-serif;
    line-height: 1.6;
    background-color: var(--warna-permukaan);
    color: var(--warna-teks);
  }
}

/* 4. Kerangka Tata Letak Makro */
@layer tata-letak {
  .kontainer {
    inline-size: min(100% - 2rem, 1140px);
    margin-inline: auto;
  }
}

/* 5. Komponen Mandiri */
@layer komponen {
  .kartu-modul {
    padding: var(--spasi-lg);
    border-radius: var(--radius-md);
  }
}

/* 6. Kelas Utilitas Satu Fungsi (Selalu menang atas komponen tanpa !important) */
@layer utilitas {
  .rata-tengah { text-align: center; }
  .sembunyi-visual {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}</pre>
<p>Perhatikan kelas <code>.sembunyi-visual</code> (<em>visually-hidden / sr-only</em>) di atas: pola standar ini menyembunyikan teks secara visual dari layar, tetapi <strong>tetap membiarkannya dibaca oleh pembaca layar</strong> (berbeda dengan <code>display: none</code> atau <code>visibility: hidden</code> yang membungkam pembaca layar).</p>
<h2>3. Debugging CSS Secara Sistematis di Browser DevTools</h2>
<p>Jangan pernah memperbaiki masalah CSS dengan cara menebak-nebak dan menambahkan properti secara acak! Gunakan alat inspeksi bawaan peramban (<strong>Developer Tools — <code>F12</code></strong>) secara sistematis:</p>
<h3>Langkah 1: Periksa Tab <em>Styles</em> dan <em>Computed</em></h3>
<ol><li>Klik kanan elemen yang bermasalah → <strong>Inspect</strong>.</li><li>Di panel <strong>Styles</strong>, perhatikan aturan mana yang **dicoret (<em>strikethrough</em>)**. Aturan yang dicoret berarti kalah dalam algoritma Cascade/spesifisitas, atau memiliki nilai sintaks yang tidak valid (ditandai ikon peringatan kuning ⚠️).</li><li>Buka tab <strong>Computed</strong> di sebelah tab <em>Styles</em>. Tab ini menampilkan <strong>nilai akhir sesungguhnya dalam piksel</strong> setelah seluruh perhitungan <code>rem</code>, <code>calc()</code>, dan kaskade selesai. Klik panah kecil di samping properti (misalnya <code>color</code> atau <code>width</code>) untuk langsung melompat ke baris CSS pemenang yang menetapkan nilai tersebut!</li></ol>
<h3>Langkah 2: Aktifkan Lencana Visual <code>grid</code> dan <code>flex</code> di Pohon DOM</h3>
<p>Di dalam panel <strong>Elements / Inspector</strong>, perhatikan adanya lencana kecil bertuliskan <strong><code>grid</code></strong>, <strong><code>subgrid</code></strong>, <strong><code>flex</code></strong>, atau <strong><code>container</code></strong> di samping tag HTML.</p>
<ul><li>Klik lencana <strong><code>grid</code></strong> atau <strong><code>flex</code></strong> tersebut! Peramban akan langsung menggambar garis bantu nomor kolom, area <code>gap</code> yang diarsir, dan batas jalur tepat di atas halaman web Anda.</li></ul>
<h3>Langkah 3: Memaksa Status Interaksi (<code>:hover</code>, <code>:focus-visible</code>, <code>:active</code>)</h3>
<p>Ingin memeriksa tampilan menu yang hanya muncul saat <code>:hover</code> atau <code>:focus-visible</code> tanpa harus menahan tetikus?</p>
<ul><li>Di panel <strong>Styles</strong>, klik tombol <strong><code>:hov</code></strong> (<em>Toggle Element State</em>), lalu centang kotak <code>:hover</code>, <code>:focus</code>, <code>:focus-visible</code>, atau <code>:active</code>. Anda juga dapat mengemulasikan tema gelap (<code>prefers-color-scheme: dark</code>) dan <code>prefers-reduced-motion</code> langsung lewat tab <strong>Rendering</strong> di DevTools Chrome/Edge, atau lewat tombol simulasi skema warna di panel <strong>Rules</strong> pada Firefox!</li></ul>
<h3>Langkah 4: Mencari Penyebab Munculnya Scrollbar Horizontal Misterius</h3>
<p>Jika halaman ponsel Anda tiba-tiba bisa digeser ke kanan (ada elemen yang meluber keluar layar), jalankan skrip singkat ini di <strong>Console DevTools</strong> untuk mencetak elemen mana pun yang tepi kanannya melewati lebar layar:</p>
<pre>// Jalankan di Console DevTools untuk menemukan elemen yang bocor melewati lebar viewport
const lebarLayar = document.documentElement.clientWidth;
document.querySelectorAll(&quot;*&quot;).forEach((el) =&gt; {
  const kanan = el.getBoundingClientRect().right;
  if (kanan &gt; lebarLayar) {
    console.warn(&quot;Elemen meluber:&quot;, el, Math.round(kanan));
  }
});</pre>
<h2>Latihan Praktik: Merapikan Stylesheet yang Berantakan ke Arsitektur BEM &amp; <code>@layer</code></h2>
<p>Buatlah berkas <code>arsitektur-bem.html</code> dan <code>arsitektur.css</code>:</p>
<ol><li>Susun <code>@layer reset, token, dasar, komponen, utilitas;</code> di awal berkas CSS.</li><li>Buat komponen <code>.panel-peringatan</code> dengan elemen <code>.panel-peringatan__ikon</code>, <code>.panel-peringatan__isi</code>, serta dua variasi modifier <code>.panel-peringatan--info</code> dan <code>.panel-peringatan--bahaya</code> yang hanya mengubah nilai variabel <code>--warna-panel</code> di dalamnya.</li><li>Sertakan kelas utilitas <code>.sembunyi-visual</code> untuk memberikan keterangan tambahan khusus pembaca layar.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Organizing" rel="noopener">Organizing your CSS — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Debugging_CSS" rel="noopener">Debugging CSS — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade" rel="noopener">CSS cascading and inheritance — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["@layer","grid","flex",":hover",":focus-visible","__"],
    kuis: [
        {"tanya":"Dalam metodologi penamaan kelas **BEM (Block, Element, Modifier), bagaimana cara penulisan nama kelas yang tepat untuk elemen judul yang berada di dalam komponen kartu berita, serta variasi kartu berita yang berstatus utama**?","opsi":[".kartu-berita-judul dan .kartu-berita.utama",".kartu-berita__judul dan .kartu-berita--utama",".kartuBerita__judul dan .kartuBerita_utama","#kartu-berita .judul dan #kartu-berita.utama"],"benar":1,"penjelasan":"Dalam konvensi BEM standar, Element (bagian internal dari blok) dipisahkan dengan dua garis bawah (__ → .kartu-berita__judul), sedangkan Modifier (variasi tampilan atau status) dipisahkan dengan dua tanda hubung (-- → .kartu-berita--utama)."},
        {"tanya":"Mengapa kita membutuhkan kelas utilitas .sembunyi-visual (visually-hidden) yang menggunakan width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); alih-alih cukup menulis display: none;?","opsi":["Karena display: none tidak didukung di dalam Flexbox.","Karena display: none menyembunyikan elemen secara visual sekaligus menghapusnya dari Accessibility Tree sehingga tidak dibacakan oleh pembaca layar, sedangkan .sembunyi-visual menyembunyikan teks dari layar namun tetap membiarkannya dibaca oleh pembaca layar.","Karena display: none memperlambat pemuatan halaman.","Karena .sembunyi-visual membuat teks otomatis diterjemahkan ke bahasa lain."],"benar":1,"penjelasan":"Sering kali suatu komponen sudah jelas secara visual bagi pengguna awas (misalnya tabel dengan kolom tombol aksi tanpa judul teks), tetapi tetap membutuhkan label teks bagi pengguna pembaca layar. Pola .sembunyi-visual menyembunyikan teks secara visual tanpa menghilangkannya dari pembaca layar."},
        {"tanya":"Ketika Anda melihat sebuah deklarasi CSS dicoret (strikethrough) tanpa tanda peringatan kuning di panel Styles pada Browser DevTools, apa arti dari coretan tersebut?","opsi":["Properti CSS tersebut salah ketik atau tidak dikenali oleh peramban.","Deklarasi tersebut valid secara sintaks, tetapi kalah prioritas (ditimpa) oleh aturan CSS lain yang berada di @layer lebih tinggi, memiliki spesifisitas lebih tinggi, atau ditulis lebih bawah.","Berkas CSS gagal diunduh dari server dengan status 404.","Elemen HTML tersebut sedang disembunyikan dengan atribut hidden."],"benar":1,"penjelasan":"Di DevTools, sintaks yang tidak valid ditandai dengan ikon peringatan kuning. Deklarasi yang dicoret bersih tanpa ikon peringatan menandakan bahwa aturan tersebut cocok dengan elemen, namun nilainya dikalahkan oleh deklarasi pemenang lain di dalam algoritma Cascade."}
    ]
},
{
    id: 18,
    kategori: "5 · Komponen & Arsitektur",
    judul: "Merancang Sistem Desain (Design System) dan Komponen UI Aksesibel Tanpa Framework",
    tingkat: "Lanjut", durasi: "9 mnt",
    tag: ["<dialog>","@starting-style",".tombol"],
    ringkas: "Menyusun fondasi Design System yang terukur menggunakan skala token tiga tingkat (primitif, semantik, komponen), tipografi dan spasi harmonis, serta pola CSS produksi untuk komponen Tombol, Lencana (Badge), Kartu, dan Jendela Modal.",
    isi: `
<h2>Apa Itu Design System di Dalam CSS?</h2>
<p>Ketika Anda membangun lebih dari satu halaman web (seperti 23 kelas berbeda di Kodeloka yang semuanya berbagi <code>assets/learning.css</code> dan <code>assets/article.css</code>), Anda membutuhkan bahasa visual yang konsisten. <strong>Design System</strong> di tingkat CSS bukan berarti membuat ribuan kelas utilitas acak, melainkan mendefinisikan <strong>Token Desain yang Terstruktur</strong> dan <strong>Komponen Dasar yang Dapat Dipakai Ulang</strong>.</p>
<h2>1. Arsitektur Token Tiga Lapis (<em>Three-Tier Token Architecture</em>)</h2>
<p>Jangan langsung menempelkan nilai warna mentah pada komponen! Bagi variabel CSS Anda ke dalam tiga lapisan yang saling merujuk:</p>
<pre>:root {
  color-scheme: light dark;

  /* === LAPIS 1: TOKEN PRIMITIF (Palet Mentah &amp; Skala Angka) === */
  --palet-biru-500:   oklch(58% 0.20 255);
  --palet-biru-600:   oklch(50% 0.20 255);
  --palet-netral-50:  oklch(98% 0.005 250);
  --palet-netral-100: oklch(94% 0.010 250);
  --palet-netral-800: oklch(24% 0.020 250);
  --palet-netral-900: oklch(16% 0.015 250);

  /* === LAPIS 2: TOKEN SEMANTIK (Berdasarkan Peran/Maksud di Antarmuka) === */
  --permukaan-halaman: light-dark(var(--palet-netral-50),  var(--palet-netral-900));
  --permukaan-kartu:   light-dark(#ffffff,                 var(--palet-netral-800));
  --teks-utama:        light-dark(var(--palet-netral-900), var(--palet-netral-50));
  --aksen-interaktif:  var(--palet-biru-500);
  --aksen-sorot:       var(--palet-biru-600);

  /* Skala Spasi Proporsional (Kelipatan 4px / 0.25rem) */
  --ruang-1: 0.25rem; /* 4px */
  --ruang-2: 0.5rem;  /* 8px */
  --ruang-3: 0.75rem; /* 12px */
  --ruang-4: 1rem;    /* 16px */
  --ruang-6: 1.5rem;  /* 24px */
  --ruang-8: 2rem;    /* 32px */
}</pre>
<p>Mengapa memisahkan Lapis 1 (Primitif) dan Lapis 2 (Semantik)? Karena di dalam kode komponen, Anda hanya menulis <code>background-color: var(--permukaan-kartu);</code>. Jika suatu saat tim desain ingin mengubah nuansa mode gelap atau mengganti warna merek utama dari biru menjadi ungu zamrud, Anda cukup mengubah nilai di Lapis 2 tanpa menyentuh ratusan baris komponen!</p>
<h2>2. Pola Komponen Tombol Multi-Varian yang Tangguh (<code>.tombol</code>)</h2>
<p>Sebuah komponen tombol produksi harus:</p>
<ol><li>Bekerja konsisten baik saat dipasang pada <code>&lt;button&gt;</code> maupun <code>&lt;a class=&quot;tombol&quot;&gt;</code>.</li><li>Memiliki ukuran target sentuh minimal <strong><code>2.5rem</code> (<code>40px</code>)</strong> agar ramah jari di layar ponsel (melampaui syarat minimum <code>24px</code> WCAG 2.2 SC 2.5.8 Target Size (Minimum); tingkat AAA pada SC 2.5.5 meminta <code>44px</code>).</li><li>Mendukung ikon SVG di kiri atau kanan teks dengan sejajar sempurna (<code>inline-flex</code>).</li><li>Memiliki varian warna dan ukuran cukup lewat pengubahan variabel lokal (<strong>Lapis 3: Token Komponen</strong>)!</li></ol>
<pre>.tombol {
  /* Token Komponen Lokal (Bawaan: Varian Sekunder/Netral) */
  --btn-latar: var(--permukaan-kartu);
  --btn-teks: var(--teks-utama);
  --btn-batas: oklch(80% 0.01 250);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ruang-2);
  min-block-size: 2.5rem;
  padding-block: var(--ruang-2);
  padding-inline: var(--ruang-4);
  border: 1px solid var(--btn-batas);
  border-radius: 0.5rem;
  background-color: var(--btn-latar);
  color: var(--btn-teks);
  font-weight: 600;
  font-size: 0.9375rem;
  line-height: 1.2;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  transition: background-color 150ms ease, translate 120ms ease;

  &amp;:hover:not(:disabled) {
    background-color: color-mix(in oklch, var(--btn-latar), var(--teks-utama) 8%);
  }

  &amp;:active:not(:disabled) {
    translate: 0 1px;
  }

  &amp;:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  /* Varian Tombol Utama cukup mengubah 3 variabel lokalnya! */
  &amp;.tombol--utama {
    --btn-latar: var(--aksen-interaktif);
    --btn-teks: #ffffff;
    --btn-batas: transparent;

    &amp;:hover:not(:disabled) {
      background-color: var(--aksen-sorot);
    }
  }
}</pre>
<h2>3. Menata Jendela Modal <code>&lt;dialog&gt;</code> dan Transisi <code>@starting-style</code></h2>
<p>Saat Anda membuka <code>&lt;dialog&gt;</code> dengan <code>showModal()</code>, bagaimana cara menganimasikan kemunculannya dari transparan/kecil menjadi penuh secara mulus dengan CSS?</p>
<p>Gunakan at-rule modern <strong><code>@starting-style</code></strong> (status <strong>Baseline Newly Available</strong> sejak 2024) yang mendefinisikan nilai awal sebuah elemen tepat pada bingkai pertama saat ia berubah dari <code>display: none</code> menjadi tampil di layar:</p>
<pre>dialog {
  border: 1px solid oklch(80% 0.01 250 / 0.4);
  border-radius: 0.875rem;
  padding: var(--ruang-6);
  max-inline-size: min(92vw, 32rem);
  background-color: var(--permukaan-kartu);
  color: var(--teks-utama);
  box-shadow: 0 20px 40px -15px rgb(0 0 0 / 0.25);

  opacity: 1;
  scale: 1;
  transition: opacity 200ms ease-out, scale 200ms ease-out;

  /* Kondisi awal tepat saat dialog.showModal() baru saja dipanggil */
  @starting-style {
    opacity: 0;
    scale: 0.95;
  }

  &amp;::backdrop {
    background-color: rgb(15 23 42 / 0.55);
    backdrop-filter: blur(3px);
  }
}</pre>
<h2>Latihan Praktik: Membangun Pustaka Komponen Mini (UI Kit)</h2>
<p>Buatlah berkas <code>ui-kit.html</code> dan <code>ui-kit.css</code> yang menampilkan halaman dokumentasi komponen berisi:</p>
<ol><li>Lapis 1 &amp; Lapis 2 token desain di <code>:root</code>.</li><li>Tiga variasi <code>.tombol</code> (Standar, <code>.tombol--utama</code>, <code>.tombol--bahaya</code>, serta keadaan <code>:disabled</code>) yang menyertakan ikon <code>&lt;svg&gt;</code> di dalamnya.</li><li>Komponen <code>&lt;dialog&gt;</code> yang dianimasikan kemunculannya dengan <code>@starting-style</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables" rel="noopener">CSS custom properties for cascading variables — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Organizing" rel="noopener">Organizing your CSS — MDN Web Docs</a></li><li><a href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html" rel="noopener">Understanding Success Criterion 2.5.8: Target Size (Minimum) — W3C WAI</a></li></ul></div>
`,
    perintah: ["<dialog>","@starting-style",".tombol","assets/learning.css","assets/article.css","<button>"],
    kuis: [
        {"tanya":"Mengapa dalam arsitektur sistem desain kita memisahkan Token Primitif (seperti --biru-500: oklch(58% 0.2 255)) dari Token Semantik (seperti --warna-aksen-utama: var(--biru-500) dan --permukaan-kartu)?","opsi":["Karena CSS tidak mengizinkan fungsi oklch() dipakai langsung pada kelas komponen.","Agar komponen hanya bergantung pada makna peran visualnya (--permukaan-kartu, --teks-utama), sehingga penerapan tema gelap/terang atau perubahan identitas warna merek di masa depan cukup dilakukan dengan memperbarui pemetaan di tingkat Token Semantik tanpa harus mencari dan mengubah ratusan selektor komponen satu per satu.","Karena variabel yang merujuk variabel lain (var(--a)) berjalan dua kali lebih cepat.","Agar nama variabel tidak bisa dibaca di DevTools."],"benar":1,"penjelasan":"Pemisahan token primitif (nilai apa) dan token semantik (dipakai untuk peran apa) adalah kunci skalabilitas sistem desain: komponen tetap bersih dan agnostik terhadap tema, sementara logika warna terpusat di lapisan token semantik."},
        {"tanya":"Masalah klasik apa yang diselesaikan oleh at-rule @starting-style di CSS modern?","opsi":["Mengatur gaya huruf pertama pada paragraf pembuka artikel.","Memungkinkan peramban menjalankan transisi CSS (transition) saat sebuah elemen baru saja ditambahkan ke DOM atau baru saja berubah dari display: none menjadi tampil (seperti saat <dialog> atau [popover] dibuka), dengan mendefinisikan nilai awal transisi tersebut.","Memuat berkas CSS sebelum berkas HTML diunduh.","Mereset seluruh margin bawaan peramban."],"benar":1,"penjelasan":"Dulu, elemen yang baru muncul dari display: none tidak memiliki \"nilai bingkai sebelumnya\" (before-change style) sehingga transition tidak dapat berjalan. @starting-style menetapkan gaya awal tempat transisi dimulai ketika elemen pertama kali ditampilkan."},
        {"tanya":"Mengapa pada komponen .tombol kita menambahkan :hover:not(:disabled) alih-alih hanya :hover?","opsi":["Agar tombol berubah warna menjadi merah saat dinonaktifkan.","Agar efek perubahan warna sorotan (hover) tidak aktif ketika tombol sedang dalam keadaan mati (disabled), sehingga tidak memberi kesan keliru kepada pengguna bahwa tombol yang mati tersebut masih bisa diklik.","Karena pseudo-class :hover tidak valid pada elemen <button>.","Agar tombol otomatis hilang saat dinonaktifkan."],"benar":1,"penjelasan":"Tombol yang memiliki atribut disabled tidak boleh merespons sorotan tetikus dengan efek perubahan warna atau gerakan naik-turun seolah-olah aktif. Menggabungkan :hover:not(:disabled) memastikan umpan balik visual hanya muncul pada tombol yang benar-benar siap diklik."}
    ]
},
{
    id: 19,
    kategori: "6 · Performa & Proyek",
    judul: "Optimasi Performa Rendering CSS: content-visibility: auto, contain, dan Pencegahan Layout Thrashing",
    tingkat: "Lanjut", durasi: "9 mnt",
    tag: ["content-visibility: auto","contain","<section>"],
    ringkas: "Mempercepat waktu pemuatan dan perenderan halaman panjang secara drastis menggunakan content-visibility: auto dan contain-intrinsic-size, memahami isolasi perhitungan peramban dengan properti contain, serta menghindari Forced Synchronous Layout.",
    isi: `
<h2>Mengapa Halaman dengan Ratusan Elemen Bisa Terasa Berat Saat Dimuat?</h2>
<p>Pada Pelajaran 13 HTML, kita telah mempelajari <code>loading=&quot;lazy&quot;</code> yang menunda pengunduhan gambar di bawah layar. Namun, bagaimana dengan **perhitungan gaya (<em>Recalculate Style</em>), perhitungan tata letak (<em>Layout</em>), dan penggambaran (<em>Paint</em>) untuk ratusan kartu, tabel, atau komentar panjang yang berada jauh di bawah layar**?</p>
<p>Secara bawaan, saat sebuah halaman panjang dibuka, peramban tetap wajib menghitung ukuran dan tata letak dari <strong>seluruh elemen dari baris pertama hingga baris ke-5.000 di paling bawah halaman</strong>, meskipun pengguna baru melihat bagian paling atas!</p>
<h2>1. Melompati Rendering di Luar Layar dengan <code>content-visibility: auto</code></h2>
<p>Properti <strong><code>content-visibility: auto</code></strong> (status <strong>Baseline Newly Available</strong> sejak 2024 di semua peramban utama) bekerja layaknya <em>&quot;lazy rendering untuk seluruh bagian DOM dan CSS&quot;</em>:</p>
<ul><li>Ketika sebuah <code>&lt;section&gt;</code> atau <code>&lt;article&gt;</code> dengan <code>content-visibility: auto</code> masih berada jauh di luar area pandang layar (<em>off-screen</em>), peramban <strong>melewati seluruh proses Layout dan Paint untuk isi di dalam elemen tersebut</strong>!</li><li>Begitu pengguna mulai menggulir mendekati elemen tersebut, peramban merendernya tepat waktu secara otomatis.</li><li>Pada halaman dokumentasi panjang (seperti halaman yang memuat puluhan bab sekaligus), <code>content-visibility: auto</code> dapat mempercepat waktu perenderan awal secara signifikan (contoh kasus di web.dev melaporkan peningkatan <strong>hingga 7 kali</strong> pada pemuatan awal)!</li></ul>
<h3>Pasangan Wajib: <code>contain-intrinsic-size</code></h3>
<p>Jika peramban melewati perhitungan tata letak untuk <code>&lt;section&gt;</code> yang ada di bawah layar, lalu dari mana peramban tahu berapa perkiraan tinggi <code>&lt;section&gt;</code> tersebut agar batang <em>scrollbar</em> di tepi kanan layar tidak melompat-lompat?</p>
<p>Jawabannya adalah memasangkan <code>content-visibility: auto</code> dengan <strong><code>contain-intrinsic-size: auto 500px;</code></strong>:</p>
<pre>/* Terapkan pada blok seksi atau kartu artikel yang berada di bawah layar pertama */
.seksi-artikel,
.kartu-katalog {
  content-visibility: auto;
  /* 'auto 400px' berarti:
     - Saat elemen belum pernah dirender, pesan ruang tinggi perkiraan 400px.
     - Kata kunci 'auto' memerintahkan peramban untuk MENGINGAT tinggi asli elemen tersebut
       setelah elemen itu sempat terlihat di layar, sehingga saat digulir naik-turun kembali,
       tingginya 100% akurat tanpa lompatan! */
  contain-intrinsic-size: auto 400px;
}</pre>
<div class="callout info"><div class="callout-judul">💡 Keunggulan <code>content-visibility: auto</code> dibandingkan <code>display: none</code></div><p>Berbeda dengan <code>display: none</code> yang menghilangkan teks dari pencarian <code>Ctrl + F</code> dan pembaca layar, konten di dalam elemen <code>content-visibility: auto</code> yang sedang berada di luar layar <strong>tetap dapat ditemukan saat pengguna menekan <code>Ctrl + F</code> di peramban dan tetap dapat diakses oleh pembaca layar</strong>!</p></div>
<h2>2. Mengisolasi Perhitungan Peramban dengan Properti <code>contain</code></h2>
<p>Ketika Anda mengubah teks atau ukuran satu elemen kecil di dalam sebuah widget menggunakan JavaScript, peramban secara bawaan harus memeriksa apakah perubahan tersebut ikut menggeser posisi elemen-elemen lain di luar widget tersebut (di seluruh halaman).</p>
<p>Properti <strong><code>contain</code></strong> memungkinkan Anda memberi jaminan kepada mesin peramban bahwa apa yang terjadi di dalam komponen ini <strong>tidak akan pernah memengaruhi tata letak di luar komponen ini</strong>:</p>
<ul><li><strong><code>contain: layout</code>:</strong> Perubahan posisi/ukuran anak di dalam elemen ini tidak akan pernah menggeser elemen di luar kotak ini.</li><li><strong><code>contain: paint</code>:</strong> Anak di dalam elemen ini tidak akan pernah digambar melewati batas kotak elemen ini (mirip <code>overflow: clip</code>).</li><li><strong><code>contain: content</code>:</strong> Singkatan populer untuk <code>contain: layout paint style;</code> — sangat aman dipasang pada komponen kartu atau widget mandiri untuk mempercepat perhitungan ulang tata letak (<em>reflow</em>)!</li></ul>
<h2>3. Menghindari <em>Layout Thrashing</em> (<em>Forced Synchronous Layout</em>)</h2>
<p>Selain di CSS, performa perenderan sering jatuh akibat cara JavaScript membaca dan menulis gaya CSS secara bergantian di dalam perulangan:</p>
<pre>// 🚫 BURUK (Memicu Layout Thrashing / Forced Synchronous Layout berulang-ulang!):
// Membaca offsetWidth tepat setelah mengubah style.width di dalam loop memaksa peramban
// menjalankan tahap Layout secara sinkron berkali-kali dalam satu frame!
for (const kotak of daftarKotak) {
  const lebarSaatIni = kotak.offsetWidth; // 1. BACA (Memaksa Layout!)
  kotak.style.width = \`\${lebarSaatIni + 10}px\`; // 2. TULIS (Membatalkan Layout!)
}

// ✅ BENAR: Serahkan perhitungan ke CSS (mis. Flexbox/Grid/calc), atau pisahkan semua tahap BACA
//    terlebih dahulu, baru lakukan semua tahap TULIS sekaligus!</pre>
<h2>Latihan Praktik: Mengoptimalkan Halaman Dokumentasi Panjang</h2>
<p>Buatlah berkas <code>performa-render.html</code> dan <code>performa.css</code>:</p>
<ol><li>Buat halaman yang memiliki 20 <code>&lt;section class=&quot;bab-dokumentasi&quot;&gt;</code> panjang.</li><li>Biarkan <code>&lt;section&gt;</code> pertama di layar teratas dirender secara normal, dan terapkan <code>.bab-dokumentasi:nth-child(n + 2) { content-visibility: auto; contain-intrinsic-size: auto 450px; }</code> pada seksi ke-2 dan seterusnya.</li><li>Buka tab <strong>Performance</strong> di DevTools, rekam pemuatan halaman (<em>Record &amp; Reload</em>), dan amati betapa singkatnya waktu <em>Rendering</em> dan <em>Painting</em> pada utas utama!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility" rel="noopener"><code>content-visibility</code> CSS property — MDN Web Docs</a></li><li><a href="https://web.dev/articles/content-visibility" rel="noopener">content-visibility: the new CSS property that boosts your rendering performance — web.dev</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path" rel="noopener">Critical rendering path — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["content-visibility: auto","<section>","display: none","Ctrl + F","contain","loading=\"lazy\""],
    kuis: [
        {"tanya":"Apa yang dilakukan oleh peramban ketika sebuah elemen <section> di bagian bawah halaman diberi properti content-visibility: auto; contain-intrinsic-size: auto 500px;?","opsi":["Peramban menghapus elemen <section> tersebut dari DOM sampai pengguna mengeklik tombol.","Peramban melewati pekerjaan Layout dan Paint untuk isi di dalam <section> tersebut selama elemen masih berada di luar layar (sambil menggunakan tinggi perkiraan 500px), lalu merendernya secara otomatis sesaat sebelum masuk ke area pandang layar, sambil tetap membiarkan teks di dalamnya dapat dicari dengan Ctrl + F.","Peramban mengunduh gambar di dalamnya dengan kualitas rendah.","Peramban menyembunyikan teks dari pembaca layar."],"benar":1,"penjelasan":"content-visibility: auto menunda biaya perenderan (layout & paint) untuk sub-pohon elemen di luar layar tanpa mengorbankan aksesibilitas maupun fungsi pencarian halaman (Ctrl + F)."},
        {"tanya":"Mengapa kita perlu menyertakan kata kunci auto di depan nilai ukuran pada contain-intrinsic-size: auto 400px;?","opsi":["Agar lebar elemen menjadi auto.","Agar setelah elemen tersebut sempat masuk ke layar dan dihitung tinggi aslinya (misalnya ternyata 620px), peramban menyimpan dan menggunakan ukuran asli 620px tersebut saat elemen kembali keluar layar, sehingga batang scrollbar tidak bergeser-geser saat pengguna menggulir naik.","Agar elemen otomatis berada di tengah halaman (margin: auto).","Karena tanpa kata kunci auto, satuan px tidak diizinkan."],"benar":1,"penjelasan":"Angka 400px hanyalah tebakan awal sebelum elemen pernah dirender. Dengan auto 400px, begitu elemen pernah dirender satu kali, peramban mengganti tebakan 400px tadi dengan dimensi terakhir yang terukur secara akurat."},
        {"tanya":"Apa yang dimaksud dengan Layout Thrashing (Forced Synchronous Layout)?","opsi":["Penggunaan CSS Grid dan Flexbox di dalam satu halaman yang sama.","Kondisi ketika kode JavaScript berulang kali mengubah properti gaya visual (write) lalu langsung membaca properti geometri seperti offsetWidth atau getBoundingClientRect() (read) di dalam perulangan, sehingga memaksa peramban menghitung ulang tata letak secara paksa berkali-kali sebelum satu bingkai layar selesai.","Penggunaan lebih dari 10 variabel CSS pada :root.","Perubahan warna latar belakang menggunakan transition."],"benar":1,"penjelasan":"Peramban normalnya mengumpulkan seluruh perubahan gaya dan menghitung Layout cukup satu kali di akhir bingkai. Namun jika JavaScript meminta nilai geometri (offsetWidth, clientHeight) tepat setelah mengubah gaya, peramban terpaksa langsung menjalankan Layout saat itu juga demi memberikan angka yang mutakhir."}
    ]
},
{
    id: 20,
    kategori: "6 · Performa & Proyek",
    judul: "Proyek Akhir Kelas CSS: Antarmuka Dasbor Pemantauan Infrastruktur Responsif",
    tingkat: "Lanjut", durasi: "12 mnt",
    tag: ["@layer","color-scheme: light dark","light-dark()"],
    ringkas: "Membangun sistem desain dan halaman dasbor metrik server secara utuh dengan memadukan @layer, token warna oklch() & light-dark(), CSS Grid & subgrid, Flexbox, @container queries, tipografi clamp() & tabular-nums, serta transisi ramah GPU.",
    isi: `
<h2>Gambaran Proyek</h2>
<p>Di proyek akhir kelas CSS ini, Anda akan merancang dan membangun <strong>Antarmuka Dasbor Pemantauan Server Kodeloka Cloud</strong> yang siap produksi. Proyek ini membuktikan bagaimana fitur-fitur CSS modern bekerja secara harmonis tanpa membutuhkan kerangka kerja CSS pihak ketiga:</p>
<ol><li><strong>Arsitektur Berlapis (<code>@layer</code>):</strong> Dipisahkan dengan rapi ke dalam <code>@layer reset, token, dasar, tata-letak, komponen, utilitas;</code>.</li><li><strong>Sistem Tema Terang &amp; Gelap Otomatis:</strong> Menggunakan <code>color-scheme: light dark</code>, <code>light-dark()</code>, dan ruang warna persepsi <code>oklch()</code> beserta <code>color-mix()</code>.</li><li><strong>Tata Letak Responsif Dua Tingkat:</strong><ul><li><strong>Tingkat Halaman (<code>@media</code> + CSS Grid):</strong> Bilah navigasi samping (<em>sidebar</em>) otomatis berpindah dari tumpukan atas di layar ponsel menjadi kolom kiri tetap yang <code>sticky</code> di layar lebar (<code>width &gt;= 56rem</code>).</li><li><strong>Tingkat Komponen (<code>@container</code> + <code>subgrid</code>):</strong> Kartu metrik server secara mandiri menyesuaikan tata letaknya berdasarkan lebar wadah tempat ia berada.</li></ul></li><li><strong>Keterbacaan &amp; Aksesibilitas Tinggi:</strong> Angka metrik memakai <code>font-variant-numeric: tabular-nums</code>, cincin fokus <code>:focus-visible</code> terlihat tegas, dan animasi mematuhi <code>prefers-reduced-motion</code>.</li></ol>
<h2>Kode Lengkap Proyek</h2>
<h3>1. Berkas Stylesheet (<code>dasbor.css</code>)</h3>
<pre>@layer reset, token, dasar, tata-letak, komponen, utilitas;

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

    /* Skala Spasi &amp; Sudut */
    --spasi-xs: 0.375rem;
    --spasi-sm: 0.75rem;
    --spasi-md: 1.25rem;
    --spasi-lg: 2rem;
    --radius-md: 0.625rem;
    --radius-lg: 0.875rem;
  }

  html[data-tema=&quot;terang&quot;] { color-scheme: light; }
  html[data-tema=&quot;gelap&quot;]  { color-scheme: dark; }
}

@layer dasar {
  body {
    min-block-size: 100dvh;
    font-family: system-ui, -apple-system, &quot;Segoe UI&quot;, Roboto, sans-serif;
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

    @media (width &gt;= 56rem) {
      grid-template-columns: 250px minmax(0, 1fr);
    }
  }

  .bilah-samping {
    background-color: var(--latar-panel);
    border-block-end: 1px solid var(--garis-batas);
    padding: var(--spasi-md);

    @media (width &gt;= 56rem) {
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

    @media (width &gt;= 56rem) {
      flex-direction: column;
    }

    &amp; a {
      display: flex;
      align-items: center;
      gap: var(--spasi-sm);
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-md);
      text-decoration: none;
      color: var(--teks-sekunder);
      font-weight: 500;
      transition: background-color 150ms ease, color 150ms ease;

      &amp;:hover,
      &amp;[aria-current=&quot;page&quot;] {
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

    &amp;:hover {
      translate: 0 -3px;
    }

    &amp;.kartu-metrik--waspada { --warna-indikator: var(--status-waspada); }
    &amp;.kartu-metrik--kritis  { --warna-indikator: var(--status-kritis); }
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

    @container panel-insiden (width &gt;= 640px) {
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

    &amp;:hover {
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
}</pre>
<h3>2. Berkas Markup HTML (<code>index.html</code>)</h3>
<pre>&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;id&quot;&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;
    &lt;title&gt;Dasbor Infrastruktur — Kodeloka Cloud&lt;/title&gt;
    &lt;link rel=&quot;stylesheet&quot; href=&quot;dasbor.css&quot;&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;div class=&quot;kerangka-dasbor&quot;&gt;
      &lt;aside class=&quot;bilah-samping&quot; aria-label=&quot;Menu dasbor&quot;&gt;
        &lt;strong&gt;Kodeloka Cloud&lt;/strong&gt;
        &lt;nav aria-label=&quot;Navigasi utama&quot;&gt;
          &lt;ul class=&quot;menu-navigasi&quot;&gt;
            &lt;li&gt;&lt;a href=&quot;#ringkasan&quot; aria-current=&quot;page&quot;&gt;Ringkasan Klaster&lt;/a&gt;&lt;/li&gt;
            &lt;li&gt;&lt;a href=&quot;#basis-data&quot;&gt;Node PostgreSQL&lt;/a&gt;&lt;/li&gt;
            &lt;li&gt;&lt;a href=&quot;#antrean&quot;&gt;Antrean Kafka&lt;/a&gt;&lt;/li&gt;
          &lt;/ul&gt;
        &lt;/nav&gt;
      &lt;/aside&gt;

      &lt;main class=&quot;area-utama&quot; id=&quot;ringkasan&quot;&gt;
        &lt;header class=&quot;kepala-dasbor&quot;&gt;
          &lt;div&gt;
            &lt;h1&gt;Kesehatan Klaster Produksi (ID-JKT-01)&lt;/h1&gt;
            &lt;p class=&quot;teks-redup&quot;&gt;
              Pembaruan terakhir: &lt;time datetime=&quot;2026-10-16T14:30:00+07:00&quot; class=&quot;angka-tabular&quot;&gt;14:30:00 WIB&lt;/time&gt;
            &lt;/p&gt;
          &lt;/div&gt;
          &lt;button type=&quot;button&quot; class=&quot;tombol&quot; id=&quot;saklar-tema&quot;&gt;
            Ganti Tema Terang / Gelap
          &lt;/button&gt;
        &lt;/header&gt;

        &lt;section aria-labelledby=&quot;judul-metrik&quot; class=&quot;kisi-metrik&quot;&gt;
          &lt;h2 id=&quot;judul-metrik&quot; class=&quot;sembunyi-visual&quot;&gt;Metrik Utama&lt;/h2&gt;

          &lt;article class=&quot;kartu-metrik&quot;&gt;
            &lt;h3&gt;Latensi API Gateway (P95)&lt;/h3&gt;
            &lt;p class=&quot;kartu-metrik__nilai&quot;&gt;18,4 ms&lt;/p&gt;
            &lt;div&gt;
              &lt;span class=&quot;lencana-status&quot;&gt;Sehat (&amp;lt; 50 ms)&lt;/span&gt;
            &lt;/div&gt;
          &lt;/article&gt;

          &lt;article class=&quot;kartu-metrik kartu-metrik--waspada&quot;&gt;
            &lt;h3&gt;Penggunaan Koneksi PostgreSQL Utama&lt;/h3&gt;
            &lt;p class=&quot;kartu-metrik__nilai&quot;&gt;78 / 100&lt;/p&gt;
            &lt;div&gt;
              &lt;span class=&quot;lencana-status&quot;&gt;Waspada (78% terpakai)&lt;/span&gt;
            &lt;/div&gt;
          &lt;/article&gt;

          &lt;article class=&quot;kartu-metrik kartu-metrik--kritis&quot;&gt;
            &lt;h3&gt;Antrean Pesan Worker Pembayaran (Consumer Lag)&lt;/h3&gt;
            &lt;p class=&quot;kartu-metrik__nilai&quot;&gt;1.420&lt;/p&gt;
            &lt;div&gt;
              &lt;span class=&quot;lencana-status&quot;&gt;Tinggi (Perlu penskalaan)&lt;/span&gt;
            &lt;/div&gt;
          &lt;/article&gt;
        &lt;/section&gt;

        &lt;section aria-labelledby=&quot;judul-insiden&quot; class=&quot;wadah-panel-bawah&quot;&gt;
          &lt;div class=&quot;kartu-insiden&quot;&gt;
            &lt;div&gt;
              &lt;h2 id=&quot;judul-insiden&quot;&gt;Rekomendasi Penskalaan Otomatis&lt;/h2&gt;
              &lt;p class=&quot;teks-redup&quot;&gt;
                Worker pembayaran mengalami lonjakan trafik. Tambahkan 2 replika Pod untuk mengembalikan lag di bawah 100 pesan.
              &lt;/p&gt;
            &lt;/div&gt;
            &lt;button type=&quot;button&quot; class=&quot;tombol&quot;&gt;Tambah 2 Replika&lt;/button&gt;
          &lt;/div&gt;
        &lt;/section&gt;
      &lt;/main&gt;
    &lt;/div&gt;

    &lt;script&gt;
      const tombolTema = document.getElementById(&quot;saklar-tema&quot;);
      tombolTema.addEventListener(&quot;click&quot;, () =&gt; {
        const akar = document.documentElement;
        const gelapSistem = window.matchMedia(&quot;(prefers-color-scheme: dark)&quot;).matches;
        const saatIni = akar.getAttribute(&quot;data-tema&quot;) ?? (gelapSistem ? &quot;gelap&quot; : &quot;terang&quot;);
        akar.setAttribute(&quot;data-tema&quot;, saatIni === &quot;gelap&quot; ? &quot;terang&quot; : &quot;gelap&quot;);
      });
    &lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout" rel="noopener">CSS grid layout — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries" rel="noopener">CSS container queries — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables" rel="noopener">CSS custom properties for cascading variables — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch" rel="noopener"><code>oklch()</code> CSS function — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["@layer","color-scheme: light dark","light-dark()","oklch()","color-mix()","@media"],
    kuis: [
        {"tanya":"Dalam kode proyek dasbor di atas, bagaimana .kartu-metrik--waspada dan .kartu-metrik--kritis mengubah warna garis batas samping kiri (border-inline-start) sekaligus warna latar dan teks pada .lencana-status di dalamnya?","opsi":["Dengan menulis ulang 10 baris properti border, background-color, dan color untuk setiap kelas modifier.","Dengan cukup mengubah nilai satu variabel CSS lokal (--warna-indikator), yang kemudian dipakai bersama oleh border-inline-start pada kartu serta fungsi color-mix() pada .lencana-status di dalamnya.","Dengan memanggil fungsi JavaScript setiap kali kursor diarahkan ke kartu.","Dengan menduplikasi elemen HTML untuk setiap warna."],"benar":1,"penjelasan":"Karena variabel CSS (--warna-indikator) diwariskan dari elemen .kartu-metrik ke seluruh anak di dalamnya (termasuk .lencana-status), modifier .kartu-metrik--waspada cukup mengubah nilai --warna-indikator saja, dan baik bingkai kartu maupun warna lencana di dalamnya otomatis ikut berubah!"},
        {"tanya":"Mengapa properti grid-template-columns pada .kerangka-dasbor menggunakan 250px minmax(0, 1fr) alih-alih 250px 1fr?","opsi":["Karena 1fr tidak valid jika disandingkan dengan satuan px.","Untuk mencegah kolom utama (1fr) membengkak melampaui lebar layar apabila di dalamnya terdapat elemen yang lebar intrinsiknya besar, karena minmax(0, 1fr) mengizinkan kolom menyusut di bawah ukuran konten minimumnya.","Agar lebar bilah samping menjadi 0px di layar desktop.","Untuk mematikan jarak gap pada grid."],"benar":1,"penjelasan":"1fr secara bawaan setara dengan minmax(auto, 1fr). Menuliskannya secara eksplisit sebagai minmax(0, 1fr) memastikan kolom utama tetap patuh pada ruang layar yang tersedia dan tidak terdorong melebar oleh anak yang panjang."},
        {"tanya":"Apa peran font-variant-numeric: tabular-nums; yang diterapkan pada .kartu-metrik__nilai dan elemen <time> di dasbor tersebut?","opsi":["Mengubah angka Arab menjadi angka Romawi secara otomatis.","Memastikan setiap karakter digit angka (0 sampai 9) menempati lebar horizontal yang sama persis layaknya fon monospace, sehingga saat angka metrik atau detik waktu berubah, posisi teks tidak bergeser-geser.","Membulatkan angka desimal menjadi bilangan bulat.","Memperbesar ukuran angka dua kali lipat dari huruf biasa."],"benar":1,"penjelasan":"Pada fon proporsional biasa, angka 1 jauh lebih sempit daripada angka 8. Dengan font-variant-numeric: tabular-nums, seluruh digit angka diberi kotak lebar yang seragam sehingga deretan angka di tabel maupun dasbor waktu nyata terlihat stabil dan sejajar."}
    ]
}
];

/* ==========================================================================
   ENGINE PEMBELAJARAN — dipakai bersama oleh Kubernetes, PostgreSQL, Kafka
   ========================================================================== */

const KUNCI_SIMPAN = TOPIK_SLUG + "_progres";

let indeksAktif = 0;
let kategoriAktif = "SEMUA";
let kataCari = "";
let selesai = muatProgres();

function muatProgres() {
    try {
        return new Set(JSON.parse(localStorage.getItem(KUNCI_SIMPAN) || "[]"));
    } catch {
        return new Set();
    }
}

function simpanProgres() {
    try {
        localStorage.setItem(KUNCI_SIMPAN, JSON.stringify([...selesai]));
    } catch { /* penyimpanan tidak tersedia — abaikan */ }
}

function aturUlangProgres() {
    selesai = new Set();
    simpanProgres();
    render();
}

function daftarKategori() {
    return ["SEMUA", ...new Set(MODUL.map(m => m.kategori))];
}

function modulTersaring() {
    const q = kataCari.trim().toLowerCase();
    return MODUL.filter(m => {
        const cocokKategori = kategoriAktif === "SEMUA" || m.kategori === kategoriAktif;
        if (!cocokKategori) return false;
        if (!q) return true;
        return (m.judul + " " + m.ringkas + " " + (m.tag || []).join(" "))
            .toLowerCase().includes(q);
    });
}

function renderPil() {
    const wadah = document.getElementById("pilKategori");
    wadah.innerHTML = daftarKategori().map(k => `
        <button class="pil ${k === kategoriAktif ? "aktif" : ""}"
                onclick="pilihKategori(${JSON.stringify(k).replace(/"/g, "&quot;")})">
            ${k === "SEMUA" ? "Semua" : k}
        </button>`).join("");
}

function pilihKategori(k) {
    kategoriAktif = k;
    render();
}

function renderDaftar() {
    const wadah = document.getElementById("daftarModul");
    const hasil = modulTersaring();

    if (hasil.length === 0) {
        wadah.innerHTML = `<div class="kosong">Tidak ada modul yang cocok.</div>`;
        return;
    }

    let html = "";
    let kategoriTerakhir = null;
    for (const m of hasil) {
        if (m.kategori !== kategoriTerakhir) {
            kategoriTerakhir = m.kategori;
            html += `<div class="grup-kategori">${m.kategori}</div>`;
        }
        const i = MODUL.indexOf(m);
        html += `
            <div class="item-modul ${i === indeksAktif ? "aktif" : ""} ${selesai.has(m.id) ? "selesai" : ""}"
                 onclick="bukaModul(${i})">
                <div class="item-nomor">${selesai.has(m.id) ? "✓" : String(m.id).padStart(2, "0")}</div>
                <div class="item-teks">
                    <div class="item-judul">${m.judul}</div>
                    <div class="item-meta">${m.tingkat} · ${m.durasi}</div>
                </div>
            </div>`;
    }
    wadah.innerHTML = html;
}

function renderProgres() {
    const total = MODUL.length;
    const jumlah = selesai.size;
    document.getElementById("isiProgres").style.width = (jumlah / total * 100) + "%";
    document.getElementById("teksProgres").textContent = `${jumlah} dari ${total} selesai`;
}

function renderKonten() {
    const m = MODUL[indeksAktif];
    const konten = document.getElementById("konten");

    const perintah = (m.perintah || []).length === 0 ? "" : `
        <div class="perintah-contoh">
            <div class="perintah-kepala">Perintah yang sering dipakai</div>
            <div class="perintah-isi">
                ${m.perintah.map(p => `<div class="perintah-baris">${lolos(p)}</div>`).join("")}
            </div>
        </div>`;

    const kuis = (m.kuis || []).length === 0 ? "" : `
        <section class="kuis">
            <h3>Uji Pemahaman</h3>
            <div class="kuis-sub">Pilih jawaban untuk melihat penjelasannya.</div>
            ${m.kuis.map((q, qi) => `
                <div class="pertanyaan" id="q-${qi}">
                    <div class="pertanyaan-teks">${qi + 1}. ${lolos(q.tanya)}</div>
                    ${q.opsi.map((o, oi) => `
                        <button class="opsi" data-q="${qi}" data-o="${oi}"
                                onclick="jawab(${qi}, ${oi})">${lolos(o)}</button>`).join("")}
                    <div class="penjelasan" id="pj-${qi}" style="display:none"></div>
                </div>`).join("")}
        </section>`;

    konten.innerHTML = `
        <header class="kepala-modul">
            <span class="label-kategori">${m.kategori}</span>
            <h1>${lolos(m.judul)}</h1>
            <p class="ringkas">${lolos(m.ringkas)}</p>
        </header>
        <article class="artikel">${m.isi}</article>
        ${perintah}
        ${kuis}
        <nav class="nav-modul">
            <button class="tombol-nav" onclick="pindah(-1)" ${indeksAktif === 0 ? "disabled" : ""}>← Sebelumnya</button>
            <button class="tombol-nav utama" onclick="tandaiSelesai()">
                ${selesai.has(m.id) ? "✓ Sudah ditandai selesai" : "Tandai selesai"}
            </button>
            <button class="tombol-nav" onclick="pindah(1)" ${indeksAktif === MODUL.length - 1 ? "disabled" : ""}>Berikutnya →</button>
        </nav>`;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function lolos(s) {
    return String(s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function jawab(qi, oi) {
    const m = MODUL[indeksAktif];
    const q = m.kuis[qi];
    const tombol = document.querySelectorAll(`.opsi[data-q="${qi}"]`);
    tombol.forEach((t, i) => {
        t.disabled = true;
        if (i === q.benar) t.classList.add("benar");
        else if (i === oi) t.classList.add("salah");
    });
    const pj = document.getElementById(`pj-${qi}`);
    pj.style.display = "block";
    pj.innerHTML = (oi === q.benar ? "<strong>Tepat.</strong> " : "<strong>Belum tepat.</strong> ") + lolos(q.penjelasan);
}

function bukaModul(i) {
    indeksAktif = i;
    render();
}

function pindah(delta) {
    const baru = indeksAktif + delta;
    if (baru >= 0 && baru < MODUL.length) bukaModul(baru);
}

function tandaiSelesai() {
    const id = MODUL[indeksAktif].id;
    if (selesai.has(id)) selesai.delete(id); else selesai.add(id);
    simpanProgres();
    render();
}

function render() {
    renderPil();
    renderDaftar();
    renderProgres();
    renderKonten();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("inputCari").addEventListener("input", e => {
        kataCari = e.target.value;
        renderDaftar();
    });
    document.addEventListener("keydown", e => {
        if (e.target.tagName === "INPUT") return;
        if (e.key === "ArrowLeft") pindah(-1);
        if (e.key === "ArrowRight") pindah(1);
    });
    const sub = document.getElementById("merekSub");
    if (sub) sub.textContent = `${MODUL.length} modul · ${TOPIK_SUB}`;
    render();
});
