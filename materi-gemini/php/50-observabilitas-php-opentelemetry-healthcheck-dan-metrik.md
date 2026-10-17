# Observabilitas Aplikasi PHP: Pelacakan Terdistribusi (`X-Request-Id` / W3C `traceparent`), Health Check, dan Profiling

- **Tingkat:** Lanjut
- **Ringkasan:** Menyematkan *Correlation ID* / header standar W3C **`traceparent`** di setiap log dan panggilan cURL keluar agar perjalanan sebuah permintaan dapat dilacak lintas layanan, merancang endpoint `/healthz` (*liveness*) dan `/readyz` (*readiness*), serta mendiagnosis leher botol CPU dengan profiler.

## Mengapa Memeriksa Koneksi Database di Endpoint *Liveness Probe* (`/healthz`) Dapat Melumpuhkan Seluruh Klaster Anda?

Dalam orkestrasi kontainer modern (seperti Kubernetes, Docker Swarm, atau Load Balancer cloud), sistem memantau kesehatan aplikasi PHP Anda melalui dua endpoint yang tujuannya **sangat berbeda**:
1. **Liveness Probe (`/healthz`):** Menjawab pertanyaan: *"Apakah proses PHP/web server di dalam kontainer ini masih hidup atau sudah macet (*deadlock*) sehingga kontainer harus **dibunuh dan di-restart**?"*
2. **Readiness Probe (`/readyz`):** Menjawab pertanyaan: *"Apakah kontainer ini sedang siap menerima trafik pengguna baru, atau sedang menunggu database/Redis pulih sehingga harus **dilepas sementara dari Load Balancer tanpa di-restart**?"*

Jika Anda menaruh pengecekan koneksi database atau API pihak ketiga di dalam **Liveness Probe (`/healthz`)**, maka saat database mengalami gangguan jaringan selama 5 detik saja, Kubernetes akan mengira seluruh 20 pod PHP Anda rusak lalu **membunuh dan me-restart semua pod secara serentak (*Cascading Failure*)**!

> **🚫 Kerentanan & Kesalahan Umum:** Mengecek koneksi database, Redis, dan API pihak ketiga di dalam endpoint *Liveness Probe* (`/healthz`) Kubernetes akan membuat Kubernetes me-restart container PHP Anda berulang kali ketika layanan pihak ketiga sedang mengalami gangguan sementara; pisahkan *Liveness* dari *Readiness* (`/readyz`).

## 1. Tiga Pilar Observabilitas dan Pemisahan Probe Kesehatan

Berikut adalah arsitektur observabilitas standar untuk aplikasi PHP produksi:

| Komponen Observabilitas | Standar / Format | Fungsi Utama Saat Terjadi Insiden Produksi |
| :--- | :--- | :--- |
| **W3C Trace Context (`traceparent`)** | `00-<32-hex-trace-id>-<16-hex-span-id>-<2-hex-flags>` | Menyatukan jejak satu klik pengguna saat mengalir melintasi API Gateway -> PHP -> layanan Go/Python di Grafana Tempo / Jaeger. |
| **Structured JSON Logging (PSR-3)** | JSON 1 baris memuat `timestamp`, `level`, `message`, **`trace_id`**, `span_id`, dan `context`. | Memungkinkan pencarian seluruh log dari satu transaksi yang gagal di Loki/Elasticsearch hanya dengan 1 `trace_id`. |
| **Liveness Probe (`GET /healthz`)** | Mengembalikan `200 OK` ringan **tanpa** memanggil DB/Redis/API luar. | Memastikan proses PHP-FPM / FrankenPHP sendiri masih sanggup merespons HTTP. |
| **Readiness Probe (`GET /readyz`)** | Menguji `SELECT 1` ke DB dan `PING` ke Redis dengan *timeout* ketat (mis. 1 dtk); mengembalikan `200` atau `503`. | Menghentikan pengiriman trafik pengguna ke pod yang koneksinya ke DB sedang putus tanpa membunuh pod tersebut. |

## 2. Menguraikan dan Meneruskan Header W3C `traceparent` Lintas Layanan

