# Perbaikan: Automated Testing dengan Pytest & TestClient

- **Kelas:** fastapi
- **Modul:** 22
- **Jenis:** pengganti

## Yang kurang
Materi saat ini hanya 48 kata. Belum menjelaskan cara menguji aplikasi FastAPI secara sinkron menggunakan `TestClient` maupun secara asinkron penuh menggunakan `httpx.AsyncClient` + `ASGITransport`, cara memakai `app.dependency_overrides` di dalam *fixture* Pytest, serta pengujian siklus hidup (`lifespan`).

## Materi pengganti

### 1. Dua Pendekatan Pengujian di FastAPI: `TestClient` vs `httpx.AsyncClient`

FastAPI dibangun di atas standar ASGI (*Asynchronous Server Gateway Interface*), sehingga Anda dapat menguji seluruh rute dan *middleware* langsung di memori tanpa perlu menjalankan proses server Uvicorn pada port jaringan:

1. **`TestClient` (Sinkron):** Membungkus `httpx` untuk pengujian cepat menggunakan fungsi `def test_...()` biasa. Jika Anda membutuhkan eksekusi *lifespan event* (`startup`/`shutdown`), gunakan `with TestClient(app) as client:`.
2. **`httpx.AsyncClient` dengan `ASGITransport` (Asinkron Murni):** Digunakan bersama `pytest` + `anyio` (`@pytest.mark.anyio`) ketika pengujian Anda harus berbagi *event loop* asinkron yang sama dengan *driver* basis data asinkron seperti SQLAlchemy `AsyncSession`.

### 2. Contoh Lengkap Pengujian dengan `dependency_overrides` dan `ASGITransport`

```python
import pytest
from httpx import ASGITransport, AsyncClient
from fastapi import Depends, FastAPI, status
from fastapi.testclient import TestClient

app = FastAPI()

async def get_settings() -> dict:
    return {"env": "production", "max_items": 10}

@app.get("/config")
async def read_config(cfg: dict = Depends(get_settings)) -> dict:
    return cfg

# --- 1. Pengujian Sinkron dengan TestClient & Dependency Override ---
def test_read_config_with_override():
    async def mock_settings() -> dict:
        return {"env": "testing", "max_items": 99}

    app.dependency_overrides[get_settings] = mock_settings
    try:
        with TestClient(app) as client:
            response = client.get("/config")
            assert response.status_code == status.HTTP_200_OK
            assert response.json() == {"env": "testing", "max_items": 99}
    finally:
        # Wajib dibersihkan agar tidak mencemari test berikutnya!
        app.dependency_overrides.clear()

# --- 2. Pengujian Asinkron Murni dengan httpx.AsyncClient ---
@pytest.mark.anyio
async def test_read_config_async():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/config")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["env"] == "production"
```

### 3. Kesalahan Umum dalam Pengujian FastAPI

1. **Lupa memanggil `app.dependency_overrides.clear()` setelah pengujian:** *Override* dari satu fungsi uji akan bocor ke fungsi uji lainnya dan menyebabkan hasil uji tidak deterministik.
2. **Memakai `AsyncClient(app=app)` yang sudah *deprecated* di HTTPX terbaru:** Di `httpx >= 0.28`, argumen `app=` pada `AsyncClient` telah dihapus; selalu gunakan `ASGITransport(app=app)`.

## Sumber
- [FastAPI Documentation — Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [FastAPI Documentation — Async Tests (`httpx.AsyncClient` & `ASGITransport`)](https://fastapi.tiangolo.com/advanced/async-tests/)
- [FastAPI Documentation — Testing Dependencies with Overrides](https://fastapi.tiangolo.com/advanced/testing-dependencies/)
