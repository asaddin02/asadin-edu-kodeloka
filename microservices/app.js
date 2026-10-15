/* ==========================================================================
   MICROSERVICES ARCHITECTURE MASTERY - INTERACTIVE APPLICATION ENGINE
   Author: Antigravity Team
   Language: Bahasa Indonesia
   ========================================================================== */

const MODULES_DATA = [
    {
        id: 1,
        title: "01. Belajar Microservices - Intro",
        category: "Konsep Dasar",
        videoId: "PhCrso3J11k",
        duration: "14:26",
        desc: "Pengenalan arsitektur Microservices, sejarah evolusi dari Monolith, alasan adopsi microservices di perusahaan tech, dan tantangan umum yang dihadapi.",
        summary: "Microservices adalah pendekatan arsitektur di mana satu aplikasi besar dipecah menjadi kumpulan layanan-layanan kecil yang berjalan secara terpisah dan berkomunikasi melalui protokol ringan (seperti HTTP REST atau gRPC).",
        theory: `
            <h3>1. Apa itu Arsitektur Microservices?</h3>
            <p><strong>Microservices Architecture</strong> adalah gaya arsitektur sistem di mana aplikasi terdiri dari kumpulan layanan (services) yang berukuran kecil, terisolasi, dapat di-deploy secara independen, dan memiliki batas konteks (bounded context) yang jelas.</p>

            <div class="callout callout-info">
                <strong>💡 Karakteristik Utama Microservices:</strong>
                <ul>
                    <li><strong>Autonomous & Independent:</strong> Setiap service dapat di-build, di-test, dan di-deploy tanpa mengganggu service lainnya.</li>
                    <li><strong>Single Responsibility:</strong> Setiap service hanya menangani satu domain bisnis spesifik (misal: Order Service, Payment Service, Notification Service).</li>
                    <li><strong>Polyglot Technology:</strong> Bebas memilih bahasa pemrograman, framework, dan jenis database yang paling sesuai untuk tiap service.</li>
                    <li><strong>Decoupled Data:</strong> Setiap service mengelola database miliknya sendiri tanpa mengizinkan akses tabel langsung dari service lain.</li>
                </ul>
            </div>

            <h3>2. Mengapa Perusahaan Mengadopsi Microservices?</h3>
            <ul>
                <li><strong>Organisasional (Conway's Law):</strong> Struktur aplikasi mencerminkan struktur tim. Tim kecil (2-Pizza Team) dapat bekerja secara independen pada service masing-masing.</li>
                <li><strong>Scalability Efisien:</strong> Hanya me-scale bagian service yang mengalami lonjakan trafik (misal: me-scale Payment Service saat Harbolnas, tanpa me-scale Notification Service).</li>
                <li><strong>Resilience (Isolasi Kegagalan):</strong> Jika satu service mengalami crash (misal Recommendation Service error), aplikasi utama (katalog & checkout) tetap dapat beroperasi normal.</li>
            </ul>

            <h3>3. Tantangan Nyata Microservices</h3>
            <p>Meskipun memiliki banyak keunggulan, Microservices membawa kompleksitas terdistribusi:</p>
            <ul>
                <li>Latensi jaringan saat inter-service communication (Network Latency).</li>
                <li>Konsistensi data terdistribusi (Distributed Transactions & Eventual Consistency).</li>
                <li>Kompleksitas Observability (Distributed Tracing, Centralized Logging).</li>
            </ul>
        `,
        sampleCommands: [
            "microservices status",
            "curl -i http://gateway:8080/health",
            "docker ps --format 'table {{.Names}}\\t{{.Status}}'"
        ],
        quiz: [
            {
                question: "Apakah prinsip utama dari arsitektur Microservices dalam hal pengelolaan deployment?",
                options: [
                    "Seluruh service harus di-deploy bersamaan dalam 1 file WAR/JAR",
                    "Setiap service dapat di-build, di-test, dan di-deploy secara independen tanpa bergantung service lain",
                    "Semua service harus menggunakan bahasa Java",
                    "Deployment hanya bisa dilakukan setahun sekali"
                ],
                answer: 1,
                explanation: "Kemampuan deployment independen adalah ciri utama arsitektur microservices."
            },
            {
                question: "Hukum (Law) manakah yang menyatakan bahwa struktur arsitektur sistem informasi akan cenderung meniru struktur komunikasi organisasi timnya?",
                options: ["Moore's Law", "Conway's Law", "Murphy's Law", "Amdahl's Law"],
                answer: 1,
                explanation: "Conway's Law menyatakan bahwa desain sistem dibentuk oleh struktur komunikasi tim."
            }
        ]
    },
    {
        id: 2,
        title: "02. Belajar Microservices - Arsitektur Monolith",
        category: "Arsitektur",
        videoId: "CHBfpPMILaQ",
        duration: "18:51",
        desc: "Kelebihan dan kekurangan Arsitektur Monolith, masalah scaling, blast radius kegagalan, bottleneck kompilasi, serta skenario saat Monolith masih pilihan terbaik.",
        summary: "Arsitektur Monolith menggabungkan seluruh komponen aplikasi dalam satu basis kode dan satu proses eksekusi tunggal. Sangat baik untuk tahap awal MVP, namun menantang saat aplikasi berkembang pesat.",
        theory: `
            <h3>1. Memahami Arsitektur Monolith</h3>
            <p>Pada aplikasi <strong>Monolith</strong>, seluruh fungsionalitas bisnis (User Authentication, Catalog Management, Payment, Cart, Shipping) dibangun di dalam satu basis kode (codebase), dikompilasi bersama, dan berjalan sebagai satu unit proses tunggal di server.</p>

            <h3>2. Keuntungan Arsitektur Monolith</h3>
            <ul>
                <li><strong>Kemudahan Pengembangan Awal:</strong> Tidak ada overhead latensi jaringan antar fungsi, panggilan fungsi menggunakan Memory Call instan.</li>
                <li><strong>Kemudahan Testing & Debugging:</strong> Sangat mudah menjalankan pengujian E2E (End-to-End) dan memasang debugger di 1 aplikasi lokal.</li>
                <li><strong>Transaksi ACID Sederhana:</strong> Menggunakan transaksi basis data lokal RDBMS (<code>BEGIN TRANSACTION ... COMMIT</code>) tanpa perlu protokol terdistribusi.</li>
            </ul>

            <h3>3. Masalah Utama (Pain Points) Monolith saat Mengubah Skala</h3>
            <div class="callout callout-warning">
                <strong>⚠️ Masalah Monolith pada Skala Besar:</strong>
                <ul>
                    <li><strong>Single Point of Failure (Large Blast Radius):</strong> Kebocoran memori (Memory Leak) di modul laporan PDF dapat menghentikan seluruh server dan mematikan fungsi transaksi pembayaran.</li>
                    <li><strong>Tight Coupling:</strong> Perubahan kode di modul User berisiko merusak modul Cart secara tidak sengaja.</li>
                    <li><strong>Scalability Inefficient:</strong> Harus menggandakan seluruh instance aplikasi raksasa meskipun hanya 1 fitur yang membutuhkan kapasitas CPU tinggi.</li>
                    <li><strong>Build Time Lambat:</strong> Proses kompilasi dan CI pipeline membutuhkan waktu berjam-jam untuk 1 baris perubahan kode.</li>
                </ul>
            </div>
        `,
        sampleCommands: [
            "ps aux | grep monolith-app",
            "mvn clean package -DskipTests",
            "top -p 1204"
        ],
        quiz: [
            {
                question: "Skenario manakah di mana Arsitektur Monolith justru LEBIH direkomendasikan dibanding Microservices?",
                options: [
                    "Tahap awal startup (MVP) dengan tim kecil dan domain bisnis yang masih sering berubah cepat",
                    "Aplikasi skala raksasa dengan 500 orang developer",
                    "Aplikasi yang memerlukan polyglot database",
                    "Sistem yang membutuhkan 100 rilis sehari"
                ],
                answer: 0,
                explanation: "Monolith sangat ideal untuk MVP awal karena minim overhead jaringan dan infrastruktur."
            },
            {
                question: "Apakah yang dimaksud dengan istilah 'Blast Radius' pada kegagalan aplikasi Monolith?",
                options: [
                    "Kecepatan jaringan server",
                    "Dampak kerusakan dari satu bug/error di modul lokal yang bisa menjatuhkan seluruh sistem secara keseluruhan",
                    "Ukuran biner file JAR",
                    "Proses kompilasi memori"
                ],
                answer: 1,
                explanation: "Blast radius pada Monolith sangat besar karena satu titik kegagalan berdampak ke seluruh aplikasi."
            }
        ]
    },
    {
        id: 3,
        title: "03. Belajar Microservices - Arsitektur Microservices",
        category: "Arsitektur",
        videoId: "W96gPBQ0blE",
        duration: "06:34",
        desc: "Konsep Decomposing aplikasi menjadi layanan-layanan independen, prinsip High Cohesion & Loose Coupling, Bounded Context (Domain-Driven Design), dan siklus rilis mandiri.",
        summary: "Arsitektur Microservices memecah sistem berdasarkan domain bisnis (Bounded Context) menggunakan prinsip High Cohesion & Loose Coupling.",
        theory: `
            <h3>1. Prinsip Utama Pemecahan Service</h3>
            <p>Kunci sukses arsitektur Microservices terletak pada penerapan <strong>Domain-Driven Design (DDD)</strong> untuk menentukan batas-batas wilayah tanggung jawab setiap service (<em>Bounded Context</em>).</p>

            <ul>
                <li><strong>High Cohesion:</strong> Seluruh fungsi dan data yang berkaitan erat dikelompokkan bersama di dalam 1 service yang sama.</li>
                <li><strong>Loose Coupling:</strong> Setiap service tidak bergantung pada implementasi internal service lain. Perubahan di Service A tidak boleh mewajibkan perubahan kode di Service B.</li>
            </ul>

            <h3>2. Perbandingan Monolith vs Microservices Architecture</h3>
            <div class="code-container">
                <div class="code-header"><span>Struktur Perbandingan Arsitektur</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>[ MONOLITH ARCHITECTURE ]
Client ---> [ API Gateway / Load Balancer ]
                   │
                   ▼
     ┌──────────────────────────────┐
     │  Monolith Application        │
     │  ├── Auth Module             │
     │  ├── Order Module            │
     │  ├── Inventory Module        │
     │  └── Payment Module          │
     └──────────────┬───────────────┘
                    │
                    ▼
           ┌────────────────┐
           │ Shared RDBMS   │
           └────────────────┘

----------------------------------------------------

[ MICROSERVICES ARCHITECTURE ]
Client ---> [ API Gateway Router ]
             ├──> [ Auth Service ] ──────> ( Auth DB )
             ├──> [ Order Service ] ─────> ( Order DB )
             ├──> [ Inventory Service ] ─> ( Inventory DB )
             └──> [ Payment Service ] ───> ( Payment DB )</code></pre>
            </div>
        `,
        sampleCommands: [
            "microservices list",
            "curl -X GET http://localhost:8080/services",
            "git branch -a"
        ],
        quiz: [
            {
                question: "Prinsip desain apakah yang mewajibkan bahwa perubahan internal pada satu service TIDAK BOLEH merusak atau memaksa perubahan kode pada service lain?",
                options: ["High Cohesion", "Loose Coupling", "Tight Coupling", "Monolithic Binding"],
                answer: 1,
                explanation: "Loose Coupling menjamin independensi antar service sehingga perubahan satu service tidak memutus service lain."
            },
            {
                question: "Pendekatan metodologi apakah yang sangat efektif digunakan untuk menentukan batas wilayah (Bounded Context) pembuatan Microservices?",
                options: ["Waterfall Model", "Domain-Driven Design (DDD)", "Test Driven Development", "Scrum Sprint"],
                answer: 1,
                explanation: "Domain-Driven Design (DDD) membantu memetakan Bounded Context untuk pembagian microservices."
            }
        ]
    },
    {
        id: 4,
        title: "04. Belajar Microservices - Type of Microservices",
        category: "Arsitektur",
        videoId: "SFkPLgpFiT4",
        duration: "10:01",
        desc: "Klasifikasi tipe microservices: Stateless Services, Stateful Services, Data Services, Edge Services, dan Worker/Consumer Services.",
        summary: "Memahami taksonomi peran Microservices dalam ekosistem sistem terdistribusi untuk menentukan strategi scaling dan infrastruktur yang tepat.",
        theory: `
            <h3>1. Klasifikasi Tipe Microservices</h3>
            <ul>
                <li><strong>Stateless Microservices:</strong> Service yang tidak menyimpan status/state lokal di dalam aplikasinya. Setiap request dapat diproses oleh instance manakah saja. <em>Sangat mudah di-scale horizontal (Auto-scaling)!</em> (Contoh: Order API, Product API).</li>
                <li><strong>Stateful Microservices:</strong> Service yang menyimpan data/state lokal di dalam memori atau disk lokal instance. (Contoh: Database Cluster, Redis Cache Instance, Session Store).</li>
                <li><strong>Worker / Background Consumer Services:</strong> Service yang tidak menerima HTTP request langsung dari user. Bertugas mendengarkan antrean Message Broker dan memproses tugas berat di latar belakang. (Contoh: Email Notification Worker, Video Transcoder Worker).</li>
                <li><strong>Edge / Gateway Services:</strong> Service yang berada di paling depan infrastruktur. Menangani routing, SSL termination, rate limiting, dan autentikasi. (Contoh: Kong API Gateway, Nginx Ingress Controller).</li>
            </ul>
        `,
        sampleCommands: [
            "kubectl get pods -l type=stateless",
            "kubectl scale deployment order-service --replicas=10"
        ],
        quiz: [
            {
                question: "Mengapa Stateless Microservices sangat mudah di-scale horizontal (diperbanyak instance-nya) secara otomatis?",
                options: [
                    "Karena tidak menyimpan status data lokal sehingga setiap request bebas diarahkan ke instance mana saja",
                    "Karena ukurannya kecil",
                    "Karena ditulis dalam bahasa C",
                    "Karena tidak menggunakan CPU"
                ],
                answer: 0,
                explanation: "Stateless service tidak memiliki ketergantungan memori lokal sehingga instance bebas ditambah/dikurangi."
            },
            {
                question: "Tipe Microservices manakah yang bertugas memproses tugas berat seperti pengiriman email atau pengolahan gambar dari antrean Message Broker?",
                options: ["Edge Gateway", "Worker / Consumer Service", "Stateful DB Service", "Static Frontend"],
                answer: 1,
                explanation: "Worker Service mengeksekusi tugas asinkron dari message queue di latar belakang."
            }
        ]
    },
    {
        id: 5,
        title: "05. Belajar Microservices - Database per Service",
        category: "Data Pattern",
        videoId: "W4G-cr5m5Do",
        duration: "08:17",
        desc: "Pola Database per Service di mana setiap microservice memiliki DB tersendiri (Polyglot Persistence). Mencegah tight coupling di tingkat tabel RDBMS.",
        summary: "Pola Database per Service memastikan enkapsulasi data penuh. Setiap microservice mengelola basis datanya secara privat dan hanya dapat diakses melalui API resmi.",
        theory: `
            <h3>1. Konsep Database per Service</h3>
            <p>Dalam pola <strong>Database per Service</strong>, setiap microservice memiliki basis data privat tersendiri. Tidak ada service eksternal yang diizinkan mengakses atau melakukan SQL query langsung ke tabel database service lain!</p>

            <div class="callout callout-tip">
                <strong>💡 Enkapsulasi Data Penuh:</strong><br>
                Jika <code>Order Service</code> membutuhkan informasi nama pelanggan dari <code>User Service</code>, Order Service <strong>Wajib memanggil API HTTP/gRPC resmi User Service</strong> (atau mendengarkan Event domain), bukan melakukan SQL JOIN <code>SELECT * FROM users JOIN orders</code>!
            </div>

            <h3>2. Keuntungan Database per Service</h3>
            <ul>
                <li><strong>Kemudahan Perubahan Skema:</strong> Developer bebas mengubah struktur tabel internal <code>orders</code> tanpa perlu khawatir merusak aplikasi lain.</li>
                <li><strong>Polyglot Persistence:</strong> Bebas menggunakan jenis DB terbaik untuk tiap domain:
                    <ul>
                        <li><code>User Service</code> -> PostgreSQL (Relasional).</li>
                        <li><code>Catalog Service</code> -> MongoDB / Elasticsearch (Dokumen & Search).</li>
                        <li><code>Session & Leaderboard Service</code> -> Redis (In-Memory).</li>
                    </ul>
                </li>
                <li><strong>Isolasi Beban I/O:</strong> Query berat di satu database tidak akan membuat crash database service lainnya.</li>
            </ul>
        `,
        sampleCommands: [
            "docker ps | grep -E 'postgres|mongo|redis'",
            "psql -h localhost -U order_user -d order_db",
            "mongo mongodb://localhost:27017/catalog_db"
        ],
        quiz: [
            {
                question: "Bagaimanakah cara Order Service mendapatkan data nama pelanggan dari User Service pada pola Database per Service?",
                options: [
                    "Melakukan SQL JOIN langsung ke database milik User Service",
                    "Memanggil API resmi (HTTP/gRPC/Event) yang disediakan oleh User Service",
                    "Membaca file log disk User Service secara langsung",
                    "Membagi 1 tabel yang sama di database pusat"
                ],
                answer: 1,
                explanation: "Akses data antar service wajib melalui API resmi atau event, tidak boleh akses DB langsung."
            },
            {
                question: "Istilah apakah yang menggambarkan penggunaan berbagai jenis teknologi database yang berbeda (Postgres, Mongo, Redis) sesuai kebutuhan service?",
                options: ["Single Schema Persistence", "Polyglot Persistence", "Multi-Tenant Isolation", "Distributed Lock"],
                answer: 1,
                explanation: "Polyglot Persistence adalah praktik menggunakan beberapa teknologi database yang paling cocok."
            }
        ]
    },
    {
        id: 6,
        title: "06. Belajar Microservices - Shared Database",
        category: "Data Pattern",
        videoId: "jYuo2_DMasI",
        duration: "16:21",
        desc: "Antipattern dan kriteria terbatas penggunaan Shared Database dalam Microservices, bahaya perubahan skema tabel bersama, dan tantangan locking.",
        summary: "Shared Database di mana beberapa microservices mengakses satu database RDBMS bersama dianggap sebagai Antipattern karena menyebabkan tight coupling tingkat database.",
        theory: `
            <h3>1. Mengapa Shared Database Dianggap Anti-Pattern?</h3>
            <p>Meskipun <strong>Shared Database</strong> terlihat menarik pada tahap awal migrasi (karena tidak perlu mengubah kode transaksi SQL lama), pendekatan ini menciptakan keterikatan yang sangat ketat (Tight Coupling) di tingkat database.</p>

            <div class="callout callout-warning">
                <strong>⚠️ Risiko Utama Shared Database:</strong>
                <ul>
                    <li><strong>Loss of Encapsulation:</strong> Tim pengembang Service A bisa saja merubah kolom tabel <code>users</code> dan membuat Service B crash saat runtime tanpa terdeteksi di kompilasi.</li>
                    <li><strong>Single Point of Failure:</strong> Jika database terpusat mengalami overload CPU atau mati, SELURUH microservices akan crash bersamaan.</li>
                    <li><strong>Resource Contention & Locking:</strong> Transaction lock tabel di Service A akan memblokir Read query di Service B.</li>
                </ul>
            </div>

            <h3>2. Kapan Shared Database Ditoleransi?</h3>
            <p>Shared Database hanya ditoleransi sementara saat <strong>Migrasi Bertahap (Strangler Fig Pattern)</strong> dari Monolith ke Microservices sebelum data di-refactor penuh ke DB terpisah.</p>
        `,
        sampleCommands: [
            "psql -h shared-db-server -U admin -c '\\dt'",
            "pg_activity --host=shared-db-server"
        ],
        quiz: [
            {
                question: "Mengapa penggunaan Shared Database antar microservices dianggap sebagai Antipattern?",
                options: [
                    "Karena menyebabkan tight coupling tingkat database dan risiko merusak service lain saat skema tabel berubah",
                    "Karena membuat ukuran file SQL menjadi lebih kecil",
                    "Karena mengharuskan penggunaan Docker",
                    "Karena database tidak bisa menyimpan angka"
                ],
                answer: 0,
                explanation: "Shared Database menghilangkan enkapsulasi data dan memicu tight coupling antar service."
            },
            {
                question: "Pola migrasi apakah yang bertahap menggantikan komponen Monolith satu per satu hingga menjadi Microservices penuh?",
                options: ["Big Bang Pattern", "Strangler Fig Pattern", "Singleton Pattern", "Factory Pattern"],
                answer: 1,
                explanation: "Strangler Fig Pattern adalah strategi merilis microservices secara bertahap menggantikan monolith."
            }
        ]
    },
    {
        id: 7,
        title: "07. Belajar Microservices - NoSQL Database",
        category: "Data Pattern",
        videoId: "Pw34eg_6ve4",
        duration: "09:55",
        desc: "Penggunaan database NoSQL (Document Store, Key-Value, Column-family, Graph) yang disesuaikan dengan kebutuhan domain bisnis masing-masing service.",
        summary: "NoSQL menyediakan skalabilitas horizontal (sharding) dan fleksibilitas skema yang sangat cocok untuk domain microservices seperti Caching, Session, Log, dan Social Graphs.",
        theory: `
            <h3>1. Kategori Database NoSQL dalam Microservices</h3>
            <ul>
                <li><strong>Key-Value Store (Redis, Memcached):</strong> Sangat cocok untuk Caching layer, Session store, Rate Limiter, dan Leaderboard. Read speed sub-millisecond.</li>
                <li><strong>Document Store (MongoDB, Couchbase):</strong> Menyimpan data terstruktur fleksibel (JSON/BSON). Cocok untuk Katalog Produk, User Profile, dan Content Management.</li>
                <li><strong>Column-Family Store (Apache Cassandra, ScyllaDB):</strong> Penulisan data berkecepatan tinggi tanpa batasan. Cocok untuk IoT Time-Series Data, Activity Logs, dan Analytics tracking.</li>
                <li><strong>Graph Database (Neo4j, Amazon Neptune):</strong> Mengelola hubungan (nodes & edges) antar entitas. Cocok untuk Recommendation Engine, Fraud Detection, dan Social Network Connection.</li>
            </ul>

            <h3>2. Contoh Dokumen JSON di MongoDB (Catalog Service)</h3>
            <div class="code-container">
                <div class="code-header"><span>catalog_products.json</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>{
  "_id": "PROD-99412",
  "name": "Laptop Gaming Pro 16",
  "brand": "TechBrand",
  "price": 25000000,
  "attributes": {
    "ram": "32GB DDR5",
    "cpu": "Intel Core i9",
    "gpu": "RTX 4080"
  },
  "tags": ["laptop", "gaming", "pro"],
  "stock": 15
}</code></pre>
            </div>
        `,
        sampleCommands: [
            "redis-cli -h localhost PING",
            "mongosh mongodb://localhost:27017/catalog_db",
            "neo4j-admin server status"
        ],
        quiz: [
            {
                question: "Jenis NoSQL Database apakah yang paling ideal digunakan untuk membangun fitur Social Network Connection atau Recommendation Engine?",
                options: ["Document Store", "Graph Database (Neo4j)", "Key-Value Store", "Relational Database"],
                answer: 1,
                explanation: "Graph Database dirancang khusus untuk memetakan hubungan kompleks antar entitas."
            },
            {
                question: "NoSQL Key-Value Store manakah yang beroperasi in-memory dan sangat populer untuk Caching & Session Store?",
                options: ["PostgreSQL", "Redis", "Elasticsearch", "Neo4j"],
                answer: 1,
                explanation: "Redis adalah pilihan paling populer untuk in-memory caching dan session store."
            }
        ]
    },
    {
        id: 8,
        title: "08. Belajar Microservices - Remote Procedure Invocation",
        category: "Komunikasi",
        videoId: "Rsi8mxVX70M",
        duration: "13:38",
        desc: "Komunikasi sinkron antar service menggunakan HTTP REST API, gRPC (Protocol Buffers), SOAP/RPC, latensi jaringan, serta mitigasi cascading failures.",
        summary: "Remote Procedure Invocation (RPI) mengizinkan service memanggil fungsi di service lain secara sinkron. gRPC berbasis HTTP/2 & Protobuf menawarkan latensi super rendah dibanding REST JSON.",
        theory: `
            <h3>1. Komunikasi Sinkron: REST vs gRPC</h3>
            <p><strong>Remote Procedure Invocation (RPI)</strong> adalah gaya komunikasi sinkron di mana pemanggil (Client Service) mengirimkan request dan menunggu balasan (Response) dari Target Service secara langsung.</p>

            <ul>
                <li><strong>HTTP REST API (JSON):</strong> Mudah dibaca manusia, standar industri untuk publik API, namun ukuran payload JSON relatif besar dan serialisasi teks lambat.</li>
                <li><strong>gRPC (Protocol Buffers / HTTP/2):</strong> Format biner super kecil, diserialisasi sangat cepat, mendukung multiplexing HTTP/2, streaming dua arah, dan type-safe via berkas <code>.proto</code>. Sangat direkomendasikan untuk komunikasi internal antar microservice (Service-to-Service).</li>
            </ul>

            <h3>2. Contoh Berkas Definition gRPC Protobuf</h3>
            <div class="code-container">
                <div class="code-header"><span>payment_service.proto</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>syntax = "proto3";

package payment;

service PaymentService {
  rpc ProcessPayment (PaymentRequest) returns (PaymentResponse);
}

message PaymentRequest {
  string order_id = 1;
  double amount = 2;
  string payment_method = 3;
}

message PaymentResponse {
  string transaction_id = 1;
  string status = 2; // SUCCESS, FAILED
  string message = 3;
}</code></pre>
            </div>
        `,
        sampleCommands: [
            "grpcurl -plaintext localhost:50051 list",
            "curl -X POST http://payment-service:8080/api/v1/payments",
            "protoc --proto_path=. --go_out=. payment_service.proto"
        ],
        quiz: [
            {
                question: "Mengapa gRPC lebih cepat dan efisien dibanding HTTP REST JSON untuk komunikasi internal inter-service?",
                options: [
                    "Karena gRPC menggunakan serialisasi biner Protocol Buffers dan protokol transport HTTP/2",
                    "Karena gRPC tidak memerlukan server",
                    "Karena gRPC menghapus pengirim request",
                    "Karena gRPC ditulis dalam HTML"
                ],
                answer: 0,
                explanation: "Protocol Buffers biner dan HTTP/2 multiplexing membuat gRPC jauh lebih ringan dibanding REST JSON."
            },
            {
                question: "Apakah bahaya utama dari komunikasi sinkron RPI berantai (Service A -> Service B -> Service C -> Service D)?",
                options: ["Memory Leak", "Cascading Failures & High Latency Accumulation", "Kekurangan alamat IP", "Database terhapus"],
                answer: 1,
                explanation: "Panggilan sinkron berantai mengumpulkan latensi dan berisiko mengalami kegagalan beruntun jika 1 service di rantai down."
            }
        ]
    },
    {
        id: 9,
        title: "09. Belajar Microservices - Asynchronous Messaging",
        category: "Komunikasi",
        videoId: "IgJ8RBsRGoM",
        duration: "12:25",
        desc: "Komunikasi asinkron Event-Driven Architecture menggunakan Message Brokers (RabbitMQ, Apache Kafka, Redis Streams) untuk loose coupling total.",
        summary: "Asynchronous Messaging menggunakan Message Broker untuk mengirim pesan tanpa menunggu balasan (Decoupled). Publisher mempublikasikan event, Consumer memproses pesan saat siap.",
        theory: `
            <h3>1. Konsep Asynchronous Messaging</h3>
            <p>Berbeda dari panggilan sinkron, pada <strong>Asynchronous Messaging</strong>, Service Pengirim (Publisher) cukup mempublikasikan pesan (Event / Message) ke <strong>Message Broker</strong> lalu langsung melanjutkan pekerjaannya tanpa tertahan (non-blocking).</p>

            <h3>2. Keuntungan Asynchronous Messaging</h3>
            <ul>
                <li><strong>Loose Coupling Total:</strong> Publisher tidak perlu tahu IP address atau status dari Consumer.</li>
                <li><strong>Traffic Buffering & Spike Smoothing:</strong> Jika terjadi lonjakan transaksi 100.000 order per detik, Message Broker (seperti Kafka/RabbitMQ) menampung seluruh pesan di Queue. Consumer Service akan memproses pesan sesuai kapasitasnya tanpa crash.</li>
                <li><strong>High Availability:</strong> Jika Consumer Service sedang down saat event dikirim, pesan tetap tersimpan aman di Broker dan akan diproses saat Consumer aktif kembali.</li>
            </ul>

            <h3>3. Message Broker Populer: RabbitMQ vs Apache Kafka</h3>
            <ul>
                <li><strong>RabbitMQ (AMQP / Message Queue):</strong> Berfokus pada ruting pesan kompleks (Direct, Fanout, Topic exchange) dan pengiriman pesan per-item.</li>
                <li><strong>Apache Kafka (Distributed Event Streaming):</strong> Berfokus pada log terdistribusi berkapasitas raksasa, imutabel event stream, dan replayability pesan.</li>
            </ul>
        `,
        sampleCommands: [
            "rabbitmqctl status",
            "kafka-topics.sh --list --bootstrap-server localhost:9092",
            "kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic order-created-events"
        ],
        quiz: [
            {
                question: "Apa yang terjadi pada transaksi pesan di Asynchronous Messaging jika Consumer Service sedang offline/down saat Publisher mengirim event?",
                options: [
                    "Pesan akan hilang selamanya dan Publisher error",
                    "Pesan tersimpan aman di Message Broker dan diproses otomatis saat Consumer aktif kembali",
                    "Publisher akan crash",
                    "Database utama terhapus"
                ],
                answer: 1,
                explanation: "Message Broker menyimpan antrean pesan secara persisten hingga consumer siap memproses."
            },
            {
                question: "Platform Event Streaming terdistribusi apakah yang sangat populer untuk menangani throughput jutaan event log per detik?",
                options: ["Apache Kafka", "SQLite", "Nginx", "Jenkins"],
                answer: 0,
                explanation: "Apache Kafka dirancang khusus untuk high-throughput event streaming terdistribusi."
            }
        ]
    },
    {
        id: 10,
        title: "10. Belajar Microservices - Service Orchestration",
        category: "Orkestrasi",
        videoId: "WTLGEsmKves",
        duration: "16:47",
        desc: "Pola Saga Orchestration menggunakan Central Orchestrator (seperti Camunda/Temporal) untuk mengoordinasi transaksi terdistribusi multi-step.",
        summary: "Saga Orchestration mengendalikan alur transaksi terdistribusi menggunakan satu komponen pengontrol terpusat (Orchestrator) yang memerintahkan setiap service untuk mengeksekusi aksi atau compensating transaction.",
        theory: `
            <h3>1. Masalah Transaksi Terdistribusi (Saga Pattern)</h3>
            <p>Dalam Microservices (Database per Service), kita tidak bisa lagi menggunakan transaksi ACID RDBMS lokal (<code>BEGIN TRANSACTION</code>). Untuk transaksi multi-step (misal: Checkout -> Potong Stok -> Potong Saldo -> Kirim Notifikasi), kita menggunakan <strong>Saga Pattern</strong>.</p>

            <h3>2. Konsep Saga Orchestration</h3>
            <p>Dalam <strong>Saga Orchestration</strong>, terdapat sebuah **Central Orchestrator** (komponen pengontrol terpusat) yang bertugas secara sekuensial memanggil setiap service melalui request/response dan memantau statusnya.</p>

            <div class="callout callout-info">
                <strong>🔄 Compensating Transactions (Kompensasi Pembatalan):</strong><br>
                Jika Step 1 (Potong Stok Order) Berhasil, tetapi Step 2 (Potong Saldo Pembayaran) GAGAL, Orchestrator bertugas memanggil <strong>Compensating Action</strong> ke Order Service untuk membatalkan pesanan (<code>CancelOrder</code> / Kembalikan Stok)!
            </div>

            <h3>3. Kelebihan & Kekurangan Orchestration</h3>
            <ul>
                <li><strong>Kelebihan:</strong> Alur bisnis kompleks sangat mudah dilacak dan dipahami karena berada di 1 tempat terpusat. Mudah mengelola siklus compensating transaction.</li>
                <li><strong>Kekurangan:</strong> Risiko terjadi tight coupling jika logika bisnis terlalu menumpuk di Orchestrator (Orchestrator menjadi terlalu pintar/fat).</li>
            </ul>
        `,
        sampleCommands: [
            "saga-orchestrator status --workflow=checkout-saga-102",
            "camunda-cli process list",
            "temporal workflow show --workflow-id checkout-102"
        ],
        quiz: [
            {
                question: "Apakah fungsi dari 'Compensating Transaction' pada pola Saga saat salah satu langkah di tengah transaksi terdistribusi mengalami GAGAL?",
                options: [
                    "Mengeksekusi aksi pembatalan/pengembalian status untuk memulihkan konsistensi data langkah-langkah sebelumnya",
                    "Menghapus seluruh database",
                    "Mematikan server",
                    "Mengabaikan error dan lanjut terus"
                ],
                answer: 0,
                explanation: "Compensating transaction membatalkan langkah yang telah sukses sebelumnya agar data tetap konsisten."
            },
            {
                question: "Komponen manakah yang memegang kendali perintah dan alur eksekusi pada Saga Orchestration?",
                options: ["Central Orchestrator", "Database Client", "User Browser", "Git Runner"],
                answer: 0,
                explanation: "Central Orchestrator mengendalikan instruksi sekuensial ke tiap-tiap service."
            }
        ]
    },
    {
        id: 11,
        title: "11. Belajar Microservices - Service Choreography",
        category: "Orkestrasi",
        videoId: "zgu2r3_2i_E",
        duration: "15:34",
        desc: "Pola Saga Choreography di mana setiap service mendengarkan domain event dan mempublikasikan event balasan tanpa titik kontrol terpusat.",
        summary: "Saga Choreography mengendalikan transaksi terdistribusi secara terdesentralisasi. Setiap service mendengarkan event dari Message Broker, mengeksekusi tugasnya, dan menerbitkan event baru.",
        theory: `
            <h3>1. Konsep Saga Choreography</h3>
            <p>Berbeda dari Orchestration (yang menggunakan pengontrol terpusat), dalam <strong>Saga Choreography</strong> <em>TIDAK ADA coordinator pusat</em>. Setiap microservice berkomunikasi secara mandiri dengan mendengarkan (Subscribe) dan menerbitkan (Publish) <strong>Domain Events</strong> ke Message Broker (Kafka/RabbitMQ).</p>

            <h3>2. Contoh Alur Transaksi Choreography:</h3>
            <ol>
                <li><code>Order Service</code> membuat order -> menerbitkan event <code>OrderCreatedEvent</code>.</li>
                <li><code>Payment Service</code> mendengarkan <code>OrderCreatedEvent</code> -> memproses pembayaran -> menerbitkan event <code>PaymentProcessedEvent</code> (atau <code>PaymentFailedEvent</code>).</li>
                <li><code>Inventory Service</code> mendengarkan <code>PaymentProcessedEvent</code> -> mengurangi stok -> menerbitkan event <code>InventoryReservedEvent</code>.</li>
                <li>Jika <code>PaymentFailedEvent</code> diterbitkan -> <code>Order Service</code> mendengarkan event tersebut dan merubah status order menjadi <code>CANCELLED</code>.</li>
            </ol>

            <h3>3. Kelebihan & Kekurangan Choreography</h3>
            <ul>
                <li><strong>Kelebihan:</strong> Loose coupling luar biasa, sangat cepat, tidak ada single point of failure coordinator terpusat.</li>
                <li><strong>Kekurangan:</strong> Sulit dilacak (difficult to trace) jika transaksi melibatkan belasan service karena tidak ada 1 tempat yang menyimpan gambar utuh alur bisnis.</li>
            </ul>
        `,
        sampleCommands: [
            "kafka-console-consumer.sh --topic OrderCreatedEvent",
            "kafka-console-consumer.sh --topic PaymentProcessedEvent"
        ],
        quiz: [
            {
                question: "Apakah ciri khas utama yang membedakan Saga Choreography dari Saga Orchestration?",
                options: [
                    "Choreography TIDAK memiliki coordinator terpusat; setiap service secara mandiri merespons dan mempublikasikan domain event",
                    "Choreography hanya bisa menggunakan MySQL",
                    "Choreography memerlukan REST API sinkron",
                    "Choreography hanya berjalan di Windows"
                ],
                answer: 0,
                explanation: "Choreography beroperasi secara terdesentralisasi tanpa adanya central orchestrator."
            },
            {
                question: "Apakah tantangan utama dari penggunaan Saga Choreography pada transaksi bisnis yang melibatkan puluhan service?",
                options: [
                    "Kesulitan dalam melacak dan memvisualisasikan alur transaksi terdistribusi secara utuh (Visibility/Tracing challenge)",
                    "Ukuran kode terlalu kecil",
                    "Tidak bisa dikoneksikan ke internet",
                    "Processor CPU panas"
                ],
                answer: 0,
                explanation: "Tanpa coordinator pusat, melacak siklus transaksi terdesentralisasi membutuhkan distributed tracing ekstra."
            }
        ]
    },
    {
        id: 12,
        title: "12. Saga Pattern & Transaksi Terdistribusi",
        category: "Orkestrasi",
        videoId: null,
        duration: "22:45",
        desc: "Menjaga konsistensi data lintas layanan tanpa transaksi ACID global: saga orkestrasi, saga koreografi, transaksi kompensasi, dan pola Outbox.",
        summary: "Dengan database per service, transaksi ACID lintas layanan menjadi mustahil. Saga memecah transaksi bisnis menjadi rangkaian transaksi lokal, masing-masing dengan transaksi kompensasi bila langkah berikutnya gagal. Two-Phase Commit dihindari karena memblokir dan rapuh. Pola Outbox menutup celah dual write antara menyimpan ke database dan menerbitkan event. Konsistensinya bersifat eventual, sehingga alur bisnis harus dirancang menerima keadaan sementara.",
        theory: `
            <h3>1. Masalahnya: Tidak Ada Lagi Transaksi Global</h3>
            <div class="code-box">
                <pre>Di MONOLITH -- satu database, satu transaksi:
BEGIN;
  INSERT INTO pesanan ...;
  UPDATE stok SET jumlah = jumlah - 1 ...;
  INSERT INTO pembayaran ...;
COMMIT;              -- semua berhasil, atau semua batal

Di MICROSERVICES -- tiga database terpisah:
Layanan Pesanan    -&gt; db-pesanan
Layanan Stok       -&gt; db-stok
Layanan Pembayaran -&gt; db-pembayaran

Tidak ada BEGIN/COMMIT yang mencakup ketiganya.</pre>
            </div>

            <div class="callout callout-danger">
                <strong>🚫 Kenapa Two-Phase Commit (2PC) dihindari</strong>
                <p>2PC secara teori memberi transaksi lintas database, tetapi harganya terlalu mahal: <strong>ia memblokir</strong> — semua peserta mengunci sumber daya sampai koordinator memutuskan. Bila koordinator mati di tengah fase kedua, peserta terkunci tanpa kepastian. Ia juga menurunkan ketersediaan secara drastis karena sistem hanya sekuat peserta paling lambat, dan sebagian besar teknologi modern (Kafka, sebagian besar NoSQL, banyak API pihak ketiga) tidak mendukungnya sama sekali.</p>
            </div>

            <h3>2. Saga: Rangkaian Transaksi Lokal</h3>
            <p>Alih-alih satu transaksi besar, saga memecahnya menjadi beberapa transaksi lokal. Bila ada langkah yang gagal, saga menjalankan <strong>transaksi kompensasi</strong> untuk membatalkan langkah-langkah sebelumnya.</p>

            <div class="code-box">
                <pre>Alur normal:
1. Buat pesanan (status: MENUNGGU)
2. Pesan stok
3. Tagih pembayaran
4. Tandai pesanan LUNAS

Bila langkah 3 gagal:
3'. (gagal)
2'. Kompensasi: lepaskan pesanan stok
1'. Kompensasi: tandai pesanan DIBATALKAN</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Kompensasi bukan rollback</strong>
                <p>Rollback menghapus jejak seolah tidak pernah terjadi. Kompensasi adalah <strong>tindakan bisnis baru</strong> yang meniadakan efek sebelumnya, dan jejaknya tetap tercatat. Anda tidak bisa "membatalkan" email yang sudah terkirim — Anda mengirim email pembatalan. Anda tidak bisa membatalkan penarikan dana yang sudah masuk buku besar — Anda mencatat pengembalian dana. Rancang alur bisnisnya dengan kesadaran ini.</p>
            </div>

            <h3>3. Saga Orkestrasi</h3>
            <p>Ada satu komponen <strong>koordinator</strong> yang memerintahkan setiap langkah dan mengetahui keseluruhan alur.</p>

            <div class="code-box">
                <pre>            ┌──────────────────────┐
            │  Orkestrator Pesanan │
            └──────────────────────┘
              │      │        │
        1.    ▼  2.  ▼   3.   ▼
      ┌────────┐ ┌──────┐ ┌───────────┐
      │ Pesanan│ │ Stok │ │ Pembayaran│
      └────────┘ └──────┘ └───────────┘

Orkestrator memegang state machine:
  MENUNGGU -&gt; STOK_DIPESAN -&gt; DIBAYAR -&gt; SELESAI
                     ↓            ↓
                 DIBATALKAN &lt;─────┘</pre>
            </div>

            <table class="tech-table">
                <thead><tr><th>Kelebihan</th><th>Kekurangan</th></tr></thead>
                <tbody>
                    <tr><td>Alur terlihat jelas di satu tempat</td><td>Ada titik pusat yang bisa jadi hambatan</td></tr>
                    <tr><td>Mudah di-debug dan dipantau</td><td>Orkestrator bisa membengkak menjadi "monolith terselubung"</td></tr>
                    <tr><td>Logika kompensasi terpusat</td><td>Layanan menjadi lebih pasif, kurang otonom</td></tr>
                    <tr><td>Cocok untuk alur bercabang yang rumit</td><td>Perlu komponen tambahan untuk dikelola</td></tr>
                </tbody>
            </table>

            <h3>4. Saga Koreografi</h3>
            <p>Tidak ada koordinator. Tiap layanan mendengarkan event dan bereaksi menerbitkan event berikutnya.</p>

            <div class="code-box">
                <pre>Pesanan ──PesananDibuat──&gt; Stok ──StokDipesan──&gt; Pembayaran
                                                        │
   Pesanan &lt;──PembayaranLunas───────────────────────────┘

Jalur kegagalan:
Pembayaran ──PembayaranGagal──&gt; Stok ──StokDilepas──&gt; Pesanan
                                                          └─&gt; DIBATALKAN</pre>
            </div>

            <table class="tech-table">
                <thead><tr><th>Kelebihan</th><th>Kekurangan</th></tr></thead>
                <tbody>
                    <tr><td>Layanan benar-benar terpisah (loosely coupled)</td><td><strong>Tidak ada tempat melihat alur secara utuh</strong></td></tr>
                    <tr><td>Tidak ada titik pusat kegagalan</td><td>Sangat sulit di-debug saat ada masalah</td></tr>
                    <tr><td>Mudah menambah layanan pendengar baru</td><td>Risiko ketergantungan melingkar antar event</td></tr>
                    <tr><td>Cocok untuk alur linier sederhana</td><td>Alur bercabang cepat menjadi kacau</td></tr>
                </tbody>
            </table>

            <div class="callout callout-tip">
                <strong>📌 Panduan memilih</strong>
                <p>Gunakan <strong>koreografi</strong> untuk alur yang pendek dan linier dengan 2–4 layanan. Gunakan <strong>orkestrasi</strong> begitu ada percabangan, langkah bersyarat, atau lebih dari empat layanan. Banyak tim memulai dengan koreografi karena terasa lebih "murni", lalu terpaksa berpindah ke orkestrasi setelah tidak ada seorang pun yang bisa menjelaskan bagaimana sebuah pesanan berakhir dalam keadaan aneh.</p>
            </div>

            <h3>5. Masalah Dual Write dan Pola Outbox</h3>
            <div class="code-box">
                <div class="code-box-header"><span>Kode yang tampak benar tapi rusak</span></div>
                <pre>await db.simpan(pesanan);              // ✅ berhasil
await broker.terbitkan('PesananDibuat'); // ❌ proses mati di sini

// Pesanan tersimpan, tapi TIDAK ADA yang tahu.
// Stok tidak pernah dipesan. Saga berhenti diam-diam.</pre>
            </div>

            <p>Membalik urutannya tidak menolong — Anda hanya menukar masalahnya menjadi event yang terbit untuk pesanan yang tidak pernah tersimpan.</p>

            <div class="callout callout-info">
                <strong>💡 Solusinya: Pola Outbox</strong>
                <p>Tulis data bisnis dan event ke <strong>database yang sama, dalam satu transaksi</strong>. Proses terpisah kemudian membaca tabel outbox dan menerbitkannya ke broker.</p>
            </div>

            <div class="code-box">
                <pre>BEGIN;
  INSERT INTO pesanan (id, pengguna_id, total, status)
    VALUES ('p-1001', 55, 250000, 'MENUNGGU');

  INSERT INTO outbox (id, jenis_agregat, id_agregat, jenis_event, payload)
    VALUES (gen_random_uuid(), 'pesanan', 'p-1001', 'PesananDibuat',
            '{"id":"p-1001","total":250000}');
COMMIT;
-- Keduanya berhasil, atau keduanya batal. Tidak ada keadaan tengah.</pre>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Dua cara mengirim dari outbox</span></div>
                <pre>1. POLLING PUBLISHER
   Proses latar membaca baris outbox yang belum terkirim,
   menerbitkannya, lalu menandainya terkirim.
   Sederhana, tapi menambah beban baca ke database.

2. CHANGE DATA CAPTURE (CDC)
   Alat seperti Debezium membaca write-ahead log database
   dan menerbitkan perubahan secara otomatis.
   Tanpa polling, latensi rendah, tapi perlu komponen tambahan.</pre>
            </div>

            <h3>6. Idempotensi Wajib di Setiap Langkah</h3>
            <p>Broker pesan memberi jaminan <em>at-least-once</em>. Setiap langkah saga bisa menerima perintah yang sama dua kali.</p>

            <div class="code-box">
                <pre>async function tanganiPesanStok(perintah) {
  // Kunci idempotensi = ID saga + nama langkah
  const kunci = perintah.sagaId + ':pesan-stok';

  const sudah = await db.cariLangkahSelesai(kunci);
  if (sudah) return sudah.hasil;      // sudah pernah, kembalikan hasil lama

  const hasil = await pesanStok(perintah.produkId, perintah.jumlah);
  await db.simpanLangkahSelesai(kunci, hasil);
  return hasil;
}</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Kompensasi juga harus idempoten</strong>
                <p>Pesan kompensasi bisa terkirim ganda juga. "Lepaskan 1 stok" yang dijalankan dua kali akan mengembalikan 2 stok — dan sekarang stok Anda salah. Kompensasi juga wajib memeriksa apakah ia sudah pernah dijalankan.</p>
            </div>

            <h3>7. Konsekuensi yang Harus Diterima Bisnis</h3>
            <div class="callout callout-danger">
                <strong>🚫 Saga tidak memberi isolasi</strong>
                <p>Di tengah saga, sistem berada dalam keadaan yang <em>terlihat oleh pengguna lain</em>: pesanan sudah ada tapi belum dibayar, stok sudah berkurang tapi pesanan bisa saja dibatalkan. Ini tidak bisa dihindari — ini harga dari melepaskan transaksi global.</p>
                <p><strong>Cara menanganinya:</strong> gunakan status yang eksplisit (<code>MENUNGGU_PEMBAYARAN</code>, bukan sekadar <code>AKTIF</code>) agar bagian lain sistem tahu keadaan itu sementara; terapkan <em>semantic lock</em> dengan menandai record sebagai sedang diproses; dan rancang tampilan pengguna agar jujur menampilkan "sedang diproses" alih-alih berpura-pura sudah selesai.</p>
            </div>

            <h3>8. Memantau Saga</h3>
            <ul>
                <li><strong>Saga yang menggantung.</strong> Beri batas waktu tiap langkah. Saga yang berada di satu status lebih dari X menit harus memicu alert.</li>
                <li><strong>Tingkat kompensasi.</strong> Naiknya jumlah saga yang terkompensasi adalah gejala paling awal ada dependensi yang bermasalah.</li>
                <li><strong>Correlation ID.</strong> Satu ID yang mengalir di semua layanan dan semua event, sehingga seluruh perjalanan satu pesanan bisa dilacak di log dan trace.</li>
                <li><strong>Dead letter.</strong> Perintah saga yang gagal berulang harus masuk antrian khusus untuk diperiksa manusia, bukan diulang selamanya.</li>
            </ul>
        `,
        sampleCommands: [
            "SELECT * FROM outbox WHERE terkirim = false ORDER BY dibuat_pada LIMIT 100;",
            "SELECT status, COUNT(*) FROM saga_pesanan GROUP BY status;",
            "curl http://layanan-pesanan/api/saga/p-1001/riwayat",
            "kubectl logs -l app=orkestrator --since=10m | grep sagaId"
        ],
        quiz: [
            {
                question: "Mengapa Two-Phase Commit (2PC) umumnya dihindari di arsitektur microservices?",
                options: [
                    "Karena 2PC tidak menjamin konsistensi data",
                    "Karena 2PC memblokir peserta yang mengunci sumber daya sampai koordinator memutuskan, sehingga menurunkan ketersediaan dan rapuh bila koordinator mati",
                    "Karena 2PC hanya bekerja pada database NoSQL",
                    "Karena 2PC memerlukan lisensi komersial"
                ],
                answer: 1,
                explanation: "2PC benar-benar memberi atomisitas, tetapi harganya adalah pemblokiran. Selama fase commit, semua peserta menahan kunci; bila koordinator mati di tengah, peserta terjebak tanpa kepastian. Ketersediaan sistem juga hanya sekuat peserta yang paling lambat."
            },
            {
                question: "Apa masalah 'dual write' dan bagaimana pola Outbox menyelesaikannya?",
                options: [
                    "Data ditulis ke dua database sekaligus; Outbox menghapus salah satunya",
                    "Menyimpan ke database dan menerbitkan event adalah dua operasi terpisah yang bisa gagal separuh; Outbox menulis keduanya dalam satu transaksi database lalu proses terpisah menerbitkannya",
                    "Dua layanan menulis ke tabel yang sama; Outbox mengunci tabelnya",
                    "Event terbit dua kali; Outbox melakukan deduplikasi"
                ],
                answer: 1,
                explanation: "Bila proses mati di antara commit database dan penerbitan event, data tersimpan tetapi tidak ada yang tahu. Outbox menjadikan penulisan event bagian dari transaksi database yang sama, sehingga keduanya berhasil atau keduanya batal; pengiriman ke broker dilakukan menyusul oleh polling atau CDC."
            },
            {
                question: "Apa perbedaan mendasar antara transaksi kompensasi dan rollback?",
                options: [
                    "Tidak ada perbedaan, keduanya istilah yang sama",
                    "Rollback menghapus jejak seolah tak pernah terjadi, sedangkan kompensasi adalah tindakan bisnis baru yang meniadakan efek sebelumnya dan jejaknya tetap tercatat",
                    "Kompensasi lebih cepat daripada rollback",
                    "Rollback hanya berlaku untuk operasi baca"
                ],
                answer: 1,
                explanation: "Transaksi lokal yang sudah commit tidak bisa dibatalkan lagi. Kompensasi menambahkan tindakan penyeimbang — mengirim email pembatalan, mencatat pengembalian dana, melepaskan stok — sehingga riwayat tetap merekam bahwa kedua peristiwa itu pernah terjadi."
            }
        ]
    },
    {
        id: 13,
        title: "13. Belajar Microservices - API Gateway Pattern",
        category: "Gateway & Routing",
        videoId: "6qzD87wQTDA",
        duration: "14:29",
        desc: "Peran API Gateway (Kong, Spring Cloud Gateway, Traefik) sebagai single entry point: Reverse Proxy, Request Routing, Rate Limiting, SSL Termination.",
        summary: "API Gateway bertindak sebagai pintu gerbang utama (Single Entry Point) bagi seluruh klien luar ke dalam kluster microservices internal.",
        theory: `
            <h3>1. Mengapa Membutuhkan API Gateway?</h3>
            <p>Tanpa API Gateway, aplikasi klien (Web/Mobile) harus memanggil puluhan endpoint IP microservices internal secara langsung. Ini berbahaya karena merusak enkapsulasi keamanan internal dan memaksa client menangani perubahan IP/port service.</p>
            <p><strong>API Gateway</strong> bertindak sebagai Reverse Proxy pintar yang menyembunyikan arsitektur internal microservices dari dunia luar.</p>

            <h3>2. Tanggung Jawab Utama API Gateway</h3>
            <ul>
                <li><strong>Request Routing & Aggregation:</strong> Mengarahkan URL request (misal <code>/api/v1/orders</code> ke Order Service, <code>/api/v1/users</code> ke User Service).</li>
                <li><strong>SSL / TLS Termination:</strong> Menangani enkripsi HTTPS di gateway, sehingga komunikasi internal antar service bisa menggunakan HTTP cepat.</li>
                <li><strong>Authentication & Authorization:</strong> Memvalidasi token JWT / OAuth2 sebelum meneruskan request ke service internal.</li>
                <li><strong>Rate Limiting & Throttling:</strong> Membatasi jumlah request per menit untuk mencegah Serangan DDoS atau overload API.</li>
                <li><strong>Circuit Breaker & Retry:</strong> Menangani penanganan fallback jika service internal down.</li>
            </ul>

            <h3>3. Contoh Konfigurasi Routes di Spring Cloud Gateway (YAML)</h3>
            <div class="code-container">
                <div class="code-header"><span>application.yml (Spring Cloud Gateway)</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>spring:
  cloud:
    gateway:
      routes:
        - id: order-service-route
          uri: lb://ORDER-SERVICE
          predicates:
            - Path=/api/v1/orders/**
          filters:
            - StripPrefix=1
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20

        - id: catalog-service-route
          uri: lb://CATALOG-SERVICE
          predicates:
            - Path=/api/v1/products/**</code></pre>
            </div>
        `,
        sampleCommands: [
            "curl -i http://api-gateway:8080/api/v1/orders",
            "kong health",
            "traefik healthcheck"
        ],
        quiz: [
            {
                question: "Apakah fungsi dari fitur 'SSL Termination' pada API Gateway?",
                options: [
                    "Menangani dekripsi sertifikat HTTPS di tingkat Gateway sehingga jaringan komunikasi internal microservices dapat beroperasi lebih cepat",
                    "Menghapus seluruh password",
                    "Mematikan enkripsi database",
                    "Menolak seluruh trafik web"
                ],
                answer: 0,
                explanation: "SSL Termination mendekripsi HTTPS di gateway untuk menghemat beban CPU service internal."
            },
            {
                question: "Software API Gateway populer manakah di bawah ini yang dibangun di atas Nginx & Lua?",
                options: ["Kong API Gateway", "Jenkins", "RabbitMQ", "PostgreSQL"],
                answer: 0,
                explanation: "Kong API Gateway adalah enterprise gateway populer berbasis OpenResty (Nginx + Lua)."
            }
        ]
    },
    {
        id: 14,
        title: "14. Belajar Microservices - Backend for Frontend (BFF)",
        category: "Gateway & Routing",
        videoId: "xd3SDxCd38U",
        duration: "16:19",
        desc: "Pattern Backend for Frontend (BFF) di mana gateway khusus dibuat sesuai kebutuhan klien berbeda (Web Desktop, Mobile Android/iOS, Third Party API).",
        summary: "Pattern BFF (Backend for Frontend) membuat API Layer terpisah khusus untuk setiap jenis antarmuka klien (Web, Mobile, Smart TV) untuk mengoptimalkan bentuk payload dan kebutuhan jaringan.",
        theory: `
            <h3>1. Masalah Single Generic Gateway</h3>
            <p>Aplikasi Web Desktop memiliki layar besar dan koneksi WiFi cepat (membutuhkan data JSON lengkap). Sebaliknya, Aplikasi Mobile (iOS/Android) memiliki layar kecil dan koneksi seluler 4G/5G terbatas (membutuhkan payload JSON sangat ringkas untuk menghemat kuota & baterai).</p>

            <h3>2. Solusi: Backend for Frontend (BFF) Pattern</h3>
            <p>Daripada membuat 1 API Gateway universal yang memaksa kompromi, <strong>BFF Pattern</strong> membuat server gateway yang disesuaikan khusus untuk masing-masing tipe client:</p>

            <ul>
                <li><strong>Web BFF:</strong> Mengembalikan data lengkap beserta komponen HTML/rich widget.</li>
                <li><strong>Mobile BFF:</strong> Melakukan agregasi data, mengkompresi gambar, dan menghapus field yang tidak dipakai di layar HP.</li>
                <li><strong>Third-Party Public BFF:</strong> Dilengkapi rate limiter ketat dan skema autentikasi API Key khusus pihak ketiga.</li>
            </ul>

            <div class="code-container">
                <div class="code-header"><span>Arsitektur BFF Pattern</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>[ Web App ]  ────────> [ Web BFF Server ] ──────┐
                                                  │
[ Mobile App ] ──────> [ Mobile BFF Server ] ───┼──> [ Internal Microservices ]
                                                  │    (Order, User, Payment, etc.)
[ Third Party ] ─────> [ Public API BFF ] ──────┘</code></pre>
            </div>
        `,
        sampleCommands: [
            "curl -H 'User-Agent: Mobile' http://mobile-bff:8081/api/v1/home",
            "curl -H 'User-Agent: Web' http://web-bff:8080/api/v1/home"
        ],
        quiz: [
            {
                question: "Apakah tujuan utama dari penerapan pattern Backend for Frontend (BFF)?",
                options: [
                    "Menyediakan layer API yang disesuaikan khusus dengan kebutuhan unik dan tipe jaringan setiap platform client (Web, Mobile, IoT)",
                    "Menghapus kode backend",
                    "Memaksa mobile app menggunakan database SQL",
                    "Menyimpan file video di frontend"
                ],
                answer: 0,
                explanation: "BFF mengoptimalkan payload dan format data sesuai kebutuhan spesifik masing-masing jenis client."
            },
            {
                question: "Tim manakah yang idealnya memegang kepemilikan dan pengelolaan kode dari suatu BFF server?",
                options: [
                    "Tim Frontend / Mobile yang mengembangkan antarmuka platform terkait",
                    "Tim Database Administrator",
                    "Tim Network Engineer",
                    "Vendor Pihak Ketiga"
                ],
                answer: 0,
                explanation: "Tim Frontend/Mobile mengelola BFF agar bebas menyesuaikan API tanpa tergantung tim core backend."
            }
        ]
    },
    {
        id: 15,
        title: "15. Belajar Microservices - Authentication & Authorization",
        category: "Keamanan",
        videoId: "JZ8CW5tgXuY",
        duration: "14:33",
        desc: "Strategi autentikasi terpusat di API Gateway dengan OAuth2 / OpenID Connect, JWT (JSON Web Token), dan propagation token ke internal microservices.",
        summary: "Mengamankan ekosistem Microservices dengan memverifikasi kredensial di API Gateway dan meneruskan Token JWT terverifikasi ke microservices internal (Header propagation).",
        theory: `
            <h3>1. Pola Keamanan Microservices: Centralized Auth & JWT</h3>
            <p>Pendekatan terbaik untuk keamanan Microservices adalah melakukan <strong>Authentication & Validation di API Gateway</strong>, lalu meneruskan klaim identitas user (JWT / Custom Header) ke service-service di belakangnya.</p>

            <h3>2. Alur Kerja (Authentication Flow)</h3>
            <ol>
                <li>Client mengirimkan username & password ke <code>Auth Service</code> via API Gateway.</li>
                <li><code>Auth Service</code> memverifikasi kredensial dan mengembalikan **JSON Web Token (JWT)** bertanda tangan digital (Digital Signature RSA/HMAC).</li>
                <li>Untuk setiap request selanjutnya, Client menyertakan header: <code>Authorization: Bearer &lt;JWT_TOKEN&gt;</code>.</li>
                <li>API Gateway memverifikasi signature JWT. Jika valid, Gateway dapat mengekstrak informasi user (User ID, Email, Role) dan me-forward request ke internal service menyertakan header internal <code>X-User-Id: 10492</code>.</li>
                <li>Internal Service percaya pada header dari Gateway (Trust Zone) tanpa perlu mengecek ulang password ke DB.</li>
            </ol>

            <h3>3. Struktur JSON Web Token (JWT)</h3>
            <div class="code-container">
                <div class="code-header"><span>Dekonstruksi Struktur JWT</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>HEADER: {"alg": "RS256", "typ": "JWT"}
.
PAYLOAD: {
  "sub": "USR-99104",
  "name": "Eko Kurniawan",
  "role": "ADMIN",
  "iat": 1722120000,
  "exp": 1722123600
}
.
SIGNATURE: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)</code></pre>
            </div>
        `,
        sampleCommands: [
            "curl -H 'Authorization: Bearer eyJhbGciOi...' http://gateway:8080/api/v1/profile",
            "jwt decode eyJhbGciOi..."
        ],
        quiz: [
            {
                question: "Di manakah lokasi terbaik untuk melakukan verifikasi awal Token JWT dalam arsitektur Microservices?",
                options: [
                    "Di API Gateway (Centralized Validation)",
                    "Di setiap database individual",
                    "Di aplikasi browser client",
                    "Di server router DNS"
                ],
                answer: 0,
                explanation: "Melakukan verifikasi di API Gateway menyaring request illegal sebelum masuk ke jaringan internal."
            },
            {
                question: "Bagian JWT manakah yang berisi klaim identitas pengguna seperti User ID, Email, dan Role?",
                options: ["Header", "Payload", "Signature", "Footer"],
                answer: 1,
                explanation: "Payload berisi claims data pengguna dan metadata expiration."
            }
        ]
    },
    {
        id: 16,
        title: "16. Belajar Microservices - CQRS Pattern",
        category: "Advanced Pattern",
        videoId: "eei78T5Nz-U",
        duration: "09:41",
        desc: "Pattern Command Query Responsibility Segregation (CQRS) memisahkan model penulisan data (Command / Mutation) dan pembacaan data (Query / Read Store).",
        summary: "CQRS memisahkan alur kerja Penulisan Data (Command) dan Pembacaan Data (Query) menggunakan model objek dan database yang dioptimalkan secara terpisah.",
        theory: `
            <h3>1. Konsep Dasar CQRS</h3>
            <p><strong>CQRS (Command Query Responsibility Segregation)</strong> adalah pola arsitektur yang memisahkan operasi **Command** (penulisan, pembaruan, penghapusan data) dan **Query** (pembacaan data).</p>

            <ul>
                <li><strong>Command Side (Write Model):</strong> Berfokus pada validasi bisnis, transaksi ACID, dan integritas data. Menggunakan RDBMS (misal PostgreSQL).</li>
                <li><strong>Query Side (Read Model):</strong> Berfokus pada pencarian super cepat, penampilan laporan, dan denormalisasi data. Menggunakan Read Store yang dioptimalkan (misal Elasticsearch atau Redis).</li>
                <li><strong>Synchronization Engine:</strong> Menggunakan Asynchronous Event Stream (Kafka / Change Data Capture) untuk meng-update Read Store secara real-time saat Write DB berubah.</li>
            </ul>

            <div class="code-container">
                <div class="code-header"><span>Alur Arsitektur CQRS</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>[ Client Write ] ───> ( Command API ) ───> [ Write DB (PostgreSQL) ]
                                                   │
                                            ( Domain Event )
                                                   │
                                                   ▼
                                        [ Event Bus / Kafka ]
                                                   │
                                                   ▼
[ Client Read ]  <─── ( Query API )   <─── [ Read DB (Elasticsearch) ]</code></pre>
            </div>
        `,
        sampleCommands: [
            "curl -X POST http://order-command-service/orders -d '{\"item\": \"Book\"}'",
            "curl -X GET http://order-query-service/orders/search?q=Book"
        ],
        quiz: [
            {
                question: "Apakah pemisahan utama yang dilakukan oleh pola CQRS (Command Query Responsibility Segregation)?",
                options: [
                    "Memisahkan model dan alur kerja Penulisan Data (Command) dengan Pembacaan Data (Query)",
                    "Memisahkan file HTML dan CSS",
                    "Memisahkan server Windows dan Linux",
                    "Memisahkan password admin dan user"
                ],
                answer: 0,
                explanation: "CQRS memisahkan Write Model (Command) dan Read Model (Query) untuk performa optimal."
            },
            {
                question: "Jenis Database apakah yang sangat cocok digunakan pada sisi Query (Read Model) untuk pencarian teks cepat dan laporan terdenormalisasi?",
                options: ["Elasticsearch / Read Replica Redis", "Oracle DB Tape Backup", "Text File TXT", "Floppy Disk"],
                answer: 0,
                explanation: "Elasticsearch atau Redis denormalized store sangat cepat untuk melayani kueri pembacaan."
            }
        ]
    },
    {
        id: 17,
        title: "17. Resilience Pattern - Circuit Breaker, Retry, Timeout & Bulkhead",
        category: "Keandalan",
        videoId: null,
        duration: "23:30",
        desc: "Mencegah satu layanan yang lambat menyeret seluruh sistem: timeout wajib, retry yang tidak memperparah keadaan, circuit breaker, dan isolasi sumber daya.",
        summary: "Dalam sistem terdistribusi, kegagalan bukan pengecualian melainkan keadaan normal. Timeout adalah pertahanan paling dasar dan paling sering dilupakan. Retry tanpa jeda eksponensial dan jitter justru memperparah kemacetan. Circuit breaker memutus panggilan ke layanan yang jelas-jelas bermasalah agar sumber daya tidak habis menunggu. Bulkhead mengisolasi kolam sumber daya sehingga satu dependensi bermasalah tidak menghabiskan seluruh thread aplikasi.",
        theory: `
            <h3>1. Kenapa Monolith Tidak Butuh Ini, Microservices Butuh</h3>
            <p>Di monolith, memanggil fungsi lain adalah pemanggilan di dalam memori: selalu berhasil, selalu instan. Di microservices, setiap panggilan melewati jaringan yang bisa lambat, putus, atau menjawab separuh jalan.</p>

            <div class="callout callout-danger">
                <strong>🚫 Kegagalan berantai (cascading failure)</strong>
                <p>Layanan Pembayaran melambat menjadi 30 detik per permintaan. Layanan Pesanan yang memanggilnya ikut menunggu, thread pool-nya habis. Layanan Keranjang yang memanggil Pesanan ikut menunggu, thread-nya juga habis. Dalam hitungan menit, <strong>seluruh sistem mati padahal hanya satu layanan yang bermasalah</strong>. Inilah pola kegagalan paling umum dan paling merusak di arsitektur microservices.</p>
            </div>

            <h3>2. Timeout — Pertahanan Paling Dasar</h3>
            <div class="callout callout-warning">
                <strong>⚠️ Klien HTTP bawaan sering tidak punya timeout</strong>
                <p>Banyak pustaka HTTP secara default menunggu <strong>tanpa batas</strong>. Satu dependensi yang menggantung berarti thread Anda menggantung selamanya. Setiap panggilan keluar wajib punya timeout eksplisit — tanpa kecuali.</p>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Anggaran waktu berjenjang</span></div>
                <pre>Klien browser        : 10 detik
  └ API Gateway      : 9 detik
      └ Layanan Pesanan  : 6 detik
          └ Layanan Stok     : 2 detik
          └ Layanan Harga    : 2 detik

Aturannya: timeout di hulu HARUS lebih besar daripada
total timeout seluruh panggilan di hilirnya.</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Sebarkan tenggat, bukan hanya timeout</strong>
                <p>Yang lebih baik daripada timeout tetap adalah <strong>deadline propagation</strong>: kirimkan sisa waktu yang tersedia bersama permintaan. Bila layanan hulu sudah menunggu 5 detik dari anggaran 6 detik, layanan hilir tahu ia hanya punya 1 detik dan bisa langsung menyerah alih-alih mengerjakan pekerjaan yang hasilnya pasti dibuang. Ini bawaan di gRPC lewat <code>context.WithTimeout</code>, dan bisa ditiru di HTTP lewat header seperti <code>X-Request-Deadline</code>.</p>
            </div>

            <h3>3. Retry — dan Cara Melakukannya Tanpa Merusak</h3>
            <div class="code-box">
                <div class="code-box-header"><span>Retry naif yang MEMPERPARAH keadaan</span></div>
                <pre>for (let i = 0; i &lt; 3; i++) {
  try { return await panggilLayanan(); }
  catch (e) { /* langsung coba lagi */ }
}
// 1.000 klien gagal -&gt; 3.000 permintaan menghantam
// layanan yang SEDANG kepayahan. Ini disebut retry storm.</pre>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Exponential backoff + jitter</span></div>
                <pre>async function panggilDenganRetry(fn, maksPercobaan = 3) {
  let jedaDasar = 100;   // ms

  for (let percobaan = 0; percobaan &lt; maksPercobaan; percobaan++) {
    try {
      return await fn();
    } catch (err) {
      if (!bolehDiulang(err) || percobaan === maksPercobaan - 1) throw err;

      // Backoff eksponensial: 100ms, 200ms, 400ms, ...
      const jeda = jedaDasar * Math.pow(2, percobaan);
      // Jitter: acak PENUH agar klien tidak serempak
      const jedaAcak = Math.random() * jeda;

      await tidur(jedaAcak);
    }
  }
}

function bolehDiulang(err) {
  // JANGAN ulangi 4xx -- permintaannya memang salah,
  // diulang seribu kali pun tetap salah.
  if (err.status &gt;= 400 && err.status &lt; 500 && err.status !== 429) return false;
  return true;   // 5xx, timeout, kegagalan jaringan
}</pre>
            </div>

            <div class="callout callout-danger">
                <strong>🚫 Dua aturan retry yang mutlak</strong>
                <p><strong>1. Hanya ulangi operasi yang idempoten.</strong> Mengulang <code>GET</code> aman. Mengulang "buat pesanan" bisa menghasilkan pesanan ganda kecuali Anda memakai kunci idempotensi.</p>
                <p><strong>2. Jangan retry berlapis.</strong> Bila gateway mengulang 3 kali, dan tiap layanan di bawahnya juga mengulang 3 kali, satu permintaan pengguna bisa berubah menjadi 27 permintaan ke layanan terdalam. Tetapkan retry <strong>di satu lapisan saja</strong>, biasanya yang paling dekat dengan dependensi.</p>
            </div>

            <h3>4. Circuit Breaker</h3>
            <p>Bila sebuah layanan jelas-jelas sedang mati, terus-menerus memanggilnya hanya membuang waktu dan menghabiskan thread. Circuit breaker <strong>berhenti mencoba untuk sementara</strong>.</p>

            <div class="code-box">
                <pre>          gagal melewati ambang
  CLOSED ───────────────────────&gt; OPEN
    ↑                              │
    │ percobaan berhasil           │ setelah jeda pemulihan
    │                              ↓
    └──────────────────────── HALF-OPEN
              percobaan gagal ──────┘ (kembali ke OPEN)</pre>
            </div>

            <table class="tech-table">
                <thead><tr><th>Keadaan</th><th>Perilaku</th></tr></thead>
                <tbody>
                    <tr><td><strong>CLOSED</strong></td><td>Normal. Semua panggilan diteruskan, kegagalan dihitung.</td></tr>
                    <tr><td><strong>OPEN</strong></td><td>Semua panggilan <strong>langsung ditolak</strong> tanpa menyentuh jaringan. Cepat gagal, sumber daya terjaga.</td></tr>
                    <tr><td><strong>HALF-OPEN</strong></td><td>Beberapa panggilan percobaan diizinkan lewat untuk menguji apakah layanan sudah pulih.</td></tr>
                </tbody>
            </table>

            <div class="code-box">
                <div class="code-box-header"><span>Parameter yang perlu disetel</span></div>
                <pre>ambangKegagalan       : 50%      (persentase, bukan jumlah absolut)
jumlahPanggilanMinimum: 20       (jangan buka circuit karena 1 dari 2 gagal)
jendelaPengamatan     : 60 detik
jedaSebelumHalfOpen   : 30 detik
panggilanPercobaan    : 3</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Circuit breaker tanpa fallback hanya memindahkan masalah</strong>
                <p>Menolak permintaan dengan cepat memang melindungi sistem Anda, tetapi pengguna tetap melihat error. Pasangkan selalu dengan <strong>fallback yang bermakna</strong>: tampilkan data dari cache meski agak basi, tampilkan rekomendasi umum alih-alih personal, atau terima pesanan lalu proses pembayarannya secara asinkron. <em>Degradasi anggun</em> jauh lebih baik daripada halaman error.</p>
            </div>

            <h3>5. Bulkhead — Isolasi Sumber Daya</h3>
            <p>Nama ini diambil dari sekat kedap air di lambung kapal: satu kompartemen bocor tidak menenggelamkan seluruh kapal.</p>

            <div class="code-box">
                <pre>TANPA bulkhead -- satu kolam untuk semua:
┌─────────────────────────────────┐
│  Thread pool: 100               │
│  Layanan Rekomendasi melambat   │
│  -&gt; 100 thread habis menunggu   │
│  -&gt; Checkout ikut mati          │  ❌ padahal checkout tak terkait
└─────────────────────────────────┘

DENGAN bulkhead -- kolam terpisah:
┌──────────────┬──────────────┬──────────────┐
│ Pembayaran   │ Rekomendasi  │ Pencarian    │
│ 40 thread    │ 20 thread    │ 40 thread    │
│ ✅ sehat      │ ❌ habis      │ ✅ sehat      │
└──────────────┴──────────────┴──────────────┘
Fitur rekomendasi mati, checkout tetap jalan.</pre>
            </div>

            <div class="callout callout-info">
                <strong>💡 Bulkhead juga berlaku untuk koneksi database</strong>
                <p>Bila laporan analitik dan transaksi checkout memakai kolam koneksi yang sama, satu kueri laporan yang berat bisa menghabiskan seluruh koneksi dan melumpuhkan checkout. Pisahkan kolam koneksinya — atau lebih baik lagi, pisahkan ke replika baca tersendiri.</p>
            </div>

            <h3>6. Rate Limiting & Load Shedding</h3>
            <div class="code-box">
                <pre># Rate limiting: membatasi berapa banyak yang boleh masuk
#   - Token bucket  : mengizinkan lonjakan sesaat, cocok untuk API publik
#   - Sliding window: lebih ketat dan akurat
#   - Balas 429 Too Many Requests + header Retry-After

# Load shedding: membuang permintaan saat sistem KEPAYAHAN
if (panjangAntrian &gt; ambangKritis) {
  return balas503("Sedang sibuk, coba beberapa saat lagi");
}</pre>
            </div>

            <div class="callout callout-info">
                <strong>💡 Melayani 70% pengguna lebih baik daripada gagal untuk 100%</strong>
                <p>Load shedding terasa kejam, tetapi sistem yang menerima semua permintaan saat kelebihan beban akan melambat untuk <em>semua orang</em> sampai akhirnya mati total. Menolak sebagian permintaan lebih awal menjaga sisanya tetap terlayani dengan latensi normal.</p>
            </div>

            <h3>7. Menguji Ketahanan: Chaos Engineering</h3>
            <p>Pola-pola di atas hanya berguna bila benar-benar berfungsi saat dibutuhkan. Satu-satunya cara memastikannya adalah <strong>sengaja membuat kegagalan</strong>.</p>

            <ul>
                <li><strong>Suntikkan latensi</strong> — tambahkan 5 detik pada satu dependensi, lihat apakah timeout Anda bekerja.</li>
                <li><strong>Matikan satu instance</strong> — apakah load balancer mengalihkan trafik dengan benar?</li>
                <li><strong>Putuskan jaringan</strong> antara dua layanan — apakah circuit breaker terbuka?</li>
                <li><strong>Habiskan CPU atau memori</strong> pada satu node — apakah probe kesehatan mendeteksinya?</li>
            </ul>

            <div class="callout callout-tip">
                <strong>📌 Mulai dari lingkungan staging, dengan hipotesis</strong>
                <p>Chaos engineering bukan merusak secara acak. Tuliskan dulu hipotesisnya: "bila Layanan Rekomendasi mati, halaman produk tetap tampil dalam 2 detik tanpa bagian rekomendasi". Jalankan eksperimennya. Bila hipotesis salah, Anda baru saja menemukan bug produksi <em>sebelum</em> pengguna menemukannya.</p>
            </div>
        `,
        sampleCommands: [
            "curl -m 2 http://layanan-stok/api/stok/1",
            "kubectl get pods -l app=pembayaran",
            "kubectl describe pod pembayaran-xyz",
            "kubectl logs -f deploy/pesanan --tail=100"
        ],
        quiz: [
            {
                question: "Apa yang dimaksud cascading failure dalam arsitektur microservices?",
                options: [
                    "Semua layanan di-deploy secara berurutan",
                    "Satu layanan yang melambat membuat layanan pemanggilnya kehabisan thread, yang lalu membuat pemanggil berikutnya ikut kehabisan, sampai seluruh sistem mati",
                    "Database gagal melakukan replikasi",
                    "Beberapa layanan memakai versi pustaka yang berbeda"
                ],
                answer: 1,
                explanation: "Kegagalan menjalar ke hulu melalui rantai pemanggilan. Layanan yang menunggu dependensi lambat menahan thread-nya, sehingga ia sendiri berhenti melayani, dan pemanggilnya mengalami hal yang sama. Timeout dan circuit breaker ada untuk memutus rantai ini."
            },
            {
                question: "Mengapa retry tanpa exponential backoff dan jitter berbahaya?",
                options: [
                    "Karena membuat kode menjadi lebih panjang",
                    "Karena ribuan klien akan mengulang serempak dan melipatgandakan beban ke layanan yang justru sedang kepayahan (retry storm)",
                    "Karena retry tidak didukung protokol HTTP",
                    "Karena retry selalu menghasilkan data duplikat"
                ],
                answer: 1,
                explanation: "Retry langsung tanpa jeda melipatgandakan beban tepat pada saat layanan tujuan paling rapuh. Backoff eksponensial memberi waktu pemulihan, sementara jitter menyebarkan waktu percobaan agar klien tidak menghantam serempak dalam gelombang."
            },
            {
                question: "Apa fungsi keadaan HALF-OPEN pada circuit breaker?",
                options: [
                    "Meneruskan setengah dari seluruh permintaan secara permanen",
                    "Mengizinkan sedikit panggilan percobaan lewat untuk menguji apakah layanan sudah pulih, sebelum membuka kembali seluruh trafik",
                    "Menyimpan permintaan dalam antrian sampai layanan pulih",
                    "Menandai bahwa layanan sedang di-deploy"
                ],
                answer: 1,
                explanation: "Setelah jeda pemulihan, circuit breaker perlu tahu apakah dependensinya sudah sehat tanpa langsung membanjirinya. HALF-OPEN meloloskan beberapa panggilan uji: bila berhasil circuit kembali CLOSED, bila gagal ia kembali OPEN dan menunggu lagi."
            }
        ]
    },
    {
        id: 18,
        title: "18. Distributed Tracing & Observability",
        category: "Keandalan",
        videoId: null,
        duration: "21:20",
        desc: "Melacak satu permintaan yang melintasi banyak layanan dengan trace, span, dan context propagation memakai OpenTelemetry, serta menggabungkannya dengan log dan metrik.",
        summary: "Di microservices, log per layanan tidak cukup karena satu permintaan pengguna menyentuh belasan layanan. Distributed tracing memberi setiap permintaan satu trace ID yang diteruskan lewat header W3C traceparent, dan tiap operasi menjadi span dengan hubungan induk-anak. OpenTelemetry adalah standar netral vendor untuk instrumentasi. Tiga pilar observability - metrik, log, trace - harus saling terhubung agar investigasi insiden bisa berpindah antar sinyal.",
        theory: `
            <h3>1. Kenapa Log Saja Tidak Cukup</h3>
            <div class="code-box">
                <pre>Pengguna melapor: "checkout lambat, sekitar 8 detik"

Log Layanan Pesanan     : "memproses pesanan p-1001"  ... 8,2 detik
Log Layanan Stok        : "cek stok"                  ... 0,1 detik
Log Layanan Harga       : "hitung diskon"             ... 0,2 detik
Log Layanan Pembayaran  : "tagih kartu"               ... 0,3 detik

Total yang terlihat: 0,6 detik. Lalu 7,6 detik sisanya ke mana?</pre>
            </div>

            <p>Tanpa tracing, Anda hanya punya potongan-potongan terpisah tanpa tahu urutan, hubungan induk-anak, dan celah waktu di antaranya. Tracing menyusun potongan itu menjadi satu lini masa utuh.</p>

            <h3>2. Trace, Span, dan Hubungan Induk-Anak</h3>
            <div class="code-box">
                <pre>Trace ID: 4bf92f3577b34da6a3ce929d0e0e4736

├─ POST /checkout                          8,20 dtk  [Gateway]
│  ├─ POST /pesanan                        8,15 dtk  [Layanan Pesanan]
│  │  ├─ SELECT pengguna                   0,02 dtk  [PostgreSQL]
│  │  ├─ GET /stok/cek                     0,10 dtk  [Layanan Stok]
│  │  ├─ GET /harga/hitung                 0,20 dtk  [Layanan Harga]
│  │  ├─ ⚠ SELECT riwayat_pesanan          7,50 dtk  [PostgreSQL]  &lt;-- INI
│  │  └─ POST /pembayaran                  0,30 dtk  [Layanan Pembayaran]
│  └─ serialisasi respons                  0,05 dtk</pre>
            </div>

            <p>Ketemu: sebuah kueri database tanpa indeks. Tanpa tracing, menemukan ini bisa memakan waktu berhari-hari.</p>

            <table class="tech-table">
                <thead><tr><th>Istilah</th><th>Arti</th></tr></thead>
                <tbody>
                    <tr><td><strong>Trace</strong></td><td>Seluruh perjalanan satu permintaan lintas semua layanan</td></tr>
                    <tr><td><strong>Span</strong></td><td>Satu satuan pekerjaan: panggilan HTTP, kueri DB, pemrosesan pesan</td></tr>
                    <tr><td><strong>Trace ID</strong></td><td>Pengenal 16 byte, sama untuk seluruh perjalanan</td></tr>
                    <tr><td><strong>Span ID</strong></td><td>Pengenal 8 byte untuk satu span</td></tr>
                    <tr><td><strong>Parent Span ID</strong></td><td>Yang membentuk struktur pohon</td></tr>
                    <tr><td><strong>Attribute</strong></td><td>Pasangan kunci-nilai: <code>http.method</code>, <code>db.statement</code>, <code>pengguna.id</code></td></tr>
                    <tr><td><strong>Event</strong></td><td>Penanda waktu di dalam span, misal "cache miss"</td></tr>
                </tbody>
            </table>

            <h3>3. Context Propagation — Bagian yang Paling Sering Rusak</h3>
            <p>Agar trace tersambung, konteksnya harus ikut mengalir bersama setiap panggilan. Standarnya adalah header <strong>W3C Trace Context</strong>.</p>

            <div class="code-box">
                <pre>traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             │  │                                │                │
             │  │                                │                └─ flag (01 = direkam)
             │  │                                └─ parent span id
             │  └─ trace id
             └─ versi

tracestate: vendor1=nilai,vendor2=nilai   (opsional, khusus vendor)</pre>
            </div>

            <div class="callout callout-danger">
                <strong>🚫 Trace putus di batas asinkron</strong>
                <p>Propagasi otomatis biasanya berjalan mulus untuk HTTP dan gRPC. Yang sering putus adalah <strong>saat pesan masuk ke antrian</strong>. Bila Anda menerbitkan ke RabbitMQ atau Kafka tanpa menyisipkan <code>traceparent</code> ke header pesan, consumer akan memulai trace yang benar-benar baru — dan hubungan sebab-akibatnya hilang. Sisipkan konteks ke header pesan saat menerbitkan, dan ekstrak kembali saat mengonsumsi.</p>
            </div>

            <h3>4. OpenTelemetry — Standar Netral Vendor</h3>
            <div class="code-box">
                <pre>Aplikasi (SDK OpenTelemetry)
      │  protokol OTLP
      ▼
OpenTelemetry Collector  ← satu titik untuk memproses semuanya
      │       │       │
      ▼       ▼       ▼
   Tempo   Jaeger  Prometheus / Loki / vendor komersial</pre>
            </div>

            <div class="callout callout-info">
                <strong>💡 Kenapa memakai Collector, bukan mengirim langsung</strong>
                <ul>
                    <li><strong>Aplikasi tidak perlu tahu tujuan akhirnya.</strong> Ganti backend cukup dengan mengubah konfigurasi Collector, tanpa deploy ulang seluruh layanan.</li>
                    <li><strong>Tempat menyaring data sensitif</strong> sebelum keluar dari jaringan Anda.</li>
                    <li><strong>Tempat mengatur sampling</strong> secara terpusat.</li>
                    <li><strong>Buffer</strong> saat backend sedang tidak tersedia.</li>
                    <li><strong>Menambahkan atribut seragam</strong> seperti nama kluster, wilayah, dan lingkungan.</li>
                </ul>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>otel-collector.yaml</span></div>
                <pre>receivers:
  otlp:
    protocols:
      grpc: { endpoint: 0.0.0.0:4317 }
      http: { endpoint: 0.0.0.0:4318 }

processors:
  batch:
    timeout: 5s
  memory_limiter:
    limit_mib: 512
  attributes:
    actions:
      - key: pengguna.email      # jangan pernah kirim PII keluar
        action: delete

exporters:
  otlp/tempo:
    endpoint: tempo:4317
  prometheus:
    endpoint: 0.0.0.0:8889

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, attributes, batch]
      exporters: [otlp/tempo]</pre>
            </div>

            <h3>5. Sampling — Anda Tidak Bisa Menyimpan Semuanya</h3>
            <table class="tech-table">
                <thead><tr><th>Strategi</th><th>Cara kerja</th><th>Catatan</th></tr></thead>
                <tbody>
                    <tr><td><strong>Head sampling</strong></td><td>Diputuskan di awal, misal simpan 10% acak</td><td>Murah, tapi trace yang error bisa ikut terbuang</td></tr>
                    <tr><td><strong>Tail sampling</strong></td><td>Diputuskan setelah trace selesai</td><td>Bisa menyimpan <em>semua</em> yang error dan lambat; butuh memori di Collector</td></tr>
                    <tr><td><strong>Berbasis aturan</strong></td><td>Selalu simpan endpoint kritis, sampel jarang untuk health check</td><td>Paling praktis di produksi</td></tr>
                </tbody>
            </table>

            <div class="callout callout-tip">
                <strong>📌 Konfigurasi yang masuk akal untuk memulai</strong>
                <p>Simpan <strong>100%</strong> trace yang mengandung error atau melebihi ambang latensi, dan <strong>1–5%</strong> dari trace normal. Anda tetap punya gambaran statistik dari sampel, sekaligus memiliki bukti lengkap untuk setiap kejadian yang benar-benar penting.</p>
            </div>

            <h3>6. Menghubungkan Tiga Pilar</h3>
            <div class="code-box">
                <pre>METRIK  (Prometheus)  -&gt; "ada apa?"    Tingkat error naik ke 5%
   │ exemplar: trace_id
   ▼
TRACE   (Tempo)       -&gt; "di mana?"   Layanan Pembayaran, span 7,5 dtk
   │ trace_id
   ▼
LOG     (Loki)        -&gt; "kenapa?"    "connection pool exhausted"</pre>
            </div>

            <div class="callout callout-info">
                <strong>💡 Kunci penghubungnya: sertakan trace_id di setiap baris log</strong>
                <div class="code-box">
                    <pre>{
  "waktu": "2026-07-28T10:15:32Z",
  "level": "error",
  "layanan": "pembayaran",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7",
  "pesan": "kolam koneksi habis",
  "pesanan_id": "p-1001"
}</pre>
                </div>
                <p>Dengan ini, dari satu trace yang lambat Anda bisa langsung melompat ke semua log yang dihasilkan permintaan itu — di seluruh layanan sekaligus. Inilah yang mengubah investigasi insiden dari berjam-jam menjadi beberapa menit.</p>
            </div>

            <h3>7. Metrik yang Perlu Dipantau: Metode RED</h3>
            <div class="code-box">
                <pre>R - Rate      : jumlah permintaan per detik
E - Errors    : jumlah permintaan yang gagal per detik
D - Duration  : distribusi lama pemrosesan (p50, p95, p99)

Untuk sumber daya, pakai metode USE:
U - Utilization : persentase pemakaian
S - Saturation  : panjang antrian
E - Errors      : jumlah kesalahan</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Rata-rata menyembunyikan penderitaan pengguna</strong>
                <p>Latensi rata-rata 200 ms terdengar bagus. Tetapi bila p99 adalah 8 detik, satu dari seratus permintaan sangat buruk — dan pengguna yang membuka sepuluh halaman punya peluang besar merasakannya. <strong>Selalu pantau persentil</strong>, bukan rata-rata. Untuk sistem yang serius, pantau juga p99,9.</p>
            </div>

            <h3>8. Kesalahan Umum</h3>
            <ul>
                <li><strong>Kardinalitas metrik meledak.</strong> Jangan pernah menjadikan ID pengguna, ID pesanan, atau URL lengkap sebagai <em>label metrik</em> — itu membuat Prometheus kehabisan memori. Informasi berkardinalitas tinggi tempatnya di <strong>trace dan log</strong>, bukan metrik.</li>
                <li><strong>Log tanpa struktur.</strong> Log berbentuk kalimat bebas tidak bisa dikueri. Gunakan JSON dengan field yang konsisten.</li>
                <li><strong>Data pribadi di dalam span.</strong> Email, nomor kartu, dan token tidak boleh masuk ke atribut span. Saring di Collector.</li>
                <li><strong>Instrumentasi hanya di batas HTTP.</strong> Span yang tidak mencakup kueri database dan panggilan cache menyembunyikan justru bagian yang paling sering menjadi biang keladi.</li>
                <li><strong>Alert pada gejala, bukan penyebab.</strong> Beri alert pada hal yang dirasakan pengguna (tingkat error, latensi), bukan pada "CPU 80%" yang belum tentu berarti apa-apa.</li>
            </ul>
        `,
        sampleCommands: [
            "curl -H 'traceparent: 00-4bf92f35-00f067aa-01' http://gateway/checkout",
            "kubectl logs -l app=otel-collector --tail=50",
            "curl http://tempo:3200/api/traces/4bf92f3577b34da6",
            "curl http://layanan-pesanan:8080/metrics | grep http_request_duration"
        ],
        quiz: [
            {
                question: "Apa fungsi header 'traceparent' dalam distributed tracing?",
                options: [
                    "Menyimpan token autentikasi pengguna",
                    "Membawa trace ID dan parent span ID lintas batas layanan sehingga span-span terpisah bisa dirangkai menjadi satu pohon trace",
                    "Menentukan layanan mana yang harus dipanggil berikutnya",
                    "Mengompresi isi permintaan HTTP"
                ],
                answer: 1,
                explanation: "traceparent adalah bagian dari standar W3C Trace Context. Ia membawa trace ID yang sama sepanjang perjalanan permintaan beserta span ID pemanggil, sehingga backend tracing dapat menyusun hubungan induk-anak antar span dari layanan yang berbeda."
            },
            {
                question: "Mengapa ID pengguna atau ID pesanan TIDAK boleh dijadikan label metrik Prometheus?",
                options: [
                    "Karena Prometheus tidak mendukung label bertipe teks",
                    "Karena setiap nilai unik menciptakan time series baru, sehingga kardinalitasnya meledak dan Prometheus kehabisan memori",
                    "Karena label tersebut melanggar standar OpenTelemetry",
                    "Karena label metrik maksimal hanya boleh 3 buah"
                ],
                answer: 1,
                explanation: "Prometheus membuat satu time series untuk setiap kombinasi unik label. Satu juta ID pesanan berarti satu juta time series, yang cepat menghabiskan memori. Informasi berkardinalitas tinggi seperti itu tempatnya di trace dan log yang memang dirancang untuk data per-permintaan."
            },
            {
                question: "Apa keunggulan tail sampling dibanding head sampling?",
                options: [
                    "Tail sampling jauh lebih murah dari sisi sumber daya",
                    "Keputusan menyimpan diambil setelah trace selesai, sehingga semua trace yang error atau lambat bisa dipastikan tersimpan",
                    "Tail sampling tidak memerlukan Collector",
                    "Tail sampling otomatis menghapus data pribadi"
                ],
                answer: 1,
                explanation: "Head sampling memutuskan di awal ketika belum diketahui apakah permintaan akan gagal, sehingga trace penting bisa terbuang secara acak. Tail sampling menunggu trace lengkap sebelum memutuskan, dengan konsekuensi Collector harus menahan span di memori sampai trace selesai."
            }
        ]
    },
    {
        id: 19,
        title: "19. Contract Testing & Strategi Pengujian Microservices",
        category: "Keandalan",
        videoId: null,
        duration: "20:10",
        desc: "Menguji integrasi antar layanan tanpa menjalankan seluruh sistem: piramida uji, consumer-driven contract, dan Testcontainers.",
        summary: "End-to-end test yang menjalankan semua layanan itu lambat, rapuh, dan menjadi hambatan rilis. Consumer-driven contract testing membalik pendekatannya: konsumen mendeklarasikan apa yang ia butuhkan, penyedia memverifikasi bahwa ia memenuhinya - keduanya diuji secara terpisah dan cepat. Testcontainers menjalankan dependensi nyata seperti database dan broker di dalam kontainer sehingga uji integrasi tetap realistis tanpa mock yang menipu.",
        theory: `
            <h3>1. Kenapa Piramida Uji Berubah di Microservices</h3>
            <div class="code-box">
                <pre>          ▲  E2E  (sedikit, lambat, rapuh)
         ╱ ╲
        ╱   ╲  Contract  ← lapisan yang KHAS microservices
       ╱     ╲
      ╱       ╲  Integration (dengan dependensi nyata di kontainer)
     ╱         ╲
    ╱___________╲  Unit (banyak, cepat, murah)</pre>
            </div>

            <div class="callout callout-danger">
                <strong>🚫 Perangkap end-to-end test</strong>
                <p>Menjalankan 15 layanan plus database plus broker untuk setiap pull request terdengar menyeluruh, tetapi hasilnya: pipeline berjalan 40 menit, uji gagal secara acak karena masalah waktu dan jaringan, tim mulai mengabaikan kegagalan ("ah, itu cuma flaky"), dan pada akhirnya uji tersebut tidak lagi memberi keyakinan apa pun. <strong>Sedikit E2E untuk alur bisnis paling kritis saja</strong> — sisanya diselesaikan di lapisan yang lebih rendah.</p>
            </div>

            <h3>2. Masalah Mock yang Menipu</h3>
            <div class="code-box">
                <pre>// Uji di Layanan Pesanan, memakai mock Layanan Stok
mockLayananStok.cekStok.mengembalikan({ tersedia: true, jumlah: 10 });

// ✅ Uji lulus.
// ❌ Tapi Layanan Stok yang SEBENARNYA sudah lama berubah:
//    { available: true, quantity: 10 }   -- field-nya berganti nama!
// Uji tetap hijau, produksi tetap rusak.</pre>
            </div>

            <p>Mock hanya menguji <em>asumsi Anda</em> tentang layanan lain, bukan kenyataannya. Inilah lubang yang ditutup oleh contract testing.</p>

            <h3>3. Consumer-Driven Contract Testing</h3>
            <div class="code-box">
                <pre>1. KONSUMEN (Layanan Pesanan) menuliskan harapannya:
   "Bila saya GET /stok/produk-1,
    saya butuh respons berisi field 'tersedia' (boolean)
    dan 'jumlah' (integer)."

2. Uji konsumen berjalan terhadap mock yang dihasilkan
   dari kontrak itu -&gt; menghasilkan berkas KONTRAK.

3. Kontrak dikirim ke tempat penyimpanan bersama (broker kontrak).

4. PENYEDIA (Layanan Stok) mengambil semua kontrak dari
   seluruh konsumennya, lalu memverifikasi bahwa layanan
   aslinya benar-benar memenuhi semua janji itu.

5. Bila penyedia mengubah nama field, verifikasi GAGAL
   di pipeline penyedia -- SEBELUM konsumen rusak.</pre>
            </div>

            <div class="callout callout-info">
                <strong>💡 Kenapa arahnya dari konsumen</strong>
                <p>Penyedia sering tidak tahu bagian mana dari responsnya yang benar-benar dipakai. Kalau kontrak ditulis penyedia, ia akan menjanjikan seluruh respons dan tidak bisa mengubah apa pun. Dengan arah dari konsumen, penyedia tahu persis: "tiga konsumen memakai field <code>jumlah</code>, tidak ada yang memakai <code>gudang_id</code>" — sehingga ia bebas mengubah yang tidak dipakai.</p>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Contoh sisi konsumen (gaya Pact)</span></div>
                <pre>describe('Kontrak dengan Layanan Stok', () =&gt; {
  it('mengembalikan ketersediaan stok', async () =&gt; {
    await penyedia.addInteraction({
      state: 'produk-1 tersedia 10 buah',
      uponReceiving: 'permintaan cek stok',
      withRequest: {
        method: 'GET',
        path: '/stok/produk-1'
      },
      willRespondWith: {
        status: 200,
        body: {
          tersedia: like(true),      // yang diuji TIPE-nya,
          jumlah: like(10)           // bukan nilainya
        }
      }
    });

    const hasil = await klienStok.cek('produk-1');
    expect(hasil.tersedia).toBe(true);
  });
});</pre>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Uji tipe, bukan nilai</strong>
                <p>Kontrak yang mengunci nilai persis (<code>jumlah: 10</code>) akan pecah setiap kali data uji berubah. Gunakan pencocok tipe (<code>like</code>, <code>eachLike</code>, regex) agar kontrak memverifikasi <em>bentuk</em> respons — itulah yang sebenarnya menjadi perjanjian antar layanan.</p>
            </div>

            <h3>4. Testcontainers — Dependensi Nyata di Uji Integrasi</h3>
            <div class="code-box">
                <pre>// Menjalankan PostgreSQL SUNGGUHAN di kontainer,
// otomatis dibersihkan setelah uji selesai
const kontainer = await new PostgreSqlContainer('postgres:17-alpine')
  .withDatabase('uji')
  .start();

const db = buatKoneksi(kontainer.getConnectionUri());
await jalankanMigrasi(db);

// Sekarang uji repository terhadap PostgreSQL asli:
// constraint, tipe data, perilaku transaksi, semuanya nyata.
const pesanan = await repositoriPesanan.simpan({ total: 250000 });
expect(pesanan.id).toBeDefined();

await kontainer.stop();</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Database in-memory memberi rasa aman yang palsu</strong>
                <p>Menguji dengan H2 atau SQLite padahal produksi memakai PostgreSQL akan melewatkan seluruh kelas bug: perbedaan tipe data, perilaku constraint, sintaks kueri spesifik, tingkat isolasi transaksi, dan perilaku indeks. Testcontainers menghilangkan celah ini dengan menjalankan mesin database yang sama persis dengan produksi.</p>
            </div>

            <h3>5. Menguji Alur Asinkron</h3>
            <div class="code-box">
                <pre>it('menerbitkan event PesananDibuat', async () =&gt; {
  const broker = await new RabbitMQContainer('rabbitmq:4.1-alpine').start();
  const pesanYangDiterima = [];
  await berlangganan('pesanan.dibuat', (m) =&gt; pesanYangDiterima.push(m));

  await layananPesanan.buat({ penggunaId: 55, total: 250000 });

  // JANGAN pakai sleep tetap -- gunakan polling dengan batas waktu
  await tungguSampai(() =&gt; pesanYangDiterima.length === 1, { batas: 5000 });

  expect(pesanYangDiterima[0].jenis).toBe('PesananDibuat');
});</pre>
            </div>

            <div class="callout callout-danger">
                <strong>🚫 <code>sleep(2000)</code> adalah sumber uji rapuh nomor satu</strong>
                <p>Di mesin developer yang cepat, 2 detik terlalu lama dan memperlambat pipeline. Di runner CI yang sibuk, 2 detik ternyata kurang dan uji gagal secara acak. Gunakan pola <em>polling sampai kondisi terpenuhi</em> dengan batas waktu, bukan jeda tetap.</p>
            </div>

            <h3>6. Yang Perlu Diuji di Tiap Lapisan</h3>
            <table class="tech-table">
                <thead><tr><th>Lapisan</th><th>Yang diuji</th><th>Target waktu</th></tr></thead>
                <tbody>
                    <tr><td><strong>Unit</strong></td><td>Logika bisnis murni, perhitungan, aturan validasi</td><td>Seluruhnya &lt; 30 detik</td></tr>
                    <tr><td><strong>Integrasi</strong></td><td>Repository terhadap DB nyata, publisher terhadap broker nyata</td><td>&lt; 5 menit</td></tr>
                    <tr><td><strong>Kontrak</strong></td><td>Bentuk permintaan/respons antar layanan</td><td>&lt; 1 menit</td></tr>
                    <tr><td><strong>Komponen</strong></td><td>Satu layanan utuh, dependensi eksternal di-stub</td><td>&lt; 3 menit</td></tr>
                    <tr><td><strong>E2E</strong></td><td>Hanya 3–5 alur bisnis paling kritis</td><td>&lt; 15 menit</td></tr>
                </tbody>
            </table>

            <h3>7. Menguji di Produksi (dengan Aman)</h3>
            <p>Sebagian keadaan hanya muncul di produksi: data nyata, beban nyata, integrasi pihak ketiga yang sesungguhnya.</p>

            <ul>
                <li><strong>Synthetic monitoring</strong> — jalankan alur kritis secara berkala terhadap produksi, dan beri alert bila gagal.</li>
                <li><strong>Canary release</strong> — arahkan 5% trafik ke versi baru, bandingkan tingkat error dan latensinya sebelum melanjutkan.</li>
                <li><strong>Shadow traffic</strong> — gandakan trafik nyata ke versi baru tanpa memakai responsnya, untuk melihat perilakunya di bawah beban asli.</li>
                <li><strong>Feature flag</strong> — nyalakan fitur baru untuk sekelompok kecil pengguna internal lebih dulu.</li>
            </ul>

            <div class="callout callout-tip">
                <strong>📌 Prasyaratnya: kemampuan mundur dengan cepat</strong>
                <p>Menguji di produksi hanya bertanggung jawab bila Anda bisa mendeteksi masalah dalam hitungan menit (observability yang baik) dan mengembalikan keadaan dalam hitungan detik (feature flag atau rollback otomatis). Tanpa keduanya, itu bukan pengujian — itu berjudi dengan pengguna.</p>
            </div>
        `,
        sampleCommands: [
            "npm run test:contract",
            "docker run --rm pactfoundation/pact-cli broker can-i-deploy",
            "kubectl rollout status deploy/pesanan",
            "kubectl rollout undo deploy/pesanan"
        ],
        quiz: [
            {
                question: "Apa kelemahan fundamental menguji integrasi antar layanan hanya dengan mock?",
                options: [
                    "Mock berjalan terlalu lambat",
                    "Mock hanya menguji asumsi kita tentang layanan lain; bila layanan aslinya berubah, uji tetap lulus padahal produksi sudah rusak",
                    "Mock tidak bisa mengembalikan data JSON",
                    "Mock memerlukan jaringan yang stabil"
                ],
                answer: 1,
                explanation: "Mock ditulis berdasarkan pemahaman kita saat itu dan tidak pernah ikut berubah ketika penyedia mengubah kontraknya. Contract testing menutup celah ini dengan memverifikasi janji tersebut langsung terhadap layanan penyedia yang sesungguhnya."
            },
            {
                question: "Mengapa kontrak pada consumer-driven contract testing ditulis oleh KONSUMEN, bukan penyedia?",
                options: [
                    "Karena konsumen biasanya lebih berpengalaman",
                    "Karena hanya konsumen yang tahu bagian mana dari respons yang benar-benar ia pakai, sehingga penyedia bebas mengubah bagian yang tidak dipakai siapa pun",
                    "Karena penyedia tidak boleh menulis uji",
                    "Karena kontrak dari penyedia tidak bisa diverifikasi otomatis"
                ],
                answer: 1,
                explanation: "Kontrak yang ditulis penyedia akan menjanjikan seluruh permukaan API sehingga membekukan segalanya. Dengan arah dari konsumen, penyedia mendapat daftar tepat apa yang dipakai dan oleh siapa, sehingga evolusi API menjadi mungkin tanpa memutus siapa pun."
            },
            {
                question: "Mengapa memakai sleep(2000) untuk menunggu pesan asinkron adalah praktik yang buruk?",
                options: [
                    "Karena sleep tidak tersedia di semua bahasa pemrograman",
                    "Karena jeda tetap terlalu lama di mesin cepat sehingga memperlambat pipeline, dan terlalu pendek di CI yang sibuk sehingga uji gagal secara acak",
                    "Karena sleep menghabiskan memori",
                    "Karena sleep membuat pesan hilang"
                ],
                answer: 1,
                explanation: "Waktu tunggu yang tepat bergantung pada beban mesin yang tidak bisa diprediksi. Polling terhadap kondisi dengan batas waktu akan selesai secepat kondisi terpenuhi sekaligus tetap toleran ketika runner sedang lambat."
            }
        ]
    },
    {
        id: 20,
        title: "20. Belajar Microservices - Server Side Discovery",
        category: "Infrastructure",
        videoId: "3yBWxHh2PU4",
        duration: "09:14",
        desc: "Cara microservices menemukan lokasi alamat IP & port service lain secara dinamis menggunakan Server-Side Discovery (Kubernetes DNS / Load Balancer).",
        summary: "Server-Side Discovery menyerahkan tugas pencarian lokasi service kepada komponen Router / Load Balancer terpusat (seperti Kubernetes Service / AWS ALB).",
        theory: `
            <h3>1. Mengapa Butuh Service Discovery?</h3>
            <p>Dalam lingkungan cloud dan container (Kubernetes/Docker), alamat IP instansi microservice bersifat **efemeral (dinamis dan sering berubah-ubah)** saat terjadi auto-scaling atau restart container. Service pemanggil tidak boleh menembak IP statis.</p>

            <h3>2. Cara Kerja Server-Side Discovery</h3>
            <ol>
                <li>Client Service mengirimkan request ke alamat nama domain abstrak, misal: <code>http://payment-service/process</code>.</li>
                <li>Request diterima oleh **Server-Side Load Balancer / Router** (seperti Kubernetes Kube-Proxy / AWS ALB).</li>
                <li>Load Balancer mengecek ke **Service Registry internal**, mendapatkan IP instansi aktif (misal <code>10.244.1.42:8080</code>), dan meneruskan request ke sana.</li>
            </ol>

            <div class="callout callout-info">
                <strong>💡 Keuntungan Server-Side Discovery:</strong><br>
                Client Service tidak perlu memasang library discovery khusus di kodenya. Cukup memanggil nama Hostname DNS standar!
            </div>
        `,
        sampleCommands: [
            "nslookup payment-service.production.svc.cluster.local",
            "kubectl get svc payment-service",
            "kubectl get endpoints payment-service"
        ],
        quiz: [
            {
                question: "Manakah di bawah ini yang merupakan contoh penerapan Server-Side Service Discovery paling populer pada lingkungan Container Orchestration?",
                options: ["Kubernetes Service & Kube-DNS", "Manual IP File TXT", "Windows Registry", "Hardcoded IP Host"],
                answer: 0,
                explanation: "Kubernetes DNS secara otomatis menangani Server-Side Service Discovery via Service Name."
            },
            {
                question: "Siapakah yang bertugas melakukan pencarian lokasi IP instansi target pada Server-Side Discovery?",
                options: ["Server-Side Load Balancer / Router", "Aplikasi Client secara manual", "User di browser", "Petugas Data Center"],
                answer: 0,
                explanation: "Load balancer / router terpusat yang bertugas meresolusi IP instansi target."
            }
        ]
    },
    {
        id: 21,
        title: "21. Belajar Microservices - Client Side Discovery",
        category: "Infrastructure",
        videoId: "TFLw28SIH7o",
        duration: "11:04",
        desc: "Pola Client-Side Discovery (Eureka Client, Consul) di mana aplikasi mengecek ke Service Registry dan memilih instance service secara independen.",
        summary: "Client-Side Discovery mewajibkan aplikasi client untuk mengecek daftar alamat IP aktif ke Service Registry dan melakukan algoritma Load Balancing lokal (seperti Ribbon).",
        theory: `
            <h3>1. Konsep Client-Side Discovery</h3>
            <p>Dalam <strong>Client-Side Discovery</strong>, aplikasi Client bertanggung jawab langsung untuk menentukan alamat IP instance target yang tersedia.</p>

            <ol>
                <li>Client menghubungi **Service Registry** (seperti Netflix Eureka atau HashiCorp Consul).</li>
                <li>Service Registry mengembalikan daftar seluruh lokasi IP & Port instance aktif yang terdaftar (misal <code>[10.0.0.1:8080, 10.0.0.2:8080]</code>).</li>
                <li>Client menggunakan algoritma **Client-Side Load Balancing** (misal Round-Robin) untuk memilih salah satu IP dan mengirim request.</li>
            </ol>

            <h3>2. Kelebihan & Kekurangan Client-Side Discovery</h3>
            <ul>
                <li><strong>Kelebihan:</strong> Menghilangkan 1 hop latensi jaringan karena tidak melewati Load Balancer perantara ekstra.</li>
                <li><strong>Kekurangan:</strong> Menimbulkan keterikatan library discovery di kode aplikasi Client (harus menginstal SDK Eureka/Consul per bahasa).</li>
            </ul>
        `,
        sampleCommands: [
            "curl -H 'Accept: application/json' http://eureka-server:8761/eureka/apps/ORDER-SERVICE",
            "consul catalog services"
        ],
        quiz: [
            {
                question: "Komponen manakah yang memilih dan menentukan instansi IP target pada pola Client-Side Discovery?",
                options: ["Aplikasi Client sendiri menggunakan SDK Client-Side Load Balancer", "Hardware Firewall", "DNS Operator", "Database Master"],
                answer: 0,
                explanation: "Client sendiri yang bertugas mengecek daftar ke Registry dan memilih IP instansi."
            },
            {
                question: "Library Java Netflix manakah yang sangat terkenal untuk mengimplementasikan Client-Side Load Balancing?",
                options: ["Netflix Ribbon", "Hibernate", "JUnit", "Jackson"],
                answer: 0,
                explanation: "Netflix Ribbon adalah library Client-Side Load Balancer populer di ekosistem Spring Cloud."
            }
        ]
    },
    {
        id: 22,
        title: "22. Belajar Microservices - Service Registry",
        category: "Infrastructure",
        videoId: "uoPVeGOUwv0",
        duration: "09:29",
        desc: "Database terpusat (Netflix Eureka, HashiCorp Consul, ZooKeeper) untuk mencatat pendaftaran otomatis instance microservices (Health Check & Registration).",
        summary: "Service Registry adalah database pendaftaran dinamis yang mencatat alamat lokasi seluruh instansi microservice aktif beserta status kesehatannya (Heartbeat).",
        theory: `
            <h3>1. Peran Penting Service Registry</h3>
            <p><strong>Service Registry</strong> adalah direktori terpusat yang menyimpan basis data alamat IP, port, dan status kesehatan (Health Status) dari seluruh instance microservices yang sedang berjalan.</p>

            <h3>2. Mekanisme Pendaftaran & Health Check (Heartbeat)</h3>
            <ul>
                <li><strong>Self-Registration:</strong> Saat instance <code>Order Service</code> baru dinyalakan, instance tersebut secara otomatis mengirimkan HTTP POST pendaftaran ke Service Registry: *"Saya Order Service aktif di IP 10.0.1.15:8080"*.</li>
                <li><strong>Heartbeat Check:</strong> Setiap 30 detik, instance wajib mengirimkan sinyal PING / Heartbeat ke Registry.</li>
                <li><strong>Eviction (Pembersihan):</strong> Jika sebuah instance crash dan tidak mengirimkan Heartbeat dalam batas waktu (misal 90 detik), Service Registry akan **menghapus instance tersebut dari daftar** agar tidak dikirimkan request lagi.</li>
            </ul>

            <h3>3. Contoh Service Registry Populer</h3>
            <ul>
                <li><strong>Netflix Eureka:</strong> Sangat populer di ekosistem Java / Spring Cloud.</li>
                <li><strong>HashiCorp Consul:</strong> Multi-platform, dilengkapi fitur Distributed Key-Value & Service Mesh.</li>
                <li><strong>Apache ZooKeeper:</strong> Digunakan oleh sistem terdistribusi skala besar (seperti Kafka & Hadoop).</li>
            </ul>
        `,
        sampleCommands: [
            "curl http://localhost:8761/eureka/apps",
            "consul members",
            "zookeeper-shell.sh localhost:2181 ls /services"
        ],
        quiz: [
            {
                question: "Apakah yang dilakukan oleh Service Registry jika suatu instance microservice crash dan berhenti mengirimkan sinyal Heartbeat?",
                options: [
                    "Menghapus instance tersebut dari daftar pendaftaran aktif agar tidak menerima trafik lagi",
                    "Mematikan seluruh server",
                    "Menghapus kode repositori Git",
                    "Mengirimkan tagihan listrik"
                ],
                answer: 0,
                explanation: "Service Registry secara otomatis mencabut (evict) instansi yang tidak sehat."
            },
            {
                question: "Software Service Registry buatan Netflix apakah yang terintegrasi secara native dengan Spring Cloud?",
                options: ["Netflix Eureka", "RabbitMQ", "Docker Desktop", "Redis Admin"],
                answer: 0,
                explanation: "Netflix Eureka adalah Service Registry standar di Spring Cloud ecosystem."
            }
        ]
    },
    {
        id: 23,
        title: "23. Belajar Microservices - Centralized Configuration",
        category: "Infrastructure",
        videoId: "0Ipubljd2ZU",
        duration: "19:00",
        desc: "Pengelolaan konfigurasi terpusat (Spring Cloud Config, HashiCorp Vault, Kubernetes ConfigMap) agar parameter aplikasi dapat diubah tanpa re-deploy.",
        summary: "Centralized Configuration mengelola seluruh environment variables dan properti aplikasi di satu tempat terpusat yang aman dan mendukung perubahan dinamis tanpa re-compile.",
        theory: `
            <h3>1. Masalah Manajemen Konfigurasi di Microservices</h3>
            <p>Jika Anda memiliki 50 microservices dan ingin mengubah URL Database atau batas Timeout, sangat tidak efisien jika harus mengubah file <code>.env</code> di 50 repositori dan melakukan re-build & re-deploy satu per satu!</p>

            <h3>2. Solusi: Centralized Configuration Server</h3>
            <p>Dengan **Centralized Configuration**, seluruh berkas parameter properti disimpan di satu lokasi terpusat (seperti Repositori Git Khusus Konfigurasi atau HashiCorp Vault). Saat microservice dinyalakan, ia akan mendownload konfigurasinya dari Config Server.</p>

            <div class="callout callout-tip">
                <strong>🔒 Keamanan Rahasia (Secret Management):</strong><br>
                Gunakan alat seperti **HashiCorp Vault** atau AWS Secrets Manager untuk mengenkripsi kredensial sensitif (Password DB, API Secret Key) secara terpusat dengan enkripsi AES-256.
            </div>

            <h3>3. Contoh Spring Cloud Config Architecture</h3>
            <div class="code-container">
                <div class="code-header"><span>bootstrap.yml (Microservice Client)</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
                <pre><code>spring:
  application:
    name: order-service
  cloud:
    config:
      uri: http://config-server:8888
      profile: production
      label: main</code></pre>
            </div>
        `,
        sampleCommands: [
            "curl http://config-server:8888/order-service/production",
            "vault kv get secret/db-password",
            "kubectl get configmap app-config -o yaml"
        ],
        quiz: [
            {
                question: "Apakah keuntungan utama menggunakan Centralized Configuration Server pada arsitektur Microservices?",
                options: [
                    "Memungkinkan perubahan parameter konfigurasi di 1 tempat terpusat tanpa perlu me-recompile atau me-rebuild biner aplikasi",
                    "Membuat aplikasi berjalan tanpa koneksi listrik",
                    "Menghapus kebutuhan testing",
                    "Mengubah bahasa Java menjadi Python"
                ],
                answer: 0,
                explanation: "Centralized Config mempermudah pembaruan parameter tanpa re-compile aplikasi."
            },
            {
                question: "Software manakah yang dirancang khusus untuk menyimpan dan mengenkripsi kredensial rahasia (secrets) seperti API Key & Password Database secara aman?",
                options: ["HashiCorp Vault", "Apache HTTPd", "GitLab Runner", "Vite JS"],
                answer: 0,
                explanation: "HashiCorp Vault adalah standar industri untuk manajemen rahasia dan enkripsi terpusat."
            }
        ]
    },
    {
        id: 24,
        title: "24. Service Mesh & Deployment ke Kubernetes",
        category: "Infrastructure",
        videoId: null,
        duration: "22:00",
        desc: "Memindahkan urusan jaringan dari kode ke infrastruktur dengan sidecar proxy, mTLS otomatis, traffic splitting, serta pola deployment canary dan blue-green.",
        summary: "Service mesh menyisipkan proxy di samping tiap layanan sehingga retry, timeout, circuit breaker, mTLS, dan telemetri ditangani infrastruktur, bukan ditulis ulang di setiap bahasa. Harganya adalah kerumitan operasional dan latensi tambahan, sehingga tidak layak untuk sistem kecil. Di Kubernetes, kesehatan layanan ditentukan oleh probe yang benar, dan rilis aman dilakukan bertahap lewat canary atau blue-green dengan kemampuan mundur cepat.",
        theory: `
            <h3>1. Masalah yang Diselesaikan Service Mesh</h3>
            <p>Pola ketahanan di modul sebelumnya — retry, timeout, circuit breaker — harus diterapkan di <em>setiap</em> layanan. Bila layanan Anda ditulis dalam Go, Java, Python, dan Node.js, Anda menulis dan memelihara logika yang sama <strong>empat kali</strong>, dengan perilaku yang tidak pernah benar-benar sama.</p>

            <div class="code-box">
                <pre>TANPA mesh:                    DENGAN mesh:
┌─────────────┐               ┌─────────────┐
│ Aplikasi    │               │ Aplikasi    │  ← hanya logika bisnis
│ + retry     │               ├─────────────┤
│ + timeout   │               │ Sidecar     │  ← retry, timeout, mTLS,
│ + mTLS      │               │ Proxy       │    circuit breaker, metrik
│ + metrik    │               └─────────────┘
└─────────────┘
Ditulis ulang di tiap bahasa  Satu konfigurasi untuk semua bahasa</pre>
            </div>

            <h3>2. Data Plane dan Control Plane</h3>
            <ul>
                <li><strong>Data plane</strong> — kumpulan sidecar proxy yang benar-benar meneruskan lalu lintas. Semua paket melewatinya.</li>
                <li><strong>Control plane</strong> — otak yang menyebarkan konfigurasi, sertifikat, dan kebijakan ke seluruh proxy.</li>
            </ul>

            <div class="callout callout-info">
                <strong>💡 Yang Anda dapatkan tanpa mengubah satu baris kode aplikasi</strong>
                <ul>
                    <li><strong>mTLS otomatis</strong> antar layanan, lengkap dengan rotasi sertifikat.</li>
                    <li><strong>Retry, timeout, circuit breaker</strong> yang seragam lintas bahasa.</li>
                    <li><strong>Traffic splitting</strong> berbasis persentase atau header — fondasi canary.</li>
                    <li><strong>Metrik emas otomatis</strong>: rate, error, duration untuk setiap pasangan layanan.</li>
                    <li><strong>Kebijakan otorisasi</strong>: "hanya Layanan Pesanan yang boleh memanggil Layanan Pembayaran".</li>
                    <li><strong>Injeksi kesalahan</strong> untuk chaos engineering, tanpa menyentuh kode.</li>
                </ul>
            </div>

            <h3>3. Harga yang Harus Dibayar</h3>
            <div class="callout callout-danger">
                <strong>🚫 Service mesh bukan keputusan ringan</strong>
                <ul>
                    <li><strong>Latensi bertambah</strong> — setiap panggilan melewati dua proxy tambahan.</li>
                    <li><strong>Sumber daya bertambah</strong> — satu sidecar per pod berarti tambahan CPU dan memori dikalikan jumlah pod.</li>
                    <li><strong>Debugging jadi lebih sulit</strong> — kini ada lapisan tambahan yang bisa menjadi penyebab masalah.</li>
                    <li><strong>Kurva belajar curam</strong> — model konfigurasinya sendiri sudah merupakan bidang keahlian tersendiri.</li>
                    <li><strong>Beban upgrade</strong> — memutakhirkan mesh di kluster produksi adalah operasi yang menegangkan.</li>
                </ul>
                <p><strong>Untuk di bawah 10 layanan, mesh hampir selalu berlebihan.</strong> Pustaka ketahanan di dalam aplikasi sudah cukup. Pertimbangkan mesh ketika jumlah layanan sudah puluhan dan ditulis dalam banyak bahasa berbeda, atau ketika mTLS antar layanan menjadi kewajiban kepatuhan.</p>
            </div>

            <h3>4. Fondasi Kubernetes untuk Microservices</h3>
            <div class="code-box">
                <div class="code-box-header"><span>deployment.yaml</span></div>
                <pre>apiVersion: apps/v1
kind: Deployment
metadata:
  name: layanan-pesanan
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0        # jangan pernah turun di bawah kapasitas
  template:
    spec:
      containers:
        - name: pesanan
          image: registry.internal/pesanan:2.4.0   # JANGAN pakai :latest
          ports:
            - containerPort: 8080

          resources:
            requests:                # dipakai penjadwal untuk menempatkan pod
              cpu: 100m
              memory: 128Mi
            limits:                  # batas keras
              memory: 512Mi
              # CPU limit sengaja TIDAK disetel -- lihat catatan di bawah

          livenessProbe:             # "haruskah pod ini dibunuh & diganti?"
            httpGet: { path: /healthz, port: 8080 }
            initialDelaySeconds: 10
            periodSeconds: 10
            failureThreshold: 3

          readinessProbe:            # "bolehkah pod ini menerima trafik?"
            httpGet: { path: /readyz, port: 8080 }
            periodSeconds: 5

          startupProbe:              # untuk aplikasi yang lambat menyala
            httpGet: { path: /healthz, port: 8080 }
            failureThreshold: 30
            periodSeconds: 5</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Liveness dan readiness sering disalahpahami</strong>
                <p><strong>Liveness</strong> menjawab "apakah proses ini rusak dan perlu dibunuh?". <strong>Readiness</strong> menjawab "apakah pod ini siap menerima trafik sekarang?".</p>
                <p>Kesalahan yang sangat merusak: menjadikan liveness probe memeriksa dependensi eksternal seperti database. Ketika database sedang lambat, <em>seluruh</em> pod gagal liveness dan Kubernetes membunuh semuanya sekaligus — mengubah gangguan kecil menjadi pemadaman total. <strong>Liveness hanya boleh memeriksa proses itu sendiri.</strong> Ketergantungan eksternal diperiksa oleh readiness, yang cukup menghentikan trafik tanpa membunuh pod.</p>
            </div>

            <div class="callout callout-tip">
                <strong>📌 Soal CPU limit</strong>
                <p>Menyetel <code>limits.cpu</code> menyebabkan CFS throttling: kontainer dipaksa berhenti meski node masih punya CPU menganggur, sehingga latensi p99 melonjak. Praktik yang banyak dianut sekarang: <strong>selalu setel memory limit</strong> (karena memori tidak bisa dikompres — kehabisan berarti OOM kill), tetapi <strong>hanya setel CPU request tanpa limit</strong>, dan andalkan request untuk pembagian yang adil.</p>
            </div>

            <h3>5. Mematikan Pod dengan Anggun</h3>
            <div class="code-box">
                <pre>Kubernetes menghapus pod:
1. Pod ditandai Terminating, dikeluarkan dari daftar endpoint Service
2. Hook preStop dijalankan (bila ada)
3. Sinyal SIGTERM dikirim ke proses
4. Menunggu terminationGracePeriodSeconds (default 30 detik)
5. SIGKILL -- dipaksa mati</pre>
            </div>

            <div class="code-box">
                <pre>lifecycle:
  preStop:
    exec:
      command: ["sleep", "5"]     # beri waktu load balancer menyadari
terminationGracePeriodSeconds: 45</pre>
            </div>

            <div class="callout callout-warning">
                <strong>⚠️ Ada jendela balapan yang menyebabkan error 502</strong>
                <p>Penghapusan endpoint dan pengiriman SIGTERM terjadi hampir bersamaan. Bila aplikasi langsung berhenti menerima koneksi, permintaan yang sudah terlanjur diarahkan ke pod itu akan gagal. Jeda <code>preStop</code> beberapa detik memberi waktu agar semua load balancer memperbarui daftar endpoint sebelum aplikasi benar-benar berhenti. Aplikasi juga harus menangani SIGTERM: berhenti menerima koneksi baru, selesaikan yang sedang berjalan, lalu keluar.</p>
            </div>

            <h3>6. Strategi Rilis</h3>
            <table class="tech-table">
                <thead><tr><th>Strategi</th><th>Cara kerja</th><th>Pertimbangan</th></tr></thead>
                <tbody>
                    <tr><td><strong>Rolling update</strong></td><td>Ganti pod bertahap</td><td>Bawaan Kubernetes; dua versi berjalan bersamaan</td></tr>
                    <tr><td><strong>Blue-green</strong></td><td>Siapkan lingkungan baru utuh, alihkan trafik sekaligus</td><td>Mundur seketika; butuh sumber daya dua kali lipat</td></tr>
                    <tr><td><strong>Canary</strong></td><td>Alihkan 5% trafik, amati, lalu naikkan bertahap</td><td>Paling aman; perlu metrik yang baik untuk menilai</td></tr>
                    <tr><td><strong>Shadow</strong></td><td>Gandakan trafik ke versi baru, responsnya dibuang</td><td>Nol risiko bagi pengguna; hati-hati efek samping ganda</td></tr>
                </tbody>
            </table>

            <div class="code-box">
                <div class="code-box-header"><span>Canary lewat traffic splitting service mesh</span></div>
                <pre>rute:
  - tujuan: layanan-pesanan
    subset: v2.4.0
    bobot: 5           # 5% ke versi baru
  - tujuan: layanan-pesanan
    subset: v2.3.0
    bobot: 95

# Naikkan bertahap: 5% -&gt; 25% -&gt; 50% -&gt; 100%
# Pada tiap tahap, bandingkan tingkat error & latensi p99
# antara kedua subset. Bila memburuk, kembalikan ke 0%.</pre>
            </div>

            <div class="callout callout-danger">
                <strong>🚫 Dua versi berjalan bersamaan adalah keadaan normal</strong>
                <p>Pada rolling update maupun canary, versi lama dan baru <strong>selalu</strong> berjalan bersamaan untuk sementara. Konsekuensinya wajib dipikirkan: perubahan skema database harus kompatibel ke belakang (tambah kolom dulu, isi datanya, baru pakai — jangan pernah menghapus kolom di rilis yang sama); format pesan di broker harus bisa dibaca kedua versi; dan API tidak boleh menghapus field yang masih dipakai versi lama.</p>
            </div>

            <h3>7. Menjaga Ketersediaan Saat Pemeliharaan Kluster</h3>
            <div class="code-box">
                <div class="code-box-header"><span>PodDisruptionBudget</span></div>
                <pre>apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: pdb-pesanan
spec:
  minAvailable: 2          # atau: maxUnavailable: 1
  selector:
    matchLabels:
      app: layanan-pesanan</pre>
            </div>

            <p>Tanpa PDB, satu perintah <code>kubectl drain</code> saat memutakhirkan node bisa mengusir semua replika sekaligus dan mematikan layanan Anda. PDB memberi tahu Kubernetes berapa banyak pod yang wajib tetap hidup selama gangguan terencana.</p>

            <div class="code-box">
                <div class="code-box-header"><span>Sebar pod ke node & zona berbeda</span></div>
                <pre>topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        app: layanan-pesanan</pre>
            </div>
            <p>Tiga replika yang kebetulan dijadwalkan di satu node yang sama tidak memberi ketersediaan apa pun. Aturan penyebaran memastikan replika tersebar ke node dan zona yang berbeda.</p>
        `,
        sampleCommands: [
            "kubectl get pods -o wide -l app=layanan-pesanan",
            "kubectl rollout status deploy/layanan-pesanan",
            "kubectl rollout undo deploy/layanan-pesanan",
            "kubectl describe pdb pdb-pesanan",
            "kubectl top pods -l app=layanan-pesanan"
        ],
        quiz: [
            {
                question: "Mengapa liveness probe TIDAK boleh memeriksa ketersediaan database?",
                options: [
                    "Karena pemeriksaan database terlalu lambat",
                    "Karena bila database melambat, semua pod akan gagal liveness dan dibunuh Kubernetes secara bersamaan, mengubah gangguan kecil menjadi pemadaman total",
                    "Karena liveness probe hanya mendukung protokol TCP",
                    "Karena database selalu berada di luar kluster"
                ],
                answer: 1,
                explanation: "Liveness menjawab 'apakah proses ini rusak dan perlu diganti?'. Database yang lambat bukan kerusakan proses aplikasi, dan membunuh semua pod justru menghilangkan kapasitas tepat saat sistem sedang tertekan. Ketergantungan eksternal diperiksa readiness, yang cukup menghentikan trafik tanpa membunuh pod."
            },
            {
                question: "Dalam kondisi apa service mesh BELUM layak diadopsi?",
                options: [
                    "Ketika layanan ditulis dalam banyak bahasa berbeda",
                    "Ketika jumlah layanan masih sedikit (di bawah sekitar 10), karena kerumitan operasional dan latensi tambahannya melebihi manfaatnya",
                    "Ketika mTLS antar layanan diwajibkan oleh kepatuhan",
                    "Ketika dibutuhkan traffic splitting untuk canary"
                ],
                answer: 1,
                explanation: "Manfaat mesh tumbuh seiring jumlah layanan dan keragaman bahasa. Pada sistem kecil, pustaka ketahanan di dalam aplikasi sudah memadai, sementara biaya berupa sidecar per pod, latensi tambahan, dan beban upgrade sudah harus dibayar penuh sejak awal."
            },
            {
                question: "Mengapa perubahan skema database harus kompatibel ke belakang saat melakukan rolling update?",
                options: [
                    "Karena Kubernetes tidak mendukung migrasi database",
                    "Karena selama rolling update versi lama dan versi baru berjalan bersamaan, sehingga skema harus bisa dibaca keduanya",
                    "Karena migrasi database selalu gagal di dalam kontainer",
                    "Karena PodDisruptionBudget melarang perubahan skema"
                ],
                answer: 1,
                explanation: "Rolling update mengganti pod secara bertahap, sehingga selalu ada periode ketika kedua versi melayani trafik terhadap database yang sama. Menghapus atau mengganti nama kolom dalam satu rilis akan merusak versi lama yang masih berjalan; perubahan harus dipecah menjadi beberapa rilis yang aman."
            }
        ]
    }
];

