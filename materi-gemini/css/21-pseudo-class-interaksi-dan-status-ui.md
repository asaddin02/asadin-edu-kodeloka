# Pseudo-Class Interaksi dan Status UI (`:focus-visible`, `:focus-within`, `:target`, `:open`, `:modal`)

- **Tingkat:** Menengah
- **Ringkasan:** Menata elemen berdasarkan status interaksinya secara presisi menggunakan `:focus-visible`, `:focus-within`, penyorotan tautan jangkar `:target`, serta status `:open` dan `:modal` pada `<details>` dan `<dialog>`.

## Mengapa "Pseudo-Class Interaksi dan Status UI (`:focus-visible`, `:focus-within`, `:target`, `:open`, `:modal`)" Penting dalam Pengembangan CSS Modern?

Dalam membangun antarmuka web berskala produksi, penguasaan terhadap **`:focus-visible`** dan **`:modal`** memungkinkan Anda menyelesaikan permasalahan tata letak, interaksi, dan aksesibilitas langsung di mesin CSS peramban—tanpa perlu membebani halaman dengan skrip JavaScript yang rumit.

## 1. Konsep Kerja dan Dukungan Standar

Fitur `:focus-visible` dan `:modal` bekerja terintegrasi dengan model kaskade dan tata letak CSS modern:

| Komponen / Fitur | Peran Utama | Manfaat di Lingkungan Produksi |
|---|---|---|
| **`:focus-visible`** | Mengendalikan seleksi, perhitungan ukuran, atau status visual secara deklaratif. | Mengurangi ketergantungan pada manipulasi class/style via JavaScript. |
| **`:modal`** | Menangani adaptasi ruang, lapisan, atau kondisi khusus pengguna. | Menjaga konsistensi tampilan lintas ukuran layar dan perangkat bantu. |

## 2. Implementasi Kode CSS Siap Pakai

Berikut adalah pola penerapan `:focus-visible` dan `:modal` sesuai praktik terbaik CSS modern:

```css
/* Contoh penerapan Pseudo-Class Interaksi dan Status UI (`:focus-visible`, `:focus-within`, `:target`, `:open`, `:modal`) */
dialog:modal { border: 2px solid oklch(55% 0.2 255); }
section:target { scroll-margin-block-start: 5rem; }
```

```html
<!-- Struktur HTML pendamping yang semantik -->
<div class="wadah-contoh">
  <article class="komponen-contoh">
    <h2>Penerapan :focus-visible</h2>
    <p>Komponen ini memanfaatkan kemampuan asli mesin CSS peramban modern.</p>
  </article>
</div>
```

> **💡 Tips Praktis & Debugging di DevTools:**
> Saat menguji `:focus-visible` dan `:modal`, bukalah panel **Computed** di Browser DevTools (`F12`) untuk melihat nilai akhir yang dihitung oleh peramban setelah kaskade, pewarisan, dan satuan relatif diselesaikan.

## 3. Kesalahan Umum yang Harus Dihindari

1. **Menulis aturan yang terlalu mengikat struktur tag HTML:**
   Utamakan penggunaan kelas komponen yang datar dan bersih agar spesifisitas tetap rendah dan mudah dikelola di dalam `@layer`.
2. **Melupakan pengujian pada berbagai ukuran viewport dan preferensi aksesibilitas:**
   Pastikan penggunaan `:focus-visible` tetap nyaman ketika pengguna memperbesar teks hingga `200%` atau mengaktifkan mode pengurangan gerak.

## Latihan Praktik

Buatlah berkas `21-pseudo-class-interaksi-dan-status-ui.html` dan stylesheet pendampingnya:
1. Terapkan kode `:focus-visible` dan `:modal` seperti pada contoh di atas.
2. Uji perilakunya dengan mengubah ukuran jendela peramban serta memeriksa statusnya di panel **Styles** DevTools.

## Kuis Pemahaman

### Soal 1
Apa keuntungan utama menggunakan fitur CSS `:focus-visible` dibandingkan mengandalkan perhitungan manual di JavaScript?
- A. Karena JavaScript tidak dapat mengubah gaya elemen sama sekali
- B. Karena `:focus-visible` dievaluasi langsung oleh mesin perender CSS peramban pada tahap perhitungan gaya/tata letak secara instan tanpa membebani utas utama JavaScript
- C. Karena berkas CSS tidak perlu diunduh melalui jaringan
- D. Agar elemen otomatis tersembunyi di perangkat seluler

**Jawaban Benar:** B
**Penjelasan:** Menyerahkan logika presentasi dan tata letak ke fitur asli CSS seperti `:focus-visible` menjaga pemisahan tanggung jawab (*separation of concerns*) dan menghindari *layout thrashing* dari JavaScript.

### Soal 2
Dalam konteks **Pseudo-Class Interaksi dan Status UI (`:focus-visible`, `:focus-within`, `:target`, `:open`, `:modal`)**, bagaimana `:modal` membantu meningkatkan kualitas antarmuka pengguna?
- A. Dengan menghapus seluruh elemen `<style>` dari dokumen
- B. Dengan menyediakan kontrol deklaratif (`:modal`) yang merespons konteks wadah, interaksi, atau preferensi perangkat secara otomatis dan konsisten
- C. Dengan memaksa halaman menggunakan ukuran tetap `1024px`
- D. Dengan mematikan fitur *zoom* pada peramban

**Jawaban Benar:** B
**Penjelasan:** `:modal` dirancang di dalam spesifikasi CSS modern untuk menangani variasi kondisi tampilan secara adaptif tanpa merusak aksesibilitas.

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
