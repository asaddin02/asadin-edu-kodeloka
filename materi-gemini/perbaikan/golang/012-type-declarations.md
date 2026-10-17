# Perbaikan: Type Declarations

- **Kelas:** golang
- **Modul:** 12
- **Jenis:** pengganti

## Yang kurang
Materi saat ini hanya 28 kata dan secara keliru menyebut `type NamaTipeBaru TipeLama` sebagai "kemampuan membuat alias untuk tipe data yang sudah ada". Dalam spesifikasi Go (sejak Go 1.9), `type Baru Lama` adalah **Defined Type** (tipe baru yang berbeda identitas), sedangkan **Type Alias** wajib menggunakan tanda sama dengan (`type Alias = Lama`).

## Materi pengganti

### 1. Perbedaan *Type Definition* dan *Type Alias* di Go

Spesifikasi bahasa Go membedakan dua bentuk deklarasi tipe yang sering tertukar oleh pemula:

1. **Definisi Tipe Baru (*Type Definition* — `type NamaBaru TipeDasar`):** Menciptakan tipe baru yang memiliki struktur dasar (*underlying type*) yang sama dengan `TipeDasar`, tetapi dianggap sebagai **tipe yang berbeda** oleh sistem pengecekan tipe Go. Tipe baru ini tidak bisa dicampur langsung dengan tipe asalnya tanpa konversi eksplisit, dan Anda dapat menambahkan *method* khusus padanya.
2. **Alias Tipe (*Type Alias* — `type NamaAlias = TipeAsal`, sejak Go 1.9):** Hanya memberikan nama alternatif untuk tipe yang persis sama. `byte` (`= uint8`), `rune` (`= int32`), dan `any` (`= interface{}`) adalah contoh alias tipe bawaan Go.

| Kriteria | *Type Definition* (`type IDPengguna int64`) | *Type Alias* (`type IDPengguna = int64`) |
| :--- | :--- | :--- |
| Identitas tipe | Tipe baru yang terpisah dari `int64` | Tipe yang sama persis dengan `int64` |
| Perlu konversi saat ditugaskan ke `int64`? | Ya (`int64(id)`) | Tidak (otomatis kompatibel) |
| Dapat diberi *method* baru? | Ya (selama berada di paket yang sama) | Tidak untuk tipe dasar bawaan (`int64`, `string`) |
| Kegunaan utama | Keamanan domain (*domain type safety*) & penambahan perilaku | Migrasi bertahap antar-paket (*refactoring* skala besar) |

### 2. Mencegah Kesalahan Parameter dengan *Defined Type*

Bayangkan fungsi transfer saldo yang menerima `idPengirim` dan `idPenerima` bertipe `int64`, serta `nominal` bertipe `int64`. Jika ketiganya hanya ditulis `int64`, pemanggil dapat tanpa sengaja menukar urutan argumen `nominal` dan `idPenerima` tanpa terdeteksi oleh compiler. Dengan *Defined Type*, kesalahan tersebut langsung tertangkap saat kompilasi:

```go
package main

import "fmt"

// Defined Type: tipe baru yang mandiri
type IDAkun string
type NominalRupiah int64

// Method hanya bisa ditempelkan pada Defined Type, bukan pada string bawaan
func (n NominalRupiah) Format() string {
	return fmt.Sprintf("Rp%d", n)
}

// Type Alias (memakai tanda '='): identik dengan string
type LabelTeks = string

func Transfer(dari IDAkun, ke IDAkun, jumlah NominalRupiah) {
	fmt.Printf("Transfer %s dari akun [%s] ke akun [%s] berhasil.\n", jumlah.Format(), dari, ke)
}

func main() {
	var pengirim IDAkun = "ACC-1001"
	var penerima IDAkun = "ACC-2002"
	var bayar NominalRupiah = 250_000

	Transfer(pengirim, penerima, bayar)

	// Konversi eksplisit antar tipe yang memiliki underlying type sama:
	teksMentah := "ACC-3003"
	akunBaru := IDAkun(teksMentah)

	// Type Alias tidak butuh konversi karena tipenya identik dengan string:
	var catatan LabelTeks = teksMentah
	fmt.Println("Akun baru:", akunBaru, "| Catatan:", catatan)
}
```

## Sumber
- [The Go Programming Language Specification — Type declarations](https://go.dev/ref/spec#Type_declarations)
- [Effective Go — Conversions and Types](https://go.dev/doc/effective_go#conversions)
