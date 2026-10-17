# *Native Sidecar Containers* (`restartPolicy: Always`) dan Koordinasi Siklus Hidup Pod di Kubernetes Modern

- **Letak:** sesudah modul 14
- **Tingkat:** Lanjut
- **Ringkasan:** Menjalankan agen pendamping (pengumpul log, proksi service mesh, atau Cloud SQL Proxy) menggunakan fitur standar *Native Sidecar Containers* (`initContainers` dengan `restartPolicy: Always`, stabil sejak Kubernetes 1.29+).

## Mengapa *Sidecar* Klasik di `spec.containers` Sering Bermasalah?

Sebelum Kubernetes 1.29, kontainer pendamping (*sidecar* seperti agen OpenTelemetry, Fluent Bit, atau proksi jaringan) didefinisikan sejajar dengan kontainer aplikasi utama di dalam `spec.containers`. Pendekatan lama ini menimbulkan tiga masalah operasional klasik:

1. **Balapan Waktu Mulai (*Startup Race*):** Kontainer aplikasi utama sering mulai mencoba menghubungi database melalui proksi *sidecar* padahal *sidecar* tersebut belum selesai melakukan inisialisasi.
2. **`Job` Tidak Pernah Selesai (*Job Hanging*):** Pada objek `Job` (tugas *batch*), kontainer utama selesai dalam 30 detik (`Completed`), tetapi kontainer *sidecar* di `spec.containers` tetap hidup selamanya sehingga `Job` tidak pernah berstatus selesai.
3. **Pemutusan Dini Saat *Shutdown*:** Saat pod dihentikan (`SIGTERM`), Kubernetes mematikan semua kontainer di `spec.containers` secara bersamaan, sehingga *sidecar* log/proksi sering mati lebih dulu sebelum aplikasi utama selesai mengirim sisa permintaan terakhirnya.

## 1. Solusi Standar: *Native Sidecar Containers* di `initContainers`

Sejak Kubernetes 1.29 (GA/stabil), Anda dapat mendeklarasikan kontainer di dalam **`spec.initContainers`** dengan menambahkan field **`restartPolicy: Always`**. Kubernetes memperlakukan kontainer tersebut sebagai **Native Sidecar** dengan jaminan urutan siklus hidup yang tegas:

- **Urutan Mulai:** Dijalankan berurutan di fase inisialisasi. Begitu **`startupProbe`** milik *sidecar* dinyatakan lulus, Kubernetes langsung memulai kontainer berikutnya (dan akhirnya `spec.containers` utama) **sementara *sidecar* tetap berjalan di latar belakang**!
- **Perilaku pada `Job`:** Ketika seluruh kontainer utama di `spec.containers` selesai (`Succeeded`), Kubernetes secara otomatis menghentikan *Native Sidecar* sehingga `Job` selesai dengan bersih.
- **Urutan Berhenti (*Shutdown*):** Saat pod dihapus, Kubernetes menghentikan kontainer aplikasi utama di `spec.containers` **terlebih dahulu**, dan baru mematikan *Native Sidecar* paling akhir!

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pembayaran-dengan-sidecar
spec:
  initContainers:
    # Native Sidecar: berjalan lebih dulu, tetap hidup selama pod aktif,
    # dan dimatikan paling akhir setelah kontainer aplikasi selesai!
    - name: otel-agent
      image: otel/opentelemetry-collector:0.114.0
      restartPolicy: Always
      ports:
        - containerPort: 4317
      startupProbe:
        httpGet:
          path: /
          port: 13133
        periodSeconds: 2
        failureThreshold: 10
      resources:
        requests:
          cpu: 50m
          memory: 64Mi
        limits:
          cpu: 200m
          memory: 128Mi

  containers:
    # Kontainer aplikasi utama baru dimulai SETELAH startupProbe otel-agent lulus!
    - name: payment-api
      image: registry.example.com/payment-api:2.1.0
      env:
        - name: OTEL_EXPORTER_OTLP_ENDPOINT
          value: "http://127.0.0.1:4317"
      resources:
        requests:
          cpu: 250m
          memory: 256Mi
        limits:
          cpu: 500m
          memory: 512Mi
