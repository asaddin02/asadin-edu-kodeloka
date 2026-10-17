# Perbaikan: Variable

- **Kelas:** golang
- **Modul:** 9
- **Jenis:** koreksi, tambahan

## Yang kurang
Materi saat ini hanya 91 kata, memiliki salah ketik ("HARUS DUGUNAKAN"), dan belum membahas konsep penting **Zero Value** (nilai awal bawaan ketika variabel dideklarasikan tanpa inisialisasi), perbedaan cakupan variabel tingkat paket (*package-level*) vs fungsi (*short declaration* `:=` hanya boleh di dalam fungsi), serta bahaya *variable shadowing*.

## Koreksi
> Teks lama: "Setiap variabel local yang sudah dideklarasikan HARUS DUGUNAKAN ."

Teks baru: "Setiap variabel lokal yang sudah dideklarasikan **HARUS DIGUNAKAN**."

## Materi tambahan
Letakkan di akhir materi (setelah kotak aturan wajib Golang).

### 1. Nilai Awal Bawaan (*Zero Value*) di Go

Di Go, tidak ada konsep variabel yang berisi "sampah memori" (*uninitialized memory*). Jika Anda mendeklarasikan variabel dengan `var` tanpa memberikan nilai awal, Go secara otomatis mengisi variabel tersebut dengan **Zero Value** yang aman sesuai tipe datanya:

| Tipe Data | *Zero Value* Bawaan |
| :--- | :--- |
| Semua tipe angka (`int`, `float64`, `byte`, `rune`) | `0` |
| `bool` | `false` |
| `string` | `""` (string kosong, bukan `nil`) |
| Pointer, `slice`, `map`, `chan`, `func`, `interface` | `nil` |
| `struct` | Seluruh field di dalamnya diisi dengan *Zero Value* masing-masing |

### 2. Aturan `:=` (*Short Variable Declaration*) dan Jebakan *Variable Shadowing*

Operator `:=` hanya dapat digunakan **di dalam badan fungsi** (tidak sah di tingkat paket/luar fungsi). Hati-hati ketika menggunakan `:=` di dalam blok bersarang (`if` atau `for`): jika Anda menulis `:=` di dalam blok `if`, Go akan membuat **variabel baru yang menutupi (*shadow*) variabel luar** dengan nama yang sama!

```go
package main

import "fmt"

// Di luar fungsi wajib menggunakan kata kunci 'var'
var versiAplikasi = "1.0.0"

func main() {
	var angkaBulat int     // 0
	var teksKosong string  // ""
	var aktif bool         // false
	fmt.Printf("Zero values -> int: %d, string: %q, bool: %t\n", angkaBulat, teksKosong, aktif)

	// Contoh menghindari Variable Shadowing:
	total := 100
	if true {
		// Gunakan '=' (bukan ':=') jika ingin mengubah variabel 'total' milik fungsi luar!
		total = total + 50
	}
	fmt.Println("Total akhir:", total, "| Versi:", versiAplikasi)
}
```

## Sumber
- [The Go Programming Language Specification — The zero value](https://go.dev/ref/spec#The_zero_value)
- [The Go Programming Language Specification — Short variable declarations](https://go.dev/ref/spec#Short_variable_declarations)
