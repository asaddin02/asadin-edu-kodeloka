/* ==========================================================================
   GRAFANA k6 — MATERI BAGIAN A (Fondasi, Instalasi, Skrip Pertama)
   ========================================================================== */

const K6_MOD_A = [

/* ---------------------------------------------------------------- 1 ----- */
{
    id: 1,
    cat: '1 · Fondasi',
    title: 'Kenapa Load Testing Wajib & Posisi k6',
    level: 'Dasar', dur: '12 mnt',
    tags: ['load testing', 'performance', 'slo', 'jmeter', 'gatling'],
    desc: 'Memahami masalah nyata yang dicegah load testing, jenis-jenis pengujian performa, dan alasan k6 jadi standar baru di industri.',
    theory: `
<h2>Masalah yang Sebenarnya Kita Selesaikan</h2>
<p>Aplikasi yang <em>lancar dipakai 5 orang</em> belum tentu bertahan saat dipakai 5.000 orang. Kegagalan performa hampir selalu muncul di waktu paling mahal: flash sale, pembukaan PPDB, awal bulan penggajian, atau saat kampanye marketing baru jalan. Load testing adalah cara kita <strong>memindahkan kegagalan itu dari produksi ke laptop kita sendiri</strong>, jauh sebelum pengguna merasakannya.</p>

<div class="callout callout-accent">
    <div class="callout-title">🎯 Definisi kerja yang dipakai di industri</div>
    <p><strong>Load testing</strong> adalah proses menirukan perilaku sejumlah pengguna secara bersamaan terhadap sebuah sistem, lalu mengukur tiga hal: <strong>latency</strong> (berapa lama), <strong>throughput</strong> (berapa banyak per detik), dan <strong>error rate</strong> (berapa persen gagal) — pada level beban yang terdefinisi.</p>
</div>

<h3>Enam Jenis Pengujian Performa</h3>
<p>Ini adalah kosakata dasar. Salah menyebut jenis tes akan membuat hasilnya salah dibaca oleh tim lain.</p>

<table>
<thead><tr><th>Jenis</th><th>Beban</th><th>Pertanyaan yang Dijawab</th><th>Durasi Khas</th></tr></thead>
<tbody>
<tr><td><strong>Smoke test</strong></td><td>1–5 VU</td><td>Apakah skripnya benar dan sistem tidak error di beban minimal?</td><td>30 detik – 1 menit</td></tr>
<tr><td><strong>Load test</strong></td><td>Beban normal / rata-rata puncak</td><td>Apakah SLO terpenuhi pada beban sehari-hari?</td><td>10 – 30 menit</td></tr>
<tr><td><strong>Stress test</strong></td><td>Naik bertahap melewati kapasitas</td><td>Di titik mana sistem mulai rusak?</td><td>20 – 60 menit</td></tr>
<tr><td><strong>Spike test</strong></td><td>Lonjakan mendadak lalu turun</td><td>Apakah sistem selamat dan pulih setelah lonjakan?</td><td>2 – 10 menit</td></tr>
<tr><td><strong>Soak / endurance</strong></td><td>Beban normal, waktu panjang</td><td>Adakah memory leak, koneksi bocor, disk penuh?</td><td>2 – 24 jam</td></tr>
<tr><td><strong>Breakpoint test</strong></td><td>Naik terus tanpa batas sampai jebol</td><td>Berapa kapasitas maksimum absolut?</td><td>Sampai gagal</td></tr>
</tbody>
</table>

<h3>Kenapa k6, Bukan JMeter?</h3>
<p>k6 dibuat oleh Load Impact (kini bagian dari <strong>Grafana Labs</strong>). Inti mesinnya ditulis dengan <strong>Go</strong> — hemat memori dan sangat efisien — sementara skrip tesnya ditulis dengan <strong>JavaScript (ES6+)</strong> sehingga akrab bagi developer.</p>

<table>
<thead><tr><th>Aspek</th><th>Apache JMeter</th><th>Grafana k6</th></tr></thead>
<tbody>
<tr><td>Definisi tes</td><td>XML lewat GUI (sulit di-review di Git)</td><td>File JavaScript (diff-able, code review biasa)</td></tr>
<tr><td>Model konkurensi</td><td>1 thread OS per virtual user (berat)</td><td>Goroutine + JS VM ringan (ribuan VU di 1 mesin)</td></tr>
<tr><td>Konsumsi memori</td><td>Ratusan MB–GB, sering butuh tuning JVM</td><td>Umumnya ± 1–5 MB per VU</td></tr>
<tr><td>Integrasi CI/CD</td><td>Perlu plugin & konfigurasi tambahan</td><td>Satu binary, exit code non-zero saat threshold gagal</td></tr>
<tr><td>Kriteria lulus/gagal</td><td>Assertion terpisah, tidak baku</td><td><code>thresholds</code> — SLO sebagai kode, kelas satu</td></tr>
<tr><td>Ekosistem observability</td><td>Terpisah</td><td>Native ke Prometheus, Grafana, Loki, Tempo</td></tr>
</tbody>
</table>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ Yang k6 <em>bukan</em></div>
    <ul>
        <li><strong>Bukan browser sungguhan (secara default).</strong> k6 mengirim HTTP request langsung — ia tidak menjalankan JavaScript halaman, tidak me-render CSS, tidak memuat gambar otomatis. Jadi k6 mengukur <strong>performa backend</strong>, bukan Core Web Vitals. Untuk itu ada modul <code>k6/browser</code> yang dibahas di modul lanjutan.</li>
        <li><strong>Bukan alat monitoring.</strong> k6 menghasilkan beban dan mengukur dari sisi klien. Untuk tahu <em>kenapa</em> lambat, Anda tetap butuh Prometheus/Grafana di sisi server.</li>
        <li><strong>Bukan pengganti unit test.</strong> k6 menguji perilaku sistem di bawah beban, bukan kebenaran logika bisnis.</li>
    </ul>
</div>

<h3>Kosakata Wajib: SLI, SLO, SLA</h3>
<p>Tiga istilah ini sering tertukar padahal beda tanggung jawab hukum dan teknisnya.</p>
<ul>
    <li><strong>SLI</strong> (<em>Service Level Indicator</em>) — angka yang diukur. Contoh: <code>p95 latency endpoint /checkout</code>.</li>
    <li><strong>SLO</strong> (<em>Service Level Objective</em>) — target internal atas SLI. Contoh: <code>p95 &lt; 500 ms selama 30 hari</code>. <strong>Inilah yang kita terjemahkan menjadi <code>thresholds</code> di k6.</strong></li>
    <li><strong>SLA</strong> (<em>Service Level Agreement</em>) — janji kontraktual ke pelanggan, biasanya lebih longgar dari SLO dan ada denda bila dilanggar.</li>
</ul>

<div class="callout callout-tip">
    <div class="callout-title">💡 Aturan praktis menentukan target awal</div>
    <p>Bila belum ada SLO resmi, mulai dari data produksi Anda sendiri: ambil <strong>p95 latency saat ini</strong>, tetapkan sebagai batas maksimum agar tidak terjadi regresi, lalu perketat bertahap. Menetapkan target dari angan-angan (&quot;pokoknya di bawah 100 ms&quot;) hanya menghasilkan pipeline merah yang akhirnya diabaikan tim.</p>
</div>

<h3>Kenapa p95, Bukan Rata-rata?</h3>
<p>Rata-rata (<em>average</em>) menyembunyikan penderitaan. Bila 95 request selesai 50 ms dan 5 request selesai 5.000 ms, rata-ratanya 297 ms — terlihat sehat, padahal 5% pengguna Anda menunggu 5 detik. <strong>Persentil</strong> menjawab pertanyaan yang benar:</p>
<ul>
    <li><strong>p50 (median)</strong> — pengalaman pengguna tipikal.</li>
    <li><strong>p95</strong> — pengalaman 5% pengguna paling apes. Ini metrik utama untuk SLO.</li>
    <li><strong>p99</strong> — ekor terburuk, biasanya mengungkap masalah GC, lock database, atau cold start.</li>
</ul>
`,
    lab: {
        intro: `
<h3>Latihan Konsep: Menerjemahkan Kebutuhan Bisnis ke Angka</h3>
<p>Sebelum menulis satu baris kode pun, insinyur performa yang baik selalu menuliskan <strong>test plan</strong>. Berikut format satu halaman yang dipakai di banyak tim. Isi versi Anda sendiri untuk aplikasi yang sedang Anda kerjakan.</p>`,
        files: [{
            name: 'test-plan.md', lang: 'markdown', code: `# Test Plan — Checkout API

## 1. Tujuan
Memastikan endpoint POST /api/checkout sanggup melayani beban puncak
kampanye flash sale tanpa melanggar SLO.

## 2. Beban Target (dari data analytics, bukan tebakan)
- Puncak historis      : 1.200 checkout / menit  = 20 req/detik
- Faktor pertumbuhan   : 3x  -> target uji 60 req/detik
- Pola                 : naik 2 menit, tahan 10 menit, turun 2 menit

## 3. SLO yang Diuji  (jadi thresholds di k6)
- http_req_duration p95   < 800 ms
- http_req_duration p99   < 2000 ms
- http_req_failed  rate   < 1%
- checks           rate   > 99%

## 4. Lingkungan
- Target  : https://staging.contoh.id   (BUKAN produksi)
- Data    : 5.000 akun uji + 200 SKU uji, di-reset tiap malam
- Generator: 1 VM 4 vCPU / 8 GB, region sama dengan target

## 5. Kriteria Berhenti (abort)
- Error rate > 25% selama 1 menit  -> hentikan, sistem sudah rusak
- CPU generator > 80%              -> hasil tidak valid, tambah mesin

## 6. Pihak yang Diberi Tahu
- Tim SRE, tim DBA, vendor CDN/WAF (agar IP generator di-allowlist)`
        }],
        snippets: ['k6 version', 'help']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'Jangan pernah load test sistem yang bukan milik Anda',
            body: `<p>Membanjiri server pihak lain dengan request tanpa izin tertulis <strong>secara hukum setara dengan serangan DoS</strong> di banyak yurisdiksi, termasuk Indonesia (UU ITE Pasal 33 tentang gangguan sistem elektronik). Ini berlaku juga untuk API publik pihak ketiga, payment gateway sandbox, dan layanan SaaS.</p>
<p><strong>Yang wajib dilakukan sebelum menekan tombol run:</strong></p>
<ul>
<li>Dapatkan izin tertulis dari pemilik sistem.</li>
<li>Beri tahu tim SRE/infra dan penyedia CDN/WAF (Cloudflare, AWS Shield) agar IP generator di-allowlist — kalau tidak, Anda hanya akan mengukur kecepatan WAF memblokir Anda.</li>
<li>Gunakan lingkungan staging yang menyerupai produksi, bukan produksi itu sendiri.</li>
</ul>`
        },
        {
            kind: 'salah', title: 'Mengukur rata-rata, lalu menyimpulkan sistem sehat',
            body: `<p>Laporan &quot;rata-rata response time 120 ms&quot; nyaris tidak bermakna. Rata-rata mudah ditarik turun oleh ribuan request cepat sementara segelintir request yang sangat lambat — justru yang membuat pengguna kabur — tidak terlihat sama sekali.</p>
<p><strong>Selalu laporkan minimal tiga angka:</strong> p50, p95, dan p99, beserta jumlah request dan error rate. Satu angka tanpa konteks bukan hasil pengujian, itu opini.</p>`
        },
        {
            kind: 'kasus', title: 'Bottleneck-nya ternyata di laptop penguji',
            body: `<p>Kasus yang sangat sering terjadi: hasil tes menunjukkan latency melonjak di 500 VU, tim panik mengoptimasi database — padahal yang penuh adalah CPU laptop penguji atau bandwidth WiFi kantor.</p>
<p><strong>Cara mendeteksinya:</strong> jalankan <code>htop</code>/Task Manager saat tes berjalan. Bila CPU generator &gt; 80% atau NIC jenuh, hasil Anda tidak valid. Solusinya: kurangi VU, aktifkan <code>discardResponseBodies: true</code>, atau pindah generator ke VM cloud di region yang sama dengan target.</p>`
        }
    ],
    quiz: [
        {
            q: 'Anda diminta memastikan tidak ada <em>memory leak</em> pada service yang akan berjalan nonstop selama Lebaran. Jenis pengujian apa yang paling tepat?',
            opts: ['Spike test selama 5 menit', 'Soak (endurance) test selama beberapa jam', 'Smoke test dengan 1 VU', 'Breakpoint test sampai sistem jebol'],
            a: 1,
            exp: 'Memory leak, kebocoran koneksi database, dan penumpukan file log hanya muncul setelah sistem berjalan lama pada beban stabil. Itulah definisi <strong>soak/endurance test</strong>. Spike dan breakpoint terlalu singkat untuk memunculkan gejala akumulatif.'
        },
        {
            q: 'Manakah pernyataan yang <strong>benar</strong> tentang k6?',
            opts: [
                'k6 menjalankan browser lengkap sehingga otomatis mengukur Core Web Vitals',
                'k6 secara default mengirim HTTP request langsung tanpa me-render halaman',
                'k6 hanya bisa dipakai untuk REST API, tidak bisa gRPC atau WebSocket',
                'Skrip k6 ditulis dalam XML seperti JMeter'
            ],
            a: 1,
            exp: 'Secara default k6 adalah <em>protocol-level load tester</em>: ia mengirim HTTP request dan tidak mengeksekusi JavaScript halaman atau memuat aset. Untuk pengujian level browser tersedia modul <code>k6/browser</code> terpisah. k6 juga mendukung gRPC dan WebSocket, dan skripnya ditulis dengan JavaScript.'
        },
        {
            q: 'Tim Anda punya SLO “p95 latency < 500 ms”. Di k6, konsep apa yang dipakai untuk membuat tes otomatis GAGAL bila SLO ini dilanggar?',
            opts: ['<code>check()</code>', '<code>group()</code>', '<code>thresholds</code>', '<code>console.error()</code>'],
            a: 2,
            exp: '<code>thresholds</code> adalah satu-satunya mekanisme yang mengubah <strong>exit code</strong> k6 menjadi non-zero, sehingga pipeline CI/CD ikut gagal. <code>check()</code> hanya mencatat statistik benar/salah dan <strong>tidak</strong> menggagalkan tes — ini jebakan paling umum bagi pemula.'
        }
    ]
},

/* ---------------------------------------------------------------- 2 ----- */
{
    id: 2,
    cat: '1 · Fondasi',
    title: 'Instalasi k6 di Windows, macOS, Linux & Docker',
    level: 'Dasar', dur: '15 mnt',
    tags: ['instalasi', 'install', 'docker', 'windows', 'linux', 'macos', 'setup'],
    desc: 'Panduan pemasangan lengkap dari nol untuk setiap sistem operasi, verifikasi instalasi, dan menyiapkan editor agar autocomplete jalan.',
    theory: `
<h2>Prasyarat</h2>
<p>k6 didistribusikan sebagai <strong>satu binary tunggal</strong> tanpa dependensi runtime. Anda <em>tidak</em> perlu memasang Node.js, Java, atau Python untuk menjalankannya.</p>

<div class="callout callout-info">
    <div class="callout-title">💡 Node.js dibutuhkan hanya bila…</div>
    <p>Anda ingin memakai paket npm di dalam skrip (lewat bundler seperti webpack/esbuild), atau memakai TypeScript. Untuk 90% kebutuhan, k6 sendiri sudah cukup karena punya modul bawaan yang lengkap.</p>
</div>

<h3>1. Windows</h3>
<p>Tersedia tiga jalur. Pilih salah satu.</p>
<h4>a. winget (bawaan Windows 10/11 — paling disarankan)</h4>
<pre data-lang="bash" data-file="PowerShell">winget install k6 --source winget</pre>

<h4>b. Chocolatey</h4>
<pre data-lang="bash" data-file="PowerShell (Run as Administrator)">choco install k6</pre>

<h4>c. Unduh binary manual</h4>
<p>Ambil berkas <code>k6-vX.Y.Z-windows-amd64.zip</code> dari halaman <em>Releases</em> di GitHub <code>grafana/k6</code>, ekstrak, lalu tambahkan foldernya ke <strong>PATH</strong> (Settings → System → About → Advanced system settings → Environment Variables → Path → New).</p>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ Setelah instalasi, tutup dan buka ulang terminal</div>
    <p>Perubahan PATH tidak berlaku pada jendela terminal yang sudah terbuka. Ini penyebab nomor satu error <code>k6 : The term 'k6' is not recognized</code>.</p>
</div>

<h3>2. macOS</h3>
<pre data-lang="bash" data-file="Terminal">brew install k6</pre>
<p>Bila Homebrew belum ada, pasang dulu dari <code>brew.sh</code>. Untuk Mac Apple Silicon (M1–M4) Homebrew otomatis mengambil binary <code>arm64</code>.</p>

<h3>3. Linux — Debian / Ubuntu</h3>
<p>Gunakan repositori resmi agar bisa ikut <code>apt upgrade</code>:</p>
<pre data-lang="bash" data-file="Terminal">sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \\
  --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69

echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \\
  | sudo tee /etc/apt/sources.list.d/k6.list

sudo apt-get update
sudo apt-get install k6</pre>

<h3>4. Linux — RHEL / CentOS / Fedora</h3>
<pre data-lang="bash" data-file="Terminal">sudo dnf install https://dl.k6.io/rpm/repo.rpm
sudo dnf install k6</pre>

<h3>5. Docker (tanpa memasang apa pun)</h3>
<p>Cara paling cepat mencoba dan cara paling konsisten untuk CI/CD.</p>
<pre data-lang="bash" data-file="Terminal"># menjalankan skrip dari direktori saat ini
docker run --rm -i -v "$PWD:/scripts" grafana/k6 run /scripts/skrip.js</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Jebakan Docker #1 — <code>localhost</code> di dalam container bukan localhost Anda</div>
    <p>Bila target tes berjalan di mesin host, <code>http://localhost:3000</code> di dalam container akan menunjuk ke container itu sendiri dan selalu gagal <em>connection refused</em>.</p>
    <p><strong>Solusi:</strong></p>
    <ul>
        <li>Docker Desktop (Windows/macOS): pakai <code>http://host.docker.internal:3000</code>.</li>
        <li>Linux: tambahkan <code>--add-host=host.docker.internal:host-gateway</code>, atau jalankan dengan <code>--network host</code>.</li>
        <li>Bila target juga container: pastikan keduanya di <em>network</em> Docker yang sama dan panggil dengan nama service-nya.</li>
    </ul>
</div>

<h3>6. Verifikasi & Konfigurasi Editor</h3>
<p>Setelah instalasi, jalankan <code>k6 version</code>. Untuk pengalaman menulis kode yang nyaman (autocomplete + dokumentasi hover) di VS Code, pasang paket definisi tipe:</p>
<pre data-lang="bash" data-file="Terminal">npm init -y
npm install --save-dev @types/k6</pre>
<p>Lalu buat <code>jsconfig.json</code> di root proyek agar VS Code mengenalinya.</p>

<h3>7. Struktur Folder Proyek yang Rapi</h3>
<p>Sejak awal, susun proyek pengujian seperti proyek software sungguhan — bukan satu file raksasa.</p>
<pre data-lang="bash" data-file="struktur">perf-tests/
├── package.json
├── jsconfig.json
├── config/
│   └── environments.js      # base URL per environment
├── lib/
│   ├── auth.js              # helper login, reusable
│   └── checks.js            # kumpulan check standar
├── data/
│   └── users.json           # data uji (JANGAN berisi data asli)
├── scenarios/
│   ├── smoke.js
│   ├── load.js
│   └── stress.js
└── .github/workflows/perf.yml</pre>
`,
    lab: {
        intro: `
<h3>Praktik: Pasang, Verifikasi, dan Siapkan Proyek</h3>
<p>Ikuti langkah berikut sesuai sistem operasi Anda. Setelah selesai, coba juga <strong>Terminal Simulasi</strong> di bagian bawah halaman ini — simulator meniru output k6 asli sehingga Anda bisa mengenali bentuk keluarannya sebelum menjalankan yang sungguhan.</p>`,
        files: [
            {
                name: 'jsconfig.json', lang: 'json', code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "checkJs": true,
    "allowJs": true,
    "types": ["k6"]
  },
  "include": ["./**/*.js"],
  "exclude": ["node_modules"]
}`
            },
            {
                name: 'config/environments.js', lang: 'javascript', code: `// Jangan pernah menuliskan URL produksi sebagai nilai default.
// Default yang aman = lingkungan lokal.
const ENVIRONMENTS = {
  local:   { baseUrl: 'http://localhost:3000' },
  dev:     { baseUrl: 'https://dev.contoh.id' },
  staging: { baseUrl: 'https://staging.contoh.id' },
};

// Dipilih lewat:  k6 run -e ENV=staging skrip.js
const name = __ENV.ENV || 'local';

if (!ENVIRONMENTS[name]) {
  throw new Error(
    'ENV tidak dikenal: ' + name +
    '. Pilihan: ' + Object.keys(ENVIRONMENTS).join(', ')
  );
}

export const config = ENVIRONMENTS[name];
export const envName = name;`
            }
        ],
        steps: [
            { note: 'Pastikan k6 sudah terpasang dan versinya terbaca', cmd: 'k6 version', out: 'k6 v1.0.0 (go1.23.4, linux/amd64)\ncommit/…, go1.23.4, linux/amd64' },
            { note: 'Buat kerangka proyek + skrip contoh otomatis', cmd: 'mkdir perf-tests && cd perf-tests\nk6 new smoke.js', out: 'Initialized a new k6 test script in smoke.js.\nYou can now execute it by running `k6 run smoke.js`.' },
            { note: 'Jalankan skrip contoh untuk memastikan seluruh rantai bekerja', cmd: 'k6 run smoke.js' },
            { note: 'Alternatif tanpa instalasi — lewat Docker', cmd: 'docker run --rm -i -v "$PWD:/scripts" grafana/k6 run /scripts/smoke.js' }
        ],
        snippets: ['k6 version', 'k6 new smoke.js', 'k6 run smoke.js', 'ls', 'help']
    },
    pitfalls: [
        {
            kind: 'salah', title: '`k6: command not found` padahal instalasi sukses',
            body: `<p>Tiga penyebab, urut dari yang paling sering:</p>
<ol>
<li><strong>Terminal belum di-restart</strong> sehingga PATH lama masih dipakai. Tutup semua jendela terminal, buka baru.</li>
<li><strong>Folder binary belum masuk PATH</strong> (khusus instalasi manual). Cek dengan <code>echo $PATH</code> (Linux/macOS) atau <code>$env:PATH</code> (PowerShell).</li>
<li><strong>Salah shell.</strong> Di Windows, instalasi lewat WSL tidak membuat k6 tersedia di PowerShell, dan sebaliknya. Keduanya adalah lingkungan terpisah.</li>
</ol>`
        },
        {
            kind: 'larangan', title: 'Jangan pasang k6 lewat `npm install k6`',
            body: `<p>Paket npm bernama <code>k6</code> <strong>bukan</strong> load tester Grafana k6 dan tidak akan berfungsi. k6 adalah binary Go, bukan pustaka Node. Selalu pasang lewat package manager sistem (winget/choco/brew/apt/dnf) atau Docker.</p>
<p>Yang benar dipasang lewat npm hanyalah <code>@types/k6</code> — dan itu murni untuk autocomplete di editor, tidak dipakai saat runtime.</p>`
        },
        {
            kind: 'best', title: 'Kunci versi k6 di CI/CD',
            body: `<p>Di mesin lokal boleh memakai versi terbaru, tapi di pipeline <strong>selalu sematkan versi spesifik</strong> (misal <code>grafana/k6:1.0.0</code>, bukan <code>grafana/k6:latest</code>).</p>
<p>Alasannya: perubahan versi bisa mengubah nilai metrik atau format output, sehingga hasil tes hari ini tidak lagi sebanding dengan hasil bulan lalu. Perbandingan antar-waktu adalah inti dari deteksi regresi performa.</p>`
        }
    ],
    quiz: [
        {
            q: 'k6 berjalan di dalam Docker dan target tes adalah aplikasi di <code>http://localhost:8080</code> pada mesin host. Skrip selalu gagal <em>connection refused</em>. Apa perbaikannya?',
            opts: [
                'Tambah opsi <code>--insecure-skip-tls-verify</code>',
                'Ganti URL menjadi <code>http://host.docker.internal:8080</code> (atau jalankan dengan <code>--network host</code>)',
                'Naikkan jumlah VU agar koneksi berhasil',
                'Pasang Node.js di dalam container'
            ],
            a: 1,
            exp: 'Di dalam container, <code>localhost</code> merujuk ke container itu sendiri. Untuk menembus ke host, gunakan hostname khusus <code>host.docker.internal</code> (Docker Desktop) atau mode <code>--network host</code> di Linux. TLS dan jumlah VU sama sekali tidak berkaitan dengan masalah resolusi alamat ini.'
        },
        {
            q: 'Apa fungsi paket <code>@types/k6</code> yang dipasang lewat npm?',
            opts: [
                'Menjadi runtime k6, wajib agar skrip bisa dijalankan',
                'Hanya menyediakan definisi tipe untuk autocomplete di editor',
                'Mengaktifkan mode distributed testing',
                'Menggantikan binary k6 di lingkungan CI'
            ],
            a: 1,
            exp: '<code>@types/k6</code> murni membantu <em>developer experience</em>: autocomplete, dokumentasi hover, dan pengecekan tipe di VS Code. k6 tetap berjalan dari binary Go-nya sendiri dan sama sekali tidak membaca folder <code>node_modules</code> saat runtime.'
        }
    ]
},

/* ---------------------------------------------------------------- 3 ----- */
{
    id: 3,
    cat: '2 · Skrip Dasar',
    title: 'Anatomi Skrip & Siklus Hidup (Lifecycle)',
    level: 'Dasar', dur: '16 mnt',
    tags: ['lifecycle', 'init', 'setup', 'teardown', 'default', 'vu'],
    desc: 'Empat tahap eksekusi skrip k6, apa yang boleh dan tidak boleh dilakukan di masing-masing tahap, serta kesalahan fatal yang paling sering terjadi.',
    theory: `
<h2>Empat Tahap Hidup Sebuah Tes k6</h2>
<p>Ini konsep terpenting di k6. Salah menempatkan kode di tahap yang keliru akan membuat tes Anda lambat, boros memori, atau langsung gagal.</p>

<pre data-lang="javascript" data-file="anatomi.js">// ── 1. INIT ──────────────────────────────────────────────
// Dijalankan SEKALI per VU, sebelum tes mulai.
// Hanya di sini boleh: import, membaca file, mendefinisikan options.
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = { vus: 10, duration: '30s' };

// ── 2. SETUP ─────────────────────────────────────────────
// Dijalankan SEKALI untuk seluruh tes, sebelum VU manapun jalan.
// Nilai kembaliannya dibagikan (di-copy) ke semua VU.
export function setup() {
  const res = http.post('https://api.contoh.id/login', { user: 'admin' });
  return { token: res.json('token') };
}

// ── 3. DEFAULT (VU code) ─────────────────────────────────
// Dijalankan BERULANG-ULANG oleh setiap VU selama tes berlangsung.
// Inilah "satu iterasi" = satu perjalanan pengguna.
export default function (data) {
  const res = http.get('https://api.contoh.id/produk', {
    headers: { Authorization: 'Bearer ' + data.token },
  });
  check(res, { 'status 200': (r) =&gt; r.status === 200 });
  sleep(1);
}

// ── 4. TEARDOWN ──────────────────────────────────────────
// Dijalankan SEKALI setelah semua VU selesai. Untuk bersih-bersih.
export function teardown(data) {
  http.del('https://api.contoh.id/sesi/' + data.token);
}</pre>

<h3>Ringkasan Aturan Main</h3>
<table>
<thead><tr><th>Tahap</th><th>Berapa Kali Jalan</th><th>Boleh</th><th>Dilarang</th></tr></thead>
<tbody>
<tr><td><strong>init</strong></td><td>1× per VU</td><td><code>import</code>, <code>open()</code>, <code>SharedArray</code>, definisi <code>options</code></td><td>Mengirim HTTP request</td></tr>
<tr><td><strong>setup</strong></td><td>1× total</td><td>Login, seeding data, menyiapkan state bersama</td><td>Mengembalikan objek raksasa (di-copy ke tiap VU)</td></tr>
<tr><td><strong>default</strong></td><td>Berkali-kali per VU</td><td>Semua aksi pengujian</td><td><code>open()</code> membaca file, deklarasi berat</td></tr>
<tr><td><strong>teardown</strong></td><td>1× total</td><td>Hapus data uji, tutup sesi</td><td>Mengandalkan variabel dari <code>default</code></td></tr>
</tbody>
</table>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Larangan keras: memanggil <code>open()</code> di luar init</div>
    <p>Fungsi <code>open()</code> untuk membaca file <strong>hanya boleh</strong> dipanggil di tahap init (level modul, di luar semua fungsi). Memanggilnya di dalam <code>default</code> akan melempar error <em>&quot;open() can only be used in the init context&quot;</em>.</p>
    <p>Alasannya masuk akal: membaca file dari disk pada setiap iterasi akan mengubah tes beban menjadi tes kecepatan disk Anda sendiri.</p>
</div>

<h3>Satu Iterasi = Satu Perjalanan Pengguna</h3>
<p>Fungsi <code>default</code> mewakili <strong>satu putaran penuh</strong> perilaku pengguna. Jangan menaruh satu request saja di sana lalu berharap hasilnya realistis. Pengguna nyata tidak memanggil satu endpoint lalu langsung mengulanginya 1.000 kali dalam sedetik.</p>

<pre data-lang="javascript" data-file="perjalanan-realistis.js">export default function () {
  // Pengguna membuka beranda
  http.get(BASE + '/');
  sleep(randomIntBetween(2, 5));      // membaca isi halaman

  // Mencari produk
  http.get(BASE + '/search?q=sepatu');
  sleep(randomIntBetween(3, 8));      // memilih-milih

  // Melihat detail
  http.get(BASE + '/produk/123');
  sleep(randomIntBetween(5, 10));     // membaca deskripsi

  // Menambahkan ke keranjang
  http.post(BASE + '/keranjang', JSON.stringify({ id: 123 }));
  sleep(2);
}</pre>

<div class="callout callout-tip">
    <div class="callout-title">💡 Kenapa <code>sleep()</code> wajib ada</div>
    <p>Jeda ini disebut <strong>think time</strong>. Tanpanya, 100 VU Anda akan menghasilkan beban setara puluhan ribu pengguna nyata — hasilnya menakutkan tapi tidak menggambarkan apa pun. Sebaliknya, dengan think time yang realistis Anda bisa menjawab pertanyaan bisnis: <em>&quot;sistem kita sanggup melayani berapa pengguna aktif bersamaan?&quot;</em></p>
    <p>Gunakan jeda acak (<code>randomIntBetween</code>), bukan angka tetap, agar request tidak menggumpal di detik yang sama.</p>
</div>

<h3>Mengenal Konteks Eksekusi</h3>
<p>Modul <code>k6/execution</code> memberi tahu skrip Anda &quot;siapa saya dan sedang di iterasi ke berapa&quot; — sangat penting untuk membagi data uji agar tiap VU memakai akun berbeda.</p>
<pre data-lang="javascript" data-file="konteks.js">import exec from 'k6/execution';

export default function () {
  exec.vu.idInTest;              // nomor VU unik di seluruh tes (mulai dari 1)
  exec.vu.iterationInInstance;   // iterasi ke berapa untuk VU ini
  exec.scenario.iterationInTest; // nomor iterasi global, unik lintas VU
  exec.scenario.name;            // nama skenario yang sedang berjalan
  exec.instance.vusActive;       // jumlah VU aktif saat ini
}</pre>
`,
    lab: {
        intro: `
<h3>Praktik: Membangun Skrip Berlapis yang Benar</h3>
<p>Skrip di bawah memakai keempat tahap dengan benar. Simpan sebagai <code>lifecycle.js</code>, lalu jalankan. Perhatikan di output bahwa <code>setup</code> dan <code>teardown</code> hanya muncul sekali meski VU-nya banyak.</p>`,
        files: [{
            name: 'lifecycle.js', lang: 'javascript', code: `import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';

// ============ INIT ============
// Berjalan sekali per VU. Tidak boleh ada HTTP request di sini.
const BASE = __ENV.BASE_URL || 'https://test-api.k6.io';

export const options = {
  vus: 5,
  duration: '20s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

// ============ SETUP ============
// Berjalan sekali untuk seluruh tes. Hasilnya dibagi ke semua VU.
export function setup() {
  console.log('[setup] menyiapkan data uji…');
  const res = http.get(BASE + '/public/crocodiles/');

  if (res.status !== 200) {
    // Melempar error di setup akan MEMBATALKAN seluruh tes.
    // Ini disengaja: percuma menguji sistem yang jelas-jelas sudah mati.
    throw new Error('Target tidak sehat, status: ' + res.status);
  }

  return {
    startedAt: new Date().toISOString(),
    ids: res.json().map((c) => c.id).slice(0, 5),
  };
}

// ============ DEFAULT (VU code) ============
export default function (data) {
  // Bagi data secara merata: tiap VU mengambil id yang berbeda
  const id = data.ids[exec.vu.idInTest % data.ids.length];

  const res = http.get(BASE + '/public/crocodiles/' + id + '/', {
    tags: { name: 'GetCrocodileById' }, // tag agar metrik tidak pecah per-URL
  });

  check(res, {
    'status 200': (r) => r.status === 200,
    'punya field name': (r) => r.json('name') !== undefined,
    'balasan < 800ms': (r) => r.timings.duration < 800,
  });

  sleep(Math.random() * 2 + 1); // think time 1–3 detik
}

// ============ TEARDOWN ============
export function teardown(data) {
  console.log('[teardown] tes dimulai pada ' + data.startedAt);
  console.log('[teardown] membersihkan data uji…');
}` }],
        steps: [
            { note: 'Jalankan dan amati urutan setup → iterasi → teardown', cmd: 'k6 run lifecycle.js' },
            { note: 'Ganti target lewat variabel environment tanpa mengubah kode', cmd: 'k6 run -e BASE_URL=https://test-api.k6.io lifecycle.js' },
            { note: 'Timpa VU & durasi dari CLI (berguna untuk smoke test cepat)', cmd: 'k6 run --vus 1 --iterations 1 lifecycle.js' }
        ],
        snippets: ['k6 run lifecycle.js', 'k6 run --vus 1 --iterations 1 lifecycle.js', 'k6 run --vus 20 --duration 30s lifecycle.js']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'Jangan mengembalikan data besar dari `setup()`',
            body: `<p>Nilai yang dikembalikan <code>setup()</code> akan <strong>disalin ke setiap VU</strong>. Bila Anda mengembalikan array 50.000 baris data dan menjalankan 500 VU, k6 akan menyalin data itu 500 kali dan memori mesin Anda habis.</p>
<p><strong>Yang benar:</strong> untuk dataset besar gunakan <code>SharedArray</code> di tahap init — struktur ini disimpan sekali di memori dan dibaca bersama oleh semua VU. <code>setup()</code> cukup mengembalikan hal-hal kecil seperti token, ID, atau timestamp.</p>`
        },
        {
            kind: 'salah', title: 'Menaruh `import` atau `open()` di dalam `default`',
            body: `<p>Error yang muncul: <code>open() can only be used in the init context</code> atau modul yang tidak terdefinisi. Semua <code>import</code> dan pembacaan file <strong>wajib</strong> berada di level teratas modul.</p>
<p>Ingat aturannya: <em>init context</em> = semua kode di luar fungsi <code>setup</code>, <code>default</code>, dan <code>teardown</code>.</p>`
        },
        {
            kind: 'salah', title: 'Lupa `sleep()` sehingga hasil tes tidak bermakna',
            body: `<p>Tanpa think time, tiap VU akan mengirim request secepat mesin sanggup. 50 VU tanpa sleep bisa menghasilkan 5.000 request/detik — beban yang bahkan tidak akan pernah terjadi di produksi. Anda akan "menemukan" bottleneck palsu dan membuang waktu mengoptimasi hal yang salah.</p>
<p><strong>Pengecualian sah:</strong> saat tujuan Anda memang mengukur throughput maksimum absolut (breakpoint test), atau saat memakai <em>arrival-rate executor</em> yang mengendalikan laju request secara langsung.</p>`
        },
        {
            kind: 'best', title: 'Gagalkan tes lebih awal di `setup()`',
            body: `<p>Selalu lakukan <em>health check</em> di <code>setup()</code> dan lempar <code>throw new Error(...)</code> bila target tidak sehat. Ini mencegah pipeline CI Anda menghabiskan 30 menit menguji server yang ternyata sudah mati sejak menit pertama, lalu melaporkan "100% error" yang tidak informatif.</p>`
        }
    ],
    quiz: [
        {
            q: 'Anda punya file CSV berisi 100.000 akun uji. Di mana dan bagaimana file itu harus dibaca?',
            opts: [
                'Di dalam <code>default()</code> dengan <code>open()</code> agar selalu segar',
                'Di init context menggunakan <code>SharedArray</code>',
                'Di <code>setup()</code> lalu dikembalikan sebagai array biasa',
                'Di <code>teardown()</code> supaya tidak membebani tes'
            ],
            a: 1,
            exp: '<code>SharedArray</code> di init context menyimpan data <strong>satu kali</strong> di memori dan dibagi ke semua VU. Membaca di <code>default()</code> dilarang (<code>open()</code> init-only) dan akan mengukur disk. Mengembalikannya dari <code>setup()</code> menyebabkan data disalin ke setiap VU sehingga memori meledak.'
        },
        {
            q: 'Berapa kali fungsi <code>setup()</code> berjalan pada tes dengan <code>vus: 50, duration: "10m"</code>?',
            opts: ['50 kali, sekali per VU', '1 kali untuk seluruh tes', 'Setiap iterasi', 'Bergantung jumlah iterasi'],
            a: 1,
            exp: '<code>setup()</code> dan <code>teardown()</code> masing-masing berjalan tepat <strong>satu kali</strong> untuk keseluruhan tes, terlepas dari jumlah VU atau iterasi. Yang berjalan sekali per VU adalah <em>init context</em>, dan yang berulang terus adalah fungsi <code>default</code>.'
        },
        {
            q: 'Apa dampak <code>throw new Error()</code> di dalam <code>setup()</code>?',
            opts: [
                'Hanya VU pertama yang gagal, sisanya lanjut',
                'Seluruh tes dibatalkan sebelum VU manapun berjalan',
                'Diabaikan, hanya muncul sebagai warning',
                'Tes tetap jalan tapi threshold otomatis gagal'
            ],
            a: 1,
            exp: 'Error di <code>setup()</code> membatalkan keseluruhan tes. Ini perilaku yang diinginkan untuk <em>fail fast</em>: bila prasyarat (login gagal, target mati, data uji tidak ada) tidak terpenuhi, melanjutkan tes hanya membuang waktu dan menghasilkan laporan yang menyesatkan.'
        }
    ]
},

/* ---------------------------------------------------------------- 4 ----- */
{
    id: 4,
    cat: '2 · Skrip Dasar',
    title: 'HTTP Request Lengkap: GET, POST, Header, Batch, Upload',
    level: 'Dasar', dur: '18 mnt',
    tags: ['http', 'get', 'post', 'header', 'batch', 'upload', 'cookie'],
    desc: 'Menguasai modul k6/http: seluruh metode, parameter, objek Response, request paralel, unggah berkas, dan penanganan cookie.',
    theory: `
<h2>Modul <code>k6/http</code></h2>
<p>Semua metode HTTP tersedia dan memakai pola argumen yang konsisten.</p>

<pre data-lang="javascript" data-file="metode.js">import http from 'k6/http';

http.get(url, params);
http.post(url, body, params);
http.put(url, body, params);
http.patch(url, body, params);
http.del(url, body, params);      // perhatikan: del, bukan delete (kata kunci JS)
http.head(url, params);
http.options(url, body, params);
http.request('REPORT', url, body, params);   // metode kustom apa pun</pre>

<h3>Objek <code>params</code> — Semua Opsi Penting</h3>
<pre data-lang="javascript" data-file="params.js">const params = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
    'X-Request-Id': uuidv4(),
  },
  tags: { name: 'GetUserById' },   // WAJIB untuk URL dinamis, lihat pitfall
  timeout: '10s',                  // default 60 detik — terlalu longgar
  redirects: 5,                    // berapa redirect diikuti (0 = tidak diikuti)
  compression: 'gzip',
  responseType: 'text',            // 'text' | 'binary' | 'none'
  jar: myCookieJar,                // cookie jar khusus
};</pre>

<h3>Mengirim Body: Tiga Bentuk yang Berbeda</h3>
<p>Ini sumber kebingungan yang sering terjadi. Bentuk body menentukan <code>Content-Type</code> yang dikirim.</p>

<div class="vs-grid">
<div class="vs-col vs-bad"><div class="vs-label">❌ Salah — object polos untuk API JSON</div>
<pre data-lang="javascript">// Ini dikirim sebagai application/x-www-form-urlencoded,
// BUKAN JSON. API modern akan menolak dengan 400/422.
http.post(url, { nama: 'Budi', umur: 30 });</pre></div>
<div class="vs-col vs-good"><div class="vs-label">✅ Benar — JSON eksplisit</div>
<pre data-lang="javascript">http.post(url, JSON.stringify({ nama: 'Budi', umur: 30 }), {
  headers: { 'Content-Type': 'application/json' },
});</pre></div>
</div>

<table>
<thead><tr><th>Bentuk body</th><th>Content-Type yang dikirim</th><th>Untuk apa</th></tr></thead>
<tbody>
<tr><td><code>{ a: 1 }</code> (object)</td><td><code>application/x-www-form-urlencoded</code></td><td>Form HTML klasik</td></tr>
<tr><td><code>JSON.stringify({...})</code> + header</td><td><code>application/json</code></td><td>REST API modern</td></tr>
<tr><td><code>new FormData()</code></td><td><code>multipart/form-data</code></td><td>Unggah berkas</td></tr>
<tr><td>String mentah</td><td>Sesuai header yang Anda set</td><td>XML, SOAP, plain text</td></tr>
</tbody>
</table>

<h3>Objek Response — Yang Perlu Anda Tahu</h3>
<pre data-lang="javascript" data-file="response.js">const res = http.get(url);

res.status;              // 200
res.status_text;         // "200 OK"
res.body;                // isi respons (string)
res.json();              // parse JSON -> object
res.json('data.items.0.id');   // ambil langsung dengan path (aman dari error)
res.headers['Content-Type'];
res.cookies;
res.url;                 // URL final setelah redirect
res.error;               // pesan error tingkat jaringan
res.error_code;          // kode error k6 (0 bila tidak ada)

// Rincian waktu — inilah sumber angka metrik http_req_*
res.timings.duration;         // total = sending + waiting + receiving
res.timings.blocked;          // menunggu slot koneksi
res.timings.connecting;       // TCP handshake
res.timings.tls_handshaking;  // TLS handshake
res.timings.sending;          // mengirim request
res.timings.waiting;          // TTFB — waktu berpikir server (paling penting!)
res.timings.receiving;        // mengunduh isi respons</pre>

<div class="callout callout-tip">
    <div class="callout-title">💡 <code>waiting</code> vs <code>duration</code> — bedakan salah siapa</div>
    <p><code>waiting</code> (TTFB) adalah waktu server memproses. <code>receiving</code> adalah waktu mengunduh. Bila <code>duration</code> tinggi tapi <code>waiting</code> rendah, masalahnya <strong>bukan di kode backend</strong> melainkan di ukuran respons atau bandwidth. Ini menghemat berjam-jam salah tuduh antar tim.</p>
</div>

<h3>Request Paralel dengan <code>http.batch()</code></h3>
<p>Browser memuat banyak aset sekaligus. Untuk menirunya, gunakan <code>batch</code> — semua request berangkat bersamaan.</p>
<pre data-lang="javascript" data-file="batch.js">const responses = http.batch([
  ['GET', BASE + '/api/profil',   null, { tags: { name: 'Profil' } }],
  ['GET', BASE + '/api/notifikasi', null, { tags: { name: 'Notif' } }],
  ['GET', BASE + '/api/keranjang', null, { tags: { name: 'Keranjang' } }],
]);

check(responses[0], { 'profil ok': (r) =&gt; r.status === 200 });</pre>

<h3>Unggah Berkas</h3>
<pre data-lang="javascript" data-file="upload.js">import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';

// WAJIB di init context — open() tidak boleh di dalam default()
const gambar = open('./data/foto.jpg', 'b');

export default function () {
  const fd = new FormData();
  fd.append('judul', 'Foto Produk');
  fd.append('berkas', http.file(gambar, 'foto.jpg', 'image/jpeg'));

  http.post(BASE + '/api/unggah', fd.body(), {
    headers: { 'Content-Type': 'multipart/form-data; boundary=' + fd.boundary },
  });
}</pre>
`,
    lab: {
        intro: `
<h3>Praktik: CRUD Penuh dengan Penanganan Error</h3>
<p>Skrip ini menjalankan siklus create → read → update → delete terhadap API publik <code>test-api.k6.io</code>, lengkap dengan tag, timeout, dan pemeriksaan yang benar.</p>`,
        files: [{
            name: 'http-crud.js', lang: 'javascript', code: `import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE = 'https://test-api.k6.io';

export const options = {
  vus: 3,
  duration: '30s',
  thresholds: {
    'http_req_duration{name:Login}': ['p(95)<1500'],
    'http_req_failed': ['rate<0.05'],
    'checks': ['rate>0.95'],
  },
};

export function setup() {
  // Daftarkan satu akun untuk dipakai seluruh tes
  const username = 'user_' + Date.now();
  const payload = JSON.stringify({
    username: username,
    first_name: 'Uji',
    last_name: 'Beban',
    email: username + '@contoh.id',
    password: 'RahasiaKuat123!',
  });

  const res = http.post(BASE + '/user/register/', payload, {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'Register' },
  });

  if (res.status !== 201) {
    throw new Error('Gagal mendaftar akun uji: ' + res.status + ' ' + res.body);
  }
  return { username: username, password: 'RahasiaKuat123!' };
}

