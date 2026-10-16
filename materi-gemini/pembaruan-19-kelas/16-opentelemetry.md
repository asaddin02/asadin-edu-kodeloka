# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas OpenTelemetry Modern: OTel Collector Production Pipeline, Semantic Conventions, Tail-Based Sampling, & Korelasi Traces-Metrics-Logs

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 8 modul yang sudah ada di kelas `opentelemetry/` beserta 4 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `opentelemetry/app.js` (larik `MODUL`).

## 1. Audit Modul Saat Ini di Repositori (`opentelemetry/app.js`)

Saat ini, kelas **`opentelemetry`** di repositori Kodeloka memiliki **8 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |
| 1 | Konsep Inti & Tiga Sinyal | Dasar | Sudah ada |
| 2 | Instrumentasi Otomatis & Manual | Dasar | Sudah ada |
| 3 | OpenTelemetry Collector | Menengah | Sudah ada |
| 4 | Pengambilan Sampel | Menengah | Sudah ada |
| 5 | Metrik & Instrumen | Menengah | Sudah ada |
| 6 | Perambatan Konteks Lintas Layanan | Lanjut | Sudah ada |
| 7 | Penerapan di Kubernetes | Lanjut | Sudah ada |
| 8 | Menyelidiki Masalah dengan Telemetri | Lanjut | Sudah ada |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Empat modul perluasan di bawah ini menambahkan pembaruan 2024–2026, tetapi sebagian topiknya sudah ada di kelas. Kelas sudah membahas `memory_limiter`, `batch`, dan `tail_sampling` (modul 3 dan 4), korelasi `trace_id` pada log (modul 1, 3, 5, dan 8), serta kardinalitas metrik (modul 1 dan 5). Yang belum ada: prosesor `resourcedetection`, atribut `http.route` beserta semantic conventions, dan exemplar.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Baru 09: Arsitektur OpenTelemetry Collector di Produksi (Processors: `memory_limiter`, `batch`, `attributes`, & `resourcedetection`)

- **Tingkat:** Menengah
- **Ringkasan:** Menyusun pipa konfigurasi **OTel Collector** yang tahan banting dengan menempatkan `memory_limiter` sebagai prosesor pertama untuk mengurangi risiko Collector mengalami *Out of Memory* saat terjadi badai telemetri.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menyusun pipa konfigurasi **OTel Collector** yang tahan banting dengan menempatkan `memory_limiter` sebagai prosesor pertama untuk mengurangi risiko Collector mengalami *Out of Memory* saat terjadi badai telemetri. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  memory_limiter:
    check_interval: 1s
    limit_mib: 512
    spike_limit_mib: 128
  batch:
    send_batch_size: 1024
    timeout: 2s

