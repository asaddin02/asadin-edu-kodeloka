# Streams API: Memproses Aliran Data Besar dengan `ReadableStream` dan `TransformStream`

- **Tingkat:** Lanjut
- **Ringkasan:** Memproses unduhan jaringan atau berkas berukuran gigabyte secara bertahap (*chunk-by-chunk*) tanpa menghabiskan RAM peramban menggunakan Web Streams API (`ReadableStream`, `WritableStream`, `TransformStream`, `pipeThrough`, dan `CompressionStream`).

## Mengapa Memproses Berkas Raksasa dengan `await response.text()` Dapat Membekukan Tab Peramban?

Ketika Anda mengunduh berkas log server berukuran 250 MB atau menerima aliran respons *streaming* dari API menggunakan `const teks = await response.text()`, peramban terpaksa menunggu **seluruh 250 MB selesai diunduh** dan menampung semuanya sekaligus di dalam memori RAM sebelum baris pertama dapat ditampilkan ke layar!

**Web Streams API** memecahkan masalah ini dengan membagi data menjadi potongan-potongan kecil (*chunks*) yang mengalir melalui tiga primitif utama:
1. **`ReadableStream`:** Sumber aliran data yang dapat dibaca potongan demi potongan (seperti `response.body` dari `fetch()` atau `file.stream()` dari `Blob`/`File`).
2. **`TransformStream`:** Pipa tengah yang menerima potongan data di sisi `writable`, mengubahnya (misalnya mendekode byte ke teks dengan `TextDecoderStream` atau mengompresi GZIP dengan `CompressionStream`), lalu meneruskannya ke sisi `readable`.
3. **`WritableStream`:** Tujuan akhir tempat potongan data ditulis, lengkap dengan sinyal pengendali kecepatan otomatis (**Backpressure**) agar pengirim tidak membanjiri penerima yang lebih lambat.

> **⚠️ Jebakan Umum di Lapangan:** Memanggil `await response.text()` atau `await response.arrayBuffer()` pada berkas berukuran ratusan megabyte akan memaksa peramban menahan seluruh isi berkas sekaligus di memori utama sebelum baris pertama dapat diproses.

## 1. Peta Ekosistem Web Streams API dan TransformStream Bawaan

Berikut adalah komponen-komponen utama dalam ekosistem Streams API yang tersedia baik di peramban modern maupun di Node.js/Deno/Bun:

| Komponen / Metode | Fungsi Utama | Contoh Penggunaan |
| :--- | :--- | :--- |
| `response.body` / `blob.stream()` | Menghasilkan `ReadableStream` berisi potongan byte (`Uint8Array`). | Membaca unduhan `fetch()` atau berkas lokal secara bertahap. |
| `readable.pipeThrough(transform)` | Mengalirkan `ReadableStream` melewati sebuah `TransformStream` dan mengembalikan `ReadableStream` baru. | `res.body.pipeThrough(new TextDecoderStream())` |
| `readable.pipeTo(writable, { signal })` | Mengalirkan seluruh isi `ReadableStream` ke `WritableStream` hingga tuntas (mengembalikan `Promise`). | Menyimpan aliran ke tujuan akhir dengan dukungan pembatalan `AbortSignal`. |
| `new TextDecoderStream()` / `TextEncoderStream()` | `TransformStream` bawaan untuk mengubah aliran `Uint8Array` ↔ `string` UTF-8 (menangani karakter multi-byte yang terpotong di batas *chunk*!). | Mengurai aliran teks atau NDJSON (*Newline-Delimited JSON*). |
| `new CompressionStream("gzip")` / `DecompressionStream("gzip")` | `TransformStream` bawaan untuk mengompresi atau mengekstrak aliran data dengan format `"gzip"`, `"deflate"`, atau `"deflate-raw"`. | Mengompresi laporan besar di sisi klien sebelum diunggah. |

## 2. Membaca Aliran Teks dengan `TextDecoderStream` dan `for await...of`

Objek `ReadableStream` modern mengimplementasikan protokol `AsyncIterable` (`[Symbol.asyncIterator]`), sehingga Anda dapat membacanya langsung menggunakan perulangan **`for await (const potongan of stream)`**:

```javascript
export async function bacaAliranBaris(url, sinyalBatal) {
  const res = await fetch(url, { signal: sinyalBatal });
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

  // Mengubah aliran byte (Uint8Array) menjadi aliran string UTF-8 secara aman
  const teksStream = res.body.pipeThrough(new TextDecoderStream());
  let sisaBaris = "";
  let totalBaris = 0;

  for await (const potonganTeks of teksStream) {
    const gabungan = sisaBaris + potonganTeks;
    const baris = gabungan.split("\n");
    // Simpan elemen terakhir karena mungkin belum bertemu '\n' di chunk berikutnya
    sisaBaris = baris.pop() ?? "";
    for (const satuBaris of baris) {
      if (satuBaris.trim()) totalBaris += 1;
    }
  }
  if (sisaBaris.trim()) totalBaris += 1;
  return totalBaris;
}
```

## 3. Membuat `TransformStream` Kustom dan Mengompresi dengan `CompressionStream`

Anda juga dapat menyusun `TransformStream` kustom (misalnya untuk mengubah setiap potongan teks menjadi huruf besar atau mengurai objek JSON per baris) lalu menggabungkannya dengan `CompressionStream`:

