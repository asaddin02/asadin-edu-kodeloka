# Perbaikan: Tipe Data String & Operations

- **Kelas:** redis
- **Modul:** 4
- **Jenis:** koreksi, tambahan

## Yang kurang
Materi saat ini hanya 236 kata dan merekomendasikan perintah lawas `SETNX lock:order:1001 "node1"` untuk *Distributed Locking* tanpa masa kedaluwarsa (TTL). Dalam dokumentasi resmi Redis, `SETNX` sudah dianggap *deprecated* untuk pola kunci terdistribusi karena jika pekerja (*worker*) mati sebelum sempat menghapus kunci, kunci tersebut akan terkunci selamanya (*deadlock*). Solusi atomik yang benar adalah `SET key value NX PX <milidetik>`.

## Koreksi
> Teks lama: "Saat beberapa aplikasi microservices mencoba memproses pesanan yang sama secara bersamaan, jalankan SETNX lock:order:1001 \"node1\" . Hanya service pertama yang mendapatkan kembalian 1 (berhasil)."

Teks baru: "Saat beberapa layanan mikro mencoba memproses pesanan yang sama secara bersamaan, gunakan perintah atomik `SET lock:order:1001 \"token_unik_node1\" NX PX 10000` (buat kunci hanya jika belum ada, dan hapus otomatis setelah 10.000 milidetik). Hindari memakai `SETNX` terpisah dari `EXPIRE`, karena jika aplikasi mati di sela kedua perintah tersebut, kunci tidak akan pernah kedaluwarsa (*deadlock*)."

## Materi tambahan
Letakkan di akhir materi (setelah kotak "Distributed Lock Pattern").

### 3. Opsi Lengkap Perintah `SET` Modern (`NX`, `XX`, `EX`, `PX`, `KEEPTTL`, `GET`)

Sejak Redis 2.6.12 hingga Redis 8, perintah `SET` tunggal telah menggabungkan kemampuan `SETNX`, `SETEX`, `PSETEX`, dan `GETSET` dalam satu eksekusi atomik:

| Argumen Opsi `SET` | Arti dan Kegunaan | Contoh Perintah |
| :--- | :--- | :--- |
| `NX` (*Not Exists*) | Hanya simpan nilai apabila kunci **belum ada** | `SET lock:job:99 "req-a1b2" NX PX 5000` |
| `XX` (*Already Exists*) | Hanya perbarui nilai apabila kunci **sudah ada** | `SET session:u1 "aktif" XX EX 1800` |
| `EX <detik>` / `PX <ms>` | Tetapkan waktu kedaluwarsa dalam detik atau milidetik | `SET otp:0812 "994120" EX 300` |
| `KEEPTTL` | Perbarui nilai string tanpa mereset sisa waktu TTL yang sudah berjalan | `SET rate:ip:1.2.3.4 "5" KEEPTTL` |
| `GET` | Kembalikan nilai lama sebelum ditimpa dengan nilai baru secara atomik | `SET status:server "maintenance" GET` |

### 4. Membebaskan Kunci Terdistribusi Secara Aman

Ketika menggunakan `SET resource_name my_random_value NX PX 30000`, jangan melepas kunci hanya dengan `DEL resource_name` tanpa memeriksa nilainya. Jika proses Pekerja A berjalan lebih lambat dari 30 detik, kuncinya sudah kedaluwarsa dan diambil alih oleh Pekerja B; memanggil `DEL` buta dari Pekerja A akan menghapus kunci milik Pekerja B! Selalu gunakan nilai acak unik per permintaan dan periksa kecocokannya sebelum menghapus (yang dibahas lebih lanjut pada modul *Lua Scripting*).

## Sumber
- [Redis Official Documentation — `SET` Command](https://redis.io/docs/latest/commands/set/)
- [Redis Official Documentation — Distributed Locks with Redis](https://redis.io/docs/latest/develop/use/patterns/distributed-locks/)
