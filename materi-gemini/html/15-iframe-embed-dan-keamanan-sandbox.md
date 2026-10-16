# Menyematkan Konten Eksternal (`<iframe>`), Atribut `sandbox`, dan Keamanan Bingkai

- **Tingkat:** Menengah
- **Ringkasan:** Menyematkan halaman atau layanan pihak ketiga menggunakan `<iframe>` secara aman dan aksesibel melalui pembatasan hak `sandbox`, `allow`, `referrerpolicy`, `loading="lazy"`, serta mencegah serangan *Clickjacking*.

## Apa yang Terjadi Saat Anda Menyematkan `<iframe>`?

Elemen **`<iframe>` (*Inline Frame*)** memungkinkan Anda menyematkan dokumen HTML lain—seperti pemutar video YouTube, peta interaktif OpenStreetMap, editor kode Go Playground, atau widget pembayaran—di dalam sebuah kotak di halaman Anda.

Namun, setiap `<iframe>` menciptakan **konteks penjelajahan (*browsing context*) bersarang yang lengkap**: ia memiliki objek `window`, pohon DOM, serta mengunduh CSS dan JavaScript miliknya sendiri. Tanpa pembatasan yang tepat, `<iframe>` dari pihak ketiga dapat memperlambat halaman utama Anda atau bahkan melakukan tindakan berbahaya seperti membuka jendela pop-up iklan, mengalihkan halaman utama Anda (*top-level redirect*), atau meminta izin kamera tanpa sepengetahuan Anda.

## 1. Anatomi `<iframe>` yang Aksesibel dan Efisien

```html
<iframe
  title="Video Tutorial Instalasi PostgreSQL di Linux"
  src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
  width="560"
  height="315"
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin"
  allow="fullscreen; picture-in-picture"
  sandbox="allow-scripts allow-same-origin allow-presentation"
></iframe>
```

### Tiga Atribut Dasar yang Wajib Diperhatikan:
1. **`title` (Wajib untuk Aksesibilitas WCAG):** Pengguna pembaca layar perlu mengetahui apa isi dari bingkai `<iframe>` tersebut sebelum memutuskan apakah mereka ingin masuk ke dalamnya atau melewatinya. Tanpa atribut `title="..."` yang deskriptif, pembaca layar hanya membacakan URL mentah yang membingungkan.
2. **`loading="lazy"`:** Karena setiap `<iframe>` memuat halaman web utuh di dalamnya, memasang `loading="lazy"` pada iframe yang berada di bagian bawah artikel menghemat ratusan kilobyte hingga megabyte kuota jaringan dan memori CPU saat halaman pertama kali dibuka!
3. **`width` dan `height` (serta CSS `aspect-ratio`):** Mencegah pergeseran tata letak (*Cumulative Layout Shift / CLS*) saat iframe dimuat.

## 2. Mengurung Hak Akses Iframe dengan Atribut `sandbox`

Atribut **`sandbox`** menerapkan prinsip **Hak Akses Minimal (*Least Privilege*)** pada dokumen di dalam `<iframe>`.

Jika Anda menulis **`sandbox=""`** (dengan nilai kosong tanpa token), peramban akan menerapkan **pembatasan paling ketat**:
- Skrip JavaScript di dalam iframe **dilarang berjalan**.
- Formulir di dalam iframe **dilarang dikirim**.
- Iframe dipaksa memiliki *unique opaque origin* (tidak bisa membaca cookie atau `localStorage` domain aslinya sendiri!).
- Iframe **dilarang membuka tab baru** (`window.open` / `target="_blank"`) dan **dilarang mengubah URL halaman utama** (`window.top.location`).

Anda kemudian dapat membuka izin **hanya yang benar-benar diperlukan** satu per satu menggunakan daftar putih token yang dipisahkan spasi:

