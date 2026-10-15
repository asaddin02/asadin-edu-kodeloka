/* ==========================================================================
   PROMETHEUS — BAGIAN A (Fondasi, Instalasi, Tipe Metrik, Instrumentasi)
   ========================================================================== */

const PROM_MOD_A = [

/* ---------------------------------------------------------------- 1 ----- */
{
    id: 1,
    cat: '1 · Fondasi',
    title: 'Konsep Prometheus: Model Pull, Time Series & Label',
    level: 'Dasar', dur: '15 mnt',
    tags: ['konsep', 'pull', 'time series', 'label', 'tsdb', 'arsitektur'],
    desc: 'Memahami cara Prometheus menyimpan data, kenapa memakai model pull, dan apa yang sebenarnya dimaksud "satu metrik".',
    theory: `
<h2>Masalah yang Diselesaikan Prometheus</h2>
<p>Ketika sistem Anda hanya satu server, <code>htop</code> sudah cukup. Ketika menjadi 40 container yang datang dan pergi otomatis, Anda butuh sesuatu yang: mengumpulkan angka dari semua tempat, menyimpannya berurut waktu, dan bisa ditanyai <em>"apa yang terjadi pada pukul 14:32 kemarin?"</em>.</p>
<p><strong>Prometheus</strong> adalah sistem monitoring dan basis data time-series yang lahir di SoundCloud (2012), kini menjadi proyek CNCF dan standar de facto untuk monitoring infrastruktur modern — terutama di ekosistem Kubernetes.</p>

<h3>Anatomi Satu Time Series</h3>
<p>Ini konsep paling mendasar. Satu <strong>time series</strong> di Prometheus adalah kombinasi unik dari nama metrik dan seluruh labelnya.</p>
<pre data-lang="promql" data-file="satu deret waktu">http_requests_total{method="POST", handler="/api/pesanan", status="200", instance="10.0.0.5:8080", job="api"}
 └────── nama metrik ──────┘└─────────────────── label ───────────────────┘

  Nilai:  1523 @ 14:30:00
          1547 @ 14:30:15
          1571 @ 14:30:30   ← counter, terus naik</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Setiap kombinasi label unik = satu time series baru</div>
    <p>Bila <code>handler</code> punya 20 nilai, <code>method</code> 5 nilai, <code>status</code> 8 nilai, dan Anda punya 30 instance, maka dari <strong>satu</strong> nama metrik lahir 20 × 5 × 8 × 30 = <strong>24.000 time series</strong>.</p>
    <p>Tambahkan satu label <code>user_id</code> dengan 100.000 nilai, dan angkanya menjadi 2,4 miliar — Prometheus Anda akan mati. Fenomena ini disebut <strong>cardinality explosion</strong>, dan merupakan penyebab nomor satu kegagalan Prometheus di produksi.</p>
</div>

<h3>Model Pull, Bukan Push</h3>
<p>Prometheus <strong>mendatangi</strong> aplikasi Anda dan membaca endpoint <code>/metrics</code> secara berkala (default tiap 15 detik). Aplikasi tidak mengirim apa pun.</p>

<table>
<thead><tr><th>Aspek</th><th>Pull (Prometheus)</th><th>Push (StatsD, Graphite)</th></tr></thead>
<tbody>
<tr><td>Siapa yang inisiatif</td><td>Server monitoring</td><td>Aplikasi</td></tr>
<tr><td>Deteksi target mati</td><td>Otomatis — metrik <code>up=0</code></td><td>Sulit: diam bisa berarti mati <em>atau</em> memang idle</td></tr>
<tr><td>Konfigurasi</td><td>Terpusat di Prometheus</td><td>Tersebar di setiap aplikasi</td></tr>
<tr><td>Uji manual</td><td>Cukup <code>curl /metrics</code></td><td>Harus menunggu aplikasi mengirim</td></tr>
<tr><td>Job berumur pendek</td><td><strong>Sulit</strong> — butuh Pushgateway</td><td>Mudah</td></tr>
<tr><td>Melalui NAT/firewall</td><td>Sulit — Prometheus harus bisa menjangkau target</td><td>Mudah</td></tr>
</tbody>
</table>

<div class="callout callout-tip">
    <div class="callout-title">💡 Keuntungan pull yang sering diremehkan</div>
    <p>Karena Prometheus yang mendatangi, ia otomatis tahu <strong>daftar lengkap</strong> yang seharusnya ada. Bila sebuah instance tidak merespons, metrik <code>up</code> untuk instance itu bernilai <code>0</code> — dan Anda bisa langsung membuat alert dari situ. Pada sistem push, aplikasi yang mati hanya berhenti mengirim, dan diam itu ambigu.</p>
</div>

<h3>Arsitektur Ekosistem</h3>
<pre data-lang="text" data-file="arsitektur">┌──────────────┐  scrape   ┌──────────────────┐
│ Aplikasi     │◀──────────│                  │
│ /metrics     │           │                  │   ┌─────────────┐
└──────────────┘           │   PROMETHEUS     │──▶│  Grafana    │
┌──────────────┐  scrape   │                  │   │ (visualisasi)│
│ node_exporter│◀──────────│  - scrape        │   └─────────────┘
│ :9100        │           │  - TSDB lokal    │
└──────────────┘           │  - PromQL        │   ┌─────────────┐
┌──────────────┐  scrape   │  - rule eval     │──▶│Alertmanager │
│ postgres_exp │◀──────────│                  │   │ (notifikasi)│
│ :9187        │           └──────────────────┘   └──────┬──────┘
└──────────────┘                    │                    │
                                    │ remote_write       ▼
                                    ▼              Slack / Email
                          Thanos / Mimir / Cortex   PagerDuty / WA
                          (penyimpanan jangka panjang)</pre>

<h3>Format Teks Exposition</h3>
<p>Endpoint <code>/metrics</code> hanyalah teks biasa. Anda bisa membacanya dengan <code>curl</code>.</p>
<pre data-lang="text" data-file="GET /metrics"># HELP http_requests_total Jumlah total request HTTP yang diterima.
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200"} 18493
http_requests_total{method="POST",status="201"} 2841
http_requests_total{method="POST",status="500"} 17

# HELP process_resident_memory_bytes Memori residen proses dalam byte.
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes 8.4152e+07</pre>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ Prometheus BUKAN untuk semua hal</div>
    <ul>
        <li><strong>Bukan untuk logging.</strong> Gunakan Loki, Elasticsearch, atau OpenSearch.</li>
        <li><strong>Bukan untuk tracing.</strong> Gunakan Tempo, Jaeger, atau Zipkin.</li>
        <li><strong>Bukan untuk data yang harus 100% akurat</strong> seperti penagihan. Prometheus mengambil sampel berkala dan bisa kehilangan data saat scrape gagal — ia dirancang untuk <em>keandalan operasional</em>, bukan akuntansi.</li>
        <li><strong>Bukan untuk event individual.</strong> Prometheus menyimpan agregat, bukan "request nomor 12345 dari user Budi".</li>
    </ul>
</div>
`,
    lab: {
        intro: `
<h3>Praktik: Membaca Endpoint Metrik Secara Langsung</h3>
<p>Sebelum memasang Prometheus, pahami dulu apa yang dibacanya. Endpoint <code>/metrics</code> adalah teks biasa — coba baca dengan <code>curl</code>.</p>`,
        files: [{
            name: 'contoh-metrics.txt', lang: 'text', code: `# HELP up Apakah target berhasil di-scrape (1 = ya, 0 = tidak)
# TYPE up gauge
up{job="api",instance="10.0.0.5:8080"} 1
up{job="api",instance="10.0.0.6:8080"} 0

# HELP http_request_duration_seconds Durasi request HTTP.
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.05"} 1204
http_request_duration_seconds_bucket{le="0.1"}  1892
http_request_duration_seconds_bucket{le="0.25"} 2310
http_request_duration_seconds_bucket{le="0.5"}  2401
http_request_duration_seconds_bucket{le="1"}    2440
http_request_duration_seconds_bucket{le="+Inf"} 2451
http_request_duration_seconds_sum   412.83
http_request_duration_seconds_count 2451

# HELP node_memory_MemAvailable_bytes Memori yang tersedia.
# TYPE node_memory_MemAvailable_bytes gauge
node_memory_MemAvailable_bytes 3.221225472e+09` }],
        steps: [
            { note: 'Baca endpoint metrik dari sebuah aplikasi', cmd: 'curl -s http://localhost:8080/metrics | head -40' },
            { note: 'Hitung berapa banyak time series yang diekspos (indikator awal kardinalitas)', cmd: 'curl -s http://localhost:8080/metrics | grep -v "^#" | wc -l', out: '148' },
            { note: 'Cari metrik dengan kardinalitas mencurigakan', cmd: 'curl -s http://localhost:8080/metrics | grep -v "^#" | cut -d"{" -f1 | sort | uniq -c | sort -rn | head' }
        ],
        snippets: ['promql up', 'promtool --version', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN memasukkan nilai tak terbatas sebagai label',
            body: `<p>Label seperti <code>user_id</code>, <code>request_id</code>, <code>email</code>, <code>session_id</code>, <code>trace_id</code>, atau URL lengkap dengan query string akan menciptakan jutaan time series. Prometheus akan kehabisan memori dan mati — dan biasanya baru ketahuan saat produksi sedang sibuk.</p>
<p><strong>Aturan praktis:</strong> sebuah label layak dipakai bila jumlah nilai uniknya <strong>di bawah ± 100</strong> dan tidak akan bertambah seiring jumlah pengguna.</p>
<pre data-lang="text">❌ http_requests_total{path="/api/user/48213"}
✅ http_requests_total{path="/api/user/:id"}</pre>`
        },
        {
            kind: 'salah', title: 'Mengira Prometheus cocok untuk data penagihan',
            body: `<p>Prometheus mengambil <em>sampel</em> setiap 15 detik dan <strong>tidak menjamin</strong> tidak ada data yang hilang: scrape bisa gagal, target bisa restart, retensi bisa habis. Untuk data yang butuh akurasi mutlak — jumlah transaksi untuk invoice, kuota berbayar, audit trail — gunakan basis data transaksional.</p>
<p>Prometheus dirancang untuk menjawab "apakah sistem sehat sekarang", bukan "berapa persisnya yang harus ditagih bulan ini".</p>`
        },
        {
            kind: 'best', title: 'Pakai konvensi penamaan resmi sejak awal',
            body: `<p>Nama metrik yang konsisten membuat PromQL bisa ditulis orang lain tanpa bertanya.</p>
<ul>
<li>Format: <code>&lt;namespace&gt;_&lt;subsistem&gt;_&lt;nama&gt;_&lt;satuan&gt;</code>.</li>
<li>Counter <strong>wajib</strong> berakhiran <code>_total</code>.</li>
<li>Satuan selalu <strong>dasar</strong>: detik (bukan milidetik), byte (bukan megabyte).</li>
<li>Gunakan huruf kecil dan garis bawah.</li>
</ul>
<pre data-lang="text">✅ http_request_duration_seconds
✅ api_pesanan_dibuat_total
✅ node_memory_MemAvailable_bytes
❌ httpRequestTimeMs
❌ jumlah-pesanan</pre>`
        },
        {
            kind: 'kasus', title: 'Kapan Anda tetap butuh Pushgateway',
            body: `<p>Model pull tidak cocok untuk <strong>batch job berumur pendek</strong> — cron job yang hidup 20 detik tidak akan sempat di-scrape.</p>
<p><strong>Pushgateway</strong> adalah perantara: job mendorong metriknya ke sana, lalu Prometheus men-scrape Pushgateway. Tetapi gunakan hanya untuk kasus ini, karena:</p>
<ul>
<li>Pushgateway <strong>tidak menghapus</strong> metrik lama — nilai basi bertahan selamanya sampai dihapus manual.</li>
<li>Ia menjadi <em>single point of failure</em>.</li>
<li>Metrik <code>up</code> menjadi tidak bermakna (yang di-scrape adalah Pushgateway, bukan job Anda).</li>
</ul>`
        }
    ],
    quiz: [
        {
            q: 'Aplikasi Anda punya metrik <code>http_requests_total</code> dengan label <code>method</code> (5 nilai), <code>status</code> (6 nilai), dan <code>endpoint</code> (30 nilai), berjalan di 10 instance. Berapa time series yang dihasilkan?',
            opts: ['51', '900', '9.000', '1 saja'],
            a: 2,
            exp: 'Setiap kombinasi label unik adalah satu time series: 5 × 6 × 30 × 10 = <strong>9.000</strong>. Inilah sebabnya menambahkan satu label berkardinalitas tinggi (misalnya <code>user_id</code>) bisa langsung meledakkan Prometheus.'
        },
        {
            q: 'Apa keunggulan utama model pull dibanding push untuk monitoring?',
            opts: [
                'Lebih hemat bandwidth',
                'Prometheus otomatis tahu bila target mati, lewat metrik <code>up=0</code>',
                'Tidak butuh konfigurasi sama sekali',
                'Bisa menembus firewall dengan mudah'
            ],
            a: 1,
            exp: 'Karena Prometheus memegang daftar target yang seharusnya ada, ia bisa membedakan "aplikasi diam karena idle" dan "aplikasi mati". Pada model push, keduanya sama-sama berarti tidak ada data masuk.'
        },
        {
            q: 'Manakah yang <strong>tidak</strong> cocok dikerjakan Prometheus?',
            opts: [
                'Memantau penggunaan CPU dan memori server',
                'Menyimpan log aplikasi untuk dicari berdasarkan kata kunci',
                'Menghitung error rate per endpoint',
                'Memicu alert saat disk hampir penuh'
            ],
            a: 1,
            exp: 'Prometheus adalah basis data <em>time series numerik</em>, bukan penyimpan log. Untuk log gunakan Loki atau Elasticsearch; untuk tracing gunakan Tempo atau Jaeger. Ketiganya saling melengkapi, bukan saling menggantikan.'
        }
    ]
},

/* ---------------------------------------------------------------- 2 ----- */
{
    id: 2,
    cat: '1 · Fondasi',
    title: 'Instalasi Prometheus: Docker, Binary, systemd & Windows',
    level: 'Dasar', dur: '18 mnt',
    tags: ['instalasi', 'install', 'docker', 'systemd', 'konfigurasi', 'setup'],
    desc: 'Memasang Prometheus dari nol sampai berhasil men-scrape target pertama, dengan konfigurasi yang aman untuk produksi.',
    theory: `
<h2>Yang Berubah di Prometheus 3.x</h2>
<p>Prometheus 3.0 adalah rilis mayor pertama setelah tujuh tahun di jalur 2.x. Materi ini memakai <strong>3.x</strong> sebagai acuan. Bila Anda mengikuti tutorial lama berbasis 2.x, ini yang perlu Anda tahu:</p>
<table>
<thead><tr><th>Perubahan</th><th>Dampak praktis</th></tr></thead>
<tbody>
<tr><td><strong>UI web baru</strong></td><td>Tampilan query &amp; target ditulis ulang. UI lama masih bisa dipanggil sementara lewat flag, tetapi akan dihapus.</td></tr>
<tr><td><strong>Nama label &amp; metrik boleh UTF-8</strong></td><td>Karakter di luar <code>[a-zA-Z0-9_]</code> kini legal. Dalam PromQL, nama seperti itu ditulis dengan tanda kutip: <code>{"http.status.code"="200"}</code>. Ini mempermulus interoperabilitas dengan OpenTelemetry.</td></tr>
<tr><td><strong>Endpoint ingest OTLP</strong></td><td>Prometheus bisa <em>menerima</em> kiriman metrik OpenTelemetry lewat <code>/api/v1/otlp/v1/metrics</code> — bukan hanya menarik (pull). Harus diaktifkan eksplisit lewat <code>--web.enable-otlp-receiver</code>.</td></tr>
<tr><td><strong>Remote Write 2.0</strong></td><td>Format wire baru yang lebih hemat dan membawa metadata sekaligus, penting untuk pengiriman ke Mimir/Thanos/Cortex.</td></tr>
<tr><td><strong>Native histogram</strong></td><td>Keluar dari status eksperimental awal dan makin matang — resolusi jauh lebih tinggi daripada histogram klasik berbasis bucket tetap.</td></tr>
<tr><td><strong>Rentang <code>range</code> kini eksklusif di batas kiri</strong></td><td>Perubahan halus tapi nyata pada semantik query rentang. Periksa ulang recording rule yang sensitif terhadap batas waktu setelah upgrade.</td></tr>
</tbody>
</table>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Sudah tidak berlaku lagi</div>
    <ul>
        <li>Flag lama <code>--storage.tsdb.retention</code> (tanpa <code>.time</code>) sudah dihapus. Gunakan <code>--storage.tsdb.retention.time</code>.</li>
        <li>Dukungan <strong>PromQL <code>@</code> dan subquery eksperimental</strong> serta beberapa feature flag 2.x kini menjadi perilaku default — hapus flag tersebut dari unit systemd Anda saat upgrade, karena flag yang tak dikenal membuat Prometheus gagal start.</li>
        <li><strong>Protokol remote read v1 lama</strong> serta beberapa mekanisme service discovery usang telah dibuang.</li>
    </ul>
</div>

<h2>Pilih Cara Instalasi Sesuai Kebutuhan</h2>
<table>
<thead><tr><th>Cara</th><th>Cocok untuk</th><th>Catatan</th></tr></thead>
<tbody>
<tr><td>Docker Compose</td><td>Belajar &amp; lingkungan dev</td><td>Tercepat, mudah dibuang</td></tr>
<tr><td>Binary + systemd</td><td>Server produksi (VM)</td><td>Kontrol penuh, perlu setup manual</td></tr>
<tr><td>Helm chart <code>kube-prometheus-stack</code></td><td>Kubernetes</td><td>Standar industri, sekaligus Grafana &amp; Alertmanager</td></tr>
<tr><td>Paket OS (<code>apt install prometheus</code>)</td><td>—</td><td><strong>Hindari</strong>: versinya biasanya sangat tertinggal</td></tr>
</tbody>
</table>

<h3>1. Docker Compose (paling cepat untuk belajar)</h3>
<pre data-lang="yaml" data-file="docker-compose.yml">services:
  prometheus:
    image: prom/prometheus:v3.5.0
    container_name: prometheus
    ports: ["9090:9090"]
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.path=/prometheus
      - --storage.tsdb.retention.time=30d
      - --storage.tsdb.retention.size=20GB
      - --web.enable-lifecycle          # izinkan reload lewat HTTP POST
      - --web.enable-remote-write-receiver
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./rules:/etc/prometheus/rules:ro
      - prom-data:/prometheus           # WAJIB: tanpa ini data hilang saat restart
    restart: unless-stopped

  node-exporter:
    image: prom/node-exporter:v1.8.2
    container_name: node-exporter
    ports: ["9100:9100"]
    pid: host
    volumes: ["/:/host:ro,rslave"]
    command: ["--path.rootfs=/host"]
    restart: unless-stopped

volumes:
  prom-data:</pre>

<h3>2. Konfigurasi Minimum yang Benar</h3>
<pre data-lang="yaml" data-file="prometheus.yml">global:
  scrape_interval:     15s    # seberapa sering mengambil metrik
  evaluation_interval: 15s    # seberapa sering rule dievaluasi
  scrape_timeout:      10s    # HARUS lebih kecil dari scrape_interval
  external_labels:
    cluster: produksi-jkt     # penting saat ada beberapa Prometheus
    replica: prom-01

rule_files:
  - /etc/prometheus/rules/*.yml

alerting:
  alertmanagers:
    - static_configs:
        - targets: ["alertmanager:9093"]

scrape_configs:
  # Prometheus memantau dirinya sendiri
  - job_name: prometheus
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: node
    static_configs:
      - targets: ["node-exporter:9100"]
        labels:
          lingkungan: produksi

  - job_name: api
    metrics_path: /metrics       # default sudah /metrics
    scheme: http
    static_configs:
      - targets: ["api-1:8080", "api-2:8080"]</pre>

<h3>3. Binary + systemd (produksi di VM)</h3>
<pre data-lang="bash" data-file="Terminal"># Unduh (sesuaikan versi terbaru dari prometheus.io/download)
VERSI=3.1.0
curl -LO https://github.com/prometheus/prometheus/releases/download/v\${VERSI}/prometheus-\${VERSI}.linux-amd64.tar.gz
tar xzf prometheus-\${VERSI}.linux-amd64.tar.gz
cd prometheus-\${VERSI}.linux-amd64

# Pengguna khusus tanpa shell — jangan jalankan sebagai root
sudo useradd --no-create-home --shell /bin/false prometheus
sudo mkdir -p /etc/prometheus /var/lib/prometheus
sudo cp prometheus promtool /usr/local/bin/
sudo cp prometheus.yml /etc/prometheus/
sudo chown -R prometheus:prometheus /etc/prometheus /var/lib/prometheus</pre>

<pre data-lang="ini" data-file="/etc/systemd/system/prometheus.service">[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
Restart=on-failure
RestartSec=5s
ExecStart=/usr/local/bin/prometheus \\
  --config.file=/etc/prometheus/prometheus.yml \\
  --storage.tsdb.path=/var/lib/prometheus/ \\
  --storage.tsdb.retention.time=30d \\
  --web.console.templates=/etc/prometheus/consoles \\
  --web.console.libraries=/etc/prometheus/console_libraries \\
  --web.listen-address=0.0.0.0:9090 \\
  --web.enable-lifecycle
ExecReload=/bin/kill -HUP $MAINPID

# Pengetatan keamanan
NoNewPrivileges=true
ProtectHome=true
ProtectSystem=full
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target</pre>

<pre data-lang="bash" data-file="Terminal">sudo systemctl daemon-reload
sudo systemctl enable --now prometheus
sudo systemctl status prometheus
sudo journalctl -u prometheus -f</pre>

<h3>4. Windows</h3>
<p>Unduh <code>prometheus-*.windows-amd64.zip</code> dari halaman rilis, ekstrak, lalu jalankan <code>prometheus.exe --config.file=prometheus.yml</code>. Untuk menjalankannya sebagai service Windows, gunakan <a href="https://nssm.cc">NSSM</a> atau WinSW. Sebagai exporter metrik sistem, pakai <code>windows_exporter</code> (bukan <code>node_exporter</code>).</p>

<h3>5. Verifikasi Instalasi</h3>
<pre data-lang="bash" data-file="Terminal"># 1. Validasi konfigurasi SEBELUM reload — wajib
promtool check config prometheus.yml

# 2. Muat ulang konfigurasi tanpa restart (butuh --web.enable-lifecycle)
curl -X POST http://localhost:9090/-/reload

# 3. Cek kesehatan
curl http://localhost:9090/-/healthy
curl http://localhost:9090/-/ready

# 4. Lihat target yang sedang di-scrape
curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | {job:.labels.job, health:.health, lastError:.lastError}'</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Kesalahan instalasi yang paling sering &amp; paling mahal</div>
    <ul>
        <li><strong>Lupa volume untuk data.</strong> Tanpa <code>prom-data:/prometheus</code>, seluruh riwayat metrik hilang setiap container di-restart.</li>
        <li><strong>Membiarkan port 9090 terbuka ke internet.</strong> Prometheus <strong>tidak punya autentikasi bawaan</strong>. Siapa pun yang bisa mengaksesnya bisa membaca seluruh metrik infrastruktur Anda — termasuk topologi, versi software, dan pola trafik. Lindungi dengan reverse proxy, firewall, atau VPN.</li>
        <li><strong><code>scrape_timeout</code> lebih besar dari <code>scrape_interval</code>.</strong> Prometheus akan menolak konfigurasi ini.</li>
        <li><strong>Reload tanpa validasi.</strong> Konfigurasi yang salah membuat reload gagal diam-diam, dan Anda mengira perubahannya sudah aktif.</li>
    </ul>
</div>
`,
    lab: {
        intro: `
<h3>Praktik: Stack Prometheus Lengkap dalam 5 Menit</h3>
<p>Berkas berikut membangun Prometheus + node_exporter + Alertmanager + Grafana sekaligus. Setelah <code>docker compose up -d</code>, buka <code>http://localhost:9090/targets</code> dan pastikan semua target berstatus <strong>UP</strong>.</p>`,
        files: [
            {
                name: 'docker-compose.yml', lang: 'yaml', code: `services:
  prometheus:
    image: prom/prometheus:v3.5.0
    container_name: prometheus
    ports: ["9090:9090"]
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.path=/prometheus
      - --storage.tsdb.retention.time=30d
      - --web.enable-lifecycle
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./rules:/etc/prometheus/rules:ro
      - prom-data:/prometheus
    restart: unless-stopped

  alertmanager:
    image: prom/alertmanager:v0.28.0
    container_name: alertmanager
    ports: ["9093:9093"]
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro
    restart: unless-stopped

  node-exporter:
    image: prom/node-exporter:v1.8.2
    container_name: node-exporter
    ports: ["9100:9100"]
    pid: host
    volumes: ["/:/host:ro,rslave"]
    command: ["--path.rootfs=/host"]
    restart: unless-stopped

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:v0.49.1
    container_name: cadvisor
    ports: ["8081:8080"]
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    restart: unless-stopped

  grafana:
    image: grafana/grafana:12.0.0
    container_name: grafana
    ports: ["3000:3000"]
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana-data:/var/lib/grafana
    depends_on: [prometheus]
    restart: unless-stopped

volumes:
  prom-data:
  grafana-data:`
            },
            {
                name: 'prometheus.yml', lang: 'yaml', code: `global:
  scrape_interval:     15s
  evaluation_interval: 15s
  scrape_timeout:      10s
  external_labels:
    cluster: lokal
    replica: prom-01

rule_files:
  - /etc/prometheus/rules/*.yml

alerting:
  alertmanagers:
    - static_configs:
        - targets: ["alertmanager:9093"]

scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: node
    static_configs:
      - targets: ["node-exporter:9100"]
        labels:
          lingkungan: lokal

  - job_name: cadvisor
    static_configs:
      - targets: ["cadvisor:8080"]

  # Contoh target aplikasi Anda sendiri
  - job_name: api
    scrape_interval: 10s        # boleh berbeda per job
    static_configs:
      - targets: ["host.docker.internal:8080"]`
            },
            {
                name: 'rules/dasar.yml', lang: 'yaml', code: `groups:
  - name: kesehatan-dasar
    interval: 30s
    rules:
      - alert: TargetMati
        expr: up == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Target {{ $labels.job }} pada {{ $labels.instance }} tidak merespons"
          description: "Prometheus gagal men-scrape selama lebih dari 2 menit."

      - alert: CPUTinggi
        expr: |
          100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 85
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "CPU {{ $labels.instance }} di atas 85%"
          description: "Nilai saat ini {{ $value | printf \\"%.1f\\" }}%."

      - alert: DiskHampirPenuh
        expr: |
          (node_filesystem_avail_bytes{fstype!~"tmpfs|overlay"}
           / node_filesystem_size_bytes{fstype!~"tmpfs|overlay"}) * 100 < 15
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Sisa disk {{ $labels.instance }} ({{ $labels.mountpoint }}) < 15%"` }
        ],
        steps: [
            { note: 'Siapkan folder & nyalakan stack', cmd: 'mkdir -p rules\ndocker compose up -d\ndocker compose ps' },
            { note: 'WAJIB: validasi konfigurasi sebelum dipercaya', cmd: 'docker compose exec prometheus promtool check config /etc/prometheus/prometheus.yml', out: 'Checking /etc/prometheus/prometheus.yml\n SUCCESS: 1 rule files found\n\nChecking /etc/prometheus/rules/dasar.yml\n SUCCESS: 3 rules found' },
            { note: 'Pastikan semua target UP', cmd: 'curl -s http://localhost:9090/api/v1/targets | jq -r \'.data.activeTargets[] | "\\(.labels.job)\\t\\(.health)\\t\\(.lastError)"\'', out: 'prometheus\tup\t\nnode\tup\t\ncadvisor\tup\t' },
            { note: 'Query pertama Anda lewat API', cmd: 'curl -s \'http://localhost:9090/api/v1/query?query=up\' | jq \'.data.result\'' },
            { note: 'Muat ulang konfigurasi tanpa restart', cmd: 'curl -X POST http://localhost:9090/-/reload && echo "reload OK"' },
            { note: 'Bersihkan bila sudah selesai belajar', cmd: 'docker compose down -v' }
        ],
        snippets: ['promtool check config prometheus.yml', 'promql up', 'targets', 'curl -X POST http://localhost:9090/-/reload']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'Jangan pernah ekspos port 9090 ke internet publik',
            body: `<p>Prometheus <strong>tidak memiliki autentikasi maupun otorisasi bawaan</strong>. Siapa pun yang bisa membuka <code>http://ip-anda:9090</code> dapat:</p>
<ul>
<li>Membaca seluruh metrik infrastruktur Anda — jumlah server, versi software, pola trafik, nama layanan internal.</li>
<li>Menjalankan query mahal yang membuat Prometheus kehabisan memori (bentuk serangan DoS).</li>
<li>Bila <code>--web.enable-admin-api</code> aktif: <strong>menghapus seluruh data time series Anda</strong>.</li>
</ul>
<p><strong>Lindungi dengan:</strong> firewall/security group, reverse proxy dengan basic auth atau OAuth2 proxy, atau letakkan di jaringan privat/VPN. Jangan pernah mengandalkan "orang tidak akan tahu portnya".</p>`
        },
        {
            kind: 'salah', title: 'Data hilang setiap kali container di-restart',
            body: `<p>Penyebabnya selalu sama: tidak ada named volume yang dipetakan ke <code>/prometheus</code>. Container Docker bersifat sementara — apa pun yang ditulis di dalamnya lenyap saat container dibuat ulang.</p>
<pre data-lang="yaml">volumes:
  - prom-data:/prometheus    # WAJIB ada</pre>
<p>Verifikasi dengan <code>docker volume ls</code> dan pastikan volume-nya benar-benar terbuat.</p>`
        },
        {
            kind: 'salah', title: 'Reload gagal diam-diam karena konfigurasi salah',
            body: `<p><code>curl -X POST /-/reload</code> akan mengembalikan error bila konfigurasi tidak valid, tetapi <strong>Prometheus tetap berjalan dengan konfigurasi lama</strong>. Bila Anda tidak memeriksa responsnya, Anda akan mengira perubahan sudah aktif padahal tidak.</p>
<p>Biasakan alur ini: <code>promtool check config</code> → <code>curl -X POST /-/reload</code> → periksa <code>/targets</code> di browser untuk memastikan target baru benar-benar muncul.</p>`
        },
        {
            kind: 'best', title: 'Selalu isi `external_labels`',
            body: `<p>Saat Anda punya lebih dari satu Prometheus (multi-cluster, multi-region, atau HA berpasangan), <code>external_labels</code> seperti <code>cluster</code> dan <code>replica</code> menjadi satu-satunya cara membedakan asal data setelah digabungkan di Thanos/Mimir atau federation.</p>
<p>Menambahkannya belakangan itu menyakitkan karena data lama tidak punya label tersebut. Isi sejak hari pertama.</p>`
        }
    ],
    quiz: [
        {
            q: 'Setelah <code>docker compose restart prometheus</code>, seluruh grafik historis kosong. Apa penyebabnya?',
            opts: [
                'Retensi terlalu pendek',
                'Tidak ada volume yang dipetakan ke <code>/prometheus</code> sehingga data ikut terhapus',
                'scrape_interval terlalu besar',
                'Konfigurasi rule salah'
            ],
            a: 1,
            exp: 'Filesystem container bersifat sementara. Tanpa named volume di <code>/prometheus</code>, seluruh TSDB hilang setiap container dibuat ulang. Ini kesalahan instalasi paling umum dan paling menyakitkan.'
        },
        {
            q: 'Kenapa <code>scrape_timeout</code> harus lebih kecil dari <code>scrape_interval</code>?',
            opts: [
                'Agar konfigurasi lebih rapi',
                'Karena scrape berikutnya akan dimulai sebelum yang sebelumnya selesai — Prometheus menolak konfigurasi ini',
                'Agar hemat bandwidth',
                'Tidak ada alasan teknis'
            ],
            a: 1,
            exp: 'Bila timeout melebihi interval, scrape akan saling tumpang tindih tanpa akhir. Prometheus memvalidasi hal ini saat memuat konfigurasi dan akan menolak berjalan.'
        },
        {
            q: 'Perintah apa yang wajib dijalankan sebelum me-reload konfigurasi Prometheus?',
            opts: [
                '<code>systemctl restart prometheus</code>',
                '<code>promtool check config prometheus.yml</code>',
                '<code>docker compose down</code>',
                '<code>curl /-/healthy</code>'
            ],
            a: 1,
            exp: '<code>promtool check config</code> memvalidasi sintaks dan struktur konfigurasi beserta seluruh berkas rule. Tanpa ini, reload bisa gagal dan Prometheus terus berjalan dengan konfigurasi lama tanpa Anda sadari.'
        }
    ]
},

