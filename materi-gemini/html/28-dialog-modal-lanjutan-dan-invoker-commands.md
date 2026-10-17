# Pola `<dialog>` Lanjutan: `returnValue`, Event `cancel`/`close`, `closedby`, dan Invoker Commands

- **Tingkat:** Menengah
- **Ringkasan:** Menguasai siklus hidup penuh elemen `<dialog>`, menangkap nilai kembalian tombol melalui `dialog.returnValue`, mengendalikan penutupan klik-luar dengan atribut `closedby`, serta membuka dialog tanpa JS dengan `commandfor` dan `command`.

## Mengapa Pola `<dialog>` Modern Mengurangi Ratusan Baris Kode JavaScript?

Membangun jendela modal secara manual dengan `<div>` menuntut pengelolaan jebakan fokus (*focus trap*), penguncian latar belakang (`inert`), penangkapan tombol `Esc`, penataan lapisan atas (*z-index*), serta pengiriman status tombol mana yang diklik pengguna. Elemen `<dialog>` bawaan HTML menangani seluruh kebutuhan tersebut langsung di mesin peramban.

Lebih jauh lagi, perkembangan terbaru di [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/interactive-elements.html) menghadirkan **Invoker Commands API (`commandfor` dan `command`)** untuk memicu pembukaan/penutupan dialog secara deklaratif tanpa satu baris JavaScript pun, serta atribut **`closedby`** untuk mengatur apakah dialog boleh ditutup dengan klik di luar kotak (*light dismiss*).

## 1. Siklus Hidup `<dialog>`: `<form method="dialog">`, `returnValue`, dan Event `cancel` vs `close`

Ketika di dalam `<dialog>` terdapat `<form method="dialog">`, menekan salah satu tombol `<button value="...">` di dalam formulir tersebut **tidak akan mengirim permintaan jaringan ke server**, melainkan:
1. Menutup kotak `<dialog>` secara otomatis;
2. Menyimpan nilai `value` dari tombol yang ditekan ke dalam properti **`dialog.returnValue`**;
3. Memicu event **`close`** pada elemen `<dialog>`.

Perhatikan perbedaan penting antara event **`cancel`** dan **`close`**:
- **Event `cancel`:** Hanya dipicu ketika pengguna meminta pembatalan dialog melalui tombol `Esc` (atau klik di luar dialog jika `closedby="any"`). Event ini dapat dibatalkan dengan `e.preventDefault()` jika Anda perlu mencegah penutupan saat formulir sedang mengirim data.
- **Event `close`:** Selalu dipicu setiap kali dialog berubah dari terbuka menjadi tertutup—baik karena tombol submit `<form method="dialog">`, pemanggilan `dialog.close("nilai")`, maupun setelah event `cancel`. Perlu diingat bahwa penutupan lewat tombol `Esc` **tidak mengubah** `dialog.returnValue` (nilainya tetap string kosong `""` atau nilai dari penutupan sebelumnya).

## 2. Mengatur Perilaku Penutupan dengan `closedby` dan Pemicu Deklaratif `commandfor`

Secara tradisional, `<dialog>` yang dibuka dengan `showModal()` dapat ditutup dengan menekan `Esc`, tetapi **tidak** tertutup saat pengguna mengeklik area gelap (`::backdrop`) di luar kotak dialog. Atribut **`closedby`** mengendalikan perilaku penutupan ini secara deklaratif:

| Nilai `closedby` | Klik di Luar Dialog (*Light Dismiss*) | Tombol `Esc` / Permintaan Tutup Sistem | Kasus Penggunaan Terbaik |
|---|---|---|---|
| `closedby="any"` | **Ya**, menutup dialog | **Ya**, menutup dialog | Jendela pratinjau gambar, pemilihan filter, atau konfirmasi ringan yang mudah ditutup. |
| `closedby="closerequest"` | **Tidak** menutup dialog | **Ya**, menutup dialog | Perilaku bawaan dialog modal (`showModal()`); mencegah penutupan tak sengaja saat mengisi formulir. |
| `closedby="none"` | **Tidak** menutup dialog | **Tidak** menutup dialog | Dialog kritis yang mewajibkan pengguna memilih salah satu tombol aksi secara eksplisit. |

