# Menyajikan Aplikasi PHP di Produksi dengan Nginx, PHP-FPM, dan OPcache

- **Tingkat:** Lanjut
- **Ringkasan:** Merancang arsitektur server produksi menggunakan Nginx + PHP-FPM melalui soket FastCGI, menghitung kapasitas *worker pool* (`pm.max_children`), mengoptimalkan kinerja dengan OPcache dan JIT, serta mengamankan konfigurasi `php.ini` produksi.

## 1. Arsitektur Produksi: Mengapa Nginx Dipasangkan dengan PHP-FPM?

Di komputer lokal, kita bisa menjalankan `php -S 127.0.0.1:8000 -t public`. Namun, server bawaan CLI tersebut bersifat *single-process* (hanya memproses satu permintaan pada satu waktu) dan tidak dirancang untuk menghadapi ribuan koneksi internet publik.

Di lingkungan produksi, standar emas industri adalah memasangkan **Nginx** di baris depan dengan **PHP-FPM (*FastCGI Process Manager*)** di belakangnya:

```
                   Internet Publik (HTTPS :443)
                                │
                                ▼
+---------------------------------------------------------------+
| NGINX (Reverse Proxy & Server Aset Statis)                    |
|  ├─ Jika permintaan adalah /assets/style.css atau logo.webp:  |
|  │    └─> Langsung disajikan oleh Nginx dengan sangat cepat!  |
|  │                                                            |
|  └─ Jika permintaan adalah rute aplikasi -> /public/index.php:|
|       └─> Diteruskan lewat protokol FastCGI (Unix Socket)     |
+-------------------------------┬-------------------------------+
                                │  /run/php/php8.5-fpm.sock
                                ▼
+---------------------------------------------------------------+
| PHP-FPM Master Process                                        |
|  ├── [Memori Bersama OPcache: Menyimpan Bytecode Terkompilasi]|
|  ├── Worker PHP #1 ──> Menjalankan index.php untuk Pengguna A |
|  ├── Worker PHP #2 ──> Menjalankan index.php untuk Pengguna B |
|  └── Worker PHP #N ──> Siaga menerima permintaan berikutnya   |
+---------------------------------------------------------------+
```

## 2. Konfigurasi Nginx yang Aman untuk Front Controller PHP-FPM

Berikut adalah konfigurasi blok `server` Nginx produksi yang mengarahkan semua rute ke `public/index.php` sekaligus menutup celah eksekusi berkas `.php` liar:

```nginx
server {
    listen 80;
    server_name kodeloka-app.example.com;

    # 1. Hanya arahkan root ke sub-direktori 'public/'!
    root /var/www/kodeloka-app/public;
    index index.php;

    # Sembunyikan versi Nginx di header respons
    server_tokens off;

    # 2. Blokir akses ke seluruh berkas tersembunyi (seperti .git atau .env jika salah taruh)
    location ~ /\.(?!well-known).* {
        deny all;
    }

    # 3. Semua rute aplikasi diarahkan ke Front Controller index.php
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # 4. Hanya izinkan eksekusi tepat pada /index.php (paling aman untuk arsitektur Front Controller!)
    location = /index.php {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        fastcgi_pass unix:/run/php/php8.5-fpm.sock;
        fastcgi_read_timeout 30s;
    }

    # 5. Tolak permintaan langsung ke berkas .php lainnya di dalam public/
    location ~ \.php$ {
        return 404;
    }
}
```

> **💡 Keunggulan Keamanan `location = /index.php`:**
> Banyak konfigurasi Nginx lama menggunakan `location ~ \.php$` yang mengizinkan eksekusi berkas `.php` mana saja di seluruh folder publik. Pada aplikasi modern yang menggunakan satu pintu masuk (`public/index.php`), membatasi FastCGI hanya pada **`location = /index.php`** dan mengembalikan `404` untuk `location ~ \.php$` lainnya menjamin bahwa seandainya ada berkas `.php` asing yang nyasar ke folder publik, berkas tersebut **tidak akan pernah dieksekusi oleh PHP-FPM**!

## 3. Menyetel Worker Pool PHP-FPM (`www.conf`)

Di dalam berkas konfigurasi pool PHP-FPM (biasanya `/etc/php/8.5/fpm/pool.d/www.conf`), pengaturan paling penting adalah memilih mode **Process Manager (`pm`)** dan menghitung jumlah maksimal proses pekerja (**`pm.max_children`**):

