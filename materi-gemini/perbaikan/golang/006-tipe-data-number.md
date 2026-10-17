# Perbaikan: Tipe Data Number

- **Kelas:** golang
- **Modul:** 6
- **Jenis:** tambahan

## Yang kurang
Materi saat ini (69 kata) hanya menampilkan tabel nama tipe integer dan kalimat singkat tentang `float32`/`float64`/`byte`/`rune`. Belum ada penjelasan mengenai pemisah digit (`_`), representasi basis bilangan (`0b`, `0o`, `0x`), jebakan presisi IEEE-754 pada `float64` untuk perhitungan uang, serta kapan harus memilih `int` dibanding ukuran eksplisit seperti `int64`.

## Materi tambahan
Letakkan di akhir materi (setelah bagian "3. Alias Tipe Data Number").

### 4. Literal Angka Modern: Basis Bilangan dan Pemisah Digit (`_`)

Untuk meningkatkan keterbacaan angka berukuran besar, Go mendukung karakter garis bawah (`_`) sebagai pemisah ribuan serta awalan khusus untuk bilangan biner (`0b`), oktal (`0o`), dan heksadesimal (`0x`):

```go
package main

import (
	"fmt"
	"math"
)

func main() {
	// Pemisah digit (_) memudahkan pembacaan jutaan atau byte
	batasHarianRupiah := 150_000_000
	izinBerkasOktal := 0o755
	maskerBitBiner := 0b1010_1100
	warnaMerahHex := 0xFF_00_00

	// Karakter rune mewakili titik kode Unicode (int32)
	var simbolRupiah rune = 'Rp'[0]
	var karakterJepang rune = '本'

	fmt.Printf("Batas Harian : %d\n", batasHarianRupiah)
	fmt.Printf("Oktal & Biner: %o | %08b | 0x%X\n", izinBerkasOktal, maskerBitBiner, warnaMerahHex)
	fmt.Printf("Rune Unicode : %c (kode: %d / %U)\n", karakterJepang, karakterJepang, karakterJepang)
	fmt.Printf("Batas int64  : %d s/d %d\n", math.MinInt64, math.MaxInt64)
	_ = simbolRupiah
}
```

### 5. Pedoman Memilih Tipe Angka di Produksi

1. **Gunakan `int` secara bawaan untuk penghitung, indeks slice, dan ukuran:** Pada mesin 64-bit modern, `int` berukuran 64-bit dan selaras dengan tanda tangan fungsi pustaka standar seperti `len()` dan `cap()`.
2. **Gunakan ukuran eksplisit (`int64`, `int32`, `uint8`) untuk kontrak data eksternal:** Saat memetakan kolom basis data (`BIGINT`), format biner jaringan, atau struktur berkas, tetapkan ukuran bit secara eksplisit agar tidak bergantung pada arsitektur CPU.
3. **Jangan gunakan `float32` atau `float64` untuk saldo uang:** Pecahan desimal seperti `0.1 + 0.2` dalam standar biner IEEE-754 menghasilkan `0.30000000000000004`. Simpan nilai uang dalam satuan terkecil menggunakan bilangan bulat `int64` (misalnya sen atau rupiah penuh) atau pustaka desimal presisi tetap.

## Sumber
- [The Go Programming Language Specification — Numeric types](https://go.dev/ref/spec#Numeric_types)
- [The Go Programming Language Specification — Integer literals](https://go.dev/ref/spec#Integer_literals)
- [Package `math` — Go Standard Library](https://pkg.go.dev/math)
