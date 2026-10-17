# Perbaikan: Software Processes & Linux System Isolation

- **Kelas:** docker
- **Modul:** 3
- **Jenis:** koreksi, tambahan

## Yang kurang
Materi saat ini hanya 177 kata dan memuat pernyataan keamanan yang berlebihan: "Berkat isolasi Namespace & cgroups, kontainer yang diretas tidak dapat mengakses file sistem host atau kontainer tetangganya." Padahal kontainer berbagi kernel Linux yang sama dengan *host*; tanpa pembatasan *Linux Capabilities*, *seccomp*, dan pengguna non-root (atau jika dijalankan dengan `--privileged`), *container escape* masih dapat terjadi.

## Koreksi
> Teks lama: "⚠️ Keamanan: Berkat isolasi Namespace & cgroups, kontainer yang diretas tidak dapat mengakses file sistem host atau kontainer tetangganya."

Teks baru: "⚠️ **Catatan Keamanan:** *Namespaces* dan *cgroups* membatasi pandangan dan konsumsi sumber daya proses, tetapi semua kontainer masih berbagi **satu kernel Linux yang sama** dengan *host*. Untuk mencegah pelarian kontainer (*container escape*), selalu jalankan proses sebagai pengguna *non-root*, cabut kapabilitas kernel yang tidak perlu (`--cap-drop=ALL`), dan jangan gunakan flag `--privileged` di produksi."

## Materi tambahan
Letakkan di akhir materi (setelah catatan keamanan).

### 3. Tiga Pilar Tambahan Keamanan Isolasi Kontainer di Linux

Selain *Namespaces* (isolasi visibilitas) dan *cgroups v2* (pembatasan CPU, RAM, serta jumlah proses `pids.max`), runtime kontainer modern seperti `containerd` dan `runc` mengandalkan tiga mekanisme kernel Linux tambahan:

| Mekanisme Kernel | Fungsi Utama | Contoh Pengaturan pada `docker run` |
| :--- | :--- | :--- |
| **Linux Capabilities** | Memecah hak akses mutlak `root` menjadi unit izin kecil (seperti `CAP_NET_BIND_SERVICE` untuk mengikat port `< 1024` atau `CAP_SYS_ADMIN`) | `--cap-drop=ALL --cap-add=NET_BIND_SERVICE` |
| **Seccomp (*Secure Computing Mode*)** | Menyaring panggilan sistem (*system calls* / `syscall`) yang boleh dipanggil proses kontainer ke kernel Linux (profil bawaan Docker memblokir sekitar 44 `syscall` berbahaya dari 300+ `syscall`) | Aktif secara bawaan (`--security-opt seccomp=default`) |
| **AppArmor / SELinux** | Menerapkan *Mandatory Access Control* (MAC) pada jalur berkas dan jaringan | Aktif otomatis pada host Ubuntu/Debian atau RHEL |

### 4. Membuktikan Isolasi PID dan Batas Memori/PID secara Praktis

```bash
# Menjalankan kontainer dengan batas memori 128 MB, batas maksimal 64 proses (mencegah fork bomb),
# sistem berkas root read-only, dan tanpa kapabilitas root tambahan:
docker run -d \
  --name web-terisolasi \
  --memory="128m" \
  --pids-limit=64 \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=16m \
  --cap-drop=ALL \
  nginx:alpine

# Bandingkan PID di dalam kontainer (PID 1) dengan PID asli di Host OS:
docker top web-terisolasi
```

## Sumber
- [Docker Documentation — Runtime privilege and Linux capabilities](https://docs.docker.com/engine/containers/run/#runtime-privilege-and-linux-capabilities)
- [Docker Documentation — Seccomp security profiles for Docker](https://docs.docker.com/engine/security/seccomp/)
- [Docker Documentation — Resource constraints (`--memory`, `--cpus`, `--pids-limit`)](https://docs.docker.com/engine/containers/resource_constraints/)
