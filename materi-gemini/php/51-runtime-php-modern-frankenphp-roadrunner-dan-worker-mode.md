# Runtime PHP Modern di Luar FPM: FrankenPHP, RoadRunner, Swoole, dan Aturan *Worker Mode*

- **Tingkat:** Lanjut
- **Ringkasan:** Memahami cara kerja server aplikasi PHP modern berbasis *worker berumur panjang* (**FrankenPHP** di atas Caddy dan **RoadRunner**) yang menahan kerangka kerja tetap di memori antar-permintaan HTTP hingga berkali-kali lebih cepat, beserta disiplin pencegahan kebocoran *state* antar-pengguna.

## Mengapa *Worker Mode* di FrankenPHP dan RoadRunner Jauh Lebih Cepat daripada PHP-FPM Klasik?

Pada arsitektur tradisional **Nginx + PHP-FPM (*Share-Nothing Architecture*)**, setiap kali ada 1 permintaan HTTP masuk, PHP harus memuat ulang `vendor/autoload.php`, menginisialisasi Dependency Injection Container, membaca konfigurasi, menjalankan controller, lalu **menghancurkan seluruh objek aplikasi di akhir permintaan tersebut**. Ketika ada 1.000 permintaan per detik, proses *booting* kerangka kerja yang sama diulang 1.000 kali per detik!

Server aplikasi modern seperti **FrankenPHP** (server aplikasi PHP resmi di bawah naungan PHP Foundation yang dibangun di atas Caddy dan Go, mendukung HTTP/3 & *Early Hints* `103` secara bawaan) serta **RoadRunner** menghadirkan **Worker Mode**:
1. Aplikasi, konfigurasi, dan Dependency Injection Container di-*boot* **hanya satu kali** saat worker dinyalakan;
2. Worker kemudian masuk ke dalam perulangan cepat (`while (frankenphp_handle_request(...))`) yang langsung melayani ribuan permintaan HTTP beruntun dari memori RAM tanpa biaya *booting* ulang!

Namun, kecepatan tinggi ini membawa tanggung jawab baru: karena proses PHP tidak mati di akhir permintaan, **setiap variabel `static` atau properti di dalam *Singleton Service* akan tetap bertahan ke permintaan pengguna berikutnya**!

> **🚫 Kerentanan & Kesalahan Umum:** Saat menjalankan aplikasi PHP di dalam *Worker Mode* (FrankenPHP / RoadRunner), menyimpan data pengguna yang sedang login di dalam properti `static` atau *Singleton Service* akan membuat pengguna berikutnya melihat data rahasia milik pengguna sebelumnya (*Cross-Request State Leakage*)!

## 1. Perbandingan Arsitektur PHP-FPM vs FrankenPHP / RoadRunner Worker Mode

Pahami perbedaan mendasar antara siklus hidup FPM klasik dan *Worker Mode*:

| Karakteristik | PHP-FPM Klasik (*Share-Nothing*) | FrankenPHP / RoadRunner (*Worker Mode*) |
| :--- | :--- | :--- |
| **Biaya Inisialisasi Framework** | Dijalankan ulang pada **setiap permintaan HTTP**. | Dijalankan **1 kali saat worker startup**, lalu dipakai ulang ribuan kali. |
| **Properti `static` & Singleton** | Otomatis terhapus di akhir permintaan HTTP. | **Bertahan lintas permintaan!** Menyimpan state pengguna di sini memicu *Cross-Request Data Leak*! |
| **Superglobals (`$_GET`, `$_POST`, `$_SERVER`)** | Dibuat segar untuk 1 permintaan. | Di-reset ulang untuk setiap iterasi di dalam callback `frankenphp_handle_request($handler)` (atau dikirim sebagai objek PSR-7 di RoadRunner). |
| **Daur Ulang Worker (*Max Requests*)** | `pm.max_requests = 1000` di konfigurasi pool FPM. | Loop worker berhenti setelah `$maksPermintaan` (mis. 1.000 request) lalu otomatis di-restart segar oleh FrankenPHP/RoadRunner. |

## 2. Pola *Worker Loop* di FrankenPHP dan Reset Layanan Per Permintaan (`ResetInterface`)

