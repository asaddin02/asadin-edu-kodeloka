# Rekayasa Aksesibilitas di JavaScript: Fokus Terkelola, Roving `tabindex`, dan `aria-live`

- **Tingkat:** Lanjut
- **Ringkasan:** Mengimplementasikan pola interaksi papan ketik standar **WAI-ARIA Authoring Practices (APG)** menggunakan JavaScript: mengelola *Roving `tabindex`* pada kelompok tab/menu, mengembalikan fokus saat dialog ditutup, serta mengumumkan status asinkron ke pembaca layar via `aria-live`.

## Mengapa Komponen Interaktif Kustom Membutuhkan Pengelolaan Fokus di JavaScript?

Saat Anda menggunakan elemen HTML bawaan seperti `<select>` atau `<input type="radio">`, peramban sudah menangani ergonomi papan ketik secara otomatis: pengguna menekan tombol `Tab` **satu kali** untuk masuk ke kelompok radio, memilih opsi di dalamnya menggunakan **tombol panah (`ArrowRight` / `ArrowDown`)**, lalu menekan `Tab` satu kali lagi untuk langsung melompat keluar ke kolom formulir berikutnya!

Namun, ketika Anda membangun komponen gabungan kustom (*composite widget*) seperti bilah alat (*toolbar*), daftar tab (`role="tablist"`), atau kisi kartu interaktif, peramban tidak tahu cara mengelompokkan fokusnya. Tanpa pengelolaan fokus JavaScript, pengguna papan ketik terpaksa menekan tombol `Tab` 20 kali untuk melewati 20 tombol di dalam satu bilah alat. Teknik standar [W3C ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/) untuk menyelesaikannya adalah **Roving `tabindex`**.

> **⚠️ Jebakan Umum di Lapangan:** Membiarkan pengguna menekan tombol `Tab` berkali-kali untuk melewati 20 tombol di dalam satu bilah alat (*toolbar*) atau daftar tab melanggar ergonomi aksesibilitas; gunakan pola *Roving `tabindex`* (satu `tabindex='0'` untuk masuk ke kelompok, lalu tombol panah `ArrowRight`/`ArrowLeft` untuk berpindah di dalamnya).

## 1. Tiga Pilar Rekayasa Aksesibilitas di JavaScript

Saat menulis logika komponen UI di JavaScript, pastikan ketiga pilar berikut selalu terpenuhi:

| Pilar Rekayasa Aksesibilitas | Masalah yang Diselesaikan | Mekanisme DOM / ARIA yang Digunakan |
| :--- | :--- | :--- |
| **1. Roving `tabindex`** | Mengelompokkan deretan kontrol (tab, toolbar, menu) menjadi **satu pemberhentian `Tab` tunggal**. | Hanya 1 item aktif yang memiliki `el.tabIndex = 0`; seluruh item saudara diberi `el.tabIndex = -1`. Tombol panah (`ArrowRight`/`Left`, `Home`, `End`) memindahkan `tabIndex = 0` dan memanggil `.focus()`. |
| **2. Pemulihan Fokus (*Focus Restoration*)** | Mencegah fokus terlempar ke awal `<body>` saat elemen yang sedang difokuskan ditutup/dihapus. | Simpan `const pemicu = document.activeElement` sebelum membuka panel/modal, lalu panggil `pemicu?.focus()` saat ditutup. |
| **3. Sinkronisasi State & Pengumuman Asinkron** | Memberi tahu pembaca layar saat status tombol berubah atau proses `fetch()` selesai. | Perbarui `setAttribute("aria-expanded", String(terbuka))` dan isi teks wadah `role="status"` / `aria-live="polite"`. |

## 2. Implementasi Lengkap *Roving `tabindex`* (Panah, `Home`, dan `End`)

Berikut adalah fungsi utilitas siap pakai yang menerapkan *Roving `tabindex`* lengkap dengan dukungan tombol `ArrowRight`, `ArrowLeft`, `Home` (lompat ke item pertama), dan `End` (lompat ke item terakhir) sesuai spesifikasi W3C APG:

```javascript
export function pasangRovingTabindex(daftarTombol, onPilih) {
  daftarTombol.forEach((btn, idx) => {
    btn.tabIndex = idx === 0 ? 0 : -1;

    btn.addEventListener("keydown", (e) => {
      let idxBaru = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        idxBaru = (idx + 1) % daftarTombol.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        idxBaru = (idx - 1 + daftarTombol.length) % daftarTombol.length;
      } else if (e.key === "Home") {
        idxBaru = 0;
      } else if (e.key === "End") {
        idxBaru = daftarTombol.length - 1;
      }

      if (idxBaru === null) return;
      e.preventDefault(); // Cegah tombol panah/Home/End menggulir layar halaman!

      daftarTombol.forEach((item, i) => {
        item.tabIndex = i === idxBaru ? 0 : -1;
      });
      daftarTombol[idxBaru].focus();
      onPilih?.(daftarTombol[idxBaru], idxBaru);
    });
  });
}
```

## 3. Menyimpan dan Memulihkan Fokus Saat Menghapus Item Daftar

Bagaimana jika pengguna menekan tombol **"Hapus"** pada item ke-3 dari daftar tugas (*to-do list*)? Begitu elemen item ke-3 dihapus dari DOM dengan `item.remove()`, fokus papan ketik pengguna akan hilang dan terlempar kembali ke awal halaman!

Pola aksesibel yang benar saat menghapus item dari daftar adalah memindahkan fokus secara cerdas ke **item berikutnya** (atau item sebelumnya jika yang dihapus adalah item terakhir, atau ke judul daftar jika daftar menjadi kosong):

