# Log koreksi: pembaruan-19-kelas (2026-10-16)

Format: `berkas | yang salah | yang diubah | URL sumber`. Berkas asli dicadangkan di
`/tmp/claude-1000/-home-asadin-Projects/18c2061d-a16e-43b3-9ad0-061d35f8d9de/scratchpad/backup/`.

## A. Kesalahan teknis dan faktual

01-golang | Judul H1 memuat "Goverse/PGO" (istilah karangan, PGO tidak dibahas modul mana pun) | diganti `testing/synctest` | https://go.dev/doc/go1.25
01-golang | Judul modul 270 "(Go 1.24+)" menyatukan tiga fitur dengan versi berbeda; `testing/synctest` baru stabil di Go 1.25 (di 1.24 hanya GOEXPERIMENT) | "(`log/slog` sejak Go 1.21, `unique` sejak Go 1.23, `testing/synctest` stabil sejak Go 1.25)" | https://go.dev/doc/go1.25
05-postgresql | `uuidv7()` ditulis tanpa versi; fungsi ini baru ada di PostgreSQL 18 | judul modul 14 diberi "PostgreSQL 18+" | https://www.postgresql.org/docs/current/functions-uuid.html
06-redis | "kompatibilitas penuh Redis dan Valkey" berlebihan (Valkey fork Redis OSS 7.2.4) | kalimat diganti (di ringkasan dan isi) | https://valkey.io/
07-kafka | `kafka-storage.sh random-uuid` disebut sebagai perintah "memformat penyimpanan"; perintah itu hanya membuat ID klaster, formatnya `kafka-storage.sh format` | kalimat diperbaiki (ringkasan dan isi) | https://kafka.apache.org/40/getting-started/upgrade/ (hasil pencarian; host tidak bisa diakses dari sandbox)
12-kong | decK dikatakan dipakai untuk mode DB-less; decK tidak bisa sync/dump pada node DB-less (butuh Admin API tulis) | judul dan ringkasan modul 13 diperbaiki: DB-less pakai `declarative_config` atau `POST /config`, `deck gateway sync` untuk Kong berbasis database/hybrid/Konnect | https://docs.jp.konghq.com/deck/reference/faq/ dan https://developer.konghq.com/deck/
12-kong | "plugin AI bawaan Kong 3.6+" menyiratkan ketiganya OSS 3.6; `ai-rate-limiting-advanced` khusus Enterprise, min. 3.7 | ringkasan modul 14 diperbaiki | https://developer.konghq.com/plugins/ai-rate-limiting-advanced/
13-git-ci-cd | "Git Attestations" (fitur itu milik GitHub, bernama Artifact Attestations) | judul H1 diperbaiki | https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations
16-opentelemetry | "agar Collector tidak pernah mengalami Out of Memory" (memory_limiter hanya mengurangi risiko) | diperlunak (ringkasan dan isi) | https://github.com/open-telemetry/opentelemetry-collector/blob/main/processor/memorylimiterprocessor/README.md
16-opentelemetry | "hingga 90% tanpa kehilangan satu pun jejak insiden" (angka tak berdasar; tail sampling terbatas `decision_wait` dan span satu trace harus tiba di Collector yang sama) | diperbaiki (ringkasan dan isi) | https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/tailsamplingprocessor
17-prometheus | Native Histograms digambarkan otomatis; di 3.0 masih eksperimental dan butuh `--enable-feature=native-histograms`, stabil sejak v3.8 dengan `scrape_native_histograms: true` | ringkasan dan isi modul 16 ditambah penjelasan versi | https://prometheus.io/blog/2024/11/14/prometheus-3-0/ ; https://prometheus.io/docs/specs/native_histograms/
19-k6 | Judul menyebut `k6/experimental/websockets`, modul ini sudah deprecated; gantinya `k6/websockets` | judul H1 diganti | https://grafana.com/docs/k6/latest/javascript-api/k6-experimental/websockets/
10-docker | `golang:1.23-alpine` sudah di luar dukungan (Go terbaru 1.27) | diganti `golang:1.27-alpine` (tag diverifikasi ada di Docker Hub) | https://go.dev/dl/ ; https://hub.docker.com/v2/repositories/library/golang/tags/1.27-alpine

