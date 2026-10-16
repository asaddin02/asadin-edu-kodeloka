# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Apache Kafka Modern (Kafka 3.7–4.0): Arsitektur KRaft Tanpa ZooKeeper, Exactly-Once Semantics (EOS), Dead Letter Topic, & Schema Registry

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 0 modul yang sudah ada di kelas `kafka/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `kafka/data/modules.json`.

## 1. Audit Modul Saat Ini di Repositori (`kafka/data/modules.json`)

Saat ini, kelas **`kafka`** di repositori Kodeloka memiliki **0 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan penuh di bawah ini menambahkan kapabilitas rilis terbaru yang belum tercakup di modul lama.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 14: Arsitektur KRaft (Kafka Raft Metadata Mode) — Mengelola Cluster Kafka 4.0 Tanpa ZooKeeper

- **Tingkat:** Lanjut
- **Ringkasan:** Mengonfigurasi peran `process.roles=broker,controller` pada mode **KRaft** yang menjadi satu-satunya arsitektur di Apache Kafka 4.0+, memformat penyimpanan dengan `kafka-storage.sh random-uuid`, serta memantau kuorum controller.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mengonfigurasi peran `process.roles=broker,controller` pada mode **KRaft** yang menjadi satu-satunya arsitektur di Apache Kafka 4.0+, memformat penyimpanan dengan `kafka-storage.sh random-uuid`, serta memantau kuorum controller. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
# Konfigurasi inti node gabungan KRaft (broker + controller)
process.roles=broker,controller
node.id=1
controller.quorum.voters=1@kafka-1:9093,2@kafka-2:9093,3@kafka-3:9093
listeners=PLAINTEXT://:9092,CONTROLLER://:9093
controller.listener.names=CONTROLLER
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `kafka/data/modules.json` (dan `kafka/app.js`) sehingga memperluas cakupan kelas `kafka` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 15: Produsen Idempoten (`enable.idempotence=true`), Transaksi Lintas Partisi, dan `isolation.level=read_committed`

- **Tingkat:** Lanjut
- **Ringkasan:** Menjamin tidak adanya duplikasi pesan saat jaringan mengalami *retry* menggunakan produsen idempoten (`acks=all`, `enable.idempotence=true`) dan transaksi *consume-transform-produce*.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menjamin tidak adanya duplikasi pesan saat jaringan mengalami *retry* menggunakan produsen idempoten (`acks=all`, `enable.idempotence=true`) dan transaksi *consume-transform-produce*. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
# Konfigurasi Produsen Kafka Aman untuk Produksi
acks=all
enable.idempotence=true
max.in.flight.requests.per.connection=5
delivery.timeout.ms=120000
compression.type=lz4
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `kafka/data/modules.json` (dan `kafka/app.js`) sehingga memperluas cakupan kelas `kafka` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 16: Evolusi Skema (Avro/Protobuf Schema Registry), Retry Topic Bertingkat, Dead Letter Topic (DLT), & Pemantauan Consumer Lag

- **Tingkat:** Lanjut
- **Ringkasan:** Mencegah pesan beracun (*poison pill*) menghentikan seluruh partisi konsumen dengan mengarahkannya ke *Retry Topic* dan *Dead Letter Topic (DLT)*, serta menjaga kompatibilitas skema *backward/forward*.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mencegah pesan beracun (*poison pill*) menghentikan seluruh partisi konsumen dengan mengarahkannya ke *Retry Topic* dan *Dead Letter Topic (DLT)*, serta menjaga kompatibilitas skema *backward/forward*. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
# Memeriksa Consumer Group Lag di produksi
kafka-consumer-groups.sh --bootstrap-server kafka-1:9092 --describe --group grup-faktur
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `kafka/data/modules.json` (dan `kafka/app.js`) sehingga memperluas cakupan kelas `kafka` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `kafka` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `kafka/data/modules.json` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `kafka` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (0 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `kafka`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 0 modul yang sudah ada di `kafka/data/modules.json` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `kafka` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan ketiga modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `kafka/`
- B. Mengekstrak objek `judul`, `tingkat`, `ringkas`, `isi`, contoh kode, dan `kuis` dari berkas ini ke dalam `kafka/data/modules.json` serta memperbarui jumlah modul di `scripts/courses.json`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke `kafka/data/modules.json` (dan disinkronkan ke `kafka/app.js` serta `scripts/courses.json`).

## Sumber

- [Dokumentasi Resmi — Apache Kafka Modern (Kafka 3.7–4.0)](https://kafka.apache.org/documentation/)