export default function (data) {
  let token;

  group('01 - Login', function () {
    const res = http.post(
      BASE + '/auth/token/login/',
      JSON.stringify({ username: data.username, password: data.password }),
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'Login' },      // tag statis, bukan URL dinamis
        timeout: '10s',
      }
    );

    const ok = check(res, {
      'login status 200': (r) => r.status === 200,
      'token diterima': (r) => r.json('access') !== undefined,
    });

    // Bila login gagal, percuma melanjutkan iterasi ini
    if (!ok) return;
    token = res.json('access');
  });

  if (!token) { sleep(1); return; }

  const auth = {
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
  };

  let id;

  group('02 - Create', function () {
    const res = http.post(
      BASE + '/my/crocodiles/',
      JSON.stringify({ name: 'Si Buaya', sex: 'M', date_of_birth: '2010-06-01' }),
      Object.assign({}, auth, { tags: { name: 'CreateCrocodile' } })
    );
    check(res, { 'create 201': (r) => r.status === 201 });
    id = res.json('id');
  });

  group('03 - Read', function () {
    // PENTING: URL mengandung id dinamis -> WAJIB diberi tag statis
    const res = http.get(BASE + '/my/crocodiles/' + id + '/',
      Object.assign({}, auth, { tags: { name: 'GetCrocodile' } }));
    check(res, { 'read 200': (r) => r.status === 200 });
  });

  group('04 - Update', function () {
    const res = http.patch(BASE + '/my/crocodiles/' + id + '/',
      JSON.stringify({ name: 'Buaya Berubah' }),
      Object.assign({}, auth, { tags: { name: 'UpdateCrocodile' } }));
    check(res, { 'update 200': (r) => r.status === 200 });
  });

  group('05 - Delete', function () {
    const res = http.del(BASE + '/my/crocodiles/' + id + '/', null,
      Object.assign({}, auth, { tags: { name: 'DeleteCrocodile' } }));
    check(res, { 'delete 204': (r) => r.status === 204 });
  });

  sleep(1);
}` }],
        steps: [
            { note: 'Jalankan skenario CRUD penuh', cmd: 'k6 run http-crud.js' },
            { note: 'Lihat rincian tiap request untuk debugging (JANGAN dipakai saat beban tinggi)', cmd: 'k6 run --http-debug="full" --vus 1 --iterations 1 http-crud.js' }
        ],
        snippets: ['k6 run http-crud.js', 'k6 run --http-debug --vus 1 --iterations 1 http-crud.js']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN biarkan URL dinamis tanpa tag — metrik Anda akan meledak',
            body: `<p>k6 mengelompokkan metrik berdasarkan URL. Bila Anda memanggil <code>/api/user/1</code>, <code>/api/user/2</code>, … <code>/api/user/9999</code>, k6 akan membuat <strong>9.999 baris metrik terpisah</strong>. Akibatnya: ringkasan tidak terbaca, konsumsi memori melonjak, dan backend metrik (Prometheus/Grafana) bisa kena <em>cardinality explosion</em>.</p>
<p><strong>Solusi wajib:</strong> beri tag <code>name</code> statis pada setiap request ber-URL dinamis.</p>
<pre data-lang="javascript">http.get(BASE + '/api/user/' + id, { tags: { name: 'GetUserById' } });</pre>
<p>Semua request tersebut kini tergabung di bawah satu nama, dan metriknya menjadi bermakna.</p>`
        },
        {
            kind: 'salah', title: 'Mengirim object polos ke API JSON',
            body: `<p><code>http.post(url, { a: 1 })</code> mengirim <code>a=1</code> sebagai <em>form-urlencoded</em>, bukan JSON. API modern akan membalas <code>400 Bad Request</code> atau <code>422 Unprocessable Entity</code> dan Anda akan bingung karena "kodenya sudah benar".</p>
<p>Selalu gunakan <code>JSON.stringify(...)</code> <strong>dan</strong> set header <code>Content-Type: application/json</code>. Keduanya, bukan salah satu.</p>`
        },
        {
            kind: 'salah', title: 'Membiarkan timeout default 60 detik',
            body: `<p>Default timeout k6 adalah <strong>60 detik</strong>. Pada tes beban, ini berarti VU Anda bisa terkunci satu menit penuh menunggu request yang sebenarnya sudah pasti gagal — sehingga throughput anjlok dan Anda salah menyimpulkan kapasitas sistem.</p>
<p>Tetapkan <code>timeout</code> yang realistis (biasanya 2–3× SLO Anda, misal <code>'5s'</code>) di setiap request.</p>`
        },
        {
            kind: 'best', title: 'Aktifkan `discardResponseBodies` untuk tes berskala besar',
            body: `<p>Bila Anda tidak perlu membaca isi respons, tambahkan <code>discardResponseBodies: true</code> di <code>options</code>. k6 akan membuang body tanpa mengalokasikan memori — ini bisa memangkas penggunaan RAM secara drastis dan memungkinkan lebih banyak VU per mesin.</p>
<pre data-lang="javascript">export const options = {
  discardResponseBodies: true,
  // lalu aktifkan kembali per-request hanya di tempat yang butuh:
  // http.get(url, { responseType: 'text' })
};</pre>`
        },
        {
            kind: 'kasus', title: 'Semua request 200 OK, tapi aplikasi sebenarnya error',
            body: `<p>Banyak API mengembalikan <code>200 OK</code> dengan body <code>{"success": false, "error": "..."}</code>. Bila Anda hanya memeriksa status code, tes akan hijau sempurna sementara 100% transaksi sebenarnya gagal.</p>
<p><strong>Selalu periksa isi respons untuk endpoint yang penting:</strong></p>
<pre data-lang="javascript">check(res, {
  'status 200': (r) =&gt; r.status === 200,
  'body sukses': (r) =&gt; r.json('success') === true,
  'ada data': (r) =&gt; (r.json('data') || []).length &gt; 0,
});</pre>`
        }
    ],
    quiz: [
        {
            q: 'Skrip Anda memanggil <code>/api/pesanan/{id}</code> dengan 5.000 id berbeda. Ringkasan k6 menjadi ribuan baris dan tak terbaca. Apa solusi yang tepat?',
            opts: [
                'Kurangi jumlah VU',
                'Tambahkan <code>tags: { name: "GetPesanan" }</code> pada params request',
                'Aktifkan <code>discardResponseBodies</code>',
                'Gunakan <code>http.batch()</code>'
            ],
            a: 1,
            exp: 'k6 mengagregasi metrik per-URL. Tag <code>name</code> statis membuat semua URL dinamis dikelompokkan menjadi satu baris metrik yang bermakna, sekaligus mencegah <em>cardinality explosion</em> di sistem monitoring.'
        },
        {
            q: 'Nilai <code>http_req_duration</code> tinggi (2 detik) tetapi <code>http_req_waiting</code> rendah (80 ms). Apa kesimpulan yang paling masuk akal?',
            opts: [
                'Logika backend lambat, perlu optimasi query',
                'Waktu habis untuk mengunduh respons yang besar atau bandwidth terbatas',
                'Terjadi kesalahan TLS',
                'Threshold salah dikonfigurasi'
            ],
            a: 1,
            exp: '<code>waiting</code> (TTFB) adalah waktu server memproses. Kalau itu rendah, backend sudah cepat. Sisa waktunya ada di <code>receiving</code> — artinya payload terlalu besar atau bandwidth jadi penyempitan. Solusinya kompresi, paginasi, atau mengurangi field respons — bukan mengoptimasi query.'
        },
        {
            q: 'Manakah cara yang benar mengirim JSON di k6?',
            opts: [
                '<code>http.post(url, { nama: "Budi" })</code>',
                '<code>http.post(url, JSON.stringify({ nama: "Budi" }), { headers: { "Content-Type": "application/json" } })</code>',
                '<code>http.post(url, "nama=Budi")</code>',
                '<code>http.postJson(url, { nama: "Budi" })</code>'
            ],
            a: 1,
            exp: 'Object polos akan dikirim sebagai <em>form-urlencoded</em>. Untuk JSON dibutuhkan dua hal sekaligus: serialisasi dengan <code>JSON.stringify()</code> dan header <code>Content-Type: application/json</code>. Fungsi <code>http.postJson</code> tidak ada di k6.'
        }
    ]
},

/* ---------------------------------------------------------------- 5 ----- */
{
    id: 5,
    cat: '2 · Skrip Dasar',
    title: 'Check, Group & Threshold — Menentukan Lulus atau Gagal',
    level: 'Dasar', dur: '17 mnt',
    tags: ['check', 'group', 'threshold', 'slo', 'exit code', 'ci'],
    desc: 'Perbedaan mendasar check dan threshold, cara menulis threshold untuk SLO, abortOnFail, dan kaitannya dengan exit code di CI/CD.',
    theory: `
<h2>Tiga Konsep yang Sering Tertukar</h2>
<table>
<thead><tr><th>Konsep</th><th>Gunanya</th><th>Menggagalkan tes?</th></tr></thead>
<tbody>
<tr><td><code>check()</code></td><td>Memverifikasi satu kondisi, mencatat rasio benar/salah</td><td><strong>TIDAK</strong></td></tr>
<tr><td><code>group()</code></td><td>Mengelompokkan langkah agar laporan terbaca</td><td>Tidak</td></tr>
<tr><td><code>thresholds</code></td><td>Menetapkan kriteria lulus atas sebuah metrik</td><td><strong>YA</strong> — exit code 99</td></tr>
</tbody>
</table>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Kesalahan paling mahal di k6</div>
    <p>Menulis puluhan <code>check()</code> lalu mengira pipeline CI akan merah bila ada yang gagal. <strong>Tidak akan.</strong> k6 tetap keluar dengan exit code <code>0</code> meskipun 100% check gagal. Satu-satunya cara membuat tes benar-benar gagal adalah <code>thresholds</code>.</p>
    <p>Karena itu, hampir setiap proyek yang serius menambahkan threshold pada metrik <code>checks</code> itu sendiri:</p>
    <pre data-lang="javascript">thresholds: { checks: ['rate&gt;0.99'] }</pre>
</div>

<h3><code>check()</code> — Verifikasi Tanpa Menghentikan</h3>
<pre data-lang="javascript" data-file="check.js">import { check } from 'k6';

const res = http.get(url);

const berhasil = check(res, {
  'status 200':        (r) =&gt; r.status === 200,
  'respons < 500ms':   (r) =&gt; r.timings.duration &lt; 500,
  'body ada isinya':   (r) =&gt; r.body.length &gt; 0,
  'field id ada':      (r) =&gt; r.json('id') !== undefined,
});

// check() mengembalikan boolean -> bisa dipakai untuk logika lanjutan
if (!berhasil) {
  console.error('Request gagal: ' + res.status + ' ' + res.body.slice(0, 200));
  return;    // hentikan iterasi ini, jangan lanjut ke langkah berikutnya
}</pre>

<h3><code>group()</code> — Struktur Laporan</h3>
<p>Group membungkus beberapa langkah menjadi satu unit yang muncul terpisah di laporan, dan otomatis menambahkan tag <code>group</code> pada semua metrik di dalamnya.</p>
<pre data-lang="javascript" data-file="group.js">group('Alur Checkout', function () {
  group('01 Tambah ke keranjang', function () { /* … */ });
  group('02 Isi alamat',          function () { /* … */ });
  group('03 Bayar',               function () { /* … */ });
});

// Threshold bisa menyasar group tertentu:
thresholds: {
  'http_req_duration{group:::Alur Checkout::03 Bayar}': ['p(95)&lt;2000'],
}</pre>
<div class="callout callout-warn">
    <div class="callout-title">⚠️ Perhatikan pemisah <code>::</code></div>
    <p>Group bersarang dipisahkan dengan dua titik dua, dan diawali <code>::</code>. Salah satu titik dua saja membuat threshold tidak pernah cocok — dan yang berbahaya, k6 <strong>tidak memberi peringatan</strong>; threshold itu hanya diam saja tidak pernah dievaluasi.</p>
</div>

<h3><code>thresholds</code> — SLO sebagai Kode</h3>
<pre data-lang="javascript" data-file="thresholds.js">export const options = {
  thresholds: {
    // Latency
    http_req_duration: ['p(95)&lt;500', 'p(99)&lt;1500', 'max&lt;5000'],

    // Hanya request yang dianggap "berhasil" — lebih adil
    'http_req_duration{expected_response:true}': ['p(95)&lt;400'],

    // Error rate
    http_req_failed: ['rate&lt;0.01'],          // &lt; 1% gagal

    // Rasio check yang lulus
    checks: ['rate&gt;0.99'],

    // Throughput minimum
    http_reqs: ['count&gt;1000', 'rate&gt;50'],

    // Per endpoint (memakai tag name)
    'http_req_duration{name:Login}':    ['p(95)&lt;800'],
    'http_req_duration{name:Checkout}': ['p(95)&lt;2000'],

    // Metrik kustom
    waktu_checkout: ['p(95)&lt;3000'],

    // Hentikan tes SEGERA bila sistem jelas sudah rusak
    'http_req_failed{scenario:beban_utama}': [
      { threshold: 'rate&lt;0.25', abortOnFail: true, delayAbortEval: '30s' },
    ],
  },
};</pre>

<h3>Agregasi yang Tersedia</h3>
<table>
<thead><tr><th>Tipe metrik</th><th>Agregasi</th></tr></thead>
<tbody>
<tr><td>Counter</td><td><code>count</code>, <code>rate</code></td></tr>
<tr><td>Gauge</td><td><code>value</code></td></tr>
<tr><td>Rate</td><td><code>rate</code></td></tr>
<tr><td>Trend</td><td><code>avg</code>, <code>min</code>, <code>med</code>, <code>max</code>, <code>p(N)</code></td></tr>
</tbody>
</table>

<h3>Exit Code — Bahasa yang Dimengerti CI/CD</h3>
<table>
<thead><tr><th>Exit code</th><th>Arti</th></tr></thead>
<tbody>
<tr><td><code>0</code></td><td>Tes selesai, semua threshold lulus</td></tr>
<tr><td><code>99</code></td><td>Tes selesai tetapi <strong>ada threshold yang gagal</strong></td></tr>
<tr><td><code>104</code></td><td>Tes dihentikan oleh <code>abortOnFail</code></td></tr>
<tr><td><code>107</code></td><td>Error saat menjalankan skrip (sintaks, dsb.)</td></tr>
</tbody>
</table>
<p>Inilah alasan k6 mudah sekali dipasang di pipeline: cukup jalankan perintahnya, dan CI otomatis merah bila SLO dilanggar.</p>
`,
    lab: {
        intro: `
<h3>Praktik: Bandingkan Tes Tanpa dan Dengan Threshold</h3>
<p>Jalankan skrip berikut, lalu periksa exit code dengan <code>echo $?</code> (Linux/macOS) atau <code>echo $LASTEXITCODE</code> (PowerShell). Anda akan melihat sendiri bahwa check yang gagal tidak mengubah exit code, tapi threshold mengubahnya.</p>`,
        files: [{
            name: 'threshold-demo.js', lang: 'javascript', code: `import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// Metrik kustom untuk mengukur alur bisnis, bukan sekadar request
const durasiCheckout = new Trend('durasi_checkout', true);
const checkoutGagal  = new Rate('checkout_gagal');

const BASE = 'https://test-api.k6.io';

