# Arsitektur Otorisasi: Role-Based Access Control (RBAC), Policy Object, dan Pencegahan IDOR

- **Tingkat:** Lanjut
- **Ringkasan:** Memisahkan logika autentikasi (*siapa Anda*) dari otorisasi (*apa yang boleh Anda lakukan*), merancang **Policy Class** yang bersih menggunakan Enum izin, serta menangkal kerentanan keamanan paling sering di aplikasi web: **Insecure Direct Object Reference (IDOR / Broken Object Level Authorization)**.

## Mengapa Kerentanan Nomor #1 di OWASP API Security Top 10 Adalah Kegagalan Otorisasi Objek (IDOR/BOLA)?

Banyak aplikasi sudah memiliki sistem login (**Autentikasi**) yang kuat, namun jatuh korban pada langkah berikutnya (**Otorisasi**): pengguna `id = 42` sudah berhasil login, lalu ia mengubah URL dari `GET /api/faktur/801` menjadi `GET /api/faktur/802` (atau mengirim `POST /dokumen/hapus` dengan `id_dokumen = 99`).

Jika kode controller Anda hanya memeriksa *"apakah pengguna sudah login?"* lalu langsung menjalankan `SELECT * FROM faktur WHERE id = :id` tanpa memeriksa apakah faktur `802` benar-benar milik pengguna `42`, maka pengguna tersebut dapat mengintip, mengubah, atau menghapus data seluruh pelanggan lain! Kerentanan fatal ini disebut **IDOR (*Insecure Direct Object Reference*)** atau **BOLA (*Broken Object Level Authorization*)**.

> **🚫 Kerentanan & Kesalahan Umum:** Memeriksa apakah pengguna sudah login lalu langsung menjalankan `DELETE FROM dokumen WHERE id = :id` hanya berdasarkan `$_POST['id']` tanpa memastikan `pemilik_id = :id_pengguna` adalah celah **IDOR** yang memungkinkan pengguna biasa menghapus dokumen milik orang lain.

## 1. Perbandingan Model Kontrol Akses: RBAC vs ABAC / Policy Object

Untuk menjaga agar aturan izin tidak berceceran di puluhan file controller atau tampilan HTML, pisahkan model otorisasi menjadi struktur yang jelas:

| Model Otorisasi | Pertanyaan yang Dijawab | Contoh Aturan | Implementasi Terbaik di PHP 8.2–8.5 |
| :--- | :--- | :--- | :--- |
| **RBAC (*Role-Based Access Control*)** | *"Peran apa yang dimiliki pengguna ini?"* | Hanya `PeranPengguna::Admin` dan `Editor` yang boleh masuk ke menu manajemen kursus. | **Backed Enum (`enum Peran: string`)** dengan metode pemetaan izin `memilikiIzin(Izin $izin): bool`. |
| **ABAC (*Attribute-Based*) & Policy Object** | *"Apakah pengguna ini berhak melakukan aksi X terhadap objek spesifik Y pada kondisi Z?"* | Seorang `Penulis` hanya boleh menyunting `Artikel` **miliknya sendiri** (`$user->id === $artikel->idPenulis`) **dan** selama artikel belum dikunci. | **Policy Class terdedikasi** (`KebijakanArtikel`) yang menerima objek `Pengguna` dan entitas `Artikel`. |
| **Scoping Kueri Database** | *"Baris mana saja yang boleh diambil/diubah oleh kueri SQL ini?"* | Mengambil atau menghapus dokumen milik organisasi/pengguna saat ini. | Menyertakan klausa **`WHERE id = :id AND pemilik_id = :id_pengguna`** (atau Row-Level Security di PostgreSQL). |

## 2. Merancang RBAC dengan Backed Enum dan Policy Class Anti-IDOR

Perhatikan bagaimana kita menggabungkan **Enum Peran & Izin** (RBAC) dengan **Policy Class** yang memeriksa kepemilikan sumber daya secara eksplisit (ABAC / Object-Level Authorization):