/* ---------------------------------------------------------------- 3 ----- */
{
    id: 3,
    cat: '2 · Metrik & Instrumentasi',
    title: 'Empat Tipe Metrik: Counter, Gauge, Histogram, Summary',
    level: 'Dasar', dur: '18 mnt',
    tags: ['counter', 'gauge', 'histogram', 'summary', 'tipe metrik', 'bucket'],
    desc: 'Memilih tipe metrik yang tepat, memahami cara kerja histogram, dan menghindari kesalahan yang membuat data tidak bisa dianalisis.',
    theory: `
<h2>Salah Pilih Tipe = Data Tidak Bisa Diselamatkan</h2>
<p>Tipe metrik menentukan operasi PromQL apa yang masuk akal. Memilih Gauge padahal seharusnya Counter berarti Anda kehilangan kemampuan menghitung laju — selamanya, untuk data yang sudah terlanjur tersimpan.</p>

<h3>1. Counter — Angka yang Hanya Naik</h3>
<p>Untuk menghitung <strong>kejadian</strong>: jumlah request, jumlah error, jumlah byte terkirim, jumlah pesanan.</p>
<pre data-lang="promql" data-file="counter">http_requests_total{status="200"}  1523 → 1547 → 1571 → 0 → 24
                                                            ↑ restart aplikasi</pre>
<div class="callout callout-warn">
    <div class="callout-title">⚠️ Nilai mentah Counter hampir tidak pernah berguna</div>
    <p>Grafik <code>http_requests_total</code> hanya akan menampilkan garis naik terus. Yang bermakna adalah <strong>lajunya</strong>:</p>
    <pre data-lang="promql">rate(http_requests_total[5m])    # request per detik, rata-rata 5 menit terakhir</pre>
    <p>Fungsi <code>rate()</code> juga otomatis menangani <em>counter reset</em> saat aplikasi restart — inilah alasan kenapa memakai tipe Counter itu penting.</p>
</div>

<h3>2. Gauge — Angka yang Bisa Naik dan Turun</h3>
<p>Untuk <strong>keadaan saat ini</strong>: penggunaan memori, jumlah koneksi aktif, suhu, panjang antrean, jumlah pod berjalan.</p>
<pre data-lang="promql" data-file="gauge">node_memory_MemAvailable_bytes  3.2e9 → 2.8e9 → 3.5e9 → 1.1e9

# Operasi yang masuk akal untuk gauge:
avg_over_time(node_memory_MemAvailable_bytes[1h])
max_over_time(node_memory_MemAvailable_bytes[24h])
delta(node_memory_MemAvailable_bytes[1h])       # perubahan dalam 1 jam
predict_linear(node_filesystem_avail_bytes[6h], 4*3600)   # prediksi 4 jam ke depan</pre>

<h3>3. Histogram — Distribusi Nilai</h3>
<p>Untuk mengukur <strong>sebaran</strong>: durasi request, ukuran payload. Histogram adalah cara Prometheus menjawab "berapa p95 latency?".</p>
<p>Satu histogram menghasilkan <strong>tiga jenis time series</strong>:</p>
<pre data-lang="text" data-file="/metrics">http_request_duration_seconds_bucket{le="0.1"}   1892   ← kumulatif: ≤ 0,1 detik
http_request_duration_seconds_bucket{le="0.5"}   2401   ← kumulatif: ≤ 0,5 detik
http_request_duration_seconds_bucket{le="+Inf"}  2451   ← semua
http_request_duration_seconds_sum                412.83 ← total detik
http_request_duration_seconds_count              2451   ← jumlah observasi</pre>

<pre data-lang="promql" data-file="menghitung persentil"># p95 latency dari histogram
histogram_quantile(0.95,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
)

# rata-rata latency (sum dibagi count)
rate(http_request_duration_seconds_sum[5m])
  /
rate(http_request_duration_seconds_count[5m])</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Bucket histogram menentukan akurasi — dan tidak bisa diubah surut</div>
    <p>Bucket default klien Prometheus (<code>.005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5, 10</code>) dirancang untuk API web yang cepat. Bila layanan Anda umumnya membalas dalam 3–8 detik, hampir semua observasi jatuh di bucket <code>5</code> dan <code>10</code>, sehingga <code>histogram_quantile</code> hanya bisa menebak kasar di antara keduanya.</p>
    <p><strong>Sesuaikan bucket dengan SLO Anda.</strong> Bila SLO adalah p95 &lt; 500 ms, pastikan ada bucket rapat di sekitar 0,5 detik. Data lama <strong>tidak bisa</strong> dihitung ulang dengan bucket baru.</p>
</div>

<h3>4. Summary — Persentil Dihitung di Sisi Klien</h3>
<pre data-lang="text" data-file="/metrics">rpc_duration_seconds{quantile="0.5"}   0.032
rpc_duration_seconds{quantile="0.9"}   0.121
rpc_duration_seconds{quantile="0.99"}  0.483
rpc_duration_seconds_sum               8231.4
rpc_duration_seconds_count             24193</pre>

<table>
<thead><tr><th>Aspek</th><th>Histogram</th><th>Summary</th></tr></thead>
<tbody>
<tr><td>Persentil dihitung di</td><td>Server (saat query)</td><td>Klien (saat observasi)</td></tr>
<tr><td>Bisa diagregasi antar-instance</td><td><strong>YA</strong></td><td><strong>TIDAK</strong></td></tr>
<tr><td>Beban CPU di aplikasi</td><td>Sangat ringan</td><td>Lebih berat</td></tr>
<tr><td>Fleksibilitas persentil</td><td>Bebas, kapan saja</td><td>Terkunci saat kompilasi</td></tr>
<tr><td>Akurasi</td><td>Tergantung bucket</td><td>Lebih akurat per instance</td></tr>
</tbody>
</table>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Persentil dari Summary TIDAK BOLEH dijumlahkan atau dirata-rata</div>
    <p>Rata-rata dari p95 sepuluh instance <strong>bukan</strong> p95 keseluruhan sistem. Secara matematis itu tidak bermakna. Bila Anda punya lebih dari satu instance dan butuh persentil global — dan itu hampir selalu terjadi — <strong>gunakan Histogram</strong>.</p>
</div>

<div class="callout callout-tip">
    <div class="callout-title">💡 Aturan memilih dalam 10 detik</div>
    <ul>
        <li>Menghitung kejadian yang tidak pernah berkurang → <strong>Counter</strong> (akhiri dengan <code>_total</code>).</li>
        <li>Nilai saat ini yang bisa naik-turun → <strong>Gauge</strong>.</li>
        <li>Butuh persentil atau distribusi → <strong>Histogram</strong>.</li>
        <li>Summary → hanya bila satu instance dan butuh akurasi tinggi. Umumnya, pilih Histogram.</li>
    </ul>
</div>
`,
    lab: {
        intro: `
<h3>Praktik: Membaca dan Menghitung dari Histogram</h3>
<p>Pahami dulu bentuk datanya, baru tulis query. Berikut contoh output histogram dan cara menghitung persentil darinya.</p>`,
        files: [{
            name: 'query-tipe-metrik.promql', lang: 'promql', code: `# ══ COUNTER ══════════════════════════════════════════════
# Laju request per detik, per endpoint
sum by (handler) (rate(http_requests_total[5m]))

# Error rate dalam persen (pola paling sering dipakai)
100 * sum(rate(http_requests_total{status=~"5.."}[5m]))
    / sum(rate(http_requests_total[5m]))

# Total request dalam 24 jam terakhir
sum(increase(http_requests_total[24h]))


# ══ GAUGE ════════════════════════════════════════════════
# Pemakaian memori dalam persen
100 * (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)

# Prediksi: apakah disk penuh dalam 4 jam ke depan?
predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 4*3600) < 0

# Nilai puncak dalam 24 jam
max_over_time(node_load1[24h])


# ══ HISTOGRAM ════════════════════════════════════════════
# p95 latency keseluruhan
histogram_quantile(0.95,
  sum by (le) (rate(http_request_duration_seconds_bucket[5m])))

# p95 per endpoint  (perhatikan: 'le' WAJIB ikut di by())
histogram_quantile(0.95,
  sum by (le, handler) (rate(http_request_duration_seconds_bucket[5m])))

# Rata-rata latency
rate(http_request_duration_seconds_sum[5m])
  / rate(http_request_duration_seconds_count[5m])

# Persentase request di bawah 300 ms  (ini SLI yang sesungguhnya)
sum(rate(http_request_duration_seconds_bucket{le="0.3"}[5m]))
  / sum(rate(http_request_duration_seconds_count[5m]))` }],
        steps: [
            { note: 'Lihat bentuk data histogram di endpoint metrik', cmd: 'curl -s http://localhost:8080/metrics | grep http_request_duration_seconds' },
            { note: 'Coba query p95 lewat simulator di bawah', cmd: 'promql histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))' },
            { note: 'Bandingkan dengan rata-rata — perhatikan bedanya', cmd: 'promql rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])' }
        ],
        snippets: [
            'promql rate(http_requests_total[5m])',
            'promql histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))',
            'promql up',
            'promql node_memory_MemAvailable_bytes'
        ]
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'Jangan merata-ratakan persentil dari Summary',
            body: `<p><code>avg(rpc_duration_seconds{quantile="0.95"})</code> menghasilkan angka yang <strong>tidak punya arti matematis</strong>. Rata-rata dari sepuluh p95 bukanlah p95 gabungan — bisa jauh lebih rendah dari kenyataan, sehingga Anda merasa aman padahal tidak.</p>
<p>Persentil hanya bisa dihitung ulang secara benar dari <strong>distribusi mentah</strong>, dan itulah yang disediakan Histogram lewat bucket-nya. Untuk sistem multi-instance, Histogram adalah satu-satunya pilihan yang benar.</p>`
        },
        {
            kind: 'salah', title: 'Lupa menyertakan `le` di dalam `by()`',
            body: `<p><code>histogram_quantile()</code> <strong>membutuhkan</strong> label <code>le</code> untuk bekerja. Bila Anda menulis <code>sum by (handler) (...)</code> tanpa <code>le</code>, hasilnya <code>NaN</code> atau kosong sama sekali.</p>
<pre data-lang="promql">❌ histogram_quantile(0.95, sum by (handler) (rate(...bucket[5m])))
✅ histogram_quantile(0.95, sum by (le, handler) (rate(...bucket[5m])))</pre>`
        },
        {
            kind: 'salah', title: 'Memakai Gauge untuk menghitung kejadian',
            body: `<p>Bila Anda mendefinisikan jumlah error sebagai Gauge lalu menaikkannya dengan <code>.set(nilai + 1)</code>, Anda kehilangan dua hal penting:</p>
<ul>
<li><code>rate()</code> tidak bisa dipakai dengan benar — hasilnya keliru saat aplikasi restart.</li>
<li>Prometheus tidak bisa mendeteksi <em>counter reset</em>, sehingga penurunan nilai dianggap perubahan nyata.</li>
</ul>
<p>Gunakan Counter dan akhiri namanya dengan <code>_total</code>. Ini bukan sekadar konvensi — ia memberi tahu pembaca dan tooling bahwa <code>rate()</code> adalah operasi yang tepat.</p>`
        },
        {
            kind: 'best', title: 'Sesuaikan bucket histogram dengan SLO, jangan pakai default',
            body: `<p>Tentukan bucket berdasarkan target Anda, dengan kerapatan di sekitar ambang SLO:</p>
<pre data-lang="python"># SLO: p95 < 500 ms  ->  bucket rapat di sekitar 0,5
buckets = [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1.0, 2.0, 5.0]</pre>
<p>Ingat: menambah bucket berarti menambah time series (satu bucket = satu series per kombinasi label). Jangan berlebihan — 8–15 bucket biasanya sudah memadai.</p>`
        },
        {
            kind: 'kasus', title: 'Native histogram: masa depan yang mulai bisa dipakai',
            body: `<p>Prometheus mendukung <strong>native histogram</strong> (eksperimental, aktifkan dengan <code>--enable-feature=native-histograms</code>): bucket dibuat otomatis dengan resolusi tinggi, tanpa perlu menentukan batas di awal, dan jauh lebih hemat time series.</p>
<p>Untuk sistem baru layak dipertimbangkan, tetapi periksa dulu dukungan pada client library dan Grafana yang Anda pakai. Untuk sistem yang sudah berjalan, histogram klasik masih menjadi pilihan paling aman.</p>`
        }
    ],
    quiz: [
        {
            q: 'Anda punya 12 instance API dan perlu melaporkan p99 latency untuk seluruh sistem. Tipe metrik apa yang harus dipakai?',
            opts: ['Summary, karena lebih akurat', 'Histogram, karena bucket-nya bisa diagregasi antar-instance', 'Gauge dengan nilai p99', 'Counter'],
            a: 1,
            exp: 'Persentil dari Summary dihitung di sisi klien per instance dan <strong>tidak bisa</strong> digabungkan secara matematis. Histogram menyimpan distribusi mentah dalam bucket, sehingga bucket dari semua instance bisa dijumlahkan lalu persentilnya dihitung ulang dengan benar.'
        },
        {
            q: 'Query <code>histogram_quantile(0.95, sum by (handler) (rate(http_request_duration_seconds_bucket[5m])))</code> mengembalikan hasil kosong. Kenapa?',
            opts: [
                'Rentang 5m terlalu pendek',
                'Label <code>le</code> tidak ikut disertakan di dalam <code>by()</code>',
                'Fungsi <code>rate</code> tidak boleh dipakai pada bucket',
                'Persentil 0.95 tidak valid'
            ],
            a: 1,
            exp: '<code>histogram_quantile()</code> bekerja dengan membaca label <code>le</code> (upper bound tiap bucket). Bila <code>le</code> hilang karena agregasi, fungsi ini kehilangan informasi yang dibutuhkan dan mengembalikan hasil kosong atau NaN.'
        },
        {
            q: 'Metrik <code>antrean_pesanan_menunggu</code> menunjukkan jumlah pesanan yang belum diproses saat ini. Tipe apa yang tepat?',
            opts: ['Counter', 'Gauge', 'Histogram', 'Summary'],
            a: 1,
            exp: 'Jumlah antrean bisa naik dan turun, sehingga <strong>Gauge</strong> adalah tipe yang tepat. Counter hanya untuk nilai yang tidak pernah berkurang; menggunakannya di sini akan membuat <code>rate()</code> memberi hasil yang salah.'
        }
    ]
},

/* ---------------------------------------------------------------- 4 ----- */
{
    id: 4,
    cat: '2 · Metrik & Instrumentasi',
    title: 'Instrumentasi Aplikasi: Go, Python, Node.js & Metode RED',
    level: 'Menengah', dur: '18 mnt',
    tags: ['instrumentasi', 'client library', 'go', 'python', 'nodejs', 'red', 'use'],
    desc: 'Menambahkan metrik ke aplikasi Anda sendiri dengan benar, dan memilih metrik apa yang benar-benar layak dipantau.',
    theory: `
<h2>Metrik Apa yang Layak Dibuat?</h2>
<p>Godaan terbesar saat instrumentasi adalah mengukur segalanya. Hasilnya: ribuan metrik yang tidak pernah dilihat, kardinalitas membengkak, dan tidak ada yang tahu metrik mana yang penting saat insiden terjadi.</p>
<p>Gunakan dua kerangka baku berikut sebagai titik awal.</p>

<h3>Metode RED — untuk Layanan (request-driven)</h3>
<table>
<thead><tr><th>Huruf</th><th>Arti</th><th>Metrik</th></tr></thead>
<tbody>
<tr><td><strong>R</strong>ate</td><td>Berapa request per detik</td><td><code>rate(http_requests_total[5m])</code></td></tr>
<tr><td><strong>E</strong>rrors</td><td>Berapa yang gagal</td><td><code>rate(http_requests_total{status=~"5.."}[5m])</code></td></tr>
<tr><td><strong>D</strong>uration</td><td>Berapa lama</td><td><code>histogram_quantile(0.95, ...)</code></td></tr>
</tbody>
</table>

<h3>Metode USE — untuk Sumber Daya (CPU, disk, memori)</h3>
<table>
<thead><tr><th>Huruf</th><th>Arti</th><th>Contoh</th></tr></thead>
<tbody>
<tr><td><strong>U</strong>tilization</td><td>Berapa persen terpakai</td><td>CPU 78%</td></tr>
<tr><td><strong>S</strong>aturation</td><td>Berapa banyak yang mengantre</td><td>Load average, panjang run queue</td></tr>
<tr><td><strong>E</strong>rrors</td><td>Berapa kegagalan</td><td>Disk I/O error, paket jaringan drop</td></tr>
</tbody>
</table>

<div class="callout callout-tip">
    <div class="callout-title">💡 Titik awal yang sudah cukup untuk 90% layanan</div>
    <p>Tiga metrik ini saja sudah bisa menjawab sebagian besar pertanyaan operasional:</p>
    <ul>
        <li><code>http_requests_total{method, route, status}</code> — Counter</li>
        <li><code>http_request_duration_seconds{method, route}</code> — Histogram</li>
        <li><code>http_requests_in_flight{route}</code> — Gauge</li>
    </ul>
    <p>Tambahkan metrik bisnis (<code>pesanan_dibuat_total</code>, <code>pembayaran_gagal_total</code>) setelah tiga di atas berjalan.</p>
</div>

<h3>Go</h3>
<pre data-lang="go" data-file="main.go">package main

import (
    "net/http"
    "time"
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promauto"
    "github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
    requestsTotal = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Jumlah total request HTTP.",
        },
        []string{"method", "route", "status"},   // label berkardinalitas RENDAH
    )

    requestDuration = promauto.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "http_request_duration_seconds",
            Help:    "Durasi request HTTP dalam detik.",
            Buckets: []float64{.05, .1, .2, .3, .5, .75, 1, 2, 5},  // sesuai SLO
        },
        []string{"method", "route"},
    )

    inFlight = promauto.NewGauge(prometheus.GaugeOpts{
        Name: "http_requests_in_flight",
        Help: "Jumlah request yang sedang diproses.",
    })
)

func instrumentasi(route string, next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        inFlight.Inc()
        defer inFlight.Dec()

        mulai := time.Now()
        rec := &statusRecorder{ResponseWriter: w, status: 200}
        next(rec, r)

        // PENTING: pakai 'route' (pola), bukan r.URL.Path (nilai sebenarnya)
        requestsTotal.WithLabelValues(r.Method, route, itoa(rec.status)).Inc()
        requestDuration.WithLabelValues(r.Method, route).Observe(time.Since(mulai).Seconds())
    }
}

func main() {
    http.Handle("/metrics", promhttp.Handler())
    http.HandleFunc("/api/pesanan", instrumentasi("/api/pesanan", handlerPesanan))
    http.ListenAndServe(":8080", nil)
}</pre>

<h3>Python (FastAPI / Flask)</h3>
<pre data-lang="python" data-file="app.py">from prometheus_client import Counter, Histogram, Gauge, make_asgi_app
from fastapi import FastAPI, Request
import time

REQUESTS = Counter(
    "http_requests_total", "Jumlah total request HTTP.",
    ["method", "route", "status"],
)
DURATION = Histogram(
    "http_request_duration_seconds", "Durasi request HTTP.",
    ["method", "route"],
    buckets=(.05, .1, .2, .3, .5, .75, 1, 2, 5),
)
IN_FLIGHT = Gauge("http_requests_in_flight", "Request yang sedang diproses.")

app = FastAPI()
app.mount("/metrics", make_asgi_app())     # endpoint /metrics

@app.middleware("http")
async def ukur(request: Request, call_next):
    # Pakai pola route, BUKAN path sebenarnya -> mencegah cardinality explosion
    route = request.scope.get("route").path if request.scope.get("route") else "unknown"
    IN_FLIGHT.inc()
    mulai = time.perf_counter()
    try:
        response = await call_next(request)
        status = response.status_code
        return response
    except Exception:
        status = 500
        raise
    finally:
        IN_FLIGHT.dec()
        REQUESTS.labels(request.method, route, str(status)).inc()
        DURATION.labels(request.method, route).observe(time.perf_counter() - mulai)</pre>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ Python multi-worker (gunicorn/uvicorn) butuh perlakuan khusus</div>
    <p>Setiap worker adalah proses terpisah dengan registry metriknya sendiri. Prometheus akan men-scrape worker yang berbeda-beda secara acak, sehingga angkanya melompat-lompat.</p>
    <p><strong>Solusi:</strong> aktifkan mode multiprocess dengan variabel lingkungan <code>PROMETHEUS_MULTIPROC_DIR</code> yang menunjuk ke direktori bersama, dan gunakan <code>MultiProcessCollector</code>.</p>
</div>

<h3>Node.js</h3>
<pre data-lang="javascript" data-file="metrics.js">const client = require('prom-client');

// Metrik bawaan Node: event loop lag, heap, GC — sangat berguna
client.collectDefaultMetrics({ prefix: 'node_' });

const requests = new client.Counter({
  name: 'http_requests_total',
  help: 'Jumlah total request HTTP.',
  labelNames: ['method', 'route', 'status'],
});

const duration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durasi request HTTP.',
  labelNames: ['method', 'route'],
  buckets: [0.05, 0.1, 0.2, 0.3, 0.5, 0.75, 1, 2, 5],
});

app.use((req, res, next) => {
  const selesai = duration.startTimer({ method: req.method });
  res.on('finish', () => {
    // req.route.path = pola seperti '/api/user/:id', bukan '/api/user/48213'
    const route = (req.route && req.route.path) || 'unknown';
    selesai({ route });
    requests.inc({ method: req.method, route, status: res.statusCode });
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});</pre>
`,
    lab: {
        intro: `
<h3>Praktik: Instrumentasi Aplikasi & Verifikasi Kardinalitas</h3>
<p>Setelah menambahkan metrik, langkah yang paling sering dilewatkan adalah <strong>memeriksa berapa time series yang Anda ciptakan</strong>. Lakukan sebelum masuk produksi, bukan sesudah Prometheus mati.</p>`,
        files: [{
            name: 'cek-kardinalitas.sh', lang: 'bash', code: `#!/usr/bin/env bash
# Memeriksa kardinalitas endpoint /metrics sebelum dilepas ke produksi.
# Pakai: ./cek-kardinalitas.sh http://localhost:8080/metrics

URL="\${1:-http://localhost:8080/metrics}"
TMP=$(mktemp)
curl -sf "$URL" > "$TMP" || { echo "Gagal mengambil $URL"; exit 1; }

TOTAL=$(grep -vc '^#' "$TMP")
echo "Total time series yang diekspos: $TOTAL"
echo

echo "10 metrik dengan time series terbanyak:"
grep -v '^#' "$TMP" | sed 's/{.*//; s/ .*//' | sort | uniq -c | sort -rn | head -10
echo

echo "Label dengan nilai unik terbanyak (kandidat masalah kardinalitas):"
grep -v '^#' "$TMP" \\
  | grep -o '[a-z_]*="[^"]*"' \\
  | awk -F'=' '{print $1}' | sort | uniq -c | sort -rn | head -10
echo

if [ "$TOTAL" -gt 10000 ]; then
  echo "PERINGATAN: lebih dari 10.000 series dari SATU instance."
  echo "Dengan 20 instance, ini menjadi 200.000 series. Tinjau ulang label Anda."
fi

rm -f "$TMP"` }],
        steps: [
            { note: 'Jalankan pemeriksaan kardinalitas pada aplikasi Anda', cmd: 'chmod +x cek-kardinalitas.sh\n./cek-kardinalitas.sh http://localhost:8080/metrics', out: 'Total time series yang diekspos: 148\n\n10 metrik dengan time series terbanyak:\n     42 http_request_duration_seconds_bucket\n     18 http_requests_total\n      9 go_gc_duration_seconds' },
            { note: 'Cari metrik berkardinalitas tinggi dari sisi Prometheus', cmd: 'promql topk(10, count by (__name__)({__name__=~".+"}))' },
            { note: 'Lihat jumlah total series yang disimpan Prometheus', cmd: 'promql prometheus_tsdb_head_series' }
        ],
        snippets: ['promql prometheus_tsdb_head_series', 'promql topk(10, count by (__name__)({__name__=~".+"}))', 'promql rate(http_requests_total[5m])']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN memakai path sebenarnya sebagai label',
            body: `<p>Ini kesalahan yang berulang kali merobohkan Prometheus di produksi:</p>
<pre data-lang="text">❌ http_requests_total{path="/api/user/48213"}
❌ http_requests_total{path="/produk?q=sepatu&halaman=3"}
✅ http_requests_total{route="/api/user/:id"}
✅ http_requests_total{route="/produk"}</pre>
<p>Gunakan <strong>pola route</strong> dari framework Anda (<code>req.route.path</code> di Express, <code>request.scope["route"].path</code> di FastAPI, pola mux di Go), bukan URL yang sesungguhnya diminta.</p>`
        },
        {
            kind: 'larangan', title: 'Jangan memasukkan data pribadi ke label metrik',
            body: `<p>Label seperti <code>email</code>, <code>nama</code>, <code>nomor_hp</code>, atau <code>nik</code> berarti data pribadi Anda tersimpan di Prometheus, ikut ter-scrape, ikut masuk backup, dan bisa dibaca siapa pun yang punya akses ke Grafana.</p>
<p>Selain meledakkan kardinalitas, ini adalah pelanggaran <strong>UU PDP No. 27/2022</strong>. Metrik adalah agregat — bila Anda butuh menelusuri satu pengguna, gunakan log atau tracing dengan kontrol akses yang sesuai.</p>`
        },
        {
            kind: 'salah', title: 'Status code dijadikan label dengan nilai penuh',
            body: `<p>Label <code>status="200"</code> masih wajar (jumlah status HTTP terbatas). Yang berbahaya adalah menggabungkannya dengan pesan error bebas: <code>error="connection refused to 10.0.3.42:5432"</code> — setiap IP dan port menghasilkan series baru.</p>
<p>Kelompokkan menjadi kategori terbatas: <code>error_type="db_connection"</code>, <code>error_type="timeout"</code>, <code>error_type="validation"</code>.</p>`
        },
        {
            kind: 'best', title: 'Lindungi endpoint /metrics',
            body: `<p>Endpoint <code>/metrics</code> membocorkan banyak informasi: versi library, jumlah instance, nama route internal, pola trafik, bahkan nama tabel database bila Anda tidak hati-hati.</p>
<p>Jangan biarkan bisa diakses publik. Sajikan di port terpisah yang hanya terbuka di jaringan internal, atau lindungi dengan autentikasi di reverse proxy.</p>`
        },
        {
            kind: 'kasus', title: 'Metrik bisnis membuat monitoring jadi berarti bagi non-engineer',
            body: `<p>Metrik teknis (CPU, latency) memberi tahu <em>sistem</em> sehat. Metrik bisnis memberi tahu <em>usaha</em> sehat — dan sering mendeteksi masalah lebih cepat.</p>
<pre data-lang="text">pesanan_dibuat_total{metode_bayar, status}
pembayaran_gagal_total{penyedia, alasan}
pengguna_daftar_total{sumber}
saldo_dompet_total</pre>
<p>Alert "pesanan turun 80% dibanding jam yang sama minggu lalu" sering menangkap insiden yang lolos dari semua alert teknis — misalnya bug logika yang membuat tombol checkout hilang, sementara semua server tetap sehat.</p>`
        }
    ],
    quiz: [
        {
            q: 'Aplikasi Express Anda punya route <code>/api/produk/:id</code>. Bagaimana label metrik yang benar?',
            opts: [
                '<code>{path: req.originalUrl}</code>',
                '<code>{route: req.route.path}</code> yang menghasilkan <code>/api/produk/:id</code>',
                '<code>{id: req.params.id}</code>',
                '<code>{url: req.url}</code>'
            ],
            a: 1,
            exp: 'Pola route menghasilkan jumlah nilai yang terbatas (sebanyak route yang Anda punya). Memakai URL sebenarnya akan membuat satu time series untuk setiap ID produk — kardinalitas meledak seiring pertumbuhan katalog.'
        },
        {
            q: 'Metode RED terdiri dari tiga metrik apa?',
            opts: [
                'Reliability, Efficiency, Durability',
                'Rate, Errors, Duration',
                'Requests, Endpoints, Databases',
                'Resource, Event, Delay'
            ],
            a: 1,
            exp: '<strong>R</strong>ate (request per detik), <strong>E</strong>rrors (yang gagal), <strong>D</strong>uration (berapa lama). Tiga metrik ini sudah cukup menjawab sebagian besar pertanyaan operasional tentang sebuah layanan.'
        },
        {
            q: 'Aplikasi Python berjalan dengan 8 worker gunicorn. Nilai counter di Grafana melompat-lompat naik-turun. Kenapa?',
            opts: [
                'scrape_interval terlalu cepat',
                'Setiap worker punya registry terpisah, dan Prometheus men-scrape worker yang berbeda-beda',
                'Counter salah diimplementasikan sebagai Gauge',
                'Grafana salah mengonfigurasi panel'
            ],
            a: 1,
            exp: 'Dalam mode multi-proses, tiap worker memegang nilai metriknya sendiri. Load balancer internal mengarahkan scrape ke worker acak, sehingga nilainya terlihat melompat. Solusinya mengaktifkan mode multiprocess dengan <code>PROMETHEUS_MULTIPROC_DIR</code>.'
        }
    ]
},

/* ---------------------------------------------------------------- 5 ----- */
{
    id: 5,
    cat: '2 · Metrik & Instrumentasi',
    title: 'Exporter: node, blackbox, postgres, cAdvisor & Textfile',
    level: 'Menengah', dur: '16 mnt',
    tags: ['exporter', 'node exporter', 'blackbox', 'postgres', 'cadvisor', 'textfile'],
    desc: 'Memantau sistem dan software yang tidak bisa Anda ubah kodenya, serta cara membuat metrik kustom tanpa menulis exporter sendiri.',
    theory: `
<h2>Apa Itu Exporter</h2>
<p><strong>Exporter</strong> adalah program kecil yang membaca informasi dari suatu sistem (kernel Linux, PostgreSQL, Redis, perangkat jaringan) lalu menyajikannya sebagai endpoint <code>/metrics</code> yang bisa dibaca Prometheus. Ia adalah penerjemah — bukan penyimpan.</p>

<h3>Exporter yang Paling Sering Dipakai</h3>
<table>
<thead><tr><th>Exporter</th><th>Port</th><th>Memantau</th></tr></thead>
<tbody>
<tr><td><code>node_exporter</code></td><td>9100</td><td>CPU, memori, disk, jaringan Linux/Unix</td></tr>
<tr><td><code>windows_exporter</code></td><td>9182</td><td>Setara node_exporter untuk Windows</td></tr>
<tr><td><code>cAdvisor</code></td><td>8080</td><td>Penggunaan sumber daya per container</td></tr>
<tr><td><code>blackbox_exporter</code></td><td>9115</td><td>Probe dari luar: HTTP, TCP, ICMP, DNS, TLS</td></tr>
<tr><td><code>postgres_exporter</code></td><td>9187</td><td>PostgreSQL: koneksi, lock, replikasi, ukuran</td></tr>
<tr><td><code>mysqld_exporter</code></td><td>9104</td><td>MySQL / MariaDB</td></tr>
<tr><td><code>redis_exporter</code></td><td>9121</td><td>Redis: memori, hit rate, koneksi klien</td></tr>
<tr><td><code>nginx-prometheus-exporter</code></td><td>9113</td><td>Nginx</td></tr>
<tr><td><code>kafka_exporter</code></td><td>9308</td><td>Kafka: consumer lag, partisi</td></tr>
</tbody>
</table>

<h3>Blackbox Exporter — Memantau dari Sudut Pandang Pengguna</h3>
<p>Ini exporter yang paling sering diremehkan. Semua metrik internal bisa hijau sementara pengguna sama sekali tidak bisa mengakses situs Anda (sertifikat kedaluwarsa, DNS salah, load balancer salah konfigurasi). Blackbox exporter memeriksa dari <strong>luar</strong>.</p>
<pre data-lang="yaml" data-file="blackbox.yml">modules:
  http_2xx:
    prober: http
    timeout: 8s
    http:
      valid_status_codes: [200, 201, 204]
      valid_http_versions: ["HTTP/1.1", "HTTP/2.0"]
      method: GET
      follow_redirects: true
      preferred_ip_protocol: ip4
      fail_if_body_not_matches_regexp:
        - '"status"\\s*:\\s*"ok"'

  http_post_login:
    prober: http
    timeout: 10s
    http:
      method: POST
      headers: { Content-Type: application/json }
      body: '{"username":"probe","password":"probe"}'
      valid_status_codes: [200]

  tcp_connect:
    prober: tcp
    timeout: 5s

  icmp_ping:
    prober: icmp
    timeout: 5s</pre>

<pre data-lang="yaml" data-file="prometheus.yml (bagian scrape)">  - job_name: blackbox-http
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets:
          - https://tokocepat.id
          - https://api.tokocepat.id/health
          - https://admin.tokocepat.id
    relabel_configs:
      # Pola WAJIB untuk blackbox — tanpa ini probe tidak akan bekerja
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox-exporter:9115</pre>

<div class="callout callout-tip">
    <div class="callout-title">💡 Alert paling berharga dari blackbox exporter</div>
    <pre data-lang="promql"># Situs tidak bisa diakses
probe_success == 0

# Sertifikat TLS akan kedaluwarsa dalam 14 hari
(probe_ssl_earliest_cert_expiry - time()) / 86400 &lt; 14

# Waktu respons dari luar memburuk
probe_duration_seconds &gt; 3</pre>
    <p>Alert sertifikat kedaluwarsa sendirian sudah menyelamatkan banyak tim dari insiden akhir pekan yang tidak perlu.</p>
</div>

<h3>Textfile Collector — Metrik Kustom Tanpa Menulis Exporter</h3>
<p>Fitur <code>node_exporter</code> yang sangat berguna: ia membaca berkas <code>.prom</code> dari sebuah direktori dan menyajikannya sebagai metrik. Cocok untuk hasil cron job, skrip backup, atau data dari sistem lama.</p>
<pre data-lang="bash" data-file="/usr/local/bin/cek-backup.sh">#!/usr/bin/env bash
# Dijalankan oleh cron setelah backup selesai.
set -euo pipefail

DIR=/var/lib/node_exporter/textfile
TMP="$DIR/backup.prom.$$"        # tulis ke temp dulu

BERKAS=$(ls -t /backup/*.sql.gz 2>/dev/null | head -1 || true)

if [ -z "$BERKAS" ]; then
  UMUR=999999; UKURAN=0; SUKSES=0
else
  UMUR=$(( $(date +%s) - $(stat -c %Y "$BERKAS") ))
  UKURAN=$(stat -c %s "$BERKAS")
  SUKSES=1
fi

cat > "$TMP" &lt;&lt;EOF
# HELP backup_terakhir_umur_detik Umur berkas backup terbaru dalam detik.
# TYPE backup_terakhir_umur_detik gauge
backup_terakhir_umur_detik $UMUR
# HELP backup_terakhir_ukuran_bytes Ukuran berkas backup terbaru.
# TYPE backup_terakhir_ukuran_bytes gauge
backup_terakhir_ukuran_bytes $UKURAN
# HELP backup_sukses Apakah backup terakhir berhasil (1) atau tidak (0).
# TYPE backup_sukses gauge
backup_sukses $SUKSES
EOF

# Pindah atomik supaya node_exporter tidak pernah membaca berkas separuh jadi
mv "$TMP" "$DIR/backup.prom"</pre>

<pre data-lang="bash" data-file="menjalankan node_exporter">node_exporter --collector.textfile.directory=/var/lib/node_exporter/textfile</pre>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ Selalu tulis ke berkas sementara lalu <code>mv</code></div>
    <p>Bila skrip menulis langsung ke <code>backup.prom</code>, ada kemungkinan node_exporter membacanya saat isinya baru separuh — menghasilkan error parsing dan metrik yang hilang. Perintah <code>mv</code> pada filesystem yang sama bersifat atomik, sehingga pembaca selalu melihat berkas utuh.</p>
</div>

<h3>Menjalankan Exporter yang Butuh Kredensial</h3>
<pre data-lang="yaml" data-file="docker-compose.yml">  postgres-exporter:
    image: quay.io/prometheuscommunity/postgres-exporter:v0.16.0
    environment:
      # Pakai akun read-only khusus monitoring, BUKAN superuser
      DATA_SOURCE_NAME: "postgresql://pemantau:\${PG_PASS}@db:5432/tokocepat?sslmode=disable"
    ports: ["9187:9187"]</pre>
<pre data-lang="sql" data-file="siapkan-akun.sql">-- Akun khusus monitoring dengan hak minimum
CREATE USER pemantau WITH PASSWORD 'ganti-ini';
GRANT pg_monitor TO pemantau;      -- role bawaan PostgreSQL 10+
GRANT CONNECT ON DATABASE tokocepat TO pemantau;</pre>
`,
    lab: {
        intro: `
<h3>Praktik: Memantau Ketersediaan Situs dari Luar</h3>
<p>Tambahkan blackbox exporter ke stack Anda, lalu buat alert untuk sertifikat TLS yang akan kedaluwarsa.</p>`,
        files: [
            {
                name: 'docker-compose.override.yml', lang: 'yaml', code: `services:
  blackbox-exporter:
    image: prom/blackbox-exporter:v0.25.0
    container_name: blackbox-exporter
    ports: ["9115:9115"]
    volumes:
      - ./blackbox.yml:/etc/blackbox_exporter/config.yml:ro
    command: ["--config.file=/etc/blackbox_exporter/config.yml"]
    restart: unless-stopped

  postgres-exporter:
    image: quay.io/prometheuscommunity/postgres-exporter:v0.16.0
    container_name: postgres-exporter
    environment:
      DATA_SOURCE_NAME: "postgresql://pemantau:rahasia@db:5432/tokocepat?sslmode=disable"
    ports: ["9187:9187"]
    restart: unless-stopped`
            },
            {
                name: 'rules/eksternal.yml', lang: 'yaml', code: `groups:
  - name: pemantauan-eksternal
    interval: 30s
    rules:
      - alert: SitusTidakBisaDiakses
        expr: probe_success == 0
        for: 3m
        labels:
          severity: critical
        annotations:
          summary: "{{ $labels.instance }} tidak bisa diakses dari luar"
          description: "Probe gagal selama 3 menit. Periksa DNS, LB, dan firewall."

      - alert: SertifikatTLSSegeraKedaluwarsa
        expr: (probe_ssl_earliest_cert_expiry - time()) / 86400 < 14
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "Sertifikat {{ $labels.instance }} kedaluwarsa dalam {{ $value | printf \\"%.0f\\" }} hari"
          description: "Perbarui sertifikat sebelum kedaluwarsa untuk menghindari downtime."

      - alert: SertifikatTLSKritis
        expr: (probe_ssl_earliest_cert_expiry - time()) / 86400 < 3
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "DARURAT: sertifikat {{ $labels.instance }} kedaluwarsa < 3 hari"

      - alert: ResponsEksternalLambat
        expr: probe_duration_seconds > 3
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "{{ $labels.instance }} lambat dari luar ({{ $value | printf \\"%.1f\\" }}s)"

      - alert: BackupTerlaluLama
        expr: backup_terakhir_umur_detik > 90000    # > 25 jam
        for: 30m
        labels:
          severity: critical
        annotations:
          summary: "Backup terakhir sudah {{ $value | humanizeDuration }} yang lalu"` }
        ],
        steps: [
            { note: 'Nyalakan blackbox exporter', cmd: 'docker compose up -d blackbox-exporter' },
            { note: 'Uji probe secara manual sebelum menyerahkannya ke Prometheus', cmd: 'curl -s "http://localhost:9115/probe?target=https://grafana.com&module=http_2xx" | grep -E "probe_success|probe_duration_seconds|probe_ssl_earliest"' },
            { note: 'Validasi berkas rule', cmd: 'promtool check rules rules/eksternal.yml', out: 'Checking rules/eksternal.yml\n  SUCCESS: 5 rules found' },
            { note: 'Lihat sisa umur sertifikat dalam hari', cmd: 'promql (probe_ssl_earliest_cert_expiry - time()) / 86400' }
        ],
        snippets: ['promql probe_success', 'promql probe_duration_seconds', 'promtool check rules rules/eksternal.yml', 'targets']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'Jangan beri exporter database akun superuser',
            body: `<p>Exporter hanya perlu <em>membaca</em> statistik. Memberinya akun <code>postgres</code> atau <code>root</code> berarti bila container exporter dikompromikan, penyerang mendapat kendali penuh atas basis data Anda.</p>
<p>Buat akun khusus dengan hak minimum: <code>GRANT pg_monitor TO pemantau</code> di PostgreSQL, atau <code>GRANT PROCESS, REPLICATION CLIENT, SELECT</code> di MySQL. Simpan kata sandinya di secret manager, bukan di berkas compose yang ter-commit.</p>`
        },
        {
            kind: 'salah', title: 'Blackbox exporter dikonfigurasi tanpa relabel_configs',
            body: `<p>Blackbox exporter bekerja berbeda dari exporter lain: Prometheus tidak men-scrape target secara langsung, melainkan men-scrape <strong>blackbox exporter</strong> sambil menyebutkan target lewat parameter <code>?target=</code>.</p>
<p>Tanpa tiga baris <code>relabel_configs</code> yang standar, Prometheus akan mencoba men-scrape <code>https://situs-anda.id/probe</code> — yang jelas tidak ada — dan semua target akan berstatus DOWN.</p>`
        },
        {
            kind: 'salah', title: 'Skrip textfile collector menulis langsung ke berkas tujuan',
            body: `<p>node_exporter membaca direktori textfile pada setiap scrape. Bila kebetulan membaca saat skrip Anda baru menulis separuh, hasilnya error parsing dan metrik hilang untuk siklus tersebut.</p>
<p>Selalu: tulis ke <code>berkas.prom.$$</code>, lalu <code>mv</code> ke <code>berkas.prom</code>. Operasi <code>mv</code> pada filesystem yang sama bersifat atomik.</p>`
        },
        {
            kind: 'best', title: 'Pantau exporter-nya juga',
            body: `<p>Exporter bisa mati atau hang tanpa Anda sadari, dan Anda akan mengira "tidak ada masalah" padahal sebenarnya "tidak ada data".</p>
<pre data-lang="promql"># Alert bila exporter mati
up{job=~".*exporter.*"} == 0

# Alert bila scrape memakan waktu terlalu lama (exporter kelebihan beban)
scrape_duration_seconds > 5

# Alert bila exporter memangkas sampel karena batas
scrape_samples_post_metric_relabeling > 50000</pre>`
        },
        {
            kind: 'kasus', title: 'node_exporter di dalam container butuh konfigurasi khusus',
            body: `<p>Menjalankan node_exporter dalam container tanpa penyesuaian akan membuatnya melaporkan metrik <em>container</em>, bukan mesin host. Anda akan melihat disk 200 MB dan memori beberapa ratus MB — jelas bukan angka mesin sebenarnya.</p>
<pre data-lang="yaml">  node-exporter:
    image: prom/node-exporter:v1.8.2
    pid: host                      # lihat proses host
    volumes: ["/:/host:ro,rslave"] # lihat filesystem host
    command: ["--path.rootfs=/host"]</pre>
<p>Untuk produksi, umumnya lebih tepat memasang node_exporter langsung di host sebagai service systemd.</p>`
        }
    ],
    quiz: [
        {
            q: 'Semua metrik internal aplikasi normal, tetapi pengguna melaporkan situs tidak bisa dibuka. Exporter apa yang seharusnya sudah menangkap ini?',
            opts: ['node_exporter', 'blackbox_exporter', 'cAdvisor', 'postgres_exporter'],
            a: 1,
            exp: '<code>blackbox_exporter</code> memeriksa dari <strong>luar</strong>, sehingga menangkap masalah yang tidak terlihat dari dalam: DNS salah, sertifikat kedaluwarsa, load balancer salah konfigurasi, atau firewall memblokir. Metrik internal bisa sehat sempurna sementara pengguna sama sekali tidak bisa masuk.'
        },
        {
            q: 'Apa fungsi <code>relabel_configs</code> pada konfigurasi scrape blackbox exporter?',
            opts: [
                'Mengganti nama metrik agar lebih rapi',
                'Memindahkan alamat target ke parameter <code>?target=</code> dan mengarahkan scrape ke blackbox exporter',
                'Mengurangi kardinalitas',
                'Mengatur interval scrape'
            ],
            a: 1,
            exp: 'Blackbox exporter di-scrape sebagai perantara: Prometheus memanggil <code>blackbox:9115/probe?target=situs-anda</code>. Tiga baris relabel standar memindahkan alamat target ke parameter URL dan mengganti <code>__address__</code> menjadi alamat exporter.'
        },
        {
            q: 'Kenapa skrip textfile collector harus menulis ke berkas sementara lalu <code>mv</code>?',
            opts: [
                'Agar lebih cepat',
                'Agar node_exporter tidak pernah membaca berkas yang baru tertulis separuh',
                'Karena node_exporter tidak bisa membaca berkas baru',
                'Untuk menghemat disk'
            ],
            a: 1,
            exp: 'node_exporter membaca direktori textfile pada setiap scrape. Operasi <code>mv</code> dalam filesystem yang sama bersifat atomik, sehingga pembaca selalu melihat berkas yang utuh — tidak pernah versi separuh jadi yang gagal di-parse.'
        }
    ]
}

];

