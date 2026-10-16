# Transisi Antar-Tampilan (View Transition API) dan CSS Anchor Positioning

- **Tingkat:** Lanjut
- **Ringkasan:** Menghaluskan perpindahan antarmuka saat DOM berubah atau saat berpindah halaman menggunakan View Transition API (`document.startViewTransition` dan `@view-transition`), serta menambatkan posisi *popover/tooltip* ke elemen pemicu menggunakan CSS Anchor Positioning (`anchor-name`, `position-anchor`).

## 1. Mengenal View Transition API: Animasi Perubahan State Tanpa Rumit

Pernahkah Anda ingin menganimasikan perubahan tata letak—misalnya saat daftar kartu disaring berdasarkan kategori, saat pengguna berpindah tab di dalam halaman, atau saat gambar kecil di katalog membesar menjadi gambar sampul di halaman rincian?

Dulu, menganimasikan perubahan struktur DOM sangatlah sulit karena Anda harus menyimpan koordinat lama, mengubah DOM, lalu menghitung balik selisih posisinya (teknik *FLIP*).

Kini, **View Transition API** menyelesaikan semuanya secara otomatis:
1. Peramban memotret tampilan lama (*old state snapshot*).
2. Kode Anda memperbarui DOM (atau berpindah halaman).
3. Peramban memotret tampilan baru (*new state snapshot*), lalu **secara otomatis menganimasikan transisi pudar (*cross-fade*) sekaligus pergeseran posisi dan ukuran (*morphing*)** di antara keduanya!

### A. Transisi di Dalam Halaman Tunggal (SPA / Manipulasi DOM)
Cukup bungkus fungsi pembaruan DOM Anda di dalam **`document.startViewTransition(() => { ... })`** (dengan pemeriksaan progresif agar tetap berjalan lancar di semua peramban):

```js
function perbaruiTampilanKatalog(kategoriBaru) {
  // Fallback aman jika peramban belum mendukung startViewTransition
  if (!document.startViewTransition) {
    renderKartu(kategoriBaru);
    return;
  }

  // Peramban otomatis menganimasikan perpindahan dari tampilan lama ke tampilan baru!
  document.startViewTransition(() => {
    renderKartu(kategoriBaru);
  });
}
```

### B. Transisi Lintas Halaman Murni CSS (`@view-transition`)
Bahkan untuk situs multi-halaman klasik (*Multi-Page Application / MPA* seperti halaman artikel statis di Kodeloka!), Anda kini dapat mengaktifkan transisi mulus saat pengguna berpindah halaman dalam satu *origin* yang sama cukup dengan menambahkan aturan **`@view-transition`** di berkas CSS kedua halaman (didukung Chrome/Edge 126 dan Safari 18.2; Firefox belum mendukungnya, sehingga di sana halaman tetap berpindah seperti biasa tanpa animasi):

```css
@view-transition {
  navigation: auto;
}

/* Jika Anda memberi view-transition-name yang unik pada elemen yang sama
   di halaman katalog dan halaman detail, peramban otomatis menganimasikan
   perpindahan posisi dan ukuran elemen tersebut! */
.kartu-php__ikon {
  view-transition-name: ikon-kelas-php;
}

/* Tetap hormati pengguna yang sensitif terhadap gerakan! */
@media (prefers-reduced-motion: reduce) {
  @view-transition {
    navigation: none;
  }
}
```

> **⚠️ Aturan Penting `view-transition-name`:**
> Nilai `view-transition-name` **wajib unik** di antara seluruh elemen yang sedang terlihat di halaman pada saat transisi berlangsung! Jika ada dua elemen yang tampak secara bersamaan memiliki `view-transition-name` yang sama persis, transisi akan dibatalkan oleh peramban.

## 2. CSS Anchor Positioning: Menambatkan Popover & Tooltip Tanpa Pustaka JS

Ketika Anda membuka sebuah `<div popover>` (dari Pelajaran 12 HTML), secara bawaan elemen popover muncul di tengah layar karena berada di *Top Layer*. Jika Anda ingin membuat menu tarik-turun (*dropdown*) atau *tooltip* yang **menempel tepat di bawah tombol pemicunya**, dulu Anda harus menghitung koordinat `getBoundingClientRect()` lewat JavaScript dan menangani bagaimana jika menu tersebut mentok di tepi bawah layar!

Spesifikasi baru **CSS Anchor Positioning** mengizinkan Anda menambatkan posisi sebuah elemen langsung ke elemen jangkar (*anchor*) menggunakan CSS murni:

1. **Pada Tombol Pemicu (Jangkar):** Beri nama jangkar dengan **`anchor-name: --tombol-profil;`**.
2. **Pada Elemen Popover / Tooltip:** Kaitkan ke jangkar tersebut dengan **`position-anchor: --tombol-profil;`**, lalu posisikan menggunakan fungsi **`anchor()`** atau properti **`position-area`**!

