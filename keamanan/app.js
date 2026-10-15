/* ==========================================================================
   KEAMANAN APLIKASI — Platform Pembelajaran Interaktif
   ========================================================================== */

const TOPIK_SLUG = "keamanan";
const TOPIK_SUB  = "OWASP & pertahanan berlapis";

const MODUL = [
{
    id: 1,
    kategori: "1 · Fondasi",
    judul: "Model Ancaman & Pertahanan Berlapis",
    tingkat: "Dasar", durasi: "12 mnt",
    tag: ["threat model", "STRIDE", "defense in depth"],
    ringkas: "Cara memutuskan apa yang perlu dilindungi lebih dulu, sebelum menambahkan kontrol keamanan secara acak.",
    isi: `
<h2>Keamanan Dimulai dari Pertanyaan, Bukan dari Alat</h2>
<p>Menambahkan WAF, memasang pemindai, dan mengaktifkan semua header keamanan terasa produktif — tetapi tanpa memahami apa yang dilindungi dan dari siapa, usaha itu tersebar tipis di tempat yang salah. Pemodelan ancaman menjawab empat pertanyaan sederhana:</p>

<pre>1. Apa yang kita bangun?          → diagram alur data
2. Apa yang bisa salah?           → daftar ancaman
3. Apa yang akan kita lakukan?    → kontrol dan mitigasi
4. Apakah sudah cukup baik?       → tinjau ulang dan ukur</pre>

<h2>STRIDE</h2>
<p>Kerangka STRIDE membantu memunculkan ancaman secara sistematis alih-alih mengandalkan ingatan:</p>

<pre>S  Spoofing                menyamar sebagai orang lain
T  Tampering               mengubah data saat transit atau di penyimpanan
R  Repudiation             menyangkal telah melakukan sesuatu
I  Information Disclosure  membocorkan data ke pihak tak berhak
D  Denial of Service       membuat layanan tidak tersedia
E  Elevation of Privilege  memperoleh hak yang lebih tinggi</pre>

<p>Terapkan pada setiap batas kepercayaan — tempat data berpindah dari zona dengan tingkat kepercayaan berbeda. Peramban ke API, API ke basis data, layanan ke layanan pihak ketiga.</p>

<h2>Pertahanan Berlapis</h2>
<p>Prinsipnya: <strong>asumsikan setiap lapis akan gagal</strong>. Bukan karena tim ceroboh, tetapi karena semua lapis pada akhirnya punya celah.</p>

<pre>Jaringan     firewall, segmentasi, TLS
Gateway      rate limit, WAF, validasi ukuran
Aplikasi     autentikasi, otorisasi, validasi input
Data         enkripsi, hak akses minimal, audit
Operasi      pemantauan, deteksi, tanggap insiden</pre>

<div class="callout info">
    <div class="callout-judul">💡 Kenapa validasi di sisi klien bukan kontrol keamanan</div>
    <p>Validasi JavaScript di peramban meningkatkan pengalaman pengguna — kesalahan terlihat sebelum permintaan dikirim. Tetapi penyerang tidak memakai peramban Anda; mereka memakai <code>curl</code>. Setiap validasi yang penting untuk keamanan <strong>harus</strong> diulang di server. Anggap sisi klien sebagai kenyamanan, bukan pertahanan.</p>
</div>

<h2>Hak Akses Minimal</h2>
<pre># Buruk — satu pengguna basis data untuk semuanya
DATABASE_URL=postgres://admin:sandi@db/aplikasi

# Lebih baik — hak sesuai kebutuhan tiap layanan
GRANT SELECT, INSERT, UPDATE ON pesanan TO app_pesanan;
GRANT SELECT ON produk TO app_katalog;
REVOKE DELETE ON ALL TABLES IN SCHEMA public FROM app_katalog;</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Dampak pelanggaran ditentukan oleh hak yang dimiliki, bukan oleh cara masuknya</div>
    <p>SQL injection pada akun dengan hak <code>SELECT</code> di satu tabel adalah insiden yang merepotkan. SQL injection yang sama pada akun <code>superuser</code> berarti seluruh basis data terekspos dan bisa dihapus. Celahnya identik — yang berbeda hanya batas kerusakannya.</p>
</div>

<h2>Gagal Secara Tertutup</h2>
<pre>// Salah — kegagalan pemeriksaan membuka akses
try {
    izin = await periksaIzin(pengguna, sumber);
} catch (e) {
    izin = true;                      // "biar layanan tetap jalan"
}

// Benar — kegagalan berarti ditolak
try {
    izin = await periksaIzin(pengguna, sumber);
} catch (e) {
    log.error({ e }, "pemeriksaan izin gagal");
    throw new GalatOtorisasi("tidak dapat memverifikasi izin");
}</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Pola paling berbahaya: menganggap galat sebagai izin</div>
    <p>Ketika layanan otorisasi bermasalah, godaan untuk "sementara meloloskan permintaan agar tidak mengganggu pengguna" sangat besar. Tetapi itu berarti siapa pun yang mampu membuat layanan otorisasi tidak responsif — bahkan sekadar membanjirinya — otomatis memperoleh akses penuh. Ketidaktersediaan yang jujur jauh lebih baik daripada otorisasi yang diam-diam mati.</p>
</div>`,
    perintah: [
        "grep -rn 'catch' --include='*.js' | grep -i 'izin\\|auth' ",
        "psql -c '\\\\du'",
        "npm audit --production",
        "docker scout cves aplikasi:terbaru",
        "git log --oneline --grep='security'"
    ],
    kuis: [
        {
            tanya: "Kenapa validasi input di sisi peramban tidak dapat dihitung sebagai kontrol keamanan?",
            opsi: [
                "Karena JavaScript terlalu lambat untuk memvalidasi data besar",
                "Karena penyerang mengirim permintaan langsung tanpa melewati antarmuka, sehingga seluruh validasi klien terlewati",
                "Karena peramban lama tidak mendukung validasi",
                "Karena validasi klien hanya bekerja pada formulir HTML"
            ],
            benar: 1,
            penjelasan: "Kode sisi klien berjalan di lingkungan yang dikendalikan penyerang dan dapat diubah atau dilewati sepenuhnya dengan curl atau alat serupa. Validasi klien berguna untuk umpan balik cepat kepada pengguna, tetapi setiap aturan yang menentukan keamanan harus ditegakkan ulang di server tempat penyerang tidak punya kendali."
        },
        {
            tanya: "Sebuah layanan otorisasi kadang gagal merespons, dan kode menanganinya dengan menganggap permintaan diizinkan. Apa risikonya?",
            opsi: [
                "Layanan menjadi lebih lambat karena percobaan ulang",
                "Siapa pun yang mampu membuat layanan otorisasi tidak responsif otomatis memperoleh akses penuh tanpa perlu menembus autentikasi",
                "Log audit menjadi tidak akurat",
                "Sesi pengguna berakhir lebih cepat dari seharusnya"
            ],
            benar: 1,
            penjelasan: "Pola gagal-terbuka mengubah gangguan ketersediaan menjadi jalan masuk. Membanjiri atau mengganggu layanan otorisasi cukup untuk melewati seluruh kontrol akses. Kontrol keamanan harus gagal secara tertutup: bila keputusan izin tidak dapat diverifikasi, permintaan ditolak dan kegagalannya dicatat."
        },
        {
            tanya: "Apa alasan utama memberi setiap layanan akun basis data dengan hak terbatas?",
            opsi: [
                "Agar kueri berjalan lebih cepat karena pemeriksaan hak lebih sedikit",
                "Agar dampak sebuah celah dibatasi pada apa yang boleh dilakukan akun itu, bukan pada seluruh basis data",
                "Agar setiap layanan dapat memakai skema basis data yang berbeda",
                "Karena basis data menolak lebih dari satu koneksi per akun"
            ],
            benar: 1,
            penjelasan: "Celah seperti SQL injection berjalan dengan hak akun yang dipakai aplikasi. Bila akun itu hanya boleh membaca satu tabel, kerusakannya terbatas pada tabel tersebut; bila akun itu superuser, penyerang memperoleh kendali penuh termasuk kemampuan menghapus data. Hak akses minimal tidak mencegah celah, tetapi menentukan seberapa jauh akibatnya."
        }
    ]
},
{
    id: 2,
    kategori: "2 · Injeksi & Input",
    judul: "SQL Injection & Kueri Berparameter",
    tingkat: "Dasar", durasi: "13 mnt",
    tag: ["SQL injection", "ORM", "parameter", "OWASP"],
    ringkas: "Kenapa menyaring karakter berbahaya selalu kalah, dan apa yang benar-benar menyelesaikan masalah ini.",
    isi: `
<h2>Akar Masalahnya: Data Bercampur dengan Kode</h2>
<p>Injeksi terjadi ketika data dari pengguna disatukan ke dalam string yang kemudian ditafsirkan sebagai perintah. Basis data tidak punya cara membedakan bagian mana yang ditulis pengembang dan bagian mana yang datang dari penyerang — semuanya tiba sebagai satu teks.</p>

<pre>// Rentan
const sql = "SELECT * FROM pengguna WHERE surel = '" + surel + "'";

// Masukan penyerang:  ' OR '1'='1
// Kueri yang berjalan:
SELECT * FROM pengguna WHERE surel = '' OR '1'='1'
// → seluruh baris terambil</pre>

<h2>Solusinya: Pisahkan Kueri dari Nilai</h2>
<pre>// PostgreSQL / node-postgres
const hasil = await db.query(
    "SELECT * FROM pengguna WHERE surel = $1 AND aktif = $2",
    [surel, true]
);

// Python / psycopg
cur.execute(
    "SELECT * FROM pengguna WHERE surel = %s AND aktif = %s",
    (surel, True)
)

// Go / database/sql
row := db.QueryRow(
    "SELECT * FROM pengguna WHERE surel = $1", surel)</pre>

<div class="callout info">
    <div class="callout-judul">💡 Kenapa parameter benar-benar aman</div>
    <p>Kueri berparameter bukan sekadar "escaping yang lebih rapi". Struktur kueri dikirim ke basis data dan <em>diurai lebih dulu</em>, baru nilainya dikirim terpisah. Saat nilai tiba, rencana eksekusi sudah terbentuk — tidak ada lagi tahap penguraian yang bisa dipengaruhi. Isi <code>' OR '1'='1</code> diperlakukan sebagai teks pencarian biasa, sepanjang apa pun.</p>
</div>

<h2>Kenapa Daftar Karakter Terlarang Selalu Bocor</h2>
<pre>// Usaha yang selalu gagal
surel = surel.replace(/'/g, "");
surel = surel.replace(/--/g, "");
surel = surel.replace(/;/g, "");</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Penyaringan karakter kalah karena harus benar setiap kali</div>
    <p>Penyerang punya banyak jalan memutar: pengodean heksadesimal, komentar bertingkat, sintaks khusus per basis data, karakter Unicode yang dinormalisasi belakangan. Menghapus <code>--</code> tidak menutup <code>/**/</code>, dan menghapus tanda kutip tidak menolong pada kolom numerik yang tidak berkutip sama sekali. Pertahanan harus benar seratus persen; penyerang cukup benar satu kali.</p>
</div>

<h2>Nama Tabel dan Kolom Tidak Bisa Diparameterkan</h2>
<pre>// TIDAK BISA — parameter hanya untuk nilai, bukan pengenal
db.query("SELECT * FROM pengguna ORDER BY $1", [kolomUrut]);

// Benar — daftar putih yang eksplisit
const KOLOM_BOLEH = { nama: "nama", tanggal: "dibuat_pada", surel: "surel" };
const kolom = KOLOM_BOLEH[kolomUrut] ?? "dibuat_pada";
const arah  = urutan === "asc" ? "ASC" : "DESC";

db.query(\`SELECT * FROM pengguna ORDER BY \${kolom} \${arah}\`);</pre>

<p>Karena pengenal tidak dapat diparameterkan, satu-satunya cara aman adalah memetakan masukan pengguna ke nilai yang sudah ditentukan sebelumnya. Perhatikan bahwa yang dipakai adalah <em>nilai dari peta</em>, bukan masukan pengguna yang sudah "diperiksa".</p>

<h2>ORM Tidak Otomatis Aman</h2>
<pre>// Aman — dibangun lewat query builder
await Pengguna.findMany({ where: { surel } });

// Rentan — string mentah tetap string mentah
await db.$queryRawUnsafe(\`SELECT * FROM pengguna WHERE surel = '\${surel}'\`);

// Aman — raw dengan parameter
await db.$queryRaw\`SELECT * FROM pengguna WHERE surel = \${surel}\`;</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Metode "raw" adalah tempat celah paling sering muncul di proyek yang memakai ORM</div>
    <p>Tim yang memakai ORM sering menganggap dirinya kebal injeksi. Padahal setiap ORM menyediakan jalan keluar untuk kueri kompleks, dan di situlah string mentah kembali disusun dengan penggabungan. Cari <code>queryRawUnsafe</code>, <code>Sequelize.literal</code>, atau <code>session.execute(text(...))</code> saat meninjau kode.</p>
</div>

<h2>NoSQL Juga Bisa Diinjeksi</h2>
<pre>// Rentan — objek dari JSON masuk langsung ke kueri
db.pengguna.findOne({ surel: req.body.surel, sandi: req.body.sandi });

// Penyerang mengirim:
{ "surel": "admin@contoh.id", "sandi": { "$ne": null } }
// → cocok dengan sandi apa pun

// Perbaikan — pastikan tipenya
if (typeof req.body.sandi !== "string") throw new GalatValidasi();</pre>`,
    perintah: [
        "grep -rn 'queryRawUnsafe\\|literal(' --include='*.ts' src/",
        "grep -rn 'f\"SELECT\\|+ \\\" WHERE' --include='*.py' .",
        "sqlmap -u 'https://contoh.id/api?id=1' --batch --risk=1",
        "psql -c 'SELECT usename, usesuper FROM pg_user'",
        "npm audit --production"
    ],
    kuis: [
        {
            tanya: "Kenapa kueri berparameter benar-benar mencegah SQL injection, bukan sekadar mempersulitnya?",
            opsi: [
                "Karena parameter menghapus karakter berbahaya dari masukan sebelum dikirim",
                "Karena struktur kueri diurai lebih dulu sebelum nilai dikirim terpisah, sehingga isi nilai tidak dapat lagi mengubah struktur perintah",
                "Karena parameter membatasi panjang masukan pengguna",
                "Karena basis data mengenkripsi nilai parameter"
            ],
            benar: 1,
            penjelasan: "Basis data menerima struktur kueri dan menyusun rencana eksekusinya sebelum nilai parameter tiba. Ketika nilai kemudian dikirim, tidak ada lagi tahap penguraian yang bisa dipengaruhi, sehingga teks seperti ' OR '1'='1 hanya diperlakukan sebagai data pencarian. Ini pemisahan struktural, bukan penyaringan karakter."
        },
        {
            tanya: "Kolom untuk ORDER BY harus ditentukan pengguna. Bagaimana cara yang aman?",
            opsi: [
                "Kirim nama kolom sebagai parameter kueri seperti nilai biasa",
                "Petakan masukan pengguna ke daftar putih nama kolom yang sudah ditentukan, lalu gunakan nilai dari daftar itu",
                "Hapus karakter non-alfabet dari masukan lalu sisipkan ke kueri",
                "Bungkus nama kolom dengan tanda kutip ganda"
            ],
            benar: 1,
            penjelasan: "Parameter hanya berlaku untuk nilai, bukan untuk pengenal seperti nama tabel atau kolom, sehingga ORDER BY $1 tidak bekerja. Satu-satunya pendekatan yang aman adalah memetakan masukan ke himpunan nama kolom yang sudah ditetapkan di kode dan menggunakan nilai hasil pemetaan itu, dengan nilai bawaan bila masukan tidak dikenali."
        },
        {
            tanya: "Endpoint login MongoDB menerima objek JSON langsung ke kueri, dan penyerang mengirim sandi berupa { \"$ne\": null }. Apa yang terjadi?",
            opsi: [
                "Kueri gagal karena tipe data tidak cocok",
                "Operator $ne membuat syarat cocok dengan sandi apa pun selain null, sehingga login berhasil tanpa mengetahui sandi",
                "MongoDB menolak operator di dalam nilai dokumen",
                "Sandi diperlakukan sebagai teks literal berisi tanda dolar"
            ],
            benar: 1,
            penjelasan: "Bila badan permintaan JSON diteruskan langsung ke kueri, penyerang dapat menyisipkan operator kueri alih-alih nilai biasa. Syarat sandi berubah menjadi 'tidak sama dengan null', yang cocok untuk hampir semua dokumen. Pertahanannya adalah memvalidasi tipe setiap field sebelum menyusun kueri, memastikan sandi benar-benar berupa string."
        }
    ]
},
{
    id: 3,
    kategori: "2 · Injeksi & Input",
    judul: "XSS & Keamanan Sisi Peramban",
    tingkat: "Menengah", durasi: "14 mnt",
    tag: ["XSS", "CSP", "sanitasi", "DOM"],
    ringkas: "Tiga bentuk XSS, kenapa pengodean harus sesuai konteks, dan bagaimana CSP membatasi kerusakan.",
    isi: `
<h2>Tiga Bentuk yang Perlu Dibedakan</h2>
<pre>Tersimpan (stored)   payload masuk basis data, menyerang setiap pengunjung
Terpantul (reflected) payload ada di URL, menyerang korban yang membuka tautan
Berbasis DOM         payload tidak pernah menyentuh server sama sekali</pre>

<p>XSS berbasis DOM sering luput dari pengujian karena payload-nya berada setelah tanda pagar dan tidak pernah dikirim ke server — sehingga tidak muncul di log mana pun.</p>

<pre>// Rentan — fragmen URL langsung ditulis ke halaman
document.getElementById("salam").innerHTML =
    "Halo, " + location.hash.slice(1);

// https://contoh.id/#&lt;img src=x onerror=alert(1)&gt;</pre>

<h2>Pengodean Bergantung pada Konteks</h2>
<p>Tidak ada satu fungsi "escape" yang benar di segala tempat. Karakter yang berbahaya berbeda-beda menurut posisi penyisipan:</p>

<pre>Isi elemen HTML      &lt; &gt; &amp;             → &amp;lt; &amp;gt; &amp;amp;
Nilai atribut        kutip, spasi        → selalu bungkus dengan kutip
Dalam JavaScript     kutip, backslash    → JSON.stringify, bukan escape HTML
Dalam URL            seluruh komponen    → encodeURIComponent
Dalam CSS            kurung, kutip       → hindari nilai dari pengguna</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Escape HTML di dalam blok script tidak menolong sama sekali</div>
    <p>Menyisipkan data ke dalam <code>&lt;script&gt;</code> dengan pengodean HTML tidak berpengaruh, karena isi elemen script tidak diurai sebagai HTML. Nilai <code>&amp;quot;</code> tetap terbaca sebagai tanda kutip oleh mesin JavaScript, dan payload lolos. Gunakan <code>JSON.stringify</code>, atau lebih baik lagi taruh data pada atribut <code>data-</code> lalu baca dari JavaScript.</p>
    <pre>&lt;!-- Rentan meski sudah "di-escape" --&gt;
&lt;script&gt;const nama = "{{ nama|escape }}";&lt;/script&gt;

&lt;!-- Lebih aman --&gt;
&lt;div id="data" data-nama="{{ nama|escape }}"&gt;&lt;/div&gt;
&lt;script&gt;
  const nama = document.getElementById("data").dataset.nama;
&lt;/script&gt;</pre>
</div>

<h2>Kerangka Kerja Modern Aman — Sampai Dilangkahi</h2>
<pre>// Aman — React meng-escape otomatis
&lt;div&gt;{komentarPengguna}&lt;/div&gt;

// Berbahaya — pintu keluar yang menonaktifkan proteksi
&lt;div dangerouslySetInnerHTML={{ __html: komentarPengguna }} /&gt;

// Vue
&lt;div v-html="komentarPengguna"&gt;&lt;/div&gt;      // sama berbahayanya
&lt;div&gt;{{ komentarPengguna }}&lt;/div&gt;           // aman</pre>

<h2>Bila HTML Memang Harus Diizinkan</h2>
<pre>import DOMPurify from "dompurify";

const bersih = DOMPurify.sanitize(masukan, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "title"],
    ALLOWED_URI_REGEXP: /^https?:\\/\\//i
});</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Jangan menulis pembersih HTML sendiri</div>
    <p>Menguraikan HTML dengan benar jauh lebih rumit daripada yang terlihat: tag yang tidak ditutup, atribut tanpa kutip, entitas bertingkat, penanganan berbeda antar peramban. Pustaka mapan seperti DOMPurify sudah menutup ratusan kasus tepi yang ditemukan bertahun-tahun. Regex buatan sendiri hampir selalu bisa dilewati.</p>
</div>

<h2>Content Security Policy</h2>
<pre>Content-Security-Policy:
    default-src 'self';
    script-src  'self' 'nonce-{ACAK}';
    style-src   'self';
    img-src     'self' data: https:;
    connect-src 'self' https://api.contoh.id;
    frame-ancestors 'none';
    base-uri    'self';
    object-src  'none'</pre>

<div class="callout info">
    <div class="callout-judul">💡 CSP adalah jaring pengaman, bukan pengganti pengodean</div>
    <p>CSP tidak mencegah XSS terjadi — ia membatasi apa yang dapat dilakukan payload setelah berhasil disisipkan. Skrip dari domain asing diblokir, <code>eval</code> ditolak, dan pengiriman data curian ke server penyerang gagal karena <code>connect-src</code>. Kombinasi pengodean yang benar plus CSP jauh lebih kuat daripada salah satunya saja.</p>
</div>

<div class="callout bahaya">
    <div class="callout-judul">🚫 'unsafe-inline' pada script-src membatalkan hampir seluruh manfaat CSP</div>
    <p>Direktif ini sering ditambahkan agar skrip inline yang sudah ada tetap berjalan. Tetapi justru skrip inline itulah bentuk utama payload XSS. Gunakan <code>nonce</code> yang dihasilkan acak per permintaan, atau <code>hash</code> untuk skrip inline yang isinya tetap.</p>
</div>

<h2>Cookie yang Tidak Dapat Dibaca Skrip</h2>
<pre>Set-Cookie: sesi=abc123;
            HttpOnly;              // tidak terbaca document.cookie
            Secure;                // hanya melalui HTTPS
            SameSite=Lax;          // batasi pengiriman lintas situs
            Path=/;
            Max-Age=3600</pre>

<p>Dengan <code>HttpOnly</code>, XSS tidak lagi otomatis berarti pencurian sesi. Penyerang masih dapat bertindak atas nama pengguna selama halaman terbuka, tetapi tidak dapat mengambil token sesi untuk dipakai di tempat lain.</p>`,
    perintah: [
        "curl -sI https://contoh.id | grep -i content-security",
        "grep -rn 'dangerouslySetInnerHTML\\|v-html' src/",
        "grep -rn 'innerHTML' --include='*.js' src/",
        "curl -sI https://contoh.id | grep -i set-cookie",
        "npx observatory-cli scan contoh.id"
    ],
    kuis: [
        {
            tanya: "Data pengguna disisipkan ke dalam blok <script> menggunakan escape HTML, tetapi XSS tetap terjadi. Kenapa?",
            opsi: [
                "Karena escape HTML hanya bekerja pada karakter ASCII",
                "Karena isi elemen script tidak diurai sebagai HTML, sehingga entitas HTML tidak melindungi apa pun di konteks JavaScript",
                "Karena skrip berjalan sebelum escape diterapkan",
                "Karena peramban modern mengabaikan entitas HTML"
            ],
            benar: 1,
            penjelasan: "Pengodean harus sesuai konteks tempat data disisipkan. Di dalam elemen script, mesin JavaScript yang mengurai isinya, bukan parser HTML, sehingga entitas seperti &quot; tidak menetralkan apa pun. Gunakan JSON.stringify untuk konteks JavaScript, atau simpan nilai pada atribut data- dan baca lewat dataset."
        },
        {
            tanya: "Kenapa XSS berbasis DOM sering lolos dari pengujian keamanan yang mengandalkan log server?",
            opsi: [
                "Karena payload-nya terlalu pendek untuk terdeteksi",
                "Karena payload dapat berada di fragmen URL setelah tanda pagar, yang tidak pernah dikirim ke server sehingga tidak muncul di log mana pun",
                "Karena peramban mengenkripsi payload sebelum mengirimnya",
                "Karena serangan itu hanya bekerja pada koneksi HTTP"
            ],
            benar: 1,
            penjelasan: "Bagian URL setelah tanda pagar hanya diproses di peramban dan tidak pernah menjadi bagian permintaan HTTP. Bila kode klien membaca location.hash lalu menulisnya ke innerHTML, serangan berjalan penuh di sisi klien tanpa jejak di server. Deteksinya menuntut analisis kode klien, bukan pemeriksaan log."
        },
        {
            tanya: "Apa yang hilang bila CSP menyertakan 'unsafe-inline' pada script-src?",
            opsi: [
                "Kemampuan memuat gambar dari domain lain",
                "Hampir seluruh perlindungan CSP terhadap XSS, karena skrip inline justru bentuk utama payload yang ingin diblokir",
                "Dukungan untuk HTTP/2 pada halaman tersebut",
                "Kemampuan peramban menyimpan halaman di cache"
            ],
            benar: 1,
            penjelasan: "Nilai utama CSP terhadap XSS adalah menolak eksekusi skrip yang tidak diotorisasi, dan payload XSS umumnya berupa skrip inline yang disisipkan ke halaman. Mengizinkan unsafe-inline berarti skrip semacam itu tetap berjalan. Pendekatan yang benar adalah nonce acak per permintaan atau hash untuk skrip inline yang isinya tetap."
        }
    ]
},
{
    id: 4,
    kategori: "3 · Identitas",
    judul: "Autentikasi, Sandi & Sesi",
    tingkat: "Menengah", durasi: "14 mnt",
    tag: ["bcrypt", "argon2", "sesi", "MFA"],
    ringkas: "Menyimpan sandi dengan benar, mengelola sesi, dan menutup celah pada alur lupa sandi.",
    isi: `
<h2>Menyimpan Sandi</h2>
<pre>// SALAH — semuanya, tanpa kecuali
sandiHash = md5(sandi);
sandiHash = sha256(sandi);
sandiHash = sha256(sandi + garam);

// BENAR — fungsi yang memang dirancang untuk sandi
import argon2 from "argon2";

const hash = await argon2.hash(sandi, {
    type: argon2.argon2id,
    memoryCost: 19456,      // 19 MB
    timeCost: 2,
    parallelism: 1
});

const cocok = await argon2.verify(hash, sandiDimasukkan);</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 SHA-256 salah untuk sandi justru karena ia cepat</div>
    <p>Fungsi hash umum dirancang secepat mungkin — itu keunggulannya untuk memeriksa integritas berkas. Untuk sandi, kecepatan itu bekerja untuk penyerang: satu GPU modern menghitung miliaran SHA-256 per detik, sehingga daftar sandi umum habis diuji dalam hitungan menit. Argon2 dan bcrypt sengaja dibuat lambat dan, pada Argon2, boros memori sehingga sulit dipercepat dengan GPU.</p>
</div>

<h2>Perbandingan Waktu Tetap</h2>
<pre>// Rentan terhadap analisis waktu
if (tokenDiberikan === tokenAsli) { ... }

// Aman
import { timingSafeEqual } from "crypto";

const a = Buffer.from(tokenDiberikan);
const b = Buffer.from(tokenAsli);
if (a.length === b.length && timingSafeEqual(a, b)) { ... }</pre>

<p>Perbandingan string biasa berhenti pada byte pertama yang berbeda. Selisih waktunya sangat kecil, tetapi dengan ribuan percobaan terukur, penyerang dapat menebak token karakter demi karakter. Pustaka verifikasi sandi seperti Argon2 sudah menangani ini secara internal.</p>

<h2>Sesi: Cookie atau Token</h2>
<pre>Cookie sesi di server
  + dapat dicabut seketika
  + token tidak pernah terlihat JavaScript bila HttpOnly
  − perlu penyimpanan sesi bersama antar instans

JWT tanpa keadaan
  + tidak perlu penyimpanan bersama
  − TIDAK dapat dicabut sebelum kedaluwarsa
  − payload terbaca siapa pun, hanya tanda tangannya yang terlindungi</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ JWT yang tidak dapat dicabut adalah masalah nyata</div>
    <p>Ketika pengguna keluar, mengganti sandi, atau akunnya dinonaktifkan, JWT yang sudah diterbitkan tetap berlaku sampai kedaluwarsa. Bila masa berlakunya 24 jam, akun yang dibobol tetap dapat diakses selama itu meski sandi sudah diganti. Pola yang lazim: token akses berumur sangat pendek (5–15 menit) ditambah token penyegar yang disimpan di server dan dapat dicabut.</p>
</div>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Serangan alg=none dan kebingungan algoritma</div>
    <p>Sebagian pustaka JWT lama menerima header <code>alg: "none"</code> dan melewati verifikasi tanda tangan sepenuhnya — penyerang cukup menyusun payload sendiri. Varian lain: token yang seharusnya RS256 dikirim sebagai HS256, lalu pustaka memakai kunci publik sebagai kunci rahasia HMAC. Selalu tetapkan algoritma yang diterima secara eksplisit saat verifikasi.</p>
    <pre>jwt.verify(token, kunci, { algorithms: ["RS256"] });</pre>
</div>

<h2>Pesan Galat yang Tidak Membocorkan</h2>
<pre>// Membocorkan surel mana yang terdaftar
if (!pengguna)      return "Surel tidak ditemukan";
if (!sandiCocok)    return "Sandi salah";

// Aman
return "Surel atau sandi salah";</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Waktu respons juga membocorkan hal yang sama</div>
    <p>Bila surel tidak ditemukan, kode sering langsung kembali tanpa menghitung hash — jauh lebih cepat daripada jalur dengan verifikasi Argon2. Selisih ratusan milidetik itu cukup untuk memetakan surel mana yang terdaftar. Perbaikannya: tetap lakukan verifikasi terhadap hash tiruan meski pengguna tidak ditemukan.</p>
</div>

<h2>Alur Setel Ulang Sandi</h2>
<pre>1. Terima permintaan → SELALU balas "bila surel terdaftar, tautan dikirim"
2. Buat token acak kriptografis (32 byte), simpan HASH-nya saja
3. Masa berlaku pendek — 15 sampai 60 menit
4. Sekali pakai; hapus segera setelah dipakai
5. Setelah sandi diganti → cabut seluruh sesi yang ada
6. Kirim pemberitahuan ke surel bahwa sandi berubah</pre>

<div class="callout info">
    <div class="callout-judul">💡 Kenapa token setel ulang disimpan sebagai hash</div>
    <p>Bila basis data bocor dan token tersimpan apa adanya, penyerang dapat langsung memakai setiap token yang masih berlaku untuk mengambil alih akun. Menyimpan hash-nya membuat isi basis data tidak cukup untuk menyelesaikan alur — persis alasan sandi tidak disimpan apa adanya.</p>
</div>

<h2>Membatasi Percobaan</h2>
<pre>Per akun     5 gagal → tunda bertambah, lalu kunci sementara
Per IP       20 gagal per menit → tolak
Global       lonjakan tidak wajar → tinjau, mungkin credential stuffing</pre>

<p>Pembatasan hanya per IP mudah dilewati dengan botnet, sementara pembatasan hanya per akun membuka pintu penguncian akun orang lain dengan sengaja. Keduanya diperlukan bersamaan.</p>`,
    perintah: [
        "grep -rn 'md5\\|sha1\\|sha256' --include='*.js' src/ | grep -i 'sandi\\|password'",
        "grep -rn 'jwt.verify' src/",
        "grep -rn 'algorithms' src/ | grep jwt",
        "curl -s -o /dev/null -w '%{time_total}\\n' -d 'email=tidakada@x.id&password=x' https://contoh.id/login",
        "redis-cli KEYS 'sesi:*' | wc -l"
    ],
    kuis: [
        {
            tanya: "Kenapa SHA-256 dengan garam tetap tidak layak dipakai untuk menyimpan sandi?",
            opsi: [
                "Karena SHA-256 sudah terbukti dapat dibalik menjadi teks asli",
                "Karena SHA-256 dirancang sangat cepat, sehingga penyerang dengan GPU dapat menguji miliaran kandidat sandi per detik meski setiap sandi bergaram",
                "Karena garam tidak dapat disimpan dengan aman di basis data",
                "Karena SHA-256 menghasilkan keluaran yang terlalu pendek"
            ],
            benar: 1,
            penjelasan: "Garam menggagalkan tabel pelangi dan memaksa serangan dilakukan per akun, tetapi tidak memperlambat percobaan itu sendiri. Karena SHA-256 sengaja dibuat cepat, GPU dapat menguji sandi umum dalam waktu singkat. Argon2 dan bcrypt sengaja lambat dan, pada Argon2, menuntut memori besar sehingga percepatan dengan GPU menjadi mahal."
        },
        {
            tanya: "Apa kelemahan paling penting dari JWT tanpa keadaan sebagai mekanisme sesi?",
            opsi: [
                "Payload-nya terenkripsi sehingga server tidak dapat membacanya",
                "Token tidak dapat dicabut sebelum kedaluwarsa, sehingga logout atau penggantian sandi tidak menghentikan token yang sudah diterbitkan",
                "Token hanya berlaku untuk satu instans server",
                "Token tidak dapat menyimpan informasi peran pengguna"
            ],
            benar: 1,
            penjelasan: "Server memvalidasi JWT hanya dengan memeriksa tanda tangan dan waktu kedaluwarsa, tanpa memeriksa keadaan apa pun. Akibatnya token yang sudah beredar tetap sah sampai masa berlakunya habis meski pengguna sudah keluar atau akunnya dinonaktifkan. Pola umum penanggulangannya adalah token akses berumur menit ditambah token penyegar yang tercatat di server dan dapat dicabut."
        },
        {
            tanya: "Endpoint login sudah mengembalikan pesan galat yang sama untuk surel tak terdaftar dan sandi salah, tetapi penyerang masih dapat memetakan surel yang terdaftar. Bagaimana?",
            opsi: [
                "Dengan membaca kode status HTTP yang berbeda",
                "Dengan mengukur waktu respons, karena jalur surel tak terdaftar kembali lebih cepat tanpa menjalankan verifikasi hash yang mahal",
                "Dengan memeriksa ukuran badan respons",
                "Dengan mencoba metode HTTP selain POST"
            ],
            benar: 1,
            penjelasan: "Bila pengguna tidak ditemukan, kode biasanya langsung kembali tanpa menghitung Argon2 atau bcrypt yang memakan ratusan milidetik. Selisih waktu itu konsisten dan mudah diukur, sehingga membocorkan informasi yang sama seperti pesan galat yang berbeda. Perbaikannya adalah tetap menjalankan verifikasi terhadap hash tiruan agar kedua jalur memakan waktu setara."
        }
    ]
},
{
    id: 5,
    kategori: "3 · Identitas",
    judul: "Otorisasi & Kontrol Akses",
    tingkat: "Menengah", durasi: "13 mnt",
    tag: ["IDOR", "RBAC", "BOLA", "otorisasi"],
    ringkas: "Kelemahan kontrol akses menempati peringkat satu OWASP — dan hampir selalu berupa pemeriksaan yang lupa ditulis.",
    isi: `
<h2>Autentikasi Bukan Otorisasi</h2>
<pre>Autentikasi   siapa Anda            → login berhasil
Otorisasi     apa yang boleh Anda    → boleh membuka faktur ini?</pre>

<p>Sebagian besar kebocoran data bukan karena penyerang menembus login, melainkan karena pengguna yang sudah sah dapat mengakses data pengguna lain hanya dengan mengganti angka pada URL.</p>

<h2>IDOR — Celah yang Paling Sering Ditemukan</h2>
<pre>// Rentan — kepemilikan tidak pernah diperiksa
app.get("/api/faktur/:id", perluLogin, async (req, res) => {
    const faktur = await db.faktur.findById(req.params.id);
    res.json(faktur);
});
// Pengguna A membuka /api/faktur/1002 → melihat faktur pengguna B

// Benar — kepemilikan menjadi bagian kueri
app.get("/api/faktur/:id", perluLogin, async (req, res) => {
    const faktur = await db.faktur.findOne({
        id: req.params.id,
        pemilikId: req.pengguna.id       // syarat, bukan pemeriksaan terpisah
    });
    if (!faktur) return res.status(404).json({ galat: "tidak ditemukan" });
    res.json(faktur);
});</pre>

<div class="callout info">
    <div class="callout-judul">💡 Jadikan kepemilikan bagian dari kueri, bukan pemeriksaan sesudahnya</div>
    <p>Pola "ambil dulu, periksa kemudian" mudah terlupa saat menambah endpoint baru, dan sekali terlupa celahnya langsung terbuka. Bila kepemilikan menjadi syarat pada kueri itu sendiri, data milik orang lain tidak pernah terambil sejak awal. Pengembang harus <em>sengaja</em> menghapus syarat itu agar celahnya muncul.</p>
</div>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Balas 404, bukan 403, untuk sumber daya milik orang lain</div>
    <p>Kode 403 mengonfirmasi bahwa sumber daya itu ada — cukup untuk memetakan berapa banyak faktur di sistem dan ID mana yang aktif. Membalas 404 untuk "tidak ada" maupun "bukan milik Anda" tidak membocorkan apa pun.</p>
</div>

<h2>Otorisasi Tidak Boleh Bergantung pada Antarmuka</h2>
<pre>// Menyembunyikan tombol BUKAN kontrol akses
{pengguna.peran === "admin" && &lt;button&gt;Hapus&lt;/button&gt;}

// Endpoint tetap wajib memeriksa
app.delete("/api/pengguna/:id", perluLogin, perluPeran("admin"), ...);</pre>

<p>Menyembunyikan menu di antarmuka hanya merapikan pengalaman pengguna. Endpoint-nya tetap dapat dipanggil langsung oleh siapa pun yang mengetahui alamatnya — dan alamat itu terlihat jelas di kode JavaScript yang dikirim ke peramban.</p>

<h2>Penetapan Massal</h2>
<pre>// Rentan — seluruh badan permintaan masuk ke basis data
await db.pengguna.update({ id: req.pengguna.id }, req.body);
// Penyerang mengirim: { "nama": "Budi", "peran": "admin" }

// Benar — hanya field yang memang boleh diubah
const { nama, telepon } = req.body;
await db.pengguna.update({ id: req.pengguna.id }, { nama, telepon });</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Field sensitif ikut terbawa tanpa terlihat di kode</div>
    <p>Menyerahkan <code>req.body</code> utuh ke lapisan penyimpanan berarti setiap kolom pada tabel dapat ditulis pengguna — termasuk <code>peran</code>, <code>saldo</code>, <code>terverifikasi</code>, atau <code>pemilikId</code>. Celahnya tidak terlihat saat membaca kode karena nama field yang berbahaya tidak pernah muncul di sana. Gunakan skema validasi yang menolak field tak dikenal.</p>
    <pre>const Skema = z.object({
    nama: z.string().min(1).max(100),
    telepon: z.string().regex(/^[0-9+\\-\\s]+$/)
}).strict();                          // tolak field di luar daftar

const data = Skema.parse(req.body);</pre>
</div>

<h2>Menempatkan Pemeriksaan di Satu Tempat</h2>
<pre>// Tersebar — mudah terlupa pada endpoint baru
app.get("/api/laporan", perluLogin, async (req, res) => {
    if (req.pengguna.peran !== "manajer") return res.status(403).end();
});

// Terpusat — bawaan menolak
const KEBIJAKAN = {
    "laporan:baca":  ["manajer", "admin"],
    "faktur:hapus":  ["admin"],
    "faktur:baca":   ["pengguna", "manajer", "admin"]
};

function perluIzin(aksi) {
    return (req, res, next) => {
        const peranBoleh = KEBIJAKAN[aksi];
        if (!peranBoleh) return res.status(500).end();   // aksi tak terdaftar → tolak
        if (!peranBoleh.includes(req.pengguna.peran)) return res.status(404).end();
        next();
    };
}</pre>

<div class="callout info">
    <div class="callout-judul">💡 Aksi yang belum terdaftar harus ditolak, bukan diizinkan</div>
    <p>Perhatikan baris yang menolak ketika aksi tidak ditemukan di kebijakan. Bila sebaliknya — aksi tak dikenal dianggap boleh — maka setiap salah ketik nama aksi diam-diam membuka endpoint untuk semua orang. Bawaan menolak membuat kesalahan semacam itu muncul sebagai bug yang terlihat, bukan sebagai celah yang senyap.</p>
</div>

<h2>Keamanan Tingkat Baris di Basis Data</h2>
<pre>ALTER TABLE faktur ENABLE ROW LEVEL SECURITY;

CREATE POLICY faktur_pemilik ON faktur
    USING (pemilik_id = current_setting('app.pengguna_id')::uuid);

-- Aplikasi menetapkan konteks per koneksi
SET LOCAL app.pengguna_id = '...';</pre>

<p>Ini lapis terakhir: sekalipun sebuah endpoint lupa memeriksa kepemilikan, basis data tetap menolak mengembalikan baris milik orang lain. Berguna khususnya pada aplikasi multipenyewa.</p>`,
    perintah: [
        "grep -rn 'req.body)' --include='*.js' src/ | grep -i update",
        "grep -rn 'findById' src/",
        "curl -H \"Authorization: Bearer $TOKEN_A\" https://contoh.id/api/faktur/1002",
        "psql -c '\\\\d+ faktur' | grep -i policy",
        "grep -rn 'perluPeran\\|perluIzin' src/ | wc -l"
    ],
    kuis: [
        {
            tanya: "Endpoint mengambil dokumen berdasarkan ID lalu memeriksa kepemilikan setelahnya. Kenapa menjadikan kepemilikan bagian dari kueri lebih baik?",
            opsi: [
                "Karena kueri dengan dua syarat berjalan lebih cepat",
                "Karena data milik orang lain tidak pernah terambil sejak awal, sehingga celah hanya muncul bila pengembang sengaja menghapus syarat itu",
                "Karena basis data menolak menyimpan dokumen tanpa pemilik",
                "Karena pemeriksaan setelah pengambilan tidak didukung ORM modern"
            ],
            benar: 1,
            penjelasan: "Pola ambil-lalu-periksa bergantung pada pengembang yang mengingat menulis pemeriksaan pada setiap endpoint baru, dan satu kelalaian langsung membuka akses. Bila pemilik menjadi syarat kueri, jalur bawaannya sudah aman: kueri mengembalikan kosong untuk data orang lain, dan endpoint membalas 404 tanpa logika tambahan."
        },
        {
            tanya: "Kenapa membalas 404 lebih baik daripada 403 ketika pengguna meminta sumber daya milik orang lain?",
            opsi: [
                "Karena 403 menyebabkan peramban menampilkan dialog autentikasi",
                "Karena 403 mengonfirmasi bahwa sumber daya itu ada, sehingga penyerang dapat memetakan ID yang valid di sistem",
                "Karena 404 diproses lebih cepat oleh server",
                "Karena 403 tidak boleh dipakai untuk permintaan yang sudah terautentikasi"
            ],
            benar: 1,
            penjelasan: "Membedakan 'tidak ada' dari 'ada tapi bukan milik Anda' membocorkan keberadaan sumber daya. Penyerang dapat menelusuri rentang ID dan menyimpulkan berapa banyak entitas yang ada serta mana yang aktif — informasi yang berguna untuk serangan lanjutan. Balasan seragam 404 untuk kedua keadaan menutup jalur itu."
        },
        {
            tanya: "Apa risiko meneruskan seluruh req.body langsung ke operasi pembaruan basis data?",
            opsi: [
                "Permintaan menjadi lebih lambat karena field yang tidak perlu ikut disimpan",
                "Pengguna dapat menulis kolom sensitif seperti peran atau saldo yang tidak pernah dimaksudkan dapat diubah, dan celah ini tidak terlihat saat membaca kode",
                "Basis data akan menolak permintaan karena field tidak dikenal",
                "Field kosong akan menimpa data lama dengan null"
            ],
            benar: 1,
            penjelasan: "Ini yang disebut penetapan massal. Karena nama kolom berbahaya tidak pernah tertulis di kode, celahnya tidak terlihat saat ditinjau — penyerang cukup menambahkan field ke badan JSON. Pertahanannya adalah mengambil field secara eksplisit atau memakai skema validasi ketat yang menolak field di luar daftar yang diizinkan."
        }
    ]
},
{
    id: 6,
    kategori: "4 · Rahasia & Data",
    judul: "Pengelolaan Rahasia & Enkripsi",
    tingkat: "Lanjut", durasi: "13 mnt",
    tag: ["secrets", "enkripsi", "rotasi", "KMS"],
    ringkas: "Menyimpan kunci dan kredensial tanpa menaruhnya di repositori, dan mengenkripsi data dengan benar.",
    isi: `
<h2>Rahasia Tidak Pernah Masuk Repositori</h2>
<pre># .gitignore — perlu, tapi jauh dari cukup
.env
*.pem
*.key</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Menghapus rahasia dengan commit baru tidak menghapusnya</div>
    <p>Riwayat Git menyimpan segalanya. Kunci API yang pernah ter-commit tetap dapat diambil dari commit lama, dari fork, dari klon lokal siapa pun, dan dari layanan yang mengindeks repositori publik dalam hitungan menit. Satu-satunya tindakan yang benar adalah <strong>mencabut dan mengganti rahasia itu</strong>. Membersihkan riwayat berguna sebagai kebersihan, tetapi tidak pernah menjadi pengganti rotasi.</p>
    <pre>gitleaks detect --source . --verbose
trufflehog git file://. --only-verified</pre>
</div>

<h2>Urutan Pilihan Penyimpanan</h2>
<pre>1. Penyimpanan rahasia terkelola   Vault, AWS Secrets Manager, GCP Secret Manager
2. Rahasia platform                 Kubernetes Secret + KMS, Docker secret
3. Variabel lingkungan              dari sistem CI, bukan dari berkas ter-commit
4. Berkas terenkripsi di repo       SOPS + age/KMS — masih dapat diterima
5. Teks apa adanya di repo          tidak pernah</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Kubernetes Secret hanya dikodekan base64, bukan dienkripsi</div>
    <p>Base64 sekadar pengodean — siapa pun yang dapat membaca objek Secret dapat membacanya kembali seketika. Tanpa mengaktifkan enkripsi di lapisan penyimpanan, isinya juga tersimpan apa adanya di etcd. Aktifkan <code>EncryptionConfiguration</code> dengan penyedia KMS, dan batasi hak <code>get secrets</code> lewat RBAC.</p>
    <pre>kubectl get secret db -o jsonpath='{.data.sandi}' | base64 -d</pre>
</div>

<h2>Enkripsi Data Diam</h2>
<pre>import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

function enkripsi(teks, kunci) {
    const iv = randomBytes(12);                       // BARU setiap kali
    const c  = createCipheriv("aes-256-gcm", kunci, iv);
    const data = Buffer.concat([c.update(teks, "utf8"), c.final()]);
    const tag  = c.getAuthTag();
    return Buffer.concat([iv, tag, data]).toString("base64");
}</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Menggunakan ulang IV pada GCM menghancurkan keamanannya</div>
    <p>Ini bukan pelemahan bertahap melainkan kegagalan total. Dua pesan yang dienkripsi dengan pasangan kunci dan IV yang sama memungkinkan penyerang memulihkan hasil XOR kedua teks asli, dan pada mode GCM juga membuka jalan memalsukan tanda autentikasi. IV harus dihasilkan acak untuk setiap operasi enkripsi — tidak pernah dari nilai tetap, penghitung yang di-reset, atau konstanta di kode.</p>
</div>

<h2>Pilih Mode Terautentikasi</h2>
<pre>AES-256-GCM        enkripsi + autentikasi   ← pilih ini
ChaCha20-Poly1305  alternatif setara, cepat tanpa akselerasi perangkat keras
AES-256-CBC        tanpa autentikasi         ← perlu HMAC terpisah
ECB                jangan pernah             ← pola data tetap terlihat</pre>

<p>Tanpa autentikasi, penyerang dapat mengubah teks tersandi dan dekripsi tetap berjalan menghasilkan data yang berubah. Mode GCM menolak data yang telah diubah sejak awal.</p>

<h2>Rotasi Kunci</h2>
<pre>{
  "kunci_aktif": "v3",
  "kunci": {
    "v1": "...",     // masih dipakai untuk dekripsi data lama
    "v2": "...",
    "v3": "..."      // dipakai untuk enkripsi baru
  }
}</pre>

<p>Simpan pengenal versi kunci bersama setiap data terenkripsi. Tanpa itu, rotasi menuntut enkripsi ulang seluruh data secara serentak — yang di lapangan berarti rotasi tidak pernah dilakukan sama sekali.</p>

<h2>Rahasia dalam Log dan Pesan Galat</h2>
<pre>const REDAKSI = ["sandi", "token", "otorisasi", "kartu", "rahasia", "kunci"];

function bersihkan(obj) {
    const salinan = { ...obj };
    for (const k of Object.keys(salinan)) {
        if (REDAKSI.some(r => k.toLowerCase().includes(r))) salinan[k] = "[disunting]";
    }
    return salinan;
}

log.info({ permintaan: bersihkan(req.body) }, "permintaan masuk");</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Log terkirim ke tempat dengan kendali akses berbeda</div>
    <p>Sandi yang tercatat di log berpindah ke sistem agregasi log, cadangan, dan sering kali ke layanan pihak ketiga — dengan daftar orang yang dapat mengaksesnya jauh lebih luas daripada basis data produksi. Menyunting field sensitif di titik pencatatan lebih andal daripada berharap tidak ada yang mencatatnya.</p>
</div>

<h2>Kredensial pada Image Kontainer</h2>
<pre># Rentan — rahasia tetap ada di lapisan image
COPY .env /app/.env
RUN echo "$TOKEN_NPM" > ~/.npmrc && npm ci && rm ~/.npmrc

# Aman — mount rahasia hanya selama build
RUN --mount=type=secret,id=npm \\
    NPM_TOKEN=$(cat /run/secrets/npm) npm ci</pre>

<p>Menghapus berkas pada <code>RUN</code> berikutnya tidak menghilangkannya — lapisan sebelumnya tetap tersimpan di image dan dapat dibaca dengan <code>docker history</code> atau dengan mengekstrak lapisan.</p>`,
    perintah: [
        "gitleaks detect --source . --verbose",
        "kubectl get secret db -o jsonpath='{.data.sandi}' | base64 -d",
        "docker history --no-trunc aplikasi:terbaru | grep -i secret",
        "git log --all -p -S 'API_KEY' | head -40",
        "grep -rn 'process.env' src/ | grep -i 'key\\|secret\\|token'"
    ],
    kuis: [
        {
            tanya: "Sebuah kunci API tidak sengaja ter-commit, lalu dihapus lewat commit berikutnya. Apa tindakan yang benar?",
            opsi: [
                "Cukup, karena berkasnya sudah tidak ada di cabang utama",
                "Cabut dan ganti kunci tersebut, karena riwayat Git, klon, fork, dan pengindeks otomatis sudah menyimpannya",
                "Jadikan repositori privat agar kunci tidak terbaca lagi",
                "Timpa berkas dengan nilai palsu pada commit baru"
            ],
            benar: 1,
            penjelasan: "Menghapus berkas hanya mengubah keadaan terkini; commit lama tetap memuat nilainya dan dapat diambil siapa pun yang memiliki riwayat repositori. Repositori publik juga dipindai otomatis dalam hitungan menit setelah push. Rotasi adalah satu-satunya tindakan yang benar-benar menutup paparan; pembersihan riwayat bersifat pelengkap."
        },
        {
            tanya: "Kenapa menggunakan ulang IV dengan kunci yang sama pada AES-GCM sangat berbahaya?",
            opsi: [
                "Karena proses enkripsi menjadi jauh lebih lambat",
                "Karena penyerang dapat memulihkan hubungan antara dua teks asli dan membuka jalan memalsukan tanda autentikasi — keamanannya runtuh, bukan sekadar melemah",
                "Karena hasil enkripsi menjadi lebih panjang dari semestinya",
                "Karena mode GCM menolak mendekripsi data dengan IV berulang"
            ],
            benar: 1,
            penjelasan: "Mode GCM menghasilkan aliran kunci dari pasangan kunci dan IV. Bila pasangan itu terulang, aliran kunci yang sama dipakai dua kali sehingga XOR kedua teks tersandi mengungkap XOR kedua teks asli, dan nilai internal yang bocor memungkinkan pemalsuan tag autentikasi. IV harus diacak ulang pada setiap operasi enkripsi."
        },
        {
            tanya: "Apa yang perlu dipahami tentang objek Secret pada Kubernetes?",
            opsi: [
                "Isinya dienkripsi otomatis dengan kunci klaster",
                "Isinya hanya dikodekan base64 dan dapat dibaca siapa pun yang punya hak get secrets, kecuali enkripsi lapisan penyimpanan diaktifkan",
                "Isinya hanya dapat dibaca oleh pod yang me-mount-nya",
                "Isinya otomatis dirotasi setiap 24 jam"
            ],
            benar: 1,
            penjelasan: "Base64 adalah pengodean, bukan enkripsi, sehingga isinya terbaca seketika dengan base64 -d. Tanpa EncryptionConfiguration yang memakai penyedia KMS, nilai itu juga tersimpan apa adanya di etcd. Perlindungan yang sesungguhnya datang dari mengaktifkan enkripsi penyimpanan dan membatasi hak akses secrets melalui RBAC."
        }
    ]
},
{
    id: 7,
    kategori: "5 · Rantai Pasok & API",
    judul: "Keamanan Dependensi & Rantai Pasok",
    tingkat: "Lanjut", durasi: "12 mnt",
    tag: ["dependensi", "SBOM", "lockfile", "CVE"],
    ringkas: "Sebagian besar kode yang berjalan di produksi bukan tulisan tim Anda — dan itu bagian dari permukaan serangan.",
    isi: `
<h2>Permukaan Serangan yang Sesungguhnya</h2>
<p>Aplikasi Node biasa dengan lima puluh dependensi langsung sering menarik lebih dari seribu paket transitif. Setiap paket itu menjalankan kode dengan hak yang sama seperti aplikasi Anda, dan setiap pemeliharanya adalah pihak yang Anda percayai secara implisit.</p>

<h2>Lockfile Bukan Formalitas</h2>
<pre># Menghormati lockfile — dipakai di CI dan produksi
npm ci
pnpm install --frozen-lockfile
yarn install --immutable
pip install -r requirements.txt --require-hashes

# Boleh memperbarui lockfile — hanya untuk pengembangan lokal
npm install</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Menjalankan <code>npm install</code> di pipeline membuat build tidak dapat diulang</div>
    <p>Perintah itu boleh memutakhirkan paket sesuai rentang versi di <code>package.json</code>, sehingga build hari ini dapat memuat kode yang berbeda dari build kemarin tanpa satu pun perubahan pada repositori. Bila sebuah paket diambil alih dan dirilis versi jahat dalam rentang yang diizinkan, pipeline menariknya secara otomatis. Gunakan <code>npm ci</code> yang menolak berjalan bila lockfile tidak sinkron.</p>
</div>

<h2>Skrip Instalasi Berjalan Otomatis</h2>
<pre>npm ci --ignore-scripts        # jangan jalankan postinstall

# Bila beberapa paket memang membutuhkannya, izinkan selektif
npm ci --ignore-scripts
npm rebuild sharp bcrypt</pre>

<p>Skrip <code>postinstall</code> berjalan dengan hak pengguna yang memasang paket, sebelum satu baris pun kode Anda dieksekusi. Di mesin CI, hak itu sering mencakup akses ke token registry, kredensial cloud, dan seluruh kode sumber.</p>

<h2>Kebingungan Dependensi</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 Paket internal dapat dibajak lewat registry publik</div>
    <p>Bila perusahaan memakai paket internal bernama <code>@perusahaan/util</code> tetapi lingkupnya tidak terdaftar di registry publik, penyerang dapat menerbitkan nama yang sama di npm dengan versi jauh lebih tinggi. Alat pengelola paket yang mencari ke beberapa registry sering memilih versi tertinggi — dan menarik paket penyerang. Serangan ini terbukti berhasil menembus banyak perusahaan besar.</p>
    <pre># .npmrc — kunci lingkup ke registry internal
@perusahaan:registry=https://npm.internal.perusahaan.id/
//npm.internal.perusahaan.id/:_authToken=\${TOKEN_NPM}</pre>
</div>

<h2>Memindai Kerentanan</h2>
<pre>npm audit --production
pip-audit
govulncheck ./...
trivy fs --severity HIGH,CRITICAL .
trivy image aplikasi:terbaru</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Jangan langsung memblokir pipeline pada setiap temuan</div>
    <p>Banyak CVE berada di paket yang tidak pernah dipanggil, atau pada jalur kode yang tidak dapat dijangkau aplikasi Anda. Memblokir semuanya menghasilkan kelelahan peringatan, dan tim mulai melewati pemeriksaan secara rutin — termasuk yang sungguh penting. Blokir pada tingkat kritis dan tinggi yang benar-benar dapat dijangkau, dan tangani sisanya lewat proses pemutakhiran berkala.</p>
</div>

<h2>SBOM</h2>
<pre>syft aplikasi:terbaru -o cyclonedx-json > sbom.json
grype sbom:sbom.json</pre>

<p>Daftar komponen ini menjawab pertanyaan yang muncul setiap kali kerentanan besar diumumkan: <em>apakah kita memakainya, di layanan mana, versi berapa?</em> Tanpa SBOM, jawabannya membutuhkan penelusuran manual berhari-hari — tepat ketika waktu paling berharga.</p>

<h2>Menyematkan Versi Aksi CI</h2>
<pre># Rentan — tag dapat dipindahkan ke commit lain
- uses: actions/checkout@v4

# Aman — SHA tidak dapat diubah
- uses: actions/checkout@8ade135a41bc03ea155e62e844d188df1ea18608  # v4.1.0</pre>

<p>Tag Git dapat dipindahkan oleh siapa pun yang menguasai repositori aksi tersebut. Menyematkan SHA commit memastikan kode yang berjalan di pipeline persis yang pernah ditinjau.</p>

<h2>Sebelum Menambahkan Dependensi Baru</h2>
<pre>Kapan rilis terakhir?              paket terbengkalai tidak menerima perbaikan
Berapa pemelihara aktifnya?        satu orang berarti satu titik kegagalan
Berapa dependensi transitifnya?    satu paket dapat membawa ratusan
Apakah cukup ditulis sendiri?      utilitas puluhan baris sering lebih murah dibuat</pre>`,
    perintah: [
        "npm ci --ignore-scripts",
        "npm audit --production --audit-level=high",
        "trivy image --severity HIGH,CRITICAL aplikasi:terbaru",
        "syft aplikasi:terbaru -o cyclonedx-json > sbom.json",
        "npm ls --all | wc -l"
    ],
    kuis: [
        {
            tanya: "Kenapa 'npm ci' lebih tepat daripada 'npm install' di dalam pipeline CI?",
            opsi: [
                "Karena npm ci mengunduh paket lebih cepat dari cache global",
                "Karena npm ci memasang persis versi pada lockfile dan gagal bila lockfile tidak sinkron, sehingga build dapat diulang dan tidak menarik versi baru secara diam-diam",
                "Karena npm ci otomatis memindai kerentanan sebelum memasang",
                "Karena npm install tidak dapat berjalan tanpa terminal interaktif"
            ],
            benar: 1,
            penjelasan: "npm install boleh memutakhirkan paket dalam rentang versi di package.json, sehingga isi build dapat berubah tanpa perubahan pada repositori — termasuk menarik versi jahat bila sebuah paket diambil alih. npm ci memasang tepat sesuai lockfile dan menolak berjalan bila lockfile tidak cocok, membuat setiap build menghasilkan pohon dependensi yang sama."
        },
        {
            tanya: "Apa yang membuat serangan kebingungan dependensi berhasil?",
            opsi: [
                "Penyerang menebak sandi akun registry internal perusahaan",
                "Penyerang menerbitkan paket bernama sama dengan paket internal di registry publik dengan versi lebih tinggi, dan alat pengelola paket menariknya karena mencari ke beberapa registry",
                "Penyerang mengubah lockfile melalui pull request otomatis",
                "Penyerang menyisipkan kode ke dalam cache registry publik"
            ],
            benar: 1,
            penjelasan: "Ketika sebuah nama paket dapat diselesaikan dari registry internal maupun publik, banyak alat memilih versi tertinggi tanpa memedulikan asalnya. Penyerang cukup mendaftarkan nama paket internal di registry publik dengan nomor versi besar. Pertahanannya adalah mengunci lingkup paket ke registry internal melalui konfigurasi seperti .npmrc, dan mendaftarkan nama lingkup itu di registry publik."
        },
        {
            tanya: "Kenapa memblokir pipeline pada setiap temuan pemindai kerentanan sering merugikan?",
            opsi: [
                "Karena pemindai selalu menghasilkan temuan palsu",
                "Karena banyak CVE berada pada jalur kode yang tidak pernah dijangkau aplikasi, sehingga kelelahan peringatan membuat tim mulai melewati pemeriksaan termasuk yang benar-benar penting",
                "Karena pemindaian memperlambat pipeline secara berlebihan",
                "Karena pemindai tidak dapat membedakan dependensi produksi dan pengembangan"
            ],
            benar: 1,
            penjelasan: "Keberadaan paket rentan tidak selalu berarti aplikasi dapat dieksploitasi; fungsi bermasalahnya mungkin tidak pernah dipanggil. Memblokir tanpa membedakan tingkat dan keterjangkauan menghasilkan banyak gangguan sehingga tim terbiasa melewatinya. Pendekatan yang berkelanjutan adalah memblokir temuan kritis dan tinggi yang terjangkau, lalu menangani sisanya lewat pemutakhiran terjadwal."
        }
    ]
},
{
    id: 8,
    kategori: "5 · Rantai Pasok & API",
    judul: "Keamanan API, CSRF & SSRF",
    tingkat: "Lanjut", durasi: "14 mnt",
    tag: ["CSRF", "SSRF", "CORS", "API"],
    ringkas: "Tiga kelas serangan yang mengeksploitasi kepercayaan: kepercayaan pada peramban, pada asal permintaan, dan pada URL.",
    isi: `
<h2>CSRF — Menumpang Kredensial Korban</h2>
<p>Peramban melampirkan cookie secara otomatis pada setiap permintaan ke sebuah domain, termasuk permintaan yang dipicu dari situs lain. Situs penyerang dapat menyusun formulir yang mengirim ke bank Anda, dan cookie sesi ikut terkirim.</p>

<pre>&lt;!-- Di situs penyerang --&gt;
&lt;form action="https://bank.id/transfer" method="POST"&gt;
    &lt;input name="ke" value="penyerang"&gt;
    &lt;input name="jumlah" value="10000000"&gt;
&lt;/form&gt;
&lt;script&gt;document.forms[0].submit()&lt;/script&gt;</pre>

<h2>Pertahanan Berlapis untuk CSRF</h2>
<pre>Set-Cookie: sesi=abc; SameSite=Lax; Secure; HttpOnly</pre>

<pre>// Token CSRF — pola kirim ganda
const token = randomBytes(32).toString("hex");
res.cookie("csrf", token, { sameSite: "lax", secure: true });
// Klien menyalin nilai itu ke header X-CSRF-Token

// Server membandingkan dengan waktu tetap
if (!timingSafeEqual(Buffer.from(req.cookies.csrf),
                     Buffer.from(req.get("X-CSRF-Token") ?? ""))) {
    return res.status(403).end();
}</pre>

<div class="callout info">
    <div class="callout-judul">💡 API yang memakai token Authorization umumnya kebal CSRF</div>
    <p>Serangan CSRF bergantung pada kredensial yang dilampirkan peramban <em>secara otomatis</em>. Header <code>Authorization</code> harus ditambahkan JavaScript secara eksplisit, dan skrip di situs penyerang tidak dapat membaca token milik domain lain. Karena itu API murni berbasis token tidak memerlukan token CSRF — tetapi API yang menerima autentikasi cookie tetap memerlukannya.</p>
</div>

<div class="callout waspada">
    <div class="callout-judul">⚠️ SameSite=Lax tidak melindungi permintaan GET yang mengubah keadaan</div>
    <p>Nilai <code>Lax</code> tetap mengirim cookie pada navigasi tingkat atas dengan metode GET. Bila ada endpoint semacam <code>GET /akun/hapus?id=5</code>, tautan sederhana dari situs mana pun sudah cukup untuk memicunya. Metode GET tidak boleh mengubah keadaan — ini bukan sekadar kerapian REST, melainkan batas keamanan.</p>
</div>

<h2>CORS Sering Disalahpahami</h2>
<pre>// Berbahaya — memantulkan asal apa pun sambil mengizinkan kredensial
res.header("Access-Control-Allow-Origin", req.headers.origin);
res.header("Access-Control-Allow-Credentials", "true");

// Aman — daftar putih eksplisit
const ASAL_BOLEH = new Set(["https://app.contoh.id", "https://admin.contoh.id"]);
const asal = req.headers.origin;
if (ASAL_BOLEH.has(asal)) {
    res.header("Access-Control-Allow-Origin", asal);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Vary", "Origin");
}</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Memantulkan Origin dengan kredensial sama dengan membuka API ke seluruh internet</div>
    <p>Konfigurasi ini sering muncul sebagai "perbaikan cepat" ketika CORS menghalangi pengembangan. Akibatnya, situs mana pun yang dikunjungi pengguna yang sedang login dapat memanggil API Anda dengan cookie mereka dan membaca balasannya. Perhatikan juga <code>Vary: Origin</code> — tanpa itu, cache dapat menyajikan header CORS milik satu asal kepada asal lain.</p>
</div>

<div class="callout info">
    <div class="callout-judul">💡 CORS melindungi pengguna, bukan API Anda</div>
    <p>CORS adalah aturan yang ditegakkan peramban tentang siapa yang boleh <em>membaca</em> balasan. Ia tidak menghalangi permintaan dari <code>curl</code>, skrip server, atau alat apa pun di luar peramban. Melonggarkan CORS tidak "membuka" API yang tadinya tertutup — API selalu dapat dipanggil langsung. Yang berubah adalah situs mana yang boleh membaca data atas nama pengguna Anda.</p>
</div>

<h2>SSRF — Server Diperalat Mengetuk Pintu Dalam</h2>
<pre>// Rentan — URL dari pengguna diambil apa adanya
app.post("/ambil-pratinjau", async (req, res) => {
    const hasil = await fetch(req.body.url);
    res.send(await hasil.text());
});</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Target favorit SSRF adalah layanan metadata cloud</div>
    <p>Server aplikasi biasanya dapat menjangkau alamat yang tertutup dari internet. Permintaan ke <code>http://169.254.169.254/latest/meta-data/iam/security-credentials/</code> mengembalikan kredensial IAM sementara milik instans — dan dengan itu penyerang memperoleh hak yang sama seperti aplikasi Anda di cloud. Alamat internal lain seperti panel admin, Redis, dan Elasticsearch juga terbuka lewat jalur yang sama.</p>
</div>

<h2>Menahan SSRF</h2>
<pre>import dns from "dns/promises";
import net from "net";

const RENTANG_TERLARANG = [
    "127.0.0.0/8", "10.0.0.0/8", "172.16.0.0/12",
    "192.168.0.0/16", "169.254.0.0/16", "::1/128", "fc00::/7"
];

async function urlAman(masukan) {
    const u = new URL(masukan);
    if (!["http:", "https:"].includes(u.protocol)) throw new Error("skema ditolak");

    const alamat = await dns.resolve4(u.hostname);
    for (const ip of alamat) {
        if (diRentangTerlarang(ip)) throw new Error("alamat internal ditolak");
    }
    return { url: u, ip: alamat[0] };      // sambungkan ke IP ini, bukan resolusi ulang
}</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Memeriksa lalu mengambil membuka celah balapan DNS</div>
    <p>Bila kode memvalidasi nama host, lalu memanggil <code>fetch</code> yang menyelesaikan DNS <em>sekali lagi</em>, penyerang dapat mengendalikan server DNS yang menjawab alamat publik pada pemeriksaan pertama dan <code>169.254.169.254</code> pada pemeriksaan kedua. Celah ini dikenal sebagai DNS rebinding. Solusinya adalah menyambung langsung ke alamat IP yang sudah divalidasi, bukan menyelesaikan nama host untuk kedua kalinya.</p>
</div>

<pre>Lapis tambahan yang lebih kuat:
- Jalankan pengambilan URL lewat proksi keluar dengan daftar putih
- Tempatkan layanan itu pada jaringan tanpa akses ke rentang internal
- Matikan pengikutan pengalihan, atau validasi ulang setiap lompatan
- Batasi ukuran balasan dan waktu tunggu</pre>

<h2>Pemeriksaan Cepat untuk Endpoint API</h2>
<pre>□ Autentikasi diperiksa — bukan hanya keberadaan token, tapi keabsahannya
□ Otorisasi memeriksa kepemilikan sumber daya, bukan sekadar peran
□ Masukan divalidasi dengan skema ketat yang menolak field asing
□ Laju permintaan dibatasi, terutama pada endpoint mahal
□ Galat tidak membocorkan jejak tumpukan atau struktur internal
□ Balasan tidak menyertakan field sensitif yang tidak diminta
□ Aksi penting tercatat di log audit beserta identitas pelakunya</pre>`,
    perintah: [
        "curl -H 'Origin: https://jahat.id' -I https://api.contoh.id/data",
        "curl -X POST -d 'url=http://169.254.169.254/latest/meta-data/' https://contoh.id/ambil-pratinjau",
        "curl -sI https://contoh.id | grep -i 'set-cookie\\|samesite'",
        "grep -rn 'Allow-Origin' src/",
        "grep -rn 'fetch(req\\.\\|axios.get(req\\.' src/"
    ],
    kuis: [
        {
            tanya: "Kenapa API yang mengautentikasi lewat header Authorization umumnya tidak memerlukan token CSRF?",
            opsi: [
                "Karena header Authorization dienkripsi oleh peramban",
                "Karena serangan CSRF bergantung pada kredensial yang dilampirkan peramban secara otomatis, sedangkan header Authorization harus ditambahkan JavaScript yang tidak dapat membaca token milik domain lain",
                "Karena token pada header selalu berumur pendek",
                "Karena permintaan dengan header Authorization tidak dapat dikirim lintas asal"
            ],
            benar: 1,
            penjelasan: "CSRF memanfaatkan cookie yang dilampirkan peramban ke domain tujuan tanpa campur tangan skrip. Header Authorization harus disetel secara eksplisit oleh kode, dan kebijakan asal-sama mencegah skrip di situs penyerang membaca token milik domain lain. Namun API yang juga menerima autentikasi berbasis cookie tetap membutuhkan perlindungan CSRF."
        },
        {
            tanya: "Sebuah API memantulkan header Origin ke Access-Control-Allow-Origin sambil menyetel Allow-Credentials true. Apa dampaknya?",
            opsi: [
                "Tidak ada, karena peramban tetap memblokir permintaan lintas asal",
                "Situs mana pun yang dikunjungi pengguna yang sedang login dapat memanggil API dengan cookie mereka dan membaca balasannya",
                "API menjadi tidak dapat diakses dari aplikasi resmi",
                "Balasan API akan selalu disimpan di cache peramban"
            ],
            benar: 1,
            penjelasan: "Memantulkan Origin berarti setiap asal disetujui, dan mengizinkan kredensial berarti cookie ikut terkirim serta balasannya boleh dibaca. Kombinasi keduanya membuat situs jahat mana pun dapat bertindak dan membaca data atas nama pengguna yang sedang login. Daftar putih asal yang eksplisit beserta header Vary: Origin adalah konfigurasi yang benar."
        },
        {
            tanya: "Kode memvalidasi bahwa nama host URL tidak menunjuk ke alamat internal, lalu memanggil fetch dengan URL itu. Kenapa ini masih rentan SSRF?",
            opsi: [
                "Karena validasi tidak memeriksa nomor port",
                "Karena fetch menyelesaikan DNS untuk kedua kalinya, sehingga penyerang dapat membuat nama host menjawab alamat publik saat divalidasi dan alamat internal saat diambil",
                "Karena fetch selalu mengabaikan hasil validasi sebelumnya",
                "Karena nama host tidak dapat divalidasi tanpa sertifikat TLS"
            ],
            benar: 1,
            penjelasan: "Ini DNS rebinding: penyerang mengendalikan server DNS untuk domainnya dan memberi jawaban berbeda pada dua resolusi berturut-turut dengan TTL sangat pendek. Pemeriksaan lolos, tetapi koneksi sesungguhnya menuju alamat internal. Perbaikannya adalah menyambung langsung ke alamat IP yang sudah divalidasi, ditambah pembatasan jaringan keluar sebagai lapis kedua."
        }
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