| Token `sandbox` | Izin yang Dibuka | Catatan Keamanan |
|---|---|---|
| `allow-scripts` | Mengizinkan eksekusi JavaScript di dalam iframe. | Aman untuk widget interaktif selama tidak digabung sembarangan dengan origin yang sama. |
| `allow-forms` | Mengizinkan pengiriman formulir di dalam iframe. | Diperlukan untuk widget survei atau halaman pembayaran tersemat. |
| `allow-popups` | Mengizinkan pembukaan tab/jendela baru (`target="_blank"`). | Otomatis memaksa tab baru bersifat `noopener` kecuali `allow-popups-to-escape-sandbox` diberikan. |
| `allow-same-origin` | Mengizinkan isi iframe mempertahankan *origin* aslinya (sehingga bisa mengakses cookie/storage milik domain iframe tersebut). | Lihat peringatan kritis di bawah! |
| `allow-top-navigation-by-user-activation` | Mengizinkan iframe mengalihkan halaman utama **hanya jika** pengguna mengeklik langsung di dalam iframe. | Jauh lebih aman daripada `allow-top-navigation` biasa. |

> **🚫 Peringatan Keamanan Kritis: Jangan Pernah Menggabungkan `allow-scripts` DAN `allow-same-origin` untuk Konten dari Origin Anda Sendiri!**
> Jika dokumen di dalam `<iframe src="/pratinjau-user.html">` berasal dari **domain (*origin*) yang sama dengan situs utama Anda**, dan Anda memberikan `sandbox="allow-scripts allow-same-origin"`, maka skrip di dalam iframe tersebut memiliki akses ke `window.parent.document` dan **dapat langsung menghapus atribut `sandbox` dari elemen `<iframe>` miliknya sendiri lalu memuat ulang dirinya tanpa penjara sandbox**!
> Untuk merender pratinjau HTML buatan pengguna, gunakan `sandbox="allow-scripts"` **TANPA** `allow-same-origin` (atau gunakan atribut `srcdoc="..."` dengan `sandbox=""`).

### Merender Cuplikan HTML Secara Terisolasi dengan `srcdoc`
Jika Anda ingin menampilkan pratinjau email HTML atau hasil latihan pengguna tanpa membuat berkas terpisah di server, gunakan atribut **`srcdoc`** yang dipadukan dengan **`sandbox=""`**:

```html
<iframe
  title="Pratinjau Komentar HTML Pengguna"
  sandbox=""
  srcdoc="<p>Halo! Ini adalah teks <strong>tebal</strong>, dan <script>alert('XSS gagal!')</script> otomatis diblokir oleh sandbox kosong.</p>"
  width="600"
  height="120"
></iframe>
```

## 3. Mengendalikan Fitur Perangkat Keras (`allow`) dan Privasi (`referrerpolicy`)

1. **Permissions Policy (`allow="..."`):** Mengontrol apakah iframe diizinkan mengakses fitur perangkat keras sensitif. Secara bawaan, iframe lintas-origin tidak boleh mengakses kamera, mikrofon, atau geolokasi kecuali Anda mengizinkannya secara eksplisit:
   `allow="fullscreen; clipboard-write; encrypted-media"` (dan jangan pernah memberi `camera` atau `microphone` kecuali memang menyematkan aplikasi konferensi video!).
2. **`referrerpolicy="strict-origin-when-cross-origin"` (atau `"no-referrer"`):** Memastikan bahwa saat iframe pihak ketiga dimuat, peramban tidak membocorkan jalur URL lengkap dan parameter query halaman internal Anda (hanya mengirimkan nama domain utama `https://kodeloka.asadinedu.com/` atau tidak sama sekali).

## 4. Melindungi Situs Anda Sendiri agar Tidak Disematkan oleh Penyerang (*Anti-Clickjacking*)

Bagaimana jika penyerang membuat situs palsu lalu menyematkan halaman pengaturan akun situs Anda di dalam `<iframe style="opacity: 0">` transparan tepat di atas tombol *"Klaim Hadiah"* agar korban tidak sengaja mengeklik tombol *"Hapus Akun"* milik situs Anda? Serangan ini disebut **Clickjacking**.

Cara menangkalnya adalah mengirimkan header HTTP **`Content-Security-Policy: frame-ancestors 'none'`** (atau `'self'` jika hanya boleh disematkan oleh situs Anda sendiri) dari server web Anda!

