# Perbaikan: Tipe Data Slice

- **Kelas:** golang
- **Modul:** 17
- **Jenis:** tambahan

## Yang kurang
Materi saat ini hanya 98 kata. Belum menjelaskan konsekuensi berbagi *underlying array* ketika sebuah *slice* diiris (`s[low:high]`), bagaimana perubahan pada *sub-slice* ikut mengubah *slice* asli sebelum kapasitasnya penuh, ekspresi *full slice* tiga indeks (`s[low:high:max]`), serta cara menyalin *slice* secara independen dengan `slices.Clone()` (Go 1.21+).

## Materi tambahan
Letakkan di akhir materi (setelah tabel fungsi slice).

### 1. Jebakan Berbagi *Underlying Array* Saat Mengiris Slice

Ketika Anda membuat *slice* baru dengan sintaks `sub := induk[1:3]`, Go **tidak menyalin elemennya ke memori baru**. Baik `induk` maupun `sub` menunjuk ke *underlying array* yang sama di memori! Akibatnya:
- Mengubah `sub[0] = 99` akan **ikut mengubah `induk[1]`**.
- Memanggil `append(sub, 777)` cuando kapasitas (`cap(sub)`) masih tersisa akan **menimpa elemen `induk[3]`** tanpa disadari!

```go
package main

import (
	"fmt"
	"slices"
)

func main() {
	induk := []int{10, 20, 30, 40, 50}

	// Full slice expression [low:high:max] membatasi kapasitas sub-slice
	// menjadi (max - low = 3 - 1 = 2), sehingga append() berikutnya dipaksa
	// mengalokasikan array baru dan TIDAK menimpa elemen induk[3]!
	subAman := induk[1:3:3]
	subAman = append(subAman, 999)

	fmt.Println("Slice induk tetap utuh:", induk)   // [10 20 30 40 50]
	fmt.Println("Sub-slice baru        :", subAman) // [20 30 999]

	// Atau buat salinan independen penuh dengan slices.Clone (sejak Go 1.21):
	salinan := slices.Clone(induk)
	salinan[0] = 888
	fmt.Println("Induk vs Salinan      :", induk[0], salinan[0]) // 10 888
}
```

### 2. Perbedaan *Nil Slice* (`var s []int`) vs *Empty Slice* (`s := []int{}`)

| Deklarasi | `len(s)` | `cap(s)` | `s == nil` | Hasil `json.Marshal(s)` |
| :--- | :--- | :--- | :--- | :--- |
| `var s []int` (*Nil Slice*) | `0` | `0` | `true` | `null` |
| `s := []int{}` atau `make([]int, 0)` (*Empty Slice*) | `0` | `0` | `false` | `[]` |

Untuk memeriksa apakah sebuah *slice* kosong di Go, selalu periksa **`if len(s) == 0`** (bukan `if s == nil`), karena `len(s) == 0` bekerja dengan benar baik untuk *nil slice* maupun *empty slice*.

## Sumber
- [Go Slices: usage and internals — The Go Blog](https://go.dev/blog/slices-intro)
- [Package `slices` — Go Standard Library](https://pkg.go.dev/slices)