/* ==========================================================================
   PROMETHEUS — BAGIAN B (PromQL Mendalam)
   ========================================================================== */

const PROM_MOD_B = [

/* ---------------------------------------------------------------- 6 ----- */
{
    id: 6,
    cat: '3 · PromQL',
    title: 'PromQL Dasar: Selector, Matcher & Tipe Vektor',
    level: 'Dasar', dur: '17 mnt',
    tags: ['promql', 'selector', 'matcher', 'instant vector', 'range vector', 'regex'],
    desc: 'Fondasi bahasa query Prometheus: cara memilih data, empat jenis matcher, dan perbedaan krusial instant vector dan range vector.',
    theory: `
<h2>Dua Tipe Data yang Wajib Anda Bedakan</h2>
<p>Hampir semua error PromQL pemula berasal dari kebingungan ini.</p>

<table>
<thead><tr><th>Tipe</th><th>Isi</th><th>Contoh</th><th>Dipakai oleh</th></tr></thead>
<tbody>
<tr><td><strong>Instant vector</strong></td><td>Satu nilai per series, pada satu titik waktu</td><td><code>up</code></td><td>Agregasi, operator aritmatika</td></tr>
<tr><td><strong>Range vector</strong></td><td>Deretan nilai dalam rentang waktu</td><td><code>up[5m]</code></td><td><code>rate()</code>, <code>increase()</code>, <code>*_over_time()</code></td></tr>
<tr><td><strong>Scalar</strong></td><td>Satu angka biasa</td><td><code>42</code></td><td>Perbandingan, pengali</td></tr>
<tr><td><strong>String</strong></td><td>Teks</td><td><code>"produksi"</code></td><td>Jarang dipakai langsung</td></tr>
</tbody>
</table>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Error paling sering: salah tipe vektor</div>
    <pre data-lang="promql">❌ rate(http_requests_total)          # error: butuh range vector
✅ rate(http_requests_total[5m])

❌ sum(http_requests_total[5m])       # error: sum butuh instant vector
✅ sum(rate(http_requests_total[5m]))

❌ http_requests_total[5m] &gt; 100      # error: tidak bisa membandingkan range vector
✅ rate(http_requests_total[5m]) &gt; 100</pre>
    <p>Aturan sederhana: <strong>fungsi yang namanya mengandung <code>rate</code>, <code>increase</code>, <code>delta</code>, atau <code>_over_time</code> butuh <code>[durasi]</code>. Fungsi agregasi (<code>sum</code>, <code>avg</code>, <code>max</code>) tidak boleh diberi <code>[durasi]</code>.</strong></p>
</div>

<h3>Empat Jenis Label Matcher</h3>
<pre data-lang="promql" data-file="matcher">http_requests_total{job="api"}            # =   sama persis
http_requests_total{job!="api"}           # !=  tidak sama
http_requests_total{status=~"5.."}        # =~  cocok regex  (500-599)
http_requests_total{status!~"2..|3.."}    # !~  tidak cocok regex

# Beberapa matcher digabung dengan koma = operator DAN
http_requests_total{job="api", status=~"5..", lingkungan="produksi"}

# Memilih berdasarkan nama metrik dengan regex
{__name__=~"http_.*_total", job="api"}</pre>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ Regex di PromQL selalu <em>fully anchored</em></div>
    <p>Pola <code>status=~"5"</code> <strong>tidak</strong> cocok dengan <code>"500"</code>. Prometheus secara otomatis membungkus pola Anda menjadi <code>^(?:5)$</code> — jadi harus cocok seluruhnya.</p>
    <pre data-lang="promql">❌ {status=~"5"}       # hanya cocok dengan status yang persis "5"
✅ {status=~"5.."}     # cocok 500, 502, 503, …
✅ {status=~"5.*"}     # cocok apa pun yang diawali 5</pre>
</div>

<h3>Fungsi <code>*_over_time</code> — Agregasi Sepanjang Waktu</h3>
<p>Fungsi agregasi biasa (<code>sum</code>, <code>avg</code>) menggabungkan <strong>antar-series</strong>. Fungsi <code>_over_time</code> menggabungkan <strong>sepanjang waktu</strong> untuk setiap series.</p>
<pre data-lang="promql" data-file="over-time">avg_over_time(node_load1[1h])        # rata-rata load 1 jam terakhir
max_over_time(node_load1[24h])       # puncak dalam 24 jam
min_over_time(node_load1[24h])
sum_over_time(antrean_panjang[1h])
count_over_time(up[1h])              # berapa sampel terkumpul (deteksi scrape bolong)
last_over_time(harga_terakhir[1h])
stddev_over_time(latency_seconds[1h])
quantile_over_time(0.95, node_load1[1h])
present_over_time(up[5m])            # apakah series ini ada sama sekali</pre>

<h3>Menggeser Waktu: <code>offset</code> dan <code>@</code></h3>
<pre data-lang="promql" data-file="pergeseran-waktu"># Nilai satu minggu lalu — untuk membandingkan pola mingguan
sum(rate(http_requests_total[5m] offset 7d))

# Perbandingan minggu ini vs minggu lalu (dalam persen)
100 * (
  sum(rate(http_requests_total[5m]))
  / sum(rate(http_requests_total[5m] offset 7d))
  - 1
)

# Nilai pada timestamp absolut (Unix epoch)
node_memory_MemAvailable_bytes @ 1735689600</pre>

<h3>Fungsi Bantu yang Sering Dibutuhkan</h3>
<pre data-lang="promql" data-file="utilitas"># Deteksi metrik yang HILANG — sangat penting untuk alert
absent(up{job="pembayaran"})              # bernilai 1 bila series tidak ada
absent_over_time(up{job="pembayaran"}[10m])

# Pembulatan & pembatasan
round(node_load1, 0.1)
clamp_max(persen_cpu, 100)
clamp_min(sisa_saldo, 0)

# Manipulasi label
label_replace(up, "host", "$1", "instance", "([^:]+):.*")
label_join(up, "alamat", "-", "job", "instance")

# Waktu
time()                    # timestamp query saat ini
timestamp(up)             # timestamp sampel
node_time_seconds - node_boot_time_seconds   # uptime</pre>

<div class="callout callout-tip">
    <div class="callout-title">💡 <code>absent()</code> menyelamatkan Anda dari "alert yang tidak pernah berbunyi"</div>
    <p>Alert <code>up{job="pembayaran"} == 0</code> hanya berbunyi bila series <code>up</code> itu <strong>ada</strong>. Bila seluruh job hilang dari konfigurasi (misalnya seseorang salah edit YAML), tidak ada series sama sekali — dan alert Anda diam sempurna sementara layanan pembayaran tidak terpantau.</p>
    <pre data-lang="promql">absent(up{job="pembayaran"}) == 1</pre>
    <p>Pasangkan kedua alert ini untuk setiap layanan kritis.</p>
</div>
`,
    lab: {
        intro: `
<h3>Praktik: Membangun Query dari Nol</h3>
<p>Gunakan <strong>Terminal Simulasi</strong> di bawah untuk mencoba query. Ketik <code>promql &lt;query&gt;</code>. Simulator meniru bentuk hasil Prometheus asli.</p>`,
        files: [{
            name: 'latihan-promql.promql', lang: 'promql', code: `# ── Tingkat 1: memilih data ──────────────────────────────
up
up{job="api"}
up{job=~"api|worker"}
up == 0                                  # hanya target yang mati

node_filesystem_avail_bytes{mountpoint="/", fstype!~"tmpfs|overlay"}


# ── Tingkat 2: laju dari counter ─────────────────────────
rate(http_requests_total[5m])
sum(rate(http_requests_total[5m]))
sum by (job) (rate(http_requests_total[5m]))
sum by (route, status) (rate(http_requests_total[5m]))


# ── Tingkat 3: rasio & persentase ────────────────────────
# Error rate dalam persen
100 * sum(rate(http_requests_total{status=~"5.."}[5m]))
    / sum(rate(http_requests_total[5m]))

# Pemakaian CPU dalam persen
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Pemakaian memori dalam persen
100 * (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)

# Pemakaian disk dalam persen
100 * (1 - node_filesystem_avail_bytes{fstype!~"tmpfs|overlay"}
         / node_filesystem_size_bytes{fstype!~"tmpfs|overlay"})


# ── Tingkat 4: perbandingan waktu ────────────────────────
# Trafik hari ini vs minggu lalu pada jam yang sama
sum(rate(http_requests_total[5m]))
  / sum(rate(http_requests_total[5m] offset 7d))

# Puncak load dalam 24 jam
max_over_time(node_load1[24h])

# Prediksi kapan disk penuh (jam)
(node_filesystem_avail_bytes{mountpoint="/"}
  / deriv(node_filesystem_avail_bytes{mountpoint="/"}[6h])) / -3600


# ── Tingkat 5: deteksi hilang ────────────────────────────
absent(up{job="pembayaran"})
count(up) < 10                           # instance berkurang dari yang diharapkan
changes(process_start_time_seconds[1h]) > 3   # aplikasi restart berulang` }],
        steps: [
            { note: 'Query paling dasar — status semua target', cmd: 'promql up' },
            { note: 'Laju request per detik', cmd: 'promql sum(rate(http_requests_total[5m]))' },
            { note: 'Error rate dalam persen', cmd: 'promql 100 * sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))' },
            { note: 'Coba query yang SALAH untuk melihat pesan errornya', cmd: 'promql rate(http_requests_total)' }
        ],
        snippets: [
            'promql up',
            'promql sum(rate(http_requests_total[5m]))',
            'promql rate(http_requests_total)',
            'promql node_memory_MemAvailable_bytes',
            'promql absent(up{job="pembayaran"})'
        ]
    },
    pitfalls: [
        {
            kind: 'salah', title: 'Regex tidak cocok karena lupa PromQL selalu anchored',
            body: `<p><code>{status=~"5"}</code> tidak akan pernah cocok dengan <code>"500"</code>, karena Prometheus mengubahnya menjadi <code>^(?:5)$</code>.</p>
<p>Gunakan <code>"5.."</code> untuk tiga digit yang diawali 5, atau <code>"5.*"</code> untuk apa pun yang diawali 5. Ini berbeda dari <code>grep</code> yang mencocokkan sebagian.</p>`
        },
        {
            kind: 'larangan', title: 'Jangan pakai regex negatif tanpa pembatas job',
            body: `<p>Query seperti <code>{__name__=~".+", job!="test"}</code> memaksa Prometheus memindai <strong>seluruh</strong> time series yang ada. Pada instance dengan jutaan series, satu query semacam ini bisa membuat Prometheus kehabisan memori dan mati.</p>
<p>Selalu batasi dengan matcher yang selektif terlebih dahulu — minimal sebutkan <code>job</code> atau nama metrik yang spesifik.</p>`
        },
        {
            kind: 'salah', title: 'Rentang `[5m]` lebih kecil dari 4× scrape_interval',
            body: `<p>Dengan <code>scrape_interval: 60s</code>, rentang <code>[1m]</code> hanya berisi 1–2 sampel — <code>rate()</code> akan sering mengembalikan hasil kosong atau sangat berfluktuasi.</p>
<p><strong>Aturan praktis:</strong> rentang minimal <code>4 × scrape_interval</code>. Untuk interval 15 detik, gunakan minimal <code>[1m]</code>; nilai yang aman dan umum dipakai adalah <code>[5m]</code>.</p>`
        },
        {
            kind: 'best', title: 'Pasangkan setiap alert kritis dengan `absent()`',
            body: `<p>Alert berbasis kondisi (<code>up == 0</code>, <code>error_rate &gt; 5</code>) tidak akan berbunyi bila metriknya <strong>hilang sama sekali</strong> — misalnya karena job dihapus dari konfigurasi, exporter dicopot, atau salah ketik nama job.</p>
<pre data-lang="yaml">- alert: MetrikPembayaranHilang
  expr: absent(up{job="pembayaran"})
  for: 10m
  labels: { severity: critical }
  annotations:
    summary: "Job pembayaran tidak lagi ada di Prometheus"</pre>`
        }
    ],
    quiz: [
        {
            q: 'Kenapa <code>sum(http_requests_total[5m])</code> menghasilkan error?',
            opts: [
                'Rentang 5m terlalu pendek',
                '<code>sum()</code> membutuhkan instant vector, bukan range vector',
                'Metriknya tidak ada',
                'Harus memakai <code>by()</code>'
            ],
            a: 1,
            exp: 'Fungsi agregasi seperti <code>sum</code>, <code>avg</code>, dan <code>max</code> bekerja pada instant vector. Tanda <code>[5m]</code> menghasilkan range vector yang hanya boleh dikonsumsi fungsi seperti <code>rate()</code> atau <code>*_over_time()</code>. Bentuk yang benar: <code>sum(rate(http_requests_total[5m]))</code>.'
        },
        {
            q: 'Selector <code>http_requests_total{status=~"4"}</code> tidak mengembalikan hasil apa pun padahal ada banyak status 404. Kenapa?',
            opts: [
                'Regex di PromQL fully anchored, jadi <code>"4"</code> hanya cocok dengan status yang persis <code>"4"</code>',
                'Harus memakai <code>!~</code>',
                'Status disimpan sebagai angka, bukan string',
                'Butuh rentang waktu'
            ],
            a: 0,
            exp: 'Prometheus membungkus pola menjadi <code>^(?:4)$</code>. Untuk mencocokkan semua status 4xx gunakan <code>"4.."</code>. Perilaku ini berbeda dari <code>grep</code> yang mencocokkan sebagian string.'
        },
        {
            q: 'Job <code>pembayaran</code> tidak sengaja terhapus dari <code>prometheus.yml</code>. Alert <code>up{job="pembayaran"} == 0</code> tidak berbunyi. Apa yang harus ditambahkan?',
            opts: [
                'Menaikkan durasi <code>for</code>',
                'Alert terpisah dengan <code>absent(up{job="pembayaran"})</code>',
                'Mengganti <code>==</code> menjadi <code>!=</code>',
                'Menambah <code>offset 1h</code>'
            ],
            a: 1,
            exp: 'Bila series-nya hilang sama sekali, ekspresi <code>up == 0</code> tidak menghasilkan apa pun sehingga alert tidak pernah aktif. Fungsi <code>absent()</code> bernilai 1 ketika series yang dicari tidak ditemukan — inilah yang menangkap "monitoring-nya sendiri yang hilang".'
        }
    ]
},

/* ---------------------------------------------------------------- 7 ----- */
{
    id: 7,
    cat: '3 · PromQL',
    title: 'rate, irate, increase & Jebakan Counter',
    level: 'Menengah', dur: '18 mnt',
    tags: ['rate', 'irate', 'increase', 'counter reset', 'extrapolasi', 'staleness'],
    desc: 'Tiga fungsi yang paling sering dipakai sekaligus paling sering disalahgunakan, beserta perilaku ekstrapolasi yang membingungkan.',
    theory: `
<h2>Kenapa Counter Butuh Perlakuan Khusus</h2>
<p>Counter hanya naik — kecuali saat aplikasi restart, ketika nilainya kembali ke nol. Bila Anda menghitung selisih secara naif, restart akan menghasilkan angka negatif yang tidak masuk akal.</p>
<pre data-lang="text" data-file="counter reset">waktu   nilai
14:00   1000
14:01   1200
14:02   1400
14:03      50   ← aplikasi restart!
14:04     280

Selisih naif 14:02 → 14:03 = 50 - 1400 = -1350   ❌ tidak masuk akal
rate() paham ini restart, dan menghitungnya sebagai 1400→(reset)→50</pre>

<h3>Tiga Fungsi Counter</h3>
<table>
<thead><tr><th>Fungsi</th><th>Menghitung</th><th>Satuan</th><th>Kapan dipakai</th></tr></thead>
<tbody>
<tr><td><code>rate(m[5m])</code></td><td>Laju rata-rata sepanjang rentang</td><td>per detik</td><td><strong>Default. Untuk grafik &amp; alert.</strong></td></tr>
<tr><td><code>irate(m[5m])</code></td><td>Laju dari <strong>dua sampel terakhir</strong> saja</td><td>per detik</td><td>Grafik yang butuh detail lonjakan cepat</td></tr>
<tr><td><code>increase(m[1h])</code></td><td>Total kenaikan sepanjang rentang</td><td>jumlah absolut</td><td>"Berapa error dalam 1 jam?"</td></tr>
</tbody>
</table>

<div class="callout callout-danger">
    <div class="callout-title">⛔ JANGAN pakai <code>irate()</code> untuk alerting</div>
    <p><code>irate()</code> hanya melihat dua sampel terakhir. Ia sangat sensitif dan berisik — satu lonjakan sesaat langsung terlihat sebagai puncak tajam. Alert yang dibangun di atasnya akan berbunyi terus-menerus untuk hal-hal yang sebenarnya normal, dan pada akhirnya tim akan mematikan notifikasinya (<em>alert fatigue</em>).</p>
    <p><strong>Untuk alert selalu pakai <code>rate()</code></strong> dengan rentang yang cukup lebar (5m–15m) sehingga fluktuasi sesaat teredam.</p>
</div>

<h3>Perilaku Ekstrapolasi yang Membingungkan</h3>
<p>Ini penyebab pertanyaan "kenapa jumlah errornya 4,7 padahal error itu bilangan bulat?".</p>
<p><code>rate()</code> dan <code>increase()</code> melakukan <strong>ekstrapolasi</strong>: mereka mencocokkan hasil ke rentang penuh yang Anda minta, meskipun sampel yang tersedia tidak persis menutupi rentang itu.</p>
<pre data-lang="promql" data-file="ekstrapolasi"># scrape_interval 15s, rentang 1m -> hanya ada 4-5 sampel
increase(http_errors_total[1m])   # bisa menghasilkan 4.7, bukan 5

# Ini BUKAN bug. Prometheus mengekstrapolasi agar hasilnya
# konsisten untuk rentang waktu apa pun.</pre>
<div class="callout callout-tip">
    <div class="callout-title">💡 Cara menghadapinya</div>
    <ul>
        <li>Untuk <strong>alert</strong>, angka pecahan tidak masalah — bandingkan saja dengan ambang: <code>increase(errors_total[5m]) &gt; 10</code>.</li>
        <li>Untuk <strong>laporan</strong> yang butuh bilangan bulat, gunakan rentang yang jauh lebih besar (<code>[24h]</code>) sehingga efek ekstrapolasi menjadi tidak berarti, lalu bungkus dengan <code>round()</code>.</li>
        <li>Jangan pernah memakai rentang yang lebih kecil dari 4× scrape_interval.</li>
    </ul>
</div>

<h3>Urutan yang Benar: <code>rate()</code> Dulu, Baru <code>sum()</code></h3>
<div class="vs-grid">
<div class="vs-col vs-bad"><div class="vs-label">❌ Salah — counter reset jadi kacau</div>
<pre data-lang="promql">rate(sum(http_requests_total)[5m:])

# sum() menggabungkan semua instance dulu.
# Saat SATU instance restart, jumlah gabungan
# ikut turun -> terlihat seperti reset global
# padahal instance lain baik-baik saja.</pre></div>
<div class="vs-col vs-good"><div class="vs-label">✅ Benar — reset ditangani per instance</div>
<pre data-lang="promql">sum(rate(http_requests_total[5m]))

# rate() dihitung per time series lebih dulu,
# sehingga tiap instance ditangani sendiri,
# baru hasilnya dijumlahkan.</pre></div>
</div>
<div class="callout callout-accent">
    <div class="callout-title">📌 Hafalkan aturan ini</div>
    <p><strong>Selalu <code>rate()</code> di dalam, agregasi di luar.</strong> Pola <code>sum(rate(...))</code> benar; <code>rate(sum(...))</code> hampir selalu salah.</p>
</div>

<h3>Fungsi Terkait Lainnya</h3>
<pre data-lang="promql" data-file="fungsi-lain"># Untuk GAUGE (bukan counter):
delta(node_memory_MemAvailable_bytes[1h])   # perubahan mentah, boleh negatif
deriv(node_filesystem_avail_bytes[1h])      # laju perubahan per detik (regresi linear)
predict_linear(node_filesystem_avail_bytes[6h], 4*3600)  # prediksi 4 jam ke depan

# Menghitung perubahan nilai
changes(process_start_time_seconds[1h])     # berapa kali aplikasi restart
resets(http_requests_total[1h])             # berapa kali counter ter-reset

# Contoh alert kapasitas yang sangat berguna:
predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 4*3600) &lt; 0</pre>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ <code>delta()</code> dan <code>deriv()</code> hanya untuk Gauge</div>
    <p>Keduanya <strong>tidak</strong> menangani counter reset. Memakainya pada counter akan menghasilkan angka negatif besar setiap kali aplikasi restart, yang bisa memicu alert palsu.</p>
</div>
`,
    lab: {
        intro: `
<h3>Praktik: Membandingkan rate, irate, dan increase</h3>
<p>Jalankan ketiganya pada metrik yang sama dan perhatikan perbedaan bentuk grafiknya di Prometheus UI (<code>http://localhost:9090/graph</code>).</p>`,
        files: [{
            name: 'rate-vs-irate.promql', lang: 'promql', code: `# ── Bandingkan ketiganya pada metrik yang sama ───────────
# Halus, cocok untuk alert
rate(http_requests_total[5m])

# Tajam & berisik, hanya untuk melihat detail lonjakan
irate(http_requests_total[5m])

# Jumlah absolut, cocok untuk laporan
increase(http_requests_total[1h])


# ── Pola yang BENAR untuk agregasi ───────────────────────
sum by (job) (rate(http_requests_total[5m]))
sum by (route) (rate(http_requests_total{status=~"5.."}[5m]))

# Error rate per route, hanya yang di atas 1%
(
  sum by (route) (rate(http_requests_total{status=~"5.."}[5m]))
  / sum by (route) (rate(http_requests_total[5m]))
) > 0.01


# ── Deteksi aplikasi yang restart berulang ───────────────
changes(process_start_time_seconds[1h]) > 3
resets(http_requests_total[1h]) > 3


# ── Prediksi kapasitas ───────────────────────────────────
# Disk akan penuh dalam 4 jam?
predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 4*3600) < 0

# Memori akan habis dalam 2 jam?
predict_linear(node_memory_MemAvailable_bytes[3h], 2*3600) < 0


# ── Perbandingan periodik ────────────────────────────────
# Trafik anjlok > 50% dibanding minggu lalu jam yang sama?
sum(rate(http_requests_total[10m]))
  < 0.5 * sum(rate(http_requests_total[10m] offset 7d))` }],
        steps: [
            { note: 'Laju halus untuk alert', cmd: 'promql sum(rate(http_requests_total[5m]))' },
            { note: 'Laju tajam — perhatikan nilainya berfluktuasi lebih besar', cmd: 'promql sum(irate(http_requests_total[5m]))' },
            { note: 'Jumlah absolut dalam 1 jam — perhatikan hasilnya bisa pecahan', cmd: 'promql increase(http_requests_total[1h])' },
            { note: 'Deteksi aplikasi yang restart berulang', cmd: 'promql changes(process_start_time_seconds[1h])' }
        ],
        snippets: [
            'promql sum(rate(http_requests_total[5m]))',
            'promql sum(irate(http_requests_total[5m]))',
            'promql increase(http_requests_total[1h])',
            'promql changes(process_start_time_seconds[1h])'
        ]
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'Jangan memakai `irate()` di dalam aturan alert',
            body: `<p><code>irate()</code> menghitung dari dua sampel terakhir saja, sehingga sangat berisik. Satu lonjakan 15 detik langsung terlihat sebagai puncak tajam, dan alert Anda akan berbunyi lalu padam berulang kali (<em>flapping</em>).</p>
<p>Akibat jangka panjangnya lebih buruk daripada tidak punya alert sama sekali: tim menjadi kebal terhadap notifikasi dan mengabaikan alert yang benar-benar penting. Gunakan <code>rate()</code> dengan rentang 5m–15m untuk alerting.</p>`
        },
        {
            kind: 'larangan', title: 'JANGAN menulis `rate(sum(...))`',
            body: `<p>Menjumlahkan lebih dulu lalu menghitung laju akan menyembunyikan counter reset per instance. Ketika satu dari sepuluh instance restart, nilai gabungan turun — dan <code>rate()</code> menafsirkannya sebagai reset global, menghasilkan angka yang salah besar.</p>
<pre data-lang="promql">❌ rate(sum(http_requests_total)[5m:])
✅ sum(rate(http_requests_total[5m]))</pre>
<p>Aturannya tetap: <strong>rate di dalam, agregasi di luar</strong>.</p>`
        },
        {
            kind: 'salah', title: 'Bingung karena `increase()` menghasilkan bilangan pecahan',
            body: `<p>Ini perilaku yang disengaja, bukan bug. <code>increase()</code> mengekstrapolasi hasil agar konsisten untuk rentang waktu apa pun, meskipun sampel yang tersedia tidak persis menutupi rentang itu.</p>
<p>Untuk alert, abaikan saja pecahannya. Untuk laporan yang butuh angka bulat, gunakan rentang besar (<code>[24h]</code>) lalu bungkus dengan <code>round()</code> — atau ambil angkanya dari basis data transaksional bila memang butuh akurasi mutlak.</p>`
        },
        {
            kind: 'salah', title: 'Memakai `delta()` pada Counter',
            body: `<p><code>delta()</code> dan <code>deriv()</code> dirancang untuk Gauge dan <strong>tidak</strong> mengenali counter reset. Pada counter, setiap restart aplikasi menghasilkan nilai negatif besar yang bisa memicu alert palsu.</p>
<p>Untuk counter selalu gunakan <code>rate()</code>, <code>irate()</code>, atau <code>increase()</code>.</p>`
        },
        {
            kind: 'best', title: 'Gunakan `predict_linear()` untuk alert kapasitas',
            body: `<p>Alert "disk 90% penuh" sering datang terlambat — bisa jadi disk itu memang selalu 90% dan stabil, atau justru baru saja melonjak dan akan penuh dalam 20 menit.</p>
<pre data-lang="promql"># Berbunyi bila disk diprediksi penuh dalam 4 jam,
# berdasarkan tren 6 jam terakhir
predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 4*3600) &lt; 0</pre>
<p>Ini memberi tim waktu untuk bertindak, dan tidak berbunyi untuk disk yang memang selalu penuh tetapi stabil.</p>`
        }
    ],
    quiz: [
        {
            q: 'Manakah bentuk yang benar untuk menghitung total request per detik dari 20 instance?',
            opts: [
                '<code>rate(sum(http_requests_total)[5m:])</code>',
                '<code>sum(rate(http_requests_total[5m]))</code>',
                '<code>sum(http_requests_total[5m])</code>',
                '<code>avg(irate(http_requests_total[5m]))</code>'
            ],
            a: 1,
            exp: '<code>rate()</code> harus dihitung per time series lebih dulu agar counter reset tiap instance ditangani dengan benar, baru hasilnya dijumlahkan. Pola <code>rate(sum(...))</code> menyembunyikan reset per instance dan menghasilkan angka yang salah.'
        },
        {
            q: 'Kenapa <code>increase(http_errors_total[1m])</code> bisa menghasilkan nilai 4,7?',
            opts: [
                'Ada bug pada Prometheus',
                'Prometheus melakukan ekstrapolasi agar hasil konsisten untuk rentang waktu apa pun',
                'Metriknya salah tipe',
                'Karena ada counter reset'
            ],
            a: 1,
            exp: '<code>increase()</code> menyesuaikan hasil ke rentang penuh yang diminta, meski sampel yang tersedia tidak persis menutupinya. Ini perilaku yang disengaja. Untuk laporan berbilangan bulat, gunakan rentang besar dan <code>round()</code>.'
        },
        {
            q: 'Kapan <code>irate()</code> lebih tepat daripada <code>rate()</code>?',
            opts: [
                'Selalu, karena lebih akurat',
                'Untuk alerting agar deteksi lebih cepat',
                'Untuk grafik saat Anda perlu melihat lonjakan singkat secara detail',
                'Untuk menghitung total dalam 24 jam'
            ],
            a: 2,
            exp: '<code>irate()</code> memakai dua sampel terakhir sehingga sangat responsif — bagus untuk melihat detail lonjakan pada grafik. Tetapi sifatnya yang berisik membuatnya buruk untuk alerting, karena akan menghasilkan notifikasi yang berbunyi-padam terus-menerus.'
        }
    ]
},