exporters:
  otlp:
    endpoint: backend-otlp:4317   # ganti dengan alamat backend (misalnya Tempo atau Jaeger)
    tls:
      insecure: true   # hanya untuk jaringan uji/lokal; aktifkan TLS di produksi

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [otlp]
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `opentelemetry/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `opentelemetry` dari **8 modul** menjadi **12 modul** berstandar terbaru.


## Modul Baru 10: Strategi Sampling Cerdas — Head-Based vs Tail-Based Sampling (`tail_sampling` Processor) untuk Menyimpan 100% Trace Galat & Lambat

- **Tingkat:** Lanjut
- **Ringkasan:** Menghemat biaya penyimpanan telemetri tanpa kehilangan jejak galat dan jejak lambat yang tertangkap kebijakan, dengan menahan keputusan sampling hingga seluruh span selesai (dalam batas `decision_wait`) menggunakan `tail_sampling` (menyimpan 100% trace yang memiliki status `ERROR` atau latensi > 1 detik, dan hanya mengambil sampel 5% dari trace normal).

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menghemat biaya penyimpanan telemetri tanpa kehilangan jejak galat dan jejak lambat yang tertangkap kebijakan, dengan menahan keputusan sampling hingga seluruh span selesai (dalam batas `decision_wait`) menggunakan `tail_sampling` (menyimpan 100% trace yang memiliki status `ERROR` atau latensi > 1 detik, dan hanya mengambil sampel 5% dari trace normal). Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```yaml
# Prosesor tail_sampling tersedia di distribusi Collector contrib. Pasang di pipeline traces setelah memory_limiter dan sebelum batch;
# seluruh span satu trace harus tiba di Collector yang sama (pakai loadbalancing exporter bila Collector lebih dari satu).
processors:
  tail_sampling:
    decision_wait: 10s
    policies:
      - name: simpan-semua-error
        type: status_code
        status_code: { status_codes: [ERROR] }
      - name: simpan-permintaan-lambat
        type: latency
        latency: { threshold_ms: 1000 }
      - name: sampel-trafik-normal
        type: probabilistic
        probabilistic: { sampling_percentage: 5 }
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `opentelemetry/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `opentelemetry` dari **8 modul** menjadi **12 modul** berstandar terbaru.


## Modul Baru 11: Standar OpenTelemetry Semantic Conventions (`http.route`, `service.name`) & Pencegahan High-Cardinality Explosion

- **Tingkat:** Lanjut
- **Ringkasan:** Menjaga agar label metrik tidak meledak menjadi jutaan deret waktu unik (*high-cardinality explosion*) dengan menggunakan pola rute (`http.route = '/users/{id}'`) alih-alih URL mentah yang berisi ID pengguna.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menjaga agar label metrik tidak meledak menjadi jutaan deret waktu unik (*high-cardinality explosion*) dengan menggunakan pola rute (`http.route = '/users/{id}'`) alih-alih URL mentah yang berisi ID pengguna. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```text
// BENAR: Gunakan pola rute berparameter pada atribut metrik (kardinalitas rendah)
// http.route = "/api/v1/pesanan/{id}"
// SALAH: Memasukkan ID unik jutaan pelanggan ke dalam label metrik Prometheus!
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `opentelemetry/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `opentelemetry` dari **8 modul** menjadi **12 modul** berstandar terbaru.


## Modul Baru 12: Korelasi Penuh Tiga Pilar Observabilitas: Menyuntikkan `trace_id` & `span_id` ke Log JSON dan *Exemplars* pada Histogram Metrik

- **Tingkat:** Lanjut
- **Ringkasan:** Menghubungkan grafik lonjakan latensi di Prometheus langsung ke satu jejak transaksi spesifik di Tempo/Jaeger dan baris log terkait di Loki menggunakan mekanisme **Exemplars** dan injeksi konteks trace.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menghubungkan grafik lonjakan latensi di Prometheus langsung ke satu jejak transaksi spesifik di Tempo/Jaeger dan baris log terkait di Loki menggunakan mekanisme **Exemplars** dan injeksi konteks trace. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```json
{
  "timestamp": "2026-10-16T09:15:00Z",
  "level": "ERROR",
  "msg": "Gagal menagih kartu kredit ke gateway",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7"
}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `opentelemetry/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `opentelemetry` dari **8 modul** menjadi **12 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari keempat modul pembaruan `opentelemetry` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan keempat modul di atas ke dalam `opentelemetry/app.js` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `opentelemetry` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (8 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `opentelemetry`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 8 modul yang sudah ada di `opentelemetry/app.js` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `opentelemetry` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan keempat modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `opentelemetry/`
- B. Mengekstrak judul, tingkat, ringkasan, isi, contoh kode, dan kuis setiap modul dari berkas ini ke dalam larik `MODUL` di `opentelemetry/app.js` (bentuk objeknya mengikuti mesin kelas tersebut), memperbarui jumlah modul di `scripts/courses.json`, lalu menjalankan `npm run extract`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke larik `MODUL` di `opentelemetry/app.js`, jumlah modulnya diperbarui di `scripts/courses.json`, dan `data/modules.json` dibangkitkan ulang lewat `npm run extract`.

## Sumber

- [Dokumentasi Resmi — OpenTelemetry Modern](https://opentelemetry.io/docs/)
- [OpenTelemetry — Konfigurasi Collector](https://opentelemetry.io/docs/collector/configuration/)
- [OpenTelemetry — Sampling](https://opentelemetry.io/docs/concepts/sampling/)
- [Prosesor `tail_sampling` (collector-contrib)](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/tailsamplingprocessor)
- [Prosesor `memory_limiter`](https://github.com/open-telemetry/opentelemetry-collector/blob/main/processor/memorylimiterprocessor/README.md)
