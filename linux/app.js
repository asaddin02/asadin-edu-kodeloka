/* ==========================================================================
   LINUX & SHELL — Platform Pembelajaran Interaktif
   ========================================================================== */

const TOPIK_SLUG = "linux";
const TOPIK_SUB  = "fondasi sistem";

const MODUL = [
{
    id: 1,
    kategori: "1 · Fondasi",
    judul: "Filesystem, Path & Navigasi",
    tingkat: "Dasar", durasi: "13 mnt",
    tag: ["filesystem", "path", "fhs", "navigasi"],
    ringkas: "Struktur direktori Linux yang bukan sekadar konvensi, dan kenapa memahaminya menjelaskan banyak hal saat bekerja dengan kontainer.",
    isi: `
<h2>Semuanya Satu Pohon</h2>
<p>Berbeda dari Windows yang punya <code>C:</code> dan <code>D:</code>, Linux hanya punya <strong>satu</strong> akar: <code>/</code>. Disk tambahan, partisi, bahkan jaringan tidak menjadi drive terpisah — mereka <em>di-mount</em> ke suatu direktori di dalam pohon yang sama.</p>

<pre>/
├── bin, sbin  → program sistem (biasanya symlink ke /usr/bin)
├── boot       → kernel dan bootloader
├── dev        → berkas perangkat (/dev/null, /dev/sda)
├── etc        → SELURUH konfigurasi sistem
├── home       → direktori pengguna
├── lib        → pustaka bersama
├── mnt, media → titik mount
├── opt        → perangkat lunak pihak ketiga
├── proc       → semu — informasi kernel & proses
├── root       → home milik pengguna root
├── run        → data runtime (socket, PID)
├── sys        → semu — antarmuka ke perangkat
├── tmp        → sementara, dibersihkan saat reboot
├── usr        → program & data pengguna
└── var        → data yang berubah: log, cache, database</pre>

<div class="callout info">
    <div class="callout-judul">💡 /proc dan /sys bukan berkas sungguhan</div>
    <p>Keduanya adalah <em>filesystem semu</em> yang dihasilkan kernel saat dibaca. Isinya nol byte di disk. Inilah yang membuat perintah seperti <code>cat /proc/cpuinfo</code> atau <code>cat /proc/&lt;pid&gt;/limits</code> bekerja — Anda sedang bertanya langsung ke kernel, bukan membaca berkas.</p>
    <pre>cat /proc/meminfo | head -5
cat /proc/loadavg
cat /proc/1/cgroup          # di dalam kontainer, ini memberi tahu banyak hal</pre>
</div>

<h2>Path Absolut vs Relatif</h2>
<pre>/etc/nginx/nginx.conf     absolut  — selalu dari akar
./skrip.sh                relatif  — dari direktori sekarang
../data                   naik satu tingkat
~/proyek                  home pengguna saat ini
~budi/proyek              home pengguna budi</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Kenapa <code>./skrip.sh</code> butuh titik-garis miring</div>
    <p>Shell mencari program di direktori yang terdaftar pada <code>$PATH</code>, dan direktori saat ini <strong>tidak</strong> termasuk — ini disengaja demi keamanan. Tanpa itu, seseorang bisa menaruh berkas bernama <code>ls</code> berisi kode berbahaya di sebuah direktori, dan Anda menjalankannya tanpa sadar hanya dengan mengetik <code>ls</code> di sana.</p>
</div>

<h2>Navigasi & Pencarian</h2>
<pre>pwd                       # di mana saya sekarang
cd -                      # kembali ke direktori sebelumnya
ls -lh                    # daftar dengan ukuran terbaca manusia
ls -lha                   # termasuk berkas tersembunyi
ls -lt                    # urut berdasarkan waktu ubah

# Menemukan berkas
find /var/log -name "*.log" -mtime -7        # diubah 7 hari terakhir
find . -type f -size +100M                   # lebih besar dari 100 MB
find /etc -name "*.conf" -exec grep -l "listen" {} \\;

# Lebih cepat bila tersedia
locate nginx.conf
which docker              # lokasi program di $PATH
type -a python            # semua kemunculan, termasuk alias</pre>

<h2>Ruang Disk</h2>
<pre>df -h                     # ruang per filesystem
du -sh /var/log/*         # ukuran tiap isi direktori
du -sh . | sort -h        # terbesar terakhir

# Menemukan pemakan ruang terbesar
du -h /var --max-depth=2 | sort -rh | head -20</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Disk penuh padahal <code>du</code> bilang masih lega</div>
    <p>Ini situasi yang membingungkan dan sering terjadi. Penyebabnya: sebuah proses masih <strong>memegang berkas yang sudah dihapus</strong>. Ruangnya tidak dibebaskan sampai proses itu menutupnya atau berhenti — sementara <code>du</code> tidak melihatnya karena berkasnya sudah tidak ada di direktori.</p>
    <pre>lsof +L1                  # berkas terhapus yang masih dipegang proses
# Solusinya: restart proses tersebut, biasanya proses logging.

# Penyebab kedua: inode habis meski byte masih tersisa
df -i                     # periksa pemakaian inode</pre>
</div>`,
    perintah: [
        "df -h",
        "du -sh /var/log/* | sort -h",
        "find /var/log -name '*.log' -mtime -7",
        "lsof +L1",
        "df -i"
    ],
    kuis: [
        {
            tanya: "Perintah df melaporkan disk 100% penuh, tetapi du pada seluruh direktori hanya menemukan sedikit data. Apa penyebab paling umum?",
            opsi: [
                "Filesystem rusak dan perlu diperbaiki",
                "Ada proses yang masih memegang berkas yang sudah dihapus, sehingga ruangnya belum dibebaskan padahal du tidak melihatnya",
                "df selalu melaporkan angka yang salah",
                "Direktori tersembunyi tidak dihitung du"
            ],
            benar: 1,
            penjelasan: "Di Linux, ruang berkas baru dibebaskan ketika tidak ada lagi proses yang membukanya. Berkas log besar yang dihapus sementara proses logging masih menulis ke sana tetap memakan ruang, tetapi tidak muncul di du karena entri direktorinya sudah hilang. Perintah lsof +L1 menampilkannya, dan me-restart proses tersebut membebaskan ruangnya."
        },
        {
            tanya: "Kenapa direktori saat ini tidak dimasukkan ke dalam $PATH secara bawaan?",
            opsi: [
                "Karena akan memperlambat pencarian program",
                "Demi keamanan — bila termasuk, berkas berbahaya bernama seperti perintah umum dapat terjalankan tanpa sadar saat Anda berada di direktori tersebut",
                "Karena direktori saat ini selalu berubah",
                "Karena hanya root yang boleh menjalankan program lokal"
            ],
            benar: 1,
            penjelasan: "Bila direktori saat ini ikut dicari, seseorang cukup menaruh berkas bernama ls atau grep berisi kode berbahaya di sebuah direktori. Ketika Anda masuk ke sana dan mengetik perintah biasa, kode itulah yang berjalan. Keharusan menulis ./skrip.sh membuat niat menjalankan program lokal menjadi eksplisit."
        }
    ]
},
{
    id: 2,
    kategori: "1 · Fondasi",
    judul: "Izin, Kepemilikan & sudo",
    tingkat: "Dasar", durasi: "14 mnt",
    tag: ["permission", "chmod", "chown", "umask", "sudo", "setuid"],
    ringkas: "Model izin Linux yang menjelaskan mayoritas error 'Permission denied', termasuk di dalam kontainer.",
    isi: `
<h2>Membaca Keluaran ls -l</h2>
<pre>-rw-r--r--  1 budi  tim   4096 Jul 28 10:15 catatan.txt
drwxr-xr-x  2 budi  tim   4096 Jul 28 10:15 proyek/
│└┬┘└┬┘└┬┘
│ │  │  └── lainnya (others)
│ │  └───── grup
│ └──────── pemilik
└────────── jenis: - berkas, d direktori, l symlink</pre>

<table>
<thead><tr><th>Simbol</th><th>Pada berkas</th><th>Pada direktori</th></tr></thead>
<tbody>
<tr><td><code>r</code> (4)</td><td>Boleh membaca isi</td><td>Boleh melihat daftar isinya</td></tr>
<tr><td><code>w</code> (2)</td><td>Boleh mengubah isi</td><td>Boleh membuat/menghapus berkas di dalamnya</td></tr>
<tr><td><code>x</code> (1)</td><td>Boleh dijalankan</td><td>Boleh <strong>masuk</strong> ke dalamnya</td></tr>
</tbody>
</table>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Arti <code>x</code> pada direktori sering disalahpahami</div>
    <p>Pada direktori, <code>x</code> bukan berarti "dapat dieksekusi" melainkan <strong>dapat dilewati</strong>. Tanpa <code>x</code>, Anda tidak bisa masuk ke direktori itu maupun mengakses apa pun di dalamnya — bahkan bila berkas di dalamnya berizin <code>777</code>.</p>
    <p>Sebaliknya, direktori dengan <code>x</code> tapi tanpa <code>r</code> membuat Anda bisa membuka berkas yang <em>namanya sudah Anda ketahui</em>, tetapi tidak bisa melihat daftar isinya. Ini kadang dipakai secara sengaja.</p>
</div>

<h2>Mengubah Izin</h2>
<pre>chmod 644 berkas.txt        # rw- r-- r--
chmod 755 skrip.sh          # rwx r-x r-x
chmod 600 ~/.ssh/id_rsa     # rw- --- ---  (WAJIB untuk kunci privat)

# Bentuk simbolik, lebih terbaca
chmod u+x skrip.sh          # pemilik boleh eksekusi
chmod go-w berkas           # cabut tulis dari grup & lainnya
chmod -R u+rwX,go-rwx rahasia/   # X = x hanya untuk direktori

chown budi:tim berkas
chown -R www-data:www-data /var/www</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 <code>chmod 777</code> hampir tidak pernah merupakan jawaban</div>
    <p>Ketika ada error izin, mengubah semuanya menjadi <code>777</code> memang menghilangkan pesan errornya — sekaligus mengizinkan <em>siapa pun</em> di sistem itu membaca, mengubah, dan menjalankan berkas tersebut. Pada server bersama atau kontainer yang diretas, ini menjadi jalan masuk yang lebar.</p>
    <p>Alih-alih itu, cari tahu <strong>pengguna mana</strong> yang menjalankan proses tersebut, lalu berikan kepemilikan atau keanggotaan grup yang tepat. Untuk kunci SSH, izin yang terlalu longgar bahkan membuat OpenSSH <strong>menolak memakainya</strong> — itu fitur, bukan bug.</p>
</div>

<h2>umask: Izin Bawaan</h2>
<pre>umask                     # biasanya 0022

# Berkas baru : 666 - 022 = 644
# Direktori   : 777 - 022 = 755

umask 077                 # berkas baru hanya untuk pemilik (600)</pre>

<h2>Bit Khusus</h2>
<pre>chmod u+s program         # setuid  — jalan sebagai PEMILIK berkas
chmod g+s direktori       # setgid  — berkas baru mewarisi grup direktori
chmod +t /tmp             # sticky  — hanya pemilik boleh hapus berkasnya

ls -l /usr/bin/passwd
# -rwsr-xr-x  ← huruf s: berjalan sebagai root meski dipanggil pengguna biasa</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 setuid adalah target eskalasi hak akses klasik</div>
    <p>Program ber-setuid milik root berjalan dengan hak root siapa pun yang menjalankannya. Bila program itu punya celah, penyerang mendapat root. Ini vektor serangan yang sangat sering dipakai.</p>
    <pre># Audit: cari semua program setuid di sistem
find / -perm -4000 -type f 2&gt;/dev/null</pre>
    <p>Di dalam kontainer, buang kemampuan ini sepenuhnya dengan <code>--security-opt=no-new-privileges</code> atau <code>allowPrivilegeEscalation: false</code> di Kubernetes.</p>
</div>

<h2>sudo</h2>
<pre>sudo perintah             # jalankan sebagai root
sudo -u www-data perintah # jalankan sebagai pengguna lain
sudo -i                   # shell root penuh
sudo -l                   # apa saja yang boleh saya jalankan

# /etc/sudoers.d/deploy — JANGAN sunting /etc/sudoers langsung
deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart aplikasi
deploy ALL=(ALL) NOPASSWD: /usr/bin/docker compose -f /srv/app/compose.yaml up -d</pre>

<div class="callout tip">
    <div class="callout-judul">📌 Selalu pakai <code>visudo</code></div>
    <p>Kesalahan sintaks pada berkas sudoers dapat <strong>mengunci semua orang dari akses root</strong>, dan memperbaikinya memerlukan boot ke mode penyelamatan. Perintah <code>visudo</code> memvalidasi berkas sebelum menyimpannya:</p>
    <pre>sudo visudo -f /etc/sudoers.d/deploy</pre>
    <p>Beri izin sudo sesempit mungkin — daftar perintah spesifik, bukan <code>ALL</code>. Perhatikan juga bahwa mengizinkan perintah yang bisa memanggil shell (seperti <code>vim</code> atau <code>less</code>) sama saja memberi akses root penuh.</p>
</div>`,
    perintah: [
        "ls -lh",
        "chmod 600 ~/.ssh/id_rsa",
        "chown -R www-data:www-data /var/www",
        "sudo -l",
        "find / -perm -4000 -type f 2>/dev/null"
    ],
    kuis: [
        {
            tanya: "Sebuah direktori berizin r-- (baca saja, tanpa x). Apa yang bisa dilakukan pengguna?",
            opsi: [
                "Masuk ke direktori dan membaca semua berkas di dalamnya",
                "Tidak bisa masuk ke direktori maupun mengakses berkas di dalamnya, meski berkasnya berizin longgar",
                "Menghapus berkas di dalamnya",
                "Membuat berkas baru di dalamnya"
            ],
            benar: 1,
            penjelasan: "Pada direktori, bit x berarti izin melewati atau memasuki direktori tersebut. Tanpa x, jalur ke berkas di dalamnya terputus sehingga tidak ada yang bisa diakses, tidak peduli seberapa longgar izin berkas itu sendiri. Bit r hanya memberi izin membaca daftar nama, yang tanpa x pun tidak banyak berguna."
        },
        {
            tanya: "Kenapa memberi izin sudo untuk perintah seperti vim atau less sama berbahayanya dengan memberi akses root penuh?",
            opsi: [
                "Karena kedua program tersebut menyimpan berkas sementara",
                "Karena keduanya dapat menjalankan shell dari dalam program, sehingga pengguna memperoleh shell root",
                "Karena keduanya memerlukan banyak memori",
                "Karena keduanya menulis ke /etc"
            ],
            benar: 1,
            penjelasan: "Banyak program interaktif menyediakan cara menjalankan perintah shell dari dalamnya, misalnya perintah bang di vim atau less. Bila program itu dijalankan lewat sudo, shell yang muncul berjalan sebagai root. Daftar perintah pada sudoers harus dibatasi pada program yang tidak dapat memunculkan shell."
        }
    ]
},
{
    id: 3,
    kategori: "2 · Proses & Sistem",
    judul: "Proses, Sinyal & Sumber Daya",
    tingkat: "Menengah", durasi: "15 mnt",
    tag: ["proses", "sinyal", "kill", "oom", "load average"],
    ringkas: "Memeriksa apa yang sedang berjalan, menghentikannya dengan benar, dan membaca tanda-tanda sistem yang kepayahan.",
    isi: `
<h2>Melihat Proses</h2>
<pre>ps aux                    # semua proses, format BSD
ps -ef                    # format System V
ps aux --sort=-%mem | head -10    # pemakan memori terbesar
ps -eo pid,ppid,user,%cpu,%mem,etime,cmd --sort=-%cpu | head

pstree -p                 # pohon proses dengan PID
top                       # interaktif
htop                      # jauh lebih nyaman bila tersedia</pre>

<h2>Sinyal</h2>
<table>
<thead><tr><th>Sinyal</th><th>Nomor</th><th>Arti</th><th>Bisa ditangkap?</th></tr></thead>
<tbody>
<tr><td><code>SIGTERM</code></td><td>15</td><td>Tolong berhenti dengan rapi</td><td>Ya</td></tr>
<tr><td><code>SIGKILL</code></td><td>9</td><td>Mati sekarang juga</td><td><strong>Tidak</strong></td></tr>
<tr><td><code>SIGINT</code></td><td>2</td><td>Ctrl+C</td><td>Ya</td></tr>
<tr><td><code>SIGHUP</code></td><td>1</td><td>Terminal tertutup; sering dipakai untuk muat ulang konfigurasi</td><td>Ya</td></tr>
<tr><td><code>SIGSTOP</code></td><td>19</td><td>Bekukan proses</td><td>Tidak</td></tr>
</tbody>
</table>

<pre>kill 1234                 # SIGTERM (bawaan)
kill -9 1234              # SIGKILL — pilihan terakhir
kill -HUP $(pidof nginx)  # muat ulang konfigurasi nginx
pkill -f "python manage.py"
killall -u budi</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 <code>kill -9</code> sebagai kebiasaan itu merusak</div>
    <p><code>SIGKILL</code> tidak bisa ditangkap program. Proses mati seketika <strong>tanpa sempat</strong> menutup berkas, menyelesaikan transaksi database, melepas kunci, atau menuliskan buffer ke disk. Akibatnya bisa berupa berkas rusak, kunci yang menggantung, atau data yang hilang separuh.</p>
    <p>Selalu coba <code>SIGTERM</code> lebih dulu dan beri waktu beberapa detik. Gunakan <code>-9</code> hanya bila proses benar-benar tidak merespons. Inilah juga alasan Kubernetes mengirim SIGTERM lalu menunggu <em>grace period</em> sebelum SIGKILL.</p>
</div>

<h2>Membaca Load Average</h2>
<pre>uptime
# 10:15:32 up 42 days,  load average: 2.15, 1.87, 1.42
#                                     1mnt  5mnt  15mnt

nproc                     # jumlah inti CPU</pre>

<div class="callout info">
    <div class="callout-judul">💡 Load average bukan persentase CPU</div>
    <p>Angkanya adalah <strong>rata-rata jumlah proses yang siap berjalan atau menunggu I/O</strong>. Bandingkan dengan jumlah inti:</p>
    <ul>
        <li>Load 2.0 pada mesin <strong>4 inti</strong> — santai.</li>
        <li>Load 2.0 pada mesin <strong>2 inti</strong> — tepat penuh.</li>
        <li>Load 8.0 pada mesin 2 inti — ada antrean panjang.</li>
    </ul>
    <p>Yang khas Linux: proses yang menunggu <strong>I/O disk</strong> ikut dihitung. Jadi load tinggi dengan CPU menganggur biasanya berarti disk yang menjadi hambatan, bukan prosesor.</p>
</div>

<h2>Memori</h2>
<pre>free -h
#               total   used   free   shared  buff/cache   available
# Mem:           16Gi   4Gi    1Gi    200Mi        11Gi        11Gi</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Kolom "free" yang kecil itu normal</div>
    <p>Linux memakai memori yang menganggur untuk cache disk, karena RAM kosong adalah RAM yang terbuang. Kolom yang benar-benar penting adalah <strong><code>available</code></strong> — itulah yang bisa dipakai aplikasi baru, karena cache akan dilepas otomatis bila dibutuhkan.</p>
    <p>Panik karena "free tinggal 1 GB" padahal available 11 GB adalah kesalahan membaca yang sangat umum.</p>
</div>

<h2>OOM Killer</h2>
<pre># Memeriksa apakah proses dibunuh karena kehabisan memori
dmesg -T | grep -i "killed process"
journalctl -k | grep -i oom
grep -i oom /var/log/syslog</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Ketika memori habis, kernel memilih korban</div>
    <p>Linux mengizinkan alokasi memori melebihi yang tersedia (<em>overcommit</em>). Ketika benar-benar habis, kernel memilih satu proses untuk dibunuh berdasarkan skor — dan yang dipilih sering justru proses terbesar, yaitu basis data atau aplikasi utama Anda.</p>
    <p>Gejalanya membingungkan: aplikasi "mati sendiri" tanpa error di lognya sendiri. Bukti kejadiannya hanya ada di log kernel. Di kontainer, ini muncul sebagai exit code <strong>137</strong>.</p>
</div>

<h2>Melihat I/O dan Jaringan per Proses</h2>
<pre>iostat -x 2               # statistik disk, perhatikan kolom %util dan await
iotop                     # proses mana yang menulis paling banyak
ss -tulpn                 # port yang didengarkan beserta prosesnya
lsof -i :8080             # siapa yang memakai port 8080
lsof -p 1234              # berkas apa saja yang dibuka proses ini</pre>

<div class="callout tip">
    <div class="callout-judul">📌 <code>ss -tulpn</code> menjawab "port ini dipakai apa"</div>
    <p>Error "address already in use" adalah salah satu yang paling sering ditemui. Perintah ini langsung memberi tahu proses mana yang sedang memegang port tersebut, lengkap dengan PID-nya. Perintah <code>netstat</code> yang lebih lama sudah digantikan <code>ss</code> di sebagian besar distribusi.</p>
</div>`,
    perintah: [
        "ps aux --sort=-%mem | head -10",
        "free -h",
        "uptime",
        "ss -tulpn",
        "dmesg -T | grep -i 'killed process'"
    ],
    kuis: [
        {
            tanya: "Perintah free -h menunjukkan free hanya 1 GB dari total 16 GB, tetapi available 11 GB. Apakah sistem kekurangan memori?",
            opsi: [
                "Ya, sistem hampir kehabisan memori",
                "Tidak — Linux memakai memori menganggur untuk cache disk yang akan dilepas saat dibutuhkan; kolom available adalah angka yang relevan",
                "Ya, dan swap harus segera ditambah",
                "Tidak bisa disimpulkan dari perintah free"
            ],
            benar: 1,
            penjelasan: "Linux sengaja mengisi RAM yang tidak terpakai dengan cache halaman disk karena memori kosong tidak memberi manfaat apa pun. Cache tersebut langsung dilepas ketika aplikasi membutuhkan memori. Kolom available sudah memperhitungkan hal ini dan merupakan angka yang harus dipantau."
        },
        {
            tanya: "Kenapa membiasakan diri memakai kill -9 berbahaya?",
            opsi: [
                "Karena membutuhkan hak akses root",
                "Karena SIGKILL tidak bisa ditangkap program, sehingga proses mati tanpa sempat menutup berkas, menyelesaikan transaksi, atau melepas kunci",
                "Karena akan mematikan seluruh proses milik pengguna",
                "Karena sinyal 9 tidak didukung semua distribusi"
            ],
            benar: 1,
            penjelasan: "SIGTERM memberi kesempatan program menjalankan rutinitas pembersihan: menutup koneksi, menuliskan buffer ke disk, dan melepas kunci. SIGKILL menghentikan proses di tingkat kernel tanpa memberi kesempatan apa pun, sehingga berisiko meninggalkan berkas rusak atau data yang tertulis separuh."
        }
    ]
},
{
    id: 4,
    kategori: "2 · Proses & Sistem",
    judul: "systemd: Layanan, Log & Timer",
    tingkat: "Menengah", durasi: "15 mnt",
    tag: ["systemd", "systemctl", "journalctl", "unit", "timer"],
    ringkas: "Menjalankan aplikasi sebagai layanan yang otomatis menyala kembali, membaca lognya, dan menjadwalkan tugas berkala.",
    isi: `
<h2>Perintah Dasar</h2>
<pre>systemctl status nginx
systemctl start|stop|restart nginx
systemctl reload nginx            # muat ulang konfigurasi TANPA memutus koneksi
systemctl enable --now nginx      # aktifkan saat boot DAN nyalakan sekarang
systemctl disable nginx

systemctl list-units --type=service --state=running
systemctl list-unit-files --state=enabled
systemctl daemon-reload           # WAJIB setelah mengubah berkas unit</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Lupa <code>daemon-reload</code> adalah kebingungan klasik</div>
    <p>Setelah mengubah berkas <code>.service</code>, systemd masih memakai versi lama yang ada di memorinya. Anda me-restart layanan, tidak ada yang berubah, dan mulai meragukan diri sendiri. Selalu jalankan <code>systemctl daemon-reload</code> setelah menyunting unit.</p>
</div>

<h2>Unit Layanan yang Layak Produksi</h2>
<pre># /etc/systemd/system/aplikasi.service
[Unit]
Description=Layanan Pesanan
After=network-online.target postgresql.service
Wants=network-online.target

[Service]
Type=simple
User=aplikasi
Group=aplikasi
WorkingDirectory=/srv/aplikasi
EnvironmentFile=/etc/aplikasi/env
ExecStart=/srv/aplikasi/bin/server
ExecReload=/bin/kill -HUP $MAINPID

Restart=on-failure
RestartSec=5s
StartLimitIntervalSec=60
StartLimitBurst=3

# Pengerasan
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/srv/aplikasi/data
CapabilityBoundingSet=

# Batas sumber daya
LimitNOFILE=65535
MemoryMax=2G

[Install]
WantedBy=multi-user.target</pre>

<div class="callout tip">
    <div class="callout-judul">📌 Opsi pengerasan sering terlewat padahal murah</div>
    <p><code>ProtectSystem=strict</code> membuat seluruh filesystem hanya-baca kecuali yang Anda izinkan lewat <code>ReadWritePaths</code>. <code>PrivateTmp=true</code> memberi <code>/tmp</code> terisolasi. <code>NoNewPrivileges=true</code> memutus jalur eskalasi lewat setuid. Ketiganya hanya beberapa baris tetapi mempersempit dampak bila layanan Anda diretas.</p>
</div>

<div class="callout waspada">
    <div class="callout-judul">⚠️ <code>Restart=always</code> bisa menyembunyikan masalah</div>
    <p>Dengan <code>always</code>, layanan yang gagal menyala akan dicoba terus tanpa henti, dan bug konfigurasi bisa tidak terlihat berhari-hari. <code>Restart=on-failure</code> dipadu <code>StartLimitBurst</code> membuat systemd menyerah setelah beberapa kali gagal beruntun, sehingga status layanan menjadi <code>failed</code> dan alert Anda berbunyi.</p>
</div>

<h2>journalctl</h2>
<pre>journalctl -u aplikasi -f                 # ikuti secara langsung
journalctl -u aplikasi --since "1 hour ago"
journalctl -u aplikasi --since today --until "10:00"
journalctl -u aplikasi -p err             # hanya level error ke atas
journalctl -u aplikasi -n 100 --no-pager
journalctl -k                             # pesan kernel
journalctl -b -1                          # boot sebelumnya
journalctl --disk-usage
journalctl --vacuum-time=7d               # buang log lebih tua dari 7 hari</pre>

<div class="callout info">
    <div class="callout-judul">💡 Log aplikasi cukup ditulis ke stdout</div>
    <p>Bila layanan Anda dijalankan systemd, apa pun yang ditulis ke stdout dan stderr otomatis masuk journal dengan stempel waktu dan metadata unit. Aplikasi tidak perlu mengurus berkas log, rotasi, atau izin direktori sendiri. Prinsip yang sama berlaku di kontainer — dan itu bukan kebetulan.</p>
</div>

<h2>Timer sebagai Pengganti cron</h2>
<pre># /etc/systemd/system/pencadangan.service
[Unit]
Description=Pencadangan basis data

[Service]
Type=oneshot
User=postgres
ExecStart=/usr/local/bin/cadangkan.sh

# /etc/systemd/system/pencadangan.timer
[Unit]
Description=Jalankan pencadangan tiap hari pukul 02:00

[Timer]
OnCalendar=*-*-* 02:00:00
RandomizedDelaySec=300      # sebar beban antar server
Persistent=true             # kejar jadwal yang terlewat saat mesin mati

[Install]
WantedBy=timers.target</pre>

<pre>systemctl enable --now pencadangan.timer
systemctl list-timers --all
journalctl -u pencadangan.service --since today</pre>

<div class="callout tip">
    <div class="callout-judul">📌 Kelebihan timer dibanding cron</div>
    <ul>
        <li><strong>Lognya menyatu</strong> di journal, bukan bergantung pada email atau redirect manual.</li>
        <li><strong><code>Persistent=true</code></strong> menjalankan tugas yang terlewat karena mesin mati — cron tidak bisa.</li>
        <li><strong><code>RandomizedDelaySec</code></strong> mencegah seratus server menjalankan pencadangan pada detik yang sama.</li>
        <li>Bisa memakai seluruh opsi pengerasan dan batas sumber daya seperti layanan biasa.</li>
    </ul>
</div>

<h2>Ketika Layanan Gagal</h2>
<pre>systemctl status aplikasi          # baca beberapa baris log terakhir di sini
systemctl list-units --state=failed
systemctl cat aplikasi             # unit final SETELAH semua override
systemctl show aplikasi | grep -i restart
systemd-analyze verify /etc/systemd/system/aplikasi.service</pre>`,
    perintah: [
        "systemctl status aplikasi",
        "journalctl -u aplikasi -f",
        "systemctl daemon-reload",
        "systemctl list-units --state=failed",
        "systemctl list-timers --all"
    ],
    kuis: [
        {
            tanya: "Anda mengubah berkas .service lalu menjalankan systemctl restart, tetapi perubahannya tidak berpengaruh. Kenapa?",
            opsi: [
                "Berkas unit harus diletakkan di /usr/lib/systemd",
                "systemd masih memakai definisi lama di memorinya; perlu menjalankan systemctl daemon-reload lebih dulu",
                "Layanan harus di-disable dan di-enable ulang",
                "Perubahan unit baru berlaku setelah reboot"
            ],
            benar: 1,
            penjelasan: "systemd membaca berkas unit ke dalam memori dan tidak memantau perubahannya secara otomatis. Perintah daemon-reload memuat ulang definisi dari disk. Tanpa itu, restart hanya menjalankan ulang layanan dengan konfigurasi lama yang masih tersimpan."
        },
        {
            tanya: "Apa keunggulan systemd timer dibanding cron untuk tugas terjadwal?",
            opsi: [
                "Timer berjalan lebih cepat",
                "Log menyatu di journal, opsi Persistent mengejar jadwal yang terlewat saat mesin mati, dan tersedia opsi pengerasan serta batas sumber daya",
                "Timer tidak memerlukan berkas konfigurasi",
                "Timer dapat berjalan tanpa systemd"
            ],
            benar: 1,
            penjelasan: "Cron menjalankan perintah dan menyerahkan urusan log kepada Anda, serta melewatkan jadwal yang jatuh saat mesin mati. Timer systemd mewarisi seluruh kemampuan unit layanan: log terpusat, pembatasan sumber daya, opsi pengerasan, dan kemampuan mengejar jadwal yang terlewat."
        }
    ]
},
{
    id: 5,
    kategori: "3 · Shell",
    judul: "Pipe, Redirection & Perkakas Teks",
    tingkat: "Menengah", durasi: "16 mnt",
    tag: ["pipe", "grep", "awk", "sed", "jq", "redirection"],
    ringkas: "Merangkai perintah kecil menjadi analisis yang kuat — keterampilan yang paling sering terpakai saat menelusuri masalah produksi.",
    isi: `
<h2>Redirection</h2>
<pre>perintah &gt; berkas         # tulis (timpa) stdout
perintah &gt;&gt; berkas        # tambahkan
perintah 2&gt; galat.log     # stderr saja
perintah &gt; keluar.log 2&gt;&amp;1   # keduanya ke satu berkas
perintah &amp;&gt; semua.log     # ringkasnya (bash)
perintah &lt; masukan.txt    # baca dari berkas
perintah 2&gt;/dev/null      # buang pesan error</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Urutan <code>2&gt;&amp;1</code> itu penting</div>
    <pre># ✅ BENAR — stdout diarahkan ke berkas, lalu stderr mengikuti stdout
perintah &gt; berkas 2&gt;&amp;1

# ❌ SALAH — stderr menyalin tujuan stdout SAAT ITU (masih terminal),
#    baru kemudian stdout dialihkan ke berkas
perintah 2&gt;&amp;1 &gt; berkas</pre>
    <p>Kesalahan ini membuat pesan error tetap muncul di layar dan tidak tercatat — biasanya baru ketahuan saat Anda benar-benar membutuhkannya.</p>
</div>

<h2>Pipe</h2>
<pre>ps aux | grep nginx | grep -v grep
cat akses.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# Menyalurkan stderr juga
perintah |&amp; less

# tee: simpan sekaligus teruskan
perintah | tee keluaran.log | grep ERROR</pre>

<h2>grep</h2>
<pre>grep -i "error" app.log            # abaikan besar-kecil huruf
grep -r "TODO" src/                # rekursif
grep -n "gagal" app.log            # dengan nomor baris
grep -v "debug" app.log            # KECUALI yang cocok
grep -c "error" app.log            # hitung saja
grep -A3 -B3 "panic" app.log       # 3 baris sebelum & sesudah
grep -E "error|fatal|panic" app.log
grep -o "user_id=[0-9]*" app.log   # hanya bagian yang cocok
grep -l "koneksi" *.log            # nama berkasnya saja</pre>

<div class="callout tip">
    <div class="callout-judul">📌 <code>-A</code> dan <code>-B</code> mengubah cara menelusuri log</div>
    <p>Menemukan baris error saja sering tidak cukup — Anda butuh konteks di sekitarnya untuk tahu apa yang terjadi sebelumnya. <code>grep -B5 -A10 "panic"</code> memberi gambaran jauh lebih utuh daripada sekadar barisnya.</p>
</div>

<h2>awk</h2>
<pre># Kolom ke-1 dan ke-7 dari log akses
awk '{print $1, $7}' akses.log

# Baris dengan kode status 500
awk '$9 == 500' akses.log

# Jumlahkan kolom ukuran respons
awk '{jumlah += $10} END {print jumlah/1024/1024 " MB"}' akses.log

# Hitung per kode status
awk '{hitung[$9]++} END {for (k in hitung) print k, hitung[k]}' akses.log

# Pemisah kolom kustom
awk -F: '{print $1}' /etc/passwd
awk -F',' '{print $2}' data.csv</pre>

<h2>sed</h2>
<pre>sed 's/lama/baru/' berkas          # ganti kemunculan PERTAMA tiap baris
sed 's/lama/baru/g' berkas         # semua kemunculan
sed -i.bak 's/lama/baru/g' berkas  # ubah langsung, simpan cadangan .bak
sed -n '10,20p' berkas             # cetak baris 10-20
sed '/^#/d' konfigurasi            # hapus baris komentar
sed '/^$/d' berkas                 # hapus baris kosong</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 <code>sed -i</code> tanpa cadangan pada berkas produksi</div>
    <p>Opsi <code>-i</code> mengubah berkas di tempat, dan bila polanya keliru, isi aslinya sudah hilang. Selalu pakai <code>-i.bak</code> agar salinan tersimpan, atau jalankan tanpa <code>-i</code> lebih dulu untuk melihat hasilnya di layar sebelum menerapkan.</p>
</div>

<h2>jq untuk JSON</h2>
<pre>curl -s api/pesanan | jq '.'
curl -s api/pesanan | jq '.data[] | {id, total}'
curl -s api/pesanan | jq '.data[] | select(.total &gt; 100000)'
curl -s api/pesanan | jq -r '.data[].id'        # -r: tanpa tanda kutip
kubectl get pods -o json | jq -r '.items[].metadata.name'

# Menyaring log JSON terstruktur
tail -f app.log | jq -c 'select(.level=="error") | {waktu, msg, trace_id}'</pre>

<div class="callout info">
    <div class="callout-judul">💡 Inilah alasan log terstruktur sepadan</div>
    <p>Ketika log berupa JSON, <code>jq</code> mengubahnya menjadi sesuatu yang bisa dikueri: saring level, ambil field tertentu, hitung per kategori. Log berupa kalimat bebas hanya bisa dihadapi dengan regex yang rapuh. Perbedaannya sangat terasa saat menelusuri insiden.</p>
</div>

<h2>Rangkaian yang Sering Dipakai</h2>
<pre># 10 alamat IP dengan permintaan terbanyak
awk '{print $1}' akses.log | sort | uniq -c | sort -rn | head -10

# Sebaran kode status
awk '{print $9}' akses.log | sort | uniq -c | sort -rn

# Error per jam
grep ERROR app.log | awk '{print substr($1,1,13)}' | uniq -c

# 20 berkas terbesar di bawah direktori ini
find . -type f -printf '%s %p\\n' | sort -rn | head -20 | \\
  awk '{printf "%.1f MB  %s\\n", $1/1024/1024, $2}'

# Proses yang mendengarkan port beserta pemiliknya
ss -tulpn | awk 'NR&gt;1 {print $5, $7}'</pre>`,
    perintah: [
        "awk '{print $1}' akses.log | sort | uniq -c | sort -rn | head",
        "grep -B5 -A10 'panic' app.log",
        "tail -f app.log | jq -c 'select(.level==\"error\")'",
        "sed -i.bak 's/lama/baru/g' konfigurasi",
        "perintah > keluaran.log 2>&1"
    ],
    kuis: [
        {
            tanya: "Apa perbedaan antara 'perintah > berkas 2>&1' dan 'perintah 2>&1 > berkas'?",
            opsi: [
                "Keduanya identik",
                "Yang pertama mengarahkan stdout dan stderr ke berkas; yang kedua hanya mengarahkan stdout karena stderr terlanjur menyalin tujuan lama (terminal)",
                "Yang kedua lebih efisien",
                "Yang pertama hanya bekerja di bash"
            ],
            benar: 1,
            penjelasan: "Redirection dievaluasi dari kiri ke kanan. Pada bentuk kedua, 2>&1 menyalin tujuan stdout saat itu yang masih terminal, baru setelahnya stdout dialihkan ke berkas. Akibatnya pesan error tetap tampil di layar dan tidak tercatat — kesalahan yang biasanya baru disadari ketika log itu dibutuhkan."
        },
        {
            tanya: "Kenapa log berformat JSON jauh lebih berguna saat menelusuri insiden?",
            opsi: [
                "Karena ukurannya lebih kecil",
                "Karena bisa dikueri dengan alat seperti jq untuk menyaring level, mengambil field tertentu, dan menghitung agregat — bukan sekadar dicocokkan dengan regex rapuh",
                "Karena JSON otomatis terenkripsi",
                "Karena JSON tidak memerlukan stempel waktu"
            ],
            benar: 1,
            penjelasan: "Log berupa kalimat bebas memaksa Anda menulis regex untuk mengekstrak informasi, dan regex itu pecah setiap kali format pesannya sedikit berubah. Log terstruktur punya field bernama yang dapat disaring dan diagregasi secara andal, sehingga pertanyaan seperti berapa banyak error untuk pengguna tertentu bisa dijawab dalam satu perintah."
        }
    ]
},
{
    id: 6,
    kategori: "3 · Shell",
    judul: "Menulis Skrip Bash yang Tidak Berbahaya",
    tingkat: "Menengah", durasi: "15 mnt",
    tag: ["bash", "skrip", "set -e", "quoting", "shellcheck"],
    ringkas: "Skrip otomatisasi sering berjalan sebagai root di produksi — beberapa kebiasaan sederhana mencegahnya menjadi bencana.",
    isi: `
<h2>Kepala Skrip yang Wajib</h2>
<pre>#!/usr/bin/env bash
set -euo pipefail
IFS=$'\\n\\t'</pre>

<table>
<thead><tr><th>Opsi</th><th>Efek</th></tr></thead>
<tbody>
<tr><td><code>-e</code></td><td>Berhenti begitu ada perintah yang gagal</td></tr>
<tr><td><code>-u</code></td><td>Error bila memakai variabel yang belum diset</td></tr>
<tr><td><code>-o pipefail</code></td><td>Pipeline dianggap gagal bila <em>bagian mana pun</em> gagal</td></tr>
</tbody>
</table>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Tanpa ini, skrip melanjutkan setelah kegagalan</div>
    <pre>#!/bin/bash
cd /srv/aplikasi        # ← bila direktori ini tidak ada, cd gagal
rm -rf ./data/*         # ← tapi skrip TETAP LANJUT, menghapus di direktori
                        #    tempat skrip dijalankan. Bisa jadi $HOME.</pre>
    <p>Ini bukan skenario teoretis — pola persis ini pernah menghapus data produksi di banyak organisasi. <code>set -e</code> menghentikan skrip pada baris <code>cd</code>, dan <code>-u</code> menangkap variabel kosong yang menjadi penyebab umum lainnya.</p>
</div>

<h2>Tanda Kutip: Sumber Bug Nomor Satu</h2>
<pre># ❌ Nama berkas berspasi akan pecah menjadi beberapa argumen
for f in $(ls); do rm $f; done

# ✅
for f in *; do rm -- "$f"; done

# ❌ Variabel kosong membuat perintah menjadi berbahaya
rm -rf $DIR/*          # bila DIR kosong → rm -rf /*

# ✅ Selalu kutip, dan beri nilai bawaan
rm -rf "\${DIR:?DIR wajib diisi}"/*</pre>

<div class="callout tip">
    <div class="callout-judul">📌 Aturan praktis</div>
    <p><strong>Kutip setiap ekspansi variabel</strong> kecuali Anda punya alasan spesifik untuk tidak melakukannya. <code>"$var"</code>, <code>"$@"</code>, <code>"\${arr[@]}"</code>. Sintaks <code>\${VAR:?pesan}</code> membuat skrip berhenti dengan pesan jelas bila variabel kosong — jauh lebih baik daripada menjalankan perintah destruktif dengan path kosong.</p>
</div>

<h2>Kerangka Skrip yang Baik</h2>
<pre>#!/usr/bin/env bash
set -euo pipefail

readonly SKRIP_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" &amp;&amp; pwd)"
readonly LOG_TAG="pencadangan"

log()   { printf '[%s] %s\\n' "$(date -Is)" "$*" &gt;&amp;2; }
gagal() { log "GAGAL: $*"; exit 1; }

bersihkan() {
    local kode=$?
    [[ -n "\${TMPDIR_SAYA:-}" ]] &amp;&amp; rm -rf "$TMPDIR_SAYA"
    exit "$kode"
}
trap bersihkan EXIT

periksa_syarat() {
    command -v pg_dump &gt;/dev/null || gagal "pg_dump tidak ditemukan"
    [[ -n "\${DATABASE_URL:-}" ]] || gagal "DATABASE_URL belum diset"
}

utama() {
    periksa_syarat
    TMPDIR_SAYA="$(mktemp -d)"
    log "mulai mencadangkan"

    pg_dump "$DATABASE_URL" &gt; "$TMPDIR_SAYA/dump.sql" \\
        || gagal "pg_dump gagal"

    log "selesai: $(du -h "$TMPDIR_SAYA/dump.sql" | cut -f1)"
}

utama "$@"</pre>

<div class="callout info">
    <div class="callout-judul">💡 <code>trap ... EXIT</code> menjamin pembersihan</div>
    <p>Fungsi yang dipasang lewat trap EXIT berjalan apa pun cara skrip berakhir — selesai normal, gagal karena <code>set -e</code>, atau dihentikan sinyal. Ini cara paling andal memastikan direktori sementara terhapus dan kunci dilepas.</p>
</div>

<h2>Perbandingan &amp; Kondisi</h2>
<pre># Gunakan [[ ]], bukan [ ]
[[ -f "$berkas" ]]        # berkas ada
[[ -d "$dir" ]]           # direktori ada
[[ -z "$var" ]]           # kosong
[[ -n "$var" ]]           # tidak kosong
[[ "$a" == "$b" ]]        # perbandingan teks
[[ "$a" =~ ^[0-9]+$ ]]    # regex
(( angka &gt; 10 ))          # aritmetika

# Nilai bawaan
nama="\${1:-bawaan}"
: "\${WAJIB:?variabel ini harus diisi}"</pre>

<h2>Menjalankan Sesuatu Sekali Saja</h2>
<pre># Mencegah dua salinan skrip berjalan bersamaan
exec 9&gt;/var/lock/pencadangan.lock
flock -n 9 || { echo "sudah berjalan"; exit 0; }

# Alternatif
flock -n /var/lock/tugas.lock /usr/local/bin/tugas.sh</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Tugas terjadwal yang tumpang tindih</div>
    <p>Sebuah tugas yang biasanya selesai 3 menit tetapi suatu hari melambat menjadi 20 menit akan berjalan bersamaan dengan jadwal berikutnya. Bila tugas itu menyentuh basis data atau berkas yang sama, hasilnya bisa rusak. Penguncian berkas adalah pengaman yang murah dan hampir selalu layak dipasang.</p>
</div>

<h2>ShellCheck</h2>
<pre>shellcheck skrip.sh</pre>
<div class="callout tip">
    <div class="callout-judul">📌 Jalankan di CI</div>
    <p>ShellCheck menangkap variabel tak berkutip, perbandingan yang keliru, dan kesalahan kuoting sebelum skrip pernah dijalankan. Menjadikannya bagian pipeline CI mencegah seluruh kelas bug yang biasanya baru ditemukan saat skrip berjalan di produksi pada jam dua pagi.</p>
</div>`,
    perintah: [
        "set -euo pipefail",
        "shellcheck skrip.sh",
        "flock -n /var/lock/tugas.lock /usr/local/bin/tugas.sh",
        "trap bersihkan EXIT",
        "bash -n skrip.sh"
    ],
    kuis: [
        {
            tanya: "Kenapa 'set -euo pipefail' harus menjadi baris pertama setiap skrip bash?",
            opsi: [
                "Agar skrip berjalan lebih cepat",
                "Agar skrip berhenti saat ada perintah gagal, saat memakai variabel tak terdefinisi, dan saat bagian mana pun dari pipeline gagal — mencegah skrip melanjutkan operasi berbahaya",
                "Karena diwajibkan oleh standar POSIX",
                "Agar skrip dapat dijalankan tanpa hak eksekusi"
            ],
            benar: 1,
            penjelasan: "Bawaan bash adalah melanjutkan meski sebuah perintah gagal. Pola berbahaya seperti cd ke direktori yang tidak ada lalu menjalankan rm -rf akan tetap berjalan dan menghapus isi direktori yang salah. Ketiga opsi ini membuat skrip berhenti pada kegagalan pertama alih-alih melanjutkan dalam keadaan yang tidak diharapkan."
        },
        {
            tanya: "Apa fungsi sintaks ${DIR:?pesan} dalam skrip?",
            opsi: [
                "Memberi nilai bawaan bila DIR kosong",
                "Menghentikan skrip dengan pesan kesalahan bila DIR kosong atau belum diset, mencegah perintah berjalan dengan path kosong",
                "Mengubah DIR menjadi huruf besar",
                "Mengekspor DIR ke proses anak"
            ],
            benar: 1,
            penjelasan: "Bentuk :- memberi nilai bawaan, sedangkan :? menggagalkan skrip dengan pesan yang Anda tentukan. Ini penting untuk variabel yang dipakai dalam perintah destruktif: rm -rf $DIR/* dengan DIR kosong menjadi rm -rf /*, sedangkan bentuk :? menghentikannya sebelum kerusakan terjadi."
        }
    ]
},
{
    id: 7,
    kategori: "4 · Jaringan",
    judul: "Jaringan, DNS & Menelusuri Koneksi",
    tingkat: "Menengah", durasi: "14 mnt",
    tag: ["jaringan", "dns", "ss", "curl", "tcpdump", "firewall"],
    ringkas: "Menjawab pertanyaan 'kenapa layanan ini tidak bisa dihubungi' secara sistematis, dari DNS sampai paket.",
    isi: `
<h2>Urutan Diagnosis yang Sistematis</h2>
<pre>1. Apakah namanya bisa diselesaikan?    → dig / nslookup
2. Apakah hostnya hidup?                → ping (bila ICMP diizinkan)
3. Apakah portnya terbuka?              → nc -zv / telnet
4. Apakah aplikasinya menjawab?         → curl -v
5. Apakah paketnya benar-benar sampai?  → tcpdump</pre>

<p>Mengikuti urutan ini mencegah Anda menghabiskan waktu memeriksa aplikasi padahal masalahnya ada di DNS.</p>

<h2>DNS</h2>
<pre>dig api.contoh.com
dig +short api.contoh.com
dig @8.8.8.8 api.contoh.com        # tanya resolver tertentu
dig api.contoh.com MX
dig +trace api.contoh.com          # telusuri dari akar

cat /etc/resolv.conf               # resolver yang dipakai sistem
getent hosts api.contoh.com        # mengikuti /etc/nsswitch.conf</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ <code>dig</code> tidak membaca <code>/etc/hosts</code></div>
    <p><code>dig</code> berbicara langsung ke server DNS, sementara aplikasi Anda memakai resolver sistem yang <em>juga</em> memeriksa <code>/etc/hosts</code>. Akibatnya bisa membingungkan: <code>dig</code> mengembalikan satu alamat, aplikasi terhubung ke alamat lain. Gunakan <code>getent hosts</code> untuk melihat apa yang benar-benar dilihat aplikasi.</p>
</div>

<h2>Memeriksa Port</h2>
<pre>ss -tulpn                          # port yang didengarkan di mesin ini
ss -tan state established          # koneksi yang sedang aktif
ss -s                              # ringkasan statistik soket

nc -zv api.contoh.com 443          # apakah port terbuka
timeout 3 bash -c '&lt;/dev/tcp/api.contoh.com/443' &amp;&amp; echo terbuka</pre>

<div class="callout info">
    <div class="callout-judul">💡 Membaca alamat pada <code>ss -tulpn</code></div>
    <ul>
        <li><code>0.0.0.0:8080</code> — mendengarkan di <strong>semua</strong> antarmuka, terjangkau dari luar.</li>
        <li><code>127.0.0.1:8080</code> — hanya dari mesin itu sendiri.</li>
        <li><code>[::]:8080</code> — semua antarmuka IPv6.</li>
    </ul>
    <p>Layanan yang "tidak bisa dihubungi dari luar" sangat sering ternyata hanya mendengarkan di <code>127.0.0.1</code>. Ini juga penyebab umum aplikasi di dalam kontainer tidak terjangkau — di kontainer, aplikasi harus mendengarkan <code>0.0.0.0</code>, bukan localhost.</p>
</div>

<h2>curl untuk Diagnosis</h2>
<pre>curl -v https://api.contoh.com/healthz          # lihat seluruh jabat tangan
curl -I https://api.contoh.com                  # header saja
curl -sS -o /dev/null -w '%{http_code} %{time_total}s\\n' https://api.contoh.com

# Rincian waktu — sangat berguna untuk menemukan tahap yang lambat
curl -s -o /dev/null -w '
  dns      : %{time_namelookup}s
  koneksi  : %{time_connect}s
  tls      : %{time_appconnect}s
  byte 1   : %{time_starttransfer}s
  total    : %{time_total}s
' https://api.contoh.com

# Melewati DNS untuk menguji server tertentu
curl -v --resolve api.contoh.com:443:10.0.0.5 https://api.contoh.com

# Memeriksa sertifikat
echo | openssl s_client -connect api.contoh.com:443 -servername api.contoh.com 2&gt;/dev/null \\
  | openssl x509 -noout -dates -subject -issuer</pre>

<div class="callout tip">
    <div class="callout-judul">📌 Rincian waktu curl mempersempit masalah dengan cepat</div>
    <p>Bila <code>time_namelookup</code> besar, masalahnya DNS. Bila <code>time_connect</code> besar, jaringan atau firewall. Bila <code>time_appconnect</code> besar, negosiasi TLS. Bila hanya <code>time_starttransfer</code> yang besar, aplikasinya yang lambat. Satu perintah memisahkan empat kemungkinan.</p>
</div>

<h2>Firewall</h2>
<pre># ufw (Ubuntu/Debian)
ufw status verbose
ufw allow 22/tcp
ufw allow from 10.0.0.0/8 to any port 5432
ufw enable

# firewalld (RHEL/Fedora)
firewall-cmd --list-all
firewall-cmd --add-port=8080/tcp --permanent
firewall-cmd --reload

# iptables mentah
iptables -L -n -v</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Mengunci diri sendiri lewat SSH</div>
    <p>Menjalankan <code>ufw enable</code> tanpa lebih dulu mengizinkan port 22 akan memutus sesi SSH Anda seketika, dan bila tidak ada akses konsol, server itu praktis hilang. <strong>Selalu izinkan SSH lebih dulu.</strong> Untuk perubahan firewall yang berisiko, pasang jaring pengaman:</p>
    <pre># Batalkan otomatis dalam 5 menit bila Anda tidak membatalkannya
echo "ufw disable" | at now + 5 minutes
# ...uji koneksi baru...
# bila berhasil: atrm &lt;nomor-job&gt;</pre>
</div>

<h2>Melihat Paket</h2>
<pre>tcpdump -i any -n port 8080
tcpdump -i any -n host 10.0.0.5 and port 5432
tcpdump -i any -n -A port 80 | head -50      # tampilkan isi ASCII
tcpdump -i any -w tangkapan.pcap port 443    # simpan untuk Wireshark</pre>

<div class="callout info">
    <div class="callout-judul">💡 Kapan tcpdump benar-benar diperlukan</div>
    <p>Ketika semua lapisan di atas tampak benar tetapi koneksi tetap gagal, tcpdump menjawab pertanyaan yang tidak bisa dijawab alat lain: <em>apakah paketnya benar-benar sampai?</em> Melihat SYN terkirim tanpa SYN-ACK kembali langsung menunjuk ke firewall atau routing, bukan ke aplikasi.</p>
</div>`,
    perintah: [
        "ss -tulpn",
        "dig +short api.contoh.com",
        "curl -sS -o /dev/null -w '%{http_code} %{time_total}s\\n' https://api.contoh.com",
        "nc -zv api.contoh.com 443",
        "tcpdump -i any -n port 8080"
    ],
    kuis: [
        {
            tanya: "Sebuah aplikasi di dalam kontainer tidak bisa dihubungi dari luar, padahal port sudah dipublikasikan. Apa yang perlu diperiksa pada keluaran ss -tulpn?",
            opsi: [
                "Apakah protokolnya TCP atau UDP",
                "Apakah aplikasi mendengarkan di 127.0.0.1 — di dalam kontainer ia harus mendengarkan 0.0.0.0 agar terjangkau dari luar",
                "Apakah PID prosesnya bernomor kecil",
                "Apakah jumlah koneksi sudah mencapai batas"
            ],
            benar: 1,
            penjelasan: "Alamat 127.0.0.1 hanya terjangkau dari dalam namespace jaringan yang sama. Karena kontainer punya namespace jaringannya sendiri, aplikasi yang mendengarkan localhost tidak dapat dijangkau meski portnya dipetakan ke host. Aplikasi harus mengikat ke 0.0.0.0."
        },
        {
            tanya: "Kenapa hasil dig bisa berbeda dari alamat yang benar-benar dipakai aplikasi?",
            opsi: [
                "Karena dig selalu memakai cache lama",
                "Karena dig bertanya langsung ke server DNS sementara aplikasi memakai resolver sistem yang juga memeriksa /etc/hosts",
                "Karena dig hanya mendukung IPv6",
                "Karena aplikasi selalu memakai alamat IP secara langsung"
            ],
            benar: 1,
            penjelasan: "Resolusi nama pada aplikasi melewati pustaka sistem yang mengikuti urutan di /etc/nsswitch.conf, biasanya memeriksa berkas /etc/hosts sebelum bertanya ke DNS. Perintah dig melewati jalur itu sepenuhnya. Perintah getent hosts menunjukkan hasil yang sama dengan yang dilihat aplikasi."
        }
    ]
},
{
    id: 8,
    kategori: "5 · Operasi",
    judul: "SSH, Transfer Berkas & Akses Aman",
    tingkat: "Menengah", durasi: "14 mnt",
    tag: ["ssh", "kunci", "scp", "rsync", "tunnel", "hardening"],
    ringkas: "Autentikasi berbasis kunci, konfigurasi klien yang menghemat waktu, terowongan port, dan pengerasan server SSH.",
    isi: `
<h2>Kunci, Bukan Password</h2>
<pre># Buat pasangan kunci — Ed25519 lebih pendek dan cepat daripada RSA
ssh-keygen -t ed25519 -C "budi@laptop"

# Salin kunci publik ke server
ssh-copy-id budi@server

# Manual bila ssh-copy-id tidak tersedia
cat ~/.ssh/id_ed25519.pub | ssh budi@server \\
  'mkdir -p ~/.ssh &amp;&amp; cat &gt;&gt; ~/.ssh/authorized_keys'</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Izin berkas yang salah membuat SSH menolak kunci</div>
    <pre>chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 600 ~/.ssh/authorized_keys</pre>
    <p>OpenSSH <strong>sengaja menolak</strong> kunci privat yang bisa dibaca pengguna lain, dan mengabaikan <code>authorized_keys</code> yang izinnya terlalu longgar. Gejalanya menyesatkan — Anda diminta password padahal kunci sudah terpasang. Ini penyebab paling sering "kunci saya tidak bekerja".</p>
</div>

<h2>Berkas Konfigurasi Klien</h2>
<pre># ~/.ssh/config
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    AddKeysToAgent yes

Host produksi
    HostName 10.0.0.5
    User deploy
    Port 2222
    IdentityFile ~/.ssh/id_produksi
    IdentitiesOnly yes

# Menjangkau server internal lewat bastion
Host db-internal
    HostName 10.1.2.3
    User dba
    ProxyJump bastion

Host bastion
    HostName bastion.contoh.com
    User budi</pre>

<pre>ssh produksi              # cukup ini
ssh db-internal           # otomatis lewat bastion</pre>

<div class="callout tip">
    <div class="callout-judul">📌 <code>ProxyJump</code> menggantikan trik lama</div>
    <p>Dulu orang memakai <code>ssh -A</code> (agent forwarding) untuk melompat lewat bastion, yang berisiko: siapa pun dengan root di bastion dapat memakai agent Anda untuk masuk ke server lain. <code>ProxyJump</code> membuat koneksi langsung yang di-tunnel melalui bastion tanpa mengekspos kunci Anda di sana.</p>
</div>

<h2>Terowongan Port</h2>
<pre># Local forward: akses database internal dari laptop
ssh -L 5432:db-internal:5432 bastion
# lalu: psql -h localhost -p 5432

# Remote forward: mengekspos layanan lokal ke server
ssh -R 8080:localhost:3000 server

# Dynamic: proxy SOCKS
ssh -D 1080 bastion</pre>

<h2>Transfer Berkas</h2>
<pre># scp — sederhana
scp berkas.txt produksi:/srv/
scp -r direktori/ produksi:/srv/

# rsync — jauh lebih baik untuk apa pun yang berulang
rsync -avz --progress ./situs/ produksi:/var/www/situs/
rsync -avz --delete ./situs/ produksi:/var/www/situs/   # cerminkan persis
rsync -avz --exclude='node_modules' --exclude='.git' ./ produksi:/srv/app/
rsync -avzn ./situs/ produksi:/var/www/    # -n: uji coba, tidak menyalin</pre>

<div class="callout waspada">
    <div class="callout-judul">⚠️ Garis miring di akhir path sumber sangat berarti</div>
    <pre>rsync -av ./situs  tujuan:/var/www/    → menghasilkan /var/www/situs/
rsync -av ./situs/ tujuan:/var/www/    → menyalin ISI situs ke /var/www/</pre>
    <p>Digabung dengan <code>--delete</code>, salah menaruh garis miring dapat menghapus isi direktori tujuan yang tidak Anda maksud. Selalu jalankan dengan <code>-n</code> lebih dulu untuk melihat apa yang akan terjadi.</p>
</div>

<h2>Pengerasan Server SSH</h2>
<pre># /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
ChallengeResponseAuthentication no
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers deploy budi
Port 2222

# Uji konfigurasi SEBELUM memuat ulang
sshd -t
systemctl reload sshd</pre>

<div class="callout bahaya">
    <div class="callout-judul">🚫 Jangan tutup sesi lama sebelum menguji yang baru</div>
    <p>Setelah mengubah konfigurasi SSH, <strong>biarkan sesi Anda saat ini tetap terbuka</strong> dan buka koneksi baru di terminal lain untuk mengujinya. Bila konfigurasi barunya salah, sesi lama masih menjadi jalan masuk untuk memperbaikinya. Menutup sesi lalu menemukan konfigurasi baru rusak berarti server hanya bisa diselamatkan lewat konsol penyedia.</p>
</div>

<h2>Menjaga Sesi Tetap Hidup</h2>
<pre># tmux — pekerjaan tetap berjalan meski koneksi terputus
tmux new -s deploy
# Ctrl+B lalu D untuk melepas
tmux attach -t deploy
tmux ls</pre>

<div class="callout tip">
    <div class="callout-judul">📌 Selalu pakai tmux untuk pekerjaan panjang</div>
    <p>Migrasi basis data atau proses build yang berjalan langsung di sesi SSH akan mati bila koneksi Anda terputus — dan jaringan selalu bisa terputus. Menjalankannya di dalam tmux membuat pekerjaan tetap berlanjut, dan Anda cukup menyambung kembali.</p>
</div>`,
    perintah: [
        "ssh-keygen -t ed25519 -C 'budi@laptop'",
        "ssh-copy-id budi@server",
        "rsync -avzn ./situs/ produksi:/var/www/",
        "ssh -L 5432:db-internal:5432 bastion",
        "sshd -t"
    ],
    kuis: [
        {
            tanya: "Kunci SSH sudah disalin ke server tetapi Anda tetap diminta password. Apa penyebab paling sering?",
            opsi: [
                "Kunci Ed25519 tidak didukung server",
                "Izin berkas terlalu longgar — OpenSSH menolak kunci privat yang dapat dibaca pengguna lain dan mengabaikan authorized_keys yang izinnya longgar",
                "Server perlu di-restart",
                "Kunci publik harus dikonversi ke format PEM"
            ],
            benar: 1,
            penjelasan: "OpenSSH memeriksa izin berkas sebagai kontrol keamanan dan diam-diam mengabaikan kredensial yang tidak terlindungi dengan benar, lalu jatuh kembali ke autentikasi password. Direktori .ssh harus 700, kunci privat 600, dan authorized_keys 600."
        },
        {
            tanya: "Apa perbedaan 'rsync -av ./situs tujuan:/var/www/' dan 'rsync -av ./situs/ tujuan:/var/www/'?",
            opsi: [
                "Tidak ada perbedaan",
                "Tanpa garis miring akhir, direktori situs disalin menjadi /var/www/situs/; dengan garis miring, isinya yang disalin langsung ke /var/www/",
                "Garis miring hanya memengaruhi kecepatan transfer",
                "Garis miring membuat transfer menjadi rekursif"
            ],
            benar: 1,
            penjelasan: "Garis miring di akhir path sumber berarti isi direktori, bukan direktorinya sendiri. Perbedaan ini menjadi berbahaya bila digabung dengan --delete, karena struktur tujuan bisa berbeda dari yang diharapkan dan berkas yang tidak dimaksud ikut terhapus. Jalankan dengan -n lebih dulu untuk melihat rencananya."
        }
    ]
}
];

