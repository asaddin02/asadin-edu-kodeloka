# Mendalami WAI-ARIA: Peran (*Roles*), Status (*States*), dan Properti (*Properties*)

- **Tingkat:** Lanjut
- **Ringkasan:** Memahami kapan dan bagaimana menggunakan atribut ARIA secara akurat: perbedaan `aria-label` vs `aria-labelledby`, `aria-describedby` vs `aria-errormessage`, `aria-expanded`, `aria-controls`, dan `aria-current`.

## Mengapa Aturan Pertama WAI-ARIA Adalah "Jangan Gunakan ARIA Jika Ada Elemen HTML Asli"?

Spesifikasi [WAI-ARIA (*Accessible Rich Internet Applications*) 1.2](https://www.w3.org/TR/wai-aria-1.2/) menyediakan atribut untuk melengkapi informasi semantik di dalam **Accessibility Tree** peramban bagi pembaca layar. Namun, atribut ARIA **hanya mengubah apa yang diumumkan pembaca layar**; ARIA **tidak pernah menambahkan perilaku papan ketik atau fokus secara otomatis**. Sebagai contoh, menulis `<div role="button">` tidak membuat `<div>` tersebut dapat difokuskan dengan `Tab` atau ditekan dengan tombol `Space`/`Enter` seperti `<button>` asli!

Itulah sebabnya [W3C ARIA in HTML](https://www.w3.org/TR/html-aria/) menetapkan **Lima Aturan Penggunaan ARIA**:
1. **Aturan 1:** Jika Anda dapat menggunakan elemen atau atribut HTML asli yang sudah memiliki semantik dan perilaku yang Anda butuhkan (seperti `<button>`, `<label>`, `<dialog>`, `<details>`, `<nav>`), **gunakan elemen HTML asli tersebut**, bukan ARIA.
2. **Aturan 2:** Jangan mengubah semantik elemen HTML asli kecuali benar-benar terpaksa (jangan tulis `<h2 role="button">`).
3. **Aturan 3:** Semua kontrol ARIA yang interaktif wajib dapat dioperasikan dengan papan ketik.
4. **Aturan 4:** Jangan gunakan `role="presentation"` atau `aria-hidden="true"` pada elemen yang dapat menerima fokus (`focusable`).
5. **Aturan 5:** Semua elemen interaktif wajib memiliki **nama aksesibel (*accessible name*)**.

## 1. Penamaan dan Deskripsi Aksesibel: `aria-labelledby`, `aria-label`, `aria-describedby`, dan `aria-errormessage`

Ketika sebuah elemen membutuhkan nama atau penjelasan tambahan di pohon aksesibilitas, pilihlah atribut yang tepat berdasarkan urutan prioritas berikut:

| Atribut ARIA | Cara Kerja | Kapan Harus Dipilih? |
|---|---|---|
| `aria-labelledby="id1 id2"` | Mengambil teks dari satu atau beberapa elemen lain yang sudah tampil di layar sebagai **nama aksesibel** (menimpa teks internal elemen). | **Pilihan utama** bila label visual sudah ada di halaman (misalnya mengaitkan `<section>` atau `<dialog>` ke `<h2>` judulnya). |
| `aria-label="Teks nama"` | Memberikan string nama aksesibel secara langsung (menimpa teks di dalam elemen). | Hanya jika **tidak ada teks yang terlihat di layar**, seperti tombol yang hanya berisi ikon `<svg>` (`aria-label="Tutup jendela"`). |
| `aria-describedby="id-petunjuk"` | Menambahkan **deskripsi penjelas** yang dibacakan pembaca layar sesaat *setelah* nama dan peran elemen. | Untuk petunjuk format input (misalnya *"Minimal 12 karakter"* di bawah kolom kata sandi). |
| `aria-errormessage="id-galat"` | Menunjuk elemen yang memuat pesan kesalahan validasi (digunakan bersama **`aria-invalid="true"`**). | Ketika nilai input tidak valid dan pesan galat spesifik sedang ditampilkan. |

## 2. Mengelola Status Komponen Interaktif (`aria-expanded`, `aria-controls`, dan `aria-current`)

Pada komponen kustom yang dikendalikan JavaScript (seperti tombol pembuka panel menu, akordeon kustom, atau navigasi halaman), Anda wajib menyinkronkan atribut status ARIA setiap kali tampilan berubah:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ARIA: Status dan Properti — Kodeloka</title>
  </head>
  <body>
    <main>
      <h1>ARIA: Status dan Properti</h1>

      <!-- Tombol pembuka panel: aria-expanded menyatakan status, aria-controls menunjuk panel -->
      <button type="button" id="tombol-faq" aria-expanded="false" aria-controls="panel-faq">
        Tampilkan FAQ
      </button>

      <!-- aria-labelledby mengambil nama dari teks tombol yang sudah tampil -->
      <div id="panel-faq" role="region" aria-labelledby="tombol-faq" hidden>
        <p>Ya, semua kelas di Kodeloka gratis.</p>
      </div>
    </main>

    <script>
      const tombol = document.getElementById("tombol-faq");
      const panel = document.getElementById("panel-faq");

      tombol.addEventListener("click", () => {
        const terbuka = tombol.getAttribute("aria-expanded") === "true";
        tombol.setAttribute("aria-expanded", String(!terbuka));
        panel.hidden = terbuka;
      });
    </script>
  </body>
</html>
```

Selain itu, untuk formulir yang mengalami kesalahan validasi, padukan `aria-invalid="true"` dengan `aria-describedby` atau `aria-errormessage`:

```html
<div class="kelompok-input">
  <label for="kode-akses">Kode Akses Server</label>
  <input
    type="text"
    id="kode-akses"
    name="kode_akses"
    aria-describedby="petunjuk-kode"
    aria-invalid="true"
    aria-errormessage="galat-kode"
  >
  <p id="petunjuk-kode">Masukkan 8 karakter alfanumerik huruf besar.</p>
  <p id="galat-kode" role="alert">Kode akses harus tepat 8 karakter.</p>
</div>
```

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Memasang `aria-hidden="true"` pada elemen yang masih bisa difokuskan dengan tombol `Tab`:** Menulis `<button aria-hidden="true">Simpan</button>` melanggar Aturan ke-4 ARIA: pengguna papan ketik yang memakai pembaca layar akan berpindah ke tombol tersebut saat menekan `Tab`, tetapi pembaca layar membisu karena elemennya disembunyikan dari pohon aksesibilitas!
2. **Menimpa teks tombol yang penting dengan `aria-label` yang berbeda:** Jika tombol bertuliskan `"Beli Kelas Pro — Rp 150.000"` tetapi Anda memberinya `aria-label="Tombol beli"`, maka informasi harga `"Rp 150.000"` hilang sama sekali bagi pengguna pembaca layar dan melanggar kriteria **WCAG 2.5.3 (Label in Name)** bagi pengguna perintah suara.
3. **Menaruh `aria-expanded` pada panel yang dibuka, bukan pada tombol pemicunya:** Atribut `aria-expanded="true|false"` wajib diletakkan pada **tombol pengendalinya** (`<button>`), bukan pada `<div>` panel yang disembunyikan dengan `hidden`.

## Latihan Praktik

Buatlah berkas `38-wai-aria-roles-states-dan-properties.html` untuk komponen bilah samping pengumuman dan formulir:
1. Buat sebuah tombol hanya-ikon `<button type="button" aria-label="Buka Pengaturan Notifikasi" aria-expanded="false" aria-controls="panel-notif">` yang di dalamnya memuat `<svg aria-hidden="true">`.
2. Buat `<section id="panel-notif" aria-labelledby="judul-notif" hidden>` dan tulis skrip untuk mengubah `aria-expanded` antara `"false"` dan `"true"` saat tombol diklik.
3. Buat satu kolom `<input>` yang dikaitkan ke teks petunjuk dengan `aria-describedby`, lalu periksa hasil *Computed Properties* (`Name`, `Description`, `Expanded`) di panel **Accessibility** DevTools.

## Kuis Pemahaman

### Soal 1
Apa perbedaan utama antara `aria-labelledby` dan `aria-describedby` dalam perhitungan pohon aksesibilitas peramban?
- A. `aria-labelledby` hanya berlaku untuk gambar, sedangkan `aria-describedby` hanya untuk tabel
- B. `aria-labelledby` menetapkan **nama aksesibel utama** elemen dengan merujuk `id` elemen teks yang terlihat di halaman, sedangkan `aria-describedby` memberikan **keterangan tambahan** yang dibacakan setelah nama dan peran elemen
- C. `aria-describedby` menghapus nama elemen, sedangkan `aria-labelledby` menyembunyikan elemen dari layar
- D. Keduanya menghasilkan properti yang sama persis di Accessibility Tree

**Jawaban Benar:** B
**Penjelasan:** Dalam spesifikasi Accessible Name and Description Computation, `aria-labelledby` memiliki prioritas tertinggi untuk menentukan *Accessible Name*, sementara `aria-describedby` mengisi *Accessible Description* sebagai informasi pelengkap.

### Soal 2
Pada pola tombol pembuka panel (seperti menu dropdown atau FAQ kustom), di elemen manakah atribut `aria-expanded="false"` seharusnya diletakkan?
- A. Pada elemen `<div>` panel yang sedang disembunyikan dengan atribut `hidden`
- B. Pada elemen `<button>` interaktif yang memicu pembukaan dan penutupan panel tersebut
- C. Pada elemen `<body>` dokumen
- D. Pada elemen `<head>`

**Jawaban Benar:** B
**Penjelasan:** Pengguna pembaca layar berinteraksi dengan tombol pemicu (`<button>`). Menempatkan `aria-expanded` pada tombol tersebut memberi tahu pengguna apakah panel yang dikendalikannya saat ini sedang terlipat (`"false"`) atau terbentang (`"true"`).

### Soal 3
Mengapa penulisan `<button aria-hidden="true">Kirim</button>` dilarang keras dalam aturan keempat spesifikasi WAI-ARIA?
- A. Karena atribut `aria-hidden` otomatis mengubah warna tombol menjadi transparan
- B. Karena tombol tersebut tetap dapat menerima fokus saat pengguna menekan tombol `Tab`, tetapi pembaca layar tidak akan mengumumkan apa pun sehingga pengguna tunanetra terjebak pada kontrol "hantu" yang bisu
- C. Karena `aria-hidden` hanya boleh bernilai `"yes"` atau `"no"`
- D. Karena `<button>` tidak boleh berada di dalam `<main>`

**Jawaban Benar:** B
**Penjelasan:** `aria-hidden="true"` menghapus elemen dari Accessibility Tree tetapi tidak menghapusnya dari urutan fokus papan ketik. Elemen yang dapat menerima fokus tidak boleh diberi `aria-hidden="true"` kecuali sekaligus dinonaktifkan (`disabled` atau `inert`).

## Sumber
- [ARIA — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [Accessible Rich Internet Applications (WAI-ARIA) 1.2 — W3C](https://www.w3.org/TR/wai-aria-1.2/)
- [ARIA in HTML — W3C](https://www.w3.org/TR/html-aria/)
- [ARIA Authoring Practices Guide — W3C WAI](https://www.w3.org/WAI/ARIA/apg/)
