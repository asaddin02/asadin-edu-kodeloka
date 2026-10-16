# Manajemen State: Cookie yang Aman, Session, dan Pencegahan Session Fixation

- **Tingkat:** Menengah
- **Ringkasan:** Mengelola identitas dan state pengguna di atas protokol HTTP yang *stateless* menggunakan `setcookie()` dengan atribut keamanan (`HttpOnly`, `Secure`, `SameSite`, `partitioned`), mengonfigurasi `$_SESSION`, serta mencegah serangan *Session Fixation* dengan `session_regenerate_id(true)`.

## Mengapa HTTP Membutuhkan Cookie dan Session?

Protokol HTTP pada dasarnya bersifat **stateless (tanpa ingatan)**: setelah server selesai mengirim balasan untuk halaman login Anda, server langsung melupakan siapa Anda. Ketika 2 detik kemudian Anda mengeklik tautan menuju halaman `/dasbor`, server membutuhkan cara untuk mengenali bahwa permintaan kedua ini masih berasal dari pengguna yang baru saja berhasil login.

Di sinilah **Cookie** dan **Session** bekerja sama:
1. **Cookie:** Sepotong data kecil (maksimal ~4 KB) yang dikirim oleh server melalui header HTTP `Set-Cookie` untuk disimpan di peramban pengguna, lalu otomatis dikirimkan kembali oleh peramban melalui header `Cookie` pada setiap permintaan berikutnya ke domain tersebut.
2. **Session (`$_SESSION`):** Data pengguna (seperti `user_id`, peran, atau pesan kilat/*flash message*) disimpan dengan aman **di sisi server** (di berkas server atau Redis), sementara peramban pengguna cukup menyimpan satu **Cookie ID Sesi acak** (misalnya `PHPSESSID=a8f9...`) sebagai kuncinya!

## 1. Mengirim Cookie yang Aman dengan `setcookie()`

Sejak PHP 7.3+, fungsi `setcookie()` mendukung argumen ke-3 berupa **array asosiatif opsi** yang jauh lebih mudah dibaca daripada menghafal 7 urutan parameter lama. Sejak **PHP 8.5**, array opsi ini juga mendukung kunci **`'partitioned'`** untuk *CHIPS (Cookies Having Independent Partitioned State)*!

```php
<?php

declare(strict_types=1);

// Mengatur cookie preferensi tampilan selama 30 hari dengan opsi keamanan lengkap:
setcookie(
    name: 'preferensi_bahasa',
    value: 'id',
    options: [
        'expires'  => time() + (30 * 86400), // Kedaluwarsa dalam 30 hari
        'path'     => '/',                   // Berlaku di seluruh jalur situs
        'domain'   => '',                    // Hanya untuk host domain saat ini (HostOnly)
        'secure'   => true,                  // WAJIB: Hanya dikirim lewat koneksi terenkripsi HTTPS
        'httponly' => true,                  // WAJIB: Tidak bisa dibaca oleh document.cookie di JavaScript (anti-pencurian XSS)
        'samesite' => 'Lax',                 // Melindungi dari pengiriman lintas situs (CSRF)
    ],
);
```

### Memahami Tiga Pilar Pengaman Cookie: `HttpOnly`, `Secure`, dan `SameSite`

| Atribut Cookie | Apa yang Dilindungi? | Rekomendasi Produksi |
|---|---|---|
| **`httponly => true`** | Melarang JavaScript (`document.cookie`) membaca cookie tersebut. Jika terjadi celah XSS, skrip penyerang tidak dapat menyalin nilai cookie sesi Anda. | **Wajib `true`** untuk semua cookie sesi dan token autentikasi! |
| **`secure => true`** | Memastikan peramban hanya mengirimkan cookie melalui sambungan terenkripsi **HTTPS**, tidak pernah lewat HTTP polos yang bisa disadap di jaringan Wi-Fi umum. | **Wajib `true`** di lingkungan produksi. |
| **`samesite => 'Lax'` atau `'Strict'`** | Mengatur apakah cookie ikut dikirim pada permintaan lintas situs (*cross-site request*). `'Lax'` mengizinkan cookie saat pengguna mengeklik tautan biasa dari luar menuju situs Anda, tetapi menahan cookie pada pengiriman formulir `POST` dari situs luar! | Gunakan **`'Lax'`** (atau **`'Strict'`** untuk aplikasi perbankan/admin sensitif). |

## 2. Mengelola Session (`$_SESSION`) dengan Benar

Sebelum memanggil `session_start()`, selalu pastikan parameter cookie sesi dikonfigurasi secara ketat:

```php
<?php

declare(strict_types=1);

function mulaiSesiAman(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    // Aktifkan strict mode agar PHP menolak ID sesi yang tidak dibuat oleh server kita sendiri!
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');

    session_set_cookie_params([
        'lifetime' => 0,       // Cookie sesi berakhir saat peramban ditutup
        'path'     => '/',
        'secure'   => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();
}
```

## 3. Mencegah Serangan *Session Fixation* dengan `session_regenerate_id(true)`

Bayangkan skenario serangan **Session Fixation** berikut:
1. Penyerang mengunjungi situs Anda dan mendapatkan ID sesi kosong `PHPSESSID=12345`.
2. Penyerang menjebak korban agar menggunakan ID sesi `12345` tersebut, lalu korban melakukan login dengan nama pengguna dan kata sandinya.
3. Jika saat korban berhasil login aplikasi Anda **tidak mengganti ID sesinya**, maka ID sesi `12345` yang sudah diketahui penyerang tadi kini berubah menjadi sesi milik korban yang sudah terautentikasi!

**Aturan Keamanan Wajib:** Setiap kali terjadi perubahan tingkat hak akses—terutama **tepat setelah pengguna berhasil login** atau setelah pengguna mengubah kata sandinya—Anda **wajib memanggil `session_regenerate_id(true)`** untuk menerbitkan ID sesi baru dan menghapus berkas sesi lama!

```php
<?php

declare(strict_types=1);

function prosesLoginBerhasil(int $idPengguna, string $peran): void
{
    mulaiSesiAman();

    // WAJIB: Buat ID sesi baru yang acak dan hapus sesi lama (argumen true)
    // untuk mencegah serangan Session Fixation!
    session_regenerate_id(delete_old_session: true);

    $_SESSION['user_id'] = $idPengguna;
    $_SESSION['peran'] = $peran;
    $_SESSION['waktu_login'] = time();
}
```

## 4. Cara Menghancurkan Sesi dengan Bersih Saat Logout

Untuk mengeluarkan pengguna (*logout*) secara tuntas, jangan hanya memanggil `session_destroy()`! Mengapa? Karena `session_destroy()` hanya menghapus data sesi di diska server, sementara variabel `$_SESSION` di memori skrip saat ini masih terisi dan cookie di peramban pengguna belum dihapus.

Ikuti urutan lengkap resmi dari [PHP Manual](https://www.php.net/manual/en/function.session-destroy.php):

```php
<?php

declare(strict_types=1);

function prosesLogout(): void
{
    mulaiSesiAman();

    // 1. Kosongkan seluruh isi array $_SESSION di memori
    $_SESSION = [];

    // 2. Hapus cookie sesi di peramban pengguna dengan mengatur waktu kedaluwarsa di masa lalu
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            name: session_name(),
            value: '',
            options: [
                'expires'  => time() - 42000,
                'path'     => $params['path'],
                'domain'   => $params['domain'],
                'secure'   => $params['secure'],
                'httponly' => $params['httponly'],
                'samesite' => $params['samesite'] ?: 'Lax',
            ],
        );
    }

    // 3. Hancurkan penyimpanan sesi di sisi server
    session_destroy();
}
```

## Latihan Praktik: Membuat Manajer Sesi dan Flash Message

Buatlah berkas `SesiManajer.php`:
1. Buat `final class SesiManajer` dengan metode `mulai()`, `login(int $userId)`, `logout()`, dan `apakahLogin(): bool`.
2. Tambahkan fitur **Flash Message** (`setFlash(string $kunci, string $pesan)` dan `ambilFlash(string $kunci): ?string`) yang menyimpan pesan notifikasi sekali pakai di `$_SESSION['_flash'][$kunci]` lalu langsung menghapusnya dengan `unset()` begitu pesan tersebut selesai dibaca satu kali!

## Kuis Pemahaman

### Soal 1
Mengapa Anda wajib memanggil `session_regenerate_id(true)` tepat setelah pengguna berhasil melewati verifikasi nama pengguna dan kata sandi saat login?
- A. Untuk mempercepat kueri basis data pada halaman berikutnya.
- B. Untuk mengganti ID sesi lama dengan ID sesi baru yang acak sekaligus menghapus sesi lama, sehingga menggagalkan serangan *Session Fixation* di mana penyerang sudah mengetahui ID sesi korban sebelum login.
- C. Untuk menghapus seluruh isi array `$_SESSION`.
- D. Karena `$_SESSION` tidak bisa diisi sebelum `session_regenerate_id()` dipanggil.

**Jawaban Benar:** B
**Penjelasan:** Dalam serangan *Session Fixation*, penyerang mengincar ID sesi pra-login untuk diambil alih setelah korban login. Memanggil `session_regenerate_id(true)` saat status autentikasi berubah memastikan ID sesi lama hangus dan digantikan oleh ID sesi baru yang hanya diketahui oleh korban.

### Soal 2
Apa fungsi pengaturan `ini_set('session.use_strict_mode', '1')` pada manajemen sesi PHP?
- A. Memaksa seluruh nilai di dalam `$_SESSION` bertipe `string`.
- B. Memerintahkan PHP untuk menolak ID sesi yang dikirimkan oleh peramban apabila ID sesi tersebut belum pernah diinisialisasi dan tidak dikenali oleh server, lalu membuatkan ID sesi baru yang sah.
- C. Membatasi waktu sesi hanya selama 60 detik.
- D. Mematikan penyimpanan cookie di peramban.

**Jawaban Benar:** B
**Penjelasan:** Tanpa `session.use_strict_mode`, jika penyerang mengirim cookie `PHPSESSID=id_pilihan_penyerang`, PHP akan menerima ID tersebut dan membuatkan sesi baru dengan nama ID pilihan penyerang itu. Dengan `use_strict_mode = 1`, PHP menolak ID sesi asing yang belum ada di server.

### Soal 3
Apa peran atribut `'samesite' => 'Lax'` pada cookie sesi?
- A. Mengizinkan cookie dibaca oleh `document.cookie` di semua domain.
- B. Mencegah peramban mengirimkan cookie tersebut pada permintaan lintas situs yang berisiko (seperti pengiriman formulir `POST` atau `fetch` dari situs pihak ketiga), namun tetap mengirimkannya ketika pengguna melakukan navigasi tingkat atas (mengeklik tautan biasa menuju situs Anda).
- C. Mengenkripsi isi cookie dengan algoritma Argon2id.
- D. Menyimpan cookie di dalam `localStorage`.

**Jawaban Benar:** B
**Penjelasan:** `SameSite=Lax` memberikan keseimbangan keamanan dan kenyamanan: pengguna yang mengeklik tautan menuju situs Anda dari surel atau situs lain tetap berstatus login (`GET` navigasi tingkat atas), tetapi formulir `POST` tersembunyi dari situs penyerang tidak akan disertakan cookie sesinya.

## Sumber
- [`session_regenerate_id` — PHP Manual](https://www.php.net/manual/en/function.session-regenerate-id.php)
- [Session Management Basics — PHP Manual](https://www.php.net/manual/en/features.session.security.management.php)
- [`setcookie` — PHP Manual](https://www.php.net/manual/en/function.setcookie.php)
- [`session_destroy` — PHP Manual](https://www.php.net/manual/en/function.session-destroy.php)
- [Session Runtime Configuration (`session.use_strict_mode`) — PHP Manual](https://www.php.net/manual/en/session.configuration.php)