/* ==========================================================================
   ENGINE PEMBELAJARAN — dipakai bersama oleh Kubernetes, PostgreSQL, Kafka
   ========================================================================== */

const KUNCI_SIMPAN = TOPIK_SLUG + "_progres";

let indeksAktif = 0;
let kategoriAktif = "SEMUA";
let kataCari = "";
let selesai = muatProgres();

function muatProgres() {
    try {
        return new Set(JSON.parse(localStorage.getItem(KUNCI_SIMPAN) || "[]"));
    } catch {
        return new Set();
    }
}

function simpanProgres() {
    try {
        localStorage.setItem(KUNCI_SIMPAN, JSON.stringify([...selesai]));
    } catch { /* penyimpanan tidak tersedia — abaikan */ }
}

function aturUlangProgres() {
    selesai = new Set();
    simpanProgres();
    render();
}

function daftarKategori() {
    return ["SEMUA", ...new Set(MODUL.map(m => m.kategori))];
}

function modulTersaring() {
    const q = kataCari.trim().toLowerCase();
    return MODUL.filter(m => {
        const cocokKategori = kategoriAktif === "SEMUA" || m.kategori === kategoriAktif;
        if (!cocokKategori) return false;
        if (!q) return true;
        return (m.judul + " " + m.ringkas + " " + (m.tag || []).join(" "))
            .toLowerCase().includes(q);
    });
}

