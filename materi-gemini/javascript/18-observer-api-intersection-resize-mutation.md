# Mengamati Perubahan DOM & Layar secara Efisien: `IntersectionObserver`, `ResizeObserver`, dan `MutationObserver`

- **Tingkat:** Lanjut
- **Ringkasan:** Menggantikan penyadapan event `scroll` dan `resize` yang membebani CPU dengan tiga Observer API modern peramban: `IntersectionObserver` (visibilitas elemen di layar), `ResizeObserver` (perubahan dimensi elemen), dan `MutationObserver` (perubahan pohon DOM).

## Mengapa `window.addEventListener("scroll", ...)` dan `getBoundingClientRect()` Buruk bagi Performa?

Di masa lalu, untuk mengetahui apakah pengguna sudah menggulir sampai ke bagian bawah daftar (*infinite scroll*) atau untuk menandai bab mana yang sedang aktif di daftar isi samping (*scrollspy*), pengembang memasang `window.addEventListener("scroll", ...)`, lalu di dalamnya memanggil `elemen.getBoundingClientRect()` puluhan kali per detik.

Masalahnya:
1. Event `scroll` ditembakkan secara bertubi-tubi pada utas utama (*main thread*).
2. Memanggil `getBoundingClientRect()` memaksa peramban menghitung ulang tata letak seluruh halaman secara sinkron (**Forced Synchronous Layout**), sehingga guliran layar terasa patah-patah!

Peramban modern menyediakan **tiga Observer API asinkron** yang sangat hemat baterai dan tidak pernah memblokir guliran layar!

## 1. `IntersectionObserver`: Mendeteksi Kapan Elemen Masuk atau Keluar Layar

**`IntersectionObserver`** (status **Baseline Widely Available**) memungkinkan Anda mendaftarkan fungsi callback yang **hanya dipanggil ketika sebuah elemen target mulai masuk atau keluar dari area pandang layar** (atau wadah gulir tertentu):

```js
// Contoh Nyata: Menandai bab yang sedang dibaca pada Daftar Isi samping (Scrollspy)
// dan memuat data tambahan saat elemen pemicu di bagian bawah terlihat!
const daftarBab = document.querySelectorAll("main section[id]");

const pengamatVisibilitas = new IntersectionObserver(
  (daftarEntri) => {
    for (const entri of daftarEntri) {
      // entri.isIntersecting bernilai true jika elemen masuk ke zona pengamatan
      if (entri.isIntersecting) {
        const idAktif = entri.target.id;
        console.log(`Pengguna sedang membaca bagian: #${idAktif}`);
      }
    }
  },
  {
    root: null, // null berarti mengamati terhadap viewport layar utama
    rootMargin: "-10% 0px -70% 0px", // Memfokuskan zona deteksi di sepertiga atas layar
    threshold: 0 // Panggil segera begitu 1 piksel pertama menyentuh zona
  }
);

// Daftarkan seluruh elemen <section> untuk diamati oleh SATU instance observer!
for (const bab of daftarBab) {
  pengamatVisibilitas.observe(bab);
}

//Catatan: Jika komponen dihapus, hentikan pengamatan dengan pengamatVisibilitas.disconnect()
```

### Kegunaan Utama `IntersectionObserver`:
- **Infinite Scroll:** Letakkan satu elemen kosong `<div id="pemicu-muat-lagi"></div>` di bawah daftar kartu; ketika `entri.isIntersecting` bernilai `true`, panggil `fetch()` untuk memuat 10 kartu berikutnya!
- **Menjeda Video/Animasi Otomatis:** Ketika pemutar video atau kanvas simulasi keluar dari layar (`!entri.isIntersecting`), panggil `video.pause()` untuk menghemat CPU pengguna.

## 2. `ResizeObserver`: Merespons Perubahan Ukuran Elemen Individual

Berbeda dengan `window.addEventListener("resize", ...)` yang hanya memberi tahu jika **jendela peramban secara keseluruhan** diubah ukurannya, **`ResizeObserver`** (status **Baseline Widely Available**) memberi tahu Anda setiap kali **kotak elemen tertentu berubah ukurannya** (misalnya karena bilah samping ditutup, teks baru dimasukkan, atau tata letak Grid bergeser).

Ini sangat penting ketika Anda menggambar grafik di dalam `<canvas>` yang harus menyesuaikan jumlah pikselnya dengan ukuran wadah pembungkusnya:

```js
const wadahGrafik = document.querySelector("#wadah-kanvas");
const kanvas = wadahGrafik.querySelector("canvas");

const pengamatUkuran = new ResizeObserver((daftarEntri) => {
  for (const entri of daftarEntri) {
    // Membaca lebar dan tinggi border-box elemen yang sudah dihitung peramban
    // (Tanpa memicu Forced Synchronous Layout!)
    const { inlineSize: lebar, blockSize: tinggi } = entri.borderBoxSize[0];

    kanvas.width = Math.round(lebar * window.devicePixelRatio);
    kanvas.height = Math.round(tinggi * window.devicePixelRatio);
    gambarUlangGrafik(kanvas);
  }
});

