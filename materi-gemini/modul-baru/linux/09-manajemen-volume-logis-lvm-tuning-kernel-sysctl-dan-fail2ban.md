# Manajemen Penyimpanan LVM, Tuning Kernel `sysctl`, dan Pengerasan SSH + `fail2ban` di Server Linux

- **Letak:** sesudah modul 8
- **Tingkat:** Lanjut
- **Ringkasan:** Memperbesar kapasitas penyimpanan server secara daring tanpa *downtime* menggunakan *Logical Volume Manager* (LVM), menyetel parameter jaringan kernel Linux melalui `/etc/sysctl.d/`, serta menerapkan konfigurasi drop-in `sshd_config` yang aman.

## Mengapa Administrasi Produksi Membutuhkan LVM dan Tuning `sysctl`?

Di server basis data atau penyimpanan log produksi, partisi disk statis tradisional sulit diperbesar ketika ruang penyimpanan penuh. **LVM (*Logical Volume Manager*)** menambahkan lapisan abstraksi di atas disk fisik sehingga Anda dapat menggabungkan disk baru dan memperluas ukuran sistem berkas `ext4` atau `XFS` secara langsung (*online resizing*) tanpa mematikan layanan database. Selain itu, server yang menangani puluhan ribu koneksi TCP konkuren membutuhkan penyetelan antrean soket kernel melalui `sysctl`.

## 1. Hirarki LVM: *Physical Volume* (PV), *Volume Group* (VG), dan *Logical Volume* (LV)

| Komponen LVM | Perintah Utama | Peran dalam Arsitektur Penyimpanan |
| :--- | :--- | :--- |
| **Physical Volume (PV)** | `pvcreate`, `pvs`, `pvdisplay` | Disk fisik atau partisi mentah (mis. `/dev/nvme1n1`) yang diinisialisasi untuk LVM |
| **Volume Group (VG)** | `vgcreate`, `vgextend`, `vgs` | Kolam penyimpanan gabungan dari satu atau beberapa PV (mis. `vg_data`) |
| **Logical Volume (LV)** | `lvcreate`, `lvextend`, `lvs` | Partisi virtual fleksibel yang diambil dari VG dan diformat dengan `ext4` atau `xfs` |

```bash
# 1. Menginisialisasi disk baru /dev/nvme1n1 sebagai Physical Volume
sudo pvcreate /dev/nvme1n1

# 2. Membuat Volume Group bernama 'vg_data' dan Logical Volume 'lv_postgres' sebesar 50 GiB
sudo vgcreate vg_data /dev/nvme1n1
sudo lvcreate -L 50G -n lv_postgres vg_data

# 3. Memformat dengan ext4 dan memasangnya
sudo mkfs.ext4 /dev/vg_data/lv_postgres
sudo mkdir -p /var/lib/postgresql
sudo mount /dev/vg_data/lv_postgres /var/lib/postgresql

# 4. Memperbesar LV sebanyak +20 GiB sekaligus memperluas filesystem secara online (-r / --resizefs)
# tanpa menghentikan layanan PostgreSQL!
sudo lvextend -r -L +20G /dev/vg_data/lv_postgres
```

## 2. Tuning Parameter Kernel Jaringan dengan `/etc/sysctl.d/`

Jangan mengedit `/etc/sysctl.conf` utama secara langsung; buat berkas *drop-in* terpisah di `/etc/sysctl.d/60-kodeloka-network.conf` lalu terapkan dengan `sudo sysctl --system`:

```ini
# /etc/sysctl.d/60-kodeloka-network.conf
# Memperbesar antrean koneksi masuk (SYN backlog & accept queue) untuk server trafik tinggi
net.core.somaxconn = 4096
net.ipv4.tcp_max_syn_backlog = 4096

# Mengaktifkan perlindungan SYN flood (SYN cookies)
net.ipv4.tcp_syncookies = 1

# Membatasi kecenderungan kernel menukar memori aplikasi ke disk swap
vm.swappiness = 10
```

## 3. Aturan Urutan *First-Match-Wins* pada Drop-In `sshd_config.d/`

