# Penjadwalan Tugas Antarmuka: `requestIdleCallback`, `queueMicrotask`, dan `scheduler.yield()`

- **Tingkat:** Lanjut
- **Ringkasan:** Memecah pekerjaan JavaScript yang panjang (*Long Tasks* > 50ms) agar tidak membekukan interaksi pengguna menggunakan **Prioritized Task Scheduling API (`scheduler.yield()`, `scheduler.postTask()`)**, `requestIdleCallback()`, dan `queueMicrotask()`.

## Mengapa Tugas JavaScript Lebih dari 50 Milidetik Merusak Skor INP?

Di dalam peramban web, satu **Main Thread** (*Utas Utama*) bertanggung jawab menjalankan kode JavaScript Anda, menanggapi event klik/ketikan pengguna, menghitung tata letak CSS (*Layout*), hingga menggambar piksel ke layar (*Paint*). Setiap pekerjaan tak terputus yang memakan waktu lebih dari **50 milidetik** disebut sebagai **Long Task** (*Tugas Panjang*).

Jika pengguna mengeklik tombol menu tepat ketika utas utama sedang sibuk menjalankan perulangan sinkron selama 300 ms, peramban tidak dapat memproses klik tersebut maupun menggambar perubahan visual sampai 300 ms itu selesai—membuat aplikasi terasa macet (*frozen*) dan menghancurkan skor **Interaction to Next Paint (INP)**! Solusinya adalah **memecah tugas panjang dan menyerahkan kendali sejenak ke utas utama (*yielding to the main thread*)** menggunakan **`scheduler.yield()`**.

> **⚠️ Jebakan Umum di Lapangan:** Menjalankan pemrosesan ribuan item array di dalam satu fungsi sinkron tanpa memberikan kesempatan kepada *main thread* untuk menggambar ulang layar (*yield to main thread*) akan membuat skor INP (*Interaction to Next Paint*) memburuk drastis.

## 1. Perbandingan Empat Mekanisme Penjadwalan Tugas di JavaScript

Jangan samakan semua fungsi penjadwalan! Masing-masing menempatkan tugas di antrean yang sangat berbeda di dalam Event Loop:

| API Penjadwalan | Antrean & Prioritas Eksekusi | Kapan Harus Digunakan? |
| :--- | :--- | :--- |
| **`await scheduler.yield()`** | Menyerahkan kendali ke peramban untuk menggambar layar/menangani input, lalu melanjutkan sisa fungsi dengan **prioritas yang diwarisi** (mendahului tugas makro lain yang baru masuk). | **Pilihan terbaik** untuk memecah perulangan atau inisialisasi panjang di tengah jalan agar INP tetap rendah. |
| **`scheduler.postTask(fn, { priority })`** | Menjadwalkan tugas dengan 3 tingkat prioritas eksplisit: `"user-blocking"`, `"user-visible"` (bawaan), atau `"background"`. | Mengatur urutan eksekusi berbagai pekerjaan aplikasi sesuai tingkat kepentingannya bagi pengguna. |
| **`requestIdleCallback(fn)`** | Dieksekusi hanya ketika peramban sedang **benar-benar senggang (*idle*)** di akhir frame. | Pekerjaan berprioritas sangat rendah seperti menyiapkan batch log analitik atau prapemuatan data non-kritis. |
| **`queueMicrotask(fn)`** | Dieksekusi **seketika setelah fungsi saat ini selesai, SEBELUM peramban sempat merender layar**! | Hanya untuk penyelarasan status internal mikro. **Jangan pernah** dipakai untuk memecah *Long Task* karena tidak memberi waktu peramban menggambar layar! |

## 2. Memecah *Long Task* dengan `scheduler.yield()` dan Fallback Aman

Mengapa `await scheduler.yield()` lebih unggul daripada `await new Promise(r => setTimeout(r, 0))`? Ketika Anda memakai `setTimeout(r, 0)`, kelanjutan kode Anda dilempar ke **paling belakang antrean tugas makro (*macrotask queue*)** di belakang seluruh skrip pihak ketiga lain yang mungkin sudah mengantre. Sebaliknya, **`scheduler.yield()`** memberikan kesempatan kepada peramban untuk menangani input pengguna dan menggambar layar, lalu melanjutkan kode Anda di barisan depan!

Berikut adalah pola fungsi pembantu dengan *feature detection* yang otomatis memakai `scheduler.yield()` bila tersedia, atau jatuh kembali ke `setTimeout`:

```javascript
export async function berikanWaktuKeMainThread() {
  if ("scheduler" in globalThis && "yield" in globalThis.scheduler) {
    return globalThis.scheduler.yield();
  }
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export async function prosesRibuanData(daftarItem, prosesSatuItem) {
  let waktuTerakhirYield = performance.now();

  for (let i = 0; i < daftarItem.length; i++) {
    prosesSatuItem(daftarItem[i]);
    // Setiap kali eksekusi sudah berjalan >= 16ms (atau tiap 50 item), serahkan kendali sejenak
    if (i % 50 === 0 && performance.now() - waktuTerakhirYield >= 16) {
      await berikanWaktuKeMainThread();
      waktuTerakhirYield = performance.now();
    }
  }
}
```

## 3. Menjalankan Tugas Latar Belakang dengan `scheduler.postTask` dan `requestIdleCallback`

Untuk tugas yang tidak perlu langsung terlihat oleh pengguna (seperti membersihkan cache lokal atau mengirim ringkasan telemetri), Anda dapat menggunakan prioritas `"background"` pada `scheduler.postTask()` atau `requestIdleCallback()`:

```javascript
export function jalankanSaatSenggang(pekerjaan) {
  if ("scheduler" in globalThis && "postTask" in globalThis.scheduler) {
    return globalThis.scheduler.postTask(pekerjaan, { priority: "background" });
  }
  if ("requestIdleCallback" in globalThis) {
    return new Promise((resolve) => {
      requestIdleCallback(() => resolve(pekerjaan()), { timeout: 2000 });
    });
  }
  return new Promise((resolve) => setTimeout(() => resolve(pekerjaan()), 50));
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Mencoba memecah *Long Task* menggunakan `queueMicrotask()` atau `await Promise.resolve()`:** Seluruh antrean *microtask* wajib dikosongkan sampai habis di dalam siklus *tick* yang sama **sebelum** peramban diizinkan menangani input klik atau melakukan *repaint* layar! Memecah pekerjaan 500 ms menjadi 100 potongan `queueMicrotask` tetap akan membekukan layar selama 500 ms penuh!
2. **Mengubah DOM langsung di dalam `requestIdleCallback()`:** Karena `requestIdleCallback` berjalan di sisa waktu akhir frame tepat setelah tata letak dihitung, mengubah gaya atau struktur DOM di dalamnya dapat memaksa perhitungan ulang tata letak yang tidak terduga. Jika harus memperbarui DOM, jadwalkan perubahan DOM tersebut ke `requestAnimationFrame` berikutnya.
3. **Melakukan `await berikanWaktuKeMainThread()` pada setiap 1 item di dalam perulangan 10.000 item:** Menyerahkan kendali 10.000 kali berturut-turut akan menambah *overhead* penjadwalan yang membuat total waktu selesai sangat lambat. Lakukan *yield* secara berkelompok (*batching*), misalnya setiap beberapa puluh item atau setiap kali waktu berjalan melampaui `16ms`–`30ms`.

## Latihan Praktik Mandiri

1. Buat berkas `penjadwal-tugas.mjs` yang mengekspor fungsi `berikanWaktuKeMainThread()` dan `prosesArrayRamahUi(items, fn, batasWaktuMs = 20)`.
2. Tulis pengujian otomatis menggunakan `node:test` untuk memastikan `prosesArrayRamahUi` memproses seluruh 500 item dengan urutan dan hasil yang 100% akurat.
3. Uji di peramban dengan memproses 5.000 item sambil mengetik di `<input type="text">` dan amati di panel **Performance** DevTools bahwa balok merah *Long Task* telah terpecah menjadi tugas-tugas pendek di bawah 50 ms.

## Kuis Pemahaman

### Soal 1
Mengapa menggunakan `queueMicrotask()` atau `await Promise.resolve()` di dalam perulangan **tidak dapat** mencegah pembekuan antarmuka pengguna (*UI freeze* / skor INP buruk)?
- A. Karena `queueMicrotask()` hanya berjalan di dalam Web Worker
- B. Karena Event Loop peramban mengeksekusi seluruh *microtask* yang mengantre secara beruntun hingga habis **sebelum** memberikan kesempatan kepada peramban untuk memproses input pengguna atau menggambar ulang layar (*repaint*); gunakan `await scheduler.yield()` (atau `setTimeout`) untuk menyerahkan kendali ke utas utama
- C. Karena `Promise.resolve()` memakan waktu minimal 1 detik
- D. Karena `queueMicrotask()` otomatis membatalkan seluruh *event listener*

**Jawaban Benar:** B
**Penjelasan:** *Microtask checkpoint* berjalan tepat setelah fungsi saat ini selesai tetapi masih di dalam giliran tugas yang sama sebelum fase perenderan visual. Untuk mengizinkan peramban merender frame dan merespons input, Anda harus mengakhiri tugas makro saat ini menggunakan `scheduler.yield()` atau makro-task baru.

### Soal 2
Apa keunggulan utama dari `await scheduler.yield()` dibandingkan `await new Promise(r => setTimeout(r, 0))` saat memecah sebuah tugas panjang?
- A. `scheduler.yield()` berjalan tanpa membutuhkan CPU sama sekali
- B. Setelah memberikan kesempatan kepada peramban untuk menangani input penting dan merender layar, kelanjutan kode sesudah `await scheduler.yield()` mendapatkan prioritas kelanjutan di barisan depan tanpa harus mengantre di belakang seluruh tugas `setTimeout` lain yang sudah ada di antrean
- C. `scheduler.yield()` mengubah kode JavaScript menjadi WebAssembly
- D. `setTimeout` tidak dapat digunakan di dalam fungsi `async`

**Jawaban Benar:** B
**Penjelasan:** `scheduler.yield()` dirancang khusus oleh W3C Web Performance Working Group agar kelanjutan (*continuation*) dari tugas yang mengalah tetap diprioritaskan di depan tugas baru setingkatnya, sedangkan `setTimeout(r, 0)` selalu melempar kelanjutan tugas ke ujung paling belakang antrean tugas makro.

### Soal 3
Dalam API `scheduler.postTask(callback, { priority })`, manakah tiga tingkat prioritas resmi yang didukung oleh spesifikasi Prioritized Task Scheduling API dari yang paling tinggi ke paling rendah?
- A. `"high"`, `"medium"`, dan `"low"`
- B. `"user-blocking"`, `"user-visible"`, dan `"background"`
- C. `"critical"`, `"normal"`, dan `"idle"`
- D. `"sync"`, `"micro"`, dan `"macro"`

**Jawaban Benar:** B
**Penjelasan:** Spesifikasi Prioritized Task Scheduling API menetapkan tiga nilai prioritas: `"user-blocking"` (untuk tugas yang langsung merespons interaksi pengguna), `"user-visible"` (bawaan, untuk pembaruan tampilan non-blokir), dan `"background"` (untuk analitik atau pemeliharaan latar belakang).

## Sumber

- [`Scheduler.yield()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield)
- [`Window.requestIdleCallback()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
- [`queueMicrotask()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask)
