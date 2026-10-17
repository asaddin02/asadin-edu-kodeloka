# Arsitektur Berbasis Peristiwa (*Event-Driven*) dengan PSR-14 Event Dispatcher

- **Tingkat:** Lanjut
- **Ringkasan:** Melepaskan ketergantungan langsung (*decoupling*) antara aksi utama bisnis (misalnya `PesananDibayar`) dan efek sampingnya (kirim email kuitansi, potong stok gudang, catat audit log) menggunakan standar **PSR-14 (`EventDispatcherInterface` dan `ListenerProviderInterface`)**.

## Mengapa Metode `CheckoutService::bayar()` Tidak Boleh Memanggil 6 Layanan Sekaligus Secara Langsung?

Pada awal pembuatan aplikasi, metode `CheckoutService::bayar()` biasanya hanya memproses pembayaran dan mengubah status pesanan di database. Namun seiring bertambahnya fitur bisnis, tim mulai menjejalkan kode tambahan ke dalam metode yang sama:
1. Kirim surel kuitansi (`$this->mailer->kirim(...)`);
2. Kirim pesan WhatsApp (`$this->wa->kirim(...)`);
3. Tambahkan poin loyalitas pelanggan (`$this->poin->tambah(...)`);
4. Kirim webhook ke sistem gudang (`$this->gudang->notifikasi(...)`);
5. Catat metrik analitik pemasaran (`$this->analitik->catat(...)`).

Akibatnya, `CheckoutService` membengkak dengan 6 dependensi di konstruktornya, melanggar **Open/Closed Principle** (setiap kali ada efek samping baru, kode inti pembayaran harus dibongkar), dan yang paling berbahaya: jika layanan analitik atau server email sedang gangguan, **seluruh transaksi pembayaran pelanggan ikut gagal**!

