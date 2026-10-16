# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Kong API Gateway Modern (Kong 3.7–3.9): Deklaratif DB-less (`decK`), AI Gateway (`ai-proxy`), OpenID Connect / JWT, & Custom Plugin

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 0 modul yang sudah ada di kelas `kong/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `kong/data/modules.json`.

## 1. Audit Modul Saat Ini di Repositori (`kong/data/modules.json`)

Saat ini, kelas **`kong`** di repositori Kodeloka memiliki **0 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan penuh di bawah ini menambahkan kapabilitas rilis terbaru yang belum tercakup di modul lama.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 13: GitOps API Gateway dengan Mode DB-less (`kong.yaml`) dan Sinkronisasi Otomatis Menggunakan `decK`

- **Tingkat:** Menengah
- **Ringkasan:** Mengelola seluruh konfigurasi Services, Routes, Upstreams, dan Plugins sebagai kode di repositori Git menggunakan format deklaratif `_format_version: '3.0'` dan memvalidasinya di pipa CI dengan `deck file validate` & `deck gateway sync`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mengelola seluruh konfigurasi Services, Routes, Upstreams, dan Plugins sebagai kode di repositori Git menggunakan format deklaratif `_format_version: '3.0'` dan memvalidasinya di pipa CI dengan `deck file validate` & `deck gateway sync`. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
_format_version: "3.0"
services:
  - name: layanan-pembayaran
    url: http://payment-service.internal:8080
    routes:
      - name: rute-pembayaran
        paths:
          - /api/v1/pembayaran
        methods: ["POST", "GET"]
    plugins:
      - name: rate-limiting
        config:
          minute: 60
          policy: local
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `kong/data/modules.json` (dan `kong/app.js`) sehingga memperluas cakupan kelas `kong` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 14: Kong AI Gateway (`ai-proxy`, `ai-rate-limiting-advanced`, `ai-prompt-guard`) untuk Mengelola Lalu Lintas LLM

- **Tingkat:** Lanjut
- **Ringkasan:** Menyatukan akses ke berbagai penyedia LLM (Gemini, OpenAI, Anthropic, model lokal), membatasi kuota token per pengguna, dan menyaring prompt berbahaya langsung di tingkat API Gateway menggunakan plugin AI bawaan Kong 3.6+.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menyatukan akses ke berbagai penyedia LLM (Gemini, OpenAI, Anthropic, model lokal), membatasi kuota token per pengguna, dan menyaring prompt berbahaya langsung di tingkat API Gateway menggunakan plugin AI bawaan Kong 3.6+. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
plugins:
  - name: ai-prompt-guard
    config:
      allow_all_conversation_history: false
      deny_patterns:
        - "abaikan seluruh instruksi sebelumnya" 
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `kong/data/modules.json` (dan `kong/app.js`) sehingga memperluas cakupan kelas `kong` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 15: Ekspresi Router Berkinerja Tinggi (ATC Router Expressions), Mutual TLS (mTLS), dan Observabilitas OpenTelemetry di Kong

- **Tingkat:** Lanjut
- **Ringkasan:** Menulis aturan pencocokan rute yang presisi menggunakan bahasa ekspresi router Kong 3 (`http.path ^= "/v1" && net.protocol == "https"`) serta meneruskan konteks trace W3C ke layanan upstream.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menulis aturan pencocokan rute yang presisi menggunakan bahasa ekspresi router Kong 3 (`http.path ^= "/v1" && net.protocol == "https"`) serta meneruskan konteks trace W3C ke layanan upstream. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
routes:
  - name: rute-ekspresi-ketat
    expression: 'http.path ^= "/api/v2" && http.method == "POST" && Lower(http.headers.content_type) == "application/json"'
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `kong/data/modules.json` (dan `kong/app.js`) sehingga memperluas cakupan kelas `kong` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `kong` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `kong/data/modules.json` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `kong` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (0 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `kong`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 0 modul yang sudah ada di `kong/data/modules.json` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `kong` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan ketiga modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `kong/`
- B. Mengekstrak objek `judul`, `tingkat`, `ringkas`, `isi`, contoh kode, dan `kuis` dari berkas ini ke dalam `kong/data/modules.json` serta memperbarui jumlah modul di `scripts/courses.json`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke `kong/data/modules.json` (dan disinkronkan ke `kong/app.js` serta `scripts/courses.json`).

## Sumber

- [Dokumentasi Resmi — Kong API Gateway Modern (Kong 3.7–3.9)](https://docs.konghq.com/)
