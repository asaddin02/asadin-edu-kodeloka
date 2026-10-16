# Penyimpanan Data di Peramban: `localStorage`, `sessionStorage`, dan `IndexedDB`

- **Tingkat:** Menengah
- **Ringkasan:** Menyimpan state aplikasi di sisi klien menggunakan Web Storage API (`localStorage` dan `sessionStorage`), membungkus serialisasi JSON dengan aman, menyinkronkan data antar-tab dengan event `storage`, serta memilih antara Web Storage, `IndexedDB`, dan HTTP Cookie.

## Memilih Mekanisme Penyimpanan di Peramban

Peramban modern menyediakan beberapa tempat penyimpanan data dengan karakteristik, masa hidup, dan tingkat keamanan yang berbeda. Perhatikan perbandingan berikut sebelum memutuskan tempat menyimpan data:

| Mekanisme | Kapasitas Umum | Masa Hidup Data | Apakah Otomatis Dikirim ke Server di Setiap Request HTTP? | Kasus Penggunaan Terbaik |
|---|---|---|---|---|
| **`localStorage`** | ~5 MB per *origin* | Permanen hingga dihapus oleh skrip atau pengguna. | **Tidak** (murni di sisi klien). | Preferensi tema (gelap/terang), progres modul belajar, penanda (*bookmark*), draf formulir. |
| **`sessionStorage`** | ~5 MB per *origin* | Hanya selama **satu tab** terbuka (hilang saat tab ditutup). | **Tidak** (murni di sisi klien). | State langkah formulir multi-tahap (*wizard*) atau posisi filter sementara di tab tersebut. |
| **`IndexedDB`** | Ratusan MB hingga GB (sesuai ruang diska) | Permanen hingga dihapus. | **Tidak** (asinkron, mendukung transaksi & indeks). | Aplikasi *offline-first*, menyimpan ribuan objek terstruktur, atau berkas biner (`Blob`/`File`). |
| **HTTP Cookie (`HttpOnly`)** | ~4 KB | Sesuai `Max-Age` / `Expires`. | **Ya, selalu dikirim otomatis** melalui header `Cookie`. | **Identitas sesi autentikasi (`session_id`) yang wajib dilindungi dari JavaScript!** |

> **🚫 Aturan Keamanan Mutlak: Jangan Menyimpan Token Rahasia / Sesi Login Sensitif di `localStorage`!**
> Semua data di dalam `localStorage` dan `sessionStorage` dapat dibaca secara bebas oleh **setiap baris JavaScript** yang berjalan di halaman tersebut. Jika situs Anda mengalami satu saja celah XSS (atau memuat skrip pihak ketiga yang disusupi), penyerang cukup memanggil `localStorage.getItem("token")` untuk mencuri akun pengguna! Untuk sesi login produksi, gunakan **Cookie dengan atribut `HttpOnly`, `Secure`, dan `SameSite`** yang diatur oleh server.

## 1. Menggunakan `localStorage` dan `sessionStorage` dengan Aman

Kunci dan nilai yang disimpan di dalam `localStorage` maupun `sessionStorage` **selalu bertipe `string`**.
Jika Anda langsung menyimpan objek `localStorage.setItem("profil", { nama: "Adi" })`, nilainya akan rusak menjadi string `"[object Object]"`!

Oleh karena itu, selalu gunakan **`JSON.stringify()`** saat menyimpan objek/array, dan **`JSON.parse()`** saat membacanya kembali—serta **selalu bungkus di dalam `try...catch`**!

### Mengapa `localStorage` Wajib Dibungkus `try...catch`?
1. **`setItem()` dapat melempar `QuotaExceededError`:** Ketika penyimpanan penuh atau pada mode penyamaran (*private browsing*) tertentu yang membatasi kuota.
2. **Pengguna dapat memblokir data situs:** Memanggil `localStorage` saat pengaturan privasi peramban memblokir penyimpanan lokal dapat melempar `SecurityError`.
3. **`JSON.parse()` dapat melempar `SyntaxError`:** Jika data di penyimpanan lokal termodifikasi atau rusak.

```js
// Pembungkus penyimpanan lokal yang aman dan siap pakai di produksi
export const penyimpananLokal = {
  ambil(kunci, nilaiBawaan = null) {
    try {
      const teksMentah = window.localStorage.getItem(kunci);
      if (teksMentah === null) return nilaiBawaan;
      return JSON.parse(teksMentah);
    } catch (galat) {
      console.warn(`Gagal membaca kunci '${kunci}' dari localStorage:`, galat);
      return nilaiBawaan;
    }
  },

  simpan(kunci, nilai) {
    try {
      const teksJson = JSON.stringify(nilai);
      window.localStorage.setItem(kunci, teksJson);
      return true;
    } catch (galat) {
      console.warn(`Gagal menyimpan kunci '${kunci}' ke localStorage:`, galat);
      return false;
    }
  },

  hapus(kunci) {
    try {
      window.localStorage.removeItem(kunci);
    } catch (galat) {
      console.warn(`Gagal menghapus kunci '${kunci}':`, galat);
    }
  }
};
```

*(Catatan: Pola inilah yang dipakai oleh Kodeloka sendiri untuk menyimpan progres modul, penanda, dan catatan belajar Anda di peramban!)*

## 2. Menyinkronkan State Antar-Tab secara Real-Time dengan Event `storage`

Bagaimana jika pengguna membuka situs Kodeloka di **Tab A** dan **Tab B** secara bersamaan, lalu di Tab A ia mengganti tema menjadi *Mode Gelap* atau menyelesaikan *Modul 5*?

