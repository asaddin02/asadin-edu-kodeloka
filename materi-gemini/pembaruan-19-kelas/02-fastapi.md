# Audit Kelengkapan & Paket Pembaruan Materi 2026: Kelas FastAPI Modern: Pydantic v2 (`model_validator`, `ConfigDict`), Lifespan Context, Dependency `Annotated`, & SQLAlchemy 2.0 Async

- **Tingkat:** Lanjut
- **Ringkasan:** Laporan audit kelengkapan atas 24 modul yang sudah ada di kelas `fastapi/` beserta 3 modul perluasan penuh berstandar 2025/2026 lengkap dengan contoh kode produksi dan kuis pemahaman untuk diintegrasikan oleh Claude Code ke `fastapi/app.js` (larik `modulesData`).

## 1. Audit Modul Saat Ini di Repositori (`fastapi/app.js`)

Saat ini, kelas **`fastapi`** di repositori Kodeloka memiliki **24 modul**. Berikut adalah pemetaan kondisinya serta celah fitur modern (2025–2026) yang telah kami lengkapi di berkas ini:

| No | Judul Modul Saat Ini | Tingkat | Status di Repo |
| :--- | :--- | :--- | :--- |
| 1 | 01. Getting Started - Web App + REST API | — | Sudah ada |
| 2 | 02. HTML Frontend & Jinja2 Templates | — | Sudah ada |
| 3 | 03. Path Parameters & Type Hints | — | Sudah ada |
| 4 | 04. Query Parameters & Optional Values | — | Sudah ada |
| 5 | 05. Request Body & Pydantic Schemas | — | Sudah ada |
| 6 | 06. Form Data & Asynchronous File Uploads | — | Sudah ada |
| 7 | 07. Response Models & Error Handling | — | Sudah ada |
| 8 | 08. Adding a Database (SQLAlchemy Setup & Session) | — | Sudah ada |
| 9 | 09. Database Models, Relationships & CRUD | — | Sudah ada |
| 10 | 10. Database Migrations dengan Alembic | — | Sudah ada |
| 11 | 11. Dependency Injection System (Depends) | — | Sudah ada |
| 12 | 12. Password Hashing & Security dengan pwdlib (Argon2) | — | Sudah ada |
| 13 | 13. User Registration & Login Flow | — | Sudah ada |
| 14 | 14. Authentication & Authorization dengan JWT Tokens | — | Sudah ada |
| 15 | 15. APIRouter & Project Modular Structuring | — | Sudah ada |
| 16 | 16. Lifespan Events & Manajemen Sumber Daya Aplikasi | — | Sudah ada |
| 17 | 17. Middleware & CORS Configuration | — | Sudah ada |
| 18 | 18. Rate Limiting & Perlindungan API | — | Sudah ada |
| 19 | 19. Background Tasks & Asynchronous Workers | — | Sudah ada |
| 20 | 20. Celery, Redis Queue & Pekerjaan Latar Belakang | — | Sudah ada |
| 21 | 21. WebSocket & Komunikasi Real-time | — | Sudah ada |
| 22 | 22. Automated Testing dengan Pytest & TestClient | — | Sudah ada |
| 23 | 23. File Storage & AWS S3 Integration | — | Sudah ada |
| 24 | 24. Docker Containerization & Production Deployment | — | Sudah ada |


> **⚠️ Temuan Audit & Apa yang Dilengkapi di Berkas Ini:**
> 1. **Penambahan Fitur Rilis Terbaru (2024–2026):** Tiga modul perluasan di bawah ini menambahkan pembaruan 2024–2026, tetapi sebagian topiknya sudah ada di kelas. Kelas sudah membahas `lifespan` (modul 16), `Annotated` pada parameter (modul 4 dan 16), `TestClient` (modul 22), dan Pydantic v2 secara umum (modul 5). Yang belum ada: `ConfigDict`/`model_config`, `@field_validator`/`@model_validator`, `httpx.ASGITransport`, dan `asyncpg`; `AsyncSession` dan `StreamingResponse` baru disinggung sekilas (modul 16 dan 21).
> 2. **Penyelarasan Bahasa Indonesia:** Beberapa judul atau istilah di kelas yang diadaptasi dari seri bahasa Inggris kini dilengkapi padanan penjelasan bahasa Indonesia yang baku dan konsisten dengan standar `GEMINI.md`.

## Modul Pembaruan 25: Migrasi Penuh ke Pydantic v2 (`ConfigDict`, `@field_validator`, `@model_validator`)

- **Tingkat:** Menengah
- **Ringkasan:** Menggantikan sintaks Pydantic v1 yang telah usang (`class Config:`, `@validator`, `.dict()`, `.parse_obj()`) dengan API Pydantic v2 berbasis Rust (`model_config = ConfigDict(...)`, `@field_validator`, `.model_dump()`, `.model_validate()`).

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menggantikan sintaks Pydantic v1 yang telah usang (`class Config:`, `@validator`, `.dict()`, `.parse_obj()`) dengan API Pydantic v2 berbasis Rust (`model_config = ConfigDict(...)`, `@field_validator`, `.model_dump()`, `.model_validate()`). Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```python
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

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `modulesData` di `fastapi/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `fastapi` dari **24 modul** menjadi **27 modul** berstandar terbaru.


## Modul Pembaruan 26: Siklus Hidup Aplikasi dengan `lifespan` (`@asynccontextmanager`) & `Annotated[..., Depends()]`

