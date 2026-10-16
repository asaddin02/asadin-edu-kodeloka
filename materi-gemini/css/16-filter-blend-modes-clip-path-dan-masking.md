# Efek Visual Lanjutan: `filter`, `backdrop-filter`, Gradien Kompleks, dan `clip-path`

- **Tingkat:** Menengah
- **Ringkasan:** Menciptakan efek visual modern seperti kaca buram (*glassmorphism*) dengan `backdrop-filter`, bayangan mengikuti bentuk transparan dengan `filter: drop-shadow()`, diagram lingkaran murni CSS dengan `conic-gradient()`, serta pemotongan bentuk geometris dengan `clip-path`.

## 1. `filter` vs `backdrop-filter`: Kapan Menggunakan Masing-Masing?

CSS menyediakan fungsi pengolah piksel grafis langsung di peramban (status **Baseline Widely Available**):
- **`filter`:** Menerapkan efek grafis (seperti `blur()`, `brightness()`, `contrast()`, `grayscale()`, `drop-shadow()`) pada **elemen itu sendiri beserta seluruh anak di dalamnya**.
- **`backdrop-filter`:** Menerapkan efek grafis hanya pada **area latar belakang yang berada di balik elemen transparan tersebut**, sementara teks di dalam elemen tetap tajam 100%! Inilah kunci untuk membuat bilah navigasi kaca buram (*frosted glass / glassmorphism*).

```css
/* Bilah navigasi atas dengan efek kaca buram yang tetap terbaca jelas */
.header-kaca {
  position: sticky;
  inset-block-start: 0;
  z-index: 30;
  /* Wajib menggunakan warna latar semi-transparan (mis. opasitas 0.75)
     agar area di belakangnya tampak menembus dan diburamkan oleh backdrop-filter! */
  background-color: oklch(100% 0 0 / 0.75);
  backdrop-filter: blur(12px) saturate(150%);
  border-block-end: 1px solid oklch(85% 0.01 250 / 0.6);
}
```

### Perbedaan Kritis: `box-shadow` vs `filter: drop-shadow()`
- **`box-shadow`** selalu memberi bayangan pada **kotak persegi panjang** elemen, meskipun gambar di dalamnya adalah logo PNG/SVG dengan latar transparan!
- **`filter: drop-shadow(0 8px 16px rgb(0 0 0 / 0.2))`** memeriksa saluran transparansi (*alpha channel*) gambar dan memberi bayangan yang **mengikuti lekuk bentuk asli gambar PNG/SVG transparan tersebut**!

```css
/* Bayangan mengikuti lekuk bentuk ikon SVG atau gambar PNG transparan */
.ikon-ilustrasi {
  filter: drop-shadow(0 6px 12px rgb(15 23 42 / 0.18));
}
```

## 2. Tiga Jenis Gradien CSS dan Diagram Lingkaran dengan `conic-gradient()`

Di CSS, gradien (`linear-gradient`, `radial-gradient`, dan `conic-gradient`) diperlakukan sebagai gambar (`background-image`) yang dibuat secara matematis oleh peramban dengan ukuran `0 byte` jaringan:

1. **`linear-gradient(arah, warna1, warna2)`:** Transisi warna sepanjang garis lurus (tips: gunakan **`in oklch`** seperti `linear-gradient(in oklch to right, #2563eb, #10b981)` agar gradasi warna di tengahnya tampak cerah dan tidak berubah kusam keabu-abuan!).
2. **`radial-gradient(...)`:** Pancaran warna melingkar/elips dari titik pusat (sangat bagus untuk efek cahaya latar lembut di bagian *hero*).
3. **`conic-gradient(...)`:** Putaran warna mengelilingi titik pusat layaknya jarum jam! Dengan menetapkan titik henti warna secara tajam, Anda dapat membuat **diagram lingkaran (*pie/donut chart*) murni dengan CSS**:

```css
/* Membuat diagram cincin (Donut Chart) progres 75% murni dengan CSS! */
.diagram-cincin {
  --persen: 75%;
  inline-size: 8rem;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: conic-gradient(
    oklch(58% 0.2 255) var(--persen),
    oklch(90% 0.01 250) 0
  );
  display: grid;
  place-items: center;

  /* Membuat lubang di tengah cincin */
  &::before {
    content: attr(data-label);
    inline-size: 68%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background-color: #ffffff;
    display: grid;
    place-items: center;
    font-weight: 700;
  }
}
```

## 3. Memotong Bentuk Geometris dengan `clip-path`

