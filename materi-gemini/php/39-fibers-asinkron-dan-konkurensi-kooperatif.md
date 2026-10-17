# Konkurensi Kooperatif di PHP Modern dengan `Fiber` (`Fiber::suspend`, `start`, `resume`)

- **Tingkat:** Lanjut
- **Ringkasan:** Memahami cara kerja **`Fiber`** (sejak PHP 8.1) sebagai primitif *full-stack interruptible functions* yang memungkinkan kerangka kerja asinkron (seperti Revolt, Amp, ReactPHP, atau FrankenPHP worker) menjeda dan melanjutkan eksekusi fungsi tanpa mengotori tumpukan pemanggilan (*call stack*).

## Mengapa PHP Memperkenalkan `Fiber` dan Apa Bedanya dengan `Generator` (`yield`)?

Sebelum hadirnya **`Fiber`**, jika Anda ingin menulis kode I/O asinkron tanpa callback bersarang di PHP, Anda harus menggunakan `Generator` (`yield`). Namun, `Generator` bersifat *stackless*: jika fungsi `A()` memanggil `B()`, dan `B()` memanggil `C()` yang perlu menunggu respons jaringan, maka `C()`, `B()`, dan `A()` **semuanya** terpaksa diubah menjadi fungsi `yield` (*masalah pewarnaan fungsi / function coloring*)!

**`Fiber`** adalah primitif *full-stack coroutine* (fungsi yang memiliki tumpukan pemanggilan sendiri dan dapat dijeda dari kedalaman fungsi mana pun!). Saat `Fiber::suspend()` dipanggil di dalam fungsi terdalam `C()`, seluruh tumpukan pemanggilan `A -> B -> C` dibekukan seketika dan kendali dikembalikan ke penjadwal utama (*Event Loop*), tanpa mengharuskan `A()` atau `B()` tahu bahwa `C()` baru saja dijeda!

> **🚫 Kerentanan & Kesalahan Umum:** Menganggap `Fiber` secara ajaib menjalankan kode PHP secara paralel di banyak inti CPU (*multi-threading*) adalah kesalahpahaman umum; `Fiber` berjalan pada satu thread melalui penjadwalan kooperatif (*cooperative multitasking*) untuk menumpuk waktu tunggu I/O.

## 1. Siklus Hidup dan Metode Utama Kelas `Fiber`

Sebuah instans `Fiber` berjalan di dalam satu thread yang sama dengan pemanggilnya melalui pertukaran kendali kooperatif:

| Metode / Status `Fiber` | Dipanggil Dari Mana? | Perilaku & Nilai Kembalian |
| :--- | :--- | :--- |
| **`$fiber = new Fiber($callable)`** | Luar Fiber | Membangun objek Fiber baru (status awal: belum berjalan / `!$fiber->isStarted()`). |
| **`$fiber->start(...$args)`** | Luar Fiber | Memulai eksekusi `$callable` hingga bertemu `Fiber::suspend()` pertama (mengembalikan nilai yang dikirim ke `suspend`), atau hingga fungsi selesai (mengembalikan `null`). |
| **`Fiber::suspend($nilai)`** | **Hanya di Dalam Fiber!** | Menjeda eksekusi Fiber saat ini, mengirim `$nilai` ke pemanggil `start()`/`resume()`, dan menunggu hingga dibangunkan kembali oleh `resume()` atau `throw()`. |
| **`$fiber->resume($nilaiMasuk)`** | Luar Fiber (saat `isSuspended()`) | Melanjutkan Fiber dari titik `suspend()` terakhir dengan menyuntikkan `$nilaiMasuk`; mengembalikan nilai `suspend()` berikutnya, atau **`null` jika Fiber sudah selesai (`isTerminated()`)**. |
| **`$fiber->getReturn()`** | Luar Fiber (saat `isTerminated()`) | Mengambil nilai `return` akhir dari fungsi di dalam Fiber setelah Fiber selesai tanpa eksepsi. |
| **`$fiber->throw($exception)`** | Luar Fiber (saat `isSuspended()`) | Melempar eksepsi tepat di baris `Fiber::suspend()` di dalam Fiber (sehingga dapat ditangkap oleh `try...catch` di dalam Fiber!). |

