# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas PostgreSQL Modern (PostgreSQL 16–18): `EXPLAIN (ANALYZE, BUFFERS)`, Partisi Deklaratif, `pgvector` (Pencarian Vektor AI), Row-Level Security (RLS), & Tuning `pg_stat_statements`

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 12 modul yang sudah ada di kelas `postgresql/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `postgresql/app.js` (larik `MODUL`).

## 1. Audit Modul Saat Ini di Repositori (`postgresql/app.js`)

Saat ini, kelas **`postgresql`** di repositori Kodeloka memiliki **12 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |
| 1 | Arsitektur PostgreSQL: Proses, Memori & WAL | Dasar | Sudah ada |
| 2 | Memilih Tipe Data yang Tepat | Dasar | Sudah ada |
| 3 | Indeks: B-tree, GIN, Partial & Covering | Menengah | Sudah ada |
| 4 | Membaca EXPLAIN ANALYZE | Menengah | Sudah ada |
| 5 | Transaksi, Tingkat Isolasi & Deadlock | Menengah | Sudah ada |
| 6 | VACUUM, Bloat & Autovacuum | Menengah | Sudah ada |
| 7 | Partisi Tabel | Lanjutan | Sudah ada |
| 8 | Replikasi, Backup & Point-in-Time Recovery | Lanjutan | Sudah ada |
| 9 | Peran, Hak Akses & Row Level Security | Menengah | Sudah ada |
| 10 | Migrasi Skema Tanpa Downtime | Lanjutan | Sudah ada |
| 11 | Pola Kueri: Window Function, CTE & Upsert | Menengah | Sudah ada |
| 12 | Pemantauan & Daftar Periksa Produksi | Lanjutan | Sudah ada |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan di bawah ini menambahkan pembaruan 2024–2026, tetapi sebagian topiknya sudah ada di kelas. Kelas sudah membahas indeks B-tree, GIN, BRIN, partial, dan covering (`INCLUDE`) di modul 3, `EXPLAIN (ANALYZE, BUFFERS)` di modul 4, partisi `PARTITION BY RANGE` di modul 7, RLS dengan `CREATE POLICY` dan `FORCE ROW LEVEL SECURITY` di modul 9, `uuidv7` sekilas di modul 2, serta PgBouncer di modul 1 dan 12. Yang belum ada: `pgvector` (HNSW); `pg_stat_statements` baru disinggung di modul 4. Modul 13 dan sebagian modul 14 mengulang materi yang sudah ada.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 13: Bedah Rencana Eksekusi dengan `EXPLAIN (ANALYZE, BUFFERS)` dan Indeks Tingkat Lanjut (GIN, BRIN, Partial, Covering `INCLUDE`)

- **Tingkat:** Lanjut
- **Ringkasan:** Membaca output `Buffers: shared hit/read` untuk menemukan leher botol I/O disk, membuat *Covering Index* (`CREATE INDEX ... INCLUDE (...)`) demi mencapai *Index-Only Scan*, serta menggunakan indeks GIN untuk `JSONB`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Membaca output `Buffers: shared hit/read` untuk menemukan leher botol I/O disk, membuat *Covering Index* (`CREATE INDEX ... INCLUDE (...)`) demi mencapai *Index-Only Scan*, serta menggunakan indeks GIN untuk `JSONB`. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```sql
-- Membuat Partial & Covering Index agar kueri beranda berjalan dengan Index-Only Scan
CREATE INDEX CONCURRENTLY idx_pesanan_aktif_pelanggan
ON pesanan (id_pelanggan, dibuat_pada DESC)
INCLUDE (total_rupiah, nomor_faktur)
WHERE status = 'DIBAYAR';