Saat mengeraskan SSH di Ubuntu/Debian modern melalui folder `/etc/ssh/sshd_config.d/`, ingatlah bahwa `sshd` menggunakan prinsip **nilai pertama yang ditemukan adalah yang dipakai (*first-match-wins*)**. Karena berkas gambar *cloud* sering menyertakan `/etc/ssh/sshd_config.d/50-cloud-init.conf` yang mengaktifkan `PasswordAuthentication yes`, Anda harus menamai berkas pengerasan Anda dengan angka awalan yang **lebih kecil** (misalnya **`00-hardening.conf`**) agar dibaca lebih dulu:

```text
# /etc/ssh/sshd_config.d/00-hardening.conf
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
```

Selalu uji validitas sintaks dengan `sudo sshd -t` dan biarkan satu sesi terminal SSH lama tetap terbuka saat menjalankan `sudo systemctl reload ssh` agar Anda tidak terkunci di luar server!

## Kuis Pemahaman

### Soal 1
Perintah manakah yang memperbesar *Logical Volume* LVM sebanyak 20 GiB sekaligus langsung memperluas ukuran sistem berkas (`ext4`/`XFS`) di atasnya tanpa perlu melakukan *unmount*?
- A. `sudo pvcreate -L +20G /dev/vg_data/lv_postgres`
- B. `sudo lvextend -r -L +20G /dev/vg_data/lv_postgres`
- C. `sudo mkfs.ext4 --grow 20G /dev/vg_data/lv_postgres`
- D. `sudo fdisk --online +20G /dev/vg_data`

**Jawaban Benar:** B
**Penjelasan:** Opsi `-r` (`--resizefs`) pada `lvextend` memanggil perkakas *resize* sistem berkas (`resize2fs` untuk ext4 atau `xfs_growfs` untuk XFS) secara otomatis dan daring segera setelah volume logis diperbesar.

### Soal 2
Mengapa berkas konfigurasi tambahan SSH untuk menonaktifkan kata sandi sebaiknya diberi nama `/etc/ssh/sshd_config.d/00-hardening.conf` daripada `99-hardening.conf`?
- A. Karena `sshd` hanya membaca berkas yang namanya diawali angka `00`.
- B. Karena `sshd` menerapkan aturan nilai pertama yang dibaca (*first-match-wins*), sehingga `00-hardening.conf` dievaluasi sebelum `50-cloud-init.conf`.
- C. Karena angka `99` dicadangkan untuk koneksi FTP.
- D. Karena `systemd` menghapus semua berkas berawalan `99` saat *reboot*.

**Jawaban Benar:** B
**Penjelasan:** Dalam `sshd_config(5)`, untuk setiap opsi konfigurasi, nilai pertama yang ditemukan akan digunakan dan deklarasi berikutnya diabaikan. Berkas `00-hardening.conf` dibaca secara leksikografis sebelum `50-cloud-init.conf`.

### Soal 3
Perintah apakah yang wajib dijalankan setelah mengubah konfigurasi SSH sebelum me-reload layanan `sshd` untuk memastikan tidak ada kesalahan ketik yang membuat daemon gagal menyala?
- A. `sudo ssh-keygen -R localhost`
- B. `sudo sshd -t`
- C. `sudo sysctl -p`
- D. `sudo chmod 777 /etc/ssh/sshd_config`

**Jawaban Benar:** B
**Penjelasan:** `sshd -t` menjalankan pemeriksaan uji sintaks konfigurasi dan keabsahan kunci *host* tanpa mematikan atau mengubah proses `sshd` yang sedang berjalan.

## Sumber
- [sshd_config(5) — OpenBSD Manual Pages](https://man.openbsd.org/sshd_config)
- [Linux Kernel Documentation — Documentation for `/proc/sys/net/` (`sysctl`)](https://www.kernel.org/doc/html/latest/admin-guide/sysctl/net.html)
- [lvextend(8) — Linux Manual Page](https://man7.org/linux/man-pages/man8/lvextend.8.html)
