# Daftar modul Kodeloka

Dibuat otomatis oleh `scripts/daftar-modul-gemini.mjs` dari `data/modules.json` pada 2026-10-17. Jangan disunting; Claude membuatnya ulang setiap kali materi di situs berubah.

- **Kata** adalah jumlah kata di tab Materi, seperti yang dibaca pelajar. Kode di editor praktik tidak ikut dihitung.
- **tipis** berarti kurang dari 300 kata. Ini hanya petunjuk awal: modul yang panjang pun bisa punya penjelasan yang kurang.
- **No** adalah nomor modul yang dipakai untuk nama berkas perbaikan (`materi-gemini/perbaikan/<folder>/NNN-judul.md`).
- Isi asli setiap kelas ada di `<folder>/app.js`. Kelas HTML, CSS, JavaScript, dan PHP dibuat dari `materi-gemini/<kelas>/`, jadi perbaiki berkas Markdown-nya langsung.
- Golang menampilkan semua bab satu domain di satu halaman, jadi beberapa bab berbagi tautan yang sama.

## Ringkasan

| Kelas | Folder | Modul | Median kata | Modul tipis |
| :--- | :--- | ---: | ---: | ---: |
| Golang | `golang/` | 267 | 48 | 256 |
| FastAPI | `fastapi/` | 24 | 53 | 20 |
| Next.js | `next/` | 23 | 124 | 20 |
| Git & CI/CD | `git-ci-cd/` | 20 | 139 | 14 |
| Microservices | `microservices/` | 24 | 144 | 19 |
| Docker | `docker/` | 21 | 177 | 18 |
| Redis | `redis/` | 21 | 246 | 12 |
| Apache Kafka | `kafka/` | 13 | 446 | 0 |
| Nginx | `nginx/` | 8 | 469 | 0 |
| Kong API Gateway | `kong/` | 12 | 476 | 0 |
| k6 | `k6/` | 15 | 480 | 0 |
| Prometheus | `prometheus/` | 15 | 523 | 0 |
| OpenTelemetry | `opentelemetry/` | 8 | 540 | 0 |
| Linux & Shell | `linux/` | 8 | 542 | 0 |
| Kubernetes | `kubernetes/` | 14 | 563 | 0 |
| PostgreSQL | `postgresql/` | 12 | 572 | 0 |
| Keamanan Aplikasi | `keamanan/` | 8 | 586 | 0 |
| Grafana | `grafana/` | 15 | 642 | 0 |
| RabbitMQ | `rabbitmq/` | 15 | 669 | 0 |
| JavaScript | `javascript/` | 22 | 774 | 0 |
| PHP | `php/` | 25 | 805 | 0 |
| HTML | `html/` | 27 | 854 | 2 |
| CSS | `css/` | 20 | 896 | 0 |
| **Total** | | **637** | | **361** |

