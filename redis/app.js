/* ==========================================================================
   REDIS LEARNING PLATFORM - INTERACTIVE APPLICATION ENGINE
   Author: Antigravity Team
   Language: Bahasa Indonesia
   ========================================================================== */

// --- REDIS COURSE DATA & MODULES ---
const REDIS_MODULES = [
    {
        id: 1,
        title: "01. Pengenalan Redis & In-Memory Data Store",
        category: "Dasar",
        videoId: "YIBDd-nG3hc",
        desc: "Memahami konsep Redis sebagai In-Memory Data Structure Store, perbedaan RDBMS vs NoSQL Redis, serta skenario penggunaan utama.",
        summary: "Redis (Remote Dictionary Server) adalah in-memory key-value data structure store open-source yang sangat cepat. Digunakan untuk caching, session management, message broker, dan real-time leaderboard.",
        theory: `
            <h3>1. Apa itu Redis?</h3>
            <p><strong>Redis</strong> (singkatan dari <em>Remote Dictionary Server</em>) adalah sistem penyimpanan data open-source berkinerja sangat tinggi yang berjalan sepenuhnya di dalam memori utama (RAM). Berbeda dari database relasional (seperti MySQL atau PostgreSQL) yang menyimpan data utama di piringan disk, Redis memanfaatkan RAM sehingga mampu melayani ratusan ribu transaksi per detik dengan latency sub-millisecond (kurang dari 1 milidetik).</p>

            <div class="callout callout-info">
                <strong>💡 Karakteristik Utama Redis:</strong>
                <ul>
                    <li><strong>In-Memory Performance:</strong> Pembacaan dan penulisan data instan karena tidak ada I/O disk untuk operasi dasar.</li>
                    <li><strong>Rich Data Structures:</strong> Tidak hanya menyimpan teks/string, tetapi juga Hash, List, Set, Sorted Set, Bitmaps, HyperLogLog, dan Stream.</li>
                    <li><strong>Single-Threaded Architecture:</strong> Memanfaatkan event loop non-blocking (epoll/kqueue) yang efisien tanpa masalah race condition thread lock.</li>
                    <li><strong>Persistence Options:</strong> Data RAM dapat di-dump ke disk (RDB) atau di-append dalam log (AOF) untuk daya tahan saat restart server.</li>
                </ul>
            </div>

            <h3>2. Perbandingan Architecture: RDBMS vs Disk NoSQL vs Redis</h3>
            <p>Berikut adalah perbandingan peran Redis di dalam arsitektur aplikasi modern:</p>
            <ul>
                <li><strong>RDBMS (MySQL, PostgreSQL):</strong> Menyimpan data terstruktur dengan ACID compliance, relasi kompleks (JOIN), dan kueri analisis. Data disimpan di SSD/HDD. Read speed: 5ms - 50ms.</li>
                <li><strong>Disk NoSQL (MongoDB):</strong> Menyimpan dokumen JSON terstruktur tanpa skema kaku di disk. Read speed: 2ms - 20ms.</li>
                <li><strong>Redis (In-Memory Store):</strong> Menyimpan key-value & struktur data langsung di RAM. Read speed: 0.1ms - 1ms (sub-millisecond). Sangat cocok dipasang di depan RDBMS sebagai <strong>Caching Layer</strong>.</li>
            </ul>

            <h3>3. Modern Backend Use Cases</h3>
            <ul>
                <li><strong>Caching Layer:</strong> Menyimpan hasil query database yang sering diakses (seperti katalog produk) untuk meringankan beban RDBMS.</li>
                <li><strong>Session Store:</strong> Menyimpan session login user (JWT/Session ID) lintas microservices secara terpusat.</li>
                <li><strong>Rate Limiting:</strong> Membatasi jumlah request API per user/IP menggunakan Expiration TTL.</li>
                <li><strong>Real-time Leaderboard:</strong> Mengurutkan skor pemain game secara otomatis menggunakan Sorted Set (ZSet).</li>
                <li><strong>Pub/Sub & Event Queue:</strong> Pengiriman pesan real-time antar service dengan modul Publish/Subscribe.</li>
            </ul>
        `,
        sampleCommands: [
            "PING",
            "SET website 'kodeloka.asadinedu.com'",
            "GET website",
            "INFO memory"
        ],
        quiz: [
            {
                question: "Apa kepanjangan dari nama Redis?",
                options: [
                    "Relational Database Information Service",
                    "Remote Dictionary Server",
                    "Realtime Data Indexed Store",
                    "Rapid Engine Data In-memory System"
                ],
                answer: 1,
                explanation: "Redis merupakan singkatan resmi dari Remote Dictionary Server."
            },
            {
                question: "Mengapa Redis dapat mengeksekusi perintah dengan latency sub-millisecond?",
                options: [
                    "Karena data disimpan dan diproses sepenuhnya di dalam RAM (In-Memory)",
                    "Karena Redis menggunakan multi-threading berkecepatan tinggi",
                    "Karena Redis tidak menggunakan index sama sekali",
                    "Karena Redis mengompresi disk secara otomatis"
                ],
                answer: 0,
                explanation: "Semua data Redis disimpan di RAM, mengeliminasi I/O disk yang lambat."
            }
        ]
    },
    {
        id: 2,
        title: "02. Instalasi & Setup Redis Server",
        category: "Dasar",
        videoId: "dmGTAl6HZDw",
        desc: "Panduan praktis instalasi Redis Server menggunakan Docker, Linux, WSL, dan pengujian koneksi redis-cli.",
        summary: "Redis Server dapat diinstal dengan mudah via Docker container (`docker run -d -p 6379:6379 redis:alpine`) atau package manager Linux (`apt install redis-server`). Pengujian dilakukan via redis-cli.",
        theory: `
            <h3>1. Metodologi Instalasi Redis</h3>
            <p>Ada beberapa cara menjalankan Redis Server di lingkungan pengembangan maupun produksi. Cara paling direkomendasikan untuk lokal development adalah menggunakan <strong>Docker Container</strong>.</p>

            <h4>A. Menggunakan Docker (Rekomendasi Utama)</h4>
            <p>Jalankan perintah berikut di terminal Anda untuk menjalankan Redis Server container secara instant:</p>
            <div class="code-container">
                <div class="code-header"><span>Bash / Terminal</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code># Jalankan Redis Server container di port 6379
docker run -d --name redis-dev -p 6379:6379 redis:8-alpine

# Masuk ke dalam redis-cli container
docker exec -it redis-dev redis-cli</code></pre>
            </div>

            <h4>B. Menggunakan Docker Compose</h4>
            <div class="code-container">
                <div class="code-header"><span>docker-compose.yml</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>version: '3.8'
services:
  redis:
    image: redis:8-alpine
    container_name: my_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --save 60 1 --loglevel notice

volumes:
  redis_data:</code></pre>
            </div>

            <h4>C. Instalasi di Ubuntu / Linux Debian</h4>
            <div class="code-container">
                <div class="code-header"><span>Bash</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>sudo apt update
sudo apt install redis-server -y
sudo systemctl enable redis-server
sudo systemctl status redis-server</code></pre>
            </div>

            <h3>2. Memahami Biner Utama Redis</h3>
            <ul>
                <li><code>redis-server</code>: Daemon server utama yang mengelola penyimpanan data in-memory dan mendengarkan port TCP 6379.</li>
                <li><code>redis-cli</code>: Command Line Interface resmi untuk berinteraksi dan mengirimkan perintah ke Redis Server.</li>
                <li><code>redis-benchmark</code>: Utility bawaan untuk menguji performa throughput (RPS) Redis di mesin Anda.</li>
            </ul>

            <div class="callout callout-tip">
                <strong>⚡ Test Connection via redis-cli:</strong><br>
                Ketik <code>redis-cli</code> di terminal. Setelah terhubung ke <code>127.0.0.1:6379></code>, ketik perintah <code>PING</code>. Jika server berjalan normal, balasan balikan adalah <code>PONG</code>.
            </div>
        `,
        sampleCommands: [
            "PING",
            "ECHO 'Halo Redis Server!'",
            "INFO server"
        ],
        quiz: [
            {
                question: "Berapakah nomor port default yang digunakan oleh Redis Server?",
                options: ["3306", "5432", "6379", "27017"],
                answer: 2,
                explanation: "Port default Redis Server adalah 6379."
            },
            {
                question: "Perintah apa yang dikembalikan oleh server ketika client mengirimkan perintah PING?",
                options: ["OK", "PONG", "PONG 200", "SUCCESS"],
                answer: 1,
                explanation: "Redis mengembalikan balasan 'PONG' untuk konfirmasi koneksi aktif."
            }
        ]
    },
    {
        id: 3,
        title: "03. Perintah Dasar Redis Client & Server",
        category: "Dasar",
        videoId: "mcx6AUO6w8I",
        desc: "Menguasai perintah utilitas redis-cli: SELECT database 0-15, PING, ECHO, DBSIZE, INFO, FLUSHDB, dan MONITOR.",
        summary: "Redis menyediakan 16 logical database bawaan (index 0 hingga 15). Utilitas seperti `DBSIZE`, `INFO`, `KEYS`, dan `FLUSHDB` digunakan untuk manajemen data dan status server.",
        theory: `
            <h3>1. Multi-Database di Redis</h3>
            <p>Secara default, satu instance Redis Server menyediakan <strong>16 Logical Databases</strong> berlabel nomor <code>0</code> sampai <code>15</code>. Saat pertama kali terhubung, Anda akan berada di Database <code>0</code>.</p>
            <p>Untuk berpindah antar database, gunakan perintah <code>SELECT &lt;index&gt;</code>:</p>
            <div class="code-container">
                <div class="code-header"><span>redis-cli</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>SELECT 1      # Pindah ke Database index 1
SELECT 0      # Kembali ke Database index 0</code></pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Catatan Production Best Practice:</strong><br>
                Di lingkungan production microservices, daripada membagi data menggunakan index database (SELECT 1, 2, dll), lebih direkomendasikan menggunakan instance Redis terpisah atau namespace key prefix (misal <code>auth:user:1</code>, <code>cart:item:99</code>).
            </div>

            <h3>2. Perintah Utilitas Penting</h3>
            <ul>
                <li><code>PING [message]</code>: Menguji apakah server aktif.</li>
                <li><code>ECHO message</code>: Mengembalikan teks pesan yang dikirimkan.</li>
                <li><code>DBSIZE</code>: Menampilkan jumlah total key yang tersimpan di database aktif saat ini.</li>
                <li><code>INFO [section]</code>: Menampilkan statistik lengkap server (memory, clients, persistence, stats, cpu). Contoh: <code>INFO memory</code>.</li>
                <li><code>KEYS pattern</code>: Mencari key yang cocok dengan pattern. (Contoh: <code>KEYS user:*</code>). <em>Perhatian: Hindari <code>KEYS *</code> di production!</em></li>
                <li><code>EXISTS key</code>: Memeriksa apakah suatu key ada di database (mengembalikan 1 jika ada, 0 jika tidak ada).</li>
                <li><code>TYPE key</code>: Mengembalikan jenis tipe data dari key tersebut (string, hash, list, set, zset).</li>
                <li><code>DEL key [key ...]</code>: Menghapus satu atau beberapa key sekaligus.</li>
                <li><code>FLUSHDB</code>: Menghapus seluruh key pada database yang sedang aktif saja.</li>
                <li><code>FLUSHALL</code>: Menghapus SELURUH key di SEMUA database (0-15). Gunakan dengan sangat hati-hati!</li>
            </ul>
        `,
        sampleCommands: [
            "SELECT 0",
            "DBSIZE",
            "INFO memory",
            "KEYS *",
            "FLUSHDB"
        ],
        quiz: [
            {
                question: "Berapa jumlah logical database default yang tersedia pada satu instance Redis?",
                options: ["1", "8", "16", "32"],
                answer: 2,
                explanation: "Secara default Redis menyediakan 16 logical database (index 0 - 15)."
            },
            {
                question: "Apa perbedaan antara perintah FLUSHDB dan FLUSHALL?",
                options: [
                    "FLUSHDB menghapus DB di disk, FLUSHALL menghapus DB di RAM",
                    "FLUSHDB menghapus data pada database aktif saat ini, sedangkan FLUSHALL menghapus data di seluruh database 0-15",
                    "FLUSHDB membutuhkan reboot server, FLUSHALL tidak",
                    "Keduanya persis sama tanpa perbedaan"
                ],
                answer: 1,
                explanation: "FLUSHDB hanya membersihkan DB yang aktif, sedangkan FLUSHALL membersihkan seluruh 16 DB."
            }
        ]
    },
    {
        id: 4,
        title: "04. Tipe Data String & Operations",
        category: "Data Types",
        videoId: "dRKrtQ8LXzE",
        desc: "Mempelajari tipe data paling mendasar di Redis: String, operasi Atomic Increment/Decrement, MSET, MGET, dan Distributed Lock dengan SETNX.",
        summary: "String di Redis adalah binary safe dan dapat menampung teks, angka, hingga data biner (gambar/JSON) hingga ukuran 512MB. Operasi numerik seperti `INCR` bersifat atomic.",
        theory: `
            <h3>1. Konsep Redis String</h3>
            <p>Tipe data <strong>String</strong> adalah tipe data paling mendasar dan paling umum di Redis. Karakteristik penting dari String Redis:</p>
            <ul>
                <li><strong>Binary Safe:</strong> Dapat menyimpan karakter teks biasa, string JSON, potongan HTML, hingga file biner (gambar/file terkompresi).</li>
                <li><strong>Max Size:</strong> Satu nilai String dapat berukuran hingga <strong>512 Megabytes</strong>.</li>
                <li><strong>Atomic Integer Operations:</strong> Jika string berisi karakter angka (misal "100"), Redis menyediakan perintah khusus untuk manipulasi aritmatika yang bersifat <em>atomic</em>.</li>
            </ul>

            <h3>2. Perintah Manipulasi String</h3>
            <div class="code-container">
                <div class="code-header"><span>redis-cli syntax</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code># Menyimpan & Mengambil Data
SET user:name "Eko Kurniawan"
GET user:name

# SETNX (Set if Not Exists) - Sangat berguna untuk Distributed Locking
SETNX lock:order:1001 "process_123"

# Multiple Set & Get (Mengurangi Round-Trip Time)
MSET user:1 "Budi" user:2 "Joko" user:3 "Siti"
MGET user:1 user:2 user:3

# Atomic Counter Operations
SET page_views 100
INCR page_views        # Nilai menjadi 101
INCRBY page_views 5    # Nilai menjadi 106
DECR page_views        # Nilai menjadi 105
DECRBY page_views 10   # Nilai menjadi 95

# String Manipulation
APPEND user:name " Khannedy" # Menggabungkan teks
STRLEN user:name             # Menghitung panjang karakter</code></pre>
            </div>

            <div class="callout callout-tip">
                <strong>🔥 Distributed Lock Pattern dengan SETNX:</strong><br>
                Saat beberapa aplikasi microservices mencoba memproses pesanan yang sama secara bersamaan, jalankan <code>SETNX lock:order:1001 "node1"</code>. Hanya service pertama yang mendapatkan kembalian <code>1</code> (berhasil). Service lain akan menerima <code>0</code> (gagal) sehingga tidak terjadi race condition!
            </div>
        `,
        sampleCommands: [
            "SET title 'Belajar Redis PZN'",
            "GET title",
            "MSET counter:a 10 counter:b 20",
            "INCR counter:a",
            "INCRBY counter:b 50",
            "MGET counter:a counter:b"
        ],
        quiz: [
            {
                question: "Berapa ukuran maksimum data yang dapat disimpan dalam satu key String di Redis?",
                options: ["1 Megabyte", "64 Megabytes", "512 Megabytes", "2 Gigabytes"],
                answer: 2,
                explanation: "Ukuran maksimal String Redis adalah 512 MB."
            },
            {
                question: "Apa fungsi dari perintah SETNX?",
                options: [
                    "Menyetel nilai key tanpa menyimpan ke disk",
                    "Menyetel nilai key HANYA JIKA key tersebut Belum Ada (Set if Not Exists)",
                    "Menyetel nilai key dengan format Next Index",
                    "Menyetel nilai key bertipe Numeric"
                ],
                answer: 1,
                explanation: "SETNX (Set if Not Exists) mengembalikan 1 jika berhasil (key baru) dan 0 jika key sudah ada."
            }
        ]
    },
    {
        id: 5,
        title: "05. Expiration & Time To Live (TTL)",
        category: "Data Types",
        videoId: "6Un1kcmWK-Q",
        desc: "Mengatur masa berlaku data otomatis (Cache Eviction) menggunakan EXPIRE, TTL, PTTL, PERSIST, dan kombinasi SET EX/PX.",
        summary: "Key di Redis dapat diset agar terhapus otomatis setelah batas waktu tertentu. Sangat cocok untuk Caching, OTP Token, Rate Limiter, dan Session Timeout.",
        theory: `
            <h3>1. Konsep Key Expiration (TTL)</h3>
            <p>Salah satu fitur paling powerful di Redis adalah kemampuan mengatur <strong>Time To Live (TTL)</strong> pada suatu key. Setelah durasi waktu (dalam detik atau milidetik) tercapai, Redis akan secara otomatis menghapus key tersebut dari memori tanpa bantuan cronjob eksternal.</p>

            <h3>2. Perintah Manipulasi Expiration</h3>
            <div class="code-container">
                <div class="code-header"><span>redis-cli</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code># 1. Menyetel TTL pada key yang sudah ada (dalam detik)
SET session:user:99 "token_secret_abc"
EXPIRE session:user:99 60     # Berlaku selama 60 detik

# 2. Memeriksa sisa waktu TTL
TTL session:user:99           # Mengembalikan sisa detik (misal: 45)

# 3. Menyetel data sekaligus TTL atomic dalam 1 command (BEST PRACTICE)
SET otp:user:99 "849201" EX 300  # Expire 300 detik (5 menit)
SET cache:product:1 "JSON..." PX 10000 # Expire 10000 milidetik (10 detik)

# 4. Menghapus status expiration (membuat key persisten kembali)
PERSIST session:user:99</code></pre>
            </div>

            <h3>3. Arti Nilai Kembalian Perintah TTL</h3>
            <ul>
                <li><code>&gt; 0</code>: Jumlah detik tersisa sebelum key terhapus otomatis.</li>
                <li><code>-1</code>: Key ada di database, tetapi <strong>TIDAK memiliki batas kadaluarsa</strong> (persisten selamanya).</li>
                <li><code>-2</code>: Key <strong>TIDAK ditemukan</strong> di database (sudah terhapus atau belum pernah dibuat).</li>
            </ul>

            <div class="callout callout-info">
                <strong>⚙️ Strategi Eviction Memori (MaxMemory Policy):</strong><br>
                Jika RAM server Redis penuh dan batas <code>maxmemory</code> tercapai, Redis dapat menghapus key kadaluarsa atau key yang paling jarang diakses berdasarkan kebijakan seperti <code>allkeys-lru</code> (Least Recently Used) atau <code>volatile-ttl</code>.
            </div>
        `,
        sampleCommands: [
            "SET token:session 'xyz123' EX 10",
            "TTL token:session",
            "EXPIRE token:session 60",
            "PERSIST token:session",
            "TTL token:session"
        ],
        quiz: [
            {
                question: "Apa arti nilai kembalian -1 ketika menjalankan perintah TTL key?",
                options: [
                    "Key sudah kadaluarsa dan terhapus",
                    "Key tidak ditemukan di database",
                    "Key ada tetapi bersifat persisten (tidak memiliki waktu kadaluarsa/TTL)",
                    "Server Redis mengalami error internal"
                ],
                answer: 2,
                explanation: "Nilai -1 menunjukkan key persisten tanpa batas waktu expiration."
            },
            {
                question: "Perintah SET manakah yang menyimpan key dengan masa aktif kadaluarsa 60 detik secara atomic?",
                options: [
                    "SET key val TTL 60",
                    "SET key val EX 60",
                    "SET key val SEC 60",
                    "SET key val EXP 60"
                ],
                answer: 1,
                explanation: "Opsi 'EX 60' menyetel expiration 60 detik secara atomic saat SET dipanggil."
            }
        ]
    },
    {
        id: 6,
        title: "06. Tipe Data Hash",
        category: "Data Types",
        videoId: "X_1-0tBdb-I",
        desc: "Menggunakan Redis Hash untuk menyimpan objek terstruktur (Map/Dictionary) seperti User Profile dan Product Detail secara efisien.",
        summary: "Redis Hash adalah pemetaan antara field bertipe string dengan nilai string (String-to-String Map). Sangat hemat memori untuk merepresentasikan objek.",
        theory: `
            <h3>1. Konsep Redis Hash</h3>
            <p><strong>Hash</strong> di Redis adalah struktur data berupa pasangan <em>field-value</em> yang tersimpan di bawah satu key utama. Ini sangat cocok untuk merepresentasikan entitas objek di dalam pemrograman (seperti objek User, Product, atau Cart item).</p>
            <p>Dibandingkan menyimpan JSON string utuh di String key (yang membutuhkan serialisasi/deserialisasi setiap kali ada 1 atribut berubah), Hash memungkinkan kita mengubah atau mengambil 1 field tertentu saja secara instant ($O(1)$ complexity).</p>

            <h3>2. Perintah Manipulasi Hash</h3>
            <div class="code-container">
                <div class="code-header"><span>redis-cli</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code># Menyetel satu atau beberapa field di dalam Hash
HSET user:100 name "Eko Khannedy" email "eko@gmail.com" age 30 status "active"

# Mengambil nilai 1 field tertentu
HGET user:100 email

# Mengambil beberapa field sekaligus
HMGET user:100 name age

# Mengambil SELURUH field dan value dari Hash
HGETALL user:100

# Menghapus field tertentu di dalam Hash
HDEL user:100 status

# Memeriksa keberadaan field
HEXISTS user:100 email

# Mengambil seluruh nama field (keys) atau nilai (values) saja
HKEYS user:100
HVALS user:100

# Increment nilai numerik di dalam field Hash
HINCRBY user:100 age 1   # Umur menjadi 31</code></pre>
            </div>

            <div class="callout callout-tip">
                <strong>💡 Keuntungan Efisiensi Memori Hash:</strong><br>
                Redis secara internal menggunakan struktur data hemat memori <code>ziplist</code> / <code>listpack</code> untuk Hash berukuran kecil (jumlah field &lt; 512). Menyimpan 1.000 objek user di Hash jauh lebih hemat RAM daripada menyimpan 1.000 String key individual!
            </div>
        `,
        sampleCommands: [
            "HSET profile:101 name 'Budi Santoso' role 'Developer' points 150",
            "HGET profile:101 name",
            "HINCRBY profile:101 points 50",
            "HGETALL profile:101",
            "HKEYS profile:101"
        ],
        quiz: [
            {
                question: "Struktur data apakah yang diwakili oleh Redis Hash?",
                options: [
                    "Doubly-Linked List",
                    "Field-Value Map (Objek / Dictionary)",
                    "Binary Search Tree",
                    "Unordered Array Unique"
                ],
                answer: 1,
                explanation: "Redis Hash mewakili pasangan Field-Value Map di bawah satu nama Key."
            },
            {
                question: "Perintah apa yang digunakan untuk mengambil SEMUA field dan value dari suatu Hash?",
                options: ["HGET", "HMGET", "HGETALL", "HFETCH"],
                answer: 2,
                explanation: "HGETALL mengembalikan seluruh pasangan field beserta valuenya."
            }
        ]
    },
    {
        id: 7,
        title: "07. Tipe Data List & Message Queuing",
        category: "Data Types",
        videoId: "X_1-0tBdb-I",
        desc: "Mengimplementasikan Queue (FIFO) & Stack (LIFO) menggunakan Redis List (LPUSH, RPUSH, LPOP, RPOP, LRANGE, LLEN).",
        summary: "Redis List diimplementasikan sebagai Doubly-Linked List. Penambahan data di ujung kiri (head) atau kanan (tail) memiliki kompleksitas waktu super cepat O(1).",
        theory: `
            <h3>1. Konsep Redis List</h3>
            <p><strong>Redis List</strong> adalah urutan elemen string yang diurutkan berdasarkan urutan penyisipan. Di balik layar, Redis menggunakan struktur <strong>Doubly-Linked List</strong> (atau quicklist), sehingga penambahan/penghapusan elemen di awal (head) maupun di akhir (tail) beroperasi dalam kompleksitas konstan $O(1)$.</p>

            <h3>2. Pola Implementasi Data Structure:</h3>
            <ul>
                <li><strong>Queue (FIFO - First In First Out):</strong> Masukkan data dengan <code>RPUSH</code> di ekor, ambil data dengan <code>LPOP</code> di kepala. (Dipakai untuk Async Background Job Process).</li>
                <li><strong>Stack (LIFO - Last In First Out):</strong> Masukkan data dengan <code>LPUSH</code> di kepala, ambil data dengan <code>LPOP</code> di kepala.</li>
                <li><strong>Capped Timeline / Recent Items:</strong> Batasi jumlah elemen list menggunakan <code>LTRIM</code> (misal hanya menyimpan 100 aktivitas terakhir).</li>
            </ul>

            <h3>3. Perintah Manipulasi List</h3>
            <div class="code-container">
                <div class="code-header"><span>redis-cli</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code># Menambahkan elemen dari Kiri (Head) atau Kanan (Tail)
LPUSH queue:jobs "send_email_job_1" "send_email_job_2"
RPUSH queue:jobs "process_video_job_3"

# Membaca elemen List (Range 0 hingga -1 berarti SEMUA elemen)
LRANGE queue:jobs 0 -1
LRANGE queue:jobs 0 1   # Mengambil elemen index 0 dan 1

# Pop (Mengambil sekaligus menghapus elemen)
LPOP queue:jobs         # Mengambil elemen paling kiri (Head)
RPOP queue:jobs         # Mengambil elemen paling kanan (Tail)

# Menghitung panjang List
LLEN queue:jobs

# Mengambil elemen berdasarkan Index tertentu
LINDEX queue:jobs 0</code></pre>
            </div>
        `,
        sampleCommands: [
            "RPUSH mylist 'Apple' 'Banana' 'Cherry'",
            "LPUSH mylist 'Dragonfruit'",
            "LRANGE mylist 0 -1",
            "LPOP mylist",
            "LLEN mylist"
        ],
        quiz: [
            {
                question: "Struktur data tingkat rendah apa yang digunakan Redis untuk mengimplementasikan List?",
                options: ["Array Statis", "Doubly-Linked List", "Hash Table", "SkipList"],
                answer: 1,
                explanation: "Redis List diimplementasikan dengan Doubly-Linked List untuk operasi O(1) di head dan tail."
            },
            {
                question: "Kombinasi perintah mana yang digunakan untuk membentuk struktur data Queue (FIFO)?",
                options: ["LPUSH dan LPOP", "RPUSH dan LPOP", "RPUSH dan RPOP", "SET dan GET"],
                answer: 1,
                explanation: "RPUSH (masuk di kanan/ekor) dan LPOP (keluar di kiri/kepala) membentuk alur Queue FIFO."
            }
        ]
    },
    {
        id: 8,
        title: "08. Tipe Data Set (Unique Unordered Collection)",
        category: "Data Types",
        videoId: "X_1-0tBdb-I",
        desc: "Mengelola himpunan data unik tanpa duplikasi dengan Redis Set, serta melakukan operasi aljabar SINTER, SUNION, dan SDIFF.",
        summary: "Redis Set adalah koleksi string acak yang tidak berurutan dan dijamin unik (tanpa elemen duplikat). Mendukung operasi Himpunan Irisan, Gabungan, dan Beda.",
        theory: `
            <h3>1. Konsep Redis Set</h3>
            <p><strong>Set</strong> di Redis adalah koleksi elemen string yang tidak terurut (unordered) di mana setiap anggota dijamin <strong>Unik (tidak boleh ada duplikasi)</strong>. Jika Anda memasukkan nilai yang sama berkali-kali ke dalam Set, Redis akan mengabaikan nilai duplikat tersebut.</p>

            <h3>2. Perintah Manipulasi Set</h3>
            <div class="code-container">
                <div class="code-header"><span>redis-cli</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code># Menambahkan anggota ke dalam Set
SADD tags:golang "backend" "language" "concurrency" "backend" # "backend" kedua diabaikan!

# Memeriksa seluruh anggota Set
SMEMBERS tags:golang

# Memeriksa apakah suatu nilai ada dalam Set (Mengembalikan 1 atau 0)
SISMEMBER tags:golang "concurrency"

# Menghapus anggota dari Set
SREM tags:golang "language"

# Menghitung total jumlah anggota Set
SCARD tags:golang</code></pre>
            </div>

            <h3>3. Operasi Aljabar Himpunan (Set Operations)</h3>
            <p>Redis menyediakan perintah super cepat untuk membandingkan dua atau lebih Set:</p>
            <div class="code-container">
                <div class="code-header"><span>redis-cli</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>SADD user:1:skills "go" "redis" "docker" "kubernetes"
SADD user:2:skills "go" "python" "docker" "aws"

# 1. SINTER (Intersection / Irisan) -> Skill yang dimiliki KEDUA user
SINTER user:1:skills user:2:skills   # Hasil: "go", "docker"

# 2. SUNION (Union / Gabungan) -> Total skill gabungan tanpa duplikasi
SUNION user:1:skills user:2:skills   # Hasil: "go", "redis", "docker", "kubernetes", "python", "aws"

# 3. SDIFF (Difference / Beda) -> Skill user:1 yang TIDAK dimiliki user:2
SDIFF user:1:skills user:2:skills    # Hasil: "redis", "kubernetes"</code></pre>
            </div>
        `,
        sampleCommands: [
            "SADD setA 'A' 'B' 'C' 'D'",
            "SADD setB 'C' 'D' 'E' 'F'",
            "SMEMBERS setA",
            "SINTER setA setB",
            "SUNION setA setB",
            "SDIFF setA setB"
        ],
        quiz: [
            {
                question: "Apa yang terjadi jika kita memasukkan nilai 'Apple' sebanyak 3 kali menggunakan perintah SADD ke dalam Set yang sama?",
                options: [
                    "Redis akan menyimpan 3 string 'Apple' berurutan",
                    "Redis akan menghasilkan error duplikasi",
                    "Redis hanya menyimpan 1 string 'Apple' unik",
                    "Nilai 'Apple' akan ditimpa menjadi angka 3"
                ],
                answer: 2,
                explanation: "Set menjamin keunikan nilai. Duplikat secara otomatis diabaikan."
            },
            {
                question: "Perintah apa yang digunakan untuk mendapatkan anggota irisan (intersection) antara dua buah Set?",
                options: ["SUNION", "SINTER", "SDIFF", "SMEMBERS"],
                answer: 1,
                explanation: "SINTER (Set Intersection) mengambil anggota yang ada di kedua Set."
            }
        ]
    },
    {
        id: 9,
        title: "09. Tipe Data Sorted Set / ZSet & Leaderboard Pattern",
        category: "Data Types",
        videoId: "X_1-0tBdb-I",
        desc: "Membangun sistem Leaderboard real-time menggunakan Redis Sorted Set (ZSet) dengan pengurutan otomatis berdasarkan Score.",
        summary: "Sorted Set (ZSet) mirip seperti Set (unik), namun setiap anggotanya diasosiasikan dengan Floating Point Score. Digunakan untuk Leaderboard Game dan Ranking System.",
        theory: `
            <h3>1. Konsep Sorted Set (ZSet)</h3>
            <p><strong>Sorted Set (ZSet)</strong> adalah salah satu tipe data terkuat di Redis. Setiap elemen di dalam ZSet dijamin unik, tetapi diasosiasikan dengan sebuah nilai angka berpresisi tinggi bernama <strong>Score</strong>. Data secara otomatis diurutkan di dalam memori dari skor terkecil hingga terbesar.</p>
            <p>Struktur data internal ZSet menggabungkan <strong>SkipList</strong> dan <strong>Hash Map</strong>, yang memungkinkan kueri ranking, pencarian rentang skor (range query), dan penambahan data dalam kompleksitas waktu logarithmic $O(\log N)$.</p>

            <h3>2. Perintah Manipulasi ZSet</h3>
            <div class="code-container">
                <div class="code-header"><span>redis-cli</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code># Menambahkan anggota beserta Skor ke ZSet (ZADD key score member)
ZADD leaderboard 1500 "Player_Budi" 2400 "Player_Eko" 1850 "Player_Siti"

# Mengambil peringkat dari skor Terendah ke Tertinggi (Ascending)
ZRANGE leaderboard 0 -1 WITHSCORES

# Mengambil Top Leaderboard dari skor Tertinggi ke Terendah (Descending)
ZREVRANGE leaderboard 0 -1 WITHSCORES

# Mengambil Peringkat (Rank) spesifik pemain (0-indexed)
ZRANK leaderboard "Player_Eko"       # Rank ascending
ZREVRANK leaderboard "Player_Eko"    # Peringkat #1 (0) di Descending leaderboard!

# Mengambil Skor spesifik pemain
ZSCORE leaderboard "Player_Eko"

# Menambahkan nilai skor pemain (Increment)
ZINCRBY leaderboard 500 "Player_Budi"  # Skor Budi bertambah dari 1500 menjadi 2000

# Menghapus anggota dari ZSet
ZREM leaderboard "Player_Siti"</code></pre>
            </div>

            <div class="callout callout-tip">
                <strong>🎮 Skenario Penggunaan Nyata:</strong><br>
                Di aplikasi game mobile dengan 10 juta pemain aktif, Redis ZSet dapat menentukan peringkat #1 sampai #10 di seluruh dunia secara <strong>real-time tanpa beban query DB SQL heavy <code>ORDER BY score DESC LIMIT 10</code>!</strong>
            </div>
        `,
        sampleCommands: [
            "ZADD highscores 100 'Alice' 250 'Bob' 180 'Charlie'",
            "ZREVRANGE highscores 0 -1 WITHSCORES",
            "ZINCRBY highscores 100 'Alice'",
            "ZREVRANK highscores 'Alice'",
            "ZSCORE highscores 'Alice'"
        ],
        quiz: [
            {
                question: "Apa elemen utama yang membedakan Sorted Set (ZSet) dengan Set biasa?",
                options: [
                    "ZSet menerima elemen duplikat",
                    "Setiap anggota ZSet memiliki asosiasi nilai 'Score' numerik untuk pengurutan",
                    "ZSet disimpan di disk sedangkan Set di RAM",
                    "ZSet hanya bisa menampung angka integer"
                ],
                answer: 1,
                explanation: "ZSet mengasosiasikan setiap member dengan nilai Score untuk pengurutan otomatis."
            },
            {
                question: "Perintah apa yang digunakan untuk mendapatkan peringkat teratas (dari skor tertinggi ke terendah) beserta skornya?",
                options: [
                    "ZRANGE key 0 -1",
                    "ZREVRANGE key 0 -1 WITHSCORES",
                    "ZGETALL key",
                    "ZTOP key 10"
                ],
                answer: 1,
                explanation: "ZREVRANGE mengurutkan secara reverse (skor tinggi ke rendah) dan opsi WITHSCORES menyertakan nilai skornya."
            }
        ]
    },
    {
        id: 10,
        title: "10. Redis Transactions & Optimistic Locking",
        category: "Advanced",
        videoId: "YVJi3X5Iotw",
        desc: "Memahami eksekusi atomic multi-command menggunakan MULTI, EXEC, DISCARD, dan Optimistic Locking dengan WATCH.",
        summary: "Redis Transaction memungkinkan eksekusi sekumpulan perintah secara atomic dan terisolasi. Perintah `WATCH` menyediakan Optimistic Locking (Check-and-Set).",
        theory: `
            <h3>1. Konsep Redis Transaction</h3>
            <p>Transaksi di Redis menjamin bahwa sekumpulan perintah diantrekan (queued) dan dieksekusi secara <strong>Sequential &amp; Atomic</strong> tanpa ada interupsi atau penyisipan perintah dari client lain di tengah proses.</p>

            <h3>2. Sintaks Utama Transaksi</h3>
            <ul>
                <li><code>MULTI</code>: Menandai awal dari blok transaksi. Perintah setelah ini tidak langsung dieksekusi, melainkan dimasukkan ke dalam antrean (QUEUED).</li>
                <li><code>EXEC</code>: Mengeksekusi seluruh perintah yang ada di dalam antrean transaksi secara sekuensial.</li>
                <li><code>DISCARD</code>: Membatalkan transaksi dan mengosongkan antrean perintah.</li>
            </ul>

            <div class="code-container">
                <div class="code-header"><span>redis-cli</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code># Memulai Transaksi Transfer Saldo Bank
MULTI
DECRBY wallet:user:A 50000
INCRBY wallet:user:B 50000
EXEC   # Kedua perintah dieksekusi bersamaan secara atomic!</code></pre>
            </div>

            <h3>3. Optimistic Locking dengan WATCH (Check-and-Set)</h3>
            <p>Perintah <code>WATCH</code> digunakan untuk memantau satu atau beberapa key sebelum transaksi dimulai. Jika ada client lain yang merubah nilai key yang di-watch sebelum <code>EXEC</code> dipanggil, maka seluruh transaksi akan <strong>batal secara otomatis (EXEC mengembalikan nil)</strong>.</p>
            <div class="code-container">
                <div class="code-header"><span>redis-cli</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>WATCH product:stock:99
GET product:stock:99   # Misal stok bernilai 1

MULTI
DECR product:stock:99
EXEC                   # Jika client lain merubah stok di tengah jalan, EXEC akan GAGAL!</code></pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Perbedaan Penting Redis Transaction vs RDBMS SQL:</strong><br>
                Redis <strong>TIDAK mendukung Rollback bertingkat</strong> di tengah transaksi jika ada sintaks perintah logika yang salah. Jika satu command gagal secara runtime, command lainnya dalam EXEC tetap akan diproses.
            </div>
        `,
        sampleCommands: [
            "MULTI",
            "SET user:balance:1 1000",
            "SET user:balance:2 500",
            "EXEC",
            "MGET user:balance:1 user:balance:2"
        ],
        quiz: [
            {
                question: "Perintah apa yang digunakan untuk memulai blok transaksi di Redis?",
                options: ["BEGIN", "START TRANSACTION", "MULTI", "INIT"],
                answer: 2,
                explanation: "Perintah MULTI menandai dimulainya antrean transaksi di Redis."
            },
            {
                question: "Apa fungsi dari perintah WATCH key sebelum blok transaksi MULTI...EXEC?",
                options: [
                    "Mengunci key secara permanen dari akses read",
                    "Memantau perubahan key (Optimistic Locking). Jika key diubah client lain, EXEC akan membatalkan transaksi",
                    "Menampilkan log perubahan data di console",
                    "Membuat duplikat backup dari key tersebut"
                ],
                answer: 1,
                explanation: "WATCH mengimplementasikan Optimistic Locking (Check-and-Set) untuk mencegah kondisi konflik antar client."
            }
        ]
    },
    {
        id: 11,
        title: "11. Redis Publish & Subscribe (Pub/Sub)",
        category: "Advanced",
        videoId: "ej8NveP_xcc",
        desc: "Membangun sistem komunikasi pesan terpisah (Decoupled Messaging System) secara real-time dengan PUBLISH dan SUBSCRIBE.",
        summary: "Redis Pub/Sub mengimplementasikan pola perpesanan di mana Publisher mengirim pesan ke Channel dan Subscriber mendengarkan Channel secara real-time.",
        theory: `
            <h3>1. Konsep Pub/Sub (Publish &amp; Subscribe)</h3>
            <p><strong>Publish/Subscribe (Pub/Sub)</strong> adalah pola arsitektur komunikasi terdekopel di mana pengirim pesan (<em>Publisher</em>) tidak mengirimkan pesan langsung ke penerima tertentu. Sebaliknya, Publisher mempublikasikan pesan ke sebuah topik/saluran bernama <strong>Channel</strong>, dan penerima (<em>Subscriber</em>) mendaftarkan diri ke Channel tersebut untuk menerima pesan secara instan.</p>

            <h3>2. Perintah Utama Pub/Sub</h3>
            <div class="code-container">
                <div class="code-header"><span>redis-cli (Terminal Subscriber)</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code># Client A mendengarkan channel 'news:sports'
SUBSCRIBE news:sports

# Client B mendengarkan channel dengan wildcard pattern (PSUBSCRIBE)
PSUBSCRIBE orders.*    # Mendengarkan orders.created, orders.paid, dll.</code></pre>
            </div>

            <div class="code-container">
                <div class="code-header"><span>redis-cli (Terminal Publisher)</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code># Client C mempublikasikan pesan ke channel
PUBLISH news:sports "Indonesia menang dalam turnamen e-sports!"
PUBLISH orders.created "Order ID #9921 berhasil dibuat"</code></pre>
            </div>

            <div class="callout callout-info">
                <strong>💡 Karakteristik "Fire-and-Forget":</strong><br>
                Pub/Sub bawaan Redis bersifat <em>fire-and-forget</em>. Artinya, pesan tidak disimpan di memori atau disk. Jika Subscriber sedang offline saat Publisher mengirim pesan, Subscriber <strong>tidak akan menerima pesan lampau tersebut</strong>. (Jika butuh persistence pesan, gunakan tipe data <strong>Redis Stream</strong>).
            </div>
        `,
        sampleCommands: [
            "PUBLISH chat:global 'Halo dari CLI Simulator!'",
            "PUBLISH notifications:user 'Ada promo diskon 50%!'"
        ],
        quiz: [
            {
                question: "Apa yang terjadi pada pesan Redis Pub/Sub jika tidak ada Subscriber yang aktif saat PUBLISH dipanggil?",
                options: [
                    "Pesan akan disimpan di antrean Queue hingga Subscriber terhubung",
                    "Pesan akan dibuang/hilang secara instan (Fire-and-Forget)",
                    "Redis Server akan menghasilkan error",
                    "Pesan disimpan ke dalam disk log AOF"
                ],
                answer: 1,
                explanation: "Redis Pub/Sub bersifat fire-and-forget. Pesan langsung hilang jika tidak ada subscriber mendengarkan."
            },
            {
                question: "Perintah apa yang digunakan untuk melakukan subscribe ke channel berdasarkan pola wildcard (misal 'notifications.*')?",
                options: ["SUBSCRIBE", "PSUBSCRIBE", "PATSUBS", "SEARCHSUB"],
                answer: 1,
                explanation: "PSUBSCRIBE (Pattern Subscribe) memungkinkan langganan ke channel berbasis pola wildcard."
            }
        ]
    },
    {
        id: 12,
        title: "12. Redis Streams - Log Append-Only untuk Event",
        category: "Advanced",
        videoId: null,
        desc: "Struktur data Stream sebagai log kejadian yang tahan lama, perbedaannya dengan List dan Pub/Sub, serta perintah XADD, XRANGE, dan XLEN.",
        summary: "Stream adalah struktur data append-only log yang diperkenalkan di Redis 5. Berbeda dari Pub/Sub yang fire-and-forget, Stream MENYIMPAN pesan sehingga consumer yang terlambat tetap bisa membaca riwayat. Setiap entri punya ID unik berformat milidetik-sekuens (contoh 1712345678901-0) yang selalu menaik. XADD menulis, XRANGE membaca rentang, XLEN menghitung.",
        theory: `
            <h3>1. Masalah yang Diselesaikan Stream</h3>
            <p>Sebelum Stream ada, orang memakai <strong>List</strong> sebagai antrian dan <strong>Pub/Sub</strong> sebagai broadcast. Keduanya punya lubang besar:</p>

            <table class="tech-table">
                <thead>
                    <tr><th>Aspek</th><th>List (LPUSH/BRPOP)</th><th>Pub/Sub</th><th>Stream</th></tr>
                </thead>
                <tbody>
                    <tr><td>Pesan disimpan?</td><td>Ya, tapi hilang saat dibaca</td><td><strong>Tidak</strong> — fire and forget</td><td><strong>Ya</strong>, tetap ada setelah dibaca</td></tr>
                    <tr><td>Consumer offline saat pesan datang</td><td>Pesan menumpuk, aman</td><td><strong>Pesan hilang selamanya</strong></td><td>Aman, bisa dibaca menyusul</td></tr>
                    <tr><td>Banyak consumer baca pesan sama</td><td>Tidak bisa</td><td>Bisa</td><td>Bisa</td></tr>
                    <tr><td>Pembagian kerja antar consumer</td><td>Bisa (rebutan)</td><td>Tidak bisa</td><td>Bisa via Consumer Group</td></tr>
                    <tr><td>Konfirmasi pemrosesan (ACK)</td><td>Tidak ada</td><td>Tidak ada</td><td><strong>Ada</strong></td></tr>
                    <tr><td>Baca ulang riwayat</td><td>Tidak bisa</td><td>Tidak bisa</td><td><strong>Bisa</strong></td></tr>
                </tbody>
            </table>

            <div class="callout callout-info">
                <strong>💡 Analogi:</strong> Pub/Sub itu seperti siaran radio — kalau Anda tidak menyalakan radio saat itu, acaranya lewat begitu saja. Stream itu seperti rekaman podcast — Anda bisa mendengarkannya kapan saja, mengulang, bahkan membaginya ke beberapa orang untuk didengarkan bergantian.
            </div>

            <h3>2. Anatomi ID Entri</h3>
            <p>Setiap entri Stream punya ID unik dengan format <code>&lt;milidetik-unix&gt;-&lt;sekuens&gt;</code>:</p>

            <div class="code-box">
                <pre>1712345678901-0
1712345678901-1   &lt;-- entri kedua di milidetik yang sama
1712345678999-0   &lt;-- milidetik berikutnya</pre>
            </div>

            <ul>
                <li>ID <strong>selalu menaik</strong>, tidak pernah mundur. Ini yang membuat Stream bisa dibaca berurutan secara andal.</li>
                <li>Tanda <code>*</code> berarti "biarkan Redis yang membuat ID" — inilah yang hampir selalu Anda pakai.</li>
                <li>Anda boleh menentukan ID sendiri, tetapi wajib lebih besar dari ID terakhir. Berguna saat migrasi data dari sistem lain.</li>
            </ul>

            <h3>3. Menulis Entri: XADD</h3>
            <div class="code-box">
                <div class="code-box-header"><span>redis-cli</span></div>
                <pre># Format: XADD &lt;key&gt; &lt;ID|*&gt; field1 value1 field2 value2 ...
XADD pesanan * id_pesanan 1001 user_id 55 total 250000 status baru
# =&gt; "1712345678901-0"

XADD pesanan * id_pesanan 1002 user_id 71 total 89000 status baru
# =&gt; "1712345678935-0"

# Isi entri adalah pasangan field-value, mirip Hash.
# Satu Stream boleh berisi entri dengan field yang berbeda-beda.</pre>
            </div>

            <h3>4. Membatasi Ukuran: MAXLEN dan MINID</h3>
            <p>Stream tumbuh selamanya kalau tidak dibatasi. Ini penyebab umum Redis kehabisan memori di produksi.</p>

            <div class="code-box">
                <pre># Simpan KURANG LEBIH 10.000 entri terakhir.
# Tanda ~ (perkiraan) jauh lebih murah daripada angka persis,
# karena Redis boleh memangkas di batas node radix tree terdekat.
XADD pesanan MAXLEN ~ 10000 * id_pesanan 1003 total 45000

# Buang entri yang lebih tua dari ID tertentu (misal: 7 hari lalu)
XADD pesanan MINID ~ 1711740000000 * id_pesanan 1004 total 12000

# Memangkas menyusul, tanpa menulis entri baru
XTRIM pesanan MAXLEN ~ 10000</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Selalu pakai tanda <code>~</code></strong>
                <p>Tanpa <code>~</code>, Redis wajib memangkas ke jumlah yang persis, dan itu bisa memblokir server single-thread cukup lama pada Stream besar. Dengan <code>~</code>, hasil akhirnya "sekitar" jumlah yang Anda minta — hampir selalu cukup baik, dan jauh lebih aman.</p>
            </div>

            <h3>5. Membaca Riwayat: XRANGE dan XREVRANGE</h3>
            <div class="code-box">
                <pre># Baca semua entri. Tanda - berarti ID terkecil, + berarti ID terbesar.
XRANGE pesanan - +

# Baca 2 entri pertama saja
XRANGE pesanan - + COUNT 2

# Baca rentang waktu tertentu (ID boleh hanya bagian milidetiknya)
XRANGE pesanan 1712345678901 1712345679999

# Baca dari yang terbaru (untuk menampilkan aktivitas terakhir)
XREVRANGE pesanan + - COUNT 5

# Berapa banyak entri sekarang?
XLEN pesanan

# Informasi struktur stream: panjang, ID pertama & terakhir, jumlah group
XINFO STREAM pesanan</pre>
            </div>

            <h3>6. Membaca Data Baru: XREAD</h3>
            <p><code>XREAD</code> membaca entri yang <em>lebih baru</em> dari ID yang Anda sebutkan.</p>

            <div class="code-box">
                <pre># Baca entri setelah ID tertentu
XREAD COUNT 10 STREAMS pesanan 1712345678901

# Tanda $ berarti "hanya entri yang datang SETELAH detik ini"
# BLOCK 5000 = tunggu maksimal 5 detik bila belum ada data baru
XREAD BLOCK 5000 STREAMS pesanan $

# BLOCK 0 = tunggu selamanya sampai ada entri baru
XREAD BLOCK 0 STREAMS pesanan $

# Membaca beberapa stream sekaligus dalam satu perintah
XREAD BLOCK 0 STREAMS pesanan pembayaran $ $</pre>
            </div>

            <div class="callout callout-danger">
                <strong>🚫 Jebakan <code>$</code> pada XREAD</strong>
                <p><code>$</code> berarti "abaikan semua yang sudah ada, mulai dari sekarang". Kalau consumer Anda restart dan kembali memakai <code>$</code>, semua pesan yang datang selama proses restart <strong>terlewat diam-diam</strong>. Untuk pemrosesan yang tidak boleh kehilangan pesan, jangan pakai XREAD dengan <code>$</code> — pakai <strong>Consumer Group</strong> yang dibahas di modul berikutnya.</p>
            </div>

            <h3>7. Kapan Memilih Stream, Kapan Memilih Broker Sungguhan</h3>
            <p>Stream sangat baik, tetapi Redis bukan RabbitMQ atau Kafka. Pilih Stream bila:</p>
            <ul>
                <li>Anda <strong>sudah memakai Redis</strong> dan tidak ingin menambah komponen infrastruktur baru.</li>
                <li>Volume pesan menengah dan retensi yang dibutuhkan pendek (jam sampai hari, bukan bulan).</li>
                <li>Anda butuh latensi sangat rendah dan pola konsumsi sederhana.</li>
            </ul>
            <p>Pindah ke RabbitMQ atau Kafka bila Anda butuh routing rumit (topic exchange, header), retensi panjang berbasis disk, replay skala besar, atau jaminan urutan per-partisi lintas puluhan consumer.</p>
        `,
        sampleCommands: [
            "XADD pesanan * id_pesanan 1001 total 250000",
            "XLEN pesanan",
            "XRANGE pesanan - + COUNT 5",
            "XREVRANGE pesanan + - COUNT 1",
            "XTRIM pesanan MAXLEN ~ 1000",
            "XINFO STREAM pesanan"
        ],
        quiz: [
            {
                question: "Apa perbedaan paling mendasar antara Redis Stream dan Redis Pub/Sub?",
                options: [
                    "Stream menyimpan pesan sehingga bisa dibaca ulang, sedangkan Pub/Sub membuang pesan setelah dikirim",
                    "Stream hanya bisa menyimpan angka, Pub/Sub bisa menyimpan teks",
                    "Pub/Sub lebih cepat karena menulis ke disk",
                    "Stream hanya mendukung satu consumer saja"
                ],
                answer: 0,
                explanation: "Pub/Sub bersifat fire-and-forget: kalau tidak ada subscriber yang sedang terhubung, pesan hilang selamanya. Stream adalah log append-only yang menyimpan entri, sehingga consumer yang terlambat atau baru restart tetap bisa membaca riwayat."
            },
            {
                question: "Mengapa XADD dengan MAXLEN sebaiknya selalu memakai tanda ~ (misal MAXLEN ~ 10000)?",
                options: [
                    "Karena tanpa ~ perintah akan ditolak Redis",
                    "Karena pemangkasan persis harus memindai dan menghapus node satu per satu sehingga bisa memblokir Redis yang single-threaded",
                    "Karena ~ membuat Redis menyimpan data ke disk",
                    "Karena ~ mengaktifkan kompresi otomatis"
                ],
                answer: 1,
                explanation: "Tanda ~ memberi izin Redis memangkas sampai batas node radix tree terdekat, bukan ke angka persis. Ini jauh lebih murah dan menghindari blocking panjang pada Stream berukuran besar."
            },
            {
                question: "Apa risiko memakai XREAD dengan ID '$' pada consumer produksi?",
                options: [
                    "Tidak ada risiko, itu cara yang dianjurkan",
                    "Redis akan menolak perintahnya",
                    "Pesan yang datang saat consumer sedang restart akan terlewat tanpa peringatan",
                    "Semua data lama akan terhapus"
                ],
                answer: 2,
                explanation: "'$' berarti mulai dari entri yang datang setelah perintah dijalankan. Selama consumer mati atau restart, entri baru tetap masuk ke stream tapi tidak akan pernah dibaca. Gunakan Consumer Group agar posisi baca tersimpan di server."
            }
        ]
    },
    {
        id: 13,
        title: "13. Consumer Group - Pemrosesan Andal & At-Least-Once",
        category: "Advanced",
        videoId: null,
        desc: "Membagi beban pemrosesan stream ke banyak worker dengan jaminan setiap pesan diproses, memakai XREADGROUP, XACK, XPENDING, dan XAUTOCLAIM.",
        summary: "Consumer Group memungkinkan beberapa worker membagi entri dari satu Stream tanpa tumpang tindih, sambil melacak entri mana yang sudah dikonfirmasi selesai. Entri yang sudah dikirim tapi belum di-XACK masuk ke daftar PEL (Pending Entries List). Bila worker mati, entri tersebut bisa diambil alih worker lain lewat XAUTOCLAIM. Model jaminannya at-least-once, sehingga consumer WAJIB idempoten.",
        theory: `
            <h3>1. Tiga Peran yang Perlu Dibedakan</h3>
            <ul>
                <li><strong>Stream</strong> — lognya sendiri, misal <code>pesanan</code>.</li>
                <li><strong>Consumer Group</strong> — sekelompok worker yang bersama-sama menghabiskan satu stream. Group menyimpan posisi baca terakhir <em>di sisi server</em>, bukan di aplikasi.</li>
                <li><strong>Consumer</strong> — anggota individual di dalam group, punya nama sendiri (misal <code>worker-1</code>).</li>
            </ul>

            <div class="callout callout-info">
                <strong>💡 Kunci pemahamannya:</strong> Beberapa <em>group berbeda</em> yang membaca satu stream sama akan sama-sama menerima <strong>semua</strong> pesan (seperti broadcast). Tetapi beberapa <em>consumer di dalam satu group</em> akan <strong>membagi</strong> pesan (seperti antrian kerja). Jadi satu stream bisa sekaligus melayani pola pub/sub dan pola work-queue.
            </div>

            <h3>2. Membuat Group</h3>
            <div class="code-box">
                <div class="code-box-header"><span>redis-cli</span></div>
                <pre># Buat group yang mulai membaca dari entri PALING AWAL
XGROUP CREATE pesanan grup-notifikasi 0

# Buat group yang hanya membaca entri BARU (setelah perintah ini)
XGROUP CREATE pesanan grup-analitik $

# MKSTREAM: buat stream-nya sekalian bila belum ada.
# Tanpa ini, perintah gagal kalau stream belum pernah ditulisi.
XGROUP CREATE pesanan grup-invoice 0 MKSTREAM

# Lihat semua group pada satu stream
XINFO GROUPS pesanan</pre>
            </div>

            <h3>3. Membaca sebagai Anggota Group: XREADGROUP</h3>
            <div class="code-box">
                <pre># Tanda &gt; berarti "beri saya entri yang BELUM PERNAH dikirim
# ke consumer mana pun di group ini"
XREADGROUP GROUP grup-notifikasi worker-1 COUNT 10 BLOCK 5000 STREAMS pesanan &gt;

# ID 0 berarti "beri saya entri yang SUDAH dikirim ke SAYA
# tapi belum saya konfirmasi" -- dipakai saat worker baru restart
XREADGROUP GROUP grup-notifikasi worker-1 COUNT 10 STREAMS pesanan 0</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Pola startup worker yang benar</strong>
                <p>Saat worker menyala, jangan langsung membaca <code>&gt;</code>. Baca dulu dengan ID <code>0</code> untuk menghabiskan pekerjaan yang tertinggal dari sesi sebelumnya, baru beralih ke <code>&gt;</code> setelah daftarnya kosong. Melewatkan langkah ini membuat pesan menggantung di PEL tanpa ada yang mengerjakannya.</p>
            </div>

            <h3>4. PEL: Pending Entries List</h3>
            <p>Begitu sebuah entri dikirim ke consumer lewat <code>XREADGROUP</code>, Redis mencatatnya di <strong>PEL</strong> — daftar "sedang dikerjakan, belum dikonfirmasi". Entri keluar dari PEL hanya ketika di-<code>XACK</code>.</p>

            <div class="code-box">
                <pre># Ringkasan: berapa banyak yang menggantung, ID terkecil & terbesar, per consumer
XPENDING pesanan grup-notifikasi

# Rincian 10 entri menggantung, lengkap dengan
# berapa lama menggantung (idle time, ms) dan berapa kali dikirim ulang
XPENDING pesanan grup-notifikasi - + 10

# Hanya milik worker tertentu
XPENDING pesanan grup-notifikasi - + 10 worker-1

# Konfirmasi selesai -- entri dibuang dari PEL
XACK pesanan grup-notifikasi 1712345678901-0</pre>
            </div>

            <h3>5. Worker Mati: Mengambil Alih dengan XAUTOCLAIM</h3>
            <p>Kalau <code>worker-1</code> mati setelah menerima entri tapi sebelum XACK, entri itu terjebak di PEL milik worker-1 selamanya. Worker lain harus mengambil alih.</p>

            <div class="code-box">
                <pre># Ambil alih entri yang sudah menganggur lebih dari 60 detik (60000 ms)
# ke consumer bernama worker-2, mulai dari kursor 0-0
XAUTOCLAIM pesanan grup-notifikasi worker-2 60000 0-0 COUNT 10

# Hasilnya: [kursor-berikutnya, [entri...], [id-yang-sudah-dihapus...]]
# Panggil berulang dengan kursor yang dikembalikan sampai kursornya 0-0.

# XCLAIM adalah versi manual untuk ID spesifik
XCLAIM pesanan grup-notifikasi worker-2 60000 1712345678901-0</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Pesan beracun (poison message)</strong>
                <p>Kalau sebuah entri selalu membuat worker crash, entri itu akan di-claim berulang kali tanpa henti dan memblokir kemajuan group. Periksa kolom <strong>delivery count</strong> dari <code>XPENDING</code>: bila sudah melewati ambang tertentu (misal 5 kali), pindahkan entri itu ke stream <code>pesanan-dlq</code> lalu XACK aslinya. Ini setara Dead Letter Queue di RabbitMQ, hanya saja di Redis Anda harus membangunnya sendiri.</p>
            </div>

            <h3>6. Jaminan Pengiriman: At-Least-Once, Bukan Exactly-Once</h3>
            <p>Urutan kejadiannya begini:</p>
            <div class="code-box">
                <pre>1. XREADGROUP  -&gt; entri masuk PEL
2. Worker memproses (misal: kirim email)
3. XACK        -&gt; entri keluar dari PEL</pre>
            </div>
            <p>Kalau worker mati di antara langkah 2 dan 3, email <em>sudah terkirim</em> tetapi entri belum di-ACK. Worker lain akan mengambil alih dan mengirim email itu <strong>lagi</strong>.</p>

            <div class="callout callout-danger">
                <strong>🚫 Tidak ada exactly-once di sistem terdistribusi</strong>
                <p>Yang bisa Anda capai adalah <em>efek</em> exactly-once melalui <strong>idempotensi</strong>: simpan ID entri yang sudah selesai diproses (misal di Set Redis atau kolom unik di database), dan lewati bila sudah pernah ada. Cara paling kokoh: jadikan penulisan hasil dan penandaan "sudah diproses" berada dalam <strong>satu transaksi database yang sama</strong>.</p>
            </div>

            <h3>7. Membersihkan Consumer yang Sudah Tidak Dipakai</h3>
            <div class="code-box">
                <pre># Lihat consumer di dalam group beserta idle time-nya
XINFO CONSUMERS pesanan grup-notifikasi

# Hapus consumer yang sudah mati permanen (misal pod lama di Kubernetes).
# PERINGATAN: entri di PEL miliknya ikut hilang -- claim dulu sebelum menghapus!
XGROUP DELCONSUMER pesanan grup-notifikasi worker-lama

# Hapus group seluruhnya
XGROUP DESTROY pesanan grup-analitik

# Geser posisi baca group secara manual (misal untuk replay dari awal)
XGROUP SETID pesanan grup-analitik 0</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Di Kubernetes, nama consumer sebaiknya stabil</strong>
                <p>Kalau nama consumer memakai hostname pod yang berubah setiap deploy, PEL akan penuh dengan consumer yatim. Pakai StatefulSet (nama pod stabil: <code>worker-0</code>, <code>worker-1</code>) atau jalankan XAUTOCLAIM secara berkala sebagai jaring pengaman.</p>
            </div>
        `,
        sampleCommands: [
            "XGROUP CREATE pesanan grup-notifikasi 0 MKSTREAM",
            "XREADGROUP GROUP grup-notifikasi worker-1 COUNT 5 STREAMS pesanan >",
            "XPENDING pesanan grup-notifikasi",
            "XACK pesanan grup-notifikasi 1712345678901-0",
            "XAUTOCLAIM pesanan grup-notifikasi worker-2 60000 0-0",
            "XINFO GROUPS pesanan"
        ],
        quiz: [
            {
                question: "Dua consumer berada dalam SATU consumer group yang sama membaca stream 'pesanan'. Apa yang terjadi pada sebuah entri baru?",
                options: [
                    "Kedua consumer sama-sama menerima entri tersebut",
                    "Hanya salah satu consumer yang menerima entri tersebut",
                    "Entri ditolak karena bentrok",
                    "Entri dikirim ke consumer pertama, lalu otomatis diulang ke consumer kedua"
                ],
                answer: 1,
                explanation: "Di dalam satu group, entri DIBAGI antar consumer (pola work queue) sehingga tiap entri hanya dikerjakan satu consumer. Untuk membuat semua pihak menerima entri yang sama, buatlah consumer group yang berbeda-beda."
            },
            {
                question: "Sebuah worker menerima entri lewat XREADGROUP lalu mati sebelum sempat menjalankan XACK. Apa yang terjadi pada entri itu?",
                options: [
                    "Entri hilang selamanya",
                    "Entri otomatis dikirim ulang ke worker lain setelah beberapa detik",
                    "Entri tetap menggantung di PEL sampai ada yang menjalankan XAUTOCLAIM atau XCLAIM",
                    "Redis me-restart worker tersebut"
                ],
                answer: 2,
                explanation: "Redis tidak punya timeout otomatis yang memindahkan entri. Entri akan terus menggantung di Pending Entries List milik consumer yang mati. Aplikasi Anda wajib menjalankan XAUTOCLAIM secara berkala untuk mengambil alih entri yang idle-nya sudah melewati ambang batas."
            },
            {
                question: "Mengapa consumer Redis Stream wajib dibuat idempoten?",
                options: [
                    "Karena Redis mengacak urutan pesan",
                    "Karena jaminan pengirimannya at-least-once, sehingga satu entri bisa diproses lebih dari sekali saat terjadi kegagalan",
                    "Karena Redis tidak mendukung transaksi sama sekali",
                    "Karena XACK bisa gagal secara acak"
                ],
                answer: 1,
                explanation: "Bila worker mati setelah menyelesaikan efek samping tetapi sebelum XACK, entri akan di-claim dan diproses ulang. Consumer harus mendeteksi bahwa ID entri tersebut sudah pernah diproses agar efeknya tidak berlipat."
            }
        ]
    },
    {
        id: 14,
        title: "14. Lua Scripting & Redis Functions",
        category: "Advanced",
        videoId: null,
        desc: "Menjalankan logika multi-perintah secara atomik di dalam server memakai EVAL, EVALSHA, dan Redis Functions (FUNCTION LOAD) di Redis 7+.",
        summary: "Skrip Lua dieksekusi secara atomik: tidak ada perintah client lain yang menyela di tengah skrip. Ini menyelesaikan masalah race condition yang tidak bisa dipecahkan MULTI/EXEC karena MULTI tidak bisa membaca nilai lalu mengambil keputusan. EVAL mengirim skrip tiap kali, EVALSHA memakai hash agar hemat bandwidth. Redis 7 memperkenalkan Functions yang tersimpan permanen dan ikut direplikasi.",
        theory: `
            <h3>1. Kenapa MULTI/EXEC Saja Tidak Cukup</h3>
            <p>Transaksi <code>MULTI/EXEC</code> menjalankan sekumpulan perintah tanpa disela, <strong>tetapi tidak bisa membaca nilai lalu mengambil keputusan berdasarkan nilai itu</strong> — karena semua perintah baru dieksekusi saat EXEC.</p>

            <p>Contoh kasus yang mustahil dengan MULTI: <em>"kurangi stok hanya bila stok masih lebih besar dari 0"</em>.</p>

            <div class="code-box">
                <div class="code-box-header"><span>Cara yang SALAH — ada celah balapan</span></div>
                <pre>GET stok:produk-1        # aplikasi membaca: 1
# &lt;-- di detik ini, client lain juga membaca 1 dan ikut mengurangi
DECR stok:produk-1       # hasilnya bisa jadi -1. Stok minus!</pre>
            </div>

            <h3>2. Solusinya: Skrip Lua yang Atomik</h3>
            <div class="code-box">
                <div class="code-box-header"><span>redis-cli</span></div>
                <pre>EVAL "
  local stok = tonumber(redis.call('GET', KEYS[1]))
  if stok == nil or stok &lt;= 0 then
    return -1
  end
  redis.call('DECR', KEYS[1])
  return stok - 1
" 1 stok:produk-1

# Angka 1 setelah skrip = berapa banyak KEYS yang dikirim.
# KEYS[1] = 'stok:produk-1'. Sisanya masuk ke ARGV.</pre>
            </div>

            <div class="callout callout-info">
                <strong>💡 Kenapa ini aman:</strong> Redis single-threaded dan menjalankan seluruh skrip sebagai <strong>satu unit</strong>. Tidak ada perintah client lain yang bisa menyelip antara <code>GET</code> dan <code>DECR</code> di dalam skrip.
            </div>

            <h3>3. KEYS vs ARGV — Jangan Sampai Tertukar</h3>
            <table class="tech-table">
                <thead><tr><th></th><th>KEYS</th><th>ARGV</th></tr></thead>
                <tbody>
                    <tr><td>Isi</td><td>Nama key yang disentuh skrip</td><td>Nilai/parameter biasa</td></tr>
                    <tr><td>Wajib?</td><td>Ya, untuk semua key</td><td>Opsional</td></tr>
                    <tr><td>Kenapa penting</td><td>Redis Cluster memakainya untuk menentukan node tujuan</td><td>Tidak memengaruhi routing</td></tr>
                </tbody>
            </table>

            <div class="callout callout-danger">
                <strong>🚫 Kesalahan fatal di Redis Cluster</strong>
                <p>Kalau Anda menyusun nama key di dalam skrip (misal <code>redis.call('GET', 'stok:' .. ARGV[1])</code>) alih-alih melewatkannya lewat KEYS, skrip akan berjalan mulus di Redis satu node tetapi <strong>rusak di Cluster</strong> karena Redis tidak tahu key itu ada di node mana. Selalu lewatkan setiap key lewat KEYS.</p>
            </div>

            <h3>4. EVALSHA: Hemat Bandwidth</h3>
            <div class="code-box">
                <pre># Daftarkan skrip sekali, dapatkan SHA1-nya
SCRIPT LOAD "return redis.call('INCR', KEYS[1])"
# =&gt; "e0e1f9fabfc9d4800c877a703b823ac0578ff831"

# Panggil dengan hash saja -- jauh lebih ringan daripada
# mengirim seluruh teks skrip setiap kali
EVALSHA e0e1f9fabfc9d4800c877a703b823ac0578ff831 1 counter:halaman

# Cek apakah skrip sudah ada di cache server
SCRIPT EXISTS e0e1f9fabfc9d4800c877a703b823ac0578ff831</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Cache skrip hilang saat restart</strong>
                <p>Cache SHA bersifat sementara. Setelah Redis restart atau <code>SCRIPT FLUSH</code>, <code>EVALSHA</code> akan menjawab <code>NOSCRIPT</code>. Library klien yang baik menangani ini otomatis dengan jatuh kembali ke EVAL lalu menyimpan ulang hash-nya — pastikan library Anda melakukannya, atau tangani sendiri.</p>
            </div>

            <h3>5. Contoh Nyata: Rate Limiter Sliding Window</h3>
            <div class="code-box">
                <div class="code-box-header"><span>rate_limit.lua</span></div>
                <pre>-- KEYS[1] = kunci rate limit, misal 'rate:user:42'
-- ARGV[1] = batas maksimum request
-- ARGV[2] = panjang jendela dalam detik
-- ARGV[3] = timestamp sekarang (ms) dari aplikasi
-- ARGV[4] = ID unik request ini

local batas    = tonumber(ARGV[1])
local jendela  = tonumber(ARGV[2])
local sekarang = tonumber(ARGV[3])
local id       = ARGV[4]

-- Buang jejak request yang sudah lewat dari jendela
redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, sekarang - (jendela * 1000))

local jumlah = redis.call('ZCARD', KEYS[1])
if jumlah &gt;= batas then
  return 0        -- ditolak
end

redis.call('ZADD', KEYS[1], sekarang, id)
redis.call('EXPIRE', KEYS[1], jendela)
return 1          -- diizinkan</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Ambil waktu dari aplikasi, bukan dari Lua</strong>
                <p>Jangan memakai <code>redis.call('TIME')</code> di dalam skrip yang mengubah data. Nilai waktu bersifat non-deterministik dan dulu membuat replikasi tidak konsisten. Kirimkan timestamp dari aplikasi lewat ARGV agar hasilnya deterministik.</p>
            </div>

            <h3>6. Redis Functions (Redis 7+)</h3>
            <p>Kelemahan skrip Lua: ia hanya "menumpang" di cache dan bisa lenyap. <strong>Redis Functions</strong> menyimpan pustaka fungsi secara permanen — ikut tersimpan di RDB/AOF dan ikut direplikasi ke replika.</p>

            <div class="code-box">
                <div class="code-box-header"><span>perpustakaan.lua</span></div>
                <pre>#!lua name=tokolib

local function kurangi_stok(keys, args)
  local stok = tonumber(redis.call('GET', keys[1]))
  if stok == nil or stok &lt;= 0 then
    return -1
  end
  redis.call('DECR', keys[1])
  return stok - 1
end

redis.register_function('kurangi_stok', kurangi_stok)</pre>
            </div>

            <div class="code-box">
                <pre># Muat pustaka ke server
redis-cli -x FUNCTION LOAD &lt; perpustakaan.lua

# Panggil fungsinya (FCALL untuk yang menulis, FCALL_RO untuk read-only)
FCALL kurangi_stok 1 stok:produk-1

# Kelola pustaka
FUNCTION LIST
FUNCTION STATS
FUNCTION DELETE tokolib</pre>
            </div>

            <h3>7. Aturan Main yang Wajib Dipatuhi</h3>
            <ul>
                <li><strong>Buat skrip sesingkat mungkin.</strong> Selama skrip berjalan, <em>seluruh</em> Redis terblokir. Skrip yang berjalan 100 ms berarti 100 ms downtime untuk semua client.</li>
                <li><strong>Jangan ada loop tak berujung.</strong> Redis akan menolak perintah lain sampai <code>busy-reply-threshold</code> tercapai, lalu hanya SCRIPT KILL dan SHUTDOWN NOSAVE yang diterima.</li>
                <li><strong>Jaga determinisme.</strong> Hindari waktu acak, angka acak tanpa seed, dan iterasi atas struktur yang urutannya tak terjamin.</li>
                <li><strong>Jangan pakai untuk pekerjaan berat.</strong> Lua bukan tempat memproses ribuan key. Kalau butuh itu, pindahkan logikanya ke aplikasi dan pakai pipeline.</li>
            </ul>
        `,
        sampleCommands: [
            "EVAL \"return redis.call('SET', KEYS[1], ARGV[1])\" 1 kunci nilai",
            "SCRIPT LOAD \"return redis.call('INCR', KEYS[1])\"",
            "SCRIPT EXISTS e0e1f9fabfc9d4800c877a703b823ac0578ff831",
            "FUNCTION LIST",
            "FUNCTION STATS"
        ],
        quiz: [
            {
                question: "Mengapa skrip Lua bisa menyelesaikan masalah 'kurangi stok hanya bila stok > 0' sedangkan MULTI/EXEC tidak bisa?",
                options: [
                    "Karena Lua berjalan lebih cepat daripada perintah biasa",
                    "Karena skrip Lua bisa membaca nilai lalu mengambil keputusan di tengah eksekusi atomik, sementara MULTI baru menjalankan semua perintah saat EXEC",
                    "Karena MULTI tidak mendukung perintah DECR",
                    "Karena Lua otomatis mengunci key yang disentuh"
                ],
                answer: 1,
                explanation: "MULTI hanya mengantrikan perintah; hasil pembacaan baru tersedia setelah EXEC, sehingga tidak bisa dipakai untuk percabangan. Skrip Lua dieksekusi utuh sebagai satu unit tanpa disela, sehingga GET lalu keputusan lalu DECR aman dari balapan."
            },
            {
                question: "Apa akibatnya bila nama key disusun di dalam skrip Lua alih-alih dikirim lewat KEYS?",
                options: [
                    "Skrip menjadi lebih cepat",
                    "Tidak ada akibat apa pun",
                    "Skrip akan rusak di Redis Cluster karena Redis tidak bisa menentukan node tujuan key tersebut",
                    "Redis menolak skrip saat SCRIPT LOAD"
                ],
                answer: 2,
                explanation: "Redis Cluster memakai daftar KEYS untuk menghitung hash slot dan mengarahkan perintah ke node yang benar. Key yang dibentuk di dalam skrip tidak terlihat oleh mekanisme routing, sehingga skrip bisa menyentuh node yang salah."
            },
            {
                question: "Apa keunggulan utama Redis Functions (Redis 7+) dibanding EVAL/EVALSHA biasa?",
                options: [
                    "Functions bisa ditulis dalam bahasa Python",
                    "Functions tersimpan permanen, ikut masuk RDB/AOF, dan direplikasi ke replika sehingga tidak hilang saat restart",
                    "Functions berjalan di thread terpisah sehingga tidak memblokir Redis",
                    "Functions tidak memerlukan parameter KEYS"
                ],
                answer: 1,
                explanation: "Skrip EVALSHA hanya berada di cache sementara dan lenyap saat restart atau SCRIPT FLUSH. Redis Functions adalah artefak permanen yang dikelola sebagai pustaka, ikut dipersistensikan dan direplikasi."
            }
        ]
    },
    {
        id: 15,
        title: "15. Replication & High Availability dengan Sentinel",
        category: "Advanced",
        videoId: null,
        desc: "Menyiapkan replika baca, memahami replikasi asinkron beserta risikonya, dan otomatisasi failover memakai Redis Sentinel.",
        summary: "Replikasi Redis bersifat asinkron: master membalas OK ke client sebelum replika menerima datanya, sehingga selalu ada kemungkinan kehilangan tulisan saat failover. Sentinel adalah proses pengawas terpisah yang memantau master, menyepakati kondisi 'down' lewat kuorum, memilih replika terbaik, dan mempromosikannya. Client harus bertanya alamat master ke Sentinel, bukan menyimpannya secara keras di konfigurasi.",
        theory: `
            <h3>1. Replikasi Dasar</h3>
            <div class="code-box">
                <div class="code-box-header"><span>Di server replika</span></div>
                <pre># Cara permanen: tulis di redis.conf
replicaof 10.0.0.1 6379
masterauth password-master-yang-kuat

# Cara sementara saat runtime
REPLICAOF 10.0.0.1 6379

# Melepas diri menjadi master mandiri
REPLICAOF NO ONE

# Memeriksa keadaan
INFO replication</pre>
            </div>

            <p>Keluaran <code>INFO replication</code> di master menampilkan hal terpenting: <code>master_repl_offset</code> (posisi tulisan master) dan offset tiap replika. <strong>Selisih keduanya adalah lag replikasi Anda</strong> — pantau angka ini.</p>

            <h3>2. Replikasi Redis Bersifat Asinkron</h3>
            <div class="code-box">
                <pre>Client        Master                    Replika
  │             │                          │
  │─ SET k v ──&gt;│                          │
  │&lt;─── OK ─────│   (dibalas DULUAN!)      │
  │             │──── propagasi ──────────&gt;│
  │             │                          │ (baru tiba di sini)</pre>
            </div>

            <div class="callout callout-danger">
                <strong>🚫 Konsekuensi yang harus Anda terima</strong>
                <p>Bila master mati tepat di celah antara "OK" dan propagasi, tulisan tersebut <strong>hilang permanen</strong> setelah failover. Redis <em>tidak</em> menawarkan replikasi sinkron penuh. Karena itu <strong>jangan pernah menjadikan Redis satu-satunya penyimpan data yang tidak boleh hilang</strong> — uang, pesanan, dan transaksi tetap harus ditulis ke database yang durabel.</p>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Mitigasi parsial: WAIT</span></div>
                <pre># Tunggu sampai minimal 1 replika mengonfirmasi, maksimal 500 ms
SET pesanan:99 diproses
WAIT 1 500
# Mengembalikan jumlah replika yang benar-benar sudah menerima.
# Ini MENGURANGI jendela kehilangan data, bukan menghilangkannya.</pre>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Mitigasi di sisi master: tolak tulisan bila replika kurang</span></div>
                <pre># Di redis.conf master
min-replicas-to-write 1
min-replicas-max-lag 10
# Master menolak semua penulisan bila tidak ada minimal 1 replika
# yang lag-nya di bawah 10 detik. Lebih baik gagal terang-terangan
# daripada menerima data yang diam-diam berisiko hilang.</pre>
            </div>

            <h3>3. Sentinel: Failover Otomatis</h3>
            <p>Replikasi saja tidak memberi ketersediaan tinggi — kalau master mati, tidak ada yang mempromosikan replika. <strong>Sentinel</strong> adalah proses terpisah yang mengerjakan itu.</p>

            <p>Tugas Sentinel ada empat:</p>
            <ul>
                <li><strong>Monitoring</strong> — memeriksa master dan replika masih hidup.</li>
                <li><strong>Notifikasi</strong> — memberi tahu operator saat ada masalah.</li>
                <li><strong>Failover otomatis</strong> — mempromosikan replika menjadi master baru.</li>
                <li><strong>Penyedia konfigurasi</strong> — client bertanya "siapa master sekarang?" ke Sentinel.</li>
            </ul>

            <div class="code-box">
                <div class="code-box-header"><span>sentinel.conf</span></div>
                <pre>port 26379

# Format: sentinel monitor &lt;nama&gt; &lt;ip-master&gt; &lt;port&gt; &lt;kuorum&gt;
sentinel monitor mymaster 10.0.0.1 6379 2

# Dianggap tidak responsif setelah 5 detik tanpa balasan
sentinel down-after-milliseconds mymaster 5000

# Berapa replika yang disinkronkan bersamaan ke master baru.
# Angka 1 = paling aman; replika lain menyusul bergantian
# sehingga tidak semuanya sibuk resync di saat bersamaan.
sentinel parallel-syncs mymaster 1

# Batas waktu satu siklus failover
sentinel failover-timeout mymaster 60000

sentinel auth-pass mymaster password-master-yang-kuat</pre>
            </div>

            <h3>4. Kenapa Sentinel Harus Ganjil dan Minimal Tiga</h3>
            <div class="callout callout-warning">
                <strong>⚠️ Kuorum dan mayoritas adalah dua hal berbeda</strong>
                <p><strong>Kuorum</strong> menentukan berapa Sentinel yang harus sepakat bahwa master <em>terlihat</em> mati. Tetapi untuk benar-benar <em>menjalankan</em> failover, Sentinel yang memimpin harus mendapat suara <strong>mayoritas dari seluruh Sentinel</strong>.</p>
                <p>Dengan hanya 2 Sentinel, kalau satu mati, yang tersisa tidak akan pernah mencapai mayoritas (butuh 2 dari 2) sehingga failover <strong>tidak akan pernah terjadi</strong>. Pakai <strong>3 Sentinel di tiga mesin/zona berbeda</strong>. Menaruh semua Sentinel di satu host membuat seluruh mekanisme HA sia-sia.</p>
            </div>

            <h3>5. Client Harus Sadar-Sentinel</h3>
            <div class="code-box">
                <pre># Tanya siapa master saat ini
SENTINEL get-master-addr-by-name mymaster
# =&gt; 1) "10.0.0.2"   2) "6379"

SENTINEL master mymaster
SENTINEL replicas mymaster
SENTINEL sentinels mymaster

# Memicu failover manual (berguna saat maintenance terencana)
SENTINEL failover mymaster</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Jangan menuliskan IP master di konfigurasi aplikasi</strong>
                <p>Setelah failover, IP master berubah. Aplikasi harus terhubung lewat driver yang mendukung Sentinel — beri daftar alamat Sentinel dan nama master, biarkan driver yang menemukan master dan menyambung ulang otomatis saat terjadi failover.</p>
                <div class="code-box">
                    <pre># Contoh Node.js (ioredis)
new Redis({
  sentinels: [
    { host: '10.0.0.11', port: 26379 },
    { host: '10.0.0.12', port: 26379 },
    { host: '10.0.0.13', port: 26379 }
  ],
  name: 'mymaster'
})</pre>
                </div>
            </div>

            <h3>6. Split-Brain dan Cara Menguranginya</h3>
            <p>Bila jaringan terpecah, master lama bisa saja masih menerima tulisan dari sebagian client sementara master baru sudah dipromosikan di sisi lain. Saat jaringan pulih, master lama diturunkan menjadi replika dan <strong>seluruh tulisan yang ia terima selama terpisah akan dibuang</strong>.</p>
            <p>Pengaturan <code>min-replicas-to-write</code> di poin 2 adalah pertahanan utama: master yang terisolasi kehilangan replikanya, sehingga ia berhenti menerima tulisan alih-alih menampung data yang pasti akan hilang.</p>

            <h3>7. Sentinel vs Cluster — Pilih yang Mana</h3>
            <table class="tech-table">
                <thead><tr><th>Kebutuhan</th><th>Pilihan</th></tr></thead>
                <tbody>
                    <tr><td>Data muat di RAM satu mesin, hanya butuh HA</td><td><strong>Sentinel</strong> — jauh lebih sederhana</td></tr>
                    <tr><td>Data melebihi kapasitas RAM satu mesin</td><td><strong>Cluster</strong> — sharding otomatis</td></tr>
                    <tr><td>Butuh throughput tulis melebihi satu node</td><td><strong>Cluster</strong></td></tr>
                    <tr><td>Banyak operasi lintas-key (MSET, SINTER, transaksi multi-key)</td><td><strong>Sentinel</strong> — Cluster membatasi ini</td></tr>
                </tbody>
            </table>
        `,
        sampleCommands: [
            "INFO replication",
            "REPLICAOF NO ONE",
            "WAIT 1 500",
            "SENTINEL get-master-addr-by-name mymaster",
            "SENTINEL master mymaster"
        ],
        quiz: [
            {
                question: "Mengapa Redis tidak bisa menjamin nol kehilangan data saat failover?",
                options: [
                    "Karena replika selalu tertinggal satu jam",
                    "Karena replikasinya asinkron: master membalas OK ke client sebelum replika menerima data tersebut",
                    "Karena Redis tidak menyimpan data ke disk sama sekali",
                    "Karena Sentinel selalu memilih replika paling lama"
                ],
                answer: 1,
                explanation: "Master membalas ke client lebih dulu, baru mempropagasi ke replika. Bila master mati di celah itu, tulisan tersebut belum pernah sampai ke replika mana pun dan hilang saat replika dipromosikan."
            },
            {
                question: "Mengapa memakai hanya 2 Sentinel adalah konfigurasi yang berbahaya?",
                options: [
                    "Karena Sentinel harus selalu berjumlah kelipatan 4",
                    "Karena 2 Sentinel memakai terlalu banyak memori",
                    "Karena bila satu Sentinel mati, yang tersisa tidak akan pernah mencapai suara mayoritas sehingga failover tidak akan pernah dijalankan",
                    "Karena Sentinel kedua otomatis dimatikan Redis"
                ],
                answer: 2,
                explanation: "Selain kuorum untuk menyatakan master mati, Sentinel pemimpin butuh mayoritas dari total Sentinel untuk menjalankan failover. Dengan total 2, mayoritasnya adalah 2 — mustahil dicapai bila satu sudah mati. Gunakan minimal 3 Sentinel di lokasi berbeda."
            },
            {
                question: "Apa fungsi pengaturan 'min-replicas-to-write 1' pada master?",
                options: [
                    "Membatasi jumlah replika maksimal menjadi 1",
                    "Membuat master menolak penulisan bila tidak ada replika sehat, sehingga kegagalan terlihat jelas alih-alih data diam-diam berisiko hilang",
                    "Memaksa replikasi menjadi sinkron penuh",
                    "Mempercepat proses failover"
                ],
                answer: 1,
                explanation: "Pengaturan ini membuat master yang terisolasi jaringan berhenti menerima tulisan. Lebih baik aplikasi menerima error terang-terangan daripada menulis data yang pasti dibuang ketika master lama diturunkan menjadi replika."
            }
        ]
    },
    {
        id: 16,
        title: "16. Redis Cluster & Sharding Horizontal",
        category: "Advanced",
        videoId: null,
        desc: "Membagi data ke banyak node dengan 16.384 hash slot, memahami error CROSSSLOT dan MOVED, serta memakai hash tag untuk mengelompokkan key.",
        summary: "Redis Cluster membagi keyspace ke 16.384 hash slot yang dibagikan ke node-node master. Slot ditentukan dari CRC16 nama key. Operasi multi-key hanya boleh menyentuh key yang berada di slot yang sama, kalau tidak akan muncul error CROSSSLOT. Hash tag dengan kurung kurawal memaksa beberapa key jatuh ke slot yang sama. Client harus sadar-cluster untuk menangani redirect MOVED dan ASK.",
        theory: `
            <h3>1. Kapan Anda Benar-benar Butuh Cluster</h3>
            <div class="callout callout-warning">
                <strong>⚠️ Jangan pakai Cluster kalau belum perlu</strong>
                <p>Cluster menambah banyak batasan. Satu node Redis modern sanggup menangani puluhan ribu operasi per detik dan ratusan GB RAM. Pakai Cluster hanya bila: (a) data melebihi RAM satu mesin, atau (b) throughput tulis melebihi kemampuan satu node. Kalau yang Anda butuhkan cuma ketersediaan tinggi, <strong>Sentinel jauh lebih sederhana</strong>.</p>
            </div>

            <h3>2. Hash Slot: 16.384 Kotak</h3>
            <p>Cluster tidak membagi berdasarkan node, melainkan berdasarkan <strong>slot</strong>. Rumusnya:</p>

            <div class="code-box">
                <pre>slot = CRC16(nama_key) mod 16384</pre>
            </div>

            <p>Slot-slot itu lalu dibagi ke master:</p>
            <div class="code-box">
                <pre>Master A : slot 0     – 5460
Master B : slot 5461  – 10922
Master C : slot 10923 – 16383</pre>
            </div>

            <p>Lapisan slot inilah yang membuat penambahan node menjadi mudah: Anda memindahkan <em>slot</em> dari node lama ke node baru, dan pemetaan key tidak perlu dihitung ulang seperti pada hashing modulo biasa.</p>

            <div class="code-box">
                <pre># Lihat slot sebuah key
CLUSTER KEYSLOT pesanan:1001
# =&gt; 12735

CLUSTER INFO
CLUSTER NODES
CLUSTER SHARDS</pre>
            </div>

            <h3>3. Redirect MOVED dan ASK</h3>
            <div class="code-box">
                <pre># Client menghubungi node yang salah
GET pesanan:1001
(error) MOVED 12735 10.0.0.3:6379
# Artinya: slot 12735 milik node 10.0.0.3. Silakan ke sana.

# Selama slot sedang dipindahkan antar node:
(error) ASK 12735 10.0.0.4:6379
# Artinya: untuk kali ini saja, coba ke node itu.</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Pakai client sadar-cluster</strong>
                <p>Client yang benar akan mengambil peta slot saat pertama terhubung, mengarahkan tiap perintah langsung ke node yang tepat, dan memperbarui petanya saat menerima MOVED. Kalau Anda memakai <code>redis-cli</code>, tambahkan flag <code>-c</code> agar ia mengikuti redirect otomatis.</p>
                <div class="code-box">
                    <pre>redis-cli -c -h 10.0.0.1 -p 6379</pre>
                </div>
            </div>

            <h3>4. Batasan Terbesar: Operasi Multi-Key</h3>
            <div class="code-box">
                <pre># Kedua key ini kemungkinan besar ada di slot berbeda
MGET user:1 user:2
(error) CROSSSLOT Keys in request don't hash to the same slot</pre>
            </div>

            <p>Ini berlaku untuk <code>MGET</code>, <code>MSET</code>, <code>SINTER</code>, <code>SUNIONSTORE</code>, <code>RENAME</code>, transaksi <code>MULTI</code> multi-key, dan skrip Lua yang menyentuh beberapa key.</p>

            <h3>5. Solusinya: Hash Tag</h3>
            <p>Bila nama key mengandung <code>{...}</code>, Redis <strong>hanya menghitung isi kurung kurawal itu</strong> untuk menentukan slot.</p>

            <div class="code-box">
                <pre># Tanpa hash tag -- slot berbeda-beda
user:1:profil     -&gt; slot 5321
user:1:pengaturan -&gt; slot 14002

# Dengan hash tag -- keduanya dihitung dari "user:1" saja
{user:1}:profil     -&gt; slot 8115
{user:1}:pengaturan -&gt; slot 8115   &lt;-- sama!

# Sekarang operasi multi-key jadi legal
MGET {user:1}:profil {user:1}:pengaturan</pre>
            </div>

            <div class="callout callout-danger">
                <strong>🚫 Hash tag yang terlalu luas = hot slot</strong>
                <p>Godaan terbesarnya adalah memakai satu tag untuk terlalu banyak key, misal <code>{aplikasi}:apa-pun</code>. Akibatnya <strong>seluruh data jatuh ke satu slot di satu node</strong> — Anda mendapat semua kerumitan Cluster tanpa satu pun manfaatnya. Tag harus sesempit mungkin: satu pengguna, satu penyewa, satu pesanan.</p>
            </div>

            <h3>6. Membangun Cluster</h3>
            <div class="code-box">
                <div class="code-box-header"><span>redis.conf tiap node</span></div>
                <pre>port 6379
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
appendonly yes</pre>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Terminal</span></div>
                <pre># 3 master + 3 replika (--cluster-replicas 1)
redis-cli --cluster create \\
  10.0.0.1:6379 10.0.0.2:6379 10.0.0.3:6379 \\
  10.0.0.4:6379 10.0.0.5:6379 10.0.0.6:6379 \\
  --cluster-replicas 1

# Memeriksa kesehatan dan keseimbangan slot
redis-cli --cluster check 10.0.0.1:6379
redis-cli --cluster info  10.0.0.1:6379

# Menambah node baru lalu menyeimbangkan ulang slot
redis-cli --cluster add-node 10.0.0.7:6379 10.0.0.1:6379
redis-cli --cluster rebalance 10.0.0.1:6379</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Minimal 3 master, dan replika itu wajib</strong>
                <p>Cluster butuh mayoritas master untuk tetap melayani. Dengan 2 master, matinya satu node membuat cluster berhenti total. Tanpa replika, matinya satu master berarti <strong>slot miliknya tidak terlayani</strong> dan seluruh cluster menolak permintaan (kecuali <code>cluster-require-full-coverage no</code> diaktifkan, yang membuat cluster tetap melayani slot lain tetapi datanya tidak lengkap).</p>
            </div>

            <h3>7. Hal Lain yang Berubah di Cluster</h3>
            <ul>
                <li><strong>Hanya database 0.</strong> Perintah <code>SELECT</code> tidak berlaku — kalau kode Anda memakai database 1–15, itu harus diubah.</li>
                <li><strong>Pub/Sub disiarkan ke seluruh cluster</strong> dan bisa membebani jaringan. Sejak Redis 7 ada <code>SPUBLISH</code>/<code>SSUBSCRIBE</code> (sharded pub/sub) yang membatasi siaran hanya ke shard terkait.</li>
                <li><strong><code>KEYS</code> dan <code>SCAN</code> bersifat per-node.</strong> Untuk menyapu seluruh keyspace, Anda harus melakukannya ke setiap master satu per satu.</li>
                <li><strong>Skrip Lua wajib melewatkan semua key lewat KEYS</strong> dan seluruhnya harus berada di slot yang sama.</li>
            </ul>
        `,
        sampleCommands: [
            "CLUSTER INFO",
            "CLUSTER NODES",
            "CLUSTER KEYSLOT pesanan:1001",
            "CLUSTER SHARDS",
            "CLUSTER COUNTKEYSINSLOT 12735"
        ],
        quiz: [
            {
                question: "Berapa banyak hash slot yang dimiliki sebuah Redis Cluster, dan bagaimana slot sebuah key ditentukan?",
                options: [
                    "1024 slot, ditentukan dari panjang nama key",
                    "16384 slot, ditentukan dari CRC16(nama_key) mod 16384",
                    "65536 slot, ditentukan dari urutan penulisan",
                    "256 slot, ditentukan dari jumlah node yang aktif"
                ],
                answer: 1,
                explanation: "Cluster selalu memiliki tepat 16.384 slot, berapa pun jumlah nodenya. Slot dihitung dengan CRC16 atas nama key lalu dimodulo 16384. Lapisan slot inilah yang membuat penambahan node hanya perlu memindahkan slot, bukan menghitung ulang seluruh pemetaan key."
            },
            {
                question: "Perintah MGET user:1 user:2 menghasilkan error CROSSSLOT. Apa penyebab dan solusi yang benar?",
                options: [
                    "Cluster sedang rusak; restart semua node",
                    "Kedua key jatuh di slot berbeda; gunakan hash tag seperti {user}:1 dan {user}:2 bila memang perlu diakses bersama",
                    "MGET tidak didukung di Redis versi apa pun",
                    "Jumlah node kurang; tambahkan master baru"
                ],
                answer: 1,
                explanation: "Operasi multi-key di Cluster hanya boleh menyentuh key dalam slot yang sama. Hash tag dengan kurung kurawal memaksa Redis menghitung slot hanya dari bagian di dalam kurung, sehingga key-key terkait berada di slot yang sama."
            },
            {
                question: "Apa bahaya memakai hash tag yang terlalu luas, misal semua key diberi awalan {aplikasi}?",
                options: [
                    "Nama key menjadi terlalu panjang",
                    "Seluruh data jatuh ke satu slot di satu node, sehingga hilang seluruh manfaat sharding namun kerumitan Cluster tetap ada",
                    "Redis akan menolak key tersebut",
                    "Hash tag hanya boleh dipakai maksimal 10 kali"
                ],
                answer: 1,
                explanation: "Hash tag memaksa key masuk ke slot yang sama. Tag yang terlalu umum membuat semua data menumpuk di satu node (hot slot), sementara Anda tetap menanggung semua batasan Cluster seperti larangan operasi lintas-slot."
            }
        ]
    },
    {
        id: 17,
        title: "17. Redis 8 & Modul Bawaan (JSON, Search, Time Series, Bloom, Vector)",
        category: "Advanced",
        videoId: null,
        desc: "Struktur data lanjutan yang kini menyatu di Redis 8: dokumen JSON, indeks pencarian, deret waktu, struktur probabilistik, dan pencarian vektor untuk aplikasi AI.",
        summary: "Sejak Redis 8, kemampuan yang dulu berupa modul terpisah (RedisJSON, RediSearch, RedisTimeSeries, RedisBloom) menyatu ke dalam Redis inti open source. Ini menambah tipe dokumen JSON dengan akses jalur, indeks sekunder dengan kueri teks penuh dan filter numerik, deret waktu dengan agregasi otomatis, struktur probabilistik hemat memori, serta Vector Set untuk pencarian kemiripan yang menopang aplikasi AI.",
        theory: `
            <h3>1. Perubahan Besar di Redis 8</h3>
            <p>Selama bertahun-tahun, kemampuan lanjutan Redis hanya tersedia lewat modul terpisah yang harus dipasang sendiri atau melalui Redis Stack. Sejak <strong>Redis 8</strong>, kemampuan tersebut menjadi bagian dari Redis inti.</p>

            <div class="callout callout-info">
                <strong>💡 Catatan lisensi</strong>
                <p>Redis sempat berpindah dari BSD ke lisensi ganda RSALv2/SSPLv1 pada 2024, yang memicu lahirnya fork <strong>Valkey</strong> (dikelola Linux Foundation, tetap BSD). Redis 8 kemudian menambahkan opsi <strong>AGPLv3</strong> sehingga kembali tersedia sebagai perangkat lunak open source. Bila proyek Anda punya batasan lisensi yang ketat, Valkey adalah alternatif yang kompatibel di tingkat protokol.</p>
            </div>

            <h3>2. JSON — Dokumen dengan Akses Jalur</h3>
            <p>Tanpa JSON, menyimpan objek berarti melakukan serialisasi ke string; mengubah satu field mengharuskan membaca seluruh objek, mengurainya, mengubahnya, lalu menulis balik semuanya.</p>

            <div class="code-box">
                <pre># Simpan dokumen utuh. Tanda $ adalah jalur akar.
JSON.SET produk:1 $ '{"nama":"Kopi Gayo","harga":85000,"stok":40,"tag":["kopi","aceh"]}'

# Baca hanya field tertentu -- tanpa mengambil seluruh dokumen
JSON.GET produk:1 $.harga
JSON.GET produk:1 $.nama $.stok

# Ubah satu field saja, secara atomik
JSON.SET produk:1 $.harga 90000

# Operasi numerik langsung di server
JSON.NUMINCRBY produk:1 $.stok -1

# Menambah elemen ke array di dalam dokumen
JSON.ARRAPPEND produk:1 $.tag '"premium"'
JSON.ARRLEN produk:1 $.tag

JSON.DEL produk:1 $.tag
JSON.TYPE produk:1 $.harga</pre>
            </div>

            <h3>3. Search — Indeks Sekunder untuk Redis</h3>
            <p>Redis biasa hanya bisa mencari berdasarkan nama key. Search menambahkan indeks sekunder sehingga Anda bisa mencari <em>berdasarkan isi</em>.</p>

            <div class="code-box">
                <pre># Membuat indeks atas semua key berawalan produk:
FT.CREATE idx:produk
  ON JSON
  PREFIX 1 produk:
  SCHEMA
    $.nama  AS nama  TEXT SORTABLE
    $.harga AS harga NUMERIC SORTABLE
    $.stok  AS stok  NUMERIC
    $.tag[*] AS tag  TAG

# Pencarian teks penuh
FT.SEARCH idx:produk "kopi"

# Filter rentang numerik
FT.SEARCH idx:produk "@harga:[50000 100000]"

# Gabungan teks, tag, dan angka
FT.SEARCH idx:produk "@tag:{aceh} @harga:[0 90000]" SORTBY harga ASC LIMIT 0 10

# Agregasi ala GROUP BY
FT.AGGREGATE idx:produk "*"
  GROUPBY 1 @tag
  REDUCE COUNT 0 AS jumlah
  REDUCE AVG 1 @harga AS rata_harga

FT.INFO idx:produk
FT.DROPINDEX idx:produk</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Indeks diperbarui otomatis</strong>
                <p>Setelah indeks dibuat, setiap <code>JSON.SET</code> atau <code>HSET</code> pada key yang cocok dengan PREFIX akan langsung memperbarui indeks. Anda tidak perlu melakukan reindex manual. Ingat bahwa indeks memakan RAM tambahan — ini pertukaran antara kecepatan kueri dan konsumsi memori.</p>
            </div>

            <h3>4. Time Series — Deret Waktu</h3>
            <div class="code-box">
                <pre># Buat deret dengan retensi 7 hari (dalam milidetik) dan label
TS.CREATE suhu:ruang1 RETENTION 604800000 LABELS ruangan 1 lokasi jakarta

# Tambah titik data. Tanda * berarti waktu sekarang.
TS.ADD suhu:ruang1 * 27.5

# Aturan agregasi otomatis:
# rata-ratakan tiap 1 menit ke deret ringkasan
TS.CREATE suhu:ruang1:1m
TS.CREATERULE suhu:ruang1 suhu:ruang1:1m AGGREGATION avg 60000

# Kueri rentang dengan agregasi
TS.RANGE suhu:ruang1 - + AGGREGATION avg 60000

# Kueri banyak deret sekaligus berdasarkan label
TS.MRANGE - + FILTER lokasi=jakarta</pre>
            </div>

            <h3>5. Struktur Probabilistik — Menukar Ketepatan dengan Memori</h3>
            <p>Struktur ini menjawab pertanyaan secara <em>hampir</em> tepat, tetapi dengan memori yang jauh lebih kecil dan konstan.</p>

            <div class="code-box">
                <div class="code-box-header"><span>Bloom Filter — "apakah ini pernah ada?"</span></div>
                <pre># Kapasitas 1 juta item, tingkat positif palsu 0,1%
BF.RESERVE email:terdaftar 0.001 1000000
BF.ADD email:terdaftar "budi@contoh.com"
BF.EXISTS email:terdaftar "budi@contoh.com"   # =&gt; 1
BF.EXISTS email:terdaftar "belum@ada.com"     # =&gt; 0</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Sifat jawaban Bloom Filter</strong>
                <p>Jawaban "tidak ada" <strong>pasti benar</strong>. Jawaban "ada" <strong>mungkin salah</strong> (positif palsu). Karena itu Bloom cocok sebagai penyaring awal: bila jawabannya "tidak ada", Anda bisa langsung melewati kueri database. Bila "ada", barulah periksa ke database yang sesungguhnya. Pola ini sangat efektif melawan serangan cache penetration.</p>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Struktur probabilistik lainnya</span></div>
                <pre># Cuckoo Filter -- seperti Bloom, tapi mendukung penghapusan
CF.RESERVE ip:diblokir 1000000
CF.ADD ip:diblokir "10.1.2.3"
CF.DEL ip:diblokir "10.1.2.3"

# Count-Min Sketch -- perkiraan frekuensi
CMS.INITBYPROB kunjungan 0.001 0.01
CMS.INCRBY kunjungan "/beranda" 1 "/produk" 1
CMS.QUERY kunjungan "/beranda"

# Top-K -- daftar item terpopuler
TOPK.RESERVE lagu:populer 10 2000 7 0.925
TOPK.ADD lagu:populer "lagu-a" "lagu-b" "lagu-a"
TOPK.LIST lagu:populer

# HyperLogLog (sudah ada sejak lama di Redis inti)
# Menghitung jumlah unik dengan memori tetap ~12 KB
PFADD pengunjung:hariini "user1" "user2" "user3"
PFCOUNT pengunjung:hariini</pre>
            </div>

            <h3>6. Vector Set — Pencarian Kemiripan untuk AI</h3>
            <p>Tipe data yang diperkenalkan di Redis 8 untuk menyimpan embedding dan mencari tetangga terdekat — fondasi aplikasi RAG (Retrieval-Augmented Generation) dan rekomendasi.</p>

            <div class="code-box">
                <pre># Menambahkan vektor beserta atribut
VADD dokumen VALUES 4 0.12 0.88 0.31 0.05 doc:1
VADD dokumen VALUES 4 0.10 0.90 0.29 0.07 doc:2
VADD dokumen VALUES 4 0.91 0.02 0.11 0.44 doc:3

# Cari 5 tetangga terdekat dari sebuah vektor kueri
VSIM dokumen VALUES 4 0.11 0.89 0.30 0.06 COUNT 5 WITHSCORES

# Cari yang mirip dengan elemen yang sudah ada
VSIM dokumen ELE doc:1 COUNT 3

VCARD dokumen
VDIM dokumen
VREM dokumen doc:3</pre>
            </div>

            <div class="callout callout-info">
                <strong>💡 Alur khas aplikasi RAG</strong>
                <ol>
                    <li>Potong dokumen menjadi bagian-bagian kecil (chunk).</li>
                    <li>Ubah tiap bagian menjadi vektor embedding lewat model bahasa.</li>
                    <li>Simpan vektornya ke Vector Set, teks aslinya ke JSON.</li>
                    <li>Saat ada pertanyaan, ubah pertanyaan menjadi vektor, lalu <code>VSIM</code> untuk menemukan bagian yang paling relevan.</li>
                    <li>Kirim bagian-bagian itu sebagai konteks ke model bahasa.</li>
                </ol>
            </div>

            <h3>7. Kapan Memakai, Kapan Menahan Diri</h3>
            <table class="tech-table">
                <thead><tr><th>Kebutuhan</th><th>Pertimbangan</th></tr></thead>
                <tbody>
                    <tr><td>Menyimpan objek yang sering diubah sebagian</td><td>JSON jelas lebih baik daripada serialisasi string</td></tr>
                    <tr><td>Pencarian teks penuh berskala besar</td><td>Search cukup untuk banyak kasus; Elasticsearch tetap unggul untuk analitik teks yang sangat kompleks</td></tr>
                    <tr><td>Metrik jangka panjang</td><td>Time Series baik untuk retensi pendek; Prometheus/Mimir lebih tepat untuk jangka panjang</td></tr>
                    <tr><td>Deduplikasi berskala jutaan</td><td>Bloom sangat unggul — memori tetap, bukan tumbuh linear</td></tr>
                    <tr><td>Basis data vektor produksi berskala besar</td><td>Vector Set praktis bila sudah pakai Redis; pertimbangkan basis data vektor khusus untuk skala sangat besar</td></tr>
                </tbody>
            </table>

            <div class="callout callout-warning">
                <strong>⚠️ Semuanya tetap tinggal di RAM</strong>
                <p>Indeks Search, dokumen JSON, dan vektor semuanya memakan memori. Sebuah indeks vektor bisa lebih besar daripada data aslinya. Rencanakan kapasitas RAM dengan cermat, dan pantau <code>INFO memory</code> setelah membangun indeks baru.</p>
            </div>
        `,
        sampleCommands: [
            "JSON.SET produk:1 $ '{\"nama\":\"Kopi\",\"harga\":85000}'",
            "JSON.GET produk:1 $.harga",
            "FT.INFO idx:produk",
            "PFADD pengunjung user1 user2",
            "PFCOUNT pengunjung"
        ],
        quiz: [
            {
                question: "Apa perubahan penting yang dibawa Redis 8 terkait kemampuan seperti JSON dan Search?",
                options: [
                    "Kemampuan tersebut dihapus dari Redis",
                    "Kemampuan yang dulu berupa modul terpisah (RedisJSON, RediSearch, RedisTimeSeries, RedisBloom) kini menyatu ke dalam Redis inti",
                    "Kemampuan tersebut hanya tersedia di layanan berbayar",
                    "Kemampuan tersebut dipindahkan ke Valkey"
                ],
                answer: 1,
                explanation: "Sebelumnya kemampuan ini hanya ada lewat modul yang dipasang terpisah atau melalui distribusi Redis Stack. Sejak Redis 8 semuanya menjadi bagian dari Redis inti, sehingga tidak perlu lagi memasang modul secara manual."
            },
            {
                question: "Sebuah Bloom Filter menjawab 'ada' untuk sebuah email. Apa kesimpulan yang benar?",
                options: [
                    "Email itu pasti sudah terdaftar",
                    "Email itu mungkin sudah terdaftar; perlu diverifikasi ke sumber data sebenarnya karena Bloom bisa memberi positif palsu",
                    "Email itu pasti belum terdaftar",
                    "Bloom Filter sedang rusak"
                ],
                answer: 1,
                explanation: "Bloom Filter tidak pernah memberi negatif palsu tetapi bisa memberi positif palsu. Jawaban 'tidak ada' bisa dipercaya sepenuhnya sehingga aman untuk melewati kueri database; jawaban 'ada' harus dikonfirmasi ke sumber sebenarnya."
            },
            {
                question: "Apa keunggulan JSON.SET produk:1 $.harga 90000 dibanding menyimpan objek sebagai string JSON biasa?",
                options: [
                    "Tidak ada bedanya, hanya soal gaya penulisan",
                    "Satu field bisa diubah langsung di server secara atomik tanpa perlu membaca, mengurai, dan menulis ulang seluruh dokumen",
                    "String JSON biasa tidak bisa disimpan di Redis",
                    "JSON.SET otomatis mengenkripsi datanya"
                ],
                answer: 1,
                explanation: "Dengan string biasa, mengubah satu field mengharuskan siklus baca-urai-ubah-tulis seluruh objek, yang boros jaringan dan rawan balapan. JSON.SET mengubah field yang dituju langsung di server dalam satu operasi atomik."
            }
        ]
    },
    {
        id: 18,
        title: "18. Redis Pipeline & Mass Insertion Performance",
        category: "Performance",
        videoId: "NuxYNEYydHM",
        desc: "Mengoptimalkan throughput eksekusi ribuan perintah dengan meminimalkan Round Trip Time (RTT) menggunakan Redis Pipeline.",
        summary: "Pipelining adalah teknik mengirimkan banyak perintah sekaligus ke server dalam 1 kali TCP request tanpa menunggu respon per-command, meningkatkan TPS puluhan kali lipat.",
        theory: `
            <h3>1. Masalah Latensi Jaringan (Round Trip Time / RTT)</h3>
            <p>Saat aplikasi mengirimkan 1.000 perintah Redis satu per satu secara sekuensial, waktu total eksekusi dikuasai oleh <strong>Round-Trip Time (RTT) network latency</strong>. Jika latensi jaringan antara App Server ke Redis Server adalah 1ms, maka 1.000 perintah sekuensial membutuhkan waktu minimal 1.000ms (1 detik)!</p>

            <h3>2. Solusi: Redis Pipelining</h3>
            <p><strong>Pipelining</strong> memungkinkan Client mengirimkan puluhan ribu perintah sekaligus ke dalam buffer TCP socket tanpa perlu menunggu balasan dari server secara individual. Server akan memproses seluruh perintah dan mengembalikan seluruh balasan dalam satu paket respon sekaligus.</p>

            <div class="code-container">
                <div class="code-header"><span>Perbandingan Konseptual Eksekusi</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code># Tanpa Pipelining (1000 RTT):
Client -> SET a 1 -> Server (1ms)
Client <- OK <- Server (1ms)
Client -> SET b 2 -> Server (1ms)
... (Total 1000ms+)

# Dengan Pipelining (1 RTT):
Client -> [SET a 1, SET b 2, SET c 3, ...] -> Server (1ms)
Client <- [OK, OK, OK, ...] <- Server (1ms)
(Total 2ms - 100x Lebih Cepat!)</code></pre>
            </div>

            <h3>3. Benchmarking Performa dengan redis-benchmark</h3>
            <p>Gunakan biner bawaan <code>redis-benchmark</code> di terminal OS untuk menguji batas kemampuan server Redis Anda:</p>
            <div class="code-container">
                <div class="code-header"><span>Bash</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code># Uji 100.000 request dengan 50 parallel client
redis-benchmark -q -n 100000 -c 50

# Uji khusus perintah SET dan GET dengan Pipelining 16 command
redis-benchmark -t set,get -n 100000 -P 16 -q</code></pre>
            </div>
        `,
        sampleCommands: [
            "MSET key:1 'val1' key:2 'val2' key:3 'val3'",
            "MGET key:1 key:2 key:3",
            "INFO stats"
        ],
        quiz: [
            {
                question: "Faktor utama apakah yang dikurangi oleh teknik Redis Pipelining untuk meningkatkan performa?",
                options: [
                    "Penggunaan kapasitas RAM di server",
                    "Overhead Round-Trip Time (RTT) latensi jaringan dan system call",
                    "Ukuran disk snapshot RDB",
                    "Jumlah logical database"
                ],
                answer: 1,
                explanation: "Pipelining meminimalkan latensi RTT jaringan dengan menggabungkan banyak perintah dalam 1 paket TCP."
            },
            {
                question: "Apa nama utility CLI bawaan Redis yang digunakan untuk mengukur benchmark throughput RPS (Request Per Second)?",
                options: ["redis-cli", "redis-stat", "redis-benchmark", "redis-perf"],
                answer: 2,
                explanation: "redis-benchmark adalah utilitas resmi bawaan Redis untuk pengujian performa."
            }
        ]
    },
    {
        id: 19,
        title: "19. Manajemen Memori & Kebijakan Eviction",
        category: "Performance",
        videoId: "VSuli0vwMuA",
        desc: "Mengatur maxmemory, memilih kebijakan eviction yang tepat, membaca fragmentasi memori, dan menemukan key yang memakan RAM paling banyak.",
        summary: "Redis menyimpan semua di RAM, sehingga kehabisan memori adalah mode kegagalan paling umum. maxmemory menetapkan batas, dan maxmemory-policy menentukan apa yang terjadi saat batas tercapai. Kesalahan paling sering adalah membiarkan policy pada noeviction untuk beban kerja cache, yang membuat penulisan gagal alih-alih membuang data lama. Rasio fragmentasi dan MEMORY USAGE adalah alat diagnosis utama.",
        theory: `
            <h3>1. Menetapkan Batas Memori</h3>
            <div class="code-box">
                <div class="code-box-header"><span>redis.conf</span></div>
                <pre>maxmemory 4gb
maxmemory-policy allkeys-lru
maxmemory-samples 5</pre>
            </div>

            <div class="callout callout-danger">
                <strong>🚫 Tanpa maxmemory, Redis akan tumbuh sampai OOM killer membunuhnya</strong>
                <p>Bila <code>maxmemory</code> tidak disetel, Redis akan terus memakai RAM sampai kernel Linux mematikan prosesnya secara paksa. Seluruh data di RAM lenyap seketika, dan pemulihan dari AOF/RDB bisa memakan waktu lama. <strong>Selalu setel <code>maxmemory</code></strong> — kira-kira 60–70% dari total RAM mesin, menyisakan ruang untuk proses fork saat BGSAVE.</p>
            </div>

            <h3>2. Delapan Kebijakan Eviction</h3>
            <table class="tech-table">
                <thead><tr><th>Kebijakan</th><th>Perilaku</th><th>Cocok untuk</th></tr></thead>
                <tbody>
                    <tr><td><code>noeviction</code></td><td>Tolak semua penulisan baru saat penuh (default)</td><td>Redis sebagai penyimpan utama, bukan cache</td></tr>
                    <tr><td><code>allkeys-lru</code></td><td>Buang key yang paling lama tidak diakses, dari seluruh key</td><td><strong>Cache umum</strong> — pilihan paling sering benar</td></tr>
                    <tr><td><code>allkeys-lfu</code></td><td>Buang key yang paling jarang diakses</td><td>Cache dengan pola akses yang stabil &amp; berulang</td></tr>
                    <tr><td><code>allkeys-random</code></td><td>Buang key acak</td><td>Bila semua key sama pentingnya; sangat murah</td></tr>
                    <tr><td><code>volatile-lru</code></td><td>LRU, tapi hanya pada key yang punya TTL</td><td>Campuran data permanen &amp; cache dalam satu instans</td></tr>
                    <tr><td><code>volatile-lfu</code></td><td>LFU, hanya pada key ber-TTL</td><td>Sama, dengan pola akses berulang</td></tr>
                    <tr><td><code>volatile-random</code></td><td>Acak, hanya pada key ber-TTL</td><td>Jarang dipakai</td></tr>
                    <tr><td><code>volatile-ttl</code></td><td>Buang yang TTL-nya paling dekat kedaluwarsa</td><td>Bila TTL benar-benar mencerminkan prioritas</td></tr>
                </tbody>
            </table>

            <div class="callout callout-danger">
                <strong>🚫 Jebakan kebijakan <code>volatile-*</code></strong>
                <p>Bila kebijakan Anda <code>volatile-lru</code> tetapi <strong>tidak ada satu pun key yang punya TTL</strong>, Redis tidak punya kandidat untuk dibuang. Perilakunya kembali seperti <code>noeviction</code>: penulisan gagal dengan error OOM meski Anda mengira sudah mengatur eviction. Ini penyebab insiden yang sangat sering terjadi.</p>
            </div>

            <div class="callout callout-tip">
                <strong>📌 LRU vs LFU — kapan pakai yang mana</strong>
                <p><strong>LRU</strong> membuang yang paling lama tidak disentuh. Kelemahannya: satu kali pemindaian besar (misal laporan batch yang membaca ribuan key sekali saja) bisa menggusur data panas. <strong>LFU</strong> menghitung <em>frekuensi</em> akses, sehingga key yang cuma disentuh sekali oleh batch tidak akan menggusur key yang diakses ribuan kali. Untuk cache produksi dengan pola trafik nyata, <strong>LFU sering lebih baik</strong>.</p>
            </div>

            <h3>3. LRU di Redis Bersifat Perkiraan</h3>
            <p>Redis tidak menyimpan daftar LRU yang sempurna karena itu boros memori. Sebagai gantinya ia mengambil <code>maxmemory-samples</code> key secara acak dan membuang yang terburuk di antara sampel itu.</p>

            <div class="code-box">
                <pre>maxmemory-samples 5    # default: cepat, cukup akurat
maxmemory-samples 10   # lebih akurat, sedikit lebih mahal CPU</pre>
            </div>

            <h3>4. Membaca Kondisi Memori</h3>
            <div class="code-box">
                <pre>INFO memory</pre>
            </div>

            <p>Angka yang benar-benar perlu Anda perhatikan:</p>
            <table class="tech-table">
                <thead><tr><th>Metrik</th><th>Arti</th></tr></thead>
                <tbody>
                    <tr><td><code>used_memory</code></td><td>Memori yang dipakai untuk data, menurut Redis</td></tr>
                    <tr><td><code>used_memory_rss</code></td><td>Memori yang benar-benar dipesan dari sistem operasi</td></tr>
                    <tr><td><code>mem_fragmentation_ratio</code></td><td>rss dibagi used_memory</td></tr>
                    <tr><td><code>maxmemory</code></td><td>Batas yang Anda setel</td></tr>
                    <tr><td><code>evicted_keys</code></td><td>Jumlah key yang sudah dibuang — naik terus artinya cache terlalu kecil</td></tr>
                    <tr><td><code>keyspace_hits</code> / <code>keyspace_misses</code></td><td>Bahan menghitung hit rate cache</td></tr>
                </tbody>
            </table>

            <div class="callout callout-info">
                <strong>💡 Membaca rasio fragmentasi</strong>
                <ul>
                    <li><strong>Sekitar 1,0–1,5</strong> — sehat dan normal.</li>
                    <li><strong>Di atas 1,5</strong> — fragmentasi tinggi. Aktifkan <code>activedefrag yes</code>.</li>
                    <li><strong>Di bawah 1,0</strong> — sebagian memori Redis sudah ditukar ke disk (swap). Ini <strong>gawat</strong>: latensi Redis akan meledak dari mikrodetik menjadi milidetik. Matikan swap atau kecilkan <code>maxmemory</code>.</li>
                </ul>
            </div>

            <h3>5. Menemukan Key yang Rakus</h3>
            <div class="code-box">
                <pre># Ukuran satu key tertentu dalam byte
MEMORY USAGE pesanan:1001

# Ringkasan alokasi memori keseluruhan
MEMORY DOCTOR
MEMORY STATS

# Memindai key terbesar TANPA memblokir server.
# Jalankan dari terminal, bukan dari dalam redis-cli.
redis-cli --bigkeys

# Sampel distribusi ukuran key & TTL
redis-cli --memkeys
redis-cli --hotkeys        # butuh maxmemory-policy berbasis LFU</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Big key adalah pembunuh latensi</strong>
                <p>Satu Hash berisi sejuta field atau satu List berisi jutaan elemen akan membuat operasi seperti <code>HGETALL</code> atau <code>DEL</code> memblokir Redis yang single-threaded selama puluhan hingga ratusan milidetik. <strong>Semua client lain ikut tertahan.</strong> Pecah struktur besar menjadi banyak key kecil, dan gunakan <code>UNLINK</code> (penghapusan asinkron) sebagai ganti <code>DEL</code> untuk objek besar.</p>
            </div>

            <h3>6. Menghemat Memori</h3>
            <ul>
                <li><strong>Pendekkan nama key.</strong> <code>u:1:n</code> jauh lebih hemat daripada <code>user:1:nama_lengkap</code> bila Anda punya puluhan juta key. Tapi jangan berlebihan sampai tidak terbaca.</li>
                <li><strong>Manfaatkan pengkodean hemat.</strong> Hash, List, Set, dan ZSet berukuran kecil disimpan dalam bentuk terkompresi (listpack). Ambangnya diatur oleh <code>hash-max-listpack-entries</code>, <code>zset-max-listpack-entries</code>, dan sejenisnya. Melewati ambang itu, konsumsi memori melonjak drastis.</li>
                <li><strong>Pilih Hash daripada banyak key String.</strong> Satu Hash berisi 100 field jauh lebih hemat daripada 100 key String terpisah, karena tiap key punya biaya overhead sendiri.</li>
                <li><strong>Selalu pasang TTL pada data cache.</strong> Data tanpa TTL akan menumpuk selamanya.</li>
                <li><strong>Aktifkan defragmentasi aktif</strong> bila rasio fragmentasi tinggi: <code>activedefrag yes</code>.</li>
            </ul>

            <h3>7. Memantau Kesehatan Cache</h3>
            <div class="code-box">
                <pre>hit rate = keyspace_hits / (keyspace_hits + keyspace_misses)</pre>
            </div>
            <p>Hit rate di bawah 80% biasanya berarti cache Anda terlalu kecil, TTL terlalu pendek, atau yang Anda cache memang bukan data yang sering diminta ulang. Naiknya <code>evicted_keys</code> bersamaan dengan turunnya hit rate adalah tanda paling jelas bahwa <code>maxmemory</code> perlu dinaikkan.</p>
        `,
        sampleCommands: [
            "INFO memory",
            "CONFIG GET maxmemory",
            "CONFIG GET maxmemory-policy",
            "MEMORY DOCTOR",
            "MEMORY USAGE website"
        ],
        quiz: [
            {
                question: "Sebuah Redis dipakai murni sebagai cache, tetapi maxmemory-policy dibiarkan pada nilai default. Apa yang terjadi saat memori penuh?",
                options: [
                    "Redis otomatis membuang key terlama",
                    "Redis menolak semua perintah penulisan dengan error OOM, karena default-nya adalah noeviction",
                    "Redis memindahkan data ke disk",
                    "Redis me-restart dirinya sendiri"
                ],
                answer: 1,
                explanation: "Default maxmemory-policy adalah noeviction, yang tepat untuk Redis sebagai penyimpan utama tetapi salah untuk cache. Beban kerja cache harus memakai allkeys-lru atau allkeys-lfu agar Redis membuang data lama alih-alih menolak penulisan baru."
            },
            {
                question: "Kebijakan diatur ke volatile-lru, tetapi tidak ada satu pun key yang diberi TTL. Apa akibatnya?",
                options: [
                    "Redis akan membuang key acak sebagai cadangan",
                    "Redis tidak punya kandidat untuk dibuang sehingga berperilaku seperti noeviction dan menolak penulisan",
                    "Redis otomatis memberi TTL 1 jam ke semua key",
                    "Tidak ada masalah, volatile-lru bekerja pada semua key"
                ],
                answer: 1,
                explanation: "Kebijakan volatile-* hanya mempertimbangkan key yang memiliki TTL. Tanpa satu pun key ber-TTL, daftar kandidatnya kosong dan Redis terpaksa menolak penulisan baru — persis seperti noeviction, meski operator mengira eviction sudah aktif."
            },
            {
                question: "mem_fragmentation_ratio menunjukkan nilai 0,7. Apa artinya dan mengapa berbahaya?",
                options: [
                    "Memori sangat efisien, tidak ada masalah",
                    "Sebagian memori Redis sudah ditukar ke swap disk, sehingga latensi akan melonjak drastis",
                    "Redis sedang menjalankan BGSAVE",
                    "Terlalu banyak key yang punya TTL"
                ],
                answer: 1,
                explanation: "Rasio di bawah 1,0 berarti RSS lebih kecil daripada memori yang Redis pikir ia pakai — pertanda halaman memori sudah dipindahkan ke swap. Redis dirancang untuk beroperasi di RAM; begitu menyentuh disk, latensi sub-milidetiknya hilang sama sekali."
            }
        ]
    },
    {
        id: 20,
        title: "20. Redis Persistence, Security & Best Practices",
        category: "Security",
        videoId: "sz4ynvNkt2o",
        desc: "Strategi persistensi data RDB vs AOF, otentikasi password, ACL, serta menghindari 8 Kesalahan Fatal saat menggunakan Redis.",
        summary: "Redis mendukung persistensi data ke disk melalui RDB (Snapshot) dan AOF (Append-Only Log). Keamanan dikontrol melalui AUTH, ACL, dan pengaturan jaringan.",
        theory: `
            <h3>1. Mekanisme Persistensi Data (RDB vs AOF)</h3>
            <p>Meskipun Redis bekerja di RAM, data dapat disimpan ke piringan disk agar tidak hilang saat server restart atau mati lampu:</p>
            <ul>
                <li><strong>RDB (Redis Database Snapshot):</strong> Mengambil foto snapshot seluruh isi RAM pada interval waktu tertentu (misal setiap 5 menit) dan menyimpannya sebagai file biner ringkas <code>dump.rdb</code>. Sangat cepat untuk recovery, namun ada potensi data hilang beberapa menit terakhir saat crash.</li>
                <li><strong>AOF (Append-Only File):</strong> Mencatat setiap perintah penulisan (SET, HSET, DEL) ke dalam log teks <code>appendonly.aof</code> secara real-time. Sangat aman dari kehilangan data, tetapi ukuran file log bisa membesar.</li>
                <li><strong>Hybrid Persistence (Default Redis 6+):</strong> Menggabungkan header RDB dengan tail AOF log untuk mendapatkan recovery super cepat sekaligus aman.</li>
            </ul>

            <h3>2. Keamanan Redis &amp; Authentication</h3>
            <div class="code-container">
                <div class="code-header"><span>redis.conf / Security Config</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code># 1. Batasi interface jaringan (Jangan pernah expose port 6379 ke 0.0.0.0 publik!)
bind 127.0.0.1 ::1

# 2. Pasang Password Otentikasi
requirepass SuperSecretPassword123!

# 3. Rename / Disable Perintah Berbahaya
rename-command KEYS ""
rename-command FLUSHALL ""
rename-command CONFIG "MY_SECRET_CONFIG_CMD"</code></pre>
            </div>

            <div class="callout callout-danger">
                <strong>🚫 8 Kesalahan Fatal Menggunakan Redis di Production:</strong>
                <ol>
                    <li>Menggunakan perintah <code>KEYS *</code> di production (memblokir thread tunggal Redis hingga server hang!). Gunakan <code>SCAN</code>.</li>
                    <li>Lupa memasukkan Expiration (TTL) pada data cache hingga RAM server habis penuh.</li>
                    <li>Membuka port 6379 ke publik tanpa password.</li>
                    <li>Mengabaikan konfigurasi <code>maxmemory-policy</code> (misal tidak diset <code>allkeys-lru</code>).</li>
                    <li>Menyimpan satu objek raksasa (> 100MB) di satu Key String.</li>
                    <li>Menggunakan Redis sebagai satu-satunya Primary Database tanpa backup RDB/AOF.</li>
                    <li>Tidak menggunakan Pipelining/MSET saat menginput data secara masal.</li>
                    <li>Membuat ribuan koneksi TCP baru setiap request alih-alih menggunakan Connection Pooling.</li>
                </ol>
            </div>
        `,
        sampleCommands: [
            "INFO persistence",
            "CONFIG GET maxmemory*",
            "SAVE",
            "BGSAVE"
        ],
        quiz: [
            {
                question: "Mekanisme persistensi Redis manakah yang bekerja dengan cara mencatat setiap perintah penulisan (write command) ke dalam file log?",
                options: ["RDB Snapshot", "AOF (Append-Only File)", "Memcached Dump", "WAL Sync"],
                answer: 1,
                explanation: "AOF (Append-Only File) mencatat setiap perintah penulisan data ke dalam log."
            },
            {
                question: "Mengapa perintah 'KEYS *' sangat DILARANG dijalankan pada lingkungan production?",
                options: [
                    "Karena KEYS * akan menghapus seluruh data",
                    "Karena Redis single-threaded, KEYS * di database besar akan memblokir seluruh transaksi client lain sampai selesai",
                    "Karena KEYS * hanya bisa dijalankan oleh root user",
                    "Karena KEYS * secara otomatis me-restart server"
                ],
                answer: 1,
                explanation: "Redis bersifat single-threaded. KEYS * akan memindai seluruh key di RAM, memblokir thread tunggal Redis dan menyebabkan downtime aplikasi."
            }
        ]
    },
    {
        id: 21,
        title: "21. Keamanan: ACL, TLS & Pengerasan Server",
        category: "Security",
        videoId: "6xyjNouHZf8",
        desc: "Mengunci Redis dengan ACL berbasis peran, mengenkripsi lalu lintas dengan TLS, menonaktifkan perintah berbahaya, dan menutup celah konfigurasi yang sering dieksploitasi.",
        summary: "Redis tanpa konfigurasi keamanan adalah salah satu target eksploitasi paling umum di internet. ACL (Redis 6+) memungkinkan pembuatan pengguna dengan izin per-perintah dan per-pola-key, jauh lebih baik daripada satu requirepass global. TLS mengenkripsi lalu lintas. Perintah berbahaya seperti FLUSHALL, CONFIG, dan KEYS sebaiknya diganti nama atau dilarang. Redis tidak boleh terekspos langsung ke internet dalam keadaan apa pun.",
        theory: `
            <h3>1. Bahaya Nyata Redis yang Terbuka</h3>
            <div class="callout callout-danger">
                <strong>🚫 Redis default itu tidak aman</strong>
                <p>Redis tanpa password yang terjangkau dari internet bisa <strong>diambil alih sepenuhnya</strong>. Teknik klasiknya: penyerang memakai <code>CONFIG SET dir</code> dan <code>CONFIG SET dbfilename</code> untuk menulis berkas RDB ke <code>~/.ssh/authorized_keys</code> atau ke direktori cron, lalu mendapat akses shell ke server. Ini bukan teori — ini penyebab ribuan server dibajak setiap tahun.</p>
            </div>

            <p>Pertahanan berlapis, dari yang paling penting:</p>
            <ol>
                <li><strong>Jangan pernah dengarkan alamat publik.</strong> Ini lapisan terpenting dan paling sering dilupakan.</li>
                <li>Wajibkan autentikasi (ACL, bukan sekadar requirepass).</li>
                <li>Batasi izin tiap pengguna seminimal mungkin.</li>
                <li>Nonaktifkan atau ganti nama perintah berbahaya.</li>
                <li>Enkripsi lalu lintas dengan TLS bila melintasi jaringan yang tidak tepercaya.</li>
            </ol>

            <h3>2. Lapisan Jaringan Dulu</h3>
            <div class="code-box">
                <div class="code-box-header"><span>redis.conf</span></div>
                <pre># Hanya dengarkan alamat internal. JANGAN 0.0.0.0.
bind 127.0.0.1 10.0.0.5

# Protected mode: bila tidak ada bind & tidak ada password,
# Redis hanya melayani localhost. Biarkan menyala.
protected-mode yes

# Mengganti port default mengurangi pemindaian otomatis
port 6380</pre>
            </div>

            <h3>3. ACL: Pengguna dengan Izin Terbatas</h3>
            <p>Sebelum Redis 6, yang ada hanya <code>requirepass</code> — satu password untuk semua, dengan kuasa penuh. ACL mengubahnya total.</p>

            <div class="code-box">
                <div class="code-box-header"><span>redis-cli</span></div>
                <pre># Pengguna aplikasi web: hanya boleh baca-tulis pada key cache:*
ACL SETUSER webapp on &gt;PasswordKuat123 \\
    ~cache:* \\
    +get +set +del +expire +ttl +exists

# Pengguna dasbor: hanya boleh membaca, tanpa boleh menulis apa pun
ACL SETUSER dasbor on &gt;PasswordLain456 \\
    ~stat:* \\
    +@read

# Pengguna worker: boleh seluruh perintah stream pada antrian:*
ACL SETUSER worker on &gt;PasswordWorker789 \\
    ~antrian:* \\
    +@stream +ping

# Matikan pengguna default agar tidak ada akses tanpa nama
ACL SETUSER default off</pre>
            </div>

            <p>Arti simbolnya:</p>
            <table class="tech-table">
                <thead><tr><th>Simbol</th><th>Arti</th></tr></thead>
                <tbody>
                    <tr><td><code>on</code> / <code>off</code></td><td>Mengaktifkan atau menonaktifkan pengguna</td></tr>
                    <tr><td><code>&gt;password</code></td><td>Menambahkan password</td></tr>
                    <tr><td><code>~pola</code></td><td>Pola key yang boleh disentuh</td></tr>
                    <tr><td><code>%R~pola</code> / <code>%W~pola</code></td><td>Pola khusus baca saja / tulis saja (Redis 7+)</td></tr>
                    <tr><td><code>+perintah</code> / <code>-perintah</code></td><td>Mengizinkan / melarang perintah tertentu</td></tr>
                    <tr><td><code>+@kategori</code></td><td>Mengizinkan satu kategori penuh (<code>@read</code>, <code>@write</code>, <code>@admin</code>, <code>@dangerous</code>)</td></tr>
                    <tr><td><code>&amp;pola</code></td><td>Channel Pub/Sub yang boleh diakses</td></tr>
                    <tr><td><code>allkeys</code> / <code>allcommands</code></td><td>Setara <code>~*</code> dan <code>+@all</code> — hindari untuk pengguna aplikasi</td></tr>
                </tbody>
            </table>

            <div class="code-box">
                <pre># Memeriksa dan mengelola
ACL LIST
ACL GETUSER webapp
ACL CAT                    # daftar semua kategori
ACL CAT dangerous          # perintah apa saja yang tergolong berbahaya
ACL WHOAMI                 # saya login sebagai siapa
ACL DELUSER dasbor

# Simpan ACL ke berkas terpisah agar bertahan setelah restart
# (di redis.conf: aclfile /etc/redis/users.acl)
ACL SAVE</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Prinsip hak akses terkecil</strong>
                <p>Layanan pembayaran tidak butuh <code>FLUSHALL</code>. Dasbor tidak butuh <code>SET</code>. Beri tiap layanan pengguna ACL sendiri dengan pola key yang sempit. Saat satu layanan diretas, kerusakannya terbatas pada key milik layanan itu saja.</p>
            </div>

            <h3>4. Menonaktifkan Perintah Berbahaya</h3>
            <div class="code-box">
                <div class="code-box-header"><span>redis.conf</span></div>
                <pre># Melumpuhkan perintah sepenuhnya (string kosong)
rename-command FLUSHALL ""
rename-command FLUSHDB ""
rename-command KEYS ""
rename-command DEBUG ""

# Atau menyamarkannya agar hanya admin yang tahu namanya
rename-command CONFIG "CONFIG_a8f3c19d2b"</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Untuk instalasi baru, pakai ACL saja</strong>
                <p><code>rename-command</code> adalah mekanisme lama yang kasar: ia berlaku global dan bisa membingungkan tim operasi. Dengan ACL Anda bisa melarang <code>-@dangerous</code> untuk pengguna aplikasi sambil tetap mengizinkannya untuk pengguna admin. Itu jauh lebih rapi dan bisa diaudit.</p>
            </div>

            <h3>5. TLS</h3>
            <div class="code-box">
                <div class="code-box-header"><span>redis.conf</span></div>
                <pre># Matikan port tanpa enkripsi sepenuhnya
port 0
tls-port 6379

tls-cert-file /etc/redis/tls/redis.crt
tls-key-file  /etc/redis/tls/redis.key
tls-ca-cert-file /etc/redis/tls/ca.crt

# Wajibkan client menunjukkan sertifikat (mutual TLS)
tls-auth-clients yes

# TLS untuk lalu lintas replikasi dan cluster juga
tls-replication yes
tls-cluster yes</pre>
            </div>

            <div class="code-box">
                <pre>redis-cli --tls \\
  --cert /etc/redis/tls/client.crt \\
  --key  /etc/redis/tls/client.key \\
  --cacert /etc/redis/tls/ca.crt \\
  -h redis.internal -p 6379</pre>
            </div>

            <h3>6. Daftar Periksa Sebelum Naik Produksi</h3>
            <table class="tech-table">
                <thead><tr><th>Periksa</th><th>Kenapa</th></tr></thead>
                <tbody>
                    <tr><td><code>bind</code> bukan 0.0.0.0</td><td>Mencegah akses dari luar jaringan internal</td></tr>
                    <tr><td><code>protected-mode yes</code></td><td>Jaring pengaman bila bind terlupa</td></tr>
                    <tr><td>Pengguna <code>default</code> dimatikan</td><td>Menutup akses tanpa identitas</td></tr>
                    <tr><td>Tiap layanan punya pengguna ACL sendiri</td><td>Membatasi dampak kebocoran kredensial</td></tr>
                    <tr><td><code>CONFIG</code> dilarang untuk aplikasi</td><td>Menutup jalur eksploitasi tulis-berkas</td></tr>
                    <tr><td><code>aclfile</code> dikonfigurasi</td><td>ACL tetap ada setelah restart</td></tr>
                    <tr><td>Redis berjalan sebagai pengguna non-root</td><td>Membatasi dampak bila proses dibajak</td></tr>
                    <tr><td>Berkas RDB/AOF berizin 600</td><td>Isi database tidak terbaca pengguna lain di server</td></tr>
                    <tr><td>Firewall hanya mengizinkan IP aplikasi</td><td>Pertahanan berlapis di luar Redis</td></tr>
                </tbody>
            </table>
        `,
        sampleCommands: [
            "ACL WHOAMI",
            "ACL LIST",
            "ACL CAT dangerous",
            "ACL GETUSER default",
            "CONFIG GET protected-mode"
        ],
        quiz: [
            {
                question: "Apa lapisan pertahanan PALING PENTING untuk Redis di produksi?",
                options: [
                    "Mengganti port default dari 6379",
                    "Memastikan Redis tidak pernah mendengarkan alamat publik (bind ke IP internal saja) dan berada di balik firewall",
                    "Mengaktifkan kompresi RDB",
                    "Memakai nama key yang sulit ditebak"
                ],
                answer: 1,
                explanation: "Sebagian besar pembajakan Redis terjadi karena instansinya terjangkau dari internet. Autentikasi dan ACL penting, tetapi tidak boleh terekspos ke publik adalah lapisan yang paling menentukan."
            },
            {
                question: "Apa keunggulan utama ACL dibanding 'requirepass' generasi lama?",
                options: [
                    "ACL memakai enkripsi yang lebih kuat untuk passwordnya",
                    "ACL memungkinkan banyak pengguna dengan izin berbeda per-perintah dan per-pola-key, bukan satu password berkuasa penuh",
                    "ACL membuat Redis berjalan lebih cepat",
                    "ACL menghapus kebutuhan akan firewall"
                ],
                answer: 1,
                explanation: "requirepass hanya mengenal satu kredensial dengan akses penuh ke semua perintah dan semua key. ACL memungkinkan penerapan prinsip hak akses terkecil: tiap layanan punya pengguna sendiri yang hanya boleh menyentuh pola key dan perintah yang benar-benar ia butuhkan."
            },
            {
                question: "Mengapa perintah CONFIG sangat berbahaya bila bisa diakses penyerang?",
                options: [
                    "Karena CONFIG bisa membuat Redis berjalan lambat",
                    "Karena CONFIG SET dir dan dbfilename bisa dipakai menulis berkas RDB ke lokasi sistem seperti authorized_keys sehingga penyerang mendapat akses shell",
                    "Karena CONFIG menampilkan seluruh isi database",
                    "Karena CONFIG menghapus seluruh key"
                ],
                answer: 1,
                explanation: "Dengan mengubah direktori kerja dan nama berkas dump, penyerang dapat memaksa Redis menuliskan konten yang ia kendalikan ke berkas sistem yang sensitif. Inilah teknik pembajakan server Redis yang paling umum, dan alasan CONFIG harus dilarang untuk pengguna aplikasi."
            }
        ]
    }
];

