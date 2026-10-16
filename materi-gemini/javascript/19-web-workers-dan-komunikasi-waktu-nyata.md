# Komputasi Latar Belakang (`Web Workers`), `WebSocket`, dan `Server-Sent Events (SSE)`

- **Tingkat:** Lanjut
- **Ringkasan:** Menjaga antarmuka tetap responsif (INP rendah) dengan memindahkan komputasi CPU berat ke utas latar belakang menggunakan **Web Workers**, serta membangun fitur waktu nyata (*real-time*) menggunakan **WebSocket** dan **Server-Sent Events (`EventSource`)**.

## 1. Memindahkan Beban Berat dari Utas Utama dengan *Web Workers*

Ingat bahwa utas utama (*Main Thread*) di peramban bertanggung jawab atas dua hal sekaligus: **menjalankan JavaScript Anda** DAN **menggambar/merespons interaksi layar (klik, ketikan, animasi)**.

Jika kode JavaScript Anda melakukan pekerjaan CPU yang memakan waktu `400 milidetik` secara sinkron di utas utama (misalnya menyaring dan mengurutkan 100.000 baris data JSON, mengompresi gambar, atau mengeksekusi penyorot sintaks kode yang sangat besar), maka **selama 400 milidetik tersebut seluruh halaman membeku total**!

Solusinya adalah **Web Workers (`new Worker()`)**:
- Menjalankan skrip JavaScript di dalam **utas sistem operasi terpisah (*background thread*)** yang benar-benar paralel dengan utas utama!
- Karena terisolasi, *Web Worker* **tidak memiliki akses langsung ke objek `document` / DOM** halaman utama.
- Utas utama dan *Web Worker* berkomunikasi secara aman dengan saling mengirim pesan menggunakan **`postMessage(data)`** dan mendengarkan event **`onmessage`** (data disalin secara otomatis menggunakan algoritma *Structured Clone*).

```js
// === 1. Berkas Pekerja: ./pekerja-analisis.js ===
self.addEventListener("message", (event) => {
  const { daftarAngka } = event.data;

  // Perhitungan berat ini berjalan di utas CPU terpisah tanpa membekukan layar pengguna!
  const terurut = daftarAngka.toSorted((a, b) => a - b);
  const total = terurut.reduce((acc, n) => acc + n, 0);

  // Kirimkan hasilnya kembali ke utas utama
  self.postMessage({
    jumlahData: terurut.length,
    rataRata: total / terurut.length,
    median: terurut[Math.floor(terurut.length / 2)]
  });
});
```

```js
// === 2. Berkas Utas Utama: ./app.js ===
// Membuat worker bertipe ES Module
const pekerja = new Worker(new URL("./pekerja-analisis.js", import.meta.url), {
  type: "module"
});

pekerja.addEventListener("message", (event) => {
  console.log("Hasil analisis dari utas latar belakang:", event.data);
});

pekerja.addEventListener("error", (galat) => {
  console.error("Terjadi galat di dalam Web Worker:", galat.message);
});

// Mengirim tugas ke worker
pekerja.postMessage({ daftarAngka: [90, 12, 45, 78, 34, 100, 23] });
```

## 2. Komunikasi Waktu Nyata (*Real-Time*): `WebSocket` vs `Server-Sent Events (SSE)`

Pada protokol HTTP biasa (`fetch()`), server hanya bisa mengirim data jika peramban bertanya terlebih dahulu. Bagaimana jika server perlu **mendorong (*push*) pembaruan secara langsung ke peramban** begitu ada kejadian baru (seperti grafik metrik server langsung, notifikasi kelulusan deployment CI/CD, atau ruang diskusi langsung)?

Ada dua standar web utama yang wajib Anda pahami perbedaannya:

| Kriteria | **Server-Sent Events (`EventSource` / SSE)** | **WebSocket (`new WebSocket()`)** |
|---|---|---|
| **Arah Komunikasi** | **Satu arah (*Unidirectional*):** Server $\rightarrow$ Klien (Klien mengirim aksi lewat `fetch()` biasa). | **Dua arah penuh (*Full-Duplex Bidirectional*):** Klien $\leftrightarrow$ Server secara simultan. |
| **Protokol Jaringan** | Berjalan di atas **HTTP/HTTPS standar** (`Content-Type: text/event-stream`). Ramah *firewall* dan HTTP/2! | Meng-upgrade koneksi ke protokol **`wss://`** (WebSocket Secure). |
| **Sambung Ulang Otomatis** | **Sudah bawaan otomatis!** Jika jaringan terputus sebentar, `EventSource` otomatis menyambung ulang sendiri. | **Harus ditulis manual** dengan logika *exponential backoff* di JavaScript. |
| **Kasus Penggunaan Terbaik** | Umpan notifikasi langsung, streaming log CI/CD, pembaruan harga/metrik dasbor, streaming respons AI. | Gim multipemain waktu nyata, kolaborasi kursor kanvas bersama, aplikasi obrolan frekuensi sangat tinggi. |

### A. Menggunakan `EventSource` (Server-Sent Events)
Jika kebutuhan Anda hanya menerima aliran pembaruan dari server ke layar pengguna, **`EventSource`** jauh lebih sederhana daripada WebSocket:

