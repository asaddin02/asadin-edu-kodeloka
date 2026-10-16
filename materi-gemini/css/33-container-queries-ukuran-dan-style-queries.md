# Container Queries Mendalam: Satuan `cqi`/`cqh`, Container Style Queries (`@container style(...)`), dan Pola Komponen

- **Tingkat:** Lanjut
- **Ringkasan:** Menggunakan satuan relatif kontainer (`cqi`, `cqb`) untuk tipografi komponen mandiri, serta memeriksa nilai variabel CSS pada kontainer induk menggunakan `@container style(--tema: gelap)`.

## Mengapa Perlu Mendalami Container Queries?

Pelajaran 08 memperkenalkan `@container` dengan `container-type: inline-size`. Pada proyek nyata Anda akan memerlukan tiga hal lanjutan: **satuan** yang berukuran relatif terhadap kontainer, **kueri gaya** (*style queries*) yang memeriksa nilai variabel CSS, dan pemahaman tentang **konsekuensi containment** yang menyertai `container-type`. Kueri ukuran (`@container (width >= ...)`) berstatus **Baseline Widely Available** sejak Februari 2023.

## 1. Mendefinisikan Kontainer dengan Rapi

```css
.pembungkus-kartu {
  container-type: inline-size;   /* melacak lebar (sumbu inline) */
  container-name: kartu;
}

/* Singkatan: nama / jenis */
.pembungkus-kartu {
  container: kartu / inline-size;
}
```

- `container-type: inline-size` memungkinkan kueri atas dimensi *inline* (lebar pada mode penulisan mendatar).
- `container-type: size` memungkinkan kueri atas lebar **dan** tinggi, tetapi elemen tidak boleh bergantung pada isinya untuk kedua dimensi; Anda harus menetapkan tinggi sendiri.
- Kueri hanya memengaruhi **keturunan** kontainer, bukan kontainer itu sendiri.

```css
@container kartu (width >= 28rem) {
  .kartu { grid-template-columns: 10rem 1fr; }
}
```

## 2. Satuan Relatif Kontainer

Satuan berikut mengacu ke ukuran **kontainer kueri terdekat**:

| Satuan | Arti |
|---|---|
| `cqw` / `cqh` | 1% lebar / 1% tinggi kontainer |
| `cqi` / `cqb` | 1% ukuran *inline* / 1% ukuran *block* kontainer |
| `cqmin` / `cqmax` | yang lebih kecil / lebih besar dari `cqi` dan `cqb` |

Satuan logis (`cqi`, `cqb`) lebih dianjurkan daripada `cqw`/`cqh` karena mengikuti arah penulisan. Satuan `cqh` dan `cqb` hanya bermakna bila kontainer memakai `container-type: size`. Jika tidak ada kontainer yang memenuhi syarat, satuan ini beralih ke satuan viewport kecil (`svi`, `svb`, dst.).

```css
.kartu h2 {
  /* Judul membesar atau mengecil mengikuti lebar kartunya, bukan lebar layar */
  font-size: clamp(1.1rem, 0.7rem + 3cqi, 1.75rem);
}

.kartu .gambar {
  inline-size: 40cqi;           /* 40% dari lebar kontainer kartu */
}
```

## 3. Container Style Queries: Membaca Variabel CSS Kontainer

Selain ukuran, `@container` dapat memeriksa **nilai terhitung variabel CSS** (custom property) pada kontainer induk terdekat:

```css
/* Induk menentukan "tema" lewat variabel */
.panel-gelap  { --tema: gelap; }
.panel-terang { --tema: terang; }

/* Komponen di dalamnya menyesuaikan diri tanpa kelas tambahan */
.kartu {
  background-color: white;
  color: #0f172a;
}

@container style(--tema: gelap) {
  .kartu {
    background-color: #1e293b;
    color: #f1f5f9;
  }
}
```

Karena variabel CSS **diwariskan**, kartu di dalam `.panel-gelap` (pada kedalaman berapa pun) mendapat nilai `--tema: gelap` dan cocok dengan kueri itu. Anda dapat memberi nama kontainer juga: `@container kartu style(--tema: gelap)`.

Hal yang perlu diperhatikan:
- Setiap elemen dapat menjadi kontainer untuk kueri gaya tanpa menulis `container-type`; kueri memeriksa nilai pada elemen leluhur terdekat (bukan elemen yang sedang ditata).
- Kueri gaya yang andal dan terstandar adalah untuk **variabel CSS**. Kueri atas properti biasa (mis. `style(display: grid)`) belum tersedia lintas peramban.
- Dukungan kueri gaya untuk variabel CSS: Chrome 111, Safari 18, Firefox 151; **Baseline Newly Available** sejak Mei 2026. Untuk peramban lebih lama, sediakan gaya dasar di luar kueri.
- Tersedia juga operator logika: `@container style(--tema: gelap) and (width >= 30rem)` memadukan kueri gaya dan ukuran pada kontainer bernama yang sama, dan `not`/`or` untuk kondisi lain.

