# Isolasi Gaya Komponen dengan `@scope` dan *Donut Scoping* (`@scope (.kartu) to (.slot-isi)`)

- **Tingkat:** Lanjut
- **Ringkasan:** Membatasi jangkauan selektor CSS hanya pada sub-pohon komponen tertentu menggunakan at-rule `@scope`, kedekatan pohon DOM (*scoping proximity*), serta membatasi batas bawah dengan klausa `to (...)`.

## Mengapa Perlu `@scope`?

CSS secara bawaan bersifat global: selektor `.judul` memengaruhi **semua** elemen berkelas `judul` di seluruh halaman. Untuk mencegah benturan, tim biasanya memakai konvensi penamaan seperti BEM (`.kartu__judul`), yang menuntut disiplin dan membuat nama kelas panjang. At-rule **`@scope`** menawarkan cara lain: membatasi **jangkauan** aturan CSS pada sub-pohon DOM tertentu, sehingga Anda bisa menulis selektor pendek dan tetap aman dari kebocoran gaya.

`@scope` berstatus **Baseline Newly Available** sejak Maret 2026 (Chrome 118, Firefox 146, Safari 26.4). Untuk peramban yang lebih lama, aturan di dalam `@scope` akan diabaikan; pertimbangkan hal ini bila Anda harus mendukung versi lama.

## 1. Sintaks Dasar: Akar Lingkup (*Scope Root*)

```css
@scope (.kartu) {
  /* Hanya mencocokkan <h2> dan <a> yang berada di dalam .kartu */
  h2 { font-size: 1.25rem; }
  a  { color: oklch(50% 0.2 255); }

  /* :scope menunjuk akar lingkup itu sendiri, yaitu elemen .kartu */
  :scope {
    border: 1px solid #cbd5e1;
    border-radius: 0.75rem;
  }
}
```

Penjelasan:
- Bagian `(.kartu)` adalah **akar lingkup**. Aturan di dalam blok hanya berlaku untuk elemen di dalam sub-pohon `.kartu` (dan `.kartu` itu sendiri bila menggunakan `:scope`).
- Selektor tanpa awalan, seperti `h2`, diperlakukan seolah-olah ditulis `:where(:scope) h2`. Akar lingkup tidak ikut menambah spesifisitas. Jadi `h2` di atas bernilai `(0, 0, 1)`, bukan `(0, 1, 1)`.
- `:scope` yang ditulis eksplisit bernilai satu pseudo-class `(0, 1, 0)`. Simbol `&` di dalam `@scope` berperilaku seperti `:where(:scope)`, jadi tidak menambah bobot.
- Di dalam elemen `<style>`, awalan boleh dihilangkan: `@scope { ... }` otomatis berlaku untuk elemen induk `<style>` tersebut.

## 2. Batas Bawah dan *Donut Scoping*

Tambahkan klausa `to (...)` untuk menetapkan **batas bawah** (*scope limit*). Elemen batas dan seluruh keturunannya **dikecualikan** dari lingkup. Karena lingkupnya berbentuk seperti donat (ada lubang di tengah), teknik ini dijuluki *donut scoping*:

```css
/* Gaya kartu berlaku untuk isi kartu, TETAPI tidak menembus slot yang diisi pengguna */
@scope (.kartu) to (.slot-isi) {
  img {
    border-radius: 0.5rem;
  }
  p {
    color: oklch(35% 0.02 250);
  }
}
```

```html
<article class="kartu">
  <img src="sampul.jpg" alt="Sampul kelas">          <!-- terkena aturan img -->
  <p>Ringkasan kelas.</p>                              <!-- terkena aturan p -->
  <div class="slot-isi">
    <img src="avatar.jpg" alt="Foto pengguna">         <!-- TIDAK terkena: berada di dalam .slot-isi -->
    <p>Komentar pengguna.</p>                          <!-- TIDAK terkena -->
  </div>
</article>
```

Batas atas bersifat **inklusif** (akar lingkup ikut terpilih lewat `:scope`) dan batas bawah bersifat **eksklusif** (elemen batas tidak terpilih). Anda dapat membalik sifat ini dengan `> *`, misalnya `@scope (.kartu > *)` membuat batas atas eksklusif.

