# Perbaikan: GitLab CI/CD Tutorial for Beginners [Crash Course]

- **Kelas:** git-ci-cd
- **Modul:** 10
- **Jenis:** koreksi, tambahan

## Yang kurang
Materi saat ini hanya 136 kata dan contoh `.gitlab-ci.yml` di dalamnya masih menggunakan kata kunci `only: - main` yang sudah **deprecated** (usang) di GitLab CI/CD modern dan digantikan oleh `rules:`. Selain itu, materi belum menjelaskan perbedaan `cache` vs `artifacts`, penggunaan `needs:` untuk *Directed Acyclic Graph* (DAG), serta variabel lingkungan terlindung (*masked/protected variables*).

## Koreksi
> Teks lama: "only:\n    - main"

Teks baru: "`rules:\n    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH`"

## Materi tambahan
Letakkan di akhir materi (setelah blok kode `.gitlab-ci.yml`).

### 3. Mengapa `rules:` Menggantikan `only:` dan `except:`?

Dalam GitLab CI/CD modern, kata kunci `only` dan `except` tidak lagi dikembangkan dan telah digantikan oleh blok **`rules:`**. Dengan `rules:`, Anda dapat mengevaluasi ekspresi logika menggunakan variabel bawaan seperti `$CI_PIPELINE_SOURCE`, `$CI_COMMIT_BRANCH`, dan `$CI_COMMIT_TAG`, serta menentukan kapan sebuah *job* berjalan otomatis (`when: on_success`) atau memerlukan persetujuan manual (`when: manual`):

```yaml
# Potongan .gitlab-ci.yml modern dengan rules dan needs (DAG)
stages:
  - test
  - build
  - deploy

lint_and_unit_test:
  stage: test
  image: node:22-alpine
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run lint
    - npm test
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

build_package:
  stage: build
  image: node:22-alpine
  needs: ["lint_and_unit_test"]
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 7 days

deploy_production:
  stage: deploy
  needs: ["build_package"]
  environment:
    name: production
    url: https://kodeloka.asadinedu.com
  script:
    - ./scripts/deploy.sh
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      when: manual
      allow_failure: false
```

### 4. Perbedaan `cache` vs `artifacts` di GitLab CI/CD

| Karakteristik | `cache` | `artifacts` |
| :--- | :--- | :--- |
| Tujuan utama | Mempercepat unduhan dependensi antar-*pipeline* (mis. `.npm/`, `.cache/pip`, `vendor/`) | Meneruskan hasil kompilasi dari satu *stage* ke *stage* berikutnya dalam *pipeline* yang sama (mis. `dist/`, biner, laporan JUnit) |
| Apakah dijamin selalu tersedia? | Tidak (*best-effort*; *job* harus tetap berhasil meskipun *cache* kosong) | Ya (diunggah ke GitLab Coordinator dan diunduh otomatis oleh *job* di *stage* hilir) |

## Sumber
- [GitLab CI/CD YAML Syntax Reference — `rules`](https://docs.gitlab.com/ci/yaml/#rules)
- [GitLab CI/CD Documentation — Caching vs Artifacts](https://docs.gitlab.com/ci/caching/)
