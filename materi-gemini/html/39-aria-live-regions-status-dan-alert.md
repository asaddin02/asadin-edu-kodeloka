# Pengumuman Dinamis bagi Pembaca Layar: `aria-live`, `<output>`, `role="status"`, dan `role="alert"`

- **Tingkat:** Lanjut
- **Ringkasan:** Memastikan perubahan konten dinamis (seperti hasil pencarian langsung, penghitung waktu, dan pesan galat formulir) terdengar jelas oleh pengguna pembaca layar melalui penggunaan *ARIA Live Regions* yang tepat.

## Mengapa Perubahan DOM via JavaScript Sering Tidak Terdengar oleh Pembaca Layar?

Pengguna pembaca layar (*screen reader* seperti NVDA, JAWS, VoiceOver, dan TalkBack) menelusuri halaman melalui satu titik kursor fokus pada satu waktu. Apabila pengguna sedang mengetik di dalam `<input type="search">`, lalu JavaScript memperbarui teks `"3 hasil ditemukan"` pada sebuah `<p>` di bawahnya **tanpa memindahkan fokus**, pembaca layar tidak akan memberi tahu pengguna bahwa teks di bawahnya telah berubah!

Untuk mengumumkan perubahan konten dinamis tanpa perlu merampas fokus papan ketik pengguna, WAI-ARIA menyediakan mekanisme **ARIA Live Regions** melalui atribut `aria-live`, elemen semantik `<output>`, serta peran `role="status"` dan `role="alert"`.

## 1. Memilih Tingkat Kesopanan Pengumuman: `polite` vs `assertive`

Tidak semua perubahan layar memiliki tingkat kedaruratan yang sama. Menginterupsi kalimat pembaca layar setiap detik akan sangat mengganggu pengguna tunanetra. Oleh sebab itu, pilihlah peran atau atribut *live region* sesuai urgensinya:

| Atribut / Peran / Elemen | Tingkat `aria-live` Bawaan | Perilaku Pembaca Layar | Kasus Penggunaan yang Tepat |
|---|---|---|---|
| `role="status"` atau `<output>` | `aria-live="polite"` dan `aria-atomic="true"` | **Menunggu dengan sopan** sampai pembaca layar selesai membacakan kalimat saat ini sebelum mengumumkan teks baru. | Jumlah hasil pencarian, notifikasi *"Perubahan disimpan"*, jumlah item di keranjang belanja, atau hasil kalkulator. |
| `role="alert"` | `aria-live="assertive"` dan `aria-atomic="true"` | **Langsung memotong** ucapan pembaca layar saat itu juga untuk mengumumkan pesan darurat. | Pesan kesalahan validasi formulir yang gagal dikirim, peringatan sesi akan berakhir, atau terputusnya koneksi jaringan. |
| `aria-live="off"` (Bawaan seluruh elemen biasa) | Tidak aktif | Perubahan teks di dalamnya tidak diumumkan kecuali pengguna memindahkan kursor ke elemen tersebut. | Konten statis atau penghitung waktu yang berubah setiap milidetik. |

## 2. Aturan Emas Live Region: Wadah Harus Sudah Ada di DOM Sejak Awal

Kesalahan paling sering saat menggunakan `aria-live`, `role="status"`, atau `role="alert"` adalah baru membuat elemen `<div role="status">Berhasil!</div>` lewat JavaScript pada saat pesan muncul. Banyak kombinasi peramban dan pembaca layar **hanya memantau perubahan teks di dalam wadah *live region* yang sudah terdaftar di DOM sebelumnya**!

