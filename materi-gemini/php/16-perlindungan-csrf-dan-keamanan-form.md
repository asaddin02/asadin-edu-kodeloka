# Perlindungan Cross-Site Request Forgery (CSRF), `random_bytes()`, dan Pertahanan Berlapis

- **Tingkat:** Lanjut
- **Ringkasan:** Membedah anatomi serangan *Cross-Site Request Forgery (CSRF)*, mengimplementasikan *Synchronizer Token Pattern* dengan `random_bytes()` dan `hash_equals()`, memanfaatkan header `Sec-Fetch-Site` / `Origin`, serta melindungi endpoint AJAX/`fetch()` modern.

## 1. Memahami Anatomi Serangan CSRF secara Mendalam

**Cross-Site Request Forgery (CSRF)** adalah serangan yang memaksa peramban pengguna yang sedang terautentikasi (sudah login) untuk mengirimkan permintaan pengubahan data yang tidak disengaja ke aplikasi web Anda.

Mengapa peramban mau mengirimkan cookie sesi milik situs Anda ketika pemicunya berasal dari situs luar `jahat.example`?
Karena secara bawaan, mekanisme HTTP Cookie menempel pada **domain tujuan permintaan**, bukan domain tempat formulir HTML itu berada:

```text
1. Korban sudah login di https://kodeloka.example (Memiliki Cookie Sesi aktif)
2. Korban membuka tab baru ke https://kuis-berhadiah.example (Situs milik penyerang)
3. Halaman penyerang diam-diam memuat formulir tersembunyi:
   <form action="https://kodeloka.example/akun/ganti-surel" method="POST">
     <input type="hidden" name="surel_baru" value="penyerang@evil.example">
   </form>
   <script>document.forms[0].submit();</script>
4. Jika /akun/ganti-surel tidak memeriksa token CSRF (dan cookie tidak terlindungi),
   server mengira permintaan itu benar-benar dikirim oleh korban!
```

### Aturan Pertama Pencegahan CSRF: Jangan Pernah Mengubah Data pada Permintaan `GET`!
Permintaan HTTP `GET` (dan `HEAD` / `OPTIONS`) **wajib bersifat *Safe* (Hanya Baca / tidak mengubah state di server)**!
Jika Anda membuat tautan `<a href="/catatan/hapus?id=5">Hapus</a>` yang langsung menghapus data lewat metode `GET`, maka atribut cookie `SameSite=Lax` sekalipun tidak akan bisa melindungi Anda (karena navigasi tautan tingkat atas `GET` tetap menyertakan cookie `SameSite=Lax`; dan pada cookie yang tidak dibatasi `SameSite`, penyerang cukup memasang `<img src="https://situs-anda.id/catatan/hapus?id=5">`)!
Semua aksi yang menambah, mengubah, atau menghapus data **wajib menggunakan metode `POST`, `PUT`, `PATCH`, atau `DELETE`**.

## 2. Pertahanan Utama: *Synchronizer Token Pattern* (`random_bytes` + `hash_equals`)

Kenapa penyerang di `kuis-berhadiah.example` bisa mengirimkan formulir ke situs Anda, tetapi **tidak bisa** menyertakan Token CSRF rahasia milik korban?
Karena **Same-Origin Policy (SOP)** di peramban melarang keras skrip di `kuis-berhadiah.example` membaca isi halaman HTML dari `kodeloka.example`!

Berikut adalah implementasi kelas `PelindungCsrf` yang lengkap, mendukung rotasi token, dan siap dipakai untuk formulir tradisional maupun permintaan `fetch()` AJAX:

