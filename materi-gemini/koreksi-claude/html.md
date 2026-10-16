# Log koreksi materi-gemini/html (45 berkas) — 2026-10-16

Format: berkas | yang salah | perubahan | sumber

Alat bantu pemeriksaan: data Baseline `web-features` (unpkg), MDN `index.json`, Nu HTML Checker (vnu.jar) untuk semua blok HTML, Chrome/Playwright untuk menjalankan skrip contoh (41, 40, 38, 39, 28, 29, 30, 14 lulus), php.net/supported-versions (tabel di pelajaran 07 sudah benar, tidak diubah).

## A. Fakta / klaim teknis

01-cara-web-bekerja | tidak ada masalah ditemukan (hanya fence tanpa bahasa, lihat F) | - | -
02-struktur-dokumen-html | `meta charset` disebut "wajib sebelum title" (yang wajib hanya 1024 byte pertama; sebelum title adalah praktik terbaik); klaim ini juga diulang di penjelasan Soal 2 | kalimat di butir 1 dan penjelasan kuis diubah | https://html.spec.whatwg.org/multipage/semantics.html
02-struktur-dokumen-html | `inert` "Baseline Widely Available sejak 2023" (2023 = Newly available; Widely sejak 11 Okt 2025) | tanggal dikoreksi | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert
03-teks-dan-tipografi-semantik | kutipan Tim Berners-Lee bukan terjemahan kutipan asli dan judul esai salah ("Axioms of Web Architecture: The Rule of Least Power"); halaman bernama "Principles of Design", bagian "Principle of Least Power" | kutipan diganti terjemahan setia ("Semakin kurang berdaya sebuah bahasa, semakin banyak hal yang dapat dilakukan dengan data yang tersimpan dalam bahasa itu"), judul `<cite>` diperbaiki | https://www.w3.org/DesignIssues/Principles.html
03-teks-dan-tipografi-semantik | klaim pembaca layar "mendengar perubahan intonasi" untuk `<em>`/`<strong>` (secara bawaan tidak diumumkan) | dilunakkan: hanya pada pembaca layar yang dikonfigurasi mengumumkannya | -
03-teks-dan-tipografi-semantik | contoh `<small>` "PPN 11%" (tarif bisa berubah/keliru untuk 2026) | "PPN 11%" menjadi "PPN" | -
04-struktur-tata-letak-semantik | `<search>` "Widely Available sejak akhir 2023" | tersedia semua peramban sejak Okt 2023; Widely Available sejak 13 Apr 2026 | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/search
06-gambar-dan-media-responsif | AVIF "Baseline Widely Available sejak 2024" | Newly available Jan 2024, Widely available Jul 2026 | web-features `avif` (https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types)
09-validasi-formulir-bawaan | `:user-invalid` "Widely Available sejak akhir 2023" | tersedia Nov 2023, Widely Available sejak Mei 2026 | web-features `user-pseudos`
09-validasi-formulir-bawaan | tabel: `minlength`/`maxlength` tidak mencantumkan `email` | `email` ditambahkan | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input
10-aksesibilitas-web-a11y | ringkasan menjanjikan "lima aturan penggunaan WAI-ARIA", isi hanya aturan pertama | ringkasan: "aturan pertama penggunaan WAI-ARIA" | https://www.w3.org/TR/using-aria/
11-metadata-dan-seo | "tiga baris" favicon padahal contoh empat baris | "empat baris" | -
11-metadata-dan-seo | `noindex` dicontohkan untuk "dasbor privat" tanpa peringatan bahwa itu bukan pengamanan | catatan keamanan ditambahkan | -
11-metadata-dan-seo | penjelasan Soal 2 menyebut "Spesifikasi Open Graph mengharuskan URL absolut" (ogp.me tidak menyatakan wajib) | diubah menjadi "platform pratinjau mengharapkan URL absolut" | https://ogp.me/
12-elemen-interaktif-bawaan | `<details name>` "Newly Available sejak akhir 2023" (Baseline: Sep 2024; Chrome Des 2023) | dikoreksi | web-features `details-name`
12-elemen-interaktif-bawaan | `<dialog>` "Widely Available sejak Maret 2022" (Newly Mar 2022, Widely Sep 2024) | dikoreksi | web-features `dialog`
12-elemen-interaktif-bawaan | Popover "Newly Available sejak April 2024 across ..." (Baseline: 27 Jan 2025) + kata Inggris "across" | dikoreksi | web-features `popover`
14-svg-dan-canvas-dasar | `<svg>` tanpa width/height disebut membengkak ke "100vw" (sebenarnya lebar kontainer, sesuai Soal 2) | "100vw" menjadi "lebar kontainernya" | -
15-iframe-embed-dan-keamanan-sandbox | `allow-popups` "otomatis memaksa noopener" (yang benar: jendela baru mewarisi pembatasan sandbox kecuali `allow-popups-to-escape-sandbox`) | dikoreksi | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe
16-web-components-template-dan-slot | Declarative Shadow DOM "Baseline Newly Available" (Widely sejak 20 Agu 2026) | dikoreksi | web-features `declarative-shadow-dom`
17-internasionalisasi-bidi-dan-mathml | MathML "dapat dibacakan secara akurat oleh pembaca layar" (dukungan bervariasi) | dilunakkan | https://developer.mozilla.org/en-US/docs/Web/MathML
19-audit-kualitas-dan-validasi-html | ikon "Switch to Accessibility Tree view" disebut ada di Chrome/Firefox (hanya Chrome; Firefox punya panel Accessibility tersendiri) | dikoreksi | -
24-atribut-global-interaksi-... | `plaintext-only` "di semua peramban utama" tanpa konteks | dijelaskan: Newly Available Mar 2025 saat Firefox ikut mendukung | web-features `contenteditable-plaintextonly`
25-audio-dan-track-webvtt | `<track>` pada `<audio>` tidak pernah tampil (spesifikasi: audio tidak punya area visual untuk takarir) tetapi pelajaran menyiratkan takarir tersinkronisasi | catatan ditambahkan (sediakan transkrip teks) | https://html.spec.whatwg.org/multipage/media.html
25-audio-dan-track-webvtt | `preload="metadata"` pada audio disebut mengunduh "dimensi" | "dimensi" menjadi "metadata" | -
27 s.d. 44 | LIHAT bagian G (templat kosong). Klaim "(Baseline)" pada paragraf contoh salah untuk `capture`, `closedby`, Open Graph, manifest, dll. | diganti catatan status dukungan per fitur (27 inline; 28-37, 40, 42 blok catatan) | web-features (lihat G)
34-structured-data-json-ld-schema-org | FAQPage disajikan sebagai fitur hasil kaya; Google menghentikannya (hanya situs pemerintah/kesehatan sejak 2023; tidak tampil lagi sejak 7 Mei 2026) | catatan peringatan ditambahkan | https://developers.google.com/search/updates

