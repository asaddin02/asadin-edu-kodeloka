# Perbaikan: Membuat Goroutines (keyword go)

- **Kelas:** golang
- **Modul:** 100
- **Jenis:** pengganti

## Yang kurang
Materi saat ini hanya 15 kata ("Tambahkan go sebelum pemanggilan fungsi. Jika main() selesai duluan, goroutine anak langsung dihentikan paksa!"). Belum menjelaskan siklus hidup *goroutine*, mengapa menggunakan `time.Sleep` untuk menunggu *goroutine* adalah praktik buruk, bagaimana menyinkronkannya dengan `sync.WaitGroup`, serta perubahan perilaku variabel perulangan pada Go 1.22+.

## Materi pengganti

### 1. Bagaimana `go` Menjadwalkan Eksekusi Konkuren?

Menambahkan kata kunci `go` di depan pemanggilan fungsi (`go prosesData(id)`) memerintahkan *Go Runtime* untuk menjalankan fungsi tersebut secara konkuren pada *goroutine* baru yang baru dibuat. Pemanggilan `go` kembali seketika tanpa menunggu fungsi tersebut selesai, dan nilai kembalian fungsi (jika ada) akan diabaikan.

Ketika fungsi utama `main()` selesai dan keluar, seluruh program langsung berhenti dan semua *goroutine* latar belakang yang masih berjalan akan dihentikan seketika. Karena itu, di kode produksi Anda **tidak boleh** menebak waktu tunggu dengan `time.Sleep()`, melainkan wajib menggunakan mekanisme sinkronisasi seperti `sync.WaitGroup` atau `channel`:

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

func unduhLaporan(id int, wg *sync.WaitGroup) {
	// Pastikan Done() selalu dipanggil saat fungsi keluar
	defer wg.Done()

	fmt.Printf("[Pekerja %d] Memulai pengolahan laporan...\n", id)
	time.Sleep(50 * time.Millisecond)
	fmt.Printf("[Pekerja %d] Selesai!\n", id)
}

func main() {
	var wg sync.WaitGroup

	for i := 1; i <= 3; i++ {
		wg.Add(1) // Tambah penghitung SEBELUM memicu goroutine!
		go unduhLaporan(i, &wg)
	}

	// Blokir main() sampai ketiga pekerja memanggil wg.Done()
	wg.Wait()
	fmt.Println("Seluruh laporan berhasil diolah secara konkuren.")
}
```

### 2. Perilaku Variabel Perulangan di Dalam Goroutine (Pembaruan Penting Go 1.22+)

Sebelum Go 1.22, variabel iterasi `for i := 1; i <= 3; i++` hanya dibuat satu kali dan dipakai ulang di setiap putaran, sehingga *closure* `go func() { fmt.Println(i) }()` sering mencetak angka terakhir (`4, 4, 4`). **Sejak Go 1.22**, setiap iterasi perulangan `for` secara otomatis menciptakan variabel baru tersendiri, sehingga menangkap variabel perulangan di dalam *closure* *goroutine* kini aman dari jebakan pembagian variabel tersebut.

### 3. Tiga Kesalahan Umum Saat Membuat Goroutine

1. **Memanggil `wg.Add(1)` di dalam fungsi goroutine anak:** Fungsi `main()` bisa saja mencapai baris `wg.Wait()` sebelum goroutine anak sempat menjalankan `wg.Add(1)`. Selalu panggil `wg.Add(1)` di goroutine induk sebelum baris `go ...`.
2. **Meneruskan `sync.WaitGroup` berdasarkan nilai (*by value*), bukan pointer (`*sync.WaitGroup`):** Goroutine anak akan memanggil `Done()` pada salinan lokal, sehingga `main()` menunggu selamanya (*deadlock*).
3. **Membuat goroutine tanpa batas untuk jutaan item:** Meskipun ringan, memicu jutaan goroutine sekaligus dapat menghabiskan memori atau membebani database hilir; gunakan pola *worker pool* atau `errgroup.SetLimit()`.

## Sumber
- [Effective Go — Goroutines](https://go.dev/doc/effective_go#goroutines)
- [Fixing For Loops in Go 1.22 — The Go Blog](https://go.dev/blog/loopvar-preview)
