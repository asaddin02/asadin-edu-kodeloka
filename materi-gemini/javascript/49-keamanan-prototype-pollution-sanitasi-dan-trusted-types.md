# Keamanan Lanjutan: Pencegahan Prototype Pollution, Sanitasi HTML, dan Trusted Types API

- **Tingkat:** Lanjut
- **Ringkasan:** Membedah celah keamanan **Prototype Pollution** saat menggabungkan objek JSON dari pengguna (`__proto__`, `constructor.prototype`), mempertahankan aplikasi menggunakan `Object.create(null)` dan `Object.hasOwn()`, serta mengunci DOM sink berbahaya dengan **Trusted Types API**.

## Bagaimana Satu Payload JSON Dapat Meracuni Seluruh Objek di Aplikasi Anda?

Di JavaScript, hampir setiap objek biasa (`const obj = {}`) mewarisi properti dan metode dari satu objek induk bersama: **`Object.prototype`**. Ketika kode Anda memeriksa `if (user.isAdmin)`, dan properti `isAdmin` tidak ditemukan pada `user`, mesin JavaScript akan mencarinya naik ke atas rantai prototipe (`Object.prototype.isAdmin`).

Jika aplikasi Anda memiliki fungsi penggabung objek rekursif (*deep merge*), pengurai query string, atau penyalin properti yang menerima JSON dari pengguna seperti `{"__proto__": {"isAdmin": true}}` atau `{"constructor": {"prototype": {"isAdmin": true}}}`, lalu menyalinnya secara buta (`target[kunci] = sumber[kunci]`), maka **`Object.prototype.isAdmin` akan berubah menjadi `true` untuk SELURUH objek di dalam proses JavaScript tersebut!** Kerentanan berbahaya ini disebut **Prototype Pollution**.

> **⚠️ Jebakan Umum di Lapangan:** Fungsi penggabung objek rekursif (*deep merge*) yang tidak memfilter kunci `__proto__`, `prototype`, dan `constructor` memungkinkan penyerang menyuntikkan properti ke `Object.prototype` sehingga meracuni seluruh objek di aplikasi Anda!

## 1. Tiga Lapis Pertahanan Terhadap *Prototype Pollution* dan *DOM XSS*

Berdasarkan panduan [OWASP Prototype Pollution Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html), lindungi aplikasi Anda dengan primitif standar berikut:

| Ancaman Keamanan | Penyebab Celah | Pertahanan Standar di JavaScript Modern |
| :--- | :--- | :--- |
| **Injeksi Kunci Prototipe pada *Deep Merge*** | Menyalin kunci `__proto__`, `constructor`, `prototype`, atau membaca `target[kunci]` warisan tanpa cek kepemilikan. | Tolak kunci terlarang **dan** wajib periksa **`Object.hasOwn(target, kunci)`** sebelum membaca `target[kunci]`. |
| **Peta Kamus dari Input Pengguna** | Menggunakan objek biasa `{}` sebagai kamus kunci-nilai dinamis dari input pengguna. | Gunakan **`new Map()`** atau objek tanpa prototipe **`Object.create(null)`** (tidak mewarisi `Object.prototype` sama sekali!). |
| **Modifikasi Prototipe Global** | Pustaka pihak ketiga atau celah kode mengubah `Object.prototype`. | Bekukan prototipe bawaan saat startup dengan **`Object.freeze(Object.prototype)`**. |
| **DOM-Based XSS pada `innerHTML`** | Memasukkan string mentah ke *sink* berbahaya (`el.innerHTML`, `document.write`). | Gunakan **`el.textContent`**, dan kunci seluruh *DOM sink* dengan header CSP **Trusted Types API**. |

## 2. Fungsi *Deep Merge* yang Tahan Terhadap *Prototype Pollution*

