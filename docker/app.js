/**
 * Docker DevOps Masterclass - Interactive Learning Web Application
 * Video Source: "Learn Docker – Full DevOps Course for Deploying Containerized Apps" (rjjES5IsPdg)
 * Bahasa Indonesia Edition
 */

const YOUTUBE_VIDEO_ID = "rjjES5IsPdg";

// Database 18 Modul Pembelajaran Docker
const chapters = [
    {
        id: 1,
        title: "01. Introduction to Containerization & Docker",
        category: "Fundamentals",
        timestamp: "00:00:00",
        seconds: 0,
        desc: "Konsep dasar kontainerisasi, sejarah evolusi industri lunak, serta 4 pilar keunggulan Docker.",
        article: `
            <h2>Pengenalan Kontainerisasi & Docker</h2>
            <p>Docker telah menjadi standar industri *de facto* dalam DevOps dan pengembangan perangkat lunak modern. Sebelum kemunculan teknologi kontainerisasi, tim pengembang dan tim ops sering menghadapi masalah klasik: <em>"Aplikasi ini berjalan lancar di komputer saya, tapi crash di server produksi!"</em></p>
            
            <div class="alert alert-info">
                <strong>💡 Apa itu Docker?</strong><br>
                Docker adalah platform terbuka yang memungkinkan pengembang untuk mengemas aplikasi beserta seluruh dependensinya (library, konfigurasi, runtime) ke dalam sebuah **Container** yang terisolasi dan efisien.
            </div>

            <h3>4 Pilar Keuntungan Utama Docker</h3>
            <ol>
                <li><strong>Reproducibility (Reproduksibilitas):</strong> Lingkungan pengembangan, testing, dan produksi dijamin 100% identik. Membasmi masalah *perbedaan versi OS atau library*.</li>
                <li><strong>Dependency Isolation (Isolasi Dependensi):</strong> Setiap aplikasi berjalan di dalam ruang terisolasi sendiri tanpa konflik versi (misal: Aplikasi A butuh Python 3.11, Aplikasi B butuh Python 3.13).</li>
                <li><strong>Portability (Portabilitas Tinggi):</strong> Kontainer dapat dijalankan di mana saja: laptop lokal (Windows/macOS/Linux), VM, AWS, Google Cloud, Azure, hingga Kubernetes cluster.</li>
                <li><strong>Version Control for Environments (Kontrol Versi Lingkungan):</strong> Gambar kontainer (Docker Image) dapat diberi versi (tag) seperti git commit, memudahkan rollback instan jika terjadi bug.</li>
            </ol>

            <h3>Perbandingan Singkat: Monolitik vs Microservices dengan Docker</h3>
            <p>Dalam arsitektur mikro (microservices), setiap layanan kecil (Auth Service, Payment Service, Notification Service) dikemas ke dalam kontainer tersendiri yang dapat diskalakan secara independen.</p>

            <pre><code># Memeriksa instalasi Docker & versi engine
docker --version
docker info</code></pre>
        `,
        quiz: {
            question: "Manakah di bawah ini yang BUKAN merupakan keuntungan utama dari penggunaan Docker?",
            options: [
                "Menjamin reproduksibilitas lingkungan dari lokal hingga produksi",
                "Mengisolasi dependensi antar aplikasi secara mandiri",
                "Menggantikan kebutuhan sistem operasi utama dengan kernel kustom baru",
                "Memudahkan portabilitas aplikasi di berbagai cloud provider"
            ],
            correct: 2,
            explanation: "Docker memanfaatkan kernel dari Host OS (Linux Kernel) dan tidak menggantikan sistem operasi utama atau membuat kernel kustom baru."
        }
    },
    {
        id: 2,
        title: "02. Physical Servers vs Virtualization vs Containers",
        category: "Architecture",
        timestamp: "00:15:30",
        seconds: 930,
        desc: "Evolusi infrastruktur dari fisik (Bare Metal), Virtual Machine (Hypervisor), hingga Kontainer Docker.",
        article: `
            <h2>Perbandingan Infrastruktur: Bare Metal vs VM vs Container</h2>
            <p>Untuk memahami arsitektur Docker, kita harus melihat perjalanan evolusi komputasi server selama 2 dekade terakhir.</p>

            <h3>1. Physical Servers (Bare Metal)</h3>
            <p>Aplikasi diinstal langsung di atas Sistem Operasi server fisik. Masalah utama: Pemborosan sumber daya (CPU & RAM idle), biaya hardware mahal, dan instalasi yang lambat.</p>

            <h3>2. Virtual Machines (Virtualisasi Tradisional)</h3>
            <p>Teknologi seperti VMware, VirtualBox, atau KVM menggunakan **Hypervisor** untuk membagi hardware fisik menjadi beberapa VM. Setiap VM memiliki <strong>Guest OS</strong> tersendiri yang lengkap (misal: Ubuntu, Windows Server).</p>
            <ul>
                <li><strong>Kelebihan:</strong> Isolasi total tingkat hardware.</li>
                <li><strong>Kekurangan:</strong> Sangat berat (overhead memori & CPU besar), boot time lambat (hitung menit), ukuran image puluhan Gigabyte.</li>
            </ul>

            <h3>3. Containers (Docker)</h3>
            <p>Kontainer **TIDAK** membutuhkan Guest OS terpisah! Semua kontainer berbagi (share) **Host OS Kernel** yang sama, namun terisolasi di tingkat proses (user space).</p>

            <div class="alert alert-tip">
                <strong>⚡ Performa Kontainer:</strong><br>
                Kontainer Docker dapat di-start hanya dalam waktu hitungan milidetik atau detik, dengan penggunaan memori yang sangat minim (hanya beberapa MB).
            </div>

            <pre><code>+-----------------------+     +-----------------------+
|  App A   |   App B    |     |  App A   |   App B    |
| (Deps)   |  (Deps)    |     | (Deps)   |  (Deps)    |
+----------+------------+     +----------+------------+
|   Docker Engine       |     | Guest OS | Guest OS   |
+-----------------------+     +----------+------------+
|      Host OS          |     |      Hypervisor       |
+-----------------------+     +-----------------------+
|   Physical Hardware   |     |   Physical Hardware   |
|     (Containers)      |     |  (Virtual Machines)   |
+-----------------------+     +-----------------------+</code></pre>
        `,
        quiz: {
            question: "Mengapa kontainer Docker jauh lebih ringan dibandingkan dengan Virtual Machine (VM)?",
            options: [
                "Karena kontainer tidak menggunakan CPU dan RAM dari server fisik",
                "Karena kontainer berbagi (share) Kernel Host OS tanpa memerlukan Guest OS penuh",
                "Karena kontainer mengompresi seluruh file kode menjadi biner 16-bit",
                "Karena kontainer hanya bisa berjalan pada bahasa pemrograman tertentu"
            ],
            correct: 1,
            explanation: "Kontainer Docker tidak memerlukan Guest OS lengkap di setiap instance-nya, melainkan berbagi kernel milik Host OS."
        }
    },
    {
        id: 3,
        title: "03. Software Processes & Linux System Isolation",
        category: "Architecture",
        timestamp: "00:23:57",
        seconds: 1437,
        desc: "Bagaimana Linux Kernel mengisolasi proses menggunakan Namespaces (PID, NET, MNT) dan Control Groups (cgroups).",
        article: `
            <h2>Proses Perangkat Lunak & Rahasia Isolasi Linux</h2>
            <p>Di balik layar, kontainer Docker sebenarnya adalah <strong>Proses Linux Biasa</strong> yang diisolasi menggunakan fitur bawaan dari Linux Kernel.</p>

            <h3>Dua Teknologi Utama Linux Kernel:</h3>
            
            <h4>1. Linux Namespaces (Isolasi Visibilitas)</h4>
            <p>Namespaces membatasi apa yang bisa <em>dilihat</em> oleh suatu proses. Seolah-olah proses tersebut hidup di dalam komputer tersendiri:</p>
            <ul>
                <li><strong>PID Namespace:</strong> Mengisolasi Process ID. Di dalam kontainer, proses utama memiliki PID 1, padahal di Host OS memiliki PID misal 4892.</li>
                <li><strong>NET Namespace:</strong> Mengisolasi kartu jaringan, alokasi IP Address, routing table, dan port.</li>
                <li><strong>MNT (Mount) Namespace:</strong> Mengisolasi direktori mount dan file system.</li>
                <li><strong>IPC Namespace:</strong> Mengisolasi komunikasi antar proses (Inter-Process Communication).</li>
                <li><strong>UTS Namespace:</strong> Mengisolasi Hostname dan nama domain.</li>
                <li><strong>USER Namespace:</strong> Mengisolasi User ID dan Group ID (User root di kontainer bisa dipetakan ke non-root di host).</li>
            </ul>

            <h4>2. Control Groups / cgroups (Pembatasan Sumber Daya)</h4>
            <p>Jika Namespace membatasi apa yang bisa *dilihat*, <strong>cgroups</strong> membatasi apa yang bisa *digunakan* oleh kontainer (misal: Maksimal 512MB RAM dan 1.5 CPU core).</p>

            <div class="alert alert-warning">
                <strong>⚠️ Keamanan:</strong> Berkat isolasi Namespace & cgroups, kontainer yang diretas tidak dapat mengakses file sistem host atau kontainer tetangganya.
            </div>
        `,
        quiz: {
            question: "Fitur Linux Kernel manakah yang bertanggung jawab untuk membatasi jumlah penggunaan memori RAM dan CPU oleh kontainer?",
            options: [
                "PID Namespace",
                "Control Groups (cgroups)",
                "UTS Namespace",
                "MNT Mount Points"
            ],
            correct: 1,
            explanation: "Control Groups (cgroups) bertugas membatasi dan memantau alokasi sumber daya fisik seperti CPU, RAM, dan I/O disk."
        }
    },
    {
        id: 4,
        title: "04. Docker Architecture & Core Ecosystem",
        category: "Architecture",
        timestamp: "00:42:07",
        seconds: 2527,
        desc: "Arsitektur Client-Server Docker: Docker Daemon (dockerd), Docker CLI, REST API, Docker Objects, & Docker Hub.",
        article: `
            <h2>Arsitektur & Ekosistem Komponen Docker</h2>
            <p>Docker menggunakan arsitektur <strong>Client-Server</strong>. Saat Anda mengetikkan perintah <code>docker</code> di terminal, Anda sedang berinteraksi dengan Docker Client yang mengirimkan instruksi ke Docker Daemon.</p>

            <h3>Komponen Utama Arsitektur Docker:</h3>

            <h4>1. Docker Client (CLI)</h4>
            <p>Alat baris perintah (command line) tempat pengguna mengetikkan perintah seperti <code>docker run</code>, <code>docker build</code>, atau <code>docker ps</code>.</p>

            <h4>2. Docker Host & Daemon (dockerd)</h4>
            <p>Service background yang terus berjalan di host OS. Docker Daemon bertugas mengelola objek-objek Docker (Images, Containers, Networks, Volumes) dan mendengarkan permintaan REST API dari Client.</p>

            <h4>3. Docker Registry (Docker Hub)</h4>
            <p>Gudang penyimpanan Docker Images (seperti GitHub untuk kode). **Docker Hub** adalah registry publik resmi tempat kita mengunduh image gratis seperti Nginx, Node.js, Python, PostgreSQL, dll.</p>

            <h3>4 Objek Utama Docker (Docker Objects):</h3>
            <ul>
                <li><strong>Image:</strong> Template read-only yang berisi cetak biru (blueprint) aplikasi & lingkungan.</li>
                <li><strong>Container:</strong> Instance yang sedang berjalan (runnable instance) dari suatu Image.</li>
                <li><strong>Network:</strong> Jalur komunikasi antar kontainer dan internet.</li>
                <li><strong>Volume:</strong> Tempat penyimpanan data permanen di luar siklus hidup kontainer.</li>
            </ul>

            <pre><code>[ Docker Client ]  ---> REST API ---> [ Docker Daemon (dockerd) ]
 (docker run)                             |-- Images
                                          |-- Containers
                                          |-- Networks
                                          |-- Volumes
                                          ^
                                          | Pull / Push
                                [ Docker Registry (Hub) ]</code></pre>
        `,
        quiz: {
            question: "Service apakah di dalam arsitektur Docker yang berjalan di background dan mengeksekusi pembuatan kontainer, network, serta volume?",
            options: [
                "Docker Client CLI",
                "Docker Daemon (dockerd)",
                "Docker Hub Registry",
                "Docker Compose File"
            ],
            correct: 1,
            explanation: "Docker Daemon (dockerd) adalah service utama yang mendengarkan API requests dan mengelola seluruh objek Docker."
        }
    },
    {
        id: 5,
        title: "05. Docker Installation & Environment Setup",
        category: "Fundamentals",
        timestamp: "00:53:07",
        seconds: 3187,
        desc: "Instalasi Docker Engine di Linux Server (Ubuntu), Docker Desktop di Local Machine, & Setup AWS EC2.",
        article: `
            <h2>Instalasi & Panduan Setup Lingkungan Docker</h2>
            <p>Docker dapat diinstal di berbagai sistem operasi lokal maupun cloud server.</p>

            <h3>1. Instalasi Docker Desktop (Windows / macOS)</h3>
            <p>Untuk komputer lokal, cara termudah adalah mengunduh <strong>Docker Desktop</strong>. Di Windows, Docker Desktop memanfaatkan <strong>WSL2 (Windows Subsystem for Linux 2)</strong> untuk mendapatkan performa kernel Linux native.</p>

            <h3>2. Instalasi Docker Engine di Ubuntu Server (Linux Native)</h3>
            <p>Langkah resmi instalasi Docker Engine di Ubuntu 24.04 LTS ke atas (perintah yang sama juga berlaku di Debian dengan mengganti <code>ubuntu</code> menjadi <code>debian</code> pada URL repositori):</p>

            <pre><code># 1. Update paket & install dependensi
sudo apt update && sudo apt install -y ca-certificates curl gnupg

# 2. Tambahkan GPG key resmi Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 3. Tambahkan repositori ke APT sources
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Install Docker Engine & CLI
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. Tambahkan user ke group docker (agar bisa jalankan tanpa sudo)
sudo usermod -aG docker $USER
newgrp docker</code></pre>

            <div class="alert alert-tip">
                <strong>✅ Verifikasi Instalasi:</strong><br>
                Jalankan perintah <code>docker run hello-world</code> untuk menguji apakah Docker engine sudah berjalan dengan sempurna.
            </div>
        `,
        quiz: {
            question: "Perintah Linux manakah yang digunakan agar pengguna biasa (non-root) dapat menjalankan perintah Docker tanpa perlu mengetikkan 'sudo'?",
            options: [
                "sudo chmod 777 /usr/bin/docker",
                "sudo usermod -aG docker $USER",
                "sudo systemctl enable docker",
                "docker login --user root"
            ],
            correct: 1,
            explanation: "Menambahkan user ke grup 'docker' dengan 'sudo usermod -aG docker $USER' memberikan izin untuk mengakses socket Docker tanpa sudo."
        }
    },
    {
        id: 6,
        title: "06. Basic Docker Commands & Container Lifecycle",
        category: "Fundamentals",
        timestamp: "01:42:24",
        seconds: 6144,
        desc: "Perintah praktis manajemen kontainer: pull, run, ps, stop, start, exec, logs, rm, & inspect.",
        article: `
            <h2>Perintah Dasar & Siklus Hidup (Lifecycle) Kontainer</h2>
            <p>Memahami perintah CLI dasar Docker adalah fondasi paling krusial bagi setiap engineer DevOps.</p>

            <h3>Perintah Utama Manajemen Kontainer:</h3>

            <h4>1. Mendownload Image (docker pull)</h4>
            <pre><code>docker pull nginx:alpine</code></pre>

            <h4>2. Menjalankan Kontainer (docker run)</h4>
            <pre><code># Run kontainer di background (detached mode -d) dengan nama khusus
docker run -d --name web-utama nginx:alpine</code></pre>

            <h4>3. Melihat Daftar Kontainer (docker ps)</h4>
            <pre><code># Melihat kontainer yang sedang berjalan
docker ps

# Melihat seluruh kontainer (termasuk yang mati/stopped)
docker ps -a</code></pre>

            <h4>4. Menghentikan & Menjalankan Ulang (docker stop/start)</h4>
            <pre><code>docker stop web-utama
docker start web-utama
docker restart web-utama</code></pre>

            <h4>5. Masuk ke Dalam Kontainer (docker exec)</h4>
            <p>Sangat berguna untuk debugging dan memeriksa file di dalam kontainer secara interaktif:</p>
            <pre><code>docker exec -it web-utama sh</code></pre>

            <h4>6. Melihat Log Aplikasi (docker logs)</h4>
            <pre><code># Follow log secara real-time (-f)
docker logs -f web-utama</code></pre>

            <h4>7. Menghapus Kontainer (docker rm)</h4>
            <pre><code># Hapus kontainer (harus di-stop dulu atau gunakan flag -f)
docker rm web-utama
docker rm -f web-utama</code></pre>

            <div class="alert alert-info">
                <strong>🔍 Meneliti Detail Kontainer:</strong> Perintah <code>docker inspect web-utama</code> menampilkan seluruh konfigurasi JSON dari kontainer seperti IP Address, Mounts, dan Env vars.
            </div>
        `,
        quiz: {
            question: "Perintah Docker CLI manakah yang digunakan untuk masuk ke dalam kontainer yang sedang berjalan dalam mode terminal interaktif?",
            options: [
                "docker attach -d <container>",
                "docker exec -it <container> sh",
                "docker run -t <container>",
                "docker inspect --shell <container>"
            ],
            correct: 1,
            explanation: "Perintah 'docker exec -it <container> sh' (atau bash) membuka sesi terminal interaktif baru di dalam kontainer yang berjalan."
        }
    },
    {
        id: 7,
        title: "07. Port Forwarding & Container Networking Basics",
        category: "Networking",
        timestamp: "02:08:38",
        seconds: 7718,
        desc: "Konsep Port Forwarding (-p host_port:container_port), alokasi IP privat kontainer, & pengujian cURL.",
        article: `
            <h2>Port Forwarding & Dasar Jaringan Kontainer</h2>
            <p>Secara default, kontainer Docker berjalan di dalam jaringan terisolasi dan **tidak dapat diakses** dari luar host (komputer Anda) kecuali kita melakukan <strong>Port Mapping / Port Forwarding</strong>.</p>

            <h3>Sintaks Port Mapping (Flag -p)</h3>
            <pre><code>docker run -d -p [HOST_PORT]:[CONTAINER_PORT] --name [NAMA] [IMAGE]</code></pre>

            <div class="alert alert-tip">
                <strong>📌 Rumus Kunci:</strong><br>
                <code>-p 8080:80</code> artinya: Port **8080 di Laptop/Server Host** dipetakan ke Port **80 di dalam Kontainer**.
            </div>

            <h3>Contoh Praktis:</h3>
            <pre><code># Menjalankan Nginx pada port host 8080
docker run -d -p 8080:80 --name my-nginx nginx:alpine

# Uji akses dari terminal host menggunakan cURL
curl http://localhost:8080</code></pre>

            <h3>Mekanisme IP Address Kontainer</h3>
            <p>Setiap kontainer mendapatkan Virtual IP internal dari Docker Network (misal: <code>172.17.0.2</code>). Namun IP ini bersifat sementara dan dapat berubah setiap kali kontainer di-restart.</p>

            <pre><code># Memeriksa IP Address privat kontainer
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' my-nginx</code></pre>
        `,
        quiz: {
            question: "Jika Anda menjalankan perintah 'docker run -d -p 3000:8080 my-app', pada port berapakah aplikasi dapat diakses melalui browser di komputer Anda?",
            options: [
                "Port 8080",
                "Port 3000",
                "Port 80",
                "Tidak dapat diakses karena port berbeda"
            ],
            correct: 1,
            explanation: "Sintaks -p <HOST_PORT>:<CONTAINER_PORT> memetakan port host (3000) ke port internal kontainer (8080), sehingga diakses melalui localhost:3000."
        }
    },
    {
        id: 8,
        title: "08. Docker Networking Modes & Custom Drivers",
        category: "Networking",
        timestamp: "02:18:00",
        seconds: 8280,
        desc: "Mode jaringan Docker: Bridge, Host, None, Overlay, serta pembuatan Custom User-Defined Network dengan DNS resolution.",
        article: `
            <h2>Mode Jaringan Docker & Custom Network Drivers</h2>
            <p>Docker menyediakan beberapa driver jaringan untuk mengatur bagaimana kontainer saling berkomunikasi satu sama lain.</p>

            <h3>4 Driver Jaringan Standar Docker:</h3>
            <ol>
                <li><strong>Bridge (Default):</strong> Jaringan internal privat. Kontainer di bridge yang sama dapat saling berkomunikasi.</li>
                <li><strong>Host:</strong> Mengisolasi network namespace dihilangkan; kontainer menggunakan langsung IP dan Port milik Host OS (sangat cepat, tanpa overhead NAT).</li>
                <li><strong>None:</strong> Kontainer tidak memiliki kartu jaringan sama sekali (terisolasi total dari dunia luar).</li>
                <li><strong>Overlay:</strong> Digunakan untuk menghubungkan kontainer di beberapa host server berbeda (Docker Swarm / Multi-host).</li>
            </ol>

            <h3>Mengapa Harus Membuat Custom User-Defined Bridge?</h3>
            <p>Pada jaringan <em>default bridge</em>, kontainer hanya bisa saling panggil menggunakan IP Address. Namun pada <strong>Custom User-Defined Bridge</strong>, Docker menyediakan fitur **Embedded DNS Server** sehingga kontainer bisa saling berkomunikasi menggunakan **Nama Kontainer (Hostname)**!</p>

            <pre><code># 1. Buat custom bridge network
docker network create my-net

# 2. Jalankan database PostgreSQL di jaringan my-net
docker run -d --name db-postgres --network my-net -e POSTGRES_PASSWORD=rahasia postgres:alpine

# 3. Jalankan aplikasi web di jaringan yang sama
docker run -d --name app-web --network my-net -p 8000:8000 my-web-app

# 4. Dari app-web, kita bisa langsung connect ke "db-postgres" sebagai hostname!</code></pre>
        `,
        quiz: {
            question: "Apa keunggulan utama dari membuat Custom User-Defined Bridge Network dibandingkan menggunakan Default Bridge Network bawaan Docker?",
            options: [
                "Custom Bridge otomatis meningkatkan kecepatan internet kontainer hingga 10x lipat",
                "Custom Bridge menyediakan Automatic DNS Resolution antar kontainer berdasarkan nama kontainer",
                "Custom Bridge mencegah kontainer menggunakan memori RAM",
                "Custom Bridge menghapus kebutuhan pembuatan Dockerfile"
            ],
            correct: 1,
            explanation: "Custom User-Defined Bridge mengaktifkan fitur Embedded DNS bawaan Docker sehingga kontainer dapat saling ping/connect menggunakan nama kontainer."
        }
    },
    {
        id: 9,
        title: "09. Data Persistence: Volumes & Bind Mounts",
        category: "Storage",
        timestamp: "02:38:00",
        seconds: 9480,
        desc: "Mengatasi sifat Ephemeral kontainer dengan Named Volumes dan Bind Mounts untuk penyimpanan data permanen.",
        article: `
            <h2>Persistensi Data: Volumes vs Bind Mounts</h2>
            <p>Secara default, lapisan penyimpanan kontainer bersifat **Ephemeral** (sementara). Jika kontainer dihapus (<code>docker rm</code>), semua data baru yang dibuat di dalam kontainer akan <strong>HILANG SELAMANYA!</strong></p>

            <p>Untuk menyimpan data permanen (seperti database MySQL, file upload user, atau log), Docker menyediakan 2 mekanisme utama:</p>

            <h3>1. Named Volumes (Dikelola oleh Docker)</h3>
            <p>Volume disimpan dan dikelola sepenuhnya oleh Docker Engine di lokasi khusus host (<code>/var/lib/docker/volumes/</code>). Ini adalah standar terbaik untuk produksi & database.</p>

            <pre><code># Membuat volume baru
docker volume create pg_data

# Menghubungkan volume ke kontainer (-v nama_volume:path_di_kontainer)
docker run -d --name db-utama -v pg_data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secret postgres:alpine</code></pre>

            <h3>2. Bind Mounts (Menghubungkan Folder Host Langsung)</h3>
            <p>Memetakan file/folder spesifik di komputer Anda langsung ke dalam kontainer. Sangat cocok untuk **Development Workflow** (Live Reloading kode).</p>

            <pre><code># Memetakan folder project lokal ke kontainer
docker run -d -p 80:80 -v $(pwd)/html:/usr/share/nginx/html nginx:alpine</code></pre>

            <div class="alert alert-info">
                <strong>Tabel Perbandingan Ringkas:</strong>
                <ul>
                    <li><strong>Named Volume:</strong> Lebih aman, diatur Docker, portabel antar OS.</li>
                    <li><strong>Bind Mount:</strong> Tergantung struktur folder host, bagus untuk edit kode lokal.</li>
                </ul>
            </div>
        `,
        quiz: {
            question: "Manakah opsi paling tepat untuk menyimpan data database PostgreSQL agar data tidak hilang ketika kontainer di-restart atau dihapus?",
            options: [
                "Menyimpan data di dalam folder temporary /tmp kontainer",
                "Menggunakan Docker Named Volume yang di-mount ke /var/lib/postgresql/data",
                "Mengubah file system kontainer menjadi Read-Only",
                "Menjalankan perintah docker stop tanpa docker rm"
            ],
            correct: 1,
            explanation: "Docker Named Volume menyediakan penyimpanan persisten di luar siklus hidup kontainer, sehingga data tetap aman meskipun kontainer dihapus."
        }
    },
    {
        id: 10,
        title: "10. Environment Variables & App Configurations",
        category: "Fundamentals",
        timestamp: "02:50:00",
        seconds: 10200,
        desc: "Passing variabel lingkungan (-e KEY=VALUE, --env-file) untuk konfigurasi dinamik kredensial database & app settings.",
        article: `
            <h2>Environment Variables & Konfigurasi Aplikasi</h2>
            <p>Sesuai prinsip <strong>12-Factor App</strong>, konfigurasi aplikasi (seperti kredensial database, API key, dan mode ENVIRONMENT) harus dipisahkan dari kode biner dan disuntikkan melalui **Environment Variables**.</p>

            <h3>1. Passing Env Via Flag -e</h3>
            <pre><code>docker run -d --name my-mysql \
  -e MYSQL_ROOT_PASSWORD=supersecret \
  -e MYSQL_DATABASE=tokoonline \
  -p 3306:3306 mysql:8.4</code></pre>

            <h3>2. Passing Env Via File (.env)</h3>
            <p>Jika variabel lingkungan sangat banyak, lebih rapi jika disimpan di dalam file <code>.env</code>:</p>

            <pre><code># Isi file prod.env:
DB_HOST=db-postgres
DB_USER=admin
DB_PASS=rahasia123
PORT=8080</code></pre>

            <pre><code># Jalankan kontainer dengan flag --env-file
docker run -d --env-file prod.env -p 8080:8080 my-backend-app</code></pre>

            <div class="alert alert-warning">
                <strong>⚠️ Keamanan Kredensial:</strong> Jangan pernah memasukkan file <code>.env</code> yang berisi password ke dalam git repository! Tambahkan <code>.env</code> ke file <code>.gitignore</code>.
            </div>
        `,
        quiz: {
            question: "Flag perintah Docker CLI apakah yang digunakan untuk mengimpor seluruh daftar variabel lingkungan sekaligus dari sebuah file kustom?",
            options: [
                "-e / --env",
                "--env-file",
                "-v / --volume",
                "--config-file"
            ],
            correct: 1,
            explanation: "Flag '--env-file <path_to_file>' membaca file variabel lingkungan dan menyuntikkannya sekaligus ke dalam kontainer."
        }
    },
    {
        id: 11,
        title: "11. Introduction to Docker Compose",
        category: "Compose",
        timestamp: "03:04:07",
        seconds: 11047,
        desc: "Orkestrasi multi-container dengan file docker-compose.yml, struktur YAML, & perintah dasar compose.",
        article: `
            <h2>Pengenalan Docker Compose</h2>
            <p>Ketika aplikasi kita berkembang dan terdiri dari banyak kontainer (Frontend, Backend API, Database PostgreSQL, Redis Cache), mengetikkan perintah <code>docker run</code> secara manual satu per satu sangat melelahkan dan rentan kesalahan.</p>

            <div class="alert alert-tip">
                <strong>🐙 Apa itu Docker Compose?</strong><br>
                Docker Compose adalah alat untuk mendefinisikan dan menjalankan aplikasi multi-kontainer Docker menggunakan sebuah file konfigurasi **declarative** bertipe YAML (<code>docker-compose.yml</code>).
            </div>

            <h3>Struktur Standar <code>compose.yaml</code>:</h3>
            <div class="callout callout-warning">
                <div class="callout-title">⚠️ Dua hal yang sudah usang</div>
                <p><strong>1. Binary <code>docker-compose</code> (v1)</strong> berbasis Python sudah EOL dan tidak lagi disertakan. Gunakan plugin Compose v2 yang dipanggil sebagai subcommand: <code>docker compose</code> (pakai spasi, bukan tanda hubung).</p>
                <p><strong>2. Key <code>version:</code></strong> di baris paling atas sudah <em>obsolete</em> pada Compose Specification dan hanya akan memunculkan peringatan. Hapus saja. Nama file yang dianjurkan sekarang <code>compose.yaml</code>, meski <code>docker-compose.yml</code> tetap dikenali.</p>
            </div>
            <pre><code>services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html
    networks:
      - app-network

  database:
    image: postgres:alpine
    environment:
      POSTGRES_PASSWORD: secretpassword
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - app-network

volumes:
  db-data:

networks:
  app-network:
    driver: bridge</code></pre>

            <h3>Perintah Utama Docker Compose:</h3>
            <pre><code># Menjalankan seluruh stack aplikasi di background
docker compose up -d

# Melihat status seluruh kontainer compose
docker compose ps

# Menghentikan dan menghapus seluruh kontainer, network, & volume
docker compose down</code></pre>
        `,
        quiz: {
            question: "Format file apakah yang digunakan oleh Docker Compose untuk mendefinisikan seluruh layanan multi-kontainer secara deklaratif?",
            options: [
                "JSON (docker-compose.json)",
                "YAML (docker-compose.yml)",
                "XML (docker-compose.xml)",
                "INI (docker-compose.ini)"
            ],
            correct: 1,
            explanation: "Docker Compose menggunakan format file YAML (docker-compose.yml atau compose.yaml)."
        }
    },
    {
        id: 12,
        title: "12. Advanced Docker Compose & Service Dependencies",
        category: "Compose",
        timestamp: "03:17:48",
        seconds: 11868,
        desc: "Manajemen ketergantungan layanan (depends_on), Healthchecks, Restart Policies, & Service Scaling.",
        article: `
            <h2>Fitur Lanjutan Docker Compose</h2>
            <p>Dalam aplikasi dunia nyata, layanan memiliki urutan ketergantungan (misal: Backend API tidak boleh berjalan sebelum Database PostgreSQL siap menerima koneksi).</p>

            <h3>1. Ketergantungan Layanan (depends_on & healthcheck)</h3>
            <pre><code>services:
  db:
    image: postgres:alpine
    environment:
      POSTGRES_PASSWORD: secret
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy</code></pre>

            <h3>2. Restart Policies</h3>
            <ul>
                <li><code>restart: always</code> - Selalu restart kontainer jika mati/crash.</li>
                <li><code>restart: unless-stopped</code> - Restart kontainer kecuali dihentikan secara manual oleh admin.</li>
            </ul>

            <h3>3. Scaling Services</h3>
            <p>Kita dapat menduplikasi instance kontainer worker atau backend dengan mudah:</p>
            <pre><code>docker compose up -d --scale backend=3</code></pre>
        `,
        quiz: {
            question: "Konfigurasi manakah pada docker-compose.yml yang memastikan kontainer backend baru berjalan setelah kontainer database benar-benar sehat (healthy)?",
            options: [
                "depends_on dengan condition: service_healthy",
                "restart: always",
                "ports mapping 8080:8080",
                "volumes mount /var/lib/data"
            ],
            correct: 0,
            explanation: "Menggabungkan 'healthcheck' di service DB dan 'depends_on: db: condition: service_healthy' di service backend menjamin urutan startup yang tepat."
        }
    },
    {
        id: 13,
        title: "13. Compose Modern - Watch, Profile & Depends On",
        category: "Compose",
        timestamp: "00:00:00",
        seconds: null,
        desc: "Alur pengembangan dengan sinkronisasi berkas otomatis, profil lingkungan, health check sebagai syarat startup, dan berkas compose berlapis.",
        article: `
            <h2>Compose Watch — Hot Reload Tanpa Bind Mount</h2>
            <p>Cara lama memakai bind mount seluruh direktori, yang menimbulkan masalah: <code>node_modules</code> di host bentrok dengan yang di kontainer, kinerja berkas di macOS dan Windows sangat lambat, dan izin berkas sering kacau.</p>

            <pre><code>services:
  web:
    build: .
    ports: ["3000:3000"]
    develop:
      watch:
        # Salin berkas ke kontainer tanpa restart
        - action: sync
          path: ./src
          target: /app/src
          ignore: [node_modules/]

        # Bangun ulang image bila dependensi berubah
        - action: rebuild
          path: ./package.json

        # Salin lalu restart proses
        - action: sync+restart
          path: ./config
          target: /app/config</code></pre>

            <pre><code>docker compose watch</code></pre>

            <div class="alert alert-tip">
                <strong>📌 Tiga aksi dan kapan memakainya</strong>
                <ul>
                    <li><code>sync</code> — untuk berkas yang ditangani hot-reload aplikasi (React, nodemon, uvicorn --reload).</li>
                    <li><code>sync+restart</code> — untuk berkas konfigurasi yang hanya dibaca saat proses menyala.</li>
                    <li><code>rebuild</code> — untuk manifest dependensi seperti <code>package.json</code>, <code>go.mod</code>, <code>requirements.txt</code>.</li>
                </ul>
            </div>

            <h3>Profil — Satu Berkas untuk Banyak Skenario</h3>
            <pre><code>services:
  api:
    build: .
    # tanpa profiles -- selalu ikut berjalan

  db:
    image: postgres:17-alpine

  # Hanya menyala bila diminta
  pgadmin:
    image: dpage/pgadmin4
    profiles: ["alat"]

  mailhog:
    image: mailhog/mailhog
    profiles: ["alat", "dev"]

  worker:
    build: .
    command: celery -A tugas worker
    profiles: ["pekerja"]</code></pre>

            <pre><code>docker compose up                          # hanya api & db
docker compose --profile alat up           # + pgadmin & mailhog
docker compose --profile "*" up            # semuanya</code></pre>

            <h3>depends_on dengan Kondisi — Menghentikan Balapan Startup</h3>
            <div class="alert alert-danger">
                <strong>🚫 depends_on biasa hanya menunggu kontainer MENYALA</strong><br>
                Ia tidak menunggu layanan di dalamnya <em>siap melayani</em>. Kontainer PostgreSQL menyala dalam sepersekian detik, tetapi butuh beberapa detik lagi sebelum menerima koneksi. Aplikasi Anda akan gagal terhubung lalu mati — inilah penyebab masalah "kadang jalan, kadang tidak" yang sangat sering ditemui.
            </div>

            <pre><code>services:
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_PASSWORD: rahasia
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 10s

  redis:
    image: redis:8-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      retries: 5

  migrasi:
    build: .
    command: alembic upgrade head
    depends_on:
      db: { condition: service_healthy }

  api:
    build: .
    depends_on:
      db:      { condition: service_healthy }
      redis:   { condition: service_healthy }
      migrasi: { condition: service_completed_successfully }</code></pre>

            <table class="tech-table">
                <thead><tr><th>Kondisi</th><th>Menunggu sampai</th></tr></thead>
                <tbody>
                    <tr><td><code>service_started</code></td><td>Kontainer menyala (perilaku bawaan)</td></tr>
                    <tr><td><code>service_healthy</code></td><td>Health check melaporkan sehat</td></tr>
                    <tr><td><code>service_completed_successfully</code></td><td>Kontainer selesai dengan kode keluar 0</td></tr>
                </tbody>
            </table>

            <h3>Berkas Berlapis untuk Dev dan Produksi</h3>
            <pre><code># compose.yaml — dasar bersama
services:
  api:
    image: registry.contoh.com/app:\${TAG:-latest}
    environment:
      DATABASE_URL: postgresql://postgres:rahasia@db:5432/app
    depends_on:
      db: { condition: service_healthy }

  db:
    image: postgres:17-alpine
    volumes: [data_db:/var/lib/postgresql/data]

volumes:
  data_db:</code></pre>

            <pre><code># compose.override.yaml — otomatis dipakai saat pengembangan
services:
  api:
    build: .
    ports: ["8000:8000"]
    environment:
      DEBUG: "true"
    develop:
      watch:
        - action: sync
          path: ./app
          target: /app/app</code></pre>

            <pre><code># compose.prod.yaml — dipanggil eksplisit
services:
  api:
    restart: unless-stopped
    deploy:
      replicas: 3
      resources:
        limits: { memory: 512M }
    logging:
      driver: json-file
      options: { max-size: "10m", max-file: "3" }</code></pre>

            <pre><code>docker compose up                                    # dasar + override otomatis
docker compose -f compose.yaml -f compose.prod.yaml up -d</code></pre>

            <h3>Kesalahan Umum</h3>
            <div class="alert alert-warning">
                <strong>⚠️ Rotasi log sering terlupakan</strong><br>
                Tanpa opsi <code>logging</code>, berkas log kontainer tumbuh tanpa batas sampai memenuhi disk server. Ini penyebab pemadaman yang membingungkan karena gejalanya muncul berbulan-bulan setelah deploy. Selalu setel <code>max-size</code> dan <code>max-file</code>.
            </div>

            <pre><code># ❌ Rahasia langsung di berkas yang masuk git
environment:
  DB_PASSWORD: rahasia123

# ✅ Dari berkas .env yang diabaikan git
environment:
  DB_PASSWORD: \${DB_PASSWORD:?wajib diisi}

# ✅ Atau memakai secret Compose
secrets:
  db_password:
    file: ./rahasia/db_password.txt

services:
  api:
    secrets: [db_password]
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password</code></pre>

            <pre><code># Perintah yang berguna
docker compose config              # tampilkan hasil gabungan akhir
docker compose ps --format json
docker compose logs -f --tail=100 api
docker compose exec api sh
docker compose down -v             # ⚠️ -v juga MENGHAPUS volume beserta datanya</code></pre>
        `,
        quiz: {
            question: "Aplikasi sering gagal menyala dengan error 'connection refused' ke database meski sudah memakai depends_on. Apa penyebab dan solusinya?",
            options: [
                "Jaringan Compose belum dibuat; jalankan docker network create terlebih dahulu",
                "depends_on biasa hanya menunggu kontainer menyala, bukan siap melayani; gunakan healthcheck pada db dan condition: service_healthy",
                "Port database belum dipublikasikan ke host",
                "Versi Compose terlalu lama"
            ],
            correct: 1,
            explanation: "Kontainer PostgreSQL berstatus 'running' jauh sebelum ia siap menerima koneksi. depends_on bawaan hanya menunggu status running, sehingga aplikasi mencoba terhubung terlalu cepat. Menambahkan healthcheck pada layanan database dan memakai condition: service_healthy membuat Compose benar-benar menunggu kesiapannya."
        }
    },
    {
        id: 14,
        title: "14. VS Code Integration & Docker Developer Tools",
        category: "Fundamentals",
        timestamp: "03:22:40",
        seconds: 12160,
        desc: "Penggunaan Ekstensi Docker di VS Code, Dev Containers, & inspection file sistem kontainer langsung dari IDE.",
        article: `
            <h2>Integrasi VS Code & Developer Tools</h2>
            <p>Visual Studio Code menyediakan ekosistem ekstensi Docker yang sangat canggih untuk meningkatkan produktivitas pengembang.</p>

            <h3>Fitur Utama Ekstensi Docker VS Code:</h3>
            <ul>
                <li><strong>Syntax Highlighting & Autocomplete:</strong> Membantu penulisan <code>Dockerfile</code> dan <code>docker-compose.yml</code> tanpa salah sintaks.</li>
                <li><strong>Container & Image Explorer:</strong> Melihat daftar kontainer berjalan, menghentikan, menghapus, atau melihat log hanya dengan 1-klik mouse.</li>
                <li><strong>Attach Shell:</strong> Klik kanan pada kontainer -> "Attach Shell" untuk langsung membuka terminal di dalam kontainer.</li>
                <li><strong>Dev Containers (Remote - Containers):</strong> Mengembangkan kode program langsung di dalam lingkungan kontainer tanpa perlu menginstal SDK/runtime di OS lokal komputer Anda.</li>
            </ul>

            <div class="alert alert-info">
                <strong>💡 Dev Containers:</strong> Dengan Dev Containers, seluruh anggota tim memiliki lingkungan VS Code yang persis sama termasuk versi bahasa, linter, dan extension!
            </div>
        `,
        quiz: {
            question: "Fitur VS Code manakah yang memungkinkan pengembang untuk membuat lingkungan koding yang terisolasi total di dalam kontainer Docker tanpa menginstal SDK di komputer lokal?",
            options: [
                "GitLens Extension",
                "Dev Containers (Remote - Containers)",
                "Live Server",
                "Prettier Code Formatter"
            ],
            correct: 1,
            explanation: "Dev Containers memungkinkan penulisan dan debugging kode langsung di dalam kontainer Docker yang disesuaikan."
        }
    },
    {
        id: 15,
        title: "15. Writing Dockerfiles & Building Custom Images",
        category: "Dockerfile",
        timestamp: "03:40:00",
        seconds: 13200,
        desc: "Instruksi dasar Dockerfile: FROM, WORKDIR, COPY, RUN, ENV, EXPOSE, CMD, & pembuatan image dengan docker build.",
        article: `
            <h2>Menulis Dockerfile & Build Custom Image</h2>
            <p><strong>Dockerfile</strong> adalah naskah instruksi teks sederhana yang berisi langkah-langkah untuk membangun sebuah **Custom Docker Image** dari awal.</p>

            <h3>Instruksi Utama dalam Dockerfile:</h3>
            <ul>
                <li><code>FROM</code>: Menentukan base image awal (misal: <code>node:22-alpine</code>).</li>
                <li><code>WORKDIR</code>: Menentukan direktori kerja di dalam kontainer.</li>
                <li><code>COPY</code>: Menyalin file dari komputer host ke dalam kontainer.</li>
                <li><code>RUN</code>: Menjalankan perintah shell saat proses **Build** image (misal: <code>npm install</code>).</li>
                <li><code>ENV</code>: Menentukan variabel lingkungan bawaan.</li>
                <li><code>EXPOSE</code>: Menginformasikan port yang digunakan oleh kontainer.</li>
                <li><code>CMD</code>: Menentukan perintah utama yang dieksekusi saat kontainer **Dijalankan (Run)**.</li>
            </ul>

            <h3>Contoh Dockerfile Aplikasi Node.js:</h3>
            <pre><code># 1. Base image
FROM node:22-alpine

# 2. Set direktori kerja
WORKDIR /app

# 3. Copy package file & install dependensi
COPY package*.json ./
RUN npm install --production

# 4. Copy seluruh kode sumber aplikasi
COPY . .

# 5. Expose port aplikasi
EXPOSE 3000

# 6. Perintah eksekusi aplikasi
CMD ["node", "server.js"]</code></pre>

            <h3>Perintah Membangun Image (docker build):</h3>
            <pre><code># Build image dengan nama 'my-node-app' dan tag 'v1.0' dari direktori saat ini (.)
docker build -t my-node-app:v1.0 .</code></pre>
        `,
        quiz: {
            question: "Manakah perbedaan mendasar antara instruksi 'RUN' dan 'CMD' di dalam sebuah Dockerfile?",
            options: [
                "RUN dieksekusi saat proses Build image; CMD dieksekusi saat Kontainer dijalankan",
                "CMD dieksekusi saat proses Build image; RUN dieksekusi saat Kontainer dijalankan",
                "RUN dan CMD memiliki fungsi yang 100% sama tanpa perbedaan",
                "RUN hanya bisa digunakan untuk menghapus file"
            ],
            correct: 0,
            explanation: "'RUN' dieksekusi saat membuat image (build time) untuk menginstal paket, sedangkan 'CMD' adalah perintah default saat kontainer di-run."
        }
    },
    {
        id: 16,
        title: "16. Docker Image Layers & Build Caching",
        category: "Dockerfile",
        timestamp: "03:55:00",
        seconds: 14100,
        desc: "Memahami arsitektur Layer Image, mekanisme caching Docker, optimasi urutan COPY, & file .dockerignore.",
        article: `
            <h2>Docker Image Layers & Build Caching</h2>
            <p>Setiap instruksi di dalam Dockerfile (seperti <code>RUN</code>, <code>COPY</code>, <code>ADD</code>) menghasilkan sebuah **Read-Only Layer** baru di atas layer sebelumnya.</p>

            <h3>Mekanisme Build Cache Docker</h3>
            <p>Jika tidak ada perubahan pada suatu layer dan layer-layer sebelumnya, Docker akan memanfaatkan **Build Cache** sehingga proses build berikutnya selesai dalam hitungan detik!</p>

            <div class="alert alert-tip">
                <strong>⚡ Trik Optimasi Urutan Dockerfile:</strong><br>
                Selalu letakkan instruksi yang jarang berubah (seperti menginstal dependensi <code>package.json</code> atau <code>go.mod</code>) di bagian ATAS, dan kode sumber aplikasi yang sering diubah di bagian BAWAH.
            </div>

            <h4>Contoh Struktur DOKERFILE SALAH (Lambat):</h4>
            <pre><code>COPY . .
RUN npm install # <--- npm install akan SELALU diulang setiap kali ada 1 baris kode berubah!</code></pre>

            <h4>Contoh Struktur DOKERFILE BENAR (Cepat dengan Cache):</h4>
            <pre><code>COPY package*.json ./
RUN npm install # <--- Di-cache! Hanya diulang jika package.json berubah
COPY . .</code></pre>

            <h3>File <code>.dockerignore</code></h3>
            <p>Mirip dengan <code>.gitignore</code>, file <code>.dockerignore</code> mencegah file yang tidak perlu (seperti <code>node_modules</code>, <code>.git</code>, file log) terikut saat perintah <code>COPY . .</code> dijalankan.</p>
        `,
        quiz: {
            question: "Mengapa disarankan untuk melakukan 'COPY package.json' dan 'RUN npm install' sebelum melakukan 'COPY . .' pada Dockerfile?",
            options: [
                "Agar file package.json dapat diubah oleh kontainer",
                "Untuk memanfaatkan Docker Build Cache sehingga 'npm install' tidak dijalankan ulang jika kode aplikasi berubah",
                "Karena NPM tidak mendukung instalasi setelah salinan kode",
                "Agar ukuran image menjadi dua kali lebih kecil secara otomatis"
            ],
            correct: 1,
            explanation: "Dengan memisahkan penyalinan file manifes dependensi, Docker dapat meng-cache hasil 'RUN npm install' selama tidak ada perubahan pada package.json."
        }
    },
    {
        id: 17,
        title: "17. CMD vs ENTRYPOINT & Multi-Stage Builds",
        category: "Dockerfile",
        timestamp: "04:04:40",
        seconds: 14680,
        desc: "Perbedaan CMD vs ENTRYPOINT, bentuk Shell vs Exec form, & teknik Multi-Stage Build untuk memperkecil ukuran image.",
        article: `
            <h2>CMD vs ENTRYPOINT & Multi-Stage Builds</h2>

            <h3>1. Perbedaan CMD vs ENTRYPOINT</h3>
            <ul>
                <li><strong>CMD:</strong> Menentukan argumen/perintah default yang <em>dapat ditimpa (overridden)</em> dengan mudah saat <code>docker run</code>.</li>
                <li><strong>ENTRYPOINT:</strong> Menentukan executable utama kontainer yang <em>tetap dieksekusi</em> sebagai biner utama.</li>
            </ul>

            <pre><code># Kombinasi Praktis Terbaik:
ENTRYPOINT ["node"]
CMD ["app.js"]

# Jika dijalankan 'docker run my-image', eksekusi: node app.js
# Jika dijalankan 'docker run my-image test.js', eksekusi: node test.js</code></pre>

            <h3>2. Multi-Stage Builds (Teknik Emas Produksi)</h3>
            <p>Dalam bahasa seperti Go, Rust, Java, atau Angular/React, kita membutuhkan SDK/Compiler yang besar saat build time, tetapi saat runtime produksi hanya membutuhkan file biner hasil kompilasi.</p>

            <p>**Multi-Stage Build** memungkinkan penggunaan beberapa instruksi <code>FROM</code> dalam 1 Dockerfile untuk membuang seluruh alat compiler dan menghasilkan image produksi super kecil (beberapa MB saja)!</p>

            <pre><code># Stage 1: Build Phase
FROM golang:1.26-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o main-app .

# Stage 2: Production Phase (Minimal Image)
FROM alpine:latest
WORKDIR /root/
# Salin HANYA file biner dari stage builder
COPY --from=builder /app/main-app .
EXPOSE 8080
CMD ["./main-app"]</code></pre>

            <div class="alert alert-info">
                <strong>📈 Hasil Optimasi:</strong> Ukuran image berkurang drastis dari **800 MB** (Golang SDK) menjadi hanya **15 MB** (Alpine + Binary)!
            </div>
        `,
        quiz: {
            question: "Apa tujuan utama dari menerapkan teknik Multi-Stage Build pada pembuatan Docker Image?",
            options: [
                "Menjalankan beberapa kontainer sekaligus dalam satu port",
                "Memisahkan tahap kompilasi dan menyalin hanya file biner akhir ke image minimal untuk memperkecil ukuran image produksi",
                "Mengubah file Dockerfile menjadi skrip bash",
                "Menghapus kebutuhan akan Linux Alpine"
            ],
            correct: 1,
            explanation: "Multi-Stage Build membuang alat-alat build/compiler yang tidak dibutuhkan di produksi, menghasilkan image akhir yang jauh lebih kecil dan aman."
        }
    },
    {
        id: 18,
        title: "18. BuildKit & Buildx - Build Modern yang Cepat",
        category: "Dockerfile",
        timestamp: "00:00:00",
        seconds: null,
        desc: "Cache mount, secret mount, build paralel, dan image multi-arsitektur dengan mesin build generasi baru.",
        article: `
            <h2>BuildKit: Mesin Build Default Docker</h2>
            <p>BuildKit menggantikan mesin build lama sepenuhnya. Ia membangun graf dependensi dari Dockerfile Anda, menjalankan tahapan yang tidak saling bergantung <strong>secara paralel</strong>, dan hanya mengirim berkas yang benar-benar dibutuhkan ke daemon.</p>

            <div class="alert alert-info">
                <strong>💡 Aktifkan sintaks terbaru</strong><br>
                Tambahkan baris ini di paling atas Dockerfile untuk membuka semua fitur BuildKit terbaru, terlepas dari versi Docker yang terpasang:
                <pre><code># syntax=docker/dockerfile:1</code></pre>
            </div>

            <h3>1. Cache Mount — Berhenti Mengunduh Dependensi Berulang Kali</h3>
            <p>Masalah klasik: setiap kali <code>package.json</code> berubah sedikit saja, seluruh <code>npm install</code> dijalankan dari nol dan mengunduh ulang semuanya.</p>

            <pre><code># syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
# Cache npm BERTAHAN antar build, bahkan ketika layer ini di-rebuild
RUN --mount=type=cache,target=/root/.npm \\
    npm ci

COPY . .
RUN npm run build</code></pre>

            <p>Pola yang sama untuk ekosistem lain:</p>
            <pre><code># Go
RUN --mount=type=cache,target=/go/pkg/mod \\
    --mount=type=cache,target=/root/.cache/go-build \\
    go build -o /app/server ./cmd/server

# Python (pip)
RUN --mount=type=cache,target=/root/.cache/pip \\
    pip install -r requirements.txt

# APT — perlu menonaktifkan pembersihan otomatis Docker
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \\
    --mount=type=cache,target=/var/lib/apt,sharing=locked \\
    rm -f /etc/apt/apt.conf.d/docker-clean && \\
    apt-get update && apt-get install -y --no-install-recommends ffmpeg</code></pre>

            <div class="alert alert-tip">
                <strong>📌 Bedanya dengan layer cache biasa</strong><br>
                Layer cache menjadi tidak sah begitu ada berkas yang berubah. Cache mount adalah direktori terpisah yang <em>bertahan di luar</em> layer — jadi meski layer harus dibangun ulang, isi cache-nya masih ada. Untuk proyek besar, ini sering memangkas waktu build dari beberapa menit menjadi beberapa detik.
            </div>

            <h3>2. Secret Mount — Rahasia yang Tidak Bocor ke Image</h3>
            <div class="alert alert-danger">
                <strong>🚫 Cara yang salah dan berbahaya</strong>
                <pre><code>ARG NPM_TOKEN
RUN npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN
# Token ini TERSIMPAN PERMANEN di riwayat layer image.
# Siapa pun yang menarik image Anda bisa membacanya dengan
# "docker history" atau sekadar mengekstrak layer-nya.</code></pre>
            </div>

            <pre><code># Cara yang benar — rahasia hanya ada selama perintah berjalan
RUN --mount=type=secret,id=npm_token \\
    NPM_TOKEN=$(cat /run/secrets/npm_token) npm ci</code></pre>

            <pre><code>docker build --secret id=npm_token,env=NPM_TOKEN -t app:1.0 .
docker build --secret id=npm_token,src=./token.txt -t app:1.0 .

# Untuk git clone repositori privat, pakai SSH agent forwarding
RUN --mount=type=ssh git clone git@github.com:org/privat.git
# docker build --ssh default -t app:1.0 .</code></pre>

            <h3>3. Image Multi-Arsitektur</h3>
            <p>Laptop Apple Silicon memakai arm64, sementara sebagian besar server memakai amd64. Image yang dibangun di laptop tidak akan berjalan di server bila arsitekturnya tidak cocok.</p>

            <pre><code># Buat builder yang mendukung multi-platform
docker buildx create --name multi --driver docker-container --use
docker buildx inspect --bootstrap

# Bangun & dorong untuk dua arsitektur sekaligus
docker buildx build \\
  --platform linux/amd64,linux/arm64 \\
  -t registry.contoh.com/app:2.4.0 \\
  --push .</code></pre>

            <div class="alert alert-warning">
                <strong>⚠️ Build lintas arsitektur bisa sangat lambat</strong><br>
                Membangun arm64 di mesin amd64 memakai emulasi QEMU yang bisa 10–20 kali lebih lambat. Untuk pipeline produksi, jauh lebih baik memakai runner asli untuk tiap arsitektur lalu menggabungkan hasilnya menjadi satu manifest, ketimbang mengemulasi semuanya di satu mesin.
            </div>

            <h3>4. Cache Terdistribusi untuk CI</h3>
            <p>Runner CI selalu dimulai dari nol, sehingga cache lokal tidak pernah terpakai. Solusinya adalah menyimpan cache di registry.</p>

            <pre><code>docker buildx build \\
  --cache-from type=registry,ref=registry.contoh.com/app:buildcache \\
  --cache-to   type=registry,ref=registry.contoh.com/app:buildcache,mode=max \\
  -t registry.contoh.com/app:2.4.0 --push .</code></pre>

            <p><code>mode=max</code> menyimpan cache untuk <em>semua</em> tahap termasuk tahap builder, bukan hanya layer akhir. Ukurannya lebih besar, tetapi tingkat cache hit-nya jauh lebih tinggi.</p>

            <h3>5. Heredoc — Dockerfile yang Lebih Terbaca</h3>
            <pre><code># syntax=docker/dockerfile:1
RUN &lt;&lt;EOF
set -eux
apt-get update
apt-get install -y --no-install-recommends curl ca-certificates
rm -rf /var/lib/apt/lists/*
EOF

COPY &lt;&lt;EOF /app/config.json
{
  "lingkungan": "produksi",
  "log_level": "info"
}
EOF</code></pre>

            <h3>6. Memeriksa Hasil Build</h3>
            <pre><code># Melihat riwayat build beserta waktu tiap langkah
docker buildx history

# Membongkar isi image tanpa menjalankannya
docker buildx imagetools inspect registry.contoh.com/app:2.4.0

# Melihat berapa besar tiap layer
docker history app:2.4.0 --no-trunc

# Membandingkan ukuran
docker images app --format "{{.Tag}}\\t{{.Size}}"</code></pre>
        `,
        quiz: {
            question: "Mengapa memakai ARG untuk melewatkan token rahasia ke dalam build sangat berbahaya?",
            options: [
                "Karena ARG memperlambat proses build secara signifikan",
                "Karena nilai ARG tersimpan permanen di riwayat layer image, sehingga siapa pun yang menarik image tersebut dapat membacanya",
                "Karena ARG hanya mendukung nilai berupa angka",
                "Karena ARG tidak bisa dipakai bersama multi-stage build"
            ],
            correct: 1,
            explanation: "Setiap instruksi menghasilkan layer, dan nilai ARG yang terpakai di dalamnya ikut terekam dalam metadata maupun isi layer. Perintah 'docker history' atau sekadar mengekstrak layer sudah cukup untuk membocorkannya. Gunakan '--mount=type=secret' agar rahasia hanya tersedia selama perintah berjalan dan tidak pernah masuk ke layer mana pun."
        }
    },
    {
        id: 19,
        title: "19. Publishing Images to Docker Hub & Image Registry",
        category: "Fundamentals",
        timestamp: "04:54:00",
        seconds: 17640,
        desc: "Workflow publikasi image: docker login, tagging image, docker push, private registries, & vulnerability scanning.",
        article: `
            <h2>Publikasi Image ke Docker Hub & Registry</h2>
            <p>Setelah berhasil membuat custom Docker Image, kita dapat mempublikasikannya ke <strong>Docker Hub</strong> atau Private Registry (seperti AWS ECR, Google Artifact Registry) agar dapat di-deploy oleh server lain.</p>

            <h3>Langkah-Langkah Push Image ke Docker Hub:</h3>

            <h4>1. Login ke Docker Hub</h4>
            <pre><code>docker login</code></pre>

            <h4>2. Tagging Image (docker tag)</h4>
            <p>Nama image harus diawali dengan **Username Docker Hub Anda**:</p>
            <pre><code># Format: docker tag [NAMA_LOCAL] [USERNAME_DOCKERHUB]/[NAMA_REPO]:[TAG]
docker tag my-node-app:v1.0 usernameanda/my-node-app:1.0.0
docker tag my-node-app:v1.0 usernameanda/my-node-app:latest</code></pre>

            <h4>3. Push Image (docker push)</h4>
            <pre><code>docker push usernameanda/my-node-app:1.0.0
docker push usernameanda/my-node-app:latest</code></pre>

            <h3>Pemindaian Kerentanan (Vulnerability Scanning)</h3>
            <p>Sebelum mendepot image ke produksi, selalu periksa kerentanan keamanan menggunakan Docker Scout atau Trivy:</p>
            <pre><code>docker scout cve my-node-app:v1.0</code></pre>
        `,
        quiz: {
            question: "Format penamaan tag manakah yang benar sebelum Anda melakukan 'docker push' image ke Docker Hub?",
            options: [
                "localhost:8080/my-image",
                "username_dockerhub/nama_repository:tag",
                "docker.internal/my-image:latest",
                "sudo/bin/my-image"
            ],
            correct: 1,
            explanation: "Agar Docker Hub mengenali tujuan push, image harus di-tag dengan sintaks '<username_dockerhub>/<nama_repo>:<tag>'."
        }
    },
    {
        id: 20,
        title: "20. Keamanan Kontainer & Pemindaian Kerentanan",
        category: "Fundamentals",
        timestamp: "00:00:00",
        seconds: null,
        desc: "Mengecilkan permukaan serangan: pengguna non-root, base image minimal, rootless mode, capability, dan pemindaian otomatis di CI.",
        article: `
            <h2>Kontainer Bukan Batas Keamanan yang Sempurna</h2>
            <div class="alert alert-danger">
                <strong>🚫 Kesalahpahaman yang berbahaya</strong><br>
                Kontainer <strong>berbagi kernel</strong> dengan host. Ini berbeda mendasar dari mesin virtual yang punya kernelnya sendiri. Kerentanan pada kernel atau kesalahan konfigurasi bisa membuat proses di dalam kontainer keluar ke host. Perlakukan kontainer sebagai <em>lapisan isolasi</em>, bukan sebagai jaminan keamanan mutlak.
            </div>

            <h3>1. Jangan Pernah Berjalan sebagai Root</h3>
            <pre><code>FROM node:22-alpine

# Buat pengguna khusus dengan UID tetap
RUN addgroup -g 10001 -S aplikasi && \\
    adduser -u 10001 -S aplikasi -G aplikasi

WORKDIR /app
COPY --chown=aplikasi:aplikasi . .
RUN npm ci --omit=dev

USER 10001                  # pakai UID numerik, bukan nama
EXPOSE 8080
CMD ["node", "server.js"]</code></pre>

            <div class="alert alert-tip">
                <strong>📌 Kenapa UID numerik, bukan nama pengguna</strong><br>
                Kubernetes <code>runAsNonRoot: true</code> memeriksa UID, dan ia tidak bisa menerjemahkan nama pengguna menjadi UID sebelum kontainer berjalan. Menuliskan <code>USER 10001</code> membuat pemeriksaan itu berhasil. Pakai UID di atas 10000 untuk menghindari bentrok dengan pengguna sistem.
            </div>

            <h3>2. Pilih Base Image Sekecil Mungkin</h3>
            <table class="tech-table">
                <thead><tr><th>Base image</th><th>Ukuran kira-kira</th><th>Ada shell?</th><th>Catatan</th></tr></thead>
                <tbody>
                    <tr><td><code>ubuntu:24.04</code></td><td>~78 MB</td><td>Ya</td><td>Permukaan serangan besar</td></tr>
                    <tr><td><code>debian:bookworm-slim</code></td><td>~75 MB</td><td>Ya</td><td>Pilihan seimbang</td></tr>
                    <tr><td><code>alpine:3</code></td><td>~8 MB</td><td>Ya</td><td>musl libc — bisa bermasalah untuk sebagian binary</td></tr>
                    <tr><td><code>gcr.io/distroless/static</code></td><td>~2 MB</td><td><strong>Tidak</strong></td><td>Sangat aman; hanya untuk binary statis</td></tr>
                    <tr><td><code>scratch</code></td><td>0 MB</td><td>Tidak</td><td>Kosong total — ideal untuk Go</td></tr>
                </tbody>
            </table>

            <pre><code># Contoh Go: dari builder ke scratch
FROM golang:1.26-alpine AS builder
WORKDIR /build
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /server ./cmd/server

FROM scratch
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /server /server
USER 10001
ENTRYPOINT ["/server"]
# Hasil akhir: beberapa MB saja, tanpa shell, tanpa package manager,
# tanpa satu pun utilitas yang bisa dipakai penyerang.</code></pre>

            <div class="alert alert-warning">
                <strong>⚠️ Tanpa shell, debugging berubah caranya</strong><br>
                Anda tidak bisa lagi <code>docker exec -it … sh</code> pada image distroless atau scratch. Gunakan <code>docker debug</code>, atau di Kubernetes pakai <em>ephemeral container</em>: <code>kubectl debug -it pod/nama --image=busybox --target=nama-kontainer</code>. Keamanan yang lebih baik memang menukar sedikit kemudahan debug.
            </div>

            <h3>3. Batasi Kemampuan Saat Runtime</h3>
            <pre><code>docker run -d \\
  --read-only \\                          # filesystem tidak bisa ditulisi
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \\
  --cap-drop=ALL \\                       # buang SEMUA capability
  --cap-add=NET_BIND_SERVICE \\           # lalu tambahkan yang benar-benar perlu
  --security-opt=no-new-privileges:true \\
  --memory=512m --cpus=1.0 \\
  --pids-limit=200 \\
  --user 10001:10001 \\
  app:2.4.0</code></pre>

            <div class="alert alert-info">
                <strong>💡 Apa arti tiap opsi</strong>
                <ul>
                    <li><code>--read-only</code> — penyerang tidak bisa menuliskan skrip atau binary ke dalam kontainer.</li>
                    <li><code>--cap-drop=ALL</code> — mencabut hak istimewa kernel seperti memuat modul dan mengubah aturan jaringan.</li>
                    <li><code>--no-new-privileges</code> — mencegah eskalasi lewat binary ber-setuid.</li>
                    <li><code>--pids-limit</code> — mencegah fork bomb menghabiskan kapasitas proses host.</li>
                </ul>
            </div>

            <h3>4. Rootless Mode</h3>
            <p>Secara bawaan, daemon Docker berjalan sebagai root. Siapa pun yang bisa mengakses soket Docker pada dasarnya <strong>memiliki hak root di host</strong> — cukup dengan menjalankan kontainer yang me-mount direktori root host.</p>

            <pre><code>curl -fsSL https://get.docker.com/rootless | sh

export PATH=$HOME/bin:$PATH
export DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock

systemctl --user enable --now docker</code></pre>

            <div class="alert alert-danger">
                <strong>🚫 Jangan pernah me-mount soket Docker ke dalam kontainer</strong>
                <pre><code>-v /var/run/docker.sock:/var/run/docker.sock   # ❌ setara memberi akses root</code></pre>
                Ini sering ditemukan pada kontainer CI dan alat pemantauan. Bila kontainer tersebut diretas, penyerang langsung menguasai seluruh host. Bila memang butuh membangun image di dalam kluster, pakai builder tanpa daemon seperti Kaniko atau BuildKit dalam mode rootless.
            </div>

            <h3>5. Pemindaian Kerentanan</h3>
            <pre><code># Docker Scout (bawaan Docker Desktop & CLI)
docker scout quickview app:2.4.0
docker scout cves app:2.4.0
docker scout recommendations app:2.4.0    # saran base image yang lebih aman

# Trivy — pemindai open source yang sangat populer
trivy image --severity HIGH,CRITICAL app:2.4.0
trivy image --exit-code 1 --severity CRITICAL app:2.4.0   # gagalkan pipeline
trivy fs --scanners secret,misconfig .    # pindai kode & konfigurasi juga</code></pre>

            <pre><code># Di GitHub Actions
- name: Pindai image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: app:\${{ github.sha }}
    format: sarif
    output: trivy.sarif
    severity: CRITICAL,HIGH
    exit-code: '1'
    ignore-unfixed: true     # jangan gagalkan build karena CVE tanpa perbaikan</code></pre>

            <div class="alert alert-warning">
                <strong>⚠️ Kebijakan pemindaian harus realistis</strong><br>
                Menggagalkan build untuk <em>setiap</em> CVE terdengar disiplin, tetapi hasilnya tim akan mematikan pemindaiannya sama sekali. Pendekatan yang berkelanjutan: gagalkan hanya untuk <strong>CRITICAL yang sudah ada perbaikannya</strong> (<code>--ignore-unfixed</code>), laporkan sisanya sebagai peringatan, dan jadwalkan pembaruan base image secara berkala — itu saja biasanya sudah menutup sebagian besar temuan.
            </div>

            <h3>6. Menandatangani & Melacak Asal Image</h3>
            <pre><code># Bangkitkan SBOM dan bukti asal (provenance)
docker buildx build --sbom=true --provenance=true -t app:2.4.0 --push .

# Tandatangani image dengan cosign (keyless, memakai OIDC)
cosign sign registry.contoh.com/app:2.4.0
cosign verify registry.contoh.com/app:2.4.0</code></pre>

            <p>SBOM (Software Bill of Materials) mencatat setiap paket beserta versinya di dalam image. Ketika muncul kerentanan besar seperti Log4Shell, SBOM memungkinkan Anda menjawab "image mana saja yang terdampak" dalam hitungan menit, bukan berhari-hari.</p>

            <h3>7. Daftar Periksa</h3>
            <table class="tech-table">
                <thead><tr><th>Periksa</th><th>Kenapa</th></tr></thead>
                <tbody>
                    <tr><td><code>USER</code> non-root dengan UID numerik</td><td>Membatasi dampak bila proses dibajak</td></tr>
                    <tr><td>Base image minimal &amp; tag spesifik</td><td>Mengecilkan permukaan serangan; <code>:latest</code> tidak dapat direproduksi</td></tr>
                    <tr><td><code>.dockerignore</code> memuat <code>.git</code>, <code>.env</code></td><td>Mencegah rahasia &amp; riwayat ikut tersalin</td></tr>
                    <tr><td>Rahasia lewat secret mount, bukan ARG</td><td>Rahasia tidak masuk ke layer</td></tr>
                    <tr><td><code>--cap-drop=ALL</code> saat runtime</td><td>Mencabut hak istimewa kernel</td></tr>
                    <tr><td>Batas memori &amp; PID disetel</td><td>Mencegah satu kontainer menghabiskan host</td></tr>
                    <tr><td>Pemindaian di pipeline CI</td><td>Menangkap CVE sebelum sampai produksi</td></tr>
                    <tr><td>Soket Docker tidak pernah di-mount</td><td>Mencegah eskalasi ke root host</td></tr>
                </tbody>
            </table>
        `,
        quiz: {
            question: "Mengapa me-mount /var/run/docker.sock ke dalam sebuah kontainer sangat berbahaya?",
            options: [
                "Karena membuat kontainer berjalan lebih lambat",
                "Karena akses ke soket Docker setara dengan hak root di host — kontainer itu bisa menjalankan kontainer baru yang me-mount seluruh filesystem host",
                "Karena soket Docker hanya boleh diakses dari jaringan",
                "Karena hal itu membuat image menjadi jauh lebih besar"
            ],
            correct: 1,
            explanation: "Daemon Docker berjalan sebagai root. Siapa pun yang dapat berbicara ke soketnya bisa memerintahkan pembuatan kontainer istimewa yang me-mount direktori root host, sehingga menguasai seluruh mesin. Bila perlu membangun image di dalam kluster, gunakan builder tanpa daemon seperti Kaniko atau BuildKit rootless."
        }
    },
    {
        id: 21,
        title: "21. Production Deployment & DevOps Best Practices",
        category: "Architecture",
        timestamp: "05:12:00",
        seconds: 18720,
        desc: "Praktik terbaik DevOps: User Non-root, Pembatasan Memori/CPU, Logging Drivers, & Integrasi CI/CD Pipeline.",
        article: `
            <h2>Praktik Terbaik Deploy Produksi & DevOps</h2>
            <p>Menjalankan kontainer di lingkungan produksi membutuhkan standar keamanan dan keandalan yang tinggi.</p>

            <h3>Daftar Periksa (Checklist) Keamanan & Performa Produksi:</h3>

            <h4>1. Jangan Pernah Jalankan Aplikasi Sebagai User Root</h4>
            <p>Secara default, kontainer berjalan sebagai root. Jika ada celah keamanan, peretas dapat mengontrol sistem host. Selalu buat non-root user di Dockerfile:</p>

            <pre><code># Menambahkan non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser</code></pre>

            <h4>2. Batasi Sumber Daya (Resource Limits)</h4>
            <p>Cegah satu kontainer menghabiskan seluruh RAM/CPU server (OOM - Out Of Memory Kill):</p>
            <pre><code>docker run -d --name my-app --memory="512m" --cpus="1.5" my-image:1.0</code></pre>

            <h4>3. Gunakan Image Resmi & Tag Spesifik</h4>
            <p>Hindari menggunakan tag <code>:latest</code> di produksi karena versi dapat berubah sewaktu-waktu. Gunakan tag versi spesifik seperti <code>node:22.17.1-alpine</code>.</p>

            <h4>4. Integrasi CI/CD Pipeline (GitHub Actions / GitLab CI)</h4>
            <p>Otomatiskan proses <code>docker build</code>, <code>docker test</code>, dan <code>docker push</code> setiap kali ada Pull Request yang di-merge ke branch master.</p>

            <div class="alert alert-tip">
                <strong>🎉 Selamat!</strong> Anda telah menyelesaikan seluruh 21 modul masterclass Docker DevOps! Uji pemahaman total Anda dengan mengikuti Ujian Sertifikasi Akhir.
            </div>
        `,
        quiz: {
            question: "Mengapa sangat dilarang menggunakan user 'root' di dalam kontainer pada lingkungan produksi?",
            options: [
                "Karena user root membuat proses build image menjadi lebih lambat",
                "Karena jika kontainer diretas, peretas berpotensi mendapatkan akses root ke seluruh sistem Host OS",
                "Karena user root tidak mendukung fitur Port Forwarding",
                "Karena Docker Compose otomatis gagal jika ada user root"
            ],
            correct: 1,
            explanation: "Menjalankan aplikasi sebagai non-root user menerapkan prinsip 'least privilege' untuk meminimalisir risiko keamanan jika kontainer dieksploitasi."
        }
    }
];

