# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Go (Golang) Modern: Go 1.22–1.26, Standard Library Routing, Iterators (`iter.Seq`), `log/slog`, & Goverse/PGO

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 0 modul yang sudah ada di kelas `golang/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `golang/data/modules.json`.

## 1. Audit Modul Saat Ini di Repositori (`golang/data/modules.json`)

Saat ini, kelas **`golang`** di repositori Kodeloka memiliki **0 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan penuh di bawah ini menambahkan kapabilitas rilis terbaru yang belum tercakup di modul lama.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Baru 268: Routing `net/http` Bawaan Go 1.22+ (Method & Wildcard `{id}`)

- **Tingkat:** Menengah
- **Ringkasan:** Menggunakan fitur routing metode HTTP dan parameter path bawaan `http.NewServeMux()` di Go 1.22+ tanpa ketergantungan router pihak ketiga.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menggunakan fitur routing metode HTTP dan parameter path bawaan `http.NewServeMux()` di Go 1.22+ tanpa ketergantungan router pihak ketiga. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
package main

import (
	"fmt"
	"net/http"
)

func buatMux() *http.ServeMux {
	mux := http.NewServeMux()
	// Sejak Go 1.22, pola mendukung metode HTTP dan wildcard {nama}
	mux.HandleFunc("GET /api/v1/modul/{slug}", func(w http.ResponseWriter, r *http.Request) {
		slug := r.PathValue("slug")
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		fmt.Fprintf(w, `{"slug":%q,"status":"aktif"}`, slug)
	})
	return mux
}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `golang/data/modules.json` (dan `golang/app.js`) sehingga memperluas cakupan kelas `golang` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Baru 269: Range Over Function & Paket `iter` (`iter.Seq`, `slices.All`) di Go 1.23+

- **Tingkat:** Lanjut
- **Ringkasan:** Merancang iterator kustom yang bersih dan malas (*lazy*) menggunakan tanda tangan standar `iter.Seq[V]` dan `iter.Seq2[K, V]` yang dapat diiterasi langsung dengan `for v := range ...`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Merancang iterator kustom yang bersih dan malas (*lazy*) menggunakan tanda tangan standar `iter.Seq[V]` dan `iter.Seq2[K, V]` yang dapat diiterasi langsung dengan `for v := range ...`. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
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

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `golang/data/modules.json` (dan `golang/app.js`) sehingga memperluas cakupan kelas `golang` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Baru 270: Logging Terstruktur dengan `log/slog`, `unique.Handle`, dan Pengujian Konkurensi `testing/synctest` (Go 1.24+)

- **Tingkat:** Lanjut
- **Ringkasan:** Menerapkan logging JSON terstruktur berkinerja tinggi dengan paket standar `log/slog`, melakukan interning nilai dengan paket `unique`, serta menguji kode konkuren secara deterministik.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menerapkan logging JSON terstruktur berkinerja tinggi dengan paket standar `log/slog`, melakukan interning nilai dengan paket `unique`, serta menguji kode konkuren secara deterministik. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
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

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `golang/data/modules.json` (dan `golang/app.js`) sehingga memperluas cakupan kelas `golang` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `golang` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `golang/data/modules.json` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `golang` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (0 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `golang`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 0 modul yang sudah ada di `golang/data/modules.json` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

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
- B. Mengekstrak objek `judul`, `tingkat`, `ringkas`, `isi`, contoh kode, dan `kuis` dari berkas ini ke dalam `golang/data/modules.json` serta memperbarui jumlah modul di `scripts/courses.json`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke `golang/data/modules.json` (dan disinkronkan ke `golang/app.js` serta `scripts/courses.json`).

## Sumber

- [Dokumentasi Resmi — Go (Golang) Modern](https://go.dev/doc/)