## 2. Alur Pertukaran Nilai Antara Pemanggil Utama dan `Fiber`

Perhatikan urutan angka `1` sampai `4` pada kode di bawah ini serta perbedaan penting antara nilai kembalian **`$fiber->resume()`** dan **`$fiber->getReturn()`**:

```php
<?php
declare(strict_types=1);

$fiber = new Fiber(function (string $url): string {
    echo "1. Mengirim permintaan ke {$url}\n";
    // Menjeda eksekusi fiber dan menyerahkan kendali kembali ke pemanggil
    $responsSimulasi = Fiber::suspend($url);
    echo "3. Menerima respons: {$responsSimulasi}\n";
    return "Selesai memproses {$url}";
});

$urlYangDitangguhkan = $fiber->start('https://api.kodeloka.id/status');
echo "2. Pemanggil utama menangani I/O untuk: {$urlYangDitangguhkan}\n";
$fiber->resume('HTTP 200 OK'); // resume() mengembalikan nilai suspend berikutnya, atau null jika fiber sudah selesai
$hasilAkhir = $fiber->getReturn(); // nilai return fungsi fiber diambil dengan getReturn()
echo "4. Hasil: {$hasilAkhir}\n";
```

## 3. Menjalankan Beberapa Tugas Secara Konkuren Kooperatif (*Round-Robin Scheduler*)

Bagaimana kerangka kerja asinkron seperti **Amp** atau **Revolt** mengeksekusi banyak permintaan HTTP secara bersamaan menggunakan `Fiber`? Mereka memasukkan beberapa `Fiber` ke dalam antrean penjadwal (*scheduler*): ketika Fiber ke-1 menunggu I/O (`Fiber::suspend()`), penjadwal langsung menjalankan Fiber ke-2 tanpa membuang waktu menunggu!