export const options = {
  stages: [
    { duration: '20s', target: 10 },
    { duration: '40s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    // SLO utama
    http_req_duration: ['p(95)<1200', 'p(99)<3000'],
    http_req_failed:   ['rate<0.02'],
    checks:            ['rate>0.98'],

    // SLO per endpoint
    'http_req_duration{name:ListPublic}': ['p(95)<900'],

    // SLO alur bisnis (metrik kustom)
    durasi_checkout: ['p(95)<2500'],
    checkout_gagal:  ['rate<0.05'],

    // Rem darurat: bila >30% request gagal setelah 30 detik, hentikan tes.
    // delayAbortEval memberi waktu sistem menghangat (warm-up).
    'http_req_failed{alur:kritis}': [
      { threshold: 'rate<0.30', abortOnFail: true, delayAbortEval: '30s' },
    ],
  },
};

export default function () {
  const mulai = Date.now();
  let sukses = true;

  group('Alur Pengguna', function () {
    const res = http.get(BASE + '/public/crocodiles/', {
      tags: { name: 'ListPublic', alur: 'kritis' },
      timeout: '8s',
    });

    const ok = check(res, {
      'status 200':      (r) => r.status === 200,
      'ada data':        (r) => Array.isArray(r.json()) && r.json().length > 0,
      'balasan < 1.5 s': (r) => r.timings.duration < 1500,
    });
    if (!ok) sukses = false;
  });

  durasiCheckout.add(Date.now() - mulai);
  checkoutGagal.add(!sukses);

  sleep(1);
}` }],
        steps: [
            { note: 'Jalankan dan perhatikan baris THRESHOLDS di ringkasan', cmd: 'k6 run threshold-demo.js' },
            { note: 'Periksa exit code — inilah yang dibaca CI/CD', cmd: 'k6 run threshold-demo.js; echo "exit code: $?"', out: 'exit code: 0   -> semua threshold lulus\nexit code: 99  -> ada threshold yang dilanggar' },
            { note: 'Paksa threshold gagal untuk melihat perilakunya', cmd: 'k6 run --threshold "http_req_duration=p(95)<1" threshold-demo.js; echo $?' }
        ],
        snippets: ['k6 run threshold-demo.js', 'k6 run --no-thresholds threshold-demo.js']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'Jangan andalkan check() untuk menggagalkan pipeline',
            body: `<p>Ini kekeliruan nomor satu. <code>check()</code> hanya statistik — k6 tetap keluar dengan kode <code>0</code> walau semua check gagal, sehingga pipeline CI Anda <strong>hijau padahal aplikasinya rusak</strong>.</p>
<p><strong>Wajib ada di setiap proyek:</strong></p>
<pre data-lang="javascript">thresholds: {
  checks: ['rate&gt;0.99'],        // check yang gagal kini menggagalkan tes
  http_req_failed: ['rate&lt;0.01'],
}</pre>`
        },
        {
            kind: 'salah', title: 'Threshold yang tidak pernah dievaluasi karena salah nama tag',
            body: `<p>Bila Anda menulis <code>'http_req_duration{name:login}'</code> padahal tag aslinya <code>Login</code> (kapital L), threshold itu <strong>tidak pernah cocok</strong> dan k6 melaporkannya sebagai lulus tanpa peringatan apa pun. Anda merasa aman padahal tidak ada yang diperiksa.</p>
<p><strong>Cara mencegah:</strong> jalankan tes singkat lalu periksa apakah baris threshold benar-benar muncul di ringkasan dengan angka nyata (bukan <code>0</code>). Threshold yang jumlahnya nol hampir selalu berarti salah nama.</p>`
        },
        {
            kind: 'salah', title: 'Menaruh `sleep()` di dalam `check()`',
            body: `<p>Fungsi di dalam <code>check()</code> harus murni dan cepat — ia dieksekusi untuk setiap request. Memasukkan <code>sleep()</code>, request HTTP, atau operasi berat lainnya di dalamnya akan mengacaukan pengukuran waktu dan memperlambat tes secara drastis.</p>`
        },
        {
            kind: 'best', title: 'Selalu pakai `delayAbortEval` pada abortOnFail',
            body: `<p>Tanpa <code>delayAbortEval</code>, threshold <code>abortOnFail</code> dievaluasi sejak detik pertama. Beberapa request pertama yang gagal saat aplikasi masih <em>warming up</em> (JIT, koneksi pool, cache dingin) bisa langsung membatalkan seluruh tes.</p>
<pre data-lang="javascript">{ threshold: 'rate&lt;0.25', abortOnFail: true, delayAbortEval: '30s' }</pre>
<p>Beri jeda 30 detik–1 menit agar sistem stabil sebelum rem darurat aktif.</p>`
        },
        {
            kind: 'kasus', title: 'Perbedaan `http_req_failed` dan `checks`',
            body: `<p>Keduanya sering dikira sama, padahal mengukur hal berbeda:</p>
<ul>
<li><code>http_req_failed</code> — request yang gagal di level <strong>protokol</strong>: timeout, connection refused, DNS gagal, atau status ≥ 400 (sesuai <code>responseCallback</code>).</li>
<li><code>checks</code> — rasio assertion <strong>bisnis</strong> Anda yang lulus.</li>
</ul>
<p>Sebuah API bisa punya <code>http_req_failed: 0%</code> (semua 200 OK) tapi <code>checks: 40%</code> karena isi respons ternyata salah. Pantau <strong>keduanya</strong>.</p>`
        }
    ],
    quiz: [
        {
            q: 'Sebuah tes k6 memiliki 50 check dan semuanya gagal, tetapi tidak ada threshold sama sekali. Berapa exit code k6?',
            opts: ['99', '104', '0', '1'],
            a: 2,
            exp: 'Exit code <strong>0</strong> — tes dianggap "selesai dengan sukses". <code>check()</code> tidak pernah memengaruhi exit code. Inilah sebabnya threshold <code>checks: [\'rate&gt;0.99\']</code> hampir selalu wajib ditambahkan agar kegagalan assertion benar-benar menggagalkan pipeline.'
        },
        {
            q: 'Apa fungsi <code>delayAbortEval: "30s"</code> pada sebuah threshold dengan <code>abortOnFail</code>?',
            opts: [
                'Menunda dimulainya tes selama 30 detik',
                'Menunda evaluasi threshold selama 30 detik pertama agar sistem sempat menghangat',
                'Membatalkan tes setelah 30 detik apa pun yang terjadi',
                'Memberi toleransi 30 detik pada nilai p95'
            ],
            a: 1,
            exp: '<code>delayAbortEval</code> menunda <em>evaluasi</em> threshold, bukan tesnya. Ini mencegah beberapa error saat warm-up (cache dingin, connection pool belum terisi, JIT belum panas) langsung membatalkan seluruh tes.'
        },
        {
            q: 'Metrik apa yang tepat dipakai untuk mendeteksi API yang selalu membalas 200 OK padahal isi responsnya salah?',
            opts: ['<code>http_req_failed</code>', '<code>checks</code>', '<code>http_reqs</code>', '<code>iteration_duration</code>'],
            a: 1,
            exp: '<code>http_req_failed</code> hanya melihat level protokol — status 200 dianggap sukses. Kebenaran <em>isi</em> respons hanya bisa ditangkap oleh <code>check()</code>, dan rasionya terekam di metrik <code>checks</code>. Karena itu keduanya harus dipantau bersamaan.'
        }
    ]
}

];

/* ==========================================================================
   GRAFANA k6 — MATERI BAGIAN B (Options, Data, Metrik, Skenario)
   ========================================================================== */

const K6_MOD_B = [

/* ---------------------------------------------------------------- 6 ----- */
{
    id: 6,
    cat: '2 · Skrip Dasar',
    title: 'Options & Konfigurasi: VU, Stages, Env, Urutan Prioritas',
    level: 'Dasar', dur: '14 mnt',
    tags: ['options', 'vus', 'stages', 'env', 'config', 'cli'],
    desc: 'Semua cara mengatur perilaku tes, urutan prioritas antar sumber konfigurasi, dan opsi produksi yang wajib Anda tahu.',
    theory: `
<h2>Empat Sumber Konfigurasi & Urutan Prioritasnya</h2>
<p>k6 membaca konfigurasi dari beberapa tempat. Bila nilainya bertabrakan, yang <strong>lebih ke bawah menang</strong>:</p>
<ol>
    <li>Nilai bawaan k6</li>
    <li>Berkas konfigurasi (<code>--config config.json</code>)</li>
    <li>Objek <code>export const options</code> di dalam skrip</li>
    <li>Variabel lingkungan (<code>K6_VUS=10</code>)</li>
    <li><strong>Flag CLI</strong> (<code>--vus 10</code>) — prioritas tertinggi</li>
</ol>

<div class="callout callout-tip">
    <div class="callout-title">💡 Kenapa urutan ini penting</div>
    <p>Anda menulis <code>options</code> yang benar untuk kondisi produksi, lalu di pipeline CI tinggal menimpanya dengan <code>--vus 1 --iterations 1</code> untuk smoke test cepat — <strong>tanpa mengubah satu baris kode pun</strong>. Kode tes Anda tetap satu sumber kebenaran.</p>
</div>

<h3>Mengatur Beban: Dua Cara Dasar</h3>
<pre data-lang="javascript" data-file="beban.js">// Cara 1 — beban tetap
export const options = {
  vus: 50,
  duration: '5m',
};

// Cara 2 — beban bertahap (stages), jauh lebih realistis
export const options = {
  stages: [
    { duration: '2m', target: 100 },  // naik perlahan 0 -> 100 VU
    { duration: '5m', target: 100 },  // tahan di 100 VU  (fase pengukuran)
    { duration: '2m', target: 200 },  // naik lagi ke 200 VU
    { duration: '5m', target: 200 },  // tahan
    { duration: '2m', target: 0   },  // turun perlahan (graceful ramp-down)
  ],
};

// Cara 3 — jumlah iterasi tetap (bukan durasi)
export const options = {
  vus: 10,
  iterations: 1000,   // total 1000 iterasi dibagi ke 10 VU
};</pre>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ Selalu sediakan fase <em>ramp-up</em> dan <em>ramp-down</em></div>
    <p>Langsung melompat dari 0 ke 500 VU (<code>vus: 500</code>) menciptakan <em>thundering herd</em>: connection pool kosong, cache dingin, autoscaler belum bereaksi. Anda akan melihat lonjakan error di detik-detik awal yang <strong>bukan</strong> gambaran perilaku sistem sebenarnya.</p>
    <p>Kecuali memang sedang melakukan <strong>spike test</strong> — di situ lonjakan mendadak justru tujuannya.</p>
</div>

<h3>Opsi Produksi yang Wajib Diketahui</h3>
<pre data-lang="javascript" data-file="options-lengkap.js">export const options = {
  // ── Beban ──
  stages: [ /* … */ ],

  // ── Kriteria lulus ──
  thresholds: { http_req_duration: ['p(95)&lt;500'] },

  // ── Performa generator ──
  discardResponseBodies: true,   // hemat memori drastis bila body tak dibaca
  noConnectionReuse: false,      // true = tutup koneksi tiap request (lebih berat)
  noVUConnectionReuse: false,    // true = tiap iterasi pakai koneksi baru
  batchPerHost: 6,               // maksimal request paralel per host (mirip browser)

  // ── Jaringan ──
  insecureSkipTLSVerify: true,   // hanya untuk staging bersertifikat self-signed
  userAgent: 'k6-loadtest/1.0 (kontak: sre@contoh.id)',
  dns: { ttl: '1m', select: 'roundRobin', policy: 'preferIPv4' },
  hosts: { 'api.contoh.id': '10.0.0.5' },   // paksa resolusi (bypass DNS/LB)

  // ── Perilaku tes ──
  setupTimeout: '60s',
  teardownTimeout: '60s',
  maxRedirects: 5,
  throw: false,                  // true = error HTTP jadi exception JS

  // ── Tag global untuk semua metrik ──
  tags: { environment: 'staging', tim: 'checkout', build: __ENV.BUILD_ID || 'lokal' },

  // ── Ringkasan ──
  summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
};</pre>

<h3>Variabel Lingkungan dengan <code>__ENV</code></h3>
<pre data-lang="javascript" data-file="env.js">// Dipanggil:  k6 run -e ENV=staging -e VUS=100 skrip.js
const BASE = __ENV.BASE_URL || 'http://localhost:3000';
const VUS  = parseInt(__ENV.VUS || '10', 10);

export const options = {
  vus: VUS,
  duration: __ENV.DURATION || '30s',
};</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Jangan taruh kredensial di dalam skrip</div>
    <p>Skrip tes masuk ke Git dan bisa dibaca siapa saja di organisasi Anda. Password, API key, dan token <strong>wajib</strong> lewat variabel lingkungan atau secret manager CI:</p>
    <pre data-lang="javascript">const password = __ENV.TEST_PASSWORD;
if (!password) throw new Error('TEST_PASSWORD belum diset');</pre>
    <p>Dan pastikan CI Anda me-mask nilai secret di log. Jangan pernah <code>console.log(token)</code>.</p>
</div>

<h3>Berkas Konfigurasi Terpisah</h3>
<pre data-lang="json" data-file="k6.config.json">{
  "vus": 50,
  "duration": "10m",
  "thresholds": {
    "http_req_duration": ["p(95)<500"],
    "http_req_failed": ["rate<0.01"]
  },
  "summaryTrendStats": ["avg", "p(95)", "p(99)", "max"]
}</pre>
<pre data-lang="bash">k6 run --config k6.config.json skrip.js</pre>
`,
    lab: {
        intro: `
<h3>Praktik: Satu Skrip, Banyak Profil Beban</h3>
<p>Pola berikut dipakai luas di industri: satu berkas skrip, profil beban dipilih lewat variabel lingkungan. Dengan begitu smoke test di CI dan load test malam hari memakai kode yang sama persis.</p>`,
        files: [{
            name: 'profil-beban.js', lang: 'javascript', code: `import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = __ENV.BASE_URL || 'https://test-api.k6.io';

// Kumpulan profil beban yang bisa dipilih saat runtime
const PROFIL = {
  smoke: {
    vus: 1,
    duration: '30s',
    thresholds: { http_req_failed: ['rate<0.01'] },
  },
  load: {
    stages: [
      { duration: '2m', target: 50 },
      { duration: '5m', target: 50 },
      { duration: '2m', target: 0 },
    ],
    thresholds: {
      http_req_duration: ['p(95)<800'],
      http_req_failed: ['rate<0.01'],
      checks: ['rate>0.99'],
    },
  },
  stress: {
    stages: [
      { duration: '2m', target: 100 },
      { duration: '3m', target: 200 },
      { duration: '3m', target: 400 },
      { duration: '3m', target: 600 },
      { duration: '3m', target: 0 },
    ],
    thresholds: {
      // Saat stress test, target dilonggarkan: kita mencari titik patah,
      // bukan membuktikan SLO harian.
      http_req_duration: ['p(95)<3000'],
      http_req_failed: [
        { threshold: 'rate<0.25', abortOnFail: true, delayAbortEval: '1m' },
      ],
    },
  },
  spike: {
    stages: [
      { duration: '30s', target: 20 },
      { duration: '10s', target: 500 },  // lonjakan mendadak
      { duration: '1m',  target: 500 },
      { duration: '10s', target: 20 },   // kembali normal
      { duration: '2m',  target: 20 },   // amati apakah sistem pulih
      { duration: '10s', target: 0 },
    ],
    thresholds: { http_req_failed: ['rate<0.10'] },
  },
  soak: {
    stages: [
      { duration: '5m',  target: 50 },
      { duration: '3h',  target: 50 },   // durasi panjang, cari memory leak
      { duration: '5m',  target: 0 },
    ],
    thresholds: { http_req_duration: ['p(95)<1000'] },
  },
};

const dipilih = __ENV.PROFIL || 'smoke';
if (!PROFIL[dipilih]) {
  throw new Error('PROFIL tidak dikenal: ' + dipilih +
                  '. Pilihan: ' + Object.keys(PROFIL).join(', '));
}

export const options = Object.assign({}, PROFIL[dipilih], {
  discardResponseBodies: true,
  tags: { profil: dipilih, env: __ENV.ENV || 'lokal' },
  summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
});

export default function () {
  const res = http.get(BASE + '/public/crocodiles/', {
    tags: { name: 'ListCrocodiles' },
    timeout: '10s',
    responseType: 'text',   // aktifkan lagi karena kita perlu membaca body
  });

  check(res, {
    'status 200': (r) => r.status === 200,
    'ada isi': (r) => r.body && r.body.length > 10,
  });

  sleep(Math.random() * 2 + 1);
}` }],
        steps: [
            { note: 'Smoke test cepat (default)', cmd: 'k6 run profil-beban.js' },
            { note: 'Load test dengan profil berbeda tanpa mengubah kode', cmd: 'k6 run -e PROFIL=load -e ENV=staging profil-beban.js' },
            { note: 'Timpa lagi dari CLI — CLI selalu menang', cmd: 'k6 run -e PROFIL=load --vus 5 --duration 15s profil-beban.js' },
            { note: 'Simpan ringkasan sebagai JSON untuk dibandingkan antar-build', cmd: 'k6 run --summary-export=hasil.json -e PROFIL=load profil-beban.js' }
        ],
        snippets: ['k6 run profil-beban.js', 'k6 run -e PROFIL=load profil-beban.js', 'k6 run -e PROFIL=spike profil-beban.js', 'k6 run --vus 5 --duration 10s profil-beban.js']
    },
    pitfalls: [
        {
            kind: 'salah', title: 'Bingung kenapa `options` di skrip tidak berpengaruh',
            body: `<p>Hampir selalu karena tertimpa. Ingat urutan prioritas: <strong>CLI &gt; variabel lingkungan &gt; options di skrip &gt; berkas konfigurasi &gt; default</strong>.</p>
<p>Bila di terminal Anda ada <code>K6_VUS=100</code> yang ter-export (misalnya dari skrip shell sebelumnya), nilai itu akan mengalahkan <code>vus: 10</code> di dalam skrip Anda. Periksa dengan <code>env | grep K6_</code>.</p>`
        },
        {
            kind: 'larangan', title: 'Jangan pakai `insecureSkipTLSVerify: true` untuk target produksi',
            body: `<p>Opsi ini mematikan verifikasi sertifikat TLS. Sah dipakai di staging yang memakai sertifikat <em>self-signed</em>, tetapi bila dibiarkan menyala untuk target produksi Anda kehilangan kemampuan mendeteksi masalah sertifikat kedaluwarsa atau <em>man-in-the-middle</em> — dan tes Anda jadi tidak mewakili pengalaman pengguna asli (yang browsernya akan menolak).</p>`
        },
        {
            kind: 'salah', title: 'Melompat langsung ke ratusan VU tanpa ramp-up',
            body: `<p><code>vus: 500</code> tanpa <code>stages</code> berarti 500 VU aktif di detik pertama. Yang terjadi: connection pool kosong sehingga semua VU berebut membuka koneksi TCP+TLS bersamaan, cache aplikasi masih dingin, dan autoscaler belum sempat menambah instance.</p>
<p>Hasilnya adalah gelombang error di awal yang mencemari statistik keseluruhan. Gunakan <code>stages</code> dengan ramp-up minimal 1–2 menit, kecuali Anda memang sedang melakukan spike test.</p>`
        },
        {
            kind: 'best', title: 'Beri tag global pada setiap eksekusi',
            body: `<p>Tambahkan <code>tags: { env, tim, build }</code> di <code>options</code>. Saat hasil dikirim ke Prometheus/Grafana, tag ini memungkinkan Anda memfilter dan membandingkan: "p95 build #421 vs #420 di staging". Tanpa tag, semua hasil tes bercampur menjadi satu dan tidak bisa dianalisis tren regresinya.</p>`
        }
    ],
    quiz: [
        {
            q: 'Skrip berisi <code>vus: 10</code>. Anda menjalankan <code>K6_VUS=50 k6 run --vus 100 skrip.js</code>. Berapa VU yang benar-benar dipakai?',
            opts: ['10', '50', '100', 'Error karena konflik'],
            a: 2,
            exp: '<strong>100</strong>. Urutan prioritas k6: flag CLI mengalahkan variabel lingkungan, yang mengalahkan <code>options</code> di skrip, yang mengalahkan berkas konfigurasi dan nilai bawaan.'
        },
        {
            q: 'Kapan <code>discardResponseBodies: true</code> sebaiknya digunakan?',
            opts: [
                'Selalu, karena membuat tes lebih akurat',
                'Saat Anda tidak perlu membaca isi respons dan ingin menghemat memori generator',
                'Hanya untuk request POST',
                'Saat ingin mempercepat server yang diuji'
            ],
            a: 1,
            exp: 'Opsi ini membuat k6 tidak mengalokasikan memori untuk body respons — sangat menghemat RAM saat menjalankan ribuan VU. Tetapi bila Anda perlu memeriksa isi respons di <code>check()</code>, aktifkan kembali secara selektif per-request dengan <code>responseType: "text"</code>.'
        },
        {
            q: 'Anda ingin menyimpan password akun uji. Cara mana yang benar?',
            opts: [
                'Tulis langsung sebagai konstanta di skrip agar mudah dibaca tim',
                'Simpan di <code>data/users.json</code> yang ikut di-commit',
                'Ambil dari <code>__ENV.TEST_PASSWORD</code> yang diisi dari secret CI',
                'Enkode base64 di dalam skrip'
            ],
            a: 2,
            exp: 'Skrip tes masuk ke repositori Git dan bisa dibaca siapa saja yang punya akses. Kredensial harus datang dari variabel lingkungan yang diisi oleh secret manager CI. Base64 <strong>bukan</strong> enkripsi — siapa pun bisa membacanya kembali dalam hitungan detik.'
        }
    ]
},

/* ---------------------------------------------------------------- 7 ----- */
{
    id: 7,
    cat: '2 · Skrip Dasar',
    title: 'Data Uji: SharedArray, CSV, dan Data Unik per VU',
    level: 'Menengah', dur: '16 mnt',
    tags: ['sharedarray', 'csv', 'json', 'parametrization', 'data', 'memori'],
    desc: 'Memuat ribuan baris data uji tanpa meledakkan memori, membagi data agar tiap VU unik, dan menghindari cache palsu.',
    theory: `
<h2>Kenapa Data Uji Menentukan Validitas Hasil</h2>
<p>Bila 500 VU Anda semuanya login sebagai <code>user@contoh.id</code> dan mencari produk yang sama, maka setelah request pertama semuanya akan dilayani dari cache. Anda akan mendapat p95 = 12 ms dan menyimpulkan sistem sangat cepat — padahal Anda baru saja menguji Redis, bukan aplikasi Anda.</p>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Gejala klasik data uji yang buruk</div>
    <ul>
        <li>Latency jauh lebih rendah dari produksi → semua kena cache.</li>
        <li>Banyak error <code>409 Conflict</code> / deadlock → semua VU menulis ke baris database yang sama.</li>
        <li>Hasil tes berubah drastis antar-run tanpa perubahan kode → data uji habis atau tercemar.</li>
    </ul>
</div>

<h3><code>SharedArray</code> — Satu Salinan untuk Semua VU</h3>
<p>Ini struktur data terpenting di k6. Tanpa <code>SharedArray</code>, setiap VU memegang salinan datanya sendiri.</p>

<div class="vs-grid">
<div class="vs-col vs-bad"><div class="vs-label">❌ 300 VU × 50 MB = 15 GB RAM</div>
<pre data-lang="javascript">// Array biasa: DISALIN ke setiap VU
const users = JSON.parse(open('./users.json'));</pre></div>
<div class="vs-col vs-good"><div class="vs-label">✅ 50 MB total, apa pun jumlah VU</div>
<pre data-lang="javascript">import { SharedArray } from 'k6/data';

const users = new SharedArray('users', function () {
  return JSON.parse(open('./users.json'));
});</pre></div>
</div>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ Aturan main SharedArray</div>
    <ul>
        <li>Harus dideklarasikan di <strong>init context</strong> (level modul).</li>
        <li>Isinya <strong>read-only</strong>. Mengubah elemennya tidak akan terlihat oleh VU lain dan bisa menimbulkan bug halus.</li>
        <li>Hanya boleh berisi array. Bukan object, bukan Map.</li>
        <li>Nama (argumen pertama) harus unik dalam satu skrip.</li>
    </ul>
</div>

<h3>Empat Strategi Membagi Data</h3>
<pre data-lang="javascript" data-file="strategi-data.js">import exec from 'k6/execution';

// 1. ACAK — paling sederhana, tapi bisa ada tabrakan antar-VU
const u1 = users[Math.floor(Math.random() * users.length)];

// 2. UNIK PER VU — tiap VU memakai akun tetap yang berbeda
//    Cocok untuk data yang tidak boleh dipakai bersamaan (misal keranjang belanja)
const u2 = users[(exec.vu.idInTest - 1) % users.length];

// 3. UNIK PER ITERASI — tiap iterasi memakai baris baru, tidak pernah berulang
//    Cocok untuk data sekali pakai (kode voucher, nomor invoice)
const u3 = users[exec.scenario.iterationInTest % users.length];

// 4. BERBASIS WAKTU — untuk membuat data yang selalu baru
const emailBaru = 'uji_' + Date.now() + '_' + exec.vu.idInTest + '@contoh.id';</pre>

<h3>Membaca CSV</h3>
<p>k6 tidak punya parser CSV bawaan yang stabil di semua versi. Cara paling aman dan portabel adalah memakai pustaka <code>papaparse</code> dari jslib:</p>
<pre data-lang="javascript" data-file="csv.js">import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const users = new SharedArray('users', function () {
  // header: true -> baris pertama jadi nama kolom
  return papaparse.parse(open('./data/users.csv'), { header: true }).data;
});

export default function () {
  const u = users[exec.vu.idInTest % users.length];
  http.post(BASE + '/login', JSON.stringify({
    email: u.email, password: u.password,
  }), { headers: { 'Content-Type': 'application/json' } });
}</pre>

<h3>Pustaka Bantu dari jslib.k6.io</h3>
<pre data-lang="javascript" data-file="jslib.js">import { randomIntBetween, randomItem, randomString, uuidv4 }
  from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

randomIntBetween(1, 100);          // bilangan acak
randomItem(['a', 'b', 'c']);       // elemen acak dari array
randomString(10);                  // string acak 10 karakter
uuidv4();                          // UUID unik, bagus untuk idempotency key</pre>
<div class="callout callout-warn">
    <div class="callout-title">⚠️ Impor dari URL diunduh saat runtime</div>
    <p>Bila mesin CI Anda tidak punya akses internet, impor dari <code>jslib.k6.io</code> akan gagal dan seluruh tes batal. Untuk lingkungan tertutup, unduh berkasnya dan simpan di repositori (vendoring), lalu impor secara lokal.</p>
</div>
`,
    lab: {
        intro: `
<h3>Praktik: Data Uji yang Benar</h3>
<p>Buat berkas <code>data/users.json</code> lalu jalankan skrip di bawah. Perhatikan bahwa tiap VU mendapat akun berbeda dan tiap iterasi memakai kata kunci pencarian berbeda — sehingga cache tidak menutupi masalah performa yang sebenarnya.</p>`,
        files: [
            {
                name: 'data/users.json', lang: 'json', code: `[
  { "email": "uji001@contoh.id", "password": "Sandi123!", "tier": "basic" },
  { "email": "uji002@contoh.id", "password": "Sandi123!", "tier": "basic" },
  { "email": "uji003@contoh.id", "password": "Sandi123!", "tier": "premium" },
  { "email": "uji004@contoh.id", "password": "Sandi123!", "tier": "premium" },
  { "email": "uji005@contoh.id", "password": "Sandi123!", "tier": "enterprise" }
]`
            },
            {
                name: 'data-uji.js', lang: 'javascript', code: `import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import exec from 'k6/execution';
import { randomItem, uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const BASE = __ENV.BASE_URL || 'https://test-api.k6.io';

// ── SharedArray: dimuat SEKALI, dibagi ke semua VU ──
const users = new SharedArray('users', function () {
  return JSON.parse(open('./data/users.json'));
});

// Kata kunci pencarian yang bervariasi -> mencegah semua request kena cache
const KATA_KUNCI = new SharedArray('kata-kunci', function () {
  return ['sepatu', 'tas', 'jaket', 'celana', 'kaos', 'topi', 'sandal',
          'jam tangan', 'kacamata', 'dompet'];
});

export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    checks: ['rate>0.95'],
  },
};

export default function () {
  // Strategi 2: tiap VU memakai akun tetap yang berbeda.
  // Ini mencegah dua VU saling menimpa keranjang belanja akun yang sama.
  const user = users[(exec.vu.idInTest - 1) % users.length];

  // Strategi acak untuk kata kunci -> cache tidak menutupi masalah nyata
  const kunci = randomItem(KATA_KUNCI);

  const res = http.get(BASE + '/public/crocodiles/', {
    tags: { name: 'Search', tier: user.tier },
    headers: {
      // Idempotency key unik agar request tidak dianggap duplikat
      'X-Request-Id': uuidv4(),
      'X-Test-User': user.email,
    },
  });

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  // Log hanya sesekali — console.log di setiap iterasi memperlambat tes
  if (exec.scenario.iterationInTest % 50 === 0) {
    console.log('VU ' + exec.vu.idInTest + ' memakai ' + user.email +
                ' mencari "' + kunci + '"');
  }

  sleep(Math.random() * 2 + 1);
}` }
        ],
        steps: [
            { note: 'Jalankan dan amati distribusi akun per VU', cmd: 'k6 run data-uji.js' },
            { note: 'Naikkan VU melebihi jumlah data — perhatikan akun mulai berulang (modulo)', cmd: 'k6 run --vus 12 --duration 20s data-uji.js' }
        ],
        snippets: ['k6 run data-uji.js', 'k6 run --vus 12 --duration 20s data-uji.js']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'JANGAN gunakan data pelanggan asli untuk pengujian',
            body: `<p>Menyalin database produksi ke lingkungan staging untuk data uji adalah pelanggaran serius terhadap <strong>UU PDP No. 27/2022</strong> di Indonesia (dan GDPR bila ada pengguna Eropa). Lingkungan staging umumnya punya kontrol akses lebih longgar, log lebih verbose, dan backup yang tidak dienkripsi.</p>
<p><strong>Yang benar:</strong> gunakan data sintetis (dibangkitkan dengan Faker) atau data produksi yang sudah di-<em>anonymize</em> secara ireversibel — bukan sekadar mengganti nama, tetapi juga menghapus NIK, nomor telepon, alamat, dan riwayat transaksi yang bisa dipakai mengidentifikasi ulang seseorang.</p>`
        },
        {
            kind: 'salah', title: 'Semua VU memakai satu akun yang sama',
            body: `<p>Konsekuensinya berlapis dan semuanya membuat hasil tes tidak valid:</p>
<ul>
<li>Rate limiter per-user akan aktif dan memblokir — Anda mengukur rate limiter, bukan aplikasi.</li>
<li>Cache per-user membuat request kedua dan seterusnya sangat cepat.</li>
<li>Kunci baris database (row lock) pada akun tersebut menimbulkan kontensi palsu.</li>
<li>Keranjang belanja/sesi saling menimpa sehingga logika bisnis kacau.</li>
</ul>
<p>Sediakan minimal sebanyak jumlah VU maksimum Anda, idealnya 2–3 kali lipatnya.</p>`
        },
        {
            kind: 'salah', title: 'Memodifikasi isi SharedArray',
            body: `<p><code>SharedArray</code> bersifat <strong>read-only</strong>. Kode seperti <code>users[0].dipakai = true</code> tidak akan terlihat oleh VU lain dan bisa menimbulkan perilaku tak terduga.</p>
<p>Bila Anda butuh menandai data yang sudah terpakai, gunakan pendekatan deterministik berbasis <code>exec.scenario.iterationInTest</code> — tiap iterasi otomatis mendapat indeks unik tanpa perlu state bersama sama sekali.</p>`
        },
        {
            kind: 'best', title: 'Sediakan mekanisme reset data uji',
            body: `<p>Load test yang membuat pesanan akan menumpuk ribuan baris sampah setiap kali dijalankan. Setelah beberapa minggu, database staging membengkak dan hasil tes jadi tidak sebanding dengan tes bulan lalu.</p>
<p>Buat job terjadwal (cron nightly) yang mengosongkan data uji, atau pakai <code>teardown()</code> untuk membersihkan apa yang Anda buat. Sertakan penanda jelas (<code>email LIKE 'uji_%@contoh.id'</code>) agar penghapusan aman dan tidak menyentuh data lain.</p>`
        }
    ],
    quiz: [
        {
            q: 'Anda memuat file JSON 80 MB dan menjalankan 200 VU. Tanpa <code>SharedArray</code>, kira-kira berapa memori yang dipakai untuk data tersebut?',
            opts: ['80 MB — k6 otomatis berbagi memori', '± 16 GB, karena data disalin ke tiap VU', '400 MB', 'Tidak berpengaruh ke memori'],
            a: 1,
            exp: 'Array JavaScript biasa <strong>disalin ke setiap VU</strong>: 80 MB × 200 = sekitar 16 GB. Ini penyebab paling umum k6 kena <em>out of memory</em>. <code>SharedArray</code> menyimpan data sekali saja di sisi Go dan dibaca bersama, sehingga tetap 80 MB berapa pun jumlah VU-nya.'
        },
        {
            q: 'Anda menguji endpoint “klaim voucher” yang hanya boleh dipakai satu kali per kode. Strategi pembagian data mana yang tepat?',
            opts: [
                '<code>Math.random()</code> untuk memilih kode secara acak',
                '<code>exec.scenario.iterationInTest % data.length</code> agar tiap iterasi dapat kode unik',
                'Semua VU memakai kode yang sama agar mudah dilacak',
                '<code>exec.vu.idInTest</code> saja'
            ],
            a: 1,
            exp: '<code>iterationInTest</code> adalah penghitung <strong>global lintas VU</strong> yang unik untuk setiap iterasi, sehingga tidak ada kode yang dipakai dua kali. <code>Math.random()</code> pasti menimbulkan tabrakan, dan <code>vu.idInTest</code> tetap sama sepanjang hidup VU tersebut sehingga kode akan dipakai berulang.'
        },
        {
            q: 'Load test menunjukkan p95 hanya 8 ms — jauh lebih cepat dari produksi. Apa dugaan pertama yang paling masuk akal?',
            opts: [
                'Sistem staging memang lebih cepat dari produksi',
                'Semua VU meminta data yang sama sehingga dilayani dari cache',
                'Threshold salah dikonfigurasi',
                'k6 salah menghitung waktu'
            ],
            a: 1,
            exp: 'Hasil yang "terlalu bagus" hampir selalu berarti pengujiannya tidak realistis. Penyebab paling umum: data uji tidak bervariasi sehingga setelah request pertama semuanya dilayani cache aplikasi/CDN. Variasikan parameter query, ID, dan akun untuk mendapat gambaran yang jujur.'
        }
    ]
},

/* ---------------------------------------------------------------- 8 ----- */
{
    id: 8,
    cat: '3 · Skenario & Metrik',
    title: 'Metrik Bawaan & Metrik Kustom (Counter, Gauge, Rate, Trend)',
    level: 'Menengah', dur: '18 mnt',
    tags: ['metrics', 'counter', 'gauge', 'rate', 'trend', 'tags'],
    desc: 'Membaca setiap baris output k6 dengan benar, dan membuat metrik sendiri untuk mengukur alur bisnis, bukan sekadar request.',
    theory: `
<h2>Membaca Ringkasan k6 Baris demi Baris</h2>
<pre data-lang="console" data-file="ringkasan k6">     checks.........................: 99.42% ✓ 17204     ✗ 100
     data_received..................: 45 MB   1.5 MB/s
     data_sent......................: 3.2 MB  107 kB/s
     http_req_blocked...............: avg=1.2ms   p(95)=0.8ms
     http_req_connecting............: avg=0.5ms   p(95)=0.2ms
     http_req_duration..............: avg=245ms   p(95)=487ms  p(99)=1.2s
       { expected_response:true }...: avg=238ms   p(95)=465ms
     http_req_failed................: 0.58%  ✓ 100       ✗ 17204
     http_req_receiving.............: avg=12ms    p(95)=45ms
     http_req_sending...............: avg=0.1ms   p(95)=0.2ms
     http_req_tls_handshaking.......: avg=2.1ms   p(95)=0ms
     http_req_waiting...............: avg=233ms   p(95)=460ms
     http_reqs......................: 17304   576.8/s
     iteration_duration.............: avg=1.24s   p(95)=1.9s
     iterations.....................: 17304   576.8/s
     vus............................: 50      min=1  max=50
     vus_max........................: 50</pre>

<table>
<thead><tr><th>Metrik</th><th>Artinya</th><th>Kapan jadi masalah</th></tr></thead>
<tbody>
<tr><td><code>http_req_blocked</code></td><td>Menunggu slot koneksi TCP tersedia</td><td>Tinggi = connection pool habis / <code>batchPerHost</code> terlalu kecil</td></tr>
<tr><td><code>http_req_connecting</code></td><td>Waktu TCP handshake</td><td>Tinggi = latensi jaringan atau server kehabisan socket</td></tr>
<tr><td><code>http_req_tls_handshaking</code></td><td>Waktu negosiasi TLS</td><td>Tinggi = koneksi tidak di-reuse, atau cipher berat</td></tr>
<tr><td><code>http_req_sending</code></td><td>Mengirim request</td><td>Tinggi = payload sangat besar / bandwidth upload terbatas</td></tr>
<tr><td><strong><code>http_req_waiting</code></strong></td><td><strong>TTFB — waktu berpikir server</strong></td><td><strong>Metrik utama untuk menilai backend</strong></td></tr>
<tr><td><code>http_req_receiving</code></td><td>Mengunduh isi respons</td><td>Tinggi = respons besar, perlu paginasi/kompresi</td></tr>
<tr><td><code>http_req_duration</code></td><td>Total = sending + waiting + receiving</td><td>Ini yang dilihat pengguna</td></tr>
<tr><td><code>iteration_duration</code></td><td>Durasi satu perjalanan pengguna (termasuk <code>sleep</code>)</td><td>Berguna untuk validasi think time</td></tr>
<tr><td><code>dropped_iterations</code></td><td>Iterasi yang gagal dijadwalkan</td><td><strong>&gt; 0 berarti generator kewalahan — hasil tidak valid</strong></td></tr>
</tbody>
</table>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Bila <code>dropped_iterations</code> muncul, hasil tes Anda TIDAK SAH</div>
    <p>Metrik ini berarti k6 tidak sanggup menjalankan iterasi sebanyak yang Anda minta — biasanya karena CPU generator penuh atau <code>preAllocatedVUs</code> kurang pada arrival-rate executor. Beban yang benar-benar sampai ke server lebih kecil dari yang Anda kira, sehingga kesimpulan kapasitas jadi salah.</p>
    <p><strong>Perbaikan:</strong> naikkan <code>preAllocatedVUs</code>/<code>maxVUs</code>, kurangi target laju, atau tambah mesin generator.</p>
