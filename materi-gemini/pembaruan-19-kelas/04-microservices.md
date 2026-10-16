# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Arsitektur Microservices Modern: Transactional Outbox Pattern, Saga Orchestration vs Choreography, Idempotency Keys, & Contract Testing

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 24 modul yang sudah ada di kelas `microservices/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `microservices/app.js` (larik `MODULES_DATA`).

## 1. Audit Modul Saat Ini di Repositori (`microservices/app.js`)

Saat ini, kelas **`microservices`** di repositori Kodeloka memiliki **24 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |
| 1 | 01. Belajar Microservices - Intro | — | Sudah ada |
| 2 | 02. Belajar Microservices - Arsitektur Monolith | — | Sudah ada |
| 3 | 03. Belajar Microservices - Arsitektur Microservices | — | Sudah ada |
| 4 | 04. Belajar Microservices - Type of Microservices | — | Sudah ada |
| 5 | 05. Belajar Microservices - Database per Service | — | Sudah ada |
| 6 | 06. Belajar Microservices - Shared Database | — | Sudah ada |
| 7 | 07. Belajar Microservices - NoSQL Database | — | Sudah ada |
| 8 | 08. Belajar Microservices - Remote Procedure Invocation | — | Sudah ada |
| 9 | 09. Belajar Microservices - Asynchronous Messaging | — | Sudah ada |
| 10 | 10. Belajar Microservices - Service Orchestration | — | Sudah ada |
| 11 | 11. Belajar Microservices - Service Choreography | — | Sudah ada |
| 12 | 12. Saga Pattern & Transaksi Terdistribusi | — | Sudah ada |
| 13 | 13. Belajar Microservices - API Gateway Pattern | — | Sudah ada |
| 14 | 14. Belajar Microservices - Backend for Frontend (BFF) | — | Sudah ada |
| 15 | 15. Belajar Microservices - Authentication & Authorization | — | Sudah ada |
| 16 | 16. Belajar Microservices - CQRS Pattern | — | Sudah ada |
| 17 | 17. Resilience Pattern - Circuit Breaker, Retry, Timeout & Bulkhead | — | Sudah ada |
| 18 | 18. Distributed Tracing & Observability | — | Sudah ada |
| 19 | 19. Contract Testing & Strategi Pengujian Microservices | — | Sudah ada |
| 20 | 20. Belajar Microservices - Server Side Discovery | — | Sudah ada |
| 21 | 21. Belajar Microservices - Client Side Discovery | — | Sudah ada |
| 22 | 22. Belajar Microservices - Service Registry | — | Sudah ada |
| 23 | 23. Belajar Microservices - Centralized Configuration | — | Sudah ada |
| 24 | 24. Service Mesh & Deployment ke Kubernetes | — | Sudah ada |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan di bawah ini menambahkan pembaruan 2024–2026, tetapi sebagian topiknya sudah ada di kelas. Kelas sudah membahas Outbox, CDC/Debezium, dan deduplikasi di modul 12 (Saga), idempotensi di modul 12 dan 17, Bulkhead dan Timeout di modul 17, serta Contract Testing (Pact) di modul 19. Yang belum ada: skema lengkap tabel `outbox_events`, header `Idempotency-Key`, dan tabel `processed_messages` (Inbox Pattern).
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 25: Transactional Outbox Pattern & Change Data Capture (CDC) untuk Mencegah Dual-Write Bug

- **Tingkat:** Lanjut
- **Ringkasan:** Menjamin konsistensi antara pembaruan database lokal dan pengiriman pesan ke broker (Kafka/RabbitMQ) tanpa *Two-Phase Commit* menggunakan tabel `outbox_events` dalam satu transaksi database yang sama.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menjamin konsistensi antara pembaruan database lokal dan pengiriman pesan ke broker (Kafka/RabbitMQ) tanpa *Two-Phase Commit* menggunakan tabel `outbox_events` dalam satu transaksi database yang sama. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```sql
-- Tabel Outbox di PostgreSQL yang ditulis dalam 1 transaksi yang sama dengan tabel pesanan
CREATE TABLE outbox_events (
    id UUID PRIMARY KEY,
    aggregate_type VARCHAR(64) NOT NULL,
    aggregate_id VARCHAR(64) NOT NULL,
    event_type VARCHAR(128) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ NULL
);
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODULES_DATA` di `microservices/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `microservices` dari **24 modul** menjadi **27 modul** berstandar terbaru.


