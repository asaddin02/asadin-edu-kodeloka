# Desain Bingkai, Bayangan Berlapis Realistis (`box-shadow`), dan Cincin Fokus `outline-offset`

- **Tingkat:** Dasar
- **Ringkasan:** Merancang bayangan kartu yang lembut dan natural dengan menumpuk 2–3 lapisan `box-shadow` beropasitas rendah, memanfaatkan `inset` shadow, serta membedakan perilaku `border` dan `outline`.

## Mengapa "Desain Bingkai, Bayangan Berlapis Realistis (`box-shadow`), dan Cincin Fokus `outline-offset`" Penting dalam Pengembangan CSS Modern?

Dalam membangun antarmuka web berskala produksi, penguasaan terhadap **`box-shadow`** dan **`outline-offset`** memungkinkan Anda menyelesaikan permasalahan tata letak, interaksi, dan aksesibilitas langsung di mesin CSS peramban—tanpa perlu membebani halaman dengan skrip JavaScript yang rumit.

## 1. Konsep Kerja dan Dukungan Standar

Fitur `box-shadow` dan `outline-offset` bekerja terintegrasi dengan model kaskade dan tata letak CSS modern:

| Komponen / Fitur | Peran Utama | Manfaat di Lingkungan Produksi |
|---|---|---|
| **`box-shadow`** | Mengendalikan seleksi, perhitungan ukuran, atau status visual secara deklaratif. | Mengurangi ketergantungan pada manipulasi class/style via JavaScript. |
| **`outline-offset`** | Menangani adaptasi ruang, lapisan, atau kondisi khusus pengguna. | Menjaga konsistensi tampilan lintas ukuran layar dan perangkat bantu. |

## 2. Implementasi Kode CSS Siap Pakai

Berikut adalah pola penerapan `box-shadow` dan `outline-offset` sesuai praktik terbaik CSS modern:

```css
/* Contoh penerapan Desain Bingkai, Bayangan Berlapis Realistis (`box-shadow`), dan Cincin Fokus `outline-offset` */
.kartu-halus {
  box-shadow:
    0 1px 2px rgb(15 23 42 / 0.06),
    0 8px 24px -4px rgb(15 23 42 / 0.08);
}
```

```html
<!-- Struktur HTML pendamping yang semantik -->
<div class="wadah-contoh">
  <article class="komponen-contoh">
    <h2>Penerapan box-shadow</h2>
    <p>Komponen ini memanfaatkan kemampuan asli mesin CSS peramban modern.</p>
  </article>
</div>
```

> **💡 Tips Praktis & Debugging di DevTools:**
> Saat menguji `box-shadow` dan `outline-offset`, bukalah panel **Computed** di Browser DevTools (`F12`) untuk melihat nilai akhir yang dihitung oleh peramban setelah kaskade, pewarisan, dan satuan relatif diselesaikan.

## 3. Kesalahan Umum yang Harus Dihindari

1. **Menulis aturan yang terlalu mengikat struktur tag HTML:**
   Utamakan penggunaan kelas komponen yang datar dan bersih agar spesifisitas tetap rendah dan mudah dikelola di dalam `@layer`.
2. **Melupakan pengujian pada berbagai ukuran viewport dan preferensi aksesibilitas:**
   Pastikan penggunaan `box-shadow` tetap nyaman ketika pengguna memperbesar teks hingga `200%` atau mengaktifkan mode pengurangan gerak.

## Latihan Praktik

Buatlah berkas `38-border-outline-dan-box-shadow-berlapis.html` dan stylesheet pendampingnya:
1. Terapkan kode `box-shadow` dan `outline-offset` seperti pada contoh di atas.
2. Uji perilakunya dengan mengubah ukuran jendela peramban serta memeriksa statusnya di panel **Styles** DevTools.

## Kuis Pemahaman

### Soal 1
Apa keuntungan utama menggunakan fitur CSS `box-shadow` dibandingkan mengandalkan perhitungan manual di JavaScript?
- A. Karena JavaScript tidak dapat mengubah gaya elemen sama sekali
- B. Karena `box-shadow` dievaluasi langsung oleh mesin perender CSS peramban pada tahap perhitungan gaya/tata letak secara instan tanpa membebani utas utama JavaScript
- C. Karena berkas CSS tidak perlu diunduh melalui jaringan
- D. Agar elemen otomatis tersembunyi di perangkat seluler

**Jawaban Benar:** B
**Penjelasan:** Menyerahkan logika presentasi dan tata letak ke fitur asli CSS seperti `box-shadow` menjaga pemisahan tanggung jawab (*separation of concerns*) dan menghindari *layout thrashing* dari JavaScript.

### Soal 2
Dalam konteks **Desain Bingkai, Bayangan Berlapis Realistis (`box-shadow`), dan Cincin Fokus `outline-offset`**, bagaimana `outline-offset` membantu meningkatkan kualitas antarmuka pengguna?
- A. Dengan menghapus seluruh elemen `<style>` dari dokumen
- B. Dengan menyediakan kontrol deklaratif (`outline-offset`) yang merespons konteks wadah, interaksi, atau preferensi perangkat secara otomatis dan konsisten
- C. Dengan memaksa halaman menggunakan ukuran tetap `1024px`
- D. Dengan mematikan fitur *zoom* pada peramban

**Jawaban Benar:** B
**Penjelasan:** `outline-offset` dirancang di dalam spesifikasi CSS modern untuk menangani variasi kondisi tampilan secara adaptif tanpa merusak aksesibilitas.

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