</div>

<h3>Empat Tipe Metrik Kustom</h3>
<pre data-lang="javascript" data-file="metrik.js">import { Counter, Gauge, Rate, Trend } from 'k6/metrics';

// COUNTER — angka yang hanya bertambah. Untuk menghitung kejadian.
const pesananDibuat = new Counter('pesanan_dibuat');
pesananDibuat.add(1);

// GAUGE — menyimpan nilai terakhir. Untuk nilai yang naik-turun.
const ukuranKeranjang = new Gauge('ukuran_keranjang');
ukuranKeranjang.add(res.json('items').length);

// RATE — persentase true dari total. Untuk rasio keberhasilan.
const stokTersedia = new Rate('stok_tersedia');
stokTersedia.add(res.json('stok') &gt; 0);

// TREND — kumpulan nilai, menghasilkan avg/min/med/max/p(N).
// Argumen kedua true = tampilkan sebagai satuan waktu.
const durasiCheckout = new Trend('durasi_checkout', true);
durasiCheckout.add(Date.now() - mulai);</pre>

<h3>Kapan Memakai Metrik Kustom</h3>
<p>Metrik bawaan mengukur <strong>request</strong>. Metrik kustom mengukur <strong>bisnis</strong>. Manajemen tidak peduli pada <code>http_req_duration</code> — mereka peduli pada "berapa lama pelanggan menunggu sampai pesanan terkonfirmasi".</p>
<pre data-lang="javascript" data-file="metrik-bisnis.js">export default function () {
  const mulai = Date.now();

  const login    = http.post(BASE + '/login', /* … */);
  const cari     = http.get(BASE + '/cari?q=sepatu');
  const keranjang= http.post(BASE + '/keranjang', /* … */);
  const bayar    = http.post(BASE + '/bayar', /* … */);

  // Satu angka yang mewakili keseluruhan perjalanan pengguna
  durasiCheckout.add(Date.now() - mulai);

  const berhasil = bayar.status === 201;
  tingkatKonversi.add(berhasil);
  if (berhasil) pesananDibuat.add(1);
}</pre>

<h3>Tag pada Metrik Kustom</h3>
<pre data-lang="javascript" data-file="tag-metrik.js">durasiCheckout.add(Date.now() - mulai, {
  metode_bayar: 'kartu_kredit',
  tier: user.tier,
});

// Lalu bisa dibuat threshold spesifik:
thresholds: {
  'durasi_checkout{metode_bayar:kartu_kredit}': ['p(95)&lt;3000'],
  'durasi_checkout{metode_bayar:va}':           ['p(95)&lt;5000'],
}</pre>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ Batasi jumlah nilai tag yang mungkin (cardinality)</div>
    <p>Tag dengan nilai tak terbatas (user ID, timestamp, UUID) akan menciptakan jutaan seri metrik dan membuat k6 maupun backend metrik Anda kehabisan memori. Gunakan tag hanya untuk kategori dengan jumlah nilai terbatas: tier, metode bayar, region, nama endpoint.</p>
</div>
`,
    lab: {
        intro: `
<h3>Praktik: Mengukur Perjalanan Bisnis, Bukan Sekadar Request</h3>
<p>Skrip berikut mengukur satu alur belanja utuh dengan metrik kustom, sehingga laporannya bisa langsung dibaca oleh product manager — bukan hanya oleh engineer.</p>`,
        files: [{
            name: 'metrik-bisnis.js', lang: 'javascript', code: `import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';
import exec from 'k6/execution';

const BASE = __ENV.BASE_URL || 'https://test-api.k6.io';

// ── Metrik yang bicara bahasa bisnis ──
const durasiPerjalanan  = new Trend('durasi_perjalanan_belanja', true);
const durasiPencarian   = new Trend('durasi_pencarian', true);
const perjalananSukses  = new Rate('perjalanan_sukses');
const produkDilihat     = new Counter('produk_dilihat');
const hasilPencarian    = new Gauge('jumlah_hasil_pencarian');

export const options = {
  stages: [
    { duration: '15s', target: 10 },
    { duration: '30s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    // SLO teknis
    http_req_duration: ['p(95)<1500'],
    http_req_failed:   ['rate<0.02'],
    checks:            ['rate>0.98'],

    // SLO bisnis — inilah yang dilaporkan ke stakeholder
    durasi_perjalanan_belanja: ['p(95)<6000', 'p(99)<10000'],
    durasi_pencarian:          ['p(95)<1000'],
    perjalanan_sukses:         ['rate>0.97'],
    produk_dilihat:            ['count>100'],
  },
};

export default function () {
  const mulaiPerjalanan = Date.now();
  let semuaBerhasil = true;

  group('01 Buka beranda', function () {
    const res = http.get(BASE + '/public/crocodiles/', {
      tags: { name: 'Beranda' },
    });
    if (!check(res, { 'beranda 200': (r) => r.status === 200 })) {
      semuaBerhasil = false;
    }
    sleep(Math.random() * 3 + 2); // pengguna membaca halaman
  });

  group('02 Cari produk', function () {
    const mulaiCari = Date.now();
    const res = http.get(BASE + '/public/crocodiles/', {
      tags: { name: 'Pencarian' },
    });
    durasiPencarian.add(Date.now() - mulaiCari);

    const ok = check(res, { 'pencarian 200': (r) => r.status === 200 });
    if (!ok) { semuaBerhasil = false; return; }

    const hasil = res.json();
    if (Array.isArray(hasil)) {
      hasilPencarian.add(hasil.length);
      produkDilihat.add(hasil.length);
    }
    sleep(Math.random() * 4 + 2);
  });

  group('03 Lihat detail produk', function () {
    const id = (exec.scenario.iterationInTest % 8) + 1;
    const res = http.get(BASE + '/public/crocodiles/' + id + '/', {
      tags: { name: 'DetailProduk' },   // tag statis untuk URL dinamis
    });
    if (!check(res, { 'detail 200': (r) => r.status === 200 })) {
      semuaBerhasil = false;
    }
    sleep(Math.random() * 5 + 3);
  });

  // Catat hasil keseluruhan perjalanan
  durasiPerjalanan.add(Date.now() - mulaiPerjalanan);
  perjalananSukses.add(semuaBerhasil);
}` }],
        steps: [
            { note: 'Jalankan dan perhatikan metrik kustom muncul di ringkasan', cmd: 'k6 run metrik-bisnis.js' },
            { note: 'Tampilkan lebih banyak persentil', cmd: 'k6 run --summary-trend-stats="avg,min,med,p(90),p(95),p(99),p(99.9),max" metrik-bisnis.js' },
            { note: 'Ekspor seluruh titik data mentah untuk analisis lanjutan', cmd: 'k6 run --out json=hasil.json metrik-bisnis.js' }
        ],
        snippets: ['k6 run metrik-bisnis.js', 'k6 run --out json=hasil.json metrik-bisnis.js']
    },
    pitfalls: [
        {
            kind: 'salah', title: 'Mengabaikan `dropped_iterations` di ringkasan',
            body: `<p>Bila baris <code>dropped_iterations</code> muncul dengan nilai &gt; 0, artinya k6 <strong>gagal menghasilkan beban yang Anda minta</strong>. Server sebenarnya menerima request lebih sedikit daripada yang Anda kira, sehingga kesimpulan "sistem sanggup 1.000 rps" bisa jadi palsu.</p>
<p>Penyebab tersering: <code>preAllocatedVUs</code> terlalu kecil pada executor <em>arrival-rate</em>, atau CPU mesin generator sudah 100%. Perbaiki dulu, baru percayai angkanya.</p>`
        },
        {
            kind: 'larangan', title: 'Jangan pakai nilai tak terbatas sebagai tag',
            body: `<p>Contoh yang salah: <code>{ tags: { user_id: user.id } }</code> dengan 100.000 pengguna. k6 akan membuat 100.000 seri metrik terpisah, memori habis, dan bila dikirim ke Prometheus akan terjadi <em>cardinality explosion</em> yang bisa merobohkan server monitoring Anda.</p>
<p>Aturan praktis: sebuah tag boleh dipakai bila jumlah nilai uniknya <strong>di bawah ± 100</strong>. Untuk data unik per-request, gunakan header biasa (yang tidak menjadi dimensi metrik), bukan tag.</p>`
        },
        {
            kind: 'best', title: 'Tambahkan `true` pada Trend yang mengukur waktu',
            body: `<p><code>new Trend('durasi_checkout', true)</code> — argumen kedua memberi tahu k6 bahwa nilainya dalam milidetik, sehingga ringkasan menampilkan <code>1.24s</code>, bukan <code>1240</code> tanpa satuan. Sepele, tapi mencegah salah baca saat laporan dibagikan ke tim lain.</p>`
        },
        {
            kind: 'kasus', title: 'Menganalisis mana yang lambat: klien, jaringan, atau server?',
            body: `<p>Gunakan dekomposisi metrik untuk menuduh pihak yang tepat:</p>
<table>
<thead><tr><th>Gejala</th><th>Tersangka</th></tr></thead>
<tbody>
<tr><td><code>waiting</code> tinggi, sisanya rendah</td><td>Backend lambat (query DB, logika berat, GC)</td></tr>
<tr><td><code>blocked</code> tinggi</td><td>Connection pool habis di sisi klien</td></tr>
<tr><td><code>connecting</code> + <code>tls_handshaking</code> tinggi</td><td>Koneksi tidak di-reuse, atau LB membatasi koneksi baru</td></tr>
<tr><td><code>receiving</code> tinggi</td><td>Payload besar / bandwidth sempit</td></tr>
<tr><td>Semua rendah tapi <code>iteration_duration</code> tinggi</td><td>Normal — itu <code>sleep()</code> Anda sendiri</td></tr>
</tbody>
</table>`
        }
    ],
    quiz: [
        {
            q: 'Anda ingin mengukur "berapa persen perjalanan checkout yang berhasil sampai pembayaran". Tipe metrik kustom apa yang tepat?',
            opts: ['<code>Counter</code>', '<code>Gauge</code>', '<code>Rate</code>', '<code>Trend</code>'],
            a: 2,
            exp: '<code>Rate</code> menerima nilai boolean dan menghitung persentase <code>true</code> dari total — persis untuk rasio keberhasilan. <code>Counter</code> hanya menghitung jumlah, <code>Gauge</code> menyimpan nilai terakhir, dan <code>Trend</code> untuk distribusi nilai numerik.'
        },
        {
            q: 'Output menunjukkan <code>http_req_waiting p(95)=45ms</code> tetapi <code>http_req_blocked p(95)=1.8s</code>. Di mana masalahnya?',
            opts: [
                'Backend lambat memproses request',
                'Klien kehabisan koneksi — VU antre menunggu slot koneksi TCP',
                'Respons terlalu besar',
                'Sertifikat TLS bermasalah'
            ],
            a: 1,
            exp: '<code>blocked</code> adalah waktu menunggu <strong>sebelum</strong> request dikirim, yaitu antre mendapatkan koneksi. Server sendiri cepat (waiting hanya 45 ms). Penyebabnya bisa <code>batchPerHost</code> terlalu kecil, <code>noConnectionReuse</code> aktif, atau generator kehabisan port ephemeral.'
        },
        {
            q: 'Ringkasan menampilkan <code>dropped_iterations: 4210</code>. Apa maknanya?',
            opts: [
                'Server menolak 4.210 request',
                'Ada 4.210 check yang gagal',
                'k6 gagal menjadwalkan 4.210 iterasi — beban yang dihasilkan lebih kecil dari target',
                '4.210 iterasi selesai lebih cepat dari perkiraan'
            ],
            a: 2,
            exp: '<code>dropped_iterations</code> berarti k6 <strong>tidak sanggup</strong> menjalankan iterasi sebanyak yang diminta, biasanya karena <code>preAllocatedVUs</code> kurang atau CPU generator penuh. Selama nilainya &gt; 0, hasil pengujian tidak mewakili beban yang Anda rencanakan dan tidak boleh dijadikan dasar kesimpulan.'
        }
    ]
},

/* ---------------------------------------------------------------- 9 ----- */
{
    id: 9,
    cat: '3 · Skenario & Metrik',
    title: 'Executors & Scenarios — Closed vs Open Model',
    level: 'Lanjut', dur: '20 mnt',
    tags: ['executor', 'scenario', 'arrival rate', 'ramping', 'vus', 'rps'],
    desc: 'Tujuh executor k6, perbedaan mendasar model tertutup dan terbuka, dan cara menjalankan banyak skenario sekaligus dalam satu tes.',
    theory: `
<h2>Closed Model vs Open Model — Konsep Paling Penting di Tingkat Lanjut</h2>

<div class="vs-grid">
<div class="vs-col vs-bad"><div class="vs-label">Closed model (VU-based)</div>
<pre data-lang="text">VU mengirim request -> menunggu balasan
   -> sleep -> mengirim lagi

Bila server MELAMBAT,
VU otomatis mengirim LEBIH SEDIKIT request.

Beban yang sampai ke server ikut turun.</pre></div>
<div class="vs-col vs-good"><div class="vs-label">Open model (arrival-rate)</div>
<pre data-lang="text">Iterasi baru dimulai setiap X milidetik,
tidak peduli iterasi sebelumnya selesai atau belum.

Bila server MELAMBAT,
laju request TETAP.

Antrean menumpuk — persis seperti dunia nyata.</pre></div>
</div>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Jebakan paling berbahaya di load testing</div>
    <p>Menggunakan <code>constant-vus</code> untuk menjawab pertanyaan "apakah sistem kami sanggup 500 request/detik?" adalah kesalahan konseptual, bukan sekadar kesalahan teknis.</p>
    <p><strong>Alasannya:</strong> dalam closed model, ketika server mulai melambat, VU Anda otomatis memperlambat diri (karena menunggu balasan). Server jadi "terlindungi" dari beban penuh dan hasilnya terlihat baik-baik saja. Fenomena ini disebut <em>coordinated omission</em> — Anda kehilangan justru momen terburuknya.</p>
    <p><strong>Yang benar:</strong> untuk target throughput, gunakan <code>constant-arrival-rate</code> atau <code>ramping-arrival-rate</code>.</p>
</div>

<h3>Tujuh Executor k6</h3>
<table>
<thead><tr><th>Executor</th><th>Model</th><th>Mengendalikan</th><th>Dipakai untuk</th></tr></thead>
<tbody>
<tr><td><code>shared-iterations</code></td><td>Tertutup</td><td>Total iterasi dibagi ke semua VU</td><td>Menghabiskan sejumlah data uji</td></tr>
<tr><td><code>per-vu-iterations</code></td><td>Tertutup</td><td>Iterasi per VU</td><td>Tiap VU melakukan N tugas</td></tr>
<tr><td><code>constant-vus</code></td><td>Tertutup</td><td>Jumlah VU tetap</td><td>Simulasi N pengguna bersamaan</td></tr>
<tr><td><code>ramping-vus</code></td><td>Tertutup</td><td>VU naik-turun bertahap</td><td>Load & stress test umum</td></tr>
<tr><td><strong><code>constant-arrival-rate</code></strong></td><td><strong>Terbuka</strong></td><td><strong>Iterasi per detik tetap</strong></td><td><strong>Menguji target throughput/RPS</strong></td></tr>
<tr><td><strong><code>ramping-arrival-rate</code></strong></td><td><strong>Terbuka</strong></td><td><strong>RPS naik bertahap</strong></td><td><strong>Breakpoint test</strong></td></tr>
<tr><td><code>externally-controlled</code></td><td>Tertutup</td><td>Dikendalikan lewat API saat berjalan</td><td>Eksplorasi manual</td></tr>
</tbody>
</table>

<h3>Menulis Skenario</h3>
<pre data-lang="javascript" data-file="skenario.js">export const options = {
  scenarios: {
    // Skenario 1: beban dasar yang konstan
    pengunjung_biasa: {
      executor: 'constant-vus',
      vus: 50,
      duration: '10m',
      exec: 'jelajahKatalog',        // nama fungsi yang dijalankan
      tags: { tipe: 'browsing' },
    },

    // Skenario 2: transaksi dengan laju terkendali, dimulai belakangan
    checkout: {
      executor: 'constant-arrival-rate',
      rate: 30,                      // 30 iterasi …
      timeUnit: '1s',                // … per detik
      duration: '10m',
      preAllocatedVUs: 50,           // VU disiapkan di awal
      maxVUs: 200,                   // batas atas bila server melambat
      startTime: '2m',               // mulai 2 menit setelah tes dimulai
      exec: 'lakukanCheckout',
      tags: { tipe: 'transaksi' },
    },

    // Skenario 3: lonjakan mendadak di tengah tes
    flash_sale: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 1000,
      startTime: '5m',
      stages: [
        { duration: '30s', target: 500 },   // 10 -> 500 rps
        { duration: '2m',  target: 500 },
        { duration: '30s', target: 10 },
      ],
      exec: 'serbuFlashSale',
    },
  },
};

// Setiap skenario memanggil fungsi yang berbeda
export function jelajahKatalog()  { /* … */ }
export function lakukanCheckout() { /* … */ }
export function serbuFlashSale()  { /* … */ }</pre>

<h3><code>preAllocatedVUs</code> vs <code>maxVUs</code> — Wajib Dipahami</h3>
<p>Pada executor arrival-rate, k6 butuh VU untuk mengeksekusi iterasi. Bila semua VU sedang sibuk menunggu respons, iterasi baru <strong>tidak bisa dimulai</strong> dan tercatat sebagai <code>dropped_iterations</code>.</p>
<ul>
    <li><code>preAllocatedVUs</code> — VU yang disiapkan sebelum tes mulai. Menyiapkan VU butuh waktu, jadi jangan terlalu sedikit.</li>
    <li><code>maxVUs</code> — batas atas bila k6 perlu menambah VU saat berjalan (karena server melambat).</li>
</ul>
<div class="callout callout-tip">
    <div class="callout-title">💡 Rumus praktis menghitung VU yang dibutuhkan</div>
    <p><code>VU dibutuhkan ≈ target_rps × durasi_iterasi_detik</code></p>
    <p>Contoh: target 100 rps, satu iterasi memakan 2 detik (termasuk sleep) → butuh ± 200 VU. Set <code>preAllocatedVUs: 200</code> dan <code>maxVUs: 400</code> untuk memberi ruang bila server melambat 2×.</p>
</div>
`,
    lab: {
        intro: `
<h3>Praktik: Tiga Skenario Berjalan Bersamaan</h3>
<p>Ini pola yang dipakai untuk simulasi produksi sungguhan: sebagian besar pengguna hanya browsing, sebagian kecil bertransaksi, dan ada lonjakan promo di tengah. Satu berkas, tiga pola beban.</p>`,
        files: [{
            name: 'skenario-campuran.js', lang: 'javascript', code: `import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import exec from 'k6/execution';

const BASE = __ENV.BASE_URL || 'https://test-api.k6.io';
const durasiCheckout = new Trend('durasi_checkout', true);

export const options = {
  scenarios: {
    // 80% trafik: pengguna yang hanya melihat-lihat (closed model, wajar)
    browsing: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 40 },
        { duration: '2m',  target: 40 },
        { duration: '30s', target: 0 },
      ],
      exec: 'jelajah',
      tags: { tipe: 'browsing' },
      gracefulRampDown: '20s',
    },

    // 20% trafik: transaksi dengan laju TERKENDALI (open model)
    // Inilah cara benar menguji "sanggup berapa transaksi per detik".
    transaksi: {
      executor: 'constant-arrival-rate',
      rate: 10,
      timeUnit: '1s',
      duration: '3m',
      preAllocatedVUs: 30,   // ~ 10 rps x 3 detik per iterasi
      maxVUs: 100,           // ruang bila server melambat
      exec: 'checkout',
      tags: { tipe: 'transaksi' },
    },

    // Lonjakan promo di menit ke-2
    flash_sale: {
      executor: 'ramping-arrival-rate',
      startRate: 5,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 300,
      startTime: '2m',
      stages: [
        { duration: '20s', target: 120 },
        { duration: '40s', target: 120 },
        { duration: '20s', target: 5 },
      ],
      exec: 'flashSale',
      tags: { tipe: 'promo' },
    },
  },

  thresholds: {
    // Threshold dipisah per skenario memakai tag otomatis "scenario"
    'http_req_duration{scenario:browsing}':   ['p(95)<1000'],
    'http_req_duration{scenario:transaksi}':  ['p(95)<2000'],
    'http_req_duration{scenario:flash_sale}': ['p(95)<3000'],
    'http_req_failed':                        ['rate<0.05'],
    'dropped_iterations':                     ['count<10'],  // jaga validitas!
    'durasi_checkout':                        ['p(95)<4000'],
  },
};

export function jelajah() {
  http.get(BASE + '/public/crocodiles/', { tags: { name: 'Katalog' } });
  sleep(Math.random() * 4 + 2);
}

export function checkout() {
  const mulai = Date.now();
  const id = (exec.scenario.iterationInTest % 8) + 1;

  const res = http.get(BASE + '/public/crocodiles/' + id + '/', {
    tags: { name: 'DetailProduk' },
  });
  check(res, { 'detail 200': (r) => r.status === 200 });

  sleep(1); // pengguna mengisi form
  http.get(BASE + '/public/crocodiles/', { tags: { name: 'Konfirmasi' } });

  durasiCheckout.add(Date.now() - mulai);
  sleep(1);
}

export function flashSale() {
  // Tanpa sleep: peserta flash sale memang menekan tombol berkali-kali
  http.get(BASE + '/public/crocodiles/1/', { tags: { name: 'FlashSale' } });
}` }],
        steps: [
            { note: 'Jalankan — perhatikan k6 menampilkan progres tiap skenario terpisah', cmd: 'k6 run skenario-campuran.js' },
            { note: 'Jalankan hanya satu skenario (berguna saat debugging)', cmd: 'k6 run --no-setup --no-teardown -e ONLY=transaksi skenario-campuran.js' },
            { note: 'Periksa dropped_iterations di ringkasan — harus mendekati nol', cmd: 'k6 run skenario-campuran.js | grep -i dropped' }
        ],
        snippets: ['k6 run skenario-campuran.js', 'k6 run --vus 5 --duration 10s skenario-campuran.js']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'Jangan pakai `constant-vus` untuk menguji target RPS',
            body: `<p>Pertanyaan "sanggup berapa request per detik?" <strong>tidak bisa</strong> dijawab dengan executor berbasis VU. Dalam closed model, VU menunggu balasan sebelum mengirim lagi — jadi ketika server melambat, beban otomatis ikut turun. Server seolah-olah "baik-baik saja" karena Anda tidak pernah benar-benar menekannya.</p>
<p>Fenomena ini dikenal sebagai <strong>coordinated omission</strong>. Gunakan <code>constant-arrival-rate</code>: laju iterasi tetap berapa pun kondisi server, sehingga antrean menumpuk persis seperti saat trafik nyata membanjir.</p>`
        },
        {
            kind: 'salah', title: '`preAllocatedVUs` terlalu kecil sehingga iterasi dibuang',
            body: `<p>Bila Anda meminta <code>rate: 200</code> per detik tapi hanya menyediakan <code>preAllocatedVUs: 10</code>, dan satu iterasi memakan 2 detik, maka maksimal yang bisa dicapai hanya 5 iterasi/detik. Sisanya masuk ke <code>dropped_iterations</code> dan tes Anda tidak pernah benar-benar mencapai 200 rps.</p>
<p><strong>Hitung dulu:</strong> <code>VU ≈ rate × durasi_iterasi_detik</code>, lalu beri margin 1,5–2× untuk <code>maxVUs</code>.</p>`
        },
        {
            kind: 'salah', title: 'Lupa `gracefulRampDown` sehingga iterasi terpotong',
            body: `<p>Saat fase ramp-down, k6 menghentikan VU. Bila sebuah VU sedang di tengah alur checkout, transaksinya terpotong dan tercatat sebagai error — mencemari statistik di akhir tes.</p>
<p><code>gracefulRampDown: '30s'</code> memberi kesempatan iterasi yang sedang berjalan untuk selesai dulu. Ada pula <code>gracefulStop</code> (default 30 detik) untuk akhir tes.</p>`
        },
        {
            kind: 'best', title: 'Beri threshold pada `dropped_iterations`',
            body: `<p>Tambahkan <code>'dropped_iterations': ['count&lt;10']</code> di setiap tes yang memakai executor arrival-rate. Dengan begitu, bila generator Anda kewalahan, tes akan <strong>gagal secara eksplisit</strong> alih-alih diam-diam menghasilkan angka yang menyesatkan.</p>`
        },
        {
            kind: 'kasus', title: 'Menirukan komposisi trafik produksi',
            body: `<p>Trafik nyata tidak seragam. Pola umum e-commerce Indonesia: ± 80% browsing, 15% pencarian/detail, 5% transaksi. Bila Anda menguji dengan 100% transaksi, Anda menguji sistem yang tidak pernah ada.</p>
<p>Ambil komposisi dari data analytics/access log produksi Anda, lalu terjemahkan menjadi beberapa skenario dengan <code>rate</code> proporsional. Inilah yang membedakan load test yang berguna dari load test yang sekadar formalitas.</p>`
        }
    ],
    quiz: [
        {
            q: 'Tim produk bertanya: "apakah API kita sanggup melayani 1.000 transaksi per detik saat Harbolnas?" Executor mana yang tepat?',
            opts: ['<code>constant-vus</code> dengan 1.000 VU', '<code>ramping-vus</code> naik ke 1.000 VU', '<code>constant-arrival-rate</code> dengan <code>rate: 1000, timeUnit: "1s"</code>', '<code>per-vu-iterations</code>'],
            a: 2,
            exp: 'Pertanyaan tentang <strong>laju (rate)</strong> hanya bisa dijawab dengan <em>open model</em>. Executor berbasis VU akan melambat sendiri ketika server melambat (coordinated omission), sehingga target 1.000 rps tidak pernah benar-benar tercapai dan Anda salah menyimpulkan kapasitas.'
        },
        {
            q: 'Target 100 iterasi/detik, satu iterasi rata-rata 3 detik. Berapa <code>preAllocatedVUs</code> minimal yang masuk akal?',
            opts: ['10 VU', '100 VU', '± 300 VU', '1.000 VU'],
            a: 2,
            exp: 'Rumusnya <code>VU ≈ rate × durasi_iterasi</code> = 100 × 3 = <strong>300 VU</strong>. Dengan VU lebih sedikit, iterasi tidak bisa dimulai tepat waktu dan masuk ke <code>dropped_iterations</code>. Set juga <code>maxVUs</code> sekitar 1,5–2× angka ini sebagai cadangan bila server melambat.'
        },
        {
            q: 'Apa fungsi <code>startTime: "5m"</code> pada sebuah skenario?',
            opts: [
                'Tes berhenti setelah 5 menit',
                'Skenario ini baru mulai berjalan 5 menit setelah tes dimulai',
                'Setiap iterasi berjeda 5 menit',
                'Warm-up selama 5 menit sebelum metrik dicatat'
            ],
            a: 1,
            exp: '<code>startTime</code> menunda dimulainya sebuah skenario. Ini memungkinkan simulasi realistis: beban dasar berjalan dulu sampai stabil, baru lonjakan flash sale masuk — sehingga Anda bisa melihat dampak lonjakan terhadap trafik yang sudah ada.'
        }
    ]
}

];

/* ==========================================================================
   GRAFANA k6 — MATERI BAGIAN C (Auth, Protokol Lain, Output, CI/CD, Analisis)
   ========================================================================== */

const K6_MOD_C = [

/* --------------------------------------------------------------- 10 ----- */
{
    id: 10,
    cat: '3 · Skenario & Metrik',
    title: 'Autentikasi & Correlation: JWT, Cookie, CSRF, Refresh Token',
    level: 'Lanjut', dur: '18 mnt',
    tags: ['auth', 'jwt', 'cookie', 'csrf', 'correlation', 'token', 'oauth'],
    desc: 'Menangani alur login yang realistis, mengambil nilai dinamis dari respons, dan menghindari kesalahan yang membuat tes mengukur hal yang salah.',
    theory: `
<h2>Correlation — Keterampilan Inti Performance Engineer</h2>
<p><strong>Correlation</strong> adalah proses mengambil nilai dinamis dari respons sebuah request, lalu memakainya di request berikutnya. Contohnya token, CSRF token, session ID, order ID, atau nonce. Skrip yang tidak melakukan correlation hanya akan bekerja sekali lalu gagal terus.</p>

<h3>Pola 1 — Login Sekali di <code>setup()</code></h3>
<p>Cocok bila semua VU boleh berbagi satu identitas (misalnya menguji endpoint publik yang butuh API key).</p>
<pre data-lang="javascript" data-file="auth-setup.js">export function setup() {
  const res = http.post(BASE + '/auth/login', JSON.stringify({
    username: __ENV.TEST_USER,
    password: __ENV.TEST_PASSWORD,
  }), { headers: { 'Content-Type': 'application/json' } });

  if (res.status !== 200) throw new Error('Login gagal: ' + res.status);
  return { token: res.json('access_token') };
}

export default function (data) {
  http.get(BASE + '/api/profil', {
    headers: { Authorization: 'Bearer ' + data.token },
  });
}</pre>
<div class="callout callout-warn">
    <div class="callout-title">⚠️ Keterbatasan pola ini</div>
    <p>Anda <strong>tidak menguji endpoint login</strong> sama sekali, padahal login sering jadi bottleneck terberat (hashing bcrypt/argon2 sengaja dibuat lambat). Selain itu, token bisa kedaluwarsa di tengah tes panjang.</p>
</div>

<h3>Pola 2 — Login per VU, Cache Token</h3>
<p>Ini pola yang paling realistis untuk kebanyakan kasus: setiap VU login sekali di iterasi pertama, lalu memakai ulang tokennya.</p>
<pre data-lang="javascript" data-file="auth-per-vu.js">// Variabel di scope modul: nilainya PER VU, tidak dibagi antar VU
let token = null;
let tokenKedaluwarsa = 0;

function pastikanToken(user) {
  const sekarang = Date.now();
  // Refresh 60 detik sebelum benar-benar kedaluwarsa
  if (token && sekarang &lt; tokenKedaluwarsa - 60000) return token;

  const res = http.post(BASE + '/auth/login', JSON.stringify({
    username: user.email, password: user.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'Login' },
  });

  if (res.status !== 200) {
    console.error('Login gagal untuk ' + user.email + ': ' + res.status);
    return null;
  }

  token = res.json('access_token');
  tokenKedaluwarsa = sekarang + (res.json('expires_in') || 3600) * 1000;
  return token;
}</pre>

<h3>Pola 3 — Cookie & Session (aplikasi web klasik)</h3>
<p>k6 mengelola cookie secara otomatis per VU. Setelah login, cookie sesi ikut terkirim di request berikutnya tanpa Anda atur.</p>
<pre data-lang="javascript" data-file="cookie.js">// Otomatis: cookie dari respons login tersimpan di cookie jar VU ini
http.post(BASE + '/login', { email: u.email, password: u.password });
http.get(BASE + '/dashboard');   // cookie sesi otomatis terkirim

// Manual bila perlu kontrol penuh
const jar = http.cookieJar();
jar.set(BASE, 'session_id', 'abc123');
console.log(jar.cookiesForURL(BASE));

// Membersihkan cookie di awal iterasi (mensimulasikan pengguna baru)
jar.clear(BASE);</pre>

<h3>Pola 4 — CSRF Token</h3>
<p>Aplikasi berbasis form (Django, Rails, Laravel) mengirim token CSRF di HTML atau cookie. Anda harus mengambilnya dulu.</p>
<pre data-lang="javascript" data-file="csrf.js">// Ambil halaman login untuk mendapatkan CSRF token
const halaman = http.get(BASE + '/login');

// Cara A — parsing HTML (k6 punya selektor mirip jQuery)
const csrf = halaman.html().find('input[name=csrfmiddlewaretoken]').attr('value');

// Cara B — regex (lebih cepat, tapi rapuh bila HTML berubah)
const cocok = halaman.body.match(/name="csrf_token" value="([^"]+)"/);
const csrf2 = cocok ? cocok[1] : null;

// Cara C — dari cookie
const csrf3 = http.cookieJar().cookiesForURL(BASE)['csrftoken'][0];

http.post(BASE + '/login', {
  username: u.email, password: u.password, csrfmiddlewaretoken: csrf,
}, { headers: { Referer: BASE + '/login' } });</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Jangan pernah hardcode token hasil rekaman</div>
    <p>Menyalin token dari DevTools browser lalu menempelkannya ke skrip akan &quot;berhasil&quot; hari ini dan gagal total besok saat token kedaluwarsa. Lebih buruk lagi: Anda melewati proses login sehingga bottleneck di sana tidak pernah terdeteksi, dan token asli (yang mungkin milik akun nyata) bocor ke repositori Git.</p>
</div>

<h3>Menangani Token Kedaluwarsa di Tengah Tes</h3>
<pre data-lang="javascript" data-file="refresh.js">function requestDenganRetry(metode, url, body, params) {
  let res = http.request(metode, url, body, params);

  // 401 = token kedaluwarsa -> perbarui lalu ulangi SEKALI
  if (res.status === 401) {
    token = null;                 // paksa login ulang
    const baru = pastikanToken(user);
    if (!baru) return res;
    params.headers.Authorization = 'Bearer ' + baru;
    res = http.request(metode, url, body, params);
  }
  return res;
}</pre>
`,
    lab: {
        intro: `