## Golang (`golang/`, 267 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Pengenalan Golang | Domain 1: Fondasi Bahasa Go | 159 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 2 | Menginstall Golang & Setup Environment | Domain 1: Fondasi Bahasa Go | 84 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 3 | Membuat Project Go | Domain 1: Fondasi Bahasa Go | 68 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 4 | Program Hello World | Domain 1: Fondasi Bahasa Go | 89 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 5 | Multiple Main Function | Domain 1: Fondasi Bahasa Go | 58 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 6 | Tipe Data Number | Domain 1: Fondasi Bahasa Go | 69 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 7 | Tipe Data Boolean | Domain 1: Fondasi Bahasa Go | 41 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 8 | Tipe Data String | Domain 1: Fondasi Bahasa Go | 56 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 9 | Variable | Domain 1: Fondasi Bahasa Go | 91 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 10 | Constant | Domain 1: Fondasi Bahasa Go | 45 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 11 | Konversi Tipe Data | Domain 1: Fondasi Bahasa Go | 62 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 12 | Type Declarations | Domain 1: Fondasi Bahasa Go | 28 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 13 | Operasi Matematika | Domain 1: Fondasi Bahasa Go | 54 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 14 | Operasi Perbandingan | Domain 1: Fondasi Bahasa Go | 44 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 15 | Operasi Boolean | Domain 1: Fondasi Bahasa Go | 27 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 16 | Tipe Data Array | Domain 1: Fondasi Bahasa Go | 48 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 17 | Tipe Data Slice | Domain 1: Fondasi Bahasa Go | 98 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 18 | Tipe Data Map | Domain 1: Fondasi Bahasa Go | 46 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 19 | If Expression | Domain 1: Fondasi Bahasa Go | 56 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 20 | Switch Expression | Domain 1: Fondasi Bahasa Go | 58 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 21 | For Loop | Domain 1: Fondasi Bahasa Go | 50 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 22 | Break dan Continue | Domain 1: Fondasi Bahasa Go | 26 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 23 | Function | Domain 1: Fondasi Bahasa Go | 23 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 24 | Function Parameter | Domain 1: Fondasi Bahasa Go | 19 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 25 | Function Return Value | Domain 1: Fondasi Bahasa Go | 22 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 26 | Returning Multiple Values | Domain 1: Fondasi Bahasa Go | 39 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 27 | Named Return Values | Domain 1: Fondasi Bahasa Go | 18 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 28 | Variadic Function | Domain 1: Fondasi Bahasa Go | 33 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 29 | Function as Value | Domain 1: Fondasi Bahasa Go | 22 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 30 | Function as Parameter | Domain 1: Fondasi Bahasa Go | 37 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 31 | Anonymous Function | Domain 1: Fondasi Bahasa Go | 15 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 32 | Recursive Function | Domain 1: Fondasi Bahasa Go | 45 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 33 | Closure | Domain 1: Fondasi Bahasa Go | 37 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 34 | Defer, Panic, dan Recover | Domain 1: Fondasi Bahasa Go | 56 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 35 | Komentar | Domain 1: Fondasi Bahasa Go | 26 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 36 | Struct | Domain 1: Fondasi Bahasa Go | 16 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 37 | Struct Method | Domain 1: Fondasi Bahasa Go | 20 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 38 | Interface | Domain 1: Fondasi Bahasa Go | 43 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 39 | Interface Kosong | Domain 1: Fondasi Bahasa Go | 43 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 40 | Nil | Domain 1: Fondasi Bahasa Go | 51 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 41 | Type Assertions | Domain 1: Fondasi Bahasa Go | 22 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 42 | Pointer & Memory Address | Domain 1: Fondasi Bahasa Go | 41 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 43 | Asterisk Operator (*) | Domain 1: Fondasi Bahasa Go | 28 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 44 | Operator New | Domain 1: Fondasi Bahasa Go | 21 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 45 | Pointer di Function | Domain 1: Fondasi Bahasa Go | 29 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 46 | Pointer di Method | Domain 1: Fondasi Bahasa Go | 36 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 47 | Package dan Import | Domain 1: Fondasi Bahasa Go | 24 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 48 | Access Modifier (Public vs Private) | Domain 1: Fondasi Bahasa Go | 54 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 49 | Package Initialization | Domain 1: Fondasi Bahasa Go | 38 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 50 | Error Interface | Domain 1: Fondasi Bahasa Go | 26 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 51 | Membuat Custom Error | Domain 1: Fondasi Bahasa Go | 19 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 52 | Rangkuman Modul Dasar | Domain 1: Fondasi Bahasa Go | 29 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-1-fondasi-bahasa-go/ |
| 53 | Pengenalan Standard Library | Domain 2: Standard Library | 74 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 54 | Package fmt (Formatting I/O) | Domain 2: Standard Library | 72 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 55 | Package errors | Domain 2: Standard Library | 47 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 56 | Package os | Domain 2: Standard Library | 36 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 57 | Package flag | Domain 2: Standard Library | 37 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 58 | Package strings | Domain 2: Standard Library | 64 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 59 | Package strconv (String Conversions) | Domain 2: Standard Library | 45 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 60 | Package math | Domain 2: Standard Library | 37 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 61 | Package container/list | Domain 2: Standard Library | 21 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 62 | Package container/ring | Domain 2: Standard Library | 19 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 63 | Package sort | Domain 2: Standard Library | 45 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 64 | Package time | Domain 2: Standard Library | 37 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 65 | Package reflect | Domain 2: Standard Library | 33 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 66 | Package regexp | Domain 2: Standard Library | 13 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 67 | Package encoding (Base64 & CSV) | Domain 2: Standard Library | 15 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 68 | Package slices & maps | Domain 2: Standard Library | 25 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 69 | Package path & filepath | Domain 2: Standard Library | 24 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 70 | Package io (Reader & Writer Interfaces) | Domain 2: Standard Library | 32 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 71 | Package bufio | Domain 2: Standard Library | 23 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 72 | File Manipulation | Domain 2: Standard Library | 39 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 73 | Overview Package Lainnya | Domain 2: Standard Library | 43 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 74 | Rangkuman & Langkah Selanjutnya | Domain 2: Standard Library | 64 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-2-standard-library/ |
| 75 | Pengenalan Go-Modules & Semantic Versioning | Domain 3: Go Modules & Dependency | 140 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-3-go-modules-dan-dependency/ |
| 76 | Membuat Module Baru & Inisialisasi | Domain 3: Go Modules & Dependency | 63 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-3-go-modules-dan-dependency/ |
| 77 | Release Module ke Git & GitHub | Domain 3: Go Modules & Dependency | 74 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-3-go-modules-dan-dependency/ |
| 78 | Menambah Dependency Eksternal | Domain 3: Go Modules & Dependency | 48 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-3-go-modules-dan-dependency/ |
| 79 | Upgrade Minor & Patch Release | Domain 3: Go Modules & Dependency | 72 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-3-go-modules-dan-dependency/ |
| 80 | Meng-upgrade & Membersihkan Dependency | Domain 3: Go Modules & Dependency | 58 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-3-go-modules-dan-dependency/ |
| 81 | Pengenalan Generics & Type Parameters | Domain 4: Golang Generics | 91 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-4-golang-generics/ |
| 82 | Generic Functions & Type Inference | Domain 4: Golang Generics | 65 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-4-golang-generics/ |
| 83 | Generic Structs & Data Structures | Domain 4: Golang Generics | 69 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-4-golang-generics/ |
| 84 | Type Sets & Custom Constraints | Domain 4: Golang Generics | 65 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-4-golang-generics/ |
| 85 | Comparable Constraint & Map Keys | Domain 4: Golang Generics | 64 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-4-golang-generics/ |
| 86 | Type Approximation Operator (~) | Domain 4: Golang Generics | 66 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-4-golang-generics/ |
| 87 | Generic Interfaces & Method Constraints | Domain 4: Golang Generics | 65 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-4-golang-generics/ |
| 88 | Package constraints & cmp (Standard Utilities) | Domain 4: Golang Generics | 71 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-4-golang-generics/ |
| 89 | Pengenalan Software Testing & Package testing | Domain 5: Unit Testing & Benchmark | 55 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-5-unit-testing-dan-benchmark/ |
| 90 | Membuat Unit Test Pertama (TestXxx) | Domain 5: Unit Testing & Benchmark | 44 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-5-unit-testing-dan-benchmark/ |
| 91 | Menggagalkan Test (Fail, FailNow, Error, Fatal) | Domain 5: Unit Testing & Benchmark | 31 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-5-unit-testing-dan-benchmark/ |
| 92 | Assertion dengan Testify (assert & require) | Domain 5: Unit Testing & Benchmark | 12 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-5-unit-testing-dan-benchmark/ |
| 93 | Skip Test & TestMain (Setup/Teardown) | Domain 5: Unit Testing & Benchmark | 18 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-5-unit-testing-dan-benchmark/ |
| 94 | Sub Tests (t.Run) | Domain 5: Unit Testing & Benchmark | 18 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-5-unit-testing-dan-benchmark/ |
| 95 | Table-Driven Testing | Domain 5: Unit Testing & Benchmark | 21 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-5-unit-testing-dan-benchmark/ |
| 96 | Mocking Dependencies (testify/mock) | Domain 5: Unit Testing & Benchmark | 22 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-5-unit-testing-dan-benchmark/ |
| 97 | Benchmarking (BenchmarkXxx & b.N) | Domain 5: Unit Testing & Benchmark | 24 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-5-unit-testing-dan-benchmark/ |
| 98 | Sub Benchmark & Table Benchmark | Domain 5: Unit Testing & Benchmark | 17 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-5-unit-testing-dan-benchmark/ |
| 99 | Concurrency vs Parallelism & Go Scheduler | Domain 6: Goroutines & Concurrency | 33 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-6-goroutines-dan-concurrency/ |
| 100 | Membuat Goroutines (keyword go) | Domain 6: Goroutines & Concurrency | 15 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-6-goroutines-dan-concurrency/ |
| 101 | Channels (Kirim & Terima Data antar Goroutine) | Domain 6: Goroutines & Concurrency | 15 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-6-goroutines-dan-concurrency/ |
| 102 | Channel Direction & Buffered Channels | Domain 6: Goroutines & Concurrency | 20 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-6-goroutines-dan-concurrency/ |
| 103 | Range & Close Channel, Select Multiplexing | Domain 6: Goroutines & Concurrency | 20 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-6-goroutines-dan-concurrency/ |
| 104 | Race Condition & Data Race Problem | Domain 6: Goroutines & Concurrency | 20 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-6-goroutines-dan-concurrency/ |
| 105 | sync.Mutex (Mutual Exclusion Lock) | Domain 6: Goroutines & Concurrency | 12 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-6-goroutines-dan-concurrency/ |
| 106 | sync.RWMutex (Reader-Writer Lock) | Domain 6: Goroutines & Concurrency | 9 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-6-goroutines-dan-concurrency/ |
| 107 | sync.WaitGroup (Menunggu Goroutines Selesai) | Domain 6: Goroutines & Concurrency | 12 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-6-goroutines-dan-concurrency/ |
| 108 | sync.Once, sync.Map, & sync/atomic | Domain 6: Goroutines & Concurrency | 18 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-6-goroutines-dan-concurrency/ |
| 109 | Timer, Ticker, & GOMAXPROCS | Domain 6: Goroutines & Concurrency | 16 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-6-goroutines-dan-concurrency/ |
| 110 | Pengenalan Context & Context Tree | Domain 7: Package Context | 17 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-7-package-context/ |
| 111 | context.Background, context.TODO, & WithValue | Domain 7: Package Context | 7 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-7-package-context/ |
| 112 | context.WithCancel (Sinyal Pembatalan Manual) | Domain 7: Package Context | 13 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-7-package-context/ |
| 113 | context.WithTimeout & WithDeadline | Domain 7: Package Context | 16 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-7-package-context/ |
| 114 | Goroutine Leak Prevention & Best Practices | Domain 7: Package Context | 34 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-7-package-context/ |
| 115 | Iterator & range-over-func (Go 1.23) | Domain 8: Go Modern (1.21 - 1.26) | 443 | https://kodeloka.asadinedu.com/golang/materi/domain-8-go-modern-1-21-1-26/ |
| 116 | Paket slices, maps & cmp | Domain 8: Go Modern (1.21 - 1.26) | 479 | https://kodeloka.asadinedu.com/golang/materi/domain-8-go-modern-1-21-1-26/ |
| 117 | errgroup & Concurrency Terstruktur | Domain 8: Go Modern (1.21 - 1.26) | 587 | https://kodeloka.asadinedu.com/golang/materi/domain-8-go-modern-1-21-1-26/ |
| 118 | Fuzzing & testing/synctest | Domain 8: Go Modern (1.21 - 1.26) | 690 | https://kodeloka.asadinedu.com/golang/materi/domain-8-go-modern-1-21-1-26/ |
| 119 | Pengenalan Package encoding/json | Domain 9: Golang JSON | 43 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-9-golang-json/ |
| 120 | Encode JSON (json.Marshal) | Domain 9: Golang JSON | 13 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-9-golang-json/ |
| 121 | JSON Objects & Struct Mapping | Domain 9: Golang JSON | 46 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-9-golang-json/ |
| 122 | Decode JSON (json.Unmarshal) | Domain 9: Golang JSON | 19 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-9-golang-json/ |
| 123 | JSON Array & Slices Mapping | Domain 9: Golang JSON | 13 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-9-golang-json/ |
| 124 | Custom JSON Tags (json:"name,omitempty") | Domain 9: Golang JSON | 39 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-9-golang-json/ |
| 125 | Dynamic JSON Mapping dengan map[string]interface{} | Domain 9: Golang JSON | 20 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-9-golang-json/ |
| 126 | Streaming JSON Decoder (json.NewDecoder) | Domain 9: Golang JSON | 27 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-9-golang-json/ |
| 127 | Streaming JSON Encoder (json.NewEncoder) | Domain 9: Golang JSON | 19 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-9-golang-json/ |
| 128 | Pengenalan Logging & Package Logrus | Domain 10: Golang Logging | 123 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-10-golang-logging/ |
| 129 | Level Logging (Trace, Debug, Info, Warn, Error, Fatal, Panic) | Domain 10: Golang Logging | 91 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-10-golang-logging/ |
| 130 | Output Logging (File & Multi-Writer) | Domain 10: Golang Logging | 68 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-10-golang-logging/ |
| 131 | Log Formatter (TextFormatter vs JSONFormatter) | Domain 10: Golang Logging | 63 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-10-golang-logging/ |
| 132 | Fields & Entry (Contextual Logging dengan WithField/WithFields) | Domain 10: Golang Logging | 63 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-10-golang-logging/ |
| 133 | Logger Singleton vs Instance Kustom | Domain 10: Golang Logging | 67 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-10-golang-logging/ |
| 134 | Logrus Hook (Mengirim Log ke System External) | Domain 10: Golang Logging | 78 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-10-golang-logging/ |
| 135 | Standard Library log/slog (Structured Logging Bawaan Go 1.21+) | Domain 10: Golang Logging | 81 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-10-golang-logging/ |
| 136 | Pengenalan Package Embed & Directive //go:embed | Domain 11: Golang Embed | 110 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-11-golang-embed/ |
| 137 | Embed File ke Variable String | Domain 11: Golang Embed | 55 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-11-golang-embed/ |
| 138 | Embed File ke Variable Byte Slice ([]byte) | Domain 11: Golang Embed | 50 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-11-golang-embed/ |
| 139 | Embed Multiple Files dengan embed.FS | Domain 11: Golang Embed | 39 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-11-golang-embed/ |
| 140 | Path Matcher & Wildcard Pattern pada //go:embed | Domain 11: Golang Embed | 51 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-11-golang-embed/ |
| 141 | Hasil Embed pada Process Compile & Single Binary Deployment | Domain 11: Golang Embed | 54 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-11-golang-embed/ |
| 142 | Pengenalan Configuration Management & Package spf13/viper | Domain 12: Golang Viper Configuration | 75 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-12-golang-viper-configuration/ |
| 143 | Membaca File Konfigurasi (JSON, YAML, ENV file) | Domain 12: Golang Viper Configuration | 75 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-12-golang-viper-configuration/ |
| 144 | Mengambil Nilai Konfigurasi (GetString, GetInt, GetBool, GetStringSlice) | Domain 12: Golang Viper Configuration | 43 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-12-golang-viper-configuration/ |
| 145 | Unmarshaling Config ke Struct (viper.Unmarshal) | Domain 12: Golang Viper Configuration | 68 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-12-golang-viper-configuration/ |
| 146 | Environment Variables Integration (AutomaticEnv, BindEnv, SetEnvPrefix) | Domain 12: Golang Viper Configuration | 70 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-12-golang-viper-configuration/ |
| 147 | Dynamic Config Watching & Hot Reload (viper.WatchConfig) | Domain 12: Golang Viper Configuration | 52 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-12-golang-viper-configuration/ |
| 148 | Command Line Flags Integration dengan Cobra/Pflag | Domain 12: Golang Viper Configuration | 51 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-12-golang-viper-configuration/ |
| 149 | Studi Kasus: App Config Provider Centralized Singleton | Domain 12: Golang Viper Configuration | 59 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-12-golang-viper-configuration/ |
| 150 | Pengenalan Data Validation & Library go-playground/validator | Domain 13: Golang Validation | 96 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-13-golang-validation/ |
| 151 | Validasi Field Dasar (Required, Email, Min/Max, Numeric) | Domain 13: Golang Validation | 107 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-13-golang-validation/ |
| 152 | Validasi Struct & Nested Struct Validation | Domain 13: Golang Validation | 103 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-13-golang-validation/ |
| 153 | Custom Validation Function & Registration | Domain 13: Golang Validation | 61 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-13-golang-validation/ |
| 154 | Cross-Field & Struct Level Validation | Domain 13: Golang Validation | 71 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-13-golang-validation/ |
| 155 | Alias Tag & Custom Error Messages (Translation) | Domain 13: Golang Validation | 54 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-13-golang-validation/ |
| 156 | Handling & Formatting Validation Errors | Domain 13: Golang Validation | 58 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-13-golang-validation/ |
| 157 | Studi Kasus: RESTful API DTO Request Validation Pipeline | Domain 13: Golang Validation | 60 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-13-golang-validation/ |
| 158 | Konsep Dependency Injection & Loose Coupling | Domain 14: Golang Dependency Injection | 97 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-14-golang-dependency-injection/ |
| 159 | Pengenalan Google Wire (Compile-Time DI Generator) | Domain 14: Golang Dependency Injection | 81 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-14-golang-dependency-injection/ |
| 160 | Provider & Constructor Function Pattern | Domain 14: Golang Dependency Injection | 67 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-14-golang-dependency-injection/ |
| 161 | Injector Function & File wire.go | Domain 14: Golang Dependency Injection | 67 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-14-golang-dependency-injection/ |
| 162 | Interface Binding dengan wire.Bind | Domain 14: Golang Dependency Injection | 47 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-14-golang-dependency-injection/ |
| 163 | Provider Sets (wire.NewSet) | Domain 14: Golang Dependency Injection | 54 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-14-golang-dependency-injection/ |
| 164 | Struct Provider & Property Injection (wire.Struct) | Domain 14: Golang Dependency Injection | 55 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-14-golang-dependency-injection/ |
| 165 | Cleanup Functions & Error Handling di Wire | Domain 14: Golang Dependency Injection | 79 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-14-golang-dependency-injection/ |
| 166 | Pengenalan Package database/sql & Driver | Domain 15: Database & MySQL | 13 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-15-database-dan-mysql/ |
| 167 | Koneksi Database & Connection Pool | Domain 15: Database & MySQL | 13 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-15-database-dan-mysql/ |
| 168 | Eksekusi SQL Write (db.ExecContext) | Domain 15: Database & MySQL | 11 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-15-database-dan-mysql/ |
| 169 | Membaca Data (QueryContext & QueryRowContext) | Domain 15: Database & MySQL | 14 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-15-database-dan-mysql/ |
| 170 | SQL Injection & Parameterized Queries | Domain 15: Database & MySQL | 20 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-15-database-dan-mysql/ |
| 171 | Database Transactions (BeginTx, Commit, Rollback) | Domain 15: Database & MySQL | 20 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-15-database-dan-mysql/ |
| 172 | Prepared Statements & Nullable Columns | Domain 15: Database & MySQL | 13 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-15-database-dan-mysql/ |
| 173 | Repository Pattern & Clean Architecture | Domain 15: Database & MySQL | 16 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-15-database-dan-mysql/ |
| 174 | Pengenalan Database Migration & Golang Migrate Tool | Domain 16: Golang Database Migration | 91 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-16-golang-database-migration/ |
| 175 | Anatomi File Migration (.up.sql dan .down.sql) | Domain 16: Golang Database Migration | 58 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-16-golang-database-migration/ |
| 176 | Perintah CLI golang-migrate (up, down, version, force) | Domain 16: Golang Database Migration | 75 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-16-golang-database-migration/ |
| 177 | Managing Dirty State Migration & Handling Failed Migration | Domain 16: Golang Database Migration | 81 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-16-golang-database-migration/ |
| 178 | Programmatic Database Migration (Running Migration via Go Code) | Domain 16: Golang Database Migration | 73 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-16-golang-database-migration/ |
| 179 | Strategi Rollback & Schema Versioning Best Practices | Domain 16: Golang Database Migration | 82 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-16-golang-database-migration/ |
| 180 | Integration Database Migration dengan Driver MySQL/PostgreSQL | Domain 16: Golang Database Migration | 52 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-16-golang-database-migration/ |
| 181 | Pengenalan GORM & DB Connection Setup | Domain 17: Golang GORM ORM Framework | 90 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-17-golang-gorm-orm-framework/ |
| 182 | Defining GORM Models, Struct Tags & AutoMigrate | Domain 17: Golang GORM ORM Framework | 56 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-17-golang-gorm-orm-framework/ |
| 183 | CRUD Basic Operations: Insert & Single Record Creation | Domain 17: Golang GORM ORM Framework | 62 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-17-golang-gorm-orm-framework/ |
| 184 | Querying Records (First, Find, Where, Like, Order, Limit) | Domain 17: Golang GORM ORM Framework | 75 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-17-golang-gorm-orm-framework/ |
| 185 | Updates & Deletions (Save, Updates, Delete, Soft Delete) | Domain 17: Golang GORM ORM Framework | 76 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-17-golang-gorm-orm-framework/ |
| 186 | GORM Relationships: Belongs To & Has One | Domain 17: Golang GORM ORM Framework | 73 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-17-golang-gorm-orm-framework/ |
| 187 | GORM Relationships: Has Many & Many to Many | Domain 17: Golang GORM ORM Framework | 76 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-17-golang-gorm-orm-framework/ |
| 188 | GORM Transactions & Hooks (Callbacks) | Domain 17: Golang GORM ORM Framework | 79 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-17-golang-gorm-orm-framework/ |
| 189 | Advanced GORM: Raw SQL, Exec & Scopes | Domain 17: Golang GORM ORM Framework | 69 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-17-golang-gorm-orm-framework/ |
| 190 | pgx - Driver PostgreSQL Berkinerja Tinggi | Domain 18: Database Go Modern | 800 | https://kodeloka.asadinedu.com/golang/materi/domain-18-database-go-modern/ |
| 191 | sqlc - SQL Aman Tipe Tanpa ORM | Domain 18: Database Go Modern | 731 | https://kodeloka.asadinedu.com/golang/materi/domain-18-database-go-modern/ |
| 192 | Pengenalan Redis & Driver go-redis/v9 di Golang | Domain 19: Golang Redis Client | 109 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-19-golang-redis-client/ |
| 193 | String Operations (Set, Get, SetEX, MGet, MSet, Del) | Domain 19: Golang Redis Client | 71 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-19-golang-redis-client/ |
| 194 | Expiration & TTL Management (Expire, TTL, Persist) | Domain 19: Golang Redis Client | 55 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-19-golang-redis-client/ |
| 195 | Hash Data Structure (HSet, HGet, HGetAll, HDel) | Domain 19: Golang Redis Client | 72 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-19-golang-redis-client/ |
| 196 | List & Set Data Structures (LPush, RPop, SAdd, SMembers) | Domain 19: Golang Redis Client | 60 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-19-golang-redis-client/ |
| 197 | Sorted Set (ZAdd, ZRange, ZScore) & Leaderboard System | Domain 19: Golang Redis Client | 69 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-19-golang-redis-client/ |
| 198 | Redis Pub/Sub (Publish, Subscribe, Channel) | Domain 19: Golang Redis Client | 63 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-19-golang-redis-client/ |
| 199 | Redis Pipelines & Transactions (Multi/Exec) | Domain 19: Golang Redis Client | 60 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-19-golang-redis-client/ |
| 200 | Studi Kasus: High Performance HTTP Cache Strategy & Rate Limiter dengan Redis | Domain 19: Golang Redis Client | 64 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-19-golang-redis-client/ |
| 201 | Arsitektur Web (Client & Server) & Package net/http | Domain 20: Golang Web Development | 49 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 202 | HTTP Server & http.ListenAndServe | Domain 20: Golang Web Development | 25 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 203 | Handler & http.HandlerFunc | Domain 20: Golang Web Development | 33 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 204 | Multi-Routing dengan http.ServeMux | Domain 20: Golang Web Development | 30 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 205 | Handling HTTP Request & Method Inspecting | Domain 20: Golang Web Development | 22 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 206 | Testing Web Handler dengan Package httptest | Domain 20: Golang Web Development | 27 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 207 | Query Parameter & Multi-Value Query Params | Domain 20: Golang Web Development | 25 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 208 | Reading & Writing HTTP Headers | Domain 20: Golang Web Development | 20 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 209 | Parsing Form Post (URL Encoded & Form Data) | Domain 20: Golang Web Development | 23 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 210 | Setting HTTP Response Status Code (w.WriteHeader) | Domain 20: Golang Web Development | 26 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 211 | Managing HTTP Cookies (http.Cookie) | Domain 20: Golang Web Development | 24 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 212 | Serving Static Files dengan http.FileServer & http.ServeFile | Domain 20: Golang Web Development | 20 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 213 | HTML Templating Dasar (html/template) | Domain 20: Golang Web Development | 26 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 214 | Passing Dynamic Data ke Template (Struct, Map, Dynamic Field) | Domain 20: Golang Web Development | 30 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 215 | Template Actions (if, else, range, with) | Domain 20: Golang Web Development | 19 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 216 | Template Layout & Reusable Partials | Domain 20: Golang Web Development | 14 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 217 | Custom Template Functions | Domain 20: Golang Web Development | 16 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 218 | Template Caching & Performance Optimization | Domain 20: Golang Web Development | 36 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 219 | Keamanan Web: Mencegah XSS (Cross-Site Scripting) | Domain 20: Golang Web Development | 32 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 220 | HTTP Redirects (http.Redirect) | Domain 20: Golang Web Development | 23 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 221 | Handling File Upload (r.FormFile) | Domain 20: Golang Web Development | 30 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 222 | Download File Header (Content-Disposition) | Domain 20: Golang Web Development | 20 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 223 | Web Middleware Pattern | Domain 20: Golang Web Development | 32 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-20-golang-web-development/ |
| 224 | Pengenalan Library julienschmidt/httprouter | Domain 21: Golang HTTP Router | 29 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-21-golang-http-router/ |
| 225 | Routing Method Spesifik & Handler (GET, POST, PUT, DELETE) | Domain 21: Golang HTTP Router | 12 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-21-golang-http-router/ |
| 226 | Named Path Parameters (:param) | Domain 21: Golang HTTP Router | 18 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-21-golang-http-router/ |
| 227 | Catch-All Path Parameters (*filepath) | Domain 21: Golang HTTP Router | 18 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-21-golang-http-router/ |
| 228 | Serving Static Files pada HttpRouter | Domain 21: Golang HTTP Router | 12 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-21-golang-http-router/ |
| 229 | Custom Panic Handler (router.PanicHandler) | Domain 21: Golang HTTP Router | 18 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-21-golang-http-router/ |
| 230 | Custom Not Found Handler (router.NotFound) | Domain 21: Golang HTTP Router | 16 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-21-golang-http-router/ |
| 231 | Custom Method Not Allowed Handler (router.MethodNotAllowed) | Domain 21: Golang HTTP Router | 17 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-21-golang-http-router/ |
| 232 | Integration HttpRouter dengan Standard Middleware | Domain 21: Golang HTTP Router | 37 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-21-golang-http-router/ |
| 233 | Arsitektur Clean RESTful API (Entity, Repository, Service, Controller, Router) | Domain 22: Golang RESTful API | 77 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-22-golang-restful-api/ |
| 234 | Model Entity & Data Transfer Object (Request & Response DTO) | Domain 22: Golang RESTful API | 51 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-22-golang-restful-api/ |
| 235 | Repository Layer & Database CRUD Operations | Domain 22: Golang RESTful API | 59 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-22-golang-restful-api/ |
| 236 | Helper Transaksi Database (sql.Tx) Automatis | Domain 22: Golang RESTful API | 50 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-22-golang-restful-api/ |
| 237 | Service Layer & Input Validation (go-playground/validator) | Domain 22: Golang RESTful API | 40 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-22-golang-restful-api/ |
| 238 | Controller / Handler Layer & JSON Serialization | Domain 22: Golang RESTful API | 39 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-22-golang-restful-api/ |
| 239 | Centralized Error Handling & Panic Recovery Middleware | Domain 22: Golang RESTful API | 56 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-22-golang-restful-api/ |
| 240 | HTTP Routing & Param Handling (julienschmidt/httprouter) | Domain 22: Golang RESTful API | 38 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-22-golang-restful-api/ |
| 241 | Dependency Injection Assembly di Main Application | Domain 22: Golang RESTful API | 51 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-22-golang-restful-api/ |
| 242 | Integration Test RESTful API (net/http/httptest) | Domain 22: Golang RESTful API | 66 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-22-golang-restful-api/ |
| 243 | Pengenalan Fiber Framework & Fasthttp Engine | Domain 23: Golang Fiber Web Framework | 72 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-23-golang-fiber-web-framework/ |
| 244 | Inisialisasi App & Routing Dasar (GET, POST, PUT, DELETE) | Domain 23: Golang Fiber Web Framework | 58 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-23-golang-fiber-web-framework/ |
| 245 | Fiber Context (fiber.Ctx) & Request Handling | Domain 23: Golang Fiber Web Framework | 44 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-23-golang-fiber-web-framework/ |
| 246 | Response Formatting & Status Codes (JSON, HTML, SendFile, SendStatus) | Domain 23: Golang Fiber Web Framework | 49 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-23-golang-fiber-web-framework/ |
| 247 | Fiber Middleware (Logger, Recover, CORS, Limiter) | Domain 23: Golang Fiber Web Framework | 58 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-23-golang-fiber-web-framework/ |
| 248 | Grouping Router & Versioning API | Domain 23: Golang Fiber Web Framework | 50 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-23-golang-fiber-web-framework/ |
| 249 | Fiber Error Handling & Custom Error Handler | Domain 23: Golang Fiber Web Framework | 62 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-23-golang-fiber-web-framework/ |
| 250 | Template Engine (HTML Render) & Static File Serving | Domain 23: Golang Fiber Web Framework | 63 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-23-golang-fiber-web-framework/ |
| 251 | Studi Kasus: RESTful API CRUD Produk dengan Fiber & In-Memory Storage | Domain 23: Golang Fiber Web Framework | 52 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-23-golang-fiber-web-framework/ |
| 252 | Pengenalan gRPC & Protobuf di Go | Domain 24: gRPC & Protocol Buffers | 698 | https://kodeloka.asadinedu.com/golang/materi/domain-24-grpc-dan-protocol-buffers/ |
| 253 | gRPC Streaming, Interceptor & Produksi | Domain 24: gRPC & Protocol Buffers | 789 | https://kodeloka.asadinedu.com/golang/materi/domain-24-grpc-dan-protocol-buffers/ |
| 254 | OpenTelemetry di Go - Trace & Metrik | Domain 25: Observability Go | 689 | https://kodeloka.asadinedu.com/golang/materi/domain-25-observability-go/ |
| 255 | Structured Logging Produksi dengan slog | Domain 25: Observability Go | 761 | https://kodeloka.asadinedu.com/golang/materi/domain-25-observability-go/ |
| 256 | Instalasi Go di Windows (PC Baru) | Domain 26: Deployment & Production Go | 248 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-26-deployment-dan-production-go/ |
| 257 | Instalasi Go di Linux / Ubuntu | Domain 26: Deployment & Production Go | 245 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-26-deployment-dan-production-go/ |
| 258 | Menjalankan Go App di VPS / Ubuntu Server | Domain 26: Deployment & Production Go | 220 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-26-deployment-dan-production-go/ |
| 259 | Deploy Go dengan systemd Service | Domain 26: Deployment & Production Go | 209 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-26-deployment-dan-production-go/ |
| 260 | Dockerize Aplikasi Go — Dockerfile Dasar | Domain 26: Deployment & Production Go | 245 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-26-deployment-dan-production-go/ |
| 261 | Multi-Stage Docker Build untuk Go | Domain 26: Deployment & Production Go | 269 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-26-deployment-dan-production-go/ |
| 262 | Docker Compose untuk Go App | Domain 26: Deployment & Production Go | 223 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-26-deployment-dan-production-go/ |
| 263 | Nginx sebagai Reverse Proxy untuk Go | Domain 26: Deployment & Production Go | 260 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-26-deployment-dan-production-go/ |
| 264 | CI/CD Dasar untuk Go dengan GitHub Actions | Domain 26: Deployment & Production Go | 329 | https://kodeloka.asadinedu.com/golang/materi/domain-26-deployment-dan-production-go/ |
| 265 | Mini Project: REST API CRUD Server | Domain 27: Mini Project Go | 177 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-27-mini-project-go/ |
| 266 | Mini Project: CLI Tool dengan Flag & Args | Domain 27: Mini Project Go | 201 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-27-mini-project-go/ |
| 267 | Mini Project: Simple File-based Task Manager | Domain 27: Mini Project Go | 171 **tipis** | https://kodeloka.asadinedu.com/golang/materi/domain-27-mini-project-go/ |