```js
const sumberAliran = new EventSource("/api/aliran-metrik");

// Mendengarkan pesan standar dari server
sumberAliran.addEventListener("message", (event) => {
  const metrik = JSON.parse(event.data);
  console.log("Beban CPU terbaru:", metrik.cpu);
});

// Mendengarkan nama event khusus (mis. "peringatan-kritis") yang dikirim server
sumberAliran.addEventListener("peringatan-kritis", (event) => {
  console.warn("Peringatan server:", JSON.parse(event.data));
});

// Menutup koneksi saat pengguna meninggalkan halaman/komponen
function tutupAliran() {
  sumberAliran.close();
}
```

### B. Menggunakan `WebSocket` untuk Komunikasi Dua Arah

```js
// Selalu gunakan skema terenkripsi wss:// di produksi!
const ws = new WebSocket("wss://kodeloka.asadinedu.com/ws/terminal");

ws.addEventListener("open", () => {
  console.log("Tersambung ke terminal interaktif.");
  ws.send(JSON.stringify({ tipe: "perintah", isi: "ls -la" }));
});

ws.addEventListener("message", (event) => {
  const pesan = JSON.parse(event.data);
  console.log("Keluaran terminal:", pesan.keluaran);
});

ws.addEventListener("close", (event) => {
  console.log(`Koneksi WebSocket ditutup (kode: ${event.code})`);
});
```

## Latihan Praktik: Pencarian & Pemeringkatan Data Besar di dalam Web Worker

Buatlah berkas `worker-cari.js` dan `utama-worker.js`:
1. Di dalam `worker-cari.js`, terima pesan berisi array 10.000 item dan sebuah kata kunci pencarian, lalu hitung skor kecocokan dan urutkan dengan `.toSorted()` sebelum mengirim 10 hasil teratas lewat `self.postMessage()`.
2. Di dalam `utama-worker.js`, bungkus komunikasi ke Worker tersebut ke dalam sebuah fungsi yang mengembalikan `Promise` sehingga dapat dipanggil dengan mudah menggunakan `await jalankanDiWorker(data)`!

## Kuis Pemahaman

### Soal 1
Mengapa kode yang berjalan di dalam sebuah **Web Worker (`new Worker()`)** tidak diizinkan memanggil `document.querySelector()` atau mengubah elemen DOM secara langsung?
- A. Karena Web Worker tidak mendukung bahasa JavaScript standar.
- B. Demi menjaga keamanan konkurensi (*thread safety*) pohon DOM agar utas utama dan utas pekerja tidak memodifikasi elemen visual yang sama secara bersamaan (*race condition*); Web Worker memproses data di latar belakang lalu mengirimkan hasilnya ke utas utama melalui `postMessage()`.
- C. Karena Web Worker hanya memiliki memori maksimal 1 KB.
- D. Karena `document` hanya tersedia di dalam fungsi `async`.

**Jawaban Benar:** B
**Penjelasan:** Pohon DOM di peramban tidak dirancang untuk diakses dari banyak utas sekaligus (*not thread-safe*). Dengan mengisolasi akses DOM hanya pada utas utama dan menghubungkan Web Worker lewat pengiriman pesan `postMessage()`, peramban bebas dari *deadlock* dan *race condition* visual.

### Soal 2
Kapan Anda sebaiknya memilih **Server-Sent Events (`EventSource` / SSE)** dibandingkan **WebSocket**?
- A. Ketika Anda membuat gim multipemain 3D yang mengirim koordinat pemain 60 kali per detik dari klien ke server.
- B. Ketika aliran data waktu nyata bersifat **satu arah dari server ke peramban** (seperti streaming log proses build, dasbor pemantauan metrik, atau notifikasi langsung), karena SSE berjalan di atas HTTP standar dan sudah memiliki fitur sambung-ulang (*auto-reconnect*) bawaan.
- C. Ketika Anda perlu mengirim data biner suara mikrofon secara terus-menerus dari peramban ke server.
- D. Ketika server tidak mendukung protokol HTTP.

**Jawaban Benar:** B
**Penjelasan:** Untuk kasus di mana klien hanya perlu mendengarkan dorongan data dari server, `EventSource` (SSE) jauh lebih ringan, bekerja mulus melalui HTTP/2 tanpa perlu *protocol upgrade* khusus, dan menangani penyambungan ulang secara otomatis jika koneksi sempat terputus.

### Soal 3
Metode apakah yang harus dipanggil pada instans `pekerja` (`const pekerja = new Worker(...)`) atau `sumberAliran` (`const sumberAliran = new EventSource(...)`) apabila komponen sudah tidak digunakan lagi agar tidak memboroskan sumber daya CPU dan jaringan?
- A. `pekerja.terminate()` untuk menghentikan Web Worker, dan `sumberAliran.close()` untuk menutup koneksi `EventSource`.
- B. `pekerja.delete()` dan `sumberAliran.stop()`.
- C. `window.clearWorker(pekerja)`.
- D. Cukup mengosongkan isi DOM dengan `innerHTML = ""`.

**Jawaban Benar:** A
**Penjelasan:** Web Worker yang sudah dibuat akan terus hidup di memori sampai `worker.terminate()` dipanggil dari utas utama (atau `self.close()` dari dalam worker). Begitu pula koneksi `EventSource` harus ditutup dengan `.close()` saat tidak lagi diperlukan.

## Sumber
- [WebSocket API (WebSockets) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Interaction to Next Paint (INP) — web.dev](https://web.dev/articles/inp)
- [JavaScript execution model — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
