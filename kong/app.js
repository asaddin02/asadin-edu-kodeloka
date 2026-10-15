/* Kong API Gateway & Konnect Learning Platform JavaScript Engine */

const modulesData = [
  {
    "id": 1,
    "title": "01. Apa itu API Gateway & Posisi Kong",
    "category": "1 · Fondasi",
    "videoId": "aZWbBcgS16s",
    "duration": "14:00",
    "description": "Masalah yang sebenarnya diselesaikan API gateway, kapan ia belum diperlukan, dan bagaimana Kong bekerja di atas Nginx/OpenResty.",
    "keyTakeaways": [
      "Gateway memindahkan urusan lintas-layanan (auth, rate limit, logging) keluar dari kode aplikasi",
      "Kong dibangun di atas Nginx + OpenResty; plugin ditulis dalam Lua",
      "Data plane meneruskan trafik, control plane menyimpan konfigurasi",
      "Untuk satu-dua layanan, gateway sering belum sepadan"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>📌 Masalah yang Diselesaikan</h3>
                <p>Tanpa gateway, setiap layanan harus menangani sendiri hal-hal yang sebenarnya sama: memverifikasi token, membatasi laju permintaan, mencatat log akses, menangani CORS, dan memasang TLS. Bila layanan Anda ditulis dalam tiga bahasa berbeda, logika itu ditulis ulang tiga kali dengan perilaku yang tidak pernah persis sama.</p>
                <div class="code-container">
                    <pre><code>TANPA gateway                    DENGAN gateway
Klien                            Klien
  ├──&gt; Layanan A (auth+limit)      │
  ├──&gt; Layanan B (auth+limit)      ▼
  └──&gt; Layanan C (auth+limit)    Kong (auth + rate limit + log + TLS)
                                   ├──&gt; Layanan A  (hanya logika bisnis)
  Logika sama ditulis 3x           ├──&gt; Layanan B
  di 3 bahasa berbeda              └──&gt; Layanan C</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>⚙️ Kong Dibangun di Atas Apa</h3>
                <p>Kong bukan proxy yang ditulis dari nol. Ia adalah <strong>Nginx</strong> yang diperluas dengan <strong>OpenResty</strong>, sebuah bundel yang menyematkan penerjemah <strong>LuaJIT</strong> ke dalam Nginx. Setiap plugin Kong pada dasarnya adalah kode Lua yang dijalankan pada fase tertentu saat permintaan diproses.</p>
                <div class="callout callout-info">
                    <strong>💡 Kenapa ini penting untuk diketahui</strong>
                    <p>Karena berbasis Nginx, Kong mewarisi karakter kinerjanya: sangat efisien untuk proxy HTTP, memakai model event non-blocking, dan penyetelan seperti jumlah worker atau ukuran buffer mengikuti aturan Nginx. Ketika menelusuri masalah kinerja, pengetahuan Nginx Anda tetap berlaku.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🧭 Ragam Kong yang Sering Membingungkan</h3>
                <table class="tech-table">
                    <thead><tr><th>Nama</th><th>Apa itu</th></tr></thead>
                    <tbody>
                        <tr><td><strong>Kong Gateway (OSS)</strong></td><td>Inti open source — proxy, routing, plugin dasar</td></tr>
                        <tr><td><strong>Kong Gateway Enterprise</strong></td><td>Tambahan berbayar: RBAC, Dev Portal, plugin lanjutan</td></tr>
                        <tr><td><strong>Kong Konnect</strong></td><td>Control plane terkelola di cloud; data plane tetap di infrastruktur Anda</td></tr>
                        <tr><td><strong>Kong Ingress Controller</strong></td><td>Menjalankan Kong sebagai ingress di Kubernetes</td></tr>
                        <tr><td><strong>Kong Mesh</strong></td><td>Service mesh berbasis Kuma — produk terpisah, bukan gateway</td></tr>
                    </tbody>
                </table>
                <div class="callout callout-warning">
                    <strong>⚠️ Banyak tutorial mencampuradukkan kelimanya</strong>
                    <p>Materi yang tampak membahas "Kong" sering sebenarnya mendemokan Konnect (produk SaaS berbayar) atau Kong Mesh (service mesh). Perhatikan baik-baik varian mana yang sedang dibahas sebelum mengikuti langkah-langkahnya — perintah dan konsepnya berbeda.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🚦 Kapan Gateway Belum Diperlukan</h3>
                <div class="callout callout-danger">
                    <strong>🚫 Gateway menambah satu titik kegagalan</strong>
                    <p>Seluruh trafik Anda kini melewati satu komponen tambahan yang harus dipantau, di-upgrade, dan dibuat redundan. Untuk aplikasi dengan satu atau dua layanan, reverse proxy sederhana atau bahkan ingress bawaan sudah cukup.</p>
                    <p><strong>Gateway mulai sepadan ketika:</strong> ada banyak layanan yang butuh kebijakan seragam, Anda memublikasikan API ke pihak luar dan perlu kuota per konsumen, ada kebutuhan audit terpusat, atau layanan ditulis dalam banyak bahasa sehingga menegakkan kebijakan di kode menjadi mahal.</p>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "bash",
        "title": "Memeriksa Kong",
        "code": "# Versi dan status simpul\ncurl -s http://localhost:8001/ | jq '.version, .configuration.database'\n\n# Kesehatan\ncurl -s http://localhost:8001/status | jq"
      }
    ],
    "interactiveLab": `# Alur permintaan melalui Kong

Klien
  │  GET https://api.contoh.com/pesanan/123
  ▼
Kong :8000 (proxy)
  │  1. cocokkan Route  → host + path
  │  2. jalankan plugin → auth, rate limit, transform
  │  3. teruskan ke Service → upstream
  ▼
layanan-pesanan:8080/pesanan/123`,
    "quiz": [
      {
        "question": "Kong dibangun di atas teknologi apa, dan kenapa itu penting diketahui?",
        "options": [
          "Node.js — sehingga plugin ditulis dalam JavaScript",
          "Nginx + OpenResty dengan LuaJIT — sehingga karakter kinerja dan penyetelan Nginx tetap berlaku",
          "Go — sehingga tidak memerlukan konfigurasi tambahan",
          "Java — sehingga membutuhkan JVM di setiap simpul"
        ],
        "answer": 1,
        "explanation": "Kong adalah Nginx yang diperluas OpenResty, yang menyematkan LuaJIT. Konsekuensinya nyata saat operasi: model konkurensi non-blocking, penyetelan worker dan buffer mengikuti aturan Nginx, dan plugin dijalankan sebagai kode Lua pada fase tertentu dalam siklus pemrosesan permintaan."
      },
      {
        "question": "Dalam situasi apa API gateway justru belum sepadan?",
        "options": [
          "Ketika ada banyak layanan yang membutuhkan kebijakan seragam",
          "Ketika hanya ada satu atau dua layanan, karena gateway menambah titik kegagalan dan beban operasional tanpa manfaat yang sebanding",
          "Ketika API dipublikasikan ke pihak luar",
          "Ketika layanan ditulis dalam banyak bahasa berbeda"
        ],
        "answer": 1,
        "explanation": "Manfaat gateway tumbuh seiring jumlah layanan dan keragaman kebijakan yang harus ditegakkan. Pada sistem kecil, seluruh trafik jadi bergantung pada komponen tambahan yang harus dipantau, dibuat redundan, dan di-upgrade — biaya yang harus dibayar penuh sejak awal."
      }
    ]
  },
  {
    "id": 2,
    "title": "02. Instalasi Kong: DB-less vs Berbasis Database",
    "category": "1 · Fondasi",
    "videoId": "sJEID1xEZMg",
    "duration": "15:30",
    "description": "Dua mode penyimpanan konfigurasi Kong, konsekuensi masing-masing, dan cara menjalankannya dengan Docker Compose.",
    "keyTakeaways": [
      "Mode DB-less membaca konfigurasi dari berkas YAML — cocok untuk GitOps",
      "Mode database (PostgreSQL) memungkinkan perubahan lewat Admin API saat berjalan",
      "Port 8000 untuk proxy, 8001 untuk Admin API",
      "Admin API TIDAK BOLEH terekspos ke internet"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>⚖️ DB-less atau Database?</h3>
                <table class="tech-table">
                    <thead><tr><th></th><th>DB-less</th><th>PostgreSQL</th></tr></thead>
                    <tbody>
                        <tr><td>Sumber konfigurasi</td><td>Berkas YAML</td><td>Basis data</td></tr>
                        <tr><td>Ubah saat berjalan</td><td>Tidak (muat ulang berkas)</td><td>Ya, lewat Admin API</td></tr>
                        <tr><td>Cocok untuk GitOps</td><td><strong>Sangat</strong></td><td>Perlu disiplin tambahan</td></tr>
                        <tr><td>Komponen yang dikelola</td><td>Hanya Kong</td><td>Kong + PostgreSQL</td></tr>
                        <tr><td>Beberapa simpul</td><td>Tiap simpul baca berkas sendiri</td><td>Berbagi satu basis data</td></tr>
                        <tr><td>Dukungan plugin</td><td>Sebagian kecil tidak tersedia</td><td>Semua</td></tr>
                    </tbody>
                </table>
                <div class="callout callout-info">
                    <strong>💡 Anjuran</strong>
                    <p>Untuk proyek baru, mulailah dengan <strong>DB-less</strong>. Konfigurasi menjadi berkas yang bisa ditaruh di Git, ditinjau lewat pull request, dan diterapkan ulang secara identik ke lingkungan mana pun. Mode database baru diperlukan bila Anda butuh perubahan dinamis saat berjalan — misalnya konsumen API yang mendaftar sendiri lewat portal.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>💻 DB-less dengan Docker Compose</h3>
                <div class="code-container">
                    <div class="code-header"><span>compose.yaml</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>services:
  kong:
    image: kong:3.9
    environment:
      KONG_DATABASE: "off"
      KONG_DECLARATIVE_CONFIG: /kong/kong.yaml
      KONG_PROXY_LISTEN: "0.0.0.0:8000"
      # Admin API HANYA ke localhost dalam kontainer
      KONG_ADMIN_LISTEN: "127.0.0.1:8001"
      KONG_PROXY_ACCESS_LOG: /dev/stdout
      KONG_PROXY_ERROR_LOG: /dev/stderr
      KONG_LOG_LEVEL: notice
    volumes:
      - ./kong.yaml:/kong/kong.yaml:ro
    ports:
      - "8000:8000"      # proxy — boleh diekspos
      # port 8001 sengaja TIDAK dipublikasikan
    healthcheck:
      test: ["CMD", "kong", "health"]
      interval: 10s
      retries: 5</code></pre>
                </div>
                <div class="code-container">
                    <div class="code-header"><span>kong.yaml</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>_format_version: "3.0"

services:
  - name: layanan-pesanan
    url: http://layanan-pesanan:8080
    retries: 3
    connect_timeout: 3000
    read_timeout: 30000
    routes:
      - name: rute-pesanan
        paths: ["/pesanan"]
        strip_path: false</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>🔌 Port yang Perlu Diketahui</h3>
                <table class="tech-table">
                    <thead><tr><th>Port</th><th>Fungsi</th><th>Boleh publik?</th></tr></thead>
                    <tbody>
                        <tr><td><strong>8000</strong></td><td>Proxy HTTP — lalu lintas aplikasi</td><td>Ya</td></tr>
                        <tr><td><strong>8443</strong></td><td>Proxy HTTPS</td><td>Ya</td></tr>
                        <tr><td><strong>8001</strong></td><td>Admin API</td><td><strong>TIDAK PERNAH</strong></td></tr>
                        <tr><td><strong>8444</strong></td><td>Admin API HTTPS</td><td>Hanya jaringan internal</td></tr>
                        <tr><td><strong>8002</strong></td><td>Kong Manager (antarmuka web)</td><td>Hanya internal</td></tr>
                    </tbody>
                </table>
                <div class="callout callout-danger">
                    <strong>🚫 Admin API yang terbuka = kendali penuh atas gateway</strong>
                    <p>Admin API <strong>tidak punya autentikasi bawaan</strong> pada Kong OSS. Siapa pun yang bisa menjangkau port 8001 dapat mengubah routing, menonaktifkan plugin autentikasi, mengarahkan trafik ke server penyerang, dan membaca seluruh kredensial konsumen. Ini kesalahan konfigurasi Kong yang paling sering dieksploitasi.</p>
                    <p><strong>Aturan mutlak:</strong> ikat Admin API ke <code>127.0.0.1</code> atau jaringan internal, lindungi dengan firewall, dan jangan pernah mempublikasikan portnya. Bila butuh akses jarak jauh, lewati VPN atau bastion.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🔍 Verifikasi</h3>
                <div class="code-container">
                    <pre><code># Dari dalam kontainer atau jaringan internal
curl -s http://localhost:8001/status | jq

# Menguji proxy
curl -i http://localhost:8000/pesanan/123

# Header yang ditambahkan Kong pada respons:
#   Via: kong/3.9
#   X-Kong-Upstream-Latency: 12
#   X-Kong-Proxy-Latency: 1</code></pre>
                </div>
                <div class="callout callout-tip">
                    <strong>📌 Dua header latensi itu alat diagnosis utama</strong>
                    <p><code>X-Kong-Upstream-Latency</code> adalah waktu yang dihabiskan layanan Anda; <code>X-Kong-Proxy-Latency</code> adalah waktu yang dihabiskan Kong sendiri termasuk seluruh plugin. Bila permintaan lambat, kedua angka ini langsung memberi tahu siapa yang harus disalahkan — gateway atau layanan di belakangnya.</p>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "yaml",
        "title": "kong.yaml minimal",
        "code": "_format_version: \"3.0\"\n\nservices:\n  - name: layanan-pesanan\n    url: http://layanan-pesanan:8080\n    routes:\n      - name: rute-pesanan\n        paths: [\"/pesanan\"]"
      }
    ],
    "interactiveLab": `_format_version: "3.0"

services:
  - name: layanan-pesanan
    url: http://layanan-pesanan:8080
    retries: 3
    connect_timeout: 3000
    read_timeout: 30000
    routes:
      - name: rute-pesanan
        paths: ["/pesanan"]
        methods: ["GET", "POST"]
        strip_path: false`,
    "quiz": [
      {
        "question": "Kenapa Admin API Kong (port 8001) tidak boleh terekspos ke internet?",
        "options": [
          "Karena akan memperlambat proxy",
          "Karena pada Kong OSS ia tidak punya autentikasi bawaan, sehingga siapa pun yang menjangkaunya dapat mengubah routing, mematikan plugin auth, dan membaca kredensial konsumen",
          "Karena port 8001 hanya untuk pengembangan",
          "Karena Admin API hanya mendukung HTTP"
        ],
        "answer": 1,
        "explanation": "Admin API memberi kendali penuh atas konfigurasi gateway tanpa memerlukan kredensial pada edisi open source. Mengeksposnya sama dengan menyerahkan kendali seluruh lalu lintas. Ikat ke localhost atau jaringan internal, dan akses jarak jauh hanya lewat VPN atau bastion."
      },
      {
        "question": "Kapan mode DB-less lebih dianjurkan daripada mode PostgreSQL?",
        "options": [
          "Ketika konsumen API perlu mendaftarkan diri sendiri saat berjalan",
          "Ketika konfigurasi ingin dikelola sebagai kode di Git dan diterapkan identik ke tiap lingkungan",
          "Ketika dibutuhkan seluruh plugin tanpa kecuali",
          "Ketika jumlah simpul Kong sangat banyak"
        ],
        "answer": 1,
        "explanation": "DB-less menjadikan seluruh konfigurasi sebuah berkas YAML yang bisa ditinjau lewat pull request dan diterapkan ulang secara deterministik. Mode database diperlukan ketika konfigurasi harus berubah saat runtime, misalnya pendaftaran konsumen lewat portal, dengan konsekuensi satu komponen tambahan yang harus dikelola."
      }
    ]
  },
  {
    "id": 3,
    "title": "03. Objek Inti: Service, Route, Upstream & Target",
    "category": "1 · Fondasi",
    "videoId": "kGZyAEVioWg",
    "duration": "16:20",
    "description": "Empat objek yang menyusun hampir semua konfigurasi Kong, cara Route dicocokkan, dan jebakan strip_path yang sering menyesatkan.",
    "keyTakeaways": [
      "Route menentukan permintaan mana yang ditangkap; Service menentukan ke mana diteruskan",
      "Upstream + Target dipakai bila satu Service punya banyak instance",
      "strip_path menentukan apakah awalan path ikut diteruskan",
      "Pencocokan Route memprioritaskan yang paling spesifik"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🧱 Hubungan Antar Objek</h3>
                <div class="code-container">
                    <pre><code>Route  ──milik──&gt;  Service  ──menunjuk──&gt;  Upstream  ──berisi──&gt;  Target
(apa yang         (ke mana            (kelompok           (host:port
 ditangkap)        diteruskan)         instance)           konkret)

Contoh:
  Route  : host api.contoh.com, path /pesanan
  Service: url http://upstream-pesanan
  Upstream: nama upstream-pesanan
  Target : pesanan-1:8080 (bobot 100)
           pesanan-2:8080 (bobot 100)</code></pre>
                </div>
                <p>Untuk kasus sederhana, Anda cukup memakai <strong>Service + Route</strong> dan menunjuk langsung ke satu host. Upstream dan Target baru diperlukan ketika ada banyak instance yang perlu diseimbangkan.</p>
            </div>

            <div class="article-section">
                <h3>🎯 Cara Route Dicocokkan</h3>
                <div class="code-container">
                    <pre><code>routes:
  - name: rute-pesanan
    paths: ["/pesanan"]
    hosts: ["api.contoh.com"]
    methods: ["GET", "POST"]
    headers:
      x-versi: ["v2"]
    protocols: ["https"]</code></pre>
                </div>
                <p>Sebuah Route cocok hanya bila <strong>semua</strong> kriteria yang Anda isi terpenuhi. Kriteria yang tidak diisi dianggap bebas.</p>
                <div class="callout callout-info">
                    <strong>💡 Urutan prioritas</strong>
                    <p>Ketika beberapa Route sama-sama cocok, Kong memilih yang <strong>paling spesifik</strong> — dihitung dari jumlah dan ketelitian kriteria yang cocok, bukan dari urutan penulisan di berkas. Route dengan host + path lebih diprioritaskan daripada yang hanya path. Ini berbeda dari Nginx yang sangat bergantung pada urutan blok.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>⚠️ Jebakan strip_path</h3>
                <div class="code-container">
                    <pre><code>Service url : http://layanan-pesanan:8080
Route  path : /pesanan

strip_path: true  (BAWAAN)
  Klien meminta : /pesanan/123
  Upstream terima: /123          ← awalan DIBUANG

strip_path: false
  Klien meminta : /pesanan/123
  Upstream terima: /pesanan/123  ← utuh</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 Ini penyebab 404 paling sering pada Kong</strong>
                    <p>Nilai bawaan <code>strip_path: true</code> membuang awalan path. Bila aplikasi Anda memang mendengarkan di <code>/pesanan/123</code>, permintaan akan tiba sebagai <code>/123</code> dan aplikasi membalas 404 — sementara Kong tampak bekerja normal. Sebelum menyalahkan routing, periksa nilai <code>strip_path</code> lebih dulu.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>⚖️ Upstream: Load Balancing</h3>
                <div class="code-container">
                    <div class="code-header"><span>kong.yaml</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>upstreams:
  - name: upstream-pesanan
    algorithm: round-robin      # atau consistent-hashing, least-connections
    healthchecks:
      active:
        type: http
        http_path: /healthz
        healthy:
          interval: 5
          successes: 2
        unhealthy:
          interval: 5
          http_failures: 3
          timeouts: 3
      passive:
        healthy:
          successes: 5
        unhealthy:
          http_failures: 5
    targets:
      - target: pesanan-1:8080
        weight: 100
      - target: pesanan-2:8080
        weight: 100

services:
  - name: layanan-pesanan
    host: upstream-pesanan      # menunjuk NAMA upstream, bukan URL
    port: 80
    protocol: http</code></pre>
                </div>
                <table class="tech-table">
                    <thead><tr><th>Algoritma</th><th>Kapan dipakai</th></tr></thead>
                    <tbody>
                        <tr><td><code>round-robin</code></td><td>Bawaan; instance setara dan tanpa state</td></tr>
                        <tr><td><code>consistent-hashing</code></td><td>Butuh permintaan dari klien sama selalu ke instance sama</td></tr>
                        <tr><td><code>least-connections</code></td><td>Durasi permintaan sangat bervariasi</td></tr>
                        <tr><td><code>latency</code></td><td>Mengutamakan instance yang paling responsif</td></tr>
                    </tbody>
                </table>
                <div class="callout callout-warning">
                    <strong>⚠️ Health check aktif vs pasif</strong>
                    <p><strong>Aktif</strong> memanggil endpoint kesehatan secara berkala — mendeteksi instance sakit sebelum ada pengguna yang terkena. <strong>Pasif</strong> hanya mengamati hasil trafik nyata — lebih murah, tetapi berarti sebagian pengguna sudah terlanjur menerima error. Untuk produksi, aktifkan keduanya.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🔧 Penyetelan Timeout</h3>
                <div class="code-container">
                    <pre><code>services:
  - name: layanan-laporan
    url: http://layanan-laporan:8080
    connect_timeout: 3000     # ms — membuka koneksi
    write_timeout: 60000      # ms — mengirim permintaan
    read_timeout: 60000       # ms — menunggu respons
    retries: 3</code></pre>
                </div>
                <div class="callout callout-tip">
                    <strong>📌 Timeout gateway harus lebih longgar dari layanan</strong>
                    <p>Bila layanan Anda memberi timeout internal 30 detik tetapi Kong menyerah pada 10 detik, klien menerima 504 padahal layanan sebenarnya masih akan menjawab. Sebaliknya, timeout gateway yang jauh lebih panjang membuat koneksi menumpuk. Sinkronkan keduanya secara sadar, dan pastikan <code>retries</code> tidak dipakai untuk operasi yang tidak idempoten.</p>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "yaml",
        "title": "Upstream dengan health check",
        "code": "upstreams:\n  - name: upstream-pesanan\n    algorithm: round-robin\n    healthchecks:\n      active:\n        type: http\n        http_path: /healthz\n        unhealthy:\n          interval: 5\n          http_failures: 3\n    targets:\n      - target: pesanan-1:8080\n        weight: 100\n      - target: pesanan-2:8080\n        weight: 100"
      }
    ],
    "interactiveLab": `_format_version: "3.0"

upstreams:
  - name: upstream-pesanan
    algorithm: round-robin
    targets:
      - target: pesanan-1:8080
        weight: 100
      - target: pesanan-2:8080
        weight: 100

services:
  - name: layanan-pesanan
    host: upstream-pesanan
    port: 80
    protocol: http
    routes:
      - name: rute-pesanan
        paths: ["/pesanan"]
        strip_path: false     # penting! lihat penjelasan modul`,
    "quiz": [
      {
        "question": "Route dengan path /pesanan meneruskan ke layanan, tetapi layanan selalu membalas 404. Apa yang pertama harus diperiksa?",
        "options": [
          "Apakah upstream sedang tidak sehat",
          "Nilai strip_path — bawaannya true sehingga awalan /pesanan dibuang dan layanan menerima path yang berbeda",
          "Apakah plugin autentikasi aktif",
          "Apakah algoritma load balancing sudah tepat"
        ],
        "answer": 1,
        "explanation": "Dengan strip_path bernilai true (bawaan), permintaan ke /pesanan/123 tiba di upstream sebagai /123. Bila aplikasi memang melayani /pesanan/123, ia akan membalas 404 sementara Kong tampak bekerja normal. Setel strip_path ke false bila awalan path memang bagian dari rute aplikasi."
      },
      {
        "question": "Apa perbedaan health check aktif dan pasif pada Upstream Kong?",
        "options": [
          "Aktif berjalan di siang hari, pasif di malam hari",
          "Aktif memanggil endpoint kesehatan secara berkala sehingga instance sakit terdeteksi sebelum pengguna terkena; pasif hanya mengamati hasil trafik nyata sehingga sebagian pengguna sudah menerima error",
          "Aktif hanya untuk HTTPS, pasif untuk HTTP",
          "Tidak ada perbedaan fungsional"
        ],
        "answer": 1,
        "explanation": "Health check aktif melakukan probe mandiri secara berkala, sehingga target bermasalah bisa dikeluarkan dari rotasi sebelum menerima trafik pengguna. Health check pasif menyimpulkan kesehatan dari respons trafik yang sesungguhnya, yang lebih hemat tetapi berarti kegagalan baru terdeteksi setelah ada pengguna yang terdampak."
      }
    ]
  },
  {
    "id": 4,
    "title": "04. decK: Konfigurasi sebagai Kode",
    "category": "2 · Konfigurasi",
    "videoId": "8SVSohiIhUk",
    "duration": "15:00",
    "description": "Mengelola konfigurasi Kong lewat Git dengan decK: sinkronisasi, diff sebelum menerapkan, dan integrasi ke pipeline CI/CD.",
    "keyTakeaways": [
      "decK menyinkronkan berkas YAML dengan keadaan Kong yang sebenarnya",
      "'deck gateway diff' menampilkan perubahan SEBELUM diterapkan",
      "Tag memungkinkan tiap tim mengelola bagiannya sendiri tanpa saling menimpa",
      "Rahasia tidak boleh ditulis langsung di berkas konfigurasi"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>📌 Masalah Konfigurasi Manual</h3>
                <p>Mengubah Kong lewat Admin API secara langsung terasa cepat, tetapi menimbulkan masalah yang sama seperti mengubah server produksi lewat SSH: tidak ada catatan siapa mengubah apa, lingkungan staging dan produksi perlahan menyimpang, dan memulihkan keadaan setelah insiden berarti mengingat-ingat.</p>
                <div class="callout callout-info">
                    <strong>💡 decK menutup celah itu</strong>
                    <p>Konfigurasi menjadi berkas YAML di Git. Setiap perubahan melewati pull request, terlihat sebagai diff, dan bisa diterapkan ulang secara identik ke lingkungan mana pun.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>💻 Perintah Inti</h3>
                <div class="code-container">
                    <pre><code># Mengambil konfigurasi yang SEDANG berjalan ke berkas
deck gateway dump -o kong.yaml

# Melihat apa yang AKAN berubah — jalankan ini sebelum apa pun
deck gateway diff -s kong.yaml

# Menerapkan
deck gateway sync -s kong.yaml

# Memeriksa keabsahan berkas tanpa menyentuh Kong
deck file validate kong.yaml

# Menggabungkan beberapa berkas menjadi satu
deck file merge tim-a.yaml tim-b.yaml -o gabungan.yaml</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 <code>sync</code> menghapus apa pun yang tidak ada di berkas</strong>
                    <p>decK memaksa keadaan Kong menjadi <em>persis</em> seperti isi berkas. Objek yang ada di Kong tetapi tidak tercantum di YAML akan <strong>dihapus</strong>. Menjalankan <code>sync</code> dengan berkas parsial dapat menghapus konfigurasi tim lain dalam sekejap.</p>
                    <p>Selalu jalankan <code>diff</code> lebih dulu dan baca keluarannya. Untuk lingkungan yang dipakai bersama, gunakan tag seperti dijelaskan di bawah.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🏷️ Tag: Membagi Kepemilikan</h3>
                <div class="code-container">
                    <div class="code-header"><span>tim-pesanan.yaml</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>_format_version: "3.0"

services:
  - name: layanan-pesanan
    url: http://layanan-pesanan:8080
    tags: ["tim-pesanan"]
    routes:
      - name: rute-pesanan
        paths: ["/pesanan"]
        tags: ["tim-pesanan"]</code></pre>
                </div>
                <div class="code-container">
                    <pre><code># Hanya menyentuh objek bertag tim-pesanan.
# Konfigurasi tim lain aman.
deck gateway sync -s tim-pesanan.yaml --select-tag tim-pesanan</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>🔐 Menangani Rahasia</h3>
                <div class="code-container">
                    <pre><code># ❌ Rahasia langsung di berkas yang masuk Git
plugins:
  - name: key-auth
    config:
      key_names: ["apikey"]
consumers:
  - username: mitra-a
    keyauth_credentials:
      - key: "rahasia-asli-jangan-begini"

# ✅ Referensi ke variabel lingkungan
      - key: "\${MITRA_A_KEY}"

# Terapkan dengan nilai dari lingkungan
MITRA_A_KEY=$(vault kv get -field=key rahasia/mitra-a) \\
  deck gateway sync -s kong.yaml</code></pre>
                </div>
                <div class="callout callout-warning">
                    <strong>⚠️ Kredensial konsumen sering lolos ke Git</strong>
                    <p>Perintah <code>deck gateway dump</code> mengambil <em>segalanya</em> termasuk kunci API dan rahasia JWT konsumen. Menjalankan dump lalu langsung commit adalah cara paling umum kredensial produksi bocor ke repositori. Selalu periksa hasil dump sebelum commit, atau kecualikan entitas kredensial dengan <code>--skip-consumers</code>.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🔁 Di dalam Pipeline CI/CD</h3>
                <div class="code-container">
                    <div class="code-header"><span>.github/workflows/kong.yml</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>name: Terapkan konfigurasi Kong

on:
  pull_request:
    paths: ["kong/**"]
  push:
    branches: [main]
    paths: ["kong/**"]

jobs:
  periksa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Validasi berkas
        run: deck file validate kong/kong.yaml
      - name: Tampilkan diff terhadap staging
        run: deck gateway diff -s kong/kong.yaml
        env:
          DECK_KONG_ADDR: \${{ secrets.KONG_ADMIN_STAGING }}

  terapkan:
    if: github.ref == 'refs/heads/main'
    needs: periksa
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Sinkronkan ke produksi
        run: deck gateway sync -s kong/kong.yaml
        env:
          DECK_KONG_ADDR: \${{ secrets.KONG_ADMIN_PROD }}</code></pre>
                </div>
                <div class="callout callout-tip">
                    <strong>📌 Tampilkan diff di pull request</strong>
                    <p>Menjalankan <code>deck gateway diff</code> pada tiap PR dan menempelkan hasilnya sebagai komentar membuat peninjau melihat persis apa yang akan berubah di gateway — bukan sekadar membaca perubahan YAML. Ini menangkap kesalahan seperti Route yang tanpa sadar terhapus atau plugin auth yang hilang.</p>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "bash",
        "title": "Alur kerja decK yang aman",
        "code": "# 1. Validasi berkas\ndeck file validate kong.yaml\n\n# 2. Lihat perubahan SEBELUM menerapkan\ndeck gateway diff -s kong.yaml\n\n# 3. Terapkan hanya untuk tag milik tim ini\ndeck gateway sync -s kong.yaml --select-tag tim-pesanan"
      }
    ],
    "interactiveLab": `_format_version: "3.0"

services:
  - name: layanan-pesanan
    url: http://layanan-pesanan:8080
    tags: ["tim-pesanan"]
    routes:
      - name: rute-pesanan
        paths: ["/pesanan"]
        strip_path: false
        tags: ["tim-pesanan"]

plugins:
  - name: rate-limiting
    service: layanan-pesanan
    tags: ["tim-pesanan"]
    config:
      minute: 100
      policy: local`,
    "quiz": [
      {
        "question": "Kenapa 'deck gateway sync' dengan berkas parsial berbahaya di lingkungan bersama?",
        "options": [
          "Karena sync membutuhkan waktu sangat lama",
          "Karena sync memaksa Kong menjadi persis seperti isi berkas, sehingga objek milik tim lain yang tidak tercantum akan dihapus",
          "Karena sync hanya bekerja pada mode DB-less",
          "Karena sync mengabaikan berkas dan memakai konfigurasi bawaan"
        ],
        "answer": 1,
        "explanation": "decK bersifat deklaratif dan konvergen: keadaan akhir Kong harus sama persis dengan berkas. Apa pun yang ada di Kong tetapi tidak disebut di YAML dianggap harus dihapus. Gunakan --select-tag agar sinkronisasi hanya menyentuh objek milik tim yang bersangkutan."
      },
      {
        "question": "Apa risiko menjalankan 'deck gateway dump' lalu langsung melakukan commit hasilnya?",
        "options": [
          "Berkas hasil dump terlalu besar untuk Git",
          "Dump menyertakan kredensial konsumen seperti kunci API dan rahasia JWT, sehingga rahasia produksi bisa bocor ke repositori",
          "Dump menghapus konfigurasi di Kong",
          "Hasil dump tidak bisa dipakai untuk sync"
        ],
        "answer": 1,
        "explanation": "Perintah dump mengambil seluruh entitas termasuk kredensial konsumen dalam bentuk yang dapat dipakai. Commit tanpa memeriksa adalah salah satu jalur kebocoran rahasia yang paling umum. Periksa hasilnya lebih dulu, atau kecualikan entitas kredensial saat melakukan dump."
      }
    ]
  },
  {
    "id": 5,
    "title": "05. Anatomi Plugin & Urutan Eksekusi",
    "category": "3 · Plugin",
    "videoId": "1hRogjrzlJY",
    "duration": "14:40",
    "description": "Bagaimana plugin dijalankan, empat tingkat cakupan yang menentukan mana yang menang, dan kenapa urutannya sering menjadi sumber bug.",
    "keyTakeaways": [
      "Plugin berjalan pada fase tertentu: certificate, rewrite, access, header_filter, body_filter, log",
      "Cakupan plugin: global, per-Service, per-Route, per-Consumer",
      "Yang paling spesifik menang; hanya SATU instance plugin yang aktif per permintaan",
      "Urutan ditentukan nilai priority, bukan urutan penulisan"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🔄 Fase Pemrosesan</h3>
                <div class="code-container">
                    <pre><code>Permintaan masuk
   │
   ├─ certificate     → penanganan TLS, mTLS
   ├─ rewrite         → sebelum routing dikenali
   ├─ access          → SETELAH route dikenali (mayoritas plugin di sini:
   │                     auth, rate limit, ACL, transformasi request)
   │
   ├──────────&gt; diteruskan ke upstream
   │
   ├─ header_filter   → mengubah header respons
   ├─ body_filter     → mengubah isi respons
   └─ log             → setelah respons dikirim ke klien</code></pre>
                </div>
                <div class="callout callout-info">
                    <strong>💡 Fase <code>log</code> tidak menambah latensi</strong>
                    <p>Plugin logging berjalan setelah respons sudah dikirim ke klien, sehingga tidak memperlambat permintaan. Inilah sebabnya mengirim log ke sistem eksternal relatif aman — berbeda dengan plugin pada fase <code>access</code> yang setiap milidetiknya langsung terasa oleh pengguna.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🎚️ Empat Tingkat Cakupan</h3>
                <div class="code-container">
                    <pre><code>plugins:
  # 1. GLOBAL — berlaku untuk semua
  - name: correlation-id
    config:
      header_name: X-Request-Id
      generator: uuid

  # 2. Per SERVICE
  - name: rate-limiting
    service: layanan-pesanan
    config: { minute: 100 }

  # 3. Per ROUTE — lebih spesifik
  - name: rate-limiting
    route: rute-pesanan-publik
    config: { minute: 20 }

  # 4. Per CONSUMER — paling spesifik
  - name: rate-limiting
    consumer: mitra-premium
    config: { minute: 10000 }</code></pre>
                </div>
                <div class="callout callout-warning">
                    <strong>⚠️ Plugin yang sama TIDAK menumpuk</strong>
                    <p>Bila <code>rate-limiting</code> dipasang di tingkat global, Service, dan Route sekaligus, hanya <strong>satu</strong> yang berlaku — yang paling spesifik. Batasnya <em>tidak</em> dijumlahkan atau digabungkan.</p>
                    <p>Urutan spesifisitas dari yang paling menang: Consumer + Route → Consumer + Service → Consumer → Route → Service → Global. Salah paham soal ini menghasilkan konfigurasi di mana orang mengira sudah memasang batas ketat, padahal yang berlaku batas longgar dari tingkat lain.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🔢 Urutan Antar Plugin Berbeda</h3>
                <p>Plugin yang berbeda dijalankan berdasarkan nilai <strong>priority</strong> bawaannya — semakin besar semakin dulu. Urutan penulisan di berkas tidak berpengaruh.</p>
                <table class="tech-table">
                    <thead><tr><th>Plugin</th><th>Priority (kira-kira)</th><th>Jalan pada</th></tr></thead>
                    <tbody>
                        <tr><td><code>pre-function</code></td><td>Sangat tinggi</td><td>access</td></tr>
                        <tr><td><code>cors</code></td><td>Tinggi</td><td>access</td></tr>
                        <tr><td><code>jwt</code> / <code>key-auth</code> / <code>oauth2</code></td><td>Menengah-tinggi</td><td>access</td></tr>
                        <tr><td><code>acl</code></td><td>Setelah auth</td><td>access</td></tr>
                        <tr><td><code>rate-limiting</code></td><td>Setelah acl</td><td>access</td></tr>
                        <tr><td><code>request-transformer</code></td><td>Menengah</td><td>access</td></tr>
                        <tr><td><code>proxy-cache</code></td><td>Rendah</td><td>access</td></tr>
                        <tr><td><code>file-log</code> / <code>http-log</code></td><td>Sangat rendah</td><td>log</td></tr>
                    </tbody>
                </table>
                <div class="callout callout-info">
                    <strong>💡 Urutan ini masuk akal secara logis</strong>
                    <p>Autentikasi berjalan sebelum ACL karena ACL perlu tahu <em>siapa</em> penggunanya. Rate limiting berjalan setelah autentikasi agar kuota bisa dihitung per konsumen, bukan sekadar per alamat IP. Membalik urutan ini akan merusak model kuota Anda.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🧩 Plugin yang Paling Sering Dipakai</h3>
                <div class="code-container">
                    <pre><code>Autentikasi : key-auth, jwt, basic-auth, oauth2, ldap-auth
Keamanan    : acl, ip-restriction, bot-detection, cors
Lalu lintas : rate-limiting, request-size-limiting, proxy-cache,
              request-termination
Transformasi: request-transformer, response-transformer,
              correlation-id
Observability: prometheus, http-log, file-log, opentelemetry, zipkin
Serverless  : pre-function, post-function (Lua kustom)</code></pre>
                </div>
                <div class="callout callout-tip">
                    <strong>📌 correlation-id sebaiknya global sejak hari pertama</strong>
                    <p>Plugin ini menyuntikkan ID unik ke setiap permintaan dan meneruskannya ke upstream. Ketika ada masalah, satu ID itu memungkinkan Anda melacak satu permintaan melintasi gateway dan seluruh layanan di belakangnya. Biayanya nyaris nol, manfaatnya besar saat insiden.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🐛 Menelusuri Plugin yang Tidak Bekerja</h3>
                <div class="code-container">
                    <pre><code># Semua plugin yang aktif
curl -s http://localhost:8001/plugins | jq '.data[] |
  {name, enabled, service: .service.id, route: .route.id, consumer: .consumer.id}'

# Plugin pada satu route tertentu
curl -s http://localhost:8001/routes/rute-pesanan/plugins | jq

# Menonaktifkan sementara tanpa menghapus
curl -X PATCH http://localhost:8001/plugins/&lt;id&gt; --data "enabled=false"</code></pre>
                </div>
                <p>Bila sebuah plugin tampak tidak berpengaruh, penyebab yang paling sering: ada instance plugin yang sama di tingkat lebih spesifik yang menimpanya, atau plugin dipasang di Service padahal Route yang menangani permintaan tersebut sudah punya konfigurasi sendiri.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "yaml",
        "title": "Plugin berlapis dengan cakupan berbeda",
        "code": "plugins:\n  - name: correlation-id      # global\n    config:\n      header_name: X-Request-Id\n\n  - name: rate-limiting       # per service\n    service: layanan-pesanan\n    config: { minute: 100 }\n\n  - name: rate-limiting       # per consumer — MENANG\n    consumer: mitra-premium\n    config: { minute: 10000 }"
      }
    ],
    "interactiveLab": `_format_version: "3.0"

plugins:
  - name: correlation-id
    config:
      header_name: X-Request-Id
      generator: uuid
      echo_downstream: true

  - name: cors
    config:
      origins: ["https://aplikasi.contoh.com"]
      methods: ["GET", "POST", "PUT", "DELETE"]
      credentials: true
      max_age: 3600`,
    "quiz": [
      {
        "question": "Plugin rate-limiting dipasang di tingkat global (1000/menit) dan di tingkat Route (20/menit). Berapa batas yang berlaku untuk permintaan ke Route tersebut?",
        "options": [
          "1020 per menit — keduanya dijumlahkan",
          "20 per menit — hanya konfigurasi paling spesifik yang berlaku, tidak ditumpuk",
          "1000 per menit — global selalu menang",
          "Tidak ada batas karena konfigurasinya bertentangan"
        ],
        "answer": 1,
        "explanation": "Kong hanya menjalankan satu instance dari setiap jenis plugin per permintaan, yaitu yang cakupannya paling spesifik. Konfigurasi Route mengalahkan Service dan global, dan nilainya menggantikan sepenuhnya — bukan dijumlahkan. Salah paham soal ini membuat orang mengira batas ketatnya berlaku padahal yang aktif batas dari tingkat lain."
      },
      {
        "question": "Kenapa plugin autentikasi harus berjalan sebelum plugin ACL dan rate-limiting?",
        "options": [
          "Karena plugin auth membutuhkan lebih banyak memori",
          "Karena ACL perlu tahu siapa penggunanya untuk memeriksa keanggotaan grup, dan rate limiting perlu identitas agar kuota dihitung per konsumen",
          "Karena urutan penulisan di berkas menentukan eksekusi",
          "Karena plugin auth berjalan pada fase log"
        ],
        "answer": 1,
        "explanation": "Urutan ditentukan nilai priority dan disusun agar logis: autentikasi menetapkan identitas konsumen lebih dulu, sehingga ACL dapat memeriksa keanggotaan grup dan rate limiting dapat menerapkan kuota per konsumen alih-alih sekadar per alamat IP."
      }
    ]
  },
  {
    "id": 6,
    "title": "06. Rate Limiting, Caching & Perlindungan Trafik",
    "category": "3 · Plugin",
    "videoId": null,
    "duration": "15:40",
    "description": "Membatasi laju permintaan dengan benar di banyak simpul Kong, menyimpan respons di cache, dan membatasi ukuran permintaan.",
    "keyTakeaways": [
      "policy 'local' menghitung per simpul — batas efektif berlipat sesuai jumlah simpul",
      "policy 'redis' memberi hitungan terpusat yang akurat",
      "proxy-cache hanya untuk data yang benar-benar sama bagi semua pengguna",
      "request-size-limiting mencegah unggahan raksasa membanjiri layanan"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>⚠️ Jebakan Terbesar: policy local</h3>
                <div class="code-container">
                    <pre><code>plugins:
  - name: rate-limiting
    config:
      minute: 100
      policy: local        # ← bawaan</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 Batas 100/menit di 3 simpul = 300/menit sebenarnya</strong>
                    <p>Dengan <code>policy: local</code>, setiap simpul Kong menyimpan hitungannya sendiri di memori. Load balancer menyebar permintaan ke tiga simpul, masing-masing menghitung sampai 100, sehingga total yang lolos adalah 300. Kuota yang Anda janjikan ke pelanggan menjadi tidak akurat, dan proteksi terhadap penyalahgunaan jauh lebih lemah dari yang dikira.</p>
                    <p>Ini hanya tidak bermasalah bila Anda benar-benar menjalankan satu simpul, atau bila batasnya memang sekadar pengaman kasar.</p>
                </div>
                <div class="code-container">
                    <div class="code-header"><span>Hitungan terpusat dengan Redis</span></div>
                    <pre><code>plugins:
  - name: rate-limiting
    config:
      minute: 100
      hour: 2000
      policy: redis
      redis:
        host: redis
        port: 6379
        password: "\${REDIS_PASSWORD}"
        database: 0
        timeout: 2000
      fault_tolerant: true      # bila Redis mati, JANGAN tolak permintaan
      hide_client_headers: false</code></pre>
                </div>
                <div class="callout callout-warning">
                    <strong>⚠️ Pertimbangan <code>fault_tolerant</code></strong>
                    <p>Bila bernilai <code>true</code> dan Redis tidak terjangkau, Kong <em>meloloskan</em> permintaan alih-alih menolaknya. Ini menjaga layanan tetap hidup ketika Redis bermasalah, tetapi berarti pembatasan laju hilang sementara. Bila rate limiting Anda merupakan kendali keamanan (bukan sekadar kuota komersial), pertimbangkan <code>false</code> — dan pastikan Redis Anda punya ketersediaan tinggi.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>📊 Header yang Dikirim ke Klien</h3>
                <div class="code-container">
                    <pre><code>RateLimit-Limit: 100
RateLimit-Remaining: 87
RateLimit-Reset: 34

# Saat kuota habis:
HTTP/1.1 429 Too Many Requests
Retry-After: 34</code></pre>
                </div>
                <div class="callout callout-tip">
                    <strong>📌 Jangan sembunyikan header ini</strong>
                    <p>Klien yang bisa melihat sisa kuotanya dapat mengatur ritme sendiri dan menghormati <code>Retry-After</code>. Menyembunyikannya membuat klien menabrak batas berulang kali tanpa tahu kapan harus berhenti — yang justru menambah beban gateway Anda.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>💾 proxy-cache</h3>
                <div class="code-container">
                    <pre><code>plugins:
  - name: proxy-cache
    service: layanan-katalog
    config:
      response_code: [200, 301]
      request_method: ["GET", "HEAD"]
      content_type: ["application/json"]
      cache_ttl: 300              # detik
      strategy: memory
      cache_control: false        # abaikan header Cache-Control upstream
      vary_headers: ["Accept-Language"]</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 Cache di gateway membocorkan data antar pengguna</strong>
                    <p>Bila endpoint mengembalikan data berbeda per pengguna berdasarkan token, dan Anda men-cache-nya tanpa memasukkan identitas ke dalam kunci cache, <strong>pengguna A akan menerima respons milik pengguna B</strong>. Ini bukan kemungkinan teoretis — ini insiden yang berulang kali terjadi.</p>
                    <p>Aturannya: <strong>hanya cache data yang benar-benar identik untuk semua orang</strong>. Katalog produk publik, daftar kategori, konfigurasi statis. Jangan pernah cache respons yang bergantung pada identitas kecuali Anda memasukkan pengenal pengguna ke <code>vary_headers</code> secara eksplisit dan memahami konsekuensinya.</p>
                </div>
                <div class="code-container">
                    <pre><code>Respons dari cache membawa header:
  X-Cache-Status: Hit | Miss | Bypass | Refresh

# Membersihkan seluruh cache
curl -X DELETE http://localhost:8001/proxy-cache</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>🛡️ Perlindungan Lain</h3>
                <div class="code-container">
                    <pre><code># Membatasi ukuran permintaan
plugins:
  - name: request-size-limiting
    config:
      allowed_payload_size: 10        # megabyte
      size_unit: megabytes

# Membatasi berdasarkan alamat IP
  - name: ip-restriction
    route: rute-admin
    config:
      allow: ["10.0.0.0/8", "192.168.1.0/24"]

# Menolak permintaan tanpa meneruskan ke upstream
  - name: request-termination
    route: rute-usang
    config:
      status_code: 410
      message: "Endpoint ini sudah dihentikan. Gunakan /v2/pesanan."</code></pre>
                </div>
                <div class="callout callout-tip">
                    <strong>📌 request-termination untuk pensiun API dengan sopan</strong>
                    <p>Ketika sebuah versi API dihentikan, mematikannya begitu saja membuat klien menerima error jaringan yang membingungkan. Plugin ini membalas kode status yang jelas beserta pesan yang memberi tahu ke mana harus pindah — tanpa perlu menyentuh kode layanan sama sekali. Ia juga berguna sebagai sakelar darurat untuk mematikan endpoint bermasalah dengan cepat.</p>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "yaml",
        "title": "Rate limiting terpusat",
        "code": "plugins:\n  - name: rate-limiting\n    config:\n      minute: 100\n      hour: 2000\n      policy: redis          # WAJIB bila lebih dari satu simpul\n      redis:\n        host: redis\n        port: 6379\n      fault_tolerant: true"
      }
    ],
    "interactiveLab": `_format_version: "3.0"

plugins:
  - name: rate-limiting
    service: layanan-publik
    config:
      minute: 60
      policy: redis
      redis:
        host: redis
        port: 6379
      fault_tolerant: true

  - name: request-size-limiting
    config:
      allowed_payload_size: 10
      size_unit: megabytes

  - name: proxy-cache
    service: layanan-katalog     # data publik, sama untuk semua
    config:
      response_code: [200]
      request_method: ["GET"]
      cache_ttl: 300
      strategy: memory`,
    "quiz": [
      {
        "question": "Rate limiting disetel 100/menit dengan policy 'local' pada kluster berisi 3 simpul Kong. Berapa permintaan yang sebenarnya bisa lolos per menit?",
        "options": [
          "100 — batas berlaku untuk seluruh kluster",
          "Sekitar 300 — karena tiap simpul menghitung sendiri di memorinya",
          "33 — batas dibagi rata ke tiap simpul",
          "Tidak terbatas"
        ],
        "answer": 1,
        "explanation": "Policy 'local' menyimpan penghitung di memori masing-masing simpul tanpa koordinasi. Load balancer menyebar trafik, sehingga tiap simpul mengizinkan 100 permintaan dan totalnya menjadi sekitar 300. Untuk batas yang akurat lintas simpul, gunakan policy redis yang menyimpan hitungan secara terpusat."
      },
      {
        "question": "Kenapa proxy-cache berbahaya untuk endpoint yang mengembalikan data per pengguna?",
        "options": [
          "Karena akan membuat respons menjadi lambat",
          "Karena respons yang di-cache dipakai ulang untuk pengguna lain, sehingga data milik satu pengguna bisa tersaji ke pengguna berbeda",
          "Karena proxy-cache tidak mendukung format JSON",
          "Karena cache akan memenuhi memori gateway"
        ],
        "answer": 1,
        "explanation": "Kunci cache secara bawaan tidak menyertakan identitas pengguna, sehingga satu salinan respons disajikan ke semua peminta dengan permintaan serupa. Untuk endpoint yang hasilnya bergantung pada token atau sesi, ini menyebabkan kebocoran data lintas pengguna. Cache di gateway hanya aman untuk data yang identik bagi semua orang."
      }
    ]
  },
  {
    "id": 7,
    "title": "07. Transformasi Request & Response",
    "category": "3 · Plugin",
    "videoId": null,
    "duration": "13:30",
    "description": "Mengubah header, query, dan isi permintaan tanpa menyentuh kode layanan — beserta batasannya yang perlu disadari.",
    "keyTakeaways": [
      "request-transformer mengubah apa yang diterima upstream",
      "response-transformer mengubah apa yang diterima klien",
      "Berguna untuk menjaga kompatibilitas saat API berevolusi",
      "Transformasi berat di gateway menyembunyikan kompleksitas dan mempersulit debug"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>💻 request-transformer</h3>
                <div class="code-container">
                    <pre><code>plugins:
  - name: request-transformer
    route: rute-pesanan
    config:
      add:
        headers:
          - "X-Sumber:gateway"
          - "X-Diteruskan-Oleh:kong"
        querystring:
          - "versi:v2"
      remove:
        headers:
          - "X-Header-Internal"
          - "Authorization"        # jangan teruskan token mentah ke upstream
      rename:
        headers:
          - "X-Lama:X-Baru"
      replace:
        headers:
          - "Host:layanan-internal"</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>💻 response-transformer</h3>
                <div class="code-container">
                    <pre><code>plugins:
  - name: response-transformer
    service: layanan-pesanan
    config:
      remove:
        headers:
          - "Server"               # sembunyikan detail teknologi
          - "X-Powered-By"
        json:
          - "debug_info"           # buang field internal
          - "internal_id"
      add:
        headers:
          - "X-Waktu-Respons:$(date)"
        json:
          - "api_version:v2"</code></pre>
                </div>
                <div class="callout callout-tip">
                    <strong>📌 Menghapus header Server itu praktik yang baik</strong>
                    <p>Header seperti <code>Server</code> dan <code>X-Powered-By</code> memberi tahu penyerang persis teknologi dan versi yang Anda pakai, sehingga mereka bisa langsung mencari eksploit yang cocok. Menghapusnya di gateway berlaku untuk semua layanan sekaligus, tanpa perlu mengubah satu pun aplikasi.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🔀 Kegunaan Nyata: Menjaga Kompatibilitas</h3>
                <div class="code-container">
                    <pre><code>Masalah: layanan mengganti nama field "nama" menjadi "nama_lengkap",
         tetapi ada klien mobile lama yang belum bisa diperbarui.

Solusi sementara di gateway:
plugins:
  - name: response-transformer
    route: rute-v1-pengguna
    config:
      add:
        json:
          - "nama:$(headers.x-nama-lengkap)"</code></pre>
                </div>
                <div class="callout callout-warning">
                    <strong>⚠️ Ini utang teknis, perlakukan sebagai utang</strong>
                    <p>Transformasi kompatibilitas di gateway memang menyelamatkan Anda saat mendesak. Tetapi ia menciptakan perilaku yang <strong>tidak terlihat di kode layanan mana pun</strong>. Pengembang baru yang membaca kode akan bingung kenapa responsnya berbeda dari yang tertulis.</p>
                    <p>Tetapkan tanggal kedaluwarsa saat memasangnya, catat di dokumentasi, dan hapus begitu klien lama sudah bermigrasi.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🚫 Batas yang Wajar</h3>
                <div class="callout callout-danger">
                    <strong>🚫 Gateway bukan tempat logika bisnis</strong>
                    <p>Godaan yang sering muncul: karena transformasi begitu mudah, orang mulai memindahkan makin banyak logika ke gateway — menggabungkan beberapa respons, menghitung nilai, menerapkan aturan bisnis lewat <code>pre-function</code> Lua. Akhirnya gateway menjadi aplikasi tersembunyi yang tidak punya uji, tidak punya kontrol versi yang layak, dan hanya dipahami satu-dua orang.</p>
                    <p><strong>Batas yang sehat:</strong> gateway boleh mengurus hal yang <em>seragam untuk semua layanan</em> — autentikasi, kuota, log, header keamanan, penyembunyian detail teknologi. Apa pun yang khas untuk satu layanan sebaiknya berada di dalam kode layanan itu, tempat ia bisa diuji.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🧪 Menguji Transformasi</h3>
                <div class="code-container">
                    <pre><code># Lihat persis apa yang diterima upstream dengan layanan echo
services:
  - name: echo
    url: http://httpbin.org/anything
    routes:
      - name: rute-echo
        paths: ["/echo"]

# lalu:
curl -s http://localhost:8000/echo | jq '.headers, .args'
# Keluarannya memperlihatkan header dan query setelah transformasi.</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "yaml",
        "title": "Menyembunyikan detail teknologi",
        "code": "plugins:\n  - name: response-transformer\n    config:\n      remove:\n        headers:\n          - \"Server\"\n          - \"X-Powered-By\"\n          - \"X-AspNet-Version\""
      }
    ],
    "interactiveLab": `_format_version: "3.0"

plugins:
  - name: request-transformer
    route: rute-pesanan
    config:
      add:
        headers:
          - "X-Sumber:gateway"
      remove:
        headers:
          - "Authorization"    # token tidak diteruskan mentah

  - name: response-transformer
    service: layanan-pesanan
    config:
      remove:
        headers: ["Server", "X-Powered-By"]
        json: ["debug_info"]`,
    "quiz": [
      {
        "question": "Kenapa memindahkan makin banyak logika ke plugin transformasi gateway adalah pola yang berbahaya?",
        "options": [
          "Karena plugin transformasi sangat lambat",
          "Karena perilaku tersebut tidak terlihat di kode layanan mana pun, tidak punya uji, dan gateway perlahan menjadi aplikasi tersembunyi",
          "Karena Kong membatasi jumlah plugin per route",
          "Karena transformasi hanya bekerja pada respons JSON"
        ],
        "answer": 1,
        "explanation": "Logika yang berada di konfigurasi gateway tidak muncul saat orang membaca kode layanan, sulit diuji secara otomatis, dan pengetahuannya cenderung terkonsentrasi pada satu-dua orang. Gateway sebaiknya hanya menangani urusan yang seragam lintas layanan; logika khas satu layanan tempatnya di dalam layanan itu."
      },
      {
        "question": "Apa manfaat menghapus header Server dan X-Powered-By di gateway?",
        "options": [
          "Mempercepat waktu respons secara signifikan",
          "Menyembunyikan detail teknologi dan versi dari penyerang, dan berlaku untuk semua layanan sekaligus tanpa mengubah kode aplikasi",
          "Mengurangi penggunaan memori Kong",
          "Membuat respons menjadi valid menurut standar HTTP"
        ],
        "answer": 1,
        "explanation": "Header tersebut mengungkap tumpukan teknologi beserta versinya, yang mempermudah penyerang mencocokkan eksploit yang diketahui. Menghapusnya di gateway menerapkan perlindungan itu secara seragam ke seluruh layanan di belakangnya tanpa perlu menyentuh satu pun kode aplikasi."
      }
    ]
  },
  {
    "id": 8,
    "title": "08. Autentikasi: Key, JWT, OAuth2 & Consumer",
    "category": "4 · Keamanan",
    "videoId": "4qmu7jSODoY",
    "duration": "17:00",
    "description": "Objek Consumer sebagai identitas, empat metode autentikasi beserta kapan masing-masing tepat, dan kesalahan konfigurasi yang membuka celah.",
    "keyTakeaways": [
      "Consumer adalah identitas yang dikenali Kong — kredensial menempel padanya",
      "key-auth untuk integrasi server-ke-server, JWT untuk aplikasi pengguna",
      "anonymous consumer sering menjadi celah keamanan yang tidak disadari",
      "Layanan di belakang gateway harus tetap memverifikasi identitas"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>👤 Consumer: Identitas di Kong</h3>
                <div class="code-container">
                    <pre><code>consumers:
  - username: mitra-a
    custom_id: "PARTNER-001"
    tags: ["mitra", "tier-premium"]
    keyauth_credentials:
      - key: "\${MITRA_A_KEY}"
    acls:
      - group: premium

  - username: aplikasi-mobile
    jwt_secrets:
      - key: "aplikasi-mobile"
        algorithm: RS256
        rsa_public_key: |
          -----BEGIN PUBLIC KEY-----
          ...
          -----END PUBLIC KEY-----</code></pre>
                </div>
                <p>Setelah autentikasi berhasil, Kong meneruskan identitas ke upstream lewat header:</p>
                <div class="code-container">
                    <pre><code>X-Consumer-ID: 4f1a...
X-Consumer-Username: mitra-a
X-Consumer-Custom-ID: PARTNER-001
X-Credential-Identifier: ...</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>🔑 Memilih Metode</h3>
                <table class="tech-table">
                    <thead><tr><th>Metode</th><th>Tepat untuk</th><th>Catatan</th></tr></thead>
                    <tbody>
                        <tr><td><code>key-auth</code></td><td>Integrasi server-ke-server, API mitra</td><td>Sederhana; kunci harus dirotasi berkala</td></tr>
                        <tr><td><code>jwt</code></td><td>Aplikasi web &amp; mobile</td><td>Tanpa state; Kong memverifikasi tanda tangan</td></tr>
                        <tr><td><code>oauth2</code></td><td>Akses pihak ketiga atas nama pengguna</td><td>Paling rumit; Kong menjadi authorization server</td></tr>
                        <tr><td><code>basic-auth</code></td><td>Alat internal saja</td><td>Kredensial dikirim tiap permintaan — wajib HTTPS</td></tr>
                        <tr><td><code>openid-connect</code></td><td>Integrasi dengan Keycloak, Auth0, dll</td><td>Fitur enterprise</td></tr>
                    </tbody>
                </table>
                <div class="code-container">
                    <div class="code-header"><span>key-auth</span></div>
                    <pre><code>plugins:
  - name: key-auth
    service: layanan-mitra
    config:
      key_names: ["apikey", "x-api-key"]
      key_in_header: true
      key_in_query: false          # JANGAN izinkan kunci di query string
      key_in_body: false
      hide_credentials: true       # jangan teruskan kunci ke upstream</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 Kunci API di query string bocor ke mana-mana</strong>
                    <p>URL lengkap tercatat di log akses proxy, log server, riwayat peramban, header <code>Referer</code>, dan sistem pemantauan. Kunci yang dikirim lewat query string akan tersebar ke tempat-tempat yang tidak Anda kendalikan dan bertahan lama di sana. Selalu setel <code>key_in_query: false</code> dan wajibkan kunci dikirim lewat header.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🎫 JWT</h3>
                <div class="code-container">
                    <pre><code>plugins:
  - name: jwt
    service: layanan-pesanan
    config:
      claims_to_verify: ["exp", "nbf"]
      key_claim_name: iss
      secret_is_base64: false
      run_on_preflight: false      # biarkan preflight CORS lewat</code></pre>
                </div>
                <div class="callout callout-warning">
                    <strong>⚠️ <code>claims_to_verify</code> tidak memeriksa kedaluwarsa secara bawaan</strong>
                    <p>Bila <code>exp</code> tidak dicantumkan dalam <code>claims_to_verify</code>, Kong akan menerima token yang tanda tangannya sah <strong>meski sudah kedaluwarsa bertahun-tahun</strong>. Ini kesalahan konfigurasi yang mudah terlewat karena semuanya tampak bekerja normal. Selalu sertakan <code>exp</code>.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🕵️ Anonymous Consumer</h3>
                <div class="code-container">
                    <pre><code>plugins:
  - name: key-auth
    config:
      anonymous: "\${ID_CONSUMER_ANONIM}"   # ← perhatikan baik-baik</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 Ini membuat autentikasi menjadi opsional</strong>
                    <p>Dengan <code>anonymous</code> disetel, permintaan <strong>tanpa kredensial tetap diloloskan</strong> dan diperlakukan sebagai consumer anonim. Niat aslinya adalah mendukung akses berjenjang — anonim dapat kuota kecil, terautentikasi dapat kuota besar. Tetapi bila Anda mengiranya sebagai autentikasi wajib, Anda baru saja membuka API Anda ke publik.</p>
                    <p>Bila memakainya, <strong>wajib</strong> pasangkan dengan plugin <code>acl</code> yang menolak grup anonim pada endpoint sensitif. Bila tidak butuh akses berjenjang, jangan setel sama sekali.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🛡️ ACL: Otorisasi Setelah Autentikasi</h3>
                <div class="code-container">
                    <pre><code>plugins:
  - name: acl
    route: rute-admin
    config:
      allow: ["admin", "internal"]
      hide_groups_header: true

  - name: acl
    route: rute-premium
    config:
      deny: ["anonymous", "trial"]</code></pre>
                </div>
                <p>Autentikasi menjawab "siapa Anda"; ACL menjawab "apakah Anda boleh". Keduanya berpasangan — plugin auth menetapkan consumer, lalu ACL memeriksa keanggotaan grupnya.</p>
            </div>

            <div class="article-section">
                <h3>🔒 Gateway Bukan Satu-satunya Penjaga</h3>
                <div class="callout callout-danger">
                    <strong>🚫 Jangan percaya header X-Consumer-* secara buta</strong>
                    <p>Layanan Anda menerima <code>X-Consumer-Username</code> dari Kong dan mungkin memakainya untuk otorisasi. Masalahnya: bila seseorang bisa menjangkau layanan Anda <strong>langsung tanpa melewati gateway</strong>, ia bisa mengirim header itu dengan nilai apa pun dan menyamar sebagai siapa saja.</p>
                    <p>Pertahanannya berlapis: (1) layanan hanya boleh menerima koneksi dari gateway — lewat NetworkPolicy, security group, atau mTLS; (2) untuk sistem yang sensitif, layanan memverifikasi sendiri token aslinya alih-alih memercayai header; (3) jangan pernah menganggap "ada di belakang gateway" sama dengan "aman".</p>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "yaml",
        "title": "key-auth yang aman",
        "code": "plugins:\n  - name: key-auth\n    service: layanan-mitra\n    config:\n      key_names: [\"x-api-key\"]\n      key_in_header: true\n      key_in_query: false      # kunci di URL bocor ke log\n      hide_credentials: true   # jangan teruskan ke upstream"
      }
    ],
    "interactiveLab": `_format_version: "3.0"

consumers:
  - username: mitra-a
    keyauth_credentials:
      - key: "\${MITRA_A_KEY}"
    acls:
      - group: premium

plugins:
  - name: key-auth
    service: layanan-mitra
    config:
      key_names: ["x-api-key"]
      key_in_query: false
      hide_credentials: true
      # anonymous SENGAJA tidak disetel → autentikasi wajib

  - name: acl
    service: layanan-mitra
    config:
      allow: ["premium"]`,
    "quiz": [
      {
        "question": "Apa yang terjadi bila opsi 'anonymous' disetel pada plugin key-auth?",
        "options": [
          "Permintaan tanpa kredensial akan ditolak dengan status 401",
          "Permintaan tanpa kredensial tetap diloloskan sebagai consumer anonim, sehingga autentikasi menjadi opsional",
          "Kong akan membuat kunci API otomatis untuk setiap pengunjung",
          "Plugin key-auth menjadi nonaktif"
        ],
        "answer": 1,
        "explanation": "Opsi anonymous dirancang untuk akses berjenjang, di mana pengunjung tanpa kredensial tetap dilayani dengan kuota terbatas. Bila operator mengiranya sebagai autentikasi wajib, API menjadi terbuka untuk publik tanpa disadari. Bila dipakai, harus dipasangkan dengan ACL yang menolak grup anonim pada endpoint sensitif."
      },
      {
        "question": "Kenapa layanan di belakang Kong tidak boleh memercayai header X-Consumer-Username secara buta?",
        "options": [
          "Karena header tersebut sering salah eja",
          "Karena bila layanan dapat dijangkau langsung tanpa melewati gateway, penyerang bisa mengirim header itu dengan nilai apa pun dan menyamar sebagai pengguna lain",
          "Karena Kong mengenkripsi header tersebut",
          "Karena header itu hanya tersedia pada mode DB-less"
        ],
        "answer": 1,
        "explanation": "Header identitas hanya bermakna bila dijamin berasal dari gateway. Tanpa pembatasan jaringan atau mTLS yang memastikan layanan hanya menerima koneksi dari Kong, siapa pun yang bisa menjangkau layanan secara langsung dapat memalsukan header tersebut sepenuhnya."
      }
    ]
  },
  {
    "id": 9,
    "title": "09. TLS, mTLS & Pengerasan Produksi",
    "category": "4 · Keamanan",
    "videoId": null,
    "duration": "14:50",
    "description": "Mengelola sertifikat dan SNI, mewajibkan sertifikat klien, serta daftar periksa pengerasan sebelum Kong melayani trafik nyata.",
    "keyTakeaways": [
      "Certificate + SNI memungkinkan banyak domain pada satu simpul Kong",
      "mTLS memverifikasi identitas KLIEN, bukan hanya server",
      "Admin API wajib terisolasi dari jaringan publik",
      "Header keamanan sebaiknya dipasang seragam di gateway"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🔐 Sertifikat & SNI</h3>
                <div class="code-container">
                    <pre><code>certificates:
  - cert: |
      -----BEGIN CERTIFICATE-----
      ...
      -----END CERTIFICATE-----
    key: "\${TLS_PRIVATE_KEY}"
    snis:
      - name: api.contoh.com
      - name: mitra.contoh.com</code></pre>
                </div>
                <p><strong>SNI</strong> (Server Name Indication) memungkinkan satu simpul Kong menyajikan sertifikat berbeda untuk domain berbeda pada IP yang sama. Kong memilih sertifikat berdasarkan nama host yang diminta klien saat jabat tangan TLS.</p>
                <div class="callout callout-tip">
                    <strong>📌 Otomatiskan perpanjangan sertifikat</strong>
                    <p>Sertifikat kedaluwarsa adalah penyebab pemadaman yang sepenuhnya dapat dihindari, dan tetap terjadi berulang kali di banyak organisasi. Gunakan cert-manager bila Kong berjalan di Kubernetes, atau ACME client yang terjadwal di luar itu. Pasang juga alert yang berbunyi 14 hari sebelum kedaluwarsa sebagai jaring pengaman.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🤝 Mutual TLS</h3>
                <div class="code-container">
                    <pre><code>ca_certificates:
  - cert: |
      -----BEGIN CERTIFICATE-----
      ... sertifikat CA internal ...
      -----END CERTIFICATE-----
    id: ca-internal

plugins:
  - name: mtls-auth
    service: layanan-mitra
    config:
      ca_certificates: ["ca-internal"]
      skip_consumer_lookup: false
      revocation_check_mode: STRICT</code></pre>
                </div>
                <div class="callout callout-info">
                    <strong>💡 Kapan mTLS sepadan</strong>
                    <p>TLS biasa membuktikan bahwa <em>server</em> adalah pihak yang benar. mTLS menambahkan arah sebaliknya: klien juga harus menunjukkan sertifikat yang ditandatangani CA yang Anda percayai. Ini tepat untuk integrasi mitra bernilai tinggi, komunikasi antar layanan internal, dan lingkungan dengan kewajiban kepatuhan.</p>
                    <p>Harganya adalah pengelolaan siklus hidup sertifikat klien — penerbitan, distribusi, rotasi, dan pencabutan. Bila proses itu belum ada, mTLS akan menjadi sumber pemadaman baru.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🛡️ Header Keamanan Seragam</h3>
                <div class="code-container">
                    <pre><code>plugins:
  - name: response-transformer
    config:
      add:
        headers:
          - "Strict-Transport-Security:max-age=31536000; includeSubDomains"
          - "X-Content-Type-Options:nosniff"
          - "X-Frame-Options:DENY"
          - "Referrer-Policy:strict-origin-when-cross-origin"
      remove:
        headers:
          - "Server"
          - "X-Powered-By"</code></pre>
                </div>
                <p>Memasangnya di gateway berarti setiap layanan di belakangnya langsung terlindungi, termasuk layanan lama yang tidak akan diperbarui lagi.</p>
            </div>

            <div class="article-section">
                <h3>🌐 CORS yang Tidak Membocorkan</h3>
                <div class="code-container">
                    <pre><code>plugins:
  - name: cors
    config:
      origins: ["https://aplikasi.contoh.com"]   # BUKAN "*"
      methods: ["GET", "POST", "PUT", "DELETE"]
      headers: ["Authorization", "Content-Type"]
      exposed_headers: ["X-Request-Id"]
      credentials: true
      max_age: 3600</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 origins "*" bersama credentials true</strong>
                    <p>Kombinasi ini adalah kesalahan konfigurasi serius. Spesifikasi CORS melarangnya, dan implementasi yang longgar dapat membuat <strong>situs mana pun mengirim permintaan dengan cookie pengguna Anda dan membaca responsnya</strong>. Bila memakai <code>credentials: true</code>, daftarkan origin secara eksplisit — tanpa pengecualian.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>✅ Daftar Periksa Sebelum Produksi</h3>
                <table class="tech-table">
                    <thead><tr><th>Periksa</th><th>Kenapa</th></tr></thead>
                    <tbody>
                        <tr><td>Admin API tidak terjangkau publik</td><td>Kendali penuh atas gateway ada di sana</td></tr>
                        <tr><td>Admin API dilindungi (mTLS/VPN/RBAC)</td><td>Lapisan kedua bila isolasi jaringan bocor</td></tr>
                        <tr><td>Semua rute produksi memakai HTTPS</td><td>Kredensial tidak melintas dalam bentuk polos</td></tr>
                        <tr><td><code>key_in_query: false</code></td><td>Kunci di URL bocor ke log dan Referer</td></tr>
                        <tr><td><code>exp</code> ada di <code>claims_to_verify</code></td><td>Tanpa ini token kedaluwarsa tetap diterima</td></tr>
                        <tr><td><code>anonymous</code> tidak disetel tanpa ACL</td><td>Membuat autentikasi menjadi opsional</td></tr>
                        <tr><td>CORS memakai origin eksplisit</td><td>Wildcard + credentials membuka celah</td></tr>
                        <tr><td>Rate limiting memakai policy terpusat</td><td>Policy local tidak akurat di banyak simpul</td></tr>
                        <tr><td>Layanan hanya menerima koneksi dari Kong</td><td>Mencegah pemalsuan header identitas</td></tr>
                        <tr><td>Sertifikat diperbarui otomatis + alert</td><td>Kedaluwarsa adalah pemadaman yang dapat dicegah</td></tr>
                        <tr><td><code>request-size-limiting</code> aktif</td><td>Mencegah unggahan raksasa membanjiri layanan</td></tr>
                        <tr><td>Rahasia dari variabel lingkungan/vault</td><td>Tidak ada kredensial di Git</td></tr>
                    </tbody>
                </table>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "yaml",
        "title": "Header keamanan di gateway",
        "code": "plugins:\n  - name: response-transformer\n    config:\n      add:\n        headers:\n          - \"Strict-Transport-Security:max-age=31536000; includeSubDomains\"\n          - \"X-Content-Type-Options:nosniff\"\n          - \"X-Frame-Options:DENY\"\n      remove:\n        headers: [\"Server\", \"X-Powered-By\"]"
      }
    ],
    "interactiveLab": `_format_version: "3.0"

certificates:
  - cert: "\${TLS_CERT}"
    key: "\${TLS_KEY}"
    snis:
      - name: api.contoh.com

plugins:
  - name: cors
    config:
      origins: ["https://aplikasi.contoh.com"]   # eksplisit, bukan "*"
      credentials: true
      max_age: 3600

  - name: response-transformer
    config:
      add:
        headers:
          - "Strict-Transport-Security:max-age=31536000"
          - "X-Content-Type-Options:nosniff"`,
    "quiz": [
      {
        "question": "Kenapa kombinasi CORS origins '*' dengan credentials true berbahaya?",
        "options": [
          "Karena membuat permintaan menjadi lebih lambat",
          "Karena memungkinkan situs mana pun mengirim permintaan dengan cookie pengguna dan membaca responsnya",
          "Karena Kong akan menolak konfigurasi tersebut",
          "Karena wildcard tidak didukung protokol HTTPS"
        ],
        "answer": 1,
        "explanation": "Ketika kredensial diizinkan, respons dapat dibaca oleh origin yang meminta. Membolehkan semua origin sekaligus berarti situs berbahaya mana pun dapat memanggil API Anda memakai sesi pengguna yang sedang aktif dan membaca hasilnya. Spesifikasi CORS melarang kombinasi ini, dan origin harus didaftarkan secara eksplisit."
      },
      {
        "question": "Apa yang ditambahkan mTLS dibanding TLS biasa?",
        "options": [
          "Enkripsi yang lebih kuat pada lalu lintas",
          "Verifikasi identitas klien — klien juga harus menunjukkan sertifikat yang ditandatangani CA tepercaya, bukan hanya server yang membuktikan diri",
          "Kompresi data otomatis",
          "Kemampuan menyajikan banyak domain pada satu IP"
        ],
        "answer": 1,
        "explanation": "TLS biasa hanya membuktikan identitas server kepada klien. mTLS menambahkan arah sebaliknya sehingga kedua pihak saling terverifikasi. Manfaatnya besar untuk integrasi mitra dan komunikasi antar layanan, dengan konsekuensi Anda harus mengelola penerbitan, rotasi, dan pencabutan sertifikat klien."
      }
    ]
  },
  {
    "id": 10,
    "title": "10. Kong Ingress Controller 3.x & Gateway API",
    "category": "5 · Kubernetes",
    "videoId": "hrYqGXU-a6E",
    "duration": "16:10",
    "description": "Menjalankan Kong sebagai ingress di Kubernetes, memakai Gateway API sebagai antarmuka utama, dan mengelola plugin lewat CRD.",
    "keyTakeaways": [
      "KIC 3.x menjadikan Gateway API sebagai cara yang dianjurkan",
      "Konfigurasi Kong menjadi objek Kubernetes, bukan panggilan Admin API",
      "KongPlugin dilampirkan ke resource lewat anotasi",
      "CRD lama seperti KongIngress sudah usang"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>📌 Perbedaan Mendasar di Kubernetes</h3>
                <p>Di luar Kubernetes, Anda mengonfigurasi Kong lewat Admin API atau berkas decK. Di dalam Kubernetes, <strong>objek Kubernetes menjadi sumber kebenarannya</strong> — controller membaca Gateway, HTTPRoute, dan CRD Kong, lalu menerjemahkannya menjadi konfigurasi Kong secara otomatis.</p>
                <div class="callout callout-warning">
                    <strong>⚠️ Jangan mencampur dua cara sekaligus</strong>
                    <p>Mengubah konfigurasi lewat Admin API pada Kong yang dikelola KIC adalah pekerjaan sia-sia: controller akan mengembalikannya ke keadaan yang tertulis di objek Kubernetes pada rekonsiliasi berikutnya. Pilih satu jalur dan konsisten.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>📦 Instalasi</h3>
                <div class="code-container">
                    <pre><code>helm repo add kong https://charts.konghq.com
helm repo update

helm install kong kong/ingress \\
  -n kong --create-namespace \\
  --set gateway.ingressController.gatewayDiscovery.enabled=true

kubectl get pods -n kong
kubectl get gatewayclass</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>🚪 Gateway API — Cara yang Dianjurkan</h3>
                <div class="code-container">
                    <div class="code-header"><span>gateway.yaml</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                    <pre><code>apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: gerbang-kong
  namespace: kong
spec:
  gatewayClassName: kong
  listeners:
    - name: https
      protocol: HTTPS
      port: 443
      hostname: "*.contoh.com"
      tls:
        certificateRefs:
          - name: tls-wildcard
      allowedRoutes:
        namespaces:
          from: All          # route dari namespace mana pun boleh menempel
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: rute-pesanan
  namespace: produksi
spec:
  parentRefs:
    - name: gerbang-kong
      namespace: kong
  hostnames: ["api.contoh.com"]
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /pesanan
      backendRefs:
        - name: layanan-pesanan
          port: 80
          weight: 90
        - name: layanan-pesanan-baru
          port: 80
          weight: 10        # canary 10% — bagian dari spesifikasi</code></pre>
                </div>
                <div class="callout callout-info">
                    <strong>💡 Kenapa Gateway API lebih baik daripada Ingress</strong>
                    <p>Dengan Ingress, kemampuan seperti pembagian trafik dan pencocokan header hanya tersedia lewat anotasi khusus vendor, sehingga konfigurasi terkunci pada satu controller. Gateway API menjadikannya field resmi, sekaligus memisahkan peran: tim platform mengelola <code>Gateway</code> beserta sertifikatnya, tim aplikasi mengelola <code>HTTPRoute</code> masing-masing di namespace sendiri.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🔌 Plugin lewat CRD</h3>
                <div class="code-container">
                    <pre><code>apiVersion: configuration.konghq.com/v1
kind: KongPlugin
metadata:
  name: batas-laju
  namespace: produksi
config:
  minute: 100
  policy: redis
  redis:
    host: redis.produksi.svc.cluster.local
    port: 6379
plugin: rate-limiting
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: rute-pesanan
  namespace: produksi
  annotations:
    konghq.com/plugins: batas-laju      # ← dilampirkan di sini
spec:
  ...</code></pre>
                </div>
                <p>Anotasi <code>konghq.com/plugins</code> dapat dipasang pada HTTPRoute, Ingress, Service, atau KongConsumer — cakupannya mengikuti resource tempat ia dilampirkan.</p>
            </div>

            <div class="article-section">
                <h3>👥 Consumer & Kredensial sebagai Objek</h3>
                <div class="code-container">
                    <pre><code>apiVersion: v1
kind: Secret
metadata:
  name: kredensial-mitra-a
  namespace: produksi
  labels:
    konghq.com/credential: key-auth
stringData:
  key: "rahasia-dari-external-secrets"
---
apiVersion: configuration.konghq.com/v1
kind: KongConsumer
metadata:
  name: mitra-a
  namespace: produksi
  annotations:
    kubernetes.io/ingress.class: kong
username: mitra-a
credentials:
  - kredensial-mitra-a</code></pre>
                </div>
                <div class="callout callout-tip">
                    <strong>📌 Pasangkan dengan External Secrets Operator</strong>
                    <p>Kredensial disimpan sebagai Secret Kubernetes, yang berarti hanya di-encode base64 dan tidak boleh masuk Git dalam bentuk mentah. External Secrets Operator dapat mengambilnya dari Vault atau AWS Secrets Manager, sehingga yang tersimpan di Git hanyalah petunjuk lokasinya.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>⚠️ CRD yang Sudah Usang</h3>
                <div class="callout callout-danger">
                    <strong>🚫 KongIngress tidak lagi dipakai</strong>
                    <p>Banyak tutorial masih mengajarkan CRD <code>KongIngress</code> untuk mengatur perilaku upstream, protokol, dan penulisan ulang path. CRD ini sudah usang di KIC 3.x. Penggantinya lebih spesifik dan lebih jelas: <strong>KongUpstreamPolicy</strong> untuk pengaturan load balancing dan health check, serta field resmi Gateway API untuk routing dan penulisan ulang path.</p>
                </div>
                <div class="code-container">
                    <pre><code>apiVersion: configuration.konghq.com/v1beta1
kind: KongUpstreamPolicy
metadata:
  name: kebijakan-pesanan
  namespace: produksi
spec:
  algorithm: least-connections
  healthchecks:
    active:
      type: http
      httpPath: /healthz
      healthy:
        interval: 5
        successes: 2
      unhealthy:
        interval: 5
        httpFailures: 3</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>🔍 Menelusuri Masalah</h3>
                <div class="code-container">
                    <pre><code>kubectl get gateway,httproute -A
kubectl describe httproute rute-pesanan -n produksi
kubectl logs -n kong deploy/kong-controller -c ingress-controller --tail=100
kubectl get kongplugin,kongconsumer -A

# Melihat konfigurasi Kong yang DIHASILKAN controller
kubectl exec -n kong deploy/kong-gateway -- \\
  curl -s http://localhost:8001/config | jq</code></pre>
                </div>
                <p>Bagian <code>status</code> pada objek HTTPRoute adalah tempat pertama yang harus dilihat: ia menyatakan apakah route berhasil menempel ke Gateway, dan bila tidak, alasannya.</p>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "yaml",
        "title": "HTTPRoute dengan canary",
        "code": "apiVersion: gateway.networking.k8s.io/v1\nkind: HTTPRoute\nmetadata:\n  name: rute-pesanan\n  annotations:\n    konghq.com/plugins: batas-laju\nspec:\n  parentRefs:\n    - name: gerbang-kong\n  rules:\n    - backendRefs:\n        - name: layanan-pesanan\n          port: 80\n          weight: 90\n        - name: layanan-pesanan-baru\n          port: 80\n          weight: 10"
      }
    ],
    "interactiveLab": `apiVersion: configuration.konghq.com/v1
kind: KongPlugin
metadata:
  name: batas-laju
config:
  minute: 100
  policy: redis
  redis:
    host: redis.produksi.svc.cluster.local
plugin: rate-limiting
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: rute-pesanan
  annotations:
    konghq.com/plugins: batas-laju
spec:
  parentRefs:
    - name: gerbang-kong
      namespace: kong
  hostnames: ["api.contoh.com"]
  rules:
    - matches:
        - path: { type: PathPrefix, value: /pesanan }
      backendRefs:
        - name: layanan-pesanan
          port: 80`,
    "quiz": [
      {
        "question": "Apa yang terjadi bila Anda mengubah konfigurasi lewat Admin API pada Kong yang dikelola Ingress Controller?",
        "options": [
          "Perubahan tersimpan permanen dan menimpa objek Kubernetes",
          "Controller akan mengembalikannya ke keadaan yang tertulis di objek Kubernetes pada rekonsiliasi berikutnya",
          "Kong akan berhenti melayani trafik",
          "Perubahan otomatis disalin menjadi objek Kubernetes"
        ],
        "answer": 1,
        "explanation": "Dalam mode ini objek Kubernetes adalah sumber kebenaran. Controller terus membandingkan konfigurasi Kong dengan objek yang ada di kluster dan memaksanya kembali sesuai. Perubahan manual lewat Admin API akan hilang, sehingga Anda harus memilih satu jalur konfigurasi dan konsisten memakainya."
      },
      {
        "question": "CRD KongIngress sudah usang di KIC 3.x. Apa penggantinya untuk mengatur load balancing dan health check upstream?",
        "options": [
          "Anotasi konghq.com/upstream pada Service",
          "KongUpstreamPolicy, sementara routing dan penulisan ulang path memakai field resmi Gateway API",
          "ConfigMap bernama kong-upstream",
          "Tidak ada penggantinya, fitur tersebut dihapus"
        ],
        "answer": 1,
        "explanation": "KIC 3.x memecah tanggung jawab KongIngress yang dulu terlalu luas menjadi bagian-bagian yang lebih jelas. KongUpstreamPolicy menangani algoritma load balancing dan health check, sedangkan urusan routing, pencocokan, dan penulisan ulang path menjadi field resmi di dalam spesifikasi Gateway API."
      }
    ]
  },
  {
    "id": 11,
    "title": "11. Observability: Metrik, Log & Tracing",
    "category": "6 · Operasi",
    "videoId": "GJRbpQth3QY",
    "duration": "15:20",
    "description": "Mengekspor metrik ke Prometheus, mengirim log terstruktur, dan menyambungkan trace dari gateway sampai ke layanan terdalam.",
    "keyTakeaways": [
      "Plugin prometheus mengekspor metrik di endpoint /metrics",
      "Metrik per-konsumen sangat berguna tetapi berisiko meledakkan kardinalitas",
      "Plugin opentelemetry menyambungkan trace gateway dengan layanan",
      "Gateway adalah tempat terbaik memulai trace karena melihat semua trafik"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>📊 Metrik Prometheus</h3>
                <div class="code-container">
                    <pre><code>plugins:
  - name: prometheus
    config:
      per_consumer: false        # hati-hati, lihat peringatan di bawah
      status_code_metrics: true
      latency_metrics: true
      bandwidth_metrics: true
      upstream_health_metrics: true</code></pre>
                </div>
                <div class="code-container">
                    <pre><code># Metrik tersedia di Admin API
curl -s http://localhost:8001/metrics

# Yang paling berguna:
kong_http_requests_total{service,route,code,consumer}
kong_request_latency_ms_bucket{service,route}        # latensi total
kong_kong_latency_ms_bucket{service,route}           # waktu di Kong sendiri
kong_upstream_latency_ms_bucket{service,route}       # waktu di layanan
kong_upstream_target_health{upstream,target,state}
kong_nginx_connections_total{state}</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 <code>per_consumer: true</code> bisa melumpuhkan Prometheus</strong>
                    <p>Mengaktifkannya menambahkan label <code>consumer</code> ke setiap metrik. Bila Anda punya 10.000 konsumen dikali beberapa service, route, dan kode status, jumlah time series meledak menjadi jutaan dan Prometheus kehabisan memori.</p>
                    <p>Aktifkan hanya bila jumlah konsumen Anda memang kecil dan stabil — misalnya puluhan mitra B2B. Untuk API publik dengan banyak konsumen, biarkan mati dan pakai log atau trace untuk analisis per-konsumen.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🎯 Kueri yang Sering Dipakai</h3>
                <div class="code-container">
                    <pre><code># Laju permintaan per layanan
sum by (service) (rate(kong_http_requests_total[5m]))

# Tingkat error 5xx
sum by (service) (rate(kong_http_requests_total{code=~"5.."}[5m]))
  / sum by (service) (rate(kong_http_requests_total[5m]))

# Latensi p99 total
histogram_quantile(0.99,
  sum by (service, le) (rate(kong_request_latency_ms_bucket[5m])))

# Berapa lama waktu dihabiskan DI KONG sendiri (deteksi plugin lambat)
histogram_quantile(0.99,
  sum by (service, le) (rate(kong_kong_latency_ms_bucket[5m])))

# Target yang tidak sehat
kong_upstream_target_health{state="unhealthy"} &gt; 0</code></pre>
                </div>
                <div class="callout callout-tip">
                    <strong>📌 Pisahkan latensi Kong dari latensi upstream</strong>
                    <p>Ini kemampuan diagnosis paling berharga dari gateway. Bila <code>kong_latency</code> naik sementara <code>upstream_latency</code> stabil, masalahnya ada pada plugin Anda — mungkin rate limiting yang menunggu Redis lambat. Bila sebaliknya, layanan di belakangnya yang bermasalah. Tanpa pemisahan ini, tim sering saling menyalahkan tanpa bukti.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>📝 Logging Terstruktur</h3>
                <div class="code-container">
                    <pre><code>plugins:
  - name: http-log
    config:
      http_endpoint: http://alloy:8080/kong
      method: POST
      timeout: 10000
      keepalive: 60000
      queue:
        max_batch_size: 100
        max_coalescing_delay: 5

  # Alternatif: tulis ke stdout agar dikumpulkan platform
  - name: file-log
    config:
      path: /dev/stdout</code></pre>
                </div>
                <div class="callout callout-danger">
                    <strong>🚫 Log Kong bisa membocorkan rahasia</strong>
                    <p>Bawaan log berisi URL lengkap beserta query string, dan sebagian konfigurasi mencatat header permintaan. Bila ada kunci API yang dikirim lewat query string, atau header <code>Authorization</code> yang ikut tercatat, kredensial produksi Anda kini tersimpan di sistem log yang aksesnya jauh lebih luas.</p>
                    <p>Saring di sisi pengumpul log, dan lebih baik lagi cegah dari hulu: setel <code>key_in_query: false</code> dan <code>hide_credentials: true</code> pada plugin autentikasi.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🔗 Distributed Tracing</h3>
                <div class="code-container">
                    <pre><code>plugins:
  - name: opentelemetry
    config:
      endpoint: http://otel-collector:4318/v1/traces
      resource_attributes:
        service.name: kong-gateway
        deployment.environment: produksi
      headers:
        X-Auth: "\${OTEL_TOKEN}"
      batch_span_count: 200
      batch_flush_delay: 3
      sampling_rate: 0.05          # 5% dari trafik normal</code></pre>
                </div>
                <div class="callout callout-info">
                    <strong>💡 Gateway adalah titik awal trace yang ideal</strong>
                    <p>Setiap permintaan masuk melewati Kong, sehingga di sinilah <code>traceparent</code> paling tepat dibuat dan keputusan sampling paling tepat diambil — sekali, di tepi. Layanan di belakangnya cukup menghormati keputusan itu lewat sampler berbasis induk, sehingga trace tidak berlubang-lubang.</p>
                    <p>Agar rantainya utuh, pastikan layanan Anda <strong>membaca dan meneruskan</strong> header <code>traceparent</code> yang dikirim Kong. Bila layanan memulai trace baru, hubungan sebab-akibatnya hilang.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🚨 Alert yang Layak Dibunyikan</h3>
                <div class="code-container">
                    <pre><code>- alert: TingkatErrorGatewayTinggi
  expr: |
    sum by (service) (rate(kong_http_requests_total{code=~"5.."}[5m]))
      / sum by (service) (rate(kong_http_requests_total[5m])) &gt; 0.05
  for: 5m

- alert: TargetUpstreamTidakSehat
  expr: kong_upstream_target_health{state="unhealthy"} &gt; 0
  for: 2m

- alert: LatensiKongMelonjak
  expr: |
    histogram_quantile(0.99,
      sum by (service, le) (rate(kong_kong_latency_ms_bucket[5m]))) &gt; 100
  for: 10m
  annotations:
    summary: "Kong sendiri lambat — periksa plugin, bukan layanan"</code></pre>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "yaml",
        "title": "Prometheus + OpenTelemetry",
        "code": "plugins:\n  - name: prometheus\n    config:\n      per_consumer: false      # cegah ledakan kardinalitas\n      latency_metrics: true\n      upstream_health_metrics: true\n\n  - name: opentelemetry\n    config:\n      endpoint: http://otel-collector:4318/v1/traces\n      sampling_rate: 0.05"
      }
    ],
    "interactiveLab": `_format_version: "3.0"

plugins:
  - name: correlation-id
    config:
      header_name: X-Request-Id
      generator: uuid
      echo_downstream: true

  - name: prometheus
    config:
      per_consumer: false
      latency_metrics: true
      status_code_metrics: true
      upstream_health_metrics: true

  - name: file-log
    config:
      path: /dev/stdout`,
    "quiz": [
      {
        "question": "Kenapa 'per_consumer: true' pada plugin prometheus berbahaya untuk API dengan banyak konsumen?",
        "options": [
          "Karena metrik menjadi tidak akurat",
          "Karena label consumer ditambahkan ke setiap metrik sehingga jumlah time series meledak dan Prometheus bisa kehabisan memori",
          "Karena Kong akan menolak permintaan dari konsumen baru",
          "Karena metrik per konsumen tidak didukung Prometheus"
        ],
        "answer": 1,
        "explanation": "Prometheus membuat satu time series untuk setiap kombinasi unik label. Menambahkan identitas konsumen mengalikan jumlah series dengan jumlah konsumen, dan pada API publik itu bisa mencapai jutaan. Aktifkan hanya bila konsumennya sedikit dan stabil; selebihnya pakai log atau trace untuk analisis per-konsumen."
      },
      {
        "question": "Latensi p99 naik. Metrik kong_kong_latency_ms tinggi sementara kong_upstream_latency_ms stabil. Apa kesimpulannya?",
        "options": [
          "Layanan di belakang gateway sedang bermasalah",
          "Masalahnya ada di Kong sendiri — kemungkinan plugin yang lambat, misalnya rate limiting yang menunggu Redis",
          "Jaringan antara klien dan gateway sedang bermasalah",
          "Kedua metrik tidak dapat dibandingkan"
        ],
        "answer": 1,
        "explanation": "Kong memisahkan waktu yang dihabiskan di dalam dirinya sendiri dari waktu menunggu upstream. Bila hanya latensi Kong yang naik, penyebabnya ada pada pemrosesan gateway — biasanya plugin pada fase access yang menunggu sumber daya eksternal seperti Redis. Pemisahan ini mengakhiri perdebatan tanpa bukti antara tim platform dan tim aplikasi."
      }
    ]
  },
  {
    "id": 12,
    "title": "12. Produksi: HA, Kapasitas & Upgrade",
    "category": "6 · Operasi",
    "videoId": null,
    "duration": "15:00",
    "description": "Menjalankan Kong secara redundan, menyetel kapasitas, melakukan upgrade tanpa henti, dan menelusuri masalah yang khas terjadi di produksi.",
    "keyTakeaways": [
      "Minimal dua simpul Kong di zona berbeda; DB-less menyederhanakan HA",
      "Penyetelan worker dan cache mengikuti aturan Nginx",
      "Upgrade dilakukan bertahap dengan pemeriksaan di tiap langkah",
      "Sebagian besar masalah produksi berakar pada konfigurasi, bukan Kong"
    ],
    "fullArticle": `
            <div class="article-section">
                <h3>🏗️ Ketersediaan Tinggi</h3>
                <div class="code-container">
                    <pre><code>DB-less (paling sederhana):
  LB  ──&gt;  Kong-1 (baca kong.yaml)
      ──&gt;  Kong-2 (baca kong.yaml)
      ──&gt;  Kong-3 (baca kong.yaml)
  Tiap simpul mandiri. Tidak ada state bersama.
  Deploy = perbarui berkas + muat ulang.

Berbasis database:
  LB  ──&gt;  Kong-1 ──┐
      ──&gt;  Kong-2 ──┼──&gt; PostgreSQL (primer + replika)
      ──&gt;  Kong-3 ──┘
  Basis data menjadi komponen yang juga harus dibuat HA.</code></pre>
                </div>
                <div class="callout callout-info">
                    <strong>💡 DB-less membuat HA jauh lebih mudah</strong>
                    <p>Tanpa basis data bersama, setiap simpul Kong berdiri sendiri sepenuhnya. Tidak ada failover basis data yang perlu diurus, tidak ada lag replikasi, dan menambah simpul cukup dengan menjalankan kontainer baru yang membaca berkas yang sama. Ini alasan kuat memilih DB-less untuk beban kerja yang konfigurasinya tidak berubah saat runtime.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>⚙️ Penyetelan Kapasitas</h3>
                <div class="code-container">
                    <pre><code>KONG_NGINX_WORKER_PROCESSES: "auto"    # = jumlah inti CPU
KONG_NGINX_WORKER_CONNECTIONS: "16384"
KONG_MEM_CACHE_SIZE: "512m"            # cache konfigurasi di memori
KONG_UPSTREAM_KEEPALIVE_POOL_SIZE: "512"
KONG_UPSTREAM_KEEPALIVE_MAX_REQUESTS: "10000"
KONG_UPSTREAM_KEEPALIVE_IDLE_TIMEOUT: "60"</code></pre>
                </div>
                <div class="callout callout-tip">
                    <strong>📌 Keepalive ke upstream sering terlupakan</strong>
                    <p>Tanpa kolam keepalive yang memadai, Kong membuka koneksi TCP baru ke layanan Anda untuk hampir setiap permintaan. Pada trafik tinggi ini menambah latensi jabat tangan, menguras port ephemeral, dan membebani layanan di belakangnya. Menaikkan <code>upstream_keepalive_pool_size</code> sering memberi perbaikan latensi yang terasa tanpa mengubah apa pun di aplikasi.</p>
                </div>
                <div class="code-container">
                    <pre><code># Sumber daya untuk kontainer Kong (titik awal)
resources:
  requests:
    cpu: 500m
    memory: 512Mi
  limits:
    memory: 2Gi
    # CPU limit sengaja tidak disetel — throttling merusak latensi p99</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>🔄 Upgrade Tanpa Henti</h3>
                <div class="code-container">
                    <pre><code># 1. Baca catatan rilis, terutama bagian perubahan yang merusak
# 2. Uji di staging dengan konfigurasi PRODUKSI yang sesungguhnya
deck gateway dump --kong-addr $PROD -o snapshot-produksi.yaml
deck gateway sync -s snapshot-produksi.yaml --kong-addr $STAGING

# 3. Untuk mode database: jalankan migrasi bertahap
kong migrations up        # aman, tidak merusak versi lama
# jalankan simpul versi baru berdampingan dengan yang lama
kong migrations finish    # SETELAH semua simpul naik versi

# 4. Rilis bergulir, satu simpul dalam satu waktu
# 5. Pantau tingkat error dan latensi di tiap langkah</code></pre>
                </div>
                <div class="callout callout-warning">
                    <strong>⚠️ Jangan pernah menjalankan <code>migrations finish</code> terlalu cepat</strong>
                    <p>Perintah <code>up</code> menerapkan perubahan skema yang masih kompatibel dengan versi Kong lama, sehingga kedua versi bisa berjalan bersamaan selama rilis bergulir. Perintah <code>finish</code> membuang struktur lama — dan begitu dijalankan, simpul versi lama yang masih hidup akan rusak. Pastikan seluruh simpul sudah naik versi lebih dulu.</p>
                </div>
            </div>

            <div class="article-section">
                <h3>🐛 Masalah yang Sering Terjadi</h3>
                <table class="tech-table">
                    <thead><tr><th>Gejala</th><th>Penyebab yang biasa</th></tr></thead>
                    <tbody>
                        <tr><td><strong>404</strong> padahal route ada</td><td><code>strip_path</code>, atau host/path tidak cocok persis</td></tr>
                        <tr><td><strong>502 Bad Gateway</strong></td><td>Upstream tidak terjangkau, atau nama DNS salah</td></tr>
                        <tr><td><strong>504 Gateway Timeout</strong></td><td><code>read_timeout</code> lebih pendek dari waktu proses layanan</td></tr>
                        <tr><td><strong>401</strong> pada permintaan yang sah</td><td>Plugin auth di cakupan tak terduga menimpa yang lain</td></tr>
                        <tr><td><strong>429</strong> terlalu cepat</td><td><code>policy: local</code> dengan hitungan tidak konsisten antar simpul</td></tr>
                        <tr><td><strong>Latensi naik bertahap</strong></td><td>Kolam keepalive habis, atau Redis rate-limit lambat</td></tr>
                        <tr><td><strong>Memori terus naik</strong></td><td><code>mem_cache_size</code> terlalu besar, atau kebocoran plugin kustom</td></tr>
                    </tbody>
                </table>
                <div class="code-container">
                    <pre><code># Mendiagnosis satu permintaan sampai tuntas
curl -i http://localhost:8000/pesanan/123 \\
  -H "X-Request-Id: uji-123"

# Periksa header respons:
#   X-Kong-Proxy-Latency    → waktu di Kong (plugin)
#   X-Kong-Upstream-Latency → waktu di layanan
#   Via                     → memastikan memang lewat Kong

# Route mana yang menangkap permintaan ini
curl -s http://localhost:8001/routes | jq '.data[] | {name, paths, hosts}'

# Log dengan tingkat detail lebih tinggi (sementara)
KONG_LOG_LEVEL=debug kong reload</code></pre>
                </div>
            </div>

            <div class="article-section">
                <h3>✅ Kesiapan Produksi</h3>
                <table class="tech-table">
                    <tbody>
                        <tr><td>Minimal 2 simpul di zona berbeda</td><td>Bertahan dari kegagalan satu zona</td></tr>
                        <tr><td>Probe kesehatan mengarah ke <code>/status</code></td><td>Load balancer tahu simpul mana yang siap</td></tr>
                        <tr><td>Konfigurasi di Git, diterapkan lewat decK/CI</td><td>Dapat diaudit dan dipulihkan</td></tr>
                        <tr><td>Admin API terisolasi</td><td>Kendali gateway tidak terbuka</td></tr>
                        <tr><td>Metrik &amp; alert terpasang</td><td>Masalah terdeteksi sebelum pengguna melapor</td></tr>
                        <tr><td>Rate limiting memakai policy terpusat</td><td>Batas akurat lintas simpul</td></tr>
                        <tr><td>Rencana rollback tertulis dan pernah dicoba</td><td>Insiden bukan waktu untuk belajar</td></tr>
                        <tr><td>Sertifikat diperbarui otomatis</td><td>Kedaluwarsa dapat dicegah sepenuhnya</td></tr>
                    </tbody>
                </table>
                <div class="callout callout-danger">
                    <strong>🚫 Gateway adalah titik kegagalan tunggal — perlakukan sesuai</strong>
                    <p>Ketika Kong mati, <em>seluruh</em> API Anda mati, bukan satu layanan saja. Konsekuensinya: redundansi bukan opsional, upgrade harus dilatih di staging lebih dulu, dan perubahan konfigurasi ke gateway layak mendapat kehati-hatian yang sama dengan perubahan basis data produksi.</p>
                </div>
            </div>
    `,
    "codeSnippets": [
      {
        "lang": "bash",
        "title": "Diagnosis permintaan",
        "code": "curl -i http://localhost:8000/pesanan/123\n\n# Baca header:\n#   X-Kong-Proxy-Latency    -> waktu di Kong & plugin\n#   X-Kong-Upstream-Latency -> waktu di layanan\n# Selisihnya memberi tahu siapa yang lambat."
      }
    ],
    "interactiveLab": `# Penyetelan kapasitas Kong di produksi

KONG_NGINX_WORKER_PROCESSES: "auto"
KONG_NGINX_WORKER_CONNECTIONS: "16384"
KONG_MEM_CACHE_SIZE: "512m"

# Keepalive ke upstream — sering memberi perbaikan
# latensi terbesar tanpa mengubah aplikasi
KONG_UPSTREAM_KEEPALIVE_POOL_SIZE: "512"
KONG_UPSTREAM_KEEPALIVE_MAX_REQUESTS: "10000"
KONG_UPSTREAM_KEEPALIVE_IDLE_TIMEOUT: "60"

# Admin API tetap terkurung
KONG_ADMIN_LISTEN: "127.0.0.1:8001"`,
    "quiz": [
      {
        "question": "Kenapa 'kong migrations finish' tidak boleh dijalankan sebelum semua simpul naik versi?",
        "options": [
          "Karena perintah tersebut membutuhkan waktu sangat lama",
          "Karena finish membuang struktur skema lama, sehingga simpul versi lama yang masih berjalan akan rusak",
          "Karena finish hanya bisa dijalankan pada mode DB-less",
          "Karena finish akan menghapus seluruh konfigurasi route"
        ],
        "answer": 1,
        "explanation": "Migrasi Kong dirancang dua tahap agar mendukung rilis bergulir. Perintah up menerapkan perubahan yang masih kompatibel dengan versi lama sehingga kedua versi dapat berjalan berdampingan. Perintah finish menghapus struktur lama, dan menjalankannya terlalu awal akan merusak simpul yang belum sempat naik versi."
      },
      {
        "question": "Latensi naik bertahap seiring meningkatnya trafik, padahal layanan di belakang tampak sehat. Apa yang layak diperiksa lebih dulu di Kong?",
        "options": [
          "Jumlah route yang terdaftar",
          "Kolam keepalive ke upstream — bila habis, Kong membuka koneksi TCP baru untuk hampir setiap permintaan",
          "Ukuran berkas kong.yaml",
          "Versi Kong yang dipakai"
        ],
        "answer": 1,
        "explanation": "Tanpa kolam keepalive yang memadai, setiap permintaan memerlukan jabat tangan TCP baru ke upstream. Biayanya kecil pada trafik rendah tetapi menumpuk seiring beban, menambah latensi dan menguras port ephemeral. Menaikkan upstream_keepalive_pool_size sering memberi perbaikan nyata tanpa mengubah aplikasi."
      }
    ]
  }
];

