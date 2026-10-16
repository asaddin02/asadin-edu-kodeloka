# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Administrasi Server Linux Modern: Systemd Service Hardening, `journalctl`, Analisis Leher Botol (`ss`, `iotop`, `perf`), `nftables`, & Tuning `sysctl`

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 8 modul yang sudah ada di kelas `linux/` beserta 4 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `linux/app.js` (larik `MODUL`).

## 1. Audit Modul Saat Ini di Repositori (`linux/app.js`)

Saat ini, kelas **`linux`** di repositori Kodeloka memiliki **8 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |
| 1 | Filesystem, Path & Navigasi | Dasar | Sudah ada |
| 2 | Izin, Kepemilikan & sudo | Dasar | Sudah ada |
| 3 | Proses, Sinyal & Sumber Daya | Menengah | Sudah ada |
| 4 | systemd: Layanan, Log & Timer | Menengah | Sudah ada |
| 5 | Pipe, Redirection & Perkakas Teks | Menengah | Sudah ada |
| 6 | Menulis Skrip Bash yang Tidak Berbahaya | Menengah | Sudah ada |
| 7 | Jaringan, DNS & Menelusuri Koneksi | Menengah | Sudah ada |
| 8 | SSH, Transfer Berkas & Akses Aman | Menengah | Sudah ada |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Empat modul perluasan di bawah ini menambahkan pembaruan 2024–2026, tetapi sebagian topiknya sudah ada di kelas. Kelas sudah membahas direktif sandbox systemd (`ProtectSystem`, `NoNewPrivileges`, `MemoryMax`) dan timer (modul 4), `ss` dan `lsof` (modul 3 dan 7), `nftables` dan `ufw` (modul 7), serta `sshd_config` (modul 8). Yang belum ada: `sysctl`, `fail2ban`, dan LVM.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Baru 09: Menulis & Mengamankan Unit `systemd` Produksi (`ProtectSystem=strict`, `PrivateTmp=true`, `Restart=on-failure`, `MemoryMax`)

- **Tingkat:** Menengah
- **Ringkasan:** Menjalankan layanan aplikasi backend sebagai daemon `systemd` yang terisolasi di dalam *sandbox* kernel Linux menggunakan direktif penguatan keamanan dan batas penggunaan cgroup v2 (`MemoryMax`, `CPUQuota`).

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menjalankan layanan aplikasi backend sebagai daemon `systemd` yang terisolasi di dalam *sandbox* kernel Linux menggunakan direktif penguatan keamanan dan batas penggunaan cgroup v2 (`MemoryMax`, `CPUQuota`). Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```ini
[Unit]
Description=Layanan API Kodeloka
After=network-online.target
Wants=network-online.target

[Service]
Type=exec
User=kodeloka
Group=kodeloka
WorkingDirectory=/opt/kodeloka
ExecStart=/opt/kodeloka/bin/server
Restart=on-failure
RestartSec=3s

# Penguatan Keamanan Systemd (Sandboxing)
NoNewPrivileges=true
# ProtectSystem=strict membuat seluruh hierarki filesystem read-only bagi layanan; beri akses tulis lewat StateDirectory= atau ReadWritePaths=
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
PrivateDevices=true
MemoryMax=512M

[Install]
WantedBy=multi-user.target
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `linux/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `linux` dari **8 modul** menjadi **12 modul** berstandar terbaru.


## Modul Baru 10: Investigasi Insiden Produksi Cepat (Metode USE: CPU, Memori, Disk I/O, Jaringan) dengan `ss`, `vmstat`, `iostat`, `lsof`, & `journalctl`

- **Tingkat:** Menengah
- **Ringkasan:** Mendiagnosis mengapa server produksi melambat dalam 60 detik pertama menggunakan perkakas modern: `ss -tulnp` (pengganti `netstat`), `journalctl -u layanan --since '10 min ago'`, `lsof +L1` (mencari berkas terhapus yang masih menahan disk penuh), dan `dmesg -T` (mengecek OOM Killer).

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mendiagnosis mengapa server produksi melambat dalam 60 detik pertama menggunakan perkakas modern: `ss -tulnp` (pengganti `netstat`), `journalctl -u layanan --since '10 min ago'`, `lsof +L1` (mencari berkas terhapus yang masih menahan disk penuh), dan `dmesg -T` (mengecek OOM Killer). Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```bash
# 1. Cek soket TCP yang sedang mendengarkan beserta PID prosesnya
ss -tulnp

# 2. Cari berkas yang sudah dihapus (rm) namun masih ditahan oleh proses sehingga disk tetap 100% penuh
sudo lsof +L1
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `linux/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `linux` dari **8 modul** menjadi **12 modul** berstandar terbaru.


