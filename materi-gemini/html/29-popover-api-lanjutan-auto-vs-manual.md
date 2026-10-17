# Popover API Mendalam: `popover="auto"` vs `popover="manual"`, Event `toggle`, dan Pemicu Deklaratif

- **Tingkat:** Menengah
- **Ringkasan:** Membedakan perilaku *light dismiss* dan penutupan otomatis antar-popover pada `popover="auto"` dengan popover independen `popover="manual"` (seperti *toast notification*), serta mendengarkan event `beforetoggle` dan `toggle`.

## Mengapa Popover API Menjadi Standar Baru untuk Menu Sembul dan Notifikasi?

Sebelum hadirnya **Popover API**, membuat menu profil, panel filter, atau notifikasi *toast* mengharuskan pengembang berurusan dengan tumpukan `z-index` yang sering tertutup oleh kontainer induk yang memiliki `overflow: hidden`, serta menulis pendengar klik dokumen (`document.addEventListener("click", ...)`) untuk menutup menu saat pengguna mengeklik di luar.

Dengan atribut global `popover` di [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/popover.html), elemen apa pun yang dibuka sebagai popover akan langsung dipromosikan ke **Top Layer** peramban—bebas dari potongan `overflow` maupun perang `z-index`—tanpa mengunci halaman di belakangnya seperti `<dialog>` modal.

## 1. Perbedaan Perilaku `popover="auto"` vs `popover="manual"`

Popover API menyediakan dua mode utama melalui nilai atribut `popover`:

| Karakteristik | `popover="auto"` (atau `popover` tanpa nilai) | `popover="manual"` |
|---|---|---|
| **Klik di luar panel (*Light Dismiss*)** | **Ya**, mengeklik di luar area popover otomatis menutupnya. | **Tidak**, klik di luar tidak menutup popover. |
| **Tombol `Esc` (*Close Request*)** | **Ya**, menekan `Esc` menutup popover yang sedang aktif. | **Tidak**, tombol `Esc` tidak menutup popover. |
| **Eksklusivitas antar-popover** | Membuka satu `popover="auto"` akan **menutup `popover="auto"` lain** yang sedang terbuka (kecuali jika bersarang di dalamnya). | **Independen**: beberapa `popover="manual"` dapat tampil bersamaan di layar tanpa saling menutup. |
| **Cara menutup** | Otomatis lewat klik-luar, `Esc`, tombol `popovertarget`, atau `hidePopover()`. | Hanya melalui tombol pemicu eksplisit (`popovertargetaction="hide"`/`"toggle"`) atau pemanggilan JS `hidePopover()`. |
| **Kasus penggunaan ideal** | Menu dropdown navigasi, pemilih warna, panel notifikasi lonceng, keterangan alat. | Notifikasi *toast* ("Perubahan tersimpan"), bilah status mengambang, atau panel debug. |

Selain menggunakan `popovertarget="id-popover"`, Anda dapat mengendalikan aksi tombol secara spesifik menggunakan atribut **`popovertargetaction`**:
- `popovertargetaction="toggle"` (bawaan): Membuka jika tertutup, menutup jika terbuka.
- `popovertargetaction="show"`: Hanya membuka popover.
- `popovertargetaction="hide"`: Hanya menutup popover.

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Popover Auto dan Manual — Kodeloka</title>
  </head>
  <body>
    <main>
      <h1>Popover Auto dan Manual</h1>

      <!-- popover="auto": tertutup saat Esc atau klik di luar panel -->
      <button type="button" popovertarget="menu-profil">Menu Profil</button>
      <div id="menu-profil" popover="auto">
        <p>Panel ini tertutup otomatis saat Anda menekan Esc atau mengeklik di luar panel.</p>
      </div>

      <!-- popover="manual": hanya tertutup lewat tombol atau kode Anda -->
      <button type="button" popovertarget="info-simpan" popovertargetaction="show">Simpan</button>
      <div id="info-simpan" popover="manual" role="status">
        Perubahan tersimpan.
        <button type="button" popovertarget="info-simpan" popovertargetaction="hide">Tutup</button>
      </div>
    </main>

    <script>
      document.getElementById("menu-profil").addEventListener("toggle", (e) => {
        console.log("Status baru:", e.newState); // "open" atau "closed"
      });
    </script>
  </body>
</html>
```

> **Status dukungan (Oktober 2026):** Popover API berstatus *Baseline Newly Available* sejak Januari 2025, yaitu tersedia di Chrome, Edge, Firefox, dan Safari (desktop maupun iOS).

## 2. Siklus Event `beforetoggle` vs `toggle` dan Metode DOM Popover

Ketika sebuah popover dibuka atau ditutup—baik melalui tombol HTML maupun metode JavaScript `element.showPopover()`, `element.hidePopover()`, dan `element.togglePopover()`—peramban memancarkan dua event bertipe `ToggleEvent` yang memiliki properti **`e.oldState`** dan **`e.newState`** (`"closed"` atau `"open"`):

1. **`beforetoggle`:** Dipicu **sebelum** perubahan status terjadi. Saat popover akan dibuka (`e.newState === "open"`), event ini dapat dibatalkan dengan `e.preventDefault()`, tetapi saat popover akan ditutup (`e.newState === "closed"`), event ini tidak dapat dibatalkan.
2. **`toggle`:** Dipicu **setelah** popover berubah status dan tidak dapat dibatalkan. Sangat cocok untuk memuat data secara malas (*lazy load*), mencatat analitik, atau mengatur pengatur waktu penutupan otomatis pada *toast* `popover="manual"`:

```html
<button type="button" id="tombol-salin">Salin Tautan Kelas</button>
<div id="toast-salin" popover="manual" role="status">
  Tautan berhasil disalin ke papan klip!
