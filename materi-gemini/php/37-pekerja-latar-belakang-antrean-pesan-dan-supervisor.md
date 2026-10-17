# Pekerja Latar Belakang (*Background Workers*), Antrean Tugas (*Job Queue*), dan Penanganan Sinyal POSIX (`pcntl`)

- **Tingkat:** Lanjut
- **Ringkasan:** Memindahkan tugas berat (pengiriman email massal, pembuatan laporan PDF, pemrosesan video) dari siklus permintaan HTTP ke **Worker CLI** di latar belakang, menerapkan penghentian anggun (*graceful shutdown*) saat menerima sinyal `SIGTERM`/`SIGINT` dengan `pcntl_async_signals()`, serta mencegah kebocoran memori worker berumur panjang.

## Mengapa Proses Worker Antrean Tidak Boleh Dimatikan Paksa di Tengah Pekerjaan?

Untuk menjaga waktu respons HTTP di bawah 100 milidetik, pekerjaan berat seperti membuat laporan PDF bulanan, mengirim notifikasi ke ribuan pengguna, atau memanggil webhook pihak ketiga wajib dipindahkan ke dalam **Antrean Tugas (*Job Queue*)** dan dikerjakan oleh proses **Worker CLI PHP** yang berjalan terus-menerus di latar belakang (dikelola oleh `systemd`, `Supervisor`, atau pod Kubernetes).

Namun, saat Anda melakukan *deployment* versi kode baru atau saat Kubernetes menghentikan pod, sistem operasi akan mengirimkan sinyal **`SIGTERM`** ke proses worker Anda, memberi waktu tenggang (biasanya 10–30 detik) sebelum mengirimkan kapak **`SIGKILL` (`kill -9`)**. Jika worker PHP Anda tidak menangkap `SIGTERM` menggunakan **`pcntl_async_signals(true)`**, proses akan langsung mati mendadak tepat ketika sedang memproses separuh transaksi pembayaran!

> **🚫 Kerentanan & Kesalahan Umum:** Menghentikan paksa proses worker antrean dengan `kill -9` (`SIGKILL`) saat worker sedang berada di tengah transaksi pembayaran akan meninggalkan data dalam keadaan menggantung; tangkap sinyal `SIGTERM` agar worker menyelesaikan 1 tugas terakhirnya lalu keluar dengan bersih.

## 1. Perbandingan Eksekusi Siklus HTTP FPM vs Background Worker CLI

Berbeda dengan skrip PHP-FPM yang hidup hanya 50 milidetik lalu seluruh memorinya direset, proses Worker CLI berjalan selama berjam-jam sehingga menuntut disiplin manajemen sinyal dan memori:

| Aspek Operasi | Siklus Permintaan HTTP (PHP-FPM) | Background Worker CLI (`php worker.php`) |
| :--- | :--- | :--- |
| **Umur Proses** | Sangat pendek (1 permintaan lalu selesai). | Berumur panjang (*long-running daemon* di dalam perulangan `while`). |
| **Penanganan Saat Deployment** | FPM menyelesaikan permintaan aktif (`request_terminate_timeout`). | Wajib menangkap **`SIGTERM` / `SIGINT`** dengan `pcntl_signal()` agar berhenti di antara dua tugas (*Graceful Shutdown*). |
| **Manajemen Memori RAM** | Dibersihkan otomatis di akhir setiap permintaan HTTP. | Wajib memanggil **`gc_collect_cycles()`** dan keluar secara berkala jika mencapai **batas jumlah tugas** atau **batas memori** (agar di-restart segar oleh Supervisor/systemd). |
| **Ketahanan Tugas Gagal** | Menampilkan pesan galat ke peramban pengguna. | Menangkap **`Throwable`** per tugas, menerapkan *retry* dengan *exponential backoff*, dan memindahkan tugas yang terus gagal ke **Dead-Letter Queue (DLQ)**. |

## 2. Implementasi Worker CLI dengan *Graceful Shutdown* (`pcntl`) dan Batas Memori