### Tiga Mode `pm` di PHP-FPM
1. **`pm = dynamic` (Bawaan Umum):** Menjaga sejumlah worker minimum tetap hidup (`pm.min_spare_servers`), dan menambah worker baru saat trafik ramai hingga batas `pm.max_children`.
2. **`pm = static` (Performa Tertinggi untuk Server Khusus):** Langsung menyalakan sejumlah `pm.max_children` worker secara tetap sejak awal, sehingga tidak ada jeda waktu pembuatan proses baru (*forking overhead*) saat terjadi lonjakan trafik mendadak!
3. **`pm = ondemand`:** Tidak ada worker yang hidup saat sepi; worker baru dibuat saat ada permintaan masuk. Cocok untuk lingkungan hemat memori atau *staging*.

### Rumus Menghitung `pm.max_children` Agar Server Tidak Kehabisan RAM (*OOM Kill*)
Jangan pernah menebak angka `pm.max_children = 500` tanpa menghitung RAM!
Gunakan rumus sederhana ini:

```
                       RAM yang Tersedia untuk PHP-FPM
pm.max_children = ─────────────────────────────────────────
                   Rata-rata Memori 1 Proses Worker PHP-FPM
```

Contoh perhitungan nyata:
- Server VPS memiliki **4 GB RAM (`4096 MB`)**.
- Sistem operasi Linux, Nginx, dan agen monitoring memakai sekitar `800 MB`, sehingga tersisa **`3200 MB`** untuk PHP-FPM.
- Setiap 1 proses worker PHP aplikasi Anda rata-rata memakai **`40 MB`**.
- Maka nilai aman `pm.max_children` adalah: `3200 MB / 40 MB = 80` (kita pasang **`pm.max_children = 70`** untuk memberi ruang aman 15%!).

```ini
; Contoh konfigurasi /etc/php/8.5/fpm/pool.d/www.conf untuk produksi
[www]
user = www-data
group = www-data
listen = /run/php/php8.5-fpm.sock

pm = dynamic
pm.max_children = 70
pm.start_servers = 15
pm.min_spare_servers = 10
pm.max_spare_servers = 25

; Daur ulang worker setelah melayani 1000 request untuk mencegah akumulasi kebocoran memori
pm.max_requests = 1000

; Aktifkan endpoint status kesehatan untuk dipantau oleh Prometheus / Exporter
pm.status_path = /status-fpm
```

## 4. Optimasi OPcache dan Pengaturan Keamanan `php.ini` Produksi

Di server produksi, pastikan pengaturan berikut diterapkan di `php.ini`:

```ini
; === 1. KEAMANAN & PENANGANAN GALAT PRODUKSI ===
; WAJIB Off di produksi agar pesan galat teknis dan jalur berkas tidak bocor ke layar pengguna!
display_errors = Off
display_startup_errors = Off

; Catat seluruh galat ke berkas log server / stderr kontainer
log_errors = On
error_reporting = E_ALL

; Sembunyikan header HTTP "X-Powered-By: PHP/8.5.x"
expose_php = Off

; === 2. OPTIMASI OPCACHE PRODUKSI ===
opcache.enable = 1
opcache.memory_consumption = 256
opcache.interned_strings_buffer = 16
opcache.max_accelerated_files = 20000

; Jika proses deploy Anda mengganti symlink rilis dan memuat ulang PHP-FPM (reload),
; mengatur validate_timestamps = 0 membuat PHP tidak perlu memeriksa waktu modifikasi berkas
; di diska pada setiap request! (Ingat: wajib jalankan 'systemctl reload php8.5-fpm' setiap kali deploy!)
opcache.validate_timestamps = 0
```

*(Catatan: Sejak **PHP 8.5**, Fatal Errors seperti terlampauinya batas waktu `max_execution_time` kini juga menyertakan jejak tumpukan pemanggilan / **backtrace** lengkap di dalam log server, sehingga diagnosis bottleneck di produksi menjadi jauh lebih mudah!)*

## Latihan Praktik: Menghitung Kapasitas Worker dan Menyusun Konfigurasi Produksi

