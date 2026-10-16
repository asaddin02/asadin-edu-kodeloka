# Ekspresi Reguler (`RegExp`) Modern, Named Capture Groups, dan Pencegahan ReDoS

- **Tingkat:** Menengah
- **Ringkasan:** Memvalidasi, mencari, dan mengekstrak pola teks kompleks menggunakan `RegExp` modern (flag `g`, `i`, `u`, `v`), *Named Capture Groups* `(?<nama>...)`, metode `matchAll()` dan `replaceAll()`, serta menghindari celah *Regular Expression Denial of Service (ReDoS)*.

## Kapan Menggunakan Metode String Biasa vs `RegExp`?

Untuk pemeriksaan sederhana—seperti mengecek apakah kalimat diawali kata tertentu atau mengandung potongan kata tetap—selalu utamakan metode `String` biasa yang cepat dan mudah dibaca: **`teks.includes()`**, **`teks.startsWith()`**, **`teks.endsWith()`**, dan **`teks.replaceAll("lama", "baru")`**.

Gunakan **Regular Expressions (`RegExp`)** ketika Anda berhadapan dengan **pola yang bervariasi**—seperti mengekstrak tanggal `YYYY-MM-DD` dari log server, memvalidasi format nomor induk/kode produk, atau mencari seluruh tag `#topik` di dalam artikel.

## 1. Sintaks Dasar, Kelas Karakter, dan Kuantifier

Sebuah pola `RegExp` dapat ditulis sebagai literal `/pola/flags` atau lewat konstruktor `new RegExp("pola", "flags")`:

| Token Pola | Arti Pencocokan | Contoh |
|---|---|---|
| `\d` / `\D` | Satu digit angka (`0–9`) / Bukan digit angka | `\d{4}` cocok dengan `"2026"` |
| `\w` / `\W` | Karakter kata ASCII (`a-z`, `A-Z`, `0-9`, `_`) / Bukan karakter kata | `\w+` cocok dengan `"user_01"` |
| `\s` / `\S` | Spasi putih (spasi, tab, baris baru) / Bukan spasi | `\s+` cocok dengan spasi ganda |
| `\p{L}` (dengan flag `u`/`v`) | **Huruf Unicode apa pun** dari bahasa mana pun di dunia! | `/^\p{L}+$/u` cocok dengan huruf Latin maupun aksara non-Latin |
| `^` dan `$` | Jangkar awal string (`^`) dan akhir string (`$`) | `/^\d{6}$/` memastikan seluruh string tepat 6 digit |
| `+`, `*`, `?` | `1` atau lebih (`+`), `0` atau lebih (`*`), opsional `0` atau `1` (`?`) | `https?` cocok dengan `"http"` dan `"https"` |
| `{n,m}` | Jumlah pengulangan minimal `n` kali dan maksimal `m` kali | `[a-z]{3,10}` |

### Bendera (*Flags*) Penting pada RegExp Modern
- **`i` (*ignoreCase*):** Mengabaikan perbedaan huruf besar dan kecil.
- **`g` (*global*):** Mencari seluruh kemunculan di dalam teks, bukan berhenti pada kecocokan pertama saja.
- **`u` (*unicode*) / `v` (*unicodeSets* — Baseline Newly Available sejak 2024):** Mengaktifkan dukungan penuh karakter UTF-16/emoji dan properti karakter Unicode `\p{...}`!

## 2. Mengekstrak Data Terstruktur dengan *Named Capture Groups* (`(?<nama>...)`)

Dulu, mengekstrak bagian tanggal dari regex `/(\d{4})-(\d{2})-(\d{2})/` mengharuskan kita mengakses indeks angka `hasil[1]`, `hasil[2]`, `hasil[3]` yang membingungkan jika urutan grup diubah.

Dengan **Named Capture Groups (`(?<namaGrup>...)`)** (status **Baseline Widely Available**), hasil tangkapan langsung tersedia sebagai objek bernama di dalam properti **`.groups`**:

```js
const polaLog = /^\[(?<tanggal>\d{4}-\d{2}-\d{2})\]\s+(?<tingkat>INFO|WARN|ERROR):\s+(?<pesan>.+)$/;

const barisLog = "[2026-10-16] ERROR: Koneksi ke PostgreSQL terputus";
const cocok = polaLog.exec(barisLog);

if (cocok) {
  const { tanggal, tingkat, pesan } = cocok.groups;
  console.log({ tanggal, tingkat, pesan });
  // { tanggal: "2026-10-16", tingkat: "ERROR", pesan: "Koneksi ke PostgreSQL terputus" }
}
```

## 3. Mencari Banyak Kecocokan Sekaligus dengan `String.prototype.matchAll()`

Jika Anda ingin mengekstrak semua kemunculan pola beserta grup tangkapannya di dalam sebuah teks panjang, jangan lagi menulis perulangan `while ((m = regex.exec(teks)) !== null)`! Gunakan **`teks.matchAll(regexGlobal)`** (wajib menyertakan flag `g`):

```js
const teksArtikel = "Pelajari #html, #css, dan #javascript di Kodeloka!";
const polaTagar = /#(?<topik>[a-z0-9_-]+)/gi;

// matchAll() mengembalikan iterator yang bisa langsung diubah menjadi Array atau di-for...of
const daftarTopik = Array.from(
  teksArtikel.matchAll(polaTagar),
  (m) => m.groups.topik.toLowerCase()
);

console.log(daftarTopik); // ["html", "css", "javascript"]
```

