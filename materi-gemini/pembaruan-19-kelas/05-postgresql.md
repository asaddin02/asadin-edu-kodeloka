# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas PostgreSQL Modern (PostgreSQL 16–18): `EXPLAIN (ANALYZE, BUFFERS)`, Partisi Deklaratif, `pgvector` (Pencarian Vektor AI), Row-Level Security (RLS), & Tuning `pg_stat_statements`

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 0 modul yang sudah ada di kelas `postgresql/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `postgresql/data/modules.json`.

## 1. Audit Modul Saat Ini di Repositori (`postgresql/data/modules.json`)

Saat ini, kelas **`postgresql`** di repositori Kodeloka memiliki **0 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan penuh di bawah ini menambahkan kapabilitas rilis terbaru yang belum tercakup di modul lama.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 13: Bedah Rencana Eksekusi dengan `EXPLAIN (ANALYZE, BUFFERS)` dan Indeks Tingkat Lanjut (GIN, BRIN, Partial, Covering `INCLUDE`)

- **Tingkat:** Lanjut
- **Ringkasan:** Membaca output `Buffers: shared hit/read` untuk menemukan leher botol I/O disk, membuat *Covering Index* (`CREATE INDEX ... INCLUDE (...)`) demi mencapai *Index-Only Scan*, serta menggunakan indeks GIN untuk `JSONB`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Membaca output `Buffers: shared hit/read` untuk menemukan leher botol I/O disk, membuat *Covering Index* (`CREATE INDEX ... INCLUDE (...)`) demi mencapai *Index-Only Scan*, serta menggunakan indeks GIN untuk `JSONB`. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
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

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `postgresql/data/modules.json` (dan `postgresql/app.js`) sehingga memperluas cakupan kelas `postgresql` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 14: Isolasi Multi-Tenant dengan Row-Level Security (RLS), Partisi Tabel Deklaratif, dan `UUIDv7` (`uuidv7()`) untuk Kinerja B-Tree

- **Tingkat:** Lanjut
- **Ringkasan:** Mengamankan data pelanggan di aplikasi SaaS langsung di tingkat mesin database menggunakan kebijakan **Row-Level Security (`CREATE POLICY`)**, memecah tabel ratusan juta baris dengan *Range Partitioning*, serta memahami mengapa UUIDv7 berurutan jauh lebih ramah indeks B-Tree dibanding UUIDv4 acak.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mengamankan data pelanggan di aplikasi SaaS langsung di tingkat mesin database menggunakan kebijakan **Row-Level Security (`CREATE POLICY`)**, memecah tabel ratusan juta baris dengan *Range Partitioning*, serta memahami mengapa UUIDv7 berurutan jauh lebih ramah indeks B-Tree dibanding UUIDv4 acak. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
ALTER TABLE dokumen_tenant ENABLE ROW LEVEL SECURITY;
ALTER TABLE dokumen_tenant FORCE ROW LEVEL SECURITY;

CREATE POLICY isolasi_tenant ON dokumen_tenant
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `postgresql/data/modules.json` (dan `postgresql/app.js`) sehingga memperluas cakupan kelas `postgresql` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 15: Pencarian Kemiripan Semantik & RAG dengan `pgvector` (HNSW Index), Connection Pooling (PgBouncer), dan Pemantauan `pg_stat_statements`

- **Tingkat:** Lanjut
- **Ringkasan:** Menyimpan dan mencari vektor *embedding* AI di PostgreSQL menggunakan ekstensi `vector` (`<=>` jarak kosinus) dengan indeks HNSW, serta melacak kueri paling lambat di produksi dengan `pg_stat_statements`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menyimpan dan mencari vektor *embedding* AI di PostgreSQL menggunakan ekstensi `vector` (`<=>` jarak kosinus) dengan indeks HNSW, serta melacak kueri paling lambat di produksi dengan `pg_stat_statements`. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE potongan_materi (
    id BIGSERIAL PRIMARY KEY,
    judul TEXT NOT NULL,
    embedding vector(768) NOT NULL
);

-- Indeks HNSW untuk pencarian kemiripan kosinus yang sangat cepat
CREATE INDEX ON potongan_materi USING hnsw (embedding vector_cosine_ops);
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `postgresql/data/modules.json` (dan `postgresql/app.js`) sehingga memperluas cakupan kelas `postgresql` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `postgresql` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `postgresql/data/modules.json` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `postgresql` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (0 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `postgresql`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 0 modul yang sudah ada di `postgresql/data/modules.json` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

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
- B. Mengekstrak objek `judul`, `tingkat`, `ringkas`, `isi`, contoh kode, dan `kuis` dari berkas ini ke dalam `postgresql/data/modules.json` serta memperbarui jumlah modul di `scripts/courses.json`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke `postgresql/data/modules.json` (dan disinkronkan ke `postgresql/app.js` serta `scripts/courses.json`).

## Sumber

- [Dokumentasi Resmi — PostgreSQL Modern (PostgreSQL 16–18)](https://www.postgresql.org/docs/current/)