// --- STATE MANAGEMENT ---
let state = {
    activeModuleIndex: 0,
    completedModules: JSON.parse(localStorage.getItem('microservices_completed') || '[]'),
    bookmarks: JSON.parse(localStorage.getItem('microservices_bookmarks') || '[]'),
    notes: JSON.parse(localStorage.getItem('microservices_notes') || '{}'),
    activeCategory: 'ALL',
    activeTab: 'theory',
    searchQuery: ''
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    loadModule(state.activeModuleIndex);
    updateProgressUI();

    // Event Listener Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase();
        renderSidebar();
    });

    // Terminal Enter Key Handler
    document.getElementById('terminalInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeTerminalCommand();
        }
    });
});

// --- RENDER SIDEBAR ---
function renderSidebar() {
    const container = document.getElementById('chapterListContainer');
    container.innerHTML = '';

    const filtered = MODULES_DATA.filter(mod => {
        const matchesCategory = state.activeCategory === 'ALL' || mod.category === state.activeCategory;
        const matchesSearch = mod.title.toLowerCase().includes(state.searchQuery) ||
                              mod.desc.toLowerCase().includes(state.searchQuery) ||
                              mod.summary.toLowerCase().includes(state.searchQuery);
        return matchesCategory && matchesSearch;
    });

    document.getElementById('chapterCountSidebar').innerText = `${filtered.length} Modul`;

    filtered.forEach((mod) => {
        const originalIndex = MODULES_DATA.findIndex(m => m.id === mod.id);
        const isCompleted = state.completedModules.includes(mod.id);
        const isBookmarked = state.bookmarks.includes(mod.id);
        const isActive = originalIndex === state.activeModuleIndex;

        const item = document.createElement('div');
        item.className = `chapter-item ${isActive ? 'active' : ''}`;
        item.onclick = () => selectModule(originalIndex);

        item.innerHTML = `
            <div class="chapter-item-header">
                <span class="chapter-item-title">${isCompleted ? '✅ ' : ''}${mod.title}</span>
                ${isBookmarked ? '⭐' : ''}
            </div>
            <div class="chapter-item-meta">
                <span class="badge badge-indigo">${mod.category}</span>
                <span>⏱️ ${mod.duration}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

// --- SELECT MODULE ---
function selectModule(index) {
    state.activeModuleIndex = index;
    renderSidebar();
    loadModule(index);
}

// --- LOAD MODULE INTO MAIN CONTENT ---
function loadModule(index) {
    const mod = MODULES_DATA[index];
    if (!mod) return;

    // Category Badge & Titles
    document.getElementById('chapterCategoryBadge').innerText = mod.category;
    document.getElementById('timestampText').innerText = mod.videoId;
    document.getElementById('chapterTitle').innerText = mod.title;
    document.getElementById('chapterDesc').innerText = mod.desc;

    // Update Bookmark & Complete Buttons
    updateBookmarkBtnUI(mod.id);
    updateCompletedBtnUI(mod.id);

    // Render Article Theory
    document.getElementById('articleBody').innerHTML = mod.theory;

    // Render Youtube Video
    kodelokaVideo(mod.videoId);

    // Render Snippet Buttons for Playground
    renderSnippetButtons(mod.sampleCommands);

    // Render Quiz
    renderQuiz(mod.quiz);

    // Render Notes
    document.getElementById('notesTextarea').value = state.notes[mod.id] || '';

    // Footer Nav Text
    document.getElementById('currentFooterProgress').innerText = `Modul ${index + 1} dari ${MODULES_DATA.length}`;

    // Scroll to top of main content
    document.querySelector('.main-content').scrollTop = 0;
}

// --- UI BUTTON HELPERS ---
function updateBookmarkBtnUI(modId) {
    const btn = document.getElementById('bookmarkBtn');
    const isBookmarked = state.bookmarks.includes(modId);
    btn.innerText = isBookmarked ? '⭐ Bookmarked' : '⭐ Bookmark';
    btn.style.borderColor = isBookmarked ? 'var(--accent-amber)' : 'var(--border-color)';
}

function updateCompletedBtnUI(modId) {
    const btn = document.getElementById('toggleCompletedBtn');
    const isCompleted = state.completedModules.includes(modId);
    btn.innerText = isCompleted ? '✅ Selesai' : '☑️ Tandai Selesai';
    btn.className = isCompleted ? 'btn btn-secondary' : 'btn btn-primary';
}

function toggleBookmark() {
    const modId = MODULES_DATA[state.activeModuleIndex].id;
    if (state.bookmarks.includes(modId)) {
        state.bookmarks = state.bookmarks.filter(id => id !== modId);
    } else {
        state.bookmarks.push(modId);
    }
    localStorage.setItem('microservices_bookmarks', JSON.stringify(state.bookmarks));
    updateBookmarkBtnUI(modId);
    renderSidebar();
}

function toggleCurrentCompleted() {
    const modId = MODULES_DATA[state.activeModuleIndex].id;
    if (state.completedModules.includes(modId)) {
        state.completedModules = state.completedModules.filter(id => id !== modId);
    } else {
        state.completedModules.push(modId);
    }
    localStorage.setItem('microservices_completed', JSON.stringify(state.completedModules));
    updateCompletedBtnUI(modId);
    updateProgressUI();
    renderSidebar();
}

function updateProgressUI() {
    const count = state.completedModules.length;
    const total = MODULES_DATA.length;
    const percent = Math.round((count / total) * 100);

    document.getElementById('progressBar').style.width = `${percent}%`;
    document.getElementById('progressText').innerText = `${count} / ${total} Selesai (${percent}%)`;
}

function resetAllProgress() {
    if (confirm("Apakah Anda yakin ingin menghapus seluruh progres belajar Microservices?")) {
        state.completedModules = [];
        state.bookmarks = [];
        localStorage.removeItem('microservices_completed');
        localStorage.removeItem('microservices_bookmarks');
        updateProgressUI();
        renderSidebar();
        updateCompletedBtnUI(MODULES_DATA[state.activeModuleIndex].id);
        updateBookmarkBtnUI(MODULES_DATA[state.activeModuleIndex].id);
    }
}

// --- TABS SWITCHING ---
function switchTab(tabName) {
    state.activeTab = tabName;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${tabName}`);
    });
}

