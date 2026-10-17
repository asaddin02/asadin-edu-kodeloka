# Perbaikan: Interface

- **Kelas:** golang
- **Modul:** 38
- **Jenis:** pengganti

## Yang kurang
Materi saat ini hanya 43 kata. Belum menjelaskan filosofi desain antarmuka kecil di Go (*"The bigger the interface, the weaker the abstraction"*), komposisi antarmuka (*interface embedding*), verifikasi kepatuhan antarmuka pada waktu kompilasi (`var _ Notifier = (*EmailSender)(nil)`), serta jebakan klasik **Nil Interface vs Interface Holding a Nil Pointer**.

## Materi pengganti

### 1. Kepuasan Antarmuka Secara Implisit (*Implicit Interface Satisfaction*)

Di Go, sebuah `interface` mendefinisikan **perilaku** (kumpulan tanda tangan *method*). Sebuah tipe konkret (`struct` atau tipe definisi lainnya) secara otomatis memenuhi sebuah `interface` begitu tipe tersebut memiliki seluruh *method* yang disyaratkan—tanpa kata kunci `implements`.

Prinsip utama di Go adalah **membuat antarmuka sekecil mungkin** (contohnya `io.Reader` dan `io.Writer` di pustaka standar yang masing-masing hanya memiliki satu *method*) dan **mendefinisikan antarmuka di paket pemanggil (*consumer*)**, bukan di paket penyedia implementasi.

```go
package main

import "fmt"

// Antarmuka kecil dan terfokus di sisi pemanggil
type PengirimPesan interface {
	Kirim(tujuan string, pesan string) error
}

type KlienEmail struct {
	ServerSMTP string
}

// Verifikasi waktu kompilasi: gagal build jika KlienEmail belum memenuhi PengirimPesan
var _ PengirimPesan = (*KlienEmail)(nil)

func (k *KlienEmail) Kirim(tujuan string, pesan string) error {
	fmt.Printf("[SMTP %s] Mengirim ke %s: %s\n", k.ServerSMTP, tujuan, pesan)
	return nil
}

func NotifikasiPesanan(p PengirimPesan, emailPelanggan string) error {
	return p.Kirim(emailPelanggan, "Pesanan Anda sedang diproses.")
}

func main() {
	email := &KlienEmail{ServerSMTP: "smtp.kodeloka.id:587"}
	_ = NotifikasiPesanan(email, "rina@example.com")
}
```

### 2. Jebakan Terkenal di Go: Nilai `interface` yang Memuat Pointer `nil`

Secara internal, sebuah variabel bertipe `interface` diwakili oleh pasangan dua nilai: **`(Tipe Konkret, Nilai Data)`**. Sebuah variabel `interface` hanya bernilai `== nil` apabila **kedua** komponen tersebut (`Tipe Konkret` **dan** `Nilai Data`) sama-sama `nil`!

| Kondisi Variabel `var p PengirimPesan` | Isi Internal `(Tipe, Nilai)` | Hasil `p == nil` |
| :--- | :--- | :--- |
| `var p PengirimPesan` (belum diisi apa pun) | `(nil, nil)` | `true` |
| `var e *KlienEmail = nil; p = e` | `(*KlienEmail, nil)` | **`false`!** (Karena kolom Tipe berisi `*KlienEmail`) |

Oleh karena itu, pada fungsi yang mengembalikan tipe `error` (yang merupakan sebuah `interface`), jangan pernah mengembalikan variabel pointer *custom error* bertipe konkret yang bernilai `nil`; selalu kembalikan literal `return nil` secara eksplisit saat tidak ada galat.

## Sumber
- [Effective Go — Interfaces and other types](https://go.dev/doc/effective_go#interfaces)
- [Go FAQ — Why is my nil error value not equal to nil?](https://go.dev/doc/faq#nil_error)
