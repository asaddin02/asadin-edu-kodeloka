# Media `<audio>`, `<video>`, dan Penulisan Takarir WebVTT (`<track>`) untuk Aksesibilitas

- **Tingkat:** Menengah
- **Ringkasan:** Menyusun struktur berkas teks WebVTT (`.vtt`) untuk `kind="captions"`, `subtitles`, `chapters`, dan `descriptions` pada elemen `<track>` agar konten video ramah bagi seluruh pengguna.

## Mengapa Format WebVTT Menjadi Tulang Punggung Aksesibilitas Video Web?

Menyediakan elemen `<video>` saja belum cukup untuk memenuhi standar aksesibilitas web. Pengguna Tuli membutuhkan transkripsi dialog dan penanda efek suara (`captions`), penonton internasional membutuhkan terjemahan (`subtitles`), dan pelajar yang menonton video tutorial berdurasi 30 menit membutuhkan daftar bab (`chapters`) agar dapat melompat langsung ke topik tertentu.

Seluruh kebutuhan tersebut dipenuhi oleh satu format berkas teks standar W3C: **WebVTT (*Web Video Text Tracks*, berekstensi `.vtt`)** yang dihubungkan ke elemen `<video>` melalui tag `<track>`.

## 1. Struktur Sintaks Berkas WebVTT (`.vtt`) yang Valid

Sebuah berkas WebVTT adalah berkas teks ber-pengodean **UTF-8** yang wajib mematuhi aturan sintaks ketat agar tidak ditolak oleh parser peramban:
1. **Baris pertama wajib bertuliskan `WEBVTT`** (peka huruf besar), diikuti oleh minimal satu baris kosong (`

`).
2. Setiap potongan teks (*cue*) memiliki rentang waktu dengan format **`JJ:MM:DD.mmm --> JJ:MM:DD.mmm`** (atau `MM:DD.mmm` jika di bawah 1 jam). Perhatikan bahwa pemisah milidetik wajib menggunakan **tanda titik (`.`)**, bukan tanda koma (`,`) seperti pada format `.srt` lama!
3. Di atas baris waktu, Anda boleh menambahkan pengenal *cue* opsional (misalnya angka `1`, `2`, atau nama bab).
4. Komentar yang tidak akan ditampilkan di layar diawali dengan kata kunci **`NOTE`** yang diikuti spasi atau baris baru, lalu ditutup dengan baris kosong.

| Komponen Sintaks WebVTT | Contoh Penulisan Valid | Kesalahan yang Sering Terjadi |
|---|---|---|
| **Header Berkas** | `WEBVTT` di baris ke-1 | Menambahkan spasi di depan `WEBVTT` atau lupa baris kosong setelahnya. |
| **Rentang Waktu (*Cue Timings*)** | `00:00:01.000 --> 00:00:04.500` | Memakai koma `00:00:01,000` (gaya SRT) atau menulis `->` (kurang satu strip). |
| **Tag Pembicara (*Voice Span*)** | `<v Budi>Selamat pagi semuanya!` | Menutup tag `<v>` dengan nama pembicara (seharusnya cukup `</v>` atau di akhir baris). |
| **Pengaturan Posisi Cue** | `00:00:01.000 --> 00:00:04.000 line:0 align:center` | Menaruh pengaturan posisi di baris teks (seharusnya di sebelah kanan waktu selesai). |

## 2. Menghubungkan `<track>` ke `<video>` dan Menulis Berkas `.vtt`

Berikut adalah implementasi elemen `<video>` yang merujuk ke berkas WebVTT beserta isi berkas `.vtt`-nya:

```html
<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video dengan Takarir WebVTT — Kodeloka</title>
  </head>
  <body>
    <main>
      <h1>Video dengan Takarir WebVTT</h1>
      <video controls preload="metadata" width="640" height="360">
        <source src="/media/demo.webm" type="video/webm">
        <source src="/media/demo.mp4" type="video/mp4">
        <track kind="captions" src="/media/demo.id.vtt" srclang="id" label="Bahasa Indonesia" default>
        <track kind="subtitles" src="/media/demo.en.vtt" srclang="en" label="English">
        <p>Peramban Anda tidak mendukung video HTML5. <a href="/media/demo.mp4">Unduh video MP4</a>.</p>
      </video>
    </main>
  </body>
</html>
```

Berkas `demo.id.vtt` yang dirujuk oleh `<track>` di atas harus diawali baris `WEBVTT`, lalu berisi cue dengan rentang waktu `jam:menit:detik.milidetik`:

```text
WEBVTT

NOTE
Berkas takarir Bahasa Indonesia untuk video pengantar Kodeloka.

intro
00:00:01.000 --> 00:00:04.000
<v Instruktur>Selamat datang di Kodeloka.</v>

materi-awal
00:00:04.500 --> 00:00:08.000 line:85% align:center
[suara papan ketik]
Mari mulai dengan struktur dokumen HTML.
```

Berkas `.vtt` sebaiknya dilayani dengan `Content-Type: text/vtt` (sebagian peramban menolak tipe MIME lain), dan jika berasal dari origin lain, server harus mengirim header CORS serta elemen `<video>` diberi `crossorigin`.

> **Status dukungan (Oktober 2026):** `<track>` dan WebVTT berstatus *Baseline Widely Available*. Ingat bahwa `<audio>` tidak menampilkan teks `<track>` secara visual (lihat pelajaran 25); takarir hanya tampil pada `<video>`.

## 3. Menulis WebVTT untuk Navigasi Bab (`kind="chapters"`) dan Menata dengan `::cue`

Selain `captions` dan `subtitles`, Anda dapat menyediakan berkas WebVTT khusus daftar bab (`<track kind="chapters" src="bab.vtt" srclang="id">`) agar pengguna atau skrip pemutar dapat menampilkan daftar isi video:

```text
WEBVTT

bab-1
00:00:00.000 --> 00:02:15.000
1. Pengenalan Protokol HTTP dan DNS

bab-2
00:02:15.000 --> 00:06:40.000
2. Anatomi Dokumen HTML5 Modern

bab-3
00:06:40.000 --> 00:10:00.000
3. Pemeriksaan Pohon Aksesibilitas di DevTools
```

Di sisi CSS, Anda juga dapat menyesuaikan tampilan visual takarir di atas video menggunakan pseudo-element **`::cue`** supaya memiliki kontras tinggi dan mudah dibaca di atas latar video yang terang:

```css
/* Menata seluruh teks takarir di dalam video */
video::cue {
  background-color: rgba(15, 23, 42, 0.85);
  color: #f8fafc;
  font-family: system-ui, sans-serif;
}

/* Menata khusus suara pembicara <v Instruktur> */
video::cue(v[voice="Instruktur"]) {
  color: #93c5fd;
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Mengganti ekstensi berkas `.srt` menjadi `.vtt` tanpa mengubah formatnya:** Berkas SubRip (`.srt`) tidak memiliki header `WEBVTT` dan menggunakan tanda koma untuk milidetik (`00:00:01,500`). Jika langsung dipasang ke `<track>`, seluruh cue tersebut akan diabaikan oleh peramban!
2. **Lupa menyertakan atribut `srclang` saat `kind="subtitles"`:** Spesifikasi HTML **mewajibkan** atribut `srclang` (kode bahasa BCP 47 yang valid seperti `"id"` atau `"en"`) apabila nilai `kind` adalah `"subtitles"`.
3. **Memuat `.vtt` dari domain CDN berbeda tanpa `crossorigin` pada `<video>`:** Berbeda dengan gambar atau video yang bisa dimuat lintas-origin secara bawaan, berkas `<track>` wajib mematuhi aturan *Same-Origin Policy*. Jika `.vtt` disimpan di CDN, tambahkan `crossorigin="anonymous"` pada `<video>` dan pastikan CDN mengirim header `Access-Control-Allow-Origin`.

## Latihan Praktik

Buatlah berkas `32-audio-video-dan-format-webvtt-track.html` beserta dua berkas `.vtt` pendamping:
1. Buat berkas `takarir.id.vtt` yang diawali `WEBVTT`, memuat satu blok komentar `NOTE`, dan berisi 3 cue percakapan dengan tag `<v>` serta deskripsi efek suara `[...]`.
2. Buat berkas `bab.id.vtt` yang berisi 3 rentang waktu bab materi.
3. Hubungkan kedua berkas tersebut ke dalam elemen `<video controls width="640" height="360">` menggunakan `<track kind="captions" default>` dan `<track kind="chapters">`, lalu tambahkan aturan CSS `video::cue` untuk mengatur warna latar takarir.

## Kuis Pemahaman

### Soal 1
Mengapa potongan waktu `00:01:12,500 --> 00:01:15,000` di dalam berkas `.vtt` gagal ditampilkan oleh elemen `<track>` di peramban?
- A. Karena tanda panah di WebVTT seharusnya ditulis `==>`
- B. Karena spesifikasi WebVTT mewajibkan tanda titik (`.`) sebagai pemisah milidetik (`00:01:12.500`), bukan tanda koma (`,`) seperti pada format SRT
- C. Karena durasi satu cue tidak boleh lebih dari 2 detik
- D. Karena WebVTT tidak mengizinkan angka jam `00:`

**Jawaban Benar:** B
**Penjelasan:** Dalam spesifikasi W3C WebVTT, pemisah antara detik dan pecahan milidetik wajib berupa tanda titik (`.`), misalnya `00:01:12.500 --> 00:01:15.000`.

### Soal 2
Atribut apakah yang **wajib** disertakan pada elemen `<track>` apabila atribut `kind` bernilai `"subtitles"` menurut spesifikasi WHATWG HTML?
- A. `autoplay`
- B. `srclang` (misalnya `srclang="id"` atau `srclang="en"`)
- C. `controls`
- D. `poster`

**Jawaban Benar:** B
**Penjelasan:** Spesifikasi HTML mewajibkan keberadaan atribut `srclang` dengan tag bahasa BCP 47 yang valid setiap kali `<track>` menggunakan `kind="subtitles"` agar peramban mengetahui bahasa terjemahan tersebut.

### Soal 3
Apa yang harus dilakukan jika berkas takarir `https://cdn.contoh.id/sub.vtt` dimuat oleh elemen `<video>` yang berada di halaman `https://kodeloka.asadinedu.com`?
- A. Mengubah ekstensi berkas `.vtt` menjadi `.js`
- B. Menambahkan atribut `crossorigin="anonymous"` pada elemen `<video>` dan memastikan server CDN mengirimkan header HTTP `Access-Control-Allow-Origin` yang sesuai
- C. Menempatkan tag `<track>` di dalam `<head>` dokumen
- D. Menghapus baris `WEBVTT` dari berkas takarir

**Jawaban Benar:** B
**Penjelasan:** Pemuatan berkas `<track>` tunduk pada kebijakan CORS. Untuk memuat `.vtt` lintas-origin, elemen media induknya (`<video>`) harus memiliki atribut `crossorigin` dan server penyedia berkas harus mengizinkan origin peminta melalui header CORS.

## Sumber
- [WebVTT API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)
- [Web Video Text Tracks Format (WebVTT) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API/Web_Video_Text_Tracks_Format)
- [`<track>` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track)
- [WebVTT: The Web Video Text Tracks Format — W3C](https://www.w3.org/TR/webvtt1/)