pengamatUkuran.observe(wadahGrafik);
```

## 3. `MutationObserver`: Mengamati Perubahan Struktur atau Atribut Pohon DOM

Bagaimana jika Anda perlu menjalankan logika tertentu ketika kode lain menambahkan elemen baru ke dalam sebuah wadah atau ketika atribut `data-tema` pada elemen `<html>` berubah? Gunakan **`MutationObserver`**:

```js
const pengamatDom = new MutationObserver((daftarMutasi) => {
  for (const mutasi of daftarMutasi) {
    if (mutasi.type === "attributes" && mutasi.attributeName === "data-tema") {
      const temaBaru = document.documentElement.getAttribute("data-tema");
      console.log(`Tema dokumen berubah menjadi: ${temaBaru}`);
    }
  }
});

pengamatDom.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-tema"] // Hanya amati atribut yang relevan agar tetap ringan!
});
```

### Tabel Pemilihan Tiga Observer API

| Kebutuhan Anda | Gunakan Apa? |
|---|---|
| Mengubah tata letak CSS komponen berdasarkan lebar wadahnya | **CSS `@container` Queries** (Utamakan CSS sebelum JS!). |
| Menyesuaikan ukuran `<canvas>` atau logika JS saat ukuran sebuah elemen berubah | **`ResizeObserver`** |
| Mendeteksi apakah sebuah elemen sedang terlihat di layar (*infinite scroll*, *scrollspy*, analitik impresi) | **`IntersectionObserver`** |
| Mendeteksi perubahan atribut atau penambahan/penghapusan simpul anak di pohon DOM | **`MutationObserver`** |

## Latihan Praktik: Daftar Isi *Scrollspy* dan Pemuat Kartu Otomatis dengan `IntersectionObserver`

Buatlah berkas `observer-latihan.html` dan `observer.js`:
1. Buat 4 `<section id="bab-1">` s.d. `bab-4` yang masing-masing setinggi minimal `70vh`, serta navigasi daftar isi di sampingnya.
2. Gunakan satu `IntersectionObserver` untuk memindahkan atribut `aria-current="location"` secara otomatis ke tautan daftar isi yang sesuai dengan bab yang sedang terlihat di layar.

## Kuis Pemahaman

### Soal 1
Mengapa menggunakan `IntersectionObserver` jauh lebih baik bagi performa halaman dibandingkan memasang `window.addEventListener("scroll", ...)` yang memanggil `elemen.getBoundingClientRect()`?
- A. Karena `getBoundingClientRect()` hanya bekerja pada elemen `<div>`.
- B. Karena `IntersectionObserver` menghitung perpotongan visibilitas elemen secara asinkron di dalam mesin peramban dan hanya memanggil callback ketika ambang batas visibilitas dilewati, tanpa membanjiri utas utama di setiap piksel guliran dan tanpa memicu *Forced Synchronous Layout*.
- C. Karena event `scroll` tidak berfungsi di perangkat layar sentuh.
- D. Karena `IntersectionObserver` otomatis mengunduh gambar dari server.

**Jawaban Benar:** B
**Penjelasan:** Dengan `IntersectionObserver`, Anda tidak perlu melakukan *polling* koordinat elemen secara terus-menerus pada setiap piksel guliran; peramban yang memberi tahu Anda tepat saat elemen masuk atau keluar dari area pandang.

### Soal 2
Properti apakah pada objek `IntersectionObserverEntry` di dalam callback `IntersectionObserver` yang bernilai boolean `true` ketika elemen target sedang masuk/berpotongan dengan area pandang (*root*)?
- A. `entry.isVisibleNow`
- B. `entry.isIntersecting`
- C. `entry.inViewport`
- D. `entry.hasScrolled`

**Jawaban Benar:** B
**Penjelasan:** Properti standar `entry.isIntersecting` bernilai `true` saat elemen target berpotongan dengan area *root* sesuai ambang batas `threshold` yang ditentukan, dan berubah menjadi `false` saat elemen keluar dari area tersebut.

### Soal 3
Kapan Anda perlu menggunakan `ResizeObserver` di JavaScript padahal CSS sudah memiliki `@container` queries?
- A. Untuk mengubah `font-size` dan `grid-template-columns` biasa.
- B. Ketika perubahan ukuran wadah mengharuskan eksekusi logika JavaScript non-CSS—seperti mengatur ulang atribut piksel `canvas.width` dan menggambar ulang grafik 2D/WebGL di dalam `<canvas>`.
- C. Karena `@container` hanya bekerja di Firefox.
- D. Untuk mendeteksi apakah pengguna menekan tombol `Esc`.

**Jawaban Benar:** B
**Penjelasan:** Untuk penataan gaya dan tata letak, selalu gunakan CSS `@container`. Namun, atribut resolusi internal `<canvas width="..." height="...">` dan penggambaran ulang konteks 2D/WebGL hanya dapat diperbarui melalui JavaScript, di mana `ResizeObserver` menjadi solusi yang paling tepat.

## Sumber
- [Intersection Observer API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [`IntersectionObserver` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
- [Timing element visibility with the Intersection Observer API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API/Timing_element_visibility)
