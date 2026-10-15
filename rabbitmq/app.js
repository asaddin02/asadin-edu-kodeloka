/* ==========================================================================
   RABBITMQ — BAGIAN A (Fondasi AMQP, Instalasi, Routing, Producer/Consumer)
   ========================================================================== */

const RMQ_MOD_A = [

/* ---------------------------------------------------------------- 1 ----- */
{
    id: 1,
    cat: '1 · Fondasi',
    title: 'Model AMQP: Exchange, Queue, Binding, dan Routing Key',
    level: 'Dasar', dur: '15 mnt',
    tags: ['amqp', 'exchange', 'queue', 'binding', 'routing key', 'konsep'],
    desc: 'Memahami empat komponen yang menyusun seluruh RabbitMQ, dan kenapa producer sebenarnya tidak pernah mengirim ke queue.',
    theory: `
<h2>Masalah yang Diselesaikan Message Broker</h2>
<p>Ketika layanan A memanggil layanan B lewat HTTP, A ikut mati bila B mati. A juga harus menunggu B selesai — walaupun pekerjaan B tidak perlu ditunggu, misalnya mengirim email atau membuat invoice.</p>
<p><strong>Message broker</strong> memutus keterikatan itu: A menaruh pesan dan langsung lanjut; B mengambilnya kapan pun ia siap. Bila B mati satu jam, pesan menunggu dengan sabar.</p>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Tiga hal yang Anda dapatkan</div>
    <ul>
        <li><strong>Decoupling</strong> — pengirim tidak perlu tahu siapa yang memproses, atau berapa banyak.</li>
        <li><strong>Buffering</strong> — lonjakan trafik ditampung antrean, bukan menghantam basis data.</li>
        <li><strong>Ketahanan</strong> — konsumer boleh mati, restart, atau di-deploy tanpa kehilangan pekerjaan.</li>
    </ul>
</div>

<h3>Kesalahpahaman Nomor Satu</h3>
<p><strong>Producer tidak pernah mengirim pesan ke queue.</strong> Producer mengirim ke <em>exchange</em>. Exchange-lah yang memutuskan queue mana yang menerima salinannya — atau tidak sama sekali.</p>

<pre data-lang="text" data-file="alur satu pesan">  Producer                Broker                        Consumer
     │                       │                              │
     │  publish              │                              │
     │  exchange="pesanan"   │                              │
     │  routing_key=         │                              │
     │   "pesanan.dibuat"    │                              │
     ├──────────────────────>│                              │
     │                  ┌────▼─────┐                        │
     │                  │ EXCHANGE │  cocokkan routing key   │
     │                  │ pesanan  │  dengan binding         │
     │                  └────┬─────┘                        │
     │            ┌──────────┼──────────┐                   │
     │            │          │          │                   │
     │      binding:    binding:   binding:                 │
     │   "pesanan.*"  "pesanan.  "pembayaran.*"             │
     │            │    dibuat"      │ (tidak cocok)          │
     │        ┌───▼───┐  ┌───▼───┐  ✗                        │
     │        │ QUEUE │  │ QUEUE │                           │
     │        │ audit │  │ kirim │──────── deliver ─────────>│
     │        └───────┘  └───────┘                           │
     │                                                       │
     │  Satu pesan → DUA queue → masing-masing satu salinan  │</pre>

<h3>Empat Komponen Inti</h3>
<table>
<thead><tr><th>Komponen</th><th>Tugas</th><th>Analogi pos</th></tr></thead>
<tbody>
<tr><td><strong>Exchange</strong></td><td>Menerima pesan, memutuskan tujuannya</td><td>Kantor sortir</td></tr>
<tr><td><strong>Queue</strong></td><td>Menyimpan pesan sampai diambil</td><td>Kotak pos penerima</td></tr>
<tr><td><strong>Binding</strong></td><td>Aturan penghubung exchange → queue</td><td>Daftar alamat di kantor sortir</td></tr>
<tr><td><strong>Routing key</strong></td><td>Label pada pesan, dicocokkan dengan binding</td><td>Alamat di amplop</td></tr>
</tbody>
</table>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Pesan tanpa binding yang cocok akan HILANG diam-diam</div>
    <p>Bila tidak ada satu pun binding yang cocok, exchange membuang pesan tanpa error apa pun. Publish tetap dilaporkan berhasil.</p>
    <p>Ini penyebab nomor satu dari "pesan saya hilang". Dua pertahanannya:</p>
<pre data-lang="text">1. mandatory=true + basic.return  → broker mengembalikan pesan tak terkirim
2. alternate-exchange             → pesan tak terkirim dibuang ke exchange
                                    cadangan, bukan ke ketiadaan</pre>
</div>

<h3>Connection dan Channel</h3>
<p>Satu <strong>connection</strong> adalah satu koneksi TCP — mahal untuk dibuat. Di dalamnya ada banyak <strong>channel</strong>, yaitu sesi ringan yang menjadi tempat sebenarnya semua operasi AMQP dijalankan.</p>
<pre data-lang="text" data-file="hubungan connection dan channel">Aplikasi
   └── Connection (1 TCP)              ← buat SEKALI, pakai selamanya
         ├── Channel 1  → publish
         ├── Channel 2  → consume queue A
         └── Channel 3  → consume queue B

❌ satu connection per pesan   → broker kehabisan file descriptor
✅ satu connection per proses, satu channel per thread/goroutine</pre>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Channel tidak aman dipakai bersama antar thread</div>
    <p>Channel bukan objek thread-safe. Dua thread yang menulis ke channel yang sama akan merusak protokol dan memutus channel dengan error <code>UNEXPECTED_FRAME</code>. Aturannya: <strong>satu channel untuk satu thread</strong>.</p>
</div>

<h3>Virtual Host</h3>
<p><strong>vhost</strong> adalah namespace penuh: exchange, queue, binding, dan izin di dalamnya terisolasi total. Dua tim bisa memakai broker yang sama dengan nama queue identik tanpa bertabrakan. Vhost default bernama <code>/</code>.</p>

<h3>Kapan RabbitMQ, Kapan Kafka</h3>
<table>
<thead><tr><th></th><th>RabbitMQ</th><th>Kafka</th></tr></thead>
<tbody>
<tr><td>Model</td><td>Antrean: pesan dikonsumsi lalu hilang</td><td>Log: pesan bertahan, konsumer punya offset</td></tr>
<tr><td>Routing</td><td>Sangat kaya (topic, headers, DLX)</td><td>Sederhana (topic + partisi)</td></tr>
<tr><td>Per-pesan</td><td>Ack, retry, prioritas, TTL per pesan</td><td>Per-batch, per-partisi</td></tr>
<tr><td>Throughput puncak</td><td>Puluhan ribu pesan/detik</td><td>Jutaan pesan/detik</td></tr>
<tr><td>Cocok untuk</td><td>Task queue, RPC, routing kompleks</td><td>Event streaming, replay, analitik</td></tr>
</tbody>
</table>
<p>Pertanyaan pemilih yang praktis: <em>apakah pesan yang sudah diproses masih perlu dibaca ulang oleh konsumer lain nanti?</em> Bila ya, itu wilayah Kafka atau RabbitMQ Stream. Bila tidak, antrean klasik RabbitMQ lebih sederhana dan lebih tepat.</p>`,
    lab: {
        intro: `
<h3>Praktik: Melihat Empat Komponen dengan Mata Sendiri</h3>
<p>Nyalakan broker, lalu amati exchange bawaan dan buat binding pertama Anda.</p>`,
        files: [{
            name: 'docker-compose.yml', lang: 'yaml', code: `services:
  rabbitmq:
    image: rabbitmq:4.1-management
    container_name: rabbitmq
    hostname: rabbit-1              # PENTING: nama node ikut hostname
    ports:
      - "5672:5672"                 # AMQP
      - "15672:15672"               # UI manajemen
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: rahasia
      RABBITMQ_DEFAULT_VHOST: /
    volumes:
      - rabbit-data:/var/lib/rabbitmq
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "-q", "ping"]
      interval: 15s
      timeout: 10s
      retries: 5

volumes:
  rabbit-data:` }],
        steps: [
            { note: 'Nyalakan broker', cmd: 'docker compose up -d', out: '[+] Running 2/2\n ✔ Volume "rabbit-data"  Created\n ✔ Container rabbitmq    Started' },
            { note: 'Pastikan broker benar-benar siap melayani', cmd: 'rabbitmq-diagnostics ping' },
            { note: 'Lihat exchange bawaan yang otomatis ada', cmd: 'rabbitmqctl list_exchanges' },
            { note: 'Buat queue dan binding pertama', cmd: 'rabbitmqadmin declare queue name=pesanan.kirim durable=true' },
            { note: 'Hubungkan queue ke exchange dengan sebuah pola', cmd: 'rabbitmqadmin declare binding source=pesanan destination=pesanan.kirim routing_key=pesanan.dibuat' }
        ],
        snippets: ['rabbitmqctl list_exchanges', 'rabbitmqctl list_queues', 'rabbitmqctl list_bindings', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN membuat connection baru untuk setiap pesan',
            body: `<p>Handshake AMQP memerlukan beberapa perjalanan bolak-balik jaringan plus negosiasi TLS. Membuat connection per pesan menghabiskan file descriptor broker dan membuat throughput anjlok drastis.</p>
<pre data-lang="text">❌ untuk tiap pesan: connect → channel → publish → close
✅ saat aplikasi start: connect sekali, simpan; publish lewat channel yang sudah ada</pre>
<p>Gejala di broker: jumlah connection naik terus, lalu muncul <code>too many open files</code> dan koneksi baru ditolak.</p>`
        },
        {
            kind: 'salah', title: 'Mengira producer mengirim ke queue',
            body: `<p>Banyak tutorial menyederhanakan dengan memakai <em>default exchange</em> (bernama string kosong <code>""</code>), di mana routing key diperlakukan sebagai nama queue. Itu membuat orang mengira producer memang menulis ke queue.</p>
<p>Akibatnya, saat kebutuhan berkembang — satu pesan perlu diterima dua konsumer berbeda — arsitekturnya harus dirombak. Rancang dengan exchange eksplisit sejak awal; menambah konsumer kedua kemudian hanya berarti menambah satu binding.</p>`
        },
        {
            kind: 'best', title: 'Pakai penamaan yang konsisten dan bisa dibaca',
            body: `<p>Nama yang baik membuat topologi bisa dipahami tanpa membuka dokumentasi.</p>
<pre data-lang="text">Exchange    : &lt;domain&gt;                     pesanan, pembayaran, notifikasi
Routing key : &lt;domain&gt;.&lt;peristiwa&gt;         pesanan.dibuat, pesanan.dibatalkan
Queue       : &lt;domain&gt;.&lt;konsumer&gt;          pesanan.kirim-email, pesanan.audit
DLQ         : &lt;queue-asal&gt;.dlq             pesanan.kirim-email.dlq</pre>
<ul>
<li>Routing key memakai bentuk lampau — ia melaporkan sesuatu yang <em>sudah terjadi</em>.</li>
<li>Nama queue menyebut siapa konsumernya, sehingga jelas siapa pemiliknya saat menumpuk.</li>
</ul>`
        },
        {
            kind: 'kasus', title: 'Pesan hilang selama dua minggu tanpa satu pun error',
            body: `<p>Sebuah tim menambahkan fitur baru dengan routing key <code>pesanan.diperbarui</code>. Publish berhasil, log bersih, tidak ada error. Namun binding yang ada hanya untuk <code>pesanan.dibuat</code> dan <code>pesanan.dibatalkan</code>.</p>
<p>Selama dua minggu, setiap pesan pembaruan dibuang diam-diam oleh exchange. Baru ketahuan saat pelanggan mengeluh notifikasi perubahan pesanan tidak pernah datang.</p>
<p>Pencegahan: setel <code>alternate-exchange</code> pada setiap exchange produksi agar pesan tak terkirim jatuh ke queue khusus, lalu pasang alert bila queue itu tidak kosong. Biaya konfigurasinya beberapa menit.</p>`
        }
    ],
    quiz: [
        {
            q: 'Producer melakukan publish ke mana?',
            opts: ['Langsung ke queue', 'Ke exchange', 'Ke consumer', 'Ke binding'],
            a: 1,
            exp: 'Producer selalu publish ke exchange beserta routing key. Exchange yang memutuskan queue mana menerima salinannya berdasarkan binding yang terdaftar.'
        },
        {
            q: 'Pesan di-publish tetapi tidak ada binding yang cocok. Apa yang terjadi?',
            opts: [
                'Broker mengembalikan error ke producer',
                'Pesan dibuang diam-diam dan publish tetap dianggap berhasil',
                'Pesan masuk ke queue default',
                'Pesan disimpan sampai ada binding yang cocok'
            ],
            a: 1,
            exp: 'Exchange membuangnya tanpa memberi tahu siapa pun. Gunakan <code>mandatory=true</code> dengan handler <code>basic.return</code>, atau setel <code>alternate-exchange</code> agar kehilangan seperti ini terdeteksi.'
        },
        {
            q: 'Berapa banyak channel yang sebaiknya dipakai bersama oleh beberapa thread?',
            opts: [
                'Satu channel bisa dipakai semua thread',
                'Satu channel per thread — channel tidak thread-safe',
                'Satu channel per pesan',
                'Channel tidak berkaitan dengan thread'
            ],
            a: 1,
            exp: 'Channel bukan objek thread-safe. Pemakaian bersamaan merusak urutan frame protokol dan memutus channel dengan <code>UNEXPECTED_FRAME</code>. Satu connection dipakai bersama, tetapi channel harus per thread.'
        }
    ]
},

/* ---------------------------------------------------------------- 2 ----- */
{
    id: 2,
    cat: '1 · Fondasi',
    title: 'Instalasi & Konfigurasi: rabbitmq.conf, Plugin, dan Batas Sistem',
    level: 'Dasar', dur: '18 mnt',
    tags: ['instalasi', 'docker', 'rabbitmq.conf', 'plugin', 'ulimit', 'erlang'],
    desc: 'Memasang RabbitMQ dengan setelan yang layak produksi, dan memahami batas sistem yang menjatuhkan broker di saat sibuk.',
    theory: `
<h2>Dua Berkas Konfigurasi</h2>
<table>
<thead><tr><th>Berkas</th><th>Isi</th><th>Format</th></tr></thead>
<tbody>
<tr><td><code>rabbitmq.conf</code></td><td>Hampir semua setelan</td><td><code>kunci = nilai</code> (sysctl)</td></tr>
<tr><td><code>advanced.config</code></td><td>Setelan yang tidak tersedia di atas</td><td>Erlang term</td></tr>
<tr><td><code>rabbitmq-env.conf</code></td><td>Variabel lingkungan node</td><td>Shell</td></tr>
</tbody>
</table>
<p>Sejak RabbitMQ 3.7, format <code>rabbitmq.conf</code> yang sederhana menggantikan sintaks Erlang lama. Bila menemukan contoh berisi tanda kurung siku dan koma di internet, itu format <code>advanced.config</code> yang lama — jangan dicampur.</p>

<pre data-lang="ini" data-file="rabbitmq.conf">## ── Jaringan ──
listeners.tcp.default = 5672
management.tcp.port   = 15672

## ── Batas sumber daya ──
# Broker berhenti menerima publish saat memori melewati ambang ini
vm_memory_high_watermark.relative = 0.6
# Alternatif absolut, lebih dianjurkan di container:
# vm_memory_high_watermark.absolute = 2GB

# Broker berhenti menerima publish saat sisa disk di bawah ini
disk_free_limit.absolute = 5GB

## ── Koneksi ──
heartbeat = 60
# Timeout handshake untuk klien yang lambat
handshake_timeout = 10000
channel_max = 2047

## ── Antrean ──
# Tipe queue default bila klien tidak menyebutkannya
default_queue_type = quorum

## ── Log ──
log.console = true
log.console.level = info
log.file = false

## ── Keamanan ──
loopback_users = none
# guest hanya boleh dari localhost; di produksi hapus sama sekali</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Dua alarm yang menghentikan seluruh publish</div>
    <p>RabbitMQ melindungi dirinya dengan dua alarm. Saat salah satunya menyala, <strong>semua producer diblokir</strong> — bukan diperlambat, tetapi benar-benar berhenti.</p>
<pre data-lang="text">memory alarm : pemakaian memori &gt; vm_memory_high_watermark
disk alarm   : sisa disk &lt; disk_free_limit</pre>
    <p>Konsumer tetap berjalan, sehingga antrean menyusut dan alarm akhirnya mati sendiri. Tetapi bagi aplikasi Anda, gejalanya adalah <em>publish menggantung tanpa error</em> — sangat membingungkan bila Anda tidak tahu mekanisme ini ada.</p>
    <p>Pantau <code>rabbitmq_alarms_memory_used_watermark</code> dan pasang alert jauh sebelum ambangnya tercapai.</p>
</div>

<h3>Batas Sistem yang Sering Terlupakan</h3>
<pre data-lang="text" data-file="hitungan file descriptor">Setiap connection    = 1 file descriptor
Setiap queue         ≈ 1 file descriptor (classic queue dengan indeks)
Ditambah soket internal cluster, koneksi manajemen, dsb.

Default ulimit -n biasanya 1024 → broker mentok di ±800 connection.

Produksi: minimal 65536.</pre>
<pre data-lang="ini" data-file="/etc/systemd/system/rabbitmq-server.service.d/limits.conf">[Service]
LimitNOFILE=65536</pre>
<pre data-lang="yaml" data-file="docker-compose.yml — bagian ulimits">    ulimits:
      nofile:
        soft: 65536
        hard: 65536</pre>

<h3>Plugin yang Layak Dinyalakan</h3>
<table>
<thead><tr><th>Plugin</th><th>Fungsi</th><th>Catatan</th></tr></thead>
<tbody>
<tr><td><code>rabbitmq_management</code></td><td>UI dan HTTP API</td><td>Wajib untuk operasi harian</td></tr>
<tr><td><code>rabbitmq_prometheus</code></td><td>Metrik di <code>:15692/metrics</code></td><td>Wajib untuk monitoring</td></tr>
<tr><td><code>rabbitmq_shovel</code></td><td>Memindahkan pesan antar broker</td><td>Migrasi, DR</td></tr>
<tr><td><code>rabbitmq_federation</code></td><td>Replikasi exchange lintas broker</td><td>Multi-region</td></tr>
<tr><td><code>rabbitmq_delayed_message_exchange</code></td><td>Penundaan pesan sungguhan</td><td>Plugin komunitas, unduh manual</td></tr>
<tr><td><code>rabbitmq_stream</code></td><td>Tipe queue Stream</td><td>Untuk kebutuhan seperti Kafka</td></tr>
</tbody>
</table>
<pre data-lang="bash" data-file="mengaktifkan plugin">rabbitmq-plugins enable rabbitmq_management rabbitmq_prometheus

# di Docker, lebih baik permanen lewat berkas:
# enabled_plugins berisi:
# [rabbitmq_management,rabbitmq_prometheus].</pre>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Nama node terikat pada hostname</div>
    <p>Nama node RabbitMQ berbentuk <code>rabbit@&lt;hostname&gt;</code>, dan direktori datanya mengikuti nama itu. Bila container di-restart dengan hostname acak, broker akan mencari data di direktori baru — <strong>seluruh queue tampak hilang</strong> padahal berkasnya masih ada.</p>
<pre data-lang="yaml">services:
  rabbitmq:
    hostname: rabbit-1       # WAJIB, jangan biarkan acak
    volumes:
      - rabbit-data:/var/lib/rabbitmq</pre>
</div>

<h3>Compose Produksi Minimal</h3>
<pre data-lang="yaml" data-file="docker-compose.yml">services:
  rabbitmq:
    image: rabbitmq:4.1-management
    hostname: rabbit-1
    restart: unless-stopped
    ports:
      - "5672:5672"
      - "15672:15672"
      - "15692:15692"                 # metrik Prometheus
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS_FILE: /run/secrets/rmq_pass
      RABBITMQ_ERLANG_COOKIE_FILE: /run/secrets/erlang_cookie
    volumes:
      - rabbit-data:/var/lib/rabbitmq
      - ./rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf:ro
      - ./definitions.json:/etc/rabbitmq/definitions.json:ro
    ulimits:
      nofile: { soft: 65536, hard: 65536 }
    deploy:
      resources:
        limits: { memory: 4G }
    secrets: [rmq_pass, erlang_cookie]
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "-q", "status"]
      interval: 30s
      timeout: 15s
      retries: 5
      start_period: 60s

secrets:
  rmq_pass:      { file: ./secrets/rmq_pass.txt }
  erlang_cookie: { file: ./secrets/erlang_cookie.txt }

volumes:
  rabbit-data:</pre>

<div class="callout callout-info">
    <div class="callout-title">💡 Beri broker memori yang cukup, lalu setel watermark absolut</div>
    <p>Di dalam container, <code>vm_memory_high_watermark.relative</code> menghitung dari memori <em>host</em> pada beberapa konfigurasi, bukan dari batas container. Akibatnya broker mengira punya 64 GB padahal dibatasi 4 GB, lalu di-OOM-kill oleh kernel sebelum alarm memorinya sempat menyala.</p>
    <p>Di container, selalu pakai bentuk absolut: <code>vm_memory_high_watermark.absolute = 2GB</code> dengan limit container 4GB.</p>
</div>`,
    lab: {
        intro: `
<h3>Praktik: Memeriksa Kesehatan dan Batas Broker</h3>
<p><code>rabbitmq-diagnostics</code> adalah alat pertama yang harus Anda kuasai — ia menjawab hampir semua pertanyaan operasional.</p>`,
        files: [{
            name: 'rabbitmq.conf', lang: 'ini', code: `listeners.tcp.default = 5672
management.tcp.port   = 15672

vm_memory_high_watermark.absolute = 2GB
disk_free_limit.absolute          = 5GB

heartbeat   = 60
channel_max = 2047

default_queue_type = quorum

log.console       = true
log.console.level = info

loopback_users = none

# muat definisi (exchange, queue, user) saat start
load_definitions = /etc/rabbitmq/definitions.json` }],
        steps: [
            { note: 'Cek broker hidup dan merespons', cmd: 'rabbitmq-diagnostics ping' },
            { note: 'Ringkasan lengkap: versi, memori, disk, file descriptor', cmd: 'rabbitmq-diagnostics status' },
            { note: 'Periksa apakah ada alarm yang sedang menyala', cmd: 'rabbitmq-diagnostics alarms' },
            { note: 'Lihat pemakaian file descriptor terhadap batasnya', cmd: 'rabbitmq-diagnostics observer' },
            { note: 'Daftar plugin yang aktif', cmd: 'rabbitmq-plugins list' }
        ],
        snippets: ['rabbitmq-diagnostics status', 'rabbitmq-diagnostics alarms', 'rabbitmq-plugins list', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN membiarkan hostname container acak',
            body: `<p>Nama node adalah <code>rabbit@&lt;hostname&gt;</code>, dan direktori data mengikuti nama node. Container yang di-restart dengan hostname baru akan membuat direktori data baru yang kosong.</p>
<p>Gejalanya menakutkan: seluruh queue, exchange, dan pesan tampak lenyap, padahal berkas lama masih ada di volume dengan nama direktori lama. Tetapkan <code>hostname:</code> secara eksplisit — ini satu baris yang mencegah kepanikan besar.</p>`
        },
        {
            kind: 'salah', title: 'Menaikkan <code>vm_memory_high_watermark</code> saat broker sering kena alarm',
            body: `<p>Menaikkan ambang batas hanya menunda masalah dan mendekatkan broker ke OOM kill oleh kernel — yang jauh lebih buruk daripada alarm, karena alarm bisa pulih sendiri sementara OOM kill mematikan node.</p>
<p>Alarm memori berarti antrean menumpuk. Penyebab sebenarnya hampir selalu salah satu dari:</p>
<ul>
<li>Konsumer terlalu lambat atau jumlahnya kurang.</li>
<li>Konsumer mati dan tidak ada yang memantau.</li>
<li><code>prefetch</code> tidak dibatasi, sehingga pesan menumpuk di memori klien maupun broker.</li>
<li>Antrean tanpa batas panjang dan tanpa TTL.</li>
</ul>`
        },
        {
            kind: 'best', title: 'Naikkan <code>ulimit -n</code> sebelum produksi, bukan sesudah insiden',
            body: `<p>Default 1024 file descriptor terasa cukup saat pengujian dengan 50 koneksi, lalu menjadi tembok saat trafik sungguhan datang. Broker menolak koneksi baru dengan pesan yang tidak langsung menunjuk penyebabnya.</p>
<pre data-lang="bash"># periksa batas efektif yang dilihat broker
rabbitmq-diagnostics status | grep -A3 file_descriptors</pre>
<p>Sisakan margin besar: 65536 adalah angka yang wajar dan tidak mahal.</p>`
        },
        {
            kind: 'kasus', title: 'Publish menggantung tanpa error selama 20 menit',
            body: `<p>Sebuah layanan tiba-tiba berhenti memproses pesanan. Tidak ada exception, tidak ada timeout, tidak ada log error — thread publisher hanya menggantung. Tim mencurigai jaringan dan me-restart aplikasi berkali-kali tanpa hasil.</p>
<p>Penyebabnya: disk node RabbitMQ tersisa 3 GB sementara <code>disk_free_limit</code> disetel 5 GB. Alarm disk menyala dan broker memblokir seluruh publish — perilaku yang memang dirancang untuk melindungi diri.</p>
<p>Satu perintah akan menjawabnya dalam dua detik: <code>rabbitmq-diagnostics alarms</code>. Jadikan perintah ini langkah pertama pada setiap runbook RabbitMQ Anda.</p>`
        }
    ],
    quiz: [
        {
            q: 'Publish menggantung tanpa error dan tanpa timeout. Perintah pertama yang harus dijalankan?',
            opts: [
                '<code>rabbitmqctl list_queues</code>',
                '<code>rabbitmq-diagnostics alarms</code>',
                '<code>rabbitmqctl list_connections</code>',
                'Restart broker'
            ],
            a: 1,
            exp: 'Alarm memori atau disk memblokir seluruh publish tanpa mengirim error. Memeriksa alarm langsung membedakan antara masalah jaringan dan mekanisme perlindungan broker yang sedang aktif.'
        },
        {
            q: 'Container RabbitMQ di-restart dan semua queue tampak hilang meski volume terpasang. Penyebab paling mungkin?',
            opts: [
                'Volume tidak ter-mount',
                'Hostname berubah sehingga nama node dan direktori datanya ikut berubah',
                'Plugin management mati',
                'Versi image berubah'
            ],
            a: 1,
            exp: 'Direktori data mengikuti nama node <code>rabbit@&lt;hostname&gt;</code>. Hostname acak membuat broker membuat direktori baru yang kosong. Tetapkan <code>hostname:</code> secara eksplisit.'
        },
        {
            q: 'Di dalam container dengan limit memori 4 GB, bentuk watermark mana yang lebih aman?',
            opts: [
                '<code>relative = 0.4</code>',
                '<code>absolute = 2GB</code>',
                '<code>relative = 0.9</code>',
                'Tidak perlu diset'
            ],
            a: 1,
            exp: 'Nilai relatif bisa dihitung dari memori host, bukan limit container, sehingga broker mengira punya jauh lebih banyak memori dan di-OOM-kill sebelum alarmnya sempat menyala. Bentuk absolut menghilangkan ambiguitas ini.'
        }
    ]
},

/* ---------------------------------------------------------------- 3 ----- */
{
    id: 3,
    cat: '2 · Routing',
    title: 'Empat Tipe Exchange dan Cara Memilihnya',
    level: 'Menengah', dur: '20 mnt',
    tags: ['exchange', 'direct', 'fanout', 'topic', 'headers', 'routing', 'alternate'],
    desc: 'Menguasai direct, fanout, topic, dan headers — serta pola binding yang membuat topologi tetap sederhana saat sistem tumbuh.',
    theory: `
<h2>Empat Tipe, Empat Pertanyaan</h2>
<table>
<thead><tr><th>Tipe</th><th>Aturan pencocokan</th><th>Pertanyaan yang dijawab</th></tr></thead>
<tbody>
<tr><td><strong>direct</strong></td><td>routing key sama persis</td><td>"Kirim ke satu tujuan tertentu"</td></tr>
<tr><td><strong>fanout</strong></td><td>abaikan routing key, kirim ke semua</td><td>"Semua orang perlu tahu"</td></tr>
<tr><td><strong>topic</strong></td><td>pola dengan <code>*</code> dan <code>#</code></td><td>"Kirim ke yang berminat pada kategori ini"</td></tr>
<tr><td><strong>headers</strong></td><td>cocokkan header, bukan routing key</td><td>"Kriterianya lebih dari satu dimensi"</td></tr>
</tbody>
</table>

<h3>Direct — Paling Sederhana</h3>
<pre data-lang="text" data-file="direct exchange">exchange "tugas" (direct)

  routing_key="prioritas.tinggi" ──> queue tugas.mendesak
  routing_key="prioritas.normal" ──> queue tugas.biasa

Beberapa queue boleh memakai binding key yang sama:
  queue A binding "laporan" ┐
  queue B binding "laporan" ┴──> keduanya menerima salinan</pre>
<p>Bila beberapa <strong>konsumer</strong> menempel pada <em>satu</em> queue, pesan dibagi bergiliran di antara mereka — inilah pola <em>work queue</em>. Bila beberapa <strong>queue</strong> punya binding yang sama, masing-masing menerima <em>salinan</em>.</p>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Perbedaan yang menentukan arsitektur</div>
<pre data-lang="text">Satu queue, 3 konsumer  → beban DIBAGI       (1 pesan diproses 1 kali)
Tiga queue, 1 konsumer  → pesan DISALIN      (1 pesan diproses 3 kali)</pre>
    <p>Ingin menambah kapasitas? Tambah konsumer pada queue yang sama. Ingin menambah fitur yang bereaksi pada peristiwa yang sama? Tambah queue dengan binding baru.</p>
</div>

<h3>Fanout — Siaran</h3>
<p>Routing key diabaikan sepenuhnya. Setiap queue yang terikat menerima salinan. Cocok untuk pembatalan cache, notifikasi konfigurasi berubah, atau peristiwa yang semua layanan perlu tahu.</p>

<h3>Topic — Yang Paling Sering Dipakai di Produksi</h3>
<pre data-lang="text" data-file="pola topic">Routing key dipisah titik:  "pesanan.jakarta.dibuat"

  *  cocok dengan TEPAT SATU kata
  #  cocok dengan NOL ATAU LEBIH kata

Pola                        Cocok dengan
─────────────────────────── ──────────────────────────────────────────
pesanan.*.dibuat            pesanan.jakarta.dibuat        ✓
                            pesanan.dibuat                ✗ (kurang 1 kata)
                            pesanan.jakarta.utara.dibuat  ✗ (lebih 1 kata)

pesanan.#                   pesanan.dibuat                ✓
                            pesanan.jakarta.utara.dibuat  ✓
                            pesanan                       ✓ (# boleh nol kata)

#.dibuat                    pesanan.dibuat                ✓
                            pembayaran.jakarta.dibuat     ✓

#                           SEMUA pesan                   ✓</pre>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Rancang routing key dari umum ke khusus</div>
    <p>Urutan segmen menentukan pola apa yang mungkin ditulis nanti. Susun dari kategori terluas ke terkecil.</p>
<pre data-lang="text">✅ &lt;domain&gt;.&lt;wilayah&gt;.&lt;peristiwa&gt;
   pesanan.jakarta.dibuat
   → bisa: pesanan.#          (semua tentang pesanan)
   → bisa: pesanan.jakarta.#  (semua di Jakarta)
   → bisa: *.jakarta.*        (semua domain di Jakarta)

❌ dibuat.pesanan.jakarta
   → tidak ada pola wajar untuk "semua tentang pesanan"</pre>
    <p>Batas teknis: maksimal 255 byte untuk routing key. Batas praktis: lebih dari empat segmen biasanya menandakan Anda memaksakan terlalu banyak informasi ke dalam satu string — pindahkan ke header.</p>
</div>

<h3>Headers — Jarang Dipakai, Kadang Tepat</h3>
<pre data-lang="text" data-file="headers exchange">binding arguments:
  x-match = all      → semua header harus cocok (DAN)
  x-match = any      → salah satu cukup (ATAU)

binding:  { "x-match": "all", "format": "pdf", "prioritas": "tinggi" }
pesan  :  headers { "format": "pdf", "prioritas": "tinggi", "penulis": "ani" }
          → cocok (header tambahan diabaikan)</pre>
<p>Headers exchange lebih lambat daripada topic karena tidak bisa memakai indeks trie. Pakai hanya bila kriterianya benar-benar multi-dimensi dan tidak masuk akal digabung ke dalam satu routing key.</p>

<h3>Exchange Bawaan</h3>
<table>
<thead><tr><th>Nama</th><th>Tipe</th><th>Kegunaan</th></tr></thead>
<tbody>
<tr><td><code>""</code> (kosong)</td><td>direct</td><td>Routing key = nama queue. Praktis, tetapi tidak bisa diperluas</td></tr>
<tr><td><code>amq.direct</code></td><td>direct</td><td>Untuk percobaan cepat</td></tr>
<tr><td><code>amq.fanout</code></td><td>fanout</td><td>Untuk percobaan cepat</td></tr>
<tr><td><code>amq.topic</code></td><td>topic</td><td>Untuk percobaan cepat</td></tr>
<tr><td><code>amq.rabbitmq.trace</code></td><td>topic</td><td>Firehose tracer untuk debugging</td></tr>
</tbody>
</table>
<p>Untuk produksi, buat exchange bernama sendiri. Exchange <code>amq.*</code> tidak bisa dihapus dan mencampur beberapa sistem di dalamnya membuat topologi sulit dilacak.</p>

<h3>Alternate Exchange — Jaring Pengaman</h3>
<pre data-lang="bash" data-file="alternate exchange">rabbitmqadmin declare exchange name=pesanan.tak-terkirim type=fanout durable=true
rabbitmqadmin declare queue    name=pesanan.tak-terkirim.q durable=true
rabbitmqadmin declare binding  source=pesanan.tak-terkirim destination=pesanan.tak-terkirim.q

rabbitmqadmin declare exchange name=pesanan type=topic durable=true \\
  arguments='{"alternate-exchange":"pesanan.tak-terkirim"}'</pre>
<p>Sekarang pesan yang tidak cocok dengan binding mana pun tidak lagi lenyap — ia jatuh ke queue khusus. Pasang alert bila queue itu tidak kosong, dan Anda akan tahu dalam hitungan menit ketika ada routing key baru yang belum ada bindingnya.</p>

<h3>Exchange-to-Exchange Binding</h3>
<p>Exchange boleh terikat ke exchange lain. Ini memungkinkan lapisan routing yang rapi: satu exchange penerima utama meneruskan ke beberapa exchange domain, tanpa producer perlu tahu strukturnya.</p>
<pre data-lang="text" data-file="berlapis">peristiwa (topic)
   ├── binding "pesanan.#"    ──> pesanan (topic)    ──> queue-queue pesanan
   ├── binding "pembayaran.#" ──> pembayaran (topic) ──> queue-queue pembayaran
   └── binding "#"            ──> audit (fanout)     ──> queue audit semua</pre>`,
    lab: {
        intro: `
<h3>Praktik: Membangun Topologi Topic yang Bisa Tumbuh</h3>
<p>Buat exchange topic dengan jaring pengaman, lalu buktikan pola pencocokannya.</p>`,
        files: [{
            name: 'topologi.sh', lang: 'bash', code: `#!/usr/bin/env bash
set -euo pipefail
RA="rabbitmqadmin -u admin -p rahasia"

# jaring pengaman untuk pesan tak terkirim
$RA declare exchange name=pesanan.tak-terkirim type=fanout durable=true
$RA declare queue    name=pesanan.tak-terkirim.q durable=true
$RA declare binding  source=pesanan.tak-terkirim destination=pesanan.tak-terkirim.q

# exchange utama
$RA declare exchange name=pesanan type=topic durable=true \\
    arguments='{"alternate-exchange":"pesanan.tak-terkirim"}'

# konsumer 1: kirim email untuk pesanan baru di wilayah mana pun
$RA declare queue   name=pesanan.email durable=true
$RA declare binding source=pesanan destination=pesanan.email \\
    routing_key='pesanan.*.dibuat'

# konsumer 2: audit SEMUA peristiwa pesanan
$RA declare queue   name=pesanan.audit durable=true
$RA declare binding source=pesanan destination=pesanan.audit \\
    routing_key='pesanan.#'

# konsumer 3: tim Jakarta memantau seluruh aktivitas wilayahnya
$RA declare queue   name=pesanan.jakarta durable=true
$RA declare binding source=pesanan destination=pesanan.jakarta \\
    routing_key='pesanan.jakarta.#'

echo "topologi siap."` }],
        steps: [
            { note: 'Terapkan topologi', cmd: 'bash topologi.sh' },
            { note: 'Lihat seluruh binding yang terpasang', cmd: 'rabbitmqctl list_bindings' },
            { note: 'Uji pesan yang cocok dengan tiga binding sekaligus', cmd: 'rabbitmqadmin publish exchange=pesanan routing_key=pesanan.jakarta.dibuat payload="{\\"id\\":1}"' },
            { note: 'Uji routing key yang belum punya binding — masuk jaring pengaman', cmd: 'rabbitmqadmin publish exchange=pesanan routing_key=pesanan.diperbarui payload="{\\"id\\":2}"' },
            { note: 'Periksa queue mana yang menerima apa', cmd: 'rabbitmqctl list_queues name messages' }
        ],
        snippets: ['rabbitmqctl list_bindings', 'rabbitmqctl list_queues name messages', 'rabbitmqadmin publish exchange=pesanan routing_key=pesanan.jakarta.dibuat payload="{}"', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN membangun produksi di atas default exchange',
            body: `<p>Default exchange (nama kosong) memperlakukan routing key sebagai nama queue. Ini nyaman untuk contoh tutorial, tetapi mengunci arsitektur Anda: producer menjadi tahu nama queue, dan menambah konsumer kedua berarti mengubah kode producer.</p>
<pre data-lang="text">❌ publish(exchange="", routing_key="pesanan.email")
   producer harus tahu ada queue bernama pesanan.email

✅ publish(exchange="pesanan", routing_key="pesanan.jakarta.dibuat")
   producer hanya melaporkan peristiwa; siapa yang mendengar urusan binding</pre>`
        },
        {
            kind: 'salah', title: 'Mencampur <code>*</code> dan <code>#</code> tanpa mengujinya',
            body: `<p>Perbedaan keduanya halus tetapi menentukan. <code>*</code> cocok dengan <strong>tepat satu</strong> kata; <code>#</code> cocok dengan <strong>nol atau lebih</strong>.</p>
<pre data-lang="text">binding: pesanan.*
  pesanan.dibuat          ✓
  pesanan.jakarta.dibuat  ✗   ← sering tidak disadari

binding: pesanan.#
  pesanan.dibuat          ✓
  pesanan.jakarta.dibuat  ✓
  pesanan                 ✓</pre>
<p>Gejalanya: sebagian pesan diproses dan sebagian tidak, tergantung berapa segmen routing key-nya. Selalu uji dengan beberapa contoh routing key nyata sebelum rilis.</p>`
        },
        {
            kind: 'best', title: 'Pasang alternate-exchange pada setiap exchange produksi',
            body: `<p>Ini biaya konfigurasi beberapa menit yang menghilangkan seluruh kelas bug "pesan hilang misterius".</p>
<ul>
<li>Semua pesan yang tidak cocok dengan binding mana pun mendarat di satu queue.</li>
<li>Pasang alert bila queue itu tidak kosong.</li>
<li>Isi queue tersebut menjadi bukti langsung: routing key apa yang di-publish tanpa ada yang mendengarkan.</li>
</ul>
<p>Alternatifnya di sisi klien adalah <code>mandatory=true</code> dengan handler <code>basic.return</code>. Keduanya bisa dipakai bersamaan.</p>`
        },
        {
            kind: 'kasus', title: 'Satu queue menampung 40 juta pesan karena binding "#"',
            body: `<p>Seorang engineer membuat queue debug dengan binding <code>#</code> untuk melihat semua pesan yang lewat, lalu lupa menghapusnya setelah selesai. Tidak ada konsumer yang menempel padanya.</p>
<p>Tiga minggu kemudian queue itu berisi 40 juta pesan, memakan seluruh disk node, memicu alarm disk, dan memblokir seluruh publish di broker — mematikan produksi.</p>
<p>Dua pertahanan yang murah: berikan <code>x-max-length</code> dan <code>x-message-ttl</code> pada setiap queue eksplorasi, serta pasang alert atas queue tanpa konsumer yang jumlah pesannya bertambah. Lebih baik lagi, pakai fitur <em>firehose tracer</em> untuk debugging, karena ia dirancang untuk dimatikan.</p>`
        }
    ],
    quiz: [
        {
            q: 'Binding <code>pesanan.*</code> menerima pesan dengan routing key mana?',
            opts: [
                '<code>pesanan.jakarta.dibuat</code>',
                '<code>pesanan.dibuat</code>',
                'Keduanya',
                'Tidak keduanya'
            ],
            a: 1,
            exp: '<code>*</code> cocok dengan tepat satu kata. <code>pesanan.jakarta.dibuat</code> punya dua kata setelah "pesanan" sehingga tidak cocok — untuk itu diperlukan <code>pesanan.#</code>.'
        },
        {
            q: 'Tiga konsumer menempel pada SATU queue. Apa yang terjadi pada tiap pesan?',
            opts: [
                'Setiap konsumer menerima salinannya',
                'Pesan dibagi bergiliran, satu pesan diproses satu konsumer',
                'Hanya konsumer pertama yang menerima',
                'Pesan ditolak karena bentrok'
            ],
            a: 1,
            exp: 'Konsumer pada satu queue berbagi beban (work queue). Untuk membuat setiap pihak menerima salinan, dibutuhkan queue terpisah dengan binding masing-masing.'
        },
        {
            q: 'Fitur apa yang mencegah pesan tanpa binding cocok hilang diam-diam?',
            opts: [
                'Dead letter exchange',
                'Alternate exchange',
                'Publisher confirm',
                'Prefetch'
            ],
            a: 1,
            exp: '<code>alternate-exchange</code> menangkap pesan yang tidak terkirim ke queue mana pun. DLX menangani hal berbeda: pesan yang sudah masuk queue lalu ditolak, kedaluwarsa, atau meluap.'
        }
    ]
},

/* ---------------------------------------------------------------- 4 ----- */
{
    id: 4,
    cat: '2 · Routing',
    title: 'Producer & Consumer: Properti Pesan dan Siklus Hidupnya',
    level: 'Menengah', dur: '20 mnt',
    tags: ['producer', 'consumer', 'properties', 'payload', 'json', 'basic.consume'],
    desc: 'Menulis producer dan consumer yang benar sejak awal, termasuk properti pesan yang menentukan keandalan dan kemudahan debugging.',
    theory: `
<h2>Anatomi Sebuah Pesan</h2>
<p>Pesan AMQP terdiri dari tiga bagian: <strong>properti</strong> (metadata baku), <strong>headers</strong> (metadata bebas), dan <strong>body</strong> (byte mentah).</p>
<pre data-lang="text" data-file="struktur pesan">┌─ Properties (baku AMQP) ────────────────────────┐
│ content_type   : application/json               │
│ delivery_mode  : 2  (persistent)                │
│ message_id     : 8f2c-4a1b-…                    │
│ correlation_id : untuk RPC / pelacakan          │
│ reply_to       : nama queue balasan             │
│ timestamp      : 1785312000                     │
│ expiration     : "60000"  (TTL per pesan, ms)   │
│ priority       : 0–9                            │
│ app_id         : layanan-pesanan                │
├─ Headers (bebas) ───────────────────────────────┤
│ x-trace-id     : 4bf92f3577b34da6               │
│ x-versi-skema  : 2                              │
│ x-percobaan    : 0                              │
├─ Body ──────────────────────────────────────────┤
│ {"pesanan_id":"P-1042","total":150000}          │
└─────────────────────────────────────────────────┘</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ <code>delivery_mode = 2</code> saja tidak cukup</div>
    <p>Agar pesan benar-benar bertahan saat broker restart, <strong>ketiganya</strong> harus terpenuhi:</p>
<pre data-lang="text">1. queue durable    = true    (queue ada lagi setelah restart)
2. delivery_mode    = 2       (pesan ditulis ke disk)
3. publisher confirm            (Anda tahu broker benar-benar menerimanya)</pre>
    <p>Melewatkan salah satunya membuat dua lainnya sia-sia. Ini dibahas tuntas di bab 6.</p>
</div>

<h3>Producer yang Benar</h3>
<pre data-lang="javascript" data-file="producer.js">const amqp = require('amqplib');
const { randomUUID } = require('crypto');

let koneksi = null;
let channel = null;

async function siapkan() {
  koneksi = await amqp.connect({
    protocol: 'amqp',
    hostname: process.env.RMQ_HOST || 'localhost',
    port: 5672,
    username: process.env.RMQ_USER,
    password: process.env.RMQ_PASS,
    vhost: '/',
    heartbeat: 60,                       // deteksi koneksi mati
    clientProperties: {
      connection_name: 'layanan-pesanan-producer'   // terlihat di UI
    }
  });

  koneksi.on('error', (e) => console.error('koneksi error:', e.message));
  koneksi.on('close', () => { channel = null; jadwalkanSambungUlang(); });

  // ConfirmChannel: broker mengonfirmasi tiap publish
  channel = await koneksi.createConfirmChannel();

  await channel.assertExchange('pesanan', 'topic', {
    durable: true,
    arguments: { 'alternate-exchange': 'pesanan.tak-terkirim' }
  });

  // pesan yang tak bisa dirutekan dikembalikan ke sini
  channel.on('return', (msg) => {
    console.error('TIDAK TERKIRIM:', msg.fields.routingKey,
                  msg.content.toString());
  });
}

async function kirimPeristiwa(peristiwa, wilayah, data) {
  const routingKey = 'pesanan.' + wilayah + '.' + peristiwa;
  const body = Buffer.from(JSON.stringify(data));

  return new Promise((resolve, reject) => {
    channel.publish('pesanan', routingKey, body, {
      persistent: true,                  // = delivery_mode 2
      mandatory: true,                   // kembalikan bila tak terkirim
      contentType: 'application/json',
      contentEncoding: 'utf-8',
      messageId: randomUUID(),           // dasar idempotensi konsumer
      timestamp: Math.floor(Date.now() / 1000),
      appId: 'layanan-pesanan',
      headers: {
        'x-versi-skema': 2,
        'x-trace-id': ambilTraceId()
      }
    }, (err) => err ? reject(err) : resolve());   // publisher confirm
  });
}</pre>

<h3>Consumer yang Benar</h3>
<pre data-lang="javascript" data-file="consumer.js">async function mulaiKonsumsi() {
  const channel = await koneksi.createChannel();

  await channel.assertQueue('pesanan.email', {
    durable: true,
    arguments: {
      'x-queue-type': 'quorum',
      'x-dead-letter-exchange': 'pesanan.dlx',
      'x-delivery-limit': 5
    }
  });
  await channel.bindQueue('pesanan.email', 'pesanan', 'pesanan.*.dibuat');

  // WAJIB: batasi berapa pesan boleh "in-flight" tanpa ack
  await channel.prefetch(20);

  await channel.consume('pesanan.email', async (msg) => {
    if (msg === null) return;            // konsumer dibatalkan broker

    try {
      const data = JSON.parse(msg.content.toString());
      await prosesKirimEmail(data, msg.properties.messageId);
      channel.ack(msg);                  // baru ack SETELAH berhasil
    } catch (e) {
      const bisaDiulang = e.sementara === true;
      // requeue=false → jatuh ke DLX, bukan berputar tanpa henti
      channel.nack(msg, false, bisaDiulang);
      console.error('gagal memproses:', e.message);
    }
  }, {
    noAck: false,                        // ack manual — WAJIB
    consumerTag: 'email-worker-' + process.pid
  });
}</pre>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ <code>noAck: true</code> berarti kehilangan pesan</div>
    <p>Dengan <code>noAck: true</code> (disebut juga <em>auto-ack</em>), broker menganggap pesan selesai <strong>begitu terkirim ke soket</strong> — sebelum konsumer Anda sempat memprosesnya.</p>
    <p>Bila proses konsumer mati di tengah jalan, pesan itu sudah hilang dari broker dan tidak akan pernah kembali. Pakai <code>noAck: true</code> hanya untuk data yang memang boleh hilang, seperti metrik sampling.</p>
</div>

<h3>Serialisasi Payload</h3>
<table>
<thead><tr><th>Format</th><th>Kelebihan</th><th>Kekurangan</th></tr></thead>
<tbody>
<tr><td>JSON</td><td>Mudah dibaca manusia, universal</td><td>Boros ukuran, tanpa skema</td></tr>
<tr><td>Protobuf / Avro</td><td>Ringkas, ada skema, evolusi terkendali</td><td>Perlu registry, sulit dibaca saat debug</td></tr>
<tr><td>MessagePack</td><td>Ringkas, mirip JSON</td><td>Kurang umum</td></tr>
</tbody>
</table>
<p>Untuk sebagian besar tim, JSON dengan header <code>x-versi-skema</code> adalah titik awal yang tepat. Yang penting bukan formatnya, melainkan <strong>aturan evolusinya</strong>: hanya menambah field opsional, tidak pernah mengubah arti field yang sudah ada, dan tidak menghapus field sebelum semua konsumer diperbarui.</p>

<div class="callout callout-info">
    <div class="callout-title">💡 Beri nama setiap connection</div>
    <p><code>connection_name</code> muncul di UI manajemen dan di <code>rabbitmqctl list_connections</code>. Saat sebuah broker melayani 400 koneksi dan salah satunya berperilaku aneh, nama seperti <code>layanan-pesanan-producer</code> mengubah investigasi setengah jam menjadi setengah menit.</p>
</div>

<h3>Push vs Pull</h3>
<table>
<thead><tr><th></th><th><code>basic.consume</code> (push)</th><th><code>basic.get</code> (pull)</th></tr></thead>
<tbody>
<tr><td>Cara kerja</td><td>Broker mendorong pesan</td><td>Klien meminta satu per satu</td></tr>
<tr><td>Throughput</td><td>Tinggi</td><td>Sangat rendah</td></tr>
<tr><td>Pakai untuk</td><td>Hampir semua kasus</td><td>Skrip administratif, mengintip isi queue</td></tr>
</tbody>
</table>
<p><code>basic.get</code> memerlukan satu perjalanan bolak-balik jaringan per pesan. Memakainya di dalam loop adalah kesalahan performa klasik — throughput bisa 100 kali lebih rendah dibanding <code>basic.consume</code>.</p>`,
    lab: {
        intro: `
<h3>Praktik: Mengirim, Mengintip, dan Mengonsumsi</h3>
<p>Publikasikan pesan dengan properti lengkap, lalu periksa apa yang benar-benar tersimpan di broker.</p>`,
        files: [{
            name: 'kirim.js', lang: 'javascript', code: `const amqp = require('amqplib');
const { randomUUID } = require('crypto');

(async () => {
  const koneksi = await amqp.connect('amqp://admin:rahasia@localhost:5672/');
  const ch = await koneksi.createConfirmChannel();

  await ch.assertExchange('pesanan', 'topic', { durable: true });

  ch.on('return', (m) =>
    console.error('TIDAK TERKIRIM:', m.fields.routingKey));

  const kirim = (wilayah, peristiwa, data) => new Promise((res, rej) => {
    ch.publish('pesanan', 'pesanan.' + wilayah + '.' + peristiwa,
      Buffer.from(JSON.stringify(data)), {
        persistent: true,
        mandatory: true,
        contentType: 'application/json',
        messageId: randomUUID(),
        timestamp: Math.floor(Date.now() / 1000),
        appId: 'lab-producer',
        headers: { 'x-versi-skema': 2 }
      }, (err) => err ? rej(err) : res());
  });

  await kirim('jakarta', 'dibuat',      { id: 'P-1', total: 150000 });
  await kirim('bandung', 'dibuat',      { id: 'P-2', total:  89000 });
  await kirim('jakarta', 'diperbarui',  { id: 'P-1', total: 160000 });

  console.log('3 pesan dikonfirmasi broker.');
  await ch.close();
  await koneksi.close();
})();` }],
        steps: [
            { note: 'Kirim beberapa pesan dengan properti lengkap', cmd: 'node kirim.js' },
            { note: 'Lihat berapa pesan mendarat di tiap queue', cmd: 'rabbitmqctl list_queues name messages consumers' },
            { note: 'Intip isi satu pesan tanpa menghapusnya dari queue', cmd: 'rabbitmqadmin get queue=pesanan.email ackmode=reject_requeue_true' },
            { note: 'Periksa properti yang benar-benar tersimpan', cmd: 'rabbitmqadmin get queue=pesanan.audit ackmode=reject_requeue_true count=1' },
            { note: 'Lihat koneksi beserta namanya', cmd: 'rabbitmqctl list_connections name user state' }
        ],
        snippets: ['rabbitmqctl list_queues name messages consumers', 'rabbitmqadmin get queue=pesanan.email ackmode=reject_requeue_true', 'rabbitmqctl list_connections name user state', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN memakai <code>noAck: true</code> untuk pekerjaan yang penting',
            body: `<p>Auto-ack membuat broker melupakan pesan segera setelah menuliskannya ke soket. Konsumer yang mati di tengah pemrosesan berarti pesan itu hilang selamanya — tidak ada requeue, tidak ada DLQ, tidak ada jejak.</p>
<pre data-lang="javascript">❌ ch.consume(q, handler, { noAck: true })
✅ ch.consume(q, handler, { noAck: false })   // lalu ch.ack(msg) setelah sukses</pre>
<p>Auto-ack juga menghilangkan efek <code>prefetch</code>, sehingga broker membanjiri konsumer dengan pesan secepat jaringan mengizinkan.</p>`
        },
        {
            kind: 'salah', title: 'Melakukan ack sebelum pemrosesan selesai',
            body: `<p>Meng-ack di awal handler membuat throughput terlihat bagus, tetapi menghapus seluruh jaminan keandalan: setiap kegagalan berarti pesan hilang.</p>
<pre data-lang="javascript">❌ ch.ack(msg);
   await proses(data);      // gagal? pesan sudah lenyap

✅ await proses(data);
   ch.ack(msg);             // ack menyatakan "sudah benar-benar selesai"</pre>
<p>Konsekuensinya pekerjaan bisa diproses <strong>lebih dari sekali</strong> bila konsumer mati setelah memproses tetapi sebelum ack. Karena itu konsumer wajib idempoten — dibahas di bab 10.</p>`
        },
        {
            kind: 'best', title: 'Sertakan <code>message_id</code> dan trace id pada setiap pesan',
            body: `<p>Dua field kecil yang menyelamatkan banyak jam kerja:</p>
<ul>
<li><code>message_id</code> — kunci alami untuk deduplikasi di sisi konsumer. Tanpa ini, idempotensi harus mengarang kunci dari isi payload, yang rapuh.</li>
<li><code>x-trace-id</code> di header — menghubungkan pesan dengan request HTTP asalnya dan dengan log di kedua sisi.</li>
</ul>
<p>Tambahkan juga <code>app_id</code> dan <code>timestamp</code>. Saat sebuah pesan aneh muncul di DLQ enam bulan kemudian, ketiganya menjawab "siapa yang mengirim ini, kapan, dan dalam rangka apa".</p>`
        },
        {
            kind: 'kasus', title: 'Konsumer memakan 6 GB memori dalam sepuluh menit',
            body: `<p>Sebuah konsumer dengan <code>noAck: true</code> dan tanpa <code>prefetch</code> dinyalakan menghadapi queue berisi 2 juta pesan yang menumpuk semalam.</p>
<p>Broker mengirim pesan secepat jaringan mengizinkan. Klien menampungnya di buffer internal, memori proses melonjak, garbage collector mengejar tanpa hasil, dan proses akhirnya di-OOM-kill — dengan seluruh pesan yang sudah terkirim ikut hilang karena auto-ack.</p>
<p>Perbaikannya dua baris: <code>prefetch(20)</code> dan ack manual. Dengan itu broker hanya mengirim 20 pesan berikutnya setelah yang sebelumnya dikonfirmasi selesai.</p>`
        }
    ],
    quiz: [
        {
            q: 'Konsumer mati setelah memproses pesan tetapi sebelum mengirim ack. Apa yang terjadi?',
            opts: [
                'Pesan hilang',
                'Pesan dikirim ulang ke konsumer lain sehingga bisa diproses dua kali',
                'Pesan langsung masuk DLQ',
                'Broker menahan pesan sampai konsumer itu kembali'
            ],
            a: 1,
            exp: 'Pesan tanpa ack akan dikembalikan ke queue saat channel terputus. Inilah alasan konsumer wajib idempoten: jaminan RabbitMQ adalah <em>at-least-once</em>, bukan exactly-once.'
        },
        {
            q: 'Kenapa <code>basic.get</code> di dalam loop adalah kesalahan performa?',
            opts: [
                'Karena tidak mendukung ack',
                'Karena memerlukan satu perjalanan bolak-balik jaringan untuk setiap pesan',
                'Karena tidak bisa dipakai pada queue durable',
                'Karena mengabaikan routing key'
            ],
            a: 1,
            exp: '<code>basic.get</code> bersifat pull dan sinkron. <code>basic.consume</code> membuat broker mendorong pesan secara berkelanjutan, dengan throughput yang jauh lebih tinggi.'
        },
        {
            q: 'Berapa syarat yang harus dipenuhi agar pesan benar-benar bertahan saat broker restart?',
            opts: [
                'Cukup <code>delivery_mode = 2</code>',
                'Queue durable, <code>delivery_mode = 2</code>, dan publisher confirm',
                'Cukup queue durable',
                'Cukup mengaktifkan cluster'
            ],
            a: 1,
            exp: 'Ketiganya diperlukan bersamaan. Queue durable membuat queue-nya bertahan, delivery_mode 2 membuat isinya ditulis ke disk, dan publisher confirm memberi tahu producer bahwa broker sudah benar-benar menyimpannya.'
        }
    ]
}

];