```php
<?php
declare(strict_types=1);

enum IzinAkses: string
{
    case BuatArtikel    = 'artikel:buat';
    case SuntingSendiri = 'artikel:sunting_sendiri';
    case SuntingSemua   = 'artikel:sunting_semua';
    case HapusArtikel   = 'artikel:hapus';
}

enum PeranPengguna: string
{
    case Admin   = 'admin';
    case Penulis = 'penulis';
    case Pembaca = 'pembaca';

    /** @return list<IzinAkses> */
    public function daftarIzin(): array
    {
        return match ($this) {
            self::Admin   => IzinAkses::cases(),
            self::Penulis => [IzinAkses::BuatArtikel, IzinAkses::SuntingSendiri],
            self::Pembaca => [],
        };
    }

    public function boleh(IzinAkses $izin): bool
    {
        return in_array($izin, $this->daftarIzin(), strict: true);
    }
}

final readonly class Pengguna
{
    public function __construct(
        public int $id,
        public PeranPengguna $peran,
        public int $idOrganisasi,
    ) {}
}

final readonly class Artikel
{
    public function __construct(
        public int $id,
        public int $idPenulis,
        public int $idOrganisasi,
        public bool $terkunci,
    ) {}
}

final class KebijakanArtikel
{
    public function bolehUbah(Pengguna $user, Artikel $artikel): bool
    {
        // 1. Isolasi multi-tenant: wajib berada di organisasi yang sama!
        if ($user->idOrganisasi !== $artikel->idOrganisasi) {
            return false;
        }
        // 2. Admin organisasi boleh mengubah semua artikel di organisasinya
        if ($user->peran->boleh(IzinAkses::SuntingSemua)) {
            return true;
        }
        // 3. Penulis hanya boleh mengubah artikel miliknya sendiri yang belum dikunci
        return $user->peran->boleh(IzinAkses::SuntingSendiri)
            && $user->id === $artikel->idPenulis
            && !$artikel->terkunci;
    }
}
```

## 3. Pertahanan Berlapis di Tingkat Kueri PDO (`WHERE id = :id AND pemilik_id = :uid`)

Selain memeriksa `KebijakanArtikel::bolehUbah()`, terapkan pertahanan berlapis pada metode Repository Anda dengan selalu menyertakan `pemilik_id` atau `organisasi_id` dari sesi terautentikasi langsung di dalam klausa `WHERE`:

```php
<?php
declare(strict_types=1);

function hapusCatatanMilikPengguna(PDO $pdo, int $idCatatanDariUrl, int $idPenggunaLogin): bool
{
    // Meskipun penyerang menebak $idCatatanDariUrl milik orang lain,
    // kueri tidak akan menyentuh baris tersebut karena terkunci oleh pemilik_id!
    $stmt = $pdo->prepare(
        'DELETE FROM catatan WHERE id = :id AND pemilik_id = :pemilik_id'
    );
    $stmt->execute([
        ':id'         => $idCatatanDariUrl,
        ':pemilik_id' => $idPenggunaLogin,
    ]);

    return $stmt->rowCount() === 1;
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menganggap penggunaan UUID v4 sebagai pengganti pemeriksaan otorisasi (Mitos *"UUID mencegah IDOR"*):** Mengganti ID angka berurutan (`101`, `102`) menjadi UUID (`36b8f84d-...`) memang membuat ID tidak mudah ditebak secara berurutan, tetapi UUID tetap dapat bocor melalui log Referer, riwayat peramban bersama, atau API publik lain. **UUID bukanlah pengganti kontrol akses!** Anda tetap wajib memeriksa kepemilikan di `Policy` dan klausa `WHERE`.
2. **Menyembunyikan tombol "Hapus" di HTML/CSS tanpa memeriksa izin di endpoint PHP backend:** Menyembunyikan tombol di tampilan depan hanyalah kenyamanan antarmuka (*UI convenience*), bukan keamanan. Penyerang tetap dapat mengirim permintaan `POST /hapus` langsung menggunakan `curl`.
3. **Menerapkan prinsip *Default Allow* (mengizinkan akses kecuali dilarang):** Selalu terapkan **Deny by Default**: setiap metode di `Policy` secara bawaan harus menolak akses (`return false`) kecuali seluruh syarat peran, kepemilikan objek, dan batas organisasi terpenuhi secara eksplisit.

## Latihan Praktik Mandiri

1. Buat berkas `KebijakanArtikel.php` beserta enum `PeranPengguna` dan `IzinAkses` seperti pada contoh di atas.
2. Tulis minimal 4 skenario pengujian otomatis di PHPUnit:
   - Penulis mengubah artikel miliknya sendiri di organisasi yang sama -> `true`;
   - Penulis mencoba mengubah artikel milik penulis lain (percobaan IDOR) -> `false`;
   - Penulis mencoba mengubah artikel miliknya yang sudah berstatus `$terkunci = true` -> `false`;
   - Admin dari Organisasi A mencoba mengubah artikel di Organisasi B (*cross-tenant access*) -> `false`.

## Kuis Pemahaman

### Soal 1
Manakah contoh nyata dari kerentanan **Insecure Direct Object Reference (IDOR / BOLA)** pada aplikasi backend PHP?
- A. Menggunakan `password_hash()` dengan algoritma Argon2id
- B. Sebuah endpoint `GET /unduh-faktur.php?id=502` yang sudah memeriksa bahwa pengguna sedang login, tetapi langsung mengambil dan menampilkan baris faktur nomor `502` dari database tanpa memverifikasi apakah faktur `502` tersebut memang milik pengguna yang sedang login
- C. Mengembalikan kode status HTTP `403 Forbidden` saat pengguna biasa mengakses halaman admin
- D. Menggunakan tipe data `readonly class` pada objek DTO

**Jawaban Benar:** B
**Penjelasan:** IDOR terjadi ketika aplikasi mengizinkan pengguna yang sudah login mengakses objek/baris data berdasarkan pengenal (`id=502`) yang dikirim dari klien tanpa memverifikasi kepemilikan atau hak akses pengguna tersebut terhadap objek spesifik itu.

### Soal 2
Mengapa mengganti primary key tabel dari angka berurutan (`1, 2, 3`) menjadi **UUID acak** saja **tidak cukup** untuk dinyatakan aman dari celah IDOR tanpa pemeriksaan Policy/kepemilikan di sisi server?
- A. Karena UUID tidak dapat disimpan di database PostgreSQL maupun MySQL
- B. Karena UUID hanyalah pengenal yang sulit ditebak (*security by obscurity*), bukan kontrol akses; jika UUID objek bocor melalui log, tautan yang dibagikan, atau respons API lain, pengguna yang tidak berhak tetap dapat mengakses objek tersebut apabila server tidak memeriksa izin kepemilikannya
- C. Karena UUID otomatis berubah setiap jam
- D. Karena PHP tidak dapat membandingkan dua string UUID

**Jawaban Benar:** B
**Penjelasan:** Sesuai panduan OWASP Authorization & IDOR Prevention Cheat Sheet, penggunaan pengenal tak tertebak (UUID) membantu mencegah enumerasi massal, tetapi server tetap wajib memvalidasi otorisasi pengguna terhadap objek tersebut di setiap permintaan.

### Soal 3
Apa perbedaan tanggung jawab antara **RBAC (*Role-Based Access Control*)** dan **Policy Object (Otorisasi Tingkat Objek / ABAC)**?
- A. RBAC hanya berjalan di peramban, sedangkan Policy Object berjalan di database
- B. RBAC mengatur izin umum berdasarkan peran jabatan pengguna (misalnya peran `Penulis` memiliki izin umum membuat dan menyunting artikel), sedangkan Policy Object memeriksa aturan kontekstual terhadap instans objek spesifik (misalnya memastikan `$user->id === $artikel->idPenulis` dan `$user->idOrganisasi === $artikel->idOrganisasi`)
- C. Policy Object digunakan untuk mengenkripsi kata sandi pengguna
- D. Keduanya tidak dapat digunakan secara bersamaan dalam satu aplikasi

**Jawaban Benar:** B
**Penjelasan:** RBAC memeriksa kemampuan tingkat jenis sumber daya (*class-level permission*), sementara Policy Object memadukan kemampuan peran tersebut dengan pemeriksaan atribut instans spesifik (*instance-level ownership & state*).

## Sumber

- [Enumerations — PHP Manual](https://www.php.net/manual/en/language.types.enumerations.php)
- [Authorization Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [Insecure Direct Object Reference Prevention Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
