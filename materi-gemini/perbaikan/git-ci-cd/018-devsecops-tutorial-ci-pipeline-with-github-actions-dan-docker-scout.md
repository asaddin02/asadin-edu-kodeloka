# Perbaikan: DevSecOps Tutorial | CI Pipeline with GitHub Actions & Docker Scout

- **Kelas:** git-ci-cd
- **Modul:** 18
- **Jenis:** tambahan

## Yang kurang
Materi saat ini hanya 148 kata. Belum membahas pencegahan kebocoran kredensial (*Secret Scanning*), pembatasan izin token `permissions:` prinsip hak akses minimum (*least privilege*) pada GitHub Actions, pemindaian perubahan dependensi pada *Pull Request* (`dependency-review-action`), serta penguncian aksi pihak ketiga dengan *commit SHA* (*pinning*).

## Materi tambahan
Letakkan di akhir materi (setelah blok kode `.github/workflows/devsecops.yml`).

### 3. Empat Lapisan Pertahanan Pipeline DevSecOps

Menjalankan pemindai citra kontainer saja belum cukup bila alur kerja CI/CD itu sendiri memiliki izin token yang terlalu luas. Terapkan empat lapisan pemeriksaan otomatis berikut:

| Lapisan Pemeriksaan | Apa yang Diperiksa? | Contoh Perkakas di CI |
| :--- | :--- | :--- |
| **Secret Scanning** | Kunci API, kata sandi, atau kunci privat yang tidak sengaja di-*commit* ke riwayat Git | GitHub Secret Scanning, Gitleaks, TruffleHog |
| **SCA (*Software Composition Analysis*)** | Kerentanan CVE dan lisensi bermasalah pada berkas kunci dependensi (`package-lock.json`, `go.sum`) | `actions/dependency-review-action`, `govulncheck`, `npm audit` |
| **SAST (*Static Application Security Testing*)** | Pola kode rentan seperti SQL Injection, XSS, atau *path traversal* di kode sumber | GitHub CodeQL, Semgrep |
| **Container & SBOM Scanning** | Kerentanan paket OS (`apk`/`apt`) di dalam lapisan citra Docker dan pembuatan *Software Bill of Materials* | Docker Scout, Trivy, Syft/Grype |

### 4. Mengeraskan Keamanan Berkas Workflow GitHub Actions

Secara bawaan, `GITHUB_TOKEN` di beberapa repositori lama dapat memiliki izin baca-tulis yang luas. Selalu tetapkan `permissions: contents: read` di tingkat teratas berkas *workflow*, dan berikan izin tambahan hanya pada *job* yang benar-benar membutuhkannya:

```yaml
name: Hardened DevSecOps Pipeline
on:
  pull_request:
    branches: [main]

# Prinsip Least Privilege: kunci izin default menjadi read-only
permissions:
  contents: read

jobs:
  dependency-and-container-audit:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
    steps:
      - name: Checkout kode sumber
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4 (pinned SHA)

      - name: Audit perubahan dependensi pada Pull Request
        uses: actions/dependency-review-action@3b139cfc5fae8b618d3eae3675e383bb1769c019 # v4
        with:
          fail-on-severity: high
```

## Sumber
- [GitHub Docs — Security Hardening for GitHub Actions](https://docs.github.com/en/actions/reference/security/secure-use)
- [Docker Scout Documentation — Integrate Docker Scout with GitHub Actions](https://docs.docker.com/scout/integrations/ci/gha/)