// Soal Ujian Sertifikasi Akhir (20 Soal Komprehensif)
const finalExamQuestions = [
    {
        q: "1. Komponen Linux Kernel manakah yang membatasi penggunaan CPU & RAM untuk kontainer?",
        options: ["PID Namespace", "cgroups (Control Groups)", "MNT Namespace", "UTS Namespace"],
        correct: 1
    },
    {
        q: "2. Perintah CLI untuk melihat seluruh kontainer termasuk yang sudah mati adalah...",
        options: ["docker ps", "docker ps -a", "docker container list --live", "docker inspect --all"],
        correct: 1
    },
    {
        q: "3. Apa arti dari flag '-p 8080:80' pada perintah 'docker run'?",
        options: [
            "Memetakan port 8080 di kontainer ke port 80 di host",
            "Memetakan port 8080 di host ke port 80 di kontainer",
            "Membuka port 8080 dan 80 secara acak",
            "Membatasi jumlah memori sebesar 8080MB"
        ],
        correct: 1
    },
    {
        q: "4. Manakah jenis penyimpanan Docker yang dikelola penuh oleh Docker di /var/lib/docker/volumes/?",
        options: ["Bind Mount", "Named Volume", "Tmpfs Mount", "Host Directory"],
        correct: 1
    },
    {
        q: "5. Keunggulan utama Custom User-Defined Bridge Network adalah...",
        options: [
            "Memiliki DNS internal untuk komunikasi antar kontainer menggunakan hostname",
            "Menghilangkan kebutuhan port forwarding",
            "Membuat kontainer berjalan tanpa IP",
            "Otomatis mengompresi data"
        ],
        correct: 0
    },
    {
        q: "6. Instruksi Dockerfile manakah yang dieksekusi saat proses BUILD image?",
        options: ["CMD", "RUN", "ENTRYPOINT", "START"],
        correct: 1
    },
    {
        q: "7. Manakah instruksi yang dapat dengan mudah ditimpa (override) saat mengeksekusi 'docker run'?",
        options: ["FROM", "CMD", "WORKDIR", "ENV"],
        correct: 1
    },
    {
        q: "8. Apa kegunaan utama dari teknik Multi-Stage Build di Dockerfile?",
        options: [
            "Memperbesar ukuran image agar lebih stabil",
            "Memisahkan tahap build/compiler untuk menghasilkan image produksi yang sangat kecil",
            "Menjalankan multiple docker compose sekaligus",
            "Menginstal dua OS berbeda"
        ],
        correct: 1
    },
    {
        q: "9. File apakah yang digunakan untuk mengabaikan file lokal seperti node_modules agar tidak terikut saat 'COPY . .'?",
        options: [".gitignore", ".dockerignore", "docker-compose.ignore", ".env"],
        correct: 1
    },
    {
        q: "10. Perintah Docker Compose untuk menghentikan dan menghapus seluruh kontainer, network, & volume adalah...",
        options: ["docker compose stop", "docker compose down", "docker compose remove", "docker compose destroy"],
        correct: 1
    },
    {
        q: "11. Perintah untuk melihat log aplikasi kontainer secara real-time adalah...",
        options: ["docker logs -f <container>", "docker cat <container>", "docker tail <container>", "docker inspect <container>"],
        correct: 0
    },
    {
        q: "12. Perintah untuk masuk ke dalam sesi shell terminal kontainer adalah...",
        options: ["docker exec -it <container> sh", "docker open <container>", "docker connect <container>", "docker run -shell <container>"],
        correct: 0
    },
    {
        q: "13. Mengapa urutan 'COPY package.json' dipisahkan sebelum 'COPY . .' pada Dockerfile?",
        options: [
            "Untuk memaksimalkan penggunaan Docker Build Cache saat dependensi tidak berubah",
            "Agar file package.json terenkripsi",
            "Karena aturan wajib dari Node.js",
            "Tidak ada pengaruhnya"
        ],
        correct: 0
    },
    {
        q: "14. Perintah untuk mengunggah image ke Docker Hub adalah...",
        options: ["docker upload", "docker push", "docker export", "docker publish"],
        correct: 1
    },
    {
        q: "15. Manakah restart policy yang akan selalu merestart kontainer kecuali dihentikan manual oleh admin?",
        options: ["restart: always", "restart: unless-stopped", "restart: on-failure", "restart: no"],
        correct: 1
    },
    {
        q: "16. Service background utama Docker yang berjalan di Host OS bernama...",
        options: ["docker-cli", "dockerd (Docker Daemon)", "docker-hub", "docker-engine-ui"],
        correct: 1
    },
    {
        q: "17. Mengapa disarankan membuat user non-root di Dockerfile produksi?",
        options: [
            "Untuk mencegah eksploitasi peretas yang mendapatkan akses root ke host OS",
            "Agar file biner berjalan lebih cepat",
            "Karena root dilarang oleh Linux",
            "Agar bisa di-push ke Docker Hub"
        ],
        correct: 0
    },
    {
        q: "18. Flag apakah yang digunakan untuk mengimpor file berisi environment variables sekaligus?",
        options: ["-e", "--env-file", "-v", "--config"],
        correct: 1
    },
    {
        q: "19. Driver network bawaan yang menghubungkan kontainer ke internal virtual bridge adalah...",
        options: ["Host", "Bridge", "None", "Overlay"],
        correct: 1
    },
    {
        q: "20. Perintah untuk memeriksa konfigurasi detail JSON dari suatu kontainer adalah...",
        options: ["docker info", "docker inspect", "docker check", "docker status"],
        correct: 1
    }
];

