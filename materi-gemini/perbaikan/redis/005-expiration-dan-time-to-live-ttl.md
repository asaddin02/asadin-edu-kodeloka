# Perbaikan: Expiration & Time To Live (TTL)

- **Kelas:** redis
- **Modul:** 5
- **Jenis:** tambahan

## Yang kurang
Materi saat ini hanya 230 kata. Belum menjelaskan cara Redis menghapus kunci kedaluwarsa di balik layar (*passive expiration* vs *active expiration*), opsi bersyarat baru pada `EXPIRE` (`NX`, `XX`, `GT`, `LT` sejak Redis 7.0+), serta bahaya **Cache Stampede / Thundering Herd** ketika ribuan kunci kedaluwarsa pada detik yang sama beserta solusinya (*TTL jitter*).

## Materi tambahan
Letakkan di akhir materi (setelah bagian "Strategi Eviction Memori").

### 4. Bagaimana Mesin Redis Menghapus Kunci yang Sudah Kedaluwarsa?

Redis tidak menggunakan *timer* per kunci yang membebani CPU, melainkan menggabungkan dua mekanisme ringan:

1. **Penghapusan Pasif (*Passive Expiration*):** Saat klien mencoba membaca kunci (misalnya lewat `GET`), Redis memeriksa apakah waktu kedaluwarsanya sudah lewat. Jika sudah lewat, Redis menghapus kunci tersebut dari memori saat itu juga dan mengembalikan `nil`.
2. **Penghapusan Aktif (*Active Expiration*):** Untuk membersihkan kunci yang sudah kedaluwarsa tetapi tidak pernah diakses lagi oleh klien, Redis menjalankan siklus latar belakang sepuluh kali per detik: mengambil sampel acak sejumlah kecil kunci ber-TTL, menghapus yang sudah kedaluwarsa, dan mengulangi pengambilan sampel segera apabila lebih dari `25%` sampel terbukti sudah kedaluwarsa.

### 5. Opsi Kedaluwarsa Bersyarat (`NX`, `XX`, `GT`, `LT` — Sejak Redis 7.0)

Anda dapat memperbarui TTL tanpa khawatir memperpendek atau menimpa jadwal yang sudah ada:

```text
# Hanya pasang TTL 3600 detik jika kunci saat ini BELUM memiliki TTL (NX)
EXPIRE cache:katalog:utama 3600 NX

# Hanya perbarui TTL jika nilai baru LEBIH BESAR dari sisa TTL saat ini (GT)
EXPIRE session:user:42 7200 GT

# Memeriksa sisa waktu dalam satuan milidetik (PTTL) atau timestamp Unix (EXPIRETIME)
PTTL session:user:42
EXPIRETIME session:user:42
```

### 6. Mencegah *Cache Stampede* dengan *TTL Jitter*

Jika saat pemanasan awal (*cache warming*) aplikasi Anda menyimpan 10.000 kunci produk dengan `EX 3600` yang persis sama, maka tepat 60 menit kemudian seluruh 10.000 kunci akan kedaluwarsa bersamaan. Lonjakan kueri mendadak ke basis data utama ini disebut **Cache Stampede**. Selalu tambahkan angka acak kecil (*jitter*, misalnya `3600 + random(0, 300)` detik) saat menetapkan TTL di kode aplikasi Anda agar waktu kedaluwarsa tersebar merata.

## Sumber
- [Redis Official Documentation — `EXPIRE` Command (`NX`, `XX`, `GT`, `LT`)](https://redis.io/docs/latest/commands/expire/)
- [Redis Official Documentation — `TTL` and `PTTL` Commands](https://redis.io/docs/latest/commands/ttl/)
