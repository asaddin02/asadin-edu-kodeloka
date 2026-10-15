/* ==========================================================================
   OPENTELEMETRY — Platform Pembelajaran Interaktif
   ========================================================================== */

const TOPIK_SLUG = "opentelemetry";
const TOPIK_SUB  = "trace, metrik & log";

const MODUL = [
{
    id: 1,
    kategori: "1 · Fondasi",
    judul: "Konsep Inti & Tiga Sinyal",
    tingkat: "Dasar", durasi: "12 mnt",
    tag: ["trace", "metrik", "log", "sinyal"],
    ringkas: "Apa yang sebenarnya distandarkan OpenTelemetry, dan kenapa itu mengubah cara memilih alat pemantauan.",
    isi: `
<h2>Yang Distandarkan dan Yang Tidak</h2>
<p>OpenTelemetry bukan sistem pemantauan. Ia tidak menyimpan data, tidak menggambar grafik, dan tidak mengirim peringatan. Yang disediakannya adalah <strong>cara menghasilkan dan mengirim data telemetri</strong> yang sama di semua bahasa dan semua vendor.</p>

<pre>Disediakan OTel     API, SDK, konvensi penamaan, protokol OTLP, Collector
Bukan bagian OTel   penyimpanan, dasbor, mesin peringatan, analisis</pre>

<div class="callout info">
    <div class="callout-judul">💡 Inilah alasan sesungguhnya OTel diadopsi luas</div>
    <p>Sebelum OTel, mengganti vendor pemantauan berarti mengganti pustaka instrumentasi di seluruh basis kode — pekerjaan berbulan-bulan yang membuat tim terkunci pada satu vendor. Dengan OTel, instrumentasi ditulis sekali dan tujuan pengirimannya cukup diubah pada konfigurasi Collector. Perpindahan vendor menjadi perubahan berkas konfigurasi.</p>
</div>

<h2>Tiga Sinyal, Tiga Pertanyaan Berbeda</h2>
<pre>Trace     Ke mana perginya permintaan ini, dan di mana waktunya habis?
Metrik    Bagaimana kondisi sistem secara agregat sepanjang waktu?
Log       Apa persisnya yang terjadi pada momen tertentu?</pre>

<p>Ketiganya saling melengkapi. Metrik memberi tahu bahwa latensi p99 naik. Trace menunjukkan permintaan mana yang lambat dan pada layanan apa. Log menjelaskan apa yang terjadi di dalam layanan itu.</p>

<h2>Anatomi Trace</h2>
<pre>Trace  ─ satu perjalanan permintaan lengkap, punya trace_id unik
  └─ Span ─ satu unit kerja di dalamnya, punya span_id

Trace: GET /pesanan/123        [========================] 240ms
  ├─ Span: autentikasi          [==]                        18ms
  ├─ Span: kueri basis data       [======]                  62ms
  ├─ Span: panggil layanan-stok        [==========]        118ms
  │    └─ Span: kueri stok              [=======]           94ms
  └─ Span: susun balasan                      [==]          22ms</pre>

<p>Setiap span menyimpan <code>parent_span_id</code>, dan dari relasi itulah bentuk pohon tersusun. Span tanpa induk disebut <em>root span</em> — biasanya titik masuk permintaan.</p>

<h2>Isi Sebuah Span</h2>
<pre>Nama          "GET /pesanan/:id"    — pola rute, BUKAN URL sesungguhnya
trace_id      128 bit
span_id       64 bit
parent_span_id
Waktu mulai & selesai
Atribut       pasangan kunci-nilai deskriptif
Peristiwa     kejadian berstempel waktu di dalam span
Status        Unset, Ok, atau Error
Tautan        hubungan ke span lain di trace berbeda</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Jangan memasukkan nilai bervariasi ke dalam nama span</div>
    <p>Menamai span <code>GET /pesanan/12345</code> menghasilkan nama unik untuk setiap permintaan. Alat analisis mengelompokkan berdasarkan nama span, sehingga tidak ada lagi kelompok yang bermakna — mustahil melihat "berapa p99 endpoint ini" karena setiap permintaan menjadi endpoint tersendiri. Gunakan pola rute sebagai nama, dan taruh ID pada atribut.</p>
    <pre>span.updateName("GET /pesanan/:id");
span.setAttribute("pesanan.id", "12345");</pre>
</div>

<h2>Konteks dan Perambatan</h2>
<p>Agar span di layanan berbeda tergabung dalam satu trace, <code>trace_id</code> harus ikut menyeberang batas jaringan. Standarnya adalah header W3C Trace Context:</p>

<pre>traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             │  │                                │                │
             │  trace_id (16 byte)               span_id          flag
             versi                               induk            01 = disampel</pre>

<h2>Sumber Daya: Identitas Penghasil Telemetri</h2>
<pre>service.name         wajib — tanpa ini data sulit ditelusuri
service.version
service.namespace
deployment.environment
host.name
k8s.pod.name</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Tanpa <code>service.name</code>, telemetri masuk sebagai "unknown_service"</div>
    <p>Ini kesalahan paling umum saat pertama kali menyiapkan OTel. Data terkirim dengan benar, tetapi semua layanan menumpuk di bawah satu nama tak dikenal sehingga tidak dapat dibedakan. Setel lewat variabel lingkungan <code>OTEL_SERVICE_NAME</code> atau melalui Resource pada SDK.</p>
</div>

<h2>Konvensi Semantik</h2>
<pre>http.request.method     GET
url.path                /pesanan/123
http.response.status_code  200
server.address          api.contoh.id
db.system               postgresql
db.query.text           SELECT * FROM pesanan WHERE id = $1</pre>

<div class="callout info">
    <div class="callout-judul">💡 Nama atribut yang seragam membuat dasbor bekerja tanpa disesuaikan</div>
    <p>Bila satu layanan memakai <code>http.status</code> dan lainnya <code>status_code</code>, setiap kueri analisis harus menangani keduanya. Konvensi semantik menetapkan nama baku sehingga dasbor dan peringatan berlaku di seluruh layanan tanpa penyesuaian per bahasa. Perhatikan bahwa konvensi ini sempat berubah — atribut lama seperti <code>http.method</code> kini menjadi <code>http.request.method</code>.</p>
</div>`,
    perintah: [
        "export OTEL_SERVICE_NAME=layanan-pesanan",
        "export OTEL_EXPORTER_OTLP_ENDPOINT=http://collector:4317",
        "export OTEL_RESOURCE_ATTRIBUTES=deployment.environment=produksi",
        "curl -H 'traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01' http://localhost:3000/",
        "env | grep OTEL"
    ],
    kuis: [
        {
            tanya: "Kenapa memasukkan ID pesanan ke dalam nama span merusak analisis?",
            opsi: [
                "Karena nama span dibatasi maksimal 32 karakter",
                "Karena alat analisis mengelompokkan berdasarkan nama span, sehingga setiap permintaan menjadi kelompok tersendiri dan agregat seperti p99 per endpoint tidak lagi terbentuk",
                "Karena ID pesanan dianggap data sensitif oleh SDK",
                "Karena nama span harus sama dengan service.name"
            ],
            benar: 1,
            penjelasan: "Nama span berfungsi sebagai kunci pengelompokan. Bila nilainya bervariasi tiap permintaan, kardinalitasnya meledak dan tidak ada dua span yang masuk kelompok sama, sehingga statistik per endpoint mustahil dihitung. Pola yang benar adalah memakai pola rute sebagai nama dan menyimpan nilai yang bervariasi sebagai atribut."
        },
        {
            tanya: "Apa yang sebenarnya distandarkan OpenTelemetry?",
            opsi: [
                "Penyimpanan telemetri beserta antarmuka dasbornya",
                "Cara menghasilkan dan mengirim telemetri — API, SDK, konvensi penamaan, dan protokol — sedangkan penyimpanan serta analisis diserahkan kepada backend pilihan",
                "Format basis data untuk menyimpan trace jangka panjang",
                "Aturan penulisan peringatan dan ambang batasnya"
            ],
            benar: 1,
            penjelasan: "OpenTelemetry berhenti di titik pengiriman data. Dengan menstandarkan instrumentasi dan protokol OTLP, kode aplikasi tidak lagi terikat pada satu vendor: mengganti backend cukup dengan mengubah tujuan ekspor pada konfigurasi, tanpa menyentuh instrumentasi di basis kode."
        },
        {
            tanya: "Header traceparent berisi apa saja dan untuk apa?",
            opsi: [
                "Nama layanan dan versinya, agar backend dapat mengelompokkan data",
                "trace_id, span_id induk, dan flag pengambilan sampel — agar span yang dibuat layanan berikutnya bergabung ke trace yang sama",
                "Waktu mulai dan durasi span, agar penerima dapat menghitung latensi",
                "Daftar atribut yang harus disalin ke seluruh span turunan"
            ],
            benar: 1,
            penjelasan: "Perambatan konteks membawa identitas trace melintasi batas jaringan. Layanan penerima membaca trace_id untuk melanjutkan trace yang sama dan span_id sebagai induk span barunya, sementara flag memberi tahu apakah trace ini sedang disampel. Tanpa header ini, setiap layanan menghasilkan trace terpisah yang tidak dapat dirangkai."
        }
    ]
},
{
    id: 2,
    kategori: "1 · Fondasi",
    judul: "Instrumentasi Otomatis & Manual",
    tingkat: "Dasar", durasi: "13 mnt",
    tag: ["SDK", "auto-instrumentation", "span", "atribut"],
    ringkas: "Memasang instrumentasi tanpa mengubah kode, lalu menambahkan span sendiri di tempat yang memang penting.",
    isi: `
<h2>Mulai dari Instrumentasi Otomatis</h2>
<p>Instrumentasi otomatis membungkus pustaka populer — kerangka kerja HTTP, klien basis data, klien pesan — dan menghasilkan span tanpa perubahan kode aplikasi. Ini titik awal yang benar karena langsung memberi gambaran utuh sebelum satu baris pun ditulis.</p>

<pre># Node.js
npm install @opentelemetry/auto-instrumentations-node
node --require @opentelemetry/auto-instrumentations-node/register app.js

# Python
pip install opentelemetry-distro opentelemetry-instrumentation
opentelemetry-bootstrap -a install
opentelemetry-instrument python app.py

# Java — agen tanpa perubahan kode sama sekali
java -javaagent:opentelemetry-javaagent.jar -jar aplikasi.jar</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Go tidak memiliki instrumentasi otomatis penuh</div>
    <p>Karena Go dikompilasi statis tanpa mekanisme penambalan saat runtime, pendekatan agen seperti pada Java tidak tersedia. Instrumentasi Go dilakukan dengan membungkus handler dan klien secara eksplisit menggunakan paket <code>otelhttp</code>, <code>otelgrpc</code>, dan sejenisnya. Rencanakan usaha lebih besar untuk layanan Go.</p>
</div>

<h2>Menyiapkan SDK</h2>
<pre>import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        "service.name": "layanan-pesanan",
        "service.version": "2.4.1",
        "deployment.environment": "produksi"
    }),
    traceExporter: new OTLPTraceExporter({ url: "http://collector:4317" }),
    instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();

process.on("SIGTERM", () => {
    sdk.shutdown().finally(() => process.exit(0));
});</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Tanpa shutdown yang rapi, span terakhir hilang</div>
    <p>Prosesor batch menahan span di memori sampai batas waktu atau ukuran batch tercapai. Bila proses berhenti tanpa <code>shutdown()</code>, seluruh isi buffer lenyap — dan justru span-span itulah yang paling dibutuhkan, karena berkaitan dengan momen aplikasi bermasalah atau dimatikan. Selalu pasang penangan SIGTERM.</p>
</div>

<h2>Menambahkan Span Sendiri</h2>
<pre>import { trace, SpanStatusCode } from "@opentelemetry/api";

const tracer = trace.getTracer("layanan-pesanan", "2.4.1");

async function prosesPesanan(pesanan) {
    return tracer.startActiveSpan("proses-pesanan", async (span) => {
        try {
            span.setAttribute("pesanan.id", pesanan.id);
            span.setAttribute("pesanan.jumlah_item", pesanan.item.length);
            span.setAttribute("pesanan.total", pesanan.total);

            await validasi(pesanan);
            span.addEvent("validasi-selesai");

            const hasil = await bayar(pesanan);
            span.setAttribute("pembayaran.penyedia", hasil.penyedia);

            span.setStatus({ code: SpanStatusCode.OK });
            return hasil;
        } catch (e) {
            span.recordException(e);
            span.setStatus({ code: SpanStatusCode.ERROR, message: e.message });
            throw e;
        } finally {
            span.end();                    // WAJIB, apa pun yang terjadi
        }
    });
}</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Span yang tidak pernah di-end adalah kebocoran memori</div>
    <p>Span aktif tetap tersimpan di memori sampai ditutup. Bila jalur galat melewati <code>span.end()</code>, span menumpuk seiring waktu hingga proses kehabisan memori — dan trace-nya tidak pernah terkirim sehingga masalahnya tak terlihat di backend. Selalu letakkan <code>end()</code> pada blok <code>finally</code>.</p>
</div>

<h2>startActiveSpan versus startSpan</h2>
<pre>// startActiveSpan — span menjadi induk otomatis bagi span di dalamnya
tracer.startActiveSpan("induk", (span) => {
    panggilFungsiLain();       // span di sini otomatis menjadi anak
    span.end();
});

// startSpan — TIDAK masuk konteks aktif
const span = tracer.startSpan("terpisah");
panggilFungsiLain();           // span di sini TIDAK menjadi anak
span.end();</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Trace yang terputus biasanya berasal dari pilihan ini</div>
    <p>Gejalanya khas: span muncul di backend tetapi sebagai trace terpisah tanpa induk, sehingga rangkaian permintaan terpecah-pecah. Penyebab paling umum adalah pemakaian <code>startSpan</code> ketika yang dibutuhkan <code>startActiveSpan</code>. Penyebab kedua adalah konteks yang hilang saat melintasi antrean callback atau pekerjaan latar.</p>
</div>

<h2>Atribut yang Layak Ditambahkan</h2>
<pre>Berguna     ID entitas, nama penyewa, jenis paket langganan,
            varian uji A/B, versi klien, hasil keputusan bisnis,
            jumlah item, ukuran hasil, status cache

Hindari     seluruh badan permintaan, sandi, token, data pribadi,
            nomor kartu, isi respons berukuran besar</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Atribut ikut terkirim ke backend pihak ketiga</div>
    <p>Telemetri sering dikirim ke layanan SaaS dengan kendali akses yang berbeda dari basis data produksi. Data pribadi yang masuk sebagai atribut span berpindah ke sana dan tersimpan berbulan-bulan. Perlakukan atribut seperti log: sunting field sensitif sebelum ditambahkan, atau bersihkan di Collector dengan prosesor <code>attributes</code>.</p>
</div>`,
    perintah: [
        "node --require @opentelemetry/auto-instrumentations-node/register app.js",
        "opentelemetry-instrument python app.py",
        "OTEL_LOG_LEVEL=debug node app.js",
        "OTEL_TRACES_EXPORTER=console node app.js",
        "opentelemetry-bootstrap -a install"
    ],
    kuis: [
        {
            tanya: "Kenapa penangan SIGTERM yang memanggil sdk.shutdown() penting?",
            opsi: [
                "Agar SDK menutup koneksi ke basis data aplikasi",
                "Agar span yang masih tertahan di buffer prosesor batch dikirim sebelum proses berakhir, bukan hilang bersama memorinya",
                "Agar service.name terlepas dari registri backend",
                "Agar instrumentasi otomatis dapat dilepas dengan bersih"
            ],
            benar: 1,
            penjelasan: "Prosesor batch menahan span di memori sampai batas ukuran atau waktu tercapai demi efisiensi jaringan. Penghentian mendadak membuang isi buffer itu, dan span yang hilang justru berkaitan dengan detik-detik terakhir sebelum layanan berhenti — periode yang paling sering diselidiki. Pemanggilan shutdown memaksa pengosongan buffer lebih dulu."
        },
        {
            tanya: "Span muncul di backend tetapi sebagai trace terpisah tanpa induk. Apa penyebab paling umum di dalam satu proses?",
            opsi: [
                "Eksportir dikonfigurasi dengan endpoint yang salah",
                "Span dibuat dengan startSpan sehingga tidak masuk ke konteks aktif, dan span berikutnya tidak menemukannya sebagai induk",
                "service.name berbeda antara span induk dan anak",
                "Pengambilan sampel menolak span induknya"
            ],
            benar: 1,
            penjelasan: "startSpan menghasilkan span tanpa memasukkannya ke konteks aktif, sehingga kode yang berjalan sesudahnya tidak melihat span itu sebagai induk. Akibatnya hierarki terputus dan setiap span menjadi root tersendiri. startActiveSpan menempatkan span ke konteks aktif selama callback berjalan sehingga span turunan terhubung otomatis."
        },
        {
            tanya: "Kenapa data pribadi tidak boleh disimpan sebagai atribut span?",
            opsi: [
                "Karena atribut dibatasi maksimal 128 byte",
                "Karena telemetri sering dikirim ke backend pihak ketiga dengan kendali akses berbeda dan tersimpan lama, sehingga data itu tersebar di luar batas yang dimaksudkan",
                "Karena SDK menolak atribut yang mengandung teks panjang",
                "Karena atribut tidak terenkripsi saat disimpan di memori"
            ],
            benar: 1,
            penjelasan: "Atribut span mengalir ke sistem observabilitas yang biasanya diakses lebih banyak orang daripada basis data produksi, dan disimpan sesuai retensi backend. Data pribadi atau kredensial yang masuk ke sana menjadi paparan tambahan yang mudah terlewat saat audit. Sunting di titik pembuatan, atau bersihkan di Collector dengan prosesor attributes."
        }
    ]
},
{
    id: 3,
    kategori: "2 · Collector",
    judul: "OpenTelemetry Collector",
    tingkat: "Menengah", durasi: "14 mnt",
    tag: ["collector", "pipeline", "processor", "exporter"],
    ringkas: "Lapis perantara yang menerima, mengolah, dan meneruskan telemetri — dan kenapa hampir selalu layak dipasang.",
    isi: `
<h2>Kenapa Tidak Mengirim Langsung ke Backend</h2>
<pre>Tanpa Collector
  aplikasi → backend
  · setiap perubahan tujuan menuntut penerapan ulang aplikasi
  · setiap aplikasi menahan buffer dan menangani percobaan ulang sendiri
  · penyuntingan data sensitif tersebar di banyak basis kode

Dengan Collector
  aplikasi → collector → satu atau banyak backend
  · tujuan diubah lewat konfigurasi, tanpa menyentuh aplikasi
  · buffer, percobaan ulang, dan pembatasan terpusat
  · penyuntingan dan pengayaan dilakukan di satu tempat</pre>

<h2>Struktur Konfigurasi</h2>
<pre>receivers:
  otlp:
    protocols:
      grpc: { endpoint: 0.0.0.0:4317 }
      http: { endpoint: 0.0.0.0:4318 }

processors:
  memory_limiter:
    check_interval: 1s
    limit_mib: 1500
    spike_limit_mib: 300

  batch:
    timeout: 5s
    send_batch_size: 8192

  resource:
    attributes:
      - key: deployment.environment
        value: produksi
        action: upsert

exporters:
  otlp/tempo:
    endpoint: tempo:4317
    tls: { insecure: true }
  prometheus:
    endpoint: 0.0.0.0:8889

service:
  pipelines:
    traces:
      receivers:  [otlp]
      processors: [memory_limiter, resource, batch]
      exporters:  [otlp/tempo]
    metrics:
      receivers:  [otlp]
      processors: [memory_limiter, batch]
      exporters:  [prometheus]</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Urutan prosesor menentukan perilaku, dan salah urut merusaknya</div>
    <p><code>memory_limiter</code> harus berada <strong>paling depan</strong> — kalau tidak, data sudah terlanjur menumpuk di prosesor sebelumnya sebelum batas memori sempat diperiksa, dan Collector tetap kehabisan memori. Sebaliknya <code>batch</code> harus <strong>paling belakang</strong> supaya prosesor lain bekerja pada data yang belum dikelompokkan. Untuk pengambilan sampel berbasis ekor, <code>tail_sampling</code> harus mendahului <code>batch</code>.</p>
</div>

<h2>Menyunting Data Sensitif</h2>
<pre>processors:
  attributes/sunting:
    actions:
      - key: http.request.header.authorization
        action: delete
      - key: pengguna.surel
        action: hash
      - key: db.query.text
        action: delete

  redaction:
    allow_all_keys: false
    allowed_keys: [http.request.method, url.path, service.name]
    blocked_values: ["4[0-9]{12}(?:[0-9]{3})?"]</pre>

<h2>Dua Pola Penerapan</h2>
<pre>Agen — satu Collector per host atau sebagai sidecar
  + latensi rendah, aplikasi cukup mengirim ke localhost
  + dapat menambahkan metadata host dan pod
  − banyak instans untuk dikelola

Gateway — kelompok Collector terpusat di belakang penyeimbang beban
  + tempat ideal untuk sampling ekor dan kebijakan terpusat
  + jumlah koneksi ke backend jauh lebih sedikit
  − titik kegagalan tambahan bila tidak diberi redundansi

Umum dipakai bersama: aplikasi → agen → gateway → backend</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Sampling berbasis ekor menuntut semua span satu trace tiba di instans yang sama</div>
    <p>Keputusan sampling ekor diambil setelah trace lengkap, sehingga seluruh span dengan <code>trace_id</code> sama harus dikumpulkan pada satu Collector. Bila gateway diberi penyeimbang beban round robin biasa, span satu trace tersebar ke beberapa instans dan setiap instans hanya melihat sebagian — keputusannya menjadi salah dan trace terpotong. Gunakan <code>loadbalancing</code> exporter yang merutekan berdasarkan <code>trace_id</code>.</p>
</div>

<h2>Menjaga Collector Tetap Sehat</h2>
<pre>extensions:
  health_check: { endpoint: 0.0.0.0:13133 }
  pprof:        { endpoint: 0.0.0.0:1777 }
  zpages:       { endpoint: 0.0.0.0:55679 }

service:
  extensions: [health_check, pprof, zpages]
  telemetry:
    metrics:
      level: detailed
    logs:
      level: info</pre>

<p>Metrik yang wajib dipantau:</p>
<pre>otelcol_receiver_refused_spans        ditolak — biasanya batas memori
otelcol_exporter_send_failed_spans    gagal terkirim ke backend
otelcol_exporter_queue_size           antrean menumpuk
otelcol_processor_dropped_spans       span dibuang</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Collector yang tumbang membuat kebutaan total tanpa peringatan</div>
    <p>Ketika Collector mati, aplikasi tetap berjalan normal — telemetri hanya berhenti mengalir. Tanpa peringatan khusus pada Collector itu sendiri, tim baru menyadarinya saat membutuhkan data untuk menyelidiki insiden dan menemukan grafik kosong. Pantau Collector dengan sistem yang tidak bergantung pada Collector tersebut.</p>
</div>

<h2>Transformasi dengan OTTL</h2>
<pre>processors:
  transform:
    trace_statements:
      - context: span
        statements:
          - set(status.code, STATUS_CODE_ERROR)
            where attributes["http.response.status_code"] >= 500
          - delete_key(attributes, "http.request.header.cookie")
          - replace_pattern(name, "/pesanan/[0-9]+", "/pesanan/{id}")</pre>

<p>Baris terakhir menyelamatkan situasi yang sering terjadi: layanan lama yang menaruh ID pada nama span dapat diperbaiki di Collector tanpa menunggu perubahan kode diterapkan.</p>`,
    perintah: [
        "otelcol validate --config=config.yaml",
        "curl http://collector:13133/",
        "curl -s http://collector:8888/metrics | grep refused",
        "curl http://collector:55679/debug/tracez",
        "docker logs -f otel-collector"
    ],
    kuis: [
        {
            tanya: "Kenapa memory_limiter harus menjadi prosesor pertama dalam pipeline?",
            opsi: [
                "Karena prosesor lain membutuhkan hasil perhitungannya",
                "Karena bila diletakkan setelah prosesor lain, data sudah menumpuk di memori sebelum batas sempat diperiksa sehingga Collector tetap kehabisan memori",
                "Karena hanya prosesor pertama yang dijalankan untuk setiap batch",
                "Karena memory_limiter tidak dapat membaca data yang sudah dikelompokkan"
            ],
            benar: 1,
            penjelasan: "memory_limiter melindungi Collector dengan menolak data masuk ketika pemakaian memori mendekati batas. Perlindungan itu hanya efektif bila ia memeriksa data sebelum prosesor lain menyimpannya di memori. Sebaliknya batch diletakkan terakhir agar prosesor lain bekerja pada data individual sebelum dikelompokkan untuk pengiriman."
        },
        {
            tanya: "Sampling berbasis ekor diterapkan pada kelompok Collector di belakang penyeimbang beban round robin, dan hasilnya banyak trace terpotong. Kenapa?",
            opsi: [
                "Karena round robin membuat sebagian permintaan tidak pernah sampai ke Collector",
                "Karena span dari satu trace tersebar ke beberapa instans, sehingga tiap instans hanya melihat sebagian trace dan mengambil keputusan sampling yang tidak konsisten",
                "Karena sampling ekor tidak dapat berjalan pada lebih dari satu instans",
                "Karena penyeimbang beban menghapus header traceparent"
            ],
            benar: 1,
            penjelasan: "Keputusan sampling ekor memerlukan trace yang utuh, sehingga seluruh span dengan trace_id sama wajib berkumpul di instans yang sama. Round robin memecah span satu trace ke beberapa instans dan masing-masing menilai berdasarkan potongan yang dilihatnya. Solusinya adalah lapisan yang merutekan berdasarkan trace_id, misalnya loadbalancing exporter."
        },
        {
            tanya: "Apa keuntungan utama menempatkan Collector di antara aplikasi dan backend?",
            opsi: [
                "Telemetri menjadi lebih akurat karena diverifikasi ulang",
                "Tujuan pengiriman, penyuntingan data sensitif, pembatasan, dan percobaan ulang dikelola terpusat lewat konfigurasi tanpa menerapkan ulang aplikasi",
                "Aplikasi tidak perlu lagi memakai SDK OpenTelemetry",
                "Backend dapat membaca data tanpa protokol OTLP"
            ],
            benar: 1,
            penjelasan: "Collector memindahkan urusan operasional keluar dari aplikasi. Mengganti backend, menambah tujuan kedua, menyunting atribut sensitif, atau menyetel percobaan ulang cukup dilakukan pada konfigurasi Collector. Tanpa itu, setiap perubahan semacam ini menuntut pembaruan kode dan penerapan ulang di seluruh layanan."
        }
    ]
},
{
    id: 4,
    kategori: "2 · Collector",
    judul: "Pengambilan Sampel",
    tingkat: "Menengah", durasi: "13 mnt",
    tag: ["sampling", "head", "tail", "biaya"],
    ringkas: "Menyimpan trace yang penting tanpa membayar untuk seluruh lalu lintas — beserta konsekuensi tiap pilihannya.",
    isi: `
<h2>Kenapa Harus Mengambil Sampel</h2>
<p>Layanan dengan 10.000 permintaan per detik dan rata-rata 20 span per permintaan menghasilkan 200.000 span per detik. Menyimpan semuanya berarti puluhan terabita per hari dan biaya yang sering melampaui biaya menjalankan layanan itu sendiri.</p>

<h2>Sampling Kepala</h2>
<p>Keputusan diambil di awal, saat trace dimulai, sebelum apa pun diketahui tentang hasilnya.</p>

<pre>export OTEL_TRACES_SAMPLER=parentbased_traceidratio
export OTEL_TRACES_SAMPLER_ARG=0.1        # 10 persen</pre>

<pre>Kelebihan   murah, sederhana, beban aplikasi kecil
            keputusan seragam di seluruh layanan lewat trace_id
Kekurangan  galat dan permintaan lambat ikut terbuang secara acak</pre>

<div class="callout info">
    <div class="callout-judul">💡 Kenapa "parent based" penting</div>
    <p>Sampler ini menghormati keputusan yang sudah dibuat layanan sebelumnya melalui flag pada header <code>traceparent</code>. Tanpa itu, setiap layanan memutuskan sendiri — layanan A menyimpan, layanan B membuang — dan hasilnya trace bolong-bolong yang justru menyesatkan saat dibaca.</p>
</div>

<h2>Sampling Ekor</h2>
<p>Collector menahan seluruh span sebuah trace, menunggu trace selesai, lalu memutuskan berdasarkan apa yang sungguh terjadi.</p>

<pre>processors:
  tail_sampling:
    decision_wait: 10s
    num_traces: 100000
    policies:
      - name: semua-galat
        type: status_code
        status_code: { status_codes: [ERROR] }

      - name: yang-lambat
        type: latency
        latency: { threshold_ms: 1000 }

      - name: endpoint-penting
        type: string_attribute
        string_attribute:
          key: url.path
          values: ["/pembayaran", "/checkout"]

      - name: sisanya-sedikit
        type: probabilistic
        probabilistic: { sampling_percentage: 5 }</pre>

<p>Hasilnya jauh lebih berguna: seluruh galat tersimpan, seluruh permintaan lambat tersimpan, dan lalu lintas normal cukup diwakili lima persen sebagai pembanding.</p>

<div class="callout bahaya">
    <div class="callout-judul">🚫 decision_wait yang lebih pendek dari trace terpanjang memotong trace</div>
    <p>Collector menunggu selama <code>decision_wait</code> sejak span pertama, lalu memutuskan. Span yang datang setelah tenggat itu dibuang. Bila ada permintaan yang berjalan 30 detik sementara <code>decision_wait</code> disetel 10 detik, trace-nya tersimpan setengah — dan tepat bagian akhir yang hilang, yaitu bagian yang biasanya paling ingin dilihat. Setel di atas latensi maksimum yang wajar.</p>
</div>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Sampling ekor memakan memori sebanding dengan lalu lintas</div>
    <p>Seluruh span harus ditahan sampai keputusan diambil. Perkiraan kasarnya: <code>laju span × decision_wait × ukuran rata-rata span</code>. Pada 200.000 span per detik dengan jendela 10 detik dan span 500 byte, dibutuhkan sekitar 1 GB memori hanya untuk penampungan. Batasi dengan <code>num_traces</code> dan pantau metrik memori Collector.</p>
</div>

<h2>Menggabungkan Keduanya</h2>
<pre>Aplikasi     sampling kepala 30 persen  → tekan volume jaringan
Collector    sampling ekor pada sisanya → simpan galat & yang lambat
Hasil        biaya terkendali, trace penting tetap utuh</pre>

<p>Perlu diingat bahwa galat yang sudah terbuang oleh sampling kepala tidak dapat dipulihkan oleh sampling ekor. Bila seluruh galat wajib tersimpan, sampling kepala harus 100 persen dan seleksi sepenuhnya diserahkan ke ekor.</p>

<h2>Dampak pada Metrik</h2>
<div class="callout bahaya">
    <div class="callout-judul">🚫 Jangan menghitung metrik dari trace yang sudah disampel</div>
    <p>Bila hanya 10 persen trace disimpan lalu jumlah galat dihitung dari sana, angkanya sepuluh kali lebih kecil dari kenyataan — dan tidak ada indikasi apa pun bahwa angka itu salah. Metrik harus dihasilkan dari <em>seluruh</em> permintaan, sebelum sampling. Prosesor <code>spanmetrics</code> di Collector melakukan tepat itu: menghitung metrik dari semua span yang masuk, baru sampling diterapkan sesudahnya.</p>
    <pre>connectors:
  spanmetrics:
    histogram:
      explicit:
        buckets: [10ms, 50ms, 100ms, 500ms, 1s, 5s]

service:
  pipelines:
    traces:
      exporters: [spanmetrics, otlp/tempo]
    metrics/dari-span:
      receivers: [spanmetrics]
      exporters: [prometheus]</pre>
</div>

<h2>Titik Awal yang Masuk Akal</h2>
<pre>Lalu lintas rendah      simpan semua, jangan repot menyetel sampling
Menengah                sampling ekor: galat 100%, lambat 100%, normal 10%
Tinggi                  kepala 20% + ekor pada sisanya
Sangat tinggi           kepala 1–5% + ekor, spanmetrics untuk angka sebenarnya</pre>`,
    perintah: [
        "export OTEL_TRACES_SAMPLER=parentbased_traceidratio",
        "export OTEL_TRACES_SAMPLER_ARG=0.1",
        "curl -s http://collector:8888/metrics | grep tail_sampling",
        "curl -s http://collector:8888/metrics | grep -i memory",
        "otelcol validate --config=config.yaml"
    ],
    kuis: [
        {
            tanya: "Apa keunggulan utama sampling ekor dibanding sampling kepala?",
            opsi: [
                "Memakai memori dan CPU jauh lebih sedikit di Collector",
                "Keputusan diambil setelah trace selesai, sehingga seluruh galat dan permintaan lambat dapat disimpan sementara lalu lintas normal cukup diwakili sebagian",
                "Tidak memerlukan perambatan konteks antar layanan",
                "Menjamin setiap trace tersimpan tanpa terkecuali"
            ],
            benar: 1,
            penjelasan: "Sampling kepala memutuskan sebelum hasil permintaan diketahui, sehingga galat dan permintaan lambat terbuang secara acak seperti lalu lintas biasa. Sampling ekor menunggu trace lengkap dan menerapkan kebijakan berdasarkan status serta latensi sesungguhnya. Harganya adalah kebutuhan memori untuk menahan span selama jendela keputusan."
        },
        {
            tanya: "Kenapa menghitung jumlah galat dari trace yang sudah disampel menghasilkan angka yang menyesatkan?",
            opsi: [
                "Karena trace yang disampel kehilangan atribut statusnya",
                "Karena hanya sebagian trace yang tersimpan, sehingga hitungannya mengecil sebanding rasio sampling tanpa tanda apa pun bahwa angka itu tidak lengkap",
                "Karena backend menolak mengagregasi trace yang disampel",
                "Karena trace yang disampel disimpan tanpa stempel waktu"
            ],
            benar: 1,
            penjelasan: "Trace yang tersimpan hanya mewakili sebagian lalu lintas, sehingga agregat apa pun yang dihitung darinya mengecil sesuai rasio sampling. Metrik harus dihasilkan dari seluruh permintaan sebelum sampling diterapkan. Konektor spanmetrics menghitung metrik dari semua span yang masuk ke Collector, sehingga angkanya tetap benar berapa pun rasio sampling yang dipakai sesudahnya."
        },
        {
            tanya: "Permintaan yang berjalan 30 detik menghasilkan trace yang terpotong di bagian akhir, sementara decision_wait disetel 10 detik. Apa yang terjadi?",
            opsi: [
                "Collector kehabisan memori dan membuang sisa span",
                "Keputusan sampling diambil 10 detik setelah span pertama, dan span yang tiba setelah tenggat itu dibuang",
                "Backend menolak span dengan stempel waktu lebih lama dari 10 detik",
                "Sampler kepala membatalkan trace di tengah jalan"
            ],
            benar: 1,
            penjelasan: "decision_wait menentukan berapa lama Collector menahan span sebelum menilai trace. Setelah keputusan diambil, buffer untuk trace itu dilepas dan span yang datang terlambat tidak lagi punya tempat. Nilainya harus melebihi latensi maksimum yang wajar, dengan konsekuensi kebutuhan memori penampungan yang lebih besar."
        }
    ]
},
{
    id: 5,
    kategori: "3 · Metrik & Log",
    judul: "Metrik & Instrumen",
    tingkat: "Menengah", durasi: "13 mnt",
    tag: ["counter", "histogram", "gauge", "kardinalitas"],
    ringkas: "Memilih jenis instrumen yang tepat, dan menghindari ledakan kardinalitas yang menjatuhkan sistem metrik.",
    isi: `
<h2>Jenis Instrumen</h2>
<pre>Counter                  hanya naik           permintaan, galat, byte terkirim
UpDownCounter            naik dan turun       koneksi aktif, antrean
Histogram                sebaran nilai        latensi, ukuran muatan
Gauge (asinkron)         nilai saat diamati   pemakaian memori, suhu
Counter asinkron         diamati berkala      penghitung dari sumber luar</pre>

<pre>import { metrics } from "@opentelemetry/api";

const meter = metrics.getMeter("layanan-pesanan", "2.4.1");

const pesananDibuat = meter.createCounter("pesanan.dibuat", {
    description: "Jumlah pesanan yang berhasil dibuat",
    unit: "{pesanan}"
});

const durasiProses = meter.createHistogram("pesanan.durasi_proses", {
    description: "Waktu memproses pesanan",
    unit: "ms"
});

const antreanAktif = meter.createUpDownCounter("pesanan.antrean", {
    unit: "{pesanan}"
});

pesananDibuat.add(1, { "pesanan.jenis": "langganan", "wilayah": "id-jkt" });
durasiProses.record(142, { "pesanan.jenis": "langganan" });</pre>

<h2>Kardinalitas: Bahaya Terbesar pada Metrik</h2>
<p>Setiap kombinasi unik nilai atribut menghasilkan <strong>deret waktu tersendiri</strong> yang disimpan terpisah. Jumlahnya berlipat, bukan bertambah.</p>

<pre>pesanan.dibuat{jenis, wilayah, status}
  jenis    5 nilai
  wilayah  8 nilai
  status   4 nilai
  → 5 × 8 × 4 = 160 deret waktu — masih aman

pesanan.dibuat{jenis, wilayah, status, pengguna_id}
  pengguna_id  500.000 nilai
  → 80.000.000 deret waktu — sistem metrik tumbang</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Jangan pernah memasang ID sebagai label metrik</div>
    <p>ID pengguna, ID pesanan, ID sesi, alamat IP, dan URL lengkap dengan parameter — semuanya memiliki kardinalitas tak terbatas. Satu penerapan yang menambahkan label semacam ini dapat menjatuhkan Prometheus dalam hitungan menit dan membuat seluruh pemantauan buta persis saat dibutuhkan. Nilai per-entitas adalah wilayah trace dan log, bukan metrik.</p>
</div>

<h2>Histogram dan Pemilihan Bucket</h2>
<pre>const durasi = meter.createHistogram("http.server.request.duration", {
    unit: "s",
    advice: {
        explicitBucketBoundaries: [0.005, 0.01, 0.025, 0.05, 0.1,
                                   0.25, 0.5, 1, 2.5, 5, 10]
    }
});</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Persentil hanya seakurat batas bucket di sekitarnya</div>
    <p>Nilai p99 dihitung dengan interpolasi di dalam bucket tempat ia jatuh. Bila mayoritas permintaan berada antara 100 dan 250 milidetik sementara bucket melompat dari 0,1 langsung ke 0,25, seluruh persentil di rentang itu hanya perkiraan kasar. Sesuaikan batas bucket dengan sebaran latensi yang sebenarnya, bukan memakai nilai bawaan begitu saja.</p>
</div>

<h2>Temporalitas: Delta atau Kumulatif</h2>
<pre>Kumulatif   nilai terus bertambah sejak proses dimulai
            → yang diharapkan Prometheus
Delta       perubahan sejak pelaporan terakhir
            → yang diharapkan sebagian besar backend SaaS

export OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE=delta</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Ketidakcocokan temporalitas menghasilkan grafik yang salah tanpa galat</div>
    <p>Bila backend mengharapkan kumulatif tetapi menerima delta, tidak ada pesan kesalahan — angkanya sekadar keliru, biasanya jauh lebih kecil dan naik-turun tanpa pola. Ini termasuk masalah OTel yang paling lama tidak disadari karena semuanya tampak berjalan normal. Periksa preferensi temporalitas backend saat pertama kali menyiapkan metrik.</p>
</div>

<h2>Log yang Terhubung ke Trace</h2>
<pre>import { trace } from "@opentelemetry/api";

function log(pesan, data = {}) {
    const span = trace.getActiveSpan();
    const ctx = span?.spanContext();
    console.log(JSON.stringify({
        waktu: new Date().toISOString(),
        pesan,
        trace_id: ctx?.traceId,
        span_id:  ctx?.spanId,
        ...data
    }));
}</pre>

<div class="callout info">
    <div class="callout-judul">💡 trace_id di dalam log adalah penghubung yang mengubah alur penyelidikan</div>
    <p>Tanpa itu, menyelidiki insiden berarti mencocokkan stempel waktu antara trace dan log secara manual — lambat dan sering salah pada sistem yang sibuk. Dengan <code>trace_id</code> tercatat, satu klik dari span membuka seluruh log permintaan tersebut di semua layanan yang dilaluinya. Ini perubahan kecil di kode dengan dampak terbesar pada kecepatan penyelidikan.</p>
</div>

<h2>Metrik dari Span</h2>
<pre>connectors:
  spanmetrics:
    dimensions:
      - name: http.request.method
      - name: http.response.status_code
      - name: service.name
    histogram:
      explicit:
        buckets: [5ms, 10ms, 50ms, 100ms, 500ms, 1s, 5s]</pre>

<p>Konektor ini menghasilkan laju permintaan, laju galat, dan sebaran durasi langsung dari span — sehingga metrik dasar tersedia tanpa instrumentasi metrik terpisah, dan angkanya tetap benar meskipun trace kemudian disampel.</p>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Perhatikan dimensi yang dipilih pada spanmetrics</div>
    <p>Setiap dimensi yang ditambahkan mengalikan jumlah deret waktu, persis seperti label metrik biasa. Menambahkan <code>url.path</code> yang berisi ID akan membawa ledakan kardinalitas dari sisi trace ke sisi metrik. Pastikan nama span sudah memakai pola rute sebelum dijadikan dimensi.</p>
</div>`,
    perintah: [
        "curl -s http://localhost:8889/metrics | head -30",
        "curl -s http://localhost:8889/metrics | wc -l",
        "export OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE=delta",
        "curl -s http://prometheus:9090/api/v1/status/tsdb | jq '.data.seriesCountByMetricName[:5]'",
        "curl -s http://collector:8888/metrics | grep datapoints"
    ],
    kuis: [
        {
            tanya: "Kenapa menambahkan ID pengguna sebagai label metrik berbahaya?",
            opsi: [
                "Karena ID pengguna termasuk data pribadi yang tidak boleh dikirim",
                "Karena setiap kombinasi unik nilai label menghasilkan deret waktu tersendiri, sehingga jumlahnya meledak dan dapat menjatuhkan sistem metrik",
                "Karena label metrik hanya boleh berisi angka",
                "Karena Prometheus menolak label dengan lebih dari seratus nilai"
            ],
            benar: 1,
            penjelasan: "Jumlah deret waktu adalah perkalian dari banyaknya nilai setiap label. Label dengan kardinalitas tak terbatas seperti ID pengguna mengubah metrik yang tadinya ratusan deret menjadi jutaan, menghabiskan memori penyimpanan metrik dan membuat kueri melambat drastis. Informasi per-entitas semacam itu memang wilayah trace dan log."
        },
        {
            tanya: "Backend menampilkan angka metrik yang jauh lebih kecil dari kenyataan dan naik-turun tanpa pola, tanpa satu pun pesan galat. Apa penyebab yang perlu diperiksa?",
            opsi: [
                "Sampling trace terlalu agresif",
                "Ketidakcocokan temporalitas — backend mengharapkan kumulatif tetapi menerima delta, atau sebaliknya",
                "Bucket histogram terlalu sedikit",
                "service.name belum disetel pada Resource"
            ],
            benar: 1,
            penjelasan: "Temporalitas menentukan apakah nilai yang dikirim berupa akumulasi sejak awal proses atau selisih sejak pelaporan terakhir. Salah pasangan tidak menimbulkan galat karena bentuk datanya sah — hanya tafsirnya yang keliru, menghasilkan grafik yang tampak wajar tetapi salah. Preferensinya diatur lewat OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE."
        },
        {
            tanya: "Apa manfaat mencatat trace_id di dalam setiap baris log terstruktur?",
            opsi: [
                "Log menjadi lebih ringkas karena pesan dapat dipersingkat",
                "Seluruh log satu permintaan di semua layanan dapat dibuka langsung dari span terkait, tanpa mencocokkan stempel waktu secara manual",
                "Log otomatis ikut tersimpan di backend trace",
                "Sistem log dapat mengambil sampel log dengan rasio yang sama seperti trace"
            ],
            benar: 1,
            penjelasan: "trace_id menjadi kunci penghubung antara dua sinyal yang selama ini terpisah. Setelah trace menunjukkan layanan mana yang lambat atau gagal, log dengan trace_id sama menjelaskan apa yang terjadi di dalamnya — tanpa menebak rentang waktu atau menyaring ribuan baris dari permintaan lain yang berjalan bersamaan."
        }
    ]
},
{
    id: 6,
    kategori: "3 · Metrik & Log",
    judul: "Perambatan Konteks Lintas Layanan",
    tingkat: "Lanjut", durasi: "13 mnt",
    tag: ["context", "baggage", "async", "propagator"],
    ringkas: "Menjaga trace tetap utuh saat melintasi HTTP, antrean pesan, dan pekerjaan latar.",
    isi: `
<h2>Mekanisme Perambatan</h2>
<pre>Layanan A                              Layanan B
  span (trace=abc, span=111)
  │
  ├─ suntikkan ke header               ekstrak dari header
  │  traceparent: 00-abc-111-01   →    trace=abc, induk=111
  │                                     │
  │                                     └─ span (trace=abc, span=222)</pre>

<p>Instrumentasi otomatis menangani penyuntikan dan ekstraksi untuk protokol umum. Yang perlu ditangani sendiri adalah jalur non-standar: antrean pesan, pekerjaan terjadwal, dan panggilan yang menyeberangi batas proses dengan cara khusus.</p>

<h2>Manual: Menyuntik dan Mengekstrak</h2>
<pre>import { context, propagation, trace } from "@opentelemetry/api";

// Sisi pengirim — sematkan konteks ke pesan
function kirimPesan(isi) {
    const pembawa = {};
    propagation.inject(context.active(), pembawa);
    antrean.publish({ isi, _otel: pembawa });
}

// Sisi penerima — pulihkan konteks lalu buat span
async function terimaPesan(pesan) {
    const ctxInduk = propagation.extract(context.active(), pesan._otel ?? {});
    const span = tracer.startSpan("proses-pesan", {
        kind: SpanKind.CONSUMER
    }, ctxInduk);

    await context.with(trace.setSpan(ctxInduk, span), async () => {
        await proses(pesan.isi);
    });
    span.end();
}</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Trace lewat antrean sering menjadi sangat panjang</div>
    <p>Bila pesan tertahan di antrean selama sepuluh menit, span konsumen tetap menjadi anak dari span produsen — dan trace-nya terentang sepuluh menit dengan celah kosong besar di tengah. Untuk pekerjaan asinkron yang jaraknya jauh, pertimbangkan memakai <code>span link</code> alih-alih hubungan induk-anak, sehingga keduanya menjadi trace terpisah yang saling menunjuk.</p>
    <pre>const span = tracer.startSpan("proses-pesan", {
    links: [{ context: trace.getSpanContext(ctxInduk) }]
});</pre>
</div>

<h2>Baggage: Membawa Nilai Lintas Layanan</h2>
<pre>import { propagation, context } from "@opentelemetry/api";

// Layanan A menetapkan
const bag = propagation.createBaggage({
    "penyewa.id":   { value: "akme" },
    "paket.jenis":  { value: "enterprise" }
});
const ctx = propagation.setBaggage(context.active(), bag);

await context.with(ctx, async () => {
    await fetch("http://layanan-b/proses");    // baggage ikut terkirim
});

// Layanan D — beberapa lompatan kemudian
const penyewa = propagation.getBaggage(context.active())?.getEntry("penyewa.id");
span.setAttribute("penyewa.id", penyewa?.value);</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Baggage terkirim di header pada setiap permintaan hilir</div>
    <p>Dua akibatnya sering terlewat. Pertama, ukuran: setiap entri menambah byte pada seluruh permintaan di bawahnya, dan baggage besar terasa pada latensi. Kedua, keamanan: baggage ikut mengalir ke layanan pihak ketiga bila permintaan keluar juga terinstrumentasi — sehingga data sensitif di baggage bocor ke luar. Simpan hanya pengenal singkat, jangan pernah data pribadi atau kredensial.</p>
</div>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Baggage tidak otomatis menjadi atribut span</div>
    <p>Nilai yang dibawa baggage tersedia di konteks, tetapi tidak muncul pada span kecuali disalin secara eksplisit. Banyak tim mengira nilai itu langsung terlihat di backend lalu bingung ketika tidak menemukannya. Salin secara manual, atau pakai prosesor <code>baggage</code> di Collector.</p>
</div>

<h2>Konteks Hilang pada Kode Asinkron</h2>
<pre>// Konteks HILANG — callback berjalan di luar cakupan aktif
tracer.startActiveSpan("induk", (span) => {
    setTimeout(() => {
        const anak = tracer.startSpan("anak");   // tidak menemukan induk
        anak.end();
    }, 100);
    span.end();
});

// Konteks TERJAGA — ikat secara eksplisit
tracer.startActiveSpan("induk", (span) => {
    const ctx = context.active();
    setTimeout(() => {
        context.with(ctx, () => {
            const anak = tracer.startSpan("anak");   // induk ditemukan
            anak.end();
        });
    }, 100);
});</pre>

<div class="callout info">
    <div class="callout-judul">💡 Di Node.js, async/await umumnya aman</div>
    <p>SDK memakai <code>AsyncLocalStorage</code> yang merambatkan konteks melalui rantai <code>await</code> secara otomatis. Yang bermasalah adalah pola berbasis callback yang memutus rantai itu: <code>setTimeout</code>, pendengar peristiwa, kumpulan koneksi yang memakai ulang callback, dan pustaka lama yang mengelola antrean sendiri.</p>
</div>

<h2>Memilih Propagator</h2>
<pre>export OTEL_PROPAGATORS=tracecontext,baggage        # bawaan, W3C
export OTEL_PROPAGATORS=tracecontext,baggage,b3     # + kompatibel Zipkin
export OTEL_PROPAGATORS=b3multi                      # sistem lama</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Propagator yang berbeda antar layanan memutus trace</div>
    <p>Layanan lama berbasis Zipkin mengirim header <code>b3</code>, sedangkan layanan baru hanya membaca <code>traceparent</code> — sehingga konteks tidak ditemukan dan trace terpecah tepat di batas antara keduanya. Gejalanya terlihat sebagai trace yang selalu berhenti di layanan tertentu. Selama masa transisi, aktifkan kedua propagator di semua layanan.</p>
</div>`,
    perintah: [
        "export OTEL_PROPAGATORS=tracecontext,baggage,b3",
        "curl -H 'traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01' http://layanan-b/",
        "curl -H 'baggage: penyewa.id=akme,paket.jenis=enterprise' http://layanan-b/",
        "grep -rn 'propagation.inject\\|propagation.extract' src/",
        "curl -s http://collector:8888/metrics | grep spans_received"
    ],
    kuis: [
        {
            tanya: "Trace selalu terputus tepat di batas antara layanan lama dan layanan baru. Apa penyebab yang paling mungkin?",
            opsi: [
                "Layanan lama tidak mengirim telemetri sama sekali",
                "Propagator yang dipakai berbeda — layanan lama mengirim header b3 sementara layanan baru hanya membaca traceparent",
                "Sampling kepala membuang trace di layanan lama",
                "service.name kedua layanan bertabrakan"
            ],
            benar: 1,
            penjelasan: "Perambatan hanya bekerja bila pengirim dan penerima menyepakati format header. Layanan berbasis Zipkin memakai header b3, sedangkan bawaan OpenTelemetry adalah W3C traceparent. Bila penerima tidak dikonfigurasi membaca b3, konteks tidak ditemukan dan span barunya menjadi root trace baru. Mengaktifkan kedua propagator selama transisi menyelesaikan masalah ini."
        },
        {
            tanya: "Apa risiko menyimpan data sensitif di dalam baggage?",
            opsi: [
                "Baggage disimpan permanen di backend trace",
                "Baggage terkirim sebagai header pada setiap permintaan hilir, termasuk ke layanan pihak ketiga bila permintaan keluar ikut terinstrumentasi",
                "Baggage otomatis dicatat ke seluruh berkas log aplikasi",
                "Baggage tidak dapat dihapus setelah ditetapkan"
            ],
            benar: 1,
            penjelasan: "Baggage dirancang untuk merambat ke seluruh layanan hilir melalui header HTTP. Bila permintaan ke API pihak ketiga juga terinstrumentasi, isinya ikut terkirim ke luar organisasi. Selain itu setiap entri menambah ukuran pada semua permintaan turunan. Isi baggage sebaiknya terbatas pada pengenal singkat yang memang dibutuhkan lintas layanan."
        },
        {
            tanya: "Span yang dibuat di dalam callback setTimeout tidak terhubung ke span induknya. Bagaimana memperbaikinya?",
            opsi: [
                "Menaikkan durasi span induk agar mencakup waktu tunggu",
                "Menangkap context.active() sebelum setTimeout, lalu menjalankan isi callback di dalam context.with(ctx, ...)",
                "Mengganti setTimeout dengan startSpan alih-alih startActiveSpan",
                "Menyetel OTEL_PROPAGATORS agar menyertakan baggage"
            ],
            benar: 1,
            penjelasan: "Callback berbasis timer berjalan di luar cakupan tempat konteks aktif ditetapkan, sehingga span baru tidak menemukan induk. Menyimpan referensi konteks sebelum menjadwalkan callback lalu mengaktifkannya kembali dengan context.with memulihkan hubungan induk-anak. Rantai async/await biasa umumnya tidak bermasalah karena AsyncLocalStorage merambatkannya otomatis."
        }
    ]
},
{
    id: 7,
    kategori: "4 · Produksi",
    judul: "Penerapan di Kubernetes",
    tingkat: "Lanjut", durasi: "13 mnt",
    tag: ["kubernetes", "operator", "sidecar", "daemonset"],
    ringkas: "Menjalankan Collector di klaster, menyuntik instrumentasi otomatis, dan memperkaya telemetri dengan metadata pod.",
    isi: `
<h2>Tiga Pola Penerapan</h2>
<pre>DaemonSet     satu Collector per node
              + metadata node akurat, lalu lintas tetap di node
              + jumlah instans sebanding jumlah node
              − beban node bertambah

Deployment    kelompok Collector terpusat (gateway)
              + tempat sampling ekor dan kebijakan terpusat
              + mudah diskalakan terpisah
              − satu lompatan jaringan tambahan

Sidecar       satu Collector per pod
              + isolasi penuh antar beban kerja
              − pemakaian sumber daya paling boros</pre>

<p>Pola yang lazim di klaster berukuran menengah ke atas: DaemonSet sebagai agen yang mengumpulkan dan memperkaya, meneruskan ke Deployment gateway yang menangani sampling ekor dan pengiriman ke backend.</p>

<h2>OpenTelemetry Operator</h2>
<pre>kubectl apply -f https://github.com/open-telemetry/opentelemetry-operator/releases/latest/download/opentelemetry-operator.yaml</pre>

<pre>apiVersion: opentelemetry.io/v1beta1
kind: OpenTelemetryCollector
metadata:
  name: agen
spec:
  mode: daemonset
  config:
    receivers:
      otlp:
        protocols:
          grpc: { endpoint: 0.0.0.0:4317 }
    processors:
      k8sattributes:
        auth_type: serviceAccount
        extract:
          metadata:
            - k8s.namespace.name
            - k8s.pod.name
            - k8s.deployment.name
            - k8s.node.name
      batch: {}
    exporters:
      otlp:
        endpoint: gateway-collector:4317
        tls: { insecure: true }
    service:
      pipelines:
        traces:
          receivers:  [otlp]
          processors: [k8sattributes, batch]
          exporters:  [otlp]</pre>

<div class="callout info">
    <div class="callout-judul">💡 k8sattributes menghemat banyak instrumentasi manual</div>
    <p>Prosesor ini mencocokkan IP pengirim dengan pod di klaster, lalu menambahkan nama namespace, pod, deployment, dan node secara otomatis. Tanpanya, setiap aplikasi harus membaca metadata itu sendiri lewat Downward API dan menyetelnya di Resource — pekerjaan berulang di setiap layanan yang mudah terlupa.</p>
</div>

<h2>Instrumentasi Otomatis Lewat Anotasi</h2>
<pre>apiVersion: opentelemetry.io/v1alpha1
kind: Instrumentation
metadata:
  name: instrumentasi-bawaan
spec:
  exporter:
    endpoint: http://agen-collector:4317
  propagators: [tracecontext, baggage]
  sampler:
    type: parentbased_traceidratio
    argument: "0.25"
  nodejs:
    image: ghcr.io/open-telemetry/opentelemetry-operator/autoinstrumentation-nodejs:latest</pre>

<pre>apiVersion: apps/v1
kind: Deployment
metadata:
  name: layanan-pesanan
spec:
  template:
    metadata:
      annotations:
        instrumentation.opentelemetry.io/inject-nodejs: "true"</pre>

<p>Operator menambahkan init container yang menyalin pustaka instrumentasi ke volume bersama dan menyetel variabel lingkungan pada container aplikasi. Kode aplikasi maupun image-nya tidak berubah sama sekali.</p>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Penyuntikan hanya terjadi saat pod dibuat</div>
    <p>Menambahkan anotasi pada Deployment yang sudah berjalan tidak menyentuh pod yang ada. Perlu peluncuran ulang agar webhook penyuntik ikut bekerja. Bila anotasi sudah dipasang tetapi telemetri tidak muncul, periksa dulu apakah pod-nya memang sudah dibuat ulang.</p>
    <pre>kubectl rollout restart deployment/layanan-pesanan
kubectl get pod -l app=layanan-pesanan -o jsonpath='{.items[0].spec.initContainers[*].name}'</pre>
</div>

<h2>Metadata dari Downward API</h2>
<pre>env:
  - name: NODE_NAME
    valueFrom:
      fieldRef: { fieldPath: spec.nodeName }
  - name: POD_NAME
    valueFrom:
      fieldRef: { fieldPath: metadata.name }
  - name: OTEL_RESOURCE_ATTRIBUTES
    value: "k8s.node.name=$(NODE_NAME),k8s.pod.name=$(POD_NAME)"
  - name: OTEL_EXPORTER_OTLP_ENDPOINT
    value: "http://$(NODE_NAME):4317"</pre>

<h2>Sumber Daya dan Ketahanan</h2>
<pre>resources:
  requests: { cpu: 200m, memory: 400Mi }
  limits:   { memory: 800Mi }

# Dalam konfigurasi Collector
processors:
  memory_limiter:
    limit_mib: 600           # DI BAWAH limit container
    spike_limit_mib: 150</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 memory_limiter harus lebih rendah dari batas memori container</div>
    <p>Bila <code>limit_mib</code> disetel sama atau lebih tinggi dari batas container, kernel akan mematikan proses dengan OOM sebelum <code>memory_limiter</code> sempat menolak data masuk. Collector mati berulang, telemetri hilang setiap kali, dan penyebabnya sulit terbaca karena tidak ada catatan apa pun dari Collector sendiri. Sisakan margin sekitar 25 persen.</p>
</div>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Jangan menyetel CPU limit pada Collector</div>
    <p>Pembatasan CPU menyebabkan throttling pada lonjakan lalu lintas, yang berarti antrean menumpuk lalu data dibuang — tepat ketika telemetri paling dibutuhkan. Tetapkan <code>requests</code> agar penjadwalan benar, dan biarkan Collector memakai CPU menganggur saat lonjakan terjadi.</p>
</div>

<h2>Memeriksa Keadaan</h2>
<pre>kubectl get opentelemetrycollector
kubectl logs -l app.kubernetes.io/name=agen-collector --tail=100
kubectl port-forward svc/gateway-collector 8888:8888
curl -s localhost:8888/metrics | grep -E 'refused|failed|queue_size'</pre>`,
    perintah: [
        "kubectl get opentelemetrycollector -A",
        "kubectl rollout restart deployment/layanan-pesanan",
        "kubectl logs -l app.kubernetes.io/name=agen-collector --tail=50",
        "kubectl port-forward svc/gateway-collector 8888:8888",
        "kubectl get pod -o jsonpath='{.items[*].spec.initContainers[*].name}'"
    ],
    kuis: [
        {
            tanya: "Kenapa memory_limiter pada Collector harus disetel di bawah batas memori container?",
            opsi: [
                "Agar Collector menyisakan memori untuk sidecar lain di pod yang sama",
                "Agar Collector sempat menolak data masuk sebelum kernel mematikan prosesnya karena OOM, sehingga tidak mati berulang tanpa jejak",
                "Karena Kubernetes menolak pod dengan nilai yang sama",
                "Agar prosesor batch mendapat alokasi memori terpisah"
            ],
            benar: 1,
            penjelasan: "memory_limiter melindungi Collector dengan menolak data ketika pemakaian mendekati ambangnya. Bila ambang itu sama atau melebihi batas container, kernel bertindak lebih dulu dan mematikan proses sebelum mekanisme perlindungan sempat bekerja. Akibatnya Collector mati berulang dan kehilangan buffer setiap kali, tanpa catatan yang menjelaskan penyebabnya."
        },
        {
            tanya: "Anotasi instrumentasi sudah ditambahkan pada Deployment tetapi telemetri tidak muncul. Apa yang perlu diperiksa lebih dulu?",
            opsi: [
                "Apakah endpoint eksportir memakai TLS",
                "Apakah pod sudah dibuat ulang, karena penyuntikan hanya terjadi saat pod dibuat dan tidak menyentuh pod yang sudah berjalan",
                "Apakah service.name sudah terdaftar di backend",
                "Apakah rasio sampling sudah dinaikkan"
            ],
            benar: 1,
            penjelasan: "Penyuntikan dilakukan oleh webhook admission yang hanya berjalan pada pembuatan pod. Menambahkan anotasi pada Deployment yang sudah berjalan tidak mengubah pod yang ada, sehingga init container instrumentasi tidak pernah dipasang. Peluncuran ulang membuat pod baru melewati webhook tersebut."
        },
        {
            tanya: "Apa yang dilakukan prosesor k8sattributes?",
            opsi: [
                "Menyaring telemetri dari namespace tertentu saja",
                "Mencocokkan IP pengirim dengan pod di klaster lalu menambahkan metadata seperti nama namespace, pod, deployment, dan node ke telemetri",
                "Membatasi jumlah span yang boleh dikirim setiap pod",
                "Mengganti service.name dengan nama Deployment secara otomatis"
            ],
            benar: 1,
            penjelasan: "Prosesor ini menanyakan API Kubernetes untuk memetakan sumber telemetri ke pod yang mengirimnya, lalu memperkaya data dengan metadata klaster. Tanpanya setiap aplikasi harus membaca metadata itu sendiri melalui Downward API dan menyetelnya pada Resource — pekerjaan berulang yang mudah terlewat pada layanan baru."
        }
    ]
},
{
    id: 8,
    kategori: "4 · Produksi",
    judul: "Menyelidiki Masalah dengan Telemetri",
    tingkat: "Lanjut", durasi: "14 mnt",
    tag: ["debugging", "RED", "latensi", "korelasi"],
    ringkas: "Mengubah data telemetri menjadi jawaban — alur kerja yang berulang, dari gejala sampai akar masalah.",
    isi: `
<h2>Alur Penyelidikan</h2>
<pre>1. Metrik    apa yang berubah, dan kapan persisnya?
2. Metrik    layanan mana yang terdampak?
3. Trace     ambil contoh permintaan yang lambat atau gagal
4. Trace     span mana yang memakan waktu atau menghasilkan galat?
5. Log       apa yang terjadi di dalam span itu — pakai trace_id
6. Perubahan penerapan, flag, atau konfigurasi apa yang bertepatan?</pre>

<h2>Metode RED untuk Setiap Layanan</h2>
<pre>Rate      laju permintaan per detik
Errors    proporsi permintaan yang gagal
Duration  sebaran latensi — p50, p95, p99</pre>

<pre># Laju permintaan
sum(rate(http_server_request_duration_count[5m])) by (service_name)

# Proporsi galat
sum(rate(http_server_request_duration_count{status_code=~"5.."}[5m])) by (service_name)
  / sum(rate(http_server_request_duration_count[5m])) by (service_name)

# p99
histogram_quantile(0.99,
  sum(rate(http_server_request_duration_bucket[5m])) by (le, service_name))</pre>

<div class="callout info">
    <div class="callout-judul">💡 Rata-rata menyembunyikan persis masalah yang dicari</div>
    <p>Bila 99 permintaan selesai dalam 10 ms dan satu permintaan memakan 5 detik, rata-ratanya 60 ms — terlihat sehat. Padahal ada pengguna yang menunggu lima detik. Persentil menunjukkan pengalaman terburuk yang nyata dialami sebagian pengguna, dan itulah yang biasanya menjadi keluhan.</p>
</div>

<h2>Pola yang Sering Terlihat pada Trace</h2>

<pre>N+1 kueri
GET /pesanan                    [====================] 890ms
  ├─ SELECT pesanan              [=]                    12ms
  ├─ SELECT item WHERE id=1       [=]                    9ms
  ├─ SELECT item WHERE id=2        [=]                    8ms
  └─ ... 98 span serupa lagi
→ satu kueri per baris; gabungkan atau muat sekaligus</pre>

<pre>Rantai berurutan yang bisa diparalelkan
GET /dasbor                     [====================] 640ms
  ├─ layanan-pengguna            [=====]               150ms
  ├─ layanan-pesanan                  [======]         180ms
  ├─ layanan-stok                          [=====]     160ms
  └─ layanan-notifikasi                         [====] 140ms
→ tidak saling bergantung; jalankan bersamaan, total menjadi ~180ms</pre>

<pre>Celah tanpa span
POST /bayar                     [====================] 2100ms
  ├─ validasi                    [==]                   90ms
  │                                  ← celah 1400ms tanpa span
  └─ simpan                                        [==] 110ms
→ ada pekerjaan yang tidak terinstrumentasi, atau menunggu kunci,
  atau menunggu koneksi dari pool yang habis</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Celah besar di dalam trace adalah petunjuk, bukan kekosongan</div>
    <p>Waktu itu tetap terpakai — hanya tidak terlihat karena tidak ada span yang mewakilinya. Tersangka yang paling sering: menunggu koneksi dari pool basis data yang habis, penguncian, jeda garbage collection, atau panggilan ke pustaka yang belum terinstrumentasi. Tambahkan span manual di sekitar area itu untuk mempersempit.</p>
</div>

<h2>Mencari Kesamaan pada Permintaan Bermasalah</h2>
<pre>Bandingkan atribut antara permintaan lambat dan permintaan normal:

  penyewa.id      apakah terpusat pada satu pelanggan?
  wilayah         apakah hanya satu wilayah?
  service.version apakah hanya versi baru?
  k8s.node.name   apakah hanya satu node?
  hasil.cache     apakah selalu miss?</pre>

<div class="callout info">
    <div class="callout-judul">💡 Atribut bisnis membuat penyelidikan jauh lebih cepat</div>
    <p>Menemukan bahwa seluruh permintaan lambat berasal dari satu penyewa langsung mempersempit ruang pencarian dari "seluruh sistem" menjadi "apa yang berbeda pada penyewa itu" — biasanya volume data yang jauh lebih besar. Tanpa atribut semacam <code>penyewa.id</code> pada span, pola ini tidak akan pernah terlihat.</p>
</div>

<h2>Menghubungkan Perubahan Penerapan</h2>
<pre>span.setAttribute("service.version", process.env.VERSI_APLIKASI);
span.setAttribute("deployment.id",   process.env.ID_PENERAPAN);</pre>

<pre>histogram_quantile(0.99,
  sum(rate(http_server_request_duration_bucket[5m])) by (le, service_version))</pre>

<p>Memecah latensi berdasarkan versi menjawab pertanyaan pertama dalam hampir setiap insiden: apakah ini disebabkan penerapan terakhir? Grafik dengan dua garis versi berdampingan menjawabnya dalam hitungan detik.</p>

<h2>Menemukan Layanan Sumber Masalah</h2>
<div class="callout waspada">
    <div class="callout-judul">⚠️ Layanan yang paling banyak memunculkan galat sering hanya korban</div>
    <p>Ketika basis data melambat, seluruh layanan yang bergantung padanya ikut menampilkan galat dan latensi tinggi. Dasbor menunjukkan sepuluh layanan bermasalah sekaligus, dan tim mudah tersesat memperbaiki gejala di layanan yang paling berisik. Telusuri trace ke <em>span terdalam</em> yang bermasalah — di sanalah asal kegagalannya, dan biasanya hanya satu tempat.</p>
</div>

<h2>Daftar Periksa Kesiapan Produksi</h2>
<pre>□ service.name dan service.version disetel di seluruh layanan
□ deployment.environment membedakan produksi dari staging
□ trace_id tercatat pada setiap log terstruktur
□ Metrik dihasilkan sebelum sampling — spanmetrics atau instrumen sendiri
□ Nama span memakai pola rute, bukan URL dengan ID
□ Atribut sensitif disunting di Collector
□ Collector sendiri dipantau oleh sistem yang terpisah darinya
□ Peringatan berbasis SLO, bukan ambang batas mentah
□ Retensi ditetapkan sesuai anggaran dan kebutuhan penyelidikan</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Observabilitas yang tidak pernah dipakai saat tenang tidak akan menolong saat panik</div>
    <p>Dasbor yang baru dibuka pertama kali ketika insiden berlangsung hampir selalu mengecewakan: kueri salah, label tidak sesuai, data yang dibutuhkan ternyata tidak pernah dikumpulkan. Biasakan membuka trace dan dasbor saat sistem sehat — untuk meninjau penerapan baru atau memeriksa endpoint lambat — sehingga celah dalam instrumentasi ditemukan sebelum benar-benar dibutuhkan.</p>
</div>`,
    perintah: [
        "curl -s 'http://prometheus:9090/api/v1/query?query=up' | jq '.data.result | length'",
        "curl -s http://tempo:3200/api/traces/4bf92f3577b34da6a3ce929d0e0e4736 | jq '.batches | length'",
        "curl -s http://collector:8888/metrics | grep -E 'refused|failed'",
        "kubectl logs -l app=layanan-pesanan | grep 4bf92f3577b34da6",
        "curl -s http://tempo:3200/api/search?tags=service.name%3Dlayanan-pesanan"
    ],
    kuis: [
        {
            tanya: "Trace menunjukkan celah 1400 ms tanpa span apa pun di antara dua span. Apa artinya?",
            opsi: [
                "Trace rusak dan sebagian datanya hilang saat pengiriman",
                "Ada pekerjaan yang tidak terinstrumentasi di sana — misalnya menunggu koneksi dari pool yang habis, penguncian, atau panggilan pustaka tanpa instrumentasi",
                "Sampling membuang span yang berada di rentang waktu itu",
                "Jam antar layanan tidak tersinkronisasi"
            ],
            benar: 1,
            penjelasan: "Waktu di dalam celah tetap terpakai oleh proses, hanya tidak terwakili span karena bagian itu belum diinstrumentasi. Penyebab yang paling sering adalah menunggu koneksi dari pool basis data yang habis, kontensi kunci, jeda garbage collection, atau pustaka yang tidak tercakup instrumentasi otomatis. Menambahkan span manual di area tersebut mempersempit pencarian."
        },
        {
            tanya: "Sepuluh layanan menampilkan lonjakan galat bersamaan. Bagaimana menemukan sumbernya?",
            opsi: [
                "Perbaiki layanan dengan jumlah galat terbanyak lebih dulu",
                "Telusuri trace ke span terdalam yang bermasalah, karena layanan hilir biasanya hanya meneruskan kegagalan dari satu sumber di bawahnya",
                "Mulai ulang seluruh layanan secara bersamaan",
                "Bandingkan jumlah galat antar layanan dan pilih yang paling cepat naik"
            ],
            benar: 1,
            penjelasan: "Kegagalan pada satu ketergantungan bersama merambat ke semua layanan yang memakainya, sehingga banyak layanan tampak bermasalah sekaligus. Jumlah galat terbanyak biasanya hanya menunjukkan layanan dengan lalu lintas terbesar, bukan penyebabnya. Struktur trace mengungkap urutan sebab-akibat: span terdalam yang gagal adalah titik asal yang sesungguhnya."
        },
        {
            tanya: "Kenapa memantau persentil latensi lebih berguna daripada rata-rata?",
            opsi: [
                "Karena persentil lebih murah dihitung daripada rata-rata",
                "Karena rata-rata dapat terlihat sehat meski sebagian pengguna mengalami latensi sangat tinggi, sedangkan persentil menampilkan pengalaman terburuk yang nyata",
                "Karena rata-rata tidak dapat dihitung dari histogram",
                "Karena persentil tidak terpengaruh oleh sampling"
            ],
            benar: 1,
            penjelasan: "Rata-rata meratakan nilai ekstrem: sejumlah kecil permintaan yang sangat lambat nyaris tidak menggeser angkanya ketika mayoritas permintaan cepat. Padahal permintaan lambat itulah yang dialami pengguna yang mengeluh. Persentil seperti p95 dan p99 menunjukkan batas atas pengalaman nyata sebagian pengguna, sehingga masalah terlihat sebelum menjadi keluhan luas."
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
