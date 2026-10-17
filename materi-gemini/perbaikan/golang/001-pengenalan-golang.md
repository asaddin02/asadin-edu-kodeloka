# Perbaikan: Pengenalan Golang

- **Kelas:** golang
- **Modul:** 1
- **Jenis:** koreksi, tambahan

## Yang kurang
Materi saat ini hanya berjumlah 159 kata, memiliki salah ketik pada tabel ("Sangat Ringat"), dan belum menjelaskan arsitektur kompilasi statis Go, model konkurensi *M:N scheduler* (goroutine vs thread OS), serta jaminan kompatibilitas mundur *Go 1 Compatibility Promise*.

## Koreksi
> Teks lama: "Sangat Ringat (Memory footprint kecil)"

Teks baru: "Sangat Ringan (*memory footprint* kecil)"

## Materi tambahan
Letakkan di akhir materi (setelah tabel "Mengapa Belajar Golang?").

### 1. Bagaimana Compiler dan Runtime Go Bekerja?

Berbeda dari bahasa yang dijalankan di atas mesin virtual berat atau diinterpretasikan baris demi baris, kode sumber Go dikompilasi langsung menjadi biner mesin asli (*native machine code*) menggunakan perintah `go build`. Meskipun menghasilkan biner asli, setiap biner Go tetap menyertakan **Go Runtime** berukuran ringkas yang bertugas mengelola tiga komponen krusial secara otomatis:

1. **Penjadwal Goroutine (*M:N Scheduler*):** Memetakan ribuan *goroutine* ringan (masing-masing hanya membutuhkan tumpukan awal sekitar `2 KB` yang dapat membesar dan menyusut secara dinamis) ke sejumlah kecil *thread* sistem operasi berdasarkan jumlah inti CPU (`GOMAXPROCS`).
2. **Pengumpul Sampah Konkuren (*Concurrent Mark-and-Sweep GC*):** Membebaskan memori *heap* yang sudah tidak terpakai secara konkuren bersama jalannya program dengan jeda (*stop-the-world pause*) yang umumnya berada di bawah satu milidetik.
3. **Pemeriksa Tipe dan Refleksi Runtime:** Menyediakan informasi tipe untuk antarmuka (*interface*), *stack trace* saat *panic*, serta manajemen kanal (*channel*).

```go
package main

import (
	"fmt"
	"runtime"
)

func main() {
	fmt.Printf("Versi Go       : %s\n", runtime.Version())
	fmt.Printf("Arsitektur OS  : %s/%s\n", runtime.GOOS, runtime.GOARCH)
	fmt.Printf("Jumlah CPU     : %d core\n", runtime.NumCPU())
	fmt.Printf("Goroutine Aktif: %d\n", runtime.NumGoroutine())
}
```

### 2. Jaminan Kompatibilitas Go 1 (*Go 1 Compatibility Promise*)

Salah satu alasan utama adopsi Go pada infrastruktur *cloud-native* (seperti Docker, Kubernetes, Prometheus, dan Terraform) adalah dokumen spesifikasi kompatibilitas Go 1: program Go yang ditulis untuk Go 1.0 dijamin tetap dapat dikompilasi dan berjalan tanpa perubahan kode pada rilis Go 1.x berikutnya (hingga Go 1.25+ saat ini), kecuali terdapat celah keamanan atau cacat spesifikasi yang harus diperbaiki.

### 3. Kapan Menggunakan Go dan Kapan Memilih Bahasa Lain?

| Skenario Penggunaan | Kecocokan Go | Alasan Teknis |
| :--- | :--- | :--- |
| Layanan mikro (*microservices*), API Gateway, & jaringan berkonkurensi tinggi | Sangat tinggi | *Goroutine* ringan, waktu kompilasi cepat, dan pustaka standar `net/http` yang matang. |
| Perkakas CLI & DevOps | Sangat tinggi | Menghasilkan satu berkas biner statis lintas platform (`GOOS`/`GOARCH`) tanpa ketergantungan runtime eksternal. |
| Pemrograman sistem tingkat rendah (kernel OS, *driver* perangkat keras) | Rendah | Go memiliki *Garbage Collector* dan runtime yang tidak dirancang untuk lingkungan tanpa sistem operasi (*bare-metal*). |

## Sumber
- [Documentation — The Go Programming Language](https://go.dev/doc/)
- [Go 1 and the Future of Go Programs — Compatibility Promise](https://go.dev/doc/go1compat)
- [Effective Go — The Go Programming Language](https://go.dev/doc/effective_go)