Ketika `localStorage` diubah di **Tab A**, peramban secara otomatis menembakkan event **`"storage"`** pada objek `window` di **semua tab lain (Tab B, Tab C) yang membuka domain (*origin*) yang sama**:

```js
window.addEventListener("storage", (event) => {
  // event.key      -> Nama kunci yang berubah (mis. "kodeloka:tema")
  // event.oldValue -> Nilai string lama sebelum berubah
  // event.newValue -> Nilai string baru setelah berubah
  if (event.key === "kodeloka:tema" && event.newValue) {
    const temaBaru = JSON.parse(event.newValue);
    document.documentElement.setAttribute("data-tema", temaBaru);
  }
});
```

## 3. Pengantar `IndexedDB` untuk Data Berukuran Besar dan Asinkron

Karena `localStorage` bersifat **sinkron** (memblokir utas utama saat membaca/menulis string besar) dan dibatasi sekitar 5 MB, jangan gunakan `localStorage` untuk menyimpan ribuan baris katalog atau dokumen panjang.

Untuk kebutuhan tersebut, gunakan **`IndexedDB`**—basis data NoSQL transaksional bawaan peramban yang bekerja secara **asinkron**:

```js
// Membuka koneksi IndexedDB dan membungkusnya dengan Promise modern
function bukaDatabaseCatatan() {
  return new Promise((resolve, reject) => {
    const permintaan = window.indexedDB.open("KodelokaDB", 1);

    // Dijalankan saat basis data pertama kali dibuat atau versinya dinaikkan
    permintaan.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("catatan_modul")) {
        db.createObjectStore("catatan_modul", { keyPath: "idModul" });
      }
    };

    permintaan.onsuccess = () => resolve(permintaan.result);
    permintaan.onerror = () => reject(permintaan.error);
  });
}
```

## Latihan Praktik: Menyimpan Draf Catatan Otomatis (*Auto-Save*) dan Sinkronisasi Antar-Tab

Buatlah berkas `penyimpanan-catatan.html` dan `penyimpanan.js`:
1. Sediakan sebuah `<textarea id="editor-catatan">` dan indikator status `<output id="status-simpan">`.
2. Setiap kali pengguna mengetik (event `"input"`), simpan isi catatan beserta waktu pembaruannya ke `localStorage` menggunakan pembungkus `try...catch` yang aman.
3. Saat halaman dimuat ulang, pulihkan kembali isi `<textarea>` dari `localStorage`.
4. Tambahkan pendengar `window.addEventListener("storage", ...)` agar ketika halaman dibuka di dua tab berdampingan, ketikan di Tab 1 langsung muncul di Tab 2!

## Kuis Pemahaman

### Soal 1
Apa yang terjadi jika Anda menjalankan kode `localStorage.setItem("skor", 100)` lalu membacanya kembali dengan `const nilai = localStorage.getItem("skor")`?
- A. `nilai` bertipe `number` (`100`).
- B. `nilai` bertipe `string` (`"100"`), karena Web Storage API hanya menyimpan dan mengembalikan nilai dalam bentuk teks string.
- C. `localStorage.setItem` melempar `TypeError` karena argumen kedua bukan string.
- D. `nilai` bernilai `undefined`.

**Jawaban Benar:** B
**Penjelasan:** `localStorage` dan `sessionStorage` secara otomatis mengonversi nilai masukan menjadi string (`String(100)` -> `"100"`). Saat diambil kembali dengan `getItem()`, hasilnya selalu berupa string (atau `null` jika kunci tidak ditemukan), sehingga perlu diurai dengan `JSON.parse()` atau `Number()`.

### Soal 2
Pada tab mana sajakah event `window.addEventListener("storage", ...)` akan terpanggil ketika sebuah tab mengubah isi `localStorage`?
- A. Hanya pada tab yang sedang memanggil `localStorage.setItem()` itu sendiri.
- B. Pada semua tab/jendela lain yang sedang membuka situs dari *origin* (protokol + domain + port) yang sama, **kecuali** tab yang melakukan perubahan itu sendiri.
- C. Pada seluruh tab peramban termasuk situs dari domain yang berbeda.
- D. Hanya ketika peramban ditutup dan dibuka kembali.

**Jawaban Benar:** B
**Penjelasan:** Event `storage` dirancang khusus sebagai mekanisme penyiaran antar-tab (*cross-tab synchronization*) dalam satu *origin* yang sama. Tab yang memanggil `setItem()` sudah mengetahui perubahan yang ia lakukan, sehingga event tersebut dikirimkan ke tab-tab saudara lainnya.

### Soal 3
Mengapa token sesi autentikasi yang sensitif sebaiknya disimpan di dalam **HTTP Cookie dengan atribut `HttpOnly`**, bukan di dalam `localStorage`?
- A. Karena kapasitas `localStorage` lebih kecil daripada Cookie.
- B. Karena Cookie dengan atribut `HttpOnly` tidak dapat diakses melalui `document.cookie` oleh kode JavaScript di peramban, sehingga melindungi token sesi dari pencurian langsung apabila terjadi serangan *Cross-Site Scripting (XSS)*.
- C. Karena `localStorage` otomatis terhapus setiap 5 menit.
- D. Karena Cookie tidak pernah dikirimkan ke server.

**Jawaban Benar:** B
**Penjelasan:** Setiap data di `localStorage` dapat dibaca oleh skrip mana pun yang berjalan di halaman tersebut. Sebaliknya, cookie beratribut `HttpOnly` dikelola oleh peramban untuk dikirimkan ke server pada permintaan HTTP tetapi disembunyikan sepenuhnya dari API JavaScript (`document.cookie`).

## Sumber
- [Using the Web Storage API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
- [`Window: localStorage` property — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Web Storage API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