Sementara itu, **Invoker Commands API** memungkinkan tombol `<button>` mengendalikan `<dialog>` hanya dengan atribut HTML:
- `commandfor="id-dialog"`: Menunjuk `id` elemen `<dialog>` target.
- `command="show-modal"`: Membuka `<dialog>` sebagai modal di *top layer* (setara dengan `dialog.showModal()`).
- `command="close"`: Menutup `<dialog>` yang sedang terbuka (dan jika tombol memiliki atribut `value`, nilai tersebut diteruskan ke `dialog.returnValue`).

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dialog Konfirmasi Lanjutan — Kodeloka</title>
  </head>
  <body>
    <main>
      <h1>Dialog Konfirmasi Lanjutan</h1>

      <!-- Invoker Commands: membuka dialog modal tanpa JavaScript -->
      <button type="button" command="show-modal" commandfor="dialog-hapus">Hapus Proyek</button>

      <!-- closedby="any": Esc dan klik di luar dialog menutupnya (light dismiss) -->
      <dialog id="dialog-hapus" closedby="any" aria-labelledby="judul-dialog">
        <h2 id="judul-dialog">Hapus proyek ini?</h2>
        <p>Tindakan ini tidak dapat dibatalkan.</p>
        <form method="dialog">
          <button value="batal" autofocus>Batal</button>
          <button value="hapus">Ya, hapus</button>
        </form>
      </dialog>

      <output id="hasil"></output>
    </main>

    <script>
      const dialog = document.getElementById("dialog-hapus");
      const hasil = document.getElementById("hasil");

      // Dipicu sebelum dialog tertutup lewat Esc atau klik di luar dialog
      dialog.addEventListener("cancel", () => {
        hasil.textContent = "Penghapusan dibatalkan lewat Esc atau klik di luar.";
      });

      // Dipicu setelah dialog tertutup; returnValue berisi value tombol yang ditekan
      dialog.addEventListener("close", () => {
        if (dialog.returnValue === "hapus") {
          hasil.textContent = "Proyek dihapus.";
        }
      });
    </script>
  </body>
</html>
```

> **Status dukungan (Oktober 2026):** `command` dan `commandfor` berstatus *Baseline Newly Available* sejak Desember 2025. Atribut `closedby` belum berstatus Baseline: didukung Chrome/Edge 134+ dan Firefox 141+, tetapi belum di Safari. Sediakan tombol "Batal" yang jelas di dalam dialog agar pengguna Safari tetap dapat menutupnya.

## 3. Mereset `returnValue` dan Mengatur Fokus Awal (`autofocus`)

Karena `dialog.returnValue` mempertahankan nilai dari penutupan sebelumnya apabila dialog ditutup menggunakan tombol `Esc`, ada jebakan halus jika pengguna membuka dialog untuk kedua kalinya lalu menekan `Esc`: `dialog.returnValue` masih berisi `"hapus"` dari sesi pertama! Untuk menghindarinya, kosongkan `dialog.returnValue = ""` setiap kali dialog ditutup oleh event `cancel` atau sebelum dibuka kembali:

```html
<script>
  const dialogKonfirmasi = document.getElementById("dialog-hapus");

  dialogKonfirmasi.addEventListener("cancel", () => {
    // Pastikan nilai kembalian dikosongkan saat pengguna membatalkan dengan Esc
    dialogKonfirmasi.returnValue = "batal";
  });