## FastAPI (`fastapi/`, 24 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Getting Started - Web App + REST API | Dasar & Frontend | 271 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/01-getting-started-web-app-rest-api/ |
| 2 | HTML Frontend & Jinja2 Templates | Dasar & Frontend | 170 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/02-html-frontend-dan-jinja2-templates/ |
| 3 | Path Parameters & Type Hints | Dasar & Frontend | 152 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/03-path-parameters-dan-type-hints/ |
| 4 | Query Parameters & Optional Values | Data & Models | 103 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/04-query-parameters-dan-optional-values/ |
| 5 | Request Body & Pydantic Schemas | Data & Models | 101 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/05-request-body-dan-pydantic-schemas/ |
| 6 | Form Data & Asynchronous File Uploads | Data & Models | 97 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/06-form-data-dan-asynchronous-file-uploads/ |
| 7 | Response Models & Error Handling | Data & Models | 46 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/07-response-models-dan-error-handling/ |
| 8 | Adding a Database (SQLAlchemy Setup & Session) | Database & Auth | 53 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/08-adding-a-database-sqlalchemy-setup-dan-session/ |
| 9 | Database Models, Relationships & CRUD | Database & Auth | 44 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/09-database-models-relationships-dan-crud/ |
| 10 | Database Migrations dengan Alembic | Database & Auth | 44 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/10-database-migrations-dengan-alembic/ |
| 11 | Dependency Injection System (Depends) | Database & Auth | 40 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/11-dependency-injection-system-depends/ |
| 12 | Password Hashing & Security dengan pwdlib (Argon2) | Database & Auth | 173 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/12-password-hashing-dan-security-dengan-pwdlib-argon2/ |
| 13 | User Registration & Login Flow | Database & Auth | 49 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/13-user-registration-dan-login-flow/ |
| 14 | Authentication & Authorization dengan JWT Tokens | Database & Auth | 40 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/14-authentication-dan-authorization-dengan-jwt-tokens/ |
| 15 | APIRouter & Project Modular Structuring | Advanced & Deploy | 42 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/15-apirouter-dan-project-modular-structuring/ |
| 16 | Lifespan Events & Manajemen Sumber Daya Aplikasi | Advanced & Deploy | 500 | https://kodeloka.asadinedu.com/fastapi/materi/16-lifespan-events-dan-manajemen-sumber-daya-aplikasi/ |
| 17 | Middleware & CORS Configuration | Advanced & Deploy | 39 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/17-middleware-dan-cors-configuration/ |
| 18 | Rate Limiting & Perlindungan API | Advanced & Deploy | 669 | https://kodeloka.asadinedu.com/fastapi/materi/18-rate-limiting-dan-perlindungan-api/ |
| 19 | Background Tasks & Asynchronous Workers | Advanced & Deploy | 43 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/19-background-tasks-dan-asynchronous-workers/ |
| 20 | Celery, Redis Queue & Pekerjaan Latar Belakang | Advanced & Deploy | 776 | https://kodeloka.asadinedu.com/fastapi/materi/20-celery-redis-queue-dan-pekerjaan-latar-belakang/ |
| 21 | WebSocket & Komunikasi Real-time | Advanced & Deploy | 724 | https://kodeloka.asadinedu.com/fastapi/materi/21-websocket-dan-komunikasi-real-time/ |
| 22 | Automated Testing dengan Pytest & TestClient | Advanced & Deploy | 48 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/22-automated-testing-dengan-pytest-dan-testclient/ |
| 23 | File Storage & AWS S3 Integration | Advanced & Deploy | 51 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/23-file-storage-dan-aws-s3-integration/ |
| 24 | Docker Containerization & Production Deployment | Advanced & Deploy | 42 **tipis** | https://kodeloka.asadinedu.com/fastapi/materi/24-docker-containerization-dan-production-deployment/ |

## Next.js (`next/`, 23 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Pengenalan Next.js 16 & Ecosystem Overview | Dasar | 290 **tipis** | https://kodeloka.asadinedu.com/next/materi/01-pengenalan-next-js-16-dan-ecosystem-overview/ |
| 2 | Inisialisasi Proyek & Struktur Direktori App Router | Dasar | 143 **tipis** | https://kodeloka.asadinedu.com/next/materi/02-inisialisasi-proyek-dan-struktur-direktori-app-router/ |
| 3 | Server Components vs Client Components di Next.js 16 | Dasar | 156 **tipis** | https://kodeloka.asadinedu.com/next/materi/03-server-components-vs-client-components-di-next-js-16/ |
| 4 | Styling dengan Tailwind CSS v4 & Shadcn UI | Dasar | 56 **tipis** | https://kodeloka.asadinedu.com/next/materi/04-styling-dengan-tailwind-css-v4-dan-shadcn-ui/ |
| 5 | File-Based Routing: Static, Dynamic & Catch-All Routes | Routing & Layout | 132 **tipis** | https://kodeloka.asadinedu.com/next/materi/05-file-based-routing-static-dynamic-dan-catch-all-routes/ |
| 6 | Layouts, Templates, & Component Composition | Routing & Layout | 129 **tipis** | https://kodeloka.asadinedu.com/next/materi/06-layouts-templates-dan-component-composition/ |
| 7 | Special Files: loading.tsx, error.tsx, & not-found.tsx | Routing & Layout | 166 **tipis** | https://kodeloka.asadinedu.com/next/materi/07-special-files-loading-tsx-error-tsx-dan-not-found-tsx/ |
| 8 | Metadata API, OpenGraph & Dynamic SEO | Routing & Layout | 118 **tipis** | https://kodeloka.asadinedu.com/next/materi/08-metadata-api-opengraph-dan-dynamic-seo/ |
| 9 | Data Fetching & Caching Strategy di Next.js 16 | Data & Caching | 103 **tipis** | https://kodeloka.asadinedu.com/next/materi/09-data-fetching-dan-caching-strategy-di-next-js-16/ |
| 10 | Server Actions & Form Handling ('use server') | Data & Caching | 140 **tipis** | https://kodeloka.asadinedu.com/next/materi/10-server-actions-dan-form-handling-use-server/ |
| 11 | Revalidation & Dynamic Data Tagging (revalidatePath & revalidateTag) | Data & Caching | 70 **tipis** | https://kodeloka.asadinedu.com/next/materi/11-revalidation-dan-dynamic-data-tagging-revalidatepath-dan-revalidatetag/ |
| 12 | Cache Components & Direktif 'use cache' | Data & Caching | 589 | https://kodeloka.asadinedu.com/next/materi/12-cache-components-dan-direktif-use-cache/ |
| 13 | Partial Prerendering & Streaming | Data & Caching | 612 | https://kodeloka.asadinedu.com/next/materi/13-partial-prerendering-dan-streaming/ |
| 14 | State Management & Advanced React 19 Hooks (useOptimistic, useActionState) | Data & Caching | 62 **tipis** | https://kodeloka.asadinedu.com/next/materi/14-state-management-dan-advanced-react-19-hooks-useoptimistic-useactionstat/ |
| 15 | API Routes & Route Handlers (app/api/route.ts) | Backend & API | 142 **tipis** | https://kodeloka.asadinedu.com/next/materi/15-api-routes-dan-route-handlers-app-api-route-ts/ |
| 16 | Middleware, Security & Authentication Flow | Backend & API | 124 **tipis** | https://kodeloka.asadinedu.com/next/materi/16-middleware-security-dan-authentication-flow/ |
| 17 | proxy.ts, after() & Migrasi ke Next.js 16 | Backend & API | 630 | https://kodeloka.asadinedu.com/next/materi/17-proxy-ts-after-dan-migrasi-ke-next-js-16/ |
| 18 | Database Integration dengan Prisma & PostgreSQL | Backend & API | 102 **tipis** | https://kodeloka.asadinedu.com/next/materi/18-database-integration-dengan-prisma-dan-postgresql/ |
| 19 | Security Best Practices & Environment Variables Protection | Backend & API | 61 **tipis** | https://kodeloka.asadinedu.com/next/materi/19-security-best-practices-dan-environment-variables-protection/ |
| 20 | Optimasi Media: Image, Font, Script & Dynamic Imports | Optimization & Deploy | 105 **tipis** | https://kodeloka.asadinedu.com/next/materi/20-optimasi-media-image-font-script-dan-dynamic-imports/ |
| 21 | Analytics, PostHog & Monitoring Real-time | Optimization & Deploy | 47 **tipis** | https://kodeloka.asadinedu.com/next/materi/21-analytics-posthog-dan-monitoring-real-time/ |
| 22 | Testing Next.js 16: Unit Testing & E2E dengan Playwright | Optimization & Deploy | 46 **tipis** | https://kodeloka.asadinedu.com/next/materi/22-testing-next-js-16-unit-testing-dan-e2e-dengan-playwright/ |
| 23 | Build, Dockerization & Production Deployment di Vercel | Optimization & Deploy | 117 **tipis** | https://kodeloka.asadinedu.com/next/materi/23-build-dockerization-dan-production-deployment-di-vercel/ |

