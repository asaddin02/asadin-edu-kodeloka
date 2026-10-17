# Tugas Gemini untuk Kodeloka: selesaikan, lengkapi, dan perbaiki materi

> Berkas ini adalah instruksi tugas untuk Gemini. Baca seluruhnya di awal setiap sesi, lalu baca bagian atas `materi-gemini/README.md` untuk melanjutkan dari tempat sesi sebelumnya berhenti.

Repo: https://github.com/asaddin02/asadin-edu-kodeloka
Situs: https://kodeloka.asadinedu.com

## Latar

Kodeloka adalah situs kelas pemrograman berbahasa Indonesia: 23 kelas, 637 modul. Di sesi sebelumnya kamu menulis materi kelas HTML, CSS, JavaScript, dan PHP di `materi-gemini/`. Claude Code memeriksa semuanya dan menayangkan 94 pelajaran yang utuh. Sisanya dikembalikan kepadamu.

Tahap ini punya tiga tugas. **Riset sebebas dan seluas mungkin.** Kamu cukup menulis materinya. Claude Code memeriksa fakta dan memindahkan hasilmu ke situs, lalu Codex merapikan tampilannya.

Pekerjaannya besar dan butuh banyak sesi. Di setiap sesi, kerjakan sebanyak mungkin, lalu catat kemajuanmu di README. Urutan yang disarankan: Tugas 1, lalu Tugas 2 dari kelas yang paling tipis, lalu Tugas 3. Kalau menurutmu urutan lain lebih baik, silakan.

## Tugas 1: selesaikan kelas HTML, CSS, JavaScript, dan PHP

Folder: `materi-gemini/html/`, `css/`, `javascript/`, `php/`.

- **Tulis ulang pelajaran templat** yang belum tayang: HTML 27–44, JavaScript 22–54, dan PHP 25–54. Syaratnya ada di bagian atas `materi-gemini/README.md`.
- **CSS 20–49** sudah ditulis ulang oleh Claude, tetapi belum tayang. Periksa, perdalam, dan lengkapi; jangan menulis dari nol.
- **Pelajaran yang sudah tayang** boleh kamu perbaiki dan perdalam langsung di berkasnya. Selalu mulai dari isi berkas di repo, karena isinya sudah memuat koreksi Claude.

## Tugas 2: lengkapi penjelasan di kelas yang sudah ada

Banyak modul di 19 kelas lama terlalu tipis: penjelasannya hanya beberapa baris, kalimatnya terpotong, atau konsepnya disebut tanpa dijelaskan. Contohnya, materi Golang rata-rata hanya 48 kata per bab, padahal ada 267 bab. FastAPI, Next.js, Git & CI/CD, Microservices, Docker, dan Redis juga punya banyak modul di bawah 300 kata.

- **`materi-gemini/DAFTAR-MODUL.md`** memuat semua modul beserta nomor, jumlah kata, dan halamannya di situs. Mulailah dari modul bertanda **tipis**, tetapi kamu bebas memilih modul lain yang menurutmu kurang lengkap atau keliru.
- Isi asli setiap kelas ada di `<folder>/app.js` (misalnya `golang/app.js`) dan tampil di halaman yang tercantum di daftar.
- **Jangan mengubah `app.js`.** Tulis perbaikanmu di `materi-gemini/perbaikan/<folder>/`, satu berkas per modul, dengan nama `NNN-judul-singkat.md`. NNN adalah nomor modul di daftar, misalnya `perbaikan/golang/006-tipe-data-number.md`.
- Tanda `**` yang tampil mentah di beberapa halaman adalah masalah konversi. Claude yang memperbaikinya, jadi tidak perlu dicatat.

Isi setiap berkas perbaikan:

```markdown
# Perbaikan: <judul modul persis seperti di DAFTAR-MODUL.md>

- **Kelas:** golang
- **Modul:** 6
- **Jenis:** tambahan

## Yang kurang
Satu sampai tiga kalimat: apa yang hilang, terpotong, atau keliru.

## Koreksi
> Teks lama: "kutipan persis dari materi yang sekarang"

Teks baru: kalimat penggantinya.

## Materi tambahan
Penjelasan, contoh kode, tabel, kesalahan umum, dan seterusnya, dalam Markdown.
Tulis di mana tambahan ini diletakkan, misalnya "setelah judul 2. Floating Point" atau "di akhir materi".

## Sumber
- ...
```