/* ---------------------------------------------------------------- 8 ----- */
{
    id: 8,
    cat: '3 · PromQL',
    title: 'Agregasi, Operator & Menghitung SLI',
    level: 'Menengah', dur: '17 mnt',
    tags: ['agregasi', 'sum', 'by', 'without', 'topk', 'operator', 'sli'],
    desc: 'Menggabungkan ribuan time series menjadi angka yang bermakna, dan merangkainya menjadi indikator kualitas layanan.',
    theory: `
<h2>Operator Agregasi</h2>
<pre data-lang="promql" data-file="agregasi">sum(...)            # jumlahkan
avg(...)            # rata-rata
min(...) / max(...)
count(...)          # berapa banyak series
stddev(...) / stdvar(...)
topk(5, ...)        # 5 nilai tertinggi
bottomk(5, ...)     # 5 nilai terendah
quantile(0.95, ...) # persentil ANTAR-SERIES (bukan antar-waktu!)
count_values("versi", app_build_info)   # hitung berapa series per nilai</pre>

<h3><code>by</code> vs <code>without</code></h3>
<pre data-lang="promql" data-file="by-without"># PERTAHANKAN hanya label yang disebut
sum by (job, instance) (rate(http_requests_total[5m]))

# BUANG label yang disebut, pertahankan sisanya
sum without (instance, pod) (rate(http_requests_total[5m]))

# Tanpa keduanya: semua label hilang, hasilnya satu angka
sum(rate(http_requests_total[5m]))</pre>

<div class="callout callout-tip">
    <div class="callout-title">💡 Kapan pakai <code>without</code></div>
    <p>Gunakan <code>without</code> bila Anda ingin <strong>membuang</strong> satu-dua label tapi mempertahankan sisanya yang mungkin belum Anda ketahui. Contoh: menggabungkan semua pod dalam satu deployment sambil tetap mempertahankan label <code>namespace</code>, <code>service</code>, <code>route</code>, dan label lain yang mungkin ditambahkan tim lain nanti.</p>
    <p>Dengan <code>by</code>, label baru akan hilang diam-diam; dengan <code>without</code>, label baru otomatis terbawa.</p>
</div>

<h3>Operator Aritmatika & Pencocokan Label</h3>
<p>Saat dua vektor dioperasikan, Prometheus mencocokkan series berdasarkan <strong>seluruh label yang sama persis</strong>. Bila tidak ada yang cocok, hasilnya kosong — dan ini sumber frustrasi yang sangat umum.</p>
<pre data-lang="promql" data-file="aritmatika"># Cocok karena label kedua sisi identik
node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes

# TIDAK cocok — label berbeda -> hasil kosong
sum by (job) (rate(a_total[5m])) / sum by (instance) (rate(b_total[5m]))

# Solusi: samakan label yang dipakai untuk agregasi
sum by (job) (rate(a_total[5m])) / sum by (job) (rate(b_total[5m]))

# Atau batasi label yang dicocokkan
rate(a_total[5m]) / on (instance) rate(b_total[5m])
rate(a_total[5m]) / ignoring (status) rate(b_total[5m])</pre>

<h3>Operator Perbandingan & Logika</h3>
<pre data-lang="promql" data-file="perbandingan"># Menyaring: hanya series yang memenuhi kondisi yang dikembalikan
node_load1 &gt; 4

# bool: mengubah hasil menjadi 0 atau 1, semua series dipertahankan
node_load1 &gt; bool 4

# Operator himpunan
up == 1 and on (instance) node_load1 &gt; 4      # keduanya benar
up == 0 or absent(up)                          # salah satu benar
rate(a[5m]) unless on (instance) rate(b[5m])   # a yang TIDAK punya pasangan b</pre>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ <code>&gt;</code> menyaring, <code>&gt; bool</code> menandai</div>
    <p><code>node_load1 &gt; 4</code> hanya mengembalikan instance dengan load di atas 4 — instance yang sehat <strong>hilang</strong> dari hasil. Untuk grafik "berapa persen instance yang bermasalah", Anda butuh semua series tetap ada:</p>
    <pre data-lang="promql">avg(node_load1 &gt; bool 4)   # proporsi instance dengan load &gt; 4</pre>
</div>

<h3>Merangkai SLI (Service Level Indicator)</h3>
<p>SLI adalah rasio "kejadian baik" dibagi "total kejadian". Inilah cara SRE mengukur kualitas layanan.</p>
<pre data-lang="promql" data-file="sli"># SLI Ketersediaan: proporsi request yang tidak error
sum(rate(http_requests_total{status!~"5.."}[30d]))
  / sum(rate(http_requests_total[30d]))

# SLI Latency: proporsi request yang lebih cepat dari 300 ms
sum(rate(http_request_duration_seconds_bucket{le="0.3"}[30d]))
  / sum(rate(http_request_duration_seconds_count[30d]))

# Error budget tersisa (SLO 99,9%)
# 1 - (error yang sudah terjadi / error yang diizinkan)
1 - (
  sum(increase(http_requests_total{status=~"5.."}[30d]))
  / (0.001 * sum(increase(http_requests_total[30d])))
)</pre>

<div class="callout callout-accent">
    <div class="callout-title">📌 Error budget — konsep yang mengubah cara tim bekerja</div>
    <p>SLO 99,9% berarti Anda "boleh" gagal 0,1% dari total request. Itulah <strong>error budget</strong> Anda.</p>
    <ul>
        <li>Budget masih banyak → tim boleh rilis fitur baru dengan agresif.</li>
        <li>Budget hampir habis → bekukan rilis, fokus ke stabilitas.</li>
    </ul>
    <p>Ini mengubah perdebatan "kapan boleh rilis?" dari adu argumen menjadi keputusan berbasis angka.</p>
</div>

<h3><code>topk</code> untuk Investigasi</h3>
<pre data-lang="promql" data-file="topk"># 10 endpoint paling lambat
topk(10, histogram_quantile(0.95,
  sum by (le, route) (rate(http_request_duration_seconds_bucket[5m]))))

# 10 container paling boros memori
topk(10, container_memory_working_set_bytes{name!=""})

# 10 metrik dengan time series terbanyak (untuk berburu kardinalitas)
topk(10, count by (__name__)({__name__=~".+"}))

# 5 instance dengan error rate tertinggi
topk(5, sum by (instance) (rate(http_requests_total{status=~"5.."}[5m])))</pre>
`,
    lab: {
        intro: `
<h3>Praktik: Menyusun Dashboard SLO dalam PromQL</h3>
<p>Query berikut adalah tulang punggung dashboard SLO. Salin ke Grafana atau uji satu per satu di simulator.</p>`,
        files: [{
            name: 'sli-slo.promql', lang: 'promql', code: `# ══════════════════════════════════════════════════════════
#  DASHBOARD SLO — Query Siap Pakai
# ══════════════════════════════════════════════════════════

# ── 1. Ketersediaan 30 hari (target: 99,9%) ──────────────
100 * (
  sum(rate(http_requests_total{status!~"5.."}[30d]))
  / sum(rate(http_requests_total[30d]))
)

# ── 2. Error budget tersisa dalam persen ─────────────────
100 * (
  1 - (
    sum(increase(http_requests_total{status=~"5.."}[30d]))
    / (0.001 * sum(increase(http_requests_total[30d])))
  )
)

# ── 3. Burn rate — seberapa cepat budget habis ───────────
# Nilai 1 = budget habis persis di akhir periode.
# Nilai 14,4 = budget habis dalam ~2 hari (perlu tindakan segera).
(
  sum(rate(http_requests_total{status=~"5.."}[1h]))
  / sum(rate(http_requests_total[1h]))
) / 0.001

# ── 4. Golden signals per layanan ────────────────────────
# Traffic
sum by (job) (rate(http_requests_total[5m]))

# Errors (persen)
100 * sum by (job) (rate(http_requests_total{status=~"5.."}[5m]))
    / sum by (job) (rate(http_requests_total[5m]))

# Latency p95
histogram_quantile(0.95,
  sum by (le, job) (rate(http_request_duration_seconds_bucket[5m])))

# Saturation (CPU)
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# ── 5. Investigasi ───────────────────────────────────────
# Endpoint paling lambat
topk(10, histogram_quantile(0.95,
  sum by (le, route) (rate(http_request_duration_seconds_bucket[5m]))))

# Endpoint dengan error terbanyak
topk(10, sum by (route) (rate(http_requests_total{status=~"5.."}[5m])))

# Proporsi instance dengan load tinggi
avg(node_load1 > bool 4)

# ── 6. Kesehatan Prometheus itu sendiri ──────────────────
prometheus_tsdb_head_series
rate(prometheus_tsdb_head_samples_appended_total[5m])
prometheus_target_scrape_pool_exceeded_target_limit_total
topk(5, count by (job) ({__name__=~".+"}))` }],
        steps: [
            { note: 'Hitung ketersediaan 30 hari', cmd: 'promql 100 * (sum(rate(http_requests_total{status!~"5.."}[30d])) / sum(rate(http_requests_total[30d])))' },
            { note: 'Cari 10 endpoint paling lambat', cmd: 'promql topk(10, histogram_quantile(0.95, sum by (le, route) (rate(http_request_duration_seconds_bucket[5m]))))' },
            { note: 'Cari metrik yang paling banyak menghabiskan kardinalitas', cmd: 'promql topk(10, count by (__name__)({__name__=~".+"}))' }
        ],
        snippets: [
            'promql sum by (job) (rate(http_requests_total[5m]))',
            'promql topk(5, sum by (route) (rate(http_requests_total{status=~"5.."}[5m])))',
            'promql avg(node_load1 > bool 4)',
            'promql prometheus_tsdb_head_series'
        ]
    },
    pitfalls: [
        {
            kind: 'salah', title: 'Pembagian dua vektor menghasilkan kosong',
            body: `<p>Penyebabnya hampir selalu <strong>label kedua sisi tidak cocok</strong>. Prometheus mencocokkan series berdasarkan seluruh label yang tersisa setelah agregasi.</p>
<pre data-lang="promql">❌ sum by (job) (rate(a[5m])) / sum by (instance) (rate(b[5m]))
✅ sum by (job) (rate(a[5m])) / sum by (job) (rate(b[5m]))
✅ rate(a[5m]) / on (instance) rate(b[5m])</pre>
<p>Untuk mendiagnosis, jalankan kedua sisi secara terpisah dan bandingkan label yang muncul.</p>`
        },
        {
            kind: 'salah', title: 'Mengira `quantile()` sama dengan `histogram_quantile()`',
            body: `<p>Keduanya sangat berbeda:</p>
<ul>
<li><code>quantile(0.95, node_load1)</code> — persentil <strong>antar-series</strong>. Menjawab: "berapa load pada instance persentil ke-95?" (dari 100 instance, instance ke-95 tersibuk).</li>
<li><code>histogram_quantile(0.95, ...)</code> — persentil <strong>antar-observasi</strong>. Menjawab: "95% request selesai di bawah berapa detik?"</li>
</ul>
<p>Untuk latency Anda hampir selalu membutuhkan yang kedua.</p>`
        },
        {
            kind: 'larangan', title: 'Jangan pakai `[30d]` di dalam alerting rule',
            body: `<p>Query dengan rentang 30 hari harus memindai jutaan sampel dan bisa memakan waktu puluhan detik. Bila dievaluasi setiap 15 detik sebagai alerting rule, Prometheus Anda akan terus-menerus kelebihan beban.</p>
<p><strong>Solusi:</strong> buat <em>recording rule</em> yang menghitung rasio pada rentang pendek (5m) dan menyimpannya, lalu bangun SLO jangka panjang dari hasil rekaman itu. Ini dibahas di modul Recording Rules.</p>`
        },
        {
            kind: 'best', title: 'Pakai `without` agar tahan terhadap label baru',
            body: `<p><code>sum by (job, route)</code> akan membuang label apa pun yang ditambahkan tim lain di masa depan — misalnya <code>versi</code> atau <code>region</code> — tanpa peringatan, dan dashboard Anda diam-diam kehilangan dimensi.</p>
<p><code>sum without (instance, pod)</code> hanya membuang yang Anda sebut dan otomatis membawa label baru. Untuk dashboard yang berumur panjang, ini biasanya pilihan yang lebih aman.</p>`
        }
    ],
    quiz: [
        {
            q: 'Apa perbedaan <code>sum by (job)</code> dan <code>sum without (instance)</code>?',
            opts: [
                'Tidak ada, hanya beda penulisan',
                '<code>by</code> mempertahankan hanya label yang disebut; <code>without</code> membuang label yang disebut dan mempertahankan sisanya',
                '<code>without</code> lebih cepat',
                '<code>by</code> hanya untuk counter'
            ],
            a: 1,
            exp: 'Keduanya kebalikan. <code>by</code> bersifat allowlist (label lain hilang), <code>without</code> bersifat denylist (label lain terbawa). <code>without</code> lebih tahan perubahan karena label baru tidak hilang diam-diam.'
        },
        {
            q: 'Query <code>node_load1 > 4</code> hanya menampilkan 3 instance dari 50. Anda ingin grafik proporsi instance bermasalah. Apa yang harus dipakai?',
            opts: [
                '<code>count(node_load1 > 4)</code>',
                '<code>avg(node_load1 > bool 4)</code>',
                '<code>sum(node_load1) > 4</code>',
                '<code>topk(50, node_load1)</code>'
            ],
            a: 1,
            exp: 'Operator <code>&gt;</code> biasa <em>menyaring</em> — instance sehat hilang dari hasil. Modifier <code>bool</code> mengubah hasil menjadi 0/1 untuk <strong>semua</strong> series, sehingga <code>avg()</code> memberi proporsi instance yang melewati ambang.'
        },
        {
            q: 'Apa arti burn rate 14,4 pada SLO 99,9% bulanan?',
            opts: [
                'Sistem 14,4% lebih cepat dari biasanya',
                'Error budget bulanan akan habis dalam sekitar 2 hari bila laju ini berlanjut',
                'Ada 14,4% request yang gagal',
                'SLO sudah terlampaui 14,4 kali'
            ],
            a: 1,
            exp: 'Burn rate adalah rasio konsumsi error budget terhadap laju "normal". Nilai 1 berarti budget habis persis di akhir periode 30 hari; nilai 14,4 berarti habis dalam ± 30/14,4 ≈ 2 hari — ambang klasik untuk alert <em>page</em> yang harus segera ditangani.'
        }
    ]
},

/* ---------------------------------------------------------------- 9 ----- */
{
    id: 9,
    cat: '3 · PromQL',
    title: 'Vector Matching Lanjutan: group_left, Subquery & Info Metric',
    level: 'Lanjut', dur: '16 mnt',
    tags: ['group_left', 'group_right', 'join', 'subquery', 'info metric', 'many-to-one'],
    desc: 'Menggabungkan metrik dari sumber berbeda, menambahkan metadata ke hasil query, dan teknik query di atas query.',
    theory: `
<h2>Masalah: Metrik Terpisah, Butuh Digabung</h2>
<p>Anda punya <code>http_requests_total{instance}</code> dan ingin menampilkan <strong>versi aplikasi</strong> yang hanya ada di metrik <code>app_build_info{instance, versi}</code>. Ini pekerjaan untuk <em>vector matching</em> many-to-one.</p>

<h3>Pola "Info Metric"</h3>
<p>Konvensi umum: buat satu metrik gauge bernilai <code>1</code> yang isinya hanya metadata.</p>
<pre data-lang="text" data-file="/metrics">app_build_info{versi="2.4.1", commit="a3f21c", instance="10.0.0.5:8080"} 1
kube_pod_labels{pod="api-7d4f", label_tim="checkout", label_tier="backend"} 1
node_uname_info{instance="10.0.0.5:9100", release="6.8.0-51-generic"} 1</pre>

<h3><code>group_left</code> — Menempelkan Label</h3>
<pre data-lang="promql" data-file="group-left"># Laju request, DITAMBAH label versi dari app_build_info
sum by (instance) (rate(http_requests_total[5m]))
  * on (instance) group_left(versi)
  app_build_info

# Baca dari kiri ke kanan:
#   * on (instance)        -> cocokkan berdasarkan label instance
#   group_left(versi)      -> sisi KIRI boleh punya banyak series per
#                             satu series di kanan; ambil label 'versi'
#                             dari sisi kanan</pre>

<table>
<thead><tr><th>Modifier</th><th>Artinya</th></tr></thead>
<tbody>
<tr><td><code>group_left</code></td><td>Sisi kiri "banyak", sisi kanan "satu". Label diambil dari kanan.</td></tr>
<tr><td><code>group_right</code></td><td>Kebalikannya: sisi kanan "banyak", kiri "satu".</td></tr>
<tr><td><code>on (a, b)</code></td><td>Cocokkan <strong>hanya</strong> berdasarkan label a dan b.</td></tr>
<tr><td><code>ignoring (c)</code></td><td>Cocokkan berdasarkan semua label <strong>kecuali</strong> c.</td></tr>
</tbody>
</table>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Error <code>found duplicate series for the match group</code></div>
    <p>Ini error yang paling sering muncul saat memakai join. Artinya: sisi "satu" ternyata punya lebih dari satu series untuk kunci pencocokan yang sama.</p>
    <p><strong>Penyebab umum:</strong> aplikasi mengekspos dua <code>app_build_info</code> (misalnya setelah deploy versi baru, keduanya sempat ada bersamaan).</p>
    <p><strong>Solusi:</strong> paksa menjadi satu dengan agregasi:</p>
    <pre data-lang="promql">... * on (instance) group_left(versi)
  max by (instance, versi) (app_build_info)</pre>
</div>

<h3>Contoh Nyata: Menghubungkan Pod ke Tim Pemilik</h3>
<pre data-lang="promql" data-file="k8s-join"># CPU per pod, ditambah label tim dari kube_pod_labels
sum by (pod, namespace) (rate(container_cpu_usage_seconds_total{container!=""}[5m]))
  * on (pod, namespace) group_left(label_tim)
  max by (pod, namespace, label_tim) (kube_pod_labels)

# Lalu bisa diagregasi per tim -> laporan biaya per tim
sum by (label_tim) (
  sum by (pod, namespace) (rate(container_cpu_usage_seconds_total{container!=""}[5m]))
    * on (pod, namespace) group_left(label_tim)
    max by (pod, namespace, label_tim) (kube_pod_labels)
)</pre>

<h3>Subquery — Query di Atas Query</h3>
<p>Menjalankan sebuah ekspresi berulang kali sepanjang rentang waktu, menghasilkan range vector baru.</p>
<pre data-lang="promql" data-file="subquery"># Sintaks: &lt;ekspresi&gt;[rentang_total:langkah]

# Laju request tertinggi dalam 1 jam terakhir,
# dihitung dari rate 5 menit setiap 1 menit
max_over_time( rate(http_requests_total[5m])[1h:1m] )

# Apakah error rate pernah melebihi 5% dalam 6 jam terakhir?
max_over_time(
  (
    sum(rate(http_requests_total{status=~"5.."}[5m]))
    / sum(rate(http_requests_total[5m]))
  )[6h:5m]
) &gt; 0.05

# Berapa lama (detik) CPU berada di atas 90% dalam 24 jam?
sum_over_time( (avg(rate(node_cpu_seconds_total{mode!="idle"}[5m])) &gt; bool 0.9)[24h:1m] ) * 60</pre>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ Subquery itu mahal</div>
    <p><code>[24h:1m]</code> berarti Prometheus menjalankan ekspresi bagian dalam <strong>1.440 kali</strong>. Bila ekspresi itu sendiri berat, satu query bisa memakan puluhan detik dan menghabiskan memori.</p>
    <p><strong>Jangan pernah menaruh subquery di dalam alerting rule.</strong> Ganti dengan recording rule yang menghitung nilai dasarnya secara berkala.</p>
</div>

<h3>Manipulasi Label</h3>
<pre data-lang="promql" data-file="label"># Ekstrak hostname dari "10.0.0.5:9100" menjadi "10.0.0.5"
label_replace(up, "host", "$1", "instance", "([^:]+):.*")

# Gabungkan beberapa label menjadi satu
label_join(up, "kunci", "/", "job", "instance")

# Menyamakan nama label agar dua metrik dari sumber berbeda bisa di-join
label_replace(metrik_a, "instance", "$1", "node", "(.*)")</pre>
`,
    lab: {
        intro: `
<h3>Praktik: Join Metrik dengan Metadata</h3>
<p>Pola <code>group_left</code> adalah salah satu keterampilan PromQL yang membedakan pengguna pemula dan mahir. Latih dengan contoh berikut.</p>`,
        files: [{
            name: 'join-lanjutan.promql', lang: 'promql', code: `# ══ 1. Menambahkan versi aplikasi ke metrik request ══════
sum by (instance) (rate(http_requests_total[5m]))
  * on (instance) group_left(versi)
  max by (instance, versi) (app_build_info)


# ══ 2. Error rate per versi -> deteksi rilis buruk ═══════
(
  sum by (instance) (rate(http_requests_total{status=~"5.."}[5m]))
  / sum by (instance) (rate(http_requests_total[5m]))
)
  * on (instance) group_left(versi)
  max by (instance, versi) (app_build_info)


# ══ 3. Alert hanya untuk instance produksi ═══════════════
# 'unless' membuang series yang punya pasangan di sisi kanan
node_load1 > 8
  unless on (instance)
  node_meta{lingkungan="staging"}


# ══ 4. Menemukan target yang TIDAK punya alert ═══════════
up == 1
  unless on (job)
  ALERTS{alertstate="firing"}


# ══ 5. Subquery: puncak trafik 24 jam terakhir ═══════════
max_over_time( sum(rate(http_requests_total[5m]))[24h:5m] )


# ══ 6. Durasi total di atas ambang (dalam menit) ═════════
sum_over_time(
  (sum(rate(http_requests_total{status=~"5.."}[5m]))
   / sum(rate(http_requests_total[5m])) > bool 0.01)[24h:1m]
)


# ══ 7. Rasio memori pod terhadap limit-nya ═══════════════
container_memory_working_set_bytes{container!=""}
  / on (pod, namespace, container)
  kube_pod_container_resource_limits{resource="memory"}


# ══ 8. Ekstrak hostname dari instance ════════════════════
label_replace(
  up,
  "host", "$1", "instance", "([^:]+):.*"
)` }],
        steps: [
            { note: 'Coba join sederhana', cmd: 'promql sum by (instance) (rate(http_requests_total[5m])) * on (instance) group_left(versi) app_build_info' },
            { note: 'Bila muncul error duplicate series, paksa jadi satu dengan max by', cmd: 'promql sum by (instance) (rate(http_requests_total[5m])) * on (instance) group_left(versi) max by (instance, versi) (app_build_info)' },
            { note: 'Subquery: puncak trafik 24 jam', cmd: 'promql max_over_time( sum(rate(http_requests_total[5m]))[24h:5m] )' }
        ],
        snippets: [
            'promql app_build_info',
            'promql max_over_time( sum(rate(http_requests_total[5m]))[1h:1m] )',
            'promql label_replace(up, "host", "$1", "instance", "([^:]+):.*")'
        ]
    },
    pitfalls: [
        {
            kind: 'salah', title: 'Error "found duplicate series for the match group"',
            body: `<p>Sisi "satu" pada join ternyata punya lebih dari satu series untuk kunci yang sama. Contoh: saat rolling deploy, dua versi <code>app_build_info</code> untuk instance yang sama sempat ada bersamaan.</p>
<p><strong>Perbaikan:</strong> bungkus sisi tersebut dengan agregasi yang memaksa jadi satu:</p>
<pre data-lang="promql">max by (instance, versi) (app_build_info)</pre>
<p>Untuk mendiagnosis, jalankan sisi kanan sendirian dan periksa apakah ada instance yang muncul lebih dari sekali.</p>`
        },
        {
            kind: 'larangan', title: 'Jangan taruh subquery di dalam alerting rule',
            body: `<p>Subquery <code>[6h:5m]</code> menjalankan ekspresi bagian dalam 72 kali. Bila alerting rule ini dievaluasi setiap 15 detik, Prometheus akan terus-menerus melakukan pekerjaan berat dan bisa tertinggal dalam evaluasi rule — sehingga alert terlambat berbunyi atau tidak berbunyi sama sekali.</p>
<p>Gunakan recording rule untuk menghitung nilai dasarnya secara berkala, lalu alerting rule cukup membaca hasil rekaman itu.</p>`
        },
        {
            kind: 'salah', title: 'Tertukar antara `group_left` dan `group_right`',
            body: `<p>Cara mengingatnya: modifier menunjuk ke sisi yang punya <strong>lebih banyak</strong> series (sisi "many").</p>
<ul>
<li><code>group_left</code> — sisi kiri banyak, kanan satu. Label diambil dari kanan. <em>Ini yang paling sering dipakai.</em></li>
<li><code>group_right</code> — sisi kanan banyak, kiri satu.</li>
</ul>
<p>Bila hasilnya kosong, coba tukar modifier-nya — sering kali itu penyebabnya.</p>`
        },
        {
            kind: 'best', title: 'Pakai info metric untuk metadata, bukan label di metrik utama',
            body: `<p>Menambahkan label <code>versi</code> ke <strong>setiap</strong> metrik akan menggandakan seluruh time series Anda setiap kali deploy — versi lama dan baru sama-sama tersimpan selamanya.</p>
<p>Pola info metric jauh lebih hemat: satu series metadata per instance, lalu di-join hanya saat dibutuhkan. Inilah sebabnya <code>kube_state_metrics</code> memisahkan <code>kube_pod_labels</code> dari metrik penggunaan sumber daya.</p>`
        }
    ],
    quiz: [
        {
            q: 'Anda ingin menampilkan CPU per pod beserta nama tim pemiliknya yang hanya ada di <code>kube_pod_labels</code>. Teknik apa yang dipakai?',
            opts: [
                '<code>sum by (tim)</code>',
                'Vector matching dengan <code>* on (pod) group_left(label_tim)</code>',
                '<code>label_replace()</code>',
                'Subquery'
            ],
            a: 1,
            exp: 'Menggabungkan dua metrik berdasarkan label bersama sambil mengambil label tambahan dari salah satunya adalah pekerjaan <em>vector matching</em> many-to-one dengan <code>group_left</code>. Ini pola standar untuk menggabungkan metrik dengan info metric.'
        },
        {
            q: 'Query <code>a * on (instance) group_left(versi) app_build_info</code> gagal dengan "found duplicate series for the match group". Apa perbaikannya?',
            opts: [
                'Ganti menjadi <code>group_right</code>',
                'Bungkus sisi kanan dengan <code>max by (instance, versi) (...)</code> agar hanya ada satu series per instance',
                'Hapus <code>on (instance)</code>',
                'Tambahkan rentang waktu'
            ],
            a: 1,
            exp: 'Error ini berarti sisi "satu" punya lebih dari satu series per kunci pencocokan — biasanya karena dua versi sempat berjalan bersamaan saat deploy. Agregasi seperti <code>max by</code> memaksa hanya satu series yang tersisa.'
        },
        {
            q: 'Kenapa subquery seperti <code>[24h:1m]</code> berbahaya di alerting rule?',
            opts: [
                'Sintaksnya tidak didukung dalam rule',
                'Ekspresi bagian dalam dijalankan 1.440 kali setiap evaluasi, membebani Prometheus secara berat',
                'Hasilnya selalu kosong',
                'Alertmanager tidak bisa membacanya'
            ],
            a: 1,
            exp: 'Subquery menjalankan ekspresi dalam berulang kali sepanjang rentang. Dalam alerting rule yang dievaluasi tiap 15 detik, ini menjadi beban berat yang membuat evaluasi rule tertinggal — alert bisa terlambat atau tidak berbunyi.'
        }
    ]
}

];

/* ==========================================================================
   PROMETHEUS — BAGIAN C (Scrape, Rules, Alertmanager, Skala, Troubleshooting)
   ========================================================================== */