// App State Management
let currentModuleId = 1;
let completedModules = new Set(JSON.parse(localStorage.getItem('kong_completed') || '[]'));
let bookmarkedModules = new Set(JSON.parse(localStorage.getItem('kong_bookmarks') || '[]'));
let userNotes = JSON.parse(localStorage.getItem('kong_notes') || '{}');
let currentCategory = 'ALL';
let searchQuery = '';

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderSidebar();
    loadModule(currentModuleId);
    updateProgressWidget();

    // Event Listeners
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderSidebar();
    });
}

// Render Sidebar List
function renderSidebar() {
    const container = document.getElementById('chapterListContainer');
    container.innerHTML = '';

    const filtered = modulesData.filter(m => {
        const matchCat = (currentCategory === 'ALL' || m.category === currentCategory);
        const matchSearch = (m.title.toLowerCase().includes(searchQuery) || 
                             m.description.toLowerCase().includes(searchQuery) ||
                             m.category.toLowerCase().includes(searchQuery));
        return matchCat && matchSearch;
    });

    document.getElementById('chapterCountSidebar').textContent = `${filtered.length} Modul`;

    filtered.forEach(m => {
        const isCompleted = completedModules.has(m.id);
        const isActive = (m.id === currentModuleId);

        const item = document.createElement('div');
        item.className = `chapter-item ${isActive ? 'active' : ''}`;
        item.onclick = (e) => {
            if (e.target.tagName !== 'INPUT') {
                loadModule(m.id);
            }
        };

        item.innerHTML = `
            <input type="checkbox" class="chapter-checkbox" ${isCompleted ? 'checked' : ''} 
                   onclick="toggleCompleted(${m.id}, event)">
            <div class="chapter-info">
                <div class="chapter-title">${m.title}</div>
                <div class="chapter-meta-sm">
                    <span class="badge badge-cyan" style="font-size:0.65rem;">${m.category}</span>
                    <span>⏱️ ${m.duration}</span>
                    ${bookmarkedModules.has(m.id) ? '⭐' : ''}
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

// Load Selected Module
function loadModule(id) {
    currentModuleId = id;
    const module = modulesData.find(m => m.id === id);
    if (!module) return;

    // Header updates
    document.getElementById('chapterCategoryBadge').textContent = module.category;
    document.getElementById('timestampText').textContent = module.videoId;
    document.getElementById('chapterTitle').textContent = module.title;
    document.getElementById('chapterDesc').textContent = module.description;
    document.getElementById('currentFooterProgress').textContent = `Modul ${module.id} dari ${modulesData.length}`;

    // Update Bookmark & Complete button labels
    updateActionButtons();

    // Tab 1: Theory
    document.getElementById('articleBody').innerHTML = module.fullArticle;

    // Tab 2: Video Player
    kodelokaVideo(module.videoId);

    // Tab 3: Playground Initial Code
    document.getElementById('playgroundEditor').value = module.interactiveLab;

    // Tab 4: Quiz
    renderQuiz(module.quiz);

    // Tab 5: Notes
    document.getElementById('notesTextarea').value = userNotes[id] || '';
    document.getElementById('saveNotesStatus').style.display = 'none';

    renderSidebar();
}

// Tab Switching Logic
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${tabName}`);
    });
}

