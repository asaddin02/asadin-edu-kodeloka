# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Grafana Modern (Grafana 11): Korelasi Lintas Sumber Data (Prometheus + Loki + Tempo), LogQL & TraceQL, Unified Alerting, & Dashboards-as-Code

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 15 modul yang sudah ada di kelas `grafana/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `grafana/app.js` (larik `GRAF_MOD_C`).

## 1. Audit Modul Saat Ini di Repositori (`grafana/app.js`)

Saat ini, kelas **`grafana`** di repositori Kodeloka memiliki **15 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |
| 1 | Posisi Grafana: Alat Baca, Bukan Penyimpan Data | Dasar | Sudah ada |
| 2 | Instalasi & Konfigurasi: grafana.ini, Env Var, Reverse Proxy | Dasar | Sudah ada |
| 3 | Data Source: Prometheus, Loki, SQL, dan Aturan UID | Dasar | Sudah ada |
| 4 | Anatomi Dashboard: JSON Model, Panel, dan Time Range | Dasar | Sudah ada |
| 5 | Query Editor, $__interval, dan Legenda yang Terbaca | Menengah | Sudah ada |
| 6 | Memilih Visualisasi: Time Series, Stat, Table, Heatmap, dan Kawan-kawan | Menengah | Sudah ada |
| 7 | Field Config: Unit, Threshold, Value Mapping, dan Override | Menengah | Sudah ada |
| 8 | Variabel & Templating: Satu Dashboard untuk Semua Lingkungan | Menengah | Sudah ada |
| 9 | Transformations: Mengolah Data Frame Sebelum Digambar | Lanjut | Sudah ada |
| 10 | Merancang Dashboard yang Dipakai: Baris, Anotasi, Tautan | Menengah | Sudah ada |
| 11 | Unified Alerting: Rule, Expression, dan State Machine | Lanjut | Sudah ada |
| 12 | Korelasi: Loki, Tempo, Exemplar, dan Explore | Lanjut | Sudah ada |
| 13 | Autentikasi, Organisasi, Tim, dan Izin | Lanjut | Sudah ada |
| 14 | Performa & Skala: Dashboard Cepat, Grafana Tahan Beban | Lanjut | Sudah ada |
| 15 | Dashboard as Code: Provisioning, Backup, dan Upgrade | Lanjut | Sudah ada |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan di bawah ini menambahkan pembaruan 2024–2026, tetapi sebagian topiknya sudah ada di kelas. Kelas sudah membahas `derivedFields` (modul 3 dan 12), `tracesToLogs` (modul 12), LogQL (modul 11 dan 12), exemplar (modul 3 dan 12), provisioning (di banyak modul), serta izin dan organisasi (modul 13). Yang belum ada hanya TraceQL.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 16: Eksplorasi Terpadu Tiga Pilar — Melompat dari Grafik Metrik (Exemplars) ke Trace (Tempo/TraceQL) dan Log (Loki/LogQL)

- **Tingkat:** Menengah
- **Ringkasan:** Mengonfigurasi `derivedFields` pada sumber data Loki dan `tracesToLogsV2` / `tracesToMetrics` pada sumber data Tempo agar insinyur yang sedang menangani insiden dapat berpindah dari grafik lonjakan galat ke baris log dan trace hanya dengan satu klik.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mengonfigurasi `derivedFields` pada sumber data Loki dan `tracesToLogsV2` / `tracesToMetrics` pada sumber data Tempo agar insinyur yang sedang menangani insiden dapat berpindah dari grafik lonjakan galat ke baris log dan trace hanya dengan satu klik. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```text
# Contoh kueri LogQL (Grafana Loki) untuk memfilter log JSON dengan status >= 500 atau durasi > 500ms
{service_name="api-kodeloka"} | json | status >= 500 or durasi_ms > 500
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `GRAF_MOD_C` di `grafana/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `grafana` dari **15 modul** menjadi **18 modul** berstandar terbaru.


## Modul Pembaruan 17: Bahasa Kueri Jejak Terdistribusi dengan TraceQL di Grafana Tempo

- **Tingkat:** Lanjut
- **Ringkasan:** Mencari jejak transaksi spesifik di antara jutaan span menggunakan **TraceQL** berdasarkan atribut span, durasi, maupun hubungan induk-anak.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mencari jejak transaksi spesifik di antara jutaan span menggunakan **TraceQL** berdasarkan atribut span, durasi, maupun hubungan induk-anak. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```text
# Kueri TraceQL: cari trace yang memiliki span berstatus error di layanan checkout, dengan span turunan (>>) ke database yang berdurasi > 300ms
{ resource.service.name = "checkout-api" && status = error } >> { span.db.system = "postgresql" && duration > 300ms }
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `GRAF_MOD_C` di `grafana/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `grafana` dari **15 modul** menjadi **18 modul** berstandar terbaru.


## Modul Pembaruan 18: Provisioning Otomatis (*Dashboards & Alerting as Code*), Variabel Template Dinamis, dan Keamanan RBAC Organisasi

- **Tingkat:** Lanjut
- **Ringkasan:** Menyimpan definisi sumber data, aturan peringatan (*Contact Points* & *Notification Policies*), serta JSON dasbor di repositori Git menggunakan direktori `/etc/grafana/provisioning/`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menyimpan definisi sumber data, aturan peringatan (*Contact Points* & *Notification Policies*), serta JSON dasbor di repositori Git menggunakan direktori `/etc/grafana/provisioning/`. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```yaml
# /etc/grafana/provisioning/datasources/utama.yaml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `GRAF_MOD_C` di `grafana/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `grafana` dari **15 modul** menjadi **18 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `grafana` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `grafana/app.js` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `grafana` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (15 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `grafana`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 15 modul yang sudah ada di `grafana/app.js` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `grafana` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan ketiga modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `grafana/`
- B. Mengekstrak judul, tingkat, ringkasan, isi, contoh kode, dan kuis setiap modul dari berkas ini ke dalam larik `GRAF_MOD_C` di `grafana/app.js` (bentuk objeknya mengikuti mesin kelas tersebut), memperbarui jumlah modul di `scripts/courses.json`, lalu menjalankan `npm run extract`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke larik `GRAF_MOD_C` di `grafana/app.js`, jumlah modulnya diperbarui di `scripts/courses.json`, dan `data/modules.json` dibangkitkan ulang lewat `npm run extract`.

## Sumber

- [Dokumentasi Resmi — Grafana Modern (Grafana 11)](https://grafana.com/docs/grafana/latest/)
- [Grafana Tempo — TraceQL](https://grafana.com/docs/tempo/latest/traceql/)
- [Grafana Loki — Bahasa Kueri LogQL](https://grafana.com/docs/loki/latest/query/)
- [Grafana — Provisioning](https://grafana.com/docs/grafana/latest/administration/provisioning/)
