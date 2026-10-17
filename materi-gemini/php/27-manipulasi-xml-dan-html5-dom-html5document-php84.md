# Pemrosesan HTML5 & XML Modern dengan `Dom\HTMLDocument` (PHP 8.4) dan `XMLReader`

- **Tingkat:** Menengah
- **Ringkasan:** Mengurai, memodifikasi, dan mengekstrak dokumen HTML5 secara akurat sesuai spesifikasi WHATWG menggunakan kelas baru **`Dom\HTMLDocument`** di PHP 8.4 (sebagai pelengkap `DOMDocument` warisan yang berbasis libxml2 dan tetap tersedia), serta membaca berkas XML raksasa secara streaming dengan `XMLReader`.

## Mengapa `DOMDocument::loadHTML()` Warisan Sering Bermasalah pada Dokumen HTML5 Modern?

Selama hampir dua dekade, kelas `DOMDocument` di PHP mengandalkan parser HTML milik pustaka `libxml2` yang dirancang berdasarkan spesifikasi **HTML 4.01** dari akhir tahun 1990-an! Akibatnya, saat Anda memanggil `$dom->loadHTML($html5)` pada dokumen web modern:
1. Tag semantik HTML5 seperti `<main>`, `<article>`, `<section>`, `<figure>`, atau `<template>` sering memicu peringatan *invalid tag*;
2. Aturan penutupan tag dan struktur `<svg>` / `<math>` tersemat tidak mengikuti algoritma parser [WHATWG HTML Living Standard](https://html.spec.whatwg.org/multipage/parsing.html);
3. Karakter UTF-8 (seperti huruf beraksen atau emoji) rusak menjadi karakter aneh kecuali Anda menyuntikkan trik `<meta http-equiv="Content-Type" content="text/html; charset=utf-8">` di depannya;
4. Pencarian elemen mengharuskan penulisan ekspresi `DOMXPath` yang panjang karena tidak ada `querySelector()`.

Sejak **PHP 8.4**, ekstensi DOM memperkenalkan namespace baru **`Dom`** dengan kelas **`Dom\HTMLDocument`** (berbasis mesin parser HTML5 modern **Lexbor**) dan **`Dom\XMLDocument`** yang sepenuhnya mematuhi standar WHATWG dan mendukung **`querySelector()`** serta **`querySelectorAll()`** secara bawaan!

> **🚫 Kerentanan & Kesalahan Umum:** Menggunakan `DOMDocument::loadHTML()` lama pada markup HTML5 modern sering gagal mengenali tag semantik baru, merusak pengodean UTF-8 jika tidak diberi deklarasi meta khusus, dan tidak mendukung selektor CSS sebaik `Dom\HTMLDocument` di PHP 8.4.

## 1. Perbandingan `Dom\HTMLDocument` (PHP 8.4+), `DOMDocument` Lama, dan `XMLReader`

Pilihlah kelas pemroses dokumen yang sesuai dengan format dan ukuran masukan Anda:

| Kelas Pemroses | Standar Parser & Memori | Keunggulan Utama | Kapan Digunakan? |
| :--- | :--- | :--- | :--- |
| **`Dom\HTMLDocument`** (PHP 8.4+) | **WHATWG HTML5 Parser** (Pohon DOM di memori, UTF-8 bawaan). | Mengenal seluruh tag HTML5, `<template>`, SVG, dan mendukung **`querySelector()` / `querySelectorAll()`** serta properti modern (`classList`, `innerHTML`). | Mengurai, memodifikasi, atau membersihkan potongan/dokumen HTML5 di PHP 8.4+. |
| **`Dom\XMLDocument`** (PHP 8.4+) | XML Parser modern di namespace `Dom`. | API konsisten dengan `Dom\HTMLDocument` termasuk dukungan selektor CSS pada XML. | Mengolah dokumen XML berukuran kecil hingga menengah (RSS, Sitemap, SOAP). |
| **`DOMDocument`** (Warisan PHP 5–8) | Parser HTML 4 (`libxml2`) + `DOMXPath`. | Tetap tersedia di semua versi PHP untuk kompatibilitas mundur. | Proyek lama yang masih berjalan di PHP 8.2/8.3. |
| **`XMLReader`** | **Pull-Parser Streaming** (Hanya 1 node aktif di RAM pada satu waktu). | Konsumsi memori rata (beberapa kilobyte) meskipun membaca berkas XML berukuran **5 GB**! | Mengimpor katalog produk XML raksasa, umpan data bank, atau ekspor database besar. |

## 2. Mengurai dan Memodifikasi HTML5 dengan `Dom\HTMLDocument` dan Selektor CSS

Dengan `Dom\HTMLDocument::createFromString()`, Anda dapat langsung mencari elemen menggunakan selektor CSS yang sama persis seperti di JavaScript peramban:

```php
<?php
declare(strict_types=1);

// PHP 8.4+: Parser HTML5 standar WHATWG dengan dukungan querySelectorAll bawaan
$html = '<main><article class="kartu"><h2>Belajar PHP 8.5 🚀</h2><a href="https://contoh.luar">Tautan</a></article></main>';

// Jika mengurai potongan fragmen HTML tanpa <!DOCTYPE html>, gunakan LIBXML_NOERROR
$dokumen = Dom\HTMLDocument::createFromString($html, LIBXML_NOERROR);

$judul = $dokumen->querySelector('article.kartu > h2')?->textContent;
echo $judul . PHP_EOL; // "Belajar PHP 8.5 🚀" (UTF-8 terjaga tanpa trik tambahan!)

// Menambahkan atribut keamanan rel="noopener noreferrer" pada seluruh tautan eksternal
foreach ($dokumen->querySelectorAll('a[href^="https://"]') as $tautan) {
    $tautan->setAttribute('rel', 'noopener noreferrer');
}
```

## 3. Membaca Berkas XML Raksasa Secara Streaming dengan `XMLReader` (Hemat RAM & Aman dari XXE)

Apabila Anda harus memproses berkas umpan XML berukuran ratusan megabyte, memuatnya ke `DOMDocument` atau `SimpleXMLElement` akan memakan RAM berlipat ganda dari ukuran berkasnya. Gunakan **`XMLReader`** yang bergerak maju selangkah demi selangkah (`$reader->read()`), dan pastikan selalu menggunakan bendera **`LIBXML_NONET`** untuk memblokir pengambilan entitas jaringan eksternal (**pencegahan XML External Entity / XXE**):

```php
<?php
declare(strict_types=1);

/**
 * Membaca elemen <produk> dari berkas XML besar satu per satu tanpa memuat seluruh pohon ke RAM.
 *
 * @return iterable<array{kode: string, harga: int}>
 */
function bacaKatalogXmlStreaming(string $jalurBerkasXml): iterable
{
    // LIBXML_NONET mencegah akses jaringan saat mengurai XML (perlindungan berlapis XXE)
    $reader = XMLReader::open($jalurBerkasXml, 'UTF-8', LIBXML_NONET | LIBXML_NOERROR);
    if ($reader === false) {
        throw new RuntimeException('Gagal membuka berkas XML.');
    }

    try {
        while ($reader->read()) {
            if ($reader->nodeType === XMLReader::ELEMENT && $reader->localName === 'produk') {
                $kode  = $reader->getAttribute('kode') ?? '';
                $harga = (int) $reader->readString();
                yield ['kode' => $kode, 'harga' => $harga];
            }
        }
    } finally {
        $reader->close();
    }
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Mengaktifkan bendera berbahaya `LIBXML_NOENT` (Substitusi Entitas) pada XML dari pengguna:** Jangan pernah menyalakan `LIBXML_NOENT` atau `resolveExternals = true` saat mengurai XML yang diunggah pengguna! Bendera `LIBXML_NOENT` justru **mengaktifkan** ekspansi entitas XML yang dapat membuka celah **XXE (*XML External Entity*)** untuk membaca `/etc/passwd` server Anda.
2. **Mencampur node antara `DOMDocument` lama dan `Dom\HTMLDocument` baru tanpa memahami perbedaannya:** Kelas di dalam namespace baru `Dom\` (`Dom\HTMLDocument`, `Dom\Element`, `Dom\NodeList`) merupakan hierarki modern yang terpisah dari kelas `DOMElement` warisan.
3. **Memanggil `SimpleXMLElement` pada berkas XML 500 MB:** `SimpleXMLElement` membangun seluruh pohon objek di memori RAM sekaligus; gunakan `XMLReader` untuk berkas XML berukuran besar.

## Latihan Praktik Mandiri

1. Buat fungsi `ekstrakDaftarHeading(string $htmlArtikel): array` menggunakan `Dom\HTMLDocument::createFromString($htmlArtikel, LIBXML_NOERROR)` dan `$dokumen->querySelectorAll('h2, h3')` untuk menghasilkan daftar isi otomatis beserta teks dan nilai atribut `id`-nya.
2. Buat pengujian PHPUnit yang menguji `ekstrakDaftarHeading` dengan HTML5 yang mengandung emoji UTF-8 dan elemen `<article>`/`<section>`, serta menguji `bacaKatalogXmlStreaming` menggunakan berkas XML sementara.

## Kuis Pemahaman

### Soal 1
Mengapa kelas `Dom\HTMLDocument` (diperkenalkan di PHP 8.4) jauh lebih akurat untuk mengurai dokumen web modern dibandingkan `DOMDocument::loadHTML()` warisan?
- A. Karena `DOMDocument` lama sudah dihapus dari PHP 8.4
- B. Karena `DOMDocument::loadHTML()` menggunakan parser HTML 4 lama yang sering gagal memahami aturan tag HTML5 modern, merusak karakter UTF-8 tanpa deklarasi meta khusus, dan belum mendukung `querySelector()` bawaan, sedangkan `Dom\HTMLDocument` mengimplementasikan parser HTML5 sesuai spesifikasi WHATWG lengkap dengan dukungan selektor CSS
- C. Karena `Dom\HTMLDocument` tidak menggunakan memori RAM sama sekali
- D. Karena `Dom\HTMLDocument` otomatis mengubah HTML menjadi PDF

**Jawaban Benar:** B
**Penjelasan:** `Dom\HTMLDocument` dibangun di atas mesin parser HTML5 yang patuh penuh pada spesifikasi WHATWG HTML Living Standard, menggunakan UTF-8 secara bawaan, dan menyediakan metode `querySelector()` / `querySelectorAll()`.

### Soal 2
Ketika aplikasi PHP Anda harus membaca dan mengekstrak jutaan baris data dari berkas XML berukuran 2 GB tanpa menghabiskan memori RAM server, kelas standar manakah yang paling tepat digunakan?
- A. `SimpleXMLElement`
- B. `Dom\XMLDocument::createFromString(file_get_contents($file))`
- C. `XMLReader` (membaca aliran node secara bertahap dengan `$reader->read()` dan `yield`)
- D. `json_decode()`

**Jawaban Benar:** C
**Penjelasan:** `XMLReader` adalah *forward-only pull parser* berbasis aliran (*streaming*) yang hanya menahan node saat ini di memori, sehingga ukuran berkas XML sebesar apa pun dapat diproses dengan konsumsi RAM yang tetap kecil.

### Soal 3
Mengapa Anda **dilarang keras** mengaktifkan konstanta `LIBXML_NOENT` saat mengurai berkas XML yang berasal dari input pengguna?
- A. Karena `LIBXML_NOENT` menghapus semua atribut XML
- B. Karena terlepas dari namanya yang terdengar seperti "no entities", konstanta `LIBXML_NOENT` sebenarnya memerintahkan parser untuk **mensubstitusi/mengekspansi entitas XML**, yang dapat memicu kerentanan keamanan kritis **XML External Entity (XXE)**
- C. Karena `LIBXML_NOENT` hanya berlaku untuk HTML5
- D. Karena `LIBXML_NOENT` memperlambat kecepatan CPU hingga 50%

**Jawaban Benar:** B
**Penjelasan:** Dalam libxml2, `LIBXML_NOENT` berarti *"tidak menyisakan node referensi entitas, melainkan langsung menggantinya dengan isi entitas tersebut"*. Mengaktifkannya pada XML dari sumber tak tepercaya membuka celah serangan XXE dan *Billion Laughs Attack*.

## Sumber

- [DOM — PHP Manual](https://www.php.net/manual/en/book.dom.php)
- [The Dom\HTMLDocument class — PHP Manual](https://www.php.net/manual/en/class.dom-htmldocument.php)
- [XMLReader — PHP Manual](https://www.php.net/manual/en/book.xmlreader.php)
- [PHP 8.4 Release Announcement](https://www.php.net/releases/8.4/en.php)
- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
