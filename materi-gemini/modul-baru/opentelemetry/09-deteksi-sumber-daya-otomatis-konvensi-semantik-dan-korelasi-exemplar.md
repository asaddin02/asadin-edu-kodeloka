# Konvensi Semantik OpenTelemetry (`http.route`), Prosesor `resourcedetection`, dan Korelasi *Exemplars*

- **Letak:** sesudah modul 8
- **Tingkat:** Lanjut
- **Ringkasan:** Mencegah ledakan kardinalitas metrik dan trace menggunakan *OpenTelemetry Semantic Conventions* (`http.route`), memperkaya metadata lingkungan otomatis dengan prosesor `resourcedetection`, serta menghubungkan grafik histogram metrik ke trace spesifik melalui *Exemplars*.

## Mengapa Standarisasi Atribut Telemetri Sangat Penting?

Jika Layanan A menamai atribut status HTTP sebagai `status_code`, Layanan B menamainya `http.status`, dan Layanan C memasukkan URL lengkap `/users/98123/orders/4412` ke dalam nama span atau label metrik, tim tidak akan bisa membuat satu dasbor atau aturan peringatan yang berlaku lintas layanan—bahkan metrik Prometheus dapat mengalami **ledakan kardinalitas (*high-cardinality explosion*)** karena setiap ID pengguna menciptakan deret waktu (*time series*) baru!

## 1. *OpenTelemetry Semantic Conventions* untuk HTTP Stabil

Spesifikasi konvensi semantik HTTP yang telah stabil di OpenTelemetry menetapkan nama atribut baku dan aturan kardinalitas sebagai berikut:

| Nama Atribut Standar | Contoh Nilai yang Benar | Contoh yang Salah (Dilarang di Metrik) |
| :--- | :--- | :--- |
| `service.name` | `"checkout-service"` | `"container-8f92a1"` (ID instans dinamis masuk ke `service.instance.id`) |
| `http.request.method` | `"GET"`, `"POST"` | `"get"` (harus huruf kapital standar) |
| `http.route` | `"/users/{id}/orders"` | `"/users/98123/orders"` (mengandung ID dinamis berkardinalitas tinggi!) |
| `http.response.status_code` | `200`, `500` | `"200 OK"` (harus bilangan bulat) |
| `url.path` | `"/users/98123/orders"` | Hanya boleh dipasang pada **Span (Trace)** atau **Log**, **jangan** dijadikan label **Metrik**! |

## 2. Memperkaya Konteks Infrastruktur dengan Prosesor `resourcedetection`

Daripada menyetel variabel lingkungan nama mesin, zona ketersediaan cloud, dan versi kernel secara manual di setiap kontainer, aktifkan prosesor **`resourcedetection`** pada distribusi *OpenTelemetry Collector Contrib* untuk melampirkan metadata host/cloud secara otomatis:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

processors:
  memory_limiter:
    check_interval: 1s
    limit_mib: 512
    spike_limit_mib: 128

  resourcedetection:
    detectors: [env, system, docker]
    timeout: 2s
    override: false

  batch:
    send_batch_size: 1024
    timeout: 2s

exporters:
  otlp:
    endpoint: tempo.monitoring.svc.cluster.local:4317
    tls:
      insecure: true # Hanya untuk jaringan kluster internal terisolasi

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, resourcedetection, batch]
      exporters: [otlp]
```

## 3. Menghubungkan Histogram Metrik ke Trace dengan *Exemplars*

Ketika grafik latensi persentil ke-99 (`p99`) pada dasbor metrik tiba-tiba melonjak ke 4 detik, bagaimana Anda menemukan **satu contoh *trace_id*** yang menyebabkan lonjakan tersebut?

Saat SDK OpenTelemetry mencatat pengukuran ke dalam instrumen **`Histogram`** di dalam konteks *span* yang sedang aktif, SDK secara otomatis melampirkan **`trace_id`** dan **`span_id`** sebagai **Exemplar** pada *bucket* histogram tersebut. Di Grafana, *Exemplar* tampil sebagai titik berlian/bintang di atas grafik metrik yang ketika diklik langsung membuka jejak lengkap permintaan lambat tersebut di Grafana Tempo!

## Kuis Pemahaman

### Soal 1
Mengapa atribut `http.route` pada metrik dan nama span harus berisi pola rute berparameter seperti `"/orders/{orderId}"` dan bukan jalur URL mentah `"/orders/8849201"`?
- A. Karena OpenTelemetry menolak string yang mengandung angka.
- B. Untuk mencegah ledakan kardinalitas (*high-cardinality explosion*) yang terjadi apabila jutaan ID pesanan unik masing-masing menciptakan seri metrik atau grup nama span tersendiri.
- C. Karena peramban web menyembunyikan parameter angka dari server.
- D. Agar ukuran paket jaringan menjadi nol byte.

**Jawaban Benar:** B
**Penjelasan:** Label metrik dan nama span membutuhkan kardinalitas rendah yang terbatas pada jumlah rute di aplikasi. Nilai ID spesifik disimpan pada atribut span (seperti `url.path` atau atribut kustom `order.id`), bukan pada label metrik.

### Soal 2
Apa fungsi dari *Exemplar* dalam korelasi antara sinyal Metrik dan sinyal Trace di OpenTelemetry?
- A. Menyalin seluruh isi berkas log teks ke dalam database Prometheus.
- B. Menyematkan referensi `trace_id` dan `span_id` contoh nyata pada *bucket* pengukuran metrik (seperti histogram latensi) sehingga engineer dapat melompat langsung dari lonjakan grafik metrik ke jejak *trace* penyebabnya.
- C. Menghapus *span* yang berdurasi di bawah 10 milidetik.
- D. Menggantikan peran OpenTelemetry Collector dengan DNS.

**Jawaban Benar:** B
**Penjelasan:** *Exemplar* adalah jembatan metadata (`trace_id`/`span_id`) yang ditempelkan pada sampel metrik histogram untuk menautkan agregat statistik dengan contoh permintaan individual.

### Soal 3
Bagaimana urutan penempatan prosesor yang direkomendasikan di dalam pipeline `processors:` pada OpenTelemetry Collector?
- A. `[batch, memory_limiter, resourcedetection]`
- B. `[memory_limiter, resourcedetection, batch]`
- C. `[batch]` saja di paling awal sebelum `memory_limiter`.
- D. Urutan prosesor di dalam daftar tidak memengaruhi cara kerja Collector.

**Jawaban Benar:** B
**Penjelasan:** Prosesor dieksekusi sesuai urutan penulisannya di dalam larik `processors:`. `memory_limiter` harus ditempatkan paling awal untuk menahan lonjakan memori segera setelah data keluar dari *receiver*, diikuti prosesor pengayaan (`resourcedetection`), dan ditutup oleh `batch` sebelum dikirim ke *exporter*.

## Sumber
- [OpenTelemetry Specification — Semantic Conventions for HTTP Spans and Metrics](https://opentelemetry.io/docs/specs/semconv/http/http-spans/)
- [OpenTelemetry Collector Documentation — Configuration & Processors](https://opentelemetry.io/docs/collector/configuration/)