Standar **[PHP-FIG PSR-14: Event Dispatcher](https://www.php-fig.org/psr/psr-14/)** menyelesaikan masalah ini dengan memisahkan pengirim peristiwa (**Emitter**) dari para pendengarnya (**Listeners**).

> **🚫 Kerentanan & Kesalahan Umum:** Menumpuk pemanggilan layanan email, layanan pengiriman WhatsApp, pembuatan PDF faktur, dan webhook akuntansi secara langsung di dalam satu metode `CheckoutService::bayar()` membuat metode tersebut rapuh: jika server email lambat, seluruh proses pembayaran ikut gagal!

## 1. Tiga Komponen Utama Standar PSR-14 (`Event`, `ListenerProvider`, `EventDispatcher`)

Berbeda dengan sistem event lama yang menggunakan nama string rawan salah ketik (`dispatch('pesanan.dibayar', $data)`), di **PSR-14** sebuah **Event adalah objek class PHP biasa (POPO)** dan jenis event ditentukan langsung dari tipe class-nya (`PesananDibayarEvent::class`)!

| Komponen PSR-14 | Antarmuka Standar (`Psr\EventDispatcher\...`) | Tanggung Jawab Utama |
| :--- | :--- | :--- |
| **1. Event (Objek Peristiwa)** | Class PHP biasa (opsional mengimplementasikan **`StoppableEventInterface`**). | Membawa data konteks peristiwa (misalnya `$nomorPesanan`, `$totalRupiah`, `$waktuBayar`). |
| **2. Listener (Pendengar)** | `callable(object $event): void` (misalnya class dengan `__invoke(PesananDibayarEvent $e)`). | Menjalankan satu reaksi spesifik ketika objek Event tersebut dipancarkan. |
| **3. Listener Provider** | **`ListenerProviderInterface`** (`getListenersForEvent(object $event): iterable`). | Memetakan objek `$event` (termasuk class induk/interface-nya) ke daftar *listener* yang relevan. |
| **4. Event Dispatcher** | **`EventDispatcherInterface`** (`dispatch(object $event): object`). | Meminta daftar *listener* dari Provider, memanggilnya satu per satu (sambil mengecek `isPropagationStopped()`), lalu mengembalikan `$event`. |

## 2. Implementasi Lengkap PSR-14 Event Dispatcher dan Listener Provider

Berikut adalah implementasi bersih dan siap pakai dari arsitektur PSR-14 di PHP 8.2–8.5:

```php
<?php
declare(strict_types=1);

interface StoppableEventInterface
{
    public function isPropagationStopped(): bool;
}

interface ListenerProviderInterface
{
    /** @return iterable<callable> */
    public function getListenersForEvent(object $event): iterable;
}

interface EventDispatcherInterface
{
    public function dispatch(object $event): object;
}

// 1. Objek Event yang Immutable untuk peristiwa yang sudah terjadi
final readonly class PesananDibayarEvent
{
    public function __construct(
        public string $nomorPesanan,
        public int $totalRupiah,
        public DateTimeImmutable $waktuBayar,
    ) {}
}

// 2. Listener Provider berbasis tipe class Event
final class PenyediaPendengar implements ListenerProviderInterface
{
    /** @var array<class-string, list<callable>> */
    private array $pendengar = [];

    /** @param class-string $kelasEvent */
    public function daftarkan(string $kelasEvent, callable $listener): void
    {
        $this->pendengar[$kelasEvent][] = $listener;
    }

    public function getListenersForEvent(object $event): iterable
    {
        foreach ($this->pendengar as $kelasTerdaftar => $daftarCallable) {
            if ($event instanceof $kelasTerdaftar) {
                yield from $daftarCallable;
            }
        }
    }
}

// 3. Event Dispatcher sesuai spesifikasi PSR-14
final readonly class PengirimPeristiwa implements EventDispatcherInterface
{
    public function __construct(
        private ListenerProviderInterface $provider,
    ) {}

    public function dispatch(object $event): object
    {
        foreach ($this->provider->getListenersForEvent($event) as $listener) {
            if ($event instanceof StoppableEventInterface && $event->isPropagationStopped()) {
                break;
            }
            $listener($event);
        }
        return $event;
    }
}
```

## 3. Membedakan Listener Sinkron Ringan vs Listener yang Mendorong ke Antrean (*Async Queue*)

Perhatikan bahwa secara bawaan, `EventDispatcherInterface::dispatch($event)` di PSR-14 memanggil para *listener* secara **sinkron berurutan** di dalam proses yang sama. Oleh sebab itu:
- Jika sebuah *listener* melakukan pekerjaan cepat di memori/database lokal (seperti mencatat baris audit log), ia boleh langsung menjalankannya.
- Jika *listener* membutuhkan panggilan jaringan ke pihak ketiga yang lambat (seperti mengirim email SMTP atau webhook), *listener* tersebut **cukup mendorong tugas (*enqueue job*) ke dalam antrean latar belakang**, bukan menghubungi server SMTP secara langsung!

```php
<?php
declare(strict_types=1);

final class PendengarEmailKuitansi
{
    /** @var list<string> */
    public array $antreanTerkirim = [];

    public function __invoke(PesananDibayarEvent $event): void
    {
        // Masukkan tugas pengiriman kuitansi ke antrean latar belakang (cepat & tahan gagal)
        $this->antreanTerkirim[] = "Kirim kuitansi untuk {$event->nomorPesanan} (Rp {$event->totalRupiah})";
    }
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Memancarkan `PesananDibayarEvent` *sebelum* transaksi database `$pdo->commit()` selesai:** Jika Anda memanggil `$dispatcher->dispatch(new PesananDibayarEvent(...))` ketika transaksi database masih terbuka, lalu listener memasukkan tugas ke Redis dan worker latar belakang langsung mengambilnya 2 milidetik kemudian **sebelum** `$pdo->commit()` tereksekusi, worker tidak akan menemukan pesanan tersebut di database! Selalu pancarkan event **setelah** `commit()` berhasil (atau gunakan pola *Transactional Outbox*).
2. **Menelan eksepsi di dalam `EventDispatcher::dispatch()` secara diam-diam:** Spesifikasi PSR-14 secara tegas menetapkan bahwa `EventDispatcher` **tidak boleh menangkap dan menyembunyikan eksepsi** yang dilempar oleh *listener*; jika sebuah *listener* tidak kritis (seperti analitik), maka *listener* itulah yang bertanggung jawab menangani `try...catch`-nya sendiri.
3. **Menggunakan nama event berbentuk perintah masa depan (`KirimEmailEvent`) alih-alih fakta masa lalu (`PesananDibayarEvent`):** Beri nama Event menggunakan bentuk pasif/lampau yang menyatakan **fakta bisnis yang baru saja terjadi**, sehingga puluhan listener baru dapat ditambahkan di masa depan tanpa perlu mengubah nama event-nya.

## Latihan Praktik Mandiri

1. Buat berkas `EventDispatcherPsr14.php` yang memuat implementasi `PenyediaPendengar`, `PengirimPeristiwa`, `PesananDibayarEvent`, serta sebuah event yang mengimplementasikan `StoppableEventInterface`.
2. Tulis pengujian PHPUnit untuk memverifikasi bahwa:
   - dua *listener* yang didaftarkan untuk `PesananDibayarEvent::class` terpanggil berurutan;
   - ketika *listener* pertama pada `StoppableEventInterface` menghentikan perambatan (`isPropagationStopped() === true`), *listener* kedua tidak lagi dipanggil.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Menumpuk pemanggilan layanan email, layanan pengiriman WhatsApp, pembuatan PDF faktur, dan webhook akuntansi secara langsung di dalam satu metode `CheckoutService::bayar()` membuat metode tersebut rapuh: jika server email lambat, seluruh proses pembayaran ikut gagal!*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena kegagalan atau kelambatan satu efek samping (misalnya server email) ikut menggagalkan atau memperlambat seluruh proses pembayaran, dan metode menjadi sulit dirawat serta diuji karena menanggung terlalu banyak tanggung jawab
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Menumpuk pemanggilan layanan email, layanan pengiriman WhatsApp, pembuatan PDF faktur, dan webhook akuntansi secara langsung di dalam satu metode `CheckoutService::bayar()` membuat metode tersebut rapuh: jika server email lambat, seluruh proses pembayaran ikut gagal!

### Soal 2
Dalam spesifikasi **PHP-FIG PSR-14 (Event Dispatcher)**, bagaimana sebuah `EventDispatcherInterface` menentukan *listener* mana saja yang harus dipanggil ketika `dispatch(object $event)` dijalankan?
- A. Dengan membaca berkas konfigurasi `.htaccess` di server Apache
- B. Dengan meneruskan objek `$event` ke **`ListenerProviderInterface::getListenersForEvent($event)`**, yang mencocokkan tipe class atau interface dari objek `$event` tersebut terhadap daftar *listener* yang terdaftar
- C. Dengan memanggil semua fungsi global di PHP yang diawali kata `on_`
- D. Dengan mengirim kueri `SELECT` ke tabel `events` di MySQL

**Jawaban Benar:** B
**Penjelasan:** PSR-14 memisahkan tugas pencocokan pendengar ke dalam `ListenerProviderInterface` dan menggunakan tipe class/interface objek `$event` secara langsung sebagai pengenal peristiwa.

### Soal 3
Antarmuka standar PSR-14 apakah yang harus diimplementasikan oleh sebuah class Event apabila salah satu *listener* diizinkan menghentikan eksekusi *listener* berikutnya?
- A. `JsonSerializable`
- B. `Psr\EventDispatcher\StoppableEventInterface` (yang memiliki metode `isPropagationStopped(): bool`)
- C. `IteratorAggregate`
- D. `Throwable`

**Jawaban Benar:** B
**Penjelasan:** Sebelum memanggil setiap *listener* berikutnya, `EventDispatcher` memeriksa apakah `$event instanceof StoppableEventInterface && $event->isPropagationStopped()`, dan langsung menghentikan perulangan jika bernilai `true`.

## Sumber

- [PSR-14: Event Dispatcher — PHP-FIG](https://www.php-fig.org/psr/psr-14/)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
