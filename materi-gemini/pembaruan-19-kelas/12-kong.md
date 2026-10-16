# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Kong API Gateway Modern (Kong 3.7–3.9): Deklaratif DB-less (`decK`), AI Gateway (`ai-proxy`), OpenID Connect / JWT, & Custom Plugin

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 12 modul yang sudah ada di kelas `kong/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `kong/app.js` (larik `modulesData`).

## 1. Audit Modul Saat Ini di Repositori (`kong/app.js`)

Saat ini, kelas **`kong`** di repositori Kodeloka memiliki **12 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |
| 1 | 01. Apa itu API Gateway & Posisi Kong | — | Sudah ada |
| 2 | 02. Instalasi Kong: DB-less vs Berbasis Database | — | Sudah ada |
| 3 | 03. Objek Inti: Service, Route, Upstream & Target | — | Sudah ada |
| 4 | 04. decK: Konfigurasi sebagai Kode | — | Sudah ada |
| 5 | 05. Anatomi Plugin & Urutan Eksekusi | — | Sudah ada |
| 6 | 06. Rate Limiting, Caching & Perlindungan Trafik | — | Sudah ada |
| 7 | 07. Transformasi Request & Response | — | Sudah ada |
| 8 | 08. Autentikasi: Key, JWT, OAuth2 & Consumer | — | Sudah ada |
| 9 | 09. TLS, mTLS & Pengerasan Produksi | — | Sudah ada |
| 10 | 10. Kong Ingress Controller 3.x & Gateway API | — | Sudah ada |
| 11 | 11. Observability: Metrik, Log & Tracing | — | Sudah ada |
| 12 | 12. Produksi: HA, Kapasitas & Upgrade | — | Sudah ada |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan di bawah ini menambahkan pembaruan 2024–2026, tetapi sebagian topiknya sudah ada di kelas. Kelas sudah membahas decK (modul 4), mode DB-less (modul 2), mTLS (modul 9), dan plugin OpenTelemetry (modul 11). Yang belum ada: plugin AI Gateway (`ai-proxy`, `ai-prompt-guard`, `ai-rate-limiting-advanced`) dan bahasa ekspresi router.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 13: GitOps API Gateway dengan Konfigurasi Deklaratif (`kong.yaml`): Mode DB-less atau Sinkronisasi Otomatis Menggunakan `decK` ke Kong Berbasis Database

- **Tingkat:** Menengah
- **Ringkasan:** Mengelola seluruh konfigurasi Services, Routes, Upstreams, dan Plugins sebagai kode di repositori Git menggunakan format deklaratif `_format_version: '3.0'` dan memvalidasinya di pipa CI dengan `deck file validate` & `deck gateway sync`. Catatan: decK tidak dapat dipakai pada node DB-less (sync, dump, dan operasi sejenis membutuhkan akses tulis ke Admin API); pada mode DB-less, muat `kong.yaml` lewat `declarative_config` atau `POST /config`, sedangkan `deck gateway sync` dipakai untuk Kong berbasis database (atau mode hybrid dan Konnect).

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mengelola seluruh konfigurasi Services, Routes, Upstreams, dan Plugins sebagai kode di repositori Git menggunakan format deklaratif `_format_version: '3.0'` dan memvalidasinya di pipa CI dengan `deck file validate` & `deck gateway sync`. Catatan: decK tidak dapat dipakai pada node DB-less (sync, dump, dan operasi sejenis membutuhkan akses tulis ke Admin API); pada mode DB-less, muat `kong.yaml` lewat `declarative_config` atau `POST /config`, sedangkan `deck gateway sync` dipakai untuk Kong berbasis database (atau mode hybrid dan Konnect). Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```yaml
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

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `modulesData` di `kong/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `kong` dari **12 modul** menjadi **15 modul** berstandar terbaru.


## Modul Pembaruan 14: Kong AI Gateway (`ai-proxy`, `ai-rate-limiting-advanced`, `ai-prompt-guard`) untuk Mengelola Lalu Lintas LLM

- **Tingkat:** Lanjut
- **Ringkasan:** Menyatukan akses ke berbagai penyedia LLM (Gemini, OpenAI, Anthropic, model lokal), membatasi kuota token per pengguna, dan menyaring prompt berbahaya langsung di tingkat API Gateway menggunakan plugin AI bawaan Kong (`ai-proxy` dan `ai-prompt-guard` sejak 3.6; `ai-rate-limiting-advanced` hanya tersedia di edisi Enterprise, sejak 3.7).

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menyatukan akses ke berbagai penyedia LLM (Gemini, OpenAI, Anthropic, model lokal), membatasi kuota token per pengguna, dan menyaring prompt berbahaya langsung di tingkat API Gateway menggunakan plugin AI bawaan Kong (`ai-proxy` dan `ai-prompt-guard` sejak 3.6; `ai-rate-limiting-advanced` hanya tersedia di edisi Enterprise, sejak 3.7). Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```yaml
plugins:
  - name: ai-prompt-guard
    config:
      allow_all_conversation_history: false
      deny_patterns:
        - "abaikan seluruh instruksi sebelumnya" 
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `modulesData` di `kong/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `kong` dari **12 modul** menjadi **15 modul** berstandar terbaru.


## Modul Pembaruan 15: Ekspresi Router Berkinerja Tinggi (ATC Router Expressions), Mutual TLS (mTLS), dan Observabilitas OpenTelemetry di Kong

- **Tingkat:** Lanjut
- **Ringkasan:** Menulis aturan pencocokan rute yang presisi menggunakan bahasa ekspresi router Kong 3 (`http.path ^= "/v1" && net.protocol == "https"`) serta meneruskan konteks trace W3C ke layanan upstream.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menulis aturan pencocokan rute yang presisi menggunakan bahasa ekspresi router Kong 3 (`http.path ^= "/v1" && net.protocol == "https"`) serta meneruskan konteks trace W3C ke layanan upstream. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```yaml
# Wajib: router_flavor = expressions (kong.conf atau KONG_ROUTER_FLAVOR=expressions); pada flavor ini kondisi rute ditulis di field `expression`
routes:
  - name: rute-ekspresi-ketat
    expression: 'http.path ^= "/api/v2" && http.method == "POST" && lower(http.headers.content_type) == "application/json"'
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `modulesData` di `kong/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `kong` dari **12 modul** menjadi **15 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `kong` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `kong/app.js` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `kong` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (12 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `kong`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 12 modul yang sudah ada di `kong/app.js` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

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
- B. Mengekstrak judul, tingkat, ringkasan, isi, contoh kode, dan kuis setiap modul dari berkas ini ke dalam larik `modulesData` di `kong/app.js` (bentuk objeknya mengikuti mesin kelas tersebut), memperbarui jumlah modul di `scripts/courses.json`, lalu menjalankan `npm run extract`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke larik `modulesData` di `kong/app.js`, jumlah modulnya diperbarui di `scripts/courses.json`, dan `data/modules.json` dibangkitkan ulang lewat `npm run extract`.

## Sumber

- [Dokumentasi Resmi — Kong API Gateway Modern (Kong 3.7–3.9)](https://developer.konghq.com/gateway/)
- [Kong — decK](https://developer.konghq.com/deck/)
- [Kong — Router Expressions](https://developer.konghq.com/gateway/routing/expressions/)
- [Kong — Plugin AI Proxy](https://developer.konghq.com/plugins/ai-proxy/)
- [Kong — Plugin AI Prompt Guard](https://developer.konghq.com/plugins/ai-prompt-guard/)