Dengan mengaktifkan **`pcntl_async_signals(true)`** (tersedia sejak PHP 7.1+, jauh lebih cepat daripada `declare(ticks=1)` lama), Zend Engine secara otomatis memeriksa sinyal POSIX yang masuk tanpa mengorbankan performa. Begitu `SIGTERM` (dari Supervisor/Kubernetes/systemd) atau `SIGINT` (`Ctrl+C` di terminal) diterima, penangan sinyal mengubah bendera `$harusBerhenti = true` sehingga worker **menyelesaikan 1 tugas yang sedang dikerjakan hingga tuntas**, lalu keluar dari perulangan `while` dengan bersih:

```php
<?php
declare(strict_types=1);

final class PekerjaAntreanTangguh
{
    private bool $harusBerhenti = false;

    public function __construct(
        private readonly int $maksTugas = 500,
        private readonly int $batasMemoriByte = 128 * 1024 * 1024, // 128 MB
    ) {
        if (function_exists('pcntl_async_signals')) {
            pcntl_async_signals(true);
            $penangan = function (): void {
                $this->harusBerhenti = true;
            };
            pcntl_signal(SIGTERM, $penangan);
            pcntl_signal(SIGINT, $penangan);
        }
    }

    public function mintaBerhenti(): void
    {
        $this->harusBerhenti = true;
    }

    /**
     * @param callable(): (array{id: string, payload: mixed}|null) $ambilTugas
     * @param callable(array{id: string, payload: mixed}): void $prosesTugas
     */
    public function jalankanLoop(callable $ambilTugas, callable $prosesTugas): int
    {
        $jumlahDiproses = 0;

        while (!$this->harusBerhenti) {
            $tugas = $ambilTugas();
            if ($tugas === null) {
                // Jika antrean kosong, tidur sejenak agar CPU tidak berputar 100% (busy-waiting)
                usleep(250_000);
                if ($this->apakahMelebihiBatas($jumlahDiproses)) {
                    break;
                }
                continue;
            }

            try {
                $prosesTugas($tugas);
            } catch (Throwable $e) {
                // Catat galat ke log / pindahkan ke antrean retry tanpa mematikan proses worker!
                fwrite(STDERR, "[GALAT TUGAS {$tugas['id']}] {$e->getMessage()}" . PHP_EOL);
            }

            $jumlahDiproses++;
            gc_collect_cycles();

            if ($this->apakahMelebihiBatas($jumlahDiproses)) {
                break;
            }
        }

        return $jumlahDiproses;
    }

    private function apakahMelebihiBatas(int $jumlahDiproses): bool
    {
        return $jumlahDiproses >= $this->maksTugas
            || memory_get_usage(true) >= $this->batasMemoriByte;
    }
}
```

## 3. Mengapa Tugas Antrean Wajib Bersifat *Idempoten*?

Dalam sistem antrean terdistribusi, jaringan atau database bisa terputus tepat setelah worker selesai mengirim surel/memotong saldo tetapi **sebelum** worker sempat menandai tugas tersebut sebagai `"selesai"` (*At-Least-Once Delivery*). Akibatnya, tugas yang sama dapat dikirim ulang untuk kedua kalinya ke worker lain!

Oleh karena itu, setiap kode pemroses tugas (`$prosesTugas`) wajib dirancang **Idempoten**: periksa status di database terlebih dahulu (misalnya `if ($pesanan->apakahSudahDikirimEmail()) return;`) agar eksekusi ulang tugas yang sama tidak menimbulkan pengiriman ganda.

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Lupa memberi `sleep()` atau `usleep()` (atau `BLPOP` Redis) saat antrean sedang kosong:** Perulangan `while (true)` yang terus-menerus mengeksekusi `SELECT * FROM jobs` tanpa jeda saat antrean kosong akan membakar 100% inti CPU server dan membanjiri database dengan ribuan kueri kosong per detik!
2. **Tidak menangkap `Throwable` di dalam perulangan `while`:** Jika satu tugas berisi data yang memicu `TypeError` atau `InvalidArgumentException` dan tidak ditangkap di dalam loop, seluruh proses worker akan mati dan macet pada satu pesan rusak tersebut (*Poison Pill Message*).
3. **Membiarkan koneksi PDO hidup berhari-hari tanpa menangani *MySQL server has gone away* / terputusnya soket:** Pada worker yang jarang menerima tugas di malam hari, firewall atau database dapat menutup koneksi TCP yang menganggur; pastikan worker memeriksa koneksi atau keluar berkala setiap beberapa ratus tugas/jam agar dimulai ulang dengan koneksi segar oleh `systemd`/`Supervisor`.