function renderPil() {
    const wadah = document.getElementById("pilKategori");
    wadah.innerHTML = daftarKategori().map(k => `
        <button class="pil ${k === kategoriAktif ? "aktif" : ""}"
                onclick="pilihKategori(${JSON.stringify(k).replace(/"/g, "&quot;")})">
            ${k === "SEMUA" ? "Semua" : k}
        </button>`).join("");
}

function pilihKategori(k) {
    kategoriAktif = k;
    render();
}

function renderDaftar() {
    const wadah = document.getElementById("daftarModul");
    const hasil = modulTersaring();

    if (hasil.length === 0) {
        wadah.innerHTML = `<div class="kosong">Tidak ada modul yang cocok.</div>`;
        return;
    }

    let html = "";
    let kategoriTerakhir = null;
    for (const m of hasil) {
        if (m.kategori !== kategoriTerakhir) {
            kategoriTerakhir = m.kategori;
            html += `<div class="grup-kategori">${m.kategori}</div>`;
        }
        const i = MODUL.indexOf(m);
        html += `
            <div class="item-modul ${i === indeksAktif ? "aktif" : ""} ${selesai.has(m.id) ? "selesai" : ""}"
                 onclick="bukaModul(${i})">
                <div class="item-nomor">${selesai.has(m.id) ? "✓" : String(m.id).padStart(2, "0")}</div>
                <div class="item-teks">
                    <div class="item-judul">${m.judul}</div>
                    <div class="item-meta">${m.tingkat} · ${m.durasi}</div>
                </div>
            </div>`;
    }
    wadah.innerHTML = html;
}