// App State
let currentChapterIndex = 0;
let completedChapters = new Set(JSON.parse(localStorage.getItem('docker_completed_chapters') || '[]'));
let bookmarkedChapters = new Set(JSON.parse(localStorage.getItem('docker_bookmarked_chapters') || '[]'));
let userNotes = JSON.parse(localStorage.getItem('docker_user_notes') || '{}');
let activeCategoryFilter = 'ALL';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    renderSidebarChapters();
    loadChapter(0);
    updateOverallProgress();

    // Event Listener Search Input
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        renderSidebarChapters(query);
    });
});

// Render Sidebar Chapter List
function renderSidebarChapters(filterQuery = '') {
    const container = document.getElementById('chapterListContainer');
    container.innerHTML = '';

    chapters.forEach((chap, idx) => {
        // Filter Category & Search
        const matchCategory = activeCategoryFilter === 'ALL' || chap.category === activeCategoryFilter;
        const matchSearch = chap.title.toLowerCase().includes(filterQuery) || chap.desc.toLowerCase().includes(filterQuery);

        if (!matchCategory || !matchSearch) return;

        const isCompleted = completedChapters.has(chap.id);
        const isBookmarked = bookmarkedChapters.has(chap.id);
        const isActive = idx === currentChapterIndex;

        const itemEl = document.createElement('div');
        itemEl.className = `chapter-item ${isActive ? 'active' : ''}`;
        itemEl.onclick = () => loadChapter(idx);

        itemEl.innerHTML = `
            <div class="chapter-item-header">
                <span class="chapter-item-num">Modul ${chap.id}</span>
                <div>
                    ${isBookmarked ? '⭐ ' : ''}
                    ${isCompleted ? '✅' : '⚪'}
                </div>
            </div>
            <div class="chapter-item-title">${chap.title}</div>
            <div class="chapter-item-footer">
                <span class="badge badge-blue">${chap.category}</span>
                <span>⏱️ ${chap.timestamp}</span>
            </div>
        `;
        container.appendChild(itemEl);
    });
}

