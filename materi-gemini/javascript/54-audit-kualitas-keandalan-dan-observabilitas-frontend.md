# Observabilitas Front-End: Penangkap Galat Global (`error`, `unhandledrejection`) dan Ketahanan Jaringan

- **Tingkat:** Lanjut
- **Ringkasan:** Menyiapkan telemetri dan ketahanan aplikasi di lingkungan produksi: menangkap galat yang tak tertangani dengan `window.addEventListener('error')` dan `'unhandledrejection'`, menerapkan strategi *Exponential Backoff with Jitter* saat jaringan gagal, serta mendeteksi status `online`/`offline`.

## Mengapa Bug di Peramban Pengguna Sering Tidak Pernah Diketahui oleh Tim Pengembang?

Ketika server backend mengalami galat `500 Internal Server Error`, jejaknya langsung tercatat di log server Anda. Sebaliknya, ketika aplikasi front-end melempar `TypeError` atau kegagalan `Promise` di dalam peramban ponsel seorang pengguna di kota lain, galat tersebut **hanya muncul di Console DevTools perangkat pengguna itu sendiri**! Tanpa penangkap galat global (*Global Error Boundary*) yang mengirimkan laporan telemetri ke server, tim Anda akan mengira semuanya baik-baik saja.

Di sisi lain, saat jaringan pengguna sedang tidak stabil atau server sedang mengalami lonjakan beban (`503 Service Unavailable` / `429 Too Many Requests`), mencoba ulang permintaan (`retry`) secara agresif tanpa jeda acak justru akan menciptakan **badai permintaan (*Thundering Herd*)** yang meruntuhkan server Anda sendiri!

> **⚠️ Jebakan Umum di Lapangan:** Mencoba ulang (*retry*) permintaan API yang gagal secara serentak setiap 1 detik tetap (*fixed interval*) dari ribuan peramban klien akan menciptakan badai permintaan (*thundering herd*) yang melumpuhkan server yang baru saja pulih; selalu tambahkan *exponential backoff* dan acakan (*jitter*).

## 1. Peta Observabilitas Galat Global dan Ketahanan Jaringan

Berikut adalah komponen utama untuk memantau keandalan dan menjaga ketahanan aplikasi front-end di produksi:

| Mekanisme / Event | Apa yang Ditangkap / Dilakukan? | Detail Teknis Penting |
| :--- | :--- | :--- |
| **`window.addEventListener("error", fn)`** | Menangkap eksepsi JavaScript sinkron yang tidak tertangkap oleh blok `try...catch`. | Jika dipasang dengan opsi **`{ capture: true }`**, ia juga dapat menangkap kegagalan pemuatan aset (`<img>`, `<script>`, `<link>`) yang tidak merambat (*do not bubble*)! |
| **`window.addEventListener("unhandledrejection", fn)`** | Menangkap setiap `Promise` yang ditolak (*rejected*) tanpa memiliki `.catch()` atau `try...catch` pada `await`. | Objek alasan penolakan berada di properti **`event.reason`** (bukan `event.error`). |
| **Exponential Backoff + Jitter** | Menunda percobaan ulang (`retry`) secara eksponensial (`2^percobaan * dasarMs`) ditambah waktu acak (`Math.random()`). | Hanya ulangi untuk galat jaringan sementara, status **`5xx`** (`502`, `503`, `504`), atau **`429`** (jangan ulangi `400`, `401`, `403`, `404`!). |
| **`navigator.onLine` & event `online`/`offline`** | Mendeteksi saat perangkat terputus sepenuhnya dari jaringan lokal/seluler. | `navigator.onLine === false` **pasti berarti luring**, tetapi `true` hanya berarti terhubung ke router (belum tentu internet lancar). |

## 2. Menerapkan `fetchDenganRetry` (Exponential Backoff + Jitter + `Retry-After`)

