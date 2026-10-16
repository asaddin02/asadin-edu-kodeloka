# Keluaran Aman (*Contextual Output Escaping*), Pencegahan XSS, dan Header Keamanan HTTP

- **Tingkat:** Menengah
- **Ringkasan:** Mencegah celah *Cross-Site Scripting (XSS)* dengan menerapkan pengodean keluaran sesuai konteks penempatannya (HTML body, atribut HTML, blok JavaScript, parameter URL), serta memperkuat pertahanan dengan header HTTP keamanan.

## Mengapa Satu Cara Escaping Saja Tidak Cukup untuk Semua Konteks?

**Cross-Site Scripting (XSS)** terjadi ketika data dinamis yang berasal dari luar (input pengguna, database, atau API pihak ketiga) dicetak ke dalam halaman web sedemikian rupa sehingga peramban menafsirkannya sebagai **instruksi kode yang harus dijalankan**, bukan sebagai teks data biasa.

Kunci utama pencegahan XSS menurut [OWASP Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) adalah **Contextual Output Encoding**: cara Anda mengodekan keluaran bergantung pada **di bagian mana dari dokumen** variabel tersebut disisipkan!

```text
Di Mana Variabel Dicetak?                       Fungsi Pengaman yang Wajib Dipakai di PHP
─────────────────────────────────────────────   ──────────────────────────────────────────────────────
1. Di dalam Isi Elemen HTML (<p>INI</p>)     ──> htmlspecialchars($val, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')
2. Di dalam Atribut Berkutip ("INI")    ──> htmlspecialchars($val, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')
3. Di dalam Nilai Variabel JS (<script>)     ──> json_encode($val, JSON_HEX_TAG | JSON_HEX_AMP | ...)
4. Di dalam Parameter Query URL (?q=INI)     ──> rawurlencode($val) atau http_build_query([...])
5. Di dalam Atribut URL (href="INI")         ──> Validasi skema protokol ('https'/'http') + htmlspecialchars()
```

## 1. Konteks 1 & 2: Teks Elemen HTML dan Atribut HTML (`htmlspecialchars`)

Buat satu fungsi pembantu (*helper*) pendek `e()` yang selalu siap dipanggil di seluruh templat tampilan Anda:

```php
<?php

declare(strict_types=1);

function e(string|int|float|null $nilai): string
{
    return htmlspecialchars(
        string: (string) $nilai,
        flags: ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5,
        encoding: 'UTF-8',
    );
}
```

### Mengapa Ketiga Argumen `htmlspecialchars()` Tersebut Penting?
1. **`ENT_QUOTES`:** Memastikan bahwa baik tanda kutip ganda (`"` → `&quot;`) **maupun tanda kutip tunggal (`'` → `&apos;` pada ENT_HTML5 / `&#039;` pada HTML 4.01)** sama-sama diubah menjadi entitas aman!
2. **`ENT_SUBSTITUTE`:** Jika di dalam string terdapat urutan byte UTF-8 yang rusak/tidak valid, daripada fungsi gagal dan mengembalikan string kosong `""` secara tiba-tiba, `ENT_SUBSTITUTE` mengganti byte rusak tersebut dengan simbol karakter pengganti Unicode `U+FFFD` (�) yang aman!
3. **`'UTF-8'`:** Menjamin fungsi mengurai batas karakter multibyte sesuai pengodean UTF-8 dokumen Anda.

> **🚫 Tiga Konteks HTML yang TIDAK Boleh Diisi Data Pengguna Meskipun Sudah Di-`htmlspecialchars()`:**
> 1. **Atribut Tanpa Tanda Kutip (`<input value=<?= e($x) ?>>`):** Selalu bungkus nilai atribut dengan tanda kutip ganda (`value="<?= e($x) ?>"`), karena `htmlspecialchars()` tidak mengubah karakter spasi!
> 2. **Atribut Event Handler (`onclick="..."`, `onload="..."`, `onerror="..."`):** Jangan pernah menyisipkan data pengguna ke dalam atribut `on*`! Gunakan atribut `data-*` (`data-nama="<?= e($nama) ?>"`) lalu baca dari JavaScript menggunakan `elemen.dataset.nama`.
> 3. **Nama Tag atau Nama Atribut (`<<?= e($tag) ?>>`):** Jika nama tag harus dinamis (misalnya memilih antara `h2` atau `h3`), wajib saring dengan daftar putih `match ($level) { 2 => 'h2', default => 'h3' }`.