```

## 2. Perbandingan `initContainers` Biasa vs *Native Sidecar* vs `containers` Utama

| Karakteristik | `initContainers` Biasa | *Native Sidecar* (`initContainers` + `restartPolicy: Always`) | `spec.containers` Biasa |
| :--- | :--- | :--- | :--- |
| Kapan kontainer berikutnya dimulai? | Setelah kontainer ini keluar dengan kode `0` (*exit 0*) | Segera setelah `startupProbe` kontainer ini lulus (kontainer tetap hidup) | Semua dimulai bersamaan secara paralel |
| Apakah di-restart jika mati di tengah jalan? | Mengikuti `spec.restartPolicy` pod selama fase init | **Selalu di-restart** sepanjang masa hidup pod | Mengikuti `spec.restartPolicy` pod |
| Urutan penghentian saat pod dihapus | Sudah selesai sejak awal | **Dihentikan paling akhir** setelah semua `spec.containers` berhenti | Dihentikan lebih awal secara paralel |

## Kuis Pemahaman

### Soal 1
Bagaimana cara mendeklarasikan sebuah *Native Sidecar Container* pada manifes Pod Kubernetes (sejak v1.29+)?
- A. Menempatkannya di dalam `spec.containers` dengan `sidecar: true`.
- B. Menempatkannya di dalam `spec.initContainers` dan menetapkan `restartPolicy: Always` pada kontainer tersebut.
- C. Membuat objek `DaemonSet` terpisah untuk setiap Pod.
- D. Menambahkan anotasi `kubernetes.io/sidecar: "true"` pada metadata `Namespace`.

**Jawaban Benar:** B
**Penjelasan:** Spesifikasi *Native Sidecar* di Kubernetes menggunakan daftar `spec.initContainers` dengan field tingkat kontainer `restartPolicy: Always`.

### Soal 2
Kapan Kubernetes memulai kontainer aplikasi utama di `spec.containers` apabila terdapat sebuah *Native Sidecar* yang memiliki `startupProbe` di dalam `spec.initContainers`?
- A. Setelah *Native Sidecar* berhenti dan keluar dengan kode `0`.
- B. Bersamaan pada milidetik yang sama tanpa menunggu *Native Sidecar*.
- C. Segera setelah `startupProbe` milik *Native Sidecar* tersebut dinyatakan berhasil, sementara *Native Sidecar* tetap terus berjalan.
- D. Hanya setelah pengguna menjalankan perintah `kubectl exec` secara manual.

**Jawaban Benar:** C
**Penjelasan:** Untuk *init container* dengan `restartPolicy: Always`, sinyal kesiapan untuk melanjutkan ke kontainer berikutnya adalah lulusnya `startupProbe` (bukan berhentinya proses).

### Soal 3
Bagaimana urutan penghentian (*termination*) antara kontainer utama di `spec.containers` dan *Native Sidecar* ketika sebuah Pod dihapus?
- A. *Native Sidecar* dimatikan terlebih dahulu, baru kemudian kontainer aplikasi utama.
- B. Kontainer aplikasi utama di `spec.containers` dihentikan terlebih dahulu, dan *Native Sidecar* dihentikan paling akhir dalam urutan terbalik dari waktu mulainya.
- C. Keduanya langsung dimatikan dengan `SIGKILL` tanpa menunggu `SIGTERM`.
- D. *Native Sidecar* tidak pernah dihentikan meskipun Pod sudah dihapus.

**Jawaban Benar:** B
**Penjelasan:** Menghentikan `spec.containers` lebih dulu memastikan aplikasi utama masih dapat mengirim log, jejak telemetri, atau menutup koneksi melalui *sidecar* selama masa *graceful shutdown*.

## Sumber
- [Kubernetes Official Documentation — Sidecar Containers (`restartPolicy: Always`)](https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/)
- [Kubernetes Official Documentation — Pod Lifecycle and Probes](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)