const PROM_MOD_C = [

/* --------------------------------------------------------------- 10 ----- */
{
    id: 10,
    cat: '4 · Produksi',
    title: 'Scrape Config, Service Discovery & Relabeling',
    level: 'Lanjut', dur: '20 mnt',
    tags: ['scrape', 'service discovery', 'relabel', 'kubernetes_sd', 'file_sd', 'drop'],
    desc: 'Menemukan target secara otomatis, dan mengendalikan label serta metrik mana yang disimpan — kunci utama menjaga Prometheus tetap sehat.',
    theory: `
<h2>Dari Static ke Service Discovery</h2>
<p>Menulis daftar IP satu per satu hanya bertahan sampai infrastruktur Anda berubah otomatis. Prometheus menyediakan puluhan mekanisme <em>service discovery</em>.</p>

<table>
<thead><tr><th>Mekanisme</th><th>Cocok untuk</th></tr></thead>
<tbody>
<tr><td><code>static_configs</code></td><td>Server tetap yang jumlahnya sedikit</td></tr>
<tr><td><code>file_sd_configs</code></td><td>Daftar target dari berkas JSON/YAML — bisa digenerate skrip, <strong>tanpa reload</strong></td></tr>
<tr><td><code>kubernetes_sd_configs</code></td><td>Kubernetes (pod, service, endpoints, node, ingress)</td></tr>
<tr><td><code>consul_sd_configs</code></td><td>Consul service registry</td></tr>
<tr><td><code>dns_sd_configs</code></td><td>DNS SRV/A record</td></tr>
<tr><td><code>ec2_sd_configs</code> / <code>gce_sd_configs</code> / <code>azure_sd_configs</code></td><td>Instance cloud</td></tr>
<tr><td><code>docker_sd_configs</code></td><td>Container Docker di host</td></tr>
</tbody>
</table>

<h3><code>file_sd</code> — Jalan Tengah yang Sangat Praktis</h3>
<pre data-lang="yaml" data-file="prometheus.yml">  - job_name: api
    file_sd_configs:
      - files: ["/etc/prometheus/targets/*.json"]
        refresh_interval: 30s</pre>
<pre data-lang="json" data-file="targets/api.json">[
  {
    "targets": ["10.0.1.5:8080", "10.0.1.6:8080"],
    "labels": { "lingkungan": "produksi", "tim": "checkout", "region": "jkt" }
  },
  {
    "targets": ["10.0.2.5:8080"],
    "labels": { "lingkungan": "staging", "tim": "checkout", "region": "jkt" }
  }
]</pre>
<div class="callout callout-tip">
    <div class="callout-title">💡 Kelebihan <code>file_sd</code></div>
    <p>Prometheus memantau berkasnya dan memuat ulang otomatis — <strong>tanpa perlu reload konfigurasi</strong>. Berkas JSON-nya bisa digenerate oleh Ansible, Terraform, atau skrip cron sederhana. Ini pilihan terbaik untuk infrastruktur VM yang tidak memakai Kubernetes maupun Consul.</p>
</div>

<h3>Kubernetes Service Discovery</h3>
<pre data-lang="yaml" data-file="k8s-sd.yml">  - job_name: kubernetes-pods
    kubernetes_sd_configs:
      - role: pod          # pod | service | endpoints | node | ingress
    relabel_configs:
      # 1. Hanya scrape pod yang punya anotasi prometheus.io/scrape=true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: "true"

      # 2. Ambil path metrik dari anotasi (default /metrics)
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)

      # 3. Ambil port dari anotasi, gabungkan dengan IP pod
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\\d+)?;(\\d+)
        replacement: $1:$2
        target_label: __address__

      # 4. Salin label Kubernetes menjadi label Prometheus
      - source_labels: [__meta_kubernetes_namespace]
        target_label: namespace
      - source_labels: [__meta_kubernetes_pod_name]
        target_label: pod
      - source_labels: [__meta_kubernetes_pod_label_app]
        target_label: app</pre>

<h3>Relabeling — Alat Paling Kuat sekaligus Paling Membingungkan</h3>
<p>Ada dua tahap relabeling, dan membedakannya itu penting:</p>
<table>
<thead><tr><th>Tahap</th><th>Kapan berjalan</th><th>Untuk apa</th></tr></thead>
<tbody>
<tr><td><code>relabel_configs</code></td><td><strong>Sebelum</strong> scrape</td><td>Memilih target mana yang di-scrape, mengubah alamat &amp; label target</td></tr>
<tr><td><code>metric_relabel_configs</code></td><td><strong>Sesudah</strong> scrape, sebelum disimpan</td><td>Membuang metrik yang tidak perlu, memangkas label berkardinalitas tinggi</td></tr>
</tbody>
</table>

<h3>Action yang Tersedia</h3>
<pre data-lang="yaml" data-file="action">    # keep   : lanjutkan HANYA bila regex cocok
    - source_labels: [__meta_kubernetes_namespace]
      action: keep
      regex: "produksi|staging"

    # drop   : buang bila regex cocok
    - source_labels: [__name__]
      action: drop
      regex: "go_gc_duration_seconds.*"

    # replace: tulis nilai baru ke target_label  (aksi default)
    - source_labels: [__meta_kubernetes_pod_label_tim]
      target_label: tim
      action: replace

    # labeldrop / labelkeep : buang atau pertahankan LABEL (bukan metrik)
    - action: labeldrop
      regex: "id_container|pod_template_hash"

    # hashmod: membagi target ke beberapa Prometheus (sharding)
    - source_labels: [__address__]
      modulus: 4
      target_label: __tmp_shard
      action: hashmod
    - source_labels: [__tmp_shard]
      action: keep
      regex: "0"        # shard ini hanya menangani sisa bagi 0</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ <code>metric_relabel_configs</code> adalah rem darurat kardinalitas Anda</div>
    <p>Ketika sebuah exporter mengekspos ribuan metrik yang tidak Anda butuhkan (cAdvisor dan kube-state-metrics terkenal boros), <code>metric_relabel_configs</code> adalah cara membuangnya <strong>sebelum</strong> masuk ke TSDB.</p>
    <pre data-lang="yaml">    metric_relabel_configs:
      # Buang metrik yang tidak pernah dipakai
      - source_labels: [__name__]
        action: drop
        regex: "container_(network_tcp|blkio|tasks_state).*"

      # Buang label berkardinalitas tinggi tapi PERTAHANKAN metriknya
      - action: labeldrop
        regex: "id|image_id|container_id"</pre>
    <p>Perubahan ini hanya berlaku untuk data <strong>baru</strong>. Data lama tetap ada sampai retensinya habis.</p>
</div>

<h3>Membatasi Target yang Nakal</h3>
<pre data-lang="yaml" data-file="batas">  - job_name: aplikasi-pihak-ketiga
    # Tolak target yang mengekspos terlalu banyak series -> lindungi Prometheus
    sample_limit: 20000
    label_limit: 30
    label_name_length_limit: 200
    label_value_length_limit: 500
    target_limit: 200
    static_configs:
      - targets: ["app:9090"]</pre>
<div class="callout callout-warn">
    <div class="callout-title">⚠️ <code>sample_limit</code> menyelamatkan, tapi diam-diam</div>
    <p>Bila target melewati batas, seluruh scrape-nya <strong>dibuang</strong> dan target ditandai gagal. Ini melindungi Prometheus, tetapi Anda kehilangan data tanpa peringatan jelas. Pasangkan dengan alert:</p>
    <pre data-lang="promql">up == 0 and on (job) (scrape_samples_scraped &gt; 0)</pre>
</div>
`,
    lab: {
        intro: `
<h3>Praktik: Memangkas Kardinalitas dengan metric_relabel_configs</h3>
<p>cAdvisor secara bawaan mengekspos ribuan metrik. Konfigurasi berikut hanya menyimpan yang benar-benar dipakai — pola yang wajib dikuasai sebelum menjalankan Prometheus di Kubernetes.</p>`,
        files: [{
            name: 'prometheus-produksi.yml', lang: 'yaml', code: `global:
  scrape_interval:     30s
  evaluation_interval: 30s
  scrape_timeout:      15s
  external_labels:
    cluster: produksi-jkt
    replica: prom-01

rule_files:
  - /etc/prometheus/rules/*.yml

alerting:
  alertmanagers:
    - static_configs:
        - targets: ["alertmanager:9093"]

scrape_configs:
  # ── Target dari berkas, digenerate oleh Ansible ──────────
  - job_name: node
    file_sd_configs:
      - files: ["/etc/prometheus/targets/node-*.json"]
        refresh_interval: 60s
    metric_relabel_configs:
      # Simpan HANYA metrik yang benar-benar dipakai dashboard & alert
      - source_labels: [__name__]
        action: keep
        regex: "node_(cpu_seconds_total|memory_(MemAvailable|MemTotal)_bytes|filesystem_(avail|size)_bytes|load[0-9]+|network_(receive|transmit)_bytes_total|disk_io_time_seconds_total|boot_time_seconds|uname_info|time_seconds)|up|scrape_.*"

  # ── cAdvisor: sangat boros, harus dipangkas ──────────────
  - job_name: cadvisor
    static_configs:
      - targets: ["cadvisor:8080"]
    sample_limit: 50000
    metric_relabel_configs:
      - source_labels: [__name__]
        action: keep
        regex: "container_(cpu_usage_seconds_total|memory_working_set_bytes|memory_rss|network_(receive|transmit)_bytes_total|fs_usage_bytes|spec_(cpu_quota|memory_limit_bytes))"
      # Buang metrik container POD infrastruktur yang tidak informatif
      - source_labels: [container]
        action: drop
        regex: "^$|POD"
      # Buang label berkardinalitas tinggi
      - action: labeldrop
        regex: "id|image|image_id|container_id"

  # ── Aplikasi sendiri ────────────────────────────────────
  - job_name: api
    scrape_interval: 15s
    file_sd_configs:
      - files: ["/etc/prometheus/targets/api-*.json"]
    sample_limit: 20000
    relabel_configs:
      # Hanya scrape target berlingkungan produksi
      - source_labels: [lingkungan]
        action: keep
        regex: "produksi"
      # Ambil hostname dari instance untuk label yang lebih rapi
      - source_labels: [__address__]
        regex: "([^:]+):.*"
        target_label: host
        replacement: $1
    metric_relabel_configs:
      # Buang metrik runtime Go yang jarang dipakai
      - source_labels: [__name__]
        action: drop
        regex: "go_(gc_duration_seconds|memstats_(frees|lookups|mallocs)_total).*"

  # ── Blackbox: probe dari luar ───────────────────────────
  - job_name: blackbox-http
    metrics_path: /probe
    params: { module: [http_2xx] }
    file_sd_configs:
      - files: ["/etc/prometheus/targets/probe-*.json"]
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox-exporter:9115

  # ── Prometheus memantau dirinya sendiri ─────────────────
  - job_name: prometheus
    static_configs:
      - targets: ["localhost:9090"]` }],
        steps: [
            { note: 'Validasi konfigurasi sebelum dipakai', cmd: 'promtool check config prometheus-produksi.yml' },
            { note: 'Lihat berapa sampel yang di-scrape per target — deteksi target boros', cmd: 'promql topk(10, scrape_samples_scraped)' },
            { note: 'Cek target yang gagal beserta alasannya', cmd: 'targets' },
            { note: 'Uji relabel tanpa menjalankan Prometheus', cmd: 'promtool check service-discovery prometheus-produksi.yml api' }
        ],
        snippets: ['promtool check config prometheus.yml', 'promql topk(10, scrape_samples_scraped)', 'targets', 'promql prometheus_tsdb_head_series']
    },
    pitfalls: [
        {
            kind: 'salah', title: 'Semua target blackbox berstatus DOWN',
            body: `<p>Blackbox exporter membutuhkan tiga baris <code>relabel_configs</code> yang khas. Tanpa itu, Prometheus mencoba men-scrape <code>https://situs-anda.id/probe</code> — yang tidak ada.</p>
<pre data-lang="yaml">    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox-exporter:9115</pre>
<p>Urutannya penting: alamat asli dipindah ke parameter dulu, baru <code>__address__</code> diganti dengan alamat exporter.</p>`
        },
        {
            kind: 'larangan', title: 'Jangan menjalankan cAdvisor atau kube-state-metrics tanpa filter',
            body: `<p>Keduanya bisa mengekspos <strong>ratusan ribu time series</strong> di klaster berukuran sedang. Tanpa <code>metric_relabel_configs</code>, Prometheus Anda akan kehabisan memori dalam hitungan hari — dan biasanya baru ketahuan saat Anda paling membutuhkannya.</p>
<p>Mulai dengan <code>action: keep</code> dan daftar metrik yang <strong>benar-benar dipakai</strong> dashboard dan alert Anda. Menambahkan metrik baru nanti jauh lebih mudah daripada memulihkan Prometheus yang mati.</p>`
        },
        {
            kind: 'salah', title: 'Mengubah relabel tapi data lama tidak berubah',
            body: `<p><code>metric_relabel_configs</code> hanya berlaku untuk data yang <strong>baru</strong> di-scrape. Time series lama tetap tersimpan sampai retensinya habis, dan tetap memakan memori di TSDB head selama masih aktif.</p>
<p>Untuk menghapus data lama secara paksa (bila benar-benar perlu), aktifkan <code>--web.enable-admin-api</code> lalu gunakan endpoint <code>/api/v1/admin/tsdb/delete_series</code> — tetapi matikan kembali flag tersebut setelahnya, karena ia sangat berbahaya bila terekspos.</p>`
        },
        {
            kind: 'best', title: 'Pakai `file_sd` bila belum memakai Kubernetes',
            body: `<p><code>file_sd_configs</code> memberi 90% manfaat service discovery dengan 10% kompleksitasnya: berkas JSON dimuat ulang otomatis tanpa reload Prometheus, dan bisa digenerate oleh Ansible, Terraform, atau skrip sederhana yang membaca inventory Anda.</p>
<p>Ini jauh lebih baik daripada <code>static_configs</code> yang harus diedit manual dan di-reload setiap ada server baru.</p>`
        },
        {
            kind: 'kasus', title: 'Sharding Prometheus dengan hashmod',
            body: `<p>Ketika satu Prometheus tidak lagi sanggup men-scrape semua target, Anda bisa membagi target ke beberapa instance dengan <code>hashmod</code> — pembagian bersifat deterministik sehingga setiap target selalu jatuh ke shard yang sama.</p>
<pre data-lang="yaml">    relabel_configs:
      - source_labels: [__address__]
        modulus: 4
        target_label: __tmp_shard
        action: hashmod
      - source_labels: [__tmp_shard]
        action: keep
        regex: "\${SHARD_ID}"</pre>
<p>Gabungkan hasilnya di Thanos Query atau Grafana Mimir agar tetap bisa di-query sebagai satu kesatuan.</p>`
        }
    ],
    quiz: [
        {
            q: 'Anda ingin membuang metrik dari cAdvisor yang tidak pernah dipakai, agar hemat memori. Konfigurasi mana yang tepat?',
            opts: [
                '<code>relabel_configs</code> dengan <code>action: drop</code>',
                '<code>metric_relabel_configs</code> dengan <code>action: keep</code> pada daftar metrik yang dipakai',
                'Menurunkan <code>scrape_interval</code>',
                'Menaikkan retensi'
            ],
            a: 1,
            exp: '<code>relabel_configs</code> bekerja pada <em>target</em> sebelum scrape. Untuk memfilter <em>metrik</em> setelah di-scrape tetapi sebelum disimpan, gunakan <code>metric_relabel_configs</code>. Pendekatan <code>keep</code> (allowlist) lebih aman daripada <code>drop</code> karena metrik baru yang tak terduga tidak akan lolos.'
        },
        {
            q: 'Apa keunggulan <code>file_sd_configs</code> dibanding <code>static_configs</code>?',
            opts: [
                'Lebih cepat men-scrape',
                'Berkas target dimuat ulang otomatis tanpa perlu reload Prometheus',
                'Mendukung lebih banyak metrik',
                'Tidak butuh validasi konfigurasi'
            ],
            a: 1,
            exp: 'Prometheus memantau berkas <code>file_sd</code> dan memuat perubahannya otomatis. Berkas JSON-nya bisa digenerate oleh Ansible atau Terraform, sehingga daftar target selalu mengikuti infrastruktur tanpa intervensi manual.'
        },
        {
            q: 'Setelah menambahkan <code>action: labeldrop</code> untuk label <code>container_id</code>, jumlah time series tidak turun. Kenapa?',
            opts: [
                'labeldrop tidak berfungsi',
                'Perubahan hanya berlaku untuk data baru; series lama tetap ada sampai retensi habis',
                'Harus me-restart Prometheus',
                'Harus memakai <code>labelkeep</code>'
            ],
            a: 1,
            exp: 'Relabeling memengaruhi data yang <strong>akan</strong> disimpan. Time series lama tetap ada di TSDB sampai retensinya lewat. Penurunan jumlah series akan terlihat bertahap seiring series lama menjadi tidak aktif (<em>stale</em>).'
        }
    ]
},

/* --------------------------------------------------------------- 11 ----- */
{
    id: 11,
    cat: '4 · Produksi',
    title: 'Recording Rules: Mempercepat Query & Menstabilkan Dashboard',
    level: 'Menengah', dur: '14 mnt',
    tags: ['recording rules', 'performa', 'agregasi', 'penamaan', 'slo'],
    desc: 'Menghitung query mahal sekali di belakang layar, lalu memakainya berulang kali — teknik wajib untuk dashboard dan SLO.',
    theory: `
<h2>Masalah: Query yang Sama Dihitung Ribuan Kali</h2>
<p>Sebuah dashboard dengan 12 panel, dibuka 20 orang, dengan auto-refresh 10 detik, akan menjalankan query berat berulang-ulang. Bila salah satunya memindai 30 hari data, Prometheus Anda akan tersengal.</p>
<p><strong>Recording rule</strong> menghitung ekspresi secara berkala di belakang layar dan menyimpan hasilnya sebagai time series baru. Dashboard tinggal membaca hasilnya — instan.</p>

<h3>Bentuk Dasar</h3>
<pre data-lang="yaml" data-file="rules/recording.yml">groups:
  - name: agregasi-http
    interval: 30s          # seberapa sering dihitung (default: evaluation_interval)
    rules:
      - record: job:http_requests:rate5m
        expr: sum by (job) (rate(http_requests_total[5m]))

      - record: job:http_errors:rate5m
        expr: sum by (job) (rate(http_requests_total{status=~"5.."}[5m]))

      - record: job:http_error_ratio:rate5m
        expr: job:http_errors:rate5m / job:http_requests:rate5m

      - record: job_route:http_latency_p95:5m
        expr: |
          histogram_quantile(0.95,
            sum by (le, job, route) (rate(http_request_duration_seconds_bucket[5m])))</pre>

<div class="callout callout-accent">
    <div class="callout-title">📌 Konvensi penamaan resmi: <code>level:metrik:operasi</code></div>
    <ul>
        <li><strong>level</strong> — label yang dipertahankan setelah agregasi (<code>job</code>, <code>instance</code>, <code>job_route</code>).</li>
        <li><strong>metrik</strong> — nama metrik asal, tanpa <code>_total</code>.</li>
        <li><strong>operasi</strong> — apa yang dilakukan (<code>rate5m</code>, <code>sum</code>, <code>p95</code>).</li>
    </ul>
    <p>Contoh: <code>job:http_requests:rate5m</code> langsung memberi tahu pembaca bahwa ini adalah laju request 5 menit yang diagregasi per job. Tanpa konvensi, dalam enam bulan tidak akan ada yang tahu isi metrik <code>hasil_query_3</code>.</p>
</div>

<h3>Aturan Berlapis (Rule Chaining)</h3>
<p>Recording rule boleh memakai hasil rule lain — <strong>selama berada dalam grup yang sama</strong>, karena rule dalam satu grup dievaluasi berurutan.</p>
<pre data-lang="yaml" data-file="berlapis">groups:
  - name: slo-checkout
    interval: 30s
    rules:
      # Lapis 1: angka dasar
      - record: checkout:requests:rate5m
        expr: sum(rate(http_requests_total{job="checkout"}[5m]))

      - record: checkout:errors:rate5m
        expr: sum(rate(http_requests_total{job="checkout", status=~"5.."}[5m]))

      # Lapis 2: memakai hasil lapis 1
      - record: checkout:error_ratio:rate5m
        expr: checkout:errors:rate5m / checkout:requests:rate5m

      # Lapis 3: burn rate terhadap SLO 99,9%
      - record: checkout:burn_rate:1h
        expr: |
          (
            sum(rate(http_requests_total{job="checkout", status=~"5.."}[1h]))
            / sum(rate(http_requests_total{job="checkout"}[1h]))
          ) / 0.001</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Rule di grup berbeda TIDAK dijamin urut</div>
    <p>Grup dievaluasi secara paralel. Bila rule di grup B memakai hasil rule di grup A, ada kemungkinan grup B berjalan sebelum grup A selesai — sehingga ia membaca nilai lama atau tidak menemukan apa pun.</p>
    <p><strong>Aturan:</strong> rule yang saling bergantung harus berada dalam <code>group</code> yang sama, dan ditulis dalam urutan yang benar.</p>
</div>

<h3>Kapan Membuat Recording Rule</h3>
<table>
<thead><tr><th>Buat recording rule bila…</th><th>Jangan buat bila…</th></tr></thead>
<tbody>
<tr><td>Query dipakai di banyak panel/alert</td><td>Query hanya dipakai sekali untuk investigasi</td></tr>
<tr><td>Query memakan waktu &gt; 1 detik</td><td>Query sudah cepat</td></tr>
<tr><td>Query memakai rentang panjang (<code>[7d]</code>, <code>[30d]</code>)</td><td>Ekspresinya sering berubah-ubah</td></tr>
<tr><td>Dipakai di alerting rule</td><td>—</td></tr>
<tr><td>Dashboard terasa lambat dibuka</td><td>—</td></tr>
</tbody>
</table>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ Recording rule juga memakan tempat</div>
    <p>Setiap rule menciptakan time series baru yang ikut disimpan dan dihitung dalam kardinalitas. Rule <code>sum by (pod)</code> pada klaster dengan 5.000 pod akan menambah 5.000 series baru.</p>
    <p>Agregasi ke level yang lebih tinggi (per <code>job</code>, bukan per <code>pod</code>) biasanya justru <strong>mengurangi</strong> total series — itulah tujuan yang ideal.</p>
</div>
`,
    lab: {
        intro: `
<h3>Praktik: Recording Rules untuk Dashboard SLO</h3>
<p>Berkas ini menyiapkan seluruh angka yang dibutuhkan dashboard SLO. Setelah aktif, panel Grafana Anda akan terbuka seketika alih-alih memindai jutaan sampel.</p>`,
        files: [{
            name: 'rules/recording.yml', lang: 'yaml', code: `groups:
  # ══ Agregasi dasar — dipakai hampir semua dashboard ══════
  - name: http-dasar
    interval: 30s
    rules:
      - record: job:http_requests:rate5m
        expr: sum by (job) (rate(http_requests_total[5m]))

      - record: job:http_errors:rate5m
        expr: sum by (job) (rate(http_requests_total{status=~"5.."}[5m]))

      - record: job:http_error_ratio:rate5m
        expr: |
          job:http_errors:rate5m
            / clamp_min(job:http_requests:rate5m, 0.001)

      - record: job_route:http_requests:rate5m
        expr: sum by (job, route) (rate(http_requests_total[5m]))

      - record: job:http_latency_p95:5m
        expr: |
          histogram_quantile(0.95,
            sum by (le, job) (rate(http_request_duration_seconds_bucket[5m])))

      - record: job:http_latency_p99:5m
        expr: |
          histogram_quantile(0.99,
            sum by (le, job) (rate(http_request_duration_seconds_bucket[5m])))

  # ══ Sumber daya node ═════════════════════════════════════
  - name: node-dasar
    interval: 30s
    rules:
      - record: instance:node_cpu_utilisation:rate5m
        expr: |
          1 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m]))

      - record: instance:node_memory_utilisation:ratio
        expr: |
          1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)

      - record: instance:node_filesystem_usage:ratio
        expr: |
          1 - (node_filesystem_avail_bytes{fstype!~"tmpfs|overlay"}
               / node_filesystem_size_bytes{fstype!~"tmpfs|overlay"})

  # ══ SLO & error budget ═══════════════════════════════════
  # Multi-window burn rate: pola resmi Google SRE Workbook.
  - name: slo-checkout
    interval: 30s
    rules:
      - record: slo:checkout_error_ratio:rate5m
        expr: |
          sum(rate(http_requests_total{job="checkout", status=~"5.."}[5m]))
            / clamp_min(sum(rate(http_requests_total{job="checkout"}[5m])), 0.001)

      - record: slo:checkout_error_ratio:rate30m
        expr: |
          sum(rate(http_requests_total{job="checkout", status=~"5.."}[30m]))
            / clamp_min(sum(rate(http_requests_total{job="checkout"}[30m])), 0.001)

      - record: slo:checkout_error_ratio:rate1h
        expr: |
          sum(rate(http_requests_total{job="checkout", status=~"5.."}[1h]))
            / clamp_min(sum(rate(http_requests_total{job="checkout"}[1h])), 0.001)

      - record: slo:checkout_error_ratio:rate6h
        expr: |
          sum(rate(http_requests_total{job="checkout", status=~"5.."}[6h]))
            / clamp_min(sum(rate(http_requests_total{job="checkout"}[6h])), 0.001)

      # Burn rate = rasio error dibagi anggaran error (SLO 99,9% -> 0,001)
      - record: slo:checkout_burn_rate:5m
        expr: slo:checkout_error_ratio:rate5m / 0.001
      - record: slo:checkout_burn_rate:1h
        expr: slo:checkout_error_ratio:rate1h / 0.001
      - record: slo:checkout_burn_rate:6h
        expr: slo:checkout_error_ratio:rate6h / 0.001` }],
        steps: [
            { note: 'Validasi berkas rule sebelum dipakai', cmd: 'promtool check rules rules/recording.yml', out: 'Checking rules/recording.yml\n  SUCCESS: 17 rules found' },
            { note: 'Muat ulang Prometheus', cmd: 'curl -X POST http://localhost:9090/-/reload' },
            { note: 'Pastikan metrik hasil rekaman sudah muncul (tunggu 1 interval)', cmd: 'promql job:http_requests:rate5m' },
            { note: 'Periksa apakah evaluasi rule tertinggal — indikator Prometheus kelebihan beban', cmd: 'promql prometheus_rule_group_last_duration_seconds > prometheus_rule_group_interval_seconds' }
        ],
        snippets: ['promtool check rules rules/recording.yml', 'promql job:http_requests:rate5m', 'promql slo:checkout_burn_rate:1h']
    },
    pitfalls: [
        {
            kind: 'salah', title: 'Rule berlapis di grup berbeda menghasilkan data kosong',
            body: `<p>Grup rule dievaluasi <strong>paralel</strong>, tidak berurutan. Bila <code>b:rasio</code> di grup B memakai <code>a:total</code> dari grup A, ada kemungkinan grup B berjalan lebih dulu dan membaca nilai lama — atau tidak menemukan apa pun pada evaluasi pertama.</p>
<p>Letakkan rule yang saling bergantung dalam <strong>satu grup</strong>, ditulis berurutan dari lapis dasar ke lapis turunan.</p>`
        },
        {
            kind: 'larangan', title: 'Jangan pakai nama metrik biasa untuk hasil rekaman',
            body: `<p>Menamai hasil rekaman <code>http_requests_rate</code> membuatnya tidak bisa dibedakan dari metrik asli yang di-scrape. Dalam enam bulan, tidak akan ada yang tahu metrik itu datang dari mana, apakah aman diubah, atau siapa yang memakainya.</p>
<p>Selalu pakai format <code>level:metrik:operasi</code> dengan titik dua. Titik dua tidak pernah muncul di metrik hasil scrape, sehingga menjadi penanda visual yang jelas.</p>`
        },
        {
            kind: 'salah', title: 'Pembagian menghasilkan NaN saat trafik nol',
            body: `<p><code>errors / requests</code> menghasilkan <code>NaN</code> ketika penyebutnya nol — misalnya pada dini hari saat tidak ada trafik. Panel Grafana akan menampilkan garis putus dan alert bisa berperilaku tak terduga.</p>
<pre data-lang="promql">✅ errors / clamp_min(requests, 0.001)</pre>
<p><code>clamp_min</code> memastikan penyebut tidak pernah nol, sehingga hasilnya tetap 0 (bukan NaN) saat tidak ada trafik.</p>`
        },
        {
            kind: 'best', title: 'Pantau kesehatan evaluasi rule',
            body: `<p>Bila jumlah rule terlalu banyak atau ekspresinya terlalu berat, evaluasi bisa tertinggal dari intervalnya. Akibatnya alert terlambat berbunyi — persis di saat Anda paling membutuhkannya.</p>
<pre data-lang="promql"># Grup yang evaluasinya lebih lama dari intervalnya
prometheus_rule_group_last_duration_seconds
  &gt; prometheus_rule_group_interval_seconds

# Rule yang gagal dievaluasi
rate(prometheus_rule_evaluation_failures_total[5m]) &gt; 0</pre>`
        }
    ],
    quiz: [
        {
            q: 'Apa arti nama metrik <code>job:http_requests:rate5m</code>?',
            opts: [
                'Metrik mentah dari job bernama http',
                'Hasil rekaman: laju request 5 menit, diagregasi hingga level label <code>job</code>',
                'Alert yang berbunyi tiap 5 menit',
                'Metrik yang di-scrape setiap 5 menit'
            ],
            a: 1,
            exp: 'Konvensi <code>level:metrik:operasi</code>: <code>job</code> adalah label yang dipertahankan, <code>http_requests</code> metrik asalnya, <code>rate5m</code> operasinya. Titik dua menandakan ini hasil recording rule, bukan metrik hasil scrape.'
        },
        {
            q: 'Rule <code>b:rasio</code> memakai hasil <code>a:total</code>, tetapi keduanya di grup berbeda. Apa risikonya?',
            opts: [
                'Tidak ada risiko',
                'Grup dievaluasi paralel, sehingga <code>b:rasio</code> bisa membaca nilai lama atau kosong',
                'Prometheus akan menolak konfigurasi',
                'Hasilnya selalu dua kali lipat'
            ],
            a: 1,
            exp: 'Urutan evaluasi hanya dijamin <strong>di dalam</strong> satu grup. Antar-grup, evaluasi berjalan paralel. Rule yang saling bergantung harus berada dalam grup yang sama dan ditulis berurutan.'
        },
        {
            q: 'Kapan recording rule paling bermanfaat?',
            opts: [
                'Untuk semua query tanpa terkecuali',
                'Untuk query mahal atau berentang panjang yang dipakai berulang di dashboard dan alert',
                'Hanya untuk metrik counter',
                'Hanya saat memakai Grafana'
            ],
            a: 1,
            exp: 'Recording rule menukar sedikit ruang penyimpanan dengan kecepatan query yang jauh lebih baik. Paling bermanfaat untuk ekspresi mahal (rentang panjang, banyak series) yang sering dipanggil. Untuk query sekali pakai saat investigasi, ia hanya menambah beban tanpa manfaat.'
        }
    ]
},

/* --------------------------------------------------------------- 12 ----- */
{
    id: 12,
    cat: '4 · Produksi',
    title: 'Alerting Rules: Menulis Alert yang Layak Dibunyikan',
    level: 'Menengah', dur: '18 mnt',
    tags: ['alerting', 'alert', 'for', 'annotations', 'severity', 'burn rate'],
    desc: 'Membuat alert yang benar-benar berarti, memakai for dan label dengan tepat, serta menghindari alert fatigue.',
    theory: `
<h2>Alert yang Buruk Lebih Berbahaya daripada Tidak Ada Alert</h2>
<p>Ketika tim menerima 200 notifikasi sehari, mereka berhenti membacanya. Insiden nyata pun lolos. Ini disebut <strong>alert fatigue</strong>, dan ia adalah penyebab utama gagalnya sistem monitoring yang secara teknis sempurna.</p>

<div class="callout callout-accent">
    <div class="callout-title">📌 Satu aturan penyaring: "apakah manusia harus bertindak sekarang?"</div>
    <p>Bila jawabannya <strong>tidak</strong>, itu bukan alert — itu dashboard. Setiap alert yang berbunyi harus punya tindakan jelas yang harus diambil seseorang. Bila tindakannya "lihat sebentar lalu abaikan", hapus alert itu.</p>
</div>

<h3>Anatomi Alerting Rule</h3>
<pre data-lang="yaml" data-file="rules/alerts.yml">groups:
  - name: layanan-api
    rules:
      - alert: ErrorRateTinggi
        expr: job:http_error_ratio:rate5m{job="api"} > 0.05
        for: 10m                       # harus benar selama 10 menit berturut-turut
        keep_firing_for: 5m            # tetap firing 5 menit setelah kondisi hilang
        labels:
          severity: critical           # dipakai Alertmanager untuk routing
          tim: checkout
          layanan: api
        annotations:
          summary: "Error rate {{ $labels.job }} mencapai {{ $value | humanizePercentage }}"
          description: >-
            Job {{ $labels.job }} pada {{ $labels.instance }} mengembalikan
            error di atas 5% selama lebih dari 10 menit.
            Nilai saat ini: {{ $value | humanizePercentage }}.
          runbook_url: "https://wiki.internal/runbook/error-rate-tinggi"
          dashboard_url: "https://grafana.internal/d/api-overview"</pre>

<h3><code>for</code> — Peredam Kebisingan yang Paling Penting</h3>
<p>Tanpa <code>for</code>, satu spike sesaat langsung membangunkan orang di tengah malam. Dengan <code>for: 10m</code>, alert baru berbunyi bila kondisinya bertahan.</p>
<table>
<thead><tr><th>Jenis alert</th><th><code>for</code> yang disarankan</th></tr></thead>
<tbody>
<tr><td>Target mati (<code>up == 0</code>)</td><td><code>2m–5m</code> — beri toleransi restart wajar</td></tr>
<tr><td>Error rate tinggi</td><td><code>5m–15m</code></td></tr>
<tr><td>Latency tinggi</td><td><code>10m–15m</code></td></tr>
<tr><td>Disk hampir penuh</td><td><code>15m–1h</code> — tidak mendesak</td></tr>
<tr><td>Sertifikat kedaluwarsa</td><td><code>1h</code> — sangat tidak mendesak</td></tr>
<tr><td>Layanan pembayaran mati total</td><td><code>0m–1m</code> — memang harus segera</td></tr>
</tbody>
</table>

<h3>Template dalam Annotation</h3>
<pre data-lang="yaml" data-file="template">        annotations:
          # $labels — semua label dari series yang memicu alert
          summary: "{{ $labels.instance }} di {{ $labels.region }} bermasalah"

          # $value — nilai ekspresi saat alert aktif
          description: "Nilai saat ini: {{ $value }}"

          # Fungsi bantu pemformatan
          info: >-
            Persentase: {{ $value | humanizePercentage }}
            Byte:       {{ $value | humanize1024 }}B
            Durasi:     {{ $value | humanizeDuration }}
            Dibulatkan: {{ $value | printf "%.2f" }}

          # Kondisional
          catatan: '{{ if gt $value 0.5 }}KRITIS{{ else }}perhatian{{ end }}'</pre>

<h3>Pola Alert yang Terbukti Berguna</h3>
<pre data-lang="yaml" data-file="pola-alert">      # 1. Target mati — pasangkan SELALU dengan absent()
      - alert: TargetMati
        expr: up == 0
        for: 3m
        labels: { severity: critical }

      - alert: JobHilangDariKonfigurasi
        expr: absent(up{job="pembayaran"})
        for: 10m
        labels: { severity: critical }

      # 2. Kapasitas prediktif — beri waktu untuk bertindak
      - alert: DiskAkanPenuh
        expr: |
          predict_linear(node_filesystem_avail_bytes{fstype!~"tmpfs|overlay"}[6h], 4*3600) < 0
          and node_filesystem_avail_bytes / node_filesystem_size_bytes < 0.3
        for: 30m
        labels: { severity: warning }

      # 3. Aplikasi restart berulang (crash loop)
      - alert: AplikasiCrashLoop
        expr: changes(process_start_time_seconds[15m]) > 3
        for: 5m
        labels: { severity: critical }

      # 4. Metrik bisnis — sering menangkap yang lolos alert teknis
      - alert: PesananAnjlok
        expr: |
          sum(rate(pesanan_dibuat_total[15m]))
            < 0.4 * sum(rate(pesanan_dibuat_total[15m] offset 7d))
        for: 20m
        labels: { severity: critical }
        annotations:
          summary: "Pesanan turun >60% dibanding minggu lalu jam yang sama"</pre>

<h3>Multi-Window Burn Rate — Pola SLO Modern</h3>
<p>Pola dari Google SRE Workbook: alert berbunyi cepat untuk masalah besar, dan lambat untuk masalah kecil yang berkepanjangan. Dua jendela waktu digabung agar tidak berbunyi karena spike sesaat.</p>
<pre data-lang="yaml" data-file="burn-rate">      # Cepat: budget 30 hari habis dalam ~2 jam -> bangunkan orang
      - alert: SLOBurnRateCepat
        expr: |
          slo:checkout_burn_rate:5m > 14.4
          and slo:checkout_burn_rate:1h > 14.4
        for: 2m
        labels: { severity: critical, tipe: slo }
        annotations:
          summary: "Error budget checkout habis dalam ~2 jam pada laju ini"

      # Lambat: budget habis dalam ~3 hari -> buat tiket, tidak perlu dibangunkan
      - alert: SLOBurnRateLambat
        expr: |
          slo:checkout_burn_rate:6h > 6
          and slo:checkout_burn_rate:1h > 6
        for: 15m
        labels: { severity: warning, tipe: slo }</pre>

<div class="callout callout-tip">
    <div class="callout-title">💡 Kenapa dua jendela sekaligus?</div>
    <p>Jendela panjang (<code>6h</code>) memastikan masalahnya nyata dan berkelanjutan. Jendela pendek (<code>1h</code>) memastikan masalahnya <strong>masih berlangsung sekarang</strong> — sehingga alert otomatis padam setelah insiden selesai, tanpa harus menunggu jendela panjang bergeser.</p>
</div>
`,
    lab: {
        intro: `
<h3>Praktik: Menguji Alert Sebelum Dipercaya</h3>
<p><code>promtool test rules</code> memungkinkan Anda menulis unit test untuk alert — memberi data palsu, lalu memastikan alert berbunyi tepat pada saat yang seharusnya. Ini praktik yang jarang dipakai padahal sangat berharga.</p>`,
        files: [
            {
                name: 'rules/alerts.yml', lang: 'yaml', code: `groups:
  - name: kesehatan-layanan
    rules:
      - alert: TargetMati
        expr: up == 0
        for: 3m
        labels:
          severity: critical
        annotations:
          summary: "{{ $labels.job }} pada {{ $labels.instance }} tidak merespons"
          description: "Prometheus gagal men-scrape selama lebih dari 3 menit."
          runbook_url: "https://wiki.internal/runbook/target-mati"

      - alert: JobPembayaranHilang
        expr: absent(up{job="pembayaran"})
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "Job pembayaran tidak ada di Prometheus — monitoring buta"

      - alert: ErrorRateTinggi
        expr: job:http_error_ratio:rate5m > 0.05
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "Error rate {{ $labels.job }} = {{ $value | humanizePercentage }}"

      - alert: LatencyTinggi
        expr: job:http_latency_p95:5m > 1
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "p95 {{ $labels.job }} = {{ $value | printf \\"%.2f\\" }}s"

      - alert: AplikasiCrashLoop
        expr: changes(process_start_time_seconds[15m]) > 3
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "{{ $labels.instance }} restart {{ $value }} kali dalam 15 menit"

  - name: sumber-daya
    rules:
      - alert: DiskAkanPenuh
        expr: |
          predict_linear(node_filesystem_avail_bytes{fstype!~"tmpfs|overlay"}[6h], 4*3600) < 0
          and
          instance:node_filesystem_usage:ratio > 0.7
        for: 30m
        labels:
          severity: warning
        annotations:
          summary: "{{ $labels.instance }} {{ $labels.mountpoint }} diprediksi penuh < 4 jam"

      - alert: MemoriHampirHabis
        expr: instance:node_memory_utilisation:ratio > 0.92
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Memori {{ $labels.instance }} {{ $value | humanizePercentage }}"`
            },
            {
                name: 'rules/alerts_test.yml', lang: 'yaml', code: `# Unit test untuk alerting rules.
# Jalankan: promtool test rules rules/alerts_test.yml
rule_files:
  - alerts.yml
  - recording.yml

evaluation_interval: 1m

tests:
  # ── Kasus 1: target mati harus memicu alert setelah 3 menit ──
  - interval: 1m
    input_series:
      - series: 'up{job="api", instance="10.0.0.5:8080"}'
        values: '1 1 0 0 0 0 0 0'          # mati mulai menit ke-2

    alert_rule_test:
      # Pada menit ke-3, 'for: 3m' belum terpenuhi -> belum firing
      - eval_time: 3m
        alertname: TargetMati
        exp_alerts: []

      # Pada menit ke-6, sudah 4 menit mati -> firing
      - eval_time: 6m
        alertname: TargetMati
        exp_alerts:
          - exp_labels:
              severity: critical
              job: api
              instance: 10.0.0.5:8080
            exp_annotations:
              summary: "api pada 10.0.0.5:8080 tidak merespons"
              description: "Prometheus gagal men-scrape selama lebih dari 3 menit."
              runbook_url: "https://wiki.internal/runbook/target-mati"

  # ── Kasus 2: spike sesaat TIDAK boleh memicu alert ──────────
  - interval: 1m
    input_series:
      - series: 'up{job="api", instance="10.0.0.6:8080"}'
        values: '1 1 0 1 1 1 1 1'          # mati hanya 1 menit

    alert_rule_test:
      - eval_time: 7m
        alertname: TargetMati
        exp_alerts: []                     # 'for: 3m' meredam spike ini

  # ── Kasus 3: job hilang total dari konfigurasi ──────────────
  - interval: 1m
    input_series:
      - series: 'up{job="api"}'
        values: '1+0x15'                   # job lain ada, pembayaran tidak

    alert_rule_test:
      - eval_time: 12m
        alertname: JobPembayaranHilang
        exp_alerts:
          - exp_labels:
              severity: critical
            exp_annotations:
              summary: "Job pembayaran tidak ada di Prometheus — monitoring buta"` }
        ],
        steps: [
            { note: 'Validasi sintaks rule', cmd: 'promtool check rules rules/alerts.yml' },
            { note: 'Jalankan unit test alert — ini yang membedakan alert yang teruji dan yang cuma "kelihatannya benar"', cmd: 'promtool test rules rules/alerts_test.yml', out: 'Unit Testing:  rules/alerts_test.yml\n  SUCCESS' },
            { note: 'Lihat alert yang sedang aktif', cmd: 'promql ALERTS{alertstate="firing"}' },
            { note: 'Lihat alert yang sedang pending (menunggu durasi `for`)', cmd: 'promql ALERTS{alertstate="pending"}' }
        ],
        snippets: ['promtool check rules rules/alerts.yml', 'promtool test rules rules/alerts_test.yml', 'promql ALERTS{alertstate="firing"}']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'Jangan membuat alert tanpa tindakan yang jelas',
            body: `<p>Alert seperti "CPU 80%" tanpa konteks tidak bisa ditindaklanjuti — CPU 80% pada batch job adalah hal normal, pada API adalah masalah. Alert semacam ini akan diabaikan, dan kebiasaan mengabaikan akan menular ke alert yang benar-benar penting.</p>
<p><strong>Setiap alert wajib punya:</strong> <code>runbook_url</code> berisi langkah penanganan, <code>severity</code> yang menentukan apakah perlu membangunkan orang, dan pemilik yang jelas lewat label <code>tim</code>.</p>`
        },
        {
            kind: 'salah', title: 'Lupa `for` sehingga alert berkedip terus',
            body: `<p>Tanpa <code>for</code>, alert berbunyi begitu kondisi terpenuhi walau hanya satu evaluasi. Satu spike 15 detik akan mengirim notifikasi, lalu resolved, lalu firing lagi — sebuah pola yang disebut <em>flapping</em> dan sangat cepat membuat tim kebal terhadap notifikasi.</p>
<p>Gunakan <code>for</code> minimal 2–5 menit untuk hampir semua alert. Pengecualian hanya untuk kegagalan total layanan yang benar-benar kritis.</p>`
        },
        {
            kind: 'salah', title: 'Alert tidak berbunyi karena metriknya hilang',
            body: `<p><code>up{job="pembayaran"} == 0</code> hanya bisa aktif bila series <code>up{job="pembayaran"}</code> <strong>ada</strong>. Bila seseorang tidak sengaja menghapus job itu dari konfigurasi, tidak ada series sama sekali — dan alert Anda diam sempurna sementara layanan tidak terpantau.</p>
<p>Untuk setiap layanan kritis, buat <strong>dua</strong> alert: satu untuk kondisi buruk, satu dengan <code>absent()</code> untuk mendeteksi hilangnya metrik itu sendiri.</p>`
        },
        {
            kind: 'best', title: 'Uji alert dengan `promtool test rules`',
            body: `<p>Alert yang belum pernah diuji sering ternyata tidak berbunyi saat insiden nyata — salah nama label, ekspresi yang tidak pernah cocok, atau <code>for</code> yang terlalu panjang.</p>
<p><code>promtool test rules</code> membiarkan Anda memberi data palsu dan memverifikasi alert berbunyi pada waktu yang tepat. Jalankan ini di pipeline CI setiap kali berkas rule berubah — biayanya beberapa detik, manfaatnya sangat besar.</p>`
        },
        {
            kind: 'kasus', title: 'Alert bisnis menangkap apa yang lolos dari alert teknis',
            body: `<p>Kasus nyata yang sering terjadi: sebuah rilis frontend membuat tombol checkout tidak berfungsi. Semua metrik teknis hijau sempurna — CPU normal, error rate 0%, latency bagus — karena memang tidak ada request yang masuk ke checkout.</p>
<p>Yang menangkapnya adalah alert bisnis:</p>
<pre data-lang="promql">sum(rate(pesanan_dibuat_total[15m]))
  &lt; 0.4 * sum(rate(pesanan_dibuat_total[15m] offset 7d))</pre>
<p>Perbandingan dengan periode yang sama minggu lalu otomatis memperhitungkan pola harian dan mingguan, sehingga tidak berbunyi saat trafik memang sedang sepi di dini hari.</p>`
        }
    ],
    quiz: [
        {
            q: 'Apa fungsi <code>for: 10m</code> pada sebuah alerting rule?',
            opts: [
                'Alert akan berbunyi setiap 10 menit',
                'Kondisi harus terpenuhi terus-menerus selama 10 menit sebelum alert firing',
                'Alert otomatis resolved setelah 10 menit',
                'Ekspresi dievaluasi setiap 10 menit'
            ],
            a: 1,
            exp: '<code>for</code> menahan alert di status <em>pending</em> sampai kondisinya bertahan selama durasi tersebut. Ini peredam kebisingan paling penting — mencegah spike sesaat membangunkan orang di tengah malam.'
        },
        {
            q: 'Kenapa alert kritis sebaiknya dipasangkan dengan <code>absent()</code>?',
            opts: [
                'Agar lebih cepat berbunyi',
                'Karena alert berbasis kondisi tidak akan aktif bila series-nya hilang sama sekali',
                'Untuk mengurangi kardinalitas',
                'Karena Alertmanager mensyaratkannya'
            ],
            a: 1,
            exp: 'Bila job terhapus dari konfigurasi atau exporter dicopot, tidak ada series sehingga <code>up == 0</code> tidak menghasilkan apa pun dan alert diam. <code>absent()</code> justru bernilai 1 ketika series tidak ditemukan — inilah yang menangkap "monitoring-nya sendiri yang hilang".'
        },
        {
            q: 'Pada pola multi-window burn rate, kenapa memakai dua jendela waktu sekaligus?',
            opts: [
                'Untuk menghemat penyimpanan',
                'Jendela panjang memastikan masalahnya nyata; jendela pendek memastikan masalahnya masih berlangsung',
                'Karena Prometheus mensyaratkan minimal dua kondisi',
                'Agar alert berbunyi dua kali'
            ],
            a: 1,
            exp: 'Jendela panjang menyaring spike sesaat agar tidak memicu alert palsu. Jendela pendek memastikan alert otomatis padam setelah insiden selesai, tanpa harus menunggu jendela panjang bergeser sepenuhnya.'
        }
    ]
},