## 2. Konteks 3: Menyisipkan Data PHP ke Dalam JavaScript (`json_encode`)

Jika Anda perlu mengirimkan objek konfigurasi atau data awal dari PHP ke variabel JavaScript di dalam `<script>`, **jangan menggunakan `htmlspecialchars()`** (karena di dalam blok `<script>`, peramban tidak menerjemahkan `&quot;` kembali menjadi tanda kutip!).

Sebaliknya, gunakan **`json_encode()` dengan empat bendera `JSON_HEX_*`** atau letakkan datanya di dalam atribut `data-*` pada elemen HTML:

```php
<?php

declare(strict_types=1);

function jsonUntukScript(mixed $data): string
{
    return json_encode(
        value: $data,
        flags: JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_THROW_ON_ERROR,
    );
}

$profilAwal = [
    'nama' => 'Budi </script><script>alert(1)</script>',
    'peran' => 'peserta',
];
?>
<!-- Cara A: Menggunakan jsonUntukScript() dengan JSON_HEX_TAG -->
<script>
  const PROFIL = <?= jsonUntukScript($profilAwal) ?>;
  console.log(PROFIL.nama);
</script>

<!-- Cara B (Lebih Bersih & Ramah CSP Strict!): Simpan di atribut data-* lalu baca dengan JSON.parse() -->
<div id="data-awal" data-profil="<?= e(json_encode($profilAwal, JSON_THROW_ON_ERROR)) ?>" hidden></div>
<script src="/assets/app.js" defer></script>
```

Perhatikan **Cara B** di atas: dengan menaruh JSON di dalam atribut `data-profil="..."` yang di-escape dengan `e()`, halaman Anda **tidak membutuhkan blok `<script>` inline sama sekali**, sehingga Anda dapat mengaktifkan kebijakan `Content-Security-Policy: script-src 'self'` yang paling ketat!

## 3. Konteks 4 & 5: Membangun Tautan URL yang Aman (`http_build_query` & Validasi Skema)

1. **Saat menyisipkan parameter ke dalam query URL:** Gunakan **`http_build_query()`** atau **`rawurlencode()`**, lalu bungkus keseluruhan URL dengan **`e()`** saat dimasukkan ke dalam atribut `href="..."`:
   ```php
   <?php
   $urlPencarian = '/cari?' . http_build_query([
       'q' => 'C++ & PHP 8.5',
       'urut' => 'terbaru',
   ]);
   ?>
   <a href="<?= e($urlPencarian) ?>">Cari Materi</a>
   ```
2. **Saat seluruh URL berasal dari input pengguna (misalnya tautan situs web profil):**
   `htmlspecialchars("javascript:alert(1)")` tetap menghasilkan `"javascript:alert(1)"` karena tidak mengandung karakter `<`, `>`, atau `"`! Oleh karena itu, **wajib periksa bahwa skema URL hanya boleh `'https'` atau `'http'`** terlebih dahulu:
   ```php
   <?php

   declare(strict_types=1);

   function bersihkanUrlProfil(string $urlInput): ?string
   {
       $url = trim($urlInput);
       if (!filter_var($url, FILTER_VALIDATE_URL)) {
           return null;
       }

       $skema = strtolower((string) parse_url($url, PHP_URL_SCHEME));
       if ($skema !== 'https' && $skema !== 'http') {
           return null; // Menolak 'javascript:', 'data:', 'vbscript:', dll.
       }

       return $url;
   }
   ```

## 4. Memperkuat Respons dengan Header Keamanan HTTP (`header()`)

Sebagai pertahanan berlapis di setiap respons halaman HTML, kirimkan header keamanan HTTP berikut sebelum mencetak output:

```php
<?php

declare(strict_types=1);

function kirimHeaderKeamananHtml(): void
{
    header('Content-Type: text/html; charset=utf-8');
    // Mencegah peramban menebak-nebak (MIME-sniffing) berkas teks menjadi skrip yang bisa dijalankan
    header('X-Content-Type-Options: nosniff');
    // Mencegah halaman disematkan di dalam <iframe> situs lain (Anti-Clickjacking)
    header('X-Frame-Options: DENY');
    // Mengendalikan informasi Referer saat pengguna mengeklik tautan keluar
    header('Referrer-Policy: strict-origin-when-cross-origin');
    // Membatasi sumber skrip hanya dari domain sendiri (Anti-XSS berlapis!)
    header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; frame-ancestors 'none'; base-uri 'self'");
}
```