## B. Kode contoh

14-svg-dan-canvas-dasar | `<svg hidden>` untuk sprite TIDAK menyembunyikan svg (diuji Chrome: kotak 300x150 tetap memakan ruang) | diganti `<svg width="0" height="0" style="position:absolute" aria-hidden="true">` di teks, kode, dan latihan | https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/symbol
15-iframe-embed-dan-keamanan-sandbox | contoh memakai ID video YouTube "dQw4w9WgXcQ" (video musik, bukan tutorial PostgreSQL) | diganti `ID_VIDEO_ANDA` | -
16-web-components-template-dan-slot | komentar CSS menyebut selektor `h3`/`p` padahal kode memakai `header` | disesuaikan | -
17-internasionalisasi-bidi-dan-mathml | sintaks LaTeX `$x$`, `$a^2+b^2=c^2$` mentah di prosa | diganti teks biasa/unicode | -
21-elemen-edit-dokumen-... | `(*rate limit*)` di dalam kode HTML tampil dengan tanda bintang | diganti `<em>` | -
23-peta-gambar-area-dan-objek-tersemat | `<object width="100%">` tidak valid (vnu: width harus bilangan bulat) | `width="800" ... style="width: 100%;"` | https://html.spec.whatwg.org/multipage/iframe-embed-object.html
24-atribut-global-interaksi-... | tabel `enterkeyhint` berisi LaTeX rusak (`$\rightarrow$` menjadi karakter CR, `$\checkmark$`) | diganti (→) dan (✓) | -
26-video-html5-streaming-dan-kontrol | `type="video/webm; codecs=vp9,opus"` (parameter berkoma harus dikutip) | `type='video/webm; codecs="vp9,opus"'` | https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/codecs_parameter
40 (hasil penulisan ulang) | `role="dialog"`/`aria-modal` pada `<aside>` ditolak vnu | diganti `<div>` | -
27-44 | contoh "Implementasi" tidak berisi satu pun fitur yang dibahas, dan `<title>`/`<h1>` memuat backtick mentah (HTML rusak) | contoh diganti kode nyata yang divalidasi vnu dan (untuk 28, 29, 30, 38, 39, 40, 41) diuji di Chrome; JSON (34, 35) divalidasi; hash SRI (37) dihitung dari berkas nyata | lihat G

