# Elemen Teks Teknis Lanjutan: `<data>`, `<wbr>`, `<bdo>`, dan `<pre>` Aksesibel

- **Tingkat:** Dasar
- **Ringkasan:** Menghubungkan nilai ramah-manusia dan ramah-mesin dengan elemen `<data>`, mengatur titik pemenggalan URL/path panjang dengan `<wbr>`, memaksa arah teks dengan `<bdo>`, serta menyajikan blok kode yang mudah diakses.

## 1. Menyandingkan Nilai Manusia dan Nilai Mesin dengan `<data>`

Pada Pelajaran 03, kita telah mengenal `<time datetime="...">` yang khusus digunakan untuk tanggal dan waktu. Namun bagaimana jika data yang ingin Anda tampilkan bukanlah waktu, melainkan **nomor SKU produk, nilai numerik mentah, atau kode satuan** yang perlu dibaca manusia sebagai teks tetapi perlu dibaca oleh skrip/perayap sebagai nilai standar?

Gunakan elemen **`<data value="...">`**!

```html
<ul>
  <li>
    <data value="SKU-PG-01">Kelas PostgreSQL Produksi</data> —
    Kapasitas peserta: <data value="150">Seratus lima puluh orang</data>
  </li>
  <li>
    <data value="SKU-K8S-02">Kelas Administrasi Kubernetes</data> —
    Kapasitas peserta: <data value="80">Delapan puluh orang</data>
  </li>
</ul>
```

Dengan `<data value="150">`, skrip pengurut tabel atau mesin pengindeks dapat langsung membaca nilai numerik `150` dari atribut `value` tanpa perlu mengurai teks bahasa manusia `"Seratus lima puluh orang"`.

## 2. Mengendalikan Pemenggalan Kata Panjang dan URL dengan `<wbr>` (*Word Break Opportunity*)

Pernahkah Anda menampilkan alamat URL panjang atau jalur direktori sistem berkas seperti `/var/lib/postgresql/17/main/pg_wal/000000010000000000000001` di dalam kolom yang sempit?
- Jika dibiarkan, teks panjang tanpa spasi akan **meluber menembus kotak**!
- Jika dipaksa dengan CSS `word-break: break-all;`, peramban memotong kata secara sembarangan di tengah suku kata (misalnya `postg` di baris atas dan `resql` di baris bawah) sehingga membingungkan pembaca!

Elemen hampa **`<wbr>` (*Word Break Opportunity*)** memungkinkan Anda menentukan **titik potong yang tepat dan logis** (misalnya tepat sebelum tanda garis miring `/` atau titik `.`): jika ruang kolom masih lebar, `<wbr>` tidak menampilkan spasi apa pun; tetapi jika ruang kolom sempit, peramban akan mematahkan baris tepat di titik `<wbr>`!

```html
<p>
  Berkas konfigurasi utama berada di jalur:
  <code>/etc<wbr>/nginx<wbr>/sites-available<wbr>/kodeloka.asadinedu.com.conf</code>
</p>
```

## 3. Membalik Arah Teks Secara Eksplisit dengan `<bdo>` (*Bidirectional Override*)

Berbeda dengan `<bdi>` yang mengisolasi arah baca otomatis, elemen **`<bdo dir="rtl">` (atau `dir="ltr"`)** **memaksa** karakter di dalamnya ditampilkan sesuai arah yang ditentukan dengan mengesampingkan algoritma arah bawaan karakter tersebut:

```html
<!-- Memaksa urutan karakter tampil dari kanan ke kiri (akan tampil sebagai "987654321") -->
<p>Urutan terbalik: <bdo dir="rtl">123456789</bdo></p>
```

## 4. Pola Penyajian Blok `<pre><code>` yang Aksesibel di Situs Dokumentasi

Karena blok `<pre>` mempertahankan baris yang panjang dan sering menggunakan `overflow-x: auto`, pengguna yang hanya memakai papan ketik tidak akan bisa menggulir blok kode tersebut ke kanan kecuali elemen `<pre>` diberi **`tabindex="0"`** dan label yang jelas:

```html
<figure aria-labelledby="caption-kode-nginx">
  <figcaption id="caption-kode-nginx">
    Konfigurasi <code>/etc/nginx/nginx.conf</code> untuk Reverse Proxy
  </figcaption>
  <pre tabindex="0" role="region" aria-labelledby="caption-kode-nginx"><code translate="no">location /api/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
}</code></pre>
</figure>
```

## Latihan Praktik: Dokumentasi Jalur Sistem Berkas dan Spesifikasi Produk

Buatlah berkas `data-dan-wbr.html`:
1. Buat daftar spesifikasi 3 paket server menggunakan `<data value="...">` untuk kapasitas RAM dalam byte dan harga dalam angka bulat.
2. Tampilkan 2 jalur sistem berkas Linux yang panjang menggunakan `<code>` yang disisipi `<wbr>` di setiap batas direktori `/`.
3. Bungkus satu blok kode konfigurasi dengan `<figure>`, `<figcaption>`, dan `<pre tabindex="0">`.

## Kuis Pemahaman

### Soal 1
Apa fungsi dari elemen void `<wbr>` ketika disisipkan di tengah teks URL panjang seperti `https://kodeloka<wbr>.asadinedu<wbr>.com`?
- A. Selalu memaksa teks pindah ke baris baru seperti elemen `<br>`
- B. Memberi tahu peramban titik opsional yang diizinkan untuk mematahkan baris apabila lebar wadah tidak mencukupi, tanpa menambahkan spasi jika baris masih muat
- C. Menambahkan tanda hubung `-` secara permanen di tengah teks
- D. Menyembunyikan bagian akhir URL

**Jawaban Benar:** B
**Penjelasan:** `<wbr>` (*Word Break Opportunity*) adalah petunjuk pemenggalan baris bersyarat: tidak tampak saat ruang mencukupi, dan menjadi titik patah baris yang rapi saat ruang menyempit.

### Soal 2
Kapan Anda harus memilih elemen `<data value="...">` dibandingkan elemen `<time datetime="...">`?
- A. Ketika nilai yang direpresentasikan berupa tanggal lahir atau jam rapat
- B. Ketika Anda ingin mengaitkan teks yang ramah manusia dengan nilai terstruktur yang dapat dibaca mesin yang **bukan** merupakan tanggal atau waktu (seperti kode SKU barang, ID entitas, atau angka metrik)
- C. Ketika Anda ingin menyimpan data di dalam `localStorage`
- D. Ketika membuat daftar pilihan untuk `<input>`

**Jawaban Benar:** B
**Penjelasan:** `<time>` dikhususkan untuk nilai waktu/tanggal ISO 8601, sedangkan `<data>` digunakan untuk segala jenis nilai representasi mesin lainnya (angka, kode produk, bobot).

### Soal 3
Mengapa elemen `<pre>` yang memiliki `overflow-x: auto` disarankan diberi atribut `tabindex="0"`?
- A. Agar kode di dalamnya otomatis dijalankan oleh peramban
- B. Agar pengguna yang bernavigasi menggunakan papan ketik (tanpa tetikus) dapat memfokuskan blok `<pre>` tersebut dengan tombol `Tab` lalu menggulir baris kode yang panjang ke kanan/kiri menggunakan tombol panah
- C. Agar warna latar `<pre>` berubah menjadi hitam
- D. Karena tanpa `tabindex="0"`, tag `<code>` di dalamnya tidak terbaca

**Jawaban Benar:** B
**Penjelasan:** Kontainer yang dapat digulir (*scrollable region*) yang tidak memiliki elemen interaktif di dalamnya perlu diberi `tabindex="0"` agar dapat menerima fokus papan ketik untuk digulir dengan tombol panah.

## Sumber
- [Text-level semantics (<data>, <wbr>, <bdo>) — WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/text-level-semantics.html)
- [HTML elements reference — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