/* ==========================================================================
   RABBITMQ — BAGIAN B (Keandalan: Ack, Durability, DLX, Tipe Queue)
   ========================================================================== */

const RMQ_MOD_B = [

/* ---------------------------------------------------------------- 5 ----- */
{
    id: 5,
    cat: '3 · Keandalan',
    title: 'Acknowledgement & Prefetch: Mengendalikan Aliran Pesan',
    level: 'Menengah', dur: '20 mnt',
    tags: ['ack', 'nack', 'prefetch', 'qos', 'redelivery', 'unacked'],
    desc: 'Mengatur berapa banyak pekerjaan yang boleh dipegang satu konsumer, dan memahami apa yang sebenarnya terjadi saat pesan ditolak.',
    theory: `
<h2>Tiga Cara Menutup Sebuah Pesan</h2>
<table>
<thead><tr><th>Perintah</th><th>Arti</th><th>Nasib pesan</th></tr></thead>
<tbody>
<tr><td><code>basic.ack</code></td><td>Berhasil diproses</td><td>Dihapus dari queue</td></tr>
<tr><td><code>basic.nack(requeue=true)</code></td><td>Gagal, coba lagi</td><td>Kembali ke queue</td></tr>
<tr><td><code>basic.nack(requeue=false)</code></td><td>Gagal, jangan diulang</td><td>Ke DLX, atau dibuang</td></tr>
<tr><td><code>basic.reject</code></td><td>Sama seperti nack, tapi satu pesan saja</td><td>Sesuai flag requeue</td></tr>
</tbody>
</table>
<p>Perbedaan <code>nack</code> dan <code>reject</code>: <code>nack</code> mendukung flag <code>multiple</code> untuk menutup banyak pesan sekaligus. Dalam praktik, <code>nack</code> hampir selalu yang dipakai.</p>

<div class="callout callout-danger">
    <div class="callout-title">⛔ <code>requeue=true</code> tanpa penundaan = poison message loop</div>
    <p>Bila pemrosesan gagal karena payload memang rusak, mengembalikannya ke queue berarti ia akan langsung diambil lagi, gagal lagi, dikembalikan lagi — ribuan kali per detik.</p>
<pre data-lang="text">pesan rusak → nack(requeue=true) → head of queue → ambil lagi
   → gagal lagi → nack lagi → ...  CPU 100%, queue macet total</pre>
    <p>Pesan itu juga kembali ke <strong>depan</strong> antrean, sehingga memblokir pesan sehat di belakangnya. Solusinya: <code>requeue=false</code> dengan DLX (bab 7), atau batas <code>x-delivery-limit</code> pada quorum queue.</p>
</div>

<h3>Prefetch: Setelan Paling Berdampak yang Sering Dilewatkan</h3>
<p><code>basic.qos(prefetch_count=N)</code> membatasi berapa pesan boleh berstatus <em>unacked</em> pada satu konsumer. Tanpa ini, broker mendorong pesan sebanyak yang bisa ditampung jaringan.</p>
<pre data-lang="text" data-file="pengaruh prefetch">prefetch = 0 (tanpa batas)
  broker  ──── 50.000 pesan ────> konsumer   memori klien meledak
                                             pembagian beban rusak

prefetch = 1
  broker  ──── 1 pesan ────> konsumer
          &lt;─── ack ─────────
  paling adil, tetapi ada jeda jaringan pada setiap pesan
  → throughput rendah untuk tugas yang cepat

prefetch = 20
  broker  ──── 20 pesan ────> konsumer  (pipeline terisi)
  keseimbangan yang baik untuk mayoritas kasus</pre>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Cara memilih nilai prefetch</div>
<pre data-lang="text">Tugas lambat, durasi bervariasi (mis. panggil API pihak ketiga, 2–30 detik)
  → prefetch = 1..5
  Alasan: pembagian beban yang adil lebih berharga daripada throughput.
          Prefetch besar membuat satu konsumer memegang pekerjaan
          yang seharusnya dikerjakan konsumer lain yang sedang menganggur.

Tugas cepat dan seragam (mis. transformasi JSON, &lt; 50 ms)
  → prefetch = 100..300
  Alasan: latensi jaringan mendominasi; pipeline perlu tetap terisi.

Rumus awal yang berguna:
  prefetch ≈ (waktu bolak-balik jaringan / waktu proses per pesan) + 1
  lalu ukur dan sesuaikan.</pre>
</div>

<h3>Prefetch Global vs Per Konsumer</h3>
<pre data-lang="text" data-file="cakupan prefetch">channel.qos(prefetch, global=false)   ← DEFAULT dan hampir selalu benar
  batas berlaku PER KONSUMER pada channel itu

channel.qos(prefetch, global=true)
  batas berlaku untuk SELURUH channel, dibagi semua konsumer di dalamnya

Contoh: 1 channel, 3 konsumer, prefetch 10
  global=false → tiap konsumer boleh 10 unacked  (total 30)
  global=true  → ketiganya berbagi jatah 10      (total 10)</pre>

<h3>Siklus Redelivery</h3>
<pre data-lang="text" data-file="kapan pesan dikirim ulang">Pesan dikembalikan ke queue bila:
  • konsumer memanggil nack/reject dengan requeue=true
  • channel ditutup sebelum ack
  • koneksi terputus (jaringan, restart aplikasi, deploy)
  • konsumer dibatalkan sementara pesan masih unacked

Pesan yang dikirim ulang ditandai:  redelivered = true</pre>
<div class="callout callout-warning">
    <div class="callout-title">⚠️ <code>redelivered=true</code> bukan penghitung percobaan</div>
    <p>Flag ini hanya bernilai benar atau salah — ia tidak memberi tahu <em>berapa kali</em> pesan sudah dicoba. Pesan yang gagal 500 kali punya flag yang sama dengan yang gagal sekali.</p>
    <p>Untuk menghitung percobaan, gunakan salah satu:</p>
    <ul>
        <li><strong>Quorum queue</strong> dengan <code>x-delivery-limit</code> — broker menghitung sendiri, cara paling andal.</li>
        <li>Header hitungan yang Anda kelola sendiri saat mem-publish ulang lewat DLX (bab 7).</li>
    </ul>
</div>

<h3>Konsekuensi bagi Deployment</h3>
<p>Saat konsumer di-deploy ulang, semua pesan unacked miliknya kembali ke queue dan diproses ulang oleh instance lain. Dengan prefetch 300 dan lima konsumer, satu deploy bisa berarti 1.500 pesan diproses dua kali.</p>
<pre data-lang="javascript" data-file="graceful shutdown">let sedangMati = false;

process.on('SIGTERM', async () => {
  sedangMati = true;
  // 1. berhenti menerima pesan baru
  await channel.cancel(consumerTag);
  // 2. beri waktu pesan yang sedang diproses untuk selesai
  await tungguSampaiSelesai({ timeoutMs: 25000 });
  // 3. baru tutup
  await channel.close();
  await koneksi.close();
  process.exit(0);
});</pre>
<p>Pasangkan dengan <code>terminationGracePeriodSeconds</code> di Kubernetes yang lebih besar dari timeout di atas, agar pod tidak dibunuh paksa di tengah pekerjaan.</p>

<h3>Membaca Angka Unacked</h3>
<pre data-lang="bash" data-file="diagnosis">rabbitmqctl list_queues name messages messages_ready messages_unacknowledged consumers</pre>
<table>
<thead><tr><th>Pola angka</th><th>Artinya</th></tr></thead>
<tbody>
<tr><td><code>ready</code> tinggi, <code>unacked</code> 0, <code>consumers</code> 0</td><td>Tidak ada konsumer — aplikasi mati atau gagal connect</td></tr>
<tr><td><code>ready</code> tinggi, <code>unacked</code> = prefetch × konsumer</td><td>Konsumer ada tapi terlalu lambat — tambah konsumer</td></tr>
<tr><td><code>unacked</code> tinggi dan diam</td><td>Konsumer menggantung, lupa ack, atau deadlock</td></tr>
<tr><td><code>ready</code> naik-turun stabil</td><td>Sehat</td></tr>
</tbody>
</table>`,
    lab: {
        intro: `
<h3>Praktik: Merasakan Dampak Prefetch</h3>
<p>Bandingkan pembagian beban antara prefetch tak terbatas dan prefetch kecil.</p>`,
        files: [{
            name: 'konsumer-uji.js', lang: 'javascript', code: `const amqp = require('amqplib');

const PREFETCH = parseInt(process.env.PREFETCH || '0', 10);
const NAMA     = process.env.NAMA || 'worker-1';
const LAMBAT   = NAMA === 'worker-1';   // worker-1 sengaja dibuat lambat

(async () => {
  const koneksi = await amqp.connect('amqp://admin:rahasia@localhost:5672/');
  const ch = await koneksi.createChannel();

  await ch.assertQueue('uji.prefetch', { durable: true });
  if (PREFETCH > 0) await ch.prefetch(PREFETCH);

  let selesai = 0;
  await ch.consume('uji.prefetch', async (msg) => {
    if (!msg) return;
    // worker-1 butuh 500 ms, worker-2 hanya 50 ms
    await new Promise(r => setTimeout(r, LAMBAT ? 500 : 50));
    ch.ack(msg);
    selesai++;
  }, { noAck: false });

  setInterval(() => console.log(NAMA, 'selesai:', selesai), 2000);
})();

// Jalankan dua terminal:
//   PREFETCH=0  NAMA=worker-1 node konsumer-uji.js
//   PREFETCH=0  NAMA=worker-2 node konsumer-uji.js
// Kirim 1000 pesan, amati pembagiannya. Lalu ulangi dengan PREFETCH=1.` }],
        steps: [
            { note: 'Siapkan queue percobaan', cmd: 'rabbitmqadmin declare queue name=uji.prefetch durable=true' },
            { note: 'Isi dengan 1000 pesan', cmd: 'rabbitmqadmin publish routing_key=uji.prefetch payload="kerja" --count=1000' },
            { note: 'Amati pembagian beban antar konsumer', cmd: 'rabbitmqctl list_consumers' },
            { note: 'Lihat berapa pesan yang dipegang tanpa ack', cmd: 'rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers' },
            { note: 'Periksa channel dan prefetch efektifnya', cmd: 'rabbitmqctl list_channels name prefetch_count messages_unacknowledged' }
        ],
        snippets: ['rabbitmqctl list_consumers', 'rabbitmqctl list_channels name prefetch_count messages_unacknowledged', 'rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN memakai <code>nack(requeue=true)</code> sebagai strategi retry',
            body: `<p>Pesan yang dikembalikan langsung tersedia lagi, biasanya di depan antrean, dan segera diambil kembali oleh konsumer yang sama. Bila penyebab gagalnya menetap — payload rusak, skema tidak dikenal, bug — hasilnya loop tak terbatas yang memakan CPU dan memblokir seluruh queue.</p>
<pre data-lang="javascript">❌ catch (e) { ch.nack(msg, false, true); }

✅ catch (e) {
     if (e.sementara) ch.nack(msg, false, true);   // jaringan/timeout saja
     else             ch.nack(msg, false, false);  // rusak → ke DLX
   }</pre>
<p>Bedakan kegagalan <em>sementara</em> (layak diulang) dari kegagalan <em>permanen</em> (harus diasingkan). Ini keputusan desain, bukan detail implementasi.</p>`
        },
        {
            kind: 'salah', title: 'Memakai prefetch besar untuk tugas yang lambat',
            body: `<p>Dengan prefetch 500 dan tugas berdurasi 10 detik, satu konsumer memesan 500 pesan (≈83 menit kerja) sementara konsumer lain menganggur menunggu queue yang sudah kosong secara logis.</p>
<p>Menambah konsumer tidak akan menolong, karena pekerjaannya sudah "dipegang" oleh konsumer pertama. Gejalanya membingungkan: queue terlihat penuh, CPU rendah, tetapi menambah worker tidak mempercepat apa pun.</p>
<p>Untuk tugas lambat, prefetch 1–5 hampir selalu benar.</p>`
        },
        {
            kind: 'best', title: 'Selalu setel prefetch secara eksplisit',
            body: `<p>Tidak menyetelnya berarti memilih "tak terbatas", dan itu hampir tidak pernah menjadi pilihan yang tepat. Jadikan bagian dari template konsumer standar tim Anda.</p>
<pre data-lang="javascript">await ch.prefetch(20);   // tulis eksplisit walau nilainya sedang
await ch.consume(q, handler, { noAck: false });</pre>
<p>Lakukan pengukuran, jangan menebak: naikkan bertahap sambil mengamati throughput dan pemakaian memori konsumer. Titik optimal biasanya jauh lebih kecil dari perkiraan awal orang.</p>`
        },
        {
            kind: 'kasus', title: 'Deploy rutin menyebabkan 4.000 email ganda',
            body: `<p>Sebuah layanan notifikasi berjalan dengan prefetch 400 dan delapan konsumer. Deployment memakai rolling restart tanpa graceful shutdown: pod dimatikan seketika.</p>
<p>Setiap pod yang mati mengembalikan hingga 400 pesan unacked ke queue. Sebagian sudah terkirim emailnya tetapi belum sempat di-ack, sehingga diproses ulang oleh pod baru. Total sekitar 4.000 email ganda terkirim ke pelanggan dalam satu deploy.</p>
<p>Dua perbaikan yang diperlukan bersamaan: turunkan prefetch ke nilai wajar, dan tambahkan graceful shutdown (cancel consumer, tunggu pekerjaan selesai, baru tutup koneksi). Perbaikan ketiga yang lebih mendasar: buat konsumer idempoten, karena pengiriman ulang adalah bagian normal dari cara kerja RabbitMQ.</p>`
        }
    ],
    quiz: [
        {
            q: 'Tugas memakan waktu 10 detik per pesan. Nilai prefetch yang paling tepat?',
            opts: ['500', '100', '1–5', '0 (tak terbatas)'],
            a: 2,
            exp: 'Untuk tugas lambat, prefetch kecil menjaga pembagian beban tetap adil. Prefetch besar membuat satu konsumer memesan pekerjaan berjam-jam sementara konsumer lain menganggur.'
        },
        {
            q: 'Apa yang ditunjukkan flag <code>redelivered=true</code>?',
            opts: [
                'Berapa kali pesan sudah dicoba',
                'Bahwa pesan pernah dikirim sebelumnya, tanpa informasi jumlah',
                'Bahwa pesan berasal dari DLQ',
                'Bahwa pesan akan segera kedaluwarsa'
            ],
            a: 1,
            exp: 'Flag ini hanya boolean. Untuk membatasi jumlah percobaan, gunakan <code>x-delivery-limit</code> pada quorum queue atau header hitungan yang Anda kelola sendiri lewat DLX.'
        },
        {
            q: 'Queue menunjukkan <code>messages_ready</code> 50.000, <code>consumers</code> 0. Diagnosis?',
            opts: [
                'Konsumer terlalu lambat',
                'Tidak ada konsumer yang terhubung — aplikasi mati atau gagal connect',
                'Prefetch terlalu kecil',
                'Alarm memori sedang aktif'
            ],
            a: 1,
            exp: '<code>consumers = 0</code> berarti tidak ada satu pun konsumer terdaftar. Bila konsumer lambat, angka <code>consumers</code> tetap positif dan <code>messages_unacknowledged</code> akan mendekati prefetch dikali jumlah konsumer.'
        }
    ]
},

/* ---------------------------------------------------------------- 6 ----- */
{
    id: 6,
    cat: '3 · Keandalan',
    title: 'Durability, Persistence, dan Publisher Confirms',
    level: 'Lanjut', dur: '22 mnt',
    tags: ['durable', 'persistent', 'confirm', 'transaction', 'lazy', 'fsync'],
    desc: 'Menutup setiap celah kehilangan pesan dari producer sampai disk, dan mengetahui harga yang dibayar untuk setiap jaminan.',
    theory: `
<h2>Empat Titik Kehilangan Pesan</h2>
<pre data-lang="text" data-file="peta kehilangan">Producer ──①──> Broker ──②──> Queue ──③──> Disk
                                              │
                                              ④
                                              ▼
                                          Consumer

① Publish gagal / broker mati sebelum menerima
   → obat: publisher confirms

② Tidak ada binding cocok, pesan dibuang diam-diam
   → obat: mandatory + basic.return, atau alternate-exchange

③ Broker restart, queue atau pesan tidak ada di disk
   → obat: queue durable + delivery_mode 2

④ Konsumer mati setelah ack tetapi sebelum menyelesaikan pekerjaan
   → obat: ack SETELAH selesai + konsumer idempoten</pre>
<p>Menutup satu titik saja tidak cukup. Sistem yang benar-benar tidak kehilangan pesan menutup keempatnya secara sadar.</p>

<h3>Durable ≠ Persistent</h3>
<table>
<thead><tr><th></th><th><code>durable</code></th><th><code>persistent</code></th></tr></thead>
<tbody>
<tr><td>Milik siapa</td><td>Queue dan exchange</td><td>Pesan</td></tr>
<tr><td>Artinya</td><td>Definisinya bertahan saat restart</td><td>Isinya ditulis ke disk</td></tr>
<tr><td>Diset di mana</td><td>Saat deklarasi queue</td><td>Saat publish (<code>delivery_mode=2</code>)</td></tr>
</tbody>
</table>
<pre data-lang="text" data-file="kombinasi">queue durable=false + pesan persistent=true
  → queue lenyap saat restart; pesannya ikut lenyap. Sia-sia.

queue durable=true + pesan persistent=false
  → queue kembali setelah restart, tetapi KOSONG.

queue durable=true + pesan persistent=true
  → satu-satunya kombinasi yang bertahan. ✅</pre>

<h3>Publisher Confirms</h3>
<p>Tanpa konfirmasi, <code>publish()</code> hanyalah menulis ke soket. Ia berhasil walaupun broker mati sepersekian detik kemudian.</p>
<pre data-lang="javascript" data-file="tiga cara menunggu confirm">// 1. Per pesan — paling sederhana, paling lambat (± 1.000 pesan/detik)
await new Promise((res, rej) => {
  ch.publish(ex, rk, body, opsi, (err) => err ? rej(err) : res());
});

// 2. Batch — kompromi yang baik
const batch = [];
for (const item of daftar) {
  batch.push(new Promise((res, rej) =>
    ch.publish(ex, rk, enc(item), opsi, (e) => e ? rej(e) : res())));
  if (batch.length >= 100) { await Promise.all(batch); batch.length = 0; }
}
await Promise.all(batch);

// 3. Asinkron penuh — paling cepat, paling rumit
//    Simpan pesan di buffer, hapus saat confirm tiba,
//    kirim ulang yang belum terkonfirmasi setelah timeout.
//    Wajib menangani nack DAN return sekaligus.</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Jangan pakai transaksi AMQP</div>
    <p><code>tx.select</code> / <code>tx.commit</code> memang ada dalam spesifikasi AMQP, tetapi membuat throughput anjlok hingga <strong>seratus kali lipat</strong> karena setiap commit memaksa <code>fsync</code> sinkron.</p>
    <p>Publisher confirms memberi jaminan yang setara untuk kebutuhan praktis dengan biaya yang jauh lebih kecil. Transaksi AMQP praktis tidak pernah menjadi jawaban yang benar.</p>
</div>

<h3>Berapa Harga Persistence?</h3>
<pre data-lang="text" data-file="perbandingan kasar">Pesan transient, tanpa confirm .......... ± 50.000 pesan/detik
Pesan persistent, tanpa confirm ......... ± 20.000 pesan/detik
Pesan persistent + confirm batch(100) ... ±  8.000 pesan/detik
Pesan persistent + confirm per pesan .... ±  1.000 pesan/detik

(angka indikatif pada satu node dengan SSD; ukur di lingkungan Anda)</pre>
<div class="callout callout-info">
    <div class="callout-title">💡 Tidak semua pesan berhak atas jaminan yang sama</div>
    <p>Pisahkan berdasarkan konsekuensi kehilangan:</p>
    <ul>
        <li><strong>Transaksi keuangan, pembuatan pesanan</strong> → persistent + confirm per pesan. Kehilangan berarti uang atau kepercayaan.</li>
        <li><strong>Notifikasi, email</strong> → persistent + confirm batch. Kehilangan mengganggu tetapi tidak fatal.</li>
        <li><strong>Metrik, telemetri, analitik sampling</strong> → transient tanpa confirm. Kehilangan sebagian tidak berarti apa-apa.</li>
    </ul>
    <p>Memberi jaminan tertinggi pada semua pesan adalah pemborosan yang membatasi kapasitas sistem Anda.</p>
</div>

<h3>Lazy Queue dan Perubahan di RabbitMQ 3.12+</h3>
<p>Dulu ada mode <em>lazy queue</em> yang memaksa pesan langsung ke disk untuk menghemat memori. Sejak RabbitMQ 3.12, <strong>classic queue versi 2</strong> berperilaku efisien secara default dan <code>x-queue-mode=lazy</code> menjadi usang.</p>
<p>Bila Anda menemukan panduan lama yang menganjurkan lazy queue, saran yang setara di versi modern adalah: pakai <strong>quorum queue</strong> (bab 8), yang memang dirancang menampung antrean panjang tanpa membebani memori.</p>

<h3>Batasi Ukuran Queue — Selalu</h3>
<pre data-lang="bash" data-file="policy batas queue">rabbitmqctl set_policy batas-antrean "^pesanan\\." \\
  '{"max-length":100000,
    "max-length-bytes":1073741824,
    "overflow":"reject-publish",
    "message-ttl":86400000}' \\
  --apply-to queues</pre>
<table>
<thead><tr><th><code>overflow</code></th><th>Perilaku saat penuh</th><th>Pakai untuk</th></tr></thead>
<tbody>
<tr><td><code>drop-head</code></td><td>Buang pesan tertua</td><td>Data yang basi tidak berguna, mis. posisi terkini</td></tr>
<tr><td><code>reject-publish</code></td><td>Tolak publish baru, producer dapat error</td><td>Pekerjaan yang tidak boleh hilang</td></tr>
<tr><td><code>reject-publish-dlx</code></td><td>Tolak, dan kirim ke DLX</td><td>Ingin menyimpan yang tertolak</td></tr>
</tbody>
</table>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Queue tanpa batas adalah bom waktu</div>
    <p>Queue tanpa <code>max-length</code> dan tanpa TTL akan tumbuh sampai disk habis, lalu memicu alarm disk yang memblokir <strong>seluruh publish di broker</strong> — termasuk queue lain yang sehat. Satu queue yang terabaikan bisa mematikan seluruh sistem pesan Anda.</p>
</div>

<h3>Policy: Cara yang Benar Mengatur Queue</h3>
<p>Argumen yang ditulis di kode saat deklarasi queue bersifat permanen: mengubahnya memerlukan penghapusan dan pembuatan ulang queue. <strong>Policy</strong> diterapkan dari luar dan bisa diubah kapan saja tanpa menyentuh kode atau data.</p>
<pre data-lang="bash" data-file="policy vs argumen">rabbitmqctl set_policy ha-pesanan "^pesanan\\." \\
  '{"max-length":100000,"message-ttl":3600000}' \\
  --priority 10 --apply-to queues

rabbitmqctl list_policies
rabbitmqctl clear_policy ha-pesanan</pre>
<p>Aturan praktis: taruh di argumen kode hanya hal yang menjadi bagian dari <em>kontrak</em> queue (tipe queue, DLX). Taruh di policy semua hal operasional (batas panjang, TTL, jumlah replika).</p>`,
    lab: {
        intro: `
<h3>Praktik: Membuktikan Pesan Bertahan Setelah Restart</h3>
<p>Uji setiap kombinasi durable dan persistent, lalu lihat mana yang benar-benar selamat.</p>`,
        files: [{
            name: 'uji-durability.sh', lang: 'bash', code: `#!/usr/bin/env bash
set -euo pipefail
RA="rabbitmqadmin -u admin -p rahasia"

echo "== siapkan empat kombinasi =="
$RA declare queue name=uji.dur-per   durable=true
$RA declare queue name=uji.dur-tra   durable=true
$RA declare queue name=uji.tra-per   durable=false
$RA declare queue name=uji.tra-tra   durable=false

echo "== isi masing-masing satu pesan =="
$RA publish routing_key=uji.dur-per payload="A" properties='{"delivery_mode":2}'
$RA publish routing_key=uji.dur-tra payload="B" properties='{"delivery_mode":1}'
$RA publish routing_key=uji.tra-per payload="C" properties='{"delivery_mode":2}'
$RA publish routing_key=uji.tra-tra payload="D" properties='{"delivery_mode":1}'

echo "== sebelum restart =="
rabbitmqctl list_queues name durable messages

echo "== restart broker =="
docker compose restart rabbitmq
sleep 25

echo "== sesudah restart =="
rabbitmqctl list_queues name durable messages

echo
echo "Yang selamat hanya uji.dur-per (durable + persistent)."
echo "uji.tra-* hilang bersama queue-nya."
echo "uji.dur-tra queue-nya kembali, tetapi kosong."` }],
        steps: [
            { note: 'Jalankan pengujian lengkap', cmd: 'bash uji-durability.sh' },
            { note: 'Periksa status durable tiap queue', cmd: 'rabbitmqctl list_queues name durable messages' },
            { note: 'Pasang batas panjang lewat policy', cmd: 'rabbitmqctl set_policy batas "^uji\\." \'{"max-length":1000,"overflow":"reject-publish"}\' --apply-to queues' },
            { note: 'Lihat policy yang berlaku', cmd: 'rabbitmqctl list_policies' },
            { note: 'Verifikasi policy benar-benar menempel pada queue', cmd: 'rabbitmqctl list_queues name policy' }
        ],
        snippets: ['rabbitmqctl list_queues name durable messages', 'rabbitmqctl list_policies', 'rabbitmqctl list_queues name policy', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN membiarkan queue tanpa batas panjang',
            body: `<p>Setiap queue produksi wajib punya <code>max-length</code>, <code>max-length-bytes</code>, atau <code>message-ttl</code> — idealnya kombinasi ketiganya.</p>
<p>Tanpa batas, satu konsumer yang mati saat akhir pekan cukup untuk memenuhi disk, memicu alarm disk, dan memblokir publish di <strong>seluruh broker</strong>. Kegagalan satu layanan menjadi kegagalan seluruh sistem pesan.</p>
<p>Terapkan lewat policy dengan pola nama, sehingga queue baru otomatis ikut terlindungi tanpa perlu diingat satu per satu.</p>`
        },
        {
            kind: 'salah', title: 'Mengira <code>publish()</code> yang tidak melempar error berarti pesan tersimpan',
            body: `<p>Tanpa confirm mode, <code>publish()</code> hanya menulis ke buffer soket. Ia akan "berhasil" walaupun broker sedang dalam proses mati, jaringan putus sesaat kemudian, atau routing key tidak cocok dengan binding mana pun.</p>
<pre data-lang="javascript">❌ ch.publish(ex, rk, body);          // fire and forget
   log.info('pesanan terkirim');      // belum tentu benar

✅ const ch = await koneksi.createConfirmChannel();
   await new Promise((res, rej) =>
     ch.publish(ex, rk, body, { persistent: true, mandatory: true },
                (e) => e ? rej(e) : res()));</pre>`
        },
        {
            kind: 'best', title: 'Atur operasional lewat policy, bukan argumen di kode',
            body: `<p>Argumen queue bersifat permanen — mengubah <code>x-message-ttl</code> memerlukan penghapusan dan pembuatan ulang queue, yang berarti kehilangan seluruh isinya di produksi.</p>
<pre data-lang="text">Argumen di kode  : x-queue-type, x-dead-letter-exchange  (kontrak)
Policy dari luar : max-length, message-ttl, jumlah replika (operasional)</pre>
<p>Dengan pemisahan ini, tim operasi bisa menyesuaikan batas saat insiden tanpa menunggu rilis aplikasi.</p>`
        },
        {
            kind: 'kasus', title: 'Semua "aman", pesan tetap hilang saat listrik padam',
            body: `<p>Sebuah tim sudah menyetel queue durable dan <code>delivery_mode = 2</code>, lalu yakin pesan mereka aman. Saat pemadaman listrik mendadak, sekitar 800 pesan hilang.</p>
<p>Penyebabnya: mereka tidak memakai publisher confirms. RabbitMQ menulis pesan persistent ke disk secara asinkron — ada jendela beberapa ratus milidetik antara "pesan diterima" dan "pesan benar-benar ada di disk". Publisher confirm justru dirancang untuk menutup jendela itu: broker baru mengirim konfirmasi setelah pesan aman.</p>
<p>Producer mereka mengira semuanya terkirim karena <code>publish()</code> tidak pernah melempar error. Perbaikannya satu perubahan: memakai <code>createConfirmChannel()</code> dan menunggu konfirmasi sebelum menandai pesanan sebagai terkirim di basis data.</p>`
        }
    ],
    quiz: [
        {
            q: 'Queue <code>durable=true</code> tetapi pesan dikirim dengan <code>delivery_mode=1</code>. Apa yang terjadi setelah broker restart?',
            opts: [
                'Semua pesan selamat',
                'Queue kembali ada tetapi kosong',
                'Queue ikut hilang',
                'Pesan dipindahkan ke DLQ'
            ],
            a: 1,
            exp: '<code>durable</code> hanya menjamin definisi queue-nya bertahan. Isi queue baru bertahan bila pesannya sendiri persistent (<code>delivery_mode=2</code>).'
        },
        {
            q: 'Kenapa transaksi AMQP (<code>tx.select</code>) sebaiknya dihindari?',
            opts: [
                'Karena sudah dihapus dari protokol',
                'Karena setiap commit memaksa fsync sinkron sehingga throughput anjlok drastis',
                'Karena tidak bisa dipakai dengan queue durable',
                'Karena hanya bekerja pada satu node'
            ],
            a: 1,
            exp: 'Transaksi AMQP membuat throughput turun hingga sekitar seratus kali lipat. Publisher confirms memberi jaminan setara untuk kebutuhan praktis dengan biaya jauh lebih rendah.'
        },
        {
            q: 'Nilai <code>overflow</code> mana yang tepat untuk queue berisi pekerjaan yang tidak boleh hilang?',
            opts: ['<code>drop-head</code>', '<code>reject-publish</code>', 'Tanpa batas sama sekali', '<code>drop-tail</code>'],
            a: 1,
            exp: '<code>reject-publish</code> menolak pesan baru dan memberi error ke producer, sehingga producer tahu dan bisa mengambil tindakan. <code>drop-head</code> justru membuang pesan lama secara diam-diam.'
        }
    ]
},

/* ---------------------------------------------------------------- 7 ----- */
{
    id: 7,
    cat: '3 · Keandalan',
    title: 'Dead Letter Exchange, TTL, dan Retry Berjenjang',
    level: 'Lanjut', dur: '25 mnt',
    tags: ['dlx', 'dlq', 'ttl', 'retry', 'backoff', 'poison message'],
    desc: 'Membangun mekanisme percobaan ulang yang tidak pernah berputar tanpa henti, dan tempat pembuangan akhir yang benar-benar bisa ditindaklanjuti.',
    theory: `
<h2>Kapan Pesan Menjadi "Dead Letter"</h2>
<p>Sebuah pesan dikirim ke <strong>dead letter exchange</strong> bila salah satu dari tiga hal terjadi:</p>
<pre data-lang="text" data-file="tiga pemicu">1. Ditolak dengan requeue=false
     nack(msg, false, false)  atau  reject(msg, false)

2. Kedaluwarsa (TTL habis)
     dari x-message-ttl pada queue, atau expiration pada pesan

3. Queue penuh (overflow) dengan kebijakan reject-publish-dlx
     atau pesan terdorong keluar oleh drop-head

Tambahan pada quorum queue:
4. Melewati x-delivery-limit  → otomatis di-dead-letter</pre>

<h3>Menyiapkan DLX</h3>
<pre data-lang="bash" data-file="topologi DLX dasar">RA="rabbitmqadmin -u admin -p rahasia"

# tempat pembuangan akhir
$RA declare exchange name=pesanan.dlx type=direct durable=true
$RA declare queue    name=pesanan.email.dlq durable=true
$RA declare binding  source=pesanan.dlx destination=pesanan.email.dlq \\
                     routing_key=pesanan.email

# queue kerja yang menunjuk ke DLX
$RA declare queue name=pesanan.email durable=true arguments='{
  "x-queue-type": "quorum",
  "x-dead-letter-exchange": "pesanan.dlx",
  "x-dead-letter-routing-key": "pesanan.email",
  "x-delivery-limit": 5
}'</pre>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Tanpa <code>x-dead-letter-routing-key</code>, routing key asli dipertahankan</div>
    <p>Bila tidak diset, pesan masuk ke DLX dengan routing key aslinya — misalnya <code>pesanan.jakarta.dibuat</code>. Bila DLX Anda bertipe direct dan bindingnya bernama <code>pesanan.email</code>, tidak ada yang cocok dan pesan <strong>hilang untuk kedua kalinya</strong>.</p>
    <p>Selalu setel routing key DLX secara eksplisit, atau gunakan DLX bertipe fanout agar apa pun routing key-nya tetap tertangkap.</p>
</div>

<h3>Header yang Ditambahkan Broker</h3>
<p>Saat sebuah pesan di-dead-letter, RabbitMQ menyisipkan header <code>x-death</code> yang berisi riwayat lengkapnya — informasi paling berharga saat menyelidiki isi DLQ.</p>
<pre data-lang="json" data-file="header x-death">{
  "x-death": [
    {
      "count": 3,
      "reason": "rejected",
      "queue": "pesanan.email",
      "exchange": "pesanan",
      "routing-keys": ["pesanan.jakarta.dibuat"],
      "time": "2026-07-28T09:14:22Z"
    }
  ],
  "x-first-death-reason": "rejected",
  "x-first-death-queue": "pesanan.email",
  "x-first-death-exchange": "pesanan"
}</pre>
<p><code>reason</code> bernilai <code>rejected</code>, <code>expired</code>, <code>maxlen</code>, atau <code>delivery_limit</code>. Ini langsung memberi tahu Anda <em>kenapa</em> pesan berakhir di sini.</p>

<h3>Pola Retry dengan Backoff Berjenjang</h3>
<p>Ini pola paling berguna dan paling sering salah diterapkan. Idenya: kegagalan sementara diberi kesempatan lagi setelah jeda yang makin panjang, tetapi jumlah percobaannya terbatas.</p>
<pre data-lang="text" data-file="arsitektur retry">                    gagal (nack requeue=false)
  pesanan.email ─────────────────────────> pesanan.dlx
       ▲                                        │ rk = retry.5s
       │                                        ▼
       │                              ┌──────────────────────┐
       │   TTL habis, dead-letter     │ retry.5s             │
       └──────────────────────────────│ x-message-ttl: 5000  │
       │                              │ DLX → pesanan (asal) │
       │                              └──────────────────────┘
       │                                        │ gagal lagi
       │                                        ▼ rk = retry.30s
       │                              ┌──────────────────────┐
       └──────────────────────────────│ retry.30s (30 detik) │
                                      └──────────────────────┘
                                                │ gagal lagi
                                                ▼ rk = retry.5m
                                      ┌──────────────────────┐
                                      │ retry.5m  (5 menit)  │
                                      └──────────────────────┘
                                                │ masih gagal
                                                ▼
                                      ┌──────────────────────┐
                                      │ pesanan.email.dlq    │  manusia
                                      │ (tanpa TTL, mati)    │  memeriksa
                                      └──────────────────────┘</pre>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Kunci pola ini: queue retry TIDAK punya konsumer</div>
    <p>Queue <code>retry.5s</code> tidak dikonsumsi siapa pun. Pesan hanya duduk di sana sampai TTL-nya habis, lalu broker sendiri yang memindahkannya kembali ke exchange asal lewat DLX. Penundaan dikerjakan broker, bukan oleh <code>sleep</code> di konsumer Anda — yang akan memblokir worker dan memboroskan koneksi.</p>
</div>

<pre data-lang="bash" data-file="membuat tingkat retry">RA="rabbitmqadmin -u admin -p rahasia"

for tingkat in "5s:5000" "30s:30000" "5m:300000"; do
  nama="\${tingkat%%:*}"; ttl="\${tingkat##*:}"
  $RA declare queue name="retry.$nama" durable=true arguments="{
    \\"x-message-ttl\\": $ttl,
    \\"x-dead-letter-exchange\\": \\"pesanan\\",
    \\"x-dead-letter-routing-key\\": \\"pesanan.jakarta.dibuat\\"
  }"
  $RA declare binding source=pesanan.dlx destination="retry.$nama" \\
                      routing_key="retry.$nama"
done

# DLQ terakhir: tanpa TTL, tanpa DLX — pesan berhenti di sini
$RA declare queue name=pesanan.email.dlq durable=true
$RA declare binding source=pesanan.dlx destination=pesanan.email.dlq \\
                    routing_key=habis</pre>

<pre data-lang="javascript" data-file="konsumer yang memilih tingkat retry">const TINGKAT = ['retry.5s', 'retry.30s', 'retry.5m'];

function percobaanKe(msg) {
  const d = (msg.properties.headers || {})['x-death'];
  if (!Array.isArray(d) || !d.length) return 0;
  return d.reduce((a, x) => a + (x.count || 0), 0);
}

await ch.consume('pesanan.email', async (msg) => {
  if (!msg) return;
  try {
    await proses(JSON.parse(msg.content.toString()));
    ch.ack(msg);
  } catch (e) {
    if (e.permanen) {                       // payload rusak, skema salah
      ch.publish('pesanan.dlx', 'habis', msg.content, msg.properties);
      ch.ack(msg);
      return;
    }
    const n = percobaanKe(msg);
    const tujuan = n < TINGKAT.length ? TINGKAT[n] : 'habis';
    ch.publish('pesanan.dlx', tujuan, msg.content, msg.properties);
    ch.ack(msg);                            // ack pesan lama, salinan sudah pindah
  }
}, { noAck: false });</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ TTL per queue: hanya pesan di KEPALA antrean yang diperiksa</div>
    <p>RabbitMQ mengevaluasi kedaluwarsa dari depan antrean. Bila pesan pertama punya TTL 10 menit dan pesan kedua TTL 5 detik, pesan kedua <strong>tidak</strong> akan kedaluwarsa lebih dulu — ia menunggu giliran di belakang.</p>
    <p>Karena itu pola retry di atas memakai <strong>queue terpisah per tingkat penundaan</strong>, bukan satu queue dengan TTL berbeda per pesan. Semua pesan dalam satu queue retry punya TTL yang sama, sehingga urutannya konsisten.</p>
</div>

<h3>DLQ Harus Bisa Ditindaklanjuti</h3>
<p>DLQ yang tidak pernah dilihat siapa pun sama saja dengan membuang pesan, hanya dengan langkah tambahan. Yang membuatnya berguna:</p>
<ul>
<li><strong>Alert</strong> bila jumlah pesan di DLQ melebihi nol untuk jangka waktu tertentu.</li>
<li><strong>Pemilik yang jelas</strong> — nama queue menyebut tim yang bertanggung jawab.</li>
<li><strong>Alat pemutar ulang</strong> untuk mengembalikan pesan setelah bug diperbaiki.</li>
<li><strong>Retensi</strong> — TTL panjang (misalnya 7 hari), agar DLQ sendiri tidak menjadi sumber alarm disk.</li>
</ul>
<pre data-lang="bash" data-file="memutar ulang isi DLQ">rabbitmqadmin -u admin -p rahasia \\
  move_messages src_queue=pesanan.email.dlq dest_queue=pesanan.email

# atau lewat Shovel sementara, yang bisa dipantau dan dihentikan:
rabbitmqctl set_parameter shovel putar-ulang '{
  "src-protocol": "amqp091",
  "src-uri": "amqp://localhost",
  "src-queue": "pesanan.email.dlq",
  "dest-protocol": "amqp091",
  "dest-uri": "amqp://localhost",
  "dest-queue": "pesanan.email",
  "src-delete-after": "queue-length"
}'</pre>
<p>Perhatikan <code>src-delete-after: queue-length</code> — shovel berhenti sendiri setelah memindahkan pesan yang ada saat ia dimulai, sehingga tidak berputar tanpa henti bila pesan gagal lagi.</p>

<h3>Penundaan Sungguhan: Delayed Message Exchange</h3>
<p>Untuk penundaan yang presisi dan bervariasi per pesan — misalnya "kirim pengingat 24 jam sebelum jatuh tempo" — plugin <code>rabbitmq_delayed_message_exchange</code> lebih tepat daripada rantai TTL.</p>
<pre data-lang="javascript" data-file="delayed exchange">await ch.assertExchange('penjadwal', 'x-delayed-message', {
  durable: true,
  arguments: { 'x-delayed-type': 'topic' }
});

ch.publish('penjadwal', 'pengingat.jatuh-tempo', body, {
  persistent: true,
  headers: { 'x-delay': 86400000 }     // tunda 24 jam
});</pre>
<p>Catatan penting: plugin ini menyimpan pesan tertunda di basis data internal node, bukan di queue. Ia <strong>tidak direplikasi</strong> di cluster — bila node itu hilang, pesan tertunda ikut hilang. Untuk penjadwalan jangka panjang yang kritis, tabel di basis data ditambah scheduler tetap lebih aman.</p>`,
    lab: {
        intro: `
<h3>Praktik: Membangun Rantai Retry Tiga Tingkat</h3>
<p>Buat topologi lengkap, kirim pesan yang selalu gagal, dan amati perjalanannya sampai DLQ.</p>`,
        files: [{
            name: 'retry.sh', lang: 'bash', code: `#!/usr/bin/env bash
set -euo pipefail
RA="rabbitmqadmin -u admin -p rahasia"

$RA declare exchange name=pesanan     type=topic  durable=true
$RA declare exchange name=pesanan.dlx type=direct durable=true

# queue kerja
$RA declare queue name=pesanan.email durable=true arguments='{
  "x-queue-type":"quorum",
  "x-dead-letter-exchange":"pesanan.dlx",
  "x-dead-letter-routing-key":"retry.5s",
  "x-delivery-limit":3
}'
$RA declare binding source=pesanan destination=pesanan.email \\
                    routing_key='pesanan.*.dibuat'

# tingkat penundaan — TIDAK ADA konsumer di sini
$RA declare queue name=retry.5s durable=true arguments='{
  "x-message-ttl":5000,
  "x-dead-letter-exchange":"pesanan",
  "x-dead-letter-routing-key":"pesanan.jakarta.dibuat"
}'
$RA declare binding source=pesanan.dlx destination=retry.5s routing_key=retry.5s

$RA declare queue name=retry.30s durable=true arguments='{
  "x-message-ttl":30000,
  "x-dead-letter-exchange":"pesanan",
  "x-dead-letter-routing-key":"pesanan.jakarta.dibuat"
}'
$RA declare binding source=pesanan.dlx destination=retry.30s routing_key=retry.30s

# pembuangan akhir — tanpa TTL, tanpa DLX
$RA declare queue name=pesanan.email.dlq durable=true
$RA declare binding source=pesanan.dlx destination=pesanan.email.dlq \\
                    routing_key=habis

echo "rantai retry siap."` }],
        steps: [
            { note: 'Bangun topologi retry', cmd: 'bash retry.sh' },
            { note: 'Kirim satu pesan yang akan selalu gagal', cmd: 'rabbitmqadmin publish exchange=pesanan routing_key=pesanan.jakarta.dibuat payload="{\\"rusak\\":true}"' },
            { note: 'Amati perpindahan antar queue retry', cmd: 'rabbitmqctl list_queues name messages' },
            { note: 'Periksa header x-death pada pesan di DLQ', cmd: 'rabbitmqadmin get queue=pesanan.email.dlq ackmode=reject_requeue_true' },
            { note: 'Putar ulang isi DLQ setelah bug diperbaiki', cmd: 'rabbitmqadmin move_messages src_queue=pesanan.email.dlq dest_queue=pesanan.email' }
        ],
        snippets: ['rabbitmqctl list_queues name messages', 'rabbitmqadmin get queue=pesanan.email.dlq ackmode=reject_requeue_true', 'rabbitmqadmin move_messages src_queue=pesanan.email.dlq dest_queue=pesanan.email', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN membuat DLX yang menunjuk balik ke queue asalnya',
            body: `<p>Menyetel DLX sebuah queue agar mengarah langsung kembali ke queue itu sendiri menciptakan loop tak terbatas yang jauh lebih buruk daripada <code>requeue=true</code>: pesan berputar melalui exchange, menghasilkan trafik internal, dan tidak pernah berhenti.</p>
<pre data-lang="text">❌ pesanan.email --DLX--> pesanan (exchange) --binding--> pesanan.email
✅ pesanan.email --DLX--> pesanan.dlx --> retry.5s --TTL--> pesanan --> pesanan.email
   dengan x-delivery-limit sebagai pemutus rantai</pre>
<p>Selalu sertakan pembatas: <code>x-delivery-limit</code> pada quorum queue, atau pemeriksaan <code>x-death</code> di konsumer.</p>`
        },
        {
            kind: 'salah', title: 'Memakai satu queue retry dengan TTL berbeda per pesan',
            body: `<p>Terlihat elegan: satu queue, tiap pesan membawa <code>expiration</code> sendiri. Kenyataannya RabbitMQ hanya memeriksa kedaluwarsa pesan di <strong>kepala antrean</strong>.</p>
<pre data-lang="text">queue retry berisi:
  [pesan A: TTL 10 menit] [pesan B: TTL 5 detik]

Pesan B baru akan kedaluwarsa SETELAH pesan A kedaluwarsa,
yaitu 10 menit kemudian — bukan 5 detik.</pre>
<p>Karena itu pola yang benar adalah satu queue per tingkat penundaan, di mana semua pesan di dalamnya punya TTL identik.</p>`
        },
        {
            kind: 'best', title: 'Pasang alert pada setiap DLQ',
            body: `<p>DLQ tanpa pemantauan adalah tempat sampah, bukan alat operasi. Pesan yang mendarat di sana adalah pekerjaan pelanggan yang gagal — seseorang harus tahu.</p>
<pre data-lang="promql"># dari plugin Prometheus RabbitMQ
sum by (queue) (rabbitmq_queue_messages{queue=~".*\\\\.dlq"}) > 0</pre>
<p>Lengkapi dengan: pemilik yang jelas di nama queue, runbook berisi cara memutar ulang pesan, dan TTL panjang (misalnya 7 hari) agar DLQ sendiri tidak tumbuh tanpa batas.</p>`
        },
        {
            kind: 'kasus', title: 'Satu pesan rusak melumpuhkan antrean selama enam jam',
            body: `<p>Sebuah pesan dengan payload JSON tidak valid masuk ke queue pemrosesan pembayaran. Konsumer melempar exception dan memanggil <code>nack(msg, false, true)</code>.</p>
<p>Pesan kembali ke depan antrean, langsung diambil lagi, gagal lagi — sekitar 8.000 kali per detik. CPU konsumer penuh, log membengkak hingga puluhan gigabyte, dan 400.000 pembayaran sah di belakangnya tidak pernah diproses selama enam jam.</p>
<p>Perbaikan berlapis yang akhirnya diterapkan: quorum queue dengan <code>x-delivery-limit: 5</code> sehingga broker sendiri memutus rantai, DLX untuk menampung pesan rusak, alert pada DLQ, dan validasi skema di konsumer yang langsung mengirim payload tak valid ke DLQ tanpa dicoba ulang sama sekali.</p>`
        }
    ],
    quiz: [
        {
            q: 'Manakah yang <strong>bukan</strong> pemicu pesan masuk ke dead letter exchange?',
            opts: [
                'Ditolak dengan <code>requeue=false</code>',
                'TTL pesan habis',
                'Queue penuh dengan kebijakan overflow',
                'Konsumer memanggil <code>ack</code>'
            ],
            a: 3,
            exp: '<code>ack</code> berarti pesan berhasil diproses dan dihapus dari queue. Pemicu dead letter adalah penolakan tanpa requeue, kedaluwarsa, overflow, atau terlampauinya <code>x-delivery-limit</code>.'
        },
        {
            q: 'Kenapa pola retry memakai queue terpisah untuk setiap tingkat penundaan?',
            opts: [
                'Agar lebih mudah dipantau',
                'Karena TTL hanya dievaluasi pada pesan di kepala antrean',
                'Karena satu queue hanya boleh punya satu DLX',
                'Karena TTL tidak berlaku pada quorum queue'
            ],
            a: 1,
            exp: 'RabbitMQ memeriksa kedaluwarsa dari depan antrean. Pesan ber-TTL pendek di belakang pesan ber-TTL panjang harus menunggu. Queue per tingkat memastikan semua pesan di dalamnya punya TTL yang sama.'
        },
        {
            q: 'Header apa yang berisi riwayat kenapa dan berapa kali sebuah pesan di-dead-letter?',
            opts: ['<code>x-retry-count</code>', '<code>x-death</code>', '<code>x-delivery-limit</code>', '<code>redelivered</code>'],
            a: 1,
            exp: '<code>x-death</code> disisipkan broker dan memuat <code>count</code>, <code>reason</code>, queue asal, exchange, routing key, dan waktu kejadian — informasi utama saat menyelidiki isi DLQ.'
        }
    ]
},

/* ---------------------------------------------------------------- 8 ----- */
{
    id: 8,
    cat: '3 · Keandalan',
    title: 'Quorum Queue, Classic Queue, dan Stream',
    level: 'Lanjut', dur: '22 mnt',
    tags: ['quorum', 'classic', 'stream', 'raft', 'replikasi', 'mirroring'],
    desc: 'Memilih tipe queue yang tepat, dan memahami kenapa classic mirrored queue sudah tidak boleh dipakai lagi.',
    theory: `
<h2>Tiga Tipe Queue di RabbitMQ Modern</h2>
<table>
<thead><tr><th></th><th>Classic</th><th>Quorum</th><th>Stream</th></tr></thead>
<tbody>
<tr><td>Replikasi</td><td>Tidak (mirroring sudah dihapus)</td><td>Raft, ganjil (3/5)</td><td>Ya</td></tr>
<tr><td>Pesan dihapus saat dikonsumsi</td><td>Ya</td><td>Ya</td><td>Tidak — log append-only</td></tr>
<tr><td>Bisa dibaca ulang</td><td>Tidak</td><td>Tidak</td><td>Ya, lewat offset</td></tr>
<tr><td>Antrean sangat panjang</td><td>Kurang baik</td><td>Baik</td><td>Sangat baik</td></tr>
<tr><td>Prioritas pesan</td><td>Ya</td><td>Tidak</td><td>Tidak</td></tr>
<tr><td>Penghitung percobaan</td><td>Tidak</td><td>Ya (<code>x-delivery-limit</code>)</td><td>—</td></tr>
<tr><td>Throughput</td><td>Tertinggi</td><td>Sedang</td><td>Sangat tinggi</td></tr>
<tr><td>Latensi</td><td>Terendah</td><td>Sedikit lebih tinggi</td><td>Rendah</td></tr>
</tbody>
</table>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Classic mirrored queue sudah DIHAPUS</div>
    <p>Fitur <code>ha-mode</code> / classic queue mirroring dinyatakan usang sejak 3.8 dan <strong>dihapus di RabbitMQ 4.0</strong>. Kebijakan lama seperti <code>{"ha-mode":"all"}</code> tidak lagi berfungsi.</p>
    <p>Alasan penghapusannya bukan sekadar kerapian: mirroring memakai algoritma replikasi yang bisa kehilangan data secara diam-diam saat partisi jaringan pulih. Quorum queue memakai Raft, yang punya jaminan konsistensi yang jelas dan teruji.</p>
    <p>Bila Anda masih menjalankan mirrored queue, migrasi ke quorum queue adalah pekerjaan yang tidak bisa ditunda lebih lama.</p>
</div>

<h3>Quorum Queue: Default yang Tepat untuk Hampir Semua Hal</h3>
<pre data-lang="javascript" data-file="deklarasi quorum queue">await ch.assertQueue('pesanan.email', {
  durable: true,                        // WAJIB untuk quorum
  arguments: {
    'x-queue-type': 'quorum',
    'x-quorum-initial-group-size': 3,   // jumlah replika
    'x-delivery-limit': 5,              // penghitung percobaan bawaan
    'x-dead-letter-exchange': 'pesanan.dlx',
    'x-max-length': 500000,
    'x-overflow': 'reject-publish'
  }
});</pre>

<pre data-lang="text" data-file="cara kerja Raft">Cluster 3 node, satu quorum queue:

   node-1 (leader)      node-2 (follower)    node-3 (follower)
        │                      │                    │
   publish masuk               │                    │
        ├──── replikasi ──────>│                    │
        ├──── replikasi ───────────────────────────>│
        │<──── ack ────────────┤                    │
        │                                           │
   2 dari 3 sudah menyimpan = MAYORITAS
        │
   confirm dikirim ke producer ✓

Bila node-1 mati:
   node-2 dan node-3 memilih leader baru dalam beberapa detik.
   Tidak ada pesan yang hilang, karena mayoritas sudah menyimpannya.</pre>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Jumlah node harus ganjil</div>
    <p>Quorum berarti mayoritas. Dengan angka genap, mayoritasnya tidak menguntungkan:</p>
<pre data-lang="text">3 node → mayoritas 2 → tahan 1 node mati  ✅
5 node → mayoritas 3 → tahan 2 node mati  ✅
2 node → mayoritas 2 → tahan 0 node mati  ❌ lebih buruk dari 1 node
4 node → mayoritas 3 → tahan 1 node mati  ❌ sama dengan 3 node, biaya lebih besar</pre>
    <p>Tiga node adalah titik keseimbangan untuk sebagian besar kebutuhan. Lima dipakai bila Anda benar-benar perlu bertahan dari dua kegagalan bersamaan.</p>
</div>

<h3>Yang Tidak Dimiliki Quorum Queue</h3>
<ul>
<li><strong>Prioritas pesan</strong> (<code>x-max-priority</code>) — tidak didukung. Bila benar-benar perlu, pakai queue terpisah per tingkat prioritas, yang umumnya juga lebih mudah dipahami.</li>
<li><strong>TTL per pesan</strong> — hanya TTL per queue yang didukung penuh.</li>
<li><strong>Queue non-durable atau exclusive</strong> — quorum queue selalu durable.</li>
</ul>
<p>Sebagai gantinya, quorum queue memberi <code>x-delivery-limit</code>, yang menghilangkan seluruh kelas bug poison message tanpa kode tambahan apa pun.</p>

<h3>Stream: Ketika Anda Butuh Membaca Ulang</h3>
<pre data-lang="javascript" data-file="stream">await ch.assertQueue('peristiwa.pesanan', {
  durable: true,
  arguments: {
    'x-queue-type': 'stream',
    'x-max-length-bytes': 20_000_000_000,   // 20 GB
    'x-stream-max-segment-size-bytes': 500_000_000,
    'x-max-age': '7D'
  }
});

// konsumer WAJIB menyebutkan titik mulai baca
await ch.prefetch(100);                      // wajib untuk stream
await ch.consume('peristiwa.pesanan', handler, {
  noAck: false,
  arguments: { 'x-stream-offset': 'first' }  // first | last | next
                                             // | angka offset | timestamp
});</pre>
<p>Stream berperilaku seperti log Kafka: pesan tidak dihapus saat dikonsumsi, beberapa konsumer independen bisa membaca dari posisi berbeda, dan data lama dibuang berdasarkan ukuran atau umur, bukan berdasarkan konsumsi.</p>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Cara memilih dalam satu menit</div>
<pre data-lang="text">Butuh pesan tidak boleh hilang saat satu node mati?
  → Quorum queue.  (jawaban untuk mayoritas kasus)

Butuh membaca ulang riwayat, atau beberapa konsumer independen
dengan posisi masing-masing?
  → Stream.

Butuh prioritas pesan, atau queue sementara yang hilang saat
koneksi putus (mis. balasan RPC)?
  → Classic queue.

Butuh throughput maksimum dan pesan boleh hilang?
  → Classic queue, transient.</pre>
</div>

<h3>Migrasi dari Mirrored ke Quorum</h3>
<p>Tipe queue tidak bisa diubah di tempat — queue harus dibuat ulang. Prosedur tanpa kehilangan pesan:</p>
<pre data-lang="bash" data-file="prosedur migrasi"># 1. buat queue baru bertipe quorum, nama berbeda
rabbitmqadmin declare queue name=pesanan.email.v2 durable=true \\
  arguments='{"x-queue-type":"quorum","x-delivery-limit":5}'

# 2. pasang binding yang sama
rabbitmqadmin declare binding source=pesanan \\
  destination=pesanan.email.v2 routing_key='pesanan.*.dibuat'

# 3. hentikan konsumer lama; biarkan queue lama dihabiskan
#    (atau pindahkan sisanya dengan shovel)
rabbitmqctl set_parameter shovel migrasi '{
  "src-protocol":"amqp091","src-uri":"amqp://localhost",
  "src-queue":"pesanan.email",
  "dest-protocol":"amqp091","dest-uri":"amqp://localhost",
  "dest-queue":"pesanan.email.v2",
  "src-delete-after":"queue-length"}'

# 4. arahkan konsumer ke queue baru, verifikasi
# 5. hapus binding dan queue lama
rabbitmqadmin delete binding source=pesanan \\
  destination_type=queue destination=pesanan.email \\
  properties_key='pesanan.*.dibuat'
rabbitmqadmin delete queue name=pesanan.email</pre>
<p>Alternatif yang lebih rapi bila Anda bisa menerima jeda singkat: setel <code>default_queue_type = quorum</code>, hentikan producer sebentar, habiskan queue lama, hapus, lalu biarkan aplikasi mendeklarasikan ulang saat start.</p>`,
    lab: {
        intro: `
<h3>Praktik: Membandingkan Perilaku Quorum dan Classic</h3>
<p>Buat keduanya, lihat perbedaan atributnya, dan uji <code>x-delivery-limit</code>.</p>`,
        files: [{
            name: 'tipe-queue.sh', lang: 'bash', code: `#!/usr/bin/env bash
set -euo pipefail
RA="rabbitmqadmin -u admin -p rahasia"

echo "== classic =="
$RA declare queue name=uji.classic durable=true \\
  arguments='{"x-queue-type":"classic","x-max-priority":10}'

echo "== quorum =="
$RA declare queue name=uji.quorum durable=true \\
  arguments='{"x-queue-type":"quorum",
              "x-quorum-initial-group-size":3,
              "x-delivery-limit":3,
              "x-dead-letter-exchange":"pesanan.dlx"}'

echo "== stream =="
$RA declare queue name=uji.stream durable=true \\
  arguments='{"x-queue-type":"stream",
              "x-max-age":"7D",
              "x-max-length-bytes":1000000000}'

echo
echo "== perbandingan =="
rabbitmqctl list_queues name type durable messages

echo
echo "Catatan: mencoba x-max-priority pada quorum queue akan DITOLAK —"
echo "quorum queue tidak mendukung prioritas pesan."` }],
        steps: [
            { note: 'Buat ketiga tipe queue', cmd: 'bash tipe-queue.sh' },
            { note: 'Bandingkan tipe dan atributnya', cmd: 'rabbitmqctl list_queues name type durable messages' },
            { note: 'Lihat status replikasi quorum queue', cmd: 'rabbitmqctl quorum_status uji.quorum' },
            { note: 'Buktikan quorum queue menolak prioritas', cmd: 'rabbitmqadmin declare queue name=uji.salah durable=true arguments=\'{"x-queue-type":"quorum","x-max-priority":10}\'' },
            { note: 'Cek apakah masih ada mirrored queue warisan', cmd: 'rabbitmqctl list_policies' }
        ],
        snippets: ['rabbitmqctl list_queues name type durable messages', 'rabbitmqctl quorum_status uji.quorum', 'rabbitmqctl list_policies', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN menjalankan quorum queue di cluster dengan jumlah node genap',
            body: `<p>Quorum memerlukan mayoritas. Dengan dua node, mayoritasnya adalah dua — artinya matinya satu node saja sudah membuat queue tidak bisa menerima publish maupun melayani konsumer.</p>
<pre data-lang="text">2 node: mayoritas 2 → toleransi 0 kegagalan (lebih buruk dari node tunggal)
3 node: mayoritas 2 → toleransi 1 kegagalan ✅
4 node: mayoritas 3 → toleransi 1 kegagalan (sama dengan 3, biaya lebih mahal)
5 node: mayoritas 3 → toleransi 2 kegagalan ✅</pre>
<p>Bila hanya punya dua server, satu node tunggal dengan backup yang baik lebih jujur daripada cluster dua node yang memberi rasa aman palsu.</p>`
        },
        {
            kind: 'salah', title: 'Masih memakai kebijakan <code>ha-mode</code>',
            body: `<p>Kebijakan seperti <code>{"ha-mode":"all","ha-sync-mode":"automatic"}</code> berasal dari era classic mirrored queue. Fitur itu dihapus di RabbitMQ 4.0, sehingga kebijakannya kini tidak melakukan apa pun.</p>
<p>Bahayanya adalah rasa aman palsu: kebijakan masih terlihat di <code>list_policies</code>, orang mengira queue mereka tereplikasi, padahal sama sekali tidak. Periksa dengan <code>rabbitmqctl list_queues name type</code> — bila hasilnya <code>classic</code> pada sistem yang seharusnya HA, Anda punya pekerjaan migrasi.</p>`
        },
        {
            kind: 'best', title: 'Jadikan quorum sebagai tipe queue default',
            body: `<p>Menyetel default di broker menghindarkan tim dari kelupaan yang berulang.</p>
<pre data-lang="ini" data-file="rabbitmq.conf">default_queue_type = quorum</pre>
<p>Dengan ini, queue yang dideklarasikan tanpa <code>x-queue-type</code> otomatis menjadi quorum. Aplikasi yang memang membutuhkan classic queue — misalnya queue balasan RPC yang bersifat sementara — tetap bisa memintanya secara eksplisit.</p>
<p>Sertakan juga <code>x-delivery-limit</code> di template deklarasi standar tim: satu argumen yang menghilangkan seluruh kelas bug poison message.</p>`
        },
        {
            kind: 'kasus', title: 'Partisi jaringan membuat 12.000 pesan hilang tanpa jejak',
            body: `<p>Sebuah cluster tiga node menjalankan classic mirrored queue dengan <code>ha-mode: all</code>. Sebuah gangguan switch memisahkan satu node dari dua node lainnya selama sekitar empat menit.</p>
<p>Producer yang terhubung ke node terisolasi terus mengirim pesan dan menerima konfirmasi. Saat partisi pulih, RabbitMQ menerapkan strategi <code>autoheal</code>: node minoritas di-restart dan <strong>seluruh isi mirror-nya dibuang</strong>. Sekitar 12.000 pesan yang sudah dikonfirmasi ke producer lenyap tanpa satu pun error di sisi aplikasi.</p>
<p>Dengan quorum queue, hal ini tidak mungkin terjadi: node minoritas menolak menerima publish karena tidak bisa mencapai mayoritas, sehingga producer mendapat kegagalan yang jujur dan bisa mencoba lagi. Inilah alasan sebenarnya mirroring dihapus.</p>`
        }
    ],
    quiz: [
        {
            q: 'Berapa node yang dianjurkan untuk cluster dengan quorum queue?',
            opts: ['2', '3 atau 5 (ganjil)', '4', 'Berapa pun sama saja'],
            a: 1,
            exp: 'Quorum memerlukan mayoritas. Jumlah ganjil memaksimalkan toleransi kegagalan per node: 3 node tahan 1 kegagalan, 5 node tahan 2. Jumlah genap tidak menambah toleransi tetapi menambah biaya.'
        },
        {
            q: 'Fitur apa yang dimiliki classic queue tetapi TIDAK dimiliki quorum queue?',
            opts: [
                'Durability',
                'Prioritas pesan (<code>x-max-priority</code>)',
                'Dead letter exchange',
                'Batas panjang antrean'
            ],
            a: 1,
            exp: 'Quorum queue tidak mendukung prioritas pesan. Alternatifnya adalah queue terpisah per tingkat prioritas, yang biasanya juga lebih mudah dipantau dan dipahami.'
        },
        {
            q: 'Tipe queue apa yang tepat bila beberapa konsumer independen perlu membaca riwayat peristiwa yang sama dari posisi berbeda?',
            opts: ['Classic', 'Quorum', 'Stream', 'Classic dengan mirroring'],
            a: 2,
            exp: 'Stream adalah log append-only: pesan tidak dihapus saat dikonsumsi, dan tiap konsumer memegang offset sendiri sehingga bisa membaca ulang dari titik mana pun.'
        }
    ]
}

];

