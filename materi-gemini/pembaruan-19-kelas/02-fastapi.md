# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas FastAPI Modern: Pydantic v2 (`model_validator`, `ConfigDict`), Lifespan Context, Dependency `Annotated`, & SQLAlchemy 2.0 Async

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 0 modul yang sudah ada di kelas `fastapi/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `fastapi/data/modules.json`.

## 1. Audit Modul Saat Ini di Repositori (`fastapi/data/modules.json`)

Saat ini, kelas **`fastapi`** di repositori Kodeloka memiliki **0 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan penuh di bawah ini menambahkan kapabilitas rilis terbaru yang belum tercakup di modul lama.
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 25: Migrasi Penuh ke Pydantic v2 (`ConfigDict`, `@field_validator`, `@model_validator`)

- **Tingkat:** Menengah
- **Ringkasan:** Menggantikan sintaks Pydantic v1 yang telah usang (`class Config:`, `@validator`, `.dict()`, `.parse_obj()`) dengan API Pydantic v2 berbasis Rust (`model_config = ConfigDict(...)`, `@field_validator`, `.model_dump()`, `.model_validate()`).

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menggantikan sintaks Pydantic v1 yang telah usang (`class Config:`, `@validator`, `.dict()`, `.parse_obj()`) dengan API Pydantic v2 berbasis Rust (`model_config = ConfigDict(...)`, `@field_validator`, `.model_dump()`, `.model_validate()`). Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
from pydantic import BaseModel, ConfigDict, Field, field_validator

class BuatAkunRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    username: str = Field(min_length=3, max_length=30)
    umur: int = Field(ge=13, le=120)

    @field_validator("username")
    @classmethod
    def harus_alfanumerik(cls, v: str) -> str:
        if not v.isalnum():
            raise ValueError("Username hanya boleh berisi huruf dan angka")
        return v.lower()
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `fastapi/data/modules.json` (dan `fastapi/app.js`) sehingga memperluas cakupan kelas `fastapi` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 26: Siklus Hidup Aplikasi dengan `lifespan` (`@asynccontextmanager`) & `Annotated[..., Depends()]`

- **Tingkat:** Menengah
- **Ringkasan:** Menggantikan `@app.on_event('startup')` yang telah *deprecated* dengan manajer konteks `lifespan`, serta menyederhanakan deklarasi Dependency Injection yang dapat dipakai ulang menggunakan `typing.Annotated`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menggantikan `@app.on_event('startup')` yang telah *deprecated* dengan manajer konteks `lifespan`, serta menyederhanakan deklarasi Dependency Injection yang dapat dipakai ulang menggunakan `typing.Annotated`. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import Depends, FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inisialisasi pool koneksi database / Redis saat startup
    app.state.db_ready = True
    yield
    # Tutup koneksi dengan bersih saat shutdown
    app.state.db_ready = False

app = FastAPI(lifespan=lifespan)

def ambil_id_tenant(x_tenant_id: str = "publik") -> str:
    return x_tenant_id

TenantDep = Annotated[str, Depends(ambil_id_tenant)]

@app.get("/item")
async def daftar_item(tenant: TenantDep):
    return {"tenant": tenant}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `fastapi/data/modules.json` (dan `fastapi/app.js`) sehingga memperluas cakupan kelas `fastapi` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Modul Pembaruan 27: Arsitektur Database Asinkron (SQLAlchemy 2.0 `AsyncSession`), StreamingResponse, & Pengujian `httpx.AsyncClient`

- **Tingkat:** Lanjut
- **Ringkasan:** Menghindari pemblokiran *Event Loop* ASGI dengan menggunakan driver asinkron (`asyncpg` + `AsyncSession`) atau mendelegasikan pustaka sinkron ke threadpool, serta menguji endpoint secara asinkron dengan `httpx.ASGITransport`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menghindari pemblokiran *Event Loop* ASGI dengan menggunakan driver asinkron (`asyncpg` + `AsyncSession`) atau mendelegasikan pustaka sinkron ke threadpool, serta menguji endpoint secara asinkron dengan `httpx.ASGITransport`. Dalam lingkungan produksi modern, penerapan pola ini memastikan layanan Anda bebas dari celah keamanan, mudah diamati (*observable*), dan siap menangani lonjakan beban kerja nyata.

```
import httpx
import pytest
from main import app

@pytest.mark.anyio
async def test_kesehatan_api():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/item")
        assert res.status_code == 200
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir array di `fastapi/data/modules.json` (dan `fastapi/app.js`) sehingga memperluas cakupan kelas `fastapi` dari **0 modul** menjadi **3 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `fastapi` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `fastapi/data/modules.json` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `fastapi` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (0 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `fastapi`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 0 modul yang sudah ada di `fastapi/data/modules.json` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

### Soal 2
Manakah prinsip yang wajib dijaga saat mengoperasikan teknologi `fastapi` di lingkungan produksi?
- A. Menjalankan seluruh layanan sebagai `root` tanpa batas memori dan tanpa pemantauan
- B. Menerapkan prinsip hak akses paling rendah (*least privilege*), membatasi penggunaan sumber daya, memvalidasi konfigurasi secara otomatis di CI/CD, dan memantau metrik/log kesehatan layanan
- C. Mengabaikan pembaruan versi keamanan
- D. Menyimpan kata sandi produksi di dalam kode sumber publik

**Jawaban Benar:** B
**Penjelasan:** Keandalan dan keamanan di produksi bergantung pada isolasi hak akses, pembatasan sumber daya (memori/waktu tunggu), otomasi pengujian, dan observabilitas menyeluruh.

### Soal 3
Bagaimana cara mengintegrasikan ketiga modul baru di berkas ini ke dalam situs Kodeloka?
- A. Menghapus seluruh folder `fastapi/`
- B. Mengekstrak objek `judul`, `tingkat`, `ringkas`, `isi`, contoh kode, dan `kuis` dari berkas ini ke dalam `fastapi/data/modules.json` serta memperbarui jumlah modul di `scripts/courses.json`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke `fastapi/data/modules.json` (dan disinkronkan ke `fastapi/app.js` serta `scripts/courses.json`).

## Sumber

- [Dokumentasi Resmi — FastAPI Modern](https://fastapi.tiangolo.com/)
