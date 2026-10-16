# Log koreksi pelajaran PHP (materi-gemini/php), 2026-10-16

Format: `file | apa yang salah | apa yang diubah | URL sumber [kategori]`. Kategori: fact, code, quiz, source, language. File yang dirujuk berawalan nomor pelajaran (mis. 14 = 14-basis-data-dengan-pdo.md).

Jumlah baris perubahan: 111 (fact 27, code 14, quiz 14, source 51, language 5).

Verifikasi: 55 berkas ditinjau; seluruh 49 URL asli di `## Sumber` ternyata mengembalikan HTTP 200 (tidak ada yang mati), tetapi banyak yang menunjuk halaman indeks umum atau halaman yang salah. Setelah koreksi, 179 URL unik di semua `## Sumber` dicek ulang dengan curl dan semuanya HTTP 200. Tidak ada W3Schools/GeeksforGeeks/blog/media sosial. Validator format (judul, Tingkat, Ringkasan, Kuis, A-D, satu Jawaban Benar, Sumber terakhir, tag bahasa pada blok kode) lulus.

## Perubahan

### Fakta/versi/klaim teknis

04 | koma akhir pada argumen pemanggilan dikatakan "sejak PHP 8.0"; sebenarnya argumen pemanggilan sejak 7.3, parameter sejak 8.0 | kalimat dibetulkan | https://wiki.php.net/rfc/trailing_comma_in_parameter_list [fact]
06 | menyiratkan JsonSerializable diperlukan agar enum menghasilkan nilai skalar di json_encode(); padahal Backed Enum sudah otomatis begitu (Pure Enum melempar galat) | catatan dikoreksi | https://www.php.net/manual/en/language.enumerations.serialization.php [fact]
09 | composer.lock dikatakan memuat "checksum SHA-256" paket; lock memuat referensi commit/dist (shasum opsional) dan `content-hash` | kalimat dikoreksi | https://getcomposer.org/doc/01-basic-usage.md [fact]
10 | request_parse_body() digambarkan hanya untuk multipart PUT/PATCH; manual: mendukung multipart/form-data dan application/x-www-form-urlencoded untuk metode selain POST, dan body hanya bisa dikonsumsi sekali | kalimat dilengkapi | https://www.php.net/manual/en/function.request-parse-body.php [fact]
11 | karakter pengganti U+FFFD tampil sebagai kode kosong `` (dua kali); LaTeX `$\rightarrow$` tidak akan dirender; entitas `'` tidak akurat | diganti `U+FFFD` (�), panah →, dan dijelaskan `&apos;` (ENT_HTML5) vs `&#039;` (HTML 4.01) | https://www.php.net/manual/en/function.htmlspecialchars.php [fact]
14 | komentar "new PDO() di PHP 8.2+" menyesatkan (new PDO tersedia di semua versi) | dikoreksi | https://www.php.net/manual/en/pdo.connect.php [fact]
15 | Ringkasan menjanjikan "peppering dengan hash_hmac" tetapi isi pelajaran tidak membahasnya | frasa dihapus dari Ringkasan | https://www.php.net/manual/en/function.password-hash.php [fact]
15 | hash tiruan Bcrypt cost 12 dipakai untuk menyamakan waktu padahal hash asli Argon2id (waktu berbeda, enumerasi masih mungkin) | ditambah catatan agar hash tiruan memakai algoritma/parameter yang sama | https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html [fact]
16 | klaim `<img src>` lintas situs akan membawa cookie SameSite=Lax (peramban modern tidak mengirim cookie Lax pada subresource lintas situs) | dibatasi pada cookie tanpa SameSite, di teks dan opsi Soal 1 | https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#samesite [fact]
17 | keluaran IntlDateFormatter/NumberFormatter tergantung versi ICU/CLDR; tidak bisa dipastikan | ditambah catatan Perlu dicek | https://www.php.net/manual/en/class.intldateformatter.php [fact]
18 | Ringkasan menyebut `SplFileObject` dan `flock()` yang tidak dibahas (isi memakai LOCK_EX dan php://output) | disesuaikan dengan isi | https://www.php.net/manual/en/function.file-put-contents.php [fact]
19 | "pelajaran sebelumnya" memakai #[\Deprecated], #[Test], #[DataProvider] padahal belum pernah dibahas | diubah menjadi akan ditemui pada pelajaran berikutnya | - [fact]
19 | penjelasan Soal 2 menyebut `ReflectionAttribute::getAttributes()` (metode itu tidak ada; getAttributes ada pada ReflectionClass/Method/dll. dan mengembalikan ReflectionAttribute) | dikoreksi | https://www.php.net/manual/en/language.attributes.reflection.php [fact]
20 | Container dan MiddlewareInterface contoh diberi label PSR-11/PSR-15 padahal tidak mengikuti antarmuka PSR | ditambah catatan bahwa itu ilustrasi dan antarmuka PSR sebenarnya | https://www.php-fig.org/psr/psr-11/ [fact]
22 | menyebut PSR-3 mewajibkan format JSON satu baris; PSR-3 hanya mendefinisikan LoggerInterface, level (RFC 5424), pesan dan context, bukan format keluaran; kelas contoh tidak mengimplementasikan LoggerInterface | kalimat dikoreksi | https://www.php-fig.org/psr/psr-3/ [fact]
23 | isi teknis (atribut, public static data provider, createStub/createMock) benar untuk PHPUnit 12.5; namun PHPUnit 13 sudah rilis (6 Feb 2026) sehingga pembaca perlu tahu status versi | ditambah catatan versi: PHPUnit 12 butuh PHP 8.3+, bugfix sampai 5 Feb 2027; PHPUnit 13 butuh PHP 8.4+ | https://phpunit.de/supported-versions.html [fact]
24 | 70 dari 80 disebut "ruang aman 15%" (sebenarnya 12,5%) | diubah menjadi "sekitar 12%" | https://www.php.net/manual/en/install.fpm.configuration.php [fact]
24 | Ringkasan menyebut JIT yang tidak dibahas di pelajaran ini | frasa " dan JIT" dihapus | - [fact]
26 | "PHP 8.2 hingga PHP 8.5" / tabel "PHP 8.2–8.5" untuk pola BcMath\Number, padahal kelas ini baru ada sejak PHP 8.4 | diubah menjadi PHP 8.4 hingga 8.5 | https://www.php.net/manual/en/class.bcmath-number.php [fact]
27 | pola Dom\HTMLDocument (PHP 8.4+) ditulis berlaku di "PHP 8.2 hingga 8.5"; Dom\HTMLDocument juga bukan "pengganti" DOMDocument (DOMDocument tetap ada) | rentang diubah ke 8.4–8.5 dan frasa diperhalus | https://www.php.net/manual/en/class.dom-htmldocument.php [fact]
29 | klaim bahaya extractTo mentah tidak dapat dipastikan dari manual | ditambah catatan Perlu dicek | https://www.php.net/manual/en/ziparchive.extractto.php [fact]
30 | Ringkasan menyebut `sodium_crypto_secretbox / AES-256-GCM` (secretbox memakai XSalsa20-Poly1305, bukan AES-GCM); "AEAD" untuk secretbox (tidak ada additional data) | diperbaiki | https://www.php.net/manual/en/function.sodium-crypto-secretbox.php [fact]
31 | menyebut header `alg` "di dalam payload JWT" (alg ada di header JWT, bukan payload), 3 tempat | diganti "di dalam token JWT" | https://www.rfc-editor.org/rfc/rfc8725 [fact]
45 | validasi SSRF disajikan sebagai aman tetapi tidak menutup DNS rebinding (resolusi ulang saat permintaan), redirect, dan IPv6 | ditambah catatan keamanan di dalam kode (CURLOPT_RESOLVE, matikan FOLLOWLOCATION, periksa IPv6) | https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html [fact]
52 | kalimat Kerentanan/Soal 1/Penjelasan menyiratkan `composer install` tanpa --no-dev "membuang CPU untuk mengecek berkas" (itu efek opcache.validate_timestamps=1; --no-dev soal ukuran image dan permukaan serangan) | kalimat dipisah menurut sebab masing-masing (3 tempat) | https://getcomposer.org/doc/03-cli.md [fact]
55 | Ringkasan menyebut Asymmetric Visibility, autentikasi `password_hash()`, dan transaksi PDO; kode proyek tidak memakai satupun (tidak ada login, tidak ada properti private(set), tidak ada beginTransaction) | Ringkasan disesuaikan dengan kode (Readonly Class, PDO Prepared Statements, proteksi sesi, CSRF) | https://www.php.net/manual/en/language.oop5.basic.php [fact]
55 | tree menyebut CatatanRepository memakai "Transaksi" padahal tidak ada transaksi | "& Transaksi" dihapus | - [fact]

### Kode

02 | contoh nullable `? Pengaturan` salah tulis (spasi setelah ?) | diganti `?Pengaturan` | https://www.php.net/manual/en/language.types.declarations.php [code]
02 | "Cara Lama" slug memakai str_replace(' ', '-') sehingga hasilnya 'belajar-php-8.5-di-kodeloka', tidak setara versi pipe (titik dibuang) | disamakan jadi str_replace([' ', '.'], ['-', ''], ...) | https://www.php.net/releases/8.5/en.php [code]
03 | kunci array `' sslmode'` mengandung spasi di depan (typo; kunci jadi berbeda dari 'sslmode') | diperbaiki jadi 'sslmode' | https://www.php.net/manual/en/language.types.array.php [code]
08 | jalur latihan `./latihan-src/ Matematika/Deret.php` mengandung spasi (akan memecah nama folder) | spasi dihapus | https://www.php-fig.org/psr/psr-4/ [code]
14 | kueri UPDATE memakai :jumlah dua kali dengan ATTR_EMULATE_PREPARES=false; manual PDO::prepare: nama parameter yang sama tidak boleh dipakai lebih dari sekali kecuali mode emulasi aktif (HY093 di MySQL) | dipisah menjadi :jumlah dan :jumlah_minimal + catatan | https://www.php.net/manual/en/pdo.prepare.php [code]
16 | jalur `/ catatan/hapus` mengandung spasi (typo) | spasi dihapus | - [code]
20 | `clone($respons, ['header' => ...])` dipanggil dari luar class Response pada properti `public readonly`; RFC clone_with_v2: gagal dengan Error "Cannot modify protected(set) readonly property ... from scope" | diganti `new Response(isi:, status:, header:)` + komentar | https://wiki.php.net/rfc/clone_with_v2 [code]
25 | contoh kode memakai FilesystemIterator::FOLLOW_SYMLINKS padahal pola yang diajarkan (dan latihan) hanya SKIP_DOTS; mengikuti symlink dapat keluar dari direktori dasar (risiko path traversal) | FOLLOW_SYMLINKS dihapus | https://www.php.net/manual/en/class.filesystemiterator.php [code]
34 | `JSON_THROW_ON_ERROR / JSON_UNESCAPED_UNICODE / JSON_UNESCAPED_SLASHES` memakai "/" (bukan operator bitwise OR "\|") di tabel, latihan, Soal 2, dan penjelasan | diganti `\|` (di tabel di-escape) | https://www.php.net/manual/en/json.constants.php [code]
38 | kode contoh `$ adalahSimulasi = ...` (spasi setelah $) adalah parse error | diganti `$adalahSimulasi` | https://www.php.net/manual/en/language.variables.basics.php [code]
39 | contoh Fiber: `$hasilAkhir = $fiber->resume(...)` lalu dicetak sebagai hasil akhir; resume() mengembalikan null ketika fiber selesai, nilai return harus diambil dengan getReturn() | diganti resume() lalu getReturn() | https://www.php.net/manual/en/fiber.getreturn.php [code]
44 | kode mutex cache: proses yang gagal mendapat kunci tidur 100 ms lalu memanggil $pembangkitData() lagi (komentar bilang "baca kembali"), sehingga semua proses tetap menghantam database dan stampede tidak tercegah | setelah usleep, baca ulang dari cache dulu, baru fallback ke $pembangkitData() | https://redis.io/docs/latest/commands/set/ [code]
48 | `filename="` . rawurlencode(...) menghasilkan nama berkas dengan %20 apa adanya di peramban | diganti `filename*=UTF-8''` . rawurlencode(...) (RFC 6266) | https://www.rfc-editor.org/rfc/rfc6266 [code]
54 | ekspresi `ini_get('display_errors') === '0'` salah: boolean ini bernilai off dikembalikan ini_get sebagai string kosong atau "0" (manual ini_get) | diganti `!filter_var(ini_get('display_errors'), FILTER_VALIDATE_BOOL)` (5 tempat) | https://www.php.net/manual/en/function.ini-get.php [code]

### Kuis

19 | Soal 3: validasi target atribut dikatakan "langsung ditolak"; PHP memeriksa target saat newInstance() | dibetulkan | https://www.php.net/manual/en/language.attributes.reflection.php [quiz]
34 | Soal 1: jawaban benar B menyebut celah keamanan/integritas/OOM, padahal alasan OFFSET besar adalah kueri lambat (database membaca dan membuang baris); tidak cocok dengan penjelasan | opsi B ditulis ulang agar sesuai penjelasan | https://www.postgresql.org/docs/current/queries-limit.html [quiz]
38 | Soal 1: opsi benar B (celah keamanan/OOM) tidak cocok dengan penjelasan (exit 0 pada kegagalan menipu CI/CD) | opsi B ditulis ulang | https://www.php.net/manual/en/function.exit.php [quiz]
39 | Soal 1: opsi benar B (celah keamanan/OOM) tidak cocok dengan penjelasan (Fiber bukan paralelisme) | opsi B ditulis ulang | https://www.php.net/manual/en/language.fibers.php [quiz]
41 | Soal 1: opsi benar B (celah keamanan/OOM) tidak cocok dengan penjelasan (bug tipe array baru ketahuan saat runtime) | opsi B ditulis ulang | https://phpstan.org/user-guide/getting-started [quiz]
42 | Soal 1: opsi benar B (celah keamanan/OOM) tidak cocok dengan penjelasan (primitive obsession) | opsi B ditulis ulang | - [quiz]
43 | Soal 1: opsi benar B (celah keamanan/OOM) tidak cocok dengan penjelasan (efek samping email ikut menggagalkan pembayaran) | opsi B ditulis ulang | https://www.php-fig.org/psr/psr-14/ [quiz]
44 | Soal 1: opsi benar B (celah keamanan/OOM) tidak cocok dengan penjelasan (stampede ke database) | opsi B ditulis ulang | - [quiz]
47 | Soal 1: opsi benar B (celah keamanan/OOM) tidak cocok dengan penjelasan (penggabungan string merusak terjemahan/jamak) | opsi B ditulis ulang | https://unicode-org.github.io/icu/userguide/format_parse/messages/ [quiz]
49 | Soal 1: opsi benar B (celah keamanan/OOM) tidak cocok dengan penjelasan (mock tidak mendeteksi SQL salah) | opsi B ditulis ulang | https://docs.phpunit.de/en/12.5/test-doubles.html [quiz]
50 | Soal 1: opsi benar B (celah keamanan/OOM) tidak cocok dengan penjelasan (liveness vs readiness) | opsi B ditulis ulang | https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/ [quiz]
52 | Soal 1: opsi benar B (celah keamanan/OOM) tidak cocok dengan penjelasan | opsi B ditulis ulang | - [quiz]
53 | Soal 1: opsi benar B (celah keamanan/OOM) tidak cocok dengan penjelasan (big-bang rewrite gagal) | opsi B ditulis ulang | - [quiz]
27 | Soal 1: opsi benar B (celah keamanan/OOM) tidak cocok dengan penjelasan (loadHTML salah mengurai HTML5/merusak UTF-8) | opsi B ditulis ulang | https://www.php.net/manual/en/class.dom-htmldocument.php [quiz]

### Bahasa/format

11 | diagram "Atribut Beranda Kutip" (salah terjemah) | diganti "Atribut Berkutip" | https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html [language]
11 | latihan menyebut "empat metode statis" padahal daftar berisi tiga metode (item 4 adalah pengujian) | diganti "tiga" | - [language]
26 | Soal 3: judul dibungkus backtick bersarang sehingga kode inline rusak | backtick luar diganti tanda kutip | - [language]
35,37,39,40,41,47,52 | Soal 3 menyebut judul pelajaran dalam backtick bersarang (kode inline rusak) | backtick luar diganti tanda kutip | - [language]
01,07,11,15,16,20,22,24,55 | blok kode untuk diagram ASCII/keluaran tanpa penanda bahasa (aturan format: setiap blok kode wajib bertag bahasa) | ditambah tag `text` pada 10 blok | - [language]

### Sumber

01 | tautan "Type declarations" menuju language.types.php (halaman salah) | diganti ke language.types.declarations.php | https://www.php.net/manual/en/language.types.declarations.php [source]
03 | tautan "Strings" menuju language.types.php dan "mbstring" menuju refs.international.php (bukan halaman yang dimaksud) | diganti ke language.types.string.php dan book.mbstring.php, ditambah halaman Arrays | https://www.php.net/manual/en/book.mbstring.php [source]
04 | sumber kurang spesifik | ditambah halaman First-class callable syntax dan NoDiscard di manual | https://www.php.net/manual/en/class.nodiscard.php [source]
05 | konten teknis diperiksa terhadap manual PHP 8.4/8.5 dan benar; sumber kurang spesifik | ditambah halaman Property hooks dan Override di manual | https://www.php.net/manual/en/language.oop5.property-hooks.php [source]
07 | tautan "Exceptions" menuju langref.php (indeks umum) | diganti ke halaman Error Handling, Throwable, SPL Exceptions, set_exception_handler | https://www.php.net/manual/en/language.error-handling.php [source]
08 | tautan "Namespaces" menuju langref.php; PSR-4 menuju indeks PSR | diganti ke language.namespaces.php dan php-fig.org/psr/psr-4/, ditambah spl_autoload_register | https://www.php-fig.org/psr/psr-4/ [source]
09 | sumber kurang untuk SemVer/audit | ditambah halaman Versions and constraints dan CLI | https://getcomposer.org/doc/articles/versions.md [source]
10 | tautan "Superglobals" menuju langref.php | diganti ke language.variables.superglobals.php, ditambah request_parse_body dan URI extension | https://www.php.net/manual/en/book.uri.php [source]
11 | sumber | ditambah json_encode (manual) | https://www.php.net/manual/en/function.json-encode.php [source]
12 | semua klaim teknis (setcookie options 7.3, partitioned 8.5, session_regenerate_id, use_strict_mode) cocok dengan manual; hanya sumber ditambah | ditambah session_destroy dan session.configuration | https://www.php.net/manual/en/function.setcookie.php [source]
13 | isi teknis benar (finfo, move_uploaded_file, UPLOAD_ERR_*); sumber ditambah | ditambah move_uploaded_file, finfo, OWASP File Upload Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html [source]
16 | sumber | ditambah MDN Sec-Fetch-Site | https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Sec-Fetch-Site [source]
17 | tautan intl menuju refs.international.php; 8.4 announcement dipakai untuk createFromTimestamp (tidak tercantum di sana) | diganti ke book.intl.php, halaman manual createFromTimestamp dan getMicrosecond | https://www.php.net/manual/en/datetimeimmutable.createfromtimestamp.php [source]
18 | tautan Generators menuju langref.php | diganti ke language.generators.overview.php, ditambah fgetcsv dan flock | https://www.php.net/manual/en/language.generators.overview.php [source]
19 | tautan Attributes menuju langref.php | diganti ke halaman attributes overview, reflection, pcre modifiers | https://www.php.net/manual/en/language.attributes.overview.php [source]
20 | tautan PSR menuju indeks umum php-fig.org/psr/ | diganti PSR-7, PSR-11, PSR-15 | https://www.php-fig.org/psr/psr-15/ [source]
21 | tautan "Function Reference (cURL)" menuju manual/en/index.php (beranda manual) | diganti curl_share_init_persistent, RFC wiki.php.net, book.curl.php, RFC 6585 | https://www.php.net/manual/en/function.curl-share-init-persistent.php [source]
22 | tautan PSR menuju indeks PSR; SensitiveParameter menuju langref.php; Error Reporting menuju security.php | diganti ke psr-3, class.sensitiveparameter.php, security.errors.php | https://www.php.net/manual/en/class.sensitiveparameter.php [source]
23 | sumber | ditambah Test Doubles dan Supported Versions | https://docs.phpunit.de/en/12.5/test-doubles.html [source]
24 | sumber | ditambah opcache.configuration dan dokumentasi Nginx FastCGI | https://www.php.net/manual/en/opcache.configuration.php [source]
25 | tautan umum langref.php | diganti SPL Data structures, SPL Iterators, RecursiveDirectoryIterator | https://www.php.net/manual/en/spl.datastructures.php [source]
26 | tautan umum langref.php | diganti BC Math, BcMath\Number, GMP, Floating point numbers | https://www.php.net/manual/en/book.bc.php [source]
27 | tautan umum langref.php | diganti DOM, Dom\HTMLDocument, XMLReader | https://www.php.net/manual/en/class.dom-htmldocument.php [source]
28 | tautan umum langref.php | diganti GD, imagewebp, imageavif, getimagesize | https://www.php.net/manual/en/book.image.php [source]
29 | tautan umum langref.php | diganti ZipArchive, Zlib, gzencode | https://www.php.net/manual/en/class.ziparchive.php [source]
30 | tautan umum langref.php | diganti Sodium, sodium_crypto_secretbox, OpenSSL | https://www.php.net/manual/en/book.sodium.php [source]
31 | tautan umum langref.php | diganti hash_equals, RFC 7636, RFC 8725, WebAuthn L3 | https://www.rfc-editor.org/rfc/rfc7636 [source]
32 | tautan umum langref.php | diganti Enumerations, OWASP Authorization & IDOR cheat sheets | https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html [source]
33 | tautan umum langref.php | diganti PDO transactions, PDO book, PostgreSQL explicit locking | https://www.postgresql.org/docs/current/explicit-locking.html [source]
34 | tautan umum langref.php | diganti json_encode, JSON constants, RFC 9457 | https://www.rfc-editor.org/rfc/rfc9457 [source]
35 | tautan umum langref.php | diganti unserialize (manual) dan OWASP Deserialization Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html [source]
36 | tautan umum langref.php | diganti mail(), RFC 7208 (SPF), RFC 6376 (DKIM) | https://www.rfc-editor.org/rfc/rfc6376 [source]
37 | tautan umum langref.php | diganti pcntl_async_signals dan pcntl_signal | https://www.php.net/manual/en/function.pcntl-async-signals.php [source]
38 | tautan umum langref.php | diganti getopt dan Using PHP from the command line | https://www.php.net/manual/en/function.getopt.php [source]
39 | tautan umum langref.php | diganti Fibers, class Fiber, RFC Fibers | https://wiki.php.net/rfc/fibers [source]
40 | tautan umum langref.php | diganti Lazy Objects, newLazyGhost, WeakMap, Reference counting | https://www.php.net/manual/en/language.oop5.lazy-objects.php [source]
41 | tautan umum langref.php | diganti PHPStan getting started, PHPDoc types, Psalm | https://phpstan.org/writing-php-code/phpdoc-types [source]
42 | tautan umum langref.php | diganti Properties (readonly) dan Classes and Objects | https://www.php.net/manual/en/language.oop5.properties.php [source]
43 | tautan umum langref.php | diganti PSR-14 | https://www.php-fig.org/psr/psr-14/ [source]
44 | tautan umum langref.php | diganti PSR-16, PSR-6, Redis SET | https://www.php-fig.org/psr/psr-16/ [source]
45 | tautan umum langref.php | diganti OWASP SSRF dan OS Command Injection, escapeshellarg, realpath | https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html [source]
46 | tautan umum langref.php | diganti MDN CORS, MDN HSTS, RFC 6797, OWASP HTTP Headers | https://www.rfc-editor.org/rfc/rfc6797 [source]
47 | tautan umum langref.php | diganti MessageFormatter, Spoofchecker, ICU MessageFormat | https://www.php.net/manual/en/class.messageformatter.php [source]
48 | tautan umum langref.php | diganti MDN SSE, WHATWG SSE, Nginx internal, RFC 6266 | https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events [source]
49 | tautan umum langref.php | diganti PHPUnit fixtures, PSR-7, PDO transactions | https://docs.phpunit.de/en/12.5/fixtures.html [source]
50 | tautan umum langref.php | diganti W3C Trace Context, Kubernetes probes, OpenTelemetry PHP | https://www.w3.org/TR/trace-context/ [source]
51 | tautan umum langref.php | diganti FrankenPHP worker docs dan RoadRunner docs | https://frankenphp.dev/docs/worker/ [source]
52 | tautan umum langref.php | diganti OPcache preloading, opcache config, Docker multi-stage, Composer CLI | https://www.php.net/manual/en/opcache.preloading.php [source]
53 | tautan umum langref.php | diganti panduan migrasi 8.4 dan 8.5 serta Rector | https://www.php.net/manual/en/migration85.php [source]
54 | tautan umum langref.php | diganti OWASP Top 10, ASVS, Session Management Basics, ini_get | https://owasp.org/Top10/ [source]
55 | tautan umum langref.php | diganti Enumerations, First-class callable, nl2br, RFC 9110 (303) | https://www.rfc-editor.org/rfc/rfc9110.html#name-303-see-other [source]

## URL yang diganti

Tidak ada URL asli yang mati (semua 200). URL berikut diganti karena menunjuk halaman yang salah/terlalu umum (halaman indeks) atau tidak sesuai judul tautan:

- https://www.php.net/manual/en/langref.php (dipakai sebagai "Exceptions", "Namespaces", "Superglobals", "Generators", "Attributes", "Predefined Attributes", dan "PHP Manual — Language Reference & Extensions" di 07, 08, 10, 18, 19, 22, 25-54, 55) diganti halaman topik: language.error-handling.php, language.namespaces.php, language.variables.superglobals.php, language.generators.overview.php, language.attributes.overview.php, class.sensitiveparameter.php, dan halaman per-topik di 25-54.
- https://www.php.net/manual/en/language.types.php (judul "Type declarations" di 01 dan "Strings" di 03) diganti language.types.declarations.php dan language.types.string.php.
- https://www.php.net/manual/en/refs.international.php (judul mbstring/intl di 03 dan 17) diganti book.mbstring.php dan book.intl.php.
- https://www.php.net/manual/en/security.php (judul "Error Reporting" di 22) diganti security.errors.php.
- https://www.php.net/manual/en/index.php (judul "Function Reference (cURL)" di 21) diganti function.curl-share-init-persistent.php, wiki.php.net/rfc/curl_share_persistence_improvement, book.curl.php.
- https://www.php-fig.org/psr/ (indeks PSR, dipakai untuk PSR-3 di 22, PSR-4 di 08, PSR-7/11/15 di 20) diganti php-fig.org/psr/psr-3/, psr-4/, psr-7/, psr-11/, psr-15/.
- https://www.php.net/manual/en/language.oop5.basic.php dipertahankan di 05 dan 20 tetapi ditambah halaman yang lebih spesifik.
- Tautan baru (PSR-14, PSR-16, PSR-6, RFC 6585, 7208, 6376, 7636, 8725, 9457, 6266, 6797, 9110, W3C WebAuthn dan Trace Context, OWASP cheat sheets, PostgreSQL locking, Redis SET, Docker multi-stage, FrankenPHP, RoadRunner, Kubernetes probes, OpenTelemetry PHP, PHPStan, Psalm, Rector, nginx, MDN) semuanya dicek HTTP 200.

## Perlu dicek (catatan yang tersisa)

Catatan `> Perlu dicek:` yang ditambahkan di berkas:
- 17 | keluaran IntlDateFormatter/NumberFormatter (kata "pukul", spasi pada "Rp1.450.000") bergantung versi ICU/CLDR; tidak dapat dipastikan tanpa menjalankan PHP.
- 29 | apakah ZipArchive::extractTo() di PHP saat ini sudah menormalkan nama entri berisi ".." tidak dijelaskan di manual; validasi manual tetap dianjurkan.

Kesenjangan isi yang TIDAK ditulis ulang (sesuai instruksi "jangan merestrukturisasi/menulis ulang"), perlu keputusan editor sebelum terbit:

- 17 | Keluaran persis IntlDateFormatter/NumberFormatter bergantung ICU/CLDR
- 23 | Klaim "contoh juga berlaku untuk PHPUnit 13" tidak diuji (tidak ada PHP/PHPUnit di mesin ini); atribut #[Test], #[DataProvider], createStub/createMock masih ada di 13 menurut dokumentasi 13.x namun tidak dijalankan
- 25 | Judul/Ringkasan menyebut SplDoublyLinkedList, SplHeap, SplPriorityQueue, SplFixedArray, SplObjectStorage, tetapi isi hanya membahas RecursiveDirectoryIterator; isi dan kuis berupa templat generik (kuis Soal 1-3 tidak menguji SPL). Tidak ditulis ulang sesuai instruksi
- 26 | Judul/Ringkasan menyebut GMP dan pembulatan/keuangan, tetapi isi hanya satu fungsi BcMath\Number; tidak ada contoh GMP atau fungsi bcadd/bcmul; kuis generik. Tidak ditulis ulang
- 27 | Ringkasan menjanjikan XMLReader dan HTML5 penuh; isi hanya satu contoh Dom\HTMLDocument
- 28 | Ringkasan menjanjikan penghapusan EXIF, Imagick, AVIF; isi hanya contoh thumbnail WebP GD
- 29 | Ringkasan menjanjikan PHAR/gzencode; isi hanya validasi Zip Slip/Zip Bomb. Juga: Perlu dicek untuk extractTo
- 30 | Ringkasan menjanjikan Ed25519/sodium_memzero/OpenSSL; isi hanya secretbox
- 31 | Ringkasan menjanjikan validasi JWT (exp/iss/aud), alur OAuth2, WebAuthn; isi hanya fungsi PKCE
- 32 | Ringkasan menjanjikan RBAC dan IDOR; isi hanya satu kebijakan
- 33 | Ringkasan menjanjikan migrasi skema, optimistic locking, N+1; isi hanya contoh SELECT FOR UPDATE
- 34 | Ringkasan menjanjikan cursor pagination; isi hanya fungsi problem+json
- 35 | Ringkasan menjanjikan hydrator berbasis atribut; isi hanya satu DTO
- 36 | Ringkasan menjanjikan SMTP+TLS, multipart, SPF/DKIM/DMARC; isi hanya satu fungsi sanitasi header
- 37 | Ringkasan menjanjikan antrean tugas dan pencegahan memory leak; isi hanya loop sinyal
- 38 | Ringkasan menjanjikan pewarnaan ANSI; tidak ada di isi
- 39 | isi hanya satu contoh Fiber (tanpa scheduler/event loop)
- 40 | Ringkasan menjanjikan zval/refcount/WeakReference/WeakMap/OPcache-JIT; isi hanya lazy ghost
- 41 | Ringkasan menjanjikan PHPStan level 8-10; isi hanya satu kelas generik
- 42 | Ringkasan menjanjikan Entities, Repository; isi hanya satu value object
- 43 | Ringkasan menjanjikan ListenerProviderInterface dan dispatcher; isi hanya event dan satu listener (tanpa implementasi dispatcher)
- 44 | Ringkasan menjanjikan PSR-16, tag/versi invalidation; isi hanya mutex Redis
- 45 | Ringkasan menjanjikan command injection (escapeshellarg) dan path traversal lengkap; isi hanya validasi URL SSRF
- 46 | Ringkasan menjanjikan token bucket/sliding window; isi hanya CORS (HSTS di paragraf)
- 47 | Ringkasan menjanjikan gender/select dan Spoofchecker; isi hanya satu pola plural. Nama berkas menyebut gettext (tidak dibahas)
- 48 | Ringkasan menjanjikan SSE (text/event-stream) dan readfile; isi hanya X-Accel-Redirect. Pengaturan Nginx `internal` tidak ditunjukkan (tanpanya X-Accel-Redirect dapat diakses publik)
- 49 | Ringkasan menjanjikan pengujian HTTP PSR-7 dan coverage; isi hanya kelas dasar DB test
- 50 | Ringkasan menjanjikan traceparent, /healthz, profiling; isi hanya fungsi pemeriksaan readiness
- 51 | Ringkasan menjanjikan RoadRunner dan Swoole; isi hanya loop FrankenPHP (nama berkas/judul menyebut keduanya)
- 52 | Ringkasan menjanjikan Dockerfile multi-stage, non-root; isi hanya preload.php
- 53 | Ringkasan menjanjikan Characterization Tests dan Rector; isi hanya front controller jembatan
- 54 | Ringkasan menjanjikan ASVS, composer audit, uji pemulihan bencana; isi hanya fungsi audit ini
- 55 | Struktur proyek menyebut tests/CatatanRepositoryTest.php (PHPUnit 12) dan composer.json, tetapi kode tidak disertakan
- 25-54 (umum) | Pelajaran 25-54 memakai templat generik (satu cuplikan kode, kuis Soal 2 dan 3 identik antar-berkas: "pola ... adalah API standar PHP modern" dan "langkah paling tepat mengintegrasikan materi"); judul/Ringkasan menjanjikan topik jauh lebih banyak daripada isi. Tidak ada kesalahan fakta tambahan, tetapi nilai edukasinya rendah.
