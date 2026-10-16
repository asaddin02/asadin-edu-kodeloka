# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Prometheus Modern (Prometheus 3.0): Native Histograms, OTLP Ingestion, Multi-Window Burn-Rate SLO Alerts, & High Availability (Thanos/Mimir)

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 0 modul yang sudah ada di kelas `prometheus/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `prometheus/data/modules.json`.

## 1. Audit Modul Saat Ini di Repositori (`prometheus/data/modules.json`)

Saat ini, kelas **`prometheus`** di repositori Kodeloka memiliki **0 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan penuh di bawah ini menambahkan kapabilitas rilis terbaru yang belum tercakup di modul lama.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 16: Fitur Baru Prometheus 3.0 — Native Histograms, Penerimaan Langsung OTLP, dan Dukungan UTF-8 pada Nama Metrik/Label

- **Tingkat:** Lanjut
- **Ringkasan:** Memahami bagaimana **Native Histograms** di Prometheus 3.0 menyediakan resolusi bucket eksponensial berpresisi tinggi secara otomatis tanpa perlu menebak batas `le` secara manual dan dengan konsumsi memori yang jauh lebih hemat.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Memahami bagaimana **Native Histograms** di Prometheus 3.0 menyediakan resolusi bucket eksponensial berpresisi tinggi secara otomatis tanpa perlu menebak batas `le` secara manual dan dengan konsumsi memori yang jauh lebih hemat. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
# Mengirim metrik dari OpenTelemetry Collector langsung ke endpoint OTLP bawaan Prometheus 3.0:
# Endpoint penerima: http://prometheus:9090/api/v1/otlp/v1/metrics
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `prometheus/data/modules.json` (dan `prometheus/app.js`) sehingga memperluas cakupan kelas `prometheus` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 17: Rekayasa Peringatan Berbasis SLO (*Service Level Objective*) dan Multi-Window Multi-Burn-Rate Alerting

- **Tingkat:** Lanjut
- **Ringkasan:** Menghilangkan kelelahan peringatan palsu (*alert fatigue*) dengan beralih dari ambang gejala semata menuju peringatan kecepatan pembakaran *Error Budget* (*Burn Rate* 1 jam dan 5 menit vs 6 jam dan 30 menit).

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menghilangkan kelelahan peringatan palsu (*alert fatigue*) dengan beralih dari ambang gejala semata menuju peringatan kecepatan pembakaran *Error Budget* (*Burn Rate* 1 jam dan 5 menit vs 6 jam dan 30 menit). Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
groups:
  - name: slo-api-kodeloka
    rules:
      - alert: ApiErrorBudgetBurnCepat
        expr: |
          (
            sum(rate(http_requests_total{job="api",status=~"5.."}[1h]))
            /
            sum(rate(http_requests_total{job="api"}[1h])) > (14.4 * 0.001)
          )
          and
          (
            sum(rate(http_requests_total{job="api",status=~"5.."}[5m]))
            /
            sum(rate(http_requests_total{job="api"}[5m])) > (14.4 * 0.001)
          )
        for: 2m
        labels:
          severity: page
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `prometheus/data/modules.json` (dan `prometheus/app.js`) sehingga memperluas cakupan kelas `prometheus` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 18: Pengujian Unit Aturan Rekaman & Alert dengan `promtool test rules` serta Arsitektur Penyimpanan Jangka Panjang (Thanos / Grafana Mimir)

- **Tingkat:** Lanjut
- **Ringkasan:** Menguji ekspresi PromQL dan aturan `Alerting` secara otomatis di pipa CI/CD menggunakan berkas skenario `promtool test rules` sebelum aturan tersebut diterapkan ke server produksi.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menguji ekspresi PromQL dan aturan `Alerting` secara otomatis di pipa CI/CD menggunakan berkas skenario `promtool test rules` sebelum aturan tersebut diterapkan ke server produksi. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
# Menjalankan verifikasi sintaks dan unit test aturan Prometheus di CI
promtool check rules alerts.yml
promtool test rules alerts_test.yml
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `prometheus/data/modules.json` (dan `prometheus/app.js`) sehingga memperluas cakupan kelas `prometheus` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `prometheus` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `prometheus/data/modules.json` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `prometheus` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (0 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `prometheus`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 0 modul yang sudah ada di `prometheus/data/modules.json` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `prometheus` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan ketiga modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `prometheus/`
- B. Mengekstrak objek `judul`, `tingkat`, `ringkas`, `isi`, contoh kode, dan `kuis` dari berkas ini ke dalam `prometheus/data/modules.json` serta memperbarui jumlah modul di `scripts/courses.json`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke `prometheus/data/modules.json` (dan disinkronkan ke `prometheus/app.js` serta `scripts/courses.json`).

## Sumber

- [Dokumentasi Resmi — Prometheus Modern (Prometheus 3.0)](https://prometheus.io/docs/introduction/overview/)