> **💡 Kegunaan Nyata:** Pustaka komponen sering memiliki "slot" tempat konten pengguna ditaruh (komentar, artikel, hasil unggahan). Dengan donut scope, gaya komponen tidak "bocor" ke konten pengguna yang tertanam di dalamnya.

## 3. Kedekatan Lingkup (*Scoping Proximity*)

`@scope` menambahkan satu langkah baru pada algoritma Cascade: jika dua aturan bersaing dan semuanya setara hingga tahap spesifisitas, aturan yang **akar lingkupnya lebih dekat** (lebih sedikit tingkat DOM di atas elemen target) yang menang, **sebelum** urutan kemunculan diperiksa. Urutannya menjadi: pentingnya deklarasi (`!important`), lapisan (`@layer`), spesifisitas, kedekatan lingkup, lalu urutan kemunculan.

```css
@scope (.tema-terang) {
  a { color: oklch(45% 0.2 255); }
}
@scope (.tema-gelap) {
  a { color: oklch(85% 0.1 255); }
}
```

```html
<div class="tema-gelap">
  <div class="tema-terang">
    <a href="#">Tautan A</a>   <!-- dekat ke .tema-terang -> warna biru tua -->
  </div>
  <a href="#">Tautan B</a>     <!-- dekat ke .tema-gelap -> warna biru muda -->
</div>
```

Pada `Tautan A`, ada dua aturan yang cocok (`.tema-terang a` dan `.tema-gelap a`) dengan spesifisitas yang sama. Karena `.tema-terang` lebih dekat ke tautan, aturannya menang walau ditulis lebih dulu. Dengan selektor biasa, tema bersarang seperti ini biasanya dipecahkan lewat urutan kemunculan, sehingga hasilnya salah.

## 4. Hal yang Tidak Dilakukan oleh `@scope`

- **Tidak mengisolasi pewarisan.** Properti yang diwariskan seperti `color` dan `font-family` tetap mengalir ke dalam slot di luar lingkup lewat pewarisan biasa. `@scope` hanya membatasi elemen mana yang dicocokkan selektor.
- **Tidak menggantikan Shadow DOM.** Gaya dari luar masih bisa memengaruhi elemen di dalam lingkup jika selektor luar cocok dengannya.
- **Tidak menaikkan spesifisitas.** Itu sebabnya selektor di dalam `@scope` mudah ditimpa; atur prioritas antarkomponen dengan `@layer`, bukan dengan memperberat selektor.

## Studi Kasus Produksi: Komponen Tab dan Kartu Bersarang Tanpa Kebocoran Gaya

Pada komponen antarmuka yang dapat memuat komponen lain di dalam slot kontennya (seperti panel tab yang di dalamnya berisi kartu artikel), *donut scoping* memastikan gaya judul panel tidak merembes ke judul kartu di dalam slot:

```css
@scope (.panel-tab) to (.slot-isi) {
  :scope {
    border: 1px solid oklch(85% 0.02 250);
    border-radius: 0.75rem;
    padding: 1rem;
  }

  /* Hanya menata h2 milik header panel-tab, berhenti sebelum .slot-isi */
  h2 {
    font-size: 1.125rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: oklch(40% 0.04 250);
  }
}

@scope (.kartu-artikel) {
  h2 {
    font-size: 1.5rem;
    color: oklch(25% 0.02 250);
  }
}
```

Berkat batas bawah `to (.slot-isi)` dan aturan kedekatan lingkup (*scoping proximity*), elemen `<h2>` di dalam `.kartu-artikel` tidak akan mewarisi huruf kapital kecil milik `.panel-tab`.

## Kesalahan Umum dan Cara Menghindarinya

1. **Menyangka akar lingkup menambah bobot spesifisitas.** `@scope (#hero) { img { } }` setara dengan `:where(#hero) img`, yaitu `(0, 0, 1)`. Aturan ini bisa dikalahkan selektor kelas biasa di luar `@scope`.
2. **Menulis `:scope` untuk anak biasa.** `:scope` hanya menunjuk akar lingkup. Untuk anak langsung, tulis `:scope > img` atau cukup `> img`.
3. **Lupa bahwa batas bawah bersifat eksklusif.** Elemen `.slot-isi` itu sendiri juga tidak terkena gaya, bukan hanya keturunannya.
4. **Mengandalkan `@scope` di peramban lama tanpa cadangan.** Peramban yang belum mendukung akan mengabaikan seluruh blok; sediakan gaya dasar di luar `@scope` bila perlu.