function renderProgres() {
    const total = MODUL.length;
    const jumlah = selesai.size;
    document.getElementById("isiProgres").style.width = (jumlah / total * 100) + "%";
    document.getElementById("teksProgres").textContent = `${jumlah} dari ${total} selesai`;
}

function renderKonten() {
    const m = MODUL[indeksAktif];
    const konten = document.getElementById("konten");

    const perintah = (m.perintah || []).length === 0 ? "" : `
        <div class="perintah-contoh">
            <div class="perintah-kepala">Perintah yang sering dipakai</div>
            <div class="perintah-isi">
                ${m.perintah.map(p => `<div class="perintah-baris">${lolos(p)}</div>`).join("")}
            </div>
        </div>`;

    const kuis = (m.kuis || []).length === 0 ? "" : `
        <section class="kuis">
            <h3>Uji Pemahaman</h3>
            <div class="kuis-sub">Pilih jawaban untuk melihat penjelasannya.</div>
            ${m.kuis.map((q, qi) => `
                <div class="pertanyaan" id="q-${qi}">
                    <div class="pertanyaan-teks">${qi + 1}. ${lolos(q.tanya)}</div>
                    ${q.opsi.map((o, oi) => `
                        <button class="opsi" data-q="${qi}" data-o="${oi}"
                                onclick="jawab(${qi}, ${oi})">${lolos(o)}</button>`).join("")}
                    <div class="penjelasan" id="pj-${qi}" style="display:none"></div>
                </div>`).join("")}
        </section>`;

    konten.innerHTML = `
        <header class="kepala-modul">
            <span class="label-kategori">${m.kategori}</span>
            <h1>${lolos(m.judul)}</h1>
            <p class="ringkas">${lolos(m.ringkas)}</p>
        </header>
        <article class="artikel">${m.isi}</article>
        ${perintah}
        ${kuis}
        <nav class="nav-modul">
            <button class="tombol-nav" onclick="pindah(-1)" ${indeksAktif === 0 ? "disabled" : ""}>← Sebelumnya</button>
            <button class="tombol-nav utama" onclick="tandaiSelesai()">
                ${selesai.has(m.id) ? "✓ Sudah ditandai selesai" : "Tandai selesai"}
            </button>
            <button class="tombol-nav" onclick="pindah(1)" ${indeksAktif === MODUL.length - 1 ? "disabled" : ""}>Berikutnya →</button>
        </nav>`;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function lolos(s) {
    return String(s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function jawab(qi, oi) {
    const m = MODUL[indeksAktif];
    const q = m.kuis[qi];
    const tombol = document.querySelectorAll(`.opsi[data-q="${qi}"]`);
    tombol.forEach((t, i) => {
        t.disabled = true;
        if (i === q.benar) t.classList.add("benar");
        else if (i === oi) t.classList.add("salah");
    });
    const pj = document.getElementById(`pj-${qi}`);
    pj.style.display = "block";
    pj.innerHTML = (oi === q.benar ? "<strong>Tepat.</strong> " : "<strong>Belum tepat.</strong> ") + lolos(q.penjelasan);
}

function bukaModul(i) {
    indeksAktif = i;
    render();
}

function pindah(delta) {
    const baru = indeksAktif + delta;
    if (baru >= 0 && baru < MODUL.length) bukaModul(baru);
}

function tandaiSelesai() {
    const id = MODUL[indeksAktif].id;
    if (selesai.has(id)) selesai.delete(id); else selesai.add(id);
    simpanProgres();
    render();
}

function render() {
    renderPil();
    renderDaftar();
    renderProgres();
    renderKonten();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("inputCari").addEventListener("input", e => {
        kataCari = e.target.value;
        renderDaftar();
    });
    document.addEventListener("keydown", e => {
        if (e.target.tagName === "INPUT") return;
        if (e.key === "ArrowLeft") pindah(-1);
        if (e.key === "ArrowRight") pindah(1);
    });
    const sub = document.getElementById("merekSub");
    if (sub) sub.textContent = `${MODUL.length} modul · ${TOPIK_SUB}`;
    render();
});