```php
<?php
declare(strict_types=1);

/**
 * Penjadwal kooperatif sederhana yang menjalankan beberapa Fiber secara bergantian.
 *
 * @param list<callable(): mixed> $daftarTugas
 * @return list<mixed>
 */
function jalankanKonkurenKooperatif(array $daftarTugas): array
{
    /** @var list<Fiber> $antreanFiber */
    $antreanFiber = [];
    foreach ($daftarTugas as $tugas) {
        $f = new Fiber($tugas);
        $f->start();
        $antreanFiber[] = $f;
    }

    // Lanjutkan semua fiber yang masih berstatus suspended secara bergiliran
    $masihAdaYangBerjalan = true;
    while ($masihAdaYangBerjalan) {
        $masihAdaYangBerjalan = false;
        foreach ($antreanFiber as $f) {
            if ($f->isSuspended()) {
                $f->resume();
                $masihAdaYangBerjalan = true;
            }
        }
    }

    return array_map(static fn (Fiber $f): mixed => $f->getReturn(), $antreanFiber);
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Mengira `$hasil = $fiber->resume()` mengembalikan nilai `return` akhir dari fungsi Fiber:** Ketika sebuah Fiber melanjutkan eksekusi dari `suspend()` terakhir lalu mencapai pernyataan `return "Selesai";`, metode `$fiber->resume()` akan mengembalikan **`null`**! Untuk mengambil nilai `"Selesai"`, Anda **wajib** memanggil **`$fiber->getReturn()`** setelah `$fiber->isTerminated()` bernilai `true`.
2. **Memanggil `Fiber::suspend()` dari luar konteks Fiber:** Jika kode yang berjalan di tumpukan utama (bukan di dalam Fiber) memanggil `Fiber::suspend()`, PHP akan langsung melempar `FiberError: Cannot suspend outside of a fiber`. Periksa `if (Fiber::getCurrent() !== null)` bila membuat fungsi pustaka yang bisa dipanggil dari dalam maupun luar Fiber.
3. **Menjalankan fungsi pemblokir sinkron (seperti `sleep(5)` atau `file_get_contents()` jaringan lambat) di dalam Fiber dan mengira Fiber lain tetap berjalan:** Karena semua Fiber berbagi 1 thread tunggal, memanggil `sleep(5)` di dalam satu Fiber akan **membekukan seluruh thread proses PHP beserta seluruh Fiber lainnya selama 5 detik**! Di dalam Fiber, hanya operasi I/O non-blokir yang diserahkan ke Event Loop via `Fiber::suspend()` yang tidak memblokir Fiber lain.

## Latihan Praktik Mandiri

1. Buat berkas `PenjadwalFiber.php` yang memuat fungsi `jalankanKonkurenKooperatif()` serta fungsi uji yang mencatat urutan langkah eksekusi dari dua Fiber yang masing-masing memanggil `Fiber::suspend()` dua kali.
2. Tulis pengujian PHPUnit untuk membuktikan bahwa langkah eksekusi kedua Fiber saling berselang-seling (*interleaved*: `A1, B1, A2, B2, A3, B3`) dan `$fiber->getReturn()` mengembalikan hasil akhir masing-masing Fiber dengan tepat.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Menganggap `Fiber` secara ajaib menjalankan kode PHP secara paralel di banyak inti CPU (*multi-threading*) adalah kesalahpahaman umum; `Fiber` berjalan pada satu thread melalui penjadwalan kooperatif (*cooperative multitasking*) untuk menumpuk waktu tunggu I/O.*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena `Fiber` hanya berjalan pada satu thread dengan penjadwalan kooperatif, bukan paralelisme CPU, sehingga kode yang berat secara CPU tetap memblokir semuanya dan asumsi paralel yang keliru menimbulkan bug performa dan keandalan di produksi
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Menganggap `Fiber` secara ajaib menjalankan kode PHP secara paralel di banyak inti CPU (*multi-threading*) adalah kesalahpahaman umum; `Fiber` berjalan pada satu thread melalui penjadwalan kooperatif (*cooperative multitasking*) untuk menumpuk waktu tunggu I/O.

### Soal 2
Ketika sebuah `Fiber` yang sedang ditangguhkan (`suspended`) dilanjutkan dengan `$nilai = $fiber->resume('data')` lalu fungsi di dalam Fiber tersebut langsung mencapai pernyataan akhir `return 'HASIL_AKHIR';` tanpa memanggil `Fiber::suspend()` lagi, apakah isi dari `$nilai` dan bagaimana cara mengambil `'HASIL_AKHIR'`?
- A. `$nilai` berisi `'HASIL_AKHIR'` secara langsung
- B. `$nilai` bernilai **`null`** (karena `resume()` hanya mengembalikan nilai dari `Fiber::suspend()` berikutnya); sedangkan nilai `'HASIL_AKHIR'` harus diambil dengan memanggil **`$fiber->getReturn()`**
- C. `$fiber->resume()` melempar `FiberError` jika fungsi selesai
- D. `'HASIL_AKHIR'` otomatis dicetak ke layar dengan `echo`

**Jawaban Benar:** B
**Penjelasan:** Sesuai dokumentasi resmi `Fiber::resume()` dan `Fiber::getReturn()`, ketika eksekusi Fiber selesai (`isTerminated() === true`), `resume()` (atau `start()`) mengembalikan `null`, dan nilai `return` dari callback Fiber diambil melalui `$fiber->getReturn()`.

### Soal 3
Apa yang terjadi jika Anda memanggil `$fiber->getReturn()` ketika Fiber masih berstatus ditangguhkan (`$fiber->isSuspended() === true`) atau ketika Fiber berhenti karena melempar eksepsi yang tidak tertangkap?
- A. Mengembalikan `false`
- B. PHP melempar **`FiberError`**
- C. Mengembalikan nilai dari `Fiber::suspend()` terakhir
- D. Memulai ulang Fiber dari awal

**Jawaban Benar:** B
**Penjelasan:** `Fiber::getReturn()` hanya boleh dipanggil setelah Fiber selesai secara normal (`$fiber->isTerminated() === true` dan tidak keluar karena eksepsi); memanggilnya sebelum selesai atau setelah gagal akan melempar `FiberError`.

## Sumber

- [Fibers — PHP Manual](https://www.php.net/manual/en/language.fibers.php)
- [The Fiber class — PHP Manual](https://www.php.net/manual/en/class.fiber.php)
- [RFC: Fibers — PHP Wiki](https://wiki.php.net/rfc/fibers)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