```php
<?php

declare(strict_types=1);

namespace Kodeloka\Keamanan;

use RuntimeException;

final class PelindungCsrf
{
    private const string KUNCI_SESI = '_kodeloka_csrf_token';

    public function ambilToken(): string
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            throw new RuntimeException('Sesi harus aktif sebelum membuat token CSRF.');
        }

        if (empty($_SESSION[self::KUNCI_SESI]) || !is_string($_SESSION[self::KUNCI_SESI])) {
            // 32 byte acak kriptografis = 64 karakter heksadesimal (256-bit entropi)
            $_SESSION[self::KUNCI_SESI] = bin2hex(random_bytes(32));
        }

        return $_SESSION[self::KUNCI_SESI];
    }

    public function rotasiToken(): string
    {
        unset($_SESSION[self::KUNCI_SESI]);
        return $this->ambilToken();
    }

    /**
     * Memeriksa token CSRF baik dari input form ($_POST['_csrf'])
     * maupun dari header khusus permintaan fetch/AJAX (X-CSRF-Token).
     */
    public function verifikasiPermintaan(): bool
    {
        $tokenSesi = $_SESSION[self::KUNCI_SESI] ?? '';
        if (!is_string($tokenSesi) || $tokenSesi === '') {
            return false;
        }

        // Ambil dari $_POST['_csrf'] atau dari header HTTP 'X-CSRF-Token'
        $tokenMasukan = $_POST['_csrf'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
        if (!is_string($tokenMasukan) || $tokenMasukan === '') {
            return false;
        }

        // Perbandingan waktu-konstan untuk mencegah timing attack
        return hash_equals($tokenSesi, $tokenMasukan);
    }

    public function cetakInputHidden(): string
    {
        $tokenAman = htmlspecialchars($this->ambilToken(), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        return sprintf('<input type="hidden" name="_csrf" value="%s">', $tokenAman);
    }
}
```

### Bagaimana Mengirimkan Token CSRF pada Permintaan `fetch()` di JavaScript?
Untuk halaman yang mengirim data menggunakan `fetch()` JSON tanpa `<form>`, sematkan token CSRF di dalam tag `<meta name="csrf-token" content="<?= e($csrf->ambilToken()) ?>">` di `<head>`, lalu baca dan kirimkan melalui header **`X-CSRF-Token`**:

```js
// Di sisi front-end JavaScript:
const tokenCsrf = document.querySelector('meta[name="csrf-token"]')?.content ?? "";

const respons = await fetch("/api/catatan/simpan", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token": tokenCsrf
  },
  body: JSON.stringify({ judul: "Belajar Keamanan CSRF" })
});
```
*(Keuntungan tambahan: Situs luar tidak diizinkan oleh peramban untuk menambahkan header kustom `X-CSRF-Token` pada permintaan lintas-origin tanpa izin preflight CORS!)*

## 3. Pertahanan Berlapis Modern: Memeriksa Header `Sec-Fetch-Site` dan `Origin`

Selain Token CSRF dan atribut cookie `SameSite=Lax`, semua peramban modern kini otomatis mengirimkan header **Fetch Metadata (`Sec-Fetch-Site`)** yang **tidak dapat diubah oleh kode JavaScript penyerang** (*forbidden header name*):
- `Sec-Fetch-Site: same-origin` (Permintaan berasal dari domain Anda sendiri — **Aman**).
- `Sec-Fetch-Site: none` (Pengguna mengetik langsung di bilah alamat).
- `Sec-Fetch-Site: cross-site` (Permintaan dipicu dari situs luar!).

Anda dapat menambahkan pemeriksaan ringan ini sebagai lapis pertahanan tambahan untuk seluruh permintaan `POST`/`PUT`/`DELETE`:

```php
<?php

declare(strict_types=1);

function pastikanBukanLintasSitus(): void
{
    $secFetchSite = $_SERVER['HTTP_SEC_FETCH_SITE'] ?? '';

    // Jika peramban modern melaporkan bahwa permintaan POST/DELETE ini berasal dari 'cross-site',
    // langsung tolak dengan 403 Forbidden!
    if ($secFetchSite !== '' && $secFetchSite !== 'same-origin' && $secFetchSite !== 'none') {
        http_response_code(403);
        exit('Permintaan lintas situs (Cross-Site) ditolak oleh kebijakan keamanan.');
    }
}
```

## Latihan Praktik: Middleware Pemeriksa CSRF dan Fetch Metadata

Buatlah berkas `MiddlewareCsrf.php`:
1. Buat fungsi `periksaKeamananMutasi()` yang langsung meloloskan metode baca (`GET`, `HEAD`, `OPTIONS`), tetapi untuk metode mutasi (`POST`, `PUT`, `PATCH`, `DELETE`) memeriksa header `HTTP_SEC_FETCH_SITE` **sekaligus** memverifikasi token CSRF menggunakan `PelindungCsrf::verifikasiPermintaan()`.
2. Pastikan ketika pengguna berhasil login atau logout, `PelindungCsrf::rotasiToken()` ikut dipanggil agar token CSRF terikat pada sesi yang baru!

