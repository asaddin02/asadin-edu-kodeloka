# Perbaikan: Dependency Injection System (Depends)

- **Kelas:** fastapi
- **Modul:** 11
- **Jenis:** pengganti

## Yang kurang
Materi saat ini hanya 40 kata. Belum menjelaskan cara penulisan modern `Annotated[T, Depends(...)]`, dependensi berbasis generator `yield` untuk pembersihan sumber daya (seperti sesi basis data), mekanisme *dependency caching* dalam satu siklus *request* (`use_cache=True`), serta cara mengganti dependensi saat pengujian otomatis dengan `app.dependency_overrides`.

## Materi pengganti

### 1. Konsep *Dependency Injection* (DI) Deklaratif di FastAPI

*Dependency Injection* adalah pola desain di mana sebuah fungsi rute menyatakan apa yang dibutuhkannya (misalnya sesi basis data, objek pengguna yang sedang login, atau parameter paginasi), dan kerangka kerja FastAPI bertugas menyediakan (*inject*) objek tersebut secara otomatis.

Sejak Python 3.9+ dan FastAPI modern, cara standar yang direkomendasikan adalah membungkus `Depends()` di dalam `typing.Annotated`. Dengan pola ini, Anda dapat membuat alias tipe yang dapat dipakai ulang di puluhan rute tanpa mengulang deklarasi `Depends()`:

```python
from typing import Annotated, AsyncGenerator
from fastapi import Depends, FastAPI, Header, HTTPException, status

app = FastAPI()

# 1. Dependensi dengan 'yield' untuk manajemen siklus hidup sumber daya
async def get_db_session() -> AsyncGenerator[dict, None]:
    db = {"connected": True, "tx_active": True}
    try:
        yield db  # Disuntikkan ke fungsi rute
    finally:
        # Selalu dijalankan setelah rute selesai (bahkan jika terjadi exception)
        db["connected"] = False

DBSessionDep = Annotated[dict, Depends(get_db_session)]

# 2. Sub-dependensi bertingkat (Nested Dependency)
async def verify_api_key(
    x_api_key: Annotated[str | None, Header()] = None,
) -> str:
    if x_api_key != "kunci-produksi-rahasia":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API Key tidak valid atau tidak disertakan.",
        )
    return x_api_key

async def get_current_client(
    api_key: Annotated[str, Depends(verify_api_key)],
    db: DBSessionDep,
) -> dict:
    return {"client_id": "mitra-01", "db_ready": db["connected"], "key": api_key}

CurrentClientDep = Annotated[dict, Depends(get_current_client)]

@app.get("/orders")
async def list_orders(client: CurrentClientDep, db: DBSessionDep) -> dict:
    # Meskipun get_db_session diminta oleh get_current_client DAN list_orders,
    # FastAPI hanya mengeksekusinya SATU KALI per request berkat caching bawaan!
    return {"client": client["client_id"], "same_session": db is not None}
```

### 2. Tingkat Pemasangan Dependensi dan Pengujian (`dependency_overrides`)

Selain pada parameter fungsi rute, dependensi juga dapat dipasang di berbagai tingkatan:

| Tingkat Pemasangan | Sintaks | Kegunaan Praktis |
| :--- | :--- | :--- |
| Parameter Fungsi | `client: CurrentClientDep` | Ketika nilai kembalian dependensi dibutuhkan di dalam badan fungsi. |
| Dekorator Rute | `@app.get("/admin", dependencies=[Depends(verify_api_key)])` | Ketika Anda hanya membutuhkan validasi/efek samping tanpa memakai nilai kembaliannya. |
| Tingkat `APIRouter` | `APIRouter(dependencies=[Depends(verify_api_key)])` | Mengamankan seluruh rute dalam satu modul domain sekaligus. |
| Tingkat Aplikasi | `FastAPI(dependencies=[Depends(log_request)])` | Menerapkan pemeriksaan global ke seluruh endpoint aplikasi. |

Saat menulis pengujian otomatis (*unit/integration test*), Anda dapat mengganti dependensi basis data produksi dengan tiruan (*mock/in-memory DB*) menggunakan `app.dependency_overrides[get_db_session] = get_test_db_session` tanpa mengubah satu baris pun kode rute.

## Sumber
- [FastAPI Documentation — Dependencies: First Steps](https://fastapi.tiangolo.com/tutorial/dependencies/)
- [FastAPI Documentation — Dependencies with yield](https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/)
- [FastAPI Documentation — Testing Dependencies with Overrides](https://fastapi.tiangolo.com/advanced/testing-dependencies/)