```javascript
export function buatTransformHurufBesar() {
  return new TransformStream({
    transform(potongan, controller) {
      controller.enqueue(String(potongan).toUpperCase());
    }
  });
}

export async function kompresiTeksGzip(teks) {
  const aliranMasuk = new Blob([teks]).stream();
  const aliranTeruji = aliranMasuk.pipeThrough(new CompressionStream("gzip"));
  // Kumpulkan kembali menjadi Uint8Array melalui objek Response
  return new Uint8Array(await new Response(aliranTeruji).arrayBuffer());
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Mendekode tiap potongan `Uint8Array` di dalam aliran menggunakan `new TextDecoder().decode(chunk)` tanpa opsi `{ stream: true }`:** Jika sebuah karakter emoji 4-byte UTF-8 terbelah di antara akhir *chunk* ke-1 (2 byte pertama) dan awal *chunk* ke-2 (2 byte sisanya), pemanggilan `.decode(chunk)` biasa akan merusak karakter tersebut menjadi ``! Gunakan `.pipeThrough(new TextDecoderStream())` yang otomatis menyangga byte yang terpotong antar-*chunk*.
2. **Mencoba membaca satu `ReadableStream` yang sama dari dua pembaca berbeda (*Stream Locked*):** Sebuah `ReadableStream` hanya bisa dikunci oleh satu pembaca atau satu pipa pada satu waktu. Jika Anda benar-benar perlu mengalirkan satu sumber ke dua tujuan sekaligus, panggil **`const [cabang1, cabang2] = stream.tee()`** (namun hati-hati: jika salah satu cabang lambat dibaca, seluruh selisih data akan menumpuk di memori!).
3. **Mengasumsikan satu kali iterasi `chunk` sama dengan satu baris teks utuh:** Ukuran *chunk* ditentukan oleh paket jaringan TCP/HTTP dan bisa memotong kalimat di tengah kata. Selalu simpan sisa potongan setelah `\n` terakhir ke dalam variabel penyangga (*buffer*) untuk digabungkan dengan *chunk* berikutnya.

## Latihan Praktik Mandiri

1. Buat berkas `ndjson-stream.mjs` yang mengekspor fungsi `buatTransformNdjson()` menggunakan `TransformStream`: menerima potongan string dari `TextDecoderStream`, memecahnya per baris `\n`, mengurai tiap baris dengan `JSON.parse()`, dan meneruskan objek hasilnya lewat `controller.enqueue()`.
2. Uji pipa `ReadableStream.from(["{"id":1}\n{"i", "d":2}\n"])` yang dialirkan melewati `buatTransformNdjson()` menggunakan `node:test` untuk membuktikan bahwa baris JSON yang terpotong di tengah dua *chunk* tetap berhasil diurai menjadi 2 objek utuh.

## Kuis Pemahaman

### Soal 1
Mengapa mengalirkan `response.body` melalui `.pipeThrough(new TextDecoderStream())` lebih aman daripada memanggil `new TextDecoder().decode(chunk)` secara terpisah pada setiap potongan byte?
- A. Karena `TextDecoderStream` berjalan di kartu grafis (GPU)
- B. Karena karakter Unicode multi-byte (seperti emoji 4-byte UTF-8) dapat terbelah di perbatasan antara dua *chunk* jaringan; `TextDecoderStream` secara otomatis menahan byte yang belum lengkap hingga *chunk* berikutnya tiba sehingga karakter tidak rusak
- C. Karena `TextDecoder` biasa tidak mendukung bahasa Indonesia
- D. Karena `TextDecoderStream` otomatis mengurai string menjadi objek JSON

**Jawaban Benar:** B
**Penjelasan:** Potongan byte dari jaringan dapat terputus di tengah urutan multi-byte UTF-8. `TextDecoderStream` (sama seperti `decoder.decode(chunk, { stream: true })`) menjaga status internal antar-*chunk* agar karakter multi-byte tetap utuh.

### Soal 2
Apa yang terjadi jika Anda mencoba memanggil `stream.getReader()` atau `stream.pipeTo(...)` untuk kedua kalinya pada sebuah `ReadableStream` yang sedang dikonsumsi oleh pembaca pertama?
- A. Stream otomatis menggandakan dirinya tanpa batas
- B. Mesin JavaScript melempar `TypeError` karena `ReadableStream` tersebut sedang terkunci (*locked*) oleh pembaca pertama; jika ingin mencabangkan aliran menjadi dua, gunakan `stream.tee()` terlebih dahulu
- C. Pembaca pertama otomatis dihentikan tanpa pesan
- D. Stream kembali ke byte pertama secara otomatis

**Jawaban Benar:** B
**Penjelasan:** Sebuah `ReadableStream` memiliki properti `stream.locked === true` selama sedang terhubung ke `ReadableStreamDefaultReader` atau pipa `pipeThrough`/`pipeTo`.

### Soal 3
Apa yang dimaksud dengan mekanisme **Backpressure** di dalam Web Streams API saat menghubungkan aliran dengan `readable.pipeTo(writable)`?
- A. Teknik mengompresi ukuran gambar menjadi 50% lebih kecil
- B. Sinyal umpan balik otomatis dari tujuan (`WritableStream`) yang lambat kepada sumber (`ReadableStream`) yang cepat agar sumber menahan atau memperlambat pengiriman *chunk* berikutnya sehingga antrean tidak meluap di memori RAM
- C. Cara menghapus cache di Service Worker
- D. Metode untuk membalik urutan byte dari akhir ke awal

**Jawaban Benar:** B
**Penjelasan:** *Backpressure* memastikan keseimbangan laju aliran data: ketika antrean internal `WritableStream` atau `TransformStream` penuh (`desiredSize <= 0`), `pipeTo` menahan penarikan (`pull`) dari sumber hingga konsumen siap menerima data lagi.

## Sumber

- [Streams API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
- [Using readable streams — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams)
