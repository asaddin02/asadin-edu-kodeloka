# Penanganan Input Terpadu: Pointer Events API (`pointerdown`), Gestur Sentuh, dan Pintasan Papan Ketik

- **Tingkat:** Menengah
- **Ringkasan:** Menyatukan penanganan input tetikus (*mouse*), sentuhan jari (*touch*), dan pena stylus (*pen*) menggunakan **Pointer Events API (`pointerdown`, `pointermove`, `setPointerCapture`)**, serta merancang pintasan papan ketik (`e.key`, `e.ctrlKey`/`e.metaKey`) yang tidak bentrok dengan input formulir.

## Mengapa Kita Tidak Perlu Lagi Menulis Kode Gandakan untuk `mousedown` dan `touchstart`?

Dahulu, saat membuat komponen penggeser (*slider*), kanvas tanda tangan, atau panel yang dapat diubah ukurannya (*resizable*), pengembang harus menulis dua pasang pendengar event yang berbeda: `mousedown`/`mousemove`/`mouseup` untuk komputer desktop, dan `touchstart`/`touchmove`/`touchend` (yang struktur datanya berbeda di `e.touches[0]`) untuk layar sentuh ponsel.

**Pointer Events API** menyatukan tetikus (*mouse*), sentuhan jari (*touch*), dan pena digital (*pen/stylus*) ke dalam satu antarmuka **`PointerEvent`** yang seragam (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`). Bahkan lebih baik lagi, metode **`elemen.setPointerCapture(e.pointerId)`** menjamin elemen Anda tetap menerima event `pointermove` dan `pointerup` meskipun jari atau kursor tetikus pengguna bergerak keluar dari batas kotak elemen tersebut!

> **⚠️ Jebakan Umum di Lapangan:** Memasang pintasan papan ketik global di `window.addEventListener('keydown', ...)` untuk huruf tunggal (seperti menekan `/` atau `k`) tanpa mengecek apakah fokus sedang berada di dalam `<input>`, `<textarea>`, atau elemen `contenteditable` akan membajak ketikan pengguna.

## 1. Perbandingan Pointer Events, Properti `PointerEvent`, dan Pintasan `KeyboardEvent`

Perhatikan properti penting yang disediakan oleh `PointerEvent` (mewarisi `MouseEvent`) dan `KeyboardEvent`:

| Properti / Metode | Antarmuka | Fungsi & Nilai yang Dikembalikan |
| :--- | :--- | :--- |
| **`e.pointerId`** | `PointerEvent` | Pengenal angka unik untuk setiap titik kontak aktif (memungkinkan pelacakan *multi-touch* beberapa jari sekaligus). |
| **`e.pointerType`** | `PointerEvent` | String jenis perangkat penunjuk: **`"mouse"`**, **`"touch"`**, atau **`"pen"`**. |
| **`e.pressure`** & **`e.width`/`height`** | `PointerEvent` | Tekanan pena (`0.0` s.d. `1.0`) serta luas area sentuhan jari dalam piksel CSS. |
| **`el.setPointerCapture(e.pointerId)`** | `Element` | Mengunci seluruh event `pointermove` berikutnya untuk `pointerId` tersebut ke elemen `el` sampai `pointerup` atau `pointercancel` terjadi. |
| **`e.key`** vs **`e.code`** | `KeyboardEvent` | `e.key` adalah **karakter/arti tombol** (`"/"`, `"Escape"`, `"ArrowRight"`, `"k"`), sedangkan `e.code` adalah **posisi fisik tombol** di papan ketik (`"KeyK"`, `"Slash"`). Gunakan `e.key` untuk pintasan karakter! |

## 2. Menggeser Komponen dengan `setPointerCapture()` dan CSS `touch-action: none`

Saat membuat elemen yang dapat digeser (*drag*) di layar sentuh, ada satu aturan CSS wajib: tambahkan **`touch-action: none`** (atau `touch-action: pan-y` untuk penggeser horizontal) pada elemen tersebut! Tanpa `touch-action: none`, begitu jari pengguna bergerak beberapa milimeter, peramban seluler akan menganggap pengguna ingin menggulir halaman, lalu membatalkan interaksi Anda dengan memicu event **`pointercancel`**.

```javascript
export function pasangPenggeser(elemenPegangan, onGeser) {
  // Pastikan di CSS elemenPegangan memiliki: touch-action: none; user-select: none;
  elemenPegangan.addEventListener("pointerdown", (e) => {
    // Hanya tanggapi tombol utama tetikus (kiri = 0) atau sentuhan/pena
    if (e.button !== 0) return;
    elemenPegangan.setPointerCapture(e.pointerId);

    function saatBergerak(ev) {
      onGeser(ev.clientX, ev.clientY, ev.pointerType);
    }

    function saatLepas() {
      elemenPegangan.removeEventListener("pointermove", saatBergerak);
      elemenPegangan.removeEventListener("pointerup", saatLepas);
      elemenPegangan.removeEventListener("pointercancel", saatLepas);
    }

    elemenPegangan.addEventListener("pointermove", saatBergerak);
    elemenPegangan.addEventListener("pointerup", saatLepas);
    elemenPegangan.addEventListener("pointercancel", saatLepas);
  });
}
```

## 3. Merancang Pintasan Papan Ketik Global yang Aman dan Tidak Membajak Ketikan

Pintasan papan ketik seperti menekan `/` untuk memfokuskan kotak pencarian atau `Ctrl + K` / `Cmd + K` untuk membuka palet perintah sangat disukai pengguna. Namun, pastikan dua hal:
1. Untuk pintasan satu karakter tanpa tombol pengubah (seperti `/` atau `?`), **selalu periksa apakah `e.target` sedang berada di dalam elemen input teks** (`input`, `textarea`, `select`, atau `isContentEditable`) dan pastikan `e.ctrlKey`, `e.metaKey`, serta `e.altKey` sedang tidak ditekan.
2. Untuk pintasan kombinasi lintas sistem operasi, dukung **`e.ctrlKey`** (Windows/Linux) maupun **`e.metaKey`** (tombol `⌘ Command` di macOS):

```javascript
window.addEventListener("keydown", (e) => {
  const target = e.target;
  const sedangMengetik =
    target instanceof HTMLElement &&
    (target.matches("input, textarea, select") || target.isContentEditable);

  // 1. Pintasan '/' (tanpa Ctrl/Cmd/Alt) ketika pengguna TIDAK sedang mengetik di form
  if (!sedangMengetik && !e.ctrlKey && !e.metaKey && !e.altKey && e.key === "/") {
    e.preventDefault();
    document.querySelector("#input-cari")?.focus();
    return;
  }

  // 2. Pintasan Ctrl+K (Windows/Linux) atau Cmd+K (macOS)
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    document.querySelector("#dialog-pencarian")?.showModal();
  }
});
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan properti usang `e.keyCode` atau `e.which` (misalnya `e.keyCode === 13`):** Properti angka `keyCode` sudah usang (*deprecated*) dan sulit dibaca. Gunakan properti standar **`e.key`** yang ekspresif (`e.key === "Enter"`, `e.key === "Escape"`, `e.key === "ArrowDown"`).
2. **Lupa menangani event `pointercancel` selain `pointerup`:** Di ponsel, interaksi sentuh dapat dibatalkan kapan saja oleh notifikasi panggilan masuk, gestur sistem operasi, atau batas telapak tangan (*palm rejection*). Selalu bersihkan state geser pada `pointerup` **maupun** `pointercancel`.
3. **Mendaftarkan pintasan karakter tunggal tanpa pengecekan WCAG 2.1.4 (Character Key Shortcuts):** Menurut kriteria aksesibilitas WCAG 2.1.4, pintasan yang hanya memakai satu tombol karakter cetak wajib diabaikan saat fokus berada di kontrol input dan sebaiknya dapat dimatikan atau dipetakan ulang agar tidak terpicu secara tidak sengaja oleh pengguna dikte suara (*speech input*).

