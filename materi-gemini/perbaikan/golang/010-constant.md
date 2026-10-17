# Perbaikan: Constant

- **Kelas:** golang
- **Modul:** 10
- **Jenis:** tambahan

## Yang kurang
Materi saat ini hanya 45 kata. Belum membahas konsep khas Go yaitu **Untyped Constants** (konstanta tak bertipe yang memiliki presisi tinggi dan fleksibel menyesuaikan tipe target), generator urutan konstanta otomatis **`iota`**, serta batasan bahwa nilai `const` harus sudah dapat dihitung pada waktu kompilasi (*compile-time*).

## Materi tambahan
Letakkan di akhir materi (setelah kotak "Keistimewaan Constant di Go").

### 1. *Untyped Constants* vs *Typed Constants*

Secara bawaan, konstanta yang dideklarasikan tanpa menyebutkan tipe (misalnya `const Pi = 3.14159265358979323846`) adalah **Untyped Constant**. Konstanta ini dievaluasi oleh compiler dengan presisi sangat tinggi (minimal 256 bit untuk angka) dan dapat langsung dipakai pada ekspresi `float32`, `float64`, maupun tipe khusus tanpa konversi manual selama nilainya muat.

### 2. Membuat Enumerasi dan Bitmask dengan Generator `iota`

Kata kunci `iota` mewakili bilangan bulat berurutan dimulai dari `0` di dalam satu blok `const (...)` dan bertambah `1` pada setiap baris konstanta berikutnya:

```go
package main

import "fmt"

type StatusPesanan int

const (
	StatusMenunggu StatusPesanan = iota // 0
	StatusDibayar                       // 1
	StatusDikirim                       // 2
	StatusSelesai                       // 3
)

// Pola Bitmask Izin Akses dengan geser bit (1 << iota)
const (
	IzinBaca  uint8 = 1 << iota // 1 << 0 = 1 (001)
	IzinTulis                   // 1 << 1 = 2 (010)
	IzinHapus                   // 1 << 2 = 4 (100)
)

func main() {
	fmt.Println("Status Dikirim:", StatusDikirim) // 2

	izinEditor := IzinBaca | IzinTulis
	punyaIzinTulis := (izinEditor & IzinTulis) != 0
	fmt.Printf("Masker Editor: %03b | Boleh tulis? %t\n", izinEditor, punyaIzinTulis)
}
```

> **⚠️ Catatan:** Karena nilai `const` ditetapkan pada saat kompilasi, Anda **tidak dapat** menugaskan hasil pemanggilan fungsi waktu jalan seperti `const waktuMulai = time.Now()` atau `os.Getenv("PORT")` ke dalam `const`. Gunakan `var` untuk nilai yang baru diketahui saat program berjalan.

## Sumber
- [The Go Programming Language Specification — Constants](https://go.dev/ref/spec#Constants)
- [The Go Programming Language Specification — Iota](https://go.dev/ref/spec#Iota)
