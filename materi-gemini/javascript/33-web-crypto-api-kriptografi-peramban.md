# Kriptografi Sisi Klien dengan Web Crypto API (`crypto.randomUUID`, `crypto.subtle`)

- **Tingkat:** Lanjut
- **Ringkasan:** Menghasilkan pengenal unik kriptografis (`crypto.randomUUID()`), nilai acak aman (`crypto.getRandomValues()`), menghitung digest hash SHA-256, menandatangani pesan HMAC, serta mengenkripsi data dengan AES-GCM menggunakan **`crypto.subtle`**.

## Mengapa `Math.random()` Dilarang Keras untuk Keamanan dan Kriptografi?

Fungsi `Math.random()` dirancang hanya untuk keperluan simulasi visual atau gim karena algoritmanya (*pseudo-random number generator* seperti xorshift128+) bersifat deterministik: jika penyerang mengetahui beberapa keluaran berurutan dari `Math.random()`, ia dapat menebak angka berikutnya maupun angka sebelumnya!

Untuk operasi yang menyangkut keamanan—seperti membuat ID sesi, kode verifikasi, *nonce*/IV enkripsi, atau kunci kriptografi—peramban dan runtime server modern menyediakan **Web Crypto API (`globalThis.crypto`)** yang terhubung langsung ke sumber entropi perangkat keras sistem operasi (*Cryptographically Secure Pseudo-Random Number Generator* / CSPRNG).

> **⚠️ Jebakan Umum di Lapangan:** Menggunakan `Math.random()` untuk menghasilkan token sesi, kode OTP, ID unik keamanan, atau kunci kriptografi sangat berbahaya karena `Math.random()` bukan pembangkit angka acak yang aman secara kriptografis (CSPRNG); wajib gunakan `crypto.getRandomValues()` atau `crypto.randomUUID()`.

## 1. Peta Operasi Utama pada `crypto` dan `crypto.subtle`

Objek global `crypto` menyediakan dua metode sinkron untuk nilai acak dan satu sub-objek **`crypto.subtle`** (*SubtleCrypto*, hanya tersedia di *Secure Context* HTTPS / `localhost` dan Web Workers) yang seluruh metodenya bersifat asinkron (`Promise`):

| Metode Web Crypto API | Sifat | Kegunaan Utama di Produksi |
| :--- | :--- | :--- |
| **`crypto.randomUUID()`** | Sinkron | Menghasilkan string UUID versi 4 standar RFC 4122 (contoh: `"36b8f84d-df4e-4d49-b662-bcde71a8764f"`). |
| **`crypto.getRandomValues(typedArray)`** | Sinkron | Mengisi `Uint8Array` / `Uint32Array` (maks. 65.536 byte) dengan byte acak kriptografis (untuk *salt*, *nonce*, atau IV). |
| **`crypto.subtle.digest("SHA-256", data)`** | Asinkron (`Promise<ArrayBuffer>`) | Menghitung sidik jari hash satu arah (`SHA-256`, `SHA-384`, `SHA-512`) untuk integritas berkas atau tantangan PKCE. |
| **`crypto.subtle.sign()` & `verify()`** | Asinkron | Membuat dan memverifikasi tanda tangan digital (HMAC, RSASSA-PKCS1-v1_5, ECDSA, atau Ed25519). |
| **`crypto.subtle.encrypt()` & `decrypt()`** | Asinkron | Mengenkripsi dan mendekripsi data secara terautentikasi (direkomendasikan menggunakan algoritma **`AES-GCM`**). |

## 2. Menghasilkan UUID, Hash SHA-256, dan Enkripsi Terautentikasi `AES-GCM`

Berikut adalah implementasi pembuatan UUID v4, penghitungan hash SHA-256 dalam format heksadesimal, serta enkripsi dan dekripsi data menggunakan **AES-GCM 256-bit** dengan *Initialization Vector* (IV) 12-byte unik:

```javascript
// 1. Menghasilkan UUID v4 kriptografis bawaan
const idSesi = crypto.randomUUID();

// 2. Menghitung Hash SHA-256 (Hex) menggunakan SubtleCrypto
export async function hitungSha256Hex(teks) {
  const dataByte = new TextEncoder().encode(teks);
  const bufferHash = await crypto.subtle.digest("SHA-256", dataByte);
  return Array.from(new Uint8Array(bufferHash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// 3. Enkripsi dan Dekripsi Terautentikasi dengan AES-GCM (256-bit)
export async function buatKunciAesGcm() {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    false, // extractable: false agar kunci mentah tidak bisa diekspor keluar dari memori CryptoKey
    ["encrypt", "decrypt"]
  );
}

export async function enkripsiAesGcm(kunciCrypto, teksRahasia) {
  // AES-GCM wajib memakai IV 12 byte (96 bit) yang selalu baru di setiap panggilan enkripsi!
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const dataMasuk = new TextEncoder().encode(teksRahasia);
  const bufferCipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    kunciCrypto,
    dataMasuk
  );
  return { iv, ciphertext: new Uint8Array(bufferCipher) };
}

export async function dekripsiAesGcm(kunciCrypto, iv, ciphertext) {
  const bufferPlain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    kunciCrypto,
    ciphertext
  );
  return new TextDecoder().decode(bufferPlain);
}
```