// Category Filter
function filterCategory(cat) {
    activeCategoryFilter = cat;
    document.querySelectorAll('.category-pill').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === cat || (cat === 'ALL' && btn.textContent === 'Semua'));
    });
    renderSidebarChapters(document.getElementById('searchInput').value.toLowerCase());
}

// Load Specific Chapter
function loadChapter(index) {
    currentChapterIndex = index;
    const chap = chapters[index];

    // Render Banner Info
    document.getElementById('chapterCategoryBadge').textContent = chap.category;
    document.getElementById('timestampText').textContent = `${chap.timestamp} (${chap.title})`;
    document.getElementById('videoTimestamp').style.display = chap.seconds === null ? 'none' : '';
    document.getElementById('chapterTitle').textContent = chap.title;
    document.getElementById('chapterDesc').textContent = chap.desc;

    // Buttons State
    updateHeaderActionButtons();

    // Tab 1: Theory
    document.getElementById('articleBody').innerHTML = chap.article;

    // Tab 2: Video
    kodelokaVideo(chap.seconds === null ? null : YOUTUBE_VIDEO_ID, { start: chap.seconds });

    // Tab 3: Playground Initial Setup
    document.getElementById('playgroundEditor').value = `docker run -d -p 8080:80 --name container_modul_${chap.id} nginx:alpine`;

    // Tab 4: Quiz
    renderQuiz(chap.quiz);

    // Tab 5: Notes
    document.getElementById('notesTextarea').value = userNotes[chap.id] || '';
    document.getElementById('saveNotesStatus').style.display = 'none';

    // Footer Progress
    document.getElementById('currentFooterProgress').textContent = `Modul ${index + 1} dari ${chapters.length}`;
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = index === chapters.length - 1;

    renderSidebarChapters(document.getElementById('searchInput').value.toLowerCase());
}

