# Perbaikan: Defer, Panic, dan Recover

- **Kelas:** golang
- **Modul:** 34
- **Jenis:** pengganti

## Yang kurang
Materi saat ini hanya 56 kata. Belum menjelaskan urutan eksekusi tumpukan `defer` (**LIFO — Last-In, First-Out**), kapan argumen fungsi `defer` dievaluasi, mengapa `recover()` hanya berfungsi bila dipanggil langsung di dalam fungsi yang di-`defer` pada *goroutine* yang sama, serta pedoman tegas untuk menggunakan `error` (bukan `panic`) pada alur bisnis normal.

## Materi pengganti

### 1. Cara Kerja `defer`: Urutan LIFO dan Evaluasi Argumen Seketika

Pernyataan `defer` menjadwalkan pemanggilan fungsi agar dijalankan tepat sebelum fungsi pembungkusnya selesai (*return*), baik selesai secara normal maupun karena terjadi *panic*. Terdapat dua aturan penting yang wajib dipahami:

1. **Argumen fungsi yang di-`defer` dievaluasi saat baris `defer` dilewati**, bukan saat fungsi tersebut akhirnya dijalankan di akhir.
2. **Jika terdapat beberapa `defer` dalam satu fungsi, urutannya adalah LIFO (*Last-In, First-Out* / tumpukan):** `defer` yang ditulis paling akhir akan dieksekusi paling pertama.

```go
package main

import "fmt"

func contohDefer() {
	status := "awal"
	// Argumen dievaluasi sekarang ("awal"), sedangkan closure membaca nilai terakhir
	defer fmt.Println("1. Defer langsung (dievaluasi di awal):", status)
	defer func() {
		fmt.Println("2. Defer closure (membaca nilai akhir)  :", status)
	}()

	status = "selesai"
	fmt.Println("Badan fungsi selesai dijalankan.")
}
```

### 2. Menangkap Kegagalan Fatal dengan `panic` dan `recover`

Di Go, kesalahan operasional yang dapat diprediksi (seperti berkas tidak ditemukan, input pengguna tidak valid, atau koneksi jaringan terputus) **wajib dikembalikan sebagai nilai `error`**, bukan dilempar dengan `panic`. `panic` hanya digunakan untuk kondisi tak terpulihkan (seperti pelanggaran indeks *slice* di luar batas atau kegagalan inisialisasi wajib saat *startup*).

Pada server HTTP produksi, *middleware* pemulihan (*recovery middleware*) menggunakan `recover()` di dalam fungsi `defer` agar *panic* pada satu permintaan tidak mematikan seluruh proses server:

```go
package main

import "fmt"

func jalankanTugasBerisiko(pembagi int) (err error) {
	defer func() {
		if r := recover(); r != nil {
			// Mengubah panic menjadi nilai kembalian error yang aman
			err = fmt.Errorf("tertangkap panic internal: %v", r)
		}
	}()

	if pembagi == 0 {
		panic("pembagian dengan nol tidak diizinkan")
	}
	fmt.Println("Hasil:", 100/pembagi)
	return nil
}

func main() {
	contohDefer()
	if err := jalankanTugasBerisiko(0); err != nil {
		fmt.Println("Server tetap hidup! Log galat:", err)
	}
}
```

> **⚠️ Batasan Penting:** `recover()` hanya dapat menangkap `panic` yang terjadi pada **goroutine yang sama**. Jika Anda memicu *goroutine* baru dengan `go kerja()`, *panic* di dalam *goroutine* anak tersebut tidak bisa ditangkap oleh `recover()` di fungsi `main()`.

## Sumber
- [Defer, Panic, and Recover — The Go Blog](https://go.dev/blog/defer-panic-and-recover)
- [The Go Programming Language Specification — Defer statements](https://go.dev/ref/spec#Defer_statements)