## Latihan Praktik Mandiri

1. Buat halaman `kanvas-coretan.html` yang memiliki area gambar `<canvas>` dengan gaya CSS `touch-action: none` dan gunakan `pointerdown`, `setPointerCapture(e.pointerId)`, `pointermove`, serta `pointerup`/`pointercancel` untuk menggambar garis yang ketebalannya mengikuti `e.pressure`.
2. Tambahkan pintasan papan ketik `/` untuk memindahkan fokus ke kolom judul gambar dan `Escape` untuk menutup panel alat, dengan memastikan pintasan `/` tidak mengganggu saat pengguna sedang mengetik judul di dalam `<input>`.

## Kuis Pemahaman

### Soal 1
Mengapa saat mendaftarkan pintasan papan ketik global `window.addEventListener("keydown", ...)` untuk tombol huruf/karakter tunggal seperti `"/"` atau `"s"`, Anda wajib memeriksa apakah `e.target` merupakan elemen `input`, `textarea`, `select`, atau `isContentEditable`?
- A. Karena elemen `<input>` tidak pernah memancarkan event `keydown`
- B. Karena event `keydown` merambat (*bubbles*) dari elemen input ke `window`; tanpa pemeriksaan tersebut, setiap kali pengguna mengetik huruf `"s"` atau `"/"` di dalam kolom formulir, pintasan global akan membajak ketikan pengguna
- C. Karena `window.addEventListener` hanya bekerja di luar `<form>`
- D. Agar papan ketik virtual ponsel otomatis tertutup

