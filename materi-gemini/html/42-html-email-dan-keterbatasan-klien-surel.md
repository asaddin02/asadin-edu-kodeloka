# Prinsip Penulisan HTML untuk Surat Elektronik (HTML Email) dan Kompatibilitas Klien

- **Tingkat:** Menengah
- **Ringkasan:** Memahami perbedaan besar antara mesin perender peramban modern dan klien surat elektronik (Gmail, Outlook, Apple Mail), penggunaan tabel presentasi dengan `role="presentation"`, dan gaya inline.

## Mengapa Kode HTML/CSS Modern Sering Hancur Saat Dikirim Sebagai Surat Elektronik?

Menulis HTML untuk surat elektronik (*HTML Email* seperti kuitansi transaksi, verifikasi akun, atau buletin mingguan) sangat berbeda dengan menulis halaman web biasa. Di halaman web, kita hanya menghadapi tiga mesin peramban modern (Blink, Gecko, dan WebKit) yang terus diperbarui mengikuti standar WHATWG dan W3C.

Sebaliknya, di dunia surat elektronik, pesan Anda dibuka di puluhan klien surel (Gmail Web, aplikasi seluler Gmail/iOS/Android, Apple Mail, Yahoo Mail, hingga berbagai versi Microsoft Outlook) yang **memotong sebagian besar tag HTML dan properti CSS demi keamanan** serta memiliki mesin perender yang tidak seragam (misalnya Outlook desktop klasik untuk Windows merender HTML menggunakan mesin pengolah kata **Microsoft Word**, bukan peramban web!).

## 1. Perbedaan Mesin Perender Web vs Klien Surel dan Penggunaan `<table role="presentation">`

Karena properti tata letak modern seperti CSS Grid, `position`, atau bahkan `margin` dan `max-width` pada `<div>` sering diabaikan atau rusak di sebagian klien surel, tata letak surel HTML masih mengandalkan **tabel bersarang (`<table>`)** dengan lebar maksimum sekitar **`600px`**.

Namun, penggunaan `<table>` untuk tata letak menimbulkan masalah aksesibilitas besar: jika Anda menulis `<table>` biasa, pembaca layar akan mengumumkan *"Tabel dengan 1 kolom dan 4 baris, Baris 1 Kolom 1..."* pada setiap paragraf surel Anda! Solusi wajibnya adalah menambahkan **`role="presentation"`** pada setiap `<table>` yang dipakai untuk tata letak:

| Aspek Penulisan | Halaman Web Modern | Surat Elektronik (HTML Email) |
|---|---|---|
| **Struktur Tata Letak** | Elemen semantik (`<main>`, `<article>`) + CSS Grid / Flexbox. | `<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">`. |
| **Penempatan CSS** | Berkas `.css` eksternal melalui `<link rel="stylesheet">`. | **Gaya `style="..."` sebaris (*inline styles*)** pada setiap elemen, karena banyak klien surel membuang `<link>` eksternal. |
| **JavaScript & Interaktivitas** | Didukung penuh (`<script>`). | **Diblokir 100%** oleh seluruh klien surel demi mencegah serangan XSS/malware. |
| **Gambar & Media** | AVIF, WebP, SVG inline. | Gunakan **PNG atau JPEG** dengan URL absolut `https://...`, dimensi `width`/`height` eksplisit, dan `alt` informatif (SVG sering diblokir di klien surel). |

## 2. Contoh Implementasi Template HTML Email Transaksional yang Aksesibel

Berikut adalah pola penulisan HTML untuk surat elektronik yang menggabungkan tabel presentasi (`role="presentation"`), gaya sebaris (*inline style*), dan tombol ajakan bertindak (*Call to Action*):

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kelas HTML Modern Telah Tersedia</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f1f5f9;">
    <!-- Tabel tata letak: role="presentation" agar pembaca layar tidak mengumumkannya sebagai tabel data -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9;">
      <tr>
        <td align="center" style="padding: 24px 12px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: #ffffff;">
            <tr>
              <td style="padding: 24px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 24px; color: #0f172a;">
                <h1 style="margin: 0 0 12px 0; font-size: 24px; line-height: 32px;">Kelas HTML Modern sudah tersedia</h1>
                <p style="margin: 0 0 16px 0;">Halo! Kelas HTML terbaru di Kodeloka kini dapat diakses gratis.</p>
                <a href="https://kodeloka.asadinedu.com/html/" style="display: inline-block; padding: 12px 20px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px;">Mulai Belajar</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

> **Catatan:** Atribut presentasi seperti `width`, `cellpadding`, `cellspacing`, `border`, dan `align` pada `<table>`/`<td>` sudah usang (*obsolete*) menurut spesifikasi HTML dan tidak boleh dipakai pada halaman web biasa (lihat pelajaran 43). Atribut itu dipertahankan di sini hanya karena sebagian klien surel, terutama Outlook desktop, masih mengandalkannya.

## 3. Aturan Penting Gambar, Tombol, dan Versi `text/plain` pada Surel