// --- CATEGORY FILTERING ---
function filterCategory(category) {
    state.activeCategory = category;
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.toggle('active', pill.innerText.trim() === category || (category === 'ALL' && pill.innerText.trim() === 'Semua'));
    });
    renderSidebar();
}

// --- NAVIGATION PREV / NEXT ---
function navigatePrev() {
    if (state.activeModuleIndex > 0) {
        selectModule(state.activeModuleIndex - 1);
    }
}

function navigateNext() {
    if (state.activeModuleIndex < MODULES_DATA.length - 1) {
        selectModule(state.activeModuleIndex + 1);
    }
}

// --- PLAYGROUND / TERMINAL SIMULATOR ---
function renderSnippetButtons(commands) {
    const grid = document.getElementById('snippetButtonsGrid');
    grid.innerHTML = '';
    commands.forEach(cmd => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-secondary';
        btn.style.fontSize = '0.75rem';
        btn.style.padding = '4px 10px';
        btn.innerText = cmd;
        btn.onclick = () => {
            document.getElementById('terminalInput').value = cmd;
            executeTerminalCommand();
        };
        grid.appendChild(btn);
    });
}

function loadSampleCommands() {
    const mod = MODULES_DATA[state.activeModuleIndex];
    renderSnippetButtons(mod.sampleCommands);
}

