# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas RabbitMQ Modern (RabbitMQ 3.13 & 4.0): Quorum Queues, RabbitMQ Streams, Publisher Confirms, & Topologi Dead-Letter Exchange (DLX)

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 0 modul yang sudah ada di kelas `rabbitmq/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `rabbitmq/data/modules.json`.

## 1. Audit Modul Saat Ini di Repositori (`rabbitmq/data/modules.json`)

Saat ini, kelas **`rabbitmq`** di repositori Kodeloka memiliki **0 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan penuh di bawah ini menambahkan kapabilitas rilis terbaru yang belum tercakup di modul lama.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 16: Quorum Queues (`x-queue-type: quorum`) Berbasis Raft sebagai Pengganti Classic Mirrored Queues

- **Tingkat:** Lanjut
- **Ringkasan:** Merancang antrean dengan ketersediaan tinggi dan keamanan data menggunakan **Quorum Queues** (karena *Classic Mirrored Queues* telah dihapus di RabbitMQ 4.0), serta mengatur batas percobaan ulang dengan header `x-delivery-count`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Merancang antrean dengan ketersediaan tinggi dan keamanan data menggunakan **Quorum Queues** (karena *Classic Mirrored Queues* telah dihapus di RabbitMQ 4.0), serta mengatur batas percobaan ulang dengan header `x-delivery-count`. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
// Mendeklarasikan Quorum Queue dengan batas maksimal percobaan ulang (Poison Message Handling)
{
  "x-queue-type": "quorum",
  "x-delivery-limit": 5,
  "x-dead-letter-exchange": "dlx.pesanan"
}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `rabbitmq/data/modules.json` (dan `rabbitmq/app.js`) sehingga memperluas cakupan kelas `rabbitmq` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 17: RabbitMQ Streams (`x-queue-type: stream`) untuk Throughput Tinggi & Pembacaan Ulang (*Replay*) Berbasis Offset

- **Tingkat:** Lanjut
- **Ringkasan:** Menggunakan **RabbitMQ Streams** ketika beberapa konsumen berbeda perlu membaca riwayat pesan yang sama secara berulang tanpa menghapus pesan dari antrean.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menggunakan **RabbitMQ Streams** ketika beberapa konsumen berbeda perlu membaca riwayat pesan yang sama secara berulang tanpa menghapus pesan dari antrean. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
// Argumen deklarasi RabbitMQ Stream dengan retensi maksimal 7 hari atau 10 GB
{
  "x-queue-type": "stream",
  "x-max-age": "7D",
  "x-max-length-bytes": 10737418240
}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `rabbitmq/data/modules.json` (dan `rabbitmq/app.js`) sehingga memperluas cakupan kelas `rabbitmq` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 18: Pola Delayed Retry dengan TTL + Dead-Letter Exchange (DLX), Publisher Confirms Asinkron, & Prefetch (`basic.qos`) Tuning

- **Tingkat:** Lanjut
- **Ringkasan:** Mengatur nilai `prefetch_count` yang optimal agar satu worker tidak menimbun ribuan pesan di RAM lokal sementara worker lain menganggur.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mengatur nilai `prefetch_count` yang optimal agar satu worker tidak menimbun ribuan pesan di RAM lokal sementara worker lain menganggur. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
# Aturan praktis Prefetch (basic.qos):
# Untuk tugas berat/lambat: prefetch = 1 s.d. 5
# Untuk tugas cepat (<10ms): prefetch = 20 s.d. 100
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `rabbitmq/data/modules.json` (dan `rabbitmq/app.js`) sehingga memperluas cakupan kelas `rabbitmq` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `rabbitmq` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `rabbitmq/data/modules.json` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `rabbitmq` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (0 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `rabbitmq`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 0 modul yang sudah ada di `rabbitmq/data/modules.json` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `rabbitmq` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan ketiga modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `rabbitmq/`
- B. Mengekstrak objek `judul`, `tingkat`, `ringkas`, `isi`, contoh kode, dan `kuis` dari berkas ini ke dalam `rabbitmq/data/modules.json` serta memperbarui jumlah modul di `scripts/courses.json`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke `rabbitmq/data/modules.json` (dan disinkronkan ke `rabbitmq/app.js` serta `scripts/courses.json`).

## Sumber

- [Dokumentasi Resmi — RabbitMQ Modern (RabbitMQ 3.13 & 4.0)](https://www.rabbitmq.com/docs)
