# Perbaikan: CMD vs ENTRYPOINT & Multi-Stage Builds

- **Kelas:** docker
- **Modul:** 17
- **Jenis:** tambahan

## Yang kurang
Materi saat ini hanya 184 kata. Belum menjelaskan perbedaan krusial antara **Exec Form** (`["./main-app"]`) dan **Shell Form** (`./main-app`) terhadap penerimaan sinyal penghentian `SIGTERM` (PID 1 *graceful shutdown*), serta cara mengompilasi biner Go statis (`CGO_ENABLED=0`) ke dalam citra minimal atau `distroless` dengan pengguna non-root.

## Materi tambahan
Letakkan di akhir materi (setelah kalimat hasil optimasi ukuran citra).

### 3. *Exec Form* vs *Shell Form*: Mengapa Kontainer Anda Lambat Berhenti Saat `docker stop`?

Baik `CMD` maupun `ENTRYPOINT` dapat ditulis dalam dua bentuk sintaks yang perilakunya sangat berbeda terhadap sinyal sistem operasi:

| Bentuk Sintaks | Contoh Penulisan | Proses yang Menjadi `PID 1` | Apakah Aplikasi Menerima Sinyal `SIGTERM` (`docker stop`)? |
| :--- | :--- | :--- | :--- |
| **Exec Form** (Rekomendasi Utama) | `CMD ["./main-app", "--port=8080"]` | Langsung proses `./main-app` | **Ya!** Aplikasi dapat menutup koneksi database dengan rapi (*graceful shutdown*). |
| **Shell Form** | `CMD ./main-app --port=8080` | Dibungkus oleh `/bin/sh -c "./main-app ..."` | **Tidak!** `/bin/sh` umumnya tidak meneruskan sinyal `SIGTERM` ke proses anak, sehingga Docker terpaksa menunggu 10 detik lalu mematikan paksa kontainer dengan `SIGKILL`. |

### 4. *Multi-Stage Build* Siap Produksi dengan Biner Statis dan Non-Root User

Pada contoh *multi-stage build* untuk Go, pastikan Anda menonaktifkan `cgo` (`CGO_ENABLED=0`), menyertakan sertifikat TLS (`ca-certificates`) serta data zona waktu (`tzdata`), dan menjalankan biner sebagai pengguna **non-root**:

```dockerfile
# Tahap 1: Kompilasi biner statis
FROM golang:1.27-alpine AS builder
WORKDIR /src

# Manfaatkan layer caching untuk unduhan modul
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w" -o /out/app ./cmd/api

# Tahap 2: Runtime minimal, aman, dan non-root
FROM alpine:3.21
RUN apk --no-cache add ca-certificates tzdata \
    && adduser -D -g '' -u 10001 appuser

WORKDIR /app
COPY --from=builder /out/app /app/app

USER 10001:10001
EXPOSE 8080
ENTRYPOINT ["/app/app"]
```

## Sumber
- [Docker Documentation — Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
- [Dockerfile Reference — `CMD` and `ENTRYPOINT` (Exec vs Shell form)](https://docs.docker.com/reference/dockerfile/#entrypoint)