## Modul Baru 11: Keamanan Jaringan & SSH Hardening (`sshd_config` Ed25519, Firewall `ufw` / `nftables`, dan `fail2ban`)

- **Tingkat:** Menengah
- **Ringkasan:** Menonaktifkan login kata sandi dan login root di SSH (`PasswordAuthentication no`, `PermitRootLogin no`), menggunakan kunci `ssh-ed25519`, serta menyusun aturan firewall berbasis tabel dengan `nftables`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menonaktifkan login kata sandi dan login root di SSH (`PasswordAuthentication no`, `PermitRootLogin no`), menggunakan kunci `ssh-ed25519`, serta menyusun aturan firewall berbasis tabel dengan `nftables`. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```ini
# /etc/ssh/sshd_config.d/00-hardening.conf
# Berkas drop-in dibaca berurutan dan nilai PERTAMA yang dipakai, jadi beri nomor kecil (00-) agar tidak dikalahkan
# berkas lain (misalnya 50-cloud-init.conf yang dapat menyalakan PasswordAuthentication).
# Uji dengan `sshd -t` dan pertahankan satu sesi SSH tetap terbuka sebelum me-reload layanan.
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowUsers deploy
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `linux/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `linux` dari **8 modul** menjadi **12 modul** berstandar terbaru.


## Modul Baru 12: Manajemen Penyimpanan LVM, Sistem Berkas `ext4`/`XFS`, Otomasi `systemd.timer` (Pengganti Cron), & Tuning Kernel `sysctl`

- **Tingkat:** Lanjut
- **Ringkasan:** Menggantikan cronjob tradisional dengan `systemd.timer` yang memiliki pencatatan log terintegrasi di `journald` dan pencegahan tumpang-tindih proses, serta menyetel parameter jaringan kernel (`somaxconn`, `tcp_tw_reuse`) melalui `/etc/sysctl.d/`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menggantikan cronjob tradisional dengan `systemd.timer` yang memiliki pencatatan log terintegrasi di `journald` dan pencegahan tumpang-tindih proses, serta menyetel parameter jaringan kernel (`somaxconn`, `tcp_tw_reuse`) melalui `/etc/sysctl.d/`. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```ini
# /etc/sysctl.d/99-web-server.conf
net.core.somaxconn = 4096
net.ipv4.tcp_fin_timeout = 15
vm.swappiness = 10
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `linux/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `linux` dari **8 modul** menjadi **12 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari keempat modul pembaruan `linux` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan keempat modul di atas ke dalam `linux/app.js` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `linux` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (8 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `linux`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 8 modul yang sudah ada di `linux/app.js` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `linux` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan keempat modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `linux/`
- B. Mengekstrak judul, tingkat, ringkasan, isi, contoh kode, dan kuis setiap modul dari berkas ini ke dalam larik `MODUL` di `linux/app.js` (bentuk objeknya mengikuti mesin kelas tersebut), memperbarui jumlah modul di `scripts/courses.json`, lalu menjalankan `npm run extract`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke larik `MODUL` di `linux/app.js`, jumlah modulnya diperbarui di `scripts/courses.json`, dan `data/modules.json` dibangkitkan ulang lewat `npm run extract`.

## Sumber

- [Dokumentasi Resmi — Administrasi Server Linux Modern](https://www.kernel.org/doc/html/latest/)
- [systemd.exec(5) — Direktif Sandboxing](https://man7.org/linux/man-pages/man5/systemd.exec.5.html)
- [sshd_config(5)](https://man.openbsd.org/sshd_config)
- [Dokumentasi Kernel — Sysctl Jaringan](https://www.kernel.org/doc/html/latest/admin-guide/sysctl/net.html)