Perhatikan detail keamanan sangat penting pada fungsi `gabungObjekAman` di bawah ini: selain memblokir `"__proto__"`, `"prototype"`, dan `"constructor"`, kita **wajib memeriksa `Object.hasOwn(target, kunci)`** sebelum membaca `target[kunci]`. Mengapa? Karena jika penyerang mengirim JSON `{"toString": {"polluted": true}}`, kunci `"toString"` tidak ada di daftar hitam, tetapi `target["toString"]` akan mengembalikan fungsi warisan `Object.prototype.toString` lalu memutasinya!

```javascript
const KUNCI_TERLARANG = new Set(["__proto__", "prototype", "constructor"]);

export function gabungObjekAman(target, sumber) {
  for (const kunci of Object.keys(sumber)) {
    if (KUNCI_TERLARANG.has(kunci)) continue;
    const nilai = sumber[kunci];
    if (nilai && typeof nilai === "object" && !Array.isArray(nilai)) {
      // Pakai hanya objek yang benar-benar milik target sendiri, bukan properti warisan prototipe
      const ada = Object.hasOwn(target, kunci) ? target[kunci] : undefined;
      const wadah = ada && typeof ada === "object" ? ada : Object.create(null);
      target[kunci] = gabungObjekAman(wadah, nilai);
    } else {
      target[kunci] = nilai;
    }
  }
  return target;
}
```

## 3. Mengunci `innerHTML` dengan Trusted Types API (`trustedTypes.createPolicy`)

Meskipun tim Anda sudah sepakat untuk menggunakan `textContent`, pada proyek besar sering kali ada pengembang atau pustaka yang tidak sengaja menulis `elemen.innerHTML = dataDariPengguna`. **Trusted Types API** (diaktifkan lewat header CSP `Content-Security-Policy: require-trusted-types-for 'script'`) memerintahkan peramban untuk **menolak semua string biasa pada `innerHTML`** dan melempar `TypeError`, kecuali string tersebut telah melewati kebijakan sanitasi resmi **`TrustedHTML`**:

```javascript
export function buatKebijakanHtmlAman() {
  if (typeof window === "undefined" || !window.trustedTypes) return null;

  return window.trustedTypes.createPolicy("kodeloka-html-aman", {
    createHTML(inputMentah) {
      // Hapus seluruh tag berbahaya atau escape karakter HTML
      return String(inputMentah)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    }
  });
}
```

## 4. Kesalahan Umum dan Cara Menghindarinya

1. **Menggunakan `kunci in target` alih-alih `Object.hasOwn(target, kunci)`:** Operator `in` (`"toString" in {}`) memeriksa seluruh rantai prototipe dan mengembalikan **`true`** untuk semua metode warisan `Object.prototype` (`toString`, `valueOf`, `hasOwnProperty`)! Selalu gunakan metode statis modern **`Object.hasOwn(obj, kunci)`** (*Baseline Widely Available*).
2. **Hanya memblokir kata `"__proto__"` pada fungsi *deep merge* tanpa memblokir `"constructor"` dan `"prototype"`:** Penyerang tetap dapat mencemari `Object.prototype` menggunakan jalur `{"constructor": {"prototype": {"isAdmin": true}}}` karena `obj.constructor.prototype === Object.prototype`!
3. **Menyangka `JSON.parse('{"__proto__": {"admin": true}}')` langsung mencemari `Object.prototype`:** `JSON.parse()` sendiri sebenarnya aman (ia hanya membuat properti bernama `"__proto__"` biasa). Pencemaran baru terjadi ketika hasil `JSON.parse()` tersebut diteruskan ke dalam fungsi *deep merge* atau *clone* rekursif yang tidak aman!

## Latihan Praktik Mandiri

1. Buat berkas `keamanan-objek.mjs` yang mengekspor fungsi `gabungObjekAman(target, sumber)` seperti pada contoh di atas.
2. Tulis pengujian keamanan otomatis menggunakan `node:test` dengan tiga serangan uji:
   - `JSON.parse('{"__proto__": {"tercemar": true}}')`
   - `JSON.parse('{"constructor": {"prototype": {"tercemar": true}}}')`
   - `JSON.parse('{"toString": {"tercemar": true}}')`
