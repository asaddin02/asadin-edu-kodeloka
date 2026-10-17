# Rekayasa REST API di PHP: Standar JSON (`JSON_THROW_ON_ERROR`), Cursor Pagination, dan Galat RFC 9457

- **Tingkat:** Menengah
- **Ringkasan:** Merancang endpoint API HTTP yang konsisten menggunakan kode status yang tepat, bendera wajib `JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE`, paginasi berbasis kursor (*Keyset/Cursor Pagination*) yang cepat untuk jutaan baris, serta format respons galat standar **RFC 9457 (`application/problem+json`)**.

## Mengapa API Produksi Membutuhkan Kontrak Galat dan Paginasi yang Terstandarisasi?

Ketika aplikasi seluler atau front-end berkomunikasi dengan backend PHP Anda, dua masalah sering menghambat skala produksi:
1. **Format Galat yang Berbeda-beda di Tiap Endpoint:** Satu endpoint mengembalikan `{"error": "Gagal"}`, endpoint kedua mengembalikan `{"message": "Tidak valid", "code": 12}`, dan endpoint ketiga malah mengembalikan halaman HTML putih saat gagal. Standar internasional **IETF RFC 9457 (*Problem Details for HTTP APIs*)** menyatukan seluruh respons galat HTTP ke dalam satu struktur JSON baku ber-MIME `application/problem+json`.
2. **Paginasi `OFFSET` yang Melumpuhkan Database pada Halaman Dalam:** Menulis `SELECT * FROM transaksi ORDER BY id DESC LIMIT 20 OFFSET 500000` memaksa mesin database membaca, mengurutkan, lalu **membuang 500.000 baris pertama** hanya untuk mengambil 20 baris di halaman ke-25.001! Dengan **Keyset / Cursor Pagination**, database langsung melompat ke titik terakhir melalui indeks B-Tree dalam waktu kurang dari 1 milidetik.

> **🚫 Kerentanan & Kesalahan Umum:** Menggunakan `LIMIT 20 OFFSET 500000` untuk paginasi halaman ke-25.000 memaksa database membaca dan membuang 500.000 baris terlebih dahulu pada setiap permintaan; gunakan *Keyset/Cursor Pagination* (`WHERE id < :idTerakhir ORDER BY id DESC LIMIT 20`).

## 1. Perbandingan Bendera JSON, Metode Paginasi, dan Struktur RFC 9457

Berikut adalah standar utama yang wajib diterapkan pada lapisan respons REST API PHP modern:

| Aspek Rekayasa API | Praktik Lama (Hindari) | Standar Produksi Modern (PHP 8.2–8.5) |
| :--- | :--- | :--- |
| **Serialisasi JSON** | `json_encode($data)` telanjang (mengembalikan `false` diam-diam jika gagal dan meng-escape `/` serta UTF-8). | **`json_encode($data, JSON_THROW_ON_ERROR \| JSON_UNESCAPED_UNICODE \| JSON_UNESCAPED_SLASHES)`**. |
| **Paginasi Koleksi Besar** | *Offset Pagination* (`?page=25000` -> `OFFSET 500000`): lambat $O(N)$ dan baris bisa bergeser/duplikat saat ada data baru masuk. | **Keyset / Cursor Pagination** (`?after_id=984120` -> `WHERE id < :kursor ORDER BY id DESC LIMIT 20`): cepat $O(\log N)$ dan stabil! |
| **Format Respons Galat** | Format karangan sendiri (`{"err": true, "msg": "..."}`) dengan status `200 OK`. | **RFC 9457 (`application/problem+json`)** dengan kode status HTTP `4xx`/`5xx` yang akurat (`type`, `title`, `status`, `detail`, `instance`). |

## 2. Mengirim Respons Galat Standar RFC 9457 (`application/problem+json`)

Spesifikasi [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457) (pembaruan dari RFC 7807) menetapkan lima anggota standar pada objek JSON galat:
- **`type`** (URI rujukan jenis galat; gunakan `"about:blank"` jika cukup diwakili kode status HTTP);
- **`title`** (ringkasan singkat jenis masalah yang sama untuk seluruh kejadian sejenis);
- **`status`** (kode angka status HTTP, misalnya `422` atau `404`);
- **`detail`** (penjelasan spesifik untuk kejadian saat ini yang aman ditampilkan ke pengguna);
- **`instance`** (jalur URI permintaan saat ini) serta properti ekstensi tambahan seperti **`errors`** (daftar kesalahan validasi per kolom):

