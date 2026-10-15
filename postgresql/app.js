/* ==========================================================================
   POSTGRESQL — Platform Pembelajaran Interaktif
   Bahasa Indonesia
   ========================================================================== */

const TOPIK_SLUG = "postgresql";
const TOPIK_SUB  = "basis data relasional";

const MODUL = [
{
    id: 1,
    kategori: "1 · Fondasi",
    judul: "Arsitektur PostgreSQL: Proses, Memori & WAL",
    tingkat: "Dasar", durasi: "15 mnt",
    tag: ["arsitektur", "wal", "shared buffers", "mvcc", "proses"],
    ringkas: "Bagaimana PostgreSQL menyimpan dan melindungi data — dan kenapa memahami WAL menjelaskan hampir semua perilaku yang tampak aneh.",
    isi: `
<h2>Model Proses, Bukan Thread</h2>
<p>PostgreSQL membuat <strong>satu proses sistem operasi untuk setiap koneksi</strong>. Ini berbeda dari MySQL yang memakai thread, dan punya konsekuensi praktis yang besar.</p>

<pre>postmaster (proses induk)
   ├── backend  ← koneksi klien 1
   ├── backend  ← koneksi klien 2
   ├── backend  ← koneksi klien 3
   ├── background writer   (menulis halaman kotor ke disk)
   ├── WAL writer          (menulis log transaksi)
   ├── checkpointer        (menyinkronkan berkas data)
   ├── autovacuum launcher
   └── stats collector</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Inilah kenapa Anda WAJIB memakai connection pooler</div>
    <p>Setiap koneksi memakan beberapa megabyte memori dan satu slot proses, bahkan ketika sedang menganggur. Seribu koneksi menganggur berarti seribu proses yang membebani penjadwal sistem operasi. Aplikasi modern yang menjalankan puluhan pod dengan pool masing-masing sangat mudah menembus <code>max_connections</code>.</p>
    <p>Solusinya adalah <strong>PgBouncer</strong> atau <strong>pgcat</strong> di depan PostgreSQL, yang menggabungkan ribuan koneksi aplikasi menjadi puluhan koneksi sebenarnya.</p>
</div>

<h2>Write-Ahead Log</h2>
<p>Aturan emas PostgreSQL: <strong>perubahan dicatat ke WAL sebelum diterapkan ke berkas data</strong>. Ini yang membuat data tetap utuh meski server mati mendadak.</p>

<pre>1. COMMIT diterima
2. Catatan perubahan ditulis ke WAL dan di-fsync ke disk  ← titik aman
3. COMMIT dibalas ke klien
4. Halaman data di memori ditandai "kotor"
5. Nanti, checkpointer menuliskannya ke berkas data</pre>

<p>Bila server mati di antara langkah 3 dan 5, PostgreSQL memutar ulang WAL saat menyala dan memulihkan seluruh transaksi yang sudah di-commit. WAL juga menjadi fondasi <strong>replikasi</strong> dan <strong>point-in-time recovery</strong>.</p>

<div class="callout waspada">
    <div class="callout-judul">⚠️ fsync = off adalah undangan kehilangan data</div>
    <p>Menonaktifkan <code>fsync</code> memang membuat penulisan jauh lebih cepat, dan sesekali disarankan orang di internet untuk "meningkatkan performa". Konsekuensinya: <strong>mati listrik berarti basis data rusak dan tidak dapat dipulihkan</strong>. Ini hanya boleh dipakai untuk memuat data awal yang bisa diulang dari nol, tidak pernah untuk sistem yang menyimpan data sungguhan.</p>
</div>

<h2>Memori</h2>
<table>
<thead><tr><th>Parameter</th><th>Fungsi</th><th>Titik awal yang wajar</th></tr></thead>
<tbody>
<tr><td><code>shared_buffers</code></td><td>Cache halaman data milik PostgreSQL</td><td>25% RAM</td></tr>
<tr><td><code>effective_cache_size</code></td><td><em>Perkiraan</em> total cache termasuk milik OS — hanya memengaruhi keputusan perencana</td><td>50–75% RAM</td></tr>
<tr><td><code>work_mem</code></td><td>Memori per operasi sort/hash</td><td>16–64 MB</td></tr>
<tr><td><code>maintenance_work_mem</code></td><td>Untuk VACUUM dan CREATE INDEX</td><td>512 MB – 2 GB</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 work_mem dikalikan, bukan dibagi</div>
    <p><code>work_mem</code> berlaku <strong>per operasi</strong>, bukan per kueri dan bukan per koneksi. Satu kueri kompleks dengan lima operasi sort bisa memakai lima kali <code>work_mem</code>. Bila 100 koneksi menjalankan kueri semacam itu bersamaan dengan <code>work_mem = 256MB</code>, PostgreSQL bisa meminta ratusan gigabyte dan server terkena OOM killer. Setel nilai global yang konservatif, lalu naikkan per sesi untuk kueri berat tertentu.</p>
</div>

<h2>MVCC: Kenapa Pembaca Tidak Pernah Memblokir Penulis</h2>
<p>PostgreSQL memakai <strong>Multi-Version Concurrency Control</strong>. Saat sebuah baris diperbarui, versi lamanya tidak ditimpa — versi baru ditulis di sebelahnya, dan versi lama tetap ada untuk transaksi yang masih membutuhkannya.</p>

<pre>Transaksi A: SELECT * FROM produk WHERE id = 1;   → melihat versi lama
Transaksi B: UPDATE produk SET harga = 90000 ...  → membuat versi baru
Transaksi A: SELECT lagi                          → TETAP versi lama

Tidak ada yang menunggu. Tidak ada kunci baca.</pre>

<div class="callout info">
    <div class="callout-judul">💡 Harga yang dibayar MVCC</div>
    <p>Versi lama yang sudah tidak dibutuhkan siapa pun disebut <strong>dead tuple</strong>, dan tetap memakan ruang di disk. <code>VACUUM</code> bertugas membersihkannya. Inilah sebabnya tabel PostgreSQL yang sering di-<em>update</em> bisa membengkak jauh melebihi ukuran datanya — masalah yang dikenal sebagai <em>bloat</em>, dan dibahas tersendiri di modul VACUUM.</p>
</div>

<h2>Memeriksa Keadaan</h2>
<pre>-- Versi dan konfigurasi
SELECT version();
SHOW shared_buffers;

-- Koneksi aktif dan apa yang sedang mereka kerjakan
SELECT pid, usename, state, wait_event_type,
       now() - query_start AS durasi, left(query, 60)
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY durasi DESC;

-- Ukuran basis data dan tabel terbesar
SELECT pg_size_pretty(pg_database_size(current_database()));

SELECT relname,
       pg_size_pretty(pg_total_relation_size(relid)) AS total
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;</pre>`,
    perintah: [
        "psql -U postgres -c 'SELECT version();'",
        "SELECT * FROM pg_stat_activity WHERE state != 'idle';",
        "SHOW shared_buffers;",
        "SELECT pg_size_pretty(pg_database_size(current_database()));",
        "SELECT * FROM pg_settings WHERE name = 'work_mem';"
    ],
    kuis: [
        {
            tanya: "Kenapa aplikasi dengan banyak pod hampir selalu membutuhkan connection pooler seperti PgBouncer?",
            opsi: [
                "Karena PostgreSQL tidak mendukung koneksi bersamaan",
                "Karena PostgreSQL membuat satu proses OS per koneksi, sehingga ribuan koneksi menganggur pun tetap memakan memori dan membebani penjadwal sistem",
                "Karena PgBouncer mengenkripsi lalu lintas basis data",
                "Karena PostgreSQL membatasi maksimal 50 koneksi"
            ],
            benar: 1,
            penjelasan: "Model proses PostgreSQL berarti setiap koneksi punya biaya tetap berupa memori dan slot proses, terlepas dari sedang dipakai atau tidak. Puluhan pod yang masing-masing memelihara pool koneksi cepat menembus max_connections. Pooler menggabungkan ribuan koneksi aplikasi menjadi puluhan koneksi sebenarnya ke server."
        },
        {
            tanya: "Apa risiko menyetel work_mem ke nilai besar secara global?",
            opsi: [
                "Kueri menjadi lebih lambat karena memori terlalu besar",
                "work_mem berlaku per operasi sort/hash, sehingga banyak kueri kompleks yang berjalan bersamaan bisa mengalikan pemakaian memori sampai server terkena OOM",
                "PostgreSQL akan menolak menyala",
                "Indeks menjadi tidak valid"
            ],
            benar: 1,
            penjelasan: "Nilai work_mem dialokasikan untuk setiap operasi yang membutuhkannya, bukan sekali per kueri apalagi per koneksi. Satu kueri dengan beberapa sort dan hash join dapat memakai kelipatan dari nilai tersebut, dan bila banyak koneksi melakukannya bersamaan, total permintaan memori bisa jauh melampaui kapasitas server."
        }
    ]
},
{
    id: 2,
    kategori: "2 · Tipe Data & Skema",
    judul: "Memilih Tipe Data yang Tepat",
    tingkat: "Dasar", durasi: "14 mnt",
    tag: ["tipe data", "numeric", "timestamptz", "uuid", "jsonb", "enum"],
    ringkas: "Keputusan tipe data sulit diubah setelah tabel berisi jutaan baris — dan beberapa pilihan yang umum ternyata merupakan jebakan.",
    isi: `
<h2>Uang: Jangan Pernah Pakai float</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 Kesalahan yang paling mahal</div>
    <pre>SELECT 0.1::float8 + 0.2::float8 = 0.3::float8;
-- false

SELECT 0.1::numeric + 0.2::numeric = 0.3::numeric;
-- true</pre>
    <p>Tipe <code>real</code> dan <code>double precision</code> adalah bilangan biner mengambang yang <strong>tidak bisa merepresentasikan pecahan desimal secara tepat</strong>. Untuk uang, gunakan <code>numeric(15,2)</code> — atau, yang sering lebih baik, simpan sebagai <strong>bilangan bulat dalam satuan terkecil</strong> memakai <code>bigint</code>. Cara kedua menghilangkan seluruh pertanyaan pembulatan.</p>
</div>

<h2>Waktu: timestamptz, Selalu</h2>
<table>
<thead><tr><th>Tipe</th><th>Menyimpan zona waktu?</th><th>Pakai untuk</th></tr></thead>
<tbody>
<tr><td><code>timestamp</code></td><td><strong>Tidak</strong></td><td>Hampir tidak pernah</td></tr>
<tr><td><code>timestamptz</code></td><td>Ya (dinormalisasi ke UTC)</td><td><strong>Semua stempel waktu</strong></td></tr>
<tr><td><code>date</code></td><td>—</td><td>Tanggal lahir, tanggal jatuh tempo</td></tr>
<tr><td><code>interval</code></td><td>—</td><td>Durasi</td></tr>
</tbody>
</table>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Nama timestamptz menyesatkan</div>
    <p><code>timestamptz</code> <em>tidak</em> menyimpan zona waktunya. Ia mengonversi nilai masuk ke UTC, menyimpannya, lalu mengonversi kembali ke zona waktu sesi saat dibaca. Itulah perilaku yang hampir selalu Anda inginkan. Sedangkan <code>timestamp</code> polos menyimpan angka apa adanya tanpa konteks — dua sistem di zona berbeda akan menafsirkannya berbeda, dan bug seperti ini baru ketahuan saat pergantian waktu musim panas.</p>
</div>

<pre>SET timezone = 'Asia/Jakarta';
SELECT now();                          -- 2026-07-28 14:30:00+07
SELECT now() AT TIME ZONE 'UTC';       -- 2026-07-28 07:30:00

-- Rentang waktu yang BENAR (hindari BETWEEN untuk timestamp)
WHERE dibuat_pada &gt;= '2026-07-01'
  AND dibuat_pada &lt;  '2026-08-01'</pre>

<h2>Kunci Utama: bigint atau UUID?</h2>
<table>
<thead><tr><th></th><th><code>bigint</code> identity</th><th><code>uuid</code> v4</th><th><code>uuid</code> v7</th></tr></thead>
<tbody>
<tr><td>Ukuran</td><td>8 byte</td><td>16 byte</td><td>16 byte</td></tr>
<tr><td>Bisa dibuat klien</td><td>Tidak</td><td>Ya</td><td>Ya</td></tr>
<tr><td>Bisa ditebak</td><td>Ya</td><td>Tidak</td><td>Sebagian (waktu)</td></tr>
<tr><td>Lokalitas indeks</td><td>Sangat baik</td><td><strong>Buruk</strong></td><td>Sangat baik</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 UUID v4 sebagai kunci utama merusak kinerja tulis</div>
    <p>UUID v4 sepenuhnya acak, sehingga setiap penyisipan mendarat di posisi acak dalam B-tree. Akibatnya halaman indeks terus-menerus terpecah dan cache menjadi tidak efektif — pada tabel besar, penyisipan bisa jauh lebih lambat daripada kunci berurutan.</p>
    <p><strong>UUID v7</strong> menyelesaikan ini dengan menaruh stempel waktu di bagian depan, sehingga nilainya menaik seperti bilangan berurutan namun tetap sulit ditebak. Bila butuh ID yang dibuat di sisi klien, pilih v7.</p>
</div>

<pre>-- Kunci berurutan gaya modern
CREATE TABLE pesanan (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ...
);
-- Lebih baik daripada serial: mengikuti standar SQL
-- dan tidak bisa ditimpa nilai manual secara tidak sengaja.</pre>

<h2>Teks</h2>
<pre>-- Ketiganya disimpan dengan cara yang SAMA di PostgreSQL
text            -- gunakan ini secara bawaan
varchar(n)      -- hanya bila batas panjang memang aturan bisnis
char(n)         -- jangan pakai: dipadding spasi</pre>

<div class="callout info">
    <div class="callout-judul">💡 varchar(255) adalah kebiasaan warisan MySQL</div>
    <p>Di PostgreSQL, <code>varchar(255)</code> tidak lebih cepat atau lebih hemat daripada <code>text</code>. Batas panjang hanya menambahkan pemeriksaan constraint. Pakai <code>text</code>, lalu tambahkan <code>CHECK (length(kolom) &lt;= 100)</code> bila memang ada aturan bisnisnya — constraint semacam itu jauh lebih mudah diubah daripada tipe kolom.</p>
</div>

<h2>JSONB</h2>
<pre>CREATE TABLE peristiwa (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    jenis text NOT NULL,
    muatan jsonb NOT NULL
);

CREATE INDEX idx_muatan ON peristiwa USING gin (muatan);

SELECT * FROM peristiwa WHERE muatan @&gt; '{"status":"gagal"}';
SELECT muatan-&gt;&gt;'pengguna_id' FROM peristiwa;

-- Indeks pada satu jalur saja: jauh lebih kecil
CREATE INDEX idx_pengguna ON peristiwa ((muatan-&gt;&gt;'pengguna_id'));</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ JSONB bukan alasan untuk melewatkan perancangan skema</div>
    <p>JSONB sangat berguna untuk data yang benar-benar tidak berstruktur: muatan webhook, atribut produk yang berbeda-beda per kategori, konfigurasi. Ia <strong>bukan</strong> pengganti kolom untuk data yang strukturnya Anda ketahui. Kolom biasa memberi Anda constraint, tipe yang ditegakkan, statistik perencana yang akurat, dan indeks yang jauh lebih efisien.</p>
</div>

<h2>Tipe Lain yang Sering Terlupakan</h2>
<pre>-- Rentang: sangat berguna untuk jadwal &amp; harga berjangka
CREATE TABLE pemesanan (
    kamar_id int,
    masa tstzrange,
    EXCLUDE USING gist (kamar_id WITH =, masa WITH &amp;&amp;)
);
-- Constraint di atas MENCEGAH pemesanan yang bertumpang tindih
-- di tingkat basis data — tidak mungkin ada balapan.

-- Array
tag text[]
WHERE 'promo' = ANY(tag)

-- Alamat jaringan
alamat inet, jaringan cidr

-- Enum: menambah nilai mudah, MENGHAPUS sulit
CREATE TYPE status_pesanan AS ENUM ('menunggu','dibayar','dikirim');</pre>

<div class="callout tip">
    <div class="callout-judul">📌 Enum atau tabel referensi?</div>
    <p><strong>Enum</strong> hemat ruang dan cepat, tetapi mengubah atau menghapus nilainya merepotkan. <strong>Tabel referensi</strong> dengan foreign key lebih fleksibel: nilai bisa ditambah, dinonaktifkan, diberi label tampilan dan urutan. Untuk himpunan yang benar-benar stabil, enum cukup; untuk yang mungkin berkembang, tabel referensi lebih aman.</p>
</div>`,
    perintah: [
        "\\d+ nama_tabel",
        "SELECT 0.1::float8 + 0.2::float8 = 0.3::float8;",
        "SHOW timezone;",
        "SELECT pg_column_size('teks'::text);",
        "SELECT * FROM pg_type WHERE typname = 'status_pesanan';"
    ],
    kuis: [
        {
            tanya: "Kenapa UUID v4 adalah pilihan yang buruk sebagai kunci utama tabel besar dengan banyak penyisipan?",
            opsi: [
                "Karena UUID v4 terlalu panjang untuk disimpan",
                "Karena nilainya sepenuhnya acak sehingga setiap penyisipan mendarat di posisi acak dalam B-tree, menyebabkan pemecahan halaman dan cache yang tidak efektif",
                "Karena UUID v4 tidak dijamin unik",
                "Karena PostgreSQL tidak punya tipe uuid bawaan"
            ],
            benar: 1,
            penjelasan: "Kunci yang menaik membuat penyisipan selalu terjadi di ujung indeks, sehingga halaman yang sama tetap panas di cache. UUID v4 yang acak menyebar penyisipan ke seluruh indeks. UUID v7 memperbaiki ini dengan menempatkan stempel waktu di bagian depan sehingga urutannya menaik."
        },
        {
            tanya: "Kenapa timestamptz lebih dianjurkan daripada timestamp untuk menyimpan stempel waktu?",
            opsi: [
                "Karena timestamptz menyimpan nama zona waktu asli",
                "Karena timestamptz menormalkan nilai ke UTC saat disimpan dan mengonversinya kembali sesuai zona sesi, sehingga tidak ambigu antar sistem",
                "Karena timestamp tidak mendukung nilai pecahan detik",
                "Karena timestamptz memakai ruang penyimpanan lebih kecil"
            ],
            benar: 1,
            penjelasan: "timestamp polos menyimpan angka tanpa konteks zona, sehingga dua sistem di zona berbeda menafsirkannya berbeda. timestamptz menyimpan titik waktu absolut dalam UTC dan menampilkannya sesuai zona sesi pembaca, yang menghilangkan seluruh kelas bug terkait zona waktu."
        }
    ]
},
{
    id: 3,
    kategori: "3 · Indeks & Kinerja",
    judul: "Indeks: B-tree, GIN, Partial & Covering",
    tingkat: "Menengah", durasi: "17 mnt",
    tag: ["indeks", "btree", "gin", "gist", "partial", "covering"],
    ringkas: "Kapan indeks membantu, kapan justru merugikan, dan aturan urutan kolom pada indeks gabungan yang menentukan segalanya.",
    isi: `
<h2>Jenis Indeks dan Kegunaannya</h2>
<table>
<thead><tr><th>Jenis</th><th>Untuk</th><th>Operator yang didukung</th></tr></thead>
<tbody>
<tr><td><strong>B-tree</strong></td><td>Bawaan; kesetaraan, rentang, pengurutan</td><td><code>= &lt; &gt; BETWEEN LIKE 'awalan%'</code></td></tr>
<tr><td><strong>GIN</strong></td><td>JSONB, array, pencarian teks penuh</td><td><code>@&gt; ? &amp;&amp; @@</code></td></tr>
<tr><td><strong>GiST</strong></td><td>Geometri, rentang, kedekatan</td><td><code>&amp;&amp; &lt;-&gt; @&gt;</code></td></tr>
<tr><td><strong>BRIN</strong></td><td>Tabel sangat besar yang terurut alami</td><td>Rentang; indeks sangat kecil</td></tr>
<tr><td><strong>Hash</strong></td><td>Hanya kesetaraan</td><td><code>=</code> — jarang lebih baik dari B-tree</td></tr>
</tbody>
</table>

<h2>Aturan Urutan Kolom pada Indeks Gabungan</h2>
<pre>CREATE INDEX idx ON pesanan (pengguna_id, status, dibuat_pada);</pre>

<p>Indeks ini bisa dipakai untuk kueri yang menyaring:</p>
<pre>✅ pengguna_id
✅ pengguna_id + status
✅ pengguna_id + status + dibuat_pada
❌ status saja                    ← tidak bisa (melompati kolom pertama)
❌ dibuat_pada saja               ← tidak bisa</pre>

<div class="callout info">
    <div class="callout-judul">💡 Aturan yang perlu diingat</div>
    <p>Indeks gabungan bisa dipakai untuk <strong>awalan kiri</strong> dari daftar kolomnya. Urutan yang baik: kolom yang dipakai dengan <strong>kesetaraan</strong> di depan, kolom <strong>rentang</strong> di belakang. Menaruh kolom rentang di tengah membuat kolom sesudahnya tidak bisa dimanfaatkan untuk penyaringan.</p>
</div>

<h2>Indeks Parsial</h2>
<pre>-- Hanya 2% pesanan berstatus menunggu, tapi itu yang paling sering dikueri
CREATE INDEX idx_menunggu ON pesanan (dibuat_pada)
WHERE status = 'menunggu';

-- Indeksnya berukuran 2% dari indeks penuh,
-- muat sepenuhnya di cache, dan jauh lebih cepat.

-- Sangat berguna untuk penghapusan lunak
CREATE INDEX idx_aktif ON pengguna (email)
WHERE dihapus_pada IS NULL;</pre>

<div class="callout tip">
    <div class="callout-judul">📌 Indeks parsial sering merupakan kemenangan terbesar</div>
    <p>Bila sebagian besar kueri Anda hanya menyentuh sebagian kecil baris — baris aktif, pesanan belum selesai, catatan yang belum diproses — indeks parsial memberi peningkatan yang dramatis dengan biaya penyimpanan jauh lebih kecil, sekaligus mengurangi beban pemeliharaan saat penulisan.</p>
</div>

<h2>Covering Index</h2>
<pre>CREATE INDEX idx_covering ON pesanan (pengguna_id) INCLUDE (total, status);

SELECT total, status FROM pesanan WHERE pengguna_id = 55;
-- PostgreSQL bisa menjawab sepenuhnya dari indeks
-- tanpa menyentuh tabel sama sekali (index-only scan).</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Index-only scan butuh visibility map yang mutakhir</div>
    <p>PostgreSQL tetap harus memastikan baris terlihat oleh transaksi Anda. Ia bisa melewatkan pemeriksaan itu hanya bila halaman ditandai "semua terlihat" pada visibility map — dan penanda itu diperbarui oleh <strong>VACUUM</strong>. Pada tabel yang sering berubah dan jarang di-vacuum, index-only scan tidak akan terjadi meski indeksnya sudah tepat.</p>
</div>

<h2>Kapan Indeks Merugikan</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 Setiap indeks memperlambat penulisan</div>
    <p>Setiap <code>INSERT</code>, <code>UPDATE</code>, dan <code>DELETE</code> harus memperbarui <em>semua</em> indeks pada tabel tersebut. Tabel dengan sepuluh indeks membayar sepuluh kali biaya pemeliharaan pada setiap penulisan. Indeks juga memakan ruang disk dan memori cache yang seharusnya dipakai data panas.</p>
    <p>Indeks juga <strong>tidak berguna</strong> pada tabel yang sangat kecil, pada kolom dengan sedikit nilai unik seperti boolean (kecuali sebagai indeks parsial), dan ketika kueri tetap mengambil sebagian besar baris.</p>
</div>

<h2>Menemukan Indeks yang Tidak Terpakai</h2>
<pre>SELECT schemaname, relname, indexrelname,
       idx_scan,
       pg_size_pretty(pg_relation_size(indexrelid)) AS ukuran
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexrelid NOT IN (SELECT conindid FROM pg_constraint)
ORDER BY pg_relation_size(indexrelid) DESC;</pre>

<h2>Membuat Indeks Tanpa Mengunci</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 CREATE INDEX biasa mengunci penulisan</div>
    <pre>-- ❌ Memblokir SEMUA penulisan sampai selesai.
CREATE INDEX idx ON pesanan (pengguna_id);

-- ✅ Tidak memblokir penulisan
CREATE INDEX CONCURRENTLY idx ON pesanan (pengguna_id);</pre>
    <p>Versi <code>CONCURRENTLY</code> lebih lambat dan tidak bisa dijalankan di dalam blok transaksi. Bila gagal di tengah jalan, ia meninggalkan indeks yang <strong>tidak valid</strong> — harus dihapus dan diulang:</p>
    <pre>SELECT indexrelid::regclass FROM pg_index WHERE NOT indisvalid;
DROP INDEX CONCURRENTLY idx;</pre>
</div>

<h2>Kenapa Indeks Tidak Terpakai</h2>
<pre>-- ❌ Fungsi pada kolom membuat indeks tidak bisa dipakai
WHERE lower(email) = 'budi@contoh.com'
-- ✅ Buat indeks ekspresi yang sesuai
CREATE INDEX ON pengguna (lower(email));

-- ❌ Tipe tidak cocok memicu konversi
WHERE id_teks = 12345          -- kolom text dibandingkan integer
-- ✅ WHERE id_teks = '12345'

-- ❌ LIKE dengan wildcard di depan
WHERE nama LIKE '%budi%'
-- ✅ Gunakan indeks trigram
CREATE EXTENSION pg_trgm;
CREATE INDEX ON pengguna USING gin (nama gin_trgm_ops);</pre>`,
    perintah: [
        "\\di+",
        "SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;",
        "CREATE INDEX CONCURRENTLY idx ON pesanan (pengguna_id);",
        "SELECT indexrelid::regclass FROM pg_index WHERE NOT indisvalid;",
        "REINDEX INDEX CONCURRENTLY idx;"
    ],
    kuis: [
        {
            tanya: "Ada indeks pada (pengguna_id, status, dibuat_pada). Kueri mana yang TIDAK bisa memanfaatkannya untuk penyaringan?",
            opsi: [
                "WHERE pengguna_id = 55",
                "WHERE status = 'menunggu'",
                "WHERE pengguna_id = 55 AND status = 'menunggu'",
                "WHERE pengguna_id = 55 AND status = 'menunggu' AND dibuat_pada > '2026-01-01'"
            ],
            benar: 1,
            penjelasan: "Indeks gabungan hanya dapat dimanfaatkan mulai dari kolom paling kiri secara berurutan. Menyaring hanya berdasarkan status berarti melompati kolom pertama, sehingga PostgreSQL tidak bisa menelusuri B-tree secara efisien dan biasanya akan memindai seluruh tabel."
        },
        {
            tanya: "Kenapa CREATE INDEX CONCURRENTLY dianjurkan untuk tabel produksi yang besar?",
            opsi: [
                "Karena hasilnya menghasilkan indeks yang lebih kecil",
                "Karena CREATE INDEX biasa mengunci seluruh penulisan ke tabel sampai selesai, yang pada tabel besar bisa berlangsung berjam-jam",
                "Karena CONCURRENTLY berjalan jauh lebih cepat",
                "Karena hanya CONCURRENTLY yang mendukung indeks gabungan"
            ],
            benar: 1,
            penjelasan: "CREATE INDEX biasa mengambil kunci yang memblokir INSERT, UPDATE, dan DELETE sepanjang pembuatan indeks. Versi CONCURRENTLY memindai tabel dua kali dan lebih lambat, tetapi tidak menghalangi penulisan. Perlu diingat ia tidak bisa dijalankan dalam transaksi dan meninggalkan indeks tidak valid bila gagal."
        }
    ]
},
{
    id: 4,
    kategori: "3 · Indeks & Kinerja",
    judul: "Membaca EXPLAIN ANALYZE",
    tingkat: "Menengah", durasi: "16 mnt",
    tag: ["explain", "analyze", "query plan", "seq scan", "statistik"],
    ringkas: "Menerjemahkan rencana eksekusi menjadi tindakan nyata: mengenali node yang mahal, membaca selisih estimasi, dan menemukan akar masalah.",
    isi: `
<h2>Bentuk Perintahnya</h2>
<pre>EXPLAIN (ANALYZE, BUFFERS)
SELECT p.id, p.total, u.nama
FROM pesanan p
JOIN pengguna u ON u.id = p.pengguna_id
WHERE p.status = 'menunggu'
  AND p.dibuat_pada &gt;= now() - interval '7 days';</pre>

<table>
<thead><tr><th>Opsi</th><th>Fungsi</th></tr></thead>
<tbody>
<tr><td><code>ANALYZE</code></td><td><strong>Benar-benar menjalankan</strong> kueri dan melaporkan waktu sesungguhnya</td></tr>
<tr><td><code>BUFFERS</code></td><td>Menampilkan berapa halaman dibaca dari cache vs disk — sangat penting</td></tr>
<tr><td><code>VERBOSE</code></td><td>Menampilkan kolom yang dikeluarkan tiap node</td></tr>
<tr><td><code>SETTINGS</code></td><td>Menampilkan parameter yang tidak bernilai bawaan</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 ANALYZE benar-benar menjalankan kueri</div>
    <p>Menjalankan <code>EXPLAIN ANALYZE</code> pada <code>DELETE</code> atau <code>UPDATE</code> akan <strong>benar-benar mengubah data</strong>. Bila hanya ingin melihat rencananya, bungkus dalam transaksi yang dibatalkan:</p>
    <pre>BEGIN;
EXPLAIN ANALYZE DELETE FROM pesanan WHERE ...;
ROLLBACK;</pre>
</div>

<h2>Membaca Keluarannya</h2>
<pre>Hash Join  (cost=12.4..1842.3 rows=520 width=48)
           (actual time=0.412..18.221 rows=48213 loops=1)
  Hash Cond: (p.pengguna_id = u.id)
  Buffers: shared hit=1204 read=8891
  -&gt;  Seq Scan on pesanan p  (cost=0..1420.0 rows=520 width=24)
                             (actual time=0.018..9.104 rows=48213 loops=1)
        Filter: (status = 'menunggu')
        Rows Removed by Filter: 951787</pre>

<div class="callout info">
    <div class="callout-judul">💡 Cara membacanya</div>
    <ul>
        <li>Baca <strong>dari dalam ke luar</strong> — node terdalam berjalan lebih dulu.</li>
        <li><code>cost</code> adalah <em>perkiraan</em> dalam satuan sembarang; <code>actual time</code> adalah milidetik sungguhan.</li>
        <li><code>loops=N</code> berarti node dijalankan N kali — <strong>waktu yang ditampilkan adalah per-loop</strong>, jadi kalikan.</li>
        <li><code>Rows Removed by Filter</code> yang besar berarti banyak pekerjaan terbuang.</li>
    </ul>
</div>

<h2>Petunjuk Terpenting: Selisih Estimasi</h2>
<pre>rows=520 (perkiraan)  vs  rows=48213 (kenyataan)
Meleset 93 kali lipat!</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Selisih besar adalah akar dari sebagian besar rencana yang buruk</div>
    <p>Perencana memilih strategi berdasarkan perkiraan jumlah baris. Perkiraan yang meleset jauh membuatnya memilih nested loop padahal seharusnya hash join, atau sebaliknya. Penyebab yang biasa:</p>
    <ul>
        <li><strong>Statistik basi</strong> — jalankan <code>ANALYZE nama_tabel;</code></li>
        <li><strong>Korelasi antar kolom</strong> — perencana menganggap kolom saling bebas.</li>
        <li><strong>Distribusi data yang miring</strong> — naikkan target statistik kolom tersebut.</li>
    </ul>
    <pre>CREATE STATISTICS stat_pesanan (dependencies)
ON status, jenis_pembayaran FROM pesanan;
ANALYZE pesanan;

ALTER TABLE pesanan ALTER COLUMN status SET STATISTICS 1000;</pre>
</div>

<h2>Jenis Node dan Artinya</h2>
<table>
<thead><tr><th>Node</th><th>Arti</th><th>Perlu dikhawatirkan bila…</th></tr></thead>
<tbody>
<tr><td><strong>Seq Scan</strong></td><td>Memindai seluruh tabel</td><td>Tabel besar tetapi hanya sedikit baris yang diambil</td></tr>
<tr><td><strong>Index Scan</strong></td><td>Menelusuri indeks lalu mengambil baris</td><td>Biasanya baik</td></tr>
<tr><td><strong>Index Only Scan</strong></td><td>Dijawab dari indeks saja</td><td>Terbaik</td></tr>
<tr><td><strong>Bitmap Heap Scan</strong></td><td>Kumpulkan lokasi dulu, baru baca terurut</td><td>Wajar untuk jumlah baris menengah</td></tr>
<tr><td><strong>Nested Loop</strong></td><td>Untuk tiap baris kiri, cari di kanan</td><td>Sisi kiri berisi banyak baris</td></tr>
<tr><td><strong>Hash Join</strong></td><td>Bangun tabel hash lalu telusuri</td><td>Muncul <code>Batches &gt; 1</code> — kehabisan work_mem</td></tr>
<tr><td><strong>Sort</strong></td><td>Mengurutkan</td><td>Muncul <code>external merge</code> — tumpah ke disk</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Seq Scan tidak selalu buruk</div>
    <p>Bila kueri mengambil lebih dari sekitar 5–10% baris tabel, memindai seluruh tabel secara berurutan justru <strong>lebih cepat</strong> daripada melompat-lompat lewat indeks. Perencana tahu ini. Memaksa penggunaan indeks dengan <code>SET enable_seqscan = off</code> hanya berguna untuk <em>menguji</em> apakah indeks akan membantu — jangan pernah dipakai di produksi.</p>
</div>

<h2>Tanda Tumpah ke Disk</h2>
<pre>Sort Method: external merge  Disk: 24560kB      ← work_mem kurang
Buckets: 1024  Batches: 8  Memory Usage: 4096kB ← hash join tumpah</pre>

<pre>SET work_mem = '256MB';   -- hanya untuk sesi ini, lalu bandingkan lagi</pre>

<h2>Menemukan Kueri yang Perlu Diperiksa</h2>
<pre>CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

SELECT
    left(query, 80) AS kueri,
    calls,
    round(total_exec_time::numeric, 1) AS total_ms,
    round(mean_exec_time::numeric, 2)  AS rata_ms,
    rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;</pre>

<div class="callout tip">
    <div class="callout-judul">📌 Urutkan berdasarkan total, bukan rata-rata</div>
    <p>Kueri yang butuh 5 detik tetapi hanya jalan sekali sehari kurang penting daripada kueri 50 milidetik yang dipanggil sejuta kali. <code>total_exec_time</code> menunjukkan di mana waktu server Anda sebenarnya habis — dan itulah yang paling layak dioptimalkan.</p>
</div>

<pre>-- Mencatat kueri lambat ke log
ALTER SYSTEM SET log_min_duration_statement = '1000ms';
SELECT pg_reload_conf();</pre>`,
    perintah: [
        "EXPLAIN (ANALYZE, BUFFERS) SELECT ...;",
        "ANALYZE nama_tabel;",
        "SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;",
        "SET work_mem = '256MB';",
        "ALTER SYSTEM SET log_min_duration_statement = '1000ms';"
    ],
    kuis: [
        {
            tanya: "Sebuah node menunjukkan rows=520 (perkiraan) tetapi rows=48213 (kenyataan). Apa arti dan tindakan pertamanya?",
            opsi: [
                "Kueri berhasil dijalankan dengan sangat efisien",
                "Perkiraan perencana meleset jauh sehingga strategi yang dipilih kemungkinan salah; jalankan ANALYZE untuk menyegarkan statistik",
                "Ada indeks yang rusak dan perlu di-REINDEX",
                "Nilai work_mem terlalu besar"
            ],
            benar: 1,
            penjelasan: "Perencana memilih algoritma join dan metode akses berdasarkan perkiraan jumlah baris. Selisih puluhan kali lipat membuatnya memilih strategi yang tidak sesuai, misalnya nested loop untuk himpunan yang ternyata besar. Langkah pertama adalah menyegarkan statistik, lalu mempertimbangkan statistik diperluas bila ada korelasi antar kolom."
        },
        {
            tanya: "Apa arti 'Sort Method: external merge Disk: 24560kB' pada rencana eksekusi?",
            opsi: [
                "Pengurutan dilakukan sepenuhnya di memori dengan sangat efisien",
                "Operasi sort melampaui work_mem sehingga tumpah ke disk, yang jauh lebih lambat",
                "Indeks yang dipakai sudah tidak valid",
                "Tabel perlu di-VACUUM"
            ],
            benar: 1,
            penjelasan: "Ketika data yang perlu diurutkan tidak muat dalam work_mem, PostgreSQL memakai algoritma merge eksternal yang menulis potongan sementara ke disk. Ini jauh lebih lambat daripada quicksort di memori. Menaikkan work_mem untuk sesi tersebut, atau mengurangi jumlah baris yang perlu diurutkan, akan menghilangkannya."
        }
    ]
},
{
    id: 5,
    kategori: "4 · Transaksi",
    judul: "Transaksi, Tingkat Isolasi & Deadlock",
    tingkat: "Menengah", durasi: "16 mnt",
    tag: ["transaksi", "isolasi", "deadlock", "lock", "serializable"],
    ringkas: "Apa yang benar-benar dijamin tiap tingkat isolasi, kenapa deadlock terjadi, dan cara mengunci baris tanpa mematikan konkurensi.",
    isi: `
<h2>Tingkat Isolasi</h2>
<table>
<thead><tr><th>Tingkat</th><th>Dirty read</th><th>Non-repeatable read</th><th>Phantom read</th><th>Anomali serialisasi</th></tr></thead>
<tbody>
<tr><td><strong>Read Committed</strong> (bawaan)</td><td>Tidak</td><td>Mungkin</td><td>Mungkin</td><td>Mungkin</td></tr>
<tr><td>Repeatable Read</td><td>Tidak</td><td>Tidak</td><td>Tidak</td><td>Mungkin</td></tr>
<tr><td>Serializable</td><td>Tidak</td><td>Tidak</td><td>Tidak</td><td><strong>Tidak</strong></td></tr>
</tbody>
</table>

<div class="callout info">
    <div class="callout-judul">💡 PostgreSQL tidak punya Read Uncommitted sungguhan</div>
    <p>Karena MVCC, PostgreSQL tidak pernah membaca data yang belum di-commit. Meminta Read Uncommitted akan diperlakukan sebagai Read Committed. Perhatikan juga bahwa Repeatable Read di PostgreSQL sudah mencegah phantom read — lebih kuat daripada yang diwajibkan standar SQL.</p>
</div>

<h2>Jebakan Read Committed</h2>
<pre>-- Setiap PERNYATAAN melihat potret terbaru, bukan potret transaksi
BEGIN;
SELECT stok FROM produk WHERE id = 1;    -- 10
-- transaksi lain melakukan UPDATE dan COMMIT
SELECT stok FROM produk WHERE id = 1;    -- 5  ← BERUBAH!
COMMIT;</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Pola baca-lalu-tulis yang rusak</div>
    <pre>-- ❌ Ada celah balapan
SELECT stok FROM produk WHERE id = 1;         -- aplikasi membaca 1
-- transaksi lain juga membaca 1 di detik yang sama
UPDATE produk SET stok = 0 WHERE id = 1;      -- keduanya menjual!

-- ✅ Biarkan basis data yang menghitung
UPDATE produk SET stok = stok - 1
WHERE id = 1 AND stok &gt;= 1
RETURNING stok;
-- Bila tidak ada baris yang dikembalikan, stok memang habis.</pre>
</div>

<h2>Penguncian Eksplisit</h2>
<pre>-- Kunci baris; transaksi lain MENUNGGU
SELECT * FROM produk WHERE id = 1 FOR UPDATE;

-- Jangan menunggu, langsung gagal
SELECT * FROM produk WHERE id = 1 FOR UPDATE NOWAIT;

-- Lewati baris yang sedang dikunci — POLA ANTREAN
SELECT * FROM tugas
WHERE status = 'menunggu'
ORDER BY dibuat_pada
LIMIT 10
FOR UPDATE SKIP LOCKED;</pre>

<div class="callout tip">
    <div class="callout-judul">📌 SKIP LOCKED membuat PostgreSQL menjadi antrean yang layak</div>
    <p>Dengan <code>FOR UPDATE SKIP LOCKED</code>, sepuluh pekerja bisa mengambil pekerjaan dari tabel yang sama tanpa saling menunggu — masing-masing melewati baris yang sudah dipegang pekerja lain. Untuk beban kerja menengah, ini sering menghilangkan kebutuhan akan broker pesan terpisah, sekaligus memberi Anda transaksi yang sama dengan data bisnis.</p>
</div>

<h2>Deadlock</h2>
<pre>Transaksi A                    Transaksi B
UPDATE akun SET .. WHERE id=1  UPDATE akun SET .. WHERE id=2
                               UPDATE akun SET .. WHERE id=1  ← tunggu A
UPDATE akun SET .. WHERE id=2  ← tunggu B
                    DEADLOCK</pre>

<p>PostgreSQL mendeteksinya setelah <code>deadlock_timeout</code> (bawaan 1 detik) dan membatalkan salah satu transaksi dengan <code>SQLSTATE 40P01</code>.</p>

<div class="callout info">
    <div class="callout-judul">💡 Pencegahan yang paling efektif</div>
    <p><strong>Selalu kunci sumber daya dalam urutan yang konsisten.</strong> Bila setiap transaksi mengunci akun dengan ID menaik, deadlock secara struktural tidak mungkin terjadi:</p>
    <pre>SELECT * FROM akun
WHERE id IN (LEAST(a, b), GREATEST(a, b))
ORDER BY id
FOR UPDATE;</pre>
    <p>Aplikasi juga harus siap mengulang transaksi yang gagal karena deadlock — ini kondisi sementara yang normal, bukan bug.</p>
</div>

<h2>Serializable untuk Invarian yang Rumit</h2>
<pre>BEGIN ISOLATION LEVEL SERIALIZABLE;
-- Aturan bisnis: minimal 1 dokter harus tetap berjaga
SELECT count(*) FROM jadwal WHERE berjaga = true;   -- 2
UPDATE jadwal SET berjaga = false WHERE dokter = 'Ani';
COMMIT;
-- Bila dua dokter mencoba keluar jaga bersamaan,
-- salah satunya GAGAL dengan SQLSTATE 40001.</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Serializable mewajibkan logika retry</div>
    <p>Tingkat ini mendeteksi konflik dan <strong>membatalkan</strong> transaksi dengan <code>serialization_failure</code>. Ini bukan kesalahan aplikasi — ini cara kerjanya. Kode Anda <strong>wajib</strong> menangkap SQLSTATE <code>40001</code> dan mengulang seluruh transaksi. Tanpa itu, pengguna akan melihat error acak saat trafik ramai.</p>
</div>

<h2>Melihat dan Mengakhiri Kunci</h2>
<pre>-- Siapa memblokir siapa
SELECT
    dibl.pid AS pid_diblokir,
    left(dibl.query, 50) AS kueri_diblokir,
    pembl.pid AS pid_pemblokir,
    left(pembl.query, 50) AS kueri_pemblokir
FROM pg_stat_activity dibl
JOIN pg_stat_activity pembl
  ON pembl.pid = ANY(pg_blocking_pids(dibl.pid))
WHERE cardinality(pg_blocking_pids(dibl.pid)) &gt; 0;

SELECT pg_cancel_backend(12345);      -- batalkan kueri (halus)
SELECT pg_terminate_backend(12345);   -- putus koneksi (keras)</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Transaksi menganggur adalah pembunuh senyap</div>
    <p>Koneksi berstatus <code>idle in transaction</code> menahan kunci <em>dan</em> mencegah VACUUM membersihkan dead tuple di seluruh basis data. Satu transaksi yang lupa di-commit karena bug aplikasi dapat membuat tabel membengkak berhari-hari. Selalu pasang pengaman:</p>
    <pre>ALTER SYSTEM SET idle_in_transaction_session_timeout = '60s';
ALTER SYSTEM SET statement_timeout = '30s';
ALTER SYSTEM SET lock_timeout = '10s';</pre>
</div>`,
    perintah: [
        "SELECT * FROM pg_stat_activity WHERE state = 'idle in transaction';",
        "SELECT pg_blocking_pids(pid), pid FROM pg_stat_activity;",
        "SELECT pg_terminate_backend(12345);",
        "SHOW default_transaction_isolation;",
        "SELECT * FROM pg_locks WHERE NOT granted;"
    ],
    kuis: [
        {
            tanya: "Apa cara paling efektif mencegah deadlock antar transaksi yang mengubah beberapa baris?",
            opsi: [
                "Memakai tingkat isolasi Serializable",
                "Selalu mengunci sumber daya dalam urutan yang konsisten, misalnya berdasarkan ID menaik",
                "Memperpendek deadlock_timeout",
                "Menghindari penggunaan transaksi sama sekali"
            ],
            benar: 1,
            penjelasan: "Deadlock terjadi ketika dua transaksi mengunci sumber daya yang sama dalam urutan berlawanan. Bila semua kode mengunci dengan urutan yang sama, siklus tunggu tidak mungkin terbentuk. Serializable justru menambah kemungkinan pembatalan, dan memperpendek timeout hanya mempercepat deteksi tanpa mencegah kejadiannya."
        },
        {
            tanya: "Kenapa koneksi berstatus 'idle in transaction' berbahaya?",
            opsi: [
                "Karena koneksi tersebut memakai CPU secara terus-menerus",
                "Karena ia menahan kunci dan mencegah VACUUM membersihkan dead tuple, sehingga tabel bisa membengkak parah",
                "Karena PostgreSQL akan otomatis restart",
                "Karena koneksi tersebut mengabaikan tingkat isolasi"
            ],
            benar: 1,
            penjelasan: "Transaksi yang masih terbuka menetapkan batas horizon yang membuat VACUUM tidak boleh membuang versi baris lama, karena secara teori transaksi itu masih bisa membacanya. Satu transaksi yang menggantung berjam-jam dapat menyebabkan bloat di seluruh basis data, di samping menahan kunci yang memblokir pekerjaan lain."
        }
    ]
},
{
    id: 6,
    kategori: "5 · Pemeliharaan",
    judul: "VACUUM, Bloat & Autovacuum",
    tingkat: "Menengah", durasi: "15 mnt",
    tag: ["vacuum", "bloat", "autovacuum", "wraparound", "dead tuple"],
    ringkas: "Kenapa tabel PostgreSQL membengkak, bagaimana autovacuum bekerja, dan bahaya nyata transaction ID wraparound.",
    isi: `
<h2>Asal Mula Bloat</h2>
<p>Karena MVCC, <code>UPDATE</code> tidak menimpa baris — ia menulis versi baru dan menandai yang lama sebagai mati. <code>DELETE</code> juga hanya menandai. Versi mati tetap memakan ruang sampai <code>VACUUM</code> membersihkannya.</p>

<pre>UPDATE produk SET stok = 9 WHERE id = 1;

Sebelum:  [v1: stok=10]
Sesudah:  [v1: stok=10 MATI]  [v2: stok=9 HIDUP]
                ↑ tetap memakan ruang</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ VACUUM tidak mengembalikan ruang ke sistem operasi</div>
    <p><code>VACUUM</code> biasa menandai ruang sebagai dapat dipakai ulang <em>oleh tabel itu sendiri</em>, tetapi berkasnya tidak mengecil. Ini justru yang diinginkan untuk operasi normal — ruang itu akan langsung terpakai oleh baris baru.</p>
    <p>Untuk benar-benar mengembalikan ruang, dibutuhkan <code>VACUUM FULL</code> yang <strong>mengunci tabel sepenuhnya</strong> dan menulis ulang seluruh isinya. Pada tabel produksi, gunakan <code>pg_repack</code> yang melakukan hal serupa tanpa mengunci.</p>
</div>

<h2>Mengukur Bloat</h2>
<pre>SELECT
    relname,
    n_live_tup,
    n_dead_tup,
    round(100.0 * n_dead_tup / nullif(n_live_tup + n_dead_tup, 0), 1) AS persen_mati,
    last_autovacuum,
    pg_size_pretty(pg_total_relation_size(relid)) AS ukuran
FROM pg_stat_user_tables
WHERE n_dead_tup &gt; 1000
ORDER BY n_dead_tup DESC;</pre>

<p>Persentase baris mati di atas 20% pada tabel besar biasanya berarti autovacuum tidak mengejar laju perubahan.</p>

<h2>Menyetel Autovacuum</h2>
<pre>-- Bawaan: vacuum ketika baris mati &gt; 20% dari tabel
autovacuum_vacuum_scale_factor = 0.2
autovacuum_vacuum_threshold    = 50</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Nilai bawaan buruk untuk tabel besar</div>
    <p>Pada tabel berisi 100 juta baris, ambang 20% berarti autovacuum menunggu sampai ada <strong>20 juta baris mati</strong> sebelum bertindak. Saat akhirnya berjalan, prosesnya berat dan berkepanjangan. Untuk tabel besar yang sering berubah, turunkan ambangnya per tabel:</p>
    <pre>ALTER TABLE pesanan SET (
    autovacuum_vacuum_scale_factor = 0.01,   -- 1%
    autovacuum_vacuum_threshold = 1000,
    autovacuum_analyze_scale_factor = 0.005,
    autovacuum_vacuum_cost_delay = 2
);</pre>
</div>

<h2>Yang Menghalangi VACUUM</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 Tiga penghambat utama</div>
    <ol>
        <li><strong>Transaksi lama yang masih terbuka.</strong> VACUUM tidak boleh membuang versi baris yang secara teori masih bisa dibaca transaksi tersebut. Satu koneksi <code>idle in transaction</code> menghentikan pembersihan di seluruh basis data.</li>
        <li><strong>Replication slot yang tertinggal.</strong> Slot yang tidak aktif menahan WAL <em>dan</em> horizon vacuum. Slot yang terlupakan bisa memenuhi disk sekaligus menyebabkan bloat masif.</li>
        <li><strong>Prepared transaction yang menggantung.</strong> Periksa <code>pg_prepared_xacts</code> — jarang dipakai, tetapi bila ada yang tertinggal, dampaknya sama parahnya.</li>
    </ol>
    <pre>SELECT pid, state, now() - xact_start AS umur, left(query,60)
FROM pg_stat_activity
WHERE xact_start IS NOT NULL
ORDER BY xact_start LIMIT 5;

SELECT slot_name, active, restart_lsn FROM pg_replication_slots;</pre>
</div>

<h2>Transaction ID Wraparound</h2>
<p>PostgreSQL memakai penghitung transaksi 32-bit. Setelah sekitar 2 miliar transaksi, penghitung berputar. VACUUM juga bertugas "membekukan" baris lama agar tetap terlihat setelah putaran itu.</p>

<pre>SELECT datname,
       age(datfrozenxid) AS umur_xid,
       round(100.0 * age(datfrozenxid) / 2000000000, 1) AS persen
FROM pg_database
ORDER BY age(datfrozenxid) DESC;</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Wraparound adalah salah satu kegagalan terburuk PostgreSQL</div>
    <p>Bila <code>age(datfrozenxid)</code> mendekati 2 miliar, PostgreSQL mulai memberi peringatan. Pada sekitar 2 miliar ia <strong>menolak semua penulisan</strong> untuk melindungi data, dan basis data hanya bisa dipulihkan lewat VACUUM dalam mode pengguna tunggal — proses yang bisa memakan waktu berjam-jam dengan sistem dalam keadaan mati total.</p>
    <p>Beri alert pada 1 miliar (50%). Penyebabnya hampir selalu autovacuum yang terhambat oleh salah satu dari tiga penghambat di atas.</p>
</div>

<h2>Perintah Perawatan</h2>
<pre>VACUUM (VERBOSE, ANALYZE) pesanan;
ANALYZE pesanan;                  -- hanya perbarui statistik

-- Mengembalikan ruang TANPA mengunci
pg_repack -d basisdata -t pesanan

-- Memantau vacuum yang sedang berjalan
SELECT pid, relid::regclass, phase,
       heap_blks_scanned, heap_blks_total
FROM pg_stat_progress_vacuum;</pre>

<div class="callout tip">
    <div class="callout-judul">📌 Kurangi bloat lewat perancangan</div>
    <ul>
        <li><strong>Hindari UPDATE pada kolom yang diindeks</strong> bila memungkinkan — pembaruan HOT hanya berlaku bila tidak ada kolom terindeks yang berubah, dan jauh lebih murah.</li>
        <li><strong>Pakai partisi untuk data deret waktu.</strong> Menghapus data lama dengan <code>DROP PARTITION</code> bersifat instan dan tidak menghasilkan dead tuple sama sekali.</li>
        <li><strong>Pecah DELETE besar menjadi potongan kecil</strong> dengan jeda, agar autovacuum sempat mengejar.</li>
    </ul>
</div>`,
    perintah: [
        "SELECT relname, n_dead_tup FROM pg_stat_user_tables ORDER BY n_dead_tup DESC;",
        "VACUUM (VERBOSE, ANALYZE) pesanan;",
        "SELECT * FROM pg_stat_progress_vacuum;",
        "SELECT datname, age(datfrozenxid) FROM pg_database;",
        "SELECT * FROM pg_replication_slots;"
    ],
    kuis: [
        {
            tanya: "Kenapa satu koneksi berstatus 'idle in transaction' dapat menyebabkan bloat di seluruh basis data?",
            opsi: [
                "Karena koneksi tersebut mengunci semua tabel",
                "Karena VACUUM tidak boleh membuang versi baris yang secara teori masih bisa dibaca transaksi terbuka tersebut, sehingga pembersihan terhenti",
                "Karena PostgreSQL menonaktifkan autovacuum saat ada koneksi menganggur",
                "Karena koneksi tersebut menulis WAL secara terus-menerus"
            ],
            benar: 1,
            penjelasan: "VACUUM hanya boleh membuang versi baris yang sudah pasti tidak dibutuhkan transaksi mana pun. Transaksi yang masih terbuka menetapkan batas horizon, sehingga semua versi yang lebih baru dari titik itu harus dipertahankan — di seluruh basis data, bukan hanya di tabel yang disentuhnya."
        },
        {
            tanya: "Apa perbedaan penting antara VACUUM dan VACUUM FULL?",
            opsi: [
                "Tidak ada perbedaan, FULL hanya lebih verbose",
                "VACUUM menandai ruang agar dapat dipakai ulang tanpa mengecilkan berkas dan tanpa mengunci, sedangkan VACUUM FULL menulis ulang tabel untuk mengembalikan ruang tetapi mengunci tabel sepenuhnya",
                "VACUUM FULL hanya membersihkan indeks",
                "VACUUM FULL berjalan otomatis setiap malam"
            ],
            benar: 1,
            penjelasan: "VACUUM biasa aman dijalankan kapan saja dan cukup untuk operasi normal karena ruang bekas langsung dipakai ulang oleh baris baru. VACUUM FULL benar-benar memampatkan berkas tetapi memerlukan kunci eksklusif sepanjang prosesnya, sehingga pada tabel produksi sebaiknya diganti dengan pg_repack."
        }
    ]
},
{
    id: 7,
    kategori: "6 · Skala",
    judul: "Partisi Tabel",
    tingkat: "Lanjutan", durasi: "14 mnt",
    tag: ["partisi", "range", "list", "hash", "pruning", "detach"],
    ringkas: "Memecah tabel raksasa menjadi potongan yang bisa dikelola, dan alasan utamanya sering bukan kecepatan kueri melainkan kemudahan menghapus data lama.",
    isi: `
<h2>Tiga Strategi Partisi</h2>
<pre>-- RANGE: paling umum, untuk data deret waktu
CREATE TABLE peristiwa (
    id bigint GENERATED ALWAYS AS IDENTITY,
    terjadi_pada timestamptz NOT NULL,
    jenis text NOT NULL,
    muatan jsonb
) PARTITION BY RANGE (terjadi_pada);

CREATE TABLE peristiwa_2026_07 PARTITION OF peristiwa
    FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');

-- LIST: untuk kategori diskret
CREATE TABLE pelanggan (...) PARTITION BY LIST (wilayah);

-- HASH: untuk menyebar beban secara merata
CREATE TABLE sesi (...) PARTITION BY HASH (pengguna_id);
CREATE TABLE sesi_0 PARTITION OF sesi
    FOR VALUES WITH (MODULUS 4, REMAINDER 0);</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Kunci partisi wajib ikut dalam kunci utama</div>
    <p>PostgreSQL tidak bisa menjamin keunikan lintas partisi tanpa kolom partisinya. Jadi <code>PRIMARY KEY (id)</code> ditolak; yang berlaku adalah <code>PRIMARY KEY (id, terjadi_pada)</code>. Ini konsekuensi yang sering mengejutkan dan bisa memaksa perubahan pada foreign key yang menunjuk ke tabel tersebut.</p>
</div>

<h2>Partition Pruning</h2>
<pre>EXPLAIN SELECT * FROM peristiwa
WHERE terjadi_pada &gt;= '2026-07-01'
  AND terjadi_pada &lt;  '2026-07-15';

-- Hanya peristiwa_2026_07 yang dipindai.</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Pruning gagal bila kunci partisi tidak ada di WHERE</div>
    <pre>-- ❌ Memindai SEMUA partisi
SELECT * FROM peristiwa WHERE jenis = 'login';

-- ❌ Fungsi pada kunci partisi menggagalkan pruning
WHERE date_trunc('day', terjadi_pada) = '2026-07-15'

-- ✅ Bandingkan kolomnya secara langsung
WHERE terjadi_pada &gt;= '2026-07-15'
  AND terjadi_pada &lt;  '2026-07-16'</pre>
    <p>Bila mayoritas kueri Anda tidak menyertakan kunci partisi, partisi justru <strong>memperlambat</strong> — perencana harus memeriksa banyak tabel sekaligus.</p>
</div>

<h2>Manfaat Terbesar: Menghapus Data Lama</h2>
<pre>-- ❌ DELETE massal: berjam-jam, WAL membengkak,
--    jutaan dead tuple, bloat parah
DELETE FROM peristiwa WHERE terjadi_pada &lt; '2025-07-01';

-- ✅ Lepaskan lalu buang partisi: nyaris instan
ALTER TABLE peristiwa DETACH PARTITION peristiwa_2025_06 CONCURRENTLY;
DROP TABLE peristiwa_2025_06;</pre>

<div class="callout info">
    <div class="callout-judul">💡 Inilah alasan sebenarnya orang memakai partisi</div>
    <p>Banyak yang mengira partisi terutama mempercepat kueri. Untuk tabel dengan indeks yang baik, peningkatannya sering tidak sebesar yang dibayangkan. Manfaat yang benar-benar berubah drastis adalah <strong>pemeliharaan</strong>: menghapus data lama menjadi instan tanpa bloat, VACUUM berjalan per partisi sehingga jauh lebih cepat, dan pembuatan indeks bisa dilakukan sepotong demi sepotong.</p>
</div>

<h2>Mengelola Partisi Secara Otomatis</h2>
<pre>-- Partisi default menangkap baris di luar rentang mana pun
CREATE TABLE peristiwa_default PARTITION OF peristiwa DEFAULT;

-- Membuat partisi bulan depan secara terjadwal
DO $$
DECLARE
    awal date := date_trunc('month', now() + interval '1 month');
    akhir date := awal + interval '1 month';
    nama text := 'peristiwa_' || to_char(awal, 'YYYY_MM');
BEGIN
    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF peristiwa
         FOR VALUES FROM (%L) TO (%L)', nama, awal, akhir);
END $$;</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Partisi default punya jebakan</div>
    <p>Partisi default berguna sebagai jaring pengaman agar penyisipan tidak gagal ketika partisi yang seharusnya belum dibuat. Tetapi begitu ada baris di dalamnya, <strong>menambah partisi baru yang rentangnya tumpang tindih akan gagal</strong> — PostgreSQL harus memindai seluruh partisi default untuk memastikan tidak ada baris yang seharusnya pindah. Pantau isinya dan jaga agar tetap kosong.</p>
</div>

<h2>Kapan Belum Perlu Partisi</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 Partisi menambah kerumitan yang nyata</div>
    <p>Pertimbangkan partisi ketika tabel sudah melewati sekitar <strong>50–100 GB</strong>, atau ketika Anda rutin menghapus data lama dalam jumlah besar. Di bawah itu, indeks yang dirancang baik hampir selalu cukup.</p>
    <p>Yang menjadi lebih rumit setelah partisi: kunci utama wajib menyertakan kolom partisi, foreign key yang menunjuk ke tabel partisi punya batasan, indeks unik global tidak bisa dibuat, dan Anda harus mengelola pembuatan partisi baru secara berkelanjutan.</p>
</div>`,
    perintah: [
        "\\d+ peristiwa",
        "SELECT * FROM pg_inherits WHERE inhparent = 'peristiwa'::regclass;",
        "ALTER TABLE peristiwa DETACH PARTITION peristiwa_2025_06 CONCURRENTLY;",
        "EXPLAIN SELECT * FROM peristiwa WHERE terjadi_pada >= '2026-07-01';",
        "SHOW enable_partition_pruning;"
    ],
    kuis: [
        {
            tanya: "Apa manfaat partisi yang paling nyata untuk tabel deret waktu berukuran besar?",
            opsi: [
                "Kueri selalu menjadi sepuluh kali lebih cepat",
                "Menghapus data lama menjadi nyaris instan lewat DETACH dan DROP PARTITION, tanpa menghasilkan dead tuple dan bloat seperti DELETE massal",
                "Indeks tidak diperlukan lagi",
                "Ukuran penyimpanan otomatis berkurang setengah"
            ],
            benar: 1,
            penjelasan: "DELETE massal menulis WAL dalam jumlah besar dan meninggalkan jutaan dead tuple yang harus dibersihkan VACUUM. Melepas dan menghapus partisi hanya memanipulasi katalog dan berkas, sehingga selesai dalam hitungan detik tanpa efek samping. Peningkatan kecepatan kueri memang ada tetapi biasanya bukan alasan utamanya."
        },
        {
            tanya: "Kenapa PRIMARY KEY (id) ditolak pada tabel yang dipartisi berdasarkan terjadi_pada?",
            opsi: [
                "Karena kolom id bertipe bigint",
                "Karena PostgreSQL tidak bisa menjamin keunikan lintas partisi tanpa menyertakan kolom kunci partisi dalam constraint tersebut",
                "Karena tabel partisi tidak boleh punya kunci utama sama sekali",
                "Karena kunci utama harus selalu bertipe uuid pada tabel partisi"
            ],
            benar: 1,
            penjelasan: "Indeks unik pada tabel partisi sebenarnya dibuat per partisi. Untuk menjamin keunikan secara global, PostgreSQL harus yakin bahwa nilai yang sama tidak mungkin muncul di partisi lain — dan itu hanya bisa dipastikan bila kolom kunci partisi ikut menjadi bagian dari constraint."
        }
    ]
},
{
    id: 8,
    kategori: "6 · Skala",
    judul: "Replikasi, Backup & Point-in-Time Recovery",
    tingkat: "Lanjutan", durasi: "16 mnt",
    tag: ["replikasi", "streaming", "logical", "backup", "pitr"],
    ringkas: "Menyiapkan replika baca, memilih antara replikasi fisik dan logis, dan membangun strategi backup yang benar-benar bisa dipulihkan.",
    isi: `
<h2>Dua Jenis Replikasi</h2>
<table>
<thead><tr><th></th><th>Fisik (streaming)</th><th>Logis</th></tr></thead>
<tbody>
<tr><td>Yang direplikasi</td><td>Blok WAL apa adanya</td><td>Perubahan baris</td></tr>
<tr><td>Cakupan</td><td>Seluruh instansi</td><td>Bisa per tabel</td></tr>
<tr><td>Beda versi PostgreSQL</td><td>Tidak bisa</td><td><strong>Bisa</strong></td></tr>
<tr><td>Replika bisa ditulisi</td><td>Tidak</td><td>Ya</td></tr>
<tr><td>Dipakai untuk</td><td>HA, replika baca</td><td>Upgrade tanpa henti, integrasi data</td></tr>
</tbody>
</table>

<h2>Replikasi Streaming</h2>
<pre>-- Di primer
CREATE ROLE replikator WITH REPLICATION LOGIN PASSWORD 'rahasia';

-- postgresql.conf
wal_level = replica
max_wal_senders = 10

-- Di replika
pg_basebackup -h primer -U replikator -D /var/lib/postgresql/data \\
    -Fp -Xs -P -R -C -S replika1</pre>

<pre>-- Memantau dari primer
SELECT client_addr, state, sent_lsn, replay_lsn,
       pg_wal_lsn_diff(sent_lsn, replay_lsn) AS byte_tertinggal
FROM pg_stat_replication;

-- Dari replika
SELECT now() - pg_last_xact_replay_timestamp() AS lag_waktu;</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Replication slot: penyelamat sekaligus jebakan</div>
    <p>Slot memastikan primer <strong>tidak membuang WAL</strong> sebelum replika sempat menerimanya — tanpa slot, replika yang tertinggal terlalu jauh akan rusak permanen. Tetapi bila replika mati dan slotnya tidak dibersihkan, primer akan <strong>menyimpan WAL selamanya sampai disk penuh</strong> dan basis data berhenti melayani.</p>
    <p>Selalu pantau <code>pg_replication_slots</code> dan pertimbangkan <code>max_slot_wal_keep_size</code> sebagai pengaman.</p>
</div>

<h2>Konflik pada Replika Baca</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 Kueri panjang di replika bisa dibatalkan paksa</div>
    <p>Ketika primer mem-vacuum baris yang masih dibaca kueri di replika, akan terjadi konflik. Bawaannya, replika membatalkan kueri tersebut setelah <code>max_standby_streaming_delay</code>.</p>
    <pre>-- Beri kueri lebih banyak waktu (menambah lag)
max_standby_streaming_delay = 300s

-- Atau beri tahu primer agar menunda vacuum
hot_standby_feedback = on
-- ⚠️ Konsekuensinya: kueri panjang di replika kini menyebabkan
--    bloat di PRIMER. Ini pertukaran yang harus disadari.</pre>
</div>

<h2>Replikasi Logis</h2>
<pre>-- Di penerbit
wal_level = logical
CREATE PUBLICATION pub_pesanan FOR TABLE pesanan, item_pesanan;

-- Di pelanggan
CREATE SUBSCRIPTION sub_pesanan
  CONNECTION 'host=primer dbname=toko user=replikator password=rahasia'
  PUBLICATION pub_pesanan;</pre>

<div class="callout info">
    <div class="callout-judul">💡 Kegunaan paling berharga: upgrade mayor tanpa henti</div>
    <p>Replikasi logis bisa berjalan antar versi PostgreSQL yang berbeda. Alurnya: siapkan instansi versi baru sebagai pelanggan, biarkan tersinkron sepenuhnya, lalu alihkan aplikasi. Waktu henti berkurang dari berjam-jam menjadi hitungan detik.</p>
</div>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Batasan replikasi logis</div>
    <p>Ia tidak mereplikasi perubahan skema (DDL) maupun urutan (sequence). Tabel yang direplikasi <strong>wajib punya kunci utama</strong> atau <code>REPLICA IDENTITY FULL</code>, kalau tidak <code>UPDATE</code> dan <code>DELETE</code> akan gagal.</p>
</div>

<h2>Backup: Tiga Tingkat</h2>
<pre>-- 1. Logis — fleksibel, lambat untuk basis data besar
pg_dump -Fc -j 4 -d toko -f toko.dump
pg_restore -d toko_baru -j 4 toko.dump

-- 2. Fisik — cepat, seluruh kluster
pg_basebackup -D /backup/basis -Ft -z -Xs -P

-- 3. PITR — fisik + arsip WAL berkelanjutan
archive_mode = on
archive_command = 'pgbackrest --stanza=produksi archive-push %p'

pgbackrest --stanza=produksi \\
  --type=time --target="2026-07-28 14:25:00+07" \\
  --delta restore</pre>

<div class="callout tip">
    <div class="callout-judul">📌 Pakai pgBackRest atau Barman, jangan skrip sendiri</div>
    <p>Skrip <code>archive_command</code> buatan sendiri terkenal rapuh: menangani kegagalan sebagian, verifikasi, retensi, dan backup paralel jauh lebih rumit daripada yang terlihat. <strong>pgBackRest</strong> menyediakan backup inkremental, kompresi, verifikasi checksum, retensi otomatis, dan pemulihan paralel — semuanya sudah teruji di produksi.</p>
</div>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Backup yang belum pernah dipulihkan bukan backup</div>
    <p>Ini bukan slogan. Kegagalan yang berulang kali terjadi di banyak organisasi: backup berjalan rapi selama bertahun-tahun, lalu saat benar-benar dibutuhkan ternyata arsip WAL tidak lengkap, atau prosedur pemulihannya tidak pernah dicoba dan gagal di tengah krisis.</p>
    <p><strong>Jadwalkan uji pemulihan berkala</strong> ke server terpisah, dan catat berapa lama prosesnya. Angka itulah RTO Anda yang sesungguhnya, bukan yang tertulis di dokumen.</p>
</div>`,
    perintah: [
        "SELECT * FROM pg_stat_replication;",
        "SELECT * FROM pg_replication_slots;",
        "SELECT now() - pg_last_xact_replay_timestamp();",
        "pg_dump -Fc -d toko -f toko.dump",
        "pgbackrest --stanza=produksi backup"
    ],
    kuis: [
        {
            tanya: "Apa risiko replication slot yang ditinggalkan tidak aktif?",
            opsi: [
                "Replika akan otomatis dipromosikan menjadi primer",
                "Primer terus menyimpan WAL yang dibutuhkan slot tersebut sampai disk penuh dan basis data berhenti melayani",
                "Slot tersebut akan otomatis terhapus setelah 7 hari",
                "Kueri di primer menjadi read-only"
            ],
            benar: 1,
            penjelasan: "Slot menjamin WAL tidak dibuang sebelum konsumennya menerimanya. Bila konsumen tidak pernah kembali, primer terus mengakumulasi berkas WAL tanpa batas. Slot yang terlupakan adalah salah satu penyebab disk penuh yang paling sering terjadi pada PostgreSQL produksi."
        },
        {
            tanya: "Apa konsekuensi mengaktifkan hot_standby_feedback pada replika baca?",
            opsi: [
                "Replika menjadi bisa ditulisi",
                "Kueri panjang di replika tidak lagi dibatalkan, tetapi sebagai gantinya primer menunda VACUUM sehingga berpotensi mengalami bloat",
                "Lag replikasi menjadi nol",
                "Replikasi berubah menjadi sinkron"
            ],
            benar: 1,
            penjelasan: "Dengan feedback aktif, replika memberi tahu primer transaksi tertua yang masih dibutuhkannya, sehingga primer menahan diri dari membuang versi baris tersebut. Ini menghentikan pembatalan kueri di replika, tetapi memindahkan biayanya ke primer dalam bentuk dead tuple yang menumpuk."
        }
    ]
},
{
    id: 9,
    kategori: "7 · Keamanan",
    judul: "Peran, Hak Akses & Row Level Security",
    tingkat: "Menengah", durasi: "14 mnt",
    tag: ["role", "grant", "rls", "keamanan", "audit"],
    ringkas: "Menerapkan hak akses terkecil di tingkat basis data, dan menegakkan isolasi data multi-penyewa lewat kebijakan baris.",
    isi: `
<h2>Peran dan Hak Akses</h2>
<pre>CREATE ROLE aplikasi LOGIN PASSWORD 'rahasia-kuat';

GRANT CONNECT ON DATABASE toko TO aplikasi;
GRANT USAGE ON SCHEMA publik TO aplikasi;
GRANT SELECT, INSERT, UPDATE, DELETE
    ON ALL TABLES IN SCHEMA publik TO aplikasi;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA publik TO aplikasi;

-- WAJIB: berlaku juga untuk tabel yang dibuat NANTI
ALTER DEFAULT PRIVILEGES IN SCHEMA publik
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO aplikasi;

-- Peran khusus baca untuk dasbor &amp; analitik
CREATE ROLE pembaca;
GRANT CONNECT ON DATABASE toko TO pembaca;
GRANT USAGE ON SCHEMA publik TO pembaca;
GRANT SELECT ON ALL TABLES IN SCHEMA publik TO pembaca;

CREATE ROLE analis LOGIN PASSWORD 'lain' IN ROLE pembaca;</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ ALTER DEFAULT PRIVILEGES sering terlupakan</div>
    <p><code>GRANT ... ON ALL TABLES</code> hanya berlaku untuk tabel yang <strong>sudah ada saat itu</strong>. Tabel yang dibuat migrasi berikutnya tidak akan terjangkau, dan aplikasi tiba-tiba mendapat "permission denied" setelah rilis. <code>ALTER DEFAULT PRIVILEGES</code> menutup celah ini — tetapi perhatikan bahwa ia hanya berlaku untuk objek yang dibuat oleh <em>peran yang menjalankan perintah tersebut</em>.</p>
</div>

<h2>Row Level Security</h2>
<p>RLS menegakkan penyaringan baris <strong>di dalam basis data</strong>, sehingga tidak bergantung pada aplikasi selalu menuliskan klausa WHERE yang benar.</p>

<pre>CREATE TABLE dokumen (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    penyewa_id bigint NOT NULL,
    judul text,
    isi text
);

ALTER TABLE dokumen ENABLE ROW LEVEL SECURITY;

CREATE POLICY isolasi_penyewa ON dokumen
    USING (penyewa_id = current_setting('app.penyewa_id')::bigint);

CREATE POLICY sisip_penyewa ON dokumen
    FOR INSERT
    WITH CHECK (penyewa_id = current_setting('app.penyewa_id')::bigint);</pre>

<pre>-- Aplikasi menetapkan konteks di awal tiap transaksi
BEGIN;
SET LOCAL app.penyewa_id = '42';
SELECT * FROM dokumen;      -- otomatis hanya milik penyewa 42
COMMIT;</pre>

<div class="callout tip">
    <div class="callout-judul">📌 Selalu pakai SET LOCAL, bukan SET</div>
    <p>Dengan connection pooler, koneksi dipakai bergantian oleh permintaan yang berbeda. <code>SET</code> biasa bertahan setelah transaksi selesai, sehingga permintaan berikutnya bisa <strong>mewarisi konteks penyewa yang salah</strong> — kebocoran data lintas penyewa yang sangat serius. <code>SET LOCAL</code> otomatis hilang saat transaksi berakhir.</p>
</div>

<div class="callout bahaya">
    <div class="callout-judul">🚫 RLS tidak berlaku untuk pemilik tabel</div>
    <p>Secara bawaan, pemilik tabel dan peran <code>SUPERUSER</code> <strong>melewati semua kebijakan RLS</strong>. Bila aplikasi Anda terhubung sebagai pemilik tabel, RLS tidak melindungi apa pun. Aplikasi harus memakai peran terpisah yang bukan pemilik. Untuk memaksa RLS berlaku bahkan pada pemilik:</p>
    <pre>ALTER TABLE dokumen FORCE ROW LEVEL SECURITY;</pre>
</div>

<h2>Kolom Sensitif</h2>
<pre>-- Hak akses per kolom
GRANT SELECT (id, nama, email) ON pengguna TO analis;
-- kolom lain seperti nik dan tanggal_lahir tidak terjangkau

-- View sebagai lapisan penyamaran
CREATE VIEW pengguna_publik AS
SELECT id, nama,
       left(email, 2) || '***@' || split_part(email, '@', 2) AS email
FROM pengguna;

GRANT SELECT ON pengguna_publik TO analis;</pre>

<h2>Enkripsi &amp; Autentikasi</h2>
<pre>-- pg_hba.conf
hostssl  toko  aplikasi  10.0.0.0/8  scram-sha-256
host     all   all       0.0.0.0/0   reject

-- postgresql.conf
ssl = on
password_encryption = scram-sha-256</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ md5 sudah tidak layak dipakai</div>
    <p>Metode autentikasi <code>md5</code> sudah lama dianggap lemah. Gunakan <code>scram-sha-256</code> untuk semua entri <code>pg_hba.conf</code>. Perlu diingat bahwa mengubah <code>password_encryption</code> saja tidak cukup — password yang sudah ada tetap tersimpan dalam format lama sampai <strong>disetel ulang</strong>.</p>
</div>

<h2>Audit</h2>
<pre>ALTER SYSTEM SET log_connections = on;
ALTER SYSTEM SET log_disconnections = on;
ALTER SYSTEM SET log_statement = 'ddl';    -- semua perubahan skema

-- Memeriksa siapa punya hak apa
SELECT grantee, table_name, privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'publik'
ORDER BY grantee, table_name;</pre>`,
    perintah: [
        "\\du",
        "\\dp nama_tabel",
        "ALTER TABLE dokumen ENABLE ROW LEVEL SECURITY;",
        "SET LOCAL app.penyewa_id = '42';",
        "SELECT * FROM pg_policies;"
    ],
    kuis: [
        {
            tanya: "Kenapa konteks RLS harus ditetapkan dengan SET LOCAL, bukan SET biasa?",
            opsi: [
                "Karena SET biasa tidak didukung PostgreSQL",
                "Karena dengan connection pooler, nilai SET bertahan setelah transaksi selesai sehingga permintaan berikutnya bisa mewarisi konteks penyewa yang salah",
                "Karena SET LOCAL berjalan lebih cepat",
                "Karena SET biasa hanya berlaku untuk superuser"
            ],
            benar: 1,
            penjelasan: "Pooler memakai ulang koneksi fisik untuk permintaan yang berbeda. Nilai yang ditetapkan dengan SET tetap melekat pada sesi tersebut, sehingga permintaan berikutnya dari penyewa lain bisa membaca data yang bukan miliknya. SET LOCAL dibatasi pada transaksi berjalan dan otomatis hilang saat COMMIT atau ROLLBACK."
        },
        {
            tanya: "Aplikasi terhubung sebagai pemilik tabel dan RLS sudah diaktifkan, tetapi semua baris tetap terlihat. Kenapa?",
            opsi: [
                "Kebijakan RLS perlu waktu untuk aktif",
                "Pemilik tabel dan superuser melewati kebijakan RLS secara bawaan; gunakan peran non-pemilik atau aktifkan FORCE ROW LEVEL SECURITY",
                "RLS hanya berlaku untuk perintah INSERT",
                "Tabel perlu di-VACUUM agar kebijakan diterapkan"
            ],
            benar: 1,
            penjelasan: "PostgreSQL mengecualikan pemilik tabel dari kebijakan RLS agar pemeliharaan tetap mungkin dilakukan. Bila aplikasi terhubung dengan peran pemilik, seluruh perlindungan tidak berlaku. Solusinya adalah memakai peran aplikasi terpisah, atau menegakkan kebijakan bahkan pada pemilik dengan FORCE ROW LEVEL SECURITY."
        }
    ]
},
{
    id: 10,
    kategori: "8 · Praktik",
    judul: "Migrasi Skema Tanpa Downtime",
    tingkat: "Lanjutan", durasi: "15 mnt",
    tag: ["migrasi", "ddl", "lock", "expand contract", "zero downtime"],
    ringkas: "Perubahan skema mana yang aman, mana yang mengunci tabel, dan pola expand-contract untuk mengubah struktur tanpa menghentikan layanan.",
    isi: `
<h2>Perintah DDL dan Dampak Penguncian</h2>
<table>
<thead><tr><th>Operasi</th><th>Aman?</th><th>Catatan</th></tr></thead>
<tbody>
<tr><td><code>ADD COLUMN</code> tanpa default</td><td>✅ Instan</td><td>Hanya mengubah katalog</td></tr>
<tr><td><code>ADD COLUMN ... DEFAULT</code></td><td>✅ Instan</td><td>Sejak PostgreSQL 11</td></tr>
<tr><td><code>DROP COLUMN</code></td><td>✅ Instan</td><td>Ruang kembali setelah VACUUM</td></tr>
<tr><td><code>ALTER TYPE</code> (perbesar varchar)</td><td>✅ Instan</td><td>Hanya bila memperbesar</td></tr>
<tr><td><code>ALTER TYPE</code> (ubah tipe)</td><td>❌ <strong>Menulis ulang</strong></td><td>Mengunci tabel penuh</td></tr>
<tr><td><code>SET NOT NULL</code></td><td>⚠️ Memindai penuh</td><td>Bisa dipercepat, lihat di bawah</td></tr>
<tr><td><code>ADD FOREIGN KEY</code></td><td>⚠️ Memindai</td><td>Pakai <code>NOT VALID</code></td></tr>
<tr><td><code>CREATE INDEX</code></td><td>❌ Mengunci tulis</td><td>Pakai <code>CONCURRENTLY</code></td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Bahaya antrean kunci</div>
    <p>Ini jebakan yang sangat merusak dan sering tidak disadari. Bahkan DDL yang biasanya instan pun harus <strong>menunggu</strong> kunci. Bila ada kueri panjang yang sedang berjalan, DDL Anda mengantre — dan <strong>semua kueri baru mengantre di belakangnya</strong>, termasuk <code>SELECT</code> sederhana. Satu <code>ALTER TABLE</code> yang tampak sepele bisa menghentikan seluruh aplikasi.</p>
    <pre>-- SELALU pasang lock_timeout sebelum DDL
SET lock_timeout = '3s';
ALTER TABLE pesanan ADD COLUMN catatan text;
-- Bila tidak bisa mendapat kunci dalam 3 detik, gagal saja
-- lalu coba lagi nanti — jauh lebih baik daripada memblokir semuanya.</pre>
</div>

<h2>Menambah Constraint dengan Aman</h2>
<pre>-- ❌ Memindai seluruh tabel sambil mengunci
ALTER TABLE pesanan ADD CONSTRAINT ck_total CHECK (total &gt;= 0);

-- ✅ Dua langkah
ALTER TABLE pesanan ADD CONSTRAINT ck_total
    CHECK (total &gt;= 0) NOT VALID;          -- instan, berlaku untuk data BARU
ALTER TABLE pesanan VALIDATE CONSTRAINT ck_total;  -- pindai tanpa mengunci tulis</pre>

<pre>-- SET NOT NULL tanpa pemindaian panjang (PostgreSQL 12+)
ALTER TABLE pesanan ADD CONSTRAINT ck_notnull
    CHECK (pengguna_id IS NOT NULL) NOT VALID;
ALTER TABLE pesanan VALIDATE CONSTRAINT ck_notnull;
ALTER TABLE pesanan ALTER COLUMN pengguna_id SET NOT NULL;  -- instan
ALTER TABLE pesanan DROP CONSTRAINT ck_notnull;</pre>

<h2>Pola Expand-Contract</h2>
<pre>Tujuan: mengganti nama kolom "nama" menjadi "nama_lengkap"

RILIS 1 — EXPAND
  ALTER TABLE pengguna ADD COLUMN nama_lengkap text;
  CREATE TRIGGER sinkron ...   -- tulis ke keduanya
  Aplikasi: menulis ke KEDUANYA, membaca dari "nama"

RILIS 2 — ISI DATA
  UPDATE pengguna SET nama_lengkap = nama
  WHERE nama_lengkap IS NULL;    -- dalam potongan kecil!

RILIS 3 — PINDAH BACA
  Aplikasi: menulis ke keduanya, membaca dari "nama_lengkap"

RILIS 4 — CONTRACT
  Aplikasi: hanya memakai "nama_lengkap"
  DROP TRIGGER sinkron;
  ALTER TABLE pengguna DROP COLUMN nama;</pre>

<div class="callout info">
    <div class="callout-judul">💡 Kenapa harus serumit ini</div>
    <p>Selama rilis bergulir, <strong>versi lama dan baru aplikasi berjalan bersamaan</strong> terhadap basis data yang sama. Mengganti nama kolom dalam satu langkah akan langsung merusak versi lama yang masih melayani trafik. Aturan yang bisa dipegang: <strong>setiap perubahan skema harus kompatibel dengan versi aplikasi sebelumnya dan sesudahnya</strong>.</p>
</div>

<h2>Memperbarui Data dalam Jumlah Besar</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 Jangan UPDATE jutaan baris sekaligus</div>
    <pre>-- ✅ Potong-potong dengan jeda
DO $$
DECLARE
    terpengaruh int;
BEGIN
    LOOP
        UPDATE pesanan SET wilayah = 'jakarta'
        WHERE id IN (
            SELECT id FROM pesanan
            WHERE wilayah IS NULL
            LIMIT 5000
            FOR UPDATE SKIP LOCKED
        );
        GET DIAGNOSTICS terpengaruh = ROW_COUNT;
        EXIT WHEN terpengaruh = 0;
        COMMIT;
        PERFORM pg_sleep(0.1);   -- beri ruang untuk autovacuum &amp; replika
    END LOOP;
END $$;</pre>
</div>

<h2>Daftar Periksa Migrasi</h2>
<table>
<thead><tr><th>Periksa</th><th>Kenapa</th></tr></thead>
<tbody>
<tr><td><code>lock_timeout</code> disetel</td><td>Mencegah antrean kunci melumpuhkan aplikasi</td></tr>
<tr><td>Setiap migrasi punya prosedur mundur</td><td>Rilis bisa dibatalkan</td></tr>
<tr><td>Diuji pada salinan data produksi</td><td>Durasi pada 10 baris tidak mewakili 10 juta baris</td></tr>
<tr><td>Indeks dibuat <code>CONCURRENTLY</code></td><td>Tidak memblokir penulisan</td></tr>
<tr><td>Pembaruan data dipecah</td><td>Menjaga WAL, kunci, dan lag replika tetap terkendali</td></tr>
<tr><td>Kompatibel dengan versi aplikasi sebelumnya</td><td>Rilis bergulir menjalankan dua versi bersamaan</td></tr>
</tbody>
</table>

<div class="callout tip">
    <div class="callout-judul">📌 Perkakas yang membantu</div>
    <p>Alat migrasi seperti <strong>Flyway</strong>, <strong>Liquibase</strong>, <strong>golang-migrate</strong>, atau <strong>Alembic</strong> menangani pengurutan dan pencatatan versi. Untuk menangkap DDL berbahaya sebelum sampai produksi, <strong>squawk</strong> dapat dijalankan di pipeline CI untuk memeriksa berkas migrasi Anda dan memperingatkan operasi yang mengunci.</p>
</div>`,
    perintah: [
        "SET lock_timeout = '3s';",
        "ALTER TABLE pesanan ADD CONSTRAINT ck CHECK (total >= 0) NOT VALID;",
        "ALTER TABLE pesanan VALIDATE CONSTRAINT ck;",
        "CREATE INDEX CONCURRENTLY idx ON pesanan (kolom);",
        "SELECT * FROM pg_locks WHERE NOT granted;"
    ],
    kuis: [
        {
            tanya: "Kenapa lock_timeout wajib disetel sebelum menjalankan ALTER TABLE di produksi?",
            opsi: [
                "Agar perintah ALTER berjalan lebih cepat",
                "Karena DDL yang menunggu kunci akan membuat semua kueri baru mengantre di belakangnya, sehingga satu ALTER bisa melumpuhkan seluruh aplikasi",
                "Karena PostgreSQL mewajibkannya sejak versi 15",
                "Agar perubahan skema otomatis dibatalkan bila gagal"
            ],
            benar: 1,
            penjelasan: "Permintaan kunci di PostgreSQL bersifat antre dan adil. Ketika DDL menunggu kunci eksklusif karena ada kueri panjang yang berjalan, permintaan berikutnya termasuk SELECT sederhana ikut menunggu di belakangnya. Dengan lock_timeout, DDL menyerah cepat dan bisa dicoba lagi, alih-alih menyumbat seluruh lalu lintas."
        },
        {
            tanya: "Kenapa mengganti nama kolom harus dilakukan lewat pola expand-contract, bukan satu perintah RENAME?",
            opsi: [
                "Karena RENAME memerlukan waktu sangat lama pada tabel besar",
                "Karena selama rilis bergulir versi lama dan baru aplikasi berjalan bersamaan, sehingga nama kolom yang berubah mendadak akan merusak versi lama yang masih melayani trafik",
                "Karena PostgreSQL tidak mendukung perintah RENAME COLUMN",
                "Karena RENAME menghapus seluruh indeks pada kolom tersebut"
            ],
            benar: 1,
            penjelasan: "Perintah RENAME sendiri sebenarnya instan. Masalahnya ada pada aplikasi: selama rilis bergulir, pod versi lama masih menjalankan kueri yang menyebut nama kolom lama dan akan langsung gagal. Expand-contract memastikan setiap tahap kompatibel dengan versi aplikasi sebelum dan sesudahnya."
        }
    ]
},
{
    id: 11,
    kategori: "8 · Praktik",
    judul: "Pola Kueri: Window Function, CTE & Upsert",
    tingkat: "Menengah", durasi: "15 mnt",
    tag: ["window function", "cte", "upsert", "lateral", "paginasi"],
    ringkas: "Fitur SQL yang menggantikan perulangan di aplikasi, dan cara menulisnya agar tetap cepat.",
    isi: `
<h2>Window Function</h2>
<pre>SELECT
    pengguna_id, id, total,
    row_number() OVER (PARTITION BY pengguna_id ORDER BY total DESC) AS urutan,
    sum(total)   OVER (PARTITION BY pengguna_id) AS total_pengguna,
    total - lag(total) OVER (PARTITION BY pengguna_id ORDER BY dibuat_pada)
        AS selisih_dari_sebelumnya
FROM pesanan;</pre>

<pre>-- Total berjalan &amp; rata-rata bergerak
SELECT tanggal, jumlah,
       sum(jumlah) OVER (ORDER BY tanggal
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
           AS kumulatif,
       avg(jumlah) OVER (ORDER BY tanggal
                         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)
           AS rata_7_hari
FROM penjualan_harian;</pre>

<div class="callout info">
    <div class="callout-judul">💡 Mengambil N teratas per grup</div>
    <p>Ini kebutuhan yang sangat sering muncul dan sering diselesaikan dengan perulangan di aplikasi — satu kueri per pengguna, yang berarti masalah N+1.</p>
    <pre>SELECT * FROM (
    SELECT *, row_number() OVER (PARTITION BY pengguna_id
                                 ORDER BY dibuat_pada DESC) AS rn
    FROM pesanan
) t WHERE rn &lt;= 3;
-- 3 pesanan terbaru untuk SETIAP pengguna, dalam satu kueri.</pre>
</div>

<h2>CTE dan Jebakan Materialisasi</h2>
<div class="callout waspada">
    <div class="callout-judul">⚠️ Perilaku CTE berubah di PostgreSQL 12</div>
    <p>Sebelum versi 12, CTE selalu <strong>dimaterialisasi</strong> — dihitung penuh lebih dulu, dan kondisi dari luar tidak bisa didorong masuk. Sejak versi 12, perencana boleh menyisipkannya (inline) sehingga jauh lebih efisien. Anda bisa mengendalikannya secara eksplisit:</p>
    <pre>WITH pesanan_besar AS MATERIALIZED (...)      -- paksa materialisasi
WITH pesanan_besar AS NOT MATERIALIZED (...)  -- paksa inline</pre>
    <p>Materialisasi berguna ketika CTE dipakai berkali-kali dan perhitungannya mahal; inline lebih baik untuk hampir semua kasus lain.</p>
</div>

<pre>-- CTE rekursif: menelusuri hierarki
WITH RECURSIVE bawahan AS (
    SELECT id, nama, atasan_id, 1 AS tingkat
    FROM karyawan WHERE id = 1

    UNION ALL

    SELECT k.id, k.nama, k.atasan_id, b.tingkat + 1
    FROM karyawan k
    JOIN bawahan b ON k.atasan_id = b.id
    WHERE b.tingkat &lt; 10       -- pengaman terhadap siklus
)
SELECT * FROM bawahan;</pre>

<h2>Upsert</h2>
<pre>-- Sisipkan, atau perbarui bila sudah ada
INSERT INTO stok (produk_id, jumlah, diubah_pada)
VALUES (1, 100, now())
ON CONFLICT (produk_id) DO UPDATE
SET jumlah = stok.jumlah + EXCLUDED.jumlah,
    diubah_pada = now()
RETURNING *;

-- Abaikan bila sudah ada (pola idempoten)
INSERT INTO peristiwa_diproses (kunci_idempotensi)
VALUES ('abc-123')
ON CONFLICT DO NOTHING
RETURNING id;
-- Bila tidak ada baris kembali, berarti sudah pernah diproses.</pre>

<div class="callout tip">
    <div class="callout-judul">📌 ON CONFLICT DO NOTHING untuk idempotensi</div>
    <p>Pola ini sangat berguna untuk consumer pesan yang harus idempoten. Karena <code>INSERT</code> dengan constraint unik bersifat atomik, tidak ada celah balapan seperti pada pola "cek dulu lalu sisipkan". Bila tidak ada baris yang dikembalikan, pesan itu sudah pernah diproses dan bisa langsung di-ACK.</p>
</div>

<h2>RETURNING &amp; LATERAL</h2>
<pre>-- Ambil data hasil operasi tanpa kueri kedua
UPDATE pesanan SET status = 'dibatalkan'
WHERE dibuat_pada &lt; now() - interval '7 days'
  AND status = 'menunggu'
RETURNING id, pengguna_id;

-- Memindahkan baris secara atomik
WITH dihapus AS (
    DELETE FROM antrean WHERE id = 1 RETURNING *
)
INSERT INTO arsip SELECT * FROM dihapus;

-- LATERAL: subkueri kanan bisa merujuk kolom kiri
SELECT u.nama, p.id, p.total
FROM pengguna u
CROSS JOIN LATERAL (
    SELECT id, total FROM pesanan
    WHERE pengguna_id = u.id
    ORDER BY dibuat_pada DESC
    LIMIT 3
) p;</pre>

<h2>Paginasi yang Benar</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 OFFSET menjadi sangat lambat pada halaman jauh</div>
    <pre>-- ❌ Harus membaca dan membuang 100.000 baris dulu
SELECT * FROM pesanan ORDER BY dibuat_pada DESC
LIMIT 20 OFFSET 100000;

-- ✅ Keyset pagination: selalu cepat, berapa pun halamannya
SELECT * FROM pesanan
WHERE (dibuat_pada, id) &lt; ('2026-07-20 10:00:00+07', 48213)
ORDER BY dibuat_pada DESC, id DESC
LIMIT 20;</pre>
    <p>Keyset pagination memakai nilai baris terakhir halaman sebelumnya sebagai titik mulai, sehingga indeks bisa langsung melompat ke sana. Kelemahannya: tidak bisa melompat ke "halaman 500" secara langsung — tetapi antarmuka "muat lebih banyak" dan gulir tak berujung justru lebih cocok dengan pola ini.</p>
</div>`,
    perintah: [
        "SELECT *, row_number() OVER (PARTITION BY pengguna_id ORDER BY total DESC) FROM pesanan;",
        "INSERT ... ON CONFLICT (id) DO UPDATE SET ...;",
        "WITH RECURSIVE t AS (...) SELECT * FROM t;",
        "EXPLAIN ANALYZE SELECT ... LIMIT 20 OFFSET 100000;",
        "SELECT * FROM pengguna CROSS JOIN LATERAL (...) p;"
    ],
    kuis: [
        {
            tanya: "Kenapa paginasi dengan OFFSET besar menjadi sangat lambat?",
            opsi: [
                "Karena PostgreSQL membatasi nilai OFFSET maksimal",
                "Karena basis data tetap harus membaca dan membuang seluruh baris sebelum offset tersebut sebelum mengembalikan hasilnya",
                "Karena OFFSET menonaktifkan penggunaan indeks",
                "Karena OFFSET memicu pembuatan tabel sementara"
            ],
            benar: 1,
            penjelasan: "OFFSET tidak memungkinkan basis data melompat langsung ke posisi yang dituju; ia harus menghasilkan lalu membuang setiap baris sebelumnya. Pada halaman ke-5000, itu berarti memproses 100.000 baris hanya untuk mengembalikan 20. Keyset pagination memakai nilai baris terakhir sebagai penanda sehingga indeks bisa langsung menuju posisinya."
        },
        {
            tanya: "Apa keunggulan INSERT ... ON CONFLICT DO NOTHING untuk membangun consumer pesan yang idempoten?",
            opsi: [
                "Ia membuat pesan diproses lebih cepat",
                "Operasinya atomik sehingga tidak ada celah balapan seperti pola cek-dulu-lalu-sisipkan, dan tidak adanya baris yang dikembalikan menandakan pesan sudah pernah diproses",
                "Ia otomatis menghapus pesan duplikat dari broker",
                "Ia menjamin pengiriman exactly-once dari broker"
            ],
            benar: 1,
            penjelasan: "Pola SELECT lalu INSERT punya celah di antara keduanya yang bisa dimasuki transaksi lain. INSERT dengan constraint unik dievaluasi secara atomik oleh basis data, sehingga hanya satu yang berhasil. Klausa RETURNING memberi tahu aplikasi apakah baris benar-benar disisipkan atau sudah ada sebelumnya."
        }
    ]
},
{
    id: 12,
    kategori: "8 · Praktik",
    judul: "Pemantauan & Daftar Periksa Produksi",
    tingkat: "Lanjutan", durasi: "13 mnt",
    tag: ["monitoring", "checklist", "produksi", "alert", "pgbouncer"],
    ringkas: "Metrik yang benar-benar perlu diawasi, konfigurasi yang harus diperiksa sebelum melayani pengguna, dan cara mengatur connection pooler.",
    isi: `
<h2>Metrik yang Perlu Dipantau</h2>
<pre>-- Cache hit ratio: idealnya di atas 99%
SELECT
    sum(heap_blks_hit) * 100.0 / nullif(sum(heap_blks_hit + heap_blks_read), 0)
        AS persen_cache_hit
FROM pg_statio_user_tables;

-- Pemakaian koneksi
SELECT count(*) AS terpakai,
       current_setting('max_connections')::int AS maksimum,
       count(*) FILTER (WHERE state = 'idle in transaction') AS menganggur_dlm_transaksi
FROM pg_stat_activity;

-- Transaksi terlama
SELECT max(now() - xact_start) FROM pg_stat_activity WHERE xact_start IS NOT NULL;

-- Umur transaction ID — untuk alert wraparound
SELECT max(age(datfrozenxid)) FROM pg_database;

-- Deadlock, konflik, berkas temporer
SELECT datname, deadlocks, conflicts, temp_files,
       pg_size_pretty(temp_bytes) AS ukuran_temp
FROM pg_stat_database WHERE datname = current_database();</pre>

<div class="callout tip">
    <div class="callout-judul">📌 Ambang alert yang masuk akal</div>
    <table>
        <thead><tr><th>Metrik</th><th>Peringatan</th><th>Kritis</th></tr></thead>
        <tbody>
            <tr><td>Cache hit ratio</td><td>&lt; 98%</td><td>&lt; 95%</td></tr>
            <tr><td>Koneksi terpakai</td><td>&gt; 70%</td><td>&gt; 85%</td></tr>
            <tr><td>Transaksi terlama</td><td>&gt; 5 menit</td><td>&gt; 30 menit</td></tr>
            <tr><td>Lag replikasi</td><td>&gt; 50 MB</td><td>&gt; 500 MB</td></tr>
            <tr><td>Umur XID</td><td>&gt; 1 miliar</td><td>&gt; 1,5 miliar</td></tr>
            <tr><td>Disk terpakai</td><td>&gt; 75%</td><td>&gt; 85%</td></tr>
        </tbody>
    </table>
</div>

<h2>PgBouncer</h2>
<pre># pgbouncer.ini
[databases]
toko = host=127.0.0.1 port=5432 dbname=toko

[pgbouncer]
listen_port = 6432
auth_type = scram-sha-256

pool_mode = transaction        # paling efisien
max_client_conn = 2000         # dari aplikasi
default_pool_size = 25         # ke PostgreSQL
reserve_pool_size = 5
server_idle_timeout = 600</pre>

<table>
<thead><tr><th>pool_mode</th><th>Koneksi dikembalikan setelah</th><th>Efisiensi</th><th>Batasan</th></tr></thead>
<tbody>
<tr><td><code>session</code></td><td>Klien memutus</td><td>Rendah</td><td>Tidak ada</td></tr>
<tr><td><code>transaction</code></td><td>Setiap COMMIT</td><td><strong>Tinggi</strong></td><td>Tanpa prepared statement bernama, tanpa <code>SET</code> lintas transaksi, tanpa LISTEN/NOTIFY</td></tr>
<tr><td><code>statement</code></td><td>Setiap pernyataan</td><td>Tertinggi</td><td>Tidak mendukung transaksi multi-pernyataan</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Mode transaction memutus beberapa asumsi umum</div>
    <p>Karena koneksi fisik berpindah-pindah antar klien setiap selesai transaksi, hal-hal yang bergantung pada sesi menjadi berbahaya: <code>SET</code> biasa bocor ke permintaan berikutnya, <code>LISTEN/NOTIFY</code> tidak berfungsi, dan prepared statement bernama menjadi tidak valid.</p>
    <p>Driver modern menyediakan penyesuaian untuk ini — misalnya <code>pgx</code> dengan <code>QueryExecModeSimpleProtocol</code>, atau JDBC dengan <code>prepareThreshold=0</code>. Pastikan driver Anda dikonfigurasi sesuai, kalau tidak Anda akan menemui error yang sangat membingungkan di bawah beban.</p>
</div>

<h2>Daftar Periksa Produksi</h2>

<h3>Konfigurasi</h3>
<table>
<tbody>
<tr><td><code>shared_buffers</code> ≈ 25% RAM</td><td>Cache halaman yang memadai</td></tr>
<tr><td><code>effective_cache_size</code> ≈ 50–75% RAM</td><td>Perencana membuat keputusan yang lebih baik</td></tr>
<tr><td><code>work_mem</code> konservatif secara global</td><td>Mencegah OOM saat banyak kueri paralel</td></tr>
<tr><td><code>max_connections</code> wajar + PgBouncer</td><td>Model proses PostgreSQL mahal per koneksi</td></tr>
<tr><td><code>statement_timeout</code> disetel</td><td>Kueri liar tidak berjalan selamanya</td></tr>
<tr><td><code>idle_in_transaction_session_timeout</code></td><td>Mencegah bloat akibat transaksi menggantung</td></tr>
<tr><td><code>random_page_cost = 1.1</code> pada SSD</td><td>Bawaan 4.0 mengasumsikan cakram berputar</td></tr>
</tbody>
</table>

<h3>Keandalan &amp; Keamanan</h3>
<table>
<tbody>
<tr><td><code>fsync = on</code></td><td>Jangan pernah dimatikan pada data sungguhan</td></tr>
<tr><td>Backup otomatis + arsip WAL</td><td>Memungkinkan pemulihan titik waktu</td></tr>
<tr><td><strong>Uji pemulihan berkala</strong></td><td>Backup yang belum diuji bukan backup</td></tr>
<tr><td>Alert umur XID</td><td>Wraparound menghentikan seluruh penulisan</td></tr>
<tr><td>Autovacuum disetel per tabel besar</td><td>Nilai bawaan tidak cocok untuk tabel besar</td></tr>
<tr><td><code>scram-sha-256</code>, bukan md5</td><td>md5 sudah lemah</td></tr>
<tr><td>TLS diwajibkan, peran aplikasi bukan superuser</td><td>Hak akses terkecil</td></tr>
<tr><td><code>pg_hba.conf</code> membatasi sumber</td><td>Basis data tidak boleh terbuka ke internet</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Dua kesalahan yang paling sering ditemui</div>
    <p><strong>1. Tidak ada <code>statement_timeout</code>.</strong> Satu kueri analitik yang lupa dibatasi bisa berjalan berjam-jam, menahan kunci, menghambat vacuum, dan membuat replika tertinggal jauh. Setel nilai global yang wajar dan naikkan hanya untuk pekerjaan yang memang butuh.</p>
    <p><strong>2. <code>random_page_cost</code> dibiarkan 4.0 pada SSD.</strong> Nilai bawaan berasal dari era cakram berputar ketika akses acak jauh lebih mahal daripada berurutan. Pada SSD, selisihnya kecil. Membiarkan nilai lama membuat perencana terlalu enggan memakai indeks dan lebih memilih pemindaian penuh yang sebenarnya lebih lambat.</p>
</div>`,
    perintah: [
        "SELECT * FROM pg_stat_database WHERE datname = current_database();",
        "SELECT count(*) FROM pg_stat_activity;",
        "SHOW statement_timeout;",
        "SHOW random_page_cost;",
        "SELECT max(age(datfrozenxid)) FROM pg_database;"
    ],
    kuis: [
        {
            tanya: "Kenapa random_page_cost sebaiknya diturunkan menjadi sekitar 1.1 pada server dengan penyimpanan SSD?",
            opsi: [
                "Agar PostgreSQL memakai lebih sedikit memori",
                "Karena nilai bawaan 4.0 mengasumsikan akses acak jauh lebih mahal seperti pada cakram berputar, sehingga perencana terlalu enggan memakai indeks",
                "Karena SSD tidak mendukung pemindaian berurutan",
                "Karena nilai tersebut menentukan ukuran cache"
            ],
            benar: 1,
            penjelasan: "Parameter ini memberi tahu perencana seberapa mahal membaca halaman secara acak dibanding berurutan. Pada cakram berputar, pencarian mekanis membuat akses acak jauh lebih lambat. Pada SSD selisihnya kecil, sehingga nilai bawaan membuat perencana meremehkan manfaat indeks dan lebih sering memilih pemindaian penuh."
        },
        {
            tanya: "Apa batasan penting mode 'transaction' pada PgBouncer?",
            opsi: [
                "Transaksi tidak bisa lebih dari satu pernyataan",
                "Koneksi fisik berpindah antar klien setiap COMMIT, sehingga SET biasa, LISTEN/NOTIFY, dan prepared statement bernama menjadi tidak dapat diandalkan",
                "Hanya mendukung maksimal 10 koneksi klien",
                "Tidak mendukung TLS"
            ],
            benar: 1,
            penjelasan: "Mode transaction memberi efisiensi tertinggi yang praktis dengan mengembalikan koneksi ke pool segera setelah transaksi selesai. Konsekuensinya, apa pun yang bergantung pada keadaan sesi bisa bocor ke klien lain atau hilang. Driver perlu dikonfigurasi agar tidak memakai prepared statement bernama, dan aplikasi harus memakai SET LOCAL."
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
