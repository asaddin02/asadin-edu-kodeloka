# Tabel Data yang Terstruktur dan Aksesibel

- **Tingkat:** Dasar
- **Ringkasan:** Menyajikan data tabular secara akurat menggunakan `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tfoot>`, serta mengaitkan sel kepala (`<th>`) dengan data (`<td>`) menggunakan atribut `scope` demi aksesibilitas pembaca layar.

## Aturan Emas Tabel HTML: Hanya untuk Data Tabular!

Pada akhir 1990-an sebelum CSS mendukung Flexbox dan Grid, pengembang web menyalahgunakan elemen `<table>` untuk membagi kolom halaman web (header di baris atas, sidebar di kolom kiri, konten di kolom kanan). Praktik tersebut kini **dilarang keras** karena:
1. Merusak urutan baca dan membingungkan pembaca layar yang akan mengumumkan *"Tabel dengan 4 baris dan 3 kolom"* padahal isinya adalah tata letak halaman.
2. Sangat kaku dan sulit dibuat responsif di layar ponsel.
3. Memperberat perhitungan *layout/reflow* di peramban.

Gunakan `<table>` **hanya ketika Anda menyajikan data yang secara alami berbentuk baris dan kolom**—seperti perbandingan spesifikasi server, laporan keuangan, jadwal rilis versi perangkat lunak, atau daftar harga paket. Untuk tata letak halaman, gunakan **CSS Grid** atau **Flexbox**.

## 1. Anatomi Tabel yang Lengkap dan Semantik

Tabel yang baik tidak hanya terdiri dari `<tr>` (*table row*) dan `<td>` (*table data*), melainkan dibagi ke dalam bagian-bagian semantik yang jelas:

```html
<table>
  <caption>
    Perbandingan Dukungan Cabang Versi PHP (Status Oktober 2026)
  </caption>
  <thead>
    <tr>
      <th scope="col">Cabang Versi</th>
      <th scope="col">Rilis Awal</th>
      <th scope="col">Akhir Dukungan Aktif</th>
      <th scope="col">Akhir Dukungan Keamanan</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">PHP 8.2</th>
      <td>8 Desember 2022</td>
      <td>31 Desember 2024</td>
      <td>31 Desember 2026</td>
    </tr>
    <tr>
      <th scope="row">PHP 8.3</th>
      <td>23 November 2023</td>
      <td>31 Desember 2025</td>
      <td>31 Desember 2027</td>
    </tr>
    <tr>
      <th scope="row">PHP 8.4</th>
      <td>21 November 2024</td>
      <td>31 Desember 2026</td>
      <td>31 Desember 2028</td>
    </tr>
    <tr>
      <th scope="row">PHP 8.5</th>
      <td>20 November 2025</td>
      <td>31 Desember 2027</td>
      <td>31 Desember 2029</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row" colspan="3">Masa dukungan total per cabang rilis</th>
      <td>4 Tahun (2 Aktif + 2 Keamanan)</td>
    </tr>
  </tfoot>
</table>
```

### Mengapa `<th scope="col">` dan `<th scope="row">` Sangat Krusial?
Pengguna yang melihat layar dapat melirik ke atas dan ke kiri untuk memahami bahwa tanggal `"31 Desember 2028"` adalah **"Akhir Dukungan Keamanan"** milik **"PHP 8.4"**.

Namun, pengguna tunanetra yang menavigasi tabel menggunakan pembaca layar berpindah dari satu sel ke sel lain. Ketika Anda memasang:
- `<th scope="col">` pada judul kolom di `<thead>`, dan
- `<th scope="row">` pada sel pengenal baris pertama di setiap `<tr>` dalam `<tbody>`,

maka saat pengguna berpindah ke sel `"31 Desember 2028"`, pembaca layar akan membacakan konteks lengkapnya: *"Akhir Dukungan Keamanan, PHP 8.4: 31 Desember 2028"*. Tanpa atribut `scope` dan elemen `<th>`, pengguna hanya mendengar deretan tanggal tanpa tahu milik baris atau kolom mana tanggal tersebut!

### Peran `<caption>`
Elemen `<caption>` harus diletakkan sebagai **anak pertama tepat di bawah tag pembuka `<table>`**. Ia berfungsi sebagai judul resmi tabel yang langsung dibacakan ketika pengguna melompat ke tabel tersebut.

## 2. Menggabungkan Sel dengan `colspan` dan `rowspan`

Terkadang sebuah sel kepala atau ringkasan perlu merentang melintasi beberapa kolom (`colspan`) atau beberapa baris (`rowspan`):

```html
<table>
  <caption>Penggunaan Sumber Daya Klaster Produksi per Kuartal</caption>
  <thead>
    <tr>
      <th scope="col" rowspan="2">Layanan</th>
      <th scope="colgroup" colspan="2">Beban CPU (%)</th>
      <th scope="colgroup" colspan="2">Memori RAM (GB)</th>
    </tr>
    <tr>
      <th scope="col">Rata-rata</th>
      <th scope="col">Puncak (P99)</th>
      <th scope="col">Rata-rata</th>
      <th scope="col">Puncak (P99)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">API Gateway (Kong)</th>
      <td>32%</td>
      <td>68%</td>
      <td>1,4 GB</td>
      <td>2,8 GB</td>
    </tr>
    <tr>
      <th scope="row">Worker Pembayaran</th>
      <td>45%</td>
      <td>89%</td>
      <td>3,2 GB</td>
      <td>6,0 GB</td>
    </tr>
  </tbody>
</table>
```