## 4. Konsekuensi `container-type`

`container-type: inline-size` menerapkan *containment* gaya (*style*) dan ukuran pada dimensi inline (*inline-size*): ukuran inline elemen **dihitung tanpa memperhatikan isinya**. Dampaknya:
- Pada konteks yang menyusut sesuai isi (`display: inline-block`, `float`, flex item tanpa lebar, kolom tabel), lebar kontainer bisa **runtuh menjadi nol**. Beri lebar eksplisit atau biarkan kontainer berada di blok normal.
- Lebar kontainer harus ditentukan oleh konteks, misalnya elemen blok yang membentang penuh di induknya, atau ditetapkan secara eksplisit. Bila tidak, ia akan runtuh.
- Hindari `container-type: size` kecuali Anda memang menetapkan tinggi kontainer.

## Kesalahan Umum dan Cara Menghindarinya

1. **Mengharapkan kontainer menata dirinya sendiri.** Aturan `@container` hanya berlaku untuk keturunan; pasang `container-type` pada pembungkus dan ubah gaya anaknya.
2. **Memakai `cqh`/`cqb` pada kontainer `inline-size`.** Satuan ini hanya bermakna bila `container-type: size`.
3. **Menulis style query untuk properti biasa dan mengharapkan hasil.** Gunakan variabel CSS sebagai "saklar" yang dapat dikueri.
4. **Kontainer runtuh lebarnya.** Beri lebar pada pembungkus kontainer bila berada di flex item atau elemen yang menyusut sesuai isi.

## Latihan Praktik: Kartu yang Menyesuaikan Ukuran dan Tema

Buatlah berkas `container-lanjut.html` dan `container.css`:
1. Buat komponen `.kartu` yang ditaruh di kolom utama dan bilah samping. Pakai `container: kartu / inline-size` pada pembungkusnya dan `@container kartu (width >= 28rem)` untuk mengubah tata letaknya menjadi dua kolom.
2. Buat ukuran judul kartu dengan `clamp()` dan satuan `cqi`.
3. Buat dua pembungkus `.panel-gelap` dan `.panel-terang` yang menetapkan `--tema`; tulis `@container style(--tema: gelap)` agar warna kartu berubah otomatis.

## Kuis Pemahaman

### Soal 1
Apa arti `1cqi`?
- A. 1% dari lebar jendela peramban.
- B. 1% dari ukuran inline (lebar pada mode mendatar) kontainer kueri terdekat.
- C. 1% dari tinggi elemen itu sendiri.
- D. 1 piksel pada layar berkerapatan tinggi.

**Jawaban Benar:** B
**Penjelasan:** `cqi` adalah 1% dari ukuran *inline* kontainer kueri terdekat. Satuan ini membuat ukuran komponen mengikuti ruang yang tersedia baginya, bukan lebar layar.

### Soal 2
Dengan `.panel-gelap { --tema: gelap; }` dan aturan `@container style(--tema: gelap) { .kartu { background: #1e293b; } }`, kapan `.kartu` mendapat latar `#1e293b`?
- A. Hanya bila `.kartu` sendiri memiliki `--tema: gelap`.
- B. Bila kontainer leluhur terdekatnya memiliki nilai terhitung `--tema: gelap` (termasuk nilai yang diwariskan dari `.panel-gelap`).
- C. Hanya bila lebar layar kurang dari `600px`.
- D. Tidak pernah; `@container` hanya mendukung kueri ukuran.

**Jawaban Benar:** B
**Penjelasan:** Kueri gaya memeriksa nilai terhitung variabel CSS pada kontainer leluhur terdekat. Karena variabel CSS diwariskan, kartu di dalam `.panel-gelap` cocok dengan kueri tersebut.

### Soal 3
Apa risiko memasang `container-type: inline-size` pada elemen yang lebarnya mengikuti isinya, misalnya flex item tanpa lebar eksplisit?
- A. Elemen otomatis diposisikan `fixed`.
- B. Teks di dalamnya menjadi tidak dapat dipilih.
- C. Lebar elemen dapat runtuh menjadi nol, karena ukuran inline-nya tidak lagi dihitung dari isinya.
- D. Peramban menolak deklarasi tersebut.

**Jawaban Benar:** C
**Penjelasan:** `inline-size` containment membuat ukuran inline elemen tidak bergantung pada isinya. Pada konteks yang menyusut sesuai isi, lebar kontainer bisa menjadi nol kecuali diberi lebar eksplisit.

## Sumber
- [CSS container queries — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
- [Container size and style queries — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_size_and_style_queries)
- [`@container` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@container)
- [CSS Conditional Rules Module Level 5 (`@container`) — W3C](https://drafts.csswg.org/css-conditional-5/#container-rule)