<h3>Praktik: Alur Autentikasi Produksi-Grade</h3>
<p>Skrip ini menerapkan login per VU, cache token, refresh otomatis, dan retry pada 401 — pola yang bisa Anda salin langsung ke proyek nyata.</p>`,
        files: [{
            name: 'auth-lengkap.js', lang: 'javascript', code: `import http from 'k6/http';
import { check, sleep, fail } from 'k6';
import { SharedArray } from 'k6/data';
import { Trend, Counter } from 'k6/metrics';
import exec from 'k6/execution';

const BASE = __ENV.BASE_URL || 'https://test-api.k6.io';

const durasiLogin = new Trend('durasi_login', true);
const loginUlang  = new Counter('login_ulang');

// Akun uji dibuat lebih dulu oleh skrip seeding, BUKAN akun pelanggan asli
const users = new SharedArray('users', function () {
  const daftar = [];
  for (let i = 1; i <= 50; i++) {
    daftar.push({
      username: 'perfuser' + String(i).padStart(3, '0'),
      password: __ENV.TEST_PASSWORD || 'SandiUji123!',
    });
  }
  return daftar;
});

export const options = {
  vus: 10,
  duration: '1m',
  thresholds: {
    'http_req_duration{name:Login}': ['p(95)<2000'],
    'durasi_login':                  ['p(95)<2000'],
    'http_req_failed':               ['rate<0.05'],
    'checks':                        ['rate>0.95'],
  },
};

// ── State PER VU (bukan dibagi antar VU) ──
let token = null;
let kedaluwarsaPada = 0;
let user = null;

function ambilUser() {
  if (!user) user = users[(exec.vu.idInTest - 1) % users.length];
  return user;
}

function pastikanToken() {
  const sekarang = Date.now();
  if (token && sekarang < kedaluwarsaPada - 60000) return token;

  if (token) loginUlang.add(1);   // hitung berapa kali token diperbarui

  const u = ambilUser();
  const mulai = Date.now();

  const res = http.post(
    BASE + '/auth/token/login/',
    JSON.stringify({ username: u.username, password: u.password }),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: 'Login' },
      timeout: '15s',
    }
  );

  durasiLogin.add(Date.now() - mulai);

  const ok = check(res, {
    'login berhasil': (r) => r.status === 200,
    'token diterima': (r) => !!r.json('access'),
  });

  if (!ok) { token = null; return null; }

  token = res.json('access');
  // API ini tidak mengirim expires_in; asumsikan 10 menit
  kedaluwarsaPada = Date.now() + 10 * 60 * 1000;
  return token;
}

// Pembungkus request yang otomatis me-refresh token saat kena 401
function apiRequest(metode, path, body, extraParams) {
  const t = pastikanToken();
  if (!t) return null;

  const params = Object.assign({
    headers: {
      Authorization: 'Bearer ' + t,
      'Content-Type': 'application/json',
    },
    timeout: '10s',
  }, extraParams || {});

  let res = http.request(metode, BASE + path, body, params);

  if (res.status === 401) {
    token = null;                       // paksa login ulang
    const baru = pastikanToken();
    if (!baru) return res;
    params.headers.Authorization = 'Bearer ' + baru;
    res = http.request(metode, BASE + path, body, params);
  }
  return res;
}

export default function () {
  const res = apiRequest('GET', '/my/crocodiles/', null, {
    tags: { name: 'ListMilikSaya' },
  });

  if (!res) { sleep(1); return; }

  check(res, {
    'list 200':     (r) => r.status === 200,
    'bukan 401':    (r) => r.status !== 401,
    'balasan array': (r) => Array.isArray(r.json()),
  });

  sleep(Math.random() * 2 + 1);
}` }],
        steps: [
            { note: 'Siapkan kredensial lewat variabel lingkungan, bukan di dalam kode', cmd: 'export TEST_PASSWORD="SandiUji123!"\nk6 run auth-lengkap.js' },
            { note: 'Di Windows PowerShell', cmd: '$env:TEST_PASSWORD="SandiUji123!"\nk6 run auth-lengkap.js', lang: 'bash' },
            { note: 'Periksa metrik login_ulang — bila tinggi, TTL token terlalu pendek', cmd: 'k6 run auth-lengkap.js | grep -E "login_ulang|durasi_login"' }
        ],
        snippets: ['k6 run auth-lengkap.js', 'k6 run --vus 3 --duration 20s auth-lengkap.js']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'Jangan menempelkan token hasil salin dari browser',
            body: `<p>Tiga masalah sekaligus:</p>
<ol>
<li><strong>Rapuh.</strong> Token kedaluwarsa dalam hitungan menit atau jam; skrip Anda akan gagal misterius besok pagi.</li>
<li><strong>Menyembunyikan bottleneck.</strong> Endpoint login biasanya paling berat karena hashing password sengaja dibuat lambat (bcrypt/argon2). Melewatinya berarti Anda tidak pernah menguji bagian tersulit.</li>
<li><strong>Kebocoran keamanan.</strong> Token itu milik akun nyata dan kini tersimpan permanen di riwayat Git.</li>
</ol>`
        },
        {
            kind: 'salah', title: 'Login ulang di setiap iterasi',
            body: `<p>Bila <code>pastikanToken()</code> tidak melakukan cache, setiap iterasi akan memanggil endpoint login. Akibatnya beban ke endpoint login menjadi 10–50× lebih besar daripada di produksi nyata (pengguna asli login sekali lalu memakai token berjam-jam).</p>
<p>Anda akan "menemukan" bahwa login lambat — padahal Anda sendiri yang menyerangnya secara tidak wajar. Simpan token di variabel scope modul dan perbarui hanya saat mendekati kedaluwarsa.</p>`
        },
        {
            kind: 'salah', title: 'Semua VU memakai satu akun sehingga kena rate limit',
            body: `<p>Banyak sistem membatasi percobaan login per akun (misal 5 kali per menit) sebagai proteksi <em>brute force</em>. Bila 200 VU login dengan akun yang sama, Anda akan mendapat banjir <code>429 Too Many Requests</code> — dan yang Anda ukur adalah rate limiter, bukan aplikasi.</p>
<p>Siapkan kumpulan akun uji minimal sebanyak jumlah VU, dan bagikan dengan <code>exec.vu.idInTest % users.length</code>.</p>`
        },
        {
            kind: 'best', title: 'Gunakan `fail()` untuk menghentikan iterasi yang sudah pasti gagal',
            body: `<p>Bila login gagal, melanjutkan ke request berikutnya hanya menghasilkan tumpukan 401 yang mencemari statistik. Gunakan <code>fail('pesan')</code> dari modul <code>k6</code> untuk menghentikan iterasi tersebut secara bersih, atau <code>return</code> lebih awal.</p>
<pre data-lang="javascript">import { fail } from 'k6';
if (res.status !== 200) fail('login gagal: ' + res.status);</pre>`
        },
        {
            kind: 'kasus', title: 'Menguji OAuth2 / SSO pihak ketiga',
            body: `<p>Alur OAuth melibatkan penyedia identitas eksternal (Google, Auth0, Keycloak). Membanjirinya dengan load test hampir selalu <strong>melanggar Terms of Service</strong> dan akan memblokir akun Anda.</p>
<p><strong>Pendekatan yang benar:</strong></p>
<ul>
<li>Gunakan alur <em>client credentials</em> atau <em>password grant</em> ke instance identity provider milik Anda sendiri di staging.</li>
<li>Atau mock penyedia eksternal, lalu uji beban hanya pada bagian sistem yang Anda kendalikan.</li>
<li>Bila memang harus menguji IdP pihak ketiga, minta izin dan kuota khusus dari vendor terlebih dahulu.</li>
</ul>`
        }
    ],
    quiz: [
        {
            q: 'Di mana sebaiknya token disimpan agar tiap VU punya tokennya sendiri dan tidak login ulang setiap iterasi?',
            opts: [
                'Di dalam fungsi <code>default</code> sebagai variabel lokal',
                'Di variabel scope modul (init context), karena nilainya terpisah per VU',
                'Di <code>SharedArray</code> agar hemat memori',
                'Di localStorage browser'
            ],
            a: 1,
            exp: 'Variabel di scope modul diinisialisasi ulang untuk setiap VU dan bertahan antar-iterasi VU tersebut — persis yang dibutuhkan untuk cache token. Variabel lokal di <code>default</code> hilang tiap iterasi, dan <code>SharedArray</code> bersifat read-only sehingga tidak bisa dipakai menyimpan state.'
        },
        {
            q: 'Load test menghasilkan banyak <code>429 Too Many Requests</code> pada endpoint login. Apa penyebab paling mungkin?',
            opts: [
                'Server kehabisan memori',
                'Semua VU memakai akun yang sama sehingga terkena rate limit per-akun',
                'Threshold salah dikonfigurasi',
                'Token JWT tidak valid'
            ],
            a: 1,
            exp: 'Kode 429 berarti rate limiting. Penyebab paling umum di load test adalah semua VU berbagi satu identitas, sehingga proteksi brute-force per-akun aktif. Solusinya menyediakan kumpulan akun uji dan membaginya per VU.'
        },
        {
            q: 'Apa yang dimaksud dengan <em>correlation</em> dalam performance testing?',
            opts: [
                'Menghitung korelasi statistik antara latency dan jumlah VU',
                'Mengambil nilai dinamis dari respons sebuah request untuk dipakai di request berikutnya',
                'Menyamakan waktu antar mesin generator',
                'Menggabungkan hasil beberapa tes menjadi satu laporan'
            ],
            a: 1,
            exp: 'Correlation adalah mengekstrak nilai dinamis — token, CSRF, session ID, order ID — dari respons lalu memakainya di request selanjutnya. Tanpa correlation, skrip hanya bekerja untuk data yang di-hardcode dan akan gagal pada eksekusi berikutnya.'
        }
    ]
},

/* --------------------------------------------------------------- 11 ----- */
{
    id: 11,
    cat: '3 · Skenario & Metrik',
    title: 'Di Luar HTTP: WebSocket, gRPC, dan Browser Testing',
    level: 'Lanjut', dur: '16 mnt',
    tags: ['websocket', 'grpc', 'browser', 'chromium', 'realtime', 'protobuf'],
    desc: 'Menguji protokol selain HTTP dan kapan Anda benar-benar membutuhkan pengujian level browser.',
    theory: `
<h2>WebSocket</h2>
<p>Untuk aplikasi realtime: chat, notifikasi, dashboard live, trading. k6 menyediakan modul WebSocket berbasis event.</p>

<div class="callout callout-warning">
    <div class="callout-title">⚠️ Jalur import berubah di k6 v1.0</div>
    <p>Sejumlah modul <code>k6/experimental/*</code> sudah lulus menjadi modul stabil. Skrip lama yang mengimpor <code>k6/experimental/websockets</code> dan <code>k6/experimental/grpc</code> perlu diperbarui menjadi <code>k6/net/websockets</code> dan <code>k6/net/grpc</code>. Modul <code>k6/ws</code> generasi pertama (berbasis callback, satu koneksi memblokir satu VU) sudah usang — gunakan modul berbasis event di bawah ini yang bisa menangani banyak koneksi paralel per VU.</p>
</div>
<pre data-lang="javascript" data-file="websocket.js">import { WebSocket } from 'k6/net/websockets';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';

const latensiPesan = new Trend('latensi_pesan_ws', true);
const pesanDiterima = new Counter('pesan_ws_diterima');

export default function () {
  const ws = new WebSocket('wss://echo.websocket.org');
  const dikirimPada = {};

  ws.onopen = function () {
    // Kirim pesan berkala, seperti klien chat sungguhan
    let n = 0;
    const timer = setInterval(function () {
      if (n++ &gt;= 10) { clearInterval(timer); ws.close(); return; }
      const id = 'msg-' + n;
      dikirimPada[id] = Date.now();
      ws.send(JSON.stringify({ id: id, teks: 'halo dunia' }));
    }, 1000);
  };

  ws.onmessage = function (e) {
    pesanDiterima.add(1);
    try {
      const data = JSON.parse(e.data);
      if (dikirimPada[data.id]) {
        latensiPesan.add(Date.now() - dikirimPada[data.id]);
      }
    } catch (err) { /* pesan bukan JSON, abaikan */ }
  };

  ws.onerror = function (e) { console.error('WS error: ' + e.error); };
}</pre>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ WebSocket = koneksi yang tetap terbuka</div>
    <p>Berbeda dengan HTTP, satu VU WebSocket menahan satu koneksi TCP selama hidupnya. 10.000 VU berarti 10.000 koneksi terbuka bersamaan — Anda akan menabrak batas <em>file descriptor</em> OS (<code>ulimit -n</code>, default sering hanya 1024) jauh sebelum menabrak batas server.</p>
    <p>Naikkan dengan <code>ulimit -n 65535</code> di mesin generator sebelum menjalankan tes.</p>
</div>

<h3>gRPC</h3>
<pre data-lang="javascript" data-file="grpc.js">import grpc from 'k6/net/grpc';
import { check } from 'k6';

const client = new grpc.Client();
// WAJIB di init context — pemuatan .proto tidak boleh di dalam default()
client.load(['definisi'], 'layanan.proto');

export default function () {
  client.connect('grpc.contoh.id:9000', {
    plaintext: false,     // true bila tanpa TLS (hanya untuk lokal)
    timeout: '10s',
  });

  const res = client.invoke('paket.LayananProduk/AmbilProduk', { id: 123 });

  check(res, {
    'status OK':  (r) =&gt; r.status === grpc.StatusOK,
    'ada nama':   (r) =&gt; r.message.nama !== undefined,
  });

  client.close();   // JANGAN lupa, kalau tidak koneksi bocor
}</pre>

<h3>Browser Testing dengan <code>k6/browser</code></h3>
<p>Menjalankan Chromium sungguhan untuk mengukur pengalaman pengguna di sisi frontend: waktu render, interaksi, dan Core Web Vitals.</p>
<pre data-lang="javascript" data-file="browser.js">import { browser } from 'k6/browser';
import { check } from 'k6';

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 5,
      options: { browser: { type: 'chromium' } },
    },
  },
  thresholds: {
    browser_web_vital_lcp: ['p(95)&lt;2500'],   // Largest Contentful Paint
    browser_web_vital_cls: ['p(95)&lt;0.1'],    // Cumulative Layout Shift
    browser_web_vital_inp: ['p(95)&lt;200'],    // Interaction to Next Paint
  },
};

export default async function () {
  const page = await browser.newPage();
  try {
    await page.goto('https://contoh.id/produk', { waitUntil: 'networkidle' });

    await page.locator('input[name="cari"]').type('sepatu');
    await Promise.all([
      page.waitForNavigation(),
      page.locator('button[type="submit"]').click(),
    ]);

    const jumlah = await page.locator('.kartu-produk').count();
    check(jumlah, { 'ada hasil pencarian': (n) =&gt; n &gt; 0 });

    await page.screenshot({ path: 'hasil.png' });
  } finally {
    await page.close();   // WAJIB, kalau tidak proses Chromium menumpuk
  }
}</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Browser testing SANGAT mahal — jangan dipakai untuk beban</div>
    <p>Satu instance Chromium memakan ± 100–300 MB RAM dan satu inti CPU. Menjalankan 100 VU browser butuh mesin dengan puluhan GB RAM dan puluhan core — biaya yang tidak masuk akal.</p>
    <p><strong>Pola yang benar (hybrid):</strong> gunakan protokol HTTP untuk menghasilkan beban besar (ribuan VU), dan jalankan 1–5 VU browser secara paralel hanya untuk <em>mengukur</em> pengalaman frontend di bawah beban tersebut.</p>
</div>

<h3>Pola Hybrid: Beban Protokol + Pengukuran Browser</h3>
<pre data-lang="javascript" data-file="hybrid.js">export const options = {
  scenarios: {
    beban_protokol: {
      executor: 'constant-arrival-rate',
      rate: 200, timeUnit: '1s', duration: '10m',
      preAllocatedVUs: 300, maxVUs: 600,
      exec: 'bebanApi',
    },
    ukur_frontend: {
      executor: 'constant-vus',
      vus: 2,                       // cukup 2 — ini pengukur, bukan penghasil beban
      duration: '10m',
      options: { browser: { type: 'chromium' } },
      exec: 'ukurUi',
    },
  },
};</pre>
`,
    lab: {
        intro: `
<h3>Praktik: Mengukur Latensi WebSocket</h3>
<p>Skrip berikut mengukur waktu bolak-balik (round-trip) pesan WebSocket — metrik yang tidak bisa didapat dari pengujian HTTP biasa.</p>`,
        files: [{
            name: 'ws-latensi.js', lang: 'javascript', code: `import { WebSocket } from 'k6/net/websockets';
import { check, sleep } from 'k6';
import { Trend, Counter, Rate } from 'k6/metrics';
import exec from 'k6/execution';

const latensi     = new Trend('ws_latensi_pesan', true);
const diterima    = new Counter('ws_pesan_diterima');
const dikirim     = new Counter('ws_pesan_dikirim');
const koneksiOk   = new Rate('ws_koneksi_berhasil');

const URL = __ENV.WS_URL || 'wss://echo.websocket.org';

export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    ws_latensi_pesan:    ['p(95)<500', 'p(99)<1000'],
    ws_koneksi_berhasil: ['rate>0.99'],
  },
};

export default function () {
  const ws = new WebSocket(URL);
  const waktuKirim = {};
  let selesai = false;

  ws.onopen = function () {
    koneksiOk.add(true);
    let n = 0;

    const timer = setInterval(function () {
      n++;
      if (n > 10) {
        clearInterval(timer);
        ws.close();
        return;
      }
      const id = 'vu' + exec.vu.idInTest + '-' + n;
      waktuKirim[id] = Date.now();
      dikirim.add(1);
      ws.send(JSON.stringify({ id: id, waktu: Date.now() }));
    }, 500);
  };

  ws.onmessage = function (e) {
    diterima.add(1);
    try {
      const data = JSON.parse(e.data);
      if (data.id && waktuKirim[data.id]) {
        latensi.add(Date.now() - waktuKirim[data.id]);
        delete waktuKirim[data.id];   // cegah kebocoran memori
      }
    } catch (err) {
      // echo server bisa mengirim pesan sambutan yang bukan JSON
    }
  };

  ws.onerror = function (e) {
    koneksiOk.add(false);
    console.error('WS error: ' + (e && e.error));
  };

  ws.onclose = function () { selesai = true; };
}` }],
        steps: [
            { note: 'Naikkan batas file descriptor sebelum tes WebSocket berskala besar (Linux/macOS)', cmd: 'ulimit -n 65535\nulimit -n', out: '65535' },
            { note: 'Jalankan tes WebSocket', cmd: 'k6 run ws-latensi.js' },
            { note: 'Arahkan ke server Anda sendiri', cmd: 'k6 run -e WS_URL=ws://localhost:8080/ws ws-latensi.js' }
        ],
        snippets: ['k6 run ws-latensi.js', 'ulimit -n']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'Jangan pakai k6/browser untuk menghasilkan beban besar',
            body: `<p>Chromium memakan ± 100–300 MB RAM dan satu core CPU per instance. 100 VU browser = puluhan GB RAM dan puluhan core. Selain mahal, generator Anda akan jadi bottleneck dan hasilnya tidak valid.</p>
<p>Gunakan pola <strong>hybrid</strong>: HTTP protocol-level untuk beban (ribuan VU murah), 1–5 VU browser untuk mengukur pengalaman frontend di bawah beban itu.</p>`
        },
        {
            kind: 'salah', title: 'Lupa `client.close()` pada gRPC atau `page.close()` pada browser',
            body: `<p>Koneksi gRPC yang tidak ditutup akan menumpuk sampai file descriptor habis. Halaman browser yang tidak ditutup meninggalkan proses Chromium zombie yang menghabiskan RAM sampai mesin tidak responsif.</p>
<p>Selalu bungkus dengan <code>try { … } finally { page.close(); }</code> agar tetap tertutup meski terjadi error di tengah.</p>`
        },
        {
            kind: 'salah', title: 'Menabrak batas `ulimit -n` saat tes WebSocket',
            body: `<p>Gejalanya: error <code>too many open files</code> atau <code>dial: socket: too many open files</code> saat menaikkan VU. Ini <strong>batas OS di mesin generator Anda</strong>, bukan masalah di server yang diuji.</p>
<p>Perbaikan sementara: <code>ulimit -n 65535</code>. Permanen: tambahkan di <code>/etc/security/limits.conf</code> atau <code>LimitNOFILE</code> pada unit systemd.</p>`
        },
        {
            kind: 'best', title: 'Muat berkas .proto di init context',
            body: `<p><code>client.load()</code> membaca berkas dari disk, jadi hanya boleh dipanggil di init context. Memanggilnya di dalam <code>default()</code> akan melempar error dan — kalaupun bisa — akan membaca disk ribuan kali per detik.</p>`
        }
    ],
    quiz: [
        {
            q: 'Anda perlu menguji 5.000 pengguna bersamaan sekaligus mengukur Largest Contentful Paint. Pendekatan mana yang benar?',
            opts: [
                '5.000 VU dengan <code>k6/browser</code>',
                'Hybrid: 5.000 VU protokol HTTP + 2–5 VU browser untuk mengukur',
                'Hanya browser dengan 50 VU, lalu diekstrapolasi',
                'Tidak mungkin dilakukan dengan k6'
            ],
            a: 1,
            exp: 'Pola hybrid adalah standar industri: beban besar dihasilkan murah lewat protokol HTTP, sementara beberapa VU browser mengukur pengalaman frontend nyata di bawah beban tersebut. 5.000 VU Chromium akan butuh ratusan GB RAM dan generatornya sendiri yang jadi bottleneck.'
        },
        {
            q: 'Saat menaikkan VU pada tes WebSocket, muncul error <code>too many open files</code>. Apa penyebabnya?',
            opts: [
                'Server target kehabisan memori',
                'Batas file descriptor di OS mesin generator terlampaui',
                'Skrip k6 punya kebocoran memori',
                'Sertifikat TLS tidak valid'
            ],
            a: 1,
            exp: 'Setiap koneksi WebSocket menahan satu file descriptor selama hidup VU. Batas default OS sering hanya 1024. Naikkan dengan <code>ulimit -n 65535</code> di mesin generator — ini murni batasan sisi klien, bukan indikasi masalah di server.'
        }
    ]
},

/* --------------------------------------------------------------- 12 ----- */
{
    id: 12,
    cat: '4 · Produksi & CI/CD',
    title: 'Output & Integrasi: Prometheus, Grafana, JSON, handleSummary',
    level: 'Lanjut', dur: '17 mnt',
    tags: ['output', 'prometheus', 'grafana', 'json', 'csv', 'summary', 'laporan'],
    desc: 'Mengirim hasil k6 ke sistem monitoring, membuat laporan HTML kustom, dan menyimpan riwayat untuk deteksi regresi.',
    theory: `
<h2>Kenapa Ringkasan Terminal Saja Tidak Cukup</h2>
<p>Ringkasan di terminal hanya menampilkan <strong>agregat keseluruhan tes</strong>. Ia tidak bisa menjawab pertanyaan penting seperti: "pada detik ke berapa latency mulai naik?", "apakah p95 build ini lebih buruk dari build kemarin?", atau "apa yang terjadi di server saat p99 melonjak?".</p>

<h3>Format Output yang Tersedia</h3>
<table>
<thead><tr><th>Perintah</th><th>Kegunaan</th></tr></thead>
<tbody>
<tr><td><code>--out json=hasil.json</code></td><td>Semua titik data mentah — besar, untuk analisis mendalam</td></tr>
<tr><td><code>--out csv=hasil.csv</code></td><td>Untuk diolah di Excel/pandas</td></tr>
<tr><td><code>--out experimental-prometheus-rw</code></td><td>Kirim langsung ke Prometheus (remote write)</td></tr>
<tr><td><code>--out influxdb=http://…</code></td><td>InfluxDB v1 (pola klasik k6 + InfluxDB + Grafana)</td></tr>
<tr><td><code>--summary-export=ringkasan.json</code></td><td>Hanya agregat akhir — kecil, cocok untuk artefak CI</td></tr>
<tr><td><code>--out cloud</code></td><td>Grafana Cloud k6 (butuh akun)</td></tr>
</tbody>
</table>

<h3>Mengirim ke Prometheus (Remote Write)</h3>
<pre data-lang="bash" data-file="terminal">export K6_PROMETHEUS_RW_SERVER_URL=http://localhost:9090/api/v1/write
export K6_PROMETHEUS_RW_TREND_STATS="p(95),p(99),min,max,avg"

k6 run --out experimental-prometheus-rw \\
       --tag testid=checkout-2026-07-27 \\
       --tag build=421 \\
       skrip.js</pre>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ Prometheus harus mengizinkan remote write</div>
    <p>Endpoint <code>/api/v1/write</code> tidak aktif secara default. Jalankan Prometheus dengan flag <code>--web.enable-remote-write-receiver</code>, atau kirim ke Grafana Mimir/Cortex/Thanos.</p>
    <p>Nama output ini masih berawalan <code>experimental-</code> di banyak versi k6 — periksa <code>k6 --help</code> pada versi Anda bila perintahnya ditolak.</p>
</div>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Jangan pakai tag <code>testid</code> berbeda di setiap eksekusi tanpa rencana retensi</div>
    <p>Setiap nilai <code>testid</code> baru menciptakan seri metrik baru di Prometheus. Menjalankan tes 50× sehari dengan testid unik akan meledakkan kardinalitas dan bisa merobohkan Prometheus Anda.</p>
    <p>Gunakan retensi pendek untuk metrik load test (misalnya 15 hari), atau simpan di instance Prometheus terpisah dari monitoring produksi.</p>
</div>

<h3><code>handleSummary()</code> — Laporan Sesuai Kebutuhan Anda</h3>
<p>Fungsi khusus yang dipanggil k6 di akhir tes. Apa pun yang Anda kembalikan akan ditulis ke berkas.</p>
<pre data-lang="javascript" data-file="handle-summary.js">import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

export function handleSummary(data) {
  const p95 = data.metrics.http_req_duration.values['p(95)'];
  const gagal = data.metrics.http_req_failed.values.rate * 100;

  return {
    // Tetap tampilkan ringkasan biasa di terminal
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),

    // Simpan data mentah untuk perbandingan antar-build
    'hasil/ringkasan.json': JSON.stringify(data, null, 2),

    // Laporan ringkas untuk dikirim ke Slack/Teams
    'hasil/laporan.md':
      '# Hasil Load Test\\n\\n' +
      '| Metrik | Nilai |\\n|---|---|\\n' +
      '| p95 latency | ' + p95.toFixed(0) + ' ms |\\n' +
      '| Error rate | ' + gagal.toFixed(2) + '% |\\n' +
      '| Total request | ' + data.metrics.http_reqs.values.count + ' |\\n',
  };
}</pre>

<h3>Deteksi Regresi Antar-Build</h3>
<p>Ini nilai praktis terbesar dari menyimpan ringkasan: membandingkan build hari ini dengan build sebelumnya secara otomatis.</p>
<pre data-lang="javascript" data-file="bandingkan.js">// Dijalankan di CI setelah k6 selesai:  node bandingkan.js baseline.json hasil.json
const dasar = require('./baseline.json');
const baru  = require('./hasil.json');

const p95Dasar = dasar.metrics.http_req_duration.values['p(95)'];
const p95Baru  = baru.metrics.http_req_duration.values['p(95)'];
const selisih  = ((p95Baru - p95Dasar) / p95Dasar) * 100;

console.log('p95 baseline : ' + p95Dasar.toFixed(0) + ' ms');
console.log('p95 build ini: ' + p95Baru.toFixed(0)  + ' ms');
console.log('perubahan    : ' + selisih.toFixed(1)  + '%');

if (selisih &gt; 10) {
  console.error('REGRESI: p95 memburuk lebih dari 10%');
  process.exit(1);   // gagalkan pipeline
}</pre>
`,
    lab: {
        intro: `
<h3>Praktik: Stack Observability Lokal untuk k6</h3>
<p>Jalankan Prometheus + Grafana lewat Docker Compose, kirim hasil k6 ke sana, lalu amati grafiknya secara langsung saat tes berjalan. Ini persis pola yang dipakai di lingkungan kerja.</p>`,
        files: [
            {
                name: 'docker-compose.yml', lang: 'yaml', code: `services:
  prometheus:
    image: prom/prometheus:v3.1.0
    container_name: k6-prometheus
    ports:
      - "9090:9090"
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      # WAJIB: tanpa flag ini, endpoint remote write tidak aktif
      - --web.enable-remote-write-receiver
      - --enable-feature=native-histograms
      - --storage.tsdb.retention.time=15d
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro

  grafana:
    image: grafana/grafana:12.0.0
    container_name: k6-grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_AUTH_ANONYMOUS_ENABLED=true
      - GF_AUTH_ANONYMOUS_ORG_ROLE=Admin
    depends_on:
      - prometheus`
            },
            {
                name: 'prometheus.yml', lang: 'yaml', code: `global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ["localhost:9090"]`
            },
            {
                name: 'laporan.js', lang: 'javascript', code: `import http from 'k6/http';
import { check, sleep } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

const BASE = __ENV.BASE_URL || 'https://test-api.k6.io';

