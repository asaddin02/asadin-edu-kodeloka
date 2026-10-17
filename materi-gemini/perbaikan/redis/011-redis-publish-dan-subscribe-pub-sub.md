# Perbaikan: Redis Publish & Subscribe (Pub/Sub)

- **Kelas:** redis
- **Modul:** 11
- **Jenis:** tambahan

## Yang kurang
Materi saat ini hanya 164 kata. Belum menjelaskan fitur **Sharded Pub/Sub** (`SSUBSCRIBE` dan `SPUBLISH` sejak Redis 7.0) yang mencegah kemacetan *gossip* pada Redis Cluster, perilaku koneksi klien saat masuk ke mode berlangganan, serta tabel perbandingan tegas kapan harus memakai Redis Pub/Sub vs **Redis Streams**.

## Materi tambahan
Letakkan di akhir materi (setelah kotak "Karakteristik Fire-and-Forget").

### 3. Mengapa Perlu *Sharded Pub/Sub* (`SSUBSCRIBE` / `SPUBLISH`) pada Kluster Besar?

Pada Pub/Sub klasik (`PUBLISH` / `SUBSCRIBE`) di dalam **Redis Cluster**, setiap pesan yang dipublikasikan ke satu simpul (*node*) akan disiarkan ulang ke **seluruh simpul lain** di dalam kluster, meskipun tidak semua simpul memiliki pelanggan (*subscriber*) untuk kanal tersebut. Pada trafik tinggi, hal ini memboroskan lebar pita jaringan antar-simpul.

Sejak **Redis 7.0**, hadir **Sharded Pub/Sub** yang memetakan kanal ke *hash slot* kluster (sama seperti kunci data biasa), sehingga pesan hanya dikirimkan di dalam *shard* tempat kanal tersebut berada:

```text
# Terminal Subscriber (Sharded Pub/Sub)
SSUBSCRIBE chat:ruang:101

# Terminal Publisher (dikirim hanya ke shard pemilik slot 'chat:ruang:101')
SPUBLISH chat:ruang:101 "Pesan baru di ruang diskusi 101"

# Memantau kanal yang sedang aktif di server (Pub/Sub Introspection)
PUBSUB CHANNELS *
PUBSUB SHARDCHANNELS *
PUBSUB NUMSUB news:sports
```

### 4. Kapan Memilih Redis Pub/Sub vs Redis Streams?

| Kebutuhan Aplikasi | Redis Pub/Sub (`PUBLISH` / `SPUBLISH`) | Redis Streams (`XADD` / `XREADGROUP`) |
| :--- | :--- | :--- |
| Penyimpanan & riwayat pesan | Tidak ada (*fire-and-forget* di memori) | Disimpan di log *append-only* (ikut masuk ke RDB/AOF) |
| Jika pelanggan sedang *offline* sesaat | Pesan hilang bagi pelanggan tersebut | Pesan tetap tersimpan dan dapat diambil saat pelanggan kembali aktif |
| Pola distribusi ke banyak pekerja | *Fan-out* (semua pelanggan menerima salinan pesan yang sama) | Mendukung *fan-out* maupun bagi beban (*Consumer Group* + `XACK`) |
| Kasus penggunaan ideal | Penyiaran pembaruan WebSocket langsung, pembatalan *local cache* di memori aplikasi | Antrean tugas transaksi, audit event, dan pemrosesan pesanan yang wajib sampai (*at-least-once*) |

## Sumber
- [Redis Official Documentation — Redis Pub/Sub (including Sharded Pub/Sub)](https://redis.io/docs/latest/develop/interact/pubsub/)
- [Redis Official Documentation — `SPUBLISH` Command](https://redis.io/docs/latest/commands/spublish/)