**Jawaban Benar:** B
**Penjelasan:** Event papan ketik merambat ke atas pohon DOM hingga mencapai `window`. Jika pendengar global di `window` memanggil `e.preventDefault()` dan menjalankan pintasan saat fokus berada di `<input>` atau `<textarea>`, pengguna tidak akan bisa mengetik karakter tersebut di formulir.

### Soal 2
Apa kegunaan dari memanggil `elemen.setPointerCapture(e.pointerId)` di dalam event `pointerdown` saat membuat komponen penggeser (*slider* atau *drag handle*)?
- A. Menyembunyikan kursor tetikus dari layar komputer
- B. Mengarahkan seluruh event `pointermove` berikutnya untuk `pointerId` tersebut langsung ke `elemen` meskipun kursor tetikus atau jari pengguna bergerak cepat keluar dari batas geometri `elemen`, serta melepaskannya secara otomatis saat `pointerup` atau `pointercancel`
- C. Mengambil tangkapan layar (*screenshot*) dari elemen tersebut
- D. Mematikan fungsi klik kanan pada halaman

**Jawaban Benar:** B
**Penjelasan:** Tanpa `setPointerCapture()`, jika pengguna menyeret pegangan slider terlalu cepat hingga kursor keluar dari kotak pegangan, `elemen` berhenti menerima `pointermove`. Dengan `setPointerCapture(e.pointerId)`, aliran event tetap terkunci pada `elemen` hingga penunjuk dilepas.

### Soal 3
Properti CSS apakah yang perlu ditambahkan pada elemen kanvas gambar atau penggeser kustom agar peramban layar sentuh tidak mengambil alih gerakan jari sebagai pengguliran halaman dan membatalkan interaksi dengan `pointercancel`?
- A. `pointer-events: none;`
- B. `touch-action: none;` (atau `touch-action: pan-y;` jika hanya mengunci gerakan horizontal)
- C. `overflow: visible;`
- D. `visibility: collapse;`

**Jawaban Benar:** B
**Penjelasan:** Properti CSS `touch-action` memberi tahu peramban gestur sentuh bawaan mana yang harus ditangani oleh sistem (seperti *panning* / pengguliran atau *pinch-zoom*) dan mana yang diserahkan sepenuhnya kepada skrip Pointer Events aplikasi Anda.

## Sumber

- [Pointer events — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)
- [`KeyboardEvent.key` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