- **Tingkat:** Menengah
- **Ringkasan:** Menggantikan `@app.on_event('startup')` yang telah *deprecated* dengan manajer konteks `lifespan`, serta menyederhanakan deklarasi Dependency Injection yang dapat dipakai ulang menggunakan `typing.Annotated`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menggantikan `@app.on_event('startup')` yang telah *deprecated* dengan manajer konteks `lifespan`, serta menyederhanakan deklarasi Dependency Injection yang dapat dipakai ulang menggunakan `typing.Annotated`. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```python
from contextlib import asynccontextmanager
from typing import Annotated
from fastapi import Depends, FastAPI, Header

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inisialisasi pool koneksi database / Redis saat startup
    app.state.db_ready = True
    yield
    # Tutup koneksi dengan bersih saat shutdown
    app.state.db_ready = False

app = FastAPI(lifespan=lifespan)

def ambil_id_tenant(x_tenant_id: Annotated[str, Header()] = "publik") -> str:
    # Hanya contoh: di produksi, tentukan tenant dari token yang sudah diautentikasi, bukan dari header kiriman klien
    return x_tenant_id

TenantDep = Annotated[str, Depends(ambil_id_tenant)]

@app.get("/item")
async def daftar_item(tenant: TenantDep):
    return {"tenant": tenant}
```

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `modulesData` di `fastapi/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `fastapi` dari **24 modul** menjadi **27 modul** berstandar terbaru.


## Modul Pembaruan 27: Arsitektur Database Asinkron (SQLAlchemy 2.0 `AsyncSession`), StreamingResponse, & Pengujian `httpx.AsyncClient`

- **Tingkat:** Lanjut
- **Ringkasan:** Menghindari pemblokiran *Event Loop* ASGI dengan menggunakan driver asinkron (`asyncpg` + `AsyncSession`) atau mendelegasikan pustaka sinkron ke threadpool, serta menguji endpoint secara asinkron dengan `httpx.ASGITransport`.

### Penjelasan Mendalam & Praktik Terbaik Produksi (Standar 2025/2026)

Menghindari pemblokiran *Event Loop* ASGI dengan menggunakan driver asinkron (`asyncpg` + `AsyncSession`) atau mendelegasikan pustaka sinkron ke threadpool, serta menguji endpoint secara asinkron dengan `httpx.ASGITransport`. Dalam lingkungan produksi modern, penerapan pola ini membantu mengurangi risiko keamanan, memudahkan pengamatan (*observability*), dan menyiapkan layanan menghadapi lonjakan beban kerja nyata.

```python
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

> **💡 Catatan Integrasi Kodeloka:** Modul ini dirancang untuk langsung ditambahkan ke akhir larik `modulesData` di `fastapi/app.js` (lalu jalankan `npm run extract`) sehingga memperluas cakupan kelas `fastapi` dari **24 modul** menjadi **27 modul** berstandar terbaru.


## Latihan Praktik Mandiri

1. Terapkan konfigurasi dan kode dari ketiga modul pembaruan `fastapi` di atas pada lingkungan lokal atau *staging* Anda.
2. Verifikasi perilaku saat terjadi kegagalan (*fault injection*): hentikan salah satu komponen atau kirimkan beban tinggi, lalu amati metrik dan log yang dihasilkan.
3. Integrasikan ketiga modul di atas ke dalam `fastapi/app.js` menggunakan panduan di `materi-gemini/README.md`.

## Kuis Pemahaman

### Soal 1
Apa tujuan utama penambahan modul perluasan berstandar 2025/2026 pada kelas `fastapi` ini?
- A. Mengganti seluruh materi dasar dengan bahasa pemrograman yang sama sekali berbeda
- B. Melengkapi kurikulum yang sudah ada (24 modul) dengan fitur rilis terbaru, praktik penguatan keamanan produksi, dan observabilitas modern
- C. Menghapus seluruh latihan praktik dari kelas `fastapi`
- D. Mematikan fitur kuis interaktif di platform Kodeloka

**Jawaban Benar:** B
**Penjelasan:** Paket pembaruan ini melengkapi 24 modul yang sudah ada di `fastapi/app.js` dengan kapabilitas versi terbaru, arsitektur produksi, dan keamanan modern tanpa merusak struktur kelas yang sudah berjalan.

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
- B. Mengekstrak judul, tingkat, ringkasan, isi, contoh kode, dan kuis setiap modul dari berkas ini ke dalam larik `modulesData` di `fastapi/app.js` (bentuk objeknya mengikuti mesin kelas tersebut), memperbarui jumlah modul di `scripts/courses.json`, lalu menjalankan `npm run extract`
- C. Mengubah ekstensi berkas menjadi `.exe`
- D. Tidak perlu melakukan apa pun karena peramban membaca berkas Markdown secara acak

**Jawaban Benar:** B
**Penjelasan:** Sesuai arsitektur Kodeloka, setiap modul baru ditambahkan ke larik `modulesData` di `fastapi/app.js`, jumlah modulnya diperbarui di `scripts/courses.json`, dan `data/modules.json` dibangkitkan ulang lewat `npm run extract`.

## Sumber

- [Dokumentasi Resmi — FastAPI Modern](https://fastapi.tiangolo.com/)
- [FastAPI — Lifespan Events](https://fastapi.tiangolo.com/advanced/events/)
- [FastAPI — Testing Asinkron (`httpx.AsyncClient`)](https://fastapi.tiangolo.com/advanced/async-tests/)
- [Pydantic — Panduan Migrasi ke v2](https://docs.pydantic.dev/latest/migration/)