// Category Filtering
function filterCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.category-pill').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.includes(cat) || (cat === 'ALL' && btn.textContent === 'Semua'));
    });
    renderSidebar();
}

// Progress Management
function toggleCompleted(id, event) {
    if (event) event.stopPropagation();
    if (completedModules.has(id)) {
        completedModules.delete(id);
    } else {
        completedModules.add(id);
    }
    localStorage.setItem('kong_completed', JSON.stringify(Array.from(completedModules)));
    updateProgressWidget();
    renderSidebar();
    updateActionButtons();
}

function toggleCurrentCompleted() {
    toggleCompleted(currentModuleId);
}

function toggleBookmark() {
    if (bookmarkedModules.has(currentModuleId)) {
        bookmarkedModules.delete(currentModuleId);
    } else {
        bookmarkedModules.add(currentModuleId);
    }
    localStorage.setItem('kong_bookmarks', JSON.stringify(Array.from(bookmarkedModules)));
    renderSidebar();
    updateActionButtons();
}

function updateActionButtons() {
    const isDone = completedModules.has(currentModuleId);
    const isBookmarked = bookmarkedModules.has(currentModuleId);

    document.getElementById('toggleCompletedBtn').textContent = isDone ? '✅ Selesai' : '☑️ Tandai Selesai';
    document.getElementById('bookmarkBtn').textContent = isBookmarked ? '⭐ Bookmarked' : '☆ Bookmark';
}

