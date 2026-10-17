# Interaksi Berkas Lokal, Papan Klip (`navigator.clipboard`), dan Drag and Drop API

- **Tingkat:** Menengah
- **Ringkasan:** Membaca dan menyalin teks atau data ke papan klip sistem secara asinkron dan aman menggunakan `navigator.clipboard.writeText()`, memproses berkas yang dipilih pengguna melalui `File` API & `URL.createObjectURL()`, serta membangun zona seret-dan-lepas (*Drag and Drop*).

## Mengapa API Papan Klip dan Berkas Lokal Dirancang dengan Pembatasan Keamanan Ketat?

Bayangkan jika sebuah situs web asing dapat secara diam-diam membaca isi papan klip (*clipboard*) Anda—yang mungkin sedang berisi kata sandi atau nomor rekening yang baru saja Anda salin—atau membaca berkas di hard disk komputer Anda tanpa izin. Demi melindungi privasi pengguna, peramban modern mewajibkan interaksi eksplisit pengguna (*transient user activation* seperti klik tombol, pemilihan `<input type="file">`, atau pelepasan berkas *drop*) serta koneksi aman (**HTTPS / `localhost`**) untuk menjalankan operasi papan klip dan berkas lokal.

> **⚠️ Jebakan Umum di Lapangan:** Membuat pratinjau gambar lokal dengan `URL.createObjectURL(file)` tanpa memanggil `URL.revokeObjectURL(objectUrl)` setelah gambar selesai dipakai akan menahan blob berkas tersebut di memori peramban sepanjang umur tab.

## 1. Perbandingan API Papan Klip, Berkas, dan Seret-Lepas

Berikut adalah ringkasan API standar yang digunakan untuk menangani penyalinan teks, pratinjau berkas lokal, dan zona seret-lepas:

| API / Metode | Kegunaan Utama | Syarat & Catatan Penting |
| :--- | :--- | :--- |
| `await navigator.clipboard.writeText(teks)` | Menyalin string teks ke papan klip sistem operasi secara asinkron (menggantikan `document.execCommand("copy")` yang sudah usang). | Wajib dipanggil di **Secure Context** (`https://` atau `localhost`) di dalam aksi pengguna (`click`/`keydown`). |
| `await navigator.clipboard.readText()` | Membaca teks dari papan klip sistem operasi. | Memunculkan dialog permintaan izin peramban kepada pengguna. |
| `URL.createObjectURL(file)` | Membuat URL lokal instan (`blob:https://...`) yang menunjuk langsung ke memori berkas tanpa perlu membaca seluruh isinya ke string Base64. | **Wajib** dibersihkan dengan `URL.revokeObjectURL(url)` saat tidak lagi dibutuhkan agar tidak membocorkan RAM. |
| `await file.text()` / `await file.arrayBuffer()` | Membaca isi berkas `File`/`Blob` secara asinkron berbasis `Promise` (lebih ringkas daripada `FileReader` lama). | Cocok untuk membaca berkas `.json`, `.csv`, atau `.md` yang dipilih pengguna di sisi klien. |
| `dragover` & `drop` (`e.dataTransfer.files`) | Menerima berkas yang diseret dari File Explorer/Finder ke area elemen HTML. | Event `dragover` **wajib** memanggil `e.preventDefault()` agar elemen diizinkan menjadi zona tujuan `drop`! |

## 2. Menyalin Kode ke Papan Klip dan Menampilkan Pratinjau Gambar Bebas Kebocoran Memori

Saat menampilkan pratinjau foto yang baru dipilih pengguna melalui `<input type="file">`, `URL.createObjectURL(file)` jauh lebih cepat dan hemat memori dibandingkan `FileReader.readAsDataURL()` (yang membengkakkan ukuran berkas menjadi string Base64 ~33% lebih besar). Pastikan untuk mencabut URL blob begitu gambar selesai dimuat (`onload`):

```javascript
export async function salinTeksKeClipboard(teks, elemenTombol) {
  try {
    await navigator.clipboard.writeText(teks);
    elemenTombol.textContent = "Tersalin!";
  } catch (err) {
    console.error("Gagal menyalin ke papan klip:", err);
  }
}

export function tampilkanPratinjauGambar(fileInput, imgTarget) {
  const [file] = fileInput.files ?? [];
  if (!file || !file.type.startsWith("image/")) return;
  const urlSementara = URL.createObjectURL(file);
  imgTarget.src = urlSementara;
  imgTarget.onload = () => URL.revokeObjectURL(urlSementara);
}
```

## 3. Membangun Zona Seret-dan-Lepas (*Drag and Drop*) Berkas yang Aksesibel

Banyak pengembang membuat zona *Drag and Drop* yang gagal menerima berkas karena satu alasan: ketika berkas dilepaskan di atas halaman web, perilaku bawaan peramban adalah **membuka berkas tersebut sebagai halaman baru** (meninggalkan aplikasi Anda!).

Untuk membuat zona tujuan pelepasan (*drop zone*) bekerja:
1. Anda **wajib** memanggil `e.preventDefault()` baik pada event **`dragover`** maupun pada event **`drop`**.
2. Selalu sediakan `<input type="file">` pendamping yang dapat diakses dengan papan ketik (`Tab` dan `Enter`/`Space`), karena pengguna papan ketik dan pembaca layar tidak dapat melakukan gerakan menyeret tetikus (*WCAG 2.1.1 Keyboard* & *2.5.7 Dragging Movements*):

