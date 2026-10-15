/* ==========================================================================
   APACHE KAFKA — Platform Pembelajaran Interaktif
   Bahasa Indonesia
   ========================================================================== */

const TOPIK_SLUG = "kafka";
const TOPIK_SUB  = "streaming event terdistribusi";

const MODUL = [
{
    id: 1,
    kategori: "1 · Fondasi",
    judul: "Kafka Itu Log, Bukan Antrean Pesan",
    tingkat: "Dasar", durasi: "14 mnt",
    tag: ["arsitektur", "log", "commit log", "broker", "konsep"],
    ringkas: "Hampir semua kesalahpahaman tentang Kafka berakar dari satu asumsi keliru: menganggapnya antrean seperti RabbitMQ. Kafka adalah log yang bisa diputar ulang.",
    isi: `
<h2>Perbedaan yang Menentukan Segalanya</h2>
<p>Pada antrean pesan tradisional, pesan yang sudah dikonsumsi akan <strong>hilang</strong>. Broker menyimpan status "siapa sudah mengambil apa", dan setelah semua konsumen menerima, pesan dibuang.</p>
<p>Kafka bekerja terbalik. Kafka menulis setiap pesan ke <strong>log append-only</strong> di disk, dan menyimpannya sampai kebijakan retensi menghapusnya — apakah ada yang membacanya atau tidak. Yang dilacak bukan pesan, melainkan <strong>posisi baca</strong> tiap konsumen.</p>

<pre>Partisi 0:
  offset:  0    1    2    3    4    5    6    7    8
         [ A ][ B ][ C ][ D ][ E ][ F ][ G ][ H ][ I ]  ← tulis di sini
                            ▲              ▲
                    grup-analitik    grup-notifikasi
                     (offset 3)        (offset 6)</pre>

<p>Dua grup konsumen membaca log yang sama pada kecepatan berbeda tanpa saling mengganggu. Menambah konsumen baru bulan depan tetap bisa membaca data bulan lalu — selama masih dalam masa retensi.</p>

<div class="callout info">
    <div class="callout-judul">💡 Konsekuensi praktisnya</div>
    <ul>
        <li><strong>Memutar ulang</strong> data itu normal: reset offset ke nol dan proses ulang seluruh riwayat setelah memperbaiki bug.</li>
        <li><strong>Satu sumber, banyak pemakai</strong>: tim analitik, layanan notifikasi, dan gudang data membaca topik yang sama tanpa duplikasi data.</li>
        <li><strong>Konsumen lambat tidak merusak sistem</strong>, hanya tertinggal — dan lag itu terukur.</li>
    </ul>
</div>

<h2>Anatomi Klaster</h2>
<table>
<thead><tr><th>Istilah</th><th>Artinya</th></tr></thead>
<tbody>
<tr><td><strong>Broker</strong></td><td>Satu server Kafka. Klaster produksi biasanya 3 atau lebih.</td></tr>
<tr><td><strong>Topik</strong></td><td>Nama logis untuk aliran data, misalnya <code>pesanan.dibuat</code>.</td></tr>
<tr><td><strong>Partisi</strong></td><td>Potongan fisik dari topik. Log sebenarnya ada di level partisi.</td></tr>
<tr><td><strong>Offset</strong></td><td>Nomor urut pesan <em>di dalam satu partisi</em>. Tidak pernah berubah.</td></tr>
<tr><td><strong>Produser</strong></td><td>Aplikasi yang menulis pesan.</td></tr>
<tr><td><strong>Konsumer</strong></td><td>Aplikasi yang membaca pesan.</td></tr>
<tr><td><strong>Consumer group</strong></td><td>Sekumpulan konsumen yang berbagi beban satu topik.</td></tr>
</tbody>
</table>

<h2>Kenapa Kafka Cepat</h2>
<p>Kafka menulis ke disk, tetapi tetap mampu menangani jutaan pesan per detik. Rahasianya bukan sihir, melainkan tiga hal:</p>
<ul>
    <li><strong>Penulisan berurutan.</strong> Append ke akhir berkas jauh lebih cepat daripada penulisan acak — bahkan pada SSD, dan sangat dramatis pada HDD.</li>
    <li><strong>Page cache sistem operasi.</strong> Kafka sengaja tidak membangun cache sendiri di dalam JVM; ia menyerahkannya pada page cache kernel. Konsumen yang membaca data baru hampir selalu dilayani dari memori.</li>
    <li><strong>Batching dan kompresi.</strong> Produser mengumpulkan pesan menjadi batch, mengompresnya sekali, dan broker menyimpan batch itu apa adanya tanpa membongkarnya.</li>
</ul>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Jangan beri heap JVM terlalu besar</div>
    <p>Godaan umum: server 64 GB, lalu heap Kafka disetel 32 GB. Ini justru memperlambat, karena memori yang seharusnya dipakai page cache jadi berkurang dan jeda garbage collection memanjang. Praktik yang lazim adalah <strong>heap 6–12 GB</strong>, sisanya biarkan menjadi page cache.</p>
</div>

<h2>Kapan Kafka Bukan Jawabannya</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 Kafka bukan pengganti untuk semua hal</div>
    <ul>
        <li><strong>Antrean tugas dengan prioritas dan retry per pesan</strong> — Kafka tidak punya prioritas pesan maupun redelivery selektif. RabbitMQ atau SQS lebih cocok.</li>
        <li><strong>Request/response sinkron</strong> — pakai HTTP atau gRPC.</li>
        <li><strong>Basis data</strong> — Kafka tidak bisa melakukan kueri sembarang. Log compaction bukan pengganti tabel.</li>
        <li><strong>Sistem kecil dengan lalu lintas rendah</strong> — biaya operasional klaster Kafka sering jauh melebihi manfaatnya bila hanya ada beberapa ribu pesan per hari.</li>
    </ul>
</div>`,
    perintah: [
        "kafka-topics.sh --bootstrap-server localhost:9092 --list",
        "kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic pesanan.dibuat",
        "kafka-console-producer.sh --bootstrap-server localhost:9092 --topic uji",
        "kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic uji --from-beginning",
        "kafka-broker-api-versions.sh --bootstrap-server localhost:9092"
    ],
    kuis: [
        {
            tanya: "Apa yang terjadi pada sebuah pesan di Kafka setelah semua konsumen membacanya?",
            opsi: [
                "Pesan langsung dihapus dari broker untuk menghemat disk",
                "Pesan tetap tersimpan sampai kebijakan retensi menghapusnya, karena Kafka hanya melacak posisi baca konsumen",
                "Pesan dipindahkan ke antrean arsip otomatis",
                "Pesan ditandai dibaca dan tidak bisa dibaca lagi oleh grup mana pun"
            ],
            benar: 1,
            penjelasan: "Kafka adalah log append-only. Konsumsi tidak menghapus apa pun — yang disimpan broker adalah offset tiap consumer group. Inilah yang memungkinkan replay data dan banyak konsumen independen membaca aliran yang sama."
        },
        {
            tanya: "Kenapa memberi heap JVM sangat besar pada broker Kafka justru merugikan?",
            opsi: [
                "Karena Kafka tidak bisa memakai memori lebih dari 4 GB",
                "Karena Kafka mengandalkan page cache sistem operasi untuk melayani pembacaan, sehingga heap besar mengurangi cache dan memperpanjang jeda GC",
                "Karena heap besar membuat replikasi antar broker gagal",
                "Karena Kafka menyimpan seluruh log di dalam heap"
            ],
            benar: 1,
            penjelasan: "Kafka sengaja tidak membangun cache aplikasi sendiri dan menyerahkan caching pada kernel. Memori yang diambil untuk heap adalah memori yang hilang dari page cache, sementara heap besar juga memperpanjang pause GC. Heap 6–12 GB umumnya cukup."
        }
    ]
},
{
    id: 2,
    kategori: "1 · Fondasi",
    judul: "Partisi, Kunci Pesan & Replikasi",
    tingkat: "Dasar", durasi: "16 mnt",
    tag: ["partisi", "key", "urutan", "replikasi", "isr", "leader"],
    ringkas: "Partisi menentukan paralelisme, kunci pesan menentukan urutan, dan replikasi menentukan apakah data Anda selamat. Ketiganya saling tarik-menarik.",
    isi: `
<h2>Partisi = Unit Paralelisme</h2>
<p>Sebuah topik dipecah menjadi beberapa partisi, dan tiap partisi adalah log terpisah yang bisa berada di broker berbeda.</p>

<pre>Topik "pesanan" dengan 3 partisi:

  P0 pada broker-1:  [ o1 ][ o4 ][ o7 ]
  P1 pada broker-2:  [ o2 ][ o5 ]
  P2 pada broker-3:  [ o3 ][ o6 ][ o8 ][ o9 ]</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Urutan HANYA dijamin di dalam satu partisi</div>
    <p>Tidak ada urutan global di seluruh topik. Bila Anda menulis <code>pesanan.dibuat</code> lalu <code>pesanan.dibayar</code> untuk pesanan yang sama tanpa kunci, keduanya bisa mendarat di partisi berbeda dan dikonsumsi terbalik. Bug semacam ini muncul secara acak dan sangat sulit dilacak.</p>
</div>

<h2>Kunci Pesan Mengunci Urutan</h2>
<p>Bila produser menyertakan kunci, Kafka menghitung <code>hash(kunci) % jumlah_partisi</code> sehingga semua pesan dengan kunci yang sama selalu masuk ke partisi yang sama — dan otomatis terurut relatif satu sama lain.</p>

<pre>kirim(topik="pesanan", kunci="pesanan-123", nilai=...)  → selalu P1
kirim(topik="pesanan", kunci="pesanan-124", nilai=...)  → mungkin P0

Semua peristiwa milik pesanan-123 terurut. Antar pesanan, tidak dijamin —
dan memang tidak perlu.</pre>

<p>Pilih kunci berdasarkan <strong>entitas yang urutannya penting</strong>: id pesanan, id pengguna, id perangkat, nomor rekening.</p>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Menambah partisi merusak pemetaan kunci</div>
    <p>Karena partisi ditentukan modulo jumlah partisi, menaikkan jumlah partisi dari 6 ke 12 membuat kunci yang sama mendarat di partisi berbeda. Pesan lama tetap di tempatnya, pesan baru pindah — sehingga <strong>jaminan urutan per kunci putus di titik perubahan</strong>. Kafka juga tidak mendukung pengurangan jumlah partisi sama sekali. Rencanakan jumlah partisi sejak awal dengan kelonggaran.</p>
</div>

<h2>Berapa Partisi yang Tepat?</h2>
<table>
<thead><tr><th>Pertimbangan</th><th>Arah</th></tr></thead>
<tbody>
<tr><td>Konsumen aktif maksimum dalam satu grup</td><td>Tidak boleh melebihi jumlah partisi — kelebihan konsumen akan menganggur</td></tr>
<tr><td>Throughput target</td><td>Ukur throughput satu partisi, lalu bagi target dengan angka itu</td></tr>
<tr><td>Waktu pemulihan saat broker mati</td><td>Terlalu banyak partisi memperlambat failover dan membebani controller</td></tr>
<tr><td>Beban berkas dan memori broker</td><td>Tiap partisi memakan file handle dan buffer</td></tr>
</tbody>
</table>
<p>Titik awal yang wajar untuk topik dengan lalu lintas sedang: <strong>6–12 partisi</strong>. Puluhan ribu partisi dalam satu klaster masih mungkin pada KRaft, tetapi bukan sesuatu yang perlu dikejar.</p>

<h2>Replikasi dan ISR</h2>
<p>Tiap partisi punya satu <strong>leader</strong> dan beberapa <strong>follower</strong>. Semua penulisan dan pembacaan default melalui leader; follower menyalin data secara asinkron.</p>

<pre>Partisi 0, replication.factor = 3
  broker-1: LEADER
  broker-2: follower  ← sinkron, masuk ISR
  broker-3: follower  ← tertinggal jauh, DIKELUARKAN dari ISR

ISR = In-Sync Replicas = replika yang cukup mengejar leader</pre>

<p>Kombinasi tiga setelan menentukan daya tahan data:</p>
<table>
<thead><tr><th>Setelan</th><th>Nilai produksi</th><th>Akibat</th></tr></thead>
<tbody>
<tr><td><code>replication.factor</code></td><td>3</td><td>Tahan kehilangan 1 broker tanpa kehilangan data</td></tr>
<tr><td><code>min.insync.replicas</code></td><td>2</td><td>Penulisan ditolak bila replika sinkron kurang dari 2</td></tr>
<tr><td><code>acks</code> (produser)</td><td>all</td><td>Commit dianggap sukses setelah semua ISR menerima</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 replication.factor 3 saja tidak cukup</div>
    <p>Bila <code>min.insync.replicas</code> dibiarkan 1, klaster tetap menerima tulisan meski hanya leader yang hidup. Ketika leader itu kemudian mati, data yang belum tersalin <strong>hilang permanen</strong>. Tiga replika tanpa <code>min.insync.replicas=2</code> memberi rasa aman yang palsu.</p>
    <p>Sebaliknya, <code>replication.factor=3</code> dengan <code>min.insync.replicas=3</code> berarti satu broker mati saja membuat topik berhenti menerima tulisan. Kombinasi <strong>3 dan 2</strong> adalah keseimbangan yang benar.</p>
</div>

<div class="callout bahaya">
    <div class="callout-judul">🚫 unclean.leader.election.enable</div>
    <p>Bila diaktifkan, replika yang tertinggal boleh diangkat menjadi leader saat tidak ada ISR yang tersedia. Klaster tetap melayani, tetapi <strong>pesan yang sudah di-commit bisa lenyap</strong>. Default modern adalah <code>false</code>, dan sebaiknya tetap begitu untuk data yang penting.</p>
</div>`,
    perintah: [
        "kafka-topics.sh --bootstrap-server localhost:9092 --create --topic pesanan --partitions 6 --replication-factor 3 --config min.insync.replicas=2",
        "kafka-topics.sh --bootstrap-server localhost:9092 --describe --topic pesanan",
        "kafka-topics.sh --bootstrap-server localhost:9092 --alter --topic pesanan --partitions 12",
        "kafka-topics.sh --bootstrap-server localhost:9092 --describe --under-replicated-partitions",
        "kafka-configs.sh --bootstrap-server localhost:9092 --entity-type topics --entity-name pesanan --describe"
    ],
    kuis: [
        {
            tanya: "Sebuah layanan menulis peristiwa 'dibuat' dan 'dibayar' untuk pesanan yang sama tanpa kunci pesan. Apa risikonya?",
            opsi: [
                "Tidak ada risiko, Kafka selalu menjaga urutan dalam satu topik",
                "Kedua peristiwa bisa masuk ke partisi berbeda dan dikonsumsi dengan urutan terbalik, karena urutan hanya dijamin di dalam satu partisi",
                "Pesan kedua akan menimpa pesan pertama",
                "Broker akan menolak pesan tanpa kunci"
            ],
            benar: 1,
            penjelasan: "Tanpa kunci, produser menyebar pesan ke seluruh partisi. Urutan di Kafka hanya berlaku per partisi, sehingga konsumen bisa memproses 'dibayar' sebelum 'dibuat'. Memberi kunci berupa id pesanan memastikan semua peristiwa milik pesanan itu berada di partisi yang sama dan terurut."
        },
        {
            tanya: "Kenapa replication.factor=3 dengan min.insync.replicas=1 berbahaya?",
            opsi: [
                "Karena replikasi jadi sangat lambat",
                "Karena penulisan tetap diterima meski hanya leader yang sinkron, sehingga data yang belum tersalin hilang bila leader itu mati",
                "Karena Kafka akan menolak membuat topik dengan konfigurasi tersebut",
                "Karena konsumen tidak bisa membaca dari follower"
            ],
            benar: 1,
            penjelasan: "min.insync.replicas menentukan jumlah minimum replika sinkron yang harus menerima tulisan sebelum dianggap berhasil. Dengan nilai 1, klaster menerima tulisan yang hanya ada di satu mesin — dan kegagalan mesin itu berarti kehilangan data permanen meski secara nominal ada tiga replika."
        }
    ]
},
{
    id: 3,
    kategori: "1 · Fondasi",
    judul: "KRaft: Kafka Tanpa ZooKeeper",
    tingkat: "Menengah", durasi: "13 mnt",
    tag: ["kraft", "zookeeper", "controller", "kafka 4", "metadata"],
    ringkas: "ZooKeeper sudah dihapus sepenuhnya di Kafka 4.0. Tutorial lama yang menyuruh Anda menjalankan ZooKeeper kini menyesatkan.",
    isi: `
<h2>Apa yang Berubah</h2>
<p>Selama satu dekade Kafka menyimpan metadata klaster — daftar topik, konfigurasi, keanggotaan broker, ACL — di ZooKeeper, sistem terpisah yang harus dijalankan dan dipelihara sendiri.</p>
<p><strong>KRaft</strong> (Kafka Raft) memindahkan metadata itu ke dalam Kafka sendiri, disimpan pada topik internal <code>__cluster_metadata</code> dan direplikasi memakai protokol konsensus Raft.</p>

<pre>DULU (Kafka 2.x/3.x mode lama)     SEKARANG (KRaft)
  ┌────────────┐                    ┌────────────────────┐
  │ ZooKeeper  │ ← 3 node terpisah  │ Kafka controller   │
  └─────┬──────┘                    │ quorum (3 node)    │
        │                           └─────────┬──────────┘
  ┌─────┴──────┐                              │
  │  Broker    │                        ┌─────┴──────┐
  └────────────┘                        │  Broker    │
                                        └────────────┘
  Dua sistem, dua model operasi     Satu sistem, satu biner</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Jangan ikuti tutorial yang memakai zookeeper.connect</div>
    <p>Mode ZooKeeper sudah <strong>dihapus di Kafka 4.0</strong> — bukan sekadar deprecated. Perintah lama seperti <code>--zookeeper localhost:2181</code> pada <code>kafka-topics.sh</code> juga sudah lama hilang; semuanya kini memakai <code>--bootstrap-server</code>. Bila panduan yang Anda ikuti menjalankan <code>zookeeper-server-start.sh</code>, panduan itu sudah usang.</p>
</div>

<h2>Peran Baru: Controller dan Broker</h2>
<p>Pada KRaft, tiap node punya <code>process.roles</code>:</p>
<table>
<thead><tr><th>Peran</th><th>Tugas</th><th>Dipakai kapan</th></tr></thead>
<tbody>
<tr><td><code>controller</code></td><td>Anggota quorum metadata, memilih leader partisi</td><td>Produksi: 3 node khusus</td></tr>
<tr><td><code>broker</code></td><td>Menyimpan dan melayani data topik</td><td>Produksi: sebanyak yang dibutuhkan</td></tr>
<tr><td><code>broker,controller</code></td><td>Keduanya sekaligus (mode gabungan)</td><td>Pengembangan lokal, klaster kecil</td></tr>
</tbody>
</table>

<h2>Konfigurasi Minimal KRaft</h2>
<pre>process.roles=broker,controller
node.id=1
controller.quorum.voters=1@host1:9093,2@host2:9093,3@host3:9093

listeners=PLAINTEXT://:9092,CONTROLLER://:9093
inter.broker.listener.name=PLAINTEXT
controller.listener.names=CONTROLLER

log.dirs=/var/lib/kafka/data</pre>

<p>Sebelum broker pertama kali dijalankan, direktori penyimpanan harus diformat dengan sebuah cluster id:</p>
<pre>KAFKA_CLUSTER_ID=$(kafka-storage.sh random-uuid)
kafka-storage.sh format -t $KAFKA_CLUSTER_ID -c server.properties</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Semua node harus memakai cluster id yang sama</div>
    <p>Jalankan <code>random-uuid</code> <strong>sekali saja</strong>, lalu pakai nilai itu untuk memformat setiap node. Memformat tiap node dengan id berbeda menghasilkan node yang menolak bergabung, dengan pesan galat yang tidak langsung menunjuk penyebabnya.</p>
</div>

<h2>Kenapa Ini Lebih Baik</h2>
<ul>
    <li><strong>Satu sistem untuk dioperasikan</strong> — satu biner, satu model keamanan, satu tempat memantau.</li>
    <li><strong>Pemulihan controller jauh lebih cepat</strong> — metadata sudah ada di memori tiap controller, tidak perlu dimuat ulang dari ZooKeeper.</li>
    <li><strong>Skala partisi jauh lebih besar</strong> — jutaan partisi per klaster menjadi realistis.</li>
    <li><strong>Startup lebih ringkas</strong> — penting untuk klaster di Kubernetes yang sering dijadwal ulang.</li>
</ul>

<div class="callout info">
    <div class="callout-judul">💡 Untuk pengembangan lokal</div>
    <p>Kafka modern bisa dijalankan sebagai <strong>satu kontainer tunggal</strong> tanpa ZooKeeper. Image <code>apache/kafka</code> resmi sudah memakai KRaft secara default dan siap pakai untuk pengembangan hanya dengan menyetel beberapa variabel lingkungan.</p>
</div>`,
    perintah: [
        "kafka-storage.sh random-uuid",
        "kafka-storage.sh format -t <cluster-id> -c /etc/kafka/server.properties",
        "kafka-server-start.sh /etc/kafka/server.properties",
        "kafka-metadata-quorum.sh --bootstrap-server localhost:9092 describe --status",
        "kafka-metadata-quorum.sh --bootstrap-server localhost:9092 describe --replication"
    ],
    kuis: [
        {
            tanya: "Anda menemukan panduan instalasi yang dimulai dengan menjalankan zookeeper-server-start.sh. Apa yang harus disimpulkan?",
            opsi: [
                "Panduan itu benar, ZooKeeper masih wajib untuk Kafka",
                "Panduan itu usang — mode ZooKeeper sudah dihapus sepenuhnya di Kafka 4.0 dan digantikan KRaft",
                "ZooKeeper hanya dibutuhkan untuk klaster dengan lebih dari 3 broker",
                "ZooKeeper opsional dan hanya memengaruhi performa"
            ],
            benar: 1,
            penjelasan: "Kafka 4.0 menghapus mode ZooKeeper, bukan sekadar menandainya deprecated. Metadata klaster kini disimpan di dalam Kafka sendiri melalui protokol Raft, dijalankan oleh controller quorum. Panduan yang masih menjalankan ZooKeeper mengacu pada versi lama."
        },
        {
            tanya: "Apa akibat memformat setiap node KRaft dengan cluster id hasil random-uuid yang berbeda-beda?",
            opsi: [
                "Tidak apa-apa, id akan disinkronkan otomatis saat node saling terhubung",
                "Node akan menolak membentuk satu klaster karena identitas klasternya berbeda",
                "Kafka akan membuat tiga klaster terpisah yang tetap saling mereplikasi",
                "Hanya memengaruhi tampilan pada perintah describe"
            ],
            benar: 1,
            penjelasan: "Cluster id adalah identitas klaster yang harus sama di semua node. random-uuid dijalankan sekali, lalu nilainya dipakai untuk memformat seluruh node. Id yang berbeda membuat node saling menolak dengan galat yang penyebabnya tidak selalu jelas dari pesan yang muncul."
        }
    ]
},
{
    id: 4,
    kategori: "2 · Produksi & Konsumsi",
    judul: "Produser: acks, Idempotensi, Batching & Kompresi",
    tingkat: "Menengah", durasi: "16 mnt",
    tag: ["produser", "acks", "idempotence", "batch", "kompresi", "retry"],
    ringkas: "Setelan default produser dulu mengutamakan kecepatan. Sejak Kafka 3.0 default sudah aman — tetapi banyak konfigurasi warisan yang masih beredar dan berbahaya.",
    isi: `
<h2>acks Menentukan Apa Arti "Terkirim"</h2>
<table>
<thead><tr><th>acks</th><th>Kapan dianggap sukses</th><th>Risiko</th></tr></thead>
<tbody>
<tr><td><code>0</code></td><td>Begitu pesan keluar dari soket</td><td>Pesan hilang tanpa jejak bila broker mati atau menolak</td></tr>
<tr><td><code>1</code></td><td>Leader sudah menulis ke log-nya</td><td>Hilang bila leader mati sebelum follower menyalin</td></tr>
<tr><td><code>all</code></td><td>Semua replika sinkron sudah menerima</td><td>Latensi sedikit lebih tinggi — dan ini harga yang pantas</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 acks=0 bukan "optimasi"</div>
    <p>Dengan <code>acks=0</code> produser tidak pernah tahu apakah pesan sampai. Tidak ada retry, tidak ada galat, tidak ada metrik kegagalan — pesan hanya lenyap. Ini hanya dapat diterima untuk data yang benar-benar boleh hilang seperti metrik sampling. Untuk apa pun yang berkaitan dengan transaksi, uang, atau status pengguna, gunakan <code>acks=all</code>.</p>
</div>

<h2>Idempotensi Menghapus Duplikat Akibat Retry</h2>
<p>Bayangkan produser mengirim pesan, broker menulisnya, lalu jaringan putus sebelum balasan sampai. Produser mencoba lagi — dan pesan yang sama tertulis dua kali.</p>
<p><code>enable.idempotence=true</code> membuat produser menyertakan producer id dan nomor urut, sehingga broker mengenali dan membuang duplikat.</p>

<pre>enable.idempotence=true   ← default sejak Kafka 3.0
  ↳ memaksa acks=all
  ↳ memaksa retries besar
  ↳ memaksa max.in.flight.requests.per.connection <= 5</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Konfigurasi warisan bisa mematikan idempotensi diam-diam</div>
    <p>Menyetel <code>acks=1</code> atau <code>max.in.flight.requests.per.connection=10</code> pada klien modern membuat produser <strong>gagal start</strong> atau menonaktifkan idempotensi, tergantung versi. Banyak berkas konfigurasi lama yang disalin dari internet mengandung nilai-nilai ini. Periksa konfigurasi Anda dan hapus setelan warisan alih-alih menambahkannya.</p>
</div>

<h2>Batching: Sedikit Menunggu, Jauh Lebih Cepat</h2>
<p>Produser tidak mengirim pesan satu per satu. Ia mengumpulkannya per partisi sampai batch penuh atau waktu tunggu habis.</p>

<table>
<thead><tr><th>Setelan</th><th>Default</th><th>Arti</th></tr></thead>
<tbody>
<tr><td><code>batch.size</code></td><td>16 KB</td><td>Ukuran batch maksimum per partisi</td></tr>
<tr><td><code>linger.ms</code></td><td>0</td><td>Berapa lama menunggu batch terisi sebelum kirim</td></tr>
<tr><td><code>compression.type</code></td><td>none</td><td>Kompresi diterapkan per batch</td></tr>
<tr><td><code>buffer.memory</code></td><td>32 MB</td><td>Total buffer produser sebelum blocking</td></tr>
</tbody>
</table>

<div class="callout info">
    <div class="callout-judul">💡 linger.ms = 5 sering merupakan kemenangan gratis</div>
    <p>Dengan <code>linger.ms=0</code>, produser mengirim segera dan batch sering hanya berisi satu pesan — kompresi jadi tidak efektif dan overhead permintaan jaringan tinggi. Menunggu <strong>5–20 milidetik</strong> biasanya melipatgandakan throughput dan menurunkan pemakaian CPU broker, dengan tambahan latensi yang tidak terasa untuk hampir semua aplikasi.</p>
</div>

<h2>Memilih Kompresi</h2>
<table>
<thead><tr><th>Tipe</th><th>Rasio</th><th>CPU</th><th>Catatan</th></tr></thead>
<tbody>
<tr><td><code>lz4</code></td><td>Sedang</td><td>Sangat rendah</td><td>Pilihan aman untuk latensi rendah</td></tr>
<tr><td><code>zstd</code></td><td>Terbaik</td><td>Rendah–sedang</td><td>Pilihan default modern; hemat disk dan bandwidth</td></tr>
<tr><td><code>snappy</code></td><td>Sedang</td><td>Rendah</td><td>Warisan, masih baik</td></tr>
<tr><td><code>gzip</code></td><td>Baik</td><td>Tinggi</td><td>Hindari — CPU-nya mahal</td></tr>
</tbody>
</table>

<h2>Menangani Kegagalan dengan Benar</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 Mengabaikan hasil pengiriman asinkron</div>
    <p>Metode <code>send()</code> bersifat asinkron dan mengembalikan future. Kode yang memanggilnya tanpa callback maupun penanganan galat akan <strong>kehilangan pesan tanpa satu pun baris log</strong>. Selalu sediakan callback yang mencatat galat, atau tangani exception dari future.</p>
</div>

<pre># Python (confluent-kafka)
def laporan(err, msg):
    if err is not None:
        log.error("gagal kirim: %s", err)   # WAJIB ada
    else:
        log.debug("terkirim ke %s [%d]", msg.topic(), msg.partition())

produser.produce("pesanan", key=b"pesanan-123", value=data, callback=laporan)
produser.flush()   # sebelum aplikasi berhenti</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Selalu panggil flush() atau close() saat aplikasi berhenti</div>
    <p>Pesan yang masih berada di buffer produser <strong>belum terkirim</strong>. Proses yang dimatikan tanpa flush kehilangan seluruh isi buffer. Pasang penanganan sinyal shutdown yang memanggil flush dengan batas waktu wajar.</p>
</div>`,
    perintah: [
        "kafka-producer-perf-test.sh --topic uji --num-records 100000 --record-size 512 --throughput -1 --producer-props bootstrap.servers=localhost:9092 acks=all compression.type=zstd linger.ms=10",
        "kafka-console-producer.sh --bootstrap-server localhost:9092 --topic pesanan --property parse.key=true --property key.separator=:",
        "kafka-configs.sh --bootstrap-server localhost:9092 --entity-type brokers --entity-name 1 --describe",
        "kafka-run-class.sh kafka.tools.GetOffsetShell --bootstrap-server localhost:9092 --topic pesanan"
    ],
    kuis: [
        {
            tanya: "Apa yang dijamin oleh enable.idempotence=true pada produser?",
            opsi: [
                "Pesan tidak akan pernah hilang meski seluruh klaster mati",
                "Retry akibat kegagalan jaringan tidak menghasilkan duplikat, karena broker mengenali producer id dan nomor urut pesan",
                "Konsumen tidak akan pernah memproses pesan yang sama dua kali",
                "Pesan otomatis terurut secara global di seluruh partisi"
            ],
            benar: 1,
            penjelasan: "Idempotensi produser menyelesaikan duplikat yang lahir dari retry: broker menolak pesan dengan nomor urut yang sudah pernah diterima dari producer id tersebut. Ini tidak menjamin konsumen memproses sekali — itu urusan semantik pengiriman dan idempotensi di sisi konsumen."
        },
        {
            tanya: "Kenapa linger.ms=0 sering merugikan throughput?",
            opsi: [
                "Karena produser menunggu terlalu lama sebelum mengirim",
                "Karena batch sering hanya berisi satu pesan, sehingga kompresi tidak efektif dan overhead permintaan jaringan menjadi tinggi",
                "Karena broker menolak batch berukuran kecil",
                "Karena idempotensi tidak aktif saat linger.ms bernilai nol"
            ],
            benar: 1,
            penjelasan: "linger.ms adalah waktu produser bersedia menunggu agar batch terisi. Nilai nol berarti kirim segera, sehingga tiap pesan hampir menjadi satu permintaan tersendiri. Menunggu 5–20 ms mengumpulkan lebih banyak pesan per batch, membuat kompresi jauh lebih efektif dan menurunkan jumlah permintaan."
        }
    ]
},
{
    id: 5,
    kategori: "2 · Produksi & Konsumsi",
    judul: "Consumer Group, Rebalancing & Commit Offset",
    tingkat: "Menengah", durasi: "18 mnt",
    tag: ["konsumer", "consumer group", "rebalance", "offset", "commit", "poll"],
    ringkas: "Sebagian besar insiden Kafka di produksi berakar di sisi konsumen: rebalance yang tak berhenti, offset yang salah di-commit, dan pesan yang diproses dua kali.",
    isi: `
<h2>Cara Kerja Consumer Group</h2>
<p>Konsumen yang memakai <code>group.id</code> sama membentuk satu grup. Kafka membagi partisi di antara mereka, dan <strong>satu partisi hanya boleh dipegang oleh satu konsumen dalam grup itu</strong>.</p>

<pre>Topik 6 partisi, grup "layanan-notifikasi":

  2 konsumen  → masing-masing 3 partisi
  6 konsumen  → masing-masing 1 partisi   ← paralelisme maksimum
  8 konsumen  → 6 bekerja, 2 MENGANGGUR   ← partisi habis</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Menambah pod tidak selalu menambah kapasitas</div>
    <p>Bila jumlah konsumen sudah sama dengan jumlah partisi, menaikkan replika lagi tidak menambah throughput sedikit pun — pod tambahan hanya duduk menganggur menunggu partisi yang tak akan datang. Skala konsumen dibatasi oleh jumlah partisi, dan menambah partisi punya konsekuensi tersendiri pada urutan kunci.</p>
</div>

<h2>Rebalance: Saat Keanggotaan Berubah</h2>
<p>Rebalance terjadi ketika konsumen bergabung, keluar, dianggap mati, atau saat metadata topik berubah. Selama rebalance model lama (eager), <strong>seluruh grup berhenti memproses</strong>.</p>

<table>
<thead><tr><th>Strategi</th><th>Perilaku</th></tr></thead>
<tbody>
<tr><td><code>RangeAssignor</code></td><td>Warisan; pembagian sering tidak merata</td></tr>
<tr><td><code>CooperativeStickyAssignor</code></td><td>Hanya partisi yang berpindah yang dilepas — sisanya terus bekerja</td></tr>
<tr><td>Protokol grup baru (KIP-848)</td><td>Koordinasi dipindahkan ke broker; rebalance jauh lebih ringan dan tanpa jeda global</td></tr>
</tbody>
</table>

<div class="callout info">
    <div class="callout-judul">💡 Pakai cooperative sticky</div>
    <p>Pada klien modern, <code>partition.assignment.strategy=org.apache.kafka.clients.consumer.CooperativeStickyAssignor</code> menghilangkan jeda "stop the world" pada tiap rebalance. Kafka 4.x juga membawa protokol consumer group generasi baru yang memindahkan logika penugasan ke broker — arah yang sama, dilakukan lebih menyeluruh.</p>
</div>

<h2>Penyebab Rebalance yang Tak Berhenti</h2>
<p>Ini pola kegagalan paling umum: konsumen terus-menerus dianggap mati, grup terus rebalance, dan lag naik tanpa henti walau CPU rendah.</p>

<table>
<thead><tr><th>Setelan</th><th>Default</th><th>Fungsi</th></tr></thead>
<tbody>
<tr><td><code>max.poll.interval.ms</code></td><td>5 menit</td><td>Batas waktu antar panggilan poll — melampaui ini berarti dikeluarkan dari grup</td></tr>
<tr><td><code>max.poll.records</code></td><td>500</td><td>Jumlah pesan maksimum per poll</td></tr>
<tr><td><code>session.timeout.ms</code></td><td>45 detik</td><td>Batas waktu heartbeat sebelum dianggap mati</td></tr>
<tr><td><code>heartbeat.interval.ms</code></td><td>3 detik</td><td>Frekuensi heartbeat</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Pemrosesan lambat memicu rebalance berantai</div>
    <p>Bila memproses 500 pesan butuh lebih dari <code>max.poll.interval.ms</code>, konsumen dikeluarkan dari grup di tengah pekerjaan. Partisinya dipindahkan, konsumen itu kembali, grup rebalance lagi — dan siklus berulang. Gejalanya khas: <strong>lag terus naik padahal konsumen tampak sibuk dan tidak ada galat</strong>.</p>
    <p>Perbaikannya: turunkan <code>max.poll.records</code> agar tiap batch selesai cepat, naikkan <code>max.poll.interval.ms</code> bila pemrosesan memang lama, atau pindahkan pekerjaan berat ke worker terpisah agar loop poll tetap responsif.</p>
</div>

<h2>Commit Offset: Sumber Duplikat dan Kehilangan</h2>
<p>Offset yang di-commit menandai "sudah saya proses sampai sini". Kesalahan menempatkan commit menghasilkan dua bug klasik:</p>

<pre>SALAH — commit sebelum memproses (berpotensi kehilangan pesan)
  pesan = poll()
  commit()          ← offset maju
  proses(pesan)     ← aplikasi mati di sini → pesan tidak pernah diproses

BENAR — commit sesudah memproses (at-least-once)
  pesan = poll()
  proses(pesan)
  commit()          ← aplikasi mati sebelum ini → pesan diproses ulang</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ enable.auto.commit=true menyembunyikan masalah</div>
    <p>Auto-commit menyimpan offset secara berkala di latar belakang, tanpa tahu apakah pemrosesan Anda benar-benar selesai. Bila aplikasi mati setelah offset ter-commit tetapi sebelum pemrosesan tuntas, pesan itu <strong>hilang secara diam-diam</strong>. Untuk pemrosesan yang penting, matikan auto-commit dan commit secara eksplisit setelah pekerjaan selesai.</p>
</div>

<div class="callout info">
    <div class="callout-judul">💡 At-least-once adalah default yang sehat</div>
    <p>Commit setelah memproses berarti pesan bisa diproses lebih dari sekali saat terjadi crash. Ini hampir selalu pilihan yang benar, asalkan pemrosesan Anda <strong>idempoten</strong> — dibahas tuntas pada modul pola produksi.</p>
</div>

<h2>Membaca dari Mana Saat Grup Baru</h2>
<pre>auto.offset.reset=latest    ← default: hanya pesan baru
auto.offset.reset=earliest  ← dari awal log yang masih ada
auto.offset.reset=none      ← lempar galat bila tidak ada offset tersimpan</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Salah ketik group.id berarti mulai dari nol</div>
    <p>Karena offset disimpan per <code>group.id</code>, salah ketik satu huruf membuat Kafka menganggapnya grup yang belum pernah ada. Dengan <code>earliest</code>, konsumen akan memproses <strong>seluruh riwayat topik</strong> — kejutan yang mahal pada topik berukuran terabyte.</p>
</div>`,
    perintah: [
        "kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list",
        "kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group layanan-notifikasi --describe",
        "kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group layanan-notifikasi --reset-offsets --to-earliest --topic pesanan --execute",
        "kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group layanan-notifikasi --reset-offsets --to-datetime 2026-07-01T00:00:00.000 --topic pesanan --dry-run",
        "kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group layanan-notifikasi --delete"
    ],
    kuis: [
        {
            tanya: "Sebuah topik punya 6 partisi dan grup konsumennya dinaikkan menjadi 10 pod. Apa yang terjadi?",
            opsi: [
                "Throughput naik sekitar 67% karena beban dibagi lebih halus",
                "Enam pod memegang satu partisi masing-masing dan empat pod menganggur, karena satu partisi hanya boleh dipegang satu konsumen dalam grup",
                "Kafka otomatis menambah partisi agar semua pod kebagian",
                "Grup gagal terbentuk karena jumlah konsumen melebihi partisi"
            ],
            benar: 1,
            penjelasan: "Paralelisme konsumsi dibatasi jumlah partisi. Setelah tiap partisi punya satu konsumen, pod tambahan hanya menunggu tanpa pekerjaan. Menaikkan kapasitas berarti menambah partisi — dengan konsekuensi pada pemetaan kunci dan jaminan urutan."
        },
        {
            tanya: "Lag konsumen terus naik, CPU rendah, dan log menunjukkan grup rebalance berulang-ulang. Penyebab yang paling mungkin?",
            opsi: [
                "Produser mengirim terlalu cepat sehingga broker kehabisan disk",
                "Pemrosesan satu batch melebihi max.poll.interval.ms, sehingga konsumen dikeluarkan dari grup lalu bergabung lagi berulang kali",
                "Jumlah partisi terlalu banyak untuk broker",
                "Kompresi zstd membebani konsumen"
            ],
            benar: 1,
            penjelasan: "Bila jarak antar panggilan poll melampaui max.poll.interval.ms, koordinator menganggap konsumen mati dan memicu rebalance. Konsumen itu kembali, memicu rebalance lagi, dan grup lebih banyak menghabiskan waktu untuk rebalance daripada memproses. Solusinya menurunkan max.poll.records atau memindahkan pekerjaan berat keluar dari loop poll."
        }
    ]
},
{
    id: 6,
    kategori: "2 · Produksi & Konsumsi",
    judul: "Semantik Pengiriman & Transaksi Exactly-Once",
    tingkat: "Lanjut", durasi: "15 mnt",
    tag: ["exactly-once", "transaksi", "at-least-once", "eos", "isolation level"],
    ringkas: "Exactly-once di Kafka itu nyata, tetapi cakupannya jauh lebih sempit daripada yang dibayangkan kebanyakan orang.",
    isi: `
<h2>Tiga Semantik</h2>
<table>
<thead><tr><th>Semantik</th><th>Artinya</th><th>Cara mencapainya</th></tr></thead>
<tbody>
<tr><td><strong>At-most-once</strong></td><td>Boleh hilang, tidak boleh dobel</td><td>Commit offset sebelum memproses</td></tr>
<tr><td><strong>At-least-once</strong></td><td>Tidak boleh hilang, boleh dobel</td><td>Commit offset sesudah memproses — default yang sehat</td></tr>
<tr><td><strong>Exactly-once</strong></td><td>Tepat sekali</td><td>Transaksi Kafka, atau at-least-once + pemrosesan idempoten</td></tr>
</tbody>
</table>

<h2>Apa yang Sebenarnya Dijamin Transaksi Kafka</h2>
<p>Transaksi Kafka membuat rangkaian <strong>baca dari Kafka → proses → tulis ke Kafka → commit offset</strong> menjadi satu operasi atomik. Semuanya berhasil, atau semuanya dibatalkan.</p>

<pre>produser.initTransactions()

produser.beginTransaction()
    produser.send(topik_keluaran, hasil1)
    produser.send(topik_keluaran, hasil2)
    produser.sendOffsetsToTransaction(offset, metadataGrup)  ← kuncinya di sini
produser.commitTransaction()</pre>

<p>Offset konsumen di-commit <strong>di dalam transaksi yang sama</strong> dengan penulisan hasil. Karena itu tidak mungkin hasil tertulis tanpa offset maju, atau sebaliknya.</p>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Exactly-once tidak berlaku ke luar Kafka</div>
    <p>Batas jaminannya adalah Kafka itu sendiri. Bila pemrosesan Anda <strong>menulis ke PostgreSQL, memanggil API pembayaran, atau mengirim email</strong>, transaksi Kafka tidak dapat membatalkan efek samping tersebut. Aplikasi bisa crash setelah email terkirim tetapi sebelum transaksi di-commit, dan email itu akan terkirim lagi saat pesan diproses ulang.</p>
    <p>Untuk efek samping di luar Kafka, jawabannya bukan transaksi Kafka melainkan <strong>pemrosesan idempoten</strong>: kunci deduplikasi, upsert, atau tabel pesan-terproses.</p>
</div>

<h2>Sisi Konsumen: isolation.level</h2>
<pre>isolation.level=read_uncommitted   ← default: pesan transaksi terlihat sebelum commit
isolation.level=read_committed     ← hanya pesan dari transaksi yang sudah di-commit</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Transaksi tanpa read_committed tidak ada gunanya</div>
    <p>Produser transaksional yang rapi menjadi sia-sia bila konsumen hilirnya memakai default <code>read_uncommitted</code> — konsumen itu tetap membaca pesan dari transaksi yang kemudian dibatalkan. Kedua sisi harus dikonfigurasi bersama.</p>
</div>

<h2>Biayanya</h2>
<ul>
    <li><strong>Latensi bertambah</strong> — konsumen <code>read_committed</code> hanya boleh membaca sampai batas transaksi yang stabil, sehingga pesan tertahan sampai transaksi ditutup.</li>
    <li><strong>Throughput turun</strong> — tiap transaksi menambah penulisan marker dan koordinasi.</li>
    <li><strong>Kompleksitas naik</strong> — <code>transactional.id</code> harus stabil dan unik per instans produser, termasuk setelah restart dan penjadwalan ulang pod.</li>
</ul>

<div class="callout info">
    <div class="callout-judul">💡 Kapan transaksi benar-benar tepat</div>
    <p>Transaksi Kafka bersinar pada alur <strong>Kafka ke Kafka</strong>: agregasi, penggabungan aliran, pengayaan data. Kafka Streams bahkan mengaktifkannya cukup dengan <code>processing.guarantee=exactly_once_v2</code>. Untuk alur yang berujung pada basis data atau API eksternal, rancang idempotensi — itu lebih sederhana dan lebih jujur.</p>
</div>

<h2>Pola Praktis yang Sering Lebih Baik</h2>
<pre>At-least-once + kunci deduplikasi di basis data:

  INSERT INTO pesanan_terproses (id_pesan, diproses_pada)
  VALUES ('evt-abc-123', now())
  ON CONFLICT (id_pesan) DO NOTHING
  RETURNING id_pesan;

  -- tidak ada baris kembali → pesan sudah pernah diproses, lewati</pre>
<p>Pola ini bekerja lintas sistem, mudah dipahami saat insiden, dan tidak menuntut koordinasi khusus dari Kafka.</p>`,
    perintah: [
        "kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic keluaran --isolation-level read_committed --from-beginning",
        "kafka-transactions.sh --bootstrap-server localhost:9092 list",
        "kafka-transactions.sh --bootstrap-server localhost:9092 describe --transactional-id layanan-agregasi-1",
        "kafka-transactions.sh --bootstrap-server localhost:9092 find-hanging --broker-id 1"
    ],
    kuis: [
        {
            tanya: "Alur pemrosesan membaca dari Kafka lalu memanggil API pembayaran eksternal. Apakah transaksi Kafka menjamin panggilan itu terjadi tepat sekali?",
            opsi: [
                "Ya, transaksi Kafka membungkus seluruh pemrosesan termasuk panggilan eksternal",
                "Tidak — jaminan atomik hanya berlaku untuk penulisan ke Kafka dan commit offset; efek samping eksternal tetap bisa terulang saat pesan diproses ulang",
                "Ya, asalkan isolation.level disetel read_committed",
                "Tidak, dan tidak ada cara apa pun untuk menghindari panggilan ganda"
            ],
            benar: 1,
            penjelasan: "Transaksi Kafka atomik terhadap Kafka saja. Panggilan API yang sudah terjadi tidak bisa dibatalkan oleh abortTransaction. Untuk efek samping eksternal, jawabannya adalah idempotensi: kunci deduplikasi, upsert, atau kunci idempotensi yang didukung API tujuan."
        },
        {
            tanya: "Kenapa konsumen hilir harus memakai isolation.level=read_committed saat hulunya transaksional?",
            opsi: [
                "Agar konsumen bisa membaca lebih cepat",
                "Karena default read_uncommitted membuat konsumen tetap membaca pesan dari transaksi yang mungkin dibatalkan, sehingga jaminan transaksi hilang",
                "Karena tanpa itu offset tidak akan tersimpan",
                "Karena read_committed diperlukan untuk mengaktifkan kompresi"
            ],
            benar: 1,
            penjelasan: "Pesan transaksional tetap ditulis ke log sebelum commit. Konsumen read_uncommitted akan melihatnya apa pun hasil akhirnya, termasuk transaksi yang dibatalkan. Jaminan exactly-once hanya utuh bila kedua sisi dikonfigurasi."
        }
    ]
},
{
    id: 7,
    kategori: "3 · Data & Skema",
    judul: "Serialisasi, Schema Registry & Evolusi Skema",
    tingkat: "Menengah", durasi: "15 mnt",
    tag: ["avro", "protobuf", "json schema", "schema registry", "evolusi", "kompatibilitas"],
    ringkas: "Topik Kafka hidup bertahun-tahun dan dibaca banyak tim. Tanpa kontrak skema, satu perubahan kecil di produser bisa merusak konsumen yang bahkan tidak Anda ketahui keberadaannya.",
    isi: `
<h2>Masalah dengan JSON Polos</h2>
<p>Kafka sendiri tidak peduli isi pesan — bagi broker, nilai pesan hanyalah deretan byte. Kebebasan ini nyaman di awal dan mahal kemudian.</p>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Skema implisit adalah utang yang menagih di produksi</div>
    <ul>
        <li>Produser mengganti nama field <code>harga</code> menjadi <code>total_harga</code>. Tiga konsumen rusak — dua di antaranya milik tim lain.</li>
        <li>Tidak ada yang tahu bentuk pesan tanpa membaca kode produser atau menebak dari sampel.</li>
        <li>JSON mengulang nama field di setiap pesan, memboroskan disk dan bandwidth.</li>
        <li>Data lama di topik memakai bentuk lama, dan konsumen harus menebak versinya.</li>
    </ul>
</div>

<h2>Schema Registry</h2>
<p>Schema Registry menyimpan skema secara terpusat dan memberinya id. Pesan yang dikirim hanya membawa <strong>id skema</strong>, bukan seluruh definisinya.</p>

<pre>Byte pesan (format wire Confluent):
  [ 0x00 ][ id skema 4 byte ][ payload biner ]
    ▲         ▲                  ▲
  magic    lookup ke registry   data terkompresi rapat</pre>

<p>Konsumen mengambil skema berdasarkan id (dan menyimpannya di cache), lalu mendeserialisasi dengan benar — termasuk untuk pesan lama yang memakai skema versi sebelumnya.</p>

<h2>Memilih Format</h2>
<table>
<thead><tr><th>Format</th><th>Kelebihan</th><th>Pertimbangan</th></tr></thead>
<tbody>
<tr><td><strong>Avro</strong></td><td>Ringkas, aturan evolusi paling matang, ekosistem data kuat</td><td>Pilihan default untuk pipeline analitik</td></tr>
<tr><td><strong>Protobuf</strong></td><td>Ringkas, cocok bila layanan sudah memakai gRPC</td><td>Berbagi definisi dengan API layanan</td></tr>
<tr><td><strong>JSON Schema</strong></td><td>Mudah dibaca manusia, mudah diadopsi</td><td>Boros ukuran; pakai bila keterbacaan lebih penting</td></tr>
</tbody>
</table>

<h2>Mode Kompatibilitas</h2>
<table>
<thead><tr><th>Mode</th><th>Arti</th><th>Perubahan yang boleh</th></tr></thead>
<tbody>
<tr><td><code>BACKWARD</code></td><td>Konsumen skema baru bisa membaca data lama</td><td>Hapus field; tambah field <em>bernilai default</em></td></tr>
<tr><td><code>FORWARD</code></td><td>Konsumen skema lama bisa membaca data baru</td><td>Tambah field; hapus field bernilai default</td></tr>
<tr><td><code>FULL</code></td><td>Keduanya</td><td>Hanya tambah/hapus field bernilai default</td></tr>
<tr><td><code>NONE</code></td><td>Tanpa pemeriksaan</td><td>Semua — dan semua risikonya</td></tr>
</tbody>
</table>

<div class="callout waspada">
    <div class="callout-judul">⚠️ BACKWARD adalah default, dan default itu menentukan urutan rilis</div>
    <p>Dengan <code>BACKWARD</code>, <strong>konsumen harus diperbarui lebih dulu</strong>, baru produser. Dengan <code>FORWARD</code>, urutannya terbalik. Tim yang tidak menyadari hal ini sering merilis produser lebih dulu lalu heran kenapa konsumen gagal mendeserialisasi.</p>
</div>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Menambah field wajib tanpa nilai default</div>
    <p>Ini pelanggaran kompatibilitas yang paling sering terjadi. Konsumen yang membaca pesan lama tidak menemukan field tersebut dan tidak punya nilai pengganti, sehingga deserialisasi gagal. Registry akan menolak pendaftaran skema semacam itu — dan penolakan tersebut adalah fitur, bukan penghalang yang perlu diakali dengan menyetel mode ke <code>NONE</code>.</p>
</div>

<h2>Praktik yang Menghemat Banyak Waktu</h2>
<ul>
    <li><strong>Selalu beri nilai default</strong> pada field baru — ini membuat hampir semua penambahan aman.</li>
    <li><strong>Jangan pernah mendaur ulang nama field</strong> untuk arti yang berbeda; tambahkan field baru dan tandai yang lama sebagai usang.</li>
    <li><strong>Simpan definisi skema di repositori</strong> dan daftarkan lewat CI, bukan manual dari laptop.</li>
    <li><strong>Jalankan pemeriksaan kompatibilitas di CI</strong> agar perubahan yang merusak ditolak sebelum menyentuh produksi.</li>
    <li><strong>Sertakan metadata peristiwa</strong> — id peristiwa, waktu kejadian, versi produser — sejak hari pertama. Menambahkannya belakangan jauh lebih sulit.</li>
</ul>

<div class="callout info">
    <div class="callout-judul">💡 Nama topik dan strategi subject</div>
    <p>Secara default registry memakai <em>TopicNameStrategy</em>: subject bernama <code>namatopik-value</code>. Bila satu topik memuat beberapa jenis peristiwa, gunakan <em>RecordNameStrategy</em> atau <em>TopicRecordNameStrategy</em> agar tiap jenis punya riwayat skema sendiri.</p>
</div>`,
    perintah: [
        "curl -s http://localhost:8081/subjects | jq",
        "curl -s http://localhost:8081/subjects/pesanan-value/versions/latest | jq",
        "curl -s http://localhost:8081/config | jq",
        "curl -X PUT -H 'Content-Type: application/json' --data '{\"compatibility\":\"BACKWARD\"}' http://localhost:8081/config/pesanan-value",
        "kafka-avro-console-consumer --bootstrap-server localhost:9092 --topic pesanan --property schema.registry.url=http://localhost:8081 --from-beginning"
    ],
    kuis: [
        {
            tanya: "Registry memakai mode BACKWARD. Urutan rilis yang benar saat skema berubah adalah?",
            opsi: [
                "Produser dulu, karena data baru harus tersedia sebelum konsumen diperbarui",
                "Konsumen dulu, karena BACKWARD menjamin konsumen skema baru bisa membaca data lama",
                "Keduanya harus dirilis bersamaan dalam satu jendela pemeliharaan",
                "Urutannya tidak berpengaruh selama registry aktif"
            ],
            benar: 1,
            penjelasan: "BACKWARD berarti skema baru mampu membaca data yang ditulis dengan skema lama. Karena itu konsumen bisa diperbarui lebih dulu dengan aman — ia tetap memahami data lama yang masih mengalir — baru kemudian produser mulai menulis format baru."
        },
        {
            tanya: "Kenapa menambahkan field wajib tanpa nilai default melanggar kompatibilitas backward?",
            opsi: [
                "Karena ukuran pesan menjadi terlalu besar",
                "Karena pesan lama tidak memuat field tersebut dan konsumen tidak punya nilai pengganti, sehingga deserialisasi gagal",
                "Karena registry hanya mengizinkan maksimal sepuluh field",
                "Karena Avro tidak mendukung penambahan field sama sekali"
            ],
            benar: 1,
            penjelasan: "Kompatibilitas backward menuntut skema baru mampu membaca data lama. Data lama tidak memuat field yang baru ditambahkan; bila field itu wajib dan tanpa default, tidak ada nilai yang bisa diisikan dan pembacaan gagal. Memberi nilai default membuat penambahan field menjadi aman."
        }
    ]
},
{
    id: 8,
    kategori: "3 · Data & Skema",
    judul: "Retensi, Log Compaction & Tiered Storage",
    tingkat: "Menengah", durasi: "14 mnt",
    tag: ["retensi", "compaction", "tiered storage", "segment", "tombstone"],
    ringkas: "Kafka menghapus data berdasarkan aturan yang Anda tetapkan. Salah memahami aturan ini berarti disk penuh di tengah malam, atau data penting yang lenyap tanpa peringatan.",
    isi: `
<h2>Dua Kebijakan Pembersihan</h2>
<pre>cleanup.policy=delete   ← buang berdasarkan umur atau ukuran (default)
cleanup.policy=compact  ← simpan nilai terakhir untuk tiap kunci
cleanup.policy=compact,delete  ← keduanya sekaligus</pre>

<h2>Retensi Berbasis Hapus</h2>
<table>
<thead><tr><th>Setelan</th><th>Default</th><th>Arti</th></tr></thead>
<tbody>
<tr><td><code>retention.ms</code></td><td>7 hari</td><td>Umur maksimum data</td></tr>
<tr><td><code>retention.bytes</code></td><td>-1 (tanpa batas)</td><td>Ukuran maksimum <em>per partisi</em></td></tr>
<tr><td><code>segment.ms</code></td><td>7 hari</td><td>Kapan segmen aktif ditutup</td></tr>
<tr><td><code>segment.bytes</code></td><td>1 GB</td><td>Ukuran segmen sebelum ditutup</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 retention.bytes berlaku PER PARTISI, bukan per topik</div>
    <p>Menyetel <code>retention.bytes=10737418240</code> (10 GB) pada topik dengan 12 partisi berarti topik itu boleh memakai <strong>120 GB</strong>, bukan 10 GB. Kesalahan hitung ini adalah penyebab klasik disk broker penuh mendadak.</p>
</div>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Penghapusan bekerja pada segmen, bukan pesan</div>
    <p>Kafka hanya bisa menghapus <strong>segmen yang sudah ditutup</strong>. Segmen aktif tidak akan pernah dihapus berapa pun umurnya. Pada topik berlalu lintas rendah dengan <code>segment.bytes</code> 1 GB, satu segmen bisa terbuka berminggu-minggu, sehingga data jauh melewati <code>retention.ms</code> tetap tersimpan. Bila retensi harus ketat — misalnya untuk kepatuhan privasi — turunkan juga <code>segment.ms</code>.</p>
</div>

<h2>Log Compaction</h2>
<p>Compaction menyimpan <strong>nilai terakhir untuk tiap kunci</strong> selamanya, dan membuang versi lama dari kunci yang sama. Topik menjadi semacam snapshot keadaan terkini yang bisa diputar ulang.</p>

<pre>Sebelum compaction:
  [ user1=A ][ user2=X ][ user1=B ][ user3=P ][ user1=C ][ user2=Y ]

Sesudah compaction:
  [ user3=P ][ user1=C ][ user2=Y ]     ← hanya nilai terakhir tiap kunci</pre>

<p>Ini fondasi bagi tabel keadaan Kafka Streams, topik konfigurasi Kafka Connect, dan pola <em>event sourcing</em> yang perlu memulihkan keadaan penuh dari awal.</p>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Compaction tanpa kunci berarti tidak terjadi apa-apa</div>
    <p>Compaction bekerja berdasarkan kunci pesan. Pesan tanpa kunci <strong>tidak pernah dipadatkan</strong> dan topik akan tumbuh tanpa batas meski <code>cleanup.policy=compact</code> sudah disetel. Selalu pastikan produser ke topik compacted menyertakan kunci.</p>
</div>

<h2>Tombstone: Cara Menghapus Kunci</h2>
<pre>kirim(kunci="user1", nilai=null)   ← tombstone

Konsumen melihat nilai null → tanda "entitas ini dihapus"
Setelah delete.retention.ms, tombstone sendiri ikut dibersihkan</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Konsumen harus menangani nilai null</div>
    <p>Kode yang langsung mendeserialisasi nilai tanpa memeriksa null akan melempar exception saat menemui tombstone. Pada topik compacted, tombstone bukan kasus langka melainkan bagian normal dari aliran data.</p>
</div>

<h2>Tiered Storage</h2>
<p>Retensi panjang dulu berarti disk broker yang mahal dan besar. <strong>Tiered storage</strong> memindahkan segmen lama ke penyimpanan objek seperti S3, sementara data terbaru tetap di disk lokal.</p>

<pre>Disk broker:      [ segmen panas — jam/hari terakhir ]
Penyimpanan objek: [ segmen dingin — minggu/bulan sebelumnya ]

Konsumen membaca keduanya secara transparan; yang berbeda hanya latensi.</pre>

<table>
<thead><tr><th>Manfaat</th><th>Konsekuensi</th></tr></thead>
<tbody>
<tr><td>Retensi berbulan-bulan dengan biaya jauh lebih murah</td><td>Membaca data lama jauh lebih lambat</td></tr>
<tr><td>Broker menyimpan lebih sedikit data lokal</td><td>Ada biaya permintaan ke penyimpanan objek</td></tr>
<tr><td>Rebalance dan pemulihan broker lebih cepat</td><td>Perlu konfigurasi dan pemantauan tambahan</td></tr>
</tbody>
</table>

<div class="callout info">
    <div class="callout-judul">💡 Status kesiapan</div>
    <p>Tiered storage sudah tersedia di Kafka open source sejak seri 3.6 sebagai fitur awal dan dinyatakan siap produksi pada 3.9 serta diteruskan di 4.x, di samping implementasi bawaan platform terkelola. Fitur ini melekat pada level topik lewat <code>remote.storage.enable</code>, sehingga bisa diadopsi bertahap per topik.</p>
</div>`,
    perintah: [
        "kafka-configs.sh --bootstrap-server localhost:9092 --entity-type topics --entity-name pesanan --alter --add-config retention.ms=604800000",
        "kafka-configs.sh --bootstrap-server localhost:9092 --entity-type topics --entity-name status.pengguna --alter --add-config cleanup.policy=compact,min.cleanable.dirty.ratio=0.1",
        "kafka-log-dirs.sh --bootstrap-server localhost:9092 --describe --topic-list pesanan",
        "kafka-configs.sh --bootstrap-server localhost:9092 --entity-type topics --entity-name pesanan --describe",
        "kafka-delete-records.sh --bootstrap-server localhost:9092 --offset-json-file hapus.json"
    ],
    kuis: [
        {
            tanya: "Topik dengan 12 partisi disetel retention.bytes=10 GB. Berapa ruang disk maksimum yang bisa dipakai topik itu di seluruh klaster sebelum replikasi?",
            opsi: [
                "10 GB, karena setelan berlaku untuk topik",
                "120 GB, karena retention.bytes berlaku per partisi",
                "Tergantung retention.ms, retention.bytes hanya saran",
                "Tidak terbatas, karena retention.bytes hanya berlaku untuk topik compacted"
            ],
            benar: 1,
            penjelasan: "retention.bytes membatasi ukuran per partisi. Dengan 12 partisi, batas efektifnya 12 kali lipat — dan angka itu masih dikalikan lagi dengan replication factor untuk menghitung total disk klaster."
        },
        {
            tanya: "Sebuah topik disetel cleanup.policy=compact, tetapi ukurannya terus bertambah tanpa henti. Penyebab paling mungkin?",
            opsi: [
                "Compaction hanya berjalan sekali sehari",
                "Produser mengirim pesan tanpa kunci, sehingga tidak ada yang bisa dipadatkan",
                "Topik punya terlalu banyak partisi",
                "Kompresi zstd tidak kompatibel dengan compaction"
            ],
            benar: 1,
            penjelasan: "Compaction memutuskan mana yang boleh dibuang berdasarkan kunci pesan: hanya versi lama dari kunci yang sama yang dihapus. Pesan tanpa kunci tidak punya pasangan untuk dibandingkan, sehingga semuanya dipertahankan dan topik tumbuh terus."
        }
    ]
},
{
    id: 9,
    kategori: "4 · Ekosistem",
    judul: "Kafka Connect & Change Data Capture",
    tingkat: "Menengah", durasi: "14 mnt",
    tag: ["connect", "cdc", "debezium", "sink", "source", "integrasi"],
    ringkas: "Sebagian besar integrasi Kafka yang ditulis tangan sebenarnya sudah ada sebagai konektor siap pakai — lengkap dengan penanganan offset, retry, dan skala yang biasanya lupa dipikirkan.",
    isi: `
<h2>Apa yang Dikerjakan Connect</h2>
<p>Kafka Connect adalah kerangka kerja untuk memindahkan data <strong>masuk dan keluar</strong> Kafka tanpa menulis kode konsumen atau produser.</p>

<pre>Source connector:  PostgreSQL / MySQL / MongoDB / S3  →  Kafka
Sink connector:    Kafka  →  Elasticsearch / S3 / BigQuery / JDBC</pre>

<p>Yang Anda tulis hanyalah berkas konfigurasi JSON. Connect menangani distribusi tugas, penyimpanan offset, retry, dan pemulihan setelah kegagalan.</p>

<div class="callout info">
    <div class="callout-judul">💡 Mode distributed, bahkan untuk satu node</div>
    <p>Connect punya mode <em>standalone</em> dan <em>distributed</em>. Gunakan <strong>distributed</strong> sejak awal walau hanya menjalankan satu worker: konfigurasi dan offset disimpan di topik Kafka, sehingga konektor selamat dari restart dan bisa ditambah worker tanpa migrasi.</p>
</div>

<h2>Change Data Capture dengan Debezium</h2>
<p>CDC membaca <strong>log replikasi basis data</strong> — WAL pada PostgreSQL, binlog pada MySQL — dan mengubah tiap perubahan baris menjadi peristiwa Kafka.</p>

<pre>UPDATE pesanan SET status='dibayar' WHERE id=123;
      │
      ▼  WAL PostgreSQL
  Debezium
      │
      ▼  topik: server.public.pesanan
  { "before": { "id":123, "status":"menunggu" },
    "after":  { "id":123, "status":"dibayar"  },
    "op": "u", "ts_ms": 1780000000000 }</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ CDC bukan pengganti peristiwa domain</div>
    <p>Peristiwa CDC menggambarkan <strong>perubahan baris tabel</strong>, bukan makna bisnis. Konsumen yang berlangganan CDC otomatis terikat pada skema internal basis data Anda — mengganti nama kolom akan merusak mereka. Untuk integrasi antar tim, terbitkan peristiwa domain yang dirancang sengaja; simpan CDC untuk replikasi data, gudang data, dan pola outbox.</p>
</div>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Slot replikasi yang tertinggal bisa membuat basis data penuh</div>
    <p>Pada PostgreSQL, konektor CDC memakai slot replikasi. Bila konektor mati atau tertinggal jauh, PostgreSQL <strong>menahan seluruh WAL</strong> yang belum dikonsumsi slot itu — dan disk basis data bisa penuh sampai instance berhenti melayani. Pantau <code>pg_replication_slots</code>, dan hapus slot yang konektornya sudah tidak dipakai lagi.</p>
</div>

<h2>Contoh Konfigurasi Sink</h2>
<pre>{
  "name": "sink-elasticsearch-pesanan",
  "config": {
    "connector.class": "io.confluent.connect.elasticsearch.ElasticsearchSinkConnector",
    "topics": "pesanan",
    "connection.url": "http://elasticsearch:9200",
    "key.ignore": "false",
    "tasks.max": "3",
    "errors.tolerance": "all",
    "errors.deadletterqueue.topic.name": "dlq.sink-elasticsearch",
    "errors.deadletterqueue.context.headers.enable": "true"
  }
}</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ errors.tolerance=all tanpa dead letter queue = data hilang diam-diam</div>
    <p>Setelan ini membuat Connect melewati pesan yang gagal alih-alih berhenti. Tanpa <code>errors.deadletterqueue.topic.name</code>, pesan yang gagal <strong>dibuang begitu saja</strong> dan Anda tidak akan pernah tahu berapa banyak yang hilang. Keduanya harus selalu dipasang bersama.</p>
</div>

<h2>Single Message Transforms</h2>
<p>SMT melakukan transformasi ringan pada tiap pesan tanpa perlu aplikasi terpisah: mengganti nama field, menutupi data sensitif, mengarahkan topik, menambah header.</p>

<pre>"transforms": "samarkan,ubahTopik",
"transforms.samarkan.type": "org.apache.kafka.connect.transforms.MaskField$Value",
"transforms.samarkan.fields": "nomor_ktp,email",
"transforms.ubahTopik.type": "org.apache.kafka.connect.transforms.RegexRouter",
"transforms.ubahTopik.regex": "server.public.(.*)",
"transforms.ubahTopik.replacement": "cdc.$1"</pre>

<div class="callout info">
    <div class="callout-judul">💡 Batas wajar SMT</div>
    <p>SMT bagus untuk transformasi per pesan yang sederhana. Begitu Anda membutuhkan penggabungan, agregasi, atau keadaan lintas pesan, pindah ke Kafka Streams atau Flink — memaksakan logika kompleks ke dalam rantai SMT menghasilkan konfigurasi yang tidak bisa diuji dan sulit ditelusuri saat gagal.</p>
</div>`,
    perintah: [
        "curl -s http://localhost:8083/connectors | jq",
        "curl -s http://localhost:8083/connectors/sink-elasticsearch-pesanan/status | jq",
        "curl -X POST -H 'Content-Type: application/json' --data @konektor.json http://localhost:8083/connectors",
        "curl -X POST http://localhost:8083/connectors/sink-elasticsearch-pesanan/restart?includeTasks=true",
        "curl -s http://localhost:8083/connector-plugins | jq"
    ],
    kuis: [
        {
            tanya: "Kenapa berlangganan langsung ke topik CDC milik tim lain berisiko?",
            opsi: [
                "Karena topik CDC selalu dienkripsi",
                "Karena peristiwa CDC mencerminkan skema tabel internal, sehingga perubahan kolom di basis data itu langsung merusak konsumen",
                "Karena Debezium tidak mendukung lebih dari satu konsumen",
                "Karena topik CDC tidak bisa dibaca oleh consumer group"
            ],
            benar: 1,
            penjelasan: "CDC menerbitkan perubahan baris apa adanya, sehingga struktur internal basis data menjadi antarmuka publik tanpa disengaja. Perubahan skema rutin — mengganti nama kolom, memecah tabel — akan merusak konsumen hilir. Untuk konsumsi lintas tim, terbitkan peristiwa domain yang dirancang sebagai kontrak."
        },
        {
            tanya: "Apa akibat menyetel errors.tolerance=all tanpa mengonfigurasi dead letter queue?",
            opsi: [
                "Konektor akan berhenti pada galat pertama",
                "Pesan yang gagal diproses dibuang tanpa jejak, sehingga kehilangan data terjadi diam-diam",
                "Semua pesan diulang tanpa batas sampai berhasil",
                "Connect otomatis membuat topik DLQ dengan nama bawaan"
            ],
            benar: 1,
            penjelasan: "errors.tolerance=all memerintahkan Connect melanjutkan meski ada pesan gagal. Tanpa DLQ, pesan itu tidak disimpan di mana pun dan tidak ada cara memulihkannya atau bahkan mengetahui jumlahnya. Pasangkan selalu dengan errors.deadletterqueue.topic.name."
        }
    ]
},
{
    id: 10,
    kategori: "4 · Ekosistem",
    judul: "Kafka Streams: Pemrosesan Stateful",
    tingkat: "Lanjut", durasi: "16 mnt",
    tag: ["kafka streams", "ktable", "state store", "windowing", "join", "changelog"],
    ringkas: "Kafka Streams adalah pustaka, bukan klaster. Ia mengubah aplikasi biasa menjadi pemroses aliran yang stateful, toleran gagal, dan bisa diskalakan seperti layanan lain.",
    isi: `
<h2>Pustaka, Bukan Infrastruktur Baru</h2>
<p>Berbeda dari Flink atau Spark yang menuntut klaster tersendiri, Kafka Streams adalah dependensi biasa di dalam aplikasi Anda. Skala dilakukan dengan menjalankan lebih banyak instans — persis seperti menskalakan layanan HTTP.</p>

<pre>Aplikasi Anda (JAR / kontainer)
  ├── Kafka Streams sebagai pustaka
  ├── RocksDB untuk state lokal
  └── Kafka untuk masukan, keluaran, dan cadangan state</pre>

<h2>Stream dan Table</h2>
<table>
<thead><tr><th>Abstraksi</th><th>Artinya</th><th>Contoh</th></tr></thead>
<tbody>
<tr><td><code>KStream</code></td><td>Aliran peristiwa; tiap catatan berdiri sendiri</td><td>"pesanan-123 dibuat"</td></tr>
<tr><td><code>KTable</code></td><td>Keadaan terkini per kunci; catatan baru menimpa yang lama</td><td>"status pesanan-123 = dibayar"</td></tr>
<tr><td><code>GlobalKTable</code></td><td>Salinan penuh tabel di tiap instans</td><td>Tabel referensi kecil, misalnya daftar mata uang</td></tr>
</tbody>
</table>

<div class="callout info">
    <div class="callout-judul">💡 Dualitas stream dan table</div>
    <p>Keduanya adalah dua cara memandang data yang sama. Menjumlahkan seluruh peristiwa perubahan menghasilkan keadaan terkini (stream ke table), dan mencatat tiap perubahan keadaan menghasilkan aliran peristiwa (table ke stream). Memahami dualitas ini membuat sebagian besar API Kafka Streams terasa wajar.</p>
</div>

<h2>State Store dan Changelog</h2>
<p>Operasi stateful — agregasi, join, penghitungan berjendela — menyimpan data di RocksDB pada disk lokal instans. Agar tahan terhadap kegagalan, tiap perubahan state juga ditulis ke <strong>topik changelog</strong> di Kafka yang bersifat compacted.</p>

<pre>Instans mati → pod baru dijadwalkan
  ↳ baca ulang topik changelog
  ↳ bangun kembali RocksDB lokal
  ↳ lanjutkan dari titik terakhir</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Pemulihan state bisa memakan waktu lama</div>
    <p>State store berukuran puluhan gigabyte membutuhkan waktu lama untuk dibangun ulang dari changelog, dan selama itu partisi terkait tidak diproses. Mitigasinya: <strong>standby replica</strong> (<code>num.standby.replicas</code>) yang menjaga salinan hangat, dan volume persisten di Kubernetes agar RocksDB tidak hilang saat pod dijadwalkan ulang.</p>
</div>

<h2>Windowing</h2>
<table>
<thead><tr><th>Jenis</th><th>Perilaku</th><th>Contoh pemakaian</th></tr></thead>
<tbody>
<tr><td>Tumbling</td><td>Jendela tetap, tidak tumpang tindih</td><td>Jumlah pesanan per 5 menit</td></tr>
<tr><td>Hopping</td><td>Jendela tetap yang saling tumpang tindih</td><td>Rata-rata 10 menit, diperbarui tiap menit</td></tr>
<tr><td>Sliding</td><td>Berbasis selisih waktu antar catatan</td><td>Deteksi lonjakan</td></tr>
<tr><td>Session</td><td>Dipisahkan oleh periode tidak aktif</td><td>Sesi aktivitas pengguna</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Event time versus processing time</div>
    <p>Kafka Streams default memakai <strong>waktu kejadian</strong> yang tertanam pada catatan, bukan waktu pemrosesan. Peristiwa yang datang terlambat — dari perangkat seluler yang sempat offline, misalnya — akan jatuh ke jendela masa lalu. Bila jendela itu sudah ditutup melebihi <code>grace period</code>, peristiwa tersebut <strong>dibuang tanpa peringatan</strong>. Setel grace period sesuai keterlambatan yang realistis di sistem Anda, dan pantau metrik catatan yang terlambat.</p>
</div>

<h2>Contoh Topologi</h2>
<pre>StreamsBuilder pembangun = new StreamsBuilder();

KStream&lt;String, Pesanan&gt; pesanan = pembangun.stream("pesanan");
KTable&lt;String, Pelanggan&gt; pelanggan = pembangun.table("pelanggan");

pesanan
    .filter((k, p) -> p.getTotal() > 1_000_000)
    .join(pelanggan, (p, c) -> perkaya(p, c))
    .groupBy((k, p) -> p.getWilayah())
    .windowedBy(TimeWindows.ofSizeAndGrace(
        Duration.ofMinutes(5), Duration.ofMinutes(2)))
    .count()
    .toStream()
    .to("pesanan-besar-per-wilayah");</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Perubahan topologi bukan hal sepele</div>
    <p>Menambah atau memindahkan operator stateful mengubah nama internal topik changelog dan repartition. Rilis yang tampak kecil bisa membuat aplikasi kehilangan seluruh state-nya. Beri <strong>nama eksplisit</strong> pada state store dan operator penting, dan uji jalur peningkatan versi sebelum menerapkannya di produksi.</p>
</div>

<h2>Kafka Streams atau Flink?</h2>
<table>
<thead><tr><th>Pilih Kafka Streams bila</th><th>Pilih Flink bila</th></tr></thead>
<tbody>
<tr><td>Sumber dan tujuan sama-sama Kafka</td><td>Perlu banyak sumber dan sink beragam</td></tr>
<tr><td>Tim ingin menjalankannya seperti layanan biasa</td><td>Sudah ada tim data yang mengelola klaster</td></tr>
<tr><td>Tidak ingin menambah infrastruktur baru</td><td>Butuh SQL, batch, dan streaming dalam satu mesin</td></tr>
<tr><td>Skala menengah</td><td>Skala sangat besar dengan state raksasa</td></tr>
</tbody>
</table>`,
    perintah: [
        "kafka-streams-application-reset.sh --application-id analitik-pesanan --bootstrap-server localhost:9092 --input-topics pesanan",
        "kafka-topics.sh --bootstrap-server localhost:9092 --list | grep changelog",
        "kafka-topics.sh --bootstrap-server localhost:9092 --list | grep repartition",
        "kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group analitik-pesanan --describe"
    ],
    kuis: [
        {
            tanya: "Bagaimana Kafka Streams memulihkan state lokal setelah sebuah instans mati?",
            opsi: [
                "Menyalin RocksDB langsung dari instans lain melalui jaringan",
                "Membangun ulang state dari topik changelog compacted di Kafka",
                "Memproses ulang seluruh topik masukan dari offset nol",
                "State tidak dapat dipulihkan dan harus dihitung ulang manual"
            ],
            benar: 1,
            penjelasan: "Setiap perubahan state store juga ditulis ke topik changelog yang compacted. Instans baru membaca changelog itu untuk merekonstruksi RocksDB lokalnya, sehingga tidak perlu memproses ulang topik masukan dari awal. Standby replica mempercepat proses ini dengan menjaga salinan hangat."
        },
        {
            tanya: "Peristiwa dari perangkat yang sempat offline tiba jauh terlambat. Apa yang terjadi pada jendela agregasi?",
            opsi: [
                "Kafka Streams selalu membuka kembali jendela lama secara otomatis",
                "Bila keterlambatan melebihi grace period, peristiwa itu dibuang tanpa peringatan",
                "Peristiwa dimasukkan ke jendela saat ini berdasarkan waktu pemrosesan",
                "Aplikasi akan berhenti dengan galat sampai peristiwa itu ditangani"
            ],
            benar: 1,
            penjelasan: "Kafka Streams memakai waktu kejadian dan menutup jendela setelah grace period berlalu. Peristiwa yang datang setelah itu tidak lagi bisa memperbarui hasil dan dibuang secara senyap. Grace period harus disetel sesuai keterlambatan realistis, dan metrik catatan terlambat perlu dipantau."
        }
    ]
},
{
    id: 11,
    kategori: "5 · Operasi",
    judul: "Pemantauan, Consumer Lag & Kapasitas",
    tingkat: "Lanjut", durasi: "15 mnt",
    tag: ["monitoring", "lag", "jmx", "prometheus", "under-replicated", "kapasitas"],
    ringkas: "Kafka mengeluarkan ratusan metrik. Hanya segelintir yang benar-benar menentukan apakah Anda tidur nyenyak.",
    isi: `
<h2>Metrik yang Benar-Benar Penting</h2>
<table>
<thead><tr><th>Metrik</th><th>Nilai sehat</th><th>Artinya bila menyimpang</th></tr></thead>
<tbody>
<tr><td><code>UnderReplicatedPartitions</code></td><td>0</td><td>Replika tertinggal — daya tahan data sedang menurun</td></tr>
<tr><td><code>OfflinePartitionsCount</code></td><td>0</td><td>Partisi tanpa leader — produksi dan konsumsi terhenti</td></tr>
<tr><td><code>ActiveControllerCount</code></td><td>Tepat 1 di seluruh klaster</td><td>0 berarti tanpa controller; lebih dari 1 berarti split brain</td></tr>
<tr><td><code>UnderMinIsrPartitionCount</code></td><td>0</td><td>Penulisan dengan acks=all sedang ditolak</td></tr>
<tr><td><code>RequestHandlerAvgIdlePercent</code></td><td>&gt; 30%</td><td>Broker kehabisan thread penangan permintaan</td></tr>
<tr><td>Consumer lag</td><td>Stabil / rendah</td><td>Konsumen tidak mengejar laju produksi</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 UnderReplicatedPartitions &gt; 0 bukan peringatan kecil</div>
    <p>Angka ini berarti sebagian replika tidak sinkron, sehingga jumlah salinan data yang benar-benar aman <strong>lebih sedikit dari yang Anda kira</strong>. Bila broker leader kemudian gagal, kehilangan data menjadi mungkin. Ini termasuk peringatan yang layak membangunkan orang.</p>
</div>

<h2>Consumer Lag: Angka Tunggal Paling Berguna</h2>
<pre>lag = offset terakhir di partisi − offset yang sudah di-commit konsumen</pre>

<p>Yang menentukan bukan besar angkanya, melainkan <strong>arah pergerakannya</strong>:</p>
<table>
<thead><tr><th>Pola</th><th>Tafsiran</th></tr></thead>
<tbody>
<tr><td>Lag kecil dan datar</td><td>Sehat</td></tr>
<tr><td>Lag naik terus</td><td>Konsumen lebih lambat dari produser — butuh perbaikan atau skala</td></tr>
<tr><td>Lag naik lalu turun berkala</td><td>Beban bergelombang; wajar selama sempat kembali normal</td></tr>
<tr><td>Lag melonjak pada satu partisi saja</td><td>Kunci pesan tidak merata, atau satu konsumen bermasalah</td></tr>
</tbody>
</table>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Lag dalam satuan pesan bisa menyesatkan</div>
    <p>Lag 100.000 pesan pada topik berlaju 1.000 pesan/detik berarti tertinggal 100 detik. Lag yang sama pada topik berlaju 100.000 pesan/detik berarti tertinggal satu detik. Peringatan sebaiknya berbasis <strong>lag dalam satuan waktu</strong>, bukan jumlah pesan.</p>
</div>

<h2>Partisi Panas</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 Kunci yang timpang menghancurkan paralelisme</div>
    <p>Bila kunci pesan memakai <code>id_penyewa</code> dan satu penyewa besar menghasilkan 80% lalu lintas, satu partisi menerima hampir semua beban sementara sisanya menganggur. Menambah konsumen tidak menolong sama sekali, karena satu partisi tetap dipegang satu konsumen.</p>
    <p>Perbaikannya adalah mengubah kunci menjadi lebih halus — misalnya <code>id_penyewa:id_pengguna</code> — selama jaminan urutan yang dibutuhkan masih terpenuhi pada level tersebut.</p>
</div>

<h2>Kapasitas dan Perencanaan Disk</h2>
<pre>Kebutuhan disk ≈ laju masuk (byte/hari)
                 × hari retensi
                 × replication factor
                 ÷ rasio kompresi
                 × 1,3   ← ruang cadangan untuk lonjakan dan rebalance

Contoh: 200 GB/hari × 7 hari × 3 replika ÷ 3 (zstd) × 1,3 ≈ 1,8 TB</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Disk penuh membuat broker mati, bukan sekadar melambat</div>
    <p>Broker Kafka yang kehabisan ruang disk akan berhenti, dan pemulihannya rumit karena penghapusan data manual mudah merusak indeks partisi. Pasang peringatan pada <strong>70% pemakaian disk</strong>, bukan 90% — Anda membutuhkan waktu untuk bertindak.</p>
</div>

<h2>Perkakas</h2>
<ul>
    <li><strong>JMX Exporter + Prometheus + Grafana</strong> — jalur standar; tersedia papan pantau siap pakai untuk broker dan konsumen.</li>
    <li><strong>Cruise Control</strong> — penyeimbangan ulang partisi otomatis dan penambahan/pengurangan broker.</li>
    <li><strong>kafka-consumer-groups.sh</strong> — pemeriksaan lag cepat tanpa perkakas tambahan.</li>
    <li><strong>AKHQ / Kafka UI / Redpanda Console</strong> — antarmuka web untuk menjelajah topik dan pesan.</li>
</ul>

<div class="callout info">
    <div class="callout-judul">💡 Empat peringatan minimum</div>
    <p>Bila hanya sempat memasang empat peringatan: <code>UnderReplicatedPartitions &gt; 0</code>, <code>OfflinePartitionsCount &gt; 0</code>, <strong>lag konsumen kritis melebihi ambang waktu</strong>, dan <strong>pemakaian disk broker &gt; 70%</strong>. Empat ini menangkap sebagian besar insiden nyata.</p>
</div>`,
    perintah: [
        "kafka-consumer-groups.sh --bootstrap-server localhost:9092 --all-groups --describe",
        "kafka-topics.sh --bootstrap-server localhost:9092 --describe --under-replicated-partitions",
        "kafka-topics.sh --bootstrap-server localhost:9092 --describe --unavailable-partitions",
        "kafka-log-dirs.sh --bootstrap-server localhost:9092 --describe | jq '.brokers[].logDirs[].partitions | length'",
        "kafka-leader-election.sh --bootstrap-server localhost:9092 --election-type preferred --all-topic-partitions"
    ],
    kuis: [
        {
            tanya: "Kenapa peringatan consumer lag sebaiknya berbasis waktu, bukan jumlah pesan?",
            opsi: [
                "Karena Kafka tidak menyediakan lag dalam jumlah pesan",
                "Karena jumlah pesan yang sama berarti keterlambatan yang sangat berbeda tergantung laju topik",
                "Karena lag berbasis pesan hanya tersedia pada versi Kafka lama",
                "Karena lag berbasis waktu lebih murah dihitung"
            ],
            benar: 1,
            penjelasan: "Lag 100.000 pesan bisa berarti tertinggal 100 detik pada topik lambat atau hanya satu detik pada topik cepat. Ambang berbasis pesan menghasilkan peringatan palsu pada topik ramai dan gagal mendeteksi masalah nyata pada topik sepi. Ukuran yang bermakna adalah seberapa jauh konsumen tertinggal dalam satuan waktu."
        },
        {
            tanya: "Satu partisi menerima jauh lebih banyak lalu lintas daripada yang lain dan konsumennya tertinggal. Menambah pod konsumen tidak membantu. Kenapa?",
            opsi: [
                "Karena Kafka membatasi jumlah konsumen per topik",
                "Karena satu partisi hanya bisa dipegang satu konsumen, sehingga beban partisi panas tidak dapat dibagi",
                "Karena rebalance tidak berjalan pada partisi yang sibuk",
                "Karena partisi panas selalu ditandai offline"
            ],
            benar: 1,
            penjelasan: "Paralelisme dibatasi per partisi. Bila distribusi kunci timpang, satu partisi menampung sebagian besar beban dan hanya satu konsumen yang boleh memprosesnya. Solusinya ada di sisi kunci — buat kunci lebih halus sehingga beban tersebar — bukan menambah konsumen."
        }
    ]
},
{
    id: 12,
    kategori: "5 · Operasi",
    judul: "Keamanan: TLS, SASL, ACL & Kuota",
    tingkat: "Lanjut", durasi: "13 mnt",
    tag: ["keamanan", "tls", "sasl", "acl", "otorisasi", "kuota"],
    ringkas: "Klaster Kafka default tidak punya autentikasi maupun enkripsi. Siapa pun yang bisa menjangkau port 9092 dapat membaca dan menghapus segalanya.",
    isi: `
<h2>Tiga Lapis yang Terpisah</h2>
<table>
<thead><tr><th>Lapis</th><th>Pertanyaan yang dijawab</th><th>Mekanisme</th></tr></thead>
<tbody>
<tr><td>Enkripsi</td><td>Bisakah orang lain menguping?</td><td>TLS</td></tr>
<tr><td>Autentikasi</td><td>Siapa Anda?</td><td>SASL atau sertifikat klien mTLS</td></tr>
<tr><td>Otorisasi</td><td>Apa yang boleh Anda lakukan?</td><td>ACL</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 PLAINTEXT tanpa ACL adalah pintu terbuka</div>
    <p>Konfigurasi bawaan menerima koneksi anonim tanpa enkripsi. Siapa pun yang bisa menjangkau broker dapat membaca seluruh topik, menulis pesan palsu, dan <strong>menghapus topik</strong>. Konfigurasi pengembangan yang tidak sengaja terbawa ke jaringan yang lebih luas adalah salah satu penyebab kebocoran data yang paling sering terjadi.</p>
</div>

<h2>Pilihan SASL</h2>
<table>
<thead><tr><th>Mekanisme</th><th>Cocok untuk</th><th>Catatan</th></tr></thead>
<tbody>
<tr><td><code>SASL/PLAIN</code></td><td>Sederhana, di atas TLS</td><td>Kata sandi terkirim polos — <strong>wajib</strong> dibungkus TLS</td></tr>
<tr><td><code>SASL/SCRAM-SHA-512</code></td><td>Pilihan default yang baik</td><td>Kredensial disimpan di dalam Kafka, tidak pernah dikirim polos</td></tr>
<tr><td><code>SASL/GSSAPI</code></td><td>Lingkungan Kerberos</td><td>Kompleks; hanya bila memang sudah ada Kerberos</td></tr>
<tr><td><code>SASL/OAUTHBEARER</code></td><td>Integrasi OIDC modern</td><td>Token berumur pendek, cocok untuk lingkungan cloud</td></tr>
<tr><td><code>mTLS</code></td><td>Komunikasi antar layanan</td><td>Identitas dari sertifikat; perlu pengelolaan rotasi</td></tr>
</tbody>
</table>

<pre>listeners=SASL_SSL://:9093
security.inter.broker.protocol=SASL_SSL
sasl.enabled.mechanisms=SCRAM-SHA-512
sasl.mechanism.inter.broker.protocol=SCRAM-SHA-512

ssl.keystore.location=/etc/kafka/secrets/broker.keystore.jks
ssl.truststore.location=/etc/kafka/secrets/broker.truststore.jks

authorizer.class.name=org.apache.kafka.metadata.authorizer.StandardAuthorizer
allow.everyone.if.no.acl.found=false</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 allow.everyone.if.no.acl.found=true membatalkan seluruh ACL</div>
    <p>Setelan ini sering dinyalakan "sementara" saat migrasi agar layanan lama tidak rusak, lalu tidak pernah dimatikan. Efeknya: setiap sumber daya yang belum punya ACL <strong>terbuka untuk semua pihak yang terautentikasi</strong>. Selesaikan migrasi dengan menambahkan ACL, lalu kembalikan nilainya ke <code>false</code>.</p>
</div>

<h2>ACL: Beri Hak Sekecil Mungkin</h2>
<pre># Produser hanya boleh menulis ke satu topik
kafka-acls.sh --bootstrap-server localhost:9093 --command-config admin.properties \\
  --add --allow-principal User:layanan-pesanan \\
  --operation Write --operation Describe --topic pesanan

# Konsumen: baca topik + pakai satu group id
kafka-acls.sh --bootstrap-server localhost:9093 --command-config admin.properties \\
  --add --allow-principal User:layanan-notifikasi \\
  --operation Read --operation Describe --topic pesanan \\
  --group layanan-notifikasi</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Konsumen membutuhkan izin pada group, bukan hanya topik</div>
    <p>Kesalahan paling umum saat menerapkan ACL: memberi izin <code>Read</code> pada topik tetapi lupa izin pada <code>--group</code>. Konsumen gagal bergabung ke grup dengan galat otorisasi yang menunjuk grup, bukan topik — dan pesan itu mudah disalahtafsirkan.</p>
</div>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Jangan biarkan pembuatan topik otomatis di produksi</div>
    <p><code>auto.create.topics.enable=true</code> membuat salah ketik nama topik menghasilkan topik baru dengan konfigurasi default — biasanya satu partisi tanpa replikasi. Setel <code>false</code> di produksi dan kelola topik lewat kode infrastruktur.</p>
</div>

<h2>Kuota: Mencegah Satu Klien Menjatuhkan Klaster</h2>
<pre># Batasi produser tertentu ke 10 MB/detik
kafka-configs.sh --bootstrap-server localhost:9093 --alter \\
  --add-config 'producer_byte_rate=10485760,consumer_byte_rate=20971520' \\
  --entity-type clients --entity-name layanan-impor</pre>

<div class="callout info">
    <div class="callout-judul">💡 Kuota adalah rem, bukan penolakan</div>
    <p>Klien yang melampaui kuota tidak mendapat galat; broker menahan responsnya sehingga klien melambat dengan sendirinya. Ini membuat pekerjaan impor massal tidak dapat menenggelamkan lalu lintas transaksional, tanpa perlu perubahan kode di sisi klien.</p>
</div>`,
    perintah: [
        "kafka-acls.sh --bootstrap-server localhost:9093 --command-config admin.properties --list",
        "kafka-configs.sh --bootstrap-server localhost:9093 --alter --add-config 'SCRAM-SHA-512=[password=rahasia]' --entity-type users --entity-name layanan-pesanan",
        "kafka-acls.sh --bootstrap-server localhost:9093 --command-config admin.properties --add --allow-principal User:layanan-pesanan --operation Write --topic pesanan",
        "kafka-configs.sh --bootstrap-server localhost:9093 --describe --entity-type clients --entity-name layanan-impor",
        "openssl s_client -connect localhost:9093 -showcerts"
    ],
    kuis: [
        {
            tanya: "Apa akibat membiarkan allow.everyone.if.no.acl.found=true di produksi?",
            opsi: [
                "ACL tetap berlaku penuh, setelan ini hanya memengaruhi log",
                "Setiap sumber daya yang belum punya ACL terbuka bagi semua pihak yang terautentikasi, sehingga model otorisasi kehilangan maknanya",
                "Broker menolak semua koneksi yang tidak memiliki ACL",
                "Hanya topik internal yang terpengaruh"
            ],
            benar: 1,
            penjelasan: "Setelan ini mengubah default dari 'tolak' menjadi 'izinkan' untuk sumber daya tanpa ACL. Biasanya dinyalakan sementara saat migrasi lalu terlupakan, meninggalkan topik baru mana pun dalam keadaan terbuka. Nilai yang benar di produksi adalah false."
        },
        {
            tanya: "Konsumen sudah diberi izin Read pada topik tetapi tetap gagal dengan galat otorisasi. Apa yang paling mungkin terlewat?",
            opsi: [
                "Izin Write pada topik yang sama",
                "Izin pada resource group untuk group.id yang dipakai konsumen",
                "Sertifikat TLS untuk tiap partisi",
                "Izin Describe pada broker"
            ],
            benar: 1,
            penjelasan: "Consumer group adalah sumber daya tersendiri dalam model ACL Kafka. Konsumen membutuhkan izin pada topik sekaligus pada group id yang dipakainya untuk bergabung dan menyimpan offset. Ini kelalaian paling umum saat pertama kali menerapkan ACL."
        }
    ]
},
{
    id: 13,
    kategori: "6 · Pola Produksi",
    judul: "Outbox, Dead Letter Queue & Konsumen Idempoten",
    tingkat: "Lanjut", durasi: "17 mnt",
    tag: ["outbox", "dlq", "idempoten", "retry", "pola", "dual write"],
    ringkas: "Tiga pola ini menyelesaikan hampir semua masalah nyata yang muncul saat Kafka dipakai di antara layanan dan basis data.",
    isi: `
<h2>Masalah Dual Write</h2>
<p>Layanan menyimpan pesanan ke basis data, lalu menerbitkan peristiwa ke Kafka. Dua sistem, dua penulisan, tanpa transaksi bersama.</p>

<pre>simpanKeBasisData(pesanan)   ← berhasil
terbitKeKafka(peristiwa)     ← proses mati di sini

Hasil: pesanan ada di basis data, tetapi tidak ada yang pernah tahu.
Layanan pengiriman tidak pernah menerima peristiwanya.</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Membalik urutannya tidak menyelesaikan apa pun</div>
    <p>Menerbitkan ke Kafka lebih dulu menghasilkan kegagalan yang berlawanan tetapi sama buruknya: peristiwa tersebar dan diproses hilir, sementara transaksi basis data gagal — <strong>seluruh sistem kini yakin akan pesanan yang tidak pernah ada</strong>. Tidak ada urutan yang benar; masalahnya struktural.</p>
</div>

<h2>Pola Outbox</h2>
<p>Tulis peristiwa ke tabel <code>outbox</code> <strong>di dalam transaksi basis data yang sama</strong> dengan perubahan data. Proses terpisah kemudian mengirimkannya ke Kafka.</p>

<pre>BEGIN;
  INSERT INTO pesanan (id, total, status) VALUES (123, 250000, 'dibuat');
  INSERT INTO outbox (id_peristiwa, agregat, kunci, payload)
  VALUES (gen_random_uuid(), 'pesanan', '123', '{...}');
COMMIT;          ← atomik: keduanya jadi, atau keduanya batal

Relay (Debezium CDC pada tabel outbox, atau poller terjadwal)
  ↳ baca baris outbox → kirim ke Kafka → tandai terkirim</pre>

<table>
<thead><tr><th>Cara relay</th><th>Kelebihan</th><th>Kekurangan</th></tr></thead>
<tbody>
<tr><td>Debezium CDC pada tabel outbox</td><td>Latensi rendah, tanpa polling</td><td>Perlu menjalankan Connect dan Debezium</td></tr>
<tr><td>Poller terjadwal</td><td>Sederhana, tanpa infrastruktur baru</td><td>Latensi sebesar interval polling; beban kueri berkala</td></tr>
</tbody>
</table>

<div class="callout info">
    <div class="callout-judul">💡 Outbox memberi at-least-once, bukan exactly-once</div>
    <p>Relay bisa mati setelah mengirim ke Kafka tetapi sebelum menandai baris terkirim, sehingga peristiwa itu dikirim ulang. Itu sebabnya <code>id_peristiwa</code> disertakan sejak awal — konsumen memakainya untuk deduplikasi.</p>
</div>

<h2>Konsumen Idempoten</h2>
<p>Karena Kafka pada praktiknya memberi at-least-once, pemrosesan harus aman diulang. Ada tiga cara, dari yang paling disukai:</p>

<pre>1. Operasi yang secara alami idempoten
   UPDATE pesanan SET status='dibayar' WHERE id=123;
   → dijalankan sepuluh kali, hasilnya sama

2. Upsert dengan kunci alami
   INSERT INTO ringkasan (id, total) VALUES (123, 250000)
   ON CONFLICT (id) DO UPDATE SET total = EXCLUDED.total;

3. Tabel deduplikasi eksplisit
   INSERT INTO peristiwa_terproses (id_peristiwa) VALUES ('evt-abc')
   ON CONFLICT DO NOTHING RETURNING id_peristiwa;
   → tidak ada baris kembali berarti sudah pernah diproses, lewati</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Tabel deduplikasi butuh kebijakan pembersihan</div>
    <p>Tabel <code>peristiwa_terproses</code> tumbuh selamanya bila dibiarkan. Simpan hanya jendela waktu yang lebih panjang daripada retensi topik ditambah kemungkinan replay — misalnya 30 hari — dan hapus sisanya secara terjadwal. Beri indeks pada kolom waktu agar pembersihan tidak menjadi kueri berat.</p>
</div>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Operasi penambahan tidak idempoten</div>
    <p><code>UPDATE saldo SET jumlah = jumlah + 50000</code> menghasilkan hasil berbeda setiap kali diulang. Operasi akumulatif seperti ini <strong>wajib</strong> dilindungi kunci deduplikasi — inilah kategori bug yang berakhir sebagai selisih uang, dan biasanya baru ditemukan saat rekonsiliasi.</p>
</div>

<h2>Retry dan Dead Letter Queue</h2>
<p>Kafka tidak punya redelivery per pesan. Bila satu pesan selalu gagal, konsumen yang mengulanginya terus akan <strong>memblokir seluruh partisi</strong>.</p>

<pre>pesan-1 ✓   pesan-2 ✗ gagal terus   pesan-3 …  pesan-4 …
                    ▲
        seluruh partisi berhenti di sini selamanya</pre>

<p>Bedakan dua jenis kegagalan:</p>
<table>
<thead><tr><th>Jenis</th><th>Contoh</th><th>Penanganan</th></tr></thead>
<tbody>
<tr><td><strong>Sementara</strong></td><td>Basis data timeout, layanan hilir 503</td><td>Retry dengan backoff — pesan berikutnya memang harus menunggu</td></tr>
<tr><td><strong>Permanen</strong></td><td>Pesan rusak, skema tidak valid, id tidak ada</td><td>Kirim ke DLQ dan lanjut — retry tidak akan pernah berhasil</td></tr>
</tbody>
</table>

<pre>Pola topik retry berjenjang:

  pesanan  →  gagal  →  pesanan.retry.5m
                     →  pesanan.retry.30m
                     →  pesanan.dlq   ← perlu campur tangan manusia

Tiap topik retry dikonsumsi oleh worker yang menunda sesuai jenjangnya,
sehingga topik utama tidak pernah tertahan.</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ DLQ yang tidak dipantau sama saja dengan menghapus pesan</div>
    <p>Pesan yang masuk DLQ butuh manusia yang melihatnya. Pasang peringatan pada <strong>jumlah pesan masuk DLQ</strong>, sertakan header diagnostik — pesan galat, jumlah percobaan, topik dan offset asal — dan sediakan cara memasukkan kembali pesan yang sudah diperbaiki.</p>
</div>

<h2>Daftar Periksa Sebelum Produksi</h2>
<ul>
    <li><code>acks=all</code>, <code>enable.idempotence=true</code>, dan callback galat pada semua produser</li>
    <li><code>replication.factor=3</code> dengan <code>min.insync.replicas=2</code> pada semua topik penting</li>
    <li>Kunci pesan dipilih sesuai entitas yang urutannya wajib terjaga</li>
    <li>Auto-commit dimatikan; offset di-commit setelah pemrosesan selesai</li>
    <li>Pemrosesan idempoten atau dilindungi kunci deduplikasi</li>
    <li>DLQ tersedia, terpantau, dan bisa diputar ulang</li>
    <li>Skema terdaftar dengan pemeriksaan kompatibilitas di CI</li>
    <li>Peringatan untuk lag, under-replicated partitions, dan pemakaian disk</li>
    <li><code>auto.create.topics.enable=false</code>, topik dikelola sebagai kode</li>
    <li>Prosedur shutdown yang memanggil flush pada produser dan menutup konsumen dengan rapi</li>
</ul>`,
    perintah: [
        "kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic pesanan.dlq --from-beginning --property print.headers=true",
        "kafka-topics.sh --bootstrap-server localhost:9092 --create --topic pesanan.dlq --partitions 3 --replication-factor 3",
        "kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group pemroses-pesanan --describe",
        "kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group pemroses-dlq --reset-offsets --to-earliest --topic pesanan.dlq --execute"
    ],
    kuis: [
        {
            tanya: "Kenapa menyimpan ke basis data lalu menerbitkan ke Kafka bisa membuat kedua sistem tidak konsisten?",
            opsi: [
                "Karena Kafka selalu lebih lambat daripada basis data",
                "Karena keduanya adalah penulisan terpisah tanpa transaksi bersama, sehingga proses yang mati di antaranya meninggalkan data tanpa peristiwa",
                "Karena Kafka tidak menjamin urutan pesan",
                "Karena basis data akan otomatis membatalkan transaksi bila Kafka tidak merespons"
            ],
            benar: 1,
            penjelasan: "Ini masalah dual write. Tidak ada transaksi yang mencakup basis data dan Kafka sekaligus, sehingga kegagalan di antara keduanya meninggalkan sistem dalam keadaan tidak konsisten. Membalik urutan hanya menukar jenis kegagalannya. Pola outbox menyelesaikannya dengan menjadikan penerbitan peristiwa bagian dari transaksi basis data."
        },
        {
            tanya: "Sebuah pesan rusak selalu gagal diproses dan konsumen terus mengulanginya. Apa dampaknya dan penanganan yang tepat?",
            opsi: [
                "Hanya pesan itu yang tertunda, pesan lain tetap diproses normal",
                "Seluruh partisi berhenti maju; pesan dengan kegagalan permanen harus dipindahkan ke DLQ agar pemrosesan bisa berlanjut",
                "Kafka otomatis memindahkan pesan bermasalah setelah tiga percobaan",
                "Konsumen harus di-restart agar melewati pesan tersebut"
            ],
            benar: 1,
            penjelasan: "Offset dalam satu partisi maju berurutan, sehingga pesan yang tidak pernah selesai memblokir semua pesan setelahnya. Kafka tidak punya redelivery selektif maupun DLQ bawaan. Kegagalan permanen harus dikenali dan dialihkan ke topik DLQ, sementara kegagalan sementara ditangani dengan retry berbackoff."
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
