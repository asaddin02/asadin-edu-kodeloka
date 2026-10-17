# Service Workers, Cache Storage API, dan Aplikasi Web Offline-First (PWA)

- **Tingkat:** Lanjut
- **Ringkasan:** Menguasai siklus hidup **Service Worker** (`install`, `activate`, `fetch`), mencegat permintaan jaringan untuk menerapkan strategi *Cache-First* atau *Stale-While-Revalidate* dengan **Cache Storage API**, serta menyusun berkas `manifest.webmanifest` untuk *Progressive Web App*.

## Mengapa Service Worker Disebut sebagai Proxy Jaringan yang Dapat Diprogram di Peramban?

**Service Worker** adalah jenis Web Worker khusus yang berjalan di latar belakang terpisah dari tab halaman web, tidak memiliki akses langsung ke DOM, namun memiliki kemampuan luar biasa: **mencegat setiap permintaan jaringan HTTP (`fetch`) yang keluar dari halaman dalam cakupan wilayahnya (*scope*)** dan memutuskan apakah permintaan tersebut dijawab dari jaringan, dari penyimpanan lokal **Cache Storage API (`caches`)**, atau dibuatkan respons cadangan saat pengguna sedang luring (*offline*).

Karena kemampuannya yang begitu besar, Service Worker hanya diizinkan terdaftar pada konteks aman (**HTTPS** atau `localhost`).

> **⚠️ Jebakan Umum di Lapangan:** Meng-cache berkas HTML utama secara permanen dengan strategi *Cache-First* tanpa mekanisme pembaruan versi cache di fase `activate` akan membuat pengguna terjebak melihat versi aplikasi lama selamanya meskipun server sudah diperbarui.

## 1. Tiga Fase Siklus Hidup Service Worker (`install`, `activate`, `fetch`)

Ketika halaman mendaftarkan Service Worker dengan `navigator.serviceWorker.register("/sw.js")`, berkas `/sw.js` melewati siklus hidup ketat:

| Fase Event di `sw.js` | Kapan Dipicu? | Tugas Utama & Metode Penting |
| :--- | :--- | :--- |
| **`install`** | Saat berkas `sw.js` baru pertama kali diunduh atau isinya berubah minimal 1 byte dari versi sebelumnya. | Mengunduh dan menyimpan aset kerangka awal (*App Shell*) ke dalam `caches.open(NAMA_CACHE)` di dalam **`event.waitUntil(...)`**. |
| **`activate`** | Setelah Service Worker lama tidak lagi mengendalikan tab mana pun dan versi baru siap mengambil alih. | **Menghapus cache versi lama** (`caches.delete(kunciLama)`) di dalam **`event.waitUntil(...)`** agar kuota penyimpanan pengguna tidak penuh. |
| **`fetch`** | Setiap kali halaman dalam cakupan meminta dokumen HTML, CSS, JS, gambar, atau panggilan `fetch()`. | Memanggil **`event.respondWith(promiseRespons)`** untuk menerapkan strategi caching yang sesuai. |

## 2. Memilih Strategi Caching yang Tepat dan Menghapus Cache Lama

Jangan gunakan satu strategi cache yang sama untuk semua jenis berkas!
1. **Aset Statis Ber-Hash (misalnya `/assets/app.8f92a1.js`, fon `.woff2`):** Gunakan **Cache-First (Falling back to Network)** karena namanya pasti berubah jika isinya berubah.
2. **Dokumen Navigasi HTML (`req.mode === "navigate"`) atau Data API:** Gunakan **Network-First (Falling back to Cache)** atau **Stale-While-Revalidate** agar pengguna selalu mendapatkan artikel terbaru saat daring, namun tetap bisa membuka halaman yang pernah dikunjungi saat luring (*offline*):

```javascript
// sw.js (Service Worker)
const NAMA_CACHE = "kodeloka-statis-v2";
const ASET_AWAL = ["/", "/style.css", "/app.js", "/offline.html"];

// 1. Fase Install: Simpan aset inti ke Cache Storage
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(NAMA_CACHE).then((cache) => cache.addAll(ASET_AWAL))
  );
});

// 2. Fase Activate: Bersihkan cache dari versi sebelumnya (mis. v1)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((daftarNama) =>
      Promise.all(
        daftarNama
          .filter((nama) => nama !== NAMA_CACHE)
          .map((namaLama) => caches.delete(namaLama))
      )
    )
  );
});

// 3. Fase Fetch: Network-First untuk navigasi HTML, Cache-First untuk aset statis GET
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(event.request).then((tersimpan) => tersimpan || caches.match("/offline.html"))
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((tersimpan) => tersimpan || fetch(event.request))
  );
});
```

## 3. Strategi *Stale-While-Revalidate* dan Kloning `response.clone()`

Karena tubuh objek `Response` adalah sebuah `ReadableStream` yang **hanya dapat dibaca satu kali**, apabila Anda ingin menyimpan hasil `fetch(req)` ke dalam `cache.put(req, ...)` sekaligus mengembalikannya ke peramban, Anda **wajib** memanggil **`responsJaringan.clone()`**:

