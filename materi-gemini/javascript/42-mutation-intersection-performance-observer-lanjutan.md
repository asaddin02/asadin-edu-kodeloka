# Pemantauan Kinerja Nyata (RUM) dengan `PerformanceObserver` (LCP, CLS, dan INP)

- **Tingkat:** Lanjut
- **Ringkasan:** Mengukur metrik **Core Web Vitals** pengguna sesungguhnya di lapangan (*Real User Monitoring*) secara akurat menggunakan **`PerformanceObserver`** untuk menangkap entri `largest-contentful-paint`, `layout-shift`, dan `event` (*Interaction to Next Paint*).

## Mengapa Pengujian Lighthouse di Laptop Pengembang Tidak Cukup?

Menjalankan audit Lighthouse di laptop pengembangan yang cepat dengan koneksi Wi-Fi stabil disebut sebagai pengukuran laboratorium (*Lab Data*). Namun di dunia nyata, pengunjung situs Anda mungkin menggunakan ponsel kelas menengah di dalam kereta dengan sinyal 4G yang naik-turun dan ekstensi peramban yang berat.

Untuk mengetahui kinerja halaman yang benar-benar dialami oleh pengguna di lapangan (**Real User Monitoring / RUM**), Web Platform menyediakan antarmuka **`PerformanceObserver`**. Dengan `PerformanceObserver`, kode Anda menerima pemberitahuan asinkron berbiaya rendah setiap kali mesin peramban mencatat peristiwa kinerja seperti **Largest Contentful Paint (LCP)**, **Cumulative Layout Shift (CLS)**, dan **Interaction to Next Paint (INP)**.

> **⚠️ Jebakan Umum di Lapangan:** Mengirim metrik performa ke server analitik menggunakan `fetch()` biasa saat event `unload` sering gagal karena halaman keburu ditutup; gunakan `navigator.sendBeacon()` atau `fetch(url, { keepalive: true })` saat `visibilitychange` berubah menjadi `'hidden'`.

## 1. Tiga Metrik Core Web Vitals dan Tipe Entri `PerformanceObserver`

Berikut adalah tiga metrik utama Core Web Vitals beserta tipe entri `PerformanceObserver` dan ambang batas skor "Baik" pada persentil ke-75 pengguna:

| Metrik Core Web Vitals | Tipe `entryType` pada `observe()` | Ambang Baik (p75) | Cara Menghitung dari Entri `PerformanceEntry` |
| :--- | :--- | :--- | :--- |
| **LCP** (*Largest Contentful Paint*) | `"largest-contentful-paint"` | **≤ 2500 ms** (2,5 dtk) | Ambil **`entriTerakhir.startTime`** dari kandidat elemen terbesar yang digambar sebelum pengguna mengulir/mengeklik. |
| **CLS** (*Cumulative Layout Shift*) | `"layout-shift"` | **≤ 0,1** | Jumlahkan `entry.value` **hanya untuk entri yang memiliki `entry.hadRecentInput === false`** (pergeseran dalam 500 ms setelah klik pengguna tidak dihitung sebagai CLS!). |
| **INP** (*Interaction to Next Paint*) | `"event"` (dengan `durationThreshold: 40`) | **≤ 200 ms** | Pantau nilai `entry.duration` (dibulatkan ke kelipatan 8 ms) dari interaksi klik, ketuk, dan papan ketik yang memiliki `entry.interactionId > 0`. |

## 2. Mengamati LCP dan CLS dengan `buffered: true`

Saat memanggil `observer.observe({ type: "...", buffered: true })`, opsi **`buffered: true`** sangat krusial: opsi ini memastikan bahwa meskipun skrip pemantau Anda baru selesai dimuat agak belakangan, peramban tetap menyerahkan riwayat entri performa yang sudah terjadi sejak awal halaman dibuka!