Saat server mengembalikan status `429 Too Many Requests` atau `503 Service Unavailable`, periksa juga apakah server mengirimkan header HTTP **`Retry-After`** (dalam satuan detik). Jika tidak ada, gunakan rumus **Exponential Backoff dengan Jitter** agar ribuan klien menyebar jadwal percobaan ulang mereka secara merata:

```javascript
export async function fetchDenganRetry(url, opsi = {}, maksPercobaan = 3) {
  for (let percobaan = 1; percobaan <= maksPercobaan; percobaan++) {
    try {
      const res = await fetch(url, opsi);
      // Jangan pernah mengulang galat klien 4xx (kecuali 429 Too Many Requests)
      if (res.status < 500 && res.status !== 429) return res;
      if (percobaan === maksPercobaan) return res;

      // Hormati header Retry-After (dalam detik) jika dikirim oleh server
      const retryAfterDetik = Number(res.headers.get("Retry-After"));
      if (Number.isFinite(retryAfterDetik) && retryAfterDetik > 0) {
        await new Promise((r) => setTimeout(r, Math.min(retryAfterDetik * 1000, 15_000)));
        continue;
      }
    } catch (err) {
      // Jika permintaan dibatalkan sengaja oleh AbortController, jangan di-retry!
      if (err?.name === "AbortError" || percobaan === maksPercobaan) throw err;
    }

    // Exponential backoff (2^percobaan * 300ms) + acakan Jitter (0..250ms)
    const jedaMs = 2 ** percobaan * 300 + Math.floor(Math.random() * 250);
    await new Promise((r) => setTimeout(r, jedaMs));
  }
}
```

## 3. Memasang Penangkap Galat Global dengan Pembatas Laju (*Deduplication*)

Agar satu bug di dalam event `scroll` tidak mengirimkan 1.000 laporan galat yang sama dalam 5 detik ke server log Anda, simpan sidik jari pesan galat yang sudah pernah dilaporkan di dalam sebuah `Set`:

```javascript
export function pasangPemantauGalatGlobal(kirimLaporan) {
  const sudahDilaporkan = new Set();

  function catatSekali(infoGalat) {
    const kunci = `${infoGalat.tipe}:${infoGalat.pesan}:${infoGalat.berkas ?? ""}`;
    if (sudahDilaporkan.has(kunci) || sudahDilaporkan.size >= 20) return;
    sudahDilaporkan.add(kunci);
    kirimLaporan(infoGalat);
  }

  // 1. Tangkap eksepsi runtime sinkron
  window.addEventListener("error", (event) => {
    catatSekali({
      tipe: "runtime_error",
      pesan: event.message || "Galat tidak dikenal",
      berkas: event.filename,
      baris: event.lineno,
      kolom: event.colno,
      stack: event.error?.stack ?? null
    });
  });

  // 2. Tangkap kegagalan Promise yang tidak ditangani (async/await tanpa try-catch)
  window.addEventListener("unhandledrejection", (event) => {
    const alasan = event.reason;
    catatSekali({
      tipe: "unhandled_rejection",
      pesan: alasan instanceof Error ? alasan.message : String(alasan),
      stack: alasan instanceof Error ? alasan.stack : null
    });
  });
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Melakukan *retry* otomatis pada permintaan `POST` pembayaran yang tidak memiliki `Idempotency-Key`:** Jika permintaan `POST /bayar` pertama sebenarnya sudah diterima server tetapi responsnya terputus di jalan, melakukan *retry* buta tanpa header `Idempotency-Key` akan mendebit saldo pengguna dua kali! Hanya lakukan *retry* otomatis pada metode yang idempoten (`GET`, `HEAD`, `PUT`, `DELETE`) atau `POST` yang menyertakan `Idempotency-Key`.
2. **Melakukan *retry* pada status HTTP `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, atau `404 Not Found`:** Galat `4xx` (selain `429`) berarti permintaan klien memang salah atau tidak memiliki izin; mengulangnya 5 kali tidak akan mengubah hasilnya dan hanya membuang kuota jaringan.
3. **Mengulang permintaan yang sengaja dibatalkan pengguna (`err.name === "AbortError"`):** Jika `fetch()` gagal karena `AbortController.abort()` dipanggil saat pengguna berpindah halaman, jangan pernah melakukan *retry*; langsung lempar kembali galat tersebut.

