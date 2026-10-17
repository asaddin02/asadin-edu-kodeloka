# Keamanan Rantai Pasok CI/CD: Autentikasi Cloud Tanpa Kunci (*OIDC*), *SBOM*, dan *GitHub Artifact Attestations*

- **Letak:** sesudah modul 20
- **Tingkat:** Lanjut
- **Ringkasan:** Menghapus penyimpanan kunci cloud jangka panjang di CI/CD menggunakan federasi identitas OpenID Connect (OIDC), serta membuktikan keaslian rilis menggunakan *Software Bill of Materials* (SBOM) dan *GitHub Artifact Attestations* (SLSA).

## Mengapa Kunci Cloud Statis di GitHub Secrets Berisiko Tinggi?

Secara tradisional, untuk mendorong citra kontainer ke AWS ECR, Google Artifact Registry, atau Azure ACR dari GitHub Actions, tim menyimpan kredensial jangka panjang (seperti `AWS_SECRET_ACCESS_KEY` atau berkas JSON *Service Account*) di dalam *GitHub Secrets*. Kunci statis ini tidak memiliki masa kedaluwarsa otomatis dan rawan disalahgunakan apabila tidak dirotasi.

Standar keamanan rantai pasok modern menggabungkan tiga pilar:
1. **OpenID Connect (OIDC):** Runner GitHub Actions meminta token JWT berumur pendek (`id-token: write`) yang diverifikasi langsung oleh penyedia cloud untuk ditukar dengan kredensial sementara (berlaku 15–60 menit) **tanpa satu pun kata sandi statis di *GitHub Secrets***.
2. **SBOM (*Software Bill of Materials*):** Daftar inventaris lengkap seluruh paket dan versinya yang terkandung di dalam artefak rilis (format standar CycloneDX atau SPDX).
3. **GitHub Artifact Attestations:** Tanda tangan kriptografi berbasis Sigstore yang membuktikan repositori, *commit SHA*, dan berkas *workflow* mana yang menghasilkan biner atau citra tersebut (*SLSA Build Provenance*).

## 1. Implementasi Workflow: OIDC Cloud Login + Artifact Attestations

```yaml
name: Build and Attest Release Image
on:
  push:
    branches: [main]

permissions:
  contents: read
  id-token: write      # Wajib untuk meminta token OIDC dan penandatanganan Sigstore
  attestations: write  # Wajib untuk menyimpan GitHub Artifact Attestations
  packages: write      # Wajib untuk mendorong citra ke ghcr.io

jobs:
  build-push-attest:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repositori
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4

      - name: Login ke GitHub Container Registry
        uses: docker/login-action@74a5d142397b4f367a81961eba4e8cd7edddf772 # v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build dan Push citra berdasarkan digest
        id: push_step
        uses: docker/build-push-action@14487ce63c7a62a4a324b0bfb37086795e31c6c1 # v6
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:${{ github.sha }}

      - name: Buat SLSA Build Provenance Attestation
        uses: actions/attest-build-provenance@1c608d11d69870c2092266b3f9a6f3abbf17002c # v2
        with:
          subject-name: ghcr.io/${{ github.repository }}
          subject-digest: ${{ steps.push_step.outputs.digest }}
          push-to-registry: true
```

## 2. Memverifikasi Keaslian Artefak Sebelum Dideploy (`gh attestation verify`)

Di lingkungan produksi atau pada kontrol admisi kluster Kubernetes, Anda dapat memverifikasi bahwa citra kontainer atau biner yang akan dijalankan benar-benar dibangun oleh *workflow* resmi di repositori Anda, bukan hasil unggahan manual dari laptop seseorang:

```bash
# Memverifikasi bahwa citra ghcr.io dibangun oleh workflow resmi repositori organisasi Anda
gh attestation verify oci://ghcr.io/asaddin02/kodeloka-api:sha-8f3a1b2 \
  --owner asaddin02
```

