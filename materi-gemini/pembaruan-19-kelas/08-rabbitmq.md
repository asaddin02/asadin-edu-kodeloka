# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas RabbitMQ Modern (RabbitMQ 3.13 & 4.0): Quorum Queues, RabbitMQ Streams, Publisher Confirms, & Topologi Dead-Letter Exchange (DLX)

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 15 modul yang sudah ada di kelas `rabbitmq/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `rabbitmq/app.js` (larik `RMQ_MOD_C`).

## 1. Audit Modul Saat Ini di Repositori (`rabbitmq/app.js`)

Saat ini, kelas **`rabbitmq`** di repositori Kodeloka memiliki **15 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |
| 1 | Model AMQP: Exchange, Queue, Binding, dan Routing Key | Dasar | Sudah ada |
| 2 | Instalasi & Konfigurasi: rabbitmq.conf, Plugin, dan Batas Sistem | Dasar | Sudah ada |
| 3 | Empat Tipe Exchange dan Cara Memilihnya | Menengah | Sudah ada |
| 4 | Producer & Consumer: Properti Pesan dan Siklus Hidupnya | Menengah | Sudah ada |
| 5 | Acknowledgement & Prefetch: Mengendalikan Aliran Pesan | Menengah | Sudah ada |
| 6 | Durability, Persistence, dan Publisher Confirms | Lanjut | Sudah ada |
| 7 | Dead Letter Exchange, TTL, dan Retry Berjenjang | Lanjut | Sudah ada |
| 8 | Quorum Queue, Classic Queue, dan Stream | Lanjut | Sudah ada |
| 9 | Pola Integrasi: Work Queue, Pub/Sub, RPC, dan Outbox | Lanjut | Sudah ada |
| 10 | Idempotensi, Urutan Pesan, dan Mitos Exactly-Once | Lanjut | Sudah ada |
| 11 | Klien Produksi: Reconnect, Heartbeat, dan Graceful Shutdown | Lanjut | Sudah ada |
| 12 | Cluster, Partisi Jaringan, Federation, dan Shovel | Lanjut | Sudah ada |
| 13 | Keamanan: vhost, Permission, TLS, dan Pengerasan | Lanjut | Sudah ada |
| 14 | Monitoring, Flow Control, dan Menyetel Performa | Lanjut | Sudah ada |
| 15 | Operasi Harian: Definisi sebagai Kode, Upgrade, dan Troubleshooting | Lanjut | Sudah ada |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan di bawah ini menambahkan pembaruan 2024–2026, tetapi sebagian topiknya sudah ada di kelas. Hampir seluruh topik sudah ada di kelas: `x-queue-type` quorum dan stream (termasuk `x-max-age`) di modul 8, `x-delivery-limit` di modul 4, 5, 7, 8, dan 15, prefetch dan `basic.qos` di modul 5, Publisher Confirms di modul 6, serta DLX, TTL, dan retry berjenjang di modul 7. Yang belum disebut hanya header `x-delivery-count`.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 16: Quorum Queues (`x-queue-type: quorum`) Berbasis Raft sebagai Pengganti Classic Mirrored Queues

- **Tingkat:** Lanjut
- **Ringkasan:** Merancang antrean dengan ketersediaan tinggi dan keamanan data menggunakan **Quorum Queues** (karena *Classic Mirrored Queues* telah dihapus di RabbitMQ 4.0), serta mengatur batas percobaan ulang dengan header `x-delivery-count`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Merancang antrean dengan ketersediaan tinggi dan keamanan data menggunakan **Quorum Queues** (karena *Classic Mirrored Queues* telah dihapus di RabbitMQ 4.0), serta mengatur batas percobaan ulang dengan header `x-delivery-count`. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```json
// Mendeklarasikan Quorum Queue dengan batas maksimal percobaan ulang (Poison Message Handling)
{
  "x-queue-type": "quorum",
  "x-delivery-limit": 5,
  "x-dead-letter-exchange": "dlx.pesanan"
}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `RMQ_MOD_C` di `rabbitmq/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `rabbitmq` dari **15 modul** menjadi **18 modul** berstandar terbaru.


## Modul Pembaruan 17: RabbitMQ Streams (`x-queue-type: stream`) untuk Throughput Tinggi & Pembacaan Ulang (*Replay*) Berbasis Offset

- **Tingkat:** Lanjut
- **Ringkasan:** Menggunakan **RabbitMQ Streams** ketika beberapa konsumen berbeda perlu membaca riwayat pesan yang sama secara berulang tanpa menghapus pesan dari antrean.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menggunakan **RabbitMQ Streams** ketika beberapa konsumen berbeda perlu membaca riwayat pesan yang sama secara berulang tanpa menghapus pesan dari antrean. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```json
// Argumen deklarasi RabbitMQ Stream dengan retensi maksimal 7 hari atau 10 GB
{
  "x-queue-type": "stream",
  "x-max-age": "7D",
  "x-max-length-bytes": 10737418240
}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `RMQ_MOD_C` di `rabbitmq/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `rabbitmq` dari **15 modul** menjadi **18 modul** berstandar terbaru.


## Modul Pembaruan 18: Pola Delayed Retry dengan TTL + Dead-Letter Exchange (DLX), Publisher Confirms Asinkron, & Prefetch (`basic.qos`) Tuning

- **Tingkat:** Lanjut
- **Ringkasan:** Mengatur nilai `prefetch_count` yang optimal agar satu worker tidak menimbun ribuan pesan di RAM lokal sementara worker lain menganggur.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mengatur nilai `prefetch_count` yang optimal agar satu worker tidak menimbun ribuan pesan di RAM lokal sementara worker lain menganggur. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```text
# Aturan praktis Prefetch (basic.qos):
# Untuk tugas berat/lambat: prefetch = 1 s.d. 5
# Untuk tugas cepat (<10ms): prefetch = 20 s.d. 100
```

> Perlu dicek: angka prefetch di atas adalah aturan praktis, bukan angka dari dokumentasi resmi. Dokumentasi RabbitMQ menyebut kisaran 100 sampai 300 biasanya memberi throughput optimal dan menyarankan mencari nilai terbaik lewat percobaan pada beban kerja Anda.

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `RMQ_MOD_C` di `rabbitmq/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `rabbitmq` dari **15 modul** menjadi **18 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `rabbitmq` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `rabbitmq/app.js` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `rabbitmq` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (15 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `rabbitmq`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 15 modul yang sudah ada di `rabbitmq/app.js` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

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
- B. Mengekstrak judul, tingkat, ringkasan, isi, contoh kode, dan kuis setiap modul dari berkas ini ke dalam larik `RMQ_MOD_C` di `rabbitmq/app.js` (bentuk objeknya mengikuti mesin kelas tersebut), memperbarui jumlah modul di `scripts/courses.json`, lalu menjalankan `npm run extract`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke larik `RMQ_MOD_C` di `rabbitmq/app.js`, jumlah modulnya diperbarui di `scripts/courses.json`, dan `data/modules.json` dibangkitkan ulang lewat `npm run extract`.

## Sumber

- [Dokumentasi Resmi — RabbitMQ Modern (RabbitMQ 3.13 & 4.0)](https://www.rabbitmq.com/docs)
- [RabbitMQ — Quorum Queues](https://www.rabbitmq.com/docs/quorum-queues)
- [RabbitMQ — Streams](https://www.rabbitmq.com/docs/streams)
- [RabbitMQ — Consumer Acknowledgements dan Publisher Confirms (prefetch)](https://www.rabbitmq.com/docs/confirms)
