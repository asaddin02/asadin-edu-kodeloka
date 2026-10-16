/* ==========================================================================
   PHP — Platform Pembelajaran Interaktif
   Materi: riset Gemini (materi-gemini/php/), dikoreksi dan disusun oleh Claude Code.
   Dihasilkan oleh scripts/import-materi-gemini.mjs; ubah Markdown-nya, bukan berkas ini.
   ========================================================================== */

const TOPIK_SLUG = "php";
const TOPIK_SUB  = "pemrograman sisi server";

const MODUL = [
{
    id: 1,
    kategori: "1 · Fondasi",
    judul: "Pengantar PHP Modern: Siklus Versi, Cara Kerja di Server, dan strict_types",
    tingkat: "Dasar", durasi: "9 mnt",
    tag: ["strict_types","declare(strict_types=1);","?>"],
    ringkas: "Memahami transformasi PHP modern (PHP 8.2 hingga 8.5), kebijakan siklus dukungan 4 tahun, model eksekusi share-nothing pada PHP-FPM dan CLI, serta penggunaan wajib declare(strict_types=1).",
    isi: `
<h2>PHP Modern Bukanlah PHP Era 2010</h2>
<p>Jika gambaran Anda tentang PHP masih berupa kode SQL mentah yang dicampuradukkan dengan tag <code>&lt;html&gt;</code> di dalam satu berkas tahun 2008, lupakan gambaran tersebut. Sejak seri PHP 8.0 hingga <strong>PHP 8.4 dan PHP 8.5</strong>, PHP telah bertransformasi menjadi bahasa pemrograman sisi server yang memiliki sistem tipe ketat (<em>strict typing</em>), fitur berorientasi objek kelas industri (Enum, Readonly Classes, Property Hooks, Asymmetric Visibility), kompilator <em>Just-In-Time (JIT)</em>, dan ekosistem paket standar melalui Composer serta spesifikasi PHP-FIG (PSR).</p>
<h2>1. Siklus Rilis Resmi dan Versi PHP yang Didukung</h2>
<p>Berdasarkan kebijakan resmi <a href="https://www.php.net/supported-versions.php" rel="noopener">PHP Supported Versions</a>, setiap cabang rilis utama (<em>minor release branch</em>, seperti <code>8.4</code> atau <code>8.5</code>) mendapatkan <strong>total 4 tahun masa dukungan</strong> yang selalu berakhir pada tanggal <strong>31 Desember</strong>:</p>
<ol><li>**2 Tahun Dukungan Aktif (<em>Active Support</em>):** Perbaikan bug umum dan perbaikan celah keamanan dirilis secara berkala.</li><li>**2 Tahun Dukungan Keamanan (<em>Security Fixes Only</em>):** Hanya celah keamanan kritis yang ditambal.</li><li><strong>End of Life (EOL):</strong> Cabang versi yang berusia lebih dari 4 tahun tidak lagi menerima pembaruan keamanan apa pun dan <strong>tidak boleh digunakan di server produksi</strong>.</li></ol>
<h3>Tabel Status Dukungan Cabang Versi PHP (Per Oktober 2026)</h3>
<table><thead><tr><th>Cabang Versi</th><th>Tanggal Rilis Awal</th><th>Akhir Dukungan Aktif</th><th>Akhir Dukungan Keamanan (EOL)</th><th>Status Rekomendasi Proyek</th></tr></thead><tbody><tr><td><strong>PHP 8.1</strong></td><td>25 November 2021</td><td>25 November 2023</td><td>31 Desember 2025</td><td><strong>EOL (Tidak didukung lagi)</strong> — Segera tingkatkan!</td></tr><tr><td><strong>PHP 8.2</strong></td><td>8 Desember 2022</td><td>31 Desember 2024</td><td><strong>31 Desember 2026</strong></td><td>Hanya perbaikan keamanan (segera rencanakan migrasi ke 8.4/8.5).</td></tr><tr><td><strong>PHP 8.3</strong></td><td>23 November 2023</td><td>31 Desember 2025</td><td><strong>31 Desember 2027</strong></td><td>Hanya perbaikan keamanan.</td></tr><tr><td><strong>PHP 8.4</strong></td><td>21 November 2024</td><td><strong>31 Desember 2026</strong></td><td><strong>31 Desember 2028</strong></td><td><strong>Didukung Aktif</strong> (Stabil &amp; matang untuk produksi).</td></tr><tr><td><strong>PHP 8.5</strong></td><td>20 November 2025</td><td><strong>31 Desember 2027</strong></td><td><strong>31 Desember 2029</strong></td><td><strong>Didukung Aktif (Versi Stabil Terbaru)</strong> — Pilihan utama proyek baru!</td></tr></tbody></table>
<h2>2. Bagaimana PHP Bekerja di Server? (Model <em>Share-Nothing</em>)</h2>
<p>Berbeda dengan server Node.js atau Go di mana satu proses aplikasi terus hidup di memori melayani ribuan pengguna sekaligus, cara kerja klasik dan paling populer di PHP (melalui <strong>PHP-FPM / FastCGI Process Manager</strong> di belakang <strong>Nginx</strong>) menganut arsitektur <strong>Share-Nothing (Tidak Berbagi Memori Antar-Permintaan)</strong>:</p>
<pre>[Peramban Pengguna]
        │  1. Permintaan HTTP (GET /kelas/php)
        ▼
[Server Web Nginx]
        │  2. Meneruskan ke PHP-FPM lewat Unix Socket / TCP FastCGI
        ▼
[Worker PHP-FPM] (OPcache mengambil bytecode dari RAM tanpa kompilasi ulang!)
        │  3. Menginisialisasi lingkungan bersih khusus untuk 1 request ini
        │  4. Menjalankan public/index.php -&gt; Controller -&gt; Database -&gt; Respons
        │  5. Membebaskan SELURUH memori variabel request ini hingga bersih 100%!
        ▼
[Peramban Pengguna] menerima balasan HTML / JSON</pre>
<h3>Keuntungan dan Konsekuensi Arsitektur <em>Share-Nothing</em></h3>
<ul><li><strong>Keuntungan Besar:</strong> Jika terjadi kebocoran memori kecil atau galat fatal pada permintaan Pengguna A, hal itu <strong>tidak akan pernah merusak atau membocorkan data ke permintaan Pengguna B</strong>, karena setiap permintaan HTTP dimulai dari lembar memori yang bersih!</li><li><strong>Peran OPcache:</strong> Agar PHP tidak perlu membaca dan mengurai ulang berkas <code>.php</code> dari diska pada setiap permintaan, ekstensi bawaan <strong>OPcache</strong> menyimpan <em>bytecode</em> hasil kompilasi di dalam memori RAM bersama (<em>shared memory</em>).</li></ul>
<h2>3. Aturan Pertama Setiap Berkas PHP Modern: <code>declare(strict_types=1);</code></h2>
<p>Secara bawaan (tanpa pengaturan khusus), PHP berjalan dalam mode <em>coercive</em> (longgar): jika sebuah fungsi meminta parameter <code>int $jumlah</code>, tetapi Anda mengirim string <code>&quot;42&quot;</code>, PHP diam-diam mengubahnya menjadi angka <code>42</code>. Lebih parah lagi, di versi lama, ketidakcocokan tipe sering kali meloloskan konversi yang tidak disengaja.</p>
<p>Dalam pengembangan PHP modern, <strong>selalu awali setiap berkas <code>.php</code> Anda dengan deklarasi <code>declare(strict_types=1);</code> tepat di baris pertama setelah <code>&lt;?php</code></strong>:</p>
<pre>&lt;?php

declare(strict_types=1);

function hitungDiskon(int $harga, float $persen): float
{
    return $harga * ($persen / 100);
}

// Berhasil karena tipe argumen cocok (int dan float):
echo hitungDiskon(100_000, 15.0); // 15000

// Dalam mode strict_types=1, baris di bawah ini langsung melempar TypeError!
// (Mencegah bug tersembunyi akibat mengirim string &quot;100000&quot; ke parameter int)
// echo hitungDiskon(&quot;100000&quot;, 15.0);</pre>
<div class="callout info"><div class="callout-judul">💡 Tiga Aturan Penting Penulisan Berkas PHP</div><ol><li><strong><code>declare(strict_types=1);</code> berlaku per berkas (file-level directive):</strong> Ia harus menjadi pernyataan paling pertama di dalam berkas, bahkan sebelum <code>namespace</code>!</li><li><strong>Jangan menulis tag penutup <code>?&gt;</code> pada berkas yang murni berisi kode PHP!</strong> Menurut standar PSR-12, menghilangkan tag penutup <code>?&gt;</code> di akhir berkas mencegah karakter spasi atau baris baru tak terlihat di bawah <code>?&gt;</code> ikut terkirim secara tidak sengaja dan merusak pengiriman header HTTP (<code>Cannot modify header information - headers already sent</code>).</li><li><strong>Gunakan pemisah ribuan garis bawah (<code>100_000</code>):</strong> Sejak PHP 7.4+, Anda dapat menulis angka besar sebagai <code>1_000_000</code> agar jauh lebih mudah dibaca manusia.</li></ol></div>
<h2>4. Menjalankan PHP lewat CLI dan Server Pengembangan Bawaan</h2>
<p>Anda tidak perlu menginstal Apache atau Nginx yang rumit saat sedang belajar di komputer lokal. PHP sudah menyediakan <strong>Built-in Web Server</strong> untuk pengembangan:</p>
<pre># 1. Memeriksa versi PHP yang terpasang di terminal
php -v

# 2. Menjalankan satu berkas skrip PHP langsung di terminal (CLI SAPI)
php latihan.php

# 3. Menjalankan server web pengembangan di http://127.0.0.1:8000
#    dengan menjadikan folder 'public/' sebagai akar dokumen web
php -S 127.0.0.1:8000 -t public</pre>
<h2>Latihan Praktik: Menjalankan Skrip Pertama dengan <code>strict_types</code></h2>
<p>Buatlah berkas <code>info-lingkungan.php</code>:</p>
<ol><li>Aktifkan <code>declare(strict_types=1);</code> di baris pertama dan jangan gunakan tag penutup <code>?&gt;</code> di akhir berkas.</li><li>Buat fungsi <code>ringkasanServer(string $namaAplikasi, int $tahun): string</code> yang mengembalikan informasi nama aplikasi, tahun, dan konstanta bawaan <code>PHP_VERSION</code> serta <code>PHP_SAPI</code>.</li><li>Jalankan berkas tersebut melalui terminal dengan <code>php info-lingkungan.php</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/supported-versions.php" rel="noopener">Supported Versions — PHP.net</a></li><li><a href="https://www.php.net/manual/en/language.basic-syntax.php" rel="noopener">Basic syntax — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/language.types.declarations.php" rel="noopener">Type declarations (<code>strict_types</code>) — PHP Manual</a></li><li><a href="https://www.php-fig.org/psr/psr-12/" rel="noopener">PSR-12: Extended Coding Style — PHP-FIG</a></li></ul></div>
`,
    perintah: ["declare(strict_types=1);","?>",".php","<html>","8.4","8.5"],
    kuis: [
        {"tanya":"Berdasarkan kebijakan siklus rilis resmi PHP, berapa lama satu cabang rilis PHP (misalnya PHP 8.4 atau PHP 8.5) mendapatkan dukungan sejak rilis stabil pertamanya?","opsi":["1 tahun dukungan penuh tanpa perpanjangan keamanan.","Total 4 tahun: terdiri dari 2 tahun dukungan aktif (Active Support) ditambah 2 tahun perbaikan celah keamanan kritis (Security Support), yang berakhir pada tanggal 31 Desember.","10 tahun dukungan jangka panjang untuk semua versi.","Hanya didukung sampai versi berikutnya dirilis."],"benar":1,"penjelasan":"Setiap cabang rilis PHP mendapatkan 2 tahun dukungan aktif (perbaikan bug dan keamanan rutin) yang diikuti oleh 2 tahun dukungan keamanan kritis, dengan tanggal akhir siklus diselaraskan pada 31 Desember."},
        {"tanya":"Mengapa standar kode PHP modern (PSR-12) melarang penulisan tag penutup ?> pada berkas yang hanya berisi kode PHP murni?","opsi":["Karena tag ?> menyebabkan galat sintaks sejak PHP 8.0.","Untuk mencegah spasi kosong atau baris baru (whitespace) yang tidak sengaja tertulis setelah tag ?> terkirim lebih awal sebagai tubuh respons HTTP, yang akan menggagalkan fungsi pengaturan header seperti header(), setcookie(), atau session_start().","Karena tanpa ?>, berkas PHP berjalan dua kali lebih cepat.","Agar berkas PHP dapat dibaca langsung oleh peramban tanpa server."],"benar":1,"penjelasan":"Di PHP, karakter apa pun di luar pasangan tag <?php ... ?> (termasuk satu spasi atau baris kosong setelah ?> di akhir berkas yang di-require) langsung dikirim ke buffer keluaran HTTP. Hal ini memicu galat klasik Headers already sent saat aplikasi hendak mengatur cookie atau sesi."},
        {"tanya":"Di manakah deklarasi declare(strict_types=1); harus diletakkan, dan sejauh mana cakupan pengaruhnya?","opsi":["Diletakkan di dalam fungsi main(), dan otomatis mengubah seluruh berkas di dalam folder vendor/.","Diletakkan sebagai pernyataan pertama di bagian paling atas berkas .php (sebelum pernyataan namespace atau kode lainnya), dan hanya berlaku untuk pemanggilan fungsi yang dilakukan di dalam berkas itu sendiri.","Diletakkan di baris paling bawah berkas PHP.","Ditulis di dalam berkas composer.json."],"benar":1,"penjelasan":"declare(strict_types=1); wajib menjadi pernyataan pertama di dalam skrip PHP dan bekerja pada cakupan per berkas (per-file directive) supaya kode Anda dapat menerapkan pemeriksaan tipe ketat tanpa merusak pustaka pihak ketiga yang mungkin belum mengaktifkannya."}
    ]
},
{
    id: 2,
    kategori: "1 · Fondasi",
    judul: "Sintaks, Sistem Tipe Modern, Ekspresi match, dan Operator Pipe (|)",
    tingkat: "Dasar", durasi: "10 mnt",
    tag: ["match","|>","null"],
    ringkas: "Menguasai variabel, konstanta, deklarasi tipe skalar dan gabungan (union/intersection types), perbandingan ketat ===, ekspresi match (sejak PHP 8.0), operator nullsafe ?->, hingga operator pipe |> (sejak PHP 8.5).",
    isi: `
<h2>1. Variabel, Konstanta, dan Sistem Tipe Data di PHP 8</h2>
<p>Di PHP, seluruh nama variabel diawali dengan tanda dolar (<strong><code>$</code></strong>, misalnya <code>$namaPengguna</code>), bersifat peka huruf besar/kecil (<em>case-sensitive</em>), sedangkan konstanta didefinisikan dengan kata kunci <strong><code>const</code></strong> (tanpa tanda <code>$</code>):</p>
<pre>&lt;?php

declare(strict_types=1);

const PAJAK_PPN = 0.11;
const STATUS_AKTIF = 'aktif';

$hargaDasar = 250_000;
$totalPajak = $hargaDasar * PAJAK_PPN;</pre>
<h3>Daftar Tipe Data yang Didukung dalam Deklarasi Tipe PHP Modern</h3>
<table><thead><tr><th>Kategori</th><th>Tipe Data</th><th>Penjelasan dan Versi</th></tr></thead><tbody><tr><td><strong>Tipe Skalar</strong></td><td><code>int</code>, <code>float</code>, <code>string</code>, <code>bool</code></td><td>Bilangan bulat 64-bit, desimal titik-ambang, teks, dan boolean (<code>true</code>/<code>false</code>).</td></tr><tr><td><strong>Tipe Majemuk</strong></td><td><code>array</code>, <code>object</code>, <code>callable</code>, <code>iterable</code></td><td>Daftar/peta array, instans objek, fungsi yang dapat dipanggil, dan koleksi yang bisa di-<code>foreach</code>.</td></tr><tr><td><strong>Tipe Khusus</strong></td><td><code>void</code>, <code>null</code>, <code>false</code>, <code>true</code>, <code>never</code>, <code>mixed</code></td><td><code>void</code> (tidak mengembalikan nilai), <code>never</code> (selalu melempar exception atau keluar — sejak PHP 8.1), <code>mixed</code> (tipe apa saja — sejak PHP 8.0).</td></tr><tr><td><strong>Nullable Type (<code>?T</code>)</strong></td><td><code>?string</code>, <code>?int</code>, <code>?Pengaturan</code></td><td>Mengizinkan nilai bertipe <code>T</code> <strong>atau</strong> <code>null</code> (sama dengan <code>string|null</code>).</td></tr><tr><td><strong>Union Types (<code>A|B</code>)</strong></td><td><code>int|float</code>, <code>string|Stringable</code></td><td>Mengizinkan nilai dari salah satu tipe yang digabungkan dengan tanda <code>|</code> (sejak PHP 8.0).</td></tr><tr><td><strong>Intersection Types (<code>A&amp;B</code>)</strong></td><td><code>Iterator&amp;Countable</code></td><td>Nilai wajib memenuhi <strong>semua</strong> interface/tipe yang digabungkan dengan <code>&amp;</code> (sejak PHP 8.1).</td></tr></tbody></table>
<div class="callout waspada"><div class="callout-judul">⚠️ Deprekasi Penting di PHP 8.5: Nama Cast Non-Kanonik!</div><p>Sejak <strong>PHP 8.5</strong>, penggunaan nama konversi tipe (<em>type casting</em>) versi panjang yaitu <code>(integer)</code>, <code>(boolean)</code>, <code>(double)</code>, dan <code>(binary)</code> <strong>telah dideprekasi (usang)</strong>. Selalu gunakan bentuk pendek kanonik: <strong><code>(int)</code></strong>, <strong><code>(bool)</code></strong>, <strong><code>(float)</code></strong>, dan <strong><code>(string)</code></strong>!</p></div>
<h2>2. Perbandingan Ketat (<code>===</code>) dan Ekspresi <code>match</code> (Sejak PHP 8.0)</h2>
<p>Sama seperti di JavaScript, hindari operator kesetaraan longgar <code>==</code> di PHP dan <strong>selalu gunakan operator kesetaraan ketat <code>===</code> serta <code>!==</code></strong> yang memeriksa kesamaan nilai sekaligus tipe datanya.</p>
<p>Begitu pula untuk percabangan multi-kondisi: pernyataan <code>switch (...)</code> tradisional memiliki dua kelemahan besar:</p>
<ol><li>Menggunakan perbandingan longgar (<code>==</code>) secara diam-diam.</li><li>Mengharuskan Anda menulis <code>break;</code> di setiap <code>case</code> (jika lupa, eksekusi akan bocor jatuh ke <code>case</code> berikutnya / <em>fallthrough</em>).</li></ol>
<p>Sejak <strong>PHP 8.0</strong>, hadir ekspresi <strong><code>match</code></strong> yang jauh lebih aman, ringkas, dan dapat langsung mengembalikan nilai ke dalam sebuah variabel:</p>
<pre>&lt;?php

declare(strict_types=1);

function deskripsiStatusHttp(int $kode): string
{
    return match ($kode) {
        200, 201, 204 =&gt; 'Permintaan berhasil diproses',
        301, 302, 307, 308 =&gt; 'Alamat sumber daya dialihkan',
        400 =&gt; 'Permintaan tidak valid (Bad Request)',
        401, 403 =&gt; 'Akses ditolak atau belum terautentikasi',
        404 =&gt; 'Sumber daya tidak ditemukan',
        default =&gt; 'Kesalahan server atau status tidak dikenal',
    };
}

echo deskripsiStatusHttp(404); // &quot;Sumber daya tidak ditemukan&quot;</pre>
<h3>Keunggulan <code>match</code> dibandingkan <code>switch</code>:</h3>
<ol><li><strong>Perbandingan Ketat (<code>===</code>):</strong> Angka <code>200</code> tidak akan pernah salah cocok dengan string <code>&quot;200&quot;</code>.</li><li>**Tidak Ada <em>Fallthrough</em> Tak Sengaja:** Setiap lengan otomatis berhenti setelah dievaluasi tanpa perlu kata kunci <code>break</code>, dan beberapa kondisi dapat digabungkan cukup dengan tanda koma (<code>200, 201, 204 =&gt; ...</code>).</li><li><strong>Menghasilkan Nilai Ekspresi:</strong> Hasil <code>match</code> dapat langsung di-<code>return</code> atau disimpan ke dalam variabel <code>$pesan = match (...) { ... };</code>.</li><li><strong>Exhaustiveness Check:</strong> Jika tidak ada nilai yang cocok dan Anda tidak menyediakan cabang <code>default</code>, PHP tidak diam saja melainkan langsung melempar <strong><code>UnhandledMatchError</code></strong>!</li></ol>
<h2>3. Operator Null Coalescing (<code>??</code>, <code>??=</code>) dan Nullsafe (<code>?-&gt;</code>)</h2>
<p>Untuk menangani nilai yang mungkin bernilai <code>null</code> tanpa perlu menulis blok <code>if ($obj !== null)</code> berulang-ulang:</p>
<pre>&lt;?php

declare(strict_types=1);

// 1. Null Coalescing Operator (??): Mengambil sisi kanan jika sisi kiri tidak ada atau bernilai null
//    (Aman digunakan pada kunci array yang belum tentu ada tanpa memicu Warning!)
$halaman = (int) ($_GET['page'] ?? 1);

// 2. Null Coalescing Assignment (??=): Isi variabel HANYA JIKA saat ini bernilai null
$konfigurasi['batas_waktu'] ??= 30;

// 3. Nullsafe Operator (?-&gt;) (Sejak PHP 8.0):
//    Jika $pesanan, getPelanggan(), atau getAlamat() bernilai null,
//    seluruh rantai langsung berhenti dan menghasilkan null tanpa galat!
$kodePos = $pesanan?-&gt;getPelanggan()?-&gt;getAlamat()?-&gt;kodePos ?? '00000';</pre>
<h2>4. Operator Pipe (<code>|&gt;</code>) untuk Merangkai Fungsi (Baru Sejak PHP 8.5)</h2>
<p>Ketika kita perlu menerapkan beberapa fungsi transformasi secara berurutan pada sebuah data, di versi PHP lama kita terpaksa menulis pemanggilan fungsi bersarang yang harus dibaca dari dalam ke luar (<em>inside-out</em>), atau membuat banyak variabel sementara.</p>
<p>Sejak <strong>PHP 8.5</strong>, hadir <strong>Pipe Operator (<code>|&gt;</code>)</strong> yang mengalirkan hasil dari sisi kiri sebagai argumen ke callable di sisi kanan secara berurutan dari kiri ke kanan:</p>
<pre>&lt;?php

declare(strict_types=1);

$judulMentah = '   Belajar PHP 8.5 di Kodeloka!   ';

// Cara Lama (PHP &lt;= 8.4): Harus dibaca dari paling dalam (trim -&gt; str_replace -&gt; strtolower)
$slugLama = strtolower(
    str_replace([' ', '.'], ['-', ''], trim($judulMentah, &quot; !&quot;))
);

// Cara Baru (Sejak PHP 8.5): Mengalir rapi dari atas ke bawah dengan operator |&gt;
$slugBaru = $judulMentah
    |&gt; (fn(string $teks): string =&gt; trim($teks, ' !'))
    |&gt; (fn(string $teks): string =&gt; str_replace([' ', '.'], ['-', ''], $teks))
    |&gt; strtolower(...);

var_dump($slugBaru); // string(26) &quot;belajar-php-85-di-kodeloka&quot;</pre>
<h2>Latihan Praktik: Konverter Tarif Pengiriman dengan <code>match</code> dan Tipe Ketat</h2>
<p>Buatlah berkas <code>tarif-kirim.php</code> dan jalankan dengan <code>php tarif-kirim.php</code>:</p>
<ol><li>Buat fungsi <code>hitungOngkir(string $zona, int|float $beratKg): int</code> dengan <code>declare(strict_types=1);</code>.</li><li>Gunakan ekspresi <code>match ($zona)</code> untuk menentukan tarif per kilogram (<code>'jawa' =&gt; 10_000</code>, <code>'sumatera', 'bali' =&gt; 18_000</code>, <code>'kalimantan', 'sulawesi' =&gt; 25_000</code>, <code>'papua', 'maluku' =&gt; 40_000</code>). Jika zona tidak dikenal, biarkan <code>match</code> atau lempar <code>InvalidArgumentException</code>.</li><li>Kalikan tarif dengan <code>ceil($beratKg)</code> dan kembalikan hasilnya sebagai <code>(int)</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/language.types.php" rel="noopener">Types — PHP Manual</a></li><li><a href="https://www.php.net/releases/8.5/en.php" rel="noopener">PHP 8.5 Release Announcement (Pipe Operator) — PHP.net</a></li><li><a href="https://www.php.net/manual/en/langref.php" rel="noopener">Language Reference — PHP Manual</a></li></ul></div>
`,
    perintah: ["match","null","===","$","true","false"],
    kuis: [
        {"tanya":"Apa perbedaan mendasar antara pernyataan switch ($nilai) dan ekspresi match ($nilai) (sejak PHP 8.0)?","opsi":["switch menggunakan perbandingan ketat (===), sedangkan match menggunakan perbandingan longgar (==).","match menggunakan perbandingan identitas ketat (===), mengembalikan nilai sebagai ekspresi, tidak mengalami kebocoran antar-cabang (fallthrough) tanpa break, serta melempar UnhandledMatchError jika tidak ada cabang yang cocok.","match hanya dapat digunakan untuk memeriksa nilai bertipe boolean.","switch sudah dihapus dari PHP 8.4."],"benar":1,"penjelasan":"Ekspresi match memperbaiki seluruh kelemahan klasik switch: ia mengevaluasi kondisi dengan ===, langsung mengembalikan hasil ekspresi lengan yang cocok, tidak butuh break, dan mencegah kondisi tak tertangani lewat UnhandledMatchError."},
        {"tanya":"Perhatikan deklarasi parameter fungsi berikut: function proses(int|float|null $nilai): void. Apa arti dari deklarasi tipe parameter tersebut?","opsi":["Parameter $nilai wajib berupa array yang berisi integer, float, dan null sekaligus.","Parameter $nilai menggunakan Union Type yang mengizinkan argumen bertipe int, bertipe float, atau bernilai null.","Parameter $nilai otomatis diubah menjadi string.","Fungsi akan membagi $nilai dengan null."],"benar":1,"penjelasan":"Tanda pipa tunggal (|) pada deklarasi tipe (sejak PHP 8.0) menyatakan Union Type, yaitu parameter atau nilai kembalian dapat bernilai salah satu dari tipe-tipe yang disebutkan."},
        {"tanya":"Apa fungsi dari operator pipe (|>) yang diperkenalkan sejak PHP 8.5?","opsi":["Melakukan operasi bitwise OR pada dua bilangan bulat.","Meneruskan nilai hasil evaluasi di sebelah kiri sebagai argumen ke fungsi/callable di sebelah kanan, sehingga rantai pemrosesan data dapat ditulis mengalir dari kiri ke kanan tanpa fungsi bersarang yang berlapis-lapis.","Menggabungkan dua tabel basis data secara otomatis.","Menggantikan operator penugasan =."],"benar":1,"penjelasan":"Operator |> di PHP 8.5 memungkinkan komposisi fungsi yang bersih dan mudah dibaca secara berurutan dari kiri ke kanan (atau atas ke bawah), misalnya $teks |> trim(...) |> strtolower(...)."}
    ]
},
{
    id: 3,
    kategori: "1 · Fondasi",
    judul: "Pengolahan String Multibyte (mb_*) dan Array Modern di PHP 8.4 & 8.5",
    tingkat: "Dasar", durasi: "10 mnt",
    tag: ["mb_*","array_filter()","strlen()"],
    ringkas: "Memanipulasi teks UTF-8 dengan aman menggunakan fungsi mb_* dan str_contains() / str_starts_with(), serta menguasai struktur data Array PHP, destructuring/unpacking, hingga fungsi baru array_find() (PHP 8.4) dan array_first() / array_last() (PHP 8.5).",
    isi: `
<h2>1. String di PHP dan Mengapa Fungsi <code>mb_*</code> Sangat Penting untuk UTF-8</h2>
<p>Di PHP, string yang diapit tanda kutip tunggal (<code>'...'</code>) dibaca apa adanya, sedangkan string yang diapit tanda kutip ganda (<code>&quot;...&quot;</code>) atau blok <strong>Heredoc</strong> (<code>&lt;&lt;&lt;TEKS ... TEKS</code>) mendukung interpolasi variabel secara langsung (<code>&quot;Halo, {$nama}!&quot;</code>).</p>
<h3>Jebakan Klasik: <code>strlen()</code> Menghitung Byte, Bukan Karakter Huruf!</h3>
<p>Fungsi string klasik di PHP seperti <code>strlen()</code>, <code>substr()</code>, dan <code>strtolower()</code> berasal dari era ASCII di mana 1 karakter selalu dianggap berukuran 1 byte. Padahal, dalam pengodean <strong>UTF-8</strong> modern, huruf beraksen (seperti <code>é</code>), aksara daerah/Jepang/Arab, atau emoji (seperti <code>🚀</code>) berukuran <strong>2 hingga 4 byte per karakter</strong>!</p>
<pre>&lt;?php

declare(strict_types=1);

$teks = 'Kodeloka 🚀'; // 8 huruf + 1 spasi + 1 emoji = 10 karakter

// SALAH untuk menghitung panjang karakter UTF-8:
echo strlen($teks);    // Mencetak 13 (karena emoji 🚀 memakan 4 byte!)

// BENAR: Gunakan fungsi Multibyte String (mb_*) untuk operasi panjang &amp; potong karakter!
echo mb_strlen($teks); // Mencetak 10 (Tepat 10 karakter!)
echo mb_substr($teks, 0, 8); // &quot;Kodeloka&quot;</pre>
<div class="callout info"><div class="callout-judul">💡 Fitur Baru di PHP 8.4: <code>mb_trim()</code>, <code>mb_ucfirst()</code>, dan <code>mb_lcfirst()</code></div><p>Sejak <strong>PHP 8.4</strong>, ekstensi <code>mbstring</code> kini menyediakan <strong><code>mb_trim()</code></strong>, <strong><code>mb_ltrim()</code></strong>, <strong><code>mb_rtrim()</code></strong>, <strong><code>mb_ucfirst()</code></strong>, dan <strong><code>mb_lcfirst()</code></strong> yang mampu memangkas spasi Unicode tak terlihat (seperti <em>non-breaking space</em>) dan mengubah huruf pertama karakter multibyte dengan akurat!</p></div>
<h3>Fungsi Pemeriksaan Substring Modern (Sejak PHP 8.0)</h3>
<p>Jangan lagi menggunakan <code>strpos($teks, 'kata') !== false</code> yang rawan salah ketik! Sejak PHP 8.0, gunakan tiga fungsi boolean yang sangat jelas ini:</p>
<pre>&lt;?php

declare(strict_types=1);

$jalurBerkas = '/materi/php/03-string-dan-array.md';

var_dump(str_starts_with($jalurBerkas, '/materi/')); // bool(true)
var_dump(str_ends_with($jalurBerkas, '.md'));        // bool(true)
var_dump(str_contains($jalurBerkas, 'php'));         // bool(true)</pre>
<h2>2. Anatomi Array di PHP: Satu Struktur untuk List dan Kamus (<em>Map</em>)</h2>
<p>Di PHP, tipe data <code>array</code> adalah struktur peta terurut (<em>ordered map</em>) serbaguna yang dapat berperan sebagai:</p>
<ol><li><strong>List (Array Terindeks Angka Berurutan <code>0, 1, 2, ...</code>):</strong> <code>$modul = ['HTML', 'CSS', 'JavaScript', 'PHP'];</code> <em>(Anda dapat memeriksa apakah sebuah array merupakan list murni berindeks <code>0..n-1</code> menggunakan fungsi <strong><code>array_is_list($arr)</code></strong> sejak PHP 8.1!)</em></li><li><strong>Associative Array (Pasangan Kunci-Nilai seperti Map/Dictionary):</strong> \`\`<code>php $kelas = [ 'slug' =&gt; 'php', 'judul' =&gt; 'Pemrograman PHP Modern', 'jumlah_modul' =&gt; 15, ]; </code>\`\`</li></ol>
<h3>Destructuring dan Array Unpacking (<code>...</code>)</h3>
<p>Sejak PHP 7.4 dan PHP 8.1, Anda dapat membongkar isi array (baik list maupun asosiatif) dan menggabungkan array menggunakan operator <code>...</code> (termasuk array dengan kunci string sejak PHP 8.1):</p>
<pre>&lt;?php

declare(strict_types=1);

$konfigurasiDasar = ['host' =&gt; 'localhost', 'port' =&gt; 5432, 'timeout' =&gt; 5];
$konfigurasiProduksi = ['host' =&gt; 'db.kodeloka.internal', 'sslmode' =&gt; 'require'];

// Menggabungkan dua array asosiatif dengan spread '...'; kunci yang sama di kanan akan menimpa yang kiri!
$konfigurasiAkhir = [...$konfigurasiDasar, ...$konfigurasiProduksi];

// Destructuring array asosiatif berdasarkan nama kuncinya:
['host' =&gt; $hostDb, 'port' =&gt; $portDb] = $konfigurasiAkhir;
echo &quot;{$hostDb}:{$portDb}&quot;; // &quot;db.kodeloka.internal:5432&quot;</pre>
<h2>3. Transformasi Array dan Fungsi Baru di PHP 8.4 &amp; PHP 8.5</h2>
<h3>A. <code>array_map()</code>, <code>array_filter()</code>, dan <code>array_reduce()</code></h3>
<p>Perhatikan satu perbedaan urutan parameter di PHP:</p>
<ul><li>Pada <code>array_map($callback, $array)</code>: <strong>fungsi callback ditulis di argumen pertama</strong>, baru diikuti <code>$array</code> di argumen kedua.</li><li>Pada <code>array_filter($array, $callback)</code>: <strong><code>$array</code> ditulis di argumen pertama</strong>, diikuti <code>$callback</code>!<ul><li><strong>Penting tentang <code>array_filter()</code>:</strong> Secara bawaan, <code>array_filter()</code> <strong>mempertahankan kunci indeks aslinya</strong> (sehingga setelah menyaring indeks <code>0, 1, 2</code>, hasilnya bisa berindeks bolong <code>0, 2</code> yang ketika diubah ke JSON berubah menjadi objek <code>{&quot;0&quot;: ..., &quot;2&quot;: ...}</code>!). Jika Anda membutuhkan array list berindeks ulang <code>0, 1, ...</code>, bungkus hasilnya dengan <strong><code>array_values(array_filter(...))</code></strong>!</li></ul></li></ul>
<h3>B. Pencarian Deklaratif dengan <code>array_find()</code>, <code>array_any()</code>, dan <code>array_all()</code> (Sejak PHP 8.4)</h3>
<p>Sebelum PHP 8.4, mencari satu elemen pertama di dalam array berdasarkan kondisi callback mengharuskan kita menulis perulangan <code>foreach</code> manual. Sejak <strong>PHP 8.4</strong>, tersedia empat fungsi bawaan baru:</p>
<pre>&lt;?php

declare(strict_types=1);

$daftarServer = [
    ['nama' =&gt; 'web-01', 'beban_cpu' =&gt; 42, 'aktif' =&gt; true],
    ['nama' =&gt; 'web-02', 'beban_cpu' =&gt; 88, 'aktif' =&gt; true],
    ['nama' =&gt; 'db-01',  'beban_cpu' =&gt; 91, 'aktif' =&gt; true],
];

// 1. array_find() (Sejak PHP 8.4): Mengembalikan NILAI elemen pertama yang cocok (atau null jika tidak ada)
$serverSibukPertama = array_find(
    $daftarServer,
    static fn(array $srv): bool =&gt; $srv['beban_cpu'] &gt; 80,
);
// Menghasilkan: ['nama' =&gt; 'web-02', 'beban_cpu' =&gt; 88, 'aktif' =&gt; true]

// 2. array_any() (Sejak PHP 8.4): Apakah ADA minimal satu elemen yang memenuhi syarat?
$adaYangKritis = array_any(
    $daftarServer,
    static fn(array $srv): bool =&gt; $srv['beban_cpu'] &gt;= 90,
); // true

// 3. array_all() (Sejak PHP 8.4): Apakah SEMUA elemen memenuhi syarat?
$semuaAktif = array_all(
    $daftarServer,
    static fn(array $srv): bool =&gt; $srv['aktif'] === true,
); // true</pre>
<h3>C. Mengambil Elemen Pertama dan Terakhir dengan <code>array_first()</code> &amp; <code>array_last()</code> (Sejak PHP 8.5)</h3>
<p>Di versi PHP lama, mengambil nilai elemen terakhir tanpa mengubah pointer internal array mengharuskan penulisan <code>$arr === [] ? null : $arr[array_key_last($arr)]</code>. Sejak <strong>PHP 8.5</strong>, hadir fungsi <strong><code>array_first($array)</code></strong> dan <strong><code>array_last($array)</code></strong> yang langsung mengembalikan nilai pertama atau terakhir (atau <code>null</code> jika array kosong):</p>
<pre>&lt;?php

declare(strict_types=1);

$riwayatVersi = ['8.2', '8.3', '8.4', '8.5'];

// Sejak PHP 8.5:
$versiTerbaru = array_last($riwayatVersi); // &quot;8.5&quot;
$versiAwal    = array_first($riwayatVersi); // &quot;8.2&quot;
$kosong       = array_last([]);             // null (Aman digabungkan dengan ?? 'bawaan')</pre>
<h2>Latihan Praktik: Pengolah Katalog Modul dengan Fungsi Array PHP 8.4/8.5</h2>
<p>Buatlah berkas <code>katalog-array.php</code>:</p>
<ol><li>Buat array <code>$modul</code> berisi 4 item asosiatif <code>['id' =&gt; ..., 'judul' =&gt; ..., 'menit' =&gt; ...]</code>.</li><li>Gunakan <code>str_contains()</code> di dalam <code>array_filter()</code> (diikuti <code>array_values()</code>) untuk menyaring modul yang judulnya mengandung kata tertentu.</li><li>Gunakan <code>array_find()</code> (PHP 8.4) untuk mencari modul pertama yang durasinya di atas 20 menit, dan gunakan <code>array_last()</code> (PHP 8.5) atau <code>array_key_last()</code> untuk mengambil modul penutup.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/language.types.string.php" rel="noopener">Strings — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/book.mbstring.php" rel="noopener">Multibyte String (<code>mbstring</code>) — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/language.types.array.php" rel="noopener">Arrays — PHP Manual</a></li><li><a href="https://www.php.net/releases/8.4/en.php" rel="noopener">PHP 8.4 Release Announcement (<code>array_find</code>, <code>mb_trim</code>) — PHP.net</a></li><li><a href="https://www.php.net/releases/8.5/en.php" rel="noopener">PHP 8.5 Release Announcement (<code>array_first</code>, <code>array_last</code>) — PHP.net</a></li></ul></div>
`,
    perintah: ["array_filter()","strlen()","mb_trim()","mb_ucfirst()","mb_lcfirst()","..."],
    kuis: [
        {"tanya":"Mengapa penggunaan strlen($nama) bisa menghasilkan angka yang lebih besar dari jumlah huruf sebenarnya ketika pengguna memasukkan nama yang mengandung karakter non-ASCII atau emoji?","opsi":["Karena strlen() selalu menambahkan angka 1 untuk karakter akhir string.","Karena strlen() menghitung jumlah byte di dalam memori, bukan jumlah karakter Unicode; dalam pengodean UTF-8, satu karakter non-ASCII atau emoji terdiri dari 2 hingga 4 byte, sehingga kita harus menggunakan mb_strlen() untuk menghitung jumlah karakter.","Karena strlen() menghitung jumlah kata, bukan huruf.","Karena tanda kutip tunggal menggandakan ukuran string."],"benar":1,"penjelasan":"strlen() bekerja pada tingkat byte mentah. Untuk teks UTF-8 multibyte, gunakan mb_strlen($teks, 'UTF-8') dari ekstensi mbstring agar setiap karakter dihitung secara akurat sebagai 1 karakter."},
        {"tanya":"Apa masalah yang sering muncul ketika Anda langsung mengubah hasil array_filter($daftar) menjadi JSON menggunakan json_encode(), dan bagaimana cara mengatasinya?","opsi":["array_filter() menghapus semua nilai di dalam array.","array_filter() mempertahankan kunci indeks asli elemen yang lolos saringan; jika elemen indeks ke-0 terbuang sehingga kunci dimulai dari indeks 1, json_encode() akan mengubahnya menjadi objek JSON {\"1\": ...} alih-alih array JSON [...]. Solusinya adalah membungkusnya dengan array_values(array_filter($daftar, ...)).","json_encode() tidak menerima array di PHP 8.","array_filter() membalik urutan elemen secara otomatis."],"benar":1,"penjelasan":"json_encode() hanya menghasilkan array JSON [...] jika array PHP merupakan list dengan kunci bilangan bulat berurutan mulai dari 0 (array_is_list()). Memanggil array_values() akan mengatur ulang indeks hasil saringan kembali menjadi 0, 1, 2, ...."},
        {"tanya":"Fungsi bawaan manakah yang diperkenalkan di PHP 8.4 untuk mengembalikan nilai elemen pertama di dalam array yang memenuhi kondisi fungsi callback (atau mengembalikan null jika tidak ditemukan)?","opsi":["in_array()","array_search()","array_find()","array_slice()"],"benar":2,"penjelasan":"Sejak PHP 8.4, array_find(array $array, callable $callback) (beserta array_find_key(), array_any(), dan array_all()) tersedia secara bawaan untuk mencari elemen berdasarkan kondisi fungsi callback."}
    ]
},
{
    id: 4,
    kategori: "1 · Fondasi",
    judul: "Fungsi, Named Arguments, Closure, Arrow Function (fn), dan #[\\NoDiscard]",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["fn","#[\\NoDiscard]","$this"],
    ringkas: "Menulis fungsi yang ekspresif dan aman dengan deklarasi tipe ketat, named arguments (PHP 8.0), variadic parameters, perbedaan anonymous function (use) dan arrow function (fn), sintaks first-class callable (...), serta atribut #[\\NoDiscard] (PHP 8.5).",
    isi: `
<h2>1. Deklarasi Fungsi Modern, Parameter Bawaan, dan Variadic (<code>...</code>)</h2>
<p>Di PHP modern dengan <code>declare(strict_types=1);</code>, biasakan untuk **selalu mendeklarasikan tipe pada setiap parameter dan tipe nilai kembaliannya (<em>return type</em>)**:</p>
<pre>&lt;?php

declare(strict_types=1);

function buatUrlhalaman(
    string $jalur,
    int $halaman = 1,
    bool $urutTerbaru = true,
): string {
    $arah = $urutTerbaru ? 'desc' : 'asc';
    return sprintf('%s?page=%d&amp;sort=%s', $jalur, $halaman, $arah);
}</pre>
<div class="callout info"><p>**💡 Aturan Koma Terakhir (<em>Trailing Comma</em>):** Anda diizinkan menuliskan koma di akhir daftar argumen pemanggilan multi-baris (sejak PHP 7.3) maupun di akhir daftar parameter fungsi (sejak PHP 8.0). Kebiasaan ini membuat riwayat perubahan Git (<em>git diff</em>) jauh lebih bersih saat Anda menambahkan parameter baru di kemudian hari!</p></div>
<h3>Argumen Bernama (<em>Named Arguments</em> — Sejak PHP 8.0)</h3>
<p>Pernahkah Anda memanggil fungsi yang memiliki banyak parameter opsional seperti <code>setcookie()</code> atau <code>htmlspecialchars()</code>, lalu terpaksa menuliskan sederet nilai bawaan di tengahnya hanya demi mengubah parameter terakhir?</p>
<p>Dengan <strong>Named Arguments</strong>, Anda dapat menyebutkan nama parameternya secara langsung, melewati parameter opsional di tengah yang tidak perlu diubah, dan membuat kode pemanggil mendokumentasikan dirinya sendiri:</p>
<pre>&lt;?php

declare(strict_types=1);

// Tanpa perlu menghafal urutan parameter ke-2, kita langsung menyebut 'urutTerbaru:'
$url = buatUrlhalaman(
    jalur: '/kelas/php',
    urutTerbaru: false,
);
// Menghasilkan: &quot;/kelas/php?page=1&amp;sort=asc&quot;</pre>
<h3>Parameter Variadic (<code>...$items</code>)</h3>
<p>Sama seperti <em>rest parameters</em> di JavaScript, tanda titik tiga (<code>...</code>) mengumpulkan argumen dalam jumlah tak terbatas menjadi sebuah array bertipe ketat:</p>
<pre>&lt;?php

declare(strict_types=1);

function jumlahkanBulat(int ...$angka): int
{
    return array_sum($angka);
}

echo jumlahkanBulat(10, 20, 30, 40); // 100</pre>
<h2>2. Anonymous Function (<code>function () use (...)</code>) vs Arrow Function (<code>fn() =&gt; ...</code>)</h2>
<p>Di PHP, fungsi anonim (<em>closure</em>) adalah instans dari kelas bawaan <strong><code>Closure</code></strong>. Namun, ada satu aturan cakupan (<em>scope</em>) di PHP yang <strong>sangat berbeda dari JavaScript</strong>:</p>
<p>Di PHP, fungsi di dalam fungsi <strong>TIDAK otomatis mewarisi variabel dari cakupan luarnya</strong> kecuali Anda memilih salah satu dari dua sintaks berikut:</p>
<h3>A. Anonymous Function Multi-Baris (<code>function () use ($variabel)</code>)</h3>
<p>Jika Anda menggunakan kata kunci <code>function</code>, Anda wajib menyebutkan variabel luar mana saja yang ingin dibawa masuk menggunakan klausa <strong><code>use (...)</code></strong>:</p>
<pre>&lt;?php

declare(strict_types=1);

$batasMinimum = 75;
$daftarNilai = [60, 80, 95, 70, 88];

// Wajib mencantumkan 'use ($batasMinimum)' agar variabel luar dikenal di dalam fungsi!
$nilaiLulus = array_filter(
    $daftarNilai,
    static function (int $nilai) use ($batasMinimum): bool {
        return $nilai &gt;= $batasMinimum;
    },
);</pre>
<h3>B. Arrow Function Satu Ekspresi (<code>fn() =&gt; ...</code> — Sejak PHP 7.4)</h3>
<p>Untuk fungsi singkat yang hanya berisi <strong>satu ekspresi pengembalian</strong>, gunakan <strong>Arrow Function (<code>fn(...) =&gt; ...</code>)</strong>. Keunggulan utamanya: **<code>fn()</code> secara otomatis menangkap variabel dari cakupan luar berdasarkan nilai (<em>by-value</em>) tanpa perlu menulis <code>use (...)</code>!**</p>
<pre>&lt;?php

declare(strict_types=1);

$batasMinimum = 75;
$daftarNilai = [60, 80, 95, 70, 88];

// Jauh lebih ringkas: $batasMinimum otomatis tertangkap (by-value) tanpa 'use'!
$nilaiLulus = array_values(array_filter(
    $daftarNilai,
    static fn(int $nilai): bool =&gt; $nilai &gt;= $batasMinimum,
));</pre>
<div class="callout info"><div class="callout-judul">💡 Mengapa Menambahkan <code>static</code> di Depan <code>fn()</code> atau <code>function ()</code>?</div><p>Ketika sebuah closure dibuat di dalam metode sebuah class, PHP secara bawaan mengikat objek <code>$this</code> ke dalam closure tersebut. Jika closure tersebut tidak membutuhkan akses ke <code>$this</code>, menambahkan kata kunci <strong><code>static fn(...)</code></strong> mencegah pengikatan <code>$this</code> yang tidak perlu sehingga lebih hemat memori dan lebih jelas maksudnya.</p></div>
<h2>3. Sintaks <em>First-Class Callable</em> (<code>namaFungsi(...)</code> — Sejak PHP 8.1)</h2>
<p>Dulu, ketika ingin meneruskan fungsi bawaan seperti <code>trim</code> atau metode objek sebagai callback ke <code>array_map()</code>, kita terpaksa menulisnya sebagai teks string <code>'trim'</code> atau array <code>[$objek, 'metode']</code> yang sulit diperiksa oleh IDE dan alat analisis statis.</p>
<p>Sejak <strong>PHP 8.1</strong>, gunakan sintaks tiga titik di dalam kurung <strong><code>namaFungsi(...)</code></strong> untuk membuat objek <code>Closure</code> dari fungsi atau metode apa pun dengan aman:</p>
<pre>&lt;?php

declare(strict_types=1);

$inputKotor = ['  html ', ' css  ', '  javascript '];

// Membuat Closure dari fungsi bawaan trim dengan sintaks First-Class Callable:
$inputBersih = array_map(trim(...), $inputKotor);
// Menghasilkan: ['html', 'css', 'javascript']</pre>
<p><em>(Catatan: Sejak <strong>PHP 8.5</strong>, static closures dan first-class callables bahkan sudah dapat digunakan di dalam ekspresi konstanta seperti parameter atribut dan nilai bawaan properti!)</em></p>
<h2>4. Mencegah Nilai Kembalian Terabaikan dengan <code>#[\\NoDiscard]</code> (Baru di PHP 8.5)</h2>
<p>Banyak fungsi di PHP tidak mengubah argumen aslinya, melainkan <strong>mengembalikan nilai baru</strong> (misalnya <code>DateTimeImmutable::modify()</code> atau fungsi perhitungan keamanan). Jika seorang pemrogram memanggil fungsi tersebut tetapi lupa menyimpan nilai kembaliannya ke dalam variabel, baris kode tersebut menjadi sia-sia.</p>
<p>Sejak <strong>PHP 8.5</strong>, Anda dapat menandai fungsi penting tersebut dengan atribut <strong><code>#[\\NoDiscard]</code></strong>. Jika pemanggil mengabaikan nilai kembaliannya, PHP 8.5 akan langsung mengeluarkan peringatan (<em>Warning</em>)!</p>
<pre>&lt;?php

declare(strict_types=1);

#[\\NoDiscard(&quot;Hasil perhitungan tanda tangan HMAC wajib disimpan atau diverifikasi.&quot;)]
function buatSignatureHmac(string $pesan, string $kunciRahasia): string
{
    return hash_hmac('sha256', $pesan, $kunciRahasia);
}

// BENAR: Nilai kembalian disimpan dan digunakan
$sig = buatSignatureHmac('order_101', 'kunci-rahasia');

// Memanggil buatSignatureHmac('order_101', 'kunci-rahasia'); begitu saja tanpa disimpan
// akan memicu Warning di PHP 8.5! (Kecuali sengaja diabaikan dengan cast '(void) buatSignatureHmac(...)')</pre>
<h2>Latihan Praktik: Pipeline Pemformatan Data dengan Arrow Function dan First-Class Callable</h2>
<p>Buatlah berkas <code>fungsi-pipeline.php</code>:</p>
<ol><li>Buat fungsi <code>#[\\NoDiscard] function bersihkanDaftarTag(string ...$tagMentah): array</code>.</li><li>Di dalamnya, gunakan <code>array_map(mb_strtolower(...), $tagMentah)</code> dan <code>array_map(trim(...), ...)</code> untuk merapikan setiap tag, lalu saring tag yang panjangnya minimal 2 karakter menggunakan <code>array_filter()</code> dengan <em>arrow function</em> <code>static fn(string $t): bool =&gt; mb_strlen($t) &gt;= 2</code>.</li><li>Kembalikan daftar tag unik yang sudah diindeks ulang dengan <code>array_values(array_unique(...))</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/language.functions.php" rel="noopener">Functions (User-defined functions, Anonymous functions, Arrow Functions, First-class callable syntax) — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/functions.first_class_callable_syntax.php" rel="noopener">First-class callable syntax — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/class.nodiscard.php" rel="noopener">The NoDiscard attribute — PHP Manual</a></li><li><a href="https://www.php.net/releases/8.5/en.php" rel="noopener">PHP 8.5 Release Announcement (<code>#[\\NoDiscard]</code>) — PHP.net</a></li></ul></div>
`,
    perintah: ["$this","...","fn() => ...","Closure","use (...)","fn()"],
    kuis: [
        {"tanya":"Apa perbedaan utama antara fungsi anonim biasa (function ($x) { ... }) dan arrow function (fn($x) => ...) di PHP dalam hal mengakses variabel dari lingkup luar?","opsi":["Arrow function dapat berisi puluhan baris pernyataan if dan foreach, sedangkan fungsi anonim biasa hanya satu baris.","Fungsi anonim biasa tidak dapat mengakses variabel dari lingkup luar kecuali disebutkan secara eksplisit melalui klausa use ($variabel), sedangkan arrow function (fn() => ...) secara otomatis menangkap variabel dari lingkup luar berdasarkan nilai (by-value).","Arrow function otomatis mengubah nilai variabel di lingkup luar secara permanen (by-reference).","Fungsi anonim biasa tidak dapat mengembalikan nilai."],"benar":1,"penjelasan":"Di PHP, lingkup fungsi terisolasi secara ketat. Pada function (), Anda wajib menulis use ($var) untuk mengimpor variabel luar. Sebaliknya, fn() => ... secara otomatis mengimpor variabel luar by-value untuk ekspresi tunggalnya."},
        {"tanya":"Apa arti dari penulisan strlen(...) (dengan tiga titik di dalam tanda kurung) yang diperkenalkan sejak PHP 8.1?","opsi":["Memanggil fungsi strlen dengan argumen kosong.","Sintaks First-Class Callable yang menghasilkan objek Closure yang merujuk langsung ke fungsi strlen, sehingga aman diteruskan sebagai callback (misalnya ke array_map(strlen(...), $daftar)).","Menghapus fungsi strlen dari memori.","Mengirimkan seluruh isi array ke dalam strlen."],"benar":1,"penjelasan":"Sintaks callable(...) adalah First-Class Callable Syntax di PHP 8.1+ yang membuat objek Closure dari fungsi, metode objek ($this->proses(...)), atau metode statis (Kelas::metode(...)) dengan dukungan penuh analisis statis dan IDE."},
        {"tanya":"Apa fungsi dari atribut #[\\NoDiscard] yang ditambahkan pada sebuah deklarasi fungsi sejak PHP 8.5?","opsi":["Mencegah fungsi tersebut dihapus oleh Garbage Collector.","Memerintahkan mesin PHP untuk mengeluarkan peringatan (Warning) apabila fungsi tersebut dipanggil tanpa menggunakan atau menyimpan nilai kembaliannya (return value).","Menyimpan hasil fungsi ke dalam cache secara permanen.","Melarang fungsi tersebut melempar Exception."],"benar":1,"penjelasan":"Atribut #[\\NoDiscard] di PHP 8.5 meningkatkan keamanan API dengan memberi peringatan jika pengembang lupa menangkap nilai kembalian dari fungsi yang hasilnya penting (seperti objek immutable atau status verifikasi)."}
    ]
},
{
    id: 5,
    kategori: "1 · Fondasi",
    judul: "Tanggal, Waktu (DateTimeImmutable), Zona Waktu UTC, dan Internasionalisasi (intl)",
    tingkat: "Menengah", durasi: "8 mnt",
    tag: ["DateTimeImmutable","intl","UTC"],
    ringkas: "Mengelola waktu dengan aman menggunakan DateTimeImmutable (dan metode mikrodetik PHP 8.4), memisahkan penyimpanan waktu UTC di basis data dari tampilan zona waktu lokal (Asia/Jakarta), menghitung rentang waktu dengan DateInterval, serta memformat angka dan tanggal menggunakan ekstensi intl.",
    isi: `
<h2>1. Mengapa Wajib Menggunakan <code>DateTimeImmutable</code> dan Bukan <code>DateTime</code>?</h2>
<p>Di PHP, terdapat dua kelas tanggal utama yang mengimplementasikan <code>DateTimeInterface</code>:</p>
<ol><li><strong><code>DateTime</code> (Mutable / Berbahaya):</strong> Ketika Anda memanggil <code>$tanggal-&gt;modify('+7 days')</code>, <strong>objek <code>$tanggal</code> aslinya ikut berubah di tempat</strong>! Jika objek <code>$tanggalMulai</code> tersebut sudah dikirimkan ke fungsi lain, seluruh bagian program yang memegang referensi ke <code>$tanggalMulai</code> tiba-tiba melihat tanggal yang sudah bergeser 7 hari tanpa sadar!</li><li><strong><code>DateTimeImmutable</code> (Immutable / Standar Terbaik):</strong> Setiap pemanggilan metode pengubah seperti <code>$tanggal-&gt;modify('+7 days')</code> atau <code>$tanggal-&gt;setTimezone(...)</code> <strong>selalu mengembalikan instans objek baru</strong> dan membiarkan objek aslinya utuh 100%!</li></ol>
<pre>&lt;?php

declare(strict_types=1);

$mulaiLangganan = new DateTimeImmutable('2026-10-16 08:00:00', new DateTimeZone('UTC'));

// modify() pada DateTimeImmutable menghasilkan objek baru tanpa mengubah $mulaiLangganan!
$akhirLangganan = $mulaiLangganan-&gt;modify('+30 days');

echo $mulaiLangganan-&gt;format('Y-m-d'); // Tetap &quot;2026-10-16&quot;
echo $akhirLangganan-&gt;format('Y-m-d'); // &quot;2026-11-15&quot;</pre>
<div class="callout info"><div class="callout-judul">💡 Fitur Baru di PHP 8.4 pada <code>DateTimeImmutable</code></div><p>Sejak <strong>PHP 8.4</strong>, tersedia metode statis langsung <strong><code>DateTimeImmutable::createFromTimestamp(int|float $timestamp)</code></strong> (yang mendukung angka bulat detik maupun float dengan pecahan mikrodetik!), serta metode <strong><code>getMicrosecond()</code></strong> dan <strong><code>setMicrosecond(int $microsecond)</code></strong>!</p></div>
<h2>2. Arsitektur Zona Waktu: Simpan dalam <code>UTC</code>, Tampilkan Sesuai Zona Pengguna!</h2>
<p>Pengguna situs Anda di Indonesia tersebar di tiga zona waktu (<strong>WIB / <code>Asia/Jakarta</code> UTC+7</strong>, <strong>WITA / <code>Asia/Makassar</code> UTC+8</strong>, dan <strong>WIT / <code>Asia/Jayapura</code> UTC+9</strong>), belum lagi pengguna di luar negeri.</p>
<p>Jika Anda menyimpan jam lokal mentah tanpa zona waktu di basis data, urutan kejadian antara pengguna di Jakarta dan Makassar akan menjadi kacau! Aturan emas di sistem produksi:</p>
<ol><li><strong>Di Server dan Basis Data:</strong> Selalu simpan waktu dalam zona waktu universal <strong><code>UTC</code></strong> (atau gunakan tipe kolom <code>TIMESTAMPTZ</code> di PostgreSQL).</li><li><strong>Di Lapisan Tampilan (View / API):</strong> Konversikan objek <code>DateTimeImmutable</code> dari <code>UTC</code> ke zona waktu pengguna menggunakan <code>-&gt;setTimezone(new DateTimeZone($zonaPengguna))</code> tepat saat hendak ditampilkan!</li></ol>
<pre>&lt;?php

declare(strict_types=1);

// 1. Waktu kejadian disimpan sebagai UTC di database
$waktuKejadianUtc = new DateTimeImmutable('2026-10-16 07:30:00', new DateTimeZone('UTC'));

// 2. Konversi ke WIB (Asia/Jakarta), WITA (Asia/Makassar), dan WIT (Asia/Jayapura) saat ditampilkan:
$wib  = $waktuKejadianUtc-&gt;setTimezone(new DateTimeZone('Asia/Jakarta'));
$wita = $waktuKejadianUtc-&gt;setTimezone(new DateTimeZone('Asia/Makassar'));
$wit  = $waktuKejadianUtc-&gt;setTimezone(new DateTimeZone('Asia/Jayapura'));

echo $wib-&gt;format('Y-m-d H:i T') . &quot;\\n&quot;;  // &quot;2026-10-16 14:30 WIB&quot;
echo $wita-&gt;format('Y-m-d H:i T') . &quot;\\n&quot;; // &quot;2026-10-16 15:30 WITA&quot;
echo $wit-&gt;format('Y-m-d H:i T') . &quot;\\n&quot;;  // &quot;2026-10-16 16:30 WIT&quot;</pre>
<h3>Menghitung Selisih Waktu dengan <code>diff()</code> dan <code>DateInterval</code></h3>
<pre>&lt;?php

declare(strict_types=1);

$tenggat = new DateTimeImmutable('2026-12-31 23:59:59', new DateTimeZone('Asia/Jakarta'));
$sekarang = new DateTimeImmutable('2026-10-16 14:30:00', new DateTimeZone('Asia/Jakarta'));

$selisih = $sekarang-&gt;diff($tenggat);
// %a mencetak total jumlah hari penuh di antara kedua tanggal
echo $selisih-&gt;format('Tersisa %a hari (%m bulan, %d hari, %h jam)');</pre>
<h2>3. Memformat Mata Uang dan Tanggal Bahasa Indonesia dengan Ekstensi <code>intl</code></h2>
<p>Fungsi <code>DateTimeImmutable::format('l, d F Y')</code> selalu mencetak nama hari dan bulan dalam bahasa Inggris (<code>&quot;Friday, 16 October 2026&quot;</code>). Untuk mencetak tanggal Bahasa Indonesia yang baku (<code>&quot;Jumat, 16 Oktober 2026&quot;</code>) dan mata uang Rupiah yang presisi, gunakan kelas <strong><code>IntlDateFormatter</code></strong> dan <strong><code>NumberFormatter</code></strong> dari ekstensi standar <strong><code>intl</code></strong>:</p>
<pre>&lt;?php

declare(strict_types=1);

// 1. Memformat Mata Uang Rupiah dengan NumberFormatter (ext-intl)
$pemformatUang = new NumberFormatter('id_ID', NumberFormatter::CURRENCY);
$pemformatUang-&gt;setAttribute(NumberFormatter::FRACTION_DIGITS, 0);
echo $pemformatUang-&gt;formatCurrency(1_450_000, 'IDR') . &quot;\\n&quot;; // &quot;Rp1.450.000&quot;

// 2. Memformat Tanggal Lengkap Bahasa Indonesia dengan IntlDateFormatter
$pemformatTanggal = new IntlDateFormatter(
    locale: 'id_ID',
    dateType: IntlDateFormatter::FULL,
    timeType: IntlDateFormatter::SHORT,
    timezone: 'Asia/Jakarta',
);

$waktu = new DateTimeImmutable('2026-10-16 07:30:00', new DateTimeZone('UTC'));
echo $pemformatTanggal-&gt;format($waktu) . &quot;\\n&quot;;
// Keluaran: &quot;Jumat, 16 Oktober 2026 14.30&quot;</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Hasil bisa berbeda</div><p>Bentuk keluaran <code>IntlDateFormatter</code> (misalnya ada tidaknya kata &quot;pukul&quot; antara tanggal dan jam, dan spasi pada <code>Rp1.450.000</code>) bergantung pada versi ICU/CLDR yang terpasang di server; jalankan kodenya di lingkungan Anda untuk melihat hasil persisnya.</p></div>
<h2>Latihan Praktik: Konverter Jadwal Webinar Lintas Zona Waktu Nusantara</h2>
<p>Buatlah berkas <code>jadwal-webinar.php</code>:</p>
<ol><li>Buat fungsi <code>buatJadwalWebinar(string $waktuMulaiWib, int $durasiMenit): array</code> yang menerima string waktu WIB (mis. <code>'2026-11-10 19:00:00'</code>), membuat <code>DateTimeImmutable</code> dengan zona <code>'Asia/Jakarta'</code>, dan menghitung waktu selesainya dengan <code>-&gt;modify(&quot;+{$durasiMenit} minutes&quot;)</code>.</li><li>Kembalikan jadwal lengkap dalam format UTC (untuk disimpan ke database) serta tampilan waktu dalam WIB, WITA, dan WIT!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/class.datetimeimmutable.php" rel="noopener"><code>DateTimeImmutable</code> — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/book.intl.php" rel="noopener">Internationalization Functions (<code>intl</code>) — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/datetimeimmutable.createfromtimestamp.php" rel="noopener"><code>DateTimeImmutable::createFromTimestamp</code> — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/datetimeinterface.getmicrosecond.php" rel="noopener"><code>DateTimeInterface::getMicrosecond</code> — PHP Manual</a></li><li><a href="https://www.php.net/releases/8.4/en.php" rel="noopener">PHP 8.4 Release Announcement — PHP.net</a></li></ul></div>
`,
    perintah: ["DateTimeImmutable","UTC","DateTime","$tanggal->modify('+7 days')","$tanggalMulai","intl"],
    kuis: [
        {"tanya":"Mengapa penggunaan DateTimeImmutable sangat diutamakan dibandingkan kelas DateTime biasa saat meneruskan objek tanggal sebagai parameter ke berbagai fungsi atau layanan?","opsi":["Karena DateTime tidak mendukung zona waktu UTC.","Karena pada DateTime biasa, pemanggilan metode seperti $tgl->modify('+1 day') atau $tgl->setTimezone(...) mengubah nilai objek aslinya secara langsung di memori (mutable side-effect), sedangkan DateTimeImmutable selalu mengembalikan instans objek baru sehingga objek tanggal aslinya dijamin tidak pernah berubah secara tak sengaja.","Karena DateTime sudah dihapus dari PHP 8.2.","Karena DateTimeImmutable tidak memerlukan ekstensi tanggal."],"benar":1,"penjelasan":"Mutasi tak sengaja pada objek DateTime yang dibagikan antar-objek adalah salah satu sumber bug perhitungan tanggal yang paling sulit dilacak. DateTimeImmutable menjamin setiap operasi modifikasi menghasilkan salinan baru yang independen."},
        {"tanya":"Dalam aplikasi web yang melayani pengguna dari berbagai zona waktu (WIB, WITA, WIT, maupun internasional), bagaimana praktik terbaik menyimpan waktu transaksi di dalam basis data?","opsi":["Menyimpan waktu sebagai teks Bahasa Indonesia seperti \"Jumat, 16 Oktober 2026\".","Menyimpan seluruh waktu transaksi secara konsisten dalam zona waktu UTC (atau TIMESTAMPTZ), lalu mengonversinya ke zona waktu lokal masing-masing pengguna hanya pada saat ditampilkan di antarmuka.","Menyimpan tiga kolom terpisah untuk WIB, WITA, dan WIT di setiap tabel.","Mengabaikan zona waktu sama sekali."],"benar":1,"penjelasan":"Menyimpan waktu dalam UTC memberikan garis waktu tunggal yang bebas ambiguitas untuk pengurutan data, pencatatan log, dan perhitungan selisih waktu lintas wilayah."},
        {"tanya":"Pada metode $selisih = $tanggalAwal->diff($tanggalAkhir), kode format manakah pada $selisih->format(...) yang menghasilkan total keseluruhan jumlah hari di antara kedua tanggal tersebut (misalnya 45 hari), bukan sekadar sisa hari setelah dikurangi bulan (15 hari)?","opsi":["%d","%a","%m","%Y"],"benar":1,"penjelasan":"Pada DateInterval::format(), %d hanya menampilkan komponen sisa hari (0–31) setelah tahun dan bulan dihitung. Untuk mendapatkan jumlah total hari penuh di antara dua tanggal, gunakan penanda %a ($selisih->days)."}
    ]
},
{
    id: 6,
    kategori: "2 · OOP & Struktur Kode",
    judul: "Pemrograman Berorientasi Objek (OOP) Modern: Readonly, Asymmetric Visibility, dan Property Hooks",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["readonly","#[\\Override]","get"],
    ringkas: "Merancang class yang ringkas dan tangguh di PHP 8 menggunakan Constructor Property Promotion, Readonly Classes & clone($this, [...]) (PHP 8.5), Asymmetric Visibility public private(set) (PHP 8.4), Property Hooks (PHP 8.4), serta interface dan trait.",
    isi: `
<h2>1. Class Modern dan <em>Constructor Property Promotion</em> (Sejak PHP 8.0)</h2>
<p>Di PHP versi lama, membuat sebuah class sederhana dengan 4 properti mengharuskan kita menulis nama properti yang sama sebanyak <strong>empat kali</strong> (deklarasi properti, parameter konstruktor, penugasan <code>$this-&gt;a = $a</code>, dan getter).</p>
<p>Sejak <strong>PHP 8.0</strong>, fitur <strong>Constructor Property Promotion</strong> memungkinkan Anda mendeklarasikan visibilitas (<code>public</code>, <code>protected</code>, <code>private</code>) langsung di dalam parameter <code>__construct()</code>, dan PHP otomatis membuatkan properti sekaligus mengisi nilainya!</p>
<pre>&lt;?php

declare(strict_types=1);

class KursusKodeloka
{
    public function __construct(
        public string $slug,
        public string $judul,
        public int $jumlahModul,
        private string $kodeInternal = 'KDLK-00',
    ) {}

    public function infoRingkas(): string
    {
        return sprintf('%s (%d modul)', $this-&gt;judul, $this-&gt;jumlahModul);
    }
}

$kursus = new KursusKodeloka('php', 'Pemrograman PHP Modern', 15);
echo $kursus-&gt;infoRingkas(); // &quot;Pemrograman PHP Modern (15 modul)&quot;</pre>
<div class="callout info"><div class="callout-judul">💡 Fitur Ergonomis Baru (Sejak PHP 8.4): <code>new MyClass()-&gt;method()</code> Tanpa Kurung Tambahan!</div><p>Sebelum PHP 8.4, jika Anda ingin langsung memanggil metode saat membuat objek baru, Anda wajib membungkus <code>new</code> dengan tanda kurung ekstra: <code>(new KursusKodeloka(...))-&gt;infoRingkas()</code>. Sejak <strong>PHP 8.4</strong>, Anda dapat langsung menulisnya dengan bersih tanpa kurung pembungkus: <code>echo new KursusKodeloka('php', 'PHP Modern', 15)-&gt;infoRingkas();</code></p></div>
<h2>2. Immutability dengan <code>readonly</code> Class dan <code>clone()</code> Baru (PHP 8.2 &amp; 8.5)</h2>
<p>Objek yang nilainya tidak dapat diubah lagi setelah dibuat (<strong>Immutable Value Object / Data Transfer Object</strong>) sangat aman karena Anda dapat meneruskannya ke fungsi mana pun tanpa khawatir datanya diubah secara diam-diam.</p>
<ul><li>Sejak <strong>PHP 8.1</strong>, Anda dapat menandai properti individual dengan kata kunci <strong><code>readonly</code></strong>.</li><li>Sejak <strong>PHP 8.2</strong>, menandai seluruh class sebagai <strong><code>readonly class</code></strong> otomatis menjadikan seluruh properti di dalamnya bersifat <code>readonly</code>!</li><li>Dan sejak <strong>PHP 8.5</strong>, ketika Anda ingin membuat salinan dari objek <code>readonly</code> sambil memperbarui satu propertinya saja (pola <em>with-er</em>), fungsi <strong><code>clone($objek, ['properti' =&gt; $nilaiBaru])</code></strong> kini mendukung pembaruan properti secara langsung saat penyalinan!</li></ul>
<pre>&lt;?php

declare(strict_types=1);

readonly class KonfigurasiKoneksi
{
    public function __construct(
        public string $host,
        public int $port = 5432,
        public int $timeoutDetik = 5,
    ) {}

    // Pola &quot;with-er&quot; untuk objek immutable:
    // Sejak PHP 8.5, clone() menerima argumen ke-2 berupa array properti yang ingin diperbarui!
    public function denganTimeout(int $detikBaru): self
    {
        return clone($this, [
            'timeoutDetik' =&gt; $detikBaru,
        ]);
    }
}

$koneksiUtama = new KonfigurasiKoneksi('db.kodeloka.internal');
// $koneksiUtama-&gt;timeoutDetik = 10; // Error! Properti readonly tidak boleh diubah di tempat.

$koneksiLaporan = $koneksiUtama-&gt;denganTimeout(30);
echo $koneksiUtama-&gt;timeoutDetik;   // Tetap 5
echo $koneksiLaporan-&gt;timeoutDetik; // 30</pre>
<h2>3. Visibilitas Asimetris (<code>public private(set)</code>) dan Property Hooks (Sejak PHP 8.4)</h2>
<p>Bagaimana jika sebuah objek <em>bukan</em> objek immutable (nilai di dalamnya masih boleh berubah melalui metode bisnis internal class), tetapi Anda ingin pihak luar <strong>bisa membaca nilainya secara langsung tanpa boleh mengubahnya dari luar</strong>?</p>
<p>Dulu kita harus membuat properti <code>private</code> lalu menulis metode <code>getSaldo()</code> yang bertele-tele. Sejak <strong>PHP 8.4</strong>, hadir dua fitur revolusioner:</p>
<h3>A. Asymmetric Visibility (<code>public private(set)</code> — Sejak PHP 8.4)</h3>
<p>Anda dapat mengatur hak baca (<em>read</em>) dan hak tulis (<em>write/set</em>) sebuah properti secara terpisah:</p>
<pre>&lt;?php

declare(strict_types=1);

class DompetBelajar
{
    // Boleh DIBACA oleh siapa saja (public),
    // tetapi HANYA boleh DIUBAH dari dalam class ini sendiri (private(set))!
    public private(set) int $poin = 0;

    public function tambahPoinSelesaiModul(int $tambahan = 10): void
    {
        if ($tambahan &lt;= 0) {
            throw new InvalidArgumentException('Poin harus positif.');
        }
        $this-&gt;poin += $tambahan;
    }
}

$dompet = new DompetBelajar();
$dompet-&gt;tambahPoinSelesaiModul(25);
echo $dompet-&gt;poin; // 25 (Bisa dibaca langsung tanpa getPoin()!)
// $dompet-&gt;poin = 9999; // Error! Tidak boleh diubah dari luar class DompetBelajar.</pre>
<h3>B. Property Hooks (<code>get</code> dan <code>set</code> — Sejak PHP 8.4)</h3>
<p><strong>Property Hooks</strong> memungkinkan Anda menempelkan logika validasi/normalisasi saat properti diisi (<code>set</code>), atau membuat properti terhitung (<em>virtual property</em> dengan <code>get</code>), langsung pada deklarasi properti tanpa mengubah cara pemanggil mengakses <code>$objek-&gt;properti</code>:</p>
<pre>&lt;?php

declare(strict_types=1);

class Pengguna
{
    // 1. Backed property dengan hook 'set' untuk menormalisasi dan memvalidasi surel
    public string $surel {
        set (string $nilai) {
            $bersih = strtolower(trim($nilai));
            if (!filter_var($bersih, FILTER_VALIDATE_EMAIL)) {
                throw new InvalidArgumentException(&quot;Format surel tidak sah: {$nilai}&quot;);
            }
            $this-&gt;surel = $bersih;
        }
    }

    // 2. Virtual property (hanya punya hook 'get', tidak memakan memori penyimpanan tersendiri)
    public string $namaLengkap {
        get =&gt; trim(&quot;{$this-&gt;namaDepan} {$this-&gt;namaBelakang}&quot;);
    }

    public function __construct(
        public string $namaDepan,
        public string $namaBelakang,
        string $surel,
    ) {
        $this-&gt;surel = $surel; // Otomatis melewati hook 'set' di atas!
    }
}

$user = new Pengguna('Nadia', 'Pratama', '  NADIA@AsadinEdu.com ');
echo $user-&gt;surel;       // &quot;nadia@asadinedu.com&quot;
echo $user-&gt;namaLengkap; // &quot;Nadia Pratama&quot;</pre>
<h2>4. Kontrak dengan <code>interface</code>, Pewarisan <code>abstract class</code> (<code>#[\\Override]</code>), dan <code>trait</code></h2>
<ul><li><strong><code>interface</code> (Kontrak Kemampuan):</strong> Mendefinisikan tanda tangan metode publik yang wajib diimplementasikan oleh sebuah class (<code>class PengirimSmtp implements PengirimNotifikasi</code>). Satu class dapat mengimplementasikan banyak <code>interface</code>.</li><li><strong><code>abstract class</code> &amp; <code>#[\\Override]</code> (Sejak PHP 8.3):</strong> Ketika subkelas menimpa metode milik kelas induk atau mengimplementasikan metode interface, tambahkan atribut <strong><code>#[\\Override]</code></strong> di atas metode tersebut! Dengan <code>#[\\Override]</code>, PHP akan segera memberi tahu Anda jika nama metode salah ketik atau jika kelas induk mengubah nama metodenya di masa depan.</li><li><strong><code>trait</code>:</strong> Mekanisme penggunaan ulang kode secara horizontal (<code>use MencatatWaktu;</code>) ketika beberapa class yang tidak memiliki hubungan induk-anak membutuhkan metode pembantu yang sama.</li></ul>
<h2>Latihan Praktik: Merancang Entitas Produk dengan Asymmetric Visibility dan Property Hooks</h2>
<p>Buatlah berkas <code>entitas-produk.php</code>:</p>
<ol><li>Buat <code>class Produk</code> yang menggunakan <em>constructor property promotion</em> untuk <code>public readonly string $kodeSku</code>.</li><li>Tambahkan properti <code>public private(set) int $stok = 0</code> dan metode <code>tambahStok(int $jumlah)</code> serta <code>kurangiStok(int $jumlah)</code>.</li><li>Tambahkan properti <code>$hargaRupiah</code> dengan <em>property hook</em> <code>set</code> yang menolak nilai negatif (<code>InvalidArgumentException</code>), serta <em>virtual property</em> <code>$hargaTerformat</code> dengan hook <code>get</code> yang mengembalikan <code>'Rp' . number_format($this-&gt;hargaRupiah, 0, ',', '.')</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/language.oop5.basic.php" rel="noopener">Classes and Objects: The Basics — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/language.oop5.property-hooks.php" rel="noopener">Property hooks — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/class.override.php" rel="noopener">The Override attribute — PHP Manual</a></li><li><a href="https://www.php.net/releases/8.4/en.php" rel="noopener">PHP 8.4 Release Announcement (Property Hooks, Asymmetric Visibility) — PHP.net</a></li><li><a href="https://www.php.net/releases/8.5/en.php" rel="noopener">PHP 8.5 Release Announcement (Clone With) — PHP.net</a></li></ul></div>
`,
    perintah: ["readonly","#[\\Override]","get","set","interface","private"],
    kuis: [
        {"tanya":"Apa arti dari deklarasi properti public private(set) string $status = 'menunggu'; yang diperkenalkan sejak PHP 8.4?","opsi":["Properti $status bersifat privat untuk dibaca, tetapi boleh diubah secara bebas dari luar class.","Properti $status menggunakan Asymmetric Visibility: nilainya dapat dibaca secara publik (public) dari mana saja, tetapi hanya boleh diubah (set) dari dalam metode milik class itu sendiri (private).","Properti $status hanya boleh diisi satu kali di dalam konstruktor.","Properti $status otomatis dihapus ketika objek di-clone."],"benar":1,"penjelasan":"Asymmetric Visibility di PHP 8.4 memisahkan cakupan izin baca (read visibility di depan) dan izin tulis (set visibility di dalam ...(set)). Dengan public private(set), Anda tidak perlu lagi menulis metode boilerplate getStatus() hanya demi melindungi properti agar tidak ditimpa dari luar."},
        {"tanya":"Bagaimana cara yang paling bersih di PHP 8.5 untuk membuat salinan baru dari sebuah readonly class sambil mengubah nilai satu propertinya saja?","opsi":["Mengubah properti tersebut secara langsung lalu memanggil clone $this.","Menggunakan sintaks Clone With baru di PHP 8.5: return clone($this, ['namaProperti' => $nilaiBaru]);.","Mengubah objek menjadi JSON lalu mengurainya kembali.","Objek dari readonly class tidak diizinkan untuk di-clone sama sekali."],"benar":1,"penjelasan":"Sebelum PHP 8.5, memperbarui properti saat meng-clone readonly class mengharuskan pembuatan ulang instans new self(...) dengan membongkar seluruh propertinya. Sejak PHP 8.5, fungsi clone($objek, $arrayPropertiBaru) memungkinkan pembaruan properti readonly secara resmi tepat pada saat proses kloning berlangsung."},
        {"tanya":"Apa manfaat menambahkan atribut #[\\Override] (sejak PHP 8.3) di atas sebuah metode pada subkelas (child class)?","opsi":["Membuat metode tersebut berjalan dua kali lebih cepat di OPcache.","Meminta mesin PHP memverifikasi pada saat kompilasi bahwa metode dengan nama tersebut memang benar-benar ada di kelas induk atau di interface yang diimplementasikan, sehingga langsung mendeteksi kesalahan ketik nama metode.","Mengizinkan metode private milik kelas induk diakses dari luar.","Menonaktifkan metode milik kelas induk secara permanen di semua kelas lain."],"benar":1,"penjelasan":"Tanpa #[\\Override], jika Anda tidak sengaja salah mengetik nama metode saat hendak menimpa metode kelas induk, PHP akan menganggapnya sebagai metode baru yang terpisah tanpa memberikan pesan galat. Dengan #[\\Override], mesin PHP menjamin metode tersebut benar-benar menimpa metode leluhur/interface."}
    ]
},
{
    id: 7,
    kategori: "2 · OOP & Struktur Kode",
    judul: "Enumerations (enum — Sejak PHP 8.1): Pure Enum, Backed Enum, Metode, dan Interface",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["enum","JsonSerializable","case"],
    ringkas: "Menggantikan konstanta nilai ajaib (magic strings/numbers) dengan tipe enum yang aman di tingkat kompilasi, menguasai Pure Enum dan Backed Enum (string/int), konversi from() vs tryFrom(), serta menambahkan metode dan interface pada Enum.",
    isi: `
<h2>Mengapa Konstanta Biasa Tidak Cukup untuk Merepresentasikan Status?</h2>
<p>Dalam aplikasi nyata, kita selalu berurusan dengan nilai-nilai yang pilihannya terbatas dan sudah pasti: status pesanan (<code>menunggu</code>, <code>dibayar</code>, <code>dikirim</code>, <code>batal</code>), peran pengguna (<code>admin</code>, <code>instruktur</code>, <code>peserta</code>), atau metode pembayaran.</p>
<p>Sebelum <strong>PHP 8.1</strong>, pengembang biasanya menggunakan konstanta kelas bertipe <code>string</code>:</p>
<pre>// Cara Lama (Sebelum PHP 8.1):
class StatusPesananLama {
    public const MENUNGGU = 'menunggu';
    public const DIBAYAR  = 'dibayar';
}
// Kelemahan: Parameter fungsi hanya bisa ditulis 'string $status',
// sehingga pemanggil tetap bisa mengirim 'ngawur' tanpa ditolak oleh tipe parameter!</pre>
<p>Sejak <strong>PHP 8.1</strong>, <strong>Enumerations (<code>enum</code>)</strong> menyelesaikan masalah ini dengan menciptakan <strong>tipe data tersendiri</strong> yang anggotanya dibatasi secara ketat pada daftar <code>case</code> yang Anda tentukan!</p>
<h2>1. Pure Enum (Enum Murni)</h2>
<p><strong>Pure Enum</strong> adalah Enum yang setiap anggotanya (<code>case</code>) berdiri sendiri sebagai instans objek singleton tanpa dikaitkan dengan nilai skalar string atau integer:</p>
<pre>&lt;?php

declare(strict_types=1);

enum TingkatKesulitan
{
    case Dasar;
    case Menengah;
    case Lanjut;
}

function tampilkanLencana(TingkatKesulitan $tingkat): string
{
    // Karena TingkatKesulitan hanya punya 3 case, ekspresi match ini
    // sudah mencakup semua kemungkinan tanpa butuh cabang default!
    return match ($tingkat) {
        TingkatKesulitan::Dasar    =&gt; '🟢 Dasar (Pemula)',
        TingkatKesulitan::Menengah =&gt; '🟡 Menengah',
        TingkatKesulitan::Lanjut   =&gt; '🔴 Lanjut (Produksi)',
    };
}

$pilihan = TingkatKesulitan::Dasar;
echo $pilihan-&gt;name; // Setiap Enum memiliki properti readonly -&gt;name (&quot;Dasar&quot;)
echo tampilkanLencana($pilihan);</pre>
<p>Perhatikan bahwa setiap kasus Enum (<code>TingkatKesulitan::Dasar</code>) adalah objek singleton di memori, sehingga Anda dapat membandingkannya secara langsung dengan operator identitas ketat <strong><code>===</code></strong> (<code>$pilihan === TingkatKesulitan::Dasar</code>)!</p>
<h2>2. Backed Enum (<code>: string</code> atau <code>: int</code>) untuk Database dan JSON</h2>
<p>Ketika sebuah nilai Enum perlu disimpan ke dalam kolom tabel basis data PostgreSQL/MySQL, dikirim lewat formulir HTML <code>&lt;select&gt;</code>, atau diserialisasi ke dalam payload JSON API, gunakan <strong>Backed Enum</strong> dengan mendeklarasikan tipe skalar <strong><code>: string</code></strong> atau <strong><code>: int</code></strong> (hanya boleh salah satu, tidak boleh union <code>int|string</code>!):</p>
<pre>&lt;?php

declare(strict_types=1);

enum PeranPengguna: string
{
    case Admin      = 'admin';
    case Instruktur = 'instruktur';
    case Peserta    = 'peserta';
}

// 1. Membaca nilai skalar untuk disimpan ke database melalui properti readonly -&gt;value:
$peran = PeranPengguna::Instruktur;
echo $peran-&gt;name;  // &quot;Instruktur&quot;
echo $peran-&gt;value; // &quot;instruktur&quot;

// 2. Mengambil seluruh daftar kasus yang tersedia dengan metode statis ::cases():
foreach (PeranPengguna::cases() as $kasus) {
    echo &quot;{$kasus-&gt;name} =&gt; {$kasus-&gt;value}\\n&quot;;
}</pre>
<h3>Mengubah Nilai Database/Form Kembali Menjadi Enum: <code>from()</code> vs <code>tryFrom()</code></h3>
<p>Setiap <em>Backed Enum</em> secara otomatis dilengkapi dua metode pabrik statis bawaan:</p>
<ol><li><strong><code>PeranPengguna::from(string|int $nilai)</code>:</strong> Mengembalikan kasus Enum yang cocok, atau <strong>melempar <code>ValueError</code></strong> jika nilai tidak ditemukan. Gunakan untuk data dari sumber internal yang dijamin valid.</li><li><strong><code>PeranPengguna::tryFrom(string|int $nilai)</code>:</strong> Mengembalikan kasus Enum yang cocok, atau <strong>mengembalikan <code>null</code></strong> jika nilai tidak ditemukan! <strong>Selalu gunakan <code>tryFrom()</code> saat memproses input dari pengguna (<code>$_POST</code>, <code>$_GET</code>, JSON request)</strong>!</li></ol>
<pre>&lt;?php

declare(strict_types=1);

$inputDariForm = $_POST['peran'] ?? '';

// Aman! Jika pengguna mengirim 'superhacker', tryFrom() mengembalikan null
// sehingga otomatis jatuh ke nilai bawaan PeranPengguna::Peserta.
$peranSah = PeranPengguna::tryFrom((string) $inputDariForm) ?? PeranPengguna::Peserta;</pre>
<h2>3. Menambahkan Metode, Konstanta, <code>interface</code>, dan <code>JsonSerializable</code> pada Enum</h2>
<p>Di PHP, <code>enum</code> memiliki banyak kemampuan layaknya <code>class</code> (meskipun tidak boleh memiliki properti/state dinamis dan tidak boleh diwariskan dengan <code>extends</code>):</p>
<ul><li>Enum <strong>boleh memiliki metode publik/privat</strong> dan metode <code>static</code>.</li><li>Enum <strong>boleh memiliki konstanta (<code>public const</code>)</strong> dan memakai <code>trait</code> (selama trait tidak berisi properti).</li><li>Enum <strong>boleh mengimplementasikan <code>interface</code></strong> (termasuk interface bawaan <code>JsonSerializable</code>). Catatan: Backed Enum sudah otomatis di-<code>json_encode()</code> menjadi nilai skalarnya tanpa interface ini, sedangkan Pure Enum akan menimbulkan galat; <code>JsonSerializable</code> hanya dipakai untuk mengubah perilaku bawaan tersebut (contoh di bawah menampilkannya secara eksplisit).</li></ul>
<pre>&lt;?php

declare(strict_types=1);

interface MemilikiHakAkses
{
    public function bolehMenulisMateri(): bool;
}

enum StatusPublikasi: string implements MemilikiHakAkses, JsonSerializable
{
    case Draf      = 'draf';
    case Tinjauan  = 'tinjauan';
    case Terbit    = 'terbit';
    case Diarsipkan = 'arsip';

    public const STATUS_BAWAAN = self::Draf;

    public function bolehMenulisMateri(): bool
    {
        return match ($this) {
            self::Draf, self::Tinjauan =&gt; true,
            self::Terbit, self::Diarsipkan =&gt; false,
        };
    }

    public function warnaLencana(): string
    {
        return match ($this) {
            self::Draf       =&gt; 'abu-abu',
            self::Tinjauan   =&gt; 'kuning',
            self::Terbit     =&gt; 'hijau',
            self::Diarsipkan =&gt; 'merah',
        };
    }

    public function jsonSerialize(): string
    {
        return $this-&gt;value;
    }
}

echo json_encode(['status' =&gt; StatusPublikasi::Terbit]);
// Keluaran: {&quot;status&quot;:&quot;terbit&quot;}</pre>
<h2>Latihan Praktik: Merancang Enum Metode Pembayaran Lengkap dengan Perhitungan Biaya</h2>
<p>Buatlah berkas <code>enum-pembayaran.php</code> dan jalankan dengan <code>php enum-pembayaran.php</code>:</p>
<ol><li>Buat <code>enum MetodePembayaran: string</code> dengan kasus <code>Qris = 'qris'</code>, <code>VirtualAccount = 'va'</code>, dan <code>KartuKredit = 'kartu'</code>.</li><li>Tambahkan metode <code>hitungBiayaLayanan(int $nominalBelanja): int</code> pada Enum tersebut menggunakan ekspresi <code>match ($this)</code> (<code>Qris</code> = <code>0.7%</code> dari nominal, <code>VirtualAccount</code> = tetap <code>Rp4.000</code>, <code>KartuKredit</code> = <code>2.5%</code> + <code>Rp2.000</code>).</li><li>Uji konversi input pengguna menggunakan <code>MetodePembayaran::tryFrom()</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/language.types.enumerations.php" rel="noopener">Enumerations — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/language.enumerations.basics.php" rel="noopener">Basic enumerations — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/language.enumerations.backed.php" rel="noopener">Backed enumerations — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/language.enumerations.serialization.php" rel="noopener">Enumeration serialization — PHP Manual</a></li></ul></div>
`,
    perintah: ["JsonSerializable","enum","case",": string",": int","tryFrom()"],
    kuis: [
        {"tanya":"Mengapa deklarasi enum KodeRespon: float atau enum KodeRespon: int|string akan ditolak oleh PHP dengan galat kompilasi?","opsi":["Karena nama Enum tidak boleh mengandung dua kata.","Karena Backed Enum di PHP hanya mengizinkan satu tipe skalar tunggal berupa int atau string saja (tidak mengizinkan float, bool, maupun union int|string).","Karena Enum hanya boleh dideklarasikan di dalam sebuah class.","Karena float sudah dihapus dari PHP 8."],"benar":1,"penjelasan":"Spesifikasi Backed Enum di PHP secara ketat membatasi tipe pendamping skalar hanya pada int atau string, dan tidak mengizinkan penggabungan keduanya."},
        {"tanya":"Mengapa sebuah enum di PHP dilarang mendeklarasikan properti biasa (seperti public int $hitung = 0;) di dalamnya?","opsi":["Karena setiap kasus Enum (Enum::Kasus) adalah objek singleton di memori yang dipakai bersama di seluruh aplikasi; jika Enum diizinkan menyimpan properti yang bisa berubah (mutable state), mengubah properti pada satu variabel akan mengubah nilai kasus Enum tersebut di seluruh bagian program lainnya.","Karena kata kunci public tidak dikenal di dalam enum.","Karena enum tidak disimpan di dalam RAM.","Karena enum hanya boleh memiliki maksimal 2 fungsi."],"benar":0,"penjelasan":"Kasus Enum dirancang sebagai konstanta bertipe (typed constants) yang stateless dan immutable. Mengizinkan properti pada instans singleton Enum akan merusak jaminan keutuhan nilai konstanta tersebut."},
        {"tanya":"Metode statis bawaan apakah pada sebuah Enum yang mengembalikan array berisi seluruh daftar kasus (case) yang didefinisikan di dalam Enum tersebut (misalnya untuk mengisi pilihan <select> di HTML)?","opsi":["NamaEnum::values()","NamaEnum::cases()","NamaEnum::all()","NamaEnum::toArray()"],"benar":1,"penjelasan":"Seluruh Enum di PHP (baik Pure Enum maupun Backed Enum) mengimplementasikan interface internal UnitEnum yang menyediakan metode statis ::cases(), yang mengembalikan array terindeks berisi setiap instans case sesuai urutan deklarasinya."}
    ]
},
{
    id: 8,
    kategori: "2 · OOP & Struktur Kode",
    judul: "Penanganan Exception (Throwable), Hierarki Galat, dan Global Handler",
    tingkat: "Menengah", durasi: "8 mnt",
    tag: ["Throwable","PDOException","InvalidArgumentException"],
    ringkas: "Membedah hierarki Throwable (Error vs Exception), menerapkan pola try/catch/finally dan exception chaining ($previous), merancang hierarki Domain Exception, serta memasang penangkap galat tingkat aplikasi (set_exception_handler).",
    isi: `
<h2>1. Memahami Pohon Keluarga <code>Throwable</code> di PHP 8</h2>
<p>Di PHP modern, kesalahan sintaks, ketidakcocokan tipe data (<code>TypeError</code>), maupun kegagalan koneksi basis data (<code>PDOException</code>) semuanya direpresentasikan sebagai objek yang mengimplementasikan interface puncak <strong><code>Throwable</code></strong>:</p>
<pre>                           Throwable (Interface)
                                 │
          ┌──────────────────────┴──────────────────────┐
          ▼                                             ▼
        Error                                       Exception
(Kesalahan Mesin / Bug Kode)                (Kondisi Galat Operasional)
 ├── TypeError                               ├── LogicException
 │    └── ArgumentCountError                 │    ├── InvalidArgumentException
 ├── ValueError                              │    ├── DomainException
 ├── UnhandledMatchError                     │    ├── LengthException
 ├── ArithmeticError                         │    └── OutOfRangeException
 │    └── DivisionByZeroError                └── RuntimeException
 └── ParseError / CompileError                    ├── OutOfBoundsException
                                                  ├── UnexpectedValueException
                                                  └── PDOException</pre>
<h3>Aturan Penting Memilih Kelas Exception Bawaan SPL:</h3>
<ol><li><strong>Turunan <code>LogicException</code> (<code>InvalidArgumentException</code>, <code>DomainException</code>, <code>BadMethodCallException</code>):</strong> Gunakan ketika kesalahan disebabkan oleh <strong>pelanggaran kontrak fungsi atau aturan domain</strong> yang dapat dicegah sebelum operasi dijalankan (misalnya panjang judul kurang dari 3 karakter -&gt; lempar <code>InvalidArgumentException</code>, atau membatalkan pesanan yang sudah dikirim -&gt; lempar <code>DomainException</code>).</li><li><strong>Turunan <code>RuntimeException</code> (<code>UnexpectedValueException</code>, <code>PDOException</code>):</strong> Gunakan ketika kegagalan baru bisa diketahui <strong>saat program berjalan berinteraksi dengan dunia luar</strong> (misalnya berkas gagal ditulis ke diska, server API pihak ketiga mengembalikan JSON rusak, atau jaringan database terputus).</li></ol>
<h2>2. Merangkai Jejak Galat (<em>Exception Chaining</em>) dengan Parameter <code>$previous</code></h2>
<p>Ketika lapisan repositori database menangkap <code>PDOException</code>, kita sering kali tidak ingin mengekspos detail SQL mentah ke lapisan Controller di atasnya, melainkan melempar <code>GagalMenyimpanDataException</code> milik domain kita sendiri.</p>
<p>Namun, <strong>jangan pernah membuang objek <code>$pdoException</code> aslinya!</strong> Teruskan <code>$pdoException</code> sebagai argumen ke-3 (<strong><code>$previous</code></strong>) pada konstruktor <code>Exception</code> agar jejak akar masalahnya (<em>root cause</em>) tetap terekam utuh di log server:</p>
<pre>&lt;?php

declare(strict_types=1);

class RepositoriException extends RuntimeException {}

function simpanPengguna(PDO $pdo, string $surel): void
{
    try {
        $stmt = $pdo-&gt;prepare('INSERT INTO pengguna (surel) VALUES (:surel)');
        $stmt-&gt;execute(['surel' =&gt; $surel]);
    } catch (PDOException $galatDb) {
        // Meneruskan $galatDb sebagai parameter ke-3 ($previous)!
        throw new RepositoriException(
            message: 'Gagal menyimpan data pengguna ke penyimpanan.',
            code: 500,
            previous: $galatDb,
        );
    }
}</pre>
<p>Saat dicatat ke log di tingkat atas, Anda dapat membaca pesan domain (<code>$e-&gt;getMessage()</code>) sekaligus penyebab teknis aslinya melalui <strong><code>$e-&gt;getPrevious()?-&gt;getMessage()</code></strong>!</p>
<h2>3. Memasang Penangkap Galat Global (<code>set_exception_handler</code> dan <code>ErrorException</code>)</h2>
<p>Bagaimana jika ada sebuah <code>Throwable</code> tak terduga yang lolos tidak tertangkap oleh blok <code>try...catch</code> mana pun di aplikasi Anda? Di produksi (dengan <code>display_errors = Off</code>), pengguna tidak boleh melihat layar putih kosong, melainkan harus menerima respons HTTP <code>500</code> yang sopan sementara rincian <em>stack trace</em>-nya dicatat ke log.</p>
<p>Kita dapat mendaftarkan penangkap terakhir tingkat aplikasi menggunakan <strong><code>set_exception_handler()</code></strong> dan mengubah peringatan PHP kuno (<em>warnings/notices</em>) menjadi <code>ErrorException</code> menggunakan <strong><code>set_error_handler()</code></strong>:</p>
<pre>&lt;?php

declare(strict_types=1);

// 1. Mengubah Warning/Notice PHP menjadi ErrorException agar bisa ditangkap try...catch!
set_error_handler(static function (
    int $tingkat,
    string $pesan,
    string $berkas,
    int $baris,
): bool {
    if (!(error_reporting() &amp; $tingkat)) {
        return false;
    }
    throw new ErrorException($pesan, 0, $tingkat, $berkas, $baris);
});

// 2. Penangkap terakhir untuk semua Throwable yang tidak tertangkap di aplikasi
set_exception_handler(static function (Throwable $e): void {
    // Catat rincian lengkap beserta stack trace ke log server privat
    error_log(sprintf(
        &quot;[UNCAUGHT %s] %s di %s:%d\\nStack trace:\\n%s&quot;,
        $e::class,
        $e-&gt;getMessage(),
        $e-&gt;getFile(),
        $e-&gt;getLine(),
        $e-&gt;getTraceAsString(),
    ));

    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
    }

    // Kirimkan pesan aman yang tidak membocorkan jalur berkas/SQL ke pengguna luar
    echo json_encode([
        'status' =&gt; 'galat',
        'pesan'  =&gt; 'Terjadi gangguan internal pada server. Tim kami telah diberitahu.',
    ]);
});</pre>
<div class="callout info"><div class="callout-judul">💡 Fitur Baru di PHP 8.5</div><p>Sejak <strong>PHP 8.5</strong>, tersedia fungsi bawaan <strong><code>get_error_handler()</code></strong> dan <strong><code>get_exception_handler()</code></strong> untuk menginspeksi fungsi handler yang sedang aktif saat ini, serta <strong>Fatal Errors</strong> (seperti terlampauinya batas waktu eksekusi <code>Maximum execution time exceeded</code>) kini secara otomatis menyertakan <em>backtrace</em> lengkap!</p></div>
<h2>Latihan Praktik: Merancang Hierarki Exception Domain E-Learning</h2>
<p>Buatlah berkas <code>hierarki-exception.php</code> dan jalankan dengan <code>php hierarki-exception.php</code>:</p>
<ol><li>Buat <code>abstract class KodelokaDomainException extends DomainException</code> yang memiliki metode <code>abstract public function kodeStatusHttp(): int;</code>.</li><li>Buat dua subkelas: <code>ModulTidakDitemukanException</code> (mengembalikan status HTTP <code>404</code>) dan <code>KuotaKelasPenuhException</code> (mengembalikan status HTTP <code>409 Conflict</code>).</li><li>Uji pelemparan dan penangkapannya di dalam satu blok <code>catch (KodelokaDomainException $e)</code> yang otomatis mengambil <code>$e-&gt;kodeStatusHttp()</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/language.error-handling.php" rel="noopener">Error Handling — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/language.error-handling.throwable.php" rel="noopener">The Throwable interface — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/spl.exceptions.php" rel="noopener">SPL Exceptions — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/function.set-exception-handler.php" rel="noopener"><code>set_exception_handler</code> — PHP Manual</a></li><li><a href="https://www.php.net/releases/8.5/en.php" rel="noopener">PHP 8.5 Release Announcement (<code>get_error_handler</code>, <code>get_exception_handler</code>, Fatal Error Backtraces) — PHP.net</a></li></ul></div>
`,
    perintah: ["Throwable","PDOException","InvalidArgumentException","DomainException","$previous","$pdoException"],
    kuis: [
        {"tanya":"Manakah perbedaan yang tepat antara turunan LogicException (seperti InvalidArgumentException) dan turunan RuntimeException di PHP?","opsi":["LogicException tidak dapat ditangkap dengan try...catch, sedangkan RuntimeException bisa.","LogicException menandakan kesalahan logika atau pelanggaran kontrak pemanggilan fungsi (seperti argumen yang tidak sah) yang seharusnya dapat dicegah oleh kode pemanggil, sedangkan RuntimeException menandakan kegagalan operasional saat program berjalan (seperti kegagalan jaringan atau sistem berkas).","RuntimeException hanya terjadi saat kompilasi berkas PHP.","LogicException merupakan turunan dari kelas Error."],"benar":1,"penjelasan":"Pemisahan semantik antara LogicException dan RuntimeException di Standard PHP Library (SPL) membantu pengembang membedakan antara kesalahan penggunaan API/aturan domain dengan gangguan lingkungan eksternal saat runtime."},
        {"tanya":"Mengapa kita perlu meneruskan variabel $e asli ke argumen ketiga (previous: $e) saat melempar exception baru di dalam blok catch (throw new LayananException('Gagal memproses', 500, $e))?","opsi":["Agar exception lama otomatis dihapus dari memori.","Untuk mempertahankan rantai penyebab galat (exception chaining), sehingga ketika dicatat ke log server kita masih dapat menelusuri akar penyebab teknis aslinya melalui $exception->getPrevious().","Agar pesan exception otomatis diterjemahkan ke Bahasa Indonesia.","Karena parameter ketiga pada Exception::__construct wajib diisi."],"benar":1,"penjelasan":"Tanpa meneruskan $previous, jejak baris kode dan pesan teknis dari exception tingkat bawah (misalnya PDOException yang menyebutkan nama constraint tabel yang gagal) akan hilang saat dibungkus menjadi exception tingkat layanan."},
        {"tanya":"Apa fungsi dari pendaftaran set_error_handler() yang melempar new ErrorException(...) di awal aplikasi PHP modern?","opsi":["Mematikan seluruh pencatatan galat di server.","Mengubah peringatan tradisional PHP (Warnings/Notices dari fungsi-fungsi bawaan lama yang belum melempar exception) menjadi objek ErrorException yang seragam, sehingga dapat ditangkap dan ditangani secara konsisten menggunakan blok try...catch.","Mengabaikan galat TypeError.","Mengubah kode status HTTP menjadi 200 OK."],"benar":1,"penjelasan":"Sebagian fungsi sistem berkas warisan di PHP masih mengeluarkan Warning alih-alih melempar Exception saat gagal. Mengonversinya menjadi ErrorException menyatukan seluruh penanganan galat aplikasi ke dalam mekanisme Throwable."}
    ]
},
{
    id: 9,
    kategori: "2 · OOP & Struktur Kode",
    judul: "Namespace, Resolusi Nama, dan Cara Kerja Autoloading PSR-4 di Balik Layar",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["\\","ClassB","namespace Kodeloka;"],
    ringkas: "Menguasai pengorganisasian ruang nama (namespace, use, use function, use const), memahami aturan resolusi nama (unqualified, qualified, fully qualified), menulis autoloader PSR-4 sendiri dengan spl_autoload_register(), serta mematuhi standar PSR-1 dan PSR-4.",
    isi: `
<h2>1. Mengapa Namespace Penting dan Bagaimana Cara Kerjanya?</h2>
<p>Tanpa <code>namespace</code>, seluruh class, interface, enum, fungsi, dan konstanta yang Anda buat berada di dalam satu <strong>Global Namespace</strong> raksasa.</p>
<p>Dengan mendeklarasikan <code>namespace Kodeloka\\Autentikasi;</code> di bagian atas berkas (tepat setelah <code>declare(strict_types=1);</code>), semua class yang didefinisikan di dalam berkas tersebut otomatis memiliki awalan ruang nama <code>Kodeloka\\Autentikasi\\</code>:</p>
<pre>&lt;?php

declare(strict_types=1);

namespace Kodeloka\\Autentikasi;

// Mengimpor class dari namespace lain (dan memberikan alias 'as' jika namanya sama)
use DateTimeImmutable;
use Kodeloka\\Database\\Koneksi;
use VendorLain\\Keamanan\\Token as TokenEksternal;

// Mengimpor fungsi dan konstanta dari namespace lain:
use function Kodeloka\\Utilitas\\formatWaktu;
use const Kodeloka\\Konfigurasi\\MASA_AKTIF_SESI;

// Mengelompokkan beberapa impor dari namespace induk yang sama (Group Use Declarations):
use Kodeloka\\Autentikasi\\Entitas\\{Pengguna, SesiLogin, Peran};

final class LayananLogin
{
    // ...
}</pre>
<h2>2. Tiga Aturan Resolusi Nama di Dalam Namespace</h2>
<p>Ketika PHP membaca sebuah nama class di dalam berkas yang memiliki <code>namespace Kodeloka\\Akademik;</code>, PHP menerjemahkan namanya menggunakan tiga aturan mirip jalur berkas di Linux:</p>
<table><thead><tr><th>Jenis Penulisan Nama</th><th>Contoh di Dalam Kode</th><th>Bagaimana PHP Menerjemahkannya?</th></tr></thead><tbody><tr><td><strong>1. Unqualified Name</strong> (Tanpa garis miring <code>\\</code>)</td><td><code>new Kursus()</code></td><td>Pertama memeriksa apakah ada pernyataan <code>use ...\\Kursus;</code> di atas. Jika tidak ada, PHP menempelkan namespace aktif saat ini: <strong><code>Kodeloka\\Akademik\\Kursus</code></strong>.</td></tr><tr><td><strong>2. Qualified Name</strong> (Diawali sub-nama, bukan <code>\\</code>)</td><td><code>new Entitas\\Kursus()</code></td><td>Jika tidak ada alias <code>use ... as Entitas;</code>, PHP menempelkannya sebagai sub-namespace dari namespace aktif: <strong><code>Kodeloka\\Akademik\\Entitas\\Kursus</code></strong>.</td></tr><tr><td><strong>3. Fully Qualified Name (FQCN)</strong> (Diawali garis miring terbalik <code>\\</code>)</td><td><code>new \\PDO(...)</code> atau <code>new \\Kodeloka\\Inti\\App()</code></td><td>Layaknya jalur absolut <code>/etc/hosts</code> di Linux: selalu mengacu langsung dari <strong>akar Global Namespace</strong> tanpa peduli Anda sedang berada di namespace mana!</td></tr></tbody></table>
<div class="callout info"><div class="callout-judul">💡 Perbedaan Resolusi Class vs Fungsi/Konstanta di Dalam Namespace</div><ul><li>Untuk <strong>Class / Interface / Enum</strong>: Jika Anda menulis <code>new DateTimeImmutable()</code> di dalam <code>namespace Kodeloka;</code> <strong>tanpa</strong> <code>use DateTimeImmutable;</code> dan tanpa awalan <code>\\</code>, PHP <strong>TIDAK</strong> akan mundur mencari ke global namespace, melainkan langsung gagal mencari <code>Kodeloka\\DateTimeImmutable</code>!</li><li>Untuk <strong>Fungsi dan Konstanta</strong> (seperti <code>strlen($teks)</code> atau <code>PHP_EOL</code>): Jika tidak ditemukan di dalam <code>namespace Kodeloka;</code>, PHP **otomatis mundur (<em>fallback</em>) ke fungsi/konstanta bawaan Global Namespace**!</li></ul></div>
<h2>3. Bagaimana Autoloading PSR-4 Bekerja di Balik Layar (<code>spl_autoload_register</code>)</h2>
<p>Pernahkah Anda penasaran apa yang sebenarnya dilakukan oleh baris <code>require 'vendor/autoload.php';</code> milik Composer ketika Anda memanggil <code>new Kodeloka\\Akademik\\Kursus()</code>?</p>
<p>Di balik layar, PHP menyediakan fungsi bawaan <strong><code>spl_autoload_register(callable $callback)</code></strong>. Setiap kali kode Anda memanggil sebuah class yang belum pernah dimuat ke memori, mesin PHP tidak langsung menyerah, melainkan memanggil fungsi yang terdaftar di <code>spl_autoload_register()</code> sambil mengirimkan string nama lengkap class tersebut (<code>&quot;Kodeloka\\Akademik\\Kursus&quot;</code>)!</p>
<p>Mari kita tulis sebuah <strong>Autoloader PSR-4 murni dalam 20 baris PHP</strong> agar Anda memahami mekanismenya 100%:</p>
<pre>&lt;?php

declare(strict_types=1);

/**
 * Mendaftarkan autoloader PSR-4 untuk awalan namespace &quot;Kodeloka\\&quot; -&gt; folder &quot;/src/&quot;
 */
spl_autoload_register(static function (string $namaLengkapClass): void {
    $awalanNamespace = 'Kodeloka\\\\';
    $direktoriDasar  = __DIR__ . '/src/';

    // 1. Jika class yang diminta bukan dimulai dengan &quot;Kodeloka\\&quot;, abaikan
    //    (biarkan autoloader lain yang menanganinya)
    if (!str_starts_with($namaLengkapClass, $awalanNamespace)) {
        return;
    }

    // 2. Ambil bagian nama class relatif setelah &quot;Kodeloka\\&quot;
    //    Contoh: &quot;Kodeloka\\Akademik\\Entitas\\Kursus&quot; -&gt; &quot;Akademik\\Entitas\\Kursus&quot;
    $classRelatif = substr($namaLengkapClass, strlen($awalanNamespace));

    // 3. Ubah pemisah namespace '\\' menjadi pemisah folder '/' dan tambahkan '.php'
    //    Hasil: &quot;/jalur/proyek/src/Akademik/Entitas/Kursus.php&quot;
    $jalurBerkas = $direktoriDasar . str_replace('\\\\', '/', $classRelatif) . '.php';

    // 4. Jika berkasnya ada di diska, muat sekarang!
    if (is_file($jalurBerkas)) {
        require $jalurBerkas;
    }
});</pre>
<h3>Aturan Wajib Standar PSR-1 &amp; PSR-4 agar Autoloading Selalu Berhasil:</h3>
<ol><li><strong>Satu Berkas = Satu Class/Interface/Trait/Enum:</strong> Jangan menumpuk tiga class berbeda di dalam satu berkas <code>.php</code> yang sama! Jika <code>ClassB</code> ditaruh di dalam berkas <code>ClassA.php</code>, autoloader tidak akan pernah bisa menemukan <code>ClassB</code> saat <code>ClassB</code> dipanggil lebih dulu.</li><li><strong>Nama Berkas = Nama Class (<code>StudlyCaps</code> / <code>PascalCase</code>):</strong> <code>class PengelolaSesi</code> wajib disimpan dalam berkas <code>PengelolaSesi.php</code>.</li><li><strong>Bebas Efek Samping Saat Dimuat:</strong> Berkas yang mendefinisikan class tidak boleh sekaligus menjalankan kode yang mencetak keluaran (<code>echo</code>) atau mengubah variabel global pada saat berkas tersebut di-<code>require</code> oleh autoloader.</li></ol>
<h2>Latihan Praktik: Menguji Autoloader PSR-4 Buatan Sendiri</h2>
<p>Buatlah berkas <code>uji-autoload.php</code>:</p>
<ol><li>Tulis fungsi <code>spl_autoload_register()</code> PSR-4 seperti di atas yang memetakan <code>Kodeloka\\Latihan\\</code> ke sub-folder <code>./latihan-src/</code>.</li><li>Buat berkas <code>./latihan-src/Matematika/Deret.php</code> yang berisi <code>namespace Kodeloka\\Latihan\\Matematika;</code> dan <code>final class Deret</code>.</li><li>Di dalam <code>uji-autoload.php</code>, langsung panggil <code>new \\Kodeloka\\Latihan\\Matematika\\Deret()</code> tanpa menulis <code>require</code> manual untuk berkas <code>Deret.php</code>, dan buktikan bahwa PHP memuatnya secara otomatis!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/language.namespaces.php" rel="noopener">Namespaces — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/function.spl-autoload-register.php" rel="noopener"><code>spl_autoload_register</code> — PHP Manual</a></li><li><a href="https://www.php-fig.org/psr/psr-1/" rel="noopener">PSR-1: Basic Coding Standard — PHP-FIG</a></li><li><a href="https://www.php-fig.org/psr/psr-4/" rel="noopener">PSR-4: Autoloader — PHP-FIG</a></li></ul></div>
`,
    perintah: ["\\","ClassB","namespace Kodeloka;","spl_autoload_register()","require","uji-autoload.php"],
    kuis: [
        {"tanya":"Di dalam sebuah berkas yang mendeklarasikan namespace Kodeloka\\Layanan;, Anda menulis baris $pdo = new PDO($dsn); tanpa menulis use PDO; di bagian atas berkas dan tanpa menulis awalan \\ (new \\PDO). Apa yang akan terjadi?","opsi":["PHP otomatis menemukan class PDO bawaan di global namespace.","PHP akan mencari class bernama Kodeloka\\Layanan\\PDO dan gagal dengan pesan Error: Class \"Kodeloka\\Layanan\\PDO\" not found, karena untuk nama class tanpa garis miring (unqualified class name), PHP tidak melakukan fallback ke global namespace.","PHP otomatis menambahkan use PDO; ke dalam berkas.","Koneksi database tetap berhasil dibuat."],"benar":1,"penjelasan":"Berbeda dengan fungsi dan konstanta yang memiliki fallback ke global namespace, resolusi nama untuk class/interface/enum di dalam sebuah namespace selalu menempelkan namespace aktif saat ini kecuali class tersebut telah diimpor dengan use PDO; atau dipanggil dengan FQCN new \\PDO(...)."},
        {"tanya":"Fungsi bawaan PHP apakah yang digunakan oleh Composer (dan kode kita sendiri) untuk mendaftarkan fungsi callback yang otomatis dipanggil setiap kali program mencoba menggunakan class/interface/enum yang belum dimuat ke memori?","opsi":["class_alias()","spl_autoload_register()","register_shutdown_function()","include_once()"],"benar":1,"penjelasan":"spl_autoload_register() mendaftarkan fungsi pemuat otomatis ke dalam antrean autoloader SPL milik mesin PHP, menggantikan mekanisme tunggal kuno dan memungkinkan beberapa autoloader bekerja berdampingan."},
        {"tanya":"Mengapa standar PSR-4 mengharuskan setiap satu class ditempatkan di dalam satu berkas .php tersendiri yang namanya sama persis dengan nama class tersebut?","opsi":["Karena PHP membatasi ukuran satu berkas .php maksimal 100 baris.","Agar ketika sebuah class belum ada di memori (misalnya Kodeloka\\Auth\\Token), autoloader dapat langsung menghitung jalur berkas fisiknya secara deterministik (src/Auth/Token.php) hanya dari nama lengkap class tersebut tanpa perlu membuka dan memindai isi seluruh berkas di proyek.","Agar berkas tersebut tidak bisa dibuka di teks editor biasa.","Karena namespace hanya berlaku untuk 50 baris pertama."],"benar":1,"penjelasan":"Petunjuk satu-satunya yang diterima oleh callback spl_autoload_register(fn(string $class)) hanyalah string nama lengkap class yang diminta. Dengan aturan 1 class = 1 berkas bernama identik, autoloader dapat langsung memetakan string nama class tersebut ke jalur berkas di diska dengan instan."}
    ]
},
{
    id: 10,
    kategori: "2 · OOP & Struktur Kode",
    judul: "Manajemen Dependensi dengan Composer, SemVer, composer.lock, dan Standar PER/PSR-12",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["composer.lock","composer.json","{"],
    ringkas: "Mengelola siklus hidup pustaka pihak ketiga menggunakan Composer, memahami aturan Semantic Versioning (^ vs ~), mengunci rilis dengan composer.lock, memindai kerentanan keamanan dengan composer audit, serta menerapkan standar gaya kode PER / PSR-12.",
    isi: `
<h2>1. Memahami Ekosistem Composer dan Packagist</h2>
<p><strong>Composer</strong> adalah manajer dependensi tingkat proyek untuk PHP, sedangkan <strong><a href="https://packagist.org/" rel="noopener">Packagist</a></strong> adalah repositori pusat tempat ribuan pustaka open-source PHP (seperti <code>monolog/monolog</code>, <code>phpunit/phpunit</code>, <code>psr/log</code>, atau <code>guzzlehttp/guzzle</code>) didaftarkan.</p>
<p>Dua berkas utama yang selalu berdampingan di akar proyek PHP adalah:</p>
<ol><li><strong><code>composer.json</code>:</strong> Daftar keinginan (<em>manifest</em>) yang menyatakan paket apa saja yang dibutuhkan proyek beserta <strong>rentang versi yang diizinkan</strong>, persyaratan versi PHP/ekstensi (<code>php</code>, <code>ext-pdo</code>, <code>ext-mbstring</code>), serta aturan autoloading PSR-4.</li><li><strong><code>composer.lock</code>:</strong> Catatan versi <strong>eksak</strong> (misalnya <code>v3.7.0</code> beserta referensi commit sumbernya dan <code>content-hash</code> dari <code>composer.json</code>) yang benar-benar terpasang saat ini.</li></ol>
<h2>2. Membaca Aturan <em>Semantic Versioning (SemVer)</em>: <code>^</code> (Caret) vs <code>~</code> (Tilde)</h2>
<p>Paket PHP modern mengikuti format versi <strong><code>MAJOR.MINOR.PATCH</code></strong> (misalnya <strong><code>3.4.2</code></strong>):</p>
<ul><li><strong><code>MAJOR</code> (<code>3</code>):</strong> Naik jika ada perubahan yang tidak kompatibel ke belakang (<em>breaking changes</em>).</li><li><strong><code>MINOR</code> (<code>4</code>):</strong> Naik jika ada penambahan fitur baru yang <strong>masih kompatibel ke belakang</strong>.</li><li><strong><code>PATCH</code> (<code>2</code>):</strong> Naik jika hanya berisi perbaikan bug atau tambalan keamanan yang kompatibel.</li></ul>
<p>Ketika Anda menulis batasan versi di dalam <code>composer.json</code>, pahami perbedaan operator berikut:</p>
<table><thead><tr><th>Penulisan di <code>composer.json</code></th><th>Arti Rentang Versi yang Diizinkan</th><th>Kapan Digunakan?</th></tr></thead><tbody><tr><td><strong><code>^3.4.2</code></strong> (<em>Caret</em> — Standar Utama)</td><td><strong><code>&gt;= 3.4.2</code> dan <code>&lt; 4.0.0</code></strong> (Mengizinkan pembaruan <em>Patch</em> maupun <em>Minor</em>, tetapi <strong>menolak</strong> kenaikan <em>Major</em> <code>4.0.0</code> yang berisiko merusak kode!).</td><td><strong>Pilihan terbaik untuk hampir semua paket</strong> yang mematuhi SemVer.</td></tr><tr><td><strong><code>^0.3.1</code></strong> (<em>Caret</em> pada versi <code>0.x</code>)</td><td><strong><code>&gt;= 0.3.1</code> dan <code>&lt; 0.4.0</code></strong> (Karena pada versi pra-1.0, kenaikan <code>0.4.0</code> dianggap bisa membawa <em>breaking changes</em>).</td><td>Otomatis diterapkan Composer untuk paket yang masih di tahap <code>0.x</code>.</td></tr><tr><td><strong><code>~3.4.2</code></strong> (<em>Tilde</em>)</td><td><strong><code>&gt;= 3.4.2</code> dan <code>&lt; 3.5.0</code></strong> (Hanya mengizinkan pembaruan <em>Patch</em> <code>3.4.x</code>, menolak kenaikan <em>Minor</em> <code>3.5.0</code>).</td><td>Ketika Anda ingin membatasi pembaruan hanya pada perbaikan bug tingkat <em>patch</em>.</td></tr><tr><td><strong><code>&gt;=8.4</code></strong></td><td>Versi <code>8.4.0</code> atau yang lebih tinggi tanpa batas atas.</td><td>Digunakan untuk menyatakan persyaratan versi mesin <code>&quot;php&quot;: &quot;&gt;=8.4&quot;</code>.</td></tr></tbody></table>
<h2>3. Perintah Penting Composer untuk Pengembangan, Audit Keamanan, dan Produksi</h2>
<pre># 1. Menambahkan paket produksi (masuk ke bagian &quot;require&quot;)
composer require monolog/monolog

# 2. Menambahkan paket khusus pengembangan/pengujian (masuk ke bagian &quot;require-dev&quot;)
composer require --dev phpunit/phpunit

# 3. Memeriksa apakah ada paket di composer.lock yang memiliki celah keamanan (CVE)!
#    (Wajib dipasang di dalam pipeline CI/CD GitHub Actions!)
composer audit

# 4. Memvalidasi apakah composer.json dan composer.lock sinkron dan valid
composer validate --strict

# 5. Perintah instalasi di SERVER PRODUKSI / DOCKER IMAGE:
composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader --classmap-authoritative</pre>
<h3>Mengapa <code>--classmap-authoritative</code> Sangat Mempercepat Produksi?</h3>
<p>Secara bawaan, saat autoloader PSR-4 mencari class <code>Kodeloka\\Domain\\Kursus</code>, PHP harus memanggil fungsi sistem berkas <code>is_file('src/Domain/Kursus.php')</code> ke diska. Ketika Anda menjalankan <code>--optimize-autoloader --classmap-authoritative</code> saat membangun image produksi, Composer memindai seluruh folder <code>src/</code> dan <code>vendor/</code> satu kali, lalu menghasilkan <strong>peta array asosiatif statis raksasa</strong> (<code>'Kodeloka\\\\Domain\\\\Kursus' =&gt; '/app/src/Domain/Kursus.php'</code>). Saat aplikasi berjalan di produksi, autoloader langsung memuat berkas dari array memori tersebut (dan yang sudah di-cache di OPcache) <strong>tanpa melakukan pemeriksaan <code>is_file()</code> ke diska sama sekali</strong>!</p>
<h2>4. Standar Gaya Penulisan Kode: PSR-12 dan PER Coding Style</h2>
<p>Agar kode yang ditulis oleh ratusan pengembang PHP di berbagai perusahaan tampak seragam dan bersih, <strong>PHP-FIG</strong> menerbitkan standar gaya kode <strong><a href="https://www.php-fig.org/psr/psr-12/" rel="noopener">PSR-12</a></strong> yang kini diperbarui secara berkelanjutan melalui <strong><a href="https://www.php-fig.org/per/coding-style/" rel="noopener">PER Coding Style</a></strong> (untuk mengakomodasi fitur-fitur baru seperti Enum, Property Hooks PHP 8.4, dan Asymmetric Visibility).</p>
<p>Aturan inti PSR-12 / PER Coding Style yang wajib Anda terapkan:</p>
<ol><li><strong>Indentasi:</strong> Wajib menggunakan <strong>4 spasi</strong> (tidak boleh menggunakan karakter Tab).</li><li><strong>Tag PHP &amp; Baris Pertama:</strong> Gunakan <code>&lt;?php</code> diikuti baris kosong, <code>declare(strict_types=1);</code>, baris kosong, <code>namespace ...;</code>, baris kosong, blok <code>use ...;</code>, dan jangan pernah menulis tag penutup <code>?&gt;</code> di akhir berkas PHP murni.</li><li><strong>Posisi Kurung Kurawal <code>{</code>:</strong><ul><li>Untuk deklarasi <strong><code>class</code>, <code>enum</code>, <code>interface</code>, <code>trait</code>, dan <code>function</code>/metode satu baris</strong>: tanda kurung kurawal buka <code>{</code> diletakkan di <strong>baris baru di bawahnya</strong>.</li><li>Untuk struktur kontrol (<strong><code>if</code>, <code>elseif</code>, <code>else</code>, <code>foreach</code>, <code>while</code>, <code>try</code>, <code>catch</code>, <code>match</code></strong>): tanda kurung kurawal buka <code>{</code> diletakkan di <strong>baris yang sama</strong> setelah spasi!</li></ul></li><li><strong>Visibilitas Eksplisit:</strong> Selalu tuliskan <code>public</code>, <code>protected</code>, atau <code>private</code> pada setiap properti, metode, dan <strong>konstanta kelas</strong> (<code>public const BATAS = 10;</code>).</li></ol>
<pre>&lt;?php

declare(strict_types=1);

namespace Kodeloka\\Standar;

final class ContohGayaPsr12
{
    public const int VERSI_API = 2;

    public function periksaKelulusan(int $skor): string
    {
        if ($skor &gt;= 75) {
            return 'Lulus';
        } else {
            return 'Belum Lulus';
        }
    }
}</pre>
<h2>Latihan Praktik: Menyusun <code>composer.json</code> Lengkap dengan Skrip Otomatis</h2>
<p>Buatlah berkas <code>composer.json</code> yang bersih dan siap produksi:</p>
<ol><li>Tetapkan persyaratan <code>&quot;php&quot;: &quot;&gt;=8.4&quot;</code>, <code>&quot;ext-pdo&quot;: &quot;*&quot;</code>, dan <code>&quot;ext-mbstring&quot;: &quot;*&quot;</code>.</li><li>Konfigurasikan <code>&quot;autoload&quot;</code> PSR-4 untuk <code>&quot;Kodeloka\\\\&quot;: &quot;src/&quot;</code> dan <code>&quot;autoload-dev&quot;</code> untuk <code>&quot;Kodeloka\\\\Tests\\\\&quot;: &quot;tests/&quot;</code>.</li><li>Tambahkan bagian <code>&quot;scripts&quot;</code> di dalam <code>composer.json</code> sehingga menjalankan <code>composer test</code> otomatis mengeksekusi <code>phpunit --testdox</code>, dan <code>composer cek-keamanan</code> mengeksekusi <code>composer validate --strict</code> serta <code>composer audit</code>!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://getcomposer.org/doc/01-basic-usage.md" rel="noopener">Basic usage — Composer Documentation</a></li><li><a href="https://getcomposer.org/doc/articles/versions.md" rel="noopener">Versions and constraints — Composer Documentation</a></li><li><a href="https://getcomposer.org/doc/03-cli.md" rel="noopener">Command-line interface (<code>audit</code>, <code>install</code>, <code>validate</code>) — Composer Documentation</a></li><li><a href="https://getcomposer.org/doc/04-schema.md" rel="noopener">The composer.json schema — Composer Documentation</a></li><li><a href="https://www.php-fig.org/psr/psr-12/" rel="noopener">PSR-12: Extended Coding Style — PHP-FIG</a></li><li><a href="https://www.php-fig.org/per/coding-style/" rel="noopener">PER Coding Style — PHP-FIG</a></li></ul></div>
`,
    perintah: ["composer.json","{",">= 3.4.2","0.x","\"php\": \">=8.4\"","monolog/monolog"],
    kuis: [
        {"tanya":"Jika di dalam composer.json tertulis \"monolog/monolog\": \"^3.2.0\", versi manakah dari pilihan berikut yang diizinkan dan versi manakah yang ditolak oleh operator caret (^)?","opsi":["Mengizinkan 3.2.5 dan 3.7.0, tetapi menolak 4.0.0.","Hanya mengizinkan 3.2.0 saja dan menolak semua versi lainnya.","Mengizinkan 4.0.0 dan 5.0.0, tetapi menolak 3.2.1.","Mengizinkan 3.2.5, tetapi menolak 3.3.0."],"benar":0,"penjelasan":"Operator caret (^3.2.0) berarti >= 3.2.0 < 4.0.0: mengizinkan pembaruan tingkat Patch (3.2.5) maupun Minor (3.7.0) yang kompatibel ke belakang, namun menahan kenaikan versi Major (4.0.0) yang berpotensi memiliki breaking changes."},
        {"tanya":"Perintah Composer manakah yang digunakan di dalam pipeline CI/CD untuk memindai apakah ada paket di dalam composer.lock yang tercatat memiliki kerentanan keamanan publik (CVE / Security Advisories)?","opsi":["composer update --dry-run","composer audit","composer dump-autoload","composer init"],"benar":1,"penjelasan":"Perintah bawaan composer audit memeriksa daftar versi paket yang terkunci di composer.lock terhadap basis data security advisories Packagist dan mengembalikan kode keluar non-nol jika ditemukan celah keamanan."},
        {"tanya":"Menurut standar gaya kode PSR-12 / PER Coding Style, di manakah tanda kurung kurawal pembuka { harus diletakkan pada deklarasi class dan function/metode dibandingkan pada pernyataan if atau foreach?","opsi":["Semuanya diletakkan di baris baru.","Pada deklarasi class dan function/metode (yang header-nya satu baris), kurung kurawal { diletakkan di baris baru di bawahnya; sedangkan pada struktur kontrol (if, foreach, try, match), kurung kurawal { diletakkan di baris yang sama setelah satu spasi.","Semuanya diletakkan di baris yang sama.","PSR-12 tidak mengatur posisi kurung kurawal."],"benar":1,"penjelasan":"PSR-12 membedakan posisi { antara deklarasi struktural (class, metode/fungsi pada baris baru) dan blok alur kontrol (if (...) {, foreach (...) { pada baris yang sama)."}
    ]
},
{
    id: 11,
    kategori: "2 · OOP & Struktur Kode",
    judul: "Ekspresi Reguler (PCRE2 preg_*), Attributes (#[...]), dan Reflection API",
    tingkat: "Lanjut", durasi: "8 mnt",
    tag: ["preg_*","#[...]","$"],
    ringkas: "Mencocokkan dan mengekstrak pola teks menggunakan fungsi PCRE2 (preg_match, preg_match_all, preg_replace_callback), serta merancang metadata deklaratif menggunakan PHP Attributes (#[...]) yang dibaca saat runtime melalui Reflection API.",
    isi: `
<h2>1. Ekspresi Reguler di PHP dengan Ekstensi PCRE2 (<code>preg_*</code>)</h2>
<p>Di PHP, ekspresi reguler menggunakan mesin **PCRE2 (<em>Perl Compatible Regular Expressions</em>)** di mana pola selalu diapit oleh karakter pembatas (<em>delimiter</em>, biasanya garis miring <code>/pola/flags</code> atau tanda pagar <code>#pola#flags</code> jika pola mengandung banyak garis miring URL):</p>
<pre>&lt;?php

declare(strict_types=1);

// 1. preg_match(): Mengembalikan 1 jika cocok, 0 jika tidak cocok, atau false jika terjadi galat
//    Gunakan Named Subpatterns (?&lt;nama&gt;...) dan flag 'u' (UTF-8 mode)!
$polaKodeKelas = '/^(?&lt;bidang&gt;[a-z]+)-(?&lt;nomor&gt;\\d{3})$/u';

if (preg_match($polaKodeKelas, 'backend-104', $tangkapan) === 1) {
    echo &quot;Bidang: {$tangkapan['bidang']}, Nomor: {$tangkapan['nomor']}\\n&quot;;
    // Bidang: backend, Nomor: 104
}

// 2. preg_replace_callback(): Mengubah teks yang cocok menggunakan fungsi callback yang aman!
$teksMarkdown = 'Baca modul [[01-cara-web-bekerja]] dan [[02-struktur-dokumen-html]].';

$teksHtml = preg_replace_callback(
    '/\\[\\[(?&lt;slug&gt;[a-z0-9-]+)\\]\\]/u',
    static fn(array $m): string =&gt; sprintf(
        '&lt;a href=&quot;/materi/%s&quot;&gt;%s&lt;/a&gt;',
        htmlspecialchars($m['slug'], ENT_QUOTES, 'UTF-8'),
        htmlspecialchars($m['slug'], ENT_QUOTES, 'UTF-8'),
    ),
    $teksMarkdown,
);

echo $teksHtml;</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Jebakan Keamanan Klasik pada Regex di PHP: <code>^</code> dan <code>$</code> vs <code>\\A</code> dan <code>\\z</code>!</div><p>Jika Anda menggunakan flag multiline (<code>m</code>), atau bahkan tanpa flag <code>m</code>, jangkar akhir <strong><code>$</code></strong> di PCRE secara bawaan masih mengizinkan satu karakter baris baru (<code>\\n</code>) di paling ujung string! Untuk validasi keamanan ketat yang memastikan tidak ada baris baru yang menyelundup di akhir string, gunakan <strong><code>\\A</code></strong> (awal mutlak string) dan <strong><code>\\z</code></strong> (akhir mutlak string), atau tambahkan flag <strong><code>D</code> (<code>PCRE_DOLLAR_ENDONLY</code>)</strong>!</p></div>
<h2>2. Mengenal PHP Attributes (<code>#[...]</code> — Sejak PHP 8.0 hingga 8.5)</h2>
<p>Di pelajaran sebelumnya, kita telah memakai atribut bawaan PHP seperti <code>#[\\Override]</code> dan <code>#[\\NoDiscard]</code>; atribut bawaan lain seperti <code>#[\\Deprecated]</code> serta atribut PHPUnit seperti <code>#[Test]</code> dan <code>#[DataProvider]</code> akan ditemui pada pelajaran berikutnya.</p>
<p>Apa sebenarnya <strong>Attributes (<code>#[...]</code>)</strong> itu? Sebelum PHP 8.0, pengembang terpaksa menulis konfigurasi metadata di dalam komentar teks <code>/** @Route(&quot;/kelas&quot;) */</code> (<em>docblock annotations</em>) lalu mengurainya dengan regex yang lambat dan rawan salah ketik. Sejak <strong>PHP 8.0</strong>, <strong>Attributes</strong> menyediakan <strong>metadata terstruktur kelas satu di tingkat sintaks bahasa PHP</strong> yang dapat ditempelkan pada class, metode, fungsi, properti, parameter, maupun konstanta!</p>
<h2>3. Membuat <em>Custom Attribute</em> Sendiri dan Membacanya dengan Reflection API</h2>
<p>Mari kita lihat bagaimana framework modern (seperti Symfony atau Laravel) mendaftarkan rute URL atau izin akses secara otomatis menggunakan <strong>Custom Attribute</strong> dan <strong><code>ReflectionClass</code> / <code>ReflectionMethod</code></strong>:</p>
<pre>&lt;?php

declare(strict_types=1);

namespace Kodeloka\\Routing;

use Attribute;
use ReflectionClass;
use ReflectionMethod;

// 1. Mendefinisikan class Attribute kita sendiri:
//    Batasi agar atribut #[Rute] hanya boleh dipasang pada METODE (TARGET_METHOD)
#[Attribute(Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
readonly class Rute
{
    public function __construct(
        public string $jalur,
        public string $metodeHttp = 'GET',
    ) {}
}

// 2. Memasang atribut #[Rute] pada metode di dalam Controller:
final class KelasController
{
    #[Rute(jalur: '/kelas', metodeHttp: 'GET')]
    public function daftarKelas(): string
    {
        return 'Menampilkan daftar semua kelas Kodeloka';
    }

    #[Rute(jalur: '/kelas/daftar', metodeHttp: 'POST')]
    public function prosesPendaftaran(): string
    {
        return 'Memproses pendaftaran peserta baru';
    }
}

// 3. Membaca metadata Attribute saat runtime menggunakan Reflection API!
function ekstrakDaftarRute(string $namaClassController): array
{
    $refleksiKelas = new ReflectionClass($namaClassController);
    $petaRute = [];

    foreach ($refleksiKelas-&gt;getMethods(ReflectionMethod::IS_PUBLIC) as $metode) {
        // Mengambil seluruh atribut #[Rute] yang menempel pada metode ini
        $atributRute = $metode-&gt;getAttributes(Rute::class);

        foreach ($atributRute as $attr) {
            /** @var Rute $instansRute */
            $instansRute = $attr-&gt;newInstance(); // Menginstansiasi objek Rute!

            $petaRute[] = [
                'http'   =&gt; $instansRute-&gt;metodeHttp,
                'jalur'  =&gt; $instansRute-&gt;jalur,
                'target' =&gt; $namaClassController . '::' . $metode-&gt;getName(),
            ];
        }
    }

    return $petaRute;
}

print_r(ekstrakDaftarRute(KelasController::class));</pre>
<p><em>(Catatan: Sejak <strong>PHP 8.5</strong>, parameter di dalam atribut <code>#[...]</code> bahkan sudah dapat menerima <strong>static closures</strong> dan <strong>first-class callables</strong> secara langsung!)</em></p>
<h2>Latihan Praktik: Validator Objek Otomatis Berbasis Atribut <code>#[WajibDiisi]</code> dan <code>#[PanjangTeks]</code></h2>
<p>Buatlah berkas <code>validator-atribut.php</code> dan jalankan dengan <code>php validator-atribut.php</code>:</p>
<ol><li>Buat atribut <code>#[Attribute(Attribute::TARGET_PROPERTY)] readonly class PanjangTeks</code> dengan properti <code>public int $min</code> dan <code>public int $maks</code>.</li><li>Buat DTO <code>class InputKursus</code> yang propertinya dipasangi <code>#[PanjangTeks(min: 5, maks: 50)] public string $judul</code>.</li><li>Buat fungsi <code>validasiObjek(object $dto): array</code> yang menggunakan <code>new ReflectionClass($dto)</code> untuk memeriksa semua properti yang memiliki atribut <code>PanjangTeks</code> dan mengembalikan daftar pesan kesalahan jika panjangnya tidak sesuai!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/book.pcre.php" rel="noopener">PCRE (Regular Expressions) — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/language.attributes.overview.php" rel="noopener">Attributes overview — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/language.attributes.reflection.php" rel="noopener">Reading attributes with the Reflection API — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/reference.pcre.pattern.modifiers.php" rel="noopener">PCRE pattern modifiers — PHP Manual</a></li><li><a href="https://www.php.net/releases/8.5/en.php" rel="noopener">PHP 8.5 Release Announcement (Closures in Constant Expressions / Attributes) — PHP.net</a></li></ul></div>
`,
    perintah: ["#[...]","$","\\A","\\z","m","preg_*"],
    kuis: [
        {"tanya":"Mengapa selalu disarankan menyertakan bendera u (UTF-8 mode, misalnya /^[\\p{L}\\s]+$/u) saat menjalankan fungsi preg_match() pada teks Bahasa Indonesia atau nama pengguna internasional?","opsi":["Agar fungsi preg_match() mengubah semua huruf menjadi huruf kapital.","Agar mesin PCRE2 memperlakukan string pola maupun string subjek sebagai rangkaian karakter UTF-8 yang utuh (bukan byte ASCII terpisah) serta mengaktifkan dukungan kelas properti karakter Unicode seperti \\p{L} (huruf dari aksara mana pun).","Agar hasil tangkapan otomatis diurutkan.","Karena tanpa flag u, preg_match() tidak bisa memeriksa angka."],"benar":1,"penjelasan":"Tanpa modifier u (PCRE_UTF8), mesin PCRE memproses string byte demi byte sehingga karakter multibyte (seperti huruf beraksen atau aksara daerah) dapat terpotong di tengah byte dan merusak pencocokan pola."},
        {"tanya":"Apa fungsi dari metode $attr->newInstance() ketika kita membaca atribut PHP 8 melalui $metode->getAttributes(Rute::class) pada Reflection API?","opsi":["Membuat salinan baru dari class Controller.","Menginstansiasi objek dari class Attribute tersebut (misalnya new Rute(...)) lengkap dengan argumen-argumen yang ditulis di dalam tanda #[Rute(...)] pada kode sumber.","Menghapus atribut dari metode tersebut.","Menjalankan metode Controller secara langsung."],"benar":1,"penjelasan":"Metode getAttributes() pada objek refleksi (misalnya ReflectionMethod) terlebih dahulu mengembalikan array objek ReflectionAttribute, yaitu representasi refleksi yang ringan. Ketika $attr->newInstance() dipanggil, PHP memanggil konstruktor class Attribute tersebut dengan argumen yang tertulis pada deklarasi atributnya dan mengembalikan objeknya."},
        {"tanya":"Bagaimana cara membatasi agar sebuah Custom Attribute yang kita buat hanya boleh ditempelkan pada properti class saja (dan ditolak oleh PHP saat newInstance() dipanggil jika tidak sengaja ditempelkan pada fungsi atau class)?","opsi":["Menambahkan #[Attribute(Attribute::TARGET_PROPERTY)] di atas deklarasi class Attribute tersebut.","Menjadikan class Attribute tersebut sebagai abstract class.","Menyimpan class Attribute di dalam folder properties/.","Menambahkan kata kunci private di depan class."],"benar":0,"penjelasan":"Konstanta bitmask Attribute::TARGET_PROPERTY (serta TARGET_CLASS, TARGET_METHOD, TARGET_PARAMETER, TARGET_CLASS_CONSTANT) menentukan target sintaks mana saja yang sah untuk ditempeli atribut tersebut."}
    ]
},
{
    id: 12,
    kategori: "3 · Web & Keamanan Dasar",
    judul: "Menangani Permintaan HTTP, Validasi filter_input(), dan Ekstensi Uri (PHP 8.5)",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["filter_input()","Uri","multipart/form-data"],
    ringkas: "Membedah siklus permintaan HTTP di PHP melalui variabel superglobal ($_SERVER, $_GET, $_POST), membaca body JSON dari php://input, memvalidasi masukan pengguna dengan filter_input() dan filter_var(), serta mengurai URL secara presisi menggunakan ekstensi Uri bawaan PHP 8.5.",
    isi: `
<h2>1. Bagaimana Permintaan HTTP Masuk ke Skrip PHP Anda?</h2>
<p>Ketika peramban mengirimkan permintaan HTTP ke server web (Nginx) dan diteruskan ke PHP-FPM, PHP menyiapkan lingkungan khusus untuk permintaan tersebut dan mengisi sejumlah array <strong>Superglobals</strong> tentang permintaan yang baru saja tiba:</p>
<table><thead><tr><th>Superglobal</th><th>Apa Isinya?</th><th>Catatan Keamanan Penting</th></tr></thead><tbody><tr><td><strong><code>$_SERVER</code></strong></td><td>Metode HTTP (<code>REQUEST_METHOD</code>), jalur URI (<code>REQUEST_URI</code>), alamat IP (<code>REMOTE_ADDR</code>), dan header HTTP (<code>HTTP_*</code>).</td><td>Semua kunci yang diawali <code>HTTP_*</code> (seperti <code>HTTP_HOST</code>, <code>HTTP_USER_AGENT</code>, <code>HTTP_REFERER</code>, <code>HTTP_X_FORWARDED_FOR</code>) dikirim oleh klien dan <strong>bisa dipalsukan oleh penyerang</strong>!</td></tr><tr><td><strong><code>$_GET</code></strong></td><td>Parameter query string dari URL (<code>?halaman=2&amp;kategori=php</code>).</td><td>Semua nilai di dalam <code>$_GET</code> bertipe <code>string</code> (atau <code>array</code> jika ditulis <code>?tag[]=a&amp;tag[]=b</code>)!</td></tr><tr><td><strong><code>$_POST</code></strong></td><td>Data tubuh permintaan dari formulir <code>application/x-www-form-urlencoded</code> atau <code>multipart/form-data</code>.</td><td>Tidak terisi jika klien mengirim body berformat <code>application/json</code>.</td></tr><tr><td><strong><code>$_COOKIE</code></strong></td><td>Nilai cookie yang dikirimkan oleh peramban melalui header <code>Cookie</code>.</td><td>Dapat dimodifikasi oleh pengguna di peramban; selalu validasi!</td></tr><tr><td><strong><code>$_FILES</code></strong></td><td>Metadata berkas yang diunggah lewat <code>multipart/form-data</code>.</td><td>Wajib divalidasi dengan <code>finfo</code> dan <code>move_uploaded_file()</code>.</td></tr></tbody></table>
<div class="callout waspada"><div class="callout-judul">⚠️ Jebakan Keamanan: Nilai di dalam <code>$_GET</code> atau <code>$_POST</code> Bisa Berupa <code>array</code>!</div><p>Banyak pengembang mengira <code>$_GET['pencarian']</code> selalu berupa <code>string</code> lalu langsung menulis <code>trim($_GET['pencarian'])</code>. Apa yang terjadi jika pengguna jahil memanggil URL <strong><code>/cari?pencarian[]=halo</code></strong> (dengan tanda kurung siku <code>[]</code>)? PHP akan mengubah <code>$_GET['pencarian']</code> menjadi sebuah <strong><code>array</code></strong>, sehingga <code>trim($_GET['pencarian'])</code> langsung melempar <strong><code>TypeError: trim(): Argument #1 ($string) must be of type string, array given</code></strong>! <strong>Solusi:</strong> Selalu periksa <code>is_string($nilai)</code> atau gunakan <code>filter_input()</code>!</p></div>
<pre>&lt;?php

declare(strict_types=1);

// AMAN: Memastikan nilai parameter benar-benar bertipe string sebelum di-trim
function ambilQueryString(string $kunci, string $bawaan = ''): string
{
    $nilai = $_GET[$kunci] ?? null;
    return is_string($nilai) ? trim($nilai) : $bawaan;
}</pre>
<h2>2. Validasi Ketat dengan <code>filter_input()</code> dan <code>filter_var()</code></h2>
<p>Ekstensi bawaan <code>filter</code> menyediakan validator standar yang aman terhadap serangan tipe data:</p>
<pre>&lt;?php

declare(strict_types=1);

// 1. Memvalidasi bilangan bulat dengan rentang minimum dan maksimum yang tegas
$idModul = filter_input(
    INPUT_GET,
    'id',
    FILTER_VALIDATE_INT,
    [
        'options' =&gt; [
            'min_range' =&gt; 1,
            'max_range' =&gt; 10_000,
        ],
    ],
);

// filter_input mengembalikan:
// - null  jika parameter 'id' tidak ada sama sekali di $_GET
// - false jika 'id' ada, tetapi bukan angka bulat antara 1..10000 (mis. &quot;abc&quot; atau &quot;-5&quot; atau array!)
if (!is_int($idModul)) {
    http_response_code(400);
    exit('Parameter ID modul harus berupa angka bulat positif.');
}

// 2. Memvalidasi alamat surel dan alamat IP
$surel = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$ipKlien = filter_var($_SERVER['REMOTE_ADDR'] ?? '', FILTER_VALIDATE_IP);</pre>
<h2>3. Membaca Permintaan JSON (<code>php://input</code>) dan Mengenal <code>request_parse_body()</code> (PHP 8.4)</h2>
<ol><li><strong>Untuk Permintaan <code>application/json</code>:</strong> Gunakan <code>file_get_contents('php://input')</code> dan <code>json_decode(..., associative: true, flags: JSON_THROW_ON_ERROR)</code>: \`\`\`php &lt;?php</li></ol>
<p>declare(strict_types=1);</p>
<p>function ambilPayloadJson(): array { $tipeKonten = $_SERVER['CONTENT_TYPE'] ?? ''; if (!str_starts_with(strtolower($tipeKonten), 'application/json')) { throw new InvalidArgumentException('Header Content-Type harus application/json.'); }</p>
<p>$bodyMentah = (string) file_get_contents('php://input'); $data = json_decode($bodyMentah, associative: true, depth: 32, flags: JSON_THROW_ON_ERROR);</p>
<p>if (!is_array($data)) { throw new InvalidArgumentException('Payload JSON harus berupa objek atau array.'); }</p>
<p>return $data; } \`\`\`</p>
<ol><li><strong>Untuk Permintaan <code>PUT</code> / <code>PATCH</code> Multipart (<code>request_parse_body()</code> — Sejak PHP 8.4):</strong> Secara historis, PHP hanya mengurai <code>multipart/form-data</code> secara otomatis untuk metode <code>POST</code>. Sejak <strong>PHP 8.4</strong>, tersedia fungsi bawaan <strong><code>[$post, $files] = request_parse_body();</code></strong> untuk mengurai body <code>multipart/form-data</code> (dan <code>application/x-www-form-urlencoded</code>) pada metode HTTP selain <code>POST</code>, misalnya <code>PUT</code> atau <code>PATCH</code>. Body hanya dapat dibaca sekali: jika <code>php://input</code> sudah dibaca lebih dulu, <code>request_parse_body()</code> mengembalikan data kosong.</li></ol>
<h2>4. Mengurai dan Memodifikasi URL dengan Ekstensi <code>Uri</code> Baru (Sejak PHP 8.5)</h2>
<p>Fungsi lama <code>parse_url()</code> di PHP memiliki perilaku yang tidak konsisten terhadap standar RFC modern. Sejak <strong>PHP 8.5</strong>, ekstensi bawaan <strong><code>Uri</code></strong> menyediakan dua kelas imutabel standar:</p>
<ul><li><strong><code>Uri\\Rfc3986\\Uri</code>:</strong> Untuk URI standar RFC 3986.</li><li><strong><code>Uri\\WhatWg\\Url</code>:</strong> Untuk URL yang mematuhi spesifikasi peramban WHATWG URL.</li></ul>
<pre>&lt;?php

declare(strict_types=1);

use Uri\\Rfc3986\\Uri;

// Mengurai dan membangun URL pengalihan (redirect) yang aman di PHP 8.5:
$uriTujuan = new Uri('https://kodeloka.asadinedu.com/kelas/php');

// Objek Uri bersifat immutable; metode withQuery() menghasilkan instans Uri baru:
$uriDenganPesan = $uriTujuan-&gt;withQuery('status=berhasil&amp;modul=10');

echo $uriDenganPesan-&gt;getHost();   // &quot;kodeloka.asadinedu.com&quot;
echo $uriDenganPesan-&gt;toString();  // &quot;https://kodeloka.asadinedu.com/kelas/php?status=berhasil&amp;modul=10&quot;</pre>
<h2>Latihan Praktik: Endpoint Pemroses Pendaftaran Kelas (Form &amp; JSON)</h2>
<p>Buatlah berkas <code>proses-request.php</code>:</p>
<ol><li>Periksa <code>$_SERVER['REQUEST_METHOD'] === 'POST'</code> (jika bukan <code>POST</code>, kembalikan status <code>405 Method Not Allowed</code> beserta header <code>Allow: POST</code>).</li><li>Dukung penerimaan data baik dari formulir biasa (<code>$_POST</code>) maupun dari body JSON (<code>php://input</code>) berdasarkan pemeriksaan <code>$_SERVER['CONTENT_TYPE']</code>.</li><li>Validasi <code>nama</code> (string 2–80 karakter), <code>email</code> (<code>FILTER_VALIDATE_EMAIL</code>), dan <code>id_kelas</code> (<code>FILTER_VALIDATE_INT</code> minimal 1).</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/function.filter-input.php" rel="noopener"><code>filter_input</code> — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/language.variables.superglobals.php" rel="noopener">Superglobals — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/function.request-parse-body.php" rel="noopener"><code>request_parse_body</code> — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/book.uri.php" rel="noopener">URI extension — PHP Manual</a></li><li><a href="https://www.php.net/releases/8.5/en.php" rel="noopener">PHP 8.5 Release Announcement (URI Extension) — PHP.net</a></li><li><a href="https://www.php.net/releases/8.4/en.php" rel="noopener">PHP 8.4 Release Announcement (<code>request_parse_body</code>) — PHP.net</a></li></ul></div>
`,
    perintah: ["multipart/form-data","$_GET","array","$_POST","php://input","request_parse_body()"],
    kuis: [
        {"tanya":"Apa yang terjadi jika kode Anda memanggil trim($_GET['nama']) secara langsung pada mode declare(strict_types=1);, lalu pengunjung memanggil URL ?nama[]=Budi?","opsi":["Fungsi trim() otomatis mengambil elemen pertama dari array tersebut (\"Budi\").","PHP melempar TypeError karena notasi ?nama[]=Budi membuat $_GET['nama'] bertipe array, sedangkan trim() hanya menerima argumen bertipe string.","$_GET['nama'] otomatis bernilai null.","Peramban memblokir URL yang mengandung karakter []."],"benar":1,"penjelasan":"Di PHP, parameter query atau input form yang memiliki akhiran [] otomatis diurai menjadi array di dalam $_GET atau $_POST. Selalu pastikan tipe variabel dengan is_string() atau gunakan filter_input() sebelum memasukkannya ke fungsi string."},
        {"tanya":"Mengapa nilai $_SERVER['HTTP_X_FORWARDED_FOR'] atau $_SERVER['HTTP_USER_AGENT'] tidak boleh langsung dipercaya begitu saja untuk keputusan keamanan?","opsi":["Karena variabel $_SERVER hanya tersedia di Windows.","Karena seluruh entri di dalam $_SERVER yang diawali dengan HTTP_ disalin langsung dari header permintaan HTTP yang dikirim oleh klien, sehingga dapat diubah atau dipalsukan sesuka hati oleh pengirim menggunakan curl -H \"...\" (kecuali X-Forwarded-For ditimpa secara ketat oleh reverse proxy tepercaya milik Anda sendiri seperti Nginx/Cloudflare).","Karena $_SERVER otomatis terhapus setelah dibaca satu kali.","Karena nilainya selalu terenkripsi."],"benar":1,"penjelasan":"Hanya variabel seperti $_SERVER['REMOTE_ADDR'] dan $_SERVER['REQUEST_METHOD'] yang berasal dari koneksi TCP/HTTP aktual di tingkat server web, sedangkan $_SERVER['HTTP_*'] berasal dari header HTTP masukan klien."},
        {"tanya":"Apa keunggulan ekstensi bawaan Uri (Uri\\Rfc3986\\Uri dan Uri\\WhatWg\\Url) yang diperkenalkan di PHP 8.5 dibandingkan fungsi lama parse_url()?","opsi":["parse_url() hanya dapat membaca URL yang dimulai dengan ftp://.","Ekstensi Uri di PHP 8.5 mematuhi spesifikasi standar RFC 3986 dan WHATWG URL secara ketat (menutup celah perbedaan penguraian URL antar-layanan) serta menyediakan antarmuka berorientasi objek yang immutable.","Ekstensi Uri otomatis mengunduh halaman HTML dari URL tersebut.","parse_url() sudah dihapus dari PHP 8.2."],"benar":1,"penjelasan":"parse_url() memiliki perilaku non-standar pada sejumlah URL tepi (edge cases) yang berisiko memicu celah SSRF / Open Redirect bypass. Ekstensi Uri di PHP 8.5 dibangun di atas pustaka standar RFC 3986 (uriparser) dan WHATWG (Lexbor)."}
    ]
},
{
    id: 13,
    kategori: "3 · Web & Keamanan Dasar",
    judul: "Keluaran Aman (Contextual Output Escaping), Pencegahan XSS, dan Header Keamanan HTTP",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["htmlspecialchars()","e()","<script>"],
    ringkas: "Mencegah celah Cross-Site Scripting (XSS) dengan menerapkan pengodean keluaran sesuai konteks penempatannya (HTML body, atribut HTML, blok JavaScript, parameter URL), serta memperkuat pertahanan dengan header HTTP keamanan.",
    isi: `
<h2>Mengapa Satu Cara Escaping Saja Tidak Cukup untuk Semua Konteks?</h2>
<p><strong>Cross-Site Scripting (XSS)</strong> terjadi ketika data dinamis yang berasal dari luar (input pengguna, database, atau API pihak ketiga) dicetak ke dalam halaman web sedemikian rupa sehingga peramban menafsirkannya sebagai <strong>instruksi kode yang harus dijalankan</strong>, bukan sebagai teks data biasa.</p>
<p>Kunci utama pencegahan XSS menurut <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" rel="noopener">OWASP Cross Site Scripting Prevention Cheat Sheet</a> adalah <strong>Contextual Output Encoding</strong>: cara Anda mengodekan keluaran bergantung pada <strong>di bagian mana dari dokumen</strong> variabel tersebut disisipkan!</p>
<pre>Di Mana Variabel Dicetak?                       Fungsi Pengaman yang Wajib Dipakai di PHP
─────────────────────────────────────────────   ──────────────────────────────────────────────────────
1. Di dalam Isi Elemen HTML (&lt;p&gt;INI&lt;/p&gt;)     ──&gt; htmlspecialchars($val, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')
2. Di dalam Atribut Berkutip (&quot;INI&quot;)    ──&gt; htmlspecialchars($val, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')
3. Di dalam Nilai Variabel JS (&lt;script&gt;)     ──&gt; json_encode($val, JSON_HEX_TAG | JSON_HEX_AMP | ...)
4. Di dalam Parameter Query URL (?q=INI)     ──&gt; rawurlencode($val) atau http_build_query([...])
5. Di dalam Atribut URL (href=&quot;INI&quot;)         ──&gt; Validasi skema protokol ('https'/'http') + htmlspecialchars()</pre>
<h2>1. Konteks 1 &amp; 2: Teks Elemen HTML dan Atribut HTML (<code>htmlspecialchars</code>)</h2>
<p>Buat satu fungsi pembantu (<em>helper</em>) pendek <code>e()</code> yang selalu siap dipanggil di seluruh templat tampilan Anda:</p>
<pre>&lt;?php

declare(strict_types=1);

function e(string|int|float|null $nilai): string
{
    return htmlspecialchars(
        string: (string) $nilai,
        flags: ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5,
        encoding: 'UTF-8',
    );
}</pre>
<h3>Mengapa Ketiga Argumen <code>htmlspecialchars()</code> Tersebut Penting?</h3>
<ol><li><strong><code>ENT_QUOTES</code>:</strong> Memastikan bahwa baik tanda kutip ganda (<code>&quot;</code> → <code>&amp;quot;</code>) <strong>maupun tanda kutip tunggal (<code>'</code> → <code>&amp;apos;</code> pada ENT_HTML5 / <code>&amp;#039;</code> pada HTML 4.01)</strong> sama-sama diubah menjadi entitas aman!</li><li><strong><code>ENT_SUBSTITUTE</code>:</strong> Jika di dalam string terdapat urutan byte UTF-8 yang rusak/tidak valid, daripada fungsi gagal dan mengembalikan string kosong <code>&quot;&quot;</code> secara tiba-tiba, <code>ENT_SUBSTITUTE</code> mengganti byte rusak tersebut dengan simbol karakter pengganti Unicode <code>U+FFFD</code> (�) yang aman!</li><li><strong><code>'UTF-8'</code>:</strong> Menjamin fungsi mengurai batas karakter multibyte sesuai pengodean UTF-8 dokumen Anda.</li></ol>
<div class="callout bahaya"><div class="callout-judul">🚫 Tiga Konteks HTML yang TIDAK Boleh Diisi Data Pengguna Meskipun Sudah Di-<code>htmlspecialchars()</code></div><ol><li><strong>Atribut Tanpa Tanda Kutip (<code>&lt;input value=&lt;?= e($x) ?&gt;&gt;</code>):</strong> Selalu bungkus nilai atribut dengan tanda kutip ganda (<code>value=&quot;&lt;?= e($x) ?&gt;&quot;</code>), karena <code>htmlspecialchars()</code> tidak mengubah karakter spasi!</li><li><strong>Atribut Event Handler (<code>onclick=&quot;...&quot;</code>, <code>onload=&quot;...&quot;</code>, <code>onerror=&quot;...&quot;</code>):</strong> Jangan pernah menyisipkan data pengguna ke dalam atribut <code>on*</code>! Gunakan atribut <code>data-*</code> (<code>data-nama=&quot;&lt;?= e($nama) ?&gt;&quot;</code>) lalu baca dari JavaScript menggunakan <code>elemen.dataset.nama</code>.</li><li><strong>Nama Tag atau Nama Atribut (<code>&lt;&lt;?= e($tag) ?&gt;&gt;</code>):</strong> Jika nama tag harus dinamis (misalnya memilih antara <code>h2</code> atau <code>h3</code>), wajib saring dengan daftar putih <code>match ($level) { 2 =&gt; 'h2', default =&gt; 'h3' }</code>.</li></ol></div>
<h2>2. Konteks 3: Menyisipkan Data PHP ke Dalam JavaScript (<code>json_encode</code>)</h2>
<p>Jika Anda perlu mengirimkan objek konfigurasi atau data awal dari PHP ke variabel JavaScript di dalam <code>&lt;script&gt;</code>, <strong>jangan menggunakan <code>htmlspecialchars()</code></strong> (karena di dalam blok <code>&lt;script&gt;</code>, peramban tidak menerjemahkan <code>&amp;quot;</code> kembali menjadi tanda kutip!).</p>
<p>Sebaliknya, gunakan <strong><code>json_encode()</code> dengan empat bendera <code>JSON_HEX_*</code></strong> atau letakkan datanya di dalam atribut <code>data-*</code> pada elemen HTML:</p>
<pre>&lt;?php

declare(strict_types=1);

function jsonUntukScript(mixed $data): string
{
    return json_encode(
        value: $data,
        flags: JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_THROW_ON_ERROR,
    );
}

$profilAwal = [
    'nama' =&gt; 'Budi &lt;/script&gt;&lt;script&gt;alert(1)&lt;/script&gt;',
    'peran' =&gt; 'peserta',
];
?&gt;
&lt;!-- Cara A: Menggunakan jsonUntukScript() dengan JSON_HEX_TAG --&gt;
&lt;script&gt;
  const PROFIL = &lt;?= jsonUntukScript($profilAwal) ?&gt;;
  console.log(PROFIL.nama);
&lt;/script&gt;

&lt;!-- Cara B (Lebih Bersih &amp; Ramah CSP Strict!): Simpan di atribut data-* lalu baca dengan JSON.parse() --&gt;
&lt;div id=&quot;data-awal&quot; data-profil=&quot;&lt;?= e(json_encode($profilAwal, JSON_THROW_ON_ERROR)) ?&gt;&quot; hidden&gt;&lt;/div&gt;
&lt;script src=&quot;/assets/app.js&quot; defer&gt;&lt;/script&gt;</pre>
<p>Perhatikan <strong>Cara B</strong> di atas: dengan menaruh JSON di dalam atribut <code>data-profil=&quot;...&quot;</code> yang di-escape dengan <code>e()</code>, halaman Anda <strong>tidak membutuhkan blok <code>&lt;script&gt;</code> inline sama sekali</strong>, sehingga Anda dapat mengaktifkan kebijakan <code>Content-Security-Policy: script-src 'self'</code> yang paling ketat!</p>
<h2>3. Konteks 4 &amp; 5: Membangun Tautan URL yang Aman (<code>http_build_query</code> &amp; Validasi Skema)</h2>
<ol><li><strong>Saat menyisipkan parameter ke dalam query URL:</strong> Gunakan <strong><code>http_build_query()</code></strong> atau <strong><code>rawurlencode()</code></strong>, lalu bungkus keseluruhan URL dengan <strong><code>e()</code></strong> saat dimasukkan ke dalam atribut <code>href=&quot;...&quot;</code>: \`\`<code>php &lt;?php $urlPencarian = '/cari?' . http_build_query([ 'q' =&gt; 'C++ &amp; PHP 8.5', 'urut' =&gt; 'terbaru', ]); ?&gt; &lt;a href=&quot;&lt;?= e($urlPencarian) ?&gt;&quot;&gt;Cari Materi&lt;/a&gt; </code>\`\`</li><li><strong>Saat seluruh URL berasal dari input pengguna (misalnya tautan situs web profil):</strong> <code>htmlspecialchars(&quot;javascript:alert(1)&quot;)</code> tetap menghasilkan <code>&quot;javascript:alert(1)&quot;</code> karena tidak mengandung karakter <code>&lt;</code>, <code>&gt;</code>, atau <code>&quot;</code>! Oleh karena itu, <strong>wajib periksa bahwa skema URL hanya boleh <code>'https'</code> atau <code>'http'</code></strong> terlebih dahulu: \`\`\`php &lt;?php</li></ol>
<p>declare(strict_types=1);</p>
<p>function bersihkanUrlProfil(string $urlInput): ?string { $url = trim($urlInput); if (!filter_var($url, FILTER_VALIDATE_URL)) { return null; }</p>
<p>$skema = strtolower((string) parse_url($url, PHP_URL_SCHEME)); if ($skema !== 'https' &amp;&amp; $skema !== 'http') { return null; // Menolak 'javascript:', 'data:', 'vbscript:', dll. }</p>
<p>return $url; } \`\`\`</p>
<h2>4. Memperkuat Respons dengan Header Keamanan HTTP (<code>header()</code>)</h2>
<p>Sebagai pertahanan berlapis di setiap respons halaman HTML, kirimkan header keamanan HTTP berikut sebelum mencetak output:</p>
<pre>&lt;?php

declare(strict_types=1);

function kirimHeaderKeamananHtml(): void
{
    header('Content-Type: text/html; charset=utf-8');
    // Mencegah peramban menebak-nebak (MIME-sniffing) berkas teks menjadi skrip yang bisa dijalankan
    header('X-Content-Type-Options: nosniff');
    // Mencegah halaman disematkan di dalam &lt;iframe&gt; situs lain (Anti-Clickjacking)
    header('X-Frame-Options: DENY');
    // Mengendalikan informasi Referer saat pengguna mengeklik tautan keluar
    header('Referrer-Policy: strict-origin-when-cross-origin');
    // Membatasi sumber skrip hanya dari domain sendiri (Anti-XSS berlapis!)
    header(&quot;Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; frame-ancestors 'none'; base-uri 'self'&quot;);
}</pre>
<h2>Latihan Praktik: Membuat Kelas Pembantu Template yang Aman Kontekstual</h2>
<p>Buatlah berkas <code>TemplateAman.php</code> yang menyediakan tiga metode statis:</p>
<ol><li><code>TemplateAman::teks(string|int|float|null $val): string</code> (menggunakan <code>htmlspecialchars</code>).</li><li><code>TemplateAman::json(mixed $data): string</code> (menggunakan <code>json_encode</code> dengan <code>JSON_HEX_*</code>).</li><li><code>TemplateAman::url(string $url): string</code> (memvalidasi protokol <code>http</code>/<code>https</code> dan mengembalikan <code>'#'</code> jika berbahaya, lalu di-escape dengan <code>teks()</code>).</li><li>Uji ketiga metode tersebut dengan muatan uji <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> dan <code>javascript:alert(1)</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/function.htmlspecialchars.php" rel="noopener"><code>htmlspecialchars</code> — PHP Manual</a></li><li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" rel="noopener">Cross Site Scripting Prevention Cheat Sheet — OWASP</a></li><li><a href="https://www.php.net/manual/en/function.json-encode.php" rel="noopener"><code>json_encode</code> — PHP Manual</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP" rel="noopener">Content Security Policy (CSP) — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["htmlspecialchars()","e()","<script>","\"","&quot;","ENT_SUBSTITUTE"],
    kuis: [
        {"tanya":"Mengapa memanggil htmlspecialchars(\"javascript:alert(document.cookie)\", ENT_QUOTES, 'UTF-8') lalu menaruh hasilnya di dalam <a href=\"...\"> tidak mencegah terjadinya serangan XSS saat tautan diklik?","opsi":["Karena htmlspecialchars() tidak mendukung pengodean UTF-8.","Karena string \"javascript:alert(document.cookie)\" sama sekali tidak mengandung karakter <, >, &, \", maupun ', sehingga diloloskan utuh oleh htmlspecialchars() dan dieksekusi oleh peramban sebagai pseudo-protokol JavaScript ketika tautan diklik; untuk atribut href/src, kita wajib memvalidasi bahwa skema protokolnya hanya https: atau http:.","Karena tag <a> tidak memproses entitas HTML.","Karena ENT_QUOTES hanya bekerja di dalam <input>."],"benar":1,"penjelasan":"htmlspecialchars() mencegah keluarnya teks dari konteks atribut HTML, tetapi untuk atribut yang menerima URL (href, src, action), nilai atribut itu sendiri dievaluasi oleh peramban sebagai protokol navigasi. Oleh karena itu, validasi daftar putih protokol (http/https) wajib dilakukan sebelum HTML escaping."},
        {"tanya":"Apa fungsi dari bendera ENT_SUBSTITUTE pada pemanggilan htmlspecialchars($teks, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')?","opsi":["Mengganti semua spasi menjadi tanda hubung -.","Mengganti urutan byte karakter UTF-8 yang tidak valid dengan karakter pengganti Unicode U+FFFD (�) alih-alih mengembalikan string kosong \"\", sehingga tampilan halaman tidak hilang secara tiba-tiba jika terselip byte yang rusak.","Mengubah semua huruf kecil menjadi huruf besar.","Menghapus tag HTML seperti strip_tags()."],"benar":1,"penjelasan":"Tanpa ENT_SUBSTITUTE, jika $teks mengandung satu saja byte non-UTF-8 yang cacat, htmlspecialchars() akan mengembalikan string kosong \"\" secara keseluruhan. ENT_SUBSTITUTE menjaga sisa teks yang valid tetap tampil dengan aman."},
        {"tanya":"Apa fungsi dari header respons HTTP X-Content-Type-Options: nosniff?","opsi":["Mematikan pemeriksaan kata sandi di peramban.","Melarang peramban melakukan MIME-type sniffing (menebak sendiri tipe berkas dari isinya dan mengabaikan header Content-Type dari server), sehingga berkas teks atau gambar yang diunggah pengguna tidak pernah dieksekusi secara keliru sebagai HTML atau JavaScript oleh peramban.","Menyembunyikan alamat IP server.","Mengompresi ukuran berkas CSS secara otomatis."],"benar":1,"penjelasan":"Tanpa X-Content-Type-Options: nosniff, beberapa peramban dapat mencoba menebak isi berkas text/plain atau gambar yang mengandung tag <script> lalu mengeksekusinya sebagai dokumen HTML/JavaScript."}
    ]
},
{
    id: 14,
    kategori: "3 · Web & Keamanan Dasar",
    judul: "Manajemen State: Cookie yang Aman, Session, dan Pencegahan Session Fixation",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["$_SESSION","setcookie()","true"],
    ringkas: "Mengelola identitas dan state pengguna di atas protokol HTTP yang stateless menggunakan setcookie() dengan atribut keamanan (HttpOnly, Secure, SameSite, partitioned), mengonfigurasi $_SESSION, serta mencegah serangan Session Fixation dengan session_regenerate_id(true).",
    isi: `
<h2>Mengapa HTTP Membutuhkan Cookie dan Session?</h2>
<p>Protokol HTTP pada dasarnya bersifat <strong>stateless (tanpa ingatan)</strong>: setelah server selesai mengirim balasan untuk halaman login Anda, server langsung melupakan siapa Anda. Ketika 2 detik kemudian Anda mengeklik tautan menuju halaman <code>/dasbor</code>, server membutuhkan cara untuk mengenali bahwa permintaan kedua ini masih berasal dari pengguna yang baru saja berhasil login.</p>
<p>Di sinilah <strong>Cookie</strong> dan <strong>Session</strong> bekerja sama:</p>
<ol><li><strong>Cookie:</strong> Sepotong data kecil (maksimal ~4 KB) yang dikirim oleh server melalui header HTTP <code>Set-Cookie</code> untuk disimpan di peramban pengguna, lalu otomatis dikirimkan kembali oleh peramban melalui header <code>Cookie</code> pada setiap permintaan berikutnya ke domain tersebut.</li><li><strong>Session (<code>$_SESSION</code>):</strong> Data pengguna (seperti <code>user_id</code>, peran, atau pesan kilat/<em>flash message</em>) disimpan dengan aman <strong>di sisi server</strong> (di berkas server atau Redis), sementara peramban pengguna cukup menyimpan satu <strong>Cookie ID Sesi acak</strong> (misalnya <code>PHPSESSID=a8f9...</code>) sebagai kuncinya!</li></ol>
<h2>1. Mengirim Cookie yang Aman dengan <code>setcookie()</code></h2>
<p>Sejak PHP 7.3+, fungsi <code>setcookie()</code> mendukung argumen ke-3 berupa <strong>array asosiatif opsi</strong> yang jauh lebih mudah dibaca daripada menghafal 7 urutan parameter lama. Sejak <strong>PHP 8.5</strong>, array opsi ini juga mendukung kunci <strong><code>'partitioned'</code></strong> untuk <em>CHIPS (Cookies Having Independent Partitioned State)</em>!</p>
<pre>&lt;?php

declare(strict_types=1);

// Mengatur cookie preferensi tampilan selama 30 hari dengan opsi keamanan lengkap:
setcookie(
    name: 'preferensi_bahasa',
    value: 'id',
    options: [
        'expires'  =&gt; time() + (30 * 86400), // Kedaluwarsa dalam 30 hari
        'path'     =&gt; '/',                   // Berlaku di seluruh jalur situs
        'domain'   =&gt; '',                    // Hanya untuk host domain saat ini (HostOnly)
        'secure'   =&gt; true,                  // WAJIB: Hanya dikirim lewat koneksi terenkripsi HTTPS
        'httponly' =&gt; true,                  // WAJIB: Tidak bisa dibaca oleh document.cookie di JavaScript (anti-pencurian XSS)
        'samesite' =&gt; 'Lax',                 // Melindungi dari pengiriman lintas situs (CSRF)
    ],
);</pre>
<h3>Memahami Tiga Pilar Pengaman Cookie: <code>HttpOnly</code>, <code>Secure</code>, dan <code>SameSite</code></h3>
<table><thead><tr><th>Atribut Cookie</th><th>Apa yang Dilindungi?</th><th>Rekomendasi Produksi</th></tr></thead><tbody><tr><td><strong><code>httponly =&gt; true</code></strong></td><td>Melarang JavaScript (<code>document.cookie</code>) membaca cookie tersebut. Jika terjadi celah XSS, skrip penyerang tidak dapat menyalin nilai cookie sesi Anda.</td><td><strong>Wajib <code>true</code></strong> untuk semua cookie sesi dan token autentikasi!</td></tr><tr><td><strong><code>secure =&gt; true</code></strong></td><td>Memastikan peramban hanya mengirimkan cookie melalui sambungan terenkripsi <strong>HTTPS</strong>, tidak pernah lewat HTTP polos yang bisa disadap di jaringan Wi-Fi umum.</td><td><strong>Wajib <code>true</code></strong> di lingkungan produksi.</td></tr><tr><td><strong><code>samesite =&gt; 'Lax'</code> atau <code>'Strict'</code></strong></td><td>Mengatur apakah cookie ikut dikirim pada permintaan lintas situs (<em>cross-site request</em>). <code>'Lax'</code> mengizinkan cookie saat pengguna mengeklik tautan biasa dari luar menuju situs Anda, tetapi menahan cookie pada pengiriman formulir <code>POST</code> dari situs luar!</td><td>Gunakan <strong><code>'Lax'</code></strong> (atau <strong><code>'Strict'</code></strong> untuk aplikasi perbankan/admin sensitif).</td></tr></tbody></table>
<h2>2. Mengelola Session (<code>$_SESSION</code>) dengan Benar</h2>
<p>Sebelum memanggil <code>session_start()</code>, selalu pastikan parameter cookie sesi dikonfigurasi secara ketat:</p>
<pre>&lt;?php

declare(strict_types=1);

function mulaiSesiAman(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    // Aktifkan strict mode agar PHP menolak ID sesi yang tidak dibuat oleh server kita sendiri!
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');

    session_set_cookie_params([
        'lifetime' =&gt; 0,       // Cookie sesi berakhir saat peramban ditutup
        'path'     =&gt; '/',
        'secure'   =&gt; isset($_SERVER['HTTPS']) &amp;&amp; $_SERVER['HTTPS'] !== 'off',
        'httponly' =&gt; true,
        'samesite' =&gt; 'Lax',
    ]);

    session_start();
}</pre>
<h2>3. Mencegah Serangan <em>Session Fixation</em> dengan <code>session_regenerate_id(true)</code></h2>
<p>Bayangkan skenario serangan <strong>Session Fixation</strong> berikut:</p>
<ol><li>Penyerang mengunjungi situs Anda dan mendapatkan ID sesi kosong <code>PHPSESSID=12345</code>.</li><li>Penyerang menjebak korban agar menggunakan ID sesi <code>12345</code> tersebut, lalu korban melakukan login dengan nama pengguna dan kata sandinya.</li><li>Jika saat korban berhasil login aplikasi Anda <strong>tidak mengganti ID sesinya</strong>, maka ID sesi <code>12345</code> yang sudah diketahui penyerang tadi kini berubah menjadi sesi milik korban yang sudah terautentikasi!</li></ol>
<p><strong>Aturan Keamanan Wajib:</strong> Setiap kali terjadi perubahan tingkat hak akses—terutama <strong>tepat setelah pengguna berhasil login</strong> atau setelah pengguna mengubah kata sandinya—Anda <strong>wajib memanggil <code>session_regenerate_id(true)</code></strong> untuk menerbitkan ID sesi baru dan menghapus berkas sesi lama!</p>
<pre>&lt;?php

declare(strict_types=1);

function prosesLoginBerhasil(int $idPengguna, string $peran): void
{
    mulaiSesiAman();

    // WAJIB: Buat ID sesi baru yang acak dan hapus sesi lama (argumen true)
    // untuk mencegah serangan Session Fixation!
    session_regenerate_id(delete_old_session: true);

    $_SESSION['user_id'] = $idPengguna;
    $_SESSION['peran'] = $peran;
    $_SESSION['waktu_login'] = time();
}</pre>
<h2>4. Cara Menghancurkan Sesi dengan Bersih Saat Logout</h2>
<p>Untuk mengeluarkan pengguna (<em>logout</em>) secara tuntas, jangan hanya memanggil <code>session_destroy()</code>! Mengapa? Karena <code>session_destroy()</code> hanya menghapus data sesi di diska server, sementara variabel <code>$_SESSION</code> di memori skrip saat ini masih terisi dan cookie di peramban pengguna belum dihapus.</p>
<p>Ikuti urutan lengkap resmi dari <a href="https://www.php.net/manual/en/function.session-destroy.php" rel="noopener">PHP Manual</a>:</p>
<pre>&lt;?php

declare(strict_types=1);

function prosesLogout(): void
{
    mulaiSesiAman();

    // 1. Kosongkan seluruh isi array $_SESSION di memori
    $_SESSION = [];

    // 2. Hapus cookie sesi di peramban pengguna dengan mengatur waktu kedaluwarsa di masa lalu
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            name: session_name(),
            value: '',
            options: [
                'expires'  =&gt; time() - 42000,
                'path'     =&gt; $params['path'],
                'domain'   =&gt; $params['domain'],
                'secure'   =&gt; $params['secure'],
                'httponly' =&gt; $params['httponly'],
                'samesite' =&gt; $params['samesite'] ?: 'Lax',
            ],
        );
    }

    // 3. Hancurkan penyimpanan sesi di sisi server
    session_destroy();
}</pre>
<h2>Latihan Praktik: Membuat Manajer Sesi dan Flash Message</h2>
<p>Buatlah berkas <code>SesiManajer.php</code>:</p>
<ol><li>Buat <code>final class SesiManajer</code> dengan metode <code>mulai()</code>, <code>login(int $userId)</code>, <code>logout()</code>, dan <code>apakahLogin(): bool</code>.</li><li>Tambahkan fitur <strong>Flash Message</strong> (<code>setFlash(string $kunci, string $pesan)</code> dan <code>ambilFlash(string $kunci): ?string</code>) yang menyimpan pesan notifikasi sekali pakai di <code>$_SESSION['_flash'][$kunci]</code> lalu langsung menghapusnya dengan <code>unset()</code> begitu pesan tersebut selesai dibaca satu kali!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/function.session-regenerate-id.php" rel="noopener"><code>session_regenerate_id</code> — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/features.session.security.management.php" rel="noopener">Session Management Basics — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/function.setcookie.php" rel="noopener"><code>setcookie</code> — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/function.session-destroy.php" rel="noopener"><code>session_destroy</code> — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/session.configuration.php" rel="noopener">Session Runtime Configuration (<code>session.use_strict_mode</code>) — PHP Manual</a></li></ul></div>
`,
    perintah: ["$_SESSION","setcookie()","true","'Strict'","'Lax'","session_regenerate_id(true)"],
    kuis: [
        {"tanya":"Mengapa Anda wajib memanggil session_regenerate_id(true) tepat setelah pengguna berhasil melewati verifikasi nama pengguna dan kata sandi saat login?","opsi":["Untuk mempercepat kueri basis data pada halaman berikutnya.","Untuk mengganti ID sesi lama dengan ID sesi baru yang acak sekaligus menghapus sesi lama, sehingga menggagalkan serangan Session Fixation di mana penyerang sudah mengetahui ID sesi korban sebelum login.","Untuk menghapus seluruh isi array $_SESSION.","Karena $_SESSION tidak bisa diisi sebelum session_regenerate_id() dipanggil."],"benar":1,"penjelasan":"Dalam serangan Session Fixation, penyerang mengincar ID sesi pra-login untuk diambil alih setelah korban login. Memanggil session_regenerate_id(true) saat status autentikasi berubah memastikan ID sesi lama hangus dan digantikan oleh ID sesi baru yang hanya diketahui oleh korban."},
        {"tanya":"Apa fungsi pengaturan ini_set('session.use_strict_mode', '1') pada manajemen sesi PHP?","opsi":["Memaksa seluruh nilai di dalam $_SESSION bertipe string.","Memerintahkan PHP untuk menolak ID sesi yang dikirimkan oleh peramban apabila ID sesi tersebut belum pernah diinisialisasi dan tidak dikenali oleh server, lalu membuatkan ID sesi baru yang sah.","Membatasi waktu sesi hanya selama 60 detik.","Mematikan penyimpanan cookie di peramban."],"benar":1,"penjelasan":"Tanpa session.use_strict_mode, jika penyerang mengirim cookie PHPSESSID=id_pilihan_penyerang, PHP akan menerima ID tersebut dan membuatkan sesi baru dengan nama ID pilihan penyerang itu. Dengan use_strict_mode = 1, PHP menolak ID sesi asing yang belum ada di server."},
        {"tanya":"Apa peran atribut 'samesite' => 'Lax' pada cookie sesi?","opsi":["Mengizinkan cookie dibaca oleh document.cookie di semua domain.","Mencegah peramban mengirimkan cookie tersebut pada permintaan lintas situs yang berisiko (seperti pengiriman formulir POST atau fetch dari situs pihak ketiga), namun tetap mengirimkannya ketika pengguna melakukan navigasi tingkat atas (mengeklik tautan biasa menuju situs Anda).","Mengenkripsi isi cookie dengan algoritma Argon2id.","Menyimpan cookie di dalam localStorage."],"benar":1,"penjelasan":"SameSite=Lax memberikan keseimbangan keamanan dan kenyamanan: pengguna yang mengeklik tautan menuju situs Anda dari surel atau situs lain tetap berstatus login (GET navigasi tingkat atas), tetapi formulir POST tersembunyi dari situs penyerang tidak akan disertakan cookie sesinya."}
    ]
},
{
    id: 15,
    kategori: "3 · Web & Keamanan Dasar",
    judul: "Menangani Unggah Berkas (File Upload) Secara Aman",
    tingkat: "Menengah", durasi: "9 mnt",
    tag: ["public/","$_FILES","$_FILES['bukti']"],
    ringkas: "Memproses unggahan berkas melalui $_FILES dengan memeriksa kode status UPLOAD_ERR_*, memverifikasi tipe MIME sejati dari isi biner berkas menggunakan ekstensi finfo, mengganti nama berkas secara kriptografis, serta menyimpan berkas di luar direktori publik.",
    isi: `
<h2>Mengapa Fitur Unggah Berkas Adalah Salah Satu Titik Paling Berbahaya di Web?</h2>
<p>Mengizinkan pengguna mengunggah berkas ke server Anda ibarat membuka pintu paket di gedung kantor: jika petugas keamanan hanya membaca tulisan di luar kardus (<em>&quot;Isinya Foto Kucing.jpg&quot;</em>) tanpa memindai isi sebenarnya di dalam kardus, penyerang dapat menyelundupkan berkas skrip berbahaya <strong><code>shell.php</code></strong> lalu membukanya lewat URL <code>https://situs-anda.id/uploads/shell.php</code> untuk mengambil alih seluruh server Anda (<strong>Remote Code Execution / RCE</strong>)!</p>
<p>Untuk membangun fitur unggah berkas yang benar-benar aman, Anda wajib menerapkan <strong>6 Lapis Pertahanan Unggah Berkas</strong>.</p>
<h2>1. Struktur Formulir HTML dan Pemeriksaan Kode Galat <code>$_FILES</code></h2>
<p>Di sisi HTML, formulir wajib menggunakan <code>method=&quot;post&quot;</code> dan <strong><code>enctype=&quot;multipart/form-data&quot;</code></strong>:</p>
<pre>&lt;form action=&quot;/unggah-bukti&quot; method=&quot;post&quot; enctype=&quot;multipart/form-data&quot;&gt;
  &lt;label for=&quot;berkas-bukti&quot;&gt;Unggah Bukti Pembayaran (PNG, WebP, atau PDF maks. 2 MB)&lt;/label&gt;
  &lt;input
    type=&quot;file&quot;
    id=&quot;berkas-bukti&quot;
    name=&quot;bukti&quot;
    accept=&quot;image/png,image/webp,application/pdf&quot;
    required
  &gt;
  &lt;button type=&quot;submit&quot;&gt;Unggah Berkas&lt;/button&gt;
&lt;/form&gt;</pre>
<p>Di sisi PHP, berkas yang diunggah masuk ke superglobal <strong><code>$_FILES['bukti']</code></strong>. Langkah pertama adalah memeriksa <strong><code>$_FILES['bukti']['error']</code></strong> menggunakan konstanta <code>UPLOAD_ERR_*</code>:</p>
<pre>&lt;?php

declare(strict_types=1);

if (!isset($_FILES['bukti']) || !is_int($_FILES['bukti']['error'])) {
    throw new RuntimeException('Permintaan unggah berkas tidak valid.');
}

switch ($_FILES['bukti']['error']) {
    case UPLOAD_ERR_OK:
        break; // Berkas berhasil tiba di folder sementara (tmp_name)
    case UPLOAD_ERR_NO_FILE:
        throw new RuntimeException('Tidak ada berkas yang dipilih.');
    case UPLOAD_ERR_INI_SIZE:
    case UPLOAD_ERR_FORM_SIZE:
        throw new RuntimeException('Ukuran berkas melebihi batas maksimal yang diizinkan.');
    default:
        throw new RuntimeException('Terjadi kegagalan saat menerima berkas.');
}</pre>
<h2>2. Dua Hal yang TIDAK BOLEH PERNAH Dipercayai pada <code>$_FILES</code>!</h2>
<p>Perhatikan isi array <code>$_FILES['bukti']</code>:</p>
<ul><li><code>$_FILES['bukti']['tmp_name']</code>: Jalur berkas sementara di server (diisi oleh PHP — <strong>Tepercaya</strong>).</li><li><code>$_FILES['bukti']['size']</code>: Ukuran byte berkas aktual (diisi oleh PHP — <strong>Tepercaya</strong>).</li><li><strong><code>$_FILES['bukti']['type']</code> (TIDAK TEPERCAYA!):</strong> Nilai ini diambil mentah-mentah dari header <code>Content-Type</code> yang dikirim oleh peramban/klien! Penyerang dapat dengan mudah mengirim berkas <code>virus.php</code> sambil memalsukan header <code>Content-Type: image/png</code>.</li><li><strong><code>$_FILES['bukti']['name']</code> (TIDAK TEPERCAYA!):</strong> Nama asli berkas dari komputer pengguna. Penyerang dapat memberi nama berkas <code>../../public/index.php</code> (<em>Path Traversal</em>), <code>shell.php.jpg</code>, atau menyisipkan karakter berbahaya.</li></ul>
<h2>3. Memeriksa Tipe Berkas Sejati dengan <code>finfo</code> dan Menamai Ulang Berkas</h2>
<p>Untuk mengetahui tipe berkas yang sebenarnya, kita tidak membaca nama berkas atau header HTTP-nya, melainkan memeriksa **tanda tangan byte awal (<em>magic bytes</em>) di dalam isi berkas sementara (<code>tmp_name</code>)<strong> menggunakan ekstensi bawaan </strong><code>finfo</code>** (<em>Fileinfo</em>):</p>
<pre>&lt;?php

declare(strict_types=1);

function simpanUnggahanAman(
    array $infoBerkas,
    string $direktoriTujuan,
    int $batasByteMaks = 2 * 1024 * 1024, // 2 MB
): string {
    // 1. Pastikan berkas benar-benar diunggah tanpa galat
    if (($infoBerkas['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Unggahan berkas gagal atau kosong.');
    }

    // 2. Periksa batas ukuran berkas secara eksplisit di aplikasi
    if ($infoBerkas['size'] &lt;= 0 || $infoBerkas['size'] &gt; $batasByteMaks) {
        throw new RuntimeException('Ukuran berkas harus antara 1 byte hingga 2 MB.');
    }

    // 3. Periksa tipe MIME sejati dari isi byte berkas menggunakan ekstensi finfo!
    //    (JANGAN PERNAH menggunakan $infoBerkas['type']!)
    $pemeriksaFinfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeSejati = $pemeriksaFinfo-&gt;file($infoBerkas['tmp_name']);

    // Daftar putih (allowlist) MIME yang diizinkan beserta ekstensi resminya:
    $daftarPutihMime = [
        'image/png'       =&gt; 'png',
        'image/webp'      =&gt; 'webp',
        'image/jpeg'      =&gt; 'jpg',
        'application/pdf' =&gt; 'pdf',
    ];

    if ($mimeSejati === false || !isset($daftarPutihMime[$mimeSejati])) {
        throw new RuntimeException(&quot;Tipe berkas tidak diizinkan ({$mimeSejati}).&quot;);
    }

    $ekstensiAman = $daftarPutihMime[$mimeSejati];

    // 4. Hasilkan nama berkas baru yang acak secara kriptografis!
    //    (JANGAN PERNAH memakai $infoBerkas['name'] asli sebagai nama berkas di disk!)
    $namaBerkasBaru = sprintf(
        '%s.%s',
        bin2hex(random_bytes(16)), // 32 karakter heksadesimal acak (mis. 9f8a7b...)
        $ekstensiAman,
    );

    $jalurTujuan = rtrim($direktoriTujuan, '/') . '/' . $namaBerkasBaru;

    // 5. Pindahkan berkas menggunakan move_uploaded_file()
    //    (Fungsi ini memastikan berkas memang berasal dari mekanisme unggahan HTTP POST PHP)
    if (!move_uploaded_file($infoBerkas['tmp_name'], $jalurTujuan)) {
        throw new RuntimeException('Gagal memindahkan berkas ke penyimpanan server.');
    }

    return $namaBerkasBaru;
}</pre>
<h2>4. Menyimpan Berkas di Luar <em>Web Root</em> (<code>public/</code>)</h2>
<p>Di mana sebaiknya <code>$direktoriTujuan</code> berada?</p>
<ul><li><strong>Paling Aman:</strong> Simpan berkas unggahan di dalam folder <strong><code>storage/uploads/</code></strong> yang berada <strong>di luar folder <code>public/</code></strong> (<em>document root</em> server web)! Dengan menaruhnya di luar <code>public/</code>, tidak ada satu pun URL langsung yang dapat mengeksekusi berkas tersebut sebagai skrip PHP. Jika pengguna yang berhak ingin mengunduh atau melihat berkas tersebut, skrip PHP pengontrol (<em>controller</em>) akan memeriksa izin pengguna terlebih dahulu, lalu mengirimkan isi berkas dengan header <code>Content-Type</code> dan <code>Content-Disposition: attachment; filename=&quot;...&quot;</code> (atau <code>inline</code>).</li><li><strong>Jika Terpaksa Berada di Dalam <code>public/uploads/</code>:</strong> Pastikan konfigurasi Nginx di server produksi <strong>memblokir keras eksekusi PHP (<code>location ~* ^/uploads/.*\\.php$ { deny all; }</code>)</strong> di dalam folder unggahan tersebut!</li></ul>
<h2>Latihan Praktik: Layanan Validasi dan Penyimpanan Avatar Profil</h2>
<p>Buatlah berkas <code>UnggahAvatar.php</code>:</p>
<ol><li>Buat fungsi <code>prosesUnggahAvatar(array $berkas): array</code> yang hanya mengizinkan berkas gambar <code>image/png</code>, <code>image/jpeg</code>, dan <code>image/webp</code> dengan ukuran maksimal <code>1 MB</code> (<code>1_048_576</code> byte).</li><li>Gunakan <code>new finfo(FILEINFO_MIME_TYPE)</code> untuk memvalidasi tipe berkas sebenarnya.</li><li>Kembalikan nama berkas baru hasil <code>bin2hex(random_bytes(16))</code> beserta ekstensi amannya dan ukuran berkasnya.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/features.file-upload.php" rel="noopener">Handling file uploads — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/security.filesystem.php" rel="noopener">Filesystem Security — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/function.move-uploaded-file.php" rel="noopener"><code>move_uploaded_file</code> — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/class.finfo.php" rel="noopener">The finfo class — PHP Manual</a></li><li><a href="https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html" rel="noopener">File Upload Cheat Sheet — OWASP</a></li></ul></div>
`,
    perintah: ["public/","$_FILES","$_FILES['bukti']","Content-Type","finfo","shell.php"],
    kuis: [
        {"tanya":"Mengapa memeriksa tipe berkas yang diunggah menggunakan $_FILES['berkas']['type'] === 'image/png' sangat berbahaya dan tidak dapat diandalkan?","opsi":["Karena kunci 'type' tidak tersedia pada PHP 8.","Karena nilai $_FILES['berkas']['type'] diambil langsung dari header HTTP Content-Type bagian multipart yang dikirim oleh klien tanpa diverifikasi oleh PHP, sehingga penyerang dapat dengan mudah mengunggah berkas .php sambil mengirim header Content-Type: image/png.","Karena image/png hanya berlaku untuk berkas berukuran di bawah 10 KB.","Karena $_FILES['berkas']['type'] selalu bernilai kosong."],"benar":1,"penjelasan":"Header Content-Type pada permintaan unggahan sepenuhnya dikendalikan oleh pengirim permintaan. Untuk memeriksa tipe berkas secara akurat di server, gunakan new finfo(FILEINFO_MIME_TYPE) yang menginspeksi magic bytes dari berkas sementara $_FILES['berkas']['tmp_name']."},
        {"tanya":"Mengapa kita harus membuat nama berkas baru yang acak (misalnya dengan bin2hex(random_bytes(16)) . '.' . $ekstensiAman) alih-alih menyimpan berkas menggunakan nama asli dari $_FILES['berkas']['name']?","opsi":["Karena nama berkas asli selalu lebih panjang dari 255 karakter.","Untuk mencegah serangan Path Traversal (seperti ../../index.php), mencegah penimpaan berkas milik pengguna lain yang kebetulan bernama sama, serta mencegah penyelundupan ekstensi ganda atau karakter berbahaya pada sistem berkas server.","Karena fungsi move_uploaded_file() menolak huruf kapital.","Agar ukuran berkas menjadi lebih kecil di diska."],"benar":1,"penjelasan":"Nama berkas asli dari klien adalah masukan yang tidak tepercaya. Jika Anda masih perlu menampilkan nama berkas asli kepada pengguna di halaman antarmuka, simpan nama asli tersebut sebagai teks di kolom tabel basis data (dan cetak dengan htmlspecialchars()), sedangkan berkas fisiknya di diska wajib diberi nama acak yang aman."},
        {"tanya":"Mengapa kita wajib menggunakan fungsi move_uploaded_file($tmpName, $tujuan) dan bukan fungsi rename() atau copy() biasa saat memindahkan berkas dari $_FILES['berkas']['tmp_name']?","opsi":["Karena copy() otomatis menghapus berkas tujuan.","Karena move_uploaded_file() melakukan pemeriksaan keamanan internal untuk memastikan bahwa berkas yang ditunjuk oleh $tmpName memang benar-benar berkas sah yang baru saja diunggah melalui mekanisme HTTP POST PHP, bukan berkas sistem lokal server (seperti /etc/passwd) yang dipalsukan jalurnya.","Karena rename() hanya bekerja di sistem operasi Windows.","Karena move_uploaded_file() otomatis mengompresi gambar menjadi WebP."],"benar":1,"penjelasan":"move_uploaded_file() memverifikasi bahwa berkas sumber benar-benar merupakan uploaded file dari permintaan HTTP saat ini sebelum memindahkannya, sehingga memberikan perlindungan tambahan terhadap manipulasi jalur berkas lokal."}
    ]
},
{
    id: 16,
    kategori: "3 · Web & Keamanan Dasar",
    judul: "Perlindungan Cross-Site Request Forgery (CSRF), random_bytes(), dan Pertahanan Berlapis",
    tingkat: "Lanjut", durasi: "9 mnt",
    tag: ["random_bytes()","GET","SameSite=Lax"],
    ringkas: "Membedah anatomi serangan Cross-Site Request Forgery (CSRF), mengimplementasikan Synchronizer Token Pattern dengan random_bytes() dan hash_equals(), memanfaatkan header Sec-Fetch-Site / Origin, serta melindungi endpoint AJAX/fetch() modern.",
    isi: `
<h2>1. Memahami Anatomi Serangan CSRF secara Mendalam</h2>
<p><strong>Cross-Site Request Forgery (CSRF)</strong> adalah serangan yang memaksa peramban pengguna yang sedang terautentikasi (sudah login) untuk mengirimkan permintaan pengubahan data yang tidak disengaja ke aplikasi web Anda.</p>
<p>Mengapa peramban mau mengirimkan cookie sesi milik situs Anda ketika pemicunya berasal dari situs luar <code>jahat.example</code>? Karena secara bawaan, mekanisme HTTP Cookie menempel pada <strong>domain tujuan permintaan</strong>, bukan domain tempat formulir HTML itu berada:</p>
<pre>1. Korban sudah login di https://kodeloka.example (Memiliki Cookie Sesi aktif)
2. Korban membuka tab baru ke https://kuis-berhadiah.example (Situs milik penyerang)
3. Halaman penyerang diam-diam memuat formulir tersembunyi:
   &lt;form action=&quot;https://kodeloka.example/akun/ganti-surel&quot; method=&quot;POST&quot;&gt;
     &lt;input type=&quot;hidden&quot; name=&quot;surel_baru&quot; value=&quot;penyerang@evil.example&quot;&gt;
   &lt;/form&gt;
   &lt;script&gt;document.forms[0].submit();&lt;/script&gt;
4. Jika /akun/ganti-surel tidak memeriksa token CSRF (dan cookie tidak terlindungi),
   server mengira permintaan itu benar-benar dikirim oleh korban!</pre>
<h3>Aturan Pertama Pencegahan CSRF: Jangan Pernah Mengubah Data pada Permintaan <code>GET</code>!</h3>
<p>Permintaan HTTP <code>GET</code> (dan <code>HEAD</code> / <code>OPTIONS</code>) **wajib bersifat <em>Safe</em> (Hanya Baca / tidak mengubah state di server)<strong>! Jika Anda membuat tautan <code>&lt;a href=&quot;/catatan/hapus?id=5&quot;&gt;Hapus&lt;/a&gt;</code> yang langsung menghapus data lewat metode <code>GET</code>, maka atribut cookie <code>SameSite=Lax</code> sekalipun tidak akan bisa melindungi Anda (karena navigasi tautan tingkat atas <code>GET</code> tetap menyertakan cookie <code>SameSite=Lax</code>; dan pada cookie yang tidak dibatasi <code>SameSite</code>, penyerang cukup memasang <code>&lt;img src=&quot;https://situs-anda.id/catatan/hapus?id=5&quot;&gt;</code>)! Semua aksi yang menambah, mengubah, atau menghapus data </strong>wajib menggunakan metode <code>POST</code>, <code>PUT</code>, <code>PATCH</code>, atau <code>DELETE</code>**.</p>
<h2>2. Pertahanan Utama: <em>Synchronizer Token Pattern</em> (<code>random_bytes</code> + <code>hash_equals</code>)</h2>
<p>Kenapa penyerang di <code>kuis-berhadiah.example</code> bisa mengirimkan formulir ke situs Anda, tetapi <strong>tidak bisa</strong> menyertakan Token CSRF rahasia milik korban? Karena <strong>Same-Origin Policy (SOP)</strong> di peramban melarang keras skrip di <code>kuis-berhadiah.example</code> membaca isi halaman HTML dari <code>kodeloka.example</code>!</p>
<p>Berikut adalah implementasi kelas <code>PelindungCsrf</code> yang lengkap, mendukung rotasi token, dan siap dipakai untuk formulir tradisional maupun permintaan <code>fetch()</code> AJAX:</p>
<pre>&lt;?php

declare(strict_types=1);

namespace Kodeloka\\Keamanan;

use RuntimeException;

final class PelindungCsrf
{
    private const string KUNCI_SESI = '_kodeloka_csrf_token';

    public function ambilToken(): string
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            throw new RuntimeException('Sesi harus aktif sebelum membuat token CSRF.');
        }

        if (empty($_SESSION[self::KUNCI_SESI]) || !is_string($_SESSION[self::KUNCI_SESI])) {
            // 32 byte acak kriptografis = 64 karakter heksadesimal (256-bit entropi)
            $_SESSION[self::KUNCI_SESI] = bin2hex(random_bytes(32));
        }

        return $_SESSION[self::KUNCI_SESI];
    }

    public function rotasiToken(): string
    {
        unset($_SESSION[self::KUNCI_SESI]);
        return $this-&gt;ambilToken();
    }

    /**
     * Memeriksa token CSRF baik dari input form ($_POST['_csrf'])
     * maupun dari header khusus permintaan fetch/AJAX (X-CSRF-Token).
     */
    public function verifikasiPermintaan(): bool
    {
        $tokenSesi = $_SESSION[self::KUNCI_SESI] ?? '';
        if (!is_string($tokenSesi) || $tokenSesi === '') {
            return false;
        }

        // Ambil dari $_POST['_csrf'] atau dari header HTTP 'X-CSRF-Token'
        $tokenMasukan = $_POST['_csrf'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
        if (!is_string($tokenMasukan) || $tokenMasukan === '') {
            return false;
        }

        // Perbandingan waktu-konstan untuk mencegah timing attack
        return hash_equals($tokenSesi, $tokenMasukan);
    }

    public function cetakInputHidden(): string
    {
        $tokenAman = htmlspecialchars($this-&gt;ambilToken(), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        return sprintf('&lt;input type=&quot;hidden&quot; name=&quot;_csrf&quot; value=&quot;%s&quot;&gt;', $tokenAman);
    }
}</pre>
<h3>Bagaimana Mengirimkan Token CSRF pada Permintaan <code>fetch()</code> di JavaScript?</h3>
<p>Untuk halaman yang mengirim data menggunakan <code>fetch()</code> JSON tanpa <code>&lt;form&gt;</code>, sematkan token CSRF di dalam tag <code>&lt;meta name=&quot;csrf-token&quot; content=&quot;&lt;?= e($csrf-&gt;ambilToken()) ?&gt;&quot;&gt;</code> di <code>&lt;head&gt;</code>, lalu baca dan kirimkan melalui header <strong><code>X-CSRF-Token</code></strong>:</p>
<pre>// Di sisi front-end JavaScript:
const tokenCsrf = document.querySelector('meta[name=&quot;csrf-token&quot;]')?.content ?? &quot;&quot;;

const respons = await fetch(&quot;/api/catatan/simpan&quot;, {
  method: &quot;POST&quot;,
  headers: {
    &quot;Content-Type&quot;: &quot;application/json&quot;,
    &quot;X-CSRF-Token&quot;: tokenCsrf
  },
  body: JSON.stringify({ judul: &quot;Belajar Keamanan CSRF&quot; })
});</pre>
<p><em>(Keuntungan tambahan: Situs luar tidak diizinkan oleh peramban untuk menambahkan header kustom <code>X-CSRF-Token</code> pada permintaan lintas-origin tanpa izin preflight CORS!)</em></p>
<h2>3. Pertahanan Berlapis Modern: Memeriksa Header <code>Sec-Fetch-Site</code> dan <code>Origin</code></h2>
<p>Selain Token CSRF dan atribut cookie <code>SameSite=Lax</code>, semua peramban modern kini otomatis mengirimkan header <strong>Fetch Metadata (<code>Sec-Fetch-Site</code>)</strong> yang <strong>tidak dapat diubah oleh kode JavaScript penyerang</strong> (<em>forbidden header name</em>):</p>
<ul><li><code>Sec-Fetch-Site: same-origin</code> (Permintaan berasal dari domain Anda sendiri — <strong>Aman</strong>).</li><li><code>Sec-Fetch-Site: none</code> (Pengguna mengetik langsung di bilah alamat).</li><li><code>Sec-Fetch-Site: cross-site</code> (Permintaan dipicu dari situs luar!).</li></ul>
<p>Anda dapat menambahkan pemeriksaan ringan ini sebagai lapis pertahanan tambahan untuk seluruh permintaan <code>POST</code>/<code>PUT</code>/<code>DELETE</code>:</p>
<pre>&lt;?php

declare(strict_types=1);

function pastikanBukanLintasSitus(): void
{
    $secFetchSite = $_SERVER['HTTP_SEC_FETCH_SITE'] ?? '';

    // Jika peramban modern melaporkan bahwa permintaan POST/DELETE ini berasal dari 'cross-site',
    // langsung tolak dengan 403 Forbidden!
    if ($secFetchSite !== '' &amp;&amp; $secFetchSite !== 'same-origin' &amp;&amp; $secFetchSite !== 'none') {
        http_response_code(403);
        exit('Permintaan lintas situs (Cross-Site) ditolak oleh kebijakan keamanan.');
    }
}</pre>
<h2>Latihan Praktik: Middleware Pemeriksa CSRF dan Fetch Metadata</h2>
<p>Buatlah berkas <code>MiddlewareCsrf.php</code>:</p>
<ol><li>Buat fungsi <code>periksaKeamananMutasi()</code> yang langsung meloloskan metode baca (<code>GET</code>, <code>HEAD</code>, <code>OPTIONS</code>), tetapi untuk metode mutasi (<code>POST</code>, <code>PUT</code>, <code>PATCH</code>, <code>DELETE</code>) memeriksa header <code>HTTP_SEC_FETCH_SITE</code> <strong>sekaligus</strong> memverifikasi token CSRF menggunakan <code>PelindungCsrf::verifikasiPermintaan()</code>.</li><li>Pastikan ketika pengguna berhasil login atau logout, <code>PelindungCsrf::rotasiToken()</code> ikut dipanggil agar token CSRF terikat pada sesi yang baru!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html" rel="noopener">Cross-Site Request Forgery Prevention Cheat Sheet — OWASP</a></li><li><a href="https://www.php.net/manual/en/features.session.security.management.php" rel="noopener">Session Management Basics — PHP Manual</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site" rel="noopener">Fetch Metadata Request Headers (<code>Sec-Fetch-Site</code>) — MDN Web Docs</a></li></ul></div>
`,
    perintah: ["GET","SameSite=Lax","POST","PUT","DELETE","fetch()"],
    kuis: [
        {"tanya":"Mengapa aksi penghapusan data (seperti menghapus akun atau menghapus artikel) tidak boleh diimplementasikan menggunakan permintaan HTTP GET (misalnya <a href=\"/artikel/hapus?id=10\">Hapus</a>), meskipun halaman tersebut sudah memeriksa apakah pengguna sedang login?","opsi":["Karena metode GET tidak dapat mengirimkan angka id.","Karena permintaan GET dianggap sebagai navigasi baca yang aman oleh peramban: cookie dengan SameSite=Lax tetap ikut dikirimkan saat pengguna mengeklik tautan dari situs luar, ekstensi prefetching peramban dapat memicu tautan tersebut secara otomatis di latar belakang, dan (pada cookie yang tidak dibatasi SameSite) tag <img src=\"...\"> di halaman lain dapat memicunya tanpa interaksi pengguna.","Karena metode GET lebih lambat daripada POST.","Karena PDO menolak menjalankan kueri DELETE pada permintaan GET."],"benar":1,"penjelasan":"Dalam spesifikasi HTTP (RFC 9110), metode GET wajib bersifat Safe (tidak mengubah state server). Menggunakan GET untuk operasi penghapusan atau perubahan data membuka celah CSRF yang bahkan tidak dapat ditahan oleh SameSite=Lax pada navigasi tautan tingkat atas."},
        {"tanya":"Bagaimana cara yang paling bersih untuk mengirimkan token anti-CSRF ketika aplikasi front-end mengirimkan data menggunakan fetch() berformat application/json (bukan pengiriman <form> tradisional)?","opsi":["Menaruh token CSRF di dalam URL query string ?csrf=....","Menyematkan token di dalam <meta name=\"csrf-token\" content=\"...\">, lalu membacanya di JavaScript dan mengirimkannya melalui header HTTP kustom seperti X-CSRF-Token (yang kemudian dibaca oleh PHP melalui $_SERVER['HTTP_X_CSRF_TOKEN'] dan diverifikasi dengan hash_equals()).","Mematikan pemeriksaan CSRF untuk semua permintaan POST.","Menyimpan token di dalam nama berkas gambar."],"benar":1,"penjelasan":"Mengirimkan token melalui header HTTP kustom X-CSRF-Token sangat praktis untuk pemanggilan fetch() JSON, tidak mengotori URL maupun struktur body data, dan mendapatkan perlindungan ganda karena header kustom tidak dapat dikirim lintas-origin tanpa izin preflight CORS."},
        {"tanya":"Apa keistimewaan dari header permintaan HTTP Sec-Fetch-Site (seperti Sec-Fetch-Site: same-origin atau Sec-Fetch-Site: cross-site) yang dikirimkan oleh peramban modern?","opsi":["Nilainya dapat diubah secara bebas menggunakan opsi headers di dalam fetch().","Header yang diawali dengan Sec- adalah forbidden header name yang diatur secara eksklusif oleh mesin peramban dan dilarang keras dimodifikasi atau dipalsukan oleh kode JavaScript di halaman web, sehingga sangat tepercaya untuk mendeteksi permintaan lintas situs.","Header tersebut berisi kata sandi pengguna.","Header tersebut hanya dikirim pada koneksi HTTP yang tidak terenkripsi."],"benar":1,"penjelasan":"Spesifikasi Fetch Metadata Request Headers menetapkan awalan Sec- sebagai ruang nama terlarang bagi skrip halaman. Peramban sendirilah yang mengisi nilai same-origin, same-site, atau cross-site berdasarkan hubungan origin halaman pengirim dan tujuan."}
    ]
},
{
    id: 17,
    kategori: "3 · Web & Keamanan Dasar",
    judul: "Keamanan Kata Sandi: password_hash() (Argon2id/Bcrypt), password_verify(), dan Reset Sandi Aman",
    tingkat: "Lanjut", durasi: "9 mnt",
    tag: ["password_hash()","password_verify()","$tokenPolos"],
    ringkas: "Mengamankan kredensial pengguna menggunakan fungsi Key Derivation bawaan PHP (password_hash, password_verify, password_needs_rehash), memahami parameter memori dan waktu pada Argon2id, serta merancang alur Lupa Kata Sandi yang aman.",
    isi: `
<h2>1. Mengapa Penyimpanan Kata Sandi Membutuhkan Algoritma Khusus (Argon2id &amp; Bcrypt)?</h2>
<p>Jika basis data sebuah aplikasi bocor (<em>data breach</em>), kata sandi pengguna adalah aset paling berharga yang diincar penyerang—karena banyak pengguna memakai kata sandi yang sama di berbagai layanan lain.</p>
<p>Algoritma hash kriptografis umum seperti <strong>MD5</strong>, <strong>SHA-1</strong>, atau <strong>SHA-256</strong> dirancang untuk memverifikasi integritas berkas secara <strong>sangat cepat</strong>. Kecepatan itulah yang justru menjadi bencana bagi kata sandi: satu kartu grafis (GPU) konsumen dapat menguji <strong>puluhan miliar tebakan SHA-256 per detik</strong>!</p>
<p>Sebaliknya, algoritma penyimpanan kata sandi modern harus memenuhi tiga syarat:</p>
<ol><li>**Memiliki <em>Cryptographic Salt</em> Acak yang Unik untuk Setiap Pengguna:** Agar dua pengguna yang kebetulan memiliki kata sandi yang sama menghasilkan string hash yang 100% berbeda, serta menggagalkan penggunaan tabel pra-komputasi (<em>Rainbow Tables</em>).</li><li>**Sengaja Dibuat Lambat secara Terukur (<em>Work Factor / Cost</em>):** Membutuhkan waktu sekitar <code>100–350 milidetik</code> untuk satu kali verifikasi—tidak terasa bagi pengguna jujur yang login satu kali, tetapi memperlambat upaya tebakan massal penyerang hingga jutaan kali lipat!</li><li>**Membutuhkan Memori RAM (<em>Memory-Hard</em> pada Argon2id):** Mencegah penyerang memparalelkan ribuan tebakan sekaligus di atas chip GPU/ASIC murah!</li></ol>
<h2>2. Menggunakan <code>password_hash()</code>, <code>password_verify()</code>, dan <code>password_needs_rehash()</code></h2>
<p>PHP memiliki API pengamanan kata sandi bawaan terbaik di kelasnya:</p>
<pre>&lt;?php

declare(strict_types=1);

final class PengelolaKataSandi
{
    private const array OPSI_ARGON2ID = [
        'memory_cost' =&gt; 65536, // 64 MB RAM per perhitungan hash
        'time_cost'   =&gt; 4,     // 4 iterasi putaran
        'threads'     =&gt; 1,
    ];

    public function buatHash(string $kataSandiPolos): string
    {
        if (mb_strlen($kataSandiPolos) &lt; 8) {
            throw new InvalidArgumentException('Kata sandi minimal harus terdiri dari 8 karakter.');
        }

        // Gunakan PASSWORD_ARGON2ID (rekomendasi utama OWASP),
        // dengan fallback otomatis ke PASSWORD_DEFAULT (Bcrypt) jika ekstensi belum tersedia
        if (defined('PASSWORD_ARGON2ID')) {
            return password_hash($kataSandiPolos, PASSWORD_ARGON2ID, self::OPSI_ARGON2ID);
        }

        return password_hash($kataSandiPolos, PASSWORD_DEFAULT, ['cost' =&gt; 12]);
    }

    public function verifikasi(string $kataSandiMasukan, string $hashDariDatabase): bool
    {
        // password_verify() secara otomatis membaca algoritma, parameter cost, dan salt
        // langsung dari dalam string $hashDariDatabase!
        return password_verify($kataSandiMasukan, $hashDariDatabase);
    }

    public function apakahPerluRehash(string $hashDariDatabase): bool
    {
        if (defined('PASSWORD_ARGON2ID')) {
            return password_needs_rehash($hashDariDatabase, PASSWORD_ARGON2ID, self::OPSI_ARGON2ID);
        }

        return password_needs_rehash($hashDariDatabase, PASSWORD_DEFAULT, ['cost' =&gt; 12]);
    }
}</pre>
<h3>Anatomi String Hasil <code>password_hash()</code></h3>
<p>Ketika <code>password_hash('Rahasia!2026', PASSWORD_ARGON2ID)</code> dijalankan, string keluarannya terlihat seperti ini:</p>
<pre>$argon2id$v=19$m=65536,t=4,p=1$c2FsdHUnbmlrMTIzNDU2$9f8e7d6c5b4a...
└───┬───┘ └─┬┘ └──────┬──────┘ └─────────┬────────┘ └──────┬──────┘
Algoritma Versi  Parameter Cost     Salt Acak (Base64)  Hash Akhir</pre>
<p>Karena seluruh parameter dan <em>salt</em> sudah menyatu di dalam string tersebut (panjangnya sekitar 95–100 karakter), <strong>pastikan kolom <code>password_hash</code> di tabel basis data Anda bertipe <code>VARCHAR(255)</code> atau <code>TEXT</code></strong>, dan Anda tidak perlu membuat kolom <code>salt</code> terpisah!</p>
<h2>3. Pertahanan Tambahan: Mencegah Serangan <em>Timing Enumeration</em> Saat Login</h2>
<p>Perhatikan celah halus pada halaman login berikut:</p>
<ul><li>Jika pengguna memasukkan alamat surel yang <strong>terdaftar</strong>, server menjalankan <code>password_verify()</code> yang memakan waktu <strong><code>250 milidetik</code></strong> sebelum menjawab <em>&quot;Surel atau kata sandi salah&quot;</em>.</li><li>Namun jika pengguna memasukkan alamat surel yang <strong>tidak terdaftar</strong>, server langsung menjawab <em>&quot;Surel atau kata sandi salah&quot;</em> dalam waktu <strong><code>2 milidetik</code></strong> (karena <code>password_verify()</code> tidak dijalankan)!</li></ul>
<p>Penyerang dapat mengukur selisih <code>250 ms</code> vs <code>2 ms</code> tersebut untuk mendata alamat surel mana saja yang sudah terdaftar di situs Anda! <strong>Solusinya:</strong> Jika surel tidak ditemukan di database, tetap jalankan <code>password_verify($sandiMasukan, $hashPalsuTetap)</code> terhadap sebuah konstanta hash tiruan (<em>dummy hash</em>) agar waktu respons server selalu seragam!</p>
<pre>&lt;?php

declare(strict_types=1);

// Hash tiruan untuk menyamakan waktu eksekusi ketika surel tidak ditemukan.
// Catatan: pada produksi, buat hash tiruan ini dengan algoritma dan parameter yang SAMA
// dengan hash asli (misalnya hasil password_hash() Argon2id yang disimpan sebagai konstanta);
// contoh Bcrypt di bawah hanya ilustrasi format dan waktunya berbeda dari Argon2id.
const HASH_TIRUAN = '$2y$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW';

function autentikasiPengguna(PDO $pdo, string $surel, string $sandi): ?array
{
    $stmt = $pdo-&gt;prepare('SELECT id, surel, password_hash FROM pengguna WHERE surel = :surel LIMIT 1');
    $stmt-&gt;execute(['surel' =&gt; strtolower(trim($surel))]);
    $pengguna = $stmt-&gt;fetch();

    // Jika pengguna tidak ditemukan, tetap jalankan password_verify terhadap HASH_TIRUAN!
    $hashTarget = is_array($pengguna) ? (string) $pengguna['password_hash'] : HASH_TIRUAN;
    $sandiCocok = password_verify($sandi, $hashTarget);

    if (!is_array($pengguna) || !$sandiCocok) {
        return null;
    }

    return $pengguna;
}</pre>
<h2>4. Merancang Alur &quot;Lupa Kata Sandi&quot; (<em>Password Reset</em>) yang Aman</h2>
<p>Jangan pernah mengirimkan kata sandi baru lewat surel! Ikuti standar keamanan berikut saat membuat fitur <em>Reset Kata Sandi</em>:</p>
<ol><li>Buat token acak satu kali pakai menggunakan <strong><code>$tokenPolos = bin2hex(random_bytes(32));</code></strong>.</li><li><strong>Jangan menyimpan <code>$tokenPolos</code> mentah-mentah di tabel database!</strong> Simpan hasil hash SHA-256-nya (<code>$tokenHash = hash('sha256', $tokenPolos);</code>) beserta waktu kedaluwarsa singkat (misalnya 30 menit: <code>time() + 1800</code>) di database. <em>(Mengapa? Agar jika tabel database bocor dibaca pihak luar, mereka tetap tidak mengetahui <code>$tokenPolos</code> yang aktif untuk mengambil alih akun!).</em></li><li>Kirimkan tautan yang berisi <code>$tokenPolos</code> ke alamat surel pengguna.</li><li>Saat pengguna membuka tautan tersebut dan mengirim kata sandi baru, hitung <code>hash('sha256', $tokenDariUrl)</code>, cari di database yang belum kedaluwarsa, perbarui <code>password_hash</code> pengguna, <strong>langsung hapus token reset tersebut dari database</strong>, dan cabut sesi-sesi lama pengguna!</li></ol>
<h2>Latihan Praktik: Layanan Pembuatan dan Verifikasi Token Reset Kata Sandi</h2>
<p>Buatlah berkas <code>ResetSandiLayanan.php</code>:</p>
<ol><li>Buat metode <code>buatTokenReset(): array</code> yang mengembalikan <code>['token_url' =&gt; $tokenPolos, 'token_db_hash' =&gt; hash('sha256', $tokenPolos), 'kedaluwarsa_pada' =&gt; time() + 1800]</code>.</li><li>Buat metode <code>verifikasiTokenReset(string $tokenDariUrl, string $hashDariDb, int $kedaluwarsaPada): bool</code> yang memeriksa waktu kedaluwarsa terlebih dahulu lalu membandingkan hash menggunakan <code>hash_equals()</code>.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/function.password-hash.php" rel="noopener"><code>password_hash</code> — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/function.password-verify.php" rel="noopener"><code>password_verify</code> — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/function.password-needs-rehash.php" rel="noopener"><code>password_needs_rehash</code> — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/faq.passwords.php" rel="noopener">Password Hashing FAQ — PHP Manual</a></li></ul></div>
`,
    perintah: ["password_verify()","$tokenPolos","password_hash()","password_hash","100–350 milidetik","password_needs_rehash()"],
    kuis: [
        {"tanya":"Mengapa algoritma Argon2id (PASSWORD_ARGON2ID) lebih unggul dibandingkan algoritma hash cepat seperti SHA-256 atau bahkan Bcrypt untuk menyimpan kata sandi?","opsi":["Karena Argon2id menghasilkan string hash yang hanya terdiri dari 8 karakter.","Karena selain sengaja membutuhkan waktu komputasi CPU (time cost), Argon2id juga bersifat memory-hard (mewajibkan alokasi blok memori RAM seperti 64 MB per perhitungan), sehingga sangat tahan terhadap serangan penebakan paralel menggunakan perangkat keras GPU/ASIC khusus.","Karena Argon2id memungkinkan kita mendekripsi hash kembali menjadi kata sandi asli jika pengguna lupa.","Karena Argon2id tidak membutuhkan salt."],"benar":1,"penjelasan":"Keunggulan utama Argon2id (pemenang Password Hashing Competition dan rekomendasi utama OWASP) adalah parameter memory_cost yang memaksa penyerang menyediakan memori RAM besar untuk setiap tebakan paralel, melumpuhkan keunggulan ribuan core kecil pada GPU."},
        {"tanya":"Mengapa pada kolom tabel basis data yang menyimpan hasil password_hash() kita wajib menggunakan tipe VARCHAR(255) atau TEXT, dan tidak boleh membatasinya menjadi CHAR(32) atau VARCHAR(50)?","opsi":["Karena kata sandi pengguna biasanya sepanjang 255 huruf.","Karena string keluaran password_hash() (yang mencakup identifier algoritma, parameter cost, salt, dan hash) memiliki panjang 60 karakter untuk Bcrypt dan sekitar 95–100+ karakter untuk Argon2id; jika kolom terlalu pendek dan memotong ujung string hash, password_verify() akan selalu gagal (false) untuk semua pengguna!","Karena MySQL dan PostgreSQL tidak mendukung VARCHAR(60).","Agar kolom tersebut dapat menyimpan gambar profil sekaligus."],"benar":1,"penjelasan":"Dokumentasi resmi PHP Manual secara tegas merekomendasikan VARCHAR(255) agar hasil password_hash() dari algoritma PASSWORD_ARGON2ID maupun algoritma baru di masa depan tidak pernah terpotong (truncated) oleh basis data."},
        {"tanya":"Saat menyimpan token Reset Kata Sandi (yang dihasilkan dengan bin2hex(random_bytes(32))) ke dalam basis data sambil menunggu pengguna mengeklik tautan di surelnya, mengapa kita cukup menyimpan hash('sha256', $token) di database alih-alih menyimpan $token polosnya?","opsi":["Karena hash('sha256', $token) lebih pendek dari 10 karakter.","Karena jika penyerang berhasil membaca isi tabel database (misalnya lewat celah baca SQL atau cadangan database yang bocor), penyerang tetap tidak dapat menggunakan nilai hash tersebut untuk menyusun URL reset kata sandi yang sah. (Dan karena $token berasal dari random_bytes(32) yang memiliki entropi 256-bit, SHA-256 tidak mungkin ditebak dengan brute-force).","Karena database tidak bisa menyimpan karakter heksadesimal.","Agar token berlaku selamanya tanpa kedaluwarsa."],"benar":1,"penjelasan":"Berbeda dengan kata sandi pilihan manusia yang entropinya rendah (sehingga wajib memakai Argon2id/Bcrypt), token acak dari random_bytes(32) memiliki 256 bit entropi acak murni yang mustahil ditebak secara brute-force. Menyimpan hash SHA-256-nya di database melindungi token aktif dari kebocoran pembacaan tabel."}
    ]
},
{
    id: 18,
    kategori: "3 · Web & Keamanan Dasar",
    judul: "Akses Basis Data Aman dengan PDO, Prepared Statements, dan Transaksi",
    tingkat: "Menengah", durasi: "10 mnt",
    tag: ["ORDER BY"," / ","new PDO(...)"],
    ringkas: "Menghubungkan PHP ke basis data (PostgreSQL, MySQL, SQLite) menggunakan ekstensi PDO dan PDO::connect() (PHP 8.4), menangkal SQL Injection secara mutlak dengan Prepared Statements, serta menjaga konsistensi data dengan transaksi (beginTransaction, commit, rollBack).",
    isi: `
<h2>Mengapa Menggunakan PDO (<em>PHP Data Objects</em>)?</h2>
<p><strong>PDO</strong> adalah lapisan abstraksi akses basis data bawaan PHP yang menyediakan <strong>antarmuka metode yang seragam</strong> untuk berbagai mesin basis data—mulai dari <strong>PostgreSQL</strong>, <strong>MySQL / MariaDB</strong>, hingga <strong>SQLite</strong> dan <strong>SQL Server</strong>.</p>
<p>Sejak <strong>PHP 8.4</strong>, selain konstruktor <code>new PDO(...)</code>, hadir metode pabrik statis <strong><code>PDO::connect($dsn, $user, $password, $options)</code></strong> yang secara cerdas mengembalikan objek subkelas spesifik driver (seperti <code>Pdo\\Pgsql</code>, <code>Pdo\\Mysql</code>, atau <code>Pdo\\Sqlite</code>) apabila Anda membutuhkan fitur khusus dari basis data tersebut!</p>
<h2>1. Membuat Koneksi PDO dengan Opsi Produksi yang Tepat</h2>
<p>Saat membuka koneksi PDO, biasakan mengatur tiga atribut konfigurasi penting ini:</p>
<ol><li><strong><code>PDO::ATTR_ERRMODE =&gt; PDO::ERRMODE_EXCEPTION</code>:</strong> Memastikan PDO selalu melempar <code>PDOException</code> saat terjadi kesalahan SQL <em>(sudah menjadi bawaan sejak PHP 8.0, namun baik ditulis eksplisit)</em>.</li><li><strong><code>PDO::ATTR_DEFAULT_FETCH_MODE =&gt; PDO::FETCH_ASSOC</code>:</strong> Mengembalikan baris hasil kueri sebagai array asosiatif bersih (<code>['id' =&gt; 1, 'judul' =&gt; '...']</code>) tanpa duplikasi indeks angka yang memboroskan memori.</li><li><strong><code>PDO::ATTR_EMULATE_PREPARES =&gt; false</code>:</strong> Memerintahkan PDO untuk menggunakan <strong>Native Prepared Statements</strong> asli milik server basis data (bukan emulasi penggantian string di sisi PHP!).</li></ol>
<pre>&lt;?php

declare(strict_types=1);

function buatKoneksiPdo(string $dsn, ?string $pengguna = null, ?string $sandi = null): PDO
{
    $opsi = [
        PDO::ATTR_ERRMODE            =&gt; PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE =&gt; PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   =&gt; false,
    ];

    // Sejak PHP 8.4, kita dapat menggunakan PDO::connect() (atau new PDO(...) di versi PHP mana pun):
    return PDO::connect($dsn, $pengguna, $sandi, $opsi);
}

// Contoh DSN untuk PostgreSQL:
// $pdo = buatKoneksiPdo('pgsql:host=127.0.0.1;port=5432;dbname=kodeloka', 'app_user', 'rahasia');

// Contoh DSN untuk SQLite (sangat praktis untuk pengembangan dan pengujian!):
$pdo = buatKoneksiPdo('sqlite::memory:');</pre>
<h2>2. Mencegah SQL Injection secara Mutlak dengan <em>Prepared Statements</em></h2>
<p><strong>SQL Injection (SQLi)</strong> terjadi ketika pengembang menyambungkan variabel masukan pengguna langsung ke dalam string kueri SQL:</p>
<pre>// 🚫 SANGAT BERBAHAYA (RENTAN SQL INJECTION!):
// Jika pengguna memasukkan $surel = &quot;' OR '1'='1&quot;, maka seluruh isi tabel pengguna bocor!
// Lebih buruk lagi jika dikombinasikan dengan perintah perusak data.
$hasil = $pdo-&gt;query(&quot;SELECT * FROM pengguna WHERE surel = '{$surel}'&quot;);</pre>
<h3>Bagaimana <em>Prepared Statements</em> Mematikan SQL Injection 100%?</h3>
<p>Ketika Anda menggunakan <strong><code>$pdo-&gt;prepare(...)</code></strong> diikuti <strong><code>$stmt-&gt;execute(...)</code></strong> (dengan <code>ATTR_EMULATE_PREPARES =&gt; false</code>), komunikasi ke server basis data dibagi menjadi <strong>dua paket terpisah</strong>:</p>
<ol><li><strong>Paket 1 (Struktur Perintah SQL):</strong> PHP mengirim cetak biru kueri dengan tanda tanya <code>?</code> atau parameter bernama <code>:surel</code> (<code>SELECT id, nama, surel FROM pengguna WHERE surel = :surel</code>). Server basis data langsung mengompilasi dan mengunci pohon struktur perintah SQL tersebut!</li><li><strong>Paket 2 (Data Parameter Murni):</strong> PHP mengirimkan isi variabel <code>$surel</code> secara terpisah. Karena pohon perintah SQL sudah selesai dikompilasi pada Paket 1, <strong>isi parameter di Paket 2 tidak mungkin lagi mengubah struktur logika SQL</strong>, seberapapun banyaknya tanda kutip <code>'</code> atau kata <code>OR 1=1</code> di dalamnya!</li></ol>
<pre>&lt;?php

declare(strict_types=1);

function cariPenggunaBerdasarkanSurel(PDO $pdo, string $surel): ?array
{
    // 1. Siapkan cetak biru kueri dengan parameter bernama (:surel)
    $stmt = $pdo-&gt;prepare(
        'SELECT id, nama, surel, peran
         FROM pengguna
         WHERE surel = :surel
         LIMIT 1'
    );

    // 2. Jalankan kueri dengan mengirimkan array nilai parameternya secara terpisah
    $stmt-&gt;execute(['surel' =&gt; $surel]);

    // 3. Ambil satu baris hasil (fetch() mengembalikan false jika tidak ditemukan)
    $baris = $stmt-&gt;fetch();

    return $baris !== false ? $baris : null;
}</pre>
<h3>Menyimpan Data Baru dan Mengambil ID Terakhir (<code>lastInsertId</code> / <code>RETURNING</code>)</h3>
<pre>&lt;?php

declare(strict_types=1);

function tambahModulBaru(PDO $pdo, string $slug, string $judul, int $durasiMenit): int
{
    $stmt = $pdo-&gt;prepare(
        'INSERT INTO modul (slug, judul, durasi_menit)
         VALUES (:slug, :judul, :durasi)'
    );

    $stmt-&gt;execute([
        'slug'   =&gt; $slug,
        'judul'  =&gt; $judul,
        'durasi' =&gt; $durasiMenit,
    ]);

    return (int) $pdo-&gt;lastInsertId();
}</pre>
<div class="callout waspada"><div class="callout-judul">⚠️ Bagaimana Jika Nama Kolom <code>ORDER BY</code> Berasal dari Pilihan Pengguna?</div><p>Parameter <em>Prepared Statement</em> (<code>:kolom</code>) hanya boleh digunakan untuk <strong>nilai data</strong>, tidak bisa digunakan untuk menggantikan nama tabel atau nama kolom pada <code>ORDER BY</code>. Jika pengguna memilih urutan kolom dari dropdown, **wajib validasi dengan daftar putih (<em>allowlist</em>) ketat menggunakan ekspresi <code>match</code>**:</p>
<pre>$kolomUrut = match ($inputUrut) {
    'judul'  =&gt; 'judul ASC',
    'durasi' =&gt; 'durasi_menit DESC',
    default  =&gt; 'id ASC',
};
// Aman karena $kolomUrut 100% berasal dari string literal di dalam match kita sendiri!
$sql = &quot;SELECT id, judul, durasi_menit FROM modul ORDER BY {$kolomUrut}&quot;;</pre></div>
<h2>3. Menjaga Konsistensi Data dengan Transaksi Database (<code>ACID</code>)</h2>
<p>Bayangkan sebuah proses pemindahan poin atau pembuatan pesanan yang terdiri dari <strong>dua langkah perubahan tabel</strong>:</p>
<ol><li>Mengurangi stok barang di tabel <code>produk</code>.</li><li>Mencatat baris pesanan baru di tabel <code>pesanan</code>.</li></ol>
<p>Apa yang terjadi jika langkah 1 berhasil dijalankan, tetapi tepat pada langkah 2 listrik server mati atau terjadi galat? Stok barang sudah terlanjur berkurang, padahal pesanan tidak pernah tercatat!</p>
<p>Untuk menjamin kedua langkah tersebut bersifat <strong>Atomik (berhasil semuanya atau batal semuanya)</strong>, bungkus keduanya di dalam <strong>Transaksi PDO</strong> menggunakan <code>beginTransaction()</code>, <code>commit()</code>, dan <code>rollBack()</code> di dalam blok <code>try...catch</code>:</p>
<pre>&lt;?php

declare(strict_types=1);

function prosesPesananBarang(PDO $pdo, int $idProduk, int $idPengguna, int $jumlah): int
{
    // 1. Mulai transaksi (mematikan mode auto-commit sementara)
    $pdo-&gt;beginTransaction();

    try {
        // Langkah A: Kurangi stok hanya jika stok mencukupi
        $stmtStok = $pdo-&gt;prepare(
            'UPDATE produk
             SET stok = stok - :jumlah
             WHERE id = :id_produk AND stok &gt;= :jumlah_minimal'
        );
        // Catatan: dengan ATTR_EMULATE_PREPARES =&gt; false, nama parameter yang sama
        // tidak boleh dipakai dua kali dalam satu kueri, sehingga diberi dua nama berbeda.
        $stmtStok-&gt;execute([
            'jumlah'         =&gt; $jumlah,
            'jumlah_minimal' =&gt; $jumlah,
            'id_produk'      =&gt; $idProduk,
        ]);

        if ($stmtStok-&gt;rowCount() === 0) {
            throw new DomainException('Stok produk tidak mencukupi atau produk tidak ditemukan.');
        }

        // Langkah B: Catat pesanan baru
        $stmtPesanan = $pdo-&gt;prepare(
            'INSERT INTO pesanan (produk_id, pengguna_id, jumlah, waktu_pesan)
             VALUES (:produk_id, :pengguna_id, :jumlah, :waktu)'
        );
        $stmtPesanan-&gt;execute([
            'produk_id'   =&gt; $idProduk,
            'pengguna_id' =&gt; $idPengguna,
            'jumlah'      =&gt; $jumlah,
            'waktu'       =&gt; gmdate('Y-m-d H:i:s'),
        ]);

        $idPesananBaru = (int) $pdo-&gt;lastInsertId();

        // 2. Jika semua langkah sukses tanpa galat, simpan permanen (COMMIT)!
        $pdo-&gt;commit();

        return $idPesananBaru;
    } catch (Throwable $e) {
        // 3. Jika terjadi galat apa pun, batalkan seluruh perubahan sejak beginTransaction()!
        if ($pdo-&gt;inTransaction()) {
            $pdo-&gt;rollBack();
        }
        throw $e;
    }
}</pre>
<h2>Latihan Praktik: Repositori Modul dengan SQLite In-Memory dan Transaksi</h2>
<p>Buatlah berkas <code>latihan-pdo.php</code> dan jalankan dengan <code>php latihan-pdo.php</code>:</p>
<ol><li>Buka koneksi <code>PDO::connect('sqlite::memory:')</code> dengan opsi standar produksi.</li><li>Buat tabel <code>kelas (id INTEGER PRIMARY KEY, slug TEXT UNIQUE, judul TEXT)</code> dan <code>modul (id INTEGER PRIMARY KEY, kelas_id INTEGER, judul TEXT)</code>.</li><li>Buat fungsi <code>simpanKelasBesertaModul(PDO $pdo, string $slug, string $judulKelas, array $daftarJudulModul): void</code> yang menggunakan transaksi <code>beginTransaction()</code> / <code>commit()</code> / <code>rollBack()</code> untuk menyimpan satu kelas beserta seluruh modulnya secara atomik.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/book.pdo.php" rel="noopener">PDO (PHP Data Objects) — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/pdo.connect.php" rel="noopener"><code>PDO::connect</code> — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/pdo.prepare.php" rel="noopener"><code>PDO::prepare</code> — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/pdo.transactions.php" rel="noopener">Transactions and auto-commit — PHP Manual</a></li><li><a href="https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html" rel="noopener">SQL Injection Prevention Cheat Sheet — OWASP</a></li></ul></div>
`,
    perintah: ["ORDER BY"," / ","new PDO(...)","Pdo\\Pgsql","Pdo\\Mysql","Pdo\\Sqlite"],
    kuis: [
        {"tanya":"Mengapa mengatur opsi PDO::ATTR_EMULATE_PREPARES => false sangat disarankan saat membuat koneksi PDO?","opsi":["Agar PDO tidak memerlukan kata sandi basis data.","Agar PDO mengirimkan cetak biru kueri SQL dan data parameter secara terpisah menggunakan fitur Native Prepared Statements asli milik server basis data, alih-alih sekadar merangkai string kueri tiruan di dalam memori PHP.","Agar hasil kueri otomatis diubah menjadi objek JSON.","Agar seluruh tabel otomatis dihapus setelah skrip selesai."],"benar":1,"penjelasan":"Saat emulasi dimatikan (false), server basis data mengompilasi struktur kueri SQL terlebih dahulu secara terpisah dari pengiriman nilai parameter, memberikan perlindungan paling kokoh terhadap SQL Injection sekaligus memastikan tipe data asli dari kolom basis data tetap terjaga."},
        {"tanya":"Dalam sebuah blok transaksi PDO ($pdo->beginTransaction()), apa yang terjadi apabila salah satu kueri di tengah proses melempar exception dan kita menangkapnya di blok catch (Throwable $e) lalu memanggil $pdo->rollBack()?","opsi":["Hanya kueri terakhir yang gagal yang dibatalkan, sementara kueri UPDATE atau INSERT sebelumnya di dalam transaksi tersebut tetap tersimpan di basis data.","Seluruh perubahan data (INSERT, UPDATE, DELETE) yang dilakukan sejak pemanggilan $pdo->beginTransaction() dibatalkan sepenuhnya sehingga basis data kembali ke keadaan semula yang konsisten.","Koneksi basis data terputus secara permanen.","Tabel yang sedang diakses akan terkunci selamanya."],"benar":1,"penjelasan":"Prinsip Atomicity pada transaksi basis data menjamin bahwa seluruh operasi di antara beginTransaction() dan commit() diperlakukan sebagai satu kesatuan utuh: jika rollBack() dipanggil, semua perubahan yang sudah sempat dijalankan di dalam transaksi tersebut ditarik kembali."},
        {"tanya":"Apa nilai kembalian dari $stmt->fetch() ketika kueri SELECT tidak menemukan satu pun baris yang cocok di basis data?","opsi":["Array kosong []","null","false","Melempar PDOException"],"benar":2,"penjelasan":"Metode PDOStatement::fetch() mengembalikan nilai boolean false apabila tidak ada lagi baris data yang dapat diambil (berbeda dengan fetchAll() yang mengembalikan array kosong [] jika tidak ada hasil)."}
    ]
},
{
    id: 19,
    kategori: "4 · Data & Berkas",
    judul: "Sistem Berkas, PHP Streams, dan Pemrosesan Data Besar Hemat Memori dengan Generator (yield)",
    tingkat: "Lanjut", durasi: "9 mnt",
    tag: ["yield","128 MB","fgetcsv()"],
    ringkas: "Membaca dan menulis berkas secara aman dengan penguncian LOCK_EX (berbasis flock()), memanfaatkan aliran PHP Streams (php://temp, php://output), serta memproses jutaan baris data CSV atau kueri database hanya dengan beberapa megabyte RAM menggunakan Generator (yield).",
    isi: `
<h2>1. Operasi Sistem Berkas yang Aman (<code>file_get_contents</code>, <code>file_put_contents</code>, dan <code>flock</code>)</h2>
<p>Untuk berkas konfigurasi atau templat berukuran kecil (di bawah beberapa ratus kilobyte), fungsi <code>file_get_contents()</code> dan <code>file_put_contents()</code> sangat praktis. Namun, ketika menulis ke berkas dari aplikasi web yang melayani banyak permintaan secara bersamaan, gunakan bendera <strong><code>LOCK_EX</code></strong> (<em>Exclusive Lock</em>) agar dua worker PHP-FPM tidak menulis ke berkas yang sama pada mikrodetik yang bersamaan hingga merusak isinya:</p>
<pre>&lt;?php

declare(strict_types=1);

function catatBarisLog(string $jalurBerkas, string $pesan): void
{
    $baris = sprintf(&quot;[%s] %s\\n&quot;, gmdate('Y-m-d\\TH:i:s\\Z'), $pesan);

    // FILE_APPEND menambahkan ke baris paling bawah,
    // LOCK_EX mengunci berkas secara eksklusif selama proses penulisan berlangsung!
    $berhasil = file_put_contents($jalurBerkas, $baris, FILE_APPEND | LOCK_EX);

    if ($berhasil === false) {
        throw new RuntimeException(&quot;Gagal menulis ke berkas log: {$jalurBerkas}&quot;);
    }
}</pre>
<div class="callout info"><p>**🚫 Keamanan Jalur Berkas: Cegah <em>Path Traversal</em> dengan <code>basename()</code> atau <code>realpath()</code>!<strong> Jika pengguna mengirimkan parameter nama berkas yang ingin diunduh (misalnya <code>?berkas=laporan-q1.pdf</code>), </strong>jangan pernah langsung menyambungnya ke <code>file_get_contents('/var/data/' . $_GET['berkas'])</code><strong>! Penyerang dapat mengirim <code>?berkas=../../../etc/passwd</code>! Selalu pangkas informasi direktori dengan </strong><code>basename($input)</code><strong>, atau pastikan hasil </strong><code>realpath($jalurLengkap)</code>** benar-benar diawali (<code>str_starts_with</code>) dengan jalur direktori penyimpanan yang diizinkan!</p></div>
<h2>2. Masalah Memori Saat Membaca Berkas Besar dan Solusi <strong>Generator (<code>yield</code>)</strong></h2>
<p>Bayangkan Anda diminta membuat fitur untuk mengimpor atau mengekspor berkas laporan transaksi <strong><code>transaksi.csv</code> berukuran <code>500 MB</code> (berisi 2 juta baris)</strong>, sementara batas memori tiap worker PHP (<code>memory_limit</code>) di server produksi adalah <strong><code>128 MB</code></strong>.</p>
<ul><li><strong>Cara Buruk (<code>file('transaksi.csv')</code> atau <code>$stmt-&gt;fetchAll()</code>):</strong> PHP mencoba memuat seluruh 2 juta baris sekaligus ke dalam satu <code>array</code> raksasa di RAM. Dalam hitungan detik, memori menembus <code>128 MB</code> dan skrip langsung mati dengan <strong><code>Fatal error: Allowed memory size of 134217728 bytes exhausted</code></strong>!</li><li><strong>Cara Profesional (Membaca Baris demi Baris dengan Generator <code>yield</code>):</strong> Sebuah fungsi yang mengandung kata kunci <strong><code>yield</code></strong> otomatis menjadi <strong>Generator</strong> (mengembalikan objek <code>Generator</code> yang mengimplementasikan <code>Iterator</code>). Ia hanya menahan <strong>SATU baris di memori pada satu waktu</strong>, menyerahkannya ke perulangan <code>foreach</code>, lalu membebaskan memori baris tersebut saat melangkah ke baris berikutnya!</li></ul>
<pre>&lt;?php

declare(strict_types=1);

/**
 * Membaca berkas CSV berukuran berapa pun (bahkan 10 GB!)
 * dengan pemakaian RAM tetap di bawah 1 MB menggunakan Generator (yield).
 *
 * @return Generator&lt;int, array&lt;string, string&gt;&gt;
 */
function bacaCsvHematMemori(string $jalurCsv): Generator
{
    $handle = fopen($jalurCsv, 'rb');
    if ($handle === false) {
        throw new RuntimeException(&quot;Tidak dapat membuka berkas CSV: {$jalurCsv}&quot;);
    }

    try {
        // 1. Baca baris pertama sebagai nama kolom header
        $header = fgetcsv($handle, escape: '');
        if (!is_array($header)) {
            return;
        }

        $nomorBaris = 1;
        // 2. Baca baris demi baris secara streaming
        while (($baris = fgetcsv($handle, escape: '')) !== false) {
            $nomorBaris++;
            if (count($baris) !== count($header)) {
                continue; // Lewati baris kosong/cacat
            }

            // Serahkan satu baris asosiatif ke pemanggil, lalu jeda fungsi ini!
            yield $nomorBaris =&gt; array_combine($header, $baris);
        }
    } finally {
        // Blok finally DIJAMIN menutup berkas meskipun pemanggil melakukan 'break' di tengah foreach!
        fclose($handle);
    }
}

// Cara memakainya sangat bersih seperti array biasa, namun 100% hemat RAM!
foreach (bacaCsvHematMemori('/tmp/data-besar.csv') as $barisKe =&gt; $data) {
    // Proses $data['id'], $data['nominal']...
    if ($barisKe &gt;= 100) {
        break; // Saat break dipanggil, blok 'finally' di dalam generator otomatis menutup berkas!
    }
}</pre>
<div class="callout info"><div class="callout-judul">💡 Catatan Penting PHP 8.4 pada <code>fgetcsv()</code> dan <code>fputcsv()</code></div><p>Sejak <strong>PHP 8.4</strong>, memanggil <code>fgetcsv()</code> atau <code>fputcsv()</code> tanpa menentukan parameter <code>$escape</code> secara eksplisit telah dideprekasi (karena perilaku escape <code>\\</code> lama tidak standar RFC 4180). Selalu berikan argumen bernama <strong><code>escape: ''</code></strong> (string kosong) agar penguraian CSV mematuhi standar RFC 4180 sepenuhnya!</p></div>
<h2>3. Memanfaatkan <em>PHP Streams</em> (<code>php://temp</code> &amp; <code>php://output</code>) untuk Ekspor CSV Tanpa Berkas Sampah</h2>
<p>Ketika pengguna mengeklik tombol <em>&quot;Unduh Laporan CSV&quot;</em>, Anda tidak perlu membuat berkas fisik sementara di folder <code>/tmp/</code> lalu pusing menghapusnya! Gunakan stream bawaan <strong><code>php://output</code></strong> (atau <strong><code>php://temp</code></strong> yang otomatis memakai RAM hingga 2 MB lalu beralih ke berkas sementara tersembunyi jika lebih besar):</p>
<pre>&lt;?php

declare(strict_types=1);

function kirimUnduhanCsv(string $namaBerkas, iterable $barisData): void
{
    header('Content-Type: text/csv; charset=utf-8');
    header(sprintf('Content-Disposition: attachment; filename=&quot;%s&quot;', basename($namaBerkas)));

    $keluaran = fopen('php://output', 'wb');
    if ($keluaran === false) {
        return;
    }

    // Tulis header kolom
    fputcsv($keluaran, ['ID Modul', 'Judul', 'Durasi (Menit)'], escape: '');

    foreach ($barisData as $baris) {
        fputcsv($keluaran, [$baris['id'], $baris['judul'], $baris['durasi']], escape: '');
    }

    fclose($keluaran);
}</pre>
<h2>Latihan Praktik: Pipeline Pengolah Log Server dengan Generator <code>yield</code></h2>
<p>Buatlah berkas <code>analisis-log-generator.php</code>:</p>
<ol><li>Buat fungsi <code>hasilkanSampelLog(int $jumlahBaris): Generator</code> yang menggunakan <code>yield</code> untuk menghasilkan 50.000 baris log simulasi tanpa membuat array di memori.</li><li>Buat fungsi generator penyaring <code>saringLogGalat(iterable $sumberLog): Generator</code> yang menerima iterable dari langkah 1 dan hanya melakukan <code>yield</code> untuk baris yang mengandung kata <code>'ERROR'</code>.</li><li>Hitung total baris <code>'ERROR'</code> dan cetak puncak pemakaian RAM menggunakan <code>memory_get_peak_usage(true)</code> untuk membuktikan betapa kecilnya RAM yang terpakai!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/language.generators.overview.php" rel="noopener">Generators overview — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/function.fgetcsv.php" rel="noopener"><code>fgetcsv</code> — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/function.flock.php" rel="noopener"><code>flock</code> — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/security.filesystem.php" rel="noopener">Filesystem Security — PHP Manual</a></li></ul></div>
`,
    perintah: ["yield","128 MB","fgetcsv()","fputcsv()","php://temp","php://output"],
    kuis: [
        {"tanya":"Mengapa memproses 1 juta baris hasil kueri atau berkas CSV menggunakan fungsi Generator (yield) jauh lebih aman bagi server produksi dibandingkan mengembalikannya sebagai array biasa?","opsi":["Karena Generator otomatis menghapus berkas setelah dibaca.","Karena array mengharuskan seluruh 1 juta baris dialokasikan sekaligus di dalam RAM (yang dapat melampaui memory_limit dan mematikan proses worker), sedangkan Generator hanya menahan satu item di memori pada satu giliran iterasi foreach.","Karena Generator berjalan di dalam kartu grafis (GPU).","Karena array hanya bisa menampung maksimal 1.000 elemen di PHP."],"benar":1,"penjelasan":"Generator menghasilkan nilai satu per satu sesuai permintaan (lazy iteration). Pemakaian memorinya bersifat konstan O(1) terlepas dari apakah data yang diiterasi berjumlah 100 baris atau 100 juta baris."},
        {"tanya":"Di dalam sebuah fungsi Generator yang membuka berkas dengan $handle = fopen(...), mengapa pemanggilan fclose($handle) wajib diletakkan di dalam blok try ... finally yang membungkus perulangan yield?","opsi":["Karena fclose() tidak boleh dipanggil di luar finally.","Agar apabila kode pemanggil menghentikan perulangan foreach lebih awal menggunakan perintah break atau return, blok finally di dalam generator tetap dipanggil secara otomatis oleh PHP untuk menutup pegangan berkas (file descriptor) dengan bersih.","Agar isi berkas otomatis terenkripsi saat ditutup.","Karena yield menghapus variabel $handle."],"benar":1,"penjelasan":"Jika pemanggil keluar dari foreach dengan break sebelum generator mencapai baris paling bawah, kode yang ditulis biasa setelah perulangan while tidak akan pernah tercapai. Namun, saat objek Generator dihancurkan di akhir foreach, PHP menjamin eksekusi blok finally di tempat generator tadi terjeda."},
        {"tanya":"Bagaimana cara mencegah serangan Path Traversal (seperti pengguna mengirim $nama = \"../../config/app.php\") ketika skrip PHP perlu membaca berkas dari dalam direktori /var/app/storage/dokumen/?","opsi":["Mengganti file_get_contents() dengan include().","Mengekstrak hanya komponen nama berkas akhirnya saja dengan basename($nama) serta memverifikasi bahwa jalur absolut hasil realpath($jalurLengkap) tidak bernilai false dan benar-benar diawali (str_starts_with) dengan jalur /var/app/storage/dokumen/.","Menambahkan htmlspecialchars() pada nama berkas.","Mengubah ekstensi berkas menjadi .txt."],"benar":1,"penjelasan":"basename(\"../../config/app.php\") memangkas seluruh navigasi direktori ../ dan hanya menyisakan \"app.php\". Memadukannya dengan pemeriksaan awalan realpath() terhadap direktori dasar penyimpanan menjamin skrip tidak pernah bisa membaca berkas di luar folder yang diizinkan."}
    ]
},
{
    id: 20,
    kategori: "5 · Arsitektur Aplikasi",
    judul: "Arsitektur Aplikasi Modern: Routing, Middleware (PSR-15), dan Dependency Injection (PSR-11)",
    tingkat: "Lanjut", durasi: "9 mnt",
    tag: ["GET /kelas/php","new","new PDO('sqlite::memory:')"],
    ringkas: "Memahami arsitektur internal di balik kerangka kerja PHP modern melalui pola Front Controller, Router, pipa pemrosesan Middleware (PSR-7 & PSR-15), serta Dependency Injection (DI) dan prinsip Inversion of Control agar aplikasi mudah diuji dan dirawat.",
    isi: `
<h2>Mengapa Memahami Arsitektur Ini Membuat Anda Siap Bekerja di Proyek Mana Pun?</h2>
<p>Baik Anda bekerja menggunakan PHP murni, Slim, Symfony, maupun Laravel, seluruh aplikasi web PHP modern di industri dibangun di atas tiga pilar arsitektur yang distandarkan oleh <strong>PHP-FIG</strong>:</p>
<ol><li><strong>Representasi Pesan HTTP (PSR-7) &amp; Pipa Middleware (PSR-15):</strong> Permintaan HTTP mengalir melewati lapisan-lapisan pemeriksaan (seperti autentikasi, proteksi CSRF, pembatasan laju, dan pencatatan log) sebelum tiba di <em>Controller</em>.</li><li><strong>Routing:</strong> Memetakan pasangan metode HTTP + jalur URI (<code>GET /kelas/php</code>) ke penangan (<em>handler/controller</em>) yang tepat.</li><li><strong>Dependency Injection (DI) &amp; Container (PSR-11):</strong> Menyuntikkan objek yang dibutuhkan oleh sebuah kelas melalui konstruktornya, bukan membuat koneksi database atau layanan sendiri di dalam kelas tersebut!</li></ol>
<h2>1. Apa Itu Dependency Injection (DI) dan Mengapa <code>new</code> di Dalam Layanan Berbahaya?</h2>
<p>Perhatikan perbedaan antara kelas yang **terikat kaku (<em>tightly coupled</em>)<strong> dan kelas yang menggunakan </strong>Dependency Injection**:</p>
<pre>&lt;?php

declare(strict_types=1);

// 🚫 BURUK (Tightly Coupled):
// PendaftaranService membuat sendiri koneksi PDO dan pengirim email di dalamnya.
// Akibatnya: Anda TIDAK BISA menguji PendaftaranService tanpa database produksi dan server SMTP nyata!
class PendaftaranServiceBuruk
{
    public function daftar(string $surel): void
    {
        $pdo = new PDO('pgsql:host=db.prod;dbname=utama', 'admin', 'rahasia'); // Terkunci mati!
        // ...
    }
}

// ✅ BENAR (Dependency Injection melalui Constructor + Interface!):
interface PengirimSurelInterface
{
    public function kirim(string $tujuan, string $subjek, string $isi): void;
}

final readonly class PendaftaranService
{
    // Kelas ini TIDAK PEDULI apakah $pdo terhubung ke PostgreSQL produksi atau SQLite in-memory,
    // dan TIDAK PEDULI apakah $pengirimSurel benar-benar mengirim lewat SMTP atau hanya mock pengujian!
    public function __construct(
        private PDO $pdo,
        private PengirimSurelInterface $pengirimSurel,
    ) {}

    public function daftar(string $surel): void
    {
        $stmt = $this-&gt;pdo-&gt;prepare('INSERT INTO peserta (surel) VALUES (:surel)');
        $stmt-&gt;execute(['surel' =&gt; $surel]);

        $this-&gt;pengirimSurel-&gt;kirim($surel, 'Selamat Datang di Kodeloka', 'Pendaftaran berhasil!');
    }
}</pre>
<h3>Keuntungan Besar <em>Dependency Injection</em>:</h3>
<ol><li>**Mudah Diuji (<em>Testable</em>):** Saat menjalankan PHPUnit, Anda cukup menyuntikkan <code>new PDO('sqlite::memory:')</code> dan sebuah kelas <code>PengirimSurelPalsu implements PengirimSurelInterface</code> yang mencatat surel ke dalam array memori tanpa mengirim surel sungguhan!</li><li>**Mudah Diganti (<em>Swappable</em>):** Jika bulan depan perusahaan berpindah penyedia layanan surel, Anda cukup membuat kelas baru yang mengimplementasikan <code>PengirimSurelInterface</code> tanpa mengubah satu huruf pun di dalam <code>PendaftaranService</code>!</li></ol>
<h2>2. Pola Pipa <em>Middleware</em> (Konsep PSR-15)</h2>
<p>Bayangkan <strong>Middleware</strong> seperti lapisan-lapisan kulit bawang yang mengelilingi <em>Controller</em> inti Anda:</p>
<pre>Permintaan HTTP Masuk
   │
   ▼
[ Middleware 1: Pencatat Log &amp; Waktu Eksekusi ]
   │
   ▼
[ Middleware 2: Pemeriksa Sesi &amp; CSRF ]  ──(Jika tidak sah)──&gt; Langsung balas 403 Forbidden!
   │
   ▼
[ Controller Inti: Mengambil Data &amp; Merender Respons ]
   │
   ▼
[ Kembali melewati Middleware 2 -&gt; Middleware 1 (Menambahkan header X-Response-Time) ]
   │
   ▼
Respons HTTP Keluar ke Peramban</pre>
<p>Mari kita lihat betapa sederhananya mengimplementasikan arsitektur <strong>Request</strong>, <strong>Response</strong>, dan <strong>Middleware Pipeline</strong> dalam PHP modern:</p>
<pre>&lt;?php

declare(strict_types=1);

namespace Kodeloka\\Http;

readonly class Request
{
    public function __construct(
        public string $metode,
        public string $jalur,
        public array $query = [],
        public array $body = [],
        public array $header = [],
    ) {}
}

readonly class Response
{
    public function __construct(
        public string $isi,
        public int $status = 200,
        public array $header = ['Content-Type' =&gt; 'text/html; charset=utf-8'],
    ) {}
}

interface MiddlewareInterface
{
    /**
     * @param callable(Request): Response $lanjut
     */
    public function proses(Request $request, callable $lanjut): Response;
}

// Contoh Middleware Pencatat Waktu Eksekusi:
final class WaktuEksekusiMiddleware implements MiddlewareInterface
{
    public function proses(Request $request, callable $lanjut): Response
    {
        $mulai = hrtime(true);

        // Teruskan request ke lapisan berikutnya di dalam pipa
        $respons = $lanjut($request);

        $durasiMs = round((hrtime(true) - $mulai) / 1_000_000, 2);
        $headerBaru = [...$respons-&gt;header, 'X-Waktu-Proses-Ms' =&gt; (string) $durasiMs];

        // Properti readonly publik hanya boleh diubah dari dalam class Response sendiri
        // (clone($respons, [...]) dari luar class akan memicu Error), sehingga kita membuat instans baru:
        return new Response(
            isi: $respons-&gt;isi,
            status: $respons-&gt;status,
            header: $headerBaru,
        );
    }
}</pre>
<h2>3. Merakit <em>Dependency Injection Container</em> (PSR-11) Sederhana</h2>
<p>Agar Anda tidak perlu merangkai <code>new PendaftaranService(new PDO(...), new SmtpMailer(...))</code> berulang kali di setiap rute, kita menggunakan <strong>Service Container</strong> yang menyimpan resep pembuatan objek (<em>factories</em>) dan instans <em>shared/singleton</em>:</p>
<pre>&lt;?php

declare(strict_types=1);

final class Container
{
    /** @var array&lt;string, callable(self): object&gt; */
    private array $resep = [];

    /** @var array&lt;string, object&gt; */
    private array $instansTunggal = [];

    public function daftarkan(string $id, callable $pembuat): void
    {
        $this-&gt;resep[$id] = $pembuat;
    }

    public function ambil(string $id): object
    {
        // Jika sudah pernah dibuat sebelumnya, kembalikan instans yang sama
        if (isset($this-&gt;instansTunggal[$id])) {
            return $this-&gt;instansTunggal[$id];
        }

        if (!isset($this-&gt;resep[$id])) {
            throw new RuntimeException(&quot;Layanan tidak terdaftar di Container: {$id}&quot;);
        }

        $this-&gt;instansTunggal[$id] = ($this-&gt;resep[$id])($this);
        return $this-&gt;instansTunggal[$id];
    }
}</pre>
<div class="callout info"><p>Catatan: <code>Container</code> di atas hanyalah ilustrasi. Standar PSR-11 mensyaratkan class yang mengimplementasikan <code>Psr\\Container\\ContainerInterface</code> dengan metode <code>get(string $id)</code> dan <code>has(string $id)</code>, serta melempar exception yang mengimplementasikan <code>NotFoundExceptionInterface</code> untuk id yang tidak ditemukan. Demikian pula, antarmuka middleware pada contoh sebelumnya adalah penyederhanaan konsep; PSR-15 memakai <code>Psr\\Http\\Server\\MiddlewareInterface::process(ServerRequestInterface, RequestHandlerInterface)</code>.</p></div>
<h2>Latihan Praktik: Membangun Router &amp; Pipa Middleware Mini</h2>
<p>Buatlah berkas <code>pipa-middleware.php</code> dan jalankan dengan <code>php pipa-middleware.php</code>:</p>
<ol><li>Buat <code>OtorisasiMiddleware implements MiddlewareInterface</code> yang memeriksa apakah <code>$request-&gt;header['X-Api-Key'] === 'rahasia-kodeloka'</code> (jika salah, langsung kembalikan <code>new Response('Akses Ditolak', 401)</code> tanpa memanggil <code>$lanjut($request)</code>!).</li><li>Rangkai <code>WaktuEksekusiMiddleware</code> -&gt; <code>OtorisasiMiddleware</code> -&gt; <code>Controller</code> dan uji dengan request yang memiliki kunci API benar maupun salah.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php-fig.org/psr/psr-7/" rel="noopener">PSR-7: HTTP Message Interface — PHP-FIG</a></li><li><a href="https://www.php-fig.org/psr/psr-11/" rel="noopener">PSR-11: Container Interface — PHP-FIG</a></li><li><a href="https://www.php-fig.org/psr/psr-15/" rel="noopener">PSR-15: HTTP Server Request Handlers — PHP-FIG</a></li><li><a href="https://www.php.net/manual/en/language.oop5.basic.php" rel="noopener">Classes and Objects — PHP Manual</a></li></ul></div>
`,
    perintah: ["GET /kelas/php","new","new PDO('sqlite::memory:')","PengirimSurelInterface","PendaftaranService","Container"],
    kuis: [
        {"tanya":"Apa masalah utama apabila sebuah kelas LaporanPesananService memanggil new PDO('pgsql:host=...', ...) secara langsung di dalam metodenya alih-alih menerima objek PDO (atau interface repositori) melalui parameter __construct()?","opsi":["Karena kata kunci new hanya boleh digunakan di dalam public/index.php.","Kelas tersebut menjadi terikat kaku (tightly coupled) pada instans database tertentu, sehingga sulit diuji secara terisolasi dalam pengujian unit dan memaksa pembuatan koneksi database baru yang boros setiap kali metode dipanggil.","Karena PDO tidak dapat disimpan di dalam properti private readonly.","Karena new PDO mematikan autoloader PSR-4."],"benar":1,"penjelasan":"Dependency Injection memindahkan tanggung jawab pembuatan dependensi ke luar kelas (Inversion of Control). Dengan menerima PDO lewat konstruktor, satu koneksi database yang sama dapat dipakai bersama, dan saat pengujian kita dapat menyuntikkan SQLite in-memory dengan mudah."},
        {"tanya":"Dalam arsitektur Middleware Pipeline (seperti standar PSR-15), bagaimana sebuah middleware keamanan (misalnya pemeriksa autentikasi atau pemeriksa CSRF) menghentikan permintaan yang tidak sah agar tidak pernah mencapai Controller?","opsi":["Dengan memanggil $lanjut($request) sebanyak dua kali.","Dengan tidak memanggil fungsi/handler berikutnya ($lanjut($request)) dan langsung mengembalikan objek Response penolakan (seperti status 401 Unauthorized atau 403 Forbidden).","Dengan menghapus berkas Controller dari diska.","Dengan mengubah metode request menjadi GET."],"benar":1,"penjelasan":"Setiap middleware memegang kendali apakah ia akan meneruskan permintaan ke lapisan dalam (return $lanjut($request)) atau melakukan short-circuit (memutus alur lebih awal dengan langsung mengembalikan Response)."},
        {"tanya":"Mengapa fungsi bawaan hrtime(true) (yang mengembalikan waktu monotonik dalam nanodetik) lebih tepat digunakan untuk mengukur durasi waktu eksekusi di dalam middleware dibandingkan fungsi time() atau microtime(true)?","opsi":["Karena time() hanya berjalan di Windows.","Karena hrtime(true) menggunakan jam monotonik beresolusi tinggi milik sistem operasi yang tidak pernah melompat maju atau mundur apabila layanan NTP menyinkronkan ulang jam dinding server di tengah permintaan.","Karena hrtime(true) otomatis mencetak hasilnya ke header HTTP.","Karena microtime(true) sudah dihapus dari PHP 8."],"benar":1,"penjelasan":"Sama seperti performance.now() di JavaScript, hrtime(true) di PHP dirancang khusus untuk pengukuran selisih waktu (benchmarking/profiling) karena berpresisi nanodetik dan kebal terhadap perubahan jam kalender sistem."}
    ]
},
{
    id: 21,
    kategori: "5 · Arsitektur Aplikasi",
    judul: "Struktur Direktori Proyek Siap Produksi, Konfigurasi Lingkungan, dan Logging Terstruktur (PSR-3)",
    tingkat: "Lanjut", durasi: "10 mnt",
    tag: ["src/","Psr\\Log\\LoggerInterface","PencatatLogJson"],
    ringkas: "Mengorganisasikan arsitektur direktori aplikasi PHP yang memisahkan public/ dari kode sumber internal, mengelola konfigurasi via variabel lingkungan (getenv), serta menerapkan pencatatan log terstruktur (structured JSON logging) sesuai standar PSR-3.",
    isi: `
<h2>1. Struktur Direktori Standar Industri: Memisahkan <code>public/</code> dan <code>src/</code></h2>
<p>Mari kita telaah anatomi lengkap proyek aplikasi PHP modern yang siap di-deploy ke server Linux maupun kontainer Docker:</p>
<pre>kodeloka-backend/
├── .env.example               &lt;-- Contoh variabel lingkungan (Aman di-commit ke Git)
├── .gitignore                 &lt;-- Mengabaikan /vendor/, /.env, dan /storage/*.log
├── composer.json              &lt;-- Definisi dependensi &amp; autoloading PSR-4
├── composer.lock              &lt;-- Kunci versi eksak dependensi (WAJIB di-commit ke Git!)
├── phpunit.xml                &lt;-- Konfigurasi pengujian otomatis
├── bin/
│   └── konsol                 &lt;-- Skrip CLI untuk migrasi database atau tugas terjadwal (cron)
├── config/
│   └── aplikasi.php           &lt;-- Membaca getenv() dan memvalidasi tipe konfigurasi
├── public/                    &lt;-- DOCUMENT ROOT NGINX (Satu-satunya folder yang terekspos ke web!)
│   ├── index.php              &lt;-- Front Controller (Pintu masuk tunggal HTTP)
│   └── assets/                &lt;-- Berkas statis CSS, JS, dan gambar
├── src/                       &lt;-- Kode sumber PSR-4 (Namespace: Kodeloka\\)
│   ├── Controller/            &lt;-- Menerima Request, memanggil Service, mengembalikan Response
│   ├── Domain/                &lt;-- Entitas, Value Object Readonly, Enum, dan Domain Exception
│   ├── Service/               &lt;-- Logika bisnis aplikasi
│   ├── Repository/            &lt;-- Kueri database PDO Prepared Statements
│   └── Keamanan/              &lt;-- CSRF, Sesi, dan Middleware
├── storage/                   &lt;-- Penyimpanan lokal di luar web root (log, cache, unggahan privat)
├── templates/                 &lt;-- Berkas tampilan HTML (Views)
└── tests/                     &lt;-- Pengujian otomatis PHPUnit (Unit &amp; Integration Tests)</pre>
<h3>Mengapa Pemisahan Tanggung Jawab (<em>Separation of Concerns</em>) di <code>src/</code> Penting?</h3>
<ul><li>**Controller Tetap Tipis (<em>Thin Controllers</em>):<strong> Controller hanya bertugas membaca dan memvalidasi parameter HTTP, memanggil metode di <code>Service</code>, lalu memilih <code>template</code> atau mengembalikan JSON. Controller </strong>tidak boleh** berisi kueri SQL <code>SELECT/INSERT</code> mentah!</li><li><strong>Domain &amp; Service Bebas dari HTTP:</strong> Kelas di dalam <code>Domain/</code> dan <code>Service/</code> tidak boleh mengakses <code>$_POST</code> atau <code>$_SESSION</code> secara langsung; mereka menerima argumen bertipe jelas (seperti <code>string $surel</code> atau objek DTO) sehingga dapat dipanggil baik dari web (<code>public/index.php</code>), dari perintah terminal (<code>bin/konsol</code>), maupun dari pengujian unit (<code>tests/</code>)!</li></ul>
<h2>2. Membaca dan Memvalidasi Konfigurasi dengan Objek Konfigurasi <code>readonly</code></h2>
<p>Daripada memanggil <code>getenv('DB_DSN')</code> secara tersebar di puluhan berkas (yang berisiko salah ketik nama variabel), bungkus seluruh konfigurasi lingkungan ke dalam sebuah <strong><code>readonly class KonfigurasiAplikasi</code></strong> yang divalidasi satu kali saat aplikasi menyala (<em>fail-fast on startup</em>):</p>
<pre>&lt;?php

declare(strict_types=1);

namespace Kodeloka\\Konfigurasi;

use RuntimeException;

readonly class KonfigurasiAplikasi
{
    public function __construct(
        public string $namaAplikasi,
        public string $lingkungan,
        public bool $modeDebug,
        public string $dbDsn,
        public ?string $dbUser,
        public ?string $dbPass,
    ) {}

    public static function dariEnvironment(): self
    {
        $dsn = getenv('DB_DSN');
        if (!is_string($dsn) || trim($dsn) === '') {
            throw new RuntimeException('Variabel lingkungan wajib DB_DSN belum diatur.');
        }

        $lingkungan = getenv('APP_ENV') ?: 'production';

        return new self(
            namaAplikasi: getenv('APP_NAME') ?: 'Kodeloka',
            lingkungan: $lingkungan,
            // Pastikan mode debug TIDAK PERNAH aktif secara tak sengaja di production!
            modeDebug: $lingkungan !== 'production'
                &amp;&amp; filter_var(getenv('APP_DEBUG') ?: 'false', FILTER_VALIDATE_BOOL),
            dbDsn: $dsn,
            dbUser: getenv('DB_USER') ?: null,
            dbPass: getenv('DB_PASS') ?: null,
        );
    }
}</pre>
<h2>3. Pencatatan Log Terstruktur (<em>Structured Logging</em>) Sesuai Standar PSR-3</h2>
<p>Ketika terjadi masalah di server produksi pada pukul 02.00 dini hari, log adalah mata dan telinga Anda. Jangan menulis log sebagai kalimat bebas yang sulit dicari mesin seperti <code>&quot;User 42 gagal bayar pesanan 99 karena saldo kurang&quot;</code>.</p>
<p>Menurut standar <strong>PSR-3 (<code>Psr\\Log\\LoggerInterface</code>)</strong> (yang diimplementasikan oleh pustaka populer <strong>Monolog</strong>), setiap catatan log terdiri dari tingkat keparahan, pesan, dan array konteks. PSR-3 tidak mengatur format keluaran; format JSON pada poin 3 dan kelas <code>PencatatLogJson</code> di bawah adalah praktik tambahan yang disederhanakan (kelas tersebut tidak mengimplementasikan <code>Psr\\Log\\LoggerInterface</code>):</p>
<ol><li>**Tingkat Keparahan (<em>Log Level</em> — RFC 5424):** <code>debug</code>, <code>info</code>, <code>notice</code>, <code>warning</code>, <code>error</code>, <code>critical</code>, <code>alert</code>, <code>emergency</code>.</li><li><strong>Pesan Statis yang Jelas</strong> disertai <strong>Array Konteks Terstruktur (<code>$context</code>)</strong>!</li><li>**Format JSON Satu Baris (<em>JSON Lines</em>) ke <code>stderr</code> atau Berkas Log:** Memudahkan sistem observabilitas (seperti Grafana Loki, OpenTelemetry, atau Elasticsearch) memfilter berdasarkan <code>context.user_id</code> atau <code>context.order_id</code>!</li></ol>
<pre>&lt;?php

declare(strict_types=1);

namespace Kodeloka\\Observabilitas;

final class PencatatLogJson
{
    public function __construct(
        private readonly string $saluran = 'kodeloka-app',
        private readonly string $targetAliran = 'php://stderr',
    ) {}

    public function info(string $pesan, array $konteks = []): void
    {
        $this-&gt;tulis('INFO', $pesan, $konteks);
    }

    public function warning(string $pesan, array $konteks = []): void
    {
        $this-&gt;tulis('WARNING', $pesan, $konteks);
    }

    public function error(string $pesan, array $konteks = []): void
    {
        $this-&gt;tulis('ERROR', $pesan, $konteks);
    }

    private function tulis(string $tingkat, string $pesan, array $konteks): void
    {
        $rekaman = [
            'timestamp' =&gt; gmdate('Y-m-d\\TH:i:s\\Z'),
            'level'     =&gt; $tingkat,
            'channel'   =&gt; $this-&gt;saluran,
            'message'   =&gt; $pesan,
            'context'   =&gt; $this-&gt;saringDataSensitif($konteks),
        ];

        $barisJson = json_encode($rekaman, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . &quot;\\n&quot;;
        file_put_contents($this-&gt;targetAliran, $barisJson, FILE_APPEND);
    }

    /**
     * WAJIB: Jangan pernah mencatat kata sandi, token sesi, atau kunci API ke dalam berkas log!
     */
    private function saringDataSensitif(array $konteks): array
    {
        $kunciTerlarang = ['password', 'sandi', 'kata_sandi', 'token', 'csrf_token', 'authorization'];
        foreach ($konteks as $kunci =&gt; $nilai) {
            if (in_array(strtolower((string) $kunci), $kunciTerlarang, true)) {
                $konteks[$kunci] = '[DISEMBUNYIKAN]';
            } elseif (is_array($nilai)) {
                $konteks[$kunci] = $this-&gt;saringDataSensitif($nilai);
            }
        }
        return $konteks;
    }
}</pre>
<div class="callout info"><p>**🚫 Aturan Keamanan Log: Sensor Data Rahasia (<em>Redaction</em>) &amp; <code>#[SensitiveParameter]</code>!**</p>
<ol><li>Jangan pernah mencatat kata sandi, nomor kartu kredit, atau token sesi ke dalam log!</li><li>Sejak <strong>PHP 8.2+</strong>, pasang atribut bawaan <strong><code>#[\\SensitiveParameter]</code></strong> pada parameter fungsi yang menerima kata sandi atau kunci rahasia: \`\`<code>php public function hubungkanDb(string $user, #[\\SensitiveParameter] string $password): void </code>\`<code> Dengan </code>#[\\SensitiveParameter]<code>, seandainya fungsi tersebut gagal dan mencetak *stack trace* ke log server, nilai </code>$password<code> di dalam *stack trace* otomatis diganti menjadi </code>Object(SensitiveParameterValue)\` sehingga kata sandi tidak pernah bocor ke berkas log!</li></ol></div>
<h2>Latihan Praktik: Mengamankan Parameter Sensitif dan Mencatat Log JSON</h2>
<p>Buatlah berkas <code>latihan-logging.php</code> dan jalankan dengan <code>php latihan-logging.php</code>:</p>
<ol><li>Buat fungsi <code>prosesAutentikasi(string $surel, #[\\SensitiveParameter] string $sandi)</code> yang sengaja melempar <code>RuntimeException</code> dan amati bahwa di dalam <code>$e-&gt;getTraceAsString()</code>, isi <code>$sandi</code> disembunyikan oleh <code>#[\\SensitiveParameter]</code>.</li><li>Gunakan <code>PencatatLogJson</code> untuk mencatat kejadian login gagal lengkap dengan konteks <code>['surel' =&gt; $surel, 'sandi' =&gt; $sandi, 'ip' =&gt; '127.0.0.1']</code> dan pastikan nilai <code>'sandi'</code> otomatis tersensor menjadi <code>'[DISEMBUNYIKAN]'</code>!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php-fig.org/psr/psr-3/" rel="noopener">PSR-3: Logger Interface — PHP-FIG</a></li><li><a href="https://www.php.net/manual/en/class.sensitiveparameter.php" rel="noopener">The SensitiveParameter attribute — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/security.errors.php" rel="noopener">Error Reporting (Security) — PHP Manual</a></li></ul></div>
`,
    perintah: ["src/","Psr\\Log\\LoggerInterface","PencatatLogJson","#[\\SensitiveParameter]","public/","Service"],
    kuis: [
        {"tanya":"Apa fungsi dari atribut bawaan #[\\SensitiveParameter] (sejak PHP 8.2) ketika dipasang di depan parameter fungsi seperti function login(string $user, #[\\SensitiveParameter] string $password)?","opsi":["Mengenkripsi variabel $password dengan algoritma AES-256 secara otomatis.","Menyembunyikan nilai aktual argumen $password (menggantinya dengan Object(SensitiveParameterValue)) di dalam stack trace dan laporan exception apabila terjadi galat di dalam fungsi tersebut, sehingga kata sandi tidak bocor ke berkas log atau layanan pemantau galat.","Menghapus variabel $password begitu fungsi dimulai.","Memaksa pengguna memasukkan kata sandi minimal 16 karakter."],"benar":1,"penjelasan":"Secara bawaan, stack trace PHP dapat mencantumkan nilai argumen yang dikirimkan ke setiap fungsi dalam rantai pemanggilan. Atribut #[\\SensitiveParameter] menyensor nilai argumen tersebut di dalam backtrace demi mencegah kebocoran rahasia ke sistem log."},
        {"tanya":"Mengapa dalam standar pencatatan log modern (PSR-3), kita dianjurkan menulis $logger->error('Gagal memproses pembayaran', ['order_id' => 105, 'user_id' => 42]) (memisahkan pesan statis dan array konteks) daripada menggabungkan semuanya ke dalam satu string kalimat?","opsi":["Karena fungsi error() tidak mengizinkan tanda kutip ganda.","Agar sistem pengumpul log (seperti Loki, Elasticsearch, atau Datadog) dapat mengindeks setiap pasangan kunci-nilai di dalam context sebagai kolom JSON terstruktur yang mudah dicari dan difilter, sementara pesan utamanya tetap seragam untuk dikelompokkan.","Karena menggabungkan string di PHP membutuhkan ekstensi tambahan.","Agar ukuran berkas log menjadi 0 byte."],"benar":1,"penjelasan":"Structured logging memisahkan template peristiwa (message) dari atribut datanya (context), memungkinkan kueri analitik instan seperti mencari seluruh log dengan context.order_id == 105 di antara jutaan baris log."},
        {"tanya":"Mengapa kelas-kelas di dalam lapisan src/Domain/ dan src/Service/ sebaiknya tidak membaca variabel superglobal $_POST atau $_GET secara langsung?","opsi":["Karena variabel $_POST dan $_GET tidak tersedia di dalam namespace.","Agar logika bisnis inti tidak terikat pada konteks permintaan web HTTP, sehingga kelas yang sama dapat digunakan kembali dengan mudah dari skrip terminal CLI (bin/konsol), pekerja antrean latar belakang, maupun diuji langsung di dalam PHPUnit tanpa perlu memalsukan variabel global.","Karena mengakses $_POST di dalam class memperlambat OPcache.","Karena $_POST hanya bisa dibaca satu kali."],"benar":1,"penjelasan":"Membiarkan hanya lapisan terluar (Controller) yang membaca HTTP Request lalu meneruskan nilai/DTO bersih ke lapisan Service/Domain menjaga arsitektur aplikasi tetap modular, bersih, dan sangat mudah diuji."}
    ]
},
{
    id: 22,
    kategori: "6 · Layanan & Proses",
    judul: "Komunikasi Antar-Layanan (cURL & Persistent Handles PHP 8.5), Caching, dan Rate Limiting",
    tingkat: "Lanjut", durasi: "9 mnt",
    tag: ["file_get_contents('https://...')","curl","CURLOPT_CONNECTTIMEOUT"],
    ringkas: "Memanggil API eksternal dengan aman menggunakan ekstensi cURL dan fitur baru curl_share_init_persistent() di PHP 8.5, mempercepat aplikasi dengan pola Cache-Aside (APCu / Redis), serta melindungi endpoint dari penyalahgunaan dengan Rate Limiting.",
    isi: `
<h2>1. Memanggil API Eksternal Secara Aman dengan cURL</h2>
<p>Ketika aplikasi backend PHP Anda perlu menghubungi layanan eksternal—seperti gateway pembayaran (Midtrans/Xendit), API pengiriman pesan, atau layanan mikro internal lainnya—jangan gunakan <code>file_get_contents('https://...')</code> karena sulit mengatur batas waktu (<em>timeout</em>) koneksi secara presisi dan menangani kode status HTTP.</p>
<p>Gunakan ekstensi <strong><code>curl</code></strong> dengan selalu menetapkan <strong>batas waktu koneksi (<code>CURLOPT_CONNECTTIMEOUT</code>)</strong> dan <strong>batas waktu total (<code>CURLOPT_TIMEOUT</code>)</strong> agar ketika server pihak ketiga sedang lambat, worker PHP-FPM Anda tidak ikut menggantung!</p>
<pre>&lt;?php

declare(strict_types=1);

function kirimRequestJsonApi(string $url, array $payload, int $timeoutDetik = 5): array
{
    $ch = curl_init($url);
    if ($ch === false) {
        throw new RuntimeException('Gagal menginisialisasi cURL.');
    }

    $bodyJson = json_encode($payload, JSON_THROW_ON_ERROR);

    curl_setopt_array($ch, [
        CURLOPT_POST           =&gt; true,
        CURLOPT_POSTFIELDS     =&gt; $bodyJson,
        CURLOPT_RETURNTRANSFER =&gt; true, // Kembalikan respons sebagai string, jangan langsung di-echo!
        CURLOPT_HTTPHEADER     =&gt; [
            'Content-Type: application/json',
            'Accept: application/json',
            'User-Agent: Kodeloka-Backend/1.0',
        ],
        // WAJIB: Batasi waktu jabat tangan koneksi (2 detik) dan total waktu tunggu (5 detik)!
        CURLOPT_CONNECTTIMEOUT =&gt; 2,
        CURLOPT_TIMEOUT        =&gt; $timeoutDetik,
        // WAJIB: Pastikan verifikasi sertifikat TLS/SSL selalu aktif!
        CURLOPT_SSL_VERIFYPEER =&gt; true,
        CURLOPT_SSL_VERIFYHOST =&gt; 2,
    ]);

    $responsMentah = curl_exec($ch);
    $kodeHttp      = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $pesanGalat    = curl_error($ch);

    if ($responsMentah === false) {
        throw new RuntimeException(&quot;Kegagalan jaringan cURL: {$pesanGalat}&quot;);
    }

    if ($kodeHttp &lt; 200 || $kodeHttp &gt;= 300) {
        throw new RuntimeException(&quot;API eksternal mengembalikan status HTTP {$kodeHttp}&quot;);
    }

    $data = json_decode((string) $responsMentah, associative: true, flags: JSON_THROW_ON_ERROR);
    return is_array($data) ? $data : [];
}</pre>
<h3>Fitur Baru di PHP 8.5: <em>Persistent cURL Share Handles</em> (<code>curl_share_init_persistent</code>)</h3>
<p>Ingat bahwa dalam model <em>share-nothing</em> PHP-FPM, koneksi ke API pihak ketiga biasanya ditutup setiap kali satu permintaan PHP selesai, sehingga pada permintaan berikutnya PHP harus melakukan resolusi DNS dan jabat tangan TCP/TLS dari awal lagi.</p>
<p>Sejak <strong>PHP 8.5</strong>, hadir fungsi <strong><code>curl_share_init_persistent()</code></strong> yang memungkinkan worker PHP-FPM <strong>menggunakan kembali cache DNS dan koneksi terbuka yang sudah ada dari permintaan SAPI sebelumnya</strong>:</p>
<pre>&lt;?php

declare(strict_types=1);

// Sejak PHP 8.5: Berbagi cache DNS dan koneksi lintas-permintaan di dalam worker PHP-FPM!
$shareHandle = curl_share_init_persistent([
    CURL_LOCK_DATA_DNS,
    CURL_LOCK_DATA_CONNECT,
]);

$ch = curl_init('https://api.asadinedu.com/v1/status');
curl_setopt($ch, CURLOPT_SHARE, $shareHandle);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$respons = curl_exec($ch);</pre>
<h2>2. Pola <em>Cache-Aside</em> untuk Menghemat Beban Database</h2>
<p>Untuk data yang sering dibaca oleh ribuan pengunjung tetapi jarang berubah (seperti daftar katalog kelas di beranda atau konfigurasi situs), menjalankan kueri SQL ke database pada setiap permintaan adalah pemborosan besar.</p>
<p>Terapkan pola <strong>Cache-Aside</strong> menggunakan penyimpanan memori cepat seperti <strong>Redis</strong> atau <strong>APCu</strong> dilengkapi **TTL (<em>Time-To-Live</em>)**:</p>
<pre>&lt;?php

declare(strict_types=1);

interface CacheInterface
{
    public function ambil(string $kunci): mixed;
    public function simpan(string $kunci, mixed $nilai, int $ttlDetik): void;
    public function hapus(string $kunci): void;
}

/**
 * Fungsi pembantu Cache-Aside (&quot;remember&quot;):
 * 1. Cek apakah data ada di cache. Jika ada (Cache Hit), langsung kembalikan!
 * 2. Jika belum ada (Cache Miss), jalankan $hitungData(), simpan ke cache selama $ttlDetik, lalu kembalikan.
 */
function ambilAtauSimpanCache(
    CacheInterface $cache,
    string $kunci,
    int $ttlDetik,
    callable $hitungData,
): mixed {
    $dariCache = $cache-&gt;ambil($kunci);
    if ($dariCache !== null) {
        return $dariCache; // Cache Hit!
    }

    $dataSegar = $hitungData(); // Cache Miss: ambil dari Database
    $cache-&gt;simpan($kunci, $dataSegar, $ttlDetik);

    return $dataSegar;
}</pre>
<h2>3. Melindungi Endpoint Sensitif dengan <em>Rate Limiting</em> (Pembatasan Laju)</h2>
<p>Endpoint seperti <code>/login</code>, <code>/lupa-sandi</code>, atau <code>/kirim-otp</code> wajib dilindungi dengan <strong>Rate Limiting</strong> agar penyerang tidak dapat mengirim ribuan tebakan kata sandi per menit dari satu alamat IP atau terhadap satu akun:</p>
<pre>&lt;?php

declare(strict_types=1);

final class PembatasLajuSederhana
{
    /**
     * Memeriksa apakah identitas (mis. IP atau surel) sudah melampaui batas maksimal
     * percobaan dalam jendela waktu tertentu.
     */
    public function izinkanAksi(
        CacheInterface $cache,
        string $identitas,
        int $batasMaksimal = 5,
        int $jendelaDetik = 60,
    ): bool {
        $emberWaktu = (int) floor(time() / $jendelaDetik);
        $kunci = sprintf('ratelimit:%s:%d', hash('sha256', $identitas), $emberWaktu);

        $jumlahSaatIni = (int) ($cache-&gt;ambil($kunci) ?? 0);
        if ($jumlahSaatIni &gt;= $batasMaksimal) {
            return false; // Tolak dengan HTTP 429 Too Many Requests!
        }

        $cache-&gt;simpan($kunci, $jumlahSaatIni + 1, $jendelaDetik);
        return true;
    }
}</pre>
<p>Jika <code>izinkanAksi()</code> mengembalikan <code>false</code>, balas dengan kode status <strong><code>429 Too Many Requests</code></strong> dan sertakan header <strong><code>Retry-After: 60</code></strong>.</p>
<h2>Latihan Praktik: Implementasi Cache Memori dan Pembatas Laju Login</h2>
<p>Buatlah berkas <code>latihan-cache-ratelimit.php</code>:</p>
<ol><li>Buat <code>class CacheMemori implements CacheInterface</code> yang menyimpan data beserta waktu kedaluwarsanya (<code>time() + $ttlDetik</code>) di dalam array privat.</li><li>Uji fungsi <code>ambilAtauSimpanCache()</code> untuk membuktikan bahwa kueri mahal hanya dijalankan satu kali pada pemanggilan pertama.</li><li>Uji <code>PembatasLajuSederhana</code> dengan melakukan 6 percobaan berturut-turut (batas maksimal 5) dan pastikan percobaan ke-6 ditolak!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/releases/8.5/en.php" rel="noopener">PHP 8.5 Release Announcement (Persistent cURL Share Handles) — PHP.net</a></li><li><a href="https://www.php.net/manual/en/function.curl-share-init-persistent.php" rel="noopener"><code>curl_share_init_persistent</code> — PHP Manual</a></li><li><a href="https://wiki.php.net/rfc/curl_share_persistence_improvement" rel="noopener">RFC: cURL share handle persistence improvement — PHP Wiki</a></li><li><a href="https://www.php.net/manual/en/book.curl.php" rel="noopener">cURL — PHP Manual</a></li><li><a href="https://www.rfc-editor.org/rfc/rfc6585" rel="noopener">RFC 6585: Additional HTTP Status Codes (429) — IETF</a></li></ul></div>
`,
    perintah: ["file_get_contents('https://...')","curl","CURLOPT_CONNECTTIMEOUT","CURLOPT_TIMEOUT","curl_share_init_persistent","curl_share_init_persistent()"],
    kuis: [
        {"tanya":"Mengapa saat memanggil API pihak ketiga menggunakan cURL dari dalam aplikasi web PHP, Anda wajib mengatur CURLOPT_CONNECTTIMEOUT dan CURLOPT_TIMEOUT ke nilai yang wajar (misalnya 2 hingga 5 detik)?","opsi":["Agar cURL otomatis mengompresi data JSON.","Agar apabila server pihak ketiga mengalami gangguan dan tidak merespons, proses worker PHP-FPM Anda tidak ikut menggantung terlalu lama hingga seluruh slot pm.max_children habis terpakai dan menyebabkan situs Anda sendiri ikut lumpuh (cascading failure).","Karena tanpa CURLOPT_TIMEOUT, fungsi curl_exec() tidak dapat dijalankan.","Agar sertifikat SSL tidak diperiksa."],"benar":1,"penjelasan":"Jumlah worker PHP-FPM terbatas. Jika setiap permintaan pengguna menunggu API pihak ketiga yang macet selama 60 detik, seluruh worker akan terkunci hanya dalam beberapa detik. Menetapkan batas waktu pendek memastikan aplikasi gagal secara cepat (fail-fast) dan tetap responsif."},
        {"tanya":"Apa manfaat fungsi baru curl_share_init_persistent() yang diperkenalkan di PHP 8.5?","opsi":["Menyimpan hasil respons JSON ke dalam berkas .txt secara permanen.","Memungkinkan handle berbagi cURL (seperti cache DNS CURL_LOCK_DATA_DNS dan pool koneksi CURL_LOCK_DATA_CONNECT) bertahan melintasi beberapa permintaan PHP di dalam proses worker yang sama, sehingga menghemat biaya jabat tangan TCP/TLS berulang ke host API yang sama.","Mengizinkan cURL berjalan tanpa ekstensi curl.","Membagikan koneksi cURL ke peramban pengguna."],"benar":1,"penjelasan":"Berbeda dengan curl_share_init() biasa yang dihancurkan di akhir setiap request PHP, curl_share_init_persistent() di PHP 8.5 mempertahankan koneksi dan cache DNS di antara request pada proses SAPI worker yang sama."},
        {"tanya":"Kode status HTTP standar berapakah yang harus dikirimkan oleh server ketika seorang klien melampaui batas frekuensi permintaan (Rate Limit) yang diizinkan?","opsi":["400 Bad Request","403 Forbidden","429 Too Many Requests (disertai header Retry-After)","503 Service Unavailable"],"benar":2,"penjelasan":"Kode status HTTP 429 Too Many Requests (RFC 6585) secara spesifik menunjukkan bahwa pengguna telah mengirimkan terlalu banyak permintaan dalam rentang waktu tertentu (rate limiting)."}
    ]
},
{
    id: 23,
    kategori: "7 · Kualitas & Produksi",
    judul: "Pengujian Otomatis (Unit & Integration Testing) dengan PHPUnit 12",
    tingkat: "Lanjut", durasi: "10 mnt",
    tag: ["#[Test]","sqlite::memory:","vendor/bin/phpunit"],
    ringkas: "Membangun suite pengujian otomatis kelas industri menggunakan PHPUnit 12, menguasai atribut #[Test] dan #[DataProvider], menggunakan Test Doubles (createStub vs createMock), serta menguji repositori basis data secara terisolasi dengan SQLite in-memory.",
    isi: `
<h2>Mengapa Pengujian Otomatis Adalah Syarat Mutlak Kode Siap Kerja?</h2>
<p>Bayangkan Anda mengubah satu baris rumus perhitungan pajak atau memperbarui kueri SQL di proyek yang memiliki 50 fitur. Tanpa pengujian otomatis, Anda tidak akan pernah yakin apakah perubahan tersebut diam-diam merusak fitur lain (<em>regression bug</em>).</p>
<p>Dengan <strong>PHPUnit 12</strong>, seluruh logika domain, layanan, dan kueri repositori dapat diverifikasi secara otomatis dalam hitungan milidetik setiap kali Anda menjalankan <code>vendor/bin/phpunit</code> atau setiap kali kode di-<em>push</em> ke GitHub Actions!</p>
<div class="callout info"><p>Catatan versi: per Oktober 2026 PHPUnit 13 (membutuhkan PHP 8.4+) sudah dirilis. PHPUnit 12 (membutuhkan PHP 8.3+) masih mendapat perbaikan bug sampai 5 Februari 2027, dan contoh di pelajaran ini juga berlaku untuk PHPUnit 13.</p></div>
<h2>1. Anatomi Test Case Modern di PHPUnit 12 (<code>#[Test]</code> &amp; <code>#[DataProvider]</code>)</h2>
<p>Di PHPUnit modern (versi 10, 11, dan <strong>PHPUnit 12</strong>), kita menggunakan atribut asli PHP 8 dari namespace <code>PHPUnit\\Framework\\Attributes\\</code>:</p>
<pre>&lt;?php

declare(strict_types=1);

namespace Kodeloka\\Tests\\Domain;

use InvalidArgumentException;
use PHPUnit\\Framework\\Attributes\\CoversClass;
use PHPUnit\\Framework\\Attributes\\DataProvider;
use PHPUnit\\Framework\\Attributes\\Test;
use PHPUnit\\Framework\\TestCase;

final class KalkulatorDiskon
{
    public function hitungHargaAkhir(int $hargaAsli, int $persenDiskon): int
    {
        if ($hargaAsli &lt; 0) {
            throw new InvalidArgumentException('Harga asli tidak boleh negatif.');
        }
        if ($persenDiskon &lt; 0 || $persenDiskon &gt; 100) {
            throw new InvalidArgumentException('Persentase diskon harus antara 0 hingga 100.');
        }

        $potongan = (int) round($hargaAsli * ($persenDiskon / 100));
        return $hargaAsli - $potongan;
    }
}

#[CoversClass(KalkulatorDiskon::class)]
final class KalkulatorDiskonTest extends TestCase
{
    /**
     * Metode DataProvider wajib bersifat public static dan mengembalikan array/iterable
     * berisi kumpulan skenario uji [argumen1, argumen2, ..., ekspektasi].
     */
    public static function skenarioDiskonValid(): array
    {
        return [
            'tanpa diskon (0%)'      =&gt; [100_000, 0, 100_000],
            'diskon normal (20%)'    =&gt; [100_000, 20, 80_000],
            'diskon penuh (100%)'    =&gt; [100_000, 100, 0],
            'harga nol tetap nol'    =&gt; [0, 50, 0],
        ];
    }

    #[Test]
    #[DataProvider('skenarioDiskonValid')]
    public function menghitungHargaAkhirDenganAkurat(
        int $hargaAsli,
        int $persenDiskon,
        int $ekspektasiAkhir,
    ): void {
        // 1. Arrange
        $kalkulator = new KalkulatorDiskon();

        // 2. Act
        $hasil = $kalkulator-&gt;hitungHargaAkhir($hargaAsli, $persenDiskon);

        // 3. Assert (Selalu gunakan assertSame untuk pemeriksaan tipe &amp; nilai ketat ===)
        $this-&gt;assertSame($ekspektasiAkhir, $hasil);
    }

    #[Test]
    public function menolakPersentaseDiskonDiAtasSeratusPersen(): void
    {
        $kalkulator = new KalkulatorDiskon();

        // Pasang ekspektasi exception SEBELUM memanggil metode yang diuji!
        $this-&gt;expectException(InvalidArgumentException::class);
        $this-&gt;expectExceptionMessage('antara 0 hingga 100');

        $kalkulator-&gt;hitungHargaAkhir(100_000, 150);
    }
}</pre>
<h2>2. Memahami <em>Test Doubles</em>: Kapan Memakai <code>createStub()</code> vs <code>createMock()</code>?</h2>
<p>Saat menguji sebuah kelas layanan (misalnya <code>PendaftaranService</code> yang membutuhkan <code>PengirimSurelInterface</code>), kita tidak ingin pengujian unit benar-benar mengirim surel lewat jaringan internet. PHPUnit menyediakan dua alat pemalsu objek (<em>Test Doubles</em>) yang memiliki perbedaan peran sangat jelas:</p>
<ol><li><strong><code>$this-&gt;createStub(Interface::class)</code> (Stub — Mengatur Nilai Kembalian):</strong> Gunakan <strong>Stub</strong> ketika Anda hanya ingin menyuplai objek tiruan yang mengembalikan nilai tertentu (misalnya nilai kurs mata uang atau data konfigurasi), tanpa peduli berapa kali metode tersebut dipanggil.</li><li><strong><code>$this-&gt;createMock(Interface::class)</code> (Mock — Memverifikasi Interaksi/Perilaku):</strong> Gunakan <strong>Mock</strong> ketika Anda ingin <strong>memastikan bahwa suatu metode benar-benar dipanggil</strong> dengan argumen tertentu (misalnya memastikan <code>$pengirimSurel-&gt;kirim(...)</code> benar-benar dipanggil tepat <strong>satu kali</strong> (<code>$this-&gt;once()</code>) dengan alamat surel peserta yang tepat!).</li></ol>
<pre>&lt;?php

declare(strict_types=1);

namespace Kodeloka\\Tests\\Service;

use PHPUnit\\Framework\\Attributes\\Test;
use PHPUnit\\Framework\\TestCase;

interface GerbangPembayaranInterface
{
    public function tagih(int $nominal): bool;
}

interface PengirimNotifikasiInterface
{
    public function kirimKonfirmasi(string $surel, int $nominal): void;
}

final readonly class PembayaranService
{
    public function __construct(
        private GerbangPembayaranInterface $gerbang,
        private PengirimNotifikasiInterface $notifikasi,
    ) {}

    public function proses(string $surel, int $nominal): bool
    {
        if (!$this-&gt;gerbang-&gt;tagih($nominal)) {
            return false;
        }

        $this-&gt;notifikasi-&gt;kirimKonfirmasi($surel, $nominal);
        return true;
    }
}

final class PembayaranServiceTest extends TestCase
{
    #[Test]
    public function mengirimNotifikasiKetikaPenagihanBerhasil(): void
    {
        // 1. Stub: Kita hanya mengatur agar tagih() mengembalikan true
        $gerbangStub = $this-&gt;createStub(GerbangPembayaranInterface::class);
        $gerbangStub-&gt;method('tagih')-&gt;willReturn(true);

        // 2. Mock: Kita memverifikasi bahwa kirimKonfirmasi() WAJIB dipanggil tepat 1 kali
        //    dengan argumen ('nadia@asadinedu.com', 150000)!
        $notifikasiMock = $this-&gt;createMock(PengirimNotifikasiInterface::class);
        $notifikasiMock-&gt;expects($this-&gt;once())
            -&gt;method('kirimKonfirmasi')
            -&gt;with(
                $this-&gt;identicalTo('nadia@asadinedu.com'),
                $this-&gt;identicalTo(150_000),
            );

        $layanan = new PembayaranService($gerbangStub, $notifikasiMock);
        $berhasil = $layanan-&gt;proses('nadia@asadinedu.com', 150_000);

        $this-&gt;assertTrue($berhasil);
    }
}</pre>
<h2>3. Pengujian Integrasi Repositori Database dengan SQLite <em>In-Memory</em> (<code>setUp</code>)</h2>
<p>Untuk menguji kelas <code>Repository</code> yang berisi kueri SQL PDO, memalsukan PDO dengan <em>Mock</em> adalah ide yang buruk karena tidak menguji apakah sintaks SQL Anda benar!</p>
<p>Cara terbaik dan tercepat adalah menggunakan basis data <strong>SQLite In-Memory (<code>sqlite::memory:</code>)</strong> yang dibuat baru di dalam metode siklus hidup <strong><code>protected function setUp(): void</code></strong>. Karena database dibuat baru di RAM sebelum setiap satu metode tes berjalan dan langsung hilang saat metode tes selesai, setiap pengujian <strong>100% terisolasi, tidak meninggalkan data kotor, dan selesai dalam waktu kurang dari 5 milidetik</strong>!</p>
<pre>&lt;?php

declare(strict_types=1);

namespace Kodeloka\\Tests\\Repository;

use PDO;
use PHPUnit\\Framework\\Attributes\\Test;
use PHPUnit\\Framework\\TestCase;

final class ModulRepositoryTest extends TestCase
{
    private PDO $pdo;

    protected function setUp(): void
    {
        // Dijalankan otomatis sebelum SETIAP satu metode #[Test] dimulai!
        $this-&gt;pdo = new PDO('sqlite::memory:', null, null, [
            PDO::ATTR_ERRMODE            =&gt; PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE =&gt; PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   =&gt; false,
        ]);

        $this-&gt;pdo-&gt;exec(
            'CREATE TABLE modul (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT NOT NULL UNIQUE,
                judul TEXT NOT NULL
            )'
        );
    }

    #[Test]
    public function menyimpanDanMengambilModulBerdasarkanSlug(): void
    {
        $stmt = $this-&gt;pdo-&gt;prepare('INSERT INTO modul (slug, judul) VALUES (:slug, :judul)');
        $stmt-&gt;execute(['slug' =&gt; '01-pengantar', 'judul' =&gt; 'Pengantar PHP']);

        $cari = $this-&gt;pdo-&gt;prepare('SELECT slug, judul FROM modul WHERE slug = :slug');
        $cari-&gt;execute(['slug' =&gt; '01-pengantar']);
        $hasil = $cari-&gt;fetch();

        $this-&gt;assertSame([
            'slug'  =&gt; '01-pengantar',
            'judul' =&gt; 'Pengantar PHP',
        ], $hasil);
    }
}</pre>
<h2>Latihan Praktik: Menulis Suite Pengujian Lengkap untuk <code>CatatanRepository</code></h2>
<p>Buatlah berkas <code>CatatanRepositoryTest.php</code>:</p>
<ol><li>Siapkan koneksi <code>sqlite::memory:</code> di dalam <code>setUp()</code>.</li><li>Tulis 3 metode <code>#[Test]</code>: menguji penambahan catatan yang valid, menguji penghapusan catatan berdasarkan ID, dan menguji bahwa upaya menyisipkan judul yang kurang dari 3 karakter melempar <code>InvalidArgumentException</code> tanpa menambah baris ke tabel database.</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://docs.phpunit.de/en/12.5/writing-tests-for-phpunit.html" rel="noopener">Writing Tests for PHPUnit — PHPUnit 12.5 Manual</a></li><li><a href="https://docs.phpunit.de/en/12.5/organizing-tests.html" rel="noopener">Organizing Tests — PHPUnit 12.5 Manual</a></li><li><a href="https://docs.phpunit.de/en/12.5/test-doubles.html" rel="noopener">Test Doubles — PHPUnit 12.5 Manual</a></li><li><a href="https://phpunit.de/supported-versions.html" rel="noopener">Supported Versions of PHPUnit</a></li></ul></div>
`,
    perintah: ["#[Test]","sqlite::memory:","vendor/bin/phpunit","#[DataProvider]","PHPUnit\\Framework\\Attributes\\","createStub()"],
    kuis: [
        {"tanya":"Apa perbedaan penggunaan antara $this->createStub(Kelas::class) dan $this->createMock(Kelas::class) di dalam PHPUnit 12?","opsi":["createStub() hanya bisa digunakan untuk class abstrak, sedangkan createMock() untuk interface.","createStub() digunakan untuk membuat objek pengganti yang hanya mengonfigurasi nilai kembalian metode (indirect inputs), sedangkan createMock() digunakan ketika pengujian perlu memverifikasi ekspektasi perilaku (behavior verification seperti $this->once() dan ->with(...)) bahwa suatu metode benar-benar dipanggil.","createMock() terhubung ke database asli, sedangkan createStub() tidak.","Keduanya tidak memiliki perbedaan sama sekali."],"benar":1,"penjelasan":"Dokumentasi resmi PHPUnit 12 menekankan pemisahan tegas antara Stubs (menggantikan dependensi untuk menyuplai nilai kembalian tanpa expects()) dan Mocks (memasang ekspektasi bahwa metode pada dependensi dipanggil dengan cara tertentu)."},
        {"tanya":"Kapan metode siklus hidup protected function setUp(): void di dalam kelas turunan PHPUnit\\Framework\\TestCase dijalankan oleh PHPUnit?","opsi":["Hanya satu kali saja di awal sebelum seluruh berkas pengujian dimulai.","Dijalankan berulang kali tepat sebelum setiap satu metode pengujian (#[Test]) dieksekusi, sehingga setiap metode pengujian mendapatkan instans objek dan kondisi awal yang segar serta terisolasi dari metode pengujian lainnya.","Hanya ketika ada metode pengujian yang gagal.","Di akhir setelah seluruh pengujian selesai."],"benar":1,"penjelasan":"setUp() dijalankan sebelum setiap satu metode tes individual, memastikan tidak ada perubahan state dari tes A yang membocori atau memengaruhi hasil tes B (test isolation)."},
        {"tanya":"Mengapa metode penyedia data untuk atribut #[DataProvider('namaMetode')] di PHPUnit modern wajib dideklarasikan sebagai public static function?","opsi":["Agar metode tersebut tidak bisa menerima parameter.","Karena PHPUnit memanggil metode DataProvider pada tahap pengumpulan dan pembangunan daftar skenario pengujian (test suite discovery phase), yaitu sebelum instans objek kelas tes dibuat untuk menjalankan masing-masing skenario.","Karena PHP 8 melarang metode non-statis mengembalikan array.","Agar hasil kembaliannya otomatis disimpan ke localStorage."],"benar":1,"penjelasan":"Sejak PHPUnit 10+, seluruh metode DataProvider wajib bersifat public static karena dievaluasi saat pembangunan pohon pengujian sebelum instans TestCase individual diciptakan."}
    ]
},
{
    id: 24,
    kategori: "7 · Kualitas & Produksi",
    judul: "Menyajikan Aplikasi PHP di Produksi dengan Nginx, PHP-FPM, dan OPcache",
    tingkat: "Lanjut", durasi: "10 mnt",
    tag: ["pm.max_children",".php","php.ini"],
    ringkas: "Merancang arsitektur server produksi menggunakan Nginx + PHP-FPM melalui soket FastCGI, menghitung kapasitas worker pool (pm.max_children), mengoptimalkan kinerja dengan OPcache, serta mengamankan konfigurasi php.ini produksi.",
    isi: `
<h2>1. Arsitektur Produksi: Mengapa Nginx Dipasangkan dengan PHP-FPM?</h2>
<p>Di komputer lokal, kita bisa menjalankan <code>php -S 127.0.0.1:8000 -t public</code>. Namun, server bawaan CLI tersebut bersifat <em>single-process</em> (hanya memproses satu permintaan pada satu waktu) dan tidak dirancang untuk menghadapi ribuan koneksi internet publik.</p>
<p>Di lingkungan produksi, standar emas industri adalah memasangkan <strong>Nginx</strong> di baris depan dengan **PHP-FPM (<em>FastCGI Process Manager</em>)** di belakangnya:</p>
<pre>                   Internet Publik (HTTPS :443)
                                │
                                ▼
+---------------------------------------------------------------+
| NGINX (Reverse Proxy &amp; Server Aset Statis)                    |
|  ├─ Jika permintaan adalah /assets/style.css atau logo.webp:  |
|  │    └─&gt; Langsung disajikan oleh Nginx dengan sangat cepat!  |
|  │                                                            |
|  └─ Jika permintaan adalah rute aplikasi -&gt; /public/index.php:|
|       └─&gt; Diteruskan lewat protokol FastCGI (Unix Socket)     |
+-------------------------------┬-------------------------------+
                                │  /run/php/php8.5-fpm.sock
                                ▼
+---------------------------------------------------------------+
| PHP-FPM Master Process                                        |
|  ├── [Memori Bersama OPcache: Menyimpan Bytecode Terkompilasi]|
|  ├── Worker PHP #1 ──&gt; Menjalankan index.php untuk Pengguna A |
|  ├── Worker PHP #2 ──&gt; Menjalankan index.php untuk Pengguna B |
|  └── Worker PHP #N ──&gt; Siaga menerima permintaan berikutnya   |
+---------------------------------------------------------------+</pre>
<h2>2. Konfigurasi Nginx yang Aman untuk Front Controller PHP-FPM</h2>
<p>Berikut adalah konfigurasi blok <code>server</code> Nginx produksi yang mengarahkan semua rute ke <code>public/index.php</code> sekaligus menutup celah eksekusi berkas <code>.php</code> liar:</p>
<pre>server {
    listen 80;
    server_name kodeloka-app.example.com;

    # 1. Hanya arahkan root ke sub-direktori 'public/'!
    root /var/www/kodeloka-app/public;
    index index.php;

    # Sembunyikan versi Nginx di header respons
    server_tokens off;

    # 2. Blokir akses ke seluruh berkas tersembunyi (seperti .git atau .env jika salah taruh)
    location ~ /\\.(?!well-known).* {
        deny all;
    }

    # 3. Semua rute aplikasi diarahkan ke Front Controller index.php
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # 4. Hanya izinkan eksekusi tepat pada /index.php (paling aman untuk arsitektur Front Controller!)
    location = /index.php {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        fastcgi_pass unix:/run/php/php8.5-fpm.sock;
        fastcgi_read_timeout 30s;
    }

    # 5. Tolak permintaan langsung ke berkas .php lainnya di dalam public/
    location ~ \\.php$ {
        return 404;
    }
}</pre>
<div class="callout info"><div class="callout-judul">💡 Keunggulan Keamanan <code>location = /index.php</code></div><p>Banyak konfigurasi Nginx lama menggunakan <code>location ~ \\.php$</code> yang mengizinkan eksekusi berkas <code>.php</code> mana saja di seluruh folder publik. Pada aplikasi modern yang menggunakan satu pintu masuk (<code>public/index.php</code>), membatasi FastCGI hanya pada <strong><code>location = /index.php</code></strong> dan mengembalikan <code>404</code> untuk <code>location ~ \\.php$</code> lainnya menjamin bahwa seandainya ada berkas <code>.php</code> asing yang nyasar ke folder publik, berkas tersebut <strong>tidak akan pernah dieksekusi oleh PHP-FPM</strong>!</p></div>
<h2>3. Menyetel Worker Pool PHP-FPM (<code>www.conf</code>)</h2>
<p>Di dalam berkas konfigurasi pool PHP-FPM (biasanya <code>/etc/php/8.5/fpm/pool.d/www.conf</code>), pengaturan paling penting adalah memilih mode <strong>Process Manager (<code>pm</code>)</strong> dan menghitung jumlah maksimal proses pekerja (<strong><code>pm.max_children</code></strong>):</p>
<h3>Tiga Mode <code>pm</code> di PHP-FPM</h3>
<ol><li><strong><code>pm = dynamic</code> (Bawaan Umum):</strong> Menjaga sejumlah worker minimum tetap hidup (<code>pm.min_spare_servers</code>), dan menambah worker baru saat trafik ramai hingga batas <code>pm.max_children</code>.</li><li><strong><code>pm = static</code> (Performa Tertinggi untuk Server Khusus):</strong> Langsung menyalakan sejumlah <code>pm.max_children</code> worker secara tetap sejak awal, sehingga tidak ada jeda waktu pembuatan proses baru (<em>forking overhead</em>) saat terjadi lonjakan trafik mendadak!</li><li><strong><code>pm = ondemand</code>:</strong> Tidak ada worker yang hidup saat sepi; worker baru dibuat saat ada permintaan masuk. Cocok untuk lingkungan hemat memori atau <em>staging</em>.</li></ol>
<h3>Rumus Menghitung <code>pm.max_children</code> Agar Server Tidak Kehabisan RAM (<em>OOM Kill</em>)</h3>
<p>Jangan pernah menebak angka <code>pm.max_children = 500</code> tanpa menghitung RAM! Gunakan rumus sederhana ini:</p>
<pre>                       RAM yang Tersedia untuk PHP-FPM
pm.max_children = ─────────────────────────────────────────
                   Rata-rata Memori 1 Proses Worker PHP-FPM</pre>
<p>Contoh perhitungan nyata:</p>
<ul><li>Server VPS memiliki <strong>4 GB RAM (<code>4096 MB</code>)</strong>.</li><li>Sistem operasi Linux, Nginx, dan agen monitoring memakai sekitar <code>800 MB</code>, sehingga tersisa <strong><code>3200 MB</code></strong> untuk PHP-FPM.</li><li>Setiap 1 proses worker PHP aplikasi Anda rata-rata memakai <strong><code>40 MB</code></strong>.</li><li>Maka nilai aman <code>pm.max_children</code> adalah: <code>3200 MB / 40 MB = 80</code> (kita pasang <strong><code>pm.max_children = 70</code></strong> untuk memberi ruang aman sekitar 12%!).</li></ul>
<pre>; Contoh konfigurasi /etc/php/8.5/fpm/pool.d/www.conf untuk produksi
[www]
user = www-data
group = www-data
listen = /run/php/php8.5-fpm.sock

pm = dynamic
pm.max_children = 70
pm.start_servers = 15
pm.min_spare_servers = 10
pm.max_spare_servers = 25

; Daur ulang worker setelah melayani 1000 request untuk mencegah akumulasi kebocoran memori
pm.max_requests = 1000

; Aktifkan endpoint status kesehatan untuk dipantau oleh Prometheus / Exporter
pm.status_path = /status-fpm</pre>
<h2>4. Optimasi OPcache dan Pengaturan Keamanan <code>php.ini</code> Produksi</h2>
<p>Di server produksi, pastikan pengaturan berikut diterapkan di <code>php.ini</code>:</p>
<pre>; === 1. KEAMANAN &amp; PENANGANAN GALAT PRODUKSI ===
; WAJIB Off di produksi agar pesan galat teknis dan jalur berkas tidak bocor ke layar pengguna!
display_errors = Off
display_startup_errors = Off

; Catat seluruh galat ke berkas log server / stderr kontainer
log_errors = On
error_reporting = E_ALL

; Sembunyikan header HTTP &quot;X-Powered-By: PHP/8.5.x&quot;
expose_php = Off

; === 2. OPTIMASI OPCACHE PRODUKSI ===
opcache.enable = 1
opcache.memory_consumption = 256
opcache.interned_strings_buffer = 16
opcache.max_accelerated_files = 20000

; Jika proses deploy Anda mengganti symlink rilis dan memuat ulang PHP-FPM (reload),
; mengatur validate_timestamps = 0 membuat PHP tidak perlu memeriksa waktu modifikasi berkas
; di diska pada setiap request! (Ingat: wajib jalankan 'systemctl reload php8.5-fpm' setiap kali deploy!)
opcache.validate_timestamps = 0</pre>
<p><em>(Catatan: Sejak <strong>PHP 8.5</strong>, Fatal Errors seperti terlampauinya batas waktu <code>max_execution_time</code> kini juga menyertakan jejak tumpukan pemanggilan / <strong>backtrace</strong> lengkap di dalam log server, sehingga diagnosis bottleneck di produksi menjadi jauh lebih mudah!)</em></p>
<h2>Latihan Praktik: Menghitung Kapasitas Worker dan Menyusun Konfigurasi Produksi</h2>
<p>Buatlah berkas dokumentasi/konfigurasi latihan <code>produksi-fpm.ini</code> dan <code>nginx-kodeloka.conf</code> untuk skenario berikut:</p>
<ol><li>Sebuah server produksi memiliki total RAM <code>8 GB</code>, di mana PostgreSQL berada di server terpisah dan sistem operasi + Nginx membutuhkan <code>1 GB</code> RAM.</li><li>Rata-rata satu worker PHP-FPM memakan <code>35 MB</code> RAM. Hitung nilai <code>pm.max_children</code> dengan cadangan keamanan 20%, lalu tuliskan konfigurasi pool PHP-FPM serta pengaturan <code>php.ini</code> produksinya!</li></ol>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/install.fpm.php" rel="noopener">FastCGI Process Manager (FPM) Installation — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/install.fpm.configuration.php" rel="noopener">FPM Configuration — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/book.opcache.php" rel="noopener">OPcache — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/opcache.configuration.php" rel="noopener">OPcache Runtime Configuration (<code>opcache.validate_timestamps</code>) — PHP Manual</a></li><li><a href="https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html" rel="noopener">Module ngx_http_fastcgi_module — Nginx Documentation</a></li></ul></div>
`,
    perintah: ["pm.max_children",".php","php.ini","public/index.php","location = /index.php","location ~ \\.php$"],
    kuis: [
        {"tanya":"Mengapa pengaturan display_errors = Off dan log_errors = On wajib diterapkan pada berkas php.ini di server produksi?","opsi":["Agar PHP mengabaikan semua kesalahan sintaks dan tetap melanjutkan eksekusi.","Agar ketika terjadi galat tak terduga, rincian internal yang sensitif (seperti struktur tabel SQL, jalur direktori server, atau argumen fungsi) tidak tercetak ke layar pengunjung, melainkan dicatat secara privat di dalam log server untuk diperiksa oleh tim pengembang.","Karena display_errors = On mematikan ekstensi OPcache.","Agar ukuran berkas HTML menjadi lebih kecil."],"benar":1,"penjelasan":"Menampilkan pesan galat mentah (display_errors = On) di produksi adalah celah Information Disclosure yang membantu penyerang memetakan struktur internal server dan basis data Anda. Di produksi, tampilkan halaman maaf yang ramah kepada pengguna sementara rincian teknisnya dikirim ke log internal (log_errors = On)."},
        {"tanya":"Apa risiko yang terjadi apabila Anda menetapkan nilai pm.max_children pada PHP-FPM terlalu tinggi hingga total kebutuhan memori seluruh worker melebihi kapasitas RAM fisik server?","opsi":["PHP-FPM otomatis memindahkan kelebihannya ke kartu grafis (GPU).","Saat trafik melonjak, server akan kehabisan RAM (swapping parah hingga memicu Linux OOM Killer yang mematikan paksa proses PHP-FPM atau layanan penting lainnya), menyebabkan situs mengalami downtime (502 Bad Gateway).","Ukuran berkas .php di diska akan bertambah besar.","Nginx otomatis mengubah halaman menjadi gambar statis."],"benar":1,"penjelasan":"Setiap proses anak PHP-FPM mengalokasikan memori RAM sendiri. Jika pm.max_children × rata-rata memori per worker melampaui RAM yang tersedia, lonjakan trafik akan menghabiskan memori server dan memicu kegagalan sistem secara menyeluruh."},
        {"tanya":"Apa konsekuensi dari mengaktifkan optimasi opcache.validate_timestamps = 0 di server produksi?","opsi":["OPcache tidak akan pernah memeriksa lagi apakah berkas .php di diska telah berubah (menghasilkan performa tertinggi karena bebas pengecekan I/O diska), namun Anda wajib memuat ulang layanan PHP-FPM (reload) atau mereset OPcache setiap kali men-deploy kode baru agar perubahan kode terbaca.","Semua fungsi tanggal dan waktu seperti date() dan time() akan dinonaktifkan.","Sesi pengguna akan langsung berakhir dalam 0 detik.","Berkas log server tidak akan mencatat jam kejadian."],"benar":0,"penjelasan":"Dengan opcache.validate_timestamps = 0, PHP langsung mengeksekusi bytecode dari RAM tanpa melakukan panggilan sistem stat() ke diska untuk memeriksa waktu modifikasi berkas .php. Konsekuensinya, setiap kali rilis baru di-deploy, pipeline CI/CD harus memanggil reload pada PHP-FPM agar bytecode di OPcache diperbarui."}
    ]
},
{
    id: 25,
    kategori: "7 · Kualitas & Produksi",
    judul: "Proyek Akhir Kelas PHP: Aplikasi Manajemen Modul & Catatan Belajar Aman",
    tingkat: "Lanjut", durasi: "10 mnt",
    tag: ["declare(strict_types=1)","match","|>"],
    ringkas: "Membangun aplikasi web PHP 8.4/8.5 berarsitektur bersih dari nol yang memadukan PSR-4 Autoloading, Backed Enum, Readonly Class, PDO Prepared Statements, proteksi sesi, proteksi CSRF hash_equals(), serta keluaran HTML bebas XSS.",
    isi: `
<h2>Gambaran Proyek</h2>
<p>Selamat! Anda telah menuntaskan seluruh perjalanan di Kelas PHP Kodeloka—mulai dari siklus versi dan model eksekusi PHP, sistem tipe ketat <code>declare(strict_types=1)</code>, ekspresi <code>match</code> dan operator pipe <code>|&gt;</code>, pengolahan string multibyte <code>mb_*</code> dan fungsi array baru PHP 8.4/8.5, OOP modern dengan <em>Property Hooks</em> dan <em>Asymmetric Visibility</em>, Enum &amp; Exception, Composer &amp; PSR-4, penanganan request HTTP dan pencegahan XSS, manajemen sesi &amp; cookie, unggah berkas dengan <code>finfo</code>, akses basis data PDO, keamanan kata sandi &amp; CSRF, pengujian PHPUnit, hingga penyajian produksi dengan PHP-FPM.</p>
<p>Dalam proyek akhir ini, kita akan merakit <strong>Aplikasi Pengelola Catatan Belajar Kodeloka</strong> yang menerapkan seluruh standar keamanan dan arsitektur bersih tersebut:</p>
<pre>proyek-catatan-kodeloka/
├── composer.json
├── public/
│   └── index.php                  &lt;-- Front Controller (Routing, Session, CSRF, &amp; View)
├── src/
│   ├── Domain/
│   │   ├── PrioritasCatatan.php   &lt;-- Backed Enum (PHP 8.1+)
│   │   └── Catatan.php            &lt;-- Entitas Readonly (PHP 8.2+)
│   ├── Keamanan/
│   │   └── PenjagaKeamanan.php    &lt;-- Helper XSS e(), CSRF hash_equals(), &amp; Sesi Aman
│   └── Repository/
│       └── CatatanRepository.php  &lt;-- PDO Prepared Statements
└── tests/
    └── CatatanRepositoryTest.php  &lt;-- Pengujian Otomatis PHPUnit 12</pre>
<h2>Kode Lengkap Proyek</h2>
<h3>1. Backed Enum Prioritas (<code>src/Domain/PrioritasCatatan.php</code>)</h3>
<pre>&lt;?php

declare(strict_types=1);

namespace Kodeloka\\Catatan\\Domain;

enum PrioritasCatatan: string
{
    case Rendah  = 'rendah';
    case Normal  = 'normal';
    case Penting = 'penting';

    public function label(): string
    {
        return match ($this) {
            self::Rendah  =&gt; 'Rendah',
            self::Normal  =&gt; 'Normal',
            self::Penting =&gt; 'Penting ★',
        };
    }
}</pre>
<h3>2. Entitas Readonly (<code>src/Domain/Catatan.php</code>)</h3>
<pre>&lt;?php

declare(strict_types=1);

namespace Kodeloka\\Catatan\\Domain;

readonly class Catatan
{
    public function __construct(
        public int $id,
        public string $judul,
        public string $isi,
        public PrioritasCatatan $prioritas,
        public string $dibuatPada,
    ) {}

    public static function dariBarisDb(array $baris): self
    {
        return new self(
            id: (int) $baris['id'],
            judul: (string) $baris['judul'],
            isi: (string) $baris['isi'],
            prioritas: PrioritasCatatan::tryFrom((string) $baris['prioritas']) ?? PrioritasCatatan::Normal,
            dibuatPada: (string) $baris['dibuat_pada'],
        );
    }
}</pre>
<h3>3. Utilitas Keamanan Sesi, CSRF, dan Anti-XSS (<code>src/Keamanan/PenjagaKeamanan.php</code>)</h3>
<pre>&lt;?php

declare(strict_types=1);

namespace Kodeloka\\Catatan\\Keamanan;

final class PenjagaKeamanan
{
    public static function mulaiSesi(): void
    {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return;
        }

        ini_set('session.use_strict_mode', '1');
        ini_set('session.use_only_cookies', '1');

        session_set_cookie_params([
            'lifetime' =&gt; 0,
            'path'     =&gt; '/',
            'secure'   =&gt; isset($_SERVER['HTTPS']) &amp;&amp; $_SERVER['HTTPS'] !== 'off',
            'httponly' =&gt; true,
            'samesite' =&gt; 'Lax',
        ]);

        session_start();
    }

    public static function e(string|int|float|null $nilai): string
    {
        return htmlspecialchars(
            (string) $nilai,
            ENT_QUOTES | ENT_SUBSTITUTE,
            'UTF-8',
        );
    }

    public static function tokenCsrf(): string
    {
        self::mulaiSesi();
        if (empty($_SESSION['_csrf_token'])) {
            $_SESSION['_csrf_token'] = bin2hex(random_bytes(32));
        }
        return (string) $_SESSION['_csrf_token'];
    }

    public static function verifikasiCsrf(?string $tokenMasukan): bool
    {
        self::mulaiSesi();
        $tokenSesi = (string) ($_SESSION['_csrf_token'] ?? '');
        if ($tokenSesi === '' || $tokenMasukan === null || $tokenMasukan === '') {
            return false;
        }
        return hash_equals($tokenSesi, $tokenMasukan);
    }
}</pre>
<h3>4. Repositori Basis Data PDO (<code>src/Repository/CatatanRepository.php</code>)</h3>
<pre>&lt;?php

declare(strict_types=1);

namespace Kodeloka\\Catatan\\Repository;

use InvalidArgumentException;
use Kodeloka\\Catatan\\Domain\\Catatan;
use Kodeloka\\Catatan\\Domain\\PrioritasCatatan;
use PDO;

final class CatatanRepository
{
    public function __construct(
        private readonly PDO $pdo,
    ) {}

    public function inisialisasiSkema(): void
    {
        $this-&gt;pdo-&gt;exec(
            'CREATE TABLE IF NOT EXISTS catatan (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                judul TEXT NOT NULL,
                isi TEXT NOT NULL,
                prioritas TEXT NOT NULL DEFAULT \\'normal\\',
                dibuat_pada TEXT NOT NULL
            )'
        );
    }

    /**
     * @return list&lt;Catatan&gt;
     */
    public function ambilSemua(): array
    {
        $stmt = $this-&gt;pdo-&gt;query(
            'SELECT id, judul, isi, prioritas, dibuat_pada
             FROM catatan
             ORDER BY id DESC'
        );

        $daftarBaris = $stmt-&gt;fetchAll(PDO::FETCH_ASSOC);
        return array_map(Catatan::dariBarisDb(...), $daftarBaris);
    }

    public function tambah(string $judul, string $isi, PrioritasCatatan $prioritas): int
    {
        $judulBersih = trim($judul);
        $isiBersih   = trim($isi);

        if (mb_strlen($judulBersih) &lt; 3 || mb_strlen($judulBersih) &gt; 120) {
            throw new InvalidArgumentException('Judul catatan harus antara 3 hingga 120 karakter.');
        }
        if ($isiBersih === '') {
            throw new InvalidArgumentException('Isi catatan tidak boleh kosong.');
        }

        // Prepared Statement: 100% aman dari SQL Injection!
        $stmt = $this-&gt;pdo-&gt;prepare(
            'INSERT INTO catatan (judul, isi, prioritas, dibuat_pada)
             VALUES (:judul, :isi, :prioritas, :dibuat_pada)'
        );

        $stmt-&gt;execute([
            'judul'       =&gt; $judulBersih,
            'isi'         =&gt; $isiBersih,
            'prioritas'   =&gt; $prioritas-&gt;value,
            'dibuat_pada' =&gt; gmdate('Y-m-d\\TH:i:s\\Z'),
        ]);

        return (int) $this-&gt;pdo-&gt;lastInsertId();
    }

    public function hapus(int $id): bool
    {
        $stmt = $this-&gt;pdo-&gt;prepare('DELETE FROM catatan WHERE id = :id');
        $stmt-&gt;execute(['id' =&gt; $id]);
        return $stmt-&gt;rowCount() &gt; 0;
    }
}</pre>
<h3>5. Front Controller (<code>public/index.php</code>)</h3>
<pre>&lt;?php

declare(strict_types=1);

use Kodeloka\\Catatan\\Domain\\PrioritasCatatan;
use Kodeloka\\Catatan\\Keamanan\\PenjagaKeamanan as Aman;
use Kodeloka\\Catatan\\Repository\\CatatanRepository;

require dirname(__DIR__) . '/vendor/autoload.php';

Aman::mulaiSesi();

// Koneksi PDO SQLite dengan konfigurasi ketat
$jalurDb = dirname(__DIR__) . '/storage/catatan.sqlite';
$pdo = new PDO('sqlite:' . $jalurDb, null, null, [
    PDO::ATTR_ERRMODE            =&gt; PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE =&gt; PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   =&gt; false,
]);

$repo = new CatatanRepository($pdo);
$repo-&gt;inisialisasiSkema();

$pesanGalat = null;

// Menangani pengiriman formulir POST (dilindungi token CSRF!)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!Aman::verifikasiCsrf($_POST['csrf_token'] ?? null)) {
        http_response_code(403);
        exit('Token keamanan CSRF tidak valid.');
    }

    $aksi = (string) ($_POST['aksi'] ?? '');

    try {
        if ($aksi === 'tambah') {
            $prioritas = PrioritasCatatan::tryFrom((string) ($_POST['prioritas'] ?? ''))
                ?? PrioritasCatatan::Normal;

            $repo-&gt;tambah(
                judul: (string) ($_POST['judul'] ?? ''),
                isi: (string) ($_POST['isi'] ?? ''),
                prioritas: $prioritas,
            );
        } elseif ($aksi === 'hapus') {
            $idHapus = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
            if (is_int($idHapus) &amp;&amp; $idHapus &gt; 0) {
                $repo-&gt;hapus($idHapus);
            }
        }

        // Pola Post/Redirect/Get (PRG) agar menekan F5 di peramban tidak mengirim ulang form POST!
        header('Location: /', true, 303);
        exit;
    } catch (InvalidArgumentException $e) {
        http_response_code(422);
        $pesanGalat = $e-&gt;getMessage();
    }
}

$daftarCatatan = $repo-&gt;ambilSemua();
$tokenCsrf = Aman::tokenCsrf();
?&gt;
&lt;!DOCTYPE html&gt;
&lt;html lang=&quot;id&quot;&gt;
  &lt;head&gt;
    &lt;meta charset=&quot;utf-8&quot;&gt;
    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;&gt;
    &lt;title&gt;Catatan Belajar Aman — Kodeloka PHP&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;main&gt;
      &lt;h1&gt;Catatan Belajar Kodeloka&lt;/h1&gt;

      &lt;?php if ($pesanGalat !== null): ?&gt;
        &lt;p role=&quot;alert&quot;&gt;&lt;strong&gt;Galat:&lt;/strong&gt; &lt;?= Aman::e($pesanGalat) ?&gt;&lt;/p&gt;
      &lt;?php endif; ?&gt;

      &lt;section aria-labelledby=&quot;judul-form&quot;&gt;
        &lt;h2 id=&quot;judul-form&quot;&gt;Tambah Catatan Baru&lt;/h2&gt;
        &lt;form action=&quot;/&quot; method=&quot;post&quot;&gt;
          &lt;input type=&quot;hidden&quot; name=&quot;csrf_token&quot; value=&quot;&lt;?= Aman::e($tokenCsrf) ?&gt;&quot;&gt;
          &lt;input type=&quot;hidden&quot; name=&quot;aksi&quot; value=&quot;tambah&quot;&gt;

          &lt;div&gt;
            &lt;label for=&quot;input-judul&quot;&gt;Judul Modul / Topik&lt;/label&gt;
            &lt;input type=&quot;text&quot; id=&quot;input-judul&quot; name=&quot;judul&quot; required minlength=&quot;3&quot; maxlength=&quot;120&quot;&gt;
          &lt;/div&gt;

          &lt;div&gt;
            &lt;label for=&quot;pilih-prioritas&quot;&gt;Prioritas&lt;/label&gt;
            &lt;select id=&quot;pilih-prioritas&quot; name=&quot;prioritas&quot;&gt;
              &lt;?php foreach (PrioritasCatatan::cases() as $kasus): ?&gt;
                &lt;option value=&quot;&lt;?= Aman::e($kasus-&gt;value) ?&gt;&quot;&gt;
                  &lt;?= Aman::e($kasus-&gt;label()) ?&gt;
                &lt;/option&gt;
              &lt;?php endforeach; ?&gt;
            &lt;/select&gt;
          &lt;/div&gt;

          &lt;div&gt;
            &lt;label for=&quot;input-isi&quot;&gt;Ringkasan Catatan&lt;/label&gt;
            &lt;textarea id=&quot;input-isi&quot; name=&quot;isi&quot; rows=&quot;4&quot; required&gt;&lt;/textarea&gt;
          &lt;/div&gt;

          &lt;button type=&quot;submit&quot;&gt;Simpan Catatan&lt;/button&gt;
        &lt;/form&gt;
      &lt;/section&gt;

      &lt;section aria-labelledby=&quot;judul-daftar&quot;&gt;
        &lt;h2 id=&quot;judul-daftar&quot;&gt;Daftar Catatan Tersimpan (&lt;?= count($daftarCatatan) ?&gt;)&lt;/h2&gt;
        &lt;?php foreach ($daftarCatatan as $catatan): ?&gt;
          &lt;article&gt;
            &lt;header&gt;
              &lt;h3&gt;&lt;?= Aman::e($catatan-&gt;judul) ?&gt;&lt;/h3&gt;
              &lt;span&gt;Prioritas: &lt;?= Aman::e($catatan-&gt;prioritas-&gt;label()) ?&gt;&lt;/span&gt;
              &lt;time datetime=&quot;&lt;?= Aman::e($catatan-&gt;dibuatPada) ?&gt;&quot;&gt;&lt;?= Aman::e($catatan-&gt;dibuatPada) ?&gt;&lt;/time&gt;
            &lt;/header&gt;
            &lt;p&gt;&lt;?= nl2br(Aman::e($catatan-&gt;isi)) ?&gt;&lt;/p&gt;
            &lt;form action=&quot;/&quot; method=&quot;post&quot;&gt;
              &lt;input type=&quot;hidden&quot; name=&quot;csrf_token&quot; value=&quot;&lt;?= Aman::e($tokenCsrf) ?&gt;&quot;&gt;
              &lt;input type=&quot;hidden&quot; name=&quot;aksi&quot; value=&quot;hapus&quot;&gt;
              &lt;input type=&quot;hidden&quot; name=&quot;id&quot; value=&quot;&lt;?= Aman::e($catatan-&gt;id) ?&gt;&quot;&gt;
              &lt;button type=&quot;submit&quot;&gt;Hapus Catatan&lt;/button&gt;
            &lt;/form&gt;
          &lt;/article&gt;
        &lt;?php endforeach; ?&gt;
      &lt;/section&gt;
    &lt;/main&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
<div class="callout info"><div class="callout-judul">📚 Rujukan</div><ul><li><a href="https://www.php.net/manual/en/language.types.enumerations.php" rel="noopener">Enumerations — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/functions.first_class_callable_syntax.php" rel="noopener">First-class callable syntax — PHP Manual</a></li><li><a href="https://www.php.net/manual/en/function.nl2br.php" rel="noopener"><code>nl2br</code> — PHP Manual</a></li><li><a href="https://www.rfc-editor.org/rfc/rfc9110.html#name-303-see-other" rel="noopener">RFC 9110: HTTP Semantics (303 See Other) — IETF</a></li><li><a href="https://www.php.net/manual/en/book.pdo.php" rel="noopener">PDO — PHP Manual</a></li><li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html" rel="noopener">Cross-Site Request Forgery Prevention Cheat Sheet — OWASP</a></li><li><a href="https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html" rel="noopener">Cross Site Scripting Prevention Cheat Sheet — OWASP</a></li></ul></div>
`,
    perintah: ["declare(strict_types=1)","match","|>","mb_*","finfo","src/Domain/PrioritasCatatan.php"],
    kuis: [
        {"tanya":"Dalam Front Controller public/index.php di atas, mengapa setelah berhasil memproses permintaan POST (menambah atau menghapus catatan), server mengirimkan header('Location: /', true, 303); exit;?","opsi":["Karena PHP tidak mampu merender HTML pada permintaan POST.","Untuk menerapkan pola Post/Redirect/Get (PRG) dengan status HTTP 303 See Other, sehingga jika pengguna memuat ulang halaman (refresh / menekan tombol F5) setelah menyimpan catatan, peramban hanya akan melakukan permintaan GET / yang aman tanpa mengirim ulang formulir POST (mencegah duplikasi data!).","Untuk menghapus seluruh cookie pengguna.","Agar basis data SQLite otomatis ditutup."],"benar":1,"penjelasan":"Jika permintaan POST langsung dibalas dengan halaman HTML 200 OK, maka menekan tombol Refresh di peramban akan memunculkan peringatan \"Confirm Form Resubmission\" dan mengirim ulang data POST yang sama untuk kedua kalinya. Pola Post/Redirect/Get (PRG) dengan status 303 See Other mengalihkan peramban ke permintaan GET yang bersih."},
        {"tanya":"Perhatikan baris <?= nl2br(Aman::e($catatan->isi)) ?> saat menampilkan isi catatan multi-baris di atas. Mengapa Aman::e() (htmlspecialchars) wajib dipanggil di bagian dalam terlebih dahulu sebelum nl2br(), dan bukan sebaliknya (Aman::e(nl2br($catatan->isi)))?","opsi":["Karena nl2br() hanya menerima string yang sudah di-escape.","Karena jika nl2br() dipanggil lebih dulu baru kemudian dibungkus htmlspecialchars(), maka tag <br /> yang dihasilkan oleh nl2br() akan ikut diubah menjadi teks &lt;br /&gt; yang tercetak mentah di layar; sebaliknya, memanggil Aman::e() lebih dulu mengamankan seluruh input pengguna dari XSS, baru kemudian nl2br() mengubah baris baru menjadi <br /> yang aman.","Karena nl2br() sudah otomatis mencegah XSS.","Urutan pemanggilan keduanya tidak berpengaruh sama sekali."],"benar":1,"penjelasan":"Urutan ini sangat penting: kita harus membersihkan seluruh karakter HTML berbahaya dari masukan pengguna terlebih dahulu dengan htmlspecialchars(), barulah kita mengubah karakter baris baru (\\n) menjadi tag <br /> melalui nl2br()."},
        {"tanya":"Bagaimana metode ambilSemua() di dalam CatatanRepository mengubah array baris mentah dari PDO menjadi array objek Catatan dengan sintaks PHP 8.1+ yang ringkas?","opsi":["Menggunakan array_map(Catatan::dariBarisDb(...), $daftarBaris) dengan sintaks First-Class Callable.","Menggunakan json_decode(json_encode($daftarBaris)).","Menggunakan eval() untuk setiap baris.","Menggunakan extract($daftarBaris)."],"benar":0,"penjelasan":"Catatan::dariBarisDb(...) adalah sintaks First-Class Callable (PHP 8.1+) yang membuat referensi Closure langsung ke metode pabrik statis Catatan::dariBarisDb, sehingga dapat diteruskan dengan sangat bersih ke array_map()."}
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