## 3. Ringkasan Izin `permissions:` yang Dibutuhkan

| Izin `permissions:` | Kegunaan Spesifik |
| :--- | :--- |
| `id-token: write` | Mengizinkan runner meminta token OIDC dari penyedia identitas GitHub (`https://token.actions.githubusercontent.com`) untuk autentikasi cloud tanpa kunci maupun sertifikat Sigstore Fulcio. |
| `attestations: write` | Mengizinkan aksi `actions/attest-build-provenance` mengunggah bundel pembuktian SLSA ke repositori GitHub. |
| `contents: read` | Membaca kode sumber tanpa memberi izin mendorong *commit* balik ke repositori. |

## Kuis Pemahaman

### Soal 1
Apa keuntungan utama menggunakan OpenID Connect (OIDC) pada GitHub Actions dibandingkan menyimpan `AWS_SECRET_ACCESS_KEY` di *GitHub Secrets*?
- A. OIDC mempercepat kompilasi kode Go dan TypeScript hingga dua kali lipat.
- B. Tidak ada kredensial cloud jangka panjang yang disimpan di GitHub; penyedia cloud memverifikasi token JWT OIDC dari workflow yang sah dan menerbitkan token akses sementara yang otomatis kedaluwarsa.
- C. OIDC memungkinkan workflow berjalan tanpa koneksi internet.
- D. OIDC mengenkripsi kode sumber di dalam repositori publik.

**Jawaban Benar:** B
**Penjelasan:** Dengan OIDC (`id-token: write`), penyedia cloud memvalidasi klaim repositori dan cabang langsung dari token JWT GitHub dan memberikan kredensial berumur pendek untuk satu *job* tersebut saja.

### Soal 2
Apa fungsi dari aksi resmi `actions/attest-build-provenance` dalam rantai pasok perangkat lunak?
- A. Menghapus seluruh *branch* lama setelah *Pull Request* digabungkan.
- B. Menghasilkan pembuktian kriptografi (*SLSA build provenance attestation*) yang mengikat *digest* artefak dengan repositori, *commit SHA*, dan lingkungan *workflow* yang membangunnya.
- C. Mengubah kode JavaScript menjadi WebAssembly.
- D. Menjalankan pengujian beban terhadap server produksi.

**Jawaban Benar:** B
**Penjelasan:** *Artifact Attestations* menghasilkan bundel tanda tangan kriptografi yang dapat diverifikasi dengan `gh attestation verify` untuk membuktikan asal-usul pembuatan artefak.

### Soal 3
Mengapa pada aksi pihak ketiga di berkas workflow produksi sangat disarankan menulis `uses: actions/checkout@11bd7190...` (40 karakter *commit SHA*) daripada `uses: actions/checkout@v4`?
- A. Karena GitHub Actions menolak menjalankan tag versi seperti `@v4`.
- B. Karena tag Git seperti `@v4` bersifat *mutable* (dapat dipindahkan ke *commit* berbahaya jika akun pembuat aksi diretas), sedangkan *commit SHA* 40 karakter bersifat *immutable*.
- C. Karena *commit SHA* tidak memerlukan izin `contents: read`.
- D. Karena *commit SHA* otomatis mengaktifkan cache Docker.

**Jawaban Benar:** B
**Penjelasan:** Mengunci (*pinning*) aksi ke *commit SHA* lengkap merupakan standar pengerasan keamanan GitHub Actions untuk mencegah serangan rantai pasok melalui pemindahan tag versi.

## Sumber
- [GitHub Docs — About security hardening with OpenID Connect](https://docs.github.com/en/actions/concepts/security/openid-connect)
- [GitHub Docs — Using artifact attestations to establish provenance for builds](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations)
- [GitHub Docs — Security hardening for GitHub Actions (pinning to a full length commit SHA)](https://docs.github.com/en/actions/reference/security/secure-use)
