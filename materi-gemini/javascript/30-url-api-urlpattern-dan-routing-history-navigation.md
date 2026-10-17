# Manipulasi URL (`URL`, `URLPattern`), History API (`pushState`), dan Navigation API

- **Tingkat:** Menengah
- **Ringkasan:** Mengurai dan membangun alamat web secara aman menggunakan objek `URL` dan pencocokan rute `URLPattern`, mengelola riwayat halaman aplikasi *Single-Page Application (SPA)* dengan History API (`history.pushState`, event `popstate`), serta mengenal **Navigation API** modern.

## Mengapa Mengurai dan Merangkai URL dengan RegExp atau Penggabungan String Sangat Rawan Bug?

Merangkai query string secara manual seperti `"/cari?q=" + kataKunci + "&hal=" + halaman` akan langsung rusak ketika `kataKunci` mengandung karakter `&`, `=`, `#`, atau spasi, serta berisiko membuka celah *Open Redirect* atau *Parameter Pollution*. Demikian pula, memecah URL dengan `.split("/")` gagal menangani URL relatif, port kustom, atau fragmen `#hash`.

Platform web menyediakan tiga API standar untuk menangani alamat dan navigasi halaman secara bersih: konstruktor **`URL`** bersama **`URLSearchParams`**, pencocok pola rute **`URLPattern`**, serta **History API** dan **Navigation API**.

> **⚠️ Jebakan Umum di Lapangan:** Membedah URL menggunakan pemotongan string `.split('/')` atau RegExp buatan tangan sering gagal ketika URL memiliki query string kompleks, hash fragmen, atau port khusus; gunakan konstruktor `new URL(input, base)` dan `URLPattern` bawaan platform.

## 1. Mengurai, Memvalidasi (`URL.canParse`), dan Memodifikasi Query dengan `URL` & `URLSearchParams`

Konstruktor **`new URL(url, base)`** mengurai alamat relatif maupun absolut menjadi komponen yang tervalidasi penuh (`protocol`, `hostname`, `port`, `pathname`, `searchParams`, `hash`). Sejak akhir 2023 (**Baseline Widely Available** per Juni 2026), Anda juga dapat memeriksa apakah sebuah string URL valid tanpa blok `try...catch` menggunakan **`URL.canParse(url, base)`** (atau **`URL.parse(url, base)`** yang mengembalikan `null` jika tidak valid, *Baseline Newly Available* sejak Mei 2024):

| Properti / Metode | Contoh Hasil pada `new URL("/kelas/js?tingkat=lanjut#kuis", "https://kodeloka.id")` | Fungsi Utama |
| :--- | :--- | :--- |
| `url.origin` | `"https://kodeloka.id"` | Mengembalikan skema + host + port (berguna untuk memverifikasi keamanan *same-origin*). |
| `url.pathname` | `"/kelas/js"` | Jalur rute halaman tanpa query string maupun hash. |
| `url.searchParams` | Objek `URLSearchParams` | Membaca (`.get()`, `.getAll()`) dan mengubah (`.set()`, `.append()`, `.delete()`) parameter query dengan pengodean persen otomatis. |
| `url.hash` | `"#kuis"` | Fragmen jangkar di dalam halaman (diawali `#`). |
| `URL.canParse(input, base)` | `true` / `false` | Memeriksa validitas sintaks URL secara cepat tanpa melempar `TypeError`. |

## 2. Pencocokan Parameter Rute dengan `URLPattern`

Alih-alih memasang pustaka pencocok rute eksternal untuk mengekstrak parameter seperti `:idKelas` dan `:nomorModul` dari sebuah URL, Web Platform menyediakan **`URLPattern`** (*Baseline Newly Available* sejak September 2025 di Chrome, Edge, Firefox, Safari, dan Node.js):

```javascript
const url = new URL("/kelas/javascript?tingkat=lanjut#kuis", "https://kodeloka.id");
console.log(url.pathname);                    // "/kelas/javascript"
console.log(url.searchParams.get("tingkat")); // "lanjut"

// Menambah parameter query dengan pengodean karakter spesial otomatis
url.searchParams.set("cari", "async & await");
console.log(url.search);                      // "?tingkat=lanjut&cari=async+%26+await"

// Pencocokan parameter rute dengan URLPattern
if ("URLPattern" in globalThis) {
  const ruteModul = new URLPattern({ pathname: "/kelas/:idKelas/modul/:nomor" });
  const cocok = ruteModul.exec("https://kodeloka.id/kelas/javascript/modul/30");
  console.log(cocok?.pathname.groups);
  // { idKelas: "javascript", nomor: "30" }
}
```

## 3. Mengelola Riwayat SPA: History API (`pushState` & `popstate`) dan Navigation API

Pada aplikasi satu halaman (*Single-Page Application* / filter katalog dinamis), Anda dapat memperbarui URL di bilah alamat peramban tanpa memuat ulang seluruh halaman menggunakan **History API**:
- **`history.pushState(stateObj, "", urlBaru)`:** Menambahkan entri baru ke riwayat peramban (sehingga tombol **Mundur/Back** pengguna dapat kembali ke tampilan sebelumnya).
- **`history.replaceState(stateObj, "", urlBaru)`:** Mengganti URL saat ini tanpa menambah tumpukan riwayat baru (cocok saat memperbarui filter pencarian per ketikan).
- **Event `window.addEventListener("popstate", (e) => { ... })`:** Dipicu hanya ketika pengguna menekan tombol **Mundur/Maju** peramban (atau `history.back()`). Perlu diingat bahwa memanggil `history.pushState()` sendiri **tidak** memicu event `popstate`!

