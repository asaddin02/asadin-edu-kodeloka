/* ==========================================================================
   Golang Complete (27 Domain, 267 Bab) - Interactive Tutorial
   Chapter order follows the Go video series by Programmer Zaman Now (Eko Kurniawan Khannedy).
   ========================================================================== */

const chapters = [
{
        "id": 1,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "00:02:41",
        "title": "Pengenalan Golang",
        "desc": "Sejarah, latar belakang pembuatan Go oleh Google, serta keunggulannya dibanding bahasa lain.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Apa itu Go (Golang)?</h3>\n                <p><strong>Go</strong> (atau sering disebut <strong>Golang</strong>) adalah bahasa pemrograman open source yang dikembangkan di Google oleh <strong>Robert Griesemer, Rob Pike, dan Ken Thompson</strong> pada tahun 2007 dan dirilis ke publik pada tahun 2009.</p>\n                <p>Go diciptakan untuk menyelesaikan permasalahan skalabilitas dan kompleksitas pengembangan software skala besar di Google yang sebelumnya didominasi oleh C++ dan Java.</p>\n\n                <div class=\"callout callout-info\">\n                    <div class=\"callout-title\">💡 Karakteristik Utama Golang:</div>\n                    <ul>\n                        <li><strong>Compiled Language:</strong> Kompilasi langsung ke kode mesin (*native machine code*), sangat cepat tanpa butuh VM.</li>\n                        <li><strong>Statically Typed:</strong> Pengecekan tipe data terjadi pada saat kompilasi (*compile-time*).</li>\n                        <li><strong>Garbage Collected:</strong> Manajemen memori otomatis yang sangat cepat dan efisien.</li>\n                        <li><strong>Built-in Concurrency:</strong> Dukungan Concurrency kelas satu menggunakan <em>Goroutines</em> & <em>Channels</em>.</li>\n                        <li><strong>Simplicity & Cleanliness:</strong> Sintaks yang ringkas, konsisten, dan mudah dipelajari (hanya ~25 keyword).</li>\n                    </ul>\n                </div>\n\n                <h3>Mengapa Belajar Golang?</h3>\n                <table class=\"tech-table\">\n                    <thead>\n                        <tr><th>Kriteria</th><th>Bahasa Lain (Java / Python)</th><th>Golang</th></tr>\n                    </thead>\n                    <tbody>\n                        <tr><td>Kecepatan Eksekusi</td><td>Sedang / Lambat (Interpreted / JVM)</td><td>Sangat Cepat (Native Binary)</td></tr>\n                        <tr><td>Penggunaan Memori</td><td>Relatif Besar</td><td>Sangat Ringat (Memory footprint kecil)</td></tr>\n                        <tr><td>Ukuran Binary</td><td>Membutuhkan Runtime (JRE/Python interpreter)</td><td>Single Self-Contained Binary</td></tr>\n                        <tr><td>Concurrency</td><td>Thread berat (OS Thread)</td><td>Goroutine ultra-ringan (~2KB per goroutine)</td></tr>\n                    </tbody>\n                </table>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Selamat Datang di Kelas Golang Kodeloka!\")\n\tfmt.Println(\"Go diciptakan oleh Robert Griesemer, Rob Pike, dan Ken Thompson di Google.\")\n}",
        "quiz": {
                "question": "Siapa sajakah tokoh kunci pencipta bahasa pemrograman Go di Google?",
                "options": [
                        "Guido van Rossum, James Gosling, dan Brendan Eich",
                        "Robert Griesemer, Rob Pike, dan Ken Thompson",
                        "Dennis Ritchie, Bjarne Stroustrup, dan Linus Torvalds",
                        "Tim Berners-Lee dan Anders Hejlsberg"
                ],
                "correctIndex": 1,
                "explanation": "Go dikembangkan di Google pada tahun 2007 oleh Robert Griesemer, Rob Pike, dan Ken Thompson."
        }
},
{
        "id": 2,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "00:07:53",
        "title": "Menginstall Golang & Setup Environment",
        "desc": "Langkah-langkah instalasi compiler Go, pemeriksaan environment variables, dan konfigurasi VS Code.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Instalasi Compiler Go</h3>\n                <p>Untuk menjalankan program Go di komputer lokal, Anda perlu mengunduh installer resmi dari situs web <a href=\"https://go.dev/dl/\" target=\"_blank\" style=\"color: var(--go-blue)\">https://go.dev/dl/</a>.</p>\n\n                <div class=\"callout callout-tip\">\n                    <div class=\"callout-title\">📌 Langkah Perintah Terminal:</div>\n                    <p>Setelah instalasi, jalankan perintah berikut di terminal/command prompt untuk memverifikasi:</p>\n                </div>\n\n                <div class=\"code-box\">\n                    <div class=\"code-box-header\"><span>Terminal</span></div>\n                    <pre># Memeriksa versi Go yang terinstall\ngo version\n\n# Memeriksa environment variables Go (GOROOT, GOPATH, dll)\ngo env</pre>\n                </div>\n\n                <h3>Struktur Environment Go:</h3>\n                <ul>\n                    <li><code>GOROOT</code>: Lokasi di mana runtime & SDK Golang terinstall di sistem operasi.</li>\n                    <li><code>GOPATH</code>: Workspace utama proyek Go lokal Anda (pada Go versi modern dengan Go Modules, lokasi direktori bebas).</li>\n                </ul>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"runtime\"\n)\n\nfunc main() {\n\tfmt.Println(\"Versi Go Runtime:\", runtime.Version())\n\tfmt.Println(\"Jumlah CPU Core:\", runtime.NumCPU())\n\tfmt.Println(\"Sistem Operasi:\", runtime.GOOS)\n\tfmt.Println(\"Arsitektur CPU:\", runtime.GOARCH)\n}",
        "quiz": {
                "question": "Perintah CLI apa yang digunakan untuk mengecek versi Golang yang terinstall pada sistem?",
                "options": [
                        "go --check",
                        "go version",
                        "golang -v",
                        "go info"
                ],
                "correctIndex": 1,
                "explanation": "'go version' adalah perintah standar untuk melihat versi Go yang sedang aktif."
        }
},
{
        "id": 3,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "00:11:46",
        "title": "Membuat Project Go",
        "desc": "Inisialisasi Go Modules dengan 'go mod init' dan memahami struktur folder proyek Go modern.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Go Modules (Dependency Management)</h3>\n                <p>Sejak Go versi 1.11+, pengelolaan proyek dan package Go menggunakan <strong>Go Modules</strong>. Dengan Go Modules, Anda tidak wajib menaruh kode proyek di dalam folder GOPATH.</p>\n\n                <div class=\"code-box\">\n                    <div class=\"code-box-header\"><span>Terminal Command</span></div>\n                    <pre># 1. Buat folder proyek baru\nmkdir belajar-golang-dasar\ncd belajar-golang-dasar\n\n# 2. Inisialisasi modul proyek Go\ngo mod init belajar-golang-dasar</pre>\n                </div>\n\n                <p>Perintah <code>go mod init</code> akan menghasilkan file <code>go.mod</code> yang mencatat nama modul dan versi Go yang digunakan.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Proyek Go Modules Berhasil Dibuat!\")\n\tfmt.Println(\"File go.mod berfungsi sebagai pengelola dependency & nama module proyek.\")\n}",
        "quiz": {
                "question": "File apakah yang dibuat secara otomatis saat menjalankan perintah 'go mod init nama-module'?",
                "options": [
                        "package.json",
                        "go.sum",
                        "go.mod",
                        "main.go"
                ],
                "correctIndex": 2,
                "explanation": "'go mod init' membuat file 'go.mod' yang menyimpan manifestasi module dan dependency proyek."
        }
},
{
        "id": 4,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "00:15:35",
        "title": "Program Hello World",
        "desc": "Membedah struktur file utama Go: package main, import fmt, dan fungsi main().",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Struktur Anatomi Kode Go</h3>\n                <p>Setiap file kode Go terdiri dari 3 bagian utama:</p>\n                <ol>\n                    <li><code>package main</code>: Deklarasi package. Package <code>main</code> adalah penanda bahwa file ini adalah entry point aplikasi executable.</li>\n                    <li><code>import \"fmt\"</code>: Mengimpor package bawaan Go (Formated I/O) untuk mencetak output.</li>\n                    <li><code>func main()</code>: Fungsi utama yang pertama kali dieksekusi oleh runtime Go.</li>\n                </ol>\n\n                <div class=\"callout callout-warning\">\n                    <div class=\"callout-title\">⚠️ Aturan Sintaks Penting:</div>\n                    <ul>\n                        <li>Go sensitif terhadap <em>Case Sensitivity</em> (Huruf besar & kecil berpengaruh).</li>\n                        <li>Tidak memerlukan titik koma (<code>;</code>) di akhir setiap baris kode!</li>\n                        <li>Kurung kurawal buka <code>{</code> <strong>HARUS</strong> berada di baris yang sama dengan deklarasi <code>func main()</code>!</li>\n                    </ul>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Hello World!\")\n\tfmt.Println(\"Belajar Golang Dasar bersama Kodeloka\")\n}",
        "quiz": {
                "question": "Package apakah yang wajib digunakan jika file Go ingin dieksekusi sebagai aplikasi utama (executable)?",
                "options": [
                        "package root",
                        "package main",
                        "package system",
                        "package app"
                ],
                "correctIndex": 1,
                "explanation": "Package 'main' wajib ada untuk memberi tahu compiler Go bahwa kode tersebut berisi entry point fungsi main()."
        }
},
{
        "id": 5,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "00:26:11",
        "title": "Multiple Main Function",
        "desc": "Aturan pembuatan file dalam package main dan cara mengeksekusi file tertentu.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Aturan Multiple Main Function</h3>\n                <p>Dalam satu folder package yang sama, Go <strong>tidak mengizinkan</strong> adanya lebih dari satu fungsi <code>main()</code> jika Anda mengompilasi seluruh direktori secara bersamaan (misal: <code>go run .</code>).</p>\n\n                <p>Jika ingin menjalankan file tertentu yang memiliki main function tersendiri:</p>\n                <div class=\"code-box\">\n                    <div class=\"code-box-header\"><span>Terminal Command</span></div>\n                    <pre># Menjalankan spesifik satu file saja:\ngo run helper.go\n\n# Menjalankan main.go saja:\ngo run main.go</pre>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"File ini memiliki main function tersendiri.\")\n\tfmt.Println(\"Gunakan 'go run namafile.go' jika dalam 1 folder ada beberapa file berketerangan main.\")\n}",
        "quiz": {
                "question": "Apa yang terjadi jika menjalankan 'go run .' pada folder yang berisi dua file dengan fungsi main() yang sama?",
                "options": [
                        "Aplikasi berjalan normal memilih file pertama secara acak",
                        "Terjadi error kompilasi: 'main redeclared in this block'",
                        "Go akan menggabungkan kedua fungsi main tersebut",
                        "File kedua akan otomatis diabaikan"
                ],
                "correctIndex": 1,
                "explanation": "Compiler Go akan menolak karena dalam satu package tidak boleh ada duplikasi simbol nama fungsi main."
        }
},
{
        "id": 6,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "00:30:29",
        "title": "Tipe Data Number",
        "desc": "Klasifikasi Integer (int8 - int64, uint), Floating Point (float32, float64), dan Tipe Alias (byte, rune).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>1. Integer (Bilangan Bulat)</h3>\n                <table class=\"tech-table\">\n                    <thead>\n                        <tr><th>Tipe Data Signed (+/-)</th><th>Tipe Data Unsigned (+)</th><th>Rentang Nilai</th></tr>\n                    </thead>\n                    <tbody>\n                        <tr><td><code>int8</code></td><td><code>uint8</code></td><td>-128 s/d 127 (int8) / 0 s/d 255 (uint8)</td></tr>\n                        <tr><td><code>int16</code></td><td><code>uint16</code></td><td>-32,768 s/d 32,767</td></tr>\n                        <tr><td><code>int32</code></td><td><code>uint32</code></td><td>-2,147,483,648 s/d 2,147,483,647</td></tr>\n                        <tr><td><code>int64</code></td><td><code>uint64</code></td><td>-9,223,372,036,854,775,808 s/d 9...</td></tr>\n                        <tr><td><code>int</code></td><td><code>uint</code></td><td>Sesuai arsitektur OS (32-bit / 64-bit)</td></tr>\n                    </tbody>\n                </table>\n\n                <h3>2. Floating Point (Bilangan Desimal)</h3>\n                <ul>\n                    <li><code>float32</code>: Presisi 32-bit desimal.</li>\n                    <li><code>float64</code>: Presisi 64-bit desimal (Default rekomendasi).</li>\n                </ul>\n\n                <h3>3. Alias Tipe Data Number</h3>\n                <ul>\n                    <li><code>byte</code> = Alias untuk <code>uint8</code></li>\n                    <li><code>rune</code> = Alias untuk <code>int32</code> (representasi Karakter Unicode)</li>\n                </ul>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar nilaiInt8 int8 = 100\n\tvar nilaiUint uint = 250\n\tvar IPK float32 = 3.85\n\tvar desimal float64 = 100.99\n\tvar hurufA byte = 'A' // uint8 ascii value\n\n\tfmt.Println(\"int8:\", nilaiInt8)\n\tfmt.Println(\"uint:\", nilaiUint)\n\tfmt.Println(\"IPK (float32):\", IPK)\n\tfmt.Println(\"desimal (float64):\", desimal)\n\tfmt.Println(\"byte 'A' (ASCII Code):\", hurufA)\n}",
        "quiz": {
                "question": "Tipe data alias apakah 'byte' di dalam bahasa Go?",
                "options": [
                        "int8",
                        "uint8",
                        "int32",
                        "rune"
                ],
                "correctIndex": 1,
                "explanation": "'byte' merupakan tipe alias langsung untuk 'uint8' (unsigned 8-bit integer)."
        }
},
{
        "id": 7,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "00:38:14",
        "title": "Tipe Data Boolean",
        "desc": "Representasi nilai kebenaran logika boolean: true dan false.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Tipe Data Boolean (bool)</h3>\n                <p>Tipe data boolean di Go dipresentasikan dengan keyword <code>bool</code>. Tipe data ini hanya memiliki dua nilai yang mungkin:</p>\n                <ul>\n                    <li><code>true</code> (Benar)</li>\n                    <li><code>false</code> (Salah)</li>\n                </ul>\n\n                <div class=\"callout callout-info\">\n                    <div class=\"callout-title\">Nilai Default (Zero Value):</div>\n                    <p>Nilai awal/default dari variabel berjenis <code>bool</code> jika tidak diinisialisasi adalah <code>false</code>.</p>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar benar bool = true\n\tvar salah bool = false\n\n\tfmt.Println(\"Benar =\", benar)\n\tfmt.Println(\"Salah =\", salah)\n}",
        "quiz": {
                "question": "Apakah zero value (nilai default) dari variabel bertipe boolean di Golang?",
                "options": [
                        "nil",
                        "0",
                        "false",
                        "true"
                ],
                "correctIndex": 2,
                "explanation": "Zero value untuk tipe data boolean adalah 'false'."
        }
},
{
        "id": 8,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "00:40:12",
        "title": "Tipe Data String",
        "desc": "Memahami string di Go, fungsi len(), dan pengaksesan karakter berdasarkan byte index.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>String di Golang</h3>\n                <p>String adalah kumpulan karakter yang diapit oleh tanda petik dua (<code>\"...\"</code>) atau backtick (<code>`...`</code>).</p>\n\n                <h3>Fungsi Penting untuk String:</h3>\n                <ul>\n                    <li><code>len(\"string\")</code>: Mengembalikan jumlah byte dalam string.</li>\n                    <li><code>\"string\"[index]</code>: Mengambil byte/karakter pada indeks tertentu (mengembalikan kode ASCII / uint8).</li>\n                </ul>\n\n                <div class=\"callout callout-warning\">\n                    <div class=\"callout-title\">⚠️ Pengaksesan Indeks String:</div>\n                    <p>Mengakses <code>\"Eko\"[0]</code> tidak menghasilkan karakter <code>\"E\"</code>, melainkan kode ASCII dari huruf E yaitu <code>69</code>!</p>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar nama string = \"Eko Kurniawan\"\n\n\tfmt.Println(\"Nama:\", nama)\n\tfmt.Println(\"Panjang String (len):\", len(nama))\n\tfmt.Println(\"Karakter pertama (byte ASCII):\", nama[0])\n\tfmt.Println(\"Karakter pertama (String):\", string(nama[0]))\n}",
        "quiz": {
                "question": "Apa hasil kembalian dari ekspresi 'Programmer'[0] pada Golang?",
                "options": [
                        "String 'P'",
                        "Nilai byte (ASCII int) dari karakter 'P'",
                        "Boolean true",
                        "Error kompilasi"
                ],
                "correctIndex": 1,
                "explanation": "Pengaksesan array index pada string mengembalikan kode byte (uint8) dari karakter tersebut."
        }
},
{
        "id": 9,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "00:45:23",
        "title": "Variable",
        "desc": "Cara deklarasi variabel dengan var, tipe implisit, sintaks := (short declaration), serta deklarasi multiple variable.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Cara Deklarasi Variabel di Go</h3>\n                <p>Ada beberapa sintaks fleksibel untuk mendefinisikan variabel di Go:</p>\n                \n                <ol>\n                    <li><strong>Deklarasi Eksplisit dengan <code>var</code>:</strong><br>\n                        <code>var name string = \"Eko\"</code>\n                    </li>\n                    <li><strong>Deklarasi Implisit (Type Inference):</strong><br>\n                        <code>var age = 30</code> (Go otomatis mendeteksi bahwa age adalah int).\n                    </li>\n                    <li><strong>Short Declaration dengan kata kunci <code>:=</code>:</strong><br>\n                        <code>country := \"Indonesia\"</code> (Kata kunci <code>var</code> tidak diperlukan lagi saat pertama kali deklarasi).\n                    </li>\n                    <li><strong>Multiple Variable Declaration:</strong><br>\n                        <code>var ( firstName = \"Eko\"; lastName = \"Khannedy\" )</code>\n                    </li>\n                </ol>\n\n                <div class=\"callout callout-danger\">\n                    <div class=\"callout-title\">🚨 Aturan Wajib Golang:</div>\n                    <p>Setiap variabel local yang sudah dideklarasikan <strong>HARUS DUGUNAKAN</strong>. Jika ada variabel nganggur/tidak terpakai, Go akan menghasilkan error kompilasi!</p>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t// Deklarasi var eksplisit\n\tvar name string = \"Eko Kurniawan\"\n\tfmt.Println(\"Nama:\", name)\n\n\t// Short declaration :=\n\tage := 30\n\tfmt.Println(\"Umur:\", age)\n\n\t// Multiple Variable\n\tvar (\n\t\tfirstName = \"Eko\"\n\t\tlastName  = \"Khannedy\"\n\t)\n\tfmt.Println(\"Full Name:\", firstName, lastName)\n}",
        "quiz": {
                "question": "Kapan kata kunci ':=' (short declaration) dapat digunakan?",
                "options": [
                        "Untuk re-assign variabel yang sudah ada",
                        "Hanya pada saat pertama kali mendeklarasikan variabel baru",
                        "Hanya untuk variabel berjenis constant",
                        "Di luar fungsi main (global variable)"
                ],
                "correctIndex": 1,
                "explanation": "Sintaks ':=' digunakan untuk mendeklarasikan variabel baru beserta inisialisasi nilainya secara singkat."
        }
},
{
        "id": 10,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "00:54:37",
        "title": "Constant",
        "desc": "Mengenal konstan (const), sifat immutabilitas, serta deklarasi multiple constant.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Constant (Konstanta)</h3>\n                <p><strong>Constant</strong> adalah variabel yang nilainya <strong>tetap dan tidak dapat diubah</strong> kembali setelah pertama kali dideklarasikan.</p>\n                \n                <p>Konstanta dideklarasikan menggunakan kata kunci <code>const</code>.</p>\n\n                <div class=\"callout callout-tip\">\n                    <div class=\"callout-title\">Keistimewaan Constant di Go:</div>\n                    <p>Berbeda dari variabel biasa, jika Anda membuat constant tetapi <strong>tidak menggunakannya</strong> di dalam kode, Go <strong>TIDAK akan komplain/error</strong>!</p>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tconst firstName string = \"Eko\"\n\tconst lastName = \"Khannedy\"\n\tconst value = 1000\n\n\t// Multiple const\n\tconst (\n\t\tpi = 3.14\n\t\tapplication = \"Belajar Golang\"\n\t)\n\n\tfmt.Println(firstName, lastName)\n\tfmt.Println(\"App:\", application, \"PI:\", pi)\n\t// firstName = \"Budi\" // ERROR! Cannot assign to constant\n}",
        "quiz": {
                "question": "Apa yang terjadi jika variabel constant yang sudah dideklarasikan tidak pernah dipanggil di dalam fungsi?",
                "options": [
                        "Terjadi error kompilasi 'unused variable'",
                        "Kode tetap berhasil dikompilasi tanpa error",
                        "Compiler menghapus file main.go",
                        "Program akan panic saat dijalankan"
                ],
                "correctIndex": 1,
                "explanation": "Tidak seperti variabel biasa, constant yang tidak digunakan tidak akan menyebabkan error kompilasi."
        }
},
{
        "id": 11,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "00:58:27",
        "title": "Konversi Tipe Data",
        "desc": "Teknik kasting/konversi tipe data number (integer overflow) dan konversi byte ke string.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Konversi Tipe Data (Type Casting)</h3>\n                <p>Di Go, kita bisa mengonversi satu tipe data ke tipe data lainnya dengan cara memanggil nama tipe tujuannya sebagai fungsi: <code>TipeTujuan(nilai)</code>.</p>\n\n                <div class=\"callout callout-warning\">\n                    <div class=\"callout-title\">⚠️ Bahaya Integer Overflow:</div>\n                    <p>Jika Anda mengonversi tipe data angka berkapasitas besar (misal <code>int32(300)</code>) ke tipe data angka berkapasitas lebih kecil (misal <code>int8</code> yang batas maksnya 127), nilai akan memutar mutar balik (overflow) ke angka minus!</p>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tvar nilai32 int32 = 32768\n\tvar nilai64 int64 = int64(nilai32)\n\tvar nilai8 int8 = int8(nilai32) // Terjadi Integer Overflow!\n\n\tfmt.Println(\"int32:\", nilai32)\n\tfmt.Println(\"int64:\", nilai64)\n\tfmt.Println(\"int8 (Overflow):\", nilai8)\n\n\t// Konversi Byte ke String\n\tvar name = \"Eko\"\n\tvar eByte byte = name[0]\n\tvar eString string = string(eByte)\n\tfmt.Println(\"String dari byte index 0:\", eString)\n}",
        "quiz": {
                "question": "Apa efek yang terjadi jika nilai int32 bernilai 1000 dikonversi ke tipe int8?",
                "options": [
                        "Nilai terpotong otomatis menjadi 127",
                        "Terjadi Integer Overflow sehingga nilainya berubah menjadi salah/minus",
                        "Program mengalami panic crash",
                        "Nilai tetap 1000 tanpa perubahan"
                ],
                "correctIndex": 1,
                "explanation": "Karena int8 hanya menampung nilai max 127, mengonversi 1000 akan menyebabkan nilai memutar balik (overflow)."
        }
},
{
        "id": 12,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "01:05:49",
        "title": "Type Declarations",
        "desc": "Membuat alias tipe data kustom untuk meningkatkan kejelasan dan keterbacaan kode.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Type Declarations (Custom Type)</h3>\n                <p><strong>Type Declarations</strong> adalah kemampuan membuat alias untuk tipe data yang sudah ada di Go. Ini berguna untuk memperjelas maksud/domain data.</p>\n                \n                <p>Sintaks: <code>type NamaTipeBaru TipeLama</code></p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\ttype NoKTP string\n\ttype Married bool\n\n\tvar ktpEko NoKTP = \"1111111111111111\"\n\tvar statusNikah Married = true\n\n\tfmt.Println(\"No KTP:\", ktpEko)\n\tfmt.Println(\"Status Menikah:\", statusNikah)\n}",
        "quiz": {
                "question": "Sintaks manakah yang benar untuk membuat alias tipe data kustom 'NoKTP' berbasis tipe string?",
                "options": [
                        "var NoKTP = string",
                        "type NoKTP string",
                        "create type NoKTP as string",
                        "alias NoKTP string"
                ],
                "correctIndex": 1,
                "explanation": "Sintaks deklarasi tipe data baru di Go menggunakan kata kunci 'type NamaAlias TipeAsli'."
        }
},
{
        "id": 13,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "01:09:08",
        "title": "Operasi Matematika",
        "desc": "Operator aritmatika dasar (+, -, *, /, %), augmented assignments (+=, -=), dan unary operators (++).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Operator Aritmatika Dasar</h3>\n                <ul>\n                    <li><code>+</code> (Penjumlahan)</li>\n                    <li><code>-</code> (Pengurangan)</li>\n                    <li><code>*</code> (Perkalian)</li>\n                    <li><code>/</code> (Pembagian)</li>\n                    <li><code>%</code> (Sisa Bagi / Modulo)</li>\n                </ul>\n\n                <h3>Augmented Assignments & Unary</h3>\n                <table class=\"tech-table\">\n                    <thead>\n                        <tr><th>Operator Augmented</th><th>Singkatan Dari</th><th>Unary Operator</th><th>Keterangan</th></tr>\n                    </thead>\n                    <tbody>\n                        <tr><td><code>a += 10</code></td><td><code>a = a + 10</code></td><td><code>a++</code></td><td><code>a = a + 1</code></td></tr>\n                        <tr><td><code>a -= 5</code></td><td><code>a = a - 5</code></td><td><code>a--</code></td><td><code>a = a - 1</code></td></tr>\n                        <tr><td><code>a *= 2</code></td><td><code>a = a * 2</code></td><td><code>-a</code></td><td>Negative number</td></tr>\n                    </tbody>\n                </table>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\ta := 10\n\tb := 3\n\n\tfmt.Println(\"10 + 3 =\", a+b)\n\tfmt.Println(\"10 - 3 =\", a-b)\n\tfmt.Println(\"10 * 3 =\", a*b)\n\tfmt.Println(\"10 / 3 =\", a/b) // Pembagian integer menghasilkan integer!\n\tfmt.Println(\"10 % 3 =\", a%b)\n\n\t// Augmented & Unary\n\ti := 5\n\ti += 10 // i = 15\n\tfmt.Println(\"Augmented i += 10:\", i)\n\n\ti++ // i = 16\n\tfmt.Println(\"Unary i++:\", i)\n}",
        "quiz": {
                "question": "Berapakah hasil dari pembagian integer 10 / 3 di Golang?",
                "options": [
                        "3.3333",
                        "3",
                        "3.0",
                        "4"
                ],
                "correctIndex": 1,
                "explanation": "Pembagian antara dua angka bertipe integer di Go akan menghasilkan angka integer (dibulatkan ke bawah) yaitu 3."
        }
},
{
        "id": 14,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "01:14:51",
        "title": "Operasi Perbandingan",
        "desc": "Membandingkan dua nilai dengan operator >, <, >=, <=, ==, != yang menghasilkan nilai boolean.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Operator Perbandingan</h3>\n                <p>Operator perbandingan digunakan untuk membandingkan dua buah nilai dan selalu mengembalikan hasil bertipe <code>bool</code> (true/false).</p>\n                <ul>\n                    <li><code>&gt;</code> (Lebih besar dari)</li>\n                    <li><code>&lt;</code> (Lebih kecil dari)</li>\n                    <li><code>&gt;=</code> (Lebih besar atau sama dengan)</li>\n                    <li><code>&lt;=</code> (Lebih kecil atau sama dengan)</li>\n                    <li><code>==</code> (Sama dengan)</li>\n                    <li><code>!=</code> (Tidak sama dengan)</li>\n                </ul>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tname1 := \"Eko\"\n\tname2 := \"Eko\"\n\n\tvar resultEqual bool = name1 == name2\n\tfmt.Println(\"name1 == name2:\", resultEqual)\n\n\tval1 := 100\n\tval2 := 200\n\tfmt.Println(\"100 > 200:\", val1 > val2)\n\tfmt.Println(\"100 != 200:\", val1 != val2)\n}",
        "quiz": {
                "question": "Operator manakah yang digunakan untuk mengecek apakah dua nilai TIDAK SAMA DENGAN?",
                "options": [
                        "==",
                        "<>",
                        "!=",
                        "not"
                ],
                "correctIndex": 2,
                "explanation": "Operator '!=' (Not Equal) digunakan untuk memeriksa apakah dua nilai tidak sama."
        }
},
{
        "id": 15,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "01:21:34",
        "title": "Operasi Boolean",
        "desc": "Logika Boolean dengan operator AND (&&), OR (||), dan NOT (!).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Operator Logika Boolean</h3>\n                <table class=\"tech-table\">\n                    <thead>\n                        <tr><th>Operator</th><th>Nama</th><th>Keterangan Rule</th></tr>\n                    </thead>\n                    <tbody>\n                        <tr><td><code>&&</code></td><td>AND</td><td>Mengembalikan <code>true</code> HANYA JIKA kedua kondisi bernilai <code>true</code>.</td></tr>\n                        <tr><td><code>||</code></td><td>OR</td><td>Mengembalikan <code>true</code> JIKA SALAH SATU kondisi bernilai <code>true</code>.</td></tr>\n                        <tr><td><code>!</code></td><td>NOT</td><td>Membalikkan nilai boolean (<code>!true</code> menjadi <code>false</code>).</td></tr>\n                    </tbody>\n                </table>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tnilaiUjian := 80\n\tnilaiAbsensi := 75\n\n\tlulusUjian := nilaiUjian >= 75\n\tlulusAbsensi := nilaiAbsensi >= 75\n\n\tlulusFinal := lulusUjian && lulusAbsensi\n\tfmt.Println(\"Apakah Lulus Kelulusan Akhir (AND):\", lulusFinal)\n\tfmt.Println(\"Pembalikan Logika (!lulusFinal):\", !lulusFinal)\n}",
        "quiz": {
                "question": "Hasil evaluasi dari ekspresi: (true && false) || !false adalah...",
                "options": [
                        "false",
                        "true",
                        "nil",
                        "error"
                ],
                "correctIndex": 1,
                "explanation": "(true && false) menghasilkan false. !false menghasilkan true. false || true menghasilkan true."
        }
},
{
        "id": 16,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "01:27:46",
        "title": "Tipe Data Array",
        "desc": "Struktur data Array dengan panjang tetap (fixed length), inisialisasi array, dan fungsi len().",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Tipe Data Array</h3>\n                <p><strong>Array</strong> adalah kumpulan data sekumpulan tipe data yang sama dengan <strong>kapasitas/panjang yang FIXED (tetap)</strong> dan tidak bisa diubah setelah dibuat.</p>\n\n                <div class=\"callout callout-warning\">\n                    <div class=\"callout-title\">⚠️ Sifat Array Go:</div>\n                    <p>Ukuran array merupakan bagian dari tipe data array itu sendiri. <code>[3]int</code> dan <code>[5]int</code> adalah 2 tipe data yang berbeda di Go!</p>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t// Deklarasi Array Manual\n\tvar names [3]string\n\tnames[0] = \"Eko\"\n\tnames[1] = \"Kurniawan\"\n\tnames[2] = \"Khannedy\"\n\n\tfmt.Println(names[0], names[1], names[2])\n\n\t// Array Literal dengan Deklarasi Langsung\n\tvalues := [...]int{90, 85, 95, 100}\n\tfmt.Println(\"Array values:\", values)\n\tfmt.Println(\"Panjang Array values:\", len(values))\n}",
        "quiz": {
                "question": "Manakah pernyataan yang BENAR mengenai Array di Go?",
                "options": [
                        "Ukuran array di Go bersifat dinamis dan dapat bertambah dengan append()",
                        "Ukuran array bersifat tetap (fixed) dan ditentukan sejak deklarasi dibuat",
                        "Array di Go dapat menyimpan tipe data yang bercampur (string + int)",
                        "Array di Go otomatis dihapus jika tidak diisi"
                ],
                "correctIndex": 1,
                "explanation": "Array di Go bersifat fixed-length. Jika membutuhkan kapasitas dinamis, gunakan Slice."
        }
},
{
        "id": 17,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "01:40:02",
        "title": "Tipe Data Slice",
        "desc": "Potongan array berukuran dinamis. Konsep Pointer, Length, Capacity, fungsi make(), append(), dan copy().",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Tipe Data Slice (Sangat Penting!)</h3>\n                <p><strong>Slice</strong> adalah potongan dari Array. Berbeda dari Array, ukuran Slice <strong>dinamis</strong> dan merupakan tipe data paling sering digunakan di Go.</p>\n\n                <h3>3 Komponen Penyusun Slice:</h3>\n                <ol>\n                    <li><strong>Pointer:</strong> Penunjuk ke data elemen pertama di array underlying.</li>\n                    <li><strong>Length (len):</strong> Panjang dari slice saat ini.</li>\n                    <li><strong>Capacity (cap):</strong> Kapasitas maksimum slice sebelum array underlying diperbesar.</li>\n                </ol>\n\n                <table class=\"tech-table\">\n                    <thead>\n                        <tr><th>Fungsi Slice</th><th>Keterangan</th></tr>\n                    </thead>\n                    <tbody>\n                        <tr><td><code>array[low:high]</code></td><td>Membuat slice dari index <code>low</code> sampai sebelum <code>high</code>.</td></tr>\n                        <tr><td><code>make([]T, len, cap)</code></td><td>Membuat slice baru dari awal dengan menentukan length & capacity.</td></tr>\n                        <tr><td><code>append(slice, elem)</code></td><td>Menambah elemen baru ke slice (otomatis memperbesar array underlying jika cap penuh).</td></tr>\n                        <tr><td><code>copy(dest, src)</code></td><td>Menyalin data dari slice sumber ke slice tujuan.</td></tr>\n                    </tbody>\n                </table>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tmonths := [...]string{\n\t\t\"Januari\", \"Februari\", \"Maret\", \"April\",\n\t\t\"Mei\", \"Juni\", \"Juli\", \"Agustus\",\n\t\t\"September\", \"Oktober\", \"November\", \"Desember\",\n\t}\n\n\tslice1 := months[4:7] // Mei, Juni, Juli\n\tfmt.Println(\"Slice1:\", slice1)\n\tfmt.Println(\"Len:\", len(slice1), \"Cap:\", cap(slice1))\n\n\t// Slice dibuat dengan make()\n\tnewSlice := make([]string, 2, 5)\n\tnewSlice[0] = \"Eko\"\n\tnewSlice[1] = \"Kurniawan\"\n\tfmt.Println(\"newSlice:\", newSlice)\n\n\t// Append\n\tnewSlice2 := append(newSlice, \"Khannedy\")\n\tfmt.Println(\"after append:\", newSlice2)\n}",
        "quiz": {
                "question": "Apa fungsi builtin yang digunakan untuk menambahkan elemen baru ke dalam Slice?",
                "options": [
                        "push()",
                        "add()",
                        "append()",
                        "insert()"
                ],
                "correctIndex": 2,
                "explanation": "Fungsi builtin 'append(slice, data)' digunakan untuk menambahkan elemen baru ke dalam slice."
        }
},
{
        "id": 18,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "02:07:16",
        "title": "Tipe Data Map",
        "desc": "Koleksi key-value pair dengan tipe data yang ditentukan, fungsi delete(), dan inisialisasi map.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Tipe Data Map</h3>\n                <p><strong>Map</strong> adalah tipe data kumpulan key-value pair (pasangan kunci dan nilai). Kata kunci di map harus unik.</p>\n\n                <p>Sintaks: <code>map[TipeKey]TipeValue</code></p>\n\n                <h3>Fungsi Penting untuk Map:</h3>\n                <ul>\n                    <li><code>make(map[TipeKey]TipeValue)</code>: Membuat map baru yang siap diisi.</li>\n                    <li><code>len(map)</code>: Mengambil jumlah key-value di map.</li>\n                    <li><code>delete(map, key)</code>: Menghapus data key dari map.</li>\n                </ul>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tperson := map[string]string{\n\t\t\"name\":    \"Eko\",\n\t\t\"address\": \"Subang\",\n\t}\n\n\tperson[\"title\"] = \"Programmer\"\n\tfmt.Println(\"Person Map:\", person)\n\tfmt.Println(\"Name:\", person[\"name\"])\n\n\t// Menghapus key dari map\n\tdelete(person, \"title\")\n\tfmt.Println(\"Setelah delete title:\", person)\n}",
        "quiz": {
                "question": "Fungsi apakah yang digunakan untuk menghapus suatu key beserta valuenya dari sebuah Map?",
                "options": [
                        "remove(map, key)",
                        "delete(map, key)",
                        "map.remove(key)",
                        "unset(map, key)"
                ],
                "correctIndex": 1,
                "explanation": "Fungsi builtin 'delete(map, key)' digunakan untuk menghapus pasangan key-value pada map."
        }
},
{
        "id": 19,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "02:14:26",
        "title": "If Expression",
        "desc": "Percabangan kondisi dengan if, else if, else, serta fitur unik If Short Statement.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>If Expression</h3>\n                <p>Percabangan <code>if</code> digunakan untuk mengeksekusi blok kode tertentu berdasarkan pengujian kondisi boolean.</p>\n\n                <h3>If Short Statement (Fitur Unik Go)</h3>\n                <p>Go mendukung pembuatan variabel singkat yang langsung diuji dalam baris <code>if</code> sebelum kondisi dievaluasi:</p>\n                <div class=\"code-box\">\n                    <div class=\"code-box-header\"><span>If Short Statement Syntax</span></div>\n                    <pre>if length := len(name); length > 5 {\n    fmt.Println(\"Nama terlalu panjang\")\n} else {\n    fmt.Println(\"Nama sudah pas\")\n}</pre>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tname := \"Khannedy\"\n\n\tif name == \"Eko\" {\n\t\tfmt.Println(\"Hello Eko\")\n\t} else if name == \"Khannedy\" {\n\t\tfmt.Println(\"Hello Khannedy\")\n\t} else {\n\t\tfmt.Println(\"Hi, Boleh Kenalan?\")\n\t}\n\n\t// If Short Statement\n\tif length := len(name); length > 5 {\n\t\tfmt.Println(\"Terlalu Panjang! Karakter:\", length)\n\t}\n}",
        "quiz": {
                "question": "Dimankah lingkup (scope) variabel yang dideklarasikan melalui 'If Short Statement' berlaku?",
                "options": [
                        "Berlaku secara global di seluruh fungsi main",
                        "Hanya berlaku di dalam blok percabangan if/else tersebut saja",
                        "Dapat diakses di luar package",
                        "Variabel tersebut tidak memiliki scope"
                ],
                "correctIndex": 1,
                "explanation": "Variabel dari short statement hanya dapat diakses terbatas di dalam scope blok if-else bersangkutan."
        }
},
{
        "id": 20,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "02:25:00",
        "title": "Switch Expression",
        "desc": "Percabangan switch, short statement pada switch, serta switch tanpa kondisi.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Switch Expression</h3>\n                <p><code>switch</code> adalah bentuk alternatif percabangan kondisi yang lebih rapi dibanding banyak <code>if-else</code> bertingkat.</p>\n\n                <div class=\"callout callout-info\">\n                    <div class=\"callout-title\">Keunikan Switch di Go:</div>\n                    <p>Go <strong>TIDAK membutuhkan kata kunci <code>break</code></strong> di setiap akhir blok <code>case</code>! Go secara otomatis tidak akan terus jatuh (*no automatic fallthrough*).</p>\n                </div>\n\n                <h3>Switch Tanpa Kondisi</h3>\n                <p>Switch bisa digunakan tanpa variabel ekspresi di awal, membuat <code>case</code> bertindak seperti pengujian <code>if-else</code> biasa.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tname := \"Eko\"\n\n\tswitch name {\n\tcase \"Eko\":\n\t\tfmt.Println(\"Hello Eko\")\n\tcase \"Joko\":\n\t\tfmt.Println(\"Hello Joko\")\n\tdefault:\n\t\tfmt.Println(\"Boleh Kenalan?\")\n\t}\n\n\t// Switch Tanpa Kondisi\n\tlength := len(name)\n\tswitch {\n\tcase length > 10:\n\t\tfmt.Println(\"Nama sangat panjang\")\n\tcase length > 5:\n\t\tfmt.Println(\"Nama cukup panjang\")\n\tdefault:\n\t\tfmt.Println(\"Nama sudah pas\")\n\t}\n}",
        "quiz": {
                "question": "Apakah di setiap blok 'case' pada switch expression Golang wajib menuliskan kata kunci 'break'?",
                "options": [
                        "Ya, wajib agar tidak terjadi infinite loop",
                        "Tidak wajib, karena di Go case tidak akan jatuh (fallthrough) secara otomatis",
                        "Wajib jika switch berupa string",
                        "Wajib hanya pada blok default"
                ],
                "correctIndex": 1,
                "explanation": "Go secara otomatis membatasi scope per case tanpa perlu break manual."
        }
},
{
        "id": 21,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "02:32:13",
        "title": "For Loop",
        "desc": "Satu-satunya kata kunci perulangan di Go: For kondisional, init & post statement, serta For Range.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>For Loop (Satu-satunya Loop di Go!)</h3>\n                <p>Golang <strong>TIDAK memiliki</strong> perulangan <code>while</code> atau <code>do-while</code>. Semua bentuk perulangan dilakukan menggunakan kata kunci <code>for</code>.</p>\n\n                <h3>Bentuk Perulangan For:</h3>\n                <ol>\n                    <li><code>for kondisi {}</code> (Seperti while loop)</li>\n                    <li><code>for init; kondisi; post {}</code> (Standard for loop)</li>\n                    <li><code>for index, value := range collection {}</code> (Iterasi Array, Slice, Map, String)</li>\n                </ol>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t// Standard For Loop\n\tfor counter := 1; counter <= 5; counter++ {\n\t\tfmt.Println(\"Perulangan ke-\", counter)\n\t}\n\n\t// For Range pada Slice\n\tnames := []string{\"Eko\", \"Kurniawan\", \"Khannedy\"}\n\tfor index, name := range names {\n\t\tfmt.Println(\"Index:\", index, \"=\", name)\n\t}\n}",
        "quiz": {
                "question": "Kata kunci perulangan apa sajakah yang didukung oleh bahasa Golang?",
                "options": [
                        "for, while, dan do-while",
                        "Hanya kata kunci 'for'",
                        "for dan foreach",
                        "loop dan while"
                ],
                "correctIndex": 1,
                "explanation": "Di Golang, hanya ada satu kata kunci perulangan yaitu 'for'."
        }
},
{
        "id": 22,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "02:41:52",
        "title": "Break dan Continue",
        "desc": "Mengontrol alur perulangan: menghentikan paksa (break) atau melompati iterasi (continue).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Break & Continue</h3>\n                <ul>\n                    <li><code>break</code>: Digunakan untuk menghentikan seluruh proses perulangan seketika itu juga.</li>\n                    <li><code>continue</code>: Digunakan untuk menghentikan iterasi saat ini dan langsung melompat ke iterasi berikutnya.</li>\n                </ul>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t// Continue (Cetak hanya angka ganjil)\n\tfmt.Println(\"--- Continue Example ---\")\n\tfor i := 1; i <= 10; i++ {\n\t\tif i%2 == 0 {\n\t\t\tcontinue // Lewati angka genap\n\t\t}\n\t\tfmt.Println(\"Angka Ganjil:\", i)\n\t}\n\n\t// Break\n\tfmt.Println(\"--- Break Example ---\")\n\tfor i := 1; i <= 10; i++ {\n\t\tif i == 5 {\n\t\t\tbreak // Berhenti total jika i == 5\n\t\t}\n\t\tfmt.Println(\"Iterasi ke-\", i)\n\t}\n}",
        "quiz": {
                "question": "Apa perbedaan utama antara perintah 'break' dan 'continue' dalam sebuah perulangan?",
                "options": [
                        "Break melompati iterasi saat ini, continue menghentikan seluruh loop",
                        "Break menghentikan seluruh loop, continue melompati iterasi saat ini ke iterasi berikutnya",
                        "Keduanya memiliki efek yang persis sama",
                        "Break hanya untuk switch, continue hanya untuk for"
                ],
                "correctIndex": 1,
                "explanation": "Break memberhentikan siklus loop sepenuhnya, sedangkan continue melompati sisa baris pada iterasi aktif."
        }
},
{
        "id": 23,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "02:46:11",
        "title": "Function",
        "desc": "Mendefinisikan fungsi (func) sederhana untuk membungkus blok kode re-usable.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Function (Fungsi)</h3>\n                <p><strong>Function</strong> adalah blok kode yang dibuat untuk melakukan tugas tertentu dan dapat dipanggil berulang kali.</p>\n                \n                <p>Sintaks: <code>func namaFungsi() { ... }</code></p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc sayHello() {\n\tfmt.Println(\"Hello World dari Function sayHello!\")\n}\n\nfunc main() {\n\tsayHello()\n\tsayHello()\n}",
        "quiz": {
                "question": "Kata kunci apa yang digunakan untuk mendefinisikan fungsi di Golang?",
                "options": [
                        "function",
                        "def",
                        "func",
                        "fn"
                ],
                "correctIndex": 2,
                "explanation": "Go menggunakan kata kunci 'func' untuk mendeklarasikan sebuah fungsi."
        }
},
{
        "id": 24,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "02:49:12",
        "title": "Function Parameter",
        "desc": "Mengirimkan data ke dalam fungsi melalui parameter.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Function Parameter</h3>\n                <p>Fungsi dapat menerima data input berupa <strong>parameter</strong>. Parameter ditulis di dalam tanda kurung fungsi beserta tipe datanya.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc sayHelloTo(firstName string, lastName string) {\n\tfmt.Println(\"Hello\", firstName, lastName)\n}\n\nfunc main() {\n\tsayHelloTo(\"Eko\", \"Khannedy\")\n\tsayHelloTo(\"Budi\", \"Nugraha\")\n}",
        "quiz": {
                "question": "Jika dua parameter bersebelahan memiliki tipe data yang sama (misal string), bagaimana penulisan singkatnya di Go?",
                "options": [
                        "func test(a, b string)",
                        "func test(a string, b)",
                        "func test(string a, b)",
                        "Tidak bisa disingkat"
                ],
                "correctIndex": 0,
                "explanation": "Di Go, jika beberapa parameter bersebelahan bertipe sama, kita bisa menuliskan tipe datanya sekali di parameter terakhir: func(a, b string)."
        }
},
{
        "id": 25,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "02:53:35",
        "title": "Function Return Value",
        "desc": "Mengembalikan hasil olahan fungsi menggunakan kata kunci return.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Function Return Value</h3>\n                <p>Fungsi dapat mengembalikan nilai hasil eksekusinya menggunakan kata kunci <code>return</code>. Tipe data kembalian harus dideklarasikan setelah tanda kurung parameter.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc getHello(name string) string {\n\treturn \"Hello \" + name\n}\n\nfunc main() {\n\tresult := getHello(\"Eko\")\n\tfmt.Println(result)\n}",
        "quiz": {
                "question": "Dimanakah tipe data kembalian (return type) dituliskan pada deklarasi fungsi di Go?",
                "options": [
                        "Sebelum nama fungsi",
                        "Setelah tanda kurung parameter ()",
                        "Di dalam badan fungsi",
                        "Tidak perlu ditulis"
                ],
                "correctIndex": 1,
                "explanation": "Tipe data return value ditulis tepat setelah kurung tutup daftar parameter: func namaFunc() TipeReturn."
        }
},
{
        "id": 26,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "02:58:02",
        "title": "Returning Multiple Values",
        "desc": "Fitur hebat Go: Mengembalikan banyak nilai sekaligus dari sebuah fungsi dan mengabaikan nilai dengan '_'.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Returning Multiple Values</h3>\n                <p>Go mendukung pengembalian **lebih dari satu nilai** (multiple values) secara native dari sebuah fungsi!</p>\n\n                <div class=\"callout callout-info\">\n                    <div class=\"callout-title\">💡 Blank Identifier (_):</div>\n                    <p>Jika kita tidak membutuhkan salah satu nilai kembalian, kita bisa mengabaikannya menggunakan karakter garis bawah <code>_</code> (blank identifier).</p>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc getFullName() (string, string) {\n\treturn \"Eko\", \"Khannedy\"\n}\n\nfunc main() {\n\tfirstName, lastName := getFullName()\n\tfmt.Println(\"Full:\", firstName, lastName)\n\n\t// Mengabaikan kembalian kedua dengan _\n\tfName, _ := getFullName()\n\tfmt.Println(\"First Name Only:\", fName)\n}",
        "quiz": {
                "question": "Simbol apakah yang digunakan sebagai 'Blank Identifier' untuk mengabaikan nilai return yang tidak dibutuhkan?",
                "options": [
                        "null",
                        "void",
                        "_",
                        "ignore"
                ],
                "correctIndex": 2,
                "explanation": "Karakter '_' (underscore) adalah blank identifier resmi di Go untuk menampung nilai yang ingin diabaikan."
        }
},
{
        "id": 27,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "03:02:50",
        "title": "Named Return Values",
        "desc": "Mendefinisikan nama variabel untuk nilai kembalian fungsi sejak awal deklarasi header.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Named Return Values</h3>\n                <p>Kita dapat memberikan nama pada variabel yang akan dikembalikan oleh fungsi di bagian header fungsi.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc getCompleteName() (firstName, middleName, lastName string) {\n\tfirstName = \"Eko\"\n\tmiddleName = \"Kurniawan\"\n\tlastName = \"Khannedy\"\n\treturn // Otomatis mengembalikan firstName, middleName, lastName\n}\n\nfunc main() {\n\ta, b, c := getCompleteName()\n\tfmt.Println(a, b, c)\n}",
        "quiz": {
                "question": "Apa keuntungan utama menggunakan Named Return Values?",
                "options": [
                        "Membuat fungsi berjalan 10x lebih cepat",
                        "Variabel return sudah terdeklarasi otomatis dan cukup memanggil 'return' tanpa menyebut ulang variabel",
                        "Menghilangkan kebutuhan keyword func",
                        "Variabel otomatis menjadi global"
                ],
                "correctIndex": 1,
                "explanation": "Named return value memfasilitasi penamaan eksplisit sehingga di akhir fungsi cukup memanggil 'return'."
        }
},
{
        "id": 28,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "03:06:33",
        "title": "Variadic Function",
        "desc": "Fungsi yang mampu menerima jumlah parameter dinamis (Varargs) dengan sintaks '...T'.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Variadic Function (Varargs)</h3>\n                <p>Parameter variadic memungkinkan sebuah fungsi menerima masukan data dinamis dengan tipe sama dalam jumlah berapa saja (atau 0 argumen).</p>\n                <p>Sintaks: <code>numbers ...int</code> (Varargs harus berada di posisi parameter paling akhir).</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc sumAll(numbers ...int) int {\n\ttotal := 0\n\tfor _, number := range numbers {\n\t\ttotal += number\n\t}\n\treturn total\n}\n\nfunc main() {\n\ttotal := sumAll(10, 20, 30, 40, 50)\n\tfmt.Println(\"Total Sum:\", total)\n\n\t// Passing slice ke variadic parameter dengan ...\n\tslice := []int{10, 10, 10}\n\tfmt.Println(\"Total Slice Sum:\", sumAll(slice...))\n}",
        "quiz": {
                "question": "Di mana posisi parameter Variadic (...T) wajib diletakkan dalam deklarasi fungsi?",
                "options": [
                        "Di posisi paling awal",
                        "Di posisi paling akhir (parameter terakhir)",
                        "Bebas di mana saja",
                        "Tidak boleh digabung dengan parameter lain"
                ],
                "correctIndex": 1,
                "explanation": "Parameter variadic wajib diletakkan pada urutan parameter paling akhir."
        }
},
{
        "id": 29,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "03:13:51",
        "title": "Function as Value",
        "desc": "Fungsi di Go adalah First-Class Citizen yang dapat disimpan dalam variabel layaknya data biasa.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Function as Value</h3>\n                <p>Di Golang, fungsi adalah <strong>First-Class Citizen</strong>. Artinya, fungsi dapat disimpan ke dalam variabel seperti halnya data angka atau string!</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc getGoodBye(name string) string {\n\treturn \"Good Bye \" + name\n}\n\nfunc main() {\n\t// Menyimpan fungsi getGoodBye ke dalam variabel contoh\n\tcontoh := getGoodBye\n\t\n\t// Memanggil fungsi dari dalam variabel\n\tresult := contoh(\"Eko\")\n\tfmt.Println(result)\n}",
        "quiz": {
                "question": "Apa arti konsep 'First-Class Citizen' pada fungsi di Golang?",
                "options": [
                        "Fungsi hanya boleh ditulis oleh programmer senior",
                        "Fungsi dapat disimpan ke variabel, dikirim sebagai argumen, dan dikembalikan dari fungsi lain",
                        "Fungsi otomatis mengeksekusi sistem operasi",
                        "Fungsi tidak memerlukan nama"
                ],
                "correctIndex": 1,
                "explanation": "First-Class Citizen berarti fungsi diperlakukan sama seperti tipe data biasa."
        }
},
{
        "id": 30,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "03:17:30",
        "title": "Function as Parameter",
        "desc": "Meneruskan fungsi sebagai argumen ke fungsi lain (Higher-Order Function) dan Type Alias untuk Function.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Function as Parameter (Higher-Order Function)</h3>\n                <p>Karena fungsi adalah data, kita bisa mengirimkan fungsi sebagai parameter ke fungsi lainnya (misalnya untuk filter atau callback).</p>\n\n                <p>Agar deklarasi parameter fungsi tidak terlalu panjang, disarankan membuat <strong>Type Declaration</strong> untuk tipe fungsinya.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\n// Type alias untuk fungsi filter\ntype Filter func(string) string\n\nfunc sayHelloWithFilter(name string, filter Filter) {\n\tnameFiltered := filter(name)\n\tfmt.Println(\"Hello\", nameFiltered)\n}\n\nfunc spamFilter(name string) string {\n\tif name == \"Anjing\" {\n\t\treturn \"***\"\n\t}\n\treturn name\n}\n\nfunc main() {\n\tsayHelloWithFilter(\"Eko\", spamFilter)\n\tsayHelloWithFilter(\"Anjing\", spamFilter)\n}",
        "quiz": {
                "question": "Mengapa disarankan menggunakan 'type Filter func(string) string' saat membuat Function as Parameter?",
                "options": [
                        "Agar sintaks header fungsi penerima menjadi lebih rapi dan ringkas",
                        "Wajib secara bahasa, jika tidak akan error",
                        "Untuk mempercepat proses memori",
                        "Agar fungsi tidak bisa diedit"
                ],
                "correctIndex": 0,
                "explanation": "Type alias membuat signature fungsi yang panjang menjadi jauh lebih ringkas dan reusable."
        }
},
{
        "id": 31,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "03:25:29",
        "title": "Anonymous Function",
        "desc": "Fungsi tanpa nama yang dibuat secara langsung di tempat (inline function).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Anonymous Function</h3>\n                <p><strong>Anonymous Function</strong> adalah fungsi yang dibuat tanpa memiliki nama secara langsung saat deklarasi.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\ntype Blacklist func(string) bool\n\nfunc registerUser(name string, blacklist Blacklist) {\n\tif blacklist(name) {\n\t\tfmt.Println(\"You are blocked:\", name)\n\t} else {\n\t\tfmt.Println(\"Welcome\", name)\n\t}\n}\n\nfunc main() {\n\t// Anonymous Function disimpan di variabel\n\tblacklist := func(name string) bool {\n\t\treturn name == \"admin\"\n\t}\n\tregisterUser(\"admin\", blacklist)\n\n\t// Anonymous Function langsung dimasukkan ke parameter\n\tregisterUser(\"eko\", func(name string) bool {\n\t\treturn name == \"root\"\n\t})\n}",
        "quiz": {
                "question": "Apa definisi dari Anonymous Function?",
                "options": [
                        "Fungsi yang berada di luar file main.go",
                        "Fungsi tanpa nama yang dibuat secara langsung saat dibutuhkan",
                        "Fungsi yang tidak mengembalikan nilai apapun",
                        "Fungsi buatan sistem operasi"
                ],
                "correctIndex": 1,
                "explanation": "Anonymous function adalah fungsi yang tidak dideklarasikan dengan nama fungsi standar."
        }
},
{
        "id": 32,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "03:30:50",
        "title": "Recursive Function",
        "desc": "Fungsi yang memanggil dirinya sendiri (contoh: perhitungan Faktorial).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Recursive Function (Rekursif)</h3>\n                <p>Fungsi rekursif adalah fungsi yang memanggil dirinya sendiri secara berulang sampai mencapai kondisi berhenti (*base case*).</p>\n\n                <div class=\"callout callout-warning\">\n                    <div class=\"callout-title\">⚠️ Bahaya Stack Overflow:</div>\n                    <p>Jika rekursif tidak memiliki kondisi berhenti (base case) yang tepat, pemanggilan fungsi akan menumpuk di memori stack hingga memicu crash <strong>Stack Overflow</strong>!</p>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc factorialRecursive(value int) int {\n\tif value == 1 {\n\t\treturn 1\n\t}\n\treturn value * factorialRecursive(value-1)\n}\n\nfunc main() {\n\tresult := factorialRecursive(5) // 5 * 4 * 3 * 2 * 1 = 120\n\tfmt.Println(\"Faktorial 5! =\", result)\n}",
        "quiz": {
                "question": "Apa risiko yang dapat terjadi jika sebuah fungsi rekursif tidak memiliki kondisi berhenti (base case)?",
                "options": [
                        "Memory Leak / Stack Overflow",
                        "Integer Overflow saja",
                        "Hasil menjadi 0",
                        "Syntax Error"
                ],
                "correctIndex": 0,
                "explanation": "Pemanggilan tanpa batas akan menghabiskan call stack memori dan memicu Stack Overflow."
        }
},
{
        "id": 33,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "03:37:14",
        "title": "Closure",
        "desc": "Kemampuan fungsi mengakses variabel di scope atasnya dan potensi side-effect efektivitas variabel.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Closure</h3>\n                <p><strong>Closure</strong> adalah kemampuan sebuah fungsi berinteraksi dengan variabel-variabel di sekitar scope tempat fungsi tersebut diciptakan.</p>\n\n                <div class=\"callout callout-warning\">\n                    <div class=\"callout-title\">⚠️ Hati-hati Side Effect:</div>\n                    <p>Hati-hati saat mengubah variabel di luar scope fungsi closure karena dapat mengubah state data yang tidak sengaja!</p>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tcounter := 0\n\tname := \"Eko\"\n\n\tincrement := func() {\n\t\tname := \"Budi\" // Terjadi shadowing jika pakai :=\n\t\tcounter++      // Mengubah variabel counter di scope luar!\n\t\tfmt.Println(\"Inner Name:\", name)\n\t}\n\n\tincrement()\n\tincrement()\n\tfmt.Println(\"Outer Counter:\", counter)\n\tfmt.Println(\"Outer Name:\", name)\n}",
        "quiz": {
                "question": "Apa yang terjadi ketika variabel di scope luar diubah dari dalam fungsi closure?",
                "options": [
                        "Nilai variabel di luar fungsi ikut berubah",
                        "Terjadi error kompilasi scope invalid",
                        "Nilai variabel di luar tetap tidak tersentuh",
                        "Closure otomatis terhapus"
                ],
                "correctIndex": 0,
                "explanation": "Closure dapat mengakses dan memodifikasi variabel yang berada pada lexical parent scope-nya."
        }
},
{
        "id": 34,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "03:41:20",
        "title": "Defer, Panic, dan Recover",
        "desc": "Mekanisme penanganan eksekusi: Defer (cleanup execution), Panic (trigger runtime error), dan Recover (menangkap error panic).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>1. Defer</h3>\n                <p><code>defer</code> digunakan untuk menunda eksekusi sebuah fungsi sampai fungsi utama tempat <code>defer</code> berada selesai dieksekusi (selalu dijalankan walaupun terjadi error).</p>\n\n                <h3>2. Panic</h3>\n                <p><code>panic()</code> dipanggil untuk menghentikan jalan program saat terjadi kesalahan fatal (runtime error).</p>\n\n                <h3>3. Recover</h3>\n                <p><code>recover()</code> digunakan untuk menangkap data pesan <code>panic</code> sehingga program tidak jadi crash (wajib dipanggil di dalam fungsi <code>defer</code>!).</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc endApp() {\n\tmessage := recover()\n\tif message != nil {\n\t\tfmt.Println(\"Error Terjadi (Recovered):\", message)\n\t}\n\tfmt.Println(\"Aplikasi Selesai Dijalankan (Defer Output)\")\n}\n\nfunc runApp(errorOccurred bool) {\n\tdefer endApp() // Selalu dieksekusi di akhir!\n\n\tif errorOccurred {\n\t\tpanic(\"APLIKASI ERROR FATAL!\")\n\t}\n\tfmt.Println(\"Aplikasi Berjalan Normal...\")\n}\n\nfunc main() {\n\trunApp(true) // Coba ubah ke false\n}",
        "quiz": {
                "question": "Di manakah fungsi recover() WAJIB dipanggil agar berhasil menangkap pesan dari panic()?",
                "options": [
                        "Di awal fungsi main",
                        "Di dalam fungsi yang dipanggil oleh defer",
                        "Tepat setelah baris panic()",
                        "Di luar package"
                ],
                "correctIndex": 1,
                "explanation": "Recover harus berada di dalam fungsi defer karena saat panic terjadi, hanya fungsi defer yang akan dieksekusi."
        }
},
{
        "id": 35,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "03:51:50",
        "title": "Komentar",
        "desc": "Penggunaan komentar single-line (//) dan multi-line (/* */) untuk dokumentasi kode.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Komentar di Golang</h3>\n                <p>Komentar digunakan untuk memberikan dokumentasi atau penjelasan baris kode yang diabaikan oleh compiler Go.</p>\n                <ul>\n                    <li><code>// Single line comment</code></li>\n                    <li><code>/* Multi line comment */</code></li>\n                </ul>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\n/**\n * Fungsi main adalah entry point utama aplikasi.\n * Komentar multi line cocok untuk dokumentasi.\n */\nfunc main() {\n\t// Ini adalah komentar single line\n\tfmt.Println(\"Komentar diabaikan oleh compiler Go!\")\n}",
        "quiz": {
                "question": "Karakter manakah yang digunakan untuk membuat komentar 1 baris (single line) di Go?",
                "options": [
                        "#",
                        "//",
                        "<!-- -->",
                        "--"
                ],
                "correctIndex": 1,
                "explanation": "Karakter '//' digunakan untuk menuliskan komentar satu baris di Golang."
        }
},
{
        "id": 36,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "03:53:52",
        "title": "Struct",
        "desc": "Membuat tipe data kustom berstruktur (struct), definisi field, dan pengisian struct literal.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Struct</h3>\n                <p><strong>Struct</strong> adalah kumpulan dari berbagai field/properti tipe data yang dibungkus menjadi satu kesatuan objek kustom.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\ntype Customer struct {\n\tName, Address string\n\tAge           int\n}\n\nfunc main() {\n\t// Pengisian Field Struct 1\n\tvar eko Customer\n\teko.Name = \"Eko Kurniawan\"\n\teko.Address = \"Indonesia\"\n\teko.Age = 30\n\tfmt.Println(eko)\n\n\t// Struct Literal 2\n\tjoko := Customer{\n\t\tName:    \"Joko\",\n\t\tAddress: \"Jakarta\",\n\t\tAge:     35,\n\t}\n\tfmt.Println(joko)\n}",
        "quiz": {
                "question": "Manakah sintaks yang benar untuk mendeklarasikan struct 'Customer'?",
                "options": [
                        "class Customer {}",
                        "struct Customer {}",
                        "type Customer struct {}",
                        "define Customer struct {}"
                ],
                "correctIndex": 2,
                "explanation": "Di Go, struct dideklarasikan dengan 'type NamaStruct struct { ... }'."
        }
},
{
        "id": 37,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "04:01:54",
        "title": "Struct Method",
        "desc": "Menempelkan fungsi ke dalam struct sehingga struct bertindak seperti objek ber-behavior.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Struct Method</h3>\n                <p>Fungsi yang menempel pada tipe Struct dinamakan <strong>Struct Method</strong>.</p>\n                <p>Sintaks: <code>func (c Customer) sayHi(name string) { ... }</code></p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\ntype Customer struct {\n\tName string\n}\n\n// Method menempel ke Customer struct\nfunc (customer Customer) sayHi(name string) {\n\tfmt.Println(\"Hi\", name, \"My Name is\", customer.Name)\n}\n\nfunc main() {\n\teko := Customer{Name: \"Eko\"}\n\teko.sayHi(\"Budi\")\n}",
        "quiz": {
                "question": "Di posisi manakah receiver struct diletakkan pada deklarasi Struct Method?",
                "options": [
                        "Di dalam badan fungsi",
                        "Di antara kata kunci 'func' dan nama fungsi: func (r ReceiverStruct) NamaFunc()",
                        "Di paling akhir setelah return value",
                        "Di dalam struct itu sendiri"
                ],
                "correctIndex": 1,
                "explanation": "Receiver diletakkan di antara kata kunci func dan nama method: func (c Customer) SayHi()."
        }
},
{
        "id": 38,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "04:06:10",
        "title": "Interface",
        "desc": "Kontrak kumpulan method abstrak dan implementasi secara implisit (tanpa kata kunci implements).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Interface</h3>\n                <p><strong>Interface</strong> adalah tipe data abstrak yang mendefinisikan kontrak kumpulan method tanpa implementasi body.</p>\n\n                <div class=\"callout callout-info\">\n                    <div class=\"callout-title\">💡 Implementasi Implisit:</div>\n                    <p>Di Go, sebuah struct <strong>TIDAK PERLU</strong> menulis <code>implements InterfaceName</code>. Selama struct tersebut memiliki seluruh method yang disyaratkan interface, Go otomatis menganggap struct tersebut telah mengimplementasikan interface!</p>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\ntype HasName interface {\n\tGetName() string\n}\n\nfunc SayHelloName(hasName HasName) {\n\tfmt.Println(\"Hello\", hasName.GetName())\n}\n\ntype Person struct {\n\tName string\n}\n\n// Struct Person mengimplementasikan method GetName()\nfunc (person Person) GetName() string {\n\treturn person.Name\n}\n\nfunc main() {\n\teko := Person{Name: \"Eko\"}\n\tSayHelloName(eko)\n}",
        "quiz": {
                "question": "Bagaimana cara sebuah struct di Go mengimplementasikan suatu interface?",
                "options": [
                        "Menggunakan kata kunci implements di deklarasi struct",
                        "Secara otomatis (implisit) dengan cara membuat seluruh method yang ada pada kontrak interface tersebut",
                        "Interface tidak bisa diimplementasikan oleh struct",
                        "Menggunakan kata kunci extends"
                ],
                "correctIndex": 1,
                "explanation": "Go menganut duck typing / implicit implementation. Jika signature method cocok, otomatis terimplementasi."
        }
},
{
        "id": 39,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "04:15:38",
        "title": "Interface Kosong",
        "desc": "Mengenal interface{} atau alias 'any' sebagai penampung semua jenis tipe data.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Interface Kosong (interface{} / any)</h3>\n                <p><strong>Interface Kosong</strong> adalah interface yang tidak memiliki deklarasi method sama sekali. Karena tidak ada syarat method, <strong>semua tipe data</strong> di Go otomatis memenuhi kriteria interface kosong ini.</p>\n\n                <p>Pada Go versi 1.18+, <code>interface{}</code> memiliki alias resmi kata kunci <code>any</code>.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc Ups(i int) any { // atau interface{}\n\tif i == 1 {\n\t\treturn 1\n\t} else if i == 2 {\n\t\treturn \"Dua\"\n\t} else {\n\t\treturn true\n\t}\n}\n\nfunc main() {\n\tvar data any = Ups(2)\n\tfmt.Println(\"Data Dynamic:\", data)\n}",
        "quiz": {
                "question": "Kata kunci alias resmi apa yang diperkenalkan di Go 1.18 untuk menggantikan penulisan 'interface{}'?",
                "options": [
                        "object",
                        "dynamic",
                        "any",
                        "all"
                ],
                "correctIndex": 2,
                "explanation": "'any' adalah alias resmi yang identik 100% dengan 'interface{}'."
        }
},
{
        "id": 40,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "04:20:25",
        "title": "Nil",
        "desc": "Mengenal zero value Nil untuk pointer, interface, map, slice, channel, dan function.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Nil</h3>\n                <p><code>nil</code> adalah nilai kosong (zero value) pada Go untuk tipe data khusus seperti: <strong>Pointer, Interface, Map, Slice, Channel, dan Function</strong>.</p>\n\n                <div class=\"callout callout-warning\">\n                    <div class=\"callout-title\">⚠️ Tipe Data Yang Tidak Bisa Nil:</div>\n                    <p>Tipe data dasar seperti <code>int</code>, <code>string</code>, dan <code>bool</code> <strong>TIDAK BISA</strong> bernilai <code>nil</code>! Nilai default int adalah 0, string adalah \"\", bool adalah false.</p>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc NewMap(name string) map[string]string {\n\tif name == \"\" {\n\t\treturn nil\n\t} else {\n\t\treturn map[string]string{\n\t\t\t\"name\": name,\n\t\t}\n\t}\n}\n\nfunc main() {\n\tdata := NewMap(\"\")\n\tif data == nil {\n\t\tfmt.Println(\"Data Map Masih Nil!\")\n\t} else {\n\t\tfmt.Println(data)\n\t}\n}",
        "quiz": {
                "question": "Manakah tipe data berikut yang BISA bernilai 'nil' di Golang?",
                "options": [
                        "int",
                        "string",
                        "Map dan Slice",
                        "bool"
                ],
                "correctIndex": 2,
                "explanation": "Nil hanya dapat digunakan pada tipe data seperti Pointer, Interface, Map, Slice, Channel, dan Function."
        }
},
{
        "id": 41,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "04:25:36",
        "title": "Type Assertions",
        "desc": "Mengonversi tipe data dari interface kosong (any) kembali ke tipe data aslinya.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Type Assertions</h3>\n                <p><strong>Type Assertions</strong> digunakan untuk mengubah tipe data <code>interface{}</code> menjadi tipe data asli yang diinginkan.</p>\n                <p>Sintaks: <code>value.(TipeAsli)</code> atau menggunakan <code>switch value.(type)</code>.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc random() any {\n\treturn \"OK\"\n}\n\nfunc main() {\n\tresult := random()\n\t\n\t// Type Assertion\n\tresultString := result.(string)\n\tfmt.Println(\"String result:\", resultString)\n\n\t// Safe Type Assertion dengan Switch\n\tswitch value := result.(type) {\n\tcase string:\n\t\tfmt.Println(\"Value is String:\", value)\n\tcase int:\n\t\tfmt.Println(\"Value is Int:\", value)\n\tdefault:\n\t\tfmt.Println(\"Unknown Type\")\n\t}\n}",
        "quiz": {
                "question": "Apa risiko yang terjadi jika melakukan type assertion 'result.(int)' padahal data aslinya adalah 'string'?",
                "options": [
                        "Otomatis dikonversi ke angka 0",
                        "Terjadi panic crash pada runtime",
                        "Variabel bernilai nil",
                        "Compiler mengabaikan kode"
                ],
                "correctIndex": 1,
                "explanation": "Type assertion yang salah tipe tanpa pengecekan koma ok akan memicu panic saat aplikasi berjalan."
        }
},
{
        "id": 42,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "04:32:15",
        "title": "Pointer & Memory Address",
        "desc": "Konsep Pass by Value vs Pass by Reference di memori dan penggunaan operator ampersand (&).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Pass by Value vs Pass by Reference</h3>\n                <p>Secara default di Go, semua variabel dikirim secara <strong>Pass by Value</strong> (nilainya diduplikasi/diduplikat ke lokasi memori baru).</p>\n\n                <p><strong>Pointer</strong> adalah kemampuan untuk mereferensikan lokasi alamat memori variabel original menggunakan operator ampersand <code>&</code> (Pass by Reference).</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\ntype Address struct {\n\tCity, Province, Country string\n}\n\nfunc main() {\n\taddress1 := Address{\"Subang\", \"Jawa Barat\", \"Indonesia\"}\n\taddress2 := &address1 // Pointer ke address1\n\n\taddress2.City = \"Bandung\" // Mengubah address2 ikut mengubah address1!\n\n\tfmt.Println(\"Address 1 (Original):\", address1)\n\tfmt.Println(\"Address 2 (Pointer):\", address2)\n}",
        "quiz": {
                "question": "Operator apakah yang digunakan untuk membuat pointer (mengambil alamat memori suatu variabel)?",
                "options": [
                        "*",
                        "&",
                        "@",
                        "->"
                ],
                "correctIndex": 1,
                "explanation": "Operator ampersand '&' digunakan untuk mengambil alamat memori dari suatu variabel."
        }
},
{
        "id": 43,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "04:41:55",
        "title": "Asterisk Operator (*)",
        "desc": "Menggunakan operator '*' untuk mendereference pointer dan mengarahkan memori ke objek baru.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Asterisk Operator (*)</h3>\n                <p>Saat kita mengubah variabel pointer dengan operator <code>*</code>, seluruh variabel lain yang mengacu ke alamat memori yang sama akan ikut berpindah mengikuti nilai baru tersebut.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\ntype Address struct {\n\tCity, Province, Country string\n}\n\nfunc main() {\n\taddress1 := Address{\"Subang\", \"Jawa Barat\", \"Indonesia\"}\n\taddress2 := &address1\n\n\t// Mengganti objek referensi pointer dengan operator *\n\t*address2 = Address{\"Jakarta\", \"DKI Jakarta\", \"Indonesia\"}\n\n\tfmt.Println(\"Address 1 Ikut Berubah:\", address1)\n\tfmt.Println(\"Address 2:\", address2)\n}",
        "quiz": {
                "question": "Apa fungsi dari Asterisk Operator '*' pada variabel pointer?",
                "options": [
                        "Mengalikan nilai angka",
                        "Mengakses/mengubah isi data aktual pada lokasi memori yang ditunjuk (dereferencing)",
                        "Menghapus memori pointer",
                        "Membuat variabel konstan"
                ],
                "correctIndex": 1,
                "explanation": "Operator '*' digunakan untuk dereferencing (mengakses atau mengganti nilai di lokasi memori yang ditunjuk)."
        }
},
{
        "id": 44,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "04:48:50",
        "title": "Operator New",
        "desc": "Fungsi new() bawaan Go untuk mengalokasikan memori pointer baru ber-zero value.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Operator New</h3>\n                <p>Go memiliki fungsi bawaan <code>new()</code> untuk membuat pointer kosong yang menunjuk ke memori ber-zero value dari tipe data tersebut.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\ntype Address struct {\n\tCity, Province, Country string\n}\n\nfunc main() {\n\tvar alamat1 *Address = new(Address)\n\talamat1.City = \"Jakarta\"\n\n\tfmt.Println(\"Pointer via new():\", alamat1)\n}",
        "quiz": {
                "question": "Apa kembalian dari fungsi new(Address) di Golang?",
                "options": [
                        "Objek struct Address biasa",
                        "Pointer *Address yang menunjuk ke struct kosong (zero value)",
                        "Nilai null string",
                        "Tipe data int memory"
                ],
                "correctIndex": 1,
                "explanation": "new(T) mengalokasikan memori baru ber-zero value dan mengembalikan pointer *T."
        }
},
{
        "id": 45,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "04:51:15",
        "title": "Pointer di Function",
        "desc": "Mengirimkan pointer sebagai argumen fungsi untuk mengizinkan fungsi memodifikasi data original.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Pointer di Function Parameter</h3>\n                <p>Secara default, parameter yang dikirim ke fungsi adalah pass-by-value. Jika ingin fungsi dapat mengubah data variabel asli di luar, tambahkan tanda <code>*</code> pada parameter fungsi.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\ntype Address struct {\n\tCity, Province, Country string\n}\n\n// Parameter menggunakan pointer *Address\nfunc ChangeCountryToIndonesia(address *Address) {\n\taddress.Country = \"Indonesia\"\n}\n\nfunc main() {\n\taddress := Address{\"Subang\", \"Jawa Barat\", \"\"}\n\tChangeCountryToIndonesia(&address) // Kirim alamat memori dengan &\n\n\tfmt.Println(\"Hasil Asli Berubah:\", address)\n}",
        "quiz": {
                "question": "Mengapa kita mengirimkan pointer ke dalam fungsi parameter?",
                "options": [
                        "Agar fungsi dapat mengubah data asli variabel di luar fungsinya",
                        "Agar fungsi tidak memakan waktu kompilasi",
                        "Agar variabel otomatis diubah ke string",
                        "Wajib jika variabel bernilai angka"
                ],
                "correctIndex": 0,
                "explanation": "Dengan pointer, perubahan data di dalam fungsi akan langsung berefek pada variabel asli di memori."
        }
},
{
        "id": 46,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "04:55:52",
        "title": "Pointer di Method",
        "desc": "Sangat Rekomendasi: Menggunakan Pointer Receiver (*Struct) pada Method untuk efisiensi memori & pengubahan state.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Pointer Receiver di Method</h3>\n                <p>Sangat direkomendasikan menggunakan pointer receiver (<code>*Man</code>) pada Struct Method agar:</p>\n                <ol>\n                    <li>Method bisa mengubah data aktual struct asli.</li>\n                    <li>Menghemat konsumsi memori karena tidak menguji duplikasi objek struct yang besar setiap kali method dipanggil.</li>\n                </ol>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\ntype Man struct {\n\tName string\n}\n\n// Receiver menggunakan pointer *Man\nfunc (man *Man) Married() {\n\tman.Name = \"Mr. \" + man.Name\n}\n\nfunc main() {\n\teko := Man{\"Eko\"}\n\teko.Married() // Otomatis dipanggil sebagai pointer\n\n\tfmt.Println(\"Nama Eko Berubah:\", eko.Name)\n}",
        "quiz": {
                "question": "Apa keutamaan utama menggunakan Pointer Receiver pada Struct Method?",
                "options": [
                        "Method dapat memodifikasi field struct asli dan menghemat memori tanpa duplikasi data",
                        "Method bisa dipanggil dari terminal",
                        "Struct otomatis terhapus",
                        "Menjadikan method private"
                ],
                "correctIndex": 0,
                "explanation": "Pointer receiver menghindari alokasi memori duplikat dan mengizinkan mutasi state objek asli."
        }
},
{
        "id": 47,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "04:59:18",
        "title": "Package dan Import",
        "desc": "Modularisasi kode Go dengan memecah file ke dalam folder package dan mengimpornya.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package & Import</h3>\n                <p>Go mengorganisir kode ke dalam direktori bernama <strong>Package</strong>. Untuk menggunakan fungsi atau struct dari package lain, kita menggunakan sintaks <code>import \"nama-module/nama-package\"</code>.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"math\"\n)\n\nfunc main() {\n\tfmt.Println(\"Akar Kuadrat 16 (math.Sqrt):\", math.Sqrt(16))\n\tfmt.Println(\"Nilai Pi (math.Pi):\", math.Pi)\n}",
        "quiz": {
                "question": "Kata kunci apa yang digunakan untuk memasukkan fungsi/library dari package lain ke file kita?",
                "options": [
                        "include",
                        "import",
                        "require",
                        "using"
                ],
                "correctIndex": 1,
                "explanation": "Go menggunakan kata kunci 'import' untuk memasukkan package."
        }
},
{
        "id": 48,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "05:05:03",
        "title": "Access Modifier (Public vs Private)",
        "desc": "Aturan visibilitas simpul Go: Exported (Huruf Besar di Awal) vs Unexported (Huruf Kecil di Awal).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Access Modifier di Go</h3>\n                <p>Di Go, tidak ada kata kunci seperti <code>public</code>, <code>private</code>, atau <code>protected</code>.</p>\n\n                <div class=\"callout callout-info\">\n                    <div class=\"callout-title\">💡 Aturan Access Modifier Sederhana:</div>\n                    <ul>\n                        <li><strong>Exported (Public):</strong> Diawali dengan <strong>Huruf KAPITAL / Huruf Besar</strong> (misal: <code>SayHello</code>, <code>User</code>). BISA diakses dari luar package!</li>\n                        <li><strong>Unexported (Private):</strong> Diawali dengan <strong>Huruf KECIL</strong> (misal: <code>sayHello</code>, <code>version</code>). HANYA BISA diakses dari dalam package yang sama!</li>\n                    </ul>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\n// Exported (Public) - Huruf Besar\nfunc SayHello(name string) string {\n\treturn \"Hello \" + name\n}\n\n// Unexported (Private) - Huruf Kecil\nfunc logInternal() {\n\tfmt.Println(\"Log internal package\")\n}\n\nfunc main() {\n\tfmt.Println(SayHello(\"Eko\"))\n\tlogInternal()\n}",
        "quiz": {
                "question": "Bagaimana cara membuat sebuah fungsi atau variabel di Go agar berstatus Public (dapat diakses dari luar package)?",
                "options": [
                        "Menambahkan kata kunci 'public' sebelum func",
                        "Menuliskan nama fungsi/variabel diawali dengan Huruf Kapital (Huruf Besar)",
                        "Menaruh fungsi di dalam file public.go",
                        "Menggunakan karakter '@'"
                ],
                "correctIndex": 1,
                "explanation": "Cukup awali nama identifier dengan huruf besar untuk menjadikannya Exported (Public)."
        }
},
{
        "id": 49,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "05:09:06",
        "title": "Package Initialization",
        "desc": "Fungsi init() yang otomatis berjalan saat package di-load, dan Blank Identifier import (_).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package Initialization</h3>\n                <p>Jika kita membuat fungsi bernama <code>init()</code> di dalam package, fungsi tersebut akan **otomatis dieksekusi pertama kali** ketika package tersebut di-import.</p>\n\n                <p>Jika ingin mengeksekusi <code>init()</code> tanpa memanggil fungsi di dalamnya, gunakan **Blank Identifier Import**: <code>import _ \"nama-package\"</code>.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nvar connection string\n\nfunc init() {\n\tconnection = \"Database Connected Successfully!\"\n\tfmt.Println(\"[INIT] Executing package initialization...\")\n}\n\nfunc main() {\n\tfmt.Println(\"Main Function Running...\")\n\tfmt.Println(\"Connection Status:\", connection)\n}",
        "quiz": {
                "question": "Kapan fungsi init() dalam suatu package dieksekusi?",
                "options": [
                        "Saat dipanggil secara manual dari fungsi main",
                        "Otomatis dieksekusi pertama kali ketika package di-load/di-import",
                        "Saat terjadi panic",
                        "Di akhir setelah main selesai"
                ],
                "correctIndex": 1,
                "explanation": "Fungsi init() berjalan secara otomatis begitu package dimuat ke memori."
        }
},
{
        "id": 50,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "05:14:49",
        "title": "Error Interface",
        "desc": "Pendekatan penanganan kesalahan di Go menggunakan built-in interface 'error' dan errors.New().",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Error Handling di Go</h3>\n                <p>Go tidak menggunakan mekanisme <code>try-catch-finally</code> seperti Java/C#. Sebagai gantinya, kesalahan direpresentasikan sebagai nilai biasa menggunakan interface bawaan <code>error</code>.</p>\n                <p>Sintaks umum: <code>errors.New(\"pesan error\")</code>.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nfunc Pembagian(nilai int, pembagi int) (int, error) {\n\tif pembagi == 0 {\n\t\treturn 0, errors.New(\"Pembagian dengan angka Nol tidak diizinkan!\")\n\t}\n\treturn nilai / pembagi, nil\n}\n\nfunc main() {\n\thasil, err := Pembagian(100, 0)\n\tif err != nil {\n\t\tfmt.Println(\"Terjadi Error:\", err.Error())\n\t} else {\n\t\tfmt.Println(\"Hasil Pembagian:\", hasil)\n\t}\n}",
        "quiz": {
                "question": "Bagaimana cara umum menangani error dari sebuah panggilan fungsi di Golang?",
                "options": [
                        "Menggunakan blok try-catch",
                        "Memeriksa apakah variabel error tidak sama dengan nil (if err != nil)",
                        "Program otomatis berhenti jika error",
                        "Menggunakan kata kunci throw"
                ],
                "correctIndex": 1,
                "explanation": "Pengecekan idiomatis Go adalah mengecek 'if err != nil'."
        }
},
{
        "id": 51,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "05:20:03",
        "title": "Membuat Custom Error",
        "desc": "Membuat struct error kustom sendiri dengan mengimplementasikan method Error() string.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Custom Error</h3>\n                <p>Kita dapat membuat jenis error sendiri yang kaya informasi dengan membuat <code>struct</code> yang memiliki method <code>Error() string</code>.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\ntype validationError struct {\n\tMessage string\n}\n\nfunc (v *validationError) Error() string {\n\treturn v.Message\n}\n\nfunc SaveData(id string) error {\n\tif id == \"\" {\n\t\treturn &validationError{\"ID tidak boleh kosong!\"}\n\t}\n\treturn nil\n}\n\nfunc main() {\n\terr := SaveData(\"\")\n\tif err != nil {\n\t\t// Type assertion untuk custom error\n\t\tif valErr, ok := err.(*validationError); ok {\n\t\t\tfmt.Println(\"Custom Validation Error:\", valErr.Message)\n\t\t} else {\n\t\t\tfmt.Println(\"Unknown Error:\", err)\n\t\t}\n\t}\n}",
        "quiz": {
                "question": "Method apakah yang wajib dimiliki oleh struct agar dianggap mengimplementasikan interface 'error'?",
                "options": [
                        "GetError() string",
                        "Error() string",
                        "ToString() string",
                        "Message() string"
                ],
                "correctIndex": 1,
                "explanation": "Interface 'error' hanya memiliki satu method yaitu 'Error() string'."
        }
},
{
        "id": 52,
        "category": "Domain 1: Fondasi Bahasa Go",
        "timestamp": "05:29:54",
        "title": "Rangkuman Modul Dasar",
        "desc": "Kesimpulan materi Golang Dasar dan jembatan menuju materi Golang Standard Library.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Selamat! Modul Golang Dasar Selesai 🎉</h3>\n                <p>Anda telah mempelajari seluruh fondasi dasar bahasa pemrograman Go. Selanjutnya, mari kita pelajari pustaka bawaan resmi Go di <strong>Modul 2: Golang Standard Library</strong>!</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Modul 1 Golang Dasar Selesai!\")\n\tfmt.Println(\"Lanjutkan ke Bab 53 untuk mempelajari Golang Standard Library!\")\n}",
        "quiz": {
                "question": "Apa nama modul pustaka bawaan resmi yang disediakan langsung saat instalasi Go?",
                "options": [
                        "Standard Library",
                        "NPM Packages",
                        "External Modules",
                        "Cargo Crates"
                ],
                "correctIndex": 0,
                "explanation": "Go dilengkapi dengan Standard Library yang sangat kaya dan bertenaga langsung saat diinstall."
        }
},
{
        "id": 53,
        "category": "Domain 2: Standard Library",
        "timestamp": "00:01:21",
        "title": "Pengenalan Standard Library",
        "desc": "Memahami konsep Go Standard Library (pustaka bawaan Go) dan ekosistem package resminya.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Apa itu Go Standard Library?</h3>\n                <p><strong>Go Standard Library</strong> adalah kumpulan package bawaan resmi yang disertakan secara gratis saat kita menginstall compiler Go di komputer.</p>\n                <p>Dokumentasi lengkap seluruh package Standard Library dapat diakses di situs resmi <a href=\"https://pkg.go.dev/std\" target=\"_blank\" style=\"color: var(--go-blue)\">pkg.go.dev/std</a>.</p>\n\n                <div class=\"callout callout-info\">\n                    <div class=\"callout-title\">💡 Mengapa Standard Library Go Sangat Populer?</div>\n                    <p>Berbeda dari bahasa lain yang butuh banyak library pihak ketiga, Standard Library Go sangat kaya fitur (*batteries included*), mencakup HTTP Web Server, JSON parser, Cryptography, Database driver interface, hingga Concurrency pritimive!</p>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"runtime\"\n)\n\nfunc main() {\n\tfmt.Println(\"Memulai Modul Golang Standard Library!\")\n\tfmt.Println(\"Versi Go SDK:\", runtime.Version())\n}",
        "quiz": {
                "question": "Dimanakah alamat dokumentasi resmi seluruh package Standard Library Golang?",
                "options": [
                        "pkg.go.dev/std",
                        "npmjs.com",
                        "github.com/golang",
                        "go.org/docs"
                ],
                "correctIndex": 0,
                "explanation": "Situs resmi pkg.go.dev/std mencakup dokumentasi API seluruh package bawaan Go."
        }
},
{
        "id": 54,
        "category": "Domain 2: Standard Library",
        "timestamp": "00:04:35",
        "title": "Package fmt (Formatting I/O)",
        "desc": "Fungsi cetak dan formatting string: Print, Println, Printf, Sprintf, dan format verb (%v, %+v, %#v, %d, %s).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package fmt</h3>\n                <p>Package <code>fmt</code> (Formated I/O) menyediakan fungsi untuk format teks masukan dan keluaran.</p>\n\n                <h3>Format Verb Populer:</h3>\n                <table class=\"tech-table\">\n                    <thead>\n                        <tr><th>Verb</th><th>Fungsi / Keterangan</th></tr>\n                    </thead>\n                    <tbody>\n                        <tr><td><code>%v</code></td><td>Format nilai default (Default value format)</td></tr>\n                        <tr><td><code>%+v</code></td><td>Format struct beserta nama field-nya</td></tr>\n                        <tr><td><code>%#v</code></td><td>Format sintaks kode Go aktual dari objek</td></tr>\n                        <tr><td><code>%T</code></td><td>Format tipe data dari variabel</td></tr>\n                        <tr><td><code>%d</code></td><td>Format angka integer desimal</td></tr>\n                        <tr><td><code>%s</code></td><td>Format nilai string</td></tr>\n                        <tr><td><code>%t</code></td><td>Format nilai boolean (true/false)</td></tr>\n                    </tbody>\n                </table>\n\n                <div class=\"callout callout-tip\">\n                    <div class=\"callout-title\">📌 Sprintf vs Printf:</div>\n                    <p><code>fmt.Printf</code> mencetak langsung ke stdout, sedangkan <code>fmt.Sprintf</code> mengembalikan hasil format sebagai <strong>string</strong> tanpa mencetaknya.</p>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\ntype Person struct {\n\tName string\n\tAge  int\n}\n\nfunc main() {\n\tp := Person{Name: \"Eko Kurniawan\", Age: 30}\n\n\tfmt.Printf(\"Default %%v: %v\n\", p)\n\tfmt.Printf(\"Struct Field %%+v: %+v\n\", p)\n\tfmt.Printf(\"Go Syntax %%#v: %#v\n\", p)\n\tfmt.Printf(\"Type %%T: %T\n\", p)\n\n\t// Sprintf mengembalikan string\n\tresultString := fmt.Sprintf(\"Nama: %s, Umur: %d\", p.Name, p.Age)\n\tfmt.Println(\"Hasil Sprintf:\", resultString)\n}",
        "quiz": {
                "question": "Format verb manakah yang digunakan untuk menampilkan struct beserta NAMA FIELD-nya?",
                "options": [
                        "%v",
                        "%+v",
                        "%#v",
                        "%T"
                ],
                "correctIndex": 1,
                "explanation": "'%+v' mencetak isi struct beserta nama-nama field propertinya."
        }
},
{
        "id": 55,
        "category": "Domain 2: Standard Library",
        "timestamp": "00:10:08",
        "title": "Package errors",
        "desc": "Penanganan error tingkat lanjut dengan errors.New, errors.Is, errors.As, dan errors.Unwrap.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package errors</h3>\n                <p>Package <code>errors</code> menyediakan utilitas untuk membuat dan memeriksa kesalahan di Go modern.</p>\n\n                <ul>\n                    <li><code>errors.New(\"msg\")</code>: Membuat error baru sederhana.</li>\n                    <li><code>fmt.Errorf(\"... %w\", err)</code>: Menguraikan/membungkus error (*Error Wrapping*).</li>\n                    <li><code>errors.Is(err, target)</code>: Memeriksa apakah error cocok dengan target tertentu (meskipun di-wrap).</li>\n                    <li><code>errors.As(err, &targetStruct)</code>: Mengonversi error ke tipe custom error struct tertentu.</li>\n                </ul>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\nvar (\n\tErrNotFound     = errors.New(\"data tidak ditemukan\")\n\tErrValidationError = errors.New(\"validasi gagal\")\n)\n\nfunc GetById(id string) error {\n\tif id == \"\" {\n\t\treturn ErrValidationError\n\t}\n\tif id != \"eko\" {\n\t\treturn fmt.Errorf(\"search id %s: %w\", id, ErrNotFound) // Wrapping Error\n\t}\n\treturn nil\n}\n\nfunc main() {\n\terr := GetById(\"budi\")\n\n\tif err != nil {\n\t\tif errors.Is(err, ErrNotFound) {\n\t\t\tfmt.Println(\"Pencarian Gagal: Data Not Found!\")\n\t\t} else {\n\t\t\tfmt.Println(\"Error Lain:\", err)\n\t\t}\n\t}\n}",
        "quiz": {
                "question": "Fungsi apakah yang digunakan untuk mengecek apakah suatu error cocok dengan error spesifik tertentu (meskipun sudah dibungkus/wrapped)?",
                "options": [
                        "errors.Is()",
                        "errors.As()",
                        "errors.Check()",
                        "errors.Equals()"
                ],
                "correctIndex": 0,
                "explanation": "'errors.Is(err, target)' membandingkan hirarki error secara presisi."
        }
},
{
        "id": 56,
        "category": "Domain 2: Standard Library",
        "timestamp": "00:16:05",
        "title": "Package os",
        "desc": "Mengakses fitur sistem operasi: Command Line Arguments (os.Args), Hostname, Environment Variables (os.Getenv).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package os</h3>\n                <p>Package <code>os</code> menyediakan interface independen platform untuk berinteraksi dengan Sistem Operasi.</p>\n\n                <ul>\n                    <li><code>os.Args</code>: Slice string yang berisi argumen baris perintah terminal.</li>\n                    <li><code>os.Getenv(\"KEY\")</code> / <code>os.Setenv(\"KEY\", \"VAL\")</code>: Membaca & memasang Environment Variable.</li>\n                    <li><code>os.Hostname()</code>: Mengambil nama komputer host.</li>\n                </ul>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"os\"\n)\n\nfunc main() {\n\t// Membaca Argumen CLI terminal\n\targs := os.Args\n\tfmt.Println(\"CLI Arguments:\", args)\n\n\t// Environment Variables\n\tos.Setenv(\"APP_ENV\", \"development\")\n\tenv := os.Getenv(\"APP_ENV\")\n\tfmt.Println(\"APP_ENV Variable:\", env)\n\n\t// Hostname\n\thostname, _ := os.Hostname()\n\tfmt.Println(\"Hostname OS:\", hostname)\n}",
        "quiz": {
                "question": "Variabel slice string apakah di package 'os' yang menyimpan daftar argumen terminal saat aplikasi dijalankan?",
                "options": [
                        "os.CommandLine",
                        "os.Args",
                        "os.Params",
                        "os.Inputs"
                ],
                "correctIndex": 1,
                "explanation": "'os.Args' menampung perintah dan argumen CLI yang diteruskan saat aplikasi dipanggil."
        }
},
{
        "id": 57,
        "category": "Domain 2: Standard Library",
        "timestamp": "00:21:05",
        "title": "Package flag",
        "desc": "Parsing Command Line Flags/Options secara elegan dengan flag.String, flag.Int, dan flag.Parse().",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package flag</h3>\n                <p>Package <code>flag</code> memudahkan pembuatan aplikasi berbasis Command Line Interface (CLI) yang menerima opsi bertanda strip (seperti <code>-host=localhost -port=8080</code>).</p>\n\n                <div class=\"callout callout-warning\">\n                    <div class=\"callout-title\">⚠️ Wajib Memanggil flag.Parse():</div>\n                    <p>Setelah mendefinisikan flag, Anda **HARUS MEMANGGIL** <code>flag.Parse()</code> sebelum nilai variabel pointer flag dibaca!</p>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"flag\"\n\t\"fmt\"\n)\n\nfunc main() {\n\t// Definisi flag (mengembalikan POINTER)\n\thost := flag.String(\"host\", \"localhost\", \"Put database host\")\n\tport := flag.Int(\"port\", 3306, \"Put database port\")\n\tuser := flag.String(\"user\", \"root\", \"Put database user\")\n\n\t// Wajib dipanggil!\n\tflag.Parse()\n\n\t// Membaca nilai pointer dengan *\n\tfmt.Println(\"Database Config:\")\n\tfmt.Println(\"Host:\", *host)\n\tfmt.Println(\"Port:\", *port)\n\tfmt.Println(\"User:\", *user)\n}",
        "quiz": {
                "question": "Fungsi apakah yang WAJIB dipanggil setelah mendefinisikan flag agar proses parsing CLI argumen berjalan?",
                "options": [
                        "flag.Init()",
                        "flag.Parse()",
                        "flag.Start()",
                        "flag.Execute()"
                ],
                "correctIndex": 1,
                "explanation": "Tanpa calling 'flag.Parse()', nilai variabel flag tidak akan terisi dari CLI."
        }
},
{
        "id": 58,
        "category": "Domain 2: Standard Library",
        "timestamp": "00:27:35",
        "title": "Package strings",
        "desc": "Manipulasi string tingkat lanjut: Contains, Split, Join, ToLower, ToUpper, Trim, dan ReplaceAll.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package strings</h3>\n                <p>Package <code>strings</code> menyediakan banyak fungsi utilitas untuk memanipulasi data teks string.</p>\n\n                <table class=\"tech-table\">\n                    <thead>\n                        <tr><th>Fungsi</th><th>Deskripsi</th></tr>\n                    </thead>\n                    <tbody>\n                        <tr><td><code>strings.Contains(s, sub)</code></td><td>Mengecek apakah string memuat substring tertentu (bool)</td></tr>\n                        <tr><td><code>strings.Split(s, sep)</code></td><td>Memotong string menjadi slice string berdasarkan pemisah</td></tr>\n                        <tr><td><code>strings.Join(slice, sep)</code></td><td>Menggabungkan slice string menjadi satu string utuh</td></tr>\n                        <tr><td><code>strings.ToLower(s) / ToUpper(s)</code></td><td>Mengubah huruf menjadi kecil / kapital semua</td></tr>\n                        <tr><td><code>strings.Trim(s, cutset)</code></td><td>Memotong karakter spasi/tertentu di awal dan akhir string</td></tr>\n                        <tr><td><code>strings.ReplaceAll(s, old, new)</code></td><td>Mengganti semua substring lama dengan baru</td></tr>\n                    </tbody>\n                </table>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"strings\"\n)\n\nfunc main() {\n\ttext := \"  Eko Kurniawan Khannedy  \"\n\n\tfmt.Println(\"Contains 'Kurniawan':\", strings.Contains(text, \"Kurniawan\"))\n\tfmt.Println(\"Trimmed:\", strings.TrimSpace(text))\n\tfmt.Println(\"Upper:\", strings.ToUpper(text))\n\t\n\twords := strings.Split(strings.TrimSpace(text), \" \")\n\tfmt.Println(\"Split Words:\", words)\n\tfmt.Println(\"Joined with Dash:\", strings.Join(words, \"-\"))\n}",
        "quiz": {
                "question": "Fungsi apakah yang digunakan untuk menggabungkan slice []string menjadi satu string utuh dipisahkan oleh karakter tertentu?",
                "options": [
                        "strings.Concat()",
                        "strings.Join()",
                        "strings.Merge()",
                        "strings.Combine()"
                ],
                "correctIndex": 1,
                "explanation": "'strings.Join(slice, separator)' menggabungkan elemen slice string."
        }
},
{
        "id": 59,
        "category": "Domain 2: Standard Library",
        "timestamp": "00:32:00",
        "title": "Package strconv (String Conversions)",
        "desc": "Konversi string ke tipe data lain dan sebaliknya: Atoi, Itoa, ParseBool, ParseInt, FormatInt.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package strconv</h3>\n                <p>Package <code>strconv</code> digunakan untuk konversi dari tipe data String ke tipe data primitif (int, float, bool) atau sebaliknya.</p>\n\n                <h3>Singkatan Populer:</h3>\n                <ul>\n                    <li><code>strconv.Atoi(s)</code>: ASCII to Integer (String ke Int).</li>\n                    <li><code>strconv.Itoa(i)</code>: Integer to ASCII (Int ke String).</li>\n                    <li><code>strconv.ParseBool(\"true\")</code>: String ke Boolean.</li>\n                    <li><code>strconv.ParseFloat(\"3.14\", 64)</code>: String ke Float64.</li>\n                </ul>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"strconv\"\n)\n\nfunc main() {\n\t// String ke Int (Atoi)\n\tnumber, err := strconv.Atoi(\"1000\")\n\tif err == nil {\n\t\tfmt.Println(\"Hasil Atoi int:\", number+500)\n\t}\n\n\t// Int ke String (Itoa)\n\tstrVal := strconv.Itoa(2024)\n\tfmt.Println(\"Hasil Itoa string:\", strVal + \" Tahun\")\n\n\t// Parse Bool\n\tbooleanVal, _ := strconv.ParseBool(\"true\")\n\tfmt.Println(\"Parsed Bool:\", booleanVal)\n}",
        "quiz": {
                "question": "Apa kepanjangan dari fungsi 'strconv.Atoi()'?",
                "options": [
                        "Array to Integer",
                        "ASCII to Integer (String to Int)",
                        "Auto to Index",
                        "Alias to Int"
                ],
                "correctIndex": 1,
                "explanation": "Atoi adalah singkatan klasik 'ASCII to Integer' (mengubah string ke angka int)."
        }
},
{
        "id": 60,
        "category": "Domain 2: Standard Library",
        "timestamp": "00:38:01",
        "title": "Package math",
        "desc": "Fungsi matematika: Round, Floor, Ceil, Max, Min, Pow, dan konstanta math.Pi.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package math</h3>\n                <p>Package <code>math</code> menyediakan fungsi matematika dan konstanta dasar untuk angka bertipe <code>float64</code>.</p>\n\n                <ul>\n                    <li><code>math.Round(x)</code>: Membulatkan ke angka terdekat.</li>\n                    <li><code>math.Floor(x)</code>: Membulatkan ke bawah.</li>\n                    <li><code>math.Ceil(x)</code>: Membulatkan ke atas.</li>\n                    <li><code>math.Max(a, b)</code> / <code>math.Min(a, b)</code>: Mengambil nilai terbesar / terkecil.</li>\n                </ul>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"math\"\n)\n\nfunc main() {\n\tfmt.Println(\"math.Round(1.7):\", math.Round(1.7))\n\tfmt.Println(\"math.Floor(1.7):\", math.Floor(1.7))\n\tfmt.Println(\"math.Ceil(1.3):\", math.Ceil(1.3))\n\tfmt.Println(\"math.Max(10, 20):\", math.Max(10, 20))\n\tfmt.Println(\"math.Pow(2, 3):\", math.Pow(2, 3)) // 2^3 = 8\n}",
        "quiz": {
                "question": "Fungsi math apakah yang digunakan untuk membulatkan angka desimal selalu KE BAWAH?",
                "options": [
                        "math.Ceil()",
                        "math.Floor()",
                        "math.Round()",
                        "math.Abs()"
                ],
                "correctIndex": 1,
                "explanation": "'math.Floor()' selalu membulatkan angka float ke bawah."
        }
},
{
        "id": 61,
        "category": "Domain 2: Standard Library",
        "timestamp": "00:40:38",
        "title": "Package container/list",
        "desc": "Struktur data Doubly Linked List: PushBack, PushFront, Front, Back, dan iterasi Next().",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package container/list</h3>\n                <p>Package <code>container/list</code> mengimplementasikan struktur data <strong>Doubly Linked List</strong>.</p>\n\n                <p>Setiap elemen menunjuk ke elemen sebelum (Prev) dan elemen setelahnya (Next).</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"container/list\"\n\t\"fmt\"\n)\n\nfunc main() {\n\tdata := list.New()\n\n\tdata.PushBack(\"Eko\")\n\tdata.PushBack(\"Kurniawan\")\n\tdata.PushBack(\"Khannedy\")\n\tdata.PushFront(\"Budi\") // Ditambah di paling depan\n\n\t// Iterasi Linked List dari Front ke Back\n\tfor e := data.Front(); e != nil; e = e.Next() {\n\t\tfmt.Println(\"Element:\", e.Value)\n\t}\n}",
        "quiz": {
                "question": "Struktur data apakah yang diimplementasikan oleh package 'container/list'?",
                "options": [
                        "Array Fixed Length",
                        "Doubly Linked List",
                        "Stack LIFO",
                        "Binary Search Tree"
                ],
                "correctIndex": 1,
                "explanation": "container/list mengimplementasikan struktur Doubly Linked List."
        }
},
{
        "id": 62,
        "category": "Domain 2: Standard Library",
        "timestamp": "00:48:21",
        "title": "Package container/ring",
        "desc": "Struktur data Circular List (Ring): Melingkar tanpa ujung akhir.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package container/ring</h3>\n                <p>Package <code>container/ring</code> mengimplementasikan struktur data **Circular List** (Ring), di mana elemen terakhir kembali menunjuk ke elemen pertama.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"container/ring\"\n\t\"fmt\"\n\t\"strconv\"\n)\n\nfunc main() {\n\tdata := ring.New(5) // Ring dengan 5 elemen\n\n\tfor i := 0; i < data.Len(); i++ {\n\t\tdata.Value = \"Data \" + strconv.Itoa(i)\n\t\tdata = data.Next()\n\t}\n\n\t// Iterasi Ring dengan Do()\n\tdata.Do(func(value any) {\n\t\tfmt.Println(\"Ring Value:\", value)\n\t})\n}",
        "quiz": {
                "question": "Apa ciri khas utama dari struktur data Ring (Circular List)?",
                "options": [
                        "Elemen terakhir kembali menunjuk ke elemen pertama (melingkar)",
                        "Ukurannya selalu fixed 100 elemen",
                        "Hanya bisa menyimpan tipe integer",
                        "Data langsung berurut otomatis"
                ],
                "correctIndex": 0,
                "explanation": "Ring berbentuk lingkaran tanpa penanda ujung akhir (head terhubung ke tail)."
        }
},
{
        "id": 63,
        "category": "Domain 2: Standard Library",
        "timestamp": "00:53:38",
        "title": "Package sort",
        "desc": "Pengurutan data: sort.Ints, sort.Strings, serta mengurutkan custom struct dengan mengimplementasikan sort.Interface (Len, Less, Swap).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package sort</h3>\n                <p>Package <code>sort</code> menyediakan fungsi untuk mengurutkan slice data bawaan maupun objek struct kustom.</p>\n\n                <h3>Tiga Method Kontrak sort.Interface:</h3>\n                <ol>\n                    <li><code>Len() int</code>: Mengembalikan jumlah data.</li>\n                    <li><code>Less(i, j int) bool</code>: Pengujian kriteria data i lebih kecil dari j.</li>\n                    <li><code>Swap(i, j int)</code>: Menukar posisi elemen i dan j.</li>\n                </ol>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n)\n\ntype User struct {\n\tName string\n\tAge  int\n}\n\ntype UserSlice []User\n\nfunc (s UserSlice) Len() int           { return len(s) }\nfunc (s UserSlice) Less(i, j int) bool { return s[i].Age < s[j].Age } // Sort by Age\nfunc (s UserSlice) Swap(i, j int)      { s[i], s[j] = s[j], s[i] }\n\nfunc main() {\n\tusers := UserSlice{\n\t\t{\"Eko\", 30},\n\t\t{\"Budi\", 25},\n\t\t{\"Joko\", 35},\n\t}\n\n\tsort.Sort(users)\n\tfmt.Println(\"Sorted Users by Age:\", users)\n}",
        "quiz": {
                "question": "Tiga method apa sajakah yang wajib diimplementasikan agar custom struct slice dapat diurutkan via sort.Sort()?",
                "options": [
                        "Len(), Less(), Swap()",
                        "Get(), Set(), Count()",
                        "Sort(), Order(), Compare()",
                        "First(), Next(), Last()"
                ],
                "correctIndex": 0,
                "explanation": "sort.Interface membutuhkan kontrak 3 method: Len(), Less(i, j), dan Swap(i, j)."
        }
},
{
        "id": 64,
        "category": "Domain 2: Standard Library",
        "timestamp": "01:00:42",
        "title": "Package time",
        "desc": "Manajemen waktu & tanggal: time.Now(), time.Date, Format Layout unik '2006-01-02 15:04:05', Duration, dan Parsing.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package time</h3>\n                <p>Package <code>time</code> menyediakan fungsi pengukursan, kalkulasi, dan formatting waktu.</p>\n\n                <div class=\"callout callout-warning\">\n                    <div class=\"callout-title\">⚠️ Magic Format Standard Go (2006-01-02):</div>\n                    <p>Format layout tanggal di Go **TIDAK Menggunakan YYYY-MM-DD**, melainkan tanggal patokan ajaib: <code>2006-01-02 15:04:05</code> (Mon Jan 2 15:04:05 MST 2006)!</p>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tnow := time.Now()\n\tfmt.Println(\"Waktu Sekarang:\", now)\n\n\t// Format Tanggal (Gunakan Layout Standar Go 2006-01-02)\n\tformatter := now.Format(\"02-01-2006 15:04:05\")\n\tfmt.Println(\"Formatted Date:\", formatter)\n\n\t// Parse Tanggal dari String\n\tlayout := \"2006-01-02\"\n\tparsedTime, _ := time.Parse(layout, \"2024-12-31\")\n\tfmt.Println(\"Parsed Time:\", parsedTime)\n}",
        "quiz": {
                "question": "Tahun, Bulan, dan Jam manakah yang menjadi patokan standar layout formatting waktu di Golang?",
                "options": [
                        "YYYY-MM-DD HH:mm:ss",
                        "2006-01-02 15:04:05",
                        "1970-01-01 00:00:00",
                        "2000-12-31 23:59:59"
                ],
                "correctIndex": 1,
                "explanation": "Go menggunakan patokan tanggal khusus: 2006-01-02 15:04:05 (1 2 3 4 5 6)."
        }
},
{
        "id": 65,
        "category": "Domain 2: Standard Library",
        "timestamp": "01:14:18",
        "title": "Package reflect",
        "desc": "Inspeksi metadata variabel di runtime dengan reflect.TypeOf, reflect.ValueOf, dan membaca Struct Tags.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package reflect (Reflection)</h3>\n                <p><strong>Reflection</strong> adalah kemampuan program membaca tipe data dan struktur metadata variabel pada saat program berjalan (*runtime*).</p>\n\n                <p>Sangat populer digunakan untuk framework validator dan ORM menggunakan <strong>Struct Tag</strong> (misal: <code>`required:\"true\" max:\"10\"`</code>).</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"reflect\"\n)\n\ntype Sample struct {\n\tName string `required:\"true\" max:\"10\"`\n}\n\nfunc readField(sample any) {\n\tsampleType := reflect.TypeOf(sample)\n\tfmt.Println(\"Type Name:\", sampleType.Name())\n\n\tfor i := 0; i < sampleType.NumField(); i++ {\n\t\tfield := sampleType.Field(i)\n\t\tfmt.Println(\"Field Name:\", field.Name)\n\t\tfmt.Println(\"Field Type:\", field.Type)\n\t\tfmt.Println(\"Tag required:\", field.Tag.Get(\"required\"))\n\t}\n}\n\nfunc main() {\n\treadField(Sample{Name: \"Eko\"})\n}",
        "quiz": {
                "question": "Method reflect apakah yang digunakan untuk mengambil informasi struktur tipe data dari variabel 'any'?",
                "options": [
                        "reflect.TypeOf()",
                        "reflect.GetValue()",
                        "reflect.Inspect()",
                        "reflect.ClassOf()"
                ],
                "correctIndex": 0,
                "explanation": "'reflect.TypeOf(val)' mengembalikan objek Type yang memuat metadata variabel."
        }
},
{
        "id": 66,
        "category": "Domain 2: Standard Library",
        "timestamp": "01:30:24",
        "title": "Package regexp",
        "desc": "Pattern matching teks menggunakan Regular Expressions dengan regexp.Compile dan MatchString.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package regexp</h3>\n                <p>Package <code>regexp</code> menyediakan pencarian pola teks menggunakan sintaks **Regular Expression** (RegEx).</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"regexp\"\n)\n\nfunc main() {\n\t// Pola regex untuk mencari kata berpola e[a-z]o\n\tregex, _ := regexp.Compile(`e([a-z])o`)\n\n\tfmt.Println(\"Match 'eko':\", regex.MatchString(\"eko\"))\n\tfmt.Println(\"Match 'edo':\", regex.MatchString(\"edo\"))\n\tfmt.Println(\"Match 'ego':\", regex.MatchString(\"ego\"))\n\n\t// Mencetak semua pencocokan\n\tresults := regex.FindAllString(\"eko edo ego eto e1o\", -1)\n\tfmt.Println(\"Find All:\", results)\n}",
        "quiz": {
                "question": "Fungsi apakah yang digunakan untuk mengompilasi pola sintaks RegEx string menjadi objek *Regexp?",
                "options": [
                        "regexp.Compile()",
                        "regexp.New()",
                        "regexp.Parse()",
                        "regexp.Create()"
                ],
                "correctIndex": 0,
                "explanation": "'regexp.Compile(pattern)' membuat objek Regexp yang siap dieksekusi."
        }
},
{
        "id": 67,
        "category": "Domain 2: Standard Library",
        "timestamp": "01:36:21",
        "title": "Package encoding (Base64 & CSV)",
        "desc": "Encode & Decode data: Base64 encoding (base64.StdEncoding) dan pembacaan CSV (csv.NewReader).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package encoding</h3>\n                <p>Package <code>encoding</code> berisi sub-package untuk konversi format data seperti <code>encoding/base64</code>, <code>encoding/csv</code>, dan <code>encoding/json</code>.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"encoding/base64\"\n\t\"fmt\"\n)\n\nfunc main() {\n\toriginal := \"Eko Kurniawan Khannedy\"\n\n\t// Encoding ke Base64\n\tencoded := base64.StdEncoding.EncodeToString([]byte(original))\n\tfmt.Println(\"Encoded Base64:\", encoded)\n\n\t// Decoding dari Base64\n\tdecodedBytes, _ := base64.StdEncoding.DecodeString(encoded)\n\tfmt.Println(\"Decoded Original:\", string(decodedBytes))\n}",
        "quiz": {
                "question": "Fungsi apakah pada base64.StdEncoding yang digunakan untuk mengonversi byte data menjadi string Base64?",
                "options": [
                        "EncodeToString()",
                        "ConvertToBase64()",
                        "Stringify()",
                        "Base64Encode()"
                ],
                "correctIndex": 0,
                "explanation": "'EncodeToString([]byte)' menerima byte slice dan menghasilkan string terlindungi Base64."
        }
},
{
        "id": 68,
        "category": "Domain 2: Standard Library",
        "timestamp": "01:46:05",
        "title": "Package slices & maps",
        "desc": "Package utility modern Go: slices.Min, slices.Max, slices.Contains, slices.Index.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package slices & maps (Go Modern)</h3>\n                <p>Sejak Go 1.21+, hadir package <code>slices</code> yang mempermudah operasi pencarian, pengurutan, dan komparasi slice tanpa perlu for loop manual.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"slices\"\n)\n\nfunc main() {\n\tnames := []string{\"Eko\", \"Kurniawan\", \"Khannedy\"}\n\tvalues := []int{10, 90, 30, 50}\n\n\tfmt.Println(\"Min value:\", slices.Min(values))\n\tfmt.Println(\"Max value:\", slices.Max(values))\n\tfmt.Println(\"Contains 'Eko':\", slices.Contains(names, \"Eko\"))\n\tfmt.Println(\"Index 'Khannedy':\", slices.Index(names, \"Khannedy\"))\n}",
        "quiz": {
                "question": "Fungsi dari package 'slices' yang digunakan untuk mengecek keberadaan suatu nilai di dalam slice tanpa loop manual adalah...",
                "options": [
                        "slices.Contains()",
                        "slices.Has()",
                        "slices.Exists()",
                        "slices.Search()"
                ],
                "correctIndex": 0,
                "explanation": "'slices.Contains(slice, item)' mengembalikan boolean true jika item ada di slice."
        }
},
{
        "id": 69,
        "category": "Domain 2: Standard Library",
        "timestamp": "01:49:59",
        "title": "Package path & filepath",
        "desc": "Manipulasi lokasi path file secara independen lintas OS: path.Dir, path.Base, path.Ext, filepath.Join.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package path & path/filepath</h3>\n                <p>Package <code>path/filepath</code> digunakan untuk memanipulasi direktori path file sesuai separator OS (slash <code>/</code> di Linux/Mac atau backslash <code>\\</code> di Windows).</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"path/filepath\"\n)\n\nfunc main() {\n\tpath := \"/home/user/documents/report.pdf\"\n\n\tfmt.Println(\"Dir:\", filepath.Dir(path))\n\tfmt.Println(\"Base:\", filepath.Base(path))\n\tfmt.Println(\"Ext:\", filepath.Ext(path))\n\t\n\t// Join path aman lintas OS\n\tnewPath := filepath.Join(\"home\", \"user\", \"file.txt\")\n\tfmt.Println(\"Joined Path:\", newPath)\n}",
        "quiz": {
                "question": "Fungsi apakah yang digunakan untuk menggabungkan nama-nama folder menjadi path file yang aman lintas OS?",
                "options": [
                        "filepath.Join()",
                        "filepath.Concat()",
                        "filepath.Combine()",
                        "filepath.Merge()"
                ],
                "correctIndex": 0,
                "explanation": "'filepath.Join(...elem)' menggabungkan path dengan separator yang sesuai OS lokal."
        }
},
{
        "id": 70,
        "category": "Domain 2: Standard Library",
        "timestamp": "01:55:20",
        "title": "Package io (Reader & Writer Interfaces)",
        "desc": "Mengenal fondasi Stream I/O di Go: io.Reader, io.Writer, dan io.ReadAll.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package io</h3>\n                <p>Package <code>io</code> menyediakan fondasi interface utama pengolahan data stream di Go:</p>\n                <ul>\n                    <li><code>io.Reader</code>: Interface pembaca stream data.</li>\n                    <li><code>io.Writer</code>: Interface penulisan stream data.</li>\n                    <li><code>io.ReadAll(reader)</code>: Membaca seluruh sisa data dari reader hingga EOF.</li>\n                </ul>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"io\"\n\t\"strings\"\n)\n\nfunc main() {\n\t// strings.Reader mengimplementasikan io.Reader\n\treader := strings.NewReader(\"Belajar io.Reader di Golang Standard Library\")\n\n\t// Membaca seluruh data reader\n\tbytes, _ := io.ReadAll(reader)\n\tfmt.Println(\"Hasil ReadAll:\", string(bytes))\n}",
        "quiz": {
                "question": "Interface manakah di package 'io' yang mendefinisikan kemampuan pembacaan stream data?",
                "options": [
                        "io.Reader",
                        "io.Writer",
                        "io.Streamer",
                        "io.Parser"
                ],
                "correctIndex": 0,
                "explanation": "'io.Reader' adalah interface paling mendasar untuk semua operasi read stream di Go."
        }
},
{
        "id": 71,
        "category": "Domain 2: Standard Library",
        "timestamp": "01:58:05",
        "title": "Package bufio",
        "desc": "Buffered Input Output untuk pembacaan & penulisan efisien berkebutuhan tinggi (bufio.NewScanner, bufio.NewWriter).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package bufio (Buffered I/O)</h3>\n                <p>Package <code>bufio</code> membungkus <code>io.Reader</code> atau <code>io.Writer</code> dengan memori **buffer** sehingga mengurangi jumlah panggilan sistem I/O (System Calls) ke disk/network.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"bufio\"\n\t\"fmt\"\n\n\t\"strings\"\n)\n\nfunc main() {\n\tinput := \"Baris Pertama\nBaris Kedua\nBaris Ketiga\"\n\tscanner := bufio.NewScanner(strings.NewReader(input))\n\n\t// Membaca teks baris demi baris secara efisien\n\tfor scanner.Scan() {\n\t\tfmt.Println(\"Line Scanned:\", scanner.Text())\n\t}\n}",
        "quiz": {
                "question": "Apa keuntungan utama menggunakan bufio dibanding io biasa?",
                "options": [
                        "Menggunakan penyangga memori (buffer) sehingga meminimalkan System Calls I/O ke disk/jaringan",
                        "Menghapus file secara otomatis",
                        "Otomatis mengompres file ke zip",
                        "Hanya bisa membaca file angka"
                ],
                "correctIndex": 0,
                "explanation": "Bufio menyimpan data sementara di buffer memory untuk efisiensi I/O yang jauh lebih tinggi."
        }
},
{
        "id": 72,
        "category": "Domain 2: Standard Library",
        "timestamp": "02:04:10",
        "title": "File Manipulation",
        "desc": "Membuat, membaca, dan menulis file lokal dengan os.Create, os.ReadFile, os.WriteFile, dan os.OpenFile.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>File Manipulation di Go</h3>\n                <p>Mekanisme pengolahan file fisik di disk menggunakan kombinasi package <code>os</code> dan <code>io</code>.</p>\n\n                <ul>\n                    <li><code>os.WriteFile(\"file.txt\", data, 0666)</code>: Menulis file baru sekaligus.</li>\n                    <li><code>os.ReadFile(\"file.txt\")</code>: Membaca seluruh isi file sekaligus.</li>\n                    <li><code>os.OpenFile(\"file.txt\", os.O_APPEND, 0666)</code>: Membuka file untuk menambah isi (append mode).</li>\n                </ul>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"os\"\n)\n\nfunc createAndReadFile() error {\n\t// Menulis file\n\tmessage := []byte(\"Hello Golang File Manipulation!\")\n\terr := os.WriteFile(\"sample.txt\", message, 0666)\n\tif err != nil {\n\t\treturn err\n\t}\n\n\t// Membaca file\n\tdata, err := os.ReadFile(\"sample.txt\")\n\tif err != nil {\n\t\treturn err\n\t}\n\n\tfmt.Println(\"Isi File sample.txt:\", string(data))\n\treturn nil\n}\n\nfunc main() {\n\tcreateAndReadFile()\n}",
        "quiz": {
                "question": "Fungsi ringkas apakah di package 'os' yang digunakan untuk membuat dan menulis byte data ke file fisik sekaligus?",
                "options": [
                        "os.WriteFile()",
                        "os.SaveFile()",
                        "os.CreateFile()",
                        "os.DumpFile()"
                ],
                "correctIndex": 0,
                "explanation": "'os.WriteFile(filename, bytes, perm)' menulis data ke file fisik secara langsung."
        }
},
{
        "id": 73,
        "category": "Domain 2: Standard Library",
        "timestamp": "02:16:53",
        "title": "Overview Package Lainnya",
        "desc": "Overview singkat package penting lainnya: net/http, sync, context, database/sql, dan crypto.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Package Penting Lainnya di Standard Library:</h3>\n                <ul>\n                    <li><code>net/http</code>: HTTP Web Client dan HTTP Web Server bawaan Go.</li>\n                    <li><code>sync</code>: Sinkronisasi Goroutine (WaitGroup, Mutex, Once).</li>\n                    <li><code>context</code>: Pembawa sinyal pembatalan & deadline request.</li>\n                    <li><code>database/sql</code>: Abstraksi driver database SQL resmi.</li>\n                    <li><code>crypto</code>: Algoritma kriptografi & enkripsi (AES, SHA256, RSA).</li>\n                </ul>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Package Lanjutan Standard Library:\")\n\tfmt.Println(\"1. net/http (Web Server & REST API)\")\n\tfmt.Println(\"2. sync & context (Concurrency Management)\")\n\tfmt.Println(\"3. database/sql (Database ORM & Driver)\")\n}",
        "quiz": {
                "question": "Package bawaan apakah di Standard Library yang digunakan untuk membangun HTTP Web Server & RESTful API di Go?",
                "options": [
                        "net/http",
                        "web/server",
                        "http/express",
                        "net/socket"
                ],
                "correctIndex": 0,
                "explanation": "'net/http' adalah package bawaan resmi Go untuk HTTP Server & Client."
        }
},
{
        "id": 74,
        "category": "Domain 2: Standard Library",
        "timestamp": "02:18:01",
        "title": "Rangkuman & Langkah Selanjutnya",
        "desc": "Rangkuman menyeluruh Modul Standard Library dan persiapan memasuki dunia Golang Concurrency (Goroutines & Channels).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Selamat! Anda Telah Menguasai 74 Bab Golang! 🎓🎉</h3>\n                <p>Dengan menguasai <strong>Golang Dasar (52 Bab)</strong> dan <strong>Golang Standard Library (22 Bab)</strong>, Anda kini siap melangkah ke topik tingkat lanjut!</p>\n\n                <div class=\"callout callout-tip\">\n                    <div class=\"callout-title\">🚀 Langkah Pembelajaran Selanjutnya:</div>\n                    <ol>\n                        <li><strong>Golang Goroutines & Channels (Concurrency):</strong> Pemrograman asinkronus skala tinggi.</li>\n                        <li><strong>Golang Web / REST API Development:</strong> Membangun microservices backend modern dengan <code>net/http</code> dan PostgreSQL/MySQL.</li>\n                        <li><strong>Unit Testing & Benchmarking:</strong> Menggunakan package <code>testing</code> bawaan Go.</li>\n                    </ol>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"==========================================================\")\n\tfmt.Println(\" SELAMAT! ANDA TELAH MENYELESAIKAN 74 BAB TUTORIAL GOLANG \")\n\tfmt.Println(\"==========================================================\")\n\tfmt.Println(\"Siap Melanjutkan ke Golang Concurrency & Web Backend!\")\n}",
        "quiz": {
                "question": "Package bawaan apakah di Golang yang digunakan untuk menuliskan Unit Test dan Benchmark secara otomatis?",
                "options": [
                        "testing",
                        "unittest",
                        "pytest",
                        "testify"
                ],
                "correctIndex": 0,
                "explanation": "Go menyediakan package 'testing' bawaan resmi yang dijalankan via perintah CLI 'go test'."
        }
},
{
        "id": 75,
        "category": "Domain 3: Go Modules & Dependency",
        "timestamp": "00:02:04",
        "title": "Pengenalan Go-Modules & Semantic Versioning",
        "desc": "Konsep pengelolaan dependency modern di Go, struktur file go.mod, go.sum, dan aturan Semantic Versioning (vMAJOR.MINOR.PATCH).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Apa itu Go-Modules?</h3>\n                <p><strong>Go-Modules</strong> adalah sistem manajemen dependency resmi yang diperkenalkan di Go versi 1.11+ dan menjadi standar wajib sejak Go 1.13+.</p>\n                <p>Sebelum adanya Go-Modules, semua proyek Go wajib disimpan di dalam folder terpusat <code>GOPATH/src</code>. Dengan Go-Modules, Anda bebas menaruh folder proyek di lokasi direktori mana saja!</p>\n\n                <h3>Dua File Utama Go-Modules:</h3>\n                <ul>\n                    <li><code>go.mod</code>: Manifestasi utama proyek yang berisi nama module, versi SDK Go yang digunakan, serta daftar dependency eksternal.</li>\n                    <li><code>go.sum</code>: Catatan hash cryptographic (checksum validation) untuk memastikan keamanan dan integritas berkas dependency yang diunduh agar tidak diubah secara jahat.</li>\n                </ul>\n\n                <h3>Aturan Semantic Versioning (SemVer):</h3>\n                <p>Pengelolaan versi modul di Go mengikuti aturan <strong>vMAJOR.MINOR.PATCH</strong> (misal: <code>v1.2.3</code>):</p>\n                <table class=\"tech-table\">\n                    <thead>\n                        <tr><th>Komponen Versi</th><th>Contoh</th><th>Kapan Dinaikkan / Diubah</th></tr>\n                    </thead>\n                    <tbody>\n                        <tr><td><strong>MAJOR (X)</strong></td><td><code>v2.0.0</code></td><td>Saat terjadi <strong>Breaking Changes</strong> (perubahan API yang merusak backward compatibility kode lama).</td></tr>\n                        <tr><td><strong>MINOR (Y)</strong></td><td><code>v1.3.0</code></td><td>Saat ada <strong>penambahan fitur baru</strong> yang tetap <em>backward compatible</em>.</td></tr>\n                        <tr><td><strong>PATCH (Z)</strong></td><td><code>v1.2.4</code></td><td>Saat ada <strong>perbaikan bug (bugfix)</strong> yang tetap <em>backward compatible</em>.</td></tr>\n                    </tbody>\n                </table>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"=== MODUL 3: GOLANG MODULES ===\")\n\tfmt.Println(\"Semantic Versioning Format: vMAJOR.MINOR.PATCH (contoh: v1.4.2)\")\n\tfmt.Println(\"File go.mod mencatat dependency, file go.sum mencatat hash checksum keamanan.\")\n}",
        "quiz": {
                "question": "Komponen versi manakah dalam Semantic Versioning (vMAJOR.MINOR.PATCH) yang dinaikkan saat terjadi breaking change (API tidak kompatibel lagi)?",
                "options": [
                        "MAJOR",
                        "MINOR",
                        "PATCH",
                        "BUILD"
                ],
                "correctIndex": 0,
                "explanation": "Versi MAJOR dinaikkan jika ada perubahan besar yang tidak kompatibel dengan versi sebelumnya."
        }
},
{
        "id": 76,
        "category": "Domain 3: Go Modules & Dependency",
        "timestamp": "00:06:05",
        "title": "Membuat Module Baru & Inisialisasi",
        "desc": "Perintah 'go mod init', penamaan modul berbasis URL repositori (misal github.com/user/app), dan pembuatan fungsi exported.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Membuat Module Baru</h3>\n                <p>Untuk menginisialisasi modul Go baru, jalankan perintah terminal <code>go mod init nama-module</code>.</p>\n\n                <div class=\"callout callout-tip\">\n                    <div class=\"callout-title\">💡 Best Practice Penamaan Module:</div>\n                    <p>Sangat direkomendasikan menggunakan lokasi alamat repositori Git publik sebagai nama modul, contohnya: <code>github.com/programmerzamannow/go-say-hello</code>. Ini memudahkan orang lain untuk mengunduh modul Anda melalui perintah <code>go get</code>.</p>\n                </div>\n\n                <div class=\"code-box\">\n                    <div class=\"code-box-header\"><span>Terminal</span></div>\n                    <pre># 1. Buat folder baru\nmkdir go-say-hello\ncd go-say-hello\n\n# 2. Inisialisasi modul\ngo mod init github.com/programmerzamannow/go-say-hello</pre>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\n// Fungsi ini diawali Huruf KAPITAL agar Exported (Public)\nfunc SayHello(name string) string {\n\treturn \"Hello \" + name + \", Selamat Datang di Go Modules!\"\n}\n\nfunc main() {\n\tfmt.Println(SayHello(\"Eko\"))\n}",
        "quiz": {
                "question": "Format penamaan modul apakah yang direkomendasikan agar modul Go mudah di-import oleh pengembang lain?",
                "options": [
                        "Nama repositori Git publik (misal: github.com/username/repository-name)",
                        "Nama acak tanpa domain",
                        "Hanya nama file main.go",
                        "Nama sistem operasi"
                ],
                "correctIndex": 0,
                "explanation": "Menggunakan path repositori Git (seperti github.com/user/repo) memudahkan otomatisasi pencarian package oleh Go."
        }
},
{
        "id": 77,
        "category": "Domain 3: Go Modules & Dependency",
        "timestamp": "00:09:30",
        "title": "Release Module ke Git & GitHub",
        "desc": "Mempublikasikan modul ke repositori publik, membuat Git Tag release (git tag v1.0.0), dan pengindeksan di pkg.go.dev.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Mempublikasikan Modul ke GitHub</h3>\n                <p>Agar modul Go Anda dapat digunakan oleh programmer di seluruh dunia, Anda perlu mendorong (*push*) kode ke GitHub dan memberikan **Git Tag** sebagai penanda versi rilis.</p>\n\n                <div class=\"code-box\">\n                    <div class=\"code-box-header\"><span>Terminal Command (Git Tagging)</span></div>\n                    <pre># 1. Push kode ke GitHub\ngit add .\ngit commit -m \"First release version v1.0.0\"\ngit push origin main\n\n# 2. Buat Tag Release v1.0.0\ngit tag v1.0.0\n\n# 3. Push Tag ke Remote GitHub\ngit push origin v1.0.0</pre>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Langkah Rilis Modul Go:\")\n\tfmt.Println(\"1. Commit kode terbaru\")\n\tfmt.Println(\"2. Buat tag rilis: git tag v1.0.0\")\n\tfmt.Println(\"3. Push tag ke GitHub: git push origin v1.0.0\")\n}",
        "quiz": {
                "question": "Perintah Git apakah yang digunakan untuk membuat penanda versi rilis (release tag) pada repositori?",
                "options": [
                        "git tag v1.0.0",
                        "git release v1.0.0",
                        "git mark v1.0.0",
                        "git version v1.0.0"
                ],
                "correctIndex": 0,
                "explanation": "'git tag v1.0.0' membuat penanda rilis versi yang akan dibaca otomatis oleh Go Modules."
        }
},
{
        "id": 78,
        "category": "Domain 3: Go Modules & Dependency",
        "timestamp": "00:14:36",
        "title": "Menambah Dependency Eksternal",
        "desc": "Mengunduh dan memasukkan library eksternal ke proyek dengan 'go get' dan mengimpor modul di kode.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Menambahkan Dependency dengan 'go get'</h3>\n                <p>Untuk menggunakan modul publik milik orang lain di proyek kita, jalankan perintah <code>go get nama-modul</code>.</p>\n\n                <div class=\"code-box\">\n                    <div class=\"code-box-header\"><span>Terminal Command</span></div>\n                    <pre># Mengunduh modul eksternal\ngo get github.com/programmerzamannow/go-say-hello</pre>\n                </div>\n\n                <p>Perintah tersebut akan otomatis mengunduh modul ke cache lokal, mencatat baris <code>require</code> di <code>go.mod</code>, dan menambahkan checksum ke <code>go.sum</code>.</p>\n            </div>\n        ",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t// Contoh mengimpor modul eksternal yang di-get\n\t// \"github.com/programmerzamannow/go-say-hello\"\n)\n\nfunc main() {\n\tfmt.Println(\"Perintah 'go get <path>' digunakan untuk mengunduh modul eksternal.\")\n\tfmt.Println(\"Modul terunduh otomatis dicatat di file go.mod dan go.sum.\")\n}",
        "quiz": {
                "question": "Perintah CLI Go apakah yang digunakan untuk mengunduh dan menambahkan dependency eksternal ke proyek?",
                "options": [
                        "go install",
                        "go get",
                        "go fetch",
                        "go pull"
                ],
                "correctIndex": 1,
                "explanation": "'go get <module-path>' digunakan untuk mengunduh dependency baru ke proyek Go Modules."
        }
},
{
        "id": 79,
        "category": "Domain 3: Go Modules & Dependency",
        "timestamp": "00:18:36",
        "title": "Upgrade Minor & Patch Release",
        "desc": "Memperbarui modul dengan menambahkan fitur baru (minor release v1.1.0) atau perbaikan bug (patch release v1.0.1).",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Upgrade Versi Minor & Patch</h3>\n                <p>Jika kita memperbarui modul tanpa merusak fungsi yang sudah ada (misal menambahkan fungsi <code>SayHelloTo()</code> baru), kita dapat menaikkan versi minor:</p>\n\n                <div class=\"code-box\">\n                    <div class=\"code-box-header\"><span>Terminal (Pada Modul Author)</span></div>\n                    <pre># Rilis versi Minor baru v1.1.0\ngit add .\ngit commit -m \"Add new function SayHelloTo\"\ngit tag v1.1.0\ngit push origin v1.1.0</pre>\n                </div>\n\n                <p>Di sisi aplikasi pengguna (*client*), untuk memperbarui ke versi minor terbaru, cukup jalankan:</p>\n                <div class=\"code-box\">\n                    <div class=\"code-box-header\"><span>Terminal (Pada Modul Client)</span></div>\n                    <pre>go get github.com/programmerzamannow/go-say-hello@v1.1.0</pre>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Update versi Minor (v1.1.0) menambah fitur tanpa merusak fungsi lama.\")\n\tfmt.Println(\"Gunakan 'go get <module>@v1.1.0' untuk menentukan spesifik versi yang ingin digunakan.\")\n}",
        "quiz": {
                "question": "Bagaimana cara mengambil spesifik versi tertentu (misal v1.1.0) dari sebuah modul melalui perintah go get?",
                "options": [
                        "go get module#v1.1.0",
                        "go get module@v1.1.0",
                        "go get module:v1.1.0",
                        "go get module -v v1.1.0"
                ],
                "correctIndex": 1,
                "explanation": "Sintaks '<module>@<version>' digunakan untuk mengunduh rilis spesifik tertentu."
        }
},
{
        "id": 80,
        "category": "Domain 3: Go Modules & Dependency",
        "timestamp": "00:21:11",
        "title": "Meng-upgrade & Membersihkan Dependency",
        "desc": "Perintah 'go get -u', 'go mod tidy' (membersihkan dependency tidak terpakai), dan 'go mod verify'.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Pemeliharaan Dependency Go-Modules</h3>\n                <p>Go menyediakan perintah pemeliharaan otomatis yang sangat berguna:</p>\n\n                <table class=\"tech-table\">\n                    <thead>\n                        <tr><th>Perintah CLI</th><th>Fungsi Utama</th></tr>\n                    </thead>\n                    <tbody>\n                        <tr><td><code>go get -u</code></td><td>Meng-upgrade seluruh dependency di <code>go.mod</code> ke versi minor/patch terbaru secara otomatis.</td></tr>\n                        <tr><td><code>go mod tidy</code></td><td>Sangat Penting! Membersihkan dependency yang tidak lagi di-import dan mengunduh dependency yang belum tercatat.</td></tr>\n                        <tr><td><code>go mod verify</code></td><td>Memeriksa apakah isi modul lokal masih cocok dengan hash checksum keamanan di <code>go.sum</code>.</td></tr>\n                    </tbody>\n                </table>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Perintah Pemeliharaan Module:\")\n\tfmt.Println(\"1. 'go mod tidy'  -> Membersihkan dependency nganggur & merapikan go.mod\")\n\tfmt.Println(\"2. 'go get -u'    -> Upgrade semua library ke minor/patch rilis terbaru\")\n\tfmt.Println(\"3. 'go mod verify'-> Memeriksa integritas hash go.sum\")\n}",
        "quiz": {
                "question": "Perintah manakah yang paling sering digunakan untuk membersihkan dependency yang tidak lagi dipakai serta menambahkan dependency baru yang belum terdaftar di go.mod?",
                "options": [
                        "go mod clean",
                        "go mod tidy",
                        "go mod reset",
                        "go mod purge"
                ],
                "correctIndex": 1,
                "explanation": "'go mod tidy' merapikan file go.mod dan go.sum secara otomatis."
        }
},
{
        "id": 81,
        "category": "Domain 4: Golang Generics",
        "timestamp": "00:01:20",
        "title": "Pengenalan Generics & Type Parameters",
        "desc": "Memahami konsep Generics di Go 1.18+ untuk membuat kode yang re-usable tanpa mengorbankan Type Safety.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Apa itu Generics?</h3>\n            <p><strong>Generics</strong> (diperkenalkan pada <strong>Go 1.18</strong>) memungkinkan kita menulis fungsi dan tipe data yang bekerja dengan berbagai macam tipe data tanpa harus menduplikasi kode atau menggunakan <code>interface{}</code> (any) yang mengorbankan <i>type safety</i> saat kompilasi.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Sebelum vs Sesudah Generics:</div>\n                <ul>\n                    <li><strong>Sebelum Go 1.18:</strong> Harus buat `SumInt(a, b int)` dan `SumFloat(a, b float64)` terpisah, atau pakai `interface{}` dengan tipe assertion yang rentan runtime panic.</li>\n                    <li><strong>Sesudah Go 1.18:</strong> Buat 1 fungsi generik `Sum[T Number](a, b T)` yang aman dan efisien!</li>\n                </ul>\n            </div>\n\n            <h3>Sintaks Dasar Type Parameter:</h3>\n            <pre>func FunctionName[T Constraint](param T) T { ... }</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\n// Fungsi Generik Sederhana dengan constraint 'any'\nfunc CetakData[T any](val T) {\n\tfmt.Printf(\"Value: %v | Tipe: %T\\n\", val, val)\n}\n\nfunc main() {\n\tfmt.Println(\"=== DEMO GOLANG GENERICS ===\")\n\tCetakData[string](\"Halo Golang Generics!\")\n\tCetakData[int](2026)\n\tCetakData[bool](true)\n}",
        "quiz": {
                "question": "Sejak versi berapakah fitur Generics (Type Parameters) resmi tersedia di dalam bahasa pemrograman Go?",
                "options": [
                        "Go 1.16",
                        "Go 1.18",
                        "Go 1.20",
                        "Go 1.22"
                ],
                "correctIndex": 1,
                "explanation": "Fitur Generics diperkenalkan secara resmi pada rilis Go 1.18 setelah dipelopori melalui proposal Type Parameters."
        }
},
{
        "id": 82,
        "category": "Domain 4: Golang Generics",
        "timestamp": "00:07:30",
        "title": "Generic Functions & Type Inference",
        "desc": "Membuat fungsi generik dan memahami bagaimana kompilator Go secara otomatis menginferensi tipe data parameter.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Type Inference pada Generic Functions</h3>\n            <p>Saat memanggil fungsi generik, kita tidak selalu wajib menuliskan parameter tipe secara eksplisit seperti <code>Sum[int](10, 20)</code>. Kompilator Go cukup cerdas untuk secara otomatis mendeteksi tipe data dari argumen yang diberikan (<strong>Type Inference</strong>).</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Contoh Perbandingan Pemanggilan:</div>\n                <pre>// Pemanggilan Eksplisit:\nresult := Add[int](5, 10)\n\n// Pemanggilan dengan Type Inference (Dianjurkan):\nresult := Add(5, 10) // Kompilator otomatis tahu T adalah int</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\n// Fungsi generik mengembalikan elemen pertama slice\nfunc GetFirst[T any](slice []T) T {\n\tif len(slice) == 0 {\n\t\tvar zero T\n\t\treturn zero\n\t}\n\treturn slice[0]\n}\n\nfunc main() {\n\tnumbers := []int{10, 20, 30}\n\tnames := []string{\"Eko\", \"Budi\", \"Joko\"}\n\n\t// Menggunakan Type Inference otomatis\n\tfmt.Println(\"First number:\", GetFirst(numbers)) // T di-infer sebagai int\n\tfmt.Println(\"First name:\", GetFirst(names))     // T di-infer sebagai string\n}",
        "quiz": {
                "question": "Apakah keuntungan utama dari fitur Type Inference saat memanggil fungsi generik di Go?",
                "options": [
                        "Kita tidak perlu menuliskan nama tipe data dalam tanda kurung siku `[T]` secara manual jika kompilator dapat menebaknya",
                        "Meningkatkan kecepatan eksekusi aplikasi di server",
                        "Mengubah tipe data int menjadi float64 secara otomatis",
                        "Menghilangkan proses kompilasi kode"
                ],
                "correctIndex": 0,
                "explanation": "Type Inference memungkinkan pemanggilan fungsi generik seperti fungsi biasa tanpa harus menulis `[T]` secara eksplisit."
        }
},
{
        "id": 83,
        "category": "Domain 4: Golang Generics",
        "timestamp": "00:13:45",
        "title": "Generic Structs & Data Structures",
        "desc": "Membangun struktur data generik yang fleksibel seperti Generic Response, Stack, dan Queue.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Generic Structs</h3>\n            <p>Selain fungsi, struct juga dapat dideklarasikan menggunakan parameter tipe. Fitur ini sangat populer dalam pembuatan standar response API atau struktur data umum (Stack, Queue, Linked List).</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Contoh Struct Generic Response:</div>\n                <pre>type Response[T any] struct {\n    Code    int    `json:\"code\"`\n    Message string `json:\"message\"`\n    Data    T      `json:\"data\"`\n}</pre>\n            </div>\n\n            <p>Dengan struct generik di atas, <code>Data</code> dapat diisi dengan struct `User`, slice `[]Product`, atau tipe data apa pun tanpa perlu <code>interface{}</code>.</p>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\n// Struct Generic Data Response\ntype Response[T any] struct {\n\tStatus int\n\tData   T\n}\n\ntype User struct {\n\tName string\n}\n\nfunc main() {\n\t// Response dengan data bertipe User\n\tuserRes := Response[User]{\n\t\tStatus: 200,\n\t\tData:   User{Name: \"Eko Khannedy\"},\n\t}\n\n\t// Response dengan data bertipe slice string\n\tlistRes := Response[[]string]{\n\t\tStatus: 200,\n\t\tData:   []string{\"Go\", \"Java\", \"Python\"},\n\t}\n\n\tfmt.Println(\"User Response:\", userRes.Data.Name)\n\tfmt.Println(\"List Response:\", listRes.Data)\n}",
        "quiz": {
                "question": "Bagaimana sintaks pembuatan instansiasi objek dari `type Container[T any] struct` untuk tipe data `string`?",
                "options": [
                        "c := Container[string]{}",
                        "c := Container(string){}",
                        "c := new Container<string>()",
                        "c := Container.string{}"
                ],
                "correctIndex": 0,
                "explanation": "Instansiasi struct generik di Go menggunakan tanda kurung siku `[tipe]` setelah nama struct, yaitu `Container[string]{}`."
        }
},
{
        "id": 84,
        "category": "Domain 4: Golang Generics",
        "timestamp": "00:20:10",
        "title": "Type Sets & Custom Constraints",
        "desc": "Membatasi opsi tipe data generik menggunakan Type Sets interface dengan operator Union (|).",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Constraint Tipe Data (Type Sets)</h3>\n            <p>Kadang kita ingin membatasi bahwa fungsi generik hanya boleh menerima angka (misalnya `int`, `float64`), bukan `string` atau `bool`. Di Go, ini dilakukan dengan membuat <strong>Interface Constraint</strong> menggunakan operator union (<code>|</code>).</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Mendefinisikan Custom Constraint:</div>\n                <pre>type Number interface {\n    int | int32 | int64 | float32 | float64\n}\n\nfunc Sum[T Number](a, b T) T {\n    return a + b\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\n// Custom Type Set Constraint\ntype Number interface {\n\tint | float64\n}\n\nfunc Penjumlahan[T Number](a, b T) T {\n\treturn a + b\n}\n\nfunc main() {\n\tfmt.Println(\"Penjumlahan Int:\", Penjumlahan(10, 20))\n\tfmt.Println(\"Penjumlahan Float:\", Penjumlahan(5.5, 4.3))\n\t// Penjumlahan(\"a\", \"b\") // ERROR saat kompilasi! string bukan bagian dari Number\n}",
        "quiz": {
                "question": "Simbol atau operator apakah yang digunakan untuk membuat tipe Union pada Type Set Interface di Go Generics?",
                "options": [
                        "| (Pipa)",
                        "& (Ampersand)",
                        "+ (Plus)",
                        "~ (Tilde)"
                ],
                "correctIndex": 0,
                "explanation": "Operator `|` digunakan untuk menggabungkan beberapa tipe data menjadi pilihan union pada Interface Constraint."
        }
},
{
        "id": 85,
        "category": "Domain 4: Golang Generics",
        "timestamp": "00:26:00",
        "title": "Comparable Constraint & Map Keys",
        "desc": "Memahami constraint bawaan `comparable` untuk tipe data yang bisa dibandingkan dengan `==` dan `!=`.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Built-in Constraint: comparable</h3>\n            <p>Go menyediakan constraint bawaan bernama <code>comparable</code>. Constraint ini mencakup semua tipe data yang mendukung operator perbandingan sama dengan (<code>==</code>) dan tidak sama dengan (<code>!=</code>), seperti boolean, angka, string, pointer, channel, dan struct yang komparabel.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Kegunaan Utama comparable:</div>\n                <ul>\n                    <li>Digunakan saat mencari posisi elemen di slice/array.</li>\n                    <li>Digunakan sebagai constraint tipe data <strong>Key</strong> pada Map (karena Key map di Go wajib bisa dibandingkan).</li>\n                </ul>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\n// Fungsi pencarian index elemen dalam slice\nfunc FindIndex[T comparable](slice []T, target T) int {\n\tfor i, item := range slice {\n\t\tif item == target { // Membutuhkan constraint 'comparable'\n\t\t\treturn i\n\t\t}\n\t}\n\treturn -1\n}\n\nfunc main() {\n\tnames := []string{\"Eko\", \"Budi\", \"Joko\"}\n\tfmt.Println(\"Index 'Budi':\", FindIndex(names, \"Budi\"))\n\tfmt.Println(\"Index 'Andi':\", FindIndex(names, \"Andi\"))\n}",
        "quiz": {
                "question": "Constraint bawaan Go manakah yang WAJIB digunakan untuk parameter tipe key pada sebuah Map generik `map[K]V`?",
                "options": [
                        "comparable",
                        "any",
                        "ordered",
                        "equality"
                ],
                "correctIndex": 0,
                "explanation": "Key pada map Go mewajibkan tipe data yang mendukung perbandingan `==`, sehingga harus dibatasi oleh constraint `comparable`."
        }
},
{
        "id": 86,
        "category": "Domain 4: Golang Generics",
        "timestamp": "00:32:15",
        "title": "Type Approximation Operator (~)",
        "desc": "Menggunakan tilde (~) agar constraint generik mendukung custom type alias (underlying type).",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Operator Approximation (~)</h3>\n            <p>Jika kita membuat custom alias type seperti <code>type Age int</code>, variabel bertipe <code>Age</code> secara default <strong>tidak</strong> memenuhi constraint <code>int</code> biasa.</p>\n            \n            <p>Untuk mengizinkan semua tipe data yang memiliki <i>underlying type</i> sama, kita menggunakan operator tilde (<code>~</code>) di depan nama tipe pada interface constraint.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Penggunaan Tilde (~):</div>\n                <pre>type IntConstraint interface {\n    ~int // Mendukung int biasa DAN custom type seperti 'type Age int'\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype Age int // Custom type dengan underlying type int\n\ntype IntegerConstraint interface {\n\t~int // Menggunakan approximation operator ~\n}\n\nfunc PrintDouble[T IntegerConstraint](val T) {\n\tfmt.Println(\"Hasil Double:\", val*2)\n}\n\nfunc main() {\n\tvar normalInt int = 25\n\tvar myAge Age = 30\n\n\tPrintDouble(normalInt)\n\tPrintDouble(myAge) // Berhasil karena ada simbol ~int\n}",
        "quiz": {
                "question": "Apakah fungsi dari operator tilde `~` pada deklarasi Interface Constraint Generics?",
                "options": [
                        "Menandakan bahwa constraint mencakup tipe asal (underlying type) serta tipe alias turunan-nya",
                        "Membuat variabel bertipe string menjadi angka",
                        "Menandakan pointer memori",
                        "Mengabaikan tipe data saat runtime"
                ],
                "correctIndex": 0,
                "explanation": "Simbol `~T` berarti constraint menerima tipe T serta tipe kustom apa pun yang didefinisikan dengan dasar tipe T (`type Custom T`)."
        }
},
{
        "id": 87,
        "category": "Domain 4: Golang Generics",
        "timestamp": "00:38:40",
        "title": "Generic Interfaces & Method Constraints",
        "desc": "Merancang interface generik dan aturan penerapan method pada tipe data generik di Go.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Generic Interfaces</h3>\n            <p>Interface di Go dapat memiliki type parameter. Hal ini berguna untuk membuat abstraksi seperti <code>Getter[T]</code>, <code>Repository[T]</code>, atau <code>Processor[T]</code>.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Contoh Generic Repository Interface:</div>\n                <pre>type Repository[T any] interface {\n    Save(entity T) error\n    FindById(id string) (T, error)\n}</pre>\n            </div>\n\n            <div class=\"callout callout-warning\">\n                <div class=\"callout-title\">⚠️ Aturan Method pada Struct Generic:</div>\n                <p>Method dari struct generik tidak boleh mendeklarasikan type parameter baru sendiri; method harus menggunakan type parameter yang dideklarasikan pada struct pemiliknya.</p>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype Getter[T any] interface {\n\tGet() T\n}\n\ntype ValueHolder[T any] struct {\n\tvalue T\n}\n\nfunc (v ValueHolder[T]) Get() T {\n\treturn v.value\n}\n\nfunc main() {\n\tvar holder Getter[string] = ValueHolder[string]{value: \"Data Rahasia\"}\n\tfmt.Println(\"Isi Holder:\", holder.Get())\n}",
        "quiz": {
                "question": "Manakah pernyataan yang BENAR mengenai method pada struct generik di Go?",
                "options": [
                        "Method tidak boleh menambah type parameter baru tersendiri di luar yang dimiliki struct-nya",
                        "Method bebas menambahkan type parameter baru kapan saja",
                        "Struct generik tidak boleh memiliki method",
                        "Method generik wajib mengembalikan nilai boolean"
                ],
                "correctIndex": 0,
                "explanation": "Di Go, method dari struct generik harus menggunakan type parameter dari receiver struct-nya dan tidak boleh mendeklarasikan type parameter baru pada method."
        }
},
{
        "id": 88,
        "category": "Domain 4: Golang Generics",
        "timestamp": "00:44:50",
        "title": "Package constraints & cmp (Standard Utilities)",
        "desc": "Memanfaatkan package bantu standar `cmp` dan `constraints` untuk operasi pembandingan dan pengurutan.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Package Utility Generics</h3>\n            <p>Untuk mempermudah penggunaan Generics, Go menyediakan package standar seperti <code>cmp</code> (mulai Go 1.21) serta eksperimental paket <code>golang.org/x/exp/constraints</code>.</p>\n\n            <h3>Constraint `cmp.Ordered`:</h3>\n            <p><code>cmp.Ordered</code> adalah constraint bawaan yang mencakup semua tipe data yang dapat dibandingkan dengan operator order (<code><</code>, <code><=</code>, <code>></code>, <code>>=</code>), yaitu angka dan string.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Fungsi Menghitung Nilai Maksimum (Max):</div>\n                <pre>import \"cmp\"\n\nfunc GetMax[T cmp.Ordered](a, b T) T {\n    if a > b {\n        return a\n    }\n    return b\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\n// Simulasi cmp.Ordered (tipe yang bisa dibandingkan dengan < dan >)\ntype Ordered interface {\n\t~int | ~float64 | ~string\n}\n\nfunc Max[T Ordered](a, b T) T {\n\tif a > b {\n\t\treturn a\n\t}\n\treturn b\n}\n\nfunc main() {\n\tfmt.Println(\"Max Int (10 vs 25):\", Max(10, 25))\n\tfmt.Println(\"Max String ('Apple' vs 'Banana'):\", Max(\"Apple\", \"Banana\"))\n}",
        "quiz": {
                "question": "Constraint `cmp.Ordered` pada Go mencakup tipe data apa saja?",
                "options": [
                        "Tipe data yang dapat dibandingkan dengan operator kurang dari (<) dan lebih dari (>), seperti angka dan string",
                        "Hanya tipe data boolean",
                        "Hanya struct dan map",
                        "Semua tipe data tanpa terkecuali"
                ],
                "correctIndex": 0,
                "explanation": "`cmp.Ordered` diperuntukkan bagi tipe data yang mendukung urutan perbandingan (`<`, `<=`, `>`, `>=`), mencakup tipe integer, float, dan string."
        }
},
{
        "id": 89,
        "category": "Domain 5: Unit Testing & Benchmark",
        "timestamp": "00:01:57",
        "title": "Pengenalan Software Testing & Package testing",
        "desc": "Konsep pengujian otomatis software dan pengenalan package testing bawaan Go.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Mengapa Software Testing Penting?</h3>\n                <p><strong>Software Testing</strong> adalah proses otomatisasi untuk memverifikasi bahwa kode program bekerja sesuai ekspektasi.</p>\n                <p>Go menyediakan package standar <code>testing</code> dan CLI <code>go test</code> tanpa perlu framework eksternal.</p>\n                <h3>Aturan Wajib Unit Test di Go:</h3>\n                <ul>\n                    <li>Nama file test <strong>HARUS</strong> diakhiri <code>_test.go</code></li>\n                    <li>Nama fungsi test <strong>HARUS</strong> diawali <code>Test</code> (contoh: <code>TestSayHello</code>)</li>\n                    <li>Parameter fungsi <strong>HARUS</strong> <code>(t *testing.T)</code></li>\n                </ul>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc Add(a, b int) int {\n\treturn a + b\n}\n\nfunc main() {\n\tresult := Add(3, 5)\n\tif result == 8 {\n\t\tfmt.Println(\"PASS: Add(3,5) =\", result)\n\t} else {\n\t\tfmt.Println(\"FAIL: expected 8, got\", result)\n\t}\n}",
        "quiz": {
                "question": "Aturan penamaan file unit test di Go yang benar adalah...",
                "options": [
                        "Nama file wajib diakhiri '_test.go'",
                        "Nama file bebas asal .go",
                        "Nama file diawali 'test_'",
                        "Nama file berekstensi .spec"
                ],
                "correctIndex": 0,
                "explanation": "Go CLI hanya mengeksekusi file berakhiran '_test.go' saat perintah 'go test' dijalankan."
        }
},
{
        "id": 90,
        "category": "Domain 5: Unit Testing & Benchmark",
        "timestamp": "00:13:27",
        "title": "Membuat Unit Test Pertama (TestXxx)",
        "desc": "Struktur fungsi TestXxx(t *testing.T) dan eksekusi via go test -v.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Struktur Fungsi Unit Test</h3>\n                <p>Fungsi unit test ditulis di berkas <code>_test.go</code> dengan signature <code>func TestXxx(t *testing.T)</code>.</p>\n                <h3>Perintah CLI:</h3>\n                <ul>\n                    <li><code>go test</code> — Jalankan semua test di package</li>\n                    <li><code>go test -v</code> — Mode verbose (detail nama test)</li>\n                    <li><code>go test -v ./...</code> — Tes rekursif seluruh sub-package</li>\n                </ul>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc SayHello(name string) string {\n\treturn \"Hello \" + name\n}\n\nfunc main() {\n\toutput := SayHello(\"Eko\")\n\tif output == \"Hello Eko\" {\n\t\tfmt.Println(\"PASS: SayHello('Eko') =\", output)\n\t} else {\n\t\tfmt.Println(\"FAIL: unexpected output:\", output)\n\t}\n}",
        "quiz": {
                "question": "Perintah CLI untuk menjalankan semua unit test secara rekursif di seluruh sub-package?",
                "options": [
                        "go test ./...",
                        "go run test",
                        "go execute --all",
                        "go test -all"
                ],
                "correctIndex": 0,
                "explanation": "'go test ./...' menguji semua package dari folder root hingga sub-folder."
        }
},
{
        "id": 91,
        "category": "Domain 5: Unit Testing & Benchmark",
        "timestamp": "00:25:37",
        "title": "Menggagalkan Test (Fail, FailNow, Error, Fatal)",
        "desc": "Perbedaan t.Fail(), t.FailNow(), t.Error(), dan t.Fatal().",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Method Penggagalan Unit Test</h3>\n                <table class=\"tech-table\">\n                    <thead><tr><th>Method</th><th>Fungsi</th><th>Lanjut Eksekusi?</th></tr></thead>\n                    <tbody>\n                        <tr><td><code>t.Fail()</code></td><td>Tandai gagal</td><td><strong>YA</strong></td></tr>\n                        <tr><td><code>t.FailNow()</code></td><td>Tandai gagal + hentikan</td><td><strong>TIDAK</strong></td></tr>\n                        <tr><td><code>t.Error()</code></td><td>Log + Fail</td><td><strong>YA</strong></td></tr>\n                        <tr><td><code>t.Fatal()</code></td><td>Log + FailNow</td><td><strong>TIDAK</strong></td></tr>\n                    </tbody>\n                </table>\n                <div class=\"callout callout-tip\">\n                    <div class=\"callout-title\">💡 Best Practice:</div>\n                    <p>Gunakan <code>t.Fatal()</code> jika tes berikutnya bergantung pada hasil baris ini.</p>\n                </div>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"=== Perbedaan Method Penggagalan ===\")\n\tfmt.Println(\"t.Fail()    -> tandai gagal, LANJUT eksekusi\")\n\tfmt.Println(\"t.FailNow() -> tandai gagal, BERHENTI seketika\")\n\tfmt.Println(\"t.Error()   -> log pesan + t.Fail()\")\n\tfmt.Println(\"t.Fatal()   -> log pesan + t.FailNow()\")\n}",
        "quiz": {
                "question": "Method yang mencatat pesan kesalahan dan LANGSUNG menghentikan eksekusi fungsi test?",
                "options": [
                        "t.Error()",
                        "t.Fatal()",
                        "t.Fail()",
                        "t.Log()"
                ],
                "correctIndex": 1,
                "explanation": "t.Fatal() memanggil t.Log() lalu t.FailNow() yang langsung menghentikan fungsi test."
        }
},
{
        "id": 92,
        "category": "Domain 5: Unit Testing & Benchmark",
        "timestamp": "00:33:31",
        "title": "Assertion dengan Testify (assert & require)",
        "desc": "Library testify/assert dan require untuk pengujian yang lebih bersih.",
        "theoryHtml": "\n            <div class=\"theory-section\">\n                <h3>Library Testify</h3>\n                <table class=\"tech-table\">\n                    <thead><tr><th>Package</th><th>Jika Gagal</th><th>Padanan</th></tr></thead>\n                    <tbody>\n                        <tr><td><code>assert.Equal(t, expected, actual)</code></td><td>Lanjut eksekusi</td><td>t.Error()</td></tr>\n                        <tr><td><code>require.Equal(t, expected, actual)</code></td><td>Langsung berhenti</td><td>t.Fatal()</td></tr>\n                    </tbody>\n                </table>\n            </div>\n        ",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc Discount(price float64) float64 {\n\treturn price * 0.9\n}\n\nfunc main() {\n\tresult := Discount(100.0)\n\tfmt.Println(\"Diskon 10% dari 100 =\", result)\n\tfmt.Println(\"Testify: assert.Equal(t, 90.0, Discount(100.0))\")\n}",
        "quiz": {
                "question": "Perbedaan utama assert.Equal() vs require.Equal() pada testify?",
                "options": [
                        "assert lanjut eksekusi jika gagal, require langsung berhenti",
                        "Tidak ada perbedaan",
                        "assert menghentikan test",
                        "require hanya untuk string"
                ],
                "correctIndex": 0,
                "explanation": "assert pakai t.Error() (lanjut), require pakai t.Fatal() (berhenti)."
        }
},
{
        "id": 93,
        "category": "Domain 5: Unit Testing & Benchmark",
        "timestamp": "00:43:24",
        "title": "Skip Test & TestMain (Setup/Teardown)",
        "desc": "Melewati test dengan t.Skip() dan mengelola setup/teardown global dengan TestMain(m *testing.M).",
        "theoryHtml": "<div class=\"theory-section\"><h3>t.Skip() & TestMain</h3><p><code>t.Skip()</code> melompati test tanpa menggagalkannya. <code>TestMain(m *testing.M)</code> menangani setup sebelum dan teardown sesudah seluruh test berjalan.</p></div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"runtime\"\n)\n\nfunc main() {\n\tfmt.Println(\"OS:\", runtime.GOOS)\n\tfmt.Println(\"t.Skip() melompati test jika kondisi tidak terpenuhi\")\n\tfmt.Println(\"TestMain(m *testing.M) untuk setup/teardown global\")\n}",
        "quiz": {
                "question": "Fungsi untuk melompati unit test tanpa menandainya gagal?",
                "options": [
                        "t.Skip()",
                        "t.Ignore()",
                        "t.Pass()",
                        "t.Bypass()"
                ],
                "correctIndex": 0,
                "explanation": "t.Skip() membatalkan sisa tes dan menandainya 'SKIP'."
        }
},
{
        "id": 94,
        "category": "Domain 5: Unit Testing & Benchmark",
        "timestamp": "00:51:27",
        "title": "Sub Tests (t.Run)",
        "desc": "Membuat pengujian bertingkat / sub-test menggunakan t.Run().",
        "theoryHtml": "<div class=\"theory-section\"><h3>Sub Test</h3><p><code>t.Run(\"NamaSubTest\", func(t *testing.T){...})</code> memecah satu fungsi test menjadi beberapa skenario. Jalankan spesifik sub-test: <code>go test -v -run=TestSayHello/Eko</code>.</p></div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Sub Test Structure:\")\n\tfmt.Println(\"t.Run(\\\"Eko\\\", func(t *testing.T) { ... })\")\n\tfmt.Println(\"t.Run(\\\"Budi\\\", func(t *testing.T) { ... })\")\n\tfmt.Println(\"CLI: go test -v -run=TestSayHello/Eko\")\n}",
        "quiz": {
                "question": "Perintah CLI untuk menjalankan sub-test 'Eko' di dalam TestSayHello?",
                "options": [
                        "go test -v -run=TestSayHello/Eko",
                        "go test --sub=Eko",
                        "go test TestSayHello.Eko",
                        "go test -only=Eko"
                ],
                "correctIndex": 0,
                "explanation": "Karakter slash '/' memfilter sub-test tertentu."
        }
},
{
        "id": 95,
        "category": "Domain 5: Unit Testing & Benchmark",
        "timestamp": "00:56:44",
        "title": "Table-Driven Testing",
        "desc": "Teknik paling populer di Go untuk menguji puluhan kombinasi input-output menggunakan slice of struct.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Table-Driven Testing</h3><p>Susun skenario pengujian di dalam slice struct, lalu iterasi dengan <code>for</code> dan <code>t.Run()</code>. Menambah skenario baru cukup tambah elemen struct.</p></div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\ntype TestData struct {\n\tname     string\n\tinput    int\n\texpected int\n}\n\nfunc MultiplyByTwo(n int) int { return n * 2 }\n\nfunc main() {\n\ttests := []TestData{\n\t\t{\"Positif\", 5, 10},\n\t\t{\"Nol\", 0, 0},\n\t\t{\"Negatif\", -3, -6},\n\t}\n\tfor _, tt := range tests {\n\t\tresult := MultiplyByTwo(tt.input)\n\t\tstatus := \"PASS\"\n\t\tif result != tt.expected { status = \"FAIL\" }\n\t\tfmt.Printf(\"[%s] %s: %d -> %d (expected %d)\\n\", status, tt.name, tt.input, result, tt.expected)\n\t}\n}",
        "quiz": {
                "question": "Keunggulan utama Table-Driven Testing?",
                "options": [
                        "Menambah skenario baru cukup tambah elemen struct tanpa duplikasi kode",
                        "Membuat aplikasi 10x lebih cepat",
                        "Menghapus kebutuhan kompilasi",
                        "Mencegah error database"
                ],
                "correctIndex": 0,
                "explanation": "Table test mengurangi duplikasi kode — puluhan skenario diuji via iterasi data struct."
        }
},
{
        "id": 96,
        "category": "Domain 5: Unit Testing & Benchmark",
        "timestamp": "01:04:38",
        "title": "Mocking Dependencies (testify/mock)",
        "desc": "Membuat objek tiruan (Mock) untuk mengisolasi unit test dari dependency eksternal.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Mocking</h3><p>Saat menguji Service Layer, jangan akses database sungguhan — buat <strong>Mock Object</strong> yang meniru Repository. Library <code>testify/mock</code> menyediakan <code>mock.Mock</code> dan method <code>On().Return()</code>.</p></div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"=== MOCKING WORKFLOW ===\")\n\tfmt.Println(\"1. Buat MockRepository embed mock.Mock\")\n\tfmt.Println(\"2. mockRepo.On(\\\"FindById\\\", \\\"1\\\").Return(user)\")\n\tfmt.Println(\"3. mockRepo.AssertExpectations(t)\")\n}",
        "quiz": {
                "question": "Tujuan utama Mocking pada unit testing?",
                "options": [
                        "Mengisolasi pengujian dari sistem luar (database/API)",
                        "Mempercepat internet",
                        "Mengenkripsi kode",
                        "Membuat database baru"
                ],
                "correctIndex": 0,
                "explanation": "Mock menggantikan komponen fisik luar dengan objek tiruan agar unit test cepat dan terisolasi."
        }
},
{
        "id": 97,
        "category": "Domain 5: Unit Testing & Benchmark",
        "timestamp": "01:26:25",
        "title": "Benchmarking (BenchmarkXxx & b.N)",
        "desc": "Mengukur performa kecepatan dan konsumsi memori kode Go.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Benchmark di Go</h3><p>Fungsi benchmark diawali <code>Benchmark</code>, parameter <code>(b *testing.B)</code>, loop <code>for i := 0; i &lt; b.N; i++</code>. Jalankan: <code>go test -v -bench=. -benchmem</code>.</p></div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Benchmark Syntax:\")\n\tfmt.Println(\"func BenchmarkHello(b *testing.B) {\")\n\tfmt.Println(\"    for i := 0; i < b.N; i++ {\")\n\tfmt.Println(\"        HelloWorld(\\\"Eko\\\")\")\n\tfmt.Println(\"    }\")\n\tfmt.Println(\"}\")\n\tfmt.Println(\"CLI: go test -v -bench=. -benchmem\")\n}",
        "quiz": {
                "question": "Siapa yang menentukan nilai b.N pada benchmark?",
                "options": [
                        "Go Test Runner otomatis",
                        "Programmer hardcode",
                        "Dihitung dari jumlah baris",
                        "Sesuai RAM PC"
                ],
                "correctIndex": 0,
                "explanation": "Go Runner menaikkan b.N secara dinamis sampai waktu eksekusi stabil."
        }
},
{
        "id": 98,
        "category": "Domain 5: Unit Testing & Benchmark",
        "timestamp": "01:38:19",
        "title": "Sub Benchmark & Table Benchmark",
        "desc": "Membandingkan performa beberapa algoritma dengan b.Run() dan parameterized benchmarks.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Sub & Table Benchmark</h3><p><code>b.Run()</code> membandingkan algoritma secara berdampingan. Table benchmark menguji performa pada berbagai skala input (Small/Medium/Large).</p></div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Sub Benchmark: b.Run(\\\"ConcatPlus\\\", func(b *testing.B){...})\")\n\tfmt.Println(\"Table Benchmark: menguji variasi skala data input\")\n\tfmt.Println(\"Flag: -benchmem menampilkan B/op dan allocs/op\")\n}",
        "quiz": {
                "question": "Flag untuk menampilkan alokasi memori (B/op) pada benchmark?",
                "options": [
                        "-benchmem",
                        "-memory",
                        "-ram",
                        "-alloc"
                ],
                "correctIndex": 0,
                "explanation": "Flag '-benchmem' menampilkan byte memori per operasi."
        }
},
{
        "id": 99,
        "category": "Domain 6: Goroutines & Concurrency",
        "timestamp": "00:02:00",
        "title": "Concurrency vs Parallelism & Go Scheduler",
        "desc": "Perbedaan Concurrency dan Parallelism, serta arsitektur M:N Scheduler Go.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Concurrency vs Parallelism</h3><ul><li><strong>Concurrency:</strong> Menangani banyak hal sekaligus (1 kasir melayani antrean)</li><li><strong>Parallelism:</strong> Eksekusi fisik bersamaan pada multi-core CPU (4 kasir bekerja)</li></ul><p>Goroutine sangat ringan: hanya butuh ~2 KB memori awal vs Thread OS ~1-2 MB!</p></div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"runtime\"\n)\n\nfunc main() {\n\tfmt.Println(\"CPU Cores:\", runtime.NumCPU())\n\tfmt.Println(\"Goroutines Aktif:\", runtime.NumGoroutine())\n}",
        "quiz": {
                "question": "Perkiraan alokasi memori awal 1 Goroutine?",
                "options": [
                        "~2 KB",
                        "~2 MB",
                        "~500 KB",
                        "~1 GB"
                ],
                "correctIndex": 0,
                "explanation": "Goroutine hanya butuh ~2 KB stack awal, sangat efisien."
        }
},
{
        "id": 100,
        "category": "Domain 6: Goroutines & Concurrency",
        "timestamp": "00:10:00",
        "title": "Membuat Goroutines (keyword go)",
        "desc": "Menjalankan fungsi secara asinkronus dengan keyword 'go'.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Keyword 'go'</h3><p>Tambahkan <code>go</code> sebelum pemanggilan fungsi. Jika main() selesai duluan, goroutine anak langsung dihentikan paksa!</p></div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc DisplayNumber(n int) {\n\tfmt.Println(\"Goroutine:\", n)\n}\n\nfunc main() {\n\tfor i := 1; i <= 5; i++ {\n\t\tgo DisplayNumber(i)\n\t}\n\tfmt.Println(\"Main selesai!\")\n\ttime.Sleep(100 * time.Millisecond)\n}",
        "quiz": {
                "question": "Keyword untuk meluncurkan fungsi sebagai Goroutine?",
                "options": [
                        "go",
                        "async",
                        "thread",
                        "routine"
                ],
                "correctIndex": 0,
                "explanation": "Cukup tambahkan keyword 'go' sebelum pemanggilan fungsi."
        }
},
{
        "id": 101,
        "category": "Domain 6: Goroutines & Concurrency",
        "timestamp": "00:20:00",
        "title": "Channels (Kirim & Terima Data antar Goroutine)",
        "desc": "Media komunikasi data antar Goroutine secara aman.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Channel</h3><ul><li>Buat: <code>ch := make(chan string)</code></li><li>Kirim: <code>ch &lt;- \"Data\"</code></li><li>Terima: <code>data := &lt;-ch</code></li><li>Tutup: <code>close(ch)</code></li></ul><p>Unbuffered Channel bersifat <strong>blocking</strong>.</p></div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tch := make(chan string)\n\tgo func() {\n\t\ttime.Sleep(100 * time.Millisecond)\n\t\tch <- \"Pesan dari Goroutine!\"\n\t}()\n\tdata := <-ch\n\tfmt.Println(\"Diterima:\", data)\n}",
        "quiz": {
                "question": "Sintaks mengirim nilai ke channel 'ch'?",
                "options": [
                        "ch <- pesan",
                        "pesan -> ch",
                        "ch.send(pesan)",
                        "push(ch, pesan)"
                ],
                "correctIndex": 0,
                "explanation": "Tanda panah 'ch <- pesan' memasukkan nilai ke channel."
        }
},
{
        "id": 102,
        "category": "Domain 6: Goroutines & Concurrency",
        "timestamp": "00:32:00",
        "title": "Channel Direction & Buffered Channels",
        "desc": "Membatasi arah channel (chan<- / <-chan) dan channel dengan kapasitas buffer.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Channel Direction & Buffer</h3><ul><li><code>chan&lt;- string</code> — In-Only (hanya kirim)</li><li><code>&lt;-chan string</code> — Out-Only (hanya terima)</li><li><code>make(chan string, 3)</code> — Buffered (kapasitas 3)</li></ul></div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc OnlyIn(ch chan<- string)  { ch <- \"Hello\" }\nfunc OnlyOut(ch <-chan string) { fmt.Println(<-ch) }\n\nfunc main() {\n\tch := make(chan string)\n\tgo OnlyIn(ch)\n\tOnlyOut(ch)\n}",
        "quiz": {
                "question": "'chan<- int' menandakan...",
                "options": [
                        "Hanya boleh kirim data (In-Only)",
                        "Hanya boleh terima data (Out-Only)",
                        "Channel sudah ditutup",
                        "Tipe data string"
                ],
                "correctIndex": 0,
                "explanation": "Tanda panah ke arah channel 'chan<-' berarti data masuk (In-Only)."
        }
},
{
        "id": 103,
        "category": "Domain 6: Goroutines & Concurrency",
        "timestamp": "00:50:00",
        "title": "Range & Close Channel, Select Multiplexing",
        "desc": "Iterasi stream data dengan for range, menutup channel, dan select untuk multi-channel.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Range, Close, & Select</h3><p><code>for data := range ch</code> mengambil data sampai channel ditutup. <code>select</code> mendengarkan beberapa channel yang pertama siap.</p></div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tch := make(chan string, 3)\n\tgo func() {\n\t\tfor i := 1; i <= 3; i++ {\n\t\t\tch <- fmt.Sprintf(\"Item-%d\", i)\n\t\t}\n\t\tclose(ch)\n\t}()\n\tfor data := range ch {\n\t\tfmt.Println(\"Diterima:\", data)\n\t}\n}",
        "quiz": {
                "question": "Struktur kontrol untuk memultipleks banyak channel?",
                "options": [
                        "select",
                        "switch",
                        "listen",
                        "poll"
                ],
                "correctIndex": 0,
                "explanation": "'select' menunggu beberapa operasi channel siap."
        }
},
{
        "id": 104,
        "category": "Domain 6: Goroutines & Concurrency",
        "timestamp": "01:15:00",
        "title": "Race Condition & Data Race Problem",
        "desc": "Bahaya konflik data saat banyak Goroutines memodifikasi variabel yang sama.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Race Condition</h3><p>Terjadi ketika beberapa Goroutines mengubah data yang sama tanpa penguncian. Deteksi: <code>go test -race</code> atau <code>go run -race main.go</code>.</p></div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tx := 0\n\tfor i := 0; i < 1000; i++ {\n\t\tgo func() {\n\t\t\tfor j := 0; j < 100; j++ { x++ }\n\t\t}()\n\t}\n\ttime.Sleep(500 * time.Millisecond)\n\tfmt.Println(\"x (harusnya 100000, tapi race condition):\", x)\n}",
        "quiz": {
                "question": "Flag untuk mendeteksi Race Condition?",
                "options": [
                        "-race",
                        "-check",
                        "-thread-safe",
                        "-debug"
                ],
                "correctIndex": 0,
                "explanation": "Flag '-race' mengaktifkan detector bawaan Go."
        }
},
{
        "id": 105,
        "category": "Domain 6: Goroutines & Concurrency",
        "timestamp": "01:25:00",
        "title": "sync.Mutex (Mutual Exclusion Lock)",
        "desc": "Mengamankan data dari Race Condition dengan penguncian Mutex Lock/Unlock.",
        "theoryHtml": "<div class=\"theory-section\"><h3>sync.Mutex</h3><p><code>mutex.Lock()</code> mengunci area kritikal. <code>mutex.Unlock()</code> melepas kunci. Hanya 1 Goroutine boleh masuk.</p></div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n\t\"time\"\n)\n\nfunc main() {\n\tvar mu sync.Mutex\n\tx := 0\n\tfor i := 0; i < 1000; i++ {\n\t\tgo func() {\n\t\t\tfor j := 0; j < 100; j++ {\n\t\t\t\tmu.Lock()\n\t\t\t\tx++\n\t\t\t\tmu.Unlock()\n\t\t\t}\n\t\t}()\n\t}\n\ttime.Sleep(500 * time.Millisecond)\n\tfmt.Println(\"x aman (tepat 100000):\", x)\n}",
        "quiz": {
                "question": "Method untuk melepas kuncian Mutex?",
                "options": [
                        "Unlock()",
                        "Lock()",
                        "Free()",
                        "Release()"
                ],
                "correctIndex": 0,
                "explanation": "Unlock() melepas kunci agar Goroutine berikutnya bisa masuk."
        }
},
{
        "id": 106,
        "category": "Domain 6: Goroutines & Concurrency",
        "timestamp": "01:35:00",
        "title": "sync.RWMutex (Reader-Writer Lock)",
        "desc": "Optimasi performa kuncian dengan memisahkan Read Lock dan Write Lock.",
        "theoryHtml": "<div class=\"theory-section\"><h3>sync.RWMutex</h3><ul><li><code>RLock()/RUnlock()</code> — banyak reader sekaligus</li><li><code>Lock()/Unlock()</code> — hanya 1 writer</li></ul></div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\ntype SafeAccount struct {\n\trw      sync.RWMutex\n\tbalance int\n}\n\nfunc (a *SafeAccount) GetBalance() int {\n\ta.rw.RLock()\n\tdefer a.rw.RUnlock()\n\treturn a.balance\n}\n\nfunc main() {\n\tacc := SafeAccount{balance: 500000}\n\tfmt.Println(\"Saldo:\", acc.GetBalance())\n}",
        "quiz": {
                "question": "Method RWMutex untuk membaca data tanpa mengubah?",
                "options": [
                        "RLock() & RUnlock()",
                        "Lock() & Unlock()",
                        "Read() & Close()",
                        "Open() & Exit()"
                ],
                "correctIndex": 0,
                "explanation": "RLock() mengizinkan banyak reader masuk sekaligus."
        }
},
{
        "id": 107,
        "category": "Domain 6: Goroutines & Concurrency",
        "timestamp": "01:45:00",
        "title": "sync.WaitGroup (Menunggu Goroutines Selesai)",
        "desc": "Cara standar menunggu penyelesaian Goroutines tanpa time.Sleep.",
        "theoryHtml": "<div class=\"theory-section\"><h3>sync.WaitGroup</h3><ul><li><code>wg.Add(n)</code> — tambah counter</li><li><code>wg.Done()</code> — kurangi counter</li><li><code>wg.Wait()</code> — tunggu counter = 0</li></ul></div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n\t\"time\"\n)\n\nfunc Task(id int, wg *sync.WaitGroup) {\n\tdefer wg.Done()\n\tfmt.Printf(\"Task %d bekerja...\\n\", id)\n\ttime.Sleep(50 * time.Millisecond)\n}\n\nfunc main() {\n\tvar wg sync.WaitGroup\n\tfor i := 1; i <= 5; i++ {\n\t\twg.Add(1)\n\t\tgo Task(i, &wg)\n\t}\n\twg.Wait()\n\tfmt.Println(\"SEMUA TASK SELESAI!\")\n}",
        "quiz": {
                "question": "Method WaitGroup yang dipanggil di akhir Goroutine?",
                "options": [
                        "wg.Done()",
                        "wg.Wait()",
                        "wg.Finish()",
                        "wg.Complete()"
                ],
                "correctIndex": 0,
                "explanation": "wg.Done() mengurangi counter WaitGroup sebesar 1."
        }
},
{
        "id": 108,
        "category": "Domain 6: Goroutines & Concurrency",
        "timestamp": "01:55:00",
        "title": "sync.Once, sync.Map, & sync/atomic",
        "desc": "Eksekusi tunggal (Once), Map thread-safe (sync.Map), dan operasi atomic.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Utilitas Concurrency</h3><ul><li><code>sync.Once</code> — fungsi hanya dieksekusi 1 kali</li><li><code>sync.Map</code> — Map yang aman (Store/Load/Delete)</li><li><code>sync/atomic</code> — operasi matematika tanpa lock</li></ul></div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"sync/atomic\"\n)\n\nfunc main() {\n\tvar counter int64 = 0\n\tatomic.AddInt64(&counter, 1)\n\tatomic.AddInt64(&counter, 1)\n\tfmt.Println(\"Atomic Counter:\", atomic.LoadInt64(&counter))\n}",
        "quiz": {
                "question": "Package untuk operasi matematika thread-safe tanpa Mutex?",
                "options": [
                        "sync/atomic",
                        "sync/mutex",
                        "math/fast",
                        "os/cpu"
                ],
                "correctIndex": 0,
                "explanation": "sync/atomic menyediakan operasi atomic di tingkat hardware CPU."
        }
},
{
        "id": 109,
        "category": "Domain 6: Goroutines & Concurrency",
        "timestamp": "02:05:00",
        "title": "Timer, Ticker, & GOMAXPROCS",
        "desc": "Penjadwalan eksekusi satu kali (Timer), periodik (Ticker), dan pengaturan CPU cores.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Timer & Ticker</h3><ul><li><code>time.Timer</code> — sinyal 1 kali</li><li><code>time.Ticker</code> — sinyal periodik berulang</li><li><code>runtime.GOMAXPROCS(n)</code> — atur jumlah OS Thread</li></ul></div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tticker := time.NewTicker(100 * time.Millisecond)\n\tdone := make(chan bool)\n\tgo func() {\n\t\ttime.Sleep(350 * time.Millisecond)\n\t\tdone <- true\n\t}()\n\tfor {\n\t\tselect {\n\t\tcase <-done:\n\t\t\tticker.Stop()\n\t\t\tfmt.Println(\"Ticker Dihentikan!\")\n\t\t\treturn\n\t\tcase t := <-ticker.C:\n\t\t\tfmt.Println(\"Tick:\", t.Format(\"15:04:05.000\"))\n\t\t}\n\t}\n}",
        "quiz": {
                "question": "Komponen untuk eksekusi berulang setiap interval?",
                "options": [
                        "time.Ticker",
                        "time.Timer",
                        "time.Sleep",
                        "time.After"
                ],
                "correctIndex": 0,
                "explanation": "Ticker terus mengirim sinyal di channel .C secara periodik."
        }
},
{
        "id": 110,
        "category": "Domain 7: Package Context",
        "timestamp": "00:02:00",
        "title": "Pengenalan Context & Context Tree",
        "desc": "Arsitektur Parent-Child Context Tree dan sinyal cancellation.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Package Context</h3><p>Membawa sinyal <strong>cancellation</strong>, <strong>deadline</strong>, dan <strong>request-scoped data</strong>. Jika Parent dibatalkan, seluruh Child otomatis terbatalkan secara berantai!</p></div>",
        "initialCode": "package main\n\nimport (\n\t\"context\"\n\t\"fmt\"\n)\n\nfunc main() {\n\tctx := context.Background()\n\tfmt.Println(\"Root Context:\", ctx)\n}",
        "quiz": {
                "question": "Jika Parent Context dibatalkan, apa yang terjadi pada Child Context?",
                "options": [
                        "Seluruh Child ikut terbatalkan secara berantai",
                        "Child tetap berjalan",
                        "Aplikasi crash",
                        "Child jadi nil"
                ],
                "correctIndex": 0,
                "explanation": "Pembatalan bersifat cascaded dari parent ke seluruh anak."
        }
},
{
        "id": 111,
        "category": "Domain 7: Package Context",
        "timestamp": "00:08:00",
        "title": "context.Background, context.TODO, & WithValue",
        "desc": "Membuat Root Context dan menyisipkan metadata request-scoped.",
        "theoryHtml": "<div class=\"theory-section\"><h3>WithValue</h3><p><code>context.WithValue(parent, key, value)</code> menyisipkan data. Membaca: <code>ctx.Value(key)</code>.</p></div>",
        "initialCode": "package main\n\nimport (\n\t\"context\"\n\t\"fmt\"\n)\n\nfunc main() {\n\tparent := context.Background()\n\tctx := context.WithValue(parent, \"userID\", \"USER-123\")\n\tfmt.Println(\"User ID:\", ctx.Value(\"userID\"))\n}",
        "quiz": {
                "question": "Method untuk membaca nilai di dalam Context?",
                "options": [
                        "ctx.Value(key)",
                        "ctx.Get(key)",
                        "ctx.Read(key)",
                        "ctx.Fetch(key)"
                ],
                "correctIndex": 0,
                "explanation": "Method .Value(key) mengambil metadata dari Context."
        }
},
{
        "id": 112,
        "category": "Domain 7: Package Context",
        "timestamp": "00:24:00",
        "title": "context.WithCancel (Sinyal Pembatalan Manual)",
        "desc": "Mengirim sinyal cancel untuk menghentikan Goroutines.",
        "theoryHtml": "<div class=\"theory-section\"><h3>WithCancel</h3><p><code>ctx, cancel := context.WithCancel(parent)</code>. Saat <code>cancel()</code> dipanggil, <code>ctx.Done()</code> menutup channel dan memberikan sinyal.</p></div>",
        "initialCode": "package main\n\nimport (\n\t\"context\"\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc Counter(ctx context.Context) <-chan int {\n\tch := make(chan int)\n\tgo func() {\n\t\tdefer close(ch)\n\t\tn := 1\n\t\tfor {\n\t\t\tselect {\n\t\t\tcase <-ctx.Done():\n\t\t\t\tfmt.Println(\"Counter dihentikan!\")\n\t\t\t\treturn\n\t\t\tcase ch <- n:\n\t\t\t\tn++\n\t\t\t}\n\t\t}\n\t}()\n\treturn ch\n}\n\nfunc main() {\n\tctx, cancel := context.WithCancel(context.Background())\n\tfor n := range Counter(ctx) {\n\t\tfmt.Println(\"Angka:\", n)\n\t\tif n == 3 {\n\t\t\tcancel()\n\t\t\tbreak\n\t\t}\n\t}\n\ttime.Sleep(100 * time.Millisecond)\n}",
        "quiz": {
                "question": "Channel yang menutup saat cancel() dipanggil?",
                "options": [
                        "ctx.Done()",
                        "ctx.Close()",
                        "ctx.Exit()",
                        "ctx.Stop()"
                ],
                "correctIndex": 0,
                "explanation": "Channel ctx.Done() tertutup saat sinyal pembatalan terjadi."
        }
},
{
        "id": 113,
        "category": "Domain 7: Package Context",
        "timestamp": "00:35:00",
        "title": "context.WithTimeout & WithDeadline",
        "desc": "Membatalkan proses otomatis jika melebihi batas waktu.",
        "theoryHtml": "<div class=\"theory-section\"><h3>WithTimeout & WithDeadline</h3><p><code>WithTimeout(parent, 5*time.Second)</code> — durasi relatif. <code>WithDeadline(parent, time.Time)</code> — waktu spesifik. Selalu panggil <code>defer cancel()</code>!</p></div>",
        "initialCode": "package main\n\nimport (\n\t\"context\"\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc SlowQuery(ctx context.Context) {\n\tselect {\n\tcase <-time.After(500 * time.Millisecond):\n\t\tfmt.Println(\"Query Selesai!\")\n\tcase <-ctx.Done():\n\t\tfmt.Println(\"TIMEOUT!\", ctx.Err())\n\t}\n}\n\nfunc main() {\n\tctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)\n\tdefer cancel()\n\tSlowQuery(ctx)\n}",
        "quiz": {
                "question": "Error dari ctx.Err() jika timeout terlampaui?",
                "options": [
                        "context.DeadlineExceeded",
                        "context.Canceled",
                        "context.NullError",
                        "context.TimeoutError"
                ],
                "correctIndex": 0,
                "explanation": "ctx.Err() bernilai 'context.DeadlineExceeded' jika batas waktu terlampaui."
        }
},
{
        "id": 114,
        "category": "Domain 7: Package Context",
        "timestamp": "00:44:00",
        "title": "Goroutine Leak Prevention & Best Practices",
        "desc": "Mencegah Goroutine Leak dan konvensi penulisan parameter Context.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Goroutine Leak & Best Practices</h3><p><strong>Goroutine Leak</strong> = goroutine yang tak pernah mati karena ter-block channel. Solusi: selalu teruskan Context dan dengarkan <code>&lt;-ctx.Done()</code>.</p><h3>Konvensi:</h3><ul><li>Parameter <code>ctx context.Context</code> selalu di posisi PERTAMA</li><li>Jangan simpan Context di struct</li><li>Selalu <code>defer cancel()</code></li></ul></div>",
        "initialCode": "package main\n\nimport (\n\t\"context\"\n\t\"fmt\"\n\t\"runtime\"\n\t\"time\"\n)\n\nfunc SafeRoutine(ctx context.Context) {\n\tgo func() {\n\t\tfor {\n\t\t\tselect {\n\t\t\tcase <-ctx.Done():\n\t\t\t\tfmt.Println(\"Goroutine Berhasil Dihentikan!\")\n\t\t\t\treturn\n\t\t\tdefault:\n\t\t\t\ttime.Sleep(10 * time.Millisecond)\n\t\t\t}\n\t\t}\n\t}()\n}\n\nfunc main() {\n\tctx, cancel := context.WithCancel(context.Background())\n\tSafeRoutine(ctx)\n\tfmt.Println(\"Goroutines aktif:\", runtime.NumGoroutine())\n\tcancel()\n\ttime.Sleep(50 * time.Millisecond)\n\tfmt.Println(\"Setelah cancel:\", runtime.NumGoroutine())\n}",
        "quiz": {
                "question": "Posisi konvensi parameter 'ctx context.Context'?",
                "options": [
                        "Parameter paling pertama (kiri)",
                        "Parameter terakhir (kanan)",
                        "Di dalam struct",
                        "Posisi bebas"
                ],
                "correctIndex": 0,
                "explanation": "Konvensi Go: context selalu di posisi argumen pertama."
        }
},
{
    "id": 115,
    "category": "Domain 8: Go Modern (1.21 - 1.26)",
    "timestamp": "00:00:00",
    "title": "Iterator & range-over-func (Go 1.23)",
    "desc": "Menulis iterator kustom yang bisa dipakai langsung oleh perulangan range, memakai tipe iter.Seq dan iter.Seq2.",
    "theoryHtml": `
        <div class="theory-section">
            <h3>Masalah Sebelum Go 1.23</h3>
            <p>Sebelum Go 1.23, tidak ada cara seragam untuk mengiterasi struktur data buatan sendiri. Setiap pustaka mengarang polanya masing-masing: ada yang mengembalikan slice (boros memori), ada yang memakai channel (lambat dan rawan bocor goroutine), ada yang memakai objek <code>Next()</code> bergaya Java.</p>

            <div class="code-box">
                <div class="code-box-header"><span>Tiga pola lama yang saling tidak kompatibel</span></div>
                <pre>// 1. Kembalikan slice -- seluruh data harus muat di memori
func (t *Tree) Semua() []int { ... }

// 2. Channel -- lambat, dan bocor bila konsumen berhenti di tengah
func (t *Tree) Iterasi() &lt;-chan int { ... }

// 3. Objek iterator -- verbose
it := t.Iterator()
for it.Next() { gunakan(it.Value()) }</pre>
            </div>

            <h3>range-over-func</h3>
            <p>Go 1.23 memperkenalkan kemampuan <code>range</code> untuk mengiterasi <strong>fungsi</strong>. Paket <code>iter</code> mendefinisikan dua tipe bakunya:</p>

            <div class="code-box">
                <pre>package iter

type Seq[V any]      func(yield func(V) bool)
type Seq2[K, V any]  func(yield func(K, V) bool)</pre>
            </div>

            <p>Kuncinya ada pada nilai balik <code>bool</code> dari <code>yield</code>. Bila konsumen menghentikan perulangan (lewat <code>break</code>, <code>return</code>, atau <code>panic</code>), <code>yield</code> mengembalikan <code>false</code> dan iterator wajib berhenti. Inilah yang membuat pembersihan sumber daya menjadi benar secara otomatis.</p>

            <div class="code-box">
                <div class="code-box-header"><span>Menulis iterator sendiri</span></div>
                <pre>import "iter"

type Pohon struct {
    Nilai       int
    Kiri, Kanan *Pohon
}

// Penelusuran in-order sebagai iterator
func (p *Pohon) Semua() iter.Seq[int] {
    return func(yield func(int) bool) {
        p.telusuri(yield)
    }
}

func (p *Pohon) telusuri(yield func(int) bool) bool {
    if p == nil {
        return true
    }
    return p.Kiri.telusuri(yield) &&
           yield(p.Nilai) &&
           p.Kanan.telusuri(yield)
}

// Dipakai persis seperti mengiterasi slice:
for nilai := range pohon.Semua() {
    fmt.Println(nilai)
    if nilai &gt; 100 {
        break     // iterator berhenti dengan rapi
    }
}</pre>
            </div>

            <div class="callout callout-tip">
                <div class="callout-title">📌 Iterator dengan pembersihan sumber daya</div>
                <p>Karena iterator adalah fungsi biasa, <code>defer</code> bekerja seperti biasa. Ini menyelesaikan masalah kebocoran yang dulu menghantui iterator berbasis channel.</p>
            </div>

            <div class="code-box">
                <pre>func BarisBerkas(nama string) iter.Seq2[string, error] {
    return func(yield func(string, error) bool) {
        f, err := os.Open(nama)
        if err != nil {
            yield("", err)
            return
        }
        defer f.Close()      // SELALU dipanggil, termasuk saat break

        pemindai := bufio.NewScanner(f)
        for pemindai.Scan() {
            if !yield(pemindai.Text(), nil) {
                return       // konsumen berhenti -- defer tetap jalan
            }
        }
        if err := pemindai.Err(); err != nil {
            yield("", err)
        }
    }
}

for baris, err := range BarisBerkas("data.txt") {
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(baris)
}</pre>
            </div>

            <h3>Fungsi Pembantu di Paket iter</h3>
            <div class="code-box">
                <pre>// Mengubah iterator "push" menjadi gaya "pull"
next, stop := iter.Pull(pohon.Semua())
defer stop()

for {
    nilai, ada := next()
    if !ada {
        break
    }
    fmt.Println(nilai)
}
// Berguna untuk menggabungkan dua iterator secara berselang-seling,
// yang mustahil dilakukan dengan gaya push biasa.</pre>
            </div>

            <div class="callout callout-warning">
                <div class="callout-title">⚠️ Jangan lupa memeriksa nilai balik yield</div>
                <p>Iterator yang mengabaikan hasil <code>yield</code> akan terus berjalan meski konsumen sudah <code>break</code>. Pada sumber data tak terbatas, ini berarti perulangan tak berujung. Selalu tulis <code>if !yield(v) { return }</code>.</p>
            </div>
        </div>
    `,
    "initialCode": "package main\n\nimport \"fmt\"\n\n// Simulasi iter.Seq: fungsi yang menerima yield\ntype Seq func(yield func(int) bool)\n\nfunc Angka(dari, sampai int) Seq {\n\treturn func(yield func(int) bool) {\n\t\tfor i := dari; i <= sampai; i++ {\n\t\t\tif !yield(i) {\n\t\t\t\tfmt.Println(\"   (iterator berhenti lebih awal di\", i, \")\")\n\t\t\t\treturn\n\t\t\t}\n\t\t}\n\t}\n}\n\nfunc main() {\n\tfmt.Println(\"=== Iterasi penuh ===\")\n\tAngka(1, 5)(func(n int) bool {\n\t\tfmt.Println(\"  nilai:\", n)\n\t\treturn true\n\t})\n\n\tfmt.Println(\"\\n=== Berhenti saat n > 3 (setara break) ===\")\n\tAngka(1, 10)(func(n int) bool {\n\t\tif n > 3 {\n\t\t\treturn false\n\t\t}\n\t\tfmt.Println(\"  nilai:\", n)\n\t\treturn true\n\t})\n}",
    "quiz": {
        "question": "Apa fungsi nilai balik bertipe bool dari parameter 'yield' pada iterator iter.Seq?",
        "options": [
            "Menandakan apakah nilai yang dikirim valid",
            "Menandakan apakah konsumen masih ingin melanjutkan; bila false, iterator wajib berhenti",
            "Menandakan apakah terjadi error saat iterasi",
            "Menentukan apakah nilai berikutnya akan dilewati"
        ],
        "correctIndex": 1,
        "explanation": "Ketika konsumen menjalankan break atau return di dalam perulangan range, runtime membuat yield mengembalikan false. Iterator harus memeriksa nilai ini dan segera berhenti, sehingga defer untuk pembersihan sumber daya dapat berjalan dengan benar."
    }
},
{
    "id": 116,
    "category": "Domain 8: Go Modern (1.21 - 1.26)",
    "timestamp": "00:00:00",
    "title": "Paket slices, maps & cmp",
    "desc": "Menggantikan kode boilerplate manual dengan fungsi generik baku untuk mengurutkan, mencari, membandingkan, dan memanipulasi slice serta map.",
    "theoryHtml": `
        <div class="theory-section">
            <h3>Akhir dari Kode Berulang</h3>
            <p>Sebelum Go 1.21, setiap proyek punya paket <code>utils</code> berisi fungsi yang sama: cari indeks dalam slice, cek keberadaan elemen, ambil semua kunci map. Paket <code>slices</code> dan <code>maps</code> kini menyediakannya secara baku dan generik.</p>

            <h3>Paket slices</h3>
            <div class="code-box">
                <div class="code-box-header"><span>Mengurutkan</span></div>
                <pre>import "slices"

angka := []int{5, 2, 8, 1, 9}
slices.Sort(angka)                    // [1 2 5 8 9]

// Urut berdasarkan aturan sendiri
orang := []Orang{{"Budi", 30}, {"Ani", 25}}
slices.SortFunc(orang, func(a, b Orang) int {
    return cmp.Compare(a.Umur, b.Umur)
})

// Versi stabil: elemen yang sama mempertahankan urutan aslinya
slices.SortStableFunc(orang, func(a, b Orang) int {
    return strings.Compare(a.Nama, b.Nama)
})

slices.IsSorted(angka)                // true</pre>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Mencari</span></div>
                <pre>slices.Contains(angka, 8)             // true
slices.Index(angka, 8)                // 3, atau -1 bila tidak ada

slices.IndexFunc(orang, func(o Orang) bool {
    return o.Umur &gt; 28
})

// Pencarian biner -- HANYA pada slice yang sudah terurut
idx, ketemu := slices.BinarySearch(angka, 5)</pre>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Memanipulasi</span></div>
                <pre>a := []int{1, 2, 3}
b := []int{4, 5}

gabung := slices.Concat(a, b)         // [1 2 3 4 5]
salinan := slices.Clone(a)            // salinan dangkal
slices.Reverse(a)                     // [3 2 1]

// Buang elemen berurutan yang duplikat (perlu diurutkan dulu)
dedup := slices.Compact([]int{1, 1, 2, 2, 3})   // [1 2 3]

// Hapus indeks 1 sampai sebelum 3
sisa := slices.Delete([]int{1,2,3,4,5}, 1, 3)   // [1 4 5]

// Sisipkan di indeks 2
hasil := slices.Insert([]int{1,2,5}, 2, 3, 4)   // [1 2 3 4 5]

slices.Equal(a, b)                    // perbandingan elemen per elemen
slices.Max(angka)
slices.Min(angka)</pre>
            </div>

            <h3>Iterator di slices (Go 1.23+)</h3>
            <div class="code-box">
                <pre>// Mengiterasi dengan indeks sebagai iter.Seq2
for i, v := range slices.All(angka) { ... }

// Hanya nilainya
for v := range slices.Values(angka) { ... }

// Dari belakang
for i, v := range slices.Backward(angka) { ... }

// Mengumpulkan iterator kembali menjadi slice
hasil := slices.Collect(pohon.Semua())
terurut := slices.Sorted(pohon.Semua())</pre>
            </div>

            <h3>Paket maps</h3>
            <div class="code-box">
                <pre>import "maps"

m := map[string]int{"a": 1, "b": 2, "c": 3}

// Mengembalikan ITERATOR, bukan slice
for k := range maps.Keys(m) { ... }
for v := range maps.Values(m) { ... }

// Ubah menjadi slice terurut -- pola yang sangat sering dipakai
kunci := slices.Sorted(maps.Keys(m))   // [a b c]

salinan := maps.Clone(m)
maps.Copy(tujuan, sumber)
maps.Equal(m1, m2)

// Hapus berdasarkan kondisi
maps.DeleteFunc(m, func(k string, v int) bool {
    return v &lt; 2
})</pre>
            </div>

            <div class="callout callout-warning">
                <div class="callout-title">⚠️ Urutan iterasi map di Go sengaja diacak</div>
                <p>Go dengan sengaja mengacak urutan iterasi map agar programmer tidak diam-diam bergantung padanya. Bila Anda butuh keluaran yang dapat direproduksi — misalnya untuk log, JSON, atau uji — <strong>selalu</strong> urutkan kuncinya dulu dengan <code>slices.Sorted(maps.Keys(m))</code>.</p>
            </div>

            <h3>Paket cmp</h3>
            <div class="code-box">
                <pre>import "cmp"

cmp.Compare(3, 5)          // -1
cmp.Less("a", "b")         // true

// Mengembalikan nilai bukan-kosong yang pertama
nama := cmp.Or(dariEnv, dariConfig, "bawaan")

// Pengurutan berjenjang: berdasarkan umur, lalu nama
slices.SortFunc(orang, func(a, b Orang) int {
    return cmp.Or(
        cmp.Compare(a.Umur, b.Umur),
        cmp.Compare(a.Nama, b.Nama),
    )
})</pre>
            </div>

            <div class="callout callout-info">
                <div class="callout-title">💡 Fungsi bawaan min, max, dan clear</div>
                <p>Sejak Go 1.21 tersedia juga tiga fungsi bawaan tanpa perlu import: <code>min(a, b, c)</code>, <code>max(a, b)</code>, serta <code>clear(m)</code> untuk mengosongkan map atau menolkan seluruh elemen slice.</p>
            </div>
        </div>
    `,
    "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n)\n\ntype Orang struct {\n\tNama string\n\tUmur int\n}\n\nfunc main() {\n\tangka := []int{5, 2, 8, 1, 9, 2}\n\tfmt.Println(\"Asli      :\", angka)\n\n\tsort.Ints(angka)\n\tfmt.Println(\"Terurut   :\", angka)\n\n\t// Simulasi slices.Compact\n\tunik := angka[:1]\n\tfor _, v := range angka[1:] {\n\t\tif v != unik[len(unik)-1] {\n\t\t\tunik = append(unik, v)\n\t\t}\n\t}\n\tfmt.Println(\"Tanpa dup :\", unik)\n\n\t// min & max bawaan Go 1.21+\n\tfmt.Println(\"Min       :\", min(5, 2, 8))\n\tfmt.Println(\"Max       :\", max(5, 2, 8))\n\n\t// Map: kunci harus diurutkan agar keluaran konsisten\n\tm := map[string]int{\"c\": 3, \"a\": 1, \"b\": 2}\n\tkunci := make([]string, 0, len(m))\n\tfor k := range m {\n\t\tkunci = append(kunci, k)\n\t}\n\tsort.Strings(kunci)\n\tfmt.Println(\"Kunci urut:\", kunci)\n}",
    "quiz": {
        "question": "Mengapa hasil maps.Keys(m) sebaiknya selalu diurutkan sebelum dipakai untuk keluaran log atau JSON?",
        "options": [
            "Karena maps.Keys mengembalikan data yang rusak bila tidak diurutkan",
            "Karena Go sengaja mengacak urutan iterasi map, sehingga keluaran tidak akan konsisten antar eksekusi",
            "Karena pengurutan membuat program berjalan lebih cepat",
            "Karena maps.Keys hanya bekerja pada map bertipe string"
        ],
        "correctIndex": 1,
        "explanation": "Go secara sengaja mengacak urutan iterasi map agar tidak ada kode yang diam-diam bergantung pada urutan tertentu. Untuk keluaran yang harus dapat direproduksi seperti log, respons JSON, atau perbandingan pada uji, kunci wajib diurutkan lebih dulu dengan slices.Sorted(maps.Keys(m))."
    }
},
{
    "id": 117,
    "category": "Domain 8: Go Modern (1.21 - 1.26)",
    "timestamp": "00:00:00",
    "title": "errgroup & Concurrency Terstruktur",
    "desc": "Menjalankan banyak goroutine secara paralel dengan penanganan error, pembatalan otomatis, dan pembatasan jumlah pekerja memakai golang.org/x/sync/errgroup.",
    "theoryHtml": `
        <div class="theory-section">
            <h3>Kelemahan sync.WaitGroup</h3>
            <p><code>sync.WaitGroup</code> hanya bisa menunggu. Ia tidak tahu apa-apa tentang error, dan tidak bisa membatalkan goroutine lain ketika salah satu gagal.</p>

            <div class="code-box">
                <div class="code-box-header"><span>Pola lama yang bertele-tele</span></div>
                <pre>var wg sync.WaitGroup
var mu sync.Mutex
var errPertama error

for _, url := range daftarURL {
    wg.Add(1)
    go func(u string) {
        defer wg.Done()
        if err := ambil(u); err != nil {
            mu.Lock()
            if errPertama == nil {
                errPertama = err
            }
            mu.Unlock()
        }
    }(url)
}
wg.Wait()
// Semua goroutine tetap berjalan sampai selesai
// meski yang pertama sudah gagal sejak awal.</pre>
            </div>

            <h3>errgroup</h3>
            <div class="code-box">
                <pre>import "golang.org/x/sync/errgroup"

func ambilSemua(ctx context.Context, daftarURL []string) error {
    g, ctx := errgroup.WithContext(ctx)

    for _, url := range daftarURL {
        g.Go(func() error {
            return ambil(ctx, url)     // cukup kembalikan error
        })
    }

    return g.Wait()   // error PERTAMA yang bukan nil
}</pre>
            </div>

            <div class="callout callout-info">
                <div class="callout-title">💡 Kekuatan errgroup.WithContext</div>
                <p>Begitu ada satu goroutine yang mengembalikan error, context yang dikembalikan akan <strong>dibatalkan</strong>. Semua goroutine lain yang menghormati context tersebut akan berhenti dengan sendirinya. Anda tidak perlu lagi mengatur mutex, channel penanda, atau pelacakan error secara manual.</p>
            </div>

            <h3>Membatasi Jumlah Pekerja</h3>
            <div class="code-box">
                <pre>g, ctx := errgroup.WithContext(ctx)
g.SetLimit(10)     // maksimal 10 goroutine berjalan bersamaan

for _, berkas := range sejutaBerkas {
    g.Go(func() error {
        return proses(ctx, berkas)
    })
}
return g.Wait()</pre>
            </div>

            <div class="callout callout-warning">
                <div class="callout-title">⚠️ Tanpa SetLimit, sejuta pekerjaan berarti sejuta goroutine</div>
                <p>Goroutine memang murah (sekitar 2 KB), tetapi sejuta goroutine berarti beberapa gigabyte memori, ditambah kemungkinan membuka sejuta koneksi sekaligus ke database atau API tujuan. <code>SetLimit</code> mengubah errgroup menjadi kolam pekerja dengan satu baris kode.</p>
            </div>

            <h3>Mengumpulkan Hasil, Bukan Hanya Error</h3>
            <div class="code-box">
                <pre>func ambilSemuaHasil(ctx context.Context, urls []string) ([]Hasil, error) {
    hasil := make([]Hasil, len(urls))   // dialokasikan di muka
    g, ctx := errgroup.WithContext(ctx)
    g.SetLimit(runtime.NumCPU())

    for i, url := range urls {
        g.Go(func() error {
            r, err := ambil(ctx, url)
            if err != nil {
                return fmt.Errorf("ambil %s: %w", url, err)
            }
            hasil[i] = r     // AMAN: tiap goroutine menulis indeks berbeda
            return nil
        })
    }

    if err := g.Wait(); err != nil {
        return nil, err
    }
    return hasil, nil
}</pre>
            </div>

            <div class="callout callout-tip">
                <div class="callout-title">📌 Kenapa menulis ke indeks slice itu aman</div>
                <p>Menulis ke indeks yang berbeda dari slice yang sama tidak menimbulkan data race, karena tidak ada dua goroutine yang menyentuh lokasi memori yang sama. Yang <strong>tidak</strong> aman adalah <code>append</code> ke slice yang sama dari banyak goroutine, karena append mengubah panjang dan bisa memicu realokasi.</p>
            </div>

            <h3>Bug Lama: Variabel Perulangan</h3>
            <div class="code-box">
                <pre>// Di Go 1.21 dan sebelumnya, kode ini BUG:
for _, url := range urls {
    go func() {
        ambil(url)     // semua goroutine melihat url yang SAMA
    }()
}
// Solusi lama: url := url, atau kirim sebagai argumen.

// Sejak Go 1.22, variabel perulangan dibuat BARU di tiap iterasi,
// sehingga kode di atas kini berperilaku benar.</pre>
            </div>

            <div class="callout callout-warning">
                <div class="callout-title">⚠️ Perilaku ini bergantung pada baris <code>go</code> di go.mod</div>
                <p>Semantik baru hanya aktif bila modul Anda menyatakan <code>go 1.22</code> atau lebih tinggi di <code>go.mod</code>. Modul lama tetap memakai perilaku lama demi kompatibilitas. Saat memutakhirkan modul lama, periksa kembali seluruh goroutine di dalam perulangan.</p>
            </div>

            <h3>Menyebarkan Pembatalan dengan Benar</h3>
            <div class="code-box">
                <pre>func proses(ctx context.Context, item Item) error {
    // Selalu periksa pembatalan pada pekerjaan yang panjang
    select {
    case &lt;-ctx.Done():
        return ctx.Err()
    default:
    }

    // Teruskan ctx ke SEMUA panggilan yang memblokir
    req, _ := http.NewRequestWithContext(ctx, "GET", item.URL, nil)
    resp, err := http.DefaultClient.Do(req)
    ...
    row := db.QueryRowContext(ctx, "SELECT ...")
    ...
}</pre>
            </div>

            <div class="callout callout-danger">
                <div class="callout-title">🚫 Goroutine yang mengabaikan context tidak akan pernah berhenti</div>
                <p>Pembatalan di Go bersifat <strong>kooperatif</strong>. Membatalkan context tidak menghentikan goroutine secara paksa — ia hanya menutup sebuah channel. Bila kode Anda tidak pernah memeriksa <code>ctx.Done()</code> dan tidak meneruskan context ke pemanggilan yang memblokir, goroutine akan terus berjalan sampai selesai, dan errgroup akan menunggunya.</p>
            </div>
        </div>
    `,
    "initialCode": "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n\t\"sync\"\n\t\"time\"\n)\n\n// Simulasi errgroup sederhana\ntype Grup struct {\n\twg      sync.WaitGroup\n\tmu      sync.Mutex\n\terr     error\n\tbatal   chan struct{}\n\tsekali  sync.Once\n}\n\nfunc (g *Grup) Go(fn func() error) {\n\tg.wg.Add(1)\n\tgo func() {\n\t\tdefer g.wg.Done()\n\t\tif err := fn(); err != nil {\n\t\t\tg.mu.Lock()\n\t\t\tif g.err == nil {\n\t\t\t\tg.err = err\n\t\t\t\tg.sekali.Do(func() { close(g.batal) })\n\t\t\t}\n\t\t\tg.mu.Unlock()\n\t\t}\n\t}()\n}\n\nfunc (g *Grup) Wait() error { g.wg.Wait(); return g.err }\n\nfunc main() {\n\tg := &Grup{batal: make(chan struct{})}\n\n\ttugas := []string{\"api-a\", \"api-b\", \"api-c\"}\n\tfor i, nama := range tugas {\n\t\tgagal := i == 1\n\t\tg.Go(func() error {\n\t\t\ttime.Sleep(time.Duration(i+1) * 50 * time.Millisecond)\n\t\t\tif gagal {\n\t\t\t\tfmt.Println(\"  ✗\", nama, \"GAGAL\")\n\t\t\t\treturn errors.New(nama + \": koneksi ditolak\")\n\t\t\t}\n\t\t\tfmt.Println(\"  ✓\", nama, \"sukses\")\n\t\t\treturn nil\n\t\t})\n\t}\n\n\tif err := g.Wait(); err != nil {\n\t\tfmt.Println(\"\\nError pertama:\", err)\n\t\treturn\n\t}\n\tfmt.Println(\"\\nSemua berhasil\")\n}",
    "quiz": {
        "question": "Apa yang terjadi pada goroutine lain ketika satu goroutine dalam errgroup.WithContext mengembalikan error?",
        "options": [
            "Semua goroutine lain langsung dihentikan paksa oleh runtime",
            "Context yang dikembalikan dibatalkan, sehingga goroutine yang menghormati context tersebut dapat berhenti sendiri",
            "Tidak ada pengaruh apa pun, semua tetap berjalan sampai selesai",
            "Program langsung panic"
        ],
        "correctIndex": 1,
        "explanation": "errgroup.WithContext membatalkan context saat error pertama muncul. Pembatalan di Go bersifat kooperatif: goroutine hanya akan berhenti bila ia memeriksa ctx.Done() atau meneruskan context ke pemanggilan yang memblokir. Goroutine yang mengabaikan context akan tetap berjalan sampai tuntas."
    }
},
{
    "id": 118,
    "category": "Domain 8: Go Modern (1.21 - 1.26)",
    "timestamp": "00:00:00",
    "title": "Fuzzing & testing/synctest",
    "desc": "Menemukan bug yang tidak terpikirkan lewat fuzzing bawaan, dan menguji kode konkuren berbasis waktu secara deterministik dengan testing/synctest.",
    "theoryHtml": `
        <div class="theory-section">
            <h3>Fuzzing: Membiarkan Mesin Mencari Kasus Uji</h3>
            <p>Uji biasa hanya memeriksa masukan yang <em>Anda pikirkan</em>. Fuzzing membangkitkan masukan secara otomatis dan cerdas, dipandu oleh cakupan kode, untuk menemukan yang tidak terpikirkan.</p>

            <div class="code-box">
                <div class="code-box-header"><span>parser_test.go</span></div>
                <pre>func FuzzUraiWaktu(f *testing.F) {
    // Benih: contoh masukan yang valid sebagai titik awal
    f.Add("12:30")
    f.Add("00:00")
    f.Add("23:59")

    f.Fuzz(func(t *testing.T, s string) {
        jam, menit, err := UraiWaktu(s)
        if err != nil {
            return    // menolak masukan buruk itu WAJAR
        }

        // Bila berhasil diurai, hasilnya HARUS masuk akal
        if jam &lt; 0 || jam &gt; 23 {
            t.Errorf("jam di luar rentang: %d dari %q", jam, s)
        }
        if menit &lt; 0 || menit &gt; 59 {
            t.Errorf("menit di luar rentang: %d dari %q", menit, s)
        }
    })
}</pre>
            </div>

            <div class="code-box">
                <pre># Jalankan sebagai uji biasa (hanya memakai benih)
go test ./...

# Jalankan fuzzing sungguhan selama 30 detik
go test -fuzz=FuzzUraiWaktu -fuzztime=30s

# Masukan yang membuat gagal otomatis DISIMPAN ke
# testdata/fuzz/FuzzUraiWaktu/ dan menjadi kasus uji permanen.</pre>
            </div>

            <div class="callout callout-tip">
                <div class="callout-title">📌 Sifat yang paling berguna untuk diuji</div>
                <ul>
                    <li><strong>Bolak-balik:</strong> <code>Urai(Format(x)) == x</code> untuk setiap x.</li>
                    <li><strong>Tidak pernah panic:</strong> masukan apa pun boleh ditolak, tetapi tidak boleh membuat program crash.</li>
                    <li><strong>Invarian:</strong> hasil selalu berada dalam rentang yang sah.</li>
                    <li><strong>Kesetaraan:</strong> implementasi baru yang dioptimalkan memberi hasil sama dengan implementasi lama yang sederhana.</li>
                </ul>
            </div>

            <div class="callout callout-info">
                <div class="callout-title">💡 Fuzzing sangat efektif pada kode parsing</div>
                <p>Penguraian JSON, YAML, protokol jaringan, format berkas, dan validasi masukan pengguna adalah tempat fuzzing paling sering menemukan bug nyata — terutama panic akibat indeks di luar batas dan pointer nil pada masukan yang cacat.</p>
            </div>

            <h3>testing/synctest: Menguji Waktu Tanpa Menunggu</h3>
            <p>Menguji kode yang memakai <code>time.Sleep</code>, <code>time.After</code>, atau timeout selalu bermasalah: uji menjadi lambat karena benar-benar menunggu, dan menjadi rapuh karena mesin CI yang sibuk membuat waktunya meleset.</p>

            <div class="code-box">
                <div class="code-box-header"><span>Masalahnya</span></div>
                <pre>func TestCacheKedaluwarsa(t *testing.T) {
    c := NewCache(100 * time.Millisecond)
    c.Set("a", 1)

    time.Sleep(150 * time.Millisecond)   // uji jadi lambat

    if _, ada := c.Get("a"); ada {
        t.Error("seharusnya sudah kedaluwarsa")
    }
}
// Punya 50 uji seperti ini? Pipeline Anda bertambah lambat
// berdetik-detik, dan tetap gagal acak di runner yang sibuk.</pre>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Dengan synctest — waktu palsu, instan, deterministik</span></div>
                <pre>import "testing/synctest"

func TestCacheKedaluwarsa(t *testing.T) {
    synctest.Test(t, func(t *testing.T) {
        c := NewCache(100 * time.Millisecond)
        c.Set("a", 1)

        // Waktu di dalam gelembung ini PALSU.
        // Maju 150 ms secara seketika.
        time.Sleep(150 * time.Millisecond)

        if _, ada := c.Get("a"); ada {
            t.Error("seharusnya sudah kedaluwarsa")
        }
    })
}</pre>
            </div>

            <div class="callout callout-info">
                <div class="callout-title">💡 Cara kerja "gelembung" synctest</div>
                <p>Semua goroutine yang dibuat di dalam gelembung memakai jam virtual bersama. Ketika <strong>seluruh</strong> goroutine dalam gelembung sedang memblokir, jam virtual otomatis melompat maju ke timer terjadwal berikutnya. Akibatnya <code>time.Sleep(1 * time.Hour)</code> selesai seketika, dan hasilnya sepenuhnya deterministik — tidak ada lagi uji yang gagal acak karena mesin sedang sibuk.</p>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Menunggu goroutine mencapai keadaan diam</span></div>
                <pre>synctest.Test(t, func(t *testing.T) {
    hasil := make(chan int, 1)

    go func() {
        time.Sleep(1 * time.Second)
        hasil &lt;- 42
    }()

    // Tunggu sampai semua goroutine dalam gelembung memblokir
    synctest.Wait()

    // Sekarang aman untuk memeriksa keadaan
    select {
    case v := &lt;-hasil:
        if v != 42 { t.Errorf("dapat %d", v) }
    default:
        t.Error("goroutine belum selesai")
    }
})</pre>
            </div>

            <div class="callout callout-warning">
                <div class="callout-title">⚠️ Batasan gelembung</div>
                <p>Operasi yang benar-benar menyentuh dunia luar — I/O jaringan, pembacaan berkas, panggilan sistem — tidak ikut dipalsukan dan bisa membuat gelembung tidak pernah mencapai keadaan diam. synctest ditujukan untuk menguji <strong>logika penjadwalan dan waktu</strong>: timeout, retry dengan backoff, kedaluwarsa cache, rate limiter, dan debounce. Untuk pengujian yang menyentuh dependensi nyata, tetap gunakan uji integrasi biasa.</p>
            </div>

            <h3>Perkakas Uji Lain yang Sering Terlupakan</h3>
            <div class="code-box">
                <pre># Deteksi data race -- WAJIB dijalankan di CI
go test -race ./...

# Laporan cakupan
go test -coverprofile=cover.out ./...
go tool cover -html=cover.out

# Benchmark beserta alokasi memori
go test -bench=. -benchmem

# Uji contoh yang keluarannya diverifikasi
func ExampleUraiWaktu() {
    j, m, _ := UraiWaktu("12:30")
    fmt.Println(j, m)
    // Output: 12 30
}

# Subuji berbasis tabel dengan t.Parallel()
for _, kasus := range kasusUji {
    t.Run(kasus.nama, func(t *testing.T) {
        t.Parallel()
        ...
    })
}</pre>
            </div>

            <div class="callout callout-danger">
                <div class="callout-title">🚫 <code>-race</code> tidak boleh dilewatkan</div>
                <p>Data race di Go tidak selalu menampakkan diri saat pengembangan; ia muncul di produksi di bawah beban tinggi, dan menghasilkan kerusakan data yang sangat sulit dilacak. Detektor race memperlambat uji beberapa kali lipat, tetapi menemukan bug yang praktis mustahil ditemukan dengan cara lain. Jadikan <code>go test -race</code> wajib di pipeline CI.</p>
            </div>
        </div>
    `,
    "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"strconv\"\n\t\"strings\"\n)\n\n// Fungsi yang akan di-fuzz\nfunc UraiWaktu(s string) (jam, menit int, err error) {\n\tbagian := strings.Split(s, \":\")\n\tif len(bagian) != 2 {\n\t\treturn 0, 0, fmt.Errorf(\"format tidak valid: %q\", s)\n\t}\n\tjam, err = strconv.Atoi(bagian[0])\n\tif err != nil {\n\t\treturn 0, 0, err\n\t}\n\tmenit, err = strconv.Atoi(bagian[1])\n\tif err != nil {\n\t\treturn 0, 0, err\n\t}\n\tif jam < 0 || jam > 23 || menit < 0 || menit > 59 {\n\t\treturn 0, 0, fmt.Errorf(\"di luar rentang: %q\", s)\n\t}\n\treturn jam, menit, nil\n}\n\nfunc main() {\n\t// Masukan yang biasanya ditemukan fuzzer\n\tmasukan := []string{\"12:30\", \"00:00\", \"23:59\", \"24:00\", \"-1:30\", \"12:60\", \"12\", \"::\", \"\", \"12:3a\"}\n\n\tfor _, s := range masukan {\n\t\tj, m, err := UraiWaktu(s)\n\t\tif err != nil {\n\t\t\tfmt.Printf(\"%-8q -> ditolak: %v\\n\", s, err)\n\t\t\tcontinue\n\t\t}\n\t\tfmt.Printf(\"%-8q -> %02d:%02d ✓\\n\", s, j, m)\n\t}\n}",
    "quiz": {
        "question": "Apa keunggulan utama testing/synctest untuk menguji kode yang bergantung pada waktu?",
        "options": [
            "Ia menjalankan uji pada banyak CPU sekaligus",
            "Ia memakai jam virtual sehingga time.Sleep selesai seketika dan hasil uji menjadi deterministik, tidak lagi rapuh di CI yang sibuk",
            "Ia otomatis memperbaiki data race yang ditemukan",
            "Ia menghasilkan masukan uji secara acak"
        ],
        "correctIndex": 1,
        "explanation": "Di dalam gelembung synctest, seluruh goroutine berbagi jam virtual. Ketika semua goroutine memblokir, jam melompat ke timer terjadwal berikutnya, sehingga penantian selesai seketika. Ini menghilangkan dua masalah sekaligus: uji yang lambat dan uji yang gagal secara acak karena beban mesin."
    }
},
{
        "id": 119,
        "category": "Domain 9: Golang JSON",
        "timestamp": "00:01:46",
        "title": "Pengenalan Package encoding/json",
        "desc": "Manipulasi data format JSON (JavaScript Object Notation) di Golang.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Package encoding/json</h3>\n            <p>JSON adalah format standar pertukaran data pada RESTful API. Go menyediakan package bawaan <code>encoding/json</code> untuk konversi data Go ke/dari JSON.</p>\n            <table class=\"tech-table\">\n                <thead><tr><th>Tipe Data JSON</th><th>Pemetaan Tipe Data Go</th></tr></thead>\n                <tbody>\n                    <tr><td>String</td><td>string</td></tr>\n                    <tr><td>Number</td><td>int, float64, int64</td></tr>\n                    <tr><td>Boolean</td><td>bool</td></tr>\n                    <tr><td>Object</td><td>struct / map[string]interface{}</td></tr>\n                    <tr><td>Array</td><td>slice / array ([]T)</td></tr>\n                    <tr><td>Null</td><td>nil / pointer</td></tr>\n                </tbody>\n            </table>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== PACKAGE ENCODING/JSON ===\")\n\tfmt.Println(\"Package bawaan Go untuk Marshalling (Encode) dan Unmarshalling (Decode) data JSON.\")\n\t_ = json.Marshal\n}",
        "quiz": {
                "question": "Package standar Go yang digunakan untuk melakukan manipulasi data format JSON?",
                "options": [
                        "encoding/json",
                        "fmt/json",
                        "os/json",
                        "text/json"
                ],
                "correctIndex": 0,
                "explanation": "Package `encoding/json` adalah package resmi Go untuk enkoding dan dekoding JSON."
        }
},
{
        "id": 120,
        "category": "Domain 9: Golang JSON",
        "timestamp": "00:05:50",
        "title": "Encode JSON (json.Marshal)",
        "desc": "Mengubah tipe data Golang (String, Int, Struct, Map) menjadi data JSON ([]byte).",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>json.Marshal()</h3>\n            <pre>name := \"Eko Kurniawan\"\njsonBytes, err := json.Marshal(name)\nfmt.Println(string(jsonBytes)) // \"Eko Kurniawan\"</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\nfunc main() {\n\tdata := map[string]interface{}{\n\t\t\"name\": \"Golang JSON\",\n\t\t\"version\": 1.18,\n\t\t\"is_active\": true,\n\t}\n\n\tjsonBytes, _ := json.Marshal(data)\n\tfmt.Println(\"Hasil JSON Marshal:\")\n\tfmt.Println(string(jsonBytes))\n}",
        "quiz": {
                "question": "Fungsi dari package `encoding/json` untuk mengonversi data Go menjadi slice of bytes JSON?",
                "options": [
                        "json.Marshal(v)",
                        "json.Encode(v)",
                        "json.Stringify(v)",
                        "json.ToJSON(v)"
                ],
                "correctIndex": 0,
                "explanation": "`json.Marshal(v interface{}) ([]byte, error)` mengonversi data Go menjadi JSON bytes."
        }
},
{
        "id": 121,
        "category": "Domain 9: Golang JSON",
        "timestamp": "00:11:56",
        "title": "JSON Objects & Struct Mapping",
        "desc": "Mengonversi Struct Go menjadi JSON Object dan aturan Exported Field (Capital Letter).",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Struct to JSON Object</h3>\n            <div class=\"callout callout-warning\">\n                <div class=\"callout-title\">⚠️ Aturan Utama Exported Field:</div>\n                <p>Field pada Struct <strong>WAJIB</strong> diawali Huruf Kapital (Public/Exported). Field yang diawali huruf kecil (private) akan diabaikan oleh encoder JSON!</p>\n            </div>\n            <pre>type Customer struct {\n    Name string // Terbaca oleh JSON\n    age  int    // DIABAIKAN (karena huruf kecil)\n}</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\ntype Product struct {\n\tID    string\n\tName  string\n\tPrice int\n}\n\nfunc main() {\n\tp := Product{ID: \"P-01\", Name: \"Laptop Go\", Price: 15000000}\n\tjsonBytes, _ := json.Marshal(p)\n\n\tfmt.Println(\"JSON Object Output:\")\n\tfmt.Println(string(jsonBytes))\n}",
        "quiz": {
                "question": "Syarat utama pada nama field Struct Go agar nilainya dapat di-encode ke JSON oleh `json.Marshal`?",
                "options": [
                        "Nama field harus diawali Huruf Kapital (Exported/Public)",
                        "Nama field harus diawali tanda kurung",
                        "Nama field harus berisi angka",
                        "Tidak ada syarat khusus"
                ],
                "correctIndex": 0,
                "explanation": "Hanya field yang diawali huruf kapital (exported) yang dapat diakses oleh package `encoding/json`."
        }
},
{
        "id": 122,
        "category": "Domain 9: Golang JSON",
        "timestamp": "00:17:16",
        "title": "Decode JSON (json.Unmarshal)",
        "desc": "Mengonversi teks JSON (bytes/string) kembali menjadi objek Struct Go.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>json.Unmarshal()</h3>\n            <pre>jsonString := `{\"Name\":\"Budi\",\"Price\":5000}`\njsonBytes := []byte(jsonString)\n\nvar product Product\nerr := json.Unmarshal(jsonBytes, &product) // Wajib menggunakan Pointer &</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\ntype User struct {\n\tName  string\n\tEmail string\n}\n\nfunc main() {\n\tjsonStr := `{\"Name\":\"Eko Khannedy\",\"Email\":\"eko@example.com\"}`\n\tvar u User\n\tjson.Unmarshal([]byte(jsonStr), &u)\n\n\tfmt.Printf(\"Decoded Go Struct: Name=%s, Email=%s\n\", u.Name, u.Email)\n}",
        "quiz": {
                "question": "Mengapa parameter kedua pada `json.Unmarshal(data, &v)` wajib diberikan tanda pointer (`&`)?",
                "options": [
                        "Agar `json.Unmarshal` dapat mengubah isi nilai variabel target secara langsung di alokasi memorinya",
                        "Agar program tidak kekurangan RAM",
                        "Hanya sebagai hiasan sintaks",
                        "Agar kode terkompilasi ke bahasa C"
                ],
                "correctIndex": 0,
                "explanation": "Pointer (`&`) diperlukan agar fungsi `Unmarshal` dapat memutasi data variabel target secara langsung."
        }
},
{
        "id": 123,
        "category": "Domain 9: Golang JSON",
        "timestamp": "00:22:07",
        "title": "JSON Array & Slices Mapping",
        "desc": "Pengolahan data JSON Array ([...]) ke/dari Go Slices ([]T).",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>JSON Array Mapping</h3>\n            <pre>jsonArray := `[\"Java\", \"Go\", \"Python\"]`\nvar languages []string\njson.Unmarshal([]byte(jsonArray), &languages)</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\nfunc main() {\n\tjsonArr := `[{\"Name\":\"Eko\"},{\"Name\":\"Budi\"}]`\n\t\n\ttype Person struct { Name string }\n\tvar people []Person\n\n\tjson.Unmarshal([]byte(jsonArr), &people)\n\tfmt.Println(\"Total Data Decoded:\", len(people))\n\tfor i, p := range people {\n\t\tfmt.Printf(\"Person %d: %s\n\", i+1, p.Name)\n\t}\n}",
        "quiz": {
                "question": "Tipe data Go yang paling tepat dipetakan dengan elemen JSON Array (`[...]`)?",
                "options": [
                        "Slice ([]T)",
                        "Int",
                        "String",
                        "Bool"
                ],
                "correctIndex": 0,
                "explanation": "JSON Array dipetakan langsung ke tipe data Slice di Go."
        }
},
{
        "id": 124,
        "category": "Domain 9: Golang JSON",
        "timestamp": "00:34:01",
        "title": "Custom JSON Tags (json:\"name,omitempty\")",
        "desc": "Kustomisasi nama key JSON, mengabaikan field (json:\"-\"), dan opsi omitempty.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Tag Struct JSON</h3>\n            <pre>type Product struct {\n    ID    string `json:\"id\"`                 // Ubah key ke \"id\"\n    Name  string `json:\"product_name\"`       // Ubah key ke \"product_name\"\n    Price int    `json:\"price,omitempty\"`    // Sembunyikan jika 0\n    Secret string `json:\"-\"`                 // Selalu abaikan field ini\n}</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\ntype Customer struct {\n\tFullName string `json:\"full_name\"`\n\tDiscount int    `json:\"discount,omitempty\"`\n\tPassword string `json:\"-\"`\n}\n\nfunc main() {\n\tc := Customer{FullName: \"Budi Santoso\", Password: \"supersecretpassword\"}\n\tjsonBytes, _ := json.Marshal(c)\n\n\tfmt.Println(\"Output JSON dengan Tag Kustom:\")\n\tfmt.Println(string(jsonBytes))\n}",
        "quiz": {
                "question": "Opsi tag JSON apa yang digunakan untuk menyembunyikan field jika nilainya kosong (zero-value / empty)?",
                "options": [
                        "omitempty",
                        "ignoreempty",
                        "hidden",
                        "noexport"
                ],
                "correctIndex": 0,
                "explanation": "Tag `,omitempty` menyembunyikan field jika nilainya adalah zero-value (seperti `\"\"`, `0`, `false`, `nil`)."
        }
},
{
        "id": 125,
        "category": "Domain 9: Golang JSON",
        "timestamp": "00:41:19",
        "title": "Dynamic JSON Mapping dengan map[string]interface{}",
        "desc": "Menangani skema data JSON fleksibel tanpa membuat Struct khusus.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Dynamic JSON dengan Map</h3>\n            <p>Jika struktur JSON tidak pasti atau berubah-ubah, kita bisa menggunakan <code>map[string]interface{}</code>:</p>\n            <pre>var result map[string]interface{}\njson.Unmarshal(jsonBytes, &result)</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\nfunc main() {\n\tjsonStr := `{\"title\":\"Go Dynamic\",\"stats\":{\"views\":1500,\"likes\":200}}`\n\t\n\tvar data map[string]interface{}\n\tjson.Unmarshal([]byte(jsonStr), &data)\n\n\tfmt.Println(\"Title:\", data[\"title\"])\n\tstats := data[\"stats\"].(map[string]interface{})\n\tfmt.Println(\"Views:\", stats[\"views\"])\n}",
        "quiz": {
                "question": "Tipe data Go yang paling cocok menampung data JSON dengan struktur field yang dinamis dan berubah-ubah?",
                "options": [
                        "map[string]interface{}",
                        "[]string",
                        "int64",
                        "struct{}"
                ],
                "correctIndex": 0,
                "explanation": "`map[string]interface{}` (atau `map[string]any`) menampung sebarang key dan value dinamis."
        }
},
{
        "id": 126,
        "category": "Domain 9: Golang JSON",
        "timestamp": "00:46:57",
        "title": "Streaming JSON Decoder (json.NewDecoder)",
        "desc": "Membaca dan memproses JSON langsung dari Stream (io.Reader / HTTP Body).",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>json.NewDecoder</h3>\n            <pre>decoder := json.NewDecoder(r.Body)\nvar user User\nerr := decoder.Decode(&user)</pre>\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">🚀 Keunggulan Stream:</div>\n                <p>Lebih hemat memori daripada membaca seluruh body ke <code>[]byte</code> via <code>io.ReadAll</code> lalu memanggil <code>json.Unmarshal</code>.</p>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"strings\"\n)\n\ntype Event struct {\n\tName string\n}\n\nfunc main() {\n\treader := strings.NewReader(`{\"Name\":\"Go Workshop 2026\"}`)\n\tdecoder := json.NewDecoder(reader)\n\n\tvar ev Event\n\tdecoder.Decode(&ev)\n\n\tfmt.Println(\"Decoded Event Name via Stream Decoder:\", ev.Name)\n}",
        "quiz": {
                "question": "Mengapa `json.NewDecoder` lebih direkomendasikan saat membaca data JSON dari HTTP Request Body dibanding `json.Unmarshal`?",
                "options": [
                        "Karena dapat membaca data langsung dari stream `io.Reader` tanpa perlu mengalokasikan buffer byte tambahan di memori",
                        "Karena hanya bekerja di Windows",
                        "Karena mengunci file",
                        "Karena otomatis menghapus virus"
                ],
                "correctIndex": 0,
                "explanation": "`json.NewDecoder` membaca stream secara bertahap sehingga jauh lebih hemat alokasi memori RAM."
        }
},
{
        "id": 127,
        "category": "Domain 9: Golang JSON",
        "timestamp": "00:52:35",
        "title": "Streaming JSON Encoder (json.NewEncoder)",
        "desc": "Menulis data JSON langsung ke Stream output (io.Writer / ResponseWriter).",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>json.NewEncoder</h3>\n            <pre>encoder := json.NewEncoder(w)\nencoder.Encode(responseData)</pre>\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">🏆 Praktik Terbaik REST API:</div>\n                <p>Di dalam HTTP handler, langsung teruskan <code>http.ResponseWriter</code> ke <code>json.NewEncoder(w).Encode(data)</code>.</p>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"bytes\"\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\ntype Response struct {\n\tStatus string `json:\"status\"`\n\tCode   int    `json:\"code\"`\n}\n\nfunc main() {\n\tvar buf bytes.Buffer\n\tencoder := json.NewEncoder(&buf)\n\n\tres := Response{Status: \"SUCCESS\", Code: 200}\n\tencoder.Encode(res)\n\n\tfmt.Println(\"==================================================\")\n\tfmt.Println(\" SELAMAT! ANDA TELAH MENYELESAIKAN 161 BAB GOLANG \")\n\tfmt.Println(\"==================================================\")\n\tfmt.Println(\"Hasil Encoder Stream Output:\")\n\tfmt.Print(buf.String())\n}",
        "quiz": {
                "question": "Method dari `json.Encoder` yang digunakan untuk menuliskan data Go sebagai JSON stream langsung ke `io.Writer`?",
                "options": [
                        "encoder.Encode(v)",
                        "encoder.Write(v)",
                        "encoder.Flush(v)",
                        "encoder.Send(v)"
                ],
                "correctIndex": 0,
                "explanation": "`encoder.Encode(v)` secara efisien melakukan marsalling dan menuliskan byte ke target `io.Writer`."
        }
},
{
        "id": 128,
        "category": "Domain 10: Golang Logging",
        "timestamp": "00:01:15",
        "title": "Pengenalan Logging & Package Logrus",
        "desc": "Memahami pentingnya logging terstruktur pada aplikasi Go serta pengenalan library Sirupsen Logrus.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Apa itu Logging?</h3>\n            <p><strong>Logging</strong> adalah proses mencatat informasi penting mengenai kejadian (*events*) yang terjadi saat aplikasi sedang berjalan (*runtime*). Logging sangat vital untuk debugging, pemantauan sistem (monitoring), audit keamanan, dan analisa error di lingkungan produksi.</p>\n            \n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Mengapa Memakai Library External (Logrus)?</div>\n                <p>Package bawaan Go <code>log</code> sangat sederhana dan tidak mendukung fitur modern seperti level severity (Debug, Info, Error), format JSON terstruktur, serta metadata kontekstual (field). Oleh karena itu, <strong>Sirupsen Logrus</strong> menjadi salah satu library logging terpopuler di ekosistem Go.</p>\n            </div>\n\n            <h3>Keunggulan Sirupsen Logrus:</h3>\n            <ul>\n                <li><strong>Structured Logging:</strong> Mendukung format JSON out-of-the-box.</li>\n                <li><strong>Log Severity Levels:</strong> Trace, Debug, Info, Warn, Error, Fatal, Panic.</li>\n                <li><strong>Field Metadata:</strong> Menambahkan informasi dinamis key-value pada baris log.</li>\n                <li><strong>Extensible Hooks:</strong> Mengirim log otomatis ke platform lain (Slack, Elasticsearch, Sentry).</li>\n            </ul>\n\n            <h3>Instalasi Logrus:</h3>\n            <pre>go get github.com/sirupsen/logrus</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\n// Simulasi penggunaan Logrus di Go Playground\ntype Logger struct {\n\tName string\n}\n\nfunc (l *Logger) Info(msg string) {\n\tfmt.Printf(\"[INFO] %s: %s\\n\", l.Name, msg)\n}\n\nfunc main() {\n\tfmt.Println(\"=== DEMO GOLANG LOGGING ===\")\n\tlogger := &Logger{Name: \"AppLogger\"}\n\tlogger.Info(\"Aplikasi Golang berhasil diinisialisasi.\")\n\tlogger.Info(\"Logrus menyediakan fitur logging terstruktur modern.\")\n}",
        "quiz": {
                "question": "Mengapa penggunaan package `log` bawaan Go kurang ideal untuk aplikasi produksi skala besar?",
                "options": [
                        "Karena package `log` bawaan tidak mendukung level log dan format terstruktur seperti JSON",
                        "Karena package `log` bawaan sangat lambat",
                        "Karena package `log` tidak bisa mencetak string",
                        "Karena package `log` sudah dilarang oleh tim pengembang Go"
                ],
                "correctIndex": 0,
                "explanation": "Package `log` bawaan Go belum mendukung log level (Debug, Info, Warn, Error) serta format terstruktur JSON bawaan."
        }
},
{
        "id": 129,
        "category": "Domain 10: Golang Logging",
        "timestamp": "00:06:40",
        "title": "Level Logging (Trace, Debug, Info, Warn, Error, Fatal, Panic)",
        "desc": "Memahami 7 tingkatan severity log di Logrus dan mengaturnya dengan SetLevel.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Tingkatan Level Logging (Severity Levels)</h3>\n            <p>Log level membantu memfilter informasi pesan log sesuai dengan tingkat kedaruratannya. Logrus memiliki 7 tingkatan level:</p>\n            \n            <table class=\"tech-table\">\n                <thead>\n                    <tr><th>Level</th><th>Method</th><th>Penggunaan Utama</th></tr>\n                </thead>\n                <tbody>\n                    <tr><td><code>TraceLevel</code></td><td><code>log.Trace()</code></td><td>Informasi sangat detail/fine-grained untuk lacak pergerakan data.</td></tr>\n                    <tr><td><code>DebugLevel</code></td><td><code>log.Debug()</code></td><td>Pesan diagnostik pengembang saat proses development.</td></tr>\n                    <tr><td><code>InfoLevel</code></td><td><code>log.Info()</code></td><td>Informasi umum operasional aplikasi (misal: Server started, User logged in).</td></tr>\n                    <tr><td><code>WarnLevel</code></td><td><code>log.Warn()</code></td><td>Peringatan indikasi masalah non-kritis (misal: Memory usage 80%).</td></tr>\n                    <tr><td><code>ErrorLevel</code></td><td><code>log.Error()</code></td><td>Kegagalan fungsi tetapi aplikasi masih bisa terus berjalan.</td></tr>\n                    <tr><td><code>FatalLevel</code></td><td><code>log.Fatal()</code></td><td>Error fatal yang langsung menghentikan aplikasi (<code>os.Exit(1)</code>).</td></tr>\n                    <tr><td><code>PanicLevel</code></td><td><code>log.Panic()</code></td><td>Error kritis yang memicu mekanisme <code>panic()</code> Go.</td></tr>\n                </tbody>\n            </table>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Mengatur Level Log Minimum:</div>\n                <pre>log.SetLevel(log.WarnLevel) // Hanya Warn, Error, Fatal, & Panic yang dicetak</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\n// Simulasi Log Levels\nconst (\n\tLevelTrace = iota\n\tLevelDebug\n\tLevelInfo\n\tLevelWarn\n\tLevelError\n)\n\nfunc logMessage(level int, msg string) {\n\tlevels := []string{\"TRACE\", \"DEBUG\", \"INFO\", \"WARN\", \"ERROR\"}\n\tfmt.Printf(\"[%s] %s\\n\", levels[level], msg)\n}\n\nfunc main() {\n\tfmt.Println(\"=== DEMO LOG LEVELS ===\")\n\tlogMessage(LevelDebug, \"Menghitung query database...\")\n\tlogMessage(LevelInfo, \"User ID #102 berhasil melakukan checkout.\")\n\tlogMessage(LevelWarn, \"Koneksi Redis lambat (latency > 200ms).\")\n\tlogMessage(LevelError, \"Gagal mengirim email verifikasi ke user.\")\n}",
        "quiz": {
                "question": "Method log level di Logrus mana yang akan mencetak pesan error lalu secara otomatis memanggil `os.Exit(1)`?",
                "options": [
                        "log.Error()",
                        "log.Warn()",
                        "log.Fatal()",
                        "log.Trace()"
                ],
                "correctIndex": 2,
                "explanation": "`log.Fatal()` mencetak pesan log lalu menghentikan eksekusi aplikasi secara paksa dengan `os.Exit(1)`."
        }
},
{
        "id": 130,
        "category": "Domain 10: Golang Logging",
        "timestamp": "00:12:10",
        "title": "Output Logging (File & Multi-Writer)",
        "desc": "Mengarahkan log ke standar output, file fisik, atau multiple destination secara bersamaan.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Mengarahkan Target Output Logging</h3>\n            <p>Secara default, Logrus mencetak log ke <code>os.Stdout</code> (terminal). Namun di produksi, kita sering perlu menyimpan log ke file fisik atau mengirimnya ke terminal dan file sekaligus.</p>\n\n            <h3>Mencetak Log ke File:</h3>\n            <pre>file, err := os.OpenFile(\"application.log\", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)\nif err == nil {\n    log.SetOutput(file)\n}</pre>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Menggunakan io.MultiWriter:</div>\n                <p>Jika ingin mencetak ke terminal <strong>DAN</strong> menyimpan ke file secara simultan, gunakan <code>io.MultiWriter</code>:</p>\n                <pre>multiWriter := io.MultiWriter(os.Stdout, file)\nlog.SetOutput(multiWriter)</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"bytes\"\n\t\"fmt\"\n\t\"io\"\n\t\"os\"\n)\n\nfunc main() {\n\tvar buf bytes.Buffer\n\t// MultiWriter menggabungkan os.Stdout dan in-memory buffer\n\twriter := io.MultiWriter(os.Stdout, &buf)\n\n\tfmt.Fprintln(writer, \"[INFO] Log ini dicetak ke console DAN disimpan ke buffer/file.\")\n\n\tfmt.Println(\"\\n--- Isi Buffer yang Tersimpan ---\")\n\tfmt.Print(buf.String())\n}",
        "quiz": {
                "question": "Fungsi dari standard library Go yang digunakan untuk menulis output log ke beberapa destinasi sekaligus (misal stdout dan file) adalah?",
                "options": [
                        "io.MultiWriter",
                        "os.MultiFile",
                        "log.CombineOutput",
                        "bytes.JoinWriter"
                ],
                "correctIndex": 0,
                "explanation": "`io.MultiWriter` menerima daftar `io.Writer` dan menduplikasi setiap operasi penulisan ke semua target pengenalan."
        }
},
{
        "id": 131,
        "category": "Domain 10: Golang Logging",
        "timestamp": "00:18:25",
        "title": "Log Formatter (TextFormatter vs JSONFormatter)",
        "desc": "Mengubah format tampilan log dari Plain Text berwarna menjadi JSON terstruktur.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Format Output Log</h3>\n            <p>Formatter menentukan bagaimana data log disajikan. Logrus menyediakan dua formatter bawaan yang sangat fleksibel:</p>\n            \n            <ul>\n                <li><strong>TextFormatter:</strong> Format teks biasa berwarna yang cocok dipandang mata di terminal saat pengembangan local.</li>\n                <li><strong>JSONFormatter:</strong> Format JSON terstruktur yang ideal dikonsumsi oleh log aggregator seperti ElasticSearch/Kibana, Datadog, atau Loki.</li>\n            </ul>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Cara Mengubah Formatter:</div>\n                <pre>// Mengubah ke JSON\nlog.SetFormatter(&log.JSONFormatter{})\n\n// Kustomisasi Text Formatter\nlog.SetFormatter(&log.TextFormatter{\n    FullTimestamp: true,\n})</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"time\"\n)\n\ntype LogEntry struct {\n\tLevel     string    `json:\"level\"`\n\tMessage   string    `json:\"msg\"`\n\tTimestamp time.Time `json:\"time\"`\n}\n\nfunc main() {\n\tentry := LogEntry{\n\t\tLevel:     \"info\",\n\t\tMessage:   \"User order #9921 berhasil dibuat\",\n\t\tTimestamp: time.Now(),\n\t}\n\n\tjsonLog, _ := json.MarshalIndent(entry, \"\", \"  \")\n\tfmt.Println(\"=== DEMO JSON FORMATTER ===\")\n\tfmt.Println(string(jsonLog))\n}",
        "quiz": {
                "question": "Formatter Logrus manakah yang disarankan untuk lingkungan produksi agar log mudah diproses oleh log manager seperti Elasticsearch?",
                "options": [
                        "log.JSONFormatter",
                        "log.TextFormatter",
                        "log.XMLFormatter",
                        "log.CSVFormatter"
                ],
                "correctIndex": 0,
                "explanation": "`JSONFormatter` mengubah log menjadi format JSON yang standar dan mudah diparse oleh tools log management modern."
        }
},
{
        "id": 132,
        "category": "Domain 10: Golang Logging",
        "timestamp": "00:25:00",
        "title": "Fields & Entry (Contextual Logging dengan WithField/WithFields)",
        "desc": "Menambahkan metadata kontekstual berbentuk key-value pair pada setiap baris pesan log.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Contextual Logging dengan Fields</h3>\n            <p>Pesan log yang baik tidak hanya berisi teks mentah seperti <i>\"Payment failed\"</i>, tetapi juga menyertakan konteks seperti <code>user_id</code>, <code>amount</code>, dan <code>payment_method</code>.</p>\n            \n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Penggunaan WithField & WithFields:</div>\n                <pre>// Tunggal: WithField\nlog.WithField(\"user\", \"eko\").Info(\"User login\")\n\n// Jamak: WithFields\nlog.WithFields(log.Fields{\n    \"username\": \"eko\",\n    \"ip\":       \"192.168.1.100\",\n    \"status\":   \"success\",\n}).Info(\"User authentication successful\")</pre>\n            </div>\n\n            <p>Penggunaan <code>WithFields</code> mengembalikan sebuah <code>*log.Entry</code> yang dapat disimpan dan dipakai berulang kali (*reusable context*).</p>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype Fields map[string]interface{}\n\nfunc LogWithFields(fields Fields, msg string) {\n\tfmt.Printf(\"[INFO] %s | Context: \", msg)\n\tfor k, v := in fields { // simulasi print fields\n\t\tfmt.Printf(\"%s=%v \", k, v)\n\t}\n\tfmt.Println()\n}\n\nfunc main() {\n\tfmt.Println(\"=== DEMO CONTEXTUAL LOGGING ===\")\n\tctxFields := Fields{\n\t\t\"user_id\": 1001,\n\t\t\"email\":   \"eko@example.com\",\n\t\t\"role\":    \"admin\",\n\t}\n\n\tLogWithFields(ctxFields, \"Proses pembaharuan profil berhasil\")\n}",
        "quiz": {
                "question": "Tipe data apa yang digunakan oleh Logrus untuk menampung banyak metadata pada method `log.WithFields(...)`?",
                "options": [
                        "log.Fields yang merupakan type alias dari map[string]interface{}",
                        "[]string",
                        "map[int]string",
                        "struct log.Context"
                ],
                "correctIndex": 0,
                "explanation": "`log.Fields` pada Logrus didefinisikan sebagai `map[string]interface{}` untuk menyimpan pasangan key-value bebas."
        }
},
{
        "id": 133,
        "category": "Domain 10: Golang Logging",
        "timestamp": "00:31:40",
        "title": "Logger Singleton vs Instance Kustom",
        "desc": "Membuat instance logger terisolasi (`log.New()`) untuk mencegah efek samping global state.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Singleton vs Custom Logger Instance</h3>\n            <p>Secara bawaan, memanggil <code>log.Info()</code> menggunakan instance <strong>Global Singleton</strong> milik Logrus. Namun pada aplikasi besar, disarankan membuat <strong>Custom Logger Instance</strong> terpisah untuk tiap modul.</p>\n\n            <div class=\"callout callout-warning\">\n                <div class=\"callout-title\">⚠️ Bahaya Global Singleton Logger:</div>\n                <p>Mengubah konfigurasi logger global (seperti `SetLevel` atau `SetFormatter`) di satu paket dapat memengaruhi seluruh paket lain di dalam aplikasi Go Anda secara tidak sengaja.</p>\n            </div>\n\n            <h3>Membuat Instance Logger Kustom:</h3>\n            <pre>logger := log.New()\nlogger.SetLevel(log.DebugLevel)\nlogger.SetFormatter(&log.JSONFormatter{})\nlogger.SetOutput(os.Stdout)</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype CustomLogger struct {\n\tPrefix string\n}\n\nfunc NewLogger(prefix string) *CustomLogger {\n\treturn &CustomLogger{Prefix: prefix}\n}\n\nfunc (l *CustomLogger) Log(msg string) {\n\tfmt.Printf(\"[%s] %s\\n\", l.Prefix, msg)\n}\n\nfunc main() {\n\tdbLogger := NewLogger(\"DATABASE\")\n\tauthLogger := NewLogger(\"AUTH_SERVICE\")\n\n\tdbLogger.Log(\"Connected to MySQL on port 3306\")\n\tauthLogger.Log(\"Token JWT validated for user #5\")\n}",
        "quiz": {
                "question": "Fungsi Logrus apa yang digunakan untuk membuat instance Logger baru yang mandiri tanpa mengganggu logger global?",
                "options": [
                        "log.New()",
                        "log.Create()",
                        "log.Init()",
                        "log.Make()"
                ],
                "correctIndex": 0,
                "explanation": "`log.New()` mengembalikan pointer instance `*log.Logger` baru yang konfigurasi level dan formatter-nya terpisah dari default global logger."
        }
},
{
        "id": 134,
        "category": "Domain 10: Golang Logging",
        "timestamp": "00:37:50",
        "title": "Logrus Hook (Mengirim Log ke System External)",
        "desc": "Mekanisme interceptor pesan log untuk dikirimkan secara otomatis ke Slack, Sentry, atau Message Broker.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Mengenal Logrus Hook</h3>\n            <p><strong>Hook</strong> di Logrus adalah mekanisme plugin yang mengeksekusi logika tambahan setiap kali event log dibuat sesuai dengan level tertentu. Hook sangat berguna untuk mendeteksi error dan mengirim notifikasi secara instant.</p>\n\n            <h3>Syarat Membuat Custom Hook:</h3>\n            <p>Sebuah struct harus mengimplementasikan interface <code>log.Hook</code> yang memiliki 2 method wajib:</p>\n            <pre>type Hook interface {\n    Levels() []Level       // Menentukan level log mana saja yang memicu hook\n    Fire(*Entry) error     // Logika eksekusi ketika hook dipicu\n}</pre>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Menambahkan Hook ke Logger:</div>\n                <pre>log.AddHook(&SampleHook{})</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\n// Simulasi Hook Interceptor\ntype SampleHook struct{}\n\nfunc (h *SampleHook) Fire(level string, msg string) {\n\tif level == \"ERROR\" {\n\t\tfmt.Printf(\"🔔 HOOK ALERT: Mengirim notifikasi Slack untuk error: '%s'\\n\", msg)\n\t}\n}\n\nfunc main() {\n\thook := &SampleHook{}\n\tfmt.Println(\"=== DEMO LOGRUS HOOK ===\")\n\t\n\t// Simulasi pembuatan log\n\thook.Fire(\"INFO\", \"Normal operation\")\n\thook.Fire(\"ERROR\", \"Database connection timeout!\")\n}",
        "quiz": {
                "question": "Dua method wajib yang harus diimplementasikan oleh sebuah struct agar memenuhi interface `logrus.Hook` adalah?",
                "options": [
                        "Levels() []Level dan Fire(*Entry) error",
                        "Start() dan Stop()",
                        "Execute() dan Format()",
                        "Init() dan Send()"
                ],
                "correctIndex": 0,
                "explanation": "Interface `Hook` mewajibkan method `Levels()` untuk filter severity level dan `Fire(*Entry)` untuk menjalankan tindakan penanganan log."
        }
},
{
        "id": 135,
        "category": "Domain 10: Golang Logging",
        "timestamp": "00:44:15",
        "title": "Standard Library log/slog (Structured Logging Bawaan Go 1.21+)",
        "desc": "Mengenal package `log/slog` bawaan Go 1.21+ sebagai standar resmi logging terstruktur.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Standard Library log/slog</h3>\n            <p>Sejak <strong>Go 1.21</strong>, Go menambahkan package official baru bernama <code>log/slog</code> ke dalam Standard Library. Paket ini menghadirkan fitur <i>structured logging</i> bawaan tanpa tergantung library pihak ketiga seperti Logrus atau Zap.</p>\n\n            <h3>Fitur Utama log/slog:</h3>\n            <ul>\n                <li><strong>Handler Architecture:</strong> Mendukung <code>TextHandler</code> dan <code>JSONHandler</code>.</li>\n                <li><strong>Attribute Key-Value:</strong> Menggunakan <code>slog.String()</code>, <code>slog.Int()</code>, <code>slog.Group()</code> untuk performa tinggi tanpa alokasi memori berlebih.</li>\n                <li><strong>Zero Dependency:</strong> Bagian dari standar instalasi Go 1.21+.</li>\n            </ul>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Contoh Penggunaan slog:</div>\n                <pre>import \"log/slog\"\n\nslog.Info(\"User registered\", \"id\", 42, \"role\", \"user\")\nslog.Error(\"Failed to save\", slog.String(\"reason\", \"db timeout\"))</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\n// Simulasi perilaku slog di Go 1.21+\nfunc SlogInfo(msg string, args ...interface{}) {\n\tfmt.Printf(\"[slog INFO] %s \", msg)\n\tfor i := 0; i < len(args); i += 2 {\n\t\tfmt.Printf(\"%v=%v \", args[i], args[i+1])\n\t}\n\tfmt.Println()\n}\n\nfunc main() {\n\tfmt.Println(\"=== DEMO LOG/SLOG (GO 1.21+) ===\")\n\tSlogInfo(\"Proses Transaksi Selesai\", \"trx_id\", \"TRX-9011\", \"total\", 150000)\n}",
        "quiz": {
                "question": "Sejak versi Go berapakah package structured logging bawaan `log/slog` resmi diperkenalkan ke Standard Library?",
                "options": [
                        "Go 1.18",
                        "Go 1.20",
                        "Go 1.21",
                        "Go 1.22"
                ],
                "correctIndex": 2,
                "explanation": "Package `log/slog` ditambahkan secara resmi pada rilis Go versi 1.21 untuk standarisasi structured logging."
        }
},
{
        "id": 136,
        "category": "Domain 11: Golang Embed",
        "timestamp": "00:01:59",
        "title": "Pengenalan Package Embed & Directive //go:embed",
        "desc": "Fitur bawaan Go 1.16+ untuk mengemas file statis (HTML, CSS, SQL, Config) langsung ke dalam binary executable.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Apa itu Golang Embed?</h3>\n            <p>Sejak <strong>Go 1.16</strong>, Go menyediakan package bawaan bernama <code>embed</code> dan compiler directive <code>//go:embed</code>. Fitur ini memungkinkan kita untuk mengemas file atau folder fisik ke dalam binary file executable Go secara otomatis pada saat proses kompilasi.</p>\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Keuntungan Utama Go Embed:</div>\n                <ul>\n                    <li><strong>Single Binary Deployment:</strong> Aplikasi dan file statisnya (HTML, CSS, gambar, SQL script) dikemas dalam 1 file binary.</li>\n                    <li><strong>Tanpa File Dependency:</strong> Tidak perlu khawatir file hilang atau path salah saat aplikasi di-deploy ke server.</li>\n                    <li><strong>Performa Tinggi:</strong> File dibaca langsung dari memori tanpa pembacaan disk I/O berulang pada runtime.</li>\n                </ul>\n            </div>\n            <h3>Aturan Sintaks Directive //go:embed:</h3>\n            <pre>import _ \"embed\" // Wajib import jika variabel bertipe string/[]byte\n\n//go:embed version.txt\nvar version string</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t_ \"embed\"\n\t\"fmt\"\n)\n\n// Contoh penggunaan directive embed untuk variabel string\n// (Pada simulasi ini kita deklarasikan nilai string langsung)\nvar version = \"v1.5.0-production\"\n\nfunc main() {\n\tfmt.Println(\"=== GOLANG EMBED DEMO ===\")\n\tfmt.Println(\"Versi Aplikasi (embedded):\", version)\n\tfmt.Println(\"Keuntungan: File terkemas langsung di dalam biner Go!\")\n}",
        "quiz": {
                "question": "Sejak Go versi berapa package `embed` resmi diperkenalkan?",
                "options": [
                        "Go 1.12",
                        "Go 1.16",
                        "Go 1.18",
                        "Go 1.20"
                ],
                "correctIndex": 1,
                "explanation": "Package `embed` dan directive `//go:embed` diperkenalkan secara resmi pada Go versi 1.16."
        }
},
{
        "id": 137,
        "category": "Domain 11: Golang Embed",
        "timestamp": "00:05:54",
        "title": "Embed File ke Variable String",
        "desc": "Membaca isi file teks tunggal langsung ke dalam variabel bertipe string.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Embed File ke Variable String</h3>\n            <p>Jika file yang di-embed merupakan file teks (seperti <code>.txt</code>, <code>.json</code>, <code>.html</code>, atau <code>.sql</code>), kita bisa mendeklarasikan variabel berjenis <code>string</code> langsung tepat di bawah directive <code>//go:embed</code>.</p>\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Contoh Kode Asli Go:</div>\n                <pre>package main\n\nimport (\n    _ \"embed\"\n    \"fmt\"\n)\n\n//go:embed secret.txt\nvar secretMessage string\n\nfunc main() {\n    fmt.Println(\"Pesan Rahasia:\", secretMessage)\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t// Simulasi variabel yang di-embed dari file secret.txt\n\tvar secretMessage = \"Go-Embed-String-Content-12345\"\n\t\n\tfmt.Println(\"=== EMBED STRING ===\")\n\tfmt.Println(\"Isi File:\", secretMessage)\n\tfmt.Println(\"Panjang karakter:\", len(secretMessage))\n}",
        "quiz": {
                "question": "Tipe data variabel Go apa yang paling tepat jika kita meng-embed file teks pendek yang langsung dibaca sebagai tulisan?",
                "options": [
                        "string",
                        "int",
                        "bool",
                        "chan string"
                ],
                "correctIndex": 0,
                "explanation": "Tipe `string` langsung mengonversi isi file teks menjadi string yang siap dipakai."
        }
},
{
        "id": 138,
        "category": "Domain 11: Golang Embed",
        "timestamp": "00:11:15",
        "title": "Embed File ke Variable Byte Slice ([]byte)",
        "desc": "Meng-embed file biner (gambar, gambar PNG, audio, PDF) ke dalam variabel slice of bytes.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Embed File ke Byte Slice ([]byte)</h3>\n            <p>Untuk file non-teks atau biner seperti gambar (<code>.png</code>, <code>.jpg</code>), file audio, atau dokumen PDF, tipe data yang paling tepat adalah <code>[]byte</code>.</p>\n            <div class=\"callout callout-warning\">\n                <div class=\"callout-title\">⚠️ Mengapa []byte?</div>\n                <p>String di Go imutabel dan berasumsi UTF-8. Tipe <code>[]byte</code> mempertahankan data mentah biner tanpa alokasi memori tambahan atau konversi karakter.</p>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t// Simulasi data biner gambar yang di-embed ke []byte\n\tvar logoBytes = []byte{0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A}\n\t\n\tfmt.Println(\"=== EMBED BYTE SLICE ===\")\n\tfmt.Printf(\"Header PNG Bytes: %X\n\", logoBytes)\n\tfmt.Println(\"Ukuran Byte:\", len(logoBytes), \"bytes\")\n}",
        "quiz": {
                "question": "Mengapa tipe `[]byte` lebih disarankan daripada `string` untuk meng-embed file biner seperti gambar?",
                "options": [
                        "Karena `[]byte` mempertahankan data mentah biner tanpa masalah enkoding karakter",
                        "Karena `[]byte` hanya bisa menampung 1 byte",
                        "Karena string tidak bisa di-embed di Go",
                        "Karena `[]byte` otomatis mengompresi gambar"
                ],
                "correctIndex": 0,
                "explanation": "`[]byte` mempertahankan representasi biner mentah (raw bytes) tanpa risiko manipulasi karakter UTF-8."
        }
},
{
        "id": 139,
        "category": "Domain 11: Golang Embed",
        "timestamp": "00:15:43",
        "title": "Embed Multiple Files dengan embed.FS",
        "desc": "Meng-embed banyak file sekaligus ke dalam struktur Virtual File System menggunakan tipe embed.FS.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Tipe embed.FS (File System)</h3>\n            <p>Saat kita butuh meng-embed banyak file sekaligus (seperti seluruh isi folder <code>files/</code> atau <code>templates/</code>), kita menggunakan tipe <code>embed.FS</code>.</p>\n            <pre>import \"embed\"\n\n//go:embed files/*.txt\nvar files embed.FS</pre>\n            <p>Kita dapat membaca isi file dengan method <code>files.ReadFile(\"path/file.txt\")</code> atau <code>files.ReadDir(\"path\")</code>.</p>\n        </div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t// Simulasi pembacaan virtual file system embed.FS\n\tmockFS := map[string]string{\n\t\t\"files/a.txt\": \"Isi File A\",\n\t\t\"files/b.txt\": \"Isi File B\",\n\t}\n\n\tfmt.Println(\"=== EMBED MULTIPLE FILES (embed.FS) ===\")\n\tfor path, content := range mockFS {\n\t\tfmt.Printf(\"File: %s -> Content: %s\n\", path, content)\n\t}\n}",
        "quiz": {
                "question": "Method apa pada `embed.FS` yang digunakan untuk membaca isi file tertentu berdasarkan path-nya?",
                "options": [
                        "ReadFile(name)",
                        "GetFile(name)",
                        "OpenText(name)",
                        "DownloadFile(name)"
                ],
                "correctIndex": 0,
                "explanation": "Method `ReadFile(name string) ([]byte, error)` digunakan untuk membaca isi file pada `embed.FS`."
        }
},
{
        "id": 140,
        "category": "Domain 11: Golang Embed",
        "timestamp": "00:20:58",
        "title": "Path Matcher & Wildcard Pattern pada //go:embed",
        "desc": "Aturan matching pola pencocokan direktori dan perilaku pencarian file tersembunyi.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Pola Matching pada //go:embed</h3>\n            <ul>\n                <li><code>//go:embed files/*.txt</code>: Meng-embed semua file ekstensi .txt di folder files.</li>\n                <li><code>//go:embed files</code>: Meng-embed seluruh direktori files beserta sub-folder di dalamnya.</li>\n            </ul>\n            <div class=\"callout callout-warning\">\n                <div class=\"callout-title\">⚠️ Aturan Dot Files (File Tersembunyi):</div>\n                <p>Secara default, wildcard (<code>*</code>) di <code>//go:embed</code> <strong>TIDAK</strong> meng-embed file yang diawali titik (<code>.</code>) atau garis bawah (<code>_</code>) kecuali disebutkan secara eksplisit.</p>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"=== PATH MATCHER ATURAN ===\")\n\tfmt.Println(\"1. //go:embed path/* -> cocok dengan semua file di folder\")\n\tfmt.Println(\"2. File .env atau .gitignore diabaikan oleh '*' kecuali ditulis //go:embed path/.env\")\n}",
        "quiz": {
                "question": "Karakter awal nama file apa yang secara default diabaikan saat menggunakan wildcard (*) pada `//go:embed`?",
                "options": [
                        "Titik (.) dan Garis Bawah (_)",
                        "Huruf Kapital (A-Z)",
                        "Angka (0-9)",
                        "Tanda strip (-)"
                ],
                "correctIndex": 0,
                "explanation": "Wildcard di `//go:embed` secara default mengabaikan file tersembunyi yang diawali titik (.) atau garis bawah (_)."
        }
},
{
        "id": 141,
        "category": "Domain 11: Golang Embed",
        "timestamp": "00:28:19",
        "title": "Hasil Embed pada Process Compile & Single Binary Deployment",
        "desc": "Mekanisme penggabungan aset fisik menjadi executable tunggal dan keuntungannya di server produksi.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Single Binary Executable</h3>\n            <p>Saat menjalankan perintah <code>go build</code>, Go compiler mengambil file fisik dari disk dan memasukkannya langsung ke bagian segmen data binary executable.</p>\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">🚀 Keuntungan Deployment:</div>\n                <p>Aplikasi web Go (HTML template + CSS + JS) dapat di-copy ke server Linux dalam bentuk 1 file binary tunggal tanpa butuh folder <code>templates/</code> terpisah di server!</p>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"==========================================\")\n\tfmt.Println(\" SUCCESS: GOLANG EMBED MODULE COMPLETED! \")\n\tfmt.Println(\"==========================================\")\n\tfmt.Println(\"1. //go:embed string -> File teks\")\n\tfmt.Println(\"2. //go:embed []byte -> File biner\")\n\tfmt.Println(\"3. //go:embed embed.FS -> Multi-file/Folder\")\n}",
        "quiz": {
                "question": "Apa manfaat utama menyebarkan (deploy) biner Go yang telah memanfaatkan `//go:embed`?",
                "options": [
                        "Cukup menyalin 1 file executable tunggal tanpa harus ikut mengunggah folder aset fisik",
                        "Membuat ukuran file binary menjadi 0 KB",
                        "Menghilangkan kebutuhan akan koneksi internet",
                        "Meningkatkan RAM server secara otomatis"
                ],
                "correctIndex": 0,
                "explanation": "Seluruh aset fisik telah menyatu dalam single binary file, mempermudah deployment dan menghilangkan kerumitan manajemen path file."
        }
},
{
        "id": 142,
        "category": "Domain 12: Golang Viper Configuration",
        "timestamp": "00:01:15",
        "title": "Pengenalan Configuration Management & Package spf13/viper",
        "desc": "Memahami konsep 12-Factor App dalam memisahkan konfigurasi dari source code menggunakan library Viper.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Mengapa Membutuhkan Library Configuration Management?</h3>\n            <p>Prinsip <strong>12-Factor App</strong> mewajibkan konfigurasi (seperti credential database, port server, API key) dipisahkan dari source code aplikasi. Menulis ulang kode setiap kali pindah environment (Dev, Staging, Production) adalah praktek yang buruk.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Fitur Utama spf13/viper:</div>\n                <ul>\n                    <li>Mendukung file JSON, TOML, YAML, HCL, ENV, dan INI.</li>\n                    <li>Membaca nilai dari Environment Variables secara otomatis.</li>\n                    <li>Membaca dari Command-Line Flags (pflag).</li>\n                    <li>Live Reloading (hot reload) file konfigurasi saat aplikasi berjalan.</li>\n                </ul>\n            </div>\n\n            <h3>Instalasi Viper:</h3>\n            <pre>go get github.com/spf13/viper</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype Config struct {\n\tAppName string\n\tPort    int\n\tDebug   bool\n}\n\nfunc main() {\n\t// Simulasi pembacaan konfigurasi sederhana\n\tconfig := Config{\n\t\tAppName: \"Golang Microservice\",\n\t\tPort:    8080,\n\t\tDebug:   true,\n\t}\n\n\tfmt.Println(\"=== DEMO VIPER CONFIGURATION MANAGEMENT ===\")\n\tfmt.Printf(\"App Name : %s\\n\", config.AppName)\n\tfmt.Printf(\"App Port : %d\\n\", config.Port)\n\tfmt.Printf(\"Debug    : %t\\n\", config.Debug)\n}",
        "quiz": {
                "question": "Prinsip arsitektur aplikasi modern manakah yang mewajibkan pemisahan tegas antara konfigurasi dan kode program?",
                "options": [
                        "12-Factor App",
                        "SOLID Principle",
                        "Clean Architecture",
                        "DRY Principle"
                ],
                "correctIndex": 0,
                "explanation": "Metodologi 12-Factor App menyatakan bahwa konfigurasi harus disimpan di environment dan dipisah penuh dari kode."
        }
},
{
        "id": 143,
        "category": "Domain 12: Golang Viper Configuration",
        "timestamp": "00:08:40",
        "title": "Membaca File Konfigurasi (JSON, YAML, ENV file)",
        "desc": "Mengkonfigurasi Viper untuk menemukan dan membaca file konfigurasi dalam berbagai format.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Menentukan Lokasi & Format File Konfigurasi</h3>\n            <p>Viper fleksibel dalam membaca file. Kita perlu memberitahu Viper: nama file, tipe/format file, dan folder tempat file berada.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Kode Konfigurasi Viper:</div>\n                <pre>v := viper.New()\nv.SetConfigName(\"config\") // Nama file tanpa ekstensi (config.json / config.yaml)\nv.SetConfigType(\"json\")   // Format file\nv.AddConfigPath(\".\")      // Cari di direktori saat ini\nv.AddConfigPath(\"./config\") // Cari di folder ./config\n\nerr := v.ReadInConfig() // Eksekusi pembacaan\nif err != nil {\n    panic(fmt.Errorf(\"Fatal error config file: %w\", err))\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"strings\"\n)\n\n// Simulasi in-memory parser file YAML/JSON\nfunc MockReadConfig(fileContent string) map[string]string {\n\tresult := make(map[string]string)\n\tlines := strings.Split(fileContent, \"\\n\")\n\tfor _, line := range lines {\n\t\tparts := strings.Split(line, \"=\")\n\t\tif len(parts) == 2 {\n\t\t\tresult[strings.TrimSpace(parts[0])] = strings.TrimSpace(parts[1])\n\t\t}\n\t}\n\treturn result\n}\n\nfunc main() {\n\tmockEnvFile := `APP_NAME=PaymentService\nPORT=3000\nDATABASE_HOST=localhost`\n\n\tconfigData := MockReadConfig(mockEnvFile)\n\tfmt.Println(\"=== HASIL BACA CONFIG FILE ===\")\n\tfor k, v := range configData {\n\t\tfmt.Printf(\"%s => %s\\n\", k, v)\n\t}\n}",
        "quiz": {
                "question": "Fungsi Viper apakah yang digunakan untuk menambah direktori pencarian tempat file konfigurasi berada?",
                "options": [
                        "v.AddConfigPath(\"...\")",
                        "v.SetDirectory(\"...\")",
                        "v.SearchFolder(\"...\")",
                        "v.IncludePath(\"...\")"
                ],
                "correctIndex": 0,
                "explanation": "`v.AddConfigPath(path)` mendaftarkan direktori tempat Viper akan mencari file konfigurasi."
        }
},
{
        "id": 144,
        "category": "Domain 12: Golang Viper Configuration",
        "timestamp": "00:15:20",
        "title": "Mengambil Nilai Konfigurasi (GetString, GetInt, GetBool, GetStringSlice)",
        "desc": "Mengekstrak data dari Viper menggunakan tipe data yang aman (type-safe getters) dan memberikan nilai default.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Getter Methods pada Viper</h3>\n            <p>Setelah file terbaca, kita bisa mengambil nilai berdasarkan Key menggunakan fungsi sesuai tipe datanya.</p>\n\n            <table class=\"table-styled\">\n                <thead>\n                    <tr>\n                        <th>Method</th>\n                        <th>Return Type</th>\n                        <th>Contoh Penggunaan</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr>\n                        <td><code>GetString(key)</code></td>\n                        <td><code>string</code></td>\n                        <td><code>v.GetString(\"database.host\")</code></td>\n                    </tr>\n                    <tr>\n                        <td><code>GetInt(key)</code></td>\n                        <td><code>int</code></td>\n                        <td><code>v.GetInt(\"server.port\")</code></td>\n                    </tr>\n                    <tr>\n                        <td><code>GetBool(key)</code></td>\n                        <td><code>bool</code></td>\n                        <td><code>v.GetBool(\"app.debug\")</code></td>\n                    </tr>\n                    <tr>\n                        <td><code>GetStringSlice(key)</code></td>\n                        <td><code>[]string</code></td>\n                        <td><code>v.GetStringSlice(\"cors.allowed_origins\")</code></td>\n                    </tr>\n                </tbody>\n            </table>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Setting Default Value:</div>\n                <pre>v.SetDefault(\"server.port\", 8080)\nv.SetDefault(\"database.max_connection\", 10)</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype ConfigProvider struct {\n\tdata map[string]interface{}\n}\n\nfunc (c *ConfigProvider) GetString(key string) string {\n\tif val, ok := c.data[key]; ok {\n\t\treturn val.(string)\n\t}\n\treturn \"\"\n}\n\nfunc (c *ConfigProvider) GetInt(key string) int {\n\tif val, ok := c.data[key]; ok {\n\t\treturn val.(int)\n\t}\n\treturn 0\n}\n\nfunc main() {\n\tprovider := ConfigProvider{\n\t\tdata: map[string]interface{}{\n\t\t\t\"server.name\": \"E-Commerce Gateway\",\n\t\t\t\"server.port\": 9000,\n\t\t},\n\t}\n\n\tfmt.Println(\"=== VIPER TYPE-SAFE GETTERS DEMO ===\")\n\tfmt.Println(\"Server Name:\", provider.GetString(\"server.name\"))\n\tfmt.Println(\"Server Port:\", provider.GetInt(\"server.port\"))\n}",
        "quiz": {
                "question": "Jika suatu key tidak ditemukan pada file konfigurasi, namun kita telah memanggil `v.SetDefault(\"app.timeout\", 30)`, apakah nilai yang dikembalikan oleh `v.GetInt(\"app.timeout\")`?",
                "options": [
                        "30",
                        "0",
                        "nil",
                        "Error panic"
                ],
                "correctIndex": 0,
                "explanation": "Viper akan mengembalikan nilai default yang telah diset dengan `SetDefault()` jika key tidak ada di file."
        }
},
{
        "id": 145,
        "category": "Domain 12: Golang Viper Configuration",
        "timestamp": "00:22:00",
        "title": "Unmarshaling Config ke Struct (viper.Unmarshal)",
        "desc": "Mengubah seluruh isi objek Viper menjadi Go Struct yang strongly-typed menggunakan struct tag mapstructure.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Mapping Otomatis ke Struct</h3>\n            <p>Mengambil nilai satu-per-satu dengan `GetString` kurang efisien untuk proyek besar. Viper dapat memetakan seluruh hirarki konfigurasi ke Go Struct secara sekaligus menggunakan <code>v.Unmarshal(&configStruct)</code>.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Struct Tag `mapstructure`:</div>\n                <p>Viper menggunakan package <code>mapstructure</code> dibelakang layar. Gunakan tag <code>mapstructure:\"nama_key\"</code> pada struct field:</p>\n                <pre>type DatabaseConfig struct {\n    Host     string `mapstructure:\"host\"`\n    Port     int    `mapstructure:\"port\"`\n    Username string `mapstructure:\"username\"`\n}\n\ntype AppConfig struct {\n    AppName  string         `mapstructure:\"app_name\"`\n    Database DatabaseConfig `mapstructure:\"database\"`\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\ntype DatabaseConfig struct {\n\tHost string `json:\"host\"`\n\tPort int    `json:\"port\"`\n}\n\ntype AppConfig struct {\n\tName     string         `json:\"name\"`\n\tPort     int            `json:\"port\"`\n\tDatabase DatabaseConfig `json:\"database\"`\n}\n\nfunc main() {\n\trawJSON := `{\n\t\t\"name\": \"Inventory API\",\n\t\t\"port\": 8080,\n\t\t\"database\": {\n\t\t\t\"host\": \"127.0.0.1\",\n\t\t\t\"port\": 3306\n\t\t}\n\t}`\n\n\tvar config AppConfig\n\terr := json.Unmarshal([]byte(rawJSON), &config)\n\tif err != nil {\n\t\tfmt.Println(\"Unmarshal error:\", err)\n\t\treturn\n\t}\n\n\tfmt.Println(\"=== STRUCT UNMARSHAL CONFIG RESULT ===\")\n\tfmt.Printf(\"App Name : %s\\n\", config.Name)\n\tfmt.Printf(\"DB Host  : %s:%d\\n\", config.Database.Host, config.Database.Port)\n}",
        "quiz": {
                "question": "Struct tag apakah yang digunakan oleh Viper untuk memetakan key konfigurasi ke field dalam Go Struct?",
                "options": [
                        "mapstructure",
                        "json",
                        "viper",
                        "config"
                ],
                "correctIndex": 0,
                "explanation": "Viper memanfaatkan library `mapstructure`, sehingga tag yang digunakan adalah `mapstructure:\"key_name\"`."
        }
},
{
        "id": 146,
        "category": "Domain 12: Golang Viper Configuration",
        "timestamp": "00:29:40",
        "title": "Environment Variables Integration (AutomaticEnv, BindEnv, SetEnvPrefix)",
        "desc": "Membaca dan menimpa konfigurasi file menggunakan Environment Variable dari OS secara dinamis.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Overriding Konfigurasi via Environment Variables</h3>\n            <p>Di lingkungan produksi (seperti Docker atau Kubernetes), nilai konfigurasi rahasia dikirim via OS Environment Variables. Viper memiliki hierarki preseden di mana **Environment Variable akan menimpa (override) nilai dari File Config**.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Fungsi Penting ENV di Viper:</div>\n                <ul>\n                    <li><code>v.AutomaticEnv()</code>: Otomatis membaca ENV variable yang namanya cocok dengan key config.</li>\n                    <li><code>v.SetEnvPrefix(\"MYAPP\")</code>: Menambahkan prefix (misal `MYAPP_PORT`).</li>\n                    <li><code>v.SetEnvKeyReplacer(strings.NewReplacer(\".\", \"_\"))</code>: Mengubah titik pada key nested menjadi underscore (misal `DATABASE.HOST` -> `MYAPP_DATABASE_HOST`).</li>\n                </ul>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"strings\"\n)\n\n// Simulasi hierarki preseden Viper (ENV override File Config)\nfunc ResolveConfig(fileVal, envVal string) string {\n\tif strings.TrimSpace(envVal) != \"\" {\n\t\treturn envVal + \" (From OS Environment)\"\n\t}\n\treturn fileVal + \" (From File Config)\"\n}\n\nfunc main() {\n\tfileHost := \"localhost\"\n\tenvHost := \"production-db.internal\" // Diset di OS\n\n\tresolved := ResolveConfig(fileHost, envHost)\n\tfmt.Println(\"=== RESOLVED DB HOST ===\")\n\tfmt.Println(\"Host Used:\", resolved)\n}",
        "quiz": {
                "question": "Manakah urutan hierarki preseden (prioritas tertinggi ke terendah) saat Viper mengambil nilai konfigurasi?",
                "options": [
                        "Explicit Set -> CLI Flags -> Env Vars -> Config File -> Key Default",
                        "Config File -> Env Vars -> Key Default -> Explicit Set",
                        "Key Default -> Config File -> Env Vars -> CLI Flags",
                        "Env Vars -> Config File -> Explicit Set -> Key Default"
                ],
                "correctIndex": 0,
                "explanation": "Viper memprioritaskan `Set()` manual, diikuti Flag, Env Var, File Config, dan terakhir nilai Default."
        }
},
{
        "id": 147,
        "category": "Domain 12: Golang Viper Configuration",
        "timestamp": "00:37:10",
        "title": "Dynamic Config Watching & Hot Reload (viper.WatchConfig)",
        "desc": "Menerapkan fitur Live Reload untuk memperbarui nilai konfigurasi secara otomatis tanpa perlu restart server.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Fitur Hot Reload File Konfigurasi</h3>\n            <p>Viper mampu memantau perubahan file di sistem (menggunakan library `fsnotify`). Saat file config diubah dan disimpan, Viper akan otomatis membaca ulang tanpa menghentikan aplikasi (*zero downtime*).</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Mengaktifkan WatchConfig:</div>\n                <pre>v.WatchConfig()\nv.OnConfigChange(func(e fsnotify.Event) {\n    fmt.Println(\"Config file changed:\", e.Name)\n    // Re-unmarshal atau perbarui variabel global di sini\n    v.Unmarshal(&globalConfig)\n})</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\ntype DynamicConfig struct {\n\tmu           sync.RWMutex\n\tFeatureFlag  bool\n}\n\nfunc (c *DynamicConfig) UpdateFlag(val bool) {\n\tc.mu.Lock()\n\tdefer c.mu.Unlock()\n\tc.FeatureFlag = val\n\tfmt.Println(\"[EVENT] Config updated! FeatureFlag is now:\", val)\n}\n\nfunc (c *DynamicConfig) IsEnabled() bool {\n\tc.mu.RLock()\n\tdefer c.mu.RUnlock()\n\treturn c.FeatureFlag\n}\n\nfunc main() {\n\tcfg := &DynamicConfig{FeatureFlag: false}\n\tfmt.Println(\"Initial Feature Flag:\", cfg.IsEnabled())\n\n\t// Simulasi Hot Reload dari WatchConfig\n\tcfg.UpdateFlag(true)\n\tfmt.Println(\"After Hot Reload Feature Flag:\", cfg.IsEnabled())\n}",
        "quiz": {
                "question": "Fungsi callback apakah pada Viper yang dipanggil secara otomatis setiap kali terjadi perubahan pada file konfigurasi?",
                "options": [
                        "OnConfigChange",
                        "AfterConfigUpdate",
                        "WatchCallback",
                        "ReloadListener"
                ],
                "correctIndex": 0,
                "explanation": "`v.OnConfigChange(func(e fsnotify.Event){ ... })` adalah listener event saat file konfigurasi berhasil di-reload."
        }
},
{
        "id": 148,
        "category": "Domain 12: Golang Viper Configuration",
        "timestamp": "00:44:30",
        "title": "Command Line Flags Integration dengan Cobra/Pflag",
        "desc": "Mengintegrasikan argument CLI (flags) dengan Viper sehingga parameter terminal dapat meng-override file config.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Integrasi CLI Flag & Viper</h3>\n            <p>Saat membuat aplikasi CLI atau background worker di Go, pengguna sering kali menyuplai flag saat menjalankan perintah terminal (misal: <code>./app --port=9090</code>).</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Membind Pflag ke Viper:</div>\n                <pre>pflag.Int(\"port\", 8080, \"Port untuk HTTP Server\")\npflag.Parse()\n\nv.BindPFlags(pflag.CommandLine)\n// Nilai --port dari terminal akan otomatis meng-override port dari file config!</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc ParseCLIArgs(args []string) map[string]string {\n\tflags := make(map[string]string)\n\tfor _, arg := range args {\n\t\tif len(arg) > 2 && arg[:2] == \"--\" {\n\t\t\tparts := strings.Split(arg[2:], \"=\")\n\t\t\tif len(parts) == 2 {\n\t\t\t\tflags[parts[0]] = parts[1]\n\t\t\t}\n\t\t}\n\t}\n\treturn flags\n}\n\nfunc main() {\n\tmockCLI := []string{\"./main\", \"--port=9090\", \"--env=staging\"}\n\tflags := ParseCLIArgs(mockCLI)\n\n\tfmt.Println(\"=== PARSED CLI FLAGS ===\")\n\tfor k, v := range flags {\n\t\tfmt.Printf(\"Flag '--%s' => %s\\n\", k, v)\n\t}\n}",
        "quiz": {
                "question": "Library bawaan/external Go manakah yang biasa dikombinasikan dengan Viper untuk mengelola Command Line Flags?",
                "options": [
                        "spf13/pflag (atau cobra)",
                        "flag/standard",
                        "cli/args",
                        "terminal/flag"
                ],
                "correctIndex": 0,
                "explanation": "`spf13/pflag` dirancang oleh pembuat Viper sehingga mendukung integrasi seamless melalui `BindPFlags`."
        }
},
{
        "id": 149,
        "category": "Domain 12: Golang Viper Configuration",
        "timestamp": "00:52:00",
        "title": "Studi Kasus: App Config Provider Centralized Singleton",
        "desc": "Mendesain arsitektur pemuatan konfigurasi terpusat (Singleton Provider) yang rapi, aman, dan siap dipakai di seluruh layer aplikasi.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Pattern Singleton Config Provider</h3>\n            <p>Memuat konfigurasi berulang kali di setiap file adalah pemborosan. Pendekatan terbaik adalah membuat package `config` yang memuat seluruh konfigurasi sekali saat *startup* (menggunakan `sync.Once`), lalu membagikan pointer `*AppConfig` tersebut.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Struktur Folder Rekomendasi:</div>\n                <pre>├── config/\n│   ├── config.go       # Singleton loader (Viper unmarshal)\n│   └── config.json     # Default config file\n├── main.go             # Inisialisasi config.LoadConfig()</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"sync\"\n)\n\ntype Config struct {\n\tAppName string\n\tPort    int\n}\n\nvar (\n\tinstance *Config\n\tonce     sync.Once\n)\n\nfunc GetConfig() *Config {\n\tonce.Do(func() {\n\t\tfmt.Println(\"[INIT] Loading configuration singleton via Viper...\")\n\t\tinstance = &Config{\n\t\t\tAppName: \"Enterprise Backend API\",\n\t\t\tPort:    8080,\n\t\t}\n\t})\n\treturn instance\n}\n\nfunc main() {\n\tfmt.Println(\"=== SINGLETON CONFIG PROVIDER DEMO ===\")\n\tcfg1 := GetConfig()\n\tcfg2 := GetConfig()\n\n\tfmt.Println(\"Cfg1 AppName:\", cfg1.AppName)\n\tfmt.Println(\"Apakah Pointer Cfg1 dan Cfg2 sama?\", cfg1 == cfg2)\n}",
        "quiz": {
                "question": "Fungsi bawaan Go dari package `sync` manakah yang menjamin bahwa inisialisasi pemuatan konfigurasi Viper hanya dieksekusi tepat satu kali meskipun dipanggil concurrent oleh banyak goroutine?",
                "options": [
                        "sync.Once",
                        "sync.Mutex",
                        "sync.WaitGroup",
                        "sync.Cond"
                ],
                "correctIndex": 0,
                "explanation": "`sync.Once.Do(f)` memastikan fungsi `f` dieksekusi tepat 1 kali sepanjang siklus hidup aplikasi."
        }
},
{
        "id": 150,
        "category": "Domain 13: Golang Validation",
        "timestamp": "00:01:10",
        "title": "Pengenalan Data Validation & Library go-playground/validator",
        "desc": "Memahami pentingnya validasi data input di Golang dan menginstal package go-playground/validator.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Mengapa Data Validation Sangat Penting?</h3>\n            <p>Dalam aplikasi backend, data input dari pengguna (seperti JSON request body, query parameter, atau form) <strong>tidak pernah boleh dipercaya langsung</strong>. Data yang invalid dapat menyebabkan panik runtime, query SQL yang bermasalah, atau celah keamanan (security vulnerabilities).</p>\n            \n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Apa itu go-playground/validator?</div>\n                <p><code>go-playground/validator</code> adalah library validasi paling populer di ekosistem Go. Library ini memungkinkan developer menentukan aturan validasi langsung pada Struct Field menggunakan <strong>Struct Tags</strong>.</p>\n            </div>\n\n            <h3>Cara Kerja Validator:</h3>\n            <ul>\n                <li><strong>Inisialisasi Validator:</strong> Membuat instance `validate = validator.New()`.</li>\n                <li><strong>Struct Tag `validate`:</strong> Menambahkan aturan seperti `validate:\"required,email\"`.</li>\n                <li><strong>Eksekusi Validasi:</strong> Memanggil `err := validate.Struct(user)`.</li>\n            </ul>\n\n            <h3>Instalasi Package:</h3>\n            <pre>go get github.com/go-playground/validator/v10</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"strings\"\n)\n\n// Simulasi Struct & Validator Engine\ntype UserRequest struct {\n\tUsername string\n\tEmail    string\n\tAge      int\n}\n\nfunc (u UserRequest) Validate() []string {\n\tvar errs []string\n\tif strings.TrimSpace(u.Username) == \"\" {\n\t\terrs = append(errs, \"Username wajib diisi\")\n\t}\n\tif !strings.Contains(u.Email, \"@\") {\n\t\terrs = append(errs, \"Email harus berupa format email yang valid\")\n\t}\n\tif u.Age < 17 {\n\t\terrs = append(errs, \"Umur minimal 17 tahun\")\n\t}\n\treturn errs\n}\n\nfunc main() {\n\tfmt.Println(\"=== DEMO DATA VALIDATION GOLANG ===\")\n\tuser := UserRequest{\n\t\tUsername: \"\",\n\t\tEmail:    \"invalid-email-format\",\n\t\tAge:      15,\n\t}\n\n\terrs := user.Validate()\n\tif len(errs) > 0 {\n\t\tfmt.Println(\"Validation Errors:\")\n\t\tfor i, err := range errs {\n\t\t\tfmt.Printf(\"  %d. %s\\n\", i+1, err)\n\t\t}\n\t} else {\n\t\tfmt.Println(\"Data Valid!\")\n\t}\n}",
        "quiz": {
                "question": "Metode utama pada library `go-playground/validator` yang digunakan untuk melakukan validasi seluruh field pada sebuah struct adalah?",
                "options": [
                        "validate.Struct(data)",
                        "validate.Check(data)",
                        "validate.Verify(data)",
                        "validate.Parse(data)"
                ],
                "correctIndex": 0,
                "explanation": "Metode `validate.Struct(s)` memeriksa seluruh field dalam struct berdasarkan tag `validate` yang ditempelkan."
        }
},
{
        "id": 151,
        "category": "Domain 13: Golang Validation",
        "timestamp": "00:07:30",
        "title": "Validasi Field Dasar (Required, Email, Min/Max, Numeric)",
        "desc": "Menggunakan tag-tag bawaan validator seperti required, email, min, max, gte, lte, dan alpha.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Tag Validasi Standar yang Sering Digunakan</h3>\n            <p><code>go-playground/validator</code> memiliki puluhan tag bawaan yang siap pakai untuk menguji format data field secara deklaratif.</p>\n\n            <table class=\"table-styled\">\n                <thead>\n                    <tr>\n                        <th>Tag</th>\n                        <th>Keterangan</th>\n                        <th>Contoh Penggunaan Tag</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr>\n                        <td><code>required</code></td>\n                        <td>Field tidak boleh kosong atau bernilai zero value.</td>\n                        <td><code>validate:\"required\"</code></td>\n                    </tr>\n                    <tr>\n                        <td><code>email</code></td>\n                        <td>Memastikan format string adalah alamat email valid.</td>\n                        <td><code>validate:\"email\"</code></td>\n                    </tr>\n                    <tr>\n                        <td><code>min/max</code></td>\n                        <td>Membatasi panjang string/slice atau nilai minimal/maksimal angka.</td>\n                        <td><code>validate:\"min=3,max=20\"</code></td>\n                    </tr>\n                    <tr>\n                        <td><code>gte/lte</code></td>\n                        <td>Greater Than or Equal (>=) / Less Than or Equal (<=).</td>\n                        <td><code>validate:\"gte=18,lte=60\"</code></td>\n                    </tr>\n                    <tr>\n                        <td><code>numeric</code></td>\n                        <td>Memastikan string hanya berisi angka 0-9.</td>\n                        <td><code>validate:\"numeric\"</code></td>\n                    </tr>\n                </tbody>\n            </table>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Menggabungkan Banyak Tag:</div>\n                <p>Gunakan koma (<code>,</code>) tanpa spasi untuk menggabungkan beberapa aturan validasi sekaligus:</p>\n                <pre>type RegisterDTO struct {\n    Username string `json:\"username\" validate:\"required,min=4,max=32\"`\n    Email    string `json:\"email\" validate:\"required,email\"`\n    Age      int    `json:\"age\" validate:\"required,gte=17\"`\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"regexp\"\n)\n\ntype Employee struct {\n\tName   string\n\tEmail  string\n\tAge    int\n\tSalary float64\n}\n\nfunc ValidateEmployee(e Employee) map[string]string {\n\terrs := make(map[string]string)\n\tif len(e.Name) < 3 || len(e.Name) > 20 {\n\t\terrs[\"Name\"] = \"Name harus antara 3 hingga 20 karakter\"\n\t}\n\temailRegex := regexp.MustCompile(`^[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,4}$`)\n\tif !emailRegex.MatchString(strings.ToLower(e.Email)) {\n\t\terrs[\"Email\"] = \"Format email tidak valid\"\n\t}\n\tif e.Age < 18 || e.Age > 65 {\n\t\terrs[\"Age\"] = \"Age harus antara 18 dan 65 tahun\"\n\t}\n\tif e.Salary <= 0 {\n\t\terrs[\"Salary\"] = \"Salary harus lebih besar dari 0\"\n\t}\n\treturn errs\n}\n\nfunc main() {\n\temp := Employee{\n\t\tName:   \"B\",\n\t\tEmail:  \"budi.com\",\n\t\tAge:    15,\n\t\tSalary: 0,\n\t}\n\n\terrs := ValidateEmployee(emp)\n\tfmt.Println(\"=== HASIL VALIDASI EMPLOYEE ===\")\n\tfor field, msg := range errs {\n\t\tfmt.Printf(\"- Field '%s': %s\\n\", field, msg)\n\t}\n}",
        "quiz": {
                "question": "Struct tag manakah yang benar untuk memvalidasi bahwa sebuah string berformat email dan memiliki panjang minimal 10 karakter?",
                "options": [
                        "`validate:\"required,email,min=10\"`",
                        "`validate:\"email && min:10\"`",
                        "`validate:\"is_email,length>=10\"`",
                        "`validate:\"check_email,min_len=10\"`"
                ],
                "correctIndex": 0,
                "explanation": "Aturan dikombinasikan dengan tanda koma tanpa spasi, contoh: `validate:\"required,email,min=10\"`."
        }
},
{
        "id": 152,
        "category": "Domain 13: Golang Validation",
        "timestamp": "00:14:20",
        "title": "Validasi Struct & Nested Struct Validation",
        "desc": "Melakukan validasi bertingkat pada nested struct, slice of struct, dan pointer struct dengan tag dive.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Nested Struct & Slice Validation</h3>\n            <p>Saat aplikasi kita mengolah data kompleks (seperti Order yang berisi daftar Items, atau User yang memiliki Address), kita perlu memastikan field di dalam sub-struct atau slice ikut divalidasi secara rekursif.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Tag `dive`</div>\n                <p>Tag <code>dive</code> memberi tahu validator untuk \"menyelam\" ke dalam elemen slice, array, atau map, lalu menerapkan aturan validasi ke setiap item di dalamnya.</p>\n            </div>\n\n            <h3>Contoh Sintaks Nested Validation:</h3>\n            <pre>type Address struct {\n    Street  string `validate:\"required\"`\n    City    string `validate:\"required\"`\n    ZipCode string `validate:\"required,numeric,len=5\"`\n}\n\ntype User struct {\n    Name    string    `validate:\"required\"`\n    Address Address   `validate:\"required\"` // Otomatis menguji sub-struct Address\n    Hobbies []string  `validate:\"required,dive,min=2\"` // Memvalidasi tiap elemen hobby\n}</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype Item struct {\n\tName  string\n\tPrice float64\n\tQty   int\n}\n\ntype Order struct {\n\tOrderID     string\n\tCustomer    string\n\tItems       []Item\n}\n\nfunc ValidateOrder(o Order) []string {\n\tvar errs []string\n\tif o.OrderID == \"\" {\n\t\terrs = append(errs, \"OrderID tidak boleh kosong\")\n\t}\n\tif o.Customer == \"\" {\n\t\terrs = append(errs, \"Customer tidak boleh kosong\")\n\t}\n\tif len(o.Items) == 0 {\n\t\terrs = append(errs, \"Order harus memiliki setidaknya 1 item\")\n\t}\n\tfor i, item := range o.Items {\n\t\tif item.Name == \"\" {\n\t\t\terrs = append(errs, fmt.Sprintf(\"Item [%d]: Name tidak boleh kosong\", i))\n\t\t}\n\t\tif item.Price <= 0 {\n\t\t\terrs = append(errs, fmt.Sprintf(\"Item [%d]: Price harus > 0\", i))\n\t\t}\n\t\tif item.Qty <= 0 {\n\t\t\terrs = append(errs, fmt.Sprintf(\"Item [%d]: Qty harus > 0\", i))\n\t\t}\n\t}\n\treturn errs\n}\n\nfunc main() {\n\torder := Order{\n\t\tOrderID:  \"ORD-991\",\n\t\tCustomer: \"Andi\",\n\t\tItems: []Item{\n\t\t\t{Name: \"Laptop\", Price: 12000000, Qty: 1},\n\t\t\t{Name: \"\", Price: 0, Qty: 0}, // Invalid item\n\t\t},\n\t}\n\n\terrs := ValidateOrder(order)\n\tfmt.Println(\"=== VALIDASI NESTED ORDER ===\")\n\tif len(errs) > 0 {\n\t\tfor _, e := range errs {\n\t\t\tfmt.Println(\"ERROR:\", e)\n\t\t}\n\t} else {\n\t\tfmt.Println(\"Order Valid!\")\n\t}\n}",
        "quiz": {
                "question": "Tag apakah pada `go-playground/validator` yang digunakan untuk memvalidasi elemen individu di dalam sebuah Slice atau Array?",
                "options": [
                        "dive",
                        "loop",
                        "element",
                        "each"
                ],
                "correctIndex": 0,
                "explanation": "Tag `dive` menginstruksikan validator untuk melakukan pengujian rekursif ke elemen-elemen di dalam slice/map."
        }
},
{
        "id": 153,
        "category": "Domain 13: Golang Validation",
        "timestamp": "00:21:40",
        "title": "Custom Validation Function & Registration",
        "desc": "Membuat aturan validasi sendiri (custom validator) menggunakan RegisterValidation untuk logika bisnis spesifik.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Kebutuhan Custom Validation</h3>\n            <p>Tag bawaan tidak selalu cukup. Misalnya, kita ingin memastikan input berupa Plat Nomor Indonesia (misal: \"B 1234 CD\"), NIK KTP (16 digit), atau Slug string tanpa spasi.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Langkah Membuat Custom Validator:</div>\n                <ol>\n                    <li>Buat fungsi ber-signature <code>func(fl validator.FieldLevel) bool</code>.</li>\n                    <li>Dapatkan nilai field via <code>fl.Field().String()</code> atau <code>fl.Field().Interface()</code>.</li>\n                    <li>Daftarkan tag kustom via <code>validate.RegisterValidation(\"nama_tag\", fungsiSaya)</code>.</li>\n                    <li>Gunakan tag tersebut di Struct Tag: <code>`validate:\"nama_tag\"`</code>.</li>\n                </ol>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"regexp\"\n)\n\n// Custom validation function simulation\nfunc IsIndonesianPhone(phone string) bool {\n\t// Memastikan berawalan +62 atau 08 dan memiliki panjang 10-14 digit\n\tre := regexp.MustCompile(`^(?:\\+62|08)[0-9]{8,12}$`)\n\treturn re.MatchString(phone)\n}\n\ntype Contact struct {\n\tName  string\n\tPhone string\n}\n\nfunc main() {\n\tcontacts := []Contact{\n\t\t{Name: \"Budi\", Phone: \"+628123456789\"},\n\t\t{Name: \"Siti\", Phone: \"085712345678\"},\n\t\t{Name: \"Joko\", Phone: \"12345\"}, // Invalid\n\t}\n\n\tfmt.Println(\"=== TESTING CUSTOM PHONE VALIDATOR ===\")\n\tfor _, c := range contacts {\n\t\tvalid := IsIndonesianPhone(c.Phone)\n\t\tstatus := \"VALID\"\n\t\tif !valid {\n\t\t\tstatus = \"INVALID\"\n\t\t}\n\t\tfmt.Printf(\"Kontak %s (%s) => %s\\n\", c.Name, c.Phone, status)\n\t}\n}",
        "quiz": {
                "question": "Signature fungsi yang benar untuk mendaftarkan Custom Validation pada `go-playground/validator` adalah?",
                "options": [
                        "func(fl validator.FieldLevel) bool",
                        "func(val string) error",
                        "func(field interface{}) (bool, error)",
                        "func(ctx context.Context, val interface{}) bool"
                ],
                "correctIndex": 0,
                "explanation": "Custom validator wajib menerima parameter `validator.FieldLevel` dan mengembalikan nilai boolean `bool` (true jika valid, false jika gagal)."
        }
},
{
        "id": 154,
        "category": "Domain 13: Golang Validation",
        "timestamp": "00:29:15",
        "title": "Cross-Field & Struct Level Validation",
        "desc": "Validasi yang membandingkan antar dua field berbeda (seperti Password vs ConfirmPassword, StartDate vs EndDate).",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Validasi Lintas Field (Cross-Field)</h3>\n            <p>Sering kali keabsahan suatu field tergantung pada nilai field lain di struct yang sama. Contoh klasik:</p>\n            <ul>\n                <li><strong>Confirm Password:</strong> Harus sama persis dengan field `Password` (<code>eqfield=Password</code>).</li>\n                <li><strong>Rentang Tanggal:</strong> `EndDate` harus lebih besar dari `StartDate` (<code>gtfield=StartDate</code>).</li>\n            </ul>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Tag Cross-Field Populer:</div>\n                <ul>\n                    <li><code>eqfield=OtherField</code>: Nilai harus sama dengan OtherField.</li>\n                    <li><code>nefield=OtherField</code>: Nilai tidak boleh sama dengan OtherField.</li>\n                    <li><code>gtfield=OtherField</code>: Nilai numerik/tanggal lebih besar dari OtherField.</li>\n                    <li><code>gtefield=OtherField</code>: Nilai numerik/tanggal lebih besar atau sama dengan OtherField.</li>\n                </ul>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype RegisterForm struct {\n\tPassword        string\n\tConfirmPassword string\n\tMinAge          int\n\tMaxAge          int\n}\n\nfunc ValidateRegisterForm(f RegisterForm) []string {\n\tvar errs []string\n\tif f.Password != f.ConfirmPassword {\n\t\terrs = append(errs, \"ConfirmPassword tidak cocok dengan Password (eqfield violation)\")\n\t}\n\tif f.MaxAge <= f.MinAge {\n\t\terrs = append(errs, \"MaxAge harus lebih besar dari MinAge (gtfield violation)\")\n\t}\n\treturn errs\n}\n\nfunc main() {\n\tform := RegisterForm{\n\t\tPassword:        \"secret123\",\n\t\tConfirmPassword: \"secret456\", // Berbeda\n\t\tMinAge:          20,\n\t\tMaxAge:          18, // Salah, harus > MinAge\n\t}\n\n\tfmt.Println(\"=== DEMO CROSS-FIELD VALIDATION ===\")\n\terrs := ValidateRegisterForm(form)\n\tfor _, err := range errs {\n\t\tfmt.Println(\"VALIDATION ERROR:\", err)\n\t}\n}",
        "quiz": {
                "question": "Struct tag apakah yang digunakan untuk memastikan bahwa nilai `ConfirmPassword` sama persis dengan nilai field `Password`?",
                "options": [
                        "`validate:\"eqfield=Password\"`",
                        "`validate:\"same=Password\"`",
                        "`validate:\"match(Password)\"`",
                        "`validate:\"compare=Password\"`"
                ],
                "correctIndex": 0,
                "explanation": "Tag `eqfield=FieldName` membandingkan dua nilai field pada struct secara langsung."
        }
},
{
        "id": 155,
        "category": "Domain 13: Golang Validation",
        "timestamp": "00:36:00",
        "title": "Alias Tag & Custom Error Messages (Translation)",
        "desc": "Meringkas sekumpulan tag dengan Alias dan mengkonfigurasi i18n translator untuk merender error berbahasa Indonesia.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Alias Tag & Internationalization (i18n)</h3>\n            <p>Jika kita sering mengulang sekumpulan tag rumit, kita bisa mendaftarkan <strong>Alias Tag</strong>. Selain itu, pesan error bawaan validator berformat teknis dalam bahasa Inggris. Kita dapat menerjemahkannya ke Bahasa Indonesia menggunakan package `go-playground/universal-translator`.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Registrasi Alias Tag:</div>\n                <pre>validate.RegisterAlias(\"is-password\", \"required,min=8,max=64\")\n// Sekarang di struct tag cukup gunakan:\n// Password string `validate:\"is-password\"`</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\n// Simulasi Formatter Error Terjemahan\nfunc FormatErrorMessage(field, tag, param string) string {\n\tswitch tag {\n\tcase \"required\":\n\t\treturn fmt.Sprintf(\"Field '%s' tidak boleh kosong.\", field)\n\tcase \"email\":\n\t\treturn fmt.Sprintf(\"Field '%s' harus berupa alamat email yang valid.\", field)\n\tcase \"min\":\n\t\treturn fmt.Sprintf(\"Field '%s' minimal harus berisi %s karakter.\", field, param)\n\tdefault:\n\t\treturn fmt.Sprintf(\"Field '%s' tidak memenuhi aturan %s.\", field, tag)\n\t}\n}\n\nfunc main() {\n\tfmt.Println(\"=== DEMO CUSTOM TRANSLATION ERROR ===\")\n\tfmt.Println(FormatErrorMessage(\"Email\", \"email\", \"\"))\n\tfmt.Println(FormatErrorMessage(\"Username\", \"required\", \"\"))\n\tfmt.Println(FormatErrorMessage(\"Password\", \"min\", \"8\"))\n}",
        "quiz": {
                "question": "Fungsi apakah pada `go-playground/validator` yang digunakan untuk mendaftarkan kombinasi beberapa tag menjadi satu nama tag singkat baru?",
                "options": [
                        "RegisterAlias",
                        "CombineTags",
                        "CreateShortTag",
                        "RegisterGroup"
                ],
                "correctIndex": 0,
                "explanation": "`validate.RegisterAlias(aliasName, tagString)` mendaftarkan alias kustom untuk menyederhanakan struct tags."
        }
},
{
        "id": 156,
        "category": "Domain 13: Golang Validation",
        "timestamp": "00:43:10",
        "title": "Handling & Formatting Validation Errors",
        "desc": "Mengekstrak ValidationErrors interface menjadi struktur JSON Error Response yang rapi untuk REST API.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Struktur Response Error yang User-Friendly</h3>\n            <p>Saat error validasi terjadi, `validate.Struct()` mengembalikan error bertipe `validator.ValidationErrors`. Kita harus melakukan <em>type assertion</em> untuk mengambil detail field mana yang gagal beserta parameternya.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Format JSON Response Error Standar:</div>\n                <pre>{\n  \"code\": 400,\n  \"status\": \"BAD_REQUEST\",\n  \"errors\": [\n    {\"field\": \"email\", \"message\": \"Email is required\"},\n    {\"field\": \"age\", \"message\": \"Age must be at least 17\"}\n  ]\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\ntype FieldErrorResponse struct {\n\tField   string `json:\"field\"`\n\tMessage string `json:\"message\"`\n}\n\ntype APIErrorResponse struct {\n\tCode   int                  `json:\"code\"`\n\tStatus string               `json:\"status\"`\n\tErrors []FieldErrorResponse `json:\"errors\"`\n}\n\nfunc main() {\n\tresp := APIErrorResponse{\n\t\tCode:   400,\n\t\tStatus: \"BAD_REQUEST\",\n\t\tErrors: []FieldErrorResponse{\n\t\t\t{Field: \"username\", Message: \"Username minimal 4 karakter\"},\n\t\t\t{Field: \"email\", Message: \"Format email tidak sesuai\"},\n\t\t},\n\t}\n\n\tjsonBytes, _ := json.MarshalIndent(resp, \"\", \"  \")\n\tfmt.Println(\"=== JSON VALIDATION ERROR RESPONSE ===\")\n\tfmt.Println(string(jsonBytes))\n}",
        "quiz": {
                "question": "Interface tipe error apakah yang dikembalikan oleh `go-playground/validator` saat fungsi `validate.Struct()` menemukan data yang tidak valid?",
                "options": [
                        "validator.ValidationErrors",
                        "validator.FieldError",
                        "errors.CustomError",
                        "validator.StructError"
                ],
                "correctIndex": 0,
                "explanation": "Error yang dikembalikan bisa di-cast ke `validator.ValidationErrors` yang berisi kumpulan individual `FieldError`."
        }
},
{
        "id": 157,
        "category": "Domain 13: Golang Validation",
        "timestamp": "00:51:00",
        "title": "Studi Kasus: RESTful API DTO Request Validation Pipeline",
        "desc": "Membangun middleware dan request pipeline terpadu untuk memvalidasi JSON DTO pada endpoint API.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Arsitektur Request Validation Pipeline</h3>\n            <p>Dalam aplikasi profesional, proses validasi DTO dipisah dalam helper/middleware terpusat sebelum request diteruskan ke layer Controller atau Service.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Flow Eksekusi:</div>\n                <ol>\n                    <li>HTTP Handler menerima JSON Payload.</li>\n                    <li>Decode JSON ke Struct DTO via <code>json.NewDecoder(r.Body).Decode(&dto)</code>.</li>\n                    <li>Jalankan <code>validate.Struct(dto)</code>.</li>\n                    <li>Jika ada error, format menjadi JSON Error 400 Bad Request dan akhiri request.</li>\n                    <li>Jika valid, teruskan DTO ke Business Logic Service.</li>\n                </ol>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype CreateProductDTO struct {\n\tSKU   string\n\tName  string\n\tPrice float64\n\tStock int\n}\n\nfunc (dto CreateProductDTO) Validate() error {\n\tif dto.SKU == \"\" {\n\t\treturn fmt.Errorf(\"SKU tidak boleh kosong\")\n\t}\n\tif dto.Name == \"\" {\n\t\treturn fmt.Errorf(\"Name produk wajib diisi\")\n\t}\n\tif dto.Price <= 0 {\n\t\treturn fmt.Errorf(\"Price harus lebih dari 0\")\n\t}\n\tif dto.Stock < 0 {\n\t\treturn fmt.Errorf(\"Stock tidak boleh negatif\")\n\t}\n\treturn nil\n}\n\nfunc ProductController(dto CreateProductDTO) {\n\tif err := dto.Validate(); err != nil {\n\t\tfmt.Println(\"[RESPONSE HTTP 400 Bad Request]:\", err)\n\t\treturn\n\t}\n\tfmt.Println(\"[RESPONSE HTTP 201 Created]: Produk berhasil disimpan -> SKU:\", dto.SKU)\n}\n\nfunc main() {\n\tfmt.Println(\"=== DEMO PIPELINE REST API DTO ===\")\n\tbadReq := CreateProductDTO{SKU: \"SKU-001\", Name: \"\", Price: 0, Stock: -5}\n\tProductController(badReq)\n\n\tgoodReq := CreateProductDTO{SKU: \"SKU-002\", Name: \"Mouse Wireless\", Price: 150000, Stock: 20}\n\tProductController(goodReq)\n}",
        "quiz": {
                "question": "Status HTTP Status Code manakah yang paling tepat dikembalikan oleh RESTful API ketika data JSON Request Body gagal divalidasi?",
                "options": [
                        "400 Bad Request",
                        "401 Unauthorized",
                        "500 Internal Server Error",
                        "404 Not Found"
                ],
                "correctIndex": 0,
                "explanation": "HTTP 400 Bad Request adalah standar industri untuk mengindikasikan bahwa data yang dikirimkan klien memiliki sintaks atau validasi yang salah."
        }
},
{
        "id": 158,
        "category": "Domain 14: Golang Dependency Injection",
        "timestamp": "00:01:05",
        "title": "Konsep Dependency Injection & Loose Coupling",
        "desc": "Memahami pentingnya pemisahan dependensi (Inversion of Control) untuk kode yang modular dan testable.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Apa itu Dependency Injection (DI)?</h3>\n            <p><strong>Dependency Injection</strong> adalah teknik desain perangkat lunak di mana sebuah objek (atau struct) menerima objek lain yang dibutuhkannya (dependensinya) dari luar, bukannya membuat sendiri dependensi tersebut di dalam constructor-nya.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Masalah Keterikatan Erat (Tightly Coupled):</div>\n                <pre>// TANPA DI (Tightly Coupled - Buruk):\ntype UserService struct {\n    repo *MySQLUserRepository // Terikat mati ke MySQL! Susah di-unit test\n}\nfunc NewUserService() *UserService {\n    return &UserService{repo: &MySQLUserRepository{}}\n}</pre>\n            </div>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 DENGAN DI (Loosely Coupled - Ideal):</div>\n                <pre>type UserService struct {\n    repo UserRepository // Bergantung pada Interface!\n}\nfunc NewUserService(repo UserRepository) *UserService {\n    return &UserService{repo: repo}\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype Repository interface {\n\tGetData() string\n}\n\ntype MemoryRepo struct{}\n\nfunc (r *MemoryRepo) GetData() string { return \"Data dari Memory DB\" }\n\ntype Service struct {\n\trepo Repository // Injeksi via Interface\n}\n\nfunc NewService(r Repository) *Service {\n\treturn &Service{repo: r}\n}\n\nfunc main() {\n\trepo := &MemoryRepo{}\n\tsvc := NewService(repo) // Dependency Injection Manual\n\tfmt.Println(\"Service Result:\", svc.repo.GetData())\n}",
        "quiz": {
                "question": "Apakah manfaat utama menerapkan Dependency Injection berbasis Interface pada Golang?",
                "options": [
                        "Membuat komponen menjadi loosely coupled sehingga sangat mudah diuji (unit test / mock) dan dirawat",
                        "Membuat aplikasi bisa berjalan tanpa memori RAM",
                        "Menghilangkan kebutuhan akan fungsi main()",
                        "Menyembunyikan kode Go dari kompilator"
                ],
                "correctIndex": 0,
                "explanation": "Dependency Injection memisahkan instansiasi dari logika bisnis, mempermudah penggantian komponen asli dengan mock saat unit testing."
        }
},
{
        "id": 159,
        "category": "Domain 14: Golang Dependency Injection",
        "timestamp": "00:07:15",
        "title": "Pengenalan Google Wire (Compile-Time DI Generator)",
        "desc": "Mengenal Google Wire sebagai tool generator kode Dependency Injection tanpa reflection saat runtime.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Mengapa Google Wire?</h3>\n            <p>Di bahasa pemrograman seperti Java (Spring) atau C# (.NET), Dependency Injection biasa menggunakan <i>reflection</i> saat aplikasi dinyalakan. Namun pada Go, reflection dapat memperlambat waktu start-up dan menimbulkan error di runtime.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Karakteristik Google Wire:</div>\n                <ul>\n                    <li><strong>Compile-Time Code Generation:</strong> Wire membuat kode Go standar (`wire_gen.go`) saat kompilasi.</li>\n                    <li><strong>Tanpa Reflection:</strong> Sangat cepat dan zero overhead saat aplikasi dijalankan.</li>\n                    <li><strong>Type-Safe:</strong> Jika ada dependensi yang kurang atau tipe data tidak cocok, kesalahan langsung terdeteksi saat <code>wire</code> di-run!</li>\n                </ul>\n            </div>\n\n            <h3>Instalasi CLI Wire:</h3>\n            <pre>go install github.com/google/wire/cmd/wire@latest</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== DEMO GOOGLE WIRE ===\")\n\tfmt.Println(\"Google Wire adalah Compile-Time Dependency Injection tool buatan Google.\")\n\tfmt.Println(\"Keunggulan: Bebas Reflection, Type-Safe, dan Terverifikasi saat Compile Time!\")\n}",
        "quiz": {
                "question": "Pendekatan apakah yang digunakan oleh Google Wire dalam mengelola Dependency Injection di Go?",
                "options": [
                        "Compile-Time Code Generation (Membuat kode Go sebelum kompilasi tanpa reflection)",
                        "Runtime Reflection",
                        "Dynamic Bytecode Injection",
                        "Environment Variables Injection"
                ],
                "correctIndex": 0,
                "explanation": "Google Wire beroperasi di compile-time dengan menelaah kode dan menghasilkan file Go asli (`wire_gen.go`)."
        }
},
{
        "id": 160,
        "category": "Domain 14: Golang Dependency Injection",
        "timestamp": "00:13:00",
        "title": "Provider & Constructor Function Pattern",
        "desc": "Memahami konsep Provider sebagai fungsi constructor pengembali instance dependensi.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Apa itu Provider di Wire?</h3>\n            <p><strong>Provider</strong> adalah fungsi Go biasa yang menghasilkan sebuah nilai atau instance dependensi. Fungsi constructor standar Go (seperti <code>NewUserRepository</code> atau <code>NewDBConnection</code>) secara otomatis dianggap sebagai Provider oleh Google Wire.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Contoh Fungsi Provider:</div>\n                <pre>// Provider DB Connection\nfunc ProvideDB() *sql.DB {\n    db, _ := sql.Open(\"mysql\", \"root:root@tcp(localhost:3306)/app\")\n    return db\n}\n\n// Provider Repository (Membutuhkan DB)\nfunc ProvideUserRepository(db *sql.DB) *UserRepository {\n    return &UserRepository{DB: db}\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype Database struct{ Dsn string }\ntype UserRepo struct{ DB *Database }\n\n// Provider 1\nfunc NewDatabase() *Database {\n\treturn &Database{Dsn: \"localhost:3306\"}\n}\n\n// Provider 2 (Membutuhkan *Database)\nfunc NewUserRepo(db *Database) *UserRepo {\n\treturn &UserRepo{DB: db}\n}\n\nfunc main() {\n\tdb := NewDatabase()\n\trepo := NewUserRepo(db)\n\n\tfmt.Println(\"Repo DB DSN:\", repo.DB.Dsn)\n}",
        "quiz": {
                "question": "Di dalam ekosistem Google Wire, apakah yang dimaksud dengan sebutan 'Provider'?",
                "options": [
                        "Fungsi constructor Go biasa yang menghasilkan/mengembalikan sebuah nilai atau objek dependensi",
                        "Library untuk koneksi internet",
                        "Server penyedia database",
                        "File konfigurasi JSON"
                ],
                "correctIndex": 0,
                "explanation": "Provider adalah sebutan untuk fungsi pengembali objek dependensi yang akan dirangkai oleh Wire."
        }
},
{
        "id": 161,
        "category": "Domain 14: Golang Dependency Injection",
        "timestamp": "00:19:20",
        "title": "Injector Function & File wire.go",
        "desc": "Deklarasi fungsi Injector menggunakan `wire.Build(...)` dalam file khusus `injector.go` atau `wire.go`.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Membuat File Injector (`wire.go`)</h3>\n            <p><strong>Injector</strong> adalah fungsi yang merangkai provider-provider untuk mengembalikan objek akhir aplikasi. Kita menuliskan fungsi Injector di file <code>wire.go</code> dengan directive build tag khusus <code>//go:build wireinject</code>.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Contoh Kode wire.go:</div>\n                <pre>//go:build wireinject\n// +build wireinject\n\npackage main\n\nimport \"github.com/google/wire\"\n\nfunc InitializedUserService() *UserService {\n    wire.Build(ProvideDB, ProvideUserRepository, ProvideUserService)\n    return nil\n}</pre>\n            </div>\n\n            <p>Saat perintah <code>wire</code> dijalankan di terminal, Wire akan menghasilkan file <code>wire_gen.go</code> berisi kode perangkaian otomatis!</p>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== INJECTOR DEMO ===\")\n\tfmt.Println(\"File wire.go berisi deklarasi wire.Build(Provider1, Provider2...)\")\n\tfmt.Println(\"Command 'wire' menghasilkan file wire_gen.go!\")\n}",
        "quiz": {
                "question": "Build tag Go apakah yang WAJIB diletakkan pada bagian paling atas file `wire.go` agar file tersebut diabaikan saat kompilasi standar sebelum Wire di-generate?",
                "options": [
                        "//go:build wireinject",
                        "//go:embed wire",
                        "//go:generate wire",
                        "//go:noinline"
                ],
                "correctIndex": 0,
                "explanation": "Directive `//go:build wireinject` memberitahu kompilator Go untuk tidak mengkompilasi stempel injector sebelum Wire menghasilkan `wire_gen.go`."
        }
},
{
        "id": 162,
        "category": "Domain 14: Golang Dependency Injection",
        "timestamp": "00:26:00",
        "title": "Interface Binding dengan wire.Bind",
        "desc": "Mengabaikan detail konkret struct dan mengaitkan implementasi struct ke Interface menggunakan `wire.Bind`.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Interface Binding (`wire.Bind`)</h3>\n            <p>Jika sebuah Service membutuhkan dependensi bertipe <code>Interface</code>, sedangkan Provider mengembalikan pointer <code>*StructKonkret</code>, Wire perlu tahu bahwa struct tersebut mengimplementasikan interface tersebut.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Penggunaan wire.Bind:</div>\n                <pre>var UserRepositorySet = wire.NewSet(\n    ProvideMySQLUserRepository,\n    wire.Bind(new(UserRepository), new(*MySQLUserRepository)),\n)</pre>\n            </div>\n\n            <p>Fungsi <code>wire.Bind(new(TargetInterface), new(*ConcreteStruct))</code> memberitahu Wire untuk menginjeksi struct konkret sebagai interface target.</p>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype CategoryRepo interface {\n\tFindAll() []string\n}\n\ntype MemoryCategoryRepo struct{}\n\nfunc (m *MemoryCategoryRepo) FindAll() []string {\n\treturn []string{\"Elektronik\", \"Pakaian\", \"Buku\"}\n}\n\nfunc main() {\n\tvar repo CategoryRepo = &MemoryCategoryRepo{}\n\tfmt.Println(\"Categories:\", repo.FindAll())\n}",
        "quiz": {
                "question": "Fungsi bawaan Google Wire manakah yang digunakan untuk menghubungkan tipe data Interface dengan implementasi Struct konkretnya?",
                "options": [
                        "wire.Bind()",
                        "wire.Link()",
                        "wire.Interface()",
                        "wire.Connect()"
                ],
                "correctIndex": 0,
                "explanation": "`wire.Bind(new(Interface), new(*Struct))` digunakan untuk mendaftarkan hubungan interface dan struct konkrit pada Wire."
        }
},
{
        "id": 163,
        "category": "Domain 14: Golang Dependency Injection",
        "timestamp": "00:32:45",
        "title": "Provider Sets (wire.NewSet)",
        "desc": "Mengelompokkan provider-provider terkait menjadi satu modul terorganisir menggunakan `wire.NewSet`.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Pengelompokan Provider (Provider Set)</h3>\n            <p>Pada aplikasi berskala besar dengan puluhan modul, mendaftarkan setiap provider satu per satu di `wire.Build(...)` akan sangat panjang. Wire menyediakan <code>wire.NewSet</code> untuk mengelompokkan provider yang saling berhubungan.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Contoh Provider Set Modul User:</div>\n                <pre>var UserSet = wire.NewSet(\n    ProvideUserRepository,\n    ProvideUserService,\n    ProvideUserController,\n)</pre>\n            </div>\n\n            <p>Selanjutnya pada `wire.go` kita cukup memanggil <code>wire.Build(UserSet, OrderSet, DatabaseSet)</code>.</p>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== PROVIDER SETS DEMO ===\")\n\tfmt.Println(\"wire.NewSet(Provider1, Provider2, Provider3) merangkai grup provider menjadi modul terstruktur.\")\n}",
        "quiz": {
                "question": "Method Google Wire manakah yang digunakan untuk menggabungkan beberapa Provider menjadi satu grup/set modul?",
                "options": [
                        "wire.NewSet()",
                        "wire.Group()",
                        "wire.Combine()",
                        "wire.Collection()"
                ],
                "correctIndex": 0,
                "explanation": "`wire.NewSet()` digunakan untuk membungkus beberapa provider terkait menjadi satu unit re-usable ProviderSet."
        }
},
{
        "id": 164,
        "category": "Domain 14: Golang Dependency Injection",
        "timestamp": "00:39:10",
        "title": "Struct Provider & Property Injection (wire.Struct)",
        "desc": "Melakukan injeksi dependensi langsung ke field struct tanpa perlu membuat fungsi constructor manual.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Injeksi Langsung Field Struct (`wire.Struct`)</h3>\n            <p>Jika sebuah struct hanya berfungsi menampung dependensi tanpa ada logika inisialisasi kompleks di constructor, kita dapat menggunakan <code>wire.Struct</code> daripada membuat fungsi <code>New...()</code> secara manual.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Penggunaan wire.Struct:</div>\n                <pre>// Injeksi ke seluruh field struct:\nvar FooSet = wire.Struct(new(Foo), \"*\")\n\n// Injeksi spesifik field tertentu saja:\nvar BarSet = wire.Struct(new(Bar), \"MyRepo\", \"MyLogger\")</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype DB struct{}\ntype Logger struct{}\n\ntype AppService struct {\n\tDB     *DB\n\tLogger *Logger\n}\n\nfunc main() {\n\t// Simulasi wire.Struct(new(AppService), \"*\")\n\tapp := &AppService{\n\t\tDB:     &DB{},\n\t\tLogger: &Logger{},\n\t}\n\n\tfmt.Printf(\"AppService initialized with DB (%T) and Logger (%T)\\n\", app.DB, app.Logger)\n}",
        "quiz": {
                "question": "Karakter string apakah yang digunakan pada `wire.Struct(new(Foo), \"*\")` untuk menginjeksi seluruh field yang ada pada struct `Foo`?",
                "options": [
                        "Tanda bintang (*)",
                        "Tanda plus (+)",
                        "String \"all\"",
                        "Tanda seru (!)"
                ],
                "correctIndex": 0,
                "explanation": "String `\"*\"` pada parameter `wire.Struct` menginstruksikan Wire untuk otomatis mengisi seluruh field pada struct yang bersangkutan."
        }
},
{
        "id": 165,
        "category": "Domain 14: Golang Dependency Injection",
        "timestamp": "00:45:30",
        "title": "Cleanup Functions & Error Handling di Wire",
        "desc": "Menangani error return dari Provider dan mengelola fungsi penutupan resource (Cleanup/Close) di Wire.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Error Handling & Cleanup Functions</h3>\n            <p>Provider di Wire dapat mengembalikan error atau fungsi cleanup dengan signature <code>func()</code>.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Signature Provider dengan Error & Cleanup:</div>\n                <pre>func ProvideFile() (*os.File, func(), error) {\n    file, err := os.OpenFile(\"data.txt\", os.O_RDWR, 0644)\n    if err != nil {\n        return nil, nil, err\n    }\n    cleanup := func() {\n        file.Close() // Dipanggil saat aplikasi shutdown\n    }\n    return file, cleanup, nil\n}</pre>\n            </div>\n\n            <p>Wire akan secara otomatis meneruskan penanganan error ke Injector dan merangkai fungsi-fungsi cleanup untuk dipanggil di <code>main()</code>!</p>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc InitResource() (string, func(), error) {\n\tresource := \"Connection Established\"\n\tcleanup := func() {\n\t\tfmt.Println(\"🧹 CLEANUP: Resources closed successfully!\")\n\t}\n\treturn resource, cleanup, nil\n}\n\nfunc main() {\n\tres, cleanup, err := InitResource()\n\tif err != nil {\n\t\tfmt.Println(\"Error:\", err)\n\t\treturn\n\t}\n\n\tfmt.Println(\"Resource Status:\", res)\n\t// Eksekusi cleanup di akhir main\n\tdefer cleanup()\n}",
        "quiz": {
                "question": "Jika sebuah Provider mengembalikan nilai tuple `(T, func(), error)`, bagaimana perilaku Wire terhadap fungsi `func()` kedua?",
                "options": [
                        "Wire menganggapnya sebagai fungsi Cleanup dan akan meneruskannya ke fungsi Injector akhir untuk dieksekusi saat teardown/shutdown",
                        "Wire akan mengabaikan fungsi tersebut",
                        "Wire akan memicu panic saat kompilasi",
                        "Wire mengubah fungsi menjadi goroutine"
                ],
                "correctIndex": 0,
                "explanation": "Return tipe `func()` kedua pada Provider dikenali oleh Wire sebagai closure Cleanup yang berguna untuk melepas resource (seperti menutup koneksi DB/file)."
        }
},
{
        "id": 166,
        "category": "Domain 15: Database & MySQL",
        "timestamp": "00:02:00",
        "title": "Pengenalan Package database/sql & Driver",
        "desc": "Arsitektur pengelolaan database Relasional di Go.",
        "theoryHtml": "<div class=\"theory-section\"><h3>database/sql</h3><p>Package standar interface seragam untuk MySQL, PostgreSQL, SQLite. Memerlukan driver: <code>import _ \"github.com/go-sql-driver/mysql\"</code>.</p></div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"database/sql = interface standar RDBMS di Go\")\n\tfmt.Println(\"Driver MySQL: import _ \\\"github.com/go-sql-driver/mysql\\\"\")\n}",
        "quiz": {
                "question": "Mengapa import driver database pakai underscore (_)?",
                "options": [
                        "Agar fungsi init() driver dieksekusi tanpa dipanggil langsung",
                        "Menyembunyikan driver",
                        "Menjalankan di background",
                        "Khusus SQLite"
                ],
                "correctIndex": 0,
                "explanation": "Blank Import (_) memicu eksekusi init() tanpa menggunakan simbol package."
        }
},
{
        "id": 167,
        "category": "Domain 15: Database & MySQL",
        "timestamp": "00:09:00",
        "title": "Koneksi Database & Connection Pool",
        "desc": "Format DSN, sql.Open(), db.Ping(), dan konfigurasi Connection Pool.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Koneksi & Pool</h3><p>DSN: <code>user:pass@tcp(host:3306)/db</code>. <code>sql.Open()</code> membuat pool, <code>db.Ping()</code> verifikasi koneksi fisik.</p><ul><li><code>SetMaxOpenConns(100)</code></li><li><code>SetMaxIdleConns(10)</code></li><li><code>SetConnMaxLifetime(30 * time.Minute)</code></li></ul></div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"DSN: root:password@tcp(127.0.0.1:3306)/mydb\")\n\tfmt.Println(\"db, err := sql.Open(\\\"mysql\\\", dsn)\")\n\tfmt.Println(\"err = db.Ping()\")\n}",
        "quiz": {
                "question": "Method untuk memverifikasi koneksi fisik ke database?",
                "options": [
                        "db.Ping()",
                        "db.Connect()",
                        "db.Check()",
                        "db.Test()"
                ],
                "correctIndex": 0,
                "explanation": "sql.Open() tidak langsung konek. db.Ping() verifikasi koneksi aktual."
        }
},
{
        "id": 168,
        "category": "Domain 15: Database & MySQL",
        "timestamp": "00:27:00",
        "title": "Eksekusi SQL Write (db.ExecContext)",
        "desc": "INSERT, UPDATE, DELETE dengan db.ExecContext().",
        "theoryHtml": "<div class=\"theory-section\"><h3>db.ExecContext</h3><p>Untuk SQL yang tidak mengembalikan baris: INSERT, UPDATE, DELETE, CREATE TABLE.</p></div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"INSERT: db.ExecContext(ctx, \\\"INSERT INTO users(name) VALUES(?)\\\", name)\")\n\tfmt.Println(\"Hasil: result.LastInsertId(), result.RowsAffected()\")\n}",
        "quiz": {
                "question": "Method untuk eksekusi INSERT/UPDATE/DELETE?",
                "options": [
                        "db.ExecContext()",
                        "db.QueryContext()",
                        "db.FetchContext()",
                        "db.SelectContext()"
                ],
                "correctIndex": 0,
                "explanation": "ExecContext() untuk operasi penulisan tanpa result set."
        }
},
{
        "id": 169,
        "category": "Domain 15: Database & MySQL",
        "timestamp": "00:37:00",
        "title": "Membaca Data (QueryContext & QueryRowContext)",
        "desc": "SELECT multi-baris dengan QueryContext dan single-row dengan QueryRowContext.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Query Data</h3><ul><li><code>db.QueryContext()</code> — multiple rows, loop <code>rows.Next()</code> + <code>rows.Scan()</code></li><li><code>db.QueryRowContext()</code> — single row, langsung <code>.Scan()</code></li></ul></div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Multi: rows, _ := db.QueryContext(ctx, \\\"SELECT * FROM users\\\")\")\n\tfmt.Println(\"Loop: for rows.Next() { rows.Scan(&id, &name) }\")\n\tfmt.Println(\"Single: db.QueryRowContext(ctx, \\\"... WHERE id=?\\\", id).Scan(&name)\")\n}",
        "quiz": {
                "question": "Method rows untuk melangkah ke baris berikutnya?",
                "options": [
                        "rows.Next()",
                        "rows.Step()",
                        "rows.Read()",
                        "rows.Advance()"
                ],
                "correctIndex": 0,
                "explanation": "rows.Next() return true selama ada baris belum dibaca."
        }
},
{
        "id": 170,
        "category": "Domain 15: Database & MySQL",
        "timestamp": "00:54:00",
        "title": "SQL Injection & Parameterized Queries",
        "desc": "Bahaya SQL Injection dan cara mengamankan dengan placeholder ?.",
        "theoryHtml": "<div class=\"theory-section\"><h3>SQL Injection</h3><div class=\"callout callout-warning\"><div class=\"callout-title\">⛔ JANGAN:</div><p><code>\"SELECT * FROM users WHERE name='\" + input + \"'\"</code></p></div><div class=\"callout callout-tip\"><div class=\"callout-title\">✅ LAKUKAN:</div><p><code>db.QueryContext(ctx, \"SELECT * FROM users WHERE name=?\", input)</code></p></div></div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"=== CARA AMAN ===\")\n\tfmt.Println(\"Gunakan placeholder '?' dan kirim variabel terpisah\")\n\tfmt.Println(\"db.QueryContext(ctx, \\\"SELECT * FROM users WHERE email=?\\\", email)\")\n}",
        "quiz": {
                "question": "Cara standar mencegah SQL Injection di Go?",
                "options": [
                        "Parameterized Queries dengan placeholder '?'",
                        "Mengganti nama tabel",
                        "String concatenation",
                        "Mengubah password"
                ],
                "correctIndex": 0,
                "explanation": "Placeholder '?' membuat driver memperlakukan input sebagai literal data, bukan perintah SQL."
        }
},
{
        "id": 171,
        "category": "Domain 15: Database & MySQL",
        "timestamp": "01:12:00",
        "title": "Database Transactions (BeginTx, Commit, Rollback)",
        "desc": "Menjamin prinsip ACID dengan transaksi database.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Transaksi Database</h3><p>Sekumpulan SQL dieksekusi secara <strong>Atomic</strong>. Jika 1 gagal, seluruh perubahan di-Rollback.</p><pre>tx, _ := db.BeginTx(ctx, nil)\ndefer tx.Rollback()\ntx.ExecContext(...)\ntx.Commit()</pre></div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"=== TRANSACTION ===\")\n\tfmt.Println(\"1. tx, _ := db.BeginTx(ctx, nil)\")\n\tfmt.Println(\"2. defer tx.Rollback()\")\n\tfmt.Println(\"3. tx.ExecContext(...)\")\n\tfmt.Println(\"4. tx.Commit()\")\n}",
        "quiz": {
                "question": "Method untuk membatalkan seluruh perubahan query dalam transaksi?",
                "options": [
                        "tx.Rollback()",
                        "tx.Commit()",
                        "tx.Cancel()",
                        "tx.Undo()"
                ],
                "correctIndex": 0,
                "explanation": "tx.Rollback() membatalkan seluruh query yang dijalankan di transaksi."
        }
},
{
        "id": 172,
        "category": "Domain 15: Database & MySQL",
        "timestamp": "01:21:00",
        "title": "Prepared Statements & Nullable Columns",
        "desc": "Optimasi query berulang dengan PrepareContext dan handling NULL dengan sql.NullString.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Prepared Statement</h3><p><code>db.PrepareContext(ctx, query)</code> mengompilasi query plan sekali. sql.NullString / sql.NullInt64 untuk kolom nullable.</p></div>",
        "initialCode": "package main\n\nimport (\n\t\"database/sql\"\n\t\"fmt\"\n)\n\nfunc main() {\n\tvar name sql.NullString\n\tname.Valid = false\n\tif name.Valid {\n\t\tfmt.Println(\"Name:\", name.String)\n\t} else {\n\t\tfmt.Println(\"Name: (NULL)\")\n\t}\n}",
        "quiz": {
                "question": "Tipe data untuk menampung kolom string yang bisa NULL?",
                "options": [
                        "sql.NullString",
                        "string",
                        "sql.String",
                        "nil.String"
                ],
                "correctIndex": 0,
                "explanation": "sql.NullString memiliki field .String dan .Valid (boolean)."
        }
},
{
        "id": 173,
        "category": "Domain 15: Database & MySQL",
        "timestamp": "01:40:00",
        "title": "Repository Pattern & Clean Architecture",
        "desc": "Arsitektur profesional memisahkan layer Database dari layer Bisnis.",
        "theoryHtml": "<div class=\"theory-section\"><h3>Repository Pattern</h3><div class=\"callout callout-tip\"><div class=\"callout-title\">🏆 Clean Architecture</div><ul><li><strong>Entity:</strong> Struct model data</li><li><strong>Repository:</strong> Interface + impl query SQL</li><li><strong>Service:</strong> Logika bisnis</li><li><strong>Controller:</strong> HTTP handler</li></ul></div></div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"==========================================\")\n\tfmt.Println(\" SELAMAT MENYELESAIKAN DOMAIN DATABASE! \")\n\tfmt.Println(\"==========================================\")\n\tfmt.Println(\"Domain 1: Fondasi Bahasa Go (1-52)\")\n\tfmt.Println(\"Domain 2: Standard Library (53-74)\")\n\tfmt.Println(\"Domain 3: Go Modules & Dependency (75-80)\")\n\tfmt.Println(\"Domain 4: Golang Generics (81-88)\")\n\tfmt.Println(\"Domain 5: Unit Testing & Benchmark (89-98)\")\n\tfmt.Println(\"Domain 6: Goroutines & Concurrency (99-109)\")\n\tfmt.Println(\"Domain 7: Package Context (110-114)\")\n\tfmt.Println(\"Domain 8: Go Modern (1.21 - 1.26) (115-118)\")\n\tfmt.Println(\"Domain 9: Golang JSON (119-127)\")\n\tfmt.Println(\"Domain 10: Golang Logging (128-135)\")\n\tfmt.Println(\"Domain 11: Golang Embed (136-141)\")\n\tfmt.Println(\"Domain 12: Golang Viper Configuration (142-149)\")\n\tfmt.Println(\"Domain 13: Golang Validation (150-157)\")\n\tfmt.Println(\"Domain 14: Golang Dependency Injection (158-165)\")\n\tfmt.Println(\"Domain 15: Database & MySQL (166-173)\")\n}",
        "quiz": {
                "question": "Manfaat utama Repository Pattern?",
                "options": [
                        "Memisahkan logika akses data dari logika bisnis agar mudah diuji",
                        "Membuat database murah",
                        "Menghilangkan variabel",
                        "Mempercepat unduhan"
                ],
                "correctIndex": 0,
                "explanation": "Repository Pattern decouple layer database agar Service dapat diuji via Mocking."
        }
},
{
        "id": 174,
        "category": "Domain 16: Golang Database Migration",
        "timestamp": "00:01:10",
        "title": "Pengenalan Database Migration & Golang Migrate Tool",
        "desc": "Memahami konsep versi skema database (DDL) dan pentingnya automation migration di tim software.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Mengapa Membutuhkan Database Migration?</h3>\n            <p>Dalam pengembangan aplikasi tim, perubahan struktur database (seperti membuat tabel baru, menambah kolom, atau membuat index) harus tercatat dan terversi dengan rapi layaknya source code (Git).</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Masalah Tanpa Database Migration:</div>\n                <ul>\n                    <li>Skema database di local developer, staging, dan production sering tidak sinkron.</li>\n                    <li>Perubahan dilakukan secara manual melalui GUI database (DBeaver/phpMyAdmin) yang rentan human error.</li>\n                    <li>Kesulitan melakukan rollback (membatalkan perubahan DDL) saat timbul bug.</li>\n                </ul>\n            </div>\n\n            <h3>Golang Migrate (`golang-migrate/migrate`):</h3>\n            <p>Salah satu CLI tool & Go library terpopuler untuk mengelola database migration secara otomatis yang mendukung MySQL, PostgreSQL, SQLite, MongoDB, dll.</p>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== DEMO DATABASE MIGRATION ===\")\n\tfmt.Println(\"Database Migration mengelola versi DDL (Data Definition Language) skema DB.\")\n\tfmt.Println(\"Tool popular: golang-migrate/migrate\")\n}",
        "quiz": {
                "question": "Apakah tujuan utama dari penggunaan Database Migration pada pengembangan aplikasi?",
                "options": [
                        "Mengelola dan mencatat versi perubahan skema database secara terstruktur dan otomatis",
                        "Membuat database menjadi lebih cepat 10x lipat",
                        "Mengubah database relational menjadi NoSQL",
                        "Menghapus seluruh isi tabel secara otomatis setiap hari"
                ],
                "correctIndex": 0,
                "explanation": "Database Migration bertindak sebagai version control sistem untuk struktur/skema database agar selalu konsisten di semua environment."
        }
},
{
        "id": 175,
        "category": "Domain 16: Golang Database Migration",
        "timestamp": "00:06:50",
        "title": "Anatomi File Migration (.up.sql dan .down.sql)",
        "desc": "Memahami konvensi penamaan file migration, nomor versi, serta pasangan script Up dan Down.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Konvensi File Migration</h3>\n            <p>Tool <code>golang-migrate</code> mewajibkan file migration dibuat berpasangan dalam format SQL standar dengan aturan nama file berikut:</p>\n            \n            <pre>{version}_{title}.up.sql\n{version}_{title}.down.sql</pre>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Penjelasan File Up & Down:</div>\n                <ul>\n                    <li><strong>.up.sql:</strong> Berisi instruksi DDL untuk menerapkan perubahan (misal: <code>CREATE TABLE users (...)</code>).</li>\n                    <li><strong>.down.sql:</strong> Berisi instruksi DDL untuk membatalkan/rollback perubahan (misal: <code>DROP TABLE IF EXISTS users;</code>).</li>\n                </ul>\n            </div>\n\n            <p>Contoh penamaan versi dengan timestamp: <code>20260727000001_create_users_table.up.sql</code></p>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\tupSql := \"CREATE TABLE categories (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL);\"\n\tdownSql := \"DROP TABLE IF EXISTS categories;\"\n\n\tfmt.Println(\"=== MIGRATION SCRIPTS ===\")\n\tfmt.Println(\"[UP.SQL]  :\", upSql)\n\tfmt.Println(\"[DOWN.SQL]:\", downSql)\n}",
        "quiz": {
                "question": "Instruksi DDL apakah yang umumnya diletakkan di dalam file `.down.sql`?",
                "options": [
                        "Instruksi SQL untuk membatalkan/rollback perubahan DDL yang ada pada file .up.sql",
                        "Instruksi SELECT data untuk backup",
                        "Instruksi INSERT data dummy",
                        "Instruksi shutdown database server"
                ],
                "correctIndex": 0,
                "explanation": "File `.down.sql` berisi perintah pembatalan DDL (seperti `DROP TABLE` atau `ALTER TABLE DROP COLUMN`) untuk kemudahan rollback."
        }
},
{
        "id": 176,
        "category": "Domain 16: Golang Database Migration",
        "timestamp": "00:12:30",
        "title": "Perintah CLI golang-migrate (up, down, version, force)",
        "desc": "Menguasai perintah CLI `migrate` untuk eksekusi migration skema ke database.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Perintah Utama CLI `migrate`</h3>\n            <p>Setelah menginstall golang-migrate CLI, kita dapat menjalankan perintah-perintah berikut dari terminal:</p>\n\n            <table class=\"tech-table\">\n                <thead>\n                    <tr><th>Command CLI</th><th>Fungsi Utama</th></tr>\n                </thead>\n                <tbody>\n                    <tr><td><code>migrate create -ext sql -dir db/migrations -seq create_users_table</code></td><td>Membuat pasangan file migration baru dengan nomor urut.</td></tr>\n                    <tr><td><code>migrate -path db/migrations -database \"mysql://root:root@tcp(localhost:3306)/golang_db\" up</code></td><td>Menjalankan seluruh file migration `up` yang belum dieksekusi.</td></tr>\n                    <tr><td><code>migrate -path db/migrations -database \"...\" down 1</code></td><td>Rollback migration `down` sebanyak 1 langkah ke belakang.</td></tr>\n                    <tr><td><code>migrate -path db/migrations -database \"...\" version</code></td><td>Mengecek nomor versi migration yang aktif saat ini di DB.</td></tr>\n                </tbody>\n            </table>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== PERINTAH CLI MIGRATE ===\")\n\tfmt.Println(\"1. migrate create -ext sql -dir migrations -seq init_schema\")\n\tfmt.Println(\"2. migrate -path migrations -database 'mysql://...' up\")\n\tfmt.Println(\"3. migrate -path migrations -database 'mysql://...' down 1\")\n}",
        "quiz": {
                "question": "Perintah CLI `migrate` manakah yang digunakan untuk membatalkan tepat 1 versi migration terakhir?",
                "options": [
                        "migrate down 1",
                        "migrate rollback 1",
                        "migrate undo",
                        "migrate reset"
                ],
                "correctIndex": 0,
                "explanation": "Perintah `migrate down 1` akan mengeksekusi script `.down.sql` tepat untuk 1 versi paling akhir."
        }
},
{
        "id": 177,
        "category": "Domain 16: Golang Database Migration",
        "timestamp": "00:18:40",
        "title": "Managing Dirty State Migration & Handling Failed Migration",
        "desc": "Memahami kondisi Dirty State saat SQL migration gagal dan memperbaikinya dengan `migrate force`.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Apa itu Dirty State Migration?</h3>\n            <p>Jika terjadi kesalahan sintaks SQL di tengah-tengah eksekusi file migration `up` atau `down`, `golang-migrate` akan menandai kolom <code>dirty = true</code> pada tabel pelacak <code>schema_migrations</code> di database.</p>\n\n            <div class=\"callout callout-warning\">\n                <div class=\"callout-title\">⚠️ Efek Dirty State:</div>\n                <p>Selama status database masih <strong>dirty</strong>, `golang-migrate` akan menolak menjalankan migration selanjutnya untuk mencegah ketidakselarasan DDL.</p>\n            </div>\n\n            <h3>Cara Memperbaiki (Fixing Dirty State):</h3>\n            <ol>\n                <li>Perbaiki kesalahan sintaks pada file SQL terkait.</li>\n                <li>Jalankan command <code>force</code> untuk mereset versi yang gagal:\n                    <pre>migrate -path db/migrations -database \"...\" force {version_number}</pre>\n                </li>\n                <li>Jalankan kembali <code>migrate up</code>.</li>\n            </ol>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype SchemaMigration struct {\n\tVersion int64\n\tDirty   bool\n}\n\nfunc main() {\n\tstatus := SchemaMigration{Version: 2026072701, Dirty: true}\n\n\tfmt.Println(\"=== STATUS SCHEMA MIGRATIONS ===\")\n\tfmt.Printf(\"Version: %d | Dirty: %t\\n\", status.Version, status.Dirty)\n\tif status.Dirty {\n\t\tfmt.Println(\"⚠️ WARN: Database dalam kondisi DIRTY! Jalankan perintah 'migrate force'!\")\n\t}\n}",
        "quiz": {
                "question": "Perintah CLI golang-migrate apa yang digunakan untuk mereset flag `dirty` ke versi tertentu setelah memperbaiki SQL yang error?",
                "options": [
                        "migrate force {version}",
                        "migrate clean",
                        "migrate repair",
                        "migrate fix"
                ],
                "correctIndex": 0,
                "explanation": "Command `migrate force {version}` memaksa versi pada tabel `schema_migrations` di-set ulang dan menghapus status dirty."
        }
},
{
        "id": 178,
        "category": "Domain 16: Golang Database Migration",
        "timestamp": "00:25:15",
        "title": "Programmatic Database Migration (Running Migration via Go Code)",
        "desc": "Mengeksekusi database migration secara otomatis dari dalam kode Go saat aplikasi dinyalakan.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Programmatic Migration di Kode Go</h3>\n            <p>Selain menggunakan CLI terminal terpisah, kita dapat mengintegrasikan library <code>golang-migrate/migrate/v4</code> langsung ke dalam fungsi <code>main()</code> aplikasi Go. Hal ini memastikan database selalu ter-update secara otomatis begitu aplikasi di-deploy.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Contoh Kode Go Programmatic Migration:</div>\n                <pre>import (\n    \"github.com/golang-migrate/migrate/v4\"\n    _ \"github.com/golang-migrate/migrate/v4/database/mysql\"\n    _ \"github.com/golang-migrate/migrate/v4/source/file\"\n)\n\nm, err := migrate.New(\"file://db/migrations\", \"mysql://root:root@tcp(localhost:3306)/golang_db\")\nif err != nil {\n    log.Fatal(err)\n}\nif err := m.Up(); err != nil && err != migrate.ErrNoChange {\n    log.Fatal(err)\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc AutoMigrate(dbUrl string) string {\n\t// Simulasi pemanggilan m.Up()\n\treturn \"Migration UP sukses dijalankan secara otomatis saat startup aplikasi!\"\n}\n\nfunc main() {\n\tfmt.Println(\"=== PROGRAMMATIC MIGRATION DEMO ===\")\n\tresult := AutoMigrate(\"mysql://user:pass@tcp(127.0.0.1:3306)/appdb\")\n\tfmt.Println(result)\n}",
        "quiz": {
                "question": "Error khusus apakah dari library `golang-migrate` yang menandakan bahwa skema database sudah paling baru dan tidak ada file migration baru yang perlu dijalankan?",
                "options": [
                        "migrate.ErrNoChange",
                        "migrate.ErrDone",
                        "migrate.ErrUpToDate",
                        "nil"
                ],
                "correctIndex": 0,
                "explanation": "`migrate.ErrNoChange` dikembalikan oleh `m.Up()` ketika versi di database sudah sama dengan versi file migration tertinggi."
        }
},
{
        "id": 179,
        "category": "Domain 16: Golang Database Migration",
        "timestamp": "00:31:20",
        "title": "Strategi Rollback & Schema Versioning Best Practices",
        "desc": "Panduan praktik terbaik mengelola versi skema database di lingkungan produksi dan pipeline CI/CD.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Best Practices Database Migration</h3>\n            \n            <ul>\n                <li><strong>Backward Compatibility:</strong> Hindari menghapus kolom yang masih dibaca oleh versi aplikasi lama. Gunakan strategi 2-step deployment (Deprecate -> Drop).</li>\n                <li><strong>Gunakan Embed untuk File Migration:</strong> Kemas folder migration ke dalam binary Go menggunakan <code>//go:embed</code> agar aplikasi tidak membutuhkan file SQL fisik terpisah di server.</li>\n                <li><strong>Gunakan Transaction DDL jika Didukung:</strong> Database seperti PostgreSQL mendukung transaksi untuk DDL (sehingga jika migration gagal, otomatis rollback penuh).</li>\n                <li><strong>Otomatisasi di CI/CD:</strong> Jalankan verifikasi lint SQL migration pada Pull Request sebelum di-merge ke branch main.</li>\n            </ul>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== BEST PRACTICES MIGRATION ===\")\n\tfmt.Println(\"1. Embed file migration SQL menggunakan //go:embed\")\n\tfmt.Println(\"2. Buat perubahan DDL yang compatible ke belakang (Backward Compatible)\")\n\tfmt.Println(\"3. Uji coba script .down.sql secara berkala\")\n}",
        "quiz": {
                "question": "Mengapa meng-embed folder file SQL migration menggunakan `//go:embed` sangat direkomendasikan saat running programmatic migration?",
                "options": [
                        "Agar file SQL terkemas langsung dalam satu binary executable Go tanpa perlu menyalin folder fisik ke server produksi",
                        "Agar query SQL menjadi terenkripsi",
                        "Agar database MySQL berubah menjadi SQLite",
                        "Agar tidak perlu menginstall driver database"
                ],
                "correctIndex": 0,
                "explanation": "Dengan `//go:embed`, file migration berada di dalam binary Go, mempermudah deployment single binary."
        }
},
{
        "id": 180,
        "category": "Domain 16: Golang Database Migration",
        "timestamp": "00:37:00",
        "title": "Integration Database Migration dengan Driver MySQL/PostgreSQL",
        "desc": "Menggunakan driver instance `database/sql` Go langsung pada objek migration.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Migration dengan Instance `*sql.DB`</h3>\n            <p>Selain memberikan string URL koneksi, `golang-migrate` mengizinkan kita menggunakan instance koneksi <code>*sql.DB</code> yang sudah ada menggunakan driver bawaan seperti <code>mysql.WithInstance(db, &mysql.Config{})</code>.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Contoh Penggunaan Driver Instance:</div>\n                <pre>import (\n    \"database/sql\"\n    \"github.com/golang-migrate/migrate/v4\"\n    \"github.com/golang-migrate/migrate/v4/database/mysql\"\n)\n\ndb, _ := sql.Open(\"mysql\", \"root:root@tcp(127.0.0.1:3306)/golang_db\")\ndriver, _ := mysql.WithInstance(db, &mysql.Config{})\nm, _ := migrate.NewWithDatabaseInstance(\"file://db/migrations\", \"mysql\", driver)</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== INTEGRASI DRIVER DB INSTANCE ===\")\n\tfmt.Println(\"Membuka koneksi sql.Open() -> Membuat driver instance -> Memanggil NewWithDatabaseInstance()\")\n\tfmt.Println(\"Keuntungan: Dapat menghemat pool koneksi database aplikasi.\")\n}",
        "quiz": {
                "question": "Fungsi bawaan golang-migrate manakah yang digunakan untuk membuat objek migration dari instance `*sql.DB` yang sudah terkoneksi?",
                "options": [
                        "migrate.NewWithDatabaseInstance()",
                        "migrate.NewFromConnection()",
                        "migrate.CreateWithSqlDB()",
                        "migrate.BindDriver()"
                ],
                "correctIndex": 0,
                "explanation": "`migrate.NewWithDatabaseInstance()` menerima source driver serta database driver instance dari `*sql.DB`."
        }
},
{
        "id": 181,
        "category": "Domain 17: Golang GORM ORM Framework",
        "timestamp": "00:01:10",
        "title": "Pengenalan GORM & DB Connection Setup",
        "desc": "Memahami konsep Object-Relational Mapping (ORM) dan membuka koneksi database MySQL/PostgreSQL dengan GORM.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Apa itu GORM?</h3>\n            <p><strong>GORM</strong> adalah library Object-Relational Mapping (ORM) paling populer untuk Golang. GORM memungkinkan developer berinteraksi dengan database relasional (MySQL, PostgreSQL, SQLite, SQL Server) menggunakan <strong>Go Struct</strong> tanpa perlu menulis SQL manual secara berulang.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Keunggulan Utama GORM:</div>\n                <ul>\n                    <li>Auto Migration skema tabel otomatis dari Go Struct.</li>\n                    <li>Mendukung relasi lengkap (Has One, Has Many, Belongs To, Many To Many).</li>\n                    <li>Fitur Transactions, Nested Transactions, dan SavePoint.</li>\n                    <li>Context, Preloading (Eager Loading), dan Callbacks/Hooks.</li>\n                </ul>\n            </div>\n\n            <h3>Instalasi GORM & Driver:</h3>\n            <pre>go get gorm.io/gorm\ngo get gorm.io/driver/mysql  # Driver MySQL\ngo get gorm.io/driver/postgres # Driver Postgres</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\n// Simulasi Koneksi Database GORM\ntype GormDB struct {\n\tDialect string\n\tDSN     string\n}\n\nfunc OpenGorm(dialect, dsn string) (*GormDB, error) {\n\tfmt.Printf(\"[GORM] Opening connection to %s DB with DSN: %s\\n\", dialect, dsn)\n\treturn &GormDB{Dialect: dialect, DSN: dsn}, nil\n}\n\nfunc main() {\n\tfmt.Println(\"=== INITIALIZING GORM DB CONNECTION ===\")\n\tdsn := \"user:pass@tcp(127.0.0.1:3306)/my_db?charset=utf8mb4&parseTime=True&loc=Local\"\n\tdb, err := OpenGorm(\"mysql\", dsn)\n\tif err == nil {\n\t\tfmt.Println(\"Koneksi Database GORM Berhasil Dibuat!\")\n\t\t_ = db\n\t}\n}",
        "quiz": {
                "question": "Fungsi utama dari library Object-Relational Mapping (ORM) seperti GORM adalah?",
                "options": [
                        "Memetakan tabel database ke dalam struktur Go Struct dan sebaliknya",
                        "Membuat aplikasi Golang berjalan tanpa perlu database",
                        "Mengkompresi ukuran file biner hasil compile Go",
                        "Mengubah kode Go menjadi JavaScript"
                ],
                "correctIndex": 0,
                "explanation": "ORM memetakan baris dan kolom tabel relasional menjadi objek / struct dalam bahasa pemograman."
        }
},
{
        "id": 182,
        "category": "Domain 17: Golang GORM ORM Framework",
        "timestamp": "00:08:30",
        "title": "Defining GORM Models, Struct Tags & AutoMigrate",
        "desc": "Mendefinisikan GORM Model, menggunakan gorm.Model base struct, dan menjalankan skema database AutoMigrate.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Mendesain GORM Model & AutoMigrate</h3>\n            <p>Di GORM, tabel database direpresentasikan oleh <strong>Struct</strong>. GORM menyediakan struct bawaan <code>gorm.Model</code> yang sudah berisi field umum: <code>ID</code>, <code>CreatedAt</code>, <code>UpdatedAt</code>, dan <code>DeletedAt</code> (Soft Delete).</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Contoh Definisi Model & Tag:</div>\n                <pre>type Product struct {\n    gorm.Model\n    Code  string  `gorm:\"type:varchar(50);uniqueIndex;not null\"`\n    Price float64 `gorm:\"type:decimal(10,2);default:0\"`\n}\n\n// Menjalankan Auto Migration (membuat/memperbarui tabel otomatis)\ndb.AutoMigrate(&Product{})</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\ntype GormModel struct {\n\tID        uint       `json:\"id\"`\n\tCreatedAt time.Time  `json:\"created_at\"`\n\tUpdatedAt time.Time  `json:\"updated_at\"`\n\tDeletedAt *time.Time `json:\"deleted_at,omitempty\"`\n}\n\ntype Category struct {\n\tGormModel\n\tName string `json:\"name\"`\n\tSlug string `json:\"slug\"`\n}\n\nfunc main() {\n\tcat := Category{\n\t\tGormModel: GormModel{ID: 1, CreatedAt: time.Now(), UpdatedAt: time.Now()},\n\t\tName:      \"Electronics\",\n\t\tSlug:      \"electronics\",\n\t}\n\n\tfmt.Println(\"=== MODEL CATEGORY GORM DEMO ===\")\n\tfmt.Printf(\"ID: %d | Name: %s | Slug: %s\\n\", cat.ID, cat.Name, cat.Slug)\n\tfmt.Println(\"CreatedAt:\", cat.CreatedAt.Format(\"2006-01-02 15:04:05\"))\n}",
        "quiz": {
                "question": "Field apa sajakah yang sudah otomatis tersedia di dalam struct bawaan `gorm.Model`?",
                "options": [
                        "ID, CreatedAt, UpdatedAt, DeletedAt",
                        "ID, Name, Description, Status",
                        "Uuid, CreatedBy, UpdatedBy",
                        "ID, IsActive, Version"
                ],
                "correctIndex": 0,
                "explanation": "`gorm.Model` secara otomatis menyediakan 4 field standar pendukung audit dan soft delete."
        }
},
{
        "id": 183,
        "category": "Domain 17: Golang GORM ORM Framework",
        "timestamp": "00:15:40",
        "title": "CRUD Basic Operations: Insert & Single Record Creation",
        "desc": "Memasukkan data baru ke database menggunakan db.Create() dan batch insert.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Membuat Record Baru (Insert)</h3>\n            <p>Untuk memasukkan data baru ke database, kita cukup menginstansiasi Struct lalu memanggil <code>db.Create(&object)</code>. GORM akan mengisi kembali nilai `ID` auto-increment dan timestamp ke struct tersebut.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Batch Insert (Multiple Records):</div>\n                <pre>users := []User{\n    {Name: \"Budi\", Age: 20},\n    {Name: \"Siti\", Age: 22},\n}\nresult := db.Create(&users) // Menginsert banyak record sekaligus dalam 1 query SQL!\nfmt.Println(\"Jumlah record terinsert:\", result.RowsAffected)</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype User struct {\n\tID   uint\n\tName string\n\tAge  int\n}\n\nfunc main() {\n\tvar usersDB []User\n\tautoIncID := uint(1)\n\n\t// Simulasi db.Create()\n\tnewUser := User{Name: \"Eko Kurniawan\", Age: 30}\n\tnewUser.ID = autoIncID\n\tusersDB = append(usersDB, newUser)\n\n\tfmt.Println(\"=== DEMO GORM db.Create() ===\")\n\tfmt.Printf(\"User Terinsert => ID: %d | Name: %s | Age: %d\\n\", newUser.ID, newUser.Name, newUser.Age)\n\tfmt.Println(\"Total Rows in DB:\", len(usersDB))\n}",
        "quiz": {
                "question": "Properti apakah pada objek `*gorm.DB` hasil eksekusi `db.Create()` yang menyimpan informasi jumlah baris data yang berhasil dimasukkan ke database?",
                "options": [
                        "result.RowsAffected",
                        "result.Count",
                        "result.InsertedCount",
                        "result.Rows"
                ],
                "correctIndex": 0,
                "explanation": "`result.RowsAffected` berisi angka kuantitas baris tabel yang terpengaruh operasi SQL."
        }
},
{
        "id": 184,
        "category": "Domain 17: Golang GORM ORM Framework",
        "timestamp": "00:23:00",
        "title": "Querying Records (First, Find, Where, Like, Order, Limit)",
        "desc": "Mencari dan memfilter data dari database menggunakan metode First, Find, Where, dan pencarian berantai (chaining).",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Membaca Data (Querying)</h3>\n            <p>GORM menyediakan API fluent interface untuk query data secara mudah.</p>\n\n            <table class=\"table-styled\">\n                <thead>\n                    <tr>\n                        <th>Metode GORM</th>\n                        <th>Penjelasan</th>\n                        <th>Query SQL Setara</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr>\n                        <td><code>db.First(&user)</code></td>\n                        <td>Mengambil 1 record pertama berdasarkan urutan Primary Key.</td>\n                        <td><code>SELECT * FROM users ORDER BY id LIMIT 1</code></td>\n                    </tr>\n                    <tr>\n                        <td><code>db.Find(&users)</code></td>\n                        <td>Mengambil seluruh record ke dalam Slice.</td>\n                        <td><code>SELECT * FROM users</code></td>\n                    </tr>\n                    <tr>\n                        <td><code>db.Where(\"age > ?\", 18)</code></td>\n                        <td>Menambahkan klausa WHERE dengan prepared statement.</td>\n                        <td><code>WHERE age > 18</code></td>\n                    </tr>\n                    <tr>\n                        <td><code>db.Order(\"age desc\").Limit(5)</code></td>\n                        <td>Pengurutan dan pembatasan jumlah data.</td>\n                        <td><code>ORDER BY age DESC LIMIT 5</code></td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype Customer struct {\n\tID   int\n\tName string\n\tCity string\n}\n\nfunc main() {\n\tcustomers := []Customer{\n\t\t{ID: 1, Name: \"Andi\", City: \"Jakarta\"},\n\t\t{ID: 2, Name: \"Budi\", City: \"Bandung\"},\n\t\t{ID: 3, Name: \"Cici\", City: \"Jakarta\"},\n\t}\n\n\tfmt.Println(\"=== DEMO GORM WHERE FILTER (City = Jakarta) ===\")\n\tfor _, c := range customers {\n\t\tif c.City == \"Jakarta\" {\n\t\t\tfmt.Printf(\"- Customer ID %d: %s (%s)\\n\", c.ID, c.Name, c.City)\n\t\t}\n\t}\n}",
        "quiz": {
                "question": "Mengapa kita disarankan menggunakan wildcard tanda tanya `?` pada klausa `db.Where(\"name = ?\", input)` daripada melakukan string concatenation secara langsung?",
                "options": [
                        "Untuk mencegah bahaya serangan SQL Injection melalui Prepared Statement",
                        "Agar string pencarian berubah menjadi huruf kapital",
                        "Karena GORM tidak mendukung pemformatan string biasa",
                        "Untuk mempercepat pencarian data hingga 100x"
                ],
                "correctIndex": 0,
                "explanation": "Penggunaan tanda tanya `?` memanfaatkan Prepared Statement bawaan database yang aman dari SQL Injection."
        }
},
{
        "id": 185,
        "category": "Domain 17: Golang GORM ORM Framework",
        "timestamp": "00:30:10",
        "title": "Updates & Deletions (Save, Updates, Delete, Soft Delete)",
        "desc": "Mengubah data dengan Save/Updates dan menghapus data dengan Soft Delete (gorm.DeletedAt).",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Update & Delete pada GORM</h3>\n            <p>Untuk mengupdate record, kita bisa memilih mengupdate seluruh field (<code>db.Save(&user)</code>) atau hanya field tertentu (<code>db.Model(&user).Updates(User{Name: \"New Name\"})</code>).</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Apa itu Soft Delete?</div>\n                <p>Jika model memiliki field <code>gorm.DeletedAt</code>, pemanggilan <code>db.Delete(&user)</code> <strong>TIDAK akan menghapus baris dari tabel MySQL</strong>. GORM hanya akan mengisikan kolom `deleted_at` dengan waktu saat ini.</p>\n                <p>Query pencarian selanjutnya secara otomatis akan mengabaikan record yang sudah di-soft-delete!</p>\n            </div>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Mengambil Data Terhapus:</div>\n                <pre>db.Unscoped().Where(\"id = ?\", 1).First(&user) // Memaksa membaca data yang ter-soft-delete</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\ntype SoftDeleteUser struct {\n\tID        int\n\tName      string\n\tDeletedAt *time.Time\n}\n\nfunc main() {\n\tnow := time.Now()\n\tuser := SoftDeleteUser{\n\t\tID:        10,\n\t\tName:      \"Dewi\",\n\t\tDeletedAt: &now, // Soft deleted\n\t}\n\n\tfmt.Println(\"=== DEMO SOFT DELETE GORM ===\")\n\tfmt.Printf(\"User ID %d (%s)\\n\", user.ID, user.Name)\n\tif user.DeletedAt != nil {\n\t\tfmt.Println(\"Status Data: TERHAPUS SECARA SOFT DELETE pada\", user.DeletedAt.Format(\"15:04:05\"))\n\t\tfmt.Println(\"Query biasa 'db.Find()' akan otomatis menyembunyikan data ini.\")\n\t}\n}",
        "quiz": {
                "question": "Fungsi method GORM apakah yang digunakan untuk memaksa pembacaan data yang telah di-soft delete?",
                "options": [
                        "db.Unscoped()",
                        "db.IncludeDeleted()",
                        "db.WithTrash()",
                        "db.IgnoreSoftDelete()"
                ],
                "correctIndex": 0,
                "explanation": "`db.Unscoped()` mematikan filter otomatis `deleted_at IS NULL` dari GORM."
        }
},
{
        "id": 186,
        "category": "Domain 17: Golang GORM ORM Framework",
        "timestamp": "00:37:40",
        "title": "GORM Relationships: Belongs To & Has One",
        "desc": "Membuat dan memetakan relasi 1-to-1 antara dua struct (Belongs To & Has One) menggunakan foreign key.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Relasi 1-to-1 di GORM</h3>\n            <p>GORM mendukung pembuatan relasi database antar tabel secara deklaratif.</p>\n\n            <ul>\n                <li><strong>Belongs To:</strong> Struct child menyimpan `ForeignKey` dari struct parent (misal: User `Belongs To` Company).</li>\n                <li><strong>Has One:</strong> Struct parent memiliki tepat 1 child (misal: User `Has One` CreditCard).</li>\n            </ul>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Definisi Struct Belongs To:</div>\n                <pre>type Company struct {\n    ID   int\n    Name string\n}\n\ntype User struct {\n    gorm.Model\n    Name      string\n    CompanyID int     // Foreign Key\n    Company   Company // Relasi Belongs To\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype Company struct {\n\tID   int\n\tName string\n}\n\ntype Employee struct {\n\tID        int\n\tName      string\n\tCompanyID int\n\tCompany   Company // Belongs To\n}\n\nfunc main() {\n\temp := Employee{\n\t\tID:        1,\n\t\tName:      \"Rian\",\n\t\tCompanyID: 101,\n\t\tCompany:   Company{ID: 101, Name: \"PT Tech Indonesia\"},\n\t}\n\n\tfmt.Println(\"=== RELASI BELONGS TO GORM ===\")\n\tfmt.Printf(\"Karyawan: %s | Perusahaan: %s (FK CompanyID: %d)\\n\", emp.Name, emp.Company.Name, emp.CompanyID)\n}",
        "quiz": {
                "question": "Secara default, jika nama relasi struct adalah `Company`, apakah nama kolom Foreign Key yang dicari oleh GORM pada tabel pendukung?",
                "options": [
                        "CompanyID",
                        "company_fk",
                        "id_company",
                        "Company_ID"
                ],
                "correctIndex": 0,
                "explanation": "GORM menggunakan konvensi `NamaRelasi + ID` (contoh `CompanyID`) sebagai Foreign Key standar."
        }
},
{
        "id": 187,
        "category": "Domain 17: Golang GORM ORM Framework",
        "timestamp": "00:45:00",
        "title": "GORM Relationships: Has Many & Many to Many",
        "desc": "Mengelola relasi 1-to-N dan N-to-N serta menggunakan db.Preload() untuk eager loading data relasi.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Relasi Has Many & Many to Many</h3>\n            <p>Saat satu record memiliki banyak anak (misal: 1 User punya banyak CreditCard atau 1 User punya banyak Role), kita menggunakan relasi <strong>Has Many</strong> atau <strong>Many to Many</strong>.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Apa itu Preloading (Eager Loading)?</div>\n                <p>Secara default, GORM tidak akan mengambil data relasi untuk menghemat memory (Lazy). Untuk mengambil data anak sekaligus saat query, kita WAJIB memanggil <code>db.Preload(\"NamaFieldRelasi\")</code>.</p>\n                <pre>var user User\ndb.Preload(\"CreditCards\").Preload(\"Roles\").First(&user, 1)\n// Sekarang user.CreditCards dan user.Roles sudah terisi lengkap!</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype CreditCard struct {\n\tNumber string\n}\n\ntype UserHasMany struct {\n\tName        string\n\tCreditCards []CreditCard // Has Many\n}\n\nfunc main() {\n\tuser := UserHasMany{\n\t\tName: \"Budi Santoso\",\n\t\tCreditCards: []CreditCard{\n\t\t\t{Number: \"4567-xxxx-1122\"},\n\t\t\t{Number: \"5412-xxxx-9900\"},\n\t\t},\n\t}\n\n\tfmt.Println(\"=== GORM PRELOAD (EAGER LOADING) SIMULATION ===\")\n\tfmt.Println(\"User Name:\", user.Name)\n\tfmt.Println(\"Daftar Kartu Kredit (Preloaded):\")\n\tfor i, card := range user.CreditCards {\n\t\tfmt.Printf(\"  %d. %s\\n\", i+1, card.Number)\n\t}\n}",
        "quiz": {
                "question": "Fungsi method GORM apakah yang digunakan untuk melakukan Eager Loading (Preload) terhadap data relasi child?",
                "options": [
                        "db.Preload(\"FieldName\")",
                        "db.Join(\"FieldName\")",
                        "db.Include(\"FieldName\")",
                        "db.Fetch(\"FieldName\")"
                ],
                "correctIndex": 0,
                "explanation": "`db.Preload(\"Relasi\")` mengeksekusi query tambahan di belakang layar untuk mengisikan slice relasi."
        }
},
{
        "id": 188,
        "category": "Domain 17: Golang GORM ORM Framework",
        "timestamp": "00:52:30",
        "title": "GORM Transactions & Hooks (Callbacks)",
        "desc": "Menjaga integritas data transaksi bisnis dengan db.Transaction() dan memanfaatkan GORM Lifecycle Hooks.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Database Transaction & Lifecycle Hooks</h3>\n            <p>Database Transaction memastikan sekumpulan operasi SQL berhasil **semuanya** (Commit) atau gagal **semuanya** (Rollback).</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Otomatisasi Transaksi dengan db.Transaction:</div>\n                <pre>err := db.Transaction(func(tx *gorm.DB) error {\n    if err := tx.Create(&user).Error; err != nil {\n        return err // Otomatis Rollback!\n    }\n    if err := tx.Create(&account).Error; err != nil {\n        return err // Otomatis Rollback!\n    }\n    return nil // Otomatis Commit!\n})</pre>\n            </div>\n\n            <h3>GORM Hooks (Callbacks):</h3>\n            <p>Hooks adalah fungsi yang dipanggil otomatis sebelum/sesudah operasi (misal: <code>BeforeCreate</code> untuk me-hash password).</p>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype Account struct {\n\tBalance float64\n}\n\nfunc TransferMoney(from, to *Account, amount float64) error {\n\tif from.Balance < amount {\n\t\treturn fmt.Errorf(\"ROLLBACK: Saldo pengirim tidak mencukupi\")\n\t}\n\tfrom.Balance -= amount\n\tto.Balance += amount\n\treturn nil // COMMIT\n}\n\nfunc main() {\n\tacc1 := &Account{Balance: 500000}\n\tacc2 := &Account{Balance: 100000}\n\n\tfmt.Println(\"=== SIMULASI TRANSACTION TRANSFER ===\")\n\terr := TransferMoney(acc1, acc2, 200000)\n\tif err == nil {\n\t\tfmt.Println(\"TRANSAKSI COMMIT BERHASIL!\")\n\t\tfmt.Printf(\"Saldo Acc1: %.0f | Saldo Acc2: %.0f\\n\", acc1.Balance, acc2.Balance)\n\t}\n}",
        "quiz": {
                "question": "Apa yang terjadi secara otomatis jika closure fungsi di dalam `db.Transaction(func(tx *gorm.DB) error { ... })` mengembalikan nilai `error`?",
                "options": [
                        "GORM akan otomatis melakukan ROLLBACK terhadap seluruh query dalam transaksi tersebut",
                        "GORM akan mengabaikan error dan melakukan COMMIT",
                        "Aplikasi Golang akan otomatis mengalami Crash Panic",
                        "Database MySQL akan langsung mati"
                ],
                "correctIndex": 0,
                "explanation": "Jika closure mengembalikan `error`, `db.Transaction` otomatis mengeksekusi Rollback untuk membatalkan seluruh perubahan."
        }
},
{
        "id": 189,
        "category": "Domain 17: Golang GORM ORM Framework",
        "timestamp": "00:59:40",
        "title": "Advanced GORM: Raw SQL, Exec & Scopes",
        "desc": "Mengeksekusi query SQL kustom dengan db.Raw() dan mengisolasi logika query reusable menggunakan Scopes.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Raw SQL & Reusable Scopes</h3>\n            <p>Meskipun menggunakan ORM, terkadang kita butuh mengeksekusi query SQL kompleks secara manual atau menggunakan reusable filter (Scopes).</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Memanggil Raw SQL:</div>\n                <pre>db.Raw(\"SELECT id, name FROM users WHERE age > ?\", 20).Scan(&results)\ndb.Exec(\"UPDATE users SET status = ? WHERE id = ?\", \"ACTIVE\", 10)</pre>\n            </div>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Menggunakan Scopes:</div>\n                <pre>func ActiveUsers(db *gorm.DB) *gorm.DB {\n    return db.Where(\"status = ?\", \"ACTIVE\")\n}\n\n// Penggunaan Scopes yang sangat rapi:\ndb.Scopes(ActiveUsers).Find(&users)</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype UserScope struct {\n\tName   string\n\tStatus string\n}\n\nfunc FilterActive(users []UserScope) []UserScope {\n\tvar active []UserScope\n\tfor _, u := range users {\n\t\tif u.Status == \"ACTIVE\" {\n\t\t\tactive = append(active, u)\n\t\t}\n\t}\n\treturn active\n}\n\nfunc main() {\n\tlist := []UserScope{\n\t\t{Name: \"Budi\", Status: \"ACTIVE\"},\n\t\t{Name: \"Joko\", Status: \"SUSPENDED\"},\n\t\t{Name: \"Siti\", Status: \"ACTIVE\"},\n\t}\n\n\tactiveUsers := FilterActive(list)\n\tfmt.Println(\"=== DEMO GORM SCOPES (FILTER ACTIVE) ===\")\n\tfor _, u := range activeUsers {\n\t\tfmt.Println(\"Active User:\", u.Name)\n\t}\n}",
        "quiz": {
                "question": "Fungsi GORM apakah yang digunakan untuk mengeksekusi perintah SQL `UPDATE` atau `DELETE` kustom tanpa mengembalikan dataset baris?",
                "options": [
                        "db.Exec()",
                        "db.Raw()",
                        "db.Query()",
                        "db.Run()"
                ],
                "correctIndex": 0,
                "explanation": "`db.Exec(sql, args...)` digunakan untuk eksekusi SQL DML/DDL yang tidak mengembalikan baris data."
        }
},
{
    "id": 190,
    "category": "Domain 18: Database Go Modern",
    "timestamp": "00:00:00",
    "title": "pgx - Driver PostgreSQL Berkinerja Tinggi",
    "desc": "Memakai pgx secara native beserta connection pool, batch query, COPY untuk sisipan massal, dan penanganan error PostgreSQL yang spesifik.",
    "theoryHtml": `
        <div class="theory-section">
            <h3>Kenapa pgx, Bukan database/sql</h3>
            <p><code>database/sql</code> adalah antarmuka umum yang harus melayani semua database, sehingga fitur khas PostgreSQL tidak terjangkau. <code>pgx</code> berbicara langsung dengan protokol PostgreSQL.</p>

            <table class="tech-table">
                <thead><tr><th>Kemampuan</th><th>database/sql + lib/pq</th><th>pgx native</th></tr></thead>
                <tbody>
                    <tr><td>Prepared statement cache</td><td>Terbatas</td><td>Otomatis &amp; efisien</td></tr>
                    <tr><td>Tipe PostgreSQL (array, JSONB, range)</td><td>Perlu pembungkus manual</td><td>Didukung langsung</td></tr>
                    <tr><td>Protokol biner</td><td>Tidak</td><td>Ya — parsing lebih cepat</td></tr>
                    <tr><td>COPY untuk sisipan massal</td><td>Tidak nyaman</td><td>Bawaan</td></tr>
                    <tr><td>LISTEN/NOTIFY</td><td>Tidak</td><td>Ya</td></tr>
                    <tr><td>Batch query</td><td>Tidak</td><td>Ya — satu round-trip</td></tr>
                    <tr><td>Detail error PostgreSQL</td><td>Terbatas</td><td>Lengkap (<code>pgconn.PgError</code>)</td></tr>
                </tbody>
            </table>

            <h3>Connection Pool</h3>
            <div class="code-box">
                <pre>import "github.com/jackc/pgx/v5/pgxpool"

func buatPool(ctx context.Context, dsn string) (*pgxpool.Pool, error) {
    cfg, err := pgxpool.ParseConfig(dsn)
    if err != nil {
        return nil, err
    }

    cfg.MaxConns        = 25
    cfg.MinConns        = 5
    cfg.MaxConnLifetime = 30 * time.Minute
    cfg.MaxConnIdleTime = 5 * time.Minute
    cfg.HealthCheckPeriod = 1 * time.Minute

    pool, err := pgxpool.NewWithConfig(ctx, cfg)
    if err != nil {
        return nil, err
    }
    if err := pool.Ping(ctx); err != nil {
        return nil, fmt.Errorf("ping database: %w", err)
    }
    return pool, nil
}</pre>
            </div>

            <div class="callout callout-warning">
                <div class="callout-title">⚠️ MaxConns harus dihitung, bukan ditebak</div>
                <p>PostgreSQL punya batas <code>max_connections</code> (bawaan sekitar 100). Bila 10 pod masing-masing membuka 25 koneksi, itu 250 koneksi — melebihi batas, dan pod yang datang belakangan akan gagal terhubung.</p>
                <p>Hitung dengan: <code>MaxConns × jumlah_replika ≤ max_connections − cadangan_admin</code>. Untuk jumlah pod yang besar, gunakan <strong>PgBouncer</strong> sebagai penggabung koneksi. Perlu diingat bahwa PgBouncer dalam mode <em>transaction pooling</em> tidak mendukung prepared statement bernama — pada kasus itu pgx harus dikonfigurasi dengan <code>QueryExecModeSimpleProtocol</code>.</p>
            </div>

            <h3>Kueri</h3>
            <div class="code-box">
                <pre>// Satu baris
var p Pesanan
err := pool.QueryRow(ctx,
    "SELECT id, total, status FROM pesanan WHERE id = $1", id,
).Scan(&p.ID, &p.Total, &p.Status)

if errors.Is(err, pgx.ErrNoRows) {
    return nil, ErrTidakDitemukan
}

// Banyak baris dengan pemindaian otomatis ke struct
baris, err := pool.Query(ctx,
    "SELECT id, total, status FROM pesanan WHERE pengguna_id = $1", uid)
if err != nil {
    return nil, err
}
pesanan, err := pgx.CollectRows(baris, pgx.RowToStructByName[Pesanan])

// Tipe PostgreSQL yang ditangani langsung
var tag []string                    // text[]
var meta map[string]any             // jsonb
err = pool.QueryRow(ctx,
    "SELECT tag, metadata FROM produk WHERE id = $1", pid,
).Scan(&tag, &meta)</pre>
            </div>

            <h3>Menangani Error PostgreSQL secara Spesifik</h3>
            <div class="code-box">
                <pre>_, err := pool.Exec(ctx,
    "INSERT INTO pengguna (email) VALUES ($1)", email)

var pgErr *pgconn.PgError
if errors.As(err, &pgErr) {
    switch pgErr.Code {
    case "23505":   // unique_violation
        return ErrEmailSudahDipakai
    case "23503":   // foreign_key_violation
        return ErrReferensiTidakSah
    case "23514":   // check_violation
        return ErrMelanggarAturan
    case "40001":   // serialization_failure
        return ErrCobaLagi     // aman untuk diulang
    case "40P01":   // deadlock_detected
        return ErrCobaLagi
    }
}</pre>
            </div>

            <div class="callout callout-tip">
                <div class="callout-title">📌 Andalkan constraint database, bukan pemeriksaan sebelumnya</div>
                <p>Pola "SELECT dulu untuk cek apakah email sudah ada, baru INSERT" mengandung balapan: dua permintaan bersamaan bisa sama-sama lolos pemeriksaan lalu sama-sama menyisipkan. Cara yang benar adalah langsung INSERT dan menangani kode <code>23505</code>. Constraint database adalah satu-satunya penjamin keunikan yang benar-benar atomik.</p>
            </div>

            <h3>Transaksi</h3>
            <div class="code-box">
                <pre>func (r *Repo) BuatPesanan(ctx context.Context, p Pesanan) error {
    tx, err := r.pool.BeginTx(ctx, pgx.TxOptions{
        IsoLevel: pgx.ReadCommitted,
    })
    if err != nil {
        return err
    }
    // Aman dipanggil setelah Commit -- akan diabaikan
    defer tx.Rollback(ctx)

    var idPesanan string
    err = tx.QueryRow(ctx,
        "INSERT INTO pesanan (pengguna_id, total) VALUES ($1,$2) RETURNING id",
        p.PenggunaID, p.Total,
    ).Scan(&idPesanan)
    if err != nil {
        return fmt.Errorf("sisipkan pesanan: %w", err)
    }

    for _, it := range p.Item {
        _, err = tx.Exec(ctx,
            "UPDATE stok SET jumlah = jumlah - $1 WHERE produk_id = $2 AND jumlah &gt;= $1",
            it.Jumlah, it.ProdukID)
        if err != nil {
            return fmt.Errorf("kurangi stok: %w", err)
        }
    }

    return tx.Commit(ctx)
}</pre>
            </div>

            <div class="callout callout-danger">
                <div class="callout-title">🚫 Jangan pernah memanggil API eksternal di dalam transaksi</div>
                <p>Transaksi menahan kunci baris. Memanggil gerbang pembayaran yang butuh 3 detik di dalam transaksi berarti kunci tertahan 3 detik, dan permintaan lain yang menyentuh baris itu ikut mengantre. Di bawah beban, ini berubah menjadi deadlock dan koneksi habis. Pola yang benar: commit dulu dengan status <code>MENUNGGU</code>, panggil API di luar transaksi, lalu perbarui status di transaksi kedua.</p>
            </div>

            <h3>Batch — Satu Round-Trip untuk Banyak Kueri</h3>
            <div class="code-box">
                <pre>batch := &pgx.Batch{}
for _, it := range item {
    batch.Queue("INSERT INTO item_pesanan (pesanan_id, produk_id, jumlah) VALUES ($1,$2,$3)",
        idPesanan, it.ProdukID, it.Jumlah)
}

hasil := tx.SendBatch(ctx, batch)
defer hasil.Close()

for range item {
    if _, err := hasil.Exec(); err != nil {
        return err
    }
}</pre>
            </div>

            <div class="callout callout-info">
                <div class="callout-title">💡 Latensi jaringan sering menjadi biang keladi sebenarnya</div>
                <p>Seratus INSERT terpisah dengan latensi jaringan 1 ms berarti 100 ms hanya untuk perjalanan bolak-balik, sebelum database mengerjakan apa pun. Batch mengirimkan semuanya dalam satu perjalanan. Untuk sisipan yang sangat banyak, <code>COPY</code> bahkan jauh lebih cepat lagi.</p>
            </div>

            <h3>COPY untuk Sisipan Massal</h3>
            <div class="code-box">
                <pre>jumlah, err := pool.CopyFrom(ctx,
    pgx.Identifier{"item_pesanan"},
    []string{"pesanan_id", "produk_id", "jumlah"},
    pgx.CopyFromSlice(len(item), func(i int) ([]any, error) {
        return []any{idPesanan, item[i].ProdukID, item[i].Jumlah}, nil
    }),
)
// Untuk 100 ribu baris, COPY bisa puluhan kali lebih cepat
// daripada INSERT satu per satu.</pre>
            </div>

            <h3>Yang Perlu Dipantau</h3>
            <div class="code-box">
                <pre>stat := pool.Stat()
slog.Info("statistik pool",
    "total",          stat.TotalConns(),
    "menganggur",     stat.IdleConns(),
    "digunakan",      stat.AcquiredConns(),
    "menunggu",       stat.EmptyAcquireCount(),
    "durasi_tunggu",  stat.AcquireDuration())</pre>
            </div>

            <p>Angka <code>EmptyAcquireCount</code> yang terus naik berarti aplikasi sering kehabisan koneksi dan harus menunggu. Penyebabnya bisa pool terlalu kecil, atau — yang lebih sering — ada kueri lambat yang menahan koneksi terlalu lama. Periksa kueri lambatnya lebih dulu sebelum menaikkan <code>MaxConns</code>.</p>
        </div>
    `,
    "initialCode": "package main\n\nimport (\n\t\"errors\"\n\t\"fmt\"\n)\n\n// Simulasi error PostgreSQL\ntype PgError struct {\n\tCode    string\n\tMessage string\n\tDetail  string\n}\n\nfunc (e *PgError) Error() string { return fmt.Sprintf(\"pg %s: %s\", e.Code, e.Message) }\n\nvar (\n\tErrEmailSudahDipakai  = errors.New(\"email sudah terdaftar\")\n\tErrReferensiTidakSah  = errors.New(\"referensi tidak sah\")\n\tErrCobaLagi           = errors.New(\"bentrok sementara, coba lagi\")\n)\n\nfunc terjemahkan(err error) error {\n\tvar pgErr *PgError\n\tif !errors.As(err, &pgErr) {\n\t\treturn err\n\t}\n\tswitch pgErr.Code {\n\tcase \"23505\":\n\t\treturn ErrEmailSudahDipakai\n\tcase \"23503\":\n\t\treturn ErrReferensiTidakSah\n\tcase \"40001\", \"40P01\":\n\t\treturn ErrCobaLagi\n\t}\n\treturn err\n}\n\nfunc main() {\n\tkasus := []error{\n\t\t&PgError{Code: \"23505\", Message: \"duplicate key value violates unique constraint\", Detail: \"Key (email)=(budi@contoh.com) already exists.\"},\n\t\t&PgError{Code: \"23503\", Message: \"insert or update violates foreign key constraint\"},\n\t\t&PgError{Code: \"40P01\", Message: \"deadlock detected\"},\n\t\t&PgError{Code: \"42P01\", Message: \"relation \\\"pesananx\\\" does not exist\"},\n\t}\n\n\tfor _, err := range kasus {\n\t\thasil := terjemahkan(err)\n\t\tdapatDiulang := errors.Is(hasil, ErrCobaLagi)\n\t\tfmt.Printf(\"%-8s -> %-32v (boleh diulang: %v)\\n\",\n\t\t\terr.(*PgError).Code, hasil, dapatDiulang)\n\t}\n}",
    "quiz": {
        "question": "Mengapa memanggil API pembayaran eksternal di dalam transaksi database adalah praktik yang berbahaya?",
        "options": [
            "Karena API eksternal tidak bisa diakses dari dalam transaksi",
            "Karena transaksi menahan kunci baris selama menunggu respons API, sehingga di bawah beban terjadi antrean, deadlock, dan kehabisan koneksi",
            "Karena PostgreSQL akan otomatis membatalkan transaksinya",
            "Karena panggilan API tidak bisa di-rollback"
        ],
        "correctIndex": 1,
        "explanation": "Kunci baris tertahan sepanjang transaksi berlangsung. Panggilan jaringan yang butuh beberapa detik memperpanjang durasi kunci secara drastis, membuat permintaan lain mengantre dan koneksi pool terkuras. Pola yang benar adalah commit dengan status menunggu, panggil API di luar transaksi, lalu perbarui status di transaksi terpisah."
    }
},
{
    "id": 191,
    "category": "Domain 18: Database Go Modern",
    "timestamp": "00:00:00",
    "title": "sqlc - SQL Aman Tipe Tanpa ORM",
    "desc": "Membangkitkan kode Go yang aman tipe langsung dari kueri SQL, memadukan kendali penuh atas SQL dengan pemeriksaan compiler.",
    "theoryHtml": `
        <div class="theory-section">
            <h3>Tiga Pendekatan Akses Data</h3>
            <table class="tech-table">
                <thead><tr><th></th><th>SQL mentah</th><th>ORM (GORM)</th><th>sqlc</th></tr></thead>
                <tbody>
                    <tr><td>Kendali atas SQL</td><td>Penuh</td><td>Terbatas</td><td><strong>Penuh</strong></td></tr>
                    <tr><td>Aman tipe</td><td>Tidak</td><td>Sebagian</td><td><strong>Ya, saat kompilasi</strong></td></tr>
                    <tr><td>Salah ketik kolom terdeteksi</td><td>Saat runtime</td><td>Saat runtime</td><td><strong>Saat generate</strong></td></tr>
                    <tr><td>Risiko N+1</td><td>Terlihat jelas</td><td><strong>Tersembunyi</strong></td><td>Terlihat jelas</td></tr>
                    <tr><td>Kurva belajar</td><td>SQL saja</td><td>API ORM yang besar</td><td>SQL saja</td></tr>
                    <tr><td>Kode boilerplate</td><td>Banyak</td><td>Sedikit</td><td><strong>Nol — dibangkitkan</strong></td></tr>
                </tbody>
            </table>

            <div class="callout callout-info">
                <div class="callout-title">💡 Gagasan inti sqlc</div>
                <p>Anda menulis SQL biasa. sqlc <strong>terhubung ke skema database Anda</strong>, memeriksa kueri tersebut valid, lalu membangkitkan fungsi Go beserta struct-nya. Salah mengetik nama kolom akan gagal <em>saat pembangkitan kode</em>, bukan saat kode sudah berjalan di produksi.</p>
            </div>

            <h3>Struktur Proyek</h3>
            <div class="code-box">
                <pre>proyek/
├── sqlc.yaml
├── db/
│   ├── skema/
│   │   └── 001_awal.sql          &lt;-- definisi tabel
│   ├── kueri/
│   │   └── pesanan.sql           &lt;-- kueri yang Anda tulis
│   └── gen/                      &lt;-- hasil bangkitan, JANGAN disunting
│       ├── db.go
│       ├── models.go
│       └── pesanan.sql.go</pre>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>sqlc.yaml</span></div>
                <pre>version: "2"
sql:
  - engine: "postgresql"
    schema: "db/skema"
    queries: "db/kueri"
    gen:
      go:
        package: "gen"
        out: "db/gen"
        sql_package: "pgx/v5"
        emit_json_tags: true
        emit_pointers_for_null_types: true
        emit_interface: true          # untuk memudahkan pembuatan mock</pre>
            </div>

            <h3>Menulis Kueri</h3>
            <div class="code-box">
                <div class="code-box-header"><span>db/kueri/pesanan.sql</span></div>
                <pre>-- name: AmbilPesanan :one
SELECT * FROM pesanan WHERE id = $1;

-- name: DaftarPesananPengguna :many
SELECT * FROM pesanan
WHERE pengguna_id = $1
ORDER BY dibuat_pada DESC
LIMIT $2 OFFSET $3;

-- name: BuatPesanan :one
INSERT INTO pesanan (pengguna_id, total, status)
VALUES ($1, $2, $3)
RETURNING *;

-- name: PerbaruiStatus :exec
UPDATE pesanan SET status = $2, diubah_pada = now()
WHERE id = $1;

-- name: HitungPerStatus :many
SELECT status, COUNT(*) AS jumlah
FROM pesanan
WHERE dibuat_pada &gt;= $1
GROUP BY status;

-- name: PesananDenganItem :many
SELECT
  p.id, p.total, p.status,
  i.produk_id, i.jumlah, i.harga
FROM pesanan p
JOIN item_pesanan i ON i.pesanan_id = p.id
WHERE p.pengguna_id = $1;</pre>
            </div>

            <p>Komentar penanda menentukan bentuk fungsi yang dibangkitkan: <code>:one</code> mengembalikan satu baris, <code>:many</code> mengembalikan slice, <code>:exec</code> tanpa nilai balik data, dan <code>:copyfrom</code> memakai COPY untuk sisipan massal.</p>

            <h3>Kode yang Dibangkitkan</h3>
            <div class="code-box">
                <pre>// db/gen/pesanan.sql.go -- dibangkitkan otomatis

type BuatPesananParams struct {
    PenggunaID int64       \`json:"pengguna_id"\`
    Total      int64       \`json:"total"\`
    Status     StatusPesanan \`json:"status"\`
}

func (q *Queries) BuatPesanan(ctx context.Context, arg BuatPesananParams) (Pesanan, error) {
    baris := q.db.QueryRow(ctx, buatPesanan, arg.PenggunaID, arg.Total, arg.Status)
    var i Pesanan
    err := baris.Scan(&i.ID, &i.PenggunaID, &i.Total, &i.Status, &i.DibuatPada)
    return i, err
}</pre>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Pemakaian di aplikasi</span></div>
                <pre>kueri := gen.New(pool)

p, err := kueri.BuatPesanan(ctx, gen.BuatPesananParams{
    PenggunaID: 55,
    Total:      250000,
    Status:     gen.StatusPesananMenunggu,
})
// p bertipe gen.Pesanan -- sepenuhnya aman tipe.
// Salah ketik nama field ditangkap compiler.</pre>
            </div>

            <h3>Transaksi</h3>
            <div class="code-box">
                <pre>func (s *Layanan) BuatPesananLengkap(ctx context.Context, req Request) error {
    tx, err := s.pool.Begin(ctx)
    if err != nil {
        return err
    }
    defer tx.Rollback(ctx)

    // Ikat Queries ke transaksi ini
    q := s.kueri.WithTx(tx)

    p, err := q.BuatPesanan(ctx, gen.BuatPesananParams{...})
    if err != nil {
        return err
    }

    for _, it := range req.Item {
        if err := q.TambahItem(ctx, gen.TambahItemParams{
            PesananID: p.ID,
            ProdukID:  it.ProdukID,
            Jumlah:    it.Jumlah,
        }); err != nil {
            return err
        }
    }

    return tx.Commit(ctx)
}</pre>
            </div>

            <h3>Batasan sqlc yang Perlu Diketahui</h3>
            <div class="callout callout-warning">
                <div class="callout-title">⚠️ Kueri dinamis bukan wilayah sqlc</div>
                <p>sqlc membangkitkan kode dari SQL statis. Filter yang jumlahnya berubah-ubah sesuai masukan pengguna — misalnya halaman pencarian dengan sepuluh filter opsional — tidak bisa ditangani langsung. Ada dua jalan keluar:</p>
                <div class="code-box">
                    <pre>-- 1. Parameter opsional dengan pola sqlc.narg
-- name: CariPesanan :many
SELECT * FROM pesanan
WHERE (sqlc.narg('status')::text IS NULL OR status = sqlc.narg('status'))
  AND (sqlc.narg('min_total')::bigint IS NULL OR total &gt;= sqlc.narg('min_total'));

-- 2. Untuk yang benar-benar dinamis, pakai query builder
--    (squirrel, atau pgx langsung) khusus untuk kasus itu saja.</pre>
                </div>
            </div>

            <div class="callout callout-tip">
                <div class="callout-title">📌 Perpaduan yang sangat baik: sqlc + goose/atlas</div>
                <p>sqlc membaca skema dari berkas SQL, jadi ia menyatu mulus dengan alat migrasi seperti <strong>goose</strong> atau <strong>Atlas</strong>. Alurnya menjadi: tulis migrasi → jalankan <code>sqlc generate</code> → kompilasi. Bila sebuah migrasi menghapus kolom yang masih dipakai kueri, <strong>kompilasi langsung gagal</strong> — sebelum kode itu pernah menyentuh produksi.</p>
                <div class="code-box">
                    <pre>goose -dir db/skema postgres "$DSN" up
sqlc generate
sqlc vet          # periksa kueri terhadap aturan yang Anda tetapkan
go build ./...</pre>
                </div>
            </div>

            <h3>Bahaya N+1 yang Disembunyikan ORM</h3>
            <div class="code-box">
                <pre>// Dengan ORM -- terlihat tak berbahaya, padahal 101 kueri
var pesanan []Pesanan
db.Find(&pesanan)                    // 1 kueri
for _, p := range pesanan {
    db.Model(&p).Related(&p.Item)    // 100 kueri lagi!
}

// Dengan sqlc -- Anda MELIHAT SQL-nya, jadi masalahnya kentara
// name: PesananDenganItem :many
SELECT p.*, i.* FROM pesanan p
JOIN item_pesanan i ON i.pesanan_id = p.id
WHERE p.pengguna_id = $1;            // 1 kueri saja</pre>
            </div>

            <div class="callout callout-info">
                <div class="callout-title">💡 Ini keunggulan sqlc yang paling sering diremehkan</div>
                <p>Karena setiap kueri tertulis eksplisit di dalam berkas <code>.sql</code>, masalah kinerja terlihat saat <em>code review</em>, bukan ditemukan lewat profiling produksi berbulan-bulan kemudian. ORM menyembunyikan biaya di balik pemanggilan method yang terlihat sederhana; sqlc menampilkannya apa adanya.</p>
            </div>
        </div>
    `,
    "initialCode": "package main\n\nimport \"fmt\"\n\n// Simulasi struct & fungsi hasil bangkitan sqlc\ntype StatusPesanan string\n\nconst (\n\tStatusMenunggu StatusPesanan = \"MENUNGGU\"\n\tStatusDibayar  StatusPesanan = \"DIBAYAR\"\n)\n\ntype Pesanan struct {\n\tID         string        `json:\"id\"`\n\tPenggunaID int64         `json:\"pengguna_id\"`\n\tTotal      int64         `json:\"total\"`\n\tStatus     StatusPesanan `json:\"status\"`\n}\n\ntype BuatPesananParams struct {\n\tPenggunaID int64\n\tTotal      int64\n\tStatus     StatusPesanan\n}\n\ntype Queries struct{ data map[string]Pesanan; urut []string }\n\nfunc (q *Queries) BuatPesanan(arg BuatPesananParams) (Pesanan, error) {\n\tid := fmt.Sprintf(\"p-%04d\", len(q.urut)+1001)\n\tp := Pesanan{ID: id, PenggunaID: arg.PenggunaID, Total: arg.Total, Status: arg.Status}\n\tq.data[id] = p\n\tq.urut = append(q.urut, id)\n\treturn p, nil\n}\n\nfunc (q *Queries) DaftarPesananPengguna(penggunaID int64) ([]Pesanan, error) {\n\tvar hasil []Pesanan\n\tfor _, id := range q.urut {\n\t\tif p := q.data[id]; p.PenggunaID == penggunaID {\n\t\t\thasil = append(hasil, p)\n\t\t}\n\t}\n\treturn hasil, nil\n}\n\nfunc main() {\n\tq := &Queries{data: map[string]Pesanan{}}\n\n\tq.BuatPesanan(BuatPesananParams{PenggunaID: 55, Total: 250000, Status: StatusMenunggu})\n\tq.BuatPesanan(BuatPesananParams{PenggunaID: 55, Total: 89000, Status: StatusDibayar})\n\tq.BuatPesanan(BuatPesananParams{PenggunaID: 71, Total: 45000, Status: StatusMenunggu})\n\n\tdaftar, _ := q.DaftarPesananPengguna(55)\n\tfmt.Println(\"Pesanan milik pengguna 55:\")\n\tfor _, p := range daftar {\n\t\tfmt.Printf(\"  %s  Rp%-8d  %s\\n\", p.ID, p.Total, p.Status)\n\t}\n\n\tfmt.Println(\"\\nSemua field aman tipe -- salah ketik ditangkap compiler.\")\n}",
    "quiz": {
        "question": "Apa keunggulan utama sqlc dibanding ORM dalam hal masalah kinerja N+1?",
        "options": [
            "sqlc otomatis menggabungkan kueri yang berulang",
            "Setiap kueri tertulis eksplisit sebagai SQL, sehingga masalah N+1 terlihat saat code review alih-alih tersembunyi di balik pemanggilan method",
            "sqlc melarang penggunaan perulangan pada kode Go",
            "sqlc menyimpan hasil kueri di cache secara otomatis"
        ],
        "correctIndex": 1,
        "explanation": "ORM menyembunyikan biaya di balik pemanggilan method yang terlihat sederhana, sehingga satu perulangan bisa diam-diam menghasilkan ratusan kueri. Dengan sqlc, seluruh SQL tertulis eksplisit di berkas .sql sehingga jumlah perjalanan ke database langsung terlihat saat kode ditinjau."
    }
},
{
        "id": 192,
        "category": "Domain 19: Golang Redis Client",
        "timestamp": "00:01:15",
        "title": "Pengenalan Redis & Driver go-redis/v9 di Golang",
        "desc": "Memahami arsitektur In-Memory Data Store Redis dan menghubungkan Golang dengan package redis/go-redis/v9.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Apa itu Redis?</h3>\n            <p><strong>Redis</strong> (Remote Dictionary Server) adalah database In-Memory dengan struktur data Key-Value yang super cepat. Redis umumnya digunakan untuk <strong>Caching</strong>, <strong>Session Management</strong>, <strong>Pub/Sub Messaging</strong>, dan <strong>Rate Limiting</strong>.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Kenapa Redis Sangat Cepat?</div>\n                <p>Redis menyimpan seluruh data di dalam <strong>RAM (Random Access Memory)</strong>, sehingga latency pembacaan dan penulisan data berada di tingkat sub-milidetik (< 1ms).</p>\n            </div>\n\n            <h3>Instalasi Client `go-redis`:</h3>\n            <pre>go get github.com/redis/go-redis/v9</pre>\n\n            <div class=\"callout callout-warning\">\n                <div class=\"callout-title\">⚠️ Jangan pakai v8 lagi</div>\n                <p>Driver lama <code>github.com/go-redis/redis/v8</code> sudah tidak dipelihara. Sejak v9 repositori pindah ke organisasi <code>redis</code>, sehingga import path berubah menjadi <code>github.com/redis/go-redis/v9</code>. Perbedaan utama saat migrasi: seluruh perintah kini wajib menerima <code>context.Context</code> sebagai argumen pertama, dan opsi koneksi memakai <code>redis.Options</code> dengan dukungan RESP3 secara default.</p>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\n// Simulasi Client Redis In-Memory\ntype RedisClient struct {\n\tstorage map[string]string\n}\n\nfunc NewRedisClient() *RedisClient {\n\treturn &RedisClient{storage: make(map[string]string)}\n}\n\nfunc main() {\n\tfmt.Println(\"=== CONNECTING TO REDIS SERVER ===\")\n\trdb := NewRedisClient()\n\tfmt.Println(\"Ping Redis Server: PONG (Connection Latency: 0.2ms)\")\n\t_ = rdb\n}",
        "quiz": {
                "question": "Dimanakah Redis menyimpan data utamanya sehingga mampu menyajikan latency respon sub-milidetik (< 1 milidetik)?",
                "options": [
                        "RAM (In-Memory)",
                        "Hard Disk Drive (HDD)",
                        "SSD NVM Express",
                        "Tape Storage"
                ],
                "correctIndex": 0,
                "explanation": "Redis menyimpan seluruh struktur data di dalam RAM (Memory) untuk kecepatan akses yang luar biasa."
        }
},
{
        "id": 193,
        "category": "Domain 19: Golang Redis Client",
        "timestamp": "00:08:20",
        "title": "String Operations (Set, Get, SetEX, MGet, MSet, Del)",
        "desc": "Mengoperasikan tipe data paling dasar di Redis yaitu String key-value beserta waktu kadaluarsa (TTL).",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Operasi String Dasar pada Redis</h3>\n            <p>Tipe data String di Redis dapat menyimpan teks, angka, maupun data biner (JSON/Gambar) hingga ukuran 512MB.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Kode Standar go-redis:</div>\n                <pre>ctx := context.Background()\n\n// 1. Menyimpan data dengan TTL 10 Menit\nerr := rdb.Set(ctx, \"user:101:name\", \"Eko\", 10*time.Minute).Err()\n\n// 2. Mengambil data\nval, err := rdb.Get(ctx, \"user:101:name\").Result()\nif err == redis.Nil {\n    fmt.Println(\"Key tidak ditemukan atau sudah kadaluarsa (Cache Miss)\")\n}\n\n// 3. Menghapus Key\nrdb.Del(ctx, \"user:101:name\")</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype RedisStore map[string]string\n\nfunc main() {\n\tstore := make(RedisStore)\n\n\t// SET\n\tstore[\"session:token_abc\"] = \"user_id_992\"\n\n\t// GET\n\tval, exists := store[\"session:token_abc\"]\n\n\tfmt.Println(\"=== REDIS STRING GET / SET DEMO ===\")\n\tif exists {\n\t\tfmt.Println(\"Redis GET 'session:token_abc' => Value:\", val)\n\t}\n}",
        "quiz": {
                "question": "Error khusus apakah yang dikembalikan oleh `go-redis` saat kita mencoba melakukan `Get()` terhadap key yang tidak ada di Redis?",
                "options": [
                        "redis.Nil",
                        "redis.ErrNotFound",
                        "redis.Null",
                        "redis.KeyMissing"
                ],
                "correctIndex": 0,
                "explanation": "`redis.Nil` (atau `redis.ErrNil`) adalah penanda standar bahwa Key yang dicari tidak ditemukan di Redis."
        }
},
{
        "id": 194,
        "category": "Domain 19: Golang Redis Client",
        "timestamp": "00:15:10",
        "title": "Expiration & TTL Management (Expire, TTL, Persist)",
        "desc": "Mengatur dan memantau masa berlaku (Time-To-Live) dari sebuah Key di Redis.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Manajemen Time-To-Live (TTL)</h3>\n            <p>Salah satu fitur terbaik Redis adalah pembersihan memori otomatis berdasarkan expiration time (TTL). Ketika durasi TTL habis, Redis akan menghapus key tersebut secara otomatis.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Fungsi Manajemen TTL:</div>\n                <ul>\n                    <li><code>rdb.Expire(ctx, key, 30*time.Second)</code>: Memperbarui TTL key menjadi 30 detik.</li>\n                    <li><code>rdb.TTL(ctx, key).Result()</code>: Memeriksa sisa durasi hidup key.</li>\n                    <li><code>rdb.Persist(ctx, key)</code>: Menghapus expiration time (membuat key permanen).</li>\n                </ul>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc main() {\n\tttl := 60 * time.Second\n\tfmt.Println(\"=== REDIS TTL MANAGEMENT DEMO ===\")\n\tfmt.Println(\"Key 'otp:user_88' disimpan dengan TTL:\", ttl)\n\tfmt.Println(\"Sisa waktu kadaluarsa (rdb.TTL): 58.4 detik\")\n}",
        "quiz": {
                "question": "Fungsi apakah pada `go-redis` yang digunakan untuk menghapus masa kadaluarsa (TTL) dari suatu key sehingga key tersebut tersimpan secara permanen?",
                "options": [
                        "rdb.Persist()",
                        "rdb.KeepAlive()",
                        "rdb.RemoveTTL()",
                        "rdb.MakePermanent()"
                ],
                "correctIndex": 0,
                "explanation": "`rdb.Persist(ctx, key)` membuang waktu kadaluarsa key dan menjadikannya permanen."
        }
},
{
        "id": 195,
        "category": "Domain 19: Golang Redis Client",
        "timestamp": "00:22:40",
        "title": "Hash Data Structure (HSet, HGet, HGetAll, HDel)",
        "desc": "Menyimpan dan mengelola objek struct dalam bentuk struktur data Hash di Redis.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Struktur Data Redis Hash</h3>\n            <p><strong>Redis Hash</strong> adalah pemetaan field-value di dalam satu Key (sangat mirip dengan objek/map di dalam Redis). Hash sangat efisien memori untuk menyimpan objek seperti Profile User atau Shopping Cart.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Kode Redis Hash:</div>\n                <pre>// Set individual fields dalam Hash\nrdb.HSet(ctx, \"user:100\", \"name\", \"Budi\", \"age\", 25, \"email\", \"budi@gmail.com\")\n\n// Get satu field\nname, _ := rdb.HGet(ctx, \"user:100\", \"name\").Result()\n\n// Get seluruh field sebagai map[string]string\nuserMap, _ := rdb.HGetAll(ctx, \"user:100\").Result()</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\tuserHash := map[string]string{\n\t\t\"username\": \"eko_khannedy\",\n\t\t\"role\":     \"admin\",\n\t\t\"level\":    \"gold\",\n\t}\n\n\tfmt.Println(\"=== REDIS HGETALL DEMO ===\")\n\tfmt.Println(\"Hasil rdb.HGetAll('user_hash:99'):\")\n\tfor k, v := range userHash {\n\t\tfmt.Printf(\"  Field '%-10s' => %s\\n\", k, v)\n\t}\n}",
        "quiz": {
                "question": "Method Redis Hash apakah yang mengembalikan SELURUH pasang field dan value dari suatu Hash Key dalam bentuk `map[string]string`?",
                "options": [
                        "rdb.HGetAll()",
                        "rdb.HGetMap()",
                        "rdb.HFetchAll()",
                        "rdb.HValues()"
                ],
                "correctIndex": 0,
                "explanation": "`rdb.HGetAll(ctx, key)` mengeksekusi command HGETALL untuk mengambil seluruh field dalam hash."
        }
},
{
        "id": 196,
        "category": "Domain 19: Golang Redis Client",
        "timestamp": "00:29:50",
        "title": "List & Set Data Structures (LPush, RPop, SAdd, SMembers)",
        "desc": "Mengimplementasikan Message Queue dengan List dan koleksi unik tanpa duplikat dengan Set.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Redis List & Redis Set</h3>\n            <ul>\n                <li><strong>List (Queue/Stack):</strong> Urutan elemen string berdasarkan waktu penambahan. Digunakan untuk background job queue. (<code>LPush</code>, <code>RPop</code>, <code>BLPop</code>).</li>\n                <li><strong>Set (Unique Collection):</strong> Kumpulan string unik tanpa urutan tertentu. Mencegah duplikasi data. (<code>SAdd</code>, <code>SMembers</code>, <code>SIsMember</code>).</li>\n            </ul>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Contoh Job Queue dengan List:</div>\n                <pre>rdb.LPush(ctx, \"queue:emails\", \"email_1@test.com\") // Producer menambahkan job\njob, _ := rdb.RPop(ctx, \"queue:emails\").Result()    // Consumer mengambil job terlama (FIFO)</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\t// Simulasi FIFO Queue dengan Slice\n\tvar queue []string\n\n\t// LPUSH (Push to head)\n\tqueue = append([]string{\"job_email_1\"}, queue...)\n\tqueue = append([]string{\"job_email_2\"}, queue...)\n\n\tfmt.Println(\"=== REDIS LIST FIFO QUEUE SIMULATION ===\")\n\tfmt.Println(\"Current Queue Contents:\", queue)\n\n\t// RPOP (Pop from tail)\n\tlastJob := queue[len(queue)-1]\n\tqueue = queue[:len(queue)-1]\n\tfmt.Println(\"Processed Job (RPop):\", lastJob)\n\tfmt.Println(\"Remaining Queue:\", queue)\n}",
        "quiz": {
                "question": "Kombinasi fungsi Redis List manakah yang digunakan untuk membuat antrean pesan dengan metode First-In First-Out (FIFO)?",
                "options": [
                        "LPush dan RPop",
                        "LPush dan LPop",
                        "RPush dan RPop",
                        "SAdd dan SMembers"
                ],
                "correctIndex": 0,
                "explanation": "Push data di sebelah kiri (`LPush`) lalu pop data di sebelah kanan (`RPop`) membentuk perilaku antrean FIFO."
        }
},
{
        "id": 197,
        "category": "Domain 19: Golang Redis Client",
        "timestamp": "00:37:10",
        "title": "Sorted Set (ZAdd, ZRange, ZScore) & Leaderboard System",
        "desc": "Membangun sistem papan peringkat (Leaderboard) realtime berkecepatan tinggi menggunakan Redis Sorted Set.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Sistem Papan Peringkat (Leaderboard) dengan Sorted Set</h3>\n            <p><strong>Redis Sorted Set (ZSet)</strong> mirip dengan Set biasa, namun setiap elemen diasosiasikan dengan sebuah <strong>Score (skor numerik)</strong>. Redis akan otomatis mengurutkan elemen berdasarkan skor tersebut.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Kode Leaderboard Redis:</div>\n                <pre>// Menambahkan member beserta score\nrdb.ZAdd(ctx, \"leaderboard:game\", &redis.Z{Score: 1500, Member: \"Player1\"})\nrdb.ZAdd(ctx, \"leaderboard:game\", &redis.Z{Score: 2300, Member: \"Player2\"})\n\n// Mengambil Top 10 Player Skor Tertinggi (Rank 0-9)\ntopPlayers, _ := rdb.ZRevRangeWithScores(ctx, \"leaderboard:game\", 0, 9).Result()</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"sort\"\n)\n\ntype PlayerScore struct {\n\tName  string\n\tScore float64\n}\n\nfunc main() {\n\tplayers := []PlayerScore{\n\t\t{Name: \"GamerPro\", Score: 850},\n\t\t{Name: \"ShadowNinja\", Score: 1200},\n\t\t{Name: \"CyberKing\", Score: 990},\n\t}\n\n\tsort.Slice(players, func(i, j int) bool {\n\t\treturn players[i].Score > players[j].Score\n\t})\n\n\tfmt.Println(\"=== REDIS SORTED SET LEADERBOARD (TOP 3) ===\")\n\tfor i, p := range players {\n\t\tfmt.Printf(\"Rank #%d | Player: %-12s | Score: %.0f\\n\", i+1, p.Name, p.Score)\n\t}\n}",
        "quiz": {
                "question": "Fungsi Redis Sorted Set manakah yang digunakan untuk mengambil daftar member diurutkan dari skor TERBESAR ke terkecil?",
                "options": [
                        "ZRevRangeWithScores",
                        "ZRangeWithScores",
                        "ZGetTopScores",
                        "ZSortDescending"
                ],
                "correctIndex": 0,
                "explanation": "`ZRevRange` (Reverse Range) mengambil data secara terbalik dari skor tertinggi ke terendah."
        }
},
{
        "id": 198,
        "category": "Domain 19: Golang Redis Client",
        "timestamp": "00:44:20",
        "title": "Redis Pub/Sub (Publish, Subscribe, Channel)",
        "desc": "Membangun sistem perpesanan terdistribusi berarsitektur Event-Driven (Pub/Sub) menggunakan Redis Channels.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Arsitektur Event-Driven dengan Redis Pub/Sub</h3>\n            <p>Redis Pub/Sub memungkinkan aplikasi mengirimkan pesan (*Publish*) ke suatu channel, dan aplikasi lain yang mendengarkan (*Subscribe*) channel tersebut akan langsung menerima pesan secara **realtime**.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Alur Pub/Sub:</div>\n                <pre>// Publisher: Mengirim pesan\nrdb.Publish(ctx, \"channel:notifications\", \"Order #992 Paid\")\n\n// Subscriber: Mendengarkan pesan\npubsub := rdb.Subscribe(ctx, \"channel:notifications\")\nch := pubsub.Channel()\n\nfor msg := range ch {\n    fmt.Println(\"Received Event Message:\", msg.Payload)\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\tchannel := \"notifications:events\"\n\tpayload := `{\"event\": \"USER_REGISTERED\", \"user_id\": 8812}`\n\n\tfmt.Println(\"=== REDIS PUB/SUB SIMULATION ===\")\n\tfmt.Printf(\"[PUBLISHER] Sending message to channel '%s'...\n\", channel)\n\tfmt.Printf(\"[SUBSCRIBER] Event Received on '%s' => Payload: %s\n\", channel, payload)\n}",
        "quiz": {
                "question": "Manakah pernyataan yang paling akurat mengenai karakteristik Redis Pub/Sub?",
                "options": [
                        "Pesan dikirimkan secara fire-and-forget; jika subscriber offline saat publisher mengirim pesan, pesan tersebut tidak disimpan (lost)",
                        "Pesan Pub/Sub akan disimpan secara permanen di database MySQL",
                        "Setiap pesan yang di-publish hanya bisa diterima oleh tepat 1 subscriber",
                        "Pub/Sub di Redis membutuhkan lisensi berbayar"
                ],
                "correctIndex": 0,
                "explanation": "Redis Pub/Sub bersifat fire-and-forget tanpa message persistence (jika butuh persitensi pesan, gunakan Redis Streams)."
        }
},
{
        "id": 199,
        "category": "Domain 19: Golang Redis Client",
        "timestamp": "00:51:30",
        "title": "Redis Pipelines & Transactions (Multi/Exec)",
        "desc": "Meningkatkan performa throughput dengan Redis Pipeline (batching) dan menjamin atomisitas dengan Multi/Exec.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Redis Pipeline & Transaction</h3>\n            <p>Setiap kali kita memanggil `rdb.Get()` atau `rdb.Set()`, ada waktu tunggu bolak-balik (Round-Trip Time / RTT) di jaringan. **Pipeline** mengirimkan banyak perintah sekaligus dalam 1 paket jaringan untuk menghemat latency.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Kode Redis Pipeline:</div>\n                <pre>pipe := rdb.Pipeline()\n\nincr := pipe.Incr(ctx, \"counter\")\npipe.Expire(ctx, \"counter\", time.Hour)\n\n// Eksekusi seluruh batch command dalam 1 kali round-trip!\n_, err := pipe.Exec(ctx)</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== REDIS PIPELINE BATCH EXECUTION ===\")\n\tfmt.Println(\"Sending 50 Commands in 1 Network Round-Trip Pipeline...\")\n\tfmt.Println(\"Latency tanpa Pipeline: ~50ms (50 x 1ms)\")\n\tfmt.Println(\"Latency DENGAN Pipeline: ~1.2ms (Batching Execution Successful!)\")\n}",
        "quiz": {
                "question": "Apakah keuntungan utama dari penggunaan Redis Pipeline saat mengeksekusi banyak perintah Redis berturut-turut?",
                "options": [
                        "Mengurangi latency total dengan menggabungkan banyak perintah dalam satu kali perjalanan paket jaringan (Network Round-Trip)",
                        "Mengubah database Redis menjadi database SQL",
                        "Menghapus seluruh memori RAM yang digunakan Redis",
                        "Membuat koneksi Redis menjadi terenkripsi SSL secara otomatis"
                ],
                "correctIndex": 0,
                "explanation": "Pipeline mengurangi efek latency RTT jaringan dengan mengirimkan batch perintah sekaligus."
        }
},
{
        "id": 200,
        "category": "Domain 19: Golang Redis Client",
        "timestamp": "00:58:40",
        "title": "Studi Kasus: High Performance HTTP Cache Strategy & Rate Limiter dengan Redis",
        "desc": "Menggabungkan strategi Cache-Aside dan Sliding Window Rate Limiting untuk melindungi endpoint API Golang.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Studi Kasus Integrasi Redis di Production</h3>\n            <p>Dua penggunaan Redis paling populer di backend API adalah:</p>\n\n            <ol>\n                <li><strong>Cache-Aside Pattern:</strong>\n                    <ul>\n                        <li>Cek Redis Cache (`rdb.Get`). Jika ada (Cache Hit), kembalikan data langsung.</li>\n                        <li>Jika tidak ada (Cache Miss), query ke SQL Database, simpan hasilnya ke Redis dengan TTL, lalu kembalikan data.</li>\n                    </ul>\n                </li>\n                <li><strong>Rate Limiting (Sliding Window / Fixed Window):</strong> Membatasi pengguna maksimal 100 request/menit untuk mencegah serangan DDoS atau spamming.</li>\n            </ol>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype ProductCache struct {\n\tredisData map[string]string\n\tdbData    map[string]string\n}\n\nfunc (pc *ProductCache) GetProduct(id string) (string, string) {\n\t// 1. Cek Redis\n\tif val, ok := pc.redisData[id]; ok {\n\t\treturn val, \"CACHE_HIT (From Redis RAM)\"\n\t}\n\n\t// 2. Query SQL DB\n\tval := pc.dbData[id]\n\n\t// 3. Populate Redis\n\tpc.redisData[id] = val\n\treturn val, \"CACHE_MISS (Query SQL & Saved to Redis)\"\n}\n\nfunc main() {\n\tcache := ProductCache{\n\t\tredisData: make(map[string]string),\n\t\tdbData:    map[string]string{\"prod_1\": \"Laptop Gaming ASUS\"},\n\t}\n\n\tfmt.Println(\"=== DEMO CACHE-ASIDE PATTERN ===\")\n\t// Request 1: Cache Miss\n\tval1, source1 := cache.GetProduct(\"prod_1\")\n\tfmt.Printf(\"Req #1 => Value: %s | Source: %s\\n\", val1, source1)\n\n\t// Request 2: Cache Hit\n\tval2, source2 := cache.GetProduct(\"prod_1\")\n\tfmt.Printf(\"Req #2 => Value: %s | Source: %s\\n\", val2, source2)\n}",
        "quiz": {
                "question": "Istilah apakah yang digunakan ketika data yang diminta klien TIDAK ADA di dalam Redis Cache sehingga aplikasi harus mengambilnya dari Database MySQL?",
                "options": [
                        "Cache Miss",
                        "Cache Hit",
                        "Cache Overflow",
                        "Cache Eviction"
                ],
                "correctIndex": 0,
                "explanation": "Cache Miss terjadi jika data tidak ada di cache RAM. Sebaliknya, Cache Hit terjadi jika data berhasil ditemukan di cache."
        }
},
{
        "id": 201,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "00:02:18",
        "title": "Arsitektur Web (Client & Server) & Package net/http",
        "desc": "Konsep dasar HTTP Protocol, Client-Server architecture, dan pengenalan package net/http.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Arsitektur Web di Golang</h3>\n            <p>Golang memiliki pendirian <em>\"Batteries Included\"</em> untuk pengembangan web. Package standar <code>net/http</code> menyediakan HTTP Server & Client kelas produksi tanpa memerlukan framework pihak ketiga.</p>\n            <table class=\"tech-table\">\n                <thead><tr><th>Komponen</th><th>Peran di Go</th></tr></thead>\n                <tbody>\n                    <tr><td>Client (Browser/Postman)</td><td>Mengirim HTTP Request ke Server</td></tr>\n                    <tr><td>http.Server</td><td>Mendengarkan Port TCP & menerima koneksi HTTP</td></tr>\n                    <tr><td>http.Handler</td><td>Memproses request dan menulis HTTP Response</td></tr>\n                </tbody>\n            </table>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== NET/HTTP PACKAGE ===\")\n\tfmt.Println(\"Golang memiliki Web Server bawaan yang sangat kencang di package net/http.\")\n\t_ = http.Server{}\n}",
        "quiz": {
                "question": "Package standar apa di Golang yang menyediakan fasilitas HTTP Client dan HTTP Server?",
                "options": [
                        "net/http",
                        "web/express",
                        "fmt/http",
                        "os/network"
                ],
                "correctIndex": 0,
                "explanation": "Package `net/http` adalah package standar Go untuk membuat HTTP Server dan Client."
        }
},
{
        "id": 202,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "00:23:30",
        "title": "HTTP Server & http.ListenAndServe",
        "desc": "Menjalankan HTTP Web Server lokal dengan mengonfigurasi host dan port.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Menjalankan HTTP Server</h3>\n            <p>Fungsi <code>http.ListenAndServe(\"localhost:8080\", handler)</code> digunakan untuk menyalakan web server pada address tertentu.</p>\n            <pre>server := http.Server{\n    Addr: \"localhost:8080\",\n    Handler: mux,\n}\nerr := server.ListenAndServe()</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n)\n\nfunc main() {\n\tserver := &http.Server{\n\t\tAddr: \"localhost:8080\",\n\t}\n\tfmt.Println(\"Server siap berjalan pada address:\", server.Addr)\n}",
        "quiz": {
                "question": "Fungsi standar apa yang dipanggil untuk mendengarkan port TCP dan memproses request HTTP di Go?",
                "options": [
                        "http.ListenAndServe(addr, handler)",
                        "http.StartServer()",
                        "http.Run()",
                        "http.ListenPort()"
                ],
                "correctIndex": 0,
                "explanation": "`http.ListenAndServe` menerima alamat host:port dan handler HTTP."
        }
},
{
        "id": 203,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "00:30:35",
        "title": "Handler & http.HandlerFunc",
        "desc": "Membuat fungsi pemroses request HTTP menggunakan interface http.Handler dan adapter HandlerFunc.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Interface http.Handler</h3>\n            <pre>type Handler interface {\n    ServeHTTP(ResponseWriter, *Request)\n}</pre>\n            <p>Kita dapat mengubah fungsi biasa menjadi `http.Handler` menggunakan adapter `http.HandlerFunc`:</p>\n            <pre>var handler http.HandlerFunc = func(w http.ResponseWriter, r *http.Request) {\n    fmt.Fprintln(w, \"Hello Golang Web!\")\n}</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n)\n\nfunc main() {\n\tvar handler http.HandlerFunc = func(w http.ResponseWriter, r *http.Request) {\n\t\tfmt.Fprintln(w, \"Halo Pengunjung Web Go!\")\n\t}\n\tfmt.Println(\"HandlerFunc berhasil dikonfigurasi:\", handler != nil)\n}",
        "quiz": {
                "question": "Dua parameter wajib pada fungsi handler HTTP di Go?",
                "options": [
                        "http.ResponseWriter dan *http.Request",
                        "http.Context dan string",
                        "w io.Writer dan r io.Reader",
                        "int dan string"
                ],
                "correctIndex": 0,
                "explanation": "Handler menerima `w http.ResponseWriter` untuk menulis response dan `r *http.Request` untuk membaca data request."
        }
},
{
        "id": 204,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "00:37:56",
        "title": "Multi-Routing dengan http.ServeMux",
        "desc": "Mengarahkan berbagai endpoint URL ke handler yang sesuai menggunakan ServeMux.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Pengenalan http.ServeMux</h3>\n            <p><code>http.ServeMux</code> adalah HTTP request multiplexer bawaan Go. Mux mencocokkan URL dari setiap request yang masuk dengan daftar pola (pattern) yang didaftarkan.</p>\n            <pre>mux := http.NewServeMux()\nmux.HandleFunc(\"/\", homeHandler)\nmux.HandleFunc(\"/about\", aboutHandler)</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n)\n\nfunc main() {\n\tmux := http.NewServeMux()\n\tmux.HandleFunc(\"/\", func(w http.ResponseWriter, r *http.Request) {\n\t\tfmt.Fprintln(w, \"Index Page\")\n\t})\n\tmux.HandleFunc(\"/hello\", func(w http.ResponseWriter, r *http.Request) {\n\t\tfmt.Fprintln(w, \"Hello Page\")\n\t})\n\tfmt.Println(\"ServeMux siap dengan 2 endpoint (/ dan /hello).\")\n}",
        "quiz": {
                "question": "Apa kegunaan utama dari `http.ServeMux` di Go?",
                "options": [
                        "Sebagai HTTP Request Multiplexer / Router untuk mengarahkan URL path ke handler tertentu",
                        "Untuk membuat database MySQL",
                        "Untuk mengenkripsi password",
                        "Untuk mengkompilasi program Go"
                ],
                "correctIndex": 0,
                "explanation": "`http.ServeMux` bertindak sebagai router bawaan untuk mendaftarkan dan memasangkan URL path dengan handler."
        }
},
{
        "id": 205,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "00:48:41",
        "title": "Handling HTTP Request & Method Inspecting",
        "desc": "Memeriksa detail informasi HTTP Request seperti Method (GET, POST), URL Path, dan Protocol.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Struktur *http.Request</h3>\n            <p>Objek <code>*http.Request</code> menampung seluruh atribut request yang dikirim client:</p>\n            <ul>\n                <li><code>r.Method</code>: \"GET\", \"POST\", \"PUT\", \"DELETE\"</li>\n                <li><code>r.URL.Path</code>: \"/users/profile\"</li>\n                <li><code>r.Header</code>: Map header HTTP</li>\n            </ul>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n)\n\nfunc main() {\n\treq, _ := http.NewRequest(\"POST\", \"/api/users\", nil)\n\tfmt.Println(\"Method:\", req.Method)\n\tfmt.Println(\"Path:\", req.URL.Path)\n}",
        "quiz": {
                "question": "Property apa pada `*http.Request` yang menunjukkan jenis HTTP Method (GET/POST/PUT/DELETE)?",
                "options": [
                        "r.Method",
                        "r.Type",
                        "r.Action",
                        "r.HTTPMethod"
                ],
                "correctIndex": 0,
                "explanation": "Field `r.Method` (string) menyimpan HTTP Method request."
        }
},
{
        "id": 206,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "00:52:41",
        "title": "Testing Web Handler dengan Package httptest",
        "desc": "Melakukan unit testing pada HTTP handler tanpa harus menyalakan server fisik di port TCP.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Package net/http/httptest</h3>\n            <p>Go memiliki package khusus untuk menguji handler web secara instan:</p>\n            <pre>req := httptest.NewRequest(\"GET\", \"/hello\", nil)\nrecorder := httptest.NewRecorder()\n\nHelloHandler(recorder, req)\n\nres := recorder.Result()\nfmt.Println(\"Status:\", res.StatusCode)</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n\t\"net/http/httptest\"\n)\n\nfunc main() {\n\thandler := func(w http.ResponseWriter, r *http.Request) {\n\t\tfmt.Fprintln(w, \"OK Test\")\n\t}\n\n\treq := httptest.NewRequest(\"GET\", \"/\", nil)\n\trec := httptest.NewRecorder()\n\n\thandler(rec, req)\n\tfmt.Println(\"Hasil Response Test Body:\", rec.Body.String())\n}",
        "quiz": {
                "question": "Apa keunggulan menguji handler HTTP dengan `httptest.NewRecorder()`?",
                "options": [
                        "Dapat melakukan pengujian unit secara cepat di memori tanpa perlu membuka port TCP fisik di OS",
                        "Membuat pengujian berjalan 100x lebih lambat",
                        "Wajib menggunakan browser Chrome",
                        "Menghapus kode handler secara otomatis"
                ],
                "correctIndex": 0,
                "explanation": "`httptest.NewRecorder` mencatat response HTTP langsung di memori RAM sehingga pengujian berjalan sangat cepat."
        }
},
{
        "id": 207,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "01:01:46",
        "title": "Query Parameter & Multi-Value Query Params",
        "desc": "Membaca data parameter dari URL query string (?name=Eko&age=30).",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Membaca Query Parameter</h3>\n            <p>Query parameter diambil dari `r.URL.Query()` yang mengembalikan tipe <code>url.Values</code> (map[string][]string):</p>\n            <pre>name := r.URL.Query().Get(\"name\") // Nilai pertama\ntags := r.URL.Query()[\"tags\"]     // Multi-values slice</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/url\"\n)\n\nfunc main() {\n\tu, _ := url.Parse(\"http://localhost:8080/search?q=golang&page=2&tags=go&tags=web\")\n\tq := u.Query()\n\n\tfmt.Println(\"Keyword (q):\", q.Get(\"q\"))\n\tfmt.Println(\"Page:\", q.Get(\"page\"))\n\tfmt.Println(\"Tags (slice):\", q[\"tags\"])\n}",
        "quiz": {
                "question": "Method apa pada `url.Values` untuk mengambil 1 nilai string pertama dari query parameter?",
                "options": [
                        "Get(key)",
                        "Fetch(key)",
                        "Value(key)",
                        "Read(key)"
                ],
                "correctIndex": 0,
                "explanation": "Method `.Get(\"key\")` mengembalikan nilai string pertama, atau string kosong jika key tidak ada."
        }
},
{
        "id": 208,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "01:19:06",
        "title": "Reading & Writing HTTP Headers",
        "desc": "Membaca header request dan menulis header response seperti Content-Type dan Custom Headers.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>HTTP Headers</h3>\n            <pre>// Membaca Header Request\ncontentType := r.Header.Get(\"Content-Type\")\n\n// Menulis Header Response (Wajib sebelum WriteHeader/Write)\nw.Header().Set(\"Content-Type\", \"application/json\")\nw.Header().Set(\"X-Powered-By\", \"Golang\")</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n\t\"net/http/httptest\"\n)\n\nfunc main() {\n\thandler := func(w http.ResponseWriter, r *http.Request) {\n\t\tw.Header().Set(\"Content-Type\", \"application/json\")\n\t\tfmt.Fprintln(w, `{\"message\":\"Hello JSON\"}`)\n\t}\n\n\trec := httptest.NewRecorder()\n\treq := httptest.NewRequest(\"GET\", \"/\", nil)\n\thandler(rec, req)\n\n\tfmt.Println(\"Response Content-Type Header:\", rec.Header().Get(\"Content-Type\"))\n}",
        "quiz": {
                "question": "Kapan waktu yang tepat memanggil `w.Header().Set()` saat menyusun HTTP response?",
                "options": [
                        "Sebelum memanggil `w.WriteHeader()` atau menulis data response dengan `w.Write()`",
                        "Setelah server dimatikan",
                        "Di akhir fungsi main()",
                        "Bebas kapan saja tanpa aturan"
                ],
                "correctIndex": 0,
                "explanation": "Header HTTP harus diset terlebih dahulu sebelum status code atau body response dikirim ke stream client."
        }
},
{
        "id": 209,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "01:29:29",
        "title": "Parsing Form Post (URL Encoded & Form Data)",
        "desc": "Membaca input data form dari request body POST.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Membaca Data POST Form</h3>\n            <pre>err := r.ParseForm()\nfirstName := r.PostFormValue(\"first_name\")\nemail := r.PostForm.Get(\"email\")</pre>\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Tips:</div>\n                <p><code>r.PostFormValue(\"key\")</code> otomatis memanggil <code>r.ParseForm()</code> jika belum dipanggil sebelumnya.</p>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n\t\"strings\"\n)\n\nfunc main() {\n\treq, _ := http.NewRequest(\"POST\", \"/login\", strings.NewReader(\"username=eko&password=secret123\"))\n\treq.Header.Set(\"Content-Type\", \"application/x-www-form-urlencoded\")\n\t\n\treq.ParseForm()\n\tfmt.Println(\"Username:\", req.PostFormValue(\"username\"))\n\tfmt.Println(\"Password:\", req.PostFormValue(\"password\"))\n}",
        "quiz": {
                "question": "Method ringkas pada `*http.Request` yang dapat langsung membaca data POST form sekaligus otomatis memparsing form?",
                "options": [
                        "r.PostFormValue(\"key\")",
                        "r.GetForm()",
                        "r.ReadInput()",
                        "r.Post()"
                ],
                "correctIndex": 0,
                "explanation": "`r.PostFormValue(key)` secara praktis memparsing form jika belum dan mengembalikan string nilainya."
        }
},
{
        "id": 210,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "01:39:49",
        "title": "Setting HTTP Response Status Code (w.WriteHeader)",
        "desc": "Mengirimkan HTTP status code spesifik (200 OK, 400 Bad Request, 404 Not Found, 500 Internal Error).",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>HTTP Response Code</h3>\n            <pre>w.WriteHeader(http.StatusNotFound) // 404\nfmt.Fprintln(w, \"Halaman Tidak Ditemukan\")</pre>\n            <p>Jika <code>w.WriteHeader()</code> tidak dipanggil eksplisit, Go secara otomatis mengirimkan <code>200 OK</code> saat pertama kali <code>w.Write()</code> dipanggil.</p>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n)\n\nfunc main() {\n\tfmt.Println(\"Konstanta Status Code Go:\")\n\tfmt.Println(\"Status OK:\", http.StatusOK)\n\tfmt.Println(\"Status Bad Request:\", http.StatusBadRequest)\n\tfmt.Println(\"Status Not Found:\", http.StatusNotFound)\n\tfmt.Println(\"Status Internal Error:\", http.StatusInternalServerError)\n}",
        "quiz": {
                "question": "Konstanta bawaan `net/http` untuk mewakili kode status HTTP 404?",
                "options": [
                        "http.StatusNotFound",
                        "http.ErrNotFound",
                        "http.Code404",
                        "http.NotFoundCode"
                ],
                "correctIndex": 0,
                "explanation": "`http.StatusNotFound` berharga integer 404."
        }
},
{
        "id": 211,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "01:49:23",
        "title": "Managing HTTP Cookies (http.Cookie)",
        "desc": "Membuat, mengirim, dan membaca Cookie pada web browser client.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Operasi Cookie</h3>\n            <pre>// Menulis Cookie\ncookie := &http.Cookie{\n    Name: \"X-User-Token\",\n    Value: \"abc123token\",\n    Path: \"/\",\n}\nhttp.SetCookie(w, cookie)\n\n// Membaca Cookie\ncookie, err := r.Cookie(\"X-User-Token\")</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n)\n\nfunc main() {\n\tc := &http.Cookie{\n\t\tName:  \"session_id\",\n\t\tValue: \"xyz987654\",\n\t\tPath:  \"/\",\n\t}\n\tfmt.Printf(\"Cookie Struct: %s=%s (Path: %s)\n\", c.Name, c.Value, c.Path)\n}",
        "quiz": {
                "question": "Fungsi pembantu dari package `net/http` untuk menempelkan Cookie ke dalam HTTP Response Writer?",
                "options": [
                        "http.SetCookie(w, cookie)",
                        "w.AddCookie(cookie)",
                        "http.WriteCookie(cookie)",
                        "cookie.Save(w)"
                ],
                "correctIndex": 0,
                "explanation": "Fungsi `http.SetCookie(w ResponseWriter, cookie *Cookie)` digunakan untuk mengirim cookie."
        }
},
{
        "id": 212,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "02:09:17",
        "title": "Serving Static Files dengan http.FileServer & http.ServeFile",
        "desc": "Menyajikan file statis (HTML, CSS, JS, Gambar) ke browser client.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Static File Server</h3>\n            <pre>directory := http.Dir(\"./static\")\nfileServer := http.FileServer(directory)\n\n// Menghapus prefix URL sebelum meneruskan ke folder\nmux.Handle(\"/static/\", http.StripPrefix(\"/static\", fileServer))</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n)\n\nfunc main() {\n\tfs := http.FileServer(http.Dir(\"./static\"))\n\thandler := http.StripPrefix(\"/assets\", fs)\n\tfmt.Println(\"FileServer & StripPrefix terkonfigurasi:\", handler != nil)\n}",
        "quiz": {
                "question": "Fungsi pembantu yang digunakan untuk memotong prefix path URL sebelum diteruskan ke `http.FileServer`?",
                "options": [
                        "http.StripPrefix(prefix, handler)",
                        "http.TrimPath()",
                        "http.RemovePrefix()",
                        "http.CutURL()"
                ],
                "correctIndex": 0,
                "explanation": "`http.StripPrefix` memotong substring prefix dari URL path request sebelum diproses oleh handler di dalamnya."
        }
},
{
        "id": 213,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "02:32:45",
        "title": "HTML Templating Dasar (html/template)",
        "desc": "Membuat tampilan HTML dinamis menggunakan package standar html/template.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Package html/template</h3>\n            <pre>tmpl, err := template.ParseFiles(\"./templates/index.gohtml\")\ntmpl.Execute(w, data)</pre>\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Kenapa html/template?</div>\n                <p>Package ini secara otomatis menangani escaping karakter HTML sehingga aman dari serangan XSS secara default.</p>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"bytes\"\n\t\"fmt\"\n\t\"html/template\"\n)\n\nfunc main() {\n\ttext := \"<h1>Selamat Datang, {{.}}!</h1>\"\n\ttmpl, _ := template.New(\"index\").Parse(text)\n\n\tvar buf bytes.Buffer\n\ttmpl.Execute(&buf, \"Budi Kurniawan\")\n\n\tfmt.Println(\"Hasil Render Template:\")\n\tfmt.Println(buf.String())\n}",
        "quiz": {
                "question": "Package standar Go apa yang digunakan untuk merender tampilan HTML secara aman dari vulnerability XSS?",
                "options": [
                        "html/template",
                        "text/template",
                        "web/template",
                        "os/html"
                ],
                "correctIndex": 0,
                "explanation": "Package `html/template` adalah package standar Go dengan fitur otomatis contextual auto-escaping."
        }
},
{
        "id": 214,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "02:52:37",
        "title": "Passing Dynamic Data ke Template (Struct, Map, Dynamic Field)",
        "desc": "Mengirimkan data dinamis berupa Struct atau Map ke dalam template HTML.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Mengirim Data ke Template</h3>\n            <pre>type PageData struct {\n    Title string\n    Name  string\n}\n\ntmpl.Execute(w, PageData{Title: \"Home\", Name: \"Eko\"})</pre>\n            <p>Di dalam HTML Template, field diakses menggunakan tanda titik: <code>{{.Title}}</code> dan <code>{{.Name}}</code>.</p>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"bytes\"\n\t\"fmt\"\n\t\"html/template\"\n)\n\ntype UserProfile struct {\n\tName string\n\tRole string\n}\n\nfunc main() {\n\thtmlTmpl := \"<p>User: {{.Name}} | Role: {{.Role}}</p>\"\n\ttmpl, _ := template.New(\"profile\").Parse(htmlTmpl)\n\n\tvar buf bytes.Buffer\n\ttmpl.Execute(&buf, UserProfile{Name: \"Eko Khannedy\", Role: \"Software Engineer\"})\n\n\tfmt.Println(buf.String())\n}",
        "quiz": {
                "question": "Sintaks aksesor template Go untuk menampilkan isi field `Name` dari struct data yang dikirimkan?",
                "options": [
                        "{{.Name}}",
                        "{{$Name}}",
                        "[[Name]]",
                        "{{Name}}"
                ],
                "correctIndex": 0,
                "explanation": "Sintaks `{{.FieldName}}` digunakan untuk mengakses property/field dari data root."
        }
},
{
        "id": 215,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "03:02:04",
        "title": "Template Actions (if, else, range, with)",
        "desc": "Menambahkan logika pengondisian (if/else) dan perulangan (range) pada HTML Template.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Sintaks Template Actions</h3>\n            <pre>{{if .IsAdmin}}\n    &lt;p&gt;Admin Dashboard&lt;/p&gt;\n{{else}}\n    &lt;p&gt;User Dashboard&lt;/p&gt;\n{{end}}\n\n{{range $index, $element := .Hobbies}}\n    &lt;li&gt;{{$index}}: {{$element}}&lt;/li&gt;\n{{end}}</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"bytes\"\n\t\"fmt\"\n\t\"html/template\"\n)\n\nfunc main() {\n\tsrc := `Hobi:\n{{range .Hobbies}}\n - {{.}}\n{{end}}`\n\ttmpl, _ := template.New(\"hobbies\").Parse(src)\n\n\tdata := map[string]interface{}{\n\t\t\"Hobbies\": []string{\"Coding\", \"Gaming\", \"Reading\"},\n\t}\n\n\tvar buf bytes.Buffer\n\ttmpl.Execute(&buf, data)\n\n\tfmt.Println(buf.String())\n}",
        "quiz": {
                "question": "Keyword template action yang digunakan untuk melakukan iterasi/looping pada Slice atau Array?",
                "options": [
                        "range",
                        "for",
                        "foreach",
                        "loop"
                ],
                "correctIndex": 0,
                "explanation": "`{{range .Slice}} ... {{end}}` digunakan untuk melakukan iterasi."
        }
},
{
        "id": 216,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "03:27:42",
        "title": "Template Layout & Reusable Partials",
        "desc": "Membuat struktur layout modular (Header, Footer, Content) dengan {{define}} dan {{template}}.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Template Layout</h3>\n            <pre>{{define \"header\"}}\n    &lt;header&gt;&lt;h1&gt;{{.Title}}&lt;/h1&gt;&lt;/header&gt;\n{{end}}\n\n{{define \"main\"}}\n    {{template \"header\" .}}\n    &lt;main&gt;&lt;p&gt;Konten Utama&lt;/p&gt;&lt;/main&gt;\n{{end}}</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"bytes\"\n\t\"fmt\"\n\t\"html/template\"\n)\n\nfunc main() {\n\ttmpl := template.New(\"layout\")\n\ttemplate.Must(tmpl.New(\"header\").Parse(\"<header>Header Site</header>\n\"))\n\ttemplate.Must(tmpl.New(\"body\").Parse(\"{{template \"header\" .}}<main>Main Body</main>\"))\n\n\tvar buf bytes.Buffer\n\ttmpl.ExecuteTemplate(&buf, \"body\", nil)\n\n\tfmt.Println(buf.String())\n}",
        "quiz": {
                "question": "Action keyword untuk mendefinisikan nama blok partial template baru di Go?",
                "options": [
                        "{{define \"name\"}}",
                        "{{block \"name\"}}",
                        "{{create \"name\"}}",
                        "{{template \"name\"}}"
                ],
                "correctIndex": 0,
                "explanation": "`{{define \"name\"}} ... {{end}}` mendefinisikan blok template yang bisa dipanggil ulang."
        }
},
{
        "id": 217,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "03:38:40",
        "title": "Custom Template Functions",
        "desc": "Mendaftarkan fungsi buatan sendiri ke dalam HTML Template menggunakan template.FuncMap.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Custom FuncMap</h3>\n            <pre>funcMap := template.FuncMap{\n    \"upper\": strings.ToUpper,\n}\ntmpl := template.New(\"test\").Funcs(funcMap)</pre>\n            <p>Penggunaan di HTML: <code>{{upper .Name}}</code></p>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"bytes\"\n\t\"fmt\"\n\t\"html/template\"\n\t\"strings\"\n)\n\nfunc main() {\n\tfuncMap := template.FuncMap{\n\t\t\"upper\": strings.ToUpper,\n\t}\n\n\ttmpl, _ := template.New(\"funcTest\").Funcs(funcMap).Parse(\"Hello {{upper .}}\")\n\n\tvar buf bytes.Buffer\n\ttmpl.Execute(&buf, \"kodeloka\")\n\n\tfmt.Println(buf.String())\n}",
        "quiz": {
                "question": "Tipe data Map bawaan package `template` untuk mendaftarkan kustom fungsi ke template HTML?",
                "options": [
                        "template.FuncMap",
                        "template.FunctionList",
                        "map[string]func()",
                        "template.Handlers"
                ],
                "correctIndex": 0,
                "explanation": "`template.FuncMap` (map[string]interface{}) memetakan nama fungsi di template dengan fungsi Go."
        }
},
{
        "id": 218,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "03:56:37",
        "title": "Template Caching & Performance Optimization",
        "desc": "Strategi mem-parse template sekali pada saat inisialisasi aplikasi untuk performa maksimal.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Template Caching</h3>\n            <div class=\"callout callout-warning\">\n                <div class=\"callout-title\">⚠️ Hindari Anti-Pattern:</div>\n                <p>Memanggil <code>template.ParseFiles()</code> di dalam fungsi HTTP Handler akan membaca ulang file dari disk pada setiap request (Sangat Lambat!).</p>\n            </div>\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">✅ Solusi Caching:</div>\n                <p>Gunakan <code>template.Must(template.ParseGlob(\"./templates/*.gohtml\"))</code> pada level global saat aplikasi pertama kali menyala.</p>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"html/template\"\n)\n\n// Template diparse sekali pada level paket/global\nvar templates = template.Must(template.New(\"app\").Parse(\"<h1>Cached Template</h1>\"))\n\nfunc main() {\n\tfmt.Println(\"Template berhasil di-cache pada startup!\", templates != nil)\n}",
        "quiz": {
                "question": "Mengapa tidak disarankan memanggil `template.ParseFiles()` di dalam setiap HTTP Request Handler?",
                "options": [
                        "Karena akan melakukan I/O disk berulang yang membuat performa aplikasi web menjadi sangat lambat",
                        "Karena menyebabkan syntax error pada Go",
                        "Karena menghapus file HTML otomatis",
                        "Karena membatasi jumlah koneksi"
                ],
                "correctIndex": 0,
                "explanation": "Parsing file dari disk membutuhkan I/O yang mahal. Sebaiknya template di-parse sekali saat inisialisasi awal (caching)."
        }
},
{
        "id": 219,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "04:02:39",
        "title": "Keamanan Web: Mencegah XSS (Cross-Site Scripting)",
        "desc": "Mekanisme proteksi auto-escaping HTML dan cara aman menangani konten HTML mentah.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Auto Escaping Security</h3>\n            <p>Jika pengguna memasukkan input mengandung script jahat <code>&lt;script&gt;alert('xss')&lt;/script&gt;</code>, <code>html/template</code> otomatis mengonversinya menjadi safe entities: <code>&amp;lt;script&amp;gt;...</code></p>\n            <p>Jika ingin merender HTML asli tanpa escaping (hanya dari sumber terpercaya), gunakan tipe <code>template.HTML</code>.</p>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"bytes\"\n\t\"fmt\"\n\t\"html/template\"\n)\n\nfunc main() {\n\tuserInput := \"<script>alert('hack')</script>\"\n\ttmpl, _ := template.New(\"xss\").Parse(\"Input: {{.}}\n\")\n\n\tvar buf bytes.Buffer\n\ttmpl.Execute(&buf, userInput)\n\n\tfmt.Println(\"Hasil Render Safe Escaped:\")\n\tfmt.Println(buf.String())\n}",
        "quiz": {
                "question": "Bagaimana `html/template` melindungi aplikasi dari serangan XSS secara otomatis?",
                "options": [
                        "Dengan mengompresi file HTML",
                        "Dengan secara otomatis melakukan escaping pada karakter HTML khusus seperti `<` dan `>`",
                        "Dengan memblokir semua variabel",
                        "Dengan mengubah server menjadi HTTPS"
                ],
                "correctIndex": 1,
                "explanation": "Package `html/template` melakukan contextual auto-escaping pada tag/karakter berbahaya."
        }
},
{
        "id": 220,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "04:18:56",
        "title": "HTTP Redirects (http.Redirect)",
        "desc": "Mengalihkan halaman pengguna dari satu lokasi URL ke lokasi lain.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Penggunaan http.Redirect</h3>\n            <pre>func LoginHandler(w http.ResponseWriter, r *http.Request) {\n    // Pengalihan ke halaman /dashboard dengan status 303 See Other\n    http.Redirect(w, r, \"/dashboard\", http.StatusSeeOther)\n}</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n\t\"net/http/httptest\"\n)\n\nfunc main() {\n\thandler := func(w http.ResponseWriter, r *http.Request) {\n\t\thttp.Redirect(w, r, \"/login\", http.StatusSeeOther)\n\t}\n\n\trec := httptest.NewRecorder()\n\treq := httptest.NewRequest(\"GET\", \"/old-path\", nil)\n\thandler(rec, req)\n\n\tfmt.Println(\"Redirect Status Code:\", rec.Code)\n\tfmt.Println(\"Redirect Location Header:\", rec.Header().Get(\"Location\"))\n}",
        "quiz": {
                "question": "Fungsi pembantu standar Go untuk mengalihkan pengguna ke URL target baru?",
                "options": [
                        "http.Redirect(w, r, url, code)",
                        "w.Redirect(url)",
                        "http.MoveTo(url)",
                        "r.Forward(url)"
                ],
                "correctIndex": 0,
                "explanation": "`http.Redirect` mengatur header `Location` dan HTTP response status code pengalihan (301/302/303)."
        }
},
{
        "id": 221,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "04:27:19",
        "title": "Handling File Upload (r.FormFile)",
        "desc": "Menerima dan memproses unggahan file dari form multipart/form-data.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>File Upload Handling</h3>\n            <pre>file, header, err := r.FormFile(\"avatar\")\nif err != nil { return }\ndefer file.Close()\n\n// Simpan file ke disk\ntargetFile, _ := os.Create(\"./uploads/\" + header.Filename)\nio.Copy(targetFile, file)</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== FILE UPLOAD HANDLER ===\")\n\tfmt.Println(\"1. HTML Form: enctype=\"multipart/form-data\"\")\n\tfmt.Println(\"2. Go Handler: file, header, err := r.FormFile(\"fieldname\")\")\n\tfmt.Println(\"3. Simpan dengan io.Copy(destFile, file)\")\n\t_ = http.Request{}\n}",
        "quiz": {
                "question": "Atribut `enctype` wajib pada tag `<form>` HTML agar form mendukung unggah file?",
                "options": [
                        "multipart/form-data",
                        "application/x-www-form-urlencoded",
                        "text/plain",
                        "application/json"
                ],
                "correctIndex": 0,
                "explanation": "`enctype=\"multipart/form-data\"` diperlukan agar browser mengirimkan file biner lewat HTTP request body."
        }
},
{
        "id": 222,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "04:54:55",
        "title": "Download File Header (Content-Disposition)",
        "desc": "Mengirim file ke pengguna dengan instruksi download otomatis di browser.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>File Download</h3>\n            <p>Untuk memaksa browser mengunduh file alih-alih mengabarkannya di layar, set header <code>Content-Disposition</code>:</p>\n            <pre>w.Header().Set(\"Content-Disposition\", \"attachment; filename=\"laporan.pdf\"\")\nhttp.ServeFile(w, r, \"./files/laporan.pdf\")</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n\t\"net/http/httptest\"\n)\n\nfunc main() {\n\thandler := func(w http.ResponseWriter, r *http.Request) {\n\t\tw.Header().Set(\"Content-Disposition\", \"attachment; filename=\"document.txt\"\")\n\t\tfmt.Fprintln(w, \"Isi dokumen rahasia\")\n\t}\n\n\trec := httptest.NewRecorder()\n\treq := httptest.NewRequest(\"GET\", \"/download\", nil)\n\thandler(rec, req)\n\n\tfmt.Println(\"Header Content-Disposition:\", rec.Header().Get(\"Content-Disposition\"))\n}",
        "quiz": {
                "question": "Nilai header `Content-Disposition` yang menginstruksikan browser mengunduh file sebagai lampiran?",
                "options": [
                        "attachment; filename=\"file.ext\"",
                        "inline",
                        "download-now",
                        "save-to-disk"
                ],
                "correctIndex": 0,
                "explanation": "Header `Content-Disposition: attachment; filename=\"...\"` memicu dialog download otomatis di browser."
        }
},
{
        "id": 223,
        "category": "Domain 20: Golang Web Development",
        "timestamp": "05:03:32",
        "title": "Web Middleware Pattern",
        "desc": "Membangun komponen Middleware (Logger, Auth, Recover) dengan membungkus http.Handler.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Pola Middleware di Go</h3>\n            <pre>type Middleware func(http.Handler) http.Handler\n\nfunc LogMiddleware(next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        fmt.Println(\"Log Request:\", r.Method, r.URL.Path)\n        next.ServeHTTP(w, r) // Lanjut ke handler berikutnya\n    })\n}</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n\t\"net/http/httptest\"\n)\n\nfunc SimpleLogMiddleware(next http.Handler) http.Handler {\n\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n\t\tfmt.Println(\"[LOG] Incoming Request:\", r.URL.Path)\n\t\tnext.ServeHTTP(w, r)\n\t})\n}\n\nfunc main() {\n\tmainHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n\t\tfmt.Fprintln(w, \"Core Handler Executed\")\n\t})\n\n\twrapped := SimpleLogMiddleware(mainHandler)\n\n\trec := httptest.NewRecorder()\n\treq := httptest.NewRequest(\"GET\", \"/dashboard\", nil)\n\twrapped.ServeHTTP(rec, req)\n}",
        "quiz": {
                "question": "Bagaimana cara Middleware di Go meneruskan eksekusi ke handler berikutnya di dalam rantai (chain)?",
                "options": [
                        "Memanggil `next.ServeHTTP(w, r)`",
                        "Memanggil `next.Continue()`",
                        "Memanggil `return nil`",
                        "Memanggil `http.Next()`"
                ],
                "correctIndex": 0,
                "explanation": "Dengan memanggil `next.ServeHTTP(w, r)`, middleware meneruskan kontrol ke handler berikutnya."
        }
},
{
        "id": 224,
        "category": "Domain 21: Golang HTTP Router",
        "timestamp": "00:01:37",
        "title": "Pengenalan Library julienschmidt/httprouter",
        "desc": "Keunggulan library httprouter dibanding http.ServeMux bawaan (high performance & zero allocation).",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Library julienschmidt/httprouter</h3>\n            <p><code>httprouter</code> adalah library routing pihak ketiga yang sangat populer di ekosistem Go karena kecepatannya yang ekstrem (menggunakan algoritma <strong>Radix Tree</strong>) dan efisiensi alokasi memori yang sangat rendah.</p>\n        </div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"=== JULIENSCHMIDT/HTTPROUTER ===\")\n\tfmt.Println(\"1. Kecepatan pencocokan URL ultra-kencang berbasis Radix Tree\")\n\tfmt.Println(\"2. Mendukung Path Parameter (:id) dan Catch-All (*filepath)\")\n}",
        "quiz": {
                "question": "Struktur data algoritma apa yang digunakan `httprouter` untuk melakukan URL matching secara ultra cepat?",
                "options": [
                        "Radix Tree (Prefix Tree)",
                        "Linked List",
                        "Binary Search Tree",
                        "Stack"
                ],
                "correctIndex": 0,
                "explanation": "`httprouter` menggunakan struktur data Radix Tree yang efisien untuk pencocokan string URL path."
        }
},
{
        "id": 225,
        "category": "Domain 21: Golang HTTP Router",
        "timestamp": "00:06:56",
        "title": "Routing Method Spesifik & Handler (GET, POST, PUT, DELETE)",
        "desc": "Mendaftarkan route spesifik HTTP Method pada instance HttpRouter.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Sintaks Route HttpRouter</h3>\n            <pre>router := httprouter.New()\nrouter.GET(\"/users\", GetUsersHandler)\nrouter.POST(\"/users\", CreateUserHandler)\nrouter.DELETE(\"/users/:id\", DeleteUserHandler)</pre>\n        </div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Sintaks Mendaftarkan Route di HttpRouter:\")\n\tfmt.Println(\"router.GET(\"/api/products\", handler)\")\n\tfmt.Println(\"router.POST(\"/api/products\", handler)\")\n}",
        "quiz": {
                "question": "Method mana pada `httprouter.Router` untuk mendaftarkan HTTP GET route?",
                "options": [
                        "router.GET(path, handle)",
                        "router.GetRoute()",
                        "router.AddGET()",
                        "router.Register()"
                ],
                "correctIndex": 0,
                "explanation": "Method `.GET(path string, handle httprouter.Handle)` mendaftarkan endpoint HTTP GET."
        }
},
{
        "id": 226,
        "category": "Domain 21: Golang HTTP Router",
        "timestamp": "00:18:54",
        "title": "Named Path Parameters (:param)",
        "desc": "Mengambil variabel dinamis dari segmen URL path seperti /products/:id.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Named Parameter</h3>\n            <pre>router.GET(\"/products/:id\", func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {\n    id := ps.ByName(\"id\")\n    fmt.Fprintln(w, \"Product ID:\", id)\n})</pre>\n        </div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\t// Simulasi pembacaan params dari httprouter.Params\n\tmockParams := map[string]string{\"id\": \"105\", \"category\": \"electronics\"}\n\t\n\tfmt.Println(\"Product ID:\", mockParams[\"id\"])\n\tfmt.Println(\"Category:\", mockParams[\"category\"])\n}",
        "quiz": {
                "question": "Method apa pada `httprouter.Params` untuk mengambil nilai parameter berdasarkan nama variabel path-nya?",
                "options": [
                        "ps.ByName(\"key\")",
                        "ps.Get(\"key\")",
                        "ps.Value(\"key\")",
                        "ps.Find(\"key\")"
                ],
                "correctIndex": 0,
                "explanation": "Method `ps.ByName(\"id\")` mengembalikan nilai string dari named parameter `:id`."
        }
},
{
        "id": 227,
        "category": "Domain 21: Golang HTTP Router",
        "timestamp": "00:24:48",
        "title": "Catch-All Path Parameters (*filepath)",
        "desc": "Menggunakan wildcard catch-all (*filepath) untuk mencocokkan sisa panjang URL path.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Catch-All Parameter (*)</h3>\n            <pre>router.GET(\"/files/*filepath\", func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {\n    filepath := ps.ByName(\"filepath\")\n    // Mengambil \"/images/2026/banner.png\"\n})</pre>\n        </div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Wildcard Catch-All (*filepath):\")\n\tfmt.Println(\"URL: /images/2026/07/photo.jpg\")\n\tfmt.Println(\"Matching Route: /images/*filepath\")\n\tfmt.Println(\"ps.ByName(\"filepath\") => /2026/07/photo.jpg\")\n}",
        "quiz": {
                "question": "Simbol karakter apa yang digunakan `httprouter` untuk menangkap seluruh sisa segmen URL path (catch-all)?",
                "options": [
                        "Karakter Asterisk (*)",
                        "Karakter Titik Dua (:)",
                        "Karakter Persen (%)",
                        "Karakter Tanya (?)"
                ],
                "correctIndex": 0,
                "explanation": "Karakter asterisk (`*`) menangkap sisa segmen URL path secara fleksibel."
        }
},
{
        "id": 228,
        "category": "Domain 21: Golang HTTP Router",
        "timestamp": "00:33:08",
        "title": "Serving Static Files pada HttpRouter",
        "desc": "Menyajikan folder file statis menggunakan method router.ServeFiles().",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>router.ServeFiles</h3>\n            <pre>router.ServeFiles(\"/static/*filepath\", http.Dir(\"./public\"))</pre>\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Catatan:</div>\n                <p>Path pertama wajib diakhiri dengan wildcard <code>/*filepath</code>.</p>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Konfigurasi Static File HttpRouter:\")\n\tfmt.Println(\"router.ServeFiles(\"/public/*filepath\", http.Dir(\"./static\"))\")\n}",
        "quiz": {
                "question": "Method bawaan pada `httprouter.Router` untuk menyajikan folder file statis?",
                "options": [
                        "router.ServeFiles(path, root)",
                        "router.Static(path, dir)",
                        "router.MountStatic()",
                        "router.FileServer()"
                ],
                "correctIndex": 0,
                "explanation": "`router.ServeFiles` adalah method khusus `httprouter` untuk menyajikan file statis."
        }
},
{
        "id": 229,
        "category": "Domain 21: Golang HTTP Router",
        "timestamp": "00:38:47",
        "title": "Custom Panic Handler (router.PanicHandler)",
        "desc": "Menangkap panic pada handler agar aplikasi tidak shutdown dan memberikan response 500.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>router.PanicHandler</h3>\n            <pre>router.PanicHandler = func(w http.ResponseWriter, r *http.Request, errorData interface{}) {\n    w.WriteHeader(http.StatusInternalServerError)\n    fmt.Fprintln(w, \"Terjadi Kesalahan Server Internal:\", errorData)\n}</pre>\n        </div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"=== CUSTOM PANIC HANDLER ===\")\n\tfmt.Println(\"router.PanicHandler = func(w, r, errData) { ... }\")\n\tfmt.Println(\"Aplikasi web tetap stabil dan aman dari shutdown tak terduga!\")\n}",
        "quiz": {
                "question": "Field property apa pada `httprouter.Router` untuk menetapkan penanganan khusus jika terjadi panic?",
                "options": [
                        "router.PanicHandler",
                        "router.OnError",
                        "router.CatchPanic",
                        "router.Recover"
                ],
                "correctIndex": 0,
                "explanation": "Property `router.PanicHandler` menampung fungsi pemulihan panic di `httprouter`."
        }
},
{
        "id": 230,
        "category": "Domain 21: Golang HTTP Router",
        "timestamp": "00:43:43",
        "title": "Custom Not Found Handler (router.NotFound)",
        "desc": "Kustomisasi response HTTP 404 Not Found saat URL endpoint tidak cocok.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>router.NotFound</h3>\n            <pre>router.NotFound = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n    w.WriteHeader(http.StatusNotFound)\n    fmt.Fprintln(w, \"404 - Endpoint Tidak Ditemukan!\")\n})</pre>\n        </div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Kustomisasi 404 di HttpRouter:\")\n\tfmt.Println(\"router.NotFound = http.HandlerFunc(...)\")\n}",
        "quiz": {
                "question": "Property `httprouter.Router` untuk menetapkan handler custom saat route 404 (Not Found)?",
                "options": [
                        "router.NotFound",
                        "router.Page404",
                        "router.MissingRoute",
                        "router.Err404"
                ],
                "correctIndex": 0,
                "explanation": "Property `router.NotFound` bertipe `http.Handler`."
        }
},
{
        "id": 231,
        "category": "Domain 21: Golang HTTP Router",
        "timestamp": "00:46:35",
        "title": "Custom Method Not Allowed Handler (router.MethodNotAllowed)",
        "desc": "Kustomisasi response HTTP 405 saat route ada tetapi HTTP Method tidak diizinkan.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>router.MethodNotAllowed</h3>\n            <pre>router.MethodNotAllowed = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n    w.WriteHeader(http.StatusMethodNotAllowed)\n    fmt.Fprintln(w, \"405 - HTTP Method Tidak Diizinkan!\")\n})</pre>\n        </div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"HTTP Status Code 405: Method Not Allowed\")\n\tfmt.Println(\"Misal: Route /users hanya menerima GET, tetapi dikirimi request POST.\")\n}",
        "quiz": {
                "question": "Response HTTP status code yang dikembalikan saat URL path terdaftar namun HTTP Method yang digunakan tidak sesuai?",
                "options": [
                        "405 Method Not Allowed",
                        "404 Not Found",
                        "400 Bad Request",
                        "500 Internal Error"
                ],
                "correctIndex": 0,
                "explanation": "HTTP Status Code 405 menandakan URL valid namun method HTTP tidak diizinkan."
        }
},
{
        "id": 232,
        "category": "Domain 21: Golang HTTP Router",
        "timestamp": "00:50:26",
        "title": "Integration HttpRouter dengan Standard Middleware",
        "desc": "Membungkus Router HttpRouter ke dalam middleware standar net/http.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Integrasi Middleware</h3>\n            <p>Karena <code>httprouter.Router</code> mengimplementasikan <code>http.Handler</code>, router ini dapat langsung dibungkus oleh fungsi Middleware apa pun.</p>\n            <pre>router := httprouter.New()\n// ... register routes ...\n\n// Wrap dengan Logger Middleware\nserver := http.Server{\n    Addr: \"localhost:8080\",\n    Handler: LogMiddleware(router),\n}</pre>\n        </div>",
        "initialCode": "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"=== INTEGRASI HTTPROUTER + MIDDLEWARE ===\")\n\tfmt.Println(\"httprouter.Router memenuhi interface http.Handler secara komplit!\")\n}",
        "quiz": {
                "question": "Mengapa `httprouter.Router` dapat langsung dibungkus oleh Middleware standar Go?",
                "options": [
                        "Karena `httprouter.Router` mengimplementasikan interface `http.Handler` standar",
                        "Karena httprouter ditulis dalam bahasa C",
                        "Karena httprouter tidak mendukung routing",
                        "Karena middleware hanya berjalan di Linux"
                ],
                "correctIndex": 0,
                "explanation": "`httprouter.Router` mengimplementasikan method `ServeHTTP(w, r)`, menjadikannya kompatibel dengan `http.Handler`."
        }
},
{
        "id": 233,
        "category": "Domain 22: Golang RESTful API",
        "timestamp": "00:01:10",
        "title": "Arsitektur Clean RESTful API (Entity, Repository, Service, Controller, Router)",
        "desc": "Memahami pemisahan layer pada arsitektur standar produksi aplikasi Go REST API.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Layered Architecture RESTful API</h3>\n            <p>Untuk membangun REST API yang siap dipakai di tingkat produksi (production-ready), kita menggunakan <strong>Layered / Clean Architecture</strong> dengan pembagian tanggung jawab yang jelas:</p>\n\n            <table class=\"tech-table\">\n                <thead>\n                    <tr><th>Layer</th><th>Tanggung Jawab Utama</th></tr>\n                </thead>\n                <tbody>\n                    <tr><td><code>Domain / Entity</code></td><td>Menampung struct model data utama database dan DTO.</td></tr>\n                    <tr><td><code>Repository</code></td><td>Melakukan operasi CRUD langsung ke Database SQL.</td></tr>\n                    <tr><td><code>Service</code></td><td>Menampung logika bisnis, validasi input, dan manajemen transaksi.</td></tr>\n                    <tr><td><code>Controller / Handler</code></td><td>Menerima HTTP Request, decode JSON, panggil Service, & encode HTTP Response.</td></tr>\n                    <tr><td><code>Router & Middleware</code></td><td>Routing endpoint URL dan penanganan error/auth terpusat.</td></tr>\n                </tbody>\n            </table>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== RESTFUL API CLEAN ARCHITECTURE ===\")\n\tfmt.Println(\"HTTP Request -> Router -> Controller -> Service -> Repository -> Database\")\n}",
        "quiz": {
                "question": "Layer arsitektur RESTful API manakah yang bertanggung jawab khusus melakukan kueri SQL CRUD langsung ke database?",
                "options": [
                        "Repository Layer",
                        "Controller Layer",
                        "Service Layer",
                        "Router Layer"
                ],
                "correctIndex": 0,
                "explanation": "Repository Layer bertindak sebagai abstraksi penyimpanan data yang mengeksekusi query database."
        }
},
{
        "id": 234,
        "category": "Domain 22: Golang RESTful API",
        "timestamp": "00:07:45",
        "title": "Model Entity & Data Transfer Object (Request & Response DTO)",
        "desc": "Memisahkan struct internal database dengan struct payload JSON HTTP Request/Response.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Separation of DTO & Entity</h3>\n            <p>Sangat disarankan untuk <strong>TIDAK</strong> memakai struct entity database secara langsung sebagai payload JSON HTTP. Gunakan <strong>DTO (Data Transfer Object)</strong> terpisah!</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Alasan Menggunakan DTO:</div>\n                <ul>\n                    <li>Mengamankan data sensitif (seperti `password_hash` atau `internal_note`) agar tidak bocor di JSON Response.</li>\n                    <li>Memberikan tag validasi khusus pada Request DTO (seperti `validate:\"required,email\"`).</li>\n                </ul>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\n// Entity DB\ntype Category struct {\n\tId   int\n\tName string\n}\n\n// Response DTO\ntype CategoryResponse struct {\n\tId   int    `json:\"id\"`\n\tName string `json:\"name\"`\n}\n\nfunc main() {\n\tentity := Category{Id: 1, Name: \"Gadget\"}\n\tdto := CategoryResponse{Id: entity.Id, Name: entity.Name}\n\n\tfmt.Printf(\"Entity: %+v\\n\", entity)\n\tfmt.Printf(\"Response DTO: %+v\\n\", dto)\n}",
        "quiz": {
                "question": "Apakah keuntungan utama memisahkan struct Entity Database dengan struct Response DTO?",
                "options": [
                        "Mencegah kebocoran field internal/sensitf database ke response JSON client",
                        "Membuat query SQL berjalan lebih cepat",
                        "Menghilangkan kebutuhan akan tipe data int",
                        "Membuat server HTTP otomatis restart"
                ],
                "correctIndex": 0,
                "explanation": "DTO memastikan hanya data publik yang relevan yang dikirimkan ke client JSON."
        }
},
{
        "id": 235,
        "category": "Domain 22: Golang RESTful API",
        "timestamp": "00:15:20",
        "title": "Repository Layer & Database CRUD Operations",
        "desc": "Implementasi interface CategoryRepository untuk kueri SQL `Save`, `Update`, `Delete`, `FindById`, `FindAll`.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Membangun Repository Layer</h3>\n            <p>Repository menerima parameter <code>context.Context</code> dan koneksi database <code>*sql.DB</code> atau <code>*sql.Tx</code> untuk mengeksekusi prepared query SQL.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Interface CategoryRepository:</div>\n                <pre>type CategoryRepository interface {\n    Save(ctx context.Context, tx *sql.Tx, category Category) Category\n    Update(ctx context.Context, tx *sql.Tx, category Category) Category\n    Delete(ctx context.Context, tx *sql.Tx, category Category)\n    FindById(ctx context.Context, tx *sql.Tx, categoryId int) (Category, error)\n    FindAll(ctx context.Context, tx *sql.Tx) []Category\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype Category struct {\n\tId   int\n\tName string\n}\n\ntype MemoryCategoryRepo struct {\n\tdata map[int]Category\n}\n\nfunc (r *MemoryCategoryRepo) Save(c Category) Category {\n\tr.data[c.Id] = c\n\treturn c\n}\n\nfunc main() {\n\trepo := &MemoryCategoryRepo{data: make(map[int]Category)}\n\tsaved := repo.Save(Category{Id: 101, Name: \"Laptop\"})\n\n\tfmt.Println(\"Saved to Repository:\", saved)\n}",
        "quiz": {
                "question": "Mengapa setiap method pada interface Repository sangat disarankan menerima parameter `context.Context`?",
                "options": [
                        "Untuk mendukung request cancellation, deadline timeout kueri database, serta penelusuran tracing",
                        "Agar method bisa dipanggil dari HTML",
                        "Wajib hukumnya oleh compiler Go",
                        "Untuk mengubah query SQL menjadi JSON"
                ],
                "correctIndex": 0,
                "explanation": "Parameter `context.Context` pada query DB memungkinkan pembatalan otomatis kueri jika client membatalkan request HTTP."
        }
},
{
        "id": 236,
        "category": "Domain 22: Golang RESTful API",
        "timestamp": "00:23:10",
        "title": "Helper Transaksi Database (sql.Tx) Automatis",
        "desc": "Membuat fungsi helper untuk manajemen Commit dan Rollback transaksi database secara aman.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Helper Transaksi Database</h3>\n            <p>Untuk memastikan prinsip ACID pada database, operasi mutasi data harus dibungkus dalam <code>sql.Tx</code>. Kita buat helper function <code>CommitOrRollback(tx *sql.Tx)</code> menggunakan <code>defer</code> dan <code>recover()</code>.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Contoh Helper CommitOrRollback:</div>\n                <pre>func CommitOrRollback(tx *sql.Tx) {\n    err := recover()\n    if err != nil {\n        tx.Rollback()\n        panic(err)\n    } else {\n        tx.Commit()\n    }\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc DemoTransaction(shouldFail bool) {\n\tfmt.Println(\"BEGIN TRANSACTION\")\n\tdefer func() {\n\t\tif r := recover(); r != nil {\n\t\t\tfmt.Println(\"⚠️ ROLLBACK TRANSACTION! Error detected:\", r)\n\t\t} else {\n\t\t\tfmt.Println(\"✅ COMMIT TRANSACTION SUCCESS!\")\n\t\t}\n\t}()\n\n\tif shouldFail {\n\t\tpanic(\"Database constraints violated!\")\n\t}\n\tfmt.Println(\"EXECUTING SQL QUERIES...\")\n}\n\nfunc main() {\n\tDemoTransaction(false)\n\tfmt.Println()\n\tDemoTransaction(true)\n}",
        "quiz": {
                "question": "Fungsi bawaan Go apakah yang dimanfaatkan dalam helper `CommitOrRollback` untuk mendeteksi apakah terjadi panic saat eksekusi transaksi database?",
                "options": [
                        "recover()",
                        "catch()",
                        "error()",
                        "defer()"
                ],
                "correctIndex": 0,
                "explanation": "Fungsi `recover()` menangkap nilai panic yang terjadi di dalam blok fungsi sehingga helper tahu kapan harus melakukan `tx.Rollback()`."
        }
},
{
        "id": 237,
        "category": "Domain 22: Golang RESTful API",
        "timestamp": "00:30:40",
        "title": "Service Layer & Input Validation (go-playground/validator)",
        "desc": "Implementasi logika bisnis dan validasi struct input request dengan library validator.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Service Layer & Validasi Input</h3>\n            <p>Service Layer bertindak sebagai tempat logika bisnis dijalankan. Sebelum mengirim data ke Repository, Service melakukan validasi input menggunakan library populer <code>go-playground/validator/v10</code>.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Contoh Tag Struct Validator:</div>\n                <pre>type CreateCategoryRequest struct {\n    Name string `validate:\"required,min=2,max=100\" json:\"name\"`\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"strings\"\n)\n\ntype CreateCategoryRequest struct {\n\tName string\n}\n\nfunc ValidateRequest(req CreateCategoryRequest) error {\n\tif strings.TrimSpace(req.Name) == \"\" {\n\t\treturn fmt.Errorf(\"field 'name' tidak boleh kosong\")\n\t}\n\treturn nil\n}\n\nfunc main() {\n\treq1 := CreateCategoryRequest{Name: \"\"}\n\treq2 := CreateCategoryRequest{Name: \"Peralatan Rumah\"}\n\n\tfmt.Println(\"Req 1 Validation:\", ValidateRequest(req1))\n\tfmt.Println(\"Req 2 Validation:\", ValidateRequest(req2))\n}",
        "quiz": {
                "question": "Package validasi terpopuler di ekosistem Go yang biasa digunakan untuk memvalidasi tag struct request DTO adalah?",
                "options": [
                        "go-playground/validator",
                        "golang/validation",
                        "express/validator",
                        "github/check"
                ],
                "correctIndex": 0,
                "explanation": "`go-playground/validator` adalah de-facto standard library untuk struct validation di Golang."
        }
},
{
        "id": 238,
        "category": "Domain 22: Golang RESTful API",
        "timestamp": "00:38:15",
        "title": "Controller / Handler Layer & JSON Serialization",
        "desc": "Menerima `http.Request`, decoding payload JSON, memanggil Service, dan merespons `http.ResponseWriter`.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Controller Layer</h3>\n            <p>Controller bertugas mengurus protocol HTTP. Controller membaca body request menggunakan <code>json.NewDecoder(r.Body).Decode(&req)</code> dan mengembalikan response JSON seragam menggunakan <code>WebResponse</code> struct.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Format WebResponse Standar:</div>\n                <pre>type WebResponse struct {\n    Code   int         `json:\"code\"`\n    Status string      `json:\"status\"`\n    Data   interface{} `json:\"data\"`\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\ntype WebResponse struct {\n\tCode   int         `json:\"code\"`\n\tStatus string      `json:\"status\"`\n\tData   interface{} `json:\"data\"`\n}\n\nfunc main() {\n\tres := WebResponse{\n\t\tCode:   200,\n\t\tStatus: \"OK\",\n\t\tData:   map[string]string{\"message\": \"Kategori berhasil dibuat\"},\n\t}\n\n\tjsonBytes, _ := json.MarshalIndent(res, \"\", \"  \")\n\tfmt.Println(string(jsonBytes))\n}",
        "quiz": {
                "question": "Method apakah dari `json.Decoder` yang digunakan di Controller untuk membaca body stream HTTP Request langsung ke struct Go?",
                "options": [
                        "decoder.Decode(&struct)",
                        "decoder.ReadJSON()",
                        "decoder.Parse()",
                        "decoder.Unmarshal()"
                ],
                "correctIndex": 0,
                "explanation": "`json.NewDecoder(r.Body).Decode(&requestStruct)` secara efisien membaca stream body request HTTP."
        }
},
{
        "id": 239,
        "category": "Domain 22: Golang RESTful API",
        "timestamp": "00:46:00",
        "title": "Centralized Error Handling & Panic Recovery Middleware",
        "desc": "Menangani error secara terpusat menggunakan Custom Error Middleware untuk merespon HTTP Status Code yang sesuai.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Centralized Error Handling</h3>\n            <p>Daripada menuliskan <code>if err != nil</code> dengan response error JSON yang berulang di setiap controller, kita dapat melempar <code>panic(err)</code> di controller dan ditangkap oleh **ErrorHandler Middleware** terpusat.</p>\n\n            <div class=\"callout callout-warning\">\n                <div class=\"callout-title\">⚠️ Pemetaan Error ke HTTP Status Code:</div>\n                <ul>\n                    <li><code>ValidationError</code> -> 400 Bad Request</li>\n                    <li><code>NotFoundError</code> -> 404 Not Found</li>\n                    <li><code>InternalError / Unknown Panic</code> -> 500 Internal Server Error</li>\n                </ul>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype NotFoundError struct {\n\tMessage string\n}\n\nfunc (e *NotFoundError) Error() string { return e.Message }\n\nfunc ErrorMiddleware(fn func()) {\n\tdefer func() {\n\t\tif r := recover(); r != nil {\n\t\t\tif notFound, ok := r.(*NotFoundError); ok {\n\t\t\t\tfmt.Println(\"HTTP 404 Not Found:\", notFound.Error())\n\t\t\t} else {\n\t\t\t\tfmt.Println(\"HTTP 500 Internal Server Error:\", r)\n\t\t\t}\n\t\t}\n\t}()\n\tfn()\n}\n\nfunc main() {\n\tErrorMiddleware(func() {\n\t\tpanic(&NotFoundError{Message: \"Category ID #999 tidak ditemukan\"})\n\t})\n}",
        "quiz": {
                "question": "Apakah HTTP Status Code yang sesuai untuk dikembalikan oleh Error Middleware saat terjadi `NotFoundError` di service layer?",
                "options": [
                        "404 Not Found",
                        "400 Bad Request",
                        "500 Internal Server Error",
                        "401 Unauthorized"
                ],
                "correctIndex": 0,
                "explanation": "HTTP Status 404 Not Found mengindikasikan bahwa resource yang diminta oleh client tidak ditemukan di database."
        }
},
{
        "id": 240,
        "category": "Domain 22: Golang RESTful API",
        "timestamp": "00:53:20",
        "title": "HTTP Routing & Param Handling (julienschmidt/httprouter)",
        "desc": "Mendaftarkan endpoint URL RESTful API menggunakan library HTTP Router performa tinggi.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>High Performance Routing dengan HttpRouter</h3>\n            <p><code>julienschmidt/httprouter</code> adalah library HTTP router berbasis Radix Tree yang sangat cepat dan hemat memori di Golang.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Mendaftarkan RESTful Endpoints:</div>\n                <pre>router := httprouter.New()\n\nrouter.GET(\"/api/categories\", controller.FindAll)\nrouter.GET(\"/api/categories/:categoryId\", controller.FindById)\nrouter.POST(\"/api/categories\", controller.Create)\nrouter.PUT(\"/api/categories/:categoryId\", controller.Update)\nrouter.DELETE(\"/api/categories/:categoryId\", controller.Delete)</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== RESTFUL ENDPOINTS REGISTRATION ===\")\n\tfmt.Println(\"GET    /api/categories          -> FindAll\")\n\tfmt.Println(\"GET    /api/categories/:id      -> FindById\")\n\tfmt.Println(\"POST   /api/categories          -> Create\")\n\tfmt.Println(\"PUT    /api/categories/:id      -> Update\")\n\tfmt.Println(\"DELETE /api/categories/:id      -> Delete\")\n}",
        "quiz": {
                "question": "Struktur data apakah yang digunakan oleh library `julienschmidt/httprouter` untuk melakukan matching URL route secara ultra-cepat?",
                "options": [
                        "Radix Tree",
                        "Linked List",
                        "Binary Search Tree",
                        "Array Linear"
                ],
                "correctIndex": 0,
                "explanation": "HttpRouter memanfaatkan struktur data Radix Tree (Patricia Tree) untuk pencarian routing yang efisien dan hemat alokasi memori."
        }
},
{
        "id": 241,
        "category": "Domain 22: Golang RESTful API",
        "timestamp": "01:00:15",
        "title": "Dependency Injection Assembly di Main Application",
        "desc": "Merangkai DB Connection, Repository, Service, Controller, Middleware & HTTP Server pada `main.go`.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Merangkai Seluruh Komponen di main()</h3>\n            <p>Tahap akhir sebelum menyalakan HTTP Server adalah memasangkan seluruh objek layer (Dependency Assembly):</p>\n\n            <pre>func main() {\n    db := app.NewDB()\n    validate := validator.New()\n\n    categoryRepository := repository.NewCategoryRepository()\n    categoryService := service.NewCategoryService(categoryRepository, db, validate)\n    categoryController := controller.NewCategoryController(categoryService)\n\n    router := app.NewRouter(categoryController)\n\n    server := http.Server{\n        Addr:    \"localhost:3000\",\n        Handler: middleware.NewAuthMiddleware(router),\n    }\n\n    server.ListenAndServe()\n}</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== APPLICATION STARTUP ASSEMBLY ===\")\n\tfmt.Println(\"1. Database Connection initialized\")\n\tfmt.Println(\"2. Repositories & Services wired\")\n\tfmt.Println(\"3. Controllers & Router attached\")\n\tfmt.Println(\"4. HTTP Server listening on http://localhost:3000\")\n}",
        "quiz": {
                "question": "Method dari `http.Server` apakah yang dipanggil untuk mulai mendengarkan koneksi request HTTP pada port server yang ditentukan?",
                "options": [
                        "server.ListenAndServe()",
                        "server.Start()",
                        "server.Run()",
                        "server.Execute()"
                ],
                "correctIndex": 0,
                "explanation": "`server.ListenAndServe()` membuka listener TCP socket dan melayani request HTTP secara berkelanjutan."
        }
},
{
        "id": 242,
        "category": "Domain 22: Golang RESTful API",
        "timestamp": "01:08:40",
        "title": "Integration Test RESTful API (net/http/httptest)",
        "desc": "Pengujian otomatis endpoint REST API menggunakan package bawaan `net/http/httptest` dan assert response JSON.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Integration Test dengan `httptest`</h3>\n            <p>Go menyediakan package bawaan <code>net/http/httptest</code> yang memungkinkan kita mengirim simulasi HTTP Request langsung ke handler HTTP tanpa perlu benar-benar menyalakan koneksi network port server!</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Contoh Kode Integration Test:</div>\n                <pre>func TestCreateCategorySuccess(t *testing.T) {\n    db := setupTestDB()\n    router := setupRouter(db)\n\n    requestBody := strings.NewReader(`{\"name\": \"Gadget\"}`)\n    request := httptest.NewRequest(http.MethodPost, \"http://localhost:3000/api/categories\", requestBody)\n    request.Header.Add(\"Content-Type\", \"application/json\")\n\n    recorder := httptest.NewRecorder()\n    router.ServeHTTP(recorder, request)\n\n    response := recorder.Result()\n    assert.Equal(t, 200, response.StatusCode)\n}</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n\t\"net/http/httptest\"\n)\n\nfunc main() {\n\t// Memodelkan test request menggunakan httptest\n\treq := httptest.NewRequest(http.MethodGet, \"/api/categories\", nil)\n\trec := httptest.NewRecorder()\n\n\tfmt.Println(\"=== INTEGRATION TEST SIMULATION ===\")\n\tfmt.Println(\"Simulated Method :\", req.Method)\n\tfmt.Println(\"Simulated Target :\", req.URL.Path)\n\tfmt.Println(\"Test Recorder Code:\", rec.Code)\n}",
        "quiz": {
                "question": "Package standard library Go manakah yang digunakan untuk mencatat dan menguji HTTP Response tanpa perlu menyalakan TCP Port server nyata?",
                "options": [
                        "net/http/httptest",
                        "testing/http",
                        "net/test",
                        "http/mock"
                ],
                "correctIndex": 0,
                "explanation": "Package `net/http/httptest` menyediakan `ResponseRecorder` dan `NewRequest` untuk testing handler HTTP dengan cepat dan terisolasi."
        }
},
{
        "id": 243,
        "category": "Domain 23: Golang Fiber Web Framework",
        "timestamp": "00:01:20",
        "title": "Pengenalan Fiber Framework & Fasthttp Engine",
        "desc": "Memahami arsitektur Fiber Web Framework yang terinspirasi dari Express.js dan didukung HTTP engine super cepat Fasthttp.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Apa itu Fiber Web Framework?</h3>\n            <p><strong>Fiber</strong> adalah web framework untuk Golang yang dibangun di atas <code>Fasthttp</code> (HTTP engine tercepat di Go). Sintaks Fiber dibuat sangat intuitif bagi developer yang terbiasa dengan <strong>Express.js</strong> (Node.js).</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">⚡ Kenapa Fiber Sangat Cepat?</div>\n                <ul>\n                    <li><strong>Zero Allocation:</strong> Meminimalkan alokasi memori saat menangani HTTP Request.</li>\n                    <li><strong>Low Memory Footprint:</strong> Konsumsi RAM sangat kecil.</li>\n                    <li><strong>Rich Ecosystem:</strong> Memiliki puluhan middleware resmi (CORS, JWT, Rate Limiter, Logger, Helmet).</li>\n                </ul>\n            </div>\n\n            <h3>Instalasi Fiber v2:</h3>\n            <pre>go get github.com/gofiber/fiber/v2</pre>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\n// Simulasi Struktur Framework Fiber\ntype FiberApp struct {\n\troutes map[string]string\n}\n\nfunc NewFiberApp() *FiberApp {\n\treturn &FiberApp{routes: make(map[string]string)}\n}\n\nfunc (a *FiberApp) Get(path string, handler string) {\n\ta.routes[\"GET \"+path] = handler\n}\n\nfunc main() {\n\tfmt.Println(\"=== INITIALIZING FIBER WEB APP ===\")\n\tapp := NewFiberApp()\n\tapp.Get(\"/\", \"Welcome to Fiber!\")\n\tapp.Get(\"/api/health\", \"Status OK\")\n\n\tfor route, handler := range app.routes {\n\t\tfmt.Printf(\"Registered Route: %-15s => %s\\n\", route, handler)\n\t}\n}",
        "quiz": {
                "question": "HTTP Engine manakah yang menjadi fondasi dasar performa tinggi dari Fiber Web Framework?",
                "options": [
                        "Fasthttp",
                        "net/http standard",
                        "Gin Engine",
                        "HttpRouter"
                ],
                "correctIndex": 0,
                "explanation": "Fiber menggunakan `valyala/fasthttp` sebagai fondasi menggantikan `net/http` bawaan untuk mencapai Zero Memory Allocation."
        }
},
{
        "id": 244,
        "category": "Domain 23: Golang Fiber Web Framework",
        "timestamp": "00:08:15",
        "title": "Inisialisasi App & Routing Dasar (GET, POST, PUT, DELETE)",
        "desc": "Membuat aplikasi Fiber pertama, mendaftarkan HTTP methods, dan mengembalikan response text/json.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Sintaks Routing Dasar Fiber</h3>\n            <p>Di Fiber, instansiasi server dilakukan dengan <code>app := fiber.New()</code> dan dijalankan dengan <code>app.Listen(\":3000\")</code>.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 HTTP Method Handlers:</div>\n                <pre>app.Get(\"/users\", func(c *fiber.Ctx) error {\n    return c.SendString(\"Get All Users\")\n})\n\napp.Post(\"/users\", func(c *fiber.Ctx) error {\n    return c.Status(201).JSON(fiber.Map{\"message\": \"User Created\"})\n})\n\napp.Put(\"/users/:id\", func(c *fiber.Ctx) error {\n    return c.SendString(\"Update User\")\n})\n\napp.Delete(\"/users/:id\", func(c *fiber.Ctx) error {\n    return c.SendStatus(204)\n})</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype CtxMock struct {\n\tMethod string\n\tPath   string\n}\n\nfunc (c *CtxMock) SendString(msg string) {\n\tfmt.Printf(\"[%s %s] Response: %s\\n\", c.Method, c.Path, msg)\n}\n\nfunc main() {\n\tfmt.Println(\"=== DEMO FIBER ROUTING ===\")\n\tgetRoute := CtxMock{Method: \"GET\", Path: \"/api/v1/ping\"}\n\tgetRoute.SendString(\"pong\")\n\n\tpostRoute := CtxMock{Method: \"POST\", Path: \"/api/v1/users\"}\n\tpostRoute.SendString(\"User Created Successfully\")\n}",
        "quiz": {
                "question": "Fungsi Fiber apakah yang digunakan untuk memulai HTTP Server pada port tertentu (misal port 8080)?",
                "options": [
                        "app.Listen(\":8080\")",
                        "app.Run(8080)",
                        "app.StartServer(8080)",
                        "app.Serve(\":8080\")"
                ],
                "correctIndex": 0,
                "explanation": "`app.Listen(\":port\")` adalah fungsi standar Fiber untuk menyalakan listener HTTP."
        }
},
{
        "id": 245,
        "category": "Domain 23: Golang Fiber Web Framework",
        "timestamp": "00:15:30",
        "title": "Fiber Context (fiber.Ctx) & Request Handling",
        "desc": "Mengekstrak Path Parameter, Query Parameter, Request Header, dan Body Parsing menggunakan fiber.Ctx.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Membedah `fiber.Ctx`</h3>\n            <p>Object <code>*fiber.Ctx</code> menyimpan seluruh informasi request dan response HTTP.</p>\n\n            <table class=\"table-styled\">\n                <thead>\n                    <tr>\n                        <th>Tipe Data</th>\n                        <th>Method Context</th>\n                        <th>Contoh Penggunaan</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr>\n                        <td>Path Parameter</td>\n                        <td><code>c.Params(\"id\")</code></td>\n                        <td>GET <code>/users/:id</code></td>\n                    </tr>\n                    <tr>\n                        <td>Query Parameter</td>\n                        <td><code>c.Query(\"page\")</code></td>\n                        <td>GET <code>/users?page=2</code></td>\n                    </tr>\n                    <tr>\n                        <td>Request Header</td>\n                        <td><code>c.Get(\"Authorization\")</code></td>\n                        <td>Membaca token Bearer</td>\n                    </tr>\n                    <tr>\n                        <td>JSON Body Payload</td>\n                        <td><code>c.BodyParser(&user)</code></td>\n                        <td>Decode otomatis JSON request body ke struct</td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\ntype UserDTO struct {\n\tName  string `json:\"name\"`\n\tEmail string `json:\"email\"`\n}\n\nfunc main() {\n\t// Simulasi BodyParser Fiber\n\tdummyBody := `{\"name\": \"Budi\", \"email\": \"budi@gmail.com\"}`\n\n\tfmt.Println(\"=== SIMULASI FIBER BodyParser ===\")\n\tfmt.Println(\"Incoming Raw Request Body:\", dummyBody)\n\tfmt.Println(\"BodyParser berhasil melakukan unmarshal JSON ke struct UserDTO!\")\n}",
        "quiz": {
                "question": "Method pada `fiber.Ctx` apakah yang digunakan untuk mengurai (parse) payload JSON dari Request Body langsung ke dalam sebuah Pointer Struct?",
                "options": [
                        "c.BodyParser(&struct)",
                        "c.UnmarshalBody(&struct)",
                        "c.DecodeJSON(&struct)",
                        "c.ParseRequest(&struct)"
                ],
                "correctIndex": 0,
                "explanation": "`c.BodyParser(out interface{})` otomatis memilah Content-Type (JSON/XML/Form) dan memasukkannya ke struct target."
        }
},
{
        "id": 246,
        "category": "Domain 23: Golang Fiber Web Framework",
        "timestamp": "00:23:10",
        "title": "Response Formatting & Status Codes (JSON, HTML, SendFile, SendStatus)",
        "desc": "Mengirimkan berbagai jenis response seperti JSON terstruktur, status code, file download, dan fiber.Map.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Ragam Jenis Response di Fiber</h3>\n            <p>Fiber memudahkan pembuatan response API yang konsisten.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Helper Respon Populer:</div>\n                <ul>\n                    <li><code>c.JSON(data)</code>: Mengirim data sebagai JSON (Header Content-Type: application/json).</li>\n                    <li><code>fiber.Map{\"key\": \"value\"}</code>: Shortcut pembuatan map `map[string]interface{}` untuk JSON dinamis.</li>\n                    <li><code>c.Status(fiber.StatusCreated)</code>: Menentukan HTTP Status Code (200, 201, 400, 500).</li>\n                    <li><code>c.SendFile(\"./static/doc.pdf\")</code>: Mengirim file fisik ke browser klien.</li>\n                </ul>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\n// Simulasi fiber.Map\ntype FiberMap map[string]interface{}\n\nfunc main() {\n\tresponse := FiberMap{\n\t\t\"code\":    200,\n\t\t\"status\":  \"OK\",\n\t\t\"message\": \"Data berhasil ditemukan\",\n\t\t\"data\": FiberMap{\n\t\t\t\"id\":   101,\n\t\t\t\"name\": \"Buku Golang Fiber\",\n\t\t},\n\t}\n\n\tbytes, _ := json.MarshalIndent(response, \"\", \"  \")\n\tfmt.Println(\"=== FIBER JSON RESPONSE MAP ===\")\n\tfmt.Println(string(bytes))\n}",
        "quiz": {
                "question": "Shortcut tipe data apakah yang disediakan oleh Fiber untuk membuat objek JSON dinamis tanpa perlu mendefinisikan struct baru?",
                "options": [
                        "fiber.Map",
                        "fiber.JSONMap",
                        "fiber.Object",
                        "fiber.Data"
                ],
                "correctIndex": 0,
                "explanation": "`fiber.Map` adalah alias dari `map[string]interface{}` yang sangat praktis untuk JSON response."
        }
},
{
        "id": 247,
        "category": "Domain 23: Golang Fiber Web Framework",
        "timestamp": "00:30:40",
        "title": "Fiber Middleware (Logger, Recover, CORS, Limiter)",
        "desc": "Menggunakan middleware bawaan Fiber dan mendesain custom middleware untuk autentikasi token.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Konsep Middleware di Fiber</h3>\n            <p>Middleware adalah fungsi yang dieksekusi <strong>sebelum atau sesudah</strong> HTTP Handler utama dipanggil. Middleware digunakan untuk logging, menangani panic, keamanan CORS, dan proteksi autentikasi.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Memasang Middleware Resmi Fiber:</div>\n                <pre>import (\n    \"github.com/gofiber/fiber/v2/middleware/logger\"\n    \"github.com/gofiber/fiber/v2/middleware/recover\"\n    \"github.com/gofiber/fiber/v2/middleware/cors\"\n)\n\napp.Use(logger.New())  // Logging HTTP Request ke console\napp.Use(recover.New()) // Mencegah server crash akibat Panic\napp.Use(cors.New())    // Izinkan Cross-Origin Resource Sharing</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\n// Simulasi Middleware Chain Fiber\nfunc AuthMiddleware(token string) bool {\n\tif token == \"secret-token-123\" {\n\t\treturn true\n\t}\n\treturn false\n}\n\nfunc main() {\n\ttokens := []string{\"secret-token-123\", \"wrong-token\"}\n\n\tfmt.Println(\"=== DEMO FIBER AUTH MIDDLEWARE ===\")\n\tfor _, t := range tokens {\n\t\tif AuthMiddleware(t) {\n\t\t\tfmt.Printf(\"Token '%s' => ACCESS GRANTED (c.Next() dipanggil)\\n\", t)\n\t\t} else {\n\t\t\tfmt.Printf(\"Token '%s' => ACCESS DENIED (HTTP 401 Unauthorized)\\n\", t)\n\t\t}\n\t}\n}",
        "quiz": {
                "question": "Method apakah pada `fiber.Ctx` yang wajib dipanggil di dalam sebuah Custom Middleware agar eksekusi dilanjutkan ke Middleware atau Handler berikutnya?",
                "options": [
                        "c.Next()",
                        "c.Continue()",
                        "c.Proceed()",
                        "c.Forward()"
                ],
                "correctIndex": 0,
                "explanation": "`return c.Next()` menginstruksikan Fiber untuk meneruskan request ke handler selanjutnya dalam eksekusi pipeline."
        }
},
{
        "id": 248,
        "category": "Domain 23: Golang Fiber Web Framework",
        "timestamp": "00:38:00",
        "title": "Grouping Router & Versioning API",
        "desc": "Mengorganisir endpoint API berukuran besar menggunakan Route Grouping dan API Versioning (v1, v2).",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Grouping Route untuk Aplikasi Skala Besar</h3>\n            <p>Agar file `main.go` tidak berantakan, Fiber menyediakan fungsi <code>app.Group()</code> untuk mengelompokkan endpoint berdasarkan prefix path atau versi API.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Contoh Grouping Route:</div>\n                <pre>api := app.Group(\"/api\") // Prefix /api\n\nv1 := api.Group(\"/v1\")   // Prefix /api/v1\nv1.Get(\"/users\", getUsersV1)\n\nv2 := api.Group(\"/v2\")   // Prefix /api/v2\nv2.Get(\"/users\", getUsersV2)</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\troutes := map[string]string{\n\t\t\"/api/v1/products\": \"Get Products Version 1 (Legacy)\",\n\t\t\"/api/v2/products\": \"Get Products Version 2 (High Performance)\",\n\t}\n\n\tfmt.Println(\"=== API VERSION GROUPING ===\")\n\tfor path, desc := range routes {\n\t\tfmt.Printf(\"Endpoint: %-20s => %s\\n\", path, desc)\n\t}\n}",
        "quiz": {
                "question": "Fungsi apakah pada Fiber yang digunakan untuk mengelompokkan beberapa endpoint di bawah satu prefix URL yang sama?",
                "options": [
                        "app.Group(\"/prefix\")",
                        "app.SubRoute(\"/prefix\")",
                        "app.Cluster(\"/prefix\")",
                        "app.Prefix(\"/prefix\")"
                ],
                "correctIndex": 0,
                "explanation": "`app.Group(prefix)` membuat instansi sub-router baru berawalan prefix URL tertentu."
        }
},
{
        "id": 249,
        "category": "Domain 23: Golang Fiber Web Framework",
        "timestamp": "00:45:20",
        "title": "Fiber Error Handling & Custom Error Handler",
        "desc": "Menangani error secara terpusat menggunakan fiber.ErrorHandler dan fiber.NewError.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Centralized Error Handling</h3>\n            <p>Fiber mendukung pengelolaan error terpusat. Jika suatu handler mengembalikan `error`, Fiber akan menangkapnya dan memprosesnya di <strong>Custom Error Handler Global</strong>.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Mengatur Custom Error Handler Global:</div>\n                <pre>app := fiber.New(fiber.Config{\n    ErrorHandler: func(c *fiber.Ctx, err error) error {\n        code := fiber.StatusInternalServerError\n        if e, ok := err.(*fiber.Error); ok {\n            code = e.Code\n        }\n        return c.Status(code).JSON(fiber.Map{\n            \"error\": true,\n            \"message\": err.Error(),\n        })\n    },\n})</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\ntype CustomErrorResponse struct {\n\tError   bool   `json:\"error\"`\n\tCode    int    `json:\"code\"`\n\tMessage string `json:\"message\"`\n}\n\nfunc main() {\n\terrResp := CustomErrorResponse{\n\t\tError:   true,\n\t\tCode:    404,\n\t\tMessage: \"Resource Data User Tidak Ditemukan\",\n\t}\n\n\tbytes, _ := json.MarshalIndent(errResp, \"\", \"  \")\n\tfmt.Println(\"=== CENTRALIZED ERROR RESPONSE FIBER ===\")\n\tfmt.Println(string(bytes))\n}",
        "quiz": {
                "question": "Fungsi apakah dari Fiber yang digunakan untuk membuat objek `error` khusus yang membawa pesan teks sekaligus HTTP Status Code?",
                "options": [
                        "fiber.NewError(code, message)",
                        "fiber.CreateError(message, code)",
                        "fiber.Err(code)",
                        "fiber.Raise(code)"
                ],
                "correctIndex": 0,
                "explanation": "`fiber.NewError(code, message)` mengembalikan pointer `*fiber.Error` yang dipahami oleh ErrorHandler Fiber."
        }
},
{
        "id": 250,
        "category": "Domain 23: Golang Fiber Web Framework",
        "timestamp": "00:52:10",
        "title": "Template Engine (HTML Render) & Static File Serving",
        "desc": "Menyajikan file statis (CSS, JS, Gambar) dan melakukan render template HTML dinamis di Fiber.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Static Files & HTML Views</h3>\n            <p>Selain membuat REST API, Fiber juga sangat powerful untuk menyajikan aplikasi Server-Side Rendered (SSR) atau assets statis.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">💡 Menyajikan Folder Statis:</div>\n                <pre>app.Static(\"/public\", \"./public\") // Mengakses file ./public/logo.png via URL /public/logo.png</pre>\n            </div>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Menggunakan Engine Template HTML:</div>\n                <pre>import \"github.com/gofiber/template/html/v2\"\n\nengine := html.New(\"./views\", \".html\")\napp := fiber.New(fiber.Config{\n    Views: engine,\n})\n\napp.Get(\"/\", func(c *fiber.Ctx) error {\n    return c.Render(\"index\", fiber.Map{\"Title\": \"Home Page\"})\n})</pre>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"fmt\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== FIBER STATIC & TEMPLATE ENGINE DEMO ===\")\n\tfmt.Println(\"Folder ./public berhasil di-bind ke route static '/public'\")\n\tfmt.Println(\"Template Engine HTML berhasil merender file views/index.html!\")\n}",
        "quiz": {
                "question": "Method apakah pada `fiber.Ctx` yang digunakan untuk merender file template HTML dengan menyisipkan data dinamis?",
                "options": [
                        "c.Render(\"filename\", data)",
                        "c.HTML(\"filename\", data)",
                        "c.View(\"filename\", data)",
                        "c.Template(\"filename\", data)"
                ],
                "correctIndex": 0,
                "explanation": "`c.Render(templateName, data)` merender file tampilan menggunakan View Engine yang terkonfigurasi."
        }
},
{
        "id": 251,
        "category": "Domain 23: Golang Fiber Web Framework",
        "timestamp": "00:59:00",
        "title": "Studi Kasus: RESTful API CRUD Produk dengan Fiber & In-Memory Storage",
        "desc": "Membangun aplikasi REST API Produk lengkap (Create, Read, Update, Delete) dengan Fiber Web Framework.",
        "theoryHtml": "<div class=\"theory-section\">\n            <h3>Studi Kasus Lengkap: RESTful API Fiber</h3>\n            <p>Mari kita gabungkan seluruh konsep Fiber (Routing, Ctx, JSON Response, Error Handling) ke dalam sebuah API CRUD Produk yang utuh.</p>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">📌 Endpoint API yang Dibangun:</div>\n                <ul>\n                    <li><code>GET /api/products</code>: Mengambil semua daftar produk.</li>\n                    <li><code>GET /api/products/:id</code>: Mengambil detail produk spesifik.</li>\n                    <li><code>POST /api/products</code>: Menambah produk baru.</li>\n                    <li><code>DELETE /api/products/:id</code>: Menghapus produk.</li>\n                </ul>\n            </div>\n        </div>",
        "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n)\n\ntype Product struct {\n\tID    int     `json:\"id\"`\n\tName  string  `json:\"name\"`\n\tPrice float64 `json:\"price\"`\n}\n\nvar db = []Product{\n\t{ID: 1, Name: \"Keyboard Mechanical\", Price: 750000},\n\t{ID: 2, Name: \"Monitor Gaming 144Hz\", Price: 2300000},\n}\n\nfunc GetAllProducts() string {\n\tbytes, _ := json.MarshalIndent(db, \"\", \"  \")\n\treturn string(bytes)\n}\n\nfunc main() {\n\tfmt.Println(\"=== FULL DEMO RESTFUL API PRODUCTS (FIBER) ===\")\n\tfmt.Println(\"GET /api/products Response:\")\n\tfmt.Println(GetAllProducts())\n}",
        "quiz": {
                "question": "Manakah pernyataan yang BENAR mengenai arsitektur Fiber Web Framework?",
                "options": [
                        "Fiber sangat cepat karena berbasis Fasthttp, memiliki sintaks mirip Express.js, dan meminimalkan alokasi memori",
                        "Fiber adalah modul bawaan dari standard library Golang",
                        "Fiber hanya bisa digunakan untuk membuat tampilan HTML dan tidak bisa membuat REST API",
                        "Fiber sangat lambat jika dibandingkan dengan net/http standar"
                ],
                "correctIndex": 0,
                "explanation": "Fiber terkenal akan kecepatan Fasthttp, sintaks yang familiar seperti Express.js, dan optimasi memori yang luar biasa."
        }
},
{
    "id": 252,
    "category": "Domain 24: gRPC & Protocol Buffers",
    "timestamp": "00:00:00",
    "title": "Pengenalan gRPC & Protobuf di Go",
    "desc": "Mendefinisikan kontrak layanan dengan Protocol Buffers, membangkitkan kode Go, serta membuat server dan klien gRPC pertama.",
    "theoryHtml": `
        <div class="theory-section">
            <h3>Kenapa gRPC untuk Komunikasi Antar Layanan</h3>
            <table class="tech-table">
                <thead><tr><th>Aspek</th><th>REST + JSON</th><th>gRPC + Protobuf</th></tr></thead>
                <tbody>
                    <tr><td>Format data</td><td>Teks, boros</td><td>Biner, padat (3–10x lebih kecil)</td></tr>
                    <tr><td>Kontrak</td><td>OpenAPI, terpisah &amp; mudah basi</td><td>Berkas <code>.proto</code> sebagai sumber kebenaran</td></tr>
                    <tr><td>Pembangkitan kode</td><td>Opsional</td><td>Wajib, untuk klien &amp; server sekaligus</td></tr>
                    <tr><td>Streaming</td><td>Terbatas (SSE, WebSocket)</td><td>Bawaan, dua arah</td></tr>
                    <tr><td>Transport</td><td>HTTP/1.1 umumnya</td><td>HTTP/2, multiplexing</td></tr>
                    <tr><td>Dukungan peramban</td><td>Langsung</td><td>Perlu gRPC-Web atau gateway</td></tr>
                    <tr><td>Kemudahan debug</td><td>Mudah, cukup curl</td><td>Perlu perkakas seperti grpcurl</td></tr>
                </tbody>
            </table>

            <div class="callout callout-info">
                <div class="callout-title">💡 Panduan pemilihan</div>
                <p>Gunakan <strong>gRPC untuk komunikasi antar layanan internal</strong> — di sanalah efisiensi, kontrak yang ketat, dan streaming benar-benar terasa manfaatnya. Gunakan <strong>REST untuk API yang menghadap publik dan peramban</strong>, karena dukungan perkakasnya jauh lebih luas. Banyak sistem memakai keduanya: gRPC di dalam, REST di tepi lewat gateway.</p>
            </div>

            <h3>Mendefinisikan Kontrak</h3>
            <div class="code-box">
                <div class="code-box-header"><span>proto/pesanan/v1/pesanan.proto</span></div>
                <pre>syntax = "proto3";

package pesanan.v1;
option go_package = "github.com/org/proyek/gen/pesanan/v1;pesananv1";

import "google/protobuf/timestamp.proto";

service LayananPesanan {
  rpc BuatPesanan(BuatPesananRequest) returns (BuatPesananResponse);
  rpc AmbilPesanan(AmbilPesananRequest) returns (Pesanan);
  rpc DaftarPesanan(DaftarPesananRequest) returns (stream Pesanan);
}

message Pesanan {
  string id                              = 1;
  int64  pengguna_id                     = 2;
  int64  total                           = 3;   // rupiah, BUKAN float
  StatusPesanan status                   = 4;
  repeated ItemPesanan item              = 5;
  google.protobuf.Timestamp dibuat_pada  = 6;
}

message ItemPesanan {
  string produk_id = 1;
  int32  jumlah    = 2;
  int64  harga     = 3;
}

enum StatusPesanan {
  STATUS_PESANAN_TIDAK_DIKETAHUI = 0;   // WAJIB ada di indeks 0
  STATUS_PESANAN_MENUNGGU        = 1;
  STATUS_PESANAN_DIBAYAR         = 2;
  STATUS_PESANAN_DIKIRIM         = 3;
  STATUS_PESANAN_DIBATALKAN      = 4;
}

message BuatPesananRequest {
  int64 pengguna_id             = 1;
  repeated ItemPesanan item     = 2;
  string kunci_idempotensi      = 3;
}

message BuatPesananResponse { Pesanan pesanan = 1; }
message AmbilPesananRequest  { string id = 1; }
message DaftarPesananRequest { int64 pengguna_id = 1; int32 batas = 2; }</pre>
            </div>

            <div class="callout callout-danger">
                <div class="callout-title">🚫 Aturan nomor field yang tidak boleh dilanggar</div>
                <p>Nomor field (<code>= 1</code>, <code>= 2</code>) adalah <strong>satu-satunya</strong> hal yang dikirim di kabel; nama field tidak ikut terkirim. Karena itu:</p>
                <ul>
                    <li><strong>Jangan pernah mengubah nomor field</strong> yang sudah dipakai — data lama akan terbaca sebagai field yang salah.</li>
                    <li><strong>Jangan pernah menggunakan ulang nomor</strong> field yang sudah dihapus. Tandai dengan <code>reserved 3, 7;</code> agar tidak terpakai lagi.</li>
                    <li>Mengganti <em>nama</em> field aman untuk kabel, tetapi merusak kode yang sudah dibangkitkan.</li>
                    <li>Nomor 1–15 memakai 1 byte pengkodean, jadi berikan untuk field yang paling sering terpakai.</li>
                </ul>
            </div>

            <h3>Membangkitkan Kode Go</h3>
            <div class="code-box">
                <pre>go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

protoc --go_out=. --go_opt=paths=source_relative \\
       --go-grpc_out=. --go-grpc_opt=paths=source_relative \\
       proto/pesanan/v1/pesanan.proto</pre>
            </div>

            <div class="callout callout-tip">
                <div class="callout-title">📌 Gunakan buf, bukan protoc langsung</div>
                <p>Mengelola <code>protoc</code> beserta jalur import-nya cepat menjadi menyakitkan. Perkakas <strong>buf</strong> menyediakan manajemen dependensi proto, linting, dan <em>deteksi perubahan yang merusak kompatibilitas</em> — yang terakhir ini sangat berharga karena mencegah Anda tanpa sadar memutus klien yang sudah berjalan.</p>
                <div class="code-box">
                    <pre>buf lint
buf breaking --against '.git#branch=main'
buf generate</pre>
                </div>
            </div>

            <h3>Server</h3>
            <div class="code-box">
                <pre>type serverPesanan struct {
    pesananv1.UnimplementedLayananPesananServer   // WAJIB disematkan
    repo Repository
}

func (s *serverPesanan) BuatPesanan(
    ctx context.Context,
    req *pesananv1.BuatPesananRequest,
) (*pesananv1.BuatPesananResponse, error) {

    if req.GetPenggunaId() == 0 {
        return nil, status.Error(codes.InvalidArgument, "pengguna_id wajib diisi")
    }
    if len(req.GetItem()) == 0 {
        return nil, status.Error(codes.InvalidArgument, "item tidak boleh kosong")
    }

    p, err := s.repo.Buat(ctx, req)
    if errors.Is(err, ErrStokHabis) {
        return nil, status.Error(codes.FailedPrecondition, "stok tidak mencukupi")
    }
    if err != nil {
        // JANGAN bocorkan detail internal ke klien
        log.Printf("buat pesanan: %v", err)
        return nil, status.Error(codes.Internal, "terjadi kesalahan internal")
    }

    return &pesananv1.BuatPesananResponse{Pesanan: p}, nil
}

func main() {
    lis, _ := net.Listen("tcp", ":50051")
    s := grpc.NewServer()
    pesananv1.RegisterLayananPesananServer(s, &serverPesanan{repo: repo})
    reflection.Register(s)     // agar grpcurl bisa menjelajah
    log.Fatal(s.Serve(lis))
}</pre>
            </div>

            <div class="callout callout-warning">
                <div class="callout-title">⚠️ Selalu sematkan Unimplemented…Server</div>
                <p>Struct <code>UnimplementedLayananPesananServer</code> memberi implementasi bawaan untuk semua method. Tanpanya, setiap kali ada RPC baru ditambahkan ke berkas proto, kode server Anda langsung gagal dikompilasi. Dengan menyematkannya, RPC baru cukup mengembalikan <code>Unimplemented</code> sampai Anda sempat mengisinya.</p>
            </div>

            <h3>Klien</h3>
            <div class="code-box">
                <pre>conn, err := grpc.NewClient(
    "layanan-pesanan:50051",
    grpc.WithTransportCredentials(insecure.NewCredentials()),
)
if err != nil { log.Fatal(err) }
defer conn.Close()

klien := pesananv1.NewLayananPesananClient(conn)

ctx, batal := context.WithTimeout(context.Background(), 3*time.Second)
defer batal()

resp, err := klien.BuatPesanan(ctx, &pesananv1.BuatPesananRequest{
    PenggunaId: 55,
    Item: []*pesananv1.ItemPesanan{
        {ProdukId: "p-1", Jumlah: 2, Harga: 85000},
    },
    KunciIdempotensi: uuid.NewString(),
})

if err != nil {
    st, _ := status.FromError(err)
    switch st.Code() {
    case codes.FailedPrecondition:
        // stok habis -- tampilkan pesan ke pengguna
    case codes.DeadlineExceeded:
        // timeout -- boleh dicoba lagi
    }
}</pre>
            </div>

            <div class="callout callout-info">
                <div class="callout-title">💡 Deadline diteruskan otomatis</div>
                <p>Berbeda dari HTTP biasa, gRPC mengirimkan <em>sisa waktu</em> dari context sebagai bagian dari protokol. Bila klien memberi deadline 3 detik dan sudah terpakai 2,5 detik, server tahu ia hanya punya 0,5 detik dan bisa langsung menyerah alih-alih mengerjakan pekerjaan yang hasilnya pasti dibuang. Inilah deadline propagation yang di REST harus dibangun sendiri.</p>
            </div>
        </div>
    `,
    "initialCode": "package main\n\nimport \"fmt\"\n\n// Simulasi struktur yang dibangkitkan protoc\ntype StatusPesanan int32\n\nconst (\n\tStatusTidakDiketahui StatusPesanan = 0\n\tStatusMenunggu       StatusPesanan = 1\n\tStatusDibayar        StatusPesanan = 2\n)\n\nfunc (s StatusPesanan) String() string {\n\tswitch s {\n\tcase StatusMenunggu:\n\t\treturn \"MENUNGGU\"\n\tcase StatusDibayar:\n\t\treturn \"DIBAYAR\"\n\tdefault:\n\t\treturn \"TIDAK_DIKETAHUI\"\n\t}\n}\n\ntype ItemPesanan struct {\n\tProdukId string\n\tJumlah   int32\n\tHarga    int64\n}\n\ntype Pesanan struct {\n\tId         string\n\tPenggunaId int64\n\tTotal      int64\n\tStatus     StatusPesanan\n\tItem       []*ItemPesanan\n}\n\n// Getter nil-safe, persis seperti yang dibangkitkan protoc\nfunc (p *Pesanan) GetTotal() int64 {\n\tif p == nil {\n\t\treturn 0\n\t}\n\treturn p.Total\n}\n\nfunc main() {\n\tp := &Pesanan{\n\t\tId: \"p-1001\", PenggunaId: 55, Status: StatusMenunggu,\n\t\tItem: []*ItemPesanan{\n\t\t\t{ProdukId: \"kopi-gayo\", Jumlah: 2, Harga: 85000},\n\t\t\t{ProdukId: \"gula-aren\", Jumlah: 1, Harga: 25000},\n\t\t},\n\t}\n\tfor _, it := range p.Item {\n\t\tp.Total += int64(it.Jumlah) * it.Harga\n\t}\n\n\tfmt.Printf(\"Pesanan %s (pengguna %d) status=%v\\n\", p.Id, p.PenggunaId, p.Status)\n\tfor _, it := range p.Item {\n\t\tfmt.Printf(\"  %-12s x%d @ Rp%d\\n\", it.ProdukId, it.Jumlah, it.Harga)\n\t}\n\tfmt.Printf(\"Total: Rp%d\\n\", p.GetTotal())\n\n\tvar kosong *Pesanan\n\tfmt.Println(\"Getter nil-safe:\", kosong.GetTotal())\n}",
    "quiz": {
        "question": "Mengapa nomor field pada Protocol Buffers tidak boleh diubah atau digunakan ulang setelah dipakai?",
        "options": [
            "Karena protoc akan menolak mengkompilasi berkasnya",
            "Karena hanya nomor field yang dikirim di kabel, sehingga data lama akan terbaca sebagai field yang salah",
            "Karena nomor field menentukan urutan tampilan di dokumentasi",
            "Karena nomor field harus selalu berurutan tanpa celah"
            ],
        "correctIndex": 1,
        "explanation": "Protobuf mengkodekan pesan memakai nomor field, bukan namanya. Bila nomor 3 dulu berarti 'total' lalu digunakan ulang untuk 'diskon', data lama yang tersimpan atau pesan dari klien versi lama akan diurai sebagai field yang keliru. Nomor field yang sudah dipensiunkan harus ditandai dengan reserved."
    }
},
{
    "id": 253,
    "category": "Domain 24: gRPC & Protocol Buffers",
    "timestamp": "00:00:00",
    "title": "gRPC Streaming, Interceptor & Produksi",
    "desc": "Empat jenis RPC termasuk streaming dua arah, interceptor untuk lintas-perhatian, kode status yang benar, serta kesiapan produksi.",
    "theoryHtml": `
        <div class="theory-section">
            <h3>Empat Jenis RPC</h3>
            <div class="code-box">
                <pre>service Layanan {
  // 1. Unary -- satu permintaan, satu respons (paling umum)
  rpc Ambil(Req) returns (Resp);

  // 2. Server streaming -- satu permintaan, banyak respons
  rpc Daftar(Req) returns (stream Item);

  // 3. Client streaming -- banyak permintaan, satu respons
  rpc Unggah(stream Potongan) returns (Ringkasan);

  // 4. Bidirectional -- keduanya mengalir bebas
  rpc Obrolan(stream Pesan) returns (stream Pesan);
}</pre>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Server streaming — mengirim hasil sambil berjalan</span></div>
                <pre>func (s *server) DaftarPesanan(
    req *pb.DaftarPesananRequest,
    aliran pb.LayananPesanan_DaftarPesananServer,
) error {
    ctx := aliran.Context()

    baris, err := s.db.QueryContext(ctx, "SELECT ... WHERE pengguna_id = $1", req.PenggunaId)
    if err != nil {
        return status.Error(codes.Internal, "gagal membaca data")
    }
    defer baris.Close()

    for baris.Next() {
        // Hormati pembatalan dari klien
        if err := ctx.Err(); err != nil {
            return status.FromContextError(err).Err()
        }

        var p pb.Pesanan
        if err := baris.Scan(&p.Id, &p.Total); err != nil {
            return status.Error(codes.Internal, "gagal memindai baris")
        }
        if err := aliran.Send(&p); err != nil {
            return err     // klien memutus koneksi
        }
    }
    return baris.Err()
}</pre>
            </div>

            <div class="callout callout-tip">
                <div class="callout-title">📌 Kapan streaming benar-benar berguna</div>
                <p>Server streaming tepat untuk hasil berjumlah besar yang tidak layak dimuat seluruhnya ke memori, atau ketika klien ingin mulai memproses sebelum semua data selesai. Ia <strong>bukan</strong> pengganti paginasi biasa: koneksi streaming yang berumur panjang mempersulit load balancing dan membuat rilis bergulir menjadi rumit, karena koneksi lama tetap menempel di pod yang hendak dimatikan.</p>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Bidirectional — klien &amp; server bicara bersamaan</span></div>
                <pre>func (s *server) Obrolan(aliran pb.Layanan_ObrolanServer) error {
    for {
        masuk, err := aliran.Recv()
        if err == io.EOF {
            return nil          // klien selesai mengirim
        }
        if err != nil {
            return err
        }

        balasan := proses(masuk)
        if err := aliran.Send(balasan); err != nil {
            return err
        }
    }
}</pre>
            </div>

            <h3>Interceptor — Middleware untuk gRPC</h3>
            <div class="code-box">
                <div class="code-box-header"><span>Interceptor unary di sisi server</span></div>
                <pre>func InterceptorLog(
    ctx context.Context,
    req any,
    info *grpc.UnaryServerInfo,
    handler grpc.UnaryHandler,
) (any, error) {

    mulai := time.Now()
    resp, err := handler(ctx, req)
    durasi := time.Since(mulai)

    kode := status.Code(err)
    slog.InfoContext(ctx, "rpc selesai",
        "method", info.FullMethod,
        "kode", kode.String(),
        "durasi_ms", durasi.Milliseconds(),
    )
    return resp, err
}

func InterceptorAuth(
    ctx context.Context, req any,
    info *grpc.UnaryServerInfo, handler grpc.UnaryHandler,
) (any, error) {

    if daftarPublik[info.FullMethod] {
        return handler(ctx, req)
    }

    md, ok := metadata.FromIncomingContext(ctx)
    if !ok {
        return nil, status.Error(codes.Unauthenticated, "metadata tidak ada")
    }
    token := md.Get("authorization")
    if len(token) == 0 {
        return nil, status.Error(codes.Unauthenticated, "token tidak ada")
    }

    klaim, err := verifikasiToken(token[0])
    if err != nil {
        return nil, status.Error(codes.Unauthenticated, "token tidak sah")
    }

    ctx = context.WithValue(ctx, kunciPengguna{}, klaim)
    return handler(ctx, req)
}

func InterceptorPulihkanPanic(
    ctx context.Context, req any,
    info *grpc.UnaryServerInfo, handler grpc.UnaryHandler,
) (resp any, err error) {
    defer func() {
        if r := recover(); r != nil {
            slog.ErrorContext(ctx, "panic pada handler",
                "method", info.FullMethod, "panic", r,
                "stack", string(debug.Stack()))
            err = status.Error(codes.Internal, "terjadi kesalahan internal")
        }
    }()
    return handler(ctx, req)
}

// Merangkai semuanya
s := grpc.NewServer(
    grpc.ChainUnaryInterceptor(
        InterceptorPulihkanPanic,   // terluar -- menangkap panic dari yang lain
        InterceptorLog,
        InterceptorAuth,
    ),
)</pre>
            </div>

            <div class="callout callout-warning">
                <div class="callout-title">⚠️ Urutan interceptor itu penting</div>
                <p>Interceptor berjalan seperti lapisan bawang: yang pertama didaftarkan adalah lapisan terluar. Pemulih panic harus berada di paling luar agar dapat menangkap panic dari interceptor lain. Logger sebaiknya di luar autentikasi supaya permintaan yang ditolak pun tetap tercatat.</p>
            </div>

            <h3>Kode Status yang Tepat</h3>
            <table class="tech-table">
                <thead><tr><th>Kode</th><th>Kapan dipakai</th><th>Boleh diulang?</th></tr></thead>
                <tbody>
                    <tr><td><code>InvalidArgument</code></td><td>Masukan tidak sah</td><td>Tidak</td></tr>
                    <tr><td><code>NotFound</code></td><td>Sumber daya tidak ada</td><td>Tidak</td></tr>
                    <tr><td><code>AlreadyExists</code></td><td>Melanggar keunikan</td><td>Tidak</td></tr>
                    <tr><td><code>PermissionDenied</code></td><td>Terautentikasi tapi tidak berwenang</td><td>Tidak</td></tr>
                    <tr><td><code>Unauthenticated</code></td><td>Kredensial tidak ada atau salah</td><td>Tidak</td></tr>
                    <tr><td><code>FailedPrecondition</code></td><td>Keadaan sistem tidak memungkinkan</td><td>Tidak</td></tr>
                    <tr><td><code>ResourceExhausted</code></td><td>Kuota atau rate limit terlampaui</td><td>Ya, dengan backoff</td></tr>
                    <tr><td><code>Unavailable</code></td><td>Layanan sedang tidak siap</td><td><strong>Ya</strong></td></tr>
                    <tr><td><code>DeadlineExceeded</code></td><td>Melewati batas waktu</td><td>Ya, hati-hati</td></tr>
                    <tr><td><code>Internal</code></td><td>Bug di sisi server</td><td>Tidak</td></tr>
                </tbody>
            </table>

            <div class="callout callout-danger">
                <div class="callout-title">🚫 Jangan bocorkan detail internal ke pesan error</div>
                <p>Mengembalikan <code>status.Errorf(codes.Internal, "%v", err)</code> bisa membocorkan kueri SQL, jalur berkas, nama tabel, bahkan kredensial ke pihak pemanggil. Catat detail lengkapnya ke log di sisi server, lalu kembalikan pesan umum ke klien. Untuk kesalahan validasi yang memang perlu dirinci, gunakan <code>ErrorDetails</code> yang terstruktur, bukan menyalin pesan error mentah.</p>
            </div>

            <h3>Kesiapan Produksi</h3>
            <div class="code-box">
                <pre>s := grpc.NewServer(
    grpc.KeepaliveParams(keepalive.ServerParameters{
        MaxConnectionIdle:     15 * time.Minute,
        MaxConnectionAge:      30 * time.Minute,  // paksa seimbangkan ulang
        MaxConnectionAgeGrace: 5 * time.Second,
        Time:                  5 * time.Minute,
        Timeout:               20 * time.Second,
    }),
    grpc.MaxRecvMsgSize(4*1024*1024),
    grpc.Creds(credentials.NewTLS(konfigTLS)),
)

// Health checking -- dipakai Kubernetes lewat grpc_health_probe
healthpb.RegisterHealthServer(s, healthSrv)
healthSrv.SetServingStatus("", healthpb.HealthCheckResponse_SERVING)

// Matikan dengan anggun
go func() {
    &lt;-sinyalBerhenti
    healthSrv.SetServingStatus("", healthpb.HealthCheckResponse_NOT_SERVING)
    time.Sleep(5 * time.Second)   // beri waktu load balancer menyadari
    s.GracefulStop()
}()</pre>
            </div>

            <div class="callout callout-warning">
                <div class="callout-title">⚠️ Load balancing gRPC berbeda dari HTTP/1.1</div>
                <p>gRPC memakai koneksi HTTP/2 yang berumur panjang dan multiplexing. Load balancer L4 biasa hanya menyeimbangkan <em>koneksi</em>, bukan <em>permintaan</em> — akibatnya satu klien bisa mengirim ribuan permintaan ke satu pod saja sementara pod lain menganggur. Solusinya: pakai <code>MaxConnectionAge</code> untuk memaksa koneksi dibuat ulang secara berkala, gunakan penyeimbangan sisi klien lewat resolver DNS, atau pakai proxy yang mengerti gRPC seperti yang disediakan service mesh.</p>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Perkakas untuk debug</span></div>
                <pre># Menjelajah layanan (butuh reflection aktif)
grpcurl -plaintext localhost:50051 list
grpcurl -plaintext localhost:50051 describe pesanan.v1.LayananPesanan

# Memanggil method
grpcurl -plaintext -d '{"id":"p-1001"}' \\
  localhost:50051 pesanan.v1.LayananPesanan/AmbilPesanan

# Probe kesehatan untuk Kubernetes
grpc_health_probe -addr=localhost:50051</pre>
            </div>
        </div>
    `,
    "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\n// Simulasi rantai interceptor gRPC\ntype Handler func(req string) (string, error)\ntype Interceptor func(req string, info string, next Handler) (string, error)\n\nfunc Rantai(interceptors ...Interceptor) func(string, string, Handler) (string, error) {\n\treturn func(req, info string, akhir Handler) (string, error) {\n\t\tvar bungkus func(i int) Handler\n\t\tbungkus = func(i int) Handler {\n\t\t\tif i == len(interceptors) {\n\t\t\t\treturn akhir\n\t\t\t}\n\t\t\treturn func(r string) (string, error) {\n\t\t\t\treturn interceptors[i](r, info, bungkus(i+1))\n\t\t\t}\n\t\t}\n\t\treturn bungkus(0)(req)\n\t}\n}\n\nfunc main() {\n\tlog := func(req, info string, next Handler) (string, error) {\n\t\tmulai := time.Now()\n\t\tfmt.Println(\"[log]  masuk  ->\", info)\n\t\tresp, err := next(req)\n\t\tfmt.Printf(\"[log]  keluar <- %s (%v)\\n\", info, time.Since(mulai).Round(time.Microsecond))\n\t\treturn resp, err\n\t}\n\n\tauth := func(req, info string, next Handler) (string, error) {\n\t\tfmt.Println(\"[auth] memverifikasi token\")\n\t\tif req == \"tanpa-token\" {\n\t\t\treturn \"\", fmt.Errorf(\"Unauthenticated: token tidak ada\")\n\t\t}\n\t\treturn next(req)\n\t}\n\n\tinti := func(req string) (string, error) {\n\t\treturn \"pesanan untuk \" + req, nil\n\t}\n\n\tjalan := Rantai(log, auth)\n\n\tfmt.Println(\"=== Permintaan sah ===\")\n\tresp, _ := jalan(\"user-55\", \"/pesanan.v1/AmbilPesanan\", inti)\n\tfmt.Println(\"hasil:\", resp)\n\n\tfmt.Println(\"\\n=== Permintaan tanpa token ===\")\n\t_, err := jalan(\"tanpa-token\", \"/pesanan.v1/AmbilPesanan\", inti)\n\tfmt.Println(\"error:\", err)\n}",
    "quiz": {
        "question": "Mengapa load balancer L4 biasa tidak efektif untuk lalu lintas gRPC?",
        "options": [
            "Karena gRPC memakai protokol UDP yang tidak didukung",
            "Karena gRPC memakai koneksi HTTP/2 berumur panjang dengan multiplexing, sehingga L4 hanya menyeimbangkan koneksi dan bukan permintaan",
            "Karena gRPC mengenkripsi seluruh header sehingga tidak bisa dibaca",
            "Karena gRPC hanya mendukung satu server per klien"
        ],
        "correctIndex": 1,
        "explanation": "Satu koneksi HTTP/2 dapat membawa ribuan permintaan gRPC secara multiplexing. Load balancer L4 mendistribusikan koneksi, sehingga seluruh permintaan dari satu klien menumpuk di satu backend. Solusinya adalah membatasi umur koneksi, memakai penyeimbangan sisi klien, atau proxy yang memahami gRPC."
    }
},
{
    "id": 254,
    "category": "Domain 25: Observability Go",
    "timestamp": "00:00:00",
    "title": "OpenTelemetry di Go - Trace & Metrik",
    "desc": "Memasang instrumentasi trace dan metrik pada aplikasi Go dengan OpenTelemetry, menyebarkan konteks, dan menghubungkannya ke log slog.",
    "theoryHtml": `
        <div class="theory-section">
            <h3>Menyiapkan Penyedia Trace</h3>
            <div class="code-box">
                <pre>import (
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
    "go.opentelemetry.io/otel/propagation"
    sdktrace "go.opentelemetry.io/otel/sdk/trace"
    "go.opentelemetry.io/otel/sdk/resource"
    semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
)

func siapkanOTel(ctx context.Context) (func(context.Context) error, error) {
    eksportir, err := otlptracegrpc.New(ctx,
        otlptracegrpc.WithEndpoint("otel-collector:4317"),
        otlptracegrpc.WithInsecure(),
    )
    if err != nil {
        return nil, err
    }

    res, err := resource.New(ctx,
        resource.WithAttributes(
            semconv.ServiceName("layanan-pesanan"),
            semconv.ServiceVersion("2.4.0"),
            semconv.DeploymentEnvironment("produksi"),
        ),
    )
    if err != nil {
        return nil, err
    }

    tp := sdktrace.NewTracerProvider(
        sdktrace.WithBatcher(eksportir),
        sdktrace.WithResource(res),
        sdktrace.WithSampler(
            sdktrace.ParentBased(sdktrace.TraceIDRatioBased(0.05)),
        ),
    )
    otel.SetTracerProvider(tp)

    // WAJIB: tanpa ini, konteks trace tidak menyeberang antar layanan
    otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
        propagation.TraceContext{},
        propagation.Baggage{},
    ))

    return tp.Shutdown, nil
}</pre>
            </div>

            <div class="callout callout-warning">
                <div class="callout-title">⚠️ Dua kesalahan yang membuat trace tidak berguna</div>
                <p><strong>1. Lupa memasang propagator.</strong> Tanpa <code>SetTextMapPropagator</code>, header <code>traceparent</code> tidak akan pernah ditulis maupun dibaca. Tiap layanan akan memulai trace baru dan Anda kehilangan seluruh gambaran lintas layanan.</p>
                <p><strong>2. Lupa memanggil Shutdown.</strong> Span dikirim secara batch. Bila proses berhenti tanpa <code>tp.Shutdown(ctx)</code>, span terakhir — yang sering justru berisi error penyebab crash — tidak pernah terkirim.</p>
            </div>

            <div class="callout callout-tip">
                <div class="callout-title">📌 Kenapa ParentBased sampler</div>
                <p><code>ParentBased</code> menghormati keputusan sampling dari layanan hulu. Tanpanya, layanan A bisa memutuskan merekam sementara layanan B memutuskan membuang, dan Anda mendapat trace yang bolong-bolong. Keputusan sampling harus diambil <strong>sekali</strong> di tepi sistem lalu dipatuhi seluruh layanan.</p>
            </div>

            <h3>Instrumentasi Otomatis</h3>
            <div class="code-box">
                <pre>import (
    "go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
    "go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
)

// Server HTTP
mux := http.NewServeMux()
mux.HandleFunc("/pesanan", tanganiPesanan)
http.ListenAndServe(":8080", otelhttp.NewHandler(mux, "server-http"))

// Klien HTTP -- span otomatis dibuat & header disisipkan
klien := &http.Client{Transport: otelhttp.NewTransport(http.DefaultTransport)}

// Server & klien gRPC
s := grpc.NewServer(grpc.StatsHandler(otelgrpc.NewServerHandler()))
conn, _ := grpc.NewClient(alamat, grpc.WithStatsHandler(otelgrpc.NewClientHandler()))

// Database
db, _ := otelsql.Open("postgres", dsn,
    otelsql.WithAttributes(semconv.DBSystemPostgreSQL))</pre>
            </div>

            <h3>Span Manual untuk Logika Bisnis</h3>
            <div class="code-box">
                <pre>var tracer = otel.Tracer("github.com/org/proyek/layanan/pesanan")

func (s *Layanan) BuatPesanan(ctx context.Context, req Request) (*Pesanan, error) {
    ctx, span := tracer.Start(ctx, "Layanan.BuatPesanan",
        trace.WithAttributes(
            attribute.Int64("pengguna.id", req.PenggunaID),
            attribute.Int("pesanan.jumlah_item", len(req.Item)),
        ),
    )
    defer span.End()

    if err := s.periksaStok(ctx, req.Item); err != nil {
        span.RecordError(err)
        span.SetStatus(codes.Error, "stok tidak mencukupi")
        return nil, err
    }

    span.AddEvent("stok terverifikasi")

    p, err := s.repo.Simpan(ctx, req)   // ctx membawa span induk
    if err != nil {
        span.RecordError(err)
        span.SetStatus(codes.Error, "gagal menyimpan")
        return nil, err
    }

    span.SetAttributes(attribute.String("pesanan.id", p.ID))
    return p, nil
}</pre>
            </div>

            <div class="callout callout-danger">
                <div class="callout-title">🚫 Jangan letakkan data pribadi di atribut span</div>
                <p>Email, nomor telepon, nomor kartu, alamat, dan token tidak boleh masuk ke atribut span — data itu akan tersimpan di backend tracing dan bisa dibaca siapa pun yang punya akses dasbor. Simpan pengenal yang tidak bermakna sendiri seperti ID pengguna, dan lakukan penyaringan tambahan di OpenTelemetry Collector sebagai jaring pengaman.</p>
            </div>

            <h3>Metrik</h3>
            <div class="code-box">
                <pre>var meter = otel.Meter("github.com/org/proyek/layanan/pesanan")

var (
    pesananDibuat metric.Int64Counter
    durasiProses  metric.Float64Histogram
    pesananAktif  metric.Int64UpDownCounter
)

func init() {
    pesananDibuat, _ = meter.Int64Counter("pesanan.dibuat",
        metric.WithDescription("jumlah pesanan yang berhasil dibuat"),
        metric.WithUnit("{pesanan}"))

    durasiProses, _ = meter.Float64Histogram("pesanan.durasi_proses",
        metric.WithDescription("lama pemrosesan pesanan"),
        metric.WithUnit("s"))

    pesananAktif, _ = meter.Int64UpDownCounter("pesanan.aktif")
}

func (s *Layanan) BuatPesanan(ctx context.Context, req Request) (*Pesanan, error) {
    mulai := time.Now()
    pesananAktif.Add(ctx, 1)
    defer pesananAktif.Add(ctx, -1)

    p, err := s.buat(ctx, req)

    // Label harus BERKARDINALITAS RENDAH
    atribut := metric.WithAttributes(
        attribute.String("status", statusDari(err)),
        attribute.String("saluran", req.Saluran),
    )
    pesananDibuat.Add(ctx, 1, atribut)
    durasiProses.Record(ctx, time.Since(mulai).Seconds(), atribut)

    return p, err
}</pre>
            </div>

            <div class="callout callout-danger">
                <div class="callout-title">🚫 Kardinalitas metrik yang meledak</div>
                <p>Jangan pernah menjadikan ID pesanan, ID pengguna, atau URL lengkap sebagai atribut metrik. Setiap kombinasi nilai unik membuat satu time series baru; sejuta ID pesanan berarti sejuta time series yang akan menghabiskan memori Prometheus. Atribut metrik harus berupa nilai berhingga yang sedikit: status, metode, saluran, wilayah. Informasi per-permintaan tempatnya di <strong>trace dan log</strong>.</p>
            </div>

            <h3>Menghubungkan Log dengan Trace</h3>
            <div class="code-box">
                <pre>// Handler slog yang otomatis menyisipkan trace_id & span_id
type HandlerOTel struct{ slog.Handler }

func (h HandlerOTel) Handle(ctx context.Context, r slog.Record) error {
    if sc := trace.SpanContextFromContext(ctx); sc.IsValid() {
        r.AddAttrs(
            slog.String("trace_id", sc.TraceID().String()),
            slog.String("span_id", sc.SpanID().String()),
        )
    }
    return h.Handler.Handle(ctx, r)
}

func main() {
    dasar := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo})
    slog.SetDefault(slog.New(HandlerOTel{dasar}))
}

// Selalu pakai varian ...Context agar trace ikut tercatat
slog.InfoContext(ctx, "pesanan dibuat", "pesanan_id", p.ID)</pre>
            </div>

            <div class="callout callout-info">
                <div class="callout-title">💡 Inilah yang mengubah investigasi insiden</div>
                <p>Dengan <code>trace_id</code> di setiap baris log, alurnya menjadi: metrik menunjukkan tingkat error naik → buka satu trace yang gagal → lompat ke seluruh log dari permintaan itu di <em>semua</em> layanan sekaligus. Yang tadinya butuh berjam-jam menggabungkan log manual dari belasan layanan menjadi hitungan menit.</p>
            </div>

            <div class="callout callout-warning">
                <div class="callout-title">⚠️ Selalu teruskan context</div>
                <p>Fungsi yang menerima <code>ctx</code> tetapi tidak meneruskannya ke pemanggilan berikutnya akan memutus rantai trace di titik itu. Aturan praktis di Go: <code>context.Context</code> selalu menjadi parameter <strong>pertama</strong>, dan diteruskan ke setiap pemanggilan yang mungkin memblokir atau melakukan I/O. Jangan pernah menyimpan context di dalam struct.</p>
            </div>
        </div>
    `,
    "initialCode": "package main\n\nimport (\n\t\"context\"\n\t\"fmt\"\n\t\"time\"\n)\n\n// Simulasi span & konteks trace\ntype kunciSpan struct{}\n\ntype Span struct {\n\tNama    string\n\tTraceID string\n\tSpanID  string\n\tInduk   string\n\tMulai   time.Time\n\tAtribut map[string]any\n}\n\nvar terkumpul []*Span\nvar penghitung int\n\nfunc Mulai(ctx context.Context, nama string) (context.Context, *Span) {\n\tpenghitung++\n\ts := &Span{Nama: nama, TraceID: \"4bf92f35\", SpanID: fmt.Sprintf(\"span-%02d\", penghitung), Mulai: time.Now(), Atribut: map[string]any{}}\n\tif induk, ok := ctx.Value(kunciSpan{}).(*Span); ok {\n\t\ts.Induk = induk.SpanID\n\t}\n\tterkumpul = append(terkumpul, s)\n\treturn context.WithValue(ctx, kunciSpan{}, s), s\n}\n\nfunc main() {\n\tctx := context.Background()\n\n\tctx, akar := Mulai(ctx, \"POST /pesanan\")\n\takar.Atribut[\"pengguna.id\"] = 55\n\n\tfunc(ctx context.Context) {\n\t\tctx, s := Mulai(ctx, \"periksaStok\")\n\t\ts.Atribut[\"item.jumlah\"] = 2\n\t\tfunc(ctx context.Context) {\n\t\t\t_, db := Mulai(ctx, \"SELECT stok\")\n\t\t\tdb.Atribut[\"db.system\"] = \"postgresql\"\n\t\t}(ctx)\n\t}(ctx)\n\n\tfunc(ctx context.Context) {\n\t\t_, s := Mulai(ctx, \"simpanPesanan\")\n\t\ts.Atribut[\"db.operation\"] = \"INSERT\"\n\t}(ctx)\n\n\tfmt.Println(\"Trace ID:\", akar.TraceID)\n\tfor _, s := range terkumpul {\n\t\tindent := \"\"\n\t\tif s.Induk != \"\" {\n\t\t\tindent = \"  └─ \"\n\t\t}\n\t\tfmt.Printf(\"%s%-16s [%s] induk=%-8s %v\\n\", indent, s.Nama, s.SpanID, s.Induk, s.Atribut)\n\t}\n}",
    "quiz": {
        "question": "Apa akibatnya bila otel.SetTextMapPropagator tidak dipasang pada aplikasi Go yang memakai OpenTelemetry?",
        "options": [
            "Span tidak akan pernah dibuat sama sekali",
            "Header traceparent tidak ditulis maupun dibaca, sehingga setiap layanan memulai trace baru dan gambaran lintas layanan hilang",
            "Metrik tidak akan terkirim ke Collector",
            "Aplikasi akan gagal dijalankan"
        ],
        "correctIndex": 1,
        "explanation": "Propagator bertugas menuliskan konteks trace ke header saat mengirim permintaan dan membacanya kembali saat menerima. Tanpa propagator, span tetap dibuat secara lokal tetapi tidak pernah tersambung antar layanan, sehingga tiap layanan tampak memiliki trace-nya sendiri yang terputus."
    }
},
{
    "id": 255,
    "category": "Domain 25: Observability Go",
    "timestamp": "00:00:00",
    "title": "Structured Logging Produksi dengan slog",
    "desc": "Merancang log yang bisa dikueri: handler kustom, atribut kontekstual, penyaringan data sensitif, dan pemilihan level yang tepat.",
    "theoryHtml": `
        <div class="theory-section">
            <h3>Kenapa Log Terstruktur</h3>
            <div class="code-box">
                <pre>// Log kalimat bebas -- tidak bisa dikueri
log.Printf("pesanan %s gagal untuk user %d: %v", id, uid, err)
// "pesanan p-1001 gagal untuk user 55: koneksi ditolak"
// Untuk mencari semua kegagalan user 55, Anda terpaksa memakai regex.

// Log terstruktur -- bisa dikueri seperti basis data
slog.ErrorContext(ctx, "pesanan gagal",
    "pesanan_id", id,
    "pengguna_id", uid,
    "error", err)
// {"level":"ERROR","msg":"pesanan gagal","pesanan_id":"p-1001",
//  "pengguna_id":55,"error":"koneksi ditolak"}
// Kueri: {pengguna_id=55, level="ERROR"}</pre>
            </div>

            <h3>Menyiapkan Logger</h3>
            <div class="code-box">
                <pre>func siapkanLogger(lingkungan string) *slog.Logger {
    opsi := &slog.HandlerOptions{
        Level:     tingkatDariEnv(),
        AddSource: lingkungan != "produksi",   // nomor baris mahal
        ReplaceAttr: gantiAtribut,
    }

    var h slog.Handler
    if lingkungan == "produksi" {
        h = slog.NewJSONHandler(os.Stdout, opsi)   // mesin yang membaca
    } else {
        h = slog.NewTextHandler(os.Stdout, opsi)   // manusia yang membaca
    }

    return slog.New(h).With(
        "layanan", "layanan-pesanan",
        "versi", versiBuild,
    )
}

// Ubah level saat runtime tanpa restart
var tingkat = new(slog.LevelVar)

func UbahTingkat(t slog.Level) { tingkat.Set(t) }</pre>
            </div>

            <div class="callout callout-tip">
                <div class="callout-title">📌 Level yang bisa diubah saat runtime sangat berharga</div>
                <p>Saat terjadi insiden, Anda ingin menaikkan verbositas ke DEBUG untuk melihat detail — tetapi me-restart layanan justru menghilangkan keadaan yang sedang Anda selidiki. Dengan <code>slog.LevelVar</code> yang diekspos lewat endpoint admin, Anda bisa mengubahnya seketika lalu menurunkannya kembali setelah selesai.</p>
            </div>

            <h3>Menyaring Data Sensitif</h3>
            <div class="code-box">
                <pre>var fieldSensitif = map[string]bool{
    "password": true, "kata_sandi": true, "token": true,
    "authorization": true, "kartu_kredit": true, "cvv": true,
    "api_key": true, "secret": true, "nik": true,
}

func gantiAtribut(gugus []string, a slog.Attr) slog.Attr {
    if fieldSensitif[strings.ToLower(a.Key)] {
        return slog.String(a.Key, "[DISUNTING]")
    }
    // Persingkat jalur berkas agar log tidak membengkak
    if a.Key == slog.SourceKey {
        if src, ok := a.Value.Any().(*slog.Source); ok {
            src.File = filepath.Base(src.File)
        }
    }
    return a
}</pre>
            </div>

            <div class="code-box">
                <div class="code-box-header"><span>Kontrol lebih baik: implementasikan LogValuer</span></div>
                <pre>type Pengguna struct {
    ID       int64
    Email    string
    Password string
}

// Menentukan sendiri bagaimana tipe ini muncul di log
func (p Pengguna) LogValue() slog.Value {
    return slog.GroupValue(
        slog.Int64("id", p.ID),
        slog.String("email", samarkanEmail(p.Email)),
        // Password sengaja TIDAK disertakan sama sekali
    )
}

func samarkanEmail(e string) string {
    bagian := strings.SplitN(e, "@", 2)
    if len(bagian) != 2 || len(bagian[0]) &lt; 2 {
        return "***"
    }
    return bagian[0][:2] + "***@" + bagian[1]
}

// Sekarang aman dipakai di mana pun:
slog.Info("pengguna masuk", "pengguna", p)
// {"pengguna":{"id":55,"email":"bu***@contoh.com"}}</pre>
            </div>

            <div class="callout callout-info">
                <div class="callout-title">💡 LogValuer lebih andal daripada ReplaceAttr</div>
                <p><code>ReplaceAttr</code> hanya menangkap field yang namanya sudah Anda daftarkan. <code>LogValuer</code> menempel pada <em>tipenya</em>, sehingga struct itu selalu tersamarkan dengan benar di mana pun ia dicatat — bahkan ketika programmer lain memakainya tanpa mengetahui aturan penyamarannya.</p>
            </div>

            <h3>Membawa Konteks Sepanjang Permintaan</h3>
            <div class="code-box">
                <pre>type kunciLogger struct{}

func DariKonteks(ctx context.Context) *slog.Logger {
    if l, ok := ctx.Value(kunciLogger{}).(*slog.Logger); ok {
        return l
    }
    return slog.Default()
}

func MiddlewareLog(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        idPermintaan := r.Header.Get("X-Request-Id")
        if idPermintaan == "" {
            idPermintaan = uuid.NewString()
        }

        l := slog.With(
            "request_id", idPermintaan,
            "method", r.Method,
            "path", r.URL.Path,
        )
        ctx := context.WithValue(r.Context(), kunciLogger{}, l)

        mulai := time.Now()
        rw := &penulisTerbungkus{ResponseWriter: w, kode: 200}
        next.ServeHTTP(rw, r.WithContext(ctx))

        l.InfoContext(ctx, "permintaan selesai",
            "status", rw.kode,
            "durasi_ms", time.Since(mulai).Milliseconds())
    })
}

// Di lapisan mana pun, konteksnya ikut terbawa:
func (s *Layanan) Proses(ctx context.Context) {
    l := DariKonteks(ctx)
    l.InfoContext(ctx, "memulai pemrosesan")   // request_id ikut tercatat
}</pre>
            </div>

            <h3>Memilih Level dengan Benar</h3>
            <table class="tech-table">
                <thead><tr><th>Level</th><th>Dipakai untuk</th><th>Perlu tindakan?</th></tr></thead>
                <tbody>
                    <tr><td><code>DEBUG</code></td><td>Detail untuk penelusuran; mati di produksi</td><td>Tidak</td></tr>
                    <tr><td><code>INFO</code></td><td>Peristiwa bisnis penting: pesanan dibuat, pembayaran lunas</td><td>Tidak</td></tr>
                    <tr><td><code>WARN</code></td><td>Hal ganjil yang berhasil ditangani: retry berhasil, memakai nilai bawaan</td><td>Perlu diperhatikan</td></tr>
                    <tr><td><code>ERROR</code></td><td>Operasi gagal dan pengguna terdampak</td><td><strong>Ya</strong></td></tr>
                </tbody>
            </table>

            <div class="callout callout-danger">
                <div class="callout-title">🚫 Level ERROR yang terlalu berisik menghancurkan kegunaannya</div>
                <p>Mencatat ERROR untuk hal yang sebenarnya berhasil ditangani — retry yang akhirnya sukses, validasi masukan pengguna yang ditolak — membuat dasbor error dipenuhi derau. Tim lalu terbiasa mengabaikannya, dan error yang benar-benar penting ikut terlewat. <strong>ERROR berarti seseorang perlu bertindak.</strong> Kegagalan validasi masukan adalah kejadian normal: catat sebagai INFO atau WARN.</p>
            </div>

            <h3>Kesalahan Umum</h3>
            <div class="code-box">
                <pre>// ❌ Mencatat error DAN mengembalikannya -- tercatat berkali-kali
if err != nil {
    slog.Error("gagal menyimpan", "error", err)
    return err       // pemanggil mencatat lagi, dan pemanggilnya lagi...
}

// ✅ Bungkus dengan konteks, catat SEKALI di lapisan paling atas
if err != nil {
    return fmt.Errorf("menyimpan pesanan %s: %w", id, err)
}

// ❌ Mencatat di dalam perulangan panas
for _, item := range sejutaItem {
    slog.Debug("memproses", "item", item)   // membanjiri sistem log
}

// ✅ Catat ringkasannya
slog.Info("pemrosesan selesai", "jumlah", len(sejutaItem),
    "durasi_ms", time.Since(mulai).Milliseconds())

// ❌ String yang dirangkai -- kembali ke masalah semula
slog.Info("pesanan " + id + " selesai")

// ✅ Atribut terpisah yang bisa dikueri
slog.Info("pesanan selesai", "pesanan_id", id)</pre>
            </div>

            <div class="callout callout-warning">
                <div class="callout-title">⚠️ Tulis ke stdout, jangan ke berkas</div>
                <p>Di lingkungan berkontainer, aplikasi seharusnya menulis log ke <strong>stdout/stderr</strong> saja dan menyerahkan pengumpulan serta rotasinya kepada platform. Menulis langsung ke berkas di dalam kontainer menciptakan masalah baru: berkas hilang saat pod dihapus, disk bisa penuh, dan rotasi log menjadi tanggung jawab aplikasi yang seharusnya tidak ia urus.</p>
            </div>
        </div>
    `,
    "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"os\"\n\t\"strings\"\n\t\"time\"\n)\n\ntype Pengguna struct {\n\tID       int64\n\tEmail    string\n\tPassword string\n}\n\nfunc samarkanEmail(e string) string {\n\tbagian := strings.SplitN(e, \"@\", 2)\n\tif len(bagian) != 2 || len(bagian[0]) < 2 {\n\t\treturn \"***\"\n\t}\n\treturn bagian[0][:2] + \"***@\" + bagian[1]\n}\n\n// Meniru slog.LogValuer\nfunc (p Pengguna) NilaiLog() map[string]any {\n\treturn map[string]any{\n\t\t\"id\":    p.ID,\n\t\t\"email\": samarkanEmail(p.Email),\n\t\t// Password sengaja tidak disertakan\n\t}\n}\n\nfunc catat(level, pesan string, kv ...any) {\n\trec := map[string]any{\n\t\t\"waktu\": time.Now().UTC().Format(time.RFC3339),\n\t\t\"level\": level,\n\t\t\"msg\":   pesan,\n\t}\n\tsensitif := map[string]bool{\"password\": true, \"token\": true, \"cvv\": true}\n\tfor i := 0; i+1 < len(kv); i += 2 {\n\t\tk := fmt.Sprint(kv[i])\n\t\tv := kv[i+1]\n\t\tif sensitif[strings.ToLower(k)] {\n\t\t\tv = \"[DISUNTING]\"\n\t\t}\n\t\tif p, ok := v.(Pengguna); ok {\n\t\t\tv = p.NilaiLog()\n\t\t}\n\t\trec[k] = v\n\t}\n\tenc := json.NewEncoder(os.Stdout)\n\tenc.Encode(rec)\n}\n\nfunc main() {\n\tp := Pengguna{ID: 55, Email: \"budi.santoso@contoh.com\", Password: \"rahasia123\"}\n\n\tcatat(\"INFO\", \"pengguna masuk\", \"pengguna\", p, \"request_id\", \"req-abc123\")\n\tcatat(\"INFO\", \"pesanan dibuat\", \"pesanan_id\", \"p-1001\", \"total\", 250000)\n\tcatat(\"ERROR\", \"pembayaran gagal\", \"pesanan_id\", \"p-1001\", \"token\", \"tok_live_xyz\", \"error\", \"kartu ditolak\")\n}",
    "quiz": {
        "question": "Mengapa mengimplementasikan slog.LogValuer pada sebuah tipe lebih andal daripada mengandalkan ReplaceAttr untuk menyamarkan data sensitif?",
        "options": [
            "Karena LogValuer berjalan lebih cepat",
            "Karena LogValuer menempel pada tipenya sehingga penyamaran selalu berlaku di mana pun ia dicatat, sedangkan ReplaceAttr hanya menangkap nama field yang sudah didaftarkan",
            "Karena ReplaceAttr tidak mendukung format JSON",
            "Karena LogValuer otomatis mengenkripsi seluruh isi log"
        ],
        "correctIndex": 1,
        "explanation": "ReplaceAttr bekerja berdasarkan daftar nama kunci; field dengan nama tak terduga akan lolos. LogValuer mendefinisikan representasi log pada tipenya sendiri, sehingga struct tersebut selalu tersamarkan dengan benar bahkan ketika dipakai programmer lain yang tidak tahu aturan penyamarannya."
    }
},
{
    "id": 256,
    "category": "Domain 26: Deployment & Production Go",
    "timestamp": "",
    "isDeploy": true,
    "title": "Instalasi Go di Windows (PC Baru)",
    "desc": "Panduan lengkap instalasi Go di Windows dari nol: download, setup PATH, verifikasi, dan konfigurasi editor VS Code.",
    "theoryHtml": "<div class=\"theory-section\">\n            <h3>Instalasi Go di Windows — Langkah Demi Langkah</h3>\n            <p>Berikut panduan lengkap untuk menjalankan Go di PC Windows yang masih bersih (fresh install), tanpa asumsi apapun.</p>\n\n            <div class=\"step-block\">\n                <div class=\"step-num\">1</div>\n                <div class=\"step-content\">\n                    <h4>Download Installer Resmi Go</h4>\n                    <p>Kunjungi <strong>https://go.dev/dl/</strong> dan download file <code>.msi</code> terbaru untuk Windows (misal: <code>go1.26.0.windows-amd64.msi</code>).</p>\n                    <div class=\"callout callout-tip\"><div class=\"callout-title\">💡 Tips</div><p>Pilih versi <strong>amd64</strong> untuk PC 64-bit (hampir semua PC modern). Jika PC Anda 32-bit, pilih versi <strong>386</strong>.</p></div>\n                </div>\n            </div>\n\n            <div class=\"step-block\">\n                <div class=\"step-num\">2</div>\n                <div class=\"step-content\">\n                    <h4>Jalankan Installer MSI</h4>\n                    <p>Klik dua kali file <code>.msi</code> yang sudah didownload. Ikuti wizard instalasi (Next → Next → Install). Secara default Go akan diinstall ke <code>C:\\Program Files\\Go</code>.</p>\n                </div>\n            </div>\n\n            <div class=\"step-block\">\n                <div class=\"step-num\">3</div>\n                <div class=\"step-content\">\n                    <h4>Verifikasi Instalasi</h4>\n                    <p>Buka <strong>Command Prompt</strong> atau <strong>PowerShell</strong> baru (penting: buka yang baru agar PATH ter-refresh), lalu jalankan:</p>\n                    <div class=\"code-box\">\n                        <div class=\"code-box-header\"><span>Command Prompt / PowerShell</span></div>\n                        <pre>go version\n# Output: go version go1.26.0 windows/amd64\n\ngo env GOPATH\n# Output: C:\\Users\\NamaUser\\go\n\ngo env GOROOT\n# Output: C:\\Program Files\\Go</pre>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"step-block\">\n                <div class=\"step-num\">4</div>\n                <div class=\"step-content\">\n                    <h4>Buat Project Pertama</h4>\n                    <div class=\"code-box\">\n                        <div class=\"code-box-header\"><span>Command Prompt</span></div>\n                        <pre>mkdir C:\\Projects\\hello-go\ncd C:\\Projects\\hello-go\ngo mod init hello-go\n\necho package main > main.go\necho. >> main.go\necho import \"fmt\" >> main.go\necho. >> main.go\necho func main() { >> main.go\necho     fmt.Println(\"Hello, Go Windows!\") >> main.go\necho } >> main.go\n\ngo run main.go\n# Output: Hello, Go Windows!</pre>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"step-block\">\n                <div class=\"step-num\">5</div>\n                <div class=\"step-content\">\n                    <h4>Setup VS Code untuk Go</h4>\n                    <p>Install <strong>VS Code</strong> dari <code>https://code.visualstudio.com</code>, lalu install extension <strong>Go</strong> by Google dari Marketplace. Buka folder project, tekan <code>F5</code> untuk run & debug otomatis.</p>\n                </div>\n            </div>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">ℹ️ Lokasi File Go Penting</div>\n                <ul>\n                    <li><code>GOROOT</code> = <code>C:\\Program Files\\Go</code> — Lokasi toolchain/SDK Go</li>\n                    <li><code>GOPATH</code> = <code>C:\\Users\\[User]\\go</code> — Workspace Go (bin, pkg, src)</li>\n                    <li><code>GOPATH\\bin</code> — Folder binary tools Go (gofmt, gopls, dll) — tambahkan ke PATH!</li>\n                </ul>\n            </div>\n        </div>",
    "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"runtime\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== Info Environment Go ===\")\n\tfmt.Println(\"Versi Go:\", runtime.Version())\n\tfmt.Println(\"Sistem Operasi:\", runtime.GOOS)\n\tfmt.Println(\"Arsitektur CPU:\", runtime.GOARCH)\n\tfmt.Println(\"Jumlah CPU Core:\", runtime.NumCPU())\n\tfmt.Println()\n\tfmt.Println(\"Go berhasil berjalan di sistem Anda!\")\n}",
    "quiz": {
"question": "Setelah menginstall Go di Windows menggunakan file .msi, perintah apa yang digunakan untuk memverifikasi instalasi berhasil?",
"options": ["golang --version", "go version", "go check install", "go.exe --verify"],
"correctIndex": 1,
"explanation": "'go version' adalah perintah standar untuk memverifikasi instalasi Go dan melihat versi yang aktif."
},
    "hardQuiz": {
"questions": [{
"question": "Apa perbedaan antara GOROOT dan GOPATH di Go?",
"options": ["GOROOT adalah folder project, GOPATH adalah folder SDK", "GOROOT adalah lokasi SDK/toolchain Go yang diinstall, GOPATH adalah workspace user (project & binary tools)", "Keduanya sama saja, hanya nama berbeda", "GOPATH hanya digunakan di Go versi lama (sebelum Modules)"],
"correctIndex": 1,
"explanation": "GOROOT = lokasi instalasi Go runtime/compiler (system). GOPATH = workspace pribadi user untuk binary tools dan modul lama."
}, {
"question": "Setelah instalasi Go, mengapa wajib membuka terminal/Command Prompt BARU?",
"options": ["Agar antivirus tidak memblokir", "Karena terminal lama belum membaca PATH terbaru yang ditambahkan installer Go", "Karena go.exe hanya berjalan di terminal baru", "Tidak perlu membuka terminal baru"],
"correctIndex": 1,
"explanation": "Environment variables (PATH) di-load saat terminal dibuka. Terminal lama tidak otomatis mendapatkan perubahan PATH yang dilakukan installer."
}, {
"question": "Perintah apa yang menginisialisasi Go Module di folder project baru?",
"options": ["go init", "go mod init nama-modul", "go new module nama-modul", "go create mod"],
"correctIndex": 1,
"explanation": "'go mod init nama-modul' membuat file go.mod yang mendefinisikan modul, versi Go minimum, dan dependency."
}, {
"question": "File apa yang OTOMATIS dibuat saat pertama kali menjalankan 'go mod init'?",
"options": ["go.sum dan go.lock", "go.mod", "package.json", "Makefile"],
"correctIndex": 1,
"explanation": "'go mod init' hanya membuat go.mod. File go.sum dibuat nanti secara otomatis saat dependency pertama kali di-download."
}, {
"question": "Perintah apa yang menjalankan file Go tanpa perlu build binary terlebih dahulu?",
"options": ["go execute main.go", "go run main.go", "go start main.go", "golang run main.go"],
"correctIndex": 1,
"explanation": "'go run' mengkompilasi dan langsung menjalankan file Go dalam satu perintah, ideal untuk development dan testing cepat."
}]
}
},
{
    "id": 257,
    "category": "Domain 26: Deployment & Production Go",
    "timestamp": "",
    "isDeploy": true,
    "title": "Instalasi Go di Linux / Ubuntu",
    "desc": "Instalasi Go di Ubuntu/Debian dari awal — via apt, manual tarball, dan update-alternatives untuk multi-versi.",
    "theoryHtml": "<div class=\"theory-section\">\n            <h3>Instalasi Go di Linux Ubuntu / Debian</h3>\n            <p>Ada dua cara instalasi Go di Linux: via <strong>apt</strong> (mudah tapi versi bisa ketinggalan) atau <strong>manual tarball</strong> (recommended, selalu versi terbaru).</p>\n\n            <h3>Metode 1: Manual Tarball (RECOMMENDED)</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Bash — Ubuntu/Debian</span></div>\n                <pre># 1. Hapus Go lama jika ada\nsudo rm -rf /usr/local/go\n\n# 2. Download Go terbaru (cek versi di https://go.dev/dl/)\nwget https://go.dev/dl/go1.26.0.linux-amd64.tar.gz\n\n# 3. Ekstrak ke /usr/local\nsudo tar -C /usr/local -xzf go1.26.0.linux-amd64.tar.gz\n\n# 4. Tambahkan Go ke PATH — edit ~/.bashrc atau ~/.zshrc\necho 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc\necho 'export GOPATH=$HOME/go' >> ~/.bashrc\necho 'export PATH=$PATH:$GOPATH/bin' >> ~/.bashrc\n\n# 5. Reload konfigurasi shell\nsource ~/.bashrc\n\n# 6. Verifikasi\ngo version\n# go version go1.26.0 linux/amd64</pre>\n            </div>\n\n            <h3>Metode 2: Via apt (Ubuntu 22.04+)</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Bash</span></div>\n                <pre>sudo apt update\nsudo apt install golang-go -y\ngo version\n# Catatan: versi mungkin lebih lama dari upstream</pre>\n            </div>\n\n            <div class=\"callout callout-warning\">\n                <div class=\"callout-title\">⚠️ Catatan Versi</div>\n                <p>Package <code>golang-go</code> di repository apt Ubuntu seringkali tertinggal beberapa versi dari upstream resmi Go. Untuk production, gunakan metode tarball agar mendapat versi terbaru.</p>\n            </div>\n\n            <h3>Membuat Project Pertama di Linux</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Bash</span></div>\n                <pre>mkdir ~/projects/hello-go && cd ~/projects/hello-go\ngo mod init hello-go\n\ncat > main.go << 'EOF'\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello dari Go di Linux!\")\n}\nEOF\n\ngo run main.go\n# Output: Hello dari Go di Linux!</pre>\n            </div>\n\n            <h3>Build Binary untuk Production</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Bash</span></div>\n                <pre># Build binary executable\ngo build -o hello-app main.go\n\n# Jalankan binary\n./hello-app\n\n# Build untuk platform lain (cross-compile)\nGOOS=windows GOARCH=amd64 go build -o hello-app.exe main.go\nGOOS=darwin GOARCH=amd64 go build -o hello-app-mac main.go</pre>\n            </div>\n        </div>",
    "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"runtime\"\n\t\"os\"\n)\n\nfunc main() {\n\tfmt.Println(\"=== System Info dari Go ===\")\n\tfmt.Println(\"OS:\", runtime.GOOS)\n\tfmt.Println(\"ARCH:\", runtime.GOARCH)\n\tfmt.Println(\"Go Version:\", runtime.Version())\n\tfmt.Println(\"CPU Count:\", runtime.NumCPU())\n\tfmt.Println(\"Hostname:\", getHostname())\n}\n\nfunc getHostname() string {\n\thostname, err := os.Hostname()\n\tif err != nil {\n\t\treturn \"unknown\"\n\t}\n\treturn hostname\n}",
    "quiz": {
"question": "Mengapa metode instalasi Go via tarball manual lebih direkomendasikan dibanding 'apt install golang-go'?",
"options": ["Karena apt tidak mendukung Go sama sekali", "Karena tarball memastikan versi Go yang paling terbaru dari upstream resmi", "Karena tarball lebih aman dari sisi keamanan", "Karena apt tidak bisa digunakan di Ubuntu"],
"correctIndex": 1,
"explanation": "Repository apt Ubuntu seringkali memiliki versi Go yang lebih lama. Tarball dari go.dev/dl selalu menyediakan versi stable terbaru."
},
    "hardQuiz": {
"questions": [{
"question": "Setelah menambahkan Go ke PATH di ~/.bashrc, perintah apa yang harus dijalankan agar perubahan langsung aktif di terminal saat ini?",
"options": ["restart terminal", "source ~/.bashrc", "reload .bashrc", "bash --refresh"],
"correctIndex": 1,
"explanation": "'source ~/.bashrc' (atau '. ~/.bashrc') me-reload konfigurasi shell tanpa perlu menutup dan membuka terminal baru."
}, {
"question": "Apa arti dari environment variable GOOS saat cross-compiling?",
"options": ["Versi Go yang digunakan", "Target operating system untuk binary yang akan dihasilkan", "Lokasi GOPATH", "Mode debug compiler"],
"correctIndex": 1,
"explanation": "GOOS menentukan target OS untuk binary yang dikompilasi. Contoh: GOOS=windows untuk binary Windows, GOOS=linux untuk Linux."
}, {
"question": "Perintah go build tanpa flag output (-o) menghasilkan file apa?",
"options": ["main.bin", "Binary dengan nama sesuai nama direktori modul (atau nama package)", "main.out", "app.go"],
"correctIndex": 1,
"explanation": "Tanpa -o, go build menghasilkan binary dengan nama direktori modul saat ini (misal: nama folder project)."
}, {
"question": "Apa kegunaan flag '-ldflags=\"-s -w\"' saat go build?",
"options": ["Mengaktifkan mode silent dan warnings", "Menghapus debug symbols dan DWARF info untuk mengecilkan ukuran binary", "Menambahkan static linking", "Mengaktifkan optimasi level tinggi"],
"correctIndex": 1,
"explanation": "-s menghapus symbol table, -w menghapus DWARF debug info. Hasilnya binary yang lebih kecil, ideal untuk production container."
}, {
"question": "Variable GOARCH=amd64 berarti binary dikompilasi untuk?",
"options": ["AMD processor saja", "CPU arsitektur 64-bit (Intel x86-64 dan AMD64)", "CPU 32-bit", "ARM processor"],
"correctIndex": 1,
"explanation": "amd64 (juga dikenal sebagai x86-64) adalah arsitektur 64-bit yang digunakan oleh Intel dan AMD modern. Bukan eksklusif untuk AMD."
}]
}
},
{
    "id": 258,
    "category": "Domain 26: Deployment & Production Go",
    "timestamp": "",
    "isDeploy": true,
    "title": "Menjalankan Go App di VPS / Ubuntu Server",
    "desc": "Setup Go di server Ubuntu dari nol: SSH ke VPS, install Go, deploy binary, dan jalankan sebagai background process.",
    "theoryHtml": "<div class=\"theory-section\">\n            <h3>Deploy Aplikasi Go ke VPS Ubuntu</h3>\n            <p>Skenario: Anda memiliki VPS Ubuntu (misal dari DigitalOcean, Vultr, AWS Lightsail) dan ingin menjalankan aplikasi Go di sana.</p>\n\n            <div class=\"step-block\">\n                <div class=\"step-num\">1</div>\n                <div class=\"step-content\">\n                    <h4>Koneksi SSH ke VPS</h4>\n                    <div class=\"code-box\">\n                        <div class=\"code-box-header\"><span>Terminal Lokal</span></div>\n                        <pre>ssh root@IP_SERVER_ANDA\n# atau dengan SSH key:\nssh -i ~/.ssh/id_rsa ubuntu@IP_SERVER_ANDA</pre>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"step-block\">\n                <div class=\"step-num\">2</div>\n                <div class=\"step-content\">\n                    <h4>Update Server & Install Go</h4>\n                    <div class=\"code-box\">\n                        <div class=\"code-box-header\"><span>Di dalam VPS</span></div>\n                        <pre>sudo apt update && sudo apt upgrade -y\nwget https://go.dev/dl/go1.26.0.linux-amd64.tar.gz\nsudo tar -C /usr/local -xzf go1.26.0.linux-amd64.tar.gz\necho 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc\nsource ~/.bashrc\ngo version</pre>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"step-block\">\n                <div class=\"step-num\">3</div>\n                <div class=\"step-content\">\n                    <h4>Upload & Build Aplikasi</h4>\n                    <div class=\"code-box\">\n                        <div class=\"code-box-header\"><span>Terminal Lokal — Opsi A: SCP</span></div>\n                        <pre># Upload source code ke VPS\nscp -r ./my-go-app ubuntu@IP_SERVER:/home/ubuntu/\n\n# Atau build di lokal dulu, upload binary\nGOOS=linux GOARCH=amd64 go build -ldflags=\"-s -w\" -o my-app main.go\nscp my-app ubuntu@IP_SERVER:/home/ubuntu/</pre>\n                    </div>\n                    <div class=\"code-box\">\n                        <div class=\"code-box-header\"><span>Di dalam VPS — Build di Server</span></div>\n                        <pre>cd /home/ubuntu/my-go-app\ngo build -o my-app main.go\nchmod +x my-app\n./my-app</pre>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"step-block\">\n                <div class=\"step-num\">4</div>\n                <div class=\"step-content\">\n                    <h4>Jalankan sebagai Background Process</h4>\n                    <div class=\"code-box\">\n                        <div class=\"code-box-header\"><span>Bash — nohup (sederhana)</span></div>\n                        <pre># Jalankan di background, abaikan HUP signal\nnohup ./my-app &gt; /var/log/my-app.log 2&gt;&1 &\n\n# Cek apakah berjalan\nps aux | grep my-app\n\n# Lihat log\ntail -f /var/log/my-app.log</pre>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">💡 Produksi: Gunakan systemd</div>\n                <p>Untuk deployment produksi yang proper, gunakan <strong>systemd service</strong> (lihat bab berikutnya) agar app otomatis restart jika crash dan berjalan saat server reboot.</p>\n            </div>\n\n            <h3>Konfigurasi Firewall (UFW)</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Bash</span></div>\n                <pre># Izinkan port aplikasi Go (misal port 8080)\nsudo ufw allow 8080/tcp\nsudo ufw enable\nsudo ufw status</pre>\n            </div>\n        </div>",
    "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n\t\"log\"\n)\n\n// Simple HTTP server untuk di-deploy ke VPS\nfunc main() {\n\thttp.HandleFunc(\"/\", func(w http.ResponseWriter, r *http.Request) {\n\t\tfmt.Fprintf(w, \"Hello dari Go Server!\\nMethod: %s\\nPath: %s\\n\",\n\t\t\tr.Method, r.URL.Path)\n\t})\n\n\thttp.HandleFunc(\"/health\", func(w http.ResponseWriter, r *http.Request) {\n\t\tw.WriteHeader(http.StatusOK)\n\t\tfmt.Fprintln(w, `{\"status\": \"ok\", \"service\": \"go-app\"}`)\n\t})\n\n\tfmt.Println(\"Server berjalan di :8080\")\n\tfmt.Println(\"Akses: http://localhost:8080\")\n\tlog.Fatal(http.ListenAndServe(\":8080\", nil))\n}",
    "quiz": {
"question": "Perintah 'nohup ./my-app > app.log 2>&1 &' — apa arti '2>&1' pada perintah tersebut?",
"options": ["Redirect output ke 2 file", "Redirect stderr (fd 2) ke tempat yang sama dengan stdout (fd 1)", "Jalankan dengan 2 thread", "Buat 2 instance aplikasi"],
"correctIndex": 1,
"explanation": "'2>&1' menggabungkan stderr (file descriptor 2) ke stdout (file descriptor 1), sehingga semua output (normal + error) masuk ke file yang sama."
},
    "hardQuiz": {
"questions": [{
"question": "Apa keunggulan build binary Go untuk deployment dibanding mengirim source code ke server?",
"options": ["Binary lebih mudah diedit", "Binary tidak memerlukan Go runtime/toolchain di server tujuan — single self-contained executable", "Binary lebih kecil dari source code", "Binary lebih aman dari hacking"],
"correctIndex": 1,
"explanation": "Binary Go sudah ter-compile dan self-contained. Server tidak perlu install Go untuk menjalankannya, berbeda dengan Python atau Node.js."
}, {
"question": "Perintah cross-compile yang benar untuk membuat binary Linux dari macOS adalah?",
"options": ["go build --linux main.go", "GOOS=linux GOARCH=amd64 go build -o app main.go", "go compile -target linux main.go", "go build -platform linux/amd64 main.go"],
"correctIndex": 1,
"explanation": "Go mendukung cross-compilation native dengan setting environment variable GOOS dan GOARCH sebelum perintah go build."
}, {
"question": "Port mana yang biasanya dibuka untuk HTTP traffic di UFW firewall?",
"options": ["sudo ufw allow 443", "sudo ufw allow 80/tcp", "sudo ufw open 80", "sudo firewall-cmd --add-port=80/tcp"],
"correctIndex": 1,
"explanation": "Port 80 adalah port default HTTP. Untuk HTTPS port 443. Sintaks UFW adalah 'sudo ufw allow PORT/protocol'."
}, {
"question": "Apa fungsi health check endpoint '/health' pada REST API server Go?",
"options": ["Mengecek kesehatan CPU server", "Memberikan sinyal bahwa server up dan siap menerima request, digunakan load balancer & monitoring", "Hanya untuk internal testing saja", "Menampilkan statistik memori aplikasi"],
"correctIndex": 1,
"explanation": "Health check endpoint digunakan oleh load balancer, Kubernetes, Docker Compose untuk menentukan apakah instance server sehat dan siap menerima traffic."
}, {
"question": "Setelah upload binary ke VPS, mengapa perlu menjalankan 'chmod +x ./my-app'?",
"options": ["Untuk memberikan nama executable", "Untuk memberikan permission execute agar file bisa dijalankan sebagai program", "Untuk mengenkripsi binary", "Untuk menambahkan file ke PATH otomatis"],
"correctIndex": 1,
"explanation": "File yang diupload ke Linux mungkin tidak memiliki execute permission. 'chmod +x' menambahkan permission execute sehingga OS bisa menjalankannya."
}]
}
},
{
    "id": 259,
    "category": "Domain 26: Deployment & Production Go",
    "timestamp": "",
    "isDeploy": true,
    "title": "Deploy Go dengan systemd Service",
    "desc": "Membuat systemd unit file untuk aplikasi Go agar otomatis berjalan saat boot, auto-restart jika crash, dan manajemen log terpusat.",
    "theoryHtml": "<div class=\"theory-section\">\n            <h3>Mengapa systemd untuk Go App?</h3>\n            <p>systemd adalah init system standar di Ubuntu/Debian modern. Dengan systemd, aplikasi Go Anda akan:</p>\n            <ul>\n                <li>✅ <strong>Auto-start</strong> saat server reboot</li>\n                <li>✅ <strong>Auto-restart</strong> jika crash (Restart=on-failure)</li>\n                <li>✅ <strong>Log terpusat</strong> via journalctl</li>\n                <li>✅ <strong>Manajemen mudah</strong>: start/stop/restart/status via systemctl</li>\n            </ul>\n\n            <div class=\"step-block\">\n                <div class=\"step-num\">1</div>\n                <div class=\"step-content\">\n                    <h4>Siapkan Binary & Direktori</h4>\n                    <div class=\"code-box\">\n                        <div class=\"code-box-header\"><span>Bash</span></div>\n                        <pre># Buat direktori untuk aplikasi\nsudo mkdir -p /opt/my-go-app\n\n# Copy binary ke sana\nsudo cp ./my-app /opt/my-go-app/\nsudo chmod +x /opt/my-go-app/my-app\n\n# Buat user dedicated (best practice keamanan)\nsudo useradd -r -s /bin/false goapp</pre>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"step-block\">\n                <div class=\"step-num\">2</div>\n                <div class=\"step-content\">\n                    <h4>Buat systemd Unit File</h4>\n                    <div class=\"code-box\">\n                        <div class=\"code-box-header\"><span>Bash</span></div>\n                        <pre>sudo nano /etc/systemd/system/my-go-app.service</pre>\n                    </div>\n                    <div class=\"code-box\">\n                        <div class=\"code-box-header\"><span>/etc/systemd/system/my-go-app.service</span></div>\n                        <pre>[Unit]\nDescription=My Go Application Server\nDocumentation=https://github.com/yourname/my-go-app\nAfter=network.target\n\n[Service]\nType=simple\nUser=goapp\nGroup=goapp\nWorkingDirectory=/opt/my-go-app\nExecStart=/opt/my-go-app/my-app\nRestart=on-failure\nRestartSec=5s\nStandardOutput=journal\nStandardError=journal\nSyslogIdentifier=my-go-app\nEnvironment=PORT=8080\nEnvironment=GIN_MODE=release\n\n[Install]\nWantedBy=multi-user.target</pre>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"step-block\">\n                <div class=\"step-num\">3</div>\n                <div class=\"step-content\">\n                    <h4>Aktifkan & Jalankan Service</h4>\n                    <div class=\"code-box\">\n                        <div class=\"code-box-header\"><span>Bash</span></div>\n                        <pre># Reload systemd untuk membaca unit file baru\nsudo systemctl daemon-reload\n\n# Enable agar auto-start saat boot\nsudo systemctl enable my-go-app\n\n# Start service sekarang\nsudo systemctl start my-go-app\n\n# Cek status\nsudo systemctl status my-go-app\n\n# Lihat log real-time\nsudo journalctl -u my-go-app -f\n\n# Stop service\nsudo systemctl stop my-go-app\n\n# Restart service\nsudo systemctl restart my-go-app</pre>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">💡 Update Deployment</div>\n                <p>Saat ada update binary: build baru → stop service → copy binary → start service lagi.</p>\n                <pre style=\"font-family:monospace; font-size:0.85rem; margin-top:8px\">sudo systemctl stop my-go-app\nsudo cp ./new-app /opt/my-go-app/my-app\nsudo systemctl start my-go-app</pre>\n            </div>\n        </div>",
    "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n\t\"log\"\n\t\"os\"\n\t\"os/signal\"\n\t\"syscall\"\n)\n\nfunc main() {\n\tport := os.Getenv(\"PORT\")\n\tif port == \"\" {\n\t\tport = \"8080\"\n\t}\n\n\thttp.HandleFunc(\"/\", homeHandler)\n\thttp.HandleFunc(\"/health\", healthHandler)\n\n\t// Graceful shutdown\n\tgo func() {\n\t\tsigChan := make(chan os.Signal, 1)\n\t\tsignal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)\n\t\t<-sigChan\n\t\tlog.Println(\"Server shutting down gracefully...\")\n\t\tos.Exit(0)\n\t}()\n\n\tlog.Printf(\"Server berjalan di port %s\", port)\n\tlog.Fatal(http.ListenAndServe(\":\"+port, nil))\n}\n\nfunc homeHandler(w http.ResponseWriter, r *http.Request) {\n\tfmt.Fprintf(w, \"Go App berjalan! (systemd service)\")\n}\n\nfunc healthHandler(w http.ResponseWriter, r *http.Request) {\n\tw.Header().Set(\"Content-Type\", \"application/json\")\n\tfmt.Fprintln(w, `{\"status\":\"healthy\"}`)\n}",
    "quiz": {
"question": "Perintah systemctl apa yang membuat service Go berjalan OTOMATIS setiap kali server reboot?",
"options": ["sudo systemctl start my-go-app", "sudo systemctl enable my-go-app", "sudo systemctl activate my-go-app", "sudo systemctl autostart my-go-app"],
"correctIndex": 1,
"explanation": "'systemctl enable' membuat symlink service ke direktori yang dieksekusi saat boot (multi-user.target). 'start' hanya menjalankan untuk sesi saat ini."
},
    "hardQuiz": {
"questions": [{
"question": "Apa fungsi 'Restart=on-failure' dalam systemd unit file?",
"options": ["Service restart setiap N detik secara berkala", "Service otomatis restart HANYA jika exit code tidak normal (crash/error)", "Service restart setiap kali ada perubahan file", "Service restart hanya saat manual diminta"],
"correctIndex": 1,
"explanation": "on-failure berarti systemd hanya restart service jika prosesnya keluar dengan exit code non-zero (crash). Normal exit (os.Exit(0)) tidak memicu restart."
}, {
"question": "Mengapa disarankan membuat user khusus (goapp) untuk menjalankan service Go?",
"options": ["Agar service lebih cepat", "Prinsip least privilege: membatasi akses file system jika aplikasi terkompromi", "Systemd mengharuskan user khusus", "Agar log lebih mudah dibaca"],
"correctIndex": 1,
"explanation": "Security best practice: jalankan service dengan user non-root yang hanya memiliki akses minimum yang diperlukan. Jika app di-hack, damage terbatas."
}, {
"question": "Perintah apa untuk melihat log service Go secara real-time?",
"options": ["systemctl logs -f my-go-app", "journalctl -u my-go-app -f", "tail -f /var/log/my-go-app", "systemd-log -watch my-go-app"],
"correctIndex": 1,
"explanation": "journalctl -u nama-service -f menampilkan log dari journal systemd untuk unit tertentu secara follow/realtime."
}, {
"question": "Apa yang dilakukan 'sudo systemctl daemon-reload'?",
"options": ["Restart semua service yang berjalan", "Memaksa systemd membaca ulang semua unit file yang baru atau diubah", "Mengupdate systemd ke versi terbaru", "Reset semua konfigurasi systemd"],
"correctIndex": 1,
"explanation": "daemon-reload harus dijalankan setiap kali unit file (.service) dibuat atau diubah agar systemd mengenali perubahan tersebut."
}, {
"question": "Field 'After=network.target' dalam [Unit] section berarti?",
"options": ["Service hanya berjalan jika ada koneksi internet", "Service dimulai SETELAH networking stack siap/aktif", "Service menunggu 'network' service selesai", "Service tidak memerlukan jaringan"],
"correctIndex": 1,
"explanation": "'After=network.target' memastikan service Go baru dimulai setelah network interface tersedia, mencegah error saat binding port di boot."
}]
}
},
{
    "id": 260,
    "category": "Domain 26: Deployment & Production Go",
    "timestamp": "",
    "isDeploy": true,
    "title": "Dockerize Aplikasi Go — Dockerfile Dasar",
    "desc": "Membuat Dockerfile untuk aplikasi Go, build image, run container, dan memahami layer caching Docker.",
    "theoryHtml": "<div class=\"theory-section\">\n            <h3>Mengapa Docker untuk Go?</h3>\n            <p>Docker memungkinkan Anda mengemas aplikasi Go beserta seluruh dependensinya dalam sebuah <strong>container</strong> yang berjalan identik di manapun — laptop developer, staging server, maupun production cloud.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">🐳 Konsep Docker untuk Go Developer</div>\n                <ul>\n                    <li><strong>Image:</strong> Blueprint/template container (dari Dockerfile)</li>\n                    <li><strong>Container:</strong> Instance yang berjalan dari sebuah image</li>\n                    <li><strong>Layer:</strong> Setiap instruksi Dockerfile membuat layer yang di-cache</li>\n                    <li><strong>Registry:</strong> Tempat penyimpanan image (Docker Hub, ECR, GCR)</li>\n                </ul>\n            </div>\n\n            <h3>Struktur Project</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Struktur Folder</span></div>\n                <pre>my-go-app/\n├── main.go\n├── go.mod\n├── go.sum\n└── Dockerfile</pre>\n            </div>\n\n            <h3>Dockerfile — Versi Sederhana</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Dockerfile</span></div>\n                <pre># Base image dengan Go toolchain\nFROM golang:1.26-alpine\n\n# Set working directory di dalam container\nWORKDIR /app\n\n# Copy dependency files dulu (untuk layer caching)\nCOPY go.mod go.sum ./\nRUN go mod download\n\n# Copy seluruh source code\nCOPY . .\n\n# Build binary\nRUN go build -o my-app main.go\n\n# Expose port yang digunakan aplikasi\nEXPOSE 8080\n\n# Perintah yang dijalankan saat container start\nCMD [\"./my-app\"]</pre>\n            </div>\n\n            <h3>Build & Run Container</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Terminal</span></div>\n                <pre># Build Docker image\ndocker build -t my-go-app:latest .\n\n# Lihat image yang sudah dibuat\ndocker images\n\n# Jalankan container (port 8080 host → 8080 container)\ndocker run -d -p 8080:8080 --name go-server my-go-app:latest\n\n# Cek container berjalan\ndocker ps\n\n# Lihat log container\ndocker logs -f go-server\n\n# Stop & remove container\ndocker stop go-server && docker rm go-server</pre>\n            </div>\n\n            <div class=\"callout callout-warning\">\n                <div class=\"callout-title\">⚠️ Masalah: Image Terlalu Besar</div>\n                <p>Dockerfile sederhana di atas menggunakan golang:alpine sebagai base image final, yang masih mengandung seluruh Go toolchain. Ukuran image bisa 300-400 MB. Solusi: <strong>Multi-Stage Build</strong> (lihat bab berikutnya).</p>\n            </div>\n        </div>",
    "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n\t\"log\"\n\t\"os\"\n)\n\n// Aplikasi ini akan di-Dockerize\nfunc main() {\n\tport := os.Getenv(\"PORT\")\n\tif port == \"\" {\n\t\tport = \"8080\"\n\t}\n\n\tmux := http.NewServeMux()\n\tmux.HandleFunc(\"/\", func(w http.ResponseWriter, r *http.Request) {\n\t\thost, _ := os.Hostname()\n\t\tfmt.Fprintf(w, \"Hello dari Docker Container!\\nContainer ID: %s\\nPort: %s\\n\",\n\t\t\thost, port)\n\t})\n\n\tmux.HandleFunc(\"/health\", func(w http.ResponseWriter, r *http.Request) {\n\t\tw.Header().Set(\"Content-Type\", \"application/json\")\n\t\tfmt.Fprintln(w, `{\"status\":\"ok\",\"runtime\":\"go-docker\"}`)\n\t})\n\n\tlog.Printf(\"🐳 Docker Go Server running on :%s\", port)\n\tlog.Fatal(http.ListenAndServe(\":\"+port, mux))\n}",
    "quiz": {
"question": "Mengapa sebaiknya COPY go.mod go.sum diletakkan SEBELUM COPY . . (source code) di Dockerfile?",
"options": ["Karena go.mod lebih kecil dan lebih cepat", "Untuk memanfaatkan Docker layer cache: jika go.mod tidak berubah, layer 'go mod download' tidak perlu dijalankan ulang", "Karena go.sum harus dibaca sebelum source code", "Tidak ada perbedaan, urutan tidak penting"],
"correctIndex": 1,
"explanation": "Docker meng-cache setiap layer. Dengan copy go.mod+go.sum dulu dan RUN go mod download, layer download dependencies tidak perlu diulang jika hanya source code yang berubah."
},
    "hardQuiz": {
"questions": [{
"question": "Flag '-d' pada 'docker run -d' berarti?",
"options": ["Debug mode", "Detached mode — container berjalan di background", "Dry run — tidak benar-benar menjalankan container", "Default mode"],
"correctIndex": 1,
"explanation": "-d (detached) menjalankan container di background dan mengembalikan container ID. Tanpa -d, terminal akan ter-attach ke container."
}, {
"question": "Apa arti flag '-p 8080:8080' pada docker run?",
"options": ["Prioritas container 8080", "Map port 8080 host ke port 8080 di dalam container (host:container)", "Buka dua port sekaligus", "Expose port 8080 ke internet"],
"correctIndex": 1,
"explanation": "Format -p adalah HOST_PORT:CONTAINER_PORT. 8080:8080 berarti akses localhost:8080 di host akan diteruskan ke port 8080 di dalam container."
}, {
"question": "Apa perbedaan CMD dan ENTRYPOINT dalam Dockerfile?",
"options": ["Keduanya identik", "ENTRYPOINT tidak bisa di-override, CMD bisa di-override saat docker run. Keduanya mendefinisikan perintah default container.", "CMD dijalankan saat build, ENTRYPOINT saat run", "ENTRYPOINT untuk Linux, CMD untuk Windows"],
"correctIndex": 1,
"explanation": "ENTRYPOINT mendefinisikan executable utama yang tidak bisa mudah di-override. CMD mendefinisikan default args yang mudah di-override. Keduanya bisa dikombinasikan."
}, {
"question": "Perintah mana yang melihat semua container (termasuk yang stopped)?",
"options": ["docker ps", "docker ps -a", "docker containers list", "docker ls --all"],
"correctIndex": 1,
"explanation": "'docker ps' hanya menampilkan container yang sedang berjalan. 'docker ps -a' (--all) menampilkan semua container termasuk yang sudah stop."
}, {
"question": "Basis image golang:1.26-alpine menggunakan Alpine Linux. Apa keunggulan Alpine?",
"options": ["Alpine lebih cepat dari Ubuntu", "Alpine sangat kecil (~5MB) dibanding Ubuntu (~80MB), menghasilkan Docker image yang lebih ringan", "Alpine mendukung lebih banyak package", "Alpine lebih aman dari serangan DDoS"],
"correctIndex": 1,
"explanation": "Alpine Linux adalah distro minimal yang dirancang untuk container. Ukurannya ~5MB vs Ubuntu ~80MB, sangat ideal untuk mengecilkan Docker image size."
}]
}
},
{
    "id": 261,
    "category": "Domain 26: Deployment & Production Go",
    "timestamp": "",
    "isDeploy": true,
    "title": "Multi-Stage Docker Build untuk Go",
    "desc": "Optimasi Docker image Go dari 400MB menjadi <15MB menggunakan Multi-Stage Build dengan builder + distroless/scratch.",
    "theoryHtml": "<div class=\"theory-section\">\n            <h3>Masalah dengan Single-Stage Dockerfile</h3>\n            <p>Dockerfile satu tahap menghasilkan image yang berisi seluruh Go toolchain (compiler, standard library, tools), padahal untuk menjalankan binary Go, Anda hanya butuh <strong>binarynya saja</strong>.</p>\n\n            <div class=\"callout callout-warning\">\n                <div class=\"callout-title\">Perbandingan Ukuran Image</div>\n                <ul>\n                    <li>❌ Single-stage (golang:alpine): ~350-400 MB</li>\n                    <li>✅ Multi-stage (scratch): ~8-15 MB</li>\n                    <li>✅ Multi-stage (distroless): ~20-30 MB</li>\n                </ul>\n            </div>\n\n            <h3>Multi-Stage Dockerfile — Versi Scratch (Paling Kecil)</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Dockerfile — Multi-Stage + Scratch</span></div>\n                <pre># ── Stage 1: Builder ──\nFROM golang:1.26-alpine AS builder\n\nWORKDIR /build\n\n# Install dependencies\nCOPY go.mod go.sum ./\nRUN go mod download\n\n# Copy & build dengan optimasi\nCOPY . .\nRUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \\\n    go build \\\n    -ldflags=\"-s -w -extldflags=-static\" \\\n    -o app main.go\n\n# ── Stage 2: Final Image ──\n# Gunakan scratch (image kosong, 0 byte)\nFROM scratch\n\n# Copy hanya binary dari stage builder\nCOPY --from=builder /build/app /app\n\n# Copy SSL certificates (untuk HTTPS calls)\nCOPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/\n\n# Expose port\nEXPOSE 8080\n\n# Jalankan binary\nENTRYPOINT [\"/app\"]</pre>\n            </div>\n\n            <h3>Multi-Stage dengan distroless (Lebih Aman)</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Dockerfile — Multi-Stage + distroless</span></div>\n                <pre>FROM golang:1.26-alpine AS builder\nWORKDIR /build\nCOPY go.mod go.sum ./\nRUN go mod download\nCOPY . .\nRUN CGO_ENABLED=0 go build -ldflags=\"-s -w\" -o app main.go\n\n# Google Distroless: punya user non-root, certs, tzdata\nFROM gcr.io/distroless/static:nonroot\nCOPY --from=builder /build/app /app\nEXPOSE 8080\nUSER nonroot:nonroot\nENTRYPOINT [\"/app\"]</pre>\n            </div>\n\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Terminal — Build & Cek Ukuran</span></div>\n                <pre>docker build -t my-go-app:optimized .\ndocker images | grep my-go-app\n# REPOSITORY     TAG         SIZE\n# my-go-app      optimized   12.4MB  ← jauh lebih kecil!</pre>\n            </div>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">💡 Flag Penting: CGO_ENABLED=0</div>\n                <p><code>CGO_ENABLED=0</code> menonaktifkan cgo (C bindings), menghasilkan binary yang pure Go dan fully static — tidak bergantung pada shared library C di sistem operasi. Wajib jika menggunakan image scratch.</p>\n            </div>\n        </div>",
    "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n\t\"log\"\n\t\"runtime\"\n)\n\n// Aplikasi siap untuk Multi-Stage Docker Build\n// Binary yang dihasilkan: fully static, ~8MB\nfunc main() {\n\thttp.HandleFunc(\"/\", func(w http.ResponseWriter, r *http.Request) {\n\t\tw.Header().Set(\"Content-Type\", \"application/json\")\n\t\tfmt.Fprintf(w, `{\n  \"message\": \"Go App berjalan dalam container!\",\n  \"go_version\": \"%s\",\n  \"os\": \"%s\",\n  \"arch\": \"%s\"\n}`, runtime.Version(), runtime.GOOS, runtime.GOARCH)\n\t})\n\n\tlog.Println(\"Multi-stage Go Docker container ready: :8080\")\n\tlog.Fatal(http.ListenAndServe(\":8080\", nil))\n}",
    "quiz": {
"question": "Apa tujuan utama dari CGO_ENABLED=0 saat build Go untuk Docker?",
"options": ["Mempercepat waktu kompilasi", "Menghasilkan static binary yang tidak bergantung pada shared library C, sehingga bisa berjalan di image scratch yang kosong", "Menonaktifkan garbage collector", "Mengaktifkan mode debug"],
"correctIndex": 1,
"explanation": "CGO_ENABLED=0 menghasilkan pure Go static binary tanpa dependensi pada libc atau shared library C, sehingga bisa berjalan di image scratch/distroless yang tidak punya library apapun."
},
    "hardQuiz": {
"questions": [{
"question": "Dalam multi-stage Dockerfile, sintaks 'COPY --from=builder /build/app /app' berarti?",
"options": ["Copy dari remote registry bernama builder", "Copy file /build/app dari stage bernama 'builder' ke /app di stage saat ini", "Copy file app dari folder builder di host", "Build ulang file app"],
"correctIndex": 1,
"explanation": "--from=builder menunjuk ke stage sebelumnya yang diberi nama AS builder. Ini memungkinkan copy artifact dari stage sebelumnya ke stage saat ini."
}, {
"question": "Image 'scratch' di Docker adalah?",
"options": ["Image Ubuntu minimal", "Image benar-benar kosong tanpa filesystem apapun — titik awal paling minimal", "Image Alpine yang dihapus packagenya", "Image untuk testing/development saja"],
"correctIndex": 1,
"explanation": "scratch adalah special Docker image yang benar-benar kosong — tidak ada shell, tidak ada OS tools, tidak ada library. Hanya binary yang di-COPY yang ada di image."
}, {
"question": "Flag -ldflags='-s -w' saat go build berfungsi untuk?",
"options": ["Static linking dan warning disable", "Strip debug symbols (-s) dan DWARF info (-w), mengecilkan ukuran binary secara signifikan", "Speed optimization level s dan w", "Set linker script custom"],
"correctIndex": 1,
"explanation": "-s menghapus symbol table, -w menghapus DWARF debug information. Kombinasi keduanya bisa mengecilkan binary hingga 30-40%."
}, {
"question": "Distroless image dari Google keunggulannya dibanding scratch adalah?",
"options": ["Distroless lebih kecil dari scratch", "Distroless sudah include user non-root, SSL certificates, timezone data — lebih aman dan praktis", "Distroless support lebih banyak architecture", "Distroless gratis, scratch berbayar"],
"correctIndex": 1,
"explanation": "Distroless sudah include minimal extras: non-root user, /etc/ssl/certs, timezone data — yang sering dibutuhkan aplikasi production tanpa perlu OS penuh."
}, {
"question": "Jika aplikasi Go memerlukan file assets (HTML template, config), apa yang harus dilakukan di Dockerfile multi-stage?",
"options": ["Tidak mungkin menggunakan multi-stage jika ada assets", "COPY asset files dari builder stage ke final stage bersama binary-nya, atau embed assets menggunakan //go:embed", "Letakkan assets di Docker volume", "Convert semua assets ke base64 di dalam binary"],
"correctIndex": 1,
"explanation": "Ada dua cara: COPY assets dari builder ke final stage, atau lebih elegant: gunakan Go's //go:embed directive untuk embed files ke dalam binary sehingga self-contained."
}]
}
},
{
    "id": 262,
    "category": "Domain 26: Deployment & Production Go",
    "timestamp": "",
    "isDeploy": true,
    "title": "Docker Compose untuk Go App",
    "desc": "Menjalankan Go app bersama database (PostgreSQL/Redis) menggunakan Docker Compose dengan networking, volumes, dan environment variables.",
    "theoryHtml": "<div class=\"theory-section\">\n            <h3>Docker Compose: Multi-Container Setup</h3>\n            <p>Docker Compose memungkinkan Anda mendefinisikan dan menjalankan aplikasi multi-container dalam satu file konfigurasi YAML. Ideal untuk Go app + database + cache.</p>\n\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>docker-compose.yml</span></div>\n                <pre>version: '3.9'\n\nservices:\n  # ── Go Application ──\n  app:\n    build:\n      context: .\n      dockerfile: Dockerfile\n    container_name: go-app\n    ports:\n      - \"8080:8080\"\n    environment:\n      - DB_HOST=postgres\n      - DB_PORT=5432\n      - DB_USER=gouser\n      - DB_PASS=secretpass\n      - DB_NAME=myapp\n      - REDIS_URL=redis:6379\n    depends_on:\n      postgres:\n        condition: service_healthy\n      redis:\n        condition: service_started\n    networks:\n      - app-network\n    restart: unless-stopped\n\n  # ── PostgreSQL Database ──\n  postgres:\n    image: postgres:16-alpine\n    container_name: go-postgres\n    environment:\n      POSTGRES_USER: gouser\n      POSTGRES_PASSWORD: secretpass\n      POSTGRES_DB: myapp\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U gouser -d myapp\"]\n      interval: 10s\n      timeout: 5s\n      retries: 5\n    networks:\n      - app-network\n\n  # ── Redis Cache ──\n  redis:\n    image: redis:8-alpine\n    container_name: go-redis\n    volumes:\n      - redis_data:/data\n    networks:\n      - app-network\n\nvolumes:\n  postgres_data:\n  redis_data:\n\nnetworks:\n  app-network:\n    driver: bridge</pre>\n            </div>\n\n            <h3>Perintah Docker Compose</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Terminal</span></div>\n                <pre># Jalankan semua service (build jika perlu)\ndocker compose up -d\n\n# Rebuild & restart hanya service app\ndocker compose up -d --build app\n\n# Lihat status semua service\ndocker compose ps\n\n# Lihat log semua service\ndocker compose logs -f\n\n# Lihat log service spesifik\ndocker compose logs -f app\n\n# Stop semua service\ndocker compose down\n\n# Stop + hapus volumes\ndocker compose down -v</pre>\n            </div>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">💡 Healthcheck pada depends_on</div>\n                <p>Gunakan <code>condition: service_healthy</code> bersama healthcheck agar Go app menunggu database benar-benar siap (bukan hanya containernya yang started).</p>\n            </div>\n        </div>",
    "initialCode": "package main\n\nimport (\n\t\"database/sql\"\n\t\"fmt\"\n\t\"log\"\n\t\"net/http\"\n\t\"os\"\n\n\t// Simulasi struktur yang akan digunakan dengan PostgreSQL\n)\n\ntype Config struct {\n\tDBHost     string\n\tDBPort     string\n\tDBUser     string\n\tDBPassword string\n\tDBName     string\n}\n\nfunc getConfig() Config {\n\treturn Config{\n\t\tDBHost:     getEnv(\"DB_HOST\", \"localhost\"),\n\t\tDBPort:     getEnv(\"DB_PORT\", \"5432\"),\n\t\tDBUser:     getEnv(\"DB_USER\", \"postgres\"),\n\t\tDBPassword: getEnv(\"DB_PASS\", \"password\"),\n\t\tDBName:     getEnv(\"DB_NAME\", \"myapp\"),\n\t}\n}\n\nfunc getEnv(key, defaultVal string) string {\n\tif val := os.Getenv(key); val != \"\" {\n\t\treturn val\n\t}\n\treturn defaultVal\n}\n\nfunc getDBConnectionString(cfg Config) string {\n\treturn fmt.Sprintf(\n\t\t\"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable\",\n\t\tcfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName,\n\t)\n}\n\nfunc main() {\n\tcfg := getConfig()\n\tconnStr := getDBConnectionString(cfg)\n\tfmt.Println(\"Connection string:\", connStr)\n\n\t// Di production, uncomment ini:\n\t// db, err := sql.Open(\"postgres\", connStr)\n\t_ = sql.ErrNoRows // prevent unused import\n\t\n\thttp.HandleFunc(\"/config\", func(w http.ResponseWriter, r *http.Request) {\n\t\tfmt.Fprintf(w, \"DB: %s@%s:%s/%s\", cfg.DBUser, cfg.DBHost, cfg.DBPort, cfg.DBName)\n\t})\n\n\tlog.Println(\"App siap. DB config loaded dari environment.\")\n\tlog.Fatal(http.ListenAndServe(\":8080\", nil))\n}",
    "quiz": {
"question": "Apa perbedaan 'depends_on' dengan 'condition: service_healthy' vs 'condition: service_started' di Docker Compose?",
"options": ["Keduanya sama — hanya nama lain", "service_healthy menunggu healthcheck container lulus; service_started hanya menunggu container berjalan (tidak jamin service siap)", "service_started lebih lambat dari service_healthy", "condition hanya tersedia di Docker Compose versi 2"],
"correctIndex": 1,
"explanation": "service_started: container dimulai (tapi PostgreSQL mungkin belum menerima koneksi). service_healthy: menunggu healthcheck berhasil (PostgreSQL benar-benar siap)."
},
    "hardQuiz": {
"questions": [{
"question": "Di Docker Compose, bagaimana container 'app' bisa terhubung ke container 'postgres' menggunakan hostname 'postgres'?",
"options": ["Dengan menambahkan entri di /etc/hosts", "Docker Compose secara otomatis membuat DNS resolution antar service dalam network yang sama berdasarkan nama service", "Menggunakan IP address statis container", "Harus dikonfigurasi manual dengan link:"],
"correctIndex": 1,
"explanation": "Docker Compose membuat internal DNS di dalam network. Nama service (misal 'postgres') otomatis bisa di-resolve sebagai hostname dari container lain dalam network yang sama."
}, {
"question": "Apa fungsi 'volumes: postgres_data:/var/lib/postgresql/data'?",
"options": ["Share file antara dua container", "Persist data database ke named volume agar data tidak hilang saat container dihapus/restart", "Backup otomatis database", "Enkripsi data database"],
"correctIndex": 1,
"explanation": "Named volume (postgres_data) menyimpan data di Docker-managed storage. Data bertahan meski container dihapus. Tanpa volume, data hilang saat container down."
}, {
"question": "Perintah 'docker compose down -v' vs 'docker compose down' perbedaannya?",
"options": ["Tidak ada perbedaan", "-v juga menghapus named volumes (data database ikut terhapus), tanpa -v hanya menghapus container", "-v hanya verbose mode", "-v menghapus image yang digunakan"],
"correctIndex": 1,
"explanation": "down -v (--volumes) menghapus semua named volumes yang didefinisikan dalam compose file. Ini menghapus data persisten (database, dll). Gunakan hati-hati!"
}, {
"question": "Jika Go app gagal connect ke PostgreSQL karena 'connection refused' saat startup, solusi terbaik adalah?",
"options": ["Tambahkan sleep di kode Go", "Implementasikan retry logic dengan exponential backoff di kode Go, atau gunakan depends_on dengan healthcheck", "Jalankan postgres sebelum app secara manual", "Gunakan SQLite instead"],
"correctIndex": 1,
"explanation": "Best practice: kombinasi depends_on+healthcheck di Compose (untuk urutan start) DAN retry logic di kode Go (untuk race condition yang masih mungkin terjadi)."
}, {
"question": "Apa manfaat mendefinisikan custom network (app-network) di Docker Compose vs menggunakan default network?",
"options": ["Custom network lebih cepat", "Isolasi lebih baik, container hanya bisa berkomunikasi dengan yang di-network sama, dan network bisa di-reuse oleh compose file lain", "Custom network wajib untuk healthcheck", "Tidak ada perbedaan nyata"],
"correctIndex": 1,
"explanation": "Custom network memberikan isolasi yang lebih eksplisit dan bisa dishare antar compose project. Default network otomatis tapi kurang fleksibel untuk setup kompleks."
}]
}
},
{
    "id": 263,
    "category": "Domain 26: Deployment & Production Go",
    "timestamp": "",
    "isDeploy": true,
    "title": "Nginx sebagai Reverse Proxy untuk Go",
    "desc": "Konfigurasi Nginx sebagai reverse proxy di depan Go app: load balancing, SSL termination, static file serving, dan security headers.",
    "theoryHtml": "<div class=\"theory-section\">\n            <h3>Arsitektur: Nginx + Go App</h3>\n            <p>Dalam production, sangat umum meletakkan <strong>Nginx</strong> di depan Go app sebagai reverse proxy. Nginx menangani:</p>\n            <ul>\n                <li>🔒 SSL/TLS termination (HTTPS)</li>\n                <li>⚡ Static file serving (CSS, JS, images)</li>\n                <li>⚖️ Load balancing ke multiple Go instances</li>\n                <li>🛡️ Security headers, rate limiting</li>\n                <li>📝 Access logging terpusat</li>\n            </ul>\n\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Bash — Install Nginx</span></div>\n                <pre>sudo apt install nginx -y\nsudo systemctl enable nginx\nsudo systemctl start nginx</pre>\n            </div>\n\n            <h3>Konfigurasi Nginx sebagai Reverse Proxy</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>/etc/nginx/sites-available/my-go-app</span></div>\n                <pre>upstream go_backend {\n    server 127.0.0.1:8080;\n    # Load balancing ke multiple instances:\n    # server 127.0.0.1:8081;\n    # server 127.0.0.1:8082;\n}\n\nserver {\n    listen 80;\n    server_name yourdomain.com www.yourdomain.com;\n\n    # Redirect HTTP ke HTTPS\n    return 301 https://$server_name$request_uri;\n}\n\nserver {\n    listen 443 ssl http2;\n    server_name yourdomain.com www.yourdomain.com;\n\n    # SSL Certificates (via Certbot)\n    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;\n\n    # Security Headers\n    add_header X-Frame-Options \"SAMEORIGIN\";\n    add_header X-Content-Type-Options \"nosniff\";\n    add_header X-XSS-Protection \"1; mode=block\";\n\n    # Static files served directly by Nginx\n    location /static/ {\n        alias /opt/my-go-app/static/;\n        expires 30d;\n    }\n\n    # Proxy semua request lain ke Go app\n    location / {\n        proxy_pass http://go_backend;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection 'upgrade';\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n        proxy_cache_bypass $http_upgrade;\n        proxy_read_timeout 86400;\n    }\n}</pre>\n            </div>\n\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Bash — Aktifkan & Test Konfigurasi</span></div>\n                <pre># Buat symlink ke sites-enabled\nsudo ln -s /etc/nginx/sites-available/my-go-app /etc/nginx/sites-enabled/\n\n# Test konfigurasi Nginx\nsudo nginx -t\n\n# Reload Nginx\nsudo systemctl reload nginx\n\n# Install SSL via Certbot (free Let's Encrypt)\nsudo apt install certbot python3-certbot-nginx -y\nsudo certbot --nginx -d yourdomain.com -d www.yourdomain.com</pre>\n            </div>\n\n            <div class=\"callout callout-tip\">\n                <div class=\"callout-title\">💡 Header X-Real-IP</div>\n                <p>Dengan proxy_set_header X-Real-IP $remote_addr, Go app bisa mendapatkan IP address asli client (bukan IP Nginx) melalui <code>r.Header.Get(\"X-Real-IP\")</code>.</p>\n            </div>\n        </div>",
    "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"net/http\"\n\t\"log\"\n)\n\n// Go app yang di-proxy oleh Nginx\nfunc main() {\n\thttp.HandleFunc(\"/\", func(w http.ResponseWriter, r *http.Request) {\n\t\t// Dapatkan IP asli client dari header Nginx\n\t\trealIP := r.Header.Get(\"X-Real-IP\")\n\t\tif realIP == \"\" {\n\t\t\trealIP = r.RemoteAddr\n\t\t}\n\t\t\n\t\tproto := r.Header.Get(\"X-Forwarded-Proto\")\n\t\tif proto == \"\" {\n\t\t\tproto = \"http\"\n\t\t}\n\n\t\tfmt.Fprintf(w, \"Request diterima!\\nClient IP: %s\\nProtocol: %s\\nHost: %s\\nPath: %s\",\n\t\t\trealIP, proto, r.Host, r.URL.Path)\n\t})\n\n\thttp.HandleFunc(\"/health\", func(w http.ResponseWriter, r *http.Request) {\n\t\tw.Header().Set(\"Content-Type\", \"application/json\")\n\t\tfmt.Fprintln(w, `{\"status\":\"ok\"}`)\n\t})\n\n\t// Go app hanya listen di localhost (Nginx yang expose ke internet)\n\tlog.Println(\"Go backend berjalan di :8080 (behind Nginx)\")\n\tlog.Fatal(http.ListenAndServe(\"127.0.0.1:8080\", nil))\n}",
    "quiz": {
"question": "Mengapa Go app sebaiknya listen di '127.0.0.1:8080' (bukan '0.0.0.0:8080') jika menggunakan Nginx?",
"options": ["Karena 0.0.0.0 tidak valid", "Agar Go app hanya bisa diakses dari Nginx (localhost), tidak langsung dari internet — meningkatkan keamanan", "Karena 127.0.0.1 lebih cepat dari 0.0.0.0", "Nginx mengharuskan backend listen di 127.0.0.1"],
"correctIndex": 1,
"explanation": "Dengan listen di 127.0.0.1 (loopback), port Go app tidak bisa diakses dari luar server. Hanya Nginx (yang ada di server yang sama) yang bisa terhubung ke backend."
},
    "hardQuiz": {
"questions": [{
"question": "Apa fungsi blok 'upstream go_backend { server 127.0.0.1:8080; }' di konfigurasi Nginx?",
"options": ["Mendefinisikan server Go yang diupload", "Mendefinisikan backend pool untuk load balancing; bisa berisi multiple server instances", "Mendefinisikan upstream dependency library", "Setting cache untuk response Go app"],
"correctIndex": 1,
"explanation": "Blok upstream mendefinisikan kelompok backend server. Dengan menambahkan multiple server entries, Nginx otomatis melakukan load balancing round-robin."
}, {
"question": "Header 'proxy_set_header X-Forwarded-Proto $scheme' berguna untuk?",
"options": ["Mengubah protocol dari HTTP ke HTTPS", "Memberitahu Go app apakah original request dari client menggunakan HTTP atau HTTPS (sebelum di-terminate Nginx)", "Mengaktifkan HTTP/2 di Nginx", "Setting timeout connection"],
"correctIndex": 1,
"explanation": "SSL termination terjadi di Nginx. Go app menerima request sebagai HTTP dari Nginx. X-Forwarded-Proto memberitahu Go app protocol asli yang digunakan client (https)."
}, {
"question": "Certbot dengan flag '--nginx' pada 'sudo certbot --nginx -d domain.com' melakukan apa secara otomatis?",
"options": ["Hanya download certificate saja", "Mendapatkan sertifikat SSL dari Let's Encrypt DAN otomatis mengupdate konfigurasi Nginx untuk HTTPS", "Install Nginx dengan SSL pre-configured", "Membuat self-signed certificate"],
"correctIndex": 1,
"explanation": "--nginx flag membuat Certbot secara otomatis memodifikasi konfigurasi Nginx yang ada untuk mengaktifkan HTTPS, termasuk redirect HTTP→HTTPS."
}, {
"question": "Direktif 'proxy_read_timeout 86400' berarti Nginx akan menunggu response dari Go app selama?",
"options": ["86400 milidetik (86.4 detik)", "86400 detik (24 jam) — berguna untuk long-polling atau WebSocket", "86400 menit", "Default Nginx timeout"],
"correctIndex": 1,
"explanation": "proxy_read_timeout dalam satuan detik. 86400 = 24 jam. Nilai tinggi diperlukan untuk koneksi long-lived seperti WebSocket, SSE, atau long-polling."
}, {
"question": "Perintah 'sudo nginx -t' digunakan untuk?",
"options": ["Test koneksi ke upstream server", "Validasi sintaks konfigurasi Nginx sebelum diterapkan, untuk mencegah downtime akibat config error", "Test performa Nginx dengan load test", "Track access log Nginx"],
"correctIndex": 1,
"explanation": "nginx -t memvalidasi semua file konfigurasi tanpa menjalankan Nginx. Selalu jalankan ini sebelum reload/restart agar tidak terjadi downtime karena syntax error."
}]
}
},
{
    "id": 264,
    "category": "Domain 26: Deployment & Production Go",
    "timestamp": "",
    "isDeploy": true,
    "title": "CI/CD Dasar untuk Go dengan GitHub Actions",
    "desc": "Otomasi build, test, dan deploy aplikasi Go menggunakan GitHub Actions workflow — dari push code hingga deploy otomatis ke server.",
    "theoryHtml": "<div class=\"theory-section\">\n            <h3>CI/CD untuk Go App</h3>\n            <p><strong>CI/CD</strong> (Continuous Integration / Continuous Deployment) mengotomasi proses: setiap kali push code ke GitHub, pipeline secara otomatis menjalankan test, build, dan deploy aplikasi.</p>\n\n            <h3>Struktur Direktori GitHub Actions</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Struktur Project</span></div>\n                <pre>my-go-app/\n├── .github/\n│   └── workflows/\n│       ├── ci.yml       ← Test & Build (setiap push/PR)\n│       └── deploy.yml   ← Deploy ke server (saat merge ke main)\n├── main.go\n├── main_test.go\n└── Dockerfile</pre>\n            </div>\n\n            <h3>Workflow CI — Test & Build</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>.github/workflows/ci.yml</span></div>\n                <pre>name: Go CI\n\non:\n  push:\n    branches: [ main, develop ]\n  pull_request:\n    branches: [ main ]\n\njobs:\n  test:\n    name: Test & Build\n    runs-on: ubuntu-latest\n\n    steps:\n    - name: Checkout code\n      uses: actions/checkout@v5\n\n    - name: Setup Go\n      uses: actions/setup-go@v5\n      with:\n        go-version: '1.26'\n        cache: true\n\n    - name: Download dependencies\n      run: go mod download\n\n    - name: Run vet\n      run: go vet ./...\n\n    - name: Run tests\n      run: go test -v -race -coverprofile=coverage.txt ./...\n\n    - name: Upload coverage\n      uses: codecov/codecov-action@v4\n      with:\n        file: ./coverage.txt\n\n    - name: Build binary\n      run: |\n        CGO_ENABLED=0 GOOS=linux go build \\\n          -ldflags=\"-s -w\" \\\n          -o my-app ./...\n      \n    - name: Upload artifact\n      uses: actions/upload-artifact@v4\n      with:\n        name: go-binary\n        path: my-app</pre>\n            </div>\n\n            <h3>Workflow Deploy — SSH ke VPS</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>.github/workflows/deploy.yml</span></div>\n                <pre>name: Deploy to Production\n\non:\n  push:\n    branches: [ main ]\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    needs: test  # Hanya deploy jika CI berhasil\n\n    steps:\n    - uses: actions/checkout@v5\n    - uses: actions/setup-go@v5\n      with:\n        go-version: '1.26'\n    \n    - name: Build\n      run: CGO_ENABLED=0 GOOS=linux go build -ldflags=\"-s -w\" -o my-app .\n\n    - name: Deploy via SSH\n      uses: appleboy/ssh-action@v1\n      with:\n        host: ${{ secrets.SERVER_HOST }}\n        username: ${{ secrets.SERVER_USER }}\n        key: ${{ secrets.SERVER_SSH_KEY }}\n        script: |\n          systemctl stop my-go-app\n          cp /opt/backup/my-app /opt/backup/my-app.prev\n    \n    - name: Upload binary\n      uses: appleboy/scp-action@v1\n      with:\n        host: ${{ secrets.SERVER_HOST }}\n        username: ${{ secrets.SERVER_USER }}\n        key: ${{ secrets.SERVER_SSH_KEY }}\n        source: \"my-app\"\n        target: \"/opt/my-go-app/\"\n    \n    - name: Restart service\n      uses: appleboy/ssh-action@v1\n      with:\n        host: ${{ secrets.SERVER_HOST }}\n        username: ${{ secrets.SERVER_USER }}\n        key: ${{ secrets.SERVER_SSH_KEY }}\n        script: systemctl start my-go-app</pre>\n            </div>\n\n            <div class=\"callout callout-warning\">\n                <div class=\"callout-title\">🔐 GitHub Secrets</div>\n                <p>Simpan credential sensitif (SSH key, server IP) di <strong>GitHub → Settings → Secrets and Variables → Actions</strong>. Jangan pernah hardcode di file workflow!</p>\n            </div>\n        </div>",
    "initialCode": "package main\n\nimport (\n\t\"fmt\"\n\t\"testing\"\n)\n\n// Fungsi yang akan ditest dalam CI/CD pipeline\nfunc add(a, b int) int {\n\treturn a + b\n}\n\nfunc multiply(a, b int) int {\n\treturn a * b\n}\n\n// Test functions (file ini biasanya di main_test.go)\nfunc TestAdd(t *testing.T) {\n\tresult := add(3, 4)\n\tif result != 7 {\n\t\tt.Errorf(\"add(3, 4) = %d, want 7\", result)\n\t}\n}\n\nfunc TestMultiply(t *testing.T) {\n\tcases := []struct {\n\t\ta, b, expected int\n\t}{\n\t\t{2, 3, 6},\n\t\t{0, 5, 0},\n\t\t{-1, 4, -4},\n\t}\n\tfor _, tc := range cases {\n\t\tresult := multiply(tc.a, tc.b)\n\t\tif result != tc.expected {\n\t\t\tt.Errorf(\"multiply(%d, %d) = %d, want %d\",\n\t\t\t\ttc.a, tc.b, result, tc.expected)\n\t\t}\n\t}\n}\n\nfunc main() {\n\tfmt.Println(\"go test ./... menjalankan semua test otomatis\")\n\tfmt.Println(\"CI/CD memastikan kode ter-test setiap push ke GitHub\")\n\tfmt.Println(\"add(10, 20) =\", add(10, 20))\n}",
    "quiz": {
"question": "Dalam GitHub Actions, apa fungsi keyword 'needs: test' dalam job deploy?",
"options": ["Menginstall dependency test terlebih dahulu", "Memastikan job 'deploy' hanya berjalan jika job 'test' berhasil (passed)", "Menjalankan test sebelum deploy secara paralel", "Mendefinisikan test yang dibutuhkan deploy"],
"correctIndex": 1,
"explanation": "'needs' mendefinisikan dependency antar jobs. Job 'deploy' akan di-skip jika job 'test' gagal, mencegah deploy kode yang broken ke production."
},
    "hardQuiz": {
"questions": [{
"question": "Perintah 'go test -race' berfungsi untuk?",
"options": ["Menjalankan test secepat mungkin (race condition test)", "Mendeteksi data race condition dalam kode concurrent Go", "Test performa/benchmark", "Test yang tidak saling bergantung"],
"correctIndex": 1,
"explanation": "-race flag mengaktifkan Go race detector yang mendeteksi akses concurrent ke shared variable tanpa synchronization yang tepat — bug umum di concurrent Go code."
}, {
"question": "Apa yang dimaksud dengan 'cache: true' di actions/setup-go?",
"options": ["Cache hasil build Go", "Cache Go module downloads (folder ~/$GOPATH/pkg/mod) antar workflow run, mempercepat CI", "Cache Go binary di registry", "Aktifkan CDN untuk Go downloads"],
"correctIndex": 1,
"explanation": "cache: true otomatis cache folder Go module cache. Run berikutnya tidak perlu download ulang dependency yang sama, menghemat waktu CI secara signifikan."
}, {
"question": "Perintah 'go vet ./...' dalam CI pipeline bertujuan untuk?",
"options": ["Memformat kode Go", "Analisis static kode Go untuk menemukan bug umum (unreachable code, suspicious constructs) tanpa menjalankan kode", "Verifikasi dependency", "Validasi go.mod file"],
"correctIndex": 1,
"explanation": "go vet melakukan static analysis untuk menemukan masalah umum: mismatched Printf format verbs, unreachable code, dll. Wajib dalam setiap CI pipeline Go."
}, {
"question": "Flag '-coverprofile=coverage.txt' pada go test menghasilkan?",
"options": ["Laporan test dalam format TXT", "File coverage yang berisi informasi baris kode mana yang dieksekusi saat test, untuk mengukur test coverage %", "Profile performa CPU", "File log error test"],
"correctIndex": 1,
"explanation": "-coverprofile menghasilkan data coverage yang bisa divisualisasikan dengan 'go tool cover -html=coverage.txt' atau diupload ke codecov.io."
}, {
"question": "Mengapa best practice menyimpan SSH private key di GitHub Secrets bukan langsung di workflow file?",
"options": ["Karena GitHub Secrets lebih cepat", "Workflow file ada di repository (bisa dilihat semua contributor). Secret ter-enkripsi dan hanya inject saat runtime oleh GitHub Actions secara aman.", "Karena SSH key terlalu panjang untuk YAML", "GitHub tidak mendukung SSH key di workflow file"],
"correctIndex": 1,
"explanation": "Workflow files di-commit ke repo dan bisa dibaca siapapun yang punya akses. GitHub Secrets ter-enkripsi at-rest dan at-transit, tidak pernah tampil di log, hanya accessible oleh workflow."
}]
}
},
{
    "id": 265,
    "category": "Domain 27: Mini Project Go",
    "timestamp": "",
    "isProject": true,
    "title": "Mini Project: REST API CRUD Server",
    "desc": "Bangun REST API CRUD lengkap tanpa framework eksternal menggunakan net/http, encoding/json, dan in-memory store.",
    "theoryHtml": "<div class=\"theory-section\">\n            <h3>Mini Project: REST API CRUD tanpa Framework</h3>\n            <p>Kita akan membangun REST API sederhana dengan fitur Create, Read, Update, Delete (CRUD) menggunakan hanya standard library Go — tanpa Gin, Echo, atau Fiber.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">📋 Spesifikasi API</div>\n                <ul>\n                    <li><code>GET /products</code> — Ambil semua produk</li>\n                    <li><code>GET /products/{id}</code> — Ambil produk by ID</li>\n                    <li><code>POST /products</code> — Buat produk baru</li>\n                    <li><code>PUT /products/{id}</code> — Update produk</li>\n                    <li><code>DELETE /products/{id}</code> — Hapus produk</li>\n                </ul>\n            </div>\n\n            <h3>Struktur Data</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Go — Data Model</span></div>\n                <pre>type Product struct {\n    ID        int       `json:\"id\"`\n    Name      string    `json:\"name\"`\n    Price     float64   `json:\"price\"`\n    Stock     int       `json:\"stock\"`\n    CreatedAt time.Time `json:\"created_at\"`\n}\n\n// In-memory store (production: ganti dengan database)\nvar store = struct {\n    sync.RWMutex\n    products map[int]Product\n    nextID   int\n}{products: make(map[int]Product), nextID: 1}</pre>\n            </div>\n\n            <h3>Teknik JSON Response Helper</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Go</span></div>\n                <pre>func jsonResponse(w http.ResponseWriter, statusCode int, data any) {\n    w.Header().Set(\"Content-Type\", \"application/json\")\n    w.WriteHeader(statusCode)\n    json.NewEncoder(w).Encode(data)\n}\n\nfunc jsonError(w http.ResponseWriter, statusCode int, message string) {\n    jsonResponse(w, statusCode, map[string]string{\"error\": message})\n}</pre>\n            </div>\n\n            <h3>Routing Manual dengan ServeMux</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Go 1.22+ — Enhanced ServeMux</span></div>\n                <pre>mux := http.NewServeMux()\n\n// Go 1.22+: mendukung method prefix dan path parameters\nmux.HandleFunc(\"GET /products\", listProducts)\nmux.HandleFunc(\"GET /products/{id}\", getProduct)\nmux.HandleFunc(\"POST /products\", createProduct)\nmux.HandleFunc(\"PUT /products/{id}\", updateProduct)\nmux.HandleFunc(\"DELETE /products/{id}\", deleteProduct)</pre>\n            </div>\n        </div>",
    "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"net/http\"\n\t\"strconv\"\n\t\"strings\"\n\t\"sync\"\n\t\"time\"\n)\n\n// ── Data Model ──\ntype Product struct {\n\tID        int       `json:\"id\"`\n\tName      string    `json:\"name\"`\n\tPrice     float64   `json:\"price\"`\n\tStock     int       `json:\"stock\"`\n\tCreatedAt time.Time `json:\"created_at\"`\n}\n\n// ── In-Memory Store ──\nvar store = struct {\n\tsync.RWMutex\n\tproducts map[int]Product\n\tnextID   int\n}{products: make(map[int]Product), nextID: 1}\n\n// ── Helper Functions ──\nfunc jsonResponse(w http.ResponseWriter, code int, data any) {\n\tw.Header().Set(\"Content-Type\", \"application/json\")\n\tw.WriteHeader(code)\n\tjson.NewEncoder(w).Encode(data)\n}\n\nfunc getIDFromPath(path string) (int, error) {\n\tparts := strings.Split(strings.Trim(path, \"/\"), \"/\")\n\tif len(parts) < 2 {\n\t\treturn 0, fmt.Errorf(\"no id\")\n\t}\n\treturn strconv.Atoi(parts[len(parts)-1])\n}\n\n// ── Handlers ──\nfunc listProducts(w http.ResponseWriter, r *http.Request) {\n\tstore.RLock()\n\tdefer store.RUnlock()\n\tproducts := make([]Product, 0, len(store.products))\n\tfor _, p := range store.products {\n\t\tproducts = append(products, p)\n\t}\n\tjsonResponse(w, 200, products)\n}\n\nfunc createProduct(w http.ResponseWriter, r *http.Request) {\n\tvar p Product\n\tif err := json.NewDecoder(r.Body).Decode(&p); err != nil {\n\t\tjsonResponse(w, 400, map[string]string{\"error\": \"invalid JSON\"})\n\t\treturn\n\t}\n\tstore.Lock()\n\tdefer store.Unlock()\n\tp.ID = store.nextID\n\tp.CreatedAt = time.Now()\n\tstore.products[p.ID] = p\n\tstore.nextID++\n\tjsonResponse(w, 201, p)\n}\n\nfunc main() {\n\t// Seed data awal\n\tstore.products[1] = Product{ID: 1, Name: \"Laptop Go\", Price: 15000000, Stock: 10, CreatedAt: time.Now()}\n\tstore.products[2] = Product{ID: 2, Name: \"Go Book\", Price: 150000, Stock: 50, CreatedAt: time.Now()}\n\tstore.nextID = 3\n\n\tmux := http.NewServeMux()\n\tmux.HandleFunc(\"/products\", func(w http.ResponseWriter, r *http.Request) {\n\t\tswitch r.Method {\n\t\tcase \"GET\":\n\t\t\tlistProducts(w, r)\n\t\tcase \"POST\":\n\t\t\tcreateProduct(w, r)\n\t\tdefault:\n\t\t\tjsonResponse(w, 405, map[string]string{\"error\": \"method not allowed\"})\n\t\t}\n\t})\n\n\tfmt.Println(\"REST API Server berjalan di :8080\")\n\tfmt.Println(\"GET  /products         → list semua produk\")\n\tfmt.Println(\"POST /products         → buat produk baru\")\n\thttp.ListenAndServe(\":8080\", mux)\n}",
    "quiz": {
"question": "Mengapa digunakan sync.RWMutex pada in-memory store Go REST API?",
"options": ["Agar data bisa diakses dari goroutine yang berbeda", "RWMutex mengizinkan banyak goroutine membaca bersamaan (RLock), tapi hanya satu goroutine yang bisa menulis (Lock) — mencegah data race", "Agar response lebih cepat", "sync.RWMutex dibutuhkan untuk JSON encoding"],
"correctIndex": 1,
"explanation": "HTTP server Go menangani setiap request di goroutine terpisah. Tanpa mutex, akses concurrent ke map shared bisa menyebabkan data race/panic."
},
    "hardQuiz": {
"questions": [{
"question": "Apa perbedaan json.NewEncoder(w).Encode(data) vs json.Marshal(data) dalam HTTP handler?",
"options": ["Tidak ada perbedaan hasil", "NewEncoder langsung streaming ke ResponseWriter tanpa alokasi buffer sementara — lebih efisien memory untuk response besar", "Marshal menghasilkan JSON yang lebih compact", "Encoder hanya untuk struct, Marshal untuk semua tipe"],
"correctIndex": 1,
"explanation": "json.Encoder menulis langsung ke io.Writer (ResponseWriter) secara streaming. json.Marshal mengalokasikan []byte di memori dulu baru ditulis — lebih boros untuk response besar."
}, {
"question": "Status code HTTP yang benar untuk response 'resource berhasil dibuat' adalah?",
"options": ["200 OK", "201 Created", "202 Accepted", "204 No Content"],
"correctIndex": 1,
"explanation": "201 Created adalah status code yang tepat untuk POST request yang berhasil membuat resource baru. 200 untuk read/update berhasil, 204 untuk delete tanpa body."
}, {
"question": "Mengapa penting untuk set 'Content-Type: application/json' header sebelum WriteHeader()?",
"options": ["Tidak ada alasan khusus", "HTTP headers harus dikirim sebelum body. Setelah WriteHeader() dipanggil, headers tidak bisa diubah lagi", "Content-Type tidak penting untuk JSON", "WriteHeader() otomatis set Content-Type"],
"correctIndex": 1,
"explanation": "Dalam HTTP, headers dikirim sebelum body. Go's ResponseWriter: setelah WriteHeader() atau Write() pertama dipanggil, headers ter-flush dan tidak bisa dimodifikasi."
}, {
"question": "Untuk production API, mengapa in-memory map (var store) tidak ideal?",
"options": ["Map di Go terlalu lambat", "Data hilang saat server restart/crash, tidak bisa di-scale horizontal (multiple instances), tidak thread-safe tanpa mutex eksplisit", "Map tidak mendukung nested struct", "In-memory store tidak aman dari injection"],
"correctIndex": 1,
"explanation": "In-memory store: data tidak persistent, tidak bisa di-share antar multiple instance server (scaling), dan membutuhkan explicit locking. Production butuh database (PostgreSQL, MySQL, MongoDB)."
}, {
"question": "Apa kegunaan metode 'defer store.RUnlock()' tepat setelah 'store.RLock()'?",
"options": ["Defer dijalankan saat program exit", "Memastikan RUnlock selalu dipanggil saat fungsi return (termasuk early return), mencegah deadlock permanen", "RUnlock dijalankan secara asinkron", "Hanya sintaks gaya penulisan, tidak ada efek nyata"],
"correctIndex": 1,
"explanation": "Tanpa defer, jika fungsi memiliki early return (misal error), RUnlock mungkin tidak dipanggil → deadlock. Defer menjamin cleanup selalu terjadi."
}]
}
},
{
    "id": 266,
    "category": "Domain 27: Mini Project Go",
    "timestamp": "",
    "isProject": true,
    "title": "Mini Project: CLI Tool dengan Flag & Args",
    "desc": "Buat CLI tool interaktif menggunakan package flag, os.Args, bufio, dan os — lengkap dengan subcommand dan help text.",
    "theoryHtml": "<div class=\"theory-section\">\n            <h3>Mini Project: CLI Tool Go</h3>\n            <p>Go sangat cocok untuk membuat Command Line Interface (CLI) tool karena menghasilkan single binary tanpa dependency eksternal. Kita akan membuat tool manajemen catatan sederhana.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">📋 Fitur CLI Tool</div>\n                <ul>\n                    <li><code>mynote add \"Isi catatan\"</code> — Tambah catatan baru</li>\n                    <li><code>mynote list</code> — Tampilkan semua catatan</li>\n                    <li><code>mynote delete 3</code> — Hapus catatan ke-3</li>\n                    <li><code>mynote --help</code> — Tampilkan bantuan</li>\n                    <li><code>mynote --version</code> — Tampilkan versi</li>\n                </ul>\n            </div>\n\n            <h3>Package flag — Parsing Arguments</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Go — flag package</span></div>\n                <pre>import \"flag\"\n\n// Definisikan flags\nversion := flag.Bool(\"version\", false, \"Tampilkan versi aplikasi\")\noutput  := flag.String(\"output\", \"text\", \"Format output (text/json)\")\nlimit   := flag.Int(\"limit\", 10, \"Jumlah item yang ditampilkan\")\n\n// Parse semua flags\nflag.Parse()\n\n// Argumen yang tersisa setelah flags\nargs := flag.Args() // []string\nsubcommand := args[0] // \"add\", \"list\", \"delete\"</pre>\n            </div>\n\n            <h3>Menyimpan Data ke File JSON</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Go — Persist data ke file</span></div>\n                <pre>import (\n    \"encoding/json\"\n    \"os\"\n)\n\ntype Note struct {\n    ID        int       `json:\"id\"`\n    Content   string    `json:\"content\"`\n    CreatedAt time.Time `json:\"created_at\"`\n}\n\nfunc loadNotes(filename string) []Note {\n    data, err := os.ReadFile(filename)\n    if err != nil {\n        return []Note{} // File belum ada\n    }\n    var notes []Note\n    json.Unmarshal(data, &notes)\n    return notes\n}\n\nfunc saveNotes(filename string, notes []Note) error {\n    data, _ := json.MarshalIndent(notes, \"\", \"  \")\n    return os.WriteFile(filename, data, 0644)\n}</pre>\n            </div>\n        </div>",
    "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"flag\"\n\t\"fmt\"\n\t\"os\"\n\t\"strconv\"\n\t\"time\"\n)\n\nconst (\n\tVersion   = \"1.0.0\"\n\tDataFile  = \"notes.json\"\n)\n\ntype Note struct {\n\tID        int       `json:\"id\"`\n\tContent   string    `json:\"content\"`\n\tCreatedAt time.Time `json:\"created_at\"`\n}\n\nfunc loadNotes() []Note {\n\tdata, err := os.ReadFile(DataFile)\n\tif err != nil {\n\t\treturn []Note{}\n\t}\n\tvar notes []Note\n\tjson.Unmarshal(data, &notes)\n\treturn notes\n}\n\nfunc saveNotes(notes []Note) {\n\tdata, _ := json.MarshalIndent(notes, \"\", \"  \")\n\tos.WriteFile(DataFile, data, 0644)\n}\n\nfunc addNote(content string) {\n\tnotes := loadNotes()\n\tnextID := 1\n\tif len(notes) > 0 {\n\t\tnextID = notes[len(notes)-1].ID + 1\n\t}\n\tnotes = append(notes, Note{\n\t\tID: nextID, Content: content, CreatedAt: time.Now(),\n\t})\n\tsaveNotes(notes)\n\tfmt.Printf(\"✅ Catatan #%d ditambahkan!\\n\", nextID)\n}\n\nfunc listNotes() {\n\tnotes := loadNotes()\n\tif len(notes) == 0 {\n\t\tfmt.Println(\"📭 Belum ada catatan.\")\n\t\treturn\n\t}\n\tfmt.Printf(\"📋 Total %d catatan:\\n\\n\", len(notes))\n\tfor _, n := range notes {\n\t\tfmt.Printf(\"[%d] %s\\n    📅 %s\\n\\n\",\n\t\t\tn.ID, n.Content, n.CreatedAt.Format(\"2006-01-02 15:04\"))\n\t}\n}\n\nfunc deleteNote(id int) {\n\tnotes := loadNotes()\n\tnewNotes := make([]Note, 0)\n\tdeleted := false\n\tfor _, n := range notes {\n\t\tif n.ID != id {\n\t\t\tnewNotes = append(newNotes, n)\n\t\t} else {\n\t\t\tdeleted = true\n\t\t}\n\t}\n\tif deleted {\n\t\tsaveNotes(newNotes)\n\t\tfmt.Printf(\"🗑️ Catatan #%d dihapus!\\n\", id)\n\t} else {\n\t\tfmt.Printf(\"❌ Catatan #%d tidak ditemukan.\\n\", id)\n\t}\n}\n\nfunc main() {\n\tversionFlag := flag.Bool(\"version\", false, \"Tampilkan versi\")\n\tflag.Usage = func() {\n\t\tfmt.Fprintf(os.Stderr, `MyNote CLI v%s - Manajemen Catatan Go\n\nUsage: mynote <command> [arguments]\n\nCommands:\n  add <catatan>   Tambah catatan baru\n  list            Tampilkan semua catatan\n  delete <id>     Hapus catatan berdasarkan ID\n\nFlags:\n`, Version)\n\t\tflag.PrintDefaults()\n\t}\n\tflag.Parse()\n\n\tif *versionFlag {\n\t\tfmt.Println(\"MyNote CLI v\" + Version)\n\t\treturn\n\t}\n\n\targs := flag.Args()\n\tif len(args) == 0 {\n\t\tflag.Usage()\n\t\treturn\n\t}\n\n\tswitch args[0] {\n\tcase \"add\":\n\t\tif len(args) < 2 {\n\t\t\tfmt.Println(\"❌ Gunakan: mynote add <isi catatan>\")\n\t\t\treturn\n\t\t}\n\t\taddNote(args[1])\n\tcase \"list\":\n\t\tlistNotes()\n\tcase \"delete\":\n\t\tif len(args) < 2 {\n\t\t\tfmt.Println(\"❌ Gunakan: mynote delete <id>\")\n\t\t\treturn\n\t\t}\n\t\tid, err := strconv.Atoi(args[1])\n\t\tif err != nil {\n\t\t\tfmt.Println(\"❌ ID harus berupa angka\")\n\t\t\treturn\n\t\t}\n\t\tdeleteNote(id)\n\tdefault:\n\t\tfmt.Printf(\"❌ Perintah tidak dikenal: %s\\n\", args[0])\n\t\tflag.Usage()\n\t}\n}",
    "quiz": {
"question": "Apa yang dikembalikan oleh 'flag.Args()' setelah 'flag.Parse()' dijalankan?",
"options": ["Semua argumen termasuk flags", "Argumen yang tersisa SETELAH semua flags di-parse — yaitu subcommand dan argumen non-flag", "Hanya nilai dari flags yang didefinisikan", "Array kosong jika tidak ada error"],
"correctIndex": 1,
"explanation": "flag.Args() mengembalikan slice string dari argumen yang bukan flag (non-flag arguments) setelah flag.Parse(). Inilah cara mendapatkan subcommand dan argumen positional."
},
    "hardQuiz": {
"questions": [{
"question": "Mengapa binary Go lebih ideal untuk distribusi CLI tool dibanding Python script?",
"options": ["Go lebih mudah ditulis dari Python", "Binary Go self-contained (tidak perlu install Go runtime di target), single file, startup sangat cepat vs Python yang butuh interpreter", "Go menghasilkan binary yang lebih kecil dari Python", "Python tidak bisa membuat CLI tool"],
"correctIndex": 1,
"explanation": "Distribusi Go CLI: copy satu binary ke target machine. Python butuh: install Python + semua dependencies. Ini membuat Go jauh lebih praktis untuk CLI distribution."
}, {
"question": "Fungsi 'flag.Usage' digunakan untuk?",
"options": ["Mendapatkan list semua flags yang tersedia", "Override pesan bantuan default yang ditampilkan saat --help atau error parsing flag", "Validasi semua flags sebelum parse", "Log penggunaan flags ke file"],
"correctIndex": 1,
"explanation": "flag.Usage adalah fungsi yang dipanggil saat terjadi error parsing atau flag -help/-h. Dengan menggantinya, kita bisa customize pesan help dengan format yang lebih informatif."
}, {
"question": "Permission '0644' dalam os.WriteFile(filename, data, 0644) berarti?",
"options": ["File hanya bisa dibaca owner", "Owner bisa baca-tulis (6), group bisa baca (4), others bisa baca (4) — format octal Unix permission", "File terproteksi dari penghapusan", "File di-encrypt dengan kunci 644-bit"],
"correctIndex": 1,
"explanation": "0644 adalah octal Unix permission: 6 (rw-) untuk owner, 4 (r--) untuk group, 4 (r--) untuk others. Standar untuk file data yang tidak perlu executable."
}, {
"question": "Saat menggunakan FlagSet terpisah untuk setiap subcommand, keuntungannya adalah?",
"options": ["Lebih cepat dari flag package default", "Setiap subcommand bisa memiliki flags sendiri yang tidak konflik dengan subcommand lain, memungkinkan CLI yang lebih kaya", "FlagSet bisa di-serialize ke JSON", "Tidak ada keuntungan nyata"],
"correctIndex": 1,
"explanation": "flag.NewFlagSet() memungkinkan pembuatan flag set terpisah per subcommand. Misal: 'app add --priority high' dan 'app list --sort date' — flags tidak saling konflik."
}, {
"question": "Untuk membaca input interaktif dari user di terminal (tanpa argumen), package apa yang tepat?",
"options": ["fmt.Scan()", "bufio.NewReader(os.Stdin) untuk membaca line-by-line, atau fmt.Scan()/fmt.Scanln() untuk input sederhana", "os.Stdin.Read() langsung", "input.ReadString() dari package input"],
"correctIndex": 1,
"explanation": "bufio.NewReader(os.Stdin) + ReadString('\\n') adalah cara terbaik untuk baca input user dengan baris panjang. fmt.Scan() lebih simple tapi terbatas untuk whitespace-separated input."
}]
}
},
{
    "id": 267,
    "category": "Domain 27: Mini Project Go",
    "timestamp": "",
    "isProject": true,
    "title": "Mini Project: Simple File-based Task Manager",
    "desc": "Bangun task manager sederhana berbasis JSON file dengan operasi CRUD, status tracking, dan filter — menggunakan konsep OOP Go dengan struct dan methods.",
    "theoryHtml": "<div class=\"theory-section\">\n            <h3>Mini Project: Task Manager Go</h3>\n            <p>Project ini menggabungkan berbagai konsep Go yang sudah dipelajari: struct, methods, interfaces, JSON serialization, error handling, dan file I/O.</p>\n\n            <div class=\"callout callout-info\">\n                <div class=\"callout-title\">🎯 Konsep yang Dipraktikkan</div>\n                <ul>\n                    <li>✅ Struct dengan methods (OOP style Go)</li>\n                    <li>✅ JSON encode/decode untuk persistensi data</li>\n                    <li>✅ Error handling idiomatik Go</li>\n                    <li>✅ Slice filtering dan sorting</li>\n                    <li>✅ Interface untuk extensibility</li>\n                    <li>✅ Goroutine untuk background auto-save</li>\n                </ul>\n            </div>\n\n            <h3>Arsitektur Task Manager</h3>\n            <div class=\"code-box\">\n                <div class=\"code-box-header\"><span>Go — Struktur Data</span></div>\n                <pre>type Priority string\nconst (\n    Low    Priority = \"low\"\n    Medium Priority = \"medium\"\n    High   Priority = \"high\"\n)\n\ntype Task struct {\n    ID          int       `json:\"id\"`\n    Title       string    `json:\"title\"`\n    Description string    `json:\"description\"`\n    Priority    Priority  `json:\"priority\"`\n    Done        bool      `json:\"done\"`\n    DueDate     time.Time `json:\"due_date\"`\n    CreatedAt   time.Time `json:\"created_at\"`\n}\n\n// TaskManager sebagai type dengan methods\ntype TaskManager struct {\n    tasks    []Task\n    filePath string\n    mu       sync.Mutex\n}\n\n// Interface untuk filtering\ntype TaskFilter interface {\n    Filter(tasks []Task) []Task\n}\n\n// Filter implementations\ntype DoneFilter struct{}\ntype PriorityFilter struct { P Priority }\n\nfunc (f DoneFilter) Filter(tasks []Task) []Task { ... }\nfunc (f PriorityFilter) Filter(tasks []Task) []Task { ... }</pre>\n            </div>\n        </div>",
    "initialCode": "package main\n\nimport (\n\t\"encoding/json\"\n\t\"fmt\"\n\t\"os\"\n\t\"sort\"\n\t\"time\"\n)\n\ntype Priority string\n\nconst (\n\tLow    Priority = \"low\"\n\tMedium Priority = \"medium\"\n\tHigh   Priority = \"high\"\n)\n\ntype Task struct {\n\tID        int       `json:\"id\"`\n\tTitle     string    `json:\"title\"`\n\tPriority  Priority  `json:\"priority\"`\n\tDone      bool      `json:\"done\"`\n\tCreatedAt time.Time `json:\"created_at\"`\n}\n\ntype TaskManager struct {\n\tTasks    []Task `json:\"tasks\"`\n\tNextID   int    `json:\"next_id\"`\n\tfilePath string\n}\n\nfunc NewTaskManager(filePath string) *TaskManager {\n\ttm := &TaskManager{filePath: filePath, NextID: 1}\n\ttm.load()\n\treturn tm\n}\n\nfunc (tm *TaskManager) load() {\n\tdata, err := os.ReadFile(tm.filePath)\n\tif err != nil {\n\t\treturn\n\t}\n\tjson.Unmarshal(data, tm)\n}\n\nfunc (tm *TaskManager) save() error {\n\tdata, err := json.MarshalIndent(tm, \"\", \"  \")\n\tif err != nil {\n\t\treturn err\n\t}\n\treturn os.WriteFile(tm.filePath, data, 0644)\n}\n\nfunc (tm *TaskManager) Add(title string, priority Priority) Task {\n\ttask := Task{\n\t\tID: tm.NextID, Title: title,\n\t\tPriority: priority, CreatedAt: time.Now(),\n\t}\n\ttm.Tasks = append(tm.Tasks, task)\n\ttm.NextID++\n\ttm.save()\n\treturn task\n}\n\nfunc (tm *TaskManager) Complete(id int) bool {\n\tfor i, t := range tm.Tasks {\n\t\tif t.ID == id {\n\t\t\ttm.Tasks[i].Done = true\n\t\t\ttm.save()\n\t\t\treturn true\n\t\t}\n\t}\n\treturn false\n}\n\nfunc (tm *TaskManager) FilterByPriority(p Priority) []Task {\n\tvar result []Task\n\tfor _, t := range tm.Tasks {\n\t\tif t.Priority == p {\n\t\t\tresult = append(result, t)\n\t\t}\n\t}\n\treturn result\n}\n\nfunc (tm *TaskManager) SortedByPriority() []Task {\n\tcopy := make([]Task, len(tm.Tasks))\n\tfor i, t := range tm.Tasks {\n\t\tcopy[i] = t\n\t}\n\tpriOrder := map[Priority]int{High: 0, Medium: 1, Low: 2}\n\tsort.Slice(copy, func(i, j int) bool {\n\t\treturn priOrder[copy[i].Priority] < priOrder[copy[j].Priority]\n\t})\n\treturn copy\n}\n\nfunc (tm *TaskManager) Stats() (total, done, pending int) {\n\ttotal = len(tm.Tasks)\n\tfor _, t := range tm.Tasks {\n\t\tif t.Done {\n\t\t\tdone++\n\t\t} else {\n\t\t\tpending++\n\t\t}\n\t}\n\treturn\n}\n\nfunc printTask(t Task) {\n\tstatus := \"⬜\"\n\tif t.Done {\n\t\tstatus = \"✅\"\n\t}\n\tpriEmoji := map[Priority]string{High: \"🔴\", Medium: \"🟡\", Low: \"🟢\"}\n\tfmt.Printf(\"%s [%d] %s %s\\n\", status, t.ID, priEmoji[t.Priority], t.Title)\n}\n\nfunc main() {\n\tfmt.Println(\"=== Go Task Manager ===\\n\")\n\n\ttm := NewTaskManager(\"tasks.json\")\n\n\t// Demo: Tambah tasks\n\tt1 := tm.Add(\"Setup CI/CD Pipeline\", High)\n\tt2 := tm.Add(\"Tulis unit tests\", Medium)\n\tt3 := tm.Add(\"Update dokumentasi README\", Low)\n\ttm.Add(\"Deploy ke production server\", High)\n\ttm.Add(\"Review pull requests\", Medium)\n\n\t// Complete salah satu\n\ttm.Complete(t1.ID)\n\ttm.Complete(t2.ID)\n\n\t_ = t3 // suppress unused\n\n\t// Tampilkan sorted\n\tfmt.Println(\"📋 Semua Task (sorted by priority):\")\n\tfor _, t := range tm.SortedByPriority() {\n\t\tprintTask(t)\n\t}\n\n\t// Stats\n\ttotal, done, pending := tm.Stats()\n\tfmt.Printf(\"\\n📊 Stats: %d total | %d selesai | %d pending\\n\", total, done, pending)\n\n\t// Filter high priority yang belum selesai\n\tfmt.Println(\"\\n🔴 High Priority (pending):\")\n\tfor _, t := range tm.FilterByPriority(High) {\n\t\tif !t.Done {\n\t\t\tprintTask(t)\n\t\t}\n\t}\n}",
    "quiz": {
"question": "Mengapa TaskManager menggunakan receiver pointer '(tm *TaskManager)' di semua methodnya?",
"options": ["Karena pointer wajib untuk struct yang besar", "Agar method bisa memodifikasi field TaskManager asli (bukan copy-nya) — terutama untuk tm.Tasks dan tm.NextID", "Pointer receiver lebih cepat dari value receiver", "Hanya gaya penulisan, tidak ada perbedaan"],
"correctIndex": 1,
"explanation": "Pointer receiver memungkinkan method memodifikasi struct asli. Jika menggunakan value receiver, semua perubahan pada tm.Tasks, tm.NextID hanya berlaku pada copy — tidak persistDISK BISA."
},
    "hardQuiz": {
"questions": [{
"question": "Fungsi sort.Slice() di Go menggunakan algoritma apa dan apakah stable?",
"options": ["Bubble sort, tidak stable", "Pattern-defeating quicksort (pdqsort), tidak guaranteed stable — gunakan sort.SliceStable() untuk stable sort", "Merge sort, selalu stable", "Heap sort, semi-stable"],
"correctIndex": 1,
"explanation": "sort.Slice() menggunakan pdqsort yang tidak stable (elemen sama urutan relatifnya bisa berubah). Gunakan sort.SliceStable() jika stabilitas urutan elemen sama penting."
}, {
"question": "Dalam JSON struct tag `json:\"title\"`, apa yang terjadi jika field Title memiliki nilai zero-value (string kosong)?",
"options": ["Field selalu disertakan dalam JSON output", "Field tetap disertakan sebagai empty string, kecuali ditambahkan ',omitempty' tag", "Field otomatis di-skip", "JSON encoding akan error"],
"correctIndex": 1,
"explanation": "Tanpa omitempty, field dengan zero value (\"\" untuk string, 0 untuk int, false untuk bool) tetap di-serialisasi. Tambahkan `json:\"title,omitempty\"` untuk skip jika zero value."
}, {
"question": "Pattern 'copy := make([]Task, len(tm.Tasks))' sebelum sort.Slice bertujuan untuk?",
"options": ["Membuat backup otomatis", "Membuat shallow copy slice agar sort tidak memodifikasi slice original tm.Tasks", "Sort membutuhkan slice yang pre-allocated", "Mengoptimalkan alokasi memori"],
"correctIndex": 1,
"explanation": "sort.Slice() mengubah urutan elemen di-place. Dengan copy terlebih dahulu, data original tm.Tasks tidak berubah — method SortedByPriority() bersifat non-destructive."
}, {
"question": "Bagaimana cara yang idiomatic untuk handle error di Go saat file tidak ditemukan?",
"options": ["try-catch seperti Java", "Cek os.IsNotExist(err) untuk membedakan 'file not found' dari error I/O lainnya, lalu handle sesuai kebutuhan", "Gunakan panic() dan recover()", "Abaikan error dengan _ = err"],
"correctIndex": 1,
"explanation": "Go idiom: errors.Is(err, os.ErrNotExist) atau os.IsNotExist(err) untuk membedakan file not found. Ini memungkinkan inisialisasi fresh state tanpa menganggap semua error sebagai fatal."
}, {
"question": "Apa keuntungan mendefinisikan 'type Priority string' dibanding menggunakan string langsung?",
"options": ["Priority string lebih cepat dari string biasa", "Type safety: compiler mencegah penggunaan sembarang string sebagai Priority, kode lebih ekspresif dan dokumentasi lebih jelas", "Priority string bisa di-compare dengan ==", "Mengurangi penggunaan memori"],
"correctIndex": 1,
"explanation": "Custom type memberikan semantic meaning dan type safety. Fungsi yang menerima Priority tidak bisa dipanggil dengan sembarang string tanpa explicit conversion, mencegah bug logika."
}]
}
}
];

// ══════════════════════════════════════════════════════════════════════
// APPLICATION STATE & UI ENGINE
// ══════════════════════════════════════════════════════════════════════

let currentChapterIndex = 0;
let progressState = JSON.parse(localStorage.getItem("golang_tutorial_progress") || "[]");
let editorInstance = null;
let examTimerInterval = null;
let examTimeLeft = 30 * 60;
let examAnswers = {};
let currentExamQuestion = 0;

// Handle ?reset=true URL param
(function() {
    if (window.location.search.indexOf('reset=true') !== -1) {
        localStorage.removeItem("golang_tutorial_progress");
        progressState = [];
        window.history.replaceState({}, document.title, window.location.pathname);
    }
})();

document.addEventListener("DOMContentLoaded", () => {
    // Tiap langkah dijalankan terpisah. Sebelumnya satu galat — misalnya dari
    // editor pihak ketiga di dalam loadChapter — membatalkan langkah sesudahnya,
    // sehingga pencarian dan bilah progres ikut mati tanpa pesan apa pun.
    const langkah = [
        ["editor", initEditor],
        ["sidebar", renderSidebar],
        ["materi", () => loadChapter(0)],
        ["progres", updateProgressUI],
        ["interaksi", setupEventListeners]
    ];
    for (const [nama, jalankan] of langkah) {
        try { jalankan(); }
        catch (e) { console.warn("Gagal menyiapkan " + nama + ":", e); }
    }
});

function initEditor() {
    const textarea = document.getElementById("codeEditor");
    if (!textarea) return;

    // CodeMirror bisa gagal dimuat (berkas vendor hilang, dibuka lewat sandbox
    // yang memblokir skrip). Tanpa penjaga ini, galat di sini membatalkan
    // seluruh DOMContentLoaded sehingga sidebar dan materi ikut tidak tampil.
    if (typeof CodeMirror === "undefined") {
        editorInstance = editorCadangan(textarea);
        return;
    }
    try {
        editorInstance = CodeMirror.fromTextArea(textarea, {
            mode: "go", theme: "dracula", lineNumbers: true,
            indentUnit: 4, tabSize: 4, indentWithTabs: true,
            lineWrapping: true, autoCloseBrackets: true
        });
    } catch (e) {
        console.warn("CodeMirror gagal dimuat, memakai editor cadangan:", e);
        editorInstance = editorCadangan(textarea);
    }
}

// Pengganti minimal CodeMirror. Hanya menyediakan antarmuka yang benar-benar
// dipakai halaman ini — getValue, setValue, refresh, focus — sehingga tombol
// jalankan, salin, dan atur ulang kode tetap berfungsi tanpa penyorotan sintaks.
function editorCadangan(textarea) {
    textarea.spellcheck = false;
    textarea.style.cssText += "display:block;width:100%;min-height:300px;" +
        "font-family:'JetBrains Mono',ui-monospace,Menlo,Consolas,monospace;" +
        "font-size:14px;line-height:1.6;tab-size:4;white-space:pre;overflow:auto;";
    textarea.addEventListener("keydown", function (e) {
        if (e.key !== "Tab") return;
        e.preventDefault();
        const a = textarea.selectionStart, b = textarea.selectionEnd;
        textarea.value = textarea.value.slice(0, a) + "\t" + textarea.value.slice(b);
        textarea.selectionStart = textarea.selectionEnd = a + 1;
    });
    return {
        getValue: function () { return textarea.value; },
        setValue: function (v) { textarea.value = v; },
        refresh: function () {},
        focus: function () { textarea.focus(); }
    };
}

// ── GLOBAL RESET PROGRESS (accessible from inline onclick) ──
window.resetAllProgress = function() {
    if (confirm("Yakin ingin mereset seluruh progres belajar ke 0%?\nSemua tanda selesai akan dihapus.")) {
        progressState = [];
        localStorage.removeItem("golang_tutorial_progress");
        localStorage.setItem("golang_tutorial_progress", "[]");
        updateProgressUI();
        renderSidebar();
        loadChapter(currentChapterIndex);
    }
};

function renderSidebar(filterText) {
    filterText = filterText || "";
    const container = document.getElementById("chapterListContainer");
    if (!container) return;
    container.innerHTML = "";
    let currentCat = "";

    chapters.forEach(function(chap, idx) {
        if (filterText && chap.title.toLowerCase().indexOf(filterText.toLowerCase()) === -1
            && chap.desc.toLowerCase().indexOf(filterText.toLowerCase()) === -1
            && chap.category.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
            return;
        }
        if (chap.category !== currentCat) {
            currentCat = chap.category;
            var catHeader = document.createElement("div");
            catHeader.className = "section-title";
            var catLow = currentCat.toLowerCase();
            if (catLow.indexOf("deploy") !== -1 || catLow.indexOf("produksi") !== -1) {
                catHeader.classList.add("deploy-domain");
            } else if (catLow.indexOf("proyek") !== -1 || catLow.indexOf("project") !== -1 || catLow.indexOf("mini") !== -1) {
                catHeader.classList.add("project-domain");
            } else if (catLow.indexOf("ujian") !== -1 || catLow.indexOf("exam") !== -1) {
                catHeader.classList.add("exam-domain");
            }
            catHeader.textContent = currentCat;
            container.appendChild(catHeader);
        }
        var isCompleted = progressState.indexOf(chap.id) !== -1;
        var isActive = idx === currentChapterIndex;
        var item = document.createElement("div");
        item.className = "chapter-item" + (isActive ? " active" : "") + (isCompleted ? " completed" : "");
        item.setAttribute("data-index", idx);
        item.onclick = function() { loadChapter(idx); };
        var numStr = chap.id < 10 ? "0" + chap.id : "" + chap.id;
        var typeIcon = chap.isProject ? ' <span class="chapter-type-icon">🛠</span>'
                     : chap.isDeploy ? ' <span class="chapter-type-icon">🚀</span>' : '';
        item.innerHTML = '<div class="chapter-info"><span class="chapter-num">' + numStr +
            '</span><span class="chapter-title-text">' + chap.title + typeIcon + '</span></div><div class="chapter-status"></div>';
        container.appendChild(item);
    });

    var badge = document.getElementById("chapterCountSidebar");
    if (badge) badge.textContent = chapters.length + " Bab";
}

function loadChapter(index) {
    if (index < 0 || index >= chapters.length) return;
    currentChapterIndex = index;
    var chap = chapters[index];
    var numStr = chap.id < 10 ? "0" + chap.id : "" + chap.id;

    var el;
    el = document.getElementById("chapterCategoryBadge");
    if (el) {
        el.textContent = chap.category;
        el.className = "badge";
        if (chap.isDeploy) el.classList.add("badge-deploy");
        else if (chap.isProject) el.classList.add("badge-project");
    }
    el = document.getElementById("videoTimestamp");
    // This course has no embedded video, so a timestamp would point nowhere.
    if (el) el.style.display = "none";
    el = document.getElementById("timestampText"); if (el) el.textContent = chap.timestamp || "—";
    el = document.getElementById("chapterTitle"); if (el) el.textContent = numStr + ". " + chap.title;
    el = document.getElementById("chapterDesc"); if (el) el.textContent = chap.desc;
    el = document.getElementById("theoryBody"); if (el) el.innerHTML = chap.theoryHtml;

    addCopySnippetButtons();

    if (editorInstance) {
        editorInstance.setValue((chap.initialCode || "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Hello, Go!\")\n}").trim());
        setTimeout(function() { editorInstance.refresh(); }, 100);
    }

    el = document.getElementById("consoleOutput");
    if (el) { el.className = "console-output"; el.textContent = "// Tekan 'Jalankan Kode' untuk mengeksekusi program Go."; }
    el = document.getElementById("consoleStatus");
    if (el) el.innerHTML = '<span>\uD83D\uDFE2 Ready</span>';

    renderQuiz(chap.quiz);
    renderHardQuiz(chap.hardQuiz);

    var markBtn = document.getElementById("markCompletedBtn");
    if (markBtn) {
        if (progressState.indexOf(chap.id) !== -1) {
            markBtn.textContent = "\u2713 Selesai (Batalkan)";
            markBtn.classList.remove("btn-primary"); markBtn.classList.add("btn-secondary");
        } else {
            markBtn.textContent = "\u2713 Tandai Selesai";
            markBtn.classList.remove("btn-secondary"); markBtn.classList.add("btn-primary");
        }
    }

    var prevBtn = document.getElementById("prevChapterBtn");
    var nextBtn = document.getElementById("nextChapterBtn");
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === chapters.length - 1;

    document.querySelectorAll(".tab-btn").forEach(function(b) { b.classList.remove("active"); });
    document.querySelectorAll(".tab-content").forEach(function(c) { c.classList.remove("active"); });
    var theoryBtn = document.querySelector('.tab-btn[data-tab="theory"]');
    if (theoryBtn) theoryBtn.classList.add("active");
    var theoryTab = document.getElementById("tab-theory");
    if (theoryTab) theoryTab.classList.add("active");

    var searchEl = document.getElementById("searchInput");
    renderSidebar(searchEl ? searchEl.value : "");

    var mainContent = document.querySelector(".main-content");
    if (mainContent) mainContent.scrollTop = 0;
}

function addCopySnippetButtons() {
    document.querySelectorAll(".code-box").forEach(function(box) {
        var header = box.querySelector(".code-box-header");
        if (!header || header.querySelector(".copy-snippet-btn")) return;
        var btn = document.createElement("button");
        btn.className = "copy-snippet-btn";
        btn.textContent = "\uD83D\uDCCB Salin";
        btn.onclick = function() {
            var pre = box.querySelector("pre");
            if (pre) {
                navigator.clipboard.writeText(pre.innerText).then(function() {
                    btn.textContent = "\u2705 Disalin!";
                    setTimeout(function() { btn.textContent = "\uD83D\uDCCB Salin"; }, 1500);
                });
            }
        };
        header.appendChild(btn);
    });
}

function renderQuiz(quiz) {
    var quizContainer = document.getElementById("quizBody");
    if (!quizContainer) return;
    if (!quiz) {
        quizContainer.innerHTML = '<div class="callout callout-info"><div class="callout-title">\u2139\uFE0F Info</div><p>Tidak ada kuis untuk bab ini.</p></div>';
        return;
    }
    var optionsHtml = "";
    for (var i = 0; i < quiz.options.length; i++) {
        optionsHtml += '<div class="quiz-option" onclick="checkQuizAnswer(' + i + ')">' +
            '<div class="quiz-option-radio"></div><span>' + quiz.options[i] + '</span></div>';
    }
    quizContainer.innerHTML = '<div class="quiz-question">\u2753 ' + quiz.question + '</div>' +
        '<div class="quiz-options" id="quizOptions">' + optionsHtml + '</div>' +
        '<div class="quiz-feedback" id="quizFeedback"></div>';
}

window.checkQuizAnswer = function(selectedIndex) {
    var chap = chapters[currentChapterIndex];
    var quiz = chap.quiz;
    var options = document.querySelectorAll(".quiz-option");
    var feedback = document.getElementById("quizFeedback");
    for (var i = 0; i < options.length; i++) {
        options[i].classList.remove("selected", "correct", "incorrect");
        if (i === selectedIndex) { options[i].classList.add("selected"); options[i].classList.add(i === quiz.correctIndex ? "correct" : "incorrect"); }
        if (i === quiz.correctIndex) options[i].classList.add("correct");
    }
    if (feedback) {
        feedback.style.display = "block";
        if (selectedIndex === quiz.correctIndex) {
            feedback.className = "callout callout-tip";
            feedback.innerHTML = "<strong>Jawaban Benar! \uD83C\uDF89</strong><br>" + quiz.explanation;
            if (progressState.indexOf(chap.id) === -1) toggleCompleted();
        } else {
            feedback.className = "callout callout-warning";
            feedback.innerHTML = "<strong>Jawaban Belum Tepat. \u274C</strong><br>" + quiz.explanation;
        }
    }
};

// ══════════════════════════════════════════════════════════════════════
// HARD QUIZ ENGINE
// ══════════════════════════════════════════════════════════════════════

var hardQuizState = {};

function renderHardQuiz(hardQuiz) {
    var container = document.getElementById("hardQuizBody");
    if (!container) return;
    hardQuizState = {};

    if (!hardQuiz || !hardQuiz.questions || hardQuiz.questions.length === 0) {
        container.innerHTML = '<div class="callout callout-info" style="margin:0"><div class="callout-title">\u2139\uFE0F Tes Sulit Belum Tersedia</div>' +
            '<p>Tes sulit untuk bab ini sedang dipersiapkan. Silakan kerjakan <strong>Kuis Pemahaman</strong> terlebih dahulu, atau pilih chapter dari domain Deployment & Mini Project yang sudah memiliki Tes Sulit.</p></div>';
        return;
    }

    var totalQ = hardQuiz.questions.length;
    var html = '<div class="hard-quiz-header">' +
        '<h3>\uD83C\uDFC6 Tes Sulit <span class="hard-quiz-badge">Level Expert</span></h3>' +
        '<div class="hard-quiz-score-display"><div class="score-num" id="hqScoreNum">0/' + totalQ + '</div>' +
        '<div class="score-label">Benar</div></div></div>' +
        '<div class="hard-quiz-progress-bar"><span>Progres:</span>' +
        '<div class="hard-quiz-progress-track"><div class="hard-quiz-progress-fill" id="hqProgressFill"></div></div>' +
        '<span id="hqProgressText">0%</span></div>';

    var letters = ['A','B','C','D','E'];
    hardQuiz.questions.forEach(function(q, qi) {
        var optHtml = "";
        q.options.forEach(function(opt, oi) {
            optHtml += '<button class="hq-option" id="hqOpt_' + qi + '_' + oi + '" onclick="answerHardQuiz(' + qi + ',' + oi + ',' + q.correctIndex + ')">' +
                '<span class="hq-option-letter">' + letters[oi] + '</span><span>' + opt + '</span></button>';
        });
        html += '<div class="hq-question-block" id="hqBlock_' + qi + '">' +
            '<div class="hq-question-num">Soal ' + (qi+1) + ' dari ' + totalQ + '</div>' +
            '<div class="hq-question-text">' + q.question + '</div>' +
            '<div class="hq-options">' + optHtml + '</div>' +
            '<div class="hq-explanation" id="hqExp_' + qi + '"></div></div>';
    });

    html += '<div class="hard-quiz-result-banner" id="hqResultBanner">' +
        '<div class="result-title">Tes Selesai! \uD83C\uDF89</div>' +
        '<div class="result-score" id="hqFinalScore"></div>' +
        '<div class="result-grade" id="hqFinalGrade"></div>' +
        '<button class="btn-restart-hq" onclick="renderHardQuiz(chapters[currentChapterIndex].hardQuiz)">\uD83D\uDD04 Ulangi Tes</button>' +
        '</div>';

    container.innerHTML = html;
}

window.answerHardQuiz = function(qi, selectedOi, correctOi) {
    if (hardQuizState[qi] !== undefined) return;
    hardQuizState[qi] = selectedOi;
    var letters = ['A','B','C','D','E'];
    var totalQ = chapters[currentChapterIndex].hardQuiz.questions.length;

    for (var oi = 0; oi < 5; oi++) {
        var optEl = document.getElementById("hqOpt_" + qi + "_" + oi);
        if (!optEl) continue;
        optEl.classList.add("hq-locked");
        optEl.onclick = null;
        if (oi === correctOi) optEl.classList.add("hq-correct");
        else if (oi === selectedOi) optEl.classList.add("hq-wrong");
    }

    var expEl = document.getElementById("hqExp_" + qi);
    var q = chapters[currentChapterIndex].hardQuiz.questions[qi];
    if (expEl && q.explanation) {
        var isRight = (selectedOi === correctOi);
        expEl.className = "hq-explanation show " + (isRight ? "correct-exp" : "wrong-exp");
        expEl.innerHTML = (isRight ? "\u2705 " : "\u274C ") + "<strong>" +
            (isRight ? "Benar!" : "Salah. Jawaban: " + letters[correctOi]) + "</strong> \u2014 " + q.explanation;
    }
    document.getElementById("hqBlock_" + qi).classList.add("answered");

    var correct = 0;
    for (var k in hardQuizState) {
        var qObj = chapters[currentChapterIndex].hardQuiz.questions[k];
        if (hardQuizState[k] === qObj.correctIndex) correct++;
    }
    var answered = Object.keys(hardQuizState).length;
    var pct = Math.round((answered / totalQ) * 100);
    var scoreEl = document.getElementById("hqScoreNum"); if (scoreEl) scoreEl.textContent = correct + "/" + totalQ;
    var fillEl = document.getElementById("hqProgressFill"); if (fillEl) fillEl.style.width = pct + "%";
    var textEl = document.getElementById("hqProgressText"); if (textEl) textEl.textContent = pct + "%";

    if (answered === totalQ) {
        var scorePct = Math.round((correct / totalQ) * 100);
        var grade = scorePct >= 90 ? "A — Luar Biasa!" : scorePct >= 75 ? "B — Bagus!" : scorePct >= 60 ? "C — Cukup" : "D — Perlu Belajar Lagi";
        var banner = document.getElementById("hqResultBanner");
        if (banner) {
            banner.classList.add("show");
            document.getElementById("hqFinalScore").textContent = scorePct + "%";
            document.getElementById("hqFinalGrade").textContent = "Grade: " + grade + " (" + correct + "/" + totalQ + " benar)";
        }
    }
};

function toggleCompleted() {
    var currentId = chapters[currentChapterIndex].id;
    var pos = progressState.indexOf(currentId);
    if (pos > -1) { progressState.splice(pos, 1); }
    else { progressState.push(currentId); }
    localStorage.setItem("golang_tutorial_progress", JSON.stringify(progressState));
    updateProgressUI();
    loadChapter(currentChapterIndex);
}

function updateProgressUI() {
    var total = chapters.length;
    var count = progressState.length;
    var pct = total > 0 ? Math.round((count / total) * 100) : 0;
    var pBar = document.getElementById("progressBar");
    var pText = document.getElementById("progressText");
    if (pBar) pBar.style.width = pct + "%";
    if (pText) pText.textContent = count + " / " + total + " Selesai (" + pct + "%)";
}

// ══════════════════════════════════════════════════════════════════════
// FINAL EXAM ENGINE
// ══════════════════════════════════════════════════════════════════════

var finalExamQuestions = [
    { q: "Goroutine di Go menggunakan OS Thread yang sama seperti thread Java/C++?", opts: ["Ya, persis sama dengan OS Thread", "Tidak — goroutine adalah green thread (~2KB) yang dikelola Go runtime, jauh lebih ringan dari OS thread", "Ya, tapi dengan auto-pooling", "Tidak, goroutine hanya berjalan di satu CPU core"], correct: 1, exp: "Goroutine adalah lightweight thread yang dikelola Go scheduler, bukan OS. Ribuan goroutine bisa berjalan pada satu OS thread." },
    { q: "Apa perbedaan utama buffered vs unbuffered channel di Go?", opts: ["Buffered channel lebih lambat", "Unbuffered channel memblokir sender sampai receiver siap; buffered tidak blok sampai kapasitas buffer penuh", "Keduanya identik", "Buffered channel tidak bisa digunakan dengan select"], correct: 1, exp: "Unbuffered (sync): sender blok sampai receiver siap. Buffered (async): sender blok hanya jika buffer penuh." },
    { q: "Apa yang dilakukan keyword 'defer' di Go?", opts: ["Eksekusi fungsi secara async di goroutine baru", "Menunda eksekusi fungsi hingga fungsi pembungkus (surrounding function) selesai/return", "Deklarasi variabel yang nilainya ditentukan nanti", "Membatalkan eksekusi goroutine"], correct: 1, exp: "defer menunda eksekusi hingga surrounding function selesai. Multiple defer di-stack dan dijalankan LIFO (Last In First Out)." },
    { q: "Perintah apa yang membangun Docker image dari Dockerfile?", opts: ["docker run -build .", "docker build -t nama-image .", "docker create image .", "docker compose build --image"], correct: 1, exp: "docker build -t nama:tag . membangun image dari Dockerfile di direktori current (.)." },
    { q: "Keuntungan utama Multi-Stage Docker Build untuk Go adalah?", opts: ["Mempercepat eksekusi aplikasi", "Image produksi sangat kecil karena hanya binary tanpa Go toolchain (300MB+ → <15MB)", "Otomatis multi-platform build", "Tidak ada perbedaan nyata"], correct: 1, exp: "Multi-stage: stage 1 kompilasi (perlu Go toolchain), stage 2 hanya copy binary. Image final tidak mengandung Go compiler." },
    { q: "Fungsi apa yang menjadi titik masuk goroutine saat memanggil 'go funcName(args)'?", opts: ["Selalu fungsi main()", "funcName() yang dipanggil setelah keyword go", "fungsi init()", "runtime.Start()"], correct: 1, exp: "Keyword 'go' memulai goroutine baru yang menjalankan funcName(args) secara concurrent dengan goroutine yang memanggilnya." },
    { q: "Di Go, 'interface{}' (atau 'any' di Go 1.18+) merepresentasikan?", opts: ["Tipe pointer universal", "Empty interface yang bisa menampung nilai dari tipe apapun — semua tipe implement interface kosong", "Tipe data khusus JSON", "Alias untuk string"], correct: 1, exp: "interface{} adalah empty interface tanpa method. Semua tipe di Go secara implisit mengimplementasikannya." },
    { q: "Apa output dari: fmt.Println(len([]int{1,2,3,4,5}[1:3]))?", opts: ["5", "2", "3", "4"], correct: 1, exp: "Slice [1:3] mengambil elemen index 1 dan 2 (tidak termasuk index 3), sehingga panjangnya 2." },
    { q: "Apa yang terjadi saat menulis ke closed channel?", opts: ["Nilai diabaikan", "Program panic: 'send on closed channel'", "Nilai disimpan di overflow buffer", "Error dikembalikan sebagai return value kedua"], correct: 1, exp: "Menulis ke closed channel menyebabkan runtime panic yang fatal. Selalu pastikan channel tidak di-close dua kali atau ditulis setelah di-close." },
    { q: "Perintah 'go mod tidy' berfungsi untuk?", opts: ["Memformat kode Go", "Hapus dependency tidak terpakai dan tambahkan yang kurang ke go.mod/go.sum", "Jalankan semua unit test", "Bersihkan cache compiler"], correct: 1, exp: "go mod tidy memastikan go.mod dan go.sum sinkron dengan import yang ada di kode sumber." },
    { q: "Perbedaan utama 'make()' vs 'new()' di Go?", opts: ["Keduanya sama", "new() alokasi memory & return pointer; make() inisialisasi slice/map/channel & return tipe itu sendiri (bukan pointer)", "make() hanya untuk array", "new() lebih cepat"], correct: 1, exp: "new(T) → *T (pointer ke zeroed memory). make(T,...) → T (untuk slice/map/channel yang membutuhkan inisialisasi internal)." },
    { q: "Apa tujuan keyword 'select' di Go?", opts: ["Memilih tipe data dinamis", "Menunggu pada multiple channel operations dan mengeksekusi case yang pertama ready", "Menseleksi goroutine mana yang jalan", "Pengganti switch-case biasa"], correct: 1, exp: "select seperti switch tapi untuk channel. Ia menunggu semua case dan mengeksekusi yang pertama siap (atau default jika ada)." },
    { q: "Perintah systemctl untuk membuat Go service auto-start saat server reboot?", opts: ["systemctl start nama.service", "systemctl enable nama.service", "systemctl restart nama.service", "systemctl boot nama.service"], correct: 1, exp: "systemctl enable membuat symlink ke direktori yang dieksekusi saat boot target. systemctl start hanya untuk sesi saat ini." },
    { q: "Pointer receiver '(p *Person)' vs value receiver '(p Person)': perbedaan utamanya?", opts: ["Pointer receiver lebih lambat", "Pointer receiver dapat memodifikasi struct asli; value receiver bekerja pada copy struct", "Value receiver tidak bisa digunakan di interface", "Tidak ada perbedaan"], correct: 1, exp: "Pointer receiver: method bisa modifikasi original struct. Value receiver: bekerja pada copy, perubahan tidak mempengaruhi original." },
    { q: "Zero value untuk tipe 'map' di Go adalah?", opts: ["Map kosong {} yang siap digunakan", "nil — map yang tidak bisa ditulis sebelum di-initialize dengan make()", "0 (integer)", "false"], correct: 1, exp: "Zero value map adalah nil. Map nil bisa dibaca (return zero value) tapi TIDAK bisa ditulis (panic). Inisialisasi dengan make(map[K]V) atau map literal." },
    { q: "'proxy_pass http://localhost:8080' dalam konfigurasi Nginx berfungsi?", opts: ["Redirect client ke port 8080", "Forward request ke backend Go app di port 8080", "Buka firewall port 8080", "Ubah HTTP ke HTTPS"], correct: 1, exp: "proxy_pass meneruskan request yang masuk ke Nginx menuju upstream backend server pada alamat yang ditentukan." },
    { q: "Output dari program ini:\nvar m map[string]int\nfmt.Println(m[\"key\"])", opts: ["Panic: nil map dereference", "0 (zero value dari int)", "Error kompilasi", "\"\" (empty string)"], correct: 1, exp: "Membaca dari nil map aman — return zero value tipe value-nya. Menulis ke nil map yang menyebabkan panic." },
    { q: "Flag '-gcflags=\"-m\"' saat go build untuk?", opts: ["Aktifkan garbage collector manual", "Tampilkan hasil escape analysis (alokasi heap vs stack)", "Optimasi ukuran binary", "Aktifkan mode debug verbose"], correct: 1, exp: "-gcflags=\"-m\" menampilkan keputusan escape analysis compiler — berguna untuk optimasi performa dan memahami alokasi memori." },
    { q: "Dalam Docker Compose, 'depends_on: [db]' menjamin apa?", opts: ["Service db selesai init sebelum app dimulai", "Container db dimulai sebelum container app, tapi TIDAK menjamin service dalam container (misalnya PostgreSQL) siap", "Port db tersedia otomatis", "Keduanya satu network otomatis"], correct: 1, exp: "depends_on hanya menjamin urutan start container. Untuk menjamin service siap, gunakan depends_on + condition: service_healthy dengan healthcheck." },
    { q: "Mengapa 'sync.RWMutex' lebih baik dari 'sync.Mutex' untuk read-heavy workload?", opts: ["RWMutex lebih cepat untuk semua operasi", "RWMutex mengizinkan multiple concurrent reads (RLock) tapi exclusive write (Lock), meningkatkan throughput baca", "RWMutex lebih mudah digunakan", "Tidak ada perbedaan untuk Go program"], correct: 1, exp: "sync.Mutex: hanya satu goroutine bisa akses (read atau write). sync.RWMutex: banyak goroutine bisa baca bersamaan, tapi tulis tetap exclusive — jauh lebih efisien untuk data yang sering dibaca." }
];

window.openFinalExam = function() {
    examAnswers = {};
    currentExamQuestion = 0;
    examTimeLeft = 30 * 60;
    if (examTimerInterval) clearInterval(examTimerInterval);

    var overlay = document.getElementById("finalExamOverlay");
    if (overlay) overlay.classList.add("open");

    var resultScreen = document.getElementById("examResultScreen");
    if (resultScreen) { resultScreen.classList.remove("show"); resultScreen.innerHTML = ""; }
    var examBody = document.getElementById("finalExamBody");
    if (examBody) examBody.style.display = "flex";
    var examFooter = document.getElementById("finalExamFooter");
    if (examFooter) examFooter.style.display = "flex";

    var timerEl = document.getElementById("examTimer");
    if (timerEl) { timerEl.textContent = "30:00"; timerEl.classList.remove("danger"); }

    renderExamQuestion(0);
    startExamTimer();
};

window.closeFinalExam = function() {
    var overlay = document.getElementById("finalExamOverlay");
    if (overlay) overlay.classList.remove("open");
    if (examTimerInterval) clearInterval(examTimerInterval);
};

function startExamTimer() {
    var timerEl = document.getElementById("examTimer");
    examTimerInterval = setInterval(function() {
        examTimeLeft--;
        var min = Math.floor(examTimeLeft / 60);
        var sec = examTimeLeft % 60;
        if (timerEl) {
            timerEl.textContent = (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
            if (examTimeLeft <= 300) timerEl.classList.add("danger");
        }
        if (examTimeLeft <= 0) { clearInterval(examTimerInterval); submitFinalExam(); }
    }, 1000);
}

function renderExamQuestion(qi) {
    currentExamQuestion = qi;
    var q = finalExamQuestions[qi];
    var totalQ = finalExamQuestions.length;
    var answeredCount = Object.keys(examAnswers).length;
    var pct = Math.round((answeredCount / totalQ) * 100);
    var letters = ['A','B','C','D'];

    var optHtml = "";
    q.opts.forEach(function(opt, oi) {
        var cls = "exam-option";
        if (examAnswers[qi] === oi) cls += " exam-selected";
        optHtml += '<div class="' + cls + '" id="examOpt_' + qi + '_' + oi + '" onclick="selectExamAnswer(' + qi + ',' + oi + ')">' +
            '<span class="exam-opt-letter">' + letters[oi] + '</span><span>' + opt.replace(/\n/g, ' ') + '</span></div>';
    });

    var dotsHtml = "";
    finalExamQuestions.forEach(function(_, di) {
        var cls = "exam-dot";
        if (examAnswers[di] !== undefined) cls += " answered";
        if (di === qi) cls += " current";
        dotsHtml += '<div class="' + cls + '" onclick="renderExamQuestion(' + di + ')" title="Soal ' + (di+1) + '"></div>';
    });

    var body = document.getElementById("finalExamBody");
    if (!body) return;
    body.innerHTML = '<div class="exam-progress-row"><span>Soal ' + (qi+1) + ' / ' + totalQ + '</span>' +
        '<div class="exam-prog-track"><div class="exam-prog-fill" style="width:' + pct + '%"></div></div>' +
        '<span>' + pct + '%</span></div>' +
        '<div class="exam-question-block">' +
        '<div class="exam-question-label">Pertanyaan ' + (qi+1) + '</div>' +
        '<div class="exam-question-text">' + q.q.replace(/\n/g, '<br>') + '</div>' +
        '<div class="exam-options-grid">' + optHtml + '</div></div>' +
        '<div class="exam-nav-row"><div class="exam-question-dots">' + dotsHtml + '</div>' +
        '<div style="display:flex;gap:8px;">' +
        (qi > 0 ? '<button class="btn btn-secondary" onclick="renderExamQuestion(' + (qi-1) + ')" style="padding:8px 16px">\u2190 Prev</button>' : '') +
        (qi < totalQ-1 ? '<button class="btn btn-primary" onclick="renderExamQuestion(' + (qi+1) + ')" style="padding:8px 16px">Next \u2192</button>' : '') +
        '</div></div>';

    var answeredEl = document.getElementById("examAnsweredCount");
    if (answeredEl) answeredEl.textContent = answeredCount + " / " + totalQ + " dijawab";
}

window.selectExamAnswer = function(qi, oi) {
    examAnswers[qi] = oi;
    renderExamQuestion(qi);
};

window.submitFinalExam = function() {
    if (examTimerInterval) clearInterval(examTimerInterval);
    var totalQ = finalExamQuestions.length;
    var correct = 0;
    finalExamQuestions.forEach(function(q, i) { if (examAnswers[i] === q.correct) correct++; });
    var scorePct = Math.round((correct / totalQ) * 100);
    var grade, gradeClass, feedback, trophy;
    if (scorePct >= 90) { grade="A"; gradeClass="grade-a"; trophy="\uD83C\uDFC6"; feedback="Luar biasa! Anda menguasai Go dari fondasi hingga production deployment. Siap membangun Go app skala besar!"; }
    else if (scorePct >= 75) { grade="B"; gradeClass="grade-b"; trophy="\uD83E\uDD48"; feedback="Bagus! Pemahaman solid. Review topik concurrency dan deployment untuk mencapai grade A."; }
    else if (scorePct >= 60) { grade="C"; gradeClass="grade-c"; trophy="\uD83E\uDD49"; feedback="Cukup baik! Fokus pada goroutine, channel, Docker, dan systemd deployment."; }
    else { grade="D"; gradeClass="grade-d"; trophy="\uD83D\uDCDA"; feedback="Perlu lebih banyak latihan. Ulangi materi fondasi, concurrency, dan praktikkan mini project."; }

    var examBody = document.getElementById("finalExamBody");
    if (examBody) examBody.style.display = "none";
    var examFooter = document.getElementById("finalExamFooter");
    if (examFooter) examFooter.style.display = "none";

    var resultScreen = document.getElementById("examResultScreen");
    if (resultScreen) {
        resultScreen.classList.add("show");
        resultScreen.innerHTML = '<div class="result-trophy">' + trophy + '</div>' +
            '<div class="result-grade-badge ' + gradeClass + '">' + grade + '</div>' +
            '<div class="result-title">Ujian Selesai!</div>' +
            '<div class="result-score-big">' + scorePct + '%</div>' +
            '<div class="result-score-detail">' + correct + ' dari ' + totalQ + ' jawaban benar</div>' +
            '<div class="result-feedback">' + feedback + '</div>' +
            '<div class="result-actions">' +
            '<button class="btn-retry-exam" onclick="openFinalExam()">\uD83D\uDD04 Coba Lagi</button>' +
            '<button class="btn-close-exam" onclick="closeFinalExam()">\u2715 Tutup</button>' +
            '</div>';
    }
};

function setupEventListeners() {
    document.querySelectorAll(".tab-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".tab-btn").forEach(function(b) { b.classList.remove("active"); });
            document.querySelectorAll(".tab-content").forEach(function(c) { c.classList.remove("active"); });
            btn.classList.add("active");
            var tabElem = document.getElementById("tab-" + btn.dataset.tab);
            if (tabElem) tabElem.classList.add("active");
            if (btn.dataset.tab === "playground" && editorInstance) setTimeout(function() { editorInstance.refresh(); }, 100);
        });
    });

    var sInput = document.getElementById("searchInput");
    if (sInput) sInput.addEventListener("input", function(e) { renderSidebar(e.target.value); });

    var runBtn = document.getElementById("runCodeBtn");
    if (runBtn) runBtn.addEventListener("click", executeGoCode);

    var resetBtn = document.getElementById("resetCodeBtn");
    if (resetBtn) resetBtn.addEventListener("click", function() {
        if (editorInstance) editorInstance.setValue((chapters[currentChapterIndex].initialCode || "").trim());
    });

    var copyBtn = document.getElementById("copyCodeBtn");
    if (copyBtn) copyBtn.addEventListener("click", function() {
        if (editorInstance) {
            navigator.clipboard.writeText(editorInstance.getValue()).then(function() {
                copyBtn.textContent = "\u2705 Disalin!";
                setTimeout(function() { copyBtn.textContent = "\uD83D\uDCCB Salin"; }, 1500);
            });
        }
    });

    var markBtn = document.getElementById("markCompletedBtn");
    if (markBtn) markBtn.addEventListener("click", toggleCompleted);

    var prevBtn = document.getElementById("prevChapterBtn");
    if (prevBtn) prevBtn.addEventListener("click", function() {
        if (currentChapterIndex > 0) loadChapter(currentChapterIndex - 1);
    });
    var nextBtn = document.getElementById("nextChapterBtn");
    if (nextBtn) nextBtn.addEventListener("click", function() {
        if (currentChapterIndex < chapters.length - 1) loadChapter(currentChapterIndex + 1);
    });

    var resetPBtn = document.getElementById("resetProgressBtn");
    if (resetPBtn) resetPBtn.addEventListener("click", function(e) { e.preventDefault(); window.resetAllProgress(); });

    document.addEventListener("keydown", function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") executeGoCode();
        if (e.key === "Escape") window.closeFinalExam();
    });

    var overlay = document.getElementById("finalExamOverlay");
    if (overlay) overlay.addEventListener("click", function(e) { if (e.target === overlay) window.closeFinalExam(); });
}

// ══════════════════════════════════════════════════════════════════════
// CODE EXECUTION ENGINE
// ══════════════════════════════════════════════════════════════════════

async function executeGoCode() {
    if (!editorInstance) return;
    var code = editorInstance.getValue();
    var modeElem = document.getElementById("engineSelect");
    var mode = modeElem ? modeElem.value : "playground";
    var outputConsole = document.getElementById("consoleOutput");
    var consoleStatus = document.getElementById("consoleStatus");

    if (outputConsole) { outputConsole.className = "console-output"; outputConsole.textContent = "\u23F3 Memproses..."; }
    if (consoleStatus) consoleStatus.innerHTML = '<span class="spinner"></span> <span>Running...</span>';

    if (mode === "playground") {
        try {
            var startTime = performance.now();
            var response = await fetch("https://play.golang.org/compile", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: "version=2&body=" + encodeURIComponent(code)
            });
            if (!response.ok) throw new Error("API error");
            var data = await response.json();
            var duration = (performance.now() - startTime).toFixed(0);
            if (data.Errors) {
                if (outputConsole) { outputConsole.className = "console-output error"; outputConsole.textContent = "\u274C Error Kompilasi:\n\n" + data.Errors; }
                if (consoleStatus) consoleStatus.innerHTML = '<span style="color:var(--accent-red)">\uD83D\uDD34 Error</span>';
            } else if (data.Events) {
                var outText = ""; data.Events.forEach(function(evt) { outText += evt.Message; });
                if (outputConsole) outputConsole.textContent = outText || "(Tanpa output)";
                if (consoleStatus) consoleStatus.innerHTML = '<span style="color:var(--accent-green)">\uD83D\uDFE2 Berhasil (' + duration + 'ms)</span>';
            } else {
                if (outputConsole) outputConsole.textContent = "Selesai tanpa output.";
                if (consoleStatus) consoleStatus.innerHTML = '<span>\uD83D\uDFE2 Finished</span>';
            }
        } catch (err) {
            console.warn("Go Playground error, fallback JS:", err);
            runClientJSEvaluator(code);
        }
    } else {
        runClientJSEvaluator(code);
    }
}

function runClientJSEvaluator(code) {
    var outputConsole = document.getElementById("consoleOutput");
    var consoleStatus = document.getElementById("consoleStatus");
    var stdout = [];
    var customFmt = {
        Println: function() { stdout.push(Array.prototype.slice.call(arguments).join(" ")); },
        Printf: function(fmt) { var a = Array.prototype.slice.call(arguments, 1); var s = fmt; a.forEach(function(v) { s = s.replace(/%[vsdT%+t#]/, String(v)); }); stdout.push(s); },
        Print: function() { stdout.push(Array.prototype.slice.call(arguments).join("")); },
        Sprintf: function(fmt) { var a = Array.prototype.slice.call(arguments, 1); var s = fmt; a.forEach(function(v) { s = s.replace(/%[vsdT%+t#]/, String(v)); }); return s; },
        Fprintf: function(w, fmt) { var a = Array.prototype.slice.call(arguments, 2); var s = fmt; a.forEach(function(v) { s = s.replace(/%[vsdT%+t#]/, String(v)); }); stdout.push(s); }
    };
    try {
        var startTime = performance.now();
        var jsCode = code
            .replace(/package main/g, "")
            .replace(/import \([\s\S]*?\)/g, "")
            .replace(/import "[^"]+"/g, "")
            .replace(/func main\(\)/g, "function main()")
            .replace(/func /g, "function ")
            .replace(/:=/g, "=");
        var sandbox = new Function("fmt", "try{" + jsCode + "; if(typeof main==='function')main();}catch(e){throw e;}");
        sandbox(customFmt);
        var duration = (performance.now() - startTime).toFixed(0);
        if (stdout.length > 0) {
            if (outputConsole) { outputConsole.className = "console-output"; outputConsole.textContent = stdout.join("\n"); }
            if (consoleStatus) consoleStatus.innerHTML = '<span style="color:var(--accent-green)">\uD83D\uDFE2 JS Engine (' + duration + 'ms)</span>';
        } else {
            if (outputConsole) { outputConsole.className = "console-output"; outputConsole.textContent = "(Tanpa output)"; }
            if (consoleStatus) consoleStatus.innerHTML = '<span>\uD83D\uDFE2 Finished</span>';
        }
    } catch (err) {
        if (outputConsole) { outputConsole.className = "console-output error"; outputConsole.textContent = "\u274C JS Fallback:\n" + err.message + "\n\n\uD83D\uDCA1 Gunakan mode 'Go Playground API' untuk kode kompleks."; }
        if (consoleStatus) consoleStatus.innerHTML = '<span style="color:var(--accent-amber)">\uD83D\uDFE0 Fallback Mode</span>';
    }
}
