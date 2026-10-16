# Penanganan Exception (`Throwable`), Hierarki Galat, dan Global Handler

- **Tingkat:** Menengah
- **Ringkasan:** Membedah hierarki `Throwable` (`Error` vs `Exception`), menerapkan pola `try`/`catch`/`finally` dan *exception chaining* (`$previous`), merancang hierarki *Domain Exception*, serta memasang penangkap galat tingkat aplikasi (`set_exception_handler`).

## 1. Memahami Pohon Keluarga `Throwable` di PHP 8

Di PHP modern, kesalahan sintaks, ketidakcocokan tipe data (`TypeError`), maupun kegagalan koneksi basis data (`PDOException`) semuanya direpresentasikan sebagai objek yang mengimplementasikan interface puncak **`Throwable`**:

```
                           Throwable (Interface)
                                 │
          ┌──────────────────────┴──────────────────────┐
          ▼                                             ▼
        Error                                       Exception
(Kesalahan Mesin / Bug Kode)                (Kondisi Galat Operasional)
 ├── TypeError                               ├── LogicException
 │    └── ArgumentCountError                 │    ├── InvalidArgumentException
 ├── ValueError                              │    ├── DomainException
 ├── UnhandledMatchError                     │    ├── LengthException
 ├── ArithmeticError                         │    └── OutOfRangeException
 │    └── DivisionByZeroError                └── RuntimeException
 └── ParseError / CompileError                    ├── OutOfBoundsException
                                                  ├── UnexpectedValueException
                                                  └── PDOException
```

### Aturan Penting Memilih Kelas Exception Bawaan SPL:
1. **Turunan `LogicException` (`InvalidArgumentException`, `DomainException`, `BadMethodCallException`):**
   Gunakan ketika kesalahan disebabkan oleh **pelanggaran kontrak fungsi atau aturan domain** yang dapat dicegah sebelum operasi dijalankan (misalnya panjang judul kurang dari 3 karakter -> lempar `InvalidArgumentException`, atau membatalkan pesanan yang sudah dikirim -> lempar `DomainException`).
2. **Turunan `RuntimeException` (`UnexpectedValueException`, `PDOException`):**
   Gunakan ketika kegagalan baru bisa diketahui **saat program berjalan berinteraksi dengan dunia luar** (misalnya berkas gagal ditulis ke diska, server API pihak ketiga mengembalikan JSON rusak, atau jaringan database terputus).

## 2. Merangkai Jejak Galat (*Exception Chaining*) dengan Parameter `$previous`

Ketika lapisan repositori database menangkap `PDOException`, kita sering kali tidak ingin mengekspos detail SQL mentah ke lapisan Controller di atasnya, melainkan melempar `GagalMenyimpanDataException` milik domain kita sendiri.

Namun, **jangan pernah membuang objek `$pdoException` aslinya!** Teruskan `$pdoException` sebagai argumen ke-3 (**`$previous`**) pada konstruktor `Exception` agar jejak akar masalahnya (*root cause*) tetap terekam utuh di log server:

```php
<?php

declare(strict_types=1);

class RepositoriException extends RuntimeException {}

function simpanPengguna(PDO $pdo, string $surel): void
{
    try {
        $stmt = $pdo->prepare('INSERT INTO pengguna (surel) VALUES (:surel)');
        $stmt->execute(['surel' => $surel]);
    } catch (PDOException $galatDb) {
        // Meneruskan $galatDb sebagai parameter ke-3 ($previous)!
        throw new RepositoriException(
            message: 'Gagal menyimpan data pengguna ke penyimpanan.',
            code: 500,
            previous: $galatDb,
        );
    }
}
```

Saat dicatat ke log di tingkat atas, Anda dapat membaca pesan domain (`$e->getMessage()`) sekaligus penyebab teknis aslinya melalui **`$e->getPrevious()?->getMessage()`**!

## 3. Memasang Penangkap Galat Global (`set_exception_handler` dan `ErrorException`)

Bagaimana jika ada sebuah `Throwable` tak terduga yang lolos tidak tertangkap oleh blok `try...catch` mana pun di aplikasi Anda?
Di produksi (dengan `display_errors = Off`), pengguna tidak boleh melihat layar putih kosong, melainkan harus menerima respons HTTP `500` yang sopan sementara rincian *stack trace*-nya dicatat ke log.

Kita dapat mendaftarkan penangkap terakhir tingkat aplikasi menggunakan **`set_exception_handler()`** dan mengubah peringatan PHP kuno (*warnings/notices*) menjadi `ErrorException` menggunakan **`set_error_handler()`**:

```php
<?php

declare(strict_types=1);

// 1. Mengubah Warning/Notice PHP menjadi ErrorException agar bisa ditangkap try...catch!
set_error_handler(static function (
    int $tingkat,
    string $pesan,
    string $berkas,
    int $baris,
): bool {
    if (!(error_reporting() & $tingkat)) {
        return false;
    }
    throw new ErrorException($pesan, 0, $tingkat, $berkas, $baris);
});

// 2. Penangkap terakhir untuk semua Throwable yang tidak tertangkap di aplikasi
set_exception_handler(static function (Throwable $e): void {
    // Catat rincian lengkap beserta stack trace ke log server privat
    error_log(sprintf(
        "[UNCAUGHT %s] %s di %s:%d\nStack trace:\n%s",
        $e::class,
        $e->getMessage(),
        $e->getFile(),
        $e->getLine(),
        $e->getTraceAsString(),
    ));

    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
    }

    // Kirimkan pesan aman yang tidak membocorkan jalur berkas/SQL ke pengguna luar
    echo json_encode([
        'status' => 'galat',
        'pesan'  => 'Terjadi gangguan internal pada server. Tim kami telah diberitahu.',
    ]);
});
```

> **💡 Fitur Baru di PHP 8.5:**
> Sejak **PHP 8.5**, tersedia fungsi bawaan **`get_error_handler()`** dan **`get_exception_handler()`** untuk menginspeksi fungsi handler yang sedang aktif saat ini, serta **Fatal Errors** (seperti terlampauinya batas waktu eksekusi `Maximum execution time exceeded`) kini secara otomatis menyertakan *backtrace* lengkap!

## Latihan Praktik: Merancang Hierarki Exception Domain E-Learning

Buatlah berkas `hierarki-exception.php` dan jalankan dengan `php hierarki-exception.php`:
1. Buat `abstract class KodelokaDomainException extends DomainException` yang memiliki metode `abstract public function kodeStatusHttp(): int;`.
2. Buat dua subkelas: `ModulTidakDitemukanException` (mengembalikan status HTTP `404`) dan `KuotaKelasPenuhException` (mengembalikan status HTTP `409 Conflict`).
3. Uji pelemparan dan penangkapannya di dalam satu blok `catch (KodelokaDomainException $e)` yang otomatis mengambil `$e->kodeStatusHttp()`.

## Kuis Pemahaman

### Soal 1
Manakah perbedaan yang tepat antara turunan `LogicException` (seperti `InvalidArgumentException`) dan turunan `RuntimeException` di PHP?
- A. `LogicException` tidak dapat ditangkap dengan `try...catch`, sedangkan `RuntimeException` bisa.
- B. `LogicException` menandakan kesalahan logika atau pelanggaran kontrak pemanggilan fungsi (seperti argumen yang tidak sah) yang seharusnya dapat dicegah oleh kode pemanggil, sedangkan `RuntimeException` menandakan kegagalan operasional saat program berjalan (seperti kegagalan jaringan atau sistem berkas).
- C. `RuntimeException` hanya terjadi saat kompilasi berkas PHP.
- D. `LogicException` merupakan turunan dari kelas `Error`.

**Jawaban Benar:** B
**Penjelasan:** Pemisahan semantik antara `LogicException` dan `RuntimeException` di Standard PHP Library (SPL) membantu pengembang membedakan antara kesalahan penggunaan API/aturan domain dengan gangguan lingkungan eksternal saat runtime.

### Soal 2
Mengapa kita perlu meneruskan variabel `$e` asli ke argumen ketiga (`previous: $e`) saat melempar exception baru di dalam blok `catch` (`throw new LayananException('Gagal memproses', 500, $e)`)?
- A. Agar exception lama otomatis dihapus dari memori.
- B. Untuk mempertahankan rantai penyebab galat (*exception chaining*), sehingga ketika dicatat ke log server kita masih dapat menelusuri akar penyebab teknis aslinya melalui `$exception->getPrevious()`.
- C. Agar pesan exception otomatis diterjemahkan ke Bahasa Indonesia.
- D. Karena parameter ketiga pada `Exception::__construct` wajib diisi.

**Jawaban Benar:** B
**Penjelasan:** Tanpa meneruskan `$previous`, jejak baris kode dan pesan teknis dari exception tingkat bawah (misalnya `PDOException` yang menyebutkan nama constraint tabel yang gagal) akan hilang saat dibungkus menjadi exception tingkat layanan.

### Soal 3
Apa fungsi dari pendaftaran `set_error_handler()` yang melempar `new ErrorException(...)` di awal aplikasi PHP modern?
- A. Mematikan seluruh pencatatan galat di server.
- B. Mengubah peringatan tradisional PHP (*Warnings/Notices* dari fungsi-fungsi bawaan lama yang belum melempar exception) menjadi objek `ErrorException` yang seragam, sehingga dapat ditangkap dan ditangani secara konsisten menggunakan blok `try...catch`.
- C. Mengabaikan galat `TypeError`.
- D. Mengubah kode status HTTP menjadi `200 OK`.

**Jawaban Benar:** B
**Penjelasan:** Sebagian fungsi sistem berkas warisan di PHP masih mengeluarkan *Warning* alih-alih melempar `Exception` saat gagal. Mengonversinya menjadi `ErrorException` menyatukan seluruh penanganan galat aplikasi ke dalam mekanisme `Throwable`.

## Sumber
- [Exceptions — PHP Manual](https://www.php.net/manual/en/langref.php)
- [PHP 8.5 Release Announcement (`get_error_handler`, `get_exception_handler`, Fatal Error Backtraces) — PHP.net](https://www.php.net/releases/8.5/en.php)