function updateProgressWidget() {
    const total = modulesData.length;
    const completed = completedModules.size;
    const percent = Math.round((completed / total) * 100);

    document.getElementById('progressBar').style.width = `${percent}%`;
    document.getElementById('progressText').textContent = `${completed} / ${total} Selesai (${percent}%)`;
}

function resetAllProgress() {
    if (confirm('Apakah Anda yakin ingin mereset seluruh progres belajar Kong Anda?')) {
        completedModules.clear();
        bookmarkedModules.clear();
        localStorage.removeItem('kong_completed');
        localStorage.removeItem('kong_bookmarks');
        updateProgressWidget();
        renderSidebar();
        updateActionButtons();
    }
}

// Navigation Controls
function navigatePrev() {
    if (currentModuleId > 1) loadModule(currentModuleId - 1);
}

function navigateNext() {
    if (currentModuleId < modulesData.length) loadModule(currentModuleId + 1);
}

// Playground Simulation Engine
function runPlaygroundSimulation() {
    const code = document.getElementById('playgroundEditor').value;
    const output = document.getElementById('terminalOutput');
    
    output.textContent = "⚙️ Validating Kong decK Declarative Configuration...\n";
    setTimeout(() => {
        if (code.includes('services:') || code.includes('type: Mesh')) {
            output.textContent += "✅ Syntax Validation: PASSED (decK spec v3.0 valid)\n";
            output.textContent += "🚀 Syncing to Kong Gateway Data Plane...\n";
            output.textContent += "HTTP/1.1 200 OK\nContent-Type: application/json\n\n";
            output.textContent += JSON.stringify({ status: "success", synced_entities: 2, latency_ms: 4.2 }, null, 2);
        } else {
            output.textContent += "⚠️ Warning: Yaml format minimal membutuhkan 'services:' atau 'type:' block.\n";
        }
    }, 400);
}

