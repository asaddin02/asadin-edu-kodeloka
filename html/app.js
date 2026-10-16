/* ==========================================================================
   HTML — Platform Pembelajaran Interaktif
   Materi: riset Gemini (materi-gemini/html/), dikoreksi dan disusun oleh Claude Code.
   Dihasilkan oleh scripts/import-materi-gemini.mjs; ubah Markdown-nya, bukan berkas ini.
   ========================================================================== */

const TOPIK_SLUG = "html";
const TOPIK_SUB  = "struktur halaman web";

const MODUL = [
{
    id: 1,
    kategori: "1 · Fondasi",
    judul: "Cara Web Bekerja: Dari Ketikan URL hingga Piksel di Layar",
    tingkat: "Dasar", durasi: "11 mnt",
    tag: ["404 Not Found","<head>","defer"],
    ringkas: "Memahami perjalanan sebuah permintaan web mulai dari resolusi DNS, koneksi TCP/TLS, protokol HTTP, hingga bagaimana peramban mengubah dokumen HTML menjadi tampilan visual melalui Critical Rendering Path.",
    isi: `
<h2>Mengapa Pengembang Web Perlu Memahami Cara Kerja Jaringan dan Peramban?</h2>
<p>Menulis tag HTML tanpa memahami bagaimana dokumen tersebut dikirim dan diproses oleh peramban (<em>browser</em>) ibarat merancang denah gedung tanpa memahami sifat tanah tempat gedung itu berdiri. Ketika sebuah halaman web terasa lambat, gagal memuat gambar, atau tampak berkedip saat pertama kali dibuka, penyebabnya hampir selalu berkaitan dengan cara peramban meminta berkas melalui jaringan dan merangkainya di memori.</p>
<p>Setiap kali Anda mengetikkan alamat seperti <code>https://kodeloka.asadinedu.com</code> di bilah alamat peramban lalu menekan tombol Enter, serangkaian proses terjadi dalam hitungan milidetik:</p>
<pre>[Peramban Anda]
      │
      ├─ 1. Resolusi DNS: &quot;Apa alamat IP untuk kodeloka.asadinedu.com?&quot;
      │     └─&gt; Dijawab oleh DNS Resolver (mis. 104.21.x.x)
      │
      ├─ 2. Jabat Tangan TCP &amp; TLS (Handshake)
      │     └─&gt; Membuka sambungan terenkripsi yang aman (HTTPS)
      │
      ├─ 3. Permintaan HTTP (HTTP Request)
      │     └─&gt; GET / HTTP/2
      │
      ├─ 4. Respons Server (HTTP Response)
      │     └─&gt; 200 OK + aliran byte dokumen HTML
      │
      └─ 5. Critical Rendering Path di Peramban
            └─&gt; HTML -&gt; DOM + CSS -&gt; CSSOM -&gt; Render Tree -&gt; Layout -&gt; Paint -&gt; Composite</pre>
<h2>1. URL, DNS, dan Sambungan ke Server</h2>
<p>Manusia mengingat nama domain seperti <code>kodeloka.asadinedu.com</code>, sedangkan jaringan komputer berkomunikasi menggunakan alamat IP (<em>Internet Protocol</em>) seperti <code>192.0.2.1</code> (IPv4) atau <code>2001:db8::1</code> (IPv6).</p>
<p>Sebuah **URL (<em>Uniform Resource Locator</em>)** memiliki struktur yang presisi:</p>
<pre>https://kodeloka.asadinedu.com:443/html/materi/?modul=1#pengantar
└──┬─┘  └──────────┬─────────┘ └┬┘ └─────┬─────┘ └───┬──┘ └───┬───┘
Skema           Host          Port     Path       Query    Fragmen
(Protokol)   (Nama Domain)              (Jalur)  (Parameter) (Anchor)</pre>
<ol><li><strong>Skema (<code>https://</code>):</strong> Menentukan protokol komunikasi. <code>https</code> memberitahu peramban untuk mengenkripsi komunikasi menggunakan TLS (<em>Transport Layer Security</em>).</li><li>**Resolusi DNS (<em>Domain Name System</em>):** Peramban memeriksa tembolok (<em>cache</em>) lokalnya terlebih dahulu. Bila alamat IP belum diketahui, peramban bertanya ke DNS resolver milik sistem operasi atau penyedia internet Anda hingga menemukan alamat IP server tujuan.</li><li><strong>Koneksi TCP &amp; TLS:</strong> Setelah mendapatkan alamat IP, peramban melakukan jabat tangan TCP (<em>three-way handshake</em>: SYN, SYN-ACK, ACK) dan negosiasi kunci enkripsi TLS sebelum satu huruf pun dari permintaan web Anda dikirimkan.</li></ol>
<h2>2. Siklus Permintaan dan Respons HTTP</h2>
<p>Begitu jalur aman terbentuk, peramban mengirimkan <strong>HTTP Request</strong> (permintaan HTTP). Contoh bentuk tekstual dari permintaan HTTP/1.1:</p>
<pre>GET / HTTP/1.1
Host: kodeloka.asadinedu.com
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: id,en-US;q=0.7,en;q=0.3
Accept-Encoding: br, gzip, deflate</pre>
<p>Server web (seperti Nginx, Apache, atau Cloudflare) menerima permintaan tersebut, menyiapkan berkas yang diminta, lalu membalas dengan <strong>HTTP Response</strong>:</p>
<pre>HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Encoding: br
Cache-Control: public, max-age=3600

&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;id&quot;&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;title&gt;Kodeloka — Belajar Pemrograman&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Selamat Datang di Kodeloka&lt;/h1&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
<h3>Kode Status HTTP yang Wajib Anda Kenali</h3>
<table><thead><tr><th>Rentang</th><th>Kategori</th><th>Contoh Kode Penting</th><th>Arti Praktis bagi Pengembang Front-End</th></tr></thead><tbody><tr><td><code>2xx</code></td><td>Berhasil</td><td><code>200 OK</code>, <code>204 No Content</code></td><td>Permintaan berhasil; peramban dapat memproses isi balasan.</td></tr><tr><td><code>3xx</code></td><td>Pengalihan (<em>Redirect</em>)</td><td><code>301 Moved Permanently</code>, <code>304 Not Modified</code></td><td>Halaman pindah alamat, atau berkas di <em>cache</em> peramban masih mutakhir (<code>304</code>).</td></tr><tr><td><code>4xx</code></td><td>Kesalahan Klien</td><td><code>400 Bad Request</code>, <code>401 Unauthorized</code>, <code>403 Forbidden</code>, <code>404 Not Found</code></td><td>URL salah ketik, tautan rusak (<code>404</code>), atau pengguna belum masuk (<code>401</code>).</td></tr><tr><td><code>5xx</code></td><td>Kesalahan Server</td><td><code>500 Internal Server Error</code>, <code>502 Bad Gateway</code>, <code>503 Service Unavailable</code></td><td>Kode HTML/CSS Anda mungkin benar, tetapi aplikasi backend atau server sedang mengalami gangguan.</td></tr></tbody></table>
<h2>3. Peran Tiga Pilar Front-End: HTML, CSS, dan JavaScript</h2>
<p>Di peramban, tiga teknologi web memiliki pembagian tugas yang tegas:</p>
<ul><li>**HTML (<em>HyperText Markup Language</em>):<strong> Menyediakan </strong>struktur dan makna semantik** konten (judul, paragraf, tabel data, formulir, tombol).</li><li>**CSS (<em>Cascading Style Sheets</em>):<strong> Mengatur </strong>presentasi dan tata letak** (warna, tipografi, posisi kolom, responsivitas layar).</li><li><strong>JavaScript:</strong> Mengendalikan <strong>perilaku dan interaksi dinamis</strong> (menanggapi klik, mengambil data baru dengan <code>fetch()</code>, memvalidasi logika kompleks).</li></ul>
<div class="callout info"><p>**💡 Tips Praktis: Prinsip <em>Rule of Least Power</em>** Prinsip arsitektur web dari W3C menyatakan: gunakan bahasa paling sederhana yang mampu menyelesaikan masalah Anda. Jika sebuah interaksi bisa diselesaikan dengan HTML murni (misalnya akordeon dengan <code>&lt;details&gt;</code> atau dialog dengan <code>&lt;dialog&gt;</code>), pilih HTML. Jika butuh animasi visual, gunakan CSS sebelum menulis JavaScript. Kode yang lebih deklaratif lebih tahan terhadap galat dan lebih ramah aksesibilitas.</p></div>
<h2>4. Critical Rendering Path: Bagaimana HTML Menjadi Piksel</h2>
<p>Setelah byte pertama HTML tiba, peramban menjalankan lima tahapan yang disebut <strong>Critical Rendering Path</strong>:</p>
<ol><li>**Parsing HTML menjadi DOM (<em>Document Object Model</em>):** Peramban membaca karakter mentah (<code>&lt;</code>, <code>h</code>, <code>1</code>, <code>&gt;</code>), mengubahnya menjadi token, lalu merangkai pohon objek di memori yang disebut <strong>DOM</strong>. Saat parser menemukan tag <code>&lt;link rel=&quot;stylesheet&quot;&gt;</code> atau <code>&lt;img src=&quot;...&quot;&gt;</code>, peramban mengirim permintaan jaringan tambahan di latar belakang.</li><li>**Parsing CSS menjadi CSSOM (<em>CSS Object Model</em>):** Peramban membaca seluruh aturan CSS dan membentuk pohon gaya (<strong>CSSOM</strong>). CSS bersifat <em>render-blocking</em>: peramban menahan penggambaran layar sampai CSSOM selesai agar halaman tidak tampil telanjang tanpa gaya (<em>Flash of Unstyled Content</em> / FOUC).</li><li><strong>Pembentukan Render Tree:</strong> DOM dan CSSOM digabungkan menjadi <strong>Render Tree</strong>. Hanya elemen yang benar-benar tampil di layar yang masuk ke pohon ini. Elemen seperti <code>&lt;head&gt;</code> atau elemen dengan <code>display: none</code> tidak dimasukkan ke dalam Render Tree (berbeda dengan <code>visibility: hidden</code> yang tetap mengambil ruang di tata letak).</li><li><strong>Layout (atau Reflow):</strong> Peramban menghitung ukuran pasti (lebar dan tinggi dalam piksel) serta koordinat <code>(x, y)</code> dari setiap kotak di dalam Render Tree berdasarkan ukuran layar (<em>viewport</em>).</li><li><strong>Paint dan Compositing:</strong> Peramban menggambar teks, warna latar, batas kotak (<em>border</em>), dan bayangan ke dalam lapisan-lapisan gambar (<em>layers</em>), lalu GPU menyatukan lapisan tersebut ke layar Anda.</li></ol>
<pre>&lt;!-- Contoh bagaimana posisi script memengaruhi pemuatan halaman --&gt;
&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;id&quot;&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;title&gt;Urutan Pemuatan yang Efisien&lt;/title&gt;
    &lt;!-- 1. CSS dimuat di &lt;head&gt; agar CSSOM siap secepat mungkin --&gt;
    &lt;link rel=&quot;stylesheet&quot; href=&quot;/assets/style.css&quot;&gt;
    &lt;!-- 2. Gunakan atribut defer agar unduhan JS berjalan paralel
            tanpa menghentikan pembacaan HTML (Baseline Widely Available) --&gt;
    &lt;script src=&quot;/assets/app.js&quot; defer&gt;&lt;/script&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;main&gt;
      &lt;h1&gt;Artikel Utama&lt;/h1&gt;
      &lt;p&gt;Konten ini langsung diurai menjadi DOM tanpa tertahan oleh skrip.&lt;/p&gt;
    &lt;/main&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
<h2>Kesalahan Umum dan Cara Menghindarinya</h2>
<ol><li><strong>Meletakkan <code>&lt;script src=&quot;...&quot;&gt;</code> biasa di dalam <code>&lt;head&gt;</code> tanpa <code>defer</code> atau <code>async</code>:</strong><ul><li><strong>Buruk:</strong> <code>&lt;script src=&quot;bundle-besar.js&quot;&gt;&lt;/script&gt;</code> di bagian atas dokumen akan menghentikan parser HTML (<em>parser-blocking</em>) sampai berkas selesai diunduh dan dijalankan. Pengguna melihat layar putih lebih lama.</li><li><strong>Lebih Baik:</strong> Tambahkan atribut <code>defer</code> (<code>&lt;script src=&quot;bundle-besar.js&quot; defer&gt;&lt;/script&gt;</code>) atau gunakan <code>&lt;script type=&quot;module&quot;&gt;</code> (yang secara bawaan bersifat <em>deferred</em>).</li></ul></li><li><strong>Mengabaikan tab Network di DevTools:</strong> Banyak pemula menebak-nebak mengapa CSS atau gambar tidak muncul, padahal cukup membuka <strong>Developer Tools (<code>F12</code>) → tab Network</strong>, memuat ulang halaman, dan memeriksa apakah baris berkas tersebut berwarna merah dengan status <code>404 Not Found</code>.</li></ol>
<h2>Latihan Praktik: Mengamati Perjalanan Permintaan Web</h2>
<ol><li>Buka peramban Anda (Firefox, Chrome, atau Edge), lalu tekan <code>F12</code> atau klik kanan → <strong>Inspect</strong> untuk membuka Developer Tools.</li><li>Pilih tab <strong>Network</strong> (Jaringan), lalu centang kotak <strong>Disable cache</strong> agar peramban tidak mengambil berkas dari penyimpanan lokal.</li><li>Kunjungi sebuah halaman web sederhana, lalu klik baris paling atas (biasanya bertipe <code>document</code> atau <code>html</code>).</li><li>Perhatikan bagian <strong>Headers</strong> (lihat <code>Status Code</code>, <code>Content-Type</code>, dan <code>Request Headers</code>) serta bagian <strong>Timing</strong> (amati waktu yang dihabiskan untuk <em>DNS Lookup</em>, <em>Connecting/TLS</em>, dan <em>Waiting for server response / TTFB</em>).</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works" rel="noopener">How the web works — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path" rel="noopener">Critical rendering path — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work" rel="noopener">Populating the page: how browsers work — MDN Web Docs</a></li><li><a href="https://html.spec.whatwg.org/multipage/" rel="noopener">HTML Living Standard — WHATWG</a></li></ul></div>
`,
    perintah: ["404 Not Found","<head>","defer","F12","https://kodeloka.asadinedu.com","kodeloka.asadinedu.com"],
    kuis: [
        {"tanya":"Apa yang terjadi ketika peramban menemukan elemen <div style=\"display: none\"> saat menggabungkan DOM dan CSSOM menjadi Render Tree?","opsi":["Elemen tersebut dihapus secara permanen dari pohon DOM di memori.","Elemen tetap berada di dalam DOM, tetapi dikecualikan dari Render Tree sehingga tidak ikut dihitung pada tahap Layout maupun Paint.","Elemen tetap masuk ke Render Tree dan mengambil ruang kosong di layar, namun warnanya dibuat transparan.","Peramban menghentikan pembacaan HTML sampai atribut display: none dihapus oleh JavaScript."],"benar":1,"penjelasan":"DOM menyimpan seluruh representasi elemen dari dokumen HTML, termasuk elemen yang disembunyikan. Namun, Render Tree hanya memuat simpul visual yang perlu digambar di layar. Berbeda dengan visibility: hidden yang tetap menyisakan ruang kotak kosong di Render Tree, display: none mengecualikan elemen beserta turunannya dari Render Tree sepenuhnya."},
        {"tanya":"Mengapa CSS secara bawaan diperlakukan sebagai sumber daya yang bersifat render-blocking oleh peramban?","opsi":["Karena berkas CSS selalu berukuran lebih besar daripada berkas HTML dan JavaScript.","Karena peramban tidak dapat membangun pohon DOM sebelum seluruh aturan CSS selesai diunduh.","Untuk mencegah halaman ditampilkan tanpa gaya visual (Flash of Unstyled Content) yang akan melompat berubah bentuk sesaat setelah CSS selesai dimuat.","Karena protokol HTTP melarang pengunduhan HTML dan CSS secara bersamaan."],"benar":2,"penjelasan":"Peramban tetap dapat mengurai HTML menjadi DOM sambil mengunduh CSS di latar belakang, tetapi peramban menahan tahap pembuatan Render Tree dan penggambaran ke layar sampai CSSOM siap. Tanpa mekanisme ini, pengguna akan melihat teks mentah yang berantakan terlebih dahulu sebelum tiba-tiba bergeser ke tata letak aslinya."},
        {"tanya":"Saat Anda memeriksa tab Network di DevTools, sebuah berkas utama.css menampilkan kode status 304 Not Modified. Apa artinya?","opsi":["Berkas CSS tersebut rusak di sisi server dan gagal diterapkan ke halaman.","Server memberitahu peramban bahwa versi berkas yang tersimpan di cache peramban masih sama dengan versi terbaru di server, sehingga isi berkas tidak perlu dikirim ulang.","Alamat berkas CSS telah dipindahkan secara permanen ke domain lain.","Peramban menolak memuat berkas CSS karena tidak menggunakan protokol HTTPS."],"benar":1,"penjelasan":"Kode status 304 Not Modified merupakan mekanisme efisiensi HTTP caching. Peramban mengirim permintaan bersyarat (misalnya dengan header If-None-Match atau If-Modified-Since), dan server mengonfirmasi bahwa salinan lokal di peramban masih valid sehingga menghemat bandwidth."}
    ]
},
{
    id: 2,
    kategori: "1 · Fondasi",
    judul: "Anatomi URL, MIME Type (Content-Type), dan Content Negotiation",
    tingkat: "Dasar", durasi: "8 mnt",
    tag: ["Content-Type","&",".html"],
    ringkas: "Memahami bagaimana peramban dan server menyepakati tipe dokumen melalui header MIME (text/html, image/avif, application/json), pengodean persen URL, serta bahaya MIME sniffing.",
    isi: `
<h2>Mengapa Peramban Tidak Mengandalkan Ekstensi Berkas <code>.html</code> atau <code>.png</code>?</h2>
<p>Di sistem operasi desktop, komputer menebak jenis berkas dari akhiran namanya (<code>.html</code>, <code>.jpg</code>, <code>.pdf</code>). Namun di web, sebuah URL seperti <code>https://kodeloka.asadinedu.com/unduh?id=42</code> sama sekali tidak memiliki ekstensi berkas!</p>
<p>Lalu bagaimana peramban tahu apakah balasan dari URL tersebut harus ditampilkan sebagai halaman web HTML, diputar sebagai video, atau diunduh sebagai PDF? Jawabannya adalah **MIME Type (<em>Multipurpose Internet Mail Extensions</em>)<strong> yang dikirim oleh server di dalam header HTTP </strong><code>Content-Type</code>**.</p>
<h2>1. Daftar MIME Type Penting yang Wajib Dikenali Pengembang Web</h2>
<table><thead><tr><th>Kategori</th><th>Nilai Header <code>Content-Type</code></th><th>Perilaku Peramban</th></tr></thead><tbody><tr><td><strong>Dokumen Web</strong></td><td><code>text/html; charset=utf-8</code></td><td>Diurai oleh parser HTML5 menjadi pohon DOM.</td></tr><tr><td><strong>Gaya &amp; Skrip</strong></td><td><code>text/css; charset=utf-8</code>, <code>text/javascript; charset=utf-8</code></td><td>Diurai oleh mesin CSSOM dan mesin JIT JavaScript (catatan: standar resmi skrip adalah <code>text/javascript</code>, bukan <code>application/javascript</code>).</td></tr><tr><td><strong>Data API</strong></td><td><code>application/json; charset=utf-8</code></td><td>Data teks terstruktur JSON.</td></tr><tr><td><strong>Gambar Modern</strong></td><td><code>image/avif</code>, <code>image/webp</code>, <code>image/svg+xml</code>, <code>image/png</code>, <code>image/jpeg</code></td><td>Dirender oleh dekoder citra; khusus SVG berbasis XML wajib dikirim sebagai <code>image/svg+xml</code> agar tampil di dalam <code>&lt;img&gt;</code>.</td></tr><tr><td><strong>Fon Web</strong></td><td><code>font/woff2</code>, <code>font/woff</code></td><td>Dimuat oleh aturan <code>@font-face</code>.</td></tr><tr><td><strong>Formulir</strong></td><td><code>application/x-www-form-urlencoded</code>, <code>multipart/form-data</code></td><td>Format pengiriman data dari elemen <code>&lt;form&gt;</code> ke server.</td></tr><tr><td><strong>Biner Umum</strong></td><td><code>application/octet-stream</code>, <code>application/pdf</code></td><td>Menginstruksikan peramban untuk mengunduh berkas biner atau membuka pembaca PDF.</td></tr></tbody></table>
<h2>2. Mekanisme <em>Content Negotiation</em> (<code>Accept</code>, <code>Accept-Language</code>, <code>Accept-Encoding</code>)</h2>
<p>Saat peramban meminta sebuah halaman atau gambar, peramban mengirimkan daftar format yang ia dukung melalui header permintaan (<em>request headers</em>):</p>
<pre>GET /assets/sampul-kelas HTTP/2
Host: kodeloka.asadinedu.com
Accept: image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5
Accept-Encoding: br, zstd, gzip, deflate
Accept-Language: id-ID,id;q=0.9,en-US;q=0.8</pre>
<p>Parameter **<code>q=</code> (<em>quality factor</em>, bernilai <code>0.0</code> hingga <code>1.0</code>, bawaan <code>1.0</code>)** menyatakan urutan prioritas: peramban di atas lebih menyukai <code>image/avif</code> (<code>q=1.0</code>) dibandingkan format gambar umum <code>image/*</code> (<code>q=0.8</code>).</p>
<h2>3. Pengodean Persen pada URL (<em>Percent-Encoding</em> — RFC 3986)</h2>
<p>URL hanya boleh memuat karakter ASCII yang aman (huruf <code>A–Z</code>, <code>a–z</code>, angka <code>0–9</code>, dan simbol <code>- _ . ~</code>). Karakter lain seperti spasi, tanda <code>&amp;</code> di dalam nilai parameter, atau karakter non-Latin harus dikodekan menjadi <strong><code>%</code> diikuti dua digit heksadesimal byte UTF-8-nya</strong> (misalnya spasi menjadi <code>%20</code> atau <code>+</code> di dalam query string, dan <code>&amp;</code> menjadi <code>%26</code>):</p>
<pre>&lt;!-- SALAH: Spasi dan tanda '&amp;' mentah di dalam nilai parameter query merusak pemisahan parameter! --&gt;
&lt;a href=&quot;/cari?topik=HTML &amp; CSS&amp;tingkat=dasar&quot;&gt;Cari HTML &amp;amp; CSS&lt;/a&gt;

&lt;!-- BENAR: Karakter spasi (%20) dan '&amp;' (%26) di dalam nilai parameter dikodekan dengan benar --&gt;
&lt;a href=&quot;/cari?topik=HTML%20%26%20CSS&amp;amp;tingkat=dasar&quot;&gt;Cari HTML &amp;amp; CSS&lt;/a&gt;</pre>
<div class="callout info"><p>**🚫 Bahaya Keamanan <em>MIME Sniffing</em> dan Solusi <code>X-Content-Type-Options: nosniff</code><strong> Jika server mengirim berkas unggahan pengguna sebagai <code>Content-Type: text/plain</code>, peramban kuno terkadang mengintip isi byte pertamanya. Jika ditemukan tulisan <code>&lt;html&gt;&lt;script&gt;...</code>, peramban nekat mengeksekusinya sebagai halaman HTML! Selalu pastikan server mengirim header </strong><code>X-Content-Type-Options: nosniff</code>** agar peramban patuh 100% pada <code>Content-Type</code> yang dideklarasikan server.</p></div>
<h2>Latihan Praktik: Memeriksa Negosiasi Konten di DevTools</h2>
<ol><li>Buka tab <strong>Network</strong> di Browser DevTools pada halaman web yang menggunakan gambar <code>&lt;picture&gt;</code> atau kompresi Brotli (<code>br</code>).</li><li>Bandingkan header <strong>Request (<code>Accept</code>, <code>Accept-Encoding</code>)</strong> dengan header <strong>Response (<code>Content-Type</code>, <code>Content-Encoding</code>, <code>Vary</code>)</strong>.</li><li>Buat berkas <code>tautan-query.html</code> yang berisi 3 tautan pencarian dengan parameter yang mengandung karakter spasi, tanda tanya <code>?</code>, dan simbol <code>&amp;</code> yang dikodekan persen secara benar.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works" rel="noopener">How the web works — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a" rel="noopener">&lt;a&gt;: The Anchor element — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["Content-Type","&",".html","image/avif","image/svg+xml","Accept"],
    kuis: [
        {"tanya":"Mengapa berkas gambar berformat .svg terkadang gagal tampil ketika dimuat melalui <img src=\"ikon.svg\"> dari server yang belum dikonfigurasi dengan benar?","opsi":["Karena elemen <img> hanya mendukung format .jpg dan .png","Karena server mengirimkan header Content-Type: text/plain alih-alih MIME type resmi image/svg+xml, sehingga peramban menolak merendernya sebagai gambar","Karena berkas SVG wajib berukuran lebih dari 10 KB","Karena tag <img> memerlukan atribut type=\"svg\""],"benar":1,"penjelasan":"Peramban menentukan cara memproses sumber daya berdasarkan header HTTP Content-Type, bukan semata-mata ekstensi URL. Untuk SVG, spesifikasi mengharuskan MIME type image/svg+xml."},
        {"tanya":"Pada header HTTP Accept: text/html,application/xhtml+xml,application/xml;q=0.9,/;q=0.8, apa arti dari parameter ;q=0.8?","opsi":["Ukuran maksimal berkas yang diizinkan adalah 0,8 MB","Faktor bobot prioritas (quality value) dari 0 sampai 1 yang menunjukkan tingkat preferensi peramban terhadap tipe media tersebut apabila pilihan utama (q=1.0) tidak tersedia","Versi protokol HTTP yang digunakan adalah versi 0.8","Batas waktu tunggu permintaan adalah 0,8 detik"],"benar":1,"penjelasan":"Parameter q (quality factor) dalam content negotiation HTTP memberi bobot preferensi dari 0.000 hingga 1.000 (nilai bawaan tanpa q adalah 1.0)."},
        {"tanya":"Bagaimana cara penulisan yang benar untuk mengirimkan nilai parameter q berisi teks Go & Rust di dalam atribut href HTML?","opsi":["href=\"/cari?q=Go & Rust\"","href=\"/cari?q=Go%20%26%20Rust\"","href=\"/cari?q=Go&amp;Rust\"","href=\"/cari?q=[Go & Rust]\""],"benar":1,"penjelasan":"Karakter & memiliki arti khusus sebagai pemisah antar-parameter di dalam query string URL. Agar & dianggap sebagai bagian dari nilai teks Go & Rust, ia wajib dikodekan persen menjadi %26 (dan spasi menjadi %20 atau +)."}
    ]
},
{
    id: 3,
    kategori: "1 · Fondasi",
    judul: "Struktur Dokumen HTML Modern dan Atribut Global",
    tingkat: "Dasar", durasi: "12 mnt",
    tag: ["<head>","id","<title>"],
    ringkas: "Membedah anatomi dokumen HTML5 yang valid mulai dari deklarasi DOCTYPE, elemen akar, pengaturan karakter UTF-8, viewport responsif, hingga aturan sintaks dan atribut global.",
    isi: `
<h2>Anatomi Kerangka Dokumen HTML</h2>
<p>Setiap halaman web yang baik dimulai dari kerangka dokumen yang bersih dan mengikuti standar <a href="https://html.spec.whatwg.org/multipage/" rel="noopener">WHATWG HTML Living Standard</a>. Berikut adalah kerangka dasar minimal yang siap dipakai untuk proyek modern:</p>
<pre>&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;id&quot; dir=&quot;ltr&quot;&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;
    &lt;title&gt;Panduan Struktur HTML — Kodeloka&lt;/title&gt;
    &lt;meta name=&quot;description&quot; content=&quot;Pelajari anatomi dokumen HTML modern yang valid dan aksesibel.&quot;&gt;
    &lt;link rel=&quot;stylesheet&quot; href=&quot;style.css&quot;&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;main&gt;
      &lt;h1&gt;Halo, Dunia Web!&lt;/h1&gt;
      &lt;p&gt;Dokumen ini menggunakan struktur standar HTML modern.&lt;/p&gt;
    &lt;/main&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
<p>Mari kita bedah fungsi setiap baris agar Anda tidak sekadar menyalin tempel (<em>copy-paste</em>) tanpa memahami alasannya.</p>
<h3>1. <code>&lt;!DOCTYPE html&gt;</code>: Penjaga Mode Standar (<em>Standards Mode</em>)</h3>
<p>Pada era awal web (sekitar akhir 1990-an), halaman web sering ditulis khusus untuk perilaku unik Netscape Navigator atau Internet Explorer 5. Ketika standar W3C/WHATWG diperkenalkan, peramban tidak bisa begitu saja mengubah cara mereka merender halaman lama karena jutaan situs lama akan hancur tampilannya.</p>
<p>Solusinya adalah dua mode perenderan di dalam peramban:</p>
<ul><li><strong>Standards Mode (Mode Standar):</strong> Peramban mematuhi spesifikasi HTML dan CSS modern secara ketat.</li><li><strong>Quirks Mode (Mode Lawas):</strong> Peramban meniru bug dan perilaku peramban tahun 1990-an (misalnya perhitungan tabel dan kotak yang tidak konsisten).</li></ul>
<p>Baris <code>&lt;!DOCTYPE html&gt;</code> di baris paling pertama adalah saklar yang memaksa peramban masuk ke <strong>Standards Mode</strong>. Tanpa baris ini, peramban akan jatuh ke <em>Quirks Mode</em> dan tata letak CSS Anda dapat berperilaku aneh tanpa pesan galat yang jelas.</p>
<h3>2. Elemen Akar <code>&lt;html&gt;</code> dan Pentingnya <code>lang</code></h3>
<p>Elemen <code>&lt;html&gt;</code> membungkus seluruh isi dokumen. Dua atribut yang sangat penting pada elemen ini adalah:</p>
<ul><li><strong><code>lang=&quot;id&quot;</code>:</strong> Memberitahu perangkat pembaca layar (<em>screen reader</em>), mesin pencari, dan fitur penerjemah otomatis bahwa bahasa utama halaman adalah Bahasa Indonesia (<code>id</code>). Tanpa atribut ini, pembaca layar berbahasa Inggris akan mencoba membacakan kata Bahasa Indonesia dengan pelafalan bahasa Inggris yang membingungkan pengguna tunanetra.</li><li><strong><code>dir=&quot;ltr&quot;</code> atau <code>dir=&quot;rtl&quot;</code>:</strong> Menentukan arah baca teks (<em>left-to-right</em> untuk aksara Latin, atau <em>right-to-left</em> untuk bahasa Arab/Ibrani). Jika bagian tertentu di dalam halaman berbahasa Indonesia mengutip kalimat bahasa Arab atau Inggris, Anda dapat menempelkan atribut <code>lang</code> dan <code>dir</code> langsung pada elemen kutipan tersebut:</li></ul>
<pre>&lt;p&gt;
  Istilah &lt;span lang=&quot;en&quot;&gt;critical rendering path&lt;/span&gt; merujuk pada tahapan
  peramban saat mengubah kode menjadi tampilan visual.
&lt;/p&gt;</pre>
<h3>3. Bagian <code>&lt;head&gt;</code>: Informasi untuk Mesin dan Peramban</h3>
<p>Isi di dalam <code>&lt;head&gt;</code> tidak ditampilkan sebagai konten halaman di dalam jendela utama, melainkan berisi metadata untuk peramban dan mesin pencari:</p>
<ol><li><strong><code>&lt;meta charset=&quot;utf-8&quot;&gt;</code>:</strong> Spesifikasi mewajibkan deklarasi ini berada dalam 1024 byte pertama dokumen, sehingga praktik terbaiknya meletakkannya di bagian paling atas <code>&lt;head&gt;</code>, sebelum <code>&lt;title&gt;</code>. Pengodean karakter <strong>UTF-8</strong> mampu merepresentasikan hampir seluruh aksara di dunia (Latin, Arab, Jepang, aksara Nusantara, hingga simbol matematika dan emoji). Jika <code>&lt;title&gt;</code> diletakkan sebelum <code>&lt;meta charset=&quot;utf-8&quot;&gt;</code>, karakter khusus pada judul tab bisa tampil rusak (<em>mojibake</em> seperti <code>Ã©</code>) atau membuka celah keamanan lama berbasis UTF-7.</li><li><strong><code>&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;</code>:</strong> Tanpa baris ini, peramban di ponsel pintar akan berpura-pura memiliki layar selebar desktop (biasanya <code>980px</code>) lalu memperkecil seluruh halaman sehingga teks terlihat sangat kecil. Atribut <code>width=device-width</code> menyamakan lebar kanvas tata letak dengan lebar layar perangkat yang sebenarnya.</li><li><strong><code>&lt;title&gt;</code>:</strong> Menentukan judul yang muncul di tab peramban, daftar markah (<em>bookmark</em>), riwayat penelusuran, serta judul utama pada hasil pencarian Google. Selain itu, <code>&lt;title&gt;</code> adalah elemen pertama yang dibacakan oleh <em>screen reader</em> saat halaman selesai dimuat.</li></ol>
<div class="callout waspada"><div class="callout-judul">⚠️ Kesalahan Umum: Menaruh <code>&lt;h1&gt;</code> atau <code>&lt;p&gt;</code> di dalam <code>&lt;head&gt;</code></div><p>Jika Anda tidak sengaja menaruh elemen konten seperti <code>&lt;p&gt;</code> atau <code>&lt;div&gt;</code> di dalam <code>&lt;head&gt;</code>, parser HTML secara otomatis akan menutup tag <code>&lt;head&gt;</code> secara paksa dan memindahkan sisanya ke dalam <code>&lt;body&gt;</code>. Akibatnya, tag <code>&lt;meta&gt;</code> atau <code>&lt;link&gt;</code> yang tertulis setelahnya justru tercecer di dalam <code>&lt;body&gt;</code> dan gagal bekerja sebagaimana mestinya!</p></div>
<h2>Elemen, Tag, dan Void Elements</h2>
<p>Di HTML, penting untuk membedakan antara <strong>tag</strong> dan <strong>elemen</strong>:</p>
<pre>&lt;a href=&quot;https://kodeloka.asadinedu.com&quot; class=&quot;tautan&quot;&gt;Belajar di Kodeloka&lt;/a&gt;
├──────────────────────────────────────────────────────┤├──────────────────┤├──┤
                     Tag Pembuka                            Isi Konten       Tag Penutup
└──────────────────────────────────────────────────────────────────────────────┘
                              Satu Elemen HTML Utuh</pre>
<p>Sebagian elemen di HTML tidak mungkin memiliki isi teks atau elemen anak di dalamnya. Elemen-elemen ini disebut <strong>Void Elements</strong> (elemen hampa) dan <strong>tidak memiliki tag penutup</strong>:</p>
<ul><li><code>&lt;meta&gt;</code>, <code>&lt;link&gt;</code>, <code>&lt;base&gt;</code> (di dalam <code>&lt;head&gt;</code>)</li><li><code>&lt;img&gt;</code>, <code>&lt;br&gt;</code>, <code>&lt;hr&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;source&gt;</code>, <code>&lt;track&gt;</code>, <code>&lt;wbr&gt;</code>, <code>&lt;area&gt;</code>, <code>&lt;col&gt;</code>, <code>&lt;embed&gt;</code></li></ul>
<pre>&lt;!-- Benar di HTML5: bersih dan tanpa garis miring penutup --&gt;
&lt;img src=&quot;/logo.svg&quot; alt=&quot;Logo Kodeloka&quot;&gt;
&lt;input type=&quot;email&quot; name=&quot;surel&quot; required&gt;
&lt;hr&gt;

&lt;!-- Tidak diperlukan di HTML5 (warisan XHTML), meskipun tidak menyebabkan galat --&gt;
&lt;img src=&quot;/logo.svg&quot; alt=&quot;Logo Kodeloka&quot; /&gt;</pre>
<h2>Atribut Global yang Wajib Dikuasai</h2>
<p><strong>Atribut global</strong> adalah atribut yang boleh dipasang pada semua elemen HTML:</p>
<table><thead><tr><th>Atribut</th><th>Fungsi Utama</th><th>Catatan Praktik Terbaik</th></tr></thead><tbody><tr><td><code>id</code></td><td>Pengenal unik satu elemen di seluruh halaman</td><td>Nilai <code>id</code> <strong>wajib unik</strong> dalam satu dokumen dan tidak boleh mengandung spasi. Gunakan untuk target tautan <code>#fragmen</code>, asosiasi <code>&lt;label for=&quot;...&quot;&gt;</code>, atau ARIA.</td></tr><tr><td><code>class</code></td><td>Pengelompokan elemen untuk CSS dan JavaScript</td><td>Satu elemen boleh memiliki banyak kelas yang dipisahkan spasi (<code>class=&quot;kartu kartu-utama&quot;</code>).</td></tr><tr><td><code>hidden</code></td><td>Menyembunyikan elemen yang belum relevan</td><td>Menginstruksikan peramban dan pembaca layar untuk tidak merender elemen tersebut.</td></tr><tr><td><code>inert</code></td><td>Menonaktifkan seluruh interaksi pada elemen dan turunannya</td><td>Tersedia di semua peramban utama sejak April 2023 dan berstatus <strong>Baseline Widely Available</strong> sejak Oktober 2025. Sangat berguna untuk mematikan klik, fokus papan ketik (<code>Tab</code>), dan pembacaan layar pada area latar belakang saat sebuah panel terbuka.</td></tr><tr><td><code>data-*</code></td><td>Menyimpan data kustom milik aplikasi di elemen HTML</td><td>Contoh: <code>data-modul-id=&quot;12&quot;</code> dapat dibaca dengan mudah di JavaScript melalui <code>elemen.dataset.modulId</code>.</td></tr><tr><td><code>title</code></td><td>Informasi tambahan (biasanya muncul sebagai <em>tooltip</em> tetikus)</td><td>Jangan mengandalkan <code>title</code> untuk informasi penting karena tidak dapat diakses oleh pengguna layar sentuh (ponsel) maupun sebagian pengguna papan ketik.</td></tr></tbody></table>
<h3>Contoh Penggunaan <code>data-*</code> dan <code>hidden</code></h3>
<pre>&lt;article class=&quot;kartu-kelas&quot; data-kategori=&quot;web-dasar&quot; data-tingkat=&quot;dasar&quot;&gt;
  &lt;h2&gt; Dasar-Dasar HTML &lt;/h2&gt;
  &lt;p&gt;Pelajari cara membangun fondasi halaman web yang kokoh.&lt;/p&gt;
  &lt;div class=&quot;detail-tambahan&quot; hidden&gt;
    &lt;p&gt;Prasyarat: Tidak ada. Cocok untuk pemula murni.&lt;/p&gt;
  &lt;/div&gt;
&lt;/article&gt;</pre>
<h2>Karakter Entitas HTML (<em>Character Entities</em>)</h2>
<p>Karena karakter <code>&lt;</code>, <code>&gt;</code>, <code>&quot;</code>, <code>'</code>, dan <code>&amp;</code> memiliki arti khusus bagi parser HTML, Anda harus menulisnya menggunakan <strong>entitas HTML</strong> jika ingin menampilkannya sebagai teks biasa (terutama saat menampilkan cuplikan kode di halaman web):</p>
<table><thead><tr><th>Karakter</th><th>Nama Entitas</th><th>Keterangan</th></tr></thead><tbody><tr><td><code>&lt;</code></td><td><code>&amp;lt;</code></td><td><em>Less than</em> (kurang dari / kurung siku buka)</td></tr><tr><td><code>&gt;</code></td><td><code>&amp;gt;</code></td><td><em>Greater than</em> (lebih dari / kurung siku tutup)</td></tr><tr><td><code>&amp;</code></td><td><code>&amp;amp;</code></td><td><em>Ampersand</em> (dan)</td></tr><tr><td><code>&quot;</code></td><td><code>&amp;quot;</code></td><td>Tanda kutip ganda (di dalam nilai atribut)</td></tr><tr><td><code>'</code></td><td><code>&amp;apos;</code></td><td>Tanda kutip tunggal / apostrof</td></tr><tr><td><code> </code> (spasi tak terputus)</td><td><code>&amp;nbsp;</code></td><td><em>Non-breaking space</em> (mencegah dua kata terpisah ke baris baru)</td></tr></tbody></table>
<pre>&lt;p&gt;Untuk membuat paragraf di HTML, gunakan elemen &lt;code&gt;&amp;lt;p&amp;gt;&lt;/code&gt;.&lt;/p&gt;
&lt;p&gt;Ukuran layar minimal yang disarankan adalah 320&amp;nbsp;px.&lt;/p&gt;</pre>
<h2>Kesalahan Umum dan Cara Menghindarinya</h2>
<ol><li><strong>Menggunakan nilai <code>id</code> yang sama pada beberapa elemen:</strong><ul><li><strong>Salah:</strong> Memiliki lima tombol dengan <code>id=&quot;tombol-hapus&quot;</code> di dalam daftar tabel. Saat Anda memanggil <code>document.getElementById(&quot;tombol-hapus&quot;)</code> atau menghubungkan <code>&lt;label&gt;</code>, hanya elemen pertama yang ditemukan dan sisanya menjadi cacat fungsi.</li><li><strong>Benar:</strong> Gunakan <code>class=&quot;tombol-hapus&quot;</code> untuk pengelompokan, dan gunakan <code>id</code> unik seperti <code>id=&quot;hapus-item-42&quot;</code> atau atribut <code>data-item-id=&quot;42&quot;</code>.</li></ul></li><li><strong>Menghapus <code>initial-scale=1.0</code> atau menambahkan <code>user-scalable=no</code> pada <code>&lt;meta name=&quot;viewport&quot;&gt;</code>:</strong><ul><li><strong>Bahaya Aksesibilitas:</strong> Menulis <code>user-scalable=no</code> atau <code>maximum-scale=1.0</code> mematikan fitur cubit-untuk-memperbesar (<em>pinch-to-zoom</em>) di ponsel. Pengguna dengan gangguan penglihatan ringan yang perlu memperbesar teks menjadi tidak bisa membaca situs Anda, dan ini melanggar standar aksesibilitas WCAG.</li></ul></li></ol>
<h2>Latihan Praktik: Membuat Kerangka Dokumen Standar</h2>
<p>Buatlah sebuah berkas bernama <code>profil.html</code> di komputer Anda dengan ketentuan berikut:</p>
<ol><li>Menggunakan deklarasi mode standar HTML5 dan menandai bahasa dokumen sebagai Bahasa Indonesia (<code>id</code>).</li><li>Memuat pengodean karakter UTF-8 di urutan pertama dalam <code>&lt;head&gt;</code>, diikuti pengaturan viewport yang ramah perangkat seluler tanpa mematikan fitur <em>zoom</em>.</li><li>Menampilkan paragraf yang menjelaskan fungsi tag <code>&lt;head&gt;</code> dan <code>&lt;body&gt;</code> di layar dengan memanfaatkan entitas <code>&amp;lt;</code> dan <code>&amp;gt;</code> agar nama tag tampak di layar peramban.</li><li>Menyertakan satu elemen <code>&lt;section&gt;</code> yang memiliki atribut kustom <code>data-topik=&quot;html-dasar&quot;</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents" rel="noopener">Structuring documents — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements" rel="noopener">HTML elements reference — MDN Web Docs</a></li><li><a href="https://html.spec.whatwg.org/multipage/dom.html" rel="noopener">Semantics, structure, and APIs of HTML documents — WHATWG HTML Living Standard</a></li><li><a href="https://web.dev/learn/html" rel="noopener">Learn HTML — web.dev</a></li></ul></div>
`,
    perintah: ["<head>","id","<title>","<body>","<!DOCTYPE html>","<html>"],
    kuis: [
        {"tanya":"Apa akibatnya jika sebuah dokumen HTML ditulis tanpa baris <!DOCTYPE html> di bagian paling atas?","opsi":["Peramban akan menolak menampilkan halaman dan memunculkan pesan galat sintaks.","Peramban akan masuk ke Quirks Mode yang meniru perilaku tidak standar dari peramban era 1990-an, sehingga perhitungan CSS bisa menjadi tidak konsisten.","Seluruh elemen HTML5 seperti <main> dan <article> otomatis dihapus dari DOM.","Halaman tidak dapat dimuat melalui koneksi HTTPS."],"benar":1,"penjelasan":"Deklarasi <!DOCTYPE html> berfungsi mengaktifkan Standards Mode pada peramban. Tanpanya, peramban beralih ke Quirks Mode demi menjaga kompatibilitas dengan halaman web kuno, yang menyebabkan banyak aturan tata letak CSS modern bekerja secara menyimpang."},
        {"tanya":"Mengapa tag <meta charset=\"utf-8\"> disarankan diletakkan tepat di awal elemen <head>, bahkan sebelum elemen <title>?","opsi":["Agar mesin pencari membaca pengodean karakter sebelum membaca kata kunci judul.","Agar peramban segera mengetahui cara menerjemahkan byte karakter menjadi huruf (termasuk karakter di dalam <title>) sejak awal dokumen dalam 1024 byte pertama.","Karena menurut spesifikasi HTML, <title> wajib menjadi anak terakhir di dalam <head>.","Agar berkas CSS eksternal dapat diunduh dua kali lebih cepat."],"benar":1,"penjelasan":"Spesifikasi HTML mengharuskan deklarasi pengodean karakter berada dalam 1024 byte pertama dokumen. Praktik terbaiknya, deklarasi itu diletakkan sebelum elemen yang mengandung teks yang dapat dibaca pengguna seperti <title>, sehingga peramban tidak salah menafsirkan karakter non-ASCII pada judul halaman."},
        {"tanya":"Manakah dari pernyataan berikut yang benar mengenai atribut global id dan data-*?","opsi":["Nilai atribut id boleh digunakan berulang kali pada elemen yang berbeda selama berada di dalam <div> yang berbeda.","Atribut data-harga-diskon=\"15000\" pada sebuah elemen dapat dibaca di JavaScript melalui properti elemen.dataset.hargaDiskon.","Atribut data-* hanya boleh dipasang pada elemen <input> dan <form>.","Menambahkan atribut inert pada sebuah elemen hanya mengubah warna teksnya menjadi abu-abu tetapi tetap mengizinkan klik tombol di dalamnya."],"benar":1,"penjelasan":"Atribut data-* merupakan atribut global yang berlaku di semua elemen HTML. Saat diakses melalui API HTMLElement.dataset di JavaScript, nama atribut berformat kebab-case (data-harga-diskon) otomatis dikonversi menjadi camelCase (dataset.hargaDiskon)."}
    ]
},
{
    id: 4,
    kategori: "1 · Fondasi",
    judul: "Teks dan Tipografi Semantik: Memberi Makna pada Konten",
    tingkat: "Dasar", durasi: "11 mnt",
    tag: ["<h2>","<pre>","<strong>"],
    ringkas: "Menggunakan elemen teks HTML berdasarkan makna semantiknya—mulai dari hierarki subjudul, paragraf, daftar, kutipan, hingga penanda kode dan waktu—bukan sekadar demi tampilan tebal atau miring.",
    isi: `
<h2>Mengapa Semantik Teks Penting?</h2>
<p>Di masa lalu, banyak orang memilih tag HTML berdasarkan tampilannya di layar: memakai <code>&lt;h3&gt;</code> hanya karena ingin huruf yang tidak terlalu besar, atau memakai <code>&lt;b&gt;</code> dan <code>&lt;i&gt;</code> semata-mata agar teks terlihat tebal dan miring. Pendekatan ini keliru karena <strong>tampilan adalah tugas CSS, sedangkan tugas HTML adalah menjelaskan arti (semantik) dari konten tersebut</strong>.</p>
<p>Ketika Anda memilih elemen semantik yang tepat:</p>
<ol><li>**Aksesibilitas (<em>Screen Reader</em>):** Pengguna tunanetra dapat melompat antar-bab menggunakan daftar <em>heading</em> (<code>h1</code> sampai <code>h6</code>), serta, pada pembaca layar yang dikonfigurasi untuk mengumumkannya, mengetahui kata yang ditekankan (<code>&lt;em&gt;</code>) atau peringatan penting (<code>&lt;strong&gt;</code>).</li><li>**Mesin Pencari &amp; Pembaca Artikel (<em>Reader Mode</em>):** Mesin pencari dan mode baca di peramban memahami mana judul utama, mana subjudul, mana kutipan, dan mana rincian istilah.</li><li><strong>Kemudahan Pemeliharaan Kode:</strong> Anda dapat mengubah ukuran huruf <code>&lt;h2&gt;</code> di seluruh situs cukup lewat satu baris CSS tanpa merusak struktur dokumen.</li></ol>
<h2>1. Hierarki Heading (<code>&lt;h1&gt;</code> hingga <code>&lt;h6&gt;</code>)</h2>
<p>HTML menyediakan enam tingkat judul bagian, dari <code>&lt;h1&gt;</code> (paling utama) hingga <code>&lt;h6&gt;</code> (subbagian paling rinci). Bayangkan <em>heading</em> sebagai daftar isi sebuah buku teknis:</p>
<pre>&lt;h1&gt;Panduan Lengkap Penyimpanan Data di Linux&lt;/h1&gt;

  &lt;h2&gt;1. Mengenal Sistem Berkas (Filesystem)&lt;/h2&gt;
  &lt;p&gt;Sistem berkas mengatur bagaimana data disimpan dan diambil pada diska...&lt;/p&gt;

    &lt;h3&gt;1.1 Struktur Direktori Standar (FHS)&lt;/h3&gt;
    &lt;p&gt;Di Linux, seluruh berkas berawal dari direktori akar (&lt;code&gt;/&lt;/code&gt;)...&lt;/p&gt;

    &lt;h3&gt;1.2 Perbedaan ext4 dan XFS&lt;/h3&gt;
    &lt;p&gt;Kedua sistem berkas jurnal ini memiliki keunggulan tersendiri...&lt;/p&gt;

  &lt;h2&gt;2. Mengelola Partisi dan Mount Point&lt;/h2&gt;
  &lt;p&gt;Sebelum partisi dapat dipakai, kita perlu mengaitkannya ke direktori...&lt;/p&gt;</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Kesalahan Umum: Melompati Tingkat Heading demi Ukuran Font</div><p>Jangan melompat dari <code>&lt;h1&gt;</code> langsung ke <code>&lt;h4&gt;</code> hanya karena menurut Anda ukuran bawaan <code>&lt;h2&gt;</code> terlalu besar! Jika <code>&lt;h2&gt;</code> terlihat terlalu besar, tetap gunakan <code>&lt;h2&gt;</code> di HTML untuk menjaga urutan hierarki dokumen, lalu atur ukurannya di CSS dengan <code>h2 { font-size: 1.25rem; }</code>.</p></div>
<h2>2. Paragraf dan Daftar (<em>Lists</em>)</h2>
<p>Gunakan <code>&lt;p&gt;</code> untuk setiap paragraf teks. Untuk mengelompokkan butir-butir informasi, pilih dari tiga jenis daftar semantik berikut:</p>
<ol><li>**<code>&lt;ul&gt;</code> (<em>Unordered List</em>):** Daftar yang urutan butirnya tidak mengubah makna (misalnya daftar fitur produk atau bahan masakan).</li><li>**<code>&lt;ol&gt;</code> (<em>Ordered List</em>):** Daftar berurutan yang langkah-langkah atau peringkatnya tidak boleh tertukar (misalnya prosedur instalasi server atau peringkat pemenang). Mendukung atribut <code>start</code>, <code>reversed</code>, dan <code>type</code>.</li><li>**<code>&lt;dl&gt;</code> (<em>Description List</em>):** Daftar pasangan istilah (<code>&lt;dt&gt;</code> — <em>description term</em>) dan penjelasannya (<code>&lt;dd&gt;</code> — <em>description details</em>). Sangat cocok untuk glosarium, kamus istilah, atau metadata spesifikasi produk.</li></ol>
<pre>&lt;h2&gt;Glosarium Jaringan&lt;/h2&gt;
&lt;dl&gt;
  &lt;dt&gt;Latensi (Latency)&lt;/dt&gt;
  &lt;dd&gt;Waktu tempuh yang dibutuhkan paket data untuk bergerak dari pengirim ke penerima, biasanya diukur dalam milidetik (ms).&lt;/dd&gt;

  &lt;dt&gt;Throughput&lt;/dt&gt;
  &lt;dd&gt;Volume data aktual yang berhasil dikirimkan melalui jaringan dalam satu satuan waktu (misalnya Mbps).&lt;/dd&gt;
&lt;/dl&gt;</pre>
<h2>3. Penekanan dan Teks Inline Semantik</h2>
<p>Banyak pengembang bingung membedakan <code>&lt;strong&gt;</code> vs <code>&lt;b&gt;</code>, serta <code>&lt;em&gt;</code> vs <code>&lt;i&gt;</code>. Berikut perbedaan semantiknya menurut <a href="https://html.spec.whatwg.org/multipage/text-level-semantics.html" rel="noopener">spesifikasi WHATWG</a>:</p>
<table><thead><tr><th>Elemen</th><th>Makna Semantik</th><th>Contoh Penggunaan yang Tepat</th></tr></thead><tbody><tr><td><code>&lt;strong&gt;</code></td><td>Kepentingan tinggi, keseriusan, atau urgensi</td><td><code>&lt;strong&gt;Peringatan:&lt;/strong&gt; Jangan bagikan kunci API rahasia Anda di repositori publik.</code></td></tr><tr><td><code>&lt;b&gt;</code></td><td>Menarik perhatian visual tanpa menambah bobot urgensi</td><td>Kata kunci pembuka dalam ringkasan produk atau nama benda dalam ulasan.</td></tr><tr><td><code>&lt;em&gt;</code></td><td>Penekanan intonasi kalimat (<em>stress emphasis</em>) yang mengubah nuansa makna</td><td><code>Anda &lt;em&gt;harus&lt;/em&gt; memvalidasi data di sisi server, bukan hanya di peramban.</code></td></tr><tr><td><code>&lt;i&gt;</code></td><td>Suara/suasana alternatif, istilah asing, nama ilmiah/taksonomi, atau pikiran tokoh</td><td><code>Istilah &lt;i&gt;idempotent&lt;/i&gt; atau spesies &lt;i&gt;Panthera tigris sondaica&lt;/i&gt;.</code></td></tr><tr><td><code>&lt;mark&gt;</code></td><td>Sorotan relevansi konteks (seperti stabilo pada hasil pencarian)</td><td>Menyoroti kata yang cocok dengan kueri pencarian pengguna.</td></tr><tr><td><code>&lt;small&gt;</code></td><td>Keterangan tambahan (<em>fine print</em>), hak cipta, atau klausul hukum</td><td><code>&lt;small&gt;Harga belum termasuk PPN dan biaya layanan.&lt;/small&gt;</code></td></tr><tr><td><code>&lt;sub&gt;</code> &amp; <code>&lt;sup&gt;</code></td><td>Subskrip dan superskrip yang memiliki arti matematis/kimiawi</td><td>Rumus kimia <code>H&lt;sub&gt;2&lt;/sub&gt;O</code> atau perpangkatan <code>2&lt;sup&gt;10&lt;/sup&gt; = 1024</code>.</td></tr></tbody></table>
<h2>4. Kutipan, Kode Program, dan Waktu Terstruktur</h2>
<h3>Kutipan (<code>&lt;blockquote&gt;</code>, <code>&lt;q&gt;</code>, dan <code>&lt;cite&gt;</code>)</h3>
<ul><li>Gunakan <code>&lt;blockquote&gt;</code> untuk kutipan panjang yang berdiri sebagai blok tersendiri, dan <code>&lt;q&gt;</code> untuk kutipan pendek di tengah kalimat.</li><li>Gunakan <code>&lt;cite&gt;</code> untuk menandai <strong>judul karya</strong> (judul buku, spesifikasi standar, artikel, atau film) yang dirujuk:</li></ul>
<pre>&lt;figure&gt;
  &lt;blockquote cite=&quot;https://www.w3.org/DesignIssues/Principles.html&quot;&gt;
    &lt;p&gt;
      Semakin kurang berdaya sebuah bahasa, semakin banyak hal yang dapat dilakukan
      dengan data yang tersimpan dalam bahasa itu.
    &lt;/p&gt;
  &lt;/blockquote&gt;
  &lt;figcaption&gt;
    — Tim Berners-Lee dalam &lt;cite&gt;Design Issues: Principles of Design&lt;/cite&gt; (bagian &lt;i lang=&quot;en&quot;&gt;Principle of Least Power&lt;/i&gt;)
  &lt;/figcaption&gt;
&lt;/figure&gt;</pre>
<h3>Elemen Teknis (<code>&lt;code&gt;</code>, <code>&lt;pre&gt;</code>, <code>&lt;kbd&gt;</code>, <code>&lt;samp&gt;</code>, <code>&lt;var&gt;</code>)</h3>
<p>Untuk situs edukasi pemrograman seperti Kodeloka, kelima elemen ini sangat krusial:</p>
<ul><li><code>&lt;code&gt;</code>: Cuplikan kode komputer inline.</li><li><code>&lt;pre&gt;</code>: Teks pra-format (<em>preformatted</em>) yang mempertahankan spasi dan baris baru apa adanya. Gabungkan <code>&lt;pre&gt;&lt;code&gt;...&lt;/code&gt;&lt;/pre&gt;</code> untuk blok kode multi-baris.</li><li><code>&lt;kbd&gt;</code>: Masukan dari pengguna (biasanya tombol papan ketik seperti <code>&lt;kbd&gt;Ctrl&lt;/kbd&gt; + &lt;kbd&gt;C&lt;/kbd&gt;</code>).</li><li><code>&lt;samp&gt;</code>: Keluaran contoh (<em>sample output</em>) dari program atau terminal komputer.</li><li><code>&lt;var&gt;</code>: Nama variabel matematika atau parameter dalam penjelasan.</li></ul>
<pre>&lt;p&gt;
  Tekan &lt;kbd&gt;Ctrl&lt;/kbd&gt; + &lt;kbd&gt;Shift&lt;/kbd&gt; + &lt;kbd&gt;I&lt;/kbd&gt; untuk membuka konsol,
  lalu jalankan fungsi dengan parameter &lt;var&gt;batasWaktu&lt;/var&gt;:
&lt;/p&gt;

&lt;pre&gt;&lt;code&gt;const hasil = await ambilData(&quot;/api/kelas&quot;, { timeout: 5000 });
console.log(hasil.status);&lt;/code&gt;&lt;/pre&gt;

&lt;p&gt;Jika berhasil, terminal akan mencetak keluaran &lt;samp&gt;200 OK - Data dimuat&lt;/samp&gt;.&lt;/p&gt;</pre>
<h3>Waktu yang Dapat Dibaca Mesin (<code>&lt;time&gt;</code>)</h3>
<p>Manusia senang membaca <code>&quot;16 Oktober 2026 pukul 14.30 WIB&quot;</code>, tetapi program komputer, kalender, dan mesin pencari membutuhkan format standar ISO 8601. Elemen <code>&lt;time&gt;</code> menjembatani keduanya lewat atribut <code>datetime</code>:</p>
<pre>&lt;p&gt;
  Jadwal pemeliharaan server berikutnya adalah pada
  &lt;time datetime=&quot;2026-10-16T14:30:00+07:00&quot;&gt;16 Oktober 2026 pukul 14.30 WIB&lt;/time&gt;.
&lt;/p&gt;</pre>
<h2>Kesalahan Umum dan Cara Menghindarinya</h2>
<ol><li><strong>Menggunakan <code>&lt;br&gt;&lt;br&gt;</code> berulang kali untuk membuat jarak antar-paragraf:</strong><ul><li><strong>Salah:</strong> Menulis satu <code>&lt;p&gt;</code> raksasa lalu memisahkan paragraf dengan <code>&lt;br&gt;&lt;br&gt;</code>. Elemen <code>&lt;br&gt;</code> hanya boleh dipakai untuk jeda baris yang memang menjadi bagian dari konten itu sendiri, seperti baris puisi atau penulisan alamat surat.</li><li><strong>Benar:</strong> Bungkus setiap paragraf dalam tag <code>&lt;p&gt;...&lt;/p&gt;</code> masing-masing, lalu atur jarak vertikalnya dengan properti CSS <code>margin-block-end</code>.</li></ul></li><li><strong>Menaruh seluruh blok kode tanpa <code>&lt;pre&gt;</code>:</strong><ul><li><strong>Salah:</strong> Menaruh kode 10 baris hanya di dalam <code>&lt;code&gt;</code> tanpa <code>&lt;pre&gt;</code>. HTML secara bawaan menggabungkan spasi ganda dan baris baru menjadi satu spasi tunggal (<em>whitespace collapsing</em>), sehingga seluruh kode Anda akan menyatu dalam satu baris!</li><li><strong>Benar:</strong> Bungkus <code>&lt;code&gt;</code> di dalam <code>&lt;pre&gt;</code> (<code>&lt;pre&gt;&lt;code&gt;...&lt;/code&gt;&lt;/pre&gt;</code>).</li></ul></li></ol>
<h2>Latihan Praktik: Menata Artikel Teknis Semantik</h2>
<p>Buatlah berkas <code>artikel-semantik.html</code> yang mendokumentasikan perintah dasar terminal Linux:</p>
<ol><li>Buat struktur judul <code>&lt;h1&gt;</code> dan minimal dua subjudul <code>&lt;h2&gt;</code> serta satu <code>&lt;h3&gt;</code> yang berurutan tanpa melompati level.</li><li>Buat daftar istilah (<code>&lt;dl&gt;</code>, <code>&lt;dt&gt;</code>, <code>&lt;dd&gt;</code>) untuk menjelaskan minimal tiga direktori Linux (<code>/etc</code>, <code>/var</code>, <code>/home</code>).</li><li>Tampilkan satu blok kode perintah bash menggunakan <code>&lt;pre&gt;&lt;code&gt;</code>, pintasan papan ketik <code>&lt;kbd&gt;Ctrl&lt;/kbd&gt; + &lt;kbd&gt;D&lt;/kbd&gt;</code>, peringatan penting dengan <code>&lt;strong&gt;</code>, dan tanggal terbit artikel menggunakan <code>&lt;time datetime=&quot;...&quot;&gt;</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://html.spec.whatwg.org/multipage/text-level-semantics.html" rel="noopener">Text-level semantics — WHATWG HTML Living Standard</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content" rel="noopener">Structuring content with HTML — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements" rel="noopener">HTML elements reference — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["<h2>","<pre>","<strong>","<h1>","<code>","<b>"],
    kuis: [
        {"tanya":"Kapan Anda sebaiknya memilih elemen <dl> (Description List) dibandingkan <ul> atau <ol>?","opsi":["Ketika Anda ingin menampilkan daftar langkah instalasi yang harus dikerjakan secara berurutan dari langkah 1 sampai 5.","Ketika Anda menyusun daftar pasangan istilah/nama (<dt>) beserta penjelasan atau nilainya (<dd>), seperti glosarium atau daftar spesifikasi teknis.","Ketika Anda ingin membuat menu navigasi horizontal di bagian atas halaman.","Ketika Anda membutuhkan tabel dengan perhitungan angka di baris paling bawah."],"benar":1,"penjelasan":"Elemen <dl> dirancang secara semantik untuk memuat kelompok istilah (<dt>) dan deskripsinya (<dd>). Satu istilah <dt> bahkan dapat diikuti oleh beberapa <dd>, atau sebaliknya, sehingga sangat tepat untuk glosarium dan metadata pasangan kunci-nilai."},
        {"tanya":"Apa perbedaan semantik antara <strong> dan <b> dalam HTML modern?","opsi":["Tidak ada perbedaan sama sekali; <b> sudah dihapus dari spesifikasi HTML5.","<strong> menandakan bahwa teks tersebut memiliki tingkat kepentingan, keseriusan, atau urgensi yang tinggi, sedangkan <b> hanya menarik perhatian secara visual tanpa menyiratkan bobot kepentingan ekstra.","<strong> membuat huruf lebih besar 20%, sedangkan <b> hanya menebalkan huruf.","<b> hanya boleh digunakan di dalam tabel, sedangkan <strong> hanya boleh digunakan di dalam paragraf."],"benar":1,"penjelasan":"Menurut spesifikasi WHATWG HTML, <strong> membawa makna semantik berupa tingkat kepentingan atau urgensi tinggi (misalnya kata \"Peringatan:\"), sementara <b> digunakan untuk membedakan kata secara stilistik (seperti kata kunci produk) tanpa menyatakan bahwa bagian itu lebih penting daripada kalimat di sekitarnya."},
        {"tanya":"Anda ingin menampilkan teks \"20 Agustus 2026\" kepada pembaca sekaligus memberikan representasi tanggal yang presisi bagi mesin pencari dan aplikasi kalender. Penulisan manakah yang paling tepat?","opsi":["<date value=\"20-08-2026\">20 Agustus 2026</date>","<span data-tanggal=\"2026-08-20\">20 Agustus 2026</span>","<time datetime=\"2026-08-20\">20 Agustus 2026</time>","<meta name=\"date\" content=\"2026-08-20\">20 Agustus 2026"],"benar":2,"penjelasan":"Elemen <time> dengan atribut datetime berformat standar ISO 8601 (YYYY-MM-DD) adalah cara semantik standar di HTML untuk menyajikan waktu yang ramah manusia di dalam konten tag sekaligus ramah mesin di dalam nilai atributnya."}
    ]
},
{
    id: 5,
    kategori: "1 · Fondasi",
    judul: "Melacak Perubahan Teks (ins, del, s) dan Semantik Editorial",
    tingkat: "Dasar", durasi: "7 mnt",
    tag: ["<ins>","<del>","<s>"],
    ringkas: "Menandai riwayat penyuntingan dokumen secara semantik menggunakan <ins> dan <del> (beserta atribut cite dan datetime), membedakan <del> dari <s>, serta menggunakan <abbr>, <dfn>, dan <address>.",
    isi: `
<h2>Membedakan Teks yang Dihapus (<code>&lt;del&gt;</code>) dan Teks yang Tidak Lagi Relevan (<code>&lt;s&gt;</code>)</h2>
<p>Di HTML, ada dua elemen yang secara visual sama-sama menampilkan garis coret di tengah teks (<em>strikethrough</em>), tetapi memiliki makna semantik yang berbeda:</p>
<ol><li>**<code>&lt;del&gt;</code> (<em>Deleted Text</em>) dan <code>&lt;ins&gt;</code> (<em>Inserted Text</em>):** Digunakan untuk menunjukkan <strong>riwayat revisi atau perubahan naskah</strong> (seperti <em>diff</em> pada dokumen hukum, daftar perubahan rilis perangkat lunak/<em>changelog</em>, atau revisi daftar tugas). Keduanya mendukung atribut <strong><code>datetime</code></strong> (kapan perubahan dilakukan) dan <strong><code>cite</code></strong> (URL penjelasan alasan perubahan)!</li><li>**<code>&lt;s&gt;</code> (<em>Strikethrough / Inaccurate Text</em>):** Digunakan untuk menandai hal yang <strong>sudah tidak akurat atau tidak lagi berlaku</strong>, tanpa menyiratkan bahwa kata tersebut disunting keluar dari dokumen—contoh paling klasiknya adalah <strong>harga asli sebelum diskon</strong> atau <strong>tiket acara yang sudah habis terjual</strong>!</li></ol>
<pre>&lt;!-- 1. Kasus Harga Diskon: Gunakan &lt;s&gt;, ditambah teks bantu untuk pembaca layar --&gt;
&lt;p class=&quot;harga-produk&quot;&gt;
  &lt;span class=&quot;sembunyi-visual&quot;&gt;Harga normal:&lt;/span&gt;
  &lt;s&gt;Rp 450.000&lt;/s&gt;
  &lt;span class=&quot;sembunyi-visual&quot;&gt;Harga promo sekarang:&lt;/span&gt;
  &lt;strong&gt;Rp 299.000&lt;/strong&gt;
&lt;/p&gt;

&lt;!-- 2. Kasus Revisi Dokumen / Changelog: Gunakan &lt;del&gt; dan &lt;ins&gt; dengan datetime --&gt;
&lt;article&gt;
  &lt;h2&gt;Catatan Perubahan Kebijakan API v2&lt;/h2&gt;
  &lt;p&gt;
    Batas permintaan (&lt;em&gt;rate limit&lt;/em&gt;) untuk akun gratis adalah
    &lt;del datetime=&quot;2026-09-01&quot;&gt;60 permintaan per menit&lt;/del&gt;
    &lt;ins datetime=&quot;2026-10-01&quot; cite=&quot;/pengumuman/kenaikan-kuota&quot;&gt;120 permintaan per menit&lt;/ins&gt;.
  &lt;/p&gt;
&lt;/article&gt;</pre>
<h2>2. Mendefinisikan Istilah (<code>&lt;dfn&gt;</code>), Singkatan (<code>&lt;abbr&gt;</code>), dan Kontak (<code>&lt;address&gt;</code>)</h2>
<h3>A. <code>&lt;dfn&gt;</code> (<em>Defining Instance</em>) dan <code>&lt;abbr&gt;</code> (<em>Abbreviation</em>)</h3>
<ul><li>Gunakan <strong><code>&lt;dfn&gt;</code></strong> tepat pada kalimat tempat sebuah istilah teknis <strong>pertama kali didefinisikan</strong> di dalam artikel Anda.</li><li>Gunakan <strong><code>&lt;abbr title=&quot;Kepanjangan&quot;&gt;</code></strong> untuk singkatan atau akronim:</li></ul>
<pre>&lt;p&gt;
  &lt;dfn id=&quot;def-idempoten&quot;&gt;Idempoten&lt;/dfn&gt; (&lt;em&gt;Idempotent&lt;/em&gt;) adalah sifat operasi
  dalam matematika dan ilmu komputer di mana menjalankan operasi yang sama berkali-kali
  akan memberikan dampak status server yang sama persis seperti menjalankannya satu kali,
  contohnya metode &lt;abbr title=&quot;Hypertext Transfer Protocol&quot;&gt;HTTP&lt;/abbr&gt; &lt;code&gt;GET&lt;/code&gt;,
  &lt;code&gt;PUT&lt;/code&gt;, dan &lt;code&gt;DELETE&lt;/code&gt;.
&lt;/p&gt;</pre>
<h3>B. Aturan Semantik Elemen <code>&lt;address&gt;</code></h3>
<p>Banyak pemula mengira <code>&lt;address&gt;</code> dipakai untuk membungkus sembarang alamat jalan fisik (seperti alamat gedung kantor cabang di dalam daftar tabel). Menurut spesifikasi <a href="https://html.spec.whatwg.org/multipage/" rel="noopener">WHATWG HTML</a>, elemen <strong><code>&lt;address&gt;</code> hanya boleh digunakan untuk menyediakan informasi kontak dari penulis artikel (<code>&lt;article&gt;</code>) atau pemilik dokumen halaman (<code>&lt;body&gt;</code>)</strong>—yang bisa berupa tautan surel, akun media sosial penulis, maupun alamat korespondensi resmi!</p>
<pre>&lt;article&gt;
  &lt;h1&gt;Panduan Keamanan Jaringan Linux&lt;/h1&gt;
  &lt;p&gt;Isi pembahasan artikel...&lt;/p&gt;
  &lt;footer&gt;
    &lt;address&gt;
      Ada koreksi teknis pada artikel ini? Hubungi penulis di
      &lt;a href=&quot;mailto:tim-linux@asadinedu.com&quot;&gt;tim-linux@asadinedu.com&lt;/a&gt;.
    &lt;/address&gt;
  &lt;/footer&gt;
&lt;/article&gt;</pre>
<h2>Latihan Praktik: Menyusun Halaman Catatan Rilis (<em>Release Notes</em>) dan Glosarium</h2>
<p>Buatlah berkas <code>editorial-semantik.html</code>:</p>
<ol><li>Buat pengumuman perubahan harga paket server yang menggunakan <code>&lt;s&gt;</code> untuk harga lama dan <code>&lt;strong&gt;</code> untuk harga baru.</li><li>Buat daftar perubahan kebijakan layanan menggunakan pasangan <code>&lt;del datetime=&quot;...&quot;&gt;</code> dan <code>&lt;ins datetime=&quot;...&quot;&gt;</code>.</li><li>Buat paragraf penjelasan istilah menggunakan <code>&lt;dfn&gt;</code> dan <code>&lt;abbr&gt;</code>, lalu tutup artikel dengan informasi kontak penulis di dalam <code>&lt;address&gt;</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://html.spec.whatwg.org/multipage/text-level-semantics.html" rel="noopener">Text-level semantics — WHATWG HTML Living Standard</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements" rel="noopener">HTML elements reference (&lt;del&gt;, &lt;ins&gt;, &lt;s&gt;, &lt;address&gt;) — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["<address>","<dfn>","<s>","<abbr>","<del>","<ins>"],
    kuis: [
        {"tanya":"Elemen HTML manakah yang paling tepat secara semantik untuk mencoret harga normal sebelum diskon (misalnya mencoret Rp 200.000 di sebelah harga promo Rp 120.000)?","opsi":["<del>","<s>","<strike>","<ins>"],"benar":1,"penjelasan":"Menurut spesifikasi HTML, <s> merepresentasikan informasi yang sudah tidak lagi akurat atau tidak lagi relevan (seperti harga normal sebelum diskon), sedangkan <del> merepresentasikan penghapusan teks dalam riwayat penyuntingan dokumen. Adapun <strike> sudah usang (obsolete)."},
        {"tanya":"Kapan penggunaan elemen <address> tepat menurut spesifikasi HTML?","opsi":["Untuk membungkus setiap alamat pengiriman pelanggan di dalam tabel daftar pesanan","Untuk menyediakan informasi kontak (surel, tautan profil, atau alamat korespondensi) yang berkaitan dengan penulis <article> terdekat atau pemilik dokumen <body> secara keseluruhan","Untuk menuliskan alamat IP server seperti 192.168.1.1","Untuk menggantikan fungsi tag <a href=\"mailto:...\">"],"benar":1,"penjelasan":"Elemen <address> secara khusus memiliki semantik informasi kontak untuk leluhur <article> atau <body> terdekat, bukan penanda alamat pos sembarangan."},
        {"tanya":"Atribut apa sajakah yang didukung secara khusus oleh elemen <ins> dan <del> untuk mendokumentasikan riwayat revisi?","opsi":["src dan alt","cite (URL dokumen yang menjelaskan alasan perubahan) dan datetime (waktu terjadinya perubahan)","action dan method","scope dan headers"],"benar":1,"penjelasan":"Kedua elemen penyuntingan <ins> dan <del> memiliki atribut spesifik cite dan datetime untuk merekam metadata audit perubahan."}
    ]
},
{
    id: 6,
    kategori: "1 · Fondasi",
    judul: "Elemen Teks Teknis Lanjutan: data, wbr, bdo, dan pre Aksesibel",
    tingkat: "Dasar", durasi: "7 mnt",
    tag: ["<data>","<wbr>","<bdo>"],
    ringkas: "Menghubungkan nilai ramah-manusia dan ramah-mesin dengan elemen <data>, mengatur titik pemenggalan URL/path panjang dengan <wbr>, memaksa arah teks dengan <bdo>, serta menyajikan blok kode yang mudah diakses.",
    isi: `
<h2>1. Menyandingkan Nilai Manusia dan Nilai Mesin dengan <code>&lt;data&gt;</code></h2>
<p>Pada Pelajaran 03, kita telah mengenal <code>&lt;time datetime=&quot;...&quot;&gt;</code> yang khusus digunakan untuk tanggal dan waktu. Namun bagaimana jika data yang ingin Anda tampilkan bukanlah waktu, melainkan <strong>nomor SKU produk, nilai numerik mentah, atau kode satuan</strong> yang perlu dibaca manusia sebagai teks tetapi perlu dibaca oleh skrip/perayap sebagai nilai standar?</p>
<p>Gunakan elemen <strong><code>&lt;data value=&quot;...&quot;&gt;</code></strong>!</p>
<pre>&lt;ul&gt;
  &lt;li&gt;
    &lt;data value=&quot;SKU-PG-01&quot;&gt;Kelas PostgreSQL Produksi&lt;/data&gt; —
    Kapasitas peserta: &lt;data value=&quot;150&quot;&gt;Seratus lima puluh orang&lt;/data&gt;
  &lt;/li&gt;
  &lt;li&gt;
    &lt;data value=&quot;SKU-K8S-02&quot;&gt;Kelas Administrasi Kubernetes&lt;/data&gt; —
    Kapasitas peserta: &lt;data value=&quot;80&quot;&gt;Delapan puluh orang&lt;/data&gt;
  &lt;/li&gt;
&lt;/ul&gt;</pre>
<p>Dengan <code>&lt;data value=&quot;150&quot;&gt;</code>, skrip pengurut tabel atau mesin pengindeks dapat langsung membaca nilai numerik <code>150</code> dari atribut <code>value</code> tanpa perlu mengurai teks bahasa manusia <code>&quot;Seratus lima puluh orang&quot;</code>.</p>
<h2>2. Mengendalikan Pemenggalan Kata Panjang dan URL dengan <code>&lt;wbr&gt;</code> (<em>Word Break Opportunity</em>)</h2>
<p>Pernahkah Anda menampilkan alamat URL panjang atau jalur direktori sistem berkas seperti <code>/var/lib/postgresql/17/main/pg_wal/000000010000000000000001</code> di dalam kolom yang sempit?</p>
<ul><li>Jika dibiarkan, teks panjang tanpa spasi akan <strong>meluber menembus kotak</strong>!</li><li>Jika dipaksa dengan CSS <code>word-break: break-all;</code>, peramban memotong kata secara sembarangan di tengah suku kata (misalnya <code>postg</code> di baris atas dan <code>resql</code> di baris bawah) sehingga membingungkan pembaca!</li></ul>
<p>Elemen hampa **<code>&lt;wbr&gt;</code> (<em>Word Break Opportunity</em>)<strong> memungkinkan Anda menentukan </strong>titik potong yang tepat dan logis** (misalnya tepat sebelum tanda garis miring <code>/</code> atau titik <code>.</code>): jika ruang kolom masih lebar, <code>&lt;wbr&gt;</code> tidak menampilkan spasi apa pun; tetapi jika ruang kolom sempit, peramban akan mematahkan baris tepat di titik <code>&lt;wbr&gt;</code>!</p>
<pre>&lt;p&gt;
  Berkas konfigurasi utama berada di jalur:
  &lt;code&gt;/etc&lt;wbr&gt;/nginx&lt;wbr&gt;/sites-available&lt;wbr&gt;/kodeloka.asadinedu.com.conf&lt;/code&gt;
&lt;/p&gt;</pre>
<h2>3. Membalik Arah Teks Secara Eksplisit dengan <code>&lt;bdo&gt;</code> (<em>Bidirectional Override</em>)</h2>
<p>Berbeda dengan <code>&lt;bdi&gt;</code> yang mengisolasi arah baca otomatis, elemen <strong><code>&lt;bdo dir=&quot;rtl&quot;&gt;</code> (atau <code>dir=&quot;ltr&quot;</code>)</strong> <strong>memaksa</strong> karakter di dalamnya ditampilkan sesuai arah yang ditentukan dengan mengesampingkan algoritma arah bawaan karakter tersebut:</p>
<pre>&lt;!-- Memaksa urutan karakter tampil dari kanan ke kiri (akan tampil sebagai &quot;987654321&quot;) --&gt;
&lt;p&gt;Urutan terbalik: &lt;bdo dir=&quot;rtl&quot;&gt;123456789&lt;/bdo&gt;&lt;/p&gt;</pre>
<h2>4. Pola Penyajian Blok <code>&lt;pre&gt;&lt;code&gt;</code> yang Aksesibel di Situs Dokumentasi</h2>
<p>Karena blok <code>&lt;pre&gt;</code> mempertahankan baris yang panjang dan sering menggunakan <code>overflow-x: auto</code>, pengguna yang hanya memakai papan ketik tidak akan bisa menggulir blok kode tersebut ke kanan kecuali elemen <code>&lt;pre&gt;</code> diberi <strong><code>tabindex=&quot;0&quot;</code></strong> dan label yang jelas:</p>
<pre>&lt;figure aria-labelledby=&quot;caption-kode-nginx&quot;&gt;
  &lt;figcaption id=&quot;caption-kode-nginx&quot;&gt;
    Konfigurasi &lt;code&gt;/etc/nginx/nginx.conf&lt;/code&gt; untuk Reverse Proxy
  &lt;/figcaption&gt;
  &lt;pre tabindex=&quot;0&quot; role=&quot;region&quot; aria-labelledby=&quot;caption-kode-nginx&quot;&gt;&lt;code translate=&quot;no&quot;&gt;location /api/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
}&lt;/code&gt;&lt;/pre&gt;
&lt;/figure&gt;</pre>
<h2>Latihan Praktik: Dokumentasi Jalur Sistem Berkas dan Spesifikasi Produk</h2>
<p>Buatlah berkas <code>data-dan-wbr.html</code>:</p>
<ol><li>Buat daftar spesifikasi 3 paket server menggunakan <code>&lt;data value=&quot;...&quot;&gt;</code> untuk kapasitas RAM dalam byte dan harga dalam angka bulat.</li><li>Tampilkan 2 jalur sistem berkas Linux yang panjang menggunakan <code>&lt;code&gt;</code> yang disisipi <code>&lt;wbr&gt;</code> di setiap batas direktori <code>/</code>.</li><li>Bungkus satu blok kode konfigurasi dengan <code>&lt;figure&gt;</code>, <code>&lt;figcaption&gt;</code>, dan <code>&lt;pre tabindex=&quot;0&quot;&gt;</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://html.spec.whatwg.org/multipage/text-level-semantics.html" rel="noopener">Text-level semantics (&lt;data&gt;, &lt;wbr&gt;, &lt;bdo&gt;) — WHATWG HTML Living Standard</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements" rel="noopener">HTML elements reference — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["<wbr>","<data value=\"...\">","/","<pre>","<data>","<time datetime=\"...\">"],
    kuis: [
        {"tanya":"Apa fungsi dari elemen void <wbr> ketika disisipkan di tengah teks URL panjang seperti https://kodeloka<wbr>.asadinedu<wbr>.com?","opsi":["Selalu memaksa teks pindah ke baris baru seperti elemen <br>","Memberi tahu peramban titik opsional yang diizinkan untuk mematahkan baris apabila lebar wadah tidak mencukupi, tanpa menambahkan spasi jika baris masih muat","Menambahkan tanda hubung - secara permanen di tengah teks","Menyembunyikan bagian akhir URL"],"benar":1,"penjelasan":"<wbr> (Word Break Opportunity) adalah petunjuk pemenggalan baris bersyarat: tidak tampak saat ruang mencukupi, dan menjadi titik patah baris yang rapi saat ruang menyempit."},
        {"tanya":"Kapan Anda harus memilih elemen <data value=\"...\"> dibandingkan elemen <time datetime=\"...\">?","opsi":["Ketika nilai yang direpresentasikan berupa tanggal lahir atau jam rapat","Ketika Anda ingin mengaitkan teks yang ramah manusia dengan nilai terstruktur yang dapat dibaca mesin yang bukan merupakan tanggal atau waktu (seperti kode SKU barang, ID entitas, atau angka metrik)","Ketika Anda ingin menyimpan data di dalam localStorage","Ketika membuat daftar pilihan untuk <input>"],"benar":1,"penjelasan":"<time> dikhususkan untuk nilai waktu/tanggal ISO 8601, sedangkan <data> digunakan untuk segala jenis nilai representasi mesin lainnya (angka, kode produk, bobot)."},
        {"tanya":"Mengapa elemen <pre> yang memiliki overflow-x: auto disarankan diberi atribut tabindex=\"0\"?","opsi":["Agar kode di dalamnya otomatis dijalankan oleh peramban","Agar pengguna yang bernavigasi menggunakan papan ketik (tanpa tetikus) dapat memfokuskan blok <pre> tersebut dengan tombol Tab lalu menggulir baris kode yang panjang ke kanan/kiri menggunakan tombol panah","Agar warna latar <pre> berubah menjadi hitam","Karena tanpa tabindex=\"0\", tag <code> di dalamnya tidak terbaca"],"benar":1,"penjelasan":"Kontainer yang dapat digulir (scrollable region) yang tidak memiliki elemen interaktif di dalamnya perlu diberi tabindex=\"0\" agar dapat menerima fokus papan ketik untuk digulir dengan tombol panah."}
    ]
},
{
    id: 7,
    kategori: "1 · Fondasi",
    judul: "Struktur Tata Letak Semantik dan Landmark Dokumen",
    tingkat: "Dasar", durasi: "11 mnt",
    tag: ["<section>","<div>","<header>"],
    ringkas: "Merancang arsitektur halaman web yang bermakna menggunakan elemen penanda wilayah (landmark) seperti <header>, <nav>, <main>, <article>, <section>, <aside>, <search>, dan <footer> untuk menggantikan sindrom <div> berlebihan (div soup).",
    isi: `
<h2>Masalah pada &quot;Div Soup&quot;</h2>
<p>Sebelum hadirnya elemen struktural HTML5, hampir seluruh bagian halaman web dibungkus menggunakan elemen generik <code>&lt;div&gt;</code>:</p>
<pre>&lt;!-- Pola lama (&quot;Div Soup&quot;) — tidak memberikan petunjuk makna bagi mesin maupun pembaca layar --&gt;
&lt;div class=&quot;atas&quot;&gt;
  &lt;div class=&quot;menu&quot;&gt;...&lt;/div&gt;
&lt;/div&gt;
&lt;div class=&quot;tengah&quot;&gt;
  &lt;div class=&quot;tulisan-utama&quot;&gt;...&lt;/div&gt;
  &lt;div class=&quot;bilah-samping&quot;&gt;...&lt;/div&gt;
&lt;/div&gt;
&lt;div class=&quot;bawah&quot;&gt;...&lt;/div&gt;</pre>
<p>Bagi manusia yang melihat layar setelah CSS dimuat, halaman tersebut tampak normal. Namun bagi pengguna pembaca layar (<em>screen reader</em>), perayap mesin pencari, atau ekstensi mode baca, kode di atas hanyalah tumpukan kotak tanpa identitas. Mereka tidak tahu kotak mana yang merupakan menu navigasi yang harus dilewati dan kotak mana yang berisi isi utama halaman.</p>
<h2>Peta Wilayah (<em>Landmarks</em>) Halaman HTML Modern</h2>
<p>HTML menyediakan elemen struktural yang secara otomatis memetakan <strong>ARIA Landmarks</strong> (penanda wilayah aksesibilitas) tanpa perlu menulis atribut ARIA tambahan:</p>
<pre>+-------------------------------------------------------------------+
| &lt;header&gt;  (Landmark: banner — jika berada langsung di &lt;body&gt;)     |
|   +-----------------------------------------------------------+   |
|   | &lt;nav&gt; (Landmark: navigation)   | &lt;search&gt; (Landmark: search)|  |
|   +-----------------------------------------------------------+   |
+-------------------------------------------------------------------+
| &lt;main&gt;    (Landmark: main — hanya satu yang aktif per halaman)    |
|   +---------------------------------------+ +-------------------+ |
|   | &lt;article&gt;                             | | &lt;aside&gt;           | |
|   |   &lt;header&gt;Judul &amp; Tanggal&lt;/header&gt;    | | (Landmark:        | |
|   |   &lt;section&gt;Bab 1...&lt;/section&gt;         | |  complementary)   | |
|   |   &lt;section&gt;Bab 2...&lt;/section&gt;         | |                   | |
|   +---------------------------------------+ +-------------------+ |
+-------------------------------------------------------------------+
| &lt;footer&gt;  (Landmark: contentinfo — jika berada langsung di &lt;body&gt;)|
+-------------------------------------------------------------------+</pre>
<h3>1. <code>&lt;header&gt;</code> dan <code>&lt;footer&gt;</code></h3>
<ul><li><strong><code>&lt;header&gt;</code>:</strong> Berisi konten pengantar atau alat bantu navigasi. Ketika diletakkan langsung sebagai anak dari <code>&lt;body&gt;</code>, ia berperan sebagai kepala situs global (<em>banner</em> yang memuat logo dan navigasi utama). Namun, <code>&lt;header&gt;</code> juga <strong>boleh digunakan di dalam <code>&lt;article&gt;</code> atau <code>&lt;section&gt;</code></strong> untuk membungkus judul artikel, nama penulis, dan tanggal terbit.</li><li><strong><code>&lt;footer&gt;</code>:</strong> Berisi informasi penutup dari bagian terdekatnya, seperti hak cipta, tautan kebijakan privasi, atau biodata penulis di akhir sebuah <code>&lt;article&gt;</code>.</li></ul>
<h3>2. <code>&lt;nav&gt;</code>: Hanya untuk Navigasi Utama</h3>
<p>Gunakan <code>&lt;nav&gt;</code> untuk kelompok tautan navigasi penting seperti menu utama situs, daftar isi bab modul, atau jejak halaman (<em>breadcrumbs</em>).</p>
<ul><li>Anda tidak perlu membungkus setiap tautan di <code>&lt;footer&gt;</code> dengan <code>&lt;nav&gt;</code>; cukup tautan navigasi utama agar daftar <em>landmark</em> di pembaca layar tidak penuh sesak.</li><li>Jika satu halaman memiliki lebih dari satu <code>&lt;nav&gt;</code> (misalnya menu utama di atas dan daftar isi bab di samping), berikan label yang jelas menggunakan <code>aria-label</code>:</li></ul>
<pre>&lt;nav aria-label=&quot;Menu utama&quot;&gt;
  &lt;ul&gt;
    &lt;li&gt;&lt;a href=&quot;/&quot;&gt;Beranda&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href=&quot;/kelas&quot; aria-current=&quot;page&quot;&gt;Katalog Kelas&lt;/a&gt;&lt;/li&gt;
  &lt;/ul&gt;
&lt;/nav&gt;

&lt;nav aria-label=&quot;Daftar isi modul&quot;&gt;
  &lt;ol&gt;
    &lt;li&gt;&lt;a href=&quot;#pengantar&quot;&gt;Pengantar&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href=&quot;#latihan&quot;&gt;Latihan&lt;/a&gt;&lt;/li&gt;
  &lt;/ol&gt;
&lt;/nav&gt;</pre>
<h3>3. <code>&lt;main&gt;</code>: Inti Unik dari Halaman</h3>
<p>Elemen <code>&lt;main&gt;</code> membungkus konten utama yang unik untuk halaman tersebut (bukan bagian yang berulang di setiap halaman seperti bilah navigasi atau logo situs).</p>
<ul><li>Hanya boleh ada <strong>satu elemen <code>&lt;main&gt;</code> yang tampak (tidak berstatus <code>hidden</code>)</strong> dalam satu halaman.</li><li>Keberadaan <code>&lt;main&gt;</code> memungkinkan pengguna papan ketik dan pembaca layar langsung melompat ke isi utama tanpa harus menekan tombol <code>Tab</code> puluhan kali melewati menu atas.</li></ul>
<h3>4. <code>&lt;article&gt;</code> vs <code>&lt;section&gt;</code> vs <code>&lt;div&gt;</code>: Cara Memilih dengan Tepat</h3>
<p>Banyak pengembang tertukar saat memilih antara <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, dan <code>&lt;div&gt;</code>. Gunakan aturan praktis tiga langkah ini:</p>
<ol><li><strong>Apakah blok konten ini tetap masuk akal dan utuh seandainya dicabut dari halaman ini lalu disebarkan secara mandiri (misalnya lewat RSS feed atau dibagikan sebagai kartu berita tersendiri)?</strong><ul><li>Jika <strong>Ya</strong>, gunakan <strong><code>&lt;article&gt;</code></strong>. Contoh: satu tulisan blog, satu kartu produk di katalog, satu komentar pengguna, atau satu widget cuaca interaktif. <code>&lt;article&gt;</code> bahkan boleh bersarang di dalam <code>&lt;article&gt;</code> (misalnya daftar komentar pembaca di dalam sebuah artikel utama).</li></ul></li><li><strong>Apakah blok konten ini merupakan pengelompokan tematik (seperti satu bab dalam dokumen) yang memiliki judul (<code>&lt;h2&gt;</code>–<code>&lt;h6&gt;</code>) sendiri?</strong><ul><li>Jika <strong>Ya</strong>, gunakan <strong><code>&lt;section&gt;</code></strong>. Contoh: bagian &quot;Fitur Unggulan&quot;, bagian &quot;Ulasan Pelanggan&quot;, atau bab dalam satu artikel panjang.</li></ul></li><li>**Apakah Anda hanya membutuhkan pembungkus semata-mata untuk mengatur tata letak CSS (seperti membuat <em>grid</em> atau <em>flexbox</em>) tanpa arti semantik khusus?**<ul><li>Jika <strong>Ya</strong>, gunakan <strong><code>&lt;div&gt;</code></strong> (untuk blok) atau <strong><code>&lt;span&gt;</code></strong> (untuk teks sebaris). <code>&lt;div&gt;</code> bukanlah sesuatu yang terlarang; ia tetap tepat digunakan sebagai wadah murni untuk penataan gaya visual!</li></ul></li></ol>
<h3>5. <code>&lt;aside&gt;</code> dan <code>&lt;search&gt;</code></h3>
<ul><li><strong><code>&lt;aside&gt;</code>:</strong> Mewakili konten yang berkaitan secara tidak langsung dengan konten utama di sekitarnya, seperti kotak info tambahan (<em>callout</em>), bilah samping daftar artikel populer, atau iklan.</li><li><strong><code>&lt;search&gt;</code>:</strong> Elemen semantik baru (tersedia di semua peramban utama sejak Oktober 2023; berstatus <strong>Baseline Widely Available</strong> sejak April 2026) yang dirancang khusus untuk membungkus formulir atau fitur pencarian maupun penyaringan (<em>filtering</em>) data di halaman, menggantikan kebutuhan menulis <code>&lt;div role=&quot;search&quot;&gt;</code>.</li></ul>
<h2>Contoh Kode Lengkap: Struktur Halaman Artikel Edukasi</h2>
<pre>&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;id&quot;&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;
    &lt;title&gt;Memahami Struktur Semantik — Kodeloka&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;a href=&quot;#konten-utama&quot; class=&quot;lompat-ke-konten&quot;&gt;Lompat ke konten utama&lt;/a&gt;

    &lt;header&gt;
      &lt;a href=&quot;/&quot;&gt;Kodeloka&lt;/a&gt;
      &lt;nav aria-label=&quot;Navigasi utama&quot;&gt;
        &lt;ul&gt;
          &lt;li&gt;&lt;a href=&quot;/html/&quot;&gt;HTML&lt;/a&gt;&lt;/li&gt;
          &lt;li&gt;&lt;a href=&quot;/css/&quot;&gt;CSS&lt;/a&gt;&lt;/li&gt;
          &lt;li&gt;&lt;a href=&quot;/javascript/&quot;&gt;JavaScript&lt;/a&gt;&lt;/li&gt;
          &lt;li&gt;&lt;a href=&quot;/php/&quot;&gt;PHP&lt;/a&gt;&lt;/li&gt;
        &lt;/ul&gt;
      &lt;/nav&gt;
      &lt;search&gt;
        &lt;form action=&quot;/cari&quot; method=&quot;get&quot;&gt;
          &lt;label for=&quot;input-cari&quot;&gt;Cari materi&lt;/label&gt;
          &lt;input id=&quot;input-cari&quot; name=&quot;q&quot; type=&quot;search&quot; placeholder=&quot;Mis. flexbox, PDO...&quot;&gt;
          &lt;button type=&quot;submit&quot;&gt;Cari&lt;/button&gt;
        &lt;/form&gt;
      &lt;/search&gt;
    &lt;/header&gt;

    &lt;main id=&quot;konten-utama&quot;&gt;
      &lt;article&gt;
        &lt;header&gt;
          &lt;h1&gt;Arsitektur Halaman Web Semantik&lt;/h1&gt;
          &lt;p&gt;Diterbitkan pada &lt;time datetime=&quot;2026-10-16&quot;&gt;16 Oktober 2026&lt;/time&gt;&lt;/p&gt;
        &lt;/header&gt;

        &lt;section aria-labelledby=&quot;bab-landmark&quot;&gt;
          &lt;h2 id=&quot;bab-landmark&quot;&gt;Mengenal Landmark Dokumen&lt;/h2&gt;
          &lt;p&gt;Landmark membantu pengguna menavigasi bagian halaman dengan cepat...&lt;/p&gt;
        &lt;/section&gt;

        &lt;aside aria-label=&quot;Tips cepat&quot;&gt;
          &lt;h2&gt;Tips Praktis&lt;/h2&gt;
          &lt;p&gt;Selalu berikan atribut &lt;code&gt;aria-label&lt;/code&gt; jika terdapat dua elemen &lt;code&gt;&amp;lt;nav&amp;gt;&lt;/code&gt; di halaman yang sama.&lt;/p&gt;
        &lt;/aside&gt;

        &lt;footer&gt;
          &lt;p&gt;Ditulis oleh Tim Kurikulum Kodeloka.&lt;/p&gt;
        &lt;/footer&gt;
      &lt;/article&gt;
    &lt;/main&gt;

    &lt;footer&gt;
      &lt;p&gt;&lt;small&gt;&amp;copy; 2026 Kodeloka — Bagian dari Asadin Edu.&lt;/small&gt;&lt;/p&gt;
    &lt;/footer&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
<h2>Kesalahan Umum dan Cara Menghindarinya</h2>
<ol><li><strong>Mengganti semua <code>&lt;div&gt;</code> dengan <code>&lt;section&gt;</code> secara membabi buta:</strong><ul><li><strong>Salah:</strong> Membungkus deretan tombol atau pembungkus kolom <em>flexbox</em> dengan <code>&lt;section&gt;</code> tanpa judul. <code>&lt;section&gt;</code> tanpa heading membuat struktur dokumen menjadi rancu.</li><li><strong>Benar:</strong> Gunakan <code>&lt;section&gt;</code> hanya untuk bagian bermakna yang memiliki judul (<code>&lt;h2&gt;</code>–<code>&lt;h6&gt;</code>), dan tetap gunakan <code>&lt;div&gt;</code> untuk wadah tata letak visual murni.</li></ul></li><li><strong>Menaruh <code>&lt;header&gt;</code> atau <code>&lt;footer&gt;</code> di dalam <code>&lt;header&gt;</code> atau <code>&lt;footer&gt;</code> lain:</strong><ul><li><strong>Salah:</strong> Spesifikasi HTML melarang elemen <code>&lt;header&gt;</code> atau <code>&lt;footer&gt;</code> memiliki keturunan berupa <code>&lt;header&gt;</code> atau <code>&lt;footer&gt;</code> lainnya.</li></ul></li></ol>
<h2>Latihan Praktik: Mengubah &quot;Div Soup&quot; Menjadi Semantik</h2>
<p>Perhatikan struktur kerangka situs berita berikut yang masih memakai <code>&lt;div&gt;</code> untuk semuanya:</p>
<ol><li>Terdapat kepala situs berisi nama portal, menu kategori berita, dan kotak pencarian artikel.</li><li>Terdapat area utama berisi satu berita utama lengkap (dengan judul, waktu tayang, 2 subbagian pembahasan, dan kotak &quot;Berita Terkait&quot; di sampingnya).</li><li>Terdapat kaki situs berisi informasi redaksi dan hak cipta.</li></ol>
<p>Tulislah berkas <code>berita-semantik.html</code> yang menerjemahkan kerangka tersebut ke dalam elemen <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;search&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;aside&gt;</code>, dan <code>&lt;footer&gt;</code> secara tepat!</p>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents" rel="noopener">Structuring documents — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML" rel="noopener">HTML: A good basis for accessibility — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements" rel="noopener">HTML elements reference — MDN Web Docs</a></li><li><a href="https://web.dev/learn/accessibility" rel="noopener">Learn Accessibility — web.dev</a></li></ul></div>
`,
    perintah: ["<section>","<div>","<header>","<footer>","<article>","<nav>"],
    kuis: [
        {"tanya":"Manakah kasus penggunaan yang paling tepat untuk elemen <article> dibandingkan <section>?","opsi":["Membungkus tiga tombol aksi di bagian bawah formulir pendaftaran.","Membungkus satu kartu kiriman forum atau komentar pengguna yang memiliki penulis, waktu kirim, dan isi yang utuh bila ditampilkan secara mandiri.","Membuat wadah pembungkus semata-mata agar CSS Grid dapat mengatur jarak antar-kolom.","Membungkus bilah pencarian di bagian pojok kanan atas halaman."],"benar":1,"penjelasan":"<article> diperuntukkan bagi komposisi konten mandiri (self-contained) yang tetap bermakna utuh apabila didistribusikan ulang secara terpisah dari halaman aslinya, seperti artikel berita, kartu produk, atau kiriman komentar pengguna."},
        {"tanya":"Mengapa kita perlu menambahkan aria-label ketika sebuah halaman memiliki dua elemen <nav> (misalnya navigasi utama di bagian atas dan navigasi daftar isi di bagian samping)?","opsi":["Karena peramban akan menolak menerapkan aturan CSS pada elemen <nav> kedua jika tidak memiliki atribut aria-label.","Agar pengguna pembaca layar dapat membedakan fungsi kedua wilayah navigasi tersebut saat membuka daftar landmark halaman.","Karena atribut aria-label otomatis membuat menu kedua menempel (sticky) saat halaman digulir.","Agar tautan di dalam <nav> kedua terbuka di tab baru secara otomatis."],"benar":1,"penjelasan":"Pembaca layar menampilkan daftar semua landmark di halaman. Jika terdapat dua <nav> tanpa nama, pembaca layar hanya menyebut \"navigation\" dan \"navigation\". Dengan aria-label=\"Menu utama\" dan aria-label=\"Daftar isi modul\", pengguna langsung memahami tujuan masing-masing navigasi."},
        {"tanya":"Elemen HTML manakah yang secara khusus diperkenalkan untuk menandai wilayah fungsi pencarian atau penyaringan (filtering) tanpa perlu menambahkan role=\"search\" secara manual?","opsi":["<find>","<filter>","<search>","<query>"],"benar":2,"penjelasan":"Elemen <search> adalah elemen semantik HTML (Baseline Widely Available) yang secara bawaan memetakan wilayahnya ke ARIA landmark role=\"search\", sehingga membungkus <form> atau kontrol penyaringan data dengan makna aksesibilitas yang tepat."}
    ]
},
{
    id: 8,
    kategori: "1 · Fondasi",
    judul: "Tautan, Struktur URL, dan Navigasi yang Aman",
    tingkat: "Dasar", durasi: "10 mnt",
    tag: ["target=\"_blank\"","<a>","href"],
    ringkas: "Menguasai elemen jangkar <a>, perbedaan jalur URL absolut dan relatif, navigasi fragmen halaman, skema khusus, serta atribut keamanan dan aksesibilitas pada tautan.",
    isi: `
<h2>Jantung dari Web: Hyperlink (<code>&lt;a&gt;</code>)</h2>
<p>Huruf <strong>H</strong> dan <strong>T</strong> pada HTML adalah <em>HyperText</em>—teks yang saling terhubung melalui tautan (<em>links</em>). Elemen <code>&lt;a&gt;</code> (<em>anchor</em>) mengubah teks atau elemen di dalamnya menjadi jembatan menuju halaman lain, bagian lain di halaman yang sama, berkas unduhan, atau aplikasi eksternal.</p>
<pre>&lt;a href=&quot;https://kodeloka.asadinedu.com/golang/&quot;&gt;Pelajari Kelas Golang di Kodeloka&lt;/a&gt;</pre>
<h2>1. Memahami Jalur URL: Absolut, Root-Relative, dan Document-Relative</h2>
<p>Memilih jenis jalur (<em>path</em>) yang tepat pada atribut <code>href</code> menentukan apakah tautan Anda tetap berfungsi saat situs dipindahkan dari lingkungan pengembangan lokal (<code>http://localhost:8790</code>) ke domain produksi (<code>https://kodeloka.asadinedu.com</code>).</p>
<table><thead><tr><th>Jenis Jalur</th><th>Contoh Nilai <code>href</code></th><th>Kapan Digunakan?</th></tr></thead><tbody><tr><td><strong>URL Absolut</strong></td><td><code>https://developer.mozilla.org/en-US/</code></td><td>Saat menautkan ke situs eksternal di domain yang berbeda.</td></tr><tr><td><strong>Root-Relative</strong> (Relatif terhadap akar domain)</td><td><code>/css/index.html</code> atau <code>/assets/style.css</code></td><td>Dimulai dengan garis miring <code>/</code>. Selalu mengacu dari akar domain aktif, tidak peduli sedalam apa folder halaman saat ini berada. Sangat direkomendasikan untuk navigasi internal situs.</td></tr><tr><td><strong>Document-Relative</strong> (Relatif terhadap berkas saat ini)</td><td><code>02-struktur.html</code> atau <code>../assets/logo.svg</code></td><td>Mengacu dari lokasi berkas HTML yang sedang dibuka. <code>../</code> berarti naik satu tingkat folder ke atas. Cocok untuk modul yang berada dalam satu folder yang sama.</td></tr></tbody></table>
<pre>Struktur Folder:
/ (akar situs)
├── index.html
├── assets/
│   └── panduan.pdf
└── html/
    ├── index.html
    └── materi/
        └── 05-tautan.html   &lt;-- Anda sedang berada di berkas ini</pre>
<p>Jika Anda berada di <code>/html/materi/05-tautan.html</code>:</p>
<ul><li>Menuju <code>/index.html</code> (Beranda): gunakan <code>href=&quot;/&quot;</code> (root-relative) atau <code>href=&quot;../../index.html&quot;</code> (document-relative).</li><li>Menuju <code>/html/index.html</code>: gunakan <code>href=&quot;/html/&quot;</code> atau <code>href=&quot;../index.html&quot;</code>.</li><li>Menuju <code>/assets/panduan.pdf</code>: gunakan <code>href=&quot;/assets/panduan.pdf&quot;</code> atau <code>href=&quot;../../assets/panduan.pdf&quot;</code>.</li></ul>
<h2>2. Tautan Fragmen (<em>Same-Page Anchor</em>) dan Skip Link</h2>
<p>Jika nilai <code>href</code> diawali tanda pagar (<code>#</code>) diikuti nilai <code>id</code> dari sebuah elemen di halaman, peramban akan menggulir layar langsung ke elemen tersebut dan memindahkan fokus navigasi ke sana:</p>
<pre>&lt;!-- Navigasi daftar isi di bagian atas artikel --&gt;
&lt;nav aria-label=&quot;Daftar isi bab&quot;&gt;
  &lt;ul&gt;
    &lt;li&gt;&lt;a href=&quot;#jalur-url&quot;&gt;1. Memahami Jalur URL&lt;/a&gt;&lt;/li&gt;
    &lt;li&gt;&lt;a href=&quot;#keamanan-tautan&quot;&gt;2. Keamanan Tautan Eksternal&lt;/a&gt;&lt;/li&gt;
  &lt;/ul&gt;
&lt;/nav&gt;

&lt;!-- Target lompatan di dalam isi artikel --&gt;
&lt;section id=&quot;jalur-url&quot;&gt;
  &lt;h2&gt;1. Memahami Jalur URL&lt;/h2&gt;
  &lt;p&gt;Pembahasan mengenai URL absolut dan relatif...&lt;/p&gt;
&lt;/section&gt;

&lt;section id=&quot;keamanan-tautan&quot;&gt;
  &lt;h2&gt;2. Keamanan Tautan Eksternal&lt;/h2&gt;
  &lt;p&gt;Pembahasan mengenai atribut target dan rel...&lt;/p&gt;
&lt;/section&gt;</pre>
<div class="callout info"><div class="callout-judul">💡 Tips Praktis: Mengatur Guliran Halus dan Jarak Header dengan CSS</div><p>Saat pengguna mengeklik tautan <code>#keamanan-tautan</code>, judul bagian sering kali tertutup oleh bilah navigasi atas yang bersifat <code>position: sticky</code>. Anda dapat memperbaikinya cukup dengan dua properti CSS:</p>
<pre>html {
  scroll-behavior: smooth;
}
section[id] {
  scroll-margin-top: 5rem; /* Memberi jarak aman dari header sticky */
}</pre></div>
<h2>3. Atribut Penting pada <code>&lt;a&gt;</code>: <code>target</code>, <code>rel</code>, dan <code>download</code></h2>
<h3>Membuka Tab Baru (<code>target=&quot;_blank&quot;</code>) dan Keamanan <code>rel=&quot;noopener noreferrer&quot;</code></h3>
<p>Secara bawaan, tautan terbuka di tab yang sama (<code>target=&quot;_self&quot;</code>). Anda sebaiknya <strong>tidak</strong> memaksa semua tautan terbuka di tab baru (<code>target=&quot;_blank&quot;</code>) karena hal itu mengambil alih kendali pengguna dan membingungkan tombol <em>Back</em> pada peramban ponsel. Gunakan <code>target=&quot;_blank&quot;</code> hanya bila pengguna sedang mengisi formulir panjang atau memutar media yang akan terputus jika mereka meninggalkan halaman saat ini.</p>
<p>Ketika menggunakan <code>target=&quot;_blank&quot;</code> menuju situs eksternal, biasakan menyertakan atribut <code>rel</code>:</p>
<pre>&lt;a
  href=&quot;https://html.spec.whatwg.org/multipage/&quot;
  target=&quot;_blank&quot;
  rel=&quot;noopener noreferrer&quot;
&gt;
  Spesifikasi HTML WHATWG (buka di tab baru)
&lt;/a&gt;</pre>
<ul><li><strong><code>noopener</code>:</strong> Mencegah halaman baru yang dibuka mengakses objek <code>window.opener</code> milik halaman Anda melalui JavaScript (mencegah serangan <em>reverse tabnabbing</em>). <em>Catatan: Peramban modern kini menerapkan perilaku implisit <code>noopener</code> pada setiap <code>target=&quot;_blank&quot;</code>, tetapi menuliskannya secara eksplisit tetap merupakan kebiasaan pengamanan yang baik.</em></li><li><strong><code>noreferrer</code>:</strong> Selain mencakup efek <code>noopener</code>, nilai ini mencegah peramban mengirimkan header HTTP <code>Referer</code> ke situs tujuan sehingga situs luar tidak mengetahui URL internal halaman tempat pengguna berasal.</li><li><strong><code>nofollow</code>, <code>ugc</code>, <code>sponsored</code>:</strong> Digunakan pada tautan di kolom komentar pengguna (<code>rel=&quot;ugc nofollow&quot;</code>) atau tautan iklan berbayar (<code>rel=&quot;sponsored&quot;</code>) agar mesin pencari tidak menganggapnya sebagai rekomendasi organik dari situs Anda.</li></ul>
<h3>Mengunduh Berkas (<code>download</code>) dan Skema Khusus (<code>mailto:</code>, <code>tel:</code>)</h3>
<ul><li><strong>Atribut <code>download</code>:</strong> Menginstruksikan peramban untuk mengunduh sumber daya alih-alih menampilkannya di tab peramban. Hanya berfungsi untuk berkas yang berasal dari <em>origin</em> (domain) yang sama atau skema <code>blob:</code> / <code>data:</code>.</li><li><strong>Skema <code>mailto:</code> dan <code>tel:</code>:</strong> Membuka aplikasi surat elektronik atau panggilan telepon di perangkat pengguna.</li></ul>
<pre>&lt;!-- Mengunduh berkas dengan nama berkas yang rapi --&gt;
&lt;a href=&quot;/assets/ringkasan-html.pdf&quot; download=&quot;Ringkasan-HTML-Kodeloka.pdf&quot;&gt;
  Unduh Ringkasan Materi (PDF, 420 KB)
&lt;/a&gt;

&lt;!-- Menghubungi lewat surel dan telepon --&gt;
&lt;a href=&quot;mailto:halo@asadinedu.com?subject=Pertanyaan%20Materi%20HTML&quot;&gt;
  Kirim Surel ke Tim Pengajar
&lt;/a&gt;
&lt;a href=&quot;tel:+6281234567890&quot;&gt;+62 812-3456-7890&lt;/a&gt;</pre>
<h2>4. Kapan Menggunakan <code>&lt;button&gt;</code> vs <code>&lt;a&gt;</code>?</h2>
<p>Ini adalah salah satu aturan paling fundamental dalam pengembangan front-end:</p>
<ul><li><strong>Gunakan <code>&lt;a href=&quot;...&quot;&gt;</code> jika aksinya adalah berpindah alamat (navigasi):</strong> Menuju halaman lain, melompat ke bagian <code>#id</code> di halaman yang sama, atau mengunduh berkas. Pengguna dapat mengeklik kanan tautan untuk memilih <em>&quot;Open Link in New Tab&quot;</em>.</li><li><strong>Gunakan <code>&lt;button type=&quot;button&quot;&gt;</code> (atau <code>type=&quot;submit&quot;</code>) jika aksinya adalah melakukan tindakan di dalam halaman saat ini:</strong> Membuka kotak dialog <code>&lt;dialog&gt;</code>, mengganti tema gelap/terang, menghapus baris data, atau mengirim formulir.</li></ul>
<pre>&lt;!-- SALAH: Tautan palsu tanpa tujuan navigasi --&gt;
&lt;a href=&quot;#&quot; onclick=&quot;bukaModal()&quot;&gt;Buka Pengaturan&lt;/a&gt;
&lt;div class=&quot;tombol&quot; onclick=&quot;simpanData()&quot;&gt;Simpan&lt;/div&gt;

&lt;!-- BENAR: Gunakan elemen yang sesuai dengan fungsinya --&gt;
&lt;button type=&quot;button&quot; id=&quot;tombol-pengaturan&quot;&gt;Buka Pengaturan&lt;/button&gt;
&lt;a href=&quot;/pengaturan/profil&quot;&gt;Halaman Pengaturan Profil&lt;/a&gt;</pre>
<div class="callout bahaya"><div class="callout-judul">🚫 Bahaya Aksesibilitas: <code>&lt;a href=&quot;#&quot;&gt;</code> dan <code>&lt;div onclick=&quot;...&quot;&gt;</code></div><p>Tautan <code>&lt;a href=&quot;#&quot;&gt;</code> akan membuat layar melompat kembali ke bagian paling atas halaman jika <code>event.preventDefault()</code> gagal dijalankan. Lebih buruk lagi, <code>&lt;div onclick=&quot;...&quot;&gt;</code> tidak dapat difokuskan dengan tombol <code>Tab</code> di papan ketik dan tidak dapat ditekan menggunakan tombol <code>Enter</code> atau <code>Space</code>!</p></div>
<h2>Latihan Praktik: Membangun Navigasi Multi-Halaman dan Daftar Isi</h2>
<p>Buatlah berkas <code>navigasi-latihan.html</code> yang memiliki:</p>
<ol><li>Tautan <em>Skip to main content</em> (<code>&lt;a href=&quot;#utama&quot;&gt;Lompat ke konten utama&lt;/a&gt;</code>) sebagai elemen pertama di dalam <code>&lt;body&gt;</code>.</li><li>Elemen <code>&lt;nav&gt;</code> berisi tautan root-relative menuju <code>/html/</code>, <code>/css/</code>, <code>/javascript/</code>, dan <code>/php/</code>, di mana tautan <code>/html/</code> ditandai dengan <code>aria-current=&quot;page&quot;</code>.</li><li>Tiga bagian (<code>&lt;section&gt;</code>) yang masing-masing memiliki <code>id</code> unik dan dapat dilompati dari daftar isi di bagian atas artikel.</li><li>Satu tautan referensi eksternal menuju dokumentasi MDN yang aman dan menjelaskan bahwa tautan terbuka di tab baru.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/a" rel="noopener"><code>&lt;a&gt;</code>: The Anchor element — MDN Web Docs</a></li><li><a href="https://html.spec.whatwg.org/multipage/text-level-semantics.html" rel="noopener">Text-level semantics (<code>a</code> element) — WHATWG HTML Living Standard</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML" rel="noopener">HTML: A good basis for accessibility — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["target=\"_blank\"","<a>","href","download","noopener","id"],
    kuis: [
        {"tanya":"Anda sedang menulis kode di dalam berkas /kelas/html/materi/05-tautan.html dan ingin menautkan ke berkas /assets/panduan.pdf. Nilai href manakah yang merupakan jalur root-relative yang benar?","opsi":["href=\"assets/panduan.pdf\"","href=\"../assets/panduan.pdf\"","href=\"/assets/panduan.pdf\"","href=\"file:///assets/panduan.pdf\""],"benar":2,"penjelasan":"Jalur root-relative selalu diawali dengan satu garis miring (/) yang memerintahkan peramban untuk memulai pencarian dari direktori paling atas (akar domain situs), terlepas dari lokasi folder berkas HTML yang sedang dibuka."},
        {"tanya":"Kapan Anda harus memilih elemen <button> alih-alih elemen <a>?","opsi":["Ketika pengguna ingin berpindah ke halaman katalog kelas yang berada di alamat URL berbeda.","Ketika interaksi pengguna bertujuan menjalankan aksi di dalam halaman yang sama (seperti membuka menu popup, menghapus item, atau mengirim formulir) tanpa berpindah URL.","Ketika Anda ingin membuat tombol yang tampilannya memiliki warna latar belakang dan sudut membulat di CSS.","Ketika Anda ingin mengarahkan pengguna ke bagian #kesimpulan di bawah halaman."],"benar":1,"penjelasan":"Pilihan antara <a> dan <button> ditentukan oleh fungsi semantiknya, bukan tampilan visualnya (karena keduanya dapat diberi gaya CSS yang identik). <a> digunakan untuk navigasi URL/fragmen, sedangkan <button> digunakan untuk memicu aksi di dalam halaman atau mengirim formulir."},
        {"tanya":"Apa fungsi atribut rel=\"noopener noreferrer\" pada elemen <a href=\"https://contoh.com\" target=\"_blank\">?","opsi":["Memaksa tautan diunduh sebagai berkas PDF alih-alih dibuka di tab baru.","Mencegah tab baru mengakses objek window.opener halaman asal sekaligus menyembunyikan informasi URL halaman asal (header HTTP Referer) dari situs tujuan.","Memberitahu peramban agar memuat halaman tujuan terlebih dahulu di latar belakang sebelum diklik.","Mematikan JavaScript sepenuhnya di situs tujuan yang dibuka."],"benar":1,"penjelasan":"noopener memutus akses window.opener antara tab baru dan tab asal demi mencegah manipulasi halaman asal (tabnabbing), sedangkan noreferrer mencegah pengiriman header HTTP Referer ke server tujuan demi menjaga privasi URL asal pengunjung."}
    ]
},
{
    id: 9,
    kategori: "2 · Media & Tabel",
    judul: "Gambar, Media Responsif, Audio, dan Video",
    tingkat: "Dasar", durasi: "11 mnt",
    tag: ["alt","<img>","<picture>"],
    ringkas: "Menyajikan gambar, grafik vektor (SVG), audio, dan video secara cepat, responsif di berbagai ukuran layar menggunakan srcset, sizes, dan <picture>, serta ramah aksesibilitas dan mencegah pergeseran tata letak (CLS).",
    isi: `
<h2>Mengapa Penanganan Media Sangat Menentukan Kualitas Web?</h2>
<p>Gambar dan video hampir selalu menyumbang porsi byte terbesar dari total ukuran sebuah halaman web. Jika Anda menyajikan satu gambar berukuran <code>4000×3000</code> piksel (<code>2,5 MB</code>) mentah-mentah ke pengguna ponsel dengan lebar layar <code>390px</code>, pengguna tersebut membuang kuota data dan waktu tunggu hanya untuk mengunduh jutaan piksel yang pada akhirnya diperkecil oleh layar ponsel.</p>
<p>Selain ukuran unduhan, dua kesalahan paling sering pada elemen media adalah:</p>
<ol><li>Tidak mencantumkan <code>width</code> dan <code>height</code>, sehingga teks halaman melompat turun saat gambar selesai dimuat (<strong>Cumulative Layout Shift / CLS</strong>).</li><li>Mengosongkan atau salah menulis atribut <code>alt</code>, sehingga pengguna pembaca layar kehilangan konteks informasi.</li></ol>
<h2>1. Memilih Format Gambar yang Tepat</h2>
<p>Sebelum menulis tag <code>&lt;img&gt;</code>, pastikan Anda memilih format berkas yang sesuai dengan jenis visualnya:</p>
<table><thead><tr><th>Format</th><th>Karakteristik Utama</th><th>Penggunaan Terbaik</th></tr></thead><tbody><tr><td><strong>SVG</strong> (<code>.svg</code>)</td><td>Berbasis vektor XML; tajam di ukuran berapa pun dan berukuran sangat kecil untuk bentuk geometris.</td><td>Logo, ikon antarmuka, diagram arsitektur, ilustrasi garis.</td></tr><tr><td><strong>AVIF</strong> (<code>.avif</code>)</td><td>Kompresi generasi terbaru (berbasis AV1); ukuran berkas 20–50% lebih kecil dari JPEG/WebP pada kualitas setara (Baseline <em>Newly available</em> sejak Januari 2024 dan <em>Widely available</em> sejak Juli 2026).</td><td>Foto utama (<em>hero image</em>), tangkapan layar produk, katalog fotografi.</td></tr><tr><td><strong>WebP</strong> (<code>.webp</code>)</td><td>Mendukung kompresi <em>lossy</em>, <em>lossless</em>, transparansi, dan animasi dengan dukungan peramban yang sangat luas.</td><td>Foto artikel, gambar ilustrasi dengan latar transparan, pengganti GIF animasi.</td></tr><tr><td><strong>PNG / JPEG</strong></td><td>Format klasik dengan kompatibilitas universal.</td><td>Cadangan (<em>fallback</em>) atau aset unduhan yang harus dibuka di perangkat lunak lama.</td></tr></tbody></table>
<h2>2. Elemen <code>&lt;img&gt;</code>: Atribut <code>alt</code>, <code>width</code>, dan <code>height</code></h2>
<pre>&lt;img
  src=&quot;/assets/diagram-http.webp&quot;
  alt=&quot;Diagram alur permintaan HTTP dari peramban melalui DNS menuju server web dan kembali sebagai respons HTML.&quot;
  width=&quot;800&quot;
  height=&quot;450&quot;
  loading=&quot;lazy&quot;
  decoding=&quot;async&quot;
&gt;</pre>
<h3>Aturan Menulis Teks Alternatif (<code>alt</code>)</h3>
<ol><li><strong>Gambar Informatif (Diagram, Foto Berita, Grafik):</strong> Jelaskan informasi inti yang ingin disampaikan gambar tersebut secara ringkas dan jelas pada <code>alt=&quot;...&quot;</code>. Anda tidak perlu mengawali dengan kata <em>&quot;Gambar dari...&quot;</em> atau <em>&quot;Foto...&quot;</em> karena pembaca layar sudah menyebutkan bahwa elemen tersebut adalah sebuah gambar.</li><li><strong>Gambar Murni Dekoratif (Garis Hiasan, Latar Abstrak):</strong> Tetap wajib menulis atribut <code>alt</code>, tetapi biarkan nilainya kosong (<code>alt=&quot;&quot;</code>). Jika Anda menghilangkan atribut <code>alt</code> sama sekali, pembaca layar justru akan membacakan nama berkas yang mengganggu seperti <code>&quot;garis-bawah-biru-final-v2.webp&quot;</code>!</li><li><strong>Gambar di Dalam Tautan atau Tombol:</strong> Jika <code>&lt;img&gt;</code> adalah satu-satunya isi di dalam <code>&lt;a href=&quot;/&quot;&gt;</code> atau <code>&lt;button&gt;</code>, maka nilai <code>alt</code> harus menjelaskan <strong>tujuan tautan atau fungsi tombolnya</strong> (misalnya <code>alt=&quot;Beranda Kodeloka&quot;</code> atau <code>alt=&quot;Cari materi&quot;</code>), bukan mendeskripsikan bentuk ikon kaca pembesar.</li></ol>
<h3>Mengapa <code>width</code> dan <code>height</code> Wajib Ditulis Meskipun Diatur oleh CSS?</h3>
<p>Ketika Anda menulis <code>width=&quot;800&quot; height=&quot;450&quot;</code> pada <code>&lt;img&gt;</code>, peramban modern langsung menghitung rasio aspek gambar (<code>16:9</code>) <strong>sebelum</strong> gambar selesai diunduh dari jaringan. Dikombinasikan dengan aturan CSS standar:</p>
<pre>img {
  max-width: 100%;
  height: auto;
}</pre>
<p>Peramban akan langsung menyiapkan ruang kosong dengan tinggi yang presisi sesuai lebar kontainer, sehingga halaman bebas dari masalah <em>layout shift</em> (CLS).</p>
<h2>3. Gambar Responsif dengan <code>srcset</code>, <code>sizes</code>, dan <code>&lt;picture&gt;</code></h2>
<h3>Kasus A: Resolusi Berbeda untuk Gambar yang Sama (<code>srcset</code> &amp; <code>sizes</code>)</h3>
<p>Gunakan atribut <code>srcset</code> dan <code>sizes</code> pada <code>&lt;img&gt;</code> ketika isi gambarnya sama persis, namun Anda ingin peramban mengunduh ukuran lebar piksel (<code>w</code>) yang paling pas dengan layar pengguna:</p>
<pre>&lt;img
  src=&quot;/assets/dasbor-800w.webp&quot;
  srcset=&quot;
    /assets/dasbor-400w.webp 400w,
    /assets/dasbor-800w.webp 800w,
    /assets/dasbor-1200w.webp 1200w,
    /assets/dasbor-1600w.webp 1600w
  &quot;
  sizes=&quot;(max-width: 768px) 100vw, 800px&quot;
  width=&quot;800&quot;
  height=&quot;500&quot;
  alt=&quot;Tampilan dasbor pemantauan metrik server di Grafana&quot;
&gt;</pre>
<p>Cara membaca kode di atas:</p>
<ul><li><strong><code>srcset</code></strong> memberi tahu peramban daftar berkas yang tersedia beserta lebar aslinya (<code>400w</code> berarti lebar asli gambar adalah 400 piksel).</li><li><strong><code>sizes</code></strong> memberi tahu peramban: <em>&quot;Jika lebar layar maksimal <code>768px</code>, gambar ini akan tampil selebar <code>100vw</code> (penuh satu layar). Di layar yang lebih besar dari itu, gambar ini hanya ditampilkan selebar <code>800px</code>.&quot;</em></li><li>Peramban kemudian mengalikan ukuran dari <code>sizes</code> dengan kepadatan piksel layar perangkat (<em>Device Pixel Ratio</em>, misalnya <code>2x</code> pada layar Retina/AMOLED) lalu memilih berkas paling efisien dari daftar <code>srcset</code>.</li></ul>
<h3>Kasus B: Arah Visual Berbeda (<em>Art Direction</em>) atau Seleksi Format dengan <code>&lt;picture&gt;</code></h3>
<p>Gunakan elemen <code>&lt;picture&gt;</code> ketika Anda ingin:</p>
<ol><li>Menyajikan format modern (<code>image/avif</code>, <code>image/webp</code>) dengan cadangan otomatis ke format <code>.jpg</code> atau <code>.png</code>.</li><li>Mengganti potongan gambar (<em>cropping</em>) antara layar ponsel yang sempit dan layar desktop yang lebar (<em>art direction</em>).</li></ol>
<pre>&lt;figure&gt;
  &lt;picture&gt;
    &lt;!-- 1. Prioritaskan format AVIF jika didukung peramban --&gt;
    &lt;source
      type=&quot;image/avif&quot;
      srcset=&quot;/assets/arsitektur-k8s-800.avif 800w, /assets/arsitektur-k8s-1400.avif 1400w&quot;
      sizes=&quot;(max-width: 900px) 100vw, 850px&quot;
    &gt;
    &lt;!-- 2. Cadangan format WebP --&gt;
    &lt;source
      type=&quot;image/webp&quot;
      srcset=&quot;/assets/arsitektur-k8s-800.webp 800w, /assets/arsitektur-k8s-1400.webp 1400w&quot;
      sizes=&quot;(max-width: 900px) 100vw, 850px&quot;
    &gt;
    &lt;!-- 3. Elemen &lt;img&gt; wajib selalu ada di urutan terakhir sebagai perender sesungguhnya --&gt;
    &lt;img
      src=&quot;/assets/arsitektur-k8s-800.png&quot;
      width=&quot;850&quot;
      height=&quot;480&quot;
      alt=&quot;Arsitektur klaster Kubernetes: Control Plane berkomunikasi dengan tiga Worker Node melalui kubelet.&quot;
    &gt;
  &lt;/picture&gt;
  &lt;figcaption&gt;
    Gambar 1.1: Komponen Control Plane dan Worker Node pada klaster Kubernetes.
  &lt;/figcaption&gt;
&lt;/figure&gt;</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Kesalahan Umum: Menganggap <code>&lt;picture&gt;</code> yang Menampilkan Gambar</div><p>Elemen <code>&lt;picture&gt;</code> dan <code>&lt;source&gt;</code> hanyalah pembungkus logika pemilihan sumber gambar. Yang benar-benar dirender di layar tetaplah elemen <code>&lt;img&gt;</code> di dalamnya. Oleh karena itu, atribut <code>alt</code>, <code>width</code>, <code>height</code>, <code>loading</code>, dan kelas CSS untuk gaya gambar tetap harus ditempelkan pada elemen <code>&lt;img&gt;</code>, bukan pada <code>&lt;picture&gt;</code>.</p></div>
<h2>4. Menyematkan Audio (<code>&lt;audio&gt;</code>) dan Video (<code>&lt;video&gt;</code>) beserta Takarir (<code>&lt;track&gt;</code>)</h2>
<p>HTML menyediakan pemutar media bawaan tanpa memerlukan plugin tambahan. Agar media video ramah aksesibilitas (bagi pengguna tuli/kurang dengar maupun pengguna yang menonton di tempat umum tanpa suara), selalu sertakan takarir (<em>captions/subtitles</em>) berformat <strong>WebVTT (<code>.vtt</code>)</strong> menggunakan elemen <code>&lt;track&gt;</code>:</p>
<pre>&lt;video
  controls
  preload=&quot;metadata&quot;
  poster=&quot;/assets/poster-instalasi-linux.webp&quot;
  width=&quot;1280&quot;
  height=&quot;720&quot;
&gt;
  &lt;source src=&quot;/media/instalasi-linux.webm&quot; type=&quot;video/webm&quot;&gt;
  &lt;source src=&quot;/media/instalasi-linux.mp4&quot; type=&quot;video/mp4&quot;&gt;
  &lt;track
    kind=&quot;captions&quot;
    src=&quot;/media/instalasi-linux.id.vtt&quot;
    srclang=&quot;id&quot;
    label=&quot;Bahasa Indonesia&quot;
    default
  &gt;
  &lt;p&gt;
    Peramban Anda tidak mendukung pemutaran video HTML5. Anda dapat
    &lt;a href=&quot;/media/instalasi-linux.mp4&quot; download&gt;mengunduh video ini (MP4)&lt;/a&gt;.
  &lt;/p&gt;
&lt;/video&gt;</pre>
<ul><li><strong><code>preload=&quot;metadata&quot;</code>:</strong> Menghemat kuota pengunjung dengan hanya mengunduh informasi durasi dan dimensi video saat halaman dibuka, bukan mengunduh seluruh isi video sebelum tombol <em>Play</em> ditekan.</li><li><strong>Aturan Autoplay di Peramban Modern:</strong> Peramban akan memblokir video yang memiliki atribut <code>autoplay</code> kecuali video tersebut juga memiliki atribut <strong><code>muted</code></strong> (tanpa suara) atau pengguna sudah berinteraksi langsung dengan halaman. Untuk video latar pendek pengganti GIF, gunakan kombinasi <code>&lt;video autoplay loop muted playsinline&gt;</code>.</li></ul>
<h2>Latihan Praktik: Menyusun Galeri Diagram Teknis</h2>
<p>Buatlah sebuah berkas <code>media-responsif.html</code> yang menampilkan:</p>
<ol><li>Sebuah gambar ilustrasi di dalam <code>&lt;figure&gt;</code> dan <code>&lt;figcaption&gt;</code>, lengkap dengan <code>&lt;picture&gt;</code> yang menyediakan sumber <code>image/avif</code>, <code>image/webp</code>, dan fallback <code>&lt;img&gt;</code> dengan <code>width</code>, <code>height</code>, dan <code>alt</code> yang deskriptif.</li><li>Satu ikon hiasan dekoratif yang berdampingan dengan teks subjudul (pastikan atribut <code>alt</code> diatur agar diabaikan oleh pembaca layar).</li><li>Satu pemutar <code>&lt;video&gt;</code> dengan <code>preload=&quot;metadata&quot;</code>, gambar <code>poster</code>, dua opsi <code>&lt;source&gt;</code> (<code>webm</code> dan <code>mp4</code>), serta elemen <code>&lt;track&gt;</code> untuk takarir Bahasa Indonesia.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images" rel="noopener">Using responsive images in HTML — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video" rel="noopener"><code>&lt;video&gt;</code>: The Video Embed element — MDN Web Docs</a></li><li><a href="https://web.dev/articles/cls" rel="noopener">Cumulative Layout Shift (CLS) — web.dev</a></li></ul></div>
`,
    perintah: ["alt","<img>","<picture>","width","height","srcset"],
    kuis: [
        {"tanya":"Mengapa Anda tetap disarankan menulis atribut width dan height pada elemen <img> meskipun lebar gambar sudah diatur secara fleksibel menggunakan max-width: 100%; height: auto; di CSS?","opsi":["Karena tanpa atribut width dan height, gambar berformat WebP dan AVIF tidak dapat ditampilkan oleh peramban.","Agar peramban dapat langsung menghitung rasio aspek gambar dan memesan ruang tinggi yang tepat sebelum berkas gambar selesai diunduh, sehingga mencegah pergeseran tata letak (Cumulative Layout Shift).","Agar ukuran berkas gambar otomatis dikompresi menjadi setengahnya oleh server.","Karena properti CSS max-width hanya berfungsi jika elemen memiliki atribut width di HTML."],"benar":1,"penjelasan":"Peramban modern menggunakan nilai width dan height pada HTML untuk menetapkan rasio aspek internal (aspect-ratio) dari elemen <img>. Dengan begitu, saat max-width: 100%; height: auto; diterapkan, peramban tahu persis berapa piksel tinggi kotak yang harus disiapkan bahkan sebelum byte gambar selesai diunduh."},
        {"tanya":"Bagaimana cara yang benar untuk menulis atribut alt pada sebuah elemen <img> yang murni berfungsi sebagai hiasan visual (tidak membawa informasi tambahan apa pun)?","opsi":["Menghapus atribut alt dari tag <img>.","Menulis alt=\"gambar dekoratif tidak penting\".","Menulis atribut alt dengan nilai string kosong: alt=\"\".","Menulis nama berkas gambar di dalam alt."],"benar":2,"penjelasan":"Menulis alt=\"\" (string kosong) secara eksplisit memberi tahu teknologi bantu seperti pembaca layar bahwa gambar tersebut bersifat dekoratif sehingga dapat dilewati dengan tenang. Sebaliknya, menghapus atribut alt sama sekali membuat pembaca layar menganggap pengembang lupa memberi deskripsi lalu membacakan nama berkas gambarnya."},
        {"tanya":"Apa fungsi atribut preload=\"metadata\" pada elemen <video>?","opsi":["Mengunduh seluruh isi video secara penuh di latar belakang begitu halaman dibuka.","Meminta peramban untuk hanya mengunduh informasi dasar video (seperti durasi, dimensi, dan bingkai awal) sampai pengguna menekan tombol putar.","Memutar video secara otomatis tanpa suara ketika video masuk ke area pandang layar.","Mengambil daftar takarir (.vtt) dari server pihak ketiga."],"benar":1,"penjelasan":"Nilai preload=\"metadata\" menjaga keseimbangan terbaik antara pengalaman pengguna dan penghematan kuota jaringan: pengguna dapat langsung melihat durasi video di antarmuka pemutar, sementara berkas video berukuran besar baru diunduh saat pengguna benar-benar ingin menontonnya."}
    ]
},
{
    id: 10,
    kategori: "2 · Media & Tabel",
    judul: "Grafik Vektor (svg) Inline dan Pengantar canvas",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["<svg>","<canvas>","<path>"],
    ringkas: "Menyematkan grafik vektor tajam dengan <svg> inline, menguasai koordinat viewBox, mewarisi warna teks melalui currentColor, memastikan aksesibilitas ikon SVG, serta memahami kapan memilih <svg> versus <canvas>.",
    isi: `
<h2>Mengapa Pengembang Front-End Wajib Memahami <code>&lt;svg&gt;</code> di Dalam HTML?</h2>
<p>Pada pelajaran media sebelumnya, kita mengenal <code>.svg</code> sebagai format berkas gambar. Namun, berbeda dengan <code>.webp</code> atau <code>.png</code> yang terdiri dari kotak-kotak piksel (<em>raster</em>), **SVG (<em>Scalable Vector Graphics</em>) adalah bahasa markup berbasis XML yang merupakan warga kelas satu di dalam spesifikasi HTML5**.</p>
<p>Artinya, Anda dapat menuliskan tag <code>&lt;svg&gt;</code>, <code>&lt;path&gt;</code>, <code>&lt;circle&gt;</code>, dan <code>&lt;rect&gt;</code> <strong>secara langsung (inline) di dalam dokumen HTML</strong> dan mengendalikannya menggunakan CSS maupun JavaScript!</p>
<h2>1. Menyematkan <code>&lt;svg&gt;</code> Inline vs <code>&lt;img src=&quot;ikon.svg&quot;&gt;</code></h2>
<table><thead><tr><th>Cara Penyematan</th><th>Keunggulan Utama</th><th>Keterbatasan</th></tr></thead><tbody><tr><td><strong><code>&lt;img src=&quot;logo.svg&quot; alt=&quot;...&quot;&gt;</code></strong></td><td>Dapat disimpan terpisah di <em>cache</em> peramban; paling sederhana untuk ilustrasi statis.</td><td>Anda <strong>tidak</strong> bisa mengubah warna garis/isian di dalamnya lewat CSS <code>:hover</code> halaman.</td></tr><tr><td><strong><code>&lt;svg&gt;...&lt;/svg&gt;</code> Inline di HTML</strong></td><td><strong>0 permintaan jaringan tambahan</strong>; warna garis/isian dapat mengikuti warna teks tombol secara otomatis lewat <code>currentColor</code> dan berubah saat <code>:hover</code>!</td><td>Menambah jumlah baris DOM jika disalin berulang-ulang (solusinya: gunakan <code>&lt;symbol&gt;</code> dan <code>&lt;use&gt;</code>).</td></tr></tbody></table>
<h3>Rahasia <code>viewBox</code> dan <code>currentColor</code> pada Ikon Antarmuka</h3>
<p>Perhatikan anatomi ikon <code>&lt;svg&gt;</code> inline yang bersih dan responsif berikut:</p>
<pre>&lt;button type=&quot;button&quot; class=&quot;tombol-unduh&quot;&gt;
  &lt;svg
    aria-hidden=&quot;true&quot;
     focusable=&quot;false&quot;
    width=&quot;20&quot;
    height=&quot;20&quot;
    viewBox=&quot;0 0 24 24&quot;
    fill=&quot;none&quot;
    stroke=&quot;currentColor&quot;
    stroke-width=&quot;2&quot;
    stroke-linecap=&quot;round&quot;
    stroke-linejoin=&quot;round&quot;
  &gt;
    &lt;path d=&quot;M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4&quot; /&gt;
    &lt;polyline points=&quot;7 10 12 15 17 10&quot; /&gt;
    &lt;line x1=&quot;12&quot; y1=&quot;15&quot; x2=&quot;12&quot; y2=&quot;3&quot; /&gt;
  &lt;/svg&gt;
  &lt;span&gt;Unduh Modul (PDF)&lt;/span&gt;
&lt;/button&gt;</pre>
<p>Mari kita bedah tiga atribut terpenting di atas:</p>
<ol><li><strong><code>viewBox=&quot;0 0 24 24&quot;</code> (<code>min-x min-y width height</code>):</strong> Mendefinisikan sistem koordinat internal kanvas gambar (<code>24×24</code> unit). Berkat <code>viewBox</code>, meskipun Anda mengubah atribut ukuran luarnya menjadi <code>width=&quot;16&quot; height=&quot;16&quot;</code> atau <code>width=&quot;64&quot; height=&quot;64&quot;</code>, seluruh garis di dalamnya otomatis diskalakan dengan tajam tanpa terpotong!</li><li><strong><code>stroke=&quot;currentColor&quot;</code> (atau <code>fill=&quot;currentColor&quot;</code>):</strong> Kata kunci ajaib <code>currentColor</code> memerintahkan SVG untuk <strong>mewarisi warna properti CSS <code>color</code> dari elemen induknya</strong>! Jika <code>.tombol-unduh</code> memiliki <code>color: #ffffff</code> dan saat <code>:hover</code> berubah menjadi <code>color: #38bdf8</code>, ikon SVG ikut berubah warna secara otomatis tanpa aturan CSS tambahan.</li><li><strong><code>width</code> dan <code>height</code> eksplisit pada <code>&lt;svg&gt;</code>:</strong> Selalu cantumkan atribut <code>width=&quot;20&quot; height=&quot;20&quot;</code> langsung pada tag <code>&lt;svg&gt;</code>! Mengapa? Jika suatu saat berkas CSS gagal dimuat, <code>&lt;svg&gt;</code> yang tidak memiliki <code>width</code> dan <code>height</code> di HTML akan membengkak memenuhi seluruh lebar kontainernya!</li></ol>
<h2>2. Menggunakan Ulang Ikon dengan <code>&lt;symbol&gt;</code> dan <code>&lt;use&gt;</code> (SVG Sprite)</h2>
<p>Jika satu ikon yang sama (misalnya ikon centang <code>✓</code> atau tanda bintang) muncul 30 kali di satu halaman tabel, menyalin-tempel <code>&lt;path&gt;</code> panjang sebanyak 30 kali akan memperbesar ukuran dokumen HTML.</p>
<p>Solusinya adalah mendefinisikan ikon tersebut cukup <strong>satu kali</strong> di dalam <code>&lt;svg width=&quot;0&quot; height=&quot;0&quot; style=&quot;position:absolute&quot;&gt;&lt;symbol id=&quot;...&quot;&gt;</code> (atribut <code>hidden</code> tidak berfungsi pada <code>&lt;svg&gt;</code> karena <code>&lt;svg&gt;</code> bukan elemen HTML, sehingga kotak bawaannya <code>300×150</code> piksel tetap memakan ruang), lalu memanggilnya berkali-kali dengan <code>&lt;use href=&quot;#...&quot;&gt;</code>:</p>
<pre>&lt;!-- 1. Definisikan kumpulan ikon satu kali saja di awal/akhir body --&gt;
&lt;svg width=&quot;0&quot; height=&quot;0&quot; style=&quot;position:absolute&quot; aria-hidden=&quot;true&quot;&gt;
  &lt;symbol id=&quot;ikon-centang&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2.5&quot;&gt;
    &lt;polyline points=&quot;20 6 9 17 4 12&quot; /&gt;
  &lt;/symbol&gt;
&lt;/svg&gt;

&lt;!-- 2. Gunakan kembali di mana saja cukup dengan 1 baris &lt;use&gt;! --&gt;
&lt;ul class=&quot;daftar-fitur&quot;&gt;
  &lt;li&gt;
    &lt;svg aria-hidden=&quot;true&quot; width=&quot;18&quot; height=&quot;18&quot;&gt;&lt;use href=&quot;#ikon-centang&quot; /&gt;&lt;/svg&gt;
    Gratis selamanya tanpa akun
  &lt;/li&gt;
  &lt;li&gt;
    &lt;svg aria-hidden=&quot;true&quot; width=&quot;18&quot; height=&quot;18&quot;&gt;&lt;use href=&quot;#ikon-centang&quot; /&gt;&lt;/svg&gt;
    Dilengkapi latihan dan kuis interaktif
  &lt;/li&gt;
&lt;/ul&gt;</pre>
<h2>3. Aksesibilitas pada <code>&lt;svg&gt;</code></h2>
<ol><li><strong>Jika SVG hanya mendampingi teks yang sudah jelas (Dekoratif):</strong> Tambahkan <strong><code>aria-hidden=&quot;true&quot;</code></strong> pada <code>&lt;svg&gt;</code> agar pembaca layar tidak berhenti di elemen grafis tersebut.</li><li><strong>Jika <code>&lt;svg&gt;</code> berdiri sendiri sebagai gambar informatif (misalnya diagram arsitektur tanpa <code>&lt;img&gt;</code>):</strong> Tambahkan <strong><code>role=&quot;img&quot;</code></strong> dan <strong><code>aria-labelledby=&quot;id-judul-svg&quot;</code></strong>, lalu letakkan elemen <code>&lt;title id=&quot;id-judul-svg&quot;&gt;</code> sebagai anak pertama di dalam <code>&lt;svg&gt;</code>:</li></ol>
<pre>&lt;svg role=&quot;img&quot; aria-labelledby=&quot;judul-grafik-cpu&quot; width=&quot;400&quot; height=&quot;120&quot; viewBox=&quot;0 0 400 120&quot;&gt;
  &lt;title id=&quot;judul-grafik-cpu&quot;&gt;Grafik penggunaan CPU server rata-rata 35% selama 24 jam terakhir&lt;/title&gt;
  &lt;rect x=&quot;0&quot; y=&quot;0&quot; width=&quot;400&quot; height=&quot;120&quot; rx=&quot;8&quot; fill=&quot;#0f172a&quot; /&gt;
  &lt;polyline fill=&quot;none&quot; stroke=&quot;#38bdf8&quot; stroke-width=&quot;3&quot; points=&quot;10,90 100,70 200,80 300,30 390,50&quot; /&gt;
&lt;/svg&gt;</pre>
<h2>4. Pengantar <code>&lt;canvas&gt;</code> dan Kapan Memilih <code>&lt;svg&gt;</code> vs <code>&lt;canvas&gt;</code></h2>
<p>Selain <code>&lt;svg&gt;</code>, HTML menyediakan elemen <strong><code>&lt;canvas&gt;</code></strong> sebagai bidang gambar berbasis bitmap (piksel) yang digambar menggunakan JavaScript (<strong>Canvas 2D API</strong> atau <strong>WebGL / WebGPU</strong>):</p>
<pre>&lt;canvas id=&quot;kanvas-simulasi&quot; width=&quot;600&quot; height=&quot;300&quot;&gt;
  &lt;!-- Teks fallback di dalam &lt;canvas&gt; wajib disediakan untuk aksesibilitas! --&gt;
  Simulasi pergerakan paket jaringan antara klien dan server.
&lt;/canvas&gt;

&lt;script&gt;
  const kanvas = document.getElementById(&quot;kanvas-simulasi&quot;);
  const ctx = kanvas.getContext(&quot;2d&quot;);

  // Menggambar persegi panjang biru dan teks di atas kanvas piksel
  ctx.fillStyle = &quot;#2563eb&quot;;
  ctx.fillRect(20, 20, 160, 80);

  ctx.fillStyle = &quot;#ffffff&quot;;
  ctx.font = &quot;bold 16px sans-serif&quot;;
  ctx.fillText(&quot;Node Server 01&quot;, 40, 65);
&lt;/script&gt;</pre>
<h3>Tabel Keputusan: <code>&lt;svg&gt;</code> vs <code>&lt;canvas&gt;</code></h3>
<table><thead><tr><th>Kriteria</th><th>Gunakan <code>&lt;svg&gt;</code></th><th>Gunakan <code>&lt;canvas&gt;</code></th></tr></thead><tbody><tr><td><strong>Bentuk Penyimpanan</strong></td><td>Setiap garis/bentuk adalah elemen DOM (<code>&lt;rect&gt;</code>, <code>&lt;path&gt;</code>) yang bisa diklik dan diberi CSS.</td><td>Hanya satu elemen <code>&lt;canvas&gt;</code>; begitu digambar, pikselnya &quot;kering&quot; (tidak ada objek DOM per bentuk).</td></tr><tr><td><strong>Ketajaman Saat Diperbesar</strong></td><td>Selalu tajam 100% di semua resolusi layar.</td><td>Berbasis piksel; bisa pecah jika diperbesar tanpa menyesuaikan <code>devicePixelRatio</code>.</td></tr><tr><td><strong>Jumlah Objek</strong></td><td>Terbaik untuk <strong>ratusan</strong> elemen (ikon, logo, peta interaktif, diagram arsitektur).</td><td>Terbaik untuk <strong>ribuan hingga ratusan ribu</strong> objek bergerak cepat (gim 2D/3D, partikel, pengolahan citra/video real-time).</td></tr><tr><td><strong>Aksesibilitas</strong></td><td>Sangat mudah diakses karena teks dan <code>&lt;title&gt;</code> ada di DOM.</td><td>Pembaca layar tidak bisa membaca piksel gambar; wajib menyediakan konten fallback atau atribut ARIA.</td></tr></tbody></table>
<h2>Latihan Praktik: Membuat Sistem Ikon SVG Sprite dan Grafik Bar Sederhana</h2>
<p>Buatlah berkas <code>svg-dan-canvas.html</code>:</p>
<ol><li>Buat definisi <code>&lt;svg width=&quot;0&quot; height=&quot;0&quot; style=&quot;position:absolute&quot;&gt;</code> berisi dua <code>&lt;symbol&gt;</code> (<code>#ikon-server</code> dan <code>#ikon-database</code>) dengan <code>viewBox=&quot;0 0 24 24&quot;</code> dan <code>stroke=&quot;currentColor&quot;</code>.</li><li>Tampilkan kedua ikon tersebut di dalam tombol menggunakan <code>&lt;use href=&quot;#...&quot;&gt;</code>.</li><li>Buat satu diagram batang sederhana menggunakan <code>&lt;svg role=&quot;img&quot; aria-labelledby=&quot;...&quot;&gt;</code> yang menampilkan <code>&lt;rect&gt;</code> dan <code>&lt;text&gt;</code> untuk perbandingan waktu muat 3 server.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements" rel="noopener">HTML elements reference (<code>&lt;svg&gt;</code>, <code>&lt;canvas&gt;</code>) — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" rel="noopener">Canvas API — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage" rel="noopener">Basic usage of canvas — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["<svg>","<canvas>","<path>","<rect>",":hover","currentColor"],
    kuis: [
        {"tanya":"Apa fungsi dari nilai stroke=\"currentColor\" atau fill=\"currentColor\" pada elemen <svg> inline yang diletakkan di dalam sebuah <button>?","opsi":["Mengubah warna ikon secara acak setiap kali halaman dimuat ulang.","Memerintahkan garis atau isian SVG untuk otomatis menggunakan nilai warna teks (color) yang sedang aktif pada elemen induk <button>, termasuk saat warna teks tombol berubah ketika :hover atau :focus-visible.","Memaksa ikon selalu berwarna hitam pekat.","Menyembunyikan ikon pada mode gelap (dark mode)."],"benar":1,"penjelasan":"Kata kunci CSS currentColor merepresentasikan nilai komputasi dari properti color pada elemen tersebut. Dengan memasang stroke=\"currentColor\" pada SVG di dalam tombol, warna ikon selalu selaras dengan warna teks tombol di segala keadaan."},
        {"tanya":"Mengapa sebuah elemen <svg> inline sebaiknya selalu memiliki atribut width dan height eksplisit (misalnya width=\"24\" height=\"24\") selain viewBox=\"0 0 24 24\"?","opsi":["Karena atribut viewBox tidak berfungsi jika tidak ada atribut width.","Sebagai pengaman tampilan (defensive rendering) agar apabila berkas CSS eksternal gagal dimuat atau terlambat tiba, ikon SVG tidak membengkak memenuhi lebar layar penuh (100% lebar kontainer).","Agar berkas HTML dapat disimpan sebagai gambar PNG.","Untuk mematikan animasi di dalam SVG."],"benar":1,"penjelasan":"Tanpa atribut width dan height pada tag <svg>, ukuran bawaan SVG dengan viewBox akan merentang selebar 100% dari wadahnya jika CSS belum/gagal dimuat (fenomena giant runaway icons). Menulis width=\"24\" height=\"24\" di HTML tetap dapat ditimpa dengan mudah oleh CSS kapan saja, namun menjaga tata letak tetap aman."},
        {"tanya":"Kapan Anda sebaiknya memilih elemen <canvas> dibandingkan <svg>?","opsi":["Saat membuat logo perusahaan dan ikon tombol navigasi.","Saat merender simulasi visual dengan puluhan ribu partikel yang bergerak 60 bingkai per detik atau melakukan manipulasi piksel gambar secara langsung, di mana membuat ribuan simpul DOM <svg> akan membebani memori.","Saat membuat diagram alur statis yang teks di dalamnya perlu bisa dicari (Ctrl+F) dan dibaca oleh pembaca layar.","Saat ingin membuat gambar yang otomatis tajam saat dicetak pada ukuran spanduk raksasa."],"benar":1,"penjelasan":"<canvas> bekerja dalam mode immediate-mode pixel rendering tanpa membebani pohon DOM dengan ribuan simpul objek, sehingga sangat cepat untuk gim, visualisasi data skala masif, dan pengolahan piksel. Untuk ikon, logo, dan diagram antarmuka, <svg> jauh lebih unggul."}
    ]
},
{
    id: 11,
    kategori: "2 · Media & Tabel",
    judul: "Peta Gambar (map & area) dan Elemen Penyematan (object, embed)",
    tingkat: "Menengah", durasi: "7 mnt",
    tag: ["<map>","<area>","<object>"],
    ringkas: "Membuat wilayah klik interaktif di atas gambar menggunakan <map> dan <area>, alternatif modern berbasis SVG interaktif, serta kapan menggunakan <object> untuk menyematkan dokumen PDF dengan konten cadangan.",
    isi: `
<h2>1. Peta Gambar Klasik (<code>&lt;map&gt;</code> dan <code>&lt;area&gt;</code>) vs Alternatif SVG Modern</h2>
<p>HTML menyediakan elemen <strong><code>&lt;map&gt;</code></strong> dan <strong><code>&lt;area&gt;</code></strong> untuk mendefinisikan beberapa wilayah klik (<em>clickable hotspots</em>) berbentuk persegi panjang (<code>shape=&quot;rect&quot;</code>), lingkaran (<code>shape=&quot;circle&quot;</code>), atau poligon (<code>shape=&quot;poly&quot;</code>) di atas satu elemen <code>&lt;img usemap=&quot;#nama-peta&quot;&gt;</code>:</p>
<pre>&lt;img
  src=&quot;/assets/topologi-jaringan.png&quot;
  alt=&quot;Topologi jaringan dengan Router di kiri dan Server Database di kanan&quot;
  width=&quot;600&quot;
  height=&quot;300&quot;
  usemap=&quot;#peta-topologi&quot;
&gt;

&lt;map name=&quot;peta-topologi&quot;&gt;
  &lt;!-- Wilayah klik persegi panjang: x1, y1, x2, y2 --&gt;
  &lt;area
    shape=&quot;rect&quot;
    coords=&quot;20,50,180,250&quot;
    href=&quot;/materi/jaringan-router&quot;
    alt=&quot;Pelajari konfigurasi Router Gateway&quot;
  &gt;
  &lt;!-- Wilayah klik lingkaran: pusat-x, pusat-y, jari-jari --&gt;
  &lt;area
    shape=&quot;circle&quot;
    coords=&quot;450,150,80&quot;
    href=&quot;/materi/database-server&quot;
    alt=&quot;Pelajari replikasi Server Database&quot;
  &gt;
&lt;/map&gt;</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Kelemahan <code>&lt;map&gt;</code> / <code>&lt;area&gt;</code> pada Desain Responsif Modern</div><p>Koordinat piksel di dalam atribut <code>coords=&quot;20,50,180,250&quot;</code> <strong>bersifat statis (tidak otomatis ikut menyusut saat gambar <code>&lt;img&gt;</code> mengecil di layar ponsel)</strong>! <strong>Solusi Modern Terbaik:</strong> Untuk diagram interaktif atau peta wilayah yang harus 100% responsif di semua ukuran layar, gunakan <strong><code>&lt;svg viewBox=&quot;...&quot;&gt;</code> inline yang membungkus <code>&lt;a href=&quot;...&quot;&gt;</code> di sekitar elemen <code>&lt;rect&gt;</code> atau <code>&lt;path&gt;</code></strong>, karena koordinat di dalam <code>viewBox</code> SVG otomatis berskala secara proporsional!</p></div>
<pre>&lt;!-- Alternatif Modern yang 100% Responsif dengan SVG Inline --&gt;
&lt;svg viewBox=&quot;0 0 600 300&quot; role=&quot;group&quot; aria-label=&quot;Diagram Topologi Interaktif&quot;&gt;
  &lt;a href=&quot;/materi/jaringan-router&quot; aria-label=&quot;Pelajari konfigurasi Router Gateway&quot;&gt;
    &lt;rect x=&quot;20&quot; y=&quot;50&quot; width=&quot;160&quot; height=&quot;200&quot; rx=&quot;12&quot; fill=&quot;#dbeafe&quot; stroke=&quot;#2563eb&quot; /&gt;
    &lt;text x=&quot;100&quot; y=&quot;155&quot; text-anchor=&quot;middle&quot; fill=&quot;#1e3a8a&quot;&gt;Router Gateway&lt;/text&gt;
  &lt;/a&gt;
&lt;/svg&gt;</pre>
<h2>2. Menyematkan Dokumen PDF dengan <code>&lt;object&gt;</code> dan Konten Fallback</h2>
<p>Jika Anda ingin menampilkan pratinjau dokumen PDF langsung di dalam halaman, elemen <strong><code>&lt;object&gt;</code></strong> memiliki satu keunggulan besar dibandingkan <code>&lt;iframe&gt;</code>:</p>
<ul><li>Di dalam <code>&lt;object data=&quot;panduan.pdf&quot; type=&quot;application/pdf&quot;&gt; ... &lt;/object&gt;</code>, Anda dapat menuliskan **konten HTML cadangan (<em>fallback</em>)** di antara tag pembuka dan penutupnya! Jika peramban pengguna (misalnya di beberapa perangkat seluler) tidak memiliki pembaca PDF tersemat, peramban otomatis menampilkan tautan unduhan di dalamnya:</li></ul>
<pre>&lt;object
  data=&quot;/assets/cheatsheet-linux.pdf&quot;
  type=&quot;application/pdf&quot;
  width=&quot;800&quot;
  height=&quot;600&quot;
  style=&quot;width: 100%;&quot;
  aria-label=&quot;Pratinjau Lembar Contekan Perintah Linux&quot;
&gt;
  &lt;p&gt;
    Peramban Anda tidak mendukung tampilan PDF langsung di halaman ini.
    Silakan &lt;a href=&quot;/assets/cheatsheet-linux.pdf&quot; download&gt;unduh berkas PDF (350 KB)&lt;/a&gt;
    untuk membacanya.
  &lt;/p&gt;
&lt;/object&gt;</pre>
<h2>Latihan Praktik: Diagram Arsitektur Interaktif dan Penyematan Dokumen</h2>
<p>Buatlah berkas <code>peta-dan-objek.html</code>:</p>
<ol><li>Buat satu gambar dengan <code>&lt;map&gt;</code> dan <code>&lt;area&gt;</code> lengkap dengan atribut <code>alt</code> pada setiap <code>&lt;area&gt;</code>.</li><li>Buat versi modernnya menggunakan <code>&lt;svg viewBox=&quot;0 0 500 200&quot;&gt;</code> yang memiliki dua area tautan <code>&lt;a&gt;</code> interaktif.</li><li>Tambahkan elemen <code>&lt;object type=&quot;application/pdf&quot;&gt;</code> lengkap dengan paragraf fallback unduhan.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements" rel="noopener">HTML elements reference (&lt;map&gt;, &lt;area&gt;, &lt;object&gt;) — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images" rel="noopener">Using responsive images in HTML — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["<area>","<map>","<object>","shape=\"rect\"","shape=\"circle\"","shape=\"poly\""],
    kuis: [
        {"tanya":"Mengapa setiap elemen <area href=\"...\"> di dalam <map> wajib memiliki atribut alt?","opsi":["Agar wilayah klik berwarna merah secara otomatis","Karena setiap <area href=\"...\"> berfungsi sebagai tautan navigasi, sehingga atribut alt menjadi accessible name yang dibacakan oleh pembaca layar saat pengguna menavigasi titik-titik peta gambar dengan tombol Tab","Karena tanpa alt, koordinat coords tidak dihitung","Agar gambar utama dapat diunduh"],"benar":1,"penjelasan":"Bagi pengguna pembaca layar dan papan ketik, setiap <area> adalah tautan interaktif. Atribut alt pada <area> menjelaskan tujuan dari wilayah tautan tersebut."},
        {"tanya":"Apa keunggulan menggunakan <svg viewBox=\"...\"> dengan elemen <a> di dalamnya dibandingkan <map> dan <area coords=\"...\"> untuk diagram interaktif di web modern?","opsi":["<map> tidak bisa digunakan pada gambar PNG","Koordinat di dalam viewBox SVG otomatis membesar dan menyusut secara proporsional mengikuti lebar layar responsif, sedangkan angka piksel pada atribut coords di <area> bersifat tetap dan bergeser meleset ketika ukuran <img> menyusut di layar ponsel","SVG tidak membutuhkan tag penutup","<area> hanya mendukung maksimal 2 tautan"],"benar":1,"penjelasan":"Nilai coords pada <area> dihitung berdasarkan piksel tetap dan tidak ikut diskalakan ketika <img> diubah ukurannya oleh CSS max-width: 100%, sedangkan sistem koordinat viewBox pada SVG selalu responsif."},
        {"tanya":"Apa manfaat menempatkan elemen <p><a href=\"file.pdf\" download>Unduh PDF</a></p> di antara tag pembuka <object data=\"file.pdf\" type=\"application/pdf\"> dan tag penutup </object>?","opsi":["Teks tersebut selalu tampil di atas PDF sebagai judul","Teks tersebut berfungsi sebagai konten cadangan (fallback) yang otomatis ditampilkan oleh peramban apabila perangkat pengguna tidak mendukung penayangan PDF secara tersemat","Teks tersebut menghapus PDF setelah dibaca","Teks tersebut mempercepat pemuatan PDF"],"benar":1,"penjelasan":"Elemen <object> merender konten anak di dalamnya hanya apabila sumber daya utama pada atribut data gagal dimuat atau tipe MIME-nya tidak didukung secara tersemat oleh peramban perangkat tersebut."}
    ]
},
{
    id: 12,
    kategori: "2 · Media & Tabel",
    judul: "Elemen audio dan Subtitel/Transkrip track (WebVTT) untuk Aksesibilitas Media",
    tingkat: "Menengah", durasi: "6 mnt",
    tag: ["<audio>","<track>","preload=\"metadata\""],
    ringkas: "Menyematkan pemutar suara dan siniar (podcast) standar web menggunakan elemen <audio>, menyediakan format alternatif (audio/ogg; codecs=opus, audio/mp4, audio/mpeg) melalui <source>, mengatur strategi preload, serta melampirkan teks transkrip tersinkronisasi dengan <track kind=\"captions\"> berformat WebVTT (.vtt).",
    isi: `
<h2>1. Struktur Elemen <code>&lt;audio&gt;</code> Multi-Sumber dengan Fallback</h2>
<p>Jangan pernah mengaktifkan atribut <code>autoplay</code> pada elemen <code>&lt;audio&gt;</code> tanpa persetujuan eksplisit pengguna, karena suara mendadak mengganggu pembaca layar (<em>screen reader</em>) dan langsung diblokir oleh kebijakan Autoplay peramban modern.</p>
<pre>&lt;figure class=&quot;pemutar-audio&quot;&gt;
  &lt;figcaption id=&quot;judul-siniar&quot;&gt;Episode 14: Arsitektur HTTP/3 &amp;amp; QUIC&lt;/figcaption&gt;
  &lt;audio controls preload=&quot;metadata&quot; aria-labelledby=&quot;judul-siniar&quot;&gt;
    &lt;source src=&quot;/media/ep14-http3.opus&quot; type=&quot;audio/ogg; codecs=opus&quot;&gt;
    &lt;source src=&quot;/media/ep14-http3.m4a&quot; type=&quot;audio/mp4&quot;&gt;
    &lt;source src=&quot;/media/ep14-http3.mp3&quot; type=&quot;audio/mpeg&quot;&gt;
    &lt;track kind=&quot;captions&quot; src=&quot;/media/ep14-http3.id.vtt&quot; srclang=&quot;id&quot; label=&quot;Bahasa Indonesia&quot; default&gt;
    &lt;p&gt;Peramban Anda tidak mendukung pemutar audio HTML5. &lt;a href=&quot;/media/ep14-http3.mp3&quot; download&gt;Unduh rekaman MP3 (12 MB)&lt;/a&gt;.&lt;/p&gt;
  &lt;/audio&gt;
&lt;/figure&gt;</pre>
<div class="callout info"><p><strong>Catatan:</strong> Spesifikasi HTML menyebut bahwa elemen <code>&lt;audio&gt;</code> tidak memiliki area pemutaran untuk konten visual seperti takarir, sehingga peramban tidak menampilkan teks <code>&lt;track&gt;</code> pada pemutar audio; isinya hanya dapat diakses lewat JavaScript (<code>textTracks</code>). Agar siniar tetap aksesibel bagi pengguna Tuli, sediakan juga transkrip teks lengkap di halaman, misalnya di dalam <code>&lt;details&gt;</code> di bawah pemutar.</p></div>
<div class="callout info"><div class="callout-judul">💡 Tips Performa (<code>preload=&quot;metadata&quot;</code>)</div><p>Gunakan <code>preload=&quot;metadata&quot;</code> agar peramban hanya mengunduh informasi durasi dan metadata berkas (beberapa kilobyte), bukan mengunduh seluruh berkas audio puluhan megabyte sebelum pengguna menekan tombol Putar.</p></div>
<h2>Latihan Praktik Mandiri</h2>
<ol><li>Buat sebuah halaman daftar episode siniar menggunakan <code>&lt;figure&gt;</code>, <code>&lt;figcaption&gt;</code>, dan <code>&lt;audio controls preload=&quot;metadata&quot;&gt;</code>.</li><li>Sertakan minimal dua <code>&lt;source&gt;</code> dengan atribut <code>type</code> MIME yang akurat dan satu tautan unduh fallback di dalam tag <code>&lt;audio&gt;</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/audio" rel="noopener">MDN Web Docs — <code>&lt;audio&gt;</code>: The Embed Audio element</a></li><li><a href="https://html.spec.whatwg.org/multipage/media.html" rel="noopener">WHATWG HTML Living Standard — Media Elements</a></li></ul></div>
`,
    perintah: ["<audio>","preload=\"metadata\"","autoplay","<track>","textTracks","<details>"],
    kuis: [
        {"tanya":"Nilai atribut preload manakah pada elemen <audio> yang paling hemat kuota data pengguna namun tetap menampilkan total durasi rekaman saat halaman dimuat?","opsi":["preload=\"auto\"","preload=\"metadata\"","preload=\"full\"","preload=\"all\""],"benar":1,"penjelasan":"preload=\"metadata\" menginstruksikan peramban untuk hanya mengambil header metadata berkas (seperti durasi audio) tanpa mengunduh seluruh aliran suara sebelum diputar."},
        {"tanya":"Apa fungsi dari teks atau tautan yang diletakkan di antara tag pembuka <audio> dan penutup </audio> di bawah elemen <source>?","opsi":["Ditampilkan sebagai judul lagu di atas pemutar audio pada semua peramban","Ditampilkan sebagai konten cadangan (fallback) hanya apabila peramban pengguna tidak mendukung elemen <audio>","Mengubah kecepatan pemutaran audio menjadi 2x lipat","Mengirimkan statistik pendengar ke server secara otomatis"],"benar":1,"penjelasan":"Konten di dalam elemen <audio> (selain <source> dan <track>) hanya dirender sebagai fallback bagi klien yang tidak mendukung pemutaran audio HTML5."},
        {"tanya":"Mengapa atribut type pada elemen <source> (misalnya type=\"audio/ogg; codecs=opus\") sangat disarankan untuk selalu ditulis?","opsi":["Agar peramban dapat langsung melewati format yang tidak didukungnya tanpa harus mengunduh potongan berkas tersebut terlebih dahulu","Karena tanpa atribut type, berkas .mp3 akan berubah menjadi gambar","Untuk mengenkripsi berkas audio dengan kata sandi","Hanya sebagai komentar yang diabaikan oleh peramban"],"benar":0,"penjelasan":"Dengan memeriksa atribut type, peramban segera mengetahui apakah codec tersebut didukung secara lokal tanpa membuang permintaan jaringan percuma."}
    ]
},
{
    id: 13,
    kategori: "2 · Media & Tabel",
    judul: "Elemen video Mendalam: Poster, playsinline, Multi-Codec (AV1/WebM/MP4), dan Subtitel track",
    tingkat: "Menengah", durasi: "6 mnt",
    tag: ["<video>","playsinline","<track>"],
    ringkas: "Menyajikan video di web dengan cepat, hemat pita lebar, dan aksesibel menggunakan elemen <video>, atribut width/height anti-CLS, gambar sampul poster, aturan muted playsinline untuk video latar/loop di perangkat seluler, serta lima jenis <track> (subtitles, captions, descriptions, chapters, metadata).",
    isi: `
<h2>1. Anatomi Elemen <code>&lt;video&gt;</code> Kelas Produksi</h2>
<p>Video yang memenuhi standar aksesibilitas <strong>WCAG 1.2</strong> wajib menyertakan takarir tertutup (<code>&lt;track kind=&quot;captions&quot;&gt;</code>) bagi pengguna Tuli atau pengguna di ruang publik yang mematikan pengeras suara.</p>
<pre>&lt;video
  controls
  preload=&quot;metadata&quot;
  width=&quot;1280&quot;
  height=&quot;720&quot;
  poster=&quot;/media/sampul-demo-kodeloka.webp&quot;
  crossorigin=&quot;anonymous&quot;
&gt;
  &lt;source src=&quot;/media/demo-kodeloka.av1.mp4&quot; type=&quot;video/mp4; codecs=av01.0.05M.08&quot;&gt;
  &lt;source src=&quot;/media/demo-kodeloka.webm&quot; type='video/webm; codecs=&quot;vp9,opus&quot;'&gt;
  &lt;source src=&quot;/media/demo-kodeloka.h264.mp4&quot; type=&quot;video/mp4&quot;&gt;
  &lt;track kind=&quot;captions&quot; src=&quot;/media/demo.id.vtt&quot; srclang=&quot;id&quot; label=&quot;Bahasa Indonesia (CC)&quot; default&gt;
  &lt;track kind=&quot;subtitles&quot; src=&quot;/media/demo.en.vtt&quot; srclang=&quot;en&quot; label=&quot;English&quot;&gt;
  &lt;track kind=&quot;chapters&quot; src=&quot;/media/demo-bab.id.vtt&quot; srclang=&quot;id&quot; label=&quot;Daftar Bab&quot;&gt;
  &lt;p&gt;Peramban Anda tidak mendukung video HTML5. &lt;a href=&quot;/media/demo-kodeloka.h264.mp4&quot;&gt;Unduh video MP4&lt;/a&gt;.&lt;/p&gt;
&lt;/video&gt;</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Syarat Mutlak Autoplay di Peramban Seluler (<code>muted playsinline</code>)</div><p>Jika Anda menampilkan video animasi produk pendek tanpa suara yang berputar otomatis menggantikan berkas GIF yang bengkak, Anda <strong>wajib</strong> menyertakan kombinasi atribut <code>autoplay muted loop playsinline</code>. Tanpa <code>muted</code> dan <code>playsinline</code>, iOS Safari dan Chrome Android akan memblokir pemutaran otomatis atau memaksanya terbuka dalam mode layar penuh.</p></div>
<h2>Latihan Praktik Mandiri</h2>
<ol><li>Buat sebuah elemen <code>&lt;video&gt;</code> dengan atribut <code>width=&quot;1280&quot;</code>, <code>height=&quot;720&quot;</code>, <code>preload=&quot;metadata&quot;</code>, dan <code>poster</code>.</li><li>Buat sebuah berkas teks <code>subtitel.vtt</code> berformat <code>WEBVTT</code> dan hubungkan menggunakan <code>&lt;track kind=&quot;captions&quot; srclang=&quot;id&quot; default&gt;</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video" rel="noopener">MDN Web Docs — <code>&lt;video&gt;</code>: The Video Embed element</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track" rel="noopener">MDN Web Docs — <code>&lt;track&gt;</code>: The Embed Text Track element</a></li></ul></div>
`,
    perintah: ["<video>","<track kind=\"captions\">","muted playsinline","autoplay muted loop playsinline","muted","playsinline"],
    kuis: [
        {"tanya":"Kombinasi atribut manakah yang wajib diberikan pada elemen <video> agar video animasi pendek tanpa suara dapat berputar otomatis di tempat (inline) pada peramban seluler (iOS Safari & Android Chrome)?","opsi":["autoplay=\"force\" fullscreen=\"no\"","autoplay muted playsinline","controls=\"false\" sound=\"off\"","preload=\"auto\" poster=\"none\""],"benar":1,"penjelasan":"Peramban modern hanya mengizinkan autoplay tanpa interaksi pengguna apabila video dibisukan (muted) dan diberi atribut playsinline agar tidak membajak layar penuh ponsel."},
        {"tanya":"Apa perbedaan semantik antara <track kind=\"subtitles\"> dan <track kind=\"captions\"> pada elemen <video>?","opsi":["subtitles menerjemahkan dialog lisan bagi penonton yang dapat mendengar suara tetapi tidak memahami bahasanya, sedangkan captions menyertakan dialog sekaligus deskripsi efek suara non-dialog (seperti [suara petir], [musik tegang]) bagi pengguna Tuli/kurang dengar","subtitles hanya untuk bahasa Inggris, sedangkan captions untuk bahasa Indonesia","captions terletak di luar video, sedangkan subtitles di dalam video","Keduanya tidak memiliki perbedaan sama sekali dalam spesifikasi HTML"],"benar":0,"penjelasan":"Sesuai spesifikasi WHATWG dan WCAG, captions ditujukan bagi pengguna Tuli/Hard-of-Hearing sehingga mencakup transkripsi dialog dan isyarat audio penting, sedangkan subtitles berfokus pada terjemahan dialog."},
        {"tanya":"Mengapa atribut width dan height tetap penting ditulis pada elemen <video> meskipun ukurannya diatur menjadi width: 100%; height: auto; di CSS?","opsi":["Agar peramban dapat langsung menghitung rasio aspek ruang video sebelum metadata video selesai diunduh sehingga mencegah pergeseran tata letak (Cumulative Layout Shift / CLS)","Untuk membatasi durasi video maksimal 720 detik","Karena CSS tidak berlaku pada elemen <video>","Untuk kompresi otomatis di sisi peramban"],"benar":0,"penjelasan":"Atribut width dan height memberi tahu peramban rasio aspek intrinsik kotak video sejak awal penguraian HTML sehingga halaman tidak melompat saat video termuat."}
    ]
},
{
    id: 14,
    kategori: "2 · Media & Tabel",
    judul: "Tabel Data yang Terstruktur dan Aksesibel",
    tingkat: "Dasar", durasi: "10 mnt",
    tag: ["<thead>","<table>","<caption>"],
    ringkas: "Menyajikan data tabular secara akurat menggunakan <table>, <caption>, <thead>, <tbody>, <tfoot>, serta mengaitkan sel kepala (<th>) dengan data (<td>) menggunakan atribut scope demi aksesibilitas pembaca layar.",
    isi: `
<h2>Aturan Emas Tabel HTML: Hanya untuk Data Tabular!</h2>
<p>Pada akhir 1990-an sebelum CSS mendukung Flexbox dan Grid, pengembang web menyalahgunakan elemen <code>&lt;table&gt;</code> untuk membagi kolom halaman web (header di baris atas, sidebar di kolom kiri, konten di kolom kanan). Praktik tersebut kini <strong>dilarang keras</strong> karena:</p>
<ol><li>Merusak urutan baca dan membingungkan pembaca layar yang akan mengumumkan <em>&quot;Tabel dengan 4 baris dan 3 kolom&quot;</em> padahal isinya adalah tata letak halaman.</li><li>Sangat kaku dan sulit dibuat responsif di layar ponsel.</li><li>Memperberat perhitungan <em>layout/reflow</em> di peramban.</li></ol>
<p>Gunakan <code>&lt;table&gt;</code> <strong>hanya ketika Anda menyajikan data yang secara alami berbentuk baris dan kolom</strong>—seperti perbandingan spesifikasi server, laporan keuangan, jadwal rilis versi perangkat lunak, atau daftar harga paket. Untuk tata letak halaman, gunakan <strong>CSS Grid</strong> atau <strong>Flexbox</strong>.</p>
<h2>1. Anatomi Tabel yang Lengkap dan Semantik</h2>
<p>Tabel yang baik tidak hanya terdiri dari <code>&lt;tr&gt;</code> (<em>table row</em>) dan <code>&lt;td&gt;</code> (<em>table data</em>), melainkan dibagi ke dalam bagian-bagian semantik yang jelas:</p>
<pre>&lt;table&gt;
  &lt;caption&gt;
    Perbandingan Dukungan Cabang Versi PHP (Status Oktober 2026)
  &lt;/caption&gt;
  &lt;thead&gt;
    &lt;tr&gt;
      &lt;th scope=&quot;col&quot;&gt;Cabang Versi&lt;/th&gt;
      &lt;th scope=&quot;col&quot;&gt;Rilis Awal&lt;/th&gt;
      &lt;th scope=&quot;col&quot;&gt;Akhir Dukungan Aktif&lt;/th&gt;
      &lt;th scope=&quot;col&quot;&gt;Akhir Dukungan Keamanan&lt;/th&gt;
    &lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr&gt;
      &lt;th scope=&quot;row&quot;&gt;PHP 8.2&lt;/th&gt;
      &lt;td&gt;8 Desember 2022&lt;/td&gt;
      &lt;td&gt;31 Desember 2024&lt;/td&gt;
      &lt;td&gt;31 Desember 2026&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;th scope=&quot;row&quot;&gt;PHP 8.3&lt;/th&gt;
      &lt;td&gt;23 November 2023&lt;/td&gt;
      &lt;td&gt;31 Desember 2025&lt;/td&gt;
      &lt;td&gt;31 Desember 2027&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;th scope=&quot;row&quot;&gt;PHP 8.4&lt;/th&gt;
      &lt;td&gt;21 November 2024&lt;/td&gt;
      &lt;td&gt;31 Desember 2026&lt;/td&gt;
      &lt;td&gt;31 Desember 2028&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;th scope=&quot;row&quot;&gt;PHP 8.5&lt;/th&gt;
      &lt;td&gt;20 November 2025&lt;/td&gt;
      &lt;td&gt;31 Desember 2027&lt;/td&gt;
      &lt;td&gt;31 Desember 2029&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/tbody&gt;
  &lt;tfoot&gt;
    &lt;tr&gt;
      &lt;th scope=&quot;row&quot; colspan=&quot;3&quot;&gt;Masa dukungan total per cabang rilis&lt;/th&gt;
      &lt;td&gt;4 Tahun (2 Aktif + 2 Keamanan)&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/tfoot&gt;
&lt;/table&gt;</pre>
<h3>Mengapa <code>&lt;th scope=&quot;col&quot;&gt;</code> dan <code>&lt;th scope=&quot;row&quot;&gt;</code> Sangat Krusial?</h3>
<p>Pengguna yang melihat layar dapat melirik ke atas dan ke kiri untuk memahami bahwa tanggal <code>&quot;31 Desember 2028&quot;</code> adalah <strong>&quot;Akhir Dukungan Keamanan&quot;</strong> milik <strong>&quot;PHP 8.4&quot;</strong>.</p>
<p>Namun, pengguna tunanetra yang menavigasi tabel menggunakan pembaca layar berpindah dari satu sel ke sel lain. Ketika Anda memasang:</p>
<ul><li><code>&lt;th scope=&quot;col&quot;&gt;</code> pada judul kolom di <code>&lt;thead&gt;</code>, dan</li><li><code>&lt;th scope=&quot;row&quot;&gt;</code> pada sel pengenal baris pertama di setiap <code>&lt;tr&gt;</code> dalam <code>&lt;tbody&gt;</code>,</li></ul>
<p>maka saat pengguna berpindah ke sel <code>&quot;31 Desember 2028&quot;</code>, pembaca layar akan membacakan konteks lengkapnya: <em>&quot;Akhir Dukungan Keamanan, PHP 8.4: 31 Desember 2028&quot;</em>. Tanpa atribut <code>scope</code> dan elemen <code>&lt;th&gt;</code>, pengguna hanya mendengar deretan tanggal tanpa tahu milik baris atau kolom mana tanggal tersebut!</p>
<h3>Peran <code>&lt;caption&gt;</code></h3>
<p>Elemen <code>&lt;caption&gt;</code> harus diletakkan sebagai <strong>anak pertama tepat di bawah tag pembuka <code>&lt;table&gt;</code></strong>. Ia berfungsi sebagai judul resmi tabel yang langsung dibacakan ketika pengguna melompat ke tabel tersebut.</p>
<h2>2. Menggabungkan Sel dengan <code>colspan</code> dan <code>rowspan</code></h2>
<p>Terkadang sebuah sel kepala atau ringkasan perlu merentang melintasi beberapa kolom (<code>colspan</code>) atau beberapa baris (<code>rowspan</code>):</p>
<pre>&lt;table&gt;
  &lt;caption&gt;Penggunaan Sumber Daya Klaster Produksi per Kuartal&lt;/caption&gt;
  &lt;thead&gt;
    &lt;tr&gt;
      &lt;th scope=&quot;col&quot; rowspan=&quot;2&quot;&gt;Layanan&lt;/th&gt;
      &lt;th scope=&quot;colgroup&quot; colspan=&quot;2&quot;&gt;Beban CPU (%)&lt;/th&gt;
      &lt;th scope=&quot;colgroup&quot; colspan=&quot;2&quot;&gt;Memori RAM (GB)&lt;/th&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;th scope=&quot;col&quot;&gt;Rata-rata&lt;/th&gt;
      &lt;th scope=&quot;col&quot;&gt;Puncak (P99)&lt;/th&gt;
      &lt;th scope=&quot;col&quot;&gt;Rata-rata&lt;/th&gt;
      &lt;th scope=&quot;col&quot;&gt;Puncak (P99)&lt;/th&gt;
    &lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr&gt;
      &lt;th scope=&quot;row&quot;&gt;API Gateway (Kong)&lt;/th&gt;
      &lt;td&gt;32%&lt;/td&gt;
      &lt;td&gt;68%&lt;/td&gt;
      &lt;td&gt;1,4 GB&lt;/td&gt;
      &lt;td&gt;2,8 GB&lt;/td&gt;
    &lt;/tr&gt;
    &lt;tr&gt;
      &lt;th scope=&quot;row&quot;&gt;Worker Pembayaran&lt;/th&gt;
      &lt;td&gt;45%&lt;/td&gt;
      &lt;td&gt;89%&lt;/td&gt;
      &lt;td&gt;3,2 GB&lt;/td&gt;
      &lt;td&gt;6,0 GB&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt;</pre>
<div class="callout info"><div class="callout-judul">💡 Tips Praktis: Hitung Jumlah Kolom di Setiap Baris!</div><p>Pada contoh di atas, baris pertama <code>&lt;thead&gt;</code> memiliki: 1 kolom (<code>Layanan</code>) + 2 kolom (<code>Beban CPU</code>) + 2 kolom (<code>Memori RAM</code>) = <strong>5 kolom</strong>. Baris kedua <code>&lt;thead&gt;</code> tidak menulis ulang kolom pertama karena kolom pertama sudah direntangkan ke bawah oleh <code>rowspan=&quot;2&quot;</code>, sehingga baris kedua cukup menulis <strong>4 sel <code>&lt;th&gt;</code></strong> sisanya (<code>1 + 4 = 5 kolom</code>). Jika jumlah kolom tidak konsisten, tabel akan tampak miring atau memiliki sel kosong di ujung kanan.</p></div>
<h2>3. Membuat Tabel Lebar Tetap Nyaman di Layar Ponsel</h2>
<p>Tabel dengan banyak kolom sering meluber (<em>overflow</em>) melebihi lebar layar ponsel dan merusak tata letak seluruh halaman. Pola paling bersih dan aksesibel untuk mengatasinya adalah membungkus <code>&lt;table&gt;</code> di dalam kontainer yang dapat digeser secara horizontal (<code>overflow-x: auto</code>) dan dapat difokuskan dengan papan ketik (<code>tabindex=&quot;0&quot;</code>):</p>
<pre>&lt;div class=&quot;pembungkus-tabel&quot; role=&quot;region&quot; aria-labelledby=&quot;judul-tabel-server&quot; tabindex=&quot;0&quot;&gt;
  &lt;table&gt;
    &lt;caption id=&quot;judul-tabel-server&quot;&gt;Daftar Spesifikasi Node Server&lt;/caption&gt;
    &lt;!-- isi thead dan tbody --&gt;
  &lt;/table&gt;
&lt;/div&gt;</pre>
<p>Dengan CSS pendamping:</p>
<pre>.pembungkus-tabel {
  overflow-x: auto;
  max-width: 100%;
}
table {
  width: 100%;
  border-collapse: collapse;
}</pre>
<h2>Kesalahan Umum dan Cara Menghindarinya</h2>
<ol><li><strong>Menggunakan <code>&lt;td&gt;</code> dengan kelas <code>.tebal</code> di dalam <code>&lt;thead&gt;</code> alih-alih <code>&lt;th&gt;</code>:</strong><ul><li><strong>Salah:</strong> <code>&lt;thead&gt;&lt;tr&gt;&lt;td class=&quot;tebal&quot;&gt;Nama Produk&lt;/td&gt;...&lt;/tr&gt;&lt;/thead&gt;</code>. Secara visual terlihat tebal, tetapi secara semantik sel tersebut tetap dianggap sel data biasa dan tidak dikenali sebagai header kolom oleh pembaca layar.</li><li><strong>Benar:</strong> Selalu gunakan <code>&lt;th scope=&quot;col&quot;&gt;</code> untuk sel kepala kolom dan <code>&lt;th scope=&quot;row&quot;&gt;</code> untuk sel kepala baris.</li></ul></li><li><strong>Meletakkan <code>&lt;caption&gt;</code> di luar <code>&lt;table&gt;</code> atau setelah <code>&lt;thead&gt;</code>:</strong><ul><li><strong>Salah:</strong> Spesifikasi HTML mewajibkan <code>&lt;caption&gt;</code> (jika digunakan) menjadi elemen anak pertama dari <code>&lt;table&gt;</code>, sebelum <code>&lt;colgroup&gt;</code>, <code>&lt;thead&gt;</code>, atau <code>&lt;tbody&gt;</code>.</li></ul></li></ol>
<h2>Latihan Praktik: Menyusun Tabel Matriks Latensi Jaringan</h2>
<p>Buatlah berkas <code>tabel-latensi.html</code> yang menyajikan data waktu respons (dalam milidetik) dari 3 wilayah server (<em>Jakarta</em>, <em>Singapura</em>, <em>Tokyo</em>) untuk dua protokol (<em>HTTP/2</em> dan <em>HTTP/3</em>):</p>
<ol><li>Gunakan <code>&lt;caption&gt;</code> sebagai judul tabel.</li><li>Gunakan <code>&lt;thead&gt;</code> dua tingkat dengan <code>rowspan=&quot;2&quot;</code> dan <code>colspan=&quot;2&quot;</code> beserta atribut <code>scope</code> yang tepat.</li><li>Gunakan <code>&lt;tbody&gt;</code> dengan <code>&lt;th scope=&quot;row&quot;&gt;</code> untuk setiap nama wilayah server.</li><li>Tambahkan <code>&lt;tfoot&gt;</code> yang menampilkan rata-rata waktu respons keseluruhan.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_table_basics" rel="noopener">HTML table basics — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Table_accessibility" rel="noopener">HTML table accessibility — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table" rel="noopener"><code>&lt;table&gt;</code>: The Table element — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["<thead>","<table>","<caption>","<th scope=\"row\">","<th scope=\"col\">","<tbody>"],
    kuis: [
        {"tanya":"Apa fungsi utama dari atribut scope=\"row\" pada elemen <th> yang berada di kolom pertama sebuah baris di dalam <tbody>?","opsi":["Menggabungkan seluruh sel di dalam baris tersebut menjadi satu sel lebar.","Memberitahu teknologi bantu (seperti pembaca layar) bahwa sel tersebut adalah judul/pengenal bagi seluruh sel data yang berada di baris yang sama.","Membuat baris tabel otomatis terkunci di bagian atas layar ketika halaman digulir.","Mengubah arah urutan kolom dari kanan ke kiri."],"benar":1,"penjelasan":"Atribut scope=\"row\" mengaitkan sel kepala (<th>) secara eksplisit dengan semua sel data (<td>) yang sebaris dengannya, sehingga saat pengguna pembaca layar berpindah antar-kolom di baris tersebut, mereka selalu mengetahui baris item mana yang sedang dibaca."},
        {"tanya":"Di manakah posisi penempatan elemen <caption> yang valid menurut spesifikasi HTML?","opsi":["Di luar <table>, tepat sebelum tag pembuka <table>.","Sebagai elemen anak terakhir di dalam <tfoot>.","Sebagai elemen anak pertama tepat setelah tag pembuka <table> (sebelum <thead> atau <tbody>).","Di dalam baris <tr> pertama pada <thead>."],"benar":2,"penjelasan":"Menurut spesifikasi WHATWG dan dokumentasi MDN, jika elemen <caption> digunakan, ia wajib menjadi elemen anak pertama dari elemen <table>."},
        {"tanya":"Pada baris pertama sebuah tabel (<tr>), terdapat satu sel dengan atribut colspan=\"3\" dan dua sel biasa tanpa colspan. Berapa jumlah total kolom yang harus dimiliki oleh baris berikutnya (jika tidak ada rowspan) agar struktur tabel sejajar?","opsi":["3 kolom","4 kolom","5 kolom","6 kolom"],"benar":2,"penjelasan":"Sel dengan colspan=\"3\" menempati lebar 3 kolom, ditambah 2 sel biasa yang masing-masing menempati 1 kolom, sehingga jumlah total kolom tabel tersebut adalah 3 + 1 + 1 = 5 kolom."}
    ]
},
{
    id: 15,
    kategori: "3 · Formulir",
    judul: "Formulir Web dan Kontrol Masukan Modern",
    tingkat: "Menengah", durasi: "11 mnt",
    tag: ["<label>","name","placeholder"],
    ringkas: "Membangun formulir HTML yang ergonomis dan aksesibel menggunakan <form>, <label>, <fieldset>, beragam tipe <input> modern, <select>, <datalist>, <textarea>, serta memahami cara kerja pengiriman data (GET vs POST).",
    isi: `
<h2>Bagaimana Formulir Mengirimkan Data ke Server?</h2>
<p>Formulir (<code>&lt;form&gt;</code>) adalah jembatan utama bagi pengguna untuk mengirimkan data ke server—mulai dari kotak pencarian, halaman masuk (<em>login</em>), hingga pendaftaran akun dan transaksi pembayaran.</p>
<p>Tiga atribut paling mendasar pada <code>&lt;form&gt;</code> adalah:</p>
<ol><li><strong><code>action</code>:</strong> Alamat URL tujuan tempat data formulir akan dikirimkan (misalnya <code>action=&quot;/api/pendaftaran&quot;</code>).</li><li><strong><code>method</code>:</strong> Metode HTTP yang digunakan saat mengirim data:<ul><li><strong><code>GET</code>:</strong> Data dirangkai ke dalam <em>query string</em> di URL (contoh: <code>/cari?q=golang&amp;tingkat=dasar</code>). Gunakan <code>GET</code> <strong>hanya</strong> untuk aksi pengambilan/penyaringan data yang bersifat idempoten (tidak mengubah data di server) dan tidak mengandung informasi rahasia seperti kata sandi.</li><li><strong><code>POST</code>:</strong> Data dikirim di dalam tubuh permintaan (<em>request body</em>) HTTP, tidak terlihat di bilah alamat URL. Gunakan <code>POST</code> untuk semua aksi yang membuat, mengubah, menghapus data, mengirim berkas, atau memuat data sensitif.</li><li><strong><code>dialog</code>:</strong> Nilai khusus untuk <code>&lt;form method=&quot;dialog&quot;&gt;</code> yang berada di dalam elemen <code>&lt;dialog&gt;</code>; alih-alih mengirim data ke server, pengiriman formulir akan menutup kotak dialog tersebut.</li></ul></li><li><strong><code>enctype</code>:</strong> Cara data dikodekan di dalam <em>body</em> saat menggunakan <code>method=&quot;POST&quot;</code>:<ul><li><code>application/x-www-form-urlencoded</code> (bawaan): Pasangan <code>name=value</code> yang dikodekan URL.</li><li><code>multipart/form-data</code>: <strong>Wajib digunakan</strong> apabila di dalam formulir terdapat <code>&lt;input type=&quot;file&quot;&gt;</code> untuk mengunggah berkas!</li></ul></li></ol>
<h2>1. Aturan Wajib: Setiap Kontrol Harus Memiliki <code>&lt;label&gt;</code> dan <code>name</code></h2>
<p>Dua kesalahan paling fatal saat membuat formulir adalah melupakan <code>&lt;label&gt;</code> dan melupakan atribut <code>name</code>:</p>
<ul><li><strong>Tanpa <code>&lt;label&gt;</code> yang terhubung dengan <code>for=&quot;id-input&quot;</code>:</strong> Pengguna pembaca layar tidak tahu apa yang harus diketik di dalam kotak input tersebut. Selain itu, <code>&lt;label&gt;</code> memperluas area klik/sentuh: saat pengguna mengeklik teks label (sangat membantu untuk <code>&lt;input type=&quot;checkbox&quot;&gt;</code> atau <code>radio</code> yang berukuran kecil di ponsel), fokus otomatis masuk ke kontrol inputnya!</li><li><strong>Tanpa atribut <code>name</code>:</strong> Saat tombol <em>Submit</em> ditekan, peramban menyusun paket data berdasarkan pasangan <code>name=value</code>. <strong>Input yang tidak memiliki atribut <code>name</code> tidak akan pernah dikirimkan ke server!</strong></li></ul>
<pre>&lt;!-- SALAH: Mengandalkan placeholder sebagai pengganti label, dan lupa atribut name --&gt;
&lt;input type=&quot;email&quot; placeholder=&quot;Masukkan alamat surel Anda&quot;&gt;

&lt;!-- BENAR: Memiliki &lt;label for=&quot;...&quot;&gt;, id, name, dan autocomplete yang jelas --&gt;
&lt;div class=&quot;kelompok-input&quot;&gt;
  &lt;label for=&quot;surel-pengguna&quot;&gt;Alamat Surel&lt;/label&gt;
  &lt;input
    type=&quot;email&quot;
    id=&quot;surel-pengguna&quot;
    name=&quot;email&quot;
    autocomplete=&quot;email&quot;
    placeholder=&quot;nama@contoh.id&quot;
    required
  &gt;
&lt;/div&gt;</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Kesalahan Umum: Menjadikan <code>placeholder</code> sebagai Pengganti <code>&lt;label&gt;</code></div><p>Teks <code>placeholder</code> hilang begitu pengguna mulai mengetik satu huruf, sehingga pengguna mudah lupa format atau tujuan kolom yang sedang diisi. Lebih buruk lagi, teks <code>placeholder</code> umumnya memiliki kontras warna abu-abu rendah yang sulit dibaca. Gunakan <code>&lt;label&gt;</code> untuk judul kolom, dan gunakan <code>placeholder</code> hanya untuk contoh singkat format isian.</p></div>
<h2>2. Memilih Tipe <code>&lt;input&gt;</code> yang Tepat</h2>
<p>Memilih atribut <code>type</code> yang spesifik pada <code>&lt;input&gt;</code> memberikan dua keuntungan besar secara gratis: <strong>papan ketik virtual yang sesuai di ponsel</strong> (misalnya papan ketik khusus angka atau tombol <code>@</code> untuk surel) dan <strong>validasi format otomatis</strong> oleh peramban.</p>
<table><thead><tr><th>Nilai <code>type</code></th><th>Fungsi &amp; Keuntungan di Perangkat Seluler</th><th>Atribut Pendukung Utama</th></tr></thead><tbody><tr><td><code>text</code></td><td>Teks satu baris umum</td><td><code>minlength</code>, <code>maxlength</code>, <code>pattern</code>, <code>spellcheck</code></td></tr><tr><td><code>email</code></td><td>Alamat surel (menampilkan tombol <code>@</code> di papan ketik ponsel)</td><td><code>multiple</code>, <code>autocomplete=&quot;email&quot;</code></td></tr><tr><td><code>password</code></td><td>Kata sandi (menyembunyikan karakter ketikan)</td><td><code>autocomplete=&quot;current-password&quot;</code> atau <code>&quot;new-password&quot;</code></td></tr><tr><td><code>search</code></td><td>Kotak pencarian (menyediakan tombol <code>×</code> untuk menghapus isi)</td><td><code>inputmode=&quot;search&quot;</code></td></tr><tr><td><code>tel</code></td><td>Nomor telepon (memunculkan papan ketik telepon numerik)</td><td><code>inputmode=&quot;tel&quot;</code>, <code>pattern</code>, <code>autocomplete=&quot;tel&quot;</code></td></tr><tr><td><code>url</code></td><td>Alamat URL lengkap dengan skema (<code>https://...</code>)</td><td><code>inputmode=&quot;url&quot;</code></td></tr><tr><td><code>number</code></td><td>Angka matematis dengan batasan rentang (mis. jumlah barang)</td><td><code>min</code>, <code>max</code>, <code>step</code></td></tr><tr><td><code>range</code></td><td>Penggeser nilai (<em>slider</em>)</td><td><code>min</code>, <code>max</code>, <code>step</code></td></tr><tr><td><code>date</code> / <code>datetime-local</code> / <code>time</code></td><td>Pemilih tanggal dan waktu bawaan sistem operasi</td><td><code>min</code>, <code>max</code>, <code>step</code></td></tr><tr><td><code>checkbox</code></td><td>Pilihan centang (boleh memilih nol, satu, atau banyak)</td><td><code>checked</code>, <code>value</code></td></tr><tr><td><code>radio</code></td><td>Pilihan tunggal dari satu kelompok yang memiliki <code>name</code> sama</td><td><code>checked</code>, <code>value</code>, <code>required</code></td></tr><tr><td><code>file</code></td><td>Pemilihan berkas dari perangkat atau kamera ponsel</td><td><code>accept=&quot;image/png,image/webp&quot;</code>, <code>multiple</code>, <code>capture</code></td></tr><tr><td><code>hidden</code></td><td>Data tersembunyi (seperti token CSRF atau ID item)</td><td><code>name</code>, <code>value</code></td></tr></tbody></table>
<div class="callout info"><div class="callout-judul">💡 Tips Praktis: Kode OTP dan Nomor Kartu Bukanlah <code>type=&quot;number&quot;</code>!</div><p>Kode OTP (<code>&quot;048291&quot;</code>), kode pos (<code>&quot;01234&quot;</code>), atau nomor kartu identitas bukanlah angka untuk dijumlahkan, melainkan deretan digit yang bisa diawali angka nol (<code>0</code>). Jika Anda memakai <code>type=&quot;number&quot;</code>, angka <code>0</code> di depan bisa hilang, muncul tombol panah atas/bawah yang tidak relevan, dan guliran roda tetikus (<em>scroll wheel</em>) dapat mengubah angkanya secara tidak sengaja! Solusi terbaiknya adalah menggunakan <strong><code>type=&quot;text&quot;</code> yang dipadukan dengan <code>inputmode=&quot;numeric&quot;</code> dan <code>pattern=&quot;[0-9]*&quot;</code></strong>:</p>
<pre>&lt;label for=&quot;kode-otp&quot;&gt;Kode Verifikasi 6 Digit&lt;/label&gt;
&lt;input
  type=&quot;text&quot;
  id=&quot;kode-otp&quot;
  name=&quot;otp&quot;
  inputmode=&quot;numeric&quot;
  pattern=&quot;[0-9]{6}&quot;
  maxlength=&quot;6&quot;
  autocomplete=&quot;one-time-code&quot;
  required
&gt;</pre></div>
<h2>3. Mengelompokkan Pilihan dengan <code>&lt;fieldset&gt;</code>, <code>&lt;legend&gt;</code>, <code>&lt;select&gt;</code>, dan <code>&lt;datalist&gt;</code></h2>
<h3><code>&lt;fieldset&gt;</code> dan <code>&lt;legend&gt;</code> untuk Radio &amp; Checkbox</h3>
<p>Ketika Anda membuat serangkaian tombol radio (<code>type=&quot;radio&quot;</code>) atau kotak centang (<code>type=&quot;checkbox&quot;</code>), setiap pilihan memiliki <code>&lt;label&gt;</code>-nya sendiri (misalnya <em>&quot;Dasar&quot;</em>, <em>&quot;Menengah&quot;</em>, <em>&quot;Lanjut&quot;</em>). Namun, bagaimana pembaca layar mengetahui <strong>pertanyaan utama</strong> dari kelompok pilihan tersebut? Jawabannya adalah membungkusnya dengan <code>&lt;fieldset&gt;</code> dan menulis pertanyaannya di dalam <code>&lt;legend&gt;</code>:</p>
<pre>&lt;fieldset&gt;
  &lt;legend&gt;Pilih Tingkat Kesulitan Kelas&lt;/legend&gt;

  &lt;div&gt;
    &lt;input type=&quot;radio&quot; id=&quot;tingkat-dasar&quot; name=&quot;tingkat&quot; value=&quot;dasar&quot; checked&gt;
    &lt;label for=&quot;tingkat-dasar&quot;&gt;Dasar (Pemula murni)&lt;/label&gt;
  &lt;/div&gt;

  &lt;div&gt;
    &lt;input type=&quot;radio&quot; id=&quot;tingkat-menengah&quot; name=&quot;tingkat&quot; value=&quot;menengah&quot;&gt;
    &lt;label for=&quot;tingkat-menengah&quot;&gt;Menengah (Sudah paham dasar web)&lt;/label&gt;
  &lt;/div&gt;

  &lt;div&gt;
    &lt;input type=&quot;radio&quot; id=&quot;tingkat-lanjut&quot; name=&quot;tingkat&quot; value=&quot;lanjut&quot;&gt;
    &lt;label for=&quot;tingkat-lanjut&quot;&gt;Lanjut (Siap produksi)&lt;/label&gt;
  &lt;/div&gt;
&lt;/fieldset&gt;</pre>
<h3><code>&lt;select&gt;</code> vs <code>&lt;datalist&gt;</code></h3>
<ul><li>Gunakan <strong><code>&lt;select&gt;</code></strong> (bersama <code>&lt;option&gt;</code> dan <code>&lt;optgroup&gt;</code>) ketika pengguna <strong>wajib memilih salah satu opsi yang sudah ditentukan</strong> (misalnya memilih provinsi atau metode pembayaran).</li><li>Gunakan <strong><code>&lt;datalist&gt;</code></strong> yang dikaitkan ke <code>&lt;input list=&quot;...&quot;&gt;</code> ketika Anda ingin memberikan **saran pelengkapan otomatis (<em>autocomplete suggestions</em>)**, tetapi tetap membebaskan pengguna mengetikkan nilai baru yang tidak ada di daftar:</li></ul>
<pre>&lt;label for=&quot;pilihan-distro&quot;&gt;Distribusi Linux yang Anda Gunakan&lt;/label&gt;
&lt;input id=&quot;pilihan-distro&quot; name=&quot;distro&quot; list=&quot;daftar-distro&quot; placeholder=&quot;Ketik atau pilih...&quot;&gt;
&lt;datalist id=&quot;daftar-distro&quot;&gt;
  &lt;option value=&quot;Ubuntu Server 24.04 LTS&quot;&gt;&lt;/option&gt;
  &lt;option value=&quot;Debian 13 (Trixie)&quot;&gt;&lt;/option&gt;
  &lt;option value=&quot;Rocky Linux 9&quot;&gt;&lt;/option&gt;
  &lt;option value=&quot;Arch Linux&quot;&gt;&lt;/option&gt;
&lt;/datalist&gt;</pre>
<h3><code>&lt;textarea&gt;</code> dan <code>&lt;output&gt;</code></h3>
<ul><li><strong><code>&lt;textarea&gt;</code>:</strong> Untuk masukan teks multi-baris seperti komentar atau alamat lengkap. Berbeda dengan <code>&lt;input&gt;</code>, nilai awal <code>&lt;textarea&gt;</code> ditulis di antara tag pembuka dan penutup (<code>&lt;textarea name=&quot;pesan&quot; rows=&quot;4&quot;&gt;Isi awal&lt;/textarea&gt;</code>).</li><li><strong><code>&lt;output&gt;</code>:</strong> Elemen semantik untuk menampilkan hasil perhitungan dari masukan pengguna (dan secara otomatis memiliki perilaku <em>live region</em> untuk pembaca layar).</li></ul>
<h2>Latihan Praktik: Merancang Formulir Pendaftaran Workshop Kodeloka</h2>
<p>Buatlah berkas <code>formulir-workshop.html</code> yang mengirimkan data ke <code>/daftar-workshop</code> dengan metode <code>POST</code> dan mengizinkan pengunggahan berkas:</p>
<ol><li>Kolom Nama Lengkap (<code>text</code>, <code>autocomplete=&quot;name&quot;</code>) dan Alamat Surel (<code>email</code>, <code>autocomplete=&quot;email&quot;</code>).</li><li>Kolom Kode Voucher 5 digit angka menggunakan kombinasi <code>type=&quot;text&quot;</code>, <code>inputmode=&quot;numeric&quot;</code>, dan <code>pattern</code>.</li><li>Kelompok pilihan sesi waktu (<em>Pagi</em> atau <em>Malam</em>) menggunakan <code>&lt;fieldset&gt;</code>, <code>&lt;legend&gt;</code>, dan <code>&lt;input type=&quot;radio&quot;&gt;</code>.</li><li>Kolom unggah bukti pendaftaran menggunakan <code>&lt;input type=&quot;file&quot; accept=&quot;image/png,image/jpeg,application/pdf&quot;&gt;</code>.</li><li>Tombol <code>&lt;button type=&quot;submit&quot;&gt;Daftar Sekarang&lt;/button&gt;</code> dan <code>&lt;button type=&quot;reset&quot;&gt;Kosongkan&lt;/button&gt;</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input" rel="noopener"><code>&lt;input&gt;</code>: The HTML Input element — MDN Web Docs</a></li><li><a href="https://html.spec.whatwg.org/multipage/forms.html" rel="noopener">Forms — WHATWG HTML Living Standard</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Images_media_forms" rel="noopener">Images, media, and form elements — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["<label>","name","placeholder","<fieldset>","<legend>","POST"],
    kuis: [
        {"tanya":"Apa yang terjadi apabila sebuah elemen <input type=\"text\" id=\"nama-lengkap\" required> di dalam <form> tidak memiliki atribut name ketika formulir dikirimkan ke server?","opsi":["Peramban otomatis menggunakan nilai atribut id sebagai pengganti name.","Nilai yang diketikkan pengguna di dalam input tersebut sama sekali tidak disertakan dalam data permintaan yang dikirim ke server.","Formulir gagal dikirim dan peramban menampilkan pesan galat \"Missing name attribute\".","Nilai input tetap dikirim dengan nama kunci bawaan \"input_0\"."],"benar":1,"penjelasan":"Spesifikasi formulir HTML menetapkan bahwa hanya kontrol formulir yang memiliki atribut name (dan tidak berstatus disabled) yang nilainya dikumpulkan menjadi form data set saat pengiriman."},
        {"tanya":"Untuk membuat kolom input 6 digit kode OTP (yang bisa diawali angka 0, seperti 049120) agar tetap memunculkan papan ketik angka di layar ponsel tanpa memotong angka nol di depan, kombinasi atribut manakah yang paling tepat?","opsi":["<input type=\"number\" max=\"999999\">","<input type=\"text\" inputmode=\"numeric\" pattern=\"[0-9]{6}\" maxlength=\"6\" autocomplete=\"one-time-code\">","<input type=\"tel\" step=\"1\">","<input type=\"range\" min=\"000000\" max=\"999999\">"],"benar":1,"penjelasan":"type=\"text\" menjaga nilai sebagai string karakter sehingga angka 0 di awal tidak dibuang, inputmode=\"numeric\" menampilkan papan ketik khusus angka di perangkat seluler, pattern=\"[0-9]{6}\" memvalidasi tepat 6 digit angka, dan autocomplete=\"one-time-code\" membantu sistem operasi menawarkan pengisian otomatis dari SMS/aplikasi autentikator."},
        {"tanya":"Atribut apakah yang wajib ditambahkan pada tag <form method=\"post\"> jika di dalamnya terdapat elemen <input type=\"file\">?","opsi":["enctype=\"application/json\"","enctype=\"multipart/form-data\"","accept=\"file/*\"","target=\"_blank\""],"benar":1,"penjelasan":"Pengodean bawaan application/x-www-form-urlencoded hanya mampu mengirim teks pasangan kunci-nilai. Untuk mengirimkan byte biner berkas melalui <input type=\"file\">, formulir wajib menggunakan enctype=\"multipart/form-data\"."}
    ]
},
{
    id: 16,
    kategori: "3 · Formulir",
    judul: "Validasi Formulir Bawaan dan Constraint Validation API",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["pattern","required",":user-invalid"],
    ringkas: "Memanfaatkan validasi deklaratif HTML5 (required, minlength, maxlength, min, max, step, pattern), mengatur gaya visual status validasi dengan :user-invalid, serta menyesuaikan pesan galat menggunakan Constraint Validation API.",
    isi: `
<h2>Mengapa Validasi Sisi Klien (Client-Side) Penting, dan Apa Batasannya?</h2>
<p>Validasi formulir di peramban memiliki satu tujuan utama: <strong>memberikan umpan balik instan kepada pengguna yang jujur</strong>. Daripada pengguna harus menunggu pengiriman formulir ke server hanya untuk diberi tahu bahwa format surel mereka kurang tanda <code>@</code>, peramban dapat langsung menandainya dalam hitungan milidetik.</p>
<p>Namun, ingat prinsip keamanan fundamental yang selalu ditekankan di Kodeloka:</p>
<div class="callout bahaya"><div class="callout-judul">🚫 Validasi Sisi Klien Bukanlah Pengaman Server!</div><p>Siapa pun dapat membuka Developer Tools untuk menghapus atribut <code>required</code>, memanggil <code>form.noValidate = true</code>, atau mengirim permintaan palsu langsung menggunakan <code>curl</code>. Oleh karena itu, <strong>setiap aturan validasi yang Anda tulis di HTML/JavaScript wajib selalu divalidasi ulang di sisi server (misalnya dengan PHP atau Go)</strong>. Gunakan validasi HTML untuk kenyamanan pengguna (UX), dan validasi server untuk keamanan data.</p></div>
<h2>1. Atribut Validasi Deklaratif HTML5</h2>
<p>Tanpa menulis satu baris JavaScript pun, HTML5 menyediakan atribut pembatas (<em>constraints</em>) yang langsung diperiksa oleh peramban saat tombol <code>type=&quot;submit&quot;</code> ditekan:</p>
<table><thead><tr><th>Atribut</th><th>Berlaku Pada</th><th>Fungsi Validasi</th></tr></thead><tbody><tr><td><code>required</code></td><td>Hampir semua input, <code>select</code>, <code>textarea</code></td><td>Kolom wajib diisi (atau wajib dicentang untuk kotak centang <em>Syarat &amp; Ketentuan</em>).</td></tr><tr><td><code>minlength</code> &amp; <code>maxlength</code></td><td><code>text</code>, <code>email</code>, <code>password</code>, <code>search</code>, <code>tel</code>, <code>url</code>, <code>textarea</code></td><td>Membatasi jumlah minimal dan maksimal karakter teks.</td></tr><tr><td><code>min</code> &amp; <code>max</code></td><td><code>number</code>, <code>range</code>, <code>date</code>, <code>time</code>, <code>datetime-local</code></td><td>Membatasi nilai angka atau tanggal paling kecil dan paling besar.</td></tr><tr><td><code>step</code></td><td><code>number</code>, <code>range</code>, <code>date</code>, <code>time</code></td><td>Menentukan kelipatan nilai yang sah (mis. <code>step=&quot;1000&quot;</code> untuk kelipatan Rp1.000, atau <code>step=&quot;0.01&quot;</code> untuk desimal dua angka).</td></tr><tr><td><code>pattern</code></td><td><code>text</code>, <code>search</code>, <code>tel</code>, <code>url</code>, <code>email</code>, <code>password</code></td><td>Mencocokkan nilai dengan ekspresi reguler (<em>Regular Expression</em>) penuh.</td></tr></tbody></table>
<h3>Contoh Penggunaan <code>pattern</code> dan <code>title</code> yang Ramah Pengguna</h3>
<p>Ketika Anda menggunakan atribut <code>pattern</code>, <strong>selalu berikan petunjuk format yang jelas di dalam teks bantuan atau atribut <code>title</code></strong>, karena peramban akan menyertakan isi <code>title</code> di dalam gelembung pesan galat bawaannya:</p>
<pre>&lt;div class=&quot;kolom-form&quot;&gt;
  &lt;label for=&quot;username-kodeloka&quot;&gt;Nama Pengguna (Username)&lt;/label&gt;
  &lt;input
    type=&quot;text&quot;
    id=&quot;username-kodeloka&quot;
    name=&quot;username&quot;
    required
    minlength=&quot;4&quot;
    maxlength=&quot;20&quot;
    pattern=&quot;[a-z0-9_]+&quot;
    title=&quot;Gunakan 4–20 karakter berupa huruf kecil (a-z), angka (0-9), atau garis bawah (_).&quot;
    aria-describedby=&quot;bantuan-username&quot;
  &gt;
  &lt;small id=&quot;bantuan-username&quot;&gt;
    Hanya huruf kecil, angka, dan garis bawah (4–20 karakter, tanpa spasi).
  &lt;/small&gt;
&lt;/div&gt;</pre>
<div class="callout info"><div class="callout-judul">💡 Catatan Teknis tentang <code>pattern</code></div><p>Ekspresi reguler pada atribut <code>pattern</code> secara otomatis bersifat <em>anchored</em> (seolah-olah dibungkus dengan <code>^(?:</code> di awal dan <code>)$</code> di akhir). Artinya, pola <code>pattern=&quot;[a-z0-9_]+&quot;</code> akan memeriksa <strong>seluruh</strong> isi input dari huruf pertama sampai terakhir, sehingga Anda tidak perlu menulis <code>^</code> dan <code>$</code>.</p></div>
<h2>2. Mengatur Gaya CSS: Mengapa <code>:user-invalid</code> Lebih Baik daripada <code>:invalid</code>?</h2>
<p>Di CSS, terdapat pseudo-class <code>:valid</code> dan <code>:invalid</code> untuk memberi warna bingkai hijau atau merah pada input. Namun, ada satu masalah klasik yang sangat mengganggu pada <code>:invalid</code>:</p>
<p>Saat halaman baru saja dibuka dan pengguna <strong>belum sempat mengetik apa pun</strong>, setiap kolom yang memiliki atribut <code>required</code> sudah berstatus <code>:invalid</code>! Akibatnya, seluruh formulir langsung menyala merah seolah-olah pengguna baru saja melakukan kesalahan.</p>
<p>Solusi modern di CSS (tersedia di semua peramban utama sejak November 2023 dan berstatus <strong>Baseline Widely Available</strong> sejak Mei 2026) adalah menggunakan <strong><code>:user-invalid</code></strong> dan <strong><code>:user-valid</code></strong>:</p>
<ul><li><code>:user-invalid</code> hanya aktif <strong>setelah pengguna benar-benar berinteraksi</strong> dengan kolom tersebut (misalnya mengetik lalu menghapusnya, atau mencoba menekan tombol Submit) dan nilainya masih salah!</li></ul>
<pre>/* Bingkai standar saat belum disentuh pengguna */
input, select, textarea {
  border: 1.5px solid #94a3b8;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
}

/* Hanya tampil merah SETELAH pengguna berinteraksi dan isiannya tidak valid */
input:user-invalid,
select:user-invalid,
textarea:user-invalid {
  border-color: #dc2626;
  background-color: #fef2f2;
}

/* Tampil hijau setelah pengguna mengisi dengan benar */
input:user-valid {
  border-color: #16a34a;
}</pre>
<h2>3. Mengenal Constraint Validation API Dasar</h2>
<p>Bagaimana jika pesan galat bawaan peramban (yang mengikuti bahasa sistem operasi pengguna) kurang jelas, atau Anda perlu memeriksa apakah kolom <em>&quot;Konfirmasi Kata Sandi&quot;</em> sama persis dengan kolom <em>&quot;Kata Sandi Baru&quot;</em>?</p>
<p>HTML menyediakan <strong>Constraint Validation API</strong> pada setiap elemen kontrol formulir:</p>
<ul><li><strong><code>elemen.validity</code>:</strong> Objek <code>ValidityState</code> yang berisi properti boolean spesifik penyebab kegagalan:<ul><li><code>valueMissing</code>: Gagal karena <code>required</code> kosong.</li><li><code>typeMismatch</code>: Gagal karena format <code>type=&quot;email&quot;</code> atau <code>type=&quot;url&quot;</code> salah.</li><li><code>patternMismatch</code>: Gagal karena tidak cocok dengan regex <code>pattern</code>.</li><li><code>tooShort</code> / <code>tooLong</code>: Gagal karena <code>minlength</code> / <code>maxlength</code>.</li><li><code>rangeUnderflow</code> / <code>rangeOverflow</code>: Gagal karena <code>min</code> / <code>max</code>.</li><li><code>valid</code>: Bernilai <code>true</code> jika semua syarat terpenuhi.</li></ul></li><li><strong><code>elemen.setCustomValidity(pesan)</code>:</strong> Mengatur pesan galat kustom.<ul><li><strong>Penting:</strong> Jika Anda memanggil <code>setCustomValidity(&quot;Pesan galat&quot;)</code>, elemen tersebut akan dianggap <strong>tidak valid</strong> sampai Anda memanggil kembali <code>setCustomValidity(&quot;&quot;)</code> (dengan string kosong) saat pengguna memperbaiki isiannya!</li></ul></li><li><strong><code>elemen.checkValidity()</code> dan <code>elemen.reportValidity()</code>:</strong> Memeriksa status validasi (dan <code>reportValidity()</code> sekaligus menampilkan pesan galat ke layar).</li></ul>
<pre>&lt;form id=&quot;form-sandi&quot;&gt;
  &lt;div&gt;
    &lt;label for=&quot;sandi-utama&quot;&gt;Kata Sandi Baru (min. 8 karakter)&lt;/label&gt;
    &lt;input type=&quot;password&quot; id=&quot;sandi-utama&quot; name=&quot;password&quot; minlength=&quot;8&quot; required&gt;
  &lt;/div&gt;

  &lt;div&gt;
    &lt;label for=&quot;sandi-ulang&quot;&gt;Ulangi Kata Sandi Baru&lt;/label&gt;
    &lt;input type=&quot;password&quot; id=&quot;sandi-ulang&quot; name=&quot;password_confirm&quot; minlength=&quot;8&quot; required&gt;
  &lt;/div&gt;

  &lt;button type=&quot;submit&quot;&gt;Simpan Kata Sandi&lt;/button&gt;
&lt;/form&gt;

&lt;script&gt;
  const sandiUtama = document.getElementById(&quot;sandi-utama&quot;);
  const sandiUlang = document.getElementById(&quot;sandi-ulang&quot;);

  function periksaKecocokanSandi() {
    if (sandiUlang.value !== sandiUtama.value) {
      sandiUlang.setCustomValidity(&quot;Konfirmasi kata sandi belum sama dengan kata sandi baru.&quot;);
    } else {
      // Wajib dikosongkan kembali agar status input kembali valid!
      sandiUlang.setCustomValidity(&quot;&quot;);
    }
  }

  sandiUtama.addEventListener(&quot;input&quot;, periksaKecocokanSandi);
  sandiUlang.addEventListener(&quot;input&quot;, periksaKecocokanSandi);
&lt;/script&gt;</pre>
<h2>Kesalahan Umum dan Cara Menghindarinya</h2>
<ol><li><strong>Lupa mereset <code>setCustomValidity(&quot;&quot;)</code> menjadi string kosong:</strong><ul><li><strong>Salah:</strong> Memanggil <code>input.setCustomValidity(&quot;Format salah&quot;)</code> saat gagal, tetapi tidak memanggil <code>input.setCustomValidity(&quot;&quot;)</code> saat pengguna sudah memperbaiki ketikannya. Akibatnya, formulir terkunci selamanya dan tidak pernah bisa dikirim!</li></ul></li><li><strong>Menambahkan <code>novalidate</code> pada <code>&lt;form&gt;</code> tanpa menyediakan pengganti yang aksesibel:</strong><ul><li>Atribut <code>&lt;form novalidate&gt;</code> mematikan gelembung pesan bawaan peramban. Hanya gunakan <code>novalidate</code> jika Anda benar-benar menulis skrip pengganti yang menampilkan pesan galat tekstual di layar dan mengaitkannya ke input dengan <code>aria-invalid=&quot;true&quot;</code> serta <code>aria-describedby</code>.</li></ul></li></ol>
<h2>Latihan Praktik: Formulir Pemesanan Server Cloud dengan Validasi Lengkap</h2>
<p>Buatlah berkas <code>validasi-server.html</code> untuk pemesanan instans VPS:</p>
<ol><li>Kolom <em>Hostname Server</em> (<code>required</code>, panjang 3–15 karakter, hanya boleh huruf kecil, angka, dan tanda hubung <code>-</code>, serta tidak boleh diawali atau diakhiri tanda hubung: <code>pattern=&quot;[a-z0-9]+(-[a-z0-9]+)*&quot;</code>).</li><li>Kolom <em>Jumlah vCPU</em> (<code>type=&quot;number&quot;</code>, minimal <code>2</code>, maksimal <code>64</code>, dan harus kelipatan genap <code>step=&quot;2&quot;</code>).</li><li>Aturan CSS menggunakan <code>:user-invalid</code> dan <code>:user-valid</code> agar warna batas kotak berubah hanya setelah pengguna berinteraksi.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation" rel="noopener">Client-side form validation — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input" rel="noopener"><code>&lt;input&gt;</code>: The HTML Input element — MDN Web Docs</a></li><li><a href="https://html.spec.whatwg.org/multipage/forms.html" rel="noopener">Forms — WHATWG HTML Living Standard</a></li></ul></div>
`,
    perintah: ["pattern","required",":user-invalid",":invalid","title","textarea"],
    kuis: [
        {"tanya":"Apa keunggulan utama pseudo-class CSS :user-invalid dibandingkan :invalid saat menata gaya visual formulir?","opsi":[":user-invalid dapat memvalidasi data langsung ke basis data di server tanpa JavaScript.",":user-invalid baru menerapkan gaya visual salah setelah pengguna berinteraksi dengan kolom input (atau mencoba mengirim formulir), sehingga kolom required tidak langsung menyala merah saat halaman pertama kali dibuka.",":user-invalid secara otomatis memperbaiki kesalahan ketik pada alamat surel.",":user-invalid hanya berlaku untuk elemen <textarea>, sedangkan :invalid berlaku untuk <input>."],"benar":1,"penjelasan":"Pseudo-class :invalid langsung cocok pada setiap elemen <input required> yang masih kosong sejak detik pertama halaman dimuat. :user-invalid menunggu hingga pengguna berinteraksi secara nyata dengan input tersebut, sehingga pengalaman visual menjadi jauh lebih ramah dan tidak mengejutkan pengguna."},
        {"tanya":"Dalam Constraint Validation API, apa yang terjadi jika Anda memanggil inputElemen.setCustomValidity(\"Kode kupon sudah kedaluwarsa\") lalu pengguna mengubah isi input tersebut, tetapi kode JavaScript Anda tidak pernah memanggil inputElemen.setCustomValidity(\"\")?","opsi":["Pesan galat otomatis terhapus begitu pengguna mengetik satu huruf baru.","Elemen input tersebut akan terus dianggap tidak valid (validity.customError === true) dan menghalangi pengiriman formulir sampai setCustomValidity(\"\") dipanggil dengan string kosong.","Peramban akan mengabaikan pesan tersebut setelah 5 detik.","Formulir tetap terkirim tetapi dengan status peringatan."],"benar":1,"penjelasan":"Selama setCustomValidity() berisi string yang tidak kosong, properti validity.customError bernilai true dan elemen dianggap tidak valid. Pengembang wajib memanggil setCustomValidity(\"\") (string kosong) pada event input ketika kondisi galat sudah teratasi."},
        {"tanya":"Anda ingin membuat input harga barang yang hanya menerima nilai minimal 10000, maksimal 1000000, dan wajib berkelipatan 5000. Kombinasi atribut manakah yang tepat?","opsi":["<input type=\"number\" min=\"10000\" max=\"1000000\" step=\"5000\">","<input type=\"text\" minlength=\"10000\" maxlength=\"1000000\" pattern=\"5000\">","<input type=\"number\" start=\"10000\" end=\"1000000\" interval=\"5000\">","<input type=\"range\" value=\"10000-1000000\">"],"benar":0,"penjelasan":"Untuk batasan nilai numerik dan kelipatannya pada type=\"number\" atau type=\"range\", HTML menggunakan atribut min, max, dan step."}
    ]
},
{
    id: 17,
    kategori: "3 · Formulir",
    judul: "Pola Formulir Lanjutan: Atribut form, Token autocomplete, meter, dan progress",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["form","autocomplete","<meter>"],
    ringkas: "Merancang pengalaman formulir tingkat lanjut dengan memanfaatkan token autocomplete spesifik, mengaitkan kontrol di luar elemen <form> menggunakan atribut form=\"id\", membedakan <progress> vs <meter>, serta menggunakan beberapa tombol submit dengan formaction.",
    isi: `
<h2>1. Mempercepat Pengisian Formulir 10x Lipat dengan Token <code>autocomplete</code> Spesifik</h2>
<p>Sebagian besar pengembang hanya tahu <code>autocomplete=&quot;on&quot;</code> atau <code>autocomplete=&quot;off&quot;</code>. Padahal, spesifikasi HTML menyediakan <strong>puluhan token <code>autocomplete</code> standar</strong> yang memberitahu peramban dan pengelola kata sandi (<em>password manager</em>) secara persis data apa yang diminta oleh sebuah kolom input!</p>
<p>Ketika Anda menuliskan token <code>autocomplete</code> yang tepat, pengguna ponsel cukup menyentuh satu kali untuk mengisi nama, alamat, kode pos, atau kata sandi baru secara akurat:</p>
<table><thead><tr><th>Token <code>autocomplete</code></th><th>Gunakan Pada Kolom Input</th></tr></thead><tbody><tr><td><code>name</code></td><td>Nama lengkap pengguna (atau gunakan <code>given-name</code> dan <code>family-name</code> jika dipisah).</td></tr><tr><td><code>username</code></td><td>Nama pengguna atau surel yang dipakai untuk masuk (<em>login</em>).</td></tr><tr><td><code>email</code></td><td>Alamat surat elektronik.</td></tr><tr><td><strong><code>current-password</code></strong></td><td>Kata sandi saat ini pada <strong>halaman Masuk (Login)</strong> atau konfirmasi ubah sandi.</td></tr><tr><td><strong><code>new-password</code></strong></td><td>Kata sandi baru pada <strong>halaman Daftar Akun Baru</strong> atau <strong>Ganti Kata Sandi</strong> (memicu peramban menawarkan pembuatan kata sandi acak yang kuat!).</td></tr><tr><td><strong><code>one-time-code</code></strong></td><td>Kode verifikasi OTP 6 digit yang dikirim lewat SMS/autentikator.</td></tr><tr><td><code>tel</code></td><td>Nomor telepon lengkap dengan kode negara.</td></tr><tr><td><code>organization</code></td><td>Nama perusahaan, kampus, atau instansi.</td></tr><tr><td><code>street-address</code> / <code>postal-code</code> / <code>country</code></td><td>Alamat jalan, kode pos, dan kode negara.</td></tr><tr><td><code>cc-name</code> / <code>cc-number</code> / <code>cc-exp</code> / <code>cc-csc</code></td><td>Informasi kartu pembayaran.</td></tr></tbody></table>
<pre>&lt;!-- Contoh Formulir Ganti Kata Sandi yang Ramah Password Manager --&gt;
&lt;form action=&quot;/akun/ubah-sandi&quot; method=&quot;post&quot;&gt;
  &lt;!-- Menyertakan username tersembunyi membantu Password Manager mengenali akun mana yang sedang diubah sandinya --&gt;
  &lt;input type=&quot;text&quot; name=&quot;username&quot; value=&quot;nadia@asadinedu.com&quot; autocomplete=&quot;username&quot; hidden&gt;

  &lt;div&gt;
    &lt;label for=&quot;sandi-lama&quot;&gt;Kata Sandi Saat Ini&lt;/label&gt;
    &lt;input type=&quot;password&quot; id=&quot;sandi-lama&quot; name=&quot;old_password&quot; autocomplete=&quot;current-password&quot; required&gt;
  &lt;/div&gt;

  &lt;div&gt;
    &lt;label for=&quot;sandi-baru&quot;&gt;Kata Sandi Baru&lt;/label&gt;
    &lt;input type=&quot;password&quot; id=&quot;sandi-baru&quot; name=&quot;new_password&quot; autocomplete=&quot;new-password&quot; minlength=&quot;12&quot; required&gt;
  &lt;/div&gt;

  &lt;button type=&quot;submit&quot;&gt;Perbarui Kata Sandi&lt;/button&gt;
&lt;/form&gt;</pre>
<h2>2. Mengaitkan Input atau Tombol di Luar <code>&lt;form&gt;</code> dengan Atribut <code>form=&quot;...&quot;</code></h2>
<p>Terkadang tuntutan tata letak antarmuka (misalnya tombol <em>&quot;Simpan Perubahan&quot;</em> berada di pojok kanan atas bilah <code>&lt;header&gt;</code> atau di kaki modal <code>&lt;dialog&gt;</code>, sedangkan elemen <code>&lt;form&gt;</code> berada di tengah halaman) membuat Anda tidak bisa meletakkan <code>&lt;button type=&quot;submit&quot;&gt;</code> sebagai anak langsung di dalam <code>&lt;form&gt;</code>.</p>
<p>Jangan menulis kode JavaScript rumit hanya untuk memanggil <code>form.submit()</code>! Gunakan atribut HTML <strong><code>form=&quot;id-formulir&quot;</code></strong> pada <code>&lt;input&gt;</code>, <code>&lt;select&gt;</code>, <code>&lt;textarea&gt;</code>, atau <code>&lt;button&gt;</code>:</p>
<pre>&lt;header&gt;
  &lt;h1&gt;Edit Artikel Modul&lt;/h1&gt;
  &lt;!-- Tombol ini berada di luar &lt;form&gt;, tetapi tetap mengirim #form-artikel dengan validasi penuh! --&gt;
  &lt;button type=&quot;submit&quot; form=&quot;form-artikel&quot;&gt;Simpan dan Terbitkan&lt;/button&gt;
&lt;/header&gt;

&lt;main&gt;
  &lt;form id=&quot;form-artikel&quot; action=&quot;/artikel/simpan&quot; method=&quot;post&quot;&gt;
    &lt;label for=&quot;judul-artikel&quot;&gt;Judul Artikel&lt;/label&gt;
    &lt;input type=&quot;text&quot; id=&quot;judul-artikel&quot; name=&quot;judul&quot; required&gt;
  &lt;/form&gt;
&lt;/main&gt;</pre>
<h2>3. Satu Formulir dengan Dua Tujuan Berbeda (<code>formaction</code> &amp; <code>formnovalidate</code>)</h2>
<p>Bagaimana jika sebuah formulir penulisan artikel memiliki dua tombol:</p>
<ol><li><strong>&quot;Terbitkan Artikel&quot;</strong>: Mengirim ke <code>/artikel/terbitkan</code> dan <strong>wajib</strong> lulus seluruh validasi (<code>required</code>, <code>minlength</code>).</li><li><strong>&quot;Simpan sebagai Draf&quot;</strong>: Mengirim ke <code>/artikel/simpan-draf</code> dan <strong>boleh</strong> disimpan meskipun artikel belum selesai ditulis (melewati validasi <code>required</code>)!</li></ol>
<p>Anda dapat menempelkan atribut <strong><code>formaction</code></strong> dan <strong><code>formnovalidate</code></strong> langsung pada tombol kedua:</p>
<pre>&lt;form action=&quot;/artikel/terbitkan&quot; method=&quot;post&quot;&gt;
  &lt;label for=&quot;isi-artikel&quot;&gt;Isi Materi (Minimal 500 karakter untuk diterbitkan)&lt;/label&gt;
  &lt;textarea id=&quot;isi-artikel&quot; name=&quot;isi&quot; minlength=&quot;500&quot; required&gt;&lt;/textarea&gt;

  &lt;div class=&quot;aksi-form&quot;&gt;
    &lt;!-- Tombol 1: Melewati validasi required/minlength dan mengirim ke endpoint draf --&gt;
    &lt;button
      type=&quot;submit&quot;
      formaction=&quot;/artikel/simpan-draf&quot;
      formnovalidate
    &gt;
      Simpan sebagai Draf Sementara
    &lt;/button&gt;

    &lt;!-- Tombol 2: Menjalankan validasi penuh dan mengirim ke /artikel/terbitkan --&gt;
    &lt;button type=&quot;submit&quot;&gt;Terbitkan Sekarang&lt;/button&gt;
  &lt;/div&gt;
&lt;/form&gt;</pre>
<h2>4. Membedakan <code>&lt;progress&gt;</code> vs <code>&lt;meter&gt;</code></h2>
<p>HTML memiliki dua elemen batang visual yang sering tertukar fungsinya:</p>
<ol><li><strong><code>&lt;progress&gt;</code> (Batang Kemajuan Tugas):</strong> Digunakan untuk menunjukkan <strong>seberapa jauh suatu proses sedang berjalan menuju 100% selesai</strong> (misalnya progres mengunggah berkas atau progres menyelesaikan 8 dari 20 modul kelas). Jika atribut <code>value</code> tidak ditulis (<code>&lt;progress&gt;Memuat...&lt;/progress&gt;</code>), ia tampil dalam mode <em>indeterminate</em> (bergerak bolak-balik menandakan proses sedang berlangsung namun persentasenya belum diketahui).</li><li><strong><code>&lt;meter&gt;</code> (Alat Ukur Skalar / Gauge):</strong> Digunakan untuk menampilkan <strong>ukuran nilai di dalam rentang yang diketahui dan memiliki ambang batas baik/waspada/kritis</strong>—seperti kapasitas pemakaian diska server, kekuatan kata sandi, atau suhu CPU! <code>&lt;meter&gt;</code> mendukung atribut <code>min</code>, <code>max</code>, <code>low</code>, <code>high</code>, dan <code>optimum</code> sehingga peramban otomatis mengubah warnanya menjadi hijau, kuning, atau merah!</li></ol>
<pre>&lt;!-- 1. &lt;progress&gt;: Kemajuan menyelesaikan bab kelas --&gt;
&lt;div&gt;
  &lt;label for=&quot;progres-belajar&quot;&gt;Kemajuan Kelas HTML:&lt;/label&gt;
  &lt;progress id=&quot;progres-belajar&quot; value=&quot;18&quot; max=&quot;20&quot;&gt;90% (18 dari 20 modul)&lt;/progress&gt;
&lt;/div&gt;

&lt;!-- 2. &lt;meter&gt;: Penggunaan diska server dengan ambang batas aman (optimum &lt; low &lt; high) --&gt;
&lt;div&gt;
  &lt;label for=&quot;pemakaian-diska&quot;&gt;Ruang Penyimpanan Server (/dev/sda1):&lt;/label&gt;
  &lt;meter
    id=&quot;pemakaian-diska&quot;
    min=&quot;0&quot;
    max=&quot;100&quot;
    low=&quot;70&quot;
    high=&quot;90&quot;
    optimum=&quot;20&quot;
    value=&quot;92&quot;
  &gt;
    92% terpakai (Kritis)
  &lt;/meter&gt;
&lt;/div&gt;</pre>
<h2>Latihan Praktik: Antarmuka Editor Modul dengan Simpan Draf dan Indikator Kuota</h2>
<p>Buatlah berkas <code>form-lanjutan.html</code>:</p>
<ol><li>Buat <code>&lt;form id=&quot;editor-modul&quot; action=&quot;/modul/terbitkan&quot; method=&quot;post&quot;&gt;</code> dengan input judul dan isi.</li><li>Letakkan tombol <em>&quot;Terbitkan&quot;</em> dan tombol <em>&quot;Simpan Draf&quot;</em> (<code>formaction=&quot;/modul/draf&quot; formnovalidate</code>) di luar tag <code>&lt;form&gt;</code> (di dalam <code>&lt;header&gt;</code>) dengan mengaitkannya menggunakan atribut <code>form=&quot;editor-modul&quot;</code>.</li><li>Tampilkan indikator kelengkapan belajar dengan <code>&lt;progress&gt;</code> dan indikator pemakaian kuota penyimpanan dengan <code>&lt;meter&gt;</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://html.spec.whatwg.org/multipage/forms.html" rel="noopener">Forms — WHATWG HTML Living Standard</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input" rel="noopener"><code>&lt;input&gt;</code>: The HTML Input element (<code>autocomplete</code>) — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements" rel="noopener">HTML elements reference (<code>&lt;meter&gt;</code>, <code>&lt;progress&gt;</code>) — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["autocomplete","<form>","<meter>","<progress>","<header>","formaction"],
    kuis: [
        {"tanya":"Nilai atribut autocomplete manakah yang harus dipasang pada kolom input kata sandi di halaman Pendaftaran Akun Baru agar peramban tidak salah mengisinya dengan kata sandi lama dan justru menawarkan pembuatan kata sandi acak yang kuat?","opsi":["autocomplete=\"off\"","autocomplete=\"current-password\"","autocomplete=\"new-password\"","autocomplete=\"one-time-code\""],"benar":2,"penjelasan":"Token autocomplete=\"new-password\" secara spesifik memberi tahu pengelola kata sandi peramban bahwa pengguna sedang membuat kata sandi baru (baik saat registrasi maupun saat mereset kata sandi), bukan sedang login (current-password)."},
        {"tanya":"Bagaimana cara membuat sebuah <button type=\"submit\"> yang berada di dalam <header> (di luar elemen <form id=\"form-utama\">) tetap dapat mengirimkan formulir tersebut beserta seluruh validasi bawaannya tanpa menggunakan JavaScript?","opsi":["Menambahkan atribut target=\"form-utama\" pada tombol tersebut.","Menambahkan atribut form=\"form-utama\" pada tombol tersebut.","Menambahkan atribut for=\"form-utama\" pada tombol tersebut.","Tidak mungkin dilakukan tanpa document.getElementById('form-utama').submit()."],"benar":1,"penjelasan":"Atribut form=\"id_form\" pada elemen kontrol formulir (<button>, <input>, <select>, <textarea>) mengaitkan kontrol tersebut secara resmi ke elemen <form> yang memiliki id yang sesuai meskipun posisinya berada di luar pohon DOM <form>."},
        {"tanya":"Kapan Anda harus memilih elemen <meter> dibandingkan elemen <progress>?","opsi":["Ketika menampilkan persentase unduhan berkas yang sedang berjalan dari 0% menuju 100%.","Ketika menampilkan nilai pengukuran dalam suatu rentang terukur yang memiliki batas rendah/tinggi/optimal (seperti persentase pemakaian RAM server, sisa kapasitas baterai, atau tingkat kekuatan kata sandi), bukan kemajuan penyelesaian suatu tugas.","Ketika waktu selesainya proses belum diketahui (indeterminate).","Ketika ingin membuat tombol penggeser (slider) yang bisa digeser oleh pengguna."],"benar":1,"penjelasan":"<progress> mewakili kemajuan penyelesaian suatu tugas (task completion), sedangkan <meter> mewakili pengukuran skalar dalam rentang yang diketahui (gauge) lengkap dengan dukungan nilai low, high, dan optimum."}
    ]
},
{
    id: 18,
    kategori: "3 · Formulir",
    judul: "Atribut Global Interaktif: contenteditable, spellcheck, autocapitalize, enterkeyhint, dan draggable",
    tingkat: "Menengah", durasi: "8 mnt",
    tag: ["contenteditable","spellcheck","autocapitalize"],
    ringkas: "Mengoptimalkan ergonomi papan ketik seluler dan penyuntingan langsung menggunakan atribut global contenteditable=\"plaintext-only\", enterkeyhint, inputmode, autocapitalize, spellcheck, dan draggable.",
    isi: `
<h2>1. Ergonomi Papan Ketik Layar Sentuh: <code>inputmode</code>, <code>enterkeyhint</code>, dan <code>autocapitalize</code></h2>
<p>Lebih dari separuh trafik web berasal dari ponsel pintar. Dengan menambahkan tiga atribut global ini pada elemen input atau editor Anda, pengalaman mengetik pengguna di Android dan iOS meningkat drastis:</p>
<h3>A. <code>enterkeyhint</code>: Mengubah Label Tombol Enter di Papan Ketik Ponsel</h3>
<p>Tahukah Anda bahwa Anda bisa mengubah tulisan dan ikon tombol <code>Enter</code> di pojok kanan bawah papan ketik ponsel menjadi <strong>&quot;Cari&quot; (🔍)</strong>, <strong>&quot;Kirim&quot;</strong>, <strong>&quot;Berikutnya&quot;</strong>, atau <strong>&quot;Selesai&quot;</strong>?</p>
<table><thead><tr><th>Nilai <code>enterkeyhint</code></th><th>Tampilan Tombol Enter di Ponsel</th><th>Gunakan Pada</th></tr></thead><tbody><tr><td><code>search</code></td><td>Ikon Kaca Pembesar / &quot;Cari&quot;</td><td>Kotak pencarian (<code>&lt;input type=&quot;search&quot;&gt;</code>).</td></tr><tr><td><code>send</code></td><td>&quot;Kirim&quot; / Ikon Pesawat Kertas</td><td>Kotak ketik pesan obrolan (<em>chat</em>) atau komentar cepat.</td></tr><tr><td><code>next</code></td><td>&quot;Berikutnya&quot; (→)</td><td>Kolom formulir yang masih memiliki kolom lanjutan di bawahnya.</td></tr><tr><td><code>done</code></td><td>&quot;Selesai&quot; (✓)</td><td>Kolom terakhir pada formulir.</td></tr><tr><td><code>go</code></td><td>&quot;Buka&quot; / &quot;Masuk&quot;</td><td>Bilah alamat URL atau input kode akses langsung.</td></tr></tbody></table>
<h3>B. <code>autocapitalize</code> dan <code>spellcheck</code></h3>
<p>Pada ponsel pintar, papan ketik secara bawaan selalu mengubah huruf pertama yang diketik menjadi huruf kapital (<code>autocapitalize=&quot;sentences&quot;</code>), serta menggarisbawahi kata yang tidak ada di kamus (<code>spellcheck=&quot;true&quot;</code>). Perilaku ini <strong>sangat mengganggu</strong> ketika pengguna sedang mengetik <strong>nama pengguna (<code>username</code>), kode perintah terminal, alamat server, atau kode kupon</strong>!</p>
<pre>&lt;!-- Mematikan kapitalisasi otomatis dan pemeriksa ejaan kamus untuk input teknis --&gt;
&lt;label for=&quot;input-perintah&quot;&gt;Ketik Perintah Shell Linux&lt;/label&gt;
&lt;input
  type=&quot;text&quot;
  id=&quot;input-perintah&quot;
  name=&quot;command&quot;
  autocapitalize=&quot;none&quot;
  autocomplete=&quot;off&quot;
  spellcheck=&quot;false&quot;
  enterkeyhint=&quot;send&quot;
&gt;</pre>
<h2>2. Penyuntingan Langsung di Tempat dengan <code>contenteditable</code></h2>
<p>Atribut global <strong><code>contenteditable</code></strong> mengubah elemen HTML biasa (seperti <code>&lt;div&gt;</code>, <code>&lt;p&gt;</code>, atau <code>&lt;td&gt;</code>) menjadi area yang teksnya dapat langsung disunting oleh pengguna:</p>
<ul><li><strong><code>contenteditable=&quot;true&quot;</code>:</strong> Mengizinkan penyuntingan kaya (<em>rich text</em>). Namun, kelemahan besarnya adalah ketika pengguna menyalin-tempel (<em>paste</em>) teks dari situs lain atau Microsoft Word, peramban ikut menyisipkan puluhan tag <code>&lt;span style=&quot;font-family: Comic Sans...&quot;&gt;</code> yang mengotori DOM Anda!</li><li><strong><code>contenteditable=&quot;plaintext-only&quot;</code> (Baseline Newly Available sejak Maret 2025, ketika Firefox ikut mendukungnya di semua peramban utama):</strong> Mengizinkan penyuntingan teks murni saja! Ketika pengguna melakukan <em>paste</em>, seluruh pemformatan HTML luar otomatis dibuang dan hanya teks bersih yang masuk!</li></ul>
<pre>&lt;div
  class=&quot;catatan-cepat&quot;
  contenteditable=&quot;plaintext-only&quot;
  role=&quot;textbox&quot;
  aria-multiline=&quot;true&quot;
  aria-label=&quot;Catatan pribadi modul ini&quot;
  spellcheck=&quot;true&quot;
&gt;Ketik catatan belajar Anda langsung di sini...&lt;/div&gt;</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Catatan Aksesibilitas untuk <code>contenteditable</code></div><p>Jika Anda benar-benar hanya membutuhkan kotak masukan teks multi-baris, <strong>selalu utamakan <code>&lt;textarea&gt;</code> asli</strong> (karena sudah mendukung pengiriman <code>&lt;form&gt;</code>, atribut <code>name</code>, dan dikenali semua pembaca layar). Gunakan <code>contenteditable=&quot;plaintext-only&quot;</code> hanya untuk komponen khusus yang membutuhkan penyuntingan langsung di dalam struktur kartu/tabel, dan selalu tambahkan <code>role=&quot;textbox&quot;</code> serta <code>aria-label</code>!</p></div>
<h2>3. Atribut <code>draggable=&quot;true&quot;</code> untuk <em>Drag and Drop</em></h2>
<p>Secara bawaan di HTML, hanya gambar (<code>&lt;img&gt;</code>) dan tautan (<code>&lt;a href=&quot;...&quot;&gt;</code>) yang dapat diseret dengan tetikus. Untuk membuat kartu papan tugas (<em>Kanban board</em>) dapat diseret menggunakan HTML Drag and Drop API, tambahkan atribut <strong><code>draggable=&quot;true&quot;</code></strong> (dan jangan lupa sediakan tombol alternatif atas/bawah bagi pengguna papan ketik!).</p>
<h2>Latihan Praktik: Antarmuka Chat Teknis &amp; Editor Catatan Bersih</h2>
<p>Buatlah berkas <code>interaksi-global.html</code>:</p>
<ol><li>Buat kotak input perintah terminal dengan <code>autocapitalize=&quot;none&quot;</code>, <code>spellcheck=&quot;false&quot;</code>, dan <code>enterkeyhint=&quot;send&quot;</code>.</li><li>Buat kotak catatan cepat dengan <code>contenteditable=&quot;plaintext-only&quot;</code>, <code>role=&quot;textbox&quot;</code>, dan <code>aria-label</code>. Uji dengan menyalin teks berwarna/tebal dari halaman web lain ke dalamnya untuk membuktikan bahwa hanya teks murni yang tertempel!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes" rel="noopener">Global attributes (contenteditable, enterkeyhint, autocapitalize, spellcheck) — MDN Web Docs</a></li><li><a href="https://html.spec.whatwg.org/multipage/interaction.html" rel="noopener">User interaction — WHATWG HTML Living Standard</a></li></ul></div>
`,
    perintah: ["enterkeyhint","contenteditable","contenteditable=\"plaintext-only\"","autocapitalize","role=\"textbox\"","aria-label"],
    kuis: [
        {"tanya":"Apa keunggulan utama menggunakan contenteditable=\"plaintext-only\" dibandingkan contenteditable=\"true\"?","opsi":["plaintext-only hanya mengizinkan angka","plaintext-only mencegah masuknya tag HTML dan gaya inline yang tidak diinginkan ketika pengguna menempelkan (paste) teks dari sumber lain, sehingga hanya teks murni yang disisipkan","plaintext-only otomatis menyimpan teks ke server","contenteditable=\"true\" sudah tidak didukung lagi oleh peramban"],"benar":1,"penjelasan":"Nilai plaintext-only (kini didukung lintas peramban utama) menyederhanakan pembuatan editor teks di tempat dengan menolak penyisipan markup HTML kaya saat pengguna melakukan copy-paste atau menekan pintasan tebal/miring."},
        {"tanya":"Mengapa pada kolom input Username atau Hostname Server kita sangat disarankan memasang autocapitalize=\"none\" dan spellcheck=\"false\"?","opsi":["Agar input tersebut tidak bisa dikosongkan","Untuk mencegah papan ketik layar sentuh ponsel mengubah huruf pertama menjadi huruf besar secara otomatis dan mencegah kamus ejaan mengubah/menggarisbawahi nama teknis pengguna","Untuk menyembunyikan karakter seperti kolom kata sandi","Agar papan ketik hanya menampilkan angka"],"benar":1,"penjelasan":"Papan ketik perangkat seluler secara bawaan mengaktifkan kapitalisasi huruf pertama kalimat dan koreksi ejaan kamus, yang sangat mengganggu saat pengguna mengetik identifier teknis berhuruf kecil seperti server-prod-01."},
        {"tanya":"Atribut global apakah yang mengubah label atau ikon tombol Enter pada papan ketik virtual ponsel menjadi tombol \"Cari\" atau \"Kirim\"?","opsi":["inputmode","enterkeyhint","accesskey","tabindex"],"benar":1,"penjelasan":"Atribut global enterkeyhint (dengan nilai search, send, next, done, go, previous, enter) menyesuaikan tampilan visual tombol aksi pada papan ketik virtual perangkat layar sentuh."}
    ]
},
{
    id: 19,
    kategori: "4 · Elemen Interaktif",
    judul: "Elemen Interaktif Bawaan: details, dialog, Popover API, dan template",
    tingkat: "Menengah", durasi: "11 mnt",
    tag: ["<details>","<dialog>","<template>"],
    ringkas: "Membangun komponen antarmuka interaktif seperti akordeon, jendela dialog modal, dan panel sembul (popover) menggunakan kemampuan bawaan HTML modern tanpa ketergantungan pustaka JavaScript yang berat.",
    isi: `
<h2>Revolusi Komponen Interaktif Bawaan HTML</h2>
<p>Selama bertahun-tahun, membuat akordeon tanya-jawab, jendela modal (<em>modal dialog</em>), atau menu sembul (<em>tooltip/popover</em>) mengharuskan pengembang memasang pustaka JavaScript pihak ketiga yang rumit. Masalahnya, membuat komponen tersebut dari tumpukan <code>&lt;div&gt;</code> sangat sulit dilakukan dengan benar: Anda harus mengunci fokus tombol <code>Tab</code> di dalam modal (<em>focus trapping</em>), menangani tombol <code>Esc</code>, menonaktifkan latar belakang, mengatur tumpukan <code>z-index</code>, dan memasang belasan atribut ARIA.</p>
<p>Kini, spesifikasi HTML modern menyediakan elemen dan atribut bawaan yang menyelesaikan seluruh kerumitan tersebut langsung di tingkat mesin peramban!</p>
<h2>1. Akordeon Murni HTML dengan <code>&lt;details&gt;</code> dan <code>&lt;summary&gt;</code></h2>
<p>Elemen <code>&lt;details&gt;</code> dan <code>&lt;summary&gt;</code> (status <strong>Baseline Widely Available</strong>) menciptakan komponen buka-tutup (<em>disclosure widget</em>) tanpa memerlukan satu baris JavaScript pun:</p>
<pre>&lt;details&gt;
  &lt;summary&gt;Bagaimana cara menjalankan kueri SQL dengan aman di PHP?&lt;/summary&gt;
  &lt;p&gt;
    Gunakan &lt;strong&gt;Prepared Statements&lt;/strong&gt; melalui ekstensi PDO (&lt;code&gt;$pdo-&amp;gt;prepare()&lt;/code&gt;)
    agar parameter masukan pengguna tidak pernah ditafsirkan sebagai perintah SQL.
  &lt;/p&gt;
&lt;/details&gt;</pre>
<h3>Akordeon Eksklusif dengan Atribut <code>name</code></h3>
<p>Sejak September 2024 (status <strong>Baseline Newly Available</strong>; Chrome sudah mendukungnya sejak Desember 2023), Anda dapat memberikan nilai atribut <code>name</code> yang sama pada beberapa elemen <code>&lt;details&gt;</code>. Ketika pengguna membuka salah satu <code>&lt;details&gt;</code>, elemen <code>&lt;details&gt;</code> lain yang memiliki <code>name</code> yang sama akan <strong>otomatis tertutup</strong>—menciptakan perilaku akordeon eksklusif murni dengan HTML:</p>
<pre>&lt;section aria-labelledby=&quot;judul-faq&quot;&gt;
  &lt;h2 id=&quot;judul-faq&quot;&gt;Pertanyaan yang Sering Diajukan&lt;/h2&gt;

  &lt;details name=&quot;faq-kodeloka&quot; open&gt;
    &lt;summary&gt;Apakah semua kelas di Kodeloka gratis?&lt;/summary&gt;
    &lt;p&gt;Ya, seluruh kelas, latihan, dan kuis dapat diakses gratis tanpa perlu membuat akun.&lt;/p&gt;
  &lt;/details&gt;

  &lt;details name=&quot;faq-kodeloka&quot;&gt;
    &lt;summary&gt;Di mana progres belajar saya disimpan?&lt;/summary&gt;
    &lt;p&gt;Progres, penanda modul, dan catatan Anda disimpan secara lokal di &lt;code&gt;localStorage&lt;/code&gt; peramban Anda.&lt;/p&gt;
  &lt;/details&gt;

  &lt;details name=&quot;faq-kodeloka&quot;&gt;
    &lt;summary&gt;Urutan kelas apa yang disarankan untuk pemula?&lt;/summary&gt;
    &lt;p&gt;Mulailah dari HTML, dilanjutkan dengan CSS, JavaScript, lalu PHP dan PostgreSQL.&lt;/p&gt;
  &lt;/details&gt;
&lt;/section&gt;</pre>
<h2>2. Jendela Modal yang Aksesibel dengan <code>&lt;dialog&gt;</code></h2>
<p>Elemen <code>&lt;dialog&gt;</code> (tersedia lintas peramban sejak Maret 2022 dan berstatus <strong>Baseline Widely Available</strong> sejak September 2024) adalah cara standar untuk membuat jendela dialog, baik <strong>modal</strong> (memblokir interaksi dengan halaman di belakangnya) maupun <strong>non-modal</strong>.</p>
<p>Ketika Anda membuka <code>&lt;dialog&gt;</code> menggunakan metode <strong><code>dialog.showModal()</code></strong>, peramban secara otomatis melakukan lima hal penting untuk Anda:</p>
<ol><li>Merender dialog di dalam <strong>Top Layer</strong> (lapisan khusus paling atas di atas seluruh dokumen, sehingga tidak akan pernah tertutup oleh elemen lain meskipun ada <code>z-index: 999999</code> atau <code>overflow: hidden</code> pada elemen induk!).</li><li>Membuat seluruh halaman di luar <code>&lt;dialog&gt;</code> menjadi <strong>inert</strong> (tidak bisa diklik dan fokus tombol <code>Tab</code> terkunci hanya berputar di dalam dialog).</li><li>Memindahkan fokus papan ketik langsung ke elemen fokusabel pertama di dalam <code>&lt;dialog&gt;</code> (atau elemen yang diberi atribut <code>autofocus</code>).</li><li>Menyediakan pseudo-element CSS <strong><code>::backdrop</code></strong> untuk menggelapkan atau memburamkan latar belakang halaman.</li><li>Menutup dialog secara otomatis ketika pengguna menekan tombol <strong><code>Esc</code></strong> di papan ketik, atau ketika <code>&lt;form method=&quot;dialog&quot;&gt;</code> di dalamnya dikirimkan.</li></ol>
<pre>&lt;button type=&quot;button&quot; id=&quot;buka-konfirmasi&quot;&gt;Hapus Proyek&lt;/button&gt;

&lt;dialog id=&quot;dialog-hapus&quot; aria-labelledby=&quot;judul-dialog&quot;&gt;
  &lt;h2 id=&quot;judul-dialog&quot;&gt;Konfirmasi Penghapusan Proyek&lt;/h2&gt;
  &lt;p&gt;Apakah Anda yakin ingin menghapus proyek &lt;strong&gt;kodeloka-api&lt;/strong&gt;? Tindakan ini tidak dapat dibatalkan.&lt;/p&gt;

  &lt;!-- Formulir dengan method=&quot;dialog&quot; otomatis menutup &lt;dialog&gt; saat tombol ditekan --&gt;
  &lt;form method=&quot;dialog&quot;&gt;
    &lt;button value=&quot;batal&quot; autofocus&gt;Batal&lt;/button&gt;
    &lt;button value=&quot;hapus&quot; class=&quot;tombol-bahaya&quot;&gt;Ya, Hapus Permanen&lt;/button&gt;
  &lt;/form&gt;
&lt;/dialog&gt;

&lt;output id=&quot;status-aksi&quot;&gt;&lt;/output&gt;

&lt;script&gt;
  const tombolBuka = document.getElementById(&quot;buka-konfirmasi&quot;);
  const dialogHapus = document.getElementById(&quot;dialog-hapus&quot;);
  const statusAksi = document.getElementById(&quot;status-aksi&quot;);

  tombolBuka.addEventListener(&quot;click&quot;, () =&gt; {
    dialogHapus.showModal();
  });

  dialogHapus.addEventListener(&quot;close&quot;, () =&gt; {
    if (dialogHapus.returnValue === &quot;hapus&quot;) {
      statusAksi.textContent = &quot;Proyek berhasil dihapus.&quot;;
    } else {
      statusAksi.textContent = &quot;Penghapusan dibatalkan.&quot;;
    }
  });
&lt;/script&gt;</pre>
<pre>/* Menata tampilan latar belakang modal &lt;dialog&gt; */
dialog::backdrop {
  background-color: rgb(15 23 42 / 0.6);
  backdrop-filter: blur(3px);
}</pre>
<div class="callout info"><div class="callout-judul">💡 Fitur Terbaru pada <code>&lt;dialog&gt;</code> (Progresif)</div><p>Peramban terbaru mulai mendukung atribut deklaratif <strong>Invoker Commands API</strong> (<code>&lt;button command=&quot;show-modal&quot; commandfor=&quot;dialog-hapus&quot;&gt;</code>) serta atribut <strong><code>closedby=&quot;any&quot;</code></strong> pada <code>&lt;dialog&gt;</code> (untuk mengaktifkan penutupan saat mengeklik area luar / <em>light dismiss</em>; didukung di Chrome 134+ dan Firefox 141+, namun belum tersedia di Safari iOS sehingga gunakan sebagai <em>progressive enhancement</em>).</p></div>
<h2>3. Panel Sembul Deklaratif dengan Popover API (<code>popover</code>)</h2>
<p>Bagaimana jika Anda ingin membuat panel notifikasi, menu profil, atau petunjuk singkat yang <strong>tidak</strong> memblokir halaman (<em>non-modal</em>), tampil di <em>Top Layer</em>, dan otomatis tertutup saat pengguna mengeklik di luar panel (<em>light dismiss</em>) tanpa menulis JavaScript?</p>
<p>Gunakan <strong>Popover API</strong> (status <strong>Baseline Newly Available</strong> sejak Januari 2025 di Chrome, Edge, Firefox, dan Safari):</p>
<ol><li>Tambahkan atribut global <strong><code>popover</code></strong> (bawaannya bernilai <code>popover=&quot;auto&quot;</code>) beserta <code>id</code> pada elemen panel yang ingin ditampilkan.</li><li>Tambahkan atribut <strong><code>popovertarget=&quot;id-panel&quot;</code></strong> pada elemen <code>&lt;button&gt;</code> pemicunya!</li></ol>
<pre>&lt;!-- Tombol pemicu: tanpa satu baris pun kode JavaScript! --&gt;
&lt;button type=&quot;button&quot; popovertarget=&quot;panel-pintasan&quot;&gt;
  Pintasan Papan Ketik (?)
&lt;/button&gt;

&lt;!-- Elemen Popover: otomatis tersembunyi sampai tombol ditekan,
     muncul di Top Layer, dan tertutup saat klik di luar atau tekan Esc --&gt;
&lt;div id=&quot;panel-pintasan&quot; popover&gt;
  &lt;h3&gt;Pintasan Kelas Kodeloka&lt;/h3&gt;
  &lt;ul&gt;
    &lt;li&gt;&lt;kbd&gt;/&lt;/kbd&gt; — Fokus ke kotak pencarian&lt;/li&gt;
    &lt;li&gt;&lt;kbd&gt;Alt&lt;/kbd&gt; + &lt;kbd&gt;←&lt;/kbd&gt; / &lt;kbd&gt;→&lt;/kbd&gt; — Pindah modul&lt;/li&gt;
    &lt;li&gt;&lt;kbd&gt;Esc&lt;/kbd&gt; — Tutup panel ini&lt;/li&gt;
  &lt;/ul&gt;
  &lt;button type=&quot;button&quot; popovertarget=&quot;panel-pintasan&quot; popovertargetaction=&quot;hide&quot;&gt;
    Tutup
  &lt;/button&gt;
&lt;/div&gt;</pre>
<h3>Kapan Memilih <code>&lt;dialog&gt;</code> vs <code>popover</code>?</h3>
<ul><li>Gunakan <strong><code>&lt;dialog&gt;</code> dengan <code>showModal()</code></strong> jika pengguna <strong>wajib mengambil keputusan</strong> sebelum melanjutkan interaksi dengan halaman (misalnya konfirmasi hapus data, formulir masuk, atau peringatan kritis) karena halaman belakang harus dibuat <em>inert</em>.</li><li>Gunakan <strong><code>popover</code></strong> untuk panel tambahan yang bersifat <strong>non-modal</strong> (misalnya menu tarik-turun navigasi, daftar notifikasi, pemilih warna, atau kotak bantuan) di mana halaman di sekitarnya tetap boleh berinteraksi.</li></ul>
<h2>4. Cetakan DOM Inert dengan <code>&lt;template&gt;</code></h2>
<p>Elemen <code>&lt;template&gt;</code> digunakan untuk menyimpan fragmen markup HTML yang <strong>tidak dirender</strong> oleh peramban saat halaman dimuat (gambar di dalamnya tidak diunduh dan skrip tidak dijalankan), tetapi siap digandakan (<em>clone</em>) kapan saja menggunakan JavaScript:</p>
<pre>&lt;ul id=&quot;daftar-modul&quot;&gt;&lt;/ul&gt;

&lt;template id=&quot;cetakan-baris-modul&quot;&gt;
  &lt;li class=&quot;item-modul&quot;&gt;
    &lt;span class=&quot;judul-modul&quot;&gt;&lt;/span&gt;
    &lt;span class=&quot;lencana-tingkat&quot;&gt;&lt;/span&gt;
  &lt;/li&gt;
&lt;/template&gt;

&lt;script&gt;
  const daftar = document.getElementById(&quot;daftar-modul&quot;);
  const cetakan = document.getElementById(&quot;cetakan-baris-modul&quot;);

  const data = [
    { judul: &quot;01. Cara Web Bekerja&quot;, tingkat: &quot;Dasar&quot; },
    { judul: &quot;12. Elemen Interaktif Bawaan&quot;, tingkat: &quot;Menengah&quot; }
  ];

  for (const item of data) {
    const salinan = cetakan.content.cloneNode(true);
    salinan.querySelector(&quot;.judul-modul&quot;).textContent = item.judul;
    salinan.querySelector(&quot;.lencana-tingkat&quot;).textContent = item.tingkat;
    daftar.appendChild(salinan);
  }
&lt;/script&gt;</pre>
<h2>Kesalahan Umum dan Cara Menghindarinya</h2>
<ol><li><strong>Membuka <code>&lt;dialog&gt;</code> modal hanya dengan menambahkan atribut <code>open</code> di HTML:</strong><ul><li><strong>Salah:</strong> Menulis <code>&lt;dialog open&gt;</code> atau <code>dialog.setAttribute(&quot;open&quot;, &quot;&quot;)</code> untuk dialog yang seharusnya modal. Cara ini hanya membuka dialog secara <em>non-modal</em>: latar belakang tidak terkunci (<em>inert</em>), <code>::backdrop</code> tidak muncul, dan tombol <code>Esc</code> tidak berfungsi!</li><li><strong>Benar:</strong> Selalu panggil metode JavaScript <code>dialog.showModal()</code> untuk membuka dialog modal.</li></ul></li><li><strong>Menambahkan <code>tabindex=&quot;0&quot;</code> pada elemen <code>&lt;dialog&gt;</code>:</strong><ul><li><strong>Salah:</strong> Dokumentasi MDN secara tegas memperingatkan agar <strong>tidak</strong> memasang atribut <code>tabindex</code> pada elemen <code>&lt;dialog&gt;</code> itu sendiri; yang menerima fokus adalah tombol atau input interaktif di dalam <code>&lt;dialog&gt;</code> tersebut (gunakan atribut <code>autofocus</code> pada tombol batal/tutup atau input pertama).</li></ul></li></ol>
<h2>Latihan Praktik: Membangun Pusat Bantuan Interaktif</h2>
<p>Buatlah berkas <code>komponen-interaktif.html</code> yang menggabungkan ketiga komponen modern ini:</p>
<ol><li>Daftar 3 pertanyaan FAQ menggunakan <code>&lt;details name=&quot;bantuan-faq&quot;&gt;</code> dan <code>&lt;summary&gt;</code> sehingga hanya satu jawaban yang terbuka pada satu waktu.</li><li>Sebuah tombol <em>&quot;Lihat Tips Cepat&quot;</em> yang membuka panel informasi menggunakan atribut <code>popovertarget</code> dan <code>popover</code> murni tanpa JavaScript.</li><li>Sebuah tombol <em>&quot;Kirim Masukan&quot;</em> yang memanggil <code>.showModal()</code> pada elemen <code>&lt;dialog&gt;</code> berisi formulir singkat dengan tombol Batal (<code>formmethod=&quot;dialog&quot;</code>) dan Kirim.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog" rel="noopener"><code>&lt;dialog&gt;</code>: The Dialog element — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover" rel="noopener"><code>popover</code> HTML global attribute — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements" rel="noopener">HTML elements reference (<code>details</code>, <code>summary</code>, <code>template</code>) — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["<dialog>","<details>","popover","Esc","<summary>","name"],
    kuis: [
        {"tanya":"Apa perbedaan perilaku antara membuka elemen <dialog> menggunakan metode dialog.showModal() dibandingkan hanya menambahkan atribut open (<dialog open>)?","opsi":["showModal() hanya berfungsi di peramban ponsel, sedangkan atribut open berfungsi di desktop.","showModal() menempatkan dialog di Top Layer, menampilkan ::backdrop, mengunci interaksi di luar dialog (inert), dan mengaktifkan penutupan dengan tombol Esc; sedangkan atribut open hanya menampilkannya sebagai kotak non-modal biasa.","Atribut open otomatis mengirim data formulir ke server, sedangkan showModal() tidak.","Tidak ada perbedaan; keduanya menghasilkan tampilan dan perilaku yang identik."],"benar":1,"penjelasan":"Dialog yang dibuka lewat atribut open atau metode .show() bersifat non-modal. Seluruh kemampuan modalitas bawaan peramban (Top Layer, ::backdrop, halaman latar belakang menjadi inert, penguncian fokus Tab, dan penutupan lewat tombol Esc) hanya aktif ketika dialog dibuka dengan showModal()."},
        {"tanya":"Bagaimana cara membuat beberapa elemen <details> bekerja sebagai akordeon eksklusif (ketika satu dibuka, yang lain otomatis tertutup) tanpa menggunakan JavaScript?","opsi":["Memberikan atribut id yang sama pada semua elemen <details>.","Memberikan atribut name dengan nilai yang sama pada semua elemen <details> dalam kelompok tersebut.","Membungkus semua elemen <details> di dalam elemen <select>.","Menambahkan atribut popover=\"auto\" pada elemen <summary>."],"benar":1,"penjelasan":"Sejak spesifikasi HTML memperbarui elemen <details>, memberikan atribut name yang sama pada beberapa elemen <details> akan mengelompokkannya layaknya tombol radio: hanya satu elemen <details> dalam kelompok nama tersebut yang dapat berstatus open pada satu waktu."},
        {"tanya":"Apa yang terjadi pada isi di dalam elemen <template> ketika halaman HTML pertama kali dimuat oleh peramban?","opsi":["Isi di dalamnya langsung dirender di bagian paling bawah halaman dengan opasitas 50%.","Parser HTML memeriksa validitas sintaksnya, tetapi isinya bersifat inert (tidak dirender ke layar, gambar di dalamnya tidak diunduh, dan skrip di dalamnya tidak dijalankan) sampai digandakan lewat JavaScript.","Isi di dalamnya otomatis dihapus dari memori setelah 3 detik.","Peramban mengabaikan aturan CSS pada seluruh halaman jika terdapat elemen <template>."],"benar":1,"penjelasan":"Konten di dalam <template> disimpan di dalam sebuah DocumentFragment terpisah (template.content) yang tidak aktif. Elemen tersebut baru aktif dan dirender setelah Anda menyalinnya (template.content.cloneNode(true)) dan memasukkannya ke dalam pohon DOM dokumen utama."}
    ]
},
{
    id: 20,
    kategori: "4 · Elemen Interaktif",
    judul: "Komponen Web Bawaan HTML: template, slot, dan Declarative Shadow DOM",
    tingkat: "Lanjut", durasi: "9 mnt",
    tag: ["<template>","<slot>","<template shadowrootmode=\"open\">"],
    ringkas: "Membangun struktur komponen yang terenkapsulasi dan dapat digunakan ulang langsung di HTML menggunakan <template>, proyeksi konten <slot name=\"...\">, serta Declarative Shadow DOM (<template shadowrootmode=\"open\">) tanpa JavaScript.",
    isi: `
<h2>Mengapa HTML Memiliki Sistem Komponen Bawaan?</h2>
<p>Saat Anda menggunakan elemen bawaan HTML seperti <code>&lt;video controls&gt;</code> atau <code>&lt;input type=&quot;date&quot;&gt;</code>, Anda hanya menulis satu tag di HTML, tetapi di layar muncul tombol putar, penggeser volume, dan penghitung waktu yang rapi. Mengapa aturan CSS yang Anda tulis di halaman Anda tidak pernah merusak tombol internal di dalam <code>&lt;video controls&gt;</code> tersebut?</p>
<p>Jawabannya adalah karena peramban menyembunyikan struktur internal elemen <code>&lt;video&gt;</code> di dalam pohon DOM terisolasi yang disebut <strong>Shadow DOM</strong>.</p>
<p>Kini, melalui standar <strong>Web Components</strong> (<code>&lt;template&gt;</code>, <code>&lt;slot&gt;</code>, dan <strong>Declarative Shadow DOM</strong>), Anda dapat membangun komponen terenkapsulasi dengan mekanisme yang sama persis!</p>
<h2>1. Proyeksi Konten dengan <code>&lt;slot&gt;</code> dan <em>Named Slots</em></h2>
<p>Saat kita membuat sebuah komponen kartu pembungkus (misalnya <code>&lt;kartu-peringatan&gt;</code>), kita ingin struktur bingkai, ikon, dan gayanya terkunci rapi di dalam cetakan komponen, tetapi <strong>judul dan isi pesannya dapat diisi secara fleksibel dari luar</strong>.</p>
<p>Elemen <strong><code>&lt;slot&gt;</code></strong> berfungsi sebagai &quot;lubang tempat pengisian konten&quot; (<em>content placeholder</em>):</p>
<ul><li>**<code>&lt;slot&gt;</code> tanpa nama (<em>Default Slot</em>):** Menangkap seluruh elemen anak yang tidak memiliki atribut <code>slot</code>.</li><li>**<code>&lt;slot name=&quot;judul&quot;&gt;</code> (<em>Named Slot</em>):<strong> Menangkap elemen anak dari luar yang diberi atribut </strong><code>slot=&quot;judul&quot;</code>**!</li><li>**Konten Bawaan (<em>Fallback Content</em>):** Teks atau elemen yang Anda tulis di antara <code>&lt;slot&gt;...&lt;/slot&gt;</code> akan otomatis tampil apabila pemanggil tidak mengirimkan konten untuk slot tersebut!</li></ul>
<h2>2. Declarative Shadow DOM (<code>&lt;template shadowrootmode=&quot;open&quot;&gt;</code>)</h2>
<p>Dulu, membuat Shadow DOM mengharuskan eksekusi JavaScript (<code>element.attachShadow({ mode: &quot;open&quot; })</code>), sehingga komponen tidak bisa dirender langsung dari server (<em>Server-Side Rendering / SSR</em>) sebelum JavaScript selesai diunduh.</p>
<p>Sejak Februari 2024 (tersedia di seluruh peramban utama Chrome, Edge, Safari, dan Firefox; status <strong>Baseline Widely Available</strong> sejak Agustus 2026), Anda dapat membuat Shadow DOM <strong>murni dengan HTML tanpa satu baris JavaScript pun</strong> cukup dengan menambahkan atribut <strong><code>shadowrootmode=&quot;open&quot;</code></strong> pada elemen <strong><code>&lt;template&gt;</code></strong>!</p>
<pre>&lt;!-- Komponen Kartu Peringatan dengan Declarative Shadow DOM Murni HTML --&gt;
&lt;div class=&quot;komponen-callout&quot;&gt;
  &lt;template shadowrootmode=&quot;open&quot;&gt;
    &lt;style&gt;
      /* Gaya CSS di dalam Shadow DOM ini 100% TERISOLASI!
         Selektor 'header' di sini TIDAK AKAN PERNAH bocor mempengaruhi
         &lt;header&gt; lain di halaman luar! */
      :host {
        display: block;
        padding: 1rem 1.25rem;
        border-inline-start: 4px solid #2563eb;
        background-color: #eff6ff;
        border-radius: 0.5rem;
        font-family: system-ui, sans-serif;
      }
      header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 700;
        color: #1e3a8a;
        margin-block-end: 0.5rem;
      }
      /* Menata elemen luar yang masuk melalui &lt;slot&gt; menggunakan ::slotted() */
      ::slotted(p) {
        margin: 0;
        color: #1e293b;
      }
    &lt;/style&gt;

    &lt;header&gt;
      &lt;span aria-hidden=&quot;true&quot;&gt;💡&lt;/span&gt;
      &lt;!-- Slot bernama &quot;judul&quot; lengkap dengan teks fallback bawaan --&gt;
      &lt;slot name=&quot;judul&quot;&gt;Catatan Penting&lt;/slot&gt;
    &lt;/header&gt;

    &lt;div class=&quot;isi&quot;&gt;
      &lt;!-- Slot default untuk menampung isi utama --&gt;
      &lt;slot&gt;Belum ada rincian catatan.&lt;/slot&gt;
    &lt;/div&gt;
  &lt;/template&gt;

  &lt;!-- Konten di bawah ini adalah &quot;Light DOM&quot; yang diproyeksikan masuk ke dalam &lt;slot&gt; di atas! --&gt;
  &lt;span slot=&quot;judul&quot;&gt;Tips Keamanan Cookie&lt;/span&gt;
  &lt;p&gt;Selalu aktifkan atribut &lt;code&gt;HttpOnly&lt;/code&gt; dan &lt;code&gt;Secure&lt;/code&gt; pada cookie sesi produksi.&lt;/p&gt;
&lt;/div&gt;</pre>
<h3>Keunggulan Besar <em>Declarative Shadow DOM</em>:</h3>
<ol><li><strong>Langsung Tampil Instan (Bebas FOUC):</strong> Karena parser HTML langsung mengenali <code>&lt;template shadowrootmode=&quot;open&quot;&gt;</code>, gaya dan slot dirender sejak byte HTML pertama tiba, bahkan jika pengguna mematikan JavaScript!</li><li><strong>Isolasi Gaya CSS Mutlak:</strong> Aturan <code>header { ... }</code> di dalam <code>&lt;template shadowrootmode=&quot;open&quot;&gt;</code> dijamin tidak akan pernah merusak <code>&lt;header&gt;</code> situs utama Anda, dan CSS kasar dari luar tidak akan merusak struktur internal komponen (kecuali variabel CSS <code>--*</code> dan properti yang diwariskan seperti <code>font-family</code> dan <code>color</code> yang tetap bisa mengalir masuk!).</li></ol>
<h2>3. Memahami <code>:host</code> dan <code>::slotted()</code></h2>
<p>Saat menulis <code>&lt;style&gt;</code> di dalam Shadow DOM:</p>
<ul><li><strong><code>:host</code>:</strong> Memilih elemen pembungkus tempat Shadow Root tersebut menempel (pada contoh di atas adalah <code>&lt;div class=&quot;komponen-callout&quot;&gt;</code>). Anda juga bisa menulis <code>:host(.bahaya)</code> untuk mengubah warna bingkai jika elemen pembungkus diberi kelas <code>.bahaya</code>!</li><li><strong><code>::slotted(selektor)</code>:</strong> Memilih elemen tingkat atas yang dikirimkan dari luar (<em>Light DOM</em>) ke dalam <code>&lt;slot&gt;</code>.</li></ul>
<h2>Latihan Praktik: Merancang Komponen Tab / Kartu Kode dengan Declarative Shadow DOM</h2>
<p>Buatlah berkas <code>komponen-slot.html</code>:</p>
<ol><li>Buat komponen pembungkus cuplikan kode yang memiliki <code>&lt;template shadowrootmode=&quot;open&quot;&gt;</code>.</li><li>Sediakan <code>&lt;slot name=&quot;nama-berkas&quot;&gt;index.html&lt;/slot&gt;</code> di bagian kepala kotak kode, dan <code>&lt;slot name=&quot;kode&quot;&gt;&lt;/slot&gt;</code> di bagian isi.</li><li>Uji komponen tersebut dua kali: satu kali dengan mengisi atribut <code>slot=&quot;nama-berkas&quot;</code>, dan satu kali lagi tanpa mengirim <code>slot=&quot;nama-berkas&quot;</code> untuk membuktikan bahwa teks bawaan (<code>index.html</code>) otomatis muncul!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots" rel="noopener">Using templates and slots — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components" rel="noopener">Web Components — MDN Web Docs</a></li><li><a href="https://html.spec.whatwg.org/multipage/" rel="noopener">HTML Standard (<code>template</code> and <code>slot</code> elements) — WHATWG</a></li></ul></div>
`,
    perintah: ["<slot>","<template shadowrootmode=\"open\">","<video controls>","<template>",":host","slot=\"nama-berkas\""],
    kuis: [
        {"tanya":"Apa perbedaan antara <template> biasa dan <template shadowrootmode=\"open\"> ketika dokumen HTML sedang diurai oleh peramban?","opsi":["Keduanya sama-sama disembunyikan dan wajib dipanggil dengan JavaScript cloneNode().","<template> biasa bersifat inert (disimpan tetapi tidak dirender sampai digandakan lewat JS), sedangkan <template shadowrootmode=\"open\"> langsung diubah oleh parser HTML menjadi Shadow Root pada elemen induknya dan dirender seketika beserta proyeksi <slot>-nya tanpa membutuhkan JavaScript.","shadowrootmode=\"open\" menghapus seluruh CSS di halaman utama.","<template> biasa hanya boleh berisi teks tanpa tag HTML."],"benar":1,"penjelasan":"Declarative Shadow DOM (<template shadowrootmode=\"open\">) memungkinkan pembuatan Shadow Root secara deklaratif langsung pada tahap HTML parsing, sehingga komponen Web dapat dirender di sisi server (SSR) dan langsung tampil tanpa menunggu eksekusi JavaScript."},
        {"tanya":"Bagaimana cara elemen anak di luar (Light DOM) menentukan bahwa dirinya harus masuk ke dalam <slot name=\"kaki-kartu\"></slot> di dalam sebuah Shadow DOM?","opsi":["Dengan menambahkan atribut id=\"kaki-kartu\" pada elemen anak tersebut.","Dengan menambahkan atribut slot=\"kaki-kartu\" pada elemen anak tersebut.","Dengan menambahkan kelas class=\"slot-kaki-kartu\".","Dengan membungkusnya di dalam tag <footer-slot>."],"benar":1,"penjelasan":"Atribut global HTML slot=\"nama-slot\" memasangkan elemen anak dari Light DOM langsung ke elemen <slot name=\"nama-slot\"> yang sesuai di dalam Shadow DOM induknya."},
        {"tanya":"Apa yang ditampilkan oleh elemen <slot name=\"status\">Aktif</slot> apabila pemanggil komponen tidak menyertakan elemen anak dengan atribut slot=\"status\"?","opsi":["Ruang kosong (tidak menampilkan apa pun).","Menampilkan konten bawaan (fallback content) yang tertulis di dalam tag <slot>, yaitu teks \"Aktif\".","Menampilkan pesan galat di konsol peramban.","Menyembunyikan seluruh komponen kartu."],"benar":1,"penjelasan":"Konten apa pun yang diletakkan di antara tag pembuka <slot> dan tag penutup </slot> berfungsi sebagai nilai bawaan (default/fallback content) yang otomatis dirender apabila slot tersebut tidak diisi oleh pemanggil."}
    ]
},
{
    id: 21,
    kategori: "4 · Elemen Interaktif",
    judul: "Menyematkan Konten Eksternal (iframe), Atribut sandbox, dan Keamanan Bingkai",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["<iframe>","sandbox","sandbox=\"\""],
    ringkas: "Menyematkan halaman atau layanan pihak ketiga menggunakan <iframe> secara aman dan aksesibel melalui pembatasan hak sandbox, allow, referrerpolicy, loading=\"lazy\", serta mencegah serangan Clickjacking.",
    isi: `
<h2>Apa yang Terjadi Saat Anda Menyematkan <code>&lt;iframe&gt;</code>?</h2>
<p>Elemen **<code>&lt;iframe&gt;</code> (<em>Inline Frame</em>)** memungkinkan Anda menyematkan dokumen HTML lain—seperti pemutar video YouTube, peta interaktif OpenStreetMap, editor kode Go Playground, atau widget pembayaran—di dalam sebuah kotak di halaman Anda.</p>
<p>Namun, setiap <code>&lt;iframe&gt;</code> menciptakan **konteks penjelajahan (<em>browsing context</em>) bersarang yang lengkap**: ia memiliki objek <code>window</code>, pohon DOM, serta mengunduh CSS dan JavaScript miliknya sendiri. Tanpa pembatasan yang tepat, <code>&lt;iframe&gt;</code> dari pihak ketiga dapat memperlambat halaman utama Anda atau bahkan melakukan tindakan berbahaya seperti membuka jendela pop-up iklan, mengalihkan halaman utama Anda (<em>top-level redirect</em>), atau meminta izin kamera tanpa sepengetahuan Anda.</p>
<h2>1. Anatomi <code>&lt;iframe&gt;</code> yang Aksesibel dan Efisien</h2>
<pre>&lt;iframe
  title=&quot;Video Tutorial Instalasi PostgreSQL di Linux&quot;
  src=&quot;https://www.youtube-nocookie.com/embed/ID_VIDEO_ANDA&quot;
  width=&quot;560&quot;
  height=&quot;315&quot;
  loading=&quot;lazy&quot;
  referrerpolicy=&quot;strict-origin-when-cross-origin&quot;
  allow=&quot;fullscreen; picture-in-picture&quot;
  sandbox=&quot;allow-scripts allow-same-origin allow-presentation&quot;
&gt;&lt;/iframe&gt;</pre>
<h3>Tiga Atribut Dasar yang Wajib Diperhatikan:</h3>
<ol><li><strong><code>title</code> (Wajib untuk Aksesibilitas WCAG):</strong> Pengguna pembaca layar perlu mengetahui apa isi dari bingkai <code>&lt;iframe&gt;</code> tersebut sebelum memutuskan apakah mereka ingin masuk ke dalamnya atau melewatinya. Tanpa atribut <code>title=&quot;...&quot;</code> yang deskriptif, pembaca layar hanya membacakan URL mentah yang membingungkan.</li><li><strong><code>loading=&quot;lazy&quot;</code>:</strong> Karena setiap <code>&lt;iframe&gt;</code> memuat halaman web utuh di dalamnya, memasang <code>loading=&quot;lazy&quot;</code> pada iframe yang berada di bagian bawah artikel menghemat ratusan kilobyte hingga megabyte kuota jaringan dan memori CPU saat halaman pertama kali dibuka!</li><li><strong><code>width</code> dan <code>height</code> (serta CSS <code>aspect-ratio</code>):</strong> Mencegah pergeseran tata letak (<em>Cumulative Layout Shift / CLS</em>) saat iframe dimuat.</li></ol>
<h2>2. Mengurung Hak Akses Iframe dengan Atribut <code>sandbox</code></h2>
<p>Atribut <strong><code>sandbox</code></strong> menerapkan prinsip **Hak Akses Minimal (<em>Least Privilege</em>)** pada dokumen di dalam <code>&lt;iframe&gt;</code>.</p>
<p>Jika Anda menulis <strong><code>sandbox=&quot;&quot;</code></strong> (dengan nilai kosong tanpa token), peramban akan menerapkan <strong>pembatasan paling ketat</strong>:</p>
<ul><li>Skrip JavaScript di dalam iframe <strong>dilarang berjalan</strong>.</li><li>Formulir di dalam iframe <strong>dilarang dikirim</strong>.</li><li>Iframe dipaksa memiliki <em>unique opaque origin</em> (tidak bisa membaca cookie atau <code>localStorage</code> domain aslinya sendiri!).</li><li>Iframe <strong>dilarang membuka tab baru</strong> (<code>window.open</code> / <code>target=&quot;_blank&quot;</code>) dan <strong>dilarang mengubah URL halaman utama</strong> (<code>window.top.location</code>).</li></ul>
<p>Anda kemudian dapat membuka izin <strong>hanya yang benar-benar diperlukan</strong> satu per satu menggunakan daftar putih token yang dipisahkan spasi:</p>
<table><thead><tr><th>Token <code>sandbox</code></th><th>Izin yang Dibuka</th><th>Catatan Keamanan</th></tr></thead><tbody><tr><td><code>allow-scripts</code></td><td>Mengizinkan eksekusi JavaScript di dalam iframe.</td><td>Aman untuk widget interaktif selama tidak digabung sembarangan dengan origin yang sama.</td></tr><tr><td><code>allow-forms</code></td><td>Mengizinkan pengiriman formulir di dalam iframe.</td><td>Diperlukan untuk widget survei atau halaman pembayaran tersemat.</td></tr><tr><td><code>allow-popups</code></td><td>Mengizinkan pembukaan tab/jendela baru (<code>target=&quot;_blank&quot;</code>).</td><td>Tab atau jendela baru yang dibuka mewarisi pembatasan sandbox yang sama, kecuali <code>allow-popups-to-escape-sandbox</code> juga diberikan.</td></tr><tr><td><code>allow-same-origin</code></td><td>Mengizinkan isi iframe mempertahankan <em>origin</em> aslinya (sehingga bisa mengakses cookie/storage milik domain iframe tersebut).</td><td>Lihat peringatan kritis di bawah!</td></tr><tr><td><code>allow-top-navigation-by-user-activation</code></td><td>Mengizinkan iframe mengalihkan halaman utama <strong>hanya jika</strong> pengguna mengeklik langsung di dalam iframe.</td><td>Jauh lebih aman daripada <code>allow-top-navigation</code> biasa.</td></tr></tbody></table>
<div class="callout bahaya"><div class="callout-judul">🚫 Peringatan Keamanan Kritis: Jangan Pernah Menggabungkan <code>allow-scripts</code> DAN <code>allow-same-origin</code> untuk Konten dari Origin Anda Sendiri!</div><p>Jika dokumen di dalam <code>&lt;iframe src=&quot;/pratinjau-user.html&quot;&gt;</code> berasal dari **domain (<em>origin</em>) yang sama dengan situs utama Anda<strong>, dan Anda memberikan <code>sandbox=&quot;allow-scripts allow-same-origin&quot;</code>, maka skrip di dalam iframe tersebut memiliki akses ke <code>window.parent.document</code> dan </strong>dapat langsung menghapus atribut <code>sandbox</code> dari elemen <code>&lt;iframe&gt;</code> miliknya sendiri lalu memuat ulang dirinya tanpa penjara sandbox<strong>! Untuk merender pratinjau HTML buatan pengguna, gunakan <code>sandbox=&quot;allow-scripts&quot;</code> </strong>TANPA** <code>allow-same-origin</code> (atau gunakan atribut <code>srcdoc=&quot;...&quot;</code> dengan <code>sandbox=&quot;&quot;</code>).</p></div>
<h3>Merender Cuplikan HTML Secara Terisolasi dengan <code>srcdoc</code></h3>
<p>Jika Anda ingin menampilkan pratinjau email HTML atau hasil latihan pengguna tanpa membuat berkas terpisah di server, gunakan atribut <strong><code>srcdoc</code></strong> yang dipadukan dengan <strong><code>sandbox=&quot;&quot;</code></strong>:</p>
<pre>&lt;iframe
  title=&quot;Pratinjau Komentar HTML Pengguna&quot;
  sandbox=&quot;&quot;
  srcdoc=&quot;&lt;p&gt;Halo! Ini adalah teks &lt;strong&gt;tebal&lt;/strong&gt;, dan &lt;script&gt;alert('XSS gagal!')&lt;/script&gt; otomatis diblokir oleh sandbox kosong.&lt;/p&gt;&quot;
  width=&quot;600&quot;
  height=&quot;120&quot;
&gt;&lt;/iframe&gt;</pre>
<h2>3. Mengendalikan Fitur Perangkat Keras (<code>allow</code>) dan Privasi (<code>referrerpolicy</code>)</h2>
<ol><li><strong>Permissions Policy (<code>allow=&quot;...&quot;</code>):</strong> Mengontrol apakah iframe diizinkan mengakses fitur perangkat keras sensitif. Secara bawaan, iframe lintas-origin tidak boleh mengakses kamera, mikrofon, atau geolokasi kecuali Anda mengizinkannya secara eksplisit: <code>allow=&quot;fullscreen; clipboard-write; encrypted-media&quot;</code> (dan jangan pernah memberi <code>camera</code> atau <code>microphone</code> kecuali memang menyematkan aplikasi konferensi video!).</li><li><strong><code>referrerpolicy=&quot;strict-origin-when-cross-origin&quot;</code> (atau <code>&quot;no-referrer&quot;</code>):</strong> Memastikan bahwa saat iframe pihak ketiga dimuat, peramban tidak membocorkan jalur URL lengkap dan parameter query halaman internal Anda (hanya mengirimkan nama domain utama <code>https://kodeloka.asadinedu.com/</code> atau tidak sama sekali).</li></ol>
<h2>4. Melindungi Situs Anda Sendiri agar Tidak Disematkan oleh Penyerang (<em>Anti-Clickjacking</em>)</h2>
<p>Bagaimana jika penyerang membuat situs palsu lalu menyematkan halaman pengaturan akun situs Anda di dalam <code>&lt;iframe style=&quot;opacity: 0&quot;&gt;</code> transparan tepat di atas tombol <em>&quot;Klaim Hadiah&quot;</em> agar korban tidak sengaja mengeklik tombol <em>&quot;Hapus Akun&quot;</em> milik situs Anda? Serangan ini disebut <strong>Clickjacking</strong>.</p>
<p>Cara menangkalnya adalah mengirimkan header HTTP <strong><code>Content-Security-Policy: frame-ancestors 'none'</code></strong> (atau <code>'self'</code> jika hanya boleh disematkan oleh situs Anda sendiri) dari server web Anda!</p>
<h2>Latihan Praktik: Menyematkan Playground Kode dan Pratinjau Aman</h2>
<p>Buatlah berkas <code>latihan-iframe.html</code>:</p>
<ol><li>Sematkan satu <code>&lt;iframe title=&quot;...&quot;&gt;</code> eksternal dengan <code>loading=&quot;lazy&quot;</code>, <code>referrerpolicy=&quot;no-referrer&quot;</code>, dan <code>sandbox=&quot;allow-scripts&quot;</code>.</li><li>Buat satu <code>&lt;iframe title=&quot;Pratinjau Aman&quot;&gt;</code> yang menggunakan <code>srcdoc</code> dan <code>sandbox=&quot;&quot;</code> (kosong) untuk membuktikan bahwa tag <code>&lt;script&gt;</code> di dalam <code>srcdoc</code> benar-benar ditolak eksekusinya oleh peramban.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe" rel="noopener"><code>&lt;iframe&gt;</code>: The Inline Frame element — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP" rel="noopener">Content Security Policy (CSP) — MDN Web Docs</a></li><li><a href="https://web.dev/learn/accessibility" rel="noopener">Learn Accessibility — web.dev</a></li></ul></div>
`,
    perintah: ["<iframe>","sandbox","sandbox=\"\"","srcdoc","loading=\"lazy\"","allow-same-origin"],
    kuis: [
        {"tanya":"Apa yang terjadi pada sebuah elemen <iframe src=\"https://pihak-ketiga.example/widget.html\" sandbox=\"\"> ketika atribut sandbox ditulis dengan nilai string kosong (\"\")?","opsi":["Atribut sandbox diabaikan karena tidak berisi token apa pun.","Peramban menerapkan seluruh batasan keamanan secara maksimal: mematikan eksekusi JavaScript, melarang pengiriman formulir, melarang pembukaan pop-up, dan mengisolasi iframe ke dalam opaque origin unik.","Iframe diizinkan menjalankan semua fitur termasuk kamera dan mikrofon.","Iframe otomatis disembunyikan dari layar."],"benar":1,"penjelasan":"Atribut sandbox=\"\" tanpa token mengaktifkan penguncian penuh (maximum restrictions). Setiap token allow-* yang ditambahkan ke dalamnya berfungsi sebagai pengecualian (allowlist) untuk melonggarkan satu batasan tertentu."},
        {"tanya":"Mengapa menggabungkan sandbox=\"allow-scripts allow-same-origin\" sangat berbahaya apabila halaman yang dimuat di dalam <iframe> berasal dari origin (domain) yang sama dengan halaman induknya?","opsi":["Karena halaman induk akan kehilangan koneksi HTTPS.","Karena skrip di dalam iframe yang se-origin dapat mengakses DOM halaman induk melalui window.parent.document, menghapus atribut sandbox pada elemen <iframe> miliknya sendiri, lalu keluar sepenuhnya dari batasan sandbox.","Karena CSS di halaman induk akan terhapus.","Karena allow-same-origin memblokir pemuatan gambar."],"benar":1,"penjelasan":"Dokumentasi MDN secara tegas memperingatkan bahwa ketika konten iframe memiliki origin yang sama dengan halaman utama, pemberian allow-scripts dan allow-same-origin secara bersamaan memungkinkan skrip di dalam iframe memanipulasi elemen <iframe> di dokumen induk untuk melepaskan dirinya dari sandbox."},
        {"tanya":"Mengapa setiap elemen <iframe> wajib memiliki atribut title yang deskriptif?","opsi":["Agar URL di dalam src otomatis terenkripsi.","Agar pengguna teknologi bantu seperti pembaca layar (screen reader) dapat mengidentifikasi tujuan atau isi bingkai tersebut tanpa harus masuk dan menelusuri isi dokumen di dalamnya terlebih dahulu.","Karena tanpa atribut title, atribut loading=\"lazy\" tidak akan bekerja.","Agar bingkai otomatis memiliki garis batas (border)."],"benar":1,"penjelasan":"Tanpa atribut title pada <iframe>, pengguna pembaca layar yang berpindah antar-bingkai hanya akan mendengar pembacaan nama elemen \"frame\" atau URL teknis yang panjang, sehingga melanggar pedoman aksesibilitas WCAG 2.2 (Kriteria 2.4.1 & 4.1.2)."}
    ]
},
{
    id: 22,
    kategori: "5 · Aksesibilitas",
    judul: "Aksesibilitas Web (a11y) dan WAI-ARIA Dasar",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["Tab","tabindex","aria-describedby"],
    ringkas: "Menerapkan prinsip WCAG (POUR), navigasi papan ketik dan manajemen fokus, aturan pertama penggunaan WAI-ARIA, serta atribut penting seperti aria-label, aria-labelledby, aria-describedby, dan aria-live.",
    isi: `
<h2>Apa Itu Aksesibilitas Web (a11y) dan Mengapa Bukan Fitur Tambahan?</h2>
<p>Istilah <strong>a11y</strong> adalah numeronim dari kata <em>accessibility</em> (huruf <code>a</code>, diikuti 11 huruf di tengah, dan diakhiri huruf <code>y</code>). Membangun web yang aksesibel berarti memastikan situs Anda dapat digunakan oleh semua orang—termasuk penyandang tunanetra yang menggunakan pembaca layar (<em>screen reader</em> seperti NVDA, VoiceOver, atau TalkBack), pengguna dengan keterbatasan motorik yang hanya menggunakan papan ketik atau tombol <em>switch</em>, pengguna dengan gangguan pendengaran, hingga pengguna di bawah terik matahari dengan kontras layar terbatas.</p>
<p>Standar internasional untuk aksesibilitas web adalah **WCAG (<em>Web Content Accessibility Guidelines</em>) 2.2<strong> dari W3C, yang bertumpu pada empat prinsip utama yang disingkat </strong>POUR**:</p>
<ol><li><strong>Perceivable (Dapat Diamati):</strong> Informasi tidak boleh bergantung pada satu indra saja (sediakan teks alternatif <code>alt</code> untuk gambar, takarir <code>&lt;track&gt;</code> untuk video, dan kontras warna minimal <code>4.5:1</code> untuk teks normal).</li><li><strong>Operable (Dapat Dioperasikan):</strong> Seluruh fungsi antarmuka harus bisa dijalankan menggunakan <strong>papan ketik saja</strong> tanpa tetikus (<em>mouse</em>), memiliki indikator fokus yang jelas, dan memiliki target klik/sentuh yang memadai (minimal <code>24×24</code> piksel CSS di WCAG 2.2 AA).</li><li><strong>Understandable (Dapat Dipahami):</strong> Bahasa dokumen dinyatakan dengan jelas (<code>&lt;html lang=&quot;id&quot;&gt;</code>), navigasi konsisten, dan formulir memberikan pesan kesalahan yang jelas beserta saran perbaikannya.</li><li><strong>Robust (Tangguh):</strong> Kode HTML ditulis secara valid dan semantik sehingga dapat diterjemahkan secara akurat oleh berbagai peramban maupun teknologi bantu (<em>assistive technologies</em>) masa kini dan masa depan.</li></ol>
<h2>1. Navigasi Papan Ketik, Urutan Fokus, dan <code>tabindex</code></h2>
<p>Cobalah meletakkan tetikus Anda, lalu gunakan tombol <strong><code>Tab</code></strong> (maju), <strong><code>Shift + Tab</code></strong> (mundur), <strong><code>Enter</code></strong>, <strong><code>Space</code></strong>, dan tombol <strong>Panah</strong> di halaman web.</p>
<p>Secara bawaan, hanya elemen interaktif asli HTML (<code>&lt;a href=&quot;...&quot;&gt;</code>, <code>&lt;button&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;select&gt;</code>, <code>&lt;textarea&gt;</code>, <code>&lt;summary&gt;</code>) yang masuk ke dalam urutan fokus tombol <code>Tab</code> sesuai urutan kemunculannya di dokumen DOM.</p>
<p>Atribut <code>tabindex</code> mengendalikan perilaku fokus sebuah elemen:</p>
<table><thead><tr><th>Nilai <code>tabindex</code></th><th>Perilaku dan Aturan Penggunaan</th></tr></thead><tbody><tr><td><code>tabindex=&quot;0&quot;</code></td><td>Memasukkan elemen yang aslinya tidak fokusabel (seperti <code>&lt;div class=&quot;pembungkus-tabel&quot;&gt;</code> yang bisa digulir) ke dalam urutan <code>Tab</code> normal mengikuti urutan DOM.</td></tr><tr><td><code>tabindex=&quot;-1&quot;</code></td><td>Elemen <strong>tidak</strong> dapat dicapai dengan menekan tombol <code>Tab</code>, tetapi <strong>dapat menerima fokus secara terprogram</strong> lewat JavaScript (<code>elemen.focus()</code>) atau ketika menjadi target tautan lompatan. Sangat berguna untuk mengelola fokus di dalam komponen kustom atau pesan galat.</td></tr><tr><td><code>tabindex=&quot;1&quot;</code> atau angka positif (<code>&gt; 0</code>)</td><td><strong>JANGAN PERNAH DIGUNAKAN!</strong> Nilai positif merampas urutan fokus alami halaman dan melompat-lompat mendahului semua elemen lain, sehingga membingungkan pengguna papan ketik.</td></tr></tbody></table>
<div class="callout bahaya"><div class="callout-judul">🚫 Jangan Pernah Menghapus <code>outline</code> Fokus Tanpa Pengganti!</div><p>Menulis <code>*:focus { outline: none; }</code> di CSS membuat pengguna papan ketik kehilangan jejak di mana posisi kursor mereka berada. Gunakan pseudo-class modern <strong><code>:focus-visible</code></strong> agar cincin fokus yang tegas selalu tampil saat pengguna memakai papan ketik:</p>
<pre>:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}</pre></div>
<h2>2. Mengenal WAI-ARIA dan &quot;Aturan Pertama Penggunaan ARIA&quot;</h2>
<p>**WAI-ARIA (<em>Accessible Rich Internet Applications</em>)** adalah sekumpulan atribut HTML (<code>role</code>, <code>aria-*</code>) yang menambahkan informasi peran, status, dan properti pada elemen DOM untuk diteruskan ke <em>Accessibility Tree</em> milik sistem operasi, tanpa mengubah tampilan visual maupun perilaku JavaScript secara otomatis.</p>
<p>Sebelum menulis atribut ARIA apa pun, hafalkan <strong>Aturan Pertama Penggunaan ARIA</strong> dari W3C:</p>
<div class="callout info"><p><em>&quot;Jika Anda dapat menggunakan elemen atau atribut HTML asli (native) yang sudah memiliki semantik dan perilaku yang Anda butuhkan secara bawaan, <strong>gunakanlah elemen HTML asli tersebut</strong>, jangan menambal elemen generik dengan ARIA.&quot;</em></p></div>
<pre>&lt;!-- BURUK: Memaksakan &lt;div&gt; menjadi tombol dengan ARIA (tetap butuh JS tambahan untuk Enter/Space!) --&gt;
&lt;div role=&quot;button&quot; tabindex=&quot;0&quot; aria-pressed=&quot;false&quot;&gt;Simpan Perubahan&lt;/div&gt;

&lt;!-- LEBIH BAIK: Gunakan &lt;button&gt; asli — sudah otomatis fokusabel, mendukung Enter &amp; Space, dan dikenali semua pembaca layar --&gt;
&lt;button type=&quot;button&quot; aria-pressed=&quot;false&quot;&gt;Simpan Perubahan&lt;/button&gt;</pre>
<h2>3. Atribut ARIA yang Paling Sering Digunakan dalam Praktik</h2>
<p>Meskipun kita selalu mengutamakan HTML semantik, ada situasi di mana HTML murni tidak cukup untuk menyampaikan hubungan antar-elemen atau perubahan status dinamis:</p>
<h3>A. Memberi Nama dan Deskripsi: <code>aria-label</code>, <code>aria-labelledby</code>, dan <code>aria-describedby</code></h3>
<ol><li><strong><code>aria-label</code>:</strong> Memberikan nama aksesibel berupa teks langsung ketika elemen tidak memiliki teks yang terlihat di layar (contoh paling umum: tombol yang hanya berisi ikon SVG).</li><li><strong><code>aria-labelledby</code>:</strong> Mengambil nama aksesibel dari <code>id</code> elemen teks lain yang <strong>sudah tampil</strong> di layar.</li><li><strong><code>aria-describedby</code>:</strong> Mengaitkan elemen dengan <code>id</code> elemen penjelasan tambahan (seperti syarat kata sandi atau pesan kesalahan di bawah input).</li></ol>
<pre>&lt;!-- 1. Tombol hanya berisi ikon SVG: gunakan aria-label, dan sembunyikan SVG dekoratif dengan aria-hidden=&quot;true&quot; --&gt;
&lt;button type=&quot;button&quot; aria-label=&quot;Tutup jendela pemberitahuan&quot;&gt;
  &lt;svg aria-hidden=&quot;true&quot; width=&quot;20&quot; height=&quot;20&quot; viewBox=&quot;0 0 24 24&quot;&gt;
    &lt;path d=&quot;M18 6L6 18M6 6l12 12&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot;/&gt;
  &lt;/svg&gt;
&lt;/button&gt;

&lt;!-- 2. Mengaitkan input dengan petunjuk dan pesan galat menggunakan aria-describedby --&gt;
&lt;div class=&quot;kelompok-input&quot;&gt;
  &lt;label for=&quot;nama-domain&quot;&gt;Subdomain Aplikasi&lt;/label&gt;
  &lt;input
    type=&quot;text&quot;
    id=&quot;nama-domain&quot;
    name=&quot;subdomain&quot;
    aria-invalid=&quot;true&quot;
    aria-describedby=&quot;petunjuk-domain galat-domain&quot;
  &gt;
  &lt;p id=&quot;petunjuk-domain&quot;&gt;Hanya huruf kecil dan tanda hubung, maksimal 30 karakter.&lt;/p&gt;
  &lt;p id=&quot;galat-domain&quot; role=&quot;alert&quot;&gt;Subdomain &quot;admin&quot; sudah digunakan oleh pengguna lain.&lt;/p&gt;
&lt;/div&gt;</pre>
<h3>B. Menyampaikan Status Komponen: <code>aria-expanded</code>, <code>aria-current</code>, dan <code>aria-hidden</code></h3>
<ul><li><strong><code>aria-expanded=&quot;false&quot;</code> / <code>&quot;true&quot;</code>:</strong> Dipasang pada tombol pembuka menu tarik-turun (<em>dropdown</em>) atau navigasi ponsel untuk memberitahu apakah panel yang dikendalikannya sedang tertutup atau terbuka.</li><li><strong><code>aria-current=&quot;page&quot;</code>:</strong> Dipasang pada tautan navigasi yang menunjuk ke halaman yang sedang aktif saat ini.</li><li><strong><code>aria-hidden=&quot;true&quot;</code>:</strong> Menyembunyikan elemen dekoratif (seperti ikon SVG pendamping teks atau tanda panah hiasan <code>→</code>) dari pembaca layar agar tidak dibacakan secara berulang. <strong>Jangan pernah memasang <code>aria-hidden=&quot;true&quot;</code> pada elemen yang masih bisa menerima fokus tombol <code>Tab</code>!</strong></li></ul>
<h3>C. Mengumumkan Perubahan Dinamis dengan <code>aria-live</code></h3>
<p>Ketika JavaScript memperbarui teks di sebagian layar tanpa memuat ulang halaman (misalnya menampilkan <em>&quot;3 hasil ditemukan&quot;</em> atau <em>&quot;Berhasil disimpan ke draf&quot;</em>), pengguna pembaca layar tidak akan mengetahuinya kecuali elemen pembungkusnya ditandai sebagai <strong>Live Region</strong>:</p>
<ul><li><strong><code>aria-live=&quot;polite&quot;</code> (atau <code>&lt;output&gt;</code> / <code>role=&quot;status&quot;</code>):</strong> Pembaca layar menunggu sampai kalimat yang sedang dibacakan selesai, baru mengumumkan perubahan teks tersebut dengan sopan.</li><li><strong><code>aria-live=&quot;assertive&quot;</code> (atau <code>role=&quot;alert&quot;</code>):</strong> Langsung menyela pembacaan saat itu juga. Gunakan hanya untuk peringatan galat kritis atau batas waktu sesi yang mendesak.</li></ul>
<h2>Latihan Praktik: Mengaudit dan Memperbaiki Komponen Kartu &amp; Formulir</h2>
<p>Buatlah berkas <code>latihan-a11y.html</code> yang berisi:</p>
<ol><li>Sebuah tombol penutup notifikasi yang hanya menampilkan ikon <code>×</code> secara visual, namun tetap memiliki nama yang jelas bagi pembaca layar dan menyembunyikan simbol <code>×</code> dari pembacaan literal.</li><li>Sebuah menu navigasi dengan lima tautan, di mana halaman aktif ditandai secara semantik dengan <code>aria-current=&quot;page&quot;</code>.</li><li>Sebuah kotak input pencarian langsung (<em>live search</em>) yang terhubung dengan petunjuk pengisian (<code>aria-describedby</code>) dan memiliki wadah status hasil pencarian dengan <code>aria-live=&quot;polite&quot;</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/WAI-ARIA_basics" rel="noopener">WAI-ARIA basics — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes" rel="noopener">ARIA states and properties (attributes) — MDN Web Docs</a></li><li><a href="https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/" rel="noopener">What's New in WCAG 2.2 — W3C Web Accessibility Initiative (WAI)</a></li><li><a href="https://web.dev/articles/a11y-tips-for-web-dev" rel="noopener">Accessibility for web developers — web.dev</a></li></ul></div>
`,
    perintah: ["Tab","tabindex","aria-describedby","aria-label","aria-labelledby","id"],
    kuis: [
        {"tanya":"Apa bunyi prinsip utama dari \"Aturan Pertama Penggunaan ARIA\" (First Rule of ARIA Use)?","opsi":["Setiap elemen HTML wajib memiliki minimal satu atribut role dan satu atribut aria-label.","Jika terdapat elemen atau atribut HTML asli (native) yang sudah memiliki semantik dan perilaku aksesibilitas yang dibutuhkan, gunakanlah elemen HTML asli tersebut daripada memodifikasi elemen generik dengan ARIA.","Atribut ARIA hanya boleh ditambahkan melalui kode JavaScript setelah halaman selesai dimuat.","Atribut aria-hidden=\"true\" harus dipasang pada semua tombol agar halaman lebih cepat dimuat."],"benar":1,"penjelasan":"Elemen HTML asli seperti <button>, <nav>, <dialog>, dan <details> sudah menyediakan dukungan fokus papan ketik, event klik/ketukan, dan peran aksesibilitas bawaan di semua peramban. Menambahkan ARIA pada <div> mengharuskan Anda menulis ulang semua perilaku papan ketik tersebut secara manual di JavaScript dan rawan menghasilkan bug."},
        {"tanya":"Mengapa penggunaan tabindex dengan nilai positif (seperti tabindex=\"1\" atau tabindex=\"5\") sangat tidak disarankan?","opsi":["Karena nilai positif hanya didukung oleh peramban Safari.","Karena elemen dengan nilai tabindex positif akan melompati urutan fokus alami dokumen dan menerima fokus lebih dulu sebelum semua elemen lain di halaman, sehingga merusak alur navigasi pengguna papan ketik.","Karena tabindex positif membuat elemen tidak dapat diklik dengan tetikus.","Karena tabindex positif menghapus gaya CSS :focus-visible."],"benar":1,"penjelasan":"Urutan fokus papan ketik seharusnya mengalir secara logis mengikuti susunan visual dan DOM dokumen (tabindex=\"0\" atau elemen interaktif bawaan). Nilai positif memaksa fokus melompat ke elemen tersebut terlebih dahulu di awal halaman, menciptakan pengalaman navigasi yang membingungkan."},
        {"tanya":"Anda memiliki tombol dengan teks dan ikon SVG di dalamnya: <button type=\"button\"><svg>...</svg> Unduh Materi</button>. Atribut apa yang sebaiknya ditambahkan pada elemen <svg> tersebut?","opsi":["aria-label=\"Ikon unduh\"","aria-hidden=\"true\"","role=\"button\"","tabindex=\"0\""],"benar":1,"penjelasan":"Karena tombol tersebut sudah memiliki teks yang jelas (\"Unduh Materi\"), ikon SVG di sebelahnya bersifat dekoratif/pelengkap. Menambahkan aria-hidden=\"true\" pada <svg> mencegah pembaca layar mencoba membacakan elemen grafis internal yang tidak perlu."}
    ]
},
{
    id: 23,
    kategori: "5 · Aksesibilitas",
    judul: "Internasionalisasi HTML (lang, dir, bdi, ruby) dan Notasi Matematika (math)",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["lang","dir","<bdi>"],
    ringkas: "Menangani konten multibahasa dan teks dua arah (bidirectional text) secara akurat menggunakan <bdi>, <bdo>, dir=\"auto\", translate=\"no\", anotasi fonetik <ruby>, serta menulis rumus matematika standar web dengan MathML (<math>).",
    isi: `
<h2>1. Masalah Nyata Teks Dua Arah (<em>Bidirectional Text</em>) dan Solusi <code>&lt;bdi&gt;</code></h2>
<p>Dalam aplikasi web yang menampung nama pengguna, komentar, atau judul berkas dari seluruh dunia, sering kali teks berarah <strong>Kiri-ke-Kanan (LTR — seperti Bahasa Indonesia/Inggris)</strong> bercampur dengan teks berarah <strong>Kanan-ke-Kiri (RTL — seperti bahasa Arab atau Ibrani)</strong> di dalam satu kalimat yang sama.</p>
<p>Algoritma Unicode Bidirectional (<em>BiDi</em>) di peramban berusaha menebak arah baca tanda baca dan angka yang mengapit teks tersebut. Namun, tanpa petunjuk isolasi HTML, tanda titik dua, tanda kurung, atau angka peringkat di sebelah nama berbahasa Arab/Ibrani <strong>akan melompat terbalik ke sisi yang salah</strong>!</p>
<p>Solusinya adalah elemen **<code>&lt;bdi&gt;</code> (<em>Bidirectional Isolate</em>)**:</p>
<ul><li>Bungkus setiap teks dinamis yang berasal dari pengguna (seperti nama pengguna di daftar peringkat atau komentar) dengan <code>&lt;bdi&gt;...&lt;/bdi&gt;</code>.</li><li><code>&lt;bdi&gt;</code> menginstruksikan peramban untuk: (1) mendeteksi arah baca isi di dalamnya secara otomatis, dan (2) <strong>mengisolasinya</strong> agar tidak memengaruhi posisi tanda baca atau angka di luar <code>&lt;bdi&gt;</code>!</li></ul>
<pre>&lt;h2&gt;Peringkat Kontributor Minggu Ini&lt;/h2&gt;
&lt;ul&gt;
  &lt;!-- Tanpa &lt;bdi&gt;, jika nama pengguna menggunakan aksara Arab (RTL),
       tanda &quot;- 150 poin&quot; dapat melompat berantakan! Dengan &lt;bdi&gt;, posisi tetap rapi. --&gt;
  &lt;li&gt;Peringkat 1: &lt;bdi&gt;Nadia Pratama&lt;/bdi&gt; - 150 poin&lt;/li&gt;
  &lt;li&gt;Peringkat 2: &lt;bdi&gt;إبراهيم&lt;/bdi&gt; - 120 poin&lt;/li&gt;
  &lt;li&gt;Peringkat 3: &lt;bdi&gt;Budi Santoso&lt;/bdi&gt; - 95 poin&lt;/li&gt;
&lt;/ul&gt;</pre>
<h3>Atribut <code>dir=&quot;auto&quot;</code> pada Input dan Paragraf Komentar</h3>
<p>Jika Anda menyediakan <code>&lt;textarea&gt;</code> atau menampilkan <code>&lt;p&gt;</code> komentar yang bahasanya ditentukan oleh pengguna, pasang atribut <strong><code>dir=&quot;auto&quot;</code></strong>! Peramban akan memeriksa karakter huruf pertama yang diketikkan pengguna: jika diawali huruf Latin, kotak input otomatis rata kiri (<code>ltr</code>); jika diawali huruf Arab, kotak input otomatis beralih menjadi rata kanan (<code>rtl</code>)!</p>
<pre>&lt;label for=&quot;komentar-diskusi&quot;&gt;Tulis Komentar Anda&lt;/label&gt;
&lt;textarea id=&quot;komentar-diskusi&quot; name=&quot;komentar&quot; dir=&quot;auto&quot; rows=&quot;3&quot;&gt;&lt;/textarea&gt;</pre>
<h2>2. Mencegah Penerjemahan Otomatis yang Merusak Kode (<code>translate=&quot;no&quot;</code>)</h2>
<p>Fitur penerjemah halaman otomatis di peramban (seperti Google Translate bawaan Chrome) sangat membantu pembaca internasional, tetapi sering kali <strong>ikut menerjemahkan nama perintah terminal, kata kunci bahasa pemrograman, atau nama merek</strong> (misalnya mengubah perintah <code>go run main.go</code> menjadi <code>pergi lari utama.pergi</code>!).</p>
<p>Gunakan atribut global standar HTML <strong><code>translate=&quot;no&quot;</code></strong> pada blok kode, nama merek, atau istilah yang tidak boleh diterjemahkan oleh mesin penerjemah:</p>
<pre>&lt;p&gt;
  Untuk menjalankan server pengembangan di &lt;span translate=&quot;no&quot;&gt;Kodeloka&lt;/span&gt;,
  ketik perintah berikut di terminal:
&lt;/p&gt;
&lt;pre translate=&quot;no&quot;&gt;&lt;code&gt;npm run dev&lt;/code&gt;&lt;/pre&gt;</pre>
<h2>3. Anotasi Pelafalan Aksara dengan <code>&lt;ruby&gt;</code>, <code>&lt;rt&gt;</code>, dan <code>&lt;rp&gt;</code></h2>
<p>Untuk situs edukasi bahasa atau istilah teknis yang membutuhkan panduan cara baca di atas huruf (seperti Furigana pada huruf Kanji Jepang, Pinyin pada Mandarin, atau transliterasi aksara), HTML menyediakan elemen semantik <strong><code>&lt;ruby&gt;</code></strong>, **<code>&lt;rt&gt;</code> (<em>ruby text</em>)<strong>, dan </strong><code>&lt;rp&gt;</code> (<em>ruby fallback parenthesis</em>)**:</p>
<pre>&lt;p&gt;
  Istilah Jepang untuk perbaikan berkelanjutan adalah
  &lt;ruby&gt;
    改善 &lt;rp&gt;(&lt;/rp&gt;&lt;rt&gt;kaizen&lt;/rt&gt;&lt;rp&gt;)&lt;/rp&gt;
  &lt;/ruby&gt;.
&lt;/p&gt;</pre>
<h2>4. Menulis Rumus Matematika Secara Semantik dengan <code>&lt;math&gt;</code> (MathML Core)</h2>
<p>Dulu, menampilkan rumus matematika kompleks di web mengharuskan pengiriman gambar statis atau pustaka JavaScript besar. Kini, <strong>MathML Core (<code>&lt;math&gt;</code>)</strong> telah berstatus <strong>Baseline Widely Available</strong> (didukung secara asli di Chrome, Edge, Firefox, dan Safari tanpa plugin atau JavaScript)!</p>
<p>Tag dasar di dalam <code>&lt;math&gt;</code> (gunakan atribut <code>display=&quot;block&quot;</code> untuk rumus yang berdiri di tengah baris baru, atau biarkan bawaan untuk rumus sebaris):</p>
<ul><li>**<code>&lt;mi&gt;</code> (<em>math identifier</em>):** Nama variabel atau konstanta (misalnya <code>x</code>, <code>n</code>, <code>π</code>; satu karakter otomatis dicetak miring).</li><li>**<code>&lt;mn&gt;</code> (<em>math number</em>):** Angka (misalnya <code>2</code>, <code>10</code>).</li><li>**<code>&lt;mo&gt;</code> (<em>math operator</em>):** Operator matematika (<code>+</code>, <code>=</code>, <code>−</code>, <code>∑</code>).</li><li><strong><code>&lt;msup&gt;</code> / <code>&lt;msub&gt;</code>:</strong> Pangkat (<em>superscript</em>) dan indeks bawah (<em>subscript</em>).</li><li><strong><code>&lt;mfrac&gt;</code>:</strong> Pecahan (anak pertama adalah pembilang di atas, anak kedua adalah penyebut di bawah).</li><li><strong><code>&lt;msqrt&gt;</code>:</strong> Akar kuadrat.</li><li><strong><code>&lt;mrow&gt;</code>:</strong> Pengelompokan ekspresi (seperti tanda kurung tak terlihat untuk menyatukan beberapa elemen menjadi satu bagian pembilang/penyebut).</li></ul>
<pre>&lt;p&gt;
  Kompleksitas waktu pencarian biner (&lt;em&gt;Binary Search&lt;/em&gt;) pada
  &lt;math&gt;&lt;mi&gt;n&lt;/mi&gt;&lt;/math&gt; elemen yang terurut adalah:
&lt;/p&gt;

&lt;math display=&quot;block&quot;&gt;
  &lt;mrow&gt;
    &lt;mi&gt;T&lt;/mi&gt;
    &lt;mo&gt;(&lt;/mo&gt;&lt;mi&gt;n&lt;/mi&gt;&lt;mo&gt;)&lt;/mo&gt;
    &lt;mo&gt;=&lt;/mo&gt;
    &lt;mi&gt;O&lt;/mi&gt;
    &lt;mo&gt;(&lt;/mo&gt;
    &lt;msub&gt;&lt;mi&gt;log&lt;/mi&gt;&lt;mn&gt;2&lt;/mn&gt;&lt;/msub&gt;
    &lt;mi&gt;n&lt;/mi&gt;
    &lt;mo&gt;)&lt;/mo&gt;
  &lt;/mrow&gt;
&lt;/math&gt;

&lt;p&gt;Rumus kuadrat (rumus ABC) yang dirender langsung oleh mesin peramban:&lt;/p&gt;

&lt;math display=&quot;block&quot;&gt;
  &lt;mrow&gt;
    &lt;mi&gt;x&lt;/mi&gt;
    &lt;mo&gt;=&lt;/mo&gt;
    &lt;mfrac&gt;
      &lt;mrow&gt;
        &lt;mo&gt;−&lt;/mo&gt;&lt;mi&gt;b&lt;/mi&gt;
        &lt;mo&gt;±&lt;/mo&gt;
        &lt;msqrt&gt;
          &lt;mrow&gt;
            &lt;msup&gt;&lt;mi&gt;b&lt;/mi&gt;&lt;mn&gt;2&lt;/mn&gt;&lt;/msup&gt;
            &lt;mo&gt;−&lt;/mo&gt;
            &lt;mn&gt;4&lt;/mn&gt;&lt;mi&gt;a&lt;/mi&gt;&lt;mi&gt;c&lt;/mi&gt;
          &lt;/mrow&gt;
        &lt;/msqrt&gt;
      &lt;/mrow&gt;
      &lt;mrow&gt;
        &lt;mn&gt;2&lt;/mn&gt;&lt;mi&gt;a&lt;/mi&gt;
      &lt;/mrow&gt;
    &lt;/mfrac&gt;
  &lt;/mrow&gt;
&lt;/math&gt;</pre>
<p>Keunggulan menggunakan <code>&lt;math&gt;</code> bawaan: rumus langsung tajam di semua tingkat perbesaran layar, mengikuti warna teks CSS (<code>color</code>) dan ukuran huruf (<code>font-size</code>), serta dapat dibacakan oleh pembaca layar yang mendukung MathML (tingkat dukungan masih bervariasi antar-peramban dan pembaca layar, jadi uji dengan teknologi bantu yang dipakai pembaca Anda).</p>
<h2>Latihan Praktik: Halaman Materi Algoritma Multibahasa dan Matematika</h2>
<p>Buatlah berkas <code>mathml-dan-bidi.html</code>:</p>
<ol><li>Buat daftar 3 kontributor dari berbagai negara menggunakan elemen <code>&lt;bdi&gt;</code> agar tanda baca di sekitarnya terlindungi.</li><li>Tambahkan blok kode perintah terminal yang dilindungi dengan <code>translate=&quot;no&quot;</code>.</li><li>Tulis rumus Teorema Pythagoras (<code>a² + b² = c²</code>) dan rumus rata-rata pecahan menggunakan elemen <code>&lt;math display=&quot;block&quot;&gt;</code>, <code>&lt;msup&gt;</code>, <code>&lt;mfrac&gt;</code>, <code>&lt;mi&gt;</code>, <code>&lt;mn&gt;</code>, dan <code>&lt;mo&gt;</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://html.spec.whatwg.org/multipage/text-level-semantics.html" rel="noopener">Text-level semantics (<code>bdi</code>, <code>bdo</code>, <code>ruby</code>) — WHATWG HTML Living Standard</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements" rel="noopener">HTML elements reference (<code>&lt;math&gt;</code>, <code>&lt;bdi&gt;</code>, <code>&lt;ruby&gt;</code>) — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["<bdi>","<math>","translate=\"no\"","dir=\"auto\"","<ruby>","<rt>"],
    kuis: [
        {"tanya":"Mengapa kita perlu membungkus nama pengguna dinamis dengan elemen <bdi> ketika menampilkannya di tengah kalimat berbahasa Indonesia (misalnya <li>Pemenang: <bdi>...</bdi> (100 poin)</li>)?","opsi":["Agar nama pengguna otomatis dicetak tebal oleh peramban.","Untuk mengisolasi arah penulisan teks di dalam <bdi> (misalnya jika nama pengguna ditulis dalam aksara Arab yang berarah kanan-ke-kiri) supaya tidak membalikkan posisi tanda kurung dan angka \" (100 poin)\" yang berada di sebelahnya.","Untuk mencegah mesin pencari mengindeks nama pengguna tersebut.","Agar nama pengguna otomatis diterjemahkan ke Bahasa Indonesia."],"benar":1,"penjelasan":"Elemen <bdi> (Bidirectional Isolate) memisahkan perhitungan algoritma Unicode Bidirectional antara teks di dalamnya dan teks di sekitarnya, sehingga tanda baca dan angka di luar <bdi> tidak ikut tertarik terbalik."},
        {"tanya":"Atribut standar HTML apakah yang digunakan untuk memberi tahu fitur penerjemah otomatis peramban (seperti Google Translate) agar tidak menerjemahkan isi dari elemen <code> atau nama merek produk?","opsi":["lang=\"none\"","translate=\"no\"","dir=\"ltr\"","spellcheck=\"false\""],"benar":1,"penjelasan":"Atribut global translate=\"no\" merupakan standar spesifikasi WHATWG HTML yang dipatuhi oleh mesin penerjemah peramban dan layanan lokalisasi untuk melewati penerjemahan pada elemen tersebut."},
        {"tanya":"Di dalam elemen <math> (MathML), tag manakah yang digunakan untuk membuat pecahan matematika (pembilang di atas dan penyebut di bawah)?","opsi":["<mdiv>","<mfrac>","<msup>","<msqrt>"],"benar":1,"penjelasan":"Elemen <mfrac> (math fraction) menerima tepat dua elemen anak (atau dua grup <mrow>): anak pertama dirender sebagai pembilang di bagian atas, dan anak kedua dirender sebagai penyebut di bagian bawah."}
    ]
},
{
    id: 24,
    kategori: "6 · Metadata & Performa",
    judul: "Metadata Dokumen, SEO Teknis, Open Graph, dan JSON-LD",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["<title>","<link rel=\"canonical\">","og:image"],
    ringkas: "Mengoptimalkan keterbacaan halaman oleh mesin pencari dan platform media sosial menggunakan <title>, <meta name=\"description\">, <link rel=\"canonical\">, protokol Open Graph, ikon aplikasi modern, serta data terstruktur JSON-LD.",
    isi: `
<h2>Bagaimana Mesin Pencari dan Aplikasi Pesan Membaca Halaman Anda?</h2>
<p>Ketika seseorang membagikan tautan kelas Kodeloka di WhatsApp, Telegram, Slack, atau LinkedIn, aplikasi tersebut tidak menyalakan peramban penuh untuk memotret layar. Sebaliknya, bot mereka melakukan permintaan HTTP singkat untuk membaca bagian <code>&lt;head&gt;</code> dari dokumen HTML Anda dan mencari <strong>metadata</strong>.</p>
<p>Begitu pula dengan mesin pencari seperti Google atau Bing: sebelum menganalisis isi <code>&lt;main&gt;</code>, mereka memeriksa <code>&lt;title&gt;</code>, <code>&lt;meta name=&quot;robots&quot;&gt;</code>, <code>&lt;link rel=&quot;canonical&quot;&gt;</code>, dan <strong>Structured Data (JSON-LD)</strong> untuk memahami topik halaman, mencegah duplikasi URL, dan menampilkan <em>Rich Results</em> (cuplikan kaya di halaman hasil pencarian).</p>
<h2>1. Metadata Inti untuk Mesin Pencari (SEO Teknis)</h2>
<h3>A. <code>&lt;title&gt;</code> dan <code>&lt;meta name=&quot;description&quot;&gt;</code></h3>
<p>Dua elemen ini menentukan bagaimana halaman Anda tampil di halaman hasil mesin pencari (<em>Search Engine Results Page</em> / SERP):</p>
<pre>&lt;title&gt;Belajar PostgreSQL Bahasa Indonesia: Indeks, MVCC, dan Replikasi — Kodeloka&lt;/title&gt;
&lt;meta
  name=&quot;description&quot;
  content=&quot;Pelajari arsitektur PostgreSQL dari dasar hingga produksi: indeks B-Tree, EXPLAIN ANALYZE, transaksi MVCC, VACUUM, partisi tabel, dan replikasi tanpa downtime.&quot;
&gt;</pre>
<p>Prinsip penulisan yang baik:</p>
<ul><li><strong>Unik di setiap halaman:</strong> Jangan pernah menggunakan <code>&lt;title&gt;</code> atau <code>description</code> yang sama persis untuk puluhan halaman berbeda.</li><li><strong>Spesifik dan memuat konteks merek:</strong> Letakkan topik spesifik halaman di depan, diikuti pemisah (<code>—</code> atau <code>|</code>) dan nama situs di belakang (sekitar 50–60 karakter untuk <code>&lt;title&gt;</code>, dan 120–155 karakter untuk <code>description</code>).</li><li><strong>Ingat bahwa <code>&lt;meta name=&quot;keywords&quot;&gt;</code> sudah tidak digunakan:</strong> Mesin pencari modern sepenuhnya mengabaikan <code>&lt;meta name=&quot;keywords&quot;&gt;</code> karena rentan disalahgunakan untuk spam kata kunci.</li></ul>
<h3>B. Mengatasi Duplikasi URL dengan <code>&lt;link rel=&quot;canonical&quot;&gt;</code></h3>
<p>Sebuah halaman web sering kali bisa diakses melalui beberapa variasi URL sekaligus:</p>
<ul><li><code>https://kodeloka.asadinedu.com/postgresql/</code></li><li><code>https://kodeloka.asadinedu.com/postgresql/index.html</code></li><li><code>https://kodeloka.asadinedu.com/postgresql/?utm_source=newsletter&amp;ref=123</code></li></ul>
<p>Jika mesin pencari mengindeks ketiganya sebagai halaman terpisah, reputasi halaman Anda akan terpecah. Solusinya adalah menunjuk <strong>satu alamat resmi (kanonik)</strong> menggunakan <code>&lt;link rel=&quot;canonical&quot;&gt;</code>:</p>
<pre>&lt;link rel=&quot;canonical&quot; href=&quot;https://kodeloka.asadinedu.com/postgresql/&quot;&gt;</pre>
<h3>C. Mengatur Perilaku Pengindeksan dengan <code>&lt;meta name=&quot;robots&quot;&gt;</code></h3>
<p>Secara bawaan, mesin pencari akan mengindeks halaman dan mengikuti tautan di dalamnya (<code>index, follow</code>). Namun, untuk halaman yang <strong>tidak boleh</strong> muncul di hasil pencarian Google (seperti halaman hasil pencarian internal, halaman dasbor privat, atau halaman <em>staging</em>), tambahkan:</p>
<pre>&lt;meta name=&quot;robots&quot; content=&quot;noindex, nofollow&quot;&gt;</pre>
<div class="callout info"><p><strong>Catatan keamanan:</strong> <code>noindex</code> hanya meminta mesin pencari tidak menampilkan halaman. Itu bukan pengamanan akses. Halaman dasbor atau data privat tetap harus dilindungi autentikasi di sisi server.</p></div>
<h2>2. Protokol Open Graph untuk Pratinjau Media Sosial dan Chat</h2>
<p>Agar tautan yang dibagikan di aplikasi pesan dan media sosial menampilkan kartu pratinjau lengkap dengan gambar sampul, judul, dan deskripsi, gunakan atribut <code>property=&quot;og:...&quot;</code> dari protokol <strong>Open Graph</strong>:</p>
<pre>&lt;!-- Open Graph Metadata --&gt;
&lt;meta property=&quot;og:type&quot; content=&quot;article&quot;&gt;
&lt;meta property=&quot;og:site_name&quot; content=&quot;Kodeloka&quot;&gt;
&lt;meta property=&quot;og:locale&quot; content=&quot;id_ID&quot;&gt;
&lt;meta property=&quot;og:title&quot; content=&quot;Belajar PostgreSQL: Indeks, EXPLAIN ANALYZE, dan MVCC&quot;&gt;
&lt;meta property=&quot;og:description&quot; content=&quot;Kurikulum PostgreSQL berbahasa Indonesia lengkap dengan latihan dan kuis interaktif.&quot;&gt;
&lt;meta property=&quot;og:url&quot; content=&quot;https://kodeloka.asadinedu.com/postgresql/&quot;&gt;
&lt;meta property=&quot;og:image&quot; content=&quot;https://kodeloka.asadinedu.com/assets/og-postgresql.png&quot;&gt;
&lt;meta property=&quot;og:image:width&quot; content=&quot;1200&quot;&gt;
&lt;meta property=&quot;og:image:height&quot; content=&quot;630&quot;&gt;
&lt;meta property=&quot;og:image:alt&quot; content=&quot;Kartu kelas PostgreSQL di Kodeloka&quot;&gt;

&lt;!-- Twitter / X Card Metadata --&gt;
&lt;meta name=&quot;twitter:card&quot; content=&quot;summary_large_image&quot;&gt;</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Kesalahan Umum: Menggunakan Jalur Relatif pada <code>og:image</code> dan <code>canonical</code></div><p>Berbeda dengan <code>&lt;img src=&quot;/assets/logo.png&quot;&gt;</code> yang dibaca oleh peramban dalam konteks domain aktif, perayap bot media sosial sering mengekstrak tag <code>og:image</code> dan <code>&lt;link rel=&quot;canonical&quot;&gt;</code> secara mentah. Oleh karena itu, <strong>selalu gunakan URL absolut lengkap dengan <code>https://...</code></strong> pada <code>og:image</code>, <code>og:url</code>, dan <code>rel=&quot;canonical&quot;</code>!</p></div>
<h2>3. Set Favicon Modern yang Ringkas</h2>
<p>Di masa lalu, generator favicon menghasilkan belasan baris tag <code>&lt;link&gt;</code> untuk berbagai ukuran layar lama. Untuk peramban modern, Anda cukup menggunakan kombinasi <strong>empat baris</strong> berikut (mendukung vektor SVG yang tajam sekaligus tema gelap/terang!):</p>
<pre>&lt;link rel=&quot;icon&quot; href=&quot;/favicon.ico&quot; sizes=&quot;32x32&quot;&gt;
&lt;link rel=&quot;icon&quot; href=&quot;/assets/brand/icon.svg&quot; type=&quot;image/svg+xml&quot;&gt;
&lt;link rel=&quot;apple-touch-icon&quot; href=&quot;/assets/brand/apple-touch-icon.png&quot;&gt;
&lt;link rel=&quot;manifest&quot; href=&quot;/manifest.webmanifest&quot;&gt;</pre>
<p>Di dalam berkas <code>icon.svg</code>, Anda bahkan dapat menyematkan <code>&lt;style&gt;</code> dengan <code>@media (prefers-color-scheme: dark)</code> agar warna favicon otomatis menyesuaikan tema gelap atau terang di tab peramban pengguna!</p>
<h2>4. Data Terstruktur dengan JSON-LD (<code>application/ld+json</code>)</h2>
<p>Selain membaca teks HTML, mesin pencari memahami entitas secara presisi (apakah halaman ini sebuah kursus/<code>Course</code>, artikel teknis/<code>TechArticle</code>, resep masakan, atau daftar tanya-jawab/<code>FAQPage</code>) melalui kosakata <strong>Schema.org</strong> yang ditulis dalam format <strong>JSON-LD</strong> di dalam <code>&lt;script type=&quot;application/ld+json&quot;&gt;</code>:</p>
<pre>&lt;script type=&quot;application/ld+json&quot;&gt;
{
  &quot;@context&quot;: &quot;https://schema.org&quot;,
  &quot;@type&quot;: &quot;Course&quot;,
  &quot;name&quot;: &quot;Kelas Dasar HTML Modern&quot;,
  &quot;description&quot;: &quot;Pelajari fondasi HTML dari cara kerja web, struktur semantik, formulir, aksesibilitas, hingga SEO teknis.&quot;,
  &quot;inLanguage&quot;: &quot;id&quot;,
  &quot;isAccessibleForFree&quot;: true,
  &quot;provider&quot;: {
    &quot;@type&quot;: &quot;Organization&quot;,
    &quot;name&quot;: &quot;Kodeloka — Asadin Edu&quot;,
    &quot;sameAs&quot;: &quot;https://kodeloka.asadinedu.com&quot;
  }
}
&lt;/script&gt;</pre>
<p>Perhatikan bahwa Kodeloka sendiri menggunakan teknik JSON-LD ini di <code>scripts/build.mjs</code> untuk setiap halaman kelas dan modulnya!</p>
<h2>Latihan Praktik: Menyusun <code>&lt;head&gt;</code> Siap Produksi</h2>
<p>Buatlah berkas <code>seo-modul.html</code> untuk halaman artikel berjudul <em>&quot;Panduan Keamanan Cookie dan Sesi di PHP&quot;</em> yang berada di URL resmi <code>https://kodeloka.asadinedu.com/php/materi/09-session-dan-cookie/</code>:</p>
<ol><li>Lengkapi <code>&lt;title&gt;</code>, <code>&lt;meta name=&quot;description&quot;&gt;</code>, dan <code>&lt;link rel=&quot;canonical&quot;&gt;</code> dengan URL absolut.</li><li>Tambahkan metadata Open Graph lengkap termasuk dimensi gambar <code>1200×630</code> dan teks alternatif <code>og:image:alt</code>.</li><li>Tambahkan blok <code>&lt;script type=&quot;application/ld+json&quot;&gt;</code> bertipe <code>&quot;TechArticle&quot;</code> yang mencantumkan <code>headline</code>, <code>datePublished</code> (<code>&quot;2026-10-16&quot;</code>), <code>inLanguage</code> (<code>&quot;id&quot;</code>), dan <code>author</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_documents" rel="noopener">Structuring documents — MDN Web Docs</a></li><li><a href="https://html.spec.whatwg.org/multipage/" rel="noopener">HTML Standard (<code>link</code> and <code>meta</code> elements) — WHATWG</a></li><li><a href="https://web.dev/learn/html" rel="noopener">Learn HTML — web.dev</a></li></ul></div>
`,
    perintah: ["<title>","<link rel=\"canonical\">","og:image","<head>","<meta name=\"robots\">","<meta name=\"description\">"],
    kuis: [
        {"tanya":"Mengapa halaman web produksi sebaiknya memiliki elemen <link rel=\"canonical\" href=\"https://...\"> di dalam <head>?","opsi":["Agar peramban mengunduh seluruh gambar di halaman secara paralel.","Untuk memberitahu mesin pencari alamat URL utama yang resmi dari halaman tersebut, sehingga mencegah terpecahnya reputasi indeks akibat variasi parameter query (seperti ?utm_source=...).","Untuk memblokir peramban versi lama agar tidak dapat membuka halaman.","Untuk mengalihkan (redirect) pengguna secara otomatis ke situs eksternal."],"benar":1,"penjelasan":"Parameter pelacakan atau variasi jalur URL sering membuat satu konten yang sama dapat diakses lewat banyak URL. Tag rel=\"canonical\" memberi tahu mesin pencari URL mana yang harus diindeks sebagai sumber utama."},
        {"tanya":"Bagaimana cara yang benar untuk menuliskan nilai atribut content pada <meta property=\"og:image\" content=\"...\"> agar kartu pratinjau tampil di WhatsApp, Telegram, dan LinkedIn?","opsi":["Cukup menuliskan nama berkasnya saja, misalnya content=\"sampul.png\".","Menggunakan jalur relatif dokumen seperti content=\"../assets/sampul.png\".","Menggunakan URL absolut lengkap dengan protokol dan nama domain, misalnya content=\"https://kodeloka.asadinedu.com/assets/sampul.png\".","Menyematkan kode SVG mentah langsung di dalam atribut content."],"benar":2,"penjelasan":"Platform pratinjau seperti Facebook, WhatsApp, dan LinkedIn mengharapkan nilai og:image dan og:url berupa URL absolut lengkap (https://...) agar perayap eksternal dapat mengunduh gambar tersebut secara langsung tanpa salah menebak domain."},
        {"tanya":"Format manakah yang direkomendasikan di dalam elemen <head> untuk menyajikan data terstruktur (structured data berbasis Schema.org) kepada mesin pencari modern tanpa mengotori markup elemen visual di <body>?","opsi":["<script type=\"application/ld+json\">","<meta name=\"keywords\">","<style type=\"text/schema\">","<xml id=\"schema-data\">"],"benar":0,"penjelasan":"JSON-LD (<script type=\"application/ld+json\">) memisahkan metadata terstruktur Schema.org dalam format JSON murni yang mudah dibuat, divalidasi, dan dipelihara tanpa perlu menempelkan atribut microdata pada setiap tag HTML di dalam <body>."}
    ]
},
{
    id: 25,
    kategori: "6 · Metadata & Performa",
    judul: "Performa Pemuatan HTML, Resource Hints, dan Core Web Vitals",
    tingkat: "Lanjut", durasi: "10 mnt",
    tag: ["loading=\"lazy\"","preload","<script>"],
    ringkas: "Mengoptimalkan kecepatan pemuatan halaman dan metrik Core Web Vitals (LCP, INP, CLS) langsung dari markup HTML melalui strategi pemuatan skrip (defer, async, type=\"module\"), loading=\"lazy\", fetchpriority, dan Resource Hints (preconnect, preload).",
    isi: `
<h2>Mengapa Performa Dimulai dari Markup HTML?</h2>
<p>Banyak pengembang baru memikirkan performa saat aplikasi sudah lambat, lalu berusaha mengoptimalkan kode JavaScript yang rumit. Padahal, keputusan paling menentukan terhadap seberapa cepat layar pertama tampil justru terjadi pada <strong>detik pertama peramban membaca berkas HTML Anda</strong>.</p>
<p>Tiga metrik pengalaman pengguna utama yang diukur oleh standar industri (<strong>Core Web Vitals</strong> di <a href="https://web.dev/" rel="noopener">web.dev</a>) sangat dipengaruhi oleh cara Anda menulis HTML:</p>
<table><thead><tr><th>Metrik Core Web Vitals</th><th>Apa yang Diukur?</th><th>Target Baik</th><th>Peran Langsung Markup HTML</th></tr></thead><tbody><tr><td>**LCP (<em>Largest Contentful Paint</em>)**</td><td>Waktu hingga elemen konten terbesar di layar pertama (biasanya gambar <em>hero</em> atau judul utama) selesai ditampilkan.</td><td><strong>≤ 2,5 detik</strong></td><td>Urutan <code>&lt;link&gt;</code>, penggunaan <code>fetchpriority=&quot;high&quot;</code> pada gambar utama, dan menghindari <code>loading=&quot;lazy&quot;</code> pada gambar teratas.</td></tr><tr><td>**INP (<em>Interaction to Next Paint</em>)**</td><td>Ketanggapan halaman saat pengguna mengeklik atau mengetik hingga perubahan visual berikutnya muncul di layar.</td><td><strong>≤ 200 ms</strong></td><td>Memanfaatkan komponen HTML bawaan (<code>&lt;dialog&gt;</code>, <code>&lt;details&gt;</code>, <code>popover</code>) dan mencegah <code>&lt;script&gt;</code> besar memblokir utas utama (<em>main thread</em>).</td></tr><tr><td>**CLS (<em>Cumulative Layout Shift</em>)**</td><td>Kestabilan visual halaman (apakah elemen melompat-lompat secara tiba-tiba saat halaman dimuat).</td><td><strong>≤ 0,1</strong></td><td>Selalu mencantumkan atribut <code>width</code> dan <code>height</code> pada <code>&lt;img&gt;</code>, <code>&lt;video&gt;</code>, dan <code>&lt;iframe&gt;</code>.</td></tr></tbody></table>
<h2>1. Mengendalikan Pemuatan <code>&lt;script&gt;</code>: Biasa vs <code>async</code> vs <code>defer</code> vs <code>type=&quot;module&quot;</code></h2>
<p>Ketika parser HTML sedang membaca dokumen dari atas ke bawah lalu menemukan tag <code>&lt;script src=&quot;...&quot;&gt;</code> biasa tanpa atribut tambahan, parser <strong>wajib berhenti sejenak</strong>, mengunduh berkas skrip tersebut, dan menjalankannya sampai selesai sebelum berani melanjutkan membaca baris HTML berikutnya. Mengapa? Karena skrip kuno mungkin memanggil <code>document.write()</code> yang mengubah struktur HTML.</p>
<p>Di era modern, Anda memiliki opsi yang jauh lebih efisien:</p>
<pre>1. &lt;script src=&quot;app.js&quot;&gt; (Tanpa atribut — Buruk di dalam &lt;head&gt;)
HTML Parsing: ████████░░░░░░░░░░░░░░░░░████████████
Unduh JS:             ▓▓▓▓▓▓▓
Eksekusi JS:                 ▒▒▒▒▒▒▒▒▒▒

2. &lt;script src=&quot;analytics.js&quot; async&gt;
HTML Parsing: ████████████████░░░░░████████████████
Unduh JS:         ▓▓▓▓▓▓▓▓
Eksekusi JS:              ▒▒▒▒▒ (Langsung jalan begitu selesai diunduh; urutan tidak dijamin)

3. &lt;script src=&quot;app.js&quot; defer&gt; atau &lt;script type=&quot;module&quot; src=&quot;app.js&quot;&gt;
HTML Parsing: █████████████████████████████████████ (Tidak terputus sama sekali!)
Unduh JS:         ▓▓▓▓▓▓▓▓▓
Eksekusi JS:                                       ▒▒▒▒▒▒ (Jalan berurutan setelah DOM siap)</pre>
<h3>Aturan Praktis Memilih Atribut <code>&lt;script&gt;</code></h3>
<ol><li><strong>Gunakan <code>&lt;script type=&quot;module&quot; src=&quot;...&quot;&gt;</code> atau <code>&lt;script src=&quot;...&quot; defer&gt;</code> untuk hampir semua skrip aplikasi Anda:</strong><ul><li>Berkas diunduh secara paralel di latar belakang tanpa menghentikan pembentukan DOM.</li><li>Eksekusi baru dijalankan setelah seluruh dokumen HTML selesai diurai (tepat sebelum event <code>DOMContentLoaded</code>), dan <strong>urutan eksekusinya dijamin sesuai urutan penulisan tag di HTML</strong>.</li></ul></li><li><strong>Gunakan <code>async</code> hanya untuk skrip pihak ketiga yang benar-benar mandiri:</strong><ul><li>Contoh: skrip analitik ringan yang tidak bergantung pada skrip lain dan tidak perlu menunggu DOM selesai. Jika Anda memiliki <code>a.js</code> dan <code>b.js</code> dengan atribut <code>async</code>, berkas mana pun yang selesai diunduh lebih dulu akan langsung dijalankan lebih dulu!</li></ul></li></ol>
<h2>2. Pemuatan Malas (<code>loading=&quot;lazy&quot;</code>) dan Prioritas (<code>fetchpriority</code>)</h2>
<h3>Aturan Emas <code>loading=&quot;lazy&quot;</code> pada <code>&lt;img&gt;</code> dan <code>&lt;iframe&gt;</code></h3>
<p>Atribut <code>loading=&quot;lazy&quot;</code> (status <strong>Baseline Widely Available</strong>) memerintahkan peramban untuk **menunda pengunduhan gambar atau iframe yang berada jauh di bawah layar (<em>below the fold</em>)** sampai pengguna mulai menggulir mendekati elemen tersebut.</p>
<p>Namun, perhatikan satu jebakan yang sangat sering merusak skor <strong>LCP</strong>:</p>
<div class="callout info"><p>**🚫 Jangan Pernah Memasang <code>loading=&quot;lazy&quot;</code> pada Gambar di Layar Pertama (<em>Above the Fold</em>)!** Jika gambar sampul utama (<em>hero image</em>) di bagian paling atas halaman diberi <code>loading=&quot;lazy&quot;</code>, peramban akan menahan pengunduhannya sampai tata letak selesai dihitung. Akibatnya, gambar utama justru muncul terlambat!</p>
<p>Sebaliknya, untuk <strong>satu gambar utama terpenting di layar pertama (elemen LCP)</strong>, biarkan pemuatannya <em>eager</em> (bawaan) dan tambahkan atribut <strong><code>fetchpriority=&quot;high&quot;</code></strong>:</p></div>
<pre>&lt;!-- 1. Gambar Utama di Layar Pertama (Hero / LCP):
        JANGAN pakai loading=&quot;lazy&quot;, dan beri fetchpriority=&quot;high&quot; --&gt;
&lt;img
  src=&quot;/assets/sampul-kelas-utama.avif&quot;
  alt=&quot;Ilustrasi arsitektur pengembangan web modern&quot;
  width=&quot;1200&quot;
  height=&quot;630&quot;
  fetchpriority=&quot;high&quot;
&gt;

&lt;!-- 2. Gambar-gambar di Bagian Bawah Artikel (Below the Fold):
        Gunakan loading=&quot;lazy&quot; dan decoding=&quot;async&quot; untuk menghemat kuota awal --&gt;
&lt;img
  src=&quot;/assets/diagram-bab-3.webp&quot;
  alt=&quot;Diagram alur pembentukan pohon DOM dan CSSOM&quot;
  width=&quot;800&quot;
  height=&quot;450&quot;
  loading=&quot;lazy&quot;
  decoding=&quot;async&quot;
&gt;</pre>
<h2>3. Resource Hints: <code>preconnect</code>, <code>dns-prefetch</code>, <code>preload</code>, dan <code>modulepreload</code></h2>
<p>Terkadang peramban baru menyadari bahwa ia membutuhkan sebuah fon web (<code>@font-face</code>) atau gambar latar setelah selesai mengunduh dan membaca berkas CSS. Anda dapat memberi petunjuk lebih awal kepada peramban di dalam <code>&lt;head&gt;</code> menggunakan elemen <code>&lt;link&gt;</code>:</p>
<table><thead><tr><th>Nilai <code>rel</code></th><th>Fungsi</th><th>Kapan Digunakan?</th></tr></thead><tbody><tr><td><code>preconnect</code></td><td>Melakukan resolusi DNS, jabat tangan TCP, dan negosiasi TLS lebih awal ke domain pihak ketiga.</td><td>Ketika halaman pasti akan mengambil aset penting (seperti fon atau API) dari domain lain dalam beberapa detik pertama. Batasi maksimal 2–4 domain agar tidak membebani CPU/jaringan.</td></tr><tr><td><code>dns-prefetch</code></td><td>Hanya melakukan resolusi DNS di latar belakang.</td><td>Cadangan ringan untuk domain pihak ketiga tambahan yang tidak terlalu kritis.</td></tr><tr><td><code>preload</code></td><td>Memaksa peramban segera mengunduh satu aset kritis yang dibutuhkan untuk perenderan layar pertama.</td><td>Untuk berkas fon utama (<code>.woff2</code>) atau gambar LCP yang tersembunyi di dalam CSS. <strong>Wajib</strong> menyertakan atribut <code>as=&quot;...&quot;</code> (dan <code>crossorigin</code> untuk fon)!</td></tr><tr><td><code>modulepreload</code></td><td>Mengunduh dan mengurai modul ES (<code>type=&quot;module&quot;</code>) lebih awal ke dalam <em>module map</em>.</td><td>Untuk mempercepat rantai impor modul JavaScript utama aplikasi.</td></tr></tbody></table>
<pre>&lt;head&gt;
  &lt;meta charset=&quot;utf-8&quot;&gt;
  &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;
  &lt;title&gt;Optimasi Pemuatan — Kodeloka&lt;/title&gt;

  &lt;!-- 1. Buka koneksi awal ke server CDN aset statis --&gt;
  &lt;link rel=&quot;preconnect&quot; href=&quot;https://cdn.asadinedu.com&quot; crossorigin&gt;

  &lt;!-- 2. Preload fon utama yang pasti dipakai di layar pertama (wajib ada as=&quot;font&quot; dan crossorigin) --&gt;
  &lt;link
    rel=&quot;preload&quot;
    href=&quot;/assets/fonts/plus-jakarta-sans-v8-latin.woff2&quot;
    as=&quot;font&quot;
    type=&quot;font/woff2&quot;
    crossorigin
  &gt;

  &lt;link rel=&quot;stylesheet&quot; href=&quot;/assets/learning.css&quot;&gt;
  &lt;script type=&quot;module&quot; src=&quot;/assets/learning.js&quot;&gt;&lt;/script&gt;
&lt;/head&gt;</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Peringatan Penting tentang <code>preload</code></div><p>Jangan mem-<code>preload</code> semuanya! Jika Anda menandai 10 berkas sebagai <code>preload</code>, maka tidak ada lagi yang benar-benar menjadi prioritas dan jaringan pengguna justru macet. Selain itu, jika Anda mem-<code>preload</code> sebuah berkas tetapi berkas tersebut tidak digunakan dalam waktu beberapa detik setelah halaman dimuat, peramban akan mencetak peringatan di konsol karena Anda membuang kuota data pengguna.</p></div>
<h2>Latihan Praktik: Mengoptimalkan Halaman Artikel yang Lambat</h2>
<p>Bayangkan sebuah halaman artikel yang saat ini memiliki masalah performa berikut:</p>
<ul><li>Memuat <code>&lt;script src=&quot;app.js&quot;&gt;&lt;/script&gt;</code> di baris pertama <code>&lt;head&gt;</code> tanpa atribut.</li><li>Memasang <code>loading=&quot;lazy&quot;</code> pada semua gambar termasuk banner utama di bagian paling atas halaman.</li><li>Tidak mencantumkan <code>width</code> dan <code>height</code> pada 5 gambar ilustrasi di dalam artikel.</li></ul>
<p>Tulislah berkas <code>artikel-cepat.html</code> yang memperbaiki ketiga masalah di atas serta menambahkan <code>&lt;link rel=&quot;preload&quot;&gt;</code> yang benar untuk satu berkas fon <code>.woff2</code> lokal!</p>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Lazy_loading" rel="noopener">Lazy loading — MDN Web Docs</a></li><li><a href="https://web.dev/articles/lcp" rel="noopener">Largest Contentful Paint (LCP) — web.dev</a></li><li><a href="https://web.dev/articles/inp" rel="noopener">Interaction to Next Paint (INP) — web.dev</a></li><li><a href="https://web.dev/articles/cls" rel="noopener">Cumulative Layout Shift (CLS) — web.dev</a></li></ul></div>
`,
    perintah: ["loading=\"lazy\"","preload","<script>","async","<link>","fetchpriority=\"high\""],
    kuis: [
        {"tanya":"Apa perbedaan utama antara <script src=\"app.js\" async> dan <script src=\"app.js\" defer>?","opsi":["async mengunduh skrip setelah halaman selesai dirender, sedangkan defer menghentikan pembacaan HTML.","Keduanya mengunduh skrip secara paralel tanpa memblokir parser HTML, namun async langsung mengeksekusi skrip begitu unduhan selesai (tanpa menjamin urutan), sedangkan defer menunggu hingga penguraian HTML selesai dan mengeksekusi skrip secara berurutan.","defer hanya boleh digunakan untuk skrip dari domain eksternal, sedangkan async untuk skrip lokal.","async secara otomatis mengubah kode JavaScript biasa menjadi WebAssembly."],"benar":1,"penjelasan":"Baik async maupun defer mengunduh berkas di latar belakang. Namun, async mengeksekusi skrip secepat mungkin segera setelah unduhannya selesai (sehingga berisiko berjalan sebelum DOM siap atau mendahului skrip lain), sedangkan defer menjamin eksekusi dilakukan secara berurutan setelah dokumen HTML selesai diurai menjadi DOM."},
        {"tanya":"Manakah strategi yang paling tepat untuk menangani gambar sampul utama (hero image) yang tampil penuh di bagian paling atas layar pertama (above the fold) agar skor Largest Contentful Paint (LCP) optimal?","opsi":["Menambahkan loading=\"lazy\" dan fetchpriority=\"low\" pada gambar tersebut.","Tidak menggunakan loading=\"lazy\" pada gambar utama tersebut, mencantumkan width dan height, serta menambahkan fetchpriority=\"high\".","Menyembunyikan gambar dengan display: none lalu menampilkannya lewat setTimeout setelah 2 detik.","Mengubah gambar foto tersebut menjadi format BMP yang tidak terkompresi."],"benar":1,"penjelasan":"Gambar utama di layar pertama hampir selalu menjadi elemen LCP. Memberikan loading=\"lazy\" justru menunda pemuatannya. Sebaliknya, membiarkan pemuatannya eager (bawaan) dan menambahkan fetchpriority=\"high\" menginstruksikan peramban untuk memprioritaskan unduhan gambar tersebut sejak awal."},
        {"tanya":"Mengapa atribut crossorigin wajib disertakan saat Anda melakukan <link rel=\"preload\" href=\"/fonts/teks.woff2\" as=\"font\" type=\"font/woff2\" crossorigin>, bahkan ketika berkas fon tersebut berada di domain Anda sendiri?","opsi":["Karena berkas fon di dalam CSS (@font-face) selalu diambil menggunakan mode CORS anonim oleh peramban; tanpa atribut crossorigin pada <link rel=\"preload\">, fon akan diunduh dua kali!","Karena peramban hanya mengizinkan format .woff2 dari server pihak ketiga.","Untuk mengenkripsi berkas fon dengan kata sandi.","Agar fon tersebut otomatis berubah menjadi huruf tebal."],"benar":0,"penjelasan":"Spesifikasi CSS Fonts mengharuskan pengambilan fon dilakukan dalam mode anonymous CORS. Jika tag <link rel=\"preload\" as=\"font\"> ditulis tanpa atribut crossorigin, permintaan preload tidak akan cocok dengan permintaan @font-face di CSS, sehingga peramban membuang hasil preload dan mengunduh berkas fon yang sama untuk kedua kalinya."}
    ]
},
{
    id: 26,
    kategori: "7 · Praktik & Proyek",
    judul: "Audit Kualitas HTML, Inspeksi Accessibility Tree, dan Daftar Periksa Produksi",
    tingkat: "Lanjut", durasi: "10 mnt",
    tag: ["<p>","<div>","<a>"],
    ringkas: "Menguji dan memvalidasi dokumen HTML sebelum naik ke produksi melalui pemeriksaan sintaks W3C/WHATWG, inspeksi Accessibility Tree di Browser DevTools, pengauditan struktur heading dan landmark, serta menghindari anti-pola HTML.",
    isi: `
<h2>Mengapa Peramban yang &quot;Pemaaf&quot; Justru Bisa Menyembunyikan Bug?</h2>
<p>Spesifikasi parser HTML5 dirancang agar <strong>tidak pernah gagal menampilkan halaman</strong> meskipun pengembang melakukan kesalahan sintaks (misalnya lupa menutup tag <code>&lt;div&gt;</code>, menaruh <code>&lt;div&gt;</code> di dalam <code>&lt;p&gt;</code>, atau salah mengeja nama atribut). Peramban akan berusaha menebak dan &quot;memperbaiki&quot; pohon DOM secara diam-diam di latar belakang.</p>
<p>Namun, perbaikan diam-diam oleh parser HTML sering menimbulkan bug yang membingungkan!</p>
<h3>Contoh Nyata: Apa yang Terjadi Jika Anda Menaruh <code>&lt;div&gt;</code> di Dalam <code>&lt;p&gt;</code>?</h3>
<p>Menurut spesifikasi HTML, elemen <code>&lt;p&gt;</code> hanya boleh berisi <em>phrasing content</em> (teks dan elemen inline seperti <code>&lt;span&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;code&gt;</code>). <strong>Elemen <code>&lt;p&gt;</code> tidak pernah boleh membungkus elemen blok seperti <code>&lt;div&gt;</code>, <code>&lt;section&gt;</code>, atau <code>&lt;table&gt;</code>!</strong></p>
<p>Perhatikan apa yang dilakukan parser HTML jika Anda menulis kode yang salah ini:</p>
<pre>&lt;!-- KODE YANG DITULIS PENGEMBANG (SALAH): --&gt;
&lt;p class=&quot;kotak-berbingkai&quot;&gt;
  Kalimat pembuka:
  &lt;div class=&quot;isi-kotak&quot;&gt;Rincian di dalam kotak&lt;/div&gt;
&lt;/p&gt;

&lt;!-- APA YANG SEBENARNYA DIHASILKAN DI POHON DOM OLEH BROWSER: --&gt;
&lt;p class=&quot;kotak-berbingkai&quot;&gt;
  Kalimat pembuka:
&lt;/p&gt; &lt;!-- Browser menutup paksa &lt;p&gt; tepat sebelum &lt;div&gt;! --&gt;
&lt;div class=&quot;isi-kotak&quot;&gt;Rincian di dalam kotak&lt;/div&gt;
&lt;p&gt;&lt;/p&gt; &lt;!-- Tag &lt;/p&gt; terakhir diabaikan atau diubah menjadi paragraf kosong! --&gt;</pre>
<p>Akibatnya, <code>.isi-kotak</code> terlempar keluar dari <code>&lt;p class=&quot;kotak-berbingkai&quot;&gt;</code> dan tata letak CSS Anda hancur!</p>
<h2>1. Aturan Keturunan (<em>Content Model</em>) yang Paling Sering Dilanggar</h2>
<p>Hafalkan 5 larangan bersarang (<em>nesting rules</em>) paling krusial di HTML5 ini:</p>
<table><thead><tr><th>Larangan Bersarang</th><th>Mengapa Dilarang &amp; Apa Solusinya?</th></tr></thead><tbody><tr><td><strong><code>&lt;a&gt;</code> di dalam <code>&lt;a&gt;</code></strong> atau <strong><code>&lt;button&gt;</code> di dalam <code>&lt;a&gt;</code></strong> (dan sebaliknya)</td><td><strong>Interactive Content tidak boleh bersarang di dalam Interactive Content!</strong> Pengguna papan ketik dan pembaca layar tidak akan tahu aksi mana yang dipicu saat tombol <code>Enter</code> ditekan.</td></tr><tr><td><strong>Elemen blok (<code>&lt;div&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;table&gt;</code>, <code>&lt;h2&gt;</code>) di dalam <code>&lt;p&gt;</code></strong></td><td>Tag pembuka elemen blok akan langsung menutup tag <code>&lt;p&gt;</code> secara paksa. Gunakan <code>&lt;div&gt;</code> jika ingin membungkus beberapa blok.</td></tr><tr><td><strong>Elemen selain <code>&lt;li&gt;</code> (atau <code>&lt;script&gt;</code>/<code>&lt;template&gt;</code>) sebagai anak langsung <code>&lt;ul&gt;</code> / <code>&lt;ol&gt;</code></strong></td><td>Jangan menaruh <code>&lt;div&gt;</code> atau <code>&lt;p&gt;</code> langsung sebagai anak <code>&lt;ul&gt;</code>; masukkan semuanya ke dalam <code>&lt;li&gt;</code> terlebih dahulu!</td></tr><tr><td><strong><code>&lt;header&gt;</code> atau <code>&lt;footer&gt;</code> di dalam <code>&lt;header&gt;</code> atau <code>&lt;footer&gt;</code></strong></td><td>Tidak diizinkan oleh spesifikasi WHATWG.</td></tr><tr><td><strong>Banyak elemen <code>&lt;main&gt;</code> yang aktif (tidak <code>hidden</code>) dalam satu halaman</strong></td><td>Hanya boleh ada satu <code>&lt;main&gt;</code> yang terlihat per dokumen.</td></tr></tbody></table>
<h3>Bagaimana Jika Seluruh Kartu Produk Harus Bisa Diklik, tetapi di Dalamnya Ada Tombol &quot;Simpan Bookmark&quot;?</h3>
<p>Karena Anda <strong>tidak boleh</strong> membungkus seluruh <code>&lt;article&gt;</code> (yang berisi <code>&lt;button&gt;</code>) di dalam satu tag <code>&lt;a href=&quot;...&quot;&gt;</code> raksasa, gunakan teknik <strong>Stretched Link (Tautan yang Direntangkan lewat CSS <code>::after</code>)</strong>:</p>
<pre>&lt;article class=&quot;kartu-produk&quot;&gt;
  &lt;h3&gt;
    &lt;!-- Tautan hanya membungkus teks judul, tetapi area kliknya direntangkan oleh CSS ::after --&gt;
    &lt;a href=&quot;/kelas/html/&quot; class=&quot;tautan-utama&quot;&gt;Kelas HTML Modern&lt;/a&gt;
  &lt;/h3&gt;
  &lt;p&gt;Pelajari fondasi web dari nol hingga siap produksi.&lt;/p&gt;
  &lt;button type=&quot;button&quot; class=&quot;tombol-bookmark&quot;&gt;Simpan Penanda&lt;/button&gt;
&lt;/article&gt;</pre>
<pre>.kartu-produk {
  position: relative;
}
/* Merentangkan area klik tautan judul ke seluruh permukaan .kartu-produk */
.tautan-utama::after {
  content: &quot;&quot;;
  position: absolute;
  inset: 0;
}
/* Mengangkat tombol bookmark agar berada di atas lapisan ::after */
.tombol-bookmark {
  position: relative;
  z-index: 1;
}</pre>
<p>Hasilnya: struktur HTML 100% valid (tidak ada <code>&lt;button&gt;</code> di dalam <code>&lt;a&gt;</code>), urutan fokus tombol <code>Tab</code> sangat bersih, namun pengguna tetikus tetap bisa mengeklik bagian mana saja dari kartu tersebut!</p>
<h2>2. Menginspeksi <em>Accessibility Tree</em> di Browser DevTools</h2>
<p>Selain pohon DOM biasa, peramban membangun <strong>Accessibility Tree (Pohon Aksesibilitas)</strong> yang diserahkan kepada pembaca layar sistem operasi. Anda dapat memeriksanya secara langsung tanpa menginstal aplikasi tambahan:</p>
<ol><li>Buka <strong>Developer Tools (<code>F12</code>)</strong> → tab <strong>Elements / Inspector</strong>.</li><li>Di panel sebelah kanan (tempat tab <em>Styles</em> dan <em>Computed</em> berada), buka sub-tab <strong>Accessibility</strong> (atau, di Chrome, klik ikon orang kecil <em>&quot;Switch to Accessibility Tree view&quot;</em> di pojok kanan atas pohon DOM; di Firefox, buka panel <strong>Accessibility</strong> tersendiri di Developer Tools).</li><li>Klik sebuah elemen (misalnya <code>&lt;button&gt;</code>, <code>&lt;input&gt;</code>, atau <code>&lt;nav&gt;</code>), lalu periksa tiga informasi kunci ini:<ul><li><strong>Role (Peran):</strong> Apakah perannya <code>button</code>, <code>link</code>, <code>navigation</code>, <code>dialog</code>, atau hanya <code>generic</code>?</li><li><strong>Computed Name (Nama Terhitung):</strong> Apakah elemen tersebut memiliki nama yang jelas (misalnya <code>&quot;Unduh Materi&quot;</code>), atau justru kosong <code>&quot;&quot;</code>?</li><li><strong>Focusable:</strong> Apakah bernilai <code>true</code>?</li></ul></li></ol>
<h2>3. Daftar Periksa Audit HTML Siap Produksi</h2>
<p>Gunakan daftar periksa 10 poin ini sebelum menandai halaman HTML Anda selesai:</p>
<ol><li><strong>Dokumen &amp; Bahasa:</strong> <code>&lt;!DOCTYPE html&gt;</code> di baris pertama, serta <code>&lt;html lang=&quot;id&quot;&gt;</code> telah terpasang.</li><li><strong>Kepala Dokumen:</strong> <code>&lt;meta charset=&quot;utf-8&quot;&gt;</code> berada di awal <code>&lt;head&gt;</code>, diikuti <code>&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;</code> (tanpa <code>user-scalable=no</code>), <code>&lt;title&gt;</code> unik, <code>&lt;meta name=&quot;description&quot;&gt;</code>, dan <code>&lt;link rel=&quot;canonical&quot;&gt;</code>.</li><li><strong>Landmark Utama:</strong> Memiliki <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, tepat satu <code>&lt;main&gt;</code>, dan <code>&lt;footer&gt;</code> beserta <em>skip link</em> menuju <code>#main</code>.</li><li><strong>Hierarki Heading:</strong> Memiliki satu <code>&lt;h1&gt;</code> utama dan subjudul <code>&lt;h2&gt;</code>–<code>&lt;h6&gt;</code> yang berurutan tanpa melompati tingkat hanya demi ukuran huruf.</li><li><strong>Kejelasan Semantik Interaksi:</strong> Semua navigasi URL menggunakan <code>&lt;a href=&quot;...&quot;&gt;</code>, dan semua aksi dalam halaman menggunakan <code>&lt;button type=&quot;...&quot;&gt;</code> (tidak ada <code>&lt;div onclick&gt;</code> atau <code>&lt;a href=&quot;#&quot;&gt;</code>).</li><li><strong>Gambar &amp; Media:</strong> Setiap <code>&lt;img&gt;</code> memiliki atribut <code>alt</code> (deskriptif untuk gambar informatif, <code>alt=&quot;&quot;</code> untuk gambar dekoratif), memiliki <code>width</code> dan <code>height</code>, menggunakan <code>fetchpriority=&quot;high&quot;</code> pada gambar LCP teratas, dan <code>loading=&quot;lazy&quot;</code> pada gambar di bawah layar.</li><li><strong>Tabel Data:</strong> Menggunakan <code>&lt;caption&gt;</code>, <code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>, dan <code>&lt;th scope=&quot;col|row&quot;&gt;</code>.</li><li><strong>Formulir:</strong> Setiap kontrol memiliki <code>&lt;label for=&quot;...&quot;&gt;</code> yang terhubung dan atribut <code>name</code> serta <code>autocomplete</code> yang sesuai.</li><li><strong>Komponen Interaktif:</strong> Modal menggunakan <code>&lt;dialog&gt;</code> (<code>showModal()</code>), akordeon menggunakan <code>&lt;details&gt;</code>/<code>&lt;summary&gt;</code>, dan panel sembul menggunakan <code>popover</code>.</li><li><strong>Pemuatan Skrip:</strong> <code>&lt;script&gt;</code> menggunakan <code>type=&quot;module&quot;</code> atau atribut <code>defer</code>.</li></ol>
<h2>Latihan Praktik: Mengaudit dan Memperbaiki Halaman dengan 5 Kesalahan Struktural</h2>
<p>Perhatikan cuplikan markup bermasalah berikut:</p>
<pre>&lt;!-- KODE BERMASALAH UNTUK DIAUDIT: --&gt;
&lt;a href=&quot;/kelas/css&quot; class=&quot;kartu&quot;&gt;
  &lt;p&gt;
    &lt;h4&gt;Kelas CSS Modern&lt;/h4&gt;
    &lt;div class=&quot;ringkasan&quot;&gt;Belajar Grid dan Container Queries.&lt;/div&gt;
  &lt;/p&gt;
  &lt;button onclick=&quot;daftar()&quot;&gt;Daftar Sekarang&lt;/button&gt;
&lt;/a&gt;</pre>
<p>Buatlah berkas <code>hasil-audit.html</code> yang memperbaiki seluruh kesalahan model konten pada cuplikan di atas (mengeluarkan <code>&lt;button&gt;</code> dari dalam <code>&lt;a&gt;</code> menggunakan pola <em>stretched link</em>, memperbaiki hierarki heading, dan mengganti <code>&lt;p&gt;</code> yang membungkus elemen blok).</p>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://html.spec.whatwg.org/multipage/dom.html" rel="noopener">HTML Standard (Content models &amp; Parsing HTML documents) — WHATWG</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML" rel="noopener">HTML: A good basis for accessibility — MDN Web Docs</a></li><li><a href="https://web.dev/articles/a11y-tips-for-web-dev" rel="noopener">Accessibility for web developers — web.dev</a></li></ul></div>
`,
    perintah: ["<p>","<div>","<a>","<button>","<ul>","<header>"],
    kuis: [
        {"tanya":"Apa yang dilakukan oleh parser HTML5 di peramban ketika menemukan kode <p>Pembuka <div>Isi kotak</div> Penutup</p>?","opsi":["Mengubah elemen <div> menjadi <span> secara otomatis.","Menutup paksa elemen <p> tepat sebelum tag pembuka <div>, sehingga elemen <div> berada di luar <p> pertama, dan tag penutup </p> di akhir berubah menjadi elemen <p></p> kosong yang terpisah.","Mengabaikan teks \"Isi kotak\" sepenuhnya.","Menampilkan pesan galat merah di layar utama."],"benar":1,"penjelasan":"Spesifikasi penguraian HTML menetapkan bahwa elemen <p> secara otomatis ditutup begitu parser menjumpai tag pembuka elemen blok seperti <div>, <section>, <ul>, atau <table>."},
        {"tanya":"Mengapa spesifikasi HTML melarang penempatan elemen <button> di dalam elemen <a href=\"...\"> (atau sebaliknya)?","opsi":["Karena warna tombol akan berubah menjadi biru mengikuti warna tautan.","Karena keduanya merupakan Interactive Content; menyarangkan kontrol interaktif di dalam kontrol interaktif lain menciptakan ambiguitas fokus papan ketik (Tab), membingungkan pembaca layar, dan membuat klik/ketukan pengguna memicu dua aksi sekaligus.","Karena <button> hanya boleh berada di dalam <form>.","Karena <a> hanya boleh berisi maksimal 3 kata."],"benar":1,"penjelasan":"Aturan model konten untuk <a> dan <button> secara tegas menyatakan: isi <a> bersifat transparan dan isi <button> berupa phrasing content, tetapi keduanya tidak boleh memiliki turunan berupa interactive content. Gunakan teknik CSS stretched link (::after) jika ingin membuat seluruh kartu dapat diklik sambil tetap memiliki tombol terpisah di dalamnya."},
        {"tanya":"Saat Anda memeriksa sebuah tombol ikon <button><svg>...</svg></button> di panel Accessibility Tree pada Browser DevTools dan melihat bahwa Computed Name bernilai \"\" (kosong), apa artinya dan bagaimana cara memperbaikinya?","opsi":["Artinya tombol sudah sempurna; tidak perlu diperbaiki.","Artinya pembaca layar hanya akan mengumumkan kata \"button\" tanpa memberi tahu pengguna apa fungsi tombol tersebut; perbaiki dengan menambahkan teks tersembunyi visual atau atribut aria-label=\"Deskripsi aksi tombol\" pada <button> serta aria-hidden=\"true\" pada <svg>.","Artinya tombol belum memiliki kelas CSS.","Artinya tombol tersebut tidak memiliki atribut id."],"benar":1,"penjelasan":"Setiap elemen interaktif wajib memiliki Accessible Name (Computed Name yang tidak kosong di Accessibility Tree) agar pengguna pembaca layar maupun pengguna perintah suara (voice control) dapat mengenali dan mengoperasikan tombol tersebut."}
    ]
},
{
    id: 27,
    kategori: "7 · Praktik & Proyek",
    judul: "Proyek Akhir Kelas HTML: Halaman Portofolio dan Dokumentasi Teknis Insinyur Perangkat Lunak",
    tingkat: "Lanjut", durasi: "12 mnt",
    tag: ["fetchpriority=\"high\"","<dialog>","index.html"],
    ringkas: "Mengintegrasikan seluruh materi kelas HTML—mulai dari struktur landmark semantik, metadata SEO & JSON-LD, gambar responsif, tabel perbandingan arsitektur, komponen interaktif <details> & <dialog>, hingga formulir kontak tervalidasi—ke dalam satu halaman utuh yang siap pakai.",
    isi: `
<h2>Gambaran Proyek</h2>
<p>Selamat! Anda telah mempelajari fondasi cara kerja web, struktur dokumen, semantik teks dan tata letak, navigasi aman, media responsif, tabel data aksesibel, formulir beserta validasinya, aksesibilitas (a11y), SEO teknis, elemen interaktif modern, hingga optimasi performa pemuatan.</p>
<p>Dalam proyek penutup kelas HTML ini, Anda akan merakit satu dokumen HTML produksi yang utuh untuk <strong>Halaman Portofolio &amp; Studi Kasus Rekayasa Perangkat Lunak</strong>. Halaman ini dirancang agar:</p>
<ol><li><strong>100% Semantik &amp; Aksesibel:</strong> Memiliki <em>skip link</em>, landmark lengkap (<code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;aside&gt;</code>, <code>&lt;footer&gt;</code>), urutan heading yang rapi, serta atribut ARIA yang tepat.</li><li><strong>Cepat &amp; Siap Mesin Pencari:</strong> Dilengkapi metadata Open Graph, <code>&lt;link rel=&quot;canonical&quot;&gt;</code>, JSON-LD <code>ProfilePage</code>, prioritas gambar utama <code>fetchpriority=&quot;high&quot;</code>, dan <code>loading=&quot;lazy&quot;</code> untuk media di bagian bawah.</li><li><strong>Interaktif Tanpa Pustaka Eksternal:</strong> Menggunakan akordeon eksklusif <code>&lt;details name=&quot;...&quot;&gt;</code>, pratinjau rincian proyek dengan <code>&lt;dialog&gt;</code>, dan formulir kolaborasi dengan validasi HTML5 bawaan.</li></ol>
<h2>Kode Lengkap Proyek (<code>index.html</code>)</h2>
<p>Simpan kode berikut sebagai <code>index.html</code> dan bukalah di peramban Anda untuk menguji seluruh fiturnya (navigasi papan ketik <code>Tab</code>, akordeon, dialog modal, dan validasi formulir):</p>
<pre>&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;id&quot; dir=&quot;ltr&quot;&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;
    &lt;title&gt;Nadia Pratama — Insinyur Backend &amp; Infrastruktur | Portofolio Kodeloka&lt;/title&gt;
    &lt;meta
      name=&quot;description&quot;
      content=&quot;Portofolio teknis Nadia Pratama: studi kasus migrasi PostgreSQL tanpa downtime, arsitektur API Go &amp; PHP, serta formulir kolaborasi teknis.&quot;
    &gt;
    &lt;link rel=&quot;canonical&quot; href=&quot;https://kodeloka.asadinedu.com/contoh-portofolio/&quot;&gt;

    &lt;!-- Open Graph Metadata --&gt;
    &lt;meta property=&quot;og:type&quot; content=&quot;profile&quot;&gt;
    &lt;meta property=&quot;og:site_name&quot; content=&quot;Kodeloka&quot;&gt;
    &lt;meta property=&quot;og:locale&quot; content=&quot;id_ID&quot;&gt;
    &lt;meta property=&quot;og:title&quot; content=&quot;Nadia Pratama — Insinyur Backend &amp; Infrastruktur&quot;&gt;
    &lt;meta property=&quot;og:description&quot; content=&quot;Studi kasus arsitektur sistem terdistribusi, basis data PostgreSQL, dan pengembangan web modern.&quot;&gt;
    &lt;meta property=&quot;og:url&quot; content=&quot;https://kodeloka.asadinedu.com/contoh-portofolio/&quot;&gt;
    &lt;meta property=&quot;og:image&quot; content=&quot;https://kodeloka.asadinedu.com/assets/og-portofolio.png&quot;&gt;
    &lt;meta property=&quot;og:image:width&quot; content=&quot;1200&quot;&gt;
    &lt;meta property=&quot;og:image:height&quot; content=&quot;630&quot;&gt;
    &lt;meta property=&quot;og:image:alt&quot; content=&quot;Ringkasan portofolio teknis Nadia Pratama&quot;&gt;

    &lt;!-- Favicon Standar --&gt;
    &lt;link rel=&quot;icon&quot; href=&quot;/favicon.ico&quot; sizes=&quot;32x32&quot;&gt;
    &lt;link rel=&quot;icon&quot; href=&quot;/assets/brand/icon.svg&quot; type=&quot;image/svg+xml&quot;&gt;

    &lt;!-- Structured Data JSON-LD --&gt;
    &lt;script type=&quot;application/ld+json&quot;&gt;
    {
      &quot;@context&quot;: &quot;https://schema.org&quot;,
      &quot;@type&quot;: &quot;ProfilePage&quot;,
      &quot;dateCreated&quot;: &quot;2026-10-16T09:00:00+07:00&quot;,
      &quot;mainEntity&quot;: {
        &quot;@type&quot;: &quot;Person&quot;,
        &quot;name&quot;: &quot;Nadia Pratama&quot;,
        &quot;jobTitle&quot;: &quot;Insinyur Backend &amp; Infrastruktur&quot;,
        &quot;knowsAbout&quot;: [&quot;HTML5&quot;, &quot;CSS&quot;, &quot;JavaScript&quot;, &quot;PHP&quot;, &quot;Golang&quot;, &quot;PostgreSQL&quot;, &quot;Kubernetes&quot;]
      }
    }
    &lt;/script&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;!-- 1. Tautan Lompat ke Konten Utama untuk Pengguna Papan Ketik --&gt;
    &lt;a href=&quot;#konten-utama&quot; class=&quot;skip-link&quot;&gt;Lompat ke konten utama&lt;/a&gt;

    &lt;!-- 2. Landmark Header &amp; Navigasi Utama --&gt;
    &lt;header&gt;
      &lt;div&gt;
        &lt;a href=&quot;/&quot; aria-current=&quot;page&quot;&gt;&lt;strong&gt;Nadia Pratama&lt;/strong&gt;&lt;/a&gt;
        &lt;span&gt;Insinyur Backend &amp;amp; Web&lt;/span&gt;
      &lt;/div&gt;

      &lt;nav aria-label=&quot;Navigasi utama&quot;&gt;
        &lt;ul&gt;
          &lt;li&gt;&lt;a href=&quot;#studi-kasus&quot;&gt;Studi Kasus&lt;/a&gt;&lt;/li&gt;
          &lt;li&gt;&lt;a href=&quot;#tolok-ukur&quot;&gt;Tolok Ukur&lt;/a&gt;&lt;/li&gt;
          &lt;li&gt;&lt;a href=&quot;#tanya-jawab&quot;&gt;Tanya Jawab&lt;/a&gt;&lt;/li&gt;
          &lt;li&gt;&lt;a href=&quot;#kontak&quot;&gt;Hubungi Saya&lt;/a&gt;&lt;/li&gt;
        &lt;/ul&gt;
      &lt;/nav&gt;

      &lt;!-- Popover Bawaan untuk Ringkasan Kontak Cepat --&gt;
      &lt;button type=&quot;button&quot; popovertarget=&quot;info-ketersediaan&quot;&gt;
        Status Ketersediaan
      &lt;/button&gt;
      &lt;div id=&quot;info-ketersediaan&quot; popover&gt;
        &lt;p&gt;&lt;strong&gt;Status Oktober 2026:&lt;/strong&gt; Terbuka untuk konsultasi arsitektur web dan audit performa.&lt;/p&gt;
        &lt;button type=&quot;button&quot; popovertarget=&quot;info-ketersediaan&quot; popovertargetaction=&quot;hide&quot;&gt;
          Tutup
        &lt;/button&gt;
      &lt;/div&gt;
    &lt;/header&gt;

    &lt;!-- 3. Landmark Main --&gt;
    &lt;main id=&quot;konten-utama&quot;&gt;
      &lt;!-- Bagian Pengantar (Hero) --&gt;
      &lt;section aria-labelledby=&quot;judul-hero&quot;&gt;
        &lt;h1 id=&quot;judul-hero&quot;&gt;Merancang Sistem Web yang Cepat, Aksesibel, dan Tangguh&lt;/h1&gt;
        &lt;p&gt;
          Halo! Saya merancang aplikasi web dari lapisan markup semantik di peramban
          hingga layanan backend dengan &lt;strong&gt;Go&lt;/strong&gt;, &lt;strong&gt;PHP 8.5&lt;/strong&gt;, dan &lt;strong&gt;PostgreSQL&lt;/strong&gt;.
        &lt;/p&gt;

        &lt;figure&gt;
          &lt;picture&gt;
            &lt;source
              type=&quot;image/avif&quot;
              srcset=&quot;/assets/arsitektur-sistem-800.avif 800w, /assets/arsitektur-sistem-1200.avif 1200w&quot;
              sizes=&quot;(max-width: 768px) 100vw, 800px&quot;
            &gt;
            &lt;img
              src=&quot;/assets/arsitektur-sistem-800.webp&quot;
              width=&quot;800&quot;
              height=&quot;420&quot;
              fetchpriority=&quot;high&quot;
              alt=&quot;Diagram arsitektur layanan web dari CDN dan Nginx menuju aplikasi PHP-FPM dan klaster PostgreSQL.&quot;
            &gt;
          &lt;/picture&gt;
          &lt;figcaption&gt;
            Arsitektur referensi yang saya gunakan untuk menangani 15.000 permintaan per detik.
          &lt;/figcaption&gt;
        &lt;/figure&gt;
      &lt;/section&gt;

      &lt;!-- Bagian Studi Kasus menggunakan &lt;article&gt; --&gt;
      &lt;section id=&quot;studi-kasus&quot; aria-labelledby=&quot;judul-studi-kasus&quot;&gt;
        &lt;h2 id=&quot;judul-studi-kasus&quot;&gt;Studi Kasus Pilihan&lt;/h2&gt;

        &lt;article aria-labelledby=&quot;proyek-1&quot;&gt;
          &lt;header&gt;
            &lt;h3 id=&quot;proyek-1&quot;&gt;1. Migrasi Antarmuka Portal Edukasi ke HTML Semantik&lt;/h3&gt;
            &lt;p&gt;
              Diterbitkan pada &lt;time datetime=&quot;2026-08-12&quot;&gt;12 Agustus 2026&lt;/time&gt; ·
              Kategori: &lt;b&gt;Performa &amp;amp; Aksesibilitas&lt;/b&gt;
            &lt;/p&gt;
          &lt;/header&gt;
          &lt;p&gt;
            Menggantikan 42 KB pustaka modal dan akordeon pihak ketiga dengan elemen bawaan
            &lt;code&gt;&amp;lt;dialog&amp;gt;&lt;/code&gt;, &lt;code&gt;&amp;lt;details&amp;gt;&lt;/code&gt;, dan atribut &lt;code&gt;popover&lt;/code&gt;.
          &lt;/p&gt;
          &lt;button type=&quot;button&quot; id=&quot;buka-detail-proyek&quot;&gt;
            Baca Catatan Teknis Migrasi
          &lt;/button&gt;
        &lt;/article&gt;
      &lt;/section&gt;

      &lt;!-- Dialog Modal untuk Catatan Teknis --&gt;
      &lt;dialog id=&quot;modal-catatan-teknis&quot; aria-labelledby=&quot;judul-modal-teknis&quot;&gt;
        &lt;h2 id=&quot;judul-modal-teknis&quot;&gt;Catatan Teknis: Menghapus Ketergantungan UI Berat&lt;/h2&gt;
        &lt;p&gt;
          Dengan memindahkan logika dialog ke elemen &lt;code&gt;&amp;lt;dialog&amp;gt;&lt;/code&gt; asli dan memanggil
          &lt;code&gt;showModal()&lt;/code&gt;, waktu &lt;em&gt;Interaction to Next Paint (INP)&lt;/em&gt; turun dari
          &lt;samp&gt;280 ms&lt;/samp&gt; menjadi &lt;samp&gt;45 ms&lt;/samp&gt;.
        &lt;/p&gt;
        &lt;pre&gt;&lt;code&gt;// Membuka dialog modal bawaan peramban
const dialog = document.getElementById(&quot;modal-catatan-teknis&quot;);
dialog.showModal();&lt;/code&gt;&lt;/pre&gt;
        &lt;form method=&quot;dialog&quot;&gt;
          &lt;button type=&quot;submit&quot; autofocus&gt;Tutup Catatan&lt;/button&gt;
        &lt;/form&gt;
      &lt;/dialog&gt;

      &lt;!-- Bagian Tabel Data Tolok Ukur --&gt;
      &lt;section id=&quot;tolok-ukur&quot; aria-labelledby=&quot;judul-tolok-ukur&quot;&gt;
        &lt;h2 id=&quot;judul-tolok-ukur&quot;&gt;Hasil Tolok Ukur Sebelum dan Sesudah Optimasi&lt;/h2&gt;

        &lt;div role=&quot;region&quot; aria-labelledby=&quot;caption-tolok-ukur&quot; tabindex=&quot;0&quot;&gt;
          &lt;table&gt;
            &lt;caption id=&quot;caption-tolok-ukur&quot;&gt;
              Perbandingan Metrik Performa dan Aksesibilitas Portal ( Median Uji Lapangan 2026 )
            &lt;/caption&gt;
            &lt;thead&gt;
              &lt;tr&gt;
                &lt;th scope=&quot;col&quot;&gt;Metrik Pengukuran&lt;/th&gt;
                &lt;th scope=&quot;col&quot;&gt;Sebelum Refactoring&lt;/th&gt;
                &lt;th scope=&quot;col&quot;&gt;Sesudah Refactoring&lt;/th&gt;
                &lt;th scope=&quot;col&quot;&gt;Target Standar&lt;/th&gt;
              &lt;/tr&gt;
            &lt;/thead&gt;
            &lt;tbody&gt;
              &lt;tr&gt;
                &lt;th scope=&quot;row&quot;&gt;Largest Contentful Paint (LCP)&lt;/th&gt;
                &lt;td&gt;3,8 detik&lt;/td&gt;
                &lt;td&gt;1,4 detik&lt;/td&gt;
                &lt;td&gt;&amp;le; 2,5 detik&lt;/td&gt;
              &lt;/tr&gt;
              &lt;tr&gt;
                &lt;th scope=&quot;row&quot;&gt;Interaction to Next Paint (INP)&lt;/th&gt;
                &lt;td&gt;280 ms&lt;/td&gt;
                &lt;td&gt;45 ms&lt;/td&gt;
                &lt;td&gt;&amp;le; 200 ms&lt;/td&gt;
              &lt;/tr&gt;
              &lt;tr&gt;
                &lt;th scope=&quot;row&quot;&gt;Cumulative Layout Shift (CLS)&lt;/th&gt;
                &lt;td&gt;0,24&lt;/td&gt;
                &lt;td&gt;0,01&lt;/td&gt;
                &lt;td&gt;&amp;le; 0,10&lt;/td&gt;
              &lt;/tr&gt;
            &lt;/tbody&gt;
            &lt;tfoot&gt;
              &lt;tr&gt;
                &lt;th scope=&quot;row&quot; colspan=&quot;2&quot;&gt;Total Penghematan Bundel JavaScript&lt;/th&gt;
                &lt;td colspan=&quot;2&quot;&gt;42 KB (terkompresi Brotli)&lt;/td&gt;
              &lt;/tr&gt;
            &lt;/tfoot&gt;
          &lt;/table&gt;
        &lt;/div&gt;
      &lt;/section&gt;

      &lt;!-- Bagian Akordeon Eksklusif Tanya Jawab --&gt;
      &lt;section id=&quot;tanya-jawab&quot; aria-labelledby=&quot;judul-faq&quot;&gt;
        &lt;h2 id=&quot;judul-faq&quot;&gt;Pertanyaan Umum Seputar Kolaborasi&lt;/h2&gt;

        &lt;details name=&quot;faq-portofolio&quot; open&gt;
          &lt;summary&gt;Teknologi apa saja yang biasa Anda tangani?&lt;/summary&gt;
          &lt;p&gt;
            Di sisi front-end saya mengutamakan HTML semantik, CSS modern (Grid, Container Queries),
            dan Vanilla JavaScript/TypeScript. Di sisi server saya menggunakan PHP 8.4/8.5, Go, dan PostgreSQL.
          &lt;/p&gt;
        &lt;/details&gt;

        &lt;details name=&quot;faq-portofolio&quot;&gt;
          &lt;summary&gt;Apakah Anda menerima audit aksesibilitas (WCAG 2.2)?&lt;/summary&gt;
          &lt;p&gt;
            Ya. Saya melakukan pengujian menyeluruh menggunakan navigasi papan ketik, pembaca layar,
            serta perbaikan langsung pada kode sumber HTML dan CSS.
          &lt;/p&gt;
        &lt;/details&gt;
      &lt;/section&gt;

      &lt;!-- Bagian Formulir Kontak Tervalidasi --&gt;
      &lt;section id=&quot;kontak&quot; aria-labelledby=&quot;judul-kontak&quot;&gt;
        &lt;h2 id=&quot;judul-kontak&quot;&gt;Formulir Diskusi Proyek&lt;/h2&gt;
        &lt;p&gt;Kolom yang ditandai wajib diisi sebelum pesan dikirimkan.&lt;/p&gt;

        &lt;form action=&quot;/kirim-pesan&quot; method=&quot;post&quot;&gt;
          &lt;div&gt;
            &lt;label for=&quot;nama-pengirim&quot;&gt;Nama Lengkap (Wajib)&lt;/label&gt;
            &lt;input
              type=&quot;text&quot;
              id=&quot;nama-pengirim&quot;
              name=&quot;nama&quot;
              autocomplete=&quot;name&quot;
              required
              minlength=&quot;2&quot;
              maxlength=&quot;80&quot;
            &gt;
          &lt;/div&gt;

          &lt;div&gt;
            &lt;label for=&quot;surel-pengirim&quot;&gt;Alamat Surel Kerja (Wajib)&lt;/label&gt;
            &lt;input
              type=&quot;email&quot;
              id=&quot;surel-pengirim&quot;
              name=&quot;surel&quot;
              autocomplete=&quot;email&quot;
              required
            &gt;
          &lt;/div&gt;

          &lt;fieldset&gt;
            &lt;legend&gt;Jenis Kebutuhan Proyek&lt;/legend&gt;
            &lt;div&gt;
              &lt;input type=&quot;radio&quot; id=&quot;jenis-audit&quot; name=&quot;jenis_proyek&quot; value=&quot;audit&quot; checked&gt;
              &lt;label for=&quot;jenis-audit&quot;&gt;Audit Performa &amp;amp; Aksesibilitas Web&lt;/label&gt;
            &lt;/div&gt;
            &lt;div&gt;
              &lt;input type=&quot;radio&quot; id=&quot;jenis-pengembangan&quot; name=&quot;jenis_proyek&quot; value=&quot;pengembangan&quot;&gt;
              &lt;label for=&quot;jenis-pengembangan&quot;&gt;Pengembangan Aplikasi Web Baru&lt;/label&gt;
            &lt;/div&gt;
          &lt;/fieldset&gt;

          &lt;div&gt;
            &lt;label for=&quot;kode-proyek&quot;&gt;Kode Referensi Proyek (Opsional, 4–10 huruf kapital/angka)&lt;/label&gt;
            &lt;input
              type=&quot;text&quot;
              id=&quot;kode-proyek&quot;
              name=&quot;kode_referensi&quot;
              pattern=&quot;[A-Z0-9]{4,10}&quot;
              title=&quot;Gunakan 4 hingga 10 karakter huruf kapital (A-Z) atau angka (0-9), misalnya KDLK2026.&quot;
              aria-describedby=&quot;bantuan-kode&quot;
            &gt;
            &lt;small id=&quot;bantuan-kode&quot;&gt;Contoh: &lt;code&gt;KDLK2026&lt;/code&gt;&lt;/small&gt;
          &lt;/div&gt;

          &lt;div&gt;
            &lt;label for=&quot;rincian-pesan&quot;&gt;Rincian Kebutuhan (Wajib, minimal 20 karakter)&lt;/label&gt;
            &lt;textarea
              id=&quot;rincian-pesan&quot;
              name=&quot;pesan&quot;
              rows=&quot;5&quot;
              required
              minlength=&quot;20&quot;
            &gt;&lt;/textarea&gt;
          &lt;/div&gt;

          &lt;button type=&quot;submit&quot;&gt;Kirim Pesan Diskusi&lt;/button&gt;
        &lt;/form&gt;
      &lt;/section&gt;
    &lt;/main&gt;

    &lt;!-- 4. Landmark Aside &amp; Footer --&gt;
    &lt;aside aria-label=&quot;Tautan profil eksternal&quot;&gt;
      &lt;h2&gt;Temukan Saya di Platform Lain&lt;/h2&gt;
      &lt;ul&gt;
        &lt;li&gt;
          &lt;a href=&quot;https://github.com/asaddin02/asadin-edu-kodeloka&quot; target=&quot;_blank&quot; rel=&quot;noopener noreferrer&quot;&gt;
            Repositori GitHub Kodeloka
          &lt;/a&gt;
        &lt;/li&gt;
      &lt;/ul&gt;
    &lt;/aside&gt;

    &lt;footer&gt;
      &lt;p&gt;&lt;small&gt;&amp;copy; 2026 Nadia Pratama — Proyek latihan Kelas HTML Kodeloka.&lt;/small&gt;&lt;/p&gt;
    &lt;/footer&gt;

    &lt;script&gt;
      const tombolDetail = document.getElementById(&quot;buka-detail-proyek&quot;);
      const modalTeknis = document.getElementById(&quot;modal-catatan-teknis&quot;);

      tombolDetail.addEventListener(&quot;click&quot;, () =&gt; {
        modalTeknis.showModal();
      });
    &lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
<h2>Daftar Periksa Evaluasi Mandiri (<em>Self-Review Checklist</em>)</h2>
<p>Sebelum melanjutkan ke <strong>Kelas CSS</strong>, periksa kode yang Anda tulis menggunakan daftar periksa kualitas berikut:</p>
<ul><li>[ ] <strong>Validitas Struktur:</strong> Apakah <code>&lt;!DOCTYPE html&gt;</code>, <code>&lt;html lang=&quot;id&quot;&gt;</code>, <code>&lt;meta charset=&quot;utf-8&quot;&gt;</code>, dan <code>&lt;meta name=&quot;viewport&quot;&gt;</code> sudah berada di tempat yang benar?</li><li>[ ] <strong>Hierarki Heading:</strong> Apakah halaman memiliki tepat satu <code>&lt;h1&gt;</code>, diikuti <code>&lt;h2&gt;</code> dan <code>&lt;h3&gt;</code> secara berurutan tanpa melompati level?</li><li>[ ] <strong>Navigasi Papan Ketik:</strong> Tekan tombol <code>Tab</code> dari awal hingga akhir halaman. Apakah tautan <em>Lompat ke konten utama</em>, tombol Popover, tombol pembuka <code>&lt;dialog&gt;</code>, akordeon <code>&lt;details&gt;</code>, dan seluruh kolom <code>&lt;form&gt;</code> dapat dioperasikan tanpa tetikus?</li><li>[ ] <strong>Keamanan &amp; Performa Media:</strong> Apakah gambar utama menggunakan <code>fetchpriority=&quot;high&quot;</code> beserta atribut <code>width</code> dan <code>height</code> eksplisit?</li></ul>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML" rel="noopener">HTML: HyperText Markup Language — MDN Web Docs</a></li><li><a href="https://html.spec.whatwg.org/multipage/" rel="noopener">HTML Living Standard — WHATWG</a></li><li><a href="https://web.dev/learn/html" rel="noopener">Learn HTML — web.dev</a></li><li><a href="https://web.dev/learn/accessibility" rel="noopener">Learn Accessibility — web.dev</a></li></ul></div>
`,
    perintah: ["fetchpriority=\"high\"","<dialog>","index.html","Tab","<header>","<nav>"],
    kuis: [
        {"tanya":"Dalam proyek halaman portofolio di atas, mengapa gambar diagram arsitektur di bagian atas (hero section) diberi atribut fetchpriority=\"high\" dan tidak diberi loading=\"lazy\"?","opsi":["Karena elemen <picture> tidak mengizinkan penggunaan atribut loading=\"lazy\".","Karena gambar tersebut berada di layar pertama (above the fold) dan menjadi kandidat utama Largest Contentful Paint (LCP), sehingga harus diunduh sedini mungkin tanpa penundaan.","Karena format AVIF hanya dapat dimuat jika menggunakan fetchpriority=\"high\".","Agar gambar tersebut tidak bisa disimpan oleh pengunjung."],"benar":1,"penjelasan":"Menambahkan loading=\"lazy\" pada gambar di layar pertama akan menunda pemuatannya hingga tata letak selesai dihitung, yang justru memperburuk waktu LCP. Menggunakan pemuatan eager (bawaan) dengan fetchpriority=\"high\" memastikan peramban segera mengunduh gambar utama tersebut."},
        {"tanya":"Pada bagian tabel tolok ukur di atas, mengapa elemen <table> dibungkus dengan <div role=\"region\" aria-labelledby=\"caption-tolok-ukur\" tabindex=\"0\">?","opsi":["Agar tabel otomatis diurutkan berdasarkan abjad oleh peramban.","Agar ketika tabel memiliki overflow-x: auto di layar sempit, pengguna papan ketik tetap dapat memfokuskan wadah tabel tersebut dengan tombol Tab dan menggulirnya ke kiri/kanan menggunakan tombol panah.","Karena elemen <table> tidak boleh diletakkan langsung di dalam <section>.","Untuk menyembunyikan tabel dari pembaca layar."],"benar":1,"penjelasan":"Wadah dengan overflow-x: auto yang tidak memiliki elemen interaktif di dalamnya sering kali tidak bisa digulir secara horizontal menggunakan papan ketik di beberapa peramban kecuali diberi tabindex=\"0\". Menambahkan role=\"region\" dan aria-labelledby memastikan wilayah fokus tersebut memiliki nama yang jelas bagi pembaca layar."},
        {"tanya":"Mengapa tombol penutup di dalam <dialog id=\"modal-catatan-teknis\"> dibungkus dengan <form method=\"dialog\">?","opsi":["Agar saat tombol ditekan, isi catatan otomatis dikirimkan ke server melalui permintaan HTTP POST.","Agar dialog dapat ditutup secara deklaratif menggunakan mekanisme bawaan HTML ketika tombol submit di dalam formulir tersebut ditekan, bahkan jika skrip penutup tambahan tidak ditulis.","Karena elemen <button> tidak valid jika diletakkan langsung di dalam <dialog>.","Untuk menghapus elemen <dialog> dari pohon DOM setelah ditutup."],"benar":1,"penjelasan":"Formulir dengan method=\"dialog\" di dalam elemen <dialog> adalah fitur standar HTML yang menutup kotak dialog dan menyimpan nilai value tombol yang ditekan ke dalam properti dialog.returnValue tanpa memuat ulang halaman atau mengirim permintaan jaringan."}
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
