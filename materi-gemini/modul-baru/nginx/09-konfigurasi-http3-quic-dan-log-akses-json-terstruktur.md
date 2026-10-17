# Konfigurasi HTTP/3 (QUIC) dan Log Akses JSON Terstruktur (`escape=json`) di Nginx Modern

- **Letak:** sesudah modul 8
- **Tingkat:** Lanjut
- **Ringkasan:** Mengaktifkan protokol HTTP/3 berbasis QUIC (UDP) berdampingan dengan HTTP/2 pada Nginx 1.25+, serta menyusun format log akses JSON terstruktur (`escape=json`) yang siap diserap oleh Grafana Loki atau Elasticsearch.

## Mengapa Mengaktifkan HTTP/3 (QUIC) dan Log JSON Terstruktur?

Pada jaringan seluler yang sering berpindah antara Wi-Fi dan 4G/5G atau memiliki kehilangan paket (*packet loss*), koneksi HTTP/2 yang berjalan di atas satu aliran TCP tunggal rentan mengalami **TCP Head-of-Line (HoL) Blocking**: satu paket TCP yang hilang menahan seluruh aliran aset halaman lainnya. **HTTP/3** (tersedia secara bawaan melalui modul `ngx_http_v3_module` sejak Nginx 1.25.0) berjalan di atas protokol **QUIC berbasis UDP**, mengintegrasikan jabat tangan TLS 1.3 dalam 1-RTT (atau 0-RTT), dan memisahkan setiap aliran aset sehingga kehilangan paket pada satu gambar tidak menghambat pemuatan skrip lainnya.

Di sisi observabilitas, memformat `access_log` langsung sebagai JSON dengan parameter `escape=json` menghilangkan kebutuhan ekspresi reguler (*regex parsing*) yang berat di agen pengumpul log.

## 1. Mengonfigurasi HTTP/3 (QUIC) dan Header Pengumuman `Alt-Svc`

Karena HTTP/3 menggunakan protokol **UDP** pada port `443` sedangkan HTTP/1.1 dan HTTP/2 menggunakan **TCP** pada port `443`, Anda perlu membuka kedua protokol tersebut pada direktif `listen` dan mengirimkan header `Alt-Svc` agar peramban mengetahui bahwa server mendukung HTTP/3:

```nginx
http {
    # 1. Format log akses JSON terstruktur yang aman dari karakter kutip/kontrol
    log_format json_produksi escape=json
        '{'
            '"time":"$time_iso8601",'
            '"remote_addr":"$remote_addr",'
            '"request_id":"$request_id",'
            '"protocol":"$server_protocol",'
            '"quic_v3":"$http3",'
            '"method":"$request_method",'
            '"uri":"$request_uri",'
            '"status":$status,'
            '"body_bytes_sent":$body_bytes_sent,'
            '"request_time":$request_time,'
            '"upstream_response_time":"$upstream_response_time",'
            '"user_agent":"$http_user_agent"'
        '}';

    access_log /var/log/nginx/access.json.log json_produksi;

    upstream backend_kodeloka {
        server 127.0.0.1:8080;
        keepalive 32;
    }

    server {
        # Port 443 UDP untuk QUIC (HTTP/3) dan 443 TCP untuk HTTPS (HTTP/2 & HTTP/1.1)
        listen 443 quic reuseport;
        listen 443 ssl;
        http2 on;

        server_name kodeloka.asadinedu.com;

        # HTTP/3 mewajibkan minimal TLSv1.3!
        ssl_protocols TLSv1.3;
        ssl_certificate     /etc/letsencrypt/live/kodeloka.asadinedu.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/kodeloka.asadinedu.com/privkey.pem;

        # Mengaktifkan validasi alamat sumber QUIC untuk mencegah amplifikasi UDP
        quic_retry on;

        # Beri tahu peramban bahwa HTTP/3 tersedia di port UDP 443 selama 24 jam
        add_header Alt-Svc 'h3=":443"; ma=86400' always;
        add_header X-Request-ID $request_id always;

        location / {
            proxy_pass http://backend_kodeloka;
            proxy_http_version 1.1;
            proxy_set_header Connection "";
            proxy_set_header Host $host;
            proxy_set_header X-Request-ID $request_id;
        }
    }
}
```