// Update Header Bookmark & Complete Buttons
function updateHeaderActionButtons() {
    const chap = chapters[currentChapterIndex];
    const isCompleted = completedChapters.has(chap.id);
    const isBookmarked = bookmarkedChapters.has(chap.id);

    const completeBtn = document.getElementById('toggleCompletedBtn');
    completeBtn.innerHTML = isCompleted ? '✅ Selesai' : '⭕ Tandai Selesai';
    completeBtn.className = isCompleted ? 'btn btn-primary' : 'btn btn-secondary';

    const bookmarkBtn = document.getElementById('bookmarkBtn');
    bookmarkBtn.innerHTML = isBookmarked ? '⭐ Bookmarked' : '☆ Bookmark';
}

// Toggle Complete
function toggleCurrentCompleted() {
    const chapId = chapters[currentChapterIndex].id;
    if (completedChapters.has(chapId)) {
        completedChapters.delete(chapId);
    } else {
        completedChapters.add(chapId);
    }
    localStorage.setItem('docker_completed_chapters', JSON.stringify([...completedChapters]));
    updateHeaderActionButtons();
    renderSidebarChapters();
    updateOverallProgress();
}

// Toggle Bookmark
function toggleBookmark() {
    const chapId = chapters[currentChapterIndex].id;
    if (bookmarkedChapters.has(chapId)) {
        bookmarkedChapters.delete(chapId);
    } else {
        bookmarkedChapters.add(chapId);
    }
    localStorage.setItem('docker_bookmarked_chapters', JSON.stringify([...bookmarkedChapters]));
    updateHeaderActionButtons();
    renderSidebarChapters();
}

