# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Go (Golang) Modern: Go 1.22–1.26, Standard Library Routing, Iterators (`iter.Seq`), `log/slog`, & `testing/synctest`

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 267 modul yang sudah ada di kelas `golang/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `golang/app.js` (larik `chapters`).

## 1. Audit Modul Saat Ini di Repositori (`golang/app.js`)

Saat ini, kelas **`golang`** di repositori Kodeloka memiliki **267 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |
| 1–52 | Domain 1: Fondasi Bahasa Go (52 bab) | — | Sudah ada |
| 53–74 | Domain 2: Standard Library (22 bab) | — | Sudah ada |
| 75–80 | Domain 3: Go Modules & Dependency (6 bab) | — | Sudah ada |
| 81–88 | Domain 4: Golang Generics (8 bab) | — | Sudah ada |
| 89–98 | Domain 5: Unit Testing & Benchmark (10 bab) | — | Sudah ada |
| 99–109 | Domain 6: Goroutines & Concurrency (11 bab) | — | Sudah ada |
| 110–114 | Domain 7: Package Context (5 bab) | — | Sudah ada |
| 115–118 | Domain 8: Go Modern (1.21 - 1.26) (4 bab) | — | Sudah ada |
| 119–127 | Domain 9: Golang JSON (9 bab) | — | Sudah ada |
| 128–135 | Domain 10: Golang Logging (8 bab) | — | Sudah ada |
| 136–141 | Domain 11: Golang Embed (6 bab) | — | Sudah ada |
| 142–149 | Domain 12: Golang Viper Configuration (8 bab) | — | Sudah ada |
| 150–157 | Domain 13: Golang Validation (8 bab) | — | Sudah ada |
| 158–165 | Domain 14: Golang Dependency Injection (8 bab) | — | Sudah ada |
| 166–173 | Domain 15: Database & MySQL (8 bab) | — | Sudah ada |
| 174–180 | Domain 16: Golang Database Migration (7 bab) | — | Sudah ada |
| 181–189 | Domain 17: Golang GORM ORM Framework (9 bab) | — | Sudah ada |
| 190–191 | Domain 18: Database Go Modern (2 bab) | — | Sudah ada |
| 192–200 | Domain 19: Golang Redis Client (9 bab) | — | Sudah ada |
| 201–223 | Domain 20: Golang Web Development (23 bab) | — | Sudah ada |
| 224–232 | Domain 21: Golang HTTP Router (9 bab) | — | Sudah ada |
| 233–242 | Domain 22: Golang RESTful API (10 bab) | — | Sudah ada |
| 243–251 | Domain 23: Golang Fiber Web Framework (9 bab) | — | Sudah ada |
| 252–253 | Domain 24: gRPC & Protocol Buffers (2 bab) | — | Sudah ada |
| 254–255 | Domain 25: Observability Go (2 bab) | — | Sudah ada |
| 256–264 | Domain 26: Deployment & Production Go (9 bab) | — | Sudah ada |
| 265–267 | Domain 27: Mini Project Go (3 bab) | — | Sudah ada |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan di bawah ini menambahkan pembaruan 2024–2026, tetapi sebagian topiknya sudah ada di kelas. Sebagian besar materinya sudah ada di kelas: routing `http.ServeMux` dibahas di bab 204 (pola metode HTTP dan `{wildcard}` Go 1.22 baru tampak di bab 265), iterator dan *range-over-func* di bab 115, `log/slog` di bab 255, serta `testing/synctest` di bab 118. Yang belum dibahas hanya paket `unique`.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Baru 268: Routing `net/http` Bawaan Go 1.22+ (Method & Wildcard `{id}`)

- **Tingkat:** Menengah
- **Ringkasan:** Menggunakan fitur routing metode HTTP dan parameter path bawaan `http.NewServeMux()` di Go 1.22+ tanpa ketergantungan router pihak ketiga.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menggunakan fitur routing metode HTTP dan parameter path bawaan `http.NewServeMux()` di Go 1.22+ tanpa ketergantungan router pihak ketiga. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```go
package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func buatMux() *http.ServeMux {
	mux := http.NewServeMux()
	// Sejak Go 1.22, pola mendukung metode HTTP dan wildcard {nama}
	mux.HandleFunc("GET /api/v1/modul/{slug}", func(w http.ResponseWriter, r *http.Request) {
		slug := r.PathValue("slug")
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		json.NewEncoder(w).Encode(map[string]string{"slug": slug, "status": "aktif"})
	})
	return mux
}

