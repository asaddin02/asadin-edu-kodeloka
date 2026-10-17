# Perbaikan: ArgoCD Tutorial for Beginners | GitOps CD for Kubernetes

- **Kelas:** git-ci-cd
- **Modul:** 20
- **Jenis:** tambahan

## Yang kurang
Materi saat ini hanya 125 kata. Belum menjelaskan perbandingan arsitektur **Push-based CD** (CI menjalankan `kubectl apply` dari luar kluster) versus **Pull-based GitOps** (agen Argo CD di dalam kluster menarik status dari Git), arti rinci dari opsi `prune: true` dan `selfHeal: true`, serta pemisahan repositori kode aplikasi dari repositori manifes infrastruktur.

## Materi tambahan
Letakkan di akhir materi (setelah contoh `argocd-app-manifest.yaml`).

### 3. Mengapa *Pull-Based GitOps* Lebih Aman daripada *Push-Based CI/CD*?

Pada pipeline tradisional (*Push-based*), runner CI (seperti GitHub Actions atau Jenkins) harus menyimpan kredensial admin kluster Kubernetes (`KUBECONFIG`) agar dapat mengeksekusi `kubectl apply`. Jika runner CI diretas, penyerang langsung mendapatkan kunci penuh ke seluruh kluster produksi.

Dengan pendekatan **Pull-based GitOps** menggunakan Argo CD:
- Kredensial kluster produksi **tidak pernah keluar dari kluster**.
- Pipeline CI hanya bertugas membangun citra kontainer, mendorongnya ke *registry*, dan memperbarui tag versi di repositori Git manifes.
- Agen Argo CD yang berjalan di dalam kluster mendeteksi perubahan *commit* Git tersebut dan menyelaraskan objek Kubernetes secara lokal.

### 4. Membedah Kebijakan Sinkronisasi (`syncPolicy`) dan Pemulihan Drift

| Opsi `syncPolicy` | Perilaku Saat Diaktifkan | Catatan Produksi |
| :--- | :--- | :--- |
| `automated: {}` | Argo CD menerapkan perubahan *commit* Git secara otomatis dalam interval *polling* (bawaan 3 menit) atau lewat *webhook*. | Padukan dengan pemeriksaan kesehatan (*health check*) pada `Deployment`. |
| `prune: true` | Menghapus objek di kluster Kubernetes apabila berkas YAML-nya dihapus dari repositori Git. | Hati-hati pada `PersistentVolumeClaim` (PVC); tambahkan anotasi `argocd.argoproj.io/sync-options: Prune=false` pada sumber daya berstatus (*stateful*). |
| `selfHeal: true` | Menimpa kembali perubahan manual di kluster (misalnya seseorang menjalankan `kubectl edit` secara langsung) agar selalu kembali ke spesifikasi Git. | Menjamin tidak ada *configuration drift* di lingkungan produksi. |

```yaml
# Mencegah penghapusan tidak sengaja pada PersistentVolumeClaim saat prune: true
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-data-pvc
  annotations:
    argocd.argoproj.io/sync-options: Prune=false
spec:
  accessModes: ["ReadWriteOnce"]
  resources:
    requests:
      storage: 20Gi
```

## Sumber
- [Argo CD Official Documentation — Core Concepts](https://argo-cd.readthedocs.io/en/stable/core_concepts/)
- [Argo CD Official Documentation — Automated Sync Policy](https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/)
