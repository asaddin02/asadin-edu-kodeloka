# API Perangkat & Perizinan: `Geolocation`, `Permissions`, `Notification`, dan `Screen Wake Lock`

- **Tingkat:** Menengah
- **Ringkasan:** Memeriksa status izin secara sopan dengan `navigator.permissions.query()`, mengambil koordinat lokasi pengguna dengan `navigator.geolocation`, menampilkan notifikasi sistem dengan `Notification`, serta mencegah layar redup saat membaca materi dengan **Screen Wake Lock API (`navigator.wakeLock`)**.

## Mengapa Meminta Izin Lokasi atau Notifikasi Saat Halaman Baru Dibuka Selalu Gagal?

Pernahkah Anda baru saja membuka sebuah situs web, belum sempat membaca satu kalimat pun, lalu tiba-tiba muncul pop-up peramban *"Situs ini ingin mengirim Notifikasi"* atau *"Situs ini ingin mengetahui Lokasi Anda"*? Hampir semua pengguna langsung mengeklik **Blokir (*Block*)**! Bahkan, peramban modern secara otomatis membisukan permintaan izin yang dipicu saat halaman baru dimuat tanpa interaksi klik pengguna.

Praktik rekayasa terbaik (*Permission UX*) adalah memeriksa status izin saat ini secara diam-diam menggunakan **`navigator.permissions.query()`**, dan hanya memicu dialog permintaan izin sistem **tepat ketika pengguna mengeklik tombol yang membutuhkan fitur tersebut** (misalnya tombol *"Cari Cabang Terdekat"* atau *"Aktifkan Pengingat Belajar"*).

> **⚠️ Jebakan Umum di Lapangan:** Memunculkan permintaan izin `Notification.requestPermission()` atau `geolocation.getCurrentPosition()` seketika saat pengguna baru saja membuka beranda situs (tanpa konteks aksi klik tombol) hampir selalu ditolak oleh pengguna dan diblokir otomatis oleh peramban modern.

## 1. Peta API Perangkat & Perizinan di Peramban Modern

Seluruh API perangkat sensitif di bawah ini wajib dijalankan pada **Secure Context (`https://` atau `localhost`)**:

| API Perangkat | Cara Meminta / Menggunakan | Tiga Status Izin (`PermissionState`) |
| :--- | :--- | :--- |
| **Permissions API** | `const status = await navigator.permissions.query({ name: "geolocation" })` | `"granted"` (diizinkan), `"denied"` (ditolak), atau `"prompt"` (belum pernah ditanya). |
| **Geolocation API** | `navigator.geolocation.getCurrentPosition(sukses, gagal, opsi)` | Mengambil lintang (`coords.latitude`), bujur (`coords.longitude`), dan akurasi meter (`coords.accuracy`). |
| **Notifications API** | `const izin = await Notification.requestPermission()` lalu `new Notification(judul, opsi)` | Menampilkan notifikasi sistem operasi (wajib dipicu dari dalam *event handler* klik pengguna). |
| **Screen Wake Lock API** | `const sentinel = await navigator.wakeLock.request("screen")` | Mencegah layar perangkat meredup atau terkunci otomatis saat pengguna sedang membaca resep/materi atau menonton presentasi. |

## 2. Mengelola `Screen Wake Lock` (Termasuk Pemulihan Saat Tab Kembali Aktif)

Ketika Anda mengaktifkan **`navigator.wakeLock.request("screen")`** (*Baseline Newly Available* sejak Mei 2024 di semua peramban utama), peramban memiliki pengaman baterai penting: **begitu pengguna berpindah ke tab lain atau meminimalkan jendela peramban (`document.visibilityState === "hidden"`), kunci layar akan dilepaskan secara otomatis oleh peramban!**

Oleh sebab itu, jika pengguna masih menyalakan sakelar *"Jaga layar tetap menyala"* di halaman Anda, Anda perlu mendengarkan event `visibilitychange` untuk meminta ulang kunci layar saat pengguna kembali ke tab tersebut:

```javascript
export async function tahanLayarTetapMenyala() {
  if (!("wakeLock" in navigator)) return null;
  try {
    const kunciLayar = await navigator.wakeLock.request("screen");
    return kunciLayar;
  } catch (err) {
    console.warn("Wake Lock tidak dapat diaktifkan:", err.message);
    return null;
  }
}

export function kelolaWakeLockOtomatis() {
  let sentinelAktif = null;
  let diinginkanPengguna = false;

  async function aktifkan() {
    diinginkanPengguna = true;
    sentinelAktif = await tahanLayarTetapMenyala();
  }

  async function matikan() {
    diinginkanPengguna = false;
    await sentinelAktif?.release();
    sentinelAktif = null;
  }

  // Minta ulang Wake Lock ketika pengguna kembali membuka tab halaman ini
  document.addEventListener("visibilitychange", async () => {
    if (diinginkanPengguna && document.visibilityState === "visible") {
      sentinelAktif = await tahanLayarTetapMenyala();
    }
  });

  return { aktifkan, matikan };
}
```

## 3. Membungkus `Geolocation` dengan `Promise` dan Memeriksa `Permissions API`

Karena `navigator.geolocation.getCurrentPosition()` berasal dari era sebelum `Promise`, membungkusnya ke dalam fungsi `Promise` dengan opsi `timeout` dan `maximumAge` membuatnya jauh lebih bersih dipakai bersama `async`/`await`:

```javascript
export async function ambilLokasiPengguna(opsi = { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }) {
  if (!("geolocation" in navigator)) {
    throw new Error("Peramban tidak mendukung Geolocation API.");
  }

  // Periksa status izin terlebih dahulu tanpa memunculkan pop-up jika sudah ditolak permanen
  if ("permissions" in navigator) {
    const izin = await navigator.permissions.query({ name: "geolocation" });
    if (izin.state === "denied") {
      throw new Error("Izin lokasi telah diblokir di pengaturan peramban.");
    }
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        akurasiMeter: pos.coords.accuracy
      }),
      (err) => reject(new Error(`Gagal mengambil lokasi (${err.code}): ${err.message}`)),
      opsi
    );
  });
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Memanggil `getCurrentPosition` tanpa mengatur opsi `timeout`:** Nilai bawaan `timeout` pada spesifikasi Geolocation adalah **`Infinity`**! Jika sinyal GPS di dalam gedung lemah, aplikasi Anda bisa menggantung selamanya menunggu koordinat tanpa pernah memanggil callback galat. Selalu tetapkan `timeout` yang wajar (misalnya `8000`–`10000` milidetik).
2. **Selalu menyetel `enableHighAccuracy: true` untuk kebutuhan umum (seperti memilih kota):** `enableHighAccuracy: true` memaksa chip GPS perangkat keras ponsel menyala, yang memakan waktu pemanasan lebih lama dan menguras baterai. Gunakan `enableHighAccuracy: false` (lokasi Wi-Fi/seluler yang instan) kecuali Anda membangun navigasi peta belok-demi-belok.
3. **Menggunakan `watchPosition()` tanpa menyimpan ID-nya untuk `clearWatch(id)`:** Sama seperti `setInterval`, `navigator.geolocation.watchPosition()` terus memantau pergerakan pengguna dan menguras baterai sampai Anda menghentikannya dengan `navigator.geolocation.clearWatch(watchId)`.

## Latihan Praktik Mandiri

1. Buat halaman `mode-fokus-belajar.html` yang memiliki sakelar `<button type="button" aria-pressed="false">Jaga Layar Tetap Menyala</button>` menggunakan `kelolaWakeLockOtomatis()`.
2. Tambahkan tombol "Aktifkan Pengingat Selesai" yang saat diklik memeriksa `Notification.permission`: jika masih `"default"`, panggil `await Notification.requestPermission()`, lalu tampilkan `new Notification("Sesi fokus dimulai!")` jika bernilai `"granted"`.
3. Uji pelepasan otomatis `WakeLockSentinel` dengan berpindah ke tab lain lalu kembali ke tab halaman tersebut.

## Kuis Pemahaman

### Soal 1
Mengapa memanggil `Notification.requestPermission()` atau `navigator.geolocation.getCurrentPosition()` tepat saat halaman pertama kali dibuka (di dalam event `DOMContentLoaded` tanpa interaksi klik pengguna) merupakan praktik yang buruk?
- A. Karena fungsi tersebut akan menghapus `localStorage`
- B. Karena pengguna belum memahami alasan mengapa izin tersebut dibutuhkan sehingga hampir selalu menolaknya, dan peramban modern secara otomatis memblokir permintaan izin yang tidak dipicu oleh gestur interaksi pengguna (*user activation*)
- C. Karena keduanya hanya dapat dipanggil pada hari kerja
- D. Karena kode di dalam `DOMContentLoaded` berjalan tanpa enkripsi TLS

**Jawaban Benar:** B
**Penjelasan:** Meminta izin perangkat sensitif tanpa konteks aksi pengguna melanggar pola pengalaman pengguna yang baik dan diblokir secara otomatis oleh peramban modern demi mencegah *permission spam*.

### Soal 2
Apa yang terjadi secara otomatis pada kunci layar `WakeLockSentinel` yang diperoleh dari `await navigator.wakeLock.request("screen")` ketika pengguna meminimalkan jendela peramban atau berpindah ke tab lain (`document.visibilityState === "hidden"`)?
- A. Layar komputer tetap dipaksa menyala selamanya sampai komputer dimatikan
- B. Peramban secara otomatis melepaskan (*release*) kunci layar tersebut demi menghemat baterai, sehingga aplikasi perlu memintanya kembali saat event `visibilitychange` kembali bernilai `"visible"`
- C. Peramban menutup tab halaman tersebut secara paksa
- D. Status izin berubah menjadi `"denied"` permanen

**Jawaban Benar:** B
**Penjelasan:** Spesifikasi Screen Wake Lock API menetapkan bahwa kunci layar terkait erat dengan visibilitas dokumen: begitu tab menjadi tersembunyi, kunci langsung dilepas oleh peramban.

### Soal 3
Mengapa sangat disarankan untuk selalu menyertakan properti `timeout` (misalnya `timeout: 8000`) pada objek opsi `navigator.geolocation.getCurrentPosition(success, error, options)`?
- A. Karena tanpa `timeout`, peramban hanya mengembalikan lokasi kutub utara
- B. Karena nilai bawaan `timeout` adalah `Infinity` (tak terbatas), sehingga jika perangkat kesulitan mendapatkan sinyal lokasi, callback `error` tidak akan pernah terpanggil dan indikator pemuatan aplikasi akan menggantung selamanya
- C. Karena `timeout` menentukan jumlah satelit GPS yang digunakan
- D. Karena `timeout` wajib bernilai `0`

**Jawaban Benar:** B
**Penjelasan:** Secara bawaan, `timeout` pada `PositionOptions` bernilai `Infinity`. Menetapkan batas waktu eksplisit (dalam milidetik) memastikan aplikasi dapat memberikan pesan alternatif yang ramah jika pencarian lokasi memakan waktu terlalu lama.

## Sumber

- [Geolocation API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [Permissions API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API)
- [Notifications API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [Screen Wake Lock API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)