3. Verifikasi dengan `assert.strictEqual(({}).tercemar, undefined)` dan `assert.strictEqual(Object.prototype.toString.tercemar, undefined)` bahwa tidak ada satu pun pencemaran prototipe yang tembus.

## Kuis Pemahaman

### Soal 1
Mengapa di dalam fungsi *deep merge* rekursif, memfilter daftar hitam `["__proto__", "prototype", "constructor"]` saja belum cukup aman apabila Anda langsung membaca `const ada = target[kunci]` tanpa memeriksa `Object.hasOwn(target, kunci)`?
- A. Karena `Object.keys()` tidak dapat membaca string JSON
- B. Karena jika penyerang mengirimkan kunci nama properti warisan seperti `{"toString": {"polluted": true}}`, ekspresi `target["toString"]` akan mengambil fungsi warisan `Object.prototype.toString` lalu menambahkan properti `.polluted = true` langsung ke objek bawaan bersama tersebut
- C. Karena `Object.hasOwn()` otomatis mengenkripsi objek dengan AES
- D. Karena `target[kunci]` selalu melempar `SyntaxError`

**Jawaban Benar:** B
**Penjelasan:** Akses `target[kunci]` menelusuri rantai prototipe. Jika `kunci` adalah `"toString"` atau `"valueOf"`, `target[kunci]` mengembalikan fungsi milik `Object.prototype`. Memeriksa `Object.hasOwn(target, kunci)` memastikan kita hanya menggabungkan ke dalam properti milik `target` sendiri.

### Soal 2
Apa perbedaan hasil antara evaluasi `"toString" in {}` dan `Object.hasOwn({}, "toString")`?
- A. Keduanya mengembalikan `true`
- B. `"toString" in {}` mengembalikan **`true`** karena operator `in` ikut memeriksa properti yang diwarisi dari `Object.prototype`, sedangkan `Object.hasOwn({}, "toString")` mengembalikan **`false`** karena ia hanya memeriksa properti milik objek itu sendiri (*own property*)
- C. `"toString" in {}` mengembalikan `false`, sedangkan `Object.hasOwn({}, "toString")` mengembalikan `true`
- D. Keduanya mengembalikan `false`

**Jawaban Benar:** B
**Penjelasan:** Operator `in` menelusuri seluruh rantai prototipe, sementara `Object.hasOwn(obj, prop)` (pengganti modern untuk `Object.prototype.hasOwnProperty.call(obj, prop)`) hanya mengembalikan `true` jika properti tersebut didefinisikan langsung pada `obj`.

### Soal 3
Apa yang dilakukan oleh peramban ketika header CSP `Content-Security-Policy: require-trusted-types-for 'script'` diaktifkan pada halaman dan ada kode yang menulis `elemen.innerHTML = "<p>Halo</p>"` menggunakan string biasa?
- A. Peramban otomatis mengubah `<p>` menjadi `<div>`
- B. Peramban menolak penugasan string mentah tersebut ke *DOM XSS sink* `innerHTML` dan langsung melempar `TypeError`, karena `innerHTML` hanya mau menerima objek `TrustedHTML` yang dihasilkan oleh kebijakan `trustedTypes.createPolicy(...)`
- C. Peramban mematikan seluruh stylesheet CSS
- D. Peramban tetap merender string tersebut tanpa pemeriksaan

**Jawaban Benar:** B
**Penjelasan:** Trusted Types API mengunci seluruh *DOM XSS sinks* (seperti `innerHTML`, `outerHTML`, `document.write`, dan `script.src`) agar menolak string mentah dan hanya menerima objek bertipe yang telah melewati fungsi kebijakan sanitasi terpusat.

## Sumber

- [`Object.hasOwn()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)
- [`Object.create()` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
- [Trusted Types API — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API)
- [Prototype Pollution Prevention Cheat Sheet — OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html)
