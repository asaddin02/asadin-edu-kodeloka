# Mengelola Data Formulir & Unggahan Berkas dengan `FormData` API

- **Tingkat:** Menengah
- **Ringkasan:** Mengekstrak seluruh nilai masukan formulir HTML dalam satu baris menggunakan konstruktor `new FormData(formElement)`, mengirim berkas (`multipart/form-data`) via `fetch()`, mengonversi `FormData` ke objek/URLSearchParams, serta memantau event `formdata`.

## Mengapa `new FormData(form)` Jauh Lebih Tangguh daripada Membaca `.value` Satu per Satu?

Pada formulir yang memiliki puluhan kontrol input (`<input>`, `<select>`, `<textarea>`, kotak centang berganda, hingga `<input type="file">`), mengambil nilai satu per satu dengan `document.querySelector("#kolom").value` sangat melelahkan dan rawan terlewat ketika ada kolom baru yang ditambahkan ke HTML.

Konstruktor bawaan **`new FormData(elemenForm, tombolSubmit)`** secara otomatis mengumpulkan seluruh kontrol formulir yang memiliki atribut **`name`** (dan tidak berstatus `disabled`) mengikuti algoritma resmi spesifikasi HTML, termasuk menyertakan nilai dari tombol submit spesifik yang diklik pengguna (`event.submitter`).

> **⚠️ Jebakan Umum di Lapangan:** Saat mengirim objek `FormData` sebagai `body` di dalam `fetch()`, jangan pernah mengatur header `'Content-Type': 'multipart/form-data'` secara manual! Jika Anda menulisnya manual, peramban tidak dapat menyisipkan string pembatas (`boundary=...`) yang wajib ada sehingga server gagal mengurai isi formulir.

## 1. Metode Utama Objek `FormData` dan Perbedaan `.set()` vs `.append()`

Objek `FormData` menyimpan daftar pasangan kunci-nilai di mana satu kunci yang sama boleh memiliki beberapa nilai (misalnya untuk `<input type="checkbox" name="minat">` atau `<input type="file" multiple>`):

| Metode / Ekspresi | Perilaku Teknis | Contoh Penggunaan |
| :--- | :--- | :--- |
| `new FormData(form, e.submitter)` | Mengumpulkan seluruh input bernama di dalam `form` + pasangan `name=value` dari `e.submitter`. | Di dalam handler `form.addEventListener("submit", ...)`. |
| `formData.get("kunci")` | Mengembalikan nilai **pertama** yang terkait dengan `"kunci"` (atau `null` jika tidak ada). | `const email = formData.get("email");` |
| `formData.getAll("kunci")` | Mengembalikan **array** berisi seluruh nilai untuk `"kunci"` (wajib dipakai untuk checkbox grup atau file `multiple`). | `const daftarBerkas = formData.getAll("lampiran");` |
| `formData.append("kunci", nilai)` | Menambahkan nilai baru ke `"kunci"` **tanpa menghapus** nilai lama yang sudah ada pada kunci tersebut. | Menambahkan beberapa berkas ke satu nama field. |
| `formData.set("kunci", nilai)` | **Menimpa** seluruh nilai lama pada `"kunci"` dengan satu nilai baru. | `formData.set("zona_waktu", "Asia/Jakarta");` |
| `Object.fromEntries(formData)` | Mengubah `FormData` menjadi objek JavaScript biasa (perhatian: hanya menyimpan nilai terakhir jika ada kunci ganda). | Mengonversi formulir teks sederhana menjadi JSON. |

## 2. Mengirim `FormData` dengan `fetch()` Tanpa Merusak Header `boundary`

Ketika Anda meneruskan instans `FormData` ke properti `body` pada `fetch()`, peramban secara otomatis menyusun tubuh permintaan berformat `multipart/form-data` dan membuat string pembatas unik untuk memisahkan tiap kolom/berkas, lalu mengatur header:
`Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW`

Jika Anda menimpa `headers: { "Content-Type": "multipart/form-data" }` secara manual, parameter `; boundary=...` akan hilang dan backend (seperti PHP `$_POST`/`$_FILES` atau FastAPI) tidak akan bisa memisahkan isi data Anda!

```javascript
const form = document.querySelector("#form-profil");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Parameter kedua meneruskan tombol submit yang diklik (mis. "simpan_draf" vs "terbitkan")
  const formData = new FormData(form, e.submitter);

  // JANGAN set header Content-Type secara manual untuk FormData!
  const res = await fetch("/api/profil", {
    method: "POST",
    body: formData
  });
  if (res.ok) console.log("Berhasil disimpan!");
});
```

## 3. Mengonversi `FormData` ke JSON atau Query String dan Event `formdata`

Apabila formulir Anda **tidak** memuat berkas (`<input type="file">`) dan endpoint API backend Anda mengharapkan format `application/json` atau `application/x-www-form-urlencoded`, Anda dapat mengonversi `FormData` dengan mudah:

```javascript
export function formDataKeObjekLengkap(formData) {
  const hasil = {};
  for (const kunci of new Set(formData.keys())) {
    const semuaNilai = formData.getAll(kunci);
    hasil[kunci] = semuaNilai.length > 1 ? semuaNilai : semuaNilai[0];
  }
  return hasil;
}

// Contoh: menyisipkan data tambahan lewat event 'formdata' bahkan pada submit HTML tradisional
document.querySelector("#form-feedback")?.addEventListener("formdata", (e) => {
  // e.formData dapat dimodifikasi tepat sebelum data dikirim oleh peramban
  e.formData.set("lebar_layar", String(window.innerWidth));
});
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menulis `headers: { "Content-Type": "multipart/form-data" }` secara manual saat `body: formData`:** Biarkan peramban mengatur header `Content-Type` beserta string `boundary`-nya secara otomatis.
2. **Memakai `Object.fromEntries(formData)` pada formulir yang memiliki `<input type="checkbox" name="topik">` multi-pilihan:** Karena objek JavaScript tidak bisa memiliki dua kunci bernama sama, `Object.fromEntries()` akan membuang semua centangan kecuali centangan terakhir! Gunakan `formData.getAll("topik")` atau fungsi `formDataKeObjekLengkap()` di atas.
3. **Bingung mengapa input tertentu bernilai `null` di `formData.get()`:** Periksa dua hal di HTML: apakah elemen `<input>` tersebut lupa diberi atribut **`name="..."`** (atribut `id` saja tidak dibaca oleh `FormData`!), atau apakah elemen tersebut sedang diberi atribut **`disabled`** (elemen `disabled` tidak disertakan dalam `FormData`; gunakan `readonly` jika nilainya tetap harus dikirim).

## Latihan Praktik Mandiri

1. Buat berkas `olah-form.mjs` yang mengekspor fungsi `bangunPayloadJsonDariFormData(formData)`: fungsi ini mengubah objek `FormData` menjadi objek JSON yang otomatis mempertahankan array apabila sebuah kunci memiliki lebih dari satu nilai (`getAll(kunci).length > 1`), serta menyaring objek `File` kosong (`file.size === 0`).
2. Buat pengujian otomatis dengan `node:test` menggunakan `new FormData()` (tersedia secara global di Node.js 20+), tambahkan kunci tunggal dengan `.set()` dan kunci ganda dengan `.append()`, lalu verifikasi hasil konversinya.

## Kuis Pemahaman

### Soal 1
Mengapa Anda **tidak boleh** menetapkan header `'Content-Type': 'multipart/form-data'` secara manual saat mengirim objek `FormData` melalui `fetch(url, { method: 'POST', body: formData })`?
- A. Karena `fetch()` hanya mengizinkan metode `GET` untuk `FormData`
- B. Karena penetapan header manual akan menimpa header otomatis peramban dan menghilangkan parameter wajib `; boundary=...` yang dibutuhkan server untuk memisahkan batas antar-kolom dan berkas
- C. Karena `FormData` secara otomatis menggunakan format XML
- D. Karena header `Content-Type` sudah dihapus dari spesifikasi HTTP/2 dan HTTP/3

**Jawaban Benar:** B
**Penjelasan:** Saat `body` berisi instans `FormData`, `fetch()` secara otomatis menghasilkan string pembatas unik dan menyetel `Content-Type: multipart/form-data; boundary=...`. Menulis header tersebut secara manual tanpa `boundary` yang cocok membuat server gagal mengurai *body* permintaan.

### Soal 2
Apa kegunaan dari parameter kedua (`submitter`) pada konstruktor `new FormData(formElement, e.submitter)` di dalam event `submit`?
- A. Menyertakan pasangan `name` dan `value` dari tombol `<button type="submit" name="aksi" value="draf">` spesifik yang diklik pengguna ke dalam data `FormData`
- B. Menonaktifkan tombol submit secara otomatis selama 5 detik
- C. Mengubah metode pengiriman formulir menjadi `PUT`
- D. Menghapus seluruh isi formulir setelah diambil

**Jawaban Benar:** A
**Penjelasan:** Sebuah `<form>` dapat memiliki lebih dari satu tombol submit (misalnya tombol *"Simpan Draf"* dan *"Terbitkan"*). Meneruskan `e.submitter` sebagai argumen kedua memastikan nilai tombol yang memicu pengiriman ikut masuk ke dalam `FormData`.

### Soal 3
Metode manakah pada objek `FormData` yang harus digunakan untuk mengambil seluruh nilai dari sekelompok kotak centang `<input type="checkbox" name="bahasa" value="...">` yang memiliki atribut `name` yang sama?
- A. `formData.get("bahasa")`
- B. `formData.getAll("bahasa")`
- C. `formData.has("bahasa")`
- D. `Object.fromEntries(formData).bahasa`

**Jawaban Benar:** B
**Penjelasan:** `formData.get("bahasa")` hanya mengembalikan nilai pertama, dan `Object.fromEntries()` hanya menyisakan nilai terakhir. Untuk mendapatkan seluruh nilai yang dicentang sebagai array, gunakan `formData.getAll("bahasa")`.

## Sumber

- [`FormData` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [Using FormData objects — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_FormData_Objects)