## Latihan Praktik Mandiri

1. Buat berkas `ketahanan-jaringan.mjs` yang mengekspor fungsi `fetchDenganRetry` dan `pasangPemantauGalatGlobal`.
2. Tulis pengujian unit dengan `node:test` menggunakan fungsi `fetch` tiruan (atau server `node:http` lokal) yang gagal dengan status `503` pada 2 panggilan pertama lalu mengembalikan `200 OK` pada panggilan ke-3, serta buktikan bahwa status `404` langsung dikembalikan pada percobaan pertama tanpa *retry*.

## Kuis Pemahaman

### Soal 1
Mengapa strategi percobaan ulang jaringan (*retry*) wajib menggabungkan **Exponential Backoff** (`2 ** percobaan * dasarMs`) dengan **Jitter** (tambahan milidetik acak), alih-alih mencoba ulang setiap 1 detik tetap?
- A. Agar alamat IP pengguna berubah setiap detik
- B. Karena jika ribuan peramban klien mengalami kegagalan saat server mengalami gangguan sesaat lalu semuanya mencoba ulang tepat pada detik ke-1, ke-2, dan ke-3 secara serentak, gelombang permintaan bersamaan tersebut (*thundering herd*) akan langsung menumbangkan kembali server yang baru saja pulih
- C. Karena fungsi `setTimeout` tidak menerima angka bulat seperti `1000`
- D. Agar protokol HTTP otomatis beralih ke FTP

**Jawaban Benar:** B
**Penjelasan:** *Exponential backoff* memperlebar jarak waktu antar-percobaan jika server masih sibuk, sementara *jitter* (acakan waktu) memecah sinkronisasi ribuan klien agar beban permintaan ulang tersebar merata sepanjang waktu.

### Soal 2
Event global apakah pada `window` yang wajib didengarkan untuk menangkap kegagalan fungsi `async` atau `Promise` yang ditolak (*rejected*) tanpa blok `try...catch` / `.catch()`, dan di properti manakah objek galatnya disimpan?
- A. Event `"promiseerror"` pada properti `event.data`
- B. Event **`"unhandledrejection"`** pada `window`, dengan nilai alasan penolakan disimpan di dalam properti **`event.reason`**
- C. Event `"rejection"` pada `document.body`
- D. Event `"abort"` pada `navigator`

**Jawaban Benar:** B
**Penjelasan:** Ketika sebuah `Promise` ditolak dan tidak ada penangan penolakan yang terpasang hingga giliran *microtask* berakhir, peramban memancarkan event `unhandledrejection` bertipe `PromiseRejectionEvent` pada `window` dengan detail kesalahan di `event.reason`.

### Soal 3
Manakah dari skenario kegagalan `fetch()` berikut yang **TIDAK BOLEH** dicoba ulang (*retry*) secara otomatis?
- A. Respons HTTP `503 Service Unavailable` saat server sedang padat
- B. Respons HTTP `429 Too Many Requests`
- C. Respons HTTP `400 Bad Request` / `404 Not Found` atau penolakan Promise dengan `err.name === "AbortError"` (permintaan yang sengaja dibatalkan oleh `AbortController`)
- D. Kegagalan jaringan sementara `TypeError: Failed to fetch` pada metode `GET`

**Jawaban Benar:** C
**Penjelasan:** Status `400`/`401`/`403`/`404` adalah kesalahan permanen pada parameter atau izin permintaan klien yang tidak akan berubah bila diulang, sedangkan `AbortError` menandakan pembatalan sengaja oleh aplikasi/pengguna.

## Sumber

- [`Window`: `unhandledrejection` event — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event)
- [`Window`: `error` event — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event)
- [`Navigator.onLine` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)
