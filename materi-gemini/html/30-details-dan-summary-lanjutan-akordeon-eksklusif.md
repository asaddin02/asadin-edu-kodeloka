# Menguasai `<details>` dan `<summary>`: Akordeon Eksklusif (`name`), Event `toggle`, dan Penataan Ikon

- **Tingkat:** Dasar
- **Ringkasan:** Merancang komponen buka-tutup dan akordeon grup eksklusif menggunakan `<details name="...">`, menata penanda panah dengan `summary::marker`, serta menyinkronkan status buka-tutup melalui atribut `open`.

## Mengapa `<details>` dan `<summary>` Adalah Fondasi Komponen Buka-Tutup Terbaik?

Komponen pengungkapan informasi (*disclosure widget*) seperti daftar Pertanyaan yang Sering Diajukan (FAQ), catatan kaki teknis, atau rincian tagihan sangat sering dijumpai di web. Dengan pasangan elemen `<details>` dan `<summary>`, peramban secara bawaan menyediakan interaksi klik maupun papan ketik (`Enter` dan `Space`), pengumuman status terlipat/terbentang bagi pembaca layar, hingga kemampuan pencarian teks di dalam halaman (*Find in Page* `Ctrl+F` di peramban modern dapat otomatis membuka `<details>` yang memuat kata yang dicari!).

Kini, melalui tambahan atribut **`name`** pada `<details>` di [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/interactive-elements.html), Anda bahkan dapat menghubungkan beberapa `<details>` menjadi **akordeon eksklusif** tanpa menulis satu baris kode JavaScript pun.

## 1. Struktur Semantik `<details>`, `<summary>`, dan Atribut `open`

Aturan struktur DOM untuk `<details>` sangat jelas:
1. Elemen **`<summary>` wajib menjadi anak pertama** dari `<details>`. Jika Anda tidak menyertakan `<summary>`, peramban akan membuatkan label bawaan (seperti *"Details"* atau *"Rincian"*) yang kurang informatif.
2. Seluruh elemen lain di dalam `<details>` sesudah `<summary>` adalah konten rincian yang disembunyikan secara bawaan.
3. Atribut boolean **`open`** pada `<details>` menentukan apakah rincian ditampilkan sejak awal. Saat pengguna mengeklik `<summary>`, peramban secara otomatis menambah atau menghapus atribut `open` tersebut.

| Elemen / Selektor / Atribut | Peran & Perilaku Standar |
|---|---|
| `<details open>` | Menampilkan isi rincian secara terbuka saat halaman pertama kali dimuat. |
| `<details name="grup-faq">` | Mengelompokkan beberapa `<details>` menjadi akordeon eksklusif (hanya satu yang bisa terbuka dalam satu grup `name` yang sama). |
| `details[open]` / `details:open` | Selektor CSS untuk menata tampilan `<details>` ketika sedang terbuka. |
| `summary::marker` | Pseudo-element CSS untuk mengubah warna, ukuran, atau isi ikon panah segitiga bawaan `<summary>`. |
| `details.open` (Properti DOM JS) | Nilai boolean (`true`/`false`) untuk membaca atau mengubah status buka-tutup melalui JavaScript. |

## 2. Membuat Akordeon Eksklusif dengan `<details name="...">` dan Menata `::marker`