function executeTerminalCommand() {
    const input = document.getElementById('terminalInput');
    const cmd = input.value.trim();
    if (!cmd) return;

    const output = document.getElementById('terminalOutput');

    // Add command line
    const cmdLine = document.createElement('div');
    cmdLine.className = 'term-line term-cmd';
    cmdLine.innerText = `gateway:8080> ${cmd}`;
    output.appendChild(cmdLine);

    // Simulate Command Output
    const resLine = document.createElement('div');
    resLine.className = 'term-line';

    const lower = cmd.toLowerCase();

    if (lower === 'help') {
        resLine.className = 'term-line term-info';
        resLine.innerText = "Perintah yang didukung: microservices status, eureka list, saga start, cqrs sync, kong health, vault get, clear";
    } else if (lower.startsWith('microservices status')) {
        resLine.className = 'term-line term-success';
        resLine.innerText = "CLUSTER STATUS:\n- API-Gateway         [UP] 10.0.0.1:8080\n- Order-Service       [UP] 10.0.1.15:8081 (DB: PostgreSQL)\n- Payment-Service     [UP] 10.0.1.16:8082 (DB: MySQL)\n- Inventory-Service   [UP] 10.0.1.17:8083 (DB: MongoDB)\n- Event-Broker        [UP] Kafka:9092";
    } else if (lower.startsWith('eureka') || lower.startsWith('consul')) {
        resLine.className = 'term-line term-info';
        resLine.innerText = "[SERVICE REGISTRY ACTIVE APPS]\nORDER-SERVICE -> 2 instances (10.0.1.15:8081, 10.0.1.20:8081)\nPAYMENT-SERVICE -> 1 instance (10.0.1.16:8082)\nNOTIFICATION-WORKER -> 3 instances";
    } else if (lower.startsWith('saga')) {
        resLine.className = 'term-line term-success';
        resLine.innerText = "[SAGA ORCHESTRATOR]\nStep 1: OrderCreated [SUCCESS]\nStep 2: ReserveStock [SUCCESS]\nStep 3: ProcessPayment [SUCCESS]\nTransaction Status: COMPLETED_SUCCESSFULLY";
    } else if (lower.startsWith('cqrs')) {
        resLine.className = 'term-line term-success';
        resLine.innerText = "[CQRS SYNCHRONIZER]\nEvent: OrderCreatedEvent -> Synced Write DB (Postgres) to Read DB (Elasticsearch) in 4ms.";
    } else if (lower.startsWith('vault')) {
        resLine.className = 'term-line term-warning';
        resLine.innerText = "[HASHICORP VAULT]\nKey: secret/data/db-credentials\nEncrypted: AES-256-GCM\nDecrypted: { username: 'app_prod', password: '***' }";
    } else if (lower === 'clear') {
        output.innerHTML = '';
        input.value = '';
        return;
    } else {
        resLine.className = 'term-line term-info';
        resLine.innerText = `[Executed Gateway Route] ${cmd} -> Status HTTP 200 OK (Latency: 12ms)`;
    }

    output.appendChild(resLine);
    output.scrollTop = output.scrollHeight;
    input.value = '';
}

