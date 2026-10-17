# Kanonikalisasi Nilai dan Penghematan Memori (*Interning*) dengan Paket `unique` (Go 1.23+)

- **Letak:** sesudah modul 118
- **Tingkat:** Lanjut
- **Ringkasan:** Menghemat alokasi memori dan mempercepat perbandingan nilai berulang menjadi operasi pointer $O(1)$ menggunakan paket standar `unique` (`unique.Make` dan `unique.Handle[T]`) yang diperkenalkan sejak Go 1.23.

## Mengapa Perlu Kanonikalisasi Nilai (*Value Interning*)?

Dalam layanan berskala besar seperti pengumpul log, pengurai alamat IP, atau penyimpan metrik berlabel, jutaan struct di memori sering kali menyimpan string atau konfigurasi yang nilainya berulang (misalnya nama wilayah `"ap-southeast-3"`, kode status `"200 OK"`, atau alamat IPv6 sumber). Sebelum Go 1.23, pengembang harus membangun peta *string interning* sendiri menggunakan `sync.Map` yang memiliki kelemahan serius: nilai yang sudah masuk ke `map` tidak pernah dibersihkan oleh *Garbage Collector* (GC) meskipun sudah tidak dirujuk lagi oleh program.

Sejak **Go 1.23**, pustaka standar menyediakan paket **`unique`**. Fungsi `unique.Make[T](value)` menyimpan satu salinan kanonik dari nilai `T` yang *comparable* dan mengembalikan pegangan ringan **`unique.Handle[T]`** yang otomatis dibersihkan oleh *Garbage Collector* ketika tidak ada lagi variabel yang memegang `Handle` tersebut.

## 1. Cara Kerja `unique.Make` dan `unique.Handle[T]`

Dua pemanggilan `unique.Make(v1)` dan `unique.Make(v2)` dengan nilai yang sama dijamin mengembalikan `unique.Handle[T]` yang **identik**. Keuntungannya ada dua:

1. **Deduplikasi Memori Otomatis:** Seratus ribu catatan log yang semuanya memiliki label lingkungan `"production-jakarta-01"` hanya menyimpan satu string di memori *heap*.
2. **Perbandingan Kecepatan Konstanta $O(1)$:** Membandingkan dua `unique.Handle[string]` dengan `h1 == h2` hanya membandingkan **alamat pointer 8-byte**, bukan membandingkan isi string karakter demi karakter!

```go
package main

import (
	"fmt"
	"unique"
)

type LabelMetrik struct {
	Layanan string
	Wilayah string
}

type TitikData struct {
	WaktuUnix int64
	Nilai     float64
	Label     unique.Handle[LabelMetrik]
}

func main() {
	// Dua struct berbeda dengan nilai yang identik
	l1 := LabelMetrik{Layanan: "payment-api", Wilayah: "id-jkt-1"}
	l2 := LabelMetrik{Layanan: "payment-api", Wilayah: "id-jkt-1"}

	h1 := unique.Make(l1)
	h2 := unique.Make(l2)

	// Perbandingan pointer O(1) yang sangat cepat
	fmt.Println("Apakah h1 == h2? :", h1 == h2) // true
	fmt.Println("Nilai asli Label :", h1.Value().Layanan, "@", h1.Value().Wilayah)

	sampel := TitikData{WaktuUnix: 1760670000, Nilai: 42.5, Label: h1}
	fmt.Printf("Sampel terekam untuk layanan: %s\n", sampel.Label.Value().Layanan)
}
```

## 2. Perbandingan `unique.Handle[T]` vs Peta *Interning* Manual