```javascript
export function pasangZonaDropBerkas(elemenZona, onBerkasDiterima) {
  // 1. Wajib preventDefault pada dragover agar peramban mengizinkan aksi drop
  elemenZona.addEventListener("dragover", (e) => {
    e.preventDefault();
    elemenZona.classList.add("sedang-diseret");
  });

  elemenZona.addEventListener("dragleave", () => {
    elemenZona.classList.remove("sedang-diseret");
  });

  // 2. Wajib preventDefault pada drop agar peramban tidak membuka berkas di tab
  elemenZona.addEventListener("drop", (e) => {
    e.preventDefault();
    elemenZona.classList.remove("sedang-diseret");
    const daftarBerkas = [...(e.dataTransfer?.files ?? [])];
    if (daftarBerkas.length > 0) {
      onBerkasDiterima(daftarBerkas);
    }
  });
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Hanya memasang pendengar event `drop` tanpa mencegah bawaan `dragover`:** Menurut spesifikasi HTML Drag and Drop, elemen DOM secara bawaan **bukanlah** target pelepasan yang valid. Tanpa `e.preventDefault()` di dalam event `dragover`, event `drop` tidak akan pernah dipicu sama sekali!
2. **Memanggil `navigator.clipboard.writeText()` di situs `http://` (bukan HTTPS):** Objek `navigator.clipboard` bernilai `undefined` pada konteks yang tidak aman (`window.isSecureContext === false`).
3. **Membuat zona *Drag and Drop* berupa `<div>` murni tanpa `<input type="file">` atau tombol pemilih berkas:** Ini membuat fitur unggah berkas sama sekali tidak bisa digunakan di ponsel maupun oleh pengguna papan ketik.

## Latihan Praktik Mandiri

1. Buat halaman atau modul yang menggabungkan `<label>` + `<input type="file" accept=".json,application/json">` di dalam sebuah zona *Drag and Drop* (` pasangZonaDropBerkas`).
2. Saat berkas `.json` dipilih atau dijatuhkan ke zona tersebut, baca isinya menggunakan metode modern `const teks = await file.text()`, format ulang dengan `JSON.stringify(JSON.parse(teks), null, 2)`, dan tampilkan di dalam elemen `<pre>`.
3. Sediakan tombol "Salin JSON" yang memanggil `await navigator.clipboard.writeText(...)` dan mengubah teks tombol menjadi `"Tersalin!"` selama 2 detik.

## Kuis Pemahaman

### Soal 1
Mengapa setelah menampilkan pratinjau berkas lokal pada elemen `<img>` menggunakan `const url = URL.createObjectURL(file)`, Anda perlu memanggil `URL.revokeObjectURL(url)` (misalnya di dalam `img.onload` atau saat komponen dihapus)?
- A. Agar gambar otomatis diunggah ke server
- B. Karena peramban menyimpan pemetaan URL `blob:` tersebut dan menahan objek berkas di memori RAM sepanjang umur dokumen sampai halaman ditutup atau dicabut secara eksplisit dengan `URL.revokeObjectURL()`
- C. Karena tanpa `revokeObjectURL()`, gambar akan tampil terbalik
- D. Untuk mengubah gambar menjadi format SVG

**Jawaban Benar:** B
**Penjelasan:** Setiap pemanggilan `URL.createObjectURL()` menahan referensi memori ke `Blob`/`File` yang mendasarinya. Memanggil `URL.revokeObjectURL()` membebaskan referensi tersebut agar dapat dibersihkan oleh *Garbage Collector*.

### Soal 2
Pada pembuatan zona seret-dan-lepas (*Drag and Drop*) berkas, mengapa Anda **wajib** memanggil `event.preventDefault()` di dalam pendengar event `dragover` sekaligus `drop`?
- A. Karena tanpa `preventDefault()` pada `dragover`, peramban menganggap elemen tersebut bukan zona pelepasan yang diizinkan sehingga event `drop` tidak akan terpicu; dan tanpa `preventDefault()` pada `drop`, peramban akan langsung membuka berkas yang dijatuhkan sebagai halaman baru
- B. Untuk mematikan kursor tetikus pengguna
- C. Agar berkas otomatis terkompresi menjadi `.zip`
- D. Karena `dragover` hanya bekerja pada elemen `<canvas>`

**Jawaban Benar:** A
**Penjelasan:** Spesifikasi HTML menetapkan perilaku bawaan `dragover` adalah menolak pelepasan (*reset current drag operation to "none"*). Membatalkannya dengan `e.preventDefault()` menandakan elemen siap menerima `drop`, dan `e.preventDefault()` pada `drop` mencegah peramban menavigasi tab ke berkas lokal tersebut.

### Soal 3
Apa syarat lingkungan keamanan peramban agar `navigator.clipboard.writeText()` dapat dipanggil?
- A. Halaman harus dimuat melalui protokol tidak terenkripsi `http://`
- B. Halaman harus berjalan di dalam **Secure Context** (`https://` atau `localhost`) dan dipicu oleh interaksi pengguna aktif (seperti klik tombol)
- C. Pengguna wajib mematikan fitur JavaScript terlebih dahulu
- D. Harus dipanggil di dalam `Web Worker`

**Jawaban Benar:** B
**Penjelasan:** Clipboard API hanya diekspos pada konteks aman (`window.isSecureContext === true`, yaitu HTTPS atau `localhost`) dan penulisan ke papan klip memerlukan aktivasi pengguna (*transient user activation*).

## Sumber

- [Clipboard API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [Using files from web applications — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications)
- [HTML Drag and Drop API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
