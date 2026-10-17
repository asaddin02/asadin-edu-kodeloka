# Pencarian Kemiripan Semantik (*Vector Search*), Indeks HNSW (`pgvector`), dan `uuidv7()` di PostgreSQL Modern

- **Letak:** sesudah modul 12
- **Tingkat:** Lanjut
- **Ringkasan:** Menyimpan dan mengindeks *vector embeddings* menggunakan ekstensi `pgvector` dengan indeks HNSW untuk pencarian kemiripan semantik dan sistem RAG, serta memanfaatkan fungsi bawaan `uuidv7()` di PostgreSQL 18+ untuk kunci primer yang ramah indeks B-Tree.

## Mengapa Menyimpan Vektor Langsung di PostgreSQL?

Aplikasi modern yang mengintegrasikan pencarian semantik atau *Retrieval-Augmented Generation* (RAG) membutuhkan penyimpanan vektor berdimensi tinggi (*embeddings*) hasil model bahasa. Alih-alih mengelola basis data vektor terpisah yang rawan mengalami ketidaksinkronan data (seperti dokumen sudah dihapus di PostgreSQL tetapi masih muncul di hasil pencarian vektor), ekstensi resmi **`pgvector`** memungkinkan Anda menggabungkan filter relasional (`WHERE tenant_id = ...`), izin *Row-Level Security* (RLS), transaksi ACID, dan pencarian kemiripan vektor dalam satu kueri SQL tunggal.

## 1. Tipe Data `vector`, Operator Jarak, dan Indeks HNSW

Setelah mengaktifkan ekstensi dengan `CREATE EXTENSION IF NOT EXISTS vector;`, Anda dapat membuat kolom `vector(D)` di mana `D` adalah jumlah dimensi model *embedding* Anda (misalnya `768`, `1024`, atau `1536`). `pgvector` menyediakan tiga operator jarak utama:

| Operator `pgvector` | Metrik Jarak | Kelas Operator Indeks HNSW | Kapan Digunakan? |
| :--- | :--- | :--- | :--- |
| `<=>` | Jarak Kosinus (*Cosine Distance*) | `vector_cosine_ops` | Standar umum untuk kemiripan teks/dokumen yang belum dinormalisasi |
| `<->` | Jarak Euclidean / L2 | `vector_l2_ops` | Ketika besaran (*magnitude*) vektor juga memiliki makna |
| `<#>` | *Negative Inner Product* | `vector_ip_ops` | Paling cepat apabila seluruh vektor sudah dinormalisasi panjangnya menjadi `1` (*unit vectors*) |

Untuk mempercepat pencarian *Approximate Nearest Neighbor* (ANN) tanpa harus memindai seluruh baris tabel (*sequential scan*), buat indeks **HNSW (*Hierarchical Navigable Small World*)**:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE dokumen_materi (
    -- Di PostgreSQL 18+, uuidv7() bawaan menghasilkan UUID berurutan waktu
    -- yang mencegah fragmentasi halaman indeks B-Tree!
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    kelas VARCHAR(50) NOT NULL,
    judul TEXT NOT NULL,
    ringkasan TEXT NOT NULL,
    embedding vector(1536) NOT NULL
);

-- Membuat indeks grafik HNSW untuk jarak kosinus
CREATE INDEX idx_dokumen_embedding_hnsw
    ON dokumen_materi
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

