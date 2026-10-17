# Perbaikan: Redis Pipeline & Mass Insertion Performance

- **Kelas:** redis
- **Modul:** 18
- **Jenis:** tambahan

## Yang kurang
Materi saat ini hanya 238 kata. Belum menjelaskan ukuran tumpukan (*batch size*) yang aman saat melakukan *pipelining* agar tidak menghabiskan memori buffer output klien di server Redis, perbedaan mendasar antara *Pipelining* (optimasi jaringan tanpa jaminan atomik) dengan `MULTI`/`EXEC` atau skrip Lua, serta contoh kode penerapan *pipeline* di aplikasi nyata.

## Materi tambahan
Letakkan di akhir materi (setelah bagian "3. Benchmarking Performa dengan redis-benchmark").

### 4. Batas Aman Ukuran *Batch* pada Pipelining

Meskipun *pipelining* memangkas *Round-Trip Time* (RTT) secara drastis, mengirimkan `1.000.000` perintah dalam **satu** *pipeline* tunggal merupakan praktik berbahaya. Selama seluruh perintah di dalam *pipeline* dieksekusi, Redis harus menahan semua balasan (*replies*) di dalam memori buffer keluaran milik koneksi klien tersebut (`client-output-buffer-limit`). Jika ukurannya membengkak ratusan megabita, Redis dapat memutus paksa koneksi klien atau mengalami lonjakan memori.

> **💡 Aturan Praktis Produksi:** Pecah operasi *pipelining* besar ke dalam potongan (*chunk/batch*) berukuran **`100` hingga `1.000` perintah per *flush***. Ukuran ini sudah memangkas lebih dari `99%` biaya latensi jaringan sekaligus menjaga pemakaian RAM tetap datar.

### 5. Perbedaan Pipelining vs Transaksi (`MULTI`/`EXEC`) vs Skrip Lua

| Karakteristik | Pipelining Biasa | Transaksi (`MULTI`/`EXEC`) | Skrip Lua (`EVAL` / `FUNCTION`) |
| :--- | :--- | :--- | :--- |
| Mengurangi RTT jaringan? | Ya (1 RTT per *batch*) | Ya bila digabung dengan *pipeline* | Ya (1 RTT per pemanggilan skrip) |
| Apakah eksekusinya atomik (tidak diselingi klien lain)? | **Tidak** (perintah dari klien lain dapat terselip di sela perintah *pipeline*) | **Ya** (dieksekusi berurutan saat `EXEC`) | **Ya** (berjalan secara atomik) |
| Dapat membaca hasil perintah pertama untuk logika `if` di perintah kedua? | Tidak (semua perintah dikirim sebelum balasan pertama dibaca) | Tidak | **Ya** (logika kondisional dieksekusi langsung di dalam memori server) |

```go
// Contoh pemakaian Pipeline dalam potongan (chunk) 500 perintah menggunakan go-redis/v9
func MuatCacheProdukMassal(ctx context.Context, rdb *redis.Client, daftar map[string]string) error {
	pipe := rdb.Pipeline()
	hitung := 0

	for kunci, nilai := range daftar {
		pipe.Set(ctx, kunci, nilai, 30*time.Minute)
		hitung++
		if hitung%500 == 0 {
			if _, err := pipe.Exec(ctx); err != nil {
				return err
			}
		}
	}
	_, err := pipe.Exec(ctx)
	return err
}
```

## Sumber
- [Redis Official Documentation — Redis Pipelining](https://redis.io/docs/latest/develop/use/pipelining/)
- [Redis Official Documentation — Bulk Loading](https://redis.io/docs/latest/develop/use/patterns/bulk-loading/)