function clearTerminalOutput() {
    document.getElementById('terminalOutput').innerHTML = '<div class="term-line term-info">Terminal cleared.</div>';
}

// --- QUIZ SYSTEM ---
function renderQuiz(quizList) {
    const container = document.getElementById('quizContainer');
    container.innerHTML = '<h3 style="margin-bottom: 20px; color: var(--accent-indigo);">🧪 Evaluation Quiz Modul Ini</h3>';

    quizList.forEach((q, qIndex) => {
        const card = document.createElement('div');
        card.className = 'quiz-card';

        let optionsHTML = '';
        q.options.forEach((opt, optIndex) => {
            optionsHTML += `
                <button class="quiz-option-btn" onclick="checkAnswer(this, ${qIndex}, ${optIndex}, ${q.answer})">
                    ${String.fromCharCode(65 + optIndex)}. ${opt}
                </button>
            `;
        });

        card.innerHTML = `
            <div class="quiz-question">${qIndex + 1}. ${q.question}</div>
            <div class="quiz-options">${optionsHTML}</div>
            <div class="quiz-explanation" id="quiz-exp-${qIndex}" style="display: none;">
                <strong>💡 Penjelasan:</strong> ${q.explanation}
            </div>
        `;
        container.appendChild(card);
    });
}

function checkAnswer(btn, qIndex, selectedIndex, correctIndex) {
    const parent = btn.parentElement;
    const buttons = parent.querySelectorAll('.quiz-option-btn');

    buttons.forEach((b, idx) => {
        b.disabled = true;
        if (idx === correctIndex) {
            b.classList.add('selected-correct');
        } else if (idx === selectedIndex) {
            b.classList.add('selected-wrong');
        }
    });

    const exp = document.getElementById(`quiz-exp-${qIndex}`);
    if (exp) exp.style.display = 'block';
}