Pola yang paling andal lintas pembaca layar adalah:
1. Sediakan wadah `<p id="status-hasil" role="status"></p>` dan `<p id="galat-pencarian" role="alert"></p>` dalam keadaan **kosong** di HTML sejak halaman pertama kali dimuat.
2. Saat peristiwa terjadi, ubah isi teksnya menggunakan `element.textContent = "..."`:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Region: Status dan Alert — Kodeloka</title>
  </head>
  <body>
    <main>
      <h1>Pencarian Materi</h1>

      <label for="kata-kunci">Kata kunci</label>
      <input type="search" id="kata-kunci" autocomplete="off">

      <!-- Wadah live region harus sudah ada di DOM sebelum isinya berubah -->
      <p id="status-hasil" role="status"></p>
      <p id="galat-pencarian" role="alert"></p>
    </main>

    <script>
      const input = document.getElementById("kata-kunci");
      const status = document.getElementById("status-hasil");
      const galat = document.getElementById("galat-pencarian");

      input.addEventListener("input", () => {
        galat.textContent = "";
        if (input.value.length === 1) {
          // role="alert" bersifat assertive: gunakan hanya untuk galat penting
          galat.textContent = "Masukkan minimal 2 karakter.";
          status.textContent = "";
        } else {
          // role="status" bersifat polite: diumumkan setelah pembacaan saat ini selesai
          status.textContent = input.value ? "3 hasil ditemukan." : "";
        }
      });
    </script>
  </body>
</html>
```

## 3. Mengendalikan Pembacaan Utuh dengan `aria-atomic`, `aria-busy`, dan *Debounce*

Ketika Anda menggunakan `aria-live="polite"` secara manual pada sebuah `<div>` yang berisi beberapa `<span>` (misalnya `<span>Total Tagihan:</span> <span id="nominal">Rp 150.000</span>`), secara bawaan (`aria-atomic="false"`) pembaca layar hanya membacakan bagian yang berubah saja (`"Rp 150.000"`), sehingga pengguna kehilangan konteks `"Total Tagihan:"`.

Dengan menambahkan **`aria-atomic="true"`** (yang sudah aktif secara bawaan pada `<output>`, `role="status"`, dan `role="alert"`), pembaca layar akan membacakan **seluruh isi wadah dari awal hingga akhir** setiap kali ada bagian di dalamnya yang berubah:

```html
<!-- Elemen <output> secara bawaan memiliki role="status" (aria-live="polite" + aria-atomic="true") -->
<form id="form-diskon" oninput="hasilAkhir.value = 'Rp ' + (Number(harga.value) * 0.9).toLocaleString('id-ID')">
  <label for="harga">Harga Awal (Rp)</label>
  <input type="number" id="harga" name="harga" value="100000" step="10000">

  <p> Harga Setelah Diskon 10%:
    <output id="hasilAkhir" name="hasilAkhir" for="harga">Rp 90.000</output>
  </p>
</form>
```

> **💡 Tips Penting (Gunakan *Debounce* pada Pencarian Langsung):** Jika Anda memperbarui teks `role="status"` pada setiap ketikan huruf di kotak pencarian, tunda pembaruan teks selama **300–500 milidetik** menggunakan teknik *debounce* agar pembaca layar hanya mengumumkan hasil akhir setelah pengguna selesai mengetik kata kuncinya.

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan `role="alert"` atau `aria-live="assertive"` untuk semua pemberitahuan biasa:** Karena `assertive` langsung memotong pembacaan layar, memakainya untuk pesan biasa seperti *"Disimpan sebagai draf"* akan merusak konsentrasi pengguna pembaca layar. Gunakan `role="status"` untuk hampir semua pembaruan informasi, dan cadangkan `role="alert"` hanya untuk kesalahan atau peringatan mendesak.
2. **Menyembunyikan wadah *live region* dengan `display: none` atau `hidden` lalu langsung mengisinya di frame yang sama:** Jika wadah baru diubah dari `hidden = true` menjadi `hidden = false` bersamaan dengan pengisian `textContent`, sebagian pembaca layar melewatkan pengumuman tersebut. Biarkan wadah *live region* tetap aktif di DOM dalam keadaan kosong (`""`).
3. **Memasang `aria-live` pada elemen pembungkus besar seperti `<main>` atau `<body>`:** Setiap perubahan kecil di dalam halaman akan memicu pengumuman berulang yang melumpuhkan pembaca layar.

## Latihan Praktik

Buatlah berkas `39-aria-live-regions-status-dan-alert.html` untuk fitur penyaringan modul kursus:
1. Buat `<input type="search" id="cari-modul">` beserta daftar `<ul>` berisi 5 judul modul HTML.
2. Sediakan wadah `<p id="info-filter" role="status"></p>` dan `<p id="peringatan-filter" role="alert"></p>` yang sudah ada di DOM sejak awal.
3. Gunakan fungsi *debounce* 300 ms pada event `input`: jika kata kunci ditemukan, perbarui `#info-filter` dengan jumlah modul yang cocok; jika 0 modul cocok, tampilkan pesan di `#peringatan-filter`.