1. **Jangan pernah mengirim surel yang seluruh isinya hanya berupa satu gambar poster besar:** Banyak klien surel memblokir pemuatan gambar eksternal secara bawaan sampai pengguna menekan *"Tampilkan gambar"*, dan filter spam sering menandai surel berisi gambar tunggal tanpa teks sebagai spam.
2. **Gunakan `padding` pada `<td>`, bukan `margin` pada `<p>` untuk jarak vertikal kritis:** Sebagian klien surel mengabaikan `margin` luar, tetapi selalu menghormati `padding` pada sel tabel `<td>`.
3. **Selalu sertakan bagian `text/plain` pendamping (*multipart/alternative*):** Saat mengirim surel dari backend (lihat kelas PHP pelajaran 36), selalu kirimkan versi teks biasa bersamaan dengan versi `text/html` bagi pengguna jam tangan pintar, pembaca layar berbasis teks, atau klien surel dengan keamanan ketat.

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Lupa menambahkan `role="presentation"` pada setiap `<table>` tata letak:** Jika Anda menggunakan 3 tabel bersarang untuk mengatur posisi surel tanpa `role="presentation"`, pengguna pembaca layar akan terjebak mendengarkan pengumuman baris dan kolom tabel yang membingungkan.
2. **Mengandalkan `<link rel="stylesheet">` atau variabel CSS `var(--warna)` di surel:** Sebagian besar klien webmail membersihkan tag `<link>` eksternal dan banyak klien belum mendukung *Custom Properties* secara konsisten. Tulis nilai warna heksadesimal lengkap (`#2563eb`) dan aturan fon secara *inline* pada atribut `style`.
3. **Menggunakan tautan relatif `href="/verifikasi"` di dalam surel:** Karena surel dibuka di dalam aplikasi klien surel (bukan di domain situs Anda), setiap tautan `<a href>` dan gambar `<img src>` di dalam surel **wajib menggunakan URL absolut lengkap** (`https://kodeloka.asadinedu.com/...`).

## Latihan Praktik

Buatlah berkas `42-html-email-dan-keterbatasan-klien-surel.html` untuk surel kuitansi pendaftaran kelas:
1. Buat struktur tabel luar 100% dan tabel kontainer dalam selebar `600` piksel yang keduanya memiliki atribut `role="presentation"`.
2. Di dalam konten surel, tetap gunakan tabel data **tanpa** `role="presentation"` (lengkap dengan `<th scope="col">`) khusus untuk bagian rincian item tagihan (karena bagian itu memang benar-benar data tabular!).
3. Tambahkan tombol tautan `<a href="https://...">` dengan gaya *inline* yang memiliki kontras tinggi, lalu periksa di panel **Accessibility Tree** DevTools bahwa tabel tata letak luar diabaikan sebagai tabel sementara tabel rincian tagihan tetap dikenali sebagai `table`.

## Kuis Pemahaman

### Soal 1
Mengapa setiap elemen `<table>` yang digunakan semata-mata untuk mengatur tata letak surat elektronik (HTML Email) **wajib** diberi atribut `role="presentation"`?
- A. Agar tabel tersebut otomatis berubah menjadi elemen `<canvas>` di Gmail
- B. Agar pembaca layar menghapus semantik tabel (`table`, `row`, `cell`) dari pohon aksesibilitas sehingga tidak mengumumkan nomor baris dan kolom yang membingungkan saat membacakan isi surel
- C. Untuk memperkecil ukuran byte surel hingga separuhnya
- D. Agar Outlook mengizinkan eksekusi kode JavaScript di dalam tabel

**Jawaban Benar:** B
**Penjelasan:** `role="presentation"` (atau `role="none"`) menghapus peran semantik tabel dari elemen `<table>`, `<tr>`, dan `<td>` miliknya di Accessibility Tree sehingga pembaca layar langsung membacakan teks di dalamnya secara mengalir.

### Soal 2
Mengapa aturan CSS pada HTML Email harus ditulis secara sebaris (*inline*) menggunakan atribut `style="..."` pada elemen-elemennya, alih-alih dimuat melalui `<link rel="stylesheet" href="...">`?
- A. Karena protokol SMTP melarang karakter `<link>`
- B. Karena sebagian besar klien surat elektronik membuang tag `<link rel="stylesheet">` eksternal dan menyaring selektor `<style>` tertentu demi alasan keamanan dan isolasi tampilan
- C. Karena atribut `style="..."` membuat surel terenkripsi secara otomatis
- D. Karena HTML5 telah menghapus elemen `<link>`

**Jawaban Benar:** B
**Penjelasan:** Klien webmail (seperti Gmail atau Yahoo Mail) merender isi surel di dalam halaman aplikasi mereka sendiri sehingga mereka memotong stylesheet eksternal dan membatasi selektor CSS agar tidak merusak antarmuka webmail mereka.

### Soal 3
Apa yang harus selalu digunakan pada nilai atribut `href` di `<a>` dan `src` di `<img>` di dalam dokumen HTML Email?
- A. Jalur relatif seperti `href="/masuk"` dan `src="../logo.png"`
- B. URL absolut lengkap dengan skema `https://` dan nama domain (misalnya `https://kodeloka.asadinedu.com/masuk`) serta gambar raster (PNG/JPEG) dengan atribut `alt`, `width`, dan `height`
- C. Skema `javascript:bukaHalaman()`
- D. Berkas `.svg` eksternal tanpa atribut `alt`

**Jawaban Benar:** B
**Penjelasan:** Surel dibuka di lingkungan klien surel pengguna (di luar domain situs web Anda), sehingga jalur relatif tidak memiliki domain dasar yang benar dan wajib ditulis sebagai URL absolut `https://...`.

## Sumber
- [`presentation` role — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/presentation_role)
- [Tabular data — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/tables.html)
- [`<table>` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table)
