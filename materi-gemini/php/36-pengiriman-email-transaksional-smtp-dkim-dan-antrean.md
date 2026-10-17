# Pengiriman Email Transaksional yang Aman, Pencegahan Header Injection, dan Autentikasi SPF/DKIM/DMARC

- **Tingkat:** Menengah
- **Ringkasan:** Mengirim email verifikasi dan notifikasi melalui protokol SMTP dengan TLS, mencegah serangan **Email Header Injection** pada subjek dan alamat tujuan, merancang template email multipart (`text/plain` + `text/html`), serta memahami peran DNS **SPF, DKIM, dan DMARC**.

## Mengapa Pengiriman Surel dari Kode PHP Sering Masuk ke Folder Spam atau Disalahgunakan Spammer?

Mengirim surat elektronik transaksional (seperti tautan verifikasi akun, kode OTP, atau kuitansi pembayaran) menghadapi dua tantangan utama di lingkungan produksi:
1. **Keamanan Aplikasi (*Email Header Injection*):** Protokol surat elektronik (RFC 5322) memisahkan setiap header surel (`From:`, `Reply-To:`, `Subject:`, `Bcc:`) menggunakan karakter baris baru **CRLF (`\r\n`)**. Jika aplikasi Anda memasukkan nama atau subjek dari input pengguna langsung ke dalam header surel tanpa menghapus `\r` dan `\n`, penyerang dapat menyuntikkan baris baru `\r\nBcc: ribuan-korban@contoh.com` dan mengubah server Anda menjadi mesin pengirim spam!
2. **Reputasi & Keaslian Domain (*Deliverability*):** Penyedia surel modern (Gmail, Yahoo, Outlook) akan langsung membuang atau memasukkan surel Anda ke folder *Spam* apabila domain pengirim Anda belum dikonfigurasi dengan tiga catatan DNS kriptografis: **SPF**, **DKIM**, dan **DMARC**.

> **🚫 Kerentanan & Kesalahan Umum:** Menyisipkan input pengguna langsung ke argumen `$additional_headers` pada fungsi `mail()` tanpa menyaring karakter baris baru (`\r\n` / CRLF) memungkinkan penyerang menyuntikkan header `Bcc:` ke ribuan alamat target spam (*Email Header Injection*).

## 1. Peran Tiga Pilar Autentikasi DNS Surel: SPF, DKIM, dan DMARC

Agar surel yang dikirim oleh server aplikasi atau layanan SMTP Anda diakui sah oleh server penerima, pahami fungsi ketiga catatan `TXT` pada DNS domain Anda:

| Standar Autentikasi | Lokasi Konfigurasi DNS | Pertanyaan Keamanan yang Dijawab | Cara Kerja Teknis |
| :--- | :--- | :--- | :--- |
| **SPF** (*Sender Policy Framework* — RFC 7208) | Catatan `TXT` pada `@` (akar domain), mis. `v=spf1 include:_spf.penyedia.id -all`. | *"Apakah alamat IP server pengirim ini berhak mengirim surel atas nama domain `kodeloka.id`?"* | Server penerima mencocokkan IP pengirim SMTP dengan daftar IP/domain yang diizinkan di catatan SPF. |
| **DKIM** (*DomainKeys Identified Mail* — RFC 6376) | Catatan `TXT` pada `selektor._domainkey.kodeloka.id` berisi Kunci Publik RSA/Ed25519. | *"Apakah isi dan header surel ini benar-benar ditandatangani oleh pemilik sah `kodeloka.id` dan tidak diubah di jalan?"* | Server pengirim membubuhkan header tanda tangan digital `DKIM-Signature` dengan Kunci Privat; penerima memverifikasinya lewat DNS. |
| **DMARC** (*Domain-based Message Auth, Reporting & Conformance*) | Catatan `TXT` pada `_dmarc.kodeloka.id`, mis. `v=DMARC1; p=quarantine; rua=mailto:...`. | *"Apa yang harus dilakukan penerima jika SPF dan DKIM gagal atau domain `From:` tidak selaras, dan ke mana laporan dikirim?"* | Mengikat penyelarasan domain (*alignment*) antara alamat `From:` yang dilihat pengguna dengan domain SPF/DKIM, serta menentukan kebijakan (`none`, `quarantine`, `reject`). |