## Latihan Praktik: Menyematkan Playground Kode dan Pratinjau Aman

Buatlah berkas `latihan-iframe.html`:
1. Sematkan satu `<iframe title="...">` eksternal dengan `loading="lazy"`, `referrerpolicy="no-referrer"`, dan `sandbox="allow-scripts"`.
2. Buat satu `<iframe title="Pratinjau Aman">` yang menggunakan `srcdoc` dan `sandbox=""` (kosong) untuk membuktikan bahwa tag `<script>` di dalam `srcdoc` benar-benar ditolak eksekusinya oleh peramban.

## Kuis Pemahaman

### Soal 1
Apa yang terjadi pada sebuah elemen `<iframe src="https://pihak-ketiga.example/widget.html" sandbox="">` ketika atribut `sandbox` ditulis dengan nilai string kosong (`""`)?
- A. Atribut `sandbox` diabaikan karena tidak berisi token apa pun.
- B. Peramban menerapkan **seluruh batasan keamanan secara maksimal**: mematikan eksekusi JavaScript, melarang pengiriman formulir, melarang pembukaan pop-up, dan mengisolasi iframe ke dalam *opaque origin* unik.
- C. Iframe diizinkan menjalankan semua fitur termasuk kamera dan mikrofon.
- D. Iframe otomatis disembunyikan dari layar.

**Jawaban Benar:** B
**Penjelasan:** Atribut `sandbox=""` tanpa token mengaktifkan penguncian penuh (*maximum restrictions*). Setiap token `allow-*` yang ditambahkan ke dalamnya berfungsi sebagai pengecualian (*allowlist*) untuk melonggarkan satu batasan tertentu.

### Soal 2
Mengapa menggabungkan `sandbox="allow-scripts allow-same-origin"` sangat berbahaya apabila halaman yang dimuat di dalam `<iframe>` berasal dari **origin (domain) yang sama** dengan halaman induknya?
- A. Karena halaman induk akan kehilangan koneksi HTTPS.
- B. Karena skrip di dalam iframe yang se-origin dapat mengakses DOM halaman induk melalui `window.parent.document`, menghapus atribut `sandbox` pada elemen `<iframe>` miliknya sendiri, lalu keluar sepenuhnya dari batasan sandbox.
- C. Karena CSS di halaman induk akan terhapus.
- D. Karena `allow-same-origin` memblokir pemuatan gambar.

**Jawaban Benar:** B
**Penjelasan:** Dokumentasi MDN secara tegas memperingatkan bahwa ketika konten iframe memiliki origin yang sama dengan halaman utama, pemberian `allow-scripts` dan `allow-same-origin` secara bersamaan memungkinkan skrip di dalam iframe memanipulasi elemen `<iframe>` di dokumen induk untuk melepaskan dirinya dari sandbox.

### Soal 3
Mengapa setiap elemen `<iframe>` wajib memiliki atribut `title` yang deskriptif?
- A. Agar URL di dalam `src` otomatis terenkripsi.
- B. Agar pengguna teknologi bantu seperti pembaca layar (*screen reader*) dapat mengidentifikasi tujuan atau isi bingkai tersebut tanpa harus masuk dan menelusuri isi dokumen di dalamnya terlebih dahulu.
- C. Karena tanpa atribut `title`, atribut `loading="lazy"` tidak akan bekerja.
- D. Agar bingkai otomatis memiliki garis batas (*border*).

**Jawaban Benar:** B
**Penjelasan:** Tanpa atribut `title` pada `<iframe>`, pengguna pembaca layar yang berpindah antar-bingkai hanya akan mendengar pembacaan nama elemen `"frame"` atau URL teknis yang panjang, sehingga melanggar pedoman aksesibilitas WCAG 2.2 (Kriteria 2.4.1 & 4.1.2).

## Sumber
- [`<iframe>`: The Inline Frame element — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)
- [Content Security Policy (CSP) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
- [Learn Accessibility — web.dev](https://web.dev/learn/accessibility)
