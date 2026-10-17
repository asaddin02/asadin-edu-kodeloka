# Komunikasi Lintas Tab dan Iframe: `BroadcastChannel`, `MessageChannel`, dan `postMessage`

- **Tingkat:** Menengah
- **Ringkasan:** Menyinkronkan status login, tema gelap/terang, atau keranjang belanja secara instan di seluruh tab peramban yang terbuka menggunakan **`BroadcastChannel`**, berkomunikasi langsung antar-konteks dengan **`MessageChannel`**, serta mengamankan validasi `event.origin` pada `window.postMessage()`.

## Mengapa Aplikasi Web Modern Perlu Menyinkronkan Status Lintas Tab?

Pengguna internet sering membuka 5 hingga 10 tab dari situs yang sama secara bersamaan. Bayangkan jika pengguna menekan tombol **Keluar (*Logout*)** di Tab ke-1, tetapi di Tab ke-2 hingga ke-5 tampilan dasbor pribadinya masih terlihat aktif! Atau ketika pengguna mengubah tema menjadi Mode Gelap di Tab ke-1, tab lainnya tetap menyilaukan dalam Mode Terang.

Platform web menyediakan tiga mekanisme standar berbasis algoritma **Structured Clone** untuk mengirim pesan antar-konteks eksekusi (antar-tab, window, iframe, maupun Web Worker): **`BroadcastChannel`**, **`MessageChannel`**, dan **`window.postMessage()`**.

> **⚠️ Jebakan Umum di Lapangan:** Menerima pesan dari `window.addEventListener('message', ...)` tanpa memeriksa `event.origin === 'https://domain-tepercaya.id'` membuka celah keamanan serius di mana situs berbahaya dapat menyuntikkan perintah palsu ke jendela aplikasi Anda.

## 1. Memilih Antara `BroadcastChannel`, `MessageChannel`, dan `window.postMessage()`

Ketiga API komunikasi ini memiliki topologi dan batasan origin yang berbeda:

| API Komunikasi | Topologi Pengiriman | Batasan Origin | Kasus Penggunaan Terbaik |
| :--- | :--- | :--- | :--- |
| **`BroadcastChannel`** | **Satu-ke-Banyak (*Pub/Sub*)**: semua tab, iframe, dan worker yang membuka nama saluran yang sama akan menerima pesan. | **Wajib *Same-Origin*** (`https://kodeloka.id` hanya bisa mendengar `https://kodeloka.id`). | Menyinkronkan aksi *Logout*, pergantian tema gelap/terang, atau pembaruan keranjang belanja di seluruh tab. |
| **`MessageChannel`** | **Satu-ke-Satu (*Point-to-Point*)**: memiliki dua ujung pipa langsung (`port1` dan `port2`). | Dapat ditransfer lintas-origin atau ke Web Worker melalui daftar `transfer`. | Jalur komunikasi privat berkecepatan tinggi antara halaman utama dan `<iframe>` atau antar dua Web Worker. |
| **`window.postMessage()`** | **Satu-ke-Satu** ke referensi `Window` tertentu (`iframe.contentWindow` atau `window.opener`). | **Mendukung *Cross-Origin*** dengan validasi eksplisit `targetOrigin` dan `event.origin`. | Berkomunikasi dengan widget pembayaran pihak ketiga atau editor tersemat di dalam `<iframe>` beda domain. |

## 2. Menyinkronkan Seluruh Tab *Same-Origin* dengan `BroadcastChannel`

Menggunakan `BroadcastChannel` sangat ringkas: setiap tab atau Web Worker dari origin yang sama yang membuat `new BroadcastChannel("nama_sama")` otomatis tergabung ke ruang siaran tersebut. Perhatikan bahwa tab yang memanggil `.postMessage()` **tidak** memicu event `message` pada instans `BroadcastChannel` miliknya sendiri, melainkan hanya pada instans lain yang sedang terbuka:

```javascript
// Menyinkronkan aksi Logout dan Tema di seluruh tab peramban yang sedang terbuka
const saluranAuth = new BroadcastChannel("kodeloka_auth_channel");

export function siarkanLogout() {
  saluranAuth.postMessage({ aksi: "LOGOUT", waktu: Date.now() });
}

export function siarkanTema(temaBaru) {
  saluranAuth.postMessage({ aksi: "UBAH_TEMA", tema: temaBaru });
}

saluranAuth.addEventListener("message", (event) => {
  if (event.data?.aksi === "LOGOUT") {
    window.location.assign("/login?alasan=sesi_berakhir");
  } else if (event.data?.aksi === "UBAH_TEMA") {
    document.documentElement.dataset.tema = event.data.tema;
  }
});
```

Jangan lupa memanggil **`saluranAuth.close()`** apabila komponen atau modul yang membuat saluran tersebut dihancurkan agar objek saluran dapat dibersihkan oleh *Garbage Collector*.

## 3. Pengamanan Mutlak pada `window.postMessage()` Lintas-Origin

Ketika halaman Anda berkomunikasi dengan `<iframe>` dari domain lain menggunakan `iframeWin.postMessage(data, targetOrigin)`, ada **dua aturan keamanan wajib** yang tidak boleh dilanggar:
1. **Saat Mengirim (`postMessage`):** Jangan pernah mengisi argumen kedua (`targetOrigin`) dengan tanda bintang wildcard **`"*"`** jika pesan berisi data sensitif! Tuliskan origin tujuan secara spesifik, misalnya `"https://pembayaran.mitra.id"`, agar peramban membatalkan pengiriman apabila iframe tersebut ternyata telah diarahkan ke situs lain.
2. **Saat Menerima (`addEventListener("message")`):** Selalu periksa **`event.origin`** terhadap daftar origin tepercaya sebelum membaca `event.data`!

```javascript
const ORIGIN_MITRA_TEPERCAYA = "https://pembayaran.mitra.id";

// 1. Mengirim pesan ke iframe dengan targetOrigin eksplisit (BUKAN "*")
export function kirimTagihanKeIframe(elemenIframe, idTagihan) {
  elemenIframe.contentWindow?.postMessage(
    { tipe: "MULAI_BAYAR", idTagihan },
    ORIGIN_MITRA_TEPERCAYA
  );
}

// 2. Menerima pesan dengan memvalidasi event.origin secara ketat
window.addEventListener("message", (event) => {
  if (event.origin !== ORIGIN_MITRA_TEPERCAYA) return; // Tolak semua origin asing!
  if (event.data?.tipe === "PEMBAYARAN_BERHASIL") {
    console.log("Tagihan lunas:", event.data.idTransaksi);
  }
});
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Memvalidasi `event.origin` menggunakan `.includes()` atau RegExp longgar:** Menulis `if (event.origin.includes("kodeloka.id"))` dapat ditembus dengan mudah oleh penyerang yang mendaftarkan domain `https://kodeloka.id.penyerang.com`! Selalu gunakan perbandingan kesamaan persis `===` atau `Set.prototype.has(event.origin)`.
2. **Mencoba mengirim fungsi atau elemen DOM lewat `postMessage()`:** Baik `BroadcastChannel`, `MessageChannel`, maupun `postMessage` menyalin data menggunakan algoritma **Structured Clone** (yang mendukung objek, Array, `Map`, `Set`, `Date`, `Blob`, `ArrayBuffer`, tetapi akan melempar `DataCloneError` jika diberi `Function` atau node DOM).
3. **Membiarkan ratusan instans `BroadcastChannel` terbuka tanpa `.close()`:** Instans `BroadcastChannel` yang memiliki pendengar event aktif memiliki ikatan kuat ke dokumen; panggil `.close()` saat tidak lagi diperlukan.

## Latihan Praktik Mandiri