/* ==========================================================================
   RABBITMQ — BAGIAN C (Pola, Klien, Cluster, Keamanan, Monitoring, Operasi)
   ========================================================================== */

const RMQ_MOD_C = [

/* ---------------------------------------------------------------- 9 ----- */
{
    id: 9,
    cat: '4 · Pola Aplikasi',
    title: 'Pola Integrasi: Work Queue, Pub/Sub, RPC, dan Outbox',
    level: 'Lanjut', dur: '25 mnt',
    tags: ['pola', 'work queue', 'pubsub', 'rpc', 'outbox', 'saga', 'competing consumer'],
    desc: 'Empat pola yang menutupi hampir seluruh kebutuhan nyata, termasuk cara benar menghubungkan basis data dengan broker.',
    theory: `
<h2>Pola 1 — Work Queue (Competing Consumers)</h2>
<p>Pola paling umum: pekerjaan berat dipindahkan dari jalur request agar pengguna tidak menunggu.</p>
<pre data-lang="text" data-file="work queue">HTTP request ──> API ──publish──> [ queue ] ──> worker 1
                  │                     ├──────> worker 2
                  └── balas 202          └──────> worker 3
                      "sedang diproses"

Menambah kapasitas = menambah worker pada queue yang sama.</pre>
<div class="callout callout-info">
    <div class="callout-title">💡 Kembalikan identitas pekerjaan, bukan hasilnya</div>
    <p>API membalas <code>202 Accepted</code> beserta <code>job_id</code>. Klien memantau statusnya lewat polling atau webhook. Jangan membuat HTTP request menunggu selesainya pekerjaan asinkron — itu menghapus seluruh manfaat pemisahannya.</p>
</div>

<h2>Pola 2 — Publish/Subscribe</h2>
<p>Satu peristiwa, banyak pihak yang bereaksi secara independen. Kunci pola ini: <strong>producer tidak tahu siapa yang mendengarkan</strong>.</p>
<pre data-lang="text" data-file="pub/sub">                          ┌──> [ queue: kirim-email ]   ──> layanan email
publish "pesanan.dibuat" ─┼──> [ queue: kurangi-stok ]  ──> layanan gudang
     ke exchange topic    ├──> [ queue: catat-audit ]   ──> layanan audit
                          └──> [ queue: analitik ]      ──> data pipeline

Menambah reaksi baru = menambah queue + binding.
Kode producer TIDAK berubah sama sekali.</pre>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Event vs Command — bedakan sejak awal</div>
<pre data-lang="text">EVENT   : "pesanan.dibuat"       (lampau, fakta)
  → boleh punya nol atau banyak pendengar
  → producer tidak peduli siapa yang bereaksi
  → exchange topic/fanout

COMMAND : "kirim.email"          (perintah, imperatif)
  → tepat satu pemroses
  → pengirim mengharapkan sesuatu dilakukan
  → exchange direct, satu queue</pre>
    <p>Mencampur keduanya menghasilkan sistem yang membingungkan: orang menambahkan konsumer kedua pada sebuah command dan tiba-tiba email terkirim dua kali.</p>
</div>

<h2>Pola 3 — RPC (Request/Reply)</h2>
<p>Kadang Anda memang butuh jawaban. RabbitMQ mendukungnya lewat <code>reply_to</code> dan <code>correlation_id</code>.</p>
<pre data-lang="javascript" data-file="klien RPC">const { randomUUID } = require('crypto');

class KlienRPC {
  async siapkan(ch) {
    this.ch = ch;
    this.menunggu = new Map();

    // pseudo-queue balasan: tanpa deklarasi, tanpa biaya
    await ch.consume('amq.rabbitmq.reply-to', (msg) => {
      const id = msg.properties.correlationId;
      const p = this.menunggu.get(id);
      if (!p) return;                         // balasan telat, abaikan
      this.menunggu.delete(id);
      clearTimeout(p.timer);
      p.resolve(JSON.parse(msg.content.toString()));
    }, { noAck: true });                      // direct reply-to WAJIB noAck
  }

  panggil(rk, payload, timeoutMs = 5000) {
    const id = randomUUID();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.menunggu.delete(id);
        reject(new Error('RPC timeout: ' + rk));
      }, timeoutMs);

      this.menunggu.set(id, { resolve, timer });

      this.ch.publish('rpc', rk, Buffer.from(JSON.stringify(payload)), {
        correlationId: id,
        replyTo: 'amq.rabbitmq.reply-to',
        expiration: String(timeoutMs)         // pesan mati bila tak terlayani
      });
    });
  }
}</pre>
<pre data-lang="javascript" data-file="server RPC">await ch.prefetch(10);
await ch.consume('rpc.hitung-ongkir', async (msg) => {
  let hasil;
  try {
    hasil = { ok: true, data: await hitungOngkir(JSON.parse(msg.content)) };
  } catch (e) {
    hasil = { ok: false, error: e.message };  // balas error, jangan diam
  }
  ch.publish('', msg.properties.replyTo, Buffer.from(JSON.stringify(hasil)), {
    correlationId: msg.properties.correlationId
  });
  ch.ack(msg);
}, { noAck: false });</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ RPC lewat broker sering merupakan pilihan yang salah</div>
    <p>Bila Anda menunggu jawaban secara sinkron, Anda sudah kehilangan hampir semua manfaat pesan asinkron — dan menambah satu komponen yang bisa gagal di tengah jalur.</p>
<pre data-lang="text">RPC lewat RabbitMQ masuk akal bila:
  ✓ butuh load balancing otomatis ke banyak pemroses
  ✓ pemroses berada di jaringan yang tidak bisa dihubungi langsung
  ✓ sudah ada infrastruktur RabbitMQ dan HTTP tidak tersedia

Gunakan HTTP/gRPC bila:
  ✓ hubungan sederhana satu ke satu
  ✓ butuh latensi serendah mungkin
  ✓ butuh streaming atau status kode yang kaya</pre>
    <p>Selalu pasang timeout dan <code>expiration</code> pada pesan RPC. Tanpa keduanya, permintaan yang tidak terlayani menumpuk selamanya dan klien menggantung.</p>
</div>

<h2>Pola 4 — Transactional Outbox</h2>
<p>Ini pola terpenting yang paling sering diabaikan. Masalahnya: <strong>Anda tidak bisa melakukan commit basis data dan publish ke broker secara atomik</strong>.</p>
<pre data-lang="text" data-file="masalah dual write">❌ Urutan A:
   BEGIN; INSERT pesanan; COMMIT;
   publish("pesanan.dibuat")     ← proses mati di sini
   → pesanan ada di DB, tetapi TIDAK ADA yang tahu. Stok tak berkurang.

❌ Urutan B:
   publish("pesanan.dibuat")
   BEGIN; INSERT pesanan; COMMIT;   ← gagal di sini
   → email terkirim untuk pesanan yang tidak pernah ada.</pre>

<pre data-lang="sql" data-file="solusi: tabel outbox">CREATE TABLE outbox (
  id             BIGSERIAL PRIMARY KEY,
  agregat_tipe   TEXT        NOT NULL,
  agregat_id     TEXT        NOT NULL,
  routing_key    TEXT        NOT NULL,
  payload        JSONB       NOT NULL,
  dibuat_pada    TIMESTAMPTZ NOT NULL DEFAULT now(),
  dikirim_pada   TIMESTAMPTZ
);

CREATE INDEX outbox_belum_terkirim
  ON outbox (id) WHERE dikirim_pada IS NULL;</pre>

<pre data-lang="javascript" data-file="penulisan atomik">// 1. satu transaksi: data bisnis DAN niat mengirim pesan
await db.transaction(async (trx) => {
  const pesanan = await trx('pesanan').insert(dataPesanan).returning('*');
  await trx('outbox').insert({
    agregat_tipe: 'pesanan',
    agregat_id:   pesanan.id,
    routing_key:  'pesanan.jakarta.dibuat',
    payload:      JSON.stringify(pesanan)
  });
});
// keduanya berhasil, atau keduanya batal. Tidak ada keadaan setengah.

// 2. proses terpisah memindahkan outbox ke RabbitMQ
async function pengirimOutbox() {
  const baris = await db('outbox')
    .whereNull('dikirim_pada')
    .orderBy('id')
    .limit(200)
    .forUpdate().skipLocked();        // aman untuk banyak instance

  for (const r of baris) {
    await publishDenganConfirm('pesanan', r.routing_key, r.payload, {
      messageId: String(r.id)          // kunci deduplikasi konsumer
    });
    await db('outbox').where({ id: r.id }).update({ dikirim_pada: db.fn.now() });
  }
}</pre>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Konsekuensi yang harus diterima</div>
    <p>Outbox memberi jaminan <strong>at-least-once</strong>, bukan exactly-once: bila proses mati setelah publish berhasil tetapi sebelum menandai <code>dikirim_pada</code>, pesan itu akan dikirim dua kali.</p>
    <p>Itu bukan kelemahan pola ini, melainkan sifat sistem terdistribusi. Karena itu konsumer <strong>wajib idempoten</strong> — dibahas di bab berikutnya. Dengan <code>message_id</code> dari <code>outbox.id</code>, deduplikasi menjadi sangat sederhana.</p>
</div>

<h3>Saga: Transaksi Lintas Layanan</h3>
<p>Ketika satu proses bisnis melibatkan beberapa layanan, tidak ada transaksi global. Yang dipakai adalah rangkaian langkah, masing-masing dengan langkah pembatalnya.</p>
<pre data-lang="text" data-file="saga koreografi">pesanan.dibuat
   └──> layanan stok: kurangi stok
          ├── berhasil ──> stok.dikurangi
          │                   └──> layanan bayar: tagih
          │                          ├── berhasil ──> pembayaran.berhasil
          │                          │                  └──> pesanan.dikonfirmasi
          │                          └── gagal ────> pembayaran.gagal
          │                                            └──> stok.kembalikan (kompensasi)
          │                                                   └──> pesanan.dibatalkan
          └── gagal ─────> stok.habis
                             └──> pesanan.dibatalkan</pre>
<p>Setiap langkah wajib punya kompensasi yang idempoten dan aman dijalankan berulang. Untuk alur dengan lebih dari empat langkah, koreografi menjadi sulit dilacak — pertimbangkan orkestrasi dengan satu koordinator yang menyimpan state saga di basis data.</p>`,
    lab: {
        intro: `
<h3>Praktik: Outbox Sederhana yang Berjalan</h3>
<p>Buktikan bahwa pesan tetap terkirim walaupun broker sempat mati.</p>`,
        files: [{
            name: 'outbox.sql', lang: 'sql', code: `CREATE TABLE IF NOT EXISTS outbox (
  id           BIGSERIAL PRIMARY KEY,
  routing_key  TEXT        NOT NULL,
  payload      JSONB       NOT NULL,
  dibuat_pada  TIMESTAMPTZ NOT NULL DEFAULT now(),
  dikirim_pada TIMESTAMPTZ,
  percobaan    INT         NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS outbox_belum_terkirim
  ON outbox (id) WHERE dikirim_pada IS NULL;

-- pengambilan aman untuk banyak instance pengirim
-- SELECT * FROM outbox
--  WHERE dikirim_pada IS NULL
--  ORDER BY id LIMIT 200
--    FOR UPDATE SKIP LOCKED;

-- bersihkan yang sudah lama terkirim (jalankan harian)
-- DELETE FROM outbox
--  WHERE dikirim_pada IS NOT NULL
--    AND dikirim_pada < now() - INTERVAL '7 days';` }],
        steps: [
            { note: 'Siapkan exchange tujuan', cmd: 'rabbitmqadmin declare exchange name=pesanan type=topic durable=true' },
            { note: 'Matikan broker untuk mensimulasikan gangguan', cmd: 'docker compose stop rabbitmq' },
            { note: 'Aplikasi tetap menulis ke DB dan outbox (tidak gagal)', cmd: 'node buat-pesanan.js' },
            { note: 'Nyalakan broker kembali', cmd: 'docker compose start rabbitmq' },
            { note: 'Pengirim outbox menyusul mengirim semuanya', cmd: 'rabbitmqctl list_queues name messages' }
        ],
        snippets: ['rabbitmqctl list_queues name messages', 'rabbitmqctl list_exchanges', 'rabbitmq-diagnostics ping', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN melakukan publish di dalam transaksi basis data',
            body: `<p>Terlihat seperti solusi atomik, sebenarnya bukan. Broker tidak ikut dalam transaksi basis data Anda.</p>
<pre data-lang="javascript">❌ await db.transaction(async (trx) => {
     await trx('pesanan').insert(data);
     await ch.publish(...);        // berhasil…
   });                              // …lalu transaksi ROLLBACK
   // Pesan sudah terlanjur terkirim untuk pesanan yang tidak pernah ada.</pre>
<p>Selain itu, publish yang lambat menahan transaksi tetap terbuka, memegang lock basis data lebih lama dari seharusnya. Pakai pola outbox.</p>`
        },
        {
            kind: 'salah', title: 'Memakai RPC untuk hal yang seharusnya asinkron',
            body: `<p>Pola "kirim pesan lalu tunggu balasan" sering dipakai hanya karena RabbitMQ sudah ada. Hasilnya adalah HTTP request yang menunggu, dengan satu komponen tambahan yang bisa gagal.</p>
<p>Tanyakan: apakah pemanggil benar-benar perlu jawabannya <em>sekarang</em>? Bila jawabannya "sebenarnya cukup tahu bahwa pekerjaan diterima", pakai work queue dengan <code>202 Accepted</code> dan mekanisme pemantauan status.</p>`
        },
        {
            kind: 'best', title: 'Beri nama routing key sebagai fakta, bukan perintah',
            body: `<p>Nama menentukan cara orang berpikir tentang sistem Anda.</p>
<pre data-lang="text">✅ pesanan.dibuat        fakta — siapa pun boleh bereaksi
✅ pembayaran.berhasil   fakta
❌ kirim.email           perintah — mengunci satu penerima
❌ proses.pesanan        perintah yang menyamar sebagai event</pre>
<p>Dengan penamaan berbasis fakta, menambah konsumer baru tidak memerlukan perubahan apa pun di sisi producer — dan inilah inti dari arsitektur berbasis peristiwa.</p>`
        },
        {
            kind: 'kasus', title: 'Stok tidak pernah berkurang untuk 3% pesanan',
            body: `<p>Sebuah e-commerce menemukan bahwa sekitar 3% pesanan tidak pernah mengurangi stok. Tidak ada error di log, tidak ada pesan di DLQ, dan kode terlihat benar saat dibaca.</p>
<p>Penyebabnya adalah dual write: aplikasi melakukan commit ke basis data, lalu mem-publish. Setiap kali pod di-restart oleh autoscaler tepat di antara kedua operasi itu, pesannya hilang. Karena restart terjadi paling sering saat trafik tinggi, kehilangan justru terkonsentrasi di saat paling merugikan.</p>
<p>Setelah beralih ke pola outbox, angkanya menjadi nol — dan sebagai bonus, sistem menjadi tahan terhadap RabbitMQ yang sedang mati, karena pesan menunggu dengan aman di tabel outbox.</p>`
        }
    ],
    quiz: [
        {
            q: 'Kenapa pola transactional outbox diperlukan?',
            opts: [
                'Untuk mempercepat publish',
                'Karena commit basis data dan publish ke broker tidak bisa dilakukan secara atomik',
                'Untuk mengurangi jumlah koneksi',
                'Karena RabbitMQ tidak mendukung transaksi'
            ],
            a: 1,
            exp: 'Dua sistem berbeda tidak bisa di-commit bersama tanpa two-phase commit. Outbox memindahkan "niat mengirim pesan" ke dalam transaksi basis data yang sama, lalu proses terpisah yang mengirimkannya.'
        },
        {
            q: 'Jaminan pengiriman apa yang diberikan pola outbox?',
            opts: ['Exactly-once', 'At-least-once', 'At-most-once', 'Best effort'],
            a: 1,
            exp: 'Bila proses mati setelah publish berhasil tetapi sebelum menandai baris outbox terkirim, pesan dikirim ulang. Karena itu konsumer harus idempoten.'
        },
        {
            q: 'Manakah penamaan routing key yang tepat untuk arsitektur berbasis peristiwa?',
            opts: [
                '<code>kirim.email</code>',
                '<code>pesanan.dibuat</code>',
                '<code>proses.pembayaran</code>',
                '<code>update.stok</code>'
            ],
            a: 1,
            exp: 'Event menyatakan fakta yang sudah terjadi dalam bentuk lampau, sehingga siapa pun boleh bereaksi tanpa producer perlu tahu. Nama imperatif mengunci satu penerima dan menyulitkan penambahan konsumer baru.'
        }
    ]
},

/* ---------------------------------------------------------------- 10 ---- */
{
    id: 10,
    cat: '4 · Pola Aplikasi',
    title: 'Idempotensi, Urutan Pesan, dan Mitos Exactly-Once',
    level: 'Lanjut', dur: '22 mnt',
    tags: ['idempoten', 'deduplikasi', 'ordering', 'exactly-once', 'at-least-once'],
    desc: 'Menerima kenyataan bahwa pesan bisa datang dua kali dan tidak berurutan, lalu merancang konsumer yang tetap benar.',
    theory: `
<h2>Exactly-Once Tidak Ada — dan Itu Bukan Masalah</h2>
<p>Tidak ada sistem pesan terdistribusi yang bisa menjamin setiap pesan diproses tepat satu kali, karena selalu ada celah antara "pekerjaan selesai" dan "konfirmasi tercatat".</p>
<pre data-lang="text" data-file="celah yang tidak bisa dihilangkan">Konsumer:  proses(pesan)  ──✓ berhasil
                          ← proses MATI di sini
           ack(pesan)     ──✗ tidak pernah terkirim

Broker tidak menerima ack → mengirim ulang → pekerjaan dilakukan dua kali.

Membalik urutannya juga tidak menolong:
           ack(pesan)     ──✓
                          ← proses MATI di sini
           proses(pesan)  ──✗ tidak pernah dijalankan
→ pekerjaan hilang.</pre>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Yang benar-benar bisa dicapai</div>
    <p><strong>At-least-once delivery + idempotent processing = efek exactly-once.</strong></p>
    <p>Pesan boleh datang lima kali; yang penting akibatnya sama seperti datang satu kali. Ini yang dikerjakan sistem produksi sungguhan — termasuk yang mengiklankan "exactly-once", yang sebenarnya melakukan deduplikasi di balik layar.</p>
</div>

<h3>Tiga Cara Membuat Konsumer Idempoten</h3>

<h4>1. Tabel Deduplikasi — Paling Umum</h4>
<pre data-lang="sql" data-file="tabel dedup">CREATE TABLE pesan_diproses (
  message_id   TEXT PRIMARY KEY,
  diproses_pada TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX pesan_diproses_waktu ON pesan_diproses (diproses_pada);

-- bersihkan berkala; simpan lebih lama dari TTL pesan terpanjang
DELETE FROM pesan_diproses WHERE diproses_pada < now() - INTERVAL '30 days';</pre>
<pre data-lang="javascript" data-file="konsumer idempoten">await ch.consume('pesanan.email', async (msg) => {
  const id = msg.properties.messageId;
  if (!id) {                                  // kontrak dilanggar producer
    ch.nack(msg, false, false);               // langsung ke DLQ
    return;
  }

  try {
    await db.transaction(async (trx) => {
      // klaim dulu; bila sudah ada, unique violation
      await trx('pesan_diproses').insert({ message_id: id });
      // pekerjaan bisnis DI DALAM transaksi yang sama
      await kirimEmail(trx, JSON.parse(msg.content.toString()));
    });
    ch.ack(msg);
  } catch (e) {
    if (e.code === '23505') {                 // unique_violation
      ch.ack(msg);                            // duplikat: sudah pernah, aman
      return;
    }
    ch.nack(msg, false, false);               // gagal sungguhan → DLX
  }
}, { noAck: false });</pre>
<div class="callout callout-warning">
    <div class="callout-title">⚠️ Klaim dan pekerjaan harus dalam satu transaksi</div>
    <p>Bila Anda mencatat <code>message_id</code> di transaksi terpisah dari pekerjaannya, akan muncul celah baru: proses mati setelah klaim tercatat tetapi sebelum pekerjaan selesai. Pesan dikirim ulang, dilihat sebagai duplikat, lalu di-ack — dan pekerjaannya tidak pernah dilakukan.</p>
</div>

<h4>2. Operasi yang Idempoten Secara Alami</h4>
<pre data-lang="sql" data-file="upsert">-- ❌ tidak idempoten: dijalankan dua kali, stok berkurang dua kali
UPDATE produk SET stok = stok - 1 WHERE id = 'P-1';

-- ✅ idempoten: hasil akhirnya sama berapa kali pun dijalankan
UPDATE produk SET stok = 42 WHERE id = 'P-1';

-- ✅ upsert dengan status
INSERT INTO pesanan (id, status) VALUES ('P-1', 'dikonfirmasi')
ON CONFLICT (id) DO UPDATE SET status = 'dikonfirmasi';

-- ✅ transisi state bersyarat: hanya berlaku sekali
UPDATE pesanan SET status = 'dibayar'
WHERE id = 'P-1' AND status = 'menunggu_bayar';
-- eksekusi kedua mengubah 0 baris</pre>

<h4>3. Kunci Idempotensi ke Sistem Eksternal</h4>
<pre data-lang="javascript" data-file="idempotency key">// banyak API pihak ketiga mendukung ini secara resmi
await stripe.charges.create(
  { amount: 150000, currency: 'idr', source: token },
  { idempotencyKey: msg.properties.messageId }
);
// permintaan kedua dengan kunci sama mengembalikan hasil yang pertama,
// tanpa menagih ulang.</pre>

<h3>Urutan Pesan: Jaminan yang Sempit</h3>
<pre data-lang="text" data-file="apa yang dijamin">DIJAMIN:
  Pesan dari SATU channel, ke SATU queue, dikirim ke SATU konsumer
  akan tiba dalam urutan publish.

TIDAK DIJAMIN, urutan bisa berubah karena:
  • ada lebih dari satu konsumer pada queue yang sama
  • pesan di-requeue (kembali ke antrean, bisa di posisi berbeda)
  • ada beberapa channel atau beberapa producer
  • retry dengan penundaan (pesan yang gagal tertinggal di belakang)
  • quorum queue saat terjadi perpindahan leader</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Satu konsumer demi urutan = tembok skalabilitas</div>
    <p>Menjamin urutan global berarti satu konsumer dengan <code>prefetch=1</code>. Throughput Anda menjadi terbatas pada kecepatan satu proses, dan tidak bisa ditambah dengan cara apa pun.</p>
    <p>Yang biasanya benar-benar dibutuhkan bukan urutan global, melainkan <strong>urutan per entitas</strong>: peristiwa pesanan P-1 harus berurutan, tetapi P-1 dan P-2 boleh diproses bersamaan.</p>
</div>

<h3>Urutan Per Entitas — Consistent Hashing</h3>
<pre data-lang="text" data-file="pola sharding">Plugin: rabbitmq_consistent_hash_exchange

publish(exchange="pesanan-hash", routing_key=&lt;pesanan_id&gt;)
      │
      └── hash(pesanan_id) mod jumlah_binding
              ├──> queue shard-0 ──> konsumer 0
              ├──> queue shard-1 ──> konsumer 1
              └──> queue shard-2 ──> konsumer 2

Semua peristiwa milik satu pesanan_id selalu jatuh ke shard yang sama,
sehingga berurutan — sementara pesanan berbeda diproses paralel.</pre>
<pre data-lang="javascript" data-file="deklarasi">await ch.assertExchange('pesanan-hash', 'x-consistent-hash', {
  durable: true,
  arguments: { 'hash-header': 'x-pesanan-id' }   // atau pakai routing key
});

for (let i = 0; i < 3; i++) {
  await ch.assertQueue('pesanan.shard-' + i, {
    durable: true, arguments: { 'x-queue-type': 'quorum' }
  });
  // bobot binding: "1" berarti porsi yang sama
  await ch.bindQueue('pesanan.shard-' + i, 'pesanan-hash', '1');
}</pre>

<h3>Alternatif Tanpa Plugin: Nomor Urut dan Rekonsiliasi</h3>
<p>Bila sharding tidak memungkinkan, sisipkan nomor urut per entitas ke dalam pesan dan biarkan konsumer menolak pesan yang datang terlambat.</p>
<pre data-lang="sql" data-file="penolakan berbasis versi">UPDATE pesanan
   SET status = $2, versi = $3
 WHERE id = $1 AND versi < $3;
-- pesan lama yang tiba belakangan mengubah 0 baris → diabaikan dengan aman</pre>
<p>Pola ini sekaligus menyelesaikan idempotensi dan urutan dalam satu mekanisme, dan sangat cocok untuk peristiwa yang menyatakan keadaan terkini sebuah entitas.</p>`,
    lab: {
        intro: `
<h3>Praktik: Membuktikan Konsumer Anda Idempoten</h3>
<p>Kirim pesan yang sama tiga kali dan pastikan efeknya hanya satu.</p>`,
        files: [{
            name: 'uji-idempotensi.js', lang: 'javascript', code: `const amqp = require('amqplib');

(async () => {
  const koneksi = await amqp.connect('amqp://admin:rahasia@localhost:5672/');
  const ch = await koneksi.createConfirmChannel();

  const ID = 'uji-dedup-001';                 // message_id SAMA untuk ketiganya
  const body = Buffer.from(JSON.stringify({
    pesanan_id: 'P-1', email: 'ani@contoh.id', total: 150000
  }));

  for (let i = 1; i <= 3; i++) {
    await new Promise((res, rej) =>
      ch.publish('pesanan', 'pesanan.jakarta.dibuat', body, {
        persistent: true,
        messageId: ID,
        headers: { 'x-percobaan-kirim': i }
      }, (e) => e ? rej(e) : res()));
    console.log('kirim ke-' + i + ' dengan messageId ' + ID);
  }

  await ch.close();
  await koneksi.close();

  console.log('\\nSekarang periksa:');
  console.log('  SELECT count(*) FROM email_terkirim WHERE pesanan_id = \\'P-1\\';');
  console.log('  Harus bernilai 1, bukan 3.');
})();` }],
        steps: [
            { note: 'Kirim pesan identik tiga kali', cmd: 'node uji-idempotensi.js' },
            { note: 'Periksa berapa pesan yang masuk queue (harus 3)', cmd: 'rabbitmqctl list_queues name messages' },
            { note: 'Setelah konsumer jalan, cek tabel dedup', cmd: 'psql -c "SELECT count(*) FROM pesan_diproses"' },
            { note: 'Cek efek bisnisnya hanya satu kali', cmd: 'psql -c "SELECT count(*) FROM email_terkirim WHERE pesanan_id = \'P-1\'"' },
            { note: 'Pastikan queue kosong dan tidak ada yang ke DLQ', cmd: 'rabbitmqctl list_queues name messages' }
        ],
        snippets: ['rabbitmqctl list_queues name messages', 'rabbitmqctl list_consumers', 'rabbitmq-diagnostics ping', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN mengandalkan urutan pesan dengan banyak konsumer',
            body: `<p>Begitu ada lebih dari satu konsumer pada sebuah queue, urutan pemrosesan tidak lagi dijamin — konsumer yang lebih cepat akan menyelesaikan pesan yang lebih baru lebih dulu.</p>
<pre data-lang="text">publish: A(t=0) B(t=1) C(t=2)
konsumer-1 ambil A (butuh 3 detik)
konsumer-2 ambil B (butuh 0.1 detik)  ← selesai lebih dulu
konsumer-3 ambil C (butuh 0.1 detik)  ← selesai lebih dulu

Urutan efek: C, B, A</pre>
<p>Bila urutan per entitas memang wajib, gunakan consistent hash exchange atau nomor versi pada pesan. Jangan menyelesaikannya dengan menurunkan jumlah konsumer menjadi satu, kecuali Anda menerima batas throughput permanen.</p>`
        },
        {
            kind: 'salah', title: 'Mencatat deduplikasi di luar transaksi pekerjaan',
            body: `<p>Menyimpan <code>message_id</code> lebih dulu, lalu mengerjakan pekerjaannya, membuka celah baru yang justru lebih berbahaya: pekerjaan hilang secara diam-diam.</p>
<pre data-lang="javascript">❌ await db('pesan_diproses').insert({ message_id: id });
   await kirimEmail(data);       // mati di sini → email tidak pernah terkirim,
                                 // dan pengiriman ulang dianggap duplikat

✅ await db.transaction(async (trx) => {
     await trx('pesan_diproses').insert({ message_id: id });
     await kirimEmail(trx, data);
   });</pre>
<p>Untuk efek yang berada di luar basis data — seperti memanggil API pihak ketiga — pakai idempotency key milik penyedia layanan itu, karena transaksi lokal tidak bisa melindunginya.</p>`
        },
        {
            kind: 'best', title: 'Jadikan <code>message_id</code> bagian dari kontrak',
            body: `<p>Idempotensi jauh lebih mudah bila setiap pesan membawa identitas yang stabil.</p>
<ul>
<li>Producer <strong>wajib</strong> menyertakan <code>message_id</code> yang unik dan stabil — id baris outbox adalah pilihan alami.</li>
<li>Id harus sama saat pesan dikirim ulang; jangan menghasilkan UUID baru pada setiap percobaan.</li>
<li>Konsumer menolak pesan tanpa <code>message_id</code> langsung ke DLQ, sehingga pelanggaran kontrak segera terlihat.</li>
<li>Bersihkan tabel deduplikasi secara berkala, dengan retensi lebih panjang dari TTL pesan terlama.</li>
</ul>`
        },
        {
            kind: 'kasus', title: 'Pelanggan ditagih tiga kali karena jaringan yang lambat',
            body: `<p>Sebuah gangguan jaringan singkat memutus koneksi konsumer pembayaran tepat setelah ia memanggil API penyedia pembayaran, tetapi sebelum sempat mengirim ack. RabbitMQ mengembalikan pesan ke queue dan konsumer lain mengambilnya.</p>
<p>Hal itu terjadi tiga kali dalam satu menit. Tiga tagihan sungguhan masuk ke kartu pelanggan, dan proses pengembalian dana memakan waktu berhari-hari serta merusak kepercayaan.</p>
<p>Perbaikannya sederhana dan seharusnya ada sejak awal: kirimkan <code>message_id</code> sebagai <code>idempotencyKey</code> ke API pembayaran. Penyedia layanan mengenali permintaan berulang dan mengembalikan hasil transaksi pertama tanpa menagih lagi. Pengiriman ulang adalah perilaku normal RabbitMQ, bukan anomali — sistem harus dirancang mengasumsikannya.</p>`
        }
    ],
    quiz: [
        {
            q: 'Jaminan pengiriman apa yang sebenarnya diberikan RabbitMQ?',
            opts: ['Exactly-once', 'At-least-once', 'At-most-once', 'Tergantung tipe queue'],
            a: 1,
            exp: 'RabbitMQ menjamin at-least-once bila ack manual dipakai. Efek exactly-once dicapai dengan menambahkan idempotensi di sisi konsumer, bukan oleh broker.'
        },
        {
            q: 'Manakah operasi yang idempoten secara alami?',
            opts: [
                '<code>UPDATE produk SET stok = stok - 1</code>',
                '<code>UPDATE pesanan SET status = \'dibayar\' WHERE id = $1 AND status = \'menunggu_bayar\'</code>',
                '<code>INSERT INTO log VALUES (...)</code>',
                '<code>UPDATE saldo SET nilai = nilai + 100</code>'
            ],
            a: 1,
            exp: 'Transisi state bersyarat hanya berlaku sekali: eksekusi kedua tidak menemukan baris yang cocok dan mengubah nol baris. Operasi penambahan atau pengurangan relatif selalu berlipat bila diulang.'
        },
        {
            q: 'Bagaimana cara menjaga urutan per entitas tanpa mengorbankan paralelisme?',
            opts: [
                'Turunkan jumlah konsumer menjadi satu',
                'Pakai consistent hash exchange agar entitas yang sama selalu jatuh ke shard yang sama',
                'Naikkan prefetch',
                'Pakai queue dengan prioritas'
            ],
            a: 1,
            exp: 'Consistent hashing menjamin semua pesan milik satu entitas masuk ke queue yang sama sehingga berurutan, sementara entitas berbeda tersebar ke shard lain dan diproses paralel.'
        }
    ]
},

/* ---------------------------------------------------------------- 11 ---- */
{
    id: 11,
    cat: '4 · Pola Aplikasi',
    title: 'Klien Produksi: Reconnect, Heartbeat, dan Graceful Shutdown',
    level: 'Lanjut', dur: '20 mnt',
    tags: ['klien', 'reconnect', 'heartbeat', 'backoff', 'shutdown', 'pooling'],
    desc: 'Menulis lapisan koneksi yang bertahan melewati restart broker, gangguan jaringan, dan deployment tanpa kehilangan pekerjaan.',
    theory: `
<h2>Koneksi Akan Putus — Itu Normal</h2>
<p>Broker di-upgrade, load balancer memutus koneksi menganggur, jaringan berkedip, node di-failover. Aplikasi produksi harus menganggap putusnya koneksi sebagai peristiwa rutin, bukan kejadian luar biasa.</p>

<h3>Heartbeat: Mendeteksi Koneksi yang Mati Diam-diam</h3>
<pre data-lang="text" data-file="kenapa heartbeat perlu">Tanpa heartbeat:
  Kabel dicabut / firewall membuang state NAT
  → soket TCP tidak tahu apa-apa
  → aplikasi mengira masih terhubung
  → publish menghilang ke ketiadaan selama BERJAM-JAM
  → sampai TCP keepalive OS akhirnya menyerah (default 2 jam!)

Dengan heartbeat = 60:
  Kedua sisi bertukar frame tiap 30 detik (setengah interval).
  Dua kali terlewat → koneksi dinyatakan mati dalam ± 60 detik.</pre>
<div class="callout callout-warning">
    <div class="callout-title">⚠️ Heartbeat 0 berarti mematikan deteksi</div>
    <p>Beberapa tutorial menyarankan <code>heartbeat=0</code> untuk menghindari "connection reset" saat debugging. Di produksi ini berbahaya: koneksi mati tidak akan pernah terdeteksi, dan pesan hilang tanpa jejak.</p>
    <p>Nilai 60 detik cocok untuk hampir semua kasus. Untuk konsumer dengan pemrosesan sangat lama, pastikan handler tidak memblokir event loop sehingga frame heartbeat tetap terkirim.</p>
</div>

<h3>Reconnect dengan Exponential Backoff</h3>
<pre data-lang="javascript" data-file="lapisan koneksi tahan banting">const amqp = require('amqplib');

class Koneksi {
  constructor(url, nama) {
    this.url = url;
    this.nama = nama;
    this.conn = null;
    this.ch = null;
    this.tutupSengaja = false;
    this.percobaan = 0;
    this.pendengar = [];          // dipanggil ulang setiap reconnect
  }

  async sambung() {
    try {
      this.conn = await amqp.connect(this.url, {
        heartbeat: 60,
        clientProperties: { connection_name: this.nama }
      });

      this.conn.on('error', (e) => console.error('conn error:', e.message));
      this.conn.on('close', () => {
        if (this.tutupSengaja) return;
        console.warn('koneksi tertutup, menyambung ulang…');
        this.jadwalkan();
      });

      this.ch = await this.conn.createConfirmChannel();
      this.ch.on('error', (e) => console.error('channel error:', e.message));

      this.percobaan = 0;
      // WAJIB: topologi dan konsumer dipasang ULANG setiap reconnect
      for (const pasang of this.pendengar) await pasang(this.ch);
      console.log('tersambung.');
    } catch (e) {
      console.error('gagal menyambung:', e.message);
      this.jadwalkan();
    }
  }

  jadwalkan() {
    this.ch = null;
    const dasar = Math.min(1000 * Math.pow(2, this.percobaan++), 30000);
    const jitter = Math.random() * dasar * 0.3;   // cegah thundering herd
    setTimeout(() => this.sambung(), dasar + jitter);
  }

  daftar(pasang) { this.pendengar.push(pasang); }

  async tutup() {
    this.tutupSengaja = true;
    if (this.ch) await this.ch.close().catch(() => {});
    if (this.conn) await this.conn.close().catch(() => {});
  }
}</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Jangan lupa memasang ulang konsumer</div>
    <p>Kesalahan reconnect paling umum: koneksi tersambung kembali, log menunjukkan "tersambung", tetapi <code>basic.consume</code> tidak pernah dipanggil ulang.</p>
    <p>Akibatnya aplikasi tampak sehat sementara antrean menumpuk diam-diam. Deklarasi exchange, queue, binding, prefetch, dan consume semuanya melekat pada channel — dan channel ikut hilang bersama koneksi.</p>
</div>

<h3>Jitter Bukan Detail Kosmetik</h3>
<p>Bila 200 pod kehilangan koneksi bersamaan saat broker restart, backoff tanpa jitter membuat semuanya mencoba menyambung pada detik yang sama persis. Broker yang baru bangun langsung dihantam 200 handshake serentak dan bisa jatuh lagi — lalu siklusnya berulang.</p>

<h3>Pemakaian Channel yang Benar</h3>
<pre data-lang="text" data-file="aturan channel">✅ Satu connection per proses aplikasi
✅ Satu channel per thread / goroutine / worker
✅ Channel publisher terpisah dari channel consumer
✅ Channel dibuat ulang bila ditutup broker

❌ Satu channel dipakai bersama beberapa thread
❌ Channel baru untuk setiap pesan (mahal, ± 1 round-trip)
❌ Satu connection untuk seluruh cluster aplikasi</pre>
<div class="callout callout-info">
    <div class="callout-title">💡 Channel bisa ditutup sepihak oleh broker</div>
    <p>Kesalahan tingkat channel — mendeklarasikan queue yang sudah ada dengan argumen berbeda, mem-publish ke exchange yang tidak ada, meng-ack delivery tag yang tidak dikenal — membuat broker <strong>menutup channel</strong>, bukan mengembalikan error biasa.</p>
    <p>Karena itu selalu pasang handler <code>channel.on('error')</code> dan siapkan pembuatan ulang channel. Koneksinya sendiri biasanya tetap sehat.</p>
</div>

<h3>Graceful Shutdown</h3>
<pre data-lang="javascript" data-file="shutdown yang benar">let sedangProses = 0;
let berhenti = false;

async function matikan() {
  berhenti = true;

  // 1. berhenti menerima pesan baru — pesan yang belum diambil
  //    tetap aman di queue
  await ch.cancel(consumerTag);

  // 2. tunggu pekerjaan yang sedang berjalan
  const batas = Date.now() + 25000;
  while (sedangProses > 0 && Date.now() < batas) {
    await new Promise(r => setTimeout(r, 200));
  }
  if (sedangProses > 0) {
    console.warn(sedangProses + ' pekerjaan belum selesai; akan dikirim ulang.');
  }

  // 3. tutup dengan rapi
  await ch.close().catch(() => {});
  await conn.close().catch(() => {});
  process.exit(0);
}

process.on('SIGTERM', matikan);
process.on('SIGINT', matikan);</pre>
<pre data-lang="yaml" data-file="k8s harus memberi cukup waktu">spec:
  terminationGracePeriodSeconds: 40    # &gt; 25 detik di atas + margin
  containers:
    - name: worker
      lifecycle:
        preStop:
          exec:
            command: ["sleep", "5"]    # beri jeda agar endpoint dicabut dulu</pre>

<h3>Klien yang Dianjurkan</h3>
<table>
<thead><tr><th>Bahasa</th><th>Pustaka</th><th>Catatan</th></tr></thead>
<tbody>
<tr><td>Node.js</td><td><code>amqplib</code></td><td>Reconnect harus ditulis sendiri</td></tr>
<tr><td>Go</td><td><code>amqp091-go</code></td><td>Resmi; <code>NotifyClose</code> untuk deteksi putus</td></tr>
<tr><td>Java / Kotlin</td><td><code>amqp-client</code> / Spring AMQP</td><td>Spring AMQP menangani reconnect otomatis</td></tr>
<tr><td>Python</td><td><code>pika</code> (async) / <code>aio-pika</code></td><td><code>aio-pika</code> punya reconnect bawaan</td></tr>
<tr><td>.NET</td><td><code>RabbitMQ.Client</code></td><td><code>AutomaticRecoveryEnabled</code> tersedia</td></tr>
</tbody>
</table>
<p>Fitur "automatic recovery" pada beberapa klien memang memasang ulang topologi, tetapi perilakunya berbeda-beda dalam hal konsumer dan pesan yang belum di-ack. Uji sendiri dengan mematikan broker di tengah beban — jangan percaya begitu saja.</p>`,
    lab: {
        intro: `
<h3>Praktik: Menguji Ketahanan Reconnect</h3>
<p>Matikan broker di tengah beban dan pastikan aplikasi pulih sendiri tanpa kehilangan pekerjaan.</p>`,
        files: [{
            name: 'uji-reconnect.sh', lang: 'bash', code: `#!/usr/bin/env bash
set -euo pipefail

echo "== 1. jalankan konsumer di latar belakang =="
node konsumer.js &
KONSUMER=$!
sleep 3

echo "== 2. kirim beban =="
rabbitmqadmin -u admin -p rahasia publish \\
  routing_key=pesanan.email payload="kerja" --count=500 &

echo "== 3. matikan broker di tengah jalan =="
sleep 2
docker compose stop rabbitmq
echo "   broker mati. Konsumer HARUS mencoba menyambung ulang dengan backoff."
sleep 10

echo "== 4. nyalakan kembali =="
docker compose start rabbitmq
sleep 20

echo "== 5. verifikasi =="
rabbitmqctl list_consumers
rabbitmqctl list_queues name messages consumers

echo
echo "Yang harus terlihat:"
echo "  - konsumer terdaftar kembali (consumers &gt; 0)"
echo "  - queue habis diproses"
echo "  - tidak ada pesan yang hilang"

kill $KONSUMER 2>/dev/null || true` }],
        steps: [
            { note: 'Lihat koneksi beserta namanya sebelum gangguan', cmd: 'rabbitmqctl list_connections name user state' },
            { note: 'Matikan broker', cmd: 'docker compose stop rabbitmq' },
            { note: 'Nyalakan kembali', cmd: 'docker compose start rabbitmq' },
            { note: 'Pastikan konsumer mendaftar ulang', cmd: 'rabbitmqctl list_consumers' },
            { note: 'Pastikan tidak ada pesan yang tertinggal', cmd: 'rabbitmqctl list_queues name messages consumers' }
        ],
        snippets: ['rabbitmqctl list_connections name user state', 'rabbitmqctl list_consumers', 'rabbitmqctl list_channels name prefetch_count', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN menyambung ulang tanpa backoff dan jitter',
            body: `<p>Loop <code>while (!connected) connect()</code> akan menghantam broker yang sedang bangun dengan ribuan percobaan per detik, memperpanjang gangguan yang seharusnya singkat.</p>
<pre data-lang="javascript">❌ setInterval(() => sambung(), 100);

✅ const dasar   = Math.min(1000 * 2 ** percobaan++, 30000);
   const jitter  = Math.random() * dasar * 0.3;
   setTimeout(sambung, dasar + jitter);</pre>
<p>Jitter sangat penting saat banyak instance berjalan bersamaan: tanpa itu, semuanya mencoba pada milidetik yang sama dan menciptakan thundering herd.</p>`
        },
        {
            kind: 'salah', title: 'Lupa memasang ulang konsumer setelah reconnect',
            body: `<p>Koneksi pulih, log mengatakan "tersambung", tetapi tidak ada pesan yang diproses. Ini kegagalan paling menipu karena semua indikator aplikasi terlihat hijau.</p>
<p>Semua yang melekat pada channel ikut hilang: deklarasi exchange dan queue, binding, <code>prefetch</code>, dan <code>basic.consume</code>. Simpan fungsi penyiapan topologi dalam satu tempat dan panggil ia pada setiap reconnect.</p>
<p>Cara mendeteksi lebih awal: pasang alert bila <code>consumers = 0</code> pada queue yang seharusnya selalu punya konsumer.</p>`
        },
        {
            kind: 'best', title: 'Beri nama setiap koneksi dan pisahkan peran channel',
            body: `<pre data-lang="javascript">const conn = await amqp.connect(url, {
  heartbeat: 60,
  clientProperties: { connection_name: 'layanan-pesanan-' + process.env.POD_NAME }
});

const chPublish = await conn.createConfirmChannel();  // publisher
const chConsume = await conn.createChannel();         // consumer</pre>
<p>Memisahkan channel publisher dan consumer mencegah satu kesalahan mematikan keduanya, dan membuat <code>rabbitmqctl list_channels</code> jauh lebih mudah dibaca saat menyelidiki masalah.</p>`
        },
        {
            kind: 'kasus', title: 'Antrean menumpuk selama 14 jam tanpa satu pun alert',
            body: `<p>Sebuah broker di-restart untuk upgrade rutin pada pukul 22:00. Semua konsumer menyambung ulang dengan sukses — koneksi terbentuk, log bersih, health check aplikasi hijau.</p>
<p>Namun kode reconnect hanya memanggil <code>createChannel()</code> tanpa memanggil ulang <code>consume()</code>. Selama 14 jam tidak ada satu pesan pun yang diproses. Baru ketahuan pagi harinya saat pelanggan melaporkan konfirmasi pesanan tidak pernah datang; queue berisi 2,3 juta pesan.</p>
<p>Dua perbaikan yang saling melengkapi: pasang ulang seluruh topologi dan konsumer pada setiap reconnect, dan pasang alert pada <code>rabbitmq_queue_consumers == 0</code> untuk queue yang seharusnya selalu dikonsumsi. Health check yang hanya memeriksa "koneksi ada" tidak cukup — periksa juga bahwa konsumernya benar-benar terdaftar.</p>`
        }
    ],
    quiz: [
        {
            q: 'Apa yang paling sering terlupakan saat menulis logika reconnect?',
            opts: [
                'Menutup koneksi lama',
                'Memasang ulang topologi dan memanggil ulang <code>basic.consume</code>',
                'Mengubah nilai heartbeat',
                'Membuat connection baru'
            ],
            a: 1,
            exp: 'Deklarasi, binding, prefetch, dan konsumer semuanya melekat pada channel yang ikut hilang. Tanpa memasangnya ulang, aplikasi tampak sehat tetapi tidak memproses apa pun.'
        },
        {
            q: 'Kenapa jitter perlu ditambahkan pada exponential backoff?',
            opts: [
                'Agar reconnect lebih cepat',
                'Agar banyak instance tidak menyambung ulang pada saat yang sama persis',
                'Karena diwajibkan protokol AMQP',
                'Untuk menghemat memori'
            ],
            a: 1,
            exp: 'Tanpa jitter, semua instance yang putus bersamaan akan mencoba lagi pada milidetik yang sama, menghantam broker yang baru bangun dan berpotensi menjatuhkannya kembali.'
        },
        {
            q: 'Apa yang terjadi bila <code>heartbeat</code> diset 0?',
            opts: [
                'Koneksi menjadi lebih cepat',
                'Deteksi koneksi mati dimatikan, sehingga koneksi rusak bisa tidak terdeteksi berjam-jam',
                'Broker menolak koneksi',
                'Pesan otomatis menjadi persistent'
            ],
            a: 1,
            exp: 'Tanpa heartbeat, aplikasi bergantung pada TCP keepalive OS yang defaultnya sekitar dua jam. Selama itu publish menghilang tanpa error apa pun.'
        }
    ]
},

/* ---------------------------------------------------------------- 12 ---- */
{
    id: 12,
    cat: '5 · Operasi',
    title: 'Cluster, Partisi Jaringan, Federation, dan Shovel',
    level: 'Lanjut', dur: '22 mnt',
    tags: ['cluster', 'partition', 'split brain', 'federation', 'shovel', 'erlang cookie'],
    desc: 'Menjalankan RabbitMQ di lebih dari satu node, dan memahami apa yang terjadi ketika jaringan di antara mereka terputus.',
    theory: `
<h2>Apa yang Dibagi dan Tidak Dibagi dalam Cluster</h2>
<table>
<thead><tr><th>Direplikasi ke semua node</th><th>Tidak direplikasi</th></tr></thead>
<tbody>
<tr><td>Definisi exchange, binding</td><td>Isi classic queue (hanya di satu node)</td></tr>
<tr><td>User, permission, vhost</td><td>—</td></tr>
<tr><td>Policy dan parameter</td><td>—</td></tr>
<tr><td>Isi quorum queue (ke replikanya)</td><td>—</td></tr>
</tbody>
</table>
<div class="callout callout-warning">
    <div class="callout-title">⚠️ Classic queue hidup di satu node saja</div>
    <p>Dalam cluster, sebuah classic queue berada di node tempat ia pertama dideklarasikan. Node lain hanya meneruskan permintaan ke sana. Bila node itu mati, queue tersebut <strong>tidak tersedia</strong> sampai node kembali — walaupun cluster secara keseluruhan sehat.</p>
    <p>Inilah alasan lain mengapa quorum queue menjadi default yang benar untuk apa pun yang penting.</p>
</div>

<h3>Membentuk Cluster</h3>
<pre data-lang="bash" data-file="cluster manual"># Syarat mutlak: seluruh node memakai Erlang cookie yang SAMA
# /var/lib/rabbitmq/.erlang.cookie  (mode 0400, milik user rabbitmq)

# di node-2 dan node-3:
rabbitmqctl stop_app
rabbitmqctl reset
rabbitmqctl join_cluster rabbit@node-1
rabbitmqctl start_app

rabbitmqctl cluster_status</pre>
<pre data-lang="ini" data-file="pembentukan otomatis (lebih baik)"># rabbitmq.conf
cluster_formation.peer_discovery_backend = classic_config
cluster_formation.classic_config.nodes.1 = rabbit@node-1
cluster_formation.classic_config.nodes.2 = rabbit@node-2
cluster_formation.classic_config.nodes.3 = rabbit@node-3

# di Kubernetes:
# cluster_formation.peer_discovery_backend = k8s
# cluster_formation.k8s.host = kubernetes.default.svc.cluster.local</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Erlang cookie: penyebab kegagalan cluster nomor satu</div>
    <p>Node dengan cookie berbeda tidak bisa saling bicara sama sekali. Pesan errornya sering menyesatkan — biasanya <code>Node not responding</code> atau <code>Authentication failed</code> — sehingga orang mencurigai jaringan atau DNS selama berjam-jam.</p>
<pre data-lang="bash"># periksa dari setiap node
docker exec rabbit-1 cat /var/lib/rabbitmq/.erlang.cookie
docker exec rabbit-2 cat /var/lib/rabbitmq/.erlang.cookie
# harus identik, tanpa newline tambahan, permission 0400</pre>
</div>

<h3>Partisi Jaringan (Split Brain)</h3>
<pre data-lang="text" data-file="apa yang terjadi">Cluster 3 node, jaringan terpotong:

  [ node-1 ]  ✂  [ node-2   node-3 ]
   minoritas        mayoritas

Tanpa penanganan, kedua sisi mengira sisi lain yang mati,
lalu masing-masing menerima publish → data menyimpang.</pre>
<pre data-lang="ini" data-file="strategi penanganan"># rabbitmq.conf
cluster_partition_handling = pause_minority</pre>
<table>
<thead><tr><th>Strategi</th><th>Perilaku</th><th>Penilaian</th></tr></thead>
<tbody>
<tr><td><code>pause_minority</code></td><td>Sisi minoritas berhenti melayani sampai partisi pulih</td><td><strong>Dianjurkan.</strong> Konsistensi diutamakan</td></tr>
<tr><td><code>autoheal</code></td><td>Setelah pulih, sisi minoritas di-restart dan datanya dibuang</td><td>Bisa kehilangan pesan diam-diam</td></tr>
<tr><td><code>ignore</code></td><td>Tidak melakukan apa-apa</td><td>Split brain sungguhan. Hanya untuk cluster 2 node yang sudah pasrah</td></tr>
</tbody>
</table>
<p><code>pause_minority</code> memerlukan jumlah node ganjil agar konsep "mayoritas" bermakna — alasan yang sama dengan quorum queue.</p>

<h3>Menyebar Node dengan Benar</h3>
<pre data-lang="text" data-file="penempatan node">✅ Tiga node di tiga availability zone dalam SATU region
   latensi antar-AZ ± 1–2 ms, cukup untuk Raft

❌ Tiga node di tiga REGION berbeda
   latensi 50–200 ms membuat konsensus Raft sangat lambat;
   setiap publish dengan confirm menunggu replikasi lintas benua

Untuk multi-region: cluster terpisah per region,
dihubungkan dengan Federation atau Shovel.</pre>

<h3>Shovel: Memindahkan Pesan Antar Broker</h3>
<pre data-lang="bash" data-file="shovel dinamis">rabbitmqctl set_parameter shovel migrasi-ke-baru '{
  "src-protocol": "amqp091",
  "src-uri":      "amqp://user:sandi@broker-lama:5672/%2f",
  "src-queue":    "pesanan.email",

  "dest-protocol": "amqp091",
  "dest-uri":      "amqp://user:sandi@broker-baru:5672/%2f",
  "dest-queue":    "pesanan.email",

  "ack-mode":         "on-confirm",
  "src-prefetch-count": 1000,
  "src-delete-after": "never"
}'

rabbitmqctl shovel_status
rabbitmqctl clear_parameter shovel migrasi-ke-baru</pre>
<div class="callout callout-info">
    <div class="callout-title">💡 <code>ack-mode: on-confirm</code> adalah satu-satunya pilihan aman</div>
    <p>Shovel baru meng-ack pesan di sumber setelah tujuan mengonfirmasi penerimaannya. Dengan <code>on-publish</code> atau <code>no-ack</code>, pesan bisa hilang di tengah perpindahan bila tujuan bermasalah.</p>
    <p><code>src-delete-after: queue-length</code> berguna untuk migrasi sekali jalan: shovel berhenti sendiri setelah memindahkan pesan yang ada saat ia dimulai.</p>
</div>

<h3>Federation: Menyambungkan Broker Lintas Lokasi</h3>
<pre data-lang="bash" data-file="federation exchange"># di broker hilir (yang menerima)
rabbitmqctl set_parameter federation-upstream jakarta '{
  "uri": "amqp://user:sandi@rabbit-jakarta:5672",
  "expires": 3600000,
  "max-hops": 1
}'

rabbitmqctl set_policy federasi-pesanan "^pesanan$" '{
  "federation-upstream-set": "all"
}' --priority 10 --apply-to exchanges</pre>
<table>
<thead><tr><th></th><th>Shovel</th><th>Federation</th></tr></thead>
<tbody>
<tr><td>Memindahkan</td><td>Isi satu queue</td><td>Pesan dari exchange</td></tr>
<tr><td>Arah</td><td>Satu arah, eksplisit</td><td>Upstream ke downstream</td></tr>
<tr><td>Cocok untuk</td><td>Migrasi, DR, pemindahan sekali jalan</td><td>Distribusi peristiwa multi-region berkelanjutan</td></tr>
<tr><td>Kesederhanaan</td><td>Sangat sederhana</td><td>Perlu perhatian pada <code>max-hops</code></td></tr>
</tbody>
</table>
<p><code>max-hops</code> mencegah pesan berputar tanpa henti bila dua broker saling memfederasi. Setel 1 kecuali Anda benar-benar membangun topologi berlapis.</p>

<h3>Load Balancer di Depan Cluster</h3>
<pre data-lang="text" data-file="hal yang perlu diperhatikan">✅ TCP load balancer (layer 4), bukan HTTP
✅ Timeout idle HARUS lebih besar dari heartbeat AMQP
   LB idle 60s + heartbeat 60s → koneksi diputus di tengah
   Setel LB idle ≥ 300s, atau heartbeat lebih kecil dari idle LB
✅ Health check ke port 5672, atau HTTP /api/health/checks/alarms
❌ Sticky session tidak diperlukan — AMQP sudah stateful per koneksi</pre>`,
    lab: {
        intro: `
<h3>Praktik: Membentuk Cluster Tiga Node dan Mengujinya</h3>
<p>Bangun cluster, periksa statusnya, lalu matikan satu node dan amati quorum queue tetap melayani.</p>`,
        files: [{
            name: 'docker-compose.cluster.yml', lang: 'yaml', code: `x-rabbit: &rabbit
  image: rabbitmq:4.1-management
  environment: &env
    RABBITMQ_ERLANG_COOKIE: "cookie-rahasia-yang-sama"
    RABBITMQ_DEFAULT_USER: admin
    RABBITMQ_DEFAULT_PASS: rahasia
  ulimits:
    nofile: { soft: 65536, hard: 65536 }
  healthcheck:
    test: ["CMD", "rabbitmq-diagnostics", "-q", "ping"]
    interval: 15s
    retries: 10

services:
  rabbit-1:
    <<: *rabbit
    hostname: rabbit-1
    ports: ["5672:5672", "15672:15672"]
    volumes:
      - r1:/var/lib/rabbitmq
      - ./rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf:ro

  rabbit-2:
    <<: *rabbit
    hostname: rabbit-2
    volumes:
      - r2:/var/lib/rabbitmq
      - ./rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf:ro
    depends_on:
      rabbit-1: { condition: service_healthy }

  rabbit-3:
    <<: *rabbit
    hostname: rabbit-3
    volumes:
      - r3:/var/lib/rabbitmq
      - ./rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf:ro
    depends_on:
      rabbit-1: { condition: service_healthy }

volumes: { r1: , r2: , r3: }

# rabbitmq.conf:
#   cluster_formation.peer_discovery_backend = classic_config
#   cluster_formation.classic_config.nodes.1 = rabbit@rabbit-1
#   cluster_formation.classic_config.nodes.2 = rabbit@rabbit-2
#   cluster_formation.classic_config.nodes.3 = rabbit@rabbit-3
#   cluster_partition_handling = pause_minority
#   default_queue_type = quorum` }],
        steps: [
            { note: 'Nyalakan cluster tiga node', cmd: 'docker compose -f docker-compose.cluster.yml up -d' },
            { note: 'Periksa status cluster', cmd: 'rabbitmqctl cluster_status' },
            { note: 'Buat quorum queue dan lihat sebaran replikanya', cmd: 'rabbitmqctl quorum_status uji.quorum' },
            { note: 'Matikan satu node dan buktikan queue tetap melayani', cmd: 'docker compose stop rabbit-2' },
            { note: 'Pastikan tidak ada partisi yang tersisa setelah pulih', cmd: 'rabbitmq-diagnostics cluster_status' }
        ],
        snippets: ['rabbitmqctl cluster_status', 'rabbitmqctl quorum_status uji.quorum', 'rabbitmqctl shovel_status', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN menyebar node cluster lintas region',
            body: `<p>Raft memerlukan komunikasi bolak-balik untuk setiap penulisan. Dengan latensi antar-region 80 ms, setiap publish dengan confirm menunggu setidaknya dua kali angka itu, dan throughput anjlok drastis.</p>
<p>Lebih buruk lagi, gangguan jaringan antar-region — yang jauh lebih sering daripada antar-AZ — akan memicu partisi berulang dan membuat cluster tidak stabil.</p>
<p>Pola yang benar: satu cluster per region, dihubungkan dengan Federation atau Shovel yang memang dirancang toleran terhadap latensi tinggi.</p>`
        },
        {
            kind: 'salah', title: 'Memakai <code>autoheal</code> untuk penanganan partisi',
            body: `<p><code>autoheal</code> terdengar menyenangkan karena cluster pulih otomatis tanpa campur tangan. Harganya: saat memilih sisi mana yang menang, sisi yang kalah di-restart dan <strong>seluruh data queue-nya dibuang</strong>.</p>
<p>Pesan yang sudah dikonfirmasi kepada producer bisa lenyap tanpa satu pun error di sisi aplikasi. <code>pause_minority</code> memilih sebaliknya: sisi minoritas berhenti melayani, producer mendapat kegagalan yang jujur dan bisa mencoba lagi.</p>`
        },
        {
            kind: 'best', title: 'Uji kegagalan node sebelum produksi, bukan sesudah',
            body: `<p>Cluster yang belum pernah diuji kegagalannya adalah cluster yang belum diketahui perilakunya.</p>
<ul>
<li>Matikan satu node saat beban berjalan; ukur berapa lama sampai layanan pulih.</li>
<li>Putuskan jaringan antar node (bukan hanya mematikan proses) untuk menguji penanganan partisi.</li>
<li>Verifikasi klien menyambung ulang ke node yang masih hidup.</li>
<li>Periksa tidak ada pesan hilang: bandingkan jumlah yang dikonfirmasi dan yang dikonsumsi.</li>
</ul>
<p>Lakukan ini di staging dengan topologi yang sama, dan ulangi setelah setiap upgrade mayor.</p>`
        },
        {
            kind: 'kasus', title: 'Cluster tidak pernah terbentuk karena satu karakter newline',
            body: `<p>Sebuah tim menghabiskan sekitar enam jam mendiagnosis cluster yang menolak terbentuk. Pesan errornya <code>Node rabbit@rabbit-2 not responding</code>, sehingga mereka memeriksa DNS, firewall, port 4369 dan 25672, serta konfigurasi jaringan Docker.</p>
<p>Penyebab sebenarnya: berkas <code>.erlang.cookie</code> di satu node dibuat dengan <code>echo "cookie" &gt; .erlang.cookie</code>, yang menambahkan karakter newline di akhir. Node lain memakai cookie tanpa newline. Bagi Erlang, keduanya adalah cookie berbeda.</p>
<p>Cara memeriksa yang seharusnya dilakukan sejak awal: <code>md5sum</code> berkas cookie di setiap node dan pastikan identik. Gunakan <code>printf</code> alih-alih <code>echo</code>, dan setel permission 0400 milik user rabbitmq.</p>`
        }
    ],
    quiz: [
        {
            q: 'Strategi penanganan partisi mana yang paling aman untuk data?',
            opts: ['<code>ignore</code>', '<code>autoheal</code>', '<code>pause_minority</code>', 'Tidak ada bedanya'],
            a: 2,
            exp: '<code>pause_minority</code> menghentikan layanan pada sisi minoritas sehingga tidak ada data yang menyimpang. <code>autoheal</code> memulihkan otomatis tetapi membuang data sisi yang kalah.'
        },
        {
            q: 'Dalam cluster, classic queue berada di mana?',
            opts: [
                'Direplikasi ke semua node',
                'Hanya di node tempat ia dideklarasikan',
                'Di node dengan memori terbanyak',
                'Berpindah otomatis mengikuti beban'
            ],
            a: 1,
            exp: 'Classic queue hidup di satu node; node lain hanya meneruskan permintaan. Bila node itu mati, queue-nya tidak tersedia. Quorum queue mereplikasi isinya ke beberapa node.'
        },
        {
            q: 'Nilai <code>ack-mode</code> apa yang aman untuk Shovel?',
            opts: ['<code>no-ack</code>', '<code>on-publish</code>', '<code>on-confirm</code>', 'Semua sama saja'],
            a: 2,
            exp: '<code>on-confirm</code> membuat shovel baru meng-ack pesan di sumber setelah tujuan mengonfirmasi penerimaan, sehingga tidak ada pesan yang hilang di tengah perpindahan.'
        }
    ]
},

/* ---------------------------------------------------------------- 13 ---- */
{
    id: 13,
    cat: '5 · Operasi',
    title: 'Keamanan: vhost, Permission, TLS, dan Pengerasan',
    level: 'Lanjut', dur: '20 mnt',
    tags: ['keamanan', 'vhost', 'permission', 'tls', 'user', 'hardening'],
    desc: 'Mengunci broker dengan pemisahan tenant, izin berbasis pola, enkripsi transport, dan penghapusan default yang berbahaya.',
    theory: `
<h2>Hal Pertama: Hapus User <code>guest</code></h2>
<p>Setiap instalasi RabbitMQ hadir dengan user <code>guest</code> berpassword <code>guest</code>. Secara bawaan ia hanya bisa dipakai dari <code>localhost</code>, tetapi banyak orang melonggarkan itu tanpa menyadari konsekuensinya.</p>
<pre data-lang="bash" data-file="langkah pertama produksi">rabbitmqctl add_user admin "$(openssl rand -base64 32)"
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"

rabbitmqctl delete_user guest       # hapus, bukan sekadar ganti password</pre>
<div class="callout callout-danger">
    <div class="callout-title">⛔ <code>loopback_users = none</code> membuka guest ke seluruh jaringan</div>
    <p>Setelan ini sering muncul di contoh Docker agar memudahkan pengujian. Di produksi, ia berarti siapa pun yang bisa menjangkau port 5672 dapat masuk dengan <code>guest/guest</code> dan membaca seluruh pesan Anda.</p>
    <p>Bila Anda memang perlu setelan itu untuk user lain, hapus <code>guest</code> lebih dulu.</p>
</div>

<h3>Vhost: Isolasi Sungguhan</h3>
<pre data-lang="bash" data-file="pemisahan per tim">rabbitmqctl add_vhost pembayaran
rabbitmqctl add_vhost notifikasi

rabbitmqctl add_user svc-pembayaran "$(openssl rand -base64 24)"
rabbitmqctl set_permissions -p pembayaran svc-pembayaran ".*" ".*" ".*"
# user ini TIDAK punya akses apa pun ke vhost notifikasi</pre>
<p>Vhost memisahkan exchange, queue, binding, dan izin secara total. Dua tim bisa memakai nama queue yang sama tanpa saling mengganggu, dan kebocoran kredensial satu tim tidak membuka data tim lain.</p>

<h3>Model Izin: Tiga Pola Regex</h3>
<pre data-lang="bash" data-file="anatomi izin">rabbitmqctl set_permissions -p &lt;vhost&gt; &lt;user&gt; \\
    "&lt;configure&gt;" "&lt;write&gt;" "&lt;read&gt;"</pre>
<table>
<thead><tr><th>Izin</th><th>Mengizinkan</th></tr></thead>
<tbody>
<tr><td><strong>configure</strong></td><td>Membuat/menghapus queue dan exchange</td></tr>
<tr><td><strong>write</strong></td><td>Publish ke exchange, membuat binding (sisi sumber)</td></tr>
<tr><td><strong>read</strong></td><td>Consume dari queue, membuat binding (sisi tujuan)</td></tr>
</tbody>
</table>

<pre data-lang="bash" data-file="izin berprinsip least privilege"># producer: hanya boleh publish ke exchange pesanan, tidak boleh membuat apa pun
rabbitmqctl set_permissions -p / svc-pesanan-producer \\
    "^$" \\
    "^pesanan$" \\
    "^$"

# consumer: hanya boleh membaca queue miliknya
rabbitmqctl set_permissions -p / svc-email-consumer \\
    "^pesanan\\.email$" \\
    "^pesanan\\.(dlx|email)$" \\
    "^pesanan\\.email$"

# monitoring: hanya membaca metrik, tidak menyentuh pesan
rabbitmqctl add_user monitoring "$(openssl rand -base64 24)"
rabbitmqctl set_user_tags monitoring monitoring
rabbitmqctl set_permissions -p / monitoring "^$" "^$" "^$"

rabbitmqctl list_permissions -p /</pre>
<div class="callout callout-warning">
    <div class="callout-title">⚠️ <code>".*"</code> untuk setiap aplikasi adalah kelalaian yang umum</div>
    <p>Memberi <code>".*" ".*" ".*"</code> kepada semua layanan berarti satu kredensial yang bocor membuka seluruh sistem pesan: pembacaan semua queue, penghapusan queue orang lain, dan publish palsu ke exchange mana pun.</p>
    <p>Menyusun pola izin memakan waktu sekitar sepuluh menit per layanan, dan membatasi kerusakan secara drastis.</p>
</div>

<h3>User Tag</h3>
<table>
<thead><tr><th>Tag</th><th>Akses</th></tr></thead>
<tbody>
<tr><td>(tanpa tag)</td><td>Hanya AMQP, tidak bisa membuka UI</td></tr>
<tr><td><code>management</code></td><td>UI untuk vhost yang diizinkan saja</td></tr>
<tr><td><code>monitoring</code></td><td>UI dan seluruh metrik, semua vhost</td></tr>
<tr><td><code>policymaker</code></td><td>Mengelola policy dan parameter</td></tr>
<tr><td><code>administrator</code></td><td>Semuanya, termasuk user dan vhost</td></tr>
</tbody>
</table>
<p>Aplikasi seharusnya <strong>tanpa tag</strong> — ia hanya butuh AMQP. Memberi tag <code>administrator</code> kepada service account adalah kesalahan yang sering ditemukan saat audit.</p>

<h3>TLS</h3>
<pre data-lang="ini" data-file="rabbitmq.conf — TLS">listeners.tcp   = none            # matikan port tanpa enkripsi
listeners.ssl.default = 5671

ssl_options.cacertfile = /etc/rabbitmq/certs/ca.pem
ssl_options.certfile   = /etc/rabbitmq/certs/server.pem
ssl_options.keyfile    = /etc/rabbitmq/certs/server-key.pem
ssl_options.verify     = verify_peer
ssl_options.fail_if_no_peer_cert = false
ssl_options.versions.1 = tlsv1.3
ssl_options.versions.2 = tlsv1.2

management.ssl.port     = 15671
management.ssl.cacertfile = /etc/rabbitmq/certs/ca.pem
management.ssl.certfile   = /etc/rabbitmq/certs/server.pem
management.ssl.keyfile    = /etc/rabbitmq/certs/server-key.pem</pre>
<pre data-lang="javascript" data-file="klien TLS">const koneksi = await amqp.connect({
  protocol: 'amqps',
  hostname: 'rabbit.internal',
  port: 5671,
  username: process.env.RMQ_USER,
  password: process.env.RMQ_PASS,
  heartbeat: 60
}, {
  ca: [fs.readFileSync('/etc/ssl/certs/ca.pem')],
  servername: 'rabbit.internal'          // verifikasi hostname
});</pre>
<div class="callout callout-info">
    <div class="callout-title">💡 TLS antar node cluster berbeda dari TLS klien</div>
    <p>Komunikasi antar node memakai distribusi Erlang di port 25672, bukan AMQP. Mengaktifkan TLS untuk klien <strong>tidak</strong> mengenkripsi lalu lintas antar node.</p>
    <p>Bila node tersebar antar AZ atau melewati jaringan yang tidak sepenuhnya tepercaya, aktifkan juga <em>inter-node TLS</em> lewat <code>advanced.config</code> — atau tempatkan seluruh cluster di jaringan privat yang terkendali.</p>
</div>

<h3>Autentikasi Berbasis Sertifikat</h3>
<pre data-lang="ini" data-file="mTLS"># plugin rabbitmq_auth_mechanism_ssl
auth_mechanisms.1 = EXTERNAL
auth_mechanisms.2 = PLAIN

ssl_cert_login_from = common_name
ssl_options.fail_if_no_peer_cert = true</pre>
<p>Dengan ini, identitas klien diambil dari CN sertifikatnya — tidak ada password yang perlu didistribusikan atau dirotasi. Cocok untuk lingkungan yang sudah punya PKI internal.</p>

<h3>Checklist Pengerasan</h3>
<ul>
<li>User <code>guest</code> dihapus.</li>
<li>Setiap aplikasi punya user sendiri, tanpa tag, dengan izin berpola sempit.</li>
<li>Port 5672 tidak terekspos ke internet; hanya 5671 dengan TLS bila perlu diakses dari luar.</li>
<li>UI manajemen (15672) hanya dapat dijangkau dari jaringan internal atau lewat VPN.</li>
<li>Password dihasilkan acak dan disimpan di brankas rahasia, bukan di variabel lingkungan yang terlihat pada <code>docker inspect</code>.</li>
<li><code>loopback_users</code> tidak dilonggarkan tanpa alasan yang jelas.</li>
<li>Erlang cookie acak dan berbeda per lingkungan.</li>
<li>Rotasi kredensial terjadwal, dan prosedurnya sudah pernah diuji.</li>
<li>Audit berkala dengan <code>list_users</code>, <code>list_permissions</code>, dan <code>list_user_permissions</code>.</li>
</ul>`,
    lab: {
        intro: `
<h3>Praktik: Menyusun Izin Berprinsip Least Privilege</h3>
<p>Buat user terpisah untuk producer dan consumer, lalu buktikan batasannya benar-benar berlaku.</p>`,
        files: [{
            name: 'keamanan.sh', lang: 'bash', code: `#!/usr/bin/env bash
set -euo pipefail

echo "== 1. admin baru, lalu hapus guest =="
rabbitmqctl add_user admin "$(openssl rand -base64 32)"
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
rabbitmqctl delete_user guest

echo "== 2. producer: hanya boleh publish ke exchange pesanan =="
rabbitmqctl add_user svc-producer "$(openssl rand -base64 24)"
rabbitmqctl set_permissions -p / svc-producer "^$" "^pesanan$" "^$"

echo "== 3. consumer: hanya queue miliknya =="
rabbitmqctl add_user svc-email "$(openssl rand -base64 24)"
rabbitmqctl set_permissions -p / svc-email \\
  "^pesanan\\.email$" "^pesanan\\.(dlx|email)$" "^pesanan\\.email$"

echo "== 4. monitoring: metrik saja, tanpa akses pesan =="
rabbitmqctl add_user monitoring "$(openssl rand -base64 24)"
rabbitmqctl set_user_tags monitoring monitoring
rabbitmqctl set_permissions -p / monitoring "^$" "^$" "^$"

echo "== 5. audit =="
rabbitmqctl list_users
rabbitmqctl list_permissions -p /` }],
        steps: [
            { note: 'Terapkan model izin', cmd: 'bash keamanan.sh' },
            { note: 'Lihat seluruh user dan tag-nya', cmd: 'rabbitmqctl list_users' },
            { note: 'Periksa izin per vhost', cmd: 'rabbitmqctl list_permissions -p /' },
            { note: 'Buktikan producer tidak bisa membuat queue', cmd: 'rabbitmqadmin -u svc-producer -p sandi declare queue name=nakal' },
            { note: 'Buktikan consumer tidak bisa membaca queue milik orang lain', cmd: 'rabbitmqadmin -u svc-email -p sandi get queue=pesanan.audit' }
        ],
        snippets: ['rabbitmqctl list_users', 'rabbitmqctl list_permissions -p /', 'rabbitmqctl list_vhosts', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN membiarkan user <code>guest</code> ada di produksi',
            body: `<p>Password bawaannya diketahui semua orang. Perlindungan bawaan hanya berupa pembatasan ke localhost, dan pembatasan itu sering dimatikan tanpa disadari lewat <code>loopback_users = none</code> yang disalin dari contoh Docker.</p>
<pre data-lang="bash">rabbitmqctl delete_user guest   # hapus, jangan sekadar ganti password</pre>
<p>Sertakan pemeriksaannya dalam pipeline penyiapan lingkungan, sehingga instalasi baru tidak pernah lolos dengan guest yang masih hidup.</p>`
        },
        {
            kind: 'salah', title: 'Memberi tag <code>administrator</code> kepada aplikasi',
            body: `<p>Aplikasi hanya butuh protokol AMQP; ia tidak perlu membuka UI, mengelola user, atau mengubah policy. Tag <code>administrator</code> pada service account berarti satu kredensial yang bocor bisa menghapus vhost, membaca semua antrean, dan membuat user baru.</p>
<p>Biarkan user aplikasi <strong>tanpa tag sama sekali</strong>. Berikan tag hanya kepada manusia dan sistem monitoring, sesuai kebutuhannya.</p>`
        },
        {
            kind: 'best', title: 'Susun izin berdasarkan pola nama sejak awal',
            body: `<p>Konvensi penamaan yang konsisten membuat izin bisa ditulis sebagai regex yang tetap berlaku saat queue baru ditambahkan.</p>
<pre data-lang="bash"># semua milik tim pembayaran memakai awalan yang sama
rabbitmqctl set_permissions -p / svc-pembayaran \\
  "^pembayaran\\..*" "^pembayaran(\\..*)?$" "^pembayaran\\..*"</pre>
<p>Dengan begitu, menambah queue <code>pembayaran.rekonsiliasi</code> tidak memerlukan perubahan izin — tetapi tim lain tetap tidak bisa menyentuhnya.</p>`
        },
        {
            kind: 'kasus', title: 'UI manajemen terbuka ke internet selama delapan bulan',
            body: `<p>Sebuah tim memetakan port 15672 ke IP publik agar bisa memeriksa antrean dari luar kantor, dan menyetel <code>loopback_users = none</code> agar login lebih mudah. User <code>guest</code> tidak pernah dihapus.</p>
<p>Selama delapan bulan, siapa pun di internet dapat masuk dengan <code>guest/guest</code>, membaca isi setiap pesan — termasuk data pribadi pelanggan — menghapus queue, dan mem-publish pesan palsu. Baru ditemukan saat audit keamanan tahunan.</p>
<p>Pencegahan berlapis yang seharusnya ada: hapus <code>guest</code>, jangan pernah mengekspos 15672 ke publik (pakai VPN atau SSH tunnel), aktifkan TLS, dan jalankan pemindaian port eksternal secara berkala terhadap seluruh alamat publik yang Anda miliki.</p>`
        }
    ],
    quiz: [
        {
            q: 'Apa arti tiga pola regex pada <code>set_permissions</code>?',
            opts: [
                'read, write, delete',
                'configure, write, read',
                'publish, consume, admin',
                'queue, exchange, binding'
            ],
            a: 1,
            exp: 'Urutannya configure (membuat/menghapus queue dan exchange), write (publish dan binding sisi sumber), read (consume dan binding sisi tujuan).'
        },
        {
            q: 'Tag apa yang sebaiknya diberikan kepada user aplikasi?',
            opts: ['<code>administrator</code>', '<code>management</code>', '<code>monitoring</code>', 'Tanpa tag sama sekali'],
            a: 3,
            exp: 'Aplikasi hanya memerlukan AMQP. Tag apa pun memberi akses ke UI manajemen atau kemampuan administratif yang tidak dibutuhkan dan memperbesar dampak kebocoran kredensial.'
        },
        {
            q: 'Mengaktifkan TLS pada port 5671 mengenkripsi apa?',
            opts: [
                'Semua lalu lintas termasuk antar node cluster',
                'Hanya lalu lintas AMQP dari klien',
                'Hanya UI manajemen',
                'Hanya pesan yang persistent'
            ],
            a: 1,
            exp: 'Komunikasi antar node memakai distribusi Erlang di port 25672 dan perlu konfigurasi TLS tersendiri. TLS klien tidak melindunginya.'
        }
    ]
},

/* ---------------------------------------------------------------- 14 ---- */
{
    id: 14,
    cat: '5 · Operasi',
    title: 'Monitoring, Flow Control, dan Menyetel Performa',
    level: 'Lanjut', dur: '22 mnt',
    tags: ['monitoring', 'prometheus', 'metrik', 'flow control', 'performa', 'alert'],
    desc: 'Mengetahui metrik mana yang benar-benar memprediksi masalah, dan membaca sinyal yang dikirim broker sebelum ia kewalahan.',
    theory: `
<h2>Metrik yang Benar-benar Penting</h2>
<pre data-lang="bash" data-file="aktifkan plugin">rabbitmq-plugins enable rabbitmq_prometheus
# metrik tersedia di http://node:15692/metrics</pre>

<table>
<thead><tr><th>Metrik</th><th>Artinya</th><th>Kapan mengkhawatirkan</th></tr></thead>
<tbody>
<tr><td><code>rabbitmq_queue_messages_ready</code></td><td>Menunggu dikonsumsi</td><td>Naik terus tanpa turun</td></tr>
<tr><td><code>rabbitmq_queue_messages_unacked</code></td><td>Sedang diproses</td><td>Tinggi dan diam = konsumer menggantung</td></tr>
<tr><td><code>rabbitmq_queue_consumers</code></td><td>Jumlah konsumer</td><td><strong>0</strong> pada queue produksi</td></tr>
<tr><td><code>rabbitmq_alarms_memory_used_watermark</code></td><td>Alarm memori</td><td>Bernilai 1 = publish diblokir</td></tr>
<tr><td><code>rabbitmq_alarms_free_disk_space_watermark</code></td><td>Alarm disk</td><td>Bernilai 1 = publish diblokir</td></tr>
<tr><td><code>rabbitmq_process_open_fds</code></td><td>File descriptor terpakai</td><td>&gt; 80% dari batas</td></tr>
<tr><td><code>rabbitmq_connections</code></td><td>Jumlah koneksi</td><td>Naik terus = kebocoran koneksi</td></tr>
<tr><td><code>rabbitmq_channels</code></td><td>Jumlah channel</td><td>Ribuan per koneksi = bug</td></tr>
<tr><td><code>rabbitmq_queue_messages_published_total</code></td><td>Laju publish</td><td>Bandingkan dengan laju konsumsi</td></tr>
<tr><td><code>rabbitmq_disk_space_available_bytes</code></td><td>Sisa disk</td><td>Mendekati <code>disk_free_limit</code></td></tr>
</tbody>
</table>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Metrik terpenting: laju masuk versus laju keluar</div>
<pre data-lang="promql"># selisih positif yang bertahan = antrean akan tumbuh tanpa batas
sum by (queue) (rate(rabbitmq_queue_messages_published_total[5m]))
  -
sum by (queue) (rate(rabbitmq_queue_messages_delivered_total[5m]))</pre>
    <p>Jumlah pesan di queue hanyalah gejala. Selisih laju adalah <em>penyebabnya</em>, dan ia memperingatkan Anda jauh sebelum antrean menjadi besar.</p>
</div>

<h3>Alert yang Layak Dipasang</h3>
<pre data-lang="yaml" data-file="alert Prometheus">groups:
  - name: rabbitmq
    rules:
      - alert: QueueTanpaKonsumer
        expr: rabbitmq_queue_consumers{queue!~".*\\\\.dlq"} == 0
        for: 5m
        labels: { severity: critical }
        annotations:
          summary: 'Queue {{ $labels.queue }} tidak punya konsumer'
          runbook_url: https://wiki.internal/runbook/rmq-tanpa-konsumer

      - alert: AntreanTumbuhTerus
        expr: |
          sum by (queue) (rate(rabbitmq_queue_messages_published_total[10m]))
            -
          sum by (queue) (rate(rabbitmq_queue_messages_delivered_total[10m]))
            > 0
        for: 15m
        labels: { severity: warning }

      - alert: DLQTidakKosong
        expr: rabbitmq_queue_messages{queue=~".*\\\\.dlq"} > 0
        for: 10m
        labels: { severity: warning }

      - alert: AlarmBrokerAktif
        expr: |
          rabbitmq_alarms_memory_used_watermark == 1
            or
          rabbitmq_alarms_free_disk_space_watermark == 1
        for: 1m
        labels: { severity: critical }
        annotations:
          summary: 'Broker memblokir SELURUH publish'

      - alert: FileDescriptorHampirHabis
        expr: rabbitmq_process_open_fds / rabbitmq_process_max_fds > 0.8
        for: 10m
        labels: { severity: warning }</pre>

<h3>Flow Control: Rem Otomatis Broker</h3>
<pre data-lang="text" data-file="cara kerja">Producer terlalu cepat dibanding kemampuan broker menulis ke disk
  → broker menerapkan credit-based flow control
  → koneksi producer masuk state "flow"
  → publish DIPERLAMBAT, bukan ditolak

Ini BUKAN kerusakan; ini mekanisme perlindungan yang bekerja.
Tetapi ia sinyal bahwa sesuatu perlu diperbaiki.</pre>
<pre data-lang="bash" data-file="mendeteksi flow control">rabbitmqctl list_connections name state
# state: running | flow | blocked | blocking

rabbitmqctl list_channels name state messages_unconfirmed</pre>
<table>
<thead><tr><th>State</th><th>Arti</th></tr></thead>
<tbody>
<tr><td><code>running</code></td><td>Normal</td></tr>
<tr><td><code>flow</code></td><td>Diperlambat karena broker kewalahan menulis</td></tr>
<tr><td><code>blocking</code></td><td>Akan diblokir karena alarm baru menyala</td></tr>
<tr><td><code>blocked</code></td><td>Diblokir total oleh alarm memori/disk</td></tr>
</tbody>
</table>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ State <code>flow</code> yang menetap adalah peringatan dini</div>
    <p>Bila koneksi producer sering berada di state <code>flow</code>, broker sudah berada di batas kemampuannya. Penyebab yang paling sering:</p>
    <ul>
        <li>Disk lambat — persistensi adalah operasi paling mahal di RabbitMQ.</li>
        <li>Terlalu banyak queue di satu node.</li>
        <li>Pesan besar yang persistent dengan laju tinggi.</li>
        <li>Konsumer terlalu lambat sehingga pesan menumpuk di disk.</li>
    </ul>
</div>

<h3>Faktor Performa, Berurutan dari yang Paling Berdampak</h3>
<table>
<thead><tr><th>Faktor</th><th>Dampak</th><th>Tindakan</th></tr></thead>
<tbody>
<tr><td>Persistence</td><td>Sangat besar</td><td>Pakai transient untuk data yang boleh hilang</td></tr>
<tr><td>Ukuran pesan</td><td>Besar</td><td>Kirim referensi, bukan payload besar</td></tr>
<tr><td>Jumlah queue</td><td>Besar</td><td>Ribuan queue membebani manajemen node</td></tr>
<tr><td>Confirm per pesan</td><td>Besar</td><td>Pakai batch confirm</td></tr>
<tr><td>Prefetch</td><td>Sedang</td><td>Sesuaikan dengan durasi tugas</td></tr>
<tr><td>Jumlah koneksi</td><td>Sedang</td><td>Pakai ulang, jangan buat per operasi</td></tr>
<tr><td>Kecepatan disk</td><td>Besar untuk persistent</td><td>SSD/NVMe, bukan disk jaringan lambat</td></tr>
</tbody>
</table>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Jangan mengirim payload besar lewat broker</div>
    <p>Pesan berukuran megabyte menghabiskan memori broker, memperlambat replikasi quorum, dan memicu flow control.</p>
<pre data-lang="text">❌ publish berisi PDF 8 MB dalam base64

✅ simpan berkas di object storage (S3/MinIO),
   publish hanya referensinya:
   { "berkas_url": "s3://faktur/2026/07/F-1042.pdf",
     "ukuran": 8388608, "checksum": "sha256:…" }</pre>
    <p>Batas praktis yang sehat: jaga pesan di bawah 128 KB. Di atas itu, pertimbangkan pola referensi.</p>
</div>

<h3>Dashboard yang Perlu Ada</h3>
<ul>
<li><strong>Ikhtisar broker</strong> — alarm, memori, disk, file descriptor, jumlah koneksi.</li>
<li><strong>Per queue</strong> — ready, unacked, konsumer, laju masuk dan keluar.</li>
<li><strong>Kesehatan konsumer</strong> — queue tanpa konsumer, waktu proses, laju redelivery.</li>
<li><strong>DLQ</strong> — jumlah pesan per DLQ dan trennya.</li>
<li><strong>Cluster</strong> — status node, partisi, kesehatan replika quorum.</li>
</ul>
<p>Grafana menyediakan dashboard resmi RabbitMQ (ID 10991 untuk ikhtisar, 11340 untuk Erlang VM) yang bisa menjadi titik awal yang baik sebelum Anda menyesuaikannya.</p>

<h3>Alat Diagnosis Cepat</h3>
<pre data-lang="bash" data-file="urutan pemeriksaan saat insiden">rabbitmq-diagnostics alarms          # 1. apakah publish sedang diblokir?
rabbitmq-diagnostics check_running   # 2. apakah node hidup?
rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
                                     # 3. queue mana yang bermasalah?
rabbitmqctl list_connections name state
                                     # 4. ada koneksi di state flow/blocked?
rabbitmq-diagnostics memory_breakdown
                                     # 5. memori habis untuk apa?
rabbitmqctl cluster_status           # 6. ada partisi?</pre>`,
    lab: {
        intro: `
<h3>Praktik: Memasang Monitoring dan Memicu Flow Control</h3>
<p>Amati broker menerapkan rem otomatisnya saat producer terlalu agresif.</p>`,
        files: [{
            name: 'prometheus.yml', lang: 'yaml', code: `global:
  scrape_interval: 15s

scrape_configs:
  - job_name: rabbitmq
    static_configs:
      - targets:
          - rabbit-1:15692
          - rabbit-2:15692
          - rabbit-3:15692
    metric_relabel_configs:
      # buang metrik per-queue untuk queue sementara agar
      # kardinalitas tidak meledak
      - source_labels: [queue]
        regex: 'amq\\.gen-.*'
        action: drop

rule_files:
  - /etc/prometheus/rules/rabbitmq.yml` }],
        steps: [
            { note: 'Aktifkan plugin metrik', cmd: 'rabbitmq-plugins enable rabbitmq_prometheus' },
            { note: 'Periksa endpoint metrik', cmd: 'curl -s http://localhost:15692/metrics' },
            { note: 'Kirim beban besar tanpa konsumer untuk memicu flow control', cmd: 'rabbitmqadmin publish routing_key=uji.beban payload="$(head -c 100000 /dev/zero | tr "\\0" "x")" --count=50000' },
            { note: 'Amati state koneksi berubah menjadi flow', cmd: 'rabbitmqctl list_connections name state' },
            { note: 'Lihat memori broker habis untuk apa', cmd: 'rabbitmq-diagnostics memory_breakdown' }
        ],
        snippets: ['rabbitmqctl list_connections name state', 'rabbitmq-diagnostics memory_breakdown', 'rabbitmq-diagnostics alarms', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN hanya memantau jumlah pesan di queue',
            body: `<p>Jumlah pesan adalah gejala yang terlambat. Saat sebuah queue sudah berisi 500.000 pesan, masalahnya sudah berlangsung berjam-jam.</p>
<p>Yang memberi peringatan dini adalah <strong>selisih laju masuk dan keluar</strong>. Selisih positif yang bertahan 15 menit sudah cukup untuk memastikan antrean akan tumbuh tanpa batas, walaupun jumlah pesannya masih kecil.</p>
<p>Tambahkan juga alert atas <code>rabbitmq_queue_consumers == 0</code>, karena queue yang kehilangan seluruh konsumernya sering tidak terdeteksi sampai berjam-jam kemudian.</p>`
        },
        {
            kind: 'salah', title: 'Mengira state <code>flow</code> adalah kerusakan',
            body: `<p>Flow control adalah mekanisme yang bekerja sebagaimana mestinya: broker memperlambat producer agar tidak menerima lebih banyak daripada yang bisa ia tulis ke disk.</p>
<p>Yang salah bukan flow control-nya, melainkan penyebabnya. Restart broker atau aplikasi tidak menyelesaikan apa pun — periksa kecepatan disk, ukuran pesan, jumlah queue, dan apakah konsumer mengimbangi laju publish.</p>`
        },
        {
            kind: 'best', title: 'Kirim referensi, bukan payload besar',
            body: `<p>Broker dirancang untuk memindahkan pesan kecil dengan cepat, bukan menjadi tempat penyimpanan berkas.</p>
<pre data-lang="json">{
  "pesanan_id": "P-1042",
  "faktur": {
    "url": "s3://faktur/2026/07/F-1042.pdf",
    "ukuran": 8388608,
    "checksum": "sha256:9f2c…"
  }
}</pre>
<p>Selain lebih cepat, pola ini membuat pesan tetap kecil sehingga replikasi quorum ringan, dan berkas besar tidak ikut tersimpan berkali-kali di beberapa queue.</p>`
        },
        {
            kind: 'kasus', title: 'Kardinalitas metrik melumpuhkan Prometheus, bukan RabbitMQ',
            body: `<p>Sebuah aplikasi memakai queue sementara dengan nama otomatis (<code>amq.gen-xxxxx</code>) untuk balasan RPC, membuat sekitar 2.000 queue baru setiap jam.</p>
<p>Plugin Prometheus RabbitMQ mengekspor metrik per queue. Dalam beberapa hari, Prometheus menyimpan jutaan time series bernama unik, kehabisan memori, dan berhenti melayani — sehingga seluruh monitoring organisasi ikut mati, bukan hanya untuk RabbitMQ.</p>
<p>Dua perbaikan: buang metrik queue sementara di <code>metric_relabel_configs</code>, dan ganti pola RPC menjadi <code>amq.rabbitmq.reply-to</code> yang tidak membuat queue sungguhan sama sekali.</p>`
        }
    ],
    quiz: [
        {
            q: 'Metrik apa yang paling awal memperingatkan bahwa antrean akan tumbuh tanpa batas?',
            opts: [
                'Jumlah pesan di queue',
                'Selisih laju publish dan laju delivered',
                'Pemakaian memori broker',
                'Jumlah koneksi'
            ],
            a: 1,
            exp: 'Jumlah pesan adalah gejala yang muncul terlambat. Selisih laju masuk dan keluar yang positif dan bertahan sudah cukup untuk memastikan pertumbuhan tanpa batas, jauh sebelum antrean membesar.'
        },
        {
            q: 'Koneksi producer berada di state <code>flow</code>. Artinya?',
            opts: [
                'Koneksi rusak dan harus dibuat ulang',
                'Broker sedang memperlambat producer karena tidak sanggup menulis secepat itu',
                'Alarm memori sedang aktif',
                'Konsumer sedang menggantung'
            ],
            a: 1,
            exp: 'Flow control adalah rem otomatis berbasis kredit. Ia bekerja sebagaimana dirancang, tetapi menandakan broker berada di batas kemampuannya — periksa disk, ukuran pesan, dan kecepatan konsumsi.'
        },
        {
            q: 'Bagaimana cara terbaik menangani pesan berisi berkas 8 MB?',
            opts: [
                'Naikkan batas ukuran pesan di broker',
                'Simpan berkas di object storage dan kirim referensinya',
                'Pecah menjadi banyak pesan kecil',
                'Pakai stream queue'
            ],
            a: 1,
            exp: 'Broker bukan tempat penyimpanan berkas. Payload besar membebani memori, memperlambat replikasi, dan memicu flow control. Pola referensi menjaga pesan tetap kecil dan cepat.'
        }
    ]
},

/* ---------------------------------------------------------------- 15 ---- */
{
    id: 15,
    cat: '5 · Operasi',
    title: 'Operasi Harian: Definisi sebagai Kode, Upgrade, dan Troubleshooting',
    level: 'Lanjut', dur: '22 mnt',
    tags: ['definitions', 'backup', 'upgrade', 'troubleshooting', 'runbook', 'as code'],
    desc: 'Menjadikan topologi bisa dibangun ulang dari Git, menaikkan versi tanpa kehilangan pesan, dan mendiagnosis masalah secara sistematis.',
    theory: `
<h2>Definisi sebagai Kode</h2>
<p>Seluruh topologi RabbitMQ — vhost, user, permission, exchange, queue, binding, policy — bisa diekspor menjadi satu berkas JSON dan dimuat kembali saat broker start.</p>
<pre data-lang="bash" data-file="ekspor dan muat"># ekspor
rabbitmqctl export_definitions /tmp/definitions.json

# atau lewat HTTP API
curl -s -u admin:rahasia http://localhost:15672/api/definitions \\
  | jq 'del(.users[].password_hash)' > definitions.json

# muat saat start (rabbitmq.conf)
# load_definitions = /etc/rabbitmq/definitions.json</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Berkas definisi memuat hash password</div>
    <p>Hasil ekspor berisi <code>password_hash</code> untuk setiap user. Meng-commit-nya ke Git berarti menyebarkan materi kredensial ke setiap orang yang punya akses repositori dan ke seluruh riwayat commit selamanya.</p>
<pre data-lang="bash"># buang bagian user sebelum commit; kelola user lewat mekanisme rahasia terpisah
jq 'del(.users)' definitions.json > definitions.aman.json</pre>
    <p>Simpan topologi (exchange, queue, binding, policy) di Git; simpan user dan password di brankas rahasia.</p>
</div>

<pre data-lang="json" data-file="struktur definitions.json">{
  "rabbit_version": "4.0.5",
  "vhosts": [{ "name": "/" }],
  "permissions": [
    { "user": "svc-producer", "vhost": "/",
      "configure": "^$", "write": "^pesanan$", "read": "^$" }
  ],
  "policies": [
    { "vhost": "/", "name": "batas-antrean", "pattern": "^pesanan\\\\.",
      "apply-to": "queues", "priority": 10,
      "definition": { "max-length": 100000, "overflow": "reject-publish" } }
  ],
  "exchanges": [
    { "name": "pesanan", "vhost": "/", "type": "topic",
      "durable": true, "auto_delete": false,
      "arguments": { "alternate-exchange": "pesanan.tak-terkirim" } }
  ],
  "queues": [
    { "name": "pesanan.email", "vhost": "/", "durable": true,
      "auto_delete": false,
      "arguments": {
        "x-queue-type": "quorum",
        "x-dead-letter-exchange": "pesanan.dlx",
        "x-delivery-limit": 5
      } }
  ],
  "bindings": [
    { "source": "pesanan", "vhost": "/", "destination": "pesanan.email",
      "destination_type": "queue", "routing_key": "pesanan.*.dibuat",
      "arguments": {} }
  ]
}</pre>

<h3>Apa yang Perlu Dibackup</h3>
<table>
<thead><tr><th>Aset</th><th>Cara</th><th>Frekuensi</th></tr></thead>
<tbody>
<tr><td>Definisi topologi</td><td><code>export_definitions</code></td><td>Setiap perubahan, dan harian</td></tr>
<tr><td>Isi pesan</td><td>Tidak dibackup</td><td>—</td></tr>
<tr><td>Erlang cookie</td><td>Brankas rahasia</td><td>Sekali, saat dibuat</td></tr>
<tr><td>Konfigurasi</td><td>Git</td><td>Setiap perubahan</td></tr>
</tbody>
</table>
<div class="callout callout-info">
    <div class="callout-title">💡 Isi queue tidak perlu dibackup — dan memang tidak bisa</div>
    <p>Pesan bersifat sementara secara desain. Bila kehilangan isi queue tidak dapat diterima, sumber kebenarannya seharusnya ada di basis data (pola outbox, bab 9), bukan di broker.</p>
    <p>Menyalin direktori data RabbitMQ saat broker berjalan menghasilkan berkas yang tidak konsisten dan tidak bisa dipulihkan dengan andal.</p>
</div>

<h3>Prosedur Upgrade</h3>
<pre data-lang="text" data-file="rolling upgrade cluster">Prasyarat:
  • semua queue penting bertipe quorum (classic queue tidak tersedia
    selama node-nya mati)
  • klien punya reconnect yang teruji
  • ekspor definisi sudah tersimpan

Langkah untuk setiap node, satu per satu:
  1. rabbitmq-upgrade drain          → node masuk maintenance mode,
                                        koneksi dipindahkan
  2. tunggu quorum queue memindahkan leader keluar dari node ini
  3. hentikan node, ganti versi, jalankan kembali
  4. rabbitmq-upgrade revive
  5. rabbitmqctl cluster_status      → pastikan bergabung kembali
  6. tunggu replika quorum tersinkron penuh
  7. baru lanjut ke node berikutnya</pre>
<div class="callout callout-warning">
    <div class="callout-title">⚠️ Perhatikan batas kompatibilitas versi</div>
    <ul>
        <li>Rolling upgrade umumnya didukung antar versi minor yang berdekatan.</li>
        <li>Untuk lompatan versi mayor, baca panduan resmi — sering diperlukan upgrade bertahap, bukan langsung.</li>
        <li><strong>RabbitMQ 4.0 menghapus classic queue mirroring.</strong> Migrasikan ke quorum queue <em>sebelum</em> upgrade, bukan sesudah.</li>
        <li>Versi Erlang juga punya syarat minimum tersendiri.</li>
    </ul>
</div>

<h3>Runbook Troubleshooting</h3>
<pre data-lang="text" data-file="gejala → penyebab → tindakan">GEJALA: publish menggantung tanpa error
  → rabbitmq-diagnostics alarms
  → alarm memori/disk aktif? Kurangi antrean, tambah kapasitas disk.
  → tidak ada alarm? Periksa state koneksi: flow atau blocked.

GEJALA: queue menumpuk terus
  → rabbitmqctl list_queues name messages_ready messages_unacknowledged consumers
  → consumers = 0     : konsumer mati atau gagal reconnect
  → unacked ≈ prefetch: konsumer terlalu lambat, tambah instance
  → unacked tinggi dan diam: konsumer menggantung, periksa thread dump

GEJALA: pesan hilang tanpa jejak
  → periksa binding: rabbitmqctl list_bindings
  → periksa queue alternate-exchange
  → periksa DLQ dan header x-death
  → apakah publisher confirm dipakai?

GEJALA: pesan diproses berkali-kali
  → apakah konsumer idempoten?
  → apakah ack dikirim setelah pemrosesan selesai?
  → apakah pemrosesan lebih lama dari consumer_timeout broker?

GEJALA: konsumer diputus dengan "consumer timeout"
  → pemrosesan melebihi consumer_timeout (default 30 menit)
  → pecah menjadi tugas lebih kecil, atau naikkan batasnya:
     consumer_timeout = 3600000   (rabbitmq.conf, dalam milidetik)

GEJALA: cluster tidak terbentuk
  → md5sum .erlang.cookie di setiap node — harus identik
  → port 4369 (epmd) dan 25672 (distribusi) terbuka?
  → resolusi hostname antar node berhasil?</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ <code>consumer_timeout</code>: penyebab redelivery yang membingungkan</div>
    <p>Sejak RabbitMQ 3.8.15, broker memutus konsumer yang tidak mengirim ack dalam 30 menit. Pesan dikembalikan ke queue dan diproses ulang.</p>
    <p>Bagi tugas yang memang panjang — konversi video, laporan besar — gejalanya adalah pekerjaan yang terus berulang tanpa pernah selesai, tanpa error yang jelas di sisi aplikasi. Naikkan <code>consumer_timeout</code>, atau lebih baik lagi pecah pekerjaan menjadi bagian yang lebih kecil.</p>
</div>

<h3>Pemeliharaan Rutin</h3>
<table>
<thead><tr><th>Kegiatan</th><th>Frekuensi</th></tr></thead>
<tbody>
<tr><td>Ekspor definisi ke Git</td><td>Setiap perubahan</td></tr>
<tr><td>Tinjau isi DLQ</td><td>Harian</td></tr>
<tr><td>Audit user dan permission</td><td>Bulanan</td></tr>
<tr><td>Hapus queue yang tidak dipakai</td><td>Bulanan</td></tr>
<tr><td>Uji reconnect dan failover</td><td>Per kuartal</td></tr>
<tr><td>Upgrade versi minor</td><td>Per kuartal</td></tr>
<tr><td>Uji pemulihan dari definisi</td><td>Per kuartal</td></tr>
</tbody>
</table>

<h3>Penutup: Tanda Instalasi RabbitMQ yang Dewasa</h3>
<ul>
<li>Seluruh topologi ada di Git dan dimuat lewat <code>load_definitions</code>.</li>
<li>Semua queue penting bertipe quorum dengan <code>x-delivery-limit</code>.</li>
<li>Setiap queue punya batas panjang, TTL, dan DLX.</li>
<li>Setiap DLQ dipantau dan punya pemilik.</li>
<li>Producer memakai publisher confirms; pesan penting lahir dari tabel outbox.</li>
<li>Konsumer idempoten, dengan prefetch yang disetel sadar dan graceful shutdown.</li>
<li>User <code>guest</code> sudah dihapus; tiap layanan punya izin berpola sempit.</li>
<li>Reconnect klien pernah diuji dengan mematikan broker di tengah beban.</li>
<li>Alert terpasang untuk alarm broker, queue tanpa konsumer, dan DLQ tidak kosong.</li>
</ul>`,
    lab: {
        intro: `
<h3>Praktik: Membangun Ulang Broker dari Definisi</h3>
<p>Hancurkan broker sepenuhnya, lalu pulihkan topologinya dari satu berkas.</p>`,
        files: [{
            name: 'pulihkan.sh', lang: 'bash', code: `#!/usr/bin/env bash
set -euo pipefail

echo "== 1. ekspor definisi saat ini =="
rabbitmqctl export_definitions /tmp/definitions.json
jq 'del(.users)' /tmp/definitions.json > definitions.aman.json
echo "   topologi tersimpan (tanpa hash password)."

echo "== 2. hancurkan broker beserta volumenya =="
docker compose down -v

echo "== 3. bangun ulang; definisi dimuat otomatis saat start =="
docker compose up -d --wait
sleep 25

echo "== 4. verifikasi =="
EX=$(rabbitmqctl list_exchanges --formatter=json | jq 'length')
Q=$(rabbitmqctl  list_queues    --formatter=json | jq 'length')
B=$(rabbitmqctl  list_bindings  --formatter=json | jq 'length')
echo "   exchange: $EX  queue: $Q  binding: $B"

[ "$Q" -ge 3 ] || { echo "GAGAL: queue tidak lengkap"; exit 1; }
echo "== LULUS: topologi pulih sepenuhnya dari berkas definisi =="
echo "   Catatan: ISI pesan tidak ikut pulih — itu memang bukan"
echo "   tugas broker. Sumber kebenaran ada di tabel outbox."` }],
        steps: [
            { note: 'Ekspor seluruh definisi', cmd: 'rabbitmqctl export_definitions /tmp/definitions.json' },
            { note: 'Buang bagian user sebelum masuk Git', cmd: 'jq \'del(.users)\' /tmp/definitions.json > definitions.aman.json' },
            { note: 'Hancurkan dan bangun ulang', cmd: 'docker compose down -v' },
            { note: 'Verifikasi topologi pulih', cmd: 'rabbitmqctl list_queues name type durable' },
            { note: 'Periksa apakah ada masalah tersisa', cmd: 'rabbitmq-diagnostics check_running' }
        ],
        snippets: ['rabbitmqctl export_definitions /tmp/definitions.json', 'rabbitmqctl list_queues name type durable', 'rabbitmq-diagnostics check_running', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN meng-commit definitions.json apa adanya ke Git',
            body: `<p>Berkas hasil ekspor memuat <code>password_hash</code> setiap user. Riwayat Git bersifat permanen: menghapusnya di commit berikutnya tidak menghilangkannya dari repositori.</p>
<pre data-lang="bash">jq 'del(.users)' definitions.json > definitions.aman.json</pre>
<p>Kelola user dan password lewat mekanisme rahasia terpisah — brankas rahasia, secret Kubernetes, atau skrip penyiapan yang menghasilkan password acak saat lingkungan dibuat.</p>`
        },
        {
            kind: 'salah', title: 'Mencoba membackup isi queue',
            body: `<p>Menyalin direktori <code>/var/lib/rabbitmq/mnesia</code> saat broker berjalan menghasilkan berkas yang tidak konsisten dan sering gagal dipulihkan. Bahkan bila berhasil, ia hanya menangkap keadaan pada satu titik waktu yang sudah lama berlalu.</p>
<p>Pesan memang bersifat sementara. Bila kehilangannya tidak dapat diterima, sumber kebenarannya harus berada di basis data lewat pola outbox — di sanalah backup yang sesungguhnya berada.</p>`
        },
        {
            kind: 'best', title: 'Uji pemulihan, jangan hanya menjalankan backup',
            body: `<p>Ekspor definisi yang belum pernah dipulihkan tidak memberi jaminan apa pun. Jadwalkan latihan pemulihan berkala:</p>
<ol>
<li>Bangun broker kosong di lingkungan terpisah.</li>
<li>Muat berkas definisi terbaru dari Git.</li>
<li>Verifikasi jumlah exchange, queue, binding, dan policy sesuai harapan.</li>
<li>Arahkan salinan aplikasi ke sana dan pastikan alurnya berjalan.</li>
</ol>
<p>Latihan ini juga menemukan hal yang sering terlewat: queue yang dibuat manual saat insiden dan tidak pernah masuk ke berkas definisi.</p>`
        },
        {
            kind: 'kasus', title: 'Upgrade ke 4.0 menghapus replikasi tanpa disadari',
            body: `<p>Sebuah tim menaikkan versi cluster dari 3.13 ke 4.0 mengikuti prosedur rolling upgrade. Prosesnya lancar, semua node bergabung kembali, dan tidak ada error.</p>
<p>Yang tidak mereka sadari: seluruh queue mereka masih classic dengan kebijakan <code>ha-mode: all</code>. RabbitMQ 4.0 menghapus classic queue mirroring, sehingga kebijakan itu diam-diam berhenti berfungsi. Queue mereka kini hidup di satu node tanpa replika, sementara dashboard dan kebijakan masih terlihat seperti sebelumnya.</p>
<p>Tiga minggu kemudian sebuah node mengalami kegagalan disk, dan sekitar 180.000 pesan hilang bersamanya. Migrasi ke quorum queue seharusnya dilakukan <strong>sebelum</strong> upgrade, dan verifikasi pascaupgrade seharusnya memeriksa <code>rabbitmqctl list_queues name type</code> — bukan hanya memastikan cluster berjalan.</p>`
        }
    ],
    quiz: [
        {
            q: 'Apa yang harus dihapus dari <code>definitions.json</code> sebelum masuk ke Git?',
            opts: [
                'Bagian <code>bindings</code>',
                'Bagian <code>users</code> yang memuat password_hash',
                'Bagian <code>policies</code>',
                'Nomor versi RabbitMQ'
            ],
            a: 1,
            exp: 'Hasil ekspor memuat hash password setiap user. Riwayat Git bersifat permanen, sehingga kredensial harus dikelola lewat mekanisme rahasia terpisah.'
        },
        {
            q: 'Konsumer diputus dengan pesan "consumer timeout" dan pekerjaannya berulang terus. Penyebabnya?',
            opts: [
                'Heartbeat terlalu kecil',
                'Pemrosesan melebihi <code>consumer_timeout</code> broker (default 30 menit)',
                'Prefetch terlalu besar',
                'Queue bukan quorum'
            ],
            a: 1,
            exp: 'Broker memutus konsumer yang tidak mengirim ack dalam batas <code>consumer_timeout</code>. Pesan dikembalikan dan diproses ulang. Pecah tugas menjadi lebih kecil, atau naikkan batasnya secara sadar.'
        },
        {
            q: 'Apa yang harus dilakukan SEBELUM upgrade ke RabbitMQ 4.0?',
            opts: [
                'Menghapus semua DLQ',
                'Memigrasikan classic mirrored queue ke quorum queue',
                'Menonaktifkan plugin management',
                'Menaikkan <code>vm_memory_high_watermark</code>'
            ],
            a: 1,
            exp: 'RabbitMQ 4.0 menghapus classic queue mirroring. Kebijakan <code>ha-mode</code> berhenti berfungsi secara diam-diam, sehingga queue kehilangan replikasi tanpa peringatan apa pun.'
        }
    ]
}

];

