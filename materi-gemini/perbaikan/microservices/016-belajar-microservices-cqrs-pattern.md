# Perbaikan: Belajar Microservices - CQRS Pattern

- **Kelas:** microservices
- **Modul:** 16
- **Jenis:** tambahan

## Yang kurang
Materi saat ini hanya 133 kata. Belum menjelaskan konsekuensi konsistensi tertunda (*eventual consistency* / *replication lag*) antara *Write DB* dan *Read DB*, cara menanganinya di sisi antarmuka pengguna, serta kapan pola CQRS **tidak** boleh digunakan agar tim tidak terjebak *over-engineering*.

## Materi tambahan
Letakkan di akhir materi (setelah diagram "Alur Arsitektur CQRS").

### 2. Menangani *Eventual Consistency* (Jeda Sinkronisasi Baca-Tulis)

Pada arsitektur CQRS yang memisahkan basis data tulis (PostgreSQL) dan basis data baca (Elasticsearch/Redis) melalui aliran event Kafka, terdapat jeda waktu beberapa puluh hingga ratusan milidetik sebelum perubahan di *Write Model* tercermin di *Read Model*. Jika pengguna baru saja memperbarui alamat pengiriman lalu halaman langsung memuat ulang dari *Read API*, pengguna mungkin masih melihat alamat lamanya (*read-your-own-writes problem*).

Tiga cara praktis menanganinya di produksi:
1. **Kembalikan *State* Terbaru dari *Command API*:** Setelah mutasi berhasil disimpan di *Write DB*, kembalikan objek terbaru langsung dalam respons HTTP `200 OK` / `201 Created` sehingga antarmuka klien dapat memperbarui tampilan lokal tanpa perlu segera memanggil *Query API*.
2. **Sertakan Versi/Nomor Urut Event (*Version Tracking*):** *Command API* mengembalikan `version: 42`. Ketika klien memanggil *Query API*, klien menyertakan `min_version=42`; jika *Read Model* masih berada di versi `41`, layanan baca dapat menunggu sejenak atau mengambil langsung dari sumber utama.
3. **Pembaruan UI Optimistis:** Perbarui tampilan di sisi klien sembari proyeksi asinkron berjalan di latar belakang.

### 3. Kapan Menggunakan CQRS dan Kapan Cukup Memakai Replika Baca?

| Kebutuhan Sistem | Solusi yang Tepat |
| :--- | :--- |
| Beban kueri `SELECT` tinggi, tetapi struktur tabel baca masih sama dengan tabel tulis | Gunakan **Read Replica** bawaan PostgreSQL/MySQL + indeks yang tepat (tidak perlu CQRS). |
| Kueri baca membutuhkan penggabungan data dari 5 layanan mikro berbeda atau pencarian teks penuh (*full-text/vector search*) | Gunakan **CQRS** dengan proyeksi terdenormalisasi ke mesin pencari/penyimpanan khusus. |
| Layanan CRUD sederhana dengan satu sumber basis data | Hindari CQRS penuh karena menggandakan kompleksitas sinkronisasi dan penanganan kegagalan event. |

## Sumber
- [Microservices.io — Pattern: Command Query Responsibility Segregation (CQRS)](https://microservices.io/patterns/data/cqrs.html)