## Kuis Pemahaman

### Soal 1
Manakah perbedaan perilaku yang tepat antara `role="status"` dan `role="alert"` ketika teks di dalamnya diperbarui melalui JavaScript?
- A. `role="status"` memiliki sifat `aria-live="polite"` yang menunggu pembaca layar menyelesaikan kalimat saat ini sebelum mengumumkan pembaruan, sedangkan `role="alert"` bersifat `aria-live="assertive"` yang langsung menginterupsi pembaca layar untuk pesan darurat/galat
- B. `role="status"` membuka kotak dialog pop-up `window.alert()`, sedangkan `role="alert"` menulis pesan ke konsol
- C. `role="alert"` hanya bekerja di peramban seluler, sedangkan `role="status"` hanya di desktop
- D. `role="status"` otomatis memindahkan fokus papan ketik ke elemen tersebut, sedangkan `role="alert"` tidak

**Jawaban Benar:** A
**Penjelasan:** `role="status"` memiliki nilai implisit `aria-live="polite"` (sopan, tidak memotong pembicaraan), sedangkan `role="alert"` memiliki nilai implisit `aria-live="assertive"` (mendesak, segera memotong pembicaraan saat itu juga).

### Soal 2
Mengapa wadah elemen *live region* (seperti `<p id="status" role="status"></p>`) sangat disarankan sudah berada di dalam pohon DOM dalam keadaan kosong sebelum teks pengumuman dimasukkan ke dalamnya?
- A. Agar ukuran berkas HTML menjadi genap
- B. Karena pembaca layar mendaftarkan dan memantau wadah *live region* yang sudah ada di DOM; jika elemen *live region* dan teksnya baru disuntikkan bersamaan, banyak pembaca layar tidak mendeteksinya sebagai perubahan isi
- C. Karena peramban menolak atribut `role="status"` yang dibuat dengan `document.createElement`
- D. Agar CSS Grid dapat menghitung jumlah kolom secara otomatis

**Jawaban Benar:** B
**Penjelasan:** Pembaca layar melacak *mutation* (perubahan teks) di dalam node *live region* yang sudah terdaftar. Mengubah `textContent` pada wadah *live region* yang sudah ada di DOM jauh lebih andal diumumkan lintas pembaca layar.

### Soal 3
Elemen HTML5 semantik manakah yang secara bawaan sudah memiliki peran implisit `role="status"` (`aria-live="polite"` dan `aria-atomic="true"`) untuk menampilkan hasil perhitungan atau aksi formulir?
- A. `<samp>`
- B. `<var>`
- C. `<output>`
- D. `<datalist>`

**Jawaban Benar:** C
**Penjelasan:** Elemen `<output>` dipetakan ke `role="status"` dalam spesifikasi HTML-AAM, sehingga perubahan nilai di dalamnya otomatis diumumkan secara sopan (*polite*) oleh pembaca layar.

## Sumber
- [ARIA live regions — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions)
- [ARIA: status role — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/status_role)
- [ARIA: alert role — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role)
- [Accessible Rich Internet Applications (WAI-ARIA) 1.2 — W3C](https://www.w3.org/TR/wai-aria-1.2/)
