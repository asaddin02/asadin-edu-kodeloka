# Metaprogramming dengan `Proxy` dan `Reflect`: Intersepsi Operasi Objek

- **Tingkat:** Lanjut
- **Ringkasan:** Mencegat dan menyesuaikan operasi fundamental pada objek (pembacaan properti `get`, penulisan `set`, validasi skema runtime, pencatatan akses, dan sistem reaktivitas bergaya Vue) menggunakan pasangan API **`Proxy`** dan **`Reflect`**.

## Mengapa `Proxy` dan `Reflect` Selalu Digunakan Berpasangan?

Objek **`Proxy`** memungkinkan Anda membungkus sebuah objek target dan memasang fungsi pencegat (*traps*) untuk hingga 13 operasi internal mesin JavaScript—mulai dari pembacaan properti (`get`), pengubahan nilai (`set`), pemeriksaan operator `in` (`has`), penghapusan `delete` (`deleteProperty`), hingga pemanggilan fungsi (`apply`). Mekanisme inilah yang menjadi fondasi sistem reaktivitas modern (seperti di Vue 3), validasi skema runtime, dan objek *mock* pengujian.

Sementara itu, objek bawaan **`Reflect`** menyediakan metode statis dengan nama dan tanda tangan parameter yang **identik satu-lawan-satu** dengan seluruh *trap* `Proxy`. Menggunakan `Reflect` di dalam *trap* `Proxy` memastikan perilaku bawaan operasi objek diteruskan secara akurat tanpa merusak pewarisan prototipe maupun konteks `this`.

> **⚠️ Jebakan Umum di Lapangan:** Di dalam trap `Proxy` (`get` atau `set`), mengakses `target[prop]` secara langsung alih-alih meneruskan `receiver` melalui `Reflect.get(target, prop, receiver)` akan merusak konteks `this` apabila target memiliki *getter* atau diwarisi oleh objek lain.

## 1. Daftar Trap `Proxy` Utama dan Padanan Metode `Reflect`

Berikut adalah *trap* `Proxy` yang paling sering digunakan dalam rekayasa aplikasi:

| Nama Trap Handler | Operasi yang Dicegat | Padanan `Reflect` untuk Perilaku Standar | Nilai Kembalian Wajib |
| :--- | :--- | :--- | :--- |
| **`get(target, prop, receiver)`** | Pembacaan `proxy.prop` atau `proxy[prop]` | `Reflect.get(target, prop, receiver)` | Nilai properti apa pun |
| **`set(target, prop, value, receiver)`** | Penulisan `proxy.prop = value` | `Reflect.set(target, prop, value, receiver)` | Boolean (`true` jika berhasil; `false` akan melempar `TypeError` di *strict mode*!) |
| **`has(target, prop)`** | Pemeriksaan `'prop' in proxy` | `Reflect.has(target, prop)` | Boolean (`true` / `false`) |
| **`deleteProperty(target, prop)`** | Penghapusan `delete proxy.prop` | `Reflect.deleteProperty(target, prop)` | Boolean (`true` / `false`) |
| **`apply(target, thisArg, argList)`** | Pemanggilan fungsi `proxy(...args)` | `Reflect.apply(target, thisArg, argList)` | Hasil pemanggilan fungsi |

## 2. Membangun State Reaktif dan Validasi Skema dengan `Proxy` + `Reflect`

Perhatikan bagaimana trap `set` di bawah ini memvalidasi perubahan nilai dan meneruskan parameter keempat `receiver` ke `Reflect.set()`:

```javascript
export function buatStateReaktif(dataAwal, onPerubahan) {
  return new Proxy(dataAwal, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, nilaiBaru, receiver) {
      const nilaiLama = Reflect.get(target, prop, receiver);
      const berhasil = Reflect.set(target, prop, nilaiBaru, receiver);
      if (berhasil && !Object.is(nilaiLama, nilaiBaru)) {
        onPerubahan(prop, nilaiBaru, nilaiLama);
      }
      return berhasil;
    }
  });
}

const state = buatStateReaktif({ skor: 0 }, (kunci, baru) => {
  console.log(`Properti ${String(kunci)} berubah menjadi ${baru}`);
});
state.skor = 10; // Mencetak: "Properti skor berubah menjadi 10"
```

### Mengapa Parameter `receiver` Sangat Penting?
Bayangkan `target` memiliki sebuah *getter* `get total() { return this.harga + this.pajak; }`, lalu objek lain `turunan` mewarisi `proxy` tersebut dan mendefinisikan `turunan.harga = 200`. Jika di dalam trap `get` Anda hanya menulis `return target[prop]`, maka `this` di dalam getter `total` akan menunjuk ke `target` lama, bukan ke `turunan`! Dengan menulis `return Reflect.get(target, prop, receiver)`, `receiver` (`turunan`) diteruskan sebagai konteks `this` ke getter tersebut secara akurat.

## 3. Validasi Skema Runtime dan `Proxy.revocable()`

Anda juga dapat menggunakan `Proxy` untuk menolak penulisan tipe data yang salah secara instan, atau menggunakan **`Proxy.revocable(target, handler)`** untuk mencabut akses ke sebuah objek setelah sesi berakhir:

```javascript
export function buatObjekTervalidasi(target, skemaValidator) {
  return new Proxy(target, {
    set(obj, prop, nilai, receiver) {
      const validator = skemaValidator[prop];
      if (validator && !validator(nilai)) {
        throw new TypeError(`Nilai tidak valid untuk properti "${String(prop)}": ${nilai}`);
      }
      return Reflect.set(obj, prop, nilai, receiver);
    }
  });
}

const pengguna = buatObjekTervalidasi(
  { nama: "Siti", umur: 22 },
  {
    nama: (v) => typeof v === "string" && v.trim().length >= 2,
    umur: (v) => Number.isInteger(v) && v >= 0 && v <= 150
  }
);
pengguna.umur = 25; // Berhasil
// pengguna.umur = -5; -> Melempar TypeError!
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Lupa mengembalikan `true` dari trap `set`:** Di dalam *strict mode* (termasuk seluruh modul ES), jika trap `set()` mengembalikan `false` atau `undefined` (karena Anda lupa menulis `return true` atau `return Reflect.set(...)`), mesin JavaScript akan langsung melempar `TypeError: 'set' on proxy: trap returned falsish`!
2. **Membungkus instans class yang menggunakan *Private Fields* (`#field`) atau objek bawaan (`Map`, `Set`, `Date`) dengan `Proxy`:** Metode internal `Map.prototype.get` dan properti privat `#field` memeriksa *internal slot* langsung pada `this`. Karena `this` di dalam metode yang dipanggil via `proxy.metode()` adalah objek `Proxy` (bukan `target` asli), akses `#field` akan melempar `TypeError: Cannot read private member` kecuali metode diikat ke `target` di dalam trap `get`.
3. **Memasang `Proxy` di dalam jalur komputasi panas (*hot loop*) jutaan kali per detik:** Intersepsi trap memiliki biaya tambahan dibandingkan akses properti langsung; gunakan `Proxy` untuk batas konfigurasi, state komponen UI, atau validasi masukan.

## Latihan Praktik Mandiri

1. Buat berkas `proxy-audit.mjs` yang mengekspor fungsi `buatKamusTanpaUndefined(objek)` menggunakan `Proxy`: setiap kali kode mencoba membaca properti yang tidak ada (`!(prop in target)`), lempar `ReferenceError` yang jelas alih-alih mengembalikan `undefined` secara diam-diam.
2. Tambahkan dukungan `Proxy.revocable()` pada fungsi `buatAksesSementara(data)` yang mengembalikan `{ proxy, cabutAkses }`.
3. Uji kedua fungsi tersebut menggunakan `node:test`.

## Kuis Pemahaman

### Soal 1
Mengapa di dalam trap `get(target, prop, receiver)` pada `Proxy`, Anda sangat disarankan memanggil `Reflect.get(target, prop, receiver)` alih-alih mengembalikan `target[prop]` secara langsung?
- A. Karena sintaks `target[prop]` dilarang di dalam fungsi `Proxy`
- B. Karena `Reflect.get(target, prop, receiver)` meneruskan `receiver` sebagai konteks `this` apabila `prop` adalah sebuah *getter*, sehingga pewarisan prototipe dan akses properti lain melalui `this` di dalam *getter* tetap mengacu pada `Proxy` atau objek turunannya
- C. Karena `Reflect.get()` otomatis mengubah semua nilai menjadi JSON
- D. Karena `target[prop]` selalu mengembalikan `null`

**Jawaban Benar:** B
**Penjelasan:** Tanpa meneruskan `receiver` ke `Reflect.get(target, prop, receiver)`, eksekusi *getter* pada `target` akan menggunakan `target` mentah sebagai `this`, sehingga melewati intersepsi `Proxy` atau merusak nilai properti pada objek turunan yang mewarisi `Proxy`.

### Soal 2
Apa yang terjadi di dalam modul ES (*strict mode*) apabila fungsi trap `set(target, prop, value, receiver)` pada `Proxy` mengubah `target[prop] = value`, tetapi lupa menulis pernyataan `return true` (sehingga mengembalikan `undefined`)?
- A. Nilai tetap tersimpan tanpa pesan apa pun
- B. Mesin JavaScript melempar `TypeError` karena di dalam *strict mode*, nilai kembalian *falsy* dari trap `set` dianggap sebagai kegagalan penulisan properti
- C. Properti `prop` otomatis dihapus dari `target`
- D. Objek `Proxy` otomatis berubah menjadi `Object.freeze()`

**Jawaban Benar:** B
**Penjelasan:** Spesifikasi ECMAScript menetapkan bahwa trap `set` wajib mengembalikan nilai boolean. Di *strict mode*, pengembalian nilai *falsy* (`false` atau `undefined`) dari trap `set` langsung memicu `TypeError`.

### Soal 3
Apa kegunaan dari metode statis `Proxy.revocable(target, handler)`?
- A. Membekukan `target` secara permanen seperti `Object.freeze()`
- B. Menciptakan objek `{ proxy, revoke }` di mana pemanggilan fungsi `revoke()` akan mematikan `proxy` tersebut secara permanen sehingga setiap akses properti berikutnya melempar `TypeError`
- C. Menyalin `target` ke dalam Web Worker
- D. Mengembalikan objek `target` asli dari sebuah `Proxy` sembarang

**Jawaban Benar:** B
**Penjelasan:** `Proxy.revocable()` digunakan ketika kita ingin menyerahkan akses objek sementara kepada kode pihak ketiga lalu mencabut aksesnya (`revoke()`) setelah operasi selesai; setelah dicabut, semua operasi pada `proxy` melempar `TypeError`.

## Sumber

- [`Proxy` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [`Reflect` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
- [TC39 ECMAScript® Language Specification](https://tc39.es/ecma262/)