## 2. Sanitasi Anti-*Header Injection* dan Penyusunan Payload Multipart (`text/plain` + `text/html`)

Jangan pernah menyisipkan karakter kontrol baris baru (`\r`, `\n`, atau byte NUL `\0`) ke dalam nilai header surel mana pun! Selain itu, selalu kirimkan surel dalam format **`multipart/alternative`** yang memuat versi **`text/plain`** sekaligus **`text/html`** agar ramah pembaca layar dan lolos penilaian kualitas filter spam:

```php
<?php
declare(strict_types=1);

function sanitasiHeaderEmail(string $nilai): string
{
    // Hapus seluruh karakter kontrol CR, LF, dan byte NUL untuk mencegah Header Injection
    return preg_replace('/[\r\n\0]+/', '', trim($nilai)) ?? '';
}

function validasiAlamatTujuan(string $email): string
{
    $bersih = sanitasiHeaderEmail($email);
    $valid  = filter_var($bersih, FILTER_VALIDATE_EMAIL);
    if ($valid === false) {
        throw new InvalidArgumentException('Alamat surel tujuan tidak valid.');
    }
    return $valid;
}

/**
 * Menyusun tubuh dan header surel multipart/alternative (Teks Biasa + HTML) secara aman.
 *
 * @return array{subjek: string, headers: array<string, string>, body: string}
 */
function susunPesanMultipartAman(
    string $emailPengirim,
    string $subjekMentah,
    string $isiTeksBiasa,
    string $isiHtml
): array {
    $pengirimAman = validasiAlamatTujuan($emailPengirim);
    $subjekAman   = mb_encode_mimeheader(sanitasiHeaderEmail($subjekMentah), 'UTF-8', 'B', "\r\n");
    $boundary     = '=_Part_' . bin2hex(random_bytes(16));

    $headers = [
        'From'                      => $pengirimAman,
        'MIME-Version'              => '1.0',
        'Content-Type'              => "multipart/alternative; boundary=\"{$boundary}\"",
        'X-Auto-Response-Suppress'  => 'OOF, AutoReply',
    ];

    $body  = "--{$boundary}\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode($isiTeksBiasa)) . "\r\n";

    $body .= "--{$boundary}\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode($isiHtml)) . "\r\n";
    $body .= "--{$boundary}--\r\n";

    return ['subjek' => $subjekAman, 'headers' => $headers, 'body' => $body];
}
```

> **💡 Tips Arsitektur Produksi:** Di aplikasi produksi, hindari memanggil pengiriman SMTP secara sinkron di tengah proses HTTP pendaftaran/checkout pengguna (karena jabat tangan jaringan SMTP memakan waktu 0,5–3 detik). Simpan tugas pengiriman surel ke tabel antrean database/Redis, lalu kirimkan dari proses **Background Worker CLI** menggunakan pustaka SMTP teruji seperti **Symfony Mailer** atau **PHPMailer**.

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan alamat surel pengunjung sebagai header `From:` pada formulir "Hubungi Kami":** Jika pengunjung mengisi surel `budi@gmail.com` di formulir kontak Anda, lalu server Anda mengirim surel ke admin dengan header `From: budi@gmail.com`, server penerima akan langsung **menolak surel tersebut karena gagal pemeriksaan SPF/DMARC milik `gmail.com`** (server Anda bukanlah server milik Google!). Selalu gunakan domain Anda sendiri pada `From: no-reply@kodeloka.id`, dan letakkan surel pengunjung di header **`Reply-To:`** (setelah disanitasi dengan `validasiAlamatTujuan()`).
2. **Menyalin subjek UTF-8 yang mengandung emoji langsung ke header tanpa `mb_encode_mimeheader()`:** Header surel RFC 5322 hanya mengizinkan karakter ASCII 7-bit; karakter non-ASCII wajib dikodekan dengan *Encoded-Word* (RFC 2047) atau ditangani oleh pustaka mailer modern.
3. **Menampilkan pesan berbeda antara *"Surel ditemukan, tautan reset telah dikirim"* dan *"Surel tidak terdaftar"*:** Ini membuka celah **Account Enumeration**. Selalu tampilkan pesan yang sama: *"Jika alamat surel tersebut terdaftar, kami telah mengirimkan tautan pemulihan."*