## 4. Bahaya Keamanan *Catastrophic Backtracking (ReDoS)*

Hati-hati saat menulis kuantifier yang bersarang di dalam grup kuantifier lain—seperti **`/(a+)+$/`** atau **`/^([a-zA-Z0-9]+\s?)+$/`**!

Mengapa pola seperti `/(a+)+$/` sangat berbahaya?
Jika penyerang mengirimkan string berisi 30 huruf `"a"` yang diakhiri tanda seru (`"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!"`), mesin regex akan mencoba jutaan kombinasi pembagian grup `(a+)+` sebelum menyadari bahwa karakter terakhir bukan `"a"`. Akibatnya, **utas utama JavaScript (atau server Node.js) langsung membeku 100% CPU selama beberapa menit (*Regular Expression Denial of Service / ReDoS*)**!

> **🚫 Tiga Cara Mencegah ReDoS:**
> 1. **Jangan pernah membuat grup dengan `+` atau `*` yang di dalamnya juga terdapat `+` atau `*` yang saling tumpang tindih** (ganti `/(a+)+$/` menjadi `/a+$/` yang sederhana dan linier!).
> 2. **Batasi panjang string masukan (`if (input.length > 500) throw ...`)** sebelum mengujinya dengan regex.
> 3. Gunakan kuantifier spesifik yang jelas batasannya (seperti `{1,64}`) alih-alih `+` tak terbatas pada input publik.

## Latihan Praktik: Pengurai Versi Semantik (SemVer) dengan Named Capture Groups

Buatlah berkas `regex-semver.js` dan jalankan dengan Node.js:
1. Buat fungsi `uraiVersi(teksVersi)` yang menggunakan regex dengan *Named Capture Groups* `(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)(?:-(?<prarelis>[0-9A-Za-z.-]+))?` yang terjangkar dengan `^` dan `$`.
2. Kembalikan objek `{ major: Number(...), minor: Number(...), patch: Number(...), prarelis: ... }` atau `null` jika formatnya tidak sah (misalnya `"8.5.0-rc.1"` sah, sedangkan `"v8.5"` tidak sah).

## Kuis Pemahaman

### Soal 1
Manakah keuntungan utama menggunakan *Named Capture Groups* `/(?<tahun>\d{4})-(?<bulan>\d{2})/` dibandingkan grup tangkapan tanpa nama `/(\d{4})-(\d{2})/`?
- A. Membuat eksekusi regex berjalan 10 kali lebih cepat.
- B. Hasil ekstraksi dapat diakses langsung melalui nama properti yang deskriptif pada `hasil.groups.tahun` dan `hasil.groups.bulan`, sehingga kode lebih mudah dibaca dan tidak rusak apabila urutan atau jumlah grup di dalam regex berubah.
- C. Menghilangkan kebutuhan penggunaan tanda garis miring `/`.
- D. Mengubah hasil tangkapan menjadi tipe `Number` secara otomatis.

**Jawaban Benar:** B
**Penjelasan:** Dengan *Named Capture Groups*, setiap tangkapan dipetakan ke dalam objek `match.groups` sesuai namanya, menggantikan ketergantungan pada indeks angka `match[1]`, `match[2]` yang rawan bergeser saat pola dimodifikasi.

### Soal 2
Syarat apakah yang wajib dipenuhi oleh objek `RegExp` yang dikirimkan sebagai argumen ke metode `teks.matchAll(regex)`?
- A. Regex tersebut wajib memiliki bendera global (`g`), jika tidak `matchAll()` akan melempar `TypeError`.
- B. Regex tersebut tidak boleh memiliki grup tangkapan `(...)`.
- C. Regex tersebut hanya boleh berisi huruf kecil.
- D. Regex tersebut harus dibuat menggunakan `new RegExp()`.

**Jawaban Benar:** A
**Penjelasan:** Spesifikasi ECMAScript mewajibkan argumen `RegExp` pada `String.prototype.matchAll()` memiliki flag `g` (*global*); memanggil `matchAll()` dengan regex non-global akan langsung melempar `TypeError`.

### Soal 3
Apa penyebab terjadinya kerentanan *Regular Expression Denial of Service (ReDoS)* pada pola seperti `/^([a-z]+)+$/`?
- A. Penggunaan kelas karakter `[a-z]`.
- B. Kuantifier berulang yang bersarang (`+` di dalam `+`) menyebabkan ledakan kombinasi jalur pencocokan secara eksponensial (*catastrophic backtracking*) ketika diberi string panjang yang gagal cocok di bagian akhir, sehingga membekukan utas tunggal JavaScript.
- C. Penggunaan jangkar `^` dan `$`.
- D. Tidak adanya flag `i`.

**Jawaban Benar:** B
**Penjelasan:** Mesin RegExp berbasis *backtracking* akan mencoba semua kemungkinan cara memecah string di antara kuantifier dalam dan luar sebelum menyerah. Menghindari kuantifier bersarang yang ambigu dan membatasi panjang input sebelum validasi regex adalah kunci pencegahan ReDoS.

## Sumber
- [Regular expressions — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Text Processing (`RegExp` and `String`) — TC39 ECMAScript Specification](https://tc39.es/ecma262/multipage/text-processing.html)