```css
/* 1. Tandai tombol sebagai titik jangkar bernama --jangkar-menu */
#tombol-menu-profil {
  anchor-name: --jangkar-menu;
}

/* 2. Kaitkan panel popover ke jangkar tersebut */
#panel-menu-profil[popover] {
  margin: 0;
  position: fixed;
  position-anchor: --jangkar-menu;

  /* Tempatkan bagian atas panel tepat di bawah bagian bawah tombol (+ jarak 0.5rem),
     dan sejajarkan tepi kirinya dengan tepi kiri tombol! */
  inset-block-start: calc(anchor(bottom) + 0.5rem);
  inset-inline-start: anchor(left);

  /* Otomatis balikkan posisi ke atas tombol jika ruang di bawah layar tidak cukup! */
  position-try-fallbacks: flip-block;
}
```

Perhatikan betapa hebatnya **`position-try-fallbacks: flip-block;`**: jika tombol berada di bagian paling bawah layar sehingga menu tidak muat ditampilkan ke bawah, peramban **secara otomatis membalikkan posisi menu ke atas tombol** tanpa satu baris JavaScript pun!

*(Catatan Dukungan Peramban: CSS Anchor Positioning berstatus Baseline Newly Available sejak Januari 2026, didukung di Chrome/Edge 125+, Firefox 147+, dan Safari 26+; peramban yang lebih lama belum mendukungnya, jadi gunakan bersama `@supports (anchor-name: --a)` sebagai peningkatan progresif di atas posisi popover bawaan).*

## Latihan Praktik: Penyaringan Katalog dengan View Transition dan Menu Terjangkar

Buatlah berkas `view-transition.html` dan `vt.css`:
1. Buat daftar 4 kartu dengan tombol filter kategori (*Semua*, *Frontend*, *Backend*) yang memanggil `document.startViewTransition()` saat menyembunyikan/menampilkan kartu.
2. Berikan `view-transition-name` yang unik pada masing-masing kartu (`kartu-1`, `kartu-2`, dst.) sehingga kartu yang tersisa tampak bergeser merapat secara mulus.
3. Buat sebuah tombol dan `<div popover>` yang menggunakan `@supports (anchor-name: --menu)` untuk menempel tepat di bawah tombolnya.

## Kuis Pemahaman

### Soal 1
Apa yang terjadi apabila terdapat **dua elemen yang sama-sama sedang terlihat di layar** memiliki nilai properti `view-transition-name: kartu-utama;` yang identik ketika `document.startViewTransition()` dipanggil?
- A. Kedua elemen tersebut menyatu menjadi satu elemen.
- B. Peramban membatalkan (*skip*) animasi transisi karena setiap `view-transition-name` yang aktif pada saat yang sama wajib bersifat unik agar peramban tahu pasangan elemen mana yang harus dihubungkan dari tampilan lama ke tampilan baru.
- C. Hanya elemen pertama yang dianimasikan.
- D. Halaman akan dimuat ulang secara otomatis.

**Jawaban Benar:** B
**Penjelasan:** Mesin View Transition memasangkan satu elemen di *snapshot* lama dengan satu elemen di *snapshot* baru berdasarkan `view-transition-name`-nya. Jika nama tersebut ganda pada elemen yang sama-sama terlihat, pemetaan menjadi ambigu sehingga animasi transisi dilewati.

### Soal 2
Aturan CSS apakah yang perlu ditambahkan untuk mengaktifkan View Transition otomatis saat pengguna berpindah antar-halaman (*cross-document navigation*) dalam satu domain yang sama?
- A. `@media (transition: page) { body { animate: auto; } }`
- B. `@view-transition { navigation: auto; }`
- C. `html { page-transition: smooth; }`
- D. `@keyframes page-load { from { opacity: 0; } }`

**Jawaban Benar:** B
**Penjelasan:** At-rule `@view-transition { navigation: auto; }` pada kedua halaman (halaman asal dan halaman tujuan dalam satu *origin*) mengaktifkan transisi lintas dokumen secara deklaratif tanpa memerlukan router SPA JavaScript.

### Soal 3
Dalam modul CSS Anchor Positioning, apa fungsi dari deklarasi `position-try-fallbacks: flip-block;` pada sebuah menu popover yang ditambatkan di bawah sebuah tombol?
- A. Memutar teks di dalam menu menjadi terbalik 180 derajat.
- B. Menginstruksikan peramban untuk secara otomatis memindahkan posisi menu ke sisi sebaliknya pada sumbu blok (yaitu ke **atas** tombol) apabila ruang di bawah tombol terlalu sempit dan akan membuat menu terpotong tepi layar.
- C. Mengubah elemen blok menjadi elemen inline.
- D. Menutup popover secara otomatis setelah 3 detik.

**Jawaban Benar:** B
**Penjelasan:** `position-try-fallbacks: flip-block` menyediakan strategi deteksi tabrakan tepi layar (*collision detection*) bawaan CSS: jika posisi utama di bawah jangkar meluber keluar *viewport*, peramban otomatis mencerminkannya ke atas jangkar.

## Sumber
- [View Transition API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [`@view-transition` CSS at-rule — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@view-transition)
- [CSS anchor positioning — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning)
- [Using CSS anchor positioning — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using)