## Latihan Praktik: Membuat Kelas Pembantu Template yang Aman Kontekstual

Buatlah berkas `TemplateAman.php` yang menyediakan tiga metode statis:
1. `TemplateAman::teks(string|int|float|null $val): string` (menggunakan `htmlspecialchars`).
2. `TemplateAman::json(mixed $data): string` (menggunakan `json_encode` dengan `JSON_HEX_*`).
3. `TemplateAman::url(string $url): string` (memvalidasi protokol `http`/`https` dan mengembalikan `'#'` jika berbahaya, lalu di-escape dengan `teks()`).
4. Uji ketiga metode tersebut dengan muatan uji `<script>alert(1)</script>` dan `javascript:alert(1)`.

## Kuis Pemahaman

### Soal 1
Mengapa memanggil `htmlspecialchars("javascript:alert(document.cookie)", ENT_QUOTES, 'UTF-8')` lalu menaruh hasilnya di dalam `<a href="...">` **tidak** mencegah terjadinya serangan XSS saat tautan diklik?
- A. Karena `htmlspecialchars()` tidak mendukung pengodean UTF-8.
- B. Karena string `"javascript:alert(document.cookie)"` sama sekali tidak mengandung karakter `<`, `>`, `&`, `"`, maupun `'`, sehingga diloloskan utuh oleh `htmlspecialchars()` dan dieksekusi oleh peramban sebagai pseudo-protokol JavaScript ketika tautan diklik; untuk atribut `href`/`src`, kita wajib memvalidasi bahwa skema protokolnya hanya `https:` atau `http:`.
- C. Karena tag `<a>` tidak memproses entitas HTML.
- D. Karena `ENT_QUOTES` hanya bekerja di dalam `<input>`.

**Jawaban Benar:** B
**Penjelasan:** `htmlspecialchars()` mencegah keluarnya teks dari konteks atribut HTML, tetapi untuk atribut yang menerima URL (`href`, `src`, `action`), nilai atribut itu sendiri dievaluasi oleh peramban sebagai protokol navigasi. Oleh karena itu, validasi daftar putih protokol (`http`/`https`) wajib dilakukan sebelum *HTML escaping*.

### Soal 2
Apa fungsi dari bendera `ENT_SUBSTITUTE` pada pemanggilan `htmlspecialchars($teks, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')`?
- A. Mengganti semua spasi menjadi tanda hubung `-`.
- B. Mengganti urutan byte karakter UTF-8 yang tidak valid dengan karakter pengganti Unicode `U+FFFD` (�) alih-alih mengembalikan string kosong `""`, sehingga tampilan halaman tidak hilang secara tiba-tiba jika terselip byte yang rusak.
- C. Mengubah semua huruf kecil menjadi huruf besar.
- D. Menghapus tag HTML seperti `strip_tags()`.

**Jawaban Benar:** B
**Penjelasan:** Tanpa `ENT_SUBSTITUTE`, jika `$teks` mengandung satu saja byte non-UTF-8 yang cacat, `htmlspecialchars()` akan mengembalikan string kosong `""` secara keseluruhan. `ENT_SUBSTITUTE` menjaga sisa teks yang valid tetap tampil dengan aman.

### Soal 3
Apa fungsi dari header respons HTTP `X-Content-Type-Options: nosniff`?
- A. Mematikan pemeriksaan kata sandi di peramban.
- B. Melarang peramban melakukan *MIME-type sniffing* (menebak sendiri tipe berkas dari isinya dan mengabaikan header `Content-Type` dari server), sehingga berkas teks atau gambar yang diunggah pengguna tidak pernah dieksekusi secara keliru sebagai HTML atau JavaScript oleh peramban.
- C. Menyembunyikan alamat IP server.
- D. Mengompresi ukuran berkas CSS secara otomatis.

**Jawaban Benar:** B
**Penjelasan:** Tanpa `X-Content-Type-Options: nosniff`, beberapa peramban dapat mencoba menebak isi berkas `text/plain` atau gambar yang mengandung tag `<script>` lalu mengeksekusinya sebagai dokumen HTML/JavaScript.

## Sumber
- [`htmlspecialchars` — PHP Manual](https://www.php.net/manual/en/function.htmlspecialchars.php)
- [Cross Site Scripting Prevention Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [`json_encode` — PHP Manual](https://www.php.net/manual/en/function.json-encode.php)
- [Content Security Policy (CSP) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