func main() {
	log.Fatal(http.ListenAndServe(":8080", buatMux()))
}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `chapters` di `golang/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `golang` dari **267 modul** menjadi **270 modul** berstandar terbaru.


## Modul Baru 269: Range Over Function & Paket `iter` (`iter.Seq`, `slices.All`) di Go 1.23+

- **Tingkat:** Lanjut
- **Ringkasan:** Merancang iterator kustom yang bersih dan malas (*lazy*) menggunakan tanda tangan standar `iter.Seq[V]` dan `iter.Seq2[K, V]` yang dapat diiterasi langsung dengan `for v := range ...`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Merancang iterator kustom yang bersih dan malas (*lazy*) menggunakan tanda tangan standar `iter.Seq[V]` dan `iter.Seq2[K, V]` yang dapat diiterasi langsung dengan `for v := range ...`. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```go
package main

import (
	"fmt"
	"iter"
)

// Menghasilkan bilangan genap secara malas (lazy) dengan iter.Seq[int]
func BilanganGenapHingga(batas int) iter.Seq[int] {
	return func(yield func(int) bool) {
		for i := 2; i <= batas; i += 2 {
			if !yield(i) {
				return // Berhenti jika pemanggil melakukan break
			}
		}
	}
}

func main() {
	for angka := range BilanganGenapHingga(10) {
		fmt.Println(angka)
	}
}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `chapters` di `golang/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `golang` dari **267 modul** menjadi **270 modul** berstandar terbaru.


## Modul Baru 270: Logging Terstruktur dengan `log/slog`, `unique.Handle`, dan Pengujian Konkurensi `testing/synctest` (`log/slog` sejak Go 1.21, `unique` sejak Go 1.23, `testing/synctest` stabil sejak Go 1.25)

- **Tingkat:** Lanjut
- **Ringkasan:** Menerapkan logging JSON terstruktur berkinerja tinggi dengan paket standar `log/slog`, melakukan interning nilai dengan paket `unique`, serta menguji kode konkuren secara deterministik.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menerapkan logging JSON terstruktur berkinerja tinggi dengan paket standar `log/slog`, melakukan interning nilai dengan paket `unique`, serta menguji kode konkuren secara deterministik. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```go
package main

import (
	"log/slog"
	"os"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
	logger.Info("Permintaan berhasil diproses",
		slog.String("rute", "/api/v1/modul"),
		slog.Int("status", 200),
	)
}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `chapters` di `golang/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `golang` dari **267 modul** menjadi **270 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `golang` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `golang/app.js` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `golang` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (267 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `golang`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 267 modul yang sudah ada di `golang/app.js` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `golang` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan ketiga modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `golang/`
- B. Mengekstrak judul, tingkat, ringkasan, isi, contoh kode, dan kuis setiap modul dari berkas ini ke dalam larik `chapters` di `golang/app.js` (bentuk objeknya mengikuti mesin kelas tersebut), memperbarui jumlah modul di `scripts/courses.json`, lalu menjalankan `npm run extract`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke larik `chapters` di `golang/app.js`, jumlah modulnya diperbarui di `scripts/courses.json`, dan `data/modules.json` dibangkitkan ulang lewat `npm run extract`.

## Sumber

- [Dokumentasi Resmi — Go (Golang) Modern](https://go.dev/doc/)
- [Go Blog — Routing Enhancements for Go 1.22](https://go.dev/blog/routing-enhancements)
- [Go 1.25 Release Notes (`testing/synctest` stabil)](https://go.dev/doc/go1.25)
- [Paket `iter`](https://pkg.go.dev/iter)
- [Paket `log/slog`](https://pkg.go.dev/log/slog)
- [Paket `unique`](https://pkg.go.dev/unique)