1. Buat berkas `sinkron-tab.mjs` yang mengekspor class `SinkronisasiTab` berbasis `BroadcastChannel` dengan metode `siarkan(tipe, payload)`, `dengarkan(callback)`, dan `tutup()`.
2. Tambahkan fungsi `buatValidatorPostMessage(daftarOriginDiizinkan, onPesanValid)` yang menyaring event `message` berdasarkan `Set` origin yang diizinkan.
3. Tulis pengujian `node:test` (Node.js mendukung `BroadcastChannel` dan `MessageChannel` secara global di `worker_threads` / `globalThis`) untuk menguji pengiriman pesan antar dua instans saluran dan penolakan origin asing.

## Kuis Pemahaman

### Soal 1
Mengapa di dalam pendengar `window.addEventListener("message", (event) => { ... })`, Anda wajib memeriksa nilai `event.origin` dengan kesamaan persis (`===`) sebelum memproses `event.data`?
- A. Karena tanpa pemeriksaan `event.origin`, peramban akan menghapus `event.data` secara otomatis
- B. Karena jendela atau tab dari situs mana pun dapat memanggil `postMessage()` ke jendela aplikasi Anda; tanpa memverifikasi `event.origin`, situs berbahaya dapat mengirim perintah palsu atau menyuntikkan payload berbahaya
- C. Karena `event.origin` berisi kata sandi pengguna
- D. Untuk mengubah protokol HTTP menjadi WebSocket

**Jawaban Benar:** B
**Penjelasan:** `window.postMessage()` dirancang untuk komunikasi lintas-origin. Setiap halaman yang memegang referensi ke jendela Anda dapat mengirim event `message`, sehingga penerima wajib memverifikasi `event.origin` terhadap daftar origin tepercaya.

### Soal 2
Manakah pernyataan yang tepat mengenai cara kerja `new BroadcastChannel("sinkronisasi_tema")`?
- A. Mengirimkan pesan ke seluruh komputer pengguna lain melalui server pusat secara otomatis
- B. Menghubungkan seluruh tab, jendela, iframe, dan Web Worker yang berasal dari **origin yang sama (*same-origin*)** di perangkat peramban yang sama yang berlangganan pada nama saluran `"sinkronisasi_tema"`
- C. Hanya dapat mengirim string sepanjang maksimal 10 karakter
- D. Dapat mengirimkan pesan lintas domain yang berbeda (misalnya dari `toko-a.com` ke `bank-b.com`)

**Jawaban Benar:** B
**Penjelasan:** `BroadcastChannel` adalah bus pesan *pub/sub* lokal di dalam peramban pengguna yang dibatasi secara ketat hanya untuk konteks eksekusi dengan *origin* (skema + domain + port) yang sama persis.

### Soal 3
Mengapa Anda **tidak boleh** menggunakan `"*"` sebagai argumen kedua (`targetOrigin`) saat memanggil `otherWindow.postMessage(dataRahasia, "*")`?
- A. Karena tanda `"*"` akan melempar `SyntaxError` di ES2026
- B. Karena `"*"` mengizinkan pesan diterima oleh `otherWindow` berapa pun origin-nya saat itu; jika jendela atau iframe tersebut telah berpindah/diarahkan ke domain pihak ketiga yang jahat, `dataRahasia` tetap akan terkirim dan bocor
- C. Karena `"*"` mengubah data menjadi teks terenkripsi
- D. Karena `postMessage` hanya menerima argumen kedua berupa angka port

**Jawaban Benar:** B
**Penjelasan:** Menuliskan `targetOrigin` secara spesifik (misalnya `"https://mitra.kodeloka.id"`) meminta peramban memverifikasi bahwa dokumen di dalam `otherWindow` benar-benar masih berada di origin tersebut tepat pada saat pesan dikirimkan.

## Sumber

- [Broadcast Channel API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
- [`MessageChannel` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel)
- [`Window.postMessage()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