## B. Contoh kode dan konfigurasi yang tidak berfungsi seperti dijelaskan

01-golang | Contoh modul 268 tanpa `func main` (tidak bisa dibangun) dan memakai `%q` untuk JSON (escape Go, bukan JSON) | impor `encoding/json` dan `log`, respons lewat `json.NewEncoder`, ditambah `main` | https://go.dev/blog/routing-enhancements
02-fastapi | `x_tenant_id: str = "publik"` menjadi query parameter, bukan header | `Annotated[str, Header()]` dan impor `Header`; komentar bahwa tenant produksi harus dari token | https://fastapi.tiangolo.com/advanced/events/
04-microservices | `ON CONFLICT (message_id, consumer_group)` butuh unique constraint yang tidak didefinisikan | ditambah `CREATE TABLE processed_messages ... PRIMARY KEY (message_id, consumer_group)` dan catatan satu transaksi | https://microservices.io/patterns/data/transactional-outbox.html
07-kafka | Tidak ada langkah format penyimpanan; mode gabungan broker+controller disajikan seolah praktik produksi | komentar `kafka-storage.sh format`, dan komentar bahwa mode gabungan untuk pengembangan/klaster kecil | https://docs.confluent.io/platform/7.9/kafka-metadata/config-kraft.html (lihat bagian Perlu dicek)
09-nginx | `proxy_pass http://backend_app;` dan `http://backend_katalog;` tanpa blok `upstream` (nginx gagal memuat) | ditambah dua blok `upstream` | https://nginx.org/en/docs/http/ngx_http_proxy_module.html
09-nginx | `log_format json_analitik` didefinisikan tetapi tidak dipakai | ditambah `access_log ... json_analitik;` | https://nginx.org/en/docs/http/ngx_http_log_module.html
10-docker | Layanan `postgres` di Compose tanpa `POSTGRES_PASSWORD` (kontainer langsung berhenti) | ditambah `POSTGRES_PASSWORD: ${DB_PASSWORD:?...}` | https://docs.docker.com/reference/compose-file/services/
12-kong | `Lower(...)` pada ekspresi router; fungsi yang benar `lower(...)`. Ekspresi juga butuh `router_flavor = expressions` | diperbaiki, ditambah komentar | https://developer.konghq.com/gateway/routing/expressions/
14-linux | Drop-in `99-hardening.conf` kalah oleh berkas yang dibaca lebih dulu (sshd memakai nilai pertama, mis. `50-cloud-init.conf`) | diganti `00-hardening.conf` dengan komentar, ditambah saran `sshd -t` dan sesi cadangan | https://man.openbsd.org/sshd_config
14-linux | `ProtectSystem=strict` tanpa catatan bahwa seluruh filesystem jadi read-only | ditambah komentar `StateDirectory=` / `ReadWritePaths=` | https://man7.org/linux/man-pages/man5/systemd.exec.5.html
16-opentelemetry | Pipeline merujuk `exporters: [otlp]` yang tidak didefinisikan (Collector menolak konfigurasi) | ditambah blok `exporters: otlp` (TLS insecure diberi komentar hanya untuk uji) | https://opentelemetry.io/docs/collector/configuration/
16-opentelemetry | Contoh `tail_sampling` tanpa konteks pemasangan | komentar: ada di distribusi contrib, setelah `memory_limiter` sebelum `batch`, satu Collector per trace | https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/processor/tailsamplingprocessor
17-prometheus | Contoh OTLP tanpa flag penyalaan penerima | ditambah `prometheus --web.enable-otlp-receiver` dan contoh exporter `otlphttp` | https://prometheus.io/docs/guides/opentelemetry/
18-grafana | Komentar LogQL bilang "durasi > 500ms" padahal kueri juga `status >= 500`; komentar TraceQL bilang database yang berstatus error padahal `status = error` ada di span induk | komentar diperbaiki | https://grafana.com/docs/tempo/latest/traceql/

