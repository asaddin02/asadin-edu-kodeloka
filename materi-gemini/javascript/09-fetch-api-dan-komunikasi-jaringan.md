# Fetch API, Pengolahan JSON, `URLSearchParams`, dan `AbortController`

- **Tingkat:** Menengah
- **Ringkasan:** Mengambil dan mengirim data melalui HTTP menggunakan `fetch()`, memahami mengapa `response.ok` wajib diperiksa secara eksplisit, menyusun parameter URL dengan `URLSearchParams`, serta membatalkan permintaan lambat dengan `AbortController` dan `AbortSignal.timeout()`.

## 1. Cara Kerja `fetch()` dan Mengapa Butuh Dua Kali `await`

**Fetch API** adalah standar modern di peramban maupun runtime server (Node.js 18+) untuk melakukan permintaan jaringan HTTP berbasis `Promise`.

Hal pertama yang sering membingungkan pemula adalah mengapa mengambil data dengan `fetch()` membutuhkan **dua kali `await`**:

```js
async function ambilDaftarKelas() {
  // await pertama: Menunggu HEADER respons HTTP tiba dari server (status 200, Content-Type, dsb.)
  const respons = await fetch("https://kodeloka.asadinedu.com/data/catalog.json");

  // Wajib periksa apakah kode status berada di rentang sukses 200–299!
  if (!respons.ok) {
    throw new Error(`Permintaan gagal dengan status HTTP ${respons.status}`);
  }

  // await kedua: Menunggu aliran isi BODY selesai diunduh dan diurai sebagai objek JSON
  const data = await respons.json();
  return data;
}
```

### Jebakan Paling Umum: `fetch()` TIDAK Melempar Galat pada Status `404` atau `500`!
Berbeda dengan beberapa pustaka pihak ketiga, `fetch()` **hanya** akan menolak (*reject*) `Promise`-nya apabila terjadi **kegagalan jaringan tingkat bawah** (misalnya perangkat pengguna terputus dari internet, resolusi DNS gagal, atau permintaan dibatalkan).

Jika server membalas dengan kode status **`404 Not Found`**, **`401 Unauthorized`**, atau **`500 Internal Server Error`**, `fetch()` menganggap komunikasi jaringan berhasil dan **tetap me-*resolve* Promise menjadi objek `Response`** (dengan `respons.ok` bernilai `false`)! Oleh karena itu, selalu tulis pemeriksaan **`if (!respons.ok)`** sebelum memanggil `await respons.json()`.

## 2. Mengirim Data dengan `POST`, Header, dan `FormData`

### A. Mengirim Payload JSON (`Content-Type: application/json`)
Ketika mengirim objek JavaScript sebagai JSON melalui metode `POST`, `PUT`, atau `PATCH`, Anda harus mengubah objek menjadi string menggunakan `JSON.stringify()` dan mencantumkan header `Content-Type: application/json`:

```js
async function simpanProgresModul(idModul, skorKuis) {
  const respons = await fetch("/api/progres", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      modul_id: idModul,
      skor: skorKuis,
      waktu: new Date().toISOString()
    })
  });

  if (!respons.ok) {
    const rincianGalat = await respons.json().catch(() => null);
    throw new Error(rincianGalat?.pesan ?? `Gagal menyimpan (HTTP ${respons.status})`);
  }

  return await respons.json();
}
```

### B. Mengirim Formulir atau Berkas dengan `FormData`
Jika Anda mengambil data langsung dari elemen `<form>` di HTML (termasuk unggahan berkas `<input type="file">`), gunakan objek **`FormData`**:

```js
async function kirimFormulirPendaftaran(elemenForm) {
  const dataForm = new FormData(elemenForm);

  const respons = await fetch("/api/pendaftaran", {
    method: "POST",
    // PENTING: JANGAN mengatur header Content-Type secara manual saat mengirim FormData!
    // Peramban otomatis mengatur Content-Type: multipart/form-data beserta string 'boundary' uniknya.
    body: dataForm
  });

  if (!respons.ok) throw new Error(`Gagal mengirim formulir: ${respons.status}`);
  return await respons.json();
}
```

## 3. Merangkai Parameter Query Secara Aman dengan `URL` dan `URLSearchParams`

Jangan pernah menyambung parameter URL secara manual dengan string template seperti `` `/api/cari?q=${kataKunci}` ``! Jika pengguna mengetik kata kunci `"C++ & Go"`, karakter `&` dan `+` akan merusak struktur parameter URL Anda.

Gunakan antarmuka standar **`URL`** dan **`URLSearchParams`** yang otomatis mengodekan karakter khusus (*URL-encoding*) dengan aman:

```js
function buatUrlPencarian(kataKunci, bidang = "semua", halaman = 1) {
  const url = new URL("https://kodeloka.asadinedu.com/api/kelas");
  url.searchParams.set("q", kataKunci);
  url.searchParams.set("bidang", bidang);
  url.searchParams.set("page", String(halaman));

  return url.toString();
}

console.log(buatUrlPencarian("Git & CI/CD", "infra", 1));
// Keluaran aman: "https://kodeloka.asadinedu.com/api/kelas?q=Git+%26+CI%2FCD&bidang=infra&page=1"
```

## 4. Membatalkan Permintaan dan Mengatur Batas Waktu (`AbortController` & `AbortSignal.timeout`)

