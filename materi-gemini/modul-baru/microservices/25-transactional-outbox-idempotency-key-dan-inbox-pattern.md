# Menjamin Konsistensi Data Lintas Layanan: *Transactional Outbox*, *Idempotency-Key*, dan *Inbox Pattern*

- **Letak:** sesudah modul 12
- **Tingkat:** Lanjut
- **Ringkasan:** Mencegah hilangnya event akibat *dual-write problem* menggunakan tabel `outbox_events` dalam satu transaksi ACID, serta mencegah pemrosesan ganda di sisi penerima menggunakan `Idempotency-Key` dan tabel `processed_messages` (*Inbox Pattern*).

## Mengapa *Dual-Write* ke Database dan Message Broker Berbahaya?

Dalam arsitektur *microservices* berbasis event (seperti modul *Saga Pattern*), `Order Service` harus menyimpan pesanan baru ke tabel `orders` di PostgreSQL **dan** mengirimkan event `OrderCreated` ke Kafka/RabbitMQ. Jika aplikasi melakukan `db.Commit()` lalu memanggil `kafkaProducer.Send()` secara berurutan, terdapat risiko **Dual-Write Problem**: jika proses aplikasi mati atau jaringan ke Kafka terputus tepat setelah `db.Commit()`, pesanan tercatat di database tetapi event `OrderCreated` **hilang selamanya**! Sebaliknya, jika mengirim ke Kafka lebih dulu lalu `db.Commit()` gagal, layanan hilir akan memproses pesanan fiktif.

## 1. Solusi di Sisi Pengirim: *Transactional Outbox Pattern*

