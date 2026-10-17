# Perbaikan: Belajar Microservices - Database per Service

- **Kelas:** microservices
- **Modul:** 5
- **Jenis:** tambahan

## Yang kurang
Materi saat ini hanya 138 kata. Belum membahas tiga tingkat isolasi fisik/logis pada pola *Database per Service* (tabel privat per skema vs instans server terpisah), cara menggabungkan data lintas layanan tanpa `SQL JOIN` (pola *API Composition* dan *CQRS Read Model*), serta tantangan konsistensi transaksi lintas layanan.

## Materi tambahan
Letakkan di akhir materi (setelah bagian "2. Keuntungan Database per Service").

### 3. Tiga Tingkat Isolasi pada Pola *Database per Service*

Menerapkan *Database per Service* tidak selalu berarti setiap layanan mikro harus menyewa satu mesin RDS/Cloud SQL terpisah yang mahal. Anda dapat memilih tingkat isolasi sesuai skala dan anggaran:

| Tingkat Isolasi | Cara Implementasi | Kelebihan | Kekurangan |
| :--- | :--- | :--- | :--- |
| **1. Skema Privat dalam Satu Server DB** | `Order Service` hanya diberi akun DB dengan izin ke `SCHEMA order_svc`; `User Service` hanya ke `SCHEMA user_svc` | Biaya infrastruktur paling hemat; mudah dikelola untuk tim kecil | Beban CPU/I/O yang melonjak di satu skema masih dapat memengaruhi skema lain (*noisy neighbor*) |
| **2. Database Logis Terpisah dalam Satu Kluster** | Satu kluster PostgreSQL memuat `CREATE DATABASE orders_db` dan `users_db` dengan kredensial terpisah | Isolasi katalog dan koneksi lebih tegas dibanding skema | Masih berbagi kapasitas disk dan memori fisik kluster yang sama |
| **3. Server/Kluster Database Fisik Mandiri** | Instans database terpisah per layanan (bisa berbeda mesin dan jenis DB / *polyglot*) | Isolasi kegagalan (*fault isolation*) dan penskalaan independen penuh | Biaya operasional dan pemantauan paling tinggi |

### 4. Bagaimana Menampilkan Data Gabungan Tanpa `SQL JOIN` Lintas Layanan?

Ketika halaman riwayat pesanan membutuhkan data pesanan dari `Order Service` sekaligus nama pelanggan dari `Customer Service`, gunakan salah satu dari dua pola berikut:

1. **API Composition (untuk kueri sederhana):** *API Gateway* atau *Backend for Frontend* (BFF) memanggil `Order Service` dan `Customer Service` secara paralel melalui HTTP/gRPC, lalu menggabungkan hasilnya di memori sebelum dikirim ke peramban.
2. **CQRS / Replikasi Event Lokal (untuk pencarian kompleks dan paginasi):** `Order Service` berlangganan event `CustomerUpdated` dari *message broker* dan menyimpan salinan ringkas yang dibutuhkan saja (`customer_id`, `customer_name`) di dalam tabel lokal milik `Order Service`.

## Sumber
- [Microservices.io — Pattern: Database per service](https://microservices.io/patterns/data/database-per-service.html)
- [Microservices.io — Pattern: API Composition](https://microservices.io/patterns/data/api-composition.html)
