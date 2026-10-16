# CSS Anchor Positioning Lanjutan: Kisi `position-area` dan Penanganan Tabrakan Layar (`position-try-fallbacks`)

- **Tingkat:** Lanjut
- **Ringkasan:** Menempatkan menu sembul dan *tooltip* di sekitar elemen jangkar dengan sintaks kisi `position-area: block-end span-inline-end` serta mengatur urutan cadangan otomatis saat ruang layar sempit.

## Mengapa "CSS Anchor Positioning Lanjutan: Kisi `position-area` dan Penanganan Tabrakan Layar (`position-try-fallbacks`)" Penting dalam Pengembangan CSS Modern?

Dalam membangun antarmuka web berskala produksi, penguasaan terhadap **`position-area`** dan **`position-try-fallbacks`** memungkinkan Anda menyelesaikan permasalahan tata letak, interaksi, dan aksesibilitas langsung di mesin CSS peramban—tanpa perlu membebani halaman dengan skrip JavaScript yang rumit.

## 1. Konsep Kerja dan Dukungan Standar

Fitur `position-area` dan `position-try-fallbacks` bekerja terintegrasi dengan model kaskade dan tata letak CSS modern:

| Komponen / Fitur | Peran Utama | Manfaat di Lingkungan Produksi |
|---|---|---|
| **`position-area`** | Mengendalikan seleksi, perhitungan ukuran, atau status visual secara deklaratif. | Mengurangi ketergantungan pada manipulasi class/style via JavaScript. |
| **`position-try-fallbacks`** | Menangani adaptasi ruang, lapisan, atau kondisi khusus pengguna. | Menjaga konsistensi tampilan lintas ukuran layar dan perangkat bantu. |

## 2. Implementasi Kode CSS Siap Pakai

Berikut adalah pola penerapan `position-area` dan `position-try-fallbacks` sesuai praktik terbaik CSS modern:

```css
/* Contoh penerapan CSS Anchor Positioning Lanjutan: Kisi `position-area` dan Penanganan Tabrakan Layar (`position-try-fallbacks`) */
.tooltip {
  position: fixed;
  position-anchor: --tombol-info;
  position-area: block-start center;
  position-try-fallbacks: flip-block, flip-inline;
}
```

```html
<!-- Struktur HTML pendamping yang semantik -->
<div class="wadah-contoh">
  <article class="komponen-contoh">
    <h2>Penerapan position-area</h2>
    <p>Komponen ini memanfaatkan kemampuan asli mesin CSS peramban modern.</p>
  </article>
</div>
```

> **💡 Tips Praktis & Debugging di DevTools:**
> Saat menguji `position-area` dan `position-try-fallbacks`, bukalah panel **Computed** di Browser DevTools (`F12`) untuk melihat nilai akhir yang dihitung oleh peramban setelah kaskade, pewarisan, dan satuan relatif diselesaikan.

## 3. Kesalahan Umum yang Harus Dihindari

1. **Menulis aturan yang terlalu mengikat struktur tag HTML:**
   Utamakan penggunaan kelas komponen yang datar dan bersih agar spesifisitas tetap rendah dan mudah dikelola di dalam `@layer`.
2. **Melupakan pengujian pada berbagai ukuran viewport dan preferensi aksesibilitas:**
   Pastikan penggunaan `position-area` tetap nyaman ketika pengguna memperbesar teks hingga `200%` atau mengaktifkan mode pengurangan gerak.

## Latihan Praktik

Buatlah berkas `44-anchor-positioning-lanjut-position-area-dan-try-fallbacks.html` dan stylesheet pendampingnya:
1. Terapkan kode `position-area` dan `position-try-fallbacks` seperti pada contoh di atas.
2. Uji perilakunya dengan mengubah ukuran jendela peramban serta memeriksa statusnya di panel **Styles** DevTools.

## Kuis Pemahaman

### Soal 1
Apa keuntungan utama menggunakan fitur CSS `position-area` dibandingkan mengandalkan perhitungan manual di JavaScript?
- A. Karena JavaScript tidak dapat mengubah gaya elemen sama sekali
- B. Karena `position-area` dievaluasi langsung oleh mesin perender CSS peramban pada tahap perhitungan gaya/tata letak secara instan tanpa membebani utas utama JavaScript
- C. Karena berkas CSS tidak perlu diunduh melalui jaringan
- D. Agar elemen otomatis tersembunyi di perangkat seluler

**Jawaban Benar:** B
**Penjelasan:** Menyerahkan logika presentasi dan tata letak ke fitur asli CSS seperti `position-area` menjaga pemisahan tanggung jawab (*separation of concerns*) dan menghindari *layout thrashing* dari JavaScript.

### Soal 2
Dalam konteks **CSS Anchor Positioning Lanjutan: Kisi `position-area` dan Penanganan Tabrakan Layar (`position-try-fallbacks`)**, bagaimana `position-try-fallbacks` membantu meningkatkan kualitas antarmuka pengguna?
- A. Dengan menghapus seluruh elemen `<style>` dari dokumen
- B. Dengan menyediakan kontrol deklaratif (`position-try-fallbacks`) yang merespons konteks wadah, interaksi, atau preferensi perangkat secara otomatis dan konsisten
- C. Dengan memaksa halaman menggunakan ukuran tetap `1024px`
- D. Dengan mematikan fitur *zoom* pada peramban

**Jawaban Benar:** B
**Penjelasan:** `position-try-fallbacks` dirancang di dalam spesifikasi CSS modern untuk menangani variasi kondisi tampilan secara adaptif tanpa merusak aksesibilitas.

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
