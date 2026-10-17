# Web Animations API (WAAPI): Mengendalikan Animasi CSS langsung dari JavaScript (`element.animate`)

- **Tingkat:** Menengah
- **Ringkasan:** Membuat, menjeda, membalik arah, mengubah kecepatan, dan menunggu penyelesaian animasi secara programatis dengan Promise menggunakan **Web Animations API (`element.animate()`, objek `Animation`, dan `animation.finished`)**.

## Mengapa `element.animate()` Menggabungkan Keunggulan CSS Transitions dan JavaScript?

Selama bertahun-tahun, pengembang web menghadapi dilema saat membuat animasi antarmuka:
- **CSS `@keyframes` dan `transition`** sangat mulus karena dijalankan oleh mesin kompositor peramban (di luar utas utama JavaScript apabila menganimasikan `transform` dan `opacity`), tetapi sulit dikendalikan secara dinamis dari JavaScript (misalnya ketika koordinat awal/akhir dihitung saat runtime atau saat Anda perlu menunggu animasi selesai sebelum menghapus elemen dari DOM).
- **Animasi manual via JavaScript (`requestAnimationFrame` yang mengubah `element.style`)** mudah dikendalikan secara dinamis, tetapi membebani *Main Thread*.

**Web Animations API (WAAPI)** melalui metode **`element.animate(keyframes, options)`** menyatukan keduanya: Anda mendefinisikan animasi secara dinamis di JavaScript, mesin peramban mengeksekusinya di jalur kompositor yang sama cepatnya dengan CSS `@keyframes`, dan Anda mendapatkan objek **`Animation`** lengkap dengan properti Promise **`animation.finished`**!

> **⚠️ Jebakan Umum di Lapangan:** Menunggu animasi selesai menggunakan `setTimeout()` dengan durasi yang dikira-kira sama dengan CSS sering meleset ketika pengguna mengaktifkan penghemat baterai atau `prefers-reduced-motion`; gunakan properti Promise `await animasi.finished` dari WAAPI.

## 1. Anatomi `element.animate()` dan Metode Pengendali Objek `Animation`

Metode `element.animate(keyframes, options)` menerima dua argumen:
1. **`keyframes`:** Array objek berisi properti CSS dalam format *camelCase* (seperti `[{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }]`).Catatan khusus: karena kata `offset` dan `float` dicadangkan dalam objek keyframe WAAPI, properti CSS `offset` ditulis sebagai `cssOffset` dan `float` sebagai `cssFloat`.
2. **`options`:** Angka durasi dalam milidetik, atau objek konfigurasi `{ duration, easing, delay, iterations, direction, fill }`. Perhatikan bahwa berbeda dengan CSS di mana `animation-timing-function` bawaan adalah `"ease"`, di WAAPI nilai bawaan `easing` adalah **`"linear"`**!

| Properti / Metode pada Objek `Animation` | Fungsi & Perilaku |
| :--- | :--- |
| **`await animasi.finished`** | Mengembalikan `Promise` yang *resolve* tepat ketika animasi selesai diputar (atau *reject* dengan `AbortError` jika `animasi.cancel()` dipanggil). |
| **`animasi.pause()` & `animasi.play()`** | Menjeda dan melanjutkan animasi tepat dari posisi waktu saat ini (`currentTime`). |
| **`animasi.reverse()`** | Membalik arah pemutaran animasi secara mulus di tengah jalan. |
| **`animasi.playbackRate = 2`** | Mengubah kecepatan pemutaran (misalnya `2` untuk 2× lebih cepat, `0.5` untuk gerak lambat). |
| **`animasi.commitStyles()`** | Menyalin nilai gaya akhir hasil animasi ke atribut `style` elemen agar Anda tidak perlu menahan `fill: "forwards"` selamanya di memori. |
| **`animasi.cancel()`** | Menghentikan animasi seketika, menghapus seluruh efeknya, dan menolak Promise `animasi.finished`. |

## 2. Menghapus Elemen dari DOM Setelah Animasi Keluar Selesai (`await animasi.finished`)

Berikut adalah pola produksi yang sangat bersih untuk menganimasikan penutupan kartu atau notifikasi sebelum menghapusnya dari pohon DOM, lengkap dengan pemeriksaan aksesibilitas **`prefers-reduced-motion`**:

```javascript
export async function hapusKartuDenganAnimasi(elemenKartu) {
  const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!kurangiGerak && typeof elemenKartu.animate === "function") {
    const animasi = elemenKartu.animate(
      [
        { opacity: 1, transform: "scale(1)" },
        { opacity: 0, transform: "scale(0.92)" }
      ],
      { duration: 200, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
    );
    try {
      await animasi.finished;
    } catch {
      // Abaikan jika animasi dibatalkan lebih awal dengan animasi.cancel()
    }
  }
  elemenKartu.remove();
}
```

## 3. Menyimpan Gaya Akhir dengan `commitStyles()` + `cancel()`

Jika Anda menganimasikan posisi elemen ke tempat baru dan membiarkan opsi `fill: "forwards"` tetap aktif, spesifikasi menetapkan bahwa nilai animasi yang menggunakan `fill: "forwards"` memiliki prioritas kaskade lebih tinggi daripada aturan CSS biasa (bahkan lebih tinggi dari atribut `style` inline!). Agar elemen tetap berada di posisi barunya namun kembali patuh pada aturan CSS biasa, gunakan kombinasi **`commitStyles()`** lalu **`cancel()`**:

```javascript
export async function geserPanelHalus(elemen, jarakPx) {
  const anim = elemen.animate(
    [{ transform: `translateX(${jarakPx}px)` }],
    { duration: 250, easing: "ease-out", fill: "forwards" }
  );
  await anim.finished;
  // Salin hasil akhir ke elemen.style.transform lalu lepaskan objek animasi
  anim.commitStyles();
  anim.cancel();
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Lupa bahwa nilai bawaan `easing` di `element.animate()` adalah `"linear"`:** Di CSS, transisi bawaan menggunakan `"ease"` yang melambat secara alami di ujungnya. Di WAAPI, jika Anda tidak menentukan `easing`, gerakan akan terasa kaku seperti robot karena menggunakan `"linear"`. Selalu tentukan `easing: "ease-out"` atau `"cubic-bezier(...)"`.
2. **Tidak menangkap penolakan Promise `await anim.finished` ketika `anim.cancel()` mungkin dipanggil:** Memanggil `anim.cancel()` sebelum animasi selesai akan me-*reject* Promise `anim.finished` dengan `DOMException: The user aborted a request` (`AbortError`). Bungkus `await anim.finished` di dalam `try...catch` jika animasi tersebut dapat dibatalkan oleh aksi pengguna.
3. **Menganimasikan properti `height`, `top`, atau `margin` alih-alih `transform` dan `opacity`:** Sama seperti di CSS, menganimasikan properti tata letak di WAAPI tetap memicu *Layout recalculation* di setiap frame; utamakan `transform` dan `opacity`.

## Latihan Praktik Mandiri

1. Buat halaman `waapi-galeri.html` dengan sebuah kartu informasi dan tiga tombol pengendali: "Putar / Balik Arah" (`anim.reverse()`), "Kecepatan 2x" (`anim.playbackRate = 2`), dan "Hapus dengan Animasi".
2. Pastikan tombol "Hapus dengan Animasi" memeriksa `window.matchMedia("(prefers-reduced-motion: reduce)").matches`, menunggu `await anim.finished`, lalu memanggil `elemen.remove()`.
3. Periksa daftar animasi yang sedang berjalan pada elemen menggunakan metode `elemen.getAnimations()` di Console DevTools.

## Kuis Pemahaman

### Soal 1
Mengapa menunggu penyelesaian animasi menggunakan `await elemen.animate(...).finished` jauh lebih andal daripada menggunakan `setTimeout(fn, 200)`?
- A. Karena `setTimeout` tidak dapat menerima angka `200`
- B. Karena Promise `animasi.finished` dikelola langsung oleh mesin animasi peramban sehingga dijamin *resolve* tepat ketika siklus animasi benar-benar berakhir (termasuk bila `playbackRate` diubah atau dijeda sementara), sedangkan `setTimeout` hanyalah penunjuk waktu terpisah yang mudah meleset
- C. Karena `animasi.finished` otomatis menghapus berkas CSS
- D. Karena `setTimeout` hanya berjalan di Node.js

**Jawaban Benar:** B
**Penjelasan:** Properti `Animation.finished` mengembalikan `Promise` yang terikat langsung pada garis waktu (*timeline*) animasi peramban, sehingga tidak akan balapan (*race condition*) dengan perubahan *frame rate*, jeda, maupun perubahan `playbackRate`.

### Soal 2
Apakah nilai bawaan (*default*) dari opsi `easing` pada pemanggilan `elemen.animate(keyframes, { duration: 300 })` jika properti `easing` tidak ditulis?
- A. `"ease"` (sama seperti CSS `transition`)
- B. `"linear"` (berbeda dengan CSS yang bawaannya `"ease"`)
- C. `"cubic-bezier(0, 0, 0, 0)"`
- D. `"steps(10)"`

**Jawaban Benar:** B
**Penjelasan:** Dalam spesifikasi Web Animations API, nilai bawaan `easing` untuk keseluruhan animasi adalah `"linear"`, sehingga Anda perlu menuliskan `easing: "ease"` atau `"ease-out"` secara eksplisit agar gerakan terasa alami.

### Soal 3
Apa kegunaan dari memanggil `animasi.commitStyles()` diikuti `animasi.cancel()` setelah sebuah animasi dengan `fill: "forwards"` selesai (`await animasi.finished`)?
- A. Mengirimkan laporan performa animasi ke server
- B. Menyalin nilai gaya terhitung terakhir dari animasi ke dalam properti `elemen.style` sebaris, lalu melepaskan lapisan animasi `fill: "forwards"` agar tidak terus menimpa aturan CSS normal dan tidak menahan memori
- C. Mengulang animasi dari awal sebanyak 10 kali
- D. Menghapus elemen dari pohon DOM

**Jawaban Benar:** B
**Penjelasan:** Animasi aktif dengan `fill: "forwards"` menempati prioritas tinggi dalam kaskade CSS dan terus hidup di memori. `commitStyles()` membekukan hasil akhirnya ke `element.style`, sehingga `cancel()` dapat dipanggil dengan aman untuk membebaskan animasi tersebut.

## Sumber

- [Web Animations API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [`Element.animate()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate)
