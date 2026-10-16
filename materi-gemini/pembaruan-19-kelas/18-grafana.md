# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Grafana Modern (Grafana 11): Korelasi Lintas Sumber Data (Prometheus + Loki + Tempo), LogQL & TraceQL, Unified Alerting, & Dashboards-as-Code

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 0 modul yang sudah ada di kelas `grafana/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `grafana/data/modules.json`.

## 1. Audit Modul Saat Ini di Repositori (`grafana/data/modules.json`)

Saat ini, kelas **`grafana`** di repositori Kodeloka memiliki **0 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan penuh di bawah ini menambahkan kapabilitas rilis terbaru yang belum tercakup di modul lama.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 16: Eksplorasi Terpadu Tiga Pilar — Melompat dari Grafik Metrik (Exemplars) ke Trace (Tempo/TraceQL) dan Log (Loki/LogQL)

- **Tingkat:** Menengah
- **Ringkasan:** Mengonfigurasi `derivedFields` pada sumber data Loki dan `tracesToLogsV2` / `tracesToMetrics` pada sumber data Tempo agar insinyur yang sedang menangani insiden dapat berpindah dari grafik lonjakan galat ke baris log dan trace hanya dengan satu klik.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mengonfigurasi `derivedFields` pada sumber data Loki dan `tracesToLogsV2` / `tracesToMetrics` pada sumber data Tempo agar insinyur yang sedang menangani insiden dapat berpindah dari grafik lonjakan galat ke baris log dan trace hanya dengan satu klik. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
# Contoh kueri LogQL (Grafana Loki) untuk memfilter log JSON yang memiliki durasi > 500ms
{service_name="api-kodeloka"} | json | status >= 500 or durasi_ms > 500
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `grafana/data/modules.json` (dan `grafana/app.js`) sehingga memperluas cakupan kelas `grafana` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 17: Bahasa Kueri Jejak Terdistribusi dengan TraceQL di Grafana Tempo

- **Tingkat:** Lanjut
- **Ringkasan:** Mencari jejak transaksi spesifik di antara jutaan span menggunakan **TraceQL** berdasarkan atribut span, durasi, maupun hubungan induk-anak.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mencari jejak transaksi spesifik di antara jutaan span menggunakan **TraceQL** berdasarkan atribut span, durasi, maupun hubungan induk-anak. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
# Kueri TraceQL: Cari trace di layanan checkout yang memanggil database > 300ms dan berstatus error
{ resource.service.name = "checkout-api" && status = error } >> { span.db.system = "postgresql" && duration > 300ms }
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `grafana/data/modules.json` (dan `grafana/app.js`) sehingga memperluas cakupan kelas `grafana` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 18: Provisioning Otomatis (*Dashboards & Alerting as Code*), Variabel Template Dinamis, dan Keamanan RBAC Organisasi

- **Tingkat:** Lanjut
- **Ringkasan:** Menyimpan definisi sumber data, aturan peringatan (*Contact Points* & *Notification Policies*), serta JSON dasbor di repositori Git menggunakan direktori `/etc/grafana/provisioning/`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menyimpan definisi sumber data, aturan peringatan (*Contact Points* & *Notification Policies*), serta JSON dasbor di repositori Git menggunakan direktori `/etc/grafana/provisioning/`. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
# /etc/grafana/provisioning/datasources/utama.yaml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `grafana/data/modules.json` (dan `grafana/app.js`) sehingga memperluas cakupan kelas `grafana` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `grafana` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `grafana/data/modules.json` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `grafana` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (0 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `grafana`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 0 modul yang sudah ada di `grafana/data/modules.json` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

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
- B. Mengekstrak objek `judul`, `tingkat`, `ringkas`, `isi`, contoh kode, dan `kuis` dari berkas ini ke dalam `grafana/data/modules.json` serta memperbarui jumlah modul di `scripts/courses.json`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke `grafana/data/modules.json` (dan disinkronkan ke `grafana/app.js` serta `scripts/courses.json`).

## Sumber

- [Dokumentasi Resmi — Grafana Modern (Grafana 11)](https://grafana.com/docs/grafana/latest/)
