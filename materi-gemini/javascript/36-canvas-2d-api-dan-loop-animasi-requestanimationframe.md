# Grafik 2D `<canvas>` Mendalam, Siklus `requestAnimationFrame`, dan Koreksi `devicePixelRatio`

- **Tingkat:** Menengah
- **Ringkasan:** Menggambar bentuk vektor, teks, gambar, dan visualisasi data interaktif di atas `<canvas>` 2D, mempertajam resolusi pada layar Retina/HiDPI menggunakan `window.devicePixelRatio`, serta menjalankan loop animasi mulus yang memperhitungkan *delta time* dengan `requestAnimationFrame()`.

## Mengapa Gambar `<canvas>` Sering Tampak Buram di Layar Laptop Modern dan Ponsel?

Saat Anda membuat elemen `<canvas width="400" height="200">`, banyak pengembang menyangka bahwa `400 × 200` tersebut otomatis mengikuti ketajaman layar pengguna. Pada layar berkerapatan tinggi (*HiDPI / Retina*) di mana **`window.devicePixelRatio` (DPR)** bernilai **`2`** atau **`3`**, ukuran `400px` CSS sebenarnya terdiri dari `800` atau `1200` piksel fisik perangkat!

Jika buffer gambar internal (`canvas.width` dan `canvas.height`) hanya berukuran `400 × 200` sementara kotak tampilannya (`canvas.style.width` dan `canvas.style.height`) direntangkan ke `400px` CSS di layar Retina, maka setiap 1 piksel kanvas akan dipaksa merentang ke 2×2 piksel fisik layar—menghasilkan teks dan grafik yang tampak kabur/pecah.

> **⚠️ Jebakan Umum di Lapangan:** Menjalankan loop animasi visual menggunakan `setInterval(fn, 16)` alih-alih `requestAnimationFrame(fn)` menyebabkan gerakan tersendat karena frame terlewat (*jank*), boros baterai saat tab tidak aktif, dan kecepatan gerakan yang berubah-ubah antara monitor 60Hz dan 120Hz.

## 1. Perbandingan Properti Ukuran `<canvas>` dan Siklus Loop Animasi

Perhatikan perbedaan antara atribut/properti dimensi kanvas dan cara kerja penjadwalan frame animasi:

| Konsep / API | Fungsi Teknis | Aturan Penggunaan di Produksi |
| :--- | :--- | :--- |
| `canvas.width` & `canvas.height` | Resolusi piksel buffer bitmap internal kanvas. | Kalikan dengan `window.devicePixelRatio` (`Math.floor(lebarCss * dpr)`). Perhatian: mengubah `canvas.width` otomatis menghapus isi gambar dan mereset matriks transformasi `ctx`! |
| `canvas.style.width` & `style.height` | Ukuran kotak tampilan di halaman dalam piksel CSS. | Tetapkan sebesar ukuran tampilan CSS yang diinginkan (`"${lebarCss}px"`). |
| `ctx.scale(dpr, dpr)` | Mengalikan sistem koordinat gambar 2D dengan rasio piksel layar. | Memungkinkan Anda tetap menggambar menggunakan satuan koordinat CSS normal setelah buffer diperbesar! |
| `requestAnimationFrame(callback)` | Menjadwalkan pemanggilan `callback(timestampMs)` tepat sebelum peramban menggambar frame layar berikutnya. | Otomatis selaras dengan *refresh rate* monitor (60Hz, 120Hz, 144Hz) dan **otomatis berhenti** saat tab berada di latar belakang untuk menghemat baterai. |
| `cancelAnimationFrame(id)` | Membatalkan permintaan frame yang dijadwalkan sebelumnya. | Wajib dipanggil saat komponen kanvas dihapus dari layar. |

## 2. Menyiapkan Kanvas Tajam (HiDPI) dan Loop Animasi dengan *Delta Time*