```javascript
export function pantauCoreWebVitals(onUpdate) {
  if (!("PerformanceObserver" in globalThis)) return;

  // 1. Memantau Largest Contentful Paint (LCP)
  const didukung = PerformanceObserver.supportedEntryTypes || [];
  if (didukung.includes("largest-contentful-paint")) {
    const pemantauLcp = new PerformanceObserver((daftarEntri) => {
      const entriTerakhir = daftarEntri.getEntries().at(-1);
      if (entriTerakhir) {
        onUpdate({ metrik: "LCP", nilai: Math.round(entriTerakhir.startTime) });
      }
    });
    pemantauLcp.observe({ type: "largest-contentful-paint", buffered: true });
  }

  // 2. Memantau Cumulative Layout Shift (CLS) — abaikan jika dipicu interaksi pengguna baru-baru ini
  if (didukung.includes("layout-shift")) {
    let totalCls = 0;
    const pemantauCls = new PerformanceObserver((daftarEntri) => {
      for (const entri of daftarEntri.getEntries()) {
        if (!entri.hadRecentInput) {
          totalCls += entri.value;
          onUpdate({ metrik: "CLS", nilai: Number(totalCls.toFixed(4)) });
        }
      }
    });
    pemantauCls.observe({ type: "layout-shift", buffered: true });
  }
}
```

## 3. Mengirim Telemetri Secara Andal Saat Halaman Ditutup (`visibilitychange` + `sendBeacon`)

Skor akhir LCP, CLS, dan INP baru benar-benar final ketika pengguna selesai berinteraksi dan meninggalkan halaman. Namun, jangan pernah menggunakan event `unload` atau `beforeunload` (karena event tersebut sering tidak dipicu di peramban ponsel dan merusak fitur *Back/Forward Cache* / `bfcache`!).

Gunakan event **`visibilitychange`** saat `document.visibilityState === "hidden"`, lalu kirimkan payload JSON menggunakan **`navigator.sendBeacon(url, blob)`** (atau `fetch(url, { method: "POST", body, keepalive: true })`) yang dijamin tetap dikirim oleh peramban di latar belakang meskipun tab sudah ditutup:

```javascript
export function kirimTelemetriSaatKeluar(endpointUrl, ambilDataMetrik) {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "hidden") return;
    const payload = JSON.stringify(ambilDataMetrik());
    const blob = new Blob([payload], { type: "application/json" });

    if ("sendBeacon" in navigator) {
      navigator.sendBeacon(endpointUrl, blob);
    } else {
      fetch(endpointUrl, { method: "POST", body: blob, keepalive: true });
    }
  });
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menjumlahkan seluruh `layout-shift` tanpa memeriksa `if (!entri.hadRecentInput)`:** Jika pengguna mengeklik tombol "Tampilkan Rincian" lalu akordeon terbuka dalam waktu kurang dari 500 ms setelah klik tersebut, pergeseran itu memang diharapkan pengguna (`hadRecentInput === true`). Jika Anda ikut menjumlahkannya, skor CLS Anda akan terlihat buruk secara keliru!
2. **Menggunakan `observe({ entryTypes: [...] })` lama tanpa `buffered: true`:** Sintaks array `entryTypes` tidak mendukung bendera `buffered: true`. Selalu gunakan sintaks tunggal **`observe({ type: "largest-contentful-paint", buffered: true })`** agar tidak kehilangan LCP yang terjadi sebelum skrip analitik selesai dieksekusi.
3. **Memasang pendengar `window.addEventListener("unload", ...)`:** Event `unload` membuat halaman tidak memenuhi syarat masuk ke *Back/Forward Cache* (`bfcache`) di beberapa peramban dan sering tidak terpanggil ketika pengguna menutup aplikasi peramban di iOS/Android.

## Latihan Praktik Mandiri

1. Buat berkas `rum-agent.mjs` yang menggabungkan `pantauCoreWebVitals` (LCP, CLS, dan `event` untuk INP) serta menyimpannya di dalam objek metrik halaman saat ini.
2. Tambahkan fungsi `kirimTelemetriSaatKeluar("/api/metrik", () => metrikSaatIni)` menggunakan `visibilitychange` dan `navigator.sendBeacon()`.
3. Buka halaman di Chrome/Edge, geser tata letak secara sengaja, lalu amati nilai LCP dan CLS yang tercatat di Console.

## Kuis Pemahaman

### Soal 1
Mengapa saat menghitung metrik **Cumulative Layout Shift (CLS)** menggunakan `PerformanceObserver` bertipe `"layout-shift"`, kita hanya boleh menjumlahkan `entri.value` apabila `entri.hadRecentInput` bernilai `false`?
- A. Karena `hadRecentInput === true` menandakan bahwa pergeseran terjadi di dalam `<iframe>`
- B. Karena pergeseran tata letak yang terjadi dalam waktu 500 ms setelah interaksi aktif pengguna (seperti klik tombol pembuka menu) adalah perubahan yang diharapkan pengguna dan tidak dihitung sebagai pergeseran tak terduga dalam spesifikasi CLS
- C. Karena `hadRecentInput === true` selalu bernilai negatif
- D. Karena `layout-shift` hanya berlaku untuk elemen gambar

**Jawaban Benar:** B
**Penjelasan:** CLS hanya mengukur ketidakstabilan tata letak yang **tidak diharapkan** pengguna. Pergeseran yang terjadi sebagai respons langsung atas klik/ketukan/ketikan pengguna (`hadRecentInput === true`) dikecualikan dari skor CLS.

### Soal 2
Apa fungsi dari menyertakan opsi `buffered: true` saat memanggil `observer.observe({ type: "largest-contentful-paint", buffered: true })`?
- A. Menyimpan gambar LCP ke dalam `localStorage`
- B. Meminta peramban menyerahkan entri performa yang sudah tercatat di penyangga (*buffer*) internal peramban sejak awal pemuatan halaman sebelum `PerformanceObserver` tersebut sempat didaftarkan
- C. Menunda perenderan halaman selama 2,5 detik
- D. Mengompresi laporan performa menjadi format GZIP

**Jawaban Benar:** B
**Penjelasan:** Skrip analitik/RUM biasanya dimuat dengan `defer` atau secara asinkron setelah gambar LCP selesai digambar. Opsi `buffered: true` memastikan entri historis yang terjadi sebelum `observe()` dipanggil tetap dikirim ke callback observer.

### Soal 3
Kombinasi event dan API pengiriman manakah yang paling andal untuk mengirimkan laporan metrik performa ke server tepat ketika pengguna menutup tab atau berpindah aplikasi di ponsel tanpa merusak *Back/Forward Cache* (`bfcache`)?
- A. Event `unload` dengan `XMLHttpRequest` sinkron
- B. Event `visibilitychange` (saat `document.visibilityState === "hidden"`) yang dipadukan dengan `navigator.sendBeacon()` atau `fetch(url, { keepalive: true })`
- C. Event `mousemove` dengan `setInterval`
- D. Event `beforeunload` dengan `window.alert()`

**Jawaban Benar:** B
**Penjelasan:** Di perangkat seluler, pengguna sering berpindah aplikasi lalu menutup peramban dari latar belakang tanpa pernah memicu `unload`. Mendengarkan `visibilitychange` menuju `"hidden"` dan mengirim data lewat `navigator.sendBeacon()` (atau `fetch` dengan `keepalive: true`) menjamin pengiriman tetap diselesaikan oleh peramban di latar belakang.

## Sumber

- [`PerformanceObserver` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)
- [Largest Contentful Paint (LCP) — web.dev](https://web.dev/articles/lcp)
- [Cumulative Layout Shift (CLS) — web.dev](https://web.dev/articles/cls)
- [Interaction to Next Paint (INP) — web.dev](https://web.dev/articles/inp)
