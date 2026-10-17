# Perbaikan: sync.Mutex (Mutual Exclusion Lock)

- **Kelas:** golang
- **Modul:** 105
- **Jenis:** pengganti

## Yang kurang
Materi saat ini hanya 12 kata ("mutex.Lock() mengunci area kritikal. mutex.Unlock() melepas kunci. Hanya 1 Goroutine boleh masuk."). Belum menjelaskan pola idiomatis membungkus `sync.Mutex` bersama variabel yang dilindunginya di dalam sebuah `struct`, kewajiban `defer mu.Unlock()`, larangan menyalin `sync.Mutex` berdasarkan nilai (*by value*), serta cara mendeteksi *data race* dengan `go test -race`.

## Materi pengganti

### 1. Melindungi *Critical Section* dengan `sync.Mutex`

Ketika dua atau lebih *goroutine* mengakses variabel yang sama secara bersamaan dan setidaknya salah satu *goroutine* melakukan penulisan (misalnya `saldo += nominal` atau menulis ke `map`), terjadi **Data Race** yang dapat merusak nilai memori atau memicu *fatal panic* (`concurrent map writes`).

`sync.Mutex` (*Mutual Exclusion*) memastikan hanya **satu** *goroutine* yang dapat memasuki bagian kode kritis (*critical section*) pada satu waktu:
- **`mu.Lock()`:** Mengakuisisi kunci. Jika kunci sedang dipegang oleh *goroutine* lain, *goroutine* pemanggil akan diblokir hingga kunci dilepas.
- **`mu.Unlock()`:** Melepaskan kunci. Selalu pasangkan dengan `defer mu.Unlock()` tepat setelah `mu.Lock()` agar kunci tetap dilepas meskipun fungsi keluar lebih awal atau mengalami *panic*.

### 2. Pola Idiomatis Go: Menyatukan `sync.Mutex` di Dalam `struct`

Praktik terbaik di Go adalah menempatkan `sync.Mutex` tepat di atas field privat yang dilindunginya di dalam sebuah `struct`, dan memastikan semua *method* menggunakan **pointer receiver** (`*RekeningAman`) agar `sync.Mutex` tidak pernah terduplikasi saat *method* dipanggil:

```go
package main

import (
	"fmt"
	"sync"
)

type RekeningAman struct {
	mu    sync.Mutex // Melindungi field di bawahnya
	saldo int64
}

func (r *RekeningAman) Setor(nominal int64) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.saldo += nominal
}

func (r *RekeningAman) Tarik(nominal int64) bool {
	r.mu.Lock()
	defer r.mu.Unlock()
	if r.saldo < nominal {
		return false
	}
	r.saldo -= nominal
	return true
}

func (r *RekeningAman) Saldo() int64 {
	r.mu.Lock()
	defer r.mu.Unlock()
	return r.saldo
}

func main() {
	rekening := &RekeningAman{}
	var wg sync.WaitGroup

	// 100 goroutine menyetor Rp1.000 secara bersamaan
	for i := 0; i < 100; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			rekening.Setor(1000)
		}()
	}

	wg.Wait()
	fmt.Println("Saldo akhir bebas data-race:", rekening.Saldo()) // Pasti 100000
}
```

### 3. Tiga Aturan Penting Penggunaan `sync.Mutex`

| Aturan | Penjelasan |
| :--- | :--- |
| **Jangan pernah menyalin `sync.Mutex` setelah digunakan** | Selalu teruskan `struct` yang memuat `sync.Mutex` menggunakan pointer (`*RekeningAman`). Menyalin `Mutex` menggandakan status kunci internal dan dapat dideteksi dengan `go vet`. |
| **sync.Mutex di Go tidak bersifat *reentrant* (rekursif)** | Jika *method* `A()` sudah memanggil `r.mu.Lock()`, lalu di dalamnya memanggil *method* `B()` yang juga memanggil `r.mu.Lock()` pada objek yang sama, program akan langsung mengalami **deadlock**! |
| **Selalu jalankan `go test -race` di CI/CD** | Pendeteksi ras bawaan Go memantau akses memori konkuren saat pengujian dan melaporkan baris kode yang lupa dilindungi kunci. |

## Sumber
- [Package `sync` (`Mutex`) — Go Standard Library](https://pkg.go.dev/sync#Mutex)
- [Data Race Detector — The Go Programming Language](https://go.dev/doc/articles/race_detector)
