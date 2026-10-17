# Streaming HTTP di PHP: Server-Sent Events (SSE), `readfile()` tanpa Kehabisan RAM, dan `X-Accel-Redirect`

- **Tingkat:** Lanjut
- **Ringkasan:** Mengirim aliran pembaruan waktu nyata satu arah dari PHP ke peramban menggunakan **Server-Sent Events (`text/event-stream`)**, menyajikan unduhan berkas privat berukuran gigabyte tanpa membebani memori PHP dengan mematikan output buffering atau mendelegasikannya ke Nginx melalui header internal **`X-Accel-Redirect`**.

## Mengapa Melayani Unduhan Berkas 1 GB di PHP Sering Memicu `Allowed memory size exhausted`?

Ketika seorang siswa yang sudah login meminta unduhan video materi privat berukuran **1 GB** melalui `/unduh.php?berkas=modul-01.mp4`, Anda tidak bisa menaruh berkas tersebut di folder publik karena harus melewati pemeriksaan izin di PHP terlebih dahulu.

Namun, jika setelah memeriksa izin Anda langsung memanggil `readfile($jalurBerkas)` sementara **Output Buffering (`ob_get_level() > 0`)** masih menyala (yang sering aktif secara bawaan di `php.ini` atau kerangka kerja), maka fungsi `readfile()` tidak langsung mengalirkan byte ke jaringan, melainkan **menumpuk seluruh 1 GB tersebut di dalam penyangga RAM PHP** hingga proses PHP langsung mati karena kehabisan memori (*Out of Memory*)!

Bahkan lebih baik lagi: mengapa membiarkan satu proses worker PHP-FPM tertahan selama 10 menit hanya untuk menyuapi byte berkas ke jaringan yang lambat, jika Anda bisa meminta **Nginx** yang melakukannya dengan **0 byte memori PHP** menggunakan header **`X-Accel-Redirect`**?

> **🚫 Kerentanan & Kesalahan Umum:** Melayani unduhan berkas video 2 GB dengan membaca isinya di PHP sementara *Output Buffering* (`ob_get_level() > 0`) masih aktif akan memaksa PHP menampung seluruh 2 GB tersebut di RAM hingga proses PHP mati!

## 1. Perbandingan Tiga Teknik Streaming & Pengiriman Berkas di PHP

Pilih mekanisme yang tepat sesuai kebutuhan aplikasi Anda:

| Mekanisme | Beban Worker PHP-FPM | Cara Kerja Teknis | Kasus Penggunaan Terbaik |
| :--- | :--- | :--- | :--- |
| **`X-Accel-Redirect`** (Nginx) / `X-Sendfile` (Apache/Caddy) | **Bebas seketika (< 2 ms)** & **0 MB RAM** untuk berkas! | PHP hanya memvalidasi otorisasi lalu mengirim header `X-Accel-Redirect: /_internal/berkas.mp4` dan keluar (`exit`). Nginx mengambil alih pengiriman berkas langsung dari disk via kernel `sendfile`! | **Standar emas produksi** untuk melayani unduhan berkas privat berukuran besar (video, ZIP, PDF). |
| **Streaming `readfile()` tanpa Output Buffer** | Worker PHP tertahan selama unduhan berlangsung, tetapi **RAM tetap < 1 MB**. | Mengosongkan semua lapisan output buffer (`while (ob_get_level() > 0) ob_end_clean();`) sebelum memanggil `readfile($jalur)`. | Lingkungan yang tidak berada di balik Nginx/reverse proxy yang mendukung `X-Accel-Redirect`. |
| **Server-Sent Events (SSE — `text/event-stream`)** | Koneksi HTTP tetap terbuka selama aliran berlangsung. | Mengirim potongan teks berformat `event: ...\ndata: ...\n\n` disertai `header('X-Accel-Buffering: no')` dan `flush()`. | Umpan balik progres waktu nyata satu arah (progres ekspor laporan, notifikasi langsung, atau streaming token AI). |

## 2. Delegasi Unduhan ke Nginx (`X-Accel-Redirect`) dan Header `Content-Disposition` RFC 6266

Saat pengguna mengunduh berkas yang namanya mengandung spasi atau karakter non-ASCII (misalnya `"Laporan Keuangan 2026 — Rina.pdf"`), menulis `filename="` . `rawurlencode($nama)` biasa akan membuat nama berkas yang tersimpan di komputer pengguna dipenuhi kode `%20`! Gunakan sintaks standar **RFC 6266 / RFC 5987 (`filename*=UTF-8''...`)**:

```php
<?php
declare(strict_types=1);

// 1. Delegasikan pengiriman berkas besar yang telah lolos otorisasi ke Nginx (Zero-PHP-Memory)
function kirimBerkasViaNginxInternal(string $namaBerkasTersanitasi, string $namaUnduhanAsli): never
{
    $namaBerkasAman = basename($namaBerkasTersanitasi);
    header('Content-Type: application/octet-stream');
    // filename*=UTF-8'' (RFC 6266/5987) memakai persen-pengodean; tanpa tanda * nama berkas tampil dengan %20 dst.
    header("Content-Disposition: attachment; filename*=UTF-8''" . rawurlencode($namaUnduhanAsli));
    header('X-Accel-Redirect: /_penyimpanan_internal/' . $namaBerkasAman);
    exit;
}

// 2. Alternatif jika tanpa Nginx: matikan seluruh Output Buffer sebelum readfile()!
function alirkanBerkasBesarTanpaOom(string $jalurBerkasValid, string $namaUnduhanAsli): void
{
    if (!is_file($jalurBerkasValid) || !is_readable($jalurBerkasValid)) {
        throw new RuntimeException('Berkas tidak ditemukan.');
    }

    // WAJIB: matikan dan bersihkan semua tingkat output buffering PHP agar RAM tidak membengkak!
    while (ob_get_level() > 0) {
        ob_end_clean();
    }

    header('Content-Type: application/octet-stream');
    header('Content-Length: ' . (string) filesize($jalurBerkasValid));
    header("Content-Disposition: attachment; filename*=UTF-8''" . rawurlencode($namaUnduhanAsli));

    readfile($jalurBerkasValid);
}
```

Agar `/_penyimpanan_internal/` hanya bisa dipanggil oleh header `X-Accel-Redirect` dari PHP dan **tidak bisa diakses langsung oleh pengunjung dari peramban**, tambahkan direktif **`internal;`** di konfigurasi blok `location` Nginx Anda:

```nginx
location /_penyimpanan_internal/ {
    internal;
    alias /var/data/berkas_privat_kodeloka/;
}
```

## 3. Mengirim Aliran Waktu Nyata dengan Server-Sent Events (SSE)

Format protokol **Server-Sent Events (`text/event-stream`)** sangat sederhana namun ketat: setiap pesan dipisahkan oleh **dua baris baru (`\n\n`)**, dan agar reverse proxy Nginx tidak menahan potongan kecil di dalam penyangganya, Anda wajib mengirim header **`X-Accel-Buffering: no`**:

```php
<?php
declare(strict_types=1);

function formatPaketSse(string $namaEvent, array $data, ?string $id = null): string
{
    $paket = '';
    if ($id !== null && $id !== '') {
        $paket .= "id: {$id}\n";
    }
    $paket .= "event: {$namaEvent}\n";
    $paket .= 'data: ' . json_encode($data, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE) . "\n\n";
    return $paket;
}
```

> **⚠️ Jangan Lupa Memanggil `session_write_close()` Sebelum Memulai Loop SSE!**
> Secara bawaan, PHP mengunci berkas sesi (`session_start()`) selama permintaan HTTP masih berjalan. Jika skrip SSE Anda menahan koneksi terbuka selama 2 menit tanpa memanggil **`session_write_close()`** terlebih dahulu, maka seluruh tab lain milik pengguna yang sama akan **membeku mengantre kunci sesi**!

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Membiarkan sesi PHP terkunci saat menjalankan streaming SSE atau unduhan panjang:** Segera بعد selesai memeriksa autentikasi dari `$_SESSION`, panggil **`session_write_close()`** sebelum memulai loop streaming agar pengguna tetap bisa membuka halaman lain di situs Anda secara paralel.
2. **Lupa mengirim header `X-Accel-Buffering: no` pada endpoint SSE di balik Nginx:** Secara bawaan Nginx menyangga (*buffer*) respons FastCGI dari PHP sampai berukuran beberapa kilobyte. Tanpa `X-Accel-Buffering: no`, peramban tidak akan menerima event SSE secara waktu nyata.
3. **Tidak memeriksa `if (connection_aborted()) break;` di dalam loop SSE:** Jika pengguna menutup tab peramban, loop PHP Anda harus segera berhenti agar tidak terus menghabiskan CPU dan worker FPM secara sia-sia.

## Latihan Praktik Mandiri