Agar kecepatan gerakan objek di dalam animasi `<canvas>` **selalu sama** baik di monitor 60Hz (1 frame tiap ~16,67 ms) maupun di monitor gaming/ponsel 120Hz (1 frame tiap ~8,33 ms), jangan pernah menggerakkan posisi dengan angka tetap per frame seperti `posisiX += 5`! Kalikan kecepatan per detik dengan selisih waktu antar-frame (**`deltaTime`** dalam detik) yang dihitung dari parameter `timestamp` milik `requestAnimationFrame`:

```javascript
export function siapkanCanvasTajam(canvas, lebarCss, tinggiCss) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(lebarCss * dpr);
  canvas.height = Math.floor(tinggiCss * dpr);
  canvas.style.width = `${lebarCss}px`;
  canvas.style.height = `${tinggiCss}px`;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  return ctx;
}

export function mulaiAnimasiBola(canvas, lebarCss = 400, tinggiCss = 200) {
  const ctx = siapkanCanvasTajam(canvas, lebarCss, tinggiCss);
  let posisiX = 20;
  const kecepatanPxPerDetik = 120; // Bergerak konsisten 120 piksel setiap 1 detik
  let waktuSebelumnya = null;
  let idFrame = 0;

  function gambarFrame(waktuSekarangMs) {
    if (waktuSebelumnya === null) waktuSebelumnya = waktuSekarangMs;
    // Hitung deltaTime dalam detik (dibatasi maks 0.1 dtk jika pengguna baru kembali dari tab lain)
    const deltaDetik = Math.min((waktuSekarangMs - waktuSebelumnya) / 1000, 0.1);
    waktuSebelumnya = waktuSekarangMs;

    posisiX = (posisiX + kecepatanPxPerDetik * deltaDetik) % lebarCss;

    // Bersihkan seluruh kanvas sebelum menggambar frame baru
    ctx.clearRect(0, 0, lebarCss, tinggiCss);

    // Gambar lingkaran tajam
    ctx.beginPath();
    ctx.arc(posisiX, tinggiCss / 2, 16, 0, Math.PI * 2);
    ctx.fillStyle = "#2563eb";
    ctx.fill();

    idFrame = requestAnimationFrame(gambarFrame);
  }

  idFrame = requestAnimationFrame(gambarFrame);
  return () => cancelAnimationFrame(idFrame);
}
```

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Lupa memanggil `ctx.beginPath()` sebelum menggambar bentuk baru (`arc` / `lineTo`):** Tanpa `ctx.beginPath()`, perintah `ctx.fill()` atau `ctx.stroke()` akan menggambar ulang **seluruh jalur lama** yang pernah dibuat sejak awal frame, menyebabkan garis-garis nyasar dan penurunan FPS drastis!
2. **Menggerakkan objek dengan angka tetap per frame (`x += 2`) tanpa menghitung `deltaTime`:** Pada layar 120Hz, `requestAnimationFrame` dipanggil 120 kali per detik sehingga animasi berjalan **2 kali lebih cepat** dibandingkan di layar 60Hz!
3. **Mengatur ukuran `<canvas>` hanya melalui stylesheet CSS (`canvas { width: 600px; height: 400px; }`) tanpa mengubah atribut `canvas.width` dan `canvas.height`:** Ukuran bawaan buffer internal `<canvas>` adalah `300 × 150`. Jika Anda hanya mengubah ukuran CSS-nya menjadi `600 × 300` atau ukuran rasio lain, seluruh gambar di dalamnya akan tertarik gepeng dan buram.

## Latihan Praktik Mandiri

1. Buat halaman `grafik-monitor.html` yang memiliki `<canvas id="grafik-cpu">` dan terapkan fungsi `siapkanCanvasTajam(canvas, 600, 240)` untuk menyesuaikannya dengan `window.devicePixelRatio`.
2. Gambar grafik garis berjalan (*live line chart*) menggunakan `ctx.beginPath()`, `ctx.moveTo()`, `ctx.lineTo()`, dan `ctx.stroke()` di dalam loop `requestAnimationFrame` berbasis `deltaTime`.
3. Sediakan tombol "Jeda / Lanjutkan" yang memanggil `cancelAnimationFrame(idFrame)` serta menghormati preferensi `window.matchMedia("(prefers-reduced-motion: reduce)")`.