Di dalam skrip worker FrankenPHP, seluruh inisialisasi berat diletakkan **di luar** fungsi callback `$penangan`, sedangkan fungsi `$penangan` yang diteruskan ke **`frankenphp_handle_request($penangan)`** hanya menangani satu permintaan HTTP saat ini lalu membersihkan state sementara di blok `finally`:

```php
<?php
declare(strict_types=1);

interface LayananDapatDireset
{
    public function resetStatePermintaan(): void;
}

final class KonteksPermintaanAman implements LayananDapatDireset
{
    /** @var array<string, mixed> */
    private array $atributSementara = [];

    public function set(string $kunci, mixed $nilai): void
    {
        $this->atributSementara[$kunci] = $nilai;
    }

    public function get(string $kunci): mixed
    {
        return $this->atributSementara[$kunci] ?? null;
    }

    public function resetStatePermintaan(): void
    {
        // WAJIB dikosongkan di akhir setiap permintaan agar tidak bocor ke pengguna berikutnya!
        $this->atributSementara = [];
    }
}

final class KernelAplikasiProduksi
{
    public function __construct(
        public readonly KonteksPermintaanAman $konteks = new KonteksPermintaanAman(),
    ) {}

    public function tanganiPermintaanSaatIni(array $server, array $get, array $post): array
    {
        try {
            $this->konteks->set('uri', $server['REQUEST_URI'] ?? '/');
            return [
                'status' => 200,
                'uri'    => $this->konteks->get('uri'),
            ];
        } finally {
            // Pastikan state per-request SELALU dibersihkan meskipun terjadi eksepsi!
            $this->konteks->resetStatePermintaan();
        }
    }
}

// Pola Worker Loop pada FrankenPHP: aplikasi diinisialisasi sekali di luar loop
$kernelAplikasi = new KernelAplikasiProduksi();

$penangan = static function () use ($kernelAplikasi): void {
    $kernelAplikasi->tanganiPermintaanSaatIni($_SERVER, $_GET, $_POST);
};

$maksPermintaan = 1000;
for ($hitung = 0; $hitung < $maksPermintaan; $hitung++) {
    $lanjut = function_exists('frankenphp_handle_request')
        ? frankenphp_handle_request($penangan)
        : false;
    gc_collect_cycles();
    if (!$lanjut) {
        break;
    }
}
```

## 3. Mengirim *HTTP 103 Early Hints* dengan `headers_send(103)` di FrankenPHP

Salah satu fitur unik FrankenPHP adalah dukungan asli untuk kode status **HTTP `103 Early Hints`**: sebelum server PHP Anda selesai menjalankan kueri database yang memakan waktu 150 ms, Anda dapat mengirim header `<link rel="preload">` lebih dulu menggunakan `headers_send(103)` agar peramban pengguna langsung mulai mengunduh berkas CSS dan fon sementara PHP masih menghitung isi halaman HTML!