Properti **`clip-path`** bekerja seperti pisau pemotong kue: bagian elemen yang berada di dalam jalur bentuk akan ditampilkan, sementara bagian di luarnya disembunyikan secara tajam:
- `clip-path: circle(50%)`
- `clip-path: inset(10px 20px round 12px)`
- `clip-path: polygon(x1 y1, x2 y2, x3 y3, ...)`

```css
/* Memotong bagian bawah spanduk hero secara miring dinamis */
.spanduk-miring {
  clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
  padding-block: 4rem 6rem;
}
```

> **⚠️ Peringatan Performa pada `backdrop-filter: blur()` dan `filter: blur()`:**
> Efek pemburaman (`blur`) dengan radius sangat besar (misalnya `blur(60px)`) pada area layar yang luas memakan daya GPU yang signifikan, terutama saat halaman digulir pada laptop hemat daya atau ponsel. Gunakan radius moderat (`8px`–`16px`) dan jangan menganimasikan nilai `blur()` secara terus-menerus!

## Latihan Praktik: Membuat Kartu Metrik dengan Diagram Cincin `conic-gradient`

Buatlah berkas `efek-visual.html` dan `visual.css`:
1. Buat `<header>` dengan efek kaca buram `backdrop-filter: blur(10px)` di atas latar gradien `linear-gradient(in oklch ...)`.
2. Buat 3 komponen `.diagram-cincin` yang menampilkan penggunaan CPU (`45%`), RAM (`72%`), dan Diska (`90%`) cukup dengan mengubah variabel `--persen` pada gaya inline masing-masing elemen.
3. Gunakan `filter: drop-shadow(...)` pada sebuah ikon `<svg>` transparan.

## Kuis Pemahaman

### Soal 1
Mengapa untuk memberi efek bayangan yang mengikuti lekuk garis sebuah logo transparan berformat SVG atau PNG kita harus menggunakan `filter: drop-shadow(...)` dan bukan `box-shadow`?
- A. Karena `box-shadow` tidak mendukung warna transparan `rgb(0 0 0 / 0.2)`.
- B. Karena `box-shadow` selalu menggambar bayangan mengikuti bentuk kotak persegi panjang (*border box*) elemen tersebut, sedangkan `filter: drop-shadow()` memeriksa saluran *alpha* (transparansi) piksel sehingga bayangannya mengikuti kontur bentuk objek yang tidak transparan.
- C. Karena `box-shadow` hanya bekerja pada teks.
- D. Karena `filter: drop-shadow()` mengubah gambar PNG menjadi vektor.

**Jawaban Benar:** B
**Penjelasan:** `box-shadow` bekerja pada model kotak CSS, sehingga area transparan di dalam kotak gambar tetap dianggap bagian dari persegi panjang. Sebaliknya, `filter: drop-shadow()` memproses bentuk alfa dari konten elemen.

### Soal 2
Syarat apakah yang harus dipenuhi pada warna latar (`background-color`) sebuah elemen agar properti `backdrop-filter: blur(12px)` pada elemen tersebut dapat terlihat efeknya oleh pengguna?
- A. `background-color` harus bernilai hitam pekat (`#000000` dengan opasitas `1`).
- B. `background-color` elemen tersebut harus bersifat transparan atau semi-transparan (misalnya memiliki saluran *alpha* seperti `oklch(100% 0 0 / 0.7)`), karena `backdrop-filter` bekerja pada piksel yang berada di belakang elemen tersebut.
- C. Elemen tersebut harus memiliki `opacity: 0`.
- D. Elemen tersebut wajib berupa `<img>`.

**Jawaban Benar:** B
**Penjelasan:** Jika latar belakang elemen berwarna solid 100% (`alpha = 1`), maka piksel di belakang elemen yang sudah diburamkan oleh `backdrop-filter` akan tertutup sepenuhnya oleh warna latar elemen itu sendiri.

### Soal 3
Fungsi gradien CSS manakah yang memutar transisi warna mengelilingi satu titik pusat (dari `0deg` hingga `360deg`), sehingga sangat cocok digunakan untuk menggambar diagram lingkaran (*pie/donut chart*) murni dengan CSS?
- A. `linear-gradient()`
- B. `radial-gradient()`
- C. `conic-gradient()`
- D. `repeating-linear-gradient()`

**Jawaban Benar:** C
**Penjelasan:** `conic-gradient()` menempatkan titik henti warna berdasarkan sudut putaran mengelilingi titik pusat (dalam derajat atau persentase putaran), menjadikannya alat yang sangat tepat untuk diagram lingkaran dan roda warna.

## Sumber
- [CSS reference (`filter`, `backdrop-filter`, `clip-path`) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference)
- [`oklch()` CSS function — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch)