## Latihan Praktik: Komponen Kartu dengan Slot Aman

Buatlah berkas `scope.html` dan `scope.css`:
1. Buat komponen `.kartu` berisi `<h2>`, `<img>`, `<p>`, dan satu `<div class="slot-isi">` yang berisi gambar dan paragraf dari "pengguna".
2. Beri gaya komponen dengan `@scope (.kartu) to (.slot-isi)` dan pastikan isi slot tidak terkena gaya tersebut (periksa lewat panel Styles DevTools).
3. Buat dua tema bersarang (`.tema-terang` dalam `.tema-gelap` dan sebaliknya) dengan `@scope`, lalu buktikan bahwa kedekatan akar lingkup menentukan warna tautan, bukan urutan penulisan.

## Kuis Pemahaman

### Soal 1
Diberikan `@scope (.kartu) to (.slot-isi) { img { border: 2px solid red; } }`. Gambar manakah yang mendapat bingkai merah?
- A. Semua `<img>` di halaman.
- B. Hanya `<img>` di dalam `.slot-isi`.
- C. `<img>` di dalam `.kartu` yang tidak berada di dalam `.slot-isi`.
- D. Tidak ada, karena `to (...)` membatalkan seluruh aturan.

**Jawaban Benar:** C
**Penjelasan:** Akar lingkup `.kartu` menentukan batas atas, dan `to (.slot-isi)` mengecualikan `.slot-isi` beserta isinya. Hasilnya, hanya gambar di dalam `.kartu` dan di luar `.slot-isi` yang cocok (*donut scoping*).

### Soal 2
Berapa spesifisitas selektor `img` yang ditulis di dalam `@scope (#hero) { ... }`?
- A. `(1, 0, 1)`, karena ID `#hero` ikut dihitung.
- B. `(0, 0, 1)`, karena akar lingkup diperlakukan seperti `:where(:scope)` dan tidak menambah bobot.
- C. `(0, 1, 1)`, karena `:scope` selalu dihitung sebagai pseudo-class.
- D. `(0, 0, 0)`, karena semua selektor di dalam `@scope` bernilai nol.

**Jawaban Benar:** B
**Penjelasan:** Selektor tanpa awalan di dalam `@scope` diperlakukan seolah-olah ditulis `:where(:scope) img`; `:where()` memberi bobot nol, sehingga hanya `img` yang dihitung, yaitu `(0, 0, 1)`. Hanya `:scope` yang ditulis eksplisit yang menambah `(0, 1, 0)`.

### Soal 3
`@scope (.tema-terang) { a { color: blue; } }` ditulis **sebelum** `@scope (.tema-gelap) { a { color: white; } }`. Sebuah `<a>` berada di dalam `.tema-terang`, yang berada di dalam `.tema-gelap`. Warna tautan itu?
- A. Putih, karena aturan yang ditulis belakangan selalu menang.
- B. Putih, karena `.tema-gelap` adalah leluhur terluar dan memengaruhi semua keturunannya.
- C. Hitam bawaan peramban, karena kedua aturan saling membatalkan.
- D. Biru, karena spesifisitas kedua aturan sama dan akar lingkup `.tema-terang` lebih dekat ke tautan, sehingga kedekatan lingkup menang atas urutan kemunculan.

**Jawaban Benar:** D
**Penjelasan:** Kedua aturan memiliki spesifisitas `(0, 0, 1)`. Pada tahap kedekatan lingkup, akar `.tema-terang` lebih dekat ke `<a>` daripada `.tema-gelap`, sehingga aturannya menang walaupun ditulis lebih dulu. Urutan kemunculan baru dinilai jika kedekatannya sama.

## Sumber
- [`@scope` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@scope)
- [CSS Cascading and Inheritance Level 6 (`@scope`) — W3C](https://drafts.csswg.org/css-cascade-6/#scoped-styles)