Untuk melengkapi keterbatasan History API klasik, spesifikasi HTML memperkenalkan **Navigation API (`window.navigation`)** (*Baseline Newly Available* sejak Januari 2026) yang memungkinkan satu pendengar `navigation.addEventListener("navigate", (event) => { ... })` mencegat klik tautan internal, pengiriman formulir, dan tombol Mundur/Maju sekaligus menggunakan `event.intercept({ async handler() { ... } })`:

```javascript
export function terapkanFilterKeUrl(kategori, kataKunci) {
  const urlBaru = new URL(window.location.href);
  if (kategori) urlBaru.searchParams.set("kategori", kategori);
  else urlBaru.searchParams.delete("kategori");

  if (kataKunci) urlBaru.searchParams.set("q", kataKunci);
  else urlBaru.searchParams.delete("q");

  // Perbarui URL di bilah alamat dan simpan state di riwayat peramban
  window.history.pushState({ kategori, kataKunci }, "", urlBaru);
}

// Tangani saat pengguna menekan tombol Mundur / Maju di peramban
window.addEventListener("popstate", (event) => {
  const params = new URLSearchParams(window.location.search);
  console.log("Kembali ke filter:", params.get("kategori"), event.state);
});
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Mengabaikan keamanan skema URL saat mengarahkan pengguna (`window.location.href = urlDariQuery`):** Jika penyerang mengirim parameter `?redirect=javascript:alert(1)` atau `?redirect=https://situs-phishing.com`, aplikasi Anda terkena celah **XSS / Open Redirect**. Selalu parse dengan `const tujuan = new URL(input, window.location.origin)` dan pastikan **`tujuan.origin === window.location.origin`** sebelum mengalihkan!
2. **Mengharapkan event `popstate` terpanggil saat memanggil `history.pushState()`:** `popstate` hanya terpanggil saat pengguna bernavigasi melintasi entri riwayat (seperti menekan tombol Back/Forward). Panggil fungsi perender tampilan Anda secara langsung setelah `pushState()`.
3. **Memakai `pushState()` pada setiap ketikan huruf di kotak pencarian:** Jika pengguna mengetik 15 huruf dan setiap ketikan memanggil `pushState()`, pengguna harus menekan tombol *Back* 15 kali untuk keluar dari halaman! Gunakan `replaceState()` untuk pembaruan ketikan beruntun.

## Latihan Praktik Mandiri

1. Buat berkas `router-aman.mjs` yang mengekspor fungsi `validasiRedirectInternal(inputUrl, originSaatIni)`: gunakan `URL.canParse(inputUrl, originSaatIni)` dan objek `URL` untuk memastikan URL target memiliki `origin` yang sama persis dengan `originSaatIni` serta berprotokol `http:` atau `https:`.
2. Tambahkan fungsi `ekstrakParameterModul(urlString)` menggunakan `URLPattern` untuk mengambil `:kelas` dan `:bab` beserta seluruh query parameter-nya sebagai objek biasa (`Object.fromEntries(url.searchParams)`).
3. Uji kedua fungsi tersebut (termasuk menolak `javascript:alert(1)` dan `https://jahat.com/login`) menggunakan `node:test`.

## Kuis Pemahaman

### Soal 1
Bagaimana cara paling aman di JavaScript untuk memastikan bahwa parameter URL tujuan pengalihan (`?next=...`) benar-benar mengarah ke halaman di dalam domain situs Anda sendiri (*same-origin*) dan bukan celah *Open Redirect* atau `javascript:`?
- A. Memeriksa apakah string diawali dengan `input.includes("kodeloka")`
- B. Mengurainya dengan `const target = new URL(input, window.location.origin)` lalu memeriksa bahwa `target.origin === window.location.origin`
- C. Menghapus semua tanda garis miring dengan `.replace("/", "")`
- D. Menggunakan `eval(input)`

**Jawaban Benar:** B
**Penjelasan:** Konstruktor `new URL(input, window.location.origin)` menyelesaikan segala bentuk jalur relatif maupun absolut secara kanonis. Membandingkan `target.origin === window.location.origin` menjamin skema, host, dan port tujuan sama persis dengan origin aplikasi Anda.

### Soal 2
Pada penggunaan `URLPattern`, apa yang dikembalikan oleh kode berikut?
```javascript
const pola = new URLPattern({ pathname: "/kelas/:slug/modul/:nomor" });
const hasil = pola.exec("https://kodeloka.id/kelas/html/modul/12");
console.log(hasil.pathname.groups);
```
- A. `["html", "12"]`
- B. `{ slug: "html", nomor: "12" }`
- C. `true`
- D. `"/kelas/html/modul/12"`

**Jawaban Benar:** B
**Penjelasan:** Metode `.exec()` pada `URLPattern` mengembalikan objek hasil pencocokan untuk setiap komponen URL, di mana `hasil.pathname.groups` memetakan nama parameter bertitik dua (`:slug`, `:nomor`) ke nilai string yang tertangkap.

### Soal 3
Kapan event `popstate` pada `window` dipicu ketika menggunakan History API?
- A. Tepat pada saat kode Anda memanggil `history.pushState()` atau `history.replaceState()`
- B. Ketika entri riwayat aktif berubah karena pengguna menekan tombol Mundur (*Back*) atau Maju (*Forward*) di peramban (atau pemanggilan `history.back()` / `history.forward()` / `history.go()`)
- C. Hanya ketika halaman pertama kali dimuat dari server
- D. Setiap kali pengguna menggerakkan kursor tetikus ke bilah alamat

**Jawaban Benar:** B
**Penjelasan:** Pemanggilan `history.pushState()` atau `history.replaceState()` tidak pernah memicu event `popstate`. Event `popstate` hanya dipancarkan ketika pengguna bernavigasi antar-entri riwayat sesi.

## Sumber

- [`URL` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/URL)
- [`URLPattern` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)
- [History API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
