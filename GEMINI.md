# Tugas Gemini: materi HTML, CSS, JavaScript, dan PHP untuk Kodeloka

> Berkas ini adalah instruksi tugas untuk Gemini. Baca seluruhnya di awal setiap sesi, lalu baca `materi-gemini/README.md` (kalau sudah ada) untuk melanjutkan dari tempat sesi sebelumnya berhenti.

Repo: https://github.com/asaddin02/asadin-edu-kodeloka
Situs: https://kodeloka.asadinedu.com

## Latar

Kodeloka adalah situs kelas pemrograman berbahasa Indonesia. Kelas yang sudah ada antara lain Linux, Nginx, PostgreSQL, Kafka, Kubernetes, dan Golang; lihat folder-folder di repo dan katalognya di situs. Yang belum ada justru dasar web: **HTML, CSS, JavaScript, dan PHP**.

Tugasmu: **riset sebebas dan seluas mungkin, lalu tulis materi keempat kelas itu selengkap-lengkapnya di satu folder baru.** Kamu cukup menulis materinya. Setelah itu, Claude Code memindahkan materimu ke bentuk kelas Kodeloka supaya tampil di situs, dan Codex merapikan tampilannya.

## Tempat menulis

Tulis semuanya di folder **`materi-gemini/`** di akar repo, dalam Markdown. Susunan yang disarankan (boleh kamu kembangkan):

```
materi-gemini/
  README.md            daftar isi seluruh materi, urutan belajar, dan catatan untuk Claude
  html/
    01-cara-web-bekerja.md
    02-…
  css/
  javascript/
  php/
```

- Satu berkas berisi satu pelajaran. Nomori sesuai urutan belajar.
- Di awal setiap berkas, tulis judul, tingkat (Dasar, Menengah, atau Lanjut), dan satu kalimat ringkasan.
- Isinya bebas: penjelasan, contoh kode, latihan, kesalahan umum, tips, studi kasus, proyek kecil, dan kuis. Makin lengkap makin baik.

## Ruang lingkup

Mulai dari nol sampai siap kerja. Sebagai gambaran minimal, bukan batas:

- **HTML:** cara web bekerja, struktur dokumen, teks semantik, tautan, media, tabel, formulir dan validasi, aksesibilitas, metadata dan SEO, elemen interaktif bawaan (`dialog`, `details`, `popover`), performa pemuatan, proyek halaman.
- **CSS:** selektor, kaskade dan spesifisitas, box model, satuan, flexbox, grid, desain responsif dan container query, warna dan tipografi, transisi dan animasi, custom properties, nesting, arsitektur CSS, debugging.
- **JavaScript:** tipe dan operator, fungsi dan closure, objek dan array, class, Map dan Set, penanganan galat, event loop, Promise dan async/await, fetch, DOM dan event, penyimpanan di peramban, modul, keamanan front-end, pengujian, proyek aplikasi.
- **PHP:** versi yang didukung, sintaks dan tipe, string dan array, fungsi, OOP, enum, exception, Composer dan autoload, menangani permintaan, keluaran aman, session dan cookie, unggah berkas, PDO, kata sandi, CSRF, struktur proyek, pengujian, produksi dengan PHP-FPM, proyek aplikasi.

Kalau menurutmu ada topik penting yang belum disebut, tambahkan.

## Beberapa aturan saja

1. **Bahasa Indonesia** yang baku dan enak dibaca. Sapa pembaca dengan "Anda". Istilah teknis boleh tetap dalam bahasa Inggris dengan penjelasan.
2. **Tulis dengan kata-katamu sendiri.** Jangan menyalin teks dari situs lain.
3. **Setiap berkas ditutup dengan bagian "Sumber"** berisi tautan halaman yang benar-benar kamu baca. Utamakan dokumentasi resmi (MDN, WHATWG, W3C, ECMAScript, php.net, web.dev) dan sertakan sumber lain yang bermutu sebagai pelengkap.
4. **Contoh kode harus benar dan bisa dijalankan.** Sebutkan versi atau dukungan peramban untuk fitur yang masih baru, misalnya "sejak PHP 8.1" atau status Baseline di MDN.
5. Kalau ragu akan suatu fakta, tandai dengan `> Perlu dicek:` daripada menebak.
6. **Hanya tulis di dalam `materi-gemini/`.** Jangan mengubah berkas atau folder lain di repo.
7. **Kamu tidak bisa push ke repo.** Di akhir setiap sesi, sediakan **seluruh folder `materi-gemini/`** sebagai satu berkas zip untuk diunduh pemilik (nama yang disarankan: `materi-gemini-<repo>.zip`). Isinya: semua berkas yang sudah ada di repo, ditambah berkas baru dan berkas yang kamu ubah. Jangan hanya berkas baru. Claude memasukkan isi zip ke repo; folder ini tidak ikut ter-deploy ke situs.

## Status dan tanda selesai

Baris pertama `materi-gemini/README.md` selalu berisi status:

- `Status: BERJALAN`, selama kamu masih menambah materi;
- `Status: SELESAI`, **hanya kalau menurutmu informasinya sudah lebih dari cukup** untuk keempat kelas.

Claude baru mulai mengecek dan memindahkan materi ke situs setelah status berubah menjadi `SELESAI`. Jadi tidak perlu terburu-buru: lanjutkan riset di sesi berikutnya sampai kamu sendiri yakin materinya lengkap.

README juga berisi:
- daftar semua berkas;
- jumlah pelajaran per kelas;
- bagian yang belum sempat ditulis;
- semua tanda `Perlu dicek`;
- catatan sampai mana sesi terakhir berhenti.