```php
<?php
declare(strict_types=1);

function kirimProblemJson(
    int $status,
    string $judul,
    string $detail,
    string $tipe = 'about:blank',
    array $ekstensi = []
): never {
    http_response_code($status);
    header('Content-Type: application/problem+json; charset=utf-8');
    $payload = array_merge([
        'type'   => $tipe,
        'title'  => $judul,
        'status' => $status,
        'detail' => $detail,
    ], $ekstensi);

    echo json_encode(
        $payload,
        JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    exit;
}
```

## 3. Implementasi *Keyset / Cursor Pagination* dengan PDO

Pada *Keyset Pagination*, alih-alih mengirim nomor halaman `?page=5`, klien mengirimkan nilai ID terakhir yang dilihatnya (`?kursor_sebelum=1050`). Tips cerdas untuk mengetahui apakah masih ada **halaman berikutnya (`has_more`)** tanpa perlu menjalankan kueri `COUNT(*)` yang mahal adalah dengan meminta **`$batas + 1` baris** di `LIMIT`, lalu memotong kelebihannya di PHP:

```php
<?php
declare(strict_types=1);

/**
 * Mengambil halaman daftar transaksi dengan Keyset Pagination (Cepat di jutaan baris).
 *
 * @return array{data: list<array<string, mixed>>, kursor_berikutnya: int|null, masih_ada: bool}
 */
function ambilTransaksiDenganKursor(PDO $pdo, ?int $kursorIdTerakhir = null, int $batas = 20): array
{
    $batas = max(1, min($batas, 100));
    $ambilLebihSatu = $batas + 1;

    if ($kursorIdTerakhir === null) {
        $stmt = $pdo->prepare('SELECT id, kode, nominal FROM transaksi ORDER BY id DESC LIMIT :batas');
    } else {
        $stmt = $pdo->prepare(
            'SELECT id, kode, nominal FROM transaksi WHERE id < :kursor ORDER BY id DESC LIMIT :batas'
        );
        $stmt->bindValue(':kursor', $kursorIdTerakhir, PDO::PARAM_INT);
    }
    $stmt->bindValue(':batas', $ambilLebihSatu, PDO::PARAM_INT);
    $stmt->execute();

    $baris = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $masihAda = count($baris) > $batas;
    if ($masihAda) {
        array_pop($baris); // Buang baris ke-(batas + 1) yang hanya dipakai sebagai penanda
    }

    $itemTerakhir = $baris !== [] ? $baris[array_key_last($baris)] : null;

    return [
        'data'              => $baris,
        'kursor_berikutnya' => $masihAda && $itemTerakhir ? (int) $itemTerakhir['id'] : null,
        'masih_ada'         => $masihAda,
    ];
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Memanggil `json_encode()` atau `json_decode()` tanpa bendera `JSON_THROW_ON_ERROR`:** Secara bawaan, jika `json_encode()` gagal (misalnya ada nilai `NAN`, `INF`, atau karakter UTF-8 rusak), ia hanya mengembalikan `false` tanpa melempar eksepsi, sehingga API Anda mengirim teks kosong ke klien! Selalu sertakan `JSON_THROW_ON_ERROR` agar kegagalan langsung melempar `JsonException`.
2. **Mengembalikan status HTTP `200 OK` ketika permintaan API gagal (`{"success": false, "error": "..."}`):** Mengembalikan `200 OK` untuk permintaan yang gagal merusak pemantauan metrik HTTP di API Gateway/Nginx, mengecoh sistem caching CDN (yang bisa meng-cache pesan galat sebagai halaman sukses!), dan menyulitkan penanganan di klien. Gunakan kode status yang semantik (`400`, `401`, `403`, `404`, `409 Conflict`, `422 Unprocessable Content`, `429`, `500`).
3. **Lupa menyertakan kolom pengurut unik (`id`) saat melakukan *Keyset Pagination* berdasarkan `created_at`:** Jika dua baris memiliki detik `created_at` yang sama persis, mengurutkan hanya dengan `ORDER BY created_at DESC` dapat melompati salah satu baris. Gunakan pengurutan gabungan `ORDER BY created_at DESC, id DESC` dengan perbandingan tupel `(created_at, id) < (:waktuKursor, :idKursor)`.

## Latihan Praktik Mandiri

1. Buat fungsi pembentuk struktur array Problem Details `buatArrayProblemDetails(int $status, string $judul, string $detail, array $galatKolom = []): array` dan fungsi `ambilTransaksiDenganKursor()`.
2. Tulis pengujian PHPUnit menggunakan SQLite `:memory:` berisi 55 baris transaksi, lalu uji pengambilan halaman ke-1 (`$batas = 20`), halaman ke-2 (menggunakan `kursor_berikutnya` dari halaman ke-1), dan halaman ke-3 (memastikan `masih_ada === false` dan jumlah sisa baris tepat 15).

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini wajib dihindari pada aplikasi PHP produksi: *Menggunakan `LIMIT 20 OFFSET 500000` untuk paginasi halaman ke-25.000 memaksa database membaca dan membuang 500.000 baris terlebih dahulu pada setiap permintaan; gunakan *Keyset/Cursor Pagination* (`WHERE id < :idTerakhir ORDER BY id DESC LIMIT 20`).*?
- A. Karena hanya memengaruhi warna tampilan teks di terminal
- B. Karena database harus membaca lalu membuang 500.000 baris terlebih dahulu pada setiap permintaan, sehingga kueri makin lambat dan beban database makin berat seiring halaman yang makin dalam, sedangkan keyset pagination langsung melompat ke posisi terakhir melalui indeks
- C. Karena PHP 8.5 tidak lagi mendukung penulisan fungsi
- D. Karena hanya berlaku pada sistem operasi Windows 95

**Jawaban Benar:** B
**Penjelasan:** Menggunakan `LIMIT 20 OFFSET 500000` untuk paginasi halaman ke-25.000 memaksa database membaca dan membuang 500.000 baris terlebih dahulu pada setiap permintaan; gunakan *Keyset/Cursor Pagination* (`WHERE id < :idTerakhir ORDER BY id DESC LIMIT 20`).

### Soal 2
Manakah pernyataan yang benar mengenai penggunaan `json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)` di PHP modern?
- A. `JSON_THROW_ON_ERROR` memastikan `JsonException` dilempar jika serialisasi gagal (alih-alih mengembalikan `false` diam-diam), `JSON_UNESCAPED_UNICODE` mempertahankan karakter UTF-8 apa adanya tanpa mengubahnya menjadi `\uXXXX`, dan `JSON_UNESCAPED_SLASHES` mencegah garis miring URL `/` diubah menjadi `\/`
- B. Ketiga bendera tersebut digunakan untuk mengenkripsi JSON dengan kata sandi
- C. `JSON_THROW_ON_ERROR` menyembunyikan seluruh galat dari log server
- D. Menghapus kebutuhan akan header `Content-Type`

**Jawaban Benar:** A
**Penjelasan:** Kombinasi ketiga konstanta bitwise tersebut adalah standar emas pada API PHP modern agar kegagalan serialisasi tidak terlewat secara diam-diam dan keluaran JSON lebih ringkas serta bersih dibaca.

### Soal 3
Menurut standar **IETF RFC 9457 (*Problem Details for HTTP APIs*)**, tipe media (`Content-Type`) dan properti inti apakah yang digunakan saat mengembalikan respons kesalahan HTTP?
- A. `Content-Type: text/html` dengan tag `<marquee>`
- B. `Content-Type: application/problem+json` dengan properti standar seperti `type`, `title`, `status`, dan `detail`
- C. `Content-Type: image/png` dengan kode status `200 OK`
- D. `Content-Type: multipart/form-data`

**Jawaban Benar:** B
**Penjelasan:** RFC 9457 menetapkan tipe media `application/problem+json` dan skema objek JSON standar (`type`, `title`, `status`, `detail`, `instance`) agar klien API dapat memproses berbagai jenis kesalahan HTTP secara seragam.

## Sumber

- [`json_encode` — PHP Manual](https://www.php.net/manual/en/function.json-encode.php)
- [JSON constants — PHP Manual](https://www.php.net/manual/en/json.constants.php)
- [RFC 9457: Problem Details for HTTP APIs — IETF](https://www.rfc-editor.org/rfc/rfc9457)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
