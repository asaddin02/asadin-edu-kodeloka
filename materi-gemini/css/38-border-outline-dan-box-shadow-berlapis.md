# Desain Bingkai, Bayangan Berlapis Realistis (`box-shadow`), dan Cincin Fokus `outline-offset`

- **Tingkat:** Dasar
- **Ringkasan:** Merancang bayangan kartu yang lembut dan natural dengan menumpuk 2–3 lapisan `box-shadow` beropasitas rendah, memanfaatkan `inset` shadow, serta membedakan perilaku `border` dan `outline`.

## Mengapa Bingkai dan Bayangan Perlu Dikuasai?

Bingkai (`border`), cincin (`outline`), dan bayangan (`box-shadow`) memberi kedalaman dan menandai status: kartu yang "terangkat", input yang sedang fokus, atau tombol yang ditekan. Ketiganya terlihat mirip tetapi **berbeda perilaku**, terutama dalam hal tata letak dan aksesibilitas. Pelajaran ini membahas cara memakainya dengan benar.

## 1. `border`: Bagian dari Kotak

`border` adalah bagian dari kotak elemen; ketebalannya **menambah ukuran** (kecuali memakai `box-sizing: border-box`, di mana ukurannya sudah termasuk di dalam `width`).

```css
.kartu {
  border: 1px solid oklch(90% 0.01 250);       /* ketebalan gaya warna */
  border-radius: 0.75rem;
  border-inline-start: 4px solid oklch(55% 0.2 255);   /* aksen di sisi awal */
}
```

Nilai gaya yang umum: `solid`, `dashed`, `dotted`, `double`, `none`. Sudut membulat dengan `border-radius` memengaruhi bentuk border, latar, dan bayangan.

## 2. `outline`: Cincin di Luar Kotak

`outline` digambar **di luar** border dan **tidak mengubah tata letak**: ia tidak menambah ukuran elemen dan tidak menggeser tetangga. Karena itu ia pilihan utama untuk indikator fokus. Properti `outline-offset` mengatur jarak cincin dari tepi elemen (nilai negatif menggesernya ke dalam):

```css
:focus-visible {
  outline: 3px solid oklch(55% 0.2 255);
  outline-offset: 3px;           /* ada jarak antara elemen dan cincin */
}

.tombol-ikon:focus-visible {
  outline-offset: -3px;          /* cincin di dalam tepi, bila ruang luar sempit */
}
```

Pada peramban modern, `outline` mengikuti lengkung `border-radius`.

| Aspek | `border` | `outline` |
|---|---|---|
| Memengaruhi ukuran/tata letak | Ya | Tidak |
| Bisa diatur per sisi | Ya (`border-top`, dst.) | Tidak (satu cincin untuk semua sisi) |
| Jarak dari tepi | Tidak | Ya, dengan `outline-offset` |
| Cocok untuk | Bingkai permanen | Fokus, penyorotan sementara |

## 3. `box-shadow`: Satu Lapis Itu Kurang Natural

Sintaks: `box-shadow: geser-x geser-y blur spread warna;`, dengan kata kunci opsional `inset`. Bayangan **tidak** memengaruhi tata letak dan mengikuti `border-radius`.

Bayangan nyata terdiri dari beberapa komponen cahaya. Tumpuk **dua sampai tiga lapis** dengan opasitas rendah: yang kecil dan tajam di dekat elemen, yang besar dan lembut di kejauhan:

```css
.kartu-angkat {
  box-shadow:
    0 1px 2px  rgb(15 23 42 / 0.06),    /* kontak: tipis dan tajam */
    0 4px 8px  rgb(15 23 42 / 0.08),    /* tengah */
    0 16px 32px rgb(15 23 42 / 0.10);   /* jauh: lebar dan lembut */
}
```

Tips agar bayangan tampak natural:
- Pakai warna **bernuansa latar** (mis. biru gelap `15 23 42`), bukan hitam murni.
- Opasitas rendah tiap lapis; jumlahnya yang membangun kedalaman.
- Lapisan pertama berada paling atas.
- Spread negatif (mis. `0 12px 16px -8px`) membuat bayangan lebih sempit dari elemen sehingga tidak "melebar" ke samping.

### `inset`: Bayangan di Dalam

```css
.input-tekan {
  box-shadow: inset 0 2px 4px rgb(15 23 42 / 0.12);   /* kesan cekung */
}
```

### "Cincin" dengan Spread

`box-shadow: 0 0 0 3px warna` menggambar cincin tebal tanpa geser dan blur. Teknik ini populer untuk status fokus, tetapi **bukan pengganti `outline`**; lihat catatan di bawah.

## 4. Aksesibilitas dan Performa

> **⚠️ Mode Warna Paksa:** Pada *forced colors mode* (misalnya Windows High Contrast), peramban mengubah `box-shadow` dan `text-shadow` menjadi `none`. Cincin fokus yang dibuat hanya dari `box-shadow` akan **hilang** bagi pengguna tersebut. Selalu gunakan `outline` (atau sertakan `outline: 2px solid transparent` sebagai cadangan yang tetap terlihat di mode paksa) untuk indikator fokus.

```css
.input:focus-visible {
  outline: 2px solid transparent;                  /* diganti warna sistem pada forced colors */
  box-shadow: 0 0 0 3px oklch(55% 0.2 255 / 0.35); /* tampilan normal */
}
```