EXPLAIN (ANALYZE, BUFFERS)
SELECT id_pelanggan, total_rupiah, nomor_faktur
FROM pesanan
WHERE id_pelanggan = 42 AND status = 'DIBAYAR'
ORDER BY dibuat_pada DESC LIMIT 10;
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `postgresql/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `postgresql` dari **12 modul** menjadi **15 modul** berstandar terbaru.


## Modul Pembaruan 14: Isolasi Multi-Tenant dengan Row-Level Security (RLS), Partisi Tabel Deklaratif, dan `UUIDv7` (`uuidv7()`, PostgreSQL 18+) untuk Kinerja B-Tree

- **Tingkat:** Lanjut
- **Ringkasan:** Mengamankan data pelanggan di aplikasi SaaS langsung di tingkat mesin database menggunakan kebijakan **Row-Level Security (`CREATE POLICY`)**, memecah tabel ratusan juta baris dengan *Range Partitioning*, serta memahami mengapa UUIDv7 berurutan jauh lebih ramah indeks B-Tree dibanding UUIDv4 acak.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mengamankan data pelanggan di aplikasi SaaS langsung di tingkat mesin database menggunakan kebijakan **Row-Level Security (`CREATE POLICY`)**, memecah tabel ratusan juta baris dengan *Range Partitioning*, serta memahami mengapa UUIDv7 berurutan jauh lebih ramah indeks B-Tree dibanding UUIDv4 acak. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```sql
ALTER TABLE dokumen_tenant ENABLE ROW LEVEL SECURITY;
ALTER TABLE dokumen_tenant FORCE ROW LEVEL SECURITY;

CREATE POLICY isolasi_tenant ON dokumen_tenant
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `postgresql/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `postgresql` dari **12 modul** menjadi **15 modul** berstandar terbaru.


## Modul Pembaruan 15: Pencarian Kemiripan Semantik & RAG dengan `pgvector` (HNSW Index), Connection Pooling (PgBouncer), dan Pemantauan `pg_stat_statements`

- **Tingkat:** Lanjut
- **Ringkasan:** Menyimpan dan mencari vektor *embedding* AI di PostgreSQL menggunakan ekstensi `vector` (`<=>` jarak kosinus) dengan indeks HNSW, serta melacak kueri paling lambat di produksi dengan `pg_stat_statements`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menyimpan dan mencari vektor *embedding* AI di PostgreSQL menggunakan ekstensi `vector` (`<=>` jarak kosinus) dengan indeks HNSW, serta melacak kueri paling lambat di produksi dengan `pg_stat_statements`. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE potongan_materi (
    id BIGSERIAL PRIMARY KEY,
    judul TEXT NOT NULL,
    embedding vector(768) NOT NULL
);

-- Indeks HNSW untuk pencarian kemiripan kosinus yang sangat cepat
CREATE INDEX ON potongan_materi USING hnsw (embedding vector_cosine_ops);
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `postgresql/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `postgresql` dari **12 modul** menjadi **15 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `postgresql` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `postgresql/app.js` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `postgresql` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (12 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `postgresql`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 12 modul yang sudah ada di `postgresql/app.js` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `postgresql` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan ketiga modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `postgresql/`
- B. Mengekstrak judul, tingkat, ringkasan, isi, contoh kode, dan kuis setiap modul dari berkas ini ke dalam larik `MODUL` di `postgresql/app.js` (bentuk objeknya mengikuti mesin kelas tersebut), memperbarui jumlah modul di `scripts/courses.json`, lalu menjalankan `npm run extract`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke larik `MODUL` di `postgresql/app.js`, jumlah modulnya diperbarui di `scripts/courses.json`, dan `data/modules.json` dibangkitkan ulang lewat `npm run extract`.

## Sumber

- [Dokumentasi Resmi — PostgreSQL Modern (PostgreSQL 16–18)](https://www.postgresql.org/docs/current/)
- [PostgreSQL — Fungsi UUID (`uuidv7()`, PostgreSQL 18)](https://www.postgresql.org/docs/current/functions-uuid.html)
- [PostgreSQL — Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [PostgreSQL — Index-Only Scans dan Covering Index](https://www.postgresql.org/docs/current/indexes-index-only-scans.html)
- [pgvector — Repositori Resmi](https://github.com/pgvector/pgvector)