Spesifikasi rekomendasi **[W3C Trace Context](https://www.w3.org/TR/trace-context/)** menetapkan header HTTP standar bernama **`traceparent`** dengan 4 bagian yang dipisahkan tanda hubung (`versi-traceId-parentSpanId-traceFlags`), contohnya:
`00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`
- `00`: Versi format (1 byte hex).
- `4bf92f3577b34da6a3ce929d0e0e4736`: **`trace-id`** (16 byte / 32 karakter hex huruf kecil, tidak boleh nol semua) yang tetap sama di seluruh layanan yang dilewati permintaan tersebut.
- `00f067aa0ba902b7`: **`parent-id` / `span-id`** (8 byte / 16 karakter hex huruf kecil, tidak boleh nol semua) dari pemanggil sebelumnya.
- `01`: **`trace-flags`** (`01` berarti *sampled* / direkam).

```php
<?php
declare(strict_types=1);

/**
 * Membaca header W3C traceparent dari permintaan masuk atau membuat konteks jejak baru jika belum ada.
 *
 * @return array{trace_id: string, span_id: string, parent_span_id: string|null, traceparent_keluar: string}
 */
function bangunKonteksTraceW3c(?string $headerTraceparentMasuk): array
{
    $polaW3c = '/^00-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})$/';
    $spanIdBaru = bin2hex(random_bytes(8)); // 16 karakter hex untuk span layanan PHP ini

    if (
        $headerTraceparentMasuk !== null
        && preg_match($polaW3c, strtolower(trim($headerTraceparentMasuk)), $cocok) === 1
        && $cocok[1] !== str_repeat('0', 32)
        && $cocok[2] !== str_repeat('0', 16)
    ) {
        $traceId      = $cocok[1];
        $parentSpanId = $cocok[2];
        $flags        = $cocok[3];
    } else {
        $traceId      = bin2hex(random_bytes(16)); // 32 karakter hex baru
        $parentSpanId = null;
        $flags        = '01';
    }

    return [
        'trace_id'           => $traceId,
        'span_id'            => $spanIdBaru,
        'parent_span_id'     => $parentSpanId,
        'traceparent_keluar' => "00-{$traceId}-{$spanIdBaru}-{$flags}",
    ];
}
```

Ketika layanan PHP Anda kemudian memanggil layanan pembayaran internal melalui cURL, teruskan `'traceparent: ' . $konteks['traceparent_keluar']` pada `CURLOPT_HTTPHEADER` dan sertakan `'trace_id' => $konteks['trace_id']` di setiap baris log JSON Anda!

## 3. Implementasi Endpoint `/readyz` (*Readiness*) dan `/healthz` (*Liveness*)

Berikut adalah cara memisahkan pemeriksaan kesiapan dependensi (`/readyz`) dari pemeriksaan kehidupan proses (`/healthz`):

```php
<?php
declare(strict_types=1);

function periksaKesiapanLayanan(PDO $pdo, object $redis): array
{
    $status = ['database' => false, 'cache' => false];
    try {
        $pdo->query('SELECT 1');
        $status['database'] = true;
    } catch (Throwable) {}

    try {
        $status['cache'] = ($redis->ping() !== false);
    } catch (Throwable) {}

    $sehatSemua = !in_array(false, $status, strict: true);
    return [
        'kode_http' => $sehatSemua ? 200 : 503,
        'status'    => $sehatSemua ? 'ready' : 'degraded',
        'komponen'  => $status,
    ];
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Mengembalikan status HTTP `200 OK` pada `/readyz` padahal koneksi database gagal (`{"status": "error"}`):** Load balancer dan Kubernetes hanya melihat kode status HTTP (`200–399` dianggap sehat, `>= 400` dianggap tidak siap). Jika salah satu dependensi inti gagal di `/readyz`, Anda **wajib** mengembalikan **`http_response_code(503)`** (*Service Unavailable*).
2. **Menampilkan rincian versi server, alamat IP database internal, dan pesan eksepsi lengkap di endpoint `/readyz` publik:** Jangan ekspos detail topologi internal ke internet publik; batasi akses `/readyz` dan `/metrics` hanya untuk jaringan internal klaster atau tampilkan status boolean sederhana saja.
3. **Membuat ID korelasi baru di setiap layanan mikro dan membuang header `traceparent` dari pemanggil:** Jika Anda tidak membaca dan meneruskan `trace-id` yang masuk dari header `traceparent`, maka jejak di layanan A dan layanan B akan terputus menjadi dua trace terpisah yang tidak bisa dihubungkan saat melacak insiden!

## Latihan Praktik Mandiri

1. Buat berkas `ObservabilitasW3c.php` yang memuat fungsi `bangunKonteksTraceW3c()` dan `periksaKesiapanLayanan()`.
2. Tulis pengujian PHPUnit untuk memverifikasi bahwa:
   - jika diberi header `00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`, fungsi mempertahankan `trace_id` yang sama persis (`4bf92f3577b34da6a3ce929d0e0e4736`), menyimpan `00f067aa0ba902b7` sebagai `parent_span_id`, dan membuat `span_id` baru sepanjang 16 karakter hex;
   - jika diberi `traceparent` tidak valid (atau `trace-id` bernilai nol semua), fungsi otomatis membangkitkan `trace_id` 32 karakter hex baru.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Mengecek koneksi database, Redis, dan API pihak ketiga di dalam endpoint *Liveness Probe* (`/healthz`) Kubernetes akan membuat Kubernetes me-restart container PHP Anda berulang kali ketika layanan pihak ketiga sedang mengalami gangguan sementara; pisahkan *Liveness* dari *Readiness* (`/readyz`).*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena gangguan sementara pada dependensi eksternal membuat probe liveness gagal sehingga Kubernetes me-restart container berulang kali tanpa memperbaiki masalah, yang justru memperburuk gangguan
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Mengecek koneksi database, Redis, dan API pihak ketiga di dalam endpoint *Liveness Probe* (`/healthz`) Kubernetes akan membuat Kubernetes me-restart container PHP Anda berulang kali ketika layanan pihak ketiga sedang mengalami gangguan sementara; pisahkan *Liveness* dari *Readiness* (`/readyz`).

### Soal 2
Dalam standar **W3C Trace Context**, ketika layanan PHP Anda menerima permintaan masuk dengan header `traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01` lalu memanggil layanan mikro hilir melalui cURL, bagian manakah dari `traceparent` yang **wajib dipertahankan tetap sama** dan bagian manakah yang **diperbarui**?
- A. Seluruh string `traceparent` dihapus dan diganti dengan alamat IP pengguna
- B. Nilai **`trace-id`** (`4bf92f3577b34da6a3ce929d0e0e4736`, 32 hex) **wajib dipertahankan tetap sama** agar seluruh layanan terhubung dalam satu jejak utuh, sedangkan bagian ketiga (**`parent-id` / `span-id`**, 16 hex) **diperbarui** dengan ID span baru milik operasi pemanggilan dari layanan PHP ini
- C. Nilai `trace-id` diganti baru di setiap layanan, sedangkan `span-id` tidak boleh berubah
- D. Versi `00` diubah menjadi `99`

**Jawaban Benar:** B
**Penjelasan:** Dalam W3C Trace Context, `trace-id` mengidentifikasi perjalanan transaksi secara menyeluruh dari ujung ke ujung, sementara `parent-id` diperbarui di setiap lompatan (*hop*) untuk membentuk pohon hubungan induk-anak antar-*span*.

### Soal 3
Kode status HTTP berapakah yang wajib dikembalikan oleh endpoint **Readiness Probe (`/readyz`)** ketika koneksi ke database utama sedang terputus agar Load Balancer berhenti mengalirkan trafik pengguna ke pod tersebut?
- A. `200 OK`
- B. `302 Found`
- C. `503 Service Unavailable` (atau kode `5xx` lainnya)
- D. `100 Continue`

**Jawaban Benar:** C
**Penjelasan:** Probe HTTP Kubernetes menganggap kode status `200` hingga `399` sebagai sehat/siap, dan kode `>= 400` (standarnya `503 Service Unavailable`) sebagai tidak siap sehingga pod langsung dikeluarkan sementara dari daftar endpoint Service.

## Sumber

- [Trace Context — W3C Recommendation](https://www.w3.org/TR/trace-context/)
- [Liveness, Readiness and Startup Probes — Kubernetes Documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
- [OpenTelemetry PHP — OpenTelemetry Documentation](https://opentelemetry.io/docs/languages/php/)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
