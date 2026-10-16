# Kontrol `@keyframes` Lanjutan: `animation-fill-mode`, `steps()`, `animation-play-state`, dan `animation-composition`

- **Tingkat:** Menengah
- **Ringkasan:** Mengendalikan kondisi akhir animasi dengan `animation-fill-mode: both`, membuat animasi bingkai-demi-bingkai dengan `steps()`, menjeda animasi saat `:hover`, serta menggabungkan transformasi dengan `animation-composition`.

## Mengapa "Kontrol `@keyframes` Lanjutan: `animation-fill-mode`, `steps()`, `animation-play-state`, dan `animation-composition`" Penting dalam Pengembangan CSS Modern?

Dalam membangun antarmuka web berskala produksi, penguasaan terhadap **`animation-fill-mode: both`** dan **`animation-play-state`** memungkinkan Anda menyelesaikan permasalahan tata letak, interaksi, dan aksesibilitas langsung di mesin CSS peramban—tanpa perlu membebani halaman dengan skrip JavaScript yang rumit.

## 1. Konsep Kerja dan Dukungan Standar

Fitur `animation-fill-mode: both` dan `animation-play-state` bekerja terintegrasi dengan model kaskade dan tata letak CSS modern:

| Komponen / Fitur | Peran Utama | Manfaat di Lingkungan Produksi |
|---|---|---|
| **`animation-fill-mode: both`** | Mengendalikan seleksi, perhitungan ukuran, atau status visual secara deklaratif. | Mengurangi ketergantungan pada manipulasi class/style via JavaScript. |
| **`animation-play-state`** | Menangani adaptasi ruang, lapisan, atau kondisi khusus pengguna. | Menjaga konsistensi tampilan lintas ukuran layar dan perangkat bantu. |

## 2. Implementasi Kode CSS Siap Pakai

Berikut adalah pola penerapan `animation-fill-mode: both` dan `animation-play-state` sesuai praktik terbaik CSS modern:

```css
/* Contoh penerapan Kontrol `@keyframes` Lanjutan: `animation-fill-mode`, `steps()`, `animation-play-state`, dan `animation-composition` */
.pita-berjalan:hover {
  animation-play-state: paused;
}
```

```html
<!-- Struktur HTML pendamping yang semantik -->
<div class="wadah-contoh">
  <article class="komponen-contoh">
    <h2>Penerapan animation-fill-mode: both</h2>
    <p>Komponen ini memanfaatkan kemampuan asli mesin CSS peramban modern.</p>
  </article>
</div>
```

> **💡 Tips Praktis & Debugging di DevTools:**
> Saat menguji `animation-fill-mode: both` dan `animation-play-state`, bukalah panel **Computed** di Browser DevTools (`F12`) untuk melihat nilai akhir yang dihitung oleh peramban setelah kaskade, pewarisan, dan satuan relatif diselesaikan.

## 3. Kesalahan Umum yang Harus Dihindari

1. **Menulis aturan yang terlalu mengikat struktur tag HTML:**
   Utamakan penggunaan kelas komponen yang datar dan bersih agar spesifisitas tetap rendah dan mudah dikelola di dalam `@layer`.
2. **Melupakan pengujian pada berbagai ukuran viewport dan preferensi aksesibilitas:**
   Pastikan penggunaan `animation-fill-mode: both` tetap nyaman ketika pengguna memperbesar teks hingga `200%` atau mengaktifkan mode pengurangan gerak.

## Latihan Praktik

Buatlah berkas `42-animasi-keyframes-lanjutan-steps-dan-animation-composition.html` dan stylesheet pendampingnya:
1. Terapkan kode `animation-fill-mode: both` dan `animation-play-state` seperti pada contoh di atas.
2. Uji perilakunya dengan mengubah ukuran jendela peramban serta memeriksa statusnya di panel **Styles** DevTools.

## Kuis Pemahaman

### Soal 1
Apa keuntungan utama menggunakan fitur CSS `animation-fill-mode: both` dibandingkan mengandalkan perhitungan manual di JavaScript?
- A. Karena JavaScript tidak dapat mengubah gaya elemen sama sekali
- B. Karena `animation-fill-mode: both` dievaluasi langsung oleh mesin perender CSS peramban pada tahap perhitungan gaya/tata letak secara instan tanpa membebani utas utama JavaScript
- C. Karena berkas CSS tidak perlu diunduh melalui jaringan
- D. Agar elemen otomatis tersembunyi di perangkat seluler

**Jawaban Benar:** B
**Penjelasan:** Menyerahkan logika presentasi dan tata letak ke fitur asli CSS seperti `animation-fill-mode: both` menjaga pemisahan tanggung jawab (*separation of concerns*) dan menghindari *layout thrashing* dari JavaScript.

### Soal 2
Dalam konteks **Kontrol `@keyframes` Lanjutan: `animation-fill-mode`, `steps()`, `animation-play-state`, dan `animation-composition`**, bagaimana `animation-play-state` membantu meningkatkan kualitas antarmuka pengguna?
- A. Dengan menghapus seluruh elemen `<style>` dari dokumen
- B. Dengan menyediakan kontrol deklaratif (`animation-play-state`) yang merespons konteks wadah, interaksi, atau preferensi perangkat secara otomatis dan konsisten
- C. Dengan memaksa halaman menggunakan ukuran tetap `1024px`
- D. Dengan mematikan fitur *zoom* pada peramban

**Jawaban Benar:** B
**Penjelasan:** `animation-play-state` dirancang di dalam spesifikasi CSS modern untuk menangani variasi kondisi tampilan secara adaptif tanpa merusak aksesibilitas.

### Soal 3
Alat bantu manakah di dalam Browser DevTools yang paling tepat untuk memeriksa nilai akhir suatu properti CSS setelah seluruh perhitungan kaskade, `@layer`, dan fungsi dinamis selesai dievaluasi?
- A. Panel Console
- B. Panel Computed di dalam tab Elements / Inspector
- C. Panel Application -> Local Storage
- D. Panel Security

**Jawaban Benar:** B
**Penjelasan:** Tab **Computed** menampilkan nilai akhir aktual yang diterapkan peramban pada sebuah elemen beserta rujukan langsung ke baris aturan CSS pemenangnya.

## Sumber
- [CSS: Cascading Style Sheets — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [CSS reference — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
- [Learn CSS — web.dev](https://web.dev/learn/css)
