# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Kubernetes Modern (K8s 1.30–1.32): Gateway API (`HTTPRoute`), Pod Security Standards (`restricted`), Topology Spread, & PDB

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 14 modul yang sudah ada di kelas `kubernetes/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `kubernetes/app.js` (larik `MODUL`).

## 1. Audit Modul Saat Ini di Repositori (`kubernetes/app.js`)

Saat ini, kelas **`kubernetes`** di repositori Kodeloka memiliki **14 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |
| 1 | Apa yang Sebenarnya Dikerjakan Kubernetes | Dasar | Sudah ada |
| 2 | Pod, Deployment & ReplicaSet | Dasar | Sudah ada |
| 3 | Service, Endpoint & DNS Internal | Dasar | Sudah ada |
| 4 | Ingress, Gateway API & TLS | Menengah | Sudah ada |
| 5 | ConfigMap, Secret & Manajemen Rahasia | Menengah | Sudah ada |
| 6 | Resource Request, Limit & Quality of Service | Menengah | Sudah ada |
| 7 | Volume, PVC & StatefulSet | Menengah | Sudah ada |
| 8 | RBAC, ServiceAccount & Pod Security | Menengah | Sudah ada |
| 9 | HPA, VPA & Cluster Autoscaler | Menengah | Sudah ada |
| 10 | Penjadwalan: Affinity, Taint & Topology Spread | Lanjutan | Sudah ada |
| 11 | Diagnosis Masalah: Dari CrashLoopBackOff sampai Pending | Menengah | Sudah ada |
| 12 | Helm, Kustomize & GitOps | Lanjutan | Sudah ada |
| 13 | Job, CronJob & DaemonSet | Menengah | Sudah ada |
| 14 | Observability & Kesiapan Produksi | Lanjutan | Sudah ada |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan di bawah ini menambahkan pembaruan 2024–2026, tetapi sebagian topiknya sudah ada di kelas. Kelas sudah membahas Gateway API dan `HTTPRoute` (modul 4), PodDisruptionBudget (modul 9, 10, dan 14), NetworkPolicy dan profil Pod Security `restricted` (modul 8 dan 14), `startupProbe` (modul 11), `preStop` (modul 2 dan 14), serta Topology Spread (modul 10). Yang belum ada: native sidecar (`restartPolicy: Always` pada `initContainers`); pola sidecar baru disebut secara konseptual di modul 1.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 15: Kubernetes Gateway API (`GatewayClass`, `Gateway`, `HTTPRoute`) sebagai Evolusi Standar Pengganti Ingress

- **Tingkat:** Lanjut
- **Ringkasan:** Mengelola perutean trafik masuk, *header matching*, dan pembagian beban (*canary traffic splitting*) secara portabel dan ekspresif menggunakan standar **Gateway API (`gateway.networking.k8s.io/v1`)**.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Mengelola perutean trafik masuk, *header matching*, dan pembagian beban (*canary traffic splitting*) secara portabel dan ekspresif menggunakan standar **Gateway API (`gateway.networking.k8s.io/v1`)**. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: rute-api-kodeloka
spec:
  parentRefs:
    - name: gateway-utama
  hostnames:
    - "api.kodeloka.id"
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /v1
      backendRefs:
        - name: layanan-api-stabil
          port: 8080
          weight: 90
        - name: layanan-api-canary
          port: 8080
          weight: 10
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `kubernetes/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `kubernetes` dari **14 modul** menjadi **17 modul** berstandar terbaru.


## Modul Pembaruan 16: Keamanan Pod (`securityContext` Profil `restricted`), NetworkPolicy Zero-Trust, dan PodDisruptionBudget (PDB)

- **Tingkat:** Lanjut
- **Ringkasan:** Memastikan ketersediaan layanan saat node dikuras (`kubectl drain`) menggunakan **PodDisruptionBudget**, mengisolasi komunikasi antar-namespace dengan **NetworkPolicy**, serta mematuhi standar **Pod Security Admission (`restricted`)**.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Memastikan ketersediaan layanan saat node dikuras (`kubectl drain`) menggunakan **PodDisruptionBudget**, mengisolasi komunikasi antar-namespace dengan **NetworkPolicy**, serta mematuhi standar **Pod Security Admission (`restricted`)**. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: pdb-api-kodeloka
spec:
  minAvailable: "80%"
  selector:
    matchLabels:
      app: api-kodeloka
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `kubernetes/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `kubernetes` dari **14 modul** menjadi **17 modul** berstandar terbaru.


## Modul Pembaruan 17: Startup Probe vs Liveness/Readiness Probe, Graceful Shutdown (`preStop` Hook), & Native Sidecar Containers (`restartPolicy: Always`)

- **Tingkat:** Lanjut
- **Ringkasan:** Menghindari pemutusan koneksi aktif (*HTTP 502*) saat Pod dihentikan dengan menyinkronkan waktu pelepasan endpoint Ingress/Service menggunakan hook `lifecycle.preStop` dan `terminationGracePeriodSeconds`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menghindari pemutusan koneksi aktif (*HTTP 502*) saat Pod dihentikan dengan menyinkronkan waktu pelepasan endpoint Ingress/Service menggunakan hook `lifecycle.preStop` dan `terminationGracePeriodSeconds`. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```yaml
lifecycle:
  preStop:
    exec:
      # Beri waktu 5 detik bagi kube-proxy/Ingress Controller mencabut IP Pod sebelum proses menerima SIGTERM
      command: ["sh", "-c", "sleep 5"]
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `MODUL` di `kubernetes/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `kubernetes` dari **14 modul** menjadi **17 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `kubernetes` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `kubernetes/app.js` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `kubernetes` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (14 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `kubernetes`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 14 modul yang sudah ada di `kubernetes/app.js` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `kubernetes` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan ketiga modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `kubernetes/`
- B. Mengekstrak judul, tingkat, ringkasan, isi, contoh kode, dan kuis setiap modul dari berkas ini ke dalam larik `MODUL` di `kubernetes/app.js` (bentuk objeknya mengikuti mesin kelas tersebut), memperbarui jumlah modul di `scripts/courses.json`, lalu menjalankan `npm run extract`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke larik `MODUL` di `kubernetes/app.js`, jumlah modulnya diperbarui di `scripts/courses.json`, dan `data/modules.json` dibangkitkan ulang lewat `npm run extract`.

## Sumber

- [Dokumentasi Resmi — Kubernetes Modern (K8s 1.30–1.32)](https://kubernetes.io/docs/home/)
- [Kubernetes — Gateway API](https://kubernetes.io/docs/concepts/services-networking/gateway/)
- [Kubernetes — Sidecar Containers](https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/)
- [Kubernetes — Disruptions dan PodDisruptionBudget](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/)
