# Perbaikan: CI/CD Explained: Continuous Integration, Delivery & Deployment

- **Kelas:** git-ci-cd
- **Modul:** 7
- **Jenis:** tambahan

## Yang kurang
Materi saat ini hanya 125 kata. Belum membahas tahapan lengkap *pipeline* modern (mulai dari *commit*, *lint/test*, pembangunan artefak *immutable*, hingga promosi lingkungan), metrik kinerja pengiriman perangkat lunak standar industri **DORA Metrics**, serta perbandingan risiko dan biaya antara strategi *Rolling*, *Blue-Green*, dan *Canary*.

## Materi tambahan
Letakkan di akhir materi (setelah bagian "2. Strategi Deployment Zero-Downtime").

### 3. Prinsip Artefak *Immutable*: "Bangun Sekali, Promosikan ke Banyak Lingkungan"

Kesalahan arsitektur yang sering terjadi pada tim pemula adalah melakukan kompilasi ulang (*rebuild*) kode sumber di setiap tahap lingkungan (satu *build* untuk *Staging*, lalu *build* ulang dari cabang Git saat menuju *Production*). Praktik ini berbahaya karena versi paket eksternal atau lapisan dasar kontainer bisa berubah di sela waktu tersebut.

Dalam *pipeline* CI/CD modern:
1. Tahap **CI** membangun **satu artefak *immutable*** (misalnya citra OCI/Docker yang ditandai dengan *digest* SHA-256 atau *commit* SHA: `myapp:sha-8f3a1b2`).
2. Tahap **Continuous Delivery / Deployment** mempromosikan artefak dengan *digest* yang **persis sama** dari lingkungan *Staging* ke *Production*, hanya dengan menyuntikkan konfigurasi lingkungan yang berbeda.

### 4. Perbandingan Strategi Rilis Produksi

| Strategi Rilis | Kebutuhan Infrastruktur | Kecepatan *Rollback* | Risiko Paparan Bug ke Pengguna |
| :--- | :--- | :--- | :--- |
| **Rolling Update** | Rendah (tidak butuh ganda kapasitas penuh) | Sedang (harus menggulirkan balik pod satu per satu) | Sedang (sebagian pengguna terpapar selama proses pergantian) |
| **Blue-Green Deployment** | Tinggi (`2x` kapasitas selama transisi) | Sangat cepat (cukup mengalihkan *router/load balancer* kembali ke lingkungan *Blue*) | Rendah jika lingkungan *Green* sudah diuji dengan *smoke test* sebelum trafik dialihkan |
| **Canary Deployment** | Rendah–Sedang (mis. `5%` replika baru) | Cepat (hentikan trafik ke replika *canary*) | Sangat rendah (hanya sebagian kecil trafik yang menyentuh versi baru sambil metrik galat dipantau) |

### 5. Mengukur Kesehatan Pipeline dengan Empat Metrik DORA

Untuk mengevaluasi apakah penerapan CI/CD benar-benar meningkatkan kualitas rekayasa perangkat lunak, tim DevOps menggunakan empat metrik kunci dari *DORA (DevOps Research and Assessment)*:

1. **Deployment Frequency:** Seberapa sering tim berhasil merilis perubahan ke produksi.
2. **Lead Time for Changes:** Waktu yang dibutuhkan sejak *commit* kode dibuat hingga berjalan di produksi.
3. **Change Failure Rate:** Persentase rilis produksi yang menyebabkan gangguan layanan atau membutuhkan perbaikan darurat.
4. **Failed Deployment Recovery Time (MTTR):** Waktu rata-rata yang dibutuhkan untuk memulihkan layanan ketika rilis bermasalah.

## Sumber
- [GitHub Actions Documentation — About Continuous Integration and Continuous Deployment](https://docs.github.com/en/actions/about-github-actions/understanding-github-actions)
- [GitLab CI/CD Documentation — Concepts and Pipelines](https://docs.gitlab.com/ci/pipelines/)