// --- NOTES SAVING ---
function saveUserNote() {
    const modId = MODULES_DATA[state.activeModuleIndex].id;
    const text = document.getElementById('notesTextarea').value;
    state.notes[modId] = text;
    localStorage.setItem('microservices_notes', JSON.stringify(state.notes));

    const status = document.getElementById('saveNotesStatus');
    status.style.display = 'inline';
    setTimeout(() => {
        status.style.display = 'none';
    }, 2000);
}

// --- COPY CODE HELPER ---
function copyCode(btn) {
    const container = btn.closest('.code-container');
    const code = container.querySelector('code').innerText;
    navigator.clipboard.writeText(code).then(() => {
        btn.innerText = 'Copied!';
        setTimeout(() => btn.innerText = 'Copy', 2000);
    });
}

// --- FINAL EXAM MODAL ---
function openFinalExam() {
    const modal = document.getElementById('examModal');
    const body = document.getElementById('examModalBody');

    // Aggregate all 38 quiz questions
    let allQuestions = [];
    MODULES_DATA.forEach(m => {
        m.quiz.forEach(q => allQuestions.push({ ...q, moduleTitle: m.title }));
    });

    body.innerHTML = `
        <h2 style="color: var(--accent-indigo); margin-bottom: 8px;">🏆 Ujian Sertifikasi Microservices Architect</h2>
        <p style="color: var(--text-secondary); margin-bottom: 20px; font-size: 0.9rem;">
            Ujian ini terdiri dari ${allQuestions.length} pertanyaan pilihan ganda yang mencakup seluruh 24 modul video tutorial.
        </p>
        <div id="examQuestionsList"></div>
        <button class="btn btn-primary" onclick="submitExam()" style="margin-top: 20px; width: 100%; padding: 12px; background: linear-gradient(135deg, var(--accent-indigo), var(--accent-purple)); color: #fff; font-weight: 700;">
            📝 Selesaikan &amp; Hitung Nilai Sertifikat
        </button>
        <div id="examResult" style="margin-top: 20px;"></div>
    `;

    const qListContainer = document.getElementById('examQuestionsList');
    allQuestions.forEach((q, i) => {
        const item = document.createElement('div');
        item.style.marginBottom = '20px';
        item.style.padding = '14px';
        item.style.background = 'var(--bg-input)';
        item.style.borderRadius = '8px';

        let opts = '';
        q.options.forEach((opt, oIdx) => {
            opts += `
                <label style="display: block; margin-top: 6px; cursor: pointer; color: var(--text-primary); font-size: 0.85rem;">
                    <input type="radio" name="exam_q_${i}" value="${oIdx}"> ${String.fromCharCode(65 + oIdx)}. ${opt}
                </label>
            `;
        });

        item.innerHTML = `
            <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">${i + 1}. [${q.moduleTitle.split('.')[0]}] ${q.question}</div>
            <div>${opts}</div>
        `;
        qListContainer.appendChild(item);
    });

    modal.classList.add('active');
}