Tanpa batas waktu (*timeout*), permintaan `fetch()` ke server yang sedang macet dapat menggantung selama lebih dari satu menit. Selain itu, pada fitur pencarian langsung (*live search*), ketika pengguna mengetik huruf baru, permintaan pencarian dari huruf sebelumnya harus dibatalkan agar balasannya yang terlambat tidak menimpa hasil terbaru (*race condition*).

### A. Batas Waktu Otomatis Satu Baris dengan `AbortSignal.timeout()`
Sejak 2023 (status **Baseline Widely Available**), Anda tidak perlu lagi membuat `setTimeout` manual untuk membatalkan `fetch()`. Cukup pasang **`signal: AbortSignal.timeout(milidetik)`**:

```js
async function ambilDataDenganBatasWaktu(url, batasMs = 5000) {
  try {
    const respons = await fetch(url, {
      signal: AbortSignal.timeout(batasMs)
    });
    if (!respons.ok) throw new Error(`Status HTTP: ${respons.status}`);
    return await respons.json();
  } catch (err) {
    if (err.name === "TimeoutError") {
      throw new Error(`Permintaan ke server melebihi batas waktu ${batasMs} ms.`);
    }
    if (err.name === "AbortError") {
      throw new Error("Permintaan dibatalkan oleh pengguna.");
    }
    throw err;
  }
}
```

### B. Pembatalan Manual untuk *Live Search* dengan `AbortController`

```js
let pengendaliAktif = null;

async function cariMateriLangsung(kataKunci) {
  // Jika masih ada permintaan sebelumnya yang belum selesai, batalkan sekarang!
  if (pengendaliAktif) {
    pengendaliAktif.abort();
  }

  pengendaliAktif = new AbortController();

  const url = new URL("/api/materi", window.location.origin);
  url.searchParams.set("q", kataKunci);

  const respons = await fetch(url, {
    signal: pengendaliAktif.signal
  });
  if (!respons.ok) throw new Error(`HTTP ${respons.status}`);
  return await respons.json();
}
```

## Latihan Praktik: Klien HTTP Tangguh dengan `URLSearchParams` dan Timeout

Buatlah berkas `klien-api.js` yang mengekspor fungsi `ambilModul(filterObjek, timeoutMs = 4000)`:
1. Gunakan `new URLSearchParams(filterObjek)` untuk merangkai parameter query dengan aman.
2. Panggil `fetch()` dengan `signal: AbortSignal.timeout(timeoutMs)` dan header `Accept: application/json`.
3. Periksa `respons.ok` dan tangani pembedaan antara `TimeoutError` dan galat HTTP biasa secara rapi.

## Kuis Pemahaman

### Soal 1
Apa yang terjadi ketika `await fetch("/api/data-rahasia")` menerima balasan dari server dengan kode status **`403 Forbidden`**?
- A. `fetch()` langsung melempar galat yang masuk ke blok `catch`.
- B. `fetch()` tetap berhasil (*fulfilled*) dan mengembalikan objek `Response` dengan properti `response.status === 403` dan `response.ok === false`.
- C. `fetch()` secara otomatis mengulang permintaan sebanyak 3 kali.
- D. `fetch()` mengembalikan nilai `null`.

**Jawaban Benar:** B
**Penjelasan:** `fetch()` hanya menolak (*reject*) Promise jika terjadi kegagalan jaringan atau pembatalan request. Semua balasan HTTP yang valid dari server (termasuk kode 4xx dan 5xx) menghasilkan objek `Response` yang *fulfilled*, sehingga kita wajib memeriksa `if (!response.ok)`.

### Soal 2
Mengapa Anda **tidak boleh** menetapkan header `"Content-Type": "multipart/form-data"` secara manual di dalam opsi `headers` ketika mengirim objek `FormData` melalui `fetch()`?
- A. Karena `FormData` hanya boleh dikirim menggunakan metode `GET`.
- B. Karena peramban perlu menghasilkan dan menyisipkan parameter wajib `boundary=...` yang unik pada header `Content-Type`; jika Anda menimpanya secara manual tanpa string *boundary* yang cocok, server tidak akan bisa memisahkan bagian-bagian berkas di dalamnya.
- C. Karena `fetch()` tidak mendukung pengiriman objek `FormData`.
- D. Karena `multipart/form-data` otomatis mengubah berkas menjadi teks JSON.

**Jawaban Benar:** B
**Penjelasan:** Saat `body` diisi dengan instans `FormData`, peramban secara otomatis menyusun header lengkap seperti `Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW`. Menimpa header tersebut secara manual akan menghilangkan informasi `boundary` tersebut.

### Soal 3
Cara manakah yang paling ringkas dan modern (Baseline Widely Available) untuk membatalkan permintaan `fetch(url)` secara otomatis apabila server tidak merespons dalam waktu 3 detik (`3000 ms`)?
- A. `fetch(url, { timeout: 3000 })`
- B. `fetch(url, { signal: AbortSignal.timeout(3000) })`
- C. `fetch(url, { maxWait: "3s" })`
- D. `window.stopFetch(3000)`

**Jawaban Benar:** B
**Penjelasan:** Opsi `fetch()` tidak memiliki properti `timeout` langsung, melainkan menerima objek `AbortSignal` pada properti `signal`. Metode statis `AbortSignal.timeout(3000)` membuat sinyal yang otomatis membatalkan permintaan dengan `TimeoutError` setelah 3000 milidetik.

## Sumber
- [Using the Fetch API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Fetch API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [`Response` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Response)