| Karakteristik | Peta Manual (`map[string]string` + `sync.RWMutex`) | Paket Standar `unique` (Sejak Go 1.23) |
| :--- | :--- | :--- |
| Pembersihan memori otomatis oleh GC | Tidak (tumbuh terus hingga memicu kebocoran memori kecuali dikosongkan manual) | **Ya** (memakai referensi lemah internal yang terintegrasi dengan siklus GC Go) |
| Tipe data yang didukung | Biasanya ditulis khusus untuk `string` | Semua tipe `comparable` (termasuk `struct`, array, dan angka) |
| Biaya perbandingan kesetaraan (`==`) | $O(n)$ sesuai panjang string | **$O(1)$** (hanya perbandingan satu kata memori/pointer) |
| Keamanan konkurensi (*thread-safety*) | Harus dikelola manual dengan `Mutex` atau `sync.Map` | **Aman secara bawaan** untuk ribuan *goroutine* |

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan `unique.Make` untuk nilai yang selalu unik (seperti UUID transaksi atau *timestamp*):** Jika nilai tidak pernah berulang, menyimpannya ke tabel kanonik global hanya menambah beban CPU dan memori tanpa manfaat deduplikasi.
2. **Menyimpan substring dari string raksasa tanpa menyalinnya terlebih dahulu:** Meskipun paket `unique` sudah mengkloning string secara internal agar tidak menahan buffer raksasa di memori, pastikan tipe `struct` yang Anda masukkan ke `unique.Make` tidak memuat pointer ke struktur besar yang hanya dipakai sementara.

## Kuis Pemahaman

### Soal 1
Apa keuntungan utama membandingkan dua nilai `unique.Handle[string]` (`h1 == h2`) dibandingkan membandingkan dua variabel `string` panjang secara langsung?
- A. `unique.Handle` mengenkripsi isi string secara otomatis dengan SHA-256.
- B. Perbandingan `h1 == h2` cukup membandingkan pointer internal dalam waktu $O(1)$ tanpa perlu memeriksa isi string byte demi byte.
- C. `unique.Handle` mengizinkan string diubah secara langsung (*mutable*).
- D. `unique.Handle` menyimpan seluruh data di disk agar RAM tidak terpakai.

**Jawaban Benar:** B
**Penjelasan:** Karena `unique.Make` menjamin setiap nilai unik hanya memiliki satu representasi kanonik di memori, dua `unique.Handle[T]` bernilai sama pasti menunjuk ke alamat kanonik yang sama sehingga perbandingan `==` berlangsung dalam waktu konstan $O(1)$.

### Soal 2
Bagaimana perilaku *Garbage Collector* (GC) Go terhadap nilai yang telah dikanonikalisasi melalui `unique.Make`?
- A. Nilai tersebut disimpan permanen selamanya hingga proses program dimatikan.
- B. Nilai tersebut dihapus setiap 10 detik tanpa memedulikan apakah `Handle` masih dipakai.
- C. Nilai kanonik akan otomatis dibersihkan oleh GC ketika tidak ada lagi `unique.Handle` aktif di program yang merujuknya.
- D. Pengembang wajib memanggil fungsi `unique.Free(handle)` secara manual.

**Jawaban Benar:** C
**Penjelasan:** Paket `unique` terintegrasi langsung dengan runtime GC Go menggunakan referensi lemah internal, sehingga entri yang sudah tidak memiliki referensi `Handle` aktif akan dipungut kembali secara otomatis pada siklus GC berikutnya.

### Soal 3
Syarat tipe data `T` apa yang harus dipenuhi agar dapat digunakan pada `unique.Make[T](value)`?
- A. Tipe `T` harus memenuhi batasan (*constraint*) `comparable`.
- B. Tipe `T` hanya boleh berupa `string` atau `[]byte`.
- C. Tipe `T` wajib mengimplementasikan antarmuka `io.Reader`.
- D. Tipe `T` harus berupa `map` atau `slice`.

**Jawaban Benar:** A
**Penjelasan:** Tanda tangan fungsi `func Make[T comparable](value T) Handle[T]` mensyaratkan tipe `T` bersifat `comparable` (seperti `string`, angka, pointer, array, atau `struct` yang seluruh field-nya *comparable*).

## Sumber
- [Package `unique` — Go Standard Library Documentation](https://pkg.go.dev/unique)
- [New unique package — The Go Blog](https://go.dev/blog/unique)