## Kuis Pemahaman

### Soal 1
Mengapa menjalankan loop animasi menggunakan `requestAnimationFrame(fn)` jauh lebih baik dibandingkan `setInterval(fn, 16)`?
- A. Karena `setInterval` sudah dihapus dari spesifikasi JavaScript
- B. Karena `requestAnimationFrame` menyelaraskan eksekusi callback tepat sebelum siklus *repaint* layar peramban (mencegah frame terlewat/*jank*), menyediakan stempel waktu presisi tinggi, dan otomatis menjeda animasi ketika tab berada di latar belakang untuk menghemat CPU/baterai
- C. Karena `requestAnimationFrame` otomatis berjalan di server backend
- D. Karena `setInterval` tidak dapat mengakses elemen `<canvas>`

**Jawaban Benar:** B
**Penjelasan:** `setInterval(fn, 16)` tidak peduli apakah peramban sedang sibuk atau apakah monitor berkecepatan 60Hz/120Hz, sehingga sering memicu *jank* (frame terlewat) dan terus menguras baterai di tab latar belakang.

### Soal 2
Bagaimana cara yang benar agar gambar di dalam `<canvas>` tampil tajam pada layar Retina / HiDPI yang memiliki `window.devicePixelRatio` bernilai `2` untuk ukuran tampilan `400 × 200` piksel CSS?
- A. Mengatur `canvas.width = 400 * 2` (`800`), `canvas.height = 200 * 2` (`400`), menetapkan `canvas.style.width = "400px"` dan `canvas.style.height = "200px"`, lalu memanggil `ctx.scale(2, 2)`
- B. Menambahkan properti CSS `filter: sharpen(200%)` pada elemen `<canvas>`
- C. Mengatur `canvas.width = 200` dan `canvas.height = 100`
- D. Mengganti `"2d"` menjadi `"retina"` pada `canvas.getContext("retina")`

**Jawaban Benar:** A
**Penjelasan:** Untuk mencapai ketajaman piksel 1:1 di layar HiDPI, resolusi bitmap internal (`canvas.width` & `height`) diperbesar sebesar kelipatan `devicePixelRatio`, ukuran kotak CSS dipertahankan (`style.width` & `style.height`), dan matriks konteks diskalakan dengan `ctx.scale(dpr, dpr)`.

### Soal 3
Mengapa di dalam callback `requestAnimationFrame((timestamp) => { ... })`, pergerakan posisi objek harus dihitung menggunakan `kecepatan * deltaTime` (selisih `timestamp` frame saat ini dikurangi frame sebelumnya) alih-alih menambahkan angka piksel tetap seperti `posisiX += 4`?
- A. Agar warna objek berubah setiap detik
- B. Agar kecepatan gerak objek di layar (piksel per detik) tetap konsisten di berbagai perangkat dengan *refresh rate* layar yang berbeda (misalnya antara layar 60Hz dan layar 120Hz) maupun saat terjadi penurunan frame sesaat
- C. Karena `requestAnimationFrame` menolak operasi penjumlahan biasa
- D. Agar kanvas otomatis terhapus tanpa `clearRect()`

**Jawaban Benar:** B
**Penjelasan:** `requestAnimationFrame` dipanggil mengikuti *refresh rate* monitor (60 kali/detik di layar 60Hz, 120 kali/detik di layar 120Hz). Mengalikan kecepatan dengan `deltaTime` menjamin objek menempuh jarak yang sama per detik di semua layar.

## Sumber

- [Canvas API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [`Window.requestAnimationFrame()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [`Window.devicePixelRatio` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)