// --- IN-MEMORY REDIS CLI SIMULATOR STATE ---
let redisDbStore = {
    // Stores key-value items in memory
    // key: { type: 'string'|'hash'|'list'|'set'|'zset', value: any, expireAt: timestamp|null }
};

let userCompletedModules = new Set();
let userBookmarks = new Set();
let userNotes = {};
let currentActiveModuleId = 1;
let currentTab = 'theory';

// --- INITIALIZATION ON DOM LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    loadProgressFromStorage();
    renderSidebarList();
    renderModuleContent(currentActiveModuleId);
    setupSearchFilter();
    setupTerminalInput();
});

// --- LOCAL STORAGE MANAGER ---
function loadProgressFromStorage() {
    try {
        const savedCompleted = localStorage.getItem('redis_completed_modules');
        if (savedCompleted) {
            userCompletedModules = new Set(JSON.parse(savedCompleted));
        }

        const savedBookmarks = localStorage.getItem('redis_bookmarks');
        if (savedBookmarks) {
            userBookmarks = new Set(JSON.parse(savedBookmarks));
        }

        const savedNotes = localStorage.getItem('redis_notes');
        if (savedNotes) {
            userNotes = JSON.parse(savedNotes);
        }
    } catch (e) {
        console.error("Failed to load progress from localStorage:", e);
    }
    updateProgressUI();
}