/* --------------------------------------------------------------- 13 ----- */
{
    id: 13,
    cat: '4 · Produksi',
    title: 'Alertmanager: Routing, Grouping, Inhibition & Silence',
    level: 'Lanjut', dur: '18 mnt',
    tags: ['alertmanager', 'routing', 'grouping', 'inhibition', 'silence', 'slack'],
    desc: 'Mengubah ratusan alert mentah menjadi sedikit notifikasi yang tepat sasaran, ke orang yang tepat, pada waktu yang tepat.',
    theory: `
<h2>Pembagian Tugas</h2>
<p>Prometheus <strong>menentukan kapan</strong> alert aktif. Alertmanager <strong>menentukan siapa yang diberi tahu, lewat apa, dan seberapa sering</strong>. Keduanya terpisah karena tanggung jawabnya memang berbeda.</p>

<h3>Empat Kemampuan Inti Alertmanager</h3>
<table>
<thead><tr><th>Fitur</th><th>Masalah yang diselesaikan</th></tr></thead>
<tbody>
<tr><td><strong>Grouping</strong></td><td>50 server mati bersamaan → 1 notifikasi, bukan 50</td></tr>
<tr><td><strong>Routing</strong></td><td>Alert database ke tim DBA, alert frontend ke tim web</td></tr>
<tr><td><strong>Inhibition</strong></td><td>Bila seluruh klaster mati, jangan kirim juga 200 alert turunannya</td></tr>
<tr><td><strong>Silence</strong></td><td>Bungkam alert selama maintenance terjadwal</td></tr>
</tbody>
</table>

<h3>Konfigurasi Routing</h3>
<pre data-lang="yaml" data-file="alertmanager.yml">global:
  resolve_timeout: 5m
  slack_api_url_file: /etc/alertmanager/secrets/slack_url   # jangan hardcode

# Template pesan kustom
templates:
  - /etc/alertmanager/templates/*.tmpl

route:
  # ── Pengaturan default untuk semua alert ──
  receiver: tim-platform
  group_by: [alertname, cluster, layanan]
  group_wait:      30s    # tunggu 30 detik, kumpulkan alert serupa
  group_interval:  5m     # jeda sebelum mengirim update grup yang sama
  repeat_interval: 4h     # ulangi pengingat bila masih firing

  routes:
    # ── Alert dengan label tipe:slo -> kanal SLO ──
    - matchers: ['tipe = "slo"']
      receiver: kanal-slo
      group_by: [alertname, layanan]
      continue: true       # LANJUTKAN evaluasi route berikutnya

    # ── Kritis -> PagerDuty, tanpa menunggu lama ──
    - matchers: ['severity = "critical"']
      receiver: pagerduty
      group_wait: 10s
      repeat_interval: 1h

    # ── Per tim, berdasarkan label 'tim' dari alerting rule ──
    - matchers: ['tim = "checkout"']
      receiver: slack-checkout
    - matchers: ['tim = "data"']
      receiver: slack-data

    # ── Alert dari staging: hanya jam kerja ──
    - matchers: ['lingkungan = "staging"']
      receiver: slack-staging
      active_time_intervals: [jam-kerja]

# Jendela waktu bernama
time_intervals:
  - name: jam-kerja
    time_intervals:
      - weekdays: ['monday:friday']
        times: [{ start_time: '01:00', end_time: '10:00' }]   # UTC = 08:00-17:00 WIB

# ── Inhibition: alert besar membungkam alert kecil ──
inhibit_rules:
  # Bila seluruh klaster down, jangan kirim alert per-instance
  - source_matchers: ['alertname = "ClusterDown"']
    target_matchers: ['severity =~ "warning|critical"']
    equal: [cluster]

  # Critical membungkam warning untuk alert & layanan yang sama
  - source_matchers: ['severity = "critical"']
    target_matchers: ['severity = "warning"']
    equal: [alertname, layanan, instance]

receivers:
  - name: tim-platform
    slack_configs:
      - channel: '#alert-platform'
        send_resolved: true
        title: '{{ template "slack.judul" . }}'
        text: '{{ template "slack.isi" . }}'

  - name: pagerduty
    pagerduty_configs:
      - service_key_file: /etc/alertmanager/secrets/pagerduty_key
        severity: '{{ .CommonLabels.severity }}'

  - name: slack-checkout
    slack_configs:
      - channel: '#tim-checkout'
        send_resolved: true

  - name: kanal-slo
    slack_configs:
      - channel: '#slo-alerts'
        send_resolved: true

  - name: slack-data
    slack_configs: [{ channel: '#tim-data', send_resolved: true }]

  - name: slack-staging
    slack_configs: [{ channel: '#alert-staging', send_resolved: true }]</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Route pertama yang cocok akan menang — kecuali ada <code>continue: true</code></div>
    <p>Alertmanager mengevaluasi <code>routes</code> dari atas ke bawah dan <strong>berhenti pada yang pertama cocok</strong>. Bila route <code>severity = "critical"</code> Anda taruh di atas route <code>tim = "checkout"</code>, maka alert kritis tim checkout <strong>tidak akan pernah</strong> sampai ke kanal tim mereka.</p>
    <p>Gunakan <code>continue: true</code> bila sebuah alert memang harus dikirim ke lebih dari satu tujuan.</p>
</div>

<h3>Grouping — Kenapa Sangat Penting</h3>
<pre data-lang="text" data-file="dampak grouping">Tanpa grouping:
  50 node mati -> 50 pesan Slack terpisah
  Setiap 4 jam -> 50 pesan lagi
  Tim berhenti membaca kanal itu dalam 2 hari.

Dengan group_by: [alertname, cluster]:
  50 node mati -> 1 pesan berisi daftar 50 instance
  Ada node ke-51 mati -> 1 update, bukan pesan baru</pre>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ Jangan pakai <code>group_by: [...]</code> berisi label unik</div>
    <p><code>group_by: [alertname, instance]</code> praktis meniadakan grouping, karena setiap instance menjadi grup sendiri. Kelompokkan berdasarkan label yang <strong>sama</strong> untuk alert-alert yang ingin Anda gabungkan: <code>alertname</code>, <code>cluster</code>, <code>layanan</code>, <code>tim</code>.</p>
</div>

<h3>Silence — Membungkam Saat Maintenance</h3>
<pre data-lang="bash" data-file="amtool"># Pasang amtool (ikut dalam rilis Alertmanager)
amtool --alertmanager.url=http://localhost:9093 alert query

# Bungkam alert untuk satu instance selama 2 jam
amtool silence add instance="10.0.0.5:9100" \\
  --duration=2h \\
  --comment="Maintenance terjadwal: upgrade kernel — tiket OPS-4821" \\
  --author="budi@contoh.id"

# Bungkam seluruh alert dari job tertentu
amtool silence add job="batch-etl" --duration=6h --comment="Migrasi data"

# Lihat & hapus silence
amtool silence query
amtool silence expire &lt;ID&gt;</pre>

<div class="callout callout-tip">
    <div class="callout-title">💡 Selalu isi <code>--comment</code> dan <code>--duration</code></div>
    <p>Silence tanpa keterangan akan menjadi misteri: tidak ada yang tahu kenapa alert produksi dibungkam sejak tiga bulan lalu, dan tidak ada yang berani menghapusnya. Selalu sertakan alasan dan nomor tiket, serta <strong>durasi terbatas</strong> — jangan pernah membuat silence permanen.</p>
</div>

<h3>Alertmanager High Availability</h3>
<pre data-lang="bash" data-file="ha">// Jalankan 2-3 instance yang saling mengenal lewat gossip.
// Mereka berkoordinasi agar notifikasi tidak dikirim berkali-kali.
alertmanager --cluster.peer=am-2:9094 --cluster.peer=am-3:9094</pre>
<p>Di sisi Prometheus, daftarkan <strong>semua</strong> instance Alertmanager. Prometheus mengirim ke semuanya, dan Alertmanager sendiri yang melakukan deduplikasi.</p>
`,
    lab: {
        intro: `
<h3>Praktik: Menguji Routing Sebelum Insiden Nyata</h3>
<p><code>amtool config routes test</code> memungkinkan Anda memverifikasi bahwa sebuah alert benar-benar sampai ke penerima yang diinginkan — tanpa harus menunggu insiden sungguhan.</p>`,
        files: [{
            name: 'templates/slack.tmpl', lang: 'text', code: `{{ define "slack.judul" }}
[{{ .Status | toUpper }}{{ if eq .Status "firing" }}:{{ .Alerts.Firing | len }}{{ end }}] {{ .CommonLabels.alertname }}
{{ end }}

{{ define "slack.isi" }}
{{ range .Alerts -}}
*Ringkasan:* {{ .Annotations.summary }}
*Tingkat:* {{ .Labels.severity }} | *Tim:* {{ .Labels.tim }}
*Instance:* {{ .Labels.instance }}
{{ if .Annotations.description }}*Detail:* {{ .Annotations.description }}{{ end }}
{{ if .Annotations.runbook_url }}*Runbook:* {{ .Annotations.runbook_url }}{{ end }}
{{ if .Annotations.dashboard_url }}*Dashboard:* {{ .Annotations.dashboard_url }}{{ end }}
*Mulai:* {{ .StartsAt.Format "02 Jan 2006 15:04:05 MST" }}
---
{{ end }}
{{ end }}` }],
        steps: [
            { note: 'Validasi konfigurasi Alertmanager', cmd: 'amtool check-config alertmanager.yml', out: 'Checking \'alertmanager.yml\'  SUCCESS\nFound:\n - global config\n - route\n - 2 inhibit rules\n - 6 receivers\n - 1 templates' },
            { note: 'Uji ke mana sebuah alert akan dirutekan', cmd: 'amtool config routes test --config.file=alertmanager.yml severity=critical tim=checkout', out: 'pagerduty' },
            { note: 'Uji alert SLO — perhatikan ia sampai ke dua penerima karena continue: true', cmd: 'amtool config routes test --config.file=alertmanager.yml tipe=slo severity=critical', out: 'kanal-slo\npagerduty' },
            { note: 'Lihat pohon routing secara visual', cmd: 'amtool config routes show --config.file=alertmanager.yml' },
            { note: 'Kirim alert palsu untuk menguji ujung ke ujung', cmd: 'amtool alert add alertname=UjiCoba severity=critical tim=checkout \\\n  --annotation=summary="Ini alert uji coba, abaikan"' }
        ],
        snippets: ['amtool check-config alertmanager.yml', 'amtool silence query', 'amtool alert query', 'promql ALERTS{alertstate="firing"}']
    },
    pitfalls: [
        {
            kind: 'salah', title: 'Alert tim tertentu tidak pernah sampai ke kanal mereka',
            body: `<p>Penyebab hampir selalu <strong>urutan route</strong>. Alertmanager berhenti pada route pertama yang cocok. Bila route <code>severity = "critical"</code> berada di atas route per-tim, semua alert kritis akan tersedot ke PagerDuty dan tidak pernah mencapai kanal tim.</p>
<p>Solusinya: tambahkan <code>continue: true</code> pada route yang boleh dilanjutkan, atau susun ulang urutannya dari yang paling spesifik ke yang paling umum.</p>`
        },
        {
            kind: 'larangan', title: 'Jangan menaruh webhook URL atau API key langsung di YAML',
            body: `<p>Slack webhook URL dan PagerDuty service key adalah kredensial. Menaruhnya di <code>alertmanager.yml</code> yang ter-commit ke Git berarti siapa pun dengan akses repositori bisa mengirim pesan atas nama sistem monitoring Anda — atau membanjiri kanal tim.</p>
<p>Gunakan varian <code>*_file</code> (<code>slack_api_url_file</code>, <code>service_key_file</code>) yang membaca dari berkas, dan pasang berkas itu lewat Kubernetes Secret atau secret manager.</p>`
        },
        {
            kind: 'salah', title: 'Notifikasi membanjir karena grouping salah',
            body: `<p><code>group_by: [alertname, instance]</code> berarti setiap instance menjadi grup terpisah — praktis sama dengan tidak ada grouping sama sekali. Ketika 50 node mati bersamaan, tim tetap menerima 50 pesan.</p>
<p>Kelompokkan berdasarkan label yang <strong>sama</strong> di antara alert yang ingin digabung: <code>[alertname, cluster]</code> atau <code>[alertname, layanan, tim]</code>.</p>`
        },
        {
            kind: 'salah', title: 'Silence permanen yang dilupakan',
            body: `<p>Silence tanpa durasi yang jelas atau dengan durasi sangat panjang akan terlupakan. Enam bulan kemudian terjadi insiden nyata dan tidak ada yang berbunyi — karena masih ada silence dari maintenance yang sudah lama selesai.</p>
<p>Selalu batasi durasi (maksimal beberapa jam), selalu isi komentar dengan nomor tiket, dan audit daftar silence secara berkala dengan <code>amtool silence query</code>.</p>`
        },
        {
            kind: 'best', title: 'Gunakan inhibition untuk memangkas badai alert',
            body: `<p>Ketika sebuah klaster mati, Anda akan menerima alert untuk klaster itu <em>plus</em> ratusan alert turunan dari setiap pod dan endpoint di dalamnya. Yang berguna hanya alert pertamanya.</p>
<pre data-lang="yaml">inhibit_rules:
  - source_matchers: ['alertname = "ClusterDown"']
    target_matchers: ['severity =~ "warning|critical"']
    equal: [cluster]</pre>
<p>Label pada <code>equal</code> harus ada di <strong>kedua</strong> alert, kalau tidak inhibition tidak akan bekerja.</p>`
        }
    ],
    quiz: [
        {
            q: 'Route <code>severity="critical"</code> ditulis sebelum route <code>tim="checkout"</code>. Apa yang terjadi pada alert kritis dari tim checkout?',
            opts: [
                'Dikirim ke kedua penerima',
                'Hanya dikirim ke penerima route pertama yang cocok, kecuali ada <code>continue: true</code>',
                'Tidak dikirim sama sekali',
                'Alertmanager menolak konfigurasi'
            ],
            a: 1,
            exp: 'Alertmanager mengevaluasi routes dari atas ke bawah dan berhenti pada yang pertama cocok. Untuk mengirim ke lebih dari satu tujuan, tambahkan <code>continue: true</code> pada route yang boleh dilanjutkan.'
        },
        {
            q: 'Apa fungsi <code>inhibit_rules</code>?',
            opts: [
                'Menunda pengiriman alert',
                'Menekan alert turunan ketika ada alert yang lebih besar sedang aktif',
                'Menghapus alert dari Prometheus',
                'Mengubah severity alert'
            ],
            a: 1,
            exp: 'Inhibition mencegah badai notifikasi. Ketika alert "ClusterDown" aktif, ratusan alert turunan dari pod di dalamnya bisa ditekan — karena semuanya adalah akibat dari satu penyebab yang sama.'
        },
        {
            q: 'Kenapa <code>group_by: [alertname, instance]</code> biasanya keliru?',
            opts: [
                'Karena <code>instance</code> bukan label yang valid',
                'Karena setiap instance menjadi grup sendiri, sehingga grouping praktis tidak berfungsi',
                'Karena Alertmanager hanya mendukung satu label',
                'Karena memperlambat pengiriman'
            ],
            a: 1,
            exp: 'Tujuan grouping adalah menggabungkan alert serupa menjadi satu notifikasi. Mengelompokkan berdasarkan label yang unik per target meniadakan tujuan itu — 50 node mati tetap menghasilkan 50 pesan.'
        }
    ]
},

/* --------------------------------------------------------------- 14 ----- */
{
    id: 14,
    cat: '4 · Produksi',
    title: 'Storage, Retensi, Remote Write, HA & Federation',
    level: 'Lanjut', dur: '16 mnt',
    tags: ['tsdb', 'retensi', 'remote write', 'thanos', 'mimir', 'ha', 'federation'],
    desc: 'Bagaimana Prometheus menyimpan data, cara memperbesar kapasitas, dan pilihan arsitektur saat satu instance tidak lagi cukup.',
    theory: `
<h2>Cara Kerja TSDB Prometheus</h2>
<pre data-lang="text" data-file="struktur penyimpanan">/prometheus/
├── wal/                       ← Write-Ahead Log, data 2 jam terakhir
│   ├── 00000123
│   └── checkpoint.000122/
├── chunks_head/               ← blok yang masih aktif di memori
├── 01HQ8X.../                 ← blok tersegel (immutable), rentang 2 jam
│   ├── chunks/
│   ├── index
│   └── meta.json
└── lock</pre>
<ul>
    <li>Sampel masuk ke <strong>head block</strong> di memori, sekaligus ditulis ke <strong>WAL</strong> agar tahan crash.</li>
    <li>Setiap 2 jam, head block disegel menjadi <strong>blok persisten</strong> di disk.</li>
    <li>Blok-blok lama dipadatkan (<em>compaction</em>) menjadi blok yang lebih besar.</li>
    <li>Blok yang melewati retensi dihapus.</li>
</ul>

<h3>Memperkirakan Kebutuhan Disk</h3>
<div class="callout callout-accent">
    <div class="callout-title">📐 Rumus perkiraan</div>
    <pre data-lang="text">disk = retensi_detik × sampel_per_detik × byte_per_sampel

sampel_per_detik = jumlah_time_series / scrape_interval
byte_per_sampel  ≈ 1,5–2 byte (setelah kompresi)</pre>
    <p><strong>Contoh:</strong> 500.000 series, scrape 15 detik, retensi 30 hari<br>
    = 2.592.000 × (500.000 / 15) × 2 byte ≈ <strong>172 GB</strong></p>
    <p>Sediakan margin 30–50% untuk proses compaction yang butuh ruang sementara.</p>
</div>

<h3>Retensi</h3>
<pre data-lang="bash" data-file="flag">prometheus \\
  --storage.tsdb.retention.time=30d \\
  --storage.tsdb.retention.size=200GB    # yang tercapai lebih dulu yang berlaku</pre>
<div class="callout callout-warn">
    <div class="callout-title">⚠️ Selalu set <code>retention.size</code> juga</div>
    <p>Retensi berbasis waktu saja berbahaya: bila jumlah time series tiba-tiba melonjak (misalnya ada developer yang menambahkan label berkardinalitas tinggi), disk bisa penuh sebelum 30 hari terlewati — dan Prometheus akan mati. Batas ukuran adalah jaring pengaman Anda.</p>
</div>

<h3>Remote Write — Penyimpanan Jangka Panjang</h3>
<p>Prometheus dirancang untuk data operasional jangka pendek. Untuk menyimpan bertahun-tahun, kirim data ke sistem lain.</p>
<pre data-lang="yaml" data-file="prometheus.yml">remote_write:
  - url: http://mimir:9009/api/v1/push
    name: mimir-utama
    remote_timeout: 30s

    # Kirim hanya yang perlu disimpan lama -> hemat biaya besar
    write_relabel_configs:
      - source_labels: [__name__]
        action: keep
        regex: "job:.*|slo:.*|instance:.*"    # hanya hasil recording rule

    queue_config:
      capacity: 10000            # antrean per shard
      max_shards: 50             # paralelisme maksimum
      min_shards: 1
      max_samples_per_send: 2000
      batch_send_deadline: 5s
      min_backoff: 30ms
      max_backoff: 5s

    metadata_config:
      send: true
      send_interval: 1m</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Jangan kirim SEMUA metrik lewat remote write</div>
    <p>Biaya penyimpanan cloud dihitung per time series per bulan. Mengirim seluruh 2 juta series ke Grafana Cloud atau Mimir bisa menghasilkan tagihan yang mengejutkan.</p>
    <p>Gunakan <code>write_relabel_configs</code> dengan <code>action: keep</code> untuk mengirim <strong>hanya hasil recording rule</strong> dan metrik SLO. Data mentah beresolusi tinggi cukup disimpan lokal selama 15–30 hari.</p>
</div>

<h3>High Availability</h3>
<pre data-lang="text" data-file="pola HA">Pola paling sederhana: dua Prometheus identik, konfigurasi sama,
dibedakan hanya oleh external_labels.replica

  prom-01 (replica: a) ─┐
                        ├─▶ Thanos Query / Mimir ─▶ Grafana
  prom-02 (replica: b) ─┘
                              (deduplikasi otomatis
                               berdasarkan label replica)

Keduanya men-scrape target yang sama dan mengevaluasi rule yang sama.
Bila satu mati, yang lain tetap punya data lengkap.</pre>

<table>
<thead><tr><th>Solusi</th><th>Cocok untuk</th><th>Catatan</th></tr></thead>
<tbody>
<tr><td><strong>Thanos</strong></td><td>Multi-cluster, arsip di object storage</td><td>Sidecar + Query + Store + Compactor</td></tr>
<tr><td><strong>Grafana Mimir</strong></td><td>Skala sangat besar, multi-tenant</td><td>Menerima remote write, horizontal scalable</td></tr>
<tr><td><strong>VictoriaMetrics</strong></td><td>Efisiensi sumber daya</td><td>Lebih hemat memori, sebagian kompatibel PromQL</td></tr>
<tr><td><strong>Federation</strong></td><td>Agregasi lintas datacenter</td><td>Sederhana tapi terbatas, mudah disalahgunakan</td></tr>
</tbody>
</table>

<h3>Federation — dan Kesalahpahaman yang Umum</h3>
<pre data-lang="yaml" data-file="federation">  - job_name: federate
    scrape_interval: 60s
    honor_labels: true
    metrics_path: /federate
    params:
      # HANYA ambil hasil recording rule yang sudah teragregasi
      'match[]':
        - '{__name__=~"job:.*"}'
        - '{__name__=~"slo:.*"}'
    static_configs:
      - targets: ["prom-jkt:9090", "prom-sby:9090"]</pre>
<div class="callout callout-danger">
    <div class="callout-title">⛔ Federation BUKAN cara membuat "Prometheus global"</div>
    <p>Kesalahan yang sangat umum: memakai <code>match[]: '{__name__=~".+"}'</code> untuk menarik <strong>semua</strong> metrik dari Prometheus lain. Ini akan gagal karena:</p>
    <ul>
        <li>Satu scrape harus mentransfer jutaan series dalam satu request HTTP — timeout hampir pasti.</li>
        <li>Prometheus pusat menjadi titik kegagalan tunggal dengan beban yang tak tertanggung.</li>
        <li>Resolusi data hilang (scrape 60 detik atas data yang aslinya 15 detik).</li>
    </ul>
    <p>Federation hanya cocok untuk menarik <strong>sedikit metrik teragregasi</strong> (hasil recording rule). Untuk kebutuhan "satu tempat melihat semua", gunakan Thanos atau Mimir.</p>
</div>
`,
    lab: {
        intro: `
<h3>Praktik: Memeriksa Kesehatan Penyimpanan</h3>
<p>Query berikut memberi tahu apakah Prometheus Anda sehat, dan kapan Anda perlu bertindak sebelum kehabisan sumber daya.</p>`,
        files: [{
            name: 'kesehatan-prometheus.promql', lang: 'promql', code: `# ══ Kardinalitas & Penyimpanan ═══════════════════════════
# Jumlah time series aktif — metrik terpenting untuk dipantau
prometheus_tsdb_head_series

# Laju sampel masuk per detik
rate(prometheus_tsdb_head_samples_appended_total[5m])

# Ukuran blok di disk
prometheus_tsdb_storage_blocks_bytes

# Perkiraan pertumbuhan series dalam 24 jam
predict_linear(prometheus_tsdb_head_series[6h], 24*3600)


# ══ Kesehatan Scrape ═════════════════════════════════════
# Target yang gagal di-scrape
up == 0

# Scrape yang mendekati timeout
scrape_duration_seconds / on (job) group_left()
  (scrape_samples_scraped > bool 0) > 5

# Target yang melewati sample_limit (datanya DIBUANG total)
scrape_samples_scraped == 0 and up == 1

# Target paling boros
topk(10, scrape_samples_scraped)


# ══ Kesehatan Rule ═══════════════════════════════════════
# Grup rule yang evaluasinya lebih lama dari intervalnya
prometheus_rule_group_last_duration_seconds
  > prometheus_rule_group_interval_seconds

# Rule yang gagal dievaluasi
rate(prometheus_rule_evaluation_failures_total[5m]) > 0


# ══ Kesehatan Remote Write ═══════════════════════════════
# Antrean yang menumpuk -> tujuan tidak sanggup menerima
prometheus_remote_storage_samples_pending

# Sampel yang dibuang karena antrean penuh -> DATA HILANG
rate(prometheus_remote_storage_samples_dropped_total[5m]) > 0

# Ketertinggalan pengiriman
prometheus_remote_storage_highest_timestamp_in_seconds
  - ignoring(remote_name, url) prometheus_remote_storage_queue_highest_sent_timestamp_seconds


# ══ Sumber Daya Prometheus ═══════════════════════════════
process_resident_memory_bytes{job="prometheus"}
rate(process_cpu_seconds_total{job="prometheus"}[5m])
prometheus_tsdb_compaction_duration_seconds_sum` }],
        steps: [
            { note: 'Berapa time series yang aktif sekarang', cmd: 'promql prometheus_tsdb_head_series' },
            { note: 'Apakah akan melonjak dalam 24 jam?', cmd: 'promql predict_linear(prometheus_tsdb_head_series[6h], 24*3600)' },
            { note: 'Job mana yang paling boros series', cmd: 'promql topk(10, count by (job) ({__name__=~".+"}))' },
            { note: 'Apakah ada data remote write yang hilang', cmd: 'promql rate(prometheus_remote_storage_samples_dropped_total[5m])' },
            { note: 'Cek ukuran data di disk', cmd: 'du -sh /prometheus/*', out: '4.2G\t/prometheus/01HQ8XABCDEF\n1.1G\t/prometheus/chunks_head\n512M\t/prometheus/wal' }
        ],
        snippets: ['promql prometheus_tsdb_head_series', 'promql topk(10, count by (job) ({__name__=~".+"}))', 'promql up == 0']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'Jangan pakai federation untuk menarik semua metrik',
            body: `<p><code>match[]: '{__name__=~".+"}'</code> akan mencoba mentransfer seluruh time series dalam satu request HTTP. Pada instance berukuran sedang, ini berarti puluhan hingga ratusan megabyte per scrape — timeout hampir pasti terjadi, dan Prometheus pusat akan tersengal.</p>
<p>Federation dirancang untuk menarik <strong>sedikit metrik yang sudah teragregasi</strong> (hasil recording rule). Untuk kebutuhan tampilan global lintas klaster, gunakan Thanos atau Mimir yang memang dirancang untuk itu.</p>`
        },
        {
            kind: 'salah', title: 'Disk penuh sebelum retensi waktu tercapai',
            body: `<p>Hanya menetapkan <code>--storage.tsdb.retention.time=90d</code> tanpa batas ukuran adalah risiko besar. Bila jumlah time series melonjak — misalnya seorang developer menambahkan label <code>request_id</code> — disk bisa penuh dalam hitungan hari, dan Prometheus berhenti bekerja.</p>
<p>Selalu pasang <code>--storage.tsdb.retention.size</code> sebagai jaring pengaman. Yang tercapai lebih dulu akan berlaku.</p>`
        },
        {
            kind: 'salah', title: 'Remote write membuat Prometheus lambat',
            body: `<p>Bila tujuan remote write lambat atau tidak sanggup menerima, antrean di Prometheus menumpuk dan memakan memori. Pada akhirnya sampel akan dibuang — dan data itu hilang selamanya.</p>
<pre data-lang="promql"># Pantau kedua metrik ini
prometheus_remote_storage_samples_pending
rate(prometheus_remote_storage_samples_dropped_total[5m]) &gt; 0</pre>
<p>Perbaikan: naikkan <code>max_shards</code>, kurangi jumlah metrik yang dikirim lewat <code>write_relabel_configs</code>, atau perbesar kapasitas sistem tujuan.</p>`
        },
        {
            kind: 'best', title: 'Kirim hanya recording rule lewat remote write',
            body: `<p>Biaya penyimpanan jangka panjang dihitung per time series. Mengirim seluruh data mentah bisa 10–50× lebih mahal daripada mengirim hasil agregasi saja.</p>
<pre data-lang="yaml">    write_relabel_configs:
      - source_labels: [__name__]
        action: keep
        regex: "job:.*|slo:.*|instance:.*"</pre>
<p>Data mentah beresolusi tinggi tetap tersedia lokal selama 15–30 hari — cukup untuk investigasi insiden. Untuk analisis tren berbulan-bulan, data teragregasi justru lebih berguna.</p>`
        },
        {
            kind: 'kasus', title: 'Dua Prometheus identik: pola HA paling sederhana',
            body: `<p>Anda tidak butuh Thanos untuk mendapatkan ketersediaan tinggi. Jalankan dua Prometheus dengan konfigurasi identik, dibedakan hanya oleh <code>external_labels.replica</code>. Keduanya men-scrape target yang sama dan mengevaluasi rule yang sama.</p>
<ul>
<li>Bila satu mati, yang lain tetap punya data lengkap.</li>
<li>Daftarkan <strong>keduanya</strong> di konfigurasi Alertmanager — Alertmanager melakukan deduplikasi sehingga notifikasi tidak ganda.</li>
<li>Untuk Grafana, arahkan ke load balancer sederhana di depan keduanya.</li>
</ul>
<p>Kekurangannya: kedua instance tidak sinkron sempurna (scrape terjadi pada detik yang sedikit berbeda), sehingga grafik bisa sedikit "melompat" saat berpindah instance. Untuk kebanyakan tim, ini kompromi yang sepadan.</p>`
        }
    ],
    quiz: [
        {
            q: 'Prometheus Anda punya 800.000 time series, scrape 15 detik, retensi 30 hari. Perkiraan kebutuhan disk?',
            opts: ['± 27 GB', '± 275 GB', '± 2,7 TB', '± 5 GB'],
            a: 1,
            exp: 'Rumus: 2.592.000 detik × (800.000 / 15) sampel/detik × 2 byte ≈ <strong>276 GB</strong>. Selalu tambahkan margin 30–50% untuk proses compaction yang membutuhkan ruang sementara.'
        },
        {
            q: 'Kenapa <code>--storage.tsdb.retention.size</code> sebaiknya diset selain retensi waktu?',
            opts: [
                'Agar query lebih cepat',
                'Sebagai jaring pengaman bila jumlah time series melonjak tak terduga dan disk hampir penuh',
                'Karena wajib menurut Prometheus',
                'Untuk menghemat CPU'
            ],
            a: 1,
            exp: 'Retensi waktu tidak melindungi dari lonjakan kardinalitas. Satu label berkardinalitas tinggi yang tak sengaja ditambahkan bisa memenuhi disk dalam hitungan hari — dan Prometheus yang kehabisan disk akan berhenti bekerja sepenuhnya.'
        },
        {
            q: 'Apa cara yang benar memakai federation?',
            opts: [
                'Menarik semua metrik dengan <code>match[]={__name__=~".+"}</code>',
                'Menarik hanya metrik hasil recording rule yang sudah teragregasi',
                'Menggantikan remote write sepenuhnya',
                'Menjalankan Prometheus tanpa penyimpanan lokal'
            ],
            a: 1,
            exp: 'Federation mentransfer data lewat satu request HTTP, sehingga hanya praktis untuk sedikit metrik teragregasi. Menarik seluruh metrik akan timeout dan membebani kedua sisi. Untuk tampilan global lintas klaster, gunakan Thanos atau Mimir.'
        }
    ]
},