1. Buat berkas `StreamingHttp.php` yang menyediakan fungsi `formatPaketSse()` dan `buatHeaderContentDispositionAman(string $namaUnduhanAsli): string`.
2. Tulis pengujian PHPUnit untuk memverifikasi bahwa `formatPaketSse('progres', ['persen' => 50], 'evt-1')` menghasilkan format `id:`, `event:`, `data:`, dan diakhiri tepat dengan `"\n\n"`, serta `buatHeaderContentDispositionAman` menggunakan format `filename*=UTF-8''`.

## Kuis Pemahaman

### Soal 1
Mengapa memanggil `readfile($jalurBerkasVideo2GB)` sementara *Output Buffering* PHP masih aktif (`ob_get_level() > 0`) akan menyebabkan server mengalami *Fatal error: Allowed memory size exhausted*?
- A. Karena fungsi `readfile()` hanya mendukung berkas teks `.txt`
- B. Karena ketika *Output Buffering* aktif, PHP menahan seluruh keluaran dari `readfile()` di dalam memori RAM terlebih dahulu alih-alih langsung mengalirkannya ke soket jaringan potongan demi potongan; solusinya adalah membersihkan seluruh lapisan buffer dengan `while (ob_get_level() > 0) ob_end_clean();` atau mendelegasikannya ke `X-Accel-Redirect`
- C. Karena PHP membatasi ukuran berkas di hard disk maksimal 10 MB
- D. Karena `readfile()` menggandakan berkas di direktori `/tmp`

**Jawaban Benar:** B
**Penjelasan:** `readfile()` sendiri sebenarnya mengalirkan berkas dengan memori kecil, tetapi jika di atasnya terdapat lapisan `ob_start()` yang aktif, penampung output buffer PHP akan mencoba menelan seluruh ukuran berkas tersebut ke dalam RAM.

### Soal 2
Bagaimana cara kerja mekanisme header **`X-Accel-Redirect`** antara PHP-FPM dan server web Nginx saat melayani unduhan berkas privat berukuran besar?
- A. Mengarahkan peramban pengguna ke situs eksternal melalui status `301 Moved Permanently`
- B. Skrip PHP hanya memeriksa autentikasi/otorisasi pengguna, lalu mengirim header respons internal `X-Accel-Redirect: /_penyimpanan_internal/nama.zip` dan langsung selesai (`exit`); Nginx menangkap header tersebut, membebaskan worker PHP seketika, dan mengalirkan berkas langsung dari disk ke pengguna
- C. Memaksa peramban mengunduh berkas menggunakan protokol WebRTC
- D. Mengenkripsi berkas di memori PHP sebelum dikirim

**Jawaban Benar:** B
**Penjelasan:** Dengan `X-Accel-Redirect` (dan lokasi Nginx yang ditandai `internal;`), worker PHP-FPM hanya bekerja beberapa milidetik untuk memeriksa izin akses, sedangkan transfer data gigabyte yang memakan waktu lama ditangani langsung oleh Nginx secara efisien.

### Soal 3
Mengapa pada endpoint **Server-Sent Events (SSE)** yang menjaga koneksi HTTP tetap terbuka lama, Anda wajib memanggil **`session_write_close()`** segera setelah selesai membaca data autentikasi dari `$_SESSION`?
- A. Untuk menghapus akun pengguna yang sedang login
- B. Karena penyimpanan sesi bawaan PHP mengunci berkas sesi secara eksklusif selama sesi masih terbuka; tanpa `session_write_close()`, seluruh permintaan HTTP lain dari peramban pengguna yang sama akan tertahan mengantre sampai koneksi SSE ditutup
- C. Karena SSE tidak diizinkan membaca variabel `$_SESSION`
- D. Agar format respons otomatis berubah menjadi JSON

**Jawaban Benar:** B
**Penjelasan:** PHP menerapkan *session locking* untuk mencegah kondisi balapan penulisan `$_SESSION`. Melepaskan kunci sesi dengan `session_write_close()` sebelum memulai aliran panjang memastikan tab lain milik pengguna tetap responsif.

## Sumber

- [Using server-sent events — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [Server-sent events — HTML Standard (WHATWG)](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [Nginx: directive `internal` (X-Accel-Redirect) — Nginx Documentation](https://nginx.org/en/docs/http/ngx_http_core_module.html#internal)
- [RFC 6266: Content-Disposition in HTTP — IETF](https://www.rfc-editor.org/rfc/rfc6266)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