function closeFinalExam() {
    document.getElementById('examModal').classList.remove('active');
}

function submitExam() {
    let score = 0;
    let total = 0;
    MODULES_DATA.forEach(m => total += m.quiz.length);

    let qIndex = 0;
    MODULES_DATA.forEach(m => {
        m.quiz.forEach(q => {
            const selected = document.querySelector(`input[name="exam_q_${qIndex}"]:checked`);
            if (selected && parseInt(selected.value) === q.answer) {
                score++;
            }
            qIndex++;
        });
    });

    const percent = Math.round((score / total) * 100);
    const resultDiv = document.getElementById('examResult');

    const passed = percent >= 75;

    resultDiv.innerHTML = `
        <div style="padding: 20px; border-radius: 12px; background: ${passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; border: 1px solid ${passed ? 'var(--accent-green)' : 'var(--accent-red)'}; text-align: center;">
            <h3 style="color: ${passed ? 'var(--accent-green)' : 'var(--accent-red)'}; font-size: 1.4rem;">${passed ? '🎉 Selamat! Anda LULUS Sertifikasi Architect!' : '❌ Belum Lulus'}</h3>
            <p style="font-size: 1.1rem; font-weight: 700; margin: 10px 0;">Skor Anda: ${score} / ${total} (${percent}%)</p>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">${passed ? 'Anda telah menguasai Arsitektur Microservices, API Gateway, Saga Pattern, CQRS, Service Discovery, dan Centralized Config!' : 'Batas kelulusan adalah 75%. Silakan pelajari kembali modul-modul yang belum Anda kuasai.'}</p>
        </div>
    `;
}