export const options = {
  stages: [
    { duration: '20s', target: 20 },
    { duration: '40s', target: 20 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.02'],
  },
  tags: {
    testid: __ENV.TEST_ID || 'lokal-' + Date.now(),
    build:  __ENV.BUILD_ID || 'dev',
  },
};

export default function () {
  const res = http.get(BASE + '/public/crocodiles/', { tags: { name: 'List' } });
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}

export function handleSummary(data) {
  const d = data.metrics.http_req_duration.values;
  const gagal = (data.metrics.http_req_failed.values.rate * 100).toFixed(2);
  const total = data.metrics.http_reqs.values.count;

  const baris = [
    '# Laporan Load Test',
    '',
    '- Test ID    : ' + (__ENV.TEST_ID || 'lokal'),
    '- Total req  : ' + total,
    '- Error rate : ' + gagal + '%',
    '',
    '| Statistik | Nilai (ms) |',
    '|---|---|',
    '| avg  | ' + d.avg.toFixed(0) + ' |',
    '| p(90)| ' + (d['p(90)'] || 0).toFixed(0) + ' |',
    '| p(95)| ' + d['p(95)'].toFixed(0) + ' |',
    '| max  | ' + d.max.toFixed(0) + ' |',
  ].join('\\n');

  return {
    'stdout': textSummary(data, { indent: '  ', enableColors: true }),
    'hasil/ringkasan.json': JSON.stringify(data, null, 2),
    'hasil/laporan.md': baris,
  };
}` }
        ],
        steps: [
            { note: 'Nyalakan Prometheus + Grafana', cmd: 'mkdir -p hasil\ndocker compose up -d\ndocker compose ps' },
            { note: 'Jalankan k6 dan kirim metrik ke Prometheus', cmd: 'export K6_PROMETHEUS_RW_SERVER_URL=http://localhost:9090/api/v1/write\nexport K6_PROMETHEUS_RW_TREND_STATS="p(95),p(99),avg,max"\nk6 run --out experimental-prometheus-rw -e TEST_ID=demo-01 laporan.js' },
            { note: 'Buka Grafana di http://localhost:3000, tambahkan data source Prometheus (http://prometheus:9090), lalu impor dashboard k6 dari Grafana.com (ID 19665)', cmd: 'echo "Buka http://localhost:3000  (user: admin / pass: admin)"' },
            { note: 'Periksa laporan yang dihasilkan handleSummary', cmd: 'cat hasil/laporan.md' },
            { note: 'Bersihkan setelah selesai', cmd: 'docker compose down -v' }
        ],
        snippets: ['docker compose up -d', 'k6 run --out json=hasil.json laporan.js', 'k6 run --summary-export=ringkasan.json laporan.js', 'docker compose down -v']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'Jangan pakai `--out json` untuk tes panjang berskala besar',
            body: `<p>Output JSON menulis <strong>setiap titik data</strong>. Tes 1 jam dengan 500 rps bisa menghasilkan berkas puluhan gigabyte dan memenuhi disk mesin generator di tengah tes — tesnya gagal, datanya hilang.</p>
<p>Gunakan <code>--summary-export</code> (hanya agregat, ukuran kecil) untuk artefak CI, dan <code>experimental-prometheus-rw</code> untuk data time-series. Simpan <code>--out json</code> hanya untuk sesi debugging singkat.</p>`
        },
        {
            kind: 'salah', title: 'Remote write ditolak dengan 404',
            body: `<p>Prometheus <strong>tidak mengaktifkan</strong> penerima remote write secara default. Jalankan dengan <code>--web.enable-remote-write-receiver</code>. Bila tetap gagal, periksa juga:</p>
<ul>
<li>URL harus lengkap sampai <code>/api/v1/write</code>, bukan hanya host:port.</li>
<li>Dari dalam container k6, <code>localhost</code> bukan host Anda — pakai nama service Docker atau <code>host.docker.internal</code>.</li>
</ul>`
        },
        {
            kind: 'best', title: 'Selalu sertakan tag `testid` dan `build`',
            body: `<p>Tanpa penanda, semua hasil tes bercampur menjadi satu deret waktu dan Anda tidak bisa membandingkan build A dengan build B. Dengan tag ini Anda bisa membuat panel Grafana "p95 per build" yang langsung memperlihatkan regresi performa begitu muncul.</p>
<p>Isi otomatis dari CI: <code>--tag build=\${GITHUB_RUN_NUMBER} --tag commit=\${GITHUB_SHA}</code>.</p>`
        },
        {
            kind: 'kasus', title: 'Menyimpan baseline untuk deteksi regresi otomatis',
            body: `<p>Alur yang dipakai tim matang:</p>
<ol>
<li>Setiap merge ke <code>main</code> menjalankan load test dan menyimpan <code>ringkasan.json</code> sebagai artefak.</li>
<li>Artefak dari rilis stabil terakhir dipromosikan menjadi <code>baseline.json</code>.</li>
<li>Setiap Pull Request menjalankan tes yang sama, lalu skrip pembanding menggagalkan PR bila p95 memburuk &gt; 10%.</li>
</ol>
<p>Dengan cara ini regresi performa tertangkap di PR, bukan setelah rilis ke produksi.</p>`
        }
    ],
    quiz: [
        {
            q: 'Anda menjalankan soak test 4 jam dengan 300 rps di pipeline CI. Format output mana yang paling tepat untuk artefak?',
            opts: [
                '<code>--out json=hasil.json</code>',
                '<code>--summary-export=ringkasan.json</code>',
                '<code>--http-debug=full</code>',
                'Tidak perlu output apa pun'
            ],
            a: 1,
            exp: '<code>--summary-export</code> hanya menulis agregat akhir sehingga ukurannya beberapa kilobyte — ideal sebagai artefak CI dan sebagai baseline perbandingan. <code>--out json</code> pada tes sebesar itu bisa menghasilkan puluhan GB dan memenuhi disk runner.'
        },
        {
            q: 'Perintah <code>k6 run --out experimental-prometheus-rw</code> gagal dengan 404. Apa langkah pertama yang harus diperiksa?',
            opts: [
                'Menaikkan jumlah VU',
                'Memastikan Prometheus dijalankan dengan <code>--web.enable-remote-write-receiver</code>',
                'Mengganti thresholds',
                'Memasang ulang k6'
            ],
            a: 1,
            exp: 'Endpoint <code>/api/v1/write</code> tidak aktif pada konfigurasi default Prometheus. Flag <code>--web.enable-remote-write-receiver</code> wajib ditambahkan. Periksa juga apakah URL sudah lengkap dan apakah k6 di dalam container bisa menjangkau host Prometheus.'
        },
        {
            q: 'Apa fungsi utama <code>handleSummary(data)</code>?',
            opts: [
                'Menghentikan tes lebih awal bila threshold gagal',
                'Mengubah bentuk laporan akhir dan menuliskannya ke berkas apa pun yang Anda mau',
                'Mengirim metrik ke Prometheus secara realtime',
                'Menjalankan pembersihan data uji'
            ],
            a: 1,
            exp: '<code>handleSummary()</code> dipanggil sekali di akhir tes dengan seluruh data agregat. Objek yang Anda kembalikan menentukan berkas apa saja yang ditulis — JSON, Markdown, HTML, atau <code>stdout</code>. Pembersihan data adalah tugas <code>teardown()</code>.'
        }
    ]
},

/* --------------------------------------------------------------- 13 ----- */
{
    id: 13,
    cat: '4 · Produksi & CI/CD',
    title: 'k6 di CI/CD: Quality Gate Otomatis',
    level: 'Lanjut', dur: '16 mnt',
    tags: ['ci', 'cd', 'github actions', 'gitlab', 'jenkins', 'pipeline', 'gate'],
    desc: 'Memasang k6 di pipeline sebagai gerbang mutu, memilih tes mana yang jalan kapan, dan mencegah pipeline jadi lambat atau flaky.',
    theory: `
<h2>Strategi: Tes Mana Jalan Kapan</h2>
<p>Kesalahan umum adalah menjalankan load test 30 menit di setiap commit. Pipeline jadi lambat, developer frustrasi, dan akhirnya tesnya dimatikan. Bagi berdasarkan tujuan:</p>

<table>
<thead><tr><th>Kapan</th><th>Jenis tes</th><th>Durasi</th><th>Tujuan</th></tr></thead>
<tbody>
<tr><td>Setiap commit / PR</td><td>Smoke test</td><td>&lt; 1 menit</td><td>Skrip masih valid, tak ada error dasar</td></tr>
<tr><td>Merge ke <code>main</code></td><td>Load test ringan</td><td>5–10 menit</td><td>Deteksi regresi performa</td></tr>
<tr><td>Nightly (terjadwal)</td><td>Load + stress penuh</td><td>30–60 menit</td><td>Validasi kapasitas menyeluruh</td></tr>
<tr><td>Sebelum rilis besar</td><td>Soak + spike</td><td>2–8 jam</td><td>Kesiapan produksi</td></tr>
<tr><td>Manual / on-demand</td><td>Breakpoint</td><td>Sampai jebol</td><td>Perencanaan kapasitas</td></tr>
</tbody>
</table>

<h3>GitHub Actions</h3>
<pre data-lang="yaml" data-file=".github/workflows/performa.yml">name: Uji Performa

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  schedule:
    - cron: '0 18 * * *'      # 01:00 WIB setiap hari
  workflow_dispatch:           # tombol jalankan manual
    inputs:
      profil:
        description: 'Profil beban'
        type: choice
        options: [smoke, load, stress, spike]
        default: smoke

jobs:
  smoke:
    # Cepat: jalan di setiap PR
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Pasang k6
        uses: grafana/setup-k6-action@v1
        with:
          k6-version: '1.0.0'      # sematkan versi agar hasil sebanding

      - name: Jalankan smoke test
        uses: grafana/run-k6-action@v1
        with:
          path: ./perf-tests/scenarios/smoke.js
          flags: --vus 2 --duration 30s --summary-export=ringkasan.json
        env:
          BASE_URL: \${{ secrets.STAGING_URL }}
          TEST_PASSWORD: \${{ secrets.TEST_PASSWORD }}

      - name: Unggah hasil
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: hasil-smoke
          path: ringkasan.json

  load:
    # Lebih berat: hanya di main dan jadwal malam
    if: github.event_name != 'pull_request'
    runs-on: ubuntu-latest
    timeout-minutes: 45
    steps:
      - uses: actions/checkout@v5
      - uses: grafana/setup-k6-action@v1

      - name: Jalankan load test
        run: |
          k6 run \\
            --tag build=\${{ github.run_number }} \\
            --tag commit=\${{ github.sha }} \\
            --summary-export=hasil.json \\
            ./perf-tests/scenarios/load.js
        env:
          BASE_URL: \${{ secrets.STAGING_URL }}

      - name: Bandingkan dengan baseline
        run: node ./perf-tests/bandingkan.js baseline.json hasil.json

      - name: Beri komentar di PR bila ada regresi
        if: failure()
        run: echo "Performa memburuk — lihat artefak untuk detail"</pre>

<h3>GitLab CI</h3>
<pre data-lang="yaml" data-file=".gitlab-ci.yml">stages: [test, performa]

smoke-performa:
  stage: performa
  image:
    name: grafana/k6:1.0.0
    entrypoint: [""]
  variables:
    BASE_URL: $STAGING_URL
  script:
    - k6 run --vus 2 --duration 30s
             --summary-export=ringkasan.json
             perf-tests/scenarios/smoke.js
  artifacts:
    when: always
    paths: [ringkasan.json]
    expire_in: 30 days
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"</pre>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Jangan menghasilkan beban besar dari runner CI bersama</div>
    <p>GitHub-hosted runner (2 vCPU, 7 GB RAM) hanya sanggup beberapa ratus VU sebelum <em>runner itu sendiri</em> menjadi bottleneck. Hasilnya akan berfluktuasi liar antar-eksekusi karena Anda berbagi mesin dengan pengguna lain.</p>
    <p><strong>Aturannya:</strong> runner CI untuk <em>smoke test</em> saja. Load test sungguhan harus dijalankan dari mesin khusus (self-hosted runner, VM cloud) atau layanan terdistribusi.</p>
</div>

<h3>Menjaga Pipeline Tidak <em>Flaky</em></h3>
<ul>
    <li><strong>Sematkan versi k6.</strong> <code>grafana/k6:1.0.0</code>, bukan <code>:latest</code>.</li>
    <li><strong>Gunakan lingkungan yang stabil.</strong> Staging yang dipakai bersamaan dengan tim QA manual akan memberi hasil acak.</li>
    <li><strong>Beri toleransi pada threshold CI.</strong> p95 di CI boleh lebih longgar daripada SLO produksi, karena infrastruktur staging biasanya lebih kecil.</li>
    <li><strong>Jalankan warm-up.</strong> Beberapa detik pertama selalu lebih lambat (cold start, cache dingin). Gunakan ramp-up, bukan beban mendadak.</li>
    <li><strong>Batasi waktu.</strong> <code>timeout-minutes</code> agar job yang tergantung tidak menyandera pipeline berjam-jam.</li>
</ul>
`,
    lab: {
        intro: `
<h3>Praktik: Quality Gate Lengkap</h3>
<p>Berkas di bawah membentuk gerbang mutu utuh: smoke test di setiap PR, load test di <code>main</code>, dan pembandingan otomatis terhadap baseline yang menggagalkan PR bila performa memburuk.</p>`,
        files: [
            {
                name: 'perf-tests/bandingkan.js', lang: 'javascript', code: `#!/usr/bin/env node
/**
 * Membandingkan hasil load test terhadap baseline.
 * Pakai: node bandingkan.js baseline.json hasil.json
 * Keluar dengan kode 1 bila terjadi regresi -> pipeline gagal.
 */
const fs = require('fs');

const AMBANG = {
  'p(95)': 10,   // toleransi memburuk maksimal 10%
  'p(99)': 15,
  'avg':   10,
};

function baca(p) {
  if (!fs.existsSync(p)) {
    console.error('Berkas tidak ditemukan: ' + p);
    process.exit(2);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

const dasar = baca(process.argv[2]);
const baru  = baca(process.argv[3]);

const md = baru.metrics.http_req_duration.values;
const mb = dasar.metrics.http_req_duration.values;

let adaRegresi = false;
const baris = [];

for (const stat of Object.keys(AMBANG)) {
  const lama = mb[stat];
  const kini = md[stat];
  if (lama === undefined || kini === undefined) continue;

  const delta = ((kini - lama) / lama) * 100;
  const buruk = delta > AMBANG[stat];
  if (buruk) adaRegresi = true;

  baris.push(
    (buruk ? 'REGRESI ' : 'OK      ') +
    stat.padEnd(7) +
    ' baseline=' + lama.toFixed(0).padStart(6) + 'ms' +
    ' sekarang=' + kini.toFixed(0).padStart(6) + 'ms' +
    ' (' + (delta >= 0 ? '+' : '') + delta.toFixed(1) + '%)'
  );
}

// Error rate juga dibandingkan
const errLama = dasar.metrics.http_req_failed.values.rate * 100;
const errKini = baru.metrics.http_req_failed.values.rate * 100;
if (errKini > errLama + 1) {
  adaRegresi = true;
  baris.push('REGRESI error rate ' + errLama.toFixed(2) + '% -> ' + errKini.toFixed(2) + '%');
}

console.log(baris.join('\\n'));

if (adaRegresi) {
  console.error('\\nPerforma memburuk melebihi ambang yang diizinkan.');
  process.exit(1);
}
console.log('\\nTidak ada regresi performa.');`
            },
            {
                name: 'perf-tests/scenarios/smoke.js', lang: 'javascript', code: `import http from 'k6/http';
import { check } from 'k6';

const BASE = __ENV.BASE_URL;
if (!BASE) throw new Error('BASE_URL wajib diisi');

export const options = {
  vus: 2,
  duration: '30s',
  thresholds: {
    // Smoke test: yang penting TIDAK ADA error sama sekali.
    // Latency dilonggarkan karena runner CI tidak stabil.
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<3000'],
    checks: ['rate>0.99'],
  },
};

export default function () {
  const res = http.get(BASE + '/health', { tags: { name: 'Health' } });
  check(res, {
    'health 200': (r) => r.status === 200,
    'status ok':  (r) => r.json('status') === 'ok',
  });
}` }
        ],
        steps: [
            { note: 'Uji skrip pembanding secara lokal', cmd: 'k6 run --summary-export=baseline.json perf-tests/scenarios/smoke.js\nk6 run --summary-export=hasil.json perf-tests/scenarios/smoke.js\nnode perf-tests/bandingkan.js baseline.json hasil.json', out: 'OK      p(95)   baseline=  412ms sekarang=  398ms (-3.4%)\nOK      avg     baseline=  201ms sekarang=  196ms (-2.5%)\n\nTidak ada regresi performa.' },
            { note: 'Periksa exit code — inilah yang membuat pipeline merah', cmd: 'node perf-tests/bandingkan.js baseline.json hasil.json; echo "exit=$?"' }
        ],
        snippets: ['k6 run --summary-export=hasil.json perf-tests/scenarios/smoke.js']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'Jangan jalankan load test berat di runner CI bersama',
            body: `<p>Runner GitHub/GitLab yang di-host penyedia biasanya hanya 2 vCPU dan 7 GB RAM, serta berbagi kapasitas dengan pengguna lain. Menjalankan 500 VU di sana berarti <strong>Anda mengukur runner CI, bukan aplikasi Anda</strong>, dan hasilnya berbeda-beda setiap kali dijalankan.</p>
<p>Batasi runner CI untuk smoke test (1–5 VU). Load test sungguhan dijalankan dari self-hosted runner, VM khusus, atau layanan terdistribusi.</p>`
        },
        {
            kind: 'salah', title: 'Threshold CI disamakan dengan SLO produksi',
            body: `<p>Staging biasanya memakai instance lebih kecil, database tanpa replika, dan tanpa CDN. Menetapkan <code>p(95)&lt;200</code> yang sama dengan produksi akan membuat pipeline merah terus-menerus, dan pada akhirnya tim akan mengabaikan atau mematikan tesnya.</p>
<p>Tetapkan threshold CI berdasarkan <strong>baseline staging itu sendiri</strong>, dan fokuskan pada <em>perubahan relatif</em> (regresi &gt; 10%) alih-alih angka absolut.</p>`
        },
        {
            kind: 'salah', title: 'Kredensial ter-print di log CI',
            body: `<p><code>console.log(token)</code> atau <code>--http-debug=full</code> akan membocorkan kredensial ke log pipeline yang mungkin bisa dibaca seluruh organisasi dan tersimpan berbulan-bulan.</p>
<p>Selalu pakai mekanisme secret bawaan CI (<code>secrets.*</code> di GitHub, <em>masked variables</em> di GitLab), dan jangan pernah mengaktifkan <code>--http-debug</code> di pipeline.</p>`
        },
        {
            kind: 'best', title: 'Selalu unggah artefak dengan `if: always()`',
            body: `<p>Ketika tes gagal, itulah saat Anda paling butuh datanya. Tanpa <code>if: always()</code>, langkah unggah artefak dilewati saat job gagal dan Anda kehilangan justru informasi yang paling penting untuk investigasi.</p>`
        }
    ],
    quiz: [
        {
            q: 'Manakah pembagian tes ke pipeline yang paling sehat?',
            opts: [
                'Load test 30 menit di setiap commit agar selalu terpantau',
                'Smoke test cepat di setiap PR, load test di merge ke main, soak test nightly',
                'Hanya jalankan tes secara manual sebelum rilis',
                'Semua jenis tes dijalankan bersamaan setiap malam'
            ],
            a: 1,
            exp: 'Umpan balik cepat di PR (smoke &lt; 1 menit) menjaga developer tetap produktif, sementara tes berat dijalankan di titik yang lebih jarang. Load test 30 menit per commit akan membuat pipeline macet dan berujung pada tes yang dimatikan orang.'
        },
        {
            q: 'Exit code berapa yang dikembalikan k6 ketika threshold dilanggar, sehingga pipeline CI ikut gagal?',
            opts: ['0', '1', '99', '255'],
            a: 2,
            exp: 'k6 keluar dengan kode <strong>99</strong> bila ada threshold yang gagal, dan <strong>104</strong> bila tes dibatalkan oleh <code>abortOnFail</code>. Kode non-zero inilah yang otomatis membuat job CI berstatus gagal — tanpa perlu skrip tambahan apa pun.'
        },
        {
            q: 'Kenapa versi k6 sebaiknya disematkan (pinned) di pipeline?',
            opts: [
                'Agar instalasi lebih cepat',
                'Agar hasil antar-eksekusi tetap sebanding dan regresi bisa dideteksi dengan benar',
                'Karena versi terbaru selalu bermasalah',
                'Agar tidak perlu koneksi internet'
            ],
            a: 1,
            exp: 'Perubahan versi bisa mengubah cara metrik dihitung atau format outputnya. Bila versi berubah diam-diam, perbandingan dengan baseline lama menjadi tidak sah dan Anda bisa salah menyimpulkan ada/tidaknya regresi.'
        }
    ]
},

/* --------------------------------------------------------------- 14 ----- */
{
    id: 14,
    cat: '4 · Produksi & CI/CD',
    title: 'Distributed Testing: Kubernetes & k6-operator',
    level: 'Lanjut', dur: '14 mnt',
    tags: ['distributed', 'kubernetes', 'k6-operator', 'skala', 'cloud'],
    desc: 'Kapan satu mesin tidak lagi cukup, cara menyebar beban ke banyak node, dan jebakan yang muncul saat tes menjadi terdistribusi.',
    theory: `
<h2>Kapan Anda Butuh Distributed Testing</h2>
<p>Satu mesin modern (8 vCPU, 16 GB) umumnya sanggup 3.000–10.000 VU HTTP sederhana. Anda perlu menyebar beban bila:</p>
<ul>
    <li>CPU generator konsisten &gt; 75% saat tes berjalan.</li>
    <li>Muncul <code>dropped_iterations</code> yang tidak hilang meski <code>preAllocatedVUs</code> dinaikkan.</li>
    <li>Bandwidth NIC mesin generator sudah jenuh.</li>
    <li>Anda perlu menghasilkan beban dari <strong>beberapa region geografis</strong> sekaligus.</li>
</ul>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ Periksa dulu sebelum menambah mesin</div>
    <p>Sebagian besar kasus "butuh distributed" sebenarnya adalah skrip yang boros. Coba dulu: aktifkan <code>discardResponseBodies</code>, hapus <code>console.log</code> per-iterasi, ganti array biasa dengan <code>SharedArray</code>, dan kurangi kompleksitas parsing JSON. Sering kali kapasitas naik 3–5× tanpa mesin tambahan.</p>
</div>

<h3>k6-operator di Kubernetes</h3>
<pre data-lang="bash" data-file="terminal"># Pasang operator
kubectl apply -f https://github.com/grafana/k6-operator/releases/latest/download/bundle.yaml

# Simpan skrip sebagai ConfigMap
kubectl create configmap skrip-uji --from-file=load.js

# Jalankan TestRun
kubectl apply -f testrun.yaml
kubectl get testrun
kubectl logs -l k6_cr=uji-checkout -f</pre>

<pre data-lang="yaml" data-file="testrun.yaml">apiVersion: k6.io/v1alpha1
kind: TestRun
metadata:
  name: uji-checkout
spec:
  # Beban dipecah ke 8 pod. Bila skrip meminta 800 VU,
  # tiap pod menjalankan 100 VU.
  parallelism: 8

  script:
    configMap:
      name: skrip-uji
      file: load.js

  arguments: --out experimental-prometheus-rw --tag testid=checkout-421

  runner:
    image: grafana/k6:1.0.0
    resources:
      requests: { cpu: "1",  memory: "1Gi" }
      limits:   { cpu: "2",  memory: "2Gi" }
    env:
      - name: BASE_URL
        value: https://staging.contoh.id
      - name: TEST_PASSWORD
        valueFrom:
          secretKeyRef: { name: rahasia-uji, key: password }</pre>

<h3>Bagaimana Beban Dipecah</h3>
<p>k6-operator membagi beban dengan <strong>execution segment</strong>. Dengan <code>parallelism: 4</code> dan skrip <code>vus: 400</code>, tiap pod menjalankan segmen <code>0–25%</code>, <code>25–50%</code>, dan seterusnya — masing-masing 100 VU.</p>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Threshold pada tes terdistribusi bisa menyesatkan</div>
    <p>Setiap pod menghitung threshold-nya <strong>sendiri</strong> berdasarkan porsi bebannya saja. Threshold seperti <code>http_reqs: ['count&gt;10000']</code> akan gagal di setiap pod padahal totalnya terpenuhi.</p>
    <p><strong>Yang benar:</strong> pakai threshold berbasis <em>rate</em> dan <em>persentil</em> (yang tetap bermakna per-segmen), lalu lakukan evaluasi total di sisi Prometheus/Grafana setelah semua data terkumpul.</p>
</div>

<h3>Hal yang Berubah Saat Tes Menjadi Terdistribusi</h3>
<table>
<thead><tr><th>Aspek</th><th>Satu mesin</th><th>Terdistribusi</th></tr></thead>
<tbody>
<tr><td>Data uji</td><td>Satu <code>SharedArray</code></td><td>Tiap pod punya salinan — risiko akun bertabrakan</td></tr>
<tr><td><code>setup()</code></td><td>Jalan 1×</td><td>Dikoordinasi operator, tapi pastikan idempoten</td></tr>
<tr><td>Threshold</td><td>Global</td><td>Per-segmen — perlu agregasi eksternal</td></tr>
<tr><td>Ringkasan</td><td>Satu output</td><td>Terpecah per pod — gabungkan lewat Prometheus</td></tr>
<tr><td>IP sumber</td><td>Satu</td><td>Banyak — bagus untuk menghindari rate limit per-IP</td></tr>
</tbody>
</table>

<h3>Alternatif: Grafana Cloud k6</h3>
<p>Bila Anda tidak ingin mengelola infrastruktur generator sendiri, <code>k6 cloud run skrip.js</code> menjalankan tes dari infrastruktur Grafana di berbagai region dunia, lengkap dengan dashboard analisis. Berbayar, tetapi menghilangkan seluruh beban operasional dan memberi perspektif latensi geografis yang sulit ditiru sendiri.</p>
`,
    lab: {
        intro: `
<h3>Praktik: Menyiapkan Skrip agar Aman Dijalankan Terdistribusi</h3>
<p>Kunci utamanya adalah membuat pembagian data uji <strong>sadar-segmen</strong>, sehingga pod A dan pod B tidak memakai akun yang sama.</p>`,
        files: [{
            name: 'siap-distributed.js', lang: 'javascript', code: `import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import exec from 'k6/execution';

const BASE = __ENV.BASE_URL;
if (!BASE) throw new Error('BASE_URL wajib diisi');

// Identitas pod diberikan lewat env oleh k6-operator / skrip pembungkus.
// INSTANCE_ID mulai dari 0.
const INSTANCE     = parseInt(__ENV.INSTANCE_ID || '0', 10);
const TOTAL_INSTANCE = parseInt(__ENV.TOTAL_INSTANCES || '1', 10);

const semuaUser = new SharedArray('users', function () {
  const daftar = [];
  for (let i = 1; i <= 5000; i++) {
    daftar.push({ username: 'perf' + String(i).padStart(5, '0') });
  }
  return daftar;
});

// Tiap pod hanya mengambil potongan datanya sendiri -> tidak ada tabrakan akun
const bagianSaya = new SharedArray('bagian-saya', function () {
  const ukuran = Math.ceil(semuaUser.length / TOTAL_INSTANCE);
  const mulai  = INSTANCE * ukuran;
  return semuaUser.slice(mulai, mulai + ukuran);
});

export const options = {
  scenarios: {
    beban: {
      executor: 'constant-arrival-rate',
      // Laju dibagi rata antar pod agar total tetap sesuai target
      rate: Math.ceil(parseInt(__ENV.TOTAL_RPS || '100', 10) / TOTAL_INSTANCE),
      timeUnit: '1s',
      duration: __ENV.DURASI || '5m',
      preAllocatedVUs: 50,
      maxVUs: 200,
    },
  },
  thresholds: {
    // Aman untuk tes terdistribusi: berbasis rate & persentil,
    // BUKAN count absolut yang akan salah dievaluasi per-pod.
    http_req_duration: ['p(95)<1000'],
    http_req_failed:   ['rate<0.02'],
    dropped_iterations: ['count<50'],
  },
  tags: {
    instance: String(INSTANCE),
    testid: __ENV.TEST_ID || 'lokal',
  },
};

export function setup() {
  // Harus IDEMPOTEN: pada beberapa konfigurasi bisa dipanggil lebih dari sekali
  console.log('Pod ' + INSTANCE + '/' + TOTAL_INSTANCE +
              ' memegang ' + bagianSaya.length + ' akun uji');
  return { mulai: Date.now() };
}

export default function () {
  const u = bagianSaya[exec.scenario.iterationInTest % bagianSaya.length];

  const res = http.get(BASE + '/api/produk', {
    tags: { name: 'ListProduk' },
    headers: { 'X-Test-User': u.username },
    timeout: '10s',
  });

  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}` }],
        steps: [
            { note: 'Simulasikan 4 pod di satu mesin (untuk memverifikasi logika pembagian)', cmd: 'for i in 0 1 2 3; do\n  INSTANCE_ID=$i TOTAL_INSTANCES=4 TOTAL_RPS=200 BASE_URL=https://staging.contoh.id \\\n    k6 run --duration 30s siap-distributed.js &\ndone\nwait' },
            { note: 'Di Kubernetes: buat ConfigMap lalu jalankan TestRun', cmd: 'kubectl create configmap skrip-uji --from-file=siap-distributed.js\nkubectl apply -f testrun.yaml\nkubectl get testrun -w' },
            { note: 'Pantau log seluruh pod', cmd: 'kubectl logs -l k6_cr=uji-checkout -f --max-log-requests=10' }
        ],
        snippets: ['kubectl get testrun', 'kubectl logs -l k6_cr=uji-checkout -f']
    },
    pitfalls: [
        {
            kind: 'salah', title: 'Threshold berbasis `count` gagal di semua pod',
            body: `<p><code>http_reqs: ['count&gt;10000']</code> dievaluasi <strong>per pod</strong>. Dengan 10 pod, masing-masing hanya mencatat 1.000 request sehingga semuanya gagal — padahal total 10.000 sudah terpenuhi.</p>
<p>Gunakan threshold berbasis <code>rate</code> dan persentil (<code>p(95)</code>) yang tetap bermakna pada porsi beban mana pun, lalu lakukan evaluasi total di Grafana setelah data seluruh pod terkumpul.</p>`
        },
        {
            kind: 'larangan', title: 'Jangan asumsikan `setup()` hanya jalan sekali',
            body: `<p>Pada beberapa konfigurasi distributed, <code>setup()</code> bisa dieksekusi oleh lebih dari satu instance. Bila <code>setup()</code> Anda membuat data (misalnya mendaftarkan akun), Anda akan mendapat error duplikat atau data ganda.</p>
<p>Buat <code>setup()</code> <strong>idempoten</strong>: gunakan operasi <em>upsert</em>, atau lakukan seeding data lewat job terpisah sebelum tes dimulai — bukan di dalam skrip k6.</p>`
        },
        {
            kind: 'salah', title: 'Semua pod memakai potongan data yang sama',
            body: `<p>Tanpa logika pembagian sadar-segmen, setiap pod akan membaca dari awal <code>SharedArray</code>-nya masing-masing. Akun yang sama dipakai bersamaan oleh 10 pod → rate limit, deadlock database, dan keranjang belanja saling menimpa.</p>
<p>Berikan <code>INSTANCE_ID</code> dan <code>TOTAL_INSTANCES</code> lewat variabel lingkungan, lalu potong data dengan <code>slice()</code> seperti pada contoh lab.</p>`
        },
        {
            kind: 'best', title: 'Optimalkan skrip sebelum menambah mesin',
            body: `<p>Menambah pod menaikkan biaya dan kompleksitas. Sebelum itu, coba dulu:</p>
<ul>
<li><code>discardResponseBodies: true</code> — sering memangkas memori 50%+.</li>
<li>Hapus <code>console.log</code> yang berjalan tiap iterasi.</li>
<li>Ganti array biasa dengan <code>SharedArray</code>.</li>
<li>Hindari <code>JSON.parse()</code> pada respons besar bila tidak perlu.</li>
<li>Kurangi jumlah tag dan hindari tag berkardinalitas tinggi.</li>
</ul>
<p>Tidak jarang kapasitas satu mesin naik 3–5× hanya dari langkah-langkah ini.</p>`
        }
    ],
    quiz: [
        {
            q: 'Pada tes terdistribusi dengan 10 pod, threshold mana yang tetap bermakna tanpa agregasi eksternal?',
            opts: [
                '<code>http_reqs: ["count>50000"]</code>',
                '<code>http_req_duration: ["p(95)<800"]</code>',
                '<code>iterations: ["count>10000"]</code>',
                '<code>data_received: ["count>1000000"]</code>'
            ],
            a: 1,
            exp: 'Threshold berbasis persentil dan rate tetap valid untuk porsi beban apa pun. Threshold berbasis <code>count</code> absolut dievaluasi per-pod, sehingga masing-masing hanya melihat sepersepuluh dari total dan akan gagal secara keliru.'
        },
        {
            q: 'CPU generator 95% dan muncul banyak <code>dropped_iterations</code>. Langkah pertama yang paling hemat biaya?',
            opts: [
                'Langsung tambah 10 pod di Kubernetes',
                'Optimalkan skrip: <code>discardResponseBodies</code>, hapus console.log, pakai SharedArray',
                'Naikkan threshold agar tesnya lulus',
                'Kurangi durasi tes'
            ],
            a: 1,
            exp: 'Sebagian besar kasus generator kewalahan berasal dari skrip yang boros, bukan dari kebutuhan kapasitas yang sesungguhnya. Optimasi skrip sering menaikkan kapasitas 3–5× tanpa biaya tambahan. Menaikkan threshold agar "lulus" jelas menghilangkan seluruh manfaat pengujian.'
        }
    ]
},

/* --------------------------------------------------------------- 15 ----- */
{
    id: 15,
    cat: '4 · Produksi & CI/CD',
    title: 'Analisis Hasil & Menemukan Bottleneck Sebenarnya',
    level: 'Lanjut', dur: '20 mnt',
    tags: ['analisis', 'bottleneck', 'troubleshooting', 'database', 'laporan'],
    desc: 'Metodologi membaca hasil, mengkorelasikan dengan metrik server, penyebab bottleneck yang paling sering, dan cara menulis laporan yang dibaca orang.',
    theory: `
<h2>Urutan Analisis yang Benar</h2>
<p>Jangan langsung menuduh database. Ikuti urutan ini agar tidak membuang waktu:</p>
<ol>
    <li><strong>Validasi tesnya dulu.</strong> Apakah <code>dropped_iterations</code> = 0? Apakah CPU generator &lt; 75%? Bila tidak, hasilnya belum layak dianalisis.</li>
    <li><strong>Lihat error rate.</strong> Bila &gt; 5%, cari tahu <em>jenis</em> errornya sebelum melihat latency — latency dari sistem yang sedang error tidak bermakna.</li>
    <li><strong>Dekomposisi latency.</strong> <code>blocked</code> / <code>connecting</code> / <code>waiting</code> / <code>receiving</code> — bagian mana yang dominan?</li>
    <li><strong>Cari titik belok.</strong> Pada VU/RPS berapa latency mulai naik tajam? Itulah kapasitas efektif Anda.</li>
    <li><strong>Korelasikan dengan sisi server.</strong> Apa yang terjadi di CPU, memori, koneksi DB, dan GC pada detik yang sama?</li>
</ol>

<h3>Membaca Bentuk Grafik</h3>
<table>
<thead><tr><th>Pola</th><th>Kemungkinan penyebab</th><th>Langkah verifikasi</th></tr></thead>
<tbody>
<tr><td>Latency naik <strong>linear</strong> mengikuti VU</td><td>Sumber daya jenuh bertahap (CPU/koneksi)</td><td>Cek CPU &amp; pool koneksi DB di server</td></tr>
<tr><td>Latency <strong>datar</strong> lalu <strong>meledak</strong></td><td>Ada antrean yang penuh (thread pool, connection pool)</td><td>Cek ukuran pool &amp; panjang antrean</td></tr>
<tr><td><strong>Gigi gergaji</strong> (naik-turun berkala)</td><td>Garbage collection, cache expiry, atau cron job</td><td>Cek log GC &amp; jadwal cron</td></tr>
<tr><td>Naik <strong>perlahan sepanjang tes</strong> tak pernah turun</td><td>Kebocoran: memori, koneksi, atau file descriptor</td><td>Soak test + pantau RSS/koneksi</td></tr>
<tr><td><strong>Spike di awal</strong> lalu normal</td><td>Cold start: JIT, cache dingin, pool belum terisi</td><td>Normal — beri fase warm-up</td></tr>
<tr><td>Error muncul <strong>tepat di angka bulat</strong> (100 rps)</td><td>Rate limiter / kuota</td><td>Cek konfigurasi WAF, API gateway, LB</td></tr>
</tbody>
</table>

<h3>Bottleneck yang Paling Sering Ditemukan</h3>
<table>
<thead><tr><th>Bottleneck</th><th>Gejala di k6</th><th>Perbaikan umum</th></tr></thead>
<tbody>
<tr><td><strong>N+1 query</strong></td><td><code>waiting</code> naik tajam seiring jumlah data</td><td>Eager loading / JOIN / batch query</td></tr>
<tr><td><strong>Connection pool DB habis</strong></td><td>Latency mendadak meledak di ambang tertentu</td><td>Naikkan pool, perpendek transaksi</td></tr>
<tr><td><strong>Tidak ada index</strong></td><td>Satu endpoint jauh lebih lambat dari lainnya</td><td><code>EXPLAIN ANALYZE</code> lalu tambah index</td></tr>
<tr><td><strong>Panggilan eksternal sinkron</strong></td><td><code>waiting</code> tinggi &amp; stabil, CPU server rendah</td><td>Jadikan asinkron, tambah timeout &amp; circuit breaker</td></tr>
<tr><td><strong>Thread/worker pool kecil</strong></td><td>Throughput mentok di angka tetap</td><td>Naikkan worker (gunicorn/pm2/uvicorn)</td></tr>
<tr><td><strong>Logging berlebihan</strong></td><td>CPU server tinggi, disk I/O jenuh</td><td>Turunkan level log, buat asinkron</td></tr>
<tr><td><strong>Rate limiter</strong></td><td>Banyak 429 pada laju tertentu</td><td>Allowlist IP generator saat pengujian</td></tr>
</tbody>
</table>

<div class="callout callout-danger">
    <div class="callout-title">⛔ Jangan simpulkan bottleneck hanya dari data k6</div>
    <p>k6 mengukur dari <strong>luar</strong> — ia hanya tahu request lambat, tetapi tidak tahu kenapa. Kesimpulan yang bisa dipercaya selalu lahir dari korelasi dua sisi:</p>
    <ul>
        <li><strong>Sisi klien (k6):</strong> latency, throughput, error rate.</li>
        <li><strong>Sisi server:</strong> CPU, memori, koneksi DB, slow query log, GC, panjang antrean.</li>
    </ul>
    <p>Samakan sumbu waktunya, lalu cari apa yang berubah di server tepat saat latency melonjak. Tanpa ini Anda hanya menebak.</p>
</div>

<h3>Menghitung Kapasitas Efektif</h3>
<p>Setelah stress test, tentukan tiga angka yang akan dipakai untuk perencanaan kapasitas:</p>
<ul>
    <li><strong>Titik jenuh</strong> — beban saat throughput berhenti naik meski VU ditambah.</li>
    <li><strong>Titik patah</strong> — beban saat error rate melewati ambang yang bisa diterima (misal 1%).</li>
    <li><strong>Kapasitas aman</strong> — biasanya <strong>60–70% dari titik jenuh</strong>, sebagai ruang untuk lonjakan tak terduga.</li>
</ul>

<h3>Kerangka Laporan yang Dibaca Orang</h3>
<pre data-lang="markdown" data-file="laporan.md"># Laporan Load Test — Checkout API — 27 Juli 2026

## Kesimpulan (untuk yang tidak sempat baca semuanya)
Sistem sanggup 420 checkout/menit dengan p95 = 680 ms.
Target kampanye 600/menit BELUM terpenuhi.
Penyebab utama: connection pool PostgreSQL mentok di 20.
Perkiraan perbaikan: naikkan pool ke 60 -> estimasi kapasitas 900/menit.

## Ringkasan Angka
| Metrik              | Hasil   | Target  | Status |
|---------------------|---------|---------|--------|
| Throughput puncak   | 420/mnt | 600/mnt | GAGAL  |
| p95 latency         | 680 ms  | 800 ms  | LULUS  |
| p99 latency         | 3.2 s   | 2 s     | GAGAL  |
| Error rate          | 2.1%    | < 1%    | GAGAL  |

## Bukti
- Latency datar sampai 350/mnt, lalu meledak (pola antrean penuh).
- Log PostgreSQL: "remaining connection slots are reserved" pada 14:32:10.
- CPU aplikasi hanya 45% saat p99 melonjak -> bukan CPU-bound.

## Rekomendasi (urut prioritas)
1. Naikkan max_connections PostgreSQL 20 -> 60 dan pasang PgBouncer.  (Dampak besar, effort kecil)
2. Tambah index pada pesanan(user_id, dibuat_pada).                    (Dampak sedang)
3. Jadikan pengiriman email konfirmasi asinkron lewat queue.           (Dampak sedang, effort besar)

## Batasan Pengujian
- Dijalankan di staging (4 vCPU) — produksi memakai 16 vCPU.
- CDN dinonaktifkan, sehingga beban ke origin lebih berat dari kondisi nyata.</pre>
`,
    lab: {
        intro: `
<h3>Praktik: Breakpoint Test untuk Menemukan Titik Patah</h3>
<p>Skrip ini menaikkan laju request terus-menerus sampai sistem menyerah, lalu berhenti otomatis. Jalankan hanya di lingkungan yang Anda kuasai penuh.</p>`,
        files: [{
            name: 'breakpoint.js', lang: 'javascript', code: `import http from 'k6/http';
import { check } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import exec from 'k6/execution';

const BASE = __ENV.BASE_URL;
if (!BASE) throw new Error('BASE_URL wajib diisi');

const latensi = new Trend('latensi_endpoint', true);
const gagal   = new Rate('gagal_endpoint');

export const options = {
  scenarios: {
    breakpoint: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 2000,
      stages: [
        { duration: '2m', target: 50 },
        { duration: '2m', target: 100 },
        { duration: '2m', target: 200 },
        { duration: '2m', target: 400 },
        { duration: '2m', target: 800 },
        { duration: '2m', target: 1600 },
      ],
    },
  },
  thresholds: {
    // Rem darurat: berhenti begitu sistem jelas sudah patah.
    // Tanpa ini, breakpoint test bisa merusak lingkungan staging.
    http_req_failed: [
      { threshold: 'rate<0.15', abortOnFail: true, delayAbortEval: '30s' },
    ],
    // Threshold ini SENGAJA dibuat gagal di akhir — itulah tujuannya:
    // menandai pada tahap mana sistem melewati batas.
    http_req_duration: ['p(95)<2000'],
    dropped_iterations: ['count<100'],
  },
};

export default function () {
  const mulai = Date.now();
  const res = http.get(BASE + '/api/produk', {
    tags: { name: 'Produk' },
    timeout: '15s',
  });

  latensi.add(Date.now() - mulai);

  const ok = check(res, {
    'status 200': (r) => r.status === 200,
  });
  gagal.add(!ok);

  // Catat titik belok agar mudah ditemukan di log
  if (!ok && exec.scenario.iterationInTest % 100 === 0) {
    console.warn('Gagal pada laju sekitar iterasi ke-' +
                 exec.scenario.iterationInTest + ', status ' + res.status);
  }
}

export function handleSummary(data) {
  const d = data.metrics.http_req_duration.values;
  const err = (data.metrics.http_req_failed.values.rate * 100).toFixed(2);
  const rps = data.metrics.http_reqs.values.rate.toFixed(1);
  const dropped = data.metrics.dropped_iterations
    ? data.metrics.dropped_iterations.values.count : 0;

  const laporan = [
    '=== HASIL BREAKPOINT TEST ===',
    'Throughput rata-rata : ' + rps + ' req/s',
    'p95 latency          : ' + d['p(95)'].toFixed(0) + ' ms',
    'p99 latency          : ' + (d['p(99)'] || 0).toFixed(0) + ' ms',
    'Error rate           : ' + err + '%',
    'Dropped iterations   : ' + dropped,
    '',
    dropped > 100
      ? 'PERINGATAN: generator kewalahan — hasil TIDAK VALID, tambah kapasitas generator.'
      : 'Generator sehat, angka di atas bisa dipercaya.',
  ].join('\\n');

  return {
    'stdout': laporan + '\\n',
    'hasil/breakpoint.json': JSON.stringify(data, null, 2),
  };
}` }],
        steps: [
            { note: 'Jalankan breakpoint test (hanya di lingkungan milik Anda!)', cmd: 'mkdir -p hasil\nk6 run -e BASE_URL=https://staging.contoh.id breakpoint.js' },
            { note: 'Pantau sisi server pada terminal terpisah — inilah setengah data yang hilang bila hanya melihat k6', cmd: 'watch -n 2 "docker stats --no-stream"' },
            { note: 'Bila memakai PostgreSQL, pantau koneksi aktif saat tes berjalan', cmd: 'watch -n 2 \'psql -c "SELECT count(*), state FROM pg_stat_activity GROUP BY state;"\'' }
        ],
        snippets: ['k6 run breakpoint.js', 'docker stats --no-stream']
    },
    pitfalls: [
        {
            kind: 'larangan', title: 'Jangan analisis hasil bila generator sendiri kewalahan',
            body: `<p>Bila <code>dropped_iterations</code> &gt; 0 atau CPU generator &gt; 80%, seluruh angka Anda tidak sah. Beban yang benar-benar sampai ke server lebih kecil dari yang tertulis, dan latency yang terukur mengandung waktu antre di sisi klien.</p>
<p>Perbaiki generator dulu — optimalkan skrip atau tambah mesin — baru tarik kesimpulan apa pun.</p>`
        },
        {
            kind: 'salah', title: 'Menyimpulkan penyebab hanya dari data k6',
            body: `<p>"Latency 3 detik, berarti database lambat" adalah tebakan, bukan analisis. Bisa jadi penyebabnya thread pool aplikasi, panggilan HTTP ke layanan lain, GC pause, disk penuh, atau rate limiter di gateway.</p>
<p>Selalu buka dashboard server pada rentang waktu yang sama. Kesimpulan yang bisa dipertanggungjawabkan butuh bukti dari kedua sisi.</p>`
        },
        {
            kind: 'salah', title: 'Melaporkan angka tanpa konteks lingkungan',
            body: `<p>"Sistem sanggup 500 rps" tidak ada artinya tanpa menyebut: spesifikasi mesin, versi aplikasi, ukuran dataset, apakah CDN aktif, dan berapa lama tes berjalan.</p>
<p>Tanpa konteks ini, laporan Anda tidak bisa direproduksi maupun dibandingkan bulan depan — dan itu menghapus seluruh nilainya.</p>`
        },
        {
            kind: 'best', title: 'Cari titik belok, bukan sekadar angka maksimum',
            body: `<p>Angka yang berguna untuk perencanaan kapasitas bukan "maksimum sebelum jebol", melainkan <strong>titik saat latency mulai naik tajam</strong> — di situlah antrean mulai terbentuk dan pengalaman pengguna mulai memburuk.</p>
<p>Tetapkan kapasitas aman di sekitar 60–70% dari titik tersebut agar ada ruang untuk lonjakan tak terduga.</p>`
        },
        {
            kind: 'kasus', title: 'Latency naik padahal CPU server hanya 40%',
            body: `<p>Ini pola yang sangat sering muncul dan hampir selalu berarti sistem <strong>tidak CPU-bound</strong>. Tersangka utamanya:</p>
<ul>
<li><strong>Connection pool habis</strong> — request antre menunggu koneksi DB tersedia.</li>
<li><strong>Panggilan eksternal sinkron</strong> — aplikasi menunggu API pihak ketiga; CPU menganggur tapi thread terkunci.</li>
<li><strong>Lock kontensi</strong> — transaksi panjang mengunci baris yang sama.</li>
<li><strong>Thread/worker pool terlalu kecil</strong> — throughput mentok di angka tetap.</li>
</ul>
<p>Verifikasi dengan melihat panjang antrean, jumlah koneksi aktif ke database, dan <em>slow query log</em>.</p>`
        }
    ],
    quiz: [
        {
            q: 'Grafik menunjukkan latency stabil 200 ms sampai 300 VU, lalu melompat ke 5 detik dalam beberapa detik saja. Apa pola ini paling menunjukkan?',
            opts: [
                'CPU server jenuh secara bertahap',
                'Sebuah antrean/pool penuh (connection pool, thread pool)',
                'Memory leak',
                'Cold start yang normal'
            ],
            a: 1,
            exp: 'Pola "datar lalu meledak" adalah tanda khas antrean yang penuh: selama masih ada slot, latency stabil; begitu penuh, request harus antre dan latency meledak nonlinier. Jenuh CPU biasanya memberi kenaikan yang lebih bertahap.'
        },
        {
            q: 'Latency melonjak tetapi CPU server hanya 40%. Mana yang PALING TIDAK mungkin menjadi penyebabnya?',
            opts: [
                'Connection pool database habis',
                'Panggilan sinkron ke API pihak ketiga yang lambat',
                'Aplikasi kekurangan daya komputasi CPU',
                'Kontensi lock pada tabel yang sering ditulis'
            ],
            a: 2,
            exp: 'CPU 40% berarti prosesor <strong>tidak</strong> menjadi batasan. Ketika latency tinggi sementara CPU santai, penyebabnya hampir selalu proses yang menunggu sesuatu: koneksi, lock, atau respons layanan lain.'
        },
        {
            q: 'Setelah stress test, berapa kapasitas aman yang sebaiknya dipakai untuk perencanaan?',
            opts: [
                '100% dari titik patah',
                '90% dari titik patah',
                '60–70% dari titik jenuh',
                '150% dari beban rata-rata harian'
            ],
            a: 2,
            exp: 'Menetapkan kapasitas terlalu dekat dengan titik patah tidak menyisakan ruang untuk lonjakan tak terduga, kegagalan sebagian node, atau pertumbuhan trafik. Praktik umum adalah 60–70% dari titik jenuh — angka saat throughput berhenti naik meski beban ditambah.'
        }
    ]
}

];

/* ==========================================================================
   GRAFANA k6 — MINI PROJECT, UJIAN AKHIR & SIMULATOR TERMINAL
   ========================================================================== */

const COURSE = {
    key: 'k6',
    pageTitle: 'Belajar k6 Load Testing Lengkap | Kelas Interaktif',
    subtitle: '15 bab · lab praktik · mini project real-case · ujian sertifikasi',
    prompt: '$',
    termTitle: 'bash — simulator k6',
    termWelcome: [
        'Simulator k6 siap. Perintah yang dikenali:',
        '  k6 version | k6 new <file> | k6 run [flag] <file> | k6 cloud run <file>',
        '  ls | cat <file> | ulimit -n | docker run ... grafana/k6 run <file> | help',
        'Output di bawah meniru bentuk keluaran k6 asli agar Anda terbiasa membacanya.',
        ''
    ],

    modules: [].concat(K6_MOD_A, K6_MOD_B, K6_MOD_C),

    /* ================== MINI PROJECT ================== */
    project: {
        title: 'Kesiapan Produksi API Flash Sale “TokoCepat”',
        subtitle: 'Studi kasus penuh: dari test plan sampai laporan rekomendasi yang bisa dipakai manajemen.',
        meta: ['⏱ 8–14 jam', '🎯 Level: Lanjut', '🧰 k6 + Docker + Prometheus + Grafana + GitHub Actions'],
        intro: `
<h2>Situasi</h2>
<p>Anda baru bergabung sebagai <strong>Performance Engineer</strong> di TokoCepat. Tiga minggu lagi ada kampanye <em>Flash Sale 12.12</em>. Tim marketing memperkirakan <strong>60.000 pengunjung dalam 10 menit pertama</strong>, dengan puncak <strong>600 checkout per menit</strong>.</p>
<p>Tahun lalu, kampanye serupa membuat sistem tumbang selama 22 menit dan kerugian transaksi ditaksir Rp 1,8 miliar. CTO meminta Anda menjawab satu pertanyaan dengan bukti, bukan opini:</p>
<div class="callout callout-accent">
    <div class="callout-title">❓ Pertanyaan yang harus Anda jawab</div>
    <p><strong>“Apakah sistem kita sanggup? Kalau tidak, apa persisnya yang harus diperbaiki, dan seberapa besar dampaknya?”</strong></p>
</div>

<h3>Yang Akan Anda Hasilkan</h3>
<ul>
    <li>Repositori pengujian performa yang tertata dan bisa dijalankan siapa pun di tim.</li>
    <li>Skenario beban yang meniru komposisi trafik nyata (bukan satu endpoint diulang-ulang).</li>
    <li>Quality gate otomatis di CI yang menolak PR bila performa memburuk.</li>
    <li>Dashboard Grafana untuk memantau tes secara langsung.</li>
    <li>Laporan akhir satu halaman berisi angka, bukti, dan rekomendasi berprioritas.</li>
</ul>

<div class="callout callout-warn">
    <div class="callout-title">⚠️ Aturan main</div>
    <ul>
        <li>Seluruh pengujian dilakukan pada lingkungan lokal/staging <strong>milik Anda sendiri</strong>.</li>
        <li>Tidak boleh ada kredensial di dalam kode — semua lewat variabel lingkungan.</li>
        <li>Setiap angka dalam laporan harus bisa direproduksi dengan satu perintah.</li>
    </ul>
</div>`,
        steps: [
            {
                title: 'Tahap 1 — Menyiapkan Sistem Target yang Bisa Diuji',
                body: `
<p>Anda butuh sistem yang <strong>bisa rusak</strong> agar pengujian bermakna. Gunakan komposisi berikut: satu API, satu database dengan pool sengaja dibuat kecil, plus stack observability.</p>
<pre data-lang="yaml" data-file="docker-compose.yml">services:
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_PASSWORD: rahasia
      POSTGRES_DB: tokocepat
    command:
      # Pool sengaja dibuat kecil supaya bottleneck-nya nyata dan terukur
      - "postgres"
      - "-c"
      - "max_connections=25"
    ports: ["5432:5432"]

  api:
    build: ./api
    environment:
      DATABASE_URL: postgres://postgres:rahasia@db:5432/tokocepat
      DB_POOL_SIZE: "10"
      NODE_ENV: production
    ports: ["8080:8080"]
    depends_on: [db]
    deploy:
      resources:
        limits: { cpus: "2", memory: 1G }

  prometheus:
    image: prom/prometheus:v3.1.0
    ports: ["9090:9090"]
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --web.enable-remote-write-receiver
      - --storage.tsdb.retention.time=15d
    volumes: ["./prometheus.yml:/etc/prometheus/prometheus.yml:ro"]

  grafana:
    image: grafana/grafana:12.0.0
    ports: ["3000:3000"]
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    depends_on: [prometheus]</pre>
<div class="callout callout-tip">
    <div class="callout-title">💡 Bila belum punya API sendiri</div>
    <p>Anda boleh memakai API contoh apa pun yang menyediakan endpoint login, daftar produk, dan pembuatan pesanan. Yang penting Anda <strong>memegang kendali penuh</strong> atas sistem tersebut dan bisa melihat metrik servernya.</p>
</div>
<p><strong>Checklist tahap ini:</strong> <code>docker compose up -d</code> berjalan, endpoint <code>/health</code> membalas 200, dan Anda bisa melihat CPU/memori tiap container lewat <code>docker stats</code>.</p>`
            },
            {
                title: 'Tahap 2 — Menulis Test Plan & Menerjemahkan SLO',
                body: `
<p>Sebelum kode, tulis dokumen satu halaman. Ini yang membedakan pengujian profesional dari sekadar "coba-coba tembak server".</p>
<pre data-lang="markdown" data-file="docs/test-plan.md"># Test Plan — Flash Sale 12.12

## Beban target (dari analytics tahun lalu x faktor pertumbuhan)
| Aktivitas        | Proporsi | Puncak target      |
|------------------|----------|--------------------|
| Browsing katalog | 70%      | 1.400 req/menit    |
| Pencarian        | 20%      |   400 req/menit    |
| Checkout         | 10%      |   600 checkout/mnt = 10/detik |

## SLO yang diuji
| SLI                        | SLO           |
|----------------------------|---------------|
| p95 latency katalog        | < 500 ms      |
| p95 latency checkout       | < 1.500 ms    |
| p99 latency checkout       | < 3.000 ms    |
| Error rate keseluruhan     | < 1%          |
| Keberhasilan alur checkout | > 99%         |

## Kriteria abort
- Error rate > 25% selama 1 menit  -> hentikan tes
- dropped_iterations > 100         -> hasil tidak sah, perbaiki generator

## Batasan
- Staging 2 vCPU; produksi 8 vCPU -> hasil TIDAK boleh diekstrapolasi linear
- CDN tidak aktif -> beban ke origin lebih berat dari kondisi nyata</pre>
<p><strong>Tugas Anda:</strong> isi versi Anda sendiri. Setiap SLO di tabel ini harus muncul sebagai satu baris <code>thresholds</code> di tahap berikutnya — kalau tidak, SLO itu hanya hiasan.</p>`
            },
            {
                title: 'Tahap 3 — Struktur Repositori & Modul Bersama',
                body: `
<p>Buat struktur yang bisa berkembang. Satu file raksasa akan menyulitkan siapa pun termasuk Anda sendiri tiga bulan lagi.</p>
<pre data-lang="bash" data-file="struktur">perf/
├── package.json
├── jsconfig.json
├── config/env.js
├── lib/
│   ├── auth.js          # login + cache token per VU
│   ├── data.js          # SharedArray + pembagian sadar-segmen
│   └── periksa.js       # kumpulan check standar
├── scenarios/
│   ├── smoke.js
│   ├── flash-sale.js    # skenario utama
│   └── breakpoint.js
├── docs/test-plan.md
├── hasil/               # .gitignore
└── bandingkan.js</pre>
<pre data-lang="javascript" data-file="perf/lib/auth.js">import http from 'k6/http';
import { Trend, Counter } from 'k6/metrics';

const durasiLogin = new Trend('durasi_login', true);
const loginUlang  = new Counter('login_ulang');

// State PER VU — tidak dibagi antar VU
let token = null;
let kedaluwarsaPada = 0;

export function ambilToken(baseUrl, user) {
  const sekarang = Date.now();
  if (token && sekarang &lt; kedaluwarsaPada - 60000) return token;
  if (token) loginUlang.add(1);

  const mulai = Date.now();
  const res = http.post(baseUrl + '/auth/login',
    JSON.stringify({ username: user.username, password: user.password }),
    { headers: { 'Content-Type': 'application/json' },
      tags: { name: 'Login' }, timeout: '15s' });
  durasiLogin.add(Date.now() - mulai);

  if (res.status !== 200) { token = null; return null; }

  token = res.json('access_token');
  kedaluwarsaPada = Date.now() + (res.json('expires_in') || 900) * 1000;
  return token;
}

export function resetToken() { token = null; }</pre>
<div class="callout callout-danger">
    <div class="callout-title">⛔ Jangan lewatkan ini</div>
    <p>Tambahkan <code>hasil/</code>, <code>*.json</code> hasil run, dan <code>.env</code> ke <code>.gitignore</code>. Berkas hasil bisa berukuran gigabyte dan tidak boleh masuk repositori.</p>
</div>`
            },
            {
                title: 'Tahap 4 — Data Uji: 5.000 Akun, Sadar Segmen',
                body: `
<p>Ini tahap yang paling sering diremehkan dan paling sering merusak validitas hasil.</p>
<pre data-lang="javascript" data-file="perf/lib/data.js">import { SharedArray } from 'k6/data';
import exec from 'k6/execution';

const INSTANCE = parseInt(__ENV.INSTANCE_ID || '0', 10);
const TOTAL    = parseInt(__ENV.TOTAL_INSTANCES || '1', 10);

// Dibangkitkan, BUKAN disalin dari produksi (UU PDP No. 27/2022)
const semuaUser = new SharedArray('users', function () {
  const d = [];
  for (let i = 1; i &lt;= 5000; i++) {
    d.push({
      username: 'perf' + String(i).padStart(5, '0') + '@uji.local',
      password: __ENV.TEST_PASSWORD,
    });
  }
  return d;
});

// Tiap instance memegang potongannya sendiri -> tidak ada akun bentrok
export const userSaya = new SharedArray('user-saya', function () {
  const ukuran = Math.ceil(semuaUser.length / TOTAL);
  return semuaUser.slice(INSTANCE * ukuran, INSTANCE * ukuran + ukuran);
});

export function userUntukVU() {
  return userSaya[(exec.vu.idInTest - 1) % userSaya.length];
}

// Data sekali pakai (kode voucher) -> indeks global unik per iterasi
export function voucherUnik(daftar) {
  return daftar[exec.scenario.iterationInTest % daftar.length];
}

export const KATA_KUNCI = new SharedArray('kata-kunci', function () {
  return ['sepatu','tas','jaket','celana','kaos','topi','sandal',
          'jam tangan','kacamata','dompet','ikat pinggang','kaos kaki'];
});</pre>
<p><strong>Wajib dikerjakan:</strong> buat skrip seeding (SQL atau HTTP) yang mendaftarkan 5.000 akun tersebut ke database staging <em>sebelum</em> tes dijalankan. Jangan mendaftarkan akun di dalam <code>setup()</code> k6 — itu akan membuat <code>setup()</code> berjalan lama dan tidak idempoten.</p>`
            },
            {
                title: 'Tahap 5 — Skenario Utama: Komposisi Trafik Nyata',
                body: `
<p>Inilah inti project. Tiga skenario berjalan bersamaan dengan proporsi sesuai test plan, dan checkout memakai <strong>open model</strong> karena targetnya dinyatakan dalam laju.</p>
<pre data-lang="javascript" data-file="perf/scenarios/flash-sale.js">import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';
import exec from 'k6/execution';
import { ambilToken, resetToken } from '../lib/auth.js';
import { userUntukVU, KATA_KUNCI } from '../lib/data.js';

const BASE = __ENV.BASE_URL;
if (!BASE) throw new Error('BASE_URL wajib diisi');
if (!__ENV.TEST_PASSWORD) throw new Error('TEST_PASSWORD wajib diisi');

const durasiCheckout   = new Trend('durasi_checkout', true);
const checkoutSukses   = new Rate('checkout_sukses');
const pesananDibuat    = new Counter('pesanan_dibuat');
const stokHabis        = new Counter('stok_habis');

export const options = {
  scenarios: {
    browsing: {
      executor: 'ramping-arrival-rate',
      startRate: 5, timeUnit: '1s',
      preAllocatedVUs: 100, maxVUs: 500,
      stages: [
        { duration: '2m', target: 23 },   // ~1.400/menit
        { duration: '6m', target: 23 },
        { duration: '2m', target: 0 },
      ],
      exec: 'browsing', tags: { alur: 'browsing' },
    },
    pencarian: {
      executor: 'constant-arrival-rate',
      rate: 7, timeUnit: '1s', duration: '10m',
      preAllocatedVUs: 40, maxVUs: 200,
      exec: 'pencarian', tags: { alur: 'pencarian' },
    },
    checkout: {
      executor: 'ramping-arrival-rate',
      startRate: 1, timeUnit: '1s',
      preAllocatedVUs: 60, maxVUs: 400,
      startTime: '1m',
      stages: [
        { duration: '1m', target: 10 },   // 600 checkout/menit
        { duration: '6m', target: 10 },
        { duration: '1m', target: 0 },
      ],
      exec: 'checkout', tags: { alur: 'checkout' },
    },
  },

  discardResponseBodies: true,
  tags: {
    testid: __ENV.TEST_ID || ('lokal-' + Date.now()),
    build:  __ENV.BUILD_ID || 'dev',
  },

  thresholds: {
    // ── SLO dari test plan, satu baris per baris tabel ──
    'http_req_duration{alur:browsing}':  ['p(95)&lt;500'],
    'http_req_duration{alur:checkout}':  ['p(95)&lt;1500', 'p(99)&lt;3000'],
    'http_req_failed':                   ['rate&lt;0.01'],
    'checkout_sukses':                   ['rate&gt;0.99'],
    'durasi_checkout':                   ['p(95)&lt;4000'],
    'checks':                            ['rate&gt;0.99'],

    // ── Validitas pengujian ──
    'dropped_iterations':                ['count&lt;100'],

    // ── Rem darurat ──
    'http_req_failed{alur:checkout}': [
      { threshold: 'rate&lt;0.25', abortOnFail: true, delayAbortEval: '1m' },
    ],
  },
};

export function setup() {
  const res = http.get(BASE + '/health', { timeout: '10s' });
  if (res.status !== 200) throw new Error('Target tidak sehat: ' + res.status);
  return { mulai: new Date().toISOString() };
}

export function browsing() {
  group('Browsing katalog', function () {
    const hal = (exec.scenario.iterationInTest % 20) + 1;
    const res = http.get(BASE + '/api/produk?halaman=' + hal, {
      tags: { name: 'ListProduk' },      // tag statis untuk URL dinamis
      timeout: '8s',
    });
    check(res, { 'katalog 200': (r) =&gt; r.status === 200 });
  });
  sleep(Math.random() * 4 + 2);          // think time realistis
}

export function pencarian() {
  const kunci = KATA_KUNCI[exec.scenario.iterationInTest % KATA_KUNCI.length];
  const res = http.get(BASE + '/api/cari?q=' + encodeURIComponent(kunci), {
    tags: { name: 'Cari' }, timeout: '8s',
  });
  check(res, { 'cari 200': (r) =&gt; r.status === 200 });
  sleep(Math.random() * 3 + 1);
}

export function checkout() {
  const mulai = Date.now();
  const user  = userUntukVU();
  let berhasil = false;

  const token = ambilToken(BASE, user);
  if (!token) { checkoutSukses.add(false); return; }

  const auth = {
    headers: { Authorization: 'Bearer ' + token,
               'Content-Type': 'application/json' },
    timeout: '10s',
  };

  group('Checkout', function () {
    const produkId = (exec.scenario.iterationInTest % 50) + 1;

    const tambah = http.post(BASE + '/api/keranjang',
      JSON.stringify({ produk_id: produkId, jumlah: 1 }),
      Object.assign({}, auth, { tags: { name: 'TambahKeranjang', alur: 'checkout' } }));

    if (tambah.status === 409) { stokHabis.add(1); return; }
    if (!check(tambah, { 'keranjang 201': (r) =&gt; r.status === 201 })) return;

    sleep(1);   // pengguna mengisi alamat

    let bayar = http.post(BASE + '/api/pesanan', JSON.stringify({ metode: 'va' }),
      Object.assign({}, auth, { tags: { name: 'BuatPesanan', alur: 'checkout' } }));

    if (bayar.status === 401) {         // token kedaluwarsa -> perbarui, coba lagi
      resetToken();
      const baru = ambilToken(BASE, user);
      if (baru) {
        auth.headers.Authorization = 'Bearer ' + baru;
        bayar = http.post(BASE + '/api/pesanan', JSON.stringify({ metode: 'va' }),
          Object.assign({}, auth, { tags: { name: 'BuatPesanan', alur: 'checkout' } }));
      }
    }

    berhasil = check(bayar, {
      'pesanan 201':   (r) =&gt; r.status === 201,
      'ada nomor':     (r) =&gt; !!r.json('nomor_pesanan'),
    });
    if (berhasil) pesananDibuat.add(1);
  });

  durasiCheckout.add(Date.now() - mulai);
  checkoutSukses.add(berhasil);
}</pre>`
            },
            {
                title: 'Tahap 6 — Observability: Kirim ke Prometheus & Bangun Dashboard',
                body: `
<p>Tanpa data sisi server, Anda hanya bisa menebak penyebab. Tahap ini menyambungkan kedua sisi.</p>
<pre data-lang="bash" data-file="terminal">export K6_PROMETHEUS_RW_SERVER_URL=http://localhost:9090/api/v1/write
export K6_PROMETHEUS_RW_TREND_STATS="p(95),p(99),avg,max"
export BASE_URL=http://localhost:8080
export TEST_PASSWORD='SandiUji123!'

k6 run --out experimental-prometheus-rw \\
       --tag testid=flashsale-run-01 \\
       perf/scenarios/flash-sale.js</pre>
<p><strong>Dashboard yang harus Anda buat di Grafana</strong> (minimal 6 panel, semuanya pada rentang waktu yang sama):</p>
<table>
<thead><tr><th>Panel</th><th>Sumber</th><th>Menjawab</th></tr></thead>
<tbody>
<tr><td>p95 &amp; p99 latency per alur</td><td>k6</td><td>Apakah SLO terpenuhi?</td></tr>
<tr><td>Throughput (req/s) &amp; VU aktif</td><td>k6</td><td>Beban yang benar-benar terkirim</td></tr>
<tr><td>Error rate per endpoint</td><td>k6</td><td>Endpoint mana yang pertama menyerah</td></tr>
<tr><td>CPU &amp; memori container API</td><td>cAdvisor / node_exporter</td><td>Apakah CPU-bound?</td></tr>
<tr><td>Koneksi aktif PostgreSQL</td><td>postgres_exporter</td><td>Apakah pool habis?</td></tr>
<tr><td>Durasi query p95</td><td>postgres_exporter</td><td>Query mana yang lambat</td></tr>
</tbody>
</table>
<div class="callout callout-tip">
    <div class="callout-title">💡 Titik korelasi</div>
    <p>Saat p95 checkout melonjak, lihat panel koneksi PostgreSQL pada <strong>detik yang sama</strong>. Bila koneksi aktif mentok di angka <code>DB_POOL_SIZE</code>, Anda baru saja menemukan bottleneck-nya — dengan bukti, bukan dugaan.</p>
</div>`
            },
            {
                title: 'Tahap 7 — Quality Gate di CI/CD',
                body: `
<p>Pengujian yang hanya dijalankan manual akan berhenti dijalankan dalam dua bulan. Otomatiskan.</p>
<pre data-lang="yaml" data-file=".github/workflows/performa.yml">name: Uji Performa

on:
  pull_request: { branches: [main] }
  schedule: [{ cron: '0 18 * * *' }]
  workflow_dispatch:

jobs:
  smoke:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v5
      - uses: grafana/setup-k6-action@v1
        with: { k6-version: '1.0.0' }

      - name: Nyalakan target
        run: |
          docker compose up -d
          for i in $(seq 1 30); do
            curl -sf http://localhost:8080/health && break || sleep 2
          done

      - name: Smoke test
        run: k6 run --vus 2 --duration 30s --summary-export=hasil.json perf/scenarios/smoke.js
        env:
          BASE_URL: http://localhost:8080
          TEST_PASSWORD: \${{ secrets.TEST_PASSWORD }}

      - name: Bandingkan dengan baseline
        run: node perf/bandingkan.js perf/baseline.json hasil.json

      - name: Unggah hasil
        if: always()
        uses: actions/upload-artifact@v4
        with: { name: hasil-performa, path: hasil.json }

      - name: Matikan target
        if: always()
        run: docker compose down -v</pre>
<p><strong>Kriteria gate:</strong> PR ditolak bila p95 memburuk &gt; 10% dari baseline, atau error rate naik &gt; 1 poin persen. Skrip <code>bandingkan.js</code> dari Bab 13 bisa dipakai langsung.</p>`
            },
            {
                title: 'Tahap 8 — Breakpoint Test & Investigasi Bottleneck',
                body: `
<p>Sekarang cari batas sistem. Jalankan <code>breakpoint.js</code> dari Bab 15 sambil memantau dashboard.</p>
<h4>Protokol investigasi (ikuti urutannya)</h4>
<ol>
    <li><strong>Validasi generator.</strong> <code>dropped_iterations</code> harus mendekati 0 dan CPU mesin generator &lt; 75%. Bila tidak, hasilnya belum layak dibaca.</li>
    <li><strong>Catat titik belok.</strong> Pada laju berapa p95 mulai naik tajam? Tulis angkanya.</li>
    <li><strong>Dekomposisi latency.</strong> <code>waiting</code> dominan? Berarti server. <code>blocked</code> dominan? Berarti klien.</li>
    <li><strong>Korelasi sisi server.</strong> Pada detik yang sama: CPU berapa? Koneksi DB berapa? Ada slow query?</li>
    <li><strong>Uji hipotesis.</strong> Ubah SATU variabel (misal <code>DB_POOL_SIZE</code> 10 → 40), jalankan ulang tes yang sama persis, bandingkan.</li>
</ol>
<pre data-lang="bash" data-file="terminal"># Jalankan tes sambil memantau sisi server di terminal lain
watch -n 2 'docker stats --no-stream'

docker compose exec db psql -U postgres -d tokocepat -c \\
  "SELECT count(*) AS koneksi, state FROM pg_stat_activity GROUP BY state;"

docker compose exec db psql -U postgres -d tokocepat -c \\
  "SELECT query, calls, mean_exec_time FROM pg_stat_statements
   ORDER BY mean_exec_time DESC LIMIT 10;"</pre>
<div class="callout callout-danger">
    <div class="callout-title">⛔ Aturan satu variabel</div>
    <p>Bila Anda mengubah pool size <em>dan</em> menambah index <em>dan</em> menaikkan worker sekaligus lalu performa membaik — Anda tidak tahu mana yang berjasa, dan tidak bisa memprediksi dampaknya di produksi. Ubah satu, ukur, catat, baru lanjut.</p>
</div>`
            },
            {
                title: 'Tahap 9 — Laporan Akhir & Rekomendasi',
                body: `
<p>Laporan yang baik bisa dibaca CTO dalam 60 detik dan tetap punya kedalaman teknis untuk engineer.</p>
<pre data-lang="markdown" data-file="docs/laporan-akhir.md"># Kesiapan Flash Sale 12.12 — TokoCepat

## Kesimpulan
Sistem saat ini sanggup **380 checkout/menit**. Target kampanye 600/menit
**BELUM terpenuhi** (kekurangan 37%).
Bottleneck utama: connection pool PostgreSQL (DB_POOL_SIZE=10).
Setelah dinaikkan ke 40, kapasitas terukur menjadi **910 checkout/menit**.

## Hasil Pengujian
| Metrik            | Sebelum | Sesudah | Target | Status  |
|-------------------|---------|---------|--------|---------|
| Checkout/menit    | 380     | 910     | 600    | LULUS   |
| p95 checkout      | 2.9 s   | 740 ms  | 1,5 s  | LULUS   |
| p99 checkout      | 8.1 s   | 1,9 s   | 3 s    | LULUS   |
| Error rate        | 4,2%    | 0,3%    | < 1%   | LULUS   |

## Bukti
- Titik belok pada 6,3 checkout/detik; p95 melompat 310 ms -> 2.900 ms.
- pg_stat_activity menunjukkan koneksi aktif mentok di 10 pada detik yang sama.
- CPU container API hanya 38% saat p99 memuncak -> bukan CPU-bound.
- Setelah DB_POOL_SIZE=40, titik belok bergeser ke 15,2 checkout/detik.

## Rekomendasi (urut dampak per satuan usaha)
1. **DB_POOL_SIZE 10 -> 40 + PgBouncer.** Dampak: +140% kapasitas. Usaha: 2 jam.
2. **Index pesanan(user_id, dibuat_pada).** Dampak: p95 query -35%. Usaha: 1 jam.
3. **Email konfirmasi jadi asinkron (queue).** Dampak: p99 -600 ms. Usaha: 2 hari.
4. **Cache katalog di Redis, TTL 60 detik.** Dampak: beban DB -45%. Usaha: 1 hari.

## Batasan & Risiko
- Diuji di staging 2 vCPU; produksi 8 vCPU. Angka TIDAK diekstrapolasi linear.
- CDN tidak aktif saat pengujian -> beban origin di produksi akan lebih ringan.
- Belum diuji: kegagalan sebagian (satu node mati saat puncak).

## Reproduksi
    docker compose up -d
    BASE_URL=http://localhost:8080 TEST_PASSWORD=... \\
      k6 run perf/scenarios/flash-sale.js</pre>`
            }
        ],
        criteria: [
            'Repositori pengujian tertata (config/lib/scenarios/docs) dan berjalan di mesin lain hanya dengan mengisi variabel lingkungan.',
            'Tidak ada satu pun kredensial, token, atau URL produksi yang ter-commit ke Git.',
            'Skenario memakai <strong>minimal 3 executor berbeda</strong>, dan alur bertarget laju memakai <em>arrival-rate</em> (open model), bukan constant-vus.',
            'Setiap baris SLO di test plan punya pasangan <code>thresholds</code>, termasuk threshold pada <code>checks</code> dan <code>dropped_iterations</code>.',
            'Semua URL dinamis diberi tag <code>name</code> statis sehingga ringkasan tetap terbaca.',
            'Data uji minimal 1.000 akun, dimuat lewat <code>SharedArray</code>, dan dibagi sadar-segmen (siap dijalankan terdistribusi).',
            'Ada <code>abortOnFail</code> dengan <code>delayAbortEval</code> sebagai rem darurat.',
            'Hasil terkirim ke Prometheus dan dashboard Grafana memuat minimal 6 panel, termasuk metrik sisi server.',
            'Pipeline CI menjalankan smoke test di setiap PR dan <strong>menolak PR</strong> bila p95 memburuk lebih dari 10% dari baseline.',
            'Breakpoint test dijalankan dengan <code>dropped_iterations</code> mendekati nol — bukti hasilnya sah.',
            'Bottleneck dibuktikan dengan korelasi dua sisi (metrik k6 + metrik server), bukan dugaan.',
            'Perbaikan diuji dengan aturan satu variabel, dan dampaknya terukur dengan angka sebelum/sesudah.',
            'Laporan akhir memuat kesimpulan, tabel angka, bukti, rekomendasi berprioritas, batasan, dan perintah reproduksi.'
        ],
        outro: `
<h3>Tantangan Tambahan (bila Anda ingin melampaui standar)</h3>
<ul>
    <li><strong>Distributed.</strong> Jalankan skenario yang sama di Kubernetes dengan k6-operator <code>parallelism: 4</code>, dan pastikan pembagian akun tetap tidak bentrok.</li>
    <li><strong>Chaos ringan.</strong> Matikan satu replika API di tengah tes (<code>docker compose stop api</code> lalu start lagi) dan ukur berapa lama sistem pulih.</li>
    <li><strong>Hybrid browser.</strong> Tambahkan 2 VU <code>k6/browser</code> yang berjalan paralel untuk mengukur LCP/CLS di bawah beban puncak.</li>
    <li><strong>Soak 8 jam.</strong> Jalankan semalam pada 50% kapasitas aman dan buktikan tidak ada kebocoran memori atau koneksi.</li>
</ul>`
    },

    /* ================== UJIAN AKHIR ================== */
    exam: {
        durationMin: 40,
        passScore: 75,
        subtitle: '25 soal menyeluruh — konsep, skrip, produksi, dan analisis. Lulus ≥ 75%.',
        questions: [
            {
                q: 'Manajemen bertanya "apakah API kita sanggup 800 transaksi per detik?". Executor mana yang <strong>wajib</strong> dipakai?',
                opts: ['<code>constant-vus</code> dengan 800 VU', '<code>ramping-vus</code>', '<code>constant-arrival-rate</code>', '<code>per-vu-iterations</code>'],
                a: 2,
                exp: 'Pertanyaan tentang laju (rate) hanya bisa dijawab dengan <em>open model</em>. Executor berbasis VU melambat sendiri saat server melambat (<em>coordinated omission</em>), sehingga target laju tidak pernah benar-benar tercapai.'
            },
            {
                q: 'Tes memiliki 200 check dan 180 gagal, tanpa threshold apa pun. Berapa exit code k6?',
                opts: ['0', '1', '99', '104'],
                a: 0,
                exp: 'Exit code <strong>0</strong>. <code>check()</code> tidak pernah memengaruhi exit code. Hanya <code>thresholds</code> yang bisa membuat k6 keluar dengan 99 (threshold gagal) atau 104 (abortOnFail).'
            },
            {
                q: 'File JSON 100 MB dimuat sebagai array biasa, tes dijalankan dengan 300 VU. Apa yang terjadi?',
                opts: [
                    'k6 otomatis berbagi memori, tetap 100 MB',
                    'Memori membengkak ± 30 GB karena data disalin ke tiap VU',
                    'k6 menolak menjalankan tes',
                    'Data hanya dibaca VU pertama'
                ],
                a: 1,
                exp: 'Array JavaScript biasa disalin ke setiap VU: 100 MB × 300 = ± 30 GB. Ini penyebab paling umum <em>out of memory</em> pada k6. Solusinya <code>SharedArray</code>, yang menyimpan data sekali saja di sisi Go.'
            },
            {
                q: 'Anda memanggil <code>/api/pesanan/{id}</code> dengan 20.000 id berbeda. Apa yang harus dilakukan agar metrik tetap terbaca?',
                opts: [
                    'Mengurangi jumlah VU',
                    'Menambahkan <code>tags: { name: "GetPesanan" }</code>',
                    'Mengaktifkan <code>discardResponseBodies</code>',
                    'Memakai <code>http.batch()</code>'
                ],
                a: 1,
                exp: 'k6 mengagregasi metrik per-URL. Tanpa tag <code>name</code> statis, akan terbentuk 20.000 baris metrik terpisah — ringkasan tak terbaca dan berisiko <em>cardinality explosion</em> di backend metrik.'
            },
            {
                q: 'Fungsi <code>setup()</code> berjalan berapa kali pada tes dengan 500 VU selama 1 jam?',
                opts: ['500 kali', '1 kali', 'Setiap iterasi', 'Setiap menit'],
                a: 1,
                exp: '<code>setup()</code> dan <code>teardown()</code> masing-masing berjalan tepat sekali untuk keseluruhan tes. Yang berjalan sekali per VU adalah <em>init context</em>.'
            },
            {
                q: '<code>http_req_duration p(95)=2.4s</code> tetapi <code>http_req_waiting p(95)=90ms</code>. Apa kesimpulannya?',
                opts: [
                    'Backend lambat memproses',
                    'Waktu habis di pengunduhan respons atau bandwidth terbatas',
                    'DNS lambat',
                    'Threshold salah'
                ],
                a: 1,
                exp: '<code>waiting</code> (TTFB) rendah berarti server cepat memproses. Sisa waktu ada di <code>receiving</code> — payload terlalu besar atau bandwidth sempit. Solusinya kompresi/paginasi, bukan optimasi query.'
            },
            {
                q: 'Ringkasan menampilkan <code>dropped_iterations: 8400</code>. Apa yang harus Anda lakukan?',
                opts: [
                    'Abaikan, itu normal pada beban tinggi',
                    'Anggap hasil tidak sah; naikkan preAllocatedVUs atau tambah kapasitas generator',
                    'Naikkan threshold agar tes lulus',
                    'Kurangi durasi tes'
                ],
                a: 1,
                exp: '<code>dropped_iterations</code> berarti k6 gagal menjadwalkan iterasi — beban yang sampai ke server lebih kecil dari target. Selama nilainya besar, kesimpulan kapasitas apa pun tidak bisa dipercaya.'
            },
            {
                q: 'Fungsi <code>open()</code> hanya boleh dipanggil di mana?',
                opts: ['Di dalam <code>default()</code>', 'Di <code>setup()</code>', 'Di init context (level modul)', 'Di <code>teardown()</code>'],
                a: 2,
                exp: '<code>open()</code> bersifat <em>init-only</em>. Memanggilnya di tempat lain melempar error, dan secara konsep memang salah: membaca disk tiap iterasi akan mengubah load test menjadi tes kecepatan disk.'
            },
            {
                q: 'Threshold mana yang <strong>tidak</strong> dapat diandalkan pada tes terdistribusi 10 pod?',
                opts: [
                    '<code>http_req_duration: ["p(95)&lt;800"]</code>',
                    '<code>http_req_failed: ["rate&lt;0.01"]</code>',
                    '<code>http_reqs: ["count&gt;100000"]</code>',
                    '<code>checks: ["rate&gt;0.99"]</code>'
                ],
                a: 2,
                exp: 'Threshold berbasis <code>count</code> dievaluasi per-pod. Tiap pod hanya melihat sepersepuluh total request sehingga semuanya gagal secara keliru. Persentil dan rate tetap bermakna pada porsi beban apa pun.'
            },
            {
                q: 'Apa fungsi <code>gracefulRampDown</code>?',
                opts: [
                    'Memperlambat ramp-up di awal tes',
                    'Memberi waktu iterasi yang sedang berjalan untuk selesai sebelum VU dihentikan',
                    'Menunda evaluasi threshold',
                    'Membatasi laju request maksimum'
                ],
                a: 1,
                exp: 'Tanpa <code>gracefulRampDown</code>, VU dihentikan paksa di tengah iterasi sehingga transaksi terpotong dan tercatat sebagai error — mencemari statistik di akhir tes.'
            },
            {
                q: 'Target 150 iterasi/detik, satu iterasi rata-rata 4 detik. <code>preAllocatedVUs</code> minimal yang masuk akal?',
                opts: ['15', '150', '± 600', '4.000'],
                a: 2,
                exp: 'Rumus <code>VU ≈ rate × durasi_iterasi</code> = 150 × 4 = <strong>600 VU</strong>. Dengan VU lebih sedikit, iterasi tidak bisa dimulai tepat waktu dan masuk ke <code>dropped_iterations</code>.'
            },
            {
                q: 'Semua VU login memakai akun yang sama dan muncul banyak <code>429</code>. Apa yang sebenarnya Anda ukur?',
                opts: ['Kapasitas aplikasi', 'Rate limiter / proteksi brute-force', 'Kecepatan database', 'Latensi jaringan'],
                a: 1,
                exp: 'Kode 429 berarti rate limiting aktif. Anda mengukur proteksi keamanan, bukan kapasitas aplikasi. Sediakan kumpulan akun uji dan bagikan per VU.'
            },
            {
                q: 'Mengapa <code>sleep()</code> penting dalam skrip k6?',
                opts: [
                    'Agar k6 tidak crash',
                    'Untuk menirukan think time pengguna nyata agar beban realistis',
                    'Agar threshold lebih mudah dilewati',
                    'Untuk mengurangi penggunaan memori'
                ],
                a: 1,
                exp: 'Tanpa think time, tiap VU mengirim request secepat mesin sanggup — menghasilkan beban yang tidak akan pernah terjadi di produksi, sehingga Anda menemukan bottleneck palsu.'
            },
            {
                q: 'Apa yang dimaksud <em>coordinated omission</em>?',
                opts: [
                    'Beberapa VU tidak sengaja dilewati saat penjadwalan',
                    'Closed model menyembunyikan beban terburuk karena VU ikut melambat saat server melambat',
                    'Metrik hilang saat dikirim ke Prometheus',
                    'Threshold yang tidak pernah dievaluasi'
                ],
                a: 1,
                exp: 'Dalam closed model, VU menunggu balasan sebelum mengirim lagi. Ketika server melambat, beban ikut turun sehingga server "terlindungi" dan Anda kehilangan justru momen terburuknya. Solusinya arrival-rate executor.'
            },
            {
                q: 'Anda menjalankan soak test 6 jam di CI. Output mana yang paling tepat untuk artefak?',
                opts: ['<code>--out json=</code>', '<code>--summary-export=</code>', '<code>--http-debug=full</code>', '<code>--out csv=</code>'],
                a: 1,
                exp: '<code>--summary-export</code> hanya menulis agregat akhir (beberapa KB), ideal sebagai artefak dan baseline. <code>--out json</code> pada tes selama itu bisa menghasilkan puluhan GB dan memenuhi disk runner.'
            },
            {
                q: 'Latency melonjak 10× tapi CPU server hanya 35%. Tersangka mana yang <strong>paling lemah</strong>?',
                opts: ['Connection pool database habis', 'Panggilan sinkron ke API pihak ketiga', 'CPU aplikasi kurang', 'Kontensi lock pada tabel'],
                a: 2,
                exp: 'CPU 35% berarti prosesor jelas bukan batasannya. Latency tinggi dengan CPU rendah menandakan proses sedang <em>menunggu</em> sesuatu: koneksi, lock, atau respons layanan lain.'
            },
            {
                q: 'Perintah <code>--out experimental-prometheus-rw</code> gagal 404. Penyebab paling mungkin?',
                opts: [
                    'Versi k6 terlalu baru',
                    'Prometheus dijalankan tanpa <code>--web.enable-remote-write-receiver</code>',
                    'Threshold belum diset',
                    'VU terlalu banyak'
                ],
                a: 1,
                exp: 'Endpoint <code>/api/v1/write</code> tidak aktif pada konfigurasi default Prometheus. Flag <code>--web.enable-remote-write-receiver</code> wajib ditambahkan.'
            },
            {
                q: 'Mana pernyataan yang <strong>benar</strong> tentang <code>k6/browser</code>?',
                opts: [
                    'Cocok untuk menghasilkan beban ribuan VU secara ekonomis',
                    'Sangat mahal per VU; sebaiknya dipakai beberapa VU saja untuk mengukur, dipadu beban protokol',
                    'Menggantikan sepenuhnya pengujian protokol HTTP',
                    'Tidak bisa mengukur Core Web Vitals'
                ],
                a: 1,
                exp: 'Satu instance Chromium memakan ± 100–300 MB RAM dan satu core CPU. Pola standar industri adalah <em>hybrid</em>: beban besar lewat HTTP, 1–5 VU browser untuk mengukur pengalaman frontend.'
            },
            {
                q: 'Apa perbedaan <code>http_req_failed</code> dan <code>checks</code>?',
                opts: [
                    'Keduanya sama, hanya beda nama',
                    '<code>http_req_failed</code> = kegagalan level protokol; <code>checks</code> = rasio assertion bisnis Anda',
                    '<code>checks</code> hanya untuk status code',
                    '<code>http_req_failed</code> hanya menghitung timeout'
                ],
                a: 1,
                exp: 'Sebuah API bisa membalas 200 OK (http_req_failed 0%) dengan body <code>{"success": false}</code> — dan hanya <code>check()</code> yang menangkapnya. Keduanya wajib dipantau bersamaan.'
            },
            {
                q: 'Kapan <code>abortOnFail</code> paling tepat digunakan?',
                opts: [
                    'Di setiap threshold agar tes selalu cepat',
                    'Sebagai rem darurat saat sistem jelas sudah rusak, dipadu <code>delayAbortEval</code>',
                    'Untuk menghentikan tes saat satu check gagal',
                    'Hanya di lingkungan produksi'
                ],
                a: 1,
                exp: '<code>abortOnFail</code> mencegah pemborosan waktu (dan kerusakan lingkungan) saat sistem sudah jelas gagal. <code>delayAbortEval</code> wajib menyertainya agar error saat warm-up tidak langsung membatalkan tes.'
            },
            {
                q: 'Grafik latency berbentuk gigi gergaji: naik-turun berkala setiap ± 45 detik. Dugaan paling masuk akal?',
                opts: [
                    'Kebocoran memori',
                    'Garbage collection, cache expiry, atau cron job berkala',
                    'Rate limiter',
                    'DNS lambat'
                ],
                a: 1,
                exp: 'Pola berulang dengan periode tetap menandakan proses periodik: siklus GC, TTL cache yang serentak kedaluwarsa, atau job terjadwal. Kebocoran memori memberi pola naik terus tanpa turun.'
            },
            {
                q: 'Setelah stress test, berapa kapasitas aman yang sebaiknya dipakai untuk perencanaan?',
                opts: ['100% titik patah', '90% titik patah', '60–70% titik jenuh', 'Sama dengan rata-rata harian'],
                a: 2,
                exp: 'Kapasitas terlalu dekat titik patah tidak menyisakan ruang untuk lonjakan, kegagalan sebagian node, atau pertumbuhan trafik. Praktik umum: 60–70% dari titik jenuh.'
            },
            {
                q: 'Mana cara yang benar mengirim JSON di k6?',
                opts: [
                    '<code>http.post(url, { a: 1 })</code>',
                    '<code>http.post(url, JSON.stringify({ a: 1 }), { headers: { "Content-Type": "application/json" } })</code>',
                    '<code>http.postJson(url, { a: 1 })</code>',
                    '<code>http.post(url, "a=1")</code>'
                ],
                a: 1,
                exp: 'Object polos dikirim sebagai <em>form-urlencoded</em>. JSON membutuhkan dua hal sekaligus: <code>JSON.stringify()</code> dan header <code>Content-Type: application/json</code>.'
            },
            {
                q: 'Di mana token sebaiknya di-cache agar tiap VU tidak login ulang setiap iterasi?',
                opts: [
                    'Variabel lokal di dalam <code>default()</code>',
                    'Variabel di scope modul (init context)',
                    '<code>SharedArray</code>',
                    'Berkas di disk'
                ],
                a: 1,
                exp: 'Variabel scope modul diinisialisasi per VU dan bertahan antar-iterasi VU tersebut — persis yang dibutuhkan untuk cache token. <code>SharedArray</code> bersifat read-only sehingga tidak bisa menyimpan state.'
            },
            {
                q: 'Apa langkah <strong>pertama</strong> sebelum menyimpulkan bottleneck dari hasil load test?',
                opts: [
                    'Menaikkan jumlah VU untuk memastikan',
                    'Memvalidasi bahwa generator sendiri tidak kewalahan (dropped_iterations ≈ 0, CPU &lt; 75%)',
                    'Langsung memeriksa slow query di database',
                    'Melonggarkan threshold'
                ],
                a: 1,
                exp: 'Bila generator kewalahan, seluruh angka tidak sah: beban yang sampai ke server lebih kecil dari target dan latency terukur mengandung waktu antre di sisi klien. Validasi generator selalu langkah pertama.'
            }
        ]
    },

    /* ================== SIMULATOR TERMINAL ================== */
    sim: function (cmd, t) {
        const s = t.ctx;
        s.files = s.files || ['smoke.js'];

        const say  = (x, c) => t.echo(x, c || '');
        const err  = (x) => t.echo(x, 't-err');
        const info = (x) => t.echo(x, 't-info');
        const ok   = (x) => t.echo(x, 't-ok');

        const angka = (min, max, d) => (Math.random() * (max - min) + min).toFixed(d === undefined ? 0 : d);

        function ringkasan(vus, durasi) {
            const reqs   = Math.round(vus * durasi * (0.7 + Math.random() * 0.6));
            const rps    = (reqs / durasi).toFixed(1);
            const p95    = +angka(180, 900);
            const p99    = p95 + +angka(200, 1800);
            const gagal  = (Math.random() * 1.4).toFixed(2);
            const cek    = (98 + Math.random() * 2).toFixed(2);
            const lulus  = p95 < 800 && +gagal < 1;

            say('');
            say('  █ TOTAL RESULTS', 't-info');
            say('');
            say('    checks_total.......: ' + reqs * 2 + '   ' + (rps * 2).toFixed(1) + '/s');
            say('    checks_succeeded...: ' + cek + '%  ' + Math.round(reqs * 2 * cek / 100) + ' out of ' + reqs * 2,
                +cek > 99 ? 't-ok' : 't-warn');
            say('');
            say('    HTTP');
            say('    http_req_duration..: avg=' + angka(120, 400) + 'ms  min=' + angka(20, 60) +
                'ms  med=' + angka(100, 300) + 'ms  max=' + angka(1500, 6000) + 'ms');
            say('      p(95)=' + p95 + 'ms  p(99)=' + p99 + 'ms');
            say('    http_req_failed....: ' + gagal + '%   ' + Math.round(reqs * gagal / 100) + ' out of ' + reqs,
                +gagal < 1 ? 't-ok' : 't-warn');
            say('    http_reqs..........: ' + reqs + '   ' + rps + '/s');
            say('');
            say('    EXECUTION');
            say('    iteration_duration.: avg=' + angka(1100, 1900) + 'ms');
            say('    iterations.........: ' + reqs + '   ' + rps + '/s');
            say('    vus................: ' + vus + '    min=1  max=' + vus);
            say('');
            say('    NETWORK');
            say('    data_received......: ' + angka(2, 60) + ' MB  ' + angka(200, 1800) + ' kB/s');
            say('    data_sent..........: ' + angka(1, 8) + ' MB   ' + angka(40, 300) + ' kB/s');
            say('');
            say('  █ THRESHOLDS', 't-info');
            say('');
            say('    http_req_duration', '');
            say('    ' + (p95 < 800 ? '✓' : '✗') + ' p(95)<800  ->  p(95)=' + p95 + 'ms', p95 < 800 ? 't-ok' : 't-err');
            say('    http_req_failed');
            say('    ' + (+gagal < 1 ? '✓' : '✗') + ' rate<0.01  ->  rate=' + (gagal / 100).toFixed(4), +gagal < 1 ? 't-ok' : 't-err');
            say('');
            if (lulus) ok('  ✓ Semua threshold LULUS. exit code: 0');
            else       err('  ✗ Ada threshold yang GAGAL. exit code: 99  -> pipeline CI akan merah.');
        }

        // ---------- routing perintah ----------
        if (cmd === 'help' || cmd === 'k6 --help' || cmd === 'k6 help') {
            info('Perintah yang dikenali simulator ini:');
            say('  k6 version                      tampilkan versi');
            say('  k6 new <file>                   buat kerangka skrip baru');
            say('  k6 run [--vus N] [--duration T] [--out ...] <file>');
            say('  k6 cloud run <file>             jalankan di Grafana Cloud k6');
            say('  docker run --rm -i -v "$PWD:/scripts" grafana/k6 run /scripts/<file>');
            say('  ls | cat <file> | ulimit -n | clear');
            return;
        }

        if (cmd === 'k6 version' || cmd === 'k6 -v') {
            say('k6 v1.0.0 (commit/9a1b2c3d, go1.23.4, linux/amd64)');
            return;
        }

        if (cmd === 'ls') { say(s.files.join('  ')); return; }

        if (cmd === 'ulimit -n') { say(String(s.ulimit || 1024)); return; }
        if (/^ulimit -n \d+$/.test(cmd)) {
            s.ulimit = +cmd.split(' ')[2];
            ok('batas file descriptor diubah menjadi ' + s.ulimit);
            return;
        }

        let m = cmd.match(/^k6 new\s+(\S+)$/);
        if (m) {
            if (s.files.indexOf(m[1]) === -1) s.files.push(m[1]);
            ok('Initialized a new k6 test script in ' + m[1] + '.');
            say('You can now execute it by running `k6 run ' + m[1] + '`.', 't-dim');
            return;
        }

        m = cmd.match(/^cat\s+(\S+)$/);
        if (m) {
            if (s.files.indexOf(m[1]) === -1) return err('cat: ' + m[1] + ': No such file or directory');
            say("import http from 'k6/http';", 't-dim');
            say("import { check, sleep } from 'k6';", 't-dim');
            say('', 't-dim');
            say('export const options = { vus: 10, duration: \'30s\' };', 't-dim');
            say('', 't-dim');
            say('export default function () {', 't-dim');
            say("  const res = http.get('https://test-api.k6.io/public/crocodiles/');", 't-dim');
            say("  check(res, { 'status 200': (r) => r.status === 200 });", 't-dim');
            say('  sleep(1);', 't-dim');
            say('}', 't-dim');
            return;
        }

        if (/^docker run .*grafana\/k6 run /.test(cmd)) {
            const f = cmd.split(' run ').pop().trim();
            info('Unable to find image \'grafana/k6:latest\' locally');
            say('latest: Pulling from grafana/k6', 't-dim');
            say('Status: Downloaded newer image for grafana/k6:latest', 't-dim');
            say('');
            if (/localhost|127\.0\.0\.1/.test(cmd)) {
                err('WARN[0000] Request Failed  error="dial tcp 127.0.0.1:8080: connect: connection refused"');
                err('');
                err('⚠️  localhost DI DALAM container bukan localhost mesin Anda.');
                say('   Perbaikan: pakai http://host.docker.internal:8080', 't-warn');
                say('   atau jalankan dengan --network host (Linux).', 't-warn');
                return;
            }
            say('  execution: local  script: ' + f);
            ringkasan(10, 30);
            return;
        }

        if (/^k6 cloud/.test(cmd)) {
            err('Error: not logged in. Jalankan `k6 cloud login --token <TOKEN>` terlebih dahulu.');
            say('Grafana Cloud k6 menjalankan tes dari infrastruktur Grafana di berbagai region.', 't-dim');
            return;
        }

        m = cmd.match(/^k6 run\s+(.*)$/);
        if (m) {
            const args   = m[1].trim();
            const berkas = args.split(/\s+/).filter(a => /\.(js|ts)$/.test(a))[0];

            if (!berkas) return err('Error: berkas skrip belum disebutkan. Contoh: k6 run skrip.js');
            if (s.files.indexOf(berkas) === -1) {
                err('Error: open ' + berkas + ': no such file or directory');
                say('Buat dulu dengan: k6 new ' + berkas, 't-dim');
                return;
            }

            const mv = args.match(/--vus\s+(\d+)/);
            const md = args.match(/--duration\s+(\d+)([smh])/);
            const mi = args.match(/--iterations\s+(\d+)/);
            const vus = mv ? +mv[1] : 10;
            let durasi = 30;
            if (md) durasi = +md[1] * (md[2] === 'm' ? 60 : md[2] === 'h' ? 3600 : 1);

            say('');
            say('         /\\      Grafana   /‾‾/', 't-info');
            say('    /\\  /  \\     |\\  __   /  /', 't-info');
            say('   /  \\/    \\    | |/ /  /   ‾‾\\', 't-info');
            say('  /          \\   |   (  |  (‾)  |', 't-info');
            say(' / __________ \\  |_|\\_\\  \\_____/', 't-info');
            say('');
            say('     execution: local');
            say('        script: ' + berkas);
            say('        output: ' + (/--out\s+(\S+)/.test(args) ? args.match(/--out\s+(\S+)/)[1] : '-'));
            say('');
            if (mi) say('     scenarios: (100.00%) 1 scenario, ' + vus + ' max VUs, ' + mi[1] + ' iterations');
            else    say('     scenarios: (100.00%) 1 scenario, ' + vus + ' max VUs, ' + (durasi + 30) + 's max duration');
            say('              * default: ' + vus + ' looping VUs for ' + durasi + 's');
            say('');
            say('running (' + String(Math.floor(durasi / 60)).padStart(2, '0') + 'm' +
                String(durasi % 60).padStart(2, '0') + '.0s), ' +
                String(vus).padStart(3, '0') + '/' + String(vus).padStart(3, '0') +
                ' VUs, ' + Math.round(vus * durasi * 0.9) + ' complete and 0 interrupted iterations', 't-dim');

            if (/--out\s+experimental-prometheus-rw/.test(args) && !s.promOk) {
                err('WARN[0001] Remote write error: server returned HTTP status 404 Not Found');
                say('   Prometheus harus dijalankan dengan --web.enable-remote-write-receiver', 't-warn');
                say('   (ketik: fix-prometheus  untuk mensimulasikan perbaikannya)', 't-dim');
            }

            ringkasan(vus, durasi);
            return;
        }

        if (cmd === 'fix-prometheus') {
            s.promOk = true;
            ok('Prometheus dijalankan ulang dengan --web.enable-remote-write-receiver. Coba jalankan k6 run lagi.');
            return;
        }

        if (/^k6\b/.test(cmd)) {
            err('Error: perintah k6 tidak dikenali simulator ini.');
            say('Ketik "help" untuk melihat daftar perintah yang didukung.', 't-dim');
            return;
        }

        err('bash: ' + cmd.split(' ')[0] + ': command not found');
        say('Ketik "help" untuk melihat perintah yang dikenali.', 't-dim');
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
