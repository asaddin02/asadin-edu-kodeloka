/* ==========================================================================
   NGINX — Platform Pembelajaran Interaktif
   ========================================================================== */

const TOPIK_SLUG = "nginx";
const TOPIK_SUB  = "reverse proxy & TLS";

const MODUL = [
{
    id: 1,
    kategori: "1 · Fondasi",
    judul: "Arsitektur & Model Proses",
    tingkat: "Dasar", durasi: "12 mnt",
    tag: ["worker", "event", "epoll", "arsitektur"],
    ringkas: "Kenapa Nginx sanggup melayani puluhan ribu koneksi dengan memori kecil, sementara server berbasis thread kewalahan.",
    isi: `
<h2>Satu Master, Beberapa Worker</h2>
<p>Nginx berjalan sebagai satu proses <strong>master</strong> dan sejumlah proses <strong>worker</strong>. Master tidak melayani permintaan sama sekali — tugasnya membaca konfigurasi, membuka port, dan mengelola worker. Worker-lah yang menangani seluruh lalu lintas.</p>

<pre>ps -ef | grep nginx

root      1234  nginx: master process /usr/sbin/nginx
www-data  1235  nginx: worker process
www-data  1236  nginx: worker process
www-data  1237  nginx: worker process
www-data  1238  nginx: worker process</pre>

<p>Master berjalan sebagai <code>root</code> karena hanya root yang boleh mengikat port di bawah 1024 (80 dan 443). Setelah port terbuka, worker diturunkan haknya menjadi pengguna biasa. Jadi kode yang benar-benar bersentuhan dengan lalu lintas internet tidak berjalan sebagai root.</p>

<h2>Kenapa Bukan Satu Thread per Koneksi</h2>
<p>Server tradisional seperti Apache dengan mode prefork memberi satu proses atau thread untuk setiap koneksi. Dengan 10.000 koneksi, itu 10.000 thread — masing-masing butuh memori stack sendiri (biasanya 1–8 MB) dan sistem menghabiskan waktu berpindah antar konteks alih-alih bekerja.</p>

<p>Nginx membalik modelnya. Setiap worker adalah proses <strong>single-thread</strong> yang menjalankan satu loop peristiwa. Loop itu bertanya ke kernel lewat <code>epoll</code> (Linux): "soket mana yang siap dibaca atau ditulis?" Kernel menjawab dengan daftar, worker melayani semuanya, lalu bertanya lagi.</p>

<div class="callout info">
    <div class="callout-judul">💡 Koneksi menganggur nyaris gratis</div>
    <p>Inilah inti keunggulannya. Koneksi yang sedang menunggu — keep-alive yang diam, klien dengan jaringan lambat, WebSocket tanpa lalu lintas — tidak memegang thread apa pun. Ia hanya satu entri deskriptor berkas di dalam <code>epoll</code>, biayanya beberapa ratus byte. Server berbasis thread membayar penuh untuk koneksi yang tidak melakukan apa-apa.</p>
</div>

<h2>Menyetel Jumlah Worker</h2>
<pre>worker_processes  auto;          # satu per inti CPU — hampir selalu benar
worker_rlimit_nofile 65535;      # batas deskriptor berkas per worker

events {
    worker_connections  4096;    # koneksi maksimum per worker
    multi_accept        on;      # terima beberapa koneksi sekaligus
}</pre>

<p>Kapasitas teoretisnya adalah <code>worker_processes × worker_connections</code>. Namun untuk reverse proxy angkanya harus dibagi dua: setiap permintaan klien memakai <em>dua</em> koneksi — satu ke klien, satu ke server hulu.</p>

<div class="callout waspada">
    <div class="callout-judul">⚠️ worker_connections tidak berguna tanpa menaikkan batas berkas</div>
    <p>Menulis <code>worker_connections 65535</code> sementara batas sistem <code>ulimit -n</code> masih 1024 tidak akan menambah kapasitas apa pun. Nginx tetap kehabisan deskriptor berkas di angka 1024 dan mencatat <code>too many open files</code> di log kesalahan. Naikkan <code>worker_rlimit_nofile</code> di konfigurasi <em>dan</em> batas di systemd unit.</p>
</div>

<h2>Menambah CPU tapi Nginx Tidak Ikut Cepat</h2>
<p>Karena worker adalah single-thread, satu worker hanya bisa memakai satu inti. Bila <code>worker_processes</code> dikunci di angka 1 pada mesin 16 inti, 15 inti lainnya menganggur meskipun beban sudah penuh. Nilai <code>auto</code> menghindari jebakan ini.</p>

<h2>Operasi Tanpa Menjatuhkan Koneksi</h2>
<pre>nginx -t                  # UJI konfigurasi — selalu sebelum reload
nginx -s reload           # muat ulang tanpa memutus koneksi
nginx -s quit             # berhenti setelah permintaan selesai
nginx -s stop             # berhenti segera</pre>

<p>Saat reload, master membaca konfigurasi baru, menjalankan worker baru dengan konfigurasi itu, lalu meminta worker lama berhenti menerima koneksi baru dan selesai melayani yang sedang berjalan. Tidak ada permintaan yang terputus — dan bila konfigurasi baru salah, master menolaknya dan worker lama tetap melayani seperti biasa.</p>`,
    perintah: [
        "nginx -t",
        "nginx -s reload",
        "nginx -V 2>&1 | tr ' ' '\\n' | grep module",
        "ps -ef | grep 'nginx:'",
        "ss -s"
    ],
    kuis: [
        {
            tanya: "Kenapa Nginx dapat melayani puluhan ribu koneksi menganggur dengan memori jauh lebih kecil daripada server satu-thread-per-koneksi?",
            opsi: [
                "Karena Nginx menutup koneksi yang menganggur secara otomatis",
                "Karena koneksi menganggur hanya berupa entri deskriptor berkas di dalam loop peristiwa, bukan thread dengan stack memori sendiri",
                "Karena Nginx menyimpan koneksi di disk, bukan di memori",
                "Karena Nginx membatasi jumlah koneksi maksimum secara ketat"
            ],
            benar: 1,
            penjelasan: "Setiap worker Nginx adalah proses single-thread yang menjalankan loop peristiwa berbasis epoll. Koneksi yang tidak melakukan apa-apa hanya menempati satu entri deskriptor berkas seharga beberapa ratus byte, dan tidak memakan waktu CPU sama sekali. Model satu-thread-per-koneksi harus mengalokasikan stack memori penuh untuk setiap koneksi, terpakai atau tidak."
        },
        {
            tanya: "Konfigurasi diubah menjadi worker_connections 65535, tetapi log kesalahan tetap menampilkan 'too many open files' pada beban tinggi. Apa yang terlewat?",
            opsi: [
                "worker_processes harus diturunkan menjadi 1",
                "Batas deskriptor berkas sistem belum dinaikkan, sehingga Nginx tetap terbentur ulimit jauh sebelum mencapai angka 65535",
                "Nginx perlu dikompilasi ulang untuk mendukung angka sebesar itu",
                "multi_accept harus dimatikan"
            ],
            benar: 1,
            penjelasan: "worker_connections hanya batas yang ditetapkan Nginx untuk dirinya sendiri; ia tidak dapat melampaui batas deskriptor berkas yang diberikan sistem operasi. Bila ulimit -n masih 1024, worker kehabisan deskriptor di angka itu. Perbaikannya adalah menaikkan worker_rlimit_nofile pada konfigurasi Nginx sekaligus LimitNOFILE pada unit systemd."
        },
        {
            tanya: "Apa yang terjadi bila 'nginx -s reload' dijalankan dengan berkas konfigurasi yang mengandung kesalahan sintaks?",
            opsi: [
                "Nginx berhenti total dan situs menjadi tidak dapat diakses",
                "Master menolak konfigurasi baru dan worker lama terus melayani dengan konfigurasi sebelumnya",
                "Nginx berjalan dengan konfigurasi kosong bawaan",
                "Semua koneksi yang sedang berjalan langsung terputus"
            ],
            benar: 1,
            penjelasan: "Proses master mem-parsing dan memvalidasi konfigurasi baru sebelum menjalankan worker baru. Bila validasi gagal, master mencatat kesalahan dan membatalkan reload — worker lama tidak tersentuh dan lalu lintas berjalan normal. Meski begitu, menjalankan nginx -t lebih dulu tetap kebiasaan yang benar agar kesalahan terlihat sebelum menyentuh proses yang sedang melayani."
        }
    ]
},
{
    id: 2,
    kategori: "1 · Fondasi",
    judul: "Struktur Konfigurasi & Konteks",
    tingkat: "Dasar", durasi: "13 mnt",
    tag: ["konfigurasi", "konteks", "direktif", "warisan"],
    ringkas: "Cara Nginx mewarisi direktif antar konteks — dan kenapa aturan warisan ini menjadi sumber kebingungan yang paling sering.",
    isi: `
<h2>Konfigurasi Berbentuk Pohon</h2>
<p>Konfigurasi Nginx tersusun dari <strong>konteks</strong> bersarang. Setiap konteks membatasi direktif mana yang boleh muncul dan bagaimana nilainya diwariskan ke bawah.</p>

<pre>main                          # tingkat paling luar
├── events { }                # penyetelan koneksi
└── http { }                  # seluruh lalu lintas HTTP
    ├── upstream { }          # kelompok server hulu
    └── server { }            # satu situs virtual
        └── location { }      # satu pola URI</pre>

<pre>user              www-data;                    # konteks main
worker_processes  auto;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    sendfile      on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  contoh.id;
        root         /var/www/contoh;

        location / {
            try_files $uri $uri/ =404;
        }
    }
}</pre>

<h2>Warisan Berjalan ke Bawah — Sampai Ditimpa</h2>
<p>Direktif yang ditulis di <code>http</code> berlaku untuk semua <code>server</code> di dalamnya, dan direktif di <code>server</code> berlaku untuk semua <code>location</code>. Menuliskan direktif yang sama di tingkat lebih dalam akan <strong>menimpa</strong> nilai warisan, bukan menambahkannya.</p>

<div class="callout bahaya">
    <div class="callout-judul">🚫 add_header berhenti diwariskan begitu ditulis ulang</div>
    <p>Ini jebakan paling terkenal di Nginx. Bila <code>add_header</code> ditulis di <code>http</code> lalu <em>satu saja</em> <code>add_header</code> ditulis di dalam sebuah <code>location</code>, maka <strong>seluruh</strong> header dari tingkat atas hilang untuk location tersebut — bukan digabung. Header keamanan diam-diam lenyap tepat di endpoint yang paling perlu.</p>
    <pre>http {
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;

    server {
        location /api/ {
            add_header X-Custom nilai;   # dua header di atas HILANG di sini
        }
    }
}

# Solusi 1 — ulangi seluruh header di konteks dalam
# Solusi 2 — pakai always dan letakkan semua di satu tingkat
# Solusi 3 — Nginx modern: gunakan modul headers-more</pre>
</div>

<h2>Urutan Pemilihan Location</h2>
<p>Nginx tidak membaca blok <code>location</code> dari atas ke bawah begitu saja. Urutannya sudah ditentukan:</p>

<pre>location = /tepat        { }   # 1. sama persis — menang mutlak, berhenti
location ^~ /awalan/     { }   # 2. awalan prioritas — berhenti bila cocok
location ~  /regex/      { }   # 3. regex peka huruf besar-kecil, urut tulisan
location ~* /regex/i     { }   # 3. regex abaikan huruf besar-kecil
location /   awalan      { }   # 4. awalan terpanjang — cadangan terakhir</pre>

<p>Alurnya: Nginx mencari kecocokan tepat lebih dulu. Bila tidak ada, ia mencatat awalan terpanjang yang cocok, lalu mencoba semua regex <em>berurutan sesuai penulisan</em> dan memakai regex pertama yang cocok. Bila tidak ada regex yang cocok, barulah awalan terpanjang tadi dipakai.</p>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Regex mengalahkan awalan, berapa pun panjangnya</div>
    <p>Blok <code>location ~ \\.php$</code> akan menang atas <code>location /aplikasi/berkas/</code> untuk permintaan ke <code>/aplikasi/berkas/data.php</code>, meskipun awalannya jauh lebih spesifik. Bila sebuah awalan harus dilindungi dari regex, tandai dengan <code>^~</code> supaya pencarian berhenti begitu awalan itu cocok.</p>
</div>

<h2>Slash di Akhir root dan alias</h2>
<pre>location /gambar/ {
    root /data;              # /gambar/logo.png → /data/gambar/logo.png
}                            # root MENAMBAHKAN URI ke path

location /gambar/ {
    alias /data/berkas/;     # /gambar/logo.png → /data/berkas/logo.png
}                            # alias MENGGANTI bagian location</pre>

<div class="callout info">
    <div class="callout-judul">💡 Aturan slash pada alias</div>
    <p>Bila <code>location</code> diakhiri slash, <code>alias</code> juga <strong>harus</strong> diakhiri slash. Bila tidak, path yang terbentuk akan salah dan sulit dilacak karena tidak memunculkan kesalahan sintaks — hanya 404 yang membingungkan.</p>
</div>`,
    perintah: [
        "nginx -T | less",
        "nginx -t -c /etc/nginx/nginx.conf",
        "nginx -T | grep -n 'add_header'",
        "curl -I https://contoh.id/api/",
        "nginx -T | grep -c 'server_name'"
    ],
    kuis: [
        {
            tanya: "Header keamanan ditetapkan di konteks http, tetapi hilang pada satu location yang punya add_header sendiri. Kenapa?",
            opsi: [
                "Karena header keamanan hanya berlaku untuk permintaan HTTPS",
                "Karena add_header tidak digabung — menulisnya di konteks lebih dalam menimpa seluruh add_header warisan dari tingkat atas",
                "Karena Nginx membatasi jumlah header maksimum tiga",
                "Karena header perlu ditandai dengan direktif include"
            ],
            benar: 1,
            penjelasan: "Direktif add_header pada Nginx bersifat menimpa, bukan menambah. Begitu sebuah konteks memiliki add_header sendiri, seluruh add_header dari konteks induk tidak lagi diterapkan pada konteks itu. Semua header yang dibutuhkan harus diulang di tingkat terdalam, atau dikelola lewat modul headers-more."
        },
        {
            tanya: "Permintaan ke /aplikasi/berkas/data.php cocok dengan 'location /aplikasi/berkas/' dan 'location ~ \\.php$'. Mana yang dipakai?",
            opsi: [
                "location /aplikasi/berkas/ karena awalannya lebih panjang dan lebih spesifik",
                "location ~ \\.php$ karena regex dievaluasi lebih dulu dan menang atas kecocokan awalan biasa",
                "Keduanya dijalankan berurutan",
                "Nginx menolak konfigurasi karena ambigu"
            ],
            benar: 1,
            penjelasan: "Setelah mencatat awalan terpanjang yang cocok, Nginx mencoba seluruh blok regex sesuai urutan penulisan. Regex pertama yang cocok langsung dipakai dan awalan tadi diabaikan, seberapa pun spesifiknya. Untuk melindungi sebuah awalan dari regex, gunakan penanda ^~ agar pencarian berhenti pada awalan tersebut."
        },
        {
            tanya: "Apa beda perlakuan root dan alias terhadap URI permintaan?",
            opsi: [
                "Keduanya sama, alias hanya nama lama dari root",
                "root menambahkan seluruh URI ke path yang ditulis, sedangkan alias mengganti bagian URI yang cocok dengan location",
                "root hanya untuk berkas statis, alias hanya untuk proxy",
                "alias tidak boleh dipakai di dalam location"
            ],
            benar: 1,
            penjelasan: "Dengan root /data pada location /gambar/, permintaan /gambar/logo.png dipetakan ke /data/gambar/logo.png karena URI ditambahkan utuh. Dengan alias /data/berkas/, bagian /gambar/ digantikan sehingga hasilnya /data/berkas/logo.png. Perbedaan ini penting saat path direktori sesungguhnya tidak mencerminkan struktur URL."
        }
    ]
},
{
    id: 3,
    kategori: "2 · Reverse Proxy",
    judul: "Reverse Proxy & Header",
    tingkat: "Menengah", durasi: "14 mnt",
    tag: ["proxy_pass", "header", "X-Forwarded-For", "hulu"],
    ringkas: "Meneruskan permintaan ke aplikasi di belakang, dan memastikan aplikasi itu tahu siapa klien aslinya.",
    isi: `
<h2>Bentuk Paling Sederhana</h2>
<pre>server {
    listen 80;
    server_name api.contoh.id;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}</pre>

<h2>Kenapa Header Itu Wajib</h2>
<p>Begitu Nginx berdiri di depan aplikasi, aplikasi kehilangan seluruh konteks tentang klien. Yang dilihatnya hanyalah koneksi dari <code>127.0.0.1</code> melalui HTTP biasa. Empat header di atas mengembalikan konteks yang hilang itu.</p>

<pre>$host                        # nama host yang diminta klien
$remote_addr                 # alamat IP klien
$proxy_add_x_forwarded_for   # rantai X-Forwarded-For + IP klien
$scheme                      # http atau https di sisi klien</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Tanpa X-Forwarded-Proto, aplikasi terjebak lingkaran pengalihan</div>
    <p>Aplikasi yang memaksa HTTPS melihat koneksi masuk sebagai <code>http</code> — karena memang begitu antara Nginx dan aplikasi. Ia lalu mengalihkan ke <code>https://</code>, permintaan kembali ke Nginx, diteruskan lagi sebagai HTTP, dan dialihkan lagi. Peramban akhirnya menyerah dengan <code>ERR_TOO_MANY_REDIRECTS</code>. Header ini memberi tahu aplikasi bahwa klien sudah memakai HTTPS.</p>
</div>

<h2>Slash di Akhir proxy_pass Mengubah Segalanya</h2>
<pre>location /api/ {
    proxy_pass http://backend;       # TANPA slash
}
# /api/pengguna  →  http://backend/api/pengguna   (path utuh)

location /api/ {
    proxy_pass http://backend/;      # DENGAN slash
}
# /api/pengguna  →  http://backend/pengguna       (/api/ dipotong)</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Satu karakter, dua perilaku yang berbeda total</div>
    <p>Bila <code>proxy_pass</code> berisi path apa pun — termasuk hanya <code>/</code> — Nginx mengganti bagian URI yang cocok dengan <code>location</code>. Bila hanya berisi host dan port, URI diteruskan apa adanya. Ini penyebab umum aplikasi hulu menerima path ganda seperti <code>/api/api/pengguna</code>.</p>
</div>

<h2>Batas Waktu yang Perlu Disetel</h2>
<pre>proxy_connect_timeout   5s;     # membuka koneksi ke hulu
proxy_send_timeout      60s;    # mengirim permintaan ke hulu
proxy_read_timeout      60s;    # menunggu balasan dari hulu

proxy_buffering         on;
proxy_buffer_size       4k;
proxy_buffers           8 4k;</pre>

<p><code>proxy_connect_timeout</code> sebaiknya pendek — bila hulu tidak menjawab jabat tangan dalam 5 detik, ia memang sedang bermasalah dan menunggu lebih lama hanya menahan worker. Sebaliknya <code>proxy_read_timeout</code> harus mengikuti permintaan terlama yang wajar di aplikasi.</p>

<h2>Buffering: Perisai untuk Klien Lambat</h2>
<p>Dengan <code>proxy_buffering on</code>, Nginx membaca balasan dari hulu secepat mungkin, menyimpannya, lalu menyuapkan pelan-pelan ke klien. Aplikasi hulu dibebaskan setelah beberapa milidetik, bukan menunggu klien di jaringan lambat selesai mengunduh.</p>

<div class="callout info">
    <div class="callout-judul">💡 Kapan buffering justru harus dimatikan</div>
    <p>Untuk Server-Sent Events, streaming log, atau balasan bertahap, buffering menahan data sampai penuh sehingga klien seolah tidak menerima apa-apa. Matikan hanya pada location tersebut, bukan secara global.</p>
    <pre>location /stream/ {
    proxy_pass http://backend;
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 24h;
}</pre>
</div>

<h2>WebSocket</h2>
<pre>map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

location /ws/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade    $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_read_timeout 3600s;
}</pre>

<p>Blok <code>map</code> diperlukan supaya header <code>Connection</code> hanya bernilai <code>upgrade</code> ketika permintaan memang ingin naik ke WebSocket, dan <code>close</code> untuk permintaan HTTP biasa yang melewati location yang sama.</p>`,
    perintah: [
        "curl -I -H 'Host: api.contoh.id' http://127.0.0.1/",
        "curl -v --http1.1 -H 'Upgrade: websocket' http://contoh.id/ws/",
        "nginx -T | grep -A5 proxy_pass",
        "tail -f /var/log/nginx/error.log",
        "curl -w '%{time_total}\\n' -o /dev/null -s https://api.contoh.id/"
    ],
    kuis: [
        {
            tanya: "Aplikasi di belakang Nginx menghasilkan ERR_TOO_MANY_REDIRECTS setelah HTTPS diaktifkan. Header apa yang paling mungkin belum diteruskan?",
            opsi: [
                "Host, karena aplikasi tidak tahu nama domainnya",
                "X-Forwarded-Proto, karena aplikasi melihat koneksi sebagai HTTP lalu terus mengalihkan ke HTTPS berulang kali",
                "X-Real-IP, karena aplikasi memblokir alamat lokal",
                "User-Agent, karena aplikasi menolak permintaan tanpa identitas peramban"
            ],
            benar: 1,
            penjelasan: "TLS berhenti di Nginx, sehingga koneksi antara Nginx dan aplikasi berupa HTTP biasa. Aplikasi yang memaksa HTTPS melihat $scheme sebagai http dan mengeluarkan pengalihan, yang kembali lagi melalui Nginx sebagai HTTP — berputar tanpa henti. proxy_set_header X-Forwarded-Proto $scheme memberi tahu aplikasi protokol asli yang dipakai klien."
        },
        {
            tanya: "Hulu menerima path /api/api/pengguna padahal klien meminta /api/pengguna. Apa penyebabnya?",
            opsi: [
                "Aplikasi hulu salah mengonfigurasi rutenya",
                "proxy_pass ditulis tanpa slash di akhir sehingga URI diteruskan utuh, lalu hulu menambahkan prefiksnya sendiri",
                "Nginx selalu menggandakan path pada reverse proxy",
                "location harus ditulis dengan tanda ^~"
            ],
            benar: 1,
            penjelasan: "Bila proxy_pass hanya berisi host dan port tanpa path, Nginx meneruskan URI permintaan secara utuh termasuk /api/. Bila hulu juga sudah memasang prefiks /api pada rutenya, hasilnya path ganda. Menambahkan slash — proxy_pass http://backend/ — membuat Nginx memotong bagian yang cocok dengan location."
        },
        {
            tanya: "Endpoint Server-Sent Events tidak mengirimkan apa pun ke klien sampai koneksi ditutup. Apa penyebab paling mungkin?",
            opsi: [
                "proxy_read_timeout terlalu besar",
                "proxy_buffering aktif sehingga Nginx menahan balasan bertahap hingga buffer penuh atau koneksi selesai",
                "Header Upgrade belum diteruskan",
                "Hulu tidak mendukung HTTP/1.1"
            ],
            benar: 1,
            penjelasan: "Buffering dirancang untuk membebaskan hulu dari klien lambat, tetapi pada balasan streaming justru menahan data yang seharusnya mengalir sedikit demi sedikit. Untuk location SSE atau streaming, setel proxy_buffering off beserta proxy_cache off, dan naikkan proxy_read_timeout agar koneksi panjang tidak diputus."
        }
    ]
},
{
    id: 4,
    kategori: "2 · Reverse Proxy",
    judul: "Upstream & Penyeimbang Beban",
    tingkat: "Menengah", durasi: "13 mnt",
    tag: ["upstream", "load balancing", "keepalive", "health"],
    ringkas: "Membagi beban ke beberapa server hulu, dan menyingkirkan yang bermasalah tanpa menjatuhkan permintaan.",
    isi: `
<h2>Blok upstream</h2>
<pre>upstream backend {
    server 10.0.1.10:3000  weight=3;
    server 10.0.1.11:3000  weight=1;
    server 10.0.1.12:3000  backup;

    keepalive 32;
}

server {
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }
}</pre>

<h2>Metode Pembagian Beban</h2>
<pre>upstream backend {
    # round robin — bawaan, tanpa perlu ditulis
    server a:3000;
    server b:3000;
}

upstream backend {
    least_conn;              # ke server dengan koneksi aktif paling sedikit
    server a:3000;
}

upstream backend {
    ip_hash;                 # klien yang sama selalu ke server yang sama
    server a:3000;
}

upstream backend {
    hash $request_uri consistent;   # berdasarkan URI, cocok untuk cache
    server a:3000;
}</pre>

<p><code>least_conn</code> biasanya pilihan paling aman ketika durasi permintaan bervariasi — round robin membagi rata jumlah permintaan, bukan beban sesungguhnya, sehingga satu server bisa menumpuk permintaan berat sementara yang lain menganggur.</p>

<div class="callout waspada">
    <div class="callout-judul">⚠️ ip_hash bukan pengganti sesi bersama</div>
    <p><code>ip_hash</code> sering dipakai agar sesi login tetap menempel di satu server. Masalahnya: menambah atau menghapus satu server mengubah pemetaan untuk sebagian besar klien sehingga sesi hilang serentak. Klien di belakang NAT perusahaan juga menumpuk ke satu server yang sama. Menyimpan sesi di Redis jauh lebih tahan banting.</p>
</div>

<h2>keepalive: Penyetelan Kecil, Dampak Besar</h2>
<p>Tanpa <code>keepalive</code>, Nginx membuka koneksi TCP baru ke hulu untuk setiap permintaan lalu menutupnya. Pada lalu lintas tinggi, biaya jabat tangan TCP dan port yang menumpuk di keadaan <code>TIME_WAIT</code> menjadi hambatan nyata.</p>

<div class="callout bahaya">
    <div class="callout-judul">🚫 keepalive tidak bekerja tanpa dua baris pendamping</div>
    <p>Menulis <code>keepalive 32</code> saja tidak cukup. Nginx berbicara HTTP/1.0 ke hulu secara bawaan dan tetap mengirim header <code>Connection: close</code>. Dua direktif ini wajib menyertainya:</p>
    <pre>proxy_http_version 1.1;
proxy_set_header Connection "";</pre>
    <p>Tanpa keduanya, angka <code>keepalive</code> tidak berpengaruh sama sekali dan koneksi tetap dibuat-tutup setiap permintaan.</p>
</div>

<h2>Menyingkirkan Server Bermasalah</h2>
<pre>upstream backend {
    server 10.0.1.10:3000 max_fails=3 fail_timeout=30s;
    server 10.0.1.11:3000 max_fails=3 fail_timeout=30s;
}</pre>

<p>Ini pemeriksaan <em>pasif</em>: setelah 3 kegagalan dalam rentang 30 detik, server ditandai tidak sehat dan dilewati selama 30 detik berikutnya, lalu dicoba lagi. Nginx sumber terbuka tidak memiliki pemeriksaan aktif — fitur itu hanya ada pada Nginx Plus atau modul pihak ketiga.</p>

<h2>Mengulang ke Server Lain</h2>
<pre>proxy_next_upstream error timeout http_502 http_503;
proxy_next_upstream_tries   2;
proxy_next_upstream_timeout 10s;</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Jangan pernah menambahkan non_idempotent tanpa berpikir panjang</div>
    <p>Secara bawaan Nginx tidak mengulang permintaan <code>POST</code>, <code>PATCH</code>, atau <code>LOCK</code> ke server lain — dan itu disengaja. Bila hulu sudah menerima serta memproses <code>POST /pembayaran</code> lalu gagal saat mengirim balasan, mengulangnya ke server lain berarti pembayaran diproses dua kali. Menambahkan <code>non_idempotent</code> hanya aman bila endpoint benar-benar melindungi diri dengan kunci idempoten.</p>
</div>

<h2>Resolusi DNS yang Berubah</h2>
<pre>resolver 10.0.0.2 valid=30s ipv6=off;

location / {
    set $hulu "layanan.internal:3000";
    proxy_pass http://$hulu;
}</pre>

<div class="callout info">
    <div class="callout-judul">💡 Nginx menahan hasil DNS selamanya bila host ditulis langsung</div>
    <p>Nama host di dalam <code>proxy_pass</code> diselesaikan <strong>sekali</strong> saat startup dan tidak pernah diperiksa lagi. Di Kubernetes atau lingkungan dengan IP yang berpindah, Nginx akan terus mengirim ke alamat yang sudah mati sampai di-reload. Memakai variabel memaksa Nginx menyelesaikan DNS saat permintaan datang, mengikuti <code>valid=</code> pada <code>resolver</code>.</p>
</div>`,
    perintah: [
        "nginx -T | grep -A8 'upstream '",
        "ss -tan state time-wait | wc -l",
        "curl -s -o /dev/null -w '%{http_code}\\n' http://contoh.id/ ",
        "watch -n1 \"ss -tn state established '( dport = :3000 )' | wc -l\"",
        "nginx -s reload"
    ],
    kuis: [
        {
            tanya: "Direktif 'keepalive 32' sudah ditambahkan di blok upstream, tetapi koneksi ke hulu tetap dibuat dan ditutup setiap permintaan. Apa yang kurang?",
            opsi: [
                "Nilai keepalive terlalu kecil, harus dinaikkan",
                "proxy_http_version 1.1 dan proxy_set_header Connection \"\" belum ditambahkan, sehingga Nginx tetap memakai HTTP/1.0 dengan Connection: close",
                "keepalive hanya bekerja pada metode least_conn",
                "Hulu harus memakai HTTPS agar keepalive aktif"
            ],
            benar: 1,
            penjelasan: "Nginx berbicara HTTP/1.0 ke hulu secara bawaan dan menyertakan Connection: close, yang membuat koneksi selalu ditutup setelah satu permintaan. Kumpulan keepalive baru berfungsi bila proxy_http_version dinaikkan ke 1.1 dan header Connection dikosongkan agar tidak diteruskan."
        },
        {
            tanya: "Kenapa Nginx tidak mengulang permintaan POST ke server hulu lain secara bawaan?",
            opsi: [
                "Karena POST membutuhkan waktu lebih lama daripada GET",
                "Karena hulu mungkin sudah memproses permintaan itu sebelum gagal membalas, sehingga pengulangan dapat menyebabkan operasi terjadi dua kali",
                "Karena POST tidak dapat dibaca ulang dari buffer",
                "Karena standar HTTP melarang proxy meneruskan POST"
            ],
            benar: 1,
            penjelasan: "Kegagalan bisa terjadi setelah hulu menerima dan menjalankan permintaan, hanya balasannya yang tidak sampai. Mengulang POST /pembayaran ke server lain berarti pembayaran diproses dua kali. Karena itu pengulangan metode non-idempoten dimatikan secara bawaan, dan opsi non_idempotent hanya aman bila endpoint memakai kunci idempoten."
        },
        {
            tanya: "Sebuah layanan hulu berpindah IP di Kubernetes, tetapi Nginx terus mengirim ke alamat lama sampai di-reload. Kenapa?",
            opsi: [
                "Karena Nginx menyimpan cache balasan hulu",
                "Karena nama host yang ditulis langsung di proxy_pass hanya diselesaikan sekali saat startup dan tidak pernah diperiksa ulang",
                "Karena resolver bawaan Nginx tidak mendukung DNS internal",
                "Karena upstream perlu memakai ip_hash"
            ],
            benar: 1,
            penjelasan: "Nginx menyelesaikan nama host statis di proxy_pass pada saat memuat konfigurasi dan menyimpan hasilnya selamanya. Untuk lingkungan dengan IP yang berpindah, letakkan alamat hulu dalam variabel dan tetapkan direktif resolver dengan valid= agar Nginx menyelesaikan DNS saat permintaan datang dan mengikuti perubahan."
        }
    ]
},
{
    id: 5,
    kategori: "3 · TLS & Keamanan",
    judul: "TLS, Sertifikat & HTTPS",
    tingkat: "Menengah", durasi: "14 mnt",
    tag: ["TLS", "sertifikat", "HSTS", "SNI"],
    ringkas: "Menyiapkan HTTPS yang benar: rantai sertifikat, versi protokol, dan pengalihan yang tidak menjebak.",
    isi: `
<h2>Konfigurasi Dasar</h2>
<pre>server {
    listen 443 ssl;
    http2  on;                       # Nginx 1.25+, sebelumnya: listen 443 ssl http2
    server_name contoh.id;

    ssl_certificate     /etc/letsencrypt/live/contoh.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/contoh.id/privkey.pem;

    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers         ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;

    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
}</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 fullchain.pem, bukan cert.pem</div>
    <p>Kesalahan yang sangat sering terjadi dan sulit dikenali. Dengan <code>cert.pem</code>, peramban desktop tetap bekerja karena sudah menyimpan sertifikat perantara dari kunjungan sebelumnya — sementara klien API, aplikasi seluler, dan <code>curl</code> gagal dengan <code>unable to verify the first certificate</code>. Situs tampak "baik-baik saja" di layar, tetapi rusak bagi separuh klien.</p>
    <pre>openssl s_client -connect contoh.id:443 -servername contoh.id &lt; /dev/null
# Periksa bagian "Certificate chain" — harus memuat lebih dari satu sertifikat</pre>
</div>

<h2>Pengalihan HTTP ke HTTPS</h2>
<pre>server {
    listen 80;
    server_name contoh.id www.contoh.id;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;       # biarkan validasi ACME lewat
    }

    location / {
        return 301 https://$host$request_uri;
    }
}</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Jangan mengalihkan seluruh port 80 tanpa pengecualian</div>
    <p>Validasi HTTP-01 dari Let's Encrypt harus dapat menjangkau <code>/.well-known/acme-challenge/</code> melalui HTTP biasa. Bila seluruh port 80 dialihkan tanpa pengecualian, perpanjangan sertifikat gagal secara diam-diam — dan baru ketahuan sembilan puluh hari kemudian ketika sertifikat kedaluwarsa.</p>
</div>

<h2>HSTS</h2>
<pre>add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 HSTS tidak bisa ditarik kembali</div>
    <p>Setelah peramban menerima header ini, ia menolak terhubung melalui HTTP ke domain tersebut selama <code>max-age</code> — bahkan bila Nginx sudah diperbaiki. Dengan <code>includeSubDomains</code>, aturan itu berlaku pula untuk semua subdomain, termasuk yang belum punya sertifikat. Mulailah dengan <code>max-age=300</code>, pastikan seluruh subdomain siap, baru naikkan ke setahun.</p>
</div>

<h2>server_name Bawaan dan SNI</h2>
<pre>server {
    listen 443 ssl default_server;
    server_name _;

    ssl_certificate     /etc/nginx/ssl/bawaan.pem;
    ssl_certificate_key /etc/nginx/ssl/bawaan.key;

    return 444;                      # tutup koneksi tanpa balasan
}</pre>

<p>Tanpa <code>default_server</code>, blok server pertama yang mendengarkan di port itu menjadi bawaan. Permintaan ke IP langsung atau ke domain asing yang diarahkan ke server ini akan mendapat sertifikat dan konten situs pertama — sering kali bukan yang diinginkan. Kode <code>444</code> khusus Nginx menutup koneksi tanpa mengirim apa pun.</p>

<h2>OCSP Stapling</h2>
<pre>ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/letsencrypt/live/contoh.id/chain.pem;
resolver 1.1.1.1 8.8.8.8 valid=300s;</pre>

<p>Tanpa stapling, peramban menghubungi penerbit sertifikat sendiri untuk memeriksa status pencabutan — menambah satu perjalanan jaringan pada setiap kunjungan pertama. Dengan stapling, Nginx mengambil bukti itu berkala dan menyertakannya langsung dalam jabat tangan.</p>

<div class="callout info">
    <div class="callout-judul">💡 Stapling butuh resolver</div>
    <p>Nginx harus dapat menyelesaikan nama host penanggap OCSP. Bila direktif <code>resolver</code> tidak ada, stapling gagal diam-diam dan hanya tercatat sebagai peringatan di log kesalahan.</p>
</div>`,
    perintah: [
        "openssl s_client -connect contoh.id:443 -servername contoh.id < /dev/null",
        "openssl x509 -in fullchain.pem -noout -dates",
        "curl -sI https://contoh.id | grep -i strict",
        "certbot renew --dry-run",
        "openssl s_client -connect contoh.id:443 -status < /dev/null | grep -A3 'OCSP Response'"
    ],
    kuis: [
        {
            tanya: "Situs terbuka normal di peramban desktop, tetapi curl dan aplikasi seluler gagal dengan 'unable to verify the first certificate'. Apa penyebabnya?",
            opsi: [
                "Sertifikat sudah kedaluwarsa",
                "ssl_certificate menunjuk ke cert.pem sehingga sertifikat perantara tidak dikirim; peramban menutupinya dari cache, klien lain tidak",
                "Versi TLS terlalu baru untuk klien tersebut",
                "OCSP stapling belum diaktifkan"
            ],
            benar: 1,
            penjelasan: "Rantai sertifikat harus dikirim lengkap oleh server. Peramban desktop sering sudah menyimpan sertifikat perantara dari situs lain sehingga tetap berhasil memvalidasi, menyembunyikan kesalahan ini. Klien tanpa cache seperti curl langsung gagal. Perbaikannya adalah menunjuk ssl_certificate ke fullchain.pem yang memuat sertifikat daun beserta perantaranya."
        },
        {
            tanya: "Perpanjangan sertifikat Let's Encrypt gagal setelah seluruh lalu lintas port 80 dialihkan ke HTTPS. Kenapa?",
            opsi: [
                "Let's Encrypt hanya bekerja melalui HTTPS",
                "Validasi HTTP-01 perlu mengakses /.well-known/acme-challenge/ melalui HTTP biasa, dan pengalihan menyeluruh memutus jalur itu",
                "Pengalihan 301 tidak didukung ACME",
                "Sertifikat perlu dihapus dulu sebelum diperpanjang"
            ],
            benar: 1,
            penjelasan: "Penantang HTTP-01 mengambil berkas bukti kepemilikan melalui HTTP pada port 80. Bila location / mengembalikan 301 untuk semua path, permintaan itu ikut dialihkan dan validasi gagal. Sisakan satu blok location untuk /.well-known/acme-challenge/ yang menyajikan berkas dari direktori webroot sebelum aturan pengalihan."
        },
        {
            tanya: "Apa risiko utama memasang HSTS dengan max-age satu tahun dan includeSubDomains sejak awal?",
            opsi: [
                "Situs menjadi lebih lambat karena header tambahan",
                "Peramban akan menolak koneksi HTTP ke domain dan seluruh subdomainnya selama setahun, termasuk subdomain yang belum punya sertifikat, dan ini tidak dapat dibatalkan dari sisi server",
                "Sertifikat akan kedaluwarsa lebih cepat",
                "HTTP/2 tidak dapat diaktifkan bersamaan"
            ],
            benar: 1,
            penjelasan: "HSTS disimpan di sisi peramban. Setelah diterima, peramban menolak HTTP untuk domain itu sampai max-age berakhir, dan menghapus headernya di server tidak membatalkan yang sudah tersimpan. Dengan includeSubDomains, subdomain internal yang belum siap HTTPS ikut menjadi tidak dapat diakses. Praktik amannya memulai dari max-age kecil lalu menaikkannya bertahap."
        }
    ]
},
{
    id: 6,
    kategori: "3 · TLS & Keamanan",
    judul: "Pembatasan Laju & Perlindungan",
    tingkat: "Menengah", durasi: "12 mnt",
    tag: ["rate limit", "burst", "conn limit", "buffer"],
    ringkas: "Melindungi hulu dari lonjakan, penyalahgunaan, dan permintaan berukuran ganjil — dengan algoritma yang perlu dipahami dulu.",
    isi: `
<h2>Membatasi Laju Permintaan</h2>
<pre>http {
    limit_req_zone $binary_remote_addr zone=umum:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=masuk:10m rate=5r/m;

    server {
        location / {
            limit_req zone=umum burst=20 nodelay;
        }

        location /login {
            limit_req zone=masuk burst=3;
            limit_req_status 429;
        }
    }
}</pre>

<p><code>$binary_remote_addr</code> dipakai alih-alih <code>$remote_addr</code> karena bentuk binernya hanya 4 byte untuk IPv4, bukan belasan byte sebagai teks. Zona 10 MB dengan demikian sanggup melacak sekitar 160.000 alamat.</p>

<h2>Ember Bocor dan Arti burst</h2>
<p>Nginx memakai algoritma <em>leaky bucket</em>. Dengan <code>rate=10r/s</code>, Nginx tidak menghitung "10 permintaan per detik" melainkan memaksa jarak <strong>100 milidetik</strong> antar permintaan. Permintaan kesebelas dalam satu detik yang sama langsung ditolak dengan 503.</p>

<pre>limit_req zone=umum;                    # kaku — tanpa toleransi sama sekali
limit_req zone=umum burst=20;           # 20 boleh mengantre, dilayani berjarak
limit_req zone=umum burst=20 nodelay;   # 20 boleh langsung, kuota diisi ulang</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ burst tanpa nodelay membuat halaman terasa macet</div>
    <p>Satu halaman web memuat puluhan aset sekaligus. Dengan <code>burst=20</code> tanpa <code>nodelay</code>, permintaan tidak ditolak tetapi <em>diantrekan</em> dan dilepas satu per 100 ms — aset ke-20 baru sampai dua detik kemudian. Pengguna melihat halaman yang termuat merangkak. Menambahkan <code>nodelay</code> melayani lonjakan itu segera sementara laju rata-rata tetap terjaga.</p>
</div>

<h2>Membatasi Koneksi Serentak</h2>
<pre>limit_conn_zone $binary_remote_addr zone=perip:10m;
limit_conn_zone $server_name         zone=persrv:10m;

location /unduh/ {
    limit_conn perip   3;
    limit_conn persrv  100;
    limit_rate_after   10m;      # 10 MB pertama penuh
    limit_rate         500k;     # sesudahnya dibatasi
}</pre>

<h2>Batas Ukuran dan Waktu</h2>
<pre>client_max_body_size    10m;     # tolak unggahan lebih besar
client_body_timeout     12s;
client_header_timeout   12s;
client_body_buffer_size 16k;
large_client_header_buffers 4 8k;

send_timeout            10s;
keepalive_timeout       65s;</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 413 Request Entity Too Large di tengah unggahan</div>
    <p>Nilai bawaan <code>client_max_body_size</code> hanya <strong>1 MB</strong>. Unggahan foto biasa langsung ditolak, dan kesalahannya muncul di Nginx sebelum permintaan pernah sampai ke aplikasi — sehingga penanganan kesalahan di aplikasi tidak pernah berjalan dan log aplikasi tampak bersih. Selalu periksa nilai ini lebih dulu saat unggahan gagal tanpa jejak.</p>
</div>

<h2>Menyembunyikan Informasi Versi</h2>
<pre>server_tokens off;                       # sembunyikan versi di header dan halaman galat

proxy_hide_header X-Powered-By;
proxy_hide_header X-AspNet-Version;

add_header X-Frame-Options           "SAMEORIGIN" always;
add_header X-Content-Type-Options    "nosniff"    always;
add_header Referrer-Policy           "strict-origin-when-cross-origin" always;</pre>

<div class="callout info">
    <div class="callout-judul">💡 Kenapa <code>always</code> penting</div>
    <p>Tanpa <code>always</code>, <code>add_header</code> hanya diterapkan pada balasan sukses — 200, 201, 301, 304. Balasan galat seperti 404 dan 500 keluar <em>tanpa</em> header keamanan tersebut. Karena halaman galat juga dapat dieksploitasi untuk clickjacking atau sniffing tipe konten, tambahkan <code>always</code> pada seluruh header keamanan.</p>
</div>

<h2>Menyaring Berdasarkan Alamat</h2>
<pre>location /admin/ {
    allow 10.0.0.0/8;
    allow 192.168.1.0/24;
    deny  all;
}</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Di belakang CDN, $remote_addr adalah alamat CDN</div>
    <p>Aturan <code>allow</code> dan <code>deny</code> membaca <code>$remote_addr</code>. Bila Nginx berdiri di belakang Cloudflare atau penyeimbang beban, nilai itu adalah IP perantara — sehingga aturan menyaring hal yang salah dan pembatasan laju menghitung seluruh dunia sebagai satu klien. Konfigurasikan <code>set_real_ip_from</code> beserta <code>real_ip_header</code> lebih dulu.</p>
    <pre>set_real_ip_from 173.245.48.0/20;
real_ip_header   CF-Connecting-IP;
real_ip_recursive on;</pre>
</div>`,
    perintah: [
        "ab -n 200 -c 20 https://contoh.id/",
        "grep 'limiting requests' /var/log/nginx/error.log",
        "curl -sI https://contoh.id/login -o /dev/null -w '%{http_code}\\n'",
        "nginx -T | grep -E 'limit_req|limit_conn'",
        "curl -sI https://contoh.id/tidak-ada | grep -i x-frame"
    ],
    kuis: [
        {
            tanya: "Dengan 'limit_req zone=umum burst=20' tanpa nodelay, halaman yang memuat 20 aset terasa sangat lambat meski tidak ada permintaan yang ditolak. Kenapa?",
            opsi: [
                "Karena setiap aset diperiksa ulang terhadap zona memori",
                "Karena permintaan dalam burst diantrekan dan dilepas sesuai laju, sehingga aset terakhir baru dilayani beberapa detik kemudian",
                "Karena burst memaksa koneksi baru untuk setiap aset",
                "Karena zona 10m terlalu kecil untuk 20 permintaan"
            ],
            benar: 1,
            penjelasan: "Tanpa nodelay, burst berfungsi sebagai antrean: permintaan berlebih tidak ditolak tetapi ditahan dan dilepas mengikuti laju yang ditetapkan. Pada rate=10r/s berarti satu permintaan tiap 100 ms, sehingga permintaan ke-20 menunggu sekitar dua detik. Menambahkan nodelay melayani lonjakan itu seketika sambil tetap menjaga laju rata-rata jangka panjang."
        },
        {
            tanya: "Unggahan berkas 5 MB gagal dengan 413 dan tidak ada jejak apa pun di log aplikasi. Apa penyebabnya?",
            opsi: [
                "Aplikasi hulu menolak berkas besar tanpa mencatat log",
                "client_max_body_size bawaan Nginx hanya 1 MB, sehingga Nginx menolak permintaan sebelum diteruskan ke aplikasi",
                "proxy_read_timeout terlampaui saat mengunggah",
                "Berkas melebihi kapasitas buffer TLS"
            ],
            benar: 1,
            penjelasan: "Nginx memeriksa ukuran badan permintaan sendiri dan menolaknya dengan 413 sebelum meneruskan apa pun ke hulu. Karena permintaan tidak pernah sampai, log aplikasi bersih dan masalahnya tampak misterius. Naikkan client_max_body_size pada konteks http, server, atau location yang menangani unggahan."
        },
        {
            tanya: "Nginx berada di belakang CDN, dan pembatasan laju per-IP tampak menghitung seluruh pengunjung sebagai satu klien. Apa yang harus diperbaiki?",
            opsi: [
                "Perbesar ukuran zona limit_req_zone",
                "Konfigurasikan set_real_ip_from dan real_ip_header agar $binary_remote_addr berisi IP klien asli, bukan IP node CDN",
                "Ganti kunci zona menjadi $server_name",
                "Naikkan nilai burst agar cukup untuk semua pengunjung"
            ],
            benar: 1,
            penjelasan: "Di belakang CDN atau penyeimbang beban, $remote_addr berisi alamat perantara sehingga seluruh lalu lintas terlihat berasal dari sedikit IP. Modul real_ip menulis ulang nilai itu dari header yang dikirim CDN, misalnya CF-Connecting-IP atau X-Forwarded-For, sesudah memastikan pengirimnya termasuk rentang tepercaya pada set_real_ip_from."
        }
    ]
},
{
    id: 7,
    kategori: "4 · Kinerja",
    judul: "Caching & Penyajian Statis",
    tingkat: "Lanjut", durasi: "14 mnt",
    tag: ["cache", "gzip", "sendfile", "stale"],
    ringkas: "Menyimpan balasan hulu, menyajikan berkas statis secara efisien, dan tetap melayani saat hulu tumbang.",
    isi: `
<h2>Cache Proxy</h2>
<pre>http {
    proxy_cache_path /var/cache/nginx
                     levels=1:2
                     keys_zone=zonaku:10m
                     max_size=10g
                     inactive=60m
                     use_temp_path=off;

    server {
        location /api/ {
            proxy_cache zonaku;
            proxy_cache_key "$scheme$request_method$host$request_uri";
            proxy_cache_valid 200 301 302  10m;
            proxy_cache_valid 404          1m;

            add_header X-Cache-Status $upstream_cache_status;
        }
    }
}</pre>

<p>Header <code>X-Cache-Status</code> sangat membantu saat menyetel: nilainya <code>HIT</code>, <code>MISS</code>, <code>BYPASS</code>, <code>EXPIRED</code>, <code>STALE</code>, atau <code>UPDATING</code>. Tanpa itu, menebak apakah cache benar-benar bekerja hampir mustahil.</p>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Cache tanpa memperhatikan sesi membocorkan data antar pengguna</div>
    <p>Bila kunci cache tidak menyertakan identitas dan balasan bersifat personal, halaman milik pengguna A akan disajikan kepada pengguna B. Ini kebocoran data yang nyata dan pernah terjadi pada banyak situs besar. Lewati cache untuk permintaan yang membawa sesi:</p>
    <pre>proxy_cache_bypass $http_authorization $cookie_sesi;
proxy_no_cache     $http_authorization $cookie_sesi;</pre>
    <p><code>proxy_cache_bypass</code> membuat Nginx tidak <em>membaca</em> dari cache; <code>proxy_no_cache</code> membuatnya tidak <em>menulis</em> ke cache. Keduanya diperlukan.</p>
</div>

<h2>Melayani Saat Hulu Mati</h2>
<pre>proxy_cache_use_stale error timeout updating
                       http_500 http_502 http_503 http_504;
proxy_cache_background_update on;
proxy_cache_lock on;
proxy_cache_lock_timeout 5s;</pre>

<p>Ini salah satu konfigurasi paling berharga di Nginx. Ketika hulu tumbang, pengunjung tetap menerima versi lama alih-alih halaman galat. Dengan <code>background_update</code>, isi kedaluwarsa disajikan seketika sementara pembaruan berjalan di belakang layar.</p>

<div class="callout info">
    <div class="callout-judul">💡 proxy_cache_lock mencegah serbuan ke hulu</div>
    <p>Ketika satu entri populer kedaluwarsa, semua permintaan yang datang bersamaan dapat menembus ke hulu sekaligus — dikenal sebagai <em>cache stampede</em>. Direktif <code>proxy_cache_lock</code> mengizinkan hanya satu permintaan yang lewat, sementara sisanya menunggu hasilnya.</p>
</div>

<h2>Berkas Statis</h2>
<pre>location /statis/ {
    root /var/www;

    sendfile       on;      # salin berkas di kernel, tanpa melewati userspace
    tcp_nopush     on;      # kirim header bersama awal berkas dalam satu paket
    tcp_nodelay    on;
    open_file_cache max=10000 inactive=30s;
    open_file_cache_valid   60s;
    open_file_cache_errors  on;

    expires 1y;
    add_header Cache-Control "public, immutable";
}</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ <code>expires 1y</code> hanya aman untuk berkas ber-hash</div>
    <p>Menyetel setahun pada <code>app.js</code> berarti pengunjung lama tidak akan pernah menerima versi baru sampai cache peramban mereka dibersihkan. Ini aman <strong>hanya</strong> bila nama berkas mengandung hash isi — <code>app.a3f9c1.js</code> — sehingga perubahan menghasilkan nama baru. Untuk <code>index.html</code> gunakan <code>no-cache</code> agar penunjuk ke berkas ber-hash selalu segar.</p>
</div>

<h2>Kompresi</h2>
<pre>gzip              on;
gzip_vary         on;
gzip_min_length   1024;
gzip_comp_level   5;
gzip_proxied      any;
gzip_types        text/plain text/css application/json
                  application/javascript text/xml application/xml
                  image/svg+xml;</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Tingkat kompresi tinggi sering merugikan</div>
    <p><code>gzip_comp_level 9</code> memakai jauh lebih banyak CPU tetapi hanya menghemat beberapa persen ukuran dibanding level 5. Pada lalu lintas tinggi, CPU itu lebih berharga daripada selisih kecil tersebut. Level 4–6 adalah titik seimbang yang lazim.</p>
    <p>Jangan mengompresi berkas yang sudah terkompresi — JPEG, PNG, MP4, ZIP. Hasilnya justru sedikit lebih besar sekaligus membakar CPU.</p>
</div>

<h2>Menyajikan Berkas Terkompresi Lebih Dulu</h2>
<pre>gzip_static on;      # sajikan app.js.gz bila ada, tanpa kompresi saat permintaan
brotli_static on;    # butuh modul brotli</pre>

<p>Berkas dikompresi sekali saat proses build, lalu Nginx menyajikannya langsung. Kompresi tingkat maksimum menjadi masuk akal di sini karena hanya dilakukan sekali, bukan pada setiap permintaan.</p>`,
    perintah: [
        "curl -sI https://contoh.id/api/data | grep -i x-cache",
        "du -sh /var/cache/nginx",
        "curl -sH 'Accept-Encoding: gzip' -o /dev/null -w '%{size_download}\\n' https://contoh.id/app.js",
        "find /var/cache/nginx -type f | wc -l",
        "grep -c 'HIT' /var/log/nginx/access.log"
    ],
    kuis: [
        {
            tanya: "Apa akibat paling berbahaya dari menyimpan balasan ke cache tanpa memperhitungkan sesi pengguna?",
            opsi: [
                "Cache akan cepat penuh dan menghapus entri lain",
                "Balasan personal milik satu pengguna dapat disajikan kepada pengguna lain karena kunci cache tidak membedakan identitas",
                "Nginx akan menolak menyimpan balasan yang mengandung cookie",
                "Waktu muat halaman menjadi lebih lambat"
            ],
            benar: 1,
            penjelasan: "Kunci cache bawaan hanya menyusun skema, metode, host, dan URI. Balasan yang isinya bergantung pada sesi akan disimpan lalu disajikan ke siapa pun yang meminta URI sama — kebocoran data lintas pengguna. Gunakan proxy_cache_bypass dan proxy_no_cache berdasarkan cookie sesi atau header Authorization agar permintaan terautentikasi tidak dibaca dari maupun ditulis ke cache."
        },
        {
            tanya: "Apa manfaat proxy_cache_use_stale ketika server hulu mengembalikan 502?",
            opsi: [
                "Nginx mencoba server hulu lain di dalam blok upstream",
                "Nginx menyajikan versi lama yang masih tersimpan di cache sehingga pengunjung menerima isi alih-alih halaman galat",
                "Nginx menunda permintaan sampai hulu pulih kembali",
                "Nginx menghapus seluruh cache agar tidak menyajikan data usang"
            ],
            benar: 1,
            penjelasan: "Dengan proxy_cache_use_stale, entri yang sudah lewat masa berlakunya tetap boleh disajikan ketika hulu bermasalah. Situs tetap dapat diakses selama gangguan alih-alih menampilkan 502. Dipadukan dengan proxy_cache_background_update, isi lama dikirim seketika sementara pembaruan diambil di belakang layar."
        },
        {
            tanya: "Kenapa 'expires 1y' berisiko untuk berkas seperti app.js tanpa hash pada namanya?",
            opsi: [
                "Karena Nginx tidak dapat menyimpan berkas selama itu",
                "Karena peramban pengunjung lama akan terus memakai versi lama sampai cache dibersihkan, sehingga pembaruan tidak pernah sampai",
                "Karena header expires hanya berlaku maksimum satu bulan",
                "Karena gzip tidak bekerja pada berkas dengan masa berlaku panjang"
            ],
            benar: 1,
            penjelasan: "Masa berlaku panjang menyuruh peramban tidak memeriksa ulang berkas sama sekali. Bila nama berkas tetap sama setelah kode diperbarui, pengunjung lama terkunci pada versi lama. Pola yang benar adalah menyisipkan hash isi ke nama berkas sehingga versi baru punya URL baru, sementara index.html yang menunjuk ke berkas itu disajikan dengan no-cache."
        }
    ]
},
{
    id: 8,
    kategori: "5 · Operasi",
    judul: "Log, Diagnosis & Penelusuran Masalah",
    tingkat: "Lanjut", durasi: "13 mnt",
    tag: ["log", "debug", "502", "diagnosis"],
    ringkas: "Membaca log yang tepat, dan mengenali penyebab sesungguhnya di balik 502, 504, dan 499.",
    isi: `
<h2>Format Log yang Berguna</h2>
<pre>log_format terperinci '$remote_addr - $remote_user [$time_local] '
                      '"$request" $status $body_bytes_sent '
                      '"$http_referer" "$http_user_agent" '
                      'rt=$request_time uct=$upstream_connect_time '
                      'uht=$upstream_header_time urt=$upstream_response_time '
                      'cache=$upstream_cache_status';

access_log /var/log/nginx/access.log terperinci;
error_log  /var/log/nginx/error.log  warn;</pre>

<div class="callout info">
    <div class="callout-judul">💡 Selisih $request_time dan $upstream_response_time adalah petunjuk utama</div>
    <p><code>$upstream_response_time</code> mengukur waktu hulu bekerja; <code>$request_time</code> mengukur seluruh perjalanan hingga byte terakhir sampai ke klien. Bila hulu 0,05 detik tetapi total 4 detik, hulu tidak bersalah — jaringan klien lambat, atau balasan besar sedang dikirim tanpa buffering. Tanpa dua angka ini terpisah, tim aplikasi dan tim infrastruktur akan saling menyalahkan tanpa bukti.</p>
</div>

<h2>Membaca Kode Status yang Sering Membingungkan</h2>
<pre>502 Bad Gateway       hulu menolak koneksi atau memutusnya
                      → proses hulu mati, port salah, crash
504 Gateway Timeout   hulu terhubung tapi tidak membalas tepat waktu
                      → hulu lambat, atau proxy_read_timeout terlalu pendek
499 Client Closed      klien pergi sebelum balasan selesai
                      → pengguna menutup tab, atau batas waktu di sisi klien
413 Too Large          client_max_body_size terlampaui
504 vs 502             periksa mana yang muncul — artinya berbeda jauh</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Lonjakan 499 hampir selalu berarti aplikasi terlalu lambat</div>
    <p>Kode 499 khusus Nginx dan sering diabaikan karena "klien yang pergi". Namun bila jumlahnya melonjak, biasanya klien menyerah karena batas waktunya sendiri lebih pendek daripada waktu balasan aplikasi. Perbaikannya ada di kecepatan hulu, bukan di Nginx.</p>
</div>

<h2>Log Kesalahan Adalah Sumber Kebenaran</h2>
<pre>tail -f /var/log/nginx/error.log

connect() failed (111: Connection refused)     → hulu tidak berjalan
upstream timed out (110: Connection timed out) → hulu lambat
no live upstreams                              → semua hulu ditandai gagal
too many open files                            → batas deskriptor berkas
SSL_do_handshake() failed                      → ketidakcocokan TLS
directory index of "/var/www/" is forbidden    → tidak ada index dan autoindex mati</pre>

<h2>Debug pada Satu Klien Saja</h2>
<pre>error_log /var/log/nginx/debug.log debug;

events {
    debug_connection 203.0.113.42;       # hanya IP ini yang dicatat rinci
}</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Jangan menyalakan level debug secara global di produksi</div>
    <p>Level <code>debug</code> menghasilkan puluhan baris untuk <em>setiap</em> permintaan. Pada lalu lintas produksi, disk dapat penuh dalam hitungan menit — dan disk penuh menjatuhkan seluruh server, bukan hanya menghentikan pencatatan. Gunakan <code>debug_connection</code> agar hanya alamat tertentu yang dicatat rinci. Modul debug juga harus tersedia; periksa dengan <code>nginx -V</code> mencari <code>--with-debug</code>.</p>
</div>

<h2>Halaman Status</h2>
<pre>location = /nginx_status {
    stub_status;
    allow 127.0.0.1;
    deny  all;
}</pre>

<pre>Active connections: 291
server accepts handled requests
 16630948 16630948 31070465
Reading: 6 Writing: 179 Waiting: 106</pre>

<p>Angka <code>accepts</code> dan <code>handled</code> yang berbeda adalah tanda bahaya: artinya sebagian koneksi diterima lalu dijatuhkan, biasanya karena batas <code>worker_connections</code> atau deskriptor berkas tercapai.</p>

<h2>Rotasi Log</h2>
<pre>/var/log/nginx/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 $(cat /var/run/nginx.pid)
    endscript
}</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Memindahkan berkas log tidak membebaskan ruang disk</div>
    <p>Worker Nginx memegang deskriptor berkas yang terbuka. Setelah <code>mv</code> atau <code>rm</code>, worker tetap menulis ke inode lama yang sudah tak bernama — ruang disk tidak kembali dan log baru tidak muncul. Sinyal <code>USR1</code> menyuruh Nginx menutup dan membuka kembali berkas lognya. Inilah alasan blok <code>postrotate</code> di atas wajib ada.</p>
</div>`,
    perintah: [
        "tail -f /var/log/nginx/error.log",
        "awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -rn",
        "curl -s http://127.0.0.1/nginx_status",
        "kill -USR1 $(cat /var/run/nginx.pid)",
        "nginx -V 2>&1 | grep -o with-debug"
    ],
    kuis: [
        {
            tanya: "Log menunjukkan $upstream_response_time 0,04 detik tetapi $request_time 6 detik. Di mana letak masalahnya?",
            opsi: [
                "Aplikasi hulu sangat lambat memproses permintaan",
                "Hulu sudah cepat; waktu terbuang saat mengirim balasan ke klien — jaringan klien lambat atau balasan besar dikirim tanpa buffering",
                "Nginx kehabisan worker untuk menangani permintaan",
                "Sertifikat TLS memperlambat jabat tangan"
            ],
            benar: 1,
            penjelasan: "$upstream_response_time hanya menghitung waktu hulu menghasilkan balasan, sedangkan $request_time mencakup seluruh siklus sampai byte terakhir diterima klien. Selisih besar menunjuk ke sisi klien atau pengiriman, bukan ke aplikasi. Mengaktifkan proxy_buffering membebaskan hulu lebih cepat, meski total waktu ke klien lambat tetap panjang."
        },
        {
            tanya: "Apa beda makna antara 502 dan 504 pada Nginx sebagai reverse proxy?",
            opsi: [
                "Keduanya sama, hanya berbeda penomoran",
                "502 berarti Nginx gagal terhubung atau koneksi diputus hulu; 504 berarti koneksi berhasil tetapi hulu tidak membalas dalam batas waktu",
                "502 berasal dari klien, 504 berasal dari server",
                "502 hanya muncul pada HTTPS, 504 hanya pada HTTP"
            ],
            benar: 1,
            penjelasan: "502 menunjuk pada kegagalan koneksi — proses hulu mati, port salah, atau aplikasi crash saat memproses. 504 menunjuk pada kelambatan — koneksi terbentuk tetapi balasan tidak datang sebelum proxy_read_timeout habis. Membedakan keduanya menentukan arah perbaikan: memulihkan proses versus mempercepat pemrosesan atau menyesuaikan batas waktu."
        },
        {
            tanya: "Setelah berkas log dipindahkan oleh skrip rotasi, ruang disk tidak bertambah dan log baru tidak muncul. Apa yang harus dilakukan?",
            opsi: [
                "Menghapus berkas log lama secara permanen dengan rm",
                "Mengirim sinyal USR1 ke proses master agar Nginx menutup dan membuka kembali berkas lognya",
                "Menjalankan nginx -s stop lalu menyalakannya kembali",
                "Menaikkan nilai worker_rlimit_nofile"
            ],
            benar: 1,
            penjelasan: "Worker masih memegang deskriptor berkas ke inode lama, sehingga tulisan terus mengalir ke berkas yang sudah tidak bernama dan ruangnya tidak dibebaskan. Sinyal USR1 menyuruh Nginx membuka ulang seluruh berkas log berdasarkan nama pada konfigurasi. Karena itu blok postrotate pada logrotate selalu menyertakan pengiriman sinyal ini."
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