-- Mencari 5 materi paling relevan di dalam kelas 'postgresql'
SELECT id, judul, 1 - (embedding <=> $1::vector) AS skor_kemiripan
FROM dokumen_materi
WHERE kelas = 'postgresql'
ORDER BY embedding <=> $1::vector
LIMIT 5;
```

## 2. Mengapa `uuidv7()` (PostgreSQL 18+) Mengungguli `gen_random_uuid()` (UUIDv4)?

Pada PostgreSQL 17 ke bawah, fungsi bawaan `gen_random_uuid()` menghasilkan **UUIDv4** yang sepenuhnya acak. Pada tabel berukuran puluhan juta baris, penyisipan kunci primer acak memaksa PostgreSQL memodifikasi halaman indeks B-Tree secara acak di seluruh disk (*page splits* dan kehilangan *buffer cache locality*).

Sejak **PostgreSQL 18**, fungsi bawaan **`uuidv7()`** menghasilkan UUID versi 7 yang menempatkan **stempel waktu Unix 48-bit dalam milidetik di bagian paling depan**, diikuti bit acak. Hasilnya, setiap baris baru selalu disisipkan secara berurutan di ujung kanan pohon B-Tree (seperti `BIGSERIAL`), namun tetap mempertahankan keunikan global 128-bit!

## 3. Menyetel Parameter Kueri HNSW (`hnsw.ef_search`) dan Iterative Scan

Secara bawaan, `hnsw.ef_search` bernilai `40`. Jika kueri Anda menggabungkan `ORDER BY embedding <=> $1 LIMIT 5` dengan filter `WHERE` yang ketat, aktifkan pemindaian iteratif (`SET LOCAL hnsw.iterative_scan = relaxed_order;` pada `pgvector 0.8.0+`) agar indeks HNSW terus menelusuri graf hingga menemukan cukup baris yang lolos filter `WHERE`.

## Kuis Pemahaman

### Soal 1
Operator dan kelas operator indeks HNSW manakah yang harus dipasangkan jika Anda menggunakan jarak kosinus (*cosine distance*) pada `pgvector`?
- A. Operator `<->` dengan `vector_l2_ops`
- B. Operator `<=>` dengan `vector_cosine_ops`
- C. Operator `<#>` dengan `vector_ip_ops`
- D. Operator `@@` dengan `tsvector_ops`

**Jawaban Benar:** B
**Penjelasan:** Pada `pgvector`, operator `<=>` menghitung jarak kosinus, dan indeks HNSW hanya akan terpakai oleh *query planner* apabila dibangun menggunakan kelas operator yang sepadan, yaitu `vector_cosine_ops`.

### Soal 2
Apa keunggulan utama fungsi bawaan `uuidv7()` (diperkenalkan di PostgreSQL 18) dibandingkan `gen_random_uuid()` (UUIDv4) ketika dijadikan kolom `PRIMARY KEY`?
- A. Ukuran `uuidv7()` hanya 32-bit sehingga lebih pendek dari `INTEGER`.
- B. `uuidv7()` mengurutkan 48-bit pertama berdasarkan waktu pembuatan (*time-ordered*), sehingga penyisipan baris baru terfokus di ujung kanan indeks B-Tree dan meminimalkan fragmentasi halaman disk.
- C. `uuidv7()` mengenkripsi seluruh kolom tabel secara otomatis.
- D. `uuidv7()` tidak membutuhkan indeks B-Tree sama sekali.

**Jawaban Benar:** B
**Penjelasan:** Karena awalan `uuidv7()` bersifat monoton naik terhadap waktu, halaman indeks B-Tree yang aktif dimodifikasi tetap berada di memori *shared buffers*, menghindari *random disk I/O* yang terjadi pada UUIDv4 acak.

### Soal 3
Mengapa kueri `SELECT ... ORDER BY 1 - (embedding <=> $1) DESC LIMIT 5` gagal memanfaatkan indeks HNSW, sedangkan `ORDER BY embedding <=> $1 ASC LIMIT 5` berhasil memakainya?
- A. Karena indeks HNSW di PostgreSQL bekerja pada operator jarak langsung (`ORDER BY embedding <=> $1`), bukan pada ekspresi matematika turunan.
- B. Karena PostgreSQL tidak mendukung klausa `DESC`.
- C. Karena angka `1` dianggap sebagai nama kolom.
- D. Karena `LIMIT 5` terlalu kecil untuk indeks HNSW.

**Jawaban Benar:** A
**Penjelasan:** Agar *index scan* HNSW terpicu di PostgreSQL, klausa `ORDER BY` harus menggunakan operator jarak vektor secara langsung (`embedding <=> $1`) dalam urutan menaik (`ASC`), sedangkan perhitungan skor kemiripan `1 - (embedding <=> $1)` cukup ditaruh di daftar kolom `SELECT`.

## Sumber
- [pgvector Official Repository & Documentation](https://github.com/pgvector/pgvector)
- [PostgreSQL 18 Documentation — UUID Functions (`uuidv7()`)](https://www.postgresql.org/docs/current/functions-uuid.html)