## C. Kuis (semua 19 berkas)

Semua 57 soal diperiksa: tiap soal tepat satu opsi benar dan jawaban/penjelasan konsisten. Kuis berupa soal meta yang sama di setiap berkas (tujuan paket, prinsip produksi, cara integrasi), bukan kuis per modul teknis.
semua berkas | Soal 1: "(0 modul)" dan penjelasan "melengkapi 0 modul ... `X/data/modules.json`" salah | diganti jumlah modul sebenarnya dan `X/app.js` | scripts/courses.json, `X/app.js`
semua berkas | Soal 3: opsi B menyebut `X/data/modules.json` dan field `judul/tingkat/ringkas/isi/kuis` (folder `X/data/` tidak ada; `data/modules.json` hanya hasil `npm run extract`; nama field berbeda per mesin kelas) | opsi B dan penjelasan ditulis ulang: modul masuk ke larik di `X/app.js`, update `scripts/courses.json`, jalankan `npm run extract`. Tetap satu jawaban benar (B) | README.md repo bagian "Struktur"
09, 14, 15, 16 | "ketiga modul" padahal ada empat modul | menjadi "keempat" di Latihan dan Soal 3 | -

## D. Saran keamanan yang menyesatkan atau tidak aman

semua berkas (61 modul) | Kalimat penutup "penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati, dan siap..." (jaminan palsu) | diganti "membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata" | -
09-nginx | Judul modul 10 "Perlindungan DDoS" untuk limit per IP | "Mitigasi Brute-Force & Lonjakan Permintaan per IP (bukan pengganti perlindungan DDoS tingkat jaringan)" | https://nginx.org/en/docs/http/ngx_http_limit_req_module.html
15-keamanan | Langkah SSRF "resolusi DNS lalu tolak IP privat" rentan DNS rebinding bila nama host diresolusi ulang | sambungkan ke IP hasil resolusi yang sama | https://owasp.org/www-community/attacks/Server_Side_Request_Forgery
02-fastapi | Tenant dari header klien tanpa peringatan | komentar bahwa produksi harus memakai token terautentikasi | -
14-linux | Hardening SSH bisa mengunci akses | saran `sshd -t` dan sesi SSH cadangan | https://man.openbsd.org/sshd_config
16-opentelemetry | `tls.insecure: true` tanpa peringatan | komentar hanya untuk jaringan uji | -

## E. Klaim audit atas kelas yang sudah ada (semua 19 berkas)

semua berkas | "kelas X memiliki 0 modul" dan "menjadi 3 modul" salah; tabel audit kosong | jumlah modul dari `app.js` (golang 267, fastapi 24, next 23, microservices 24, postgresql 12, redis 21, kafka 13, rabbitmq 15, nginx 8, docker 21, kubernetes 14, kong 12, git-ci-cd 20, linux 8, keamanan 8, opentelemetry 8, prometheus 15, grafana 15, k6 15), tabel diisi daftar modul nyata (golang diringkas per domain) | `X/app.js`, scripts/courses.json
semua berkas | "belum tercakup di modul lama" salah untuk banyak topik | diganti catatan per kelas: topik yang sudah ada (dengan nomor modul) dan yang benar-benar belum ada. Hampir seluruh isi sudah ada di kelas untuk golang (kecuali paket `unique`), redis, kafka, rabbitmq, prometheus, k6; celah nyata: fastapi (ConfigDict, validator, ASGITransport), next (`instrumentation.ts`), microservices (skema outbox_events, Idempotency-Key, Inbox), postgresql (pgvector), nginx (HTTP/3, escape=json), docker (kunci Compose), kubernetes (native sidecar), kong (AI plugin, ekspresi router), git-ci-cd (OIDC, attestations, SBOM, SLSA, SSH signing), linux (sysctl, fail2ban, LVM), keamanan (race condition, mass assignment, path traversal, deserialisasi), opentelemetry (resourcedetection, http.route, exemplar), grafana (TraceQL) | pencarian `app.js` tiap kelas
semua berkas | `X/data/modules.json` disebut sebagai tempat data kelas (tidak ada) | diganti `X/app.js` beserta nama larik: golang/docker `chapters`; fastapi/next/kong `modulesData`; microservices/git-ci-cd `MODULES_DATA`; redis `REDIS_MODULES`; postgresql/kafka/nginx/kubernetes/linux/keamanan/opentelemetry `MODUL`; rabbitmq `RMQ_MOD_C`; prometheus `PROM_MOD_C`; grafana `GRAF_MOD_C`; k6 `K6_MOD_C` (bagian terakhir, digabung lewat `[].concat(A, B, C)`) | `X/app.js`
09, 14, 15, 16 | Ringkasan menyebut "3 modul" untuk nginx, linux, keamanan, opentelemetry, padahal ada 4 | diperbaiki | -