// Save User Notes
function saveUserNote() {
    const chapId = chapters[currentChapterIndex].id;
    const note = document.getElementById('notesTextarea').value;
    userNotes[chapId] = note;
    localStorage.setItem('docker_user_notes', JSON.stringify(userNotes));
    
    const status = document.getElementById('saveNotesStatus');
    status.style.display = 'inline';
    setTimeout(() => { status.style.display = 'none'; }, 2000);
}

// Overall Progress Indicator
function updateOverallProgress() {
    const count = completedChapters.size;
    const total = chapters.length;
    const pct = Math.round((count / total) * 100);

    document.getElementById('progressBar').style.width = `${pct}%`;
    document.getElementById('progressText').textContent = `${count} / ${total} Selesai (${pct}%)`;
}

// Reset Progress
function resetAllProgress() {
    if (confirm('Apakah Anda yakin ingin mereset seluruh kemajuan belajar Docker Anda?')) {
        completedChapters.clear();
        bookmarkedChapters.clear();
        localStorage.removeItem('docker_completed_chapters');
        localStorage.removeItem('docker_bookmarked_chapters');
        updateHeaderActionButtons();
        renderSidebarChapters();
        updateOverallProgress();
    }
}

// Tab Switcher
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });
}

// Navigation Previous / Next
function navigatePrev() {
    if (currentChapterIndex > 0) loadChapter(currentChapterIndex - 1);
}