function saveProgressToStorage() {
    try {
        localStorage.setItem('redis_completed_modules', JSON.stringify(Array.from(userCompletedModules)));
        localStorage.setItem('redis_bookmarks', JSON.stringify(Array.from(userBookmarks)));
        localStorage.setItem('redis_notes', JSON.stringify(userNotes));
    } catch (e) {
        console.error("Failed to save progress to localStorage:", e);
    }
    updateProgressUI();
}

function updateProgressUI() {
    const total = REDIS_MODULES.length;
    const completedCount = userCompletedModules.size;
    const percent = Math.round((completedCount / total) * 100);

    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressText) progressText.innerText = `${completedCount} / ${total} Selesai (${percent}%)`;
}

function resetAllProgress() {
    if (confirm("Apakah Anda yakin ingin me-reset seluruh kemajuan belajar dan catatan Redis Anda?")) {
        userCompletedModules.clear();
        userBookmarks.clear();
        userNotes = {};
        saveProgressToStorage();
        renderSidebarList();
        renderModuleContent(currentActiveModuleId);
        showToast("Kemajuan belajar berhasil di-reset!");
    }
}

// --- SIDEBAR RENDERER & FILTER ---
function renderSidebarList(filterCategory = 'ALL', searchQuery = '') {
    const container = document.getElementById('chapterListContainer');
    if (!container) return;

    container.innerHTML = '';

    const filtered = REDIS_MODULES.filter(mod => {
        const matchCat = (filterCategory === 'ALL') || (mod.category === filterCategory);
        const q = searchQuery.toLowerCase().trim();
        const matchSearch = !q || (
            mod.title.toLowerCase().includes(q) ||
            mod.summary.toLowerCase().includes(q) ||
            mod.desc.toLowerCase().includes(q) ||
            mod.sampleCommands.some(c => c.toLowerCase().includes(q))
        );
        return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div style="padding: 16px; color: var(--text-muted); font-size: 0.85rem; text-align: center;">Tidak ada modul yang cocok.</div>`;
        return;
    }

    filtered.forEach(mod => {
        const isCompleted = userCompletedModules.has(mod.id);
        const isBookmarked = userBookmarks.has(mod.id);
        const isActive = mod.id === currentActiveModuleId;

        const card = document.createElement('div');
        card.className = `chapter-card ${isActive ? 'active' : ''}`;
        card.onclick = () => selectModule(mod.id);

        card.innerHTML = `
            <div class="chapter-card-header">
                <span class="chapter-card-num">Modul #${String(mod.id).padStart(2, '0')}</span>
                <span class="badge badge-red" style="font-size: 0.65rem;">${mod.category}</span>
            </div>
            <div class="chapter-card-title">${mod.title}</div>
            <div class="chapter-card-footer">
                <span class="status-indicator">
                    <span class="status-dot ${isCompleted ? 'completed' : ''}"></span>
                    <span>${isCompleted ? 'Selesai' : 'Belum Selesai'}</span>
                </span>
                <span>${isBookmarked ? '⭐ Bookmarked' : ''}</span>
            </div>
        `;

        container.appendChild(card);
    });

    const countSidebar = document.getElementById('chapterCountSidebar');
    if (countSidebar) countSidebar.innerText = `${filtered.length} Modul`;
}

function filterCategory(cat) {
    document.querySelectorAll('.category-pill').forEach(btn => {
        if (btn.innerText.toUpperCase() === cat.toUpperCase() || (cat === 'ALL' && btn.innerText === 'Semua')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const searchQuery = document.getElementById('searchInput')?.value || '';
    renderSidebarList(cat, searchQuery);
}

function setupSearchFilter() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    input.addEventListener('input', (e) => {
        const activePill = document.querySelector('.category-pill.active');
        let cat = 'ALL';
        if (activePill && activePill.innerText !== 'Semua') {
            cat = activePill.innerText;
        }
        renderSidebarList(cat, e.target.value);
    });
}

// --- MODULE CONTENT & NAVIGATION ---
function selectModule(id) {
    currentActiveModuleId = id;
    renderSidebarList();
    renderModuleContent(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderModuleContent(id) {
    const mod = REDIS_MODULES.find(m => m.id === id);
    if (!mod) return;

    // Header Elements
    document.getElementById('chapterTitle').innerText = mod.title;
    document.getElementById('chapterDesc').innerText = mod.desc;
    document.getElementById('chapterCategoryBadge').innerText = mod.category;
    document.getElementById('timestampText').innerText = mod.videoId;

    // Bookmark & Completed Button States
    const isBookmarked = userBookmarks.has(mod.id);
    const isCompleted = userCompletedModules.has(mod.id);

    const bookmarkBtn = document.getElementById('bookmarkBtn');
    if (bookmarkBtn) {
        bookmarkBtn.innerText = isBookmarked ? '⭐ Bookmarked' : '☆ Bookmark';
        bookmarkBtn.style.borderColor = isBookmarked ? 'var(--redis-red)' : 'var(--border-color)';
    }

    const completedBtn = document.getElementById('toggleCompletedBtn');
    if (completedBtn) {
        completedBtn.innerText = isCompleted ? '✅ Selesai' : '☑️ Tandai Selesai';
        completedBtn.className = isCompleted ? 'btn btn-secondary' : 'btn btn-primary';
    }

    // Article Body
    const articleBody = document.getElementById('articleBody');
    if (articleBody) {
        articleBody.innerHTML = `
            <div class="callout callout-tip" style="margin-bottom: 20px;">
                <strong>📌 Ringkasan Eksekutif Modul:</strong><br>
                ${mod.summary}
            </div>
            ${mod.theory}
        `;
    }

    // Video Iframe Setup
    kodelokaVideo(mod.videoId);

    // Sample Command Snippet Buttons in Playground
    renderSnippetLauncher(mod.sampleCommands);

    // Render Quiz
    renderQuiz(mod.quiz);

    // Notes
    const notesTextarea = document.getElementById('notesTextarea');
    if (notesTextarea) {
        notesTextarea.value = userNotes[mod.id] || '';
    }

    // Footer Nav Progress
    const footerProg = document.getElementById('currentFooterProgress');
    if (footerProg) {
        footerProg.innerText = `Modul ${mod.id} dari ${REDIS_MODULES.length}`;
    }

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.disabled = (mod.id === 1);
    if (nextBtn) nextBtn.disabled = (mod.id === REDIS_MODULES.length);
}

function navigatePrev() {
    if (currentActiveModuleId > 1) {
        selectModule(currentActiveModuleId - 1);
    }
}

function navigateNext() {
    if (currentActiveModuleId < REDIS_MODULES.length) {
        selectModule(currentActiveModuleId + 1);
    }
}

function toggleBookmark() {
    if (userBookmarks.has(currentActiveModuleId)) {
        userBookmarks.delete(currentActiveModuleId);
        showToast("Bookmark dihapus");
    } else {
        userBookmarks.add(currentActiveModuleId);
        showToast("Modul ditambahkan ke Bookmark ⭐");
    }
    saveProgressToStorage();
    renderSidebarList();
    renderModuleContent(currentActiveModuleId);
}

function toggleCurrentCompleted() {
    if (userCompletedModules.has(currentActiveModuleId)) {
        userCompletedModules.delete(currentActiveModuleId);
        showToast("Modul ditandai belum selesai");
    } else {
        userCompletedModules.add(currentActiveModuleId);
        showToast("Selamat! Modul ditandai Selesai 🎉");
    }
    saveProgressToStorage();
    renderSidebarList();
    renderModuleContent(currentActiveModuleId);
}

// --- TABS SWITCHING ---
function switchTab(tabName) {
    currentTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    document.querySelectorAll('.tab-panel').forEach(panel => {
        if (panel.id === `tab-${tabName}`) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });
}

// --- INTERACTIVE REDIS CLI SIMULATOR ENGINE ---
function renderSnippetLauncher(commands) {
    const grid = document.getElementById('snippetButtonsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    commands.forEach(cmd => {
        const btn = document.createElement('button');
        btn.className = 'btn-snippet';
        btn.innerText = cmd;
        btn.onclick = () => {
            const input = document.getElementById('terminalInput');
            if (input) {
                input.value = cmd;
                executeTerminalCommand();
            }
        };
        grid.appendChild(btn);
    });
}

function loadSampleCommands() {
    const mod = REDIS_MODULES.find(m => m.id === currentActiveModuleId);
    if (mod) renderSnippetLauncher(mod.sampleCommands);
}

function setupTerminalInput() {
    const input = document.getElementById('terminalInput');
    if (!input) return;

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeTerminalCommand();
        }
    });
}

function executeTerminalCommand() {
    const input = document.getElementById('terminalInput');
    if (!input) return;

    const rawCmd = input.value.trim();
    if (!rawCmd) return;

    appendTerminalLine(`127.0.0.1:6379> ${rawCmd}`, 'term-cmd');
    input.value = '';

    // Process Redis Command Logic
    const reply = processRedisCommand(rawCmd);
    appendTerminalOutputReply(reply);

    // Scroll to bottom
    const body = document.getElementById('terminalOutput');
    if (body) body.scrollTop = body.scrollHeight;
}

function appendTerminalLine(text, className) {
    const body = document.getElementById('terminalOutput');
    if (!body) return;

    const div = document.createElement('div');
    div.className = `term-line ${className || ''}`;
    div.innerText = text;
    body.appendChild(div);
}

function appendTerminalOutputReply(reply) {
    if (Array.isArray(reply)) {
        reply.forEach((item, idx) => {
            appendTerminalLine(`${idx + 1}) ${item}`, 'term-reply-val');
        });
    } else if (typeof reply === 'object' && reply !== null) {
        if (reply.type === 'ok') appendTerminalLine(reply.msg, 'term-reply-ok');
        else if (reply.type === 'err') appendTerminalLine(reply.msg, 'term-reply-err');
        else if (reply.type === 'nil') appendTerminalLine('(nil)', 'term-reply-nil');
        else if (reply.type === 'val') appendTerminalLine(reply.msg, 'term-reply-val');
    } else {
        appendTerminalLine(String(reply), 'term-reply-val');
    }
}

function clearTerminalOutput() {
    const body = document.getElementById('terminalOutput');
    if (body) {
        body.innerHTML = `
            <div class="term-line term-info">Terminal output cleared.</div>
            <div class="term-line term-info">Connected to 127.0.0.1:6379 (DB 0).</div>
        `;
    }
}

function runFlushDB() {
    redisDbStore = {};
    appendTerminalLine("127.0.0.1:6379> FLUSHDB", 'term-cmd');
    appendTerminalLine("OK", 'term-reply-ok');
    showToast("Database Redis berhasil di-flush!");
}

// --- REDIS COMMAND PARSER & EXECUTOR ENGINE ---
function processRedisCommand(cmdStr) {
    // Clean expire items first
    cleanExpiredKeys();

    const tokens = parseCommandLineTokens(cmdStr);
    if (tokens.length === 0) return { type: 'ok', msg: '' };

    const command = tokens[0].toUpperCase();
    const args = tokens.slice(1);

    switch (command) {
        case 'PING':
            return { type: 'ok', msg: args[0] ? `"${args[0]}"` : 'PONG' };

        case 'ECHO':
            return { type: 'val', msg: `"${args.join(' ')}"` };

        case 'SELECT':
            return { type: 'ok', msg: `OK (Selected DB ${args[0] || 0})` };

        case 'DBSIZE':
            return { type: 'val', msg: `(integer) ${Object.keys(redisDbStore).length}` };

        case 'KEYS': {
            const pattern = args[0] || '*';
            const keys = Object.keys(redisDbStore);
            if (keys.length === 0) return { type: 'nil' };

            if (pattern === '*') return keys.map(k => `"${k}"`);
            const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
            const matched = keys.filter(k => regex.test(k)).map(k => `"${k}"`);
            return matched.length ? matched : { type: 'nil' };
        }

        case 'EXISTS': {
            let count = 0;
            args.forEach(k => { if (redisDbStore[k]) count++; });
            return { type: 'val', msg: `(integer) ${count}` };
        }

        case 'TYPE': {
            const key = args[0];
            if (!redisDbStore[key]) return { type: 'val', msg: 'none' };
            return { type: 'val', msg: redisDbStore[key].type };
        }

        case 'DEL': {
            let count = 0;
            args.forEach(k => {
                if (redisDbStore[k]) {
                    delete redisDbStore[k];
                    count++;
                }
            });
            return { type: 'val', msg: `(integer) ${count}` };
        }

        case 'FLUSHDB':
        case 'FLUSHALL':
            redisDbStore = {};
            return { type: 'ok', msg: 'OK' };

        case 'INFO':
            return [
                "# Server",
                "redis_version:7.2.0",
                "redis_mode:standalone",
                "os:Linux 5.15.0 x86_64",
                "arch_bits:64",
                "multiplexing_api:epoll",
                "process_id:6379",
                "tcp_port:6379",
                "uptime_in_seconds:3600",
                "# Memory",
                `used_memory_human:${(Object.keys(redisDbStore).length * 128 + 1024) / 1024}K`,
                "mem_allocator:jemalloc-5.3.0"
            ];

        // --- STRING COMMANDS ---
        case 'SET': {
            if (args.length < 2) return { type: 'err', msg: "ERR wrong number of arguments for 'set' command" };
            const key = args[0];
            const val = args[1];
            let expireSeconds = null;
            let nx = false;

            for (let i = 2; i < args.length; i++) {
                const opt = args[i].toUpperCase();
                if (opt === 'EX' && args[i + 1]) {
                    expireSeconds = parseInt(args[i + 1], 10);
                    i++;
                } else if (opt === 'PX' && args[i + 1]) {
                    expireSeconds = parseInt(args[i + 1], 10) / 1000;
                    i++;
                } else if (opt === 'NX') {
                    nx = true;
                }
            }

            if (nx && redisDbStore[key]) {
                return { type: 'nil' };
            }

            const expireAt = expireSeconds ? (Date.now() + expireSeconds * 1000) : null;
            redisDbStore[key] = { type: 'string', value: val, expireAt };
            return { type: 'ok', msg: 'OK' };
        }

        case 'SETNX': {
            const key = args[0];
            const val = args[1];
            if (redisDbStore[key]) return { type: 'val', msg: '(integer) 0' };
            redisDbStore[key] = { type: 'string', value: val, expireAt: null };
            return { type: 'val', msg: '(integer) 1' };
        }

        case 'GET': {
            const key = args[0];
            if (!redisDbStore[key]) return { type: 'nil' };
            if (redisDbStore[key].type !== 'string') return { type: 'err', msg: "WRONGTYPE Operation against a key holding the wrong kind of value" };
            return { type: 'val', msg: `"${redisDbStore[key].value}"` };
        }

        case 'MSET': {
            for (let i = 0; i < args.length; i += 2) {
                if (args[i] && args[i + 1] !== undefined) {
                    redisDbStore[args[i]] = { type: 'string', value: args[i + 1], expireAt: null };
                }
            }
            return { type: 'ok', msg: 'OK' };
        }

        case 'MGET': {
            return args.map(k => {
                if (!redisDbStore[k] || redisDbStore[k].type !== 'string') return '(nil)';
                return `"${redisDbStore[k].value}"`;
            });
        }

        case 'INCR':
        case 'INCRBY': {
            const key = args[0];
            const amount = (command === 'INCRBY') ? parseInt(args[1] || '1', 10) : 1;
            let current = 0;

            if (redisDbStore[key]) {
                if (redisDbStore[key].type !== 'string') return { type: 'err', msg: "WRONGTYPE Operation against a key holding the wrong kind of value" };
                current = parseInt(redisDbStore[key].value, 10);
                if (isNaN(current)) return { type: 'err', msg: "ERR value is not an integer or out of range" };
            }

            current += amount;
            redisDbStore[key] = { type: 'string', value: String(current), expireAt: redisDbStore[key]?.expireAt || null };
            return { type: 'val', msg: `(integer) ${current}` };
        }

        case 'DECR':
        case 'DECRBY': {
            const key = args[0];
            const amount = (command === 'DECRBY') ? parseInt(args[1] || '1', 10) : 1;
            let current = 0;

            if (redisDbStore[key]) {
                if (redisDbStore[key].type !== 'string') return { type: 'err', msg: "WRONGTYPE Operation against a key holding the wrong kind of value" };
                current = parseInt(redisDbStore[key].value, 10);
                if (isNaN(current)) return { type: 'err', msg: "ERR value is not an integer or out of range" };
            }

            current -= amount;
            redisDbStore[key] = { type: 'string', value: String(current), expireAt: redisDbStore[key]?.expireAt || null };
            return { type: 'val', msg: `(integer) ${current}` };
        }

        // --- TTL & EXPIRE COMMANDS ---
        case 'EXPIRE': {
            const key = args[0];
            const sec = parseInt(args[1], 10);
            if (!redisDbStore[key]) return { type: 'val', msg: '(integer) 0' };
            redisDbStore[key].expireAt = Date.now() + sec * 1000;
            return { type: 'val', msg: '(integer) 1' };
        }

        case 'TTL': {
            const key = args[0];
            if (!redisDbStore[key]) return { type: 'val', msg: '(integer) -2' };
            if (!redisDbStore[key].expireAt) return { type: 'val', msg: '(integer) -1' };
            const diffSec = Math.ceil((redisDbStore[key].expireAt - Date.now()) / 1000);
            return { type: 'val', msg: `(integer) ${diffSec > 0 ? diffSec : -2}` };
        }

        case 'PERSIST': {
            const key = args[0];
            if (!redisDbStore[key] || !redisDbStore[key].expireAt) return { type: 'val', msg: '(integer) 0' };
            redisDbStore[key].expireAt = null;
            return { type: 'val', msg: '(integer) 1' };
        }

        // --- HASH COMMANDS ---
        case 'HSET': {
            const key = args[0];
            if (!redisDbStore[key]) {
                redisDbStore[key] = { type: 'hash', value: {}, expireAt: null };
            }
            if (redisDbStore[key].type !== 'hash') return { type: 'err', msg: "WRONGTYPE Operation against a key holding the wrong kind of value" };

            let addedCount = 0;
            for (let i = 1; i < args.length; i += 2) {
                const f = args[i];
                const v = args[i + 1];
                if (f && v !== undefined) {
                    if (!redisDbStore[key].value[f]) addedCount++;
                    redisDbStore[key].value[f] = v;
                }
            }
            return { type: 'val', msg: `(integer) ${addedCount}` };
        }

        case 'HGET': {
            const key = args[0];
            const field = args[1];
            if (!redisDbStore[key] || redisDbStore[key].type !== 'hash' || !redisDbStore[key].value[field]) {
                return { type: 'nil' };
            }
            return { type: 'val', msg: `"${redisDbStore[key].value[field]}"` };
        }

        case 'HGETALL': {
            const key = args[0];
            if (!redisDbStore[key] || redisDbStore[key].type !== 'hash') return { type: 'nil' };
            const map = redisDbStore[key].value;
            const res = [];
            Object.keys(map).forEach(f => {
                res.push(`"${f}"`);
                res.push(`"${map[f]}"`);
            });
            return res.length ? res : { type: 'nil' };
        }

        case 'HKEYS': {
            const key = args[0];
            if (!redisDbStore[key] || redisDbStore[key].type !== 'hash') return { type: 'nil' };
            return Object.keys(redisDbStore[key].value).map(f => `"${f}"`);
        }

        case 'HINCRBY': {
            const key = args[0];
            const field = args[1];
            const amount = parseInt(args[2] || '1', 10);

            if (!redisDbStore[key]) redisDbStore[key] = { type: 'hash', value: {}, expireAt: null };
            if (redisDbStore[key].type !== 'hash') return { type: 'err', msg: "WRONGTYPE Operation against a key" };

            let current = parseInt(redisDbStore[key].value[field] || '0', 10);
            current += amount;
            redisDbStore[key].value[field] = String(current);
            return { type: 'val', msg: `(integer) ${current}` };
        }

        // --- LIST COMMANDS ---
        case 'LPUSH':
        case 'RPUSH': {
            const key = args[0];
            if (!redisDbStore[key]) redisDbStore[key] = { type: 'list', value: [], expireAt: null };
            if (redisDbStore[key].type !== 'list') return { type: 'err', msg: "WRONGTYPE Operation against a key" };

            const items = args.slice(1);
            if (command === 'LPUSH') {
                items.forEach(item => redisDbStore[key].value.unshift(item));
            } else {
                items.forEach(item => redisDbStore[key].value.push(item));
            }
            return { type: 'val', msg: `(integer) ${redisDbStore[key].value.length}` };
        }

        case 'LPOP':
        case 'RPOP': {
            const key = args[0];
            if (!redisDbStore[key] || redisDbStore[key].type !== 'list' || redisDbStore[key].value.length === 0) {
                return { type: 'nil' };
            }
            const popped = (command === 'LPOP') ? redisDbStore[key].value.shift() : redisDbStore[key].value.pop();
            return { type: 'val', msg: `"${popped}"` };
        }

        case 'LRANGE': {
            const key = args[0];
            let start = parseInt(args[1] || '0', 10);
            let stop = parseInt(args[2] || '-1', 10);

            if (!redisDbStore[key] || redisDbStore[key].type !== 'list') return { type: 'nil' };

            const arr = redisDbStore[key].value;
            if (start < 0) start = arr.length + start;
            if (stop < 0) stop = arr.length + stop;

            const sliced = arr.slice(start, stop + 1);
            return sliced.length ? sliced.map(item => `"${item}"`) : { type: 'nil' };
        }

        case 'LLEN': {
            const key = args[0];
            if (!redisDbStore[key] || redisDbStore[key].type !== 'list') return { type: 'val', msg: '(integer) 0' };
            return { type: 'val', msg: `(integer) ${redisDbStore[key].value.length}` };
        }

        // --- SET COMMANDS ---
        case 'SADD': {
            const key = args[0];
            if (!redisDbStore[key]) redisDbStore[key] = { type: 'set', value: new Set(), expireAt: null };
            if (redisDbStore[key].type !== 'set') return { type: 'err', msg: "WRONGTYPE Operation against a key" };

            let added = 0;
            args.slice(1).forEach(item => {
                if (!redisDbStore[key].value.has(item)) {
                    redisDbStore[key].value.add(item);
                    added++;
                }
            });
            return { type: 'val', msg: `(integer) ${added}` };
        }

        case 'SMEMBERS': {
            const key = args[0];
            if (!redisDbStore[key] || redisDbStore[key].type !== 'set') return { type: 'nil' };
            return Array.from(redisDbStore[key].value).map(i => `"${i}"`);
        }

        case 'SINTER': {
            const keys = args;
            if (keys.length === 0) return { type: 'nil' };
            let setUnion = null;

            for (const k of keys) {
                if (!redisDbStore[k] || redisDbStore[k].type !== 'set') return { type: 'nil' };
                const currentSet = redisDbStore[k].value;
                if (setUnion === null) {
                    setUnion = new Set(currentSet);
                } else {
                    setUnion = new Set(Array.from(setUnion).filter(x => currentSet.has(x)));
                }
            }
            return setUnion ? Array.from(setUnion).map(i => `"${i}"`) : { type: 'nil' };
        }

        case 'SUNION': {
            const unionSet = new Set();
            args.forEach(k => {
                if (redisDbStore[k] && redisDbStore[k].type === 'set') {
                    redisDbStore[k].value.forEach(v => unionSet.add(v));
                }
            });
            return unionSet.size ? Array.from(unionSet).map(i => `"${i}"`) : { type: 'nil' };
        }

        case 'SDIFF': {
            if (!args[0] || !redisDbStore[args[0]] || redisDbStore[args[0]].type !== 'set') return { type: 'nil' };
            const baseSet = new Set(redisDbStore[args[0]].value);

            args.slice(1).forEach(k => {
                if (redisDbStore[k] && redisDbStore[k].type === 'set') {
                    redisDbStore[k].value.forEach(v => baseSet.delete(v));
                }
            });
            return baseSet.size ? Array.from(baseSet).map(i => `"${i}"`) : { type: 'nil' };
        }

        // --- SORTED SET (ZSET) COMMANDS ---
        case 'ZADD': {
            const key = args[0];
            if (!redisDbStore[key]) redisDbStore[key] = { type: 'zset', value: [], expireAt: null };
            if (redisDbStore[key].type !== 'zset') return { type: 'err', msg: "WRONGTYPE Operation against a key" };

            let added = 0;
            for (let i = 1; i < args.length; i += 2) {
                const score = parseFloat(args[i]);
                const member = args[i + 1];
                if (!isNaN(score) && member) {
                    const existingIdx = redisDbStore[key].value.findIndex(item => item.member === member);
                    if (existingIdx >= 0) {
                        redisDbStore[key].value[existingIdx].score = score;
                    } else {
                        redisDbStore[key].value.push({ member, score });
                        added++;
                    }
                }
            }
            // Sort ascending by score
            redisDbStore[key].value.sort((a, b) => a.score - b.score);
            return { type: 'val', msg: `(integer) ${added}` };
        }

        case 'ZRANGE':
        case 'ZREVRANGE': {
            const key = args[0];
            let start = parseInt(args[1] || '0', 10);
            let stop = parseInt(args[2] || '-1', 10);
            const withScores = (args[3] || '').toUpperCase() === 'WITHSCORES';

            if (!redisDbStore[key] || redisDbStore[key].type !== 'zset') return { type: 'nil' };

            let arr = [...redisDbStore[key].value];
            if (command === 'ZREVRANGE') arr.reverse();

            if (start < 0) start = arr.length + start;
            if (stop < 0) stop = arr.length + stop;

            const sliced = arr.slice(start, stop + 1);
            if (sliced.length === 0) return { type: 'nil' };

            const res = [];
            sliced.forEach((item, i) => {
                res.push(`"${item.member}"`);
                if (withScores) res.push(`"${item.score}"`);
            });
            return res;
        }

        case 'ZINCRBY': {
            const key = args[0];
            const amount = parseFloat(args[1]);
            const member = args[2];

            if (!redisDbStore[key]) redisDbStore[key] = { type: 'zset', value: [], expireAt: null };
            if (redisDbStore[key].type !== 'zset') return { type: 'err', msg: "WRONGTYPE Operation against a key" };

            let item = redisDbStore[key].value.find(i => i.member === member);
            if (item) {
                item.score += amount;
            } else {
                item = { member, score: amount };
                redisDbStore[key].value.push(item);
            }
            redisDbStore[key].value.sort((a, b) => a.score - b.score);
            return { type: 'val', msg: `"${item.score}"` };
        }

        case 'ZSCORE': {
            const key = args[0];
            const member = args[1];
            if (!redisDbStore[key] || redisDbStore[key].type !== 'zset') return { type: 'nil' };
            const item = redisDbStore[key].value.find(i => i.member === member);
            return item ? { type: 'val', msg: `"${item.score}"` } : { type: 'nil' };
        }

        case 'ZREVRANK':
        case 'ZRANK': {
            const key = args[0];
            const member = args[1];
            if (!redisDbStore[key] || redisDbStore[key].type !== 'zset') return { type: 'nil' };

            let arr = [...redisDbStore[key].value];
            if (command === 'ZREVRANK') arr.reverse();

            const idx = arr.findIndex(i => i.member === member);
            return idx >= 0 ? { type: 'val', msg: `(integer) ${idx}` } : { type: 'nil' };
        }

        // --- ADVANCED & TRANSACTIONS ---
        case 'MULTI':
            return { type: 'ok', msg: 'OK (Transaction Started)' };
        case 'EXEC':
            return { type: 'ok', msg: 'OK (Transaction Committed)' };
        case 'DISCARD':
            return { type: 'ok', msg: 'OK (Transaction Aborted)' };

        case 'PUBLISH': {
            const channel = args[0];
            const msg = args.slice(1).join(' ');
            return { type: 'val', msg: `(integer) 1 (Message "${msg}" published to channel '${channel}')` };
        }

        case 'HELP':
            return [
                "Perintah Redis Simulator yang didukung:",
                "STRING: SET, GET, SETNX, MSET, MGET, INCR, DECR, INCRBY, DECRBY",
                "EXPIRATION: EXPIRE, TTL, PERSIST",
                "HASH: HSET, HGET, HGETALL, HKEYS, HINCRBY",
                "LIST: LPUSH, RPUSH, LPOP, RPOP, LRANGE, LLEN",
                "SET: SADD, SMEMBERS, SINTER, SUNION, SDIFF",
                "ZSET: ZADD, ZRANGE, ZREVRANGE, ZINCRBY, ZSCORE, ZRANK, ZREVRANK",
                "UTIL: PING, ECHO, KEYS, EXISTS, TYPE, DEL, DBSIZE, INFO, FLUSHDB"
            ];

        default:
            return { type: 'err', msg: `ERR unknown command '${command}', with args beginning with: ${args.map(a=>`'${a}'`).join(' ')}` };
    }
}

function cleanExpiredKeys() {
    const now = Date.now();
    Object.keys(redisDbStore).forEach(k => {
        if (redisDbStore[k].expireAt && redisDbStore[k].expireAt <= now) {
            delete redisDbStore[k];
        }
    });
}

function parseCommandLineTokens(input) {
    const regex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|([^\s]+)/g;
    const tokens = [];
    let match;
    while ((match = regex.exec(input)) !== null) {
        tokens.push(match[1] || match[2] || match[3]);
    }
    return tokens;
}

// --- QUIZ & TESTING RENDERER ---
function renderQuiz(quizArray) {
    const container = document.getElementById('quizContainer');
    if (!container) return;
    container.innerHTML = '';

    if (!quizArray || quizArray.length === 0) {
        container.innerHTML = `<div style="color: var(--text-muted);">Tidak ada quiz untuk modul ini.</div>`;
        return;
    }

    quizArray.forEach((q, qIdx) => {
        const card = document.createElement('div');
        card.className = 'quiz-card';

        const optionsHtml = q.options.map((opt, optIdx) => `
            <label class="quiz-option-label">
                <input type="radio" name="quiz_${currentActiveModuleId}_${qIdx}" value="${optIdx}" onchange="checkAnswer(${qIdx}, ${optIdx}, ${q.answer})">
                <span>${opt}</span>
            </label>
        `).join('');

        card.innerHTML = `
            <div class="quiz-question">Soal ${qIdx + 1}: ${q.question}</div>
            <div class="quiz-options">${optionsHtml}</div>
            <div class="quiz-feedback" id="quizFeedback_${qIdx}"></div>
        `;

        container.appendChild(card);
    });
}

function checkAnswer(qIdx, selectedIdx, correctIdx) {
    const fb = document.getElementById(`quizFeedback_${qIdx}`);
    if (!fb) return;

    const mod = REDIS_MODULES.find(m => m.id === currentActiveModuleId);
    const explanation = mod?.quiz[qIdx]?.explanation || '';

    if (selectedIdx === correctIdx) {
        fb.className = 'quiz-feedback correct';
        fb.innerHTML = `<strong>✅ Jawaban Anda Benar!</strong><br>${explanation}`;
    } else {
        fb.className = 'quiz-feedback incorrect';
        fb.innerHTML = `<strong>❌ Jawaban Kurang Tepat.</strong> Coba tinjau kembali materi di tab Teori.<br>${explanation}`;
    }
}

// --- NOTES SAVER ---
function saveUserNote() {
    const textarea = document.getElementById('notesTextarea');
    if (!textarea) return;

    userNotes[currentActiveModuleId] = textarea.value;
    saveProgressToStorage();

    const status = document.getElementById('saveNotesStatus');
    if (status) {
        status.style.display = 'inline';
        setTimeout(() => { status.style.display = 'none'; }, 2500);
    }
    showToast("Catatan pribadi tersimpan!");
}

// --- FINAL CERTIFICATION EXAM MODAL ---
function openFinalExam() {
    const modal = document.getElementById('examModal');
    const body = document.getElementById('examModalBody');
    if (!modal || !body) return;

    // Collect all quiz questions across all 13 modules
    let allQuestions = [];
    REDIS_MODULES.forEach(m => {
        if (m.quiz) {
            m.quiz.forEach(q => allQuestions.push({ ...q, moduleTitle: m.title }));
        }
    });

    const questionsHtml = allQuestions.map((q, idx) => `
        <div class="quiz-card" style="margin-bottom: 16px;">
            <div style="font-size: 0.75rem; color: var(--redis-red); font-weight: 700;">${q.moduleTitle}</div>
            <div class="quiz-question" style="font-size: 0.95rem; margin-top: 4px;">Q${idx + 1}. ${q.question}</div>
            <div class="quiz-options" style="margin-top: 8px;">
                ${q.options.map((opt, optIdx) => `
                    <label class="quiz-option-label">
                        <input type="radio" name="exam_q_${idx}" value="${optIdx}">
                        <span>${opt}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `).join('');

    body.innerHTML = `
        <div style="text-align: center; margin-bottom: 24px;">
            <span class="badge badge-amber" style="font-size: 0.85rem; padding: 6px 14px;">🏆 Sertifikasi Redis Developer</span>
            <h2 style="font-size: 1.5rem; font-weight: 800; margin-top: 10px;">Ujian Akhir Kelayakan Redis Database</h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 6px;">
                Jawablah 10+ pertanyaan ujian komprehensif dari seluruh 21 modul untuk menguji pemahaman Anda.
            </p>
        </div>
        <form id="examForm">
            ${questionsHtml}
            <button type="button" class="btn btn-primary" onclick="submitFinalExam(${allQuestions.length})" style="width: 100%; padding: 12px; margin-top: 16px; font-size: 1rem;">
                Submit &amp; Hitung Nilai Ujian
            </button>
        </form>
        <div id="examResultBox" style="margin-top: 20px; display: none;"></div>
    `;

    modal.classList.add('active');
}

function closeFinalExam() {
    const modal = document.getElementById('examModal');
    if (modal) modal.classList.remove('active');
}

function submitFinalExam(totalQuestions) {
    let score = 0;
    let questionIndex = 0;

    REDIS_MODULES.forEach(m => {
        if (m.quiz) {
            m.quiz.forEach(q => {
                const selected = document.querySelector(`input[name="exam_q_${questionIndex}"]:checked`);
                if (selected && parseInt(selected.value, 10) === q.answer) {
                    score++;
                }
                questionIndex++;
            });
        }
    });

    const percentage = Math.round((score / totalQuestions) * 100);
    const resultBox = document.getElementById('examResultBox');
    if (!resultBox) return;

    resultBox.style.display = 'block';

    if (percentage >= 70) {
        resultBox.innerHTML = `
            <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid var(--accent-emerald); border-radius: var(--radius-md); padding: 24px; text-align: center;">
                <h3 style="color: #6ee7b7; font-size: 1.3rem;">🎉 SELAMAT! Anda LULUS Ujian Sertifikasi Redis!</h3>
                <p style="font-size: 1.1rem; font-weight: 700; margin: 10px 0;">Skor Anda: ${score} / ${totalQuestions} (${percentage}%)</p>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">
                    Anda telah menguasai konsep Redis Data Structures, Expiration, Hash, List, Set, ZSet, Pub/Sub, Transaction, Pipeline, dan Security.
                </p>
            </div>
        `;
    } else {
        resultBox.innerHTML = `
            <div style="background: rgba(244, 63, 94, 0.15); border: 1px solid var(--error-color); border-radius: var(--radius-md); padding: 24px; text-align: center;">
                <h3 style="color: #fca5a5; font-size: 1.3rem;">⚠️ Belum Lulus (Skor Minimal 70%)</h3>
                <p style="font-size: 1.1rem; font-weight: 700; margin: 10px 0;">Skor Anda: ${score} / ${totalQuestions} (${percentage}%)</p>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">
                    Silakan pelajari kembali modul yang belum Anda kuasai lalu coba lagi.
                </p>
            </div>
        `;
    }
}

// --- UTILITY TOAST & COPY TO CLIPBOARD ---
function copyCode(btn) {
    const container = btn.closest('.code-container');
    if (!container) return;
    const code = container.querySelector('code');
    if (!code) return;

    navigator.clipboard.writeText(code.innerText).then(() => {
        const originalText = btn.innerText;
        btn.innerText = 'Copied! ✓';
        btn.style.color = 'var(--accent-emerald)';
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.color = 'var(--text-secondary)';
        }, 2000);
    });
}

function showToast(message) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