Buatlah berkas dokumentasi/konfigurasi latihan `produksi-fpm.ini` dan `nginx-kodeloka.conf` untuk skenario berikut:
1. Sebuah server produksi memiliki total RAM `8 GB`, di mana PostgreSQL berada di server terpisah dan sistem operasi + Nginx membutuhkan `1 GB` RAM.
2. Rata-rata satu worker PHP-FPM memakan `35 MB` RAM. Hitung nilai `pm.max_children` dengan cadangan keamanan 20%, lalu tuliskan konfigurasi pool PHP-FPM serta pengaturan `php.ini` produksinya!

## Kuis Pemahaman

### Soal 1
Mengapa pengaturan `display_errors = Off` dan `log_errors = On` **wajib** diterapkan pada berkas `php.ini` di server produksi?
- A. Agar PHP mengabaikan semua kesalahan sintaks dan tetap melanjutkan eksekusi.
- B. Agar ketika terjadi galat tak terduga, rincian internal yang sensitif (seperti struktur tabel SQL, jalur direktori server, atau argumen fungsi) tidak tercetak ke layar pengunjung, melainkan dicatat secara privat di dalam log server untuk diperiksa oleh tim pengembang.
- C. Karena `display_errors = On` mematikan ekstensi OPcache.
- D. Agar ukuran berkas HTML menjadi lebih kecil.

**Jawaban Benar:** B
**Penjelasan:** Menampilkan pesan galat mentah (`display_errors = On`) di produksi adalah celah *Information Disclosure* yang membantu penyerang memetakan struktur internal server dan basis data Anda. Di produksi, tampilkan halaman maaf yang ramah kepada pengguna sementara rincian teknisnya dikirim ke log internal (`log_errors = On`).

### Soal 2
Apa risiko yang terjadi apabila Anda menetapkan nilai `pm.max_children` pada PHP-FPM terlalu tinggi hingga total kebutuhan memori seluruh worker melebihi kapasitas RAM fisik server?
- A. PHP-FPM otomatis memindahkan kelebihannya ke kartu grafis (GPU).
- B. Saat trafik melonjak, server akan kehabisan RAM (*swapping* parah hingga memicu *Linux OOM Killer* yang mematikan paksa proses PHP-FPM atau layanan penting lainnya), menyebabkan situs mengalami *downtime* (`502 Bad Gateway`).
- C. Ukuran berkas `.php` di diska akan bertambah besar.
- D. Nginx otomatis mengubah halaman menjadi gambar statis.

**Jawaban Benar:** B
**Penjelasan:** Setiap proses anak PHP-FPM mengalokasikan memori RAM sendiri. Jika `pm.max_children × rata-rata memori per worker` melampaui RAM yang tersedia, lonjakan trafik akan menghabiskan memori server dan memicu kegagalan sistem secara menyeluruh.

### Soal 3
Apa konsekuensi dari mengaktifkan optimasi `opcache.validate_timestamps = 0` di server produksi?
- A. OPcache tidak akan pernah memeriksa lagi apakah berkas `.php` di diska telah berubah (menghasilkan performa tertinggi karena bebas pengecekan I/O diska), namun Anda **wajib** memuat ulang layanan PHP-FPM (`reload`) atau mereset OPcache setiap kali men-deploy kode baru agar perubahan kode terbaca.
- B. Semua fungsi tanggal dan waktu seperti `date()` dan `time()` akan dinonaktifkan.
- C. Sesi pengguna akan langsung berakhir dalam 0 detik.
- D. Berkas log server tidak akan mencatat jam kejadian.

**Jawaban Benar:** A
**Penjelasan:** Dengan `opcache.validate_timestamps = 0`, PHP langsung mengeksekusi bytecode dari RAM tanpa melakukan panggilan sistem `stat()` ke diska untuk memeriksa waktu modifikasi berkas `.php`. Konsekuensinya, setiap kali rilis baru di-deploy, pipeline CI/CD harus memanggil `reload` pada PHP-FPM agar bytecode di OPcache diperbarui.

## Sumber
- [FastCGI Process Manager (FPM) Installation — PHP Manual](https://www.php.net/manual/en/install.fpm.php)
- [FPM Configuration — PHP Manual](https://www.php.net/manual/en/install.fpm.configuration.php)
- [OPcache — PHP Manual](https://www.php.net/manual/en/book.opcache.php)