**Jenis** boleh lebih dari satu:
- **tambahan**: materi lama tetap ada, tulisanmu disisipkan;
- **pengganti**: seluruh tab Materi diganti tulisanmu (beri judul bagiannya `## Materi pengganti`). Pakai ini kalau materi lama terlalu tipis untuk ditambal. Tulisanmu harus tetap mencakup semua yang dibahas materi lama;
- **koreksi**: hanya kalimat tertentu yang diganti. Kutip teks lamanya persis supaya Claude bisa menemukannya.

Hapus bagian yang tidak kamu pakai.

## Tugas 3: modul baru untuk kelas yang sudah ada

Kalau ada topik penting yang belum dibahas di sebuah kelas, tulis modul baru di `materi-gemini/modul-baru/<folder>/NN-judul.md`.

- Pakai format yang sama dengan pelajaran Tugas 1: judul, tingkat, ringkasan, isi, 3 soal kuis, dan Sumber.
- Tambahkan satu baris `- **Letak:** sesudah modul N` di bagian atas berkas.
- Cek `DAFTAR-MODUL.md` dulu supaya tidak mengulang modul yang sudah ada.
- Folder lama `pembaruan-19-kelas/` boleh dipakai sebagai bahan. Auditnya salah (setiap kelas disebut "0 modul"), jadi periksa ulang setiap modulnya.

## Beberapa aturan saja

1. **Bahasa Indonesia** yang baku dan enak dibaca. Sapa pembaca dengan "Anda". Istilah teknis boleh tetap dalam bahasa Inggris dengan penjelasan.
2. **Tulis dengan kata-katamu sendiri.** Jangan menyalin teks dari situs lain.
3. **Setiap berkas ditutup dengan bagian "Sumber"** berisi halaman spesifik yang benar-benar kamu baca, bukan halaman indeks. Utamakan dokumentasi resmi: MDN, WHATWG, W3C, ECMAScript, php.net, web.dev, go.dev, dokumentasi resmi setiap alat. Sumber lain yang bermutu boleh jadi pelengkap.
4. **Contoh kode harus benar dan bisa dijalankan.** Sebutkan versi atau dukungan peramban untuk fitur yang masih baru, misalnya "sejak PHP 8.1", "sejak Go 1.23", atau status Baseline di MDN.
5. **Tulis khusus untuk setiap topik.** Tabel, latihan, dan kuis yang disalin sama ke banyak berkas akan ditolak, seperti 111 pelajaran templat di sesi pertama.
6. Kalau ragu akan suatu fakta, tandai dengan `> Perlu dicek:` daripada menebak.
7. **Hanya tulis di dalam `materi-gemini/`.** Jangan mengubah berkas atau folder lain di repo.
8. **Kamu tidak bisa push ke repo.** Di akhir setiap sesi, sediakan **seluruh folder `materi-gemini/`** sebagai satu berkas zip untuk diunduh pemilik (nama yang disarankan: `materi-gemini-kodeloka.zip`). Isinya: semua berkas yang sudah ada di repo, ditambah berkas baru dan berkas yang kamu ubah. Jangan hanya berkas baru. Claude memasukkan isi zip ke repo; folder ini tidak ikut ter-deploy ke situs.

## Status dan tanda selesai

Baris pertama `materi-gemini/README.md` selalu berisi status:

- `Status: BERJALAN`, selama kamu masih bekerja;
- `Status: SELESAI`, **hanya kalau menurutmu ketiga tugas sudah lebih dari cukup**.

Claude baru mulai mengecek dan memindahkan materi ke situs setelah status berubah menjadi `SELESAI`. Jadi tidak perlu terburu-buru.

Di bagian atas README, perbarui juga:
- tabel kemajuan per tugas;
- berkas yang kamu tulis atau ubah di sesi ini;
- semua tanda `Perlu dicek`;
- sampai mana sesi terakhir berhenti.
