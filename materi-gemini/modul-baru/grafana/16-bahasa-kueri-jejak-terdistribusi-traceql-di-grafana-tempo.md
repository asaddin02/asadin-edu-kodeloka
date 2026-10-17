# Menelusuri Jejak Terdistribusi dengan Bahasa Kueri **TraceQL** di Grafana Tempo

- **Letak:** sesudah modul 15
- **Tingkat:** Lanjut
- **Ringkasan:** Menulis kueri terstruktur menggunakan bahasa **TraceQL** di Grafana Tempo untuk menyaring span berdasarkan atribut sumber daya, durasi, status galat, serta relasi struktural induk-anak (`>` dan `>>`).

## Mengapa Pencarian Tag Sederhana Tidak Cukup untuk *Distributed Tracing*?

Dalam sistem terdistribusi yang terdiri atas puluhan layanan mikro, kita sering perlu menjawab pertanyaan struktural yang melintasi batas layanan, misalnya: *"Tampilkan semua jejak (trace) di mana `api-gateway` mengembalikan status `error` **DAN** di dalamnya terdapat pemanggilan anak ke `postgresql` yang memakan waktu lebih dari `500ms`."*

**TraceQL** (bahasa kueri bawaan **Grafana Tempo**, terinspirasi dari sintaks LogQL dan PromQL) dirancang khusus untuk menyaring *trace* berdasarkan atribut span, properti intrinsik, maupun hierarki pohon pemanggilan (*parent-child relationship*).

## 1. Tiga Ruang Lingkup Atribut di TraceQL

Di dalam satu pemilih span `{ ... }`, TraceQL membedakan tiga jenis properti:

| Ruang Lingkup (*Scope*) | Sintaks Penulisan | Contoh Properti |
| :--- | :--- | :--- |
| **Properti Intrinsik** (Tanpa awalan titik) | `duration`, `status`, `name`, `kind` | `{ duration > 500ms && status = error }` |
| **Atribut Resource** (`resource.`) | `resource.service.name`, `resource.k8s.namespace.name` | `{ resource.service.name = "checkout-api" }` |
| **Atribut Span** (`span.`) | `span.http.response.status_code`, `span.db.system` | `{ span.http.response.status_code >= 500 }` |
| **Tidak Dibatasi** (diawali titik `.`) | `.http.route` (mencari baik di `resource` maupun `span`) | `{ .http.route = "/api/v1/pay" }` |

## 2. Operator Struktural (`&&`, `>`, `>>`) dan Pipeline `select()`

Keunggulan utama TraceQL adalah kemampuannya menggabungkan dua pemilih *span* dalam satu *trace* yang sama menggunakan operator himpunan dan struktural:

- **`{ ... } && { ... }`:** Mencari *trace* yang memiliki Span A **dan** Span B di mana pun di dalam pohon *trace* tersebut.
- **`{ ... } > { ... }` (*Direct Child*):** Span kanan harus merupakan **anak langsung** dari Span kiri.
- **`{ ... } >> { ... }` (*Descendant*):** Span kanan adalah **keturunan** (anak, cucu, dst.) dari Span kiri.

```text
# 1. Mencari trace di mana checkout-service mengalami error DAN memiliki keturunan
#    span database PostgreSQL yang berdurasi lebih dari 300 milidetik:
{ resource.service.name = "checkout-service" && status = error }
  >> { span.db.system = "postgresql" && duration > 300ms }

# 2. Mencari endpoint HTTP POST yang lambat (> 1 detik) lalu memilih kolom atribut
#    spesifik untuk ditampilkan di tabel hasil Grafana Explore:
{ resource.service.name = "order-api" && span.http.request.method = "POST" && duration > 1s }
  | select(resource.service.name, span.http.route, span.http.response.status_code, duration)

# 3. Menemukan trace yang memanggil database lebih dari 15 kali dalam satu request
#    (indikasi kuat terjadinya masalah kueri N+1!):
{ span.db.system = "postgresql" } | count() > 15
```

## 3. Mendeteksi Masalah Kueri *N+1* dengan Agregasi `| count()`

Sering kali sebuah permintaan API terasa lambat bukan karena satu kueri SQL yang berat, melainkan karena kode ORM di aplikasi mengeksekusi 50 kueri `SELECT` kecil di dalam sebuah perulangan (*N+1 query problem*). Dengan pipa agregasi TraceQL `{ span.db.system = "postgresql" } | count() > 20`, Grafana Tempo langsung menampilkan daftar *trace* yang mengeksekusi lebih dari 20 span database dalam satu siklus permintaan pengguna!

## Kuis Pemahaman

### Soal 1
Dalam sintaks TraceQL, bagaimana cara membedakan properti bawaan span (seperti `duration` dan `status`) dari atribut tingkat layanan (`service.name`) dan atribut span (`http.response.status_code`)?
- A. Semuanya wajib diawali tanda dolar (`$`).
- B. Properti intrinsik ditulis langsung tanpa titik (`duration`, `status`), atribut sumber daya memakai `resource.service.name`, dan atribut span memakai `span.http.response.status_code` (atau `.nama` untuk mencari di keduanya).
- C. Semuanya harus ditulis dalam huruf kapital penuh.
- D. TraceQL hanya mengizinkan satu atribut di dalam kurung kurawal.

**Jawaban Benar:** B
**Penjelasan:** TraceQL memisahkan ruang lingkup properti menjadi intrinsik (`duration`, `status`, `name`, `kind`), `resource.<nama>`, `span.<nama>`, atau `.nama` (pencarian gabungan di *resource* dan *span*).

### Soal 2
Apa arti dari operator struktural `>>` pada kueri TraceQL `{ resource.service.name = "api-gateway" } >> { span.db.system = "redis" && duration > 100ms }`?
- A. Mengirimkan data dari Grafana Tempo ke server Redis.
- B. Mencari *trace* di mana span milik `api-gateway` memiliki span keturunan (*descendant*, baik anak langsung maupun tidak langsung) berupa operasi Redis yang berdurasi lebih dari 100 milidetik.
- C. Hanya mencari span Redis yang menjadi induk dari `api-gateway`.
- D. Membandingkan apakah nama string `"api-gateway"` lebih besar dari `"redis"`.

**Jawaban Benar:** B
**Penjelasan:** Operator `>>` adalah operator *descendant* di TraceQL yang mencocokkan *span* di sisi kanan apabila *span* tersebut berada di bawah pohon panggilan *span* di sisi kiri (baik anak langsung maupun cucu/keturunan lebih dalam).

### Soal 3
Kueri TraceQL manakah yang paling tepat untuk mendeteksi masalah kueri *N+1* (misalnya satu permintaan pengguna yang memicu lebih dari 25 span kueri database)?
- A. `{ span.db.system = "postgresql" && duration > 25s }`
- B. `{ span.db.system = "postgresql" } | count() > 25`
- C. `{ status = 25 }`
- D. `{ resource.service.name = "25" }`

**Jawaban Benar:** B
**Penjelasan:** Pipa agregasi `| count() > 25` menghitung jumlah *span* yang cocok dengan pemilih `{ span.db.system = "postgresql" }` di dalam masing-masing *trace* dan menyaring *trace* yang jumlah pemanggilan databasenya melebihi 25 kali.

## Sumber
- [Grafana Tempo Documentation — TraceQL Query Language](https://grafana.com/docs/tempo/latest/traceql/)
- [Grafana Tempo Documentation — Construct a TraceQL Query](https://grafana.com/docs/tempo/latest/traceql/construct-traceql-queries/)