function navigateNext() {
    if (currentChapterIndex < chapters.length - 1) loadChapter(currentChapterIndex + 1);
}

// Render Quiz per Chapter
function renderQuiz(quizData) {
    const container = document.getElementById('quizContainer');
    if (!quizData) {
        container.innerHTML = '<p>Kuis untuk modul ini tidak tersedia.</p>';
        return;
    }

    container.innerHTML = `
        <div class="quiz-question-title">❓ ${quizData.question}</div>
        <div class="quiz-options">
            ${quizData.options.map((opt, idx) => `
                <div class="quiz-option" onclick="checkQuizAnswer(${idx}, ${quizData.correct})">
                    <span>${String.fromCharCode(65 + idx)}.</span>
                    <span>${opt}</span>
                </div>
            `).join('')}
        </div>
        <div id="quizFeedbackBox"></div>
    `;
}

// Check Quiz Answer
function checkQuizAnswer(selectedIdx, correctIdx) {
    const options = document.querySelectorAll('.quiz-option');
    const feedbackBox = document.getElementById('quizFeedbackBox');
    const chap = chapters[currentChapterIndex];

    options.forEach((opt, idx) => {
        opt.onclick = null; // Disable re-click
        if (idx === correctIdx) {
            opt.classList.add('correct');
        } else if (idx === selectedIdx) {
            opt.classList.add('wrong');
        }
    });

    if (selectedIdx === correctIdx) {
        feedbackBox.className = 'alert alert-tip';
        feedbackBox.innerHTML = `<strong>🎉 Benar Sekali!</strong><br>${chap.quiz.explanation}`;
        // Auto mark complete on correct answer
        if (!completedChapters.has(chap.id)) {
            toggleCurrentCompleted();
        }
    } else {
        feedbackBox.className = 'alert alert-warning';
        feedbackBox.innerHTML = `<strong>❌ Kurang Tepat.</strong><br>${chap.quiz.explanation}`;
    }
}

