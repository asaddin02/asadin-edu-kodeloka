# Perbaikan: Belajar Microservices - Remote Procedure Invocation

- **Kelas:** microservices
- **Modul:** 8
- **Jenis:** koreksi, tambahan

## Yang kurang
Materi saat ini hanya 139 kata dan contoh berkas `.proto` untuk `PaymentRequest` menggunakan `double amount = 2;`. Dalam rekayasa sistem pembayaran, tipe floating-point biner (`double`/`float`) tidak boleh digunakan untuk nominal uang karena menimbulkan galat pembulatan desimal. Selain itu, materi belum menjelaskan kewajiban memasang *deadline/timeout* dan *idempotency* pada setiap panggilan RPI sinkron.

## Koreksi
> Teks lama: "double amount = 2;"

Teks baru: "`int64 amount_minor = 2; // Nominal dalam satuan terkecil (mis. rupiah penuh atau sen) untuk menghindari galat presisi float`"

## Materi tambahan
Letakkan di akhir materi (setelah blok kode `payment_service.proto`).

### 3. Tiga Aturan Emas Komunikasi Sinkron (RPI) di Produksi

Panggilan jaringan sinkron (baik REST maupun gRPC) memiliki karakteristik yang berbeda jauh dari panggilan fungsi lokal di dalam memori: jaringan dapat melambat, memutus koneksi di tengah jalan, atau mengembalikan respons yang terlambat. Oleh karena itu, setiap klien RPI wajib menerapkan tiga pengaman berikut:

1. **Selalu Tetapkan *Timeout / Deadline* Eksplisit:** Jangan pernah melakukan panggilan HTTP atau gRPC tanpa batas waktu. Di gRPC, teruskan `context.WithTimeout` sehingga server penerima juga mengetahui sisa anggaran waktu (*deadline propagation*) dan menghentikan kueri database jika klien sudah menyerah menunggu.
2. **Sertakan Kunci Idempotensi pada *Retry*:** Jika panggilan `ProcessPayment` mengalami *timeout* jaringan, klien tidak tahu apakah permintaan gagal sebelum tiba di server atau gagal saat balasan sedang dikirim pulang. Sertakan `idempotency_key` unik di dalam pesan agar pengulangan (*retry*) tidak mendebit saldo pelanggan dua kali.
3. **Jaga Kompatibilitas Mundur Skema Protobuf:** Jangan pernah mengubah nomor tag field yang sudah terpakai (misalnya `= 1`, `= 2`) pada berkas `.proto`. Jika sebuah field dihapus, tandai nomor dan namanya dengan kata kunci `reserved` agar tidak dipakai ulang oleh field baru di masa depan.

| Aspek Teknis | REST (JSON over HTTP/1.1 atau HTTP/2) | gRPC (Protobuf over HTTP/2) |
| :--- | :--- | :--- |
| Kontrak skema | Opsional (melalui spesifikasi OpenAPI) | Wajib dan dikompilasi menjadi kode stub bertipe kuat (`.proto`) |
| Ukuran payload & CPU serialisasi | Lebih besar (berbasis teks UTF-8) | Jauh lebih ringkas (pengodean biner *varint* dan tag nomor field) |
| Dukungan peramban web langsung | Didukung penuh oleh `fetch()` bawaan | Membutuhkan proksi penerjemah (gRPC-Web / Connect) bila dipanggil dari peramban |

## Sumber
- [Microservices.io — Pattern: Remote Procedure Invocation (RPI)](https://microservices.io/patterns/communication-style/rpi.html)
- [Protocol Buffers Documentation — Language Guide (proto3)](https://protobuf.dev/programming-guides/proto3/)
- [gRPC Official Documentation — Deadlines](https://grpc.io/blog/deadlines/)