## Latihan Praktik Mandiri

1. Buat berkas `PekerjaAntreanTangguh.php` seperti pada contoh di atas.
2. Tulis pengujian otomatis di PHPUnit yang menyimulasikan antrean berisi 10 tugas dengan `$maksTugas = 3`, serta skenario ketika tugas ke-2 melempar `RuntimeException`: pastikan worker menangkap eksepsi tersebut, tetap memproses tugas ke-3, dan berhenti tepat setelah 3 tugas selesai (`assertSame(3, $hasil)`).

## Kuis Pemahaman

### Soal 1
Mengapa proses worker antrean latar belakang wajib menangkap sinyal POSIX **`SIGTERM`** (dan `SIGINT`) menggunakan `pcntl_async_signals(true)` dan `pcntl_signal()`?
- A. Agar proses worker kebal terhadap pencabutan kabel listrik server
- B. Agar ketika sistem orkestrasi (Supervisor, systemd, atau Kubernetes) meminta penghentian saat *deployment*, worker tidak mati mendadak di tengah transaksi, melainkan menyelesaikan 1 tugas yang sedang dikerjakan hingga tuntas lalu keluar dari perulangan dengan bersih (*Graceful Shutdown*)
- C. Karena sinyal `SIGKILL` (`kill -9`) dapat ditangkap dan diabaikan oleh `pcntl_signal()`
- D. Untuk menggandakan kecepatan jaringan HTTP

**Jawaban Benar:** B
**Penjelasan:** Sinyal `SIGTERM` adalah permintaan penghentian sopan dari sistem operasi. Dengan menangkap `SIGTERM` dan menyetel bendera `$harusBerhenti = true`, worker menyelesaikan iterasi tugas saat ini secara utuh sebelum keluar. (Catatan: `SIGKILL` tidak pernah bisa ditangkap oleh proses mana pun).

### Soal 2
Mengapa praktik terbaik pada proses worker PHP yang berjalan terus-menerus adalah membatasi jumlah maksimum tugas (misalnya berhenti otomatis setelah memproses 500 tugas atau saat penggunaan RAM mendekati batas) lalu membiarkan `Supervisor` / `systemd` menyalakannya kembali?
- A. Karena PHP lisensinya hanya mengizinkan 500 perulangan
- B. Untuk mencegah akumulasi kebocoran memori perlahan (*memory leak* pada cache statis atau pustaka pihak ketiga) serta menyegarkan koneksi sumber daya jangka panjang secara berkala tanpa waktu henti
- C. Agar berkas log otomatis terhapus
- D. Karena `while` di PHP maksimal berjalan selama 5 menit

**Jawaban Benar:** B
**Penjelasan:** Banyak pustaka PHP tradisional ditulis dengan asumsi proses langsung mati setelah 1 permintaan HTTP. Me-restart proses worker secara anggun setelah $N$ tugas atau batas memori memastikan RAM kembali bersih 100%.

### Soal 3
Apa yang terjadi jika sebuah pesan rusak di dalam antrean (*Poison Pill*) melempar `TypeError` di dalam loop worker yang **tidak** membungkus pemrosesan tugasnya dengan `try { ... } catch (Throwable $e)`?
- A. Pesan tersebut otomatis diperbaiki oleh PHP
- B. Proses worker langsung berhenti mendadak (*crash*), lalu saat dinyalakan ulang oleh Supervisor ia akan mengambil pesan rusak yang sama lagi dan mati berulang-ulang sehingga seluruh antrean tugas di belakangnya macet total
- C. Pesan tersebut otomatis terkirim ke pengguna sebagai email
- D. Database otomatis menghapus seluruh tabel antrean

**Jawaban Benar:** B
**Penjelasan:** Menangkap `Throwable` (yang mencakup `Exception` maupun `Error` seperti `TypeError`) di sekitar pemrosesan tiap tugas memungkinkan worker mencatat kegagalan, menaikkan penghitung *attempt*, atau memindahkan tugas rusak ke *Dead-Letter Queue* tanpa melumpuhkan antrean.

## Sumber

- [`pcntl_async_signals` — PHP Manual](https://www.php.net/manual/en/function.pcntl-async-signals.php)
- [`pcntl_signal` — PHP Manual](https://www.php.net/manual/en/function.pcntl-signal.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