Alih-alih mengirim pesan langsung ke broker jaringan di tengah transaksi bisnis, simpan pesan event tersebut ke dalam tabel **`outbox_events`** di basis data yang sama, di dalam **satu transaksi ACID lokal** bersama penyimpanan tabel `orders`:

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL,
    total_rupiah BIGINT NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE outbox_events (
    event_id UUID PRIMARY KEY,
    aggregate_type VARCHAR(64) NOT NULL,
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_outbox_unpublished
    ON outbox_events (created_at)
    WHERE published_at IS NULL;

-- Dieksekusi dalam SATU transaksi database:
BEGIN;
INSERT INTO orders (id, customer_id, total_rupiah, status)
VALUES ('0192f1a0-7c00-7000-8000-000000000001', 'c9b11111-0000-4000-8000-000000000099', 350000, 'PENDING');

INSERT INTO outbox_events (event_id, aggregate_type, aggregate_id, event_type, payload)
VALUES (
    '0192f1a0-7c00-7000-8000-000000000002',
    'Order',
    '0192f1a0-7c00-7000-8000-000000000001',
    'OrderCreated',
    '{"order_id": "0192f1a0-7c00-7000-8000-000000000001", "total_rupiah": 350000}'
);
COMMIT;
```

Selanjutnya, pekerja relai latar belakang (*Outbox Relay* atau *Change Data Capture* seperti Debezium) membaca baris `outbox_events` yang `published_at IS NULL`, menerbitkannya ke broker pesan, lalu menandai `published_at = NOW()`.

## 2. Solusi di Sisi Penerima: *Inbox Pattern* (Deduplikasi Konsumen)

Karena *Outbox Relay* menjamin pengiriman **At-Least-Once** (pesan pasti terkirim minimal sekali, tetapi bisa terkirim dua kali jika terjadi *timeout* saat konfirmasi ACK), layanan konsumen **wajib bersifat idempoten**. Cara paling tangguh adalah mencatat `event_id` yang sudah diproses ke dalam tabel **`processed_messages`** di dalam transaksi database yang sama dengan mutasi bisnis konsumen:

```sql
CREATE TABLE processed_messages (
    message_id UUID NOT NULL,
    consumer_group VARCHAR(64) NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (message_id, consumer_group)
);

-- Di dalam konsumen Payment Service (satu transaksi lokal):
BEGIN;
INSERT INTO processed_messages (message_id, consumer_group)
VALUES ('0192f1a0-7c00-7000-8000-000000000002', 'payment-service')
ON CONFLICT (message_id, consumer_group) DO NOTHING;

-- Jika jumlah baris yang disisipkan (ROW_COUNT) == 0, berarti pesan ini
-- adalah duplikat! Langsung COMMIT dan kirim ACK ke broker tanpa mendebit saldo lagi.
```

## 3. Perbandingan Peran Ketiga Pola Konsistensi

| Pola | Lokasi Penerapan | Masalah yang Diselesaikan |
| :--- | :--- | :--- |
| **`Idempotency-Key` Header** | Endpoint HTTP POST/PATCH publik | Mencegah klien membuat pesanan ganda saat pengguna menekan tombol bayar dua kali atau koneksi seluler mengulang *request*. |
| **Transactional Outbox** | Layanan pengirim event (*Publisher*) | Mencegah ketidaksinkronan antara komitmen database lokal dan publikasi pesan ke broker (*Dual-Write*). |
| **Transactional Inbox** | Layanan penerima event (*Consumer*) | Mencegah eksekusi ganda atas pesan duplikat dari broker bersemantik *At-Least-Once*. |

## Kuis Pemahaman

### Soal 1
Apa yang terjadi jika sebuah microservice menyimpan data ke PostgreSQL dengan `COMMIT` terlebih dahulu, lalu langsung memanggil fungsi kirim pesan ke Kafka di luar transaksi tanpa pola *Transactional Outbox*?
- A. Kafka otomatis melakukan *rollback* pada PostgreSQL jika jaringan putus.
- B. Jika proses aplikasi mati tepat setelah `COMMIT` database tetapi sebelum pesan tiba di Kafka, perubahan tercatat di database namun event tidak pernah terkirim (*dual-write bug*).
- C. PostgreSQL akan menolak perintah `COMMIT` apabila broker Kafka sedang sibuk.
- D. Pesan akan terkirim dua kali secara otomatis.

**Jawaban Benar:** B
**Penjelasan:** Database relasional dan broker pesan adalah dua sistem terpisah. Tanpa menyimpan event ke tabel `outbox_events` dalam satu transaksi database yang sama, kegagalan di sela kedua operasi akan meninggalkan sistem dalam keadaan tidak konsisten.

### Soal 2
Mengapa konsumen pesan tetap wajib mengimplementasikan *Inbox Pattern* (atau operasi yang idempoten) meskipun pengirim sudah menggunakan *Transactional Outbox*?
- A. Karena *Outbox Relay* memberikan jaminan pengiriman *at-least-once*, sehingga pesan yang sama dapat terkirim lebih dari satu kali apabila terjadi *timeout* jaringan saat pengiriman *acknowledgement*.
- B. Karena tabel `outbox_events` mengacak isi JSON payload.
- C. Karena database konsumen tidak mendukung indeks `PRIMARY KEY`.
- D. Karena *Transactional Outbox* hanya bekerja untuk protokol UDP.

**Jawaban Benar:** A
**Penjelasan:** Jika *Outbox Relay* berhasil mengirim pesan ke broker namun koneksi terputus sebelum ia sempat memperbarui `published_at`, relai akan mengirim ulang pesan tersebut pada siklus berikutnya.

### Soal 3
Agar pengecekan duplikat pada tabel `processed_messages` dan pemotongan saldo di layanan konsumen bebas dari *race condition*, bagaimana keduanya harus dieksekusi?
- A. Di dalam dua database berbeda tanpa transaksi.
- B. Pengecekan `processed_messages` disimpan di variabel memori lokal saja.
- C. Di dalam satu transaksi database ACID yang sama menggunakan kendala kunci unik `PRIMARY KEY (message_id, consumer_group)`.
- D. Dijadwalkan dengan *cron job* setiap tengah malam.

**Jawaban Benar:** C
**Penjelasan:** Menyisipkan `message_id` ke tabel `processed_messages` dengan kendala kunci primer di dalam transaksi database yang sama dengan pemotongan saldo menjamin bahwa jika salah satu gagal keduanya dibatalkan (*rollback*), dan pengiriman paralel dengan ID sama akan tertahan oleh kunci unik database.

## Sumber
- [Microservices.io — Pattern: Transactional Outbox](https://microservices.io/patterns/data/transactional-outbox.html)
- [Microservices.io — Pattern: Idempotent Consumer](https://microservices.io/patterns/communication-style/idempotent-consumer.html)