Dengan memberikan nilai atribut **`name`** yang sama pada beberapa elemen `<details>`, peramban memastikan bahwa membuka satu item akordeon akan secara otomatis menutup item lain dalam kelompok `name` tersebut—persis seperti perilaku grup tombol `<input type="radio" name="...">`:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Akordeon Eksklusif dengan Details — Kodeloka</title>
    <style>
      summary { cursor: pointer; }
      summary::marker { color: #2563eb; }
      details[open] > summary { font-weight: 700; }
    </style>
  </head>
  <body>
    <main>
      <h1>Pertanyaan yang Sering Diajukan</h1>

      <!-- name yang sama: membuka satu <details> otomatis menutup yang lain -->
      <details name="faq" open>
        <summary>Apakah semua kelas gratis?</summary>
        <p>Ya, semua kelas, latihan, dan kuis dapat diakses gratis.</p>
      </details>
      <details name="faq">
        <summary>Apakah saya perlu membuat akun?</summary>
        <p>Tidak, progres belajar disimpan di peramban Anda.</p>
      </details>
      <details name="faq">
        <summary>Dari mana sebaiknya saya mulai?</summary>
        <p>Mulailah dari kelas HTML, lalu lanjut ke CSS dan JavaScript.</p>
      </details>
    </main>

    <script>
      for (const d of document.querySelectorAll('details[name="faq"]')) {
        d.addEventListener("toggle", () => {
          console.log(d.querySelector("summary").textContent, "terbuka:", d.open);
        });
      }
    </script>
  </body>
</html>
```

> **Status dukungan (Oktober 2026):** `<details>` sendiri berstatus *Baseline Widely Available*, sedangkan atribut `name` (akordeon eksklusif) berstatus *Baseline Newly Available* sejak September 2024 (Chrome/Edge 120+, Safari 17.2+, Firefox 130+).

## 3. Mengganti Ikon Panah Bawaan dengan Ikon Kustom yang Aksesibel

Apabila desain antarmuka Anda membutuhkan ikon tanda tambah (`+`) dan kurang (`−`) di sisi kanan judul `<summary>`, Anda dapat menyembunyikan penanda bawaan dengan `list-style: none` (serta `::-webkit-details-marker { display: none; }` untuk kompatibilitas WebKit lama) lalu menambahkan ikon dekoratif yang diberi `aria-hidden="true"`:

```html
<style>
  .item-akordeon {
    border: 1px solid #cbd5e1;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    margin-block-end: 0.5rem;
  }
  .item-akordeon > summary {
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    cursor: pointer;
  }
  .item-akordeon > summary::-webkit-details-marker {
    display: none;
  }
  .ikon-status::before {
    content: "+";
    font-weight: 700;
  }
  .item-akordeon[open] .ikon-status::before {
    content: "−";
  }
</style>

<details class="item-akordeon" name="kurikulum">
  <summary>
    <span>Modul 1: Cara Web Bekerja</span>
    <span class="ikon-status" aria-hidden="true"></span>
  </summary>
  <p>Membahas DNS, TCP/TLS, HTTP/3, dan Critical Rendering Path.</p>
</details>
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menaruh tombol `<button>` atau tautan `<a href>` di dalam `<summary>`:** Karena seluruh area `<summary>` sudah berfungsi sebagai tombol interaktif pemicu buka-tutup, menempatkan elemen interaktif lain di dalamnya membingungkan pengguna papan ketik dan pembaca layar (mengeklik tautan bisa sekaligus membuka/menutup akordeon).
2. **Memberikan lebih dari satu atribut `open` pada grup `<details name="...">` yang sama di HTML awal:** Spesifikasi melarang beberapa elemen `<details>` dengan `name` yang sama memiliki atribut `open` sekaligus karena melanggar sifat eksklusif grup tersebut.
3. **Mendengarkan event `click` pada `<summary>` untuk mengecek `details.open`:** Saat event `click` pada `<summary>` dieksekusi, atribut `open` pada `<details>` **belum berubah**! Selalu dengarkan event **`toggle`** pada elemen `<details>` untuk membaca status `details.open` yang sudah diperbarui.

## Latihan Praktik

Buatlah berkas `30-details-dan-summary-lanjutan-akordeon-eksklusif.html` untuk halaman silabus kursus:
1. Buat empat elemen `<details name="silabus-html">` yang masing-masing mewakili satu bab materi, dengan bab pertama diberi atribut `open`.
2. Gunakan CSS `summary::marker` atau ikon kustom untuk membedakan tampilan `<details>` yang sedang terbuka (`details[open]`) dari yang tertutup.
3. Tambahkan skrip yang mendengarkan event `toggle` pada keempat `<details>` dan memperbarui teks `<output>` dengan judul bab yang sedang aktif dibuka.

## Kuis Pemahaman

### Soal 1
Bagaimana cara membuat beberapa elemen `<details>` bekerja sebagai **akordeon eksklusif** (membuka satu item otomatis menutup item lain dalam kelompok tersebut) menggunakan HTML standar tanpa JavaScript?
- A. Membungkus semuanya di dalam tag `<accordion exclusive>`
- B. Memberikan nilai atribut `name` yang sama pada setiap elemen `<details>` dalam kelompok tersebut (misalnya `<details name="faq">`)
- C. Menambahkan atribut `role="radiogroup"` pada elemen `<summary>`
- D. Memberikan `id` yang sama pada semua elemen `<details>`

**Jawaban Benar:** B
**Penjelasan:** Atribut `name` pada `<details>` menghubungkan beberapa elemen `<details>` menjadi satu kelompok eksklusif sehingga hanya satu elemen dengan `name` tersebut yang dapat berstatus `open` pada satu waktu.

### Soal 2
Mengapa memeriksa `detailsElement.open` di dalam event **`toggle`** pada `<details>` jauh lebih akurat daripada memeriksanya di dalam event `click` pada `<summary>`?
- A. Karena `<summary>` tidak mendukung event `click`
- B. Karena event `toggle` dipicu tepat setelah status `open` pada `<details>` selesai berubah (baik dibuka/ditutup lewat klik, papan ketik, maupun fitur *Find in Page*), sedangkan saat `click` terjadi status `open` belum diperbarui
- C. Karena event `toggle` dapat membatalkan pembukaan `<details>` dengan `e.preventDefault()`
- D. Karena `detailsElement.open` mengembalikan string di dalam event `click`

**Jawaban Benar:** B
**Penjelasan:** Event `toggle` dipancarkan oleh `<details>` setelah atribut `open` ditambahkan atau dihapus, sehingga properti boolean `detailsElement.open` dijamin mencerminkan keadaan terbaru.

### Soal 3
Elemen apakah yang **wajib** diletakkan sebagai anak pertama di dalam `<details>` untuk memberikan judul atau label pemicu yang dapat diklik pengguna?
- A. `<legend>`
- B. `<caption>`
- C. `<summary>`
- D. `<header>`

**Jawaban Benar:** C
**Penjelasan:** Spesifikasi HTML menetapkan bahwa `<summary>` harus menjadi elemen anak pertama dari `<details>` untuk menyediakan label interaktif bagi komponen pengungkapan tersebut.

## Sumber
- [`<details>` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details)
- [Interactive elements — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/interactive-elements.html)