function generateAdminCurl() {
    const output = document.getElementById('terminalOutput');
    output.textContent = `# cURL Command untuk Kong Admin API (Port 8001)\n\n`;
    output.textContent += `curl -i -X POST http://localhost:8001/services/ \\
  --data name=my-service \\
  --data url='http://httpbin.org/get'\n\n`;
    output.textContent += `curl -i -X POST http://localhost:8001/services/my-service/routes \\
  --data name=my-route \\
  --data 'paths[]=/api/v1'`;
}

function loadDefaultConfig() {
    const module = modulesData.find(m => m.id === currentModuleId);
    if (module) {
        document.getElementById('playgroundEditor').value = module.interactiveLab;
    }
}

function clearTerminalOutput() {
    document.getElementById('terminalOutput').textContent = 'Ready...';
}

// Quiz Engine
function renderQuiz(quizList) {
    const container = document.getElementById('quizContainer');
    if (!quizList || quizList.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted);">Kuis belum tersedia untuk modul ini.</p>';
        return;
    }

    let html = `<h3>🧪 Kuis Evaluasi Modul ${currentModuleId}</h3><br>`;
    quizList.forEach((q, qIdx) => {
        html += `
            <div class="quiz-question-box">
                <div class="quiz-question-title">${qIdx + 1}. ${q.question}</div>
                <div class="quiz-options">
        `;
        q.options.forEach((opt, oIdx) => {
            html += `
                <div class="quiz-option-item" onclick="checkQuizAnswer(${qIdx}, ${oIdx}, ${q.answer}, this, '${q.explanation.replace(/'/g, "\'")}')">
                    <span>${['A', 'B', 'C', 'D'][oIdx]}.</span>
                    <span>${opt}</span>
                </div>
            `;
        });
        html += `
                </div>
                <div class="quiz-explanation" id="quiz-exp-${qIdx}"></div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function checkQuizAnswer(qIdx, selectedIdx, correctIdx, element, explanation) {
    const parent = element.parentElement;
    parent.querySelectorAll('.quiz-option-item').forEach((item, idx) => {
        item.onclick = null; // Disable further clicks
        if (idx === correctIdx) item.classList.add('correct');
        if (idx === selectedIdx && selectedIdx !== correctIdx) item.classList.add('wrong');
    });

    const expBox = document.getElementById(`quiz-exp-${qIdx}`);
    expBox.style.display = 'block';
    expBox.innerHTML = `<strong>${selectedIdx === correctIdx ? '✅ Benar!' : '❌ Kurang Tepat'}</strong> ${explanation}`;
}

// User Notes Storage
function saveUserNote() {
    const note = document.getElementById('notesTextarea').value;
    userNotes[currentModuleId] = note;
    localStorage.setItem('kong_notes', JSON.stringify(userNotes));
    const status = document.getElementById('saveNotesStatus');
    status.style.display = 'inline';
    setTimeout(() => { status.style.display = 'none'; }, 2000);
}

// Final Exam Modal & Certificate Generator
function openFinalExam() {
    const modal = document.getElementById('examModal');
    const body = document.getElementById('examModalBody');
    modal.classList.add('active');

    body.innerHTML = `
        <h2>🏆 Ujian Sertifikasi Kong API Gateway & Konnect</h2>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">Ujian ini menguji pemahaman Anda mengenai 46 modul video (Control Plane, Data Plane, decK, K8s Ingress, Plugins, & Service Mesh).</p>
        
        <div style="margin-bottom: 20px;">
            <label style="font-weight: 600;">Nama Lengkap Anda (Untuk Sertifikat):</label>
            <input type="text" id="certStudentName" placeholder="Masukkan nama Anda..." 
                   style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-input); color: #fff; margin-top: 6px;">
        </div>

        <div class="quiz-question-box">
            <div class="quiz-question-title">1. Komponen apakah pada Kong yang menangani eksekusi proxying request dari client ke upstream service?</div>
            <p style="color: var(--kong-cyan);">A. Data Plane (Kong Gateway)</p>
        </div>
        <div class="quiz-question-box">
            <div class="quiz-question-title">2. Tool CLI apakah yang digunakan untuk mengelola konfigurasi deklaratif (GitOps) di Kong?</div>
            <p style="color: var(--kong-cyan);">A. decK (Declarative Kong)</p>
        </div>

        <button class="btn btn-primary" onclick="generateCertificate()" style="width: 100%; justify-content: center; padding: 12px;">
            🎉 Selesaikan Ujian & Dapatkan Sertifikat
        </button>
    `;
}

function closeFinalExam() {
    document.getElementById('examModal').classList.remove('active');
}

function generateCertificate() {
    const name = document.getElementById('certStudentName').value.trim() || 'Praktisi Kong API';
    const body = document.getElementById('examModalBody');

    body.innerHTML = `
        <div class="certificate-box">
            <h2>🎓 SERTIFIKAT KELULUSAN</h2>
            <p>Diberikan kepada:</p>
            <div class="certificate-name">${name}</div>
            <p>Atas keberhasilan menyelesaikan seluruh modul pembelajaran interaktif:</p>
            <h3 style="color: var(--accent-primary); margin: 12px 0;">Kong API Gateway & Konnect Masterclass (46 Modul)</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Terverifikasi pada: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button class="btn btn-secondary" onclick="closeFinalExam()" style="margin-top: 20px; width: 100%; justify-content: center;">Tutup Modal</button>
    `;
}

function copyCode(btn) {
    const pre = btn.parentElement.nextElementSibling;
    navigator.clipboard.writeText(pre.textContent);
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
}