## Latihan Praktik Mandiri

1. Buat berkas `LayananEmailAman.php` yang memuat `sanitasiHeaderEmail()`, `validasiAlamatTujuan()`, dan `susunPesanMultipartAman()`.
2. Tulis pengujian PHPUnit yang mencoba menyuntikkan payload serangan `"Halo\r\nBcc: penyerang@jahat.com"` ke dalam `$subjekMentah` dan `$emailPengirim`, lalu pastikan karakter `\r\n` terhapus bersih pada subjek dan melempar `InvalidArgumentException` pada alamat surel yang disuntikkan.

## Kuis Pemahaman

### Soal 1
Bagaimana serangan **Email Header Injection** bekerja pada aplikasi PHP yang tidak menyaring karakter baris baru (`\r\n`) pada input pengguna?
- A. Penyerang mengubah ukuran fon surel menjadi terlalu besar
- B. Karena protokol surel menggunakan urutan karakter CRLF (`\r\n`) sebagai pemisah antar-header, penyerang dapat menyisipkan `\r\nBcc: daftar-korban@contoh.com` ke dalam input nama/subjek sehingga server aplikasi Anda mengirim salinan surel spam ke pihak luar
- C. Penyerang mematikan layanan DNS server
- D. Penyerang menghapus tabel database melalui protokol SMTP

**Jawaban Benar:** B
**Penjelasan:** Jika karakter `\r` dan `\n` tidak dibuang dari nilai yang disisipkan ke header surel, parser MTA/SMTP akan menganggap teks sesudah `\r\n` sebagai baris header baru (seperti `Cc:`, `Bcc:`, atau `Content-Type:` baru).

### Soal 2
Pada formulir "Hubungi Kami" di situs `kodeloka.id`, mengapa Anda **tidak boleh** menetapkan alamat surel pengunjung (misalnya `rina@gmail.com`) sebagai header `From: rina@gmail.com` saat server Anda mengirimkan pesan tersebut ke kotak masuk admin?
- A. Karena alamat `@gmail.com` tidak mendukung format HTML
- B. Karena server Anda tidak terdaftar di dalam catatan DNS **SPF** dan tidak memiliki kunci privat **DKIM** milik `gmail.com`, sehingga surel yang mengaku berasal dari `From: rina@gmail.com` akan ditolak oleh kebijakan **DMARC** sebagai pemalsuan identitas (*spoofing*); gunakan `From: kontak@kodeloka.id` dan taruh surel pengunjung di header `Reply-To:`
- C. Karena header `From:` hanya boleh berisi alamat IP
- D. Karena PHP melarang karakter `@` di dalam header

**Jawaban Benar:** B
**Penjelasan:** Pemeriksaan SPF dan DMARC memverifikasi apakah server pengirim berwenang mengirim atas nama domain pada header `From:`. Menggunakan domain orang lain (`gmail.com`) pada `From:` pasti gagal autentikasi DMARC.

### Soal 3
Apa fungsi dari catatan DNS **DKIM (*DomainKeys Identified Mail* — RFC 6376)** dalam pengiriman surel transaksional?
- A. Mengenkripsi seluruh isi surel agar tidak dapat dibaca oleh penerima
- B. Menyediakan kunci publik di DNS agar server penerima dapat memverifikasi tanda tangan digital kriptografis (`DKIM-Signature`) pada surel, membuktikan bahwa surel benar-benar berasal dari domain tersebut dan subjek/isinya tidak dimodifikasi selama transit
- C. Menggantikan fungsi protokol HTTPS di peramban
- D. Mempercepat penulisan kueri SQL

**Jawaban Benar:** B
**Penjelasan:** DKIM membubuhkan tanda tangan kriptografis asimetris pada header dan hash tubuh pesan menggunakan kunci privat server pengirim, yang kemudian diverifikasi oleh penerima menggunakan kunci publik di catatan DNS `TXT` `_domainkey`.

## Sumber

- [`mail` — PHP Manual](https://www.php.net/manual/en/function.mail.php)
- [RFC 7208: Sender Policy Framework (SPF) — IETF](https://www.rfc-editor.org/rfc/rfc7208)
- [RFC 6376: DomainKeys Identified Mail (DKIM) Signatures — IETF](https://www.rfc-editor.org/rfc/rfc6376)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
