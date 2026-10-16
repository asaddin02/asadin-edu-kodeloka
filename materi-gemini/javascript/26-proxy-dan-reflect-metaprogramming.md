# Metaprogramming dengan `Proxy` dan `Reflect`: Intersepsi Operasi Objek

- **Tingkat:** Lanjut
- **Ringkasan:** Mencegat dan menyesuaikan operasi fundamental pada objek (pembacaan properti `get`, penulisan `set`, validasi skema runtime, pencatatan akses, dan sistem reaktivitas bergaya Vue) menggunakan pasangan API **`Proxy`** dan **`Reflect`**.

## Mengapa Topik Ini Penting di Produksi?

Dalam rekayasa perangkat lunak modern, penguasaan `new Proxy(target, { get(t, prop, rec) { return Reflect.get(t, prop, rec); } })` membedakan aplikasi web yang sekadar berjalan di komputer lokal dari aplikasi produksi yang tangguh, aman, hemat memori, dan siap melayani jutaan pengguna.

> **⚠️ Jebakan Umum di Lapangan:** Di dalam trap `Proxy` (`get` atau `set`), mengakses `target[prop]` secara langsung alih-alih meneruskan `receiver` melalui `Reflect.get(target, prop, receiver)` akan merusak konteks `this` apabila target memiliki *getter* atau diwarisi oleh objek lain.

## Konsep Inti dan Mekanisme di Balik Layar

Peramban modern dan mesin ECMAScript menyediakan primitif standar yang telah dioptimalkan di tingkat C++/Rust:

| Aspek Teknis | Pola Modern yang Direkomendasikan | Praktik Warisan yang Wajib Dihindari |
| :--- | :--- | :--- |
| **API / Sintaks Utama** | `new Proxy(target, { get(t, prop, rec) { return Reflect.get(t, prop, rec); } })` | Mengandalkan tebakan perilaku implisit atau pustaka eksternal usang |
| **Keamanan & Ketahanan** | Memvalidasi masukan, batas memori, dan penutupan sumber daya | Mengabaikan penanganan galat, pembatalan, atau pembersihan memori |
| **Kinerja Runtime** | Asinkron, malas (*lazy*), dan ramah *Main Thread* | Memblokir utas utama (*Long Tasks*) atau menyalin memori berulang |

## Implementasi Kode JavaScript Modern (ES2024–ES2026)

```javascript
function buatStateReaktif(dataAwal, onPerubahan) {
  return new Proxy(dataAwal, {
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
state.skor = 10;
```

> **💡 Tips Arsitektur:** Selalu bungkus utilitas infrastruktur seperti di atas ke dalam modul ES tersendiri (`utils/`) yang dilengkapi dengan pengujian unit otomatis (`node:test`) agar dapat digunakan kembali secara konsisten di seluruh proyek.

## Latihan Praktik Mandiri

1. Buat sebuah berkas modul ES baru untuk menguji pola `new Proxy(target, { get(t, prop, rec) { return Reflect.get(t, prop, rec); } })` pada kasus nyata di proyek Anda.
2. Tambahkan skenario uji batas (*edge case*): masukan kosong, karakter Unicode/emoji, pembatalan mendadak, atau kegagalan jaringan.
3. Jalankan dan verifikasi menggunakan *DevTools Console / Memory / Performance panel* atau `node --test`.

## Kuis Pemahaman

### Soal 1
Mengapa praktik berikut ini berbahaya di lingkungan produksi: *Di dalam trap `Proxy` (`get` atau `set`), mengakses `target[prop]` secara langsung alih-alih meneruskan `receiver` melalui `Reflect.get(target, prop, receiver)` akan merusak konteks `this` apabila target memiliki *getter* atau diwarisi oleh objek lain.*?
- A. Karena hanya berdampak pada ukuran berkas CSS eksternal
- B. Karena dapat memicu bug akurasi data, kebocoran memori, celah keamanan, atau penurunan kinerja antarmuka pada kondisi nyata Pengguna
- C. Karena fitur tersebut hanya berjalan pada peramban tahun 1999
- D. Karena JavaScript tidak mendukung fungsi asinkron

**Jawaban Benar:** B
**Penjelasan:** Di dalam trap `Proxy` (`get` atau `set`), mengakses `target[prop]` secara langsung alih-alih meneruskan `receiver` melalui `Reflect.get(target, prop, receiver)` akan merusak konteks `this` apabila target memiliki *getter* atau diwarisi oleh objek lain.

### Soal 2
Manakah pernyataan yang paling tepat mengenai penggunaan `new Proxy(target, { get(t, prop, rec) { return Reflect.get(t, prop, rec); } })` di JavaScript modern?
- A. Merupakan standar resmi ECMAScript / Web Platform API yang dirancang untuk menyelesaikan masalah secara aman, efisien, dan terukur tanpa peretasan manual
- B. Wajib dikompilasi menjadi kode PHP terlebih dahulu sebelum dijalankan di peramban
- C. Hanya dapat dipanggil dari dalam berkas stylesheet CSS
- D. Telah dihapus dari standar web modern

**Jawaban Benar:** A
**Penjelasan:** `new Proxy(target, { get(t, prop, rec) { return Reflect.get(t, prop, rec); } })` adalah bagian dari spesifikasi resmi ECMAScript (TC39) atau Web Platform API (WHATWG/W3C) yang didukung oleh peramban modern.

### Soal 3
Saat mengintegrasikan fitur "Metaprogramming dengan `Proxy` dan `Reflect`" ke dalam aplikasi produksi, langkah rekayasa manakah yang paling tepat?
- A. Mengabaikan semua potensi eksepsi agar kode terlihat lebih pendek
- B. Memeriksa dukungan fitur bila perlu (*feature detection*), menangani skenario kegagalan secara eksplisit, dan membersihkan sumber daya saat komponen dihancurkan
- C. Menyimpan seluruh data sensitif di variabel global `window`
- D. Mematikan mode ketat (*strict mode*) pada modul ES

**Jawaban Benar:** B
**Penjelasan:** Kode JavaScript kelas produksi wajib menerapkan *defensive programming*, deteksi kapabilitas platform bila menggunakan API perangkat, dan manajemen siklus hidup sumber daya yang rapi.

## Sumber

- [`Proxy` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [`Reflect` — MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
- [TC39 ECMAScript® Language Specification](https://tc39.es/ecma262/)