## Kuis Pemahaman

### Soal 1
Mengapa aksi penghapusan data (seperti menghapus akun atau menghapus artikel) **tidak boleh** diimplementasikan menggunakan permintaan HTTP `GET` (misalnya `<a href="/artikel/hapus?id=10">Hapus</a>`), meskipun halaman tersebut sudah memeriksa apakah pengguna sedang login?
- A. Karena metode `GET` tidak dapat mengirimkan angka `id`.
- B. Karena permintaan `GET` dianggap sebagai navigasi baca yang aman oleh peramban: cookie dengan `SameSite=Lax` tetap ikut dikirimkan saat pengguna mengeklik tautan dari situs luar, ekstensi *prefetching* peramban dapat memicu tautan tersebut secara otomatis di latar belakang, dan (pada cookie yang tidak dibatasi `SameSite`) tag `<img src="...">` di halaman lain dapat memicunya tanpa interaksi pengguna.
- C. Karena metode `GET` lebih lambat daripada `POST`.
- D. Karena PDO menolak menjalankan kueri `DELETE` pada permintaan `GET`.

**Jawaban Benar:** B
**Penjelasan:** Dalam spesifikasi HTTP (RFC 9110), metode `GET` wajib bersifat *Safe* (tidak mengubah state server). Menggunakan `GET` untuk operasi penghapusan atau perubahan data membuka celah CSRF yang bahkan tidak dapat ditahan oleh `SameSite=Lax` pada navigasi tautan tingkat atas.

### Soal 2
Bagaimana cara yang paling bersih untuk mengirimkan token anti-CSRF ketika aplikasi front-end mengirimkan data menggunakan `fetch()` berformat `application/json` (bukan pengiriman `<form>` tradisional)?
- A. Menaruh token CSRF di dalam URL query string `?csrf=...`.
- B. Menyematkan token di dalam `<meta name="csrf-token" content="...">`, lalu membacanya di JavaScript dan mengirimkannya melalui header HTTP kustom seperti `X-CSRF-Token` (yang kemudian dibaca oleh PHP melalui `$_SERVER['HTTP_X_CSRF_TOKEN']` dan diverifikasi dengan `hash_equals()`).
- C. Mematikan pemeriksaan CSRF untuk semua permintaan `POST`.
- D. Menyimpan token di dalam nama berkas gambar.

**Jawaban Benar:** B
**Penjelasan:** Mengirimkan token melalui header HTTP kustom `X-CSRF-Token` sangat praktis untuk pemanggilan `fetch()` JSON, tidak mengotori URL maupun struktur body data, dan mendapatkan perlindungan ganda karena header kustom tidak dapat dikirim lintas-origin tanpa izin preflight CORS.

### Soal 3
Apa keistimewaan dari header permintaan HTTP `Sec-Fetch-Site` (seperti `Sec-Fetch-Site: same-origin` atau `Sec-Fetch-Site: cross-site`) yang dikirimkan oleh peramban modern?
- A. Nilainya dapat diubah secara bebas menggunakan opsi `headers` di dalam `fetch()`.
- B. Header yang diawali dengan `Sec-` adalah *forbidden header name* yang diatur secara eksklusif oleh mesin peramban dan dilarang keras dimodifikasi atau dipalsukan oleh kode JavaScript di halaman web, sehingga sangat tepercaya untuk mendeteksi permintaan lintas situs.
- C. Header tersebut berisi kata sandi pengguna.
- D. Header tersebut hanya dikirim pada koneksi HTTP yang tidak terenkripsi.

**Jawaban Benar:** B
**Penjelasan:** Spesifikasi *Fetch Metadata Request Headers* menetapkan awalan `Sec-` sebagai ruang nama terlarang bagi skrip halaman. Peramban sendirilah yang mengisi nilai `same-origin`, `same-site`, atau `cross-site` berdasarkan hubungan *origin* halaman pengirim dan tujuan.

## Sumber
- [Cross-Site Request Forgery Prevention Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Session Management Basics — PHP Manual](https://www.php.net/manual/en/features.session.security.management.php)
- [Fetch Metadata Request Headers (`Sec-Fetch-Site`) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site)
