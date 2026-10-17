# Validasi Lanjutan Pydantic v2: `ConfigDict`, `@field_validator`, dan `@model_validator`

- **Letak:** sesudah modul 5
- **Tingkat:** Menengah
- **Ringkasan:** Menerapkan arsitektur validasi Pydantic v2 berkinerja tinggi di FastAPI menggunakan `ConfigDict`, `@field_validator`, `@model_validator`, dan `@computed_field` untuk menggantikan sintaks Pydantic v1 yang telah usang.

## Mengapa Wajib Beralih ke Pola Pydantic v2?

Kelas FastAPI modern berjalan di atas mesin **Pydantic v2** yang intinya (`pydantic-core`) ditulis ulang menggunakan bahasa Rust sehingga validasi skema JSON berlangsung hingga 5–50 kali lebih cepat. Namun, banyak basis kode masih mencampur sintaks warisan Pydantic v1 seperti `class Config:`, `@validator`, dan `.dict()` yang memicu peringatan *deprecation* dan telah dijadwalkan untuk dihapus.

## 1. Perbandingan Sintaks Pydantic v1 vs Pydantic v2

| Fitur Skema | Sintaks Lama (Pydantic v1 — *Deprecated*) | Sintaks Standar (Pydantic v2) |
| :--- | :--- | :--- |
| Konfigurasi model | `class Config: orm_mode = True` | `model_config = ConfigDict(from_attributes=True)` |
| Validasi satu field | `@validator(" kode")` | `@field_validator("kode", mode="after")` |
| Validasi lintas field | `@root_validator` | `@model_validator(mode="after")` |
| Konversi model ke `dict` / JSON | `obj.dict()` / `obj.json()` | `obj.model_dump()` / `obj.model_dump_json()` |
| Validasi objek ORM / dict | `Model.from_orm(row)` / `Model.parse_obj(d)` | `Model.model_validate(row)` |

## 2. Implementasi Lengkap: `ConfigDict`, `@field_validator`, dan `@model_validator`

Dalam aplikasi pemesanan tiket atau transaksi keuangan, kita sering membutuhkan normalisasi string pada satu field sekaligus pemeriksaan aturan bisnis yang melibatkan dua field berbeda (misalnya `tanggal_selesai` harus setelah `tanggal_mulai`):

```python
from datetime import date
from typing import Self
from fastapi import FastAPI
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    computed_field,
    field_validator,
    model_validator,
)

app = FastAPI()

class BuatKuponRequest(BaseModel):
    # Menolak field tak dikenal (extra='forbid') dan memangkas spasi otomatis
    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
        from_attributes=True,
    )

    kode_kupon: str = Field(min_length=4, max_length=20)
    diskon_persen: int = Field(ge=1, le=90)
    tanggal_mulai: date
    tanggal_selesai: date

    @field_validator("kode_kupon", mode="after")
    @classmethod
    def normalisasi_kode(cls, v: str) -> str:
        kode = v.upper()
        if not kode.isalnum():
            raise ValueError("Kode kupon hanya boleh berisi huruf dan angka.")
        return kode

    @model_validator(mode="after")
    def periksa_rentang_tanggal(self) -> Self:
        if self.tanggal_selesai < self.tanggal_mulai:
            raise ValueError(
                "tanggal_selesai tidak boleh lebih awal dari tanggal_mulai."
            )
        return self

    @computed_field
    @property
    def durasi_hari(self) -> int:
        return (self.tanggal_selesai - self.tanggal_mulai).days + 1

@app.post("/kupon")
async def buat_kupon(payload: BuatKuponRequest) -> dict:
    # model_dump() otomatis menyertakan @computed_field (durasi_hari)
    return payload.model_dump()
```

## 3. Memilih `mode="before"` vs `mode="after"` pada Validator

1. **`mode="after"` (Bawaan & Paling Aman):** Dijalankan **setelah** Pydantic memastikan tipe data dasarnya benar (misalnya input sudah pasti berupa `str` atau `int`). Gunakan mode ini untuk aturan bisnis domain.
2. **`mode="before"`:** Dijalankan pada data mentah sebelum konversi tipe Pydantic. Nilai yang masuk bisa berupa tipe apa saja (`Any`), sehingga Anda wajib memeriksa tipenya (`isinstance(...)`) sebelum memanipulasinya.

## Kuis Pemahaman

### Soal 1
Deklarasi konfigurasi manakah yang digunakan pada Pydantic v2 untuk mengizinkan pembacaan atribut langsung dari objek model SQLAlchemy ORM dan menolak field tambahan yang tidak terdaftar di skema?
- A. `class Config: orm_mode = True; allow_extra = False`
- B. `model_config = ConfigDict(from_attributes=True, extra="forbid")`
- C. `__pydantic_config__ = {"orm": True, "strict": True}`
- D. `@validator_config(orm_mode=True)`

**Jawaban Benar:** B
**Penjelasan:** Di Pydantic v2, `class Config` digantikan oleh atribut kelas `model_config = ConfigDict(...)`, di mana `from_attributes=True` menggantikan `orm_mode=True` dan `extra="forbid"` menolak field asing di dalam JSON input.

### Soal 2
Dekorator manakah yang tepat digunakan untuk memvalidasi aturan yang membandingkan nilai dua field berbeda setelah kedua field tersebut dikonversi tipenya (misalnya memastikan `harga_diskon < harga_normal`)?
- A. `@field_validator("harga_diskon", mode="before")`
- B. `@computed_field`
- C. `@model_validator(mode="after")`
- D. `@ConfigDict(validate_all=True)`

**Jawaban Benar:** C
**Penjelasan:** `@model_validator(mode="after")` menerima instans `self` yang seluruh field-nya sudah tervalidasi tipenya, sehingga Anda dapat membandingkan `self.harga_diskon` dan `self.harga_normal` secara langsung dan aman.

### Soal 3
Metode manakah yang menggantikan `model.dict()` dan `Model.parse_obj(data)` pada Pydantic v2?
- A. `model.to_json()` dan `Model.from_json(data)`
- B. `model.model_dump()` dan `Model.model_validate(data)`
- C. `model.serialize()` dan `Model.deserialize(data)`
- D. `dict(model)` dan `Model.load(data)`

**Jawaban Benar:** B
**Penjelasan:** Pydantic v2 menyeragamkan seluruh metode internal dengan awalan `model_*` untuk menghindari bentrokan dengan nama field milik pengguna: `model_dump()` menggantikan `.dict()` dan `model_validate()` menggantikan `.parse_obj()` / `.from_orm()`.

## Sumber
- [Pydantic v2 Documentation — Migration Guide](https://docs.pydantic.dev/latest/migration/)
- [Pydantic v2 Documentation — Validators (`@field_validator` & `@model_validator`)](https://docs.pydantic.dev/latest/concepts/validators/)