## F. Format

semua berkas | Pagar kode tanpa tag bahasa | ditambah tag (go, python, tsx, sql, lua, bash, properties, json, nginx, dockerfile, yaml, ini, javascript, text) pada 61 pagar | -
Tidak ada kalimat Inggris yang tertinggal di prosa (hanya istilah teknis).

## URL yang diganti atau ditambah

Semua 20 URL asli di bagian Sumber dan isi diperiksa dengan curl. Satu diganti, satu tidak dapat diperiksa.
12-kong | https://docs.konghq.com/ (redirect ke developer.konghq.com) | diganti https://developer.konghq.com/gateway/ | -
15-keamanan | https://owasp.org/www-project-top-ten/ (redirect 200, ke owasp.org/projects/top-ten) | dipertahankan; ditambah OWASP API Security Top 10 2023 karena modul membahas API Top 10 | https://owasp.org/API-Security/editions/2023/en/0x00-header/
Tautan Sumber resmi ditambahkan (semua 200 OK): 57 tautan di 18 berkas (kecuali 07-kafka), mis. go.dev/blog/routing-enhancements, fastapi.tiangolo.com/advanced/events/, nextjs.org/docs/app/guides/upgrading/version-15, postgresql.org/docs/current/ddl-rowsecurity.html, redis.io/docs/latest/commands/xautoclaim/, rabbitmq.com/docs/quorum-queues, nginx.org/en/docs/http/ngx_http_v3_module.html, docs.docker.com/build/cache/optimize/, kubernetes.io/docs/concepts/services-networking/gateway/, developer.konghq.com/deck/, docs.github.com/en/actions/concepts/security/openid-connect, man.openbsd.org/sshd_config, opentelemetry.io/docs/collector/configuration/, prometheus.io/docs/guides/opentelemetry/, grafana.com/docs/tempo/latest/traceql/, grafana.com/docs/k6/latest/using-k6-browser/.
Tidak ada blog, media sosial, W3Schools, atau GeeksforGeeks di berkas asli.
http://test, http://backend_app, dll. di berkas adalah nama host contoh dalam kode, bukan sumber.

## Perlu dicek (tersisa)

07-kafka | https://kafka.apache.org/documentation/ tidak dapat dijangkau dari sandbox (timeout, juga kafka.apache.org/ dan www.apache.org). Hasil pencarian menunjukkan halaman kafka.apache.org/40/... dan documentation.html ada, jadi URL dipertahankan; cek ulang dari jaringan lain.
07-kafka | Saran "mode gabungan untuk pengembangan, pisahkan di produksi kritis" bersumber dari dokumen Kafka 3.3 dan Confluent lewat hasil pencarian; belum dibaca langsung di dokumentasi Kafka 4.x.
08-rabbitmq | Ditambahkan `> Perlu dicek` di berkas: angka prefetch 1-5 dan 20-100 adalah aturan praktis, dokumentasi menyebut 100-300 | https://www.rabbitmq.com/docs/confirms
01-golang | Modul 270 membahas `unique` dan `synctest` di judul/ringkasan tetapi contoh kodenya hanya `slog`; contoh untuk keduanya belum ada (tidak ditambahkan karena di luar koreksi).
Umum | Judul masih menyebut versi lama (Go 1.22-1.26 padahal 1.27 sudah rilis, Next.js 15 padahal kelas memakai 16, K8s 1.30-1.32, Kong 3.7-3.9, Grafana 11). Tidak salah, tapi sudah bukan yang terbaru.
Umum | Beberapa judul modul menyebut topik tanpa isi (mis. RabbitMQ 18 "Publisher Confirms", Linux 09 "CPUQuota", Nginx 09 "OCSP", Kubernetes 16 "NetworkPolicy"). Tidak ada yang salah, tetapi isi lebih sempit dari judul.

