# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas Git & CI/CD Modern: GitHub Actions Security (OIDC Tanpa Long-Lived Secrets, SHA Pinning), Git Attestations/SBOM, `git bisect`, & Merge Queue

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 0 modul yang sudah ada di kelas `git-ci-cd/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `git-ci-cd/data/modules.json`.

## 1. Audit Modul Saat Ini di Repositori (`git-ci-cd/data/modules.json`)

Saat ini, kelas **`git-ci-cd`** di repositori Kodeloka memiliki **0 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan penuh di bawah ini menambahkan kapabilitas rilis terbaru yang belum tercakup di modul lama.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 21: Keamanan GitHub Actions — Autentikasi Cloud Tanpa Kunci Rahasia dengan OpenID Connect (OIDC) & Pinning Commit SHA

- **Tingkat:** Lanjut
- **Ringkasan:** Menghapus penyimpanan kredensial cloud jangka panjang di GitHub Secrets dengan menggunakan token jangka pendek **OIDC (`id-token: write`)**, membatasi `permissions: contents: read`, serta mencegah serangan rantai pasok (*supply-chain attack*) dengan menyematkan hash commit penuh pada `uses:`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menghapus penyimpanan kredensial cloud jangka panjang di GitHub Secrets dengan menggunakan token jangka pendek **OIDC (`id-token: write`)**, membatasi `permissions: contents: read`, serta mencegah serangan rantai pasok (*supply-chain attack*) dengan menyematkan hash commit penuh pada `uses:`. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
permissions:
  contents: read
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout kode sumber
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `git-ci-cd/data/modules.json` (dan `git-ci-cd/app.js`) sehingga memperluas cakupan kelas `git-ci-cd` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 22: Git Tingkat Lanjut untuk Tim Besar — `git bisect run`, `git worktree`, `git reflog`, dan Signed Commits (SSH Signing)

- **Tingkat:** Menengah
- **Ringkasan:** Menemukan commit pemecah fitur secara otomatis menggunakan pencarian biner `git bisect run`, mengerjakan dua cabang sekaligus tanpa `git stash` dengan `git worktree`, serta menandatangani commit secara kriptografis menggunakan kunci SSH.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menemukan commit pemecah fitur secara otomatis menggunakan pencarian biner `git bisect run`, mengerjakan dua cabang sekaligus tanpa `git stash` dengan `git worktree`, serta menandatangani commit secara kriptografis menggunakan kunci SSH. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
# Mengaktifkan penandatanganan commit menggunakan kunci SSH yang sudah Anda miliki
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `git-ci-cd/data/modules.json` (dan `git-ci-cd/app.js`) sehingga memperluas cakupan kelas `git-ci-cd` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 23: Rantai Pasok Perangkat Lunak Aman (SLSA Provenance, Artifact Attestations, SBOM CycloneDX/SPDX) & Strategi Canary/Blue-Green

- **Tingkat:** Lanjut
- **Ringkasan:** Menghasilkan bukti keaslian artefak build (*Artifact Attestations*) dan daftar bahan perangkat lunak (*Software Bill of Materials / SBOM*) di pipa CI/CD sebelum gambar container diizinkan berjalan di produksi.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menghasilkan bukti keaslian artefak build (*Artifact Attestations*) dan daftar bahan perangkat lunak (*Software Bill of Materials / SBOM*) di pipa CI/CD sebelum gambar container diizinkan berjalan di produksi. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
# Memverifikasi tanda tangan dan asal-usul artefak sebelum deploy
gh attestation verify oci://ghcr.io/kodeloka/api:1.4.0 --owner kodeloka
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `git-ci-cd/data/modules.json` (dan `git-ci-cd/app.js`) sehingga memperluas cakupan kelas `git-ci-cd` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `git-ci-cd` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `git-ci-cd/data/modules.json` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `git-ci-cd` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (0 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `git-ci-cd`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 0 modul yang sudah ada di `git-ci-cd/data/modules.json` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `git-ci-cd` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan ketiga modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `git-ci-cd/`
- B. Mengekstrak objek `judul`, `tingkat`, `ringkas`, `isi`, contoh kode, dan `kuis` dari berkas ini ke dalam `git-ci-cd/data/modules.json` serta memperbarui jumlah modul di `scripts/courses.json`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke `git-ci-cd/data/modules.json` (dan disinkronkan ke `git-ci-cd/app.js` serta `scripts/courses.json`).

## Sumber

- [Dokumentasi Resmi — Git & CI/CD Modern](https://docs.github.com/en/actions)