## C. Kuis

02-struktur-dokumen-html | penjelasan Soal 2 menyiratkan spesifikasi mewajibkan charset sebelum title | diperbaiki (lihat A) | -
11-metadata-dan-seo | penjelasan Soal 2 overclaim "Spesifikasi Open Graph mengharuskan" | diperbaiki (lihat A) | -
21-elemen-edit-dokumen-... | penjelasan Soal 2 berisi kutipan Inggris | diterjemahkan (lihat E) | -
19-audit-kualitas-dan-validasi-html | penjelasan Soal 2 berisi kutipan spesifikasi Inggris | diterjemahkan (lihat E) | -
Catatan: seluruh jawaban benar pada 135 soal sudah diperiksa; tidak ada yang keliru. Soal 27-44 hanya ketat secara teknis tetapi generik (lihat G).

## D. URL sumber yang diganti / diperbarui

Semua 42 URL unik di berkas 01-26 dan 45 resolve (HTTP 200, tanpa redirect); tidak ada W3Schools/GfG/blog. URL berikut tetap diubah karena tidak sesuai dengan judul tautannya:
24 | MDN `/Web/HTML` (judul "Global attributes") | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes
24 | spesifikasi root (judul "User interaction") | https://html.spec.whatwg.org/multipage/interaction.html
25 | spesifikasi root (judul "Media Elements") | https://html.spec.whatwg.org/multipage/media.html
27 | MDN/WHATWG/web.dev generik | input/file, attributes/accept, attributes/capture, multipage/input.html
28 | generik | dialog, HTMLDialogElement/returnValue, Invoker_Commands_API, interactive-elements.html
29 | generik | Popover_API, Global_attributes/popover, multipage/popover.html
30 | generik | Elements/details, interactive-elements.html
31 | generik | web.dev optimize-lcp, fetch-priority, cls, MDN img
32 | generik | WebVTT_API, Web_Video_Text_Tracks_Format, Elements/track, https://www.w3.org/TR/webvtt1/
33 | generik | https://ogp.me/, MDN meta, multipage/semantics.html
34 | generik | https://www.w3.org/TR/json-ld11/, schema.org/TechArticle, schema.org/BreadcrumbList, Google Search Central intro-structured-data dan /search/updates
35 | generik | MDN Progressive_web_apps/Manifest, meta/name/theme-color, https://www.w3.org/TR/appmanifest/
36 | generik | MDN rel/preload, rel/preconnect, rel/modulepreload, web.dev preconnect-and-dns-prefetch, preload-critical-assets
37 | generik | MDN Subresource_Integrity, Referrer-Policy, CORS, https://www.w3.org/TR/sri/
38 | generik | MDN ARIA, https://www.w3.org/TR/wai-aria-1.2/, https://www.w3.org/TR/html-aria/, https://www.w3.org/WAI/ARIA/apg/
39 | generik | MDN Live_regions, status_role, alert_role, WAI-ARIA 1.2
40 | generik | MDN inert, tabindex, autofocus, multipage/interaction.html
41 | generik | APG breadcrumb, APG tabs, MDN aria-current, multipage/sections.html
42 | generik | MDN presentation_role, multipage/tables.html, MDN table
43 | generik | https://html.spec.whatwg.org/multipage/obsolete.html, MDN Elements, MDN table
44 | spesifikasi WHATWG (WCAG bukan spesifikasi WHATWG) | https://www.w3.org/TR/WCAG22/, WAI new-in-22, WAI preliminary checks, web.dev learn/accessibility
Semua URL baru dicek ulang: 103 URL unik di seluruh berkas, semuanya HTTP 200 tanpa redirect.

