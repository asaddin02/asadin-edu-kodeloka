# Pengujian Otomatis JavaScript dengan `node:test` dan `node:assert`

- **Tingkat:** Lanjut
- **Ringkasan:** Membangun jaring pengaman kualitas perangkat lunak dengan menulis *Unit Test* dan *Integration Test* menggunakan *test runner* bawaan `node:test` dan `node:assert/strict`, pola *Arrange-Act-Assert*, menguji kode asinkron/galat, serta memeriksa perilaku situs di peramban.

## Mengapa Pengujian Otomatis Membuat Pengembangan Lebih Cepat?

Menguji aplikasi hanya dengan mengklik-klik layar secara manual setiap kali Anda mengubah kode akan menjadi beban yang sangat lambat begitu fitur bertambah banyak. Dengan **pengujian otomatis (*automated tests*)**, Anda dapat memverifikasi ratusan skenario perhitungan, validasi, dan penanganan galat hanya dalam waktu kurang dari satu detik melalui perintah **`npm test`**.

Kabar terbaik di ekosistem JavaScript modern: sejak Node.js 18/20+, Anda **tidak perlu lagi menginstal pustaka pihak ketiga yang berat** hanya untuk menjalankan pengujian unit! Runtime Node.js sudah menyediakan modul bawaan **`node:test`** dan **`node:assert/strict`** (perhatikan bahwa repositori Kodeloka sendiri menggunakan `node --test` pada berkas `tests/site.test.mjs`!).

## 1. Struktur Pengujian dengan Pola *Arrange – Act – Assert (AAA)*

Setiap pengujian yang baik mengikuti tiga langkah sederhana:
1. **Arrange (Siapkan):** Siapkan data masukan dan kondisi awal.
2. **Act (Jalankan):** Panggil fungsi yang sedang diuji.
3. **Assert (Pastikan):** Periksa apakah hasil keluarannya sama persis dengan yang diharapkan menggunakan `node:assert/strict`.

Mari kita lihat contoh modul logika bisnis beserta berkas pengujiannya:

```js
// Berkas: ./kuis.js
export function hitungNilaiKuis(jawabanPengguna, kunciJawaban) {
  if (!Array.isArray(jawabanPengguna) || !Array.isArray(kunciJawaban)) {
    throw new TypeError("Jawaban dan kunci wajib berupa Array.");
  }
  if (kunciJawaban.length === 0) {
    throw new RangeError("Kunci jawaban tidak boleh kosong.");
  }

  let benar = 0;
  for (const [indeks, kunci] of kunciJawaban.entries()) {
    if (jawabanPengguna[indeks] === kunci) {
      benar++;
    }
  }

  const skor = Math.round((benar / kunciJawaban.length) * 100);
  return {
    benar,
    total: kunciJawaban.length,
    skor,
    lulus: skor >= 75
  };
}
```

Sekarang kita tulis berkas pengujiannya di `kuis.test.js`:

```js
// Berkas: ./kuis.test.js
// Jalankan langsung di terminal dengan perintah: node --test kuis.test.js
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hitungNilaiKuis } from "./kuis.js";

describe("hitungNilaiKuis()", () => {
  it("menghitung skor 100 dan status lulus saat semua jawaban benar", () => {
    // 1. Arrange
    const kunci = ["A", "B", "C", "D"];
    const jawaban = ["A", "B", "C", "D"];

    // 2. Act
    const hasil = hitungNilaiKuis(jawaban, kunci);

    // 3. Assert (deepEqual pada assert/strict memeriksa kesamaan isi objek secara ketat)
    assert.deepEqual(hasil, {
      benar: 4,
      total: 4,
      skor: 100,
      lulus: true
    });
  });

  it("menandai tidak lulus jika skor di bawah 75", () => {
    const hasil = hitungNilaiKuis(["A", "X", "X", "D"], ["A", "B", "C", "D"]);
    assert.equal(hasil.skor, 50);
    assert.equal(hasil.lulus, false);
  });

  it("melempar RangeError jika array kunci jawaban kosong", () => {
    // Menguji bahwa fungsi benar-benar melempar galat yang tepat!
    assert.throws(
      () => hitungNilaiKuis([], []),
      {
        name: "RangeError",
        message: /tidak boleh kosong/
      }
    );
  });
});
```

## 2. Metode Asersi Penting di `node:assert/strict`

Selalu impor dari **`"node:assert/strict"`** agar semua pemeriksaan menggunakan kesetaraan ketat (`===` / `Object.is`):

| Metode Asersi | Kegunaan |
|---|---|
| `assert.equal(aktual, ekspektasi)` | Memastikan dua nilai primitif (`number`, `string`, `boolean`) sama persis (`===`). |
| `assert.deepEqual(objAktual, objEkspektasi)` | Membandingkan kesamaan isi `Object`, `Array`, `Map`, atau `Set` secara rekursif. |
| `assert.ok(nilai)` | Memastikan nilai bernilai *truthy*. |
| `assert.match(teks, /regex/)` | Memastikan string cocok dengan ekspresi reguler. |
| `assert.throws(fn, detailGalat)` | Memastikan fungsi sinkron `fn` melempar galat yang sesuai. |
| `await assert.rejects(promiseAtauAsyncFn, detailGalat)` | Memastikan `Promise` atau fungsi `async` ditolak (*rejected*) dengan galat yang sesuai! |

## 3. Menguji Kode Asinkron dan *Mocking* dengan `t.mock`

Bagaimana cara menguji fungsi `async` yang memanggil `fetch()` tanpa harus bergantung pada koneksi internet sungguhan saat pengujian berjalan di server CI/CD?

Modul `node:test` menyediakan fitur **Mocking bawaan (`t.mock`)** untuk memalsukan fungsi atau melacak berapa kali sebuah fungsi dipanggil:

```js
import { test } from "node:test";
import assert from "node:assert/strict";

async function ambilJudulModul(id, fungsiFetch = globalThis.fetch) {
  const res = await fungsiFetch(`https://kodeloka.asadinedu.com/api/modul/${id}`);
  if (!res.ok) throw new Error(`Modul ${id} tidak ditemukan`);
  const data = await res.json();
  return data.judul;
}

test("ambilJudulModul() mengembalikan judul saat respons 200 OK", async (t) => {
  // Membuat fungsi fetch tiruan (mock) yang langsung membalas tanpa jaringan
  const fetchTiruan = t.mock.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => ({ id: 1, judul: "Cara Web Bekerja" })
  }));

  const judul = await ambilJudulModul(1, fetchTiruan);

  assert.equal(judul, "Cara Web Bekerja");
  assert.equal(fetchTiruan.mock.callCount(), 1);
});

test("ambilJudulModul() menolak Promise saat status 404", async (t) => {
  const fetchGagal = t.mock.fn(async () => ({ ok: false, status: 404 }));

  // Wajib menggunakan 'await assert.rejects(...)' untuk menguji kegagalan async!
  await assert.rejects(
    async () => await ambilJudulModul(999, fetchGagal),
    { message: "Modul 999 tidak ditemukan" }
  );
});
```

> **⚠️ Jebakan Pengujian Asinkron: Lupa Menulis `await` di Depan `assert.rejects()`!**
> `assert.rejects()` adalah fungsi asinkron yang mengembalikan sebuah `Promise`. Jika Anda lupa menulis **`await assert.rejects(...)`**, pengujian akan selesai sebelum Promise di dalamnya sempat diperiksa!

## Latihan Praktik: Menulis Suite Pengujian Lengkap untuk Modul Keranjang Belanja

Buatlah berkas `keranjang.js` dan `keranjang.test.js`, lalu jalankan dengan `node --test keranjang.test.js`:
1. Buat fungsi `hitungKeranjang(daftarItem)` yang menghitung total harga dari array `{ nama, harga, qty }` dan melempar `RangeError` jika ada `harga < 0` atau `qty <= 0`.
2. Tulis minimal 4 skenario pengujian menggunakan `describe` dan `it`: keranjang kosong menghasilkan `0`, keranjang normal menghasilkan total yang benar, item dengan `qty` negatif melempar `RangeError`, dan pengujian fungsi asinkron `simpanKeranjang()` menggunakan `t.mock.fn()`.

## Kuis Pemahaman

### Soal 1
Mengapa untuk memeriksa apakah dua buah array `[1, 2, 3]` dan `[1, 2, 3]` memiliki isi yang sama di dalam pengujian `node:assert/strict`, kita harus menggunakan `assert.deepEqual(arr1, arr2)` dan bukan `assert.equal(arr1, arr2)`?
- A. Karena `assert.equal()` hanya bisa membandingkan string.
- B. Karena `assert.equal()` memeriksa kesamaan referensi memori (`Object.is`), dan dua literal array terpisah `[1, 2, 3]` menempati alamat memori yang berbeda; sedangkan `assert.deepEqual()` memeriksa kesamaan isi elemen di dalam kedua array tersebut satu per satu.
- C. Karena `assert.deepEqual()` otomatis mengurutkan isi array terlebih dahulu.
- D. Karena `assert.equal()` sudah dihapus dari Node.js.

**Jawaban Benar:** B
**Penjelasan:** Di JavaScript, `[1, 2, 3] === [1, 2, 3]` bernilai `false` karena keduanya adalah dua instans objek array yang berbeda di memori. `assert.deepEqual()` menelusuri properti objek dan elemen array secara rekursif untuk memastikan nilainya identik.

### Soal 2
Metode asersi manakah dari `node:assert/strict` yang harus digunakan untuk memastikan bahwa sebuah fungsi **`async`** melempar galat (*rejects*) ketika diberikan argumen yang tidak valid?
- A. `assert.throws(() => fungsiAsync())`
- B. `await assert.rejects(async () => await fungsiAsync())`
- C. `assert.equal(fungsiAsync(), Error)`
- D. `assert.fail(fungsiAsync())`

**Jawaban Benar:** B
**Penjelasan:** `assert.throws()` hanya bekerja untuk fungsi sinkron. Karena fungsi `async` mengembalikan sebuah `Promise` yang ditolak (*rejected*), kita wajib menggunakan `await assert.rejects(...)` untuk menangkap dan memverifikasi penolakan Promise tersebut.

### Soal 3
Apa manfaat menyuntikkan dependensi seperti `fungsiFetch = globalThis.fetch` sebagai parameter pada fungsi yang akan diuji (*Dependency Injection*)?
- A. Membuat ukuran berkas JavaScript menjadi setengah lebih kecil.
- B. Memungkinkan kita mengganti `fetch` asli dengan fungsi tiruan (`t.mock.fn()`) saat menjalankan pengujian unit sehingga pengujian berjalan sangat cepat, deterministik, dan tidak bergantung pada ketersediaan server eksternal atau koneksi internet.
- C. Mematikan pemeriksaan CORS di peramban.
- D. Mengubah kode asinkron menjadi kode sinkron.

**Jawaban Benar:** B
**Penjelasan:** Dengan mengizinkan fungsi menerima dependensi eksternal sebagai parameter (dengan nilai bawaan `globalThis.fetch` untuk penggunaan produksi normal), pengujian unit dapat dengan mudah menyuplai fungsi *mock* tanpa perlu melakukan penyadapan jaringan yang rumit.

## Sumber
- [JavaScript Guide — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [ECMAScript Language Specification — TC39](https://tc39.es/ecma262/)