```javascript
async function staleWhileRevalidate(request) {
  const cache = await caches.open(NAMA_CACHE);
  const responsTersimpan = await cache.match(request);

  const janjiJaringan = fetch(request).then((responsBaru) => {
    if (responsBaru.ok) {
      // Wajib clone() karena satu aliran dikirim ke cache dan satu lagi ke halaman!
      cache.put(request, responsBaru.clone());
    }
    return responsBaru;
  });

  return responsTersimpan || janjiJaringan;
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Mencoba meng-cache permintaan `POST`, `PUT`, atau `DELETE` ke dalam `Cache` API:** `cache.put()` hanya mendukung permintaan dengan metode `GET` dan akan melempar `TypeError` jika diberi permintaan `POST`. Selalu periksa `if (event.request.method !== "GET") return;` di awal pendengar `fetch`.
2. **Memanggil `cache.put(req, res)` dan `return res` tanpa `res.clone()`:** Tubuh respons akan terkunci/habis dikonsumsi oleh salah satu pihak dan memicu `TypeError: Response body is already used`.
3. **Menempatkan berkas `sw.js` di dalam subfolder `/assets/js/sw.js`:** Cakupan (*scope*) maksimum sebuah Service Worker ditentukan oleh lokasi direktori berkasnya. Jika diletakkan di `/assets/js/sw.js`, ia hanya bisa mencegat permintaan ke `/assets/js/*` dan tidak bisa mencegat halaman utama `/`! Letakkan `sw.js` di akar domain (`/sw.js`).

## Latihan Praktik Mandiri

1. Buat berkas `pendaftaran-sw.mjs` untuk sisi halaman utama yang memeriksa `if ("serviceWorker" in navigator)` lalu mendaftarkan `/sw.js` setelah event `load`.
2. Buat berkas `sw.js` lengkap dengan fase `install`, `activate` (penghapusan cache usang), dan `fetch` (menggabungkan *Network-First* untuk HTML dan *Stale-While-Revalidate* untuk aset statis dengan `.clone()`).
3. Uji di Chrome/Firefox DevTools (**Application -> Service Workers -> centang Offline**) bahwa halaman tetap terbuka saat jaringan dimatikan.

## Kuis Pemahaman

### Soal 1
Mengapa berkas HTML utama (`/index.html`) sebaiknya **tidak** disajikan dengan strategi *Cache-First* permanen tanpa mekanisme pembaruan atau pergantian nama cache di fase `activate`?
- A. Karena `Cache` API tidak dapat menyimpan berkas yang mengandung tag `<html>`
- B. Karena pada strategi *Cache-First*, peramban akan terus menyajikan `index.html` lama dari cache lokal tanpa pernah menghubungi server, sehingga pengguna terjebak pada versi aplikasi lama meskipun server sudah merilis pembaruan
- C. Karena berkas HTML akan otomatis terhapus setiap 5 menit
- D. Karena Service Worker tidak dapat membaca permintaan navigasi

**Jawaban Benar:** B
**Penjelasan:** Jika HTML utama dikunci dengan *Cache-First* murni tanpa revalidasi atau rotasi versi cache saat `activate`, pengguna yang sudah pernah membuka situs tidak akan menerima referensi bundel JS/CSS baru dari server.

### Soal 2
Mengapa saat menyimpan respons hasil `fetch(event.request)` ke dalam Cache Storage sekaligus mengembalikannya ke halaman, Anda wajib memanggil ` cache.put(event.request, response.clone())`?
- A. Untuk menggandakan kecepatan unduhan jaringan
- B. Karena isi tubuh (*body*) dari objek `Response` berupa `ReadableStream` yang hanya dapat dikonsumsi satu kali; `response.clone()` membuat salinan aliran kedua agar satu aliran dapat disimpan ke cache dan aliran asli dikembalikan ke peramban
- C. Karena `cache.put()` mengubah status kode HTTP menjadi `404`
- D. Untuk menghapus header CORS dari objek `Response`

**Jawaban Benar:** B
**Penjelasan:** Mengonsumsi `Response` dua kali (satu oleh `cache.put()` dan satu oleh perender halaman) tanpa `.clone()` akan melempar `TypeError` karena stream tubuh respons sudah terkunci/terpakai.

### Soal 3
Apa fungsi dari pemanggilan `event.waitUntil(promise)` di dalam pendengar event `install` dan `activate` pada Service Worker?
- A. Menghentikan utas utama halaman web selama 10 detik
- B. Memberi tahu peramban agar tidak menganggap fase `install` atau `activate` selesai (dan tidak mematikan Service Worker) sampai `Promise` di dalamnya (seperti pengunduhan `cache.addAll` atau penghapusan cache lama) benar-benar tuntas
- C. Menunda pengiriman formulir pengguna hingga baterai penuh
- D. Mengubah `Promise` menjadi fungsi sinkron

**Jawaban Benar:** B
**Penjelasan:** Peramban dapat menghentikan proses Service Worker kapan saja jika dianggap menganggur. `event.waitUntil()` memperpanjang masa hidup fase peristiwa tersebut sampai seluruh pekerjaan asinkron di dalamnya berhasil diselesaikan.

## Sumber

- [Service Worker API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Using Service Workers — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)
- [`Cache` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