/* --------------------------------------------------------------- 15 ----- */
{
    id: 15,
    cat: '4 · Produksi',
    title: 'Kardinalitas, Performa & Troubleshooting',
    level: 'Lanjut', dur: '18 mnt',
    tags: ['kardinalitas', 'oom', 'performa', 'troubleshooting', 'debug', 'tsdb'],
    desc: 'Mendiagnosis Prometheus yang lambat atau kehabisan memori, menemukan biang keroknya, dan memperbaikinya secara permanen.',
    theory: `
<h2>Penyebab Nomor Satu Prometheus Mati: Kardinalitas</h2>
<p>Hampir semua masalah performa Prometheus berujung pada satu hal: <strong>terlalu banyak time series</strong>. Memori yang dipakai kira-kira sebanding dengan jumlah series aktif, bukan dengan jumlah sampel.</p>

<h3>Aturan Praktis Kapasitas</h3>
<table>
<thead><tr><th>Time series aktif</th><th>RAM yang disarankan</th><th>Catatan</th></tr></thead>
<tbody>
<tr><td>&lt; 100.000</td><td>2–4 GB</td><td>Nyaman</td></tr>
<tr><td>100.000 – 500.000</td><td>8–16 GB</td><td>Perlu recording rule</td></tr>
<tr><td>500.000 – 2.000.000</td><td>32–64 GB</td><td>Perlu tuning serius</td></tr>
<tr><td>&gt; 2.000.000</td><td>—</td><td>Pertimbangkan sharding atau Mimir/Thanos</td></tr>
</tbody>
</table>

<h3>Menemukan Biang Kerok Kardinalitas</h3>
<pre data-lang="promql" data-file="berburu-kardinalitas"># 1. Berapa total series aktif?
prometheus_tsdb_head_series

# 2. Metrik mana yang paling banyak series-nya?
topk(20, count by (__name__)({__name__=~".+"}))

# 3. Job mana yang paling boros?
topk(10, count by (job)({__name__=~".+"}))

# 4. Berapa nilai unik dari sebuah label? (calon tersangka)
count(count by (user_id)(http_requests_total))

# 5. Target mana yang mengekspos paling banyak sampel?
topk(10, scrape_samples_scraped)

# 6. Apakah kardinalitas sedang melonjak?
deriv(prometheus_tsdb_head_series[1h]) &gt; 0</pre>

<div class="callout callout-tip">
    <div class="callout-title">💡 Halaman TSDB Status — jalur tercepat</div>
    <p>Buka <code>http://prometheus:9090/tsdb-status</code>. Halaman ini langsung menampilkan:</p>
    <ul>
        <li>Nama label dengan jumlah nilai unik terbanyak.</li>
        <li>Metrik dengan jumlah series terbanyak.</li>
        <li>Pasangan label-nilai yang paling banyak muncul.</li>
    </ul>
    <p>Dalam 30 detik Anda biasanya sudah menemukan pelakunya.</p>
</div>

<h3>Gejala dan Diagnosisnya</h3>
<table>
<thead><tr><th>Gejala</th><th>Kemungkinan penyebab</th><th>Langkah pertama</th></tr></thead>
<tbody>
<tr><td>OOM-killed berulang</td><td>Kardinalitas terlalu tinggi</td><td>Buka <code>/tsdb-status</code>, cari label pelakunya</td></tr>
<tr><td>Query timeout</td><td>Rentang terlalu panjang / terlalu banyak series</td><td>Buat recording rule</td></tr>
<tr><td>Dashboard lambat</td><td>Query berat diulang tiap refresh</td><td>Recording rule + kurangi panel</td></tr>
<tr><td>Alert terlambat berbunyi</td><td>Evaluasi rule tertinggal</td><td>Cek <code>rule_group_last_duration</code></td></tr>
<tr><td>Target sering DOWN</td><td>Scrape timeout / exporter lambat</td><td>Naikkan <code>scrape_timeout</code>, cek exporter</td></tr>
<tr><td>Data bolong-bolong</td><td>Scrape gagal berkala</td><td>Cek <code>scrape_duration_seconds</code></td></tr>
<tr><td>Startup sangat lama</td><td>WAL besar sedang di-replay</td><td>Normal; kurangi kardinalitas untuk mempercepat</td></tr>
</tbody>
</table>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Prometheus OOM: yang harus dilakukan dan urutannya</div>
    <ol>
        <li><strong>Jangan langsung menaikkan RAM.</strong> Itu menunda masalah, bukan menyelesaikannya — kardinalitas akan terus tumbuh.</li>
        <li>Buka <code>/tsdb-status</code> dan temukan label atau metrik pelakunya.</li>
        <li>Tambahkan <code>metric_relabel_configs</code> dengan <code>drop</code> atau <code>labeldrop</code> untuk memangkasnya.</li>
        <li>Beri tahu tim pemilik aplikasi agar memperbaiki instrumentasinya di sumber.</li>
        <li>Pasang <code>sample_limit</code> pada job tersebut agar kejadian serupa tidak terulang.</li>
        <li>Baru setelah itu, sesuaikan kapasitas RAM bila memang masih perlu.</li>
    </ol>
</div>

<h3>Optimasi Query</h3>
<div class="vs-grid">
<div class="vs-col vs-bad"><div class="vs-label">❌ Lambat</div>
<pre data-lang="promql"># Memindai semua metrik
{__name__=~".+", job="api"}

# Regex mahal di depan
{job=~".*api.*"}

# Rentang panjang di alerting rule
rate(http_requests_total[7d])

# Agregasi setelah rate atas banyak series
sum(rate(container_cpu_usage_seconds_total[5m]))</pre></div>
<div class="vs-col vs-good"><div class="vs-label">✅ Cepat</div>
<pre data-lang="promql"># Sebutkan nama metrik
http_requests_total{job="api"}

# Matcher eksak lebih dulu
{job="api-produksi"}

# Pakai recording rule
job:http_requests:rate7d

# Batasi lebih dulu dengan label selektif
sum(rate(container_cpu_usage_seconds_total{namespace="produksi"}[5m]))</pre></div>
</div>

<h3>Perintah Diagnostik</h3>
<pre data-lang="bash" data-file="diagnostik"># Analisis blok TSDB — apa yang sebenarnya memakan tempat
promtool tsdb analyze /prometheus

# Melihat isi blok tertentu
promtool tsdb list /prometheus

# Menguji query dari CLI
promtool query instant http://localhost:9090 'up == 0'
promtool query range http://localhost:9090 'rate(http_requests_total[5m])' \\
  --start=2026-07-27T00:00:00Z --end=2026-07-27T06:00:00Z --step=1m

# Profil memori dan CPU (butuh Go pprof)
curl -s http://localhost:9090/debug/pprof/heap > heap.out
go tool pprof -top heap.out

# Statistik runtime
curl -s http://localhost:9090/api/v1/status/runtimeinfo | jq
curl -s http://localhost:9090/api/v1/status/tsdb | jq '.data.seriesCountByMetricName[:10]'</pre>

<h3>Batas Pengaman yang Wajib Dipasang</h3>
<pre data-lang="bash" data-file="flag-pengaman">prometheus \\
  --query.max-samples=50000000 \\
  --query.timeout=2m \\
  --query.max-concurrency=20 \\
  --storage.tsdb.retention.size=200GB \\
  --web.max-connections=512</pre>
<p>Tanpa batas ini, satu query buruk dari seseorang di Grafana bisa merobohkan Prometheus untuk seluruh organisasi.</p>
`,
    lab: {
        intro: `
<h3>Praktik: Investigasi Kardinalitas</h3>
<p>Skrip berikut mengumpulkan seluruh informasi yang dibutuhkan untuk mendiagnosis Prometheus yang bermasalah, dalam satu perintah.</p>`,
        files: [{
            name: 'diagnosa-prometheus.sh', lang: 'bash', code: `#!/usr/bin/env bash
# Laporan diagnostik cepat untuk Prometheus yang bermasalah.
# Pakai: ./diagnosa-prometheus.sh http://localhost:9090
set -euo pipefail

PROM="\${1:-http://localhost:9090}"
q() { curl -sf --get "$PROM/api/v1/query" --data-urlencode "query=$1" | jq -r '.data.result'; }

echo "════════════════════════════════════════════════"
echo " DIAGNOSA PROMETHEUS — $PROM"
echo "════════════════════════════════════════════════"
echo

echo "── 1. Ukuran & Kardinalitas ────────────────────"
echo -n "Total time series aktif : "
q 'prometheus_tsdb_head_series' | jq -r '.[0].value[1] // "n/a"'
echo -n "Sampel masuk per detik   : "
q 'rate(prometheus_tsdb_head_samples_appended_total[5m])' | jq -r '.[0].value[1] // "n/a"'
echo -n "Memori dipakai (bytes)   : "
q 'process_resident_memory_bytes{job="prometheus"}' | jq -r '.[0].value[1] // "n/a"'
echo

echo "── 2. Metrik Paling Boros ──────────────────────"
q 'topk(10, count by (__name__)({__name__=~".+"}))' \\
  | jq -r '.[] | "  \\(.value[1] | tonumber | floor) series  \\(.metric.__name__)"' \\
  | sort -rn || echo "  (query gagal / terlalu berat)"
echo

echo "── 3. Job Paling Boros ─────────────────────────"
q 'topk(10, count by (job)({__name__=~".+"}))' \\
  | jq -r '.[] | "  \\(.value[1] | tonumber | floor) series  job=\\(.metric.job)"' || true
echo

echo "── 4. Target Bermasalah ────────────────────────"
curl -sf "$PROM/api/v1/targets?state=active" \\
  | jq -r '.data.activeTargets[] | select(.health != "up")
           | "  DOWN  \\(.labels.job)  \\(.scrapeUrl)  -> \\(.lastError)"' \\
  || echo "  (tidak ada target bermasalah)"
echo

echo "── 5. Rule yang Tertinggal ─────────────────────"
q 'prometheus_rule_group_last_duration_seconds > prometheus_rule_group_interval_seconds' \\
  | jq -r '.[] | "  LAMBAT  \\(.metric.rule_group)"' || echo "  (semua rule sehat)"
echo

echo "── 6. Remote Write ─────────────────────────────"
echo -n "Sampel tertahan di antrean: "
q 'sum(prometheus_remote_storage_samples_pending)' | jq -r '.[0].value[1] // "0"'
echo -n "Sampel dibuang per detik  : "
q 'sum(rate(prometheus_remote_storage_samples_dropped_total[5m]))' | jq -r '.[0].value[1] // "0"'
echo

echo "════════════════════════════════════════════════"
echo " Langkah selanjutnya:"
echo " - Buka $PROM/tsdb-status untuk daftar label ber-kardinalitas tinggi"
echo " - Pangkas dengan metric_relabel_configs (drop / labeldrop)"
echo " - Pasang sample_limit pada job yang boros"
echo "════════════════════════════════════════════════"` }],
        steps: [
            { note: 'Jalankan diagnosa lengkap', cmd: 'chmod +x diagnosa-prometheus.sh\n./diagnosa-prometheus.sh http://localhost:9090' },
            { note: 'Analisis blok TSDB secara langsung', cmd: 'promtool tsdb analyze /prometheus', out: 'Block ID: 01HQ8XABCDEF\nDuration: 2h0m0s\nSeries: 482193\nLabel names: 47\n\nHighest cardinality labels:\n 148203 id\n  92847 container_id\n  48219 pod' },
            { note: 'Buka halaman status TSDB di browser', cmd: 'echo "Buka http://localhost:9090/tsdb-status"' },
            { note: 'Cari label dengan nilai unik terbanyak', cmd: 'promql count(count by (instance)({__name__=~".+"}))' }
        ],
        snippets: ['promql prometheus_tsdb_head_series', 'promql topk(10, count by (__name__)({__name__=~".+"}))', 'promtool tsdb analyze /prometheus', 'promql up == 0']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'Jangan menyelesaikan OOM hanya dengan menambah RAM',
            body: `<p>Menaikkan memori dari 16 GB ke 64 GB akan "menyelesaikan" masalah selama beberapa minggu, lalu terulang lagi — karena penyebabnya (kardinalitas yang terus tumbuh) tidak disentuh sama sekali.</p>
<p>Cari akarnya di <code>/tsdb-status</code>, pangkas dengan <code>metric_relabel_configs</code>, dan perbaiki instrumentasi di sisi aplikasi. Menambah RAM adalah langkah <em>terakhir</em>, bukan pertama.</p>`
        },
        {
            kind: 'larangan', title: 'Jangan biarkan Prometheus tanpa batas query',
            body: `<p>Tanpa <code>--query.max-samples</code> dan <code>--query.timeout</code>, satu orang yang menjalankan <code>{__name__=~".+"}[30d]</code> di Grafana bisa membuat Prometheus kehabisan memori dan mati — memutus monitoring untuk seluruh organisasi.</p>
<pre data-lang="bash">--query.max-samples=50000000
--query.timeout=2m
--query.max-concurrency=20</pre>
<p>Batas ini membuat query buruk gagal dengan pesan error, alih-alih merobohkan sistem.</p>`
        },
        {
            kind: 'salah', title: 'Query lambat karena regex di depan',
            body: `<p><code>{job=~".*api.*"}</code> memaksa Prometheus mengevaluasi regex terhadap <strong>setiap</strong> nilai label job yang ada. Bila ada ribuan job, ini mahal sekali.</p>
<p>Selalu mulai dengan matcher paling selektif — idealnya nama metrik yang eksak, lalu matcher <code>=</code> pada label. Regex dipakai belakangan untuk mempersempit, bukan untuk memilih dari awal.</p>`
        },
        {
            kind: 'best', title: 'Pantau Prometheus dengan Prometheus itu sendiri',
            body: `<p>Buat alert khusus untuk kesehatan Prometheus. Sistem monitoring yang tidak memantau dirinya sendiri akan mati diam-diam.</p>
<pre data-lang="yaml">- alert: KardinalitasMelonjak
  expr: predict_linear(prometheus_tsdb_head_series[6h], 24*3600) &gt; 2000000
  for: 1h

- alert: EvaluasiRuleTertinggal
  expr: prometheus_rule_group_last_duration_seconds
        &gt; prometheus_rule_group_interval_seconds
  for: 15m

- alert: RemoteWriteMembuangData
  expr: rate(prometheus_remote_storage_samples_dropped_total[5m]) &gt; 0
  for: 10m</pre>`
        },
        {
            kind: 'kasus', title: 'Kardinalitas melonjak setelah deploy — cara melacaknya',
            body: `<p>Alur investigasi yang efisien:</p>
<ol>
<li>Konfirmasi lonjakannya: <code>prometheus_tsdb_head_series</code> pada rentang 24 jam — kapan persisnya naik?</li>
<li>Cocokkan waktunya dengan riwayat deploy tim.</li>
<li>Buka <code>/tsdb-status</code> untuk melihat label dengan nilai unik terbanyak.</li>
<li>Verifikasi tersangkanya: <code>count(count by (label_tersangka)(metrik))</code>.</li>
<li>Tindakan segera: <code>labeldrop</code> pada label tersebut di <code>metric_relabel_configs</code>.</li>
<li>Tindakan permanen: buat tiket agar tim memperbaiki instrumentasi di sumber, dan pasang <code>sample_limit</code>.</li>
</ol>
<p>Langkah 5 menghentikan pendarahan dalam hitungan menit; langkah 6 mencegahnya terulang.</p>`
        }
    ],
    quiz: [
        {
            q: 'Prometheus di-OOM-kill setiap beberapa jam. Apa langkah pertama yang paling tepat?',
            opts: [
                'Menaikkan memori dari 16 GB ke 64 GB',
                'Membuka <code>/tsdb-status</code> untuk menemukan label atau metrik berkardinalitas tinggi',
                'Menurunkan retensi menjadi 3 hari',
                'Me-restart Prometheus secara berkala lewat cron'
            ],
            a: 1,
            exp: 'Memori Prometheus sebanding dengan jumlah time series aktif. Menambah RAM hanya menunda masalah karena kardinalitas akan terus tumbuh. Halaman <code>/tsdb-status</code> langsung menunjukkan pelakunya dalam hitungan detik.'
        },
        {
            q: 'Manakah query yang paling efisien?',
            opts: [
                '<code>{__name__=~".+", job="api"}</code>',
                '<code>{job=~".*api.*"}</code>',
                '<code>http_requests_total{job="api"}</code>',
                '<code>{instance!=""}</code>'
            ],
            a: 2,
            exp: 'Menyebutkan nama metrik secara eksplisit memungkinkan Prometheus langsung memakai indeks dan hanya menyentuh series yang relevan. Selector berbasis regex tanpa nama metrik memaksa pemindaian yang jauh lebih luas.'
        },
        {
            q: 'Apa fungsi flag <code>--query.max-samples</code>?',
            opts: [
                'Membatasi jumlah metrik yang di-scrape',
                'Membatasi jumlah sampel yang boleh diproses satu query, agar query buruk tidak merobohkan Prometheus',
                'Membatasi retensi data',
                'Membatasi jumlah alert'
            ],
            a: 1,
            exp: 'Batas ini membuat query yang terlalu berat gagal dengan pesan error, alih-alih menghabiskan memori sampai Prometheus mati. Ini pengaman penting ketika banyak orang punya akses ke Grafana atau Prometheus UI.'
        }
    ]
}

];

/* ==========================================================================
   PROMETHEUS — MINI PROJECT, UJIAN AKHIR & SIMULATOR
   ========================================================================== */