```javascript
export function hapusItemDaftarDenganFokusAman(elemenItem, daftarInduk, elemenCadanganKosong) {
  const targetFokusBerikutnya =
    elemenItem.nextElementSibling?.querySelector("button, a, input") ||
    elemenItem.previousElementSibling?.querySelector("button, a, input") ||
    elemenCadanganKosong;

  elemenItem.remove();
  targetFokusBerikutnya?.focus();
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Lupa memanggil `e.preventDefault()` saat menangani tombol `ArrowDown`, `ArrowUp`, `Home`, atau `End`:** Tanpa `e.preventDefault()`, menekan tombol `ArrowDown` atau `End` untuk berpindah tab juga akan sekaligus menggulir layar peramban ke bawah secara paksa!
2. **Menulis `el.setAttribute("aria-expanded", !terbuka)` namun lupa memperbarui tampilan visual (atau sebaliknya):** Di CSS modern, Anda bahkan dapat menata tampilan panel langsung menggunakan selektor atribut **`button[aria-expanded="true"]`** sehingga tampilan visual dan status aksesibilitas tidak mungkin tidak sinkron!
3. **Memanggil `elemen.focus()` pada elemen yang masih berstatus `hidden` atau `display: none`:** Peramban mengabaikan pemanggilan `.focus()` pada elemen yang tersembunyi. Selalu ubah `panel.hidden = false` **terlebih dahulu**, baru panggil `tombolDiDalamPanel.focus()` pada baris setelahnya.

## Latihan Praktik Mandiri

1. Buat halaman `toolbar-editor.html` berisi bilah alat `<div role="toolbar" aria-label="Pemformatan teks">` dengan 5 tombol ("Tebal", "Miring", "Garis Bawah", "Rata Kiri", "Rata Tengah").
2. Terapkan `pasangRovingTabindex` pada kelima tombol tersebut sehingga menekan `Tab` dari kolom judul langsung masuk ke tombol aktif di toolbar, menekan `Tab` sekali lagi langsung melompat ke `<textarea>` di bawahnya, dan tombol panah/`Home`/`End` berpindah antar-tombol di dalam toolbar.
3. Saat tombol "Tebal" ditekan, ubah atribut `aria-pressed="true"` / `"false"` pada tombol tersebut.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penerapan pola **Roving `tabindex`** pada komponen gabungan seperti bilah alat (`role="toolbar"`) atau deretan tab (`role="tablist"`)?
- A. Menyembunyikan seluruh tombol dari pembaca layar
- B. Menjadikan seluruh kelompok komponen hanya memiliki **satu titik henti tombol `Tab`** (`tabindex="0"` pada item yang sedang aktif dan `tabindex="-1"` pada item lainnya), sementara perpindahan antar-item di dalam kelompok dilakukan dengan tombol panah (`ArrowRight`/`ArrowLeft`)
- C. Mengubah semua elemen `<button>` menjadi `<div>`
- D. Memaksa pengguna menggunakan tetikus

**Jawaban Benar:** B
**Penjelasan:** Dengan *Roving `tabindex`*, pengguna papan ketik dapat melewati bilah alat yang berisi 20 tombol hanya dengan satu kali tekan tombol `Tab`, atau masuk ke dalamnya dan memilih tombol spesifik menggunakan tombol panah.

### Soal 2
Mengapa kode berikut ini gagal memindahkan fokus papan ketik ke dalam panel dialog kustom?
```javascript
tombolTutup.focus();
panelDialog.hidden = false;
```
- A. Karena metode `.focus()` membutuhkan argumen boolean `true`
- B. Karena pada saat `tombolTutup.focus()` dipanggil, elemen induknya (`panelDialog`) masih memiliki atribut `hidden = true` (`display: none`) sehingga tidak dapat menerima fokus; `panelDialog.hidden = false` wajib dijalankan **sebelum** `tombolTutup.focus()`
- C. Karena elemen `<button>` tidak memiliki metode `.focus()`
- D. Karena atribut `hidden` bersifat permanen

**Jawaban Benar:** B
**Penjelasan:** Peramban menolak memberikan fokus pada elemen yang sedang tidak dirender (`hidden`, `display: none`, atau `visibility: hidden`). Tampilkan elemen terlebih dahulu, baru panggil `.focus()`.

### Soal 3
Ketika pengguna menekan tombol "Hapus" pada salah satu item di dalam daftar interaktif hingga elemen item tersebut dihapus dari DOM (`item.remove()`), ke manakah fokus papan ketik sebaiknya dipindahkan oleh kode JavaScript Anda?
- A. Dibiarkan saja sehingga fokus terlempar kembali ke elemen `<body>` di paling atas halaman
- B. Dipindahkan secara terprogram (`.focus()`) ke kontrol interaktif pada item berikutnya (atau item sebelumnya jika item terakhir yang dihapus, atau ke elemen judul/wadah daftar jika seluruh item telah habis)
- C. Dipindahkan ke bilah alamat URL peramban
- D. Dikunci dengan `inert` pada seluruh halaman

**Jawaban Benar:** B
**Penjelasan:** Menghapus elemen yang sedang memegang fokus (`document.activeElement`) tanpa memindahkan fokus secara eksplisit akan mereset fokus ke `<body>`, memaksa pengguna papan ketik dan pembaca layar menavigasi ulang dari awal halaman.

## Sumber

- [Keyboard-navigable JavaScript widgets — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Keyboard-navigable_JavaScript_widgets)
- [ARIA live regions — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)
- [ARIA Authoring Practices Guide (APG) — W3C](https://www.w3.org/WAI/ARIA/apg/)