```php
<?php
declare(strict_types=1);

function kirimEarlyHintsJikaDidukung(string $jalurCssUtama): void
{
    header("Link: <{$jalurCssUtama}>; rel=preload; as=style", false);
    if (function_exists('headers_send')) {
        headers_send(103);
    }
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menyimpan objek `$penggunaSaatIni` atau `$keranjangBelanja` sebagai properti di dalam *Singleton Service* tanpa meresetnya:** Pada permintaan ke-1, Budi (Admin) login dan `$this->penggunaAktif = $budi` disimpan di `AuthService`. Pada permintaan ke-2, pengunjung anonim membuka situs dan dilayani oleh worker yang sama—jika `$this->penggunaAktif` belum di-reset di blok `finally`, pengunjung anonim tersebut otomatis dianggap sebagai Budi (Admin)! Teruskan konteks pengguna sebagai argumen metode atau pastikan layanan mengimplementasikan `resetStatePermintaan()`.
2. **Memanggil `exit()` atau `die()` di tengah controller saat berjalan di *Worker Mode*:** Memanggil `exit()` akan mematikan seluruh proses worker sehingga membatalkan keuntungan performa *Worker Mode* (worker terpaksa di-boot ulang dari awal oleh Caddy/RoadRunner). Kembalikan objek `Response` secara terstruktur.
3. **Menambahkan elemen terus-menerus ke array `private static array $logQuery = []`:** Di *Worker Mode*, array statis yang terus ditambah tanpa dibersihkan akan membengkak di setiap permintaan hingga memicu *Out of Memory*.

## Latihan Praktik Mandiri

1. Buat berkas `WorkerKernel.php` yang memuat `KonteksPermintaanAman` dan `KernelAplikasiProduksi`.
2. Tulis pengujian PHPUnit yang memanggil `tanganiPermintaanSaatIni()` dua kali berturut-turut pada **instans `$kernelAplikasi` yang sama** (menyimulasikan 2 permintaan pengguna berbeda di *Worker Mode*), lalu pastikan bahwa data yang disetel pada permintaan pertama sudah bersih (`null`) setelah permintaan selesai, bahkan ketika permintaan pertama sengaja dibuat melempar eksepsi!

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Saat menjalankan aplikasi PHP di dalam *Worker Mode* (FrankenPHP / RoadRunner), menyimpan data pengguna yang sedang login di dalam properti `static` atau *Singleton Service* akan membuat pengguna berikutnya melihat data rahasia milik pengguna sebelumnya (*Cross-Request State Leakage*)!*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena proses PHP di dalam *Worker Mode* tetap hidup melayani ribuan permintaan beruntun dari berbagai pengguna, sehingga state yang tertinggal di variabel `static` atau properti *Singleton* pada permintaan pertama akan bocor ke permintaan pengguna berikutnya
- C. Karena PHP 8.5 tidak lagi mendukung kata kunci `static`
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Berbeda dengan PHP-FPM yang menghancurkan memori di akhir setiap permintaan, proses *Worker Mode* mempertahankan seluruh objek layanan dan variabel statis di RAM lintas permintaan.

### Soal 2
Dalam skrip worker FrankenPHP, bagian kode manakah yang diletakkan **di luar** `frankenphp_handle_request($callback)` dan bagian manakah yang diletakkan **di dalam** `$callback`?
- A. Kueri data pengguna diletakkan di luar, sedangkan `vendor/autoload.php` diletakkan di dalam `$callback`
- B. Pemuatan autoloader Composer, pembacaan konfigurasi aplikasi, dan pembuatan *Kernel / Dependency Injection Container* diletakkan **satu kali di luar** loop, sedangkan pemrosesan permintaan HTTP saat ini (`$_SERVER`, `$_GET`, `$_POST`) serta pembersihan state per-permintaan dijalankan **di dalam** `$callback`
- C. Seluruh kode aplikasi diletakkan di luar `$callback` dan `$callback` dibiarkan kosong
- D. `frankenphp_handle_request()` hanya boleh dipanggil di dalam peramban web

**Jawaban Benar:** B
**Penjelasan:** Kecepatan *Worker Mode* berasal dari penempatan proses *booting* aplikasi di luar perulangan `frankenphp_handle_request()`, sehingga setiap permintaan HTTP baru langsung masuk ke `$callback` dengan kerangka kerja yang sudah siap di memori.

### Soal 3
Mengapa perulangan worker pada FrankenPHP atau RoadRunner tetap disarankan berhenti secara anggun setelah melayani sejumlah permintaan tertentu (misalnya `$maksPermintaan = 1000`) disertai pemanggilan `gc_collect_cycles()`?
- A. Karena protokol HTTP/3 membatasi maksimal 1.000 paket per hari
- B. Untuk membersihkan siklus referensi memori dan mencegah kebocoran memori jangka panjang (*memory bloat*) dari pustaka pihak ketiga, karena server aplikasi (FrankenPHP/RoadRunner) akan langsung mengganti worker yang berhenti tersebut dengan proses worker baru yang segar secara transparan
- C. Agar database otomatis terhapus setiap 1.000 permintaan
- D. Karena PHP tidak dapat menghitung angka di atas 1.000

**Jawaban Benar:** B
**Penjelasan:** Membatasi umur worker hingga misalnya 500–1.000 permintaan menggabungkan kecepatan tinggi *Worker Mode* dengan keamanan memori jangka panjang.

## Sumber

- [Worker Mode — FrankenPHP Documentation](https://frankenphp.dev/docs/worker/)
- [RoadRunner Documentation](https://docs.roadrunner.dev/)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