</script>
```

Untuk aksi yang bersifat merusak (seperti *"Hapus Proyek"*), pasang atribut **`autofocus`** pada tombol **"Batal"**, bukan pada tombol **"Ya, hapus"**. Dengan demikian, pengguna yang tidak sengaja menekan tombol `Enter` begitu dialog terbuka tidak akan langsung menghapus datanya.

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Membuka dialog dengan menambahkan atribut `open` di HTML untuk dialog modal:** Menambahkan `<dialog open>` secara langsung hanya membuka dialog dalam mode **non-modal** (tanpa `::backdrop`, tidak masuk ke *top layer*, dan latar belakang tidak dikunci). Gunakan `command="show-modal"` atau `dialog.showModal()`.
2. **Tidak mereset `dialog.returnValue` saat menangani `cancel`:** Jika pengguna menutup dialog dengan `Esc` pada pembukaan kedua, `dialog.returnValue` masih menyimpan nilai lama dari pembukaan pertama kecuali Anda mengaturnya ulang.
3. **Mengandalkan klik-luar (`closedby="any"`) sebagai satu-satunya cara menutup dialog:** Pengguna papan ketik, pembaca layar, dan peramban yang belum mendukung `closedby` membutuhkan tombol `<button>` penutup yang terlihat jelas di dalam dialog.

## Latihan Praktik

Buatlah berkas `28-dialog-modal-lanjutan-dan-invoker-commands.html` untuk fitur pengarsipan kelas:
1. Buat tombol `<button type="button" command="show-modal" commandfor="dialog-arsip">Arsipkan Kelas</button>`.
2. Buat elemen `<dialog id="dialog-arsip" closedby="any" aria-labelledby="judul-arsip">` yang memuat `<form method="dialog">` dengan tiga tombol: `value="batal"` (diberi `autofocus`), `value="arsip-sementara"`, dan `value="arsip-permanen"`.
3. Pasang pendengar event `cancel` untuk mereset `dialog.returnValue = "batal"`, serta pendengar event `close` yang menampilkan pilihan akhir pengguna di dalam elemen `<output>`.

## Kuis Pemahaman

### Soal 1
Apa yang dilakukan peramban ketika pengguna mengeklik `<button value="setuju">Simpan</button>` yang berada di dalam `<form method="dialog">` di dalam elemen `<dialog>`?
- A. Peramban mengirim permintaan HTTP `POST` ke URL `/dialog`
- B. Peramban menutup elemen `<dialog>`, mengisi `dialog.returnValue` dengan string `"setuju"`, dan memicu event `close`
- C. Peramban memicu event `cancel` tanpa menutup dialog
- D. Peramban memuat ulang (*reload*) seluruh halaman web

**Jawaban Benar:** B
**Penjelasan:** Metode formulir `method="dialog"` dirancang khusus untuk elemen `<dialog>`: saat dikirim, dialog langsung ditutup tanpa permintaan jaringan dan atribut `value` dari tombol pemicu disimpan ke dalam `dialog.returnValue`.

### Soal 2
Manakah nilai atribut `closedby` pada `<dialog>` yang mengizinkan pengguna menutup dialog baik dengan menekan tombol `Esc` maupun dengan mengeklik area latar di luar kotak dialog (*light dismiss*)?
- A. `closedby="none"`
- B. `closedby="closerequest"`
- C. `closedby="any"`
- D. `closedby="backdrop-only"`

**Jawaban Benar:** C
**Penjelasan:** Nilai `closedby="any"` mengaktifkan penutupan melalui klik di luar dialog (*light dismiss*) sekaligus tombol `Esc` (*close request*), sedangkan `closerequest` hanya mengizinkan `Esc` dan `none` menonaktifkan keduanya.

### Soal 3
Pasangan atribut deklaratif manakah dari **Invoker Commands API** yang dapat dipasang pada `<button type="button">` untuk membuka `<dialog id="modal-info">` sebagai dialog modal tanpa menulis kode JavaScript?
- A. `data-toggle="modal" data-target="#modal-info"`
- B. `command="show-modal" commandfor="modal-info"`
- C. `popovertarget="modal-info" popovertargetaction="modal"`
- D. `href="#modal-info" target="_dialog"`

**Jawaban Benar:** B
**Penjelasan:** Invoker Commands API menggunakan `commandfor="id-elemen"` untuk menunjuk elemen target dan `command="show-modal"` untuk memanggil perilaku pembukaan modal pada `<dialog>`.

## Sumber
- [`<dialog>` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
- [`HTMLDialogElement.returnValue` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/returnValue)
- [Invoker Commands API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API)
- [Interactive elements — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/interactive-elements.html)