## 2. Poin Penting Operasional HTTP/3 di Produksi

| Pengaturan / Syarat | Penjelasan Teknis |
| :--- | :--- |
| **Aturan Firewall `UDP 443`** | Banyak administrator membuka port `443/tcp` tetapi lupa membuka `443/udp` pada `ufw`, `nftables`, atau AWS Security Group, sehingga peramban gagal beralih ke HTTP/3. |
| **Parameter `reuseport`** | Direktif `listen 443 quic reuseport;` hanya boleh ditulis **satu kali** per pasangan IP:port (pada blok `server` pertama/utama), tidak diulang di setiap *virtual host*. |
| **`escape=json` pada `log_format`** | Meng-escape tanda kutip ganda (`"`), garis miring terbalik (`\`), dan karakter kontrol di dalam `$request_uri` atau `$http_user_agent` agar baris JSON tidak pernah rusak. |

## Kuis Pemahaman

### Soal 1
Mengapa pengaktifan HTTP/3 di Nginx mewajibkan `ssl_protocols TLSv1.3;` dan pembukaan port `443/udp` di firewall?
- A. Karena spesifikasi QUIC menjalankan komunikasi terenkripsi di atas paket UDP dan mengintegrasikan jabat tangan TLS 1.3 secara langsung di lapisan transportnya.
- B. Karena TLS 1.3 hanya dapat berjalan di atas protokol UDP.
- C. Karena port `443/tcp` sudah tidak didukung lagi oleh peramban modern.
- D. Karena Nginx tidak bisa memproses sertifikat Let's Encrypt pada protokol TCP.

**Jawaban Benar:** A
**Penjelasan:** Protokol HTTP/3 berjalan di atas QUIC yang menggunakan datagram UDP dan mewajibkan TLS 1.3 sebagai bagian tak terpisahkan dari jabat tangan koneksinya.

### Soal 2
Apa fungsi header respons `add_header Alt-Svc 'h3=":443"; ma=86400' always;`?
- A. Memblokir klien yang masih menggunakan HTTP/1.1.
- B. Memberi tahu peramban yang terhubung pertama kali lewat TCP (HTTP/1.1 atau HTTP/2) bahwa server ini menyediakan layanan alternatif HTTP/3 (`h3`) pada port UDP 443.
- C. Mengalihkan seluruh permintaan HTTP ke server cadangan (*backup*).
- D. Mengenkripsi kuki sesi secara otomatis.

**Jawaban Benar:** B
**Penjelasan:** Melalui mekanisme *HTTP Alternative Services* (`Alt-Svc`), peramban mengetahui keberadaan endpoint HTTP/3 (`h3=":443"`) dan menyimpan informasi tersebut di cache selama `ma=86400` detik (24 jam) untuk koneksi berikutnya.

### Soal 3
Apa risiko menghilangkan parameter `escape=json` pada direktif `log_format json_produksi`?
- A. Nginx akan menolak menulis berkas log ke disk.
- B. Klien yang mengirimkan tanda kutip ganda (`"`) di dalam header `User-Agent` atau URL akan merusak struktur sintaks JSON pada baris log tersebut.
- C. Variabel `$request_time` akan selalu bernilai nol.
- D. Ukuran berkas log menjadi sepuluh kali lebih besar.

**Jawaban Benar:** B
**Penjelasan:** Parameter `escape=json` memastikan setiap karakter khusus JSON (seperti `"`, `\`, atau karakter baris baru) di dalam variabel Nginx di-*escape* sesuai standar RFC 8259 sebelum ditulis ke berkas log.

## Sumber
- [Nginx Documentation — Module `ngx_http_v3_module` (HTTP/3 & QUIC)](https://nginx.org/en/docs/http/ngx_http_v3_module.html)
- [Nginx Documentation — Module `ngx_http_log_module` (`log_format escape=json`)](https://nginx.org/en/docs/http/ngx_http_log_module.html)
