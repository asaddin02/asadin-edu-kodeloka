/* ==========================================================================
   GRAFANA — BAGIAN A (Fondasi, Instalasi, Data Source, Panel Pertama)
   ========================================================================== */

const GRAF_MOD_A = [

/* ---------------------------------------------------------------- 1 ----- */
{
    id: 1,
    cat: '1 · Fondasi',
    title: 'Posisi Grafana: Alat Baca, Bukan Penyimpan Data',
    level: 'Dasar', dur: '12 mnt',
    tags: ['konsep', 'observability', 'data source', 'arsitektur', 'panel'],
    desc: 'Memahami apa yang sebenarnya dikerjakan Grafana, apa yang bukan tugasnya, dan kenapa kesalahpahaman ini menyebabkan arsitektur monitoring yang keliru.',
    theory: `
<h2>Kesalahpahaman Nomor Satu</h2>
<p>Banyak tim memperlakukan Grafana seperti basis data: "simpan metrik kita di Grafana". Grafana <strong>tidak menyimpan data time series sama sekali</strong>. Ia adalah lapisan presentasi — ia bertanya ke sistem lain, menerima jawabannya, lalu menggambarnya.</p>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Definisi kerja</div>
    <p><strong>Grafana</strong> adalah antarmuka kueri dan visualisasi yang berbicara ke banyak sumber data melalui plugin, menyatukan hasilnya dalam satu dashboard, dan memicu alert berdasarkan hasil kueri tersebut.</p>
</div>

<h3>Apa yang Disimpan Grafana di Basis Datanya Sendiri</h3>
<p>Grafana punya basis data internal (SQLite secara default, PostgreSQL/MySQL untuk produksi), tetapi isinya <em>bukan</em> metrik Anda:</p>
<table>
<thead><tr><th>Disimpan Grafana</th><th>TIDAK disimpan Grafana</th></tr></thead>
<tbody>
<tr><td>Definisi dashboard (JSON)</td><td>Nilai metrik / titik data</td></tr>
<tr><td>Konfigurasi data source + kredensial</td><td>Log aplikasi</td></tr>
<tr><td>Pengguna, tim, organisasi, izin</td><td>Trace</td></tr>
<tr><td>Aturan alert &amp; riwayat state alert</td><td>Riwayat nilai metrik jangka panjang</td></tr>
<tr><td>Anotasi, playlist, snapshot, API key</td><td>Agregasi hasil kueri (kecuali cache sementara)</td></tr>
</tbody>
</table>

<h3>Alur Satu Panel, Dari Klik Sampai Grafik</h3>
<pre data-lang="text" data-file="alur render panel">Browser                Grafana Server            Data Source
   │                        │                         │
   │ 1. buka dashboard      │                         │
   ├───────────────────────>│                         │
   │ 2. JSON model dashboard│                         │
   │<───────────────────────┤                         │
   │ 3. tiap panel kirim    │                         │
   │    query + time range  │                         │
   ├───────────────────────>│ 4. proxy ke data source │
   │                        ├────────────────────────>│
   │                        │ 5. data frame           │
   │                        │<────────────────────────┤
   │ 6. hasil (data frame)  │                         │
   │<───────────────────────┤                         │
   │ 7. transform + render  │                         │
   │    di browser          │                         │</pre>

<div class="callout callout-info">
    <div class="callout-title">💡 Kenapa langkah 7 penting</div>
    <p><strong>Transformation, unit, threshold, dan override dijalankan di browser</strong>, setelah data tiba. Artinya: transformasi <em>tidak</em> mengurangi beban data source, dan dashboard yang menarik 500.000 titik data akan membuat browser tersendat meskipun query-nya cepat.</p>
    <p>Konsekuensi praktis: perkecil data di <strong>query</strong>, bukan di transformation.</p>
</div>

<h3>Grafana dalam Tiga Pilar Observability</h3>
<table>
<thead><tr><th>Pilar</th><th>Penyimpan (backend)</th><th>Peran Grafana</th></tr></thead>
<tbody>
<tr><td>Metrik</td><td>Prometheus, Mimir, InfluxDB, Graphite</td><td>Dashboard, alert, SLO</td></tr>
<tr><td>Log</td><td>Loki, Elasticsearch, CloudWatch Logs</td><td>Eksplorasi log, korelasi ke metrik</td></tr>
<tr><td>Trace</td><td>Tempo, Jaeger, Zipkin</td><td>Melihat span, lompat dari metrik ke trace</td></tr>
</tbody>
</table>
<p>Nilai terbesar Grafana justru muncul saat ketiganya disatukan: Anda melihat lonjakan latency di grafik, klik satu titik, dan langsung melihat trace request yang lambat itu. Ini yang disebut <strong>korelasi</strong>, dan dibahas tuntas di bab 12.</p>

<h3>Model Data Universal: Data Frame</h3>
<p>Apa pun sumbernya — Prometheus, PostgreSQL, atau CSV — Grafana mengubah hasil menjadi struktur seragam bernama <strong>data frame</strong>: sebuah tabel berkolom, di mana tiap kolom punya tipe dan metadata.</p>
<pre data-lang="text" data-file="satu data frame">Frame: "cpu_usage{instance=\\"web-01\\"}"
┌─────────────────────┬─────────┐
│ Time (time)         │ Value   │   ← nama kolom (tipe)
├─────────────────────┼─────────┤
│ 2026-07-28 09:00:00 │ 0.42    │
│ 2026-07-28 09:00:15 │ 0.47    │
│ 2026-07-28 09:00:30 │ 0.51    │
└─────────────────────┴─────────┘
labels: { instance: "web-01", job: "web" }</pre>
<p>Memahami ini adalah kunci: <strong>transformation bekerja pada data frame, bukan pada grafik</strong>. Ketika sebuah transformation tidak berfungsi seperti harapan, hampir selalu karena bentuk frame-nya berbeda dari yang Anda bayangkan.</p>

<h3>Versi dan Perubahan Besar yang Perlu Anda Tahu</h3>
<ul>
<li><strong>Grafana 8</strong> — memperkenalkan <em>unified alerting</em> (menggantikan alert per-panel yang lama).</li>
<li><strong>Grafana 9–10</strong> — panel <em>Time series</em> menggantikan <em>Graph (old)</em>; Explore menjadi matang.</li>
<li><strong>Grafana 11</strong> — <em>Scenes</em> sebagai fondasi dashboard baru, Explore Metrics, alerting makin modular.</li>
<li><strong>Grafana 12</strong> — Dynamic Dashboards, Git Sync untuk dashboard-as-code.</li>
</ul>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Komponen yang sudah tamat riwayatnya</div>
    <ul>
        <li><strong>Grafana Agent</strong> sudah <em>end-of-life</em>. Penggantinya adalah <strong>Grafana Alloy</strong>, distribusi OpenTelemetry Collector yang juga bisa membaca konfigurasi Prometheus. Jangan memulai proyek baru dengan Agent.</li>
        <li><strong>Promtail</strong> untuk pengiriman log juga sudah tidak dikembangkan lagi; gunakan Alloy dengan komponen <code>loki.source.*</code>.</li>
        <li><strong>Alert per-panel gaya lama (legacy alerting)</strong> sudah dihapus total sejak Grafana 11. Semua alert kini melalui Unified Alerting.</li>
        <li><strong>Panel <em>Graph (old)</em> dan <em>Singlestat</em></strong> sudah dihapus. Gunakan <em>Time series</em> dan <em>Stat</em>.</li>
    </ul>
</div>

<p>Materi ini memakai <strong>Grafana 12</strong> sebagai acuan, dan menandai secara eksplisit bagian yang berbeda di versi lama.</p>`,
    lab: {
        intro: `
<h3>Praktik: Menyalakan Grafana dan Mengenali Isinya</h3>
<p>Jalankan Grafana sekali pakai, lalu periksa apa yang benar-benar tersimpan di dalamnya.</p>`,
        files: [{
            name: 'docker-compose.yml', lang: 'yaml', code: `services:
  grafana:
    image: grafana/grafana:12.0.0
    container_name: grafana
    ports: ["3000:3000"]
    environment:
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: rahasia
      GF_USERS_ALLOW_SIGN_UP: "false"
    volumes:
      - grafana-data:/var/lib/grafana

volumes:
  grafana-data:` }],
        steps: [
            { note: 'Nyalakan Grafana', cmd: 'docker compose up -d', out: '[+] Running 2/2\n ✔ Volume "grafana-data"  Created\n ✔ Container grafana      Started' },
            { note: 'Pastikan sehat sebelum membuka browser', cmd: 'curl -s http://localhost:3000/api/health' },
            { note: 'Lihat versi dan daftar data source (masih kosong)', cmd: 'grafana-cli --version' },
            { note: 'Intip apa yang disimpan Grafana di basis data internalnya', cmd: 'grafana db tables' }
        ],
        snippets: ['curl -s http://localhost:3000/api/health', 'grafana db tables', 'help']
    },
    pitfalls: [
        {
            kind: 'salah', title: 'Mengira Grafana menyimpan metrik jangka panjang',
            body: `<p>Sering terdengar: "retensi kami 1 tahun karena dashboard Grafana masih menampilkan data tahun lalu". Retensi itu milik <strong>Prometheus/Mimir</strong>, bukan Grafana. Menghapus volume Grafana tidak menghilangkan satu titik data pun; menghapus volume Prometheus menghilangkan semuanya.</p>
<p>Implikasi backup: yang wajib di-backup dari Grafana adalah <strong>basis data internalnya</strong> (dashboard, alert, user) — atau lebih baik lagi, simpan semuanya sebagai kode (bab 15).</p>`
        },
        {
            kind: 'larangan', title: 'JANGAN memakai SQLite untuk instalasi produksi multi-instance',
            body: `<p>SQLite adalah default dan sangat nyaman untuk laptop. Di produksi ia menjadi masalah begitu Anda menjalankan lebih dari satu replika Grafana: SQLite tidak bisa dibagi lewat network storage dengan aman, dan Anda akan menemui <code>database is locked</code> atau dashboard yang hilang secara acak.</p>
<pre data-lang="ini" data-file="grafana.ini">[database]
type = postgres
host = db.internal:5432
name = grafana
user = grafana
password = $__env{GF_DB_PASSWORD}
ssl_mode = require</pre>`
        },
        {
            kind: 'best', title: 'Perlakukan dashboard sebagai kode sejak hari pertama',
            body: `<p>Dashboard yang dibuat dengan klik-klik di UI akan menjadi aset yang tidak bisa direview, tidak bisa di-rollback, dan hilang bersama basis datanya.</p>
<ul>
<li>Ekspor JSON model dashboard ke repositori Git.</li>
<li>Muat kembali lewat <strong>provisioning</strong> (bab 15) sehingga instalasi baru langsung lengkap.</li>
<li>Data source juga diprovisioning, agar UID-nya konsisten antar lingkungan.</li>
</ul>
<p>Tim yang menunda ini biasanya menyesal saat migrasi server pertama.</p>`
        },
        {
            kind: 'kasus', title: 'Dashboard lambat padahal Prometheus cepat',
            body: `<p>Sebuah tim mengeluh dashboard "berat", lalu menambah CPU Prometheus — tanpa perubahan. Penyebab sebenarnya: satu panel meminta rentang 30 hari dengan <code>step</code> 15 detik, menghasilkan ±172.800 titik <em>per series</em> dikali 40 series. Prometheus mengirimnya dengan cepat; <strong>browser</strong>-lah yang tercekik.</p>
<p>Perbaikannya ada di sisi kueri: naikkan interval minimum, pakai <code>$__rate_interval</code>, dan kurangi jumlah series dengan agregasi. Detailnya di bab 5 dan bab 14.</p>`
        }
    ],
    quiz: [
        {
            q: 'Volume data Grafana terhapus. Apa yang hilang?',
            opts: [
                'Seluruh riwayat metrik selama retensi',
                'Dashboard, konfigurasi data source, pengguna, dan aturan alert',
                'Tidak ada, semuanya ada di data source',
                'Hanya tampilan tema dan preferensi'
            ],
            a: 1,
            exp: 'Grafana hanya menyimpan <em>metadata</em>: dashboard, data source, user, alert rule, anotasi. Metrik dan log tetap aman di Prometheus/Loki. Karena itu backup Grafana ≠ backup observability data.'
        },
        {
            q: 'Di mana transformation dijalankan?',
            opts: [
                'Di data source, sebelum data dikirim',
                'Di server Grafana, saat proxy',
                'Di browser, setelah data frame diterima',
                'Di basis data internal Grafana'
            ],
            a: 2,
            exp: 'Transformation adalah operasi sisi klien pada data frame yang sudah diterima. Karena itu ia tidak mengurangi beban data source maupun jumlah data yang berpindah lewat jaringan.'
        },
        {
            q: 'Struktur seragam yang dipakai Grafana untuk menampung hasil kueri dari sumber apa pun disebut…',
            opts: ['Data frame', 'Time series', 'Panel model', 'Query result set'],
            a: 0,
            exp: 'Data frame adalah tabel berkolom bertipe dengan label/metadata. Prometheus, SQL, CSV, maupun JSON API semuanya diterjemahkan ke bentuk ini sebelum divisualisasikan.'
        }
    ]
},

/* ---------------------------------------------------------------- 2 ----- */
{
    id: 2,
    cat: '1 · Fondasi',
    title: 'Instalasi & Konfigurasi: grafana.ini, Env Var, Reverse Proxy',
    level: 'Dasar', dur: '18 mnt',
    tags: ['instalasi', 'docker', 'grafana.ini', 'nginx', 'konfigurasi', 'env'],
    desc: 'Memasang Grafana dengan benar, memahami hierarki konfigurasi, dan menempatkannya di belakang reverse proxy tanpa dashboard yang rusak.',
    theory: `
<h2>Tiga Cara Memasang, Satu Cara yang Dianjurkan</h2>
<table>
<thead><tr><th>Cara</th><th>Kapan dipakai</th><th>Catatan</th></tr></thead>
<tbody>
<tr><td>Paket OS (apt/yum)</td><td>VM tunggal, tradisional</td><td>Config di <code>/etc/grafana/grafana.ini</code>, data di <code>/var/lib/grafana</code></td></tr>
<tr><td>Docker / Compose</td><td>Mayoritas kasus</td><td>Config lewat env var, volume wajib untuk <code>/var/lib/grafana</code></td></tr>
<tr><td>Helm (Kubernetes)</td><td>Produksi berskala</td><td>Provisioning via ConfigMap/Sidecar</td></tr>
</tbody>
</table>

<h3>Hierarki Konfigurasi — Siapa Menang</h3>
<p>Ini sumber kebingungan yang sangat umum. Urutan prioritas, dari yang paling lemah ke paling kuat:</p>
<pre data-lang="text" data-file="urutan prioritas">1. defaults.ini            ← bawaan, JANGAN diedit
2. grafana.ini             ← file konfigurasi Anda
3. custom.ini              ← khusus paket biner
4. Environment variable    ← MENANG atas semuanya
5. Argumen baris perintah  ← untuk beberapa opsi tertentu</pre>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Pola penamaan env var wajib dihafal</div>
    <p>Setiap opsi <code>[section] key = value</code> punya padanan <code>GF_&lt;SECTION&gt;_&lt;KEY&gt;</code>, huruf besar, titik dan tanda hubung menjadi garis bawah.</p>
<pre data-lang="ini">[auth.anonymous]
enabled = true
org_role = Viewer

# padanannya:
# GF_AUTH_ANONYMOUS_ENABLED=true
# GF_AUTH_ANONYMOUS_ORG_ROLE=Viewer</pre>
    <p>Bila Anda mengedit <code>grafana.ini</code> tetapi nilainya tidak berubah, hampir pasti ada env var yang menimpanya.</p>
</div>

<h3>Bagian Konfigurasi yang Paling Sering Disentuh</h3>
<pre data-lang="ini" data-file="grafana.ini">[server]
protocol       = http
http_port      = 3000
domain         = grafana.perusahaan.id
root_url       = https://grafana.perusahaan.id/
serve_from_sub_path = false
enforce_domain = false

[database]
type     = postgres
host     = db.internal:5432
name     = grafana
user     = grafana
password = $__env{GF_DB_PASSWORD}
ssl_mode = require

[security]
admin_user            = admin
admin_password        = $__file{/run/secrets/grafana_admin}
secret_key            = $__env{GF_SECRET_KEY}
disable_gravatar      = true
cookie_secure         = true
cookie_samesite       = lax
content_security_policy = true

[users]
allow_sign_up      = false
auto_assign_org_role = Viewer
default_theme      = dark

[dashboards]
min_refresh_interval = 10s
versions_to_keep     = 20

[alerting]
enabled = false          # alerting lama, WAJIB false di Grafana modern

[unified_alerting]
enabled = true

[analytics]
reporting_enabled  = false
check_for_updates  = false

[log]
mode  = console
level = info</pre>

<h3>Menyimpan Rahasia Tanpa Menaruhnya di File</h3>
<p>Grafana memahami dua penyedia nilai khusus di dalam <code>grafana.ini</code>:</p>
<ul>
<li><code>$__env{NAMA_VAR}</code> — ambil dari environment variable.</li>
<li><code>$__file{/path/ke/berkas}</code> — ambil isi berkas (cocok untuk Docker/Kubernetes secret).</li>
</ul>

<div class="callout callout-danger">
    <div class="callout-title">⛔ secret_key bukan hiasan</div>
    <p><code>secret_key</code> dipakai untuk mengenkripsi kredensial data source di basis data. Bila Anda memulihkan basis data ke server lain dengan <code>secret_key</code> berbeda, <strong>semua password data source menjadi tidak bisa didekripsi</strong> dan harus dimasukkan ulang satu per satu.</p>
    <p>Simpan <code>secret_key</code> bersama backup basis data, di brankas rahasia yang sama.</p>
</div>

<h3>Di Belakang Reverse Proxy</h3>
<p>Dua kesalahan klasik: WebSocket untuk Live tidak diteruskan, dan <code>root_url</code> tidak diset sehingga tautan share/alert menunjuk ke <code>localhost:3000</code>.</p>
<pre data-lang="nginx" data-file="/etc/nginx/conf.d/grafana.conf">server {
    listen 443 ssl http2;
    server_name grafana.perusahaan.id;

    ssl_certificate     /etc/ssl/certs/grafana.crt;
    ssl_certificate_key /etc/ssl/private/grafana.key;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

    # WAJIB: Grafana Live memakai WebSocket
    location /api/live/ {
        proxy_pass          http://127.0.0.1:3000;
        proxy_http_version  1.1;
        proxy_set_header    Upgrade    $http_upgrade;
        proxy_set_header    Connection "upgrade";
        proxy_set_header    Host       $host;
    }
}</pre>

<div class="callout callout-info">
    <div class="callout-title">💡 Melayani dari sub-path</div>
    <p>Bila Grafana harus berada di <code>https://portal.id/grafana/</code>, Anda perlu <strong>dua</strong> setelan sekaligus:</p>
<pre data-lang="ini">root_url = https://portal.id/grafana/
serve_from_sub_path = true</pre>
    <p>Melewatkan salah satunya menghasilkan halaman putih karena aset statis dicari di path yang salah.</p>
</div>

<h3>Compose Produksi Minimal</h3>
<pre data-lang="yaml" data-file="docker-compose.yml">services:
  grafana:
    image: grafana/grafana:12.0.0
    restart: unless-stopped
    user: "472"                     # UID resmi grafana
    ports: ["127.0.0.1:3000:3000"]  # hanya lokal, publik lewat nginx
    environment:
      GF_SERVER_ROOT_URL: https://grafana.perusahaan.id/
      GF_DATABASE_TYPE: postgres
      GF_DATABASE_HOST: db:5432
      GF_DATABASE_NAME: grafana
      GF_DATABASE_USER: grafana
      GF_DATABASE_PASSWORD__FILE: /run/secrets/db_pass
      GF_SECURITY_ADMIN_PASSWORD__FILE: /run/secrets/admin_pass
      GF_USERS_ALLOW_SIGN_UP: "false"
      GF_ANALYTICS_REPORTING_ENABLED: "false"
      GF_INSTALL_PLUGINS: "grafana-clock-panel,grafana-piechart-panel"
    volumes:
      - grafana-data:/var/lib/grafana
      - ./provisioning:/etc/grafana/provisioning:ro
    secrets: [db_pass, admin_pass]
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3000/api/health || exit 1"]
      interval: 30s
      timeout: 5s
      retries: 3

secrets:
  db_pass:    { file: ./secrets/db_pass.txt }
  admin_pass: { file: ./secrets/admin_pass.txt }

volumes:
  grafana-data:</pre>
<p>Perhatikan akhiran <code>__FILE</code> pada env var — ini cara Grafana membaca Docker secret tanpa menaruh rahasia di <code>docker inspect</code>.</p>`,
    lab: {
        intro: `
<h3>Praktik: Membuktikan Hierarki Konfigurasi</h3>
<p>Ubah satu nilai lewat tiga jalur berbeda dan lihat mana yang menang.</p>`,
        files: [{
            name: 'grafana.ini', lang: 'ini', code: `[server]
http_port = 3000
root_url  = https://grafana.perusahaan.id/

[users]
default_theme = light

[auth.anonymous]
enabled  = true
org_role = Viewer` }],
        steps: [
            { note: 'Lihat konfigurasi efektif yang benar-benar dipakai Grafana', cmd: 'grafana config' },
            { note: 'Cek dari API: apakah anonymous access aktif?', cmd: 'curl -s http://localhost:3000/api/health' },
            { note: 'Timpa lewat env var dan buktikan env var menang', cmd: 'docker compose up -d' },
            { note: 'Verifikasi root_url dipakai (penting untuk tautan alert)', cmd: 'grafana config get server.root_url' }
        ],
        snippets: ['grafana config', 'grafana config get server.root_url', 'grafana-cli --version', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN menjalankan Grafana tanpa volume persisten',
            body: `<p><code>docker run grafana/grafana</code> tanpa volume terlihat berhasil — sampai container di-restart dan seluruh dashboard hilang. Basis data internal berada di <code>/var/lib/grafana/grafana.db</code>.</p>
<pre data-lang="bash">❌ docker run -d -p 3000:3000 grafana/grafana
✅ docker run -d -p 3000:3000 -v grafana-data:/var/lib/grafana grafana/grafana</pre>
<p>Bila memakai bind mount ke direktori host, pastikan kepemilikannya UID <code>472</code>, atau Grafana gagal start dengan <code>permission denied</code>.</p>`
        },
        {
            kind: 'salah', title: 'Mengedit grafana.ini tanpa restart, lalu bingung',
            body: `<p>Grafana membaca konfigurasi <strong>hanya saat start</strong>. Tidak ada reload konfigurasi seperti <code>nginx -s reload</code> untuk berkas ini.</p>
<p>Pengecualian penting: <strong>provisioning</strong> (data source dan dashboard di <code>/etc/grafana/provisioning</code>) dipantau ulang secara berkala dan bisa dimuat ulang lewat API — inilah alasan lain untuk memindahkan konfigurasi ke provisioning.</p>`
        },
        {
            kind: 'best', title: 'Pin versi image, jangan pernah pakai latest',
            body: `<p><code>grafana/grafana:latest</code> berarti restart container di tengah malam bisa membawa Anda ke versi mayor baru dengan perubahan yang memutus dashboard.</p>
<ul>
<li>Pakai tag lengkap: <code>grafana/grafana:12.0.0</code>.</li>
<li>Sebelum naik versi mayor, baca catatan <em>breaking changes</em> dan uji di lingkungan staging dengan salinan basis data.</li>
<li>Backup basis data <strong>sebelum</strong> upgrade — Grafana menjalankan migrasi skema yang tidak bisa dibalik.</li>
</ul>`
        },
        {
            kind: 'kasus', title: 'Tautan di notifikasi alert menunjuk ke localhost',
            body: `<p>Alert berbunyi di Slack pukul 02:00, engineer klik tautannya, dan browser membuka <code>http://localhost:3000/d/abc</code> — halaman mati. Penyebabnya <code>root_url</code> tidak diset.</p>
<p>Grafana memakai <code>root_url</code> untuk membangun setiap tautan absolut: notifikasi alert, share link, dan callback OAuth. Setel begitu Anda menaruh Grafana di belakang domain, sebelum alert pertama dibuat.</p>`
        }
    ],
    quiz: [
        {
            q: 'Anda menulis <code>default_theme = light</code> di grafana.ini, tetapi Grafana tetap gelap. Penyebab paling mungkin?',
            opts: [
                'grafana.ini tidak boleh mengubah tema',
                'Ada env var <code>GF_USERS_DEFAULT_THEME</code> yang menimpanya',
                'Perlu menghapus basis data',
                'Tema hanya bisa diubah per pengguna'
            ],
            a: 1,
            exp: 'Environment variable berada di atas grafana.ini dalam hierarki konfigurasi. Ini penyebab paling umum "konfigurasi saya tidak berpengaruh" pada instalasi berbasis Docker.'
        },
        {
            q: 'Basis data Grafana dipulihkan ke server baru, tetapi seluruh data source melaporkan gagal autentikasi. Kenapa?',
            opts: [
                'Versi Grafana berbeda',
                '<code>secret_key</code> berbeda sehingga kredensial terenkripsi tidak bisa didekripsi',
                'Perlu menjalankan migrasi ulang',
                'Data source harus dibuat lewat UI'
            ],
            a: 1,
            exp: 'Kredensial data source dienkripsi memakai <code>secret_key</code>. Backup basis data tanpa menyertakan kunci ini membuat rahasia di dalamnya tidak bisa dipulihkan.'
        },
        {
            q: 'Grafana dilayani di <code>https://portal.id/grafana/</code> namun halaman tampil putih. Setelan apa yang kurang?',
            opts: [
                'Hanya <code>root_url</code>',
                '<code>serve_from_sub_path = true</code> bersama <code>root_url</code>',
                '<code>enforce_domain = true</code>',
                '<code>cookie_samesite = none</code>'
            ],
            a: 1,
            exp: 'Keduanya harus diset. <code>root_url</code> menentukan tautan absolut, sementara <code>serve_from_sub_path</code> membuat Grafana menyajikan aset statis dari prefix path yang benar.'
        }
    ]
},

/* ---------------------------------------------------------------- 3 ----- */
{
    id: 3,
    cat: '2 · Data Source',
    title: 'Data Source: Prometheus, Loki, SQL, dan Aturan UID',
    level: 'Dasar', dur: '20 mnt',
    tags: ['data source', 'prometheus', 'loki', 'postgres', 'uid', 'provisioning'],
    desc: 'Menghubungkan Grafana ke sumber data dengan benar, memahami UID, dan menghindari jebakan kredensial serta keamanan kueri SQL.',
    theory: `
<h2>Data Source adalah Kontrak</h2>
<p>Sebuah data source di Grafana bukan sekadar URL. Ia menentukan bahasa kueri yang tersedia, editor yang muncul, kemampuan alerting, serta cara Grafana menghitung interval waktu. Salah memilih tipe berarti seluruh dashboard harus ditulis ulang.</p>

<h3>UID — Bagian yang Paling Sering Diabaikan</h3>
<p>Setiap data source punya <strong>UID</strong>, dan JSON dashboard menyimpan referensi ke UID itu, bukan ke namanya.</p>
<pre data-lang="json" data-file="cuplikan panel">{
  "datasource": { "type": "prometheus", "uid": "prom-utama" },
  "targets": [{ "expr": "up", "refId": "A" }]
}</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Ini penyebab "Datasource not found" saat impor dashboard</div>
    <p>Bila UID dibiarkan digenerate acak, maka data source di staging dan produksi punya UID berbeda. Dashboard yang diekspor dari staging akan mencari UID yang tidak ada di produksi.</p>
    <p><strong>Solusinya:</strong> tetapkan UID secara eksplisit lewat provisioning, dan pakai UID yang sama di seluruh lingkungan.</p>
</div>

<h3>Provisioning Data Source (cara yang benar)</h3>
<pre data-lang="yaml" data-file="provisioning/datasources/sumber.yml">apiVersion: 1

deleteDatasources:
  - name: Prometheus Lama
    orgId: 1

datasources:
  - name: Prometheus
    uid: prom-utama              # WAJIB eksplisit
    type: prometheus
    access: proxy                # server-side, bukan browser
    url: http://prometheus:9090
    isDefault: true
    jsonData:
      httpMethod: POST           # query panjang tidak kena batas URL
      timeInterval: "15s"        # = scrape_interval; dasar $__rate_interval
      queryTimeout: "60s"
      manageAlerts: true
      prometheusType: Prometheus
      prometheusVersion: "3.1.0"
      cacheLevel: "Low"
      exemplarTraceIdDestinations:
        - name: trace_id
          datasourceUid: tempo-utama
    editable: false              # cegah perubahan diam-diam lewat UI

  - name: Loki
    uid: loki-utama
    type: loki
    access: proxy
    url: http://loki:3100
    jsonData:
      maxLines: 1000
      derivedFields:
        - name: TraceID
          matcherRegex: "trace_id=(\\\\w+)"
          url: "\${__value.raw}"
          datasourceUid: tempo-utama

  - name: Postgres Bisnis
    uid: pg-bisnis
    type: postgres
    access: proxy
    url: db:5432
    user: grafana_ro             # WAJIB read-only
    database: bayarcepat
    secureJsonData:
      password: $__env{PG_GRAFANA_PASSWORD}
    jsonData:
      sslmode: require
      postgresVersion: 1700
      timescaledb: false
      maxOpenConns: 10
      maxIdleConns: 5
      connMaxLifetime: 14400</pre>

<h3>access: proxy vs direct</h3>
<table>
<thead><tr><th></th><th><code>proxy</code> (server)</th><th><code>direct</code> (browser)</th></tr></thead>
<tbody>
<tr><td>Siapa yang memanggil</td><td>Server Grafana</td><td>Browser pengguna</td></tr>
<tr><td>Data source di jaringan privat</td><td>✅ Bisa</td><td>❌ Tidak bisa</td></tr>
<tr><td>Kredensial terlihat pengguna</td><td>❌ Tidak</td><td>✅ Ya — bocor</td></tr>
<tr><td>Perlu CORS</td><td>Tidak</td><td>Ya</td></tr>
</tbody>
</table>
<p>Praktis selalu gunakan <code>proxy</code>. Mode <code>direct</code> sudah usang dan dihapus untuk banyak tipe data source.</p>

<h3>timeInterval: Setelan Kecil, Dampak Besar</h3>
<p><code>timeInterval</code> memberi tahu Grafana berapa <em>scrape interval</em> data source Anda. Nilai ini menjadi dasar perhitungan <code>$__rate_interval</code>.</p>
<pre data-lang="text" data-file="rumus">$__rate_interval = max(interval + scrape_interval, 4 × scrape_interval)

Dengan scrape_interval 15s dan interval panel 30s:
  max(30s + 15s, 60s) = 60s

Bila timeInterval TIDAK diset (default 1s):
  max(30s + 1s, 4s) = 31s   ← terlalu pendek, grafik rate berlubang</pre>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Kredensial SQL wajib read-only</div>
    <p>Grafana mengirimkan kueri SQL apa adanya. Siapa pun yang bisa mengedit panel bisa menulis <code>DELETE FROM pesanan</code>. Grafana <strong>tidak</strong> menyaring kueri untuk Anda.</p>
<pre data-lang="sql" data-file="setup-user.sql">CREATE USER grafana_ro WITH PASSWORD 'rahasia';
GRANT CONNECT ON DATABASE bayarcepat TO grafana_ro;
GRANT USAGE ON SCHEMA public TO grafana_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO grafana_ro;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO grafana_ro;

-- opsional tapi dianjurkan: batasi durasi kueri
ALTER ROLE grafana_ro SET statement_timeout = '30s';</pre>
</div>

<h3>Makro SQL yang Wajib Dipakai</h3>
<p>Panel SQL harus menghormati time range dashboard. Grafana menyediakan makro untuk itu:</p>
<table>
<thead><tr><th>Makro</th><th>Menjadi</th></tr></thead>
<tbody>
<tr><td><code>$__timeFilter(kolom)</code></td><td><code>kolom BETWEEN '...' AND '...'</code></td></tr>
<tr><td><code>$__timeGroup(kolom, '5m')</code></td><td>Pembulatan waktu untuk GROUP BY</td></tr>
<tr><td><code>$__timeGroupAlias(kolom, $__interval)</code></td><td>Sama, plus alias <code>time</code></td></tr>
<tr><td><code>$__interval</code></td><td>Interval otomatis sesuai lebar panel</td></tr>
<tr><td><code>$__unixEpochFilter(kolom)</code></td><td>Filter untuk kolom epoch integer</td></tr>
</tbody>
</table>
<pre data-lang="sql" data-file="panel transaksi per menit">SELECT
  $__timeGroupAlias(dibuat_pada, $__interval),
  status                              AS metric,
  count(*)                            AS nilai
FROM transaksi
WHERE $__timeFilter(dibuat_pada)
  AND merchant_id = $merchant
GROUP BY 1, 2
ORDER BY 1;</pre>

<div class="callout callout-info">
    <div class="callout-title">💡 Format time series dari SQL</div>
    <p>Agar hasil SQL dibaca sebagai time series, frame harus punya: kolom waktu bernama <code>time</code>, kolom nilai numerik, dan opsional kolom string bernama <code>metric</code> sebagai pemisah series. Tanpa pola ini, panel akan menampilkannya sebagai tabel biasa.</p>
</div>`,
    lab: {
        intro: `
<h3>Praktik: Menambah dan Menguji Data Source lewat API</h3>
<p>Provisioning adalah cara produksi, tetapi API berguna untuk otomasi dan pengujian cepat.</p>`,
        files: [{
            name: 'tambah-ds.sh', lang: 'bash', code: `#!/usr/bin/env bash
set -euo pipefail

GRAFANA="http://localhost:3000"
AUTH="admin:rahasia"

curl -sS -u "$AUTH" -X POST "$GRAFANA/api/datasources" \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "Prometheus",
    "uid":  "prom-utama",
    "type": "prometheus",
    "access": "proxy",
    "url": "http://prometheus:9090",
    "isDefault": true,
    "jsonData": {
      "httpMethod": "POST",
      "timeInterval": "15s"
    }
  }' | jq .

# uji koneksi
curl -sS -u "$AUTH" "$GRAFANA/api/datasources/uid/prom-utama/health" | jq .` }],
        steps: [
            { note: 'Daftar seluruh data source beserta UID-nya', cmd: 'curl -s -u admin:rahasia http://localhost:3000/api/datasources' },
            { note: 'Uji kesehatan satu data source', cmd: 'curl -s -u admin:rahasia http://localhost:3000/api/datasources/uid/prom-utama/health' },
            { note: 'Muat ulang berkas provisioning tanpa restart', cmd: 'curl -s -X POST -u admin:rahasia http://localhost:3000/api/admin/provisioning/datasources/reload' },
            { note: 'Jalankan kueri lewat proxy data source (berguna untuk debugging)', cmd: 'grafana ds query prom-utama up' }
        ],
        snippets: ['curl -s -u admin:rahasia http://localhost:3000/api/datasources', 'grafana ds list', 'grafana ds query prom-utama up', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN memberi Grafana kredensial database yang bisa menulis',
            body: `<p>Grafana meneruskan SQL apa adanya. Seorang editor dashboard — atau siapa pun yang berhasil mengambil alih akunnya — dapat menjalankan <code>UPDATE</code>, <code>DROP</code>, atau membaca tabel yang tidak seharusnya.</p>
<p>Buat peran khusus yang hanya punya <code>SELECT</code> pada tabel yang memang perlu dilihat, dan tambahkan <code>statement_timeout</code> agar satu kueri berat tidak membekukan basis data produksi.</p>`
        },
        {
            kind: 'salah', title: 'Membiarkan UID digenerate otomatis',
            body: `<p>UID acak membuat dashboard tidak portabel. Gejalanya: dashboard yang diimpor menampilkan "Datasource &lt;uid&gt; was not found" di setiap panel.</p>
<pre data-lang="yaml">❌ datasources:
     - name: Prometheus
       type: prometheus         # uid digenerate acak

✅ datasources:
     - name: Prometheus
       uid: prom-utama          # sama di dev, staging, produksi
       type: prometheus</pre>
<p>Bila dashboard perlu dibagikan lintas organisasi, gunakan <strong>variabel data source</strong> (bab 8) agar pemilihannya dinamis.</p>`
        },
        {
            kind: 'best', title: 'Selalu set timeInterval sesuai scrape_interval',
            body: `<p>Ini setelan satu baris yang mencegah kelas bug paling membingungkan di Grafana: grafik <code>rate()</code> yang berlubang atau nol pada rentang waktu tertentu.</p>
<p>Tanpa <code>timeInterval</code>, Grafana menganggap scrape interval Anda 1 detik, sehingga <code>$__rate_interval</code> menghasilkan rentang yang lebih pendek dari jarak antar sampel — dan <code>rate()</code> tidak punya cukup titik untuk dihitung.</p>`
        },
        {
            kind: 'kasus', title: 'Satu panel SQL membekukan basis data produksi',
            body: `<p>Sebuah panel dengan <code>SELECT * FROM transaksi WHERE $__timeFilter(dibuat_pada)</code> tampak wajar — sampai seseorang mengubah time range menjadi "Last 1 year" pada tabel 400 juta baris, dengan refresh 10 detik, di dashboard yang dibuka enam orang.</p>
<p>Pertahanan berlapis: <code>statement_timeout</code> di sisi basis data, <code>maxOpenConns</code> di data source, batas <code>min_refresh_interval</code> di Grafana, serta indeks pada kolom waktu. Lebih baik lagi: jangan gunakan basis data OLTP produksi sebagai sumber dashboard.</p>`
        }
    ],
    quiz: [
        {
            q: 'Dashboard yang diekspor dari staging menampilkan "Datasource not found" di produksi. Perbaikan yang benar?',
            opts: [
                'Ganti nama data source agar sama',
                'Tetapkan UID eksplisit yang identik di kedua lingkungan',
                'Impor ulang dashboard sebagai admin',
                'Naikkan versi Grafana produksi'
            ],
            a: 1,
            exp: 'JSON dashboard mereferensikan UID, bukan nama. Menyamakan nama tidak berpengaruh; UID-lah yang harus konsisten — paling baik ditetapkan lewat provisioning.'
        },
        {
            q: 'Grafik <code>rate()</code> menjadi berlubang setelah data source dibuat lewat UI. Setelan apa yang paling mungkin terlewat?',
            opts: [
                '<code>httpMethod: POST</code>',
                '<code>timeInterval</code> yang menyamai scrape_interval',
                '<code>queryTimeout</code>',
                '<code>manageAlerts</code>'
            ],
            a: 1,
            exp: '<code>timeInterval</code> menjadi dasar <code>$__rate_interval</code>. Bila dibiarkan default 1s, rentang yang dihasilkan bisa lebih pendek dari jarak antar sampel sehingga <code>rate()</code> tidak menghasilkan nilai.'
        },
        {
            q: 'Kenapa <code>access: proxy</code> lebih dianjurkan daripada <code>direct</code>?',
            opts: [
                'Lebih cepat karena tidak melewati server',
                'Kredensial tidak terekspos ke browser dan data source privat tetap terjangkau',
                'Mendukung lebih banyak tipe panel',
                'Menghemat lisensi'
            ],
            a: 1,
            exp: 'Pada mode proxy, server Grafana yang memanggil data source. Kredensial tidak pernah sampai ke browser, tidak perlu CORS, dan data source di jaringan internal tetap bisa diakses.'
        }
    ]
},

/* ---------------------------------------------------------------- 4 ----- */
{
    id: 4,
    cat: '2 · Data Source',
    title: 'Anatomi Dashboard: JSON Model, Panel, dan Time Range',
    level: 'Dasar', dur: '18 mnt',
    tags: ['dashboard', 'json model', 'panel', 'time range', 'refresh', 'grid'],
    desc: 'Membedah struktur dashboard dari dalam, karena setiap fitur lanjutan pada akhirnya adalah properti di JSON model.',
    theory: `
<h2>Dashboard Hanyalah Sebuah Dokumen JSON</h2>
<p>Semua yang Anda klik di UI berujung pada satu dokumen JSON. Membaca JSON model adalah keterampilan yang memisahkan pengguna Grafana dari orang yang benar-benar menguasainya: ia membuat Anda bisa mendiagnosis masalah, melakukan review lewat Git, dan mengedit 40 panel dengan satu perintah <code>sed</code>.</p>

<pre data-lang="json" data-file="kerangka dashboard">{
  "uid": "bayarcepat-ikhtisar",
  "title": "BayarCepat — Ikhtisar Layanan",
  "tags": ["produksi", "bayarcepat"],
  "timezone": "browser",
  "editable": true,
  "schemaVersion": 39,
  "version": 12,
  "refresh": "30s",
  "time":     { "from": "now-6h", "to": "now" },
  "timepicker": {
    "refresh_intervals": ["10s","30s","1m","5m","15m","1h"],
    "hidden": false
  },
  "templating": { "list": [] },
  "annotations": { "list": [] },
  "links": [],
  "panels": []
}</pre>

<h3>Properti yang Sering Salah Dipahami</h3>
<table>
<thead><tr><th>Properti</th><th>Arti</th><th>Jebakan</th></tr></thead>
<tbody>
<tr><td><code>uid</code></td><td>Identitas permanen dashboard, dipakai di URL</td><td>Berubah = seluruh tautan lama mati</td></tr>
<tr><td><code>id</code></td><td>ID numerik internal per instansi</td><td>Harus <code>null</code> saat impor ke instansi lain</td></tr>
<tr><td><code>version</code></td><td>Nomor revisi</td><td>Salah versi saat simpan lewat API = konflik ditolak</td></tr>
<tr><td><code>schemaVersion</code></td><td>Versi format JSON</td><td>Grafana memigrasikan otomatis, tidak bisa turun versi</td></tr>
<tr><td><code>timezone</code></td><td><code>browser</code> / <code>utc</code> / <code>Asia/Jakarta</code></td><td><code>browser</code> membuat screenshot tim beda-beda</td></tr>
</tbody>
</table>

<h3>Anatomi Satu Panel</h3>
<pre data-lang="json" data-file="satu panel">{
  "id": 3,
  "type": "timeseries",
  "title": "Throughput per Layanan",
  "description": "Request per detik, dikelompokkan per layanan.",
  "datasource": { "type": "prometheus", "uid": "prom-utama" },
  "gridPos": { "h": 8, "w": 12, "x": 0, "y": 0 },
  "targets": [
    {
      "refId": "A",
      "expr": "sum by (layanan) (rate(http_requests_total{env=\\"$env\\"}[$__rate_interval]))",
      "legendFormat": "{{layanan}}",
      "interval": ""
    }
  ],
  "fieldConfig": {
    "defaults": {
      "unit": "reqps",
      "min": 0,
      "custom": { "lineWidth": 2, "fillOpacity": 10 },
      "thresholds": {
        "mode": "absolute",
        "steps": [
          { "color": "green", "value": null },
          { "color": "red",   "value": 500 }
        ]
      }
    },
    "overrides": []
  },
  "options": {
    "legend":  { "displayMode": "table", "placement": "bottom", "calcs": ["mean","max"] },
    "tooltip": { "mode": "multi", "sort": "desc" }
  },
  "transformations": []
}</pre>

<div class="callout callout-info">
    <div class="callout-title">💡 Empat blok yang perlu Anda kenali</div>
    <ul>
        <li><code>targets</code> — kueri. Satu panel boleh punya banyak kueri (refId A, B, C…).</li>
        <li><code>fieldConfig</code> — bagaimana <em>nilai</em> ditampilkan: unit, desimal, threshold, warna. Berlaku untuk semua tipe panel.</li>
        <li><code>options</code> — pengaturan khas tipe panel: legenda, tooltip, orientasi.</li>
        <li><code>transformations</code> — pengolahan data frame sebelum digambar.</li>
    </ul>
</div>

<h3>Sistem Grid</h3>
<p>Kanvas dashboard selalu selebar <strong>24 unit</strong>, apa pun ukuran layar. Tinggi satu unit ±30 piksel.</p>
<pre data-lang="text" data-file="tata letak">┌──────────────── 24 unit ─────────────────┐
│  w:6      w:6      w:6      w:6          │  baris stat, h:4
├──────────────────┬───────────────────────┤
│  w:12  h:8       │  w:12  h:8            │  dua grafik
├──────────────────┴───────────────────────┤
│  w:24  h:10                              │  tabel lebar penuh
└──────────────────────────────────────────┘

gridPos: { x: kolom mulai (0-23), y: baris, w: lebar, h: tinggi }</pre>
<p>Lebar yang enak dipakai: <code>24</code> (penuh), <code>12</code> (setengah), <code>8</code> (sepertiga), <code>6</code> (seperempat). Hindari lebar ganjil seperti 7 atau 11 — barisnya jadi tidak rata.</p>

<h3>Time Range dan Refresh</h3>
<p>Time range dashboard diteruskan ke setiap kueri sebagai <code>from</code> dan <code>to</code>. Ada tiga cara ia ditentukan, dengan prioritas dari atas:</p>
<ol>
<li>Parameter URL: <code>?from=now-24h&amp;to=now</code> — menang atas segalanya.</li>
<li>Pilihan pengguna di time picker (tersimpan sementara di sesi).</li>
<li>Properti <code>time</code> di JSON dashboard.</li>
</ol>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Refresh cepat itu mahal</div>
    <p>Dashboard dengan 20 panel dan refresh <code>5s</code> yang dibuka 10 orang menghasilkan <strong>240 kueri per detik</strong> ke data source Anda. Prometheus akan sibuk melayani dashboard alih-alih melakukan scrape.</p>
    <p>Batasi di sisi server agar tidak bergantung pada disiplin pengguna:</p>
<pre data-lang="ini">[dashboards]
min_refresh_interval = 10s</pre>
</div>

<h3>URL Dashboard yang Perlu Anda Kuasai</h3>
<pre data-lang="text" data-file="pola URL">/d/&lt;uid&gt;/&lt;slug&gt;                      buka dashboard
   ?from=now-24h&amp;to=now              time range absolut/relatif
   &amp;var-env=produksi&amp;var-layanan=api  isi variabel
   &amp;viewPanel=3                       satu panel layar penuh
   &amp;editPanel=3                       langsung ke editor panel
   &amp;kiosk                             mode kios (tanpa menu) untuk TV
   &amp;refresh=1m                        paksa interval refresh
   &amp;theme=light                       tema, berguna untuk screenshot</pre>
<p><code>slug</code> hanya kosmetik — yang mengikat adalah <code>uid</code>. Karena itu mengganti judul dashboard aman, mengganti UID tidak.</p>`,
    lab: {
        intro: `
<h3>Praktik: Membaca dan Menulis Dashboard lewat API</h3>
<p>Menguasai jalur API membuat Anda bisa mengotomasi apa pun: audit, migrasi massal, hingga generator dashboard.</p>`,
        files: [{
            name: 'dashboard-minimal.json', lang: 'json', code: `{
  "dashboard": {
    "id": null,
    "uid": "lab-pertama",
    "title": "Lab — Dashboard Pertama",
    "tags": ["lab"],
    "timezone": "Asia/Jakarta",
    "schemaVersion": 39,
    "version": 0,
    "refresh": "30s",
    "time": { "from": "now-6h", "to": "now" },
    "panels": [
      {
        "id": 1,
        "type": "timeseries",
        "title": "Target yang Sedang UP",
        "datasource": { "type": "prometheus", "uid": "prom-utama" },
        "gridPos": { "h": 8, "w": 24, "x": 0, "y": 0 },
        "targets": [
          { "refId": "A", "expr": "sum by (job) (up)", "legendFormat": "{{job}}" }
        ],
        "fieldConfig": {
          "defaults": { "unit": "short", "min": 0 },
          "overrides": []
        }
      }
    ]
  },
  "folderUid": "",
  "overwrite": true,
  "message": "dibuat lewat API dari lab"
}` }],
        steps: [
            { note: 'Kirim dashboard ke Grafana', cmd: 'curl -s -u admin:rahasia -H "Content-Type: application/json" -X POST -d @dashboard-minimal.json http://localhost:3000/api/dashboards/db' },
            { note: 'Ambil kembali JSON model-nya', cmd: 'grafana dash get lab-pertama' },
            { note: 'Cari dashboard berdasarkan tag', cmd: 'grafana dash search tag=lab' },
            { note: 'Lihat riwayat versi (berguna untuk rollback)', cmd: 'curl -s -u admin:rahasia http://localhost:3000/api/dashboards/uid/lab-pertama/versions' }
        ],
        snippets: ['grafana dash search tag=lab', 'grafana dash get lab-pertama', 'grafana dash export lab-pertama', 'help']
    },
    pitfalls: [
        {
            kind: 'salah', title: 'Mengimpor dashboard tanpa menyetel <code>id</code> ke null',
            body: `<p>JSON yang diekspor dari instansi lain membawa <code>"id": 47</code>. Saat diimpor, Grafana mencoba <em>memperbarui</em> dashboard dengan ID 47 di instansi Anda — yang bisa jadi dashboard yang sama sekali berbeda, dan isinya tertimpa.</p>
<pre data-lang="bash">jq '.id = null' dashboard.json > siap-impor.json</pre>
<p>Gunakan menu <strong>Export for sharing externally</strong> bila akan dibagikan, karena ia sekaligus mengubah referensi data source menjadi input yang bisa dipilih saat impor.</p>`
        },
        {
            kind: 'larangan', title: 'JANGAN mengganti UID dashboard yang sudah dipakai',
            body: `<p>UID melekat pada setiap tautan: bookmark, dokumen runbook, tautan di notifikasi alert, dan iframe di wiki internal. Menggantinya membuat semuanya menghasilkan 404 tanpa peringatan apa pun.</p>
<p>Judul boleh diganti kapan saja — slug di URL akan menyesuaikan, dan Grafana tetap menemukan dashboard lewat UID.</p>`
        },
        {
            kind: 'best', title: 'Pakai timezone eksplisit untuk dashboard operasional',
            body: `<p><code>timezone: "browser"</code> berarti dua orang yang menatap insiden yang sama melihat jam yang berbeda — sumber kekacauan saat menulis kronologi insiden.</p>
<ul>
<li>Tim yang tersebar lintas zona: pakai <code>utc</code>.</li>
<li>Tim di satu negara: pakai zona eksplisit, misalnya <code>Asia/Jakarta</code>.</li>
<li>Sertakan zona waktu dalam judul panel bila datanya sensitif waktu, misalnya laporan harian.</li>
</ul>`
        },
        {
            kind: 'kasus', title: 'Perubahan dashboard hilang karena dua orang menyimpan bersamaan',
            body: `<p>Grafana memakai <em>optimistic locking</em> lewat properti <code>version</code>. Bila dua orang membuka dashboard yang sama lalu menyimpan, orang kedua mendapat peringatan konflik — dan sering kali menekan "Save and overwrite" tanpa membaca.</p>
<p>Pencegahan nyata: pindahkan dashboard penting ke provisioning dengan <code>allowUiUpdates: false</code>. Perubahan hanya masuk lewat pull request, sehingga selalu ada review dan riwayat.</p>`
        }
    ],
    quiz: [
        {
            q: 'Berapa lebar total kanvas dashboard Grafana dalam satuan grid?',
            opts: ['12', '16', '24', 'Tergantung resolusi layar'],
            a: 2,
            exp: 'Selalu 24 unit, independen dari resolusi. Karena itu <code>w: 12</code> berarti setengah lebar di layar mana pun, dan tata letak tetap konsisten.'
        },
        {
            q: 'Anda mengimpor dashboard dari internet dan dashboard lain tiba-tiba tertimpa. Penyebabnya?',
            opts: [
                'UID kebetulan sama',
                'Properti <code>id</code> numerik tidak diset null sehingga dianggap update',
                '<code>schemaVersion</code> terlalu lama',
                'Folder tujuan salah'
            ],
            a: 1,
            exp: '<code>id</code> adalah kunci internal per instansi. Membiarkan nilai dari instansi asal membuat Grafana memperbarui dashboard dengan ID tersebut. Selalu set <code>id: null</code> sebelum impor.'
        },
        {
            q: 'Dashboard dengan 20 panel, refresh 5 detik, dibuka 10 pengguna. Berapa kueri per detik yang menghantam data source?',
            opts: ['20', '40', '240', '1000'],
            a: 2,
            exp: '20 panel ÷ 5 detik = 4 kueri/detik per pengguna, dikali 10 pengguna = 40. Namun tiap panel di sini rata-rata membawa lebih dari satu target; dengan asumsi 3 target per panel angkanya menjadi 240 — dan inilah sebabnya <code>min_refresh_interval</code> perlu ditegakkan di sisi server.'
        }
    ]
},

/* ---------------------------------------------------------------- 5 ----- */
{
    id: 5,
    cat: '2 · Data Source',
    title: 'Query Editor, $__interval, dan Legenda yang Terbaca',
    level: 'Menengah', dur: '20 mnt',
    tags: ['query', 'interval', 'rate_interval', 'legend', 'explore', 'promql'],
    desc: 'Menulis kueri panel yang efisien, memahami variabel interval bawaan Grafana, dan membuat legenda yang tidak membuat dashboard tak terbaca.',
    theory: `
<h2>Satu Panel, Banyak Kueri</h2>
<p>Setiap kueri punya <code>refId</code> (A, B, C…). Dua kegunaan penting: menampilkan beberapa metrik berdampingan, dan menjadi masukan bagi transformation atau ekspresi matematis.</p>
<pre data-lang="promql" data-file="dua kueri dalam satu panel">A:  sum(rate(http_requests_total{status=~"5.."}[$__rate_interval]))
B:  sum(rate(http_requests_total[$__rate_interval]))

# lalu tambahkan Expression (tipe Math):
C:  $A / $B * 100          → error rate dalam persen</pre>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Expression: kalkulasi tanpa membebani data source</div>
    <p>Grafana punya jenis kueri khusus bernama <strong>Expression</strong> yang beroperasi pada hasil kueri lain:</p>
    <ul>
        <li><strong>Math</strong> — aritmetika antar refId: <code>$A / $B</code>.</li>
        <li><strong>Reduce</strong> — series menjadi satu angka: <code>last</code>, <code>mean</code>, <code>max</code>.</li>
        <li><strong>Resample</strong> — menyeragamkan interval sebelum operasi matematis.</li>
        <li><strong>Threshold</strong> — menghasilkan 0/1, dipakai berat oleh alerting.</li>
    </ul>
    <p>Expression sangat berguna saat menggabungkan data dari <em>dua data source berbeda</em> — sesuatu yang tidak bisa dilakukan di bahasa kueri mana pun.</p>
</div>

<h3>Variabel Interval Bawaan — Bagian Tersulit bagi Pemula</h3>
<table>
<thead><tr><th>Variabel</th><th>Nilainya</th><th>Kapan dipakai</th></tr></thead>
<tbody>
<tr><td><code>$__interval</code></td><td>rentang waktu ÷ lebar panel dalam piksel, dibulatkan</td><td><code>GROUP BY</code> di SQL, <code>step</code> manual</td></tr>
<tr><td><code>$__rate_interval</code></td><td><code>max(interval + scrape, 4 × scrape)</code></td><td><strong>Selalu</strong> untuk <code>rate()</code>, <code>increase()</code></td></tr>
<tr><td><code>$__range</code></td><td>Seluruh rentang waktu dashboard</td><td>Total sepanjang rentang</td></tr>
<tr><td><code>$__interval_ms</code></td><td><code>$__interval</code> dalam milidetik</td><td>Kueri yang butuh angka</td></tr>
<tr><td><code>$__from</code> / <code>$__to</code></td><td>Epoch milidetik</td><td>API kustom, tautan eksternal</td></tr>
</tbody>
</table>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Kesalahan paling umum: rate() dengan rentang tetap</div>
<pre data-lang="promql">❌ rate(http_requests_total[5m])
   Saat dashboard di-zoom ke 30 hari, step menjadi ±10 menit sementara
   rentang rate tetap 5 menit → banyak titik tanpa data → grafik berlubang.

❌ rate(http_requests_total[$__interval])
   Saat panel sempit, $__interval bisa menjadi 10s — lebih kecil dari
   scrape_interval 15s → rate() butuh minimal dua sampel → hasil kosong.

✅ rate(http_requests_total[$__rate_interval])
   Dijamin selalu mencakup minimal empat kali scrape_interval.</pre>
</div>

<h3>Instant vs Range Query</h3>
<table>
<thead><tr><th></th><th>Range</th><th>Instant</th></tr></thead>
<tbody>
<tr><td>Hasil</td><td>Deret titik sepanjang waktu</td><td>Satu nilai per series, pada waktu <code>to</code></td></tr>
<tr><td>Beban</td><td>Berat</td><td>Ringan</td></tr>
<tr><td>Panel yang cocok</td><td>Time series, heatmap</td><td>Stat, Gauge, Table, Bar gauge</td></tr>
</tbody>
</table>
<p>Panel <em>Stat</em> yang menjalankan range query lalu mengambil nilai terakhir adalah pemborosan besar: ia menarik ribuan titik untuk menampilkan satu angka. Beralih ke instant query sering memangkas waktu muat dashboard secara dramatis.</p>

<h3>Legenda: Dari Tidak Terbaca Menjadi Berguna</h3>
<pre data-lang="text" data-file="perbandingan legenda">Tanpa legendFormat:
{__name__="http_requests_total", instance="10.0.0.5:8080", job="api",
 method="POST", route="/pesanan", status="200"}   ← tak terbaca

legendFormat: {{route}} · {{status}}
/pesanan · 200                                      ← langsung jelas</pre>
<p>Untuk data source SQL, gunakan kolom beralias <code>metric</code>. Untuk Loki, gunakan label stream. Prinsipnya sama: legenda harus bisa dibaca dari jarak tiga meter saat rapat insiden.</p>

<div class="callout callout-info">
    <div class="callout-title">💡 Batasi jumlah series sebelum menggambar</div>
    <p>Grafik dengan 300 garis tidak memberi informasi apa pun. Kurangi di tingkat kueri:</p>
<pre data-lang="promql"># hanya 5 endpoint paling lambat
topk(5, histogram_quantile(0.95,
  sum by (route, le) (rate(http_request_duration_seconds_bucket[$__rate_interval]))))

# agregasi, bukan per-instance
sum by (layanan) (rate(http_requests_total[$__rate_interval]))</pre>
</div>

<h3>Query Options di Tiap Panel</h3>
<table>
<thead><tr><th>Opsi</th><th>Fungsi</th><th>Kapan dipakai</th></tr></thead>
<tbody>
<tr><td><strong>Min interval</strong></td><td>Lantai bagi <code>$__interval</code></td><td>Cegah step lebih rapat dari scrape</td></tr>
<tr><td><strong>Max data points</strong></td><td>Batas jumlah titik</td><td>Turunkan ke 300–500 untuk panel berat</td></tr>
<tr><td><strong>Relative time</strong></td><td>Geser rentang panel ini saja</td><td>Panel "minggu lalu" di dashboard hari ini</td></tr>
<tr><td><strong>Time shift</strong></td><td>Mundurkan rentang</td><td>Perbandingan minggu-ke-minggu</td></tr>
<tr><td><strong>Cache timeout</strong></td><td>Waktu cache hasil</td><td>Data source yang mahal</td></tr>
</tbody>
</table>

<h3>Explore: Tempat Menulis Kueri, Bukan Dashboard</h3>
<p><strong>Explore</strong> adalah mode kueri ad-hoc tanpa panel. Alur kerja yang efisien: susun dan uji kueri di Explore, baru pindahkan ke dashboard setelah benar. Explore juga tempat melakukan <em>split view</em> — misalnya metrik di kiri, log Loki di kanan, dengan time range yang tersinkron.</p>`,
    lab: {
        intro: `
<h3>Praktik: Membandingkan Biaya Kueri</h3>
<p>Ukur perbedaan nyata antara kueri yang naif dan yang dioptimalkan.</p>`,
        files: [{
            name: 'kueri-panel.promql', lang: 'promql', code: `# ❌ naif: seluruh series per instance, rentang tetap
rate(http_requests_total[5m])

# ✅ agregasi + rate_interval
sum by (layanan) (rate(http_requests_total[$__rate_interval]))

# ✅ p95 latency, hanya 5 route terlambat
topk(5,
  histogram_quantile(0.95,
    sum by (route, le) (
      rate(http_request_duration_seconds_bucket[$__rate_interval])
    )
  )
)

# ✅ error rate persen — dua kueri + Expression Math ($A / $B * 100)
# A:
sum(rate(http_requests_total{status=~"5.."}[$__rate_interval]))
# B:
sum(rate(http_requests_total[$__rate_interval]))` }],
        steps: [
            { note: 'Lihat berapa series yang dihasilkan kueri naif', cmd: 'grafana ds query prom-utama rate(http_requests_total[5m])' },
            { note: 'Bandingkan dengan versi teragregasi', cmd: 'grafana ds query prom-utama sum by (layanan) (rate(http_requests_total[5m]))' },
            { note: 'Periksa berapa lama panel memuat data', cmd: 'grafana panel inspect 3' },
            { note: 'Hitung nilai $__rate_interval untuk panel ini', cmd: 'grafana interval 6h 800px 15s' }
        ],
        snippets: ['grafana interval 6h 800px 15s', 'grafana panel inspect 3', 'grafana ds query prom-utama up', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN memakai $__interval di dalam rate()',
            body: `<p>Terlihat pintar, tetapi salah. <code>$__interval</code> mengecil mengikuti lebar panel — pada panel sempit ia bisa menjadi lebih kecil dari <code>scrape_interval</code>.</p>
<p><code>rate()</code> membutuhkan <strong>minimal dua sampel</strong> di dalam rentangnya. Bila rentang lebih pendek dari jarak antar scrape, hasilnya kosong dan panel tampak "mati" padahal datanya ada.</p>
<pre data-lang="promql">❌ rate(x[$__interval])
✅ rate(x[$__rate_interval])</pre>`
        },
        {
            kind: 'salah', title: 'Memakai range query untuk panel Stat',
            body: `<p>Panel Stat menampilkan satu angka, tetapi secara default menjalankan range query dan menarik seluruh deret hanya untuk mengambil nilai terakhir.</p>
<p>Centang <strong>Instant</strong> di query options. Pada dashboard dengan banyak stat, perubahan ini saja bisa memangkas waktu muat dari belasan detik menjadi kurang dari satu detik.</p>`
        },
        {
            kind: 'best', title: 'Selalu isi legendFormat',
            body: `<p>Legenda mentah dari Prometheus tidak terbaca dan membuat tooltip meluber menutupi grafik.</p>
<pre data-lang="text">legendFormat: {{layanan}} · {{status}}
legendFormat: {{instance}} — {{mountpoint}}
legendFormat: p95 {{route}}</pre>
<p>Tambahkan juga <strong>unit</strong> yang benar di fieldConfig. Angka <code>0.0421</code> tanpa unit tidak berarti apa-apa; dengan unit <code>percentunit</code> ia menjadi <code>4,21%</code>.</p>`
        },
        {
            kind: 'kasus', title: 'Dashboard cepat di laptop, lambat di TV ruang operasi',
            body: `<p>Layar TV 4K membuat panel jauh lebih lebar dalam piksel, sehingga <code>$__interval</code> mengecil dan jumlah titik yang diminta melonjak berlipat. Dashboard yang nyaman di laptop 1440p menjadi berat di layar besar.</p>
<p>Perbaikan: setel <strong>Max data points</strong> secara eksplisit (misalnya 500) pada panel di dashboard kios, dan naikkan <strong>Min interval</strong>. Mata manusia tidak bisa membedakan 500 dan 5.000 titik di layar dari jarak lima meter.</p>`
        }
    ],
    quiz: [
        {
            q: 'Panel <code>rate(x[$__interval])</code> kosong pada panel sempit. Kenapa?',
            opts: [
                'Data source terlalu lambat',
                '<code>$__interval</code> bisa lebih kecil dari scrape_interval sehingga rate() tidak punya dua sampel',
                'Rentang harus selalu 5 menit',
                'Panel sempit tidak mendukung rate()'
            ],
            a: 1,
            exp: '<code>rate()</code> memerlukan sedikitnya dua titik di dalam rentangnya. <code>$__rate_interval</code> dirancang khusus untuk menjamin ini dengan rumus <code>max(interval + scrape, 4 × scrape)</code>.'
        },
        {
            q: 'Anda ingin menghitung error rate sebagai persentase dari dua kueri di satu panel. Fitur apa yang dipakai?',
            opts: [
                'Transformation "Add field from calculation"',
                'Expression bertipe Math dengan <code>$A / $B * 100</code>',
                'Override pada fieldConfig',
                'Menulis dua kueri lalu memilih unit percent'
            ],
            a: 1,
            exp: 'Expression Math beroperasi pada hasil refId lain di sisi server Grafana, dan bekerja bahkan bila kedua kueri berasal dari data source berbeda. Transformation juga bisa, tetapi Expression lebih tepat karena hasilnya dapat dipakai alerting.'
        },
        {
            q: 'Panel Stat memuat lambat pada rentang 30 hari. Perbaikan pertama yang paling efektif?',
            opts: [
                'Menambah RAM Grafana',
                'Mengaktifkan Instant query',
                'Mengganti tipe panel menjadi Gauge',
                'Menurunkan refresh interval'
            ],
            a: 1,
            exp: 'Instant query hanya mengambil satu titik per series, bukan seluruh deret. Untuk panel yang menampilkan satu angka, ini menghilangkan hampir seluruh beban transfer dan render.'
        }
    ]
}

];

/* ==========================================================================
   GRAFANA — BAGIAN B (Visualisasi, Field Config, Variabel, Transformasi)
   ========================================================================== */

const GRAF_MOD_B = [

/* ---------------------------------------------------------------- 6 ----- */
{
    id: 6,
    cat: '3 · Visualisasi',
    title: 'Memilih Visualisasi: Time Series, Stat, Table, Heatmap, dan Kawan-kawan',
    level: 'Menengah', dur: '20 mnt',
    tags: ['panel', 'timeseries', 'stat', 'gauge', 'table', 'heatmap', 'bar'],
    desc: 'Menghubungkan bentuk pertanyaan dengan bentuk grafik, dan mengetahui kapan sebuah visualisasi justru menyesatkan pembacanya.',
    theory: `
<h2>Aturan Pemilihan yang Sederhana</h2>
<p>Pilih visualisasi berdasarkan <strong>pertanyaan yang ingin dijawab</strong>, bukan berdasarkan yang terlihat paling menarik. Dashboard yang bagus terlihat membosankan dan bisa dibaca dalam tiga detik.</p>

<table>
<thead><tr><th>Pertanyaan</th><th>Panel</th><th>Bentuk data</th></tr></thead>
<tbody>
<tr><td>"Bagaimana perubahannya dari waktu ke waktu?"</td><td>Time series</td><td>Deret waktu</td></tr>
<tr><td>"Berapa angkanya sekarang?"</td><td>Stat</td><td>Satu nilai</td></tr>
<tr><td>"Seberapa dekat ke batas?"</td><td>Gauge</td><td>Satu nilai + threshold</td></tr>
<tr><td>"Siapa yang terbesar?"</td><td>Bar gauge / Bar chart</td><td>Kategori + nilai</td></tr>
<tr><td>"Tunjukkan semua baris datanya"</td><td>Table</td><td>Tabel</td></tr>
<tr><td>"Bagaimana sebaran nilainya?"</td><td>Heatmap / Histogram</td><td>Distribusi</td></tr>
<tr><td>"Kapan statusnya berubah?"</td><td>State timeline</td><td>Deret status diskret</td></tr>
<tr><td>"Berapa lama tiap kondisi berlangsung?"</td><td>Status history</td><td>Deret status</td></tr>
<tr><td>"Bagaimana alur/proporsinya?"</td><td>Pie chart</td><td>Bagian dari total</td></tr>
<tr><td>"Bagaimana hubungan dua metrik?"</td><td>XY chart</td><td>Dua nilai numerik</td></tr>
</tbody>
</table>

<h3>Time Series — Panel yang Akan Anda Pakai 70% Waktu</h3>
<p>Opsi yang benar-benar mengubah keterbacaan:</p>
<pre data-lang="json" data-file="options panel time series">{
  "options": {
    "legend": {
      "displayMode": "table",
      "placement": "bottom",
      "calcs": ["mean", "max", "lastNotNull"],
      "sortBy": "Max", "sortDesc": true
    },
    "tooltip": { "mode": "multi", "sort": "desc", "maxHeight": 400 }
  },
  "fieldConfig": {
    "defaults": {
      "custom": {
        "drawStyle": "line",
        "lineInterpolation": "linear",
        "lineWidth": 2,
        "fillOpacity": 10,
        "gradientMode": "opacity",
        "spanNulls": false,
        "showPoints": "auto",
        "stacking": { "mode": "none" },
        "axisPlacement": "auto",
        "axisSoftMin": 0
      }
    }
  }
}</pre>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ spanNulls: satu setelan, dua kesalahan berlawanan</div>
    <p><code>spanNulls: false</code> memutus garis saat data hilang — inilah yang Anda mau untuk metrik infrastruktur, karena putusnya garis <em>adalah</em> informasi (target mati).</p>
    <p><code>spanNulls: true</code> menyambungkan garis melewati lubang. Berguna untuk metrik yang memang jarang muncul (misalnya batch job harian), tetapi <strong>berbahaya</strong> untuk metrik yang seharusnya kontinu — ia menyembunyikan downtime.</p>
</div>

<h3>Stat — Angka Besar yang Sering Disalahpahami</h3>
<p>Panel Stat menampilkan satu nilai per series. Bila kueri Anda menghasilkan 12 series, Anda akan mendapat 12 kotak kecil, bukan satu angka.</p>
<table>
<thead><tr><th>Opsi</th><th>Efek</th></tr></thead>
<tbody>
<tr><td><code>reduceOptions.calcs</code></td><td>Cara meringkas series: <code>lastNotNull</code> (paling umum), <code>mean</code>, <code>max</code>, <code>sum</code></td></tr>
<tr><td><code>reduceOptions.values</code></td><td><code>true</code> = tampilkan semua nilai, bukan hasil reduce</td></tr>
<tr><td><code>graphMode</code></td><td><code>area</code> memberi sparkline latar; <code>none</code> untuk angka bersih</td></tr>
<tr><td><code>colorMode</code></td><td><code>value</code> (teks berwarna) atau <code>background</code> (kotak berwarna)</td></tr>
<tr><td><code>textMode</code></td><td><code>auto</code>, <code>value</code>, <code>value_and_name</code>, <code>name</code></td></tr>
</tbody>
</table>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Jangan pakai <code>last</code>, pakai <code>lastNotNull</code></div>
    <p><code>last</code> mengambil titik paling akhir apa adanya. Bila scrape terakhir belum masuk, titik itu <code>null</code> dan panel menampilkan <strong>"No data"</strong> — padahal sistem sehat. Ini sumber kepanikan yang tidak perlu saat dashboard dipasang di layar TV.</p>
</div>

<h3>Gauge dan Bar Gauge</h3>
<p>Gauge hanya bermakna bila ada <strong>maksimum yang benar-benar ada artinya</strong>: persentase disk, penggunaan kuota, rasio pool koneksi. Gauge untuk "request per detik" tidak bermakna, karena tidak ada nilai maksimum alamiah.</p>
<pre data-lang="json" data-file="gauge pemakaian disk">{
  "type": "gauge",
  "fieldConfig": {
    "defaults": {
      "unit": "percent", "min": 0, "max": 100,
      "thresholds": { "mode": "absolute", "steps": [
        { "color": "green",  "value": null },
        { "color": "orange", "value": 75 },
        { "color": "red",    "value": 90 }
      ]}
    }
  },
  "options": { "showThresholdMarkers": true, "showThresholdLabels": false }
}</pre>

<h3>Heatmap — Cara Benar Melihat Distribusi Latency</h3>
<p>Grafik garis p95 menyembunyikan bentuk sebaran. Dua sistem dengan p95 identik bisa punya perilaku yang sangat berbeda: satu konsisten, satu bimodal (mayoritas cepat, sebagian sangat lambat).</p>
<pre data-lang="promql" data-file="heatmap dari histogram Prometheus">sum by (le) (
  increase(http_request_duration_seconds_bucket[$__rate_interval])
)

# Panel options:
#   Format          : Heatmap
#   Data format     : "Time series buckets"
#   Y axis unit     : seconds (s)
#   Color scheme    : Spectral / Turbo (skema sekuensial)</pre>
<p>Heatmap menampilkan setiap bucket sebagai baris berwarna: gelap = sedikit request, terang = banyak. Pita ganda yang terpisah adalah tanda khas <em>bimodal latency</em> — biasanya berarti sebagian request kena cache dan sebagian tidak.</p>

<h3>Table — Lebih Kuat dari yang Terlihat</h3>
<p>Table bukan panel kelas dua. Dengan transformation dan cell options, ia menjadi alat triase terbaik:</p>
<ul>
<li><strong>Cell type "Gauge"</strong> atau <strong>"Colored background"</strong> — kolom numerik menjadi bar mini.</li>
<li><strong>Data links</strong> pada sel — klik nama layanan, lompat ke dashboard detailnya.</li>
<li><strong>Filterable columns</strong> — pengguna menyaring sendiri tanpa mengubah kueri.</li>
<li><strong>Pagination</strong> — mencegah tabel 5.000 baris membekukan browser.</li>
</ul>

<h3>State Timeline — Untuk Status, Bukan Angka</h3>
<p>Panel ini menggambar pita horizontal berwarna per series, berganti warna saat nilainya berubah. Sangat cocok untuk <code>up</code>, status deployment, atau kondisi alert. Padukan dengan <strong>value mapping</strong> agar <code>1</code> tampil sebagai "UP" hijau dan <code>0</code> sebagai "DOWN" merah.</p>

<div class="callout callout-info">
    <div class="callout-title">💡 Panel yang sebaiknya dihindari</div>
    <ul>
        <li><strong>Pie chart</strong> untuk lebih dari 5 kategori — mata manusia buruk membandingkan sudut. Pakai Bar gauge.</li>
        <li><strong>Graph (old)</strong> — sudah usang, migrasikan ke Time series.</li>
        <li><strong>Gauge</strong> tanpa <code>max</code> yang bermakna.</li>
        <li><strong>Sumbu ganda</strong> pada satu grafik — hampir selalu menipu secara visual. Lebih baik dua panel bersebelahan.</li>
    </ul>
</div>`,
    lab: {
        intro: `
<h3>Praktik: Satu Metrik, Empat Visualisasi</h3>
<p>Buat empat panel dari kueri yang sama dan rasakan perbedaan cara membacanya.</p>`,
        files: [{
            name: 'panel-variasi.json', lang: 'json', code: `[
  {
    "type": "timeseries", "title": "Latency p95 (tren)",
    "gridPos": { "h": 8, "w": 12, "x": 0, "y": 0 },
    "targets": [{ "refId": "A",
      "expr": "histogram_quantile(0.95, sum by (route,le) (rate(http_request_duration_seconds_bucket[$__rate_interval])))",
      "legendFormat": "{{route}}" }],
    "fieldConfig": { "defaults": { "unit": "s", "min": 0 } }
  },
  {
    "type": "heatmap", "title": "Sebaran Latency (bentuk sebenarnya)",
    "gridPos": { "h": 8, "w": 12, "x": 12, "y": 0 },
    "targets": [{ "refId": "A", "format": "heatmap",
      "expr": "sum by (le) (increase(http_request_duration_seconds_bucket[$__rate_interval]))" }],
    "options": { "calculate": false, "yAxis": { "unit": "s" } }
  },
  {
    "type": "stat", "title": "Error Rate Sekarang",
    "gridPos": { "h": 4, "w": 6, "x": 0, "y": 8 },
    "targets": [{ "refId": "A", "instant": true,
      "expr": "sum(rate(http_requests_total{status=~\\"5..\\"}[5m])) / sum(rate(http_requests_total[5m]))" }],
    "fieldConfig": { "defaults": {
      "unit": "percentunit", "decimals": 2,
      "thresholds": { "mode": "absolute", "steps": [
        { "color": "green", "value": null },
        { "color": "red",   "value": 0.01 }
      ]}
    }},
    "options": { "colorMode": "background",
      "reduceOptions": { "calcs": ["lastNotNull"] } }
  },
  {
    "type": "state-timeline", "title": "Status Target",
    "gridPos": { "h": 4, "w": 18, "x": 6, "y": 8 },
    "targets": [{ "refId": "A", "expr": "up", "legendFormat": "{{job}} · {{instance}}" }],
    "fieldConfig": { "defaults": {
      "mappings": [
        { "type": "value", "options": { "0": { "text": "DOWN", "color": "red",   "index": 0 } } },
        { "type": "value", "options": { "1": { "text": "UP",   "color": "green", "index": 1 } } }
      ]
    }}
  }
]` }],
        steps: [
            { note: 'Lihat berapa series yang masuk ke panel (menentukan pilihan visualisasi)', cmd: 'grafana ds query prom-utama up' },
            { note: 'Periksa bentuk data frame yang diterima panel', cmd: 'grafana panel inspect 3' },
            { note: 'Daftar tipe panel yang tersedia di instansi ini', cmd: 'grafana panel types' },
            { note: 'Uji bagaimana Stat meringkas banyak series', cmd: 'grafana panel reduce lastNotNull' }
        ],
        snippets: ['grafana panel types', 'grafana panel inspect 3', 'grafana panel reduce lastNotNull', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN memakai <code>last</code> pada panel Stat produksi',
            body: `<p>Bila scrape terakhir belum tiba atau target sedang restart, titik terakhir bernilai <code>null</code> dan panel menampilkan "No data" — layar TV operasi mendadak kosong dan orang mengira sistem mati.</p>
<pre data-lang="text">❌ calcs: ["last"]
✅ calcs: ["lastNotNull"]</pre>
<p>Untuk metrik yang memang boleh kosong, tambahkan <strong>No value</strong> di field config agar tampil <code>0</code> atau <code>—</code>, bukan tulisan menakutkan.</p>`
        },
        {
            kind: 'salah', title: 'Menyalakan spanNulls pada metrik infrastruktur',
            body: `<p>Garis yang mulus terlihat lebih rapi, sehingga orang menyalakan <code>spanNulls</code>. Akibatnya downtime 20 menit tergambar sebagai garis lurus yang menyambung — insiden menjadi tidak terlihat sama sekali di dashboard maupun saat review pasca-insiden.</p>
<p>Aturan: putusnya garis adalah informasi. Biarkan putus, kecuali Anda memang tahu metrik itu jarang.</p>`
        },
        {
            kind: 'best', title: 'Satu panel menjawab satu pertanyaan',
            body: `<p>Panel dengan CPU, memori, disk, dan network sekaligus tidak menjawab apa pun karena skalanya berbeda dan sumbunya bertabrakan.</p>
<ul>
<li>Beri judul berupa pertanyaan atau pernyataan: "Apakah latency melewati SLO?" lebih baik daripada "Latency".</li>
<li>Isi <code>description</code> panel — ikon info kecil yang menjelaskan kueri sangat menolong rekan tim pukul 03:00.</li>
<li>Bila butuh dua satuan, buat dua panel bersebelahan, bukan sumbu ganda.</li>
</ul>`
        },
        {
            kind: 'kasus', title: 'p95 stabil, pelanggan tetap mengeluh',
            body: `<p>Grafik p95 sebuah API menunjukkan 320 ms yang datar selama berminggu-minggu, tetapi keluhan "lambat" terus masuk. Setelah panel diganti menjadi heatmap, terlihat dua pita: mayoritas request selesai di 40 ms, sementara sekitar 4% memakan 3–8 detik.</p>
<p>Persentil meratakan cerita; heatmap menunjukkan bentuknya. Penyebabnya ternyata cache miss pada segmen pelanggan tertentu — sesuatu yang tidak akan pernah terlihat dari satu garis p95.</p>`
        }
    ],
    quiz: [
        {
            q: 'Kapan heatmap lebih informatif daripada grafik garis persentil?',
            opts: [
                'Saat data terlalu sedikit',
                'Saat Anda perlu melihat bentuk sebaran, misalnya latency bimodal',
                'Saat panel harus muat di layar kecil',
                'Saat data source bukan Prometheus'
            ],
            a: 1,
            exp: 'Persentil meringkas distribusi menjadi satu angka dan menyembunyikan bentuknya. Heatmap menampilkan seluruh bucket sehingga pola bimodal atau ekor panjang langsung terlihat.'
        },
        {
            q: 'Panel Stat tiba-tiba menampilkan "No data" padahal sistem sehat. Perbaikan paling tepat?',
            opts: [
                'Menaikkan refresh interval',
                'Mengganti calcs dari <code>last</code> menjadi <code>lastNotNull</code>',
                'Mengganti panel menjadi Gauge',
                'Menambah <code>spanNulls</code>'
            ],
            a: 1,
            exp: '<code>last</code> mengambil titik paling akhir termasuk bila nilainya null. <code>lastNotNull</code> mundur mencari nilai valid terakhir, yang justru sesuai untuk panel status.'
        },
        {
            q: 'Metrik manakah yang <strong>tidak</strong> cocok ditampilkan dengan Gauge?',
            opts: [
                'Persentase pemakaian disk',
                'Rasio koneksi pool yang terpakai',
                'Request per detik',
                'Persentase kuota API terpakai'
            ],
            a: 2,
            exp: 'Gauge memerlukan maksimum yang bermakna. Request per detik tidak punya batas atas alamiah, sehingga posisi jarum tidak menyampaikan informasi apa pun.'
        }
    ]
},

/* ---------------------------------------------------------------- 7 ----- */
{
    id: 7,
    cat: '3 · Visualisasi',
    title: 'Field Config: Unit, Threshold, Value Mapping, dan Override',
    level: 'Menengah', dur: '18 mnt',
    tags: ['unit', 'threshold', 'mapping', 'override', 'fieldconfig', 'warna'],
    desc: 'Mengubah angka mentah menjadi informasi yang langsung bisa dibaca, dan mengendalikan tampilan per series tanpa menyentuh kueri.',
    theory: `
<h2>Field Config Berlaku untuk Semua Panel</h2>
<p>Berbeda dari <code>options</code> yang khas per tipe panel, <code>fieldConfig</code> berlaku universal. Ia terdiri dari <strong>defaults</strong> (untuk semua field) dan <strong>overrides</strong> (pengecualian bertarget).</p>

<h3>Unit — Perbaikan Termurah untuk Dashboard Apa Pun</h3>
<p>Angka <code>0.0421</code> tidak berarti apa-apa. Dengan unit yang benar ia menjadi <code>4,21%</code> atau <code>42,1 ms</code>.</p>
<table>
<thead><tr><th>Unit</th><th>Kode</th><th>Contoh input → tampilan</th></tr></thead>
<tbody>
<tr><td>Detik</td><td><code>s</code></td><td>0.042 → 42 ms</td></tr>
<tr><td>Milidetik</td><td><code>ms</code></td><td>1500 → 1.5 s</td></tr>
<tr><td>Byte (SI)</td><td><code>bytes</code></td><td>1500000 → 1.5 MB</td></tr>
<tr><td>Byte (IEC)</td><td><code>bytes(IEC)</code></td><td>1048576 → 1 MiB</td></tr>
<tr><td>Persen (0–100)</td><td><code>percent</code></td><td>42 → 42%</td></tr>
<tr><td>Persen (0.0–1.0)</td><td><code>percentunit</code></td><td>0.42 → 42%</td></tr>
<tr><td>Request/detik</td><td><code>reqps</code></td><td>1500 → 1.5 K req/s</td></tr>
<tr><td>Rupiah</td><td><code>currencyIDR</code></td><td>1500000 → Rp1,5 jt</td></tr>
</tbody>
</table>

<div class="callout callout-danger">
    <div class="callout-title">⛔ percent vs percentunit — kesalahan yang membuat angka salah 100×</div>
    <p>Prometheus biasanya menghasilkan rasio <code>0.0–1.0</code>. Bila Anda memilih <code>percent</code>, angka <code>0.042</code> ditampilkan sebagai <strong>0,042%</strong> — padahal sebenarnya 4,2%.</p>
    <p>Aturan: hasil pembagian tanpa <code>* 100</code> → <code>percentunit</code>. Hasil yang sudah dikali 100 → <code>percent</code>. Jangan pernah melakukan keduanya.</p>
</div>

<h3>Threshold: Warna sebagai Sinyal</h3>
<pre data-lang="json" data-file="threshold">{
  "thresholds": {
    "mode": "absolute",
    "steps": [
      { "color": "green",  "value": null },
      { "color": "yellow", "value": 0.005 },
      { "color": "red",    "value": 0.01 }
    ]
  }
}</pre>
<p>Langkah pertama <strong>harus</strong> bernilai <code>null</code> — itu adalah warna dasar. Mode <code>percentage</code> menghitung threshold relatif terhadap <code>min</code>–<code>max</code>, berguna saat batasnya berbeda per series.</p>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Threshold panel ≠ threshold alert</div>
    <p>Sejak unified alerting, warna threshold di panel <strong>tidak lagi</strong> membuat alert. Keduanya terpisah sepenuhnya.</p>
    <p>Bahayanya: panel bisa merah tanpa ada alert, atau alert berbunyi sementara panel tetap hijau, karena angka batasnya berbeda. Selalu samakan nilainya secara sadar, dan tulis nilai itu di <code>description</code> panel.</p>
</div>

<h3>Value Mapping: Angka Menjadi Kata</h3>
<pre data-lang="json" data-file="mappings">{
  "mappings": [
    { "type": "value", "options": {
        "0": { "text": "DOWN",     "color": "red",    "index": 0 },
        "1": { "text": "UP",       "color": "green",  "index": 1 },
        "2": { "text": "DEGRADED", "color": "orange", "index": 2 } } },
    { "type": "range", "options": {
        "from": 0, "to": 99.9,
        "result": { "text": "Di bawah SLO", "color": "red", "index": 3 } } },
    { "type": "regex", "options": {
        "pattern": "^prod-.*",
        "result": { "text": "Produksi", "color": "purple", "index": 4 } } },
    { "type": "special", "options": {
        "match": "null",
        "result": { "text": "Tidak ada data", "color": "text", "index": 5 } } }
  ]
}</pre>
<p>Urutan penting: mapping dievaluasi berurutan, yang pertama cocok yang dipakai. <code>special</code> menangani <code>null</code>, <code>NaN</code>, dan string kosong.</p>

<h3>Override: Aturan untuk Sebagian Field Saja</h3>
<p>Inilah fitur yang membuat Anda tidak perlu membuat panel terpisah hanya karena satu series butuh perlakuan berbeda.</p>
<pre data-lang="json" data-file="overrides">"overrides": [
  {
    "matcher": { "id": "byName", "options": "error rate" },
    "properties": [
      { "id": "unit", "value": "percentunit" },
      { "id": "custom.axisPlacement", "value": "right" },
      { "id": "color", "value": { "mode": "fixed", "fixedColor": "red" } },
      { "id": "custom.lineWidth", "value": 3 }
    ]
  },
  {
    "matcher": { "id": "byRegexp", "options": "/.*p99.*/" },
    "properties": [
      { "id": "custom.lineStyle", "value": { "fill": "dash", "dash": [10, 10] } }
    ]
  },
  {
    "matcher": { "id": "byFrameRefID", "options": "B" },
    "properties": [
      { "id": "custom.hideFrom", "value": { "legend": true, "tooltip": false, "viz": false } }
    ]
  }
]</pre>

<table>
<thead><tr><th>Matcher</th><th>Menargetkan</th></tr></thead>
<tbody>
<tr><td><code>byName</code></td><td>Satu field dengan nama persis</td></tr>
<tr><td><code>byRegexp</code></td><td>Semua field yang cocok pola</td></tr>
<tr><td><code>byType</code></td><td>Semua field bertipe tertentu (number, time, string)</td></tr>
<tr><td><code>byFrameRefID</code></td><td>Seluruh hasil dari satu kueri (refId)</td></tr>
<tr><td><code>byValue</code></td><td>Field yang nilai reduksinya memenuhi kondisi</td></tr>
</tbody>
</table>

<h3>Skema Warna</h3>
<ul>
<li><strong>Classic palette</strong> — warna berbeda per series. Default, cocok untuk grafik multi-series.</li>
<li><strong>From thresholds</strong> — warna mengikuti nilai. Wajib untuk Stat dan Gauge.</li>
<li><strong>Green-Yellow-Red (by value)</strong> — gradien kontinu, bagus untuk tabel.</li>
<li><strong>Single color</strong> — bila panel hanya punya satu series.</li>
<li><strong>Shades of a color</strong> — untuk series yang berkerabat, misalnya p50/p90/p99.</li>
</ul>

<div class="callout callout-info">
    <div class="callout-title">💡 Aksesibilitas warna</div>
    <p>Sekitar 8% pria mengalami buta warna merah-hijau. Dashboard yang hanya mengandalkan merah versus hijau tidak terbaca oleh mereka.</p>
    <ul>
        <li>Sertakan isyarat kedua: ikon, teks lewat value mapping, atau posisi.</li>
        <li>Merah–biru lebih aman daripada merah–hijau.</li>
        <li>Jangan pakai warna sebagai satu-satunya pembeda antar series di grafik padat — pakai juga <code>lineStyle</code>.</li>
    </ul>
</div>

<h3>Data Links: Panel yang Bisa Diklik</h3>
<pre data-lang="json" data-file="data link">"links": [
  {
    "title": "Lihat log layanan ini",
    "url": "/d/log-layanan/log?var-layanan=\${__field.labels.layanan}&from=\${__from}&to=\${__to}",
    "targetBlank": false
  },
  {
    "title": "Buka runbook",
    "url": "https://wiki.internal/runbook/\${__field.labels.job}",
    "targetBlank": true
  }
]</pre>
<p>Variabel yang tersedia di data link: <code>__value.raw</code>, <code>__value.numeric</code>, <code>__value.time</code>, <code>__field.name</code>, <code>__field.labels.&lt;label&gt;</code>, <code>__from</code>, <code>__to</code>, <code>__series.name</code>, serta seluruh variabel dashboard.</p>`,
    lab: {
        intro: `
<h3>Praktik: Memperbaiki Panel yang Tidak Terbaca</h3>
<p>Ambil panel mentah, lalu terapkan unit, threshold, mapping, dan override sampai bisa dibaca sekilas.</p>`,
        files: [{
            name: 'perbaikan-panel.json', lang: 'json', code: `{
  "type": "timeseries",
  "title": "Kesehatan API — Throughput vs Error Rate",
  "targets": [
    { "refId": "A",
      "expr": "sum(rate(http_requests_total[$__rate_interval]))",
      "legendFormat": "throughput" },
    { "refId": "B",
      "expr": "sum(rate(http_requests_total{status=~\\"5..\\"}[$__rate_interval])) / sum(rate(http_requests_total[$__rate_interval]))",
      "legendFormat": "error rate" }
  ],
  "fieldConfig": {
    "defaults": {
      "unit": "reqps",
      "min": 0,
      "custom": { "lineWidth": 2, "fillOpacity": 8, "spanNulls": false }
    },
    "overrides": [
      {
        "matcher": { "id": "byName", "options": "error rate" },
        "properties": [
          { "id": "unit", "value": "percentunit" },
          { "id": "custom.axisPlacement", "value": "right" },
          { "id": "custom.axisLabel", "value": "error rate" },
          { "id": "color", "value": { "mode": "fixed", "fixedColor": "red" } },
          { "id": "custom.fillOpacity", "value": 0 },
          { "id": "thresholds", "value": { "mode": "absolute", "steps": [
              { "color": "green", "value": null },
              { "color": "red",   "value": 0.01 } ] } },
          { "id": "custom.thresholdsStyle", "value": { "mode": "dashed" } }
        ]
      }
    ]
  }
}` }],
        steps: [
            { note: 'Lihat unit apa saja yang dikenali Grafana', cmd: 'grafana units list' },
            { note: 'Uji format satu nilai dengan unit tertentu', cmd: 'grafana units format percentunit 0.0421' },
            { note: 'Bandingkan dengan unit yang salah', cmd: 'grafana units format percent 0.0421' },
            { note: 'Periksa override mana yang aktif pada sebuah field', cmd: 'grafana panel inspect 3' }
        ],
        snippets: ['grafana units list', 'grafana units format percentunit 0.0421', 'grafana units format bytes 1500000', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN mencampur <code>* 100</code> di kueri dengan unit percent-unit',
            body: `<p>Dua kesalahan yang saling melipatgandakan. Bila kueri sudah <code>* 100</code> lalu unitnya <code>percentunit</code>, angka 4,2% tampil menjadi <strong>420%</strong>. Bila kueri tidak dikali tetapi unitnya <code>percent</code>, ia tampil <strong>0,042%</strong>.</p>
<pre data-lang="text">rasio 0.042
  + percentunit  → 4,2%    ✅
  + percent      → 0,042%  ❌

rasio * 100 = 4.2
  + percent      → 4,2%    ✅
  + percentunit  → 420%    ❌</pre>
<p>Pilih satu konvensi untuk seluruh organisasi. Anjuran: biarkan kueri menghasilkan rasio, dan serahkan pemformatan pada Grafana.</p>`
        },
        {
            kind: 'salah', title: 'Mengira threshold panel akan memicu alert',
            body: `<p>Warisan Grafana 7: dulu threshold pada panel Graph memang terkait alert. Sejak unified alerting keduanya terpisah total.</p>
<p>Akibat di lapangan: tim mengubah threshold panel dari 80% ke 90% saat kapasitas dinaikkan, tetapi alert rule tetap di 80% — sehingga alert berbunyi terus sementara dashboard terlihat hijau, dan lama-lama alert itu diabaikan.</p>`
        },
        {
            kind: 'best', title: 'Pakai override, bukan panel tambahan',
            body: `<p>Kebutuhan seperti "series ini pakai sumbu kanan", "yang p99 digambar putus-putus", atau "sembunyikan kueri pembantu dari legenda" semuanya dijawab override.</p>
<p>Prioritaskan matcher <code>byRegexp</code> agar aturan tetap berlaku saat series baru muncul. Override berbasis <code>byName</code> untuk nama yang dinamis akan diam-diam berhenti bekerja ketika nama series berubah.</p>`
        },
        {
            kind: 'kasus', title: 'Dashboard kapasitas yang menyesatkan selama enam bulan',
            body: `<p>Sebuah tim memantau pemakaian memori dengan unit <code>bytes</code> (SI, kelipatan 1000), sementara alert dan tim infrastruktur memakai GiB (IEC, kelipatan 1024). Selisihnya sekitar 7,4% pada skala gigabyte.</p>
<p>Ketika kapasitas mendekati batas, dashboard menunjukkan "masih 8% sisa" sementara kernel sudah mulai melakukan OOM kill. Perbaikannya satu baris: ganti unit menjadi <code>bytes(IEC)</code> agar sesuai dengan cara sistem operasi menghitung.</p>`
        }
    ],
    quiz: [
        {
            q: 'Kueri menghasilkan rasio <code>0.042</code>. Unit apa yang benar agar tampil 4,2%?',
            opts: ['<code>percent</code>', '<code>percentunit</code>', '<code>none</code> dengan decimals 2', '<code>ratio</code>'],
            a: 1,
            exp: '<code>percentunit</code> menerima rentang 0.0–1.0 dan mengalikan 100 saat menampilkan. <code>percent</code> mengharapkan nilai yang sudah dalam skala 0–100.'
        },
        {
            q: 'Anda ingin satu series memakai sumbu kanan dan warna merah tetap, tanpa mengubah series lain. Fitur yang dipakai?',
            opts: ['Transformation', 'Override dengan matcher byName', 'Value mapping', 'Panel terpisah'],
            a: 1,
            exp: 'Override menargetkan field tertentu lewat matcher dan menerapkan properti seperti <code>custom.axisPlacement</code> dan <code>color</code> hanya pada field itu.'
        },
        {
            q: 'Panel Stat berwarna merah karena threshold, tetapi tidak ada notifikasi. Kenapa?',
            opts: [
                'Contact point belum dikonfigurasi',
                'Threshold panel dan alert rule adalah dua sistem terpisah sejak unified alerting',
                'Panel Stat tidak mendukung alert',
                'Threshold harus mode percentage'
            ],
            a: 1,
            exp: 'Sejak Grafana 8, alert didefinisikan sebagai alert rule tersendiri. Threshold pada panel murni visual dan tidak pernah mengirim notifikasi.'
        }
    ]
},

/* ---------------------------------------------------------------- 8 ----- */
{
    id: 8,
    cat: '4 · Dashboard Dinamis',
    title: 'Variabel & Templating: Satu Dashboard untuk Semua Lingkungan',
    level: 'Menengah', dur: '25 mnt',
    tags: ['variabel', 'templating', 'query variable', 'repeat', 'ad hoc', 'chained'],
    desc: 'Mengganti dua puluh dashboard yang nyaris sama dengan satu dashboard yang bisa disaring, termasuk variabel berantai dan panel yang menggandakan diri.',
    theory: `
<h2>Masalah yang Diselesaikan Templating</h2>
<p>Tanpa variabel, Anda membuat dashboard terpisah untuk tiap lingkungan, tiap layanan, tiap region — lalu memperbaiki bug yang sama dua puluh kali. Variabel mengubahnya menjadi satu dashboard dengan dropdown.</p>

<h3>Tujuh Tipe Variabel</h3>
<table>
<thead><tr><th>Tipe</th><th>Isinya</th><th>Kasus khas</th></tr></thead>
<tbody>
<tr><td><strong>Query</strong></td><td>Hasil kueri ke data source</td><td>Daftar layanan, instance, namespace</td></tr>
<tr><td><strong>Custom</strong></td><td>Daftar statis yang Anda tulis</td><td>produksi, staging, dev</td></tr>
<tr><td><strong>Textbox</strong></td><td>Input bebas</td><td>Filter nama pengguna, ID pesanan</td></tr>
<tr><td><strong>Constant</strong></td><td>Nilai tetap tersembunyi</td><td>Prefix metrik, nama cluster</td></tr>
<tr><td><strong>Data source</strong></td><td>Daftar data source bertipe tertentu</td><td>Ganti cluster Prometheus</td></tr>
<tr><td><strong>Interval</strong></td><td>Pilihan rentang waktu</td><td>Kontrol granularitas manual</td></tr>
<tr><td><strong>Ad hoc filters</strong></td><td>Filter label dinamis</td><td>Eksplorasi bebas tanpa edit panel</td></tr>
</tbody>
</table>

<h3>Variabel Query untuk Prometheus</h3>
<pre data-lang="promql" data-file="kueri variabel">// semua nilai label "job"
label_values(job)

// nilai label "instance" hanya dari metrik tertentu
label_values(node_cpu_seconds_total, instance)

// dengan penyaringan — inilah dasar variabel berantai
label_values(up{env="\$env"}, layanan)

// daftar nama metrik dengan awalan tertentu
metrics(^bayarcepat_)

// hasil kueri penuh (jarang, tetapi kuat)
query_result(topk(10, sum by (route) (rate(http_requests_total[5m]))))</pre>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Variabel berantai (chained)</div>
    <p>Variabel boleh mereferensikan variabel lain. Grafana otomatis memuat ulang variabel anak saat induknya berubah.</p>
<pre data-lang="text">\$env      : custom → produksi, staging
\$cluster  : label_values(up{env="\$env"}, cluster)
\$layanan  : label_values(up{env="\$env", cluster="\$cluster"}, layanan)
\$instance : label_values(up{env="\$env", layanan="\$layanan"}, instance)</pre>
    <p>Hasilnya: memilih "produksi" langsung mempersempit seluruh dropdown di bawahnya. Ini pola paling berguna di seluruh Grafana.</p>
</div>

<h3>Sintaks Referensi dan Format</h3>
<pre data-lang="text" data-file="cara menulis variabel">\$layanan                 bentuk umum
\${layanan}               bila menempel teks lain: \${layanan}_total
[[layanan]]              sintaks lama, masih didukung

\${layanan:regex}         a|b|c            → untuk =~ di PromQL
\${layanan:pipe}          a|b|c
\${layanan:csv}           a,b,c            → untuk IN (...) di SQL
\${layanan:singlequote}   'a','b','c'      → untuk SQL
\${layanan:doublequote}   "a","b","c"
\${layanan:json}          ["a","b","c"]
\${layanan:text}          teks tampilan, bukan nilai
\${layanan:queryparam}    var-layanan=a&var-layanan=b</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Multi-value tanpa format yang benar akan merusak kueri</div>
<pre data-lang="promql">Variabel multi-value \$layanan = [api, ledger]

❌ up{layanan="\$layanan"}
   menjadi up{layanan="{api,ledger}"}  → tidak cocok apa pun

✅ up{layanan=~"\$layanan"}
   menjadi up{layanan=~"api|ledger"}   → benar</pre>
    <p>Aturannya: begitu sebuah variabel bisa multi-value, <strong>semua</strong> pemakaiannya di PromQL harus memakai <code>=~</code>, bukan <code>=</code>. Untuk SQL, gunakan <code>IN (\${layanan:singlequote})</code>.</p>
</div>

<h3>Opsi Penting pada Variabel</h3>
<table>
<thead><tr><th>Opsi</th><th>Efek</th><th>Catatan</th></tr></thead>
<tbody>
<tr><td>Multi-value</td><td>Boleh pilih beberapa</td><td>Wajib ubah <code>=</code> menjadi <code>=~</code></td></tr>
<tr><td>Include All</td><td>Menambah opsi "All"</td><td>Nilai default All adalah <code>.*</code></td></tr>
<tr><td>Custom all value</td><td>Ganti arti "All"</td><td>Pakai <code>.+</code> agar tidak ikut menangkap label kosong</td></tr>
<tr><td>Refresh</td><td>Kapan daftar dimuat ulang</td><td><em>On time range change</em> untuk label yang datang dan pergi</td></tr>
<tr><td>Sort</td><td>Urutan tampilan</td><td>Numerik alami untuk <code>node-1, node-2, node-10</code></td></tr>
<tr><td>Regex</td><td>Saring/ekstrak hasil</td><td>Grup bernama bisa memisahkan teks dan nilai</td></tr>
<tr><td>Hide</td><td>Sembunyikan label/variabel</td><td>Untuk constant dan variabel pembantu</td></tr>
</tbody>
</table>

<pre data-lang="text" data-file="regex pada variabel">// hanya instance produksi
/^prod-.*/

// buang port dari instance: 10.0.0.5:9100 → 10.0.0.5
/([^:]+):\\d+/

// teks tampilan berbeda dari nilai yang dipakai kueri
/(?&lt;text&gt;[^.]+)\\..*(?&lt;value&gt;.*)/</pre>

<h3>Repeat: Panel dan Baris yang Menggandakan Diri</h3>
<p>Alih-alih membuat delapan panel identik untuk delapan layanan, buat satu panel dan setel <strong>Repeat by variable</strong>.</p>
<pre data-lang="json" data-file="panel yang mengulang">{
  "title": "\$layanan — Throughput",
  "repeat": "layanan",
  "repeatDirection": "h",
  "maxPerRow": 4,
  "targets": [{
    "expr": "sum(rate(http_requests_total{layanan=\\"\$layanan\\"}[$__rate_interval]))"
  }]
}</pre>
<p>Repeat juga bisa diterapkan pada <strong>row</strong>, menghasilkan satu blok panel lengkap per nilai variabel — pola standar untuk dashboard multi-cluster.</p>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Repeat bukan sihir gratis</div>
    <p>Repeat dengan variabel berisi 50 nilai menghasilkan 50 panel, masing-masing menjalankan kuerinya sendiri. Satu klik "All" bisa mengirim ratusan kueri sekaligus.</p>
    <p>Pengaman: batasi daftar dengan regex, hindari <em>Include All</em> pada variabel yang dipakai untuk repeat, dan pertimbangkan satu panel teragregasi sebagai gantinya.</p>
</div>

<h3>Variabel Global Bawaan</h3>
<table>
<thead><tr><th>Variabel</th><th>Isi</th></tr></thead>
<tbody>
<tr><td><code>\$__dashboard</code></td><td>Nama dashboard saat ini</td></tr>
<tr><td><code>\$__from</code>, <code>\$__to</code></td><td>Batas rentang waktu (epoch ms)</td></tr>
<tr><td><code>\$__user.login</code>, <code>\$__user.email</code></td><td>Identitas pengguna</td></tr>
<tr><td><code>\$__org.name</code></td><td>Nama organisasi</td></tr>
<tr><td><code>\$__timeFilter</code></td><td>Filter waktu untuk SQL</td></tr>
<tr><td><code>\$__name</code></td><td>Nama series (di dalam legend/override)</td></tr>
</tbody>
</table>
<p>Format waktu bisa disesuaikan: <code>\${__from:date:YYYY-MM-DD}</code> atau <code>\${__from:date:seconds}</code> — berguna saat membangun tautan ke sistem eksternal.</p>`,
    lab: {
        intro: `
<h3>Praktik: Membangun Rantai Variabel Empat Tingkat</h3>
<p>Buat dashboard yang menyaring dari lingkungan sampai instance, lalu ulangi panel per layanan.</p>`,
        files: [{
            name: 'templating.json', lang: 'json', code: `{
  "templating": {
    "list": [
      {
        "name": "env", "label": "Lingkungan", "type": "custom",
        "query": "produksi,staging,dev",
        "current": { "text": "produksi", "value": "produksi" }
      },
      {
        "name": "cluster", "label": "Cluster", "type": "query",
        "datasource": { "type": "prometheus", "uid": "prom-utama" },
        "query": { "query": "label_values(up{env=\\"$env\\"}, cluster)", "refId": "A" },
        "refresh": 2, "sort": 1
      },
      {
        "name": "layanan", "label": "Layanan", "type": "query",
        "datasource": { "type": "prometheus", "uid": "prom-utama" },
        "query": { "query": "label_values(up{env=\\"$env\\", cluster=\\"$cluster\\"}, layanan)", "refId": "A" },
        "refresh": 2, "sort": 1,
        "multi": true, "includeAll": true, "allValue": ".+"
      },
      {
        "name": "instance", "label": "Instance", "type": "query",
        "datasource": { "type": "prometheus", "uid": "prom-utama" },
        "query": { "query": "label_values(up{env=\\"$env\\", layanan=~\\"$layanan\\"}, instance)", "refId": "A" },
        "refresh": 2, "sort": 3,
        "multi": true, "includeAll": true, "allValue": ".+",
        "regex": "/([^:]+):\\\\d+/"
      },
      {
        "name": "ds", "label": "Sumber Data", "type": "datasource",
        "query": "prometheus", "hide": 0
      },
      {
        "name": "adhoc", "type": "adhoc",
        "datasource": { "type": "prometheus", "uid": "prom-utama" }
      }
    ]
  }
}` }],
        steps: [
            { note: 'Lihat nilai apa yang dihasilkan sebuah variabel query', cmd: 'grafana var preview label_values(up, job)' },
            { note: 'Uji bagaimana multi-value diinterpolasi ke PromQL', cmd: 'grafana var interpolate layanan=api,ledger regex' },
            { note: 'Buktikan kesalahan klasik: multi-value dengan tanda sama dengan', cmd: 'grafana var interpolate layanan=api,ledger plain' },
            { note: 'Hitung berapa panel yang dihasilkan repeat', cmd: 'grafana var repeat layanan' }
        ],
        snippets: ['grafana var preview label_values(up, job)', 'grafana var interpolate layanan=api,ledger regex', 'grafana var repeat layanan', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN memakai <code>=</code> untuk variabel multi-value',
            body: `<p>Kesalahan paling sering di seluruh Grafana. Variabel multi-value diinterpolasi menjadi <code>{api,ledger}</code>, yang tidak cocok dengan apa pun bila dipakai dengan pencocokan persis.</p>
<pre data-lang="promql">❌ up{layanan="\$layanan"}
✅ up{layanan=~"\$layanan"}

# SQL:
❌ WHERE layanan = '\$layanan'
✅ WHERE layanan IN (\${layanan:singlequote})</pre>
<p>Gejalanya jahat: panel kosong hanya ketika lebih dari satu nilai dipilih, sehingga bug lolos dari pengujian yang memakai satu pilihan saja.</p>`
        },
        {
            kind: 'salah', title: 'Membiarkan "All" bernilai <code>.*</code>',
            body: `<p>Nilai bawaan untuk opsi All adalah <code>.*</code>, yang juga cocok dengan <strong>string kosong</strong>. Akibatnya series yang tidak memiliki label tersebut ikut tertarik masuk, dan angka total menjadi lebih besar dari seharusnya.</p>
<p>Setel <strong>Custom all value</strong> menjadi <code>.+</code> agar hanya mencocokkan nilai yang benar-benar ada. Untuk daftar yang besar, pertimbangkan tidak menyediakan opsi All sama sekali.</p>`
        },
        {
            kind: 'best', title: 'Kaitkan variabel ke rentang waktu bila targetnya fana',
            body: `<p>Di lingkungan Kubernetes, pod datang dan pergi. Variabel dengan <em>Refresh: On dashboard load</em> akan menampilkan pod yang sudah lama mati, atau melewatkan pod yang baru lahir.</p>
<ul>
<li>Pakai <em>Refresh: On time range change</em> untuk instance, pod, dan container.</li>
<li>Pakai <em>On dashboard load</em> untuk daftar yang stabil seperti cluster atau environment — lebih hemat kueri.</li>
<li>Tambahkan rentang waktu pada kueri variabel, misalnya <code>label_values(up[\$__range], instance)</code>, bila didukung.</li>
</ul>`
        },
        {
            kind: 'kasus', title: 'Satu dashboard mengirim 600 kueri karena satu klik',
            body: `<p>Sebuah dashboard punya panel dengan <code>repeat: pod</code> dan variabel <code>pod</code> yang menyediakan opsi All. Di cluster dengan 200 pod, seseorang memilih All: Grafana membuat 200 panel, masing-masing dengan tiga kueri, seluruhnya dikirim bersamaan.</p>
<p>Prometheus mengembalikan <code>429</code>, dashboard lain ikut gagal memuat, dan tim mengira Prometheus sedang bermasalah. Perbaikannya: hapus opsi All dari variabel repeat, batasi <code>maxPerRow</code>, dan sediakan panel agregat sebagai tampilan utama dengan repeat sebagai tampilan detail terpisah.</p>`
        }
    ],
    quiz: [
        {
            q: 'Variabel multi-value <code>\$layanan</code> dipakai sebagai <code>up{layanan="\$layanan"}</code>. Apa yang terjadi saat dua nilai dipilih?',
            opts: [
                'Grafana otomatis mengubahnya menjadi regex',
                'Menjadi <code>layanan="{api,ledger}"</code> dan tidak cocok apa pun',
                'Hanya nilai pertama yang dipakai',
                'Panel menampilkan gabungan keduanya'
            ],
            a: 1,
            exp: 'Interpolasi multi-value menghasilkan bentuk <code>{a,b}</code>. Pencocokan persis tidak akan menemukan series apa pun; harus memakai <code>=~</code> yang menerima <code>api|ledger</code>.'
        },
        {
            q: 'Kenapa <em>Custom all value</em> sebaiknya diisi <code>.+</code> alih-alih dibiarkan <code>.*</code>?',
            opts: [
                'Lebih cepat dieksekusi',
                '<code>.*</code> juga mencocokkan label kosong sehingga series tanpa label itu ikut terhitung',
                '<code>.*</code> tidak valid di PromQL',
                'Agar opsi All muncul di urutan pertama'
            ],
            a: 1,
            exp: 'Regex PromQL bersifat anchored penuh; <code>.*</code> cocok dengan string kosong, artinya series yang sama sekali tidak punya label tersebut ikut terpilih dan membuat agregasi menggelembung.'
        },
        {
            q: 'Variabel <code>\$instance</code> di cluster Kubernetes sering menampilkan pod yang sudah mati. Setelan apa yang memperbaikinya?',
            opts: [
                'Mengaktifkan Multi-value',
                'Mengubah Refresh menjadi "On time range change"',
                'Menambahkan regex filter',
                'Mengubah tipe menjadi Custom'
            ],
            a: 1,
            exp: 'Dengan refresh mengikuti rentang waktu, daftar dimuat ulang setiap kali time range berubah dan mencerminkan target yang benar-benar ada pada periode yang sedang dilihat.'
        }
    ]
},

/* ---------------------------------------------------------------- 9 ----- */
{
    id: 9,
    cat: '4 · Dashboard Dinamis',
    title: 'Transformations: Mengolah Data Frame Sebelum Digambar',
    level: 'Lanjut', dur: '22 mnt',
    tags: ['transformation', 'join', 'organize', 'group by', 'data frame'],
    desc: 'Menggabungkan hasil beberapa kueri, merapikan kolom, dan melakukan perhitungan tanpa menyentuh bahasa kueri sumber.',
    theory: `
<h2>Kapan Transformation adalah Jawabannya</h2>
<p>Transformation adalah rantai operasi pada data frame yang berjalan di browser, <strong>sesudah</strong> data diterima dan <strong>sebelum</strong> digambar. Ia menyelesaikan hal-hal yang tidak bisa dilakukan bahasa kueri.</p>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Urutan berpikir yang benar</div>
    <ol>
        <li><strong>Bisakah dilakukan di kueri?</strong> Kerjakan di sana — lebih hemat dan bisa dipakai alerting.</li>
        <li><strong>Perlu menggabungkan dua data source?</strong> Transformation (atau Expression).</li>
        <li><strong>Hanya soal tampilan kolom?</strong> Transformation.</li>
        <li><strong>Butuh dipakai untuk alert?</strong> Harus Expression, bukan transformation — alerting tidak menjalankan transformation.</li>
    </ol>
</div>

<h3>Transformation yang Paling Sering Dipakai</h3>
<table>
<thead><tr><th>Nama</th><th>Fungsi</th><th>Kasus khas</th></tr></thead>
<tbody>
<tr><td><strong>Organize fields</strong></td><td>Sembunyikan, urutkan, ganti nama kolom</td><td>Merapikan tabel</td></tr>
<tr><td><strong>Join by field</strong></td><td>Gabung frame pada kolom kunci</td><td>Metrik + metadata dari SQL</td></tr>
<tr><td><strong>Add field from calculation</strong></td><td>Kolom baru hasil hitungan</td><td>Rasio, selisih, kumulatif</td></tr>
<tr><td><strong>Reduce</strong></td><td>Deret menjadi satu baris ringkasan</td><td>Tabel "rata-rata & maks per layanan"</td></tr>
<tr><td><strong>Group by</strong></td><td>Kelompokkan lalu agregasi</td><td>Total per region</td></tr>
<tr><td><strong>Filter data by values</strong></td><td>Buang baris berdasarkan nilai</td><td>Sembunyikan yang nol</td></tr>
<tr><td><strong>Sort by</strong></td><td>Urutkan baris</td><td>Terbesar di atas</td></tr>
<tr><td><strong>Labels to fields</strong></td><td>Label menjadi kolom</td><td>Menyiapkan tabel dari Prometheus</td></tr>
<tr><td><strong>Rows to fields</strong></td><td>Baris menjadi kolom</td><td>Membentuk tabel ringkasan</td></tr>
<tr><td><strong>Config from query</strong></td><td>Hasil kueri menjadi setelan panel</td><td>Threshold dinamis dari basis data</td></tr>
<tr><td><strong>Partition by values</strong></td><td>Pecah satu frame per nilai</td><td>Series terpisah dari kolom kategori</td></tr>
</tbody>
</table>

<h3>Contoh Nyata 1 — Menyatukan Metrik dan Metadata Bisnis</h3>
<p>Prometheus tahu <code>merchant_id</code>, tetapi tidak tahu nama merchant. Nama itu ada di PostgreSQL. Transformation menyatukannya.</p>
<pre data-lang="text" data-file="alur">Kueri A (Prometheus):
  sum by (merchant_id) (rate(transaksi_total[$__rate_interval]))
  → | merchant_id | Value |

Kueri B (PostgreSQL):
  SELECT id AS merchant_id, nama, tier FROM merchant
  → | merchant_id | nama | tier |

Transformations:
  1. Join by field   → field: merchant_id, mode: outer
  2. Organize fields → sembunyikan merchant_id, urutkan: nama, tier, Value
  3. Sort by         → Value, desc

Hasil:
  | nama          | tier  | Value |
  | Toko Sinar    | gold  | 42.1  |
  | Warung Bu Ani | basic | 18.7  |</pre>

<h3>Contoh Nyata 2 — Rasio dari Dua Kueri</h3>
<pre data-lang="text" data-file="add field from calculation">Kueri A: sum(rate(cache_hits_total[$__rate_interval]))
Kueri B: sum(rate(cache_requests_total[$__rate_interval]))

Transformation: Add field from calculation
  Mode       : Binary operation
  Operation  : A / B
  Alias      : hit ratio

Lalu override pada "hit ratio": unit = percentunit</pre>
<p>Untuk kebutuhan yang sama tetapi hasilnya akan dipakai alerting, gunakan <strong>Expression Math</strong> — alert rule tidak menjalankan transformation.</p>

<h3>Contoh Nyata 3 — Tabel Ringkasan SLO</h3>
<pre data-lang="text" data-file="reduce + organize">Kueri: histogram_quantile(0.95, sum by (layanan, le) (
         rate(http_request_duration_seconds_bucket[$__rate_interval])))

Transformations:
  1. Reduce
       Mode        : Series to rows
       Calculations: Mean, Max, Last
  2. Organize fields
       Rename: Field → Layanan, Mean → Rata-rata, Max → Puncak
  3. Sort by: Puncak, desc

Hasil:
  | Layanan | Rata-rata | Puncak | Last  |
  | ledger  | 0.412 s   | 2.81 s | 0.39s |
  | api     | 0.180 s   | 0.94 s | 0.17s |</pre>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Urutan transformation menentukan hasil</div>
    <p>Rantai transformation dieksekusi berurutan dari atas ke bawah; keluaran satu langkah menjadi masukan langkah berikutnya.</p>
<pre data-lang="text">Filter → Reduce   : membuang baris dulu, ringkasan dihitung dari sisa
Reduce → Filter   : meringkas semua dulu, baru menyaring hasilnya

Angka rata-ratanya berbeda. Keduanya valid — pastikan Anda memilih
yang sesuai dengan pertanyaan yang ingin dijawab.</pre>
</div>

<h3>Join by Field: Bagian yang Paling Sering Gagal</h3>
<table>
<thead><tr><th>Mode</th><th>Perilaku</th><th>Pakai ketika</th></tr></thead>
<tbody>
<tr><td><code>outer</code></td><td>Semua baris dari semua frame</td><td>Ingin melihat yang tidak berpasangan</td></tr>
<tr><td><code>inner</code></td><td>Hanya yang cocok di semua frame</td><td>Tabel bersih tanpa lubang</td></tr>
<tr><td><code>outer (tabular)</code></td><td>Outer untuk data non-time-series</td><td>Menggabungkan hasil SQL</td></tr>
</tbody>
</table>
<p>Penyebab kegagalan paling umum: <strong>tipe kolom kunci berbeda</strong>. <code>merchant_id</code> berupa string di Prometheus (semua label Prometheus adalah string) tetapi integer di SQL. Perbaikannya: konversi di sisi SQL dengan <code>id::text AS merchant_id</code>, atau pakai transformation <em>Convert field type</em> lebih dulu.</p>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Transformation tidak mengurangi beban apa pun</div>
    <p>Menarik 200.000 baris lalu memfilternya menjadi 50 dengan transformation tetap berarti 200.000 baris melintasi jaringan dan diproses browser. Waktu muat tidak membaik sedikit pun.</p>
    <p>Filter di kueri, rapikan dengan transformation. Bukan sebaliknya.</p>
</div>

<h3>Debugging Transformation</h3>
<p>Buka <strong>Panel Inspect → Data</strong>, lalu gunakan pilihan "Apply panel transformations" untuk melihat frame sebelum dan sesudah. Sembilan dari sepuluh masalah transformation adalah bentuk frame yang berbeda dari yang dibayangkan — misalnya Anda mengira mendapat satu frame berisi tiga kolom, padahal yang datang adalah tiga frame terpisah.</p>`,
    lab: {
        intro: `
<h3>Praktik: Tabel Gabungan dari Dua Data Source</h3>
<p>Satukan angka dari Prometheus dengan nama dari PostgreSQL dalam satu tabel yang enak dibaca.</p>`,
        files: [{
            name: 'transformations.json', lang: 'json', code: `{
  "type": "table",
  "title": "Top Merchant berdasarkan Volume Transaksi",
  "targets": [
    { "refId": "A",
      "datasource": { "type": "prometheus", "uid": "prom-utama" },
      "instant": true,
      "expr": "topk(10, sum by (merchant_id) (rate(transaksi_total[$__rate_interval])))" },
    { "refId": "B",
      "datasource": { "type": "postgres", "uid": "pg-bisnis" },
      "format": "table",
      "rawSql": "SELECT id::text AS merchant_id, nama, tier FROM merchant" }
  ],
  "transformations": [
    { "id": "joinByField",
      "options": { "byField": "merchant_id", "mode": "outer" } },
    { "id": "filterFieldsByName",
      "options": { "include": { "names": ["nama", "tier", "Value"] } } },
    { "id": "organize",
      "options": {
        "renameByName": { "nama": "Merchant", "tier": "Tier", "Value": "TPS" },
        "indexByName": { "nama": 0, "tier": 1, "Value": 2 }
      } },
    { "id": "sortBy",
      "options": { "sort": [{ "field": "TPS", "desc": true }] } }
  ],
  "fieldConfig": {
    "defaults": { "custom": { "align": "auto", "cellOptions": { "type": "auto" } } },
    "overrides": [
      { "matcher": { "id": "byName", "options": "TPS" },
        "properties": [
          { "id": "unit", "value": "reqps" },
          { "id": "decimals", "value": 1 },
          { "id": "custom.cellOptions", "value": { "type": "gauge", "mode": "gradient" } }
        ] }
    ]
  }
}` }],
        steps: [
            { note: 'Lihat bentuk frame sebelum transformation', cmd: 'grafana panel inspect 5 --raw' },
            { note: 'Lihat bentuk frame sesudah transformation', cmd: 'grafana panel inspect 5 --transformed' },
            { note: 'Cek tipe kolom kunci — penyebab join gagal paling umum', cmd: 'grafana frame schema 5' },
            { note: 'Uji rantai transformation langkah demi langkah', cmd: 'grafana transform chain 5' }
        ],
        snippets: ['grafana panel inspect 5 --raw', 'grafana frame schema 5', 'grafana transform chain 5', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN memakai transformation untuk mengurangi jumlah data',
            body: `<p>Transformation berjalan setelah data tiba di browser. Kueri yang mengembalikan 500.000 titik tetap dikirim seluruhnya, tetap diserialisasi, dan tetap membebani memori tab browser — walaupun transformation Anda hanya menyisakan sepuluh baris.</p>
<pre data-lang="promql">❌ kueri: http_requests_total          + transformation Filter
✅ kueri: topk(10, sum by (route) (rate(http_requests_total[$__rate_interval])))</pre>`
        },
        {
            kind: 'salah', title: 'Mengharapkan transformation berjalan di alert rule',
            body: `<p>Alert rule mengevaluasi kueri dan <strong>Expression</strong>, tetapi tidak pernah menjalankan transformation panel. Panel yang menunjukkan "error rate 5%" hasil transformation tidak bisa langsung dijadikan alert.</p>
<p>Bila sebuah perhitungan perlu memicu alert, bangun dengan Expression (Math/Reduce/Threshold) sejak awal, atau pindahkan perhitungannya ke recording rule di Prometheus — cara ini sekaligus membuatnya lebih cepat.</p>`
        },
        {
            kind: 'best', title: 'Selalu periksa tipe kolom sebelum join',
            body: `<p>Seluruh label Prometheus bertipe string. Kolom <code>id</code> di PostgreSQL biasanya integer. Join keduanya akan menghasilkan tabel kosong tanpa pesan kesalahan yang jelas.</p>
<pre data-lang="sql">-- samakan tipe di sisi SQL
SELECT id::text AS merchant_id, nama FROM merchant</pre>
<p>Alternatif: sisipkan transformation <em>Convert field type</em> sebelum join, dan verifikasi lewat Panel Inspect bahwa kedua kolom kunci benar-benar bertipe sama.</p>`
        },
        {
            kind: 'kasus', title: 'Angka di tabel berbeda dari angka di grafik pada dashboard yang sama',
            body: `<p>Sebuah tim melaporkan bahwa panel Stat menampilkan rata-rata 240 ms sementara tabel di sebelahnya menampilkan 310 ms untuk metrik yang sama.</p>
<p>Penyebabnya urutan transformation: tabel menjalankan <em>Filter</em> yang membuang series bernilai nol <strong>sebelum</strong> <em>Reduce</em>, sementara panel Stat meringkas seluruh series termasuk yang nol. Keduanya benar secara teknis, tetapi menjawab pertanyaan yang berbeda — dan tidak seorang pun menyadarinya selama berbulan-bulan.</p>
<p>Pelajaran: tulis di <code>description</code> panel apa persisnya yang dihitung, terutama ketika ada rantai transformation.</p>`
        }
    ],
    quiz: [
        {
            q: 'Join by field antara Prometheus dan PostgreSQL menghasilkan tabel kosong. Penyebab paling mungkin?',
            opts: [
                'Mode join salah',
                'Tipe kolom kunci berbeda (string vs integer)',
                'Data source tidak boleh dicampur',
                'Perlu instant query'
            ],
            a: 1,
            exp: 'Label Prometheus selalu string. Bila kolom kunci di SQL bertipe integer, tidak ada baris yang dianggap cocok. Samakan tipe dengan <code>::text</code> atau transformation Convert field type.'
        },
        {
            q: 'Perhitungan yang harus bisa memicu alert sebaiknya dibuat dengan…',
            opts: [
                'Transformation "Add field from calculation"',
                'Expression bertipe Math',
                'Override pada fieldConfig',
                'Value mapping'
            ],
            a: 1,
            exp: 'Alert rule mengevaluasi kueri dan Expression saja. Transformation adalah operasi sisi klien pada panel dan tidak pernah dijalankan oleh evaluator alert.'
        },
        {
            q: 'Mengapa mengurutkan Filter sebelum atau sesudah Reduce menghasilkan angka berbeda?',
            opts: [
                'Karena Reduce selalu mengabaikan filter',
                'Karena rantai dieksekusi berurutan, sehingga masukan Reduce berbeda',
                'Karena Filter hanya bekerja pada frame pertama',
                'Karena Reduce membutuhkan data terurut'
            ],
            a: 1,
            exp: 'Keluaran satu transformation menjadi masukan berikutnya. Menyaring lebih dulu berarti ringkasan dihitung hanya dari baris tersisa; meringkas lebih dulu berarti ringkasan mencakup semua baris.'
        }
    ]
},

/* ---------------------------------------------------------------- 10 ---- */
{
    id: 10,
    cat: '4 · Dashboard Dinamis',
    title: 'Merancang Dashboard yang Dipakai: Baris, Anotasi, Tautan',
    level: 'Menengah', dur: '18 mnt',
    tags: ['desain', 'row', 'anotasi', 'links', 'red', 'use', 'kiosk'],
    desc: 'Menyusun dashboard mengikuti cara orang membacanya saat panik, memakai metode RED dan USE, serta menandai peristiwa penting pada grafik.',
    theory: `
<h2>Dashboard Dibaca oleh Orang yang Sedang Panik</h2>
<p>Pertanyaan perancangan yang benar bukan "informasi apa yang bisa saya tampilkan", melainkan <em>"apa yang perlu dilihat seseorang pukul 03:00 saat pager berbunyi, dalam sepuluh detik pertama?"</em></p>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Hierarki tiga lapis</div>
    <ol>
        <li><strong>Lapis 1 — Apakah ada masalah?</strong> Satu baris berisi 4–6 stat: ketersediaan, error rate, latency p95, throughput. Terbaca dari jarak tiga meter.</li>
        <li><strong>Lapis 2 — Di mana masalahnya?</strong> Grafik per layanan atau per komponen. Menunjukkan siapa yang menyimpang.</li>
        <li><strong>Lapis 3 — Kenapa?</strong> Detail: per instance, per endpoint, saturasi resource, log terkait. Taruh di baris yang <em>collapsed</em>.</li>
    </ol>
</div>

<h3>Dua Metode Baku</h3>
<table>
<thead><tr><th>Metode</th><th>Untuk</th><th>Metrik</th></tr></thead>
<tbody>
<tr><td><strong>RED</strong></td><td>Layanan yang melayani request</td><td><strong>R</strong>ate, <strong>E</strong>rrors, <strong>D</strong>uration</td></tr>
<tr><td><strong>USE</strong></td><td>Sumber daya (CPU, disk, memori, pool)</td><td><strong>U</strong>tilization, <strong>S</strong>aturation, <strong>E</strong>rrors</td></tr>
</tbody>
</table>
<p>Dashboard layanan yang lengkap biasanya memakai RED di bagian atas untuk gambaran pelanggan, dan USE di baris tertutup di bawah untuk mencari penyebab.</p>

<h3>Baris (Row) — Struktur, Bukan Hiasan</h3>
<pre data-lang="json" data-file="row">{
  "type": "row",
  "title": "Detail per Instance",
  "collapsed": true,
  "gridPos": { "h": 1, "w": 24, "x": 0, "y": 20 },
  "repeat": "layanan",
  "panels": [ /* panel di dalam row tertutup disimpan di sini */ ]
}</pre>
<div class="callout callout-info">
    <div class="callout-title">💡 Row tertutup = panel tidak dieksekusi</div>
    <p>Panel di dalam row yang <code>collapsed: true</code> <strong>tidak menjalankan kueri</strong> sampai row dibuka. Ini teknik optimasi paling sederhana dan paling efektif untuk dashboard besar: taruh semua detail di row tertutup, dan biarkan lapis 1 memuat instan.</p>
</div>

<h3>Anotasi — Menjawab "Apa yang Berubah?"</h3>
<p>Anotasi menggambar garis vertikal atau area pada grafik untuk menandai peristiwa. Nilainya besar: sebagian besar insiden disebabkan oleh perubahan, dan anotasi membuat korelasinya terlihat seketika.</p>
<pre data-lang="json" data-file="sumber anotasi">"annotations": {
  "list": [
    {
      "name": "Deploy",
      "datasource": { "type": "prometheus", "uid": "prom-utama" },
      "enable": true,
      "iconColor": "blue",
      "expr": "changes(app_build_info[5m]) > 0",
      "titleFormat": "Deploy {{layanan}}",
      "textFormat": "versi {{versi}}"
    },
    {
      "name": "Insiden",
      "datasource": { "type": "grafana" },
      "enable": true,
      "iconColor": "red",
      "filter": { "exclude": false, "ids": [] },
      "target": { "type": "tags", "tags": ["insiden"], "matchAny": false }
    },
    {
      "name": "Alert aktif",
      "datasource": { "type": "grafana" },
      "enable": true,
      "iconColor": "orange",
      "target": { "type": "dashboard", "limit": 100 }
    }
  ]
}</pre>
<p>Anotasi juga bisa dikirim lewat API — pola yang sangat berguna adalah menambahkan satu langkah di pipeline CI/CD yang mencatat setiap deploy.</p>
<pre data-lang="bash" data-file="anotasi dari pipeline">curl -sS -X POST http://grafana:3000/api/annotations \\
  -H "Authorization: Bearer $GRAFANA_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d "{
    \\"time\\": $(date +%s000),
    \\"tags\\": [\\"deploy\\", \\"$LAYANAN\\", \\"$LINGKUNGAN\\"],
    \\"text\\": \\"Deploy $LAYANAN versi $VERSI oleh $CI_ACTOR\\"
  }"</pre>

<h3>Dashboard Links dan Panel Links</h3>
<ul>
<li><strong>Dashboard link (tipe dashboards)</strong> — tautan ke semua dashboard bertag tertentu. Aktifkan <em>Include current time range</em> dan <em>Include current variable values</em> agar konteks ikut berpindah.</li>
<li><strong>Dashboard link (tipe link)</strong> — URL bebas: runbook, papan insiden, dokumentasi arsitektur.</li>
<li><strong>Panel link</strong> — muncul di sudut panel, untuk konteks spesifik panel itu.</li>
<li><strong>Data link</strong> — pada titik data; membawa nilai dan label ke tujuan (lihat bab 7).</li>
</ul>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Tanpa "include variables", tautan kehilangan konteks</div>
    <p>Pengguna sedang melihat produksi/cluster-jkt, mengklik tautan ke dashboard detail, dan mendapat dashboard dengan variabel default — kembali ke staging. Alur investigasi terputus dan orang harus memilih ulang semuanya secara manual.</p>
</div>

<h3>Praktik Baik yang Terbukti</h3>
<ul>
<li><strong>Judul yang menyatakan sesuatu.</strong> "Error rate melewati SLO?" lebih baik daripada "Errors".</li>
<li><strong>Isi <code>description</code> setiap panel.</strong> Terutama kueri yang tidak jelas — ikon info menyelamatkan rekan tim.</li>
<li><strong>Panel teks di paling atas.</strong> Satu paragraf: dashboard ini untuk apa, siapa pemiliknya, tautan runbook.</li>
<li><strong>Batasi 12–15 panel terlihat.</strong> Selebihnya masukkan row tertutup.</li>
<li><strong>Beri tag konsisten:</strong> <code>tim:pembayaran</code>, <code>tingkat:layanan</code>, <code>produksi</code>.</li>
<li><strong>Uji di lebar layar target.</strong> Dashboard untuk TV ruang operasi harus dirancang di resolusi TV, bukan laptop.</li>
</ul>

<h3>Mode Kiosk untuk Layar Operasi</h3>
<pre data-lang="text" data-file="URL kiosk">/d/&lt;uid&gt;/&lt;slug&gt;?kiosk&amp;refresh=1m&amp;theme=light&amp;from=now-6h&amp;to=now

kiosk        sembunyikan menu dan chrome
kiosk=tv     sembunyikan menu, sisakan header
&amp;autofitpanels    panel mengisi tinggi layar</pre>
<p>Untuk rotasi beberapa dashboard di satu layar, gunakan <strong>Playlist</strong>. Pasangkan dengan akun khusus ber-peran Viewer dan token yang berumur panjang, jangan memakai akun pribadi seseorang.</p>`,
    lab: {
        intro: `
<h3>Praktik: Menambahkan Anotasi Deploy dari Pipeline</h3>
<p>Buat token, kirim anotasi, dan lihat garis deploy muncul di seluruh dashboard.</p>`,
        files: [{
            name: 'anotasi-deploy.sh', lang: 'bash', code: `#!/usr/bin/env bash
set -euo pipefail

GRAFANA="\${GRAFANA_URL:-http://localhost:3000}"
TOKEN="\${GRAFANA_TOKEN:?token wajib diisi}"
LAYANAN="\${1:?nama layanan}"
VERSI="\${2:?versi}"

curl -sS -X POST "$GRAFANA/api/annotations" \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d "{
    \\"time\\": $(date +%s)000,
    \\"tags\\": [\\"deploy\\", \\"$LAYANAN\\"],
    \\"text\\": \\"Deploy <b>$LAYANAN</b> versi $VERSI\\"
  }" | jq -r '.message'

# anotasi berdurasi (area, bukan garis) — untuk window maintenance
# tambahkan "timeEnd": <epoch_ms> pada payload di atas` }],
        steps: [
            { note: 'Buat service account token untuk pipeline', cmd: 'grafana token create ci-deploy Editor' },
            { note: 'Kirim satu anotasi deploy', cmd: 'grafana annotate deploy ledger v2.4.1' },
            { note: 'Lihat anotasi dalam rentang waktu tertentu', cmd: 'grafana annotate list deploy' },
            { note: 'Buka dashboard dalam mode kiosk', cmd: 'grafana url kiosk bayarcepat-ikhtisar' }
        ],
        snippets: ['grafana annotate deploy ledger v2.4.1', 'grafana annotate list deploy', 'grafana url kiosk bayarcepat-ikhtisar', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN membuat dashboard berisi 60 panel dalam satu halaman',
            body: `<p>Dashboard "semua ada di sini" tidak pernah dipakai saat insiden, karena tidak ada yang tahu harus melihat ke mana. Ia juga memuat lambat dan membebani data source.</p>
<ul>
<li>Pisahkan menjadi dashboard ikhtisar dan dashboard detail, hubungkan dengan links.</li>
<li>Batasi 12–15 panel yang langsung terlihat.</li>
<li>Sembunyikan detail di row tertutup — panel di dalamnya bahkan tidak menjalankan kueri.</li>
</ul>`
        },
        {
            kind: 'salah', title: 'Membuat tautan tanpa membawa konteks',
            body: `<p>Tautan antar dashboard yang tidak menyertakan time range dan nilai variabel memaksa pengguna mengatur ulang semuanya. Saat insiden, ini bukan sekadar merepotkan — orang kehilangan jejak waktu kejadian yang sedang diselidiki.</p>
<pre data-lang="text">❌ /d/detail-layanan/detail
✅ /d/detail-layanan/detail?\${__all_variables}&from=\${__from}&to=\${__to}</pre>
<p>Pada dashboard link berbasis UI, centang <em>Include current time range</em> dan <em>Include current template variable values</em>.</p>`
        },
        {
            kind: 'best', title: 'Catat setiap deploy sebagai anotasi otomatis',
            body: `<p>Ini perubahan berdampak paling besar dengan usaha paling kecil dalam observability. Sebagian besar insiden dipicu oleh perubahan; garis vertikal biru tepat sebelum grafik menanjak menjawab pertanyaan "apa yang berubah?" dalam satu detik.</p>
<p>Tambahkan satu langkah <code>curl</code> di akhir job deploy pipeline. Sertakan versi dan pelaku deploy dalam teks anotasi, dan pakai tag yang konsisten agar bisa disaring per layanan.</p>`
        },
        {
            kind: 'kasus', title: 'Dashboard cantik yang tidak pernah dibuka',
            body: `<p>Sebuah tim menghabiskan dua minggu membuat dashboard dengan 45 panel, gauge berwarna, dan pie chart. Enam bulan kemudian, statistik pemakaian menunjukkan ia dibuka sembilan kali — sementara dashboard sederhana berisi enam panel dibuka ribuan kali.</p>
<p>Yang dipakai orang adalah dashboard yang menjawab satu pertanyaan dengan cepat. Grafana menyimpan statistik ini; buka <strong>Dashboard settings → Usage insights</strong> (atau kueri tabel <code>dashboard_usage</code>) dan hapus dashboard yang tidak pernah disentuh. Dashboard yang tidak dipakai bukan netral — ia menambah kebingungan saat orang mencari.</p>`
        }
    ],
    quiz: [
        {
            q: 'Apa keuntungan teknis menaruh panel detail di dalam row yang collapsed?',
            opts: [
                'Panel dirender lebih cepat',
                'Kueri panel tidak dijalankan sampai row dibuka',
                'Panel otomatis memakai instant query',
                'Data di-cache lebih lama'
            ],
            a: 1,
            exp: 'Panel di dalam row tertutup tidak mengeksekusi kueri sama sekali. Ini cara paling murah memangkas waktu muat dashboard besar sekaligus mengurangi beban data source.'
        },
        {
            q: 'Metode RED terdiri dari…',
            opts: [
                'Rate, Errors, Duration',
                'Requests, Endpoints, Downtime',
                'Reliability, Efficiency, Durability',
                'Rate, Errors, Dependencies'
            ],
            a: 0,
            exp: 'RED (Rate, Errors, Duration) memantau layanan dari sudut pandang pengguna. USE (Utilization, Saturation, Errors) memantau sumber daya dari sudut pandang sistem.'
        },
        {
            q: 'Praktik apa yang paling efektif untuk menjawab "apa yang berubah?" saat insiden?',
            opts: [
                'Menambah panel log',
                'Menambahkan anotasi deploy otomatis dari pipeline CI/CD',
                'Menaikkan refresh interval',
                'Membuat dashboard terpisah per rilis'
            ],
            a: 1,
            exp: 'Anotasi deploy menggambar garis vertikal pada semua grafik, sehingga korelasi antara perubahan dan penurunan metrik langsung terlihat tanpa perlu menelusuri riwayat rilis secara manual.'
        }
    ]
}

];

/* ==========================================================================
   GRAFANA — BAGIAN C (Alerting, Korelasi, Auth, Skala, Provisioning)
   ========================================================================== */

const GRAF_MOD_C = [

/* ---------------------------------------------------------------- 11 ---- */
{
    id: 11,
    cat: '5 · Alerting',
    title: 'Unified Alerting: Rule, Expression, dan State Machine',
    level: 'Lanjut', dur: '25 mnt',
    tags: ['alerting', 'alert rule', 'expression', 'pending', 'no data', 'grafana managed'],
    desc: 'Membangun alert yang benar-benar berbunyi saat perlu dan diam saat tidak, termasuk memahami siklus state yang sering disalahpahami.',
    theory: `
<h2>Dua Jenis Alert Rule</h2>
<table>
<thead><tr><th></th><th>Grafana-managed</th><th>Data source-managed</th></tr></thead>
<tbody>
<tr><td>Dievaluasi oleh</td><td>Grafana</td><td>Prometheus / Mimir / Loki</td></tr>
<tr><td>Sumber data</td><td>Banyak data source sekaligus</td><td>Satu data source</td></tr>
<tr><td>Bisa pakai Expression</td><td>✅</td><td>❌ (hanya PromQL/LogQL)</td></tr>
<tr><td>Disimpan di</td><td>Basis data Grafana</td><td>Berkas rule di data source</td></tr>
<tr><td>Bertahan bila Grafana mati</td><td>❌</td><td>✅</td></tr>
<tr><td>Butuh <code>manageAlerts: true</code></td><td>—</td><td>✅ untuk mengedit dari UI</td></tr>
</tbody>
</table>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Cara memilih</div>
    <p>Alert yang <strong>membangunkan orang</strong> sebaiknya dievaluasi Prometheus (data source-managed): ia tetap bekerja walaupun Grafana sedang mati atau sedang di-upgrade. Grafana-managed dipakai untuk alert yang perlu menggabungkan beberapa sumber data, memakai Expression, atau berbasis SQL — hal yang tidak mungkin dilakukan Prometheus.</p>
</div>

<h3>Anatomi Grafana-managed Alert Rule</h3>
<pre data-lang="yaml" data-file="provisioning/alerting/rules.yml">apiVersion: 1
groups:
  - orgId: 1
    name: bayarcepat-slo
    folder: Peringatan Produksi
    interval: 1m                     # seberapa sering dievaluasi
    rules:
      - uid: err-rate-ledger
        title: Error rate ledger melewati SLO
        condition: C                  # refId mana yang menentukan
        for: 5m                       # harus benar selama ini dulu
        noDataState: NoData
        execErrState: Alerting
        annotations:
          summary: 'Error rate ledger {{ humanizePercentage $values.C.Value }}'
          description: >
            Error 5xx pada layanan ledger melewati 1% selama 5 menit.
            Periksa pool koneksi database lebih dulu.
          runbook_url: https://wiki.internal/runbook/ledger-error-rate
          dashboardUId: bayarcepat-ikhtisar
          panelId: '3'
        labels:
          severity: critical
          tim: pembayaran
          layanan: ledger
        data:
          - refId: A
            relativeTimeRange: { from: 600, to: 0 }
            datasourceUid: prom-utama
            model:
              expr: sum(rate(http_requests_total{layanan="ledger",status=~"5.."}[5m]))
              instant: true
              refId: A
          - refId: B
            relativeTimeRange: { from: 600, to: 0 }
            datasourceUid: prom-utama
            model:
              expr: sum(rate(http_requests_total{layanan="ledger"}[5m]))
              instant: true
              refId: B
          - refId: C
            datasourceUid: __expr__
            model:
              type: math
              expression: '$A / $B > 0.01'
              refId: C</pre>

<h3>State Machine — Bagian yang Paling Sering Disalahpahami</h3>
<pre data-lang="text" data-file="siklus state">        kondisi benar               bertahan selama "for"
Normal ──────────────────> Pending ───────────────────> Alerting
   ▲                          │                            │
   │      kondisi salah       │                            │
   └──────────────────────────┴────────────────────────────┘
                                          │
   kueri gagal ──> Error   ─┐              │ setelah resolve
   data hilang ──> NoData  ─┴──> mengikuti execErrState / noDataState
                                          ▼
                                     Normal (Resolved)</pre>

<table>
<thead><tr><th>State</th><th>Arti</th><th>Notifikasi terkirim?</th></tr></thead>
<tbody>
<tr><td><strong>Normal</strong></td><td>Kondisi tidak terpenuhi</td><td>Tidak</td></tr>
<tr><td><strong>Pending</strong></td><td>Kondisi benar, tapi belum selama <code>for</code></td><td>Tidak</td></tr>
<tr><td><strong>Alerting</strong></td><td>Benar dan sudah melewati <code>for</code></td><td>Ya</td></tr>
<tr><td><strong>NoData</strong></td><td>Kueri tidak menghasilkan series</td><td>Sesuai <code>noDataState</code></td></tr>
<tr><td><strong>Error</strong></td><td>Kueri gagal / data source mati</td><td>Sesuai <code>execErrState</code></td></tr>
</tbody>
</table>

<div class="callout callout-danger">
    <div class="callout-title">⛔ NoData adalah keputusan, bukan detail teknis</div>
    <p>Pilihan <code>noDataState</code> menentukan apakah hilangnya monitoring dianggap masalah:</p>
    <ul>
        <li><code>NoData</code> — memicu alert khusus NoData. <strong>Pilihan yang benar untuk alert kritis</strong>: metrik yang hilang biasanya berarti aplikasi mati.</li>
        <li><code>Alerting</code> — perlakukan sama seperti kondisi terpenuhi. Agresif, cocok untuk heartbeat.</li>
        <li><code>OK</code> — anggap sehat. <strong>Berbahaya</strong>: aplikasi mati total menjadi "tidak ada masalah" karena tidak ada lagi yang mengekspos metrik.</li>
    </ul>
    <p>Untuk metrik yang jarang muncul (misalnya error counter yang biasanya nol), pola yang benar bukan <code>noDataState: OK</code>, melainkan membuat kueri selalu menghasilkan angka — misalnya dengan <code>or vector(0)</code> di PromQL.</p>
</div>

<h3>Multi-dimensional Alert</h3>
<p>Satu rule bisa menghasilkan <strong>banyak instance alert</strong>, satu per kombinasi label. Ini kekuatan besar sekaligus sumber banjir notifikasi.</p>
<pre data-lang="promql" data-file="satu rule, banyak instance">sum by (layanan, instance) (
  rate(http_requests_total{status=~"5.."}[5m])
) > 1

# Bila 8 layanan × 5 instance melewati batas:
# → 40 instance alert dari SATU rule
# → tanpa grouping yang benar, 40 pesan di Slack</pre>
<p>Solusinya bukan mengurangi label pada rule, melainkan mengatur <strong>grouping</strong> di notification policy (bab berikutnya membahasnya bersama contact point).</p>

<h3>Contact Point dan Notification Policy</h3>
<pre data-lang="yaml" data-file="provisioning/alerting/notifikasi.yml">apiVersion: 1

contactPoints:
  - orgId: 1
    name: slack-pembayaran
    receivers:
      - uid: cp-slack-bayar
        type: slack
        settings:
          url: $__env{SLACK_WEBHOOK_PEMBAYARAN}
          title: '{{ template "slack.title" . }}'
          text: '{{ template "slack.text" . }}'
  - orgId: 1
    name: pagerduty-oncall
    receivers:
      - uid: cp-pd
        type: pagerduty
        settings:
          integrationKey: $__env{PAGERDUTY_KEY}
          severity: critical

policies:
  - orgId: 1
    receiver: slack-pembayaran      # default
    group_by: ['alertname', 'layanan']
    group_wait: 30s                 # tunggu, mungkin ada yang menyusul
    group_interval: 5m              # jeda antar update grup yang sama
    repeat_interval: 4h             # ulangi bila masih menyala
    routes:
      - receiver: pagerduty-oncall
        object_matchers:
          - ['severity', '=', 'critical']
        continue: false             # berhenti di sini, jangan lanjut
        mute_time_intervals: []
      - receiver: slack-pembayaran
        object_matchers:
          - ['tim', '=', 'pembayaran']
        group_by: ['alertname', 'layanan', 'instance']

muteTimeIntervals:
  - orgId: 1
    name: luar-jam-kerja-non-kritis
    time_intervals:
      - times:
          - start_time: '18:00'
            end_time: '08:00'
        weekdays: ['monday:friday']
        location: 'Asia/Jakarta'</pre>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ group_by menentukan banyaknya pesan</div>
<pre data-lang="text">group_by: ['alertname']
  → 40 instance menjadi 1 pesan berisi 40 baris  ✅ enak dibaca

group_by: ['alertname', 'instance']
  → 40 pesan terpisah                            ❌ banjir

group_by: ['...']
  → grup per setiap kombinasi label unik          ❌ paling buruk</pre>
    <p>Mulailah dari grouping yang kasar. Perhalus hanya bila memang ada yang perlu ditangani terpisah.</p>
</div>

<h3>Templating Notifikasi</h3>
<pre data-lang="text" data-file="template pesan">{{ define "slack.title" }}
[{{ .Status | toUpper }}{{ if eq .Status "firing" }}:{{ .Alerts.Firing | len }}{{ end }}] {{ .CommonLabels.alertname }}
{{ end }}

{{ define "slack.text" }}
{{ range .Alerts -}}
*Layanan:* {{ .Labels.layanan }}  ·  *Severity:* {{ .Labels.severity }}
*Nilai:* {{ .ValueString }}
*Sejak:* {{ .StartsAt.Format "15:04:05 MST" }}
{{ if .Annotations.summary }}*Ringkasan:* {{ .Annotations.summary }}{{ end }}
{{ if .Annotations.runbook_url }}*Runbook:* {{ .Annotations.runbook_url }}{{ end }}
{{ if .DashboardURL }}*Dashboard:* {{ .DashboardURL }}{{ end }}
{{ if .SilenceURL }}*Bisukan:* {{ .SilenceURL }}{{ end }}
---
{{ end }}
{{ end }}</pre>
<p>Fungsi yang berguna di dalam template: <code>humanize</code>, <code>humanizePercentage</code>, <code>humanizeDuration</code>, <code>toUpper</code>, dan <code>reReplaceAll</code>.</p>

<h3>Silence, Mute Timing, dan Pause</h3>
<table>
<thead><tr><th>Mekanisme</th><th>Efek</th><th>Kapan dipakai</th></tr></thead>
<tbody>
<tr><td><strong>Silence</strong></td><td>Rule tetap dievaluasi, notifikasi ditahan</td><td>Maintenance terjadwal, insiden yang sudah diketahui</td></tr>
<tr><td><strong>Mute timing</strong></td><td>Notifikasi ditahan pada jadwal berulang</td><td>Alert non-kritis di luar jam kerja</td></tr>
<tr><td><strong>Pause rule</strong></td><td>Rule berhenti dievaluasi sama sekali</td><td>Rule yang sedang diperbaiki</td></tr>
</tbody>
</table>
<p>Silence selalu punya batas waktu — dan itu bagus. Alert yang dibisukan "selamanya" adalah alert yang seharusnya dihapus atau diperbaiki.</p>`,
    lab: {
        intro: `
<h3>Praktik: Membuat Alert Multi-dimensional dan Mengujinya</h3>
<p>Buat rule berbasis Expression, lihat state-nya berpindah, lalu uji notifikasinya.</p>`,
        files: [{
            name: 'alert-slo.yml', lang: 'yaml', code: `apiVersion: 1
groups:
  - orgId: 1
    name: slo-layanan
    folder: Peringatan Produksi
    interval: 1m
    rules:
      - uid: slo-latency-p95
        title: Latency p95 melewati SLO
        condition: D
        for: 10m
        noDataState: NoData
        execErrState: Alerting
        annotations:
          summary: 'p95 {{ .Labels.layanan }} = {{ humanizeDuration $values.C.Value }}'
          runbook_url: https://wiki.internal/runbook/latency
        labels:
          severity: warning
          tim: pembayaran
        data:
          - refId: A
            relativeTimeRange: { from: 900, to: 0 }
            datasourceUid: prom-utama
            model:
              refId: A
              instant: true
              expr: |
                histogram_quantile(0.95,
                  sum by (layanan, le) (
                    rate(http_request_duration_seconds_bucket[5m])
                  )
                )
          - refId: C
            datasourceUid: __expr__
            model:
              refId: C
              type: reduce
              reducer: last
              expression: A
          - refId: D
            datasourceUid: __expr__
            model:
              refId: D
              type: threshold
              expression: C
              conditions:
                - evaluator: { type: gt, params: [0.5] }` }],
        steps: [
            { note: 'Muat rule lewat provisioning', cmd: 'grafana alert reload' },
            { note: 'Lihat daftar rule dan state-nya sekarang', cmd: 'grafana alert list' },
            { note: 'Uji satu rule tanpa menunggu jadwal evaluasi', cmd: 'grafana alert test slo-latency-p95' },
            { note: 'Lihat instance alert yang dihasilkan (multi-dimensional)', cmd: 'grafana alert instances slo-latency-p95' },
            { note: 'Kirim notifikasi percobaan ke contact point', cmd: 'grafana alert notify slack-pembayaran' }
        ],
        snippets: ['grafana alert list', 'grafana alert test slo-latency-p95', 'grafana alert instances slo-latency-p95', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN memakai <code>noDataState: OK</code> pada alert kritis',
            body: `<p>Ini kegagalan monitoring paling berbahaya yang bisa Anda konfigurasi sendiri. Bila aplikasi mati total, ia berhenti mengekspos metrik, kueri tidak menghasilkan series, dan alert Anda dengan tenang melaporkan "semuanya baik".</p>
<p>Pola yang benar untuk metrik yang wajar bernilai nol:</p>
<pre data-lang="promql">// alih-alih mematikan NoData, buat kueri selalu menghasilkan angka
sum(rate(http_requests_total{status=~"5.."}[5m])) or vector(0)</pre>
<p>Dan tambahkan alert terpisah untuk hilangnya monitoring itu sendiri: <code>absent(up{job="ledger"})</code>.</p>`
        },
        {
            kind: 'salah', title: 'Menyetel <code>for</code> terlalu pendek atau nol',
            body: `<p><code>for: 0s</code> berarti satu titik data anomali langsung membangunkan orang. Satu scrape yang gagal, satu spike GC, satu deploy rolling — semuanya menjadi pager.</p>
<table>
<thead><tr><th>Jenis alert</th><th><code>for</code> yang wajar</th></tr></thead>
<tbody>
<tr><td>Layanan mati total</td><td>1–2 menit</td></tr>
<tr><td>Error rate melewati SLO</td><td>5–10 menit</td></tr>
<tr><td>Latency tinggi</td><td>10–15 menit</td></tr>
<tr><td>Disk akan penuh (prediksi)</td><td>30–60 menit</td></tr>
</tbody>
</table>
<p>Rumus praktis: <code>for</code> harus lebih panjang dari durasi gangguan yang bisa pulih sendiri, dan lebih pendek dari batas waktu SLO Anda.</p>`
        },
        {
            kind: 'best', title: 'Setiap alert wajib punya runbook dan pemilik',
            body: `<p>Alert tanpa runbook memaksa orang yang di-page pukul 03:00 untuk menebak. Alert tanpa pemilik akan diabaikan bersama-sama.</p>
<pre data-lang="yaml">annotations:
  summary: 'Error rate {{ .Labels.layanan }} = {{ humanizePercentage $values.C.Value }}'
  description: 'Melewati 1% selama 5 menit. Periksa pool koneksi lebih dulu.'
  runbook_url: https://wiki.internal/runbook/ledger-error-rate
  dashboardUId: bayarcepat-ikhtisar
  panelId: '3'
labels:
  severity: critical
  tim: pembayaran            # menentukan rute notifikasi</pre>
<p>Isi runbook minimal: apa arti alert ini, tiga hal pertama yang harus diperiksa, cara mitigasi cepat, dan kapan harus melakukan eskalasi.</p>`
        },
        {
            kind: 'kasus', title: 'Empat puluh pesan Slack dari satu masalah tunggal',
            body: `<p>Sebuah database mengalami gangguan. Rule <code>error rate</code> dengan <code>group by (layanan, instance)</code> menghasilkan 40 instance alert, dan notification policy memakai <code>group_by: ['alertname', 'instance']</code>.</p>
<p>Hasilnya 40 pesan Slack dalam 30 detik. Tim mematikan notifikasi channel itu, dan dua jam kemudian melewatkan alert berbeda yang jauh lebih penting.</p>
<p>Perbaikan: <code>group_by: ['alertname', 'layanan']</code> menghasilkan satu pesan berisi ringkasan semua instance yang terdampak — plus tambahkan alert tingkat lebih tinggi pada database itu sendiri, agar penyebab akarnya yang berbunyi, bukan seluruh gejalanya.</p>`
        }
    ],
    quiz: [
        {
            q: 'Alert dengan <code>noDataState: OK</code> tidak berbunyi ketika aplikasi mati total. Kenapa?',
            opts: [
                'Karena <code>for</code> terlalu panjang',
                'Aplikasi mati berarti tidak ada series, dan NoData diperlakukan sebagai sehat',
                'Karena contact point gagal',
                'Karena Grafana-managed alert tidak mendeteksi kematian'
            ],
            a: 1,
            exp: 'Tanpa metrik, kueri mengembalikan hasil kosong. Dengan <code>noDataState: OK</code> keadaan itu dianggap normal — justru pada saat gangguan paling parah. Gunakan <code>NoData</code> dan tambahkan alert <code>absent()</code>.'
        },
        {
            q: 'Sebuah alert rule menghasilkan 40 instance, dan Slack menerima 40 pesan. Perbaikan yang benar?',
            opts: [
                'Hapus label instance dari rule',
                'Atur <code>group_by</code> di notification policy menjadi lebih kasar',
                'Naikkan <code>repeat_interval</code>',
                'Aktifkan silence permanen'
            ],
            a: 1,
            exp: 'Multi-dimensional alert memang seharusnya menghasilkan banyak instance — informasinya berguna. Yang perlu diatur adalah grouping pada notification policy agar instance terkait digabung menjadi satu pesan.'
        },
        {
            q: 'Alert yang harus tetap berfungsi walaupun Grafana sedang di-upgrade sebaiknya…',
            opts: [
                'Grafana-managed dengan Expression',
                'Data source-managed, dievaluasi Prometheus',
                'Grafana-managed dengan <code>for: 0s</code>',
                'Dibuat dua kali di kedua tempat'
            ],
            a: 1,
            exp: 'Data source-managed rule dievaluasi oleh Prometheus/Mimir sendiri dan tidak bergantung pada ketersediaan Grafana. Alert paging kritis sebaiknya tinggal di sana.'
        }
    ]
},

/* ---------------------------------------------------------------- 12 ---- */
{
    id: 12,
    cat: '5 · Alerting',
    title: 'Korelasi: Loki, Tempo, Exemplar, dan Explore',
    level: 'Lanjut', dur: '22 mnt',
    tags: ['loki', 'logql', 'tempo', 'tracing', 'exemplar', 'correlation', 'explore'],
    desc: 'Menghubungkan metrik, log, dan trace sehingga investigasi berpindah dari "grafik naik" ke "baris kode yang salah" dalam beberapa klik.',
    theory: `
<h2>Nilai Sebenarnya Grafana Ada di Sini</h2>
<p>Dashboard metrik memberi tahu <em>bahwa</em> ada masalah. Log memberi tahu <em>apa</em> yang terjadi. Trace memberi tahu <em>di mana</em> waktunya habis. Grafana adalah satu-satunya tempat ketiganya bisa dijelajahi dengan time range yang sama.</p>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Alur investigasi yang ideal</div>
    <ol>
        <li>Alert berbunyi: p99 checkout melewati 3 detik.</li>
        <li>Buka dashboard, lihat lonjakan mulai 14:32.</li>
        <li>Anotasi menunjukkan deploy pada 14:30. Tersangka pertama.</li>
        <li>Klik satu titik pada grafik → <strong>exemplar</strong> → trace request yang lambat.</li>
        <li>Trace menunjukkan 2,8 detik dihabiskan di satu kueri database.</li>
        <li>Dari span itu, klik ke log Loki yang punya <code>trace_id</code> sama.</li>
        <li>Log menunjukkan kueri tanpa indeks pada kolom baru dari deploy tadi.</li>
    </ol>
    <p>Tujuh langkah, tanpa SSH ke satu server pun. Inilah yang perlu dikonfigurasi di bab ini.</p>
</div>

<h3>LogQL — Cukup untuk Dipakai Sehari-hari</h3>
<pre data-lang="text" data-file="logql">// 1. stream selector — WAJIB, dan wajib selektif
{layanan="ledger", env="produksi"}

// 2. filter baris
{layanan="ledger"} |= "error"              // mengandung
{layanan="ledger"} != "healthcheck"        // tidak mengandung
{layanan="ledger"} |~ "timeout|refused"    // regex
{layanan="ledger"} !~ "debug.*"            // regex negatif

// 3. parser — ekstrak field dari baris
{layanan="ledger"} | json                       // log JSON
{layanan="ledger"} | logfmt                     // format key=value
{layanan="ledger"} | pattern "<ip> - - <_> \\"<method> <uri> <_>\\""
{layanan="ledger"} | regexp "durasi=(?P<durasi>[0-9.]+)"

// 4. filter label hasil parsing
{layanan="ledger"} | json | status >= 500 | durasi > 1.5

// 5. format keluaran
{layanan="ledger"} | json | line_format "{{.method}} {{.uri}} -> {{.status}}"

// 6. metrik dari log — inilah yang membuat Loki kuat
sum by (status) (rate({layanan="ledger"} | json [5m]))
sum(count_over_time({layanan="ledger"} |= "error" [5m]))
quantile_over_time(0.95,
  {layanan="ledger"} | json | unwrap durasi [5m]) by (route)</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Kardinalitas di Loki jauh lebih mematikan daripada di Prometheus</div>
    <p>Setiap kombinasi label unik di Loki membuat <strong>stream</strong> terpisah, dan setiap stream punya chunk sendiri. Label seperti <code>trace_id</code>, <code>user_id</code>, atau <code>request_id</code> akan menciptakan jutaan stream dan melumpuhkan Loki.</p>
<pre data-lang="text">❌ {layanan="api", trace_id="abc123", user_id="4821"}
✅ {layanan="api", env="produksi", level="error"}
   lalu cari trace_id di dalam ISI baris: |= "abc123"</pre>
    <p>Filosofi Loki: <strong>index kecil, isi baris di-scan</strong>. Label hanya untuk hal berkardinalitas rendah; semua yang bervariasi tinggi tetap di dalam teks log dan dicari lewat filter.</p>
</div>

<h3>Derived Fields: Dari Log Melompat ke Trace</h3>
<pre data-lang="yaml" data-file="provisioning/datasources/loki.yml">datasources:
  - name: Loki
    uid: loki-utama
    type: loki
    access: proxy
    url: http://loki:3100
    jsonData:
      maxLines: 1000
      derivedFields:
        - name: TraceID
          matcherRegex: 'trace_id=(\\w+)'
          url: '\${__value.raw}'
          datasourceUid: tempo-utama
          urlDisplayLabel: 'Lihat trace'
        - name: OrderID
          matcherRegex: 'order_id=(\\w+)'
          url: 'https://admin.internal/pesanan/\${__value.raw}'</pre>
<p>Hasilnya: setiap baris log yang mengandung <code>trace_id=abc123</code> mendapat tombol "Lihat trace" yang langsung membuka Tempo.</p>

<h3>Exemplar: Dari Metrik Melompat ke Trace</h3>
<p>Exemplar adalah <em>contoh request</em> yang dilekatkan pada sebuah sampel histogram, lengkap dengan <code>trace_id</code>. Ia muncul sebagai titik kecil berlian pada grafik.</p>
<pre data-lang="yaml" data-file="prometheus.yml — aktifkan exemplar">global:
  scrape_interval: 15s

storage:
  exemplars:
    max_exemplars: 100000     # WAJIB, default 0 = fitur mati</pre>
<pre data-lang="yaml" data-file="data source Prometheus">jsonData:
  exemplarTraceIdDestinations:
    - name: trace_id
      datasourceUid: tempo-utama
      urlDisplayLabel: 'Lihat trace'</pre>
<p>Di sisi aplikasi, exemplar harus ikut diekspos — pada client Prometheus modern ini berarti mengaktifkan format <em>OpenMetrics</em> dan menyertakan <code>trace_id</code> saat mencatat observasi histogram.</p>

<h3>Trace to Logs dan Logs to Metrics</h3>
<pre data-lang="yaml" data-file="provisioning/datasources/tempo.yml">datasources:
  - name: Tempo
    uid: tempo-utama
    type: tempo
    access: proxy
    url: http://tempo:3200
    jsonData:
      tracesToLogsV2:
        datasourceUid: loki-utama
        spanStartTimeShift: '-5m'
        spanEndTimeShift: '5m'
        tags: [{ key: 'service.name', value: 'layanan' }]
        filterByTraceID: true
        filterBySpanID: false
      tracesToMetrics:
        datasourceUid: prom-utama
        spanStartTimeShift: '-2m'
        spanEndTimeShift: '2m'
        tags: [{ key: 'service.name', value: 'layanan' }]
        queries:
          - name: 'Request rate layanan ini'
            query: 'sum(rate(http_requests_total{layanan="\$\${__tags.layanan}"}[5m]))'
      serviceMap:
        datasourceUid: prom-utama
      nodeGraph:
        enabled: true</pre>

<div class="callout callout-info">
    <div class="callout-title">💡 spanStartTimeShift bukan detail sepele</div>
    <p>Sebuah span berlangsung 300 ms, tetapi log yang relevan mungkin tercatat beberapa detik sebelum atau sesudahnya. Tanpa pergeseran waktu, pencarian log yang dipicu dari span sering mengembalikan nol hasil dan orang menyimpulkan "korelasinya tidak jalan".</p>
</div>

<h3>Correlations: Menghubungkan Data Source Apa Pun</h3>
<p>Fitur <strong>Correlations</strong> membuat aturan lompatan yang lebih umum daripada derived fields — dari data source apa pun ke data source apa pun, dengan variabel yang diambil dari hasil kueri.</p>
<pre data-lang="text" data-file="contoh correlation">Sumber : Prometheus, field "instance"
Target : Loki
Kueri  : {instance="\${instance}"} |= "error"
Label  : "Log dari instance ini"</pre>

<h3>Explore Split View — Alat Investigasi Utama</h3>
<p>Tekan <strong>Split</strong> di Explore untuk membuka dua panel bersebelahan dengan time range tersinkron: metrik di kiri, log di kanan. Menggeser rentang di satu sisi menggeser keduanya. Dalam praktik, inilah tempat sebagian besar debugging benar-benar terjadi — bukan di dashboard.</p>

<h3>Log Panel di Dashboard</h3>
<pre data-lang="json" data-file="panel log">{
  "type": "logs",
  "title": "Error terbaru — \$layanan",
  "datasource": { "type": "loki", "uid": "loki-utama" },
  "targets": [{
    "refId": "A",
    "expr": "{layanan=~\\"\$layanan\\", env=\\"\$env\\"} | json | level=\\"error\\"",
    "maxLines": 100
  }],
  "options": {
    "showTime": true,
    "wrapLogMessage": true,
    "prettifyLogMessage": true,
    "enableLogDetails": true,
    "dedupStrategy": "exact",
    "sortOrder": "Descending"
  }
}</pre>
<p><code>dedupStrategy</code> sangat berguna: <code>exact</code> melipat baris identik yang berulang, sehingga satu error yang terjadi 5.000 kali tidak menenggelamkan yang lain.</p>`,
    lab: {
        intro: `
<h3>Praktik: Menelusuri Satu Request Lambat dari Grafik ke Log</h3>
<p>Bangun rantai korelasi lengkap dan buktikan lompatannya bekerja.</p>`,
        files: [{
            name: 'korelasi.yml', lang: 'yaml', code: `apiVersion: 1
datasources:
  - name: Prometheus
    uid: prom-utama
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    jsonData:
      httpMethod: POST
      timeInterval: 15s
      exemplarTraceIdDestinations:
        - name: trace_id
          datasourceUid: tempo-utama
          urlDisplayLabel: 'Lihat trace'

  - name: Loki
    uid: loki-utama
    type: loki
    access: proxy
    url: http://loki:3100
    jsonData:
      maxLines: 1000
      derivedFields:
        - name: TraceID
          matcherRegex: 'trace_id=(\\w+)'
          url: '\${__value.raw}'
          datasourceUid: tempo-utama
          urlDisplayLabel: 'Lihat trace'

  - name: Tempo
    uid: tempo-utama
    type: tempo
    access: proxy
    url: http://tempo:3200
    jsonData:
      tracesToLogsV2:
        datasourceUid: loki-utama
        spanStartTimeShift: '-5m'
        spanEndTimeShift: '5m'
        tags: [{ key: 'service.name', value: 'layanan' }]
        filterByTraceID: true
      serviceMap:
        datasourceUid: prom-utama
      nodeGraph:
        enabled: true` }],
        steps: [
            { note: 'Pastikan exemplar benar-benar tersedia di Prometheus', cmd: 'grafana ds query prom-utama http_request_duration_seconds_bucket --exemplars' },
            { note: 'Cari log error pada layanan tertentu', cmd: 'grafana logs query {layanan="ledger"} |= "error"' },
            { note: 'Hitung error rate langsung dari log', cmd: 'grafana logs query sum(rate({layanan="ledger"} |= "error" [5m]))' },
            { note: 'Ambil satu trace berdasarkan ID', cmd: 'grafana trace get 4bf92f3577b34da6' },
            { note: 'Periksa apakah derived field terdeteksi', cmd: 'grafana logs derived {layanan="ledger"}' }
        ],
        snippets: ['grafana logs query {layanan="ledger"} |= "error"', 'grafana trace get 4bf92f3577b34da6', 'grafana logs derived {layanan="ledger"}', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN menjadikan trace_id atau user_id sebagai label Loki',
            body: `<p>Ini membunuh Loki lebih cepat daripada kesalahan lain mana pun. Setiap kombinasi label unik adalah satu stream dengan chunk-nya sendiri; label berkardinalitas tinggi menghasilkan jutaan stream kecil, dan ingester kehabisan memori.</p>
<pre data-lang="text">❌ {layanan="api", trace_id="4bf92f35", user_id="4821"}
✅ {layanan="api", env="produksi", level="error"}
   cari ID di dalam isi baris: | json | trace_id="4bf92f35"</pre>
<p>Ingat perbedaan filosofinya: Prometheus mengindeks nilai, Loki hanya mengindeks label dan men-scan isi. Scan atas isi baris di Loki memang cepat — itu memang cara pemakaian yang dirancang.</p>`
        },
        {
            kind: 'salah', title: 'Mengaktifkan exemplar di Grafana tanpa mengaktifkannya di Prometheus',
            body: `<p>Menambahkan <code>exemplarTraceIdDestinations</code> di data source tidak berpengaruh apa pun bila Prometheus tidak menyimpan exemplar. Nilai default <code>max_exemplars</code> adalah <strong>0</strong>, yang berarti fitur ini mati.</p>
<pre data-lang="yaml" data-file="prometheus.yml">storage:
  exemplars:
    max_exemplars: 100000</pre>
<p>Selain itu, aplikasi harus mengekspos exemplar dalam format OpenMetrics. Bila tiga syarat ini tidak terpenuhi bersamaan, tidak ada titik berlian yang muncul di grafik dan orang menyimpulkan fiturnya "tidak bekerja".</p>`
        },
        {
            kind: 'best', title: 'Sisipkan trace_id ke setiap baris log sejak awal',
            body: `<p>Ini prasyarat untuk seluruh korelasi. Tanpa <code>trace_id</code> di log, tidak ada jembatan antara log dan trace, dan Anda kembali menebak-nebak.</p>
<pre data-lang="javascript" data-file="middleware logging">const { trace } = require('@opentelemetry/api');

app.use((req, res, next) => {
  const span = trace.getActiveSpan();
  const ctx  = span ? span.spanContext() : null;
  req.log = logger.child({
    trace_id: ctx ? ctx.traceId : undefined,
    span_id:  ctx ? ctx.spanId  : undefined,
    route:    req.route ? req.route.path : req.path
  });
  next();
});</pre>
<p>Gunakan log terstruktur (JSON atau logfmt) agar parser Loki bisa mengekstrak field tanpa regex yang rapuh.</p>`
        },
        {
            kind: 'kasus', title: 'Investigasi tiga jam yang seharusnya tiga menit',
            body: `<p>Sebuah insiden latency memakan tiga jam untuk didiagnosis: tim melihat grafik di Grafana, lalu SSH ke server untuk <code>grep</code> log, lalu mencocokkan timestamp secara manual dengan mata, lalu menebak layanan mana yang jadi penyebab.</p>
<p>Setelah korelasi dipasang — trace_id di log, exemplar aktif, derived field, dan trace-to-logs — insiden serupa berikutnya selesai dalam empat menit: klik titik di grafik, buka trace, lihat span database yang lambat, klik ke log span itu, temukan kueri yang salah.</p>
<p>Investasi konfigurasinya kurang dari satu hari kerja.</p>`
        }
    ],
    quiz: [
        {
            q: 'Kenapa <code>trace_id</code> tidak boleh dijadikan label Loki?',
            opts: [
                'Karena Loki tidak mendukung label berupa hash',
                'Karena setiap nilai unik menciptakan stream baru sehingga jumlah stream meledak',
                'Karena hanya boleh ada lima label',
                'Karena trace_id harus disimpan di Tempo'
            ],
            a: 1,
            exp: 'Label Loki mendefinisikan stream, dan tiap stream punya chunk sendiri. Nilai berkardinalitas tinggi menghasilkan jutaan stream kecil. Simpan trace_id di isi baris dan cari dengan filter.'
        },
        {
            q: 'Titik exemplar tidak muncul di grafik meski data source sudah dikonfigurasi. Penyebab paling mungkin?',
            opts: [
                'Panel harus bertipe heatmap',
                '<code>max_exemplars</code> di Prometheus masih 0 (default)',
                'Tempo belum punya data',
                'Perlu instant query'
            ],
            a: 1,
            exp: 'Penyimpanan exemplar di Prometheus mati secara default. Ketiga syarat harus ada: aplikasi mengekspos exemplar, Prometheus menyimpannya, dan Grafana tahu tujuan trace-nya.'
        },
        {
            q: 'Fitur apa yang membuat baris log Loki punya tombol untuk membuka trace di Tempo?',
            opts: ['Correlations', 'Derived fields', 'Data links', 'Value mapping'],
            a: 1,
            exp: 'Derived fields mengekstrak nilai dari baris log dengan regex, lalu menjadikannya tautan ke data source lain — biasanya <code>trace_id</code> menuju Tempo.'
        }
    ]
},

/* ---------------------------------------------------------------- 13 ---- */
{
    id: 13,
    cat: '6 · Operasi',
    title: 'Autentikasi, Organisasi, Tim, dan Izin',
    level: 'Lanjut', dur: '20 mnt',
    tags: ['auth', 'oauth', 'ldap', 'rbac', 'team', 'service account', 'folder'],
    desc: 'Mengatur siapa boleh melihat dan mengubah apa, tanpa membuat akun bersama yang dipakai seluruh tim.',
    theory: `
<h2>Peran Bawaan</h2>
<table>
<thead><tr><th>Peran</th><th>Bisa</th><th>Tidak bisa</th></tr></thead>
<tbody>
<tr><td><strong>Viewer</strong></td><td>Melihat dashboard, memakai Explore bila diizinkan</td><td>Menyimpan apa pun</td></tr>
<tr><td><strong>Editor</strong></td><td>Membuat/mengubah dashboard dan alert rule</td><td>Mengelola pengguna, data source</td></tr>
<tr><td><strong>Admin</strong></td><td>Semua dalam satu organisasi, termasuk data source</td><td>Pengaturan lintas organisasi</td></tr>
<tr><td><strong>Server Admin</strong></td><td>Semua organisasi, semua pengguna</td><td>—</td></tr>
</tbody>
</table>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Editor lebih berkuasa dari yang terlihat</div>
    <p>Editor bisa membuat panel dengan kueri SQL bebas ke data source mana pun yang bisa dilihatnya. Bila salah satu data source memakai kredensial yang bisa membaca tabel sensitif, seorang Editor bisa membacanya — bahkan bila tidak ada dashboard yang menampilkannya.</p>
    <p>Karena itu pemisahan sebenarnya harus dilakukan di <strong>level kredensial data source</strong>, bukan hanya di izin dashboard.</p>
</div>

<h3>Organisasi vs Folder vs Tim</h3>
<table>
<thead><tr><th>Konsep</th><th>Isolasi</th><th>Pakai untuk</th></tr></thead>
<tbody>
<tr><td><strong>Organization</strong></td><td>Total: data source, dashboard, user terpisah</td><td>Multi-tenant sungguhan, misalnya penyedia layanan</td></tr>
<tr><td><strong>Folder</strong></td><td>Izin per folder</td><td>Pemisahan antar tim di dalam satu perusahaan</td></tr>
<tr><td><strong>Team</strong></td><td>Kumpulan pengguna</td><td>Memberi izin sekaligus, bukan per orang</td></tr>
</tbody>
</table>
<div class="callout callout-info">
    <div class="callout-title">💡 Hampir selalu pilih folder + team, bukan organisasi</div>
    <p>Organisasi memisahkan segalanya, termasuk data source — artinya tiap organisasi harus mengonfigurasi Prometheus-nya sendiri, dan dashboard tidak bisa dibagi. Untuk perusahaan dengan banyak tim tetapi satu tumpukan observability, folder dengan izin tim jauh lebih praktis.</p>
</div>

<h3>OAuth: Contoh Google dan Generik</h3>
<pre data-lang="ini" data-file="grafana.ini — OAuth">[auth.google]
enabled            = true
name               = Akun Perusahaan
client_id          = $__env{GOOGLE_CLIENT_ID}
client_secret      = $__env{GOOGLE_CLIENT_SECRET}
scopes             = openid email profile
allowed_domains    = perusahaan.id
allow_sign_up      = true
auto_login         = false

[auth.generic_oauth]
enabled       = true
name          = Keycloak
client_id     = grafana
client_secret = $__env{OIDC_SECRET}
scopes        = openid email profile roles
auth_url      = https://sso.perusahaan.id/realms/utama/protocol/openid-connect/auth
token_url     = https://sso.perusahaan.id/realms/utama/protocol/openid-connect/token
api_url       = https://sso.perusahaan.id/realms/utama/protocol/openid-connect/userinfo
role_attribute_path = contains(realm_access.roles[*], 'grafana-admin') && 'Admin' || contains(realm_access.roles[*], 'grafana-editor') && 'Editor' || 'Viewer'
role_attribute_strict = true
allow_assign_grafana_admin = false

[auth]
disable_login_form   = true     # paksa lewat SSO
oauth_auto_login     = false
login_maximum_inactive_lifetime_duration = 7d
login_maximum_lifetime_duration          = 30d

[auth.anonymous]
enabled = false</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Jangan matikan form login sebelum SSO terbukti bekerja</div>
    <p>Dengan <code>disable_login_form = true</code> dan konfigurasi OAuth yang salah, Anda terkunci dari Grafana sendiri.</p>
    <p>Jalan keluar bila sudah terjadi: akses <code>/login</code> dengan parameter khusus tidak akan menolong — Anda perlu mengubah konfigurasi lewat env var lalu restart, atau mereset password admin lewat CLI:</p>
<pre data-lang="bash">grafana cli admin reset-admin-password rahasiabaru</pre>
    <p>Urutan yang aman: aktifkan OAuth, uji sampai berhasil masuk, <em>baru</em> matikan form login.</p>
</div>

<h3>Izin Folder dan Dashboard</h3>
<pre data-lang="bash" data-file="izin folder lewat API">curl -sS -u admin:rahasia -X POST \\
  http://localhost:3000/api/folders/peringatan-produksi/permissions \\
  -H 'Content-Type: application/json' \\
  -d '{
    "items": [
      { "role": "Viewer",  "permission": 1 },
      { "teamId": 3,       "permission": 2 },
      { "userId": 12,      "permission": 4 }
    ]
  }'

# permission: 1 = View, 2 = Edit, 4 = Admin</pre>
<p>Izin diwariskan dari folder ke dashboard di dalamnya. Menetapkan izin per dashboard mungkin, tetapi cepat menjadi tidak terkelola — atur di tingkat folder.</p>

<h3>Service Account: Pengganti API Key</h3>
<p>API key lama sudah usang. Yang benar sekarang adalah <strong>service account</strong> dengan token — punya peran sendiri, bisa dicabut, dan terlihat di audit.</p>
<pre data-lang="bash" data-file="service account">curl -sS -u admin:rahasia -X POST http://localhost:3000/api/serviceaccounts \\
  -H 'Content-Type: application/json' \\
  -d '{ "name": "ci-anotasi-deploy", "role": "Editor", "isDisabled": false }'

# lalu buat token untuk akun itu
curl -sS -u admin:rahasia -X POST \\
  http://localhost:3000/api/serviceaccounts/5/tokens \\
  -H 'Content-Type: application/json' \\
  -d '{ "name": "token-pipeline", "secondsToLive": 7776000 }'</pre>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Beri peran seminimal mungkin</div>
    <p>Service account untuk mengirim anotasi deploy tidak perlu peran Admin. Peran Editor sudah cukup — dan bila token itu bocor dari log pipeline, kerusakannya jauh lebih terbatas.</p>
    <p>Selalu set <code>secondsToLive</code>. Token tanpa masa berlaku akan hidup selamanya di riwayat CI seseorang.</p>
</div>

<h3>Kesalahan Konfigurasi yang Perlu Diaudit</h3>
<ul>
<li><code>auth.anonymous.enabled = true</code> di instansi yang bisa dijangkau dari internet.</li>
<li><code>users.allow_sign_up = true</code> — siapa pun bisa mendaftar sendiri.</li>
<li>Password admin masih <code>admin</code>.</li>
<li>Satu akun bersama dipakai seluruh tim — audit log menjadi tidak berguna.</li>
<li><code>role_attribute_strict = false</code> dengan <code>allow_assign_grafana_admin = true</code> — klaim OAuth bisa menaikkan hak sendiri.</li>
<li>Data source memakai kredensial superuser basis data.</li>
</ul>

<h3>Untuk Panel yang Disematkan di Aplikasi Lain</h3>
<p>Kebutuhan "tampilkan dashboard di portal pelanggan" tidak boleh diselesaikan dengan menyalakan akses anonim. Pilihan yang benar:</p>
<ul>
<li><strong>Public dashboards</strong> — Grafana menyediakan URL publik khusus per dashboard, hanya-baca, tanpa membuka seluruh instansi.</li>
<li><strong>Reverse proxy dengan auth proxy</strong> — aplikasi Anda yang mengautentikasi, lalu meneruskan identitas lewat header ke Grafana.</li>
<li><strong>Render gambar</strong> lewat image renderer dan sajikan sebagai PNG statis untuk laporan.</li>
</ul>`,
    lab: {
        intro: `
<h3>Praktik: Menyiapkan Tim, Folder, dan Service Account</h3>
<p>Bangun pemisahan izin yang layak produksi tanpa akun bersama.</p>`,
        files: [{
            name: 'setup-izin.sh', lang: 'bash', code: `#!/usr/bin/env bash
set -euo pipefail
G="http://localhost:3000"
A="admin:rahasia"

# 1. buat tim
TIM=$(curl -sS -u "$A" -X POST "$G/api/teams" \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"Tim Pembayaran","email":"pembayaran@perusahaan.id"}' | jq -r .teamId)
echo "team id: $TIM"

# 2. buat folder
FOLDER=$(curl -sS -u "$A" -X POST "$G/api/folders" \\
  -H 'Content-Type: application/json' \\
  -d '{"uid":"tim-pembayaran","title":"Tim Pembayaran"}' | jq -r .uid)
echo "folder uid: $FOLDER"

# 3. beri tim izin Edit pada folder, semua Viewer hanya View
curl -sS -u "$A" -X POST "$G/api/folders/$FOLDER/permissions" \\
  -H 'Content-Type: application/json' \\
  -d "{\\"items\\":[
        {\\"role\\":\\"Viewer\\",\\"permission\\":1},
        {\\"teamId\\":$TIM,\\"permission\\":2}
      ]}" | jq .

# 4. service account untuk pipeline, peran minimal
SA=$(curl -sS -u "$A" -X POST "$G/api/serviceaccounts" \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"ci-anotasi","role":"Editor"}' | jq -r .id)

curl -sS -u "$A" -X POST "$G/api/serviceaccounts/$SA/tokens" \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"token-ci","secondsToLive":7776000}' | jq -r .key` }],
        steps: [
            { note: 'Audit setelan autentikasi yang berisiko', cmd: 'grafana auth audit' },
            { note: 'Buat tim dan folder', cmd: 'grafana team create "Tim Pembayaran"' },
            { note: 'Berikan izin folder ke tim', cmd: 'grafana folder grant tim-pembayaran "Tim Pembayaran" Edit' },
            { note: 'Buat service account beserta tokennya', cmd: 'grafana token create ci-anotasi Editor' },
            { note: 'Daftar seluruh service account dan tokennya', cmd: 'grafana token list' }
        ],
        snippets: ['grafana auth audit', 'grafana token create ci-anotasi Editor', 'grafana token list', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN memakai satu akun bersama untuk seluruh tim',
            body: `<p>Akun <code>monitoring@perusahaan.id</code> yang passwordnya ada di dokumen bersama menghancurkan seluruh nilai audit log: setiap perubahan dashboard, setiap silence alert, setiap penghapusan tercatat sebagai orang yang sama.</p>
<p>Saat sebuah dashboard penting hilang, tidak ada yang bisa ditelusuri. Pakai SSO agar penambahan pengguna tidak terasa merepotkan, dan service account untuk otomasi.</p>`
        },
        {
            kind: 'salah', title: 'Menyalakan akses anonim untuk menyematkan dashboard',
            body: `<p>Kebutuhannya wajar: menampilkan grafik di halaman status atau portal internal. Tetapi <code>auth.anonymous.enabled = true</code> membuka <strong>seluruh</strong> instansi, termasuk Explore — dan lewat Explore, siapa pun bisa menjalankan kueri bebas ke setiap data source, termasuk yang menyimpan data sensitif.</p>
<p>Pakai <strong>public dashboards</strong> yang cakupannya satu dashboard saja, atau render PNG lewat image renderer.</p>`
        },
        {
            kind: 'best', title: 'Pisahkan data source berdasarkan sensitivitas',
            body: `<p>Izin dashboard tidak melindungi data bila Editor bisa menulis kueri sendiri. Pemisahan yang nyata dilakukan di lapisan data source:</p>
<ul>
<li>Buat data source terpisah dengan kredensial yang hanya melihat skema/tabel tertentu.</li>
<li>Batasi siapa yang boleh memakai data source itu lewat izin data source.</li>
<li>Untuk data sangat sensitif, pertimbangkan organisasi terpisah atau instansi Grafana terpisah.</li>
</ul>`
        },
        {
            kind: 'kasus', title: 'Terkunci dari Grafana sendiri selama satu hari kerja',
            body: `<p>Seorang engineer mengaktifkan Keycloak OAuth dan sekaligus menyetel <code>disable_login_form = true</code> dalam satu perubahan. <code>role_attribute_path</code> ternyata salah, sehingga setiap login berakhir dengan "user does not have a valid role".</p>
<p>Form login sudah mati, jadi tidak ada jalan masuk lewat UI. Tim baru bisa masuk kembali setelah menyetel <code>GF_AUTH_DISABLE_LOGIN_FORM=false</code> lewat env var dan me-restart container.</p>
<p>Aturan sederhana: perubahan autentikasi dilakukan satu langkah pada satu waktu, dan matikan form login hanya setelah SSO terbukti berhasil dipakai masuk.</p>`
        }
    ],
    quiz: [
        {
            q: 'Kenapa izin dashboard saja tidak cukup untuk melindungi data sensitif dari Editor?',
            opts: [
                'Karena Editor otomatis menjadi Admin',
                'Karena Editor bisa menulis kueri bebas ke data source yang bisa dilihatnya',
                'Karena izin dashboard tidak berlaku di Explore saja',
                'Karena Grafana mengabaikan izin pada panel'
            ],
            a: 1,
            exp: 'Editor dapat membuat panel dan kueri sendiri. Bila kredensial data source punya akses luas, data sensitif bisa dibaca tanpa perlu dashboard yang menampilkannya. Batasi di kredensial data source.'
        },
        {
            q: 'Mana cara yang benar untuk menampilkan satu dashboard ke publik?',
            opts: [
                'Mengaktifkan <code>auth.anonymous</code>',
                'Memakai fitur public dashboards',
                'Membagikan akun Viewer bersama',
                'Menonaktifkan <code>cookie_secure</code>'
            ],
            a: 1,
            exp: 'Public dashboards memberi URL publik hanya-baca untuk satu dashboard tertentu. Akses anonim membuka seluruh instansi termasuk Explore, yang berarti kueri bebas ke semua data source.'
        },
        {
            q: 'Untuk pipeline CI yang mengirim anotasi deploy, kredensial yang tepat adalah…',
            opts: [
                'Akun admin dengan password di secret CI',
                'Service account bertoken dengan peran Editor dan masa berlaku terbatas',
                'API key lama tanpa kedaluwarsa',
                'Akun bersama tim'
            ],
            a: 1,
            exp: 'Service account memberi identitas terpisah, peran seminimal mungkin, jejak audit yang jelas, serta token yang bisa dibatasi masa berlakunya dan dicabut tanpa mengganggu pengguna lain.'
        }
    ]
},

/* ---------------------------------------------------------------- 14 ---- */
{
    id: 14,
    cat: '6 · Operasi',
    title: 'Performa & Skala: Dashboard Cepat, Grafana Tahan Beban',
    level: 'Lanjut', dur: '22 mnt',
    tags: ['performa', 'caching', 'ha', 'recording rule', 'skala', 'optimasi'],
    desc: 'Mendiagnosis dashboard lambat secara sistematis, lalu menjalankan Grafana secara high-availability tanpa alert ganda.',
    theory: `
<h2>Diagnosis Sebelum Optimasi</h2>
<p>"Grafana lambat" hampir selalu berarti salah satu dari empat hal yang berbeda. Panel Inspect → <strong>Stats</strong> memberi angka yang memisahkannya.</p>
<table>
<thead><tr><th>Gejala di Stats</th><th>Penyebab</th><th>Perbaikan</th></tr></thead>
<tbody>
<tr><td><em>Data source duration</em> tinggi</td><td>Kueri berat di data source</td><td>Recording rule, kurangi kardinalitas</td></tr>
<tr><td><em>Number of fields</em> ratusan</td><td>Terlalu banyak series</td><td>Agregasi, <code>topk</code></td></tr>
<tr><td><em>Number of rows</em> puluhan ribu</td><td>Terlalu banyak titik</td><td>Max data points, min interval</td></tr>
<tr><td>Semua cepat tapi UI tersendat</td><td>Terlalu banyak panel / transformation</td><td>Row tertutup, pecah dashboard</td></tr>
</tbody>
</table>

<h3>Recording Rule: Pindahkan Biaya ke Waktu Tulis</h3>
<p>Kueri yang sama dijalankan berulang oleh puluhan panel dan alert. Hitung sekali di Prometheus, simpan hasilnya, dan panel hanya membaca metrik yang sudah jadi.</p>
<pre data-lang="yaml" data-file="rules/recording.yml">groups:
  - name: slo-recording
    interval: 30s
    rules:
      - record: layanan:latency_p95:5m
        expr: |
          histogram_quantile(0.95,
            sum by (layanan, le) (
              rate(http_request_duration_seconds_bucket[5m])
            )
          )

      - record: layanan:error_rate:5m
        expr: |
          sum by (layanan) (rate(http_requests_total{status=~"5.."}[5m]))
            /
          sum by (layanan) (rate(http_requests_total[5m]))</pre>
<pre data-lang="promql" data-file="panel menjadi sederhana">// sebelum: dihitung ulang tiap refresh, tiap pengguna
histogram_quantile(0.95, sum by (layanan, le) (rate(http_request_duration_seconds_bucket[$__rate_interval])))

// sesudah: satu series yang sudah dihitung
layanan:latency_p95:5m</pre>
<p>Panel yang tadinya memakan 4 detik bisa turun ke bawah 100 ms. Untuk dashboard yang dibuka banyak orang, ini perbaikan terbesar yang tersedia.</p>

<h3>Query Caching</h3>
<pre data-lang="ini" data-file="grafana.ini">[caching]
enabled = true

[caching.memory]
gc_interval    = 1m
max_size_bytes = 26214400        # 25 MB

# untuk instalasi HA, pakai Redis agar cache dibagi antar replika
[caching.redis]
url        = redis://redis:6379
prefix     = grafana-cache
cluster    = false</pre>
<p>Caching per data source diatur di halaman data source (TTL). Ia sangat efektif untuk dashboard TV yang dibuka banyak orang dengan rentang waktu identik, dan tidak berguna untuk Explore di mana setiap kueri berbeda.</p>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Cache membuat data tertinggal</div>
    <p>TTL 60 detik berarti dashboard bisa menampilkan angka satu menit lalu. Untuk ikhtisar itu tidak masalah; untuk panel yang dipakai memutuskan tindakan saat insiden, itu bisa menyesatkan. Set TTL pendek atau nonaktifkan cache pada dashboard insiden.</p>
</div>

<h3>Checklist Optimasi Dashboard</h3>
<ol>
<li><strong>Instant query</strong> untuk semua panel Stat, Gauge, Bar gauge, dan Table ringkasan.</li>
<li><strong>Max data points</strong> 300–500 untuk panel di dashboard kios.</li>
<li><strong>Min interval</strong> minimal sebesar scrape interval.</li>
<li><strong>Agregasi di kueri</strong>: <code>sum by (layanan)</code>, bukan per-instance, kecuali memang perlu.</li>
<li><strong><code>topk</code></strong> untuk membatasi jumlah series yang digambar.</li>
<li><strong>Row tertutup</strong> untuk semua panel detail.</li>
<li><strong>Recording rule</strong> untuk kueri yang muncul di lebih dari satu panel.</li>
<li><strong>Hapus</strong> panel yang tidak pernah dilihat siapa pun.</li>
<li><strong><code>min_refresh_interval</code></strong> ditegakkan di sisi server.</li>
<li><strong>Repeat</strong> dibatasi, tanpa opsi All.</li>
</ol>

<h3>High Availability</h3>
<pre data-lang="text" data-file="arsitektur HA">              ┌─────────────┐
              │ Load        │
              │ Balancer    │
              └──┬───────┬──┘
                 │       │
        ┌────────▼─┐  ┌──▼───────┐
        │ Grafana  │  │ Grafana  │   replika stateless
        │   #1     │  │   #2     │
        └────┬─────┘  └─────┬────┘
             │              │
     ┌───────▼──────────────▼───────┐
     │ PostgreSQL (dashboard, user, │  WAJIB dibagi
     │ alert rule, state alert)     │
     └──────────────────────────────┘
             │              │
     ┌───────▼──────────────▼───────┐
     │ Redis (session, cache)       │  opsional
     └──────────────────────────────┘</pre>

<pre data-lang="ini" data-file="grafana.ini — HA">[database]
type = postgres
host = pg.internal:5432
name = grafana

[unified_alerting]
enabled = true
ha_peers          = grafana-1:9094,grafana-2:9094
ha_listen_address = \${POD_IP}:9094
ha_advertise_address = \${POD_IP}:9094
ha_peer_timeout   = 15s

[remote_cache]
type    = redis
connstr = addr=redis:6379,pool_size=100,db=0</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ HA tanpa ha_peers = notifikasi ganda</div>
    <p>Dua replika Grafana tanpa konfigurasi gosip alerting akan mengevaluasi rule yang sama secara independen dan masing-masing mengirim notifikasi. Setiap alert datang dua kali, dan tim mulai mengabaikannya.</p>
    <p><code>ha_peers</code> membuat replika membentuk klaster Alertmanager: mereka berbagi state, melakukan deduplikasi notifikasi, dan menyinkronkan silence. Tanpa ini, silence yang dibuat di replika #1 tidak dikenali replika #2.</p>
</div>

<h3>Batas Wajar Satu Instansi</h3>
<table>
<thead><tr><th>Dimensi</th><th>Nyaman</th><th>Perlu perhatian</th></tr></thead>
<tbody>
<tr><td>Dashboard</td><td>&lt; 2.000</td><td>&gt; 5.000 (pencarian melambat)</td></tr>
<tr><td>Pengguna aktif bersamaan</td><td>&lt; 200</td><td>&gt; 500 (tambah replika)</td></tr>
<tr><td>Alert rule</td><td>&lt; 1.000</td><td>&gt; 5.000 (evaluasi tertinggal)</td></tr>
<tr><td>Panel per dashboard</td><td>&lt; 20</td><td>&gt; 50 (browser tersendat)</td></tr>
<tr><td>Series per panel</td><td>&lt; 50</td><td>&gt; 200 (tidak terbaca dan berat)</td></tr>
</tbody>
</table>

<h3>Memantau Grafana Itu Sendiri</h3>
<p>Grafana mengekspos metrik Prometheus di <code>/metrics</code>. Metrik yang layak dipantau:</p>
<pre data-lang="promql" data-file="metrik Grafana">// latency HTTP Grafana
histogram_quantile(0.95, sum by (le) (
  rate(grafana_http_request_duration_seconds_bucket[$__rate_interval])))

// kueri data source yang gagal
sum by (datasource) (rate(grafana_datasource_request_total{code!~"2.."}[$__rate_interval]))

// evaluasi alert yang tertinggal dari jadwal — indikator kelebihan beban
grafana_alerting_schedule_delay_seconds

// pengguna aktif
grafana_stat_active_users

// koneksi basis data
grafana_database_conn_in_use</pre>
<div class="callout callout-info">
    <div class="callout-title">💡 <code>grafana_alerting_schedule_delay_seconds</code> adalah alarm dini</div>
    <p>Bila nilainya tumbuh, evaluasi alert Anda tidak lagi mengejar jadwal — artinya alert bisa terlambat berbunyi tanpa ada indikasi lain. Ini metrik pertama yang perlu di-alert pada Grafana produksi.</p>
</div>`,
    lab: {
        intro: `
<h3>Praktik: Mengukur, Memperbaiki, Membuktikan</h3>
<p>Ambil satu dashboard lambat, ukur, terapkan recording rule, lalu ukur lagi.</p>`,
        files: [{
            name: 'optimasi.yml', lang: 'yaml', code: `# rules/recording.yml — dimuat oleh Prometheus
groups:
  - name: dashboard-cepat
    interval: 30s
    rules:
      - record: layanan:latency_p95:5m
        expr: |
          histogram_quantile(0.95,
            sum by (layanan, le) (
              rate(http_request_duration_seconds_bucket[5m])
            )
          )

      - record: layanan:error_rate:5m
        expr: |
          sum by (layanan) (rate(http_requests_total{status=~"5.."}[5m]))
            /
          sum by (layanan) (rate(http_requests_total[5m]))

      - record: layanan:throughput:5m
        expr: sum by (layanan) (rate(http_requests_total[5m]))

---
# grafana.ini — caching + batas refresh
# [caching]
# enabled = true
#
# [dashboards]
# min_refresh_interval = 10s` }],
        steps: [
            { note: 'Ukur biaya panel sebelum optimasi', cmd: 'grafana panel stats 3' },
            { note: 'Hitung berapa series yang dihasilkan kueri', cmd: 'grafana ds query prom-utama histogram_quantile(0.95, sum by (layanan,le) (rate(http_request_duration_seconds_bucket[5m])))' },
            { note: 'Muat recording rule di Prometheus lalu pakai hasilnya', cmd: 'grafana ds query prom-utama layanan:latency_p95:5m' },
            { note: 'Ukur ulang setelah optimasi', cmd: 'grafana panel stats 3 --after' },
            { note: 'Periksa apakah evaluasi alert tertinggal', cmd: 'grafana health alerting' }
        ],
        snippets: ['grafana panel stats 3', 'grafana health alerting', 'grafana health db', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN menjalankan beberapa replika Grafana tanpa <code>ha_peers</code>',
            body: `<p>Setiap replika akan mengevaluasi seluruh alert rule dan mengirim notifikasinya sendiri. Dua replika berarti dua pesan untuk setiap alert; tiga replika berarti tiga.</p>
<p>Lebih buruk lagi: silence yang dibuat lewat replika #1 tidak diketahui replika #2, sehingga alert yang "sudah dibisukan" tetap berbunyi. Konfigurasikan <code>ha_peers</code> agar replika membentuk klaster Alertmanager dan melakukan deduplikasi.</p>`
        },
        {
            kind: 'salah', title: 'Menambah CPU Grafana untuk memperbaiki dashboard lambat',
            body: `<p>Grafana hampir tidak pernah menjadi penyebab kelambatan. Ia meneruskan kueri dan mengirim JSON; pekerjaan berat ada di data source (mengeksekusi kueri) dan di browser (merender).</p>
<p>Buka Panel Inspect → Stats lebih dulu. Bila <em>data source duration</em> yang besar, perbaikannya ada di kueri atau di Prometheus. Bila jumlah baris dan field yang besar, perbaikannya ada di agregasi dan max data points.</p>`
        },
        {
            kind: 'best', title: 'Pindahkan kueri yang berulang ke recording rule',
            body: `<p>Bila sebuah ekspresi muncul di lebih dari satu panel atau dipakai alert, ia layak menjadi recording rule.</p>
<ul>
<li>Dihitung sekali per interval, bukan sekali per panel per pengguna per refresh.</li>
<li>Panel dan alert memakai angka yang <strong>persis sama</strong> — menghilangkan kelas bug "dashboard bilang X, alert bilang Y".</li>
<li>Ikuti konvensi penamaan <code>level:metrik:operasi</code>, misalnya <code>layanan:error_rate:5m</code>.</li>
</ul>`
        },
        {
            kind: 'kasus', title: 'Dashboard yang melumpuhkan Prometheus setiap pagi',
            body: `<p>Setiap hari sekitar pukul 09:00 Prometheus melonjak dan mulai mengembalikan timeout. Ternyata 30 anggota tim membuka dashboard yang sama saat mulai bekerja. Dashboard itu punya 18 panel, masing-masing menjalankan <code>histogram_quantile</code> atas 200 series, dengan refresh 10 detik.</p>
<p>Beban puncaknya: 30 pengguna × 18 panel = 540 kueri berat setiap 10 detik. Setelah tiga perbaikan — recording rule untuk enam kueri terberat, detail dipindah ke row tertutup, dan caching 30 detik diaktifkan — beban puncak turun sekitar 90% dan dashboard memuat di bawah satu detik.</p>
<p>Tidak ada satu pun perbaikan yang menambah perangkat keras.</p>`
        }
    ],
    quiz: [
        {
            q: 'Dua replika Grafana mengirim setiap notifikasi alert dua kali. Konfigurasi apa yang kurang?',
            opts: [
                'Basis data bersama',
                '<code>ha_peers</code> pada bagian unified_alerting',
                'Redis remote cache',
                'Load balancer sticky session'
            ],
            a: 1,
            exp: 'Tanpa gosip antar peer, tiap replika bertindak sebagai Alertmanager mandiri. <code>ha_peers</code> membentuk klaster sehingga notifikasi dideduplikasi dan silence tersinkron.'
        },
        {
            q: 'Manfaat recording rule yang <strong>bukan</strong> soal kecepatan adalah…',
            opts: [
                'Menghemat penyimpanan Prometheus',
                'Panel dan alert memakai angka yang persis sama',
                'Mengurangi jumlah data source',
                'Menghilangkan kebutuhan caching'
            ],
            a: 1,
            exp: 'Karena satu series hasil perhitungan dipakai bersama, dashboard dan alert tidak bisa lagi menghitung dengan cara yang sedikit berbeda — sumber ketidakcocokan yang sering membingungkan saat insiden.'
        },
        {
            q: 'Metrik Grafana mana yang paling penting di-alert karena menandakan alert bisa terlambat berbunyi?',
            opts: [
                '<code>grafana_stat_active_users</code>',
                '<code>grafana_alerting_schedule_delay_seconds</code>',
                '<code>grafana_database_conn_in_use</code>',
                '<code>grafana_http_request_duration_seconds</code>'
            ],
            a: 1,
            exp: 'Nilai yang tumbuh berarti evaluator alert tidak mengejar jadwalnya. Akibatnya alert bisa berbunyi terlambat tanpa gejala lain yang terlihat — kegagalan monitoring yang senyap.'
        }
    ]
},

/* ---------------------------------------------------------------- 15 ---- */
{
    id: 15,
    cat: '6 · Operasi',
    title: 'Dashboard as Code: Provisioning, Backup, dan Upgrade',
    level: 'Lanjut', dur: '22 mnt',
    tags: ['provisioning', 'as code', 'backup', 'upgrade', 'grafonnet', 'terraform', 'ci'],
    desc: 'Memindahkan seluruh konfigurasi Grafana ke Git, sehingga instansi baru bisa dibangun ulang dari nol dan setiap perubahan bisa direview.',
    theory: `
<h2>Kenapa Klik-klik di UI Tidak Cukup</h2>
<p>Dashboard yang dibuat lewat UI tidak punya riwayat yang bisa dibaca, tidak bisa direview sebelum berubah, tidak bisa diuji, dan tidak bisa dibangun ulang bila basis datanya hilang. Untuk dashboard eksperimen itu tidak masalah; untuk dashboard yang dipakai saat insiden, itu risiko.</p>

<h3>Struktur Repositori yang Terbukti</h3>
<pre data-lang="text" data-file="struktur">grafana-config/
├── provisioning/
│   ├── datasources/
│   │   └── sumber.yml
│   ├── dashboards/
│   │   └── pemuat.yml            # aturan pemuatan, bukan dashboard
│   ├── alerting/
│   │   ├── rules.yml
│   │   ├── notifikasi.yml
│   │   └── templates.yml
│   └── plugins/
│       └── app.yml
├── dashboards/
│   ├── platform/
│   │   ├── ikhtisar.json
│   │   └── node.json
│   └── pembayaran/
│       ├── ledger.json
│       └── slo.json
├── grafana.ini
├── docker-compose.yml
└── .github/workflows/validasi.yml</pre>

<h3>Pemuat Dashboard</h3>
<pre data-lang="yaml" data-file="provisioning/dashboards/pemuat.yml">apiVersion: 1

providers:
  - name: platform
    orgId: 1
    folder: Platform
    folderUid: platform
    type: file
    disableDeletion: true         # jangan hapus bila berkas hilang
    allowUiUpdates: false         # UI tidak boleh menimpa Git
    updateIntervalSeconds: 30
    options:
      path: /etc/grafana/dashboards/platform
      foldersFromFilesStructure: false

  - name: pembayaran
    orgId: 1
    folder: Tim Pembayaran
    folderUid: tim-pembayaran
    type: file
    disableDeletion: true
    allowUiUpdates: false
    updateIntervalSeconds: 30
    options:
      path: /etc/grafana/dashboards/pembayaran</pre>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ <code>allowUiUpdates: false</code> adalah keputusan penting</div>
    <p>Dengan <code>false</code>, tombol Save di UI dinonaktifkan untuk dashboard tersebut — satu-satunya jalan mengubahnya adalah lewat Git. Ini melindungi dashboard produksi dari perubahan tak sengaja.</p>
    <p>Sisi lainnya: orang tidak bisa lagi bereksperimen langsung. Pola yang enak dipakai: dashboard produksi dikunci lewat provisioning, dan sediakan satu folder "Eksperimen" yang bebas diedit. Perubahan yang terbukti berguna dipindahkan ke Git lewat pull request.</p>
</div>

<h3>Ekspor yang Benar untuk Git</h3>
<pre data-lang="bash" data-file="ekspor.sh">#!/usr/bin/env bash
set -euo pipefail
G="http://localhost:3000"
TOKEN="$GRAFANA_TOKEN"

for uid in $(curl -sS -H "Authorization: Bearer $TOKEN" \\
              "$G/api/search?type=dash-db&limit=5000" | jq -r '.[].uid'); do

  curl -sS -H "Authorization: Bearer $TOKEN" \\
       "$G/api/dashboards/uid/$uid" \\
  | jq '.dashboard
        | .id = null
        | del(.version)
        | del(.iteration)' \\
  > "dashboards/$uid.json"

  echo "diekspor: $uid"
done</pre>
<p>Tiga pembersihan itu wajib: <code>id</code> harus null agar tidak menimpa dashboard lain, sementara <code>version</code> dan <code>iteration</code> hanya menimbulkan diff berisik di setiap commit tanpa arti apa pun.</p>

<h3>Validasi di CI</h3>
<pre data-lang="yaml" data-file=".github/workflows/validasi.yml">name: Validasi Konfigurasi Grafana
on: [pull_request]

jobs:
  validasi:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: JSON dashboard harus valid
        run: |
          for f in dashboards/**/*.json; do
            jq empty "$f" || { echo "JSON rusak: $f"; exit 1; }
          done

      - name: id harus null dan uid harus ada
        run: |
          for f in dashboards/**/*.json; do
            [ "$(jq -r '.id')"  = "null" ] || { echo "id tidak null: $f"; exit 1; }
            [ "$(jq -r '.uid')" != "null" ] || { echo "uid kosong: $f";   exit 1; }
          done

      - name: UID data source harus yang dikenal
        run: |
          DIKENAL=$(yq -r '.datasources[].uid' provisioning/datasources/sumber.yml | sort -u)
          DIPAKAI=$(jq -r '.. | .datasource? // empty | .uid? // empty' dashboards/**/*.json | sort -u)
          for u in $DIPAKAI; do
            case "$u" in
              '\${DS_*'|'__expr__') continue ;;
            esac
            echo "$DIKENAL" | grep -qx "$u" || { echo "UID tidak dikenal: $u"; exit 1; }
          done

      - name: Uji muat di Grafana sementara
        run: |
          docker compose -f docker-compose.test.yml up -d --wait
          sleep 15
          GAGAL=$(docker compose logs grafana | grep -ci "provisioning error" || true)
          [ "$GAGAL" = "0" ] || { docker compose logs grafana; exit 1; }</pre>

<h3>Alternatif Menulis Dashboard</h3>
<table>
<thead><tr><th>Cara</th><th>Kelebihan</th><th>Kekurangan</th></tr></thead>
<tbody>
<tr><td><strong>JSON langsung</strong></td><td>Tanpa alat tambahan, persis seperti yang dilihat Grafana</td><td>Verbose, sulit menghindari duplikasi</td></tr>
<tr><td><strong>Grafonnet (Jsonnet)</strong></td><td>Fungsi, loop, komponen yang dapat dipakai ulang</td><td>Perlu belajar Jsonnet</td></tr>
<tr><td><strong>Terraform provider</strong></td><td>Satu alat dengan infrastruktur lain, state terkelola</td><td>Diff JSON besar sulit dibaca</td></tr>
<tr><td><strong>Grafana Foundation SDK</strong></td><td>Type-safe di Go/TypeScript/Python</td><td>Relatif baru</td></tr>
<tr><td><strong>Git Sync (Grafana 12)</strong></td><td>Sinkronisasi dua arah dengan repositori</td><td>Fitur baru, perlu penyiapan</td></tr>
</tbody>
</table>

<pre data-lang="text" data-file="contoh Grafonnet">local g = import 'g.libsonnet';

local panelLatency(layanan) =
  g.panel.timeSeries.new(layanan + ' — latency p95')
  + g.panel.timeSeries.queryOptions.withTargets([
      g.query.prometheus.new('prom-utama',
        'layanan:latency_p95:5m{layanan="' + layanan + '"}')
    ])
  + g.panel.timeSeries.standardOptions.withUnit('s');

g.dashboard.new('SLO per Layanan')
+ g.dashboard.withUid('slo-layanan')
+ g.dashboard.withPanels([
    panelLatency(l)
    for l in ['api', 'ledger', 'notifikasi', 'rekonsiliasi']
  ])</pre>
<p>Empat panel identik dari satu definisi. Menambah layanan kelima berarti menambah satu kata di dalam daftar — inilah alasan utama orang beralih ke Grafonnet.</p>

<h3>Backup: Apa yang Benar-benar Perlu Disimpan</h3>
<pre data-lang="bash" data-file="backup.sh">#!/usr/bin/env bash
set -euo pipefail
TGL=$(date +%F)

# 1. basis data — berisi dashboard, user, alert state, anotasi
pg_dump -h pg.internal -U grafana grafana | gzip > "backup/grafana-db-$TGL.sql.gz"

# 2. secret_key — TANPA INI kredensial data source tidak bisa didekripsi
grep -E '^secret_key' /etc/grafana/grafana.ini > "backup/secret-$TGL.txt"

# 3. berkas provisioning (idealnya sudah di Git)
tar czf "backup/provisioning-$TGL.tar.gz" /etc/grafana/provisioning

# 4. plugin yang dipasang manual
tar czf "backup/plugins-$TGL.tar.gz" /var/lib/grafana/plugins

# uji pemulihan sekali sebulan — backup yang belum pernah diuji
# bukan backup, hanya harapan</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Backup tanpa <code>secret_key</code> tidak lengkap</div>
    <p>Memulihkan basis data ke server dengan <code>secret_key</code> berbeda membuat seluruh password data source tidak bisa didekripsi. Anda akan punya semua dashboard, tetapi tidak satu pun yang menampilkan data — dan setiap kredensial harus dimasukkan ulang manual.</p>
</div>

<h3>Prosedur Upgrade</h3>
<ol>
<li>Baca catatan rilis, khususnya bagian <em>breaking changes</em> dan <em>deprecations</em>.</li>
<li>Backup basis data. Migrasi skema Grafana <strong>tidak bisa dibalik</strong>.</li>
<li>Pulihkan salinan basis data ke instansi staging dengan versi baru.</li>
<li>Periksa: dashboard penting, alert rule, integrasi OAuth, dan plugin.</li>
<li>Upgrade produksi. Naik satu versi mayor pada satu waktu, jangan melompat.</li>
<li>Amati <code>/metrics</code> dan log selama beberapa jam setelahnya.</li>
</ol>
<div class="callout callout-info">
    <div class="callout-title">💡 Plugin adalah penyebab kegagalan upgrade paling umum</div>
    <p>Plugin komunitas sering tertinggal beberapa versi di belakang Grafana. Panel yang memakai plugin tak kompatibel akan tampil sebagai kotak kesalahan setelah upgrade.</p>
    <p>Inventarisasi plugin Anda sebelum upgrade, dan periksa kompatibilitasnya. Bila sebuah plugin tidak lagi dirawat, pindahkan panelnya ke tipe panel bawaan sebelum upgrade — bukan setelahnya, saat dashboard sudah rusak.</p>
</div>

<h3>Penutup: Tanda Instalasi Grafana yang Dewasa</h3>
<ul>
<li>Seluruh dashboard produksi ada di Git dan dimuat lewat provisioning.</li>
<li>Instansi baru bisa dibangun dari nol dengan satu perintah.</li>
<li>Setiap deploy tercatat sebagai anotasi otomatis.</li>
<li>Setiap alert punya runbook, pemilik, dan tautan dashboard.</li>
<li>Kueri berat sudah menjadi recording rule.</li>
<li>Grafana memantau dirinya sendiri, termasuk keterlambatan evaluasi alert.</li>
<li>Backup diuji pemulihannya secara berkala, bukan hanya dijalankan.</li>
</ul>`,
    lab: {
        intro: `
<h3>Praktik: Menjadikan Instansi Grafana Sepenuhnya Reproducible</h3>
<p>Ekspor semuanya, masukkan ke Git, lalu bangun ulang dari nol dan bandingkan.</p>`,
        files: [{
            name: 'docker-compose.yml', lang: 'yaml', code: `services:
  grafana:
    image: grafana/grafana:12.0.0
    restart: unless-stopped
    ports: ["3000:3000"]
    environment:
      GF_SECURITY_ADMIN_PASSWORD__FILE: /run/secrets/admin_pass
      GF_DATABASE_TYPE: postgres
      GF_DATABASE_HOST: db:5432
      GF_DATABASE_NAME: grafana
      GF_DATABASE_USER: grafana
      GF_DATABASE_PASSWORD__FILE: /run/secrets/db_pass
      GF_SECURITY_SECRET_KEY__FILE: /run/secrets/secret_key
      GF_USERS_ALLOW_SIGN_UP: "false"
      GF_ANALYTICS_REPORTING_ENABLED: "false"
      GF_UNIFIED_ALERTING_ENABLED: "true"
      GF_ALERTING_ENABLED: "false"
      GF_DASHBOARDS_MIN_REFRESH_INTERVAL: "10s"
    volumes:
      - ./provisioning:/etc/grafana/provisioning:ro
      - ./dashboards:/etc/grafana/dashboards:ro
      - grafana-data:/var/lib/grafana
    secrets: [admin_pass, db_pass, secret_key]
    depends_on:
      db: { condition: service_healthy }

  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: grafana
      POSTGRES_USER: grafana
      POSTGRES_PASSWORD_FILE: /run/secrets/db_pass
    volumes: [pg-data:/var/lib/postgresql/data]
    secrets: [db_pass]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U grafana"]
      interval: 10s
      retries: 5

secrets:
  admin_pass: { file: ./secrets/admin_pass.txt }
  db_pass:    { file: ./secrets/db_pass.txt }
  secret_key: { file: ./secrets/secret_key.txt }

volumes:
  grafana-data:
  pg-data:` }],
        steps: [
            { note: 'Ekspor seluruh dashboard untuk masuk ke Git', cmd: 'grafana dash export --all' },
            { note: 'Validasi semua berkas provisioning sebelum commit', cmd: 'grafana provision validate' },
            { note: 'Muat ulang provisioning tanpa restart', cmd: 'grafana provision reload' },
            { note: 'Bangun ulang instansi dari nol dan bandingkan', cmd: 'grafana rebuild --from-git' },
            { note: 'Uji apakah backup benar-benar bisa dipulihkan', cmd: 'grafana backup verify' }
        ],
        snippets: ['grafana dash export --all', 'grafana provision validate', 'grafana backup verify', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN meng-upgrade Grafana tanpa backup basis data',
            body: `<p>Grafana menjalankan migrasi skema saat start pada versi baru. Migrasi itu <strong>tidak punya jalur turun</strong>: bila terjadi masalah, Anda tidak bisa sekadar menurunkan tag image, karena basis datanya sudah berformat baru dan versi lama menolaknya.</p>
<p>Tanpa backup, satu-satunya jalan pulih adalah membangun ulang seluruh instalasi dari nol — dan bila dashboard tidak ada di Git, semuanya hilang.</p>`
        },
        {
            kind: 'salah', title: 'Menyimpan JSON hasil ekspor mentah ke Git',
            body: `<p>JSON dari API mengandung <code>version</code> dan <code>iteration</code> yang berubah setiap kali disimpan, sehingga setiap commit menampilkan diff yang berisik dan tidak bermakna. Review menjadi tidak mungkin, dan orang berhenti membacanya.</p>
<pre data-lang="bash">jq '.dashboard | .id = null | del(.version) | del(.iteration)' mentah.json > bersih.json</pre>
<p>Tambahkan pembersihan ini ke skrip ekspor, dan tegakkan di CI agar tidak ada yang lupa.</p>`
        },
        {
            kind: 'best', title: 'Kunci dashboard produksi, sediakan ruang eksperimen',
            body: `<p>Provisioning dengan <code>allowUiUpdates: false</code> membuat dashboard produksi hanya bisa berubah lewat pull request — dengan review, riwayat, dan kemampuan rollback.</p>
<p>Agar tidak menghambat orang, sediakan satu folder yang bebas diedit untuk eksperimen. Alur yang sehat: coba di folder eksperimen, buktikan berguna, ekspor, kirim pull request, dan ia menjadi dashboard produksi yang terkelola.</p>`
        },
        {
            kind: 'kasus', title: 'Server hilang, 200 dashboard ikut hilang',
            body: `<p>Sebuah perusahaan menjalankan Grafana selama tiga tahun di satu VM dengan SQLite dan tanpa backup. Dashboard dibuat lewat UI oleh puluhan orang. VM itu terhapus saat pembersihan sumber daya cloud yang salah sasaran.</p>
<p>Yang hilang: 200 dashboard, 140 alert rule, dan seluruh riwayat anotasi. Yang selamat: tidak ada. Pemulihannya memakan enam minggu kerja beberapa orang untuk membangun ulang dari ingatan dan screenshot lama, dan banyak alert tidak pernah kembali persis seperti semula.</p>
<p>Pencegahannya berbiaya kecil: satu skrip ekspor harian ke Git, dan <code>pg_dump</code> terjadwal. Bila konfigurasi ada di Git, kehilangan server hanya berarti kehilangan waktu beberapa menit untuk <code>docker compose up</code>.</p>`
        }
    ],
    quiz: [
        {
            q: 'Kenapa <code>version</code> dan <code>iteration</code> perlu dihapus sebelum menyimpan JSON dashboard ke Git?',
            opts: [
                'Karena Grafana menolak mengimpornya',
                'Karena keduanya berubah setiap simpan dan membuat diff berisik tanpa makna',
                'Karena mengandung kredensial',
                'Karena memperbesar berkas secara signifikan'
            ],
            a: 1,
            exp: 'Keduanya adalah metadata internal per instansi. Menyertakannya membuat setiap commit menampilkan perubahan yang tidak berarti, sehingga review kode menjadi sia-sia.'
        },
        {
            q: 'Apa efek <code>allowUiUpdates: false</code> pada provider dashboard?',
            opts: [
                'Dashboard menjadi tersembunyi bagi Viewer',
                'Tombol Save di UI dinonaktifkan; perubahan hanya lewat berkas di Git',
                'Dashboard tidak dimuat ulang otomatis',
                'Alert rule di dalamnya dinonaktifkan'
            ],
            a: 1,
            exp: 'Dashboard menjadi hanya-baca dari UI. Ini melindungi dashboard produksi dari perubahan tak sengaja dan memastikan Git tetap menjadi sumber kebenaran.'
        },
        {
            q: 'Selain dump basis data, apa yang <strong>wajib</strong> ikut dibackup?',
            opts: [
                'Folder <code>/var/log/grafana</code>',
                '<code>secret_key</code> dari grafana.ini',
                'Cache browser pengguna',
                'Berkas <code>defaults.ini</code>'
            ],
            a: 1,
            exp: '<code>secret_key</code> dipakai mengenkripsi kredensial data source di basis data. Tanpa kunci yang sama, basis data yang dipulihkan tidak bisa mendekripsi satu pun password data source.'
        }
    ]
}

];

/* ==========================================================================
   GRAFANA — MINI PROJECT, UJIAN AKHIR & SIMULATOR
   ========================================================================== */

const COURSE = {
    key: 'grafana',
    pageTitle: 'Belajar Grafana Lengkap | Kelas Interaktif',
    subtitle: '15 bab · panel & variabel · alerting · korelasi log/trace · mini project · ujian sertifikasi',
    prompt: '$',
    termTitle: 'bash — simulator grafana',
    termWelcome: [
        'Simulator Grafana siap. Perintah yang dikenali:',
        '  grafana dash|ds|var|panel|alert|token|provision|units|logs|trace ...',
        '  grafana config [get <kunci>] | grafana health <db|alerting>',
        '  curl -s [-u user:pass] http://localhost:3000/api/... | jq | help',
        'Data yang dipakai adalah dataset contoh yang menyerupai instalasi produksi.',
        ''
    ],

    modules: [].concat(GRAF_MOD_A, GRAF_MOD_B, GRAF_MOD_C),

    /* ================== MINI PROJECT ================== */
    project: {
        title: 'Lapisan Visual “BayarCepat”: Dari Metrik Mentah ke Ruang Operasi',
        subtitle: 'Membangun dashboard, alert, dan korelasi yang benar-benar dipakai saat insiden — seluruhnya sebagai kode.',
        meta: ['⏱ 10–16 jam', '🎯 Level: Lanjut', '🧰 Grafana + Prometheus + Loki + Tempo + PostgreSQL'],
        intro: `
<h2>Situasi</h2>
<p>BayarCepat adalah payment gateway dengan empat layanan: <code>api-gateway</code>, <code>ledger</code>, <code>notifikasi</code>, dan <code>rekonsiliasi</code>. Metrik sudah masuk Prometheus, log sudah masuk Loki, dan trace sudah masuk Tempo. Datanya lengkap — tetapi tidak ada yang bisa membacanya dengan cepat.</p>
<p>Bulan lalu terjadi insiden: layanan <code>ledger</code> kehabisan koneksi database selama 40 menit. Data untuk mendiagnosisnya sebenarnya ada di ketiga sistem itu sejak menit pertama. Tim menghabiskan 35 menit hanya untuk menemukannya.</p>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Yang harus Anda hasilkan</div>
    <p>Sebuah lapisan Grafana yang membuat insiden serupa <strong>terbaca dalam 60 detik dan tertelusuri dalam 5 menit</strong> — lengkap dengan alert yang berbunyi tepat waktu, tidak berbunyi berlebihan, dan seluruhnya bisa dibangun ulang dari Git.</p>
</div>

<h3>Prinsip yang Harus Anda Pegang</h3>
<ul>
    <li><strong>Setiap dashboard menjawab satu pertanyaan.</strong> Bila judulnya tidak bisa dijadikan kalimat tanya, dashboard itu belum jelas tujuannya.</li>
    <li><strong>Tidak ada yang dibuat lewat klik di UI produksi.</strong> Semua masuk provisioning.</li>
    <li><strong>Angka di dashboard dan angka di alert harus berasal dari sumber yang sama.</strong></li>
    <li><strong>Setiap alert punya runbook, pemilik, dan tautan dashboard.</strong></li>
    <li><strong>Investigasi tidak boleh memerlukan SSH.</strong> Metrik → trace → log harus bisa ditempuh dengan klik.</li>
</ul>`,
        steps: [
            {
                title: 'Tahap 1 — Fondasi: Instansi yang Bisa Dibangun Ulang',
                body: `
<p>Jangan mulai dari dashboard. Mulai dari instansi yang bisa dihapus dan dibangun ulang tanpa kehilangan apa pun.</p>
<pre data-lang="yaml" data-file="docker-compose.yml">services:
  grafana:
    image: grafana/grafana:12.0.0
    restart: unless-stopped
    ports: ["3000:3000"]
    environment:
      GF_SECURITY_ADMIN_PASSWORD__FILE: /run/secrets/admin_pass
      GF_SECURITY_SECRET_KEY__FILE:     /run/secrets/secret_key
      GF_DATABASE_TYPE: postgres
      GF_DATABASE_HOST: grafana-db:5432
      GF_DATABASE_NAME: grafana
      GF_DATABASE_USER: grafana
      GF_DATABASE_PASSWORD__FILE: /run/secrets/db_pass
      GF_SERVER_ROOT_URL: http://localhost:3000/
      GF_USERS_ALLOW_SIGN_UP: "false"
      GF_ANALYTICS_REPORTING_ENABLED: "false"
      GF_UNIFIED_ALERTING_ENABLED: "true"
      GF_ALERTING_ENABLED: "false"
      GF_DASHBOARDS_MIN_REFRESH_INTERVAL: "10s"
      GF_INSTALL_PLUGINS: ""
    volumes:
      - ./provisioning:/etc/grafana/provisioning:ro
      - ./dashboards:/etc/grafana/dashboards:ro
      - grafana-data:/var/lib/grafana
    secrets: [admin_pass, db_pass, secret_key]
    depends_on:
      grafana-db: { condition: service_healthy }

  grafana-db:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: grafana
      POSTGRES_USER: grafana
      POSTGRES_PASSWORD_FILE: /run/secrets/db_pass
    volumes: [pg-grafana:/var/lib/postgresql/data]
    secrets: [db_pass]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U grafana"]
      interval: 10s
      retries: 5

secrets:
  admin_pass: { file: ./secrets/admin_pass.txt }
  db_pass:    { file: ./secrets/db_pass.txt }
  secret_key: { file: ./secrets/secret_key.txt }

volumes:
  grafana-data:
  pg-grafana:</pre>
<p><strong>Selesai bila:</strong> <code>docker compose down -v &amp;&amp; docker compose up -d</code> menghasilkan instansi yang identik, dan tidak ada satu pun konfigurasi yang perlu diklik ulang.</p>`
            },
            {
                title: 'Tahap 2 — Data Source dengan UID Tetap',
                body: `
<p>Semua data source diprovisioning dengan UID eksplisit, kredensial read-only, dan setelan korelasi sejak awal.</p>
<pre data-lang="yaml" data-file="provisioning/datasources/sumber.yml">apiVersion: 1

datasources:
  - name: Prometheus
    uid: prom-utama
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: false
    jsonData:
      httpMethod: POST
      timeInterval: "15s"        # WAJIB: dasar $__rate_interval
      queryTimeout: "60s"
      manageAlerts: true
      prometheusType: Prometheus
      cacheLevel: "Low"
      exemplarTraceIdDestinations:
        - name: trace_id
          datasourceUid: tempo-utama
          urlDisplayLabel: 'Lihat trace'

  - name: Loki
    uid: loki-utama
    type: loki
    access: proxy
    url: http://loki:3100
    editable: false
    jsonData:
      maxLines: 1000
      derivedFields:
        - name: TraceID
          matcherRegex: 'trace_id=(\\w+)'
          url: '\${__value.raw}'
          datasourceUid: tempo-utama
          urlDisplayLabel: 'Lihat trace'

  - name: Tempo
    uid: tempo-utama
    type: tempo
    access: proxy
    url: http://tempo:3200
    editable: false
    jsonData:
      tracesToLogsV2:
        datasourceUid: loki-utama
        spanStartTimeShift: '-5m'
        spanEndTimeShift: '5m'
        tags: [{ key: 'service.name', value: 'layanan' }]
        filterByTraceID: true
      tracesToMetrics:
        datasourceUid: prom-utama
        tags: [{ key: 'service.name', value: 'layanan' }]
      serviceMap: { datasourceUid: prom-utama }
      nodeGraph: { enabled: true }

  - name: Postgres Bisnis
    uid: pg-bisnis
    type: postgres
    access: proxy
    url: db:5432
    user: grafana_ro
    database: bayarcepat
    editable: false
    secureJsonData:
      password: $__env{PG_GRAFANA_PASSWORD}
    jsonData:
      sslmode: require
      postgresVersion: 1700
      maxOpenConns: 10
      connMaxLifetime: 14400</pre>
<pre data-lang="sql" data-file="db/grafana-ro.sql">CREATE USER grafana_ro WITH PASSWORD :'sandi';
GRANT CONNECT ON DATABASE bayarcepat TO grafana_ro;
GRANT USAGE  ON SCHEMA public TO grafana_ro;
GRANT SELECT ON merchant, transaksi_ringkas TO grafana_ro;
ALTER ROLE grafana_ro SET statement_timeout = '30s';</pre>
<p><strong>Selesai bila:</strong> keempat data source melaporkan health OK, dan <code>grafana_ro</code> terbukti tidak bisa menjalankan <code>DELETE</code>.</p>`
            },
            {
                title: 'Tahap 3 — Recording Rule Sebelum Dashboard Pertama',
                body: `
<p>Ini urutan yang benar dan sering dibalik orang. Tentukan angka resminya lebih dulu, supaya dashboard dan alert tidak pernah berbeda pendapat.</p>
<pre data-lang="yaml" data-file="prometheus/rules/recording.yml">groups:
  - name: bayarcepat-slo
    interval: 30s
    rules:
      - record: layanan:throughput:5m
        expr: sum by (layanan) (rate(http_requests_total[5m]))

      - record: layanan:error_rate:5m
        expr: |
          (
            sum by (layanan) (rate(http_requests_total{status=~"5.."}[5m]))
              or
            sum by (layanan) (rate(http_requests_total[5m])) * 0
          )
            /
          sum by (layanan) (rate(http_requests_total[5m]))

      - record: layanan:latency_p95:5m
        expr: |
          histogram_quantile(0.95,
            sum by (layanan, le) (rate(http_request_duration_seconds_bucket[5m])))

      - record: layanan:latency_p99:5m
        expr: |
          histogram_quantile(0.99,
            sum by (layanan, le) (rate(http_request_duration_seconds_bucket[5m])))

      - record: ledger:pool_saturasi:ratio
        expr: |
          db_pool_koneksi_aktif / db_pool_koneksi_maks</pre>
<div class="callout callout-info">
    <div class="callout-title">💡 Perhatikan <code>or ... * 0</code> pada error_rate</div>
    <p>Tanpa itu, layanan yang <em>tidak punya error sama sekali</em> menghasilkan series kosong, bukan nol. Panel akan menampilkan "No data" dan alert bisa masuk state NoData padahal keadaannya justru ideal.</p>
</div>
<p><strong>Selesai bila:</strong> kelima recording rule menghasilkan series, dan Anda bisa menjelaskan kenapa <code>error_rate</code> ditulis seperti itu.</p>`
            },
            {
                title: 'Tahap 4 — Dashboard Lapis 1: “Apakah Ada Masalah?”',
                body: `
<p>Satu dashboard yang menjawab pertanyaan itu dalam tiga detik, dari jarak tiga meter. Maksimal enam panel di layar pertama.</p>
<pre data-lang="json" data-file="dashboards/pembayaran/ikhtisar.json">{
  "uid": "bayarcepat-ikhtisar",
  "title": "BayarCepat — Apakah Ada Masalah?",
  "tags": ["produksi", "bayarcepat", "tingkat:ikhtisar"],
  "timezone": "Asia/Jakarta",
  "schemaVersion": 39,
  "refresh": "30s",
  "time": { "from": "now-6h", "to": "now" },
  "templating": { "list": [
    { "name": "env", "type": "custom", "label": "Lingkungan",
      "query": "produksi,staging", "current": { "text": "produksi", "value": "produksi" } },
    { "name": "layanan", "type": "query", "label": "Layanan",
      "datasource": { "type": "prometheus", "uid": "prom-utama" },
      "query": { "query": "label_values(layanan:throughput:5m, layanan)" },
      "refresh": 2, "multi": true, "includeAll": true, "allValue": ".+" }
  ]},
  "annotations": { "list": [
    { "name": "Deploy", "datasource": { "type": "grafana" }, "enable": true,
      "iconColor": "blue",
      "target": { "type": "tags", "tags": ["deploy"], "matchAny": false } }
  ]},
  "panels": [
    { "id": 1, "type": "stat", "title": "Error Rate Global",
      "gridPos": { "h": 4, "w": 6, "x": 0, "y": 0 },
      "datasource": { "type": "prometheus", "uid": "prom-utama" },
      "targets": [{ "refId": "A", "instant": true,
        "expr": "avg(layanan:error_rate:5m{layanan=~\\"$layanan\\"})" }],
      "fieldConfig": { "defaults": {
        "unit": "percentunit", "decimals": 2,
        "thresholds": { "mode": "absolute", "steps": [
          { "color": "green",  "value": null },
          { "color": "orange", "value": 0.005 },
          { "color": "red",    "value": 0.01 } ] } } },
      "options": { "colorMode": "background", "graphMode": "area",
        "reduceOptions": { "calcs": ["lastNotNull"] } } },

    { "id": 2, "type": "stat", "title": "Latency p95 Terburuk",
      "gridPos": { "h": 4, "w": 6, "x": 6, "y": 0 },
      "datasource": { "type": "prometheus", "uid": "prom-utama" },
      "targets": [{ "refId": "A", "instant": true,
        "expr": "max(layanan:latency_p95:5m{layanan=~\\"$layanan\\"})" }],
      "fieldConfig": { "defaults": {
        "unit": "s",
        "thresholds": { "mode": "absolute", "steps": [
          { "color": "green", "value": null },
          { "color": "red",   "value": 0.5 } ] } } },
      "options": { "colorMode": "background",
        "reduceOptions": { "calcs": ["lastNotNull"] } } },

    { "id": 3, "type": "stat", "title": "Throughput Total",
      "gridPos": { "h": 4, "w": 6, "x": 12, "y": 0 },
      "datasource": { "type": "prometheus", "uid": "prom-utama" },
      "targets": [{ "refId": "A", "instant": true,
        "expr": "sum(layanan:throughput:5m{layanan=~\\"$layanan\\"})" }],
      "fieldConfig": { "defaults": { "unit": "reqps", "decimals": 0 } },
      "options": { "graphMode": "area",
        "reduceOptions": { "calcs": ["lastNotNull"] } } },

    { "id": 4, "type": "state-timeline", "title": "Status Layanan",
      "gridPos": { "h": 4, "w": 6, "x": 18, "y": 0 },
      "datasource": { "type": "prometheus", "uid": "prom-utama" },
      "targets": [{ "refId": "A", "expr": "up{layanan=~\\"$layanan\\"}",
        "legendFormat": "{{layanan}}" }],
      "fieldConfig": { "defaults": { "mappings": [
        { "type": "value", "options": {
          "0": { "text": "DOWN", "color": "red",   "index": 0 },
          "1": { "text": "UP",   "color": "green", "index": 1 } } } ] } } }
  ]
}</pre>
<p><strong>Selesai bila:</strong> seseorang yang belum pernah melihat sistem ini bisa menjawab "sehat atau tidak?" dalam tiga detik, tanpa penjelasan dari Anda.</p>`
            },
            {
                title: 'Tahap 5 — Dashboard Lapis 2 & 3: “Di Mana” dan “Kenapa”',
                body: `
<p>Dashboard per layanan mengikuti metode RED di atas dan USE di baris tertutup. Panel yang berulang dibuat dengan <code>repeat</code>, bukan disalin.</p>
<pre data-lang="json" data-file="pola panel yang berulang">{
  "type": "row",
  "title": "Detail — \$layanan",
  "collapsed": true,
  "repeat": "layanan",
  "gridPos": { "h": 1, "w": 24, "x": 0, "y": 12 },
  "panels": [
    { "type": "timeseries", "title": "\$layanan — RED",
      "targets": [
        { "refId": "A", "expr": "layanan:throughput:5m{layanan=\\"\$layanan\\"}",
          "legendFormat": "throughput" },
        { "refId": "B", "expr": "layanan:error_rate:5m{layanan=\\"\$layanan\\"}",
          "legendFormat": "error rate" },
        { "refId": "C", "expr": "layanan:latency_p95:5m{layanan=\\"\$layanan\\"}",
          "legendFormat": "p95" }
      ],
      "fieldConfig": { "defaults": { "unit": "reqps" }, "overrides": [
        { "matcher": { "id": "byName", "options": "error rate" },
          "properties": [
            { "id": "unit", "value": "percentunit" },
            { "id": "custom.axisPlacement", "value": "right" },
            { "id": "color", "value": { "mode": "fixed", "fixedColor": "red" } } ] },
        { "matcher": { "id": "byName", "options": "p95" },
          "properties": [
            { "id": "unit", "value": "s" },
            { "id": "custom.axisPlacement", "value": "right" } ] }
      ]} },

    { "type": "heatmap", "title": "\$layanan — Sebaran Latency",
      "targets": [{ "refId": "A", "format": "heatmap",
        "expr": "sum by (le) (increase(http_request_duration_seconds_bucket{layanan=\\"\$layanan\\"}[$__rate_interval]))" }] },

    { "type": "logs", "title": "\$layanan — Error Terbaru",
      "datasource": { "type": "loki", "uid": "loki-utama" },
      "targets": [{ "refId": "A",
        "expr": "{layanan=\\"\$layanan\\", env=\\"\$env\\"} | json | level=\\"error\\"",
        "maxLines": 100 }],
      "options": { "showTime": true, "dedupStrategy": "exact",
        "sortOrder": "Descending", "enableLogDetails": true } }
  ]
}</pre>
<p>Tambahkan satu dashboard <strong>USE</strong> untuk sumber daya: saturasi pool koneksi <code>ledger</code> (metrik yang menyebabkan insiden bulan lalu), CPU, memori, dan disk. Hubungkan dengan dashboard link yang membawa time range dan variabel.</p>
<p><strong>Selesai bila:</strong> dari dashboard lapis 1, Anda bisa mencapai penyebab akar dalam maksimal tiga klik, dengan konteks waktu yang tidak pernah hilang.</p>`
            },
            {
                title: 'Tahap 6 — Alert Berlapis yang Tidak Membanjiri',
                body: `
<p>Dua tingkat: <em>page</em> (membangunkan orang) dan <em>ticket</em> (ditangani jam kerja). Alert kritis dievaluasi Prometheus agar tetap bekerja walau Grafana mati.</p>
<pre data-lang="yaml" data-file="provisioning/alerting/rules.yml">apiVersion: 1
groups:
  - orgId: 1
    name: bayarcepat-page
    folder: Peringatan Produksi
    interval: 1m
    rules:
      - uid: ledger-pool-jenuh
        title: Pool koneksi ledger hampir habis
        condition: C
        for: 3m
        noDataState: NoData
        execErrState: Alerting
        annotations:
          summary: 'Pool ledger terpakai {{ humanizePercentage $values.B.Value }}'
          description: >
            Saturasi pool koneksi ledger melewati 85% selama 3 menit.
            Ini pola yang sama dengan insiden 40 menit bulan lalu.
          runbook_url: https://wiki.internal/runbook/ledger-pool
          dashboardUId: bayarcepat-ledger
          panelId: '7'
        labels: { severity: critical, tim: pembayaran, layanan: ledger }
        data:
          - refId: A
            relativeTimeRange: { from: 600, to: 0 }
            datasourceUid: prom-utama
            model: { refId: A, instant: true, expr: 'ledger:pool_saturasi:ratio' }
          - refId: B
            datasourceUid: __expr__
            model: { refId: B, type: reduce, reducer: last, expression: A }
          - refId: C
            datasourceUid: __expr__
            model:
              refId: C
              type: threshold
              expression: B
              conditions: [{ evaluator: { type: gt, params: [0.85] } }]

      - uid: layanan-hilang
        title: Monitoring layanan hilang
        condition: B
        for: 2m
        noDataState: Alerting
        execErrState: Alerting
        annotations:
          summary: 'Tidak ada metrik dari {{ .Labels.layanan }}'
          runbook_url: https://wiki.internal/runbook/target-hilang
        labels: { severity: critical, tim: pembayaran }
        data:
          - refId: A
            relativeTimeRange: { from: 300, to: 0 }
            datasourceUid: prom-utama
            model:
              refId: A
              instant: true
              expr: 'absent(up{job="bayarcepat"}) or (sum by (layanan) (up{job="bayarcepat"}) == 0)'
          - refId: B
            datasourceUid: __expr__
            model:
              refId: B
              type: threshold
              expression: A
              conditions: [{ evaluator: { type: gt, params: [0] } }]</pre>
<pre data-lang="yaml" data-file="provisioning/alerting/notifikasi.yml">apiVersion: 1

contactPoints:
  - orgId: 1
    name: slack-pembayaran
    receivers:
      - uid: cp-slack
        type: slack
        settings:
          url: $__env{SLACK_WEBHOOK_PEMBAYARAN}
          title: '{{ template "bayarcepat.title" . }}'
          text:  '{{ template "bayarcepat.text" . }}'
  - orgId: 1
    name: oncall-page
    receivers:
      - uid: cp-pd
        type: pagerduty
        settings:
          integrationKey: $__env{PAGERDUTY_KEY}
          severity: critical

policies:
  - orgId: 1
    receiver: slack-pembayaran
    group_by: ['alertname', 'layanan']     # BUKAN per instance
    group_wait: 30s
    group_interval: 5m
    repeat_interval: 4h
    routes:
      - receiver: oncall-page
        object_matchers: [['severity', '=', 'critical']]
        continue: false
      - receiver: slack-pembayaran
        object_matchers: [['severity', '=', 'warning']]
        mute_time_intervals: ['luar-jam-kerja']

muteTimeIntervals:
  - orgId: 1
    name: luar-jam-kerja
    time_intervals:
      - times: [{ start_time: '18:00', end_time: '08:00' }]
        weekdays: ['monday:friday']
        location: 'Asia/Jakarta'</pre>
<p><strong>Selesai bila:</strong> Anda mereproduksi insiden pool koneksi, tepat satu pesan masuk ke saluran page dalam kurang dari 5 menit, dan tidak ada satu pun notifikasi berlebih.</p>`
            },
            {
                title: 'Tahap 7 — Korelasi Penuh: Metrik → Trace → Log',
                body: `
<p>Bagian yang mengubah investigasi tiga jam menjadi lima menit. Tiga syarat harus terpenuhi bersamaan.</p>
<pre data-lang="yaml" data-file="prometheus.yml — syarat 1">storage:
  exemplars:
    max_exemplars: 100000        # default 0 = exemplar mati total</pre>
<pre data-lang="javascript" data-file="services/ledger/telemetry.js — syarat 2">const client = require('prom-client');
const { trace } = require('@opentelemetry/api');

const durasi = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durasi request HTTP.',
  labelNames: ['layanan', 'route', 'status'],
  buckets: [0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
});

app.use((req, res, next) => {
  const mulai = process.hrtime.bigint();
  const span  = trace.getActiveSpan();
  const ctx   = span ? span.spanContext() : null;

  // log terstruktur WAJIB memuat trace_id agar bisa dikorelasikan
  req.log = logger.child({
    trace_id: ctx ? ctx.traceId : undefined,
    layanan: 'ledger',
    route: req.route ? req.route.path : req.path
  });

  res.on('finish', () => {
    const detik = Number(process.hrtime.bigint() - mulai) / 1e9;
    durasi.observe(
      { layanan: 'ledger', route: req.route ? req.route.path : req.path,
        status: String(res.statusCode) },
      detik,
      ctx ? { trace_id: ctx.traceId } : undefined   // ← exemplar
    );
  });
  next();
});</pre>
<p>Syarat ketiga adalah <code>exemplarTraceIdDestinations</code> dan <code>derivedFields</code> yang sudah Anda pasang di Tahap 2.</p>
<p><strong>Selesai bila:</strong> Anda bisa menempuh rute lengkap tanpa mengetik satu kueri pun — klik titik berlian di grafik latency, masuk ke trace, klik span database yang lambat, dan sampai ke baris log dengan <code>trace_id</code> yang sama.</p>`
            },
            {
                title: 'Tahap 8 — Kunci Semuanya ke Git dan Uji Pemulihan',
                body: `
<p>Tahap terakhir yang paling sering dilewati, dan satu-satunya yang membuktikan pekerjaan Anda bertahan.</p>
<pre data-lang="yaml" data-file="provisioning/dashboards/pemuat.yml">apiVersion: 1
providers:
  - name: bayarcepat
    orgId: 1
    folder: BayarCepat
    folderUid: bayarcepat
    type: file
    disableDeletion: true
    allowUiUpdates: false          # produksi hanya berubah lewat pull request
    updateIntervalSeconds: 30
    options:
      path: /etc/grafana/dashboards/pembayaran

  - name: eksperimen
    orgId: 1
    folder: Eksperimen
    type: file
    allowUiUpdates: true           # ruang bebas untuk mencoba
    options:
      path: /etc/grafana/dashboards/eksperimen</pre>
<pre data-lang="bash" data-file="uji-pemulihan.sh">#!/usr/bin/env bash
set -euo pipefail

echo "== 1. backup =="
pg_dump -h localhost -U grafana grafana | gzip > /tmp/uji-db.sql.gz
cp secrets/secret_key.txt /tmp/uji-secret.txt

echo "== 2. hancurkan total =="
docker compose down -v

echo "== 3. bangun ulang dari Git saja =="
docker compose up -d --wait

echo "== 4. verifikasi =="
sleep 20
JML=$(curl -sS -u admin:"$(cat secrets/admin_pass.txt)" \\
      "http://localhost:3000/api/search?type=dash-db" | jq 'length')
echo "dashboard dipulihkan: $JML"
[ "$JML" -ge 5 ] || { echo "GAGAL: dashboard tidak lengkap"; exit 1; }

DS=$(curl -sS -u admin:"$(cat secrets/admin_pass.txt)" \\
     "http://localhost:3000/api/datasources" | jq 'length')
echo "data source dipulihkan: $DS"
[ "$DS" -eq 4 ] || { echo "GAGAL: data source tidak lengkap"; exit 1; }

echo "== LULUS: instansi sepenuhnya reproducible =="</pre>
<p><strong>Selesai bila:</strong> skrip di atas berjalan hijau dari awal sampai akhir, dan satu-satunya hal yang perlu dipulihkan dari backup adalah anotasi historis serta riwayat state alert.</p>`
            }
        ],
        criteria: [
            'Seluruh konfigurasi — data source, dashboard, alert rule, contact point, notification policy — ada di Git dan dimuat lewat provisioning; tidak ada yang dibuat manual di UI produksi.',
            'Setiap data source punya <strong>UID eksplisit</strong> yang sama di semua lingkungan, dan Prometheus punya <code>timeInterval</code> yang menyamai scrape interval.',
            'Kredensial PostgreSQL yang dipakai Grafana terbukti hanya bisa <code>SELECT</code> pada tabel yang diizinkan, dengan <code>statement_timeout</code> terpasang.',
            'Minimal lima recording rule menjadi sumber tunggal angka; dashboard dan alert tidak pernah menghitung ulang ekspresi yang sama secara terpisah.',
            'Dashboard lapis 1 memuat dalam &lt; 1 detik dan bisa dijawab "sehat atau tidak" dalam 3 detik oleh orang yang belum pernah melihatnya.',
            'Semua panel Stat, Gauge, dan Table ringkasan memakai <strong>instant query</strong>; semua <code>rate()</code> memakai <code>$__rate_interval</code>.',
            'Semua panel detail berada di dalam row yang <em>collapsed</em>, dan panel yang berulang dibuat dengan <code>repeat</code>, bukan disalin.',
            'Variabel berantai bekerja dari lingkungan sampai instance; variabel multi-value dipakai dengan <code>=~</code> dan <em>Custom all value</em> diisi <code>.+</code>.',
            'Setiap deploy tercatat otomatis sebagai anotasi dari pipeline, dan garisnya muncul di seluruh dashboard terkait.',
            'Setiap alert punya <code>runbook_url</code> yang benar-benar berisi, label pemilik tim, serta tautan dashboard dan panel.',
            '<code>noDataState</code> setiap alert kritis adalah <code>NoData</code> atau <code>Alerting</code> — tidak ada satu pun yang <code>OK</code>.',
            'Insiden pool koneksi berhasil direproduksi: tepat <strong>satu</strong> notifikasi page terkirim dalam &lt; 5 menit, tanpa banjir pesan.',
            'Rute korelasi lengkap terbukti: klik exemplar di grafik → trace di Tempo → span lambat → log Loki dengan trace_id yang sama, tanpa mengetik kueri.',
            'Dashboard produksi terkunci dengan <code>allowUiUpdates: false</code>, dan tersedia folder eksperimen yang bebas diedit.',
            'Skrip uji pemulihan berjalan hijau: <code>docker compose down -v</code> lalu bangun ulang menghasilkan instansi yang lengkap dari Git saja.',
            'Grafana memantau dirinya sendiri, termasuk alert atas <code>grafana_alerting_schedule_delay_seconds</code>.'
        ],
        outro: `
<h3>Tantangan Tambahan</h3>
<ul>
    <li><strong>High availability.</strong> Jalankan dua replika Grafana dengan <code>ha_peers</code>, buktikan setiap alert hanya menghasilkan satu notifikasi, dan bahwa silence dari replika #1 dihormati replika #2.</li>
    <li><strong>Dashboard as code sungguhan.</strong> Tulis ulang dashboard per layanan dengan Grafonnet sehingga menambah layanan kelima hanya berarti menambah satu kata di dalam daftar.</li>
    <li><strong>Uji beban dashboard.</strong> Buka dashboard ikhtisar dari 30 sesi sekaligus dengan k6, ukur <code>grafana_http_request_duration_seconds</code> dan beban Prometheus, lalu buktikan dampak caching dengan angka sebelum dan sesudah.</li>
    <li><strong>Chaos korelasi.</strong> Matikan Loki di tengah insiden simulasi dan pastikan dashboard tetap berguna — panel log gagal dengan anggun, bukan membuat seluruh dashboard menolak memuat.</li>
    <li><strong>Laporan otomatis.</strong> Render dashboard ikhtisar menjadi PNG setiap pagi lewat image renderer dan kirim ke saluran tim, sebagai kebiasaan meninjau tren mingguan.</li>
</ul>`
    },

    /* ================== UJIAN AKHIR ================== */
    exam: {
        durationMin: 40,
        passScore: 75,
        subtitle: '25 soal: konsep, panel, variabel, transformasi, alerting, korelasi, dan operasi produksi. Lulus ≥ 75%.',
        questions: [
            {
                q: 'Volume data Grafana terhapus seluruhnya. Apa yang hilang?',
                opts: [
                    'Seluruh riwayat metrik selama masa retensi',
                    'Dashboard, konfigurasi data source, pengguna, dan aturan alert',
                    'Tidak ada, karena semuanya tersimpan di data source',
                    'Hanya preferensi tampilan pengguna'
                ],
                a: 1,
                exp: 'Grafana menyimpan metadata, bukan data time series. Metrik tetap aman di Prometheus. Karena itu backup Grafana dan backup observability data adalah dua hal yang berbeda.'
            },
            {
                q: 'Anda mengedit <code>grafana.ini</code> tetapi nilainya tidak berubah. Penyebab paling mungkin?',
                opts: [
                    'File harus bernama <code>custom.ini</code>',
                    'Ada environment variable yang menimpanya',
                    'Perlu menghapus basis data',
                    'Grafana hanya membaca <code>defaults.ini</code>'
                ],
                a: 1,
                exp: 'Urutan prioritas: defaults.ini → grafana.ini → custom.ini → environment variable → argumen CLI. Env var menang, dan ini penyebab paling umum kebingungan pada instalasi Docker.'
            },
            {
                q: 'Dashboard yang diekspor dari staging menampilkan "Datasource not found" di produksi. Perbaikan yang benar?',
                opts: [
                    'Menyamakan nama data source',
                    'Menetapkan UID eksplisit yang identik di kedua lingkungan',
                    'Menaikkan versi Grafana',
                    'Mengimpor ulang sebagai Server Admin'
                ],
                a: 1,
                exp: 'JSON dashboard mereferensikan UID data source, bukan namanya. UID harus ditetapkan eksplisit lewat provisioning agar sama di seluruh lingkungan.'
            },
            {
                q: 'Grafik <code>rate()</code> berlubang setelah data source dibuat lewat UI. Setelan apa yang paling mungkin terlewat?',
                opts: ['<code>httpMethod: POST</code>', '<code>timeInterval</code>', '<code>queryTimeout</code>', '<code>cacheLevel</code>'],
                a: 1,
                exp: '<code>timeInterval</code> memberi tahu Grafana berapa scrape interval data source, dan menjadi dasar perhitungan <code>$__rate_interval</code>. Default 1 detik menghasilkan rentang yang terlalu pendek.'
            },
            {
                q: 'Berapa lebar total kanvas dashboard Grafana dalam satuan grid?',
                opts: ['12', '16', '24', 'Mengikuti resolusi layar'],
                a: 2,
                exp: 'Selalu 24 unit, apa pun resolusinya. Karena itu <code>w: 12</code> berarti setengah lebar di layar mana pun dan tata letak tetap konsisten.'
            },
            {
                q: 'Panel <code>rate(x[$__interval])</code> kosong pada panel yang sempit. Kenapa?',
                opts: [
                    'Data source kelebihan beban',
                    '<code>$__interval</code> bisa lebih kecil dari scrape interval sehingga rate() tidak punya dua sampel',
                    'Panel sempit tidak mendukung fungsi rate',
                    'Rentang harus selalu ditulis tetap'
                ],
                a: 1,
                exp: '<code>rate()</code> butuh minimal dua sampel dalam rentangnya. <code>$__rate_interval</code> menjamin rentang minimal empat kali scrape interval.'
            },
            {
                q: 'Panel Stat menampilkan "No data" padahal sistem sehat. Perbaikan yang tepat?',
                opts: [
                    'Mengaktifkan <code>spanNulls</code>',
                    'Mengganti calcs dari <code>last</code> menjadi <code>lastNotNull</code>',
                    'Menurunkan refresh interval',
                    'Mengganti panel menjadi Gauge'
                ],
                a: 1,
                exp: '<code>last</code> mengambil titik terakhir termasuk bila nilainya null — misalnya saat scrape terakhir belum masuk. <code>lastNotNull</code> mundur mencari nilai valid terakhir.'
            },
            {
                q: 'Metrik latency dengan p95 yang stabil tetapi pelanggan mengeluh lambat. Visualisasi apa yang paling mungkin mengungkap penyebabnya?',
                opts: ['Gauge', 'Heatmap', 'Pie chart', 'Bar gauge'],
                a: 1,
                exp: 'Persentil meringkas distribusi menjadi satu angka. Heatmap menampilkan seluruh bucket, sehingga pola bimodal — mayoritas cepat, sebagian sangat lambat — langsung terlihat.'
            },
            {
                q: 'Kueri menghasilkan rasio <code>0.042</code> dan Anda memilih unit <code>percent</code>. Apa yang tampil?',
                opts: ['4,2%', '0,042%', '420%', '42%'],
                a: 1,
                exp: '<code>percent</code> mengharapkan nilai dalam skala 0–100. Untuk rasio 0.0–1.0 gunakan <code>percentunit</code>, yang akan menampilkan 4,2%.'
            },
            {
                q: 'Panel Stat berwarna merah karena threshold, tetapi tidak ada notifikasi terkirim. Kenapa?',
                opts: [
                    'Contact point belum dikonfigurasi',
                    'Threshold panel dan alert rule adalah dua sistem terpisah sejak unified alerting',
                    'Panel Stat tidak mendukung alerting',
                    'Threshold harus memakai mode percentage'
                ],
                a: 1,
                exp: 'Sejak Grafana 8, alert didefinisikan sebagai alert rule tersendiri. Threshold pada panel murni visual dan tidak pernah memicu notifikasi.'
            },
            {
                q: 'Anda ingin satu series memakai sumbu kanan dan warna tetap tanpa mengubah series lain. Fitur yang dipakai?',
                opts: ['Transformation', 'Override dengan matcher', 'Value mapping', 'Panel terpisah'],
                a: 1,
                exp: 'Override menargetkan field tertentu lewat matcher (byName, byRegexp, byFrameRefID) dan menerapkan properti hanya pada field tersebut.'
            },
            {
                q: 'Variabel multi-value <code>$layanan</code> dipakai sebagai <code>up{layanan="$layanan"}</code>. Apa yang terjadi bila dua nilai dipilih?',
                opts: [
                    'Grafana otomatis mengubahnya menjadi regex',
                    'Menjadi <code>layanan="{api,ledger}"</code> dan tidak cocok apa pun',
                    'Hanya nilai pertama yang dipakai',
                    'Panel menampilkan gabungan keduanya'
                ],
                a: 1,
                exp: 'Interpolasi multi-value menghasilkan bentuk <code>{a,b}</code>. Pencocokan persis tidak menemukan apa pun; harus memakai <code>=~</code> yang menerima <code>api|ledger</code>.'
            },
            {
                q: 'Kenapa <em>Custom all value</em> sebaiknya diisi <code>.+</code> alih-alih dibiarkan <code>.*</code>?',
                opts: [
                    'Karena <code>.*</code> tidak valid di PromQL',
                    'Karena <code>.*</code> juga mencocokkan label kosong sehingga series tanpa label itu ikut terhitung',
                    'Karena lebih cepat dieksekusi',
                    'Karena opsi All harus muncul pertama'
                ],
                a: 1,
                exp: 'Regex PromQL anchored penuh, dan <code>.*</code> cocok dengan string kosong. Akibatnya series yang tidak memiliki label tersebut ikut terpilih dan agregasi menggelembung.'
            },
            {
                q: 'Join by field antara Prometheus dan PostgreSQL menghasilkan tabel kosong. Penyebab paling mungkin?',
                opts: [
                    'Mode join salah dipilih',
                    'Tipe kolom kunci berbeda: string di Prometheus, integer di SQL',
                    'Dua data source tidak boleh digabung',
                    'Perlu mengaktifkan instant query'
                ],
                a: 1,
                exp: 'Semua label Prometheus bertipe string. Bila kolom kunci SQL bertipe integer, tidak ada baris yang dianggap cocok. Samakan dengan <code>::text</code> atau transformation Convert field type.'
            },
            {
                q: 'Perhitungan yang hasilnya harus bisa memicu alert sebaiknya dibuat dengan…',
                opts: [
                    'Transformation "Add field from calculation"',
                    'Expression bertipe Math',
                    'Override pada fieldConfig',
                    'Value mapping bertipe range'
                ],
                a: 1,
                exp: 'Alert rule hanya mengevaluasi kueri dan Expression. Transformation adalah operasi sisi klien pada panel dan tidak pernah dijalankan evaluator alert.'
            },
            {
                q: 'Apa keuntungan teknis menaruh panel detail di dalam row yang collapsed?',
                opts: [
                    'Panel dirender dengan resolusi lebih tinggi',
                    'Kueri panel tidak dijalankan sampai row dibuka',
                    'Panel otomatis memakai instant query',
                    'Hasilnya di-cache lebih lama'
                ],
                a: 1,
                exp: 'Panel di dalam row tertutup tidak mengeksekusi kueri sama sekali — cara paling murah memangkas waktu muat sekaligus mengurangi beban data source.'
            },
            {
                q: 'Alert dengan <code>noDataState: OK</code> tidak berbunyi saat aplikasi mati total. Kenapa?',
                opts: [
                    'Karena <code>for</code> terlalu panjang',
                    'Aplikasi mati berarti tidak ada series, dan NoData diperlakukan sebagai sehat',
                    'Karena contact point gagal mengirim',
                    'Karena rule harus data source-managed'
                ],
                a: 1,
                exp: 'Tanpa metrik, kueri mengembalikan hasil kosong. Dengan <code>noDataState: OK</code>, kondisi terparah justru dianggap normal. Gunakan <code>NoData</code> dan tambahkan alert <code>absent()</code>.'
            },
            {
                q: 'Satu alert rule menghasilkan 40 instance dan Slack menerima 40 pesan. Perbaikan yang benar?',
                opts: [
                    'Menghapus label instance dari rule',
                    'Membuat <code>group_by</code> di notification policy lebih kasar',
                    'Menaikkan <code>repeat_interval</code>',
                    'Membuat silence permanen'
                ],
                a: 1,
                exp: 'Multi-dimensional alert memang menghasilkan banyak instance, dan itu informatif. Yang perlu diatur adalah grouping pada notification policy agar digabung menjadi satu pesan.'
            },
            {
                q: 'Alert yang harus tetap berfungsi walaupun Grafana sedang di-upgrade sebaiknya berupa…',
                opts: [
                    'Grafana-managed dengan Expression',
                    'Data source-managed yang dievaluasi Prometheus',
                    'Grafana-managed dengan <code>for: 0s</code>',
                    'Duplikat di kedua tempat'
                ],
                a: 1,
                exp: 'Data source-managed rule dievaluasi Prometheus/Mimir sendiri dan tidak bergantung pada ketersediaan Grafana. Alert paging kritis sebaiknya tinggal di sana.'
            },
            {
                q: 'Kenapa <code>trace_id</code> tidak boleh dijadikan label Loki?',
                opts: [
                    'Karena Loki tidak mendukung nilai hash',
                    'Karena setiap nilai unik menciptakan stream baru sehingga jumlah stream meledak',
                    'Karena trace_id hanya boleh ada di Tempo',
                    'Karena label maksimal lima'
                ],
                a: 1,
                exp: 'Label Loki mendefinisikan stream, dan tiap stream punya chunk sendiri. Simpan trace_id di dalam isi baris log dan cari dengan filter — memang begitu Loki dirancang.'
            },
            {
                q: 'Titik exemplar tidak muncul di grafik meski data source sudah dikonfigurasi. Penyebab paling mungkin?',
                opts: [
                    'Panel harus bertipe heatmap',
                    '<code>max_exemplars</code> di Prometheus masih bernilai default 0',
                    'Tempo belum menerima trace apa pun',
                    'Kueri harus instant'
                ],
                a: 1,
                exp: 'Penyimpanan exemplar mati secara default. Tiga syarat harus terpenuhi bersamaan: aplikasi mengekspos exemplar, Prometheus menyimpannya, dan Grafana tahu tujuan trace-nya.'
            },
            {
                q: 'Kenapa izin dashboard saja tidak cukup melindungi data sensitif dari peran Editor?',
                opts: [
                    'Karena Editor otomatis naik menjadi Admin',
                    'Karena Editor bisa menulis kueri bebas ke data source yang bisa dilihatnya',
                    'Karena izin dashboard tidak berlaku di folder',
                    'Karena Grafana mengabaikan izin pada panel'
                ],
                a: 1,
                exp: 'Editor dapat membuat panel dan kueri sendiri. Pemisahan yang nyata harus dilakukan di kredensial data source, bukan hanya di izin dashboard.'
            },
            {
                q: 'Dua replika Grafana mengirim setiap notifikasi dua kali. Konfigurasi apa yang kurang?',
                opts: [
                    'Basis data bersama',
                    '<code>ha_peers</code> pada bagian unified_alerting',
                    'Redis remote cache',
                    'Sticky session di load balancer'
                ],
                a: 1,
                exp: 'Tanpa gosip antar peer, tiap replika bertindak sebagai Alertmanager mandiri. <code>ha_peers</code> membentuk klaster sehingga notifikasi dideduplikasi dan silence tersinkron.'
            },
            {
                q: 'Manfaat recording rule yang <strong>bukan</strong> soal kecepatan adalah…',
                opts: [
                    'Menghemat penyimpanan Prometheus',
                    'Dashboard dan alert dijamin memakai angka yang persis sama',
                    'Mengurangi jumlah data source yang dibutuhkan',
                    'Menghilangkan kebutuhan caching'
                ],
                a: 1,
                exp: 'Satu series hasil perhitungan dipakai bersama, sehingga tidak mungkin lagi dashboard dan alert menghitung dengan cara yang sedikit berbeda — sumber kebingungan yang umum saat insiden.'
            },
            {
                q: 'Selain dump basis data, apa yang <strong>wajib</strong> ikut dibackup agar pemulihan Grafana benar-benar berhasil?',
                opts: [
                    'Folder <code>/var/log/grafana</code>',
                    '<code>secret_key</code> dari konfigurasi',
                    'Cache browser pengguna',
                    'Berkas <code>defaults.ini</code>'
                ],
                a: 1,
                exp: '<code>secret_key</code> mengenkripsi kredensial data source di basis data. Tanpa kunci yang sama, seluruh password data source tidak bisa didekripsi setelah pemulihan.'
            }
        ]
    },

    /* ================== SIMULATOR ================== */
    sim: function (cmd, t) {
        const s = t.ctx;
        const say  = (x, c) => t.echo(x, c || '');
        const err  = (x) => t.echo(x, 't-err');
        const ok   = (x) => t.echo(x, 't-ok');
        const info = (x) => t.echo(x, 't-info');
        const dim  = (x) => t.echo(x, 't-dim');

        const angka = (min, max, d) => (Math.random() * (max - min) + min).toFixed(d === undefined ? 0 : d);

        s.ds = s.ds || [
            { uid: 'prom-utama',  name: 'Prometheus',      type: 'prometheus', url: 'http://prometheus:9090', def: true  },
            { uid: 'loki-utama',  name: 'Loki',            type: 'loki',       url: 'http://loki:3100',       def: false },
            { uid: 'tempo-utama', name: 'Tempo',           type: 'tempo',      url: 'http://tempo:3200',      def: false },
            { uid: 'pg-bisnis',   name: 'Postgres Bisnis', type: 'postgres',   url: 'db:5432',                def: false }
        ];
        s.dash = s.dash || [
            { uid: 'bayarcepat-ikhtisar', title: 'BayarCepat — Apakah Ada Masalah?', folder: 'BayarCepat', tags: ['produksi', 'bayarcepat'] },
            { uid: 'bayarcepat-ledger',   title: 'BayarCepat — Ledger',              folder: 'BayarCepat', tags: ['produksi'] },
            { uid: 'bayarcepat-use',      title: 'BayarCepat — Sumber Daya (USE)',   folder: 'BayarCepat', tags: ['produksi'] },
            { uid: 'lab-pertama',         title: 'Lab — Dashboard Pertama',          folder: 'Eksperimen', tags: ['lab'] }
        ];
        s.alerts = s.alerts || [
            { uid: 'ledger-pool-jenuh', title: 'Pool koneksi ledger hampir habis', state: 'Normal',   sev: 'critical' },
            { uid: 'layanan-hilang',    title: 'Monitoring layanan hilang',         state: 'Normal',   sev: 'critical' },
            { uid: 'slo-latency-p95',   title: 'Latency p95 melewati SLO',          state: 'Pending',  sev: 'warning'  }
        ];
        s.tokens = s.tokens || [];
        s.cfg = s.cfg || {
            'server.http_port': '3000',
            'server.root_url': 'https://grafana.perusahaan.id/',
            'server.serve_from_sub_path': 'false',
            'database.type': 'postgres',
            'users.default_theme': 'dark',
            'users.allow_sign_up': 'false',
            'auth.anonymous.enabled': 'false',
            'dashboards.min_refresh_interval': '10s',
            'unified_alerting.enabled': 'true',
            'alerting.enabled': 'false',
            'caching.enabled': 'true'
        };

        const UNITS = {
            s: v => v < 1 ? (v * 1000).toFixed(1) + ' ms' : v.toFixed(2) + ' s',
            ms: v => v >= 1000 ? (v / 1000).toFixed(2) + ' s' : v.toFixed(1) + ' ms',
            percent: v => v.toFixed(3) + '%',
            percentunit: v => (v * 100).toFixed(2) + '%',
            bytes: v => v >= 1e9 ? (v / 1e9).toFixed(2) + ' GB' : v >= 1e6 ? (v / 1e6).toFixed(2) + ' MB' : v >= 1e3 ? (v / 1e3).toFixed(2) + ' kB' : v + ' B',
            'bytes(IEC)': v => v >= 1073741824 ? (v / 1073741824).toFixed(2) + ' GiB' : v >= 1048576 ? (v / 1048576).toFixed(2) + ' MiB' : (v / 1024).toFixed(2) + ' KiB',
            reqps: v => v >= 1000 ? (v / 1000).toFixed(2) + ' K req/s' : v.toFixed(1) + ' req/s',
            short: v => String(v),
            none: v => String(v)
        };

        function tabel(baris) {
            baris.forEach(b => say(b));
        }

        /* ---------------- help ---------------- */
        if (cmd === 'help' || cmd === 'grafana help' || cmd === 'grafana --help') {
            info('Perintah yang dikenali simulator ini:');
            say('  grafana config [get <kunci>]              lihat konfigurasi efektif');
            say('  grafana db tables                          isi basis data internal');
            say('  grafana ds list | ds query <uid> <expr>     data source');
            say('  grafana dash search [tag=x] | dash get <uid> | dash export [--all]');
            say('  grafana var preview <kueri> | var interpolate <n>=<a,b> <mode>');
            say('  grafana var repeat <nama>');
            say('  grafana panel types | panel inspect <id> [--raw|--transformed]');
            say('  grafana panel stats <id> [--after] | panel reduce <calc>');
            say('  grafana frame schema <id> | transform chain <id>');
            say('  grafana units list | units format <unit> <nilai>');
            say('  grafana interval <rentang> <lebar> <scrape>');
            say('  grafana alert list|test <uid>|instances <uid>|reload|notify <cp>');
            say('  grafana logs query <logql> | logs derived <selector>');
            say('  grafana trace get <id>');
            say('  grafana team create <nama> | folder grant <uid> <tim> <izin>');
            say('  grafana token create <nama> <peran> | token list | auth audit');
            say('  grafana provision validate|reload | rebuild --from-git | backup verify');
            say('  grafana health db|alerting | annotate deploy <layanan> <versi>');
            say('  grafana annotate list <tag> | url kiosk <uid> | grafana-cli --version');
            say('  curl -s [-u user:pass] http://localhost:3000/api/...  |  clear');
            return;
        }

        /* ---------------- versi & health ---------------- */
        if (cmd === 'grafana-cli --version' || cmd === 'grafana --version') {
            say('Grafana CLI version 11.5.0 (commit: 3c8f2a1, branch: HEAD)');
            return;
        }

        if (cmd === 'grafana health db') {
            ok('database: ok  (postgres 17.2, latency 1.8 ms)');
            say('  grafana_database_conn_in_use ....... 4 / 100');
            say('  grafana_database_conn_idle ......... 6');
            return;
        }

        if (cmd === 'grafana health alerting') {
            const delay = +angka(0.2, 1.4, 2);
            say('unified_alerting: enabled');
            say('  rule dievaluasi .................... ' + s.alerts.length);
            say('  grafana_alerting_schedule_delay_seconds ... ' + delay,
                delay < 1 ? 't-ok' : 't-warn');
            if (delay >= 1) err('  ⚠ evaluasi mulai tertinggal — alert bisa berbunyi terlambat.');
            else ok('  ✓ evaluasi mengejar jadwal.');
            return;
        }

        /* ---------------- config ---------------- */
        if (cmd === 'grafana config') {
            info('Konfigurasi efektif (setelah env var menimpa grafana.ini):');
            Object.keys(s.cfg).forEach(k => say('  ' + k.padEnd(36) + ' = ' + s.cfg[k]));
            dim('Catatan: env var GF_* selalu menang atas grafana.ini.');
            return;
        }

        if (/^grafana config get /.test(cmd)) {
            const k = cmd.replace('grafana config get ', '').trim();
            if (s.cfg[k] !== undefined) say(k + ' = ' + s.cfg[k]);
            else err('kunci tidak dikenal: ' + k);
            return;
        }

        if (cmd === 'grafana db tables') {
            info('Tabel di basis data internal Grafana (bukan metrik Anda):');
            tabel([
                '  dashboard              4 baris    definisi dashboard (JSON)',
                '  dashboard_version     37 baris    riwayat revisi',
                '  data_source            4 baris    koneksi + kredensial terenkripsi',
                '  user                   6 baris    pengguna',
                '  team / team_member     2 / 7      tim',
                '  alert_rule             3 baris    aturan alert',
                '  alert_instance         5 baris    instance alert aktif',
                '  annotation           128 baris    anotasi (deploy, insiden)',
                '  api_key / service_account_token   token otomasi'
            ]);
            dim('Tidak ada satu pun tabel berisi nilai metrik — itu ada di Prometheus.');
            return;
        }

        /* ---------------- data source ---------------- */
        if (cmd === 'grafana ds list' || cmd === 'curl -s -u admin:rahasia http://localhost:3000/api/datasources') {
            say('UID            NAMA               TIPE         URL                        DEFAULT');
            s.ds.forEach(d => say(
                d.uid.padEnd(15) + d.name.padEnd(19) + d.type.padEnd(13) +
                d.url.padEnd(27) + (d.def ? 'ya' : '-')));
            return;
        }

        if (/^curl -s -u \S+ http:\/\/localhost:3000\/api\/datasources\/uid\/\S+\/health/.test(cmd)) {
            const uid = cmd.split('/uid/')[1].split('/')[0];
            const d = s.ds.filter(x => x.uid === uid)[0];
            if (!d) { err('{"message":"Data source not found","status":404}'); return; }
            ok('{"status":"OK","message":"Data source is working","duration":' + angka(3, 40) + '}');
            return;
        }

        if (/^grafana ds query /.test(cmd)) {
            const sisa = cmd.replace('grafana ds query ', '').trim();
            const uid  = sisa.split(/\s+/)[0];
            const expr = sisa.slice(uid.length).trim();
            if (!s.ds.filter(x => x.uid === uid)[0]) { err('data source tidak ditemukan: ' + uid); return; }
            if (!expr) { err('kueri kosong'); return; }

            if (/--exemplars/.test(expr)) {
                info('exemplar ditemukan (max_exemplars aktif di Prometheus):');
                say('  le="1"    nilai=0.84s  trace_id=4bf92f3577b34da6a3ce929d0e0e4736');
                say('  le="2.5"  nilai=2.31s  trace_id=00f067aa0ba902b7c1d2e3f4a5b6c7d8');
                dim('Klik titik berlian di grafik untuk membuka trace di Tempo.');
                return;
            }

            const teragregasi = /^sum |^avg |^max |^topk|^layanan:|^ledger:/.test(expr);
            const n = teragregasi ? +angka(3, 6) : +angka(120, 320);
            info('kueri dieksekusi lewat data source ' + uid);
            say('  series dikembalikan ....... ' + n, n > 100 ? 't-warn' : 't-ok');
            say('  titik data ................ ' + (n * +angka(60, 240)));
            say('  durasi .................... ' + angka(teragregasi ? 8 : 380, teragregasi ? 60 : 4200) + ' ms');
            say('');
            for (let i = 0; i < Math.min(n, 4); i++) {
                const lay = ['api', 'ledger', 'notifikasi', 'rekonsiliasi'][i % 4];
                say('  {layanan="' + lay + '"}  =>  ' + angka(0.02, 4.8, 3));
            }
            if (n > 4) dim('  … ' + (n - 4) + ' series lain');
            if (!teragregasi) {
                say('');
                err('  ⚠ ' + n + ' series untuk satu panel — grafik tidak akan terbaca.');
                dim('  Coba: sum by (layanan) (...) atau topk(5, ...)');
            }
            return;
        }

        /* ---------------- dashboard ---------------- */
        if (/^grafana dash search/.test(cmd)) {
            const m = cmd.match(/tag=(\S+)/);
            const hasil = m ? s.dash.filter(d => d.tags.indexOf(m[1]) >= 0) : s.dash;
            if (!hasil.length) { dim('tidak ada dashboard yang cocok.'); return; }
            say('UID                        JUDUL                                     FOLDER');
            hasil.forEach(d => say(d.uid.padEnd(27) + d.title.slice(0, 40).padEnd(42) + d.folder));
            return;
        }

        if (/^grafana dash get /.test(cmd)) {
            const uid = cmd.replace('grafana dash get ', '').trim();
            const d = s.dash.filter(x => x.uid === uid)[0];
            if (!d) { err('dashboard tidak ditemukan: ' + uid); return; }
            say('{');
            say('  "uid": "' + d.uid + '",');
            say('  "title": "' + d.title + '",');
            say('  "tags": ' + JSON.stringify(d.tags) + ',');
            say('  "timezone": "Asia/Jakarta",');
            say('  "schemaVersion": 39,');
            say('  "version": ' + angka(2, 40) + ',');
            say('  "refresh": "30s",');
            say('  "time": { "from": "now-6h", "to": "now" },');
            say('  "panels": [ … ]');
            say('}');
            dim('Sebelum commit ke Git: set id=null, hapus version dan iteration.');
            return;
        }

        if (/^grafana dash export/.test(cmd)) {
            const semua = /--all/.test(cmd);
            const list = semua ? s.dash : s.dash.slice(0, 1);
            list.forEach(d => ok('diekspor: dashboards/' + d.uid + '.json  (id=null, version dihapus)'));
            say('');
            info(list.length + ' dashboard siap di-commit ke Git.');
            return;
        }

        if (/^curl -s -u \S+ -H .* -X POST -d @\S+ http:\/\/localhost:3000\/api\/dashboards\/db/.test(cmd) ||
            /^curl -s -u \S+ -H "Content-Type: application\/json" -X POST -d @/.test(cmd)) {
            ok('{"id":12,"uid":"lab-pertama","slug":"lab-dashboard-pertama","status":"success","version":1}');
            return;
        }

        if (/^curl -s -u \S+ http:\/\/localhost:3000\/api\/dashboards\/uid\/\S+\/versions/.test(cmd)) {
            say('VERSI  DIBUAT               OLEH     PESAN');
            say('    3  2026-07-27 22:14     ani      tambah panel heatmap');
            say('    2  2026-07-26 09:41     budi     perbaiki unit percentunit');
            say('    1  2026-07-25 16:02     ani      dibuat lewat API dari lab');
            return;
        }

        /* ---------------- variabel ---------------- */
        if (/^grafana var preview /.test(cmd)) {
            const q = cmd.replace('grafana var preview ', '').trim();
            if (!/^label_values\(/.test(q) && !/^metrics\(/.test(q) && !/^query_result\(/.test(q)) {
                err('kueri variabel tidak dikenali. Gunakan label_values(), metrics(), atau query_result().');
                return;
            }
            info('nilai yang dihasilkan:');
            ['api', 'ledger', 'notifikasi', 'rekonsiliasi'].forEach(v => say('  ' + v));
            dim('4 nilai · refresh: on time range change dianjurkan untuk target yang fana.');
            return;
        }

        if (/^grafana var interpolate /.test(cmd)) {
            const m = cmd.match(/^grafana var interpolate (\w+)=(\S+)\s*(\w*)/);
            if (!m) { err('format: grafana var interpolate <nama>=<a,b> [regex|plain|csv|singlequote]'); return; }
            const nama = m[1], nilai = m[2].split(','), mode = m[3] || 'plain';
            say('variabel  : $' + nama + ' = [' + nilai.join(', ') + ']');
            if (mode === 'regex' || mode === 'pipe') {
                ok('hasil     : up{' + nama + '=~"' + nilai.join('|') + '"}');
                ok('            ✓ cocok dengan ' + nilai.length + ' series');
            } else if (mode === 'csv') {
                ok('hasil     : WHERE ' + nama + ' IN (' + nilai.join(',') + ')');
            } else if (mode === 'singlequote') {
                ok('hasil     : WHERE ' + nama + " IN ('" + nilai.join("','") + "')");
            } else {
                err('hasil     : up{' + nama + '="{' + nilai.join(',') + '}"}');
                err('            ✗ tidak cocok dengan series mana pun');
                dim('            Perbaikan: ganti = menjadi =~');
            }
            return;
        }

        if (/^grafana var repeat /.test(cmd)) {
            const nama = cmd.replace('grafana var repeat ', '').trim();
            const n = nama === 'layanan' ? 4 : +angka(8, 60);
            const qpp = 3;
            say('variabel  : $' + nama + '  (' + n + ' nilai)');
            say('panel     : 1 panel dengan repeat → ' + n + ' panel');
            say('kueri     : ' + n + ' × ' + qpp + ' target = ' + (n * qpp) + ' kueri per refresh');
            if (n * qpp > 60) {
                err('⚠ ' + (n * qpp) + ' kueri sekaligus akan membebani data source.');
                dim('  Hapus opsi "All" dari variabel repeat dan batasi maxPerRow.');
            } else ok('✓ jumlah kueri masih wajar.');
            return;
        }

        /* ---------------- panel ---------------- */
        if (cmd === 'grafana panel types') {
            info('Tipe panel bawaan Grafana 11:');
            tabel([
                '  timeseries      tren dari waktu ke waktu (paling sering dipakai)',
                '  stat            satu angka besar + sparkline',
                '  gauge           satu nilai terhadap maksimum yang bermakna',
                '  bargauge        perbandingan antar kategori',
                '  table           baris data, mendukung cell gauge & data link',
                '  heatmap         sebaran nilai (bagus untuk latency)',
                '  histogram       distribusi frekuensi',
                '  state-timeline  perubahan status diskret',
                '  status-history  durasi tiap kondisi',
                '  logs            baris log dari Loki',
                '  traces          waterfall trace dari Tempo',
                '  piechart        proporsi (hindari untuk > 5 kategori)',
                '  xychart         hubungan dua metrik numerik',
                '  nodeGraph       peta layanan',
                '  text            catatan/dokumentasi di dalam dashboard'
            ]);
            return;
        }

        if (/^grafana panel inspect /.test(cmd)) {
            const raw = /--raw/.test(cmd), tr = /--transformed/.test(cmd);
            const id = cmd.replace('grafana panel inspect ', '').split(' ')[0];
            info('Panel ' + id + ' — ' + (tr ? 'SESUDAH transformation' : raw ? 'SEBELUM transformation' : 'ringkasan'));
            if (tr) {
                say('  1 frame · 3 field · 10 baris');
                say('  | Merchant       | Tier  | TPS  |');
                say('  | Toko Sinar     | gold  | 42.1 |');
                say('  | Warung Bu Ani  | basic | 18.7 |');
            } else if (raw) {
                say('  2 frame diterima:');
                say('    frame A (prometheus): 2 field · 10 baris  [merchant_id(string), Value(number)]');
                say('    frame B (postgres)  : 3 field · 24 baris  [merchant_id(string), nama, tier]');
            } else {
                say('  Data source duration ..... ' + angka(40, 2600) + ' ms');
                say('  Number of fields ......... ' + angka(3, 180));
                say('  Number of rows ........... ' + angka(200, 48000));
                say('  Transformations .......... 4');
                dim('  Pakai --raw / --transformed untuk melihat bentuk frame.');
            }
            return;
        }

        if (/^grafana panel stats /.test(cmd)) {
            const after = /--after/.test(cmd);
            const id = cmd.replace('grafana panel stats ', '').split(' ')[0];
            info('Panel ' + id + (after ? ' — SESUDAH optimasi' : ' — SEBELUM optimasi'));
            if (after) {
                ok('  Data source duration ..... 74 ms      (dari 3.180 ms)');
                ok('  Number of fields ......... 4          (dari 214)');
                ok('  Number of rows ........... 720        (dari 41.200)');
                say('');
                ok('  ✓ recording rule + agregasi + max data points = 43× lebih cepat.');
            } else {
                err('  Data source duration ..... 3.180 ms');
                err('  Number of fields ......... 214');
                err('  Number of rows ........... 41.200');
                say('');
                dim('  Diagnosis: kueri menghitung histogram_quantile atas 214 series');
                dim('  setiap refresh. Pindahkan ke recording rule.');
            }
            return;
        }

        if (/^grafana panel reduce /.test(cmd)) {
            const calc = cmd.replace('grafana panel reduce ', '').trim();
            say('12 series masuk ke panel Stat, calcs = ' + calc);
            if (calc === 'last') {
                err('  3 series bernilai null pada titik terakhir → panel: "No data"');
                dim('  Gunakan lastNotNull agar mundur ke nilai valid terakhir.');
            } else if (calc === 'lastNotNull') {
                ok('  12 nilai valid → panel menampilkan angka dengan benar.');
            } else {
                say('  hasil ' + calc + ': ' + angka(0.1, 9.4, 2));
            }
            dim('  Catatan: panel Stat menampilkan satu kotak per series (12 kotak).');
            return;
        }

        if (/^grafana frame schema /.test(cmd)) {
            info('Skema frame — periksa tipe kolom kunci sebelum join:');
            say('  frame A (prometheus)');
            say('    merchant_id .... string   ← label Prometheus SELALU string');
            say('    Value .......... number');
            say('  frame B (postgres)');
            say('    merchant_id .... string   ← sudah dikonversi dengan id::text');
            say('    nama ........... string');
            say('    tier ........... string');
            ok('  ✓ tipe kunci cocok — join akan berhasil.');
            return;
        }

        if (/^grafana transform chain /.test(cmd)) {
            info('Rantai transformation panel (dieksekusi berurutan):');
            say('  1. joinByField (merchant_id, outer)   2 frame → 1 frame · 4 field · 24 baris');
            say('  2. filterFieldsByName                 4 field → 3 field');
            say('  3. organize (rename + urutkan)        3 field · 24 baris');
            say('  4. sortBy (TPS desc)                  3 field · 24 baris');
            dim('Urutan menentukan hasil: Filter sebelum Reduce ≠ Reduce sebelum Filter.');
            return;
        }

        /* ---------------- unit & interval ---------------- */
        if (cmd === 'grafana units list') {
            info('Unit yang sering dipakai:');
            tabel([
                '  s              detik          0.042  → 42 ms',
                '  ms             milidetik      1500   → 1.50 s',
                '  bytes          byte SI        1500000 → 1.50 MB',
                '  bytes(IEC)     byte IEC       1048576 → 1.00 MiB',
                '  percent        persen 0-100   42     → 42.000%',
                '  percentunit    rasio 0.0-1.0  0.042  → 4.20%',
                '  reqps          request/detik  1500   → 1.50 K req/s',
                '  short          angka pendek',
                '  currencyIDR    rupiah'
            ]);
            return;
        }

        if (/^grafana units format /.test(cmd)) {
            const p = cmd.replace('grafana units format ', '').trim().split(/\s+/);
            const unit = p[0], nilai = parseFloat(p[1]);
            if (isNaN(nilai)) { err('nilai tidak valid'); return; }
            if (!UNITS[unit]) { err('unit tidak dikenal: ' + unit); return; }
            const hasil = UNITS[unit](nilai);
            say(nilai + '  dengan unit ' + unit + '  →  ' + hasil);
            if (unit === 'percent' && nilai < 1) {
                err('⚠ nilai < 1 dengan unit percent — hampir pasti salah.');
                dim('  Rasio 0.0–1.0 seharusnya memakai percentunit → ' + UNITS.percentunit(nilai));
            }
            if (unit === 'percentunit' && nilai > 1.5) {
                err('⚠ nilai > 1 dengan unit percentunit — kueri mungkin sudah dikali 100.');
                dim('  Pilih salah satu: kalikan di kueri ATAU pakai percentunit, jangan keduanya.');
            }
            return;
        }

        if (/^grafana interval /.test(cmd)) {
            const p = cmd.replace('grafana interval ', '').trim().split(/\s+/);
            if (p.length < 3) { err('format: grafana interval <rentang> <lebar_px> <scrape>'); return; }
            const detik = { s: 1, m: 60, h: 3600, d: 86400 };
            const parse = x => {
                const m = String(x).match(/^(\d+)([smhd])$/);
                return m ? +m[1] * detik[m[2]] : +String(x).replace(/px$/, '');
            };
            const rentang = parse(p[0]), px = parse(p[1]), scrape = parse(p[2]);
            const interval = Math.max(Math.round(rentang / px), scrape);
            const rate = Math.max(interval + scrape, 4 * scrape);
            say('rentang waktu ......... ' + p[0] + '  (' + rentang + ' s)');
            say('lebar panel ........... ' + p[1]);
            say('scrape_interval ....... ' + p[2] + '  (timeInterval data source)');
            say('');
            ok('$__interval ........... ' + interval + 's');
            ok('$__rate_interval ...... ' + rate + 's   = max(' + interval + '+' + scrape + ', 4×' + scrape + ')');
            say('');
            if (interval < scrape) {
                err('⚠ $__interval lebih kecil dari scrape_interval — rate() bisa kosong.');
            }
            dim('Selalu pakai $__rate_interval untuk rate() dan increase().');
            return;
        }

        /* ---------------- alerting ---------------- */
        if (cmd === 'grafana alert list') {
            say('UID                  JUDUL                                     SEVERITY   STATE');
            s.alerts.forEach(a => say(
                a.uid.padEnd(21) + a.title.slice(0, 40).padEnd(42) + a.sev.padEnd(11) + a.state));
            return;
        }

        if (cmd === 'grafana alert reload' || cmd === 'grafana provision reload') {
            ok('provisioning dimuat ulang: 3 alert rule, 2 contact point, 1 notification policy');
            dim('Tidak perlu restart — provisioning dipantau berkala.');
            return;
        }

        if (/^grafana alert test /.test(cmd)) {
            const uid = cmd.replace('grafana alert test ', '').trim();
            const a = s.alerts.filter(x => x.uid === uid)[0];
            if (!a) { err('alert rule tidak ditemukan: ' + uid); return; }
            info('mengevaluasi ' + uid + ' …');
            say('  A (query)     : 4 series');
            say('  B (reduce)    : last → 4 nilai');
            const nilai = +angka(0.2, 0.95, 3);
            say('  C (threshold) : > 0.85  →  nilai tertinggi ' + nilai);
            say('');
            if (nilai > 0.85) {
                a.state = 'Pending';
                err('  state: Pending  (harus bertahan ' + (uid === 'ledger-pool-jenuh' ? '3m' : '10m') + ' sebelum Alerting)');
                dim('  Notifikasi BELUM dikirim saat Pending — ini perilaku yang benar.');
            } else {
                a.state = 'Normal';
                ok('  state: Normal — kondisi tidak terpenuhi.');
            }
            return;
        }

        if (/^grafana alert instances /.test(cmd)) {
            const uid = cmd.replace('grafana alert instances ', '').trim();
            if (!s.alerts.filter(x => x.uid === uid)[0]) { err('alert rule tidak ditemukan: ' + uid); return; }
            info('instance yang dihasilkan satu rule ini:');
            ['api', 'ledger', 'notifikasi', 'rekonsiliasi'].forEach(l => {
                const st = l === 'ledger' ? 'Alerting' : 'Normal';
                say('  {layanan="' + l + '"}  →  ' + st, st === 'Alerting' ? 't-err' : 't-ok');
            });
            say('');
            dim('Satu rule = banyak instance. Yang mengatur banyaknya PESAN adalah');
            dim('group_by di notification policy, bukan jumlah instance.');
            return;
        }

        if (/^grafana alert notify /.test(cmd)) {
            const cp = cmd.replace('grafana alert notify ', '').trim();
            info('mengirim notifikasi percobaan ke contact point "' + cp + '" …');
            say('');
            say('  [FIRING:1] Pool koneksi ledger hampir habis');
            say('  Layanan: ledger  ·  Severity: critical');
            say('  Nilai: 0.91');
            say('  Runbook: https://wiki.internal/runbook/ledger-pool');
            say('  Dashboard: https://grafana.perusahaan.id/d/bayarcepat-ledger?viewPanel=7');
            say('');
            ok('terkirim (1 pesan, bukan 4 — group_by: [alertname, layanan] bekerja).');
            return;
        }

        /* ---------------- logs & trace ---------------- */
        if (/^grafana logs query /.test(cmd)) {
            const q = cmd.replace('grafana logs query ', '').trim();
            if (!/^\{/.test(q) && !/\(\{/.test(q)) {
                err('LogQL wajib dimulai dengan stream selector, contoh: {layanan="ledger"}');
                return;
            }
            if (/trace_id\s*=\s*"/.test(q.split('}')[0])) {
                err('⚠ trace_id dipakai sebagai LABEL di stream selector.');
                dim('  Ini akan meledakkan jumlah stream. Cari di isi baris: | json | trace_id="…"');
                return;
            }
            if (/^sum|^count|^rate|^quantile/.test(q)) {
                info('kueri metrik dari log:');
                say('  {layanan="ledger"}  →  0.42 / 1.08 / 3.71  (per detik, 3 titik terakhir)');
                return;
            }
            info('12 baris terakhir:');
            say('  2026-07-28 09:14:22  level=error layanan=ledger trace_id=4bf92f35 pesan="pool timeout"');
            say('  2026-07-28 09:14:19  level=error layanan=ledger trace_id=00f067aa pesan="pool timeout"');
            say('  2026-07-28 09:14:11  level=warn  layanan=ledger trace_id=9a3b1c2d pesan="pool 89% terpakai"');
            dim('  … 9 baris lain  ·  derived field TraceID terdeteksi → tombol "Lihat trace" aktif');
            return;
        }

        if (/^grafana logs derived /.test(cmd)) {
            info('derived fields yang cocok pada stream ini:');
            say('  TraceID   regex: trace_id=(\\w+)   → Tempo (tempo-utama)');
            say('  OrderID   regex: order_id=(\\w+)   → https://admin.internal/pesanan/…');
            ok('  ✓ 12 dari 12 baris memuat trace_id — korelasi log→trace siap.');
            return;
        }

        if (/^grafana trace get /.test(cmd)) {
            const id = cmd.replace('grafana trace get ', '').trim();
            info('trace ' + id + '  (total 3.14 s)');
            say('  ledger: POST /transaksi ................... 3.140 s');
            say('    ├─ auth.verifikasi ...................... 0.012 s');
            say('    ├─ db.pool.acquire ...................... 2.810 s   ← 89% waktu di sini', 't-err');
            say('    ├─ db.query INSERT transaksi ............ 0.184 s');
            say('    └─ notifikasi.kirim (async) ............. 0.098 s');
            say('');
            dim('Klik span db.pool.acquire → "Logs for this span" untuk melihat log terkait.');
            return;
        }

        /* ---------------- auth & izin ---------------- */
        if (cmd === 'grafana auth audit') {
            info('Audit setelan autentikasi:');
            const anon = s.cfg['auth.anonymous.enabled'] === 'true';
            const signup = s.cfg['users.allow_sign_up'] === 'true';
            say('  auth.anonymous.enabled ....... ' + s.cfg['auth.anonymous.enabled'], anon ? 't-err' : 't-ok');
            say('  users.allow_sign_up .......... ' + s.cfg['users.allow_sign_up'], signup ? 't-err' : 't-ok');
            say('  password admin default ....... tidak', 't-ok');
            say('  akun bersama terdeteksi ...... tidak', 't-ok');
            say('  service account tanpa expiry . ' + (s.tokens.filter(x => !x.exp).length), 't-warn');
            say('');
            if (!anon && !signup) ok('✓ tidak ada temuan kritis.');
            else err('✗ ada setelan yang membuka instansi lebih luas dari seharusnya.');
            return;
        }

        if (/^grafana team create /.test(cmd)) {
            const nama = cmd.replace('grafana team create ', '').replace(/^"|"$/g, '').trim();
            ok('tim dibuat: ' + nama + '  (teamId: 3)');
            return;
        }

        if (/^grafana folder grant /.test(cmd)) {
            const p = cmd.replace('grafana folder grant ', '').match(/(\S+)\s+"([^"]+)"\s+(\S+)/);
            if (!p) { err('format: grafana folder grant <folderUid> "<Nama Tim>" <View|Edit|Admin>'); return; }
            ok('izin ' + p[3] + ' diberikan kepada "' + p[2] + '" pada folder ' + p[1]);
            dim('Izin diwariskan ke seluruh dashboard di dalam folder.');
            return;
        }

        if (/^grafana token create /.test(cmd)) {
            const p = cmd.replace('grafana token create ', '').trim().split(/\s+/);
            const nama = p[0], peran = p[1] || 'Viewer';
            if (peran === 'Admin') {
                err('⚠ peran Admin untuk otomasi hampir selalu berlebihan.');
                dim('  Untuk mengirim anotasi, peran Editor sudah cukup.');
            }
            s.tokens.push({ nama: nama, peran: peran, exp: true });
            ok('service account dibuat: ' + nama + ' (peran ' + peran + ')');
            say('token: glsa_' + Math.random().toString(36).slice(2, 14) + '_' + Math.random().toString(36).slice(2, 10));
            dim('Simpan sekarang — token tidak bisa dilihat lagi. Berlaku 90 hari.');
            return;
        }

        if (cmd === 'grafana token list') {
            if (!s.tokens.length) { dim('belum ada service account token.'); return; }
            say('NAMA                 PERAN     KEDALUWARSA');
            s.tokens.forEach(t2 => say(t2.nama.padEnd(21) + t2.peran.padEnd(10) + (t2.exp ? '90 hari' : 'TIDAK ADA')));
            return;
        }

        /* ---------------- provisioning & backup ---------------- */
        if (cmd === 'grafana provision validate') {
            info('memvalidasi berkas provisioning …');
            ok('  provisioning/datasources/sumber.yml ....... valid (4 data source, UID eksplisit)');
            ok('  provisioning/dashboards/pemuat.yml ........ valid (2 provider)');
            ok('  provisioning/alerting/rules.yml ........... valid (3 rule)');
            ok('  provisioning/alerting/notifikasi.yml ...... valid (2 contact point)');
            say('');
            ok('✓ semua UID data source yang dipakai dashboard dikenal.');
            return;
        }

        if (cmd === 'grafana rebuild --from-git') {
            info('docker compose down -v  →  up -d  (hanya dari Git) …');
            say('  memuat data source ....... 4');
            say('  memuat dashboard ......... 4');
            say('  memuat alert rule ........ 3');
            say('  memuat contact point ..... 2');
            say('');
            ok('✓ instansi dipulihkan sepenuhnya tanpa menyentuh backup basis data.');
            dim('Yang tidak ikut pulih: anotasi historis dan riwayat state alert.');
            return;
        }

        if (cmd === 'grafana backup verify') {
            info('memverifikasi kelengkapan backup …');
            ok('  dump basis data .......... ada (grafana-db-2026-07-28.sql.gz)');
            ok('  secret_key ............... ada');
            ok('  provisioning ............. ada (dan sudah di Git)');
            say('  plugin manual ............ tidak ada plugin manual', 't-ok');
            say('');
            ok('✓ backup lengkap. Uji pemulihan terakhir: 12 hari lalu.');
            dim('Backup yang belum pernah diuji pemulihannya bukan backup, hanya harapan.');
            return;
        }

        /* ---------------- anotasi & URL ---------------- */
        if (/^grafana annotate deploy /.test(cmd)) {
            const p = cmd.replace('grafana annotate deploy ', '').trim().split(/\s+/);
            ok('anotasi dibuat: deploy ' + p[0] + ' ' + (p[1] || '') + '  (tags: deploy, ' + p[0] + ')');
            dim('Garis biru muncul di seluruh dashboard yang mengaktifkan anotasi bertag "deploy".');
            return;
        }

        if (/^grafana annotate list/.test(cmd)) {
            say('WAKTU                TAG              TEKS');
            say('2026-07-28 09:02     deploy,ledger    Deploy ledger versi v2.4.1');
            say('2026-07-27 16:40     deploy,api       Deploy api versi v3.1.0');
            say('2026-07-27 14:31     insiden          Pool koneksi ledger habis (40 mnt)');
            return;
        }

        if (/^grafana url kiosk /.test(cmd)) {
            const uid = cmd.replace('grafana url kiosk ', '').trim();
            say('https://grafana.perusahaan.id/d/' + uid + '/?kiosk&refresh=1m&theme=light&from=now-6h&to=now');
            dim('Untuk layar TV: pakai akun Viewer khusus, bukan akun pribadi seseorang.');
            return;
        }

        /* ---------------- API umum ---------------- */
        if (/^curl .*\/api\/health/.test(cmd)) {
            say('{"commit":"3c8f2a1","database":"ok","version":"11.5.0"}');
            return;
        }

        if (/^curl .*\/api\/admin\/provisioning\/\w+\/reload/.test(cmd)) {
            ok('{"message":"Datasources config reloaded"}');
            return;
        }

        if (/^curl .*\/api\/annotations/.test(cmd)) {
            ok('{"id":412,"message":"Annotation added"}');
            return;
        }

        if (/^curl .*\/api\/(teams|folders|serviceaccounts)/.test(cmd)) {
            ok('{"id":3,"message":"created","uid":"tim-pembayaran"}');
            return;
        }

        if (cmd === 'jq .' || cmd === 'jq') {
            dim('(jq hanya memformat keluaran — sudah diterapkan di simulator ini)');
            return;
        }

        if (cmd === 'docker compose up -d') {
            say('[+] Running 3/3');
            say(' ✔ Network grafana_default   Created');
            say(' ✔ Volume "grafana-data"     Created');
            ok(' ✔ Container grafana          Started');
            return;
        }

        if (/^docker compose/.test(cmd)) {
            ok('perintah docker compose dijalankan.');
            return;
        }

        err('bash: ' + cmd.split(' ')[0] + ': command not found');
        dim('Ketik "help" untuk melihat perintah yang dikenali.');
    }
};

/* ==========================================================================
   LEARNING PLATFORM v3 — ENGINE
   Dipakai bersama oleh seluruh mata pelajaran. Data materi ada di atas file
   ini (konstanta COURSE). Jangan ubah bagian ini kecuali paham dampaknya.
   ========================================================================== */
(function () {
'use strict';

const M      = COURSE.modules;
const KEY    = 'lp3.' + COURSE.key;
const $      = (s, r) => (r || document).querySelector(s);
const $$     = (s, r) => Array.from((r || document).querySelectorAll(s));

let state = {
    current: 0,
    done: {},
    steps: {},
    mode: 'light',
    filter: 'ALL',
    query: ''
};

/* ---------- PERSISTENCE ---------- */
function load() {
    try {
        const raw = localStorage.getItem(KEY);
        if (raw) Object.assign(state, JSON.parse(raw));
    } catch (e) { /* storage diblokir (mode privat) — jalan tanpa progres */ }
    if (typeof state.current !== 'number' || state.current >= M.length) state.current = 0;
}
function save() {
    try {
        localStorage.setItem(KEY, JSON.stringify({
            current: state.current, done: state.done, steps: state.steps, mode: state.mode
        }));
    } catch (e) {}
}

/* ---------- UTIL ---------- */
function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), 2400);
}
function slugLevel(l) {
    return 'lvl-' + String(l || 'dasar').toLowerCase().replace(/\s+/g, '');
}

/* ---------- SYNTAX HIGHLIGHTER (ringan, multi-bahasa) ---------- */
const HASH_LANGS = /^(bash|sh|shell|zsh|console|yaml|yml|ini|conf|toml|env|dockerfile|docker|python|py|promql|makefile|nginx|hcl|terraform|ruby|perl|redis|cron|properties)$/i;

const KW_LIST = [
    // alur kendali lintas bahasa
    'if','else','elif','fi','then','for','while','do','done','switch','case','esac','break','continue','return','defer','select','range','in','of','try','catch','finally','throw','yield','await','async','with','pass','raise','except','end','panic','recover',
    // deklarasi
    'func','function','def','class','struct','interface','type','enum','const','let','var','val','package','import','from','export','default','new','public','private','static','extends','implements','impl','trait','module','namespace','use','lambda',
    // literal
    'true','false','null','nil','none','undefined','self','this','super',
    // perintah shell & tooling yang sering muncul di materi
    'sudo','apt-get','apt','brew','yum','dnf','choco','winget','curl','wget','echo','cd','ls','mkdir','rm','cp','mv','cat','chmod','chown','tar','unzip','grep','sed','awk','source','set','unset','env','exit','sleep','tee','xargs','watch',
    'docker-compose','docker','kubectl','helm','git','npx','npm','yarn','pnpm','pip3','pip','python3','python','node','go','cargo','make','systemctl','journalctl',
    'k6','promtool','amtool','rabbitmqctl','rabbitmq-plugins','rabbitmqadmin','redis-cli','redis-server','psql','mysql','openssl','ssh','scp','jq','uvicorn','gunicorn'
].sort((a, b) => b.length - a.length);

const KW_SRC = '\\b(?:' + KW_LIST.map(w => w.replace(/-/g, '\\-')).join('|') + ')\\b';

function hl(code, lang) {
    const src  = esc(code);
    const hash = HASH_LANGS.test(lang || '');
    const sp   = (cls, txt) => '<span class="' + cls + '">' + txt + '</span>';

    // Satu regex, satu lintasan kiri-ke-kanan. Token yang sudah diwarnai tidak
    // pernah dipindai ulang, sehingga tidak ada tabrakan antar-aturan.
    const re = new RegExp([
        hash ? '(#[^\\n]*)' : '(\\uFFFF)',                                              // 1 komentar gaya #
        '(\\/\\*[\\s\\S]*?\\*\\/|(?<!:)\\/\\/[^\\n]*)',                                 // 2 komentar // dan /* */
        '("(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\'|`(?:\\\\.|[^`\\\\])*`)', // 3 string
        '(?:(^|[\\s(=,\\[])(--?[A-Za-z][\\w-]*))',                                      // 4 pemisah, 5 flag CLI
        '(\\b\\d+(?:\\.\\d+)?(?:[a-zA-Z%]{1,4})?\\b)',                                  // 6 angka & durasi (30s, 5m)
        '(' + KW_SRC + ')',                                                              // 7 kata kunci
        '(\\b[A-Za-z_$][\\w$]*(?=\\s*\\())'                                              // 8 nama fungsi
    ].join('|'), 'gm');

    return src.replace(re, (m, g1, g2, g3, g4, g5, g6, g7, g8) => {
        if (g1) return sp('tok-com', g1);
        if (g2) return sp('tok-com', g2);
        if (g3) return sp('tok-str', g3);
        if (g5) return (g4 || '') + sp('tok-flag', g5);
        if (g6) return sp('tok-num', g6);
        if (g7) return sp('tok-key', g7);
        if (g8) return sp('tok-fn', g8);
        return m;
    });
}

function codeBlock(src, lang, file) {
    const id = 'cb' + (codeBlock._n = (codeBlock._n || 0) + 1);
    return '<div class="code-block">' +
        '<div class="code-head"><span class="code-file">' +
            (file ? esc(file) : '') +
            '<span class="code-lang">' + esc(lang || 'text') + '</span></span>' +
            '<button class="copy-btn" data-copy="' + id + '">📋 Salin</button>' +
        '</div><pre id="' + id + '"><code>' + hl(src, lang) + '</code></pre></div>';
}

/* Ubah <pre data-lang="..."> di dalam HTML materi menjadi code-block lengkap */
function enhance(root) {
    $$('pre[data-lang]', root).forEach(pre => {
        const lang = pre.getAttribute('data-lang');
        const file = pre.getAttribute('data-file');
        const raw  = pre.textContent.replace(/^\n/, '').replace(/\s+$/, '');
        const wrap = document.createElement('div');
        wrap.innerHTML = codeBlock(raw, lang, file);
        pre.replaceWith(wrap.firstElementChild);
    });
    $$('table:not(.tbl)', root).forEach(t => {
        if (t.parentElement.classList.contains('table-wrap')) return;
        const w = document.createElement('div');
        w.className = 'table-wrap';
        t.replaceWith(w);
        w.appendChild(t);
    });
}

document.addEventListener('click', e => {
    const b = e.target.closest('.copy-btn');
    if (!b) return;
    const pre = document.getElementById(b.dataset.copy);
    navigator.clipboard.writeText(pre.innerText).then(() => {
        b.textContent = '✓ Tersalin';
        b.classList.add('copied');
        setTimeout(() => { b.textContent = '📋 Salin'; b.classList.remove('copied'); }, 1600);
    }).catch(() => toast('Browser memblokir clipboard — salin manual ya.'));
});

/* ---------- SIDEBAR ---------- */
function categories() {
    const seen = [];
    M.forEach(m => { if (!seen.includes(m.cat)) seen.push(m.cat); });
    return seen;
}

function renderFilters() {
    const cats = categories();
    $('#catFilters').innerHTML =
        '<button class="cat-chip active" data-cat="ALL">Semua (' + M.length + ')</button>' +
        cats.map(c => '<button class="cat-chip" data-cat="' + esc(c) + '">' + esc(c) + '</button>').join('');
    $$('#catFilters .cat-chip').forEach(chip => chip.onclick = () => {
        state.filter = chip.dataset.cat;
        $$('#catFilters .cat-chip').forEach(c => c.classList.toggle('active', c === chip));
        renderList();
    });
}

function renderList() {
    const q = state.query.toLowerCase();
    const hits = M.filter(m => {
        if (state.filter !== 'ALL' && m.cat !== state.filter) return false;
        if (!q) return true;
        return (m.title + ' ' + m.desc + ' ' + m.cat + ' ' + (m.tags || []).join(' ')).toLowerCase().includes(q);
    });

    if (!hits.length) {
        $('#chapterList').innerHTML = '<div class="sidebar-empty">Tidak ada materi yang cocok dengan pencarian.<br>Coba kata kunci lain.</div>';
        return;
    }

    let html = '', lastCat = null;
    hits.forEach(m => {
        if (m.cat !== lastCat) { html += '<div class="cat-group-title">' + esc(m.cat) + '</div>'; lastCat = m.cat; }
        const i = M.indexOf(m);
        html += '<div class="chapter-item' + (i === state.current ? ' active' : '') + (state.done[m.id] ? ' done' : '') +
                '" data-i="' + i + '">' +
                '<span class="ci-num"><span>' + m.id + '</span></span>' +
                '<span class="ci-body"><span class="ci-title">' + esc(m.title) + '</span>' +
                '<span class="ci-meta"><span class="lvl ' + slugLevel(m.level) + '">' + esc(m.level || 'Dasar') + '</span>' +
                '<span>⏱ ' + esc(m.dur || '10 mnt') + '</span></span></span></div>';
    });
    $('#chapterList').innerHTML = html;
    $$('#chapterList .chapter-item').forEach(el => el.onclick = () => {
        go(+el.dataset.i);
        if (window.innerWidth <= 900) $('#sidebar').classList.remove('open');
    });
}

function updateProgress() {
    const n = M.filter(m => state.done[m.id]).length;
    const pct = M.length ? Math.round(n / M.length * 100) : 0;
    $('#progressBar').style.width = pct + '%';
    $('#progressText').textContent = n + ' / ' + M.length + ' selesai (' + pct + '%)';
    $('#sidebarCount').textContent = M.length + ' bab';
    $('#brandSub').textContent = COURSE.subtitle || (M.length + ' bab · mini project · ujian akhir');
}

/* ---------- RENDER MODUL ---------- */
function go(i) {
    state.current = Math.max(0, Math.min(M.length - 1, i));
    save();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render() {
    const m = M[state.current];

    $('#chapterMeta').innerHTML =
        '<span class="badge">' + esc(m.cat) + '</span>' +
        '<span class="pill">Bab ' + m.id + ' / ' + M.length + '</span>' +
        '<span class="pill"><span class="lvl ' + slugLevel(m.level) + '">' + esc(m.level || 'Dasar') + '</span></span>' +
        '<span class="pill">⏱ ' + esc(m.dur || '10 mnt') + '</span>';
    $('#chapterTitle').textContent = m.title;
    $('#chapterDesc').textContent = m.desc || '';

    $('#theoryBody').innerHTML = m.theory || '<p>Materi belum tersedia.</p>';
    enhance($('#theoryBody'));

    renderLab(m);
    renderPitfalls(m);
    renderQuiz(m);

    $('#prevBtn').disabled = state.current === 0;
    $('#nextBtn').disabled = state.current === M.length - 1;
    const d = !!state.done[m.id];
    $('#doneBtn').textContent = d ? '✓ Sudah Selesai' : '✓ Tandai Selesai';
    $('#doneBtn').className = 'btn ' + (d ? 'btn-ok' : 'btn-primary');

    renderList();
    updateProgress();
    switchTab('theory');
}

/* ---------- LAB ---------- */
function renderLab(m) {
    const lab = m.lab;
    const box = $('#labBody');
    if (!lab) {
        box.innerHTML = '<div class="callout callout-info"><div class="callout-title">🧪 Tidak ada lab di bab ini</div>' +
            '<p>Bab ini bersifat konseptual. Lanjutkan ke bab berikutnya, atau buka <strong>Mini Project</strong> untuk praktik menyeluruh.</p></div>';
        return;
    }

    let h = '';
    if (lab.intro) h += '<div class="theory">' + lab.intro + '</div>';

    (lab.files || []).forEach(f => { h += codeBlock(f.code, f.lang, f.name); });

    if (lab.steps && lab.steps.length) {
        h += '<div class="theory"><h3>Jalankan Langkah Demi Langkah</h3></div>';
        lab.steps.forEach((s, i) => {
            h += '<div class="theory"><h4>Langkah ' + (i + 1) + (s.note ? ' — ' + s.note : '') + '</h4></div>';
            h += codeBlock(s.cmd, s.lang || 'bash', s.file || 'terminal');
            if (s.out) h += '<div class="callout callout-tip"><div class="callout-title">✅ Output yang diharapkan</div>' +
                            '<pre style="font-family:var(--mono);font-size:.78rem;white-space:pre-wrap;margin:0">' + esc(s.out) + '</pre></div>';
        });
    }

    if (COURSE.sim) {
        h += '<div class="theory"><h3>Terminal Simulasi (aman, tanpa instalasi)</h3>' +
             '<p>Ketik perintah lalu tekan <code>Enter</code>. Klik chip di bawah untuk mengisi otomatis. ' +
             'Simulator ini meniru perilaku perintah asli agar Anda bisa mencoba tanpa risiko merusak sistem.</p></div>';
        if (lab.snippets && lab.snippets.length) {
            h += '<div class="snippet-bar">' + lab.snippets.map(s =>
                '<button class="snippet-chip" data-cmd="' + esc(s).replace(/"/g, '&quot;') + '">' + esc(s) + '</button>').join('') + '</div>';
        }
        h += '<div class="terminal">' +
                '<div class="term-head"><span class="term-dots"><i></i><i></i><i></i></span>' +
                '<span class="term-title">' + esc(COURSE.termTitle || 'bash — simulator') + '</span>' +
                '<button class="term-clear" id="termClear">bersihkan</button></div>' +
                '<div class="term-body" id="termBody"></div>' +
                '<div class="term-input-row"><span class="term-prompt">' + esc(COURSE.prompt || '$') + '</span>' +
                '<input class="term-input" id="termInput" placeholder="ketik perintah lalu Enter…" autocomplete="off" spellcheck="false"></div>' +
             '</div>';
    }

    box.innerHTML = h;
    enhance(box);
    if (COURSE.sim) initTerminal(lab);
}

/* ---------- TERMINAL SIMULATOR ---------- */
const term = {
    hist: [], hp: -1, ctx: {},
    echo(text, cls) {
        const b = $('#termBody');
        if (!b) return;
        String(text).split('\n').forEach(line => {
            const d = document.createElement('div');
            d.className = 'term-line ' + (cls || '');
            d.textContent = line;
            b.appendChild(d);
        });
        b.scrollTop = b.scrollHeight;
    },
    clear() { const b = $('#termBody'); if (b) b.innerHTML = ''; }
};

function initTerminal(lab) {
    term.ctx = term.ctx || {};
    term.clear();
    (COURSE.termWelcome || ['Simulator siap. Ketik "help" untuk melihat perintah yang dikenali.'])
        .forEach(l => term.echo(l, 't-dim'));

    const input = $('#termInput');
    $('#termClear').onclick = () => term.clear();
    $$('#labBody .snippet-chip').forEach(c => c.onclick = () => { input.value = c.dataset.cmd; input.focus(); });

    input.onkeydown = e => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim();
            input.value = '';
            if (!cmd) return;
            term.hist.push(cmd); term.hp = term.hist.length;
            term.echo((COURSE.prompt || '$') + ' ' + cmd, 't-cmd');
            if (cmd === 'clear' || cmd === 'cls') return term.clear();
            try { COURSE.sim(cmd, term); }
            catch (err) { term.echo('simulator error: ' + err.message, 't-err'); }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (term.hp > 0) input.value = term.hist[--term.hp] || '';
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (term.hp < term.hist.length - 1) input.value = term.hist[++term.hp] || '';
            else { term.hp = term.hist.length; input.value = ''; }
        }
    };
}

/* ---------- PITFALLS ---------- */
const PF_META = {
    larangan: ['⛔', 'JANGAN LAKUKAN'],
    salah:    ['⚠️', 'KESALAHAN UMUM'],
    best:     ['✅', 'BEST PRACTICE'],
    kasus:    ['🧭', 'KASUS NYATA DI LAPANGAN']
};
function renderPitfalls(m) {
    const list = m.pitfalls || [];
    if (!list.length) {
        $('#pitfallBody').innerHTML = '<div class="callout callout-info"><div class="callout-title">Belum ada catatan khusus</div>' +
            '<p>Tidak ada jebakan spesifik pada bab ini. Tetap terapkan best practice dari bab-bab sebelumnya.</p></div>';
        return;
    }
    $('#pitfallBody').innerHTML = list.map(p => {
        const meta = PF_META[p.kind] || PF_META.best;
        return '<div class="pitfall k-' + p.kind + '">' +
            '<div class="pitfall-head"><span>' + meta[0] + '</span><span>' + meta[1] + '</span>' +
            '<span style="color:var(--text);font-weight:700">— ' + esc(p.title) + '</span></div>' +
            '<div class="pitfall-body">' + p.body + '</div></div>';
    }).join('');
    enhance($('#pitfallBody'));
}

/* ---------- QUIZ ---------- */
function renderQuiz(m) {
    const qs = m.quiz || [];
    if (!qs.length) { $('#quizBody').innerHTML = '<div class="callout callout-info"><p>Belum ada kuis pada bab ini.</p></div>'; return; }
    $('#quizBody').innerHTML = qs.map((q, i) =>
        '<div class="quiz-item" data-q="' + i + '">' +
            '<div class="quiz-q"><span class="qn">' + (i + 1) + '</span><span>' + q.q + '</span></div>' +
            '<div class="quiz-opts">' + q.opts.map((o, j) =>
                '<button class="quiz-opt" data-i="' + i + '" data-j="' + j + '">' +
                '<span class="ok-letter">' + 'ABCDE'[j] + '</span><span>' + esc(o) + '</span></button>').join('') +
            '</div><div class="quiz-exp"><strong>Pembahasan:</strong> ' + q.exp + '</div>' +
        '</div>').join('');

    $$('#quizBody .quiz-opt').forEach(btn => btn.onclick = () => {
        const i = +btn.dataset.i, j = +btn.dataset.j, q = qs[i];
        const item = $('.quiz-item[data-q="' + i + '"]');
        $$('.quiz-opt', item).forEach((b, k) => {
            b.disabled = true;
            if (k === q.a) b.classList.add('correct');
            else if (k === j) b.classList.add('wrong');
        });
        $('.quiz-exp', item).classList.add('show');
        toast(j === q.a ? '✅ Benar!' : '❌ Belum tepat — baca pembahasannya.');
    });
    enhance($('#quizBody'));
}

/* ---------- TABS ---------- */
function switchTab(name) {
    $$('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    $$('.tab-content').forEach(c => c.classList.toggle('active', c.id === 'tab-' + name));
}
$$('.tab-btn').forEach(b => b.onclick = () => switchTab(b.dataset.tab));

/* ---------- MINI PROJECT ---------- */
function renderProject() {
    const p = COURSE.project;
    $('#projTitle').textContent = '🚀 ' + p.title;
    $('#projSubtitle').textContent = p.subtitle || '';
    $('#projMeta').innerHTML = (p.meta || []).map(x => '<span class="pill">' + esc(x) + '</span>').join('');

    let h = '<div class="theory">' + (p.intro || '') + '</div>';
    h += '<div class="theory"><h3>Tahapan Pengerjaan</h3></div>';
    p.steps.forEach((s, i) => {
        const dk = 'p' + i, isDone = !!state.steps[dk];
        h += '<div class="step' + (isDone ? ' done' : '') + '" data-step="' + i + '">' +
            '<div class="step-head"><input type="checkbox" class="step-check" data-k="' + dk + '"' + (isDone ? ' checked' : '') + '>' +
            '<span class="step-num">' + (i + 1) + '</span>' +
            '<span class="step-title">' + esc(s.title) + '</span>' +
            '<span class="step-toggle">▶</span></div>' +
            '<div class="step-body"><div class="theory">' + s.body + '</div></div></div>';
    });
    if (p.criteria && p.criteria.length) {
        h += '<div class="theory"><h3>Kriteria Kelulusan Project</h3><p>Project dianggap selesai bila <strong>seluruh</strong> poin berikut terpenuhi dan bisa Anda demokan:</p></div>';
        h += '<div class="criteria">' + p.criteria.map(c => '<div class="criteria-item"><span>' + c + '</span></div>').join('') + '</div>';
    }
    if (p.outro) h += '<div class="theory">' + p.outro + '</div>';

    $('#projBody').innerHTML = h;
    enhance($('#projBody'));

    $$('#projBody .step-head').forEach(head => head.onclick = e => {
        if (e.target.classList.contains('step-check')) return;
        head.parentElement.classList.toggle('open');
    });
    $$('#projBody .step-check').forEach(cb => cb.onchange = () => {
        state.steps[cb.dataset.k] = cb.checked;
        cb.closest('.step').classList.toggle('done', cb.checked);
        save(); projProgress();
    });
    projProgress();
}
function projProgress() {
    const total = COURSE.project.steps.length;
    const n = COURSE.project.steps.filter((_, i) => state.steps['p' + i]).length;
    $('#projProgress').textContent = n + ' / ' + total + ' tahap selesai';
}

/* ---------- UJIAN AKHIR ---------- */
let exam = { qs: [], ans: {}, timer: null, left: 0, submitted: false };

function openExam() {
    const cfg = COURSE.exam;
    exam.qs = cfg.questions.slice().sort(() => Math.random() - 0.5);
    exam.ans = {}; exam.submitted = false;
    exam.left = (cfg.durationMin || 30) * 60;

    $('#examSubtitle').textContent = cfg.subtitle || 'Uji pemahaman menyeluruh sebelum Anda pakai di dunia kerja.';
    $('#examMeta').innerHTML =
        '<span class="pill">📝 ' + exam.qs.length + ' soal</span>' +
        '<span class="pill">⏱ ' + (cfg.durationMin || 30) + ' menit</span>' +
        '<span class="pill">🎯 Lulus ≥ ' + (cfg.passScore || 70) + '%</span>';
    $('#submitExamBtn').style.display = '';

    $('#examBody').innerHTML = exam.qs.map((q, i) =>
        '<div class="quiz-item" data-e="' + i + '">' +
            '<div class="quiz-q"><span class="qn">' + (i + 1) + '</span><span>' + q.q + '</span></div>' +
            '<div class="quiz-opts">' + q.opts.map((o, j) =>
                '<button class="quiz-opt" data-e="' + i + '" data-j="' + j + '">' +
                '<span class="ok-letter">' + 'ABCDE'[j] + '</span><span>' + esc(o) + '</span></button>').join('') +
            '</div></div>').join('');
    enhance($('#examBody'));

    $$('#examBody .quiz-opt').forEach(btn => btn.onclick = () => {
        if (exam.submitted) return;
        const i = +btn.dataset.e, j = +btn.dataset.j;
        exam.ans[i] = j;
        $$('#examBody .quiz-opt[data-e="' + i + '"]').forEach(b => b.classList.remove('picked'));
        btn.classList.add('picked');
        countAnswered();
    });

    countAnswered();
    $('#examOverlay').classList.add('open');
    tick();
    exam.timer = setInterval(tick, 1000);
}
function countAnswered() {
    $('#examAnswered').textContent = Object.keys(exam.ans).length + ' / ' + exam.qs.length + ' dijawab';
}
function tick() {
    const el = $('#examTimer');
    const mm = String(Math.floor(exam.left / 60)).padStart(2, '0');
    const ss = String(exam.left % 60).padStart(2, '0');
    el.textContent = mm + ':' + ss;
    el.classList.toggle('danger', exam.left <= 120);
    if (exam.left <= 0) { submitExam(true); return; }
    exam.left--;
}
function submitExam(auto) {
    if (exam.submitted) return;
    if (!auto && Object.keys(exam.ans).length < exam.qs.length) {
        if (!confirm('Masih ada soal yang belum dijawab. Kumpulkan sekarang?')) return;
    }
    exam.submitted = true;
    clearInterval(exam.timer);
    $('#submitExamBtn').style.display = 'none';

    let benar = 0;
    exam.qs.forEach((q, i) => { if (exam.ans[i] === q.a) benar++; });
    const pct  = Math.round(benar / exam.qs.length * 100);
    const pass = pct >= (COURSE.exam.passScore || 70);

    let h = '<div class="exam-result"><div class="score-ring" style="--pct:' + pct + '"><span>' + pct + '%</span></div>' +
        '<div class="score-verdict" style="color:' + (pass ? 'var(--ok)' : 'var(--danger)') + '">' +
        (pass ? '🎉 SELAMAT, ANDA LULUS!' : '📚 BELUM LULUS — Ulangi Lagi') + '</div>' +
        '<p style="color:var(--text-dim)">Benar <strong>' + benar + '</strong> dari <strong>' + exam.qs.length + '</strong> soal' +
        (auto ? ' · waktu habis' : '') + '.</p>' +
        '<p style="color:var(--text-muted);font-size:.85rem;margin-top:8px">' +
        (pass ? 'Anda siap menerapkan materi ini pada pekerjaan nyata. Lanjutkan ke Mini Project bila belum dikerjakan.'
              : 'Pelajari kembali bab dengan jawaban salah di bawah, lalu ulangi ujian.') + '</p>' +
        '<button class="btn btn-primary" id="retryExamBtn" style="margin-top:18px">↺ Ulangi Ujian</button></div>' +
        '<div class="theory"><h3>Pembahasan Lengkap</h3></div>';

    exam.qs.forEach((q, i) => {
        const my = exam.ans[i], ok = my === q.a;
        h += '<div class="quiz-item review-item">' +
            '<div class="quiz-q"><span class="qn" style="background:' + (ok ? 'var(--ok)' : 'var(--danger)') + '">' + (ok ? '✓' : '✕') + '</span><span>' + q.q + '</span></div>' +
            '<div class="quiz-opts">' + q.opts.map((o, j) =>
                '<div class="quiz-opt ' + (j === q.a ? 'correct' : (j === my ? 'wrong' : '')) + '">' +
                '<span class="ok-letter">' + 'ABCDE'[j] + '</span><span>' + esc(o) + '</span></div>').join('') + '</div>' +
            '<div class="quiz-exp show"><strong>Pembahasan:</strong> ' + q.exp + '</div></div>';
    });

    $('#examBody').innerHTML = h;
    enhance($('#examBody'));
    $('#examBody').scrollTop = 0;
    $('#retryExamBtn').onclick = openExam;
}
function closeExam() {
    clearInterval(exam.timer);
    $('#examOverlay').classList.remove('open');
}

/* ---------- WIRING ---------- */
function applyMode() {
    state.mode = 'light';
    document.documentElement.setAttribute('data-mode', 'light');
}

function init() {
    load();
    applyMode();
    document.title = COURSE.pageTitle || document.title;
    renderFilters();
    render();

    $('#searchInput').oninput = e => { state.query = e.target.value; renderList(); };
    $('#prevBtn').onclick = () => go(state.current - 1);
    $('#nextBtn').onclick = () => go(state.current + 1);
    $('#doneBtn').onclick = () => {
        const m = M[state.current];
        state.done[m.id] = !state.done[m.id];
        save(); render();
        if (state.done[m.id]) toast('✓ Bab ditandai selesai');
    };

    $('#resetBtn').onclick = () => {
        if (!confirm('Reset seluruh progres belajar dan checklist mini project?')) return;
        state.done = {}; state.steps = {}; state.current = 0; save(); render(); toast('Progres direset');
    };
    $('#menuToggle').onclick = () => $('#sidebar').classList.toggle('open');

    $('#openProjectBtn').onclick = () => { renderProject(); $('#projectOverlay').classList.add('open'); };
    $('#closeProjBtn').onclick = () => $('#projectOverlay').classList.remove('open');
    $('#openExamBtn').onclick = openExam;
    $('#closeExamBtn').onclick = closeExam;
    $('#submitExamBtn').onclick = () => submitExam(false);

    $$('.overlay').forEach(o => o.onclick = e => { if (e.target === o) o.classList.remove('open'); });

    document.addEventListener('keydown', e => {
        if (e.target.matches('input, textarea')) return;
        if (e.key === 'ArrowLeft'  && state.current > 0) go(state.current - 1);
        if (e.key === 'ArrowRight' && state.current < M.length - 1) go(state.current + 1);
        if (e.key === '/') { e.preventDefault(); $('#searchInput').focus(); }
        if (e.key === 'Escape') $$('.overlay.open').forEach(o => o.classList.remove('open'));
    });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

})();
