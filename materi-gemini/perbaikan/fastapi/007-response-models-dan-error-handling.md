# Perbaikan: Response Models & Error Handling

- **Kelas:** fastapi
- **Modul:** 7
- **Jenis:** pengganti

## Yang kurang
Materi saat ini hanya 46 kata (berupa tiga poin ringkas dan satu kalimat). Belum ada penjelasan mendalam mengenai pemisahan skema input (`UserCreate`), model internal (`UserInDB`), dan skema output (`UserPublic`), penggunaan `response_model_exclude_unset=True`, struktur `HTTPException`, serta pembuatan *custom exception handler* terpusat di FastAPI.

## Materi pengganti

### 1. Mengapa Skema Input dan Output Harus Dipisahkan?

Dalam pengembangan REST API produksi, objek yang diterima dari pengguna (*request body*), objek yang disimpan di basis data, dan objek yang dikembalikan ke klien (*response payload*) hampir selalu memiliki atribut yang berbeda. Mengembalikan objek basis data secara langsung berisiko membocorkan kolom sensitif seperti `hashed_password`, token internal, atau catatan audit.

FastAPI memfasilitasi penyaringan otomatis melalui parameter `response_model` pada dekorator rute maupun anotasi tipe kembalian fungsi (`-> UserPublic`):

| Skema Pydantic | Peran dalam Siklus Request | Contoh Field yang Dimuat |
| :--- | :--- | :--- |
| `UserCreate` | Memvalidasi input pendaftaran dari klien | `email`, `full_name`, `password` (teks biasa) |
| `UserInDB` | Merepresentasikan baris penyimpanan internal | `id`, `email`, `full_name`, `hashed_password`, `is_active` |
| `UserPublic` | Menyaring data yang aman dikirim ke publik | `id`, `email`, `full_name`, `is_active` (tanpa sandi) |

### 2. Implementasi `response_model`, Kode Status HTTP, dan `HTTPException`

```python
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr

app = FastAPI()

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class UserPublic(BaseModel):
    id: int
    email: EmailStr
    full_name: str

# Simulasi penyimpanan di memori (menyimpan password_hash internal)
FAKE_DB: dict[int, dict] = {
    1: {
        "id": 1,
        "email": "budi@kodeloka.id",
        "full_name": "Budi Santoso",
        "hashed_password": "argon2id$v=19$m=65536,t=3,p=4$rahasia",
    }
}

@app.get(
    "/users/{user_id}",
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
)
async def get_user(user_id: int) -> dict:
    user = FAKE_DB.get(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pengguna dengan ID {user_id} tidak ditemukan.",
            headers={"X-Error-Code": "USER_NOT_FOUND"},
        )
    # Meskipun dictionary memuat 'hashed_password', FastAPI otomatis
    # membuang field yang tidak ada di UserPublic sebelum mengirim JSON!
    return user
```

### 3. Menangani Galat Domain dengan *Custom Exception Handler*

Daripada menulis blok `try...except` dan melempar `HTTPException` di dalam lapisan layanan (*service layer*), praktik terbaik adalah mendefinisikan *exception* domain murni Python lalu mendaftarkan *handler* global menggunakan `@app.exception_handler()`:

```python
SaldoTidakCukupError(Exception):
    def __init__(self, akun_id: str, kekurangan: int):
        self.akun_id = akun_id
        self.kekurangan = kekurangan

@app.exception_handler(SaldoTidakCukupError)
async def saldo_exception_handler(
    request: Request, exc: SaldoTidakCukupError
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "INSUFFICIENT_BALANCE",
            "message": f"Saldo akun {exc.akun_id} kurang Rp{exc.kekurangan}.",
            "path": request.url.path,
        },
    )
```

### 4. Kesalahan Umum yang Harus Dihindari

1. **Menggunakan satu kelas Pydantic untuk input sekaligus output:** Klien dapat membaca kembali field rahasia atau memodifikasi field internal (*mass assignment*).
2. **Menangkap `Exception` umum lalu mengembalikan HTTP `200 OK` berisi `{"error": "..."}`:** Ini merusak kontrak HTTP standar, membingungkan pemantauan metrik API Gateway, dan menggagalkan mekanisme *retry* klien.

## Sumber
- [FastAPI Documentation — Response Model / Return Type](https://fastapi.tiangolo.com/tutorial/response-model/)
- [FastAPI Documentation — Handling Errors](https://fastapi.tiangolo.com/tutorial/handling-errors/)
- [FastAPI Documentation — Response Status Code](https://fastapi.tiangolo.com/tutorial/response-status-code/)