</div>

<script>
  const tombolSalin = document.getElementById("tombol-salin");
  const toastSalin = document.getElementById("toast-salin");
  let idTimer;

  tombolSalin.addEventListener("click", () => {
    toastSalin.showPopover();
  });

  toastSalin.addEventListener("toggle", (e) => {
    if (e.newState === "open") {
      clearTimeout(idTimer);
      // Tutup toast manual secara otomatis setelah 3 detik
      idTimer = setTimeout(() => toastSalin.hidePopover(), 3000);
    }
  });
</script>
```

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan `popover` ketika seharusnya memakai `<dialog>` modal:** Popover **tidak** membuat halaman di belakangnya menjadi `inert`. Jika pengguna wajib menyelesaikan aksi sebelum berinteraksi dengan halaman utama (seperti konfirmasi penghapusan akun), gunakan `<dialog>` dengan `showModal()`, bukan `popover`.
2. **Menimpa `display` secara global pada elemen `[popover]`:** Elemen `[popover]` disembunyikan oleh stylesheet bawaan peramban menggunakan `display: none` saat tertutup, dan baru terlihat ketika memiliki pseudo-class **`:popover-open`**. Jika Anda menulis `#menu-profil { display: flex; }` tanpa `:popover-open`, popover tersebut akan selalu tampak di layar meskipun sedang berstatus tertutup! Selalu tulis `#menu-profil:popover-open { display: flex; }`.
3. **Memakai `popover="auto"` untuk notifikasi *toast*:** Karena `popover="auto"` memiliki perilaku *light dismiss*, begitu pengguna mengeklik bagian mana pun di halaman atau membuka menu dropdown lain, notifikasi *toast* akan langsung hilang sebelum sempat terbaca. Gunakan `popover="manual"` untuk *toast*.

## Latihan Praktik

Buatlah berkas `29-popover-api-lanjutan-auto-vs-manual.html` yang mendemonstrasikan kedua jenis popover:
1. Buat dua menu dropdown berdampingan ("Pilih Bahasa" dan "Pilih Tema") yang keduanya menggunakan `popover="auto"` dan dipicu dengan `popovertarget`. Uji bahwa membuka menu kedua otomatis menutup menu pertama.
2. Buat sebuah panel notifikasi `<div id="toast-unduh" popover="manual" role="status">` yang dibuka oleh tombol `<button type="button" popovertarget="toast-unduh" popovertargetaction="show">Unduh Materi</button>` dan memiliki tombol tutup di dalamnya (`popovertargetaction="hide"`).
3. Tambahkan aturan CSS `:popover-open` untuk menata bingkai dan bayangan panel hanya ketika popover sedang terbuka.

## Kuis Pemahaman

### Soal 1
Apa yang terjadi apabila sebuah elemen `<div id="menu-a" popover="auto">` sedang terbuka, lalu pengguna mengeklik tombol yang membuka `<div id="menu-b" popover="auto">` (yang tidak bersarang di dalam `menu-a`)?
- A. Peramban menolak membuka `menu-b` sampai pengguna menutup `menu-a` secara manual
- B. Peramban secara otomatis menutup `menu-a` terlebih dahulu lalu menampilkan `menu-b` di *top layer*
- C. Kedua popover tampil bertumpuk dan mengunci seluruh halaman di belakangnya menjadi `inert`
- D. Halaman otomatis bergulir ke bagian paling bawah dokumen

**Jawaban Benar:** B
**Penjelasan:** Popover dengan mode `popover="auto"` saling eksklusif untuk elemen yang tidak bersarang: membuka satu popover `auto` baru akan otomatis menutup popover `auto` lain yang sedang aktif.

### Soal 2
Mengapa penulisan CSS `.panel-popover { display: grid; }` menyebabkan elemen `<div class="panel-popover" popover="auto">` tetap terlihat di layar meskipun belum dibuka?
- A. Karena CSS Grid tidak kompatibel dengan Popover API
- B. Karena aturan `display: grid` menimpa aturan bawaan peramban `[popover]:not(:popover-open) { display: none; }`; seharusnya gaya tata letak ditulis pada selektor `.panel-popover:popover-open`
- C. Karena atribut `popover` hanya bekerja pada elemen `<dialog>`
- D. Karena `display: grid` mengubah nilai `popover="auto"` menjadi `popover="manual"`

**Jawaban Benar:** B
**Penjelasan:** Peramban menyembunyikan popover yang belum aktif dengan `display: none`. Menetapkan `display: grid` atau `display: flex` tanpa membatasinya pada pseudo-class `:popover-open` akan menimpa penyembunyian bawaan tersebut.

### Soal 3
Pada objek event `ToggleEvent` yang diterima oleh pendengar `element.addEventListener("toggle", (e) => { ... })`, pasangan properti manakah yang menunjukkan status sebelum dan sesudah perubahan?
- A. `e.prev` dan `e.next` (bernilai `true` atau `false`)
- B. `e.oldState` dan `e.newState` (bernilai `"open"` atau `"closed"`)
- C. `e.from` dan `e.to` (bernilai `0` atau `1`)
- D. `e.statusLama` dan `e.statusBaru`

**Jawaban Benar:** B
**Penjelasan:** Antarmuka `ToggleEvent` menyediakan properti `oldState` dan `newState` yang berisi string `"open"` atau `"closed"`.

## Sumber
- [Popover API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- [`popover` HTML global attribute — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover)
- [Popover API — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/popover.html)
