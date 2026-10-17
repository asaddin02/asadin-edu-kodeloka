# Perbaikan: Authentication & Authorization dengan JWT Tokens

- **Kelas:** fastapi
- **Modul:** 14
- **Jenis:** pengganti

## Yang kurang
Materi saat ini hanya 40 kata. Belum memuat implementasi pembuatan dan verifikasi token JWT dengan `PyJWT` (`jwt`), penggunaan `OAuth2PasswordBearer`, validasi klaim waktu kedaluwarsa (`exp` dengan zona waktu UTC), pembedaan autentikasi (`401 Unauthorized`) dari otorisasi berbasis peran (`403 Forbidden`), serta peringatan untuk tidak memakai pustaka `python-jose` yang sudah tidak terawat.

## Materi pengganti

### 1. Anatomi JSON Web Token (JWT) dan Standar `PyJWT`

Dalam dokumentasi resmi FastAPI terbaru, pembuatan dan verifikasi JWT menggunakan pustaka **`PyJWT`** (`import jwt`), menggantikan `python-jose` yang sudah tidak aktif dikembangkan. Sebuah JWT terdiri atas tiga bagian yang dipisahkan titik (`Header.Payload.Signature`):

1. **Header:** Memuat algoritma tanda tangan kriptografi (misalnya `HS256` atau `RS256`).
2. **Payload (Claims):** Memuat identitas subjek (`sub`), waktu kedaluwarsa (`exp` dalam UTC), dan cakupan izin (`scopes` / `role`). Jangan pernah menaruh data rahasia di dalam *payload* karena *payload* hanya dikodekan dengan Base64URL (dapat dibaca siapa saja), bukan dienkripsi.
3. **Signature:** Tanda tangan kriptografi yang memastikan *payload* tidak dimodifikasi oleh pihak luar.

### 2. Implementasi Lengkap: Pembuatan, Verifikasi, dan Role-Based Access Control (RBAC)

```python
from datetime import datetime, timedelta, timezone
from typing import Annotated
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

SECRET_KEY = "ganti-dengan-output-openssl-rand-hex-32-dari-env"
ALGORITHM = "HS256"

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

class TokenUser(BaseModel):
    username: str
    role: str

def create_access_token(username: str, role: str, expires_minutes: int = 15) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    payload = {"sub": username, "role": role, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
) -> TokenUser:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token autentikasi tidak valid atau telah kedaluwarsa.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Wajib menetapkan algorithms=[ALGORITHM] secara eksplisit
        # untuk mencegah serangan algorithm confusion ("none")!
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str | None = payload.get("sub")
        role: str = payload.get("role", "member")
        if username is None:
            raise credentials_error
        return TokenUser(username=username, role=role)
    except InvalidTokenError:
        raise credentials_error

def require_role(allowed_role: str):
    async def role_checker(
        user: Annotated[TokenUser, Depends(get_current_user)],
    ) -> TokenUser:
        if user.role != allowed_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Akses ditolak: membutuhkan peran '{allowed_role}'.",
            )
        return user
    return role_checker

@app.delete("/admin/users/{target_username}")
async def delete_user(
    target_username: str,
    admin: Annotated[TokenUser, Depends(require_role("admin"))],
) -> dict:
    return {"deleted": target_username, "by_admin": admin.username}
```

### 3. Praktik Terbaik Keamanan JWT di Produksi

| Aspek Keamanan | Praktik yang Benar | Risiko Jika Diabaikan |
| :--- | :--- | :--- |
| Durasi *Access Token* | Pendek (`15–30` menit), dipadukan dengan *Refresh Token* yang dapat dicabut (*revocable*) | Token yang dicuri tetap aktif berhari-hari tanpa bisa dibatalkan. |
| Parameter `algorithms` pada `jwt.decode()` | Selalu berikan daftar eksplisit `algorithms=["HS256"]` | Rentan terhadap manipulasi header `alg: none` atau *key confusion*. |
| Kode Status HTTP | `401 Unauthorized` bila token absen/rusak; `403 Forbidden` bila token sah tetapi peran tidak berhak | Klien frontend salah mengarahkan pengguna ke halaman login padahal masalahnya adalah izin peran. |

## Sumber
- [FastAPI Documentation — OAuth2 with Password (and hashing), Bearer with JWT tokens](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/)
- [PyJWT Official Documentation](https://pyjwt.readthedocs.io/en/stable/)