## Struktur modul per berkas (untuk integrator)

Konvensi seragam di semua 19 berkas:
- Bagian audit `## 1. Audit Modul Saat Ini di Repositori (...)` ada sebelum modul pertama. Ini bukan modul, jangan diimpor.
- Setiap modul dibuka heading level 2: `## Modul Pembaruan N: <judul>` (02, 03, 04, 05, 06, 07, 08, 10, 11, 12, 13, 17, 18, 19) atau `## Modul Baru N: <judul>` (01, 09, 14, 15, 16). N melanjutkan jumlah modul yang sudah ada.
- Urutan isi modul: `- **Tingkat:**`, `- **Ringkasan:**`, `### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)` (satu paragraf yang mengulang ringkasan, ditambah kalimat penutup umum), tepat satu pagar kode, lalu blockquote `> **💡 Catatan Integrasi Kodeloka:** ...` yang menjadi penanda akhir modul. Modul berikutnya dimulai di `## Modul` berikutnya.
- Setelah modul terakhir: `## Latihan Praktik Mandiri`, `## Kuis Pemahaman` (`### Soal 1` sampai `### Soal 3`, meta dan identik antar berkas; bukan kuis per modul), `## Sumber`. Latihan, kuis, dan Sumber bukan modul.
- Belum ada kuis per modul, jadi integrator perlu menulis kuis modul sendiri bila mesin kelasnya mewajibkan.
- Jumlah total modul 61, bukan 60 seperti di `materi-gemini/README.md` (nginx, linux, keamanan, opentelemetry masing-masing 4).

| Berkas | Modul | Nomor | Kelas ada | Larik tujuan |
| :--- | :--- | :--- | :--- | :--- |
| 01-golang | 3 (Modul Baru) | 268-270 | 267 | `chapters` |
| 02-fastapi | 3 | 25-27 | 24 | `modulesData` |
| 03-next | 3 | 24-26 | 23 | `modulesData` |
| 04-microservices | 3 | 25-27 | 24 | `MODULES_DATA` |
| 05-postgresql | 3 | 13-15 | 12 | `MODUL` |
| 06-redis | 3 | 22-24 | 21 | `REDIS_MODULES` |
| 07-kafka | 3 | 14-16 | 13 | `MODUL` |
| 08-rabbitmq | 3 | 16-18 | 15 | `RMQ_MOD_C` |
| 09-nginx | 4 (Modul Baru) | 09-12 | 8 | `MODUL` |
| 10-docker | 3 | 22-24 | 21 | `chapters` |
| 11-kubernetes | 3 | 15-17 | 14 | `MODUL` |
| 12-kong | 3 | 13-15 | 12 | `modulesData` |
| 13-git-ci-cd | 3 | 21-23 | 20 | `MODULES_DATA` |
| 14-linux | 4 (Modul Baru) | 09-12 | 8 | `MODUL` |
| 15-keamanan | 4 (Modul Baru) | 09-12 | 8 | `MODUL` |
| 16-opentelemetry | 4 (Modul Baru) | 09-12 | 8 | `MODUL` |
| 17-prometheus | 3 | 16-18 | 15 | `PROM_MOD_C` |
| 18-grafana | 3 | 16-18 | 15 | `GRAF_MOD_C` |
| 19-k6 | 3 | 16-18 | 15 | `K6_MOD_C` |

Catatan overlap: modul baru di golang, redis, kafka, rabbitmq, prometheus, k6, docker, kubernetes sebagian besar mengulang materi yang sudah ada (lihat Temuan Audit di tiap berkas); integrator dapat memilih hanya memakai bagian yang benar-benar baru.
