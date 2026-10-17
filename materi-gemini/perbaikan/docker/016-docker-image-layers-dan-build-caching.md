# Perbaikan: Docker Image Layers & Build Caching

- **Kelas:** docker
- **Modul:** 16
- **Jenis:** koreksi, tambahan

## Yang kurang
Materi saat ini hanya 154 kata dan memiliki dua salah ketik ("Contoh Struktur DOKERFILE SALAH" dan "Contoh Struktur DOKERFILE BENAR"). Selain itu, belum menjelaskan konsep arsitektur *Union File System* (*OverlayFS*: `lowerdir`, `upperdir`, `merged`), mengapa menghapus berkas pada instruksi `RUN` terpisah tidak mengecilkan ukuran citra, serta penggunaan cache mount BuildKit (`RUN --mount=type=cache`).

## Koreksi
> Teks lama: "Contoh Struktur DOKERFILE SALAH (Lambat):"

Teks baru: "Contoh Struktur `Dockerfile` yang Kurang Optimal (Lambat):"

> Teks lama: "Contoh Struktur DOKERFILE BENAR (Cepat dengan Cache):"

Teks baru: "Contoh Struktur `Dockerfile` yang Optimal (Cepat dengan Build Cache):"

## Materi tambahan
Letakkan di akhir materi (setelah penjelasan `.dockerignore`).

### 3. Bagaimana *OverlayFS* Menumpuk Lapisan Citra?

Citra Docker disusun di atas sistem berkas bertumpuk (*Union File System* dengan driver **OverlayFS** di Linux):
- **`lowerdir` (*Image Layers*):** Lapisan-lapisan baca-saja (*read-only*) yang dihasilkan oleh instruksi `FROM`, `COPY`, dan `RUN` di `Dockerfile`. Lapisan ini dapat dipakai bersama (*shared*) oleh puluhan kontainer di host yang sama tanpa menggandakan pemakaian disk.
- **`upperdir` (*Container Layer*):** Satu lapisan tipis baca-tulis (*read-write*) yang dibuat saat kontainer dijalankan. Jika kontainer memodifikasi berkas yang berasal dari `lowerdir`, Docker melakukan *Copy-on-Write* (CoW) dengan menyalin berkas tersebut ke `upperdir`.

### 4. Jebakan Penghapusan Berkas Lintas Lapisan dan Solusi `--mount=type=cache`

Karena setiap instruksi `RUN` membekukan sebuah lapisan *read-only* baru, menghapus cache apt atau npm pada instruksi `RUN` berikutnya **tidak mengurangi ukuran citra akhir** (berkas lama tetap tersimpan di lapisan bawah dan hanya diberi penanda tersembunyi *whiteout*):

```dockerfile
# ❌ SALAH: cache apt sebesar ~40 MB tetap tertinggal di Layer 1!
FROM ubuntu:24.04
RUN apt-get update && apt-get install -y curl ca-certificates
RUN rm -rf /var/lib/apt/lists/*

# ✅ BENAR (Cara Klasik): gabungkan instalasi dan pembersihan dalam satu instruksi RUN
FROM ubuntu:24.04
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# ✅ PALING MODERN (BuildKit Cache Mount): direktori cache disimpan di host oleh BuildKit
# tanpa pernah masuk ke lapisan citra akhir!
FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
COPY . .
CMD ["node", "server.js"]
```

## Sumber
- [Docker Documentation — Optimize cache usage in builds](https://docs.docker.com/build/cache/optimize/)
- [Docker Documentation — OverlayFS storage driver](https://docs.docker.com/engine/storage/drivers/overlayfs-driver/)