## Microservices (`microservices/`, 24 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Belajar Microservices - Intro | Konsep Dasar | 200 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/01-belajar-microservices-intro/ |
| 2 | Belajar Microservices - Arsitektur Monolith | Arsitektur | 175 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/02-belajar-microservices-arsitektur-monolith/ |
| 3 | Belajar Microservices - Arsitektur Microservices | Arsitektur | 175 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/03-belajar-microservices-arsitektur-microservices/ |
| 4 | Belajar Microservices - Type of Microservices | Arsitektur | 114 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/04-belajar-microservices-type-of-microservices/ |
| 5 | Belajar Microservices - Database per Service | Data Pattern | 138 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/05-belajar-microservices-database-per-service/ |
| 6 | Belajar Microservices - Shared Database | Data Pattern | 125 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/06-belajar-microservices-shared-database/ |
| 7 | Belajar Microservices - NoSQL Database | Data Pattern | 126 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/07-belajar-microservices-nosql-database/ |
| 8 | Belajar Microservices - Remote Procedure Invocation | Komunikasi | 139 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/08-belajar-microservices-remote-procedure-invocation/ |
| 9 | Belajar Microservices - Asynchronous Messaging | Komunikasi | 144 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/09-belajar-microservices-asynchronous-messaging/ |
| 10 | Belajar Microservices - Service Orchestration | Orkestrasi | 141 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/10-belajar-microservices-service-orchestration/ |
| 11 | Belajar Microservices - Service Choreography | Orkestrasi | 129 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/11-belajar-microservices-service-choreography/ |
| 12 | Saga Pattern & Transaksi Terdistribusi | Orkestrasi | 925 | https://kodeloka.asadinedu.com/microservices/materi/12-saga-pattern-dan-transaksi-terdistribusi/ |
| 13 | Belajar Microservices - API Gateway Pattern | Gateway & Routing | 174 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/13-belajar-microservices-api-gateway-pattern/ |
| 14 | Belajar Microservices - Backend for Frontend (BFF) | Gateway & Routing | 155 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/14-belajar-microservices-backend-for-frontend-bff/ |
| 15 | Belajar Microservices - Authentication & Authorization | Keamanan | 156 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/15-belajar-microservices-authentication-dan-authorization/ |
| 16 | Belajar Microservices - CQRS Pattern | Advanced Pattern | 133 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/16-belajar-microservices-cqrs-pattern/ |
| 17 | Resilience Pattern - Circuit Breaker, Retry, Timeout & Bulkhead | Keandalan | 1019 | https://kodeloka.asadinedu.com/microservices/materi/17-resilience-pattern-circuit-breaker-retry-timeout-dan-bulkhead/ |
| 18 | Distributed Tracing & Observability | Keandalan | 897 | https://kodeloka.asadinedu.com/microservices/materi/18-distributed-tracing-dan-observability/ |
| 19 | Contract Testing & Strategi Pengujian Microservices | Keandalan | 807 | https://kodeloka.asadinedu.com/microservices/materi/19-contract-testing-dan-strategi-pengujian-microservices/ |
| 20 | Belajar Microservices - Server Side Discovery | Infrastructure | 102 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/20-belajar-microservices-server-side-discovery/ |
| 21 | Belajar Microservices - Client Side Discovery | Infrastructure | 96 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/21-belajar-microservices-client-side-discovery/ |
| 22 | Belajar Microservices - Service Registry | Infrastructure | 141 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/22-belajar-microservices-service-registry/ |
| 23 | Belajar Microservices - Centralized Configuration | Infrastructure | 122 **tipis** | https://kodeloka.asadinedu.com/microservices/materi/23-belajar-microservices-centralized-configuration/ |
| 24 | Service Mesh & Deployment ke Kubernetes | Infrastructure | 973 | https://kodeloka.asadinedu.com/microservices/materi/24-service-mesh-dan-deployment-ke-kubernetes/ |

## HTML (`html/`, 27 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Cara Web Bekerja: Dari Ketikan URL hingga Piksel di Layar | 1 · Fondasi | 1094 | https://kodeloka.asadinedu.com/html/materi/01-cara-web-bekerja-dari-ketikan-url-hingga-piksel-di-layar/ |
| 2 | Anatomi URL, MIME Type (Content-Type), dan Content Negotiation | 1 · Fondasi | 467 | https://kodeloka.asadinedu.com/html/materi/02-anatomi-url-mime-type-content-type-dan-content-negotiation/ |
| 3 | Struktur Dokumen HTML Modern dan Atribut Global | 1 · Fondasi | 1163 | https://kodeloka.asadinedu.com/html/materi/03-struktur-dokumen-html-modern-dan-atribut-global/ |
| 4 | Teks dan Tipografi Semantik: Memberi Makna pada Konten | 1 · Fondasi | 975 | https://kodeloka.asadinedu.com/html/materi/04-teks-dan-tipografi-semantik-memberi-makna-pada-konten/ |
| 5 | Melacak Perubahan Teks (ins, del, s) dan Semantik Editorial | 1 · Fondasi | 424 | https://kodeloka.asadinedu.com/html/materi/05-melacak-perubahan-teks-ins-del-s-dan-semantik-editorial/ |
| 6 | Elemen Teks Teknis Lanjutan: data, wbr, bdo, dan pre Aksesibel | 1 · Fondasi | 446 | https://kodeloka.asadinedu.com/html/materi/06-elemen-teks-teknis-lanjutan-data-wbr-bdo-dan-pre-aksesibel/ |
| 7 | Struktur Tata Letak Semantik dan Landmark Dokumen | 1 · Fondasi | 1007 | https://kodeloka.asadinedu.com/html/materi/07-struktur-tata-letak-semantik-dan-landmark-dokumen/ |
| 8 | Tautan, Struktur URL, dan Navigasi yang Aman | 1 · Fondasi | 901 | https://kodeloka.asadinedu.com/html/materi/08-tautan-struktur-url-dan-navigasi-yang-aman/ |
| 9 | Gambar, Media Responsif, Audio, dan Video | 2 · Media & Tabel | 1014 | https://kodeloka.asadinedu.com/html/materi/09-gambar-media-responsif-audio-dan-video/ |
| 10 | Grafik Vektor (svg) Inline dan Pengantar canvas | 2 · Media & Tabel | 854 | https://kodeloka.asadinedu.com/html/materi/10-grafik-vektor-svg-inline-dan-pengantar-canvas/ |
| 11 | Peta Gambar (map & area) dan Elemen Penyematan (object, embed) | 2 · Media & Tabel | 376 | https://kodeloka.asadinedu.com/html/materi/11-peta-gambar-map-dan-area-dan-elemen-penyematan-object-embed/ |
| 12 | Elemen audio dan Subtitel/Transkrip track (WebVTT) untuk Aksesibilitas Media | 2 · Media & Tabel | 212 **tipis** | https://kodeloka.asadinedu.com/html/materi/12-elemen-audio-dan-subtitel-transkrip-track-webvtt-untuk-aksesibilitas-med/ |
| 13 | Elemen video Mendalam: Poster, playsinline, Multi-Codec (AV1/WebM/MP4), dan Subtitel track | 2 · Media & Tabel | 180 **tipis** | https://kodeloka.asadinedu.com/html/materi/13-elemen-video-mendalam-poster-playsinline-multi-codec-av1-webm-mp4-dan-su/ |
| 14 | Tabel Data yang Terstruktur dan Aksesibel | 2 · Media & Tabel | 816 | https://kodeloka.asadinedu.com/html/materi/14-tabel-data-yang-terstruktur-dan-aksesibel/ |
| 15 | Formulir Web dan Kontrol Masukan Modern | 3 · Formulir | 928 | https://kodeloka.asadinedu.com/html/materi/15-formulir-web-dan-kontrol-masukan-modern/ |
| 16 | Validasi Formulir Bawaan dan Constraint Validation API | 3 · Formulir | 902 | https://kodeloka.asadinedu.com/html/materi/16-validasi-formulir-bawaan-dan-constraint-validation-api/ |
| 17 | Pola Formulir Lanjutan: Atribut form, Token autocomplete, meter, dan progress | 3 · Formulir | 702 | https://kodeloka.asadinedu.com/html/materi/17-pola-formulir-lanjutan-atribut-form-token-autocomplete-meter-dan-progres/ |
| 18 | Atribut Global Interaktif: contenteditable, spellcheck, autocapitalize, enterkeyhint, dan draggable | 3 · Formulir | 478 | https://kodeloka.asadinedu.com/html/materi/18-atribut-global-interaktif-contenteditable-spellcheck-autocapitalize-ente/ |
| 19 | Elemen Interaktif Bawaan: details, dialog, Popover API, dan template | 4 · Elemen Interaktif | 1083 | https://kodeloka.asadinedu.com/html/materi/19-elemen-interaktif-bawaan-details-dialog-popover-api-dan-template/ |
| 20 | Komponen Web Bawaan HTML: template, slot, dan Declarative Shadow DOM | 4 · Elemen Interaktif | 648 | https://kodeloka.asadinedu.com/html/materi/20-komponen-web-bawaan-html-template-slot-dan-declarative-shadow-dom/ |
| 21 | Menyematkan Konten Eksternal (iframe), Atribut sandbox, dan Keamanan Bingkai | 4 · Elemen Interaktif | 753 | https://kodeloka.asadinedu.com/html/materi/21-menyematkan-konten-eksternal-iframe-atribut-sandbox-dan-keamanan-bingkai/ |
| 22 | Aksesibilitas Web (a11y) dan WAI-ARIA Dasar | 5 · Aksesibilitas | 990 | https://kodeloka.asadinedu.com/html/materi/22-aksesibilitas-web-a11y-dan-wai-aria-dasar/ |
| 23 | Internasionalisasi HTML (lang, dir, bdi, ruby) dan Notasi Matematika (math) | 5 · Aksesibilitas | 726 | https://kodeloka.asadinedu.com/html/materi/23-internasionalisasi-html-lang-dir-bdi-ruby-dan-notasi-matematika-math/ |
| 24 | Metadata Dokumen, SEO Teknis, Open Graph, dan JSON-LD | 6 · Metadata & Performa | 754 | https://kodeloka.asadinedu.com/html/materi/24-metadata-dokumen-seo-teknis-open-graph-dan-json-ld/ |
| 25 | Performa Pemuatan HTML, Resource Hints, dan Core Web Vitals | 6 · Metadata & Performa | 932 | https://kodeloka.asadinedu.com/html/materi/25-performa-pemuatan-html-resource-hints-dan-core-web-vitals/ |
| 26 | Audit Kualitas HTML, Inspeksi Accessibility Tree, dan Daftar Periksa Produksi | 7 · Praktik & Proyek | 881 | https://kodeloka.asadinedu.com/html/materi/26-audit-kualitas-html-inspeksi-accessibility-tree-dan-daftar-periksa-produ/ |
| 27 | Proyek Akhir Kelas HTML: Halaman Portofolio dan Dokumentasi Teknis Insinyur Perangkat Lunak | 7 · Praktik & Proyek | 1159 | https://kodeloka.asadinedu.com/html/materi/27-proyek-akhir-kelas-html-halaman-portofolio-dan-dokumentasi-teknis-insiny/ |

## CSS (`css/`, 20 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Cara CSS Bekerja dan Selektor Modern | 1 · Fondasi | 923 | https://kodeloka.asadinedu.com/css/materi/01-cara-css-bekerja-dan-selektor-modern/ |
| 2 | Kaskade (Cascade), Spesifisitas, Pewarisan, dan @layer | 1 · Fondasi | 1024 | https://kodeloka.asadinedu.com/css/materi/02-kaskade-cascade-spesifisitas-pewarisan-dan-layer/ |
| 3 | Box Model, Margin Collapsing, dan Properti Logis (inline & block) | 1 · Fondasi | 989 | https://kodeloka.asadinedu.com/css/materi/03-box-model-margin-collapsing-dan-properti-logis-inline-dan-block/ |
| 4 | Satuan Ukuran Modern (rem, ch, dvh) dan Fungsi Matematika (calc, clamp) | 1 · Fondasi | 936 | https://kodeloka.asadinedu.com/css/materi/04-satuan-ukuran-modern-rem-ch-dvh-dan-fungsi-matematika-calc-clamp/ |
| 5 | Aliran Dokumen Normal, display, position, dan Stacking Context (z-index) | 2 · Tata Letak | 896 | https://kodeloka.asadinedu.com/css/materi/05-aliran-dokumen-normal-display-position-dan-stacking-context-z-index/ |
| 6 | Tata Letak Satu Dimensi dengan Flexbox | 2 · Tata Letak | 929 | https://kodeloka.asadinedu.com/css/materi/06-tata-letak-satu-dimensi-dengan-flexbox/ |
| 7 | Tata Letak Dua Dimensi dengan CSS Grid dan subgrid | 2 · Tata Letak | 912 | https://kodeloka.asadinedu.com/css/materi/07-tata-letak-dua-dimensi-dengan-css-grid-dan-subgrid/ |
| 8 | Desain Responsif, Sintaks @media Modern, dan Container Queries (@container) | 2 · Tata Letak | 948 | https://kodeloka.asadinedu.com/css/materi/08-desain-responsif-sintaks-media-modern-dan-container-queries-container/ |
| 9 | Tata Letak Multi-Kolom (columns) dan Stylesheet Cetak (@media print) | 2 · Tata Letak | 814 | https://kodeloka.asadinedu.com/css/materi/09-tata-letak-multi-kolom-columns-dan-stylesheet-cetak-media-print/ |
| 10 | Sistem Warna Modern (oklch, color-mix) dan Tipografi Web | 3 · Warna, Teks & Visual | 846 | https://kodeloka.asadinedu.com/css/materi/10-sistem-warna-modern-oklch-color-mix-dan-tipografi-web/ |
| 11 | Efek Visual Lanjutan: filter, backdrop-filter, Gradien Kompleks, dan clip-path | 3 · Warna, Teks & Visual | 590 | https://kodeloka.asadinedu.com/css/materi/11-efek-visual-lanjutan-filter-backdrop-filter-gradien-kompleks-dan-clip-pa/ |
| 12 | Transisi, Transformasi, Animasi @keyframes, dan Performa 60fps | 4 · Gerak & Interaksi | 802 | https://kodeloka.asadinedu.com/css/materi/12-transisi-transformasi-animasi-keyframes-dan-performa-60fps/ |
| 13 | Pengalaman Gulir Modern: scroll-snap, overscroll-behavior, dan Scroll-Driven Animations | 4 · Gerak & Interaksi | 707 | https://kodeloka.asadinedu.com/css/materi/13-pengalaman-gulir-modern-scroll-snap-overscroll-behavior-dan-scroll-drive/ |
| 14 | Transisi Antar-Tampilan (View Transition API) dan CSS Anchor Positioning | 4 · Gerak & Interaksi | 700 | https://kodeloka.asadinedu.com/css/materi/14-transisi-antar-tampilan-view-transition-api-dan-css-anchor-positioning/ |
| 15 | Custom Properties (Variabel CSS), @property, light-dark(), dan CSS Nesting | 5 · Komponen & Arsitektur | 734 | https://kodeloka.asadinedu.com/css/materi/15-custom-properties-variabel-css-property-light-dark-dan-css-nesting/ |
| 16 | Menata Formulir dan Tabel Modern (accent-color, appearance, :focus-within, Sticky Table) | 5 · Komponen & Arsitektur | 827 | https://kodeloka.asadinedu.com/css/materi/16-menata-formulir-dan-tabel-modern-accent-color-appearance-focus-within-st/ |
| 17 | Arsitektur CSS Skala Aplikasi, Konvensi BEM, dan Debugging di DevTools | 5 · Komponen & Arsitektur | 952 | https://kodeloka.asadinedu.com/css/materi/17-arsitektur-css-skala-aplikasi-konvensi-bem-dan-debugging-di-devtools/ |
| 18 | Merancang Sistem Desain (Design System) dan Komponen UI Aksesibel Tanpa Framework | 5 · Komponen & Arsitektur | 629 | https://kodeloka.asadinedu.com/css/materi/18-merancang-sistem-desain-design-system-dan-komponen-ui-aksesibel-tanpa-fr/ |
| 19 | Optimasi Performa Rendering CSS: content-visibility: auto, contain, dan Pencegahan Layout Thrashing | 6 · Performa & Proyek | 685 | https://kodeloka.asadinedu.com/css/materi/19-optimasi-performa-rendering-css-content-visibility-auto-contain-dan-penc/ |
| 20 | Proyek Akhir Kelas CSS: Antarmuka Dasbor Pemantauan Infrastruktur Responsif | 6 · Performa & Proyek | 1014 | https://kodeloka.asadinedu.com/css/materi/20-proyek-akhir-kelas-css-antarmuka-dasbor-pemantauan-infrastruktur-respons/ |