## Modul Pembaruan 26: Idempotency Key (`Idempotency-Key` Header) & Deduplikasi Konsumen Pesan (*Inbox Pattern*)

- **Tingkat:** Lanjut
- **Ringkasan:** Memastikan operasi pembayaran atau pembuatan pesanan aman diulang (*at-least-once delivery*) tanpa menagih pelanggan dua kali dengan menyimpan kunci idempotensi dan menggunakan tabel `processed_messages`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Memastikan operasi pembayaran atau pembuatan pesanan aman diulang (*at-least-once delivery*) tanpa menagih pelanggan dua kali dengan menyimpan kunci idempotensi dan menggunakan tabel `processed_messages`. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```sql
-- Mencegah pemrosesan ganda pesan broker (Inbox Pattern)
CREATE TABLE processed_messages (
    message_id     TEXT        NOT NULL,
    consumer_group TEXT        NOT NULL,
    processed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (message_id, consumer_group)
);

-- Jalankan INSERT ini dalam transaksi database yang sama dengan efek bisnisnya
INSERT INTO processed_messages (message_id, consumer_group, processed_at)
VALUES ($1, $2, NOW())
ON CONFLICT (message_id, consumer_group) DO NOTHING;
-- Jika rowCount == 0, berarti pesan ini sudah pernah diproses sebelumnya!
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODULES_DATA` di `microservices/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `microservices` dari **24 modul** menjadi **27 modul** berstandar terbaru.


## Modul Pembaruan 27: Consumer-Driven Contract Testing, Resiliency (Bulkhead & Adaptive Timeout), dan Graceful Degradation

- **Tingkat:** Lanjut
- **Ringkasan:** Mencegah perubahan skema API satu layanan merusak layanan lain menggunakan pengujian kontrak otomatis, serta mengisolasi kolam koneksi per layanan tujuan (*Bulkhead Pattern*) agar satu layanan lambat tidak menghabiskan seluruh thread.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mencegah perubahan skema API satu layanan merusak layanan lain menggunakan pengujian kontrak otomatis, serta mengisolasi kolam koneksi per layanan tujuan (*Bulkhead Pattern*) agar satu layanan lambat tidak menghabiskan seluruh thread. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```text
// Contoh konfigurasi batas waktu bertingkat (Timeout Budget)
// API Gateway (3000ms) -> Order Service (2000ms) -> Inventory RPC (800ms)
// Selalu teruskan sisa batas waktu (Context Deadline) melalui header gRPC/HTTP!
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODULES_DATA` di `microservices/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `microservices` dari **24 modul** menjadi **27 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `microservices` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `microservices/app.js` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `microservices` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (24 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `microservices`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 24 modul yang sudah ada di `microservices/app.js` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `microservices` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan ketiga modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `microservices/`
- B. Mengekstrak judul, tingkat, ringkasan, isi, contoh kode, dan kuis setiap modul dari berkas ini ke dalam larik `MODULES_DATA` di `microservices/app.js` (bentuk objeknya mengikuti mesin kelas tersebut), memperbarui jumlah modul di `scripts/courses.json`, lalu menjalankan `npm run extract`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke larik `MODULES_DATA` di `microservices/app.js`, jumlah modulnya diperbarui di `scripts/courses.json`, dan `data/modules.json` dibangkitkan ulang lewat `npm run extract`.

## Sumber

- [Dokumentasi Resmi — Arsitektur Microservices Modern](https://microservices.io/)
- [microservices.io — Pola Transactional Outbox](https://microservices.io/patterns/data/transactional-outbox.html)