// CLI Playground Simulation
function setPlaygroundText(cmd) {
    document.getElementById('playgroundEditor').value = cmd;
}

function loadDefaultCommand() {
    setPlaygroundText(`docker run -d -p 8080:80 --name devops-web nginx:alpine`);
}

function runPlaygroundSimulation() {
    const input = document.getElementById('playgroundEditor').value.trim();
    const output = document.getElementById('terminalOutput');

    if (!input) {
        output.textContent = 'Silakan ketikkan perintah Docker CLI terlebih dahulu...';
        return;
    }

    let resultLog = `root@devops-node:~# ${input}\n`;

    if (input.startsWith('docker run')) {
        resultLog += `Unable to find image 'nginx:alpine' locally
alpine: Pulling from library/nginx
a3ed95ca0b2d: Pull complete
Digest: sha256:456c2e3912a2...
Status: Downloaded newer image for nginx:alpine
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n[SUCCESS] Container initialized and running on host port.`;
    } else if (input.startsWith('docker ps')) {
        resultLog += `CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                  NAMES
e3b0c44298fc   nginx:alpine   "/docker-entrypoint.…"   5 seconds ago   Up 4 seconds   0.0.0.0:8080->80/tcp   devops-web`;
    } else if (input.startsWith('docker network')) {
        resultLog += `4b82d901a12c8e9b12093847291a1002348a91280
[SUCCESS] Custom Docker User-Defined Network created successfully.`;
    } else if (input.startsWith('docker volume')) {
        resultLog += `app_data_vol
[SUCCESS] Docker Named Volume initialized at /var/lib/docker/volumes/app_data_vol/_data.`;
    } else if (input.startsWith('docker-compose') || input.startsWith('docker compose')) {
        resultLog += `[+] Creating 2/2
 ✔ Network app-network   Created                                        0.1s
 ✔ Container web-service Created                                        0.3s
[+] Running 2/2
 ✔ Container web-service Started                                        0.2s`;
    } else if (input.startsWith('docker build')) {
        resultLog += `[+] Building 1.2s (7/7) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 320B
 => [1/3] FROM node:22-alpine
 => [2/3] WORKDIR /app
 => [3/3] COPY . .
 => exporting to image
 => => naming to docker.io/library/myapp:1.0
[SUCCESS] Successfully tagged myapp:1.0`;
    } else {
        resultLog += `Executing: ${input}\nCommand processed successfully by Docker Engine CLI daemon.`;
    }

    output.textContent = resultLog;
}

function clearTerminalOutput() {
    document.getElementById('terminalOutput').textContent = 'Docker Daemon v28.3.0 is active. Ready to process CLI commands...';
}

// Final Certification Exam Modal
function openFinalExam() {
    const modal = document.getElementById('examModal');
    const body = document.getElementById('examModalBody');

    body.innerHTML = `
        <h2 style="color: var(--docker-cyan); margin-bottom: 12px;">🏆 Ujian Sertifikasi Akhir Docker DevOps</h2>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">Ujian ini terdiri dari 20 soal pilihan ganda komprehensif. Skor minimal untuk lulus Sertifikasi adalah 80% (16/20 benar).</p>
        
        <form id="finalExamForm">
            ${finalExamQuestions.map((q, qIdx) => `
                <div style="margin-bottom: 20px; background: rgba(17, 24, 39, 0.8); padding: 16px; border-radius: 8px; border: 1px solid var(--border-color);">
                    <div style="font-weight: 700; color: #ffffff; margin-bottom: 10px;">${q.q}</div>
                    ${q.options.map((opt, optIdx) => `
                        <label style="display: block; margin-bottom: 6px; cursor: pointer; color: var(--text-secondary);">
                            <input type="radio" name="q_${qIdx}" value="${optIdx}"> ${opt}
                        </label>
                    `).join('')}
                </div>
            `).join('')}
            <button type="button" class="btn btn-primary" onclick="submitFinalExam()" style="width: 100%; padding: 12px; font-size: 1rem;">
                🚀 Kirim Jawaban Ujian
            </button>
        </form>
        <div id="examResultBox" style="margin-top: 20px;"></div>
    `;

    modal.classList.add('active');
}

function closeFinalExam() {
    document.getElementById('examModal').classList.remove('active');
}

function submitFinalExam() {
    let score = 0;
    finalExamQuestions.forEach((q, idx) => {
        const selected = document.querySelector(`input[name="q_${idx}"]:checked`);
        if (selected && parseInt(selected.value) === q.correct) {
            score++;
        }
    });

    const pct = Math.round((score / finalExamQuestions.length) * 100);
    const resultBox = document.getElementById('examResultBox');

    if (pct >= 80) {
        resultBox.className = 'alert alert-tip';
        resultBox.innerHTML = `
            <h3 style="color: var(--success-color);">🎉 SELAMAT! ANDA LULUS UJIAN SERTIFIKASI DOCKER!</h3>
            <p>Skor Anda: <strong>${score} / ${finalExamQuestions.length} (${pct}%)</strong></p>
            <p>Anda telah menguasai fundamental Docker, Container Networking, Data Storage, Docker Compose, Dockerfile Optimization, & DevOps Deployment Best Practices!</p>
        `;
    } else {
        resultBox.className = 'alert alert-warning';
        resultBox.innerHTML = `
            <h3 style="color: var(--warning-color);">⚠️ BELUM LULUS (Skor Minimal 80%)</h3>
            <p>Skor Anda: <strong>${score} / ${finalExamQuestions.length} (${pct}%)</strong></p>
            <p>Silakan pelajari kembali modul-modul teori & lakukan latihan di CLI Playground sebelum mencoba Ujian kembali.</p>
        `;
    }
}
