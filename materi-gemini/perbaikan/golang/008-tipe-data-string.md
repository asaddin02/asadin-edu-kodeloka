# Perbaikan: Tipe Data String

- **Kelas:** golang
- **Modul:** 8
- **Jenis:** pengganti

## Yang kurang
Materi saat ini hanya 56 kata dan menyamakan pengaksesan `string[index]` dengan "mengambil byte/karakter pada indeks tertentu (mengembalikan kode ASCII / uint8)". Penjelasan tersebut belum membedakan *byte* UTF-8 dari karakter Unicode (*rune*), tidak membahas sifat *immutable* string di Go, dan belum menunjukkan cara menghitung jumlah karakter multibyte dengan `utf8.RuneCountInString()`.

## Materi pengganti

### 1. Representasi Internal String di Go: Slice Byte UTF-8 yang *Immutable*

Di Go, tipe data `string` adalah deretan *byte* yang bersifat **tidak dapat diubah (*immutable*)** dan secara konvensi dikodekan dalam **UTF-8**. Anda dapat mendeklarasikan string dengan dua jenis tanda kutip:

- **Interpreted String Literal (`"..."`):** Memproses karakter *escape* seperti `\n` (baris baru), `\t` (tab), dan `\"`.
- **Raw String Literal (`` `...` ``):** Diapit oleh *backtick*, mempertahankan seluruh teks apa adanya termasuk baris baru dan garis miring terbalik (`\`), sehingga sangat cocok untuk kueri SQL, pola *regex*, atau templat JSON.

### 2. Perbedaan Byte (`uint8`) dan Karakter Unicode (`rune` / `int32`)

Karena UTF-8 menggunakan `1` hingga `4` byte per karakter:
- Fungsi bawaan **`len(s)`** mengembalikan **jumlah byte**, bukan jumlah karakter.
- Pengindeksan **`s[i]`** mengembalikan **byte ke-`i` (`byte` / `uint8`)**, bukan karakter ke-`i`.
- Perulangan **`for i, r := range s`** secara otomatis mendekode UTF-8 dan menghasilkan pasangan indeks byte awal serta **`rune` (`int32`)** yang utuh.

```go
package main

import (
	"fmt"
	"unicode/utf8"
)

func main() {
	teks := "Halo 世界" // "Halo " (5 byte ASCII) + "世界" (2x3 = 6 byte UTF-8)

	fmt.Println("Jumlah byte (len)        :", len(teks))                    // 11
	fmt.Println("Jumlah karakter (rune)   :", utf8.RuneCountInString(teks)) // 7
	fmt.Printf("Byte indeks ke-0 (teks[0]): %d ('%c')\n", teks[0], teks[0]) // 72 ('H')

	fmt.Println("\nIterasi aman per karakter (rune) dengan for-range:")
	for indeksByte, karakter := range teks {
		fmt.Printf("Byte %2d -> '%c' (Unicode: %U)\n", indeksByte, karakter, karakter)
	}
}
```

### 3. Mengapa Mengubah Karakter String Harus Melalui `[]rune` atau `strings.Builder`?

Karena `string` bersifat *immutable*, ekspresi `teks[0] = 'B'` akan ditolak oleh compiler. Untuk memodifikasi karakter satu per satu secara aman terhadap UTF-8, konversikan string menjadi `[]rune`, ubah elemennya, lalu kembalikan ke `string`. Untuk menggabungkan banyak potongan string di dalam perulangan, gunakan `strings.Builder` agar tidak memicu alokasi memori berulang kali.

| Operasi | Cara yang Benar di Go | Kompleksitas |
| :--- | :--- | :--- |
| Menghitung ukuran memori byte | `len(s)` | $O(1)$ |
| Menghitung jumlah karakter Unicode | `utf8.RuneCountInString(s)` | $O(n)$ |
| Mengambil potongan substring multibyte | `string([]rune(s)[awal:akhir])` | $O(n)$ |
| Menggabungkan string dalam perulangan | `var b strings.Builder; b.WriteString(...)` | $O(n)$ |

## Sumber
- [Strings, bytes, runes and characters in Go — The Go Blog](https://go.dev/blog/strings)
- [Package `unicode/utf8` — Go Standard Library](https://pkg.go.dev/unicode/utf8)
- [Package `strings` — Go Standard Library](https://pkg.go.dev/strings)