/* ==========================================================================
   RABBITMQ — MINI PROJECT, UJIAN AKHIR & SIMULATOR
   ========================================================================== */

const COURSE = {
    key: 'rabbitmq',
    pageTitle: 'Belajar RabbitMQ Lengkap | Kelas Interaktif',
    subtitle: '15 bab · AMQP & routing · quorum queue · DLX & retry · mini project · ujian sertifikasi',
    prompt: '$',
    termTitle: 'bash — simulator rabbitmq',
    termWelcome: [
        'Simulator RabbitMQ siap. Perintah yang dikenali:',
        '  rabbitmqctl list_queues|list_exchanges|list_bindings|list_connections …',
        '  rabbitmqctl cluster_status | quorum_status <q> | set_policy … | list_policies',
        '  rabbitmq-diagnostics ping|status|alarms|memory_breakdown|observer',
        '  rabbitmqadmin declare|publish|get|move_messages … | rabbitmq-plugins list',
        'Data yang dipakai adalah dataset contoh yang menyerupai broker produksi.',
        ''
    ],

    modules: [].concat(RMQ_MOD_A, RMQ_MOD_B, RMQ_MOD_C),

    /* ================== MINI PROJECT ================== */
    project: {
        title: 'Tulang Punggung Pesan “BayarCepat”',
        subtitle: 'Membangun jalur pesan yang tidak kehilangan transaksi, tidak memproses ganda, dan bisa dibangun ulang dari Git.',
        meta: ['⏱ 12–18 jam', '🎯 Level: Lanjut', '🧰 RabbitMQ + PostgreSQL + Prometheus + Docker'],
        intro: `
<h2>Situasi</h2>
<p>BayarCepat memindahkan empat layanannya ke komunikasi berbasis pesan: <code>api-gateway</code>, <code>ledger</code>, <code>notifikasi</code>, dan <code>rekonsiliasi</code>. Selama ini semuanya saling memanggil lewat HTTP secara sinkron.</p>
<p>Akibatnya sudah terasa: ketika layanan notifikasi lambat, pembuatan pesanan ikut lambat. Ketika layanan notifikasi mati, pesanan gagal dibuat sama sekali — padahal mengirim email seharusnya tidak menentukan apakah sebuah pesanan sah.</p>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Yang harus Anda hasilkan</div>
    <p>Jalur pesan yang memenuhi tiga janji sekaligus: <strong>tidak ada transaksi yang hilang</strong> walaupun broker sempat mati, <strong>tidak ada efek ganda</strong> walaupun pesan datang berkali-kali, dan <strong>seluruh topologinya bisa dibangun ulang dari Git</strong> dalam satu perintah.</p>
</div>

<h3>Prinsip yang Harus Anda Pegang</h3>
<ul>
    <li><strong>Producer melaporkan fakta, bukan memerintah.</strong> Routing key berbentuk lampau; siapa yang mendengarkan bukan urusan producer.</li>
    <li><strong>Setiap pesan penting lahir dari transaksi basis data.</strong> Tidak ada dual write.</li>
    <li><strong>Setiap konsumer idempoten.</strong> Pengiriman ulang adalah perilaku normal, bukan anomali.</li>
    <li><strong>Setiap queue punya batas, DLX, dan pemilik.</strong> Tidak ada queue yang boleh tumbuh tanpa batas.</li>
    <li><strong>Tidak ada pesan yang boleh hilang diam-diam.</strong> Alternate exchange dan publisher confirm wajib.</li>
</ul>`,
        steps: [
            {
                title: 'Tahap 1 — Broker yang Layak Produksi',
                body: `
<p>Mulai dari fondasi: cluster tiga node, batas sistem yang benar, dan tanpa default yang berbahaya.</p>
<pre data-lang="ini" data-file="rabbitmq.conf">## jaringan
listeners.tcp.default = 5672
management.tcp.port   = 15672

## batas sumber daya — bentuk ABSOLUT karena berjalan di container
vm_memory_high_watermark.absolute = 2GB
disk_free_limit.absolute          = 10GB

## koneksi
heartbeat   = 60
channel_max = 2047

## konsumer dengan tugas panjang: naikkan secara sadar
consumer_timeout = 1800000

## quorum sebagai default — tidak perlu diingat tiap deklarasi
default_queue_type = quorum

## cluster
cluster_formation.peer_discovery_backend = classic_config
cluster_formation.classic_config.nodes.1 = rabbit@rabbit-1
cluster_formation.classic_config.nodes.2 = rabbit@rabbit-2
cluster_formation.classic_config.nodes.3 = rabbit@rabbit-3
cluster_partition_handling = pause_minority

## topologi dimuat dari berkas
load_definitions = /etc/rabbitmq/definitions.json

## log
log.console       = true
log.console.level = info</pre>
<pre data-lang="yaml" data-file="docker-compose.yml — potongan penting">    hostname: rabbit-1              # WAJIB tetap, jangan acak
    ulimits:
      nofile: { soft: 65536, hard: 65536 }
    deploy:
      resources:
        limits: { memory: 4G }      # watermark 2GB memberi ruang aman
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "-q", "status"]
      interval: 30s
      start_period: 60s</pre>
<p><strong>Selesai bila:</strong> <code>rabbitmqctl cluster_status</code> menampilkan tiga node tanpa partisi, <code>rabbitmq-diagnostics alarms</code> bersih, dan user <code>guest</code> sudah tidak ada.</p>`
            },
            {
                title: 'Tahap 2 — Topologi: Fakta, Bukan Perintah',
                body: `
<p>Rancang routing key dari umum ke khusus, dan pasang jaring pengaman sebelum pesan pertama dikirim.</p>
<pre data-lang="text" data-file="rancangan routing key">&lt;domain&gt;.&lt;wilayah&gt;.&lt;peristiwa&gt;

pesanan.jakarta.dibuat        pembayaran.jakarta.berhasil
pesanan.jakarta.dibatalkan    pembayaran.jakarta.gagal
pesanan.bandung.dibuat        pembayaran.bandung.berhasil

Pola yang menjadi mungkin:
  pesanan.#            semua tentang pesanan
  pesanan.jakarta.#    semua pesanan di Jakarta
  *.jakarta.*          semua domain di Jakarta
  #.gagal              semua kegagalan lintas domain</pre>

<pre data-lang="json" data-file="definitions.json — potongan">{
  "exchanges": [
    { "name": "pesanan", "vhost": "/", "type": "topic", "durable": true,
      "arguments": { "alternate-exchange": "pesanan.tak-terkirim" } },
    { "name": "pesanan.tak-terkirim", "vhost": "/", "type": "fanout", "durable": true },
    { "name": "pesanan.dlx", "vhost": "/", "type": "direct", "durable": true }
  ],
  "queues": [
    { "name": "pesanan.email", "vhost": "/", "durable": true,
      "arguments": {
        "x-queue-type": "quorum",
        "x-delivery-limit": 5,
        "x-dead-letter-exchange": "pesanan.dlx",
        "x-dead-letter-routing-key": "retry.5s" } },

    { "name": "pesanan.ledger", "vhost": "/", "durable": true,
      "arguments": {
        "x-queue-type": "quorum",
        "x-delivery-limit": 5,
        "x-dead-letter-exchange": "pesanan.dlx",
        "x-dead-letter-routing-key": "retry.5s" } },

    { "name": "pesanan.audit", "vhost": "/", "durable": true,
      "arguments": { "x-queue-type": "quorum" } },

    { "name": "pesanan.tak-terkirim.q", "vhost": "/", "durable": true,
      "arguments": { "x-queue-type": "quorum" } },

    { "name": "retry.5s", "vhost": "/", "durable": true,
      "arguments": { "x-message-ttl": 5000,
                     "x-dead-letter-exchange": "pesanan" } },
    { "name": "retry.30s", "vhost": "/", "durable": true,
      "arguments": { "x-message-ttl": 30000,
                     "x-dead-letter-exchange": "pesanan" } },
    { "name": "retry.5m", "vhost": "/", "durable": true,
      "arguments": { "x-message-ttl": 300000,
                     "x-dead-letter-exchange": "pesanan" } },

    { "name": "pesanan.dlq", "vhost": "/", "durable": true,
      "arguments": { "x-queue-type": "quorum",
                     "x-message-ttl": 604800000 } }
  ],
  "bindings": [
    { "source": "pesanan", "destination": "pesanan.email",
      "destination_type": "queue", "routing_key": "pesanan.*.dibuat" },
    { "source": "pesanan", "destination": "pesanan.ledger",
      "destination_type": "queue", "routing_key": "pesanan.*.dibuat" },
    { "source": "pesanan", "destination": "pesanan.audit",
      "destination_type": "queue", "routing_key": "pesanan.#" },
    { "source": "pesanan.tak-terkirim", "destination": "pesanan.tak-terkirim.q",
      "destination_type": "queue", "routing_key": "" },
    { "source": "pesanan.dlx", "destination": "retry.5s",
      "destination_type": "queue", "routing_key": "retry.5s" },
    { "source": "pesanan.dlx", "destination": "retry.30s",
      "destination_type": "queue", "routing_key": "retry.30s" },
    { "source": "pesanan.dlx", "destination": "retry.5m",
      "destination_type": "queue", "routing_key": "retry.5m" },
    { "source": "pesanan.dlx", "destination": "pesanan.dlq",
      "destination_type": "queue", "routing_key": "habis" }
  ],
  "policies": [
    { "vhost": "/", "name": "batas-antrean", "pattern": "^pesanan\\\\.",
      "apply-to": "queues", "priority": 10,
      "definition": { "max-length": 200000,
                      "max-length-bytes": 1073741824,
                      "overflow": "reject-publish" } }
  ]
}</pre>
<p><strong>Selesai bila:</strong> mem-publish routing key yang belum punya binding membuat pesan mendarat di <code>pesanan.tak-terkirim.q</code>, bukan lenyap.</p>`
            },
            {
                title: 'Tahap 3 — Outbox: Menutup Celah Dual Write',
                body: `
<p>Tidak ada pesanan yang boleh tercatat di basis data tanpa peristiwanya terkirim, dan sebaliknya.</p>
<pre data-lang="sql" data-file="db/outbox.sql">CREATE TABLE outbox (
  id           BIGSERIAL PRIMARY KEY,
  routing_key  TEXT        NOT NULL,
  payload      JSONB       NOT NULL,
  dibuat_pada  TIMESTAMPTZ NOT NULL DEFAULT now(),
  dikirim_pada TIMESTAMPTZ,
  percobaan    INT         NOT NULL DEFAULT 0,
  galat        TEXT
);

CREATE INDEX outbox_belum_terkirim ON outbox (id) WHERE dikirim_pada IS NULL;</pre>

<pre data-lang="javascript" data-file="services/pesanan/buat.js">async function buatPesanan(data) {
  return db.transaction(async (trx) => {
    const [pesanan] = await trx('pesanan').insert({
      id: data.id, merchant_id: data.merchant_id,
      total: data.total, status: 'menunggu_bayar'
    }).returning('*');

    // niat mengirim pesan ikut dalam transaksi yang sama
    await trx('outbox').insert({
      routing_key: 'pesanan.' + data.wilayah + '.dibuat',
      payload: JSON.stringify(pesanan)
    });

    return pesanan;
  });
  // keduanya berhasil, atau keduanya batal. Tidak ada keadaan setengah.
}</pre>

<pre data-lang="javascript" data-file="services/pesanan/pengirim-outbox.js">async function putaran() {
  const baris = await db('outbox')
    .whereNull('dikirim_pada')
    .orderBy('id')
    .limit(200)
    .forUpdate().skipLocked();        // aman untuk banyak instance

  for (const r of baris) {
    try {
      await new Promise((res, rej) =>
        ch.publish('pesanan', r.routing_key,
          Buffer.from(JSON.stringify(r.payload)), {
            persistent: true,
            mandatory: true,
            contentType: 'application/json',
            messageId: String(r.id),      // ← kunci idempotensi konsumer
            timestamp: Math.floor(Date.parse(r.dibuat_pada) / 1000),
            appId: 'layanan-pesanan',
            headers: { 'x-versi-skema': 1 }
          }, (e) => e ? rej(e) : res()));

      await db('outbox').where({ id: r.id })
        .update({ dikirim_pada: db.fn.now() });
    } catch (e) {
      await db('outbox').where({ id: r.id })
        .update({ percobaan: r.percobaan + 1, galat: e.message });
    }
  }
}

setInterval(() => putaran().catch(console.error), 1000);</pre>
<div class="callout callout-info">
    <div class="callout-title">💡 <code>messageId</code> = <code>outbox.id</code></div>
    <p>Ini pilihan yang membuat seluruh sistem lebih sederhana: id-nya stabil di seluruh percobaan pengiriman, unik secara alami, dan langsung bisa dipakai konsumer sebagai kunci deduplikasi tanpa mengarang apa pun.</p>
</div>
<p><strong>Selesai bila:</strong> mematikan RabbitMQ tidak membuat pembuatan pesanan gagal, dan seluruh pesan menyusul terkirim setelah broker hidup kembali.</p>`
            },
            {
                title: 'Tahap 4 — Konsumer Idempoten dengan Retry Berjenjang',
                body: `
<p>Konsumer harus benar walaupun pesan yang sama datang lima kali, dan harus menyerah dengan rapi setelah percobaan yang wajar.</p>
<pre data-lang="sql" data-file="db/dedup.sql">CREATE TABLE pesan_diproses (
  message_id    TEXT PRIMARY KEY,
  konsumer      TEXT        NOT NULL,
  diproses_pada TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX pesan_diproses_waktu ON pesan_diproses (diproses_pada);</pre>

<pre data-lang="javascript" data-file="services/notifikasi/konsumer.js">const TINGKAT = ['retry.5s', 'retry.30s', 'retry.5m'];

function percobaanKe(msg) {
  const d = (msg.properties.headers || {})['x-death'];
  if (!Array.isArray(d) || !d.length) return 0;
  return d.reduce((a, x) => a + (x.count || 0), 0);
}

await ch.prefetch(10);                       // tugas lambat: prefetch kecil

await ch.consume('pesanan.email', async (msg) => {
  if (!msg) return;

  const id = msg.properties.messageId;
  if (!id) {                                 // producer melanggar kontrak
    ch.publish('pesanan.dlx', 'habis', msg.content, msg.properties);
    ch.ack(msg);
    return;
  }

  try {
    await db.transaction(async (trx) => {
      // klaim dan pekerjaan DALAM SATU transaksi
      await trx('pesan_diproses').insert({ message_id: id, konsumer: 'email' });
      await kirimEmail(trx, JSON.parse(msg.content.toString()));
    });
    ch.ack(msg);

  } catch (e) {
    if (e.code === '23505') { ch.ack(msg); return; }   // duplikat: aman

    if (e.permanen) {                        // payload rusak, skema tak dikenal
      ch.publish('pesanan.dlx', 'habis', msg.content, msg.properties);
      ch.ack(msg);
      return;
    }

    const n = percobaanKe(msg);
    const tujuan = n < TINGKAT.length ? TINGKAT[n] : 'habis';
    ch.publish('pesanan.dlx', tujuan, msg.content, msg.properties);
    ch.ack(msg);
  }
}, { noAck: false, consumerTag: 'email-' + process.pid });</pre>
<p><strong>Selesai bila:</strong> mengirim pesan dengan <code>messageId</code> identik lima kali menghasilkan tepat satu email, dan pesan yang selalu gagal berakhir di <code>pesanan.dlq</code> setelah melewati ketiga tingkat retry.</p>`
            },
            {
                title: 'Tahap 5 — Klien yang Tahan Gangguan',
                body: `
<p>Broker akan di-restart. Jaringan akan berkedip. Aplikasi harus pulih sendiri tanpa kehilangan pekerjaan maupun berhenti memproses diam-diam.</p>
<pre data-lang="javascript" data-file="lib/rabbit.js">class Rabbit {
  constructor(url, nama) {
    this.url = url; this.nama = nama;
    this.penyiap = [];               // dipanggil ULANG setiap reconnect
    this.percobaan = 0;
    this.tutupSengaja = false;
  }

  daftar(fn) { this.penyiap.push(fn); }

  async sambung() {
    try {
      this.conn = await amqp.connect(this.url, {
        heartbeat: 60,
        clientProperties: { connection_name: this.nama }
      });
      this.conn.on('error', e => console.error('conn:', e.message));
      this.conn.on('close', () => {
        if (!this.tutupSengaja) this.jadwalkan();
      });

      this.chPub = await this.conn.createConfirmChannel();
      this.chSub = await this.conn.createChannel();
      this.chPub.on('return', m =>
        console.error('TIDAK TERKIRIM:', m.fields.routingKey));

      this.percobaan = 0;
      // WAJIB: topologi, prefetch, dan consume dipasang ulang
      for (const f of this.penyiap) await f(this.chPub, this.chSub);
      console.log('tersambung:', this.nama);

    } catch (e) {
      console.error('gagal sambung:', e.message);
      this.jadwalkan();
    }
  }

  jadwalkan() {
    const dasar  = Math.min(1000 * 2 ** this.percobaan++, 30000);
    const jitter = Math.random() * dasar * 0.3;    // cegah thundering herd
    setTimeout(() => this.sambung(), dasar + jitter);
  }
}</pre>
<pre data-lang="javascript" data-file="graceful shutdown">let berjalan = 0;

async function matikan() {
  await rabbit.chSub.cancel('email-' + process.pid);   // stop pesan baru
  const batas = Date.now() + 25000;
  while (berjalan > 0 && Date.now() < batas)
    await new Promise(r => setTimeout(r, 200));
  rabbit.tutupSengaja = true;
  await rabbit.conn.close().catch(() => {});
  process.exit(0);
}
process.on('SIGTERM', matikan);</pre>
<p><strong>Selesai bila:</strong> mematikan broker selama 30 detik di tengah beban tidak menghilangkan satu pun pesan, dan <code>rabbitmqctl list_consumers</code> menunjukkan konsumer terdaftar kembali setelah broker hidup.</p>`
            },
            {
                title: 'Tahap 6 — Keamanan Berprinsip Least Privilege',
                body: `
<p>Setiap layanan punya identitasnya sendiri, dengan izin sesempit yang benar-benar dibutuhkan.</p>
<pre data-lang="bash" data-file="ops/keamanan.sh">#!/usr/bin/env bash
set -euo pipefail

# admin baru, lalu hapus default yang berbahaya
rabbitmqctl add_user admin "$(openssl rand -base64 32)"
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
rabbitmqctl delete_user guest

# producer: hanya publish ke exchange pesanan, tidak boleh membuat apa pun
rabbitmqctl add_user svc-pesanan "$(openssl rand -base64 24)"
rabbitmqctl set_permissions -p / svc-pesanan "^$" "^pesanan$" "^$"

# konsumer email: hanya queue miliknya dan jalur DLX
rabbitmqctl add_user svc-notifikasi "$(openssl rand -base64 24)"
rabbitmqctl set_permissions -p / svc-notifikasi \\
  "^$" "^pesanan\\.(dlx|email)$" "^pesanan\\.email$"

# konsumer ledger
rabbitmqctl add_user svc-ledger "$(openssl rand -base64 24)"
rabbitmqctl set_permissions -p / svc-ledger \\
  "^$" "^pesanan\\.(dlx|ledger)$" "^pesanan\\.ledger$"

# monitoring: metrik saja, tidak menyentuh pesan
rabbitmqctl add_user monitoring "$(openssl rand -base64 24)"
rabbitmqctl set_user_tags monitoring monitoring
rabbitmqctl set_permissions -p / monitoring "^$" "^$" "^$"

rabbitmqctl list_users
rabbitmqctl list_permissions -p /</pre>
<p>Perhatikan bahwa tidak satu pun user layanan diberi tag. Mereka hanya perlu AMQP; tidak ada alasan mereka bisa membuka UI manajemen atau mengubah policy.</p>
<p><strong>Selesai bila:</strong> <code>svc-pesanan</code> terbukti gagal membuat queue, dan <code>svc-notifikasi</code> terbukti gagal membaca <code>pesanan.ledger</code>.</p>`
            },
            {
                title: 'Tahap 7 — Monitoring dan Alert yang Menangkap Masalah Lebih Awal',
                body: `
<p>Yang perlu dipantau bukan hanya "broker hidup", melainkan apakah pesan benar-benar mengalir.</p>
<pre data-lang="yaml" data-file="prometheus/rules/rabbitmq.yml">groups:
  - name: rabbitmq-bayarcepat
    rules:
      - alert: BrokerMemblokirPublish
        expr: |
          rabbitmq_alarms_memory_used_watermark == 1
            or rabbitmq_alarms_free_disk_space_watermark == 1
        for: 1m
        labels: { severity: critical, tim: platform }
        annotations:
          summary: 'RabbitMQ memblokir SELURUH publish (alarm aktif)'
          runbook_url: https://wiki.internal/runbook/rmq-alarm

      - alert: QueueTanpaKonsumer
        expr: rabbitmq_queue_consumers{queue=~"pesanan\\\\.(email|ledger)"} == 0
        for: 5m
        labels: { severity: critical, tim: pembayaran }
        annotations:
          summary: 'Queue {{ $labels.queue }} tidak punya konsumer'

      - alert: AntreanTumbuhTerus
        expr: |
          sum by (queue) (rate(rabbitmq_queue_messages_published_total[10m]))
            - sum by (queue) (rate(rabbitmq_queue_messages_delivered_total[10m]))
            > 0
        for: 15m
        labels: { severity: warning, tim: pembayaran }

      - alert: DLQTidakKosong
        expr: rabbitmq_queue_messages{queue="pesanan.dlq"} > 0
        for: 10m
        labels: { severity: warning, tim: pembayaran }
        annotations:
          summary: 'Ada {{ $value }} pesan gagal permanen di DLQ'
          runbook_url: https://wiki.internal/runbook/rmq-dlq

      - alert: PesanTakTerkirim
        expr: rabbitmq_queue_messages{queue="pesanan.tak-terkirim.q"} > 0
        for: 5m
        labels: { severity: warning, tim: pembayaran }
        annotations:
          summary: 'Ada routing key tanpa binding — kemungkinan fitur baru'

      - alert: OutboxTertinggal
        expr: bayarcepat_outbox_belum_terkirim > 1000
        for: 10m
        labels: { severity: warning, tim: pembayaran }</pre>
<div class="callout callout-info">
    <div class="callout-title">💡 Alert <code>PesanTakTerkirim</code> adalah favorit tersembunyi</div>
    <p>Ia menangkap kelas bug yang biasanya lolos berminggu-minggu: seseorang menambahkan routing key baru tanpa binding. Tanpa alternate exchange dan alert ini, gejalanya hanya "fitur itu kadang tidak jalan".</p>
</div>
<p><strong>Selesai bila:</strong> kelima alert pernah Anda picu dengan sengaja di staging dan terbukti berbunyi.</p>`
            },
            {
                title: 'Tahap 8 — Semua ke Git, lalu Buktikan Bisa Dibangun Ulang',
                body: `
<p>Tahap terakhir yang membuktikan seluruh pekerjaan sebelumnya bertahan.</p>
<pre data-lang="bash" data-file="ops/ekspor.sh">#!/usr/bin/env bash
set -euo pipefail

rabbitmqctl export_definitions /tmp/definitions.json

# WAJIB: buang user beserta password_hash sebelum masuk Git
jq 'del(.users)' /tmp/definitions.json > definitions.json

git add definitions.json rabbitmq.conf docker-compose.yml
git commit -m "topologi rabbitmq: $(date +%F)"</pre>

<pre data-lang="bash" data-file="ops/uji-pemulihan.sh">#!/usr/bin/env bash
set -euo pipefail

echo "== 1. hancurkan total =="
docker compose down -v

echo "== 2. bangun ulang dari Git saja =="
docker compose up -d --wait
sleep 30

echo "== 3. jalankan ulang penyiapan user =="
bash ops/keamanan.sh > /dev/null

echo "== 4. verifikasi topologi =="
EX=$(rabbitmqctl list_exchanges --formatter=json | jq 'length')
Q=$(rabbitmqctl  list_queues    --formatter=json | jq 'length')
B=$(rabbitmqctl  list_bindings  --formatter=json | jq 'length')
echo "   exchange:$EX queue:$Q binding:$B"
[ "$Q" -ge 8 ] || { echo "GAGAL: queue tidak lengkap"; exit 1; }

echo "== 5. verifikasi tipe queue benar-benar quorum =="
CLASSIC=$(rabbitmqctl list_queues name type --formatter=json \\
          | jq '[.[] | select(.type=="classic")] | length')
[ "$CLASSIC" -eq 0 ] || { echo "GAGAL: masih ada classic queue"; exit 1; }

echo "== 6. uji jalur penuh =="
node uji-e2e.js       # buat pesanan → cek email terkirim tepat sekali

echo "== LULUS: broker sepenuhnya reproducible =="</pre>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Yang tidak ikut pulih — dan memang seharusnya begitu</div>
    <p>Isi queue tidak dipulihkan, karena pesan bersifat sementara. Itulah tepatnya alasan Tahap 3 ada: sumber kebenaran berada di tabel <code>outbox</code> dan tabel bisnis Anda. Setelah broker dibangun ulang, pengirim outbox akan mengirim ulang apa pun yang belum sempat terkirim.</p>
</div>
<p><strong>Selesai bila:</strong> skrip berjalan hijau dari awal sampai akhir, tanpa satu pun langkah manual.</p>`
            }
        ],
        criteria: [
            'Cluster tiga node terbentuk dengan <code>pause_minority</code>, tanpa partisi, dan seluruh node memakai Erlang cookie yang identik.',
            'User <code>guest</code> sudah dihapus; setiap layanan punya user sendiri tanpa tag, dengan izin regex yang sempit dan terbukti membatasi.',
            'Seluruh queue penting bertipe <strong>quorum</strong> dengan <code>x-delivery-limit</code>; tidak ada satu pun classic queue tersisa untuk data penting.',
            'Setiap exchange produksi punya <code>alternate-exchange</code>, dan pesan dengan routing key tanpa binding terbukti mendarat di queue penampung.',
            'Setiap queue kerja punya batas panjang lewat policy, DLX, dan pemilik yang jelas dari namanya.',
            'Rantai retry tiga tingkat (5 detik, 30 detik, 5 menit) bekerja, dan pesan yang selalu gagal berakhir di DLQ — bukan berputar tanpa henti.',
            'Producer memakai <code>createConfirmChannel</code> dengan <code>mandatory=true</code> dan handler <code>basic.return</code> yang benar-benar mencatat.',
            'Tidak ada dual write: setiap pesan penting lahir dari tabel <code>outbox</code> dalam transaksi yang sama dengan data bisnisnya.',
            'Mematikan RabbitMQ selama 30 detik tidak menggagalkan pembuatan pesanan, dan seluruh pesan menyusul terkirim setelahnya.',
            'Konsumer idempoten: mengirim <code>messageId</code> identik lima kali menghasilkan tepat satu efek, dibuktikan dengan kueri basis data.',
            'Klaim deduplikasi dan pekerjaan bisnis berada dalam <strong>satu transaksi</strong> yang sama.',
            '<code>prefetch</code> disetel eksplisit sesuai durasi tugas, dan graceful shutdown terbukti tidak menghasilkan pekerjaan ganda saat deploy.',
            'Reconnect memasang ulang topologi, prefetch, dan konsumer; diuji dengan mematikan broker di tengah beban.',
            'Kelima alert (alarm broker, queue tanpa konsumer, antrean tumbuh, DLQ, pesan tak terkirim) pernah dipicu sengaja dan terbukti berbunyi.',
            'Topologi ada di Git tanpa <code>password_hash</code>, dan <code>docker compose down -v</code> lalu bangun ulang memulihkan seluruhnya secara otomatis.',
            'Ada runbook tertulis untuk minimal tiga gejala: publish menggantung, queue menumpuk, dan pesan hilang.'
        ],
        outro: `
<h3>Tantangan Tambahan</h3>
<ul>
    <li><strong>Urutan per entitas.</strong> Tambahkan <code>rabbitmq_consistent_hash_exchange</code> agar seluruh peristiwa satu <code>pesanan_id</code> selalu jatuh ke shard yang sama, lalu buktikan urutannya terjaga sementara pesanan berbeda tetap diproses paralel.</li>
    <li><strong>Saga dengan kompensasi.</strong> Rangkai pesanan → stok → pembayaran, lengkap dengan langkah pembatal yang idempoten. Uji dengan sengaja menggagalkan pembayaran di tengah alur.</li>
    <li><strong>Chaos pada partisi.</strong> Putuskan jaringan antar node (bukan hanya mematikan proses) dengan <code>iptables</code>, amati <code>pause_minority</code> bekerja, dan pastikan tidak ada pesan terkonfirmasi yang hilang setelah pulih.</li>
    <li><strong>Uji beban.</strong> Ukur throughput pada tiga konfigurasi: transient tanpa confirm, persistent tanpa confirm, dan persistent dengan confirm batch. Catat angkanya dan tentukan jaminan mana yang layak untuk tiap jenis pesan.</li>
    <li><strong>Migrasi tanpa henti.</strong> Pindahkan <code>pesanan.email</code> ke broker baru memakai Shovel dengan <code>ack-mode: on-confirm</code>, tanpa kehilangan pesan dan tanpa menghentikan produsen.</li>
</ul>`
    },

    /* ================== UJIAN AKHIR ================== */
    exam: {
        durationMin: 40,
        passScore: 75,
        subtitle: '25 soal: AMQP, routing, keandalan, pola aplikasi, cluster, keamanan, dan operasi. Lulus ≥ 75%.',
        questions: [
            {
                q: 'Producer melakukan publish ke mana?',
                opts: ['Langsung ke queue', 'Ke exchange beserta routing key', 'Ke consumer', 'Ke binding'],
                a: 1,
                exp: 'Producer selalu publish ke exchange. Exchange yang memutuskan queue mana menerima salinannya berdasarkan binding yang terdaftar.'
            },
            {
                q: 'Pesan di-publish tetapi tidak ada binding yang cocok. Apa yang terjadi secara bawaan?',
                opts: [
                    'Broker mengembalikan error ke producer',
                    'Pesan dibuang diam-diam dan publish tetap dianggap berhasil',
                    'Pesan masuk ke queue default',
                    'Pesan disimpan sampai ada binding cocok'
                ],
                a: 1,
                exp: 'Exchange membuangnya tanpa memberi tahu siapa pun. Gunakan <code>mandatory=true</code> dengan <code>basic.return</code>, atau setel <code>alternate-exchange</code>.'
            },
            {
                q: 'Publish menggantung tanpa error dan tanpa timeout. Perintah pertama yang dijalankan?',
                opts: [
                    '<code>rabbitmqctl list_queues</code>',
                    '<code>rabbitmq-diagnostics alarms</code>',
                    '<code>rabbitmqctl list_connections</code>',
                    'Restart broker'
                ],
                a: 1,
                exp: 'Alarm memori atau disk memblokir seluruh publish tanpa mengirim error apa pun. Memeriksa alarm langsung membedakan masalah jaringan dari mekanisme perlindungan broker.'
            },
            {
                q: 'Container RabbitMQ di-restart dan semua queue tampak hilang meski volume terpasang. Penyebabnya?',
                opts: [
                    'Volume tidak ter-mount',
                    'Hostname berubah sehingga nama node dan direktori datanya ikut berubah',
                    'Plugin management mati',
                    'Erlang cookie berubah'
                ],
                a: 1,
                exp: 'Direktori data mengikuti nama node <code>rabbit@&lt;hostname&gt;</code>. Hostname acak membuat broker membuat direktori baru yang kosong.'
            },
            {
                q: 'Binding <code>pesanan.*</code> cocok dengan routing key mana?',
                opts: [
                    '<code>pesanan.jakarta.dibuat</code>',
                    '<code>pesanan.dibuat</code>',
                    'Keduanya',
                    'Tidak keduanya'
                ],
                a: 1,
                exp: '<code>*</code> cocok dengan tepat satu kata. Untuk mencocokkan jumlah kata berapa pun setelah "pesanan", diperlukan <code>pesanan.#</code>.'
            },
            {
                q: 'Tiga konsumer menempel pada SATU queue. Apa yang terjadi pada tiap pesan?',
                opts: [
                    'Setiap konsumer menerima salinannya',
                    'Beban dibagi — satu pesan diproses satu konsumer',
                    'Hanya konsumer pertama yang menerima',
                    'Pesan ditolak karena bentrok'
                ],
                a: 1,
                exp: 'Konsumer pada satu queue berbagi beban. Agar setiap pihak menerima salinan, dibutuhkan queue terpisah dengan binding masing-masing.'
            },
            {
                q: 'Konsumer memakai <code>noAck: true</code> lalu prosesnya mati di tengah pemrosesan. Apa yang terjadi pada pesan itu?',
                opts: [
                    'Dikembalikan ke queue',
                    'Hilang selamanya',
                    'Masuk ke DLQ',
                    'Ditahan broker sampai konsumer kembali'
                ],
                a: 1,
                exp: 'Auto-ack membuat broker melupakan pesan begitu menuliskannya ke soket. Tidak ada requeue, tidak ada DLQ, tidak ada jejak.'
            },
            {
                q: 'Tugas memakan waktu 10 detik per pesan. Nilai prefetch yang paling tepat?',
                opts: ['500', '100', '1–5', '0 (tak terbatas)'],
                a: 2,
                exp: 'Untuk tugas lambat, prefetch kecil menjaga pembagian beban tetap adil. Prefetch besar membuat satu konsumer memesan pekerjaan berjam-jam sementara yang lain menganggur.'
            },
            {
                q: 'Queue menunjukkan <code>messages_ready</code> 50.000 dan <code>consumers</code> 0. Diagnosis?',
                opts: [
                    'Konsumer terlalu lambat',
                    'Tidak ada konsumer terhubung — aplikasi mati atau gagal reconnect',
                    'Prefetch terlalu kecil',
                    'Alarm disk aktif'
                ],
                a: 1,
                exp: '<code>consumers = 0</code> berarti tidak ada konsumer terdaftar. Bila konsumer hanya lambat, angka itu tetap positif dan <code>messages_unacknowledged</code> mendekati prefetch dikali jumlah konsumer.'
            },
            {
                q: 'Queue <code>durable=true</code> tetapi pesan dikirim dengan <code>delivery_mode=1</code>. Setelah broker restart?',
                opts: [
                    'Semua pesan selamat',
                    'Queue ada kembali tetapi kosong',
                    'Queue ikut hilang',
                    'Pesan pindah ke DLQ'
                ],
                a: 1,
                exp: '<code>durable</code> menjamin definisi queue bertahan; isinya baru bertahan bila pesannya persistent (<code>delivery_mode=2</code>).'
            },
            {
                q: 'Kenapa transaksi AMQP (<code>tx.select</code>) sebaiknya dihindari?',
                opts: [
                    'Sudah dihapus dari protokol',
                    'Setiap commit memaksa fsync sinkron sehingga throughput anjlok drastis',
                    'Tidak bisa dipakai dengan queue durable',
                    'Hanya bekerja pada satu node'
                ],
                a: 1,
                exp: 'Throughput bisa turun sekitar seratus kali lipat. Publisher confirms memberi jaminan setara untuk kebutuhan praktis dengan biaya jauh lebih rendah.'
            },
            {
                q: 'Manakah yang <strong>bukan</strong> pemicu pesan masuk ke dead letter exchange?',
                opts: [
                    'Ditolak dengan <code>requeue=false</code>',
                    'TTL pesan habis',
                    'Queue penuh dengan kebijakan overflow',
                    'Konsumer memanggil <code>ack</code>'
                ],
                a: 3,
                exp: '<code>ack</code> berarti berhasil diproses. Pemicu dead letter adalah penolakan tanpa requeue, kedaluwarsa, overflow, atau terlampauinya <code>x-delivery-limit</code>.'
            },
            {
                q: 'Kenapa pola retry memakai queue terpisah untuk tiap tingkat penundaan?',
                opts: [
                    'Agar lebih mudah dipantau',
                    'Karena TTL hanya dievaluasi pada pesan di kepala antrean',
                    'Karena satu queue hanya boleh punya satu DLX',
                    'Karena TTL tidak berlaku pada quorum queue'
                ],
                a: 1,
                exp: 'RabbitMQ memeriksa kedaluwarsa dari depan antrean, sehingga pesan ber-TTL pendek di belakang pesan ber-TTL panjang harus menunggu.'
            },
            {
                q: 'Header apa yang berisi riwayat kenapa dan berapa kali pesan di-dead-letter?',
                opts: ['<code>x-retry-count</code>', '<code>x-death</code>', '<code>x-delivery-limit</code>', '<code>redelivered</code>'],
                a: 1,
                exp: '<code>x-death</code> disisipkan broker dan memuat <code>count</code>, <code>reason</code>, queue asal, exchange, routing key, dan waktu kejadian.'
            },
            {
                q: 'Berapa node yang dianjurkan untuk cluster dengan quorum queue?',
                opts: ['2', '3 atau 5 (ganjil)', '4', 'Berapa pun sama saja'],
                a: 1,
                exp: 'Quorum memerlukan mayoritas. Jumlah ganjil memaksimalkan toleransi kegagalan: 3 node tahan 1 kegagalan, 5 node tahan 2.'
            },
            {
                q: 'Fitur apa yang ada di classic queue tetapi TIDAK di quorum queue?',
                opts: [
                    'Durability',
                    'Prioritas pesan (<code>x-max-priority</code>)',
                    'Dead letter exchange',
                    'Batas panjang antrean'
                ],
                a: 1,
                exp: 'Quorum queue tidak mendukung prioritas pesan. Alternatifnya queue terpisah per tingkat prioritas, yang biasanya juga lebih mudah dipantau.'
            },
            {
                q: 'Apa yang terjadi pada classic queue dalam cluster ketika node tempatnya berada mati?',
                opts: [
                    'Queue pindah otomatis ke node lain',
                    'Queue tidak tersedia sampai node kembali',
                    'Isi queue direplikasi dari node lain',
                    'Queue dibuat ulang kosong'
                ],
                a: 1,
                exp: 'Classic queue hidup di satu node saja; node lain hanya meneruskan permintaan. Inilah alasan quorum queue menjadi pilihan default untuk data penting.'
            },
            {
                q: 'Strategi penanganan partisi mana yang paling aman untuk data?',
                opts: ['<code>ignore</code>', '<code>autoheal</code>', '<code>pause_minority</code>', 'Semua setara'],
                a: 2,
                exp: '<code>pause_minority</code> menghentikan layanan pada sisi minoritas sehingga data tidak menyimpang. <code>autoheal</code> memulihkan otomatis tetapi membuang data sisi yang kalah.'
            },
            {
                q: 'Kenapa pola transactional outbox diperlukan?',
                opts: [
                    'Untuk mempercepat publish',
                    'Karena commit basis data dan publish ke broker tidak bisa dilakukan secara atomik',
                    'Untuk mengurangi jumlah koneksi',
                    'Karena RabbitMQ tidak mendukung transaksi'
                ],
                a: 1,
                exp: 'Dua sistem berbeda tidak bisa di-commit bersama. Outbox memindahkan niat mengirim pesan ke dalam transaksi basis data yang sama.'
            },
            {
                q: 'Jaminan pengiriman apa yang sebenarnya diberikan RabbitMQ?',
                opts: ['Exactly-once', 'At-least-once', 'At-most-once', 'Tergantung tipe queue'],
                a: 1,
                exp: 'RabbitMQ menjamin at-least-once bila ack manual dipakai. Efek exactly-once dicapai dengan idempotensi di sisi konsumer, bukan oleh broker.'
            },
            {
                q: 'Manakah operasi yang idempoten secara alami?',
                opts: [
                    '<code>UPDATE produk SET stok = stok - 1</code>',
                    '<code>UPDATE pesanan SET status=\'dibayar\' WHERE id=$1 AND status=\'menunggu_bayar\'</code>',
                    '<code>INSERT INTO log VALUES (...)</code>',
                    '<code>UPDATE saldo SET nilai = nilai + 100</code>'
                ],
                a: 1,
                exp: 'Transisi state bersyarat hanya berlaku sekali; eksekusi kedua mengubah nol baris. Operasi penambahan relatif selalu berlipat bila diulang.'
            },
            {
                q: 'Apa yang paling sering terlupakan saat menulis logika reconnect?',
                opts: [
                    'Menutup koneksi lama',
                    'Memasang ulang topologi dan memanggil ulang <code>basic.consume</code>',
                    'Mengubah heartbeat',
                    'Membuat connection baru'
                ],
                a: 1,
                exp: 'Deklarasi, binding, prefetch, dan konsumer melekat pada channel yang ikut hilang. Tanpa dipasang ulang, aplikasi tampak sehat tetapi tidak memproses apa pun.'
            },
            {
                q: 'Tag apa yang sebaiknya diberikan kepada user aplikasi?',
                opts: ['<code>administrator</code>', '<code>management</code>', '<code>monitoring</code>', 'Tanpa tag sama sekali'],
                a: 3,
                exp: 'Aplikasi hanya memerlukan AMQP. Tag apa pun memberi akses UI atau kemampuan administratif yang tidak dibutuhkan dan memperbesar dampak kebocoran kredensial.'
            },
            {
                q: 'Koneksi producer berada di state <code>flow</code>. Artinya?',
                opts: [
                    'Koneksi rusak dan harus dibuat ulang',
                    'Broker memperlambat producer karena tidak sanggup menulis secepat itu',
                    'Alarm memori sedang aktif',
                    'Konsumer sedang menggantung'
                ],
                a: 1,
                exp: 'Flow control adalah rem otomatis berbasis kredit yang bekerja sebagaimana dirancang, tetapi menandakan broker berada di batas kemampuannya.'
            },
            {
                q: 'Apa yang wajib dilakukan SEBELUM upgrade ke RabbitMQ 4.0?',
                opts: [
                    'Menghapus semua DLQ',
                    'Memigrasikan classic mirrored queue ke quorum queue',
                    'Menonaktifkan plugin management',
                    'Menaikkan <code>vm_memory_high_watermark</code>'
                ],
                a: 1,
                exp: 'RabbitMQ 4.0 menghapus classic queue mirroring. Kebijakan <code>ha-mode</code> berhenti berfungsi secara diam-diam sehingga queue kehilangan replikasi tanpa peringatan.'
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

        s.queues = s.queues || [
            { name: 'pesanan.email',         type: 'quorum',  durable: true, ready: 1240, unacked: 10, consumers: 2 },
            { name: 'pesanan.ledger',        type: 'quorum',  durable: true, ready: 84,   unacked: 20, consumers: 3 },
            { name: 'pesanan.audit',         type: 'quorum',  durable: true, ready: 0,    unacked: 0,  consumers: 1 },
            { name: 'pesanan.tak-terkirim.q',type: 'quorum',  durable: true, ready: 0,    unacked: 0,  consumers: 0 },
            { name: 'retry.5s',              type: 'classic', durable: true, ready: 3,    unacked: 0,  consumers: 0 },
            { name: 'retry.30s',             type: 'classic', durable: true, ready: 1,    unacked: 0,  consumers: 0 },
            { name: 'pesanan.dlq',           type: 'quorum',  durable: true, ready: 7,    unacked: 0,  consumers: 0 }
        ];
        s.exchanges = s.exchanges || [
            { name: '',                     type: 'direct', durable: true },
            { name: 'amq.direct',           type: 'direct', durable: true },
            { name: 'amq.fanout',           type: 'fanout', durable: true },
            { name: 'amq.topic',            type: 'topic',  durable: true },
            { name: 'pesanan',              type: 'topic',  durable: true },
            { name: 'pesanan.dlx',          type: 'direct', durable: true },
            { name: 'pesanan.tak-terkirim', type: 'fanout', durable: true }
        ];
        s.bindings = s.bindings || [
            { src: 'pesanan', dst: 'pesanan.email',  rk: 'pesanan.*.dibuat' },
            { src: 'pesanan', dst: 'pesanan.ledger', rk: 'pesanan.*.dibuat' },
            { src: 'pesanan', dst: 'pesanan.audit',  rk: 'pesanan.#' },
            { src: 'pesanan.dlx', dst: 'retry.5s',   rk: 'retry.5s' },
            { src: 'pesanan.dlx', dst: 'retry.30s',  rk: 'retry.30s' },
            { src: 'pesanan.dlx', dst: 'pesanan.dlq', rk: 'habis' },
            { src: 'pesanan.tak-terkirim', dst: 'pesanan.tak-terkirim.q', rk: '' }
        ];
        s.users = s.users || [
            { name: 'admin',         tags: 'administrator' },
            { name: 'svc-pesanan',   tags: '' },
            { name: 'svc-notifikasi',tags: '' },
            { name: 'monitoring',    tags: 'monitoring' },
            { name: 'guest',         tags: 'administrator' }
        ];
        s.policies = s.policies || [];
        s.alarm = s.alarm || null;
        s.nodes = s.nodes || ['rabbit@rabbit-1', 'rabbit@rabbit-2', 'rabbit@rabbit-3'];

        function cocokTopic(pola, rk) {
            const p = pola.split('.').map(x =>
                x === '*' ? '[^.]+' : x === '#' ? '.*' : x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            return new RegExp('^' + p.join('\\.').replace(/\\\.\.\*/g, '(\\..*)?') + '$').test(rk);
        }

        /* ---------------- help ---------------- */
        if (cmd === 'help') {
            info('Perintah yang dikenali simulator ini:');
            say('  rabbitmqctl list_queues [name messages ready unacked consumers type durable policy]');
            say('  rabbitmqctl list_exchanges | list_bindings | list_consumers');
            say('  rabbitmqctl list_connections [name user state] | list_channels [...]');
            say('  rabbitmqctl list_users | list_permissions -p / | list_vhosts | list_policies');
            say('  rabbitmqctl cluster_status | quorum_status <queue>');
            say('  rabbitmqctl set_policy <nama> <pola> <def> --apply-to queues');
            say('  rabbitmqctl add_user <u> <p> | delete_user <u> | set_user_tags <u> <tag>');
            say('  rabbitmqctl set_permissions -p / <u> "<conf>" "<write>" "<read>"');
            say('  rabbitmqctl export_definitions <berkas> | shovel_status');
            say('  rabbitmq-diagnostics ping|status|alarms|observer|memory_breakdown|check_running');
            say('  rabbitmq-plugins list | enable <plugin>');
            say('  rabbitmqadmin declare queue|exchange|binding … | publish … | get queue=…');
            say('  rabbitmqadmin move_messages src_queue=… dest_queue=…');
            say('  docker compose up -d | restart rabbitmq | stop rabbitmq  |  clear');
            return;
        }

        /* ---------------- diagnostics ---------------- */
        if (cmd === 'rabbitmq-diagnostics ping') {
            ok('Ping succeeded');
            return;
        }

        if (cmd === 'rabbitmq-diagnostics check_running') {
            ok('RabbitMQ on node rabbit@rabbit-1 is fully booted and running');
            return;
        }

        if (cmd === 'rabbitmq-diagnostics status') {
            say('Status of node rabbit@rabbit-1 ...');
            say('');
            say('Runtime');
            say('  OS PID: 1');
            say('  RabbitMQ version: 4.0.5');
            say('  Erlang version: 26.2.5');
            say('');
            say('Memory');
            say('  Calculation strategy: rss');
            say('  Memory high watermark setting: 2.0 GB (absolute)');
            say('  Total memory used: ' + angka(380, 1400) + ' MB');
            say('');
            say('File Descriptors');
            const fd = +angka(180, 900);
            say('  Total: ' + fd + ', limit: 65536', fd / 65536 > 0.8 ? 't-warn' : 't-ok');
            say('');
            say('Disk Space');
            say('  Free disk space low watermark: 10 GB');
            say('  Free disk space: ' + angka(12, 80) + ' GB');
            say('');
            say('Totals');
            say('  Connection count: ' + angka(8, 60));
            say('  Queue count: ' + s.queues.length);
            return;
        }

        if (cmd === 'rabbitmq-diagnostics alarms') {
            if (s.alarm) {
                err('Alarm(s) in effect on node rabbit@rabbit-1:');
                err('  ' + s.alarm);
                say('');
                err('SELURUH publish sedang DIBLOKIR. Producer akan menggantung tanpa error.');
                dim('Konsumer tetap berjalan; alarm akan mati sendiri saat antrean menyusut.');
            } else {
                ok('No alarms in effect on node rabbit@rabbit-1');
                dim('Bila publish tetap menggantung, periksa state koneksi: flow atau blocked.');
            }
            return;
        }

        if (cmd === 'rabbitmq-diagnostics observer' || cmd === 'rabbitmq-diagnostics memory_breakdown') {
            info('Memory breakdown — node rabbit@rabbit-1:');
            say('  queue_procs .......... ' + angka(120, 900) + ' MB   ← isi antrean di memori');
            say('  binary ............... ' + angka(80, 600) + ' MB   ← payload pesan');
            say('  connection_readers ... ' + angka(10, 80) + ' MB');
            say('  connection_writers ... ' + angka(8, 60) + ' MB');
            say('  mgmt_db .............. ' + angka(20, 200) + ' MB   ← plugin management');
            say('  metadata ............. ' + angka(5, 40) + ' MB');
            say('  other ................ ' + angka(20, 120) + ' MB');
            say('');
            dim('queue_procs + binary yang besar = antrean menumpuk. Periksa konsumer.');
            return;
        }

        /* ---------------- list_queues ---------------- */
        if (/^rabbitmqctl list_queues/.test(cmd)) {
            const kolom = cmd.replace('rabbitmqctl list_queues', '').trim().split(/\s+/).filter(Boolean);
            const k = kolom.length ? kolom : ['name', 'messages'];
            const judul = { name: 'NAME', messages: 'MESSAGES', messages_ready: 'READY',
                            messages_unacknowledged: 'UNACKED', consumers: 'CONSUMERS',
                            type: 'TYPE', durable: 'DURABLE', policy: 'POLICY' };
            say(k.map(x => (judul[x] || x.toUpperCase()).padEnd(x === 'name' ? 26 : 12)).join(''));
            s.queues.forEach(q => {
                const nilai = {
                    name: q.name,
                    messages: String(q.ready + q.unacked),
                    messages_ready: String(q.ready),
                    messages_unacknowledged: String(q.unacked),
                    consumers: String(q.consumers),
                    type: q.type,
                    durable: String(q.durable),
                    policy: s.policies.length ? s.policies[0].name : ''
                };
                const baris = k.map(x => String(nilai[x] === undefined ? '-' : nilai[x])
                                    .padEnd(x === 'name' ? 26 : 12)).join('');
                say(baris, q.consumers === 0 && q.ready > 0 ? 't-warn' : '');
            });
            const bahaya = s.queues.filter(q => q.consumers === 0 && q.ready > 0);
            if (bahaya.length) {
                say('');
                err('⚠ ' + bahaya.length + ' queue punya pesan tetapi TANPA konsumer:');
                bahaya.forEach(q => dim('   ' + q.name + ' (' + q.ready + ' pesan)'));
                dim('  Untuk DLQ dan queue retry ini normal. Untuk queue kerja, ini insiden.');
            }
            return;
        }

        if (cmd === 'rabbitmqctl list_exchanges') {
            say('NAME                        TYPE      DURABLE');
            s.exchanges.forEach(e =>
                say((e.name === '' ? '(default)' : e.name).padEnd(28) +
                    e.type.padEnd(10) + e.durable));
            return;
        }

        if (cmd === 'rabbitmqctl list_bindings') {
            say('SOURCE                  DESTINATION              ROUTING_KEY');
            s.bindings.forEach(b =>
                say(b.src.padEnd(24) + b.dst.padEnd(25) + (b.rk || '(kosong)')));
            return;
        }

        if (cmd === 'rabbitmqctl list_consumers') {
            say('QUEUE                  CONSUMER_TAG            PREFETCH  ACK_REQUIRED');
            s.queues.filter(q => q.consumers > 0).forEach(q => {
                for (let i = 0; i < q.consumers; i++)
                    say(q.name.padEnd(23) + (q.name.split('.').pop() + '-' + (7000 + i)).padEnd(24) +
                        String(q.name.indexOf('email') >= 0 ? 10 : 20).padEnd(10) + 'true');
            });
            return;
        }

        if (/^rabbitmqctl list_connections/.test(cmd)) {
            say('NAME                            USER              STATE');
            const st = s.alarm ? 'blocked' : (Math.random() < 0.25 ? 'flow' : 'running');
            say('layanan-pesanan-producer'.padEnd(32) + 'svc-pesanan'.padEnd(18) + st,
                st === 'running' ? 't-ok' : 't-warn');
            say('layanan-notifikasi-consumer'.padEnd(32) + 'svc-notifikasi'.padEnd(18) + 'running', 't-ok');
            say('layanan-ledger-consumer'.padEnd(32) + 'svc-ledger'.padEnd(18) + 'running', 't-ok');
            if (st === 'flow') {
                say('');
                err('⚠ Koneksi dalam state "flow": broker memperlambat producer.');
                dim('  Ini perlindungan yang bekerja, bukan kerusakan. Periksa kecepatan disk,');
                dim('  ukuran pesan, jumlah queue, dan apakah konsumer mengimbangi laju publish.');
            }
            if (st === 'blocked') {
                say('');
                err('⚠ Koneksi DIBLOKIR oleh alarm. Jalankan: rabbitmq-diagnostics alarms');
            }
            return;
        }

        if (/^rabbitmqctl list_channels/.test(cmd)) {
            say('NAME                              PREFETCH  UNACKED  STATE');
            say('layanan-notifikasi (1)'.padEnd(34) + '10'.padEnd(10) + '10'.padEnd(9) + 'running');
            say('layanan-ledger (1)'.padEnd(34) + '20'.padEnd(10) + '20'.padEnd(9) + 'running');
            say('layanan-pesanan (1)'.padEnd(34) + '0'.padEnd(10) + '0'.padEnd(9) + 'running');
            dim('Prefetch 0 pada channel publisher itu normal — qos hanya untuk konsumer.');
            return;
        }

        /* ---------------- users & permissions ---------------- */
        if (cmd === 'rabbitmqctl list_users') {
            say('USER                 TAGS');
            s.users.forEach(u => say(u.name.padEnd(21) + (u.tags || '(tanpa tag)'),
                                     u.name === 'guest' ? 't-err' : ''));
            if (s.users.some(u => u.name === 'guest')) {
                say('');
                err('⚠ User "guest" masih ada. Passwordnya diketahui semua orang.');
                dim('  Perbaikan: rabbitmqctl delete_user guest');
            }
            return;
        }

        if (/^rabbitmqctl delete_user /.test(cmd)) {
            const u = cmd.replace('rabbitmqctl delete_user ', '').trim();
            const sblm = s.users.length;
            s.users = s.users.filter(x => x.name !== u);
            if (s.users.length < sblm) ok('Deleting user "' + u + '" ...');
            else err('Error: user "' + u + '" does not exist');
            return;
        }

        if (/^rabbitmqctl add_user /.test(cmd)) {
            const u = cmd.replace('rabbitmqctl add_user ', '').trim().split(/\s+/)[0];
            s.users.push({ name: u, tags: '' });
            ok('Adding user "' + u + '" ...');
            dim('User baru belum punya izin apa pun sampai set_permissions dijalankan.');
            return;
        }

        if (/^rabbitmqctl set_user_tags /.test(cmd)) {
            const p = cmd.replace('rabbitmqctl set_user_tags ', '').trim().split(/\s+/);
            const u = s.users.filter(x => x.name === p[0])[0];
            if (!u) { err('Error: user "' + p[0] + '" does not exist'); return; }
            u.tags = p.slice(1).join(',');
            ok('Setting tags for user "' + p[0] + '" to [' + u.tags + '] ...');
            if (/administrator/.test(u.tags) && /^svc-/.test(p[0]))
                err('⚠ Tag administrator untuk service account hampir selalu berlebihan.');
            return;
        }

        if (/^rabbitmqctl set_permissions/.test(cmd)) {
            const m = cmd.match(/set_permissions\s+-p\s+(\S+)\s+(\S+)\s+"([^"]*)"\s+"([^"]*)"\s+"([^"]*)"/);
            if (!m) { err('format: set_permissions -p <vhost> <user> "<conf>" "<write>" "<read>"'); return; }
            ok('Setting permissions for user "' + m[2] + '" in vhost "' + m[1] + '" ...');
            say('  configure: ' + m[3] + '   write: ' + m[4] + '   read: ' + m[5]);
            if (m[3] === '.*' && m[4] === '.*' && m[5] === '.*' && !/admin/.test(m[2])) {
                say('');
                err('⚠ Izin ".*" penuh untuk aplikasi: satu kredensial bocor membuka seluruh broker.');
                dim('  Susun pola sempit, misalnya: "^$" "^pesanan$" "^pesanan\\.email$"');
            }
            return;
        }

        if (/^rabbitmqctl list_permissions/.test(cmd)) {
            say('USER                 CONFIGURE            WRITE                READ');
            say('admin'.padEnd(21) + '.*'.padEnd(21) + '.*'.padEnd(21) + '.*');
            say('svc-pesanan'.padEnd(21) + '^$'.padEnd(21) + '^pesanan$'.padEnd(21) + '^$');
            say('svc-notifikasi'.padEnd(21) + '^$'.padEnd(21) + '^pesanan\\.(dlx|email)$'.padEnd(21) + '^pesanan\\.email$');
            say('monitoring'.padEnd(21) + '^$'.padEnd(21) + '^$'.padEnd(21) + '^$');
            return;
        }

        if (cmd === 'rabbitmqctl list_vhosts') {
            say('NAME');
            say('/');
            return;
        }

        /* ---------------- policies ---------------- */
        if (/^rabbitmqctl set_policy/.test(cmd)) {
            const m = cmd.match(/set_policy\s+(\S+)\s+"?([^"\s]+)"?\s+'([^']+)'/);
            if (!m) { err("format: set_policy <nama> \"<pola>\" '<definisi json>' --apply-to queues"); return; }
            s.policies = s.policies.filter(p => p.name !== m[1]);
            s.policies.push({ name: m[1], pattern: m[2], def: m[3] });
            ok('Setting policy "' + m[1] + '" for pattern "' + m[2] + '" ...');
            if (/ha-mode/.test(m[3])) {
                say('');
                err('⚠ "ha-mode" berasal dari classic queue mirroring yang DIHAPUS di RabbitMQ 4.0.');
                dim('  Kebijakan ini tidak melakukan apa pun. Pakai quorum queue.');
            }
            return;
        }

        if (cmd === 'rabbitmqctl list_policies') {
            if (!s.policies.length) { dim('tidak ada policy terpasang.'); return; }
            say('NAME              PATTERN            DEFINITION');
            s.policies.forEach(p => say(p.name.padEnd(18) + p.pattern.padEnd(19) + p.def));
            return;
        }

        /* ---------------- cluster ---------------- */
        if (cmd === 'rabbitmqctl cluster_status' || cmd === 'rabbitmq-diagnostics cluster_status') {
            say('Cluster status of node rabbit@rabbit-1 ...');
            say('');
            say('Disk Nodes');
            s.nodes.forEach(n => say('  ' + n));
            say('');
            say('Running Nodes');
            s.nodes.forEach(n => say('  ' + n, 't-ok'));
            say('');
            say('Partitions');
            if (s.nodes.length < 3) {
                err('  rabbit@rabbit-1: [rabbit@rabbit-2]');
                say('');
                err('⚠ PARTISI TERDETEKSI. Dengan pause_minority, sisi minoritas berhenti melayani.');
            } else {
                ok('  (tidak ada partisi)');
            }
            say('');
            say('Cluster partition handling: pause_minority');
            return;
        }

        if (/^rabbitmqctl quorum_status /.test(cmd)) {
            const q = cmd.replace('rabbitmqctl quorum_status ', '').trim();
            const found = s.queues.filter(x => x.name === q)[0];
            if (!found) { err('Error: queue "' + q + '" not found'); return; }
            if (found.type !== 'quorum') {
                err('Error: queue "' + q + '" is not a quorum queue (type: ' + found.type + ')');
                return;
            }
            say('Status of quorum queue ' + q + ' ...');
            say('');
            say('NODE                 MEMBERSHIP  STATUS');
            say('rabbit@rabbit-1'.padEnd(21) + 'voter'.padEnd(12) + 'leader', 't-ok');
            say('rabbit@rabbit-2'.padEnd(21) + 'voter'.padEnd(12) + 'follower', 't-ok');
            say('rabbit@rabbit-3'.padEnd(21) + 'voter'.padEnd(12) + 'follower', 't-ok');
            say('');
            dim('Mayoritas 2 dari 3 → tahan kehilangan satu node tanpa kehilangan pesan.');
            return;
        }

        if (cmd === 'rabbitmqctl shovel_status') {
            dim('tidak ada shovel yang aktif.');
            return;
        }

        /* ---------------- plugins ---------------- */
        if (cmd === 'rabbitmq-plugins list') {
            say('[E*] rabbitmq_management        4.0.5');
            say('[E*] rabbitmq_management_agent  4.0.5');
            say('[  ] rabbitmq_prometheus        4.0.5');
            say('[  ] rabbitmq_shovel            4.0.5');
            say('[  ] rabbitmq_federation        4.0.5');
            say('[  ] rabbitmq_stream            4.0.5');
            say('');
            dim('[E] = enabled eksplisit, [e] = enabled sebagai dependensi, [*] = berjalan');
            err('⚠ rabbitmq_prometheus belum aktif — Anda berjalan tanpa metrik.');
            return;
        }

        if (/^rabbitmq-plugins enable /.test(cmd)) {
            const p = cmd.replace('rabbitmq-plugins enable ', '').trim();
            ok('Enabling plugins on node rabbit@rabbit-1:');
            p.split(/\s+/).forEach(x => say('  ' + x));
            if (/prometheus/.test(p)) dim('Metrik kini tersedia di http://localhost:15692/metrics');
            return;
        }

        /* ---------------- rabbitmqadmin ---------------- */
        if (/rabbitmqadmin.*declare queue/.test(cmd)) {
            const nm = (cmd.match(/name=(\S+)/) || [])[1];
            const args = (cmd.match(/arguments='([^']+)'/) || [])[1] || '';
            if (!nm) { err('name= wajib diisi'); return; }
            if (/quorum/.test(args) && /x-max-priority/.test(args)) {
                err('Error: invalid property "x-max-priority" for queue of type quorum');
                dim('Quorum queue tidak mendukung prioritas pesan.');
                dim('Alternatif: queue terpisah per tingkat prioritas.');
                return;
            }
            const tipe = /quorum/.test(args) ? 'quorum' : /stream/.test(args) ? 'stream' : 'classic';
            s.queues.push({ name: nm, type: tipe, durable: /durable=true/.test(cmd),
                            ready: 0, unacked: 0, consumers: 0 });
            ok('queue "' + nm + '" dideklarasikan (type: ' + tipe + ')');
            if (tipe === 'classic' && !/uji|retry|reply/.test(nm))
                dim('Pertimbangkan x-queue-type: quorum untuk data penting.');
            if (!/x-max-length|x-message-ttl/.test(args) && tipe !== 'stream')
                err('⚠ Queue tanpa batas panjang maupun TTL dapat tumbuh sampai disk penuh.');
            return;
        }

        if (/rabbitmqadmin.*declare exchange/.test(cmd)) {
            const nm = (cmd.match(/name=(\S+)/) || [])[1];
            const tp = (cmd.match(/type=(\S+)/) || [])[1] || 'direct';
            s.exchanges.push({ name: nm, type: tp, durable: true });
            ok('exchange "' + nm + '" dideklarasikan (type: ' + tp + ')');
            if (!/alternate-exchange/.test(cmd))
                dim('Tanpa alternate-exchange, pesan tanpa binding cocok akan hilang diam-diam.');
            return;
        }

        if (/rabbitmqadmin.*declare binding/.test(cmd)) {
            const src = (cmd.match(/source=(\S+)/) || [])[1];
            const dst = (cmd.match(/destination=(\S+)/) || [])[1];
            const rk  = (cmd.match(/routing_key=([^\s]+)/) || [])[1] || '';
            s.bindings.push({ src: src, dst: dst, rk: rk.replace(/^'|'$/g, '') });
            ok('binding ' + src + ' → ' + dst + '  (routing_key: ' + (rk || '(kosong)') + ')');
            return;
        }

        if (/rabbitmqadmin.*publish/.test(cmd)) {
            const ex = (cmd.match(/exchange=(\S+)/) || [])[1] || '';
            const rk = (cmd.match(/routing_key=(\S+)/) || [])[1] || '';
            const n  = +((cmd.match(/--count=(\d+)/) || [])[1] || 1);

            if (s.alarm) {
                err('publish DIBLOKIR: ' + s.alarm);
                dim('Producer sungguhan akan MENGGANTUNG di sini tanpa pesan error apa pun.');
                return;
            }

            if (!ex) {
                const q = s.queues.filter(x => x.name === rk)[0];
                if (q) { q.ready += n; ok('Published ' + n + ' message(s) ke queue "' + rk + '" lewat default exchange'); }
                else   { err('Tidak ada queue bernama "' + rk + '" — pesan hilang.'); }
                return;
            }

            const cocok = s.bindings.filter(b => b.src === ex &&
                (s.exchanges.filter(e => e.name === ex)[0] || {}).type === 'topic'
                    ? cocokTopic(b.rk, rk) : b.rk === rk);

            if (!cocok.length) {
                const ae = /tak-terkirim/.test(ex) ? null : 'pesanan.tak-terkirim.q';
                err('Tidak ada binding yang cocok untuk routing key "' + rk + '"');
                if (ae) {
                    const q = s.queues.filter(x => x.name === ae)[0];
                    if (q) q.ready += n;
                    ok('→ ' + n + ' pesan diselamatkan alternate-exchange ke "' + ae + '"');
                    dim('  Tanpa alternate-exchange, pesan ini akan HILANG tanpa jejak.');
                } else {
                    err('→ ' + n + ' pesan DIBUANG diam-diam.');
                }
                return;
            }

            cocok.forEach(b => {
                const q = s.queues.filter(x => x.name === b.dst)[0];
                if (q) q.ready += n;
            });
            ok('Published ' + n + ' message(s) ke exchange "' + ex + '"');
            say('Mendarat di ' + cocok.length + ' queue:');
            cocok.forEach(b => say('  ' + b.dst + '  (binding: ' + b.rk + ')'));
            return;
        }

        if (/rabbitmqadmin.*get queue=/.test(cmd)) {
            const q = (cmd.match(/queue=(\S+)/) || [])[1];
            const found = s.queues.filter(x => x.name === q)[0];
            if (!found) { err('queue tidak ditemukan: ' + q); return; }
            if (!found.ready) { dim('queue "' + q + '" kosong.'); return; }
            say('routing_key : pesanan.jakarta.dibuat');
            say('payload     : {"id":"P-1042","total":150000}');
            say('properties  :');
            say('  delivery_mode : 2 (persistent)');
            say('  content_type  : application/json');
            say('  message_id    : 8f2c4a1b-…');
            say('  app_id        : layanan-pesanan');
            if (/dlq|tak-terkirim/.test(q)) {
                say('  headers:');
                say('    x-death:');
                say('      count        : 3');
                say('      reason       : rejected', 't-err');
                say('      queue        : pesanan.email');
                say('      routing-keys : ["pesanan.jakarta.dibuat"]');
                say('    x-first-death-reason : rejected');
                say('');
                dim('reason menjawab KENAPA pesan ini berakhir di sini:');
                dim('  rejected | expired | maxlen | delivery_limit');
            }
            return;
        }

        if (/rabbitmqadmin.*move_messages/.test(cmd)) {
            const src = (cmd.match(/src_queue=(\S+)/) || [])[1];
            const dst = (cmd.match(/dest_queue=(\S+)/) || [])[1];
            const a = s.queues.filter(x => x.name === src)[0];
            const b = s.queues.filter(x => x.name === dst)[0];
            if (!a || !b) { err('queue sumber atau tujuan tidak ditemukan'); return; }
            ok(a.ready + ' pesan dipindahkan dari ' + src + ' ke ' + dst);
            b.ready += a.ready; a.ready = 0;
            dim('Pastikan bug penyebabnya sudah diperbaiki, atau pesan akan kembali ke DLQ.');
            return;
        }

        /* ---------------- definitions ---------------- */
        if (/^rabbitmqctl export_definitions/.test(cmd)) {
            const f = cmd.replace('rabbitmqctl export_definitions ', '').trim();
            ok('Exporting definitions to "' + f + '" ...');
            say('  vhosts:      1');
            say('  users:       ' + s.users.length + '   ← memuat password_hash', 't-warn');
            say('  permissions: ' + s.users.length);
            say('  exchanges:   ' + s.exchanges.length);
            say('  queues:      ' + s.queues.length);
            say('  bindings:    ' + s.bindings.length);
            say('  policies:    ' + s.policies.length);
            say('');
            err('⚠ Berkas ini memuat password_hash setiap user.');
            dim("  Sebelum commit: jq 'del(.users)' " + f + ' > definitions.aman.json');
            return;
        }

        /* ---------------- docker ---------------- */
        if (cmd === 'docker compose up -d') {
            say('[+] Running 2/2');
            say(' ✔ Volume "rabbit-data"  Created');
            ok(' ✔ Container rabbitmq     Started');
            dim('Tunggu ± 20 detik sampai broker benar-benar siap (start_period healthcheck).');
            return;
        }

        if (/^docker compose (stop|restart)/.test(cmd)) {
            const aksi = /restart/.test(cmd) ? 'Restarting' : 'Stopping';
            say(aksi + ' rabbitmq ...');
            if (/restart/.test(cmd)) {
                ok('rabbitmq restarted');
                say('');
                info('Setelah restart, yang selamat hanyalah:');
                say('  • queue dengan durable=true');
                say('  • pesan dengan delivery_mode=2');
                dim('Queue transient dan pesan non-persistent hilang.');
            } else {
                err('rabbitmq stopped — producer akan gagal menyambung.');
                dim('Aplikasi dengan pola outbox tetap bisa menerima pesanan; pesan menyusul nanti.');
            }
            return;
        }

        if (/^docker compose/.test(cmd)) {
            ok('perintah docker compose dijalankan.');
            return;
        }

        if (/^bash /.test(cmd) || /^node /.test(cmd)) {
            ok('skrip dijalankan.');
            dim('(simulator tidak menjalankan berkas sungguhan — pakai perintah rabbitmqctl untuk melihat hasilnya)');
            return;
        }

        if (/^curl /.test(cmd)) {
            if (/15692\/metrics/.test(cmd)) {
                say('# HELP rabbitmq_queue_messages_ready Messages ready to be delivered');
                say('rabbitmq_queue_messages_ready{queue="pesanan.email"} 1240');
                say('rabbitmq_queue_messages_ready{queue="pesanan.ledger"} 84');
                say('rabbitmq_queue_consumers{queue="pesanan.email"} 2');
                say('rabbitmq_alarms_memory_used_watermark 0');
                say('rabbitmq_alarms_free_disk_space_watermark 0');
                say('rabbitmq_process_open_fds 412');
                dim('… ratusan metrik lain');
                return;
            }
            ok('{"status":"ok"}');
            return;
        }

        if (/^psql /.test(cmd)) {
            say(' count');
            say('-------');
            say('     1');
            say('(1 row)');
            dim('Satu efek untuk tiga pesan identik — konsumer Anda idempoten.');
            return;
        }

        if (/^jq /.test(cmd)) {
            ok('definitions.aman.json ditulis (bagian users dibuang).');
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