const COURSE = {
    key: 'prometheus',
    pageTitle: 'Belajar Prometheus Lengkap | Kelas Interaktif',
    subtitle: '15 bab · PromQL mendalam · mini project real-case · ujian sertifikasi',
    prompt: '$',
    termTitle: 'bash — simulator prometheus',
    termWelcome: [
        'Simulator Prometheus siap. Perintah yang dikenali:',
        '  promql <query>              jalankan PromQL dan lihat hasilnya',
        '  promtool check config|rules <file> | promtool test rules <file>',
        '  promtool tsdb analyze /prometheus | targets | amtool ... | help',
        'Data yang dipakai adalah dataset contoh yang menyerupai sistem produksi.',
        ''
    ],

    modules: [].concat(PROM_MOD_A, PROM_MOD_B, PROM_MOD_C),

    /* ================== MINI PROJECT ================== */
    project: {
        title: 'Membangun Observability Platform “BayarCepat”',
        subtitle: 'Dari nol sampai on-call: instrumentasi, SLO, alerting berlapis, dan runbook yang benar-benar dipakai.',
        meta: ['⏱ 10–16 jam', '🎯 Level: Lanjut', '🧰 Prometheus + Exporters + Alertmanager + Grafana'],
        intro: `
<h2>Situasi</h2>
<p>BayarCepat adalah payment gateway dengan 4 layanan: <code>api-gateway</code>, <code>ledger</code>, <code>notifikasi</code>, dan <code>rekonsiliasi</code>. Semuanya berjalan di Docker, dengan PostgreSQL dan Redis sebagai penyimpanan.</p>
<p>Bulan lalu terjadi insiden: layanan <code>ledger</code> kehabisan koneksi database selama 40 menit. Tidak ada satu pun alert yang berbunyi. Yang pertama tahu adalah pelanggan lewat Twitter.</p>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Yang harus Anda hasilkan</div>
    <p>Sebuah sistem monitoring yang <strong>akan menangkap insiden serupa dalam 3 menit</strong>, memberi tahu orang yang tepat, dan memberi mereka langkah penanganan yang jelas — tanpa membanjiri tim dengan notifikasi yang tidak berguna.</p>
</div>

<h3>Prinsip yang Harus Anda Pegang</h3>
<ul>
    <li><strong>Setiap alert harus bisa ditindaklanjuti.</strong> Bila tidak ada yang bisa dilakukan, itu dashboard — bukan alert.</li>
    <li><strong>Kardinalitas dijaga sejak awal.</strong> Anda harus bisa menunjukkan angka total time series dan membenarkannya.</li>
    <li><strong>Semua konfigurasi masuk Git.</strong> Tidak ada yang diklik manual di UI.</li>
    <li><strong>Setiap alert punya runbook.</strong> Orang yang di-page pukul 03:00 tidak boleh harus menebak.</li>
</ul>`,
        steps: [
            {
                title: 'Tahap 1 — Menyiapkan Sistem yang Bisa Dipantau',
                body: `
<p>Bangun stack lengkap. Perhatikan bahwa <code>ledger</code> sengaja dibatasi pool koneksinya agar insiden bulan lalu bisa direproduksi.</p>
<pre data-lang="yaml" data-file="docker-compose.yml">services:
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_PASSWORD: rahasia
      POSTGRES_DB: bayarcepat
    command: ["postgres", "-c", "max_connections=30",
              "-c", "shared_preload_libraries=pg_stat_statements"]
    ports: ["5432:5432"]

  redis:
    image: redis:8-alpine
    ports: ["6379:6379"]

  ledger:
    build: ./services/ledger
    environment:
      DB_POOL_SIZE: "8"          # sengaja kecil -> bottleneck bisa direproduksi
      DATABASE_URL: postgres://postgres:rahasia@db:5432/bayarcepat
    ports: ["8081:8080"]

  api-gateway:
    build: ./services/gateway
    ports: ["8080:8080"]
    depends_on: [ledger]

  prometheus:
    image: prom/prometheus:v3.5.0
    ports: ["9090:9090"]
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.path=/prometheus
      - --storage.tsdb.retention.time=30d
      - --storage.tsdb.retention.size=20GB
      - --web.enable-lifecycle
      - --query.max-samples=50000000
      - --query.timeout=2m
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./rules:/etc/prometheus/rules:ro
      - ./targets:/etc/prometheus/targets:ro
      - prom-data:/prometheus

  alertmanager:
    image: prom/alertmanager:v0.28.0
    ports: ["9093:9093"]
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro
      - ./templates:/etc/alertmanager/templates:ro

  node-exporter:
    image: prom/node-exporter:v1.8.2
    pid: host
    volumes: ["/:/host:ro,rslave"]
    command: ["--path.rootfs=/host"]
    ports: ["9100:9100"]

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:v0.49.1
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    ports: ["8082:8080"]

  postgres-exporter:
    image: quay.io/prometheuscommunity/postgres-exporter:v0.16.0
    environment:
      DATA_SOURCE_NAME: "postgresql://pemantau:rahasia@db:5432/bayarcepat?sslmode=disable"
    ports: ["9187:9187"]

  redis-exporter:
    image: oliver006/redis_exporter:v1.67.0
    environment:
      REDIS_ADDR: "redis://redis:6379"
    ports: ["9121:9121"]

  blackbox-exporter:
    image: prom/blackbox-exporter:v0.25.0
    volumes: ["./blackbox.yml:/etc/blackbox_exporter/config.yml:ro"]
    ports: ["9115:9115"]

  grafana:
    image: grafana/grafana:12.0.0
    ports: ["3000:3000"]
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - ./grafana/provisioning:/etc/grafana/provisioning:ro
      - grafana-data:/var/lib/grafana

volumes:
  prom-data:
  grafana-data:</pre>
<p><strong>Selesai bila:</strong> <code>docker compose up -d</code> berhasil dan seluruh target di <code>/targets</code> berstatus UP.</p>`
            },
            {
                title: 'Tahap 2 — Instrumentasi Aplikasi dengan Metode RED',
                body: `
<p>Setiap layanan wajib mengekspos minimal empat metrik. Perhatikan penggunaan <strong>pola route</strong>, bukan path sebenarnya.</p>
<pre data-lang="javascript" data-file="services/ledger/metrics.js">const client = require('prom-client');

client.collectDefaultMetrics({ prefix: 'ledger_' });

// ── RED: Rate & Errors ──
const requests = new client.Counter({
  name: 'http_requests_total',
  help: 'Jumlah total request HTTP.',
  labelNames: ['method', 'route', 'status'],   // kardinalitas RENDAH
});

// ── RED: Duration ──
const duration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durasi request HTTP.',
  labelNames: ['method', 'route'],
  // Bucket disesuaikan SLO: p95 &lt; 300 ms, p99 &lt; 1 s
  buckets: [0.02, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75, 1, 2, 5],
});

// ── Saturation: connection pool ──
const poolAktif = new client.Gauge({
  name: 'db_pool_connections_active',
  help: 'Koneksi database yang sedang dipakai.',
});
const poolMenunggu = new client.Gauge({
  name: 'db_pool_waiting_requests',
  help: 'Request yang mengantre menunggu koneksi database.',
});

// ── Metrik BISNIS — ini yang menangkap insiden yang lolos alert teknis ──
const transaksi = new client.Counter({
  name: 'transaksi_diproses_total',
  help: 'Jumlah transaksi yang diproses.',
  labelNames: ['jenis', 'status'],             // jenis: transfer|topup|tarik
});
const nilaiTransaksi = new client.Histogram({
  name: 'transaksi_nilai_rupiah',
  help: 'Nilai transaksi dalam rupiah.',
  buckets: [10000, 50000, 100000, 500000, 1000000, 5000000, 25000000],
});

module.exports = { client, requests, duration, poolAktif, poolMenunggu,
                   transaksi, nilaiTransaksi };</pre>
<div class="callout callout-danger">
    <div class="callout-title">⛔ Jangan lakukan ini</div>
    <ul>
        <li>Label <code>user_id</code>, <code>transaction_id</code>, <code>email</code> — kardinalitas meledak <em>dan</em> melanggar UU PDP.</li>
        <li>Label <code>path</code> berisi URL sebenarnya — pakai pola route.</li>
        <li>Nilai transaksi sebagai label — pakai Histogram.</li>
    </ul>
</div>
<p><strong>Selesai bila:</strong> <code>curl localhost:8081/metrics | grep -vc '^#'</code> menghasilkan angka <strong>di bawah 300</strong> per instance, dan Anda bisa menjelaskan setiap metriknya.</p>`
            },
            {
                title: 'Tahap 3 — Konfigurasi Scrape & Kendali Kardinalitas',
                body: `
<p>Gunakan <code>file_sd</code> agar target bisa digenerate, dan <code>metric_relabel_configs</code> untuk memangkas exporter yang boros.</p>
<pre data-lang="json" data-file="targets/layanan.json">[
  { "targets": ["ledger:8080"],
    "labels": { "layanan": "ledger", "tim": "core", "tingkat": "kritis" } },
  { "targets": ["api-gateway:8080"],
    "labels": { "layanan": "gateway", "tim": "platform", "tingkat": "kritis" } },
  { "targets": ["notifikasi:8080"],
    "labels": { "layanan": "notifikasi", "tim": "growth", "tingkat": "normal" } },
  { "targets": ["rekonsiliasi:8080"],
    "labels": { "layanan": "rekonsiliasi", "tim": "core", "tingkat": "normal" } }
]</pre>
<pre data-lang="yaml" data-file="prometheus.yml (potongan penting)">scrape_configs:
  - job_name: layanan
    scrape_interval: 15s
    file_sd_configs:
      - files: ["/etc/prometheus/targets/layanan.json"]
        refresh_interval: 30s
    sample_limit: 5000                 # pengaman: tolak target yang meledak
    metric_relabel_configs:
      - source_labels: [__name__]
        action: drop
        regex: "(ledger|gateway)_go_(gc|memstats_(frees|lookups|mallocs)).*"

  - job_name: cadvisor
    static_configs: [{ targets: ["cadvisor:8080"] }]
    sample_limit: 30000
    metric_relabel_configs:
      # Allowlist ketat — cAdvisor sangat boros bila dibiarkan
      - source_labels: [__name__]
        action: keep
        regex: "container_(cpu_usage_seconds_total|memory_working_set_bytes|network_(receive|transmit)_bytes_total|fs_usage_bytes)"
      - source_labels: [container]
        action: drop
        regex: "^$|POD"
      - action: labeldrop
        regex: "id|image|image_id|container_id"

  - job_name: blackbox
    metrics_path: /probe
    params: { module: [http_2xx] }
    static_configs:
      - targets: ["http://api-gateway:8080/health",
                  "http://ledger:8080/health"]
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox-exporter:9115</pre>
<p><strong>Selesai bila:</strong> <code>prometheus_tsdb_head_series</code> di bawah <strong>50.000</strong> dan Anda bisa menjelaskan 5 metrik teratas dari <code>topk(5, count by (__name__)({__name__=~".+"}))</code>.</p>`
            },
            {
                title: 'Tahap 4 — Recording Rules & Definisi SLO',
                body: `
<p>Tetapkan SLO tertulis lebih dulu, baru terjemahkan ke recording rule.</p>
<pre data-lang="markdown" data-file="docs/slo.md">| Layanan  | SLI                      | SLO 30 hari | Konsekuensi bila dilanggar |
|----------|--------------------------|-------------|----------------------------|
| ledger   | Ketersediaan (non-5xx)   | 99,95%      | Bekukan rilis fitur        |
| ledger   | Latency p95 &lt; 300 ms     | 99,0%       | Prioritaskan optimasi      |
| gateway  | Ketersediaan             | 99,9%       | Review arsitektur          |
| notifikasi | Ketersediaan           | 99,0%       | Tidak kritis               |

Error budget ledger 30 hari = 0,05% x total request
Bila budget habis: rilis fitur dibekukan sampai budget pulih.</pre>
<pre data-lang="yaml" data-file="rules/recording.yml">groups:
  - name: red-per-layanan
    interval: 30s
    rules:
      - record: layanan:http_requests:rate5m
        expr: sum by (layanan) (rate(http_requests_total[5m]))

      - record: layanan:http_errors:rate5m
        expr: sum by (layanan) (rate(http_requests_total{status=~"5.."}[5m]))

      - record: layanan:http_error_ratio:rate5m
        expr: |
          layanan:http_errors:rate5m
            / clamp_min(layanan:http_requests:rate5m, 0.001)

      - record: layanan:http_latency_p95:5m
        expr: |
          histogram_quantile(0.95,
            sum by (le, layanan) (rate(http_request_duration_seconds_bucket[5m])))

      - record: layanan:http_latency_p99:5m
        expr: |
          histogram_quantile(0.99,
            sum by (le, layanan) (rate(http_request_duration_seconds_bucket[5m])))

  - name: slo-ledger
    interval: 30s
    rules:
      # Multi-window burn rate (Google SRE Workbook), SLO 99,95% -> budget 0,0005
      - record: slo:ledger_error_ratio:5m
        expr: |
          sum(rate(http_requests_total{layanan="ledger", status=~"5.."}[5m]))
            / clamp_min(sum(rate(http_requests_total{layanan="ledger"}[5m])), 0.001)
      - record: slo:ledger_error_ratio:1h
        expr: |
          sum(rate(http_requests_total{layanan="ledger", status=~"5.."}[1h]))
            / clamp_min(sum(rate(http_requests_total{layanan="ledger"}[1h])), 0.001)
      - record: slo:ledger_error_ratio:6h
        expr: |
          sum(rate(http_requests_total{layanan="ledger", status=~"5.."}[6h]))
            / clamp_min(sum(rate(http_requests_total{layanan="ledger"}[6h])), 0.001)

      - record: slo:ledger_burn:5m
        expr: slo:ledger_error_ratio:5m / 0.0005
      - record: slo:ledger_burn:1h
        expr: slo:ledger_error_ratio:1h / 0.0005
      - record: slo:ledger_burn:6h
        expr: slo:ledger_error_ratio:6h / 0.0005</pre>`
            },
            {
                title: 'Tahap 5 — Alerting Berlapis yang Tidak Membanjiri',
                body: `
<p>Susun alert dalam tiga tingkat: <strong>page</strong> (bangunkan orang), <strong>ticket</strong> (kerjakan besok), dan <strong>info</strong> (hanya dashboard).</p>
<pre data-lang="yaml" data-file="rules/alerts.yml">groups:
  # ══ TINGKAT 1: PAGE — bangunkan orang ══════════════════
  - name: page
    rules:
      - alert: LayananKritisMati
        expr: up{tingkat="kritis"} == 0
        for: 2m
        labels: { severity: critical, tim: '{{ $labels.tim }}' }
        annotations:
          summary: "{{ $labels.layanan }} tidak merespons"
          runbook_url: "https://wiki.internal/runbook/layanan-mati"

      - alert: MetrikLayananKritisHilang
        expr: absent(up{layanan="ledger"}) or absent(up{layanan="gateway"})
        for: 5m
        labels: { severity: critical, tim: platform }
        annotations:
          summary: "Metrik layanan kritis hilang — monitoring buta"
          runbook_url: "https://wiki.internal/runbook/metrik-hilang"

      - alert: SLOBurnCepat
        expr: slo:ledger_burn:5m > 14.4 and slo:ledger_burn:1h > 14.4
        for: 2m
        labels: { severity: critical, tim: core, tipe: slo }
        annotations:
          summary: "Error budget ledger habis dalam ~2 jam pada laju ini"
          description: "Burn rate 1 jam: {{ $value | printf \\"%.1f\\" }}x"
          runbook_url: "https://wiki.internal/runbook/slo-burn"

      - alert: PoolDatabaseHabis
        expr: db_pool_waiting_requests > 5
        for: 3m
        labels: { severity: critical, tim: core }
        annotations:
          summary: "{{ $labels.layanan }}: {{ $value }} request mengantre koneksi DB"
          description: >-
            Ini penyebab insiden 40 menit bulan lalu.
            Periksa pg_stat_activity dan DB_POOL_SIZE.
          runbook_url: "https://wiki.internal/runbook/pool-habis"

      - alert: TransaksiAnjlok
        expr: |
          sum(rate(transaksi_diproses_total{status="sukses"}[15m]))
            < 0.4 * sum(rate(transaksi_diproses_total{status="sukses"}[15m] offset 7d))
        for: 15m
        labels: { severity: critical, tim: core }
        annotations:
          summary: "Transaksi sukses turun >60% dibanding minggu lalu jam yang sama"
          runbook_url: "https://wiki.internal/runbook/transaksi-anjlok"

  # ══ TINGKAT 2: TICKET — kerjakan jam kerja ═════════════
  - name: ticket
    rules:
      - alert: SLOBurnLambat
        expr: slo:ledger_burn:6h > 6 and slo:ledger_burn:1h > 6
        for: 15m
        labels: { severity: warning, tim: core, tipe: slo }

      - alert: LatencyMemburuk
        expr: layanan:http_latency_p95:5m > 0.3
        for: 20m
        labels: { severity: warning }
        annotations:
          summary: "p95 {{ $labels.layanan }} = {{ $value | printf \\"%.2f\\" }}s (SLO 0,3s)"

      - alert: DiskAkanPenuh
        expr: |
          predict_linear(node_filesystem_avail_bytes{fstype!~"tmpfs|overlay"}[6h], 8*3600) < 0
          and instance:node_filesystem_usage:ratio > 0.7
        for: 30m
        labels: { severity: warning, tim: platform }

      - alert: SertifikatSegeraKedaluwarsa
        expr: (probe_ssl_earliest_cert_expiry - time()) / 86400 < 14
        for: 1h
        labels: { severity: warning, tim: platform }

  # ══ TINGKAT 3: KESEHATAN MONITORING ITU SENDIRI ════════
  - name: meta
    rules:
      - alert: KardinalitasMelonjak
        expr: predict_linear(prometheus_tsdb_head_series[6h], 24*3600) > 200000
        for: 1h
        labels: { severity: warning, tim: platform }
        annotations:
          summary: "Kardinalitas diprediksi menembus 200rb dalam 24 jam"
          runbook_url: "https://wiki.internal/runbook/kardinalitas"

      - alert: EvaluasiRuleTertinggal
        expr: |
          prometheus_rule_group_last_duration_seconds
            > prometheus_rule_group_interval_seconds
        for: 15m
        labels: { severity: warning, tim: platform }</pre>
<div class="callout callout-warn">
    <div class="callout-title">⚠️ Wajib: uji alert Anda</div>
    <p>Tulis <code>rules/alerts_test.yml</code> yang membuktikan minimal tiga hal: alert berbunyi saat kondisi buruk bertahan, <strong>tidak</strong> berbunyi saat hanya spike sesaat, dan alert <code>absent()</code> berbunyi saat metrik hilang. Jalankan dengan <code>promtool test rules</code>.</p>
</div>`
            },
            {
                title: 'Tahap 6 — Alertmanager: Routing ke Orang yang Tepat',
                body: `
<pre data-lang="yaml" data-file="alertmanager.yml">global:
  resolve_timeout: 5m
  slack_api_url_file: /etc/alertmanager/secrets/slack_url

templates: ["/etc/alertmanager/templates/*.tmpl"]

route:
  receiver: platform-default
  group_by: [alertname, layanan]
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h

  routes:
    # SLO ke kanal khusus, TAPI lanjut juga ke routing severity
    - matchers: ['tipe = "slo"']
      receiver: kanal-slo
      continue: true

    # Kritis -> oncall, cepat
    - matchers: ['severity = "critical"']
      receiver: oncall
      group_wait: 10s
      repeat_interval: 1h
      continue: true

    # Lalu tetap kirim ke kanal tim masing-masing
    - matchers: ['tim = "core"']
      receiver: slack-core
    - matchers: ['tim = "platform"']
      receiver: slack-platform
    - matchers: ['tim = "growth"']
      receiver: slack-growth

inhibit_rules:
  # Layanan mati -> jangan kirim juga alert latency/error dari layanan itu
  - source_matchers: ['alertname = "LayananKritisMati"']
    target_matchers: ['severity =~ "warning|critical"']
    equal: [layanan]

  # Critical membungkam warning untuk alert & layanan yang sama
  - source_matchers: ['severity = "critical"']
    target_matchers: ['severity = "warning"']
    equal: [alertname, layanan]

receivers:
  - name: platform-default
    slack_configs: [{ channel: '#alert-platform', send_resolved: true }]
  - name: oncall
    slack_configs: [{ channel: '#oncall', send_resolved: true,
                      title: '{{ template "slack.judul" . }}',
                      text:  '{{ template "slack.isi" . }}' }]
  - name: kanal-slo
    slack_configs: [{ channel: '#slo', send_resolved: true }]
  - name: slack-core
    slack_configs: [{ channel: '#tim-core', send_resolved: true }]
  - name: slack-platform
    slack_configs: [{ channel: '#tim-platform', send_resolved: true }]
  - name: slack-growth
    slack_configs: [{ channel: '#tim-growth', send_resolved: true }]</pre>
<p><strong>Wajib diverifikasi:</strong></p>
<pre data-lang="bash" data-file="terminal">amtool check-config alertmanager.yml
amtool config routes test --config.file=alertmanager.yml severity=critical tim=core
amtool config routes test --config.file=alertmanager.yml tipe=slo severity=critical tim=core</pre>
<p>Pastikan alert SLO kritis tim core sampai ke <strong>tiga</strong> penerima: <code>kanal-slo</code>, <code>oncall</code>, dan <code>slack-core</code>.</p>`
            },
            {
                title: 'Tahap 7 — Dashboard Grafana sebagai Kode',
                body: `
<p>Jangan membuat dashboard dengan mengklik di UI — ia akan hilang saat container dibuat ulang, dan tidak ada riwayat perubahannya.</p>
<pre data-lang="yaml" data-file="grafana/provisioning/datasources/prometheus.yml">apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    jsonData:
      timeInterval: 15s          # samakan dengan scrape_interval
      httpMethod: POST</pre>
<pre data-lang="yaml" data-file="grafana/provisioning/dashboards/main.yml">apiVersion: 1
providers:
  - name: bayarcepat
    folder: BayarCepat
    type: file
    disableDeletion: false
    updateIntervalSeconds: 30
    options:
      path: /etc/grafana/provisioning/dashboards/json
      foldersFromFilesStructure: true</pre>
<h4>Dashboard yang wajib ada</h4>
<table>
<thead><tr><th>Dashboard</th><th>Panel utama</th><th>Untuk siapa</th></tr></thead>
<tbody>
<tr><td><strong>Ikhtisar Layanan</strong></td><td>RED per layanan, status UP/DOWN, alert aktif</td><td>Semua orang, layar TV</td></tr>
<tr><td><strong>SLO &amp; Error Budget</strong></td><td>Ketersediaan 30 hari, budget tersisa, burn rate</td><td>Engineering manager</td></tr>
<tr><td><strong>Detail Ledger</strong></td><td>Latency per route, pool DB, query lambat</td><td>Tim core saat investigasi</td></tr>
<tr><td><strong>Infrastruktur</strong></td><td>CPU/RAM/disk per node &amp; container</td><td>Tim platform</td></tr>
<tr><td><strong>Bisnis</strong></td><td>Transaksi per jenis, nilai, tingkat keberhasilan</td><td>Product &amp; manajemen</td></tr>
<tr><td><strong>Kesehatan Prometheus</strong></td><td>Kardinalitas, durasi scrape, evaluasi rule</td><td>Tim platform</td></tr>
</tbody>
</table>
<div class="callout callout-tip">
    <div class="callout-title">💡 Gunakan variabel dashboard</div>
    <p>Buat variabel <code>$layanan</code> dari <code>label_values(up, layanan)</code> agar satu dashboard bisa dipakai untuk semua layanan, alih-alih menduplikasi enam dashboard yang hampir sama.</p>
</div>`
            },
            {
                title: 'Tahap 8 — Reproduksi Insiden & Menulis Runbook',
                body: `
<p>Sekarang buktikan sistem Anda bekerja: <strong>ulangi insiden bulan lalu secara sengaja</strong>.</p>
<pre data-lang="bash" data-file="terminal"># 1. Bangkitkan beban yang menghabiskan pool koneksi ledger
#    (DB_POOL_SIZE=8, jadi 40 koneksi bersamaan akan membuat antrean)
for i in $(seq 1 40); do
  curl -s "http://localhost:8081/api/transfer" -X POST \\
    -H "Content-Type: application/json" \\
    -d '{"dari":"A","ke":"B","nilai":50000}' &amp;
done

# 2. Amati di Prometheus, pada rentang waktu yang sama
#    - db_pool_waiting_requests naik
#    - layanan:http_latency_p95:5m melonjak
#    - slo:ledger_burn:5m menembus 14,4

# 3. Verifikasi alert benar-benar berbunyi
curl -s http://localhost:9090/api/v1/alerts | jq '.data.alerts[] | {name:.labels.alertname, state:.state}'
curl -s http://localhost:9093/api/v2/alerts | jq '.[].labels.alertname'</pre>

<h4>Format runbook yang benar-benar berguna</h4>
<pre data-lang="markdown" data-file="runbook/pool-habis.md"># Runbook: PoolDatabaseHabis

## Apa artinya
Request menumpuk menunggu koneksi database. Setiap detik antrean bertambah,
latency pengguna ikut naik. Bila dibiarkan, request mulai timeout.

## Dampak ke pengguna
Transfer dan top-up melambat, lalu gagal. Uang TIDAK hilang
(transaksi bersifat atomik), tetapi pengguna melihat error.

## Diagnosis (5 menit pertama)
1. Buka dashboard "Detail Ledger", panel "DB Pool".
2. Cek koneksi aktif di database:
       docker compose exec db psql -U postgres -d bayarcepat \\
         -c "SELECT count(*), state FROM pg_stat_activity GROUP BY state;"
3. Cari query yang menahan koneksi terlalu lama:
       SELECT pid, now()-query_start AS durasi, state, left(query,80)
       FROM pg_stat_activity
       WHERE state != 'idle' ORDER BY durasi DESC LIMIT 10;

## Tindakan
### Bila ada query lambat yang menahan koneksi
       SELECT pg_terminate_backend(&lt;pid&gt;);   -- hanya untuk query yang jelas nyangkut

### Bila beban memang tinggi dan wajar
       docker compose up -d --scale ledger=3

### Bila pool memang terlalu kecil (perbaikan permanen)
       Naikkan DB_POOL_SIZE 8 -> 25, pasang PgBouncer di depan PostgreSQL.
       Pastikan total pool semua instance &lt; max_connections PostgreSQL.

## Eskalasi
Bila tidak pulih dalam 15 menit, hubungi tim DBA (#tim-dba).

## Pencegahan
- Alert LatencyMemburuk (warning) berbunyi lebih dulu — jangan diabaikan.
- Tinjau DB_POOL_SIZE setiap kali menambah instance layanan.</pre>`
            }
        ],
        criteria: [
            'Seluruh konfigurasi (prometheus.yml, rules, alertmanager.yml, dashboard JSON) ada di Git; tidak ada yang dibuat manual lewat UI.',
            '<code>promtool check config</code> dan <code>promtool check rules</code> lulus tanpa error.',
            '<code>promtool test rules</code> membuktikan minimal 3 skenario: alert berbunyi saat kondisi bertahan, tidak berbunyi saat spike sesaat, dan <code>absent()</code> berbunyi saat metrik hilang.',
            'Seluruh target berstatus UP, termasuk blackbox probe dari luar.',
            'Setiap layanan mengekspos metrik RED lengkap dengan bucket histogram yang disesuaikan SLO — bukan bucket default.',
            'Tidak ada label berkardinalitas tinggi; <code>prometheus_tsdb_head_series</code> di bawah 50.000 dan Anda bisa membenarkan angkanya.',
            'cAdvisor dan exporter boros lainnya dipangkas dengan <code>metric_relabel_configs</code>, dan setiap job punya <code>sample_limit</code>.',
            'Ada minimal 3 metrik bisnis, termasuk satu alert berbasis perbandingan <code>offset 7d</code>.',
            'SLO tertulis di <code>docs/slo.md</code>, dan setiap SLO punya recording rule multi-window burn rate.',
            'Alert terbagi jelas menjadi tingkat <em>page</em> dan <em>ticket</em>; setiap alert punya <code>runbook_url</code> yang benar-benar ada isinya.',
            'Routing Alertmanager diverifikasi dengan <code>amtool config routes test</code>, dan <code>inhibit_rules</code> terbukti memangkas badai alert.',
            'Enam dashboard Grafana ter-provision otomatis dan memakai variabel, bukan duplikasi.',
            'Insiden pool koneksi berhasil direproduksi, alert berbunyi dalam &lt; 5 menit, dan runbook-nya bisa diikuti orang lain tanpa bertanya.',
            'Ada alert untuk kesehatan Prometheus itu sendiri (kardinalitas, evaluasi rule tertinggal).'
        ],
        outro: `
<h3>Tantangan Tambahan</h3>
<ul>
    <li><strong>Remote write ke Mimir.</strong> Kirim <em>hanya</em> hasil recording rule ke penyimpanan jangka panjang, buktikan penghematan seriesnya dengan angka.</li>
    <li><strong>High availability.</strong> Jalankan dua Prometheus dengan <code>external_labels.replica</code> berbeda, daftarkan keduanya di Alertmanager, dan buktikan tidak ada notifikasi ganda.</li>
    <li><strong>Chaos.</strong> Matikan <code>redis</code> di tengah beban dan ukur berapa lama alert berbunyi. Bandingkan dengan target deteksi Anda.</li>
    <li><strong>Uji kardinalitas.</strong> Sengaja tambahkan label <code>transaction_id</code>, amati <code>prometheus_tsdb_head_series</code> meledak, lalu perbaiki dengan <code>labeldrop</code> — catat berapa lama series lama baru benar-benar hilang.</li>
</ul>`
    },

    /* ================== UJIAN AKHIR ================== */
    exam: {
        durationMin: 40,
        passScore: 75,
        subtitle: '25 soal: konsep, PromQL, instrumentasi, alerting, dan operasi produksi. Lulus ≥ 75%.',
        questions: [
            {
                q: 'Metrik <code>http_requests_total</code> punya label <code>method</code> (4), <code>status</code> (7), <code>route</code> (25), pada 12 instance. Berapa time series?',
                opts: ['48', '700', '8.400', '1'],
                a: 2,
                exp: 'Setiap kombinasi label unik = satu time series: 4 × 7 × 25 × 12 = <strong>8.400</strong>. Menambahkan satu label berkardinalitas tinggi akan mengalikan angka ini secara dramatis.'
            },
            {
                q: 'Kenapa <code>sum(rate(x[5m]))</code> benar sementara <code>rate(sum(x)[5m:])</code> salah?',
                opts: [
                    'Karena sintaks kedua tidak valid',
                    'Karena <code>rate()</code> harus dihitung per series agar counter reset tiap instance ditangani dengan benar',
                    'Karena <code>sum()</code> lebih cepat',
                    'Keduanya sebenarnya sama saja'
                ],
                a: 1,
                exp: 'Bila dijumlahkan lebih dulu, restart satu instance membuat nilai gabungan turun dan <code>rate()</code> menafsirkannya sebagai reset global. Aturannya: <strong>rate di dalam, agregasi di luar</strong>.'
            },
            {
                q: 'Anda punya 15 instance dan perlu p99 latency seluruh sistem. Tipe metrik apa yang harus dipakai?',
                opts: ['Summary', 'Histogram', 'Gauge', 'Counter'],
                a: 1,
                exp: 'Persentil Summary dihitung di sisi klien per instance dan <strong>tidak bisa</strong> digabungkan secara matematis. Histogram menyimpan distribusi dalam bucket, sehingga bucket semua instance bisa dijumlahkan lalu persentilnya dihitung ulang dengan benar.'
            },
            {
                q: 'Query <code>histogram_quantile(0.95, sum by (route) (rate(...bucket[5m])))</code> hasilnya kosong. Kenapa?',
                opts: ['Rentang terlalu pendek', 'Label <code>le</code> hilang dari <code>by()</code>', 'Harus pakai <code>irate</code>', 'Bucket salah dikonfigurasi'],
                a: 1,
                exp: '<code>histogram_quantile()</code> membaca label <code>le</code> untuk mengetahui batas atas tiap bucket. Bila <code>le</code> hilang karena agregasi, fungsi ini tidak punya informasi yang dibutuhkan.'
            },
            {
                q: 'Selector <code>{status=~"5"}</code> tidak cocok dengan status 500. Kenapa?',
                opts: [
                    'Status disimpan sebagai angka',
                    'Regex PromQL selalu fully anchored menjadi <code>^(?:5)$</code>',
                    'Harus memakai <code>!~</code>',
                    'Butuh tanda kutip ganda'
                ],
                a: 1,
                exp: 'Prometheus membungkus pola regex menjadi anchored penuh. Gunakan <code>"5.."</code> atau <code>"5.*"</code>. Ini berbeda dari <code>grep</code> yang mencocokkan sebagian string.'
            },
            {
                q: 'Job <code>pembayaran</code> terhapus dari konfigurasi. Alert <code>up{job="pembayaran"} == 0</code> tidak berbunyi. Solusinya?',
                opts: [
                    'Perpanjang <code>for</code>',
                    'Tambah alert terpisah dengan <code>absent(up{job="pembayaran"})</code>',
                    'Ganti menjadi <code>up != 1</code>',
                    'Turunkan <code>scrape_interval</code>'
                ],
                a: 1,
                exp: 'Bila series-nya hilang sama sekali, ekspresi <code>up == 0</code> tidak menghasilkan apa pun. <code>absent()</code> bernilai 1 justru ketika series tidak ditemukan — inilah yang menangkap hilangnya monitoring itu sendiri.'
            },
            {
                q: 'Prometheus di-OOM-kill berulang. Langkah pertama yang paling tepat?',
                opts: [
                    'Menaikkan RAM dari 16 ke 64 GB',
                    'Membuka <code>/tsdb-status</code> untuk mencari label berkardinalitas tinggi',
                    'Menghapus semua alerting rule',
                    'Mengganti ke VictoriaMetrics'
                ],
                a: 1,
                exp: 'Memori Prometheus sebanding dengan jumlah time series aktif. Menambah RAM hanya menunda masalah. Halaman <code>/tsdb-status</code> langsung menunjukkan label dan metrik pelakunya.'
            },
            {
                q: 'Apa perbedaan <code>relabel_configs</code> dan <code>metric_relabel_configs</code>?',
                opts: [
                    'Tidak ada, hanya beda nama',
                    'Yang pertama berjalan sebelum scrape (memilih target), yang kedua sesudah scrape (memfilter metrik)',
                    'Yang pertama untuk counter, yang kedua untuk gauge',
                    'Yang kedua hanya untuk Kubernetes'
                ],
                a: 1,
                exp: '<code>relabel_configs</code> menentukan target mana yang di-scrape dan mengubah label target. <code>metric_relabel_configs</code> berjalan setelah scrape untuk membuang metrik atau label sebelum disimpan — inilah rem darurat kardinalitas Anda.'
            },
            {
                q: 'Manakah tipe metrik yang tepat untuk "jumlah pesanan yang sedang menunggu diproses"?',
                opts: ['Counter', 'Gauge', 'Histogram', 'Summary'],
                a: 1,
                exp: 'Nilai yang bisa naik dan turun adalah <strong>Gauge</strong>. Counter hanya untuk nilai yang tidak pernah berkurang; memakainya di sini akan membuat <code>rate()</code> memberi hasil yang salah.'
            },
            {
                q: 'Kenapa <code>irate()</code> tidak boleh dipakai di alerting rule?',
                opts: [
                    'Karena tidak didukung dalam rule',
                    'Karena hanya memakai dua sampel terakhir sehingga sangat berisik dan menyebabkan alert flapping',
                    'Karena lebih lambat dari <code>rate()</code>',
                    'Karena tidak menangani counter reset'
                ],
                a: 1,
                exp: '<code>irate()</code> sangat responsif terhadap lonjakan sesaat, sehingga alert akan berbunyi dan padam berulang kali. Akibat jangka panjangnya adalah alert fatigue — tim menjadi kebal dan mengabaikan notifikasi penting.'
            },
            {
                q: 'Apa arti nama metrik <code>job:http_requests:rate5m</code>?',
                opts: [
                    'Metrik mentah dari job bernama http',
                    'Hasil recording rule: laju 5 menit yang diagregasi ke level label <code>job</code>',
                    'Alert yang dievaluasi tiap 5 menit',
                    'Metrik yang di-scrape tiap 5 menit'
                ],
                a: 1,
                exp: 'Konvensi <code>level:metrik:operasi</code>. Titik dua tidak pernah muncul di metrik hasil scrape, sehingga menjadi penanda visual bahwa ini hasil recording rule.'
            },
            {
                q: 'Dua recording rule saling bergantung tetapi berada di grup berbeda. Apa risikonya?',
                opts: [
                    'Tidak ada risiko',
                    'Grup dievaluasi paralel, sehingga rule turunan bisa membaca nilai lama atau kosong',
                    'Prometheus akan menolak konfigurasi',
                    'Hasilnya menjadi dua kali lipat'
                ],
                a: 1,
                exp: 'Urutan evaluasi hanya dijamin di dalam satu grup. Rule yang saling bergantung harus berada dalam grup yang sama dan ditulis berurutan dari lapis dasar ke turunan.'
            },
            {
                q: 'Alertmanager: route <code>severity="critical"</code> ditulis sebelum route <code>tim="core"</code>. Apa akibatnya?',
                opts: [
                    'Alert dikirim ke keduanya',
                    'Alert kritis tim core hanya sampai ke penerima route pertama, kecuali ada <code>continue: true</code>',
                    'Konfigurasi ditolak',
                    'Alert tidak terkirim sama sekali'
                ],
                a: 1,
                exp: 'Alertmanager berhenti pada route pertama yang cocok. Untuk mengirim ke lebih dari satu penerima, tambahkan <code>continue: true</code> pada route yang boleh dilanjutkan.'
            },
            {
                q: 'Apa fungsi <code>inhibit_rules</code> di Alertmanager?',
                opts: [
                    'Menunda pengiriman notifikasi',
                    'Menekan alert turunan ketika ada alert penyebab yang lebih besar sedang aktif',
                    'Menghapus alert dari Prometheus',
                    'Mengubah severity secara otomatis'
                ],
                a: 1,
                exp: 'Ketika satu klaster mati, ratusan alert turunan akan muncul. Inhibition menekan alert turunan tersebut sehingga tim hanya menerima notifikasi tentang penyebab sesungguhnya.'
            },
            {
                q: 'Cara yang benar memakai federation adalah…',
                opts: [
                    'Menarik semua metrik dengan <code>{__name__=~".+"}</code>',
                    'Menarik hanya metrik hasil recording rule yang sudah teragregasi',
                    'Menggantikan remote write',
                    'Menjalankan Prometheus tanpa penyimpanan lokal'
                ],
                a: 1,
                exp: 'Federation mentransfer data lewat satu request HTTP, sehingga hanya praktis untuk sedikit metrik teragregasi. Untuk tampilan global lintas klaster, gunakan Thanos atau Mimir.'
            },
            {
                q: 'Anda ingin memantau apakah pengguna benar-benar bisa mengakses situs dari internet. Exporter apa yang dipakai?',
                opts: ['node_exporter', 'blackbox_exporter', 'cAdvisor', 'postgres_exporter'],
                a: 1,
                exp: '<code>blackbox_exporter</code> memeriksa dari luar sistem, sehingga menangkap masalah DNS, sertifikat kedaluwarsa, atau load balancer salah konfigurasi — hal-hal yang tidak terlihat sama sekali dari metrik internal.'
            },
            {
                q: 'Kenapa endpoint <code>/metrics</code> dan port 9090 tidak boleh terbuka ke publik?',
                opts: [
                    'Karena akan memperlambat aplikasi',
                    'Karena Prometheus tidak punya autentikasi bawaan dan metriknya membocorkan topologi serta pola trafik internal',
                    'Karena melanggar lisensi',
                    'Karena Grafana tidak bisa mengaksesnya'
                ],
                a: 1,
                exp: 'Prometheus tidak memiliki autentikasi maupun otorisasi bawaan. Siapa pun yang bisa mengaksesnya dapat membaca seluruh metrik infrastruktur, menjalankan query mahal sebagai serangan DoS, dan — bila admin API aktif — menghapus data.'
            },
            {
                q: 'Metrik <code>backup_terakhir_umur_detik</code> dihasilkan oleh cron job lewat textfile collector. Kenapa skripnya harus menulis ke temp file lalu <code>mv</code>?',
                opts: [
                    'Agar lebih cepat',
                    'Agar node_exporter tidak pernah membaca berkas yang baru tertulis separuh',
                    'Karena node_exporter tidak bisa membaca berkas baru',
                    'Untuk menghemat disk'
                ],
                a: 1,
                exp: 'node_exporter membaca direktori textfile setiap scrape. Operasi <code>mv</code> pada filesystem yang sama bersifat atomik, sehingga pembaca selalu melihat berkas utuh — bukan versi separuh yang gagal di-parse.'
            },
            {
                q: 'Perkiraan disk untuk 600.000 series, scrape 15 detik, retensi 30 hari?',
                opts: ['± 20 GB', '± 207 GB', '± 2 TB', '± 600 MB'],
                a: 1,
                exp: '2.592.000 detik × (600.000 / 15) × 2 byte ≈ <strong>207 GB</strong>. Selalu tambahkan margin 30–50% untuk ruang sementara yang dibutuhkan proses compaction.'
            },
            {
                q: 'Manakah query yang paling efisien?',
                opts: [
                    '<code>{__name__=~".+", job="api"}</code>',
                    '<code>{job=~".*api.*"}</code>',
                    '<code>http_requests_total{job="api"}</code>',
                    '<code>{instance!=""}</code>'
                ],
                a: 2,
                exp: 'Menyebutkan nama metrik secara eksplisit membuat Prometheus langsung memakai indeks dan hanya menyentuh series yang relevan. Selector berbasis regex tanpa nama metrik memaksa pemindaian yang jauh lebih luas.'
            },
            {
                q: 'Pada pola multi-window burn rate, kenapa dipakai dua jendela waktu sekaligus?',
                opts: [
                    'Untuk menghemat penyimpanan',
                    'Jendela panjang memastikan masalahnya nyata; jendela pendek memastikan masalahnya masih berlangsung',
                    'Karena Prometheus mensyaratkannya',
                    'Agar alert berbunyi dua kali'
                ],
                a: 1,
                exp: 'Jendela panjang menyaring spike agar tidak memicu alert palsu; jendela pendek membuat alert otomatis padam setelah insiden selesai, tanpa menunggu jendela panjang bergeser sepenuhnya.'
            },
            {
                q: 'Setelah menambahkan <code>labeldrop</code>, jumlah time series tidak langsung turun. Kenapa?',
                opts: [
                    'Konfigurasinya salah',
                    'Relabeling hanya berlaku untuk data baru; series lama tetap ada sampai retensinya habis',
                    'Perlu me-restart Prometheus',
                    'labeldrop tidak berfungsi untuk exporter'
                ],
                a: 1,
                exp: 'Relabeling memengaruhi data yang akan disimpan. Time series lama tetap ada di TSDB sampai menjadi tidak aktif dan retensinya lewat, sehingga penurunan terlihat bertahap.'
            },
            {
                q: 'Apa yang <strong>tidak</strong> cocok dikerjakan Prometheus?',
                opts: [
                    'Memantau error rate per endpoint',
                    'Menyimpan log aplikasi untuk pencarian teks',
                    'Memicu alert saat disk hampir penuh',
                    'Menghitung p95 latency'
                ],
                a: 1,
                exp: 'Prometheus adalah basis data time-series numerik, bukan penyimpan log. Untuk log gunakan Loki atau Elasticsearch; untuk tracing gunakan Tempo atau Jaeger.'
            },
            {
                q: 'Apa fungsi <code>--storage.tsdb.retention.size</code> selain retensi waktu?',
                opts: [
                    'Mempercepat query',
                    'Jaring pengaman bila kardinalitas melonjak dan disk hampir penuh sebelum retensi waktu tercapai',
                    'Wajib menurut Prometheus',
                    'Menghemat CPU'
                ],
                a: 1,
                exp: 'Retensi waktu tidak melindungi dari lonjakan kardinalitas. Satu label berkardinalitas tinggi yang tak sengaja ditambahkan bisa memenuhi disk dalam hitungan hari, dan Prometheus yang kehabisan disk akan berhenti bekerja.'
            },
            {
                q: 'Anda ingin menampilkan CPU per pod beserta nama tim pemiliknya yang ada di metrik terpisah. Teknik apa yang dipakai?',
                opts: [
                    '<code>sum by (tim)</code>',
                    'Vector matching many-to-one: <code>* on (pod) group_left(label_tim)</code>',
                    '<code>label_replace()</code>',
                    'Subquery'
                ],
                a: 1,
                exp: 'Menggabungkan dua metrik berdasarkan label bersama sambil mengambil label tambahan dari salah satunya adalah pekerjaan vector matching dengan <code>group_left</code> — pola standar untuk join dengan info metric.'
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

        const r = (min, max, d) => +(Math.random() * (max - min) + min).toFixed(d === undefined ? 4 : d);

        // Dataset contoh yang menyerupai sistem produksi
        const TARGETS = [
            { job: 'prometheus', instance: 'localhost:9090',   up: 1 },
            { job: 'node',       instance: 'node-exporter:9100', up: 1 },
            { job: 'cadvisor',   instance: 'cadvisor:8080',    up: 1 },
            { job: 'layanan',    instance: 'ledger:8080',      up: 1, layanan: 'ledger' },
            { job: 'layanan',    instance: 'gateway:8080',     up: 1, layanan: 'gateway' },
            { job: 'layanan',    instance: 'notifikasi:8080',  up: 0, layanan: 'notifikasi' }
        ];

        function hasil(baris) {
            if (!baris.length) {
                say('Empty query result', 't-warn');
                dim('Tidak ada series yang cocok. Periksa nama metrik, label, dan ingat regex PromQL selalu anchored.');
                return;
            }
            const lebar = Math.max.apply(null, baris.map(b => b[0].length));
            say('');
            baris.forEach(b => say('  ' + b[0].padEnd(lebar + 3) + b[1], 't-ok'));
            say('');
            dim('  ' + baris.length + ' series dikembalikan · ' + r(3, 90, 0) + ' ms');
        }

        function seri(nama, label, nilai) {
            const l = Object.keys(label).map(k => k + '="' + label[k] + '"').join(', ');
            return [nama + '{' + l + '}', String(nilai)];
        }

        // ---------- routing ----------
        if (cmd === 'help') {
            info('Perintah yang dikenali simulator ini:');
            say('  promql <query>                      jalankan PromQL');
            say('  targets                             daftar target & statusnya');
            say('  promtool check config <file>        validasi konfigurasi');
            say('  promtool check rules <file>         validasi berkas rule');
            say('  promtool test rules <file>          jalankan unit test alert');
            say('  promtool tsdb analyze /prometheus   analisis kardinalitas blok');
            say('  amtool check-config <file> | amtool silence query | amtool alert query');
            say('  curl -X POST http://localhost:9090/-/reload');
            say('  clear');
            return;
        }

        if (cmd === 'targets' || /api\/v1\/targets/.test(cmd)) {
            say('JOB          INSTANCE               HEALTH   LAST SCRAPE   ERROR');
            TARGETS.forEach(x => {
                say(x.job.padEnd(12) + x.instance.padEnd(23) +
                    (x.up ? 'up      ' : 'down    ') +
                    (r(1, 14, 0) + 's').padEnd(14) +
                    (x.up ? '' : 'dial tcp: connect: connection refused'),
                    x.up ? 't-ok' : 't-err');
            });
            return;
        }

        let m = cmd.match(/^promtool check config\s+(\S+)/);
        if (m) {
            say('Checking ' + m[1]);
            ok(' SUCCESS: 2 rule files found');
            say('');
            say('Checking rules/recording.yml');
            ok(' SUCCESS: 17 rules found');
            say('Checking rules/alerts.yml');
            ok(' SUCCESS: 11 rules found');
            return;
        }

        m = cmd.match(/^promtool check rules\s+(\S+)/);
        if (m) {
            say('Checking ' + m[1]);
            ok('  SUCCESS: ' + r(3, 18, 0) + ' rules found');
            return;
        }

        m = cmd.match(/^promtool test rules\s+(\S+)/);
        if (m) {
            say('Unit Testing:  ' + m[1]);
            if (s.rusak) {
                err('  FAILED');
                err('    alertname: TargetMati, time: 6m');
                err('        exp: [ Labels:{alertname="TargetMati", severity="critical"} ]');
                err('        got: []');
                dim('  Alert tidak berbunyi. Periksa ekspresi dan durasi "for".');
            } else {
                ok('  SUCCESS');
            }
            return;
        }

        if (/^promtool tsdb analyze/.test(cmd)) {
            say('Block ID: 01HQ8XKJ4M2N7P9QRSTUVWXYZ');
            say('Duration: 2h0m0s');
            say('Series: 48219');
            say('Label names: 34');
            say('Postings (unique label pairs): 9142');
            say('');
            info('Label names with highest cardinality:');
            [['id', 14820], ['container_id', 9284], ['pod', 4821],
             ['instance', 312], ['route', 25], ['status', 7]].forEach(x =>
                say('  ' + String(x[1]).padStart(7) + '  ' + x[0], x[1] > 3000 ? 't-err' : ''));
            say('');
            info('Highest cardinality metric names:');
            [['container_network_tcp_usage_total', 18402],
             ['container_memory_working_set_bytes', 8210],
             ['http_request_duration_seconds_bucket', 4200],
             ['http_requests_total', 1680]].forEach(x =>
                say('  ' + String(x[1]).padStart(7) + '  ' + x[0]));
            say('');
            dim('Tindakan: pangkas "id" dan "container_id" dengan labeldrop,');
            dim('dan buang container_network_tcp_usage_total dengan metric_relabel_configs.');
            return;
        }

        if (/^amtool check-config/.test(cmd)) {
            ok("Checking 'alertmanager.yml'  SUCCESS");
            say('Found:');
            say(' - global config');
            say(' - route');
            say(' - 2 inhibit rules');
            say(' - 6 receivers');
            say(' - 1 templates');
            return;
        }

        if (/^amtool config routes test/.test(cmd)) {
            const out = [];
            if (/tipe=slo/.test(cmd)) out.push('kanal-slo');
            if (/severity=critical/.test(cmd)) out.push('oncall');
            if (/tim=core/.test(cmd)) out.push('slack-core');
            else if (/tim=platform/.test(cmd)) out.push('slack-platform');
            if (!out.length) out.push('platform-default');
            out.forEach(x => ok(x));
            return;
        }

        if (/^amtool silence query/.test(cmd)) {
            say('ID                                    MATCHERS                    ENDS         CREATED BY   COMMENT');
            say('4d1e9b7a-1f3c-4a2b-9c8d-0e5f6a7b8c9d  instance="node-1:9100"      in 1h 24m    budi         Maintenance OPS-4821');
            return;
        }
        if (/^amtool alert query/.test(cmd)) {
            say('Alertname            Starts At               Summary');
            say('LayananKritisMati    ' + new Date().toISOString().slice(0, 16) + '        notifikasi tidak merespons', 't-err');
            return;
        }
        if (/^amtool/.test(cmd)) { ok('OK'); return; }

        if (/\/-\/reload/.test(cmd)) {
            if (s.rusak) { err('failed to reload config: parsing YAML file: yaml: line 12: mapping values are not allowed'); return; }
            ok('Konfigurasi dimuat ulang. Periksa /targets untuk memastikan target baru muncul.');
            return;
        }

        m = cmd.match(/^promql\s+([\s\S]+)$/) || cmd.match(/query=([^'"]+)/);
        if (m) {
            const q = m[1].trim();

            // Validasi umum yang mendidik
            if (/^rate\([a-z_:]+\)$/.test(q) || /rate\([a-z_:]+\)\s*$/.test(q) && !/\[/.test(q)) {
                err('Error executing query: invalid parameter "query":');
                err('  1:1: parse error: expected type range vector in call to function "rate", got instant vector');
                dim('Perbaikan: rate() butuh rentang waktu -> rate(http_requests_total[5m])');
                return;
            }
            if (/^sum\([a-z_:]+\[\d+[smhd]\]\)/.test(q)) {
                err('Error executing query: invalid parameter "query":');
                err('  1:5: parse error: expected type instant vector in aggregation expression, got range vector');
                dim('Perbaikan: agregasi butuh instant vector -> sum(rate(http_requests_total[5m]))');
                return;
            }
            if (/histogram_quantile/.test(q) && /by\s*\(/.test(q) && !/\ble\b/.test(q)) {
                say('Empty query result', 't-warn');
                dim('histogram_quantile() butuh label "le". Tambahkan ke dalam by(): sum by (le, route) (...)');
                return;
            }
            if (/\{status=~"5"\}/.test(q) || /status=~"4"\}/.test(q)) {
                say('Empty query result', 't-warn');
                dim('Regex PromQL fully anchored: "5" hanya cocok dengan status yang persis "5". Pakai "5..".');
                return;
            }

            // Jawaban untuk query yang dikenali
            if (/^up\s*==\s*0/.test(q)) {
                return hasil(TARGETS.filter(x => !x.up).map(x =>
                    seri('up', { instance: x.instance, job: x.job }, 0)));
            }
            if (/^up\b/.test(q) && !/absent/.test(q)) {
                return hasil(TARGETS.map(x => seri('up', { instance: x.instance, job: x.job }, x.up)));
            }
            if (/absent\(/.test(q)) {
                if (/pembayaran/.test(q)) return hasil([['{}', '1']]);
                return hasil([]);
            }
            if (/prometheus_tsdb_head_series/.test(q)) {
                return hasil([[ 'prometheus_tsdb_head_series{instance="localhost:9090", job="prometheus"}', '48219' ]]);
            }
            if (/topk\(\s*\d+\s*,\s*count by \(__name__\)/.test(q)) {
                return hasil([
                    ['{__name__="container_network_tcp_usage_total"}',       '18402'],
                    ['{__name__="container_memory_working_set_bytes"}',       '8210'],
                    ['{__name__="http_request_duration_seconds_bucket"}',     '4200'],
                    ['{__name__="http_requests_total"}',                      '1680'],
                    ['{__name__="node_cpu_seconds_total"}',                    '384']
                ]);
            }
            if (/topk\(\s*\d+\s*,\s*count by \(job\)/.test(q)) {
                return hasil([
                    ['{job="cadvisor"}',   '31420'],
                    ['{job="node"}',        '9840'],
                    ['{job="layanan"}',     '5120'],
                    ['{job="prometheus"}',  '1839']
                ]);
            }
            if (/histogram_quantile/.test(q)) {
                const per = /route|handler/.test(q);
                if (per) {
                    return hasil([
                        seri('', { route: '/api/transfer' }, r(0.18, 0.42)),
                        seri('', { route: '/api/saldo' },    r(0.03, 0.09)),
                        seri('', { route: '/api/riwayat' },  r(0.22, 0.68))
                    ].map(x => [x[0].replace('{', '{'), x[1]]));
                }
                return hasil([['{}', String(r(0.12, 0.48))]]);
            }
            if (/status=~"5\.\."/.test(q) && /\//.test(q)) {
                return hasil([['{}', String(r(0.001, 0.031))]]);
            }
            if (/^sum\(rate\(http_requests_total/.test(q) || /sum\(rate\(http_requests_total/.test(q)) {
                if (/by \(layanan\)|by \(job\)/.test(q)) {
                    return hasil([
                        seri('', { layanan: 'ledger' },     r(120, 260, 1)),
                        seri('', { layanan: 'gateway' },    r(300, 520, 1)),
                        seri('', { layanan: 'notifikasi' }, r(10, 40, 1))
                    ]);
                }
                return hasil([['{}', String(r(420, 880, 1))]]);
            }
            if (/rate\(http_requests_total/.test(q)) {
                return hasil([
                    seri('', { route: '/api/transfer', status: '200', instance: 'ledger:8080' }, r(40, 90, 2)),
                    seri('', { route: '/api/saldo',    status: '200', instance: 'ledger:8080' }, r(80, 180, 2)),
                    seri('', { route: '/api/transfer', status: '500', instance: 'ledger:8080' }, r(0, 3, 2))
                ]);
            }
            if (/increase\(/.test(q)) {
                return hasil([['{}', String(r(12, 340, 1))]]);
            }
            if (/changes\(process_start_time/.test(q)) {
                return hasil([
                    seri('', { instance: 'ledger:8080' },      0),
                    seri('', { instance: 'notifikasi:8080' },  4)
                ]);
            }
            if (/node_memory_MemAvailable_bytes/.test(q)) {
                return hasil([
                    seri('node_memory_MemAvailable_bytes', { instance: 'node-exporter:9100' }, r(2.1e9, 3.8e9, 0))
                ]);
            }
            if (/predict_linear/.test(q)) {
                return hasil([seri('', { instance: 'node-exporter:9100', mountpoint: '/' }, r(-2.4e9, 8.2e9, 0))]);
            }
            if (/probe_success/.test(q)) {
                return hasil([
                    seri('probe_success', { instance: 'http://gateway:8080/health' }, 1),
                    seri('probe_success', { instance: 'http://ledger:8080/health' },  1)
                ]);
            }
            if (/probe_ssl_earliest_cert_expiry|cert_expiry/.test(q)) {
                return hasil([seri('', { instance: 'https://bayarcepat.id' }, r(9, 74, 1))]);
            }
            if (/ALERTS/.test(q)) {
                const st = /pending/.test(q) ? 'pending' : 'firing';
                return hasil([
                    seri('ALERTS', { alertname: 'LayananKritisMati', alertstate: st, layanan: 'notifikasi', severity: 'critical' }, 1)
                ]);
            }
            if (/app_build_info/.test(q)) {
                return hasil([
                    seri('app_build_info', { instance: 'ledger:8080',  versi: '2.4.1' }, 1),
                    seri('app_build_info', { instance: 'gateway:8080', versi: '2.4.1' }, 1)
                ]);
            }
            if (/slo:|burn/.test(q)) {
                return hasil([['{}', String(r(0.3, 18.6, 2))]]);
            }
            if (/^job:|^layanan:|^instance:/.test(q)) {
                return hasil([
                    seri('', { job: 'layanan', layanan: 'ledger' },  r(0.001, 0.12, 4)),
                    seri('', { job: 'layanan', layanan: 'gateway' }, r(0.001, 0.05, 4))
                ]);
            }
            if (/remote_storage/.test(q)) {
                return hasil([['{}', '0']]);
            }
            if (/count\(count by/.test(q)) {
                return hasil([['{}', String(r(3, 240, 0))]]);
            }
            if (/scrape_samples_scraped/.test(q)) {
                return hasil([
                    seri('scrape_samples_scraped', { job: 'cadvisor' },  31420),
                    seri('scrape_samples_scraped', { job: 'node' },       984),
                    seri('scrape_samples_scraped', { job: 'layanan' },    248)
                ]);
            }

            // Fallback: query dikenali bentuknya tapi tidak ada di dataset contoh
            say('Empty query result', 't-warn');
            dim('Query valid, tetapi metriknya tidak ada di dataset contoh simulator ini.');
            dim('Coba: up · rate(http_requests_total[5m]) · prometheus_tsdb_head_series · probe_success');
            return;
        }

        if (/^curl/.test(cmd)) { dim('(simulasi) gunakan "promql <query>" atau "targets" untuk hasil yang bisa dibaca'); return; }
        if (/^(promtool|prometheus)\b/.test(cmd)) {
            err('Perintah tidak dikenali simulator ini. Ketik "help".');
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