## E. Bahasa

07-tabel-data | kalimat Inggris "Table with 4 rows and 3 columns" | "Tabel dengan 4 baris dan 3 kolom" | -
19-audit-kualitas-dan-validasi-html | kutipan Inggris "transparent/phrasing content, but there must be no interactive content descendant" | diterjemahkan | -
21-elemen-edit-dokumen-... | "contact information for the nearest article or body ancestor" | diterjemahkan | -
12-elemen-interaktif-bawaan | kata Inggris "across" | diganti "di" | -

## F. Format

01, 02, 04, 05, 13 | 6 blok kode diagram ASCII tanpa tag bahasa | ditambahkan ` ```text ` | -
Semua 45 berkas lulus lint format (judul, Tingkat, Ringkasan, 3 soal A-D, Jawaban Benar, Penjelasan, ## Sumber terakhir).

## G. Templat kosong pelajaran 27-44 (perlu keputusan editor)

Berkas 27 s.d. 44 (18 berkas) dibuat dari satu templat generik: bagian "Mengapa Topik ... Penting", tabel "Praktik Buruk/Standar Modern", contoh yang tidak memuat fitur apa pun, dan kuis yang hanya tautologis ("Apa tujuan utama X? Memberikan instruksi deklaratif... terkait perilaku X"). Ringkasan di tiap berkas menjanjikan materi yang tidak ada di badan pelajaran. Yang saya perbaiki: contoh kode diganti kode nyata yang benar, catatan status dukungan, paragraf sumber/ spesifikasi, dan daftar Sumber. Yang TIDAK saya ubah (di luar mandat "perbaiki yang salah"): teks umum, tabel generik, dan kuis. Rekomendasi: tulis ulang badan dan kuis 27-44 sebelum publikasi, atau tunda berkas tersebut.

## H. Perlu dicek (catatan `> Perlu dicek` yang tersisa)

Tidak ada baris `> Perlu dicek` yang ditambahkan; semua klaim terbaru (2025-2026) berhasil dikonfirmasi lewat data resmi:
- Baseline (web-features/MDN, data per 16 Okt 2026): search, inert, popover, dialog, details-name, invoker-commands, closedby (bukan Baseline), fetchpriority (Newly Oct 2024), dns-prefetch (Newly Sep 2025), DSD (Widely Agu 2026), avif, user-pseudos, loading-lazy, plaintext-only, MathML.
- Google FAQ rich result dihentikan 7 Mei 2026 (https://developers.google.com/search/updates).
- Siklus PHP 8.2-8.5 di pelajaran 07 cocok dengan https://www.php.net/supported-versions.php.
Hal yang tidak diverifikasi: perilaku preview kartu tiap platform sosial (pelajaran 11/33) dan dukungan CSS klien surel (pelajaran 42); keduanya diberi catatan umum agar diuji manual.