- **Performa:** Menganimasikan `box-shadow` memicu *paint* pada setiap bingkai. Untuk efek *hover* yang halus, taruh bayangan besar pada pseudo-element `::after`, lalu animasikan **`opacity`**-nya.
- **Kontras:** Indikator fokus harus mudah terlihat; WCAG 2.2 meminta kontras yang cukup untuk komponen antarmuka (SC 1.4.11).

## Studi Kasus Produksi: Sistem Elevasi Tiga Tingkat dan Fokus Tahan Mode Kontras Tinggi

Dalam sistem desain modern, elevasi kartu dibagi menjadi beberapa tingkat bayangan berlapis yang dikombinasikan dengan `outline` transparan agar kartu tetap memiliki batas tegas saat pengguna mengaktifkan Windows Contrast Themes (`forced-colors`):

```css
:root {
  --elevasi-1:
    0 1px 2px oklch(20% 0.02 250 / 0.06),
    0 2px 4px oklch(20% 0.02 250 / 0.06);
  --elevasi-2:
    0 2px 4px oklch(20% 0.02 250 / 0.05),
    0 8px 16px -2px oklch(20% 0.02 250 / 0.1),
    0 16px 32px -4px oklch(20% 0.02 250 / 0.08);
}

.kartu-interaktif {
  border-radius: 0.75rem;
  box-shadow: var(--elevasi-1);
  /* Terlihat otomatis sebagai garis batas pada forced-colors: active */
  outline: 1px solid transparent;
}

.kartu-interaktif:focus-visible {
  outline: 3px solid oklch(55% 0.22 255);
  outline-offset: 3px;
}
```

Trik `outline: 1px solid transparent` tidak mengubah tampilan visual di mode standar, tetapi langsung berubah menjadi garis batas sistem yang jelas ketika `box-shadow` dihapus oleh mode warna paksa.

## Kesalahan Umum dan Cara Menghindarinya

1. **Menghapus cincin fokus (`outline: none`) tanpa pengganti.** Gunakan `outline` yang jelas pada `:focus-visible`.
2. **Memakai `border` untuk status fokus.** Ketebalannya menggeser tata letak; gunakan `outline`.
3. **Satu lapis bayangan hitam pekat.** Terlihat berat dan tak natural; tumpuk lapisan lembut berwarna.
4. **Mengandalkan `box-shadow` saja sebagai indikator.** Hilang di mode warna paksa.
5. **Menganimasikan bayangan besar secara langsung.** Gunakan trik `opacity` pada pseudo-element.

## Latihan Praktik: Kartu dengan Kedalaman dan Fokus yang Jelas

Buatlah berkas `bingkai-bayangan.html` dan `bingkai.css`:
1. Buat kartu dengan bayangan tiga lapis seperti contoh, lalu bandingkan dengan `box-shadow: 0 10px 30px black`.
2. Buat input dengan bayangan `inset` yang menimbulkan kesan cekung.
3. Beri semua kontrol interaktif `:focus-visible` dengan `outline: 3px solid` dan `outline-offset: 3px`. Uji dengan `Tab`, lalu aktifkan emulasi `forced-colors: active` di tab Rendering DevTools untuk memastikan cincin tetap terlihat.
4. Buat efek *hover* kartu dengan bayangan di `::after` dan animasikan `opacity`.

## Kuis Pemahaman

### Soal 1
Pada `box-shadow: A, B, C;` (tiga bayangan), bayangan mana yang tergambar paling atas?
- A. `C`
- B. `B`
- C. `A`
- D. Semuanya setara.

**Jawaban Benar:** C
**Penjelasan:** Pada daftar bayangan, bayangan pertama berada paling depan dan yang berikutnya di belakangnya.

### Soal 2
Mengapa `outline` lebih cocok daripada `border` untuk menandai fokus papan ketik?
- A. Karena `outline` dapat dianimasikan, sedangkan `border` tidak.
- B. Karena `border` tidak mendukung warna.
- C. Karena `outline` hanya dapat dilihat oleh pembaca layar.
- D. Karena `outline` tidak mengubah ukuran elemen sehingga tata letak tidak bergeser saat fokus muncul, dan tetap tampil pada mode warna paksa.

**Jawaban Benar:** D
**Penjelasan:** `outline` digambar di luar kotak tanpa memengaruhi tata letak. Pada mode warna paksa peramban tetap menampilkannya, sedangkan `box-shadow` dihilangkan.

### Soal 3
Apa yang membuat bayangan tampak lebih natural daripada `box-shadow: 0 10px 30px black`?
- A. Menumpuk beberapa lapis bayangan beropasitas rendah dengan blur yang berbeda-beda, memakai warna bernuansa latar alih-alih hitam murni.
- B. Menambah nilai blur sampai `200px`.
- C. Memakai `inset` pada semua bayangan.
- D. Menghapus `border-radius`.

**Jawaban Benar:** A
**Penjelasan:** Bayangan nyata terdiri atas beberapa komponen cahaya; menumpuk lapisan lembut dengan jarak dan blur berbeda menghasilkan kedalaman yang lebih meyakinkan daripada satu bayangan hitam pekat.

## Sumber
- [`box-shadow` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow)
- [`outline` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/outline)
- [`outline-offset` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/outline-offset)
- [`border` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/border)
- [CSS Color Adjustment Module Level 1 (Forced Colors Mode) — W3C](https://www.w3.org/TR/css-color-adjust-1/)