## JavaScript (`javascript/`, 22 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Pengantar JavaScript Modern, Tipe Data, dan Operator | 1 · Fondasi | 940 | https://kodeloka.asadinedu.com/javascript/materi/01-pengantar-javascript-modern-tipe-data-dan-operator/ |
| 2 | Alur Kontrol, Perulangan Modern, dan Fungsi Kelas Satu | 1 · Fondasi | 774 | https://kodeloka.asadinedu.com/javascript/materi/02-alur-kontrol-perulangan-modern-dan-fungsi-kelas-satu/ |
| 3 | Lexical Scope, Temporal Dead Zone (TDZ), dan Closure | 1 · Fondasi | 854 | https://kodeloka.asadinedu.com/javascript/materi/03-lexical-scope-temporal-dead-zone-tdz-dan-closure/ |
| 4 | Objek dan Array Modern: Destructuring, Immutability (ES2023+), dan Object.groupBy | 2 · Objek & Data | 880 | https://kodeloka.asadinedu.com/javascript/materi/04-objek-dan-array-modern-destructuring-immutability-es2023-dan-object-grou/ |
| 5 | Prototipe, Sintaks class, Field Privat (#), dan Pewarisan (extends) | 2 · Objek & Data | 698 | https://kodeloka.asadinedu.com/javascript/materi/05-prototipe-sintaks-class-field-privat-dan-pewarisan-extends/ |
| 6 | Koleksi Berbasis Kunci: Map, Set (Metode Himpunan Baru), WeakMap, dan Symbol | 2 · Objek & Data | 818 | https://kodeloka.asadinedu.com/javascript/materi/06-koleksi-berbasis-kunci-map-set-metode-himpunan-baru-weakmap-dan-symbol/ |
| 7 | Penanganan Galat (Error Handling), Custom Error, dan Error cause | 2 · Objek & Data | 782 | https://kodeloka.asadinedu.com/javascript/materi/07-penanganan-galat-error-handling-custom-error-dan-error-cause/ |
| 8 | Ekspresi Reguler (RegExp) Modern, Named Capture Groups, dan Pencegahan ReDoS | 2 · Objek & Data | 629 | https://kodeloka.asadinedu.com/javascript/materi/08-ekspresi-reguler-regexp-modern-named-capture-groups-dan-pencegahan-redos/ |
| 9 | Penanganan Tanggal, Zona Waktu, Intl API, dan Pengantar Temporal | 2 · Objek & Data | 681 | https://kodeloka.asadinedu.com/javascript/materi/09-penanganan-tanggal-zona-waktu-intl-api-dan-pengantar-temporal/ |
| 10 | Event Loop, Antrean Microtask, Promise, dan async / await | 3 · Asinkron & Iterasi | 931 | https://kodeloka.asadinedu.com/javascript/materi/10-event-loop-antrean-microtask-promise-dan-async-await/ |
| 11 | Protokol Iterator, Fungsi Generator (function* / yield), dan for await...of | 3 · Asinkron & Iterasi | 645 | https://kodeloka.asadinedu.com/javascript/materi/11-protokol-iterator-fungsi-generator-function-yield-dan-for-await-of/ |
| 12 | Fetch API, Pengolahan JSON, URLSearchParams, dan AbortController | 3 · Asinkron & Iterasi | 738 | https://kodeloka.asadinedu.com/javascript/materi/12-fetch-api-pengolahan-json-urlsearchparams-dan-abortcontroller/ |
| 13 | Manipulasi DOM yang Aman, Siklus Event, dan Event Delegation | 4 · DOM & Peramban | 793 | https://kodeloka.asadinedu.com/javascript/materi/13-manipulasi-dom-yang-aman-siklus-event-dan-event-delegation/ |
| 14 | Mengamati Perubahan DOM & Layar secara Efisien: IntersectionObserver, ResizeObserver, dan MutationObserver | 4 · DOM & Peramban | 665 | https://kodeloka.asadinedu.com/javascript/materi/14-mengamati-perubahan-dom-dan-layar-secara-efisien-intersectionobserver-re/ |
| 15 | Penyimpanan Data di Peramban: localStorage, sessionStorage, dan IndexedDB | 4 · DOM & Peramban | 742 | https://kodeloka.asadinedu.com/javascript/materi/15-penyimpanan-data-di-peramban-localstorage-sessionstorage-dan-indexeddb/ |
| 16 | Modul ES (import / export), Dynamic import(), dan Import Maps | 4 · DOM & Peramban | 750 | https://kodeloka.asadinedu.com/javascript/materi/16-modul-es-import-export-dynamic-import-dan-import-maps/ |
| 17 | Komputasi Latar Belakang (Web Workers), WebSocket, dan Server-Sent Events (SSE) | 5 · Biner, Worker & Offline | 655 | https://kodeloka.asadinedu.com/javascript/materi/17-komputasi-latar-belakang-web-workers-websocket-dan-server-sent-events-ss/ |
| 18 | Membangun Elemen Kustom Mandiri dengan Web Components (customElements & Shadow DOM) | 5 · Biner, Worker & Offline | 633 | https://kodeloka.asadinedu.com/javascript/materi/18-membangun-elemen-kustom-mandiri-dengan-web-components-customelements-dan/ |
| 19 | Keamanan Front-End: Pencegahan DOM-Based XSS, CORS, dan Content Security Policy (CSP) | 6 · Keamanan & Kualitas | 707 | https://kodeloka.asadinedu.com/javascript/materi/19-keamanan-front-end-pencegahan-dom-based-xss-cors-dan-content-security-po/ |
| 20 | Pengujian Otomatis JavaScript dengan node:test dan node:assert | 6 · Keamanan & Kualitas | 783 | https://kodeloka.asadinedu.com/javascript/materi/20-pengujian-otomatis-javascript-dengan-node-test-dan-node-assert/ |
| 21 | Manajemen Memori, Garbage Collection, Pencegahan Memory Leak, dan Profiling di DevTools | 6 · Keamanan & Kualitas | 783 | https://kodeloka.asadinedu.com/javascript/materi/21-manajemen-memori-garbage-collection-pencegahan-memory-leak-dan-profiling/ |
| 22 | Proyek Akhir Kelas JavaScript: Aplikasi Pelacak Belajar & Pencari Modul Interaktif | 7 · Arsitektur & Ekosistem | 892 | https://kodeloka.asadinedu.com/javascript/materi/22-proyek-akhir-kelas-javascript-aplikasi-pelacak-belajar-dan-pencari-modul/ |

## PHP (`php/`, 25 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Pengantar PHP Modern: Siklus Versi, Cara Kerja di Server, dan strict_types | 1 · Fondasi | 822 | https://kodeloka.asadinedu.com/php/materi/01-pengantar-php-modern-siklus-versi-cara-kerja-di-server-dan-strict-types/ |
| 2 | Sintaks, Sistem Tipe Modern, Ekspresi match, dan Operator Pipe (\|) | 1 · Fondasi | 795 | https://kodeloka.asadinedu.com/php/materi/02-sintaks-sistem-tipe-modern-ekspresi-match-dan-operator-pipe/ |
| 3 | Pengolahan String Multibyte (mb_*) dan Array Modern di PHP 8.4 & 8.5 | 1 · Fondasi | 868 | https://kodeloka.asadinedu.com/php/materi/03-pengolahan-string-multibyte-mb-dan-array-modern-di-php-8-4-dan-8-5/ |
| 4 | Fungsi, Named Arguments, Closure, Arrow Function (fn), dan #[\NoDiscard] | 1 · Fondasi | 839 | https://kodeloka.asadinedu.com/php/materi/04-fungsi-named-arguments-closure-arrow-function-fn-dan-nodiscard/ |
| 5 | Tanggal, Waktu (DateTimeImmutable), Zona Waktu UTC, dan Internasionalisasi (intl) | 1 · Fondasi | 611 | https://kodeloka.asadinedu.com/php/materi/05-tanggal-waktu-datetimeimmutable-zona-waktu-utc-dan-internasionalisasi-in/ |
| 6 | Pemrograman Berorientasi Objek (OOP) Modern: Readonly, Asymmetric Visibility, dan Property Hooks | 2 · OOP & Struktur Kode | 881 | https://kodeloka.asadinedu.com/php/materi/06-pemrograman-berorientasi-objek-oop-modern-readonly-asymmetric-visibility/ |
| 7 | Enumerations (enum — Sejak PHP 8.1): Pure Enum, Backed Enum, Metode, dan Interface | 2 · OOP & Struktur Kode | 720 | https://kodeloka.asadinedu.com/php/materi/07-enumerations-enum-sejak-php-8-1-pure-enum-backed-enum-metode-dan-interfa/ |
| 8 | Penanganan Exception (Throwable), Hierarki Galat, dan Global Handler | 2 · OOP & Struktur Kode | 631 | https://kodeloka.asadinedu.com/php/materi/08-penanganan-exception-throwable-hierarki-galat-dan-global-handler/ |
| 9 | Namespace, Resolusi Nama, dan Cara Kerja Autoloading PSR-4 di Balik Layar | 2 · OOP & Struktur Kode | 653 | https://kodeloka.asadinedu.com/php/materi/09-namespace-resolusi-nama-dan-cara-kerja-autoloading-psr-4-di-balik-layar/ |
| 10 | Manajemen Dependensi dengan Composer, SemVer, composer.lock, dan Standar PER/PSR-12 | 2 · OOP & Struktur Kode | 723 | https://kodeloka.asadinedu.com/php/materi/10-manajemen-dependensi-dengan-composer-semver-composer-lock-dan-standar-pe/ |
| 11 | Ekspresi Reguler (PCRE2 preg_*), Attributes (#[...]), dan Reflection API | 2 · OOP & Struktur Kode | 642 | https://kodeloka.asadinedu.com/php/materi/11-ekspresi-reguler-pcre2-preg-attributes-dan-reflection-api/ |
| 12 | Menangani Permintaan HTTP, Validasi filter_input(), dan Ekstensi Uri (PHP 8.5) | 3 · Web & Keamanan Dasar | 657 | https://kodeloka.asadinedu.com/php/materi/12-menangani-permintaan-http-validasi-filter-input-dan-ekstensi-uri-php-8-5/ |
| 13 | Keluaran Aman (Contextual Output Escaping), Pencegahan XSS, dan Header Keamanan HTTP | 3 · Web & Keamanan Dasar | 871 | https://kodeloka.asadinedu.com/php/materi/13-keluaran-aman-contextual-output-escaping-pencegahan-xss-dan-header-keama/ |
| 14 | Manajemen State: Cookie yang Aman, Session, dan Pencegahan Session Fixation | 3 · Web & Keamanan Dasar | 819 | https://kodeloka.asadinedu.com/php/materi/14-manajemen-state-cookie-yang-aman-session-dan-pencegahan-session-fixation/ |
| 15 | Menangani Unggah Berkas (File Upload) Secara Aman | 3 · Web & Keamanan Dasar | 738 | https://kodeloka.asadinedu.com/php/materi/15-menangani-unggah-berkas-file-upload-secara-aman/ |
| 16 | Perlindungan Cross-Site Request Forgery (CSRF), random_bytes(), dan Pertahanan Berlapis | 3 · Web & Keamanan Dasar | 740 | https://kodeloka.asadinedu.com/php/materi/16-perlindungan-cross-site-request-forgery-csrf-random-bytes-dan-pertahanan/ |
| 17 | Keamanan Kata Sandi: password_hash() (Argon2id/Bcrypt), password_verify(), dan Reset Sandi Aman | 3 · Web & Keamanan Dasar | 805 | https://kodeloka.asadinedu.com/php/materi/17-keamanan-kata-sandi-password-hash-argon2id-bcrypt-password-verify-dan-re/ |
| 18 | Akses Basis Data Aman dengan PDO, Prepared Statements, dan Transaksi | 3 · Web & Keamanan Dasar | 1004 | https://kodeloka.asadinedu.com/php/materi/18-akses-basis-data-aman-dengan-pdo-prepared-statements-dan-transaksi/ |
| 19 | Sistem Berkas, PHP Streams, dan Pemrosesan Data Besar Hemat Memori dengan Generator (yield) | 4 · Data & Berkas | 733 | https://kodeloka.asadinedu.com/php/materi/19-sistem-berkas-php-streams-dan-pemrosesan-data-besar-hemat-memori-dengan/ |
| 20 | Arsitektur Aplikasi Modern: Routing, Middleware (PSR-15), dan Dependency Injection (PSR-11) | 5 · Arsitektur Aplikasi | 834 | https://kodeloka.asadinedu.com/php/materi/20-arsitektur-aplikasi-modern-routing-middleware-psr-15-dan-dependency-inje/ |
| 21 | Struktur Direktori Proyek Siap Produksi, Konfigurasi Lingkungan, dan Logging Terstruktur (PSR-3) | 5 · Arsitektur Aplikasi | 921 | https://kodeloka.asadinedu.com/php/materi/21-struktur-direktori-proyek-siap-produksi-konfigurasi-lingkungan-dan-loggi/ |
| 22 | Komunikasi Antar-Layanan (cURL & Persistent Handles PHP 8.5), Caching, dan Rate Limiting | 6 · Layanan & Proses | 717 | https://kodeloka.asadinedu.com/php/materi/22-komunikasi-antar-layanan-curl-dan-persistent-handles-php-8-5-caching-dan/ |
| 23 | Pengujian Otomatis (Unit & Integration Testing) dengan PHPUnit 12 | 7 · Kualitas & Produksi | 875 | https://kodeloka.asadinedu.com/php/materi/23-pengujian-otomatis-unit-dan-integration-testing-dengan-phpunit-12/ |
| 24 | Menyajikan Aplikasi PHP di Produksi dengan Nginx, PHP-FPM, dan OPcache | 7 · Kualitas & Produksi | 919 | https://kodeloka.asadinedu.com/php/materi/24-menyajikan-aplikasi-php-di-produksi-dengan-nginx-php-fpm-dan-opcache/ |
| 25 | Proyek Akhir Kelas PHP: Aplikasi Manajemen Modul & Catatan Belajar Aman | 7 · Kualitas & Produksi | 1023 | https://kodeloka.asadinedu.com/php/materi/25-proyek-akhir-kelas-php-aplikasi-manajemen-modul-dan-catatan-belajar-aman/ |

## PostgreSQL (`postgresql/`, 12 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Arsitektur PostgreSQL: Proses, Memori & WAL | 1 · Fondasi | 573 | https://kodeloka.asadinedu.com/postgresql/materi/01-arsitektur-postgresql-proses-memori-dan-wal/ |
| 2 | Memilih Tipe Data yang Tepat | 2 · Tipe Data & Skema | 636 | https://kodeloka.asadinedu.com/postgresql/materi/02-memilih-tipe-data-yang-tepat/ |
| 3 | Indeks: B-tree, GIN, Partial & Covering | 3 · Indeks & Kinerja | 587 | https://kodeloka.asadinedu.com/postgresql/materi/03-indeks-b-tree-gin-partial-dan-covering/ |
| 4 | Membaca EXPLAIN ANALYZE | 3 · Indeks & Kinerja | 533 | https://kodeloka.asadinedu.com/postgresql/materi/04-membaca-explain-analyze/ |
| 5 | Transaksi, Tingkat Isolasi & Deadlock | 4 · Transaksi | 610 | https://kodeloka.asadinedu.com/postgresql/materi/05-transaksi-tingkat-isolasi-dan-deadlock/ |
| 6 | VACUUM, Bloat & Autovacuum | 5 · Pemeliharaan | 572 | https://kodeloka.asadinedu.com/postgresql/materi/06-vacuum-bloat-dan-autovacuum/ |
| 7 | Partisi Tabel | 6 · Skala | 534 | https://kodeloka.asadinedu.com/postgresql/materi/07-partisi-tabel/ |
| 8 | Replikasi, Backup & Point-in-Time Recovery | 6 · Skala | 499 | https://kodeloka.asadinedu.com/postgresql/materi/08-replikasi-backup-dan-point-in-time-recovery/ |
| 9 | Peran, Hak Akses & Row Level Security | 7 · Keamanan | 530 | https://kodeloka.asadinedu.com/postgresql/materi/09-peran-hak-akses-dan-row-level-security/ |
| 10 | Migrasi Skema Tanpa Downtime | 8 · Praktik | 553 | https://kodeloka.asadinedu.com/postgresql/materi/10-migrasi-skema-tanpa-downtime/ |
| 11 | Pola Kueri: Window Function, CTE & Upsert | 8 · Praktik | 585 | https://kodeloka.asadinedu.com/postgresql/materi/11-pola-kueri-window-function-cte-dan-upsert/ |
| 12 | Pemantauan & Daftar Periksa Produksi | 8 · Praktik | 472 | https://kodeloka.asadinedu.com/postgresql/materi/12-pemantauan-dan-daftar-periksa-produksi/ |

## Redis (`redis/`, 21 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Pengenalan Redis & In-Memory Data Store | Dasar | 313 | https://kodeloka.asadinedu.com/redis/materi/01-pengenalan-redis-dan-in-memory-data-store/ |
| 2 | Instalasi & Setup Redis Server | Dasar | 223 **tipis** | https://kodeloka.asadinedu.com/redis/materi/02-instalasi-dan-setup-redis-server/ |
| 3 | Perintah Dasar Redis Client & Server | Dasar | 237 **tipis** | https://kodeloka.asadinedu.com/redis/materi/03-perintah-dasar-redis-client-dan-server/ |
| 4 | Tipe Data String & Operations | Data Types | 236 **tipis** | https://kodeloka.asadinedu.com/redis/materi/04-tipe-data-string-dan-operations/ |
| 5 | Expiration & Time To Live (TTL) | Data Types | 230 **tipis** | https://kodeloka.asadinedu.com/redis/materi/05-expiration-dan-time-to-live-ttl/ |
| 6 | Tipe Data Hash | Data Types | 231 **tipis** | https://kodeloka.asadinedu.com/redis/materi/06-tipe-data-hash/ |
| 7 | Tipe Data List & Message Queuing | Data Types | 215 **tipis** | https://kodeloka.asadinedu.com/redis/materi/07-tipe-data-list-dan-message-queuing/ |
| 8 | Tipe Data Set (Unique Unordered Collection) | Data Types | 218 **tipis** | https://kodeloka.asadinedu.com/redis/materi/08-tipe-data-set-unique-unordered-collection/ |
| 9 | Tipe Data Sorted Set / ZSet & Leaderboard Pattern | Data Types | 246 **tipis** | https://kodeloka.asadinedu.com/redis/materi/09-tipe-data-sorted-set-zset-dan-leaderboard-pattern/ |
| 10 | Redis Transactions & Optimistic Locking | Advanced | 217 **tipis** | https://kodeloka.asadinedu.com/redis/materi/10-redis-transactions-dan-optimistic-locking/ |
| 11 | Redis Publish & Subscribe (Pub/Sub) | Advanced | 164 **tipis** | https://kodeloka.asadinedu.com/redis/materi/11-redis-publish-dan-subscribe-pub-sub/ |
| 12 | Redis Streams - Log Append-Only untuk Event | Advanced | 743 | https://kodeloka.asadinedu.com/redis/materi/12-redis-streams-log-append-only-untuk-event/ |
| 13 | Consumer Group - Pemrosesan Andal & At-Least-Once | Advanced | 793 | https://kodeloka.asadinedu.com/redis/materi/13-consumer-group-pemrosesan-andal-dan-at-least-once/ |
| 14 | Lua Scripting & Redis Functions | Advanced | 727 | https://kodeloka.asadinedu.com/redis/materi/14-lua-scripting-dan-redis-functions/ |
| 15 | Replication & High Availability dengan Sentinel | Advanced | 741 | https://kodeloka.asadinedu.com/redis/materi/15-replication-dan-high-availability-dengan-sentinel/ |
| 16 | Redis Cluster & Sharding Horizontal | Advanced | 678 | https://kodeloka.asadinedu.com/redis/materi/16-redis-cluster-dan-sharding-horizontal/ |
| 17 | Redis 8 & Modul Bawaan (JSON, Search, Time Series, Bloom, Vector) | Advanced | 960 | https://kodeloka.asadinedu.com/redis/materi/17-redis-8-dan-modul-bawaan-json-search-time-series-bloom-vector/ |
| 18 | Redis Pipeline & Mass Insertion Performance | Performance | 238 **tipis** | https://kodeloka.asadinedu.com/redis/materi/18-redis-pipeline-dan-mass-insertion-performance/ |
| 19 | Manajemen Memori & Kebijakan Eviction | Performance | 745 | https://kodeloka.asadinedu.com/redis/materi/19-manajemen-memori-dan-kebijakan-eviction/ |
| 20 | Redis Persistence, Security & Best Practices | Security | 273 **tipis** | https://kodeloka.asadinedu.com/redis/materi/20-redis-persistence-security-dan-best-practices/ |
| 21 | Keamanan: ACL, TLS & Pengerasan Server | Security | 676 | https://kodeloka.asadinedu.com/redis/materi/21-keamanan-acl-tls-dan-pengerasan-server/ |

## Apache Kafka (`kafka/`, 13 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Kafka Itu Log, Bukan Antrean Pesan | 1 · Fondasi | 454 | https://kodeloka.asadinedu.com/kafka/materi/01-kafka-itu-log-bukan-antrean-pesan/ |
| 2 | Partisi, Kunci Pesan & Replikasi | 1 · Fondasi | 507 | https://kodeloka.asadinedu.com/kafka/materi/02-partisi-kunci-pesan-dan-replikasi/ |
| 3 | KRaft: Kafka Tanpa ZooKeeper | 1 · Fondasi | 343 | https://kodeloka.asadinedu.com/kafka/materi/03-kraft-kafka-tanpa-zookeeper/ |
| 4 | Produser: acks, Idempotensi, Batching & Kompresi | 2 · Produksi & Konsumsi | 440 | https://kodeloka.asadinedu.com/kafka/materi/04-produser-acks-idempotensi-batching-dan-kompresi/ |
| 5 | Consumer Group, Rebalancing & Commit Offset | 2 · Produksi & Konsumsi | 552 | https://kodeloka.asadinedu.com/kafka/materi/05-consumer-group-rebalancing-dan-commit-offset/ |
| 6 | Semantik Pengiriman & Transaksi Exactly-Once | 2 · Produksi & Konsumsi | 372 | https://kodeloka.asadinedu.com/kafka/materi/06-semantik-pengiriman-dan-transaksi-exactly-once/ |
| 7 | Serialisasi, Schema Registry & Evolusi Skema | 3 · Data & Skema | 446 | https://kodeloka.asadinedu.com/kafka/materi/07-serialisasi-schema-registry-dan-evolusi-skema/ |
| 8 | Retensi, Log Compaction & Tiered Storage | 3 · Data & Skema | 452 | https://kodeloka.asadinedu.com/kafka/materi/08-retensi-log-compaction-dan-tiered-storage/ |
| 9 | Kafka Connect & Change Data Capture | 4 · Ekosistem | 419 | https://kodeloka.asadinedu.com/kafka/materi/09-kafka-connect-dan-change-data-capture/ |
| 10 | Kafka Streams: Pemrosesan Stateful | 4 · Ekosistem | 484 | https://kodeloka.asadinedu.com/kafka/materi/10-kafka-streams-pemrosesan-stateful/ |
| 11 | Pemantauan, Consumer Lag & Kapasitas | 5 · Operasi | 446 | https://kodeloka.asadinedu.com/kafka/materi/11-pemantauan-consumer-lag-dan-kapasitas/ |
| 12 | Keamanan: TLS, SASL, ACL & Kuota | 5 · Operasi | 379 | https://kodeloka.asadinedu.com/kafka/materi/12-keamanan-tls-sasl-acl-dan-kuota/ |
| 13 | Outbox, Dead Letter Queue & Konsumen Idempoten | 6 · Pola Produksi | 640 | https://kodeloka.asadinedu.com/kafka/materi/13-outbox-dead-letter-queue-dan-konsumen-idempoten/ |

## RabbitMQ (`rabbitmq/`, 15 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Model AMQP: Exchange, Queue, Binding, dan Routing Key |  | 563 | https://kodeloka.asadinedu.com/rabbitmq/materi/01-model-amqp-exchange-queue-binding-dan-routing-key/ |
| 2 | Instalasi & Konfigurasi: rabbitmq.conf, Plugin, dan Batas Sistem |  | 550 | https://kodeloka.asadinedu.com/rabbitmq/materi/02-instalasi-dan-konfigurasi-rabbitmq-conf-plugin-dan-batas-sistem/ |
| 3 | Empat Tipe Exchange dan Cara Memilihnya |  | 595 | https://kodeloka.asadinedu.com/rabbitmq/materi/03-empat-tipe-exchange-dan-cara-memilihnya/ |
| 4 | Producer & Consumer: Properti Pesan dan Siklus Hidupnya |  | 677 | https://kodeloka.asadinedu.com/rabbitmq/materi/04-producer-dan-consumer-properti-pesan-dan-siklus-hidupnya/ |
| 5 | Acknowledgement & Prefetch: Mengendalikan Aliran Pesan |  | 627 | https://kodeloka.asadinedu.com/rabbitmq/materi/05-acknowledgement-dan-prefetch-mengendalikan-aliran-pesan/ |
| 6 | Durability, Persistence, dan Publisher Confirms |  | 692 | https://kodeloka.asadinedu.com/rabbitmq/materi/06-durability-persistence-dan-publisher-confirms/ |
| 7 | Dead Letter Exchange, TTL, dan Retry Berjenjang |  | 885 | https://kodeloka.asadinedu.com/rabbitmq/materi/07-dead-letter-exchange-ttl-dan-retry-berjenjang/ |
| 8 | Quorum Queue, Classic Queue, dan Stream |  | 669 | https://kodeloka.asadinedu.com/rabbitmq/materi/08-quorum-queue-classic-queue-dan-stream/ |
| 9 | Pola Integrasi: Work Queue, Pub/Sub, RPC, dan Outbox |  | 894 | https://kodeloka.asadinedu.com/rabbitmq/materi/09-pola-integrasi-work-queue-pub-sub-rpc-dan-outbox/ |
| 10 | Idempotensi, Urutan Pesan, dan Mitos Exactly-Once |  | 778 | https://kodeloka.asadinedu.com/rabbitmq/materi/10-idempotensi-urutan-pesan-dan-mitos-exactly-once/ |
| 11 | Klien Produksi: Reconnect, Heartbeat, dan Graceful Shutdown |  | 734 | https://kodeloka.asadinedu.com/rabbitmq/materi/11-klien-produksi-reconnect-heartbeat-dan-graceful-shutdown/ |
| 12 | Cluster, Partisi Jaringan, Federation, dan Shovel |  | 600 | https://kodeloka.asadinedu.com/rabbitmq/materi/12-cluster-partisi-jaringan-federation-dan-shovel/ |
| 13 | Keamanan: vhost, Permission, TLS, dan Pengerasan |  | 661 | https://kodeloka.asadinedu.com/rabbitmq/materi/13-keamanan-vhost-permission-tls-dan-pengerasan/ |
| 14 | Monitoring, Flow Control, dan Menyetel Performa |  | 617 | https://kodeloka.asadinedu.com/rabbitmq/materi/14-monitoring-flow-control-dan-menyetel-performa/ |
| 15 | Operasi Harian: Definisi sebagai Kode, Upgrade, dan Troubleshooting |  | 803 | https://kodeloka.asadinedu.com/rabbitmq/materi/15-operasi-harian-definisi-sebagai-kode-upgrade-dan-troubleshooting/ |

## Nginx (`nginx/`, 8 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Arsitektur & Model Proses | 1 · Fondasi | 482 | https://kodeloka.asadinedu.com/nginx/materi/01-arsitektur-dan-model-proses/ |
| 2 | Struktur Konfigurasi & Konteks | 1 · Fondasi | 488 | https://kodeloka.asadinedu.com/nginx/materi/02-struktur-konfigurasi-dan-konteks/ |
| 3 | Reverse Proxy & Header | 2 · Reverse Proxy | 429 | https://kodeloka.asadinedu.com/nginx/materi/03-reverse-proxy-dan-header/ |
| 4 | Upstream & Penyeimbang Beban | 2 · Reverse Proxy | 469 | https://kodeloka.asadinedu.com/nginx/materi/04-upstream-dan-penyeimbang-beban/ |
| 5 | TLS, Sertifikat & HTTPS | 3 · TLS & Keamanan | 386 | https://kodeloka.asadinedu.com/nginx/materi/05-tls-sertifikat-dan-https/ |
| 6 | Pembatasan Laju & Perlindungan | 3 · TLS & Keamanan | 437 | https://kodeloka.asadinedu.com/nginx/materi/06-pembatasan-laju-dan-perlindungan/ |
| 7 | Caching & Penyajian Statis | 4 · Kinerja | 437 | https://kodeloka.asadinedu.com/nginx/materi/07-caching-dan-penyajian-statis/ |
| 8 | Log, Diagnosis & Penelusuran Masalah | 5 · Operasi | 482 | https://kodeloka.asadinedu.com/nginx/materi/08-log-diagnosis-dan-penelusuran-masalah/ |

## Docker (`docker/`, 21 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Introduction to Containerization & Docker | Fundamentals | 204 **tipis** | https://kodeloka.asadinedu.com/docker/materi/01-introduction-to-containerization-dan-docker/ |
| 2 | Physical Servers vs Virtualization vs Containers | Architecture | 222 **tipis** | https://kodeloka.asadinedu.com/docker/materi/02-physical-servers-vs-virtualization-vs-containers/ |
| 3 | Software Processes & Linux System Isolation | Architecture | 177 **tipis** | https://kodeloka.asadinedu.com/docker/materi/03-software-processes-dan-linux-system-isolation/ |
| 4 | Docker Architecture & Core Ecosystem | Architecture | 191 **tipis** | https://kodeloka.asadinedu.com/docker/materi/04-docker-architecture-dan-core-ecosystem/ |
| 5 | Docker Installation & Environment Setup | Fundamentals | 209 **tipis** | https://kodeloka.asadinedu.com/docker/materi/05-docker-installation-dan-environment-setup/ |
| 6 | Basic Docker Commands & Container Lifecycle | Fundamentals | 177 **tipis** | https://kodeloka.asadinedu.com/docker/materi/06-basic-docker-commands-dan-container-lifecycle/ |
| 7 | Port Forwarding & Container Networking Basics | Networking | 129 **tipis** | https://kodeloka.asadinedu.com/docker/materi/07-port-forwarding-dan-container-networking-basics/ |
| 8 | Docker Networking Modes & Custom Drivers | Networking | 182 **tipis** | https://kodeloka.asadinedu.com/docker/materi/08-docker-networking-modes-dan-custom-drivers/ |
| 9 | Data Persistence: Volumes & Bind Mounts | Storage | 162 **tipis** | https://kodeloka.asadinedu.com/docker/materi/09-data-persistence-volumes-dan-bind-mounts/ |
| 10 | Environment Variables & App Configurations | Fundamentals | 108 **tipis** | https://kodeloka.asadinedu.com/docker/materi/10-environment-variables-dan-app-configurations/ |
| 11 | Introduction to Docker Compose | Compose | 189 **tipis** | https://kodeloka.asadinedu.com/docker/materi/11-introduction-to-docker-compose/ |
| 12 | Advanced Docker Compose & Service Dependencies | Compose | 100 **tipis** | https://kodeloka.asadinedu.com/docker/materi/12-advanced-docker-compose-dan-service-dependencies/ |
| 13 | Compose Modern - Watch, Profile & Depends On | Compose | 553 | https://kodeloka.asadinedu.com/docker/materi/13-compose-modern-watch-profile-dan-depends-on/ |
| 14 | VS Code Integration & Docker Developer Tools | Fundamentals | 115 **tipis** | https://kodeloka.asadinedu.com/docker/materi/14-vs-code-integration-dan-docker-developer-tools/ |
| 15 | Writing Dockerfiles & Building Custom Images | Dockerfile | 164 **tipis** | https://kodeloka.asadinedu.com/docker/materi/15-writing-dockerfiles-dan-building-custom-images/ |
| 16 | Docker Image Layers & Build Caching | Dockerfile | 154 **tipis** | https://kodeloka.asadinedu.com/docker/materi/16-docker-image-layers-dan-build-caching/ |
| 17 | CMD vs ENTRYPOINT & Multi-Stage Builds | Dockerfile | 184 **tipis** | https://kodeloka.asadinedu.com/docker/materi/17-cmd-vs-entrypoint-dan-multi-stage-builds/ |
| 18 | BuildKit & Buildx - Build Modern yang Cepat | Dockerfile | 578 | https://kodeloka.asadinedu.com/docker/materi/18-buildkit-dan-buildx-build-modern-yang-cepat/ |
| 19 | Publishing Images to Docker Hub & Image Registry | Fundamentals | 108 **tipis** | https://kodeloka.asadinedu.com/docker/materi/19-publishing-images-to-docker-hub-dan-image-registry/ |
| 20 | Keamanan Kontainer & Pemindaian Kerentanan | Fundamentals | 785 | https://kodeloka.asadinedu.com/docker/materi/20-keamanan-kontainer-dan-pemindaian-kerentanan/ |
| 21 | Production Deployment & DevOps Best Practices | Architecture | 169 **tipis** | https://kodeloka.asadinedu.com/docker/materi/21-production-deployment-dan-devops-best-practices/ |

## Kubernetes (`kubernetes/`, 14 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Apa yang Sebenarnya Dikerjakan Kubernetes | 1 · Fondasi | 494 | https://kodeloka.asadinedu.com/kubernetes/materi/01-apa-yang-sebenarnya-dikerjakan-kubernetes/ |
| 2 | Pod, Deployment & ReplicaSet | 1 · Fondasi | 484 | https://kodeloka.asadinedu.com/kubernetes/materi/02-pod-deployment-dan-replicaset/ |
| 3 | Service, Endpoint & DNS Internal | 2 · Jaringan | 495 | https://kodeloka.asadinedu.com/kubernetes/materi/03-service-endpoint-dan-dns-internal/ |
| 4 | Ingress, Gateway API & TLS | 2 · Jaringan | 515 | https://kodeloka.asadinedu.com/kubernetes/materi/04-ingress-gateway-api-dan-tls/ |
| 5 | ConfigMap, Secret & Manajemen Rahasia | 3 · Konfigurasi | 496 | https://kodeloka.asadinedu.com/kubernetes/materi/05-configmap-secret-dan-manajemen-rahasia/ |
| 6 | Resource Request, Limit & Quality of Service | 3 · Konfigurasi | 558 | https://kodeloka.asadinedu.com/kubernetes/materi/06-resource-request-limit-dan-quality-of-service/ |
| 7 | Volume, PVC & StatefulSet | 4 · Penyimpanan & Stateful | 569 | https://kodeloka.asadinedu.com/kubernetes/materi/07-volume-pvc-dan-statefulset/ |
| 8 | RBAC, ServiceAccount & Pod Security | 5 · Keamanan | 591 | https://kodeloka.asadinedu.com/kubernetes/materi/08-rbac-serviceaccount-dan-pod-security/ |
| 9 | HPA, VPA & Cluster Autoscaler | 6 · Penskalaan | 543 | https://kodeloka.asadinedu.com/kubernetes/materi/09-hpa-vpa-dan-cluster-autoscaler/ |
| 10 | Penjadwalan: Affinity, Taint & Topology Spread | 7 · Operasi | 563 | https://kodeloka.asadinedu.com/kubernetes/materi/10-penjadwalan-affinity-taint-dan-topology-spread/ |
| 11 | Diagnosis Masalah: Dari CrashLoopBackOff sampai Pending | 7 · Operasi | 635 | https://kodeloka.asadinedu.com/kubernetes/materi/11-diagnosis-masalah-dari-crashloopbackoff-sampai-pending/ |
| 12 | Helm, Kustomize & GitOps | 8 · Pengelolaan | 670 | https://kodeloka.asadinedu.com/kubernetes/materi/12-helm-kustomize-dan-gitops/ |
| 13 | Job, CronJob & DaemonSet | 8 · Pengelolaan | 573 | https://kodeloka.asadinedu.com/kubernetes/materi/13-job-cronjob-dan-daemonset/ |
| 14 | Observability & Kesiapan Produksi | 8 · Pengelolaan | 612 | https://kodeloka.asadinedu.com/kubernetes/materi/14-observability-dan-kesiapan-produksi/ |

## Kong API Gateway (`kong/`, 12 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Apa itu API Gateway & Posisi Kong | 1 · Fondasi | 360 | https://kodeloka.asadinedu.com/kong/materi/01-apa-itu-api-gateway-dan-posisi-kong/ |
| 2 | Instalasi Kong: DB-less vs Berbasis Database | 1 · Fondasi | 359 | https://kodeloka.asadinedu.com/kong/materi/02-instalasi-kong-db-less-vs-berbasis-database/ |
| 3 | Objek Inti: Service, Route, Upstream & Target | 1 · Fondasi | 457 | https://kodeloka.asadinedu.com/kong/materi/03-objek-inti-service-route-upstream-dan-target/ |
| 4 | decK: Konfigurasi sebagai Kode | 2 · Konfigurasi | 468 | https://kodeloka.asadinedu.com/kong/materi/04-deck-konfigurasi-sebagai-kode/ |
| 5 | Anatomi Plugin & Urutan Eksekusi | 3 · Plugin | 499 | https://kodeloka.asadinedu.com/kong/materi/05-anatomi-plugin-dan-urutan-eksekusi/ |
| 6 | Rate Limiting, Caching & Perlindungan Trafik | 3 · Plugin | 485 | https://kodeloka.asadinedu.com/kong/materi/06-rate-limiting-caching-dan-perlindungan-trafik/ |
| 7 | Transformasi Request & Response | 3 · Plugin | 351 | https://kodeloka.asadinedu.com/kong/materi/07-transformasi-request-dan-response/ |
| 8 | Autentikasi: Key, JWT, OAuth2 & Consumer | 4 · Keamanan | 476 | https://kodeloka.asadinedu.com/kong/materi/08-autentikasi-key-jwt-oauth2-dan-consumer/ |
| 9 | TLS, mTLS & Pengerasan Produksi | 4 · Keamanan | 431 | https://kodeloka.asadinedu.com/kong/materi/09-tls-mtls-dan-pengerasan-produksi/ |
| 10 | Kong Ingress Controller 3.x & Gateway API | 5 · Kubernetes | 550 | https://kodeloka.asadinedu.com/kong/materi/10-kong-ingress-controller-3-x-dan-gateway-api/ |
| 11 | Observability: Metrik, Log & Tracing | 6 · Operasi | 489 | https://kodeloka.asadinedu.com/kong/materi/11-observability-metrik-log-dan-tracing/ |
| 12 | Produksi: HA, Kapasitas & Upgrade | 6 · Operasi | 624 | https://kodeloka.asadinedu.com/kong/materi/12-produksi-ha-kapasitas-dan-upgrade/ |

## Git & CI/CD (`git-ci-cd/`, 20 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Fondasi Git - Model Objek, Staging Area & Commit | Git Fundamentals | 920 | https://kodeloka.asadinedu.com/git-ci-cd/materi/01-fondasi-git-model-objek-staging-area-dan-commit/ |
| 2 | Branching & Merging - Fast-Forward vs Three-Way | Git Fundamentals | 532 | https://kodeloka.asadinedu.com/git-ci-cd/materi/02-branching-dan-merging-fast-forward-vs-three-way/ |
| 3 | Menyelesaikan Konflik Merge dengan Percaya Diri | Git Fundamentals | 595 | https://kodeloka.asadinedu.com/git-ci-cd/materi/03-menyelesaikan-konflik-merge-dengan-percaya-diri/ |
| 4 | Rebase, Interactive Rebase & Menulis Ulang Riwayat | Git Fundamentals | 730 | https://kodeloka.asadinedu.com/git-ci-cd/materi/04-rebase-interactive-rebase-dan-menulis-ulang-riwayat/ |
| 5 | Strategi Branching - Git Flow, GitHub Flow & Trunk-Based | Git Workflow | 658 | https://kodeloka.asadinedu.com/git-ci-cd/materi/05-strategi-branching-git-flow-github-flow-dan-trunk-based/ |
| 6 | Git Tingkat Lanjut - Stash, Worktree, Submodule & Hooks | Git Workflow | 822 | https://kodeloka.asadinedu.com/git-ci-cd/materi/06-git-tingkat-lanjut-stash-worktree-submodule-dan-hooks/ |
| 7 | CI/CD Explained: Continuous Integration, Delivery & Deployment | Konsep CI/CD | 125 **tipis** | https://kodeloka.asadinedu.com/git-ci-cd/materi/07-ci-cd-explained-continuous-integration-delivery-dan-deployment/ |
| 8 | The ONLY Continuous Integration (CI) Tutorial You Need | CI Fundamentals | 106 **tipis** | https://kodeloka.asadinedu.com/git-ci-cd/materi/08-the-only-continuous-integration-ci-tutorial-you-need/ |
| 9 | GitHub Actions Tutorial - Basic Concepts & CI/CD Pipeline | GitHub Actions | 287 **tipis** | https://kodeloka.asadinedu.com/git-ci-cd/materi/09-github-actions-tutorial-basic-concepts-dan-ci-cd-pipeline/ |
| 10 | GitLab CI/CD Tutorial for Beginners [Crash Course] | GitLab CI/CD | 136 **tipis** | https://kodeloka.asadinedu.com/git-ci-cd/materi/10-gitlab-ci-cd-tutorial-for-beginners-crash-course/ |
| 11 | Complete Jenkins Pipeline Tutorial & Jenkinsfile Explained | Jenkins | 160 **tipis** | https://kodeloka.asadinedu.com/git-ci-cd/materi/11-complete-jenkins-pipeline-tutorial-dan-jenkinsfile-explained/ |
| 12 | Run Jenkins in Docker Container (Part 1/4) | Jenkins | 132 **tipis** | https://kodeloka.asadinedu.com/git-ci-cd/materi/12-run-jenkins-in-docker-container-part-1-4/ |
| 13 | Create Multibranch Pipeline with Git & Jenkins (Part 2/4) | Jenkins | 108 **tipis** | https://kodeloka.asadinedu.com/git-ci-cd/materi/13-create-multibranch-pipeline-with-git-dan-jenkins-part-2-4/ |
| 14 | Jenkinsfile & Environment Variables in Jenkins (Part 3/4) | Jenkins | 124 **tipis** | https://kodeloka.asadinedu.com/git-ci-cd/materi/14-jenkinsfile-dan-environment-variables-in-jenkins-part-3-4/ |
| 15 | Trigger Jenkins Build Automatically via Webhooks (Part 4/4) | Jenkins | 129 **tipis** | https://kodeloka.asadinedu.com/git-ci-cd/materi/15-trigger-jenkins-build-automatically-via-webhooks-part-4-4/ |
| 16 | CI/CD with TeamCity - DevOps Tooling | TeamCity | 139 **tipis** | https://kodeloka.asadinedu.com/git-ci-cd/materi/16-ci-cd-with-teamcity-devops-tooling/ |
| 17 | Azure DevOps Tutorial for Beginners \| CI/CD with Azure Pipelines | Azure DevOps | 124 **tipis** | https://kodeloka.asadinedu.com/git-ci-cd/materi/17-azure-devops-tutorial-for-beginners-ci-cd-with-azure-pipelines/ |
| 18 | DevSecOps Tutorial \| CI Pipeline with GitHub Actions & Docker Scout | DevSecOps | 148 **tipis** | https://kodeloka.asadinedu.com/git-ci-cd/materi/18-devsecops-tutorial-ci-pipeline-with-github-actions-dan-docker-scout/ |
| 19 | What are Microservices? Microservices Architecture & CI/CD | Arsitektur | 107 **tipis** | https://kodeloka.asadinedu.com/git-ci-cd/materi/19-what-are-microservices-microservices-architecture-dan-ci-cd/ |
| 20 | ArgoCD Tutorial for Beginners \| GitOps CD for Kubernetes | GitOps & ArgoCD | 125 **tipis** | https://kodeloka.asadinedu.com/git-ci-cd/materi/20-argocd-tutorial-for-beginners-gitops-cd-for-kubernetes/ |

## Linux & Shell (`linux/`, 8 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Filesystem, Path & Navigasi | 1 · Fondasi | 496 | https://kodeloka.asadinedu.com/linux/materi/01-filesystem-path-dan-navigasi/ |
| 2 | Izin, Kepemilikan & sudo | 1 · Fondasi | 547 | https://kodeloka.asadinedu.com/linux/materi/02-izin-kepemilikan-dan-sudo/ |
| 3 | Proses, Sinyal & Sumber Daya | 2 · Proses & Sistem | 534 | https://kodeloka.asadinedu.com/linux/materi/03-proses-sinyal-dan-sumber-daya/ |
| 4 | systemd: Layanan, Log & Timer | 2 · Proses & Sistem | 465 | https://kodeloka.asadinedu.com/linux/materi/04-systemd-layanan-log-dan-timer/ |
| 5 | Pipe, Redirection & Perkakas Teks | 3 · Shell | 633 | https://kodeloka.asadinedu.com/linux/materi/05-pipe-redirection-dan-perkakas-teks/ |
| 6 | Menulis Skrip Bash yang Tidak Berbahaya | 3 · Shell | 542 | https://kodeloka.asadinedu.com/linux/materi/06-menulis-skrip-bash-yang-tidak-berbahaya/ |
| 7 | Jaringan, DNS & Menelusuri Koneksi | 4 · Jaringan | 564 | https://kodeloka.asadinedu.com/linux/materi/07-jaringan-dns-dan-menelusuri-koneksi/ |
| 8 | SSH, Transfer Berkas & Akses Aman | 5 · Operasi | 520 | https://kodeloka.asadinedu.com/linux/materi/08-ssh-transfer-berkas-dan-akses-aman/ |

## Keamanan Aplikasi (`keamanan/`, 8 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Model Ancaman & Pertahanan Berlapis | 1 · Fondasi | 468 | https://kodeloka.asadinedu.com/keamanan/materi/01-model-ancaman-dan-pertahanan-berlapis/ |
| 2 | SQL Injection & Kueri Berparameter | 2 · Injeksi & Input | 537 | https://kodeloka.asadinedu.com/keamanan/materi/02-sql-injection-dan-kueri-berparameter/ |
| 3 | XSS & Keamanan Sisi Peramban | 2 · Injeksi & Input | 525 | https://kodeloka.asadinedu.com/keamanan/materi/03-xss-dan-keamanan-sisi-peramban/ |
| 4 | Autentikasi, Sandi & Sesi | 3 · Identitas | 606 | https://kodeloka.asadinedu.com/keamanan/materi/04-autentikasi-sandi-dan-sesi/ |
| 5 | Otorisasi & Kontrol Akses | 3 · Identitas | 591 | https://kodeloka.asadinedu.com/keamanan/materi/05-otorisasi-dan-kontrol-akses/ |
| 6 | Pengelolaan Rahasia & Enkripsi | 4 · Rahasia & Data | 586 | https://kodeloka.asadinedu.com/keamanan/materi/06-pengelolaan-rahasia-dan-enkripsi/ |
| 7 | Keamanan Dependensi & Rantai Pasok | 5 · Rantai Pasok & API | 486 | https://kodeloka.asadinedu.com/keamanan/materi/07-keamanan-dependensi-dan-rantai-pasok/ |
| 8 | Keamanan API, CSRF & SSRF | 5 · Rantai Pasok & API | 711 | https://kodeloka.asadinedu.com/keamanan/materi/08-keamanan-api-csrf-dan-ssrf/ |

## OpenTelemetry (`opentelemetry/`, 8 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Konsep Inti & Tiga Sinyal | 1 · Fondasi | 528 | https://kodeloka.asadinedu.com/opentelemetry/materi/01-konsep-inti-dan-tiga-sinyal/ |
| 2 | Instrumentasi Otomatis & Manual | 1 · Fondasi | 540 | https://kodeloka.asadinedu.com/opentelemetry/materi/02-instrumentasi-otomatis-dan-manual/ |
| 3 | OpenTelemetry Collector | 2 · Collector | 521 | https://kodeloka.asadinedu.com/opentelemetry/materi/03-opentelemetry-collector/ |
| 4 | Pengambilan Sampel | 2 · Collector | 519 | https://kodeloka.asadinedu.com/opentelemetry/materi/04-pengambilan-sampel/ |
| 5 | Metrik & Instrumen | 3 · Metrik & Log | 581 | https://kodeloka.asadinedu.com/opentelemetry/materi/05-metrik-dan-instrumen/ |
| 6 | Perambatan Konteks Lintas Layanan | 3 · Metrik & Log | 557 | https://kodeloka.asadinedu.com/opentelemetry/materi/06-perambatan-konteks-lintas-layanan/ |
| 7 | Penerapan di Kubernetes | 4 · Produksi | 505 | https://kodeloka.asadinedu.com/opentelemetry/materi/07-penerapan-di-kubernetes/ |
| 8 | Menyelidiki Masalah dengan Telemetri | 4 · Produksi | 651 | https://kodeloka.asadinedu.com/opentelemetry/materi/08-menyelidiki-masalah-dengan-telemetri/ |

## Prometheus (`prometheus/`, 15 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Konsep Prometheus: Model Pull, Time Series & Label |  | 518 | https://kodeloka.asadinedu.com/prometheus/materi/01-konsep-prometheus-model-pull-time-series-dan-label/ |
| 2 | Instalasi Prometheus: Docker, Binary, systemd & Windows |  | 701 | https://kodeloka.asadinedu.com/prometheus/materi/02-instalasi-prometheus-docker-binary-systemd-dan-windows/ |
| 3 | Empat Tipe Metrik: Counter, Gauge, Histogram, Summary |  | 467 | https://kodeloka.asadinedu.com/prometheus/materi/03-empat-tipe-metrik-counter-gauge-histogram-summary/ |
| 4 | Instrumentasi Aplikasi: Go, Python, Node.js & Metode RED |  | 537 | https://kodeloka.asadinedu.com/prometheus/materi/04-instrumentasi-aplikasi-go-python-node-js-dan-metode-red/ |
| 5 | Exporter: node, blackbox, postgres, cAdvisor & Textfile |  | 525 | https://kodeloka.asadinedu.com/prometheus/materi/05-exporter-node-blackbox-postgres-cadvisor-dan-textfile/ |
| 6 | PromQL Dasar: Selector, Matcher & Tipe Vektor |  | 434 | https://kodeloka.asadinedu.com/prometheus/materi/06-promql-dasar-selector-matcher-dan-tipe-vektor/ |
| 7 | rate, irate, increase & Jebakan Counter |  | 463 | https://kodeloka.asadinedu.com/prometheus/materi/07-rate-irate-increase-dan-jebakan-counter/ |
| 8 | Agregasi, Operator & Menghitung SLI |  | 523 | https://kodeloka.asadinedu.com/prometheus/materi/08-agregasi-operator-dan-menghitung-sli/ |
| 9 | Vector Matching Lanjutan: group_left, Subquery & Info Metric |  | 438 | https://kodeloka.asadinedu.com/prometheus/materi/09-vector-matching-lanjutan-group-left-subquery-dan-info-metric/ |
| 10 | Scrape Config, Service Discovery & Relabeling |  | 532 | https://kodeloka.asadinedu.com/prometheus/materi/10-scrape-config-service-discovery-dan-relabeling/ |
| 11 | Recording Rules: Mempercepat Query & Menstabilkan Dashboard |  | 408 | https://kodeloka.asadinedu.com/prometheus/materi/11-recording-rules-mempercepat-query-dan-menstabilkan-dashboard/ |
| 12 | Alerting Rules: Menulis Alert yang Layak Dibunyikan |  | 601 | https://kodeloka.asadinedu.com/prometheus/materi/12-alerting-rules-menulis-alert-yang-layak-dibunyikan/ |
| 13 | Alertmanager: Routing, Grouping, Inhibition & Silence |  | 671 | https://kodeloka.asadinedu.com/prometheus/materi/13-alertmanager-routing-grouping-inhibition-dan-silence/ |
| 14 | Storage, Retensi, Remote Write, HA & Federation |  | 545 | https://kodeloka.asadinedu.com/prometheus/materi/14-storage-retensi-remote-write-ha-dan-federation/ |
| 15 | Kardinalitas, Performa & Troubleshooting |  | 466 | https://kodeloka.asadinedu.com/prometheus/materi/15-kardinalitas-performa-dan-troubleshooting/ |

## Grafana (`grafana/`, 15 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Posisi Grafana: Alat Baca, Bukan Penyimpan Data |  | 576 | https://kodeloka.asadinedu.com/grafana/materi/01-posisi-grafana-alat-baca-bukan-penyimpan-data/ |
| 2 | Instalasi & Konfigurasi: grafana.ini, Env Var, Reverse Proxy |  | 547 | https://kodeloka.asadinedu.com/grafana/materi/02-instalasi-dan-konfigurasi-grafana-ini-env-var-reverse-proxy/ |
| 3 | Data Source: Prometheus, Loki, SQL, dan Aturan UID |  | 566 | https://kodeloka.asadinedu.com/grafana/materi/03-data-source-prometheus-loki-sql-dan-aturan-uid/ |
| 4 | Anatomi Dashboard: JSON Model, Panel, dan Time Range |  | 559 | https://kodeloka.asadinedu.com/grafana/materi/04-anatomi-dashboard-json-model-panel-dan-time-range/ |
| 5 | Query Editor, $__interval, dan Legenda yang Terbaca |  | 492 | https://kodeloka.asadinedu.com/grafana/materi/05-query-editor-interval-dan-legenda-yang-terbaca/ |
| 6 | Memilih Visualisasi: Time Series, Stat, Table, Heatmap, dan Kawan-kawan |  | 683 | https://kodeloka.asadinedu.com/grafana/materi/06-memilih-visualisasi-time-series-stat-table-heatmap-dan-kawan-kawan/ |
| 7 | Field Config: Unit, Threshold, Value Mapping, dan Override |  | 664 | https://kodeloka.asadinedu.com/grafana/materi/07-field-config-unit-threshold-value-mapping-dan-override/ |
| 8 | Variabel & Templating: Satu Dashboard untuk Semua Lingkungan |  | 539 | https://kodeloka.asadinedu.com/grafana/materi/08-variabel-dan-templating-satu-dashboard-untuk-semua-lingkungan/ |
| 9 | Transformations: Mengolah Data Frame Sebelum Digambar |  | 642 | https://kodeloka.asadinedu.com/grafana/materi/09-transformations-mengolah-data-frame-sebelum-digambar/ |
| 10 | Merancang Dashboard yang Dipakai: Baris, Anotasi, Tautan |  | 618 | https://kodeloka.asadinedu.com/grafana/materi/10-merancang-dashboard-yang-dipakai-baris-anotasi-tautan/ |
| 11 | Unified Alerting: Rule, Expression, dan State Machine |  | 837 | https://kodeloka.asadinedu.com/grafana/materi/11-unified-alerting-rule-expression-dan-state-machine/ |
| 12 | Korelasi: Loki, Tempo, Exemplar, dan Explore |  | 755 | https://kodeloka.asadinedu.com/grafana/materi/12-korelasi-loki-tempo-exemplar-dan-explore/ |
| 13 | Autentikasi, Organisasi, Tim, dan Izin |  | 676 | https://kodeloka.asadinedu.com/grafana/materi/13-autentikasi-organisasi-tim-dan-izin/ |
| 14 | Performa & Skala: Dashboard Cepat, Grafana Tahan Beban |  | 660 | https://kodeloka.asadinedu.com/grafana/materi/14-performa-dan-skala-dashboard-cepat-grafana-tahan-beban/ |
| 15 | Dashboard as Code: Provisioning, Backup, dan Upgrade |  | 959 | https://kodeloka.asadinedu.com/grafana/materi/15-dashboard-as-code-provisioning-backup-dan-upgrade/ |

## k6 (`k6/`, 15 modul)

| No | Judul | Kategori | Kata | Halaman |
| ---: | :--- | :--- | ---: | :--- |
| 1 | Kenapa Load Testing Wajib & Posisi k6 |  | 598 | https://kodeloka.asadinedu.com/k6/materi/01-kenapa-load-testing-wajib-dan-posisi-k6/ |
| 2 | Instalasi k6 di Windows, macOS, Linux & Docker |  | 448 | https://kodeloka.asadinedu.com/k6/materi/02-instalasi-k6-di-windows-macos-linux-dan-docker/ |
| 3 | Anatomi Skrip & Siklus Hidup (Lifecycle) |  | 532 | https://kodeloka.asadinedu.com/k6/materi/03-anatomi-skrip-dan-siklus-hidup-lifecycle/ |
| 4 | HTTP Request Lengkap: GET, POST, Header, Batch, Upload |  | 495 | https://kodeloka.asadinedu.com/k6/materi/04-http-request-lengkap-get-post-header-batch-upload/ |
| 5 | Check, Group & Threshold — Menentukan Lulus atau Gagal |  | 440 | https://kodeloka.asadinedu.com/k6/materi/05-check-group-dan-threshold-menentukan-lulus-atau-gagal/ |
| 6 | Options & Konfigurasi: VU, Stages, Env, Urutan Prioritas |  | 548 | https://kodeloka.asadinedu.com/k6/materi/06-options-dan-konfigurasi-vu-stages-env-urutan-prioritas/ |
| 7 | Data Uji: SharedArray, CSV, dan Data Unik per VU |  | 480 | https://kodeloka.asadinedu.com/k6/materi/07-data-uji-sharedarray-csv-dan-data-unik-per-vu/ |
| 8 | Metrik Bawaan & Metrik Kustom (Counter, Gauge, Rate, Trend) |  | 478 | https://kodeloka.asadinedu.com/k6/materi/08-metrik-bawaan-dan-metrik-kustom-counter-gauge-rate-trend/ |
| 9 | Executors & Scenarios — Closed vs Open Model |  | 476 | https://kodeloka.asadinedu.com/k6/materi/09-executors-dan-scenarios-closed-vs-open-model/ |
| 10 | Autentikasi & Correlation: JWT, Cookie, CSRF, Refresh Token |  | 590 | https://kodeloka.asadinedu.com/k6/materi/10-autentikasi-dan-correlation-jwt-cookie-csrf-refresh-token/ |
| 11 | Di Luar HTTP: WebSocket, gRPC, dan Browser Testing |  | 625 | https://kodeloka.asadinedu.com/k6/materi/11-di-luar-http-websocket-grpc-dan-browser-testing/ |
| 12 | Output & Integrasi: Prometheus, Grafana, JSON, handleSummary |  | 440 | https://kodeloka.asadinedu.com/k6/materi/12-output-dan-integrasi-prometheus-grafana-json-handlesummary/ |
| 13 | k6 di CI/CD: Quality Gate Otomatis |  | 444 | https://kodeloka.asadinedu.com/k6/materi/13-k6-di-ci-cd-quality-gate-otomatis/ |
| 14 | Distributed Testing: Kubernetes & k6-operator |  | 373 | https://kodeloka.asadinedu.com/k6/materi/14-distributed-testing-kubernetes-dan-k6-operator/ |
| 15 | Analisis Hasil & Menemukan Bottleneck Sebenarnya |  | 629 | https://kodeloka.asadinedu.com/k6/materi/15-analisis-hasil-dan-menemukan-bottleneck-sebenarnya/ |
