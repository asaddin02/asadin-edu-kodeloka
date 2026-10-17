# Perbaikan: Konversi Tipe Data

- **Kelas:** golang
- **Modul:** 11
- **Jenis:** tambahan

## Yang kurang
Materi saat ini hanya 62 kata. Belum menjelaskan mengapa Go melarang konversi tipe implisit (*implicit type coercion*), cara mengonversi angka ke string dan sebaliknya menggunakan paket **`strconv`** (`strconv.Itoa`, `strconv.Atoi`, `strconv.ParseInt`), serta jebakan klasik memanggil `string(65)` yang menghasilkan karakter ASCII `"A"` (bukan `"65"`).

## Materi tambahan
Letakkan di akhir materi (setelah peringatan "Bahaya Integer Overflow").

### 2. Tidak Ada Konversi Implisit Antar Tipe Berbeda di Go

Berbeda dari C atau Java yang secara otomatis mengubah `int` menjadi `float` atau `int32` menjadi `int64`, Go mewajibkan konversi eksplisit bahkan di antara dua bilangan bulat yang ukurannya berbeda (`var a int32 = 10; var b int64 = int64(a)`). Aturan ketat ini mencegah bug kehilangan presisi yang tidak disengaja.

### 3. Konversi Angka dan String yang Benar: Gunakan `strconv`, Bukan `string(angka)`!

Jangan pernah menulis `string(97)` untuk mengubah angka `97` menjadi teks `"97"`, karena ekspresi tersebut menafsirkan angka sebagai titik kode Unicode dan menghasilkan huruf `"a"` (bahkan ditolak oleh `go vet` pada Go modern). Selalu gunakan paket standar **`strconv`**:

```go
package main

import (
	"fmt"
	"strconv"
)

func main() {
	// 1. Integer ke String dengan strconv.Itoa (Integer to ASCII)
	harga := 125000
	teksHarga := strconv.Itoa(harga)
	fmt.Printf("Tipe: %T | Nilai: %q\n", teksHarga, teksHarga)

	// 2. String ke Integer dengan penanganan error wajib
	inputPengguna := "4096"
	kuota, err := strconv.Atoi(inputPengguna)
	if err != nil {
		fmt.Println("Input bukan angka valid:", err)
		return
	}
	fmt.Println("Kuota ditambah 100:", kuota+100)

	// 3. String ke float64 atau int64 dengan ukuran bit eksplisit
	rasio, err := strconv.ParseFloat("3.14159", 64)
	if err == nil {
		fmt.Printf("Rasio: %.2f\n", rasio)
	}
}
```

## Sumber
- [The Go Programming Language Specification — Conversions](https://go.dev/ref/spec#Conversions)
- [Package `strconv` — Go Standard Library](https://pkg.go.dev/strconv)