## 3. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan ulang *Initialization Vector* (IV) yang sama pada kunci `AES-GCM` yang sama (*Nonce Reuse Catastrophe*):** Pada algoritma `AES-GCM`, menggunakan pasangan `(kunci, iv)` yang sama untuk mengenkripsi dua pesan berbeda akan menghancurkan keamanan enkripsi dan membocorkan kunci autentikasi! Selalu bangkitkan IV 12-byte baru dengan `crypto.getRandomValues(new Uint8Array(12))` pada setiap operasi `encrypt()`.
2. **Menyangka `SHA-256` saja aman untuk menyimpan kata sandi pengguna:** `SHA-256` dirancang agar sangat cepat dihitung, sehingga penyerang dengan GPU modern dapat menebak miliaran kata sandi per detik. Untuk menurunkan kunci dari kata sandi di sisi klien, gunakan **`PBKDF2`** di `crypto.subtle.deriveKey()` dengan ratusan ribu iterasi dan *salt* acak (dan gunakan Argon2id di sisi server).
3. **Menyetel `extractable: true` pada `generateKey()` padahal kunci tidak perlu diekspor:** Jika kunci hanya dipakai di dalam sesi peramban atau disimpan di IndexedDB sebagai objek `CryptoKey`, setel `extractable: false` agar skrip berbahaya sekalipun tidak dapat memanggil `crypto.subtle.exportKey()` untuk membaca byte kunci mentahnya.

## Latihan Praktik Mandiri

1. Buat berkas `kripto-util.mjs` yang mengekspor fungsi `buatTokenAcakHex(jumlahByte = 32)` menggunakan `crypto.getRandomValues()`, serta pasangan `enkripsiAesGcm` dan `dekripsiAesGcm`.
2. Tulis pengujian otomatis menggunakan `node:test` yang memverifikasi bahwa teks yang dienkripsi dapat didekripsi kembali dengan tepat, dan apabila 1 byte pada `ciphertext` diubah secara paksa (`ciphertext[0] ^= 1`), pemanggilan `dekripsiAesGcm` langsung menolak Promise (membuktikan integritas autentikasi AES-GCM!).

## Kuis Pemahaman

### Soal 1
Mengapa penggunaan `Math.random()` untuk membuat token reset kata sandi, kode OTP, atau *nonce* kriptografi sangat berbahaya di lingkungan produksi?
- A. Karena `Math.random()` hanya menghasilkan angka bulat negatif
- B. Karena `Math.random()` menggunakan algoritma pembangkit angka semu yang tidak aman secara kriptografis (bukan CSPRNG) sehingga pola keluarannya dapat ditebak oleh penyerang; wajib gunakan `crypto.getRandomValues()` atau `crypto.randomUUID()`
- C. Karena `Math.random()` memblokir utas utama selama 1 detik
- D. Karena `Math.random()` membutuhkan izin lokasi pengguna

**Jawaban Benar:** B
**Penjelasan:** `Math.random()` tidak mengambil entropi kriptografis dan status internalnya dapat direkonstruksi dari serangkaian keluaran. Web Crypto API menyediakan `crypto.getRandomValues()` dan `crypto.randomUUID()` yang dijamin aman secara kriptografis.

### Soal 2
Saat mengenkripsi data menggunakan `crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data)`, aturan apakah yang **wajib** dipatuhi terkait parameter `iv` (*Initialization Vector*)?
- A. `iv` harus selalu berisi 12 byte bernilai nol (`new Uint8Array(12)`) untuk semua pesan
- B. `iv` (standarnya berukuran 12 byte / 96 bit untuk AES-GCM) **tidak boleh pernah digunakan ulang** untuk pesan berbeda dengan kunci yang sama; selalu bangkitkan `iv` baru menggunakan `crypto.getRandomValues(new Uint8Array(12))` pada setiap enkripsi
- C. `iv` harus dirahasiakan dan tidak boleh dikirim bersama *ciphertext*
- D. `iv` harus berupa string teks sepanjang 100 karakter

**Jawaban Benar:** B
**Penjelasan:** Keamanan AES-GCM bergantung mutlak pada keunikan nilai `iv` (nonce) untuk setiap enkripsi di bawah kunci yang sama. `iv` tidak bersifat rahasia (boleh disimpan/dikirim berdampingan dengan *ciphertext*), tetapi wajib selalu unik.

### Soal 3
Apa tujuan menyetel argumen `extractable` menjadi `false` saat memanggil `crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"])`?
- A. Membuat kunci hanya bisa dipakai satu kali saja
- B. Mencegah byte mentah dari objek `CryptoKey` diekspor keluar melalui `crypto.subtle.exportKey()`, sehingga meskipun terjadi celah skrip, penyerang tidak dapat menyalin kunci mentah tersebut
- C. Mematikan kemampuan dekripsi pada kunci tersebut
- D. Menghapus kunci setiap 60 detik

**Jawaban Benar:** B
**Penjelasan:** Dengan `extractable: false`, objek `CryptoKey` tetap dapat digunakan untuk operasi `encrypt`/`decrypt` oleh `crypto.subtle`, tetapi materi kriptografi mentahnya dikunci di dalam penyimpanan internal peramban dan tidak dapat diekstrak dengan `exportKey()`.

## Sumber

- [Web Crypto API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [`SubtleCrypto` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto)
- [`Crypto.randomUUID()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)