> **💡 Tips Praktis: Hitung Jumlah Kolom di Setiap Baris!**
> Pada contoh di atas, baris pertama `<thead>` memiliki: 1 kolom (`Layanan`) + 2 kolom (`Beban CPU`) + 2 kolom (`Memori RAM`) = **5 kolom**.
> Baris kedua `<thead>` tidak menulis ulang kolom pertama karena kolom pertama sudah direntangkan ke bawah oleh `rowspan="2"`, sehingga baris kedua cukup menulis **4 sel `<th>`** sisanya (`1 + 4 = 5 kolom`). Jika jumlah kolom tidak konsisten, tabel akan tampak miring atau memiliki sel kosong di ujung kanan.

## 3. Membuat Tabel Lebar Tetap Nyaman di Layar Ponsel

Tabel dengan banyak kolom sering meluber (*overflow*) melebihi lebar layar ponsel dan merusak tata letak seluruh halaman. Pola paling bersih dan aksesibel untuk mengatasinya adalah membungkus `<table>` di dalam kontainer yang dapat digeser secara horizontal (`overflow-x: auto`) dan dapat difokuskan dengan papan ketik (`tabindex="0"`):

```html
<div class="pembungkus-tabel" role="region" aria-labelledby="judul-tabel-server" tabindex="0">
  <table>
    <caption id="judul-tabel-server">Daftar Spesifikasi Node Server</caption>
    <!-- isi thead dan tbody -->
  </table>
</div>
```

Dengan CSS pendamping:
```css
.pembungkus-tabel {
  overflow-x: auto;
  max-width: 100%;
}
table {
  width: 100%;
  border-collapse: collapse;
}
```

## Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan `<td>` dengan kelas `.tebal` di dalam `<thead>` alih-alih `<th>`:**
   - **Salah:** `<thead><tr><td class="tebal">Nama Produk</td>...</tr></thead>`. Secara visual terlihat tebal, tetapi secara semantik sel tersebut tetap dianggap sel data biasa dan tidak dikenali sebagai header kolom oleh pembaca layar.
   - **Benar:** Selalu gunakan `<th scope="col">` untuk sel kepala kolom dan `<th scope="row">` untuk sel kepala baris.
2. **Meletakkan `<caption>` di luar `<table>` atau setelah `<thead>`:**
   - **Salah:** Spesifikasi HTML mewajibkan `<caption>` (jika digunakan) menjadi elemen anak pertama dari `<table>`, sebelum `<colgroup>`, `<thead>`, atau `<tbody>`.

## Latihan Praktik: Menyusun Tabel Matriks Latensi Jaringan

Buatlah berkas `tabel-latensi.html` yang menyajikan data waktu respons (dalam milidetik) dari 3 wilayah server (*Jakarta*, *Singapura*, *Tokyo*) untuk dua protokol (*HTTP/2* dan *HTTP/3*):
1. Gunakan `<caption>` sebagai judul tabel.
2. Gunakan `<thead>` dua tingkat dengan `rowspan="2"` dan `colspan="2"` beserta atribut `scope` yang tepat.
3. Gunakan `<tbody>` dengan `<th scope="row">` untuk setiap nama wilayah server.
4. Tambahkan `<tfoot>` yang menampilkan rata-rata waktu respons keseluruhan.

## Kuis Pemahaman

### Soal 1
Apa fungsi utama dari atribut `scope="row"` pada elemen `<th>` yang berada di kolom pertama sebuah baris di dalam `<tbody>`?
- A. Menggabungkan seluruh sel di dalam baris tersebut menjadi satu sel lebar.
- B. Memberitahu teknologi bantu (seperti pembaca layar) bahwa sel tersebut adalah judul/pengenal bagi seluruh sel data yang berada di baris yang sama.
- C. Membuat baris tabel otomatis terkunci di bagian atas layar ketika halaman digulir.
- D. Mengubah arah urutan kolom dari kanan ke kiri.

**Jawaban Benar:** B
**Penjelasan:** Atribut `scope="row"` mengaitkan sel kepala (`<th>`) secara eksplisit dengan semua sel data (`<td>`) yang sebaris dengannya, sehingga saat pengguna pembaca layar berpindah antar-kolom di baris tersebut, mereka selalu mengetahui baris item mana yang sedang dibaca.

### Soal 2
Di manakah posisi penempatan elemen `<caption>` yang valid menurut spesifikasi HTML?
- A. Di luar `<table>`, tepat sebelum tag pembuka `<table>`.
- B. Sebagai elemen anak terakhir di dalam `<tfoot>`.
- C. Sebagai elemen anak pertama tepat setelah tag pembuka `<table>` (sebelum `<thead>` atau `<tbody>`).
- D. Di dalam baris `<tr>` pertama pada `<thead>`.

**Jawaban Benar:** C
**Penjelasan:** Menurut spesifikasi WHATWG dan dokumentasi MDN, jika elemen `<caption>` digunakan, ia wajib menjadi elemen anak pertama dari elemen `<table>`.

### Soal 3
Pada baris pertama sebuah tabel (`<tr>`), terdapat satu sel dengan atribut `colspan="3"` dan dua sel biasa tanpa `colspan`. Berapa jumlah total kolom yang harus dimiliki oleh baris berikutnya (jika tidak ada `rowspan`) agar struktur tabel sejajar?
- A. 3 kolom
- B. 4 kolom
- C. 5 kolom
- D. 6 kolom

**Jawaban Benar:** C
**Penjelasan:** Sel dengan `colspan="3"` menempati lebar 3 kolom, ditambah 2 sel biasa yang masing-masing menempati 1 kolom, sehingga jumlah total kolom tabel tersebut adalah `3 + 1 + 1 = 5` kolom.

## Sumber
- [HTML table basics — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_table_basics)
- [HTML table accessibility — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Table_accessibility)
- [`<table>`: The Table element — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/table)
